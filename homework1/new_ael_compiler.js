// A compiler for Ael.
//
// Example usage:
//
//   $ node new_ael_compiler.js -C 'print 42;'
//   $ node new_ael_compiler.js -JavaScript 'print 42;'
//   $ node new_ael_compiler.js -Stack 'print 42;'

const ohm = require('ohm-js');

// -----------------------------------------------------------------------------
// GRAMMAR
//
// We just specify it as a string and give it to Ohm.
// -----------------------------------------------------------------------------

const aelGrammar = ohm.grammar(`Ael {
  Program = (Statement ";")+
  Block = (Statement ";")+
  Statement = id "=" Exp        --assign
            | print Exp         --print
            | "while" Exp "{" Block "}"        --while
  Exp       = Exp ("+" | "-") Term     --binary
            | Term
  Term      = Term ("*"| "/") Factor   --binary
            | Factor
  Factor    = "-" Power         --negate
            | Power
  Power     = Primary "^" Power --exponent
            | Primary
  Primary   = "(" Exp ")"       --parens
            | number
            | id
  number    = digit+
  print     = "print" ~alnum
  id        = ~print letter alnum*
}`);

// -----------------------------------------------------------------------------
// ABSTRACT SYNTAX TREE DEFINITION
//
// One class for each kind of AST Node. All we need here are constructors.
// Other phases of the compiler will add methods later.
// -----------------------------------------------------------------------------

class Program {
  constructor(body) {
    this.body = body;
  }
}
class Block {
  constructor(line) {
    this.line = line;
  }
}
class Assignment {
  constructor(id, expression) {
    Object.assign(this, { id, expression });
  }
}

class PrintStatement {
  constructor(expression) {
    this.expression = expression;
  }
}

class WhileStatement{
  constructor(expression, block){
    Object.assign(this, {expression, block});
  }
}

class BinaryExp {
  constructor(left, op, right) {
    Object.assign(this, { left, op, right });
  }
}

class UnaryExp {
  constructor(op, operand) {
    Object.assign(this, { op, operand });
  }
}

class NumericLiteral {
  constructor(value) {
    this.value = value;
  }
}

class Identifier {
  constructor(value) {
    this.value = value;
  }
}

// -----------------------------------------------------------------------------
// PARSER
//
// Generates the AST. First we have a processor in Ohm so that Ohm can do things
// while it "matches" the source string to the grammar. The processor here is an
// "AST Builder" whose operation is called ast. Then, for fun, I added a parse
// function which hides the use of Ohm from the rest of the compiler.
// -----------------------------------------------------------------------------

const astBuilder = aelGrammar.createSemantics().addOperation('ast', {
  Program(body, _semicolons) { return new Block(body.ast()); },
  Block(line, _semicolons) { return new Block(line.ast()); },
  Statement_assign(id, _, expression) { return new Assignment(id.sourceString, expression.ast()); },
  Statement_print(_, expression) { return new PrintStatement(expression.ast()); },
  Statement_while(_1, expression, _2, block, _3) { return new WhileStatement(expression.ast(), block.ast()); },
  Exp_binary(left, op, right) { return new BinaryExp(left.ast(), op.sourceString, right.ast()); },
  Term_binary(left, op, right) { return new BinaryExp(left.ast(), op.sourceString, right.ast()); },
  Factor_negate(_op, operand) { return new UnaryExp('-', operand.ast()); },
  Power_exponent(left, op, right) { return new BinaryExp(left.ast(), '**', right.ast()); },
  Primary_parens(_open, expression, _close) { return expression.ast(); },
  number(_chars) { return new NumericLiteral(+this.sourceString); },
  id(_firstChar, _restChars) { return new Identifier(this.sourceString); },
});

function parse(sourceCode) {
  const match = aelGrammar.match(sourceCode);
  if (!match.succeeded()) {
    throw new Error(match.message);
  }
  return astBuilder(match).ast();
}

// -----------------------------------------------------------------------------
// STATIC SEMANTIC CHECKER
//
// Static semantic checking is the phase of compilation invoked right after the
// AST is made. It traverses the AST looking for errors that are too hard to
// put into the grammar. All that is needed in Ael is to check for uses of
// identifiers that have not been previously assigned to. So our "context" is
// nothing more than a set of identifiers! In a more realistic language, the
// context would be much more complex.
//
// To use, simply invoke the check() method on the root node of the AST. That's
// it. This method will return the AST, so you can chain your calls:
//
//     parse(source).check().gen()
// -----------------------------------------------------------------------------

