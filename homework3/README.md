## Homework 3

#### by the snekclub
Qiyue Aixinjueluo, Jenna Berlinberg, Alvin Lai, Imani Martin, Brandon Golshirazian, and Jaren Rebuyon

#### 1. Errors

##### a.
`x+++-y`
No error.

##### b.
`x---+y`
No error.

##### c.
incrementing a read-only variable
This is a semantic error- access to modify variable not allowed.

##### d.
accessing a private field in another class
This is a semantic error- access to read variable not allowed.

##### e.
Using an uninitialized variable
This is a semantic error- variable must be declared.

##### f.
Dereferencing a null reference
This is not a compile time error- it is a runtime error (NullPointerException).

##### g.
`null instanceof C`
No error.

##### h.
`!!x`
No error.

#### 2. Scope

```
var x = 3;          // line 1
function f() {      // line 2
  print(x);         // line 3
  var x = x + 2;    // line 4
  print(x);         // line 5
}                   // line 6
f();                // line 7
```

##### a.
`3`
`5`
x is accessible in the whole program. dynamic scoping reword

##### b.
`undefined`
`NaN`
Scope is in the whole function. ** javascript using var

##### c.
`Error on line 3: x is not declared`
Scope starts at beginning of declaration ** javascript using let,

##### d.
`75354253672`
`75354253674`
The x outside the function and inside the function are separate entities.?

##### e.
`3`
`-23482937128`
Overloading with a keyword overwrites the global variable.?

##### f.
`Error on line 4: x used in its own declaration`
Scope starts after declaration is finished, but using occurrences of name are prohibited during declaration. (rewrite?)

#### 3. `private`
