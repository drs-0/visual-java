addModule({
  id: 'm3',
  title: 'OOP Concepts',
  blurb: 'Inheritance, polymorphism, abstract classes, interfaces and more. The big ideas of object-oriented code.',
  lessons: [
    /* ------------------------------------------------------------ */
    {
      id: 'm3-1',
      title: 'The four OOP ideas',
      body: `
<p><b>OOP</b> means <b>Object-Oriented Programming</b>. It has four main ideas. You already know the first one. This module teaches the rest.</p>
<ol>
<li><b>Encapsulation</b>: hide the data inside the class. Give access only through methods. (You learned this with getters and setters.)</li>
<li><b>Inheritance</b>: a new class can get the attributes and methods of another class, so you don't write them again.</li>
<li><b>Polymorphism</b>: the same method call can do different things, depending on the real object.</li>
<li><b>Abstraction</b>: show only what is important, and hide the {{details|التفاصيل}}. You drive a car with a wheel and pedals. You don't need to know how the engine works inside.</li>
</ol>
<p>These ideas help us write code that is easier to <b>reuse</b>, easier to <b>change</b>, and easier to <b>understand</b>.</p>
<div class="tip">Look at the code on the right. All four ideas appear in just a few lines. Press <b>Next</b> to see where each one is.</div>`,
      code: `abstract class Animal {        // Abstraction
    private String name;       // Encapsulation
    abstract void makeSound();
}
class Cat extends Animal {     // Inheritance
    void makeSound() {         // Polymorphism
        System.out.println("Meow");
    }
}`,
      steps: [
        { cap: 'The four big ideas of OOP. Press Next to look at each one.' },
        { cap: '<b>Encapsulation</b>: <code>name</code> is private. It is hidden inside the class.', line: 2 },
        { cap: '<b>Inheritance</b>: <code>Cat extends Animal</code>. Cat gets everything from Animal.', line: 5 },
        { cap: '<b>Polymorphism</b>: Cat gives its own version of <code>makeSound()</code>. Other animals can give other versions.', line: '6-8' },
        { cap: '<b>Abstraction</b>: Animal only says "every animal makes a sound". It hides how.', line: [1, 3] }
      ],
      draw: function (k) {
        var tiles = [
          ['enc', 30, 30, 'Encapsulation', ['Hide the data.', 'Reach it with methods.']],
          ['inh', 290, 30, 'Inheritance', ['A class gets the code', 'of another class.']],
          ['pol', 30, 185, 'Polymorphism', ['One method call,', 'many different results.']],
          ['abs', 290, 185, 'Abstraction', ['Show what matters.', 'Hide the details.']]
        ];
        return tiles.map(function (t, i) {
          var on = k === i + 1;
          return B(t[0], t[1], t[2], 240, 125, { title: t[3], lines: t[4], prose: true, tone: on ? 'accent' : k === 0 ? 'blue' : 'muted', hi: on, o: k === 0 || on ? 1 : 0.5, size: 16, r: 14 });
        });
      },
      quiz: [
        { q: 'Which OOP idea means "a class gets the code of another class"?', options: ['Encapsulation', 'Inheritance', 'Abstraction'], answer: 1, why: 'Inheritance = getting attributes and methods from a parent class.' },
        { q: 'Private attributes with getters and setters are an example of...', options: ['Encapsulation', 'Polymorphism', 'Recursion'], answer: 0, why: 'Hide the data, give controlled access.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm3-2',
      title: 'Inheritance',
      body: `
<p><b>Inheritance</b> lets one class get the attributes and methods of another class.</p>
<ul>
<li>The class that gives is the <b>superclass</b> (the parent).</li>
<li>The class that gets is the <b>subclass</b> (the child).</li>
</ul>
<p>Use the keyword <code>extends</code>:</p>
~~~
class Animal {
    protected int legs;
    void eat() {
        System.out.println("Eating...");
    }
}

class Dog extends Animal {
    void bark() {
        System.out.println("Woof");
    }
}
~~~
<p>We never wrote <code>eat()</code> inside Dog. But a Dog can still eat, because it {{inherits|يرث}} <code>eat()</code> from Animal:</p>
~~~
Dog d = new Dog();
d.eat();    // Eating...
d.bark();   // Woof
~~~
<p>Inheritance is an <b>"is a"</b> {{relationship|علاقة}}: a Dog <b>is an</b> Animal. A Cat <b>is an</b> Animal. If the sentence "X is a Y" sounds right, inheritance may be a good idea.</p>
<div class="warn"><b>Rules:</b> a class can extend only <b>one</b> class. <code>private</code> members are not visible in the subclass, but <code>protected</code> and <code>public</code> members are.</div>`,
      code: `class Animal {
    protected int legs;
    void eat() {
        System.out.println("Eating...");
    }
}

class Dog extends Animal {
    Dog() {
        legs = 4;
    }
    void bark() {
        System.out.println("Woof");
    }
}
// in main:
Dog d = new Dog();
d.eat();
d.bark();`,
      steps: [
        { cap: '<b>Animal</b> is the {{superclass|الكلاس الأب}} (the parent). It has <code>legs</code> and <code>eat()</code>.', line: '1-6' },
        { cap: '<code>Dog extends Animal</code>. Dog is the {{subclass|الكلاس الابن}} (the child).', line: 8 },
        { cap: 'Dog gets <code>legs</code> and <code>eat()</code> from Animal. We did not write them again!', line: 8 },
        { cap: 'Dog can also add its own new method: <code>bark()</code>.', line: '12-14' },
        { cap: 'A Dog object. <code>d.eat()</code> works: the method comes from Animal.', line: [18, 4], out: 'Eating...' },
        { cap: '<code>d.bark()</code> uses Dog\'s own method.', line: [19, 13], out: 'Woof' },
        { cap: 'Many classes can extend the same class. Dog, Cat and Bird are all Animals. This is a class {{tree|شجرة}}.' }
      ],
      draw: function (k) {
        var tree = k === 6;
        var dogLines = [];
        if (k >= 2) dogLines.push({ t: 'int legs', tone: 'muted' });
        if (k >= 3 || tree) dogLines.push('---');
        if (k >= 2) dogLines.push({ t: 'void eat()', tone: 'muted' });
        if (k >= 3) dogLines.push({ t: 'void bark()', tone: k === 3 || k === 5 ? 'accent' : undefined, b: k === 3 || k === 5 });
        if (k === 2) dogLines.splice(1, 0, '---');
        var dx = tree ? 10 : 180, dy = tree ? 205 : 185;
        return [
          CLS('an', 180, 20, 200, { name: 'class Animal', fields: ['int legs'], methods: [{ t: 'void eat()', tone: k === 4 ? 'accent' : undefined, b: k === 4 }], hi: k === 0 }),
          k >= 1 && B('dog', dx, dy, 170, dogLines.length ? 30 + dogLines.length * 18 + 10 : 40, { title: 'class Dog', lines: dogLines, band: true, tone: 'blue', mono: true, hi: k === 1 }),
          k >= 1 && A('ext', dx + 85, dy - 2, tree ? 250 : 265, 116, { tone: 'blue', label: tree ? '' : 'extends', la: 'start', lx: 10 }),
          k >= 2 && k <= 3 && T('inh', 360, 236, '← inherited', { tone: 'muted', bold: true, size: 13 }),
          (k === 4 || k === 5) && OBJ('d', 395, 200, 145, { name: 'd : Dog', fields: ['legs = 4'] }),
          (k === 4 || k === 5) && A('call', 393, 228, 352, k === 4 ? 263 : 281, { tone: 'teal', label: k === 4 ? 'd.eat()' : 'd.bark()', bend: -10 }),
          tree && CLS('cat', 195, 205, 170, { name: 'class Cat', methods: ['void meow()'] }),
          tree && CLS('bird', 380, 205, 170, { name: 'class Bird', methods: ['void fly()'] }),
          tree && A('extc', 280, 203, 280, 116, { tone: 'blue', label: 'extends', la: 'start', lx: 8 }),
          tree && A('extb', 465, 203, 310, 116, { tone: 'blue' })
        ];
      },
      quiz: [
        { q: 'In <code>class Car extends Vehicle</code>, which one is the superclass?', options: ['`Car`', '`Vehicle`', 'Both'], answer: 1, why: 'The class after <code>extends</code> is the parent (superclass).' },
        { type: 'fill', q: 'Make <code>Cat</code> a subclass of <code>Animal</code>.', code: 'class Cat ___ Animal {\n}', answer: ['extends'], why: '<code>extends</code> creates inheritance.' },
        { q: 'How many classes can one class extend in Java?', options: ['Only one', 'Two', 'As many as you want'], answer: 0, why: 'Java allows single inheritance for classes.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm3-3',
      title: 'super and constructors',
      body: `
<p>Constructors are <b>not</b> inherited. But when you create a subclass object, the <b>parent's constructor runs first</b>. The parent part of the object is built, and then the child part.</p>
~~~
class A {
    A() {
        System.out.println("A constructor");
    }
}
class B extends A {
    B() {
        super();
        System.out.println("B constructor");
    }
}
~~~
<p><code>super()</code> calls the constructor of the parent class. It must be the <b>first line</b> in the constructor.</p>
<p>If you don't write <code>super()</code>, Java adds it for you {{automatically|تلقائياً}}. So <code>new B()</code> always prints:</p>
~~~
A constructor
B constructor
~~~
<h3>super with parameters</h3>
<p>If the parent constructor needs values, send them through <code>super</code>:</p>
~~~
class Animal {
    String name;
    Animal(String name) { this.name = name; }
}
class Dog extends Animal {
    Dog(String name) {
        super(name);
    }
}
~~~
<div class="tip">You can also use <code>super.methodName()</code> to call the parent's version of a method.</div>`,
      code: `class A {
    A() {
        System.out.println("A constructor");
    }
}
class B extends A {
    B() {
        super();
        System.out.println("B constructor");
    }
}
// in main:
B obj = new B();`,
      steps: [
        { cap: 'We create a B object. B extends A, so the object has an A part and a B part.', line: 13 },
        { cap: 'The B constructor starts. Its first line is <code>super();</code>', line: [7, 8] },
        { cap: '<code>super()</code> jumps to the A constructor. The <b>A part</b> is built first.', line: [2, 3], out: 'A constructor' },
        { cap: 'Back in B. Now B finishes its own code. The <b>B part</b> is built on top.', line: 9, out: 'B constructor' },
        { cap: 'Rule: the parent is always built first. If you don\'t write <code>super()</code>, Java adds it for you.', line: 8 }
      ],
      draw: function (k) {
        return [
          T('newb', 30, 36, 'B obj = new B();', { mono: true, bold: true, tone: k === 0 ? 'accent' : 'ink' }),
          B('cb', 30, 60, 230, boxH(2), { title: 'B()', lines: [{ t: 'super();', tone: k === 1 || k === 4 ? 'accent' : undefined, b: k === 1 || k === 4 }, 'println("B constructor");'], tone: 'teal', mono: true, hi: k === 1 || k === 3 }),
          B('ca', 30, 200, 230, boxH(1), { title: 'A()', lines: ['println("A constructor");'], tone: 'blue', mono: true, hi: k === 2 }),
          k === 2 && A('sup', 140, 138, 140, 198, { tone: 'accent', label: 'super()', la: 'start', lx: 12 }),
          k === 3 && A('bk', 200, 198, 200, 138, { tone: 'teal', label: 'go back', la: 'start', lx: 10 }),
          B('frame', 320, 50, 210, 250, { tone: 'muted', fill: 'none', dash: true, tag: 'the new B object', r: 14, z: 0 }),
          k >= 2 && B('la', 335, 210, 180, 72, { title: 'A part', tone: 'blue', fill: 'solid', size: 16, from: [335, 300] }),
          k >= 3 && B('lb', 335, 128, 180, 72, { title: 'B part', tone: 'teal', fill: 'solid', size: 16, from: [335, 40] }),
          k === 4 && T('ord', 425, 105, '1st: A   2nd: B', { anchor: 'middle', bold: true, tone: 'accent', size: 13 })
        ];
      },
      quiz: [
        { q: 'What does <code>new B()</code> print first if B extends A, and both constructors print a line?', options: ['The line from B', 'The line from A', 'Only the line from B'], answer: 1, why: 'The parent constructor always runs first.' },
        { type: 'fill', q: 'Call the parent constructor and send it the name.', code: 'class Dog extends Animal {\n    Dog(String name) {\n        ___(name);\n    }\n}', answer: ['super'], why: '<code>super(...)</code> calls the parent constructor.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm3-4',
      title: 'Polymorphism',
      body: `
<p><b>Polymorphism</b> means "many forms". It is one of the most powerful ideas in OOP.</p>
<p>First, an important fact: a variable of the <b>parent type</b> can hold an object of the <b>child type</b>:</p>
~~~
Animal a = new Cat();   // OK: a Cat is an Animal
~~~
<p>Now imagine that Cat and Dog both have their own version of <code>makeSound()</code>:</p>
~~~
Animal a = new Cat();
Animal b = new Dog();
a.makeSound();   // Meow
b.makeSound();   // Woof
~~~
<p>Both variables have the type <code>Animal</code>. The code looks the same: <code>x.makeSound()</code>. But the result is different. Java looks at the <b>real object</b> at runtime and runs <b>its</b> method.</p>
<div class="tip"><b>Why is this useful?</b> You can write one piece of code that works with every animal, now and in the future. For example, a loop over a list of animals that calls <code>makeSound()</code> on each one.</div>`,
      code: `class Animal {
    void makeSound() {
        System.out.println("...");
    }
}
class Cat extends Animal {
    void makeSound() {
        System.out.println("Meow");
    }
}
class Dog extends Animal {
    void makeSound() {
        System.out.println("Woof");
    }
}
// in main:
Animal a = new Cat();
Animal b = new Dog();
a.makeSound();
b.makeSound();`,
      steps: [
        { cap: 'Two variables. Both have the type <code>Animal</code>.', line: [17, 18] },
        { cap: 'a holds a <b>Cat</b> object. b holds a <b>Dog</b> object. This is allowed: a Cat is an Animal.', line: [17, 18] },
        { cap: '<code>a.makeSound()</code>: Java follows the arrow. The real object is a Cat, so Cat\'s method runs.', line: [19, 8], out: 'Meow' },
        { cap: '<code>b.makeSound()</code>: the same code, but the real object is a Dog.', line: [20, 13], out: 'Woof' },
        { cap: 'Same call, different forms. This is <b>polymorphism</b>.' }
      ],
      draw: function (k) {
        return [
          B('va', 30, 80, 160, 48, { tag: 'type: Animal', title: 'a', mono: true, tone: 'blue', size: 16, hi: k === 2 }),
          B('vb', 30, 210, 160, 48, { tag: 'type: Animal', title: 'b', mono: true, tone: 'blue', size: 16, hi: k === 3 }),
          k >= 1 && OBJ('cat', 350, 60, 190, { name: 'Cat object', fields: [{ t: 'makeSound() → "Meow"', tone: k === 2 || k === 4 ? 'accent' : undefined, b: k === 2 }], hi: k === 2 }),
          k >= 1 && OBJ('dog', 350, 190, 190, { name: 'Dog object', fields: [{ t: 'makeSound() → "Woof"', tone: k === 3 || k === 4 ? 'accent' : undefined, b: k === 3 }], hi: k === 3 }),
          k >= 1 && A('ra', 192, 104, 346, 90, { tone: k === 2 ? 'accent' : 'ink', label: k === 2 ? 'a.makeSound()' : '' }),
          k >= 1 && A('rb', 192, 234, 346, 220, { tone: k === 3 ? 'accent' : 'ink', label: k === 3 ? 'b.makeSound()' : '' }),
          k === 4 && T('sum', 280, 318, 'x.makeSound()  →  "Meow" or "Woof"', { anchor: 'middle', mono: true, bold: true, tone: 'accent' })
        ];
      },
      quiz: [
        { q: 'What does this print?', code: 'Animal x = new Dog();\nx.makeSound();', options: ['...', 'Woof', 'Meow'], answer: 1, why: 'The real object is a Dog, so the Dog version runs.' },
        { q: 'Is <code>Animal a = new Cat();</code> allowed if Cat extends Animal?', options: ['Yes', 'No'], answer: 0, why: 'A parent type variable can hold a child object, because a Cat is an Animal.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm3-5',
      title: 'Overriding and overloading',
      body: `
<p>These two words sound almost the same, but they are different ideas.</p>
<h3>Overriding</h3>
<p>A <b>subclass</b> writes its own version of a method that it got from the parent. Same name, same parameters, same return type. The new version <b>replaces</b> the old one for objects of the subclass.</p>
~~~
class Dog extends Animal {
    @Override
    void speak() {
        System.out.println("Woof");
    }
}
~~~
<p><code>@Override</code> is an {{annotation|ملاحظة للمترجم}}. It is optional, but use it: Java checks that you really override a parent method. If you make a typo in the name, Java tells you.</p>
<h3>Overloading</h3>
<p>The <b>same class</b> has two methods with the same name but <b>different parameters</b>. You learned this in Module 1.</p>
<div class="tblwrap"><table>
<tr><th></th><th>Overriding</th><th>Overloading</th></tr>
<tr><td>Where?</td><td>parent and subclass</td><td>usually the same class</td></tr>
<tr><td>Parameters</td><td>the same</td><td>different</td></tr>
<tr><td>Chosen when?</td><td>at runtime (the real object)</td><td>at compile time (the arguments)</td></tr>
</table></div>
<div class="warn">You cannot override <code>final</code> or <code>static</code> methods.</div>`,
      code: `class Animal {
    void speak() { System.out.println("..."); }
}
class Dog extends Animal {
    @Override
    void speak() { System.out.println("Woof"); }

    void speak(int times) {
        for (int i = 0; i < times; i++) speak();
    }
}`,
      steps: [
        { cap: 'Two ideas with similar names. Left: overriding. Right: overloading.' },
        { cap: '<b>Overriding:</b> Dog writes its own <code>speak()</code> with the <b>same</b> parameters. It replaces the parent version.', line: [2, 5, 6] },
        { cap: 'For a Dog object, <code>speak()</code> now prints Woof, not "...".', line: 6, out: 'Woof' },
        { cap: '<b>Overloading:</b> Dog also has <code>speak(int times)</code>. Same name, <b>different</b> parameters.', line: 8 },
        { cap: '<code>d.speak(2)</code> picks the version with an int. It calls speak() two times.', line: [8, 9], out: ['Woof', 'Woof'] }
      ],
      draw: function (k) {
        var L = k >= 1 && k <= 2, R = k >= 3;
        return [
          B('L', 10, 10, 265, 320, { tone: L ? 'accent' : 'muted', fill: 'none', dash: !L, r: 14, z: 0 }),
          B('R', 285, 10, 265, 320, { tone: R ? 'accent' : 'muted', fill: 'none', dash: !R, r: 14, z: 0 }),
          T('lh', 142, 40, 'Overriding', { anchor: 'middle', bold: true, size: 17, tone: L ? 'accent' : 'ink' }),
          T('rh', 417, 40, 'Overloading', { anchor: 'middle', bold: true, size: 17, tone: R ? 'accent' : 'ink' }),
          CLS('pa', 40, 65, 205, { name: 'Animal', methods: [{ t: 'speak() → "..."', tone: L ? 'muted' : undefined, strike: k === 2 }] }),
          CLS('pd', 40, 190, 205, { name: 'Dog', methods: [{ t: 'speak() → "Woof"', tone: L ? 'accent' : undefined, b: L }], tag: '@Override' }),
          A('pe', 142, 188, 142, 125, { tone: 'blue' }),
          T('ln', 142, 280, 'same name, same parameters\nchild replaces parent', { anchor: 'middle', size: 12.5, tone: 'muted' }),
          CLS('od', 305, 120, 225, { name: 'Dog', methods: [{ t: 'speak()', tone: R && k === 3 ? 'accent' : undefined }, { t: 'speak(int times)', tone: R ? 'accent' : undefined, b: R }] }),
          T('rn', 417, 280, 'same name, different parameters\nboth live in one class', { anchor: 'middle', size: 12.5, tone: 'muted' })
        ];
      },
      quiz: [
        { q: 'A subclass writes a method with the same name and same parameters as its parent. This is...', options: ['Overloading', 'Overriding', 'Encapsulation'], answer: 1, why: 'Same signature in the child = overriding.' },
        { type: 'fill', q: 'Add the annotation that asks Java to check the override.', code: 'class Cat extends Animal {\n    ___\n    void speak() {\n        System.out.println("Meow");\n    }\n}', answer: ['@Override'], why: '<code>@Override</code> catches typos in the method name.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm3-6',
      title: 'Abstract classes',
      body: `
<p>Some classes are too {{general|عام}} to have real objects. You can draw a circle or a square, but can you draw "a shape"? Not really.</p>
<p>For this, Java has <b>abstract classes</b>:</p>
~~~
abstract class Shape {
    abstract double area();
}
~~~
<ul>
<li>An <code>abstract</code> class <b>cannot</b> be used with <code>new</code>. <code>new Shape()</code> is an error.</li>
<li>An <code>abstract</code> method has <b>no body</b>, no <code>{ }</code>. It ends with <code>;</code>.</li>
<li>Every subclass <b>must</b> write the body of the abstract methods. If not, it must be abstract too.</li>
</ul>
~~~
class Circle extends Shape {
    double r = 2;
    double area() {
        return 3.14 * r * r;
    }
}
~~~
<p>An abstract class can also have normal attributes and normal methods with a body. It is a <b>partly finished</b> class.</p>
<div class="tip">Think of an abstract class as a form with some empty fields. Each subclass must fill in the empty fields.</div>`,
      code: `abstract class Shape {
    abstract double area();
}
class Circle extends Shape {
    double r = 2;
    double area() {
        return 3.14 * r * r;
    }
}
class Square extends Shape {
    double s = 3;
    double area() {
        return s * s;
    }
}
// in main:
Shape a = new Circle();
Shape b = new Square();
System.out.println(a.area());
System.out.println(b.area());`,
      steps: [
        { cap: '<code>Shape</code> is abstract. Its method <code>area()</code> has no body. It is an empty field to fill.', line: [1, 2] },
        { cap: '<code>new Shape()</code> is not allowed. You cannot create an object from an abstract class.' },
        { cap: 'Circle and Square extend Shape, and each one fills in <code>area()</code>.', line: ['4-9', '10-15'] },
        { cap: 'Now we can create real objects and call <code>area()</code>.', line: [19, 20], out: ['12.56', '9.0'] }
      ],
      draw: function (k) {
        return [
          CLS('sh', 180, 20, 200, { name: 'abstract Shape', methods: [{ t: 'area();  // no body', tone: 'muted' }], tone: 'blue', dash: true, italic: true, hi: k === 0 }),
          k === 1 && B('bad', 400, 30, 150, 44, { title: 'new Shape() ✗', mono: true, tone: 'red', dash: true, size: 12.5 }),
          k === 1 && T('badl', 475, 96, 'not allowed', { anchor: 'middle', tone: 'red', bold: true, size: 13 }),
          k >= 2 && CLS('ci', 30, 190, 220, { name: 'Circle', fields: ['r = 2'], methods: [{ t: 'area() { 3.14*r*r }', tone: 'teal', b: true }], hi: k === 2 }),
          k >= 2 && CLS('sq', 310, 190, 220, { name: 'Square', fields: ['s = 3'], methods: [{ t: 'area() { s*s }', tone: 'teal', b: true }], hi: k === 2 }),
          k >= 2 && A('e1', 140, 188, 250, 80, { tone: 'blue', label: 'extends' }),
          k >= 2 && A('e2', 420, 188, 310, 80, { tone: 'blue', label: 'extends' }),
          k === 3 && T('r1', 140, 312, 'area = 12.56', { anchor: 'middle', mono: true, bold: true, tone: 'accent' }),
          k === 3 && T('r2', 420, 312, 'area = 9.0', { anchor: 'middle', mono: true, bold: true, tone: 'accent' })
        ];
      },
      quiz: [
        { q: 'What is wrong here?', code: 'abstract class Vehicle { }\nVehicle v = new Vehicle();', options: ['Nothing', 'You cannot create an object of an abstract class', 'Vehicle needs a constructor'], answer: 1, why: 'Abstract classes cannot be used with <code>new</code>.' },
        { type: 'fill', q: 'Declare an abstract method <code>draw</code> with no body.', code: 'abstract class Shape {\n    ___ void draw()___\n}', answer: ['abstract', ';'], why: 'An abstract method has the keyword <code>abstract</code> and ends with <code>;</code>.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm3-7',
      title: 'Interfaces',
      body: `
<p>An <b>interface</b> is like a {{contract|عقد}}. It is a list of methods. A class that signs the contract <b>promises</b> to have all those methods.</p>
~~~
interface Swimmer {
    void swim();
}
~~~
<p>A class signs the contract with <code>implements</code>:</p>
~~~
class Duck implements Swimmer {
    public void swim() {
        System.out.println("Duck swims");
    }
}
~~~
<p>The big difference from classes: a class can implement <b>many</b> interfaces, but it can extend only <b>one</b> class.</p>
~~~
class Duck implements Swimmer, Flyer { ... }
~~~
<ul>
<li>Interface methods are <code>public</code> and <code>abstract</code> by default. That is why the class must write <code>public void swim()</code>.</li>
<li>You cannot create an object with <code>new Swimmer()</code>.</li>
<li>A variable can have an interface type: <code>Swimmer s = new Duck();</code></li>
</ul>
<div class="tip"><b>Abstract class or interface?</b> Use an abstract class when classes share code and an "is a" relationship. Use an interface to describe an <b>ability</b> ("can swim", "can fly") that very different classes can have.</div>`,
      code: `interface Swimmer {
    void swim();
}
interface Flyer {
    void fly();
}
class Duck implements Swimmer, Flyer {
    public void swim() {
        System.out.println("Duck swims");
    }
    public void fly() {
        System.out.println("Duck flies");
    }
}`,
      steps: [
        { cap: '<code>Swimmer</code> is an interface: a contract with one method, <code>swim()</code>.', line: '1-3' },
        { cap: '<code>Flyer</code> is another contract, with <code>fly()</code>.', line: '4-6' },
        { cap: '<code>Duck implements Swimmer, Flyer</code>. Duck signs <b>both</b> contracts.', line: 7 },
        { cap: 'Duck must write <code>swim()</code>. One promise done.', line: '8-10' },
        { cap: 'And <code>fly()</code>. Contract complete! If one method is missing, the code does not compile.', line: '11-13' },
        { cap: 'Remember: <b>extends</b> only one class, but <b>implements</b> many interfaces.' }
      ],
      draw: function (k) {
        var sw = k >= 3, fl = k >= 4;
        return [
          CLS('sw', 30, 30, 210, { name: 'Swimmer', methods: ['void swim();'], tone: 'teal', dash: true, tag: 'interface', hi: k === 0 }),
          k >= 1 && CLS('fl', 320, 30, 210, { name: 'Flyer', methods: ['void fly();'], tone: 'teal', dash: true, tag: 'interface', hi: k === 1 }),
          k >= 2 && CLS('duck', 160, 190, 240, { name: 'class Duck', methods: [{ t: 'swim()' + (sw ? '   ✓ done' : '   ? missing'), tone: sw ? 'teal' : 'red', b: k === 3 }, { t: 'fly()' + (fl ? '    ✓ done' : '    ? missing'), tone: fl ? 'teal' : 'red', b: k === 4 }], hi: k === 2 }),
          k >= 2 && A('i1', 230, 188, 135, 90, { tone: 'teal', dash: true, label: 'implements' }),
          k >= 2 && A('i2', 330, 188, 425, 90, { tone: 'teal', dash: true, label: 'implements' }),
          k === 5 && T('rule', 280, 318, 'extends: only ONE class  ·  implements: MANY interfaces', { anchor: 'middle', bold: true, tone: 'accent', size: 13.5 })
        ];
      },
      quiz: [
        { q: 'Which line is correct?', options: ['`class A extends B, C`', '`class A implements B, C`', '`class A implements extends B`'], answer: 1, why: 'A class can implement many interfaces, separated by commas.' },
        { type: 'fill', q: 'Make <code>Robot</code> sign the <code>Worker</code> contract.', code: 'interface Worker {\n    void work();\n}\nclass Robot ___ Worker {\n    public void work() {\n        System.out.println("Working");\n    }\n}', answer: ['implements'], why: 'Classes use <code>implements</code> for interfaces.' },
        { q: 'A class implements an interface but forgets one method. What happens?', options: ['Java writes it automatically', 'Compile error', 'The method does nothing'], answer: 1, why: 'The contract is not complete, so the code does not compile.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm3-8',
      title: 'Type casting',
      body: `
<p><b>Casting</b> means changing a value from one type to another.</p>
<h3>Automatic: small to big</h3>
<p>Moving an <code>int</code> into a <code>double</code> is safe. A <code>double</code> is a bigger box. Java does it for you:</p>
~~~
int a = 10;
double b = a;    // b is 10.0
~~~
<h3>Manual: big to small</h3>
<p>Moving a <code>double</code> into an <code>int</code> can lose data. Java will not do it alone. You must write the type in parentheses:</p>
~~~
double c = 3.99;
int d = (int) c;   // d is 3
~~~
<div class="warn">The decimal part is <b>cut off</b>, not {{rounded|مقرّب}}. <code>(int) 3.99</code> is 3, not 4.</div>
<p>You can also cast between <code>char</code> and <code>int</code>. Every character has a number:</p>
~~~
char ch = 'A';
int code = (int) ch;   // 65
~~~
<p>Think of cups: you can pour a small cup into a big cup with no problem. But if you pour a big cup into a small cup, some water falls out.</p>`,
      code: `int a = 10;
double b = a;          // automatic: 10.0
double c = 3.99;
int d = (int) c;       // manual: 3`,
      steps: [
        { cap: '<code>int a = 10;</code> A small box with the value 10.', line: 1 },
        { cap: 'int → double: small to big. Java does it {{automatically|تلقائياً}}. 10 becomes 10.0.', line: 2 },
        { cap: '<code>double c = 3.99;</code> A big box with a decimal number.', line: 3 },
        { cap: 'double → int: big to small. You must write <code>(int)</code>. The <b>.99</b> falls out and is lost!', line: 4 }
      ],
      draw: function (k) {
        return [
          B('ia', 40, 60, 120, 64, { tag: 'int a', title: '10', mono: true, tone: 'blue', size: 18 }),
          k >= 1 && B('db', 340, 50, 190, 84, { tag: 'double b', title: '10.0', mono: true, tone: 'teal', size: 18, hi: k === 1 }),
          k >= 1 && A('w', 162, 92, 336, 92, { tone: 'teal', label: 'automatic (safe)' }),
          k >= 2 && B('dc', 340, 210, 190, 84, { tag: 'double c', title: '3.99', mono: true, tone: 'teal', size: 18, hi: k === 2 }),
          k >= 3 && B('id', 40, 220, 120, 64, { tag: 'int d', title: '3', mono: true, tone: 'blue', size: 18, hi: true }),
          k >= 3 && A('n', 336, 252, 164, 252, { tone: 'accent', label: '(int) manual' }),
          k >= 3 && B('lost', 220, 290, 64, 34, { title: '.99', mono: true, tone: 'red', fill: 'solid', from: [220, 238], o: 0.85 }),
          k >= 3 && T('lostl', 292, 313, 'lost', { tone: 'red', bold: true, size: 13 }),
          T('sz1', 100, 160, 'small box', { anchor: 'middle', tone: 'muted', size: 12 }),
          T('sz2', 435, 160, 'big box', { anchor: 'middle', tone: 'muted', size: 12, o: k >= 1 ? 1 : 0 })
        ];
      },
      quiz: [
        { q: 'What is <code>(int) 7.8</code>?', options: ['8', '7', '7.8'], answer: 1, why: 'Casting to int cuts off the decimal part.' },
        { type: 'fill', q: 'Cast the double to an int.', code: 'double price = 19.5;\nint p = (___) price;', answer: ['int'], why: 'Write the new type in parentheses.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm3-9',
      title: 'Upcasting and downcasting',
      body: `
<p>Casting also works with objects, when classes are connected by inheritance.</p>
<h3>Upcasting (automatic)</h3>
<p>Child → parent. It is always safe, because a Cat is always an Animal:</p>
~~~
Animal a = new Cat();
~~~
<p>But now, through <code>a</code>, you can only use what an <b>Animal</b> has. <code>a.climb()</code> is an error, even if the real object is a Cat. The variable type decides what you can <b>see</b>.</p>
<h3>Downcasting (manual)</h3>
<p>Parent → child. You must write the type in parentheses:</p>
~~~
Cat c = (Cat) a;
c.climb();   // OK now
~~~
<div class="warn">Downcasting can fail! If <code>a</code> holds a Dog, then <code>(Cat) a</code> throws a <code>ClassCastException</code> when the program runs.</div>
<p>To be safe, check first with <code>instanceof</code>:</p>
~~~
if (a instanceof Cat) {
    Cat c = (Cat) a;
    c.climb();
}
~~~`,
      code: `Animal a = new Cat();      // upcasting (automatic)
a.makeSound();
Cat c = (Cat) a;           // downcasting (manual)
c.climb();
Dog d = (Dog) a;           // ClassCastException!`,
      steps: [
        { cap: 'Cat extends Animal. Cat has one extra method: <code>climb()</code>.' },
        { cap: '<b>Upcasting:</b> a Cat object in an Animal variable. Automatic and safe.', line: 1 },
        { cap: 'Through <code>a</code>, Java only sees Animal methods. <code>a.makeSound()</code> is OK. <code>climb()</code> is hidden.', line: 2, out: 'Meow' },
        { cap: '<b>Downcasting:</b> <code>(Cat) a</code>. Now the variable c can see everything a Cat has.', line: [3, 4], out: 'Climbing' },
        { cap: 'Wrong cast! The object is a Cat, not a Dog. Java throws a <code>ClassCastException</code>.', line: 5 }
      ],
      draw: function (k) {
        var viaA = k === 2, viaC = k === 3;
        return [
          CLS('an', 30, 30, 170, { name: 'Animal', methods: ['makeSound()'] }),
          CLS('ca', 30, 170, 170, { name: 'Cat', methods: ['makeSound()', { t: 'climb()', tone: 'accent', b: true }] }),
          A('ex', 115, 168, 115, 90, { tone: 'blue', label: 'extends', la: 'start', lx: 8 }),
          k >= 1 && B('va', 330, 30, 200, 40, { title: 'Animal a', mono: true, tone: 'blue', hi: viaA }),
          k >= 1 && OBJ('obj', 330, 112, 200, { name: 'Cat object', fields: [{ t: 'makeSound()', tone: viaA || viaC ? 'accent' : undefined, b: viaA || viaC }, { t: 'climb()', tone: viaA ? 'muted' : viaC ? 'accent' : undefined, strike: viaA, b: viaC }] }),
          k >= 1 && A('ra', 430, 72, 430, 110, { tone: viaA ? 'accent' : 'ink' }),
          viaA && T('hid', 540, 168, 'hidden for a', { anchor: 'end', tone: 'muted', size: 12, italic: true }),
          k >= 3 && B('vc', 330, 230, 200, 40, { title: 'Cat c = (Cat) a', mono: true, tone: 'teal', hi: viaC, size: 12.5 }),
          k >= 3 && A('rc', 430, 228, 430, 190, { tone: viaC ? 'accent' : 'ink' }),
          k === 4 && B('bad', 30, 285, 270, 40, { title: 'Dog d = (Dog) a;   ✗', mono: true, tone: 'red', dash: true, size: 12.5 }),
          k === 4 && A('badA', 302, 300, 328, 160, { tone: 'red', dash: true, label: 'not a Dog!', la: 'end', lx: -6 })
        ];
      },
      quiz: [
        { q: '<code>Animal a = new Cat();</code> Can you call <code>a.climb()</code>?', options: ['Yes, the object is a Cat', 'No, the variable type Animal has no climb()', 'Only inside a loop'], answer: 1, why: 'The variable type decides which methods you can use.' },
        { type: 'fill', q: 'Check the type before you downcast.', code: 'if (a ___ Cat) {\n    Cat c = (Cat) a;\n}', answer: ['instanceof'], why: '<code>instanceof</code> checks the real type of the object.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm3-10',
      title: 'Anonymous classes',
      body: `
<p>Sometimes you need a class with a small change, but only <b>one time</b>, for <b>one object</b>. Writing a whole new class for that is too much work.</p>
<p>An <b>anonymous class</b> is a class with <b>no name</b>. You write it at the same moment you create the object:</p>
~~~
Machine m2 = new Machine() {
    @Override
    void start() {
        System.out.println("Wooooo");
    }
};
~~~
<ul>
<li>After <code>new Machine()</code>, open <code>{ }</code> and override the methods you want.</li>
<li>Don't forget the <code>;</code> at the end, after the <code>}</code>.</li>
<li>The change is only for this one object. The <code>Machine</code> class itself does not change.</li>
</ul>
<p>Behind the scenes, Java makes a hidden subclass of Machine with no name, and creates one object from it.</p>
<div class="tip">Anonymous classes are common with interfaces, for example to give a <code>Runnable</code> to a thread (Module 6).</div>`,
      code: `class Machine {
    void start() {
        System.out.println("Starting...");
    }
}
// in main:
Machine m1 = new Machine();
Machine m2 = new Machine() {
    @Override
    void start() {
        System.out.println("Wooooo");
    }
};
m1.start();
m2.start();`,
      steps: [
        { cap: 'A normal class <code>Machine</code>. Its <code>start()</code> prints "Starting...".', line: '1-5' },
        { cap: '<code>m1</code> is a normal Machine object.', line: 7 },
        { cap: '<code>m2</code> is special: a class with <b>no name</b> wraps it and overrides <code>start()</code>.', line: '8-13' },
        { cap: '<code>m1.start()</code> uses the normal method.', line: 14, out: 'Starting...' },
        { cap: '<code>m2.start()</code> uses the new version. Only m2 is changed; the Machine class stays the same.', line: 15, out: 'Wooooo' }
      ],
      draw: function (k) {
        return [
          CLS('mc', 30, 40, 230, { name: 'class Machine', methods: ['start() → "Starting..."'], hi: k === 0 }),
          k >= 1 && OBJ('m1', 330, 40, 200, { name: 'm1', fields: [{ t: 'start() → "Starting..."', tone: k === 3 ? 'accent' : undefined, b: k === 3 }], hi: k === 1 || k === 3 }),
          k >= 1 && A('n1', 262, 68, 326, 68, { tone: 'accent', label: 'new' }),
          k >= 2 && B('anon', 310, 150, 240, 140, { tone: 'accent', fill: 'none', dash: true, r: 14, tag: 'class with no name', z: 0 }),
          k >= 2 && OBJ('m2', 330, 185, 200, { name: 'm2', fields: [{ t: 'start() → "Wooooo"', tone: 'accent', b: k === 4 }], hi: k === 2 || k === 4 }),
          k >= 2 && T('ex', 430, 280, 'extends Machine', { anchor: 'middle', tone: 'accent', size: 12, italic: true }),
          k >= 2 && A('n2', 145, 100, 306, 215, { tone: 'accent', label: 'new Machine() { ... }', bend: 20 })
        ];
      },
      quiz: [
        { q: 'What is special about an anonymous class?', options: ['It has no name and is used for one object', 'It cannot have methods', 'It must be abstract'], answer: 0, why: 'It is a class without a name, created together with its object.' },
        { q: 'What is missing at the end of an anonymous class?', code: 'Machine m = new Machine() {\n    void start() { }\n}', options: ['A `)`', 'A `;`', 'Nothing'], answer: 1, why: 'The whole thing is one statement, so it ends with <code>;</code>.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm3-11',
      title: 'Inner classes',
      body: `
<p>You can write a class <b>inside</b> another class. This is an <b>inner class</b> (also called a nested class).</p>
~~~
class Robot {
    private int id = 7;

    private class Brain {
        void think() {
            System.out.println("Robot " + id + " is thinking");
        }
    }
}
~~~
<p>Why do this?</p>
<ul>
<li><b>Grouping:</b> the Brain belongs to the Robot. It makes no sense alone.</li>
<li><b>Access:</b> the inner class can use <b>all</b> members of the outer class, even the <code>private</code> ones like <code>id</code>.</li>
<li><b>Hiding:</b> a <code>private</code> inner class is invisible outside the outer class.</li>
</ul>
<p>The outer class can create and use its inner class normally:</p>
~~~
void start() {
    Brain b = new Brain();
    b.think();
}
~~~
<div class="tip">Picture a box inside a box. The small box can see everything in the big box. People outside cannot see the small box if it is private.</div>`,
      code: `class Robot {
    private int id = 7;

    private class Brain {
        void think() {
            System.out.println("Robot " + id + " is thinking");
        }
    }

    void start() {
        Brain b = new Brain();
        b.think();
    }
}`,
      steps: [
        { cap: 'The outer class <code>Robot</code> has a private attribute <code>id</code>.', line: [1, 2] },
        { cap: 'Inside Robot, there is a class <code>Brain</code>. A class inside a class.', line: '4-8' },
        { cap: 'Brain can read <code>id</code>, even though id is private. They are in the same outer class.', line: 6 },
        { cap: 'Robot\'s method <code>start()</code> creates a Brain and calls <code>think()</code>.', line: '10-13', out: 'Robot 7 is thinking' },
        { cap: 'Brain is private. Code outside Robot cannot use it.' }
      ],
      draw: function (k) {
        return [
          B('robot', 40, 20, 480, 250, { title: 'class Robot', band: true, tone: 'blue', r: 16, z: 0, hi: k === 0 }),
          B('id', 70, 75, 160, 46, { tag: 'private', title: 'id = 7', mono: true, tone: 'ink', fill: 'none', hi: k === 2 }),
          k >= 1 && CLS('brain', 280, 75, 215, { name: 'private class Brain', methods: [{ t: 'think()', tone: k === 3 ? 'accent' : undefined, b: k === 3 }], tone: 'teal', size: 12.5, hi: k === 1 }),
          k === 2 && A('rd', 278, 110, 232, 100, { tone: 'teal', label: 'can read', bend: 12 }),
          k >= 3 && B('start', 70, 165, 200, boxH(2), { title: 'start()', lines: ['new Brain()', 'b.think()'], tone: 'blue', mono: true, hi: k === 3 }),
          k === 3 && A('st', 272, 205, 340, 135, { tone: 'accent', bend: -12 }),
          k === 4 && T('outside', 300, 322, 'Outside code:  new Robot.Brain()  ✗', { anchor: 'middle', tone: 'red', mono: true, bold: true, size: 12.5 }),
          k === 4 && A('blk', 380, 305, 390, 136, { tone: 'red', dash: true, label: 'blocked', la: 'start', lx: 10 })
        ];
      },
      quiz: [
        { q: 'Can an inner class use a <code>private</code> attribute of its outer class?', options: ['Yes', 'No'], answer: 0, why: 'The inner class is part of the outer class, so it sees everything.' },
        { q: 'What is a good reason to use an inner class?', options: ['To make the program run faster', 'To group a helper class with the class it belongs to', 'Java requires it'], answer: 1, why: 'Inner classes help with grouping and hiding.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm3-12',
      title: 'The equals() method',
      body: `
<p>How do you check if two objects are "the same"? There are two very different questions:</p>
<ol>
<li>Are they the <b>same object</b> in memory?</li>
<li>Do they have the <b>same content</b>?</li>
</ol>
<h3>== compares references</h3>
<p>For objects, <code>==</code> checks question 1: do both variables point to the same object?</p>
<h3>equals() compares content</h3>
~~~
String s1 = new String("hi");
String s2 = new String("hi");
s1 == s2;         // false: two different objects
s1.equals(s2);    // true: same text
~~~
<div class="warn">To compare Strings, always use <code>equals()</code>, not <code>==</code>.</div>
<h3>equals() in your own classes</h3>
<p>Every class gets <code>equals()</code> from the class <code>Object</code> (the parent of all classes). But the default version works like <code>==</code>. To compare the fields, you must <b>override</b> it:</p>
~~~
class Point {
    int x, y;
    @Override
    public boolean equals(Object o) {
        Point p = (Point) o;
        return x == p.x && y == p.y;
    }
}
~~~
<div class="tip">Many {{IDEs|برامج كتابة الكود}}, like IntelliJ or Eclipse, can write <code>equals()</code> for you.</div>`,
      code: `String s1 = new String("hi");
String s2 = new String("hi");
System.out.println(s1 == s2);
System.out.println(s1.equals(s2));`,
      steps: [
        { cap: 's1 points to a new String object with the text "hi".', line: 1 },
        { cap: 's2 points to <b>another</b> new object. Same text, but a different object.', line: 2 },
        { cap: '<code>s1 == s2</code> asks: same object? The arrows go to different places. <b>false</b>.', line: 3, out: 'false' },
        { cap: '<code>s1.equals(s2)</code> asks: same content? Both say "hi". <b>true</b>.', line: 4, out: 'true' },
        { cap: 'For your own classes, override <code>equals()</code> to compare the fields.' }
      ],
      draw: function (k) {
        var eq = k === 2, ct = k === 3;
        return [
          B('s1', 30, 70, 130, 48, { tag: 'String', title: 's1', mono: true, tone: 'blue', size: 16 }),
          k >= 1 && B('s2', 30, 200, 130, 48, { tag: 'String', title: 's2', mono: true, tone: 'blue', size: 16 }),
          OBJ('o1', 330, 60, 180, { name: 'String object 1', fields: [{ t: 'text = "hi"', tone: ct ? 'teal' : undefined, b: ct }], hi: ct }),
          k >= 1 && OBJ('o2', 330, 190, 180, { name: 'String object 2', fields: [{ t: 'text = "hi"', tone: ct ? 'teal' : undefined, b: ct }], hi: ct }),
          A('r1', 162, 94, 326, 85, { tone: eq ? 'red' : 'ink' }),
          k >= 1 && A('r2', 162, 224, 326, 215, { tone: eq ? 'red' : 'ink' }),
          ct && A('cmp', 520, 105, 520, 186, { tone: 'teal', head: false, label: 'same text', la: 'end', lx: -6 }),
          eq && T('res', 280, 310, 's1 == s2   →   false   (two different objects)', { anchor: 'middle', mono: true, bold: true, tone: 'red', size: 13 }),
          ct && T('res2', 280, 310, 's1.equals(s2)   →   true   (same content)', { anchor: 'middle', mono: true, bold: true, tone: 'teal', size: 13 }),
          k === 4 && T('res3', 280, 310, '== : same object?    equals() : same content?', { anchor: 'middle', mono: true, bold: true, tone: 'accent', size: 13 })
        ];
      },
      quiz: [
        { q: 'Which is the correct way to compare two Strings by their text?', options: ['`a == b`', '`a.equals(b)`', '`a = b`'], answer: 1, why: '<code>equals()</code> compares the content.' },
        { q: 'For objects, what does <code>==</code> check?', options: ['If they have the same fields', 'If they are the same object in memory', 'If they have the same class'], answer: 1, why: '<code>==</code> compares the references (addresses).' }
      ]
    }
  ],
  challenge: {
    title: 'Vehicles and wheels',
    task: `
<p>Practice abstract classes and polymorphism.</p>
<ol>
<li>Create an <code>abstract class Vehicle</code> with an abstract method <code>int wheels();</code></li>
<li>Create <code>class Car</code> that extends Vehicle. Its <code>wheels()</code> returns <code>4</code>.</li>
<li>Create <code>class Bike</code> that extends Vehicle. Its <code>wheels()</code> returns <code>2</code>.</li>
<li>In <code>main</code>, write <code>Vehicle v = new Bike();</code> and print <code>v.wheels()</code>.</li>
</ol>`,
    starter: `// 1. abstract class Vehicle


// 2. class Car


// 3. class Bike


public class Main {
    public static void main(String[] args) {
        // 4. create a Bike in a Vehicle variable and print its wheels
    }
}`,
    checks: [
      { re: /abstract\s+class\s+Vehicle/, label: '<code>abstract class Vehicle</code>' },
      { re: /abstract\s+int\s+wheels\s*\(\s*\)\s*;/, label: 'Abstract method <code>abstract int wheels();</code>' },
      { re: /class\s+Car\s+extends\s+Vehicle/, label: '<code>class Car extends Vehicle</code>' },
      { re: /class\s+Bike\s+extends\s+Vehicle/, label: '<code>class Bike extends Vehicle</code>' },
      { re: /return\s+4\s*;[\s\S]*return\s+2\s*;|return\s+2\s*;[\s\S]*return\s+4\s*;/, label: 'One <code>wheels()</code> returns 4 and the other returns 2' },
      { re: /Vehicle\s+\w+\s*=\s*new\s+Bike\s*\(\s*\)/, label: '<code>Vehicle v = new Bike();</code>' },
      { re: /System\.out\.println\s*\(\s*\w+\.wheels\s*\(\s*\)\s*\)/, label: 'Print <code>v.wheels()</code>' }
    ],
    solution: `abstract class Vehicle {
    abstract int wheels();
}

class Car extends Vehicle {
    int wheels() {
        return 4;
    }
}

class Bike extends Vehicle {
    int wheels() {
        return 2;
    }
}

public class Main {
    public static void main(String[] args) {
        Vehicle v = new Bike();
        System.out.println(v.wheels());
    }
}`,
    output: '2'
  }
});
