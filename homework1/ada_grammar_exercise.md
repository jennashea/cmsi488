# Here are a few Ohm grammar rules from the Ada programming language:
* Exp     = Exp1 ("and" Exp1)* | Exp1 ("or" Exp1)*
* Exp1    = Exp2 (relop Exp2)?
* Exp2    = "-"? Exp3 (addop Exp3)*
* Exp3    = Exp4 (mulop Exp4)*
* Exp4    = Exp5 ("**"  Exp5)? | "not" Exp5 | "abs" Exp5
* comment = "--" (~"\n" any)* "\n"

### a.) What can you say about the relative precedences of and and or?

### b.) If possible, give an AST for the expression X and Y or Z. (Assume, of course, that an Exp5 can lead to identifiers and numbers, etc.) If this is not possible, prove that it is not possible.

### c.) What are the associativities of the additive operators? The relational operators?

### d.) Is the not operator right associative? Why or why not?

### e.) Why do you think the negation operator was given a lower precedence than multiplication?

### f.) Give an abstract syntax tree for the expression -8 * 5.

### g.) Suppose the grammar were changed by dropping the negation from Exp2 and adding - Exp5 to Exp4. Give the abstract syntax tree for the expression -8 * 5 according to the new grammar.
