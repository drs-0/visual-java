/* CS2 · Objects and Classes: quick checks under the slides (1-2 per slide) and more part-quiz questions. */
addChecks({
  course: 'cs2', lesson: '02-objects-and-classes',
  slides: {
    1: [
      { q: 'Why are selections, loops, methods and arrays not enough for large programs?', options: ['Large programs need a better way to organize code: objects', 'They are too slow', 'Java does not allow big programs'], answer: 0, why: 'This course shows how to build programs from objects.' }
    ],
    2: [
      { type: 'tf', q: 'This unit covers constructors and the keyword this.', answer: true, why: 'Both are in the outline of slide 2.' }
    ],
    3: [
      { type: 'match', q: 'Match each part of an object with its meaning.', pairs: [['State', 'The data fields and their current values'], ['Behavior', 'The methods'], ['Identity', 'What makes the object unique']], why: 'Slide 3.' },
      { q: 'Which one can be viewed as an object?', options: ['A loan', 'The number 5', 'A semicolon'], answer: 0, why: 'A student, a desk, a circle, a button and even a loan are entities.' }
    ],
    4: [
      { type: 'tf', q: 'Many objects can be made from one class, each with its own values.', answer: true, why: 'The class is the template.' }
    ],
    5: [
      { type: 'match', q: 'Match each part of a class with its job.', pairs: [['Variables (data fields)', 'Define the state'], ['Methods', 'Define the behavior'], ['Constructors', 'Construct objects']], why: 'Slide 5.' }
    ],
    6: [
      { type: 'output', q: 'With the Circle class of slide 6, what does this print?', code: 'Circle c = new Circle(2);\nc.setRadius(c.radius * 3);\nSystem.out.println(c.radius);', answer: '6.0', why: '2.0 * 3 = 6.0, and setRadius stores it.' },
      { q: 'How many constructors does the Circle class of slide 6 have?', options: ['Two', 'One', 'Three'], answer: 0, why: 'Circle() and Circle(double newRadius).' }
    ],
    7: [
      { type: 'match', q: 'Match each UML line with its meaning.', pairs: [['radius: double', 'A data field named radius of type double'], ['Circle(newRadius: double)', 'A constructor with one double parameter'], ['getArea(): double', 'A method that returns a double']], why: 'In UML the type comes after the colon.' }
    ],
    8: [
      { type: 'output', q: 'What does this print?', code: 'Circle circle1 = new Circle();\nCircle circle2 = new Circle(25);\ncircle2.radius = 100;\nSystem.out.println(circle1.radius + " " + circle2.radius);', answer: '1.0 100.0', why: 'Each object has its own radius.' }
    ],
    9: [
      { type: 'tf', q: 'In the TV class diagram, the + sign means public.', answer: true, why: 'Slide 9.' }
    ],
    10: [
      { type: 'output', q: 'What does this print?', code: 'TV t = new TV();\nt.turnOn();\nt.setChannel(130);\nSystem.out.println(t.channel);', answer: '1', why: 'The channel must be 1 to 120, so 130 is refused and the channel stays 1.' },
      { type: 'fill', q: 'Complete setVolume: the volume must be 1 to 7 and the TV must be on.', code: 'if (on && newVolume >= 1 && newVolume <= ___)\n  volumeLevel = newVolume;', answer: ['7'], why: 'Slide 10.' }
    ],
    11: [
      { type: 'output', q: 'What does this print?', code: 'TV t = new TV();\nt.turnOn();\nt.channelDown();\nSystem.out.println(t.channel);', answer: '1', why: 'channelDown works only when channel > 1, and the channel is 1.' }
    ],
    12: [
      { type: 'output', q: 'What does TestTV print?', code: 'System.out.println("tv1\'s channel is " + tv1.channel\n  + " and volume level is " + tv1.volumeLevel);\nSystem.out.println("tv2\'s channel is " + tv2.channel\n  + " and volume level is " + tv2.volumeLevel);', answer: 'tv1\'s channel is 30 and volume level is 3\ntv2\'s channel is 3 and volume level is 2', why: 'tv1: setChannel(30), setVolume(3). tv2: two channelUp from 1, one volumeUp from 1.' }
    ],
    13: [
      { q: 'After classes and objects, what comes next in the outline?', options: ['Constructors and the default constructor', 'Files', 'Recursion'], answer: 0, why: 'Then object reference variables and the dot operator.' }
    ],
    14: [
      { type: 'bug', q: 'The author wanted a constructor here, but wrote a method by mistake. Tap that line.', code: 'public class Box {\n  int size;\n  public void Box(int s) { size = s; }\n}', answer: 3, why: 'A constructor has no return type, not even void. With void, Box(int s) is a normal method.' },
      { q: 'What is a no-arg constructor?', options: ['A constructor with no parameters', 'A constructor that returns nothing', 'A constructor that cannot be used'], answer: 0, why: 'Like Circle().' }
    ],
    15: [
      { type: 'write', q: 'Create a Circle object with radius 7.5 and store it in a new variable named c.', checks: [{ re: /Circle\s+c\s*=\s*new\s+Circle\s*\(\s*7\.5\s*\)\s*;/, label: 'Circle c = new Circle(7.5);' }], solution: 'Circle c = new Circle(7.5);', why: 'new calls the constructor with one double argument.' }
    ],
    16: [
      { type: 'tf', q: 'If a class has a constructor Box(int s), Java also adds a default no-arg constructor.', answer: false, why: 'The default constructor is added only if no constructors are written.' }
    ],
    17: [
      { type: 'match', q: 'Match each line with what it does.', pairs: [['Circle myCircle;', 'Declares a reference variable only'], ['myCircle = new Circle();', 'Creates an object and assigns its reference'], ['Circle myCircle = new Circle();', 'Both in one step']], why: 'Slide 17.' }
    ],
    18: [
      { q: 'After Circle myCircle = …, before the object is made, what does myCircle refer to?', options: ['Nothing yet', 'A circle with radius 0', 'A circle with radius 1'], answer: 0, why: 'The variable exists but has no object yet.' }
    ],
    19: [
      { q: 'What does new Circle(5.0) do?', options: ['Makes a Circle object with radius 5.0 in memory', 'Prints a circle', 'Changes every circle to 5.0'], answer: 0, why: 'The constructor initializes the new object.' }
    ],
    20: [
      { type: 'tf', q: 'After the assignment, myCircle holds the reference to the new object.', answer: true, why: 'The = assigns the reference.' }
    ],
    21: [
      { q: 'How many Circle objects exist right after Circle yourCircle is declared?', options: ['One', 'Two', 'None'], answer: 0, why: 'Declaring a variable makes no object.' }
    ],
    22: [
      { q: 'new Circle() makes a circle with which radius?', options: ['1.0', '0.0', '5.0'], answer: 0, why: 'The no-arg constructor keeps the default radius = 1.' }
    ],
    23: [
      { type: 'tf', q: 'myCircle and yourCircle now refer to two different objects.', answer: true, why: 'There were two new calls.' }
    ],
    24: [
      { type: 'output', q: 'What does this print?', code: 'Circle myCircle = new Circle(5.0);\nCircle yourCircle = new Circle();\nyourCircle.radius = 100;\nSystem.out.println(myCircle.radius + " " + yourCircle.radius);', answer: '5.0 100.0', why: 'Only the object of yourCircle changes.' }
    ],
    25: [
      { type: 'fill', q: 'Call getArea on the object c with the dot operator.', code: 'double a = c___getArea();', answer: ['.'], why: 'objectRefVar.methodName(arguments).' }
    ],
    26: [
      { type: 'bug', q: 'One line does not compile. Tap it.', code: 'Circle c = new Circle(2);\ndouble a1 = c.getArea();\ndouble a2 = Circle.getArea();\ndouble r = Math.sqrt(4);', answer: 3, why: 'getArea is not static, so it must be called on an object.' }
    ],
    27: [
      { q: 'What comes next in the outline?', options: ['Primitive data versus object types, and garbage collection', 'The keyword this', 'Static methods'], answer: 0, why: 'Then reference data fields and default values.' }
    ],
    28: [
      { type: 'match', q: 'Match each variable with what it holds.', pairs: [['int i = 1;', 'The value 1 itself'], ['Circle c = new Circle(1);', 'A reference to where the object is']], why: 'Primitive types hold values; reference types hold references.' }
    ],
    29: [
      { type: 'output', q: 'What does this print?', code: 'int i = 1, j = 2;\ni = j;\nj = 5;\nSystem.out.println(i);', answer: '2', why: 'For a primitive, = copies the value. Changing j later does not change i.' },
      { type: 'tf', q: 'After c1 = c2; with two Circle variables, c1 and c2 refer to the same object.', answer: true, why: 'For an object variable, = copies the reference.' }
    ],
    30: [
      { type: 'tf', q: 'You must free garbage objects yourself in Java.', answer: false, why: 'The JVM collects garbage automatically.' },
      { q: 'What does c = null; mean?', options: ['c now refers to no object', 'The object is deleted at once', 'c holds the number 0'], answer: 0, why: 'null means referencing nothing.' }
    ],
    31: [
      { q: 'In the Student class of slide 31, which field has a reference type?', options: ['String name', 'int age', 'boolean isScienceMajor'], answer: 0, why: 'String is a class, so it is a reference type.' }
    ],
    32: [
      { type: 'trace', q: 'What does TestStudent print for each field?', cols: ['line', 'printed'], rows: [['"name? " + student.name', '?name? null'], ['"age? " + student.age', '?age? 0'], ['"isScienceMajor? " + student.isScienceMajor', '?isScienceMajor? false']], why: 'Fields get default values: null, 0 and false.' }
    ],
    33: [
      { type: 'bug', q: 'This program does not compile. Tap the first line with the error.', code: 'public static void main(String[] args) {\n  int x;\n  System.out.println("x is " + x);\n}', answer: 3, why: 'x is a local variable with no value, so it cannot be used.' }
    ],
    34: [
      { q: 'What comes next in the outline?', options: ['Java library classes: Date, Random and Point2D', 'Arrays of objects', 'Visibility modifiers'], answer: 0, why: 'Classes that come with Java.' }
    ],
    35: [
      { q: 'In which package is the Date class?', options: ['java.util', 'java.lang', 'javafx.geometry'], answer: 0, why: 'java.util.Date.' }
    ],
    36: [
      { type: 'write', q: 'Create a Date object for the current date and time, in a new variable named now (write the full name java.util.Date).', checks: [{ re: /java\s*\.\s*util\s*\.\s*Date\s+now\s*=\s*new\s+java\s*\.\s*util\s*\.\s*Date\s*\(\s*\)\s*;/, label: 'java.util.Date now = new java.util.Date();' }], solution: 'java.util.Date now = new java.util.Date();', why: 'new, then the constructor with no arguments.' }
    ],
    37: [
      { type: 'tf', q: 'Math.random() can return 1.0.', answer: false, why: 'It returns a value from 0.0 up to, but not including, 1.0.' }
    ],
    38: [
      { type: 'tf', q: 'new Random(3) and new Random(4) give the same sequence of numbers.', answer: false, why: 'Only the same seed gives the same sequence.' },
      { q: 'Why is the same seed useful?', options: ['For testing: the “random” numbers repeat', 'It makes the numbers bigger', 'It is faster'], answer: 0, why: 'You can repeat a run exactly.' }
    ],
    39: [
      { q: 'In which package is Point2D?', options: ['javafx.geometry', 'java.util', 'java.lang'], answer: 0, why: 'It is part of JavaFX.' }
    ],
    40: [
      { type: 'output', q: 'What does this print?', code: 'Point2D p1 = new Point2D(1, 1);\nPoint2D p2 = new Point2D(4, 5);\nSystem.out.println(p1.distance(p2));', answer: '5.0', why: 'The sides are 3 and 4, so the distance is 5.0.' }
    ],
    41: [
      { q: 'What comes next in the outline?', options: ['Instance versus static variables and methods', 'Recursion', 'Exceptions'], answer: 0, why: 'Static members.' }
    ],
    42: [
      { type: 'match', q: 'Match each kind of variable with how many copies exist.', pairs: [['Instance variable', 'One copy in each object'], ['Static variable', 'One copy for the whole class']], why: 'Static variables are shared by all instances.' }
    ],
    43: [
      { type: 'tf', q: 'A static method can access an instance data field directly.', answer: false, why: 'A static method does not belong to any object.' }
    ],
    44: [
      { type: 'fill', q: 'Make numberOfObjects shared by all CircleSM objects.', code: '___ int numberOfObjects = 0;', answer: ['static'], why: 'The static modifier makes it a class variable.' }
    ],
    45: [
      { type: 'output', q: 'What does this print?', code: 'CircleSM c1 = new CircleSM();\nCircleSM c2 = new CircleSM(5);\nc1.radius = 9;\nSystem.out.println(c1.radius + " " + c2.radius + " " + CircleSM.numberOfObjects);', answer: '9.0 5.0 2', why: 'Each object has its own radius; the counter is shared and is 2.' }
    ],
    46: [
      { q: 'In a UML class diagram, which members are underlined?', options: ['Static variables and methods', 'Private members', 'Constructors'], answer: 0, why: 'Non-static members are not underlined.' }
    ],
    47: [
      { q: 'What comes next in the outline?', options: ['Visibility modifiers, accessor and mutator methods', 'Inheritance', 'Arrays'], answer: 0, why: 'public, private and default access.' }
    ],
    48: [
      { type: 'match', q: 'Match each modifier with who can access the member.', pairs: [['public', 'Any class in any package'], ['private', 'Only the declaring class'], ['(no modifier)', 'Any class in the same package']], why: 'Slide 48.' }
    ],
    49: [
      { type: 'trace', q: 'In package p2, class C3 has C1 o = new C1(); Can C3 use each member?', cols: ['member', 'allowed?'], rows: [['o.x (public)', '?yes'], ['o.y (no modifier)', '?no'], ['o.z (private)', '?no'], ['o.m1() (public)', '?yes']], why: 'Another package can use only public members.' }
    ],
    50: [
      { type: 'tf', q: 'Code inside class C may use the private members of any C object.', answer: true, why: 'private is about the class, not the object.' }
    ],
    51: [
      { q: 'A class has no modifier. Who can use it?', options: ['Classes in the same package', 'Every class', 'Only itself'], answer: 0, why: 'The default modifier restricts access to the package.' }
    ],
    52: [
      { q: 'What is data field encapsulation?', options: ['Hiding the data inside the object and reaching it only through public methods', 'Putting all classes in one file', 'Making every field public'], answer: 0, why: 'The Circle class has private radius with get and set methods.' }
    ],
    53: [
      { type: 'write', q: 'Write a getter for a private double field named radius.', rows: 3, checks: [{ re: /public\s+double\s+getRadius\s*\(\s*\)/, label: 'public double getRadius()' }, { re: /return\s+(this\s*\.\s*)?radius\s*;/, label: 'return radius;' }], solution: 'public double getRadius() {\n  return radius;\n}', why: 'An accessor returns the value of the private field.' }
    ],
    54: [
      { type: 'output', q: 'With the Circle of slide 53, what does this print?', code: 'Circle myCircle = new Circle(5.0);\nmyCircle.setRadius(myCircle.getRadius() * 2);\nSystem.out.println(myCircle.getRadius());', answer: '10.0', why: 'getRadius gives 5.0, and setRadius stores 10.0.' }
    ],
    55: [
      { q: 'What comes next in the outline?', options: ['Passing objects, arrays of objects and the keyword this', 'The Math class', 'Loops'], answer: 0, why: 'The last part of the unit.' }
    ],
    56: [
      { type: 'output', q: 'What does TestPassObject print at the end?', code: 'Circle myCircle = new Circle(1);\nint n = 5;\nprintAreas(myCircle, n);   // adds 1 to the radius, 5 times\nSystem.out.println("Radius is " + myCircle.getRadius());\nSystem.out.println("n is " + n);', answer: 'Radius is 6.0\nn is 5', why: 'The method changed the object (1 + 5 = 6.0), but only its own copy of n.' }
    ],
    57: [
      { type: 'output', q: 'What does this print?', code: 'Circle[] circleArray = new Circle[3];\ncircleArray[1] = new Circle(4);\nSystem.out.println(circleArray[0] + " " + circleArray[1].getRadius());', answer: 'null 4.0', why: 'The array holds references; only element 1 got a Circle.' }
    ],
    58: [
      { type: 'tf', q: 'createCircleArray returns an array of Circle objects.', answer: true, why: 'Its return type is Circle[].' }
    ],
    59: [
      { type: 'write', q: 'Complete the loop body of sum: add the area of each circle to sum.', code: 'for (int i = 0; i < circleArray.length; i++)', checks: [{ re: /sum\s*\+=\s*circleArray\s*\[\s*i\s*\]\s*\.\s*getArea\s*\(\s*\)\s*;/, label: 'sum += circleArray[i].getArea();' }], solution: 'sum += circleArray[i].getArea();', why: 'circleArray[i] is a Circle, so you can call getArea on it.' }
    ],
    60: [
      { q: 'What is an immutable object?', options: ['An object whose contents cannot be changed after it is created', 'An object with no methods', 'An object that cannot be printed'], answer: 0, why: 'Its class is an immutable class.' }
    ],
    61: [
      { type: 'tf', q: 'All fields of the Student class are private, and it has no set methods.', answer: true, why: 'But it is still mutable, as the next slide shows.' }
    ],
    62: [
      { type: 'match', q: 'Match each rule for an immutable class with an example of breaking it.', pairs: [['All data fields must be private', 'public int id;'], ['No mutator methods', 'public void setName(String n)'], ['No getter returns a mutable field', 'public Date getDateCreated()']], why: 'Slide 62.' }
    ],
    63: [
      { type: 'tf', q: 'A data field can be used in every method of its class.', answer: true, why: 'The scope of instance and static variables is the entire class.' }
    ],
    64: [
      { type: 'match', q: 'Match each use of this with an example.', pairs: [['Reach a hidden data field', 'this.radius = radius;'], ['Call another constructor', 'this(1.0);']], why: 'Slide 64.' }
    ],
    65: [
      { type: 'bug', q: 'This setter does not change the field. Tap the wrong line.', code: 'private double radius = 1;\n\npublic void setRadius(double radius) {\n  radius = radius;\n}', answer: 4, why: 'radius here means the parameter both times. Write this.radius = radius;' }
    ],
    66: [
      { type: 'output', q: 'With the Circle of slide 66 (and a getRadius method), what does this print?', code: 'Circle c = new Circle();\nSystem.out.println(c.getRadius());', answer: '1.0', why: 'The no-arg constructor calls this(1.0).' }
    ]
  },
  parts: {
    0: [
      { type: 'output', q: 'What does this print?', code: 'TV t = new TV();\nt.setVolume(5);\nt.turnOn();\nt.volumeUp();\nSystem.out.println(t.volumeLevel);', answer: '2', why: 'setVolume did nothing because the TV was off. Then volumeUp goes from 1 to 2.' },
      { type: 'write', q: 'Create a TV object named myTV and turn it on (two statements).', rows: 2, checks: [{ re: /TV\s+myTV\s*=\s*new\s+TV\s*\(\s*\)\s*;/, label: 'TV myTV = new TV();' }, { re: /myTV\s*\.\s*turnOn\s*\(\s*\)\s*;/, label: 'myTV.turnOn();' }], solution: 'TV myTV = new TV();\nmyTV.turnOn();', why: 'new makes the object; the dot calls its method.' },
      { type: 'tf', q: 'Two TV objects share the same channel.', answer: false, why: 'Each object has its own data fields.' }
    ],
    1: [
      { type: 'output', q: 'What does this print?', code: 'Circle a = new Circle();\nCircle b = new Circle(3);\na.radius = b.radius + 1;\nSystem.out.println(a.radius + " " + b.radius);', answer: '4.0 3.0', why: 'a gets 3.0 + 1 = 4.0; b does not change.' },
      { type: 'bug', q: 'Which line is not a valid constructor for class Circle?', code: 'Circle() { }\nCircle(double r) { radius = r; }\nvoid Circle(int r) { radius = r; }', answer: 3, why: 'A constructor has no return type, not even void.' },
      { q: 'You write a class with no constructor. What can you call?', options: ['new ClassName() (the default constructor)', 'Nothing: you cannot create objects', 'new ClassName(0)'], answer: 0, why: 'Java adds a no-arg constructor with an empty body.' }
    ],
    2: [
      { type: 'output', q: 'What does this print?', code: 'Circle c1 = new Circle(2);\nCircle c2 = c1;\nc1 = new Circle(8);\nSystem.out.println(c2.radius + " " + c1.radius);', answer: '2.0 8.0', why: 'c2 still refers to the first circle; c1 now refers to a new one.' },
      { type: 'match', q: 'Match each field type with its default value.', pairs: [['String', 'null'], ['double', '0.0'], ['boolean', 'false']], why: 'Slide 32.' }
    ],
    3: [
      { type: 'tf', q: 'random.nextInt(10) can return 10.', answer: false, why: 'It returns 0 to 9.' },
      { type: 'write', q: 'Create a Random object with the seed 7, in a new variable named r.', checks: [{ re: /Random\s+r\s*=\s*new\s+Random\s*\(\s*7\s*\)\s*;/, label: 'Random r = new Random(7);' }], solution: 'Random r = new Random(7);', why: 'The seed is the argument of the constructor.' },
      { type: 'output', q: 'What does this print?', code: 'Point2D p1 = new Point2D(0, 0);\nPoint2D p2 = new Point2D(6, 8);\nSystem.out.println(p1.distance(p2));', answer: '10.0', why: 'The sides are 6 and 8, so the distance is 10.0.' }
    ],
    4: [
      { type: 'output', q: 'What does this print?', code: 'new CircleSM();\nnew CircleSM();\nCircleSM c = new CircleSM(3);\nSystem.out.println(c.numberOfObjects + " " + CircleSM.getNumberOfObjects());', answer: '3 3', why: 'It is the same shared variable, read in two ways.' },
      { type: 'bug', q: 'This static method does not compile. Tap the wrong line.', code: 'static int numberOfObjects = 0;\ndouble radius;\nstatic double getDiameter() {\n  return 2 * radius;\n}', answer: 4, why: 'A static method cannot use the instance field radius.' }
    ],
    5: [
      { type: 'write', q: 'Write a setter setRadius(double newRadius) that stores newRadius only if it is 0 or more (else 0), like slide 53.', rows: 3, checks: [{ re: /public\s+void\s+setRadius\s*\(\s*double\s+newRadius\s*\)/, label: 'public void setRadius(double newRadius)' }, { re: /radius\s*=\s*\(?\s*newRadius\s*>=\s*0\s*\)?\s*\?\s*newRadius\s*:\s*0\s*;|if\s*\(\s*newRadius\s*>=\s*0\s*\)\s*\{?\s*radius\s*=\s*newRadius\s*;/, label: 'radius = (newRadius >= 0) ? newRadius : 0;' }], solution: 'public void setRadius(double newRadius) {\n  radius = (newRadius >= 0) ? newRadius : 0;\n}', why: 'The setter checks the value, so the object stays valid.' },
      { type: 'tf', q: 'In UML, the - sign means public.', answer: false, why: '- means private and + means public.' }
    ],
    6: [
      { type: 'output', q: 'What does this print?', code: 'public static void change(Circle c, double r) {\n  c.setRadius(r);\n  r = 0;\n}\n// in main:\nCircle k = new Circle(1);\ndouble r = 9;\nchange(k, r);\nSystem.out.println(k.getRadius() + " " + r);', answer: '9.0 9.0', why: 'The method changes the shared object; r in main is a separate copy.' },
      { type: 'tf', q: 'new Circle[5] creates five Circle objects.', answer: false, why: 'It creates an array of five null references.' }
    ],
    7: [
      { type: 'write', q: 'Complete the constructor so the parameter radius is stored in the field radius.', code: 'public Circle(double radius) {', checks: [{ re: /this\s*\.\s*radius\s*=\s*radius\s*;/, label: 'this.radius = radius;' }], solution: 'this.radius = radius;', why: 'this.radius is the field; radius alone is the parameter.' },
      { type: 'output', q: 'What does this print?', code: 'class Counter {\n  private int count;\n  public Counter(int count) { this.count = count; }\n  public Counter() { this(10); }\n  public int getCount() { return count; }\n}\n// in main:\nSystem.out.println(new Counter().getCount() + new Counter(5).getCount());', answer: '15', why: 'The no-arg constructor calls this(10). 10 + 5 = 15.' }
    ]
  }
});
