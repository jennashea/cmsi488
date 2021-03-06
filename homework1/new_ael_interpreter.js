// An interpreter for Ael.
//
// Example usage:
//
//   $ node ael-interpreter.js 'print 2; x = 22; print 1 + x / 2;'
//   2
//   12


const ohm = require('ohm-js');

const aelGrammar = ohm.grammar(`Ael {
  Program = Block
  Block = (Statement ";")+
  Statement = id "=" Exp        --assign
            | print Exp         --print
            | while Exp "{" Block "}"
  Exp       = Exp "+" Term      --plus
            | Exp "-" Term      --minus
            | Term
  Term      = Term "*" Factor   --times
            | Term "/" Factor   --divide
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

const memory = new Map();

// This language is so simple, we don't need an AST.
const semantics = aelGrammar.createSemantics().addOperation('exec', {
  Program(ss, _semicolons) { ss.exec(); },
  Statement_assign(i, _eq, e) { memory.set(i.sourceString, e.eval()); },
  Statement_print(_, e) { console.log(e.eval()); },
}).addOperation('eval', {
  Exp_plus(e, _op, t) { return e.eval() + t.eval(); },
  Exp_minus(e, _op, t) { return e.eval() - t.eval(); },
  Term_times(t, _op, f) { return t.eval() * f.eval(); },
  Term_divide(t, _op, f) { return t.eval() / f.eval(); },
  Factor_negate(_op, p) { return -p.eval(); },
  Power_exponent(p, _op, po) { return p.eval() ** po.eval(); },
  Primary_parens(_open, e, _close) { return e.eval(); },
  number(_chars) { return +this.sourceString; },
  id(_firstChar, _restChars) { return memory.get(this.sourceString); },
});

const match = aelGrammar.match(process.argv[2]);
if (match.succeeded()) {
  semantics(match).exec();
} else {
  console.error(match.message);
  process.exitCode = 1;
}
