# Homework 3

## By the snekclub

Qiyue Aixinjueluo, Jenna Berlinberg, Alvin Lai, Imani Martin, Brandon Golshirazian, and Jared Rebuyon

### 1. Errors

#### (1a.)

`x+++-y`

No error.

#### (1b.)

`x---+y`

No error.

#### (1c.)

incrementing a read-only variable

This is a **semantic error** - access to modify variable not allowed.

#### (1d.)

accessing a private field in another class

This is a **semantic error** - access to read variable not allowed.

#### (1e.)

Using an uninitialized variable

This is a **semantic error** - variable must be declared.

#### (1f.)

Dereferencing a null reference

This is **not a compile time error** - it is a runtime error (NullPointerException).

#### (1g.)

`null instanceof C`

No error.

#### (1h.)

`!!x`

No error.

### 2. Scope

```javascript
var x = 3;          // line 1
function f() {      // line 2
  print(x);         // line 3
  var x = x + 2;    // line 4
  print(x);         // line 5
}                   // line 6
f();                // line 7
```

#### (2a.)

`3`
`5`

`x` is accessible in the whole program. Specifically, binding is tied to the most recently ecountered during execution. The redeclaration `var x = x + 2` is also treated as a reassignment of `x`.

#### (2b.)

`undefined`
`NaN`

Scope is in the whole function. ** javascript using var

#### (2c.)

`Error on line 3: x is not declared`

Scope starts at beginning of the function declaration and thus resolves to a compile-time error.

#### (2d.)

`75354253672`
`75354253674`

The `x` outside the function and inside the function are considered separate entities.`print(x)` in particular shadows `int x = 3`, causing the outer binding's identifier to have a hole in its scope. `75354253672` is the attempted resolution of the language to resolve `x`, which is then added with `2` to produce `75354253674`.

#### (2e.)

`3`
`-23482937128`

An outer scope ends after `print(x)`, meaning that the declaration `var x = x + 2` is the beginning of a new, inner scope. Like in C++, declaration of `x`, which had not been initialized in the scope, leads to an arbitrary value and thus `-23482937128`.

#### (2f.)

`Error on line 4: x used in its own declaration`

Scope starts after a declaration is finished, but using occurrences of the name are prohibited during declaration, with `var x  = x + 2` as the offending statement.

### 3. `private`

In Ruby, methods that are private are restricted to the calling object, such that an object instance's private methods cannot be directly accessed.

```Ruby
class Dog
  def initialize(name, color, age)
    @name = name
    @color = color
    @age = age
  end

  attr_reader :name, :color, :age
  public    :name, color
  private   :age

  def speak
    "My name is #{name} and my hair is #{color}."
  end

  def age
    "I am #{age} years old." # Produces a compile error, as private methods are not allowed to have an explicit receiver.
  end
  
fido = Dog.new("fido", "color", 22)

fido.age # Produces an error due to accessibility.
```

Furthermore, subclasses have access to private methods, and restricting access to a method from it subclasses is impossible.

The use of private in C# follows that private methods can only be used within the class in which it is declared.

```C#
class Example {
  public string world() {
    return "world";
  }

  private string hello() {
    return "hello";
  }
}
class Print {
  static void Main() {
    Example example  = new Example();

    Console.WriteLane(example.hello()); // Generates an error
    Console.WriteLane(example.world()); // Will return world
  }
}

```

 The use of the private keyword allowd a class to hide its member variables and functions from being used by other objects and within other fuctions. An instance of a class cannot access members with the private specifier; rather, only functions of the same class have access.
