/* CS2 · Inheritance and Polymorphism: quick checks under the slides (1-2 per slide) and more part-quiz questions. */
addChecks({
  course: 'cs2', lesson: '04-inheritance-and-polymorphism',
  slides: {
    1: [
      { q: 'What is inheritance?', options: ['Defining a new class from an existing class', 'Copying an object', 'Calling a method twice'], answer: 0, why: 'A subclass extends a superclass and adds more.' }
    ],
    2: [
      { type: 'tf', q: 'This unit covers the ArrayList class.', answer: true, why: 'It is in the outline of slide 2.' }
    ],
    3: [
      { type: 'match', q: 'Match each name with its role.', pairs: [['Superclass', 'Parent class, base class'], ['Subclass', 'Child class, extended class, derived class']], why: 'Slide 3.' },
      { type: 'tf', q: 'A subclass inherits the accessible data fields and methods of its superclass.', answer: true, why: 'And it may add new ones.' }
    ],
    4: [
      { q: 'Which properties belong in GeometricObject?', options: ['Color and filled, because all shapes have them', 'Radius, because circles have it', 'Width and height'], answer: 0, why: 'Common parts go up into the superclass.' }
    ],
    5: [
      { q: 'In UML, which way does the inheritance arrow point?', options: ['From the subclass to the superclass', 'From the superclass to the subclass', 'Both ways'], answer: 0, why: 'An empty triangle head at the superclass.' }
    ],
    6: [
      { type: 'output', q: 'What does this print?', code: 'GeometricObject g = new GeometricObject("red", true);\nSystem.out.println(g.getColor() + " " + g.isFilled());', answer: 'red true', why: 'The second constructor sets color and filled.' }
    ],
    7: [
      { type: 'trace', q: 'Circle c = new Circle(1.5, "green", true); What does each call return?', cols: ['call', 'returns'], rows: [['c.getRadius()', '?1.5'], ['c.getDiameter()', '?3.0'], ['c.getColor()', '?green'], ['c.isFilled()', '?true']], why: 'getColor and isFilled are inherited from GeometricObject.' },
      { type: 'write', q: 'Write the first line of a class Square that extends GeometricObject. End it with {.', checks: [{ re: /public\s+class\s+Square\s+extends\s+GeometricObject\s*\{/, label: 'public class Square extends GeometricObject {' }], solution: 'public class Square extends GeometricObject {', why: 'extends makes Square a subclass.' }
    ],
    8: [
      { type: 'bug', q: 'This Circle method does not compile. Tap the wrong line.', code: 'public class Circle extends GeometricObject {\n  private double radius = 1.0;\n  public void paint() {\n    color = "blue";\n  }\n}', answer: 4, why: 'color is private in GeometricObject. Use setColor("blue").' }
    ],
    9: [
      { type: 'output', q: 'What does this print?', code: 'Rectangle r = new Rectangle(3, 4);\nSystem.out.println(r.getArea() + " " + r.getPerimeter());', answer: '12.0 14.0', why: '3 x 4 = 12 and 2 x (3 + 4) = 14.' },
      { type: 'output', q: 'What does Rectangle’s toString of slide 9 return for new Rectangle(2, 5)?', code: 'System.out.println(new Rectangle(2, 5).toString());', answer: 'Rectangle: width = 2.0height = 5.0', why: 'The slide’s toString has no space before “height”.' }
    ],
    10: [
      { type: 'output', q: 'What do the first lines of TestCircleRectangle print?', code: 'Circle circle = new Circle(2.0);\nSystem.out.println(circle.toString());\nSystem.out.println("Color is " + circle.getColor());\nSystem.out.println("Filled is " + circle.isFilled());\nSystem.out.println("Diameter is " + circle.getDiameter());', answer: 'Circle: radius = 2.0\nColor is white\nFilled is false\nDiameter is 4.0', why: 'The default color is white and filled is false.' }
    ],
    11: [
      { q: 'What comes next in the outline?', options: ['The superclass constructor and the keyword super', 'The ArrayList class', 'Polymorphism'], answer: 0, why: 'Then overriding.' }
    ],
    12: [
      { q: 'A constructor calls neither this(…) nor super(…). What does the compiler put first?', options: ['super();', 'this();', 'return;'], answer: 0, why: 'The superclass part is built first.' }
    ],
    13: [
      { type: 'match', q: 'Match each use of super with an example.', pairs: [['Call a superclass constructor', 'super(color, filled);'], ['Call a superclass method', 'super.toString()']], why: 'Slide 13.' }
    ],
    14: [
      { type: 'bug', q: 'This constructor does not compile. Tap the wrong line.', code: 'public Circle(double radius, String color, boolean filled) {\n  this.radius = radius;\n  super(color, filled);\n}', answer: 3, why: 'The statement with super must be the first one in the constructor.' }
    ],
    15: [
      { type: 'tf', q: 'Creating a Faculty object runs the constructors of Employee and Person too.', answer: true, why: 'This is constructor chaining.' }
    ],
    16: [
      { q: 'What does main do in slide 16?', options: ['new Faculty();', 'new Person();', 'It prints line (4) first'], answer: 0, why: 'It creates a Faculty object.' }
    ],
    17: [
      { q: 'What runs first inside Faculty()?', options: ['The hidden super();', 'The println of line (4)', 'main'], answer: 0, why: 'Faculty() has no this(…) or super(…), so the compiler adds super();' }
    ],
    18: [
      { type: 'tf', q: 'Employee() starts with this(…), so it has no hidden super(); of its own.', answer: true, why: 'A constructor calls this(…) or super(…), not both.' }
    ],
    19: [
      { q: 'Which constructor has the hidden super(); in the Employee class?', options: ['Employee(String s)', 'Employee()', 'Neither'], answer: 0, why: 'It calls neither this nor super, so super(); is added.' }
    ],
    20: [
      { q: 'What is above Person in the chain?', options: ['Object', 'Employee', 'Nothing at all'], answer: 0, why: 'Every class extends Object.' }
    ],
    21: [
      { type: 'output', q: 'What is the first line printed?', code: 'new Faculty();', answer: '(1) Performs Person\'s tasks', why: 'The top of the chain prints first.' }
    ],
    22: [
      { type: 'output', q: 'What is the second line printed?', code: 'public Employee(String s) {\n  System.out.println(s);\n}', answer: '(2) Invoke Employee\'s overloaded constructor', why: 'Employee() passed this text to Employee(String s).' }
    ],
    23: [
      { type: 'tf', q: 'After Employee(String) returns, Employee() prints line (3).', answer: true, why: 'It can finish its own body.' }
    ],
    24: [
      { type: 'output', q: 'Without the this(…) line in Employee(), what would new Faculty() print?', code: 'class Employee extends Person {\n  public Employee() {\n    System.out.println("(3) Performs Employee\'s tasks ");\n  }\n}', answer: '(1) Performs Person\'s tasks\n(3) Performs Employee\'s tasks\n(4) Performs Faculty\'s tasks', why: 'The chain still goes up first: Person, then Employee, then Faculty.' }
    ],
    25: [
      { type: 'write', q: 'Fix Apple: write its constructor so it calls Fruit(String name) with "Apple".', rows: 3, checks: [{ re: /public\s+Apple\s*\(\s*\)\s*\{/, label: 'public Apple() {' }, { re: /super\s*\(\s*"Apple"\s*\)\s*;/, label: 'super("Apple");' }], solution: 'public Apple() {\n  super("Apple");\n}', why: 'Then the compiler does not add super(); and needs no Fruit().' }
    ],
    26: [
      { type: 'fill', q: 'Call the superclass method getDateCreated with super.', code: 'System.out.println(___.getDateCreated());', answer: ['super'], why: 'super.method(arguments).' }
    ],
    27: [
      { q: 'What comes next in the outline?', options: ['Overriding methods in the superclass', 'Casting objects', 'Visibility modifiers'], answer: 0, why: 'Then the Object class.' }
    ],
    28: [
      { type: 'output', q: 'With the toString of slide 28, what does this print?', code: 'public String toString() {\n  return super.toString() + "\\nradius is " + radius;\n}\n// GeometricObject.toString() returned "Geometric"\n// radius is 4.0', answer: 'Geometric\nradius is 4.0', why: 'super.toString() runs the superclass version, then the circle adds its own line.' }
    ],
    29: [
      { type: 'tf', q: 'A static method can be overridden.', answer: false, why: 'A static method can be inherited, but redefining it only hides the superclass method.' }
    ],
    30: [
      { type: 'output', q: 'TestOverriding of slide 30: what does this print?', code: 'A a = new A();\na.p(10);\na.p(10.0);\n// class B:            p(double i) prints i * 2\n// class A extends B:  p(double i) prints i', answer: '10.0\n10.0', why: 'A overrides p(double). 10 becomes 10.0, and A’s version prints i.' },
      { type: 'match', q: 'Match each word with its meaning.', pairs: [['Overriding', 'Same signature in a subclass, replaces the method'], ['Overloading', 'Same name, different parameter lists']], why: 'Slide 30.' }
    ],
    31: [
      { q: 'What is the superclass of String?', options: ['Object', 'StringBuilder', 'It has none'], answer: 0, why: 'Every class descends from java.lang.Object.' }
    ],
    32: [
      { type: 'write', q: 'Override toString in a class Dog with a String field name, so it returns "Dog: " + name.', rows: 3, checks: [{ re: /public\s+String\s+toString\s*\(\s*\)/, label: 'public String toString()' }, { re: /return\s+"Dog: "\s*\+\s*name\s*;/, label: 'return "Dog: " + name;' }], solution: 'public String toString() {\n  return "Dog: " + name;\n}', why: 'Override it to return a readable string instead of Dog@15037e5.' }
    ],
    33: [
      { q: 'What comes next in the outline?', options: ['Polymorphism and dynamic binding', 'The final modifier', 'Constructors'], answer: 0, why: 'Then casting.' }
    ],
    34: [
      { q: 'displayObject(new Rectangle(1, 1, "black", true)); Which color does it print?', options: ['black', 'white', 'red'], answer: 0, why: 'displayObject takes any GeometricObject; this one is a black Rectangle.' }
    ],
    35: [
      { type: 'output', q: 'With the classes of slide 35, what does main print?', code: 'm(new GraduateStudent());\nm(new Student());', answer: 'Graduate Student\nStudent', why: 'Dynamic binding: each object’s own toString runs.' }
    ],
    36: [
      { type: 'order', q: 'o is a GraduateStudent. Put the classes in the order the JVM searches for toString.', lines: ['GraduateStudent', 'Student', 'Object'], why: 'From the most special class up to Object; the first one found is used.' }
    ],
    37: [
      { type: 'match', q: 'Match each job with when it happens.', pairs: [['Matching the method signature', 'At compile time, by the compiler'], ['Binding the implementation', 'At run time, by the JVM']], why: 'Slide 37.' }
    ],
    38: [
      { q: 'What comes next in the outline?', options: ['Casting objects and the instanceof operator', 'ArrayList', 'super'], answer: 0, why: 'Then the equals method.' }
    ],
    39: [
      { type: 'bug', q: 'One line does not compile. Tap it.', code: 'Object o = new Student();\nStudent b = o;\nStudent c = (Student) o;', answer: 2, why: 'Downcasting needs the explicit cast (Student).' }
    ],
    40: [
      { type: 'match', q: 'Match each cast with its kind.', pairs: [['Object o = new Circle();', 'Upcasting: implicit'], ['Circle c = (Circle) o;', 'Downcasting: explicit']], why: 'Up is automatic; down needs the cast notation.' },
      { type: 'tf', q: 'Casting a Rectangle object to Circle gives a ClassCastException at run time.', answer: true, why: 'The object is not an instance of Circle. Test with instanceof first.' }
    ],
    41: [
      { type: 'output', q: 'What does displayObject print?', code: 'Object object2 = new Rectangle(2, 3);\ndisplayObject(object2);', answer: 'The rectangle area is 6.0', why: 'object2 is a Rectangle, so the second branch casts and calls getArea.' }
    ],
    42: [
      { type: 'output', q: 'What does this print? (Circle does not override equals.)', code: 'Circle a = new Circle(5);\nCircle b = a;\nSystem.out.println(a.equals(b));', answer: 'true', why: 'The default equals is this == obj, and a and b are the same object.' }
    ],
    43: [
      { type: 'bug', q: 'This method does not override equals. Tap the wrong line.', code: '@Override\npublic boolean equals(Circle c) {\n  return radius == c.radius;\n}', answer: 2, why: 'The parameter must be Object: equals(Object o). With Circle it is an overload, and @Override gives an error.' }
    ],
    44: [
      { type: 'output', q: 'What does this print?', code: 'String a = new String("cs");\nString b = new String("cs");\nSystem.out.println((a == b) + " " + a.equals(b) + " " + (a == a));', answer: 'false true true', why: '== checks the same object; equals checks the same content.' }
    ],
    45: [
      { q: 'What comes next in the outline?', options: ['The ArrayList class', 'Polymorphism', 'Overriding'], answer: 0, why: 'Then visibility modifiers.' }
    ],
    46: [
      { q: 'Why use an ArrayList instead of an array?', options: ['Its size can grow and shrink', 'It is always faster', 'It can hold only numbers'], answer: 0, why: 'An array’s size is fixed once it is created.' }
    ],
    47: [
      { type: 'write', q: 'Create an ArrayList of Integer named numbers.', checks: [{ re: /ArrayList\s*<\s*Integer\s*>\s*numbers\s*=\s*new\s+ArrayList\s*<\s*(Integer)?\s*>\s*\(\s*\)\s*;/, label: 'ArrayList<Integer> numbers = new ArrayList<>();' }], solution: 'ArrayList<Integer> numbers = new ArrayList<>();', why: 'The generic type must be a class: Integer, not int.' }
    ],
    48: [
      { type: 'trace', q: 'cityList is [London, Denver, Paris, Miami, Tokyo]. What does each call return?', cols: ['call', 'returns'], rows: [['cityList.size()', '?5'], ['cityList.contains("Miami")', '?true'], ['cityList.indexOf("Denver")', '?1'], ['cityList.isEmpty()', '?false']], why: 'Indexes start at 0, so Denver is at 1.' }
    ],
    49: [
      { type: 'trace', q: 'Follow slide 49. What is cityList after each line?', cols: ['line', 'cityList'], rows: [['cityList.add(2, "Xian");', '?[London, Denver, Xian, Paris, Miami, Tokyo]|London, Denver, Xian, Paris, Miami, Tokyo'], ['cityList.remove("Miami");', '?[London, Denver, Xian, Paris, Tokyo]|London, Denver, Xian, Paris, Tokyo'], ['cityList.remove(1);', '?[London, Xian, Paris, Tokyo]|London, Xian, Paris, Tokyo']], why: 'add(index, x) inserts; remove(Object) removes that element; remove(int) removes at that index.' },
      { type: 'output', q: 'What does the reverse loop print?', code: '// cityList is [London, Xian, Paris, Tokyo]\nfor (int i = cityList.size() - 1; i >= 0; i--)\n  System.out.print(cityList.get(i) + " ");', answer: 'Tokyo Paris Xian London', why: 'From the last index down to 0.' }
    ],
    50: [
      { type: 'match', q: 'Match each array operation with the ArrayList way.', pairs: [['a[index]', 'list.get(index)'], ['a[index] = "London";', 'list.set(index, "London");'], ['a.length', 'list.size()']], why: 'Slide 50.' }
    ],
    51: [
      { type: 'output', q: 'DistinctNumbers reads 3 5 3 7 5 0. What does the last loop print?', code: 'for (int i = 0; i < list.size(); i++)\n  System.out.print(list.get(i) + " ");', answer: '3 5 7', why: 'Each number is added only the first time; 0 ends the input.' }
    ],
    52: [
      { type: 'tf', q: 'MyStack needs a capacity, like StackOfIntegers.', answer: false, why: 'The ArrayList grows by itself.' }
    ],
    53: [
      { type: 'output', q: 'What does this print?', code: 'MyStack s = new MyStack();\ns.push("a"); s.push("b"); s.push("c");\nObject top = s.pop();\nSystem.out.println(top + " " + s);', answer: 'c stack: [a, b]', why: 'pop removes the last element; toString shows "stack: " and the list.' }
    ],
    54: [
      { q: 'What comes next in the outline?', options: ['Visibility (or accessibility) modifiers', 'The ArrayList class', 'Inheritance'], answer: 0, why: 'The last topic: protected and final.' }
    ],
    55: [
      { type: 'order', q: 'Put the modifiers in order of visibility, from the least to the most.', lines: ['private', 'default (no modifier)', 'protected', 'public'], why: 'Slide 55.' }
    ],
    56: [
      { type: 'trace', q: 'Fill in the table of slide 56 for a subclass in a different package. Can it access the member?', cols: ['modifier', 'allowed?'], rows: [['public', '?yes'], ['protected', '?yes'], ['default (no modifier)', '?no'], ['private', '?no']], why: 'protected adds the subclasses in other packages.' }
    ],
    57: [
      { type: 'trace', q: 'C5 is in package p2 and is NOT a subclass of C1. Can it use each member of a C1 object?', cols: ['member', 'allowed?'], rows: [['x (public)', '?yes'], ['y (protected)', '?no'], ['z (no modifier)', '?no'], ['u (private)', '?no']], why: 'A non-subclass in another package can use only public members.' }
    ],
    58: [
      { type: 'tf', q: 'A subclass can override a protected method and make it public.', answer: true, why: 'An overriding method may be more open, never less.' },
      { type: 'tf', q: 'A class can be declared private.', answer: false, why: 'private and protected can be used only for members, not for the class itself.' }
    ],
    59: [
      { type: 'bug', q: 'One line does not compile. Tap it.', code: 'public final class A { }\nclass B { public final void m() { } }\nclass C extends A { }', answer: 3, why: 'A is final, so it cannot be extended.' }
    ],
    60: [
      { type: 'match', q: 'Match each final thing with what it means.', pairs: [['final class', 'Cannot be extended'], ['final method', 'Cannot be overridden'], ['final data field', 'A constant']], why: 'Slides 59 and 60.' }
    ]
  },
  parts: {
    0: [
      { type: 'output', q: 'What does this print?', code: 'Rectangle r = new Rectangle(2.0, 4.0, "blue", true);\nSystem.out.println(r.getColor() + " " + r.isFilled() + " " + r.getArea());', answer: 'blue true 8.0', why: 'Inherited methods and own methods are called the same way.' },
      { type: 'write', q: 'Write a Circle method describe() that returns getColor() + " circle". (color is private in GeometricObject.)', rows: 3, checks: [{ re: /public\s+String\s+describe\s*\(\s*\)/, label: 'public String describe()' }, { re: /return\s+getColor\s*\(\s*\)\s*\+\s*" circle"\s*;/, label: 'return getColor() + " circle";' }], solution: 'public String describe() {\n  return getColor() + " circle";\n}', why: 'The subclass uses the public getter, not the private field.' },
      { type: 'tf', q: 'Circle and Rectangle inherit getDateCreated from GeometricObject.', answer: true, why: 'It is a public method of the superclass.' }
    ],
    1: [
      { type: 'output', q: 'What does this print?', code: 'class P { P() { System.out.print("P"); } }\nclass Q extends P {\n  Q() { this(1); System.out.print("Q"); }\n  Q(int n) { System.out.print(n); }\n}\n// in main:\nnew Q();', answer: 'P1Q', why: 'Q() calls Q(int), which has the hidden super(): P first, then 1, then Q.' },
      { type: 'bug', q: 'This does not compile. Tap the line that causes the error.', code: 'class Fruit {\n  public Fruit(String name) { }\n}\nclass Lemon extends Fruit {\n  public Lemon() { }\n}', answer: 5, why: 'Lemon() has a hidden super(), but Fruit has no no-arg constructor.' },
      { type: 'match', q: 'Match each keyword with what it refers to.', pairs: [['this', 'The calling object (or another constructor of the same class)'], ['super', 'The superclass (its constructor or methods)']], why: 'Slide 13.' }
    ],
    2: [
      { type: 'output', q: 'What does this print?', code: 'class B { public void p(double i) { System.out.println(i * 2); } }\nclass A extends B { public void p(int i) { System.out.println(i); } }\n// in main:\nA a = new A();\na.p(4);\na.p(4.0);', answer: '4\n8.0', why: 'A overloads p: p(int) for 4, and B’s p(double) for 4.0.' },
      { type: 'tf', q: 'If you do not override toString, printing an object shows something like Loan@15037e5.', answer: true, why: 'The class name, @ and a hexadecimal number.' }
    ],
    3: [
      { type: 'output', q: 'What does this print?', code: 'class Animal { public String sound() { return "..."; } }\nclass Cat extends Animal { public String sound() { return "Meow"; } }\nclass Kitten extends Cat { }\n// in main:\nAnimal a = new Kitten();\nSystem.out.println(a.sound());', answer: 'Meow', why: 'Kitten has no sound(), so the search goes up: Cat has it.' },
      { q: 'A variable of type Object refers to a Circle. Which method can the compiler let you call without a cast?', options: ['toString()', 'getArea()', 'getRadius()'], answer: 0, why: 'The compiler checks the variable’s type (Object); the JVM later runs Circle’s toString.' }
    ],
    4: [
      { type: 'write', q: 'If obj is a Circle, cast it and print its radius with getRadius().', rows: 3, checks: [{ re: /if\s*\(\s*obj\s+instanceof\s+Circle\s*\)/, label: 'if (obj instanceof Circle)' }, { re: /\(\s*\(\s*Circle\s*\)\s*obj\s*\)\s*\.\s*getRadius\s*\(\s*\)/, label: '((Circle) obj).getRadius()' }], solution: 'if (obj instanceof Circle)\n  System.out.println(((Circle) obj).getRadius());', why: 'Test with instanceof, then downcast.' },
      { type: 'output', q: 'With equals overridden as in slide 43, what does this print?', code: 'Circle a = new Circle(2), b = new Circle(3);\nObject r = new Rectangle(2, 2);\nSystem.out.println(a.equals(b) + " " + a.equals(r));', answer: 'false false', why: 'Different radius; and a Rectangle is not an instance of Circle.' }
    ],
    5: [
      { type: 'output', q: 'What does this print?', code: 'ArrayList<Integer> l = new ArrayList<>();\nl.add(10); l.add(20); l.add(30);\nl.remove(Integer.valueOf(20));\nl.add(0, 5);\nSystem.out.println(l + " " + l.size());', answer: '[5, 10, 30] 3', why: 'remove(Object) removes the value 20; add(0, 5) inserts at the front.' },
      { type: 'bug', q: 'One line does not compile. Tap it.', code: 'ArrayList<String> names = new ArrayList<>();\nnames.add("Sara");\nString first = names[0];', answer: 3, why: 'An ArrayList is not an array: use names.get(0).' }
    ],
    6: [
      { type: 'match', q: 'Match each modifier with who can use the member.', pairs: [['private', 'Only the same class'], ['default (no modifier)', 'The same package'], ['protected', 'The same package and subclasses anywhere'], ['public', 'Every class']], why: 'Slide 56.' },
      { type: 'tf', q: 'String is a final class, so it cannot be extended.', answer: true, why: 'String, StringBuilder, Math and the wrapper classes are final.' }
    ]
  }
});
