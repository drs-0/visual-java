addModule({
  id: 'm2',
  title: 'Classes & Objects',
  blurb: 'Classes are {{blueprints|مخططات}}. Objects are the real things you build from them.',
  lessons: [
    /* ------------------------------------------------------------ */
    {
      id: 'm2-1',
      title: 'Classes and objects',
      body: `
<p>Java is an <b>object-oriented</b> language. This means we build programs from <b>objects</b>.</p>
<p>A <b>class</b> is a {{blueprint|مخطط}}, a plan. An <b>object</b> is a real thing that you build from the plan.</p>
<p>Think about a house plan. The plan is not a house. You cannot live in it. But from one plan, you can build many houses. Each house can have a different color. The plan is the class. Each house is an object.</p>
~~~
class Car {
    String color;
}
~~~
<p>This class says: "every car has a <code>color</code>." Variables inside a class are called <b>attributes</b> (or <b>fields</b>).</p>
<h3>Creating objects</h3>
<p>Use the keyword <code>new</code> to create an object:</p>
~~~
Car c1 = new Car();
c1.color = "red";
~~~
<ul>
<li><code>Car c1</code> makes a variable of type <code>Car</code>.</li>
<li><code>new Car()</code> builds a new object from the class.</li>
<li><code>c1.color</code> uses the <b>dot</b> (<code>.</code>) to reach the attribute of this object.</li>
</ul>
<div class="tip">Each object has its <b>own</b> copy of the attributes. Changing <code>c1.color</code> does not change <code>c2.color</code>.</div>`,
      code: `class Car {
    String color;
}

public class Main {
    public static void main(String[] args) {
        Car c1 = new Car();
        c1.color = "red";
        Car c2 = new Car();
        c2.color = "blue";
    }
}`,
      steps: [
        { cap: 'The class <code>Car</code> is the blueprint. It says every car has a <code>color</code>.', line: '1-3' },
        { cap: '<code>new Car()</code> builds the first object, <b>c1</b>. Its color is empty for now (<code>null</code>).', line: 7 },
        { cap: '<code>c1.color = "red";</code> The dot reaches the color of c1.', line: 8 },
        { cap: 'A second object, <b>c2</b>, from the same blueprint.', line: 9 },
        { cap: 'c2 gets its own color. <b>One class, two different objects.</b>', line: 10 }
      ],
      draw: function (k) {
        return [
          CLS('car', 30, 120, 190, { name: 'class Car', fields: ['String color;'], dash: true, tag: 'blueprint (class)', hi: k === 0 }),
          k >= 1 && OBJ('c1', 330, 50, 200, { name: 'c1 : Car', fields: [{ t: 'color = ' + (k >= 2 ? '"red"' : 'null'), tone: k === 2 ? 'accent' : undefined, b: k === 2 }], tag: 'object', hi: k === 1 || k === 2 }),
          k >= 3 && OBJ('c2', 330, 200, 200, { name: 'c2 : Car', fields: [{ t: 'color = ' + (k >= 4 ? '"blue"' : 'null'), tone: k === 4 ? 'accent' : undefined, b: k === 4 }], tag: 'object', hi: k >= 3 }),
          k >= 1 && A('n1', 222, 140, 326, 80, { tone: 'accent', label: 'new Car()', bend: -12 }),
          k >= 3 && A('n2', 222, 160, 326, 228, { tone: 'accent', label: 'new Car()', bend: 12 }),
          k === 4 && T('note', 125, 300, '1 class  →  2 objects', { anchor: 'middle', bold: true, size: 15, tone: 'teal' })
        ];
      },
      quiz: [
        { q: 'Which sentence is true?', options: ['A class is a real thing, an object is a plan', 'A class is a plan, an object is built from the plan', 'Class and object mean the same thing'], answer: 1, why: 'The class is the blueprint. The object is the real thing.' },
        { type: 'fill', q: 'Create a new <code>Dog</code> object.', code: 'Dog d = ___ Dog();', answer: ['new'], why: '<code>new</code> builds an object from a class.' },
        { q: 'You change <code>c1.color</code>. What happens to <code>c2.color</code>?', options: ['It changes too', 'It does not change', 'It becomes null'], answer: 1, why: 'Every object has its own copy of the attributes.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm2-2',
      title: 'Attributes and behavior',
      body: `
<p>An object has two kinds of things inside:</p>
<ul>
<li><b>State</b>: the data it has. These are the <b>attributes</b>. A dog has a name and an age.</li>
<li><b>Behavior</b>: the actions it can do. These are the <b>methods</b>. A dog can bark and eat.</li>
</ul>
~~~
class Dog {
    String name;

    void bark() {
        System.out.println(name + " says Woof");
    }
}
~~~
<p>Notice: the method <code>bark()</code> has no <code>static</code>. It belongs to each object. When it uses <code>name</code>, it means the name of <b>this</b> dog.</p>
<p>Call a method on an object with the dot:</p>
~~~
Dog d = new Dog();
d.name = "Rex";
d.bark();      // Rex says Woof
~~~
<div class="tip">Class names start with a {{capital letter|حرف كبير}}: <code>Dog</code>, <code>Car</code>. Variable and method names start with a small letter: <code>name</code>, <code>bark()</code>.</div>`,
      code: `class Dog {
    String name;

    void bark() {
        System.out.println(name + " says Woof");
    }
}

// in main:
Dog d = new Dog();
d.name = "Rex";
d.bark();`,
      steps: [
        { cap: 'An attribute is the {{state|الحالة}} of the object: the data it keeps.', line: 2 },
        { cap: 'A method is the {{behavior|السلوك}}: something the object can do.', line: '4-6' },
        { cap: 'We create a Dog object, <b>d</b>.', line: 10 },
        { cap: '<code>d.name = "Rex";</code> sets the state of this dog.', line: 11 },
        { cap: '<code>d.bark();</code> runs the behavior. It uses the name of <b>this</b> dog.', line: [12, 5], out: 'Rex says Woof' }
      ],
      draw: function (k) {
        return [
          CLS('dog', 30, 50, 220, { name: 'class Dog', fields: [{ t: 'String name;', tone: k === 0 ? 'accent' : undefined, b: k === 0 }], methods: [{ t: 'void bark()', tone: k === 1 || k === 4 ? 'accent' : undefined, b: k === 1 || k === 4 }] }),
          T('lst', 262, 102, '← state (data)', { tone: k === 0 ? 'accent' : 'muted', bold: k === 0, size: 13 }),
          T('lbh', 262, 138, '← behavior (action)', { tone: k === 1 ? 'accent' : 'muted', bold: k === 1, size: 13 }),
          k >= 2 && OBJ('d', 320, 200, 210, { name: 'd : Dog', fields: [{ t: 'name = ' + (k >= 3 ? '"Rex"' : 'null'), tone: k === 3 ? 'accent' : undefined, b: k === 3 }], hi: k === 2 }),
          k === 2 && A('new', 140, 146, 316, 222, { tone: 'accent', label: 'new Dog()', bend: 22 }),
          k === 4 && A('call', 318, 214, 252, 140, { tone: 'teal', label: 'd.bark()', bend: -14 })
        ];
      },
      quiz: [
        { q: 'In a class, methods describe the...', options: ['state of the object', 'behavior of the object', 'name of the class'], answer: 1, why: 'Attributes = state. Methods = behavior.' },
        { type: 'fill', q: 'Call the method <code>run()</code> on the object <code>c</code>.', code: 'Cat c = new Cat();\nc___run();', answer: ['.'], why: 'Use the dot to reach the methods and attributes of an object.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm2-3',
      title: 'Constructors',
      body: `
<p>A <b>constructor</b> is a special method. It runs automatically when you create an object with <code>new</code>. We use it to give the object its first values.</p>
~~~
class Car {
    String color;

    Car(String c) {
        color = c;
    }
}
~~~
<p>Two rules make a constructor different from a normal method:</p>
<ul>
<li>Its name is <b>exactly</b> the same as the class name: <code>Car</code>.</li>
<li>It has <b>no return type</b>. Not even <code>void</code>.</li>
</ul>
<p>Now you can create and set up the object in one line:</p>
~~~
Car a = new Car("red");
~~~
<h3>The keyword this</h3>
<p>Often the parameter has the same name as the attribute. Use <code>this</code> to mean "the attribute of this object":</p>
~~~
Car(String color) {
    this.color = color;
}
~~~
<div class="tip">If you don't write any constructor, Java gives you an empty one for free: <code>Car() { }</code>. This is called the <b>default constructor</b>. You can also write more than one constructor (overloading), each with different parameters.</div>`,
      code: `class Car {
    String color;
    Car(String c) {
        color = c;
    }
}

// in main:
Car a = new Car("red");
Car b = new Car("green");`,
      steps: [
        { cap: 'This is the constructor. Same name as the class, and no return type.', line: '3-5' },
        { cap: '<code>new Car("red")</code> calls the constructor and sends "red".', line: 9 },
        { cap: 'Inside the constructor, <code>c = "red"</code>. The line <code>color = c;</code> saves it.', line: [3, 4] },
        { cap: 'The new object is ready, with <code>color = "red"</code> from the start.', line: 9 },
        { cap: 'Another object with another value. The same constructor builds it.', line: 10 }
      ],
      draw: function (k) {
        var green = k === 4;
        return [
          B('ctor', 200, 120, 160, boxH(2), { title: 'Car(String c)', lines: ['color = c;', '// set up'], tone: 'blue', mono: true, tag: 'constructor', hi: k === 0 || k === 2 }),
          k >= 1 && B('call', 20, 140, 150, 48, { title: green ? 'new Car("green")' : 'new Car("red")', mono: true, tone: 'accent', size: 12, hi: k === 1 || k === 4 }),
          k >= 1 && A('c2c', 172, 164, 198, 164, { tone: 'accent' }),
          k >= 1 && k <= 2 && B('chip', k === 1 ? 40 : 215, k === 1 ? 92 : 70, 130, 36, { title: k === 1 ? '"red"' : 'c = "red"', mono: true, tone: 'accent', fill: 'solid', size: 12.5 }),
          k >= 3 && A('c2o', 362, 165, 394, 85, { tone: 'teal', label: 'object', bend: -10 }),
          k >= 3 && OBJ('oa', 395, 50, 145, { name: 'a : Car', fields: ['color = "red"'], hi: k === 3 }),
          k >= 4 && A('c2o2', 362, 175, 394, 230, { tone: 'teal', bend: 10 }),
          k >= 4 && OBJ('ob', 395, 200, 145, { name: 'b : Car', fields: ['color = "green"'], hi: true })
        ];
      },
      quiz: [
        { q: 'Which line is a correct constructor for the class <code>Book</code>?', options: ['`void Book() { }`', '`Book() { }`', '`book() { }`'], answer: 1, why: 'Same name as the class (with the capital B) and no return type.' },
        { type: 'fill', q: 'Complete the constructor. Use <code>this</code> to set the attribute.', code: 'class Pet {\n    String name;\n    ___(String name) {\n        ___.name = name;\n    }\n}', answer: ['Pet', 'this'], why: 'The constructor is named <code>Pet</code>, and <code>this.name</code> is the attribute of the object.' },
        { q: 'When does a constructor run?', options: ['When you call it by its name', 'When you create an object with `new`', 'When the program ends'], answer: 1, why: '<code>new</code> runs the constructor automatically.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm2-4',
      title: 'Access modifiers',
      body: `
<p><b>Access modifiers</b> are keywords that decide <b>who can use</b> a class, an attribute or a method.</p>
<div class="tblwrap"><table>
<tr><th>Modifier</th><th>Who can use it?</th></tr>
<tr><td><code>private</code></td><td>Only the same class</td></tr>
<tr><td>(no keyword)</td><td>The same class and the same <b>package</b> (folder)</td></tr>
<tr><td><code>protected</code></td><td>The same package, and also <b>subclasses</b> in other packages</td></tr>
<tr><td><code>public</code></td><td>Everyone, everywhere</td></tr>
</table></div>
<p>Look at this class:</p>
~~~
public class BankAccount {
    private double balance;
    public void deposit(double x) {
        balance += x;
    }
}
~~~
<p>Nobody outside can write <code>account.balance = 1000000;</code>. That is good! The only way to add money is the <code>public</code> method <code>deposit()</code>.</p>
<div class="tip"><b>Simple rule for now:</b> make attributes <code>private</code>, and make the methods that other classes need <code>public</code>.</div>
<p>You will learn about <b>packages</b> at the end of this module, and about <b>subclasses</b> in Module 3.</p>`,
      code: `public class BankAccount {
    private double balance;
    String owner;
    protected int id;
    public void deposit(double x) {
        balance += x;
    }
}`,
      steps: [
        { cap: '<code>private</code>: only code inside the same class can use <code>balance</code>.', line: 2 },
        { cap: 'No keyword (default): the class and every class in the same {{package|حزمة (مجلد)}}.', line: 3 },
        { cap: '<code>protected</code>: the same package, plus {{subclasses|الكلاسات الابن}} in other packages.', line: 4 },
        { cap: '<code>public</code>: every class can use it, from anywhere.', line: 5 }
      ],
      draw: function (k) {
        var on = function (lvl) { return k >= lvl; };
        var zone = function (id, lvl, x, y, w, h, label) {
          return [
            B(id, x, y, w, h, { tone: on(lvl) ? 'teal' : 'muted', fill: on(lvl) ? 'soft' : 'none', dash: !on(lvl), r: 14, z: 0 }),
            T(id + 'l', x + 14, y + 22, label, { bold: true, size: 13, tone: on(lvl) ? 'teal' : 'muted' })
          ];
        };
        var names = ['private', '(default)', 'protected', 'public'];
        var texts = ['only inside the class', 'class + same package', 'package + subclasses', 'everyone, everywhere'];
        return [
          zone('z3', 3, 10, 10, 540, 320, 'Everywhere (any class)'),
          zone('z2', 2, 40, 45, 480, 245, 'Subclasses (also in other packages)'),
          zone('z1', 1, 70, 80, 420, 175, 'Same package'),
          zone('z0', 0, 100, 115, 360, 105, 'Same class: BankAccount'),
          T('mods', 280, 170, names.slice(0, k + 1).join('   ·   '), { anchor: 'middle', mono: true, bold: true, tone: 'accent', size: 13 }),
          T('sum', 280, 318, names[k] + '  →  ' + texts[k], { anchor: 'middle', bold: true, size: 14, tone: 'accent' })
        ];
      },
      quiz: [
        { q: 'Who can use a <code>private</code> attribute?', options: ['Everyone', 'Only the same package', 'Only the same class'], answer: 2, why: '<code>private</code> is the most closed level.' },
        { q: 'Which modifier opens a member to everyone?', options: ['`protected`', '`public`', 'no keyword'], answer: 1, why: '<code>public</code> = everyone, everywhere.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm2-5',
      title: 'Getters and setters',
      body: `
<p>We made the attributes <code>private</code>. But other classes still need to <b>read</b> or <b>change</b> them sometimes. The answer: <b>getters</b> and <b>setters</b>.</p>
<ul>
<li>A <b>getter</b> gives back the value. Name: <code>get</code> + attribute name, like <code>getAge()</code>.</li>
<li>A <b>setter</b> changes the value. Name: <code>set</code> + attribute name, like <code>setAge()</code>.</li>
</ul>
~~~
class Person {
    private int age;

    public int getAge() {
        return age;
    }
    public void setAge(int a) {
        if (a >= 0) {
            age = a;
        }
    }
}
~~~
<p>Why not just make <code>age</code> public? Because the setter can <b>check</b> the value first. An age of -5 makes no sense, so the setter {{refuses|يرفض}} it.</p>
<p>This idea is called <b>encapsulation</b>: hide the data inside, and give safe doors (methods) to reach it. It is like an ATM. You cannot touch the money inside the machine. You can only use the buttons.</p>
<div class="tip">Encapsulation gives you <b>control</b>. Later, you can change the code inside the class, and the other classes don't need to change.</div>`,
      code: `class Person {
    private int age;

    public int getAge() {
        return age;
    }
    public void setAge(int a) {
        if (a >= 0) {
            age = a;
        }
    }
}
// in main:
Person p = new Person();
p.setAge(25);
p.setAge(-5);
System.out.println(p.getAge());`,
      steps: [
        { cap: 'The attribute <code>age</code> is <code>private</code>. It is locked inside the object.', line: 2 },
        { cap: '<code>p.age = 25;</code> gives an error. Code outside the class cannot touch a private attribute.' },
        { cap: '<code>p.setAge(25)</code> uses the public door. 25 is OK, so age becomes 25.', line: [15, 9] },
        { cap: '<code>p.setAge(-5)</code>: the check <code>a >= 0</code> is false. The setter refuses -5. Age stays 25.', line: [16, 8] },
        { cap: '<code>p.getAge()</code> uses the other door to read the value.', line: [17, 5], out: '25' }
      ],
      draw: function (k) {
        var age = k >= 2 ? 25 : 0;
        return [
          T('who', 30, 40, 'Code outside the class (main)', { bold: true, tone: 'muted', size: 13 }),
          B('obj', 200, 60, 230, 220, { title: 'p : Person', band: true, tone: 'teal', r: 18 }),
          B('age', 255, 135, 120, 52, { tag: 'private', title: 'age = ' + age, mono: true, tone: k === 3 ? 'red' : 'ink', fill: 'none', hi: k === 2 }),
          B('set', 145, 98, 110, 38, { title: 'setAge()', mono: true, tone: 'blue', fill: 'solid', size: 12.5 }),
          B('get', 375, 205, 110, 38, { title: 'getAge()', mono: true, tone: 'blue', fill: 'solid', size: 12.5 }),
          k === 1 && A('bad', 40, 290, 252, 175, { tone: 'red', dash: true, label: 'p.age = 25  ✗ error', bend: 12 }),
          k === 2 && A('s1', 20, 117, 143, 117, { tone: 'accent', label: 'setAge(25)' }),
          k === 3 && A('s2', 20, 117, 143, 117, { tone: 'red', label: 'setAge(-5)' }),
          k === 3 && T('rej', 145, 160, '✗ -5 refused', { tone: 'red', bold: true, size: 13, anchor: 'end' }),
          k === 4 && A('g1', 487, 224, 548, 224, { tone: 'teal', label: '25', la: 'middle' })
        ];
      },
      quiz: [
        { q: 'What is the usual name of the getter for an attribute <code>price</code>?', options: ['`price()`', '`getPrice()`', '`setPrice()`'], answer: 1, why: 'get + attribute name, with a capital letter.' },
        { type: 'fill', q: 'Complete the setter.', code: 'private String name;\n\npublic ___ setName(String n) {\n    ___ = n;\n}', answer: ['void', 'name|this.name'], why: 'A setter returns nothing (<code>void</code>) and saves the new value in the attribute.' },
        { q: 'What is the main idea of encapsulation?', options: ['Make every attribute public', 'Hide the data and give controlled access with methods', 'Write all code in main'], answer: 1, why: 'Hide inside, open safe doors.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm2-6',
      title: 'Value and reference types',
      body: `
<p>Java has two kinds of types. They behave differently when you copy them.</p>
<h3>Value types (primitives)</h3>
<p><code>int</code>, <code>double</code>, <code>boolean</code>, <code>char</code> and a few more. The variable keeps the <b>value itself</b>.</p>
~~~
int a = 5;
int b = a;   // b gets a COPY of 5
b = 10;      // a is still 5
~~~
<h3>Reference types (objects)</h3>
<p>Classes like <code>Person</code>, <code>String</code> or arrays. The object lives in a big memory area called the {{heap|الذاكرة الكومة}}. The variable only keeps a <b>reference</b>: the {{address|عنوان}} of the object.</p>
~~~
Person p1 = new Person();
Person p2 = p1;   // p2 gets a copy of the ADDRESS
p2.setAge(30);    // p1 sees age 30 too!
~~~
<p>There is still only <b>one</b> object. p1 and p2 point to the same object, like two keys for the same house.</p>
<div class="tip">This also matters for methods. A method that gets an <code>int</code> gets a copy, so it cannot change your variable. A method that gets an object gets the address, so it <b>can</b> change the object.</div>`,
      code: `int a = 5;
int b = a;
b = 10;

Person p1 = new Person();
p1.setAge(20);
Person p2 = p1;
p2.setAge(30);
System.out.println(p1.getAge());`,
      steps: [
        { cap: '<code>int a = 5;</code> The box a keeps the value 5 directly.', line: 1 },
        { cap: '<code>int b = a;</code> b gets a <b>copy</b> of the value.', line: 2 },
        { cap: '<code>b = 10;</code> Only b changes. a is still 5. They are two separate boxes.', line: 3 },
        { cap: '<code>new Person()</code> builds an object in the heap. p1 keeps its address (the arrow).', line: 5 },
        { cap: '<code>p1.setAge(20)</code> changes the object.', line: 6 },
        { cap: '<code>p2 = p1;</code> p2 gets a copy of the <b>address</b>. Both arrows go to the <b>same</b> object.', line: 7 },
        { cap: '<code>p2.setAge(30)</code> changes the one shared object.', line: 8 },
        { cap: 'So p1 also sees 30!', line: 9, out: '30' }
      ],
      draw: function (k) {
        var age = k < 4 ? 0 : k < 6 ? 20 : 30;
        return [
          B('stk', 20, 30, 210, 295, { title: 'Variables (stack)', band: true, tone: 'muted', fill: 'none', dash: true, z: 0 }),
          B('heap', 255, 30, 285, 295, { title: 'Objects (heap)', band: true, tone: 'muted', fill: 'none', dash: true, z: 0 }),
          B('va', 40, 80, 150, 40, { title: 'a = 5', mono: true, tone: k === 2 ? 'teal' : 'blue', tag: 'int', hi: k === 0 }),
          k >= 1 && B('vb', 40, 145, 150, 40, { title: 'b = ' + (k >= 2 ? 10 : 5), mono: true, tone: k === 2 ? 'accent' : 'blue', tag: 'int', hi: k >= 1 && k <= 2 }),
          k === 1 && A('cp', 190, 100, 190, 165, { tone: 'accent', bend: -28, label: 'copy', lx: 22 }),
          k >= 3 && B('p1', 40, 215, 150, 40, { title: 'p1', mono: true, tone: 'blue', tag: 'Person' }),
          k >= 5 && B('p2', 40, 275, 150, 40, { title: 'p2', mono: true, tone: 'blue', tag: 'Person', hi: k === 5 || k === 6 }),
          k >= 3 && OBJ('obj', 330, 200, 180, { name: 'Person', fields: [{ t: 'age = ' + age, tone: (k === 4 || k === 6) ? 'accent' : undefined, b: k === 4 || k === 6 }], hi: k === 4 || k === 6 || k === 7 }),
          k >= 3 && A('r1', 192, 235, 326, 222, { tone: 'ink' }),
          k >= 5 && A('r2', 192, 295, 326, 245, { tone: k >= 5 ? 'accent' : 'ink', label: 'same address', bend: 10, ly: 24, lx: -20 })
        ];
      },
      quiz: [
        { q: 'What does this print?', code: 'int x = 3;\nint y = x;\ny = 7;\nSystem.out.println(x);', options: ['3', '7', '10'], answer: 0, why: '<code>int</code> is a value type. y got a copy; x did not change.' },
        { q: 'After <code>Person p2 = p1;</code>, how many Person objects are there?', options: ['One', 'Two', 'Zero'], answer: 0, why: 'Only the address was copied. Both variables point to one object.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm2-7',
      title: 'The static keyword',
      body: `
<p>Normal attributes belong to <b>each object</b>. Every object has its own copy.</p>
<p>A <code>static</code> attribute belongs to the <b>class</b>. There is only <b>one</b> copy, and all objects {{share|يتشاركون}} it.</p>
~~~
class Counter {
    static int count = 0;
    Counter() {
        count++;
    }
}
~~~
<p>Every time we create a <code>Counter</code>, the constructor adds 1 to the shared <code>count</code>. So <code>count</code> tells us how many objects exist.</p>
<p>You use static members with the <b>class name</b>, not an object:</p>
~~~
System.out.println(Counter.count);
~~~
<h3>Static methods</h3>
<p>A static method also belongs to the class. You don't need an object to call it. You know some already: <code>main</code> is static, and <code>Math.sqrt()</code> is static.</p>
<div class="warn">A static method cannot use normal (non-static) attributes directly. Why? It does not belong to any object, so it does not know <b>which</b> object's attribute you mean.</div>`,
      code: `class Counter {
    static int count = 0;
    Counter() {
        count++;
    }
}

// in main:
new Counter();
new Counter();
new Counter();
System.out.println(Counter.count);`,
      steps: [
        { cap: '<code>static int count</code> lives in the class. There is only one count.', line: 2 },
        { cap: 'The first object is created. The constructor runs <code>count++</code>. count = 1.', line: [9, 4] },
        { cap: 'The second object uses the <b>same</b> count. count = 2.', line: [10, 4] },
        { cap: 'The third object: count = 3. All three objects share one variable.', line: [11, 4] },
        { cap: 'We read it with the class name: <code>Counter.count</code>.', line: 12, out: '3' }
      ],
      draw: function (k) {
        var n = Math.min(k, 3);
        var objs = [];
        for (var i = 1; i <= 3; i++) {
          if (k >= i) {
            var x = [30, 205, 380][i - 1];
            objs.push(OBJ('o' + i, x, 230, 150, { name: 'object ' + i, hi: k === i }));
            objs.push(A('a' + i, x + 75, 228, 280, 92, { tone: 'accent', dash: true, label: i === 1 ? 'shared' : '' }));
          }
        }
        return [
          CLS('cls', 160, 30, 240, { name: 'class Counter', fields: [{ t: 'static int count = ' + n, tone: 'accent', b: true }], hi: k === 0 || k === 4 }),
          T('note', 150, 66, k === 4 ? 'Counter.count → 3' : 'one copy only', { anchor: 'end', tone: k === 4 ? 'accent' : 'muted', bold: true, size: 13 }),
          objs,
          k === 4 && T('cmp', 280, 320, 'normal attribute: one copy per object  ·  static: one copy for all', { anchor: 'middle', size: 12.5, tone: 'teal', bold: true })
        ];
      },
      quiz: [
        { q: 'How many copies of a <code>static</code> attribute exist when you have 5 objects?', options: ['5', '1', '0'], answer: 1, why: 'A static attribute belongs to the class. There is one copy.' },
        { type: 'fill', q: 'Call the static method <code>sqrt</code> of the <code>Math</code> class.', code: 'double r = ___.sqrt(25);', answer: ['Math'], why: 'Static members are used with the class name.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm2-8',
      title: 'The Math class',
      body: `
<p>Java has a ready class called <code>Math</code>. It has many useful <code>static</code> methods for numbers. You don't need to import it, and you don't need <code>new</code>.</p>
<div class="tblwrap"><table>
<tr><th>Method</th><th>What it does</th><th>Example</th></tr>
<tr><td><code>Math.abs(x)</code></td><td>Distance from 0 (removes the minus)</td><td><code>Math.abs(-7)</code> → 7</td></tr>
<tr><td><code>Math.ceil(x)</code></td><td>Rounds <b>up</b></td><td><code>Math.ceil(4.2)</code> → 5.0</td></tr>
<tr><td><code>Math.floor(x)</code></td><td>Rounds <b>down</b></td><td><code>Math.floor(4.8)</code> → 4.0</td></tr>
<tr><td><code>Math.max(a, b)</code></td><td>The bigger number</td><td><code>Math.max(3, 9)</code> → 9</td></tr>
<tr><td><code>Math.min(a, b)</code></td><td>The smaller number</td><td><code>Math.min(3, 9)</code> → 3</td></tr>
<tr><td><code>Math.pow(a, b)</code></td><td>a to the {{power|أُس}} of b</td><td><code>Math.pow(2, 3)</code> → 8.0</td></tr>
<tr><td><code>Math.sqrt(x)</code></td><td>{{Square root|الجذر التربيعي}}</td><td><code>Math.sqrt(16)</code> → 4.0</td></tr>
</table></div>
<div class="tip"><code>ceil</code>, <code>floor</code>, <code>pow</code> and <code>sqrt</code> give back a <code>double</code>. That is why you see <code>5.0</code> and not <code>5</code>.</div>
<p>Think of each method as a small machine: a number goes in, a new number comes out.</p>`,
      code: `Math.abs(-7)      // 7
Math.ceil(4.2)    // 5.0
Math.floor(4.8)   // 4.0
Math.max(3, 9)    // 9
Math.pow(2, 3)    // 8.0
Math.sqrt(16)     // 4.0`,
      steps: [
        { cap: '<code>Math.abs(-7)</code> removes the minus: <b>7</b>.', line: 1 },
        { cap: '<code>Math.ceil(4.2)</code>: 4.2 is between 4 and 5...', line: 2 },
        { cap: '...ceil goes <b>up</b> to <b>5.0</b>, even for a small part like .2.', line: 2 },
        { cap: '<code>Math.floor(4.8)</code>: 4.8 is very close to 5...', line: 3 },
        { cap: '...but floor always goes <b>down</b>: <b>4.0</b>.', line: 3 },
        { cap: '<code>Math.max(3, 9)</code> gives the bigger one: <b>9</b>.', line: 4 },
        { cap: '<code>Math.pow(2, 3)</code> = 2 × 2 × 2 = <b>8.0</b>.', line: 5 },
        { cap: '<code>Math.sqrt(16)</code> = <b>4.0</b>, because 4 × 4 = 16.', line: 6 }
      ],
      draw: function (k) {
        var data = [
          ['Math.abs( )', '-7', '7'], ['Math.ceil( )', '4.2', '?'], ['Math.ceil( )', '4.2', '5.0'], ['Math.floor( )', '4.8', '?'],
          ['Math.floor( )', '4.8', '4.0'], ['Math.max( )', '3, 9', '9'], ['Math.pow( )', '2, 3', '8.0'], ['Math.sqrt( )', '16', '4.0']
        ][k];
        var nl = k >= 1 && k <= 4;
        var val = { 1: 4.2, 2: 5, 3: 4.8, 4: 4 }[k];
        return [
          B('in', 30, 100, 120, 52, { title: data[1], mono: true, tone: 'blue', size: 16, tag: 'input' }),
          A('a1', 152, 126, 198, 126, { tone: 'muted' }),
          B('mach', 200, 80, 170, 92, { title: data[0], mono: true, tone: 'teal', size: 15, tag: 'static method' }),
          A('a2', 372, 126, 418, 126, { tone: 'muted' }),
          B('out', 420, 100, 110, 52, { title: data[2], mono: true, tone: 'accent', fill: data[2] === '?' ? 'soft' : 'solid', size: 16, tag: 'output' }),
          nl && A('nl', 90, 270, 470, 270, { head: false, tone: 'muted' }),
          nl && T('t4', 100, 296, '4', { anchor: 'middle', mono: true, bold: true }),
          nl && T('t5', 460, 296, '5', { anchor: 'middle', mono: true, bold: true }),
          nl && A('k4', 100, 262, 100, 278, { head: false, tone: 'muted' }),
          nl && A('k5', 460, 262, 460, 278, { head: false, tone: 'muted' }),
          nl && B('pt', 100 + (val - 4) * 360 - 9, 261, 18, 18, { r: 9, tone: 'accent', fill: 'solid' }),
          nl && T('ptl', 100 + (val - 4) * 360, 248, String(val % 1 ? val : val + '.0'), { anchor: 'middle', mono: true, tone: 'accent', bold: true, size: 13 })
        ];
      },
      quiz: [
        { q: 'What is <code>Math.floor(9.9)</code>?', options: ['10.0', '9.0', '9.9'], answer: 1, why: 'floor always rounds down.' },
        { q: 'What is <code>Math.pow(3, 2)</code>?', options: ['6.0', '9.0', '5.0'], answer: 1, why: '3 × 3 = 9, and pow returns a double.' },
        { type: 'fill', q: 'Get the bigger of the two numbers.', code: 'int big = Math.___(a, b);', answer: ['max'], why: '<code>Math.max</code> gives the bigger value.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm2-9',
      title: 'The final keyword',
      body: `
<p><code>final</code> means "this cannot change anymore".</p>
<h3>final variables</h3>
<p>A <code>final</code> variable is a {{constant|ثابت}}. You give it a value one time, and then it is locked.</p>
~~~
final int MAX_SPEED = 120;
MAX_SPEED = 150;   // error!
~~~
<p>By {{convention|عُرف متفق عليه}}, constant names use CAPITAL letters with <code>_</code> between words: <code>MAX_SPEED</code>, <code>PI</code>.</p>
<h3>final methods and classes</h3>
<ul>
<li>A <code>final</code> <b>method</b> cannot be replaced (overridden) in a subclass.</li>
<li>A <code>final</code> <b>class</b> cannot be extended. Nobody can make a subclass of it. For example, <code>String</code> is a final class.</li>
</ul>
<div class="tip">You will learn about subclasses and overriding in Module 3. For now, remember: <code>final</code> = locked.</div>`,
      code: `final int MAX_SPEED = 120;
System.out.println(MAX_SPEED);
MAX_SPEED = 150;  // error!`,
      steps: [
        { cap: 'A final variable gets its value one time. Now it is locked.', line: 1 },
        { cap: 'Reading the value is always OK.', line: 2, out: '120' },
        { cap: 'Changing it is not allowed. The program does not even compile.', line: 3 },
        { cap: 'A final <b>class</b> cannot have subclasses. <code>String</code> is final.' }
      ],
      draw: function (k) {
        if (k === 3) return [
          CLS('fc', 180, 40, 200, { name: 'final class String', fields: ['...'], tone: 'blue' }),
          CLS('sub', 160, 210, 240, { name: 'class MyString', fields: ['extends String'], tone: 'red', dash: true }),
          A('ext', 280, 208, 280, 100, { tone: 'red', dash: true, label: '✗ cannot extend', la: 'start', lx: 8 })
        ];
        return [
          B('box', 180, 90, 200, 70, { tag: 'final int', title: 'MAX_SPEED = 120', mono: true, tone: 'blue', size: 14, hi: k === 0 }),
          T('lock', 280, 190, 'locked: the value can never change', { anchor: 'middle', tone: 'muted', size: 13 }),
          k === 1 && A('rd', 382, 125, 520, 125, { tone: 'teal', label: 'read 120 ✓' }),
          k === 2 && A('wr', 30, 125, 178, 125, { tone: 'red', label: '= 150  ✗' }),
          k === 2 && T('err', 280, 250, 'error: cannot assign a value to final variable', { anchor: 'middle', tone: 'red', mono: true, size: 12 })
        ];
      },
      quiz: [
        { q: 'What happens with <code>final double PI = 3.14; PI = 3.15;</code>?', options: ['PI becomes 3.15', 'Compile error', 'PI stays 3.14 with no error'], answer: 1, why: 'You cannot assign a new value to a final variable.' },
        { type: 'fill', q: 'Make a constant that cannot change.', code: '___ int DAYS_IN_WEEK = 7;', answer: ['final'], why: '<code>final</code> locks the variable.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm2-10',
      title: 'Packages',
      body: `
<p>A big program has hundreds of classes. We {{organize|ننظّم}} them in <b>packages</b>. A package is like a folder for classes.</p>
<p>Packages also stop name {{conflicts|تعارض}}. Two classes can have the same name if they are in different packages.</p>
<p>Java itself has many packages, for example:</p>
<ul>
<li><code>java.util</code>: <code>Scanner</code>, <code>ArrayList</code>, <code>HashMap</code> and more</li>
<li><code>java.io</code>: classes for files, like <code>File</code></li>
</ul>
<h3>Using a class from another package</h3>
<p>Use <code>import</code> at the top of your file:</p>
~~~
import java.util.Scanner;
import java.util.ArrayList;
~~~
<p>Or import every class of a package with <code>*</code>:</p>
~~~
import java.util.*;
~~~
<h3>Putting your class in a package</h3>
<p>Write <code>package</code> as the first line of the file. The dots are like folders: <code>com.myapp</code> means a folder <code>myapp</code> inside a folder <code>com</code>.</p>
<div class="tip">The full name of a class includes its package: <code>java.util.Scanner</code>. <code>import</code> lets you write just <code>Scanner</code>.</div>`,
      code: `package com.myapp;

import java.util.Scanner;
import java.util.ArrayList;

public class Main {
    ...
}`,
      steps: [
        { cap: 'Packages are like {{folders|مجلدات}}. Grey boxes are packages, blue boxes are classes.' },
        { cap: '<code>package com.myapp;</code> Our class <code>Main</code> lives in com → myapp.', line: 1 },
        { cap: '<code>import java.util.Scanner;</code> follows the path java → util → Scanner.', line: 3 },
        { cap: '<code>import java.util.ArrayList;</code> Another class from the same package.', line: 4 },
        { cap: '<code>import java.util.*;</code> would bring <b>every</b> class from java.util.' }
      ],
      draw: function (k) {
        var hl = {
          java: k === 2 || k === 3 || k === 4, util: k >= 2, com: k === 1, myapp: k === 1,
          Main: k === 1, Scanner: k === 2 || k === 4, ArrayList: k === 3 || k === 4, HashMap: k === 4
        };
        var node = function (id, x, y, isClass) {
          return B(id, x, y, isClass ? 120 : 100, 34, { title: id, mono: true, size: 13, r: isClass ? 4 : 10, tone: hl[id] ? 'accent' : isClass ? 'blue' : 'muted', fill: hl[id] ? 'solid' : 'soft' });
        };
        var edge = function (id, x1, y1, x2, y2, on) { return A(id, x1, y1, x2, y2, { head: false, tone: on ? 'accent' : 'muted' }); };
        var full = { 1: 'com.myapp.Main', 2: 'java.util.Scanner', 3: 'java.util.ArrayList', 4: 'java.util.*' }[k];
        return [
          node('java', 30, 90), node('com', 30, 240),
          node('util', 180, 60), node('io', 180, 140), node('myapp', 180, 240),
          node('Scanner', 330, 20, true), node('ArrayList', 330, 62, true), node('HashMap', 330, 104, true),
          node('File', 330, 150, true), node('Main', 330, 240, true),
          edge('e1', 130, 107, 180, 77, hl.util), edge('e2', 130, 107, 180, 157, false), edge('e3', 130, 257, 180, 257, hl.myapp),
          edge('e4', 280, 77, 330, 37, hl.Scanner), edge('e5', 280, 77, 330, 79, hl.ArrayList), edge('e6', 280, 77, 330, 121, hl.HashMap),
          edge('e7', 280, 157, 330, 167, false), edge('e8', 280, 257, 330, 257, hl.Main),
          full && T('full', 280, 322, 'full name: ' + full, { anchor: 'middle', mono: true, bold: true, tone: 'accent' })
        ];
      },
      quiz: [
        { q: 'Which line lets you use <code>ArrayList</code> by its short name?', options: ['`package java.util.ArrayList;`', '`import java.util.ArrayList;`', '`new java.util;`'], answer: 1, why: '<code>import</code> brings a class from another package.' },
        { type: 'fill', q: 'Import every class from <code>java.util</code>.', code: 'import java.util.___;', answer: ['*'], why: 'The star means "all classes in this package".' }
      ]
    }
  ],
  challenge: {
    title: 'Build a Student class',
    task: `
<p>Create a class <code>Student</code> with:</p>
<ul>
<li>two <code>private</code> attributes: <code>String name</code> and <code>int grade</code></li>
<li>a constructor that takes a name and a grade and saves them</li>
<li>a <code>public</code> getter <code>getName()</code></li>
</ul>
<p>In <code>main</code>, create a student named <code>"Lina"</code> with grade <code>90</code>, and print the name with the getter.</p>`,
    starter: `class Student {
    // private attributes here

    // constructor here

    // getName() here
}

public class Main {
    public static void main(String[] args) {
        // create a Student and print the name
    }
}`,
    checks: [
      { re: /private\s+String\s+name\s*;/, label: '<code>private String name;</code>' },
      { re: /private\s+int\s+grade\s*;/, label: '<code>private int grade;</code>' },
      { re: /Student\s*\(\s*String\s+\w+\s*,\s*int\s+\w+\s*\)\s*\{/, label: 'A constructor <code>Student(String ..., int ...)</code>' },
      { re: /public\s+String\s+getName\s*\(\s*\)\s*\{\s*return\s+(this\.)?name\s*;/, label: 'A getter <code>public String getName()</code> that returns name' },
      { re: /new\s+Student\s*\(\s*"Lina"\s*,\s*90\s*\)/, label: 'Create <code>new Student("Lina", 90)</code>' },
      { re: /System\.out\.println\s*\(\s*\w+\.getName\s*\(\s*\)\s*\)/, label: 'Print the name with <code>getName()</code>' }
    ],
    solution: `class Student {
    private String name;
    private int grade;

    Student(String name, int grade) {
        this.name = name;
        this.grade = grade;
    }

    public String getName() {
        return name;
    }
}

public class Main {
    public static void main(String[] args) {
        Student s = new Student("Lina", 90);
        System.out.println(s.getName());
    }
}`,
    output: 'Lina'
  }
});