Object.assign(Program.prototype, {
  check() { const context = new Set(); this.body.forEach(s => s.check(context)); return this; },
});
Object.assign(Block.prototype, {
  check() { const context = new Set(); this.line.forEach(s => s.check(context)); return this;},
});
Object.assign(Assignment.prototype, {
  check(context) { this.expression.check(context); context.add(this.id); },
});
Object.assign(PrintStatement.prototype, {
  check(context) { this.expression.check(context); },
});
Object.assign(WhileStatement.prototype, {
  check(context) { this.expression.check(context); this.block.check(context); },
});
Object.assign(BinaryExp.prototype, {
  check(context) { this.left.check(context); this.right.check(context); },
});
Object.assign(UnaryExp.prototype, {
  check(context) { this.operand.check(context); },
});
Object.assign(NumericLiteral.prototype, {
  check() { /* Always fine */ },
});
Object.assign(Identifier.prototype, {
  check(context) {
    if (!context.has(this.value)) {
      throw new Error(`Identifier ${this.value} has not been declared`);
    }
  },
});

// -----------------------------------------------------------------------------
// CODE GENERATOR(S)
//
// There are three different code generators here because this whole program
// is one big educational script, designed to be not only an intro to Ohm for
// compiler writing, but also to show off some concerns in compiler writing,
// like retargetability.
// -----------------------------------------------------------------------------

const generators = {};

generators.javascript = () => {
  Object.assign(Program.prototype, {
    gen() { return this.body.map(s => s.gen()).join('\n'); },
  });
  Object.assign(Block.prototype, {
    gen() { return this.line.map(s => s.gen()).join('\n'); },
  });
  Object.assign(Assignment.prototype, {
    gen() { return `let ${this.id} = ${this.expression.gen()};`; },
  });
  Object.assign(PrintStatement.prototype, {
    gen() { return `console.log(${this.expression.gen()});`; },
  });
  Object.assign(WhileStatement.prototype, {
    gen() { return `while (${this.expression.gen()}) {${this.block.gen()}}`; },
  });
  Object.assign(BinaryExp.prototype, {
    gen() { return `(${this.left.gen()} ${this.op} ${this.right.gen()})`; },
  });
  Object.assign(UnaryExp.prototype, {
    gen() { return `(${this.op} ${this.operand.gen()})`; },
  });
  Object.assign(NumericLiteral.prototype, {
    gen() { return this.value; },
  });
  Object.assign(Identifier.prototype, {
    gen() { return this.value; },
  });
};

generators.c = () => {
  generators.javascript();
  Object.assign(Program.prototype, {
    gen() {
      let header = this.body.filter(s => s.gen().includes('pow')).length > 0 ? '#include <stdio.h>\n#include <math.h>' : '#include <stdio.h>'
      return `${header}
int main() {
    ${this.body.map(s => s.gen()).join('\n    ')}
    return 0;
}`;
    },
  });
  Object.assign(Block.prototype, {
    gen() { return this.line.map(s => s.gen()).join('\n'); },
  });
  Object.assign(WhileStatement.prototype, {
    gen() { return `while (${this.expression.gen()}) { ${this.block.gen()} }`; },
  });
  Object.assign(Assignment.prototype, {
    gen() { return `int ${this.id} = ${this.expression.gen()};`; },
  });
  Object.assign(PrintStatement.prototype, {
    gen() { return `printf("%d\\n", ${this.expression.gen()});`; },
  });
  Object.assign(BinaryExp.prototype, {
    gen() {

      return this.op == '**' ? `pow(${this.left.gen()}, ${this.right.gen()})` : `(${this.left.gen()} ${this.op} ${this.right.gen()})`;
    },
  });
};

generators.stack = () => {
  const ops = { '+': 'ADD', '-': 'SUB', '*': 'MUL', '/': 'DIV', '**': 'EXP' };

  const instructions = [];
  function emit(instruction) { instructions.push(instruction); }

  Object.assign(Program.prototype, {
    gen() { this.body.forEach(s => s.gen()); return instructions.join('\n'); },
  });
  Object.assign(Assignment.prototype, {
    gen() { this.expression.gen(); emit(`STORE ${this.id}`); },
  });
  Object.assign(PrintStatement.prototype, {
    gen() { this.expression.gen(); emit('OUTPUT'); },
  });
  Object.assign(BinaryExp.prototype, {
    gen() { this.left.gen(); this.right.gen(); emit(ops[this.op]); },
  });
  Object.assign(UnaryExp.prototype, {
    gen() { this.operand.gen(); emit('NEG'); },
  });
  Object.assign(NumericLiteral.prototype, {
    gen() { emit(`PUSH ${this.value}`); },
  });
  Object.assign(Identifier.prototype, {
    gen() { emit(`LOAD ${this.value}`); },
  });
};

// -----------------------------------------------------------------------------
// RUNNING THE COMPILER ON THE COMMAND LINE
// -----------------------------------------------------------------------------

if (process.argv.length !== 4 || !['-C', '-JavaScript', '-Stack'].includes(process.argv[2])) {
  console.error('Syntax: node ael-compiler.js -<C|JavaScript|Stack> program');
  process.exitCode = 1;
} else {
  try {
    generators[process.argv[2].substring(1).toLowerCase()]();
    console.log(parse(process.argv[3]).check().gen());
  } catch (e) {
    console.error(e.message);
    process.exitCode = 2;
  }
}
