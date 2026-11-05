/* CS2 · Unit 4 · Inheritance and Polymorphism (60 slides): superclasses and subclasses, extends, super and constructor
   chaining, overriding vs overloading, the Object class, polymorphism and dynamic binding, casting and instanceof,
   equals, ArrayList (with DistinctNumbers and MyStack), protected and the visibility table, and final */
(function () {
  function mix(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }
  function jd(x) {
    if (isNaN(x)) return 'NaN';
    if (x === 0) return '0.0';
    var a = Math.abs(x);
    if (a >= 1e-3 && a < 1e7) { var s = String(x); return s.indexOf('.') < 0 ? s + '.0' : s; }
    var e = x.toExponential().split('e'), m = e[0];
    return (m.indexOf('.') < 0 ? m + '.0' : m) + 'E' + Number(e[1]);
  }
  function I(x) { return Math.trunc(x); }
  function h(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function vbox(id, x, y, w, name, type, value, o) {
    return B(id, x, y, w, 48, mix({ tag: type + ' ' + name, title: value == null ? 'no value' : String(value), mono: true, size: 15, tone: value == null ? 'muted' : 'teal', dash: value == null, r: 6 }, o || {}));
  }
  function hot(o) { return mix(o || {}, { tone: 'accent', hi: true }); }
  function cls(id, x, y, w, name, lines, o) {
    o = o || {};
    return B(id, x, y, w, boxH(lines.length), mix({ title: name, band: true, mono: true, size: 12.5, lsize: o.lsize || 11.5, lines: lines.map(function (f) { return typeof f === 'string' ? { t: f } : f; }), tone: o.tone || 'blue', hi: !!o.hi }, o.extra || {}));
  }

  /* ---------- 1. superclass and subclasses (slides 3-5) ---------- */
  var hierarchy = {
    id: 'hierarchy', slides: [3, 5], title: 'One general class, two special ones',
    steps: [
      { slide: 3, ph: 'why', cap: 'Circles, rectangles and triangles have a lot in common. Writing the common parts again in each class would be repeated code. <b>Inheritance</b> puts them in one place.' },
      { slide: 4, ph: 'super', cap: 'A general class, <b>GeometricObject</b>, has what all shapes share: a color, filled or not, and the date it was created, with get and set methods.' },
      { slide: 4, ph: 'sub', cap: 'Circle and Rectangle <b>extend</b> it. GeometricObject is the <b>superclass</b> (parent, base class); Circle and Rectangle are <b>subclasses</b> (child, extended, derived classes). The arrow with the empty head points to the superclass.' },
      { slide: 5, ph: 'add', cap: 'Each subclass <b>inherits</b> the accessible members and <b>adds</b> its own: Circle adds radius, getArea, getDiameter…; Rectangle adds width, height, getArea, getPerimeter.' }
    ],
    draw: function (k, s) {
      var ph = s.ph, items = [];
      if (ph === 'why') {
        ['Circle', 'Rectangle', 'Triangle'].forEach(function (n, i) { items.push(cls('c' + i, 20 + i * 182, 60, 170, n, ['color', 'filled', 'dateCreated', '… its own parts'], { lsize: 12, tone: 'muted' })); });
        items.push(T('r', 280, 250, 'the same three fields, three times', { anchor: 'middle', size: 14, bold: true, tone: 'red' }));
        return items;
      }
      items.push(cls('g', 140, 10, 280, 'GeometricObject', ['-color: String', '-filled: boolean', '-dateCreated: java.util.Date', '+getColor(), setColor(…)', '+isFilled(), setFilled(…)', '+toString(): String'], { tone: ph === 'super' ? 'accent' : 'blue', hi: ph === 'super' }));
      if (ph !== 'super') {
        items.push(cls('c', 20, 210, 240, 'Circle', ph === 'add' ? ['-radius: double', '+getArea(): double', '+getDiameter(): double'] : ['…'], { tone: ph === 'add' ? 'accent' : 'teal', hi: ph === 'add' }));
        items.push(cls('r', 300, 210, 240, 'Rectangle', ph === 'add' ? ['-width: double', '-height: double', '+getArea(): double'] : ['…'], { tone: ph === 'add' ? 'accent' : 'teal', hi: ph === 'add' }));
        items.push(A('i1', 140, 206, 210, 162, { tone: 'ink' }), A('i2', 420, 206, 350, 162, { tone: 'ink' }));
        items.push(T('ex', 280, 192, 'extends', { anchor: 'middle', mono: true, size: 12, bold: true, tone: 'accent' }));
      }
      return items;
    }
  };

  /* ---------- 2. TestCircleRectangle (slides 6-10) ---------- */
  var TCR = 'public class TestCircleRectangle {\n  public static void main(String[] args) {\n    Circle circle = new Circle(2.0);\n    System.out.println(circle.toString());\n    System.out.println("Color is " + circle.getColor());\n    System.out.println("Filled is " + circle.isFilled());\n    System.out.println("Area is " + circle.getArea());\n    System.out.println("Diameter is " + circle.getDiameter());\n\n    Rectangle rectangle = new Rectangle(2.0, 4.0, "blue", true);\n    System.out.println("\\n" + rectangle.toString());\n    System.out.println("Color is " + rectangle.getColor());\n    System.out.println("Filled is " + rectangle.isFilled());\n    System.out.println("Area is " + rectangle.getArea());\n    System.out.println("Perimeter is " + rectangle.getPerimeter());\n  }\n}';
  var testcr = {
    id: 'testcr', slides: [6, 10], title: 'A Circle object has the inherited parts too', code: TCR,
    steps: [
      { slide: 6, line: 3, ph: 'c', cap: '<code>new Circle(2.0)</code>: the object has its own radius 2.0 <b>and</b> the parts it inherits from GeometricObject: color "white" (the default), filled false, and a date.' },
      { slide: 7, line: 4, ph: 'c', cap: 'Circle has its own toString, so this one is used.', out: 'Circle: radius = 2.0' },
      { slide: 8, line: '5-6', ph: 'cInh', cap: 'getColor and isFilled are <b>inherited</b> methods: Circle does not write them, but the object can use them. The private fields themselves can be reached only through these methods.', out: ['Color is white', 'Filled is false'] },
      { slide: 7, line: '7-8', ph: 'cOwn', cap: 'getArea and getDiameter are Circle’s own methods.', out: ['Area is ' + jd(4 * Math.PI), 'Diameter is 4.0'] },
      { slide: 9, line: 10, ph: 'r', cap: 'The 4-argument constructor sets width and height itself, and color and filled through the inherited <code>setColor</code> and <code>setFilled</code>.' },
      { slide: 10, line: '11-15', ph: 'r', cap: '"\\n" adds an empty line first. Note: the slide’s Rectangle.toString has no space before “height”, so the words run together.', out: ['', 'Rectangle: width = 2.0height = 4.0', 'Color is blue', 'Filled is true', 'Area is 8.0', 'Perimeter is 12.0'] }
    ],
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'r') {
        items.push(B('ro', 120, 40, 320, boxH(5), { title: 'rectangle: Rectangle', band: true, mono: true, lsize: 12.5, lines: [{ t: 'width = 2.0', tone: 'accent' }, { t: 'height = 4.0', tone: 'accent' }, '---', { t: 'color = "blue"   (inherited)', tone: 'blue' }, { t: 'filled = true    (inherited)', tone: 'blue' }], tone: 'teal', hi: true }));
        return items;
      }
      items.push(B('co', 120, 40, 320, boxH(5), { title: 'circle: Circle', band: true, mono: true, lsize: 12.5, lines: [{ t: 'radius = 2.0', tone: 'accent', b: s.ph === 'cOwn' }, '---', { t: 'color = "white"   (inherited)', tone: 'blue', b: s.ph === 'cInh' }, { t: 'filled = false    (inherited)', tone: 'blue', b: s.ph === 'cInh' }, { t: 'dateCreated       (inherited)', tone: 'blue' }], tone: 'teal', hi: true }));
      items.push(T('k1', 120, 230, 'own part', { size: 12.5, bold: true, tone: 'accent' }), T('k2', 260, 230, 'from GeometricObject', { size: 12.5, bold: true, tone: 'blue' }));
      return items;
    }
  };

  /* ---------- 3. super() is always called first (slides 12-14) ---------- */
  var superv = {
    id: 'superv', slides: [12, 14], title: 'super() comes first',
    steps: [
      { slide: 12, ph: 'auto', cap: 'If a constructor calls neither this(…) nor super(…), the compiler <b>adds</b> <code>super();</code> as its first statement. So the superclass part of the object is always built first.' },
      { slide: 13, ph: 'kw', cap: '<code>this</code> refers to the object itself; <code>super</code> refers to the superclass part. Use it to call a superclass constructor, <code>super(arguments)</code>, or a superclass method.' },
      { slide: 13, ph: 'notinh', cap: 'Constructors are <b>not</b> inherited. A subclass can call them only with super(…), inside its own constructors.' },
      { slide: 14, ph: 'rules', cap: 'Writing the superclass name instead, like <code>GeometricObject();</code>, is a syntax error. And super(…) must be the <b>first</b> statement in the constructor.' }
    ],
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'auto') {
        items.push(B('a', 20, 60, 230, 80, { lines: ['public ClassName() {', '  // some statements', '}'], mono: true, lsize: 12.5, tone: 'blue' }));
        items.push(T('eq', 280, 104, '=', { anchor: 'middle', size: 26, bold: true, tone: 'accent' }));
        items.push(B('b', 310, 50, 240, 100, { lines: [{ t: 'public ClassName() {' }, { t: '  super();', b: true, tone: 'accent' }, { t: '  // some statements' }, { t: '}' }], mono: true, lsize: 12.5, tone: 'accent', hi: true }));
        return items;
      }
      if (s.ph === 'rules') {
        items.push(B('bad', 20, 50, 250, 90, { tag: 'wrong', lines: ['public Circle() {', '  GeometricObject();  ✗', '}'], mono: true, lsize: 12.5, tone: 'red', hi: true }));
        items.push(B('bad2', 290, 50, 250, 90, { tag: 'wrong', lines: ['public Circle(double r) {', '  radius = r;', '  super();  ✗ not first', '}'], mono: true, lsize: 12, tone: 'red', hi: true }));
        items.push(B('ok', 140, 190, 280, 90, { tag: 'correct', lines: ['public Circle(double r) {', '  super();', '  radius = r;', '}'], mono: true, lsize: 12.5, tone: 'teal', hi: true }));
        return items;
      }
      items.push(B('obj', 120, 30, 320, 200, { tag: 'a Circle object', fill: 'none', tone: 'muted', z: 0 }));
      items.push(B('sp', 140, 60, 280, 60, { title: 'GeometricObject part', lines: ['super'], size: 13, lsize: 12, mono: true, tone: s.ph === 'kw' ? 'accent' : 'blue', hi: s.ph === 'kw' }));
      items.push(B('own', 140, 140, 280, 60, { title: 'Circle part', lines: ['this: the whole object'], size: 13, lsize: 12, mono: true, tone: 'teal' }));
      if (s.ph === 'notinh') items.push(T('ni', 280, 280, 'constructors are not inherited: call them with super(…)', { anchor: 'middle', size: 13, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* ---------- 4. constructor chaining, traced (slides 15-24) ---------- */
  var FAC = 'public class Faculty extends Employee {\n  public static void main(String[] args) { new Faculty(); }\n\n  public Faculty() {\n    System.out.println("(4) Performs Faculty\'s tasks");\n  }\n}\n\nclass Employee extends Person {\n  public Employee() {\n    this("(2) Invoke Employee\'s overloaded constructor");\n    System.out.println("(3) Performs Employee\'s tasks ");\n  }\n\n  public Employee(String s) {\n    System.out.println(s);\n  }\n}\n\nclass Person {\n  public Person() {\n    System.out.println("(1) Performs Person\'s tasks");\n  }\n}';
  var chain = {
    id: 'chain', slides: [15, 24], title: 'Constructor chaining', code: FAC,
    steps: [
      { slide: 15, line: '1,9,20', st: [], cap: 'Creating one object calls the constructors of <b>all</b> its superclasses, up the chain. This is <b>constructor chaining</b>.' },
      { slide: 16, line: 2, st: [], cap: '1. Start from the main method: <code>new Faculty()</code>.' },
      { slide: 17, line: 4, st: ['Faculty()'], cap: '2. Invoke the Faculty() constructor. Its first job is the hidden <code>super();</code>.' },
      { slide: 18, line: 10, st: ['Faculty()', 'Employee()'], cap: '3. Invoke the Employee() no-arg constructor.' },
      { slide: 19, line: '11,15', st: ['Faculty()', 'Employee()', 'Employee(String)'], cap: '4. <code>this("(2) …")</code> invokes the Employee(String) constructor. (A constructor that starts with this(…) does not get a super() of its own; the other constructor does.)' },
      { slide: 20, line: 21, st: ['Faculty()', 'Employee()', 'Employee(String)', 'Person()'], cap: '5. Employee(String) starts with the hidden super(), so Person() is invoked.' },
      { slide: 21, line: 22, st: ['Faculty()', 'Employee()', 'Employee(String)', 'Person()'], cap: '6. Execute println() in Person(). It is the top of the chain, so it prints <b>first</b>.', out: "(1) Performs Person's tasks" },
      { slide: 22, line: 16, st: ['Faculty()', 'Employee()', 'Employee(String)'], cap: '7. Back in Employee(String): execute println(s).', out: "(2) Invoke Employee's overloaded constructor" },
      { slide: 23, line: 12, st: ['Faculty()', 'Employee()'], cap: '8. Back in Employee(): execute its println().', out: "(3) Performs Employee's tasks " },
      { slide: 24, line: 5, st: ['Faculty()'], cap: '9. Finally the body of Faculty() runs. The calls went up the chain, and the bodies run from the top down.', out: "(4) Performs Faculty's tasks" }
    ],
    draw: function (k, s) {
      var items = [];
      ['Person', 'Employee', 'Faculty'].forEach(function (n, i) {
        items.push(B('c' + i, 20, 30 + i * 100, 130, 40, { title: n, mono: true, size: 14, tone: 'blue' }));
        if (i) items.push(A('e' + i, 85, 30 + i * 100, 85, 74 + (i - 1) * 100, { tone: 'ink' }));
      });
      items.push(A('wl', 260, 20, 260, 322, { head: false, tone: 'muted' }), A('wr', 540, 20, 540, 322, { head: false, tone: 'muted' }), A('wb', 260, 322, 540, 322, { head: false, tone: 'muted' }));
      s.st.forEach(function (f, i) { items.push(B('f' + f.replace(/\W/g, ''), 270, 274 - i * 56, 260, 44, { title: f, mono: true, size: 14, tone: i === s.st.length - 1 ? 'accent' : 'teal', hi: i === s.st.length - 1 })); });
      items.push(T('cs', 400, 14, 'constructors waiting (top = running)', { anchor: 'middle', size: 11, tone: 'muted' }));
      return items;
    }
  };

  /* ---------- 5. a superclass with no no-arg constructor (slide 25) ---------- */
  var fruit = {
    id: 'fruit', slides: [25, 25], title: 'No Fruit() to call',
    code: 'public class Apple extends Fruit {\n  public Apple() { }\n}\n\nclass Fruit {\n  public Fruit(String name) {\n    System.out.println("Fruit\'s constructor is invoked");\n  }\n}',
    steps: [
      { line: 2, k: 0, cap: 'Apple() has an empty body, so the compiler adds <code>super();</code>: it wants to call <b>Fruit()</b>.' },
      { line: '6-8', k: 1, cap: 'But Fruit has only Fruit(String name). Because Fruit defines a constructor, no default no-arg constructor is added (unit 2). So there is no Fruit() and the program does <b>not compile</b>.' },
      { line: 2, k: 2, cap: 'Two fixes: give Fruit a no-arg constructor, or call the right one: <code>public Apple() { super("apple"); }</code>.' }
    ],
    draw: function (k) {
      return [
        B('a', 20, 60, 230, 80, { lines: ['public Apple() {', '  super();  // added', '}'], mono: true, lsize: 12.5, tone: k === 0 ? 'accent' : 'blue', hi: k === 0 }),
        A('c', 254, 100, 306, 100, { tone: 'red', label: k >= 1 ? '✗' : 'calls Fruit()' }),
        B('f', 310, 60, 230, 80, { lines: ['class Fruit {', '  Fruit(String name)', '}'], mono: true, lsize: 12.5, tone: k === 1 ? 'red' : 'blue', hi: k === 1 }),
        k === 2 ? B('fix', 80, 200, 400, 50, { title: 'public Apple() { super("apple"); }', mono: true, size: 14, tone: 'teal', hi: true }) : null
      ];
    }
  };

  /* ---------- 6. overriding, and overriding vs overloading (slides 26-30) ---------- */
  var override = {
    id: 'override', slides: [26, 30], title: 'Same signature: override. Other parameters: overload.',
    code: 'public void printCircle() {\n  System.out.println("The circle is created " +\n    super.getDateCreated() + " and the radius is " + radius);\n}\n\n// Override the toString method defined in GeometricObject\npublic String toString() {\n  return super.toString() + "\\nradius is " + radius;\n}\n\n// Slide 30, program 1: overriding\nclass B { public void p(double i) { System.out.println(i * 2); } }\nclass A extends B { public void p(double i) { System.out.println(i); } }\n\n// Slide 30, program 2: overloading\nclass B { public void p(double i) { System.out.println(i * 2); } }\nclass A extends B { public void p(int i) { System.out.println(i); } }',
    steps: [
      { slide: 26, line: '1-4', ph: 'supm', cap: '<code>super.method(…)</code> calls a method of the superclass, here super.getDateCreated().' },
      { slide: 28, line: '7-9', ph: 'ovr', cap: '<b>Overriding</b>: the subclass writes its own version of an inherited method, with the <b>same signature</b>. Circle’s toString replaces GeometricObject’s; inside it, <code>super.toString()</code> still reaches the old version.' },
      { slide: 29, line: 7, ph: 'note', cap: 'Only an <b>accessible</b> instance method can be overridden. A private method is not seen by the subclass, so a method with the same name there is unrelated. A static method is inherited but not overridden: redefining it only <b>hides</b> it.' },
      { slide: 30, line: '12-13', ph: 'ovr2', cap: 'TestOverriding: A’s p(double i) <b>overrides</b> B’s p(double i). Both <code>a.p(10)</code> and <code>a.p(10.0)</code> run A’s version (10 becomes 10.0).', out: ['10.0', '10.0'] },
      { slide: 30, line: '16-17', ph: 'ovl', cap: 'TestOverloading: A’s p(int i) <b>overloads</b> B’s p(double i) (different parameters). <code>a.p(10)</code> runs p(int) in A and prints 10; <code>a.p(10.0)</code> runs p(double) in B and prints 20.0.', clear: true, out: ['10', '20.0'] }
    ],
    draw: function (k, s) {
      var ph = s.ph, items = [];
      if (ph === 'supm' || ph === 'ovr') {
        items.push(cls('g', 30, 30, 230, 'GeometricObject', [{ t: 'getDateCreated()', tone: ph === 'supm' ? 'accent' : undefined, b: ph === 'supm' }, { t: 'toString()', tone: ph === 'ovr' ? 'accent' : undefined, b: ph === 'ovr' }]));
        items.push(cls('c', 300, 160, 230, 'Circle', [{ t: 'printCircle()', tone: ph === 'supm' ? 'teal' : undefined }, { t: 'toString()  // overrides', tone: ph === 'ovr' ? 'accent' : undefined, b: ph === 'ovr' }], { tone: 'teal' }));
        items.push(A('i', 300, 180, 262, 70, { tone: 'ink' }));
        items.push(A('sc', 400, 154, 230, 104, { tone: 'accent', dash: true, label: ph === 'supm' ? 'super.getDateCreated()' : 'super.toString()', la: 'start', lx: 30 }));
        return items;
      }
      if (ph === 'note') {
        [['private method', 'not inherited → cannot be overridden', 'red'], ['static method', 'inherited, but only hidden, not overridden', 'blue'], ['accessible instance method', 'can be overridden', 'teal']].forEach(function (r, i) { items.push(B('n' + i, 30, 40 + i * 90, 500, 70, { title: r[0], lines: [r[1]], size: 14, lsize: 13, tone: r[2] })); });
        return items;
      }
      var ovl = ph === 'ovl';
      items.push(cls('b', 30, 30, 230, 'class B', ['p(double i)', '  prints i * 2']));
      items.push(cls('a', 300, 170, 230, 'class A extends B', [{ t: ovl ? 'p(int i)  // overloads' : 'p(double i)  // overrides', tone: 'accent', b: true }, '  prints i'], { tone: 'teal' }));
      items.push(A('i', 300, 190, 262, 80, { tone: 'ink' }));
      items.push(T('c1', 30, 220, 'a.p(10)   → ' + (ovl ? '10   (A: p(int))' : '10.0 (A)'), { mono: true, size: 13, bold: true, tone: 'accent' }));
      items.push(T('c2', 30, 250, 'a.p(10.0) → ' + (ovl ? '20.0 (B: p(double))' : '10.0 (A)'), { mono: true, size: 13, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 7. the Object class and toString (slides 31-32) ---------- */
  var objectv = {
    id: 'objectv', slides: [31, 32], title: 'Every class extends Object',
    code: 'public class Circle {\n  ...\n}\n// is the same as\npublic class Circle extends Object {\n  ...\n}\n\nLoan loan = new Loan();\nSystem.out.print(loan.toString());',
    steps: [
      { slide: 31, line: '1-7', ph: 'top', cap: 'Every class in Java comes from <b>java.lang.Object</b>. If a class says no extends, its superclass is Object. String, StringBuilder and your own classes are all subclasses of Object.' },
      { slide: 32, line: '9-10', ph: 'ts', cap: 'Object has a toString(). Its default result is the class name, @, and a number in hexadecimal for the object, like <code>Loan@15037e5</code>: not very helpful.', out: 'Loan@15037e5' },
      { slide: 32, line: 10, ph: 'ovr', cap: 'So classes usually <b>override</b> toString to return readable text. <code>System.out.print(object)</code> is the same as printing <code>object.toString()</code>.' }
    ],
    draw: function (k, s) {
      var items = [B('o', 200, 20, 160, 44, { title: 'Object', mono: true, size: 15, tone: 'accent', hi: s.ph === 'top' })];
      ['String', 'StringBuilder', 'GeometricObject', 'Loan'].forEach(function (n, i) {
        items.push(B('c' + i, 10 + i * 140, 140, 130, 40, { title: n, mono: true, size: 12, tone: i === 3 && s.ph !== 'top' ? 'accent' : 'blue' }));
        items.push(A('a' + i, 75 + i * 140, 136, 280, 68, { tone: 'muted' }));
      });
      items.push(B('gc', 220, 230, 130, 40, { title: 'Circle', mono: true, size: 12, tone: 'blue' }), A('ag', 285, 226, 355, 184, { tone: 'muted' }));
      if (s.ph === 'ts') items.push(T('d', 75 + 3 * 140 - 60, 212, 'Loan@15037e5', { mono: true, size: 13, bold: true, tone: 'red' }));
      if (s.ph === 'ovr') items.push(T('d', 280, 310, 'override toString() → readable text', { anchor: 'middle', size: 14, bold: true, tone: 'teal' }));
      return items;
    }
  };

  /* ---------- 8a. polymorphism: one method for every shape (slide 34) ---------- */
  var PG = 'public class PolymorphismDemo {\n  /** Main method */\n  public static void main(String[] args) {\n    // Display circle and rectangle properties\n    displayObject(new Circle(1, "red", false));\n    displayObject(new Rectangle(1, 1, "black", true));\n  }\n\n  /** Display geometric object properties */\n  public static void displayObject(GeometricObject object) {\n    System.out.println("Created on " + object.getDateCreated() +\n      ". Color is " + object.getColor());\n  }\n}';
  var DATE = 'Mon Mar 09 19:25:20 EDT 2011';
  var polyg = {
    id: 'polyg', slides: [34, 34], title: 'One method, many kinds of objects', code: PG,
    steps: [
      { line: 10, ph: 'param', cap: 'Start with the parameter: <code>GeometricObject object</code>. Its type is the <b>superclass</b>. So displayObject accepts a GeometricObject, or an object of <b>any subclass</b> of it.' },
      { line: 5, ph: 'c', cap: 'main makes a red Circle and passes it. Is that allowed? Yes: a Circle <b>is a</b> GeometricObject, because Circle extends GeometricObject. Now the variable <code>object</code> refers to a Circle.' },
      { line: '11-12', ph: 'c', run: true, cap: 'The method only calls methods that <b>every</b> GeometricObject has: getDateCreated() and getColor(). The real object answers: this one is red.', out: 'Created on ' + DATE + '. Color is red' },
      { line: 6, ph: 'r', cap: 'Now a black Rectangle goes into the <b>same</b> method. The same variable now refers to a different kind of object.' },
      { line: '11-12', ph: 'r', run: true, cap: 'One method, written once, works for circles, rectangles, and any new shape you add later. This is <b>polymorphism</b> (“many forms”): a variable of a supertype can refer to objects of many subtypes.', out: 'Created on ' + DATE + '. Color is black' }
    ],
    draw: function (k, s) {
      var items = [], c = s.ph === 'c', r = s.ph === 'r', any = s.ph === 'param';
      items.push(B('g', 20, 30, 200, 44, { title: 'GeometricObject', mono: true, size: 13, tone: any ? 'accent' : 'blue', hi: any }));
      items.push(B('gc', 10, 160, 100, 40, { title: 'Circle', mono: true, size: 13, tone: c ? 'accent' : 'teal', hi: c }));
      items.push(B('gr', 120, 160, 110, 40, { title: 'Rectangle', mono: true, size: 13, tone: r ? 'accent' : 'teal', hi: r }));
      items.push(A('i1', 60, 156, 90, 78, { tone: 'ink' }), A('i2', 175, 156, 150, 78, { tone: 'ink' }));
      items.push(T('isa', 120, 120, 'is a', { anchor: 'middle', size: 12, bold: true, tone: 'muted' }));
      items.push(B('v', 290, 40, 250, 50, { tag: 'parameter', title: 'GeometricObject object', mono: true, size: 13, tone: 'blue' }));
      if (any) items.push(T('q', 415, 140, 'can refer to a GeometricObject,', { anchor: 'middle', size: 12.5, tone: 'muted' }), T('q2', 415, 160, 'a Circle, a Rectangle, …', { anchor: 'middle', size: 12.5, tone: 'muted' }));
      if (c || r) {
        items.push(B('o', 320, 150, 190, boxH(2), { title: c ? ': Circle' : ': Rectangle', band: true, mono: true, lines: c ? ['radius = 1.0', 'color = "red"'] : ['width = 1.0, height = 1.0', 'color = "black"'], lsize: 12, tone: 'teal', hi: true }));
        items.push(A('va', 415, 94, 415, 146, { tone: 'accent' }));
        if (s.run) items.push(T('ans', 415, 270, 'object.getColor() → "' + (c ? 'red' : 'black') + '"', { anchor: 'middle', mono: true, size: 13, bold: true, tone: 'accent' }));
      }
      return items;
    }
  };

  /* ---------- 8b. the same call, three results (slide 35) ---------- */
  var PD = 'public class PolymorphismDemo {\n  public static void main(String[] a) {\n    m(new GraduateStudent());\n    m(new Student());\n    m(new Object());\n  }\n\n  public static void m(Object x) {\n    System.out.println(x.toString());\n  }\n}\n\nclass GraduateStudent extends Student {\n  public String toString() {\n    return "Graduate Student";\n  }\n}\n\nclass Student extends Object {\n  public String toString() {\n    return "Student";\n  }\n}';
  var poly = {
    id: 'poly', slides: [35, 35], title: 'Which toString runs? The object decides.', code: PD,
    steps: [
      { line: 8, ph: 'any', cap: 'm takes an <code>Object</code>. Every class extends Object, so you can pass <b>any</b> object to m: polymorphism again.' },
      { line: 3, obj: 0, cap: 'First call: a GraduateStudent object is passed. The variable x has the type Object, but it refers to a GraduateStudent.' },
      { line: '9,14-15', obj: 0, found: 0, cap: 'Now <code>x.toString()</code>. Java does not look at the type of x (Object). It looks at the <b>object</b>: a GraduateStudent, which has its own toString. That one runs.', out: 'Graduate Student' },
      { line: '4,9,20-21', obj: 1, found: 1, cap: 'Second call: x refers to a Student, so Student’s toString runs.', out: 'Student' },
      { line: '5,9', obj: 2, found: 2, cap: 'Third call: a plain Object. Object’s own toString runs: the class name, @ and a number (the number changes from run to run).', out: 'java.lang.Object@1b6d3586' },
      { line: 9, ph: 'sum', cap: 'The <b>same line</b>, <code>x.toString()</code>, gave three different results. Which method runs is chosen while the program <b>runs</b>, by looking at the object. This is <b>dynamic binding</b>.' }
    ],
    draw: function (k, s) {
      var items = [], names = ['GraduateStudent', 'Student', 'Object'], outs = ['"Graduate Student"', '"Student"', 'Object@…'];
      names.forEach(function (n, i) {
        var y = 20 + i * 100, on = s.found === i, obj = s.obj === i;
        items.push(B('c' + i, 20, y, 240, boxH(1), { title: n, band: true, mono: true, size: 13, lsize: 12, lines: ['toString() → ' + outs[i]], tone: on ? 'accent' : obj ? 'teal' : 'blue', hi: on }));
        if (i) items.push(A('u' + i, 140, y - 2, 140, y - 100 + boxH(1) + 2, { tone: 'ink' }));
      });
      items.push(B('x', 320, 30, 210, 50, { tag: 'parameter', title: 'Object x', mono: true, size: 14, tone: 'blue' }));
      if (s.obj != null) {
        items.push(B('o', 330, 140, 190, 50, { title: 'new ' + names[s.obj] + '()', mono: true, size: 12, tone: 'teal', hi: true }));
        items.push(A('xa', 425, 84, 425, 136, { tone: 'accent' }));
        items.push(A('oc', 326, 165, 264, 20 + s.obj * 100 + 29, { tone: 'teal', dash: true, label: 'its class' }));
      }
      if (s.ph === 'any') items.push(T('a1', 425, 140, 'any object can be passed', { anchor: 'middle', size: 13, bold: true, tone: 'accent' }));
      if (s.ph === 'sum') items.push(T('s1', 290, 320, 'same call, three results: chosen at run time', { anchor: 'middle', size: 13.5, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 8c. dynamic binding: the search up the classes, and matching vs binding (slides 36-37) ---------- */
  var DB = 'class Animal {\n  public String sound() { return "..."; }\n  public String name() { return "an animal"; }\n}\nclass Cat extends Animal {\n  public String sound() { return "Meow"; }\n}\nclass Kitten extends Cat {\n  public String name() { return "a kitten"; }\n  public void purr() { System.out.println("purr"); }\n}\n\npublic class Test {\n  public static void main(String[] args) {\n    Animal a = new Kitten();\n    System.out.println(a.name());\n    System.out.println(a.sound());\n    System.out.println(a.toString());\n    // a.purr();   does not compile\n  }\n}';
  var DBC = [
    { n: 'Object', c: 'C4', m: { toString: 'toString()  → class name @ number' } },
    { n: 'Animal', c: 'C3', m: { sound: 'sound()  → "..."', name: 'name()   → "an animal"' } },
    { n: 'Cat', c: 'C2', m: { sound: 'sound()  → "Meow"' } },
    { n: 'Kitten', c: 'C1', m: { name: 'name()   → "a kitten"', purr: 'purr()' } }
  ];
  var dyn = {
    id: 'dyn', slides: [36, 37], vb: [560, 400], title: 'The JVM searches from the object’s class upward', code: DB,
    steps: [
      { slide: 36, line: 15, ph: 'obj', cap: 'An example to see the search. The object is a <b>Kitten</b>. Kitten extends Cat, Cat extends Animal, Animal extends Object. So the object is an instance of Kitten (C1), Cat (C2), Animal (C3) and Object (C4). The variable a has the type Animal.' },
      { slide: 36, line: '16,9', ph: 'run', meth: 'name', upto: 3, cap: '<code>a.name()</code>: the search starts at the object’s own class, Kitten (C1). Kitten has name(), so the search <b>stops at once</b>. Animal also has name(), but it is never reached.', out: 'a kitten' },
      { slide: 36, line: '17,6', ph: 'run', meth: 'sound', upto: 2, cap: '<code>a.sound()</code>: Kitten has no sound(), so go up to Cat (C2). Cat has it: run it and stop. Animal’s sound() is never used.', out: 'Meow' },
      { slide: 36, line: 18, ph: 'run', meth: 'toString', upto: 0, cap: '<code>a.toString()</code>: not in Kitten, not in Cat, not in Animal. Object (C4, the top) has it. Object’s toString shows the class of the object, Kitten, then @ and a number.', out: 'Kitten@1b6d3586' },
      { slide: 36, line: 15, ph: 'rule', cap: 'The rule: start at the class of the <b>object</b> (never at the type of the variable), go up one class at a time, and run the <b>first</b> version you find. Like a question in a family: ask yourself first, then your father, then your grandfather.' },
      { slide: 37, line: '16-18', ph: 'match', cap: 'But before the program runs, the <b>compiler</b> checks every call with the type of the <b>variable</b>: does Animal have name(), sound(), toString()? Yes (toString comes from Object), so the calls compile. This is <b>matching</b>: the method name and the parameters (their types, number and order).' },
      { slide: 37, line: 19, ph: 'nomatch', cap: '<code>a.purr()</code> would <b>not compile</b>: Animal has no purr(), even though the object is a Kitten. The compiler only knows the variable type. (A cast would be needed: <code>((Kitten) a).purr()</code>.)' },
      { slide: 37, line: 17, ph: 'bind', meth: 'sound', upto: 2, cap: '<b>Binding</b> happens later, at run time: the JVM chooses <b>which</b> sound() runs, Cat’s. So: matching = compiler, variable type, “is this call allowed?”. Binding = JVM, object type, “which version runs?”.' }
    ],
    draw: function (k, s) {
      var items = [], ys = [8, 108, 208, 290];
      DBC.forEach(function (c, i) {
        var keys = Object.keys(c.m), searched = s.meth && i >= s.upto, found = s.meth && i === s.upto, cmp = (s.ph === 'match' || s.ph === 'nomatch') && c.n === 'Animal';
        var lines = keys.map(function (m) { return { t: c.m[m], tone: found && m === s.meth ? 'accent' : undefined, b: found && m === s.meth }; });
        items.push(B('c' + i, 20, ys[i], 250, boxH(lines.length), { title: c.n + '   (' + c.c + ')', band: true, mono: true, size: 13, lsize: 11.5, lines: lines,
          tone: found ? 'accent' : cmp ? (s.ph === 'nomatch' ? 'red' : 'blue') : searched ? 'teal' : 'muted', hi: found || cmp }));
        if (i) items.push(A('u' + i, 145, ys[i] - 2, 145, ys[i - 1] + boxH(Object.keys(DBC[i - 1].m).length) + 2, { tone: 'ink' }));
        if (searched && !found) items.push(T('no' + i, 290, ys[i] + 30, '✗', { anchor: 'middle', size: 20, bold: true, tone: 'red' }));
        if (found) items.push(T('ok' + i, 290, ys[i] + 30, '✓', { anchor: 'middle', size: 20, bold: true, tone: 'teal' }));
      });
      items.push(B('v', 330, 20, 200, 50, { tag: 'variable', title: 'Animal a', mono: true, size: 14, tone: s.ph === 'match' || s.ph === 'nomatch' ? 'accent' : 'blue', hi: s.ph === 'match' || s.ph === 'nomatch' }));
      items.push(B('o', 340, 120, 180, 44, { title: 'object: Kitten', mono: true, size: 13, tone: s.ph === 'run' || s.ph === 'bind' || s.ph === 'rule' ? 'accent' : 'teal', hi: s.ph === 'run' || s.ph === 'bind' }));
      items.push(A('va', 430, 74, 430, 116, { tone: 'accent' }));
      var note = { obj: 'one object, four classes', run: 'search: C1 → C2 → C3 → C4', rule: 'start at the object’s class, go up', match: 'compiler: checks Animal (variable type)', nomatch: 'Animal has no purr() → compile error', bind: 'JVM: runs Cat’s sound() (object type)' }[s.ph];
      if (note) items.push(T('nt', 430, 210, note, { anchor: 'middle', size: 12.5, bold: true, tone: s.ph === 'nomatch' ? 'red' : 'accent' }));
      if (s.ph === 'match' || s.ph === 'bind') items.push(T('nt2', 430, 236, s.ph === 'match' ? 'before the program runs' : 'while the program runs', { anchor: 'middle', size: 12, tone: 'muted' }));
      return items;
    }
  };

  /* ---------- 9. casting and instanceof (slides 39-41) ---------- */
  var CD = 'public class CastingDemo {\n  public static void main(String[] args) {\n    Object object1 = new Circle(1);\n    Object object2 = new Rectangle(1, 1);\n    displayObject(object1);\n    displayObject(object2);\n  }\n\n  public static void displayObject(Object object) {\n    if (object instanceof Circle)\n      System.out.println("The circle area is " +\n        ((Circle) object).getArea());\n    else if (object instanceof Rectangle)\n      System.out.println("The rectangle area is " +\n        ((Rectangle) object).getArea());\n  }\n}';
  var casting = {
    id: 'casting', slides: [39, 41], title: 'Up is automatic, down needs a cast', code: CD,
    steps: [
      { slide: 39, line: '3-4', ph: 'up', cap: '<code>Object o = new Student();</code> is <b>implicit casting</b> (upcasting): a Student is always an Object. Lines 3-4 here do the same with a Circle and a Rectangle: no cast is needed.' },
      { slide: 39, line: 12, ph: 'down', cap: '<code>Student b = o;</code> is a compile error: the compiler only knows o is an Object. <code>Student b = (Student) o;</code> is <b>explicit casting</b> (downcasting).' },
      { slide: 40, line: 10, ph: 'cce', cap: 'Downcasting works only if the object really is an instance of that class. Otherwise the program stops with a <b>ClassCastException</b> at run time. Test first with <code>instanceof</code>.' },
      { slide: 41, line: '10-12', ph: 'c', cap: 'object1 refers to a Circle: <code>object instanceof Circle</code> is true. Cast, then call getArea. The parentheses <code>((Circle) object)</code> make the cast happen before the dot.', out: 'The circle area is ' + jd(Math.PI) },
      { slide: 41, line: '13-15', ph: 'r', cap: 'object2 is not a Circle, but it is a Rectangle.', out: 'The rectangle area is 1.0' }
    ],
    draw: function (k, s) {
      var items = [], ph = s.ph;
      if (ph === 'up' || ph === 'down' || ph === 'cce') {
        items.push(B('o', 40, 40, 160, 44, { title: 'Object', mono: true, size: 14, tone: 'blue' }), B('st', 40, 200, 160, 44, { title: 'Student', mono: true, size: 14, tone: 'blue' }), A('i', 120, 196, 120, 88, { tone: 'ink' }));
        items.push(A('u', 260, 220, 260, 70, { tone: ph === 'up' ? 'teal' : 'muted', label: 'upcast: automatic', la: 'start', lx: 10, ly: 70 }));
        items.push(A('d', 420, 70, 420, 220, { tone: ph === 'up' ? 'muted' : ph === 'cce' ? 'red' : 'accent', label: ph === 'cce' ? 'not a Student → ClassCastException' : 'downcast: (Student) o', la: 'start', lx: -120, ly: 90 }));
        return items;
      }
      var c = ph === 'c';
      items.push(B('o1', 30, 50, 200, 50, { tag: 'Object object1', title: '→ : Circle', mono: true, size: 13, tone: c ? 'accent' : 'muted', hi: c }));
      items.push(B('o2', 30, 170, 200, 50, { tag: 'Object object2', title: '→ : Rectangle', mono: true, size: 13, tone: c ? 'muted' : 'accent', hi: !c }));
      items.push(T('t1', 270, 70, 'instanceof Circle    → ' + (c ? 'true' : 'false'), { mono: true, size: 13, bold: true, tone: c ? 'teal' : 'red' }));
      if (!c) items.push(T('t2', 270, 100, 'instanceof Rectangle → true', { mono: true, size: 13, bold: true, tone: 'teal' }));
      items.push(T('t3', 270, 150, c ? '((Circle) object).getArea()' : '((Rectangle) object).getArea()', { mono: true, size: 13, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 10. equals and == (slides 42-44) ---------- */
  var EQ = 'public boolean equals(Object o) {\n  if (o instanceof Circle)\n    return radius == ((Circle)o).radius;\n  else return false;\n}\n\nCircle c1 = new Circle(5);\nCircle c2 = new Circle(5);\nCircle c3 = c1;\nSystem.out.println(c1 == c2);\nSystem.out.println(c1.equals(c2));\nSystem.out.println(c1 == c3);';
  var equals = {
    id: 'equals', slides: [42, 44], title: 'Same object, or same content?', code: EQ,
    steps: [
      { slide: 42, line: '7-9', ph: 'objs', cap: 'Two circles with radius 5, and c3 refers to the <b>same</b> object as c1. Object’s default equals is <code>return this == obj;</code>: the same as ==.' },
      { slide: 44, line: 10, ph: 'eq', cap: '<code>==</code> on references asks: is it the <b>same object</b>? c1 and c2 are two objects, so false.', out: 'false' },
      { slide: 43, line: 11, ph: 'eqs', cap: 'With the <b>overridden</b> equals of slide 43, equals compares the <b>contents</b>: both radii are 5, so true. Write it as equals(Object o), not equals(Circle c): that would overload, not override. (@Override lets the compiler check this.)', out: 'true' },
      { slide: 44, line: 12, ph: 'same', cap: 'c1 == c3 is true: one object. String, Date and many other classes already override equals to compare contents.', out: 'true' }
    ],
    draw: function (k, s) {
      var items = [];
      ['c1', 'c2', 'c3'].forEach(function (n, i) { items.push(B('v' + i, 20, 30 + i * 100, 120, 44, { tag: 'Circle ' + n, title: 'reference', size: 12, tone: 'blue' })); });
      items.push(B('o1', 340, 60, 180, boxH(1), { title: ': Circle', band: true, mono: true, lines: ['radius = 5.0'], tone: s.ph === 'same' || s.ph === 'eq' ? 'accent' : 'teal', hi: s.ph === 'same' }));
      items.push(B('o2', 340, 200, 180, boxH(1), { title: ': Circle', band: true, mono: true, lines: ['radius = 5.0'], tone: s.ph === 'eq' ? 'accent' : 'teal' }));
      items.push(A('r1', 144, 52, 336, 84, { tone: 'blue' }), A('r2', 144, 152, 336, 224, { tone: 'blue' }), A('r3', 144, 252, 336, 100, { tone: s.ph === 'same' ? 'accent' : 'blue' }));
      if (s.ph === 'eqs') items.push(T('cm', 430, 175, 'radius 5 == radius 5', { anchor: 'middle', mono: true, size: 12.5, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 11. ArrayList (slides 46-50) ---------- */
  var ALOPS = [
    ['cityList.add("London");', function (l) { l.push('London'); }],
    ['cityList.add("Denver");', function (l) { l.push('Denver'); }],
    ['cityList.add("Paris");', function (l) { l.push('Paris'); }],
    ['cityList.add("Miami");', function (l) { l.push('Miami'); }],
    ['cityList.add("Tokyo");', function (l) { l.push('Tokyo'); }],
    ['cityList.add(2, "Xian");', function (l) { l.splice(2, 0, 'Xian'); }],
    ['cityList.remove("Miami");', function (l) { l.splice(l.indexOf('Miami'), 1); }],
    ['cityList.remove(1);', function (l) { l.splice(1, 1); }]
  ];
  var AL = 'ArrayList<String> cityList = new ArrayList<>();\n' + ALOPS.slice(0, 5).map(function (o) { return o[0]; }).join('\n') + '\nSystem.out.println("City list = " + cityList.toString());\nSystem.out.println("List size = " + cityList.size());\nSystem.out.println("Is Miami in the list? " + cityList.contains("Miami"));\nSystem.out.println("Index of Denver? " + cityList.indexOf("Denver"));\nSystem.out.println("Is the list empty? " + cityList.isEmpty());\n' + ALOPS.slice(5).map(function (o) { return o[0]; }).join('\n') + '\nSystem.out.println("City list = " + cityList.toString());\nfor (int i = cityList.size() - 1; i >= 0; i--)\n  System.out.print(cityList.get(i) + " ");';
  var arraylist = {
    id: 'arraylist', slides: [46, 50], title: 'A list that grows and shrinks', code: AL,
    steps: (function () {
      var l = [], st = [{ slide: 46, line: 1, l: [], cap: 'An array’s size is fixed. <b>ArrayList</b> can hold any number of objects. <code>ArrayList&lt;String&gt;</code> is a <b>generic</b> type: the &lt;String&gt; says what it stores. The type inside new ArrayList&lt;&gt;() may be left out.' }];
      ALOPS.slice(0, 5).forEach(function (o, i) { o[1](l); st.push({ slide: 48, line: i + 2, l: l.slice(), hi: [l.length - 1], cap: '<code>add</code> appends at the end. size is now ' + l.length + '.' }); });
      st.push({ slide: 48, line: '7-11', l: l.slice(), cap: 'toString gives the list in brackets; size(), contains, indexOf and isEmpty answer questions about it.', out: ['City list = [' + l.join(', ') + ']', 'List size = 5', 'Is Miami in the list? true', 'Index of Denver? 1', 'Is the list empty? false'] });
      ALOPS.slice(5).forEach(function (o, i) { o[1](l); st.push({ slide: 49, line: 12 + i, l: l.slice(), hi: i === 0 ? [2] : [], cap: ['<code>add(2, "Xian")</code> inserts at index 2; the others move right.', '<code>remove("Miami")</code> removes that element.', '<code>remove(1)</code> removes the element at index 1 (Denver).'][i] }); });
      st.push({ slide: 49, line: '15-17', l: l.slice(), cap: 'get(i) reads an element. The loop prints the list backwards.', out: ['City list = [' + l.join(', ') + ']', l.slice().reverse().join(' ') + ' '] });
      st.push({ slide: 50, line: '1,17', l: l.slice(), tbl: true, cap: 'Array vs ArrayList: <code>a[index]</code> vs <code>list.get(index)</code>, <code>a[index] = x</code> vs <code>list.set(index, x)</code>, <code>a.length</code> vs <code>list.size()</code>. Only the list can add, insert, remove and clear.' });
      return st;
    })(),
    draw: function (k, s) {
      if (s.tbl) return [['String[] a = new String[10]', 'new ArrayList<>()'], ['a[index]', 'list.get(index)'], ['a[index] = "London"', 'list.set(index, "London")'], ['a.length', 'list.size()'], ['—', 'add, remove, clear']].map(function (r, i) {
        return B('t' + i, 20, 20 + i * 58, 520, 48, { lines: [r[0] + '   |   ' + r[1]], mono: true, lsize: 12.5, tone: i === 4 ? 'accent' : 'blue' });
      });
      var items = [B('ref', 20, 120, 120, 44, { tag: 'cityList', title: 'reference', size: 12, tone: 'blue' }), A('a', 144, 142, 166, 142, { tone: 'blue' })];
      if (!s.l.length) items.push(B('e', 170, 120, 90, 44, { title: '[ ]', mono: true, size: 14, tone: 'muted', dash: true }));
      s.l.forEach(function (c, i) {
        var on = s.hi && s.hi.indexOf(i) >= 0;
        items.push(B('c_' + c, 170 + i * 62, 120, 58, 44, { title: c, mono: true, size: 11, tone: on ? 'accent' : 'teal', hi: on, r: 4 }));
        items.push(T('i_' + c, 199 + i * 62, 182, '[' + i + ']', { anchor: 'middle', mono: true, size: 11, tone: 'muted' }));
      });
      items.push(T('sz', 170, 240, 'size() = ' + s.l.length, { mono: true, size: 14, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 12. distinct numbers (slide 51) ---------- */
  var DN = 'ArrayList<Integer> list = new ArrayList<>();\nScanner input = new Scanner(System.in);\nSystem.out.print("Enter integers (input ends with 0): ");\nint value;\ndo {\n  value = input.nextInt(); // Read a value from the input\n  // Add value to the list if not present in the list\n  if (!list.contains(value) && value != 0) list.add(value);\n} while (value != 0);\n\nfor (int i = 0; i < list.size(); i++)\n  System.out.print(list.get(i) + " ");';
  function nums(t) { return (String(t).match(/-?\d+/g) || []).slice(0, 14).map(Number); }
  var distinct = {
    id: 'distinct', slides: [51, 51], title: 'Keep each number once', code: DN,
    inputs: [{ id: 'v', type: 'text', label: 'the user types', value: '1 2 3 2 1 6 3 4 5 4 5 1 2 0', maxlen: 48 }],
    presets: [{ label: 'with repeats', values: { v: '1 2 3 2 1 6 3 4 5 4 5 1 2 0' } }, { label: 'all the same', values: { v: '7 7 7 0' } }, { label: '0 at once', values: { v: '0' } }],
    steps: function (v) {
      var a = nums(v.v); if (a.indexOf(0) < 0) a.push(0); a = a.slice(0, a.indexOf(0) + 1);
      var list = [], st = [{ line: '1-3', l: [], cap: 'An ArrayList of Integer (a list cannot hold int, so the wrapper class is used; boxing is automatic).', out: 'Enter integers (input ends with 0): ' + a.join(' ') }];
      a.forEach(function (x) {
        if (x === 0) { st.push({ line: 9, l: list.slice(), v: 0, cap: '0 ends the input. The loop stops.' }); return; }
        var dup = list.indexOf(x) >= 0; if (!dup) list.push(x);
        st.push({ line: '6-8', l: list.slice(), v: x, dup: dup, cap: x + (dup ? ' is already in the list (contains is true): skip it.' : ' is new: add it.') });
      });
      st.push({ line: '11-12', l: list.slice(), cap: 'Print the distinct numbers in the order they first came.', out: list.join(' ') + ' ' });
      return st;
    },
    draw: function (k, s) {
      var items = [];
      if (s.v != null) items.push(B('in', 20, 40, 120, 50, { tag: 'value', title: String(s.v), mono: true, size: 18, tone: s.dup ? 'red' : s.v === 0 ? 'muted' : 'accent', hi: true }));
      s.l.forEach(function (x, i) { items.push(B('l' + i, 20 + i * 52, 150, 48, 44, { title: String(x), mono: true, size: 14, tone: x === s.v && !s.dup ? 'accent' : 'teal', r: 4 })); });
      items.push(T('lb', 20, 140, 'list', { mono: true, size: 12, tone: 'muted' }));
      if (s.dup) items.push(T('d', 160, 72, 'already in the list → skip', { size: 14, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* ---------- 13. MyStack with an ArrayList (slides 52-53) ---------- */
  var MS = 'import java.util.ArrayList;\n\npublic class MyStack {\n  private ArrayList<Object> list = new ArrayList<>();\n\n  public boolean isEmpty() { return list.isEmpty(); }\n  public int getSize() { return list.size(); }\n  public Object peek() { return list.get(getSize() - 1); }\n  public Object pop() {\n    Object o = list.get(getSize() - 1);\n    list.remove(getSize() - 1);\n    return o;\n  }\n  public void push(Object o) { list.add(o); }\n\n  @Override\n  public String toString() { return "stack: " + list.toString(); }\n}';
  var mystack = {
    id: 'mystack', slides: [52, 53], title: 'A stack built on an ArrayList', code: MS,
    steps: [
      { slide: 52, line: 4, l: [], cap: 'MyStack <b>has</b> an ArrayList&lt;Object&gt; (composition). The list does the storing; MyStack only offers stack methods.' },
      { slide: 53, line: 14, l: ['"London"'], cap: '<code>push(o)</code> is just <code>list.add(o)</code>: the end of the list is the top.' },
      { slide: 53, line: 14, l: ['"London"', '"Paris"', '"Berlin"'], cap: 'Two more pushes. Because the type is Object, any object can be pushed.' },
      { slide: 53, line: 8, l: ['"London"', '"Paris"', '"Berlin"'], pk: true, cap: '<code>peek()</code> returns the last element, at index getSize() − 1, without removing it: "Berlin".' },
      { slide: 53, line: '9-12', l: ['"London"', '"Paris"'], pop: '"Berlin"', cap: '<code>pop()</code> reads the last element, removes it, and returns it.' },
      { slide: 53, line: 17, l: ['"London"', '"Paris"'], cap: 'toString is overridden: <code>stack: [London, Paris]</code>.', out: 'stack: [London, Paris]' }
    ],
    draw: function (k, s) {
      var items = [];
      s.l.forEach(function (x, i) { items.push(B('l' + i, 200, 260 - i * 56, 160, 48, { title: x, mono: true, size: 14, tone: i === s.l.length - 1 ? 'accent' : 'teal', hi: s.pk && i === s.l.length - 1 })); });
      if (!s.l.length) items.push(B('e', 200, 260, 160, 48, { title: 'empty list', size: 13, tone: 'muted', dash: true }));
      if (s.l.length) items.push(T('top', 370, 290 - (s.l.length - 1) * 56, '← top (index ' + (s.l.length - 1) + ')', { size: 12.5, bold: true, tone: 'accent' }));
      if (s.pop) items.push(B('p', 400, 60, 140, 48, { tag: 'popped', title: s.pop, mono: true, size: 14, tone: 'red', hi: true }));
      return items;
    }
  };

  /* ---------- 14. visibility with protected (slides 55-58) ---------- */
  var MEM = [['public int x', 'x', 4], ['protected int y', 'y', 3], ['int z', 'z', 2], ['private int u', 'u', 1], ['protected void m()', 'm()', 3]];
  var WHO = [['C1', 'the same class', 1], ['C2', 'same package p1', 2], ['C3', 'subclass, same package', 2], ['C4', 'subclass in package p2', 3], ['C5', 'other class in p2', 4]];
  var vis = {
    id: 'vis', slides: [55, 58], title: 'Who can use x, y, z, u and m()?',
    steps: [
      { slide: 55, w: -1, cap: 'From least to most visible: <b>private</b>, <b>default</b> (no modifier), <b>protected</b>, <b>public</b>. protected adds one thing to default: <b>subclasses</b> in other packages can use the member too.' },
      { slide: 56, w: 0, cap: 'Inside C1 itself, everything is allowed.' },
      { slide: 57, w: 1, cap: 'C2, in the same package: everything except private u.' },
      { slide: 57, w: 2, cap: 'C3 extends C1 in the same package: the same as C2.' },
      { slide: 57, w: 3, cap: 'C4 extends C1 but is in package p2: public x and the <b>protected</b> y and m(), but not the default z or private u.' },
      { slide: 57, w: 4, cap: 'C5 is in p2 and not a subclass: only public x.' },
      { slide: 58, w: 5, cap: 'Notes: private and protected are for members only, not for a class. A subclass may make an overridden protected method public, but it can never <b>weaken</b> access (a public method must stay public).' }
    ],
    draw: function (k, s) {
      var items = [];
      if (s.w === -1) {
        ['private', 'default', 'protected', 'public'].forEach(function (m, i) { items.push(B('m' + i, 20 + i * 132, 120, 124, 50, { title: m, mono: true, size: 14, tone: ['red', 'blue', 'accent', 'teal'][i] })); });
        items.push(A('ar', 30, 200, 530, 200, { tone: 'accent', label: 'visibility increases' }));
        return items;
      }
      if (s.w === 5) return [B('n1', 30, 40, 500, 60, { title: 'class: only public or no modifier', size: 14, tone: 'blue' }), B('n2', 30, 130, 500, 60, { title: 'protected m() may become public in a subclass ✓', size: 14, tone: 'teal' }), B('n3', 30, 220, 500, 60, { title: 'public m() cannot become protected or private ✗', size: 14, tone: 'red' })];
      var who = WHO[s.w];
      items.push(B('w', 20, 20, 520, 44, { title: who[0] + ': ' + who[1], mono: true, size: 14, tone: 'accent', hi: true }));
      MEM.forEach(function (m, i) {
        var ok = m[2] >= who[2] || s.w === 0;
        items.push(B('r' + i, 20, 84 + i * 48, 300, 40, { title: m[0], mono: true, size: 13, align: 'left', tone: 'blue' }));
        items.push(B('o' + i, 340, 84 + i * 48, 200, 40, { title: ok ? 'can use ' + m[1] + ' ✓' : 'cannot ✗', mono: true, size: 13, tone: ok ? 'teal' : 'red' }));
      });
      return items;
    }
  };

  /* ---------- 15. final (slides 59-60) ---------- */
  var finalv = {
    id: 'finalv', slides: [59, 60], title: 'final: no more changes',
    code: 'public final class A {\n  // Data fields, constructors, and methods omitted\n}\n\npublic final void m() {\n  // Do something\n}\n\nfinal static double PI = 3.1415926535897932;',
    steps: [
      { slide: 59, line: '1-3', k: 0, cap: 'A <b>final class</b> cannot be extended. <code>class B extends A</code> would be a compile error. Math, String, StringBuilder and all the wrapper classes are final.' },
      { slide: 59, line: '5-7', k: 1, cap: 'A <b>final method</b> cannot be overridden by a subclass.' },
      { slide: 60, line: 9, k: 2, cap: 'A <b>final data field</b> is a constant: its value can never change, like Math.PI.' }
    ],
    draw: function (k) {
      var rows = [['final class', 'no subclasses', 'class B extends A  ✗'], ['final method', 'no overriding', 'm() in a subclass  ✗'], ['final field', 'a constant', 'PI = 3;  ✗']];
      return rows.map(function (r, i) { return B('f' + i, 30, 30 + i * 96, 500, 76, { title: r[0] + ': ' + r[1], lines: [r[2]], mono: true, size: 14, lsize: 13, tone: i === k ? 'accent' : 'blue', hi: i === k }); });
    }
  };

  var ALL = [hierarchy, testcr, superv, chain, fruit, override, objectv, polyg, poly, dyn, casting, equals, arraylist, distinct, mystack, vis, finalv];

  var para = function (t) { return { type: 'paragraph', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; },
    code = function (t, lang) { return lang ? { type: 'code', text: t, lang: lang } : { type: 'code', text: t }; }, note = function (t) { return { type: 'note', text: t }; };
  function braces(c) { var o = (c.match(/\{/g) || []).length, z = (c.match(/\}/g) || []).length; return o >= 2 && o === z; }
  function tbl(head, rows) { return { type: 'html', html: '<div class="tblwrap"><table><tr>' + head.map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr>' + rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table></div>' }; }
  var OUT = ['Inheritance, Superclasses, and Subclasses', 'Superclass Constructor and the keyword super', 'Overriding Methods in the Superclass', 'The Object Class and its Methods', 'Polymorphism and Dynamic Binding', 'Casting Objects and instanceof Operator', 'The ArrayList Class', 'Visibility (or Accessibility) Modifiers'];
  function outline(title, on, ex) { return { image: false, title: title, blocks: OUT.map(function (t, i) { return { type: 'bullet', html: on.indexOf(i) >= 0 ? '<b>' + t + '</b>' : t, level: 0 }; }), explain: ex }; }
  function tr(msg) { return { image: false, title: 'Trace Execution', blocks: [note(msg), code(FAC)] }; }
  var GEO = 'public class GeometricObject {\n  private String color = "white";\n  private boolean filled;\n  private Date dateCreated;\n\n  public GeometricObject() { dateCreated = new Date(); }\n  public GeometricObject(String color, boolean filled) {\n    dateCreated = new Date(); this.color = color; this.filled = filled;\n  }\n  public String getColor() { return color; }\n  public void setColor(String color) { this.color = color; }\n  public boolean isFilled() { return filled; }\n  public void setFilled(boolean filled) { this.filled = filled; }\n  public Date getDateCreated() { return dateCreated; }\n\n  public String toString() { return "Geometric: color  = " + color +\n    ", filled = " + filled + ", date = " + dateCreated;\n  }\n}';
  var CIR = 'public class Circle extends GeometricObject {\n  private double radius = 1.0;\n\n  public Circle() {}\n  public Circle(double radius) { this.radius = radius; }\n  public Circle(double radius, String color, boolean filled) {\n    this.radius = radius; setColor(color); setFilled(filled);\n  }\n\n  public double getRadius() { return radius; }\n  public void setRadius(double radius) { this.radius = radius; }\n  public double getArea() { return radius * radius * Math.PI; }\n  public double getDiameter() { return 2 * radius; }\n  public double getPerimeter() { return 2 * radius * Math.PI; }\n\n  public String toString() {\n    return "Circle: radius = " + radius;\n  }\n}';
  var REC = 'public class Rectangle extends GeometricObject {\n  private double width = 1.0;\n  private double height = 1.0;\n\n  public Rectangle() {}\n  public Rectangle(double width, double height) {\n    this.width = width; this.height = height;\n  }\n  public Rectangle(double width, double height, String color, boolean filled) {\n    this.width = width; this.height = height; setColor(color); setFilled(filled);\n  }\n\n  public double getWidth() { return width; }\n  public void   setWidth(double width) { this.width = width; }\n  public double getHeight() { return height; }\n  public void   setHeight(double height) { this.height = height; }\n  public double getArea() { return width * height; }\n  public double getPerimeter() { return 2 * (width + height); }\n\n  public String toString() {\n    return "Rectangle: width = " + width + "height = " + height;\n  }\n}';
  var slides = {
    1: { image: false, blocks: [para('Object-oriented programming allows you to define new classes from existing classes. This is called inheritance.'), para('Inheritance enables you to define a general class (i.e., a superclass) and later extend it to more specialized classes (i.e., subclasses).')],
      explain: '<p>Many classes are almost the same. A circle, a rectangle and a triangle all have a color, and all can be filled or not. Without help you would write these parts again in every class.</p><p><b>{{Inheritance|الوراثة}}</b> solves this: you write the common parts <b>once</b>, in a general class (the <b>superclass</b>). Then each special class (a <b>subclass</b>) <b>extends</b> it: it gets those parts for free and adds only what is new.</p><p>Think of a family: a child gets many things from the parent, and also has things of its own.</p>' },
    2: outline('Outline', [], '<p>The plan of this unit.</p>'),
    3: { image: false, blocks: [bul('Inheritance is an important and powerful feature for reusing software. Suppose you need to define classes to model circles, rectangles, and triangles. These classes have many common features. What is the best way to design these classes to avoid redundancy and make the system easy to comprehend and easy to maintain? The answer is to use inheritance.'), bul('In Java terminology, a class C that extends another class B is called a subclass, and B is called a superclass. A superclass is also referred to as a parent class or a base class, and a subclass as a child class, an extended class, or a derived class. A subclass inherits accessible data fields and methods from its superclass and may also add new data fields and methods.')],
      explain: '<p>The words of this unit:</p><ul><li><b>{{Superclass|الكلاس الأب}}</b> (also: parent class, base class): the general class.</li><li><b>{{Subclass|الكلاس الابن}}</b> (also: child class, extended class, derived class): the special class that extends it.</li></ul><p>In <code>class Circle extends GeometricObject</code>, Circle is the subclass and GeometricObject is the superclass. The subclass <b>inherits</b> the accessible fields and methods, and may <b>add</b> new ones.</p><p class="watch">“Inherits” does not mean the code is copied. The subclass simply has those members, as if it had written them itself.</p>' },
    4: { image: false, blocks: [bul('Consider geometric objects. Suppose you want to design the classes to model geometric objects such as circles and rectangles. Geometric objects have many common properties and behaviors. They can be drawn in a certain color, filled or unfilled. Thus, a general class GeometricObject can be used to model all geometric objects. This class contains the properties and their appropriate getter and setter methods.')],
      explain: '<p>How do you find the superclass? Ask: <i>what do all the shapes share?</i> Every shape has a color, is filled or not, and has a date when it was created. These go into <b>GeometricObject</b>, with their get and set methods.</p><p>What is <b>not</b> shared stays in the subclass: only a circle has a radius; only a rectangle has a width and a height.</p><p>Rule of thumb: common things go <b>up</b> into the superclass, special things stay <b>down</b> in the subclass.</p>' },
    5: { image: false, title: 'GeometricObject, Circle, and Rectangle', blocks: [para('The GeometricObject class is the superclass for Circle and Rectangle.')],
      explain: '<p>The UML diagram shows the three classes. The arrow with an <b>empty {{triangle|مثلث}} head</b> means “extends”. It always points from the subclass <b>to</b> the superclass: Circle → GeometricObject, Rectangle → GeometricObject.</p><p>Read the arrow as “is a”: a Circle <b>is a</b> GeometricObject. If that sentence sounds right, inheritance fits.</p>' },
    6: { image: false, title: 'The GeometricObject Class', blocks: [code(GEO)], explain: '<p>GeometricObject is a normal class. Look at three things:</p><ul><li>The fields are <b>private</b>: color starts as "white", filled starts as false, and dateCreated holds the time the object was made.</li><li>There are two constructors: one with no arguments, and one that sets color and filled.</li><li>Every field has public get/set methods, and toString describes the object.</li></ul><p>Nothing here says “circle” or “rectangle”. That is the point: this class is general.</p>' },
    7: { image: false, title: 'The Circle Class', blocks: [code(CIR)], explain: '<p><code>public class Circle extends GeometricObject</code>: the word <b>extends</b> makes Circle a subclass.</p><p>Circle adds only what is special: the field radius and the methods getArea, getDiameter and getPerimeter. Its third constructor gets a color, but it cannot write <code>this.color = color;</code>, because color is <b>private</b> in GeometricObject. So it calls the inherited <code>setColor(color)</code>.</p><pre class="ex">Circle c = new Circle(2, "red", true);\nc.getColor();   // "red"   (inherited)\nc.getArea();    // 12.56…  (Circle’s own)</pre>' },
    8: { image: false, title: 'Using extends to define a Subclass', blocks: [bul('The keyword extends tells the compiler that the class Circle extends GeometricObject, thus inheriting all its public methods.'), bul('The private data fields color, filled, and dateCreated in the GeometricObject class cannot be accessed outside the class itself. The only way to access them is through their get and set methods.'), bul('A subclass inherits properties and methods from a superclass. You can also add new properties (data fields), add new methods, and override the methods of the superclass.')],
      explain: '<p>A Circle object really <b>has</b> a color, a filled value and a date: they are part of every Circle. But <b>private</b> means “only GeometricObject’s own code can touch it”. So Circle’s code must use the public methods:</p><pre class="ex">color = "blue";      // ✗ compile error inside Circle\nsetColor("blue");    // ✓</pre><p>A subclass can do three things: <b>add</b> new fields, <b>add</b> new methods, and <b>override</b> (replace) methods of the superclass.</p>' },
    9: { image: false, title: 'The Rectangle Class', blocks: [code(REC)], explain: '<p>Rectangle follows the same pattern as Circle: it extends GeometricObject, adds width and height, and adds its own getArea and getPerimeter.</p><p>Notice that both subclasses have a method named getArea, but each one computes it in its own way. Later in this unit this becomes important (polymorphism).</p><p class="watch">The slide’s toString has no space before “height”, so the output runs together: “width = 2.0height = 4.0”. The code is kept as it is on the slide.</p>' },
    10: { image: false, title: 'Testing Circle and Rectangle', blocks: [code(TCR)], explain: '<p>The test program uses two kinds of methods in exactly the same way:</p><ul><li><b>{{inherited|موروث}}</b> methods: getColor() and isFilled(). Circle never wrote them, yet <code>circle.getColor()</code> works.</li><li><b>own</b> methods: getArea(), getDiameter() and getPerimeter().</li></ul><p>The caller does not need to know where a method was written. A new Circle prints "white" and false: the defaults from GeometricObject. Follow the drawing to see which part of the object answers each call.</p>' },
    11: outline('Next . . .', [1], '<p>Next: constructors and super.</p>'),
    12: { image: false, title: 'Superclass’s Constructor Is Always Invoked', blocks: [bul('A constructor may invoke an overloaded constructor or its superclass constructor. If neither is invoked explicitly, the compiler automatically puts super(); as the first statement in the constructor. For example:'), code('public ClassName() {\n  // some statements\n}\n// Equivalent\npublic ClassName() {\n  super();\n  // some statements\n}'), code('public ClassName(parameters) {\n  // some statements\n}\n// Equivalent\npublic ClassName(parameters) {\n  super();\n  // some statements\n}')],
      explain: '<p>An object of a subclass also contains the superclass part. That part must be built <b>first</b>, like the floor before the walls.</p><p>So the first statement of every constructor calls another constructor. If you do not write <code>this(…)</code> or <code>super(…)</code> yourself, the compiler <b>adds</b> <code>super();</code> for you:</p><pre class="ex">public Circle(double r) {\n  // super();   added by the compiler\n  radius = r;\n}</pre><p>You do not see this call, but it always happens.</p>' },
    13: { image: false, title: 'Using the keyword super', blocks: [bul('The keyword this references the calling object.'), bul('The keyword super refers to the superclass. It can be used to:'), para('1. Call a superclass constructor'), para('2. Call a superclass method'), bul('Unlike data fields and methods, the constructors of a superclass are not inherited by a subclass. They can only be invoked from the constructors of the subclasses using the keyword super, as follows:'), code('super();\nsuper(arguments);'), bul('If super is not used explicitly, the superclass\'s no-arg constructor is automatically invoked.')],
      explain: '<p><code>this</code> means “this object”. <code>super</code> means “the superclass part of this object”. {{super|الأب: يشير إلى الكلاس الأب}} has two uses:</p><ul><li><code>super(arguments)</code>: call a superclass <b>constructor</b> (only as the first line of a constructor).</li><li><code>super.method(arguments)</code>: call a superclass <b>method</b>.</li></ul><p class="watch">Constructors are <b>not inherited</b>. Circle does not get a constructor named GeometricObject(String, boolean); it can only call it with <code>super(color, filled)</code> from inside its own constructor.</p>' },
    14: { image: false, title: 'CAUTION', blocks: [bul('You must use the keyword super to call the superclass constructor.'), bul('Invoking a superclass constructor’s name in a subclass causes a syntax error.'), bul('Java requires that the statement that uses the keyword super appear first in the constructor.')],
      explain: '<p>Two rules, both checked by the compiler:</p><ol><li>Call the superclass constructor with the keyword <b>super</b>, not with its name. <code>GeometricObject();</code> inside Circle is a syntax error.</li><li><code>super(…)</code> must be the <b>first</b> statement of the constructor.</li></ol><pre class="ex">public Circle(double r) {\n  radius = r;\n  super();     // ✗ not the first statement\n}</pre><p>The reason for rule 2: the superclass part must exist before the subclass code uses it.</p>' },
    15: { image: false, title: 'Constructor Chaining', blocks: [para('Constructing an instance of a class invokes all the superclasses’ constructors along the inheritance chain. This is known as constructor chaining.'), code(FAC)],
      explain: '<p><b>{{Constructor chaining|سلسلة المُنشئات}}</b>: creating <b>one</b> object calls the constructors of <b>all</b> its superclasses, one after the other, up to Object.</p><p>Here Faculty extends Employee, and Employee extends Person. <code>new Faculty()</code> calls Faculty(), which first calls Employee(…), which first calls Person().</p><p>Before you press Next, try to guess: in which order are the four lines printed? Hint: the calls go <b>up</b>, but the bodies finish from the <b>top down</b>.</p>' },
    16: tr('1. Start from the main method'), 17: tr('2. Invoke the Faculty() constructor'), 18: tr('3. Invoke Employee() no-arg constructor'), 19: tr('4. Invoke Employee(String) constructor'), 20: tr('5. Invoke Person() constructor'),
    21: tr('6. Execute println() in Person()'), 22: tr('7. Execute println(s)'), 23: tr('8. Execute println() in Employee()'), 24: tr('9. Execute println() in Faculty()'),
    25: { image: false, title: 'Impact of a Superclass without no-arg Constructor', blocks: [bul('Consider the following code:'), code('public class Apple extends Fruit {\n  public Apple() { }\n}\n\nclass Fruit {\n  public Fruit(String name) {\n    System.out.println("Fruit\'s constructor is invoked");\n  }\n}'), para('Apple is a subclass of Fruit.'), para('Apple’s default constructor automatically invokes Fruit’s no-arg constructor. However, Fruit does not have a no-arg constructor. Therefore, the program cannot be compiled.')],
      explain: '<p>A common error. Apple() looks harmless, but the compiler adds <code>super();</code> to it. That means: call <b>Fruit()</b>, with no arguments.</p><p>Fruit has only <code>Fruit(String name)</code>. Because Fruit wrote a constructor, Java does <b>not</b> add a default no-arg constructor (unit 2). So Fruit() does not exist, and the program does not compile.</p><p>Two fixes: add <code>public Fruit() { }</code> to Fruit, or call the right one: <code>public Apple() { super("Apple"); }</code>. Good habit: give a class that may be extended a no-arg constructor.</p>' },
    26: { image: false, title: 'Calling Superclass Methods', blocks: [bul('The keyword super can also be used to reference a method other than the constructor in the superclass. The syntax is:'), code('super.method(arguments);', 'none'), bul('You can write the printCircle() method in the Circle class as follows:'), code('public void printCircle() {\n  System.out.println("The circle is created " +\n    super.getDateCreated() +\n    " and the radius is " + radius);\n}')],
      explain: '<p><code>super.method(…)</code> calls the superclass’s version of a method. printCircle uses <code>super.getDateCreated()</code>.</p><p>Here super is not really needed: Circle inherits getDateCreated, so <code>getDateCreated()</code> alone works too. super becomes <b>necessary</b> when the subclass has its own version of the method (overriding, next slides) and still wants the old one.</p>' },
    27: outline('Next . . .', [2], '<p>Next: overriding.</p>'),
    28: { image: false, title: 'Overriding Methods in the Superclass', blocks: [bul('A subclass inherits methods from a superclass. Sometimes it is necessary for the subclass to modify the implementation of a method defined in the superclass. This is referred to as method overriding.'), code('public class Circle extends GeometricObject {\n  // Other methods are omitted\n  // . . .\n\n  // Override the toString method defined in GeometricObject\n  public String toString() {\n    return super.toString() + "\\nradius is " + radius;\n  }\n}')],
      explain: '<p>Sometimes the inherited version of a method is not good enough. GeometricObject’s toString does not show the radius. So Circle writes its own toString, with the <b>same signature</b> (same name and same parameters). This is <b>{{overriding|إعادة تعريف الدالة الموروثة}}</b>.</p><p>Now every Circle uses Circle’s toString. Inside it, <code>super.toString()</code> still reaches the old version, so Circle can add to it instead of writing everything again:</p><pre class="ex">Geometric: color  = white, filled = false, date = …\nradius is 2.0</pre>' },
    29: { image: false, title: 'NOTE', blocks: [bul('An instance method can be overridden only if it is accessible.'), bul('A private method cannot be overridden, because it is not accessible outside its own class.'), bul('If a method defined in a subclass is private in its superclass, the two methods are completely unrelated.'), para('Like an instance method, a static method can also be inherited. However, a static method cannot be overridden.'), para('If a static method defined in the superclass is redefined in a subclass, the method defined in the superclass is hidden.')],
      explain: '<p>Three cases:</p><ul><li>A public or protected <b>instance</b> method: can be overridden.</li><li>A <b>private</b> method: the subclass cannot see it, so it cannot override it. A method with the same name in the subclass is a completely new, unrelated method.</li><li>A <b>static</b> method: it is inherited, but it belongs to the class, not to an object. Writing it again in the subclass only <b>{{hides|يُخفي}}</b> the old one; it is not overriding.</li></ul><p>Short version: only methods that objects can see and call can be overridden.</p>' },
    30: { image: false, title: 'Overriding versus Overloading', blocks: [code('public class TestOverriding {\n  public static void main(String[] args) {\n    A a = new A();\n    a.p(10);     // displays 10.0\n    a.p(10.0);   // displays 10.0\n  }\n}\nclass B {\n  public void p(double i) { System.out.println(i * 2); }\n}\nclass A extends B {\n  // This method overrides the method in B\n  public void p(double i) { System.out.println(i); }\n}'), code('public class TestOverloading {\n  public static void main(String[] args) {\n    A a = new A();\n    a.p(10);     // displays 10\n    a.p(10.0);   // displays 20.0\n  }\n}\nclass B {\n  public void p(double i) { System.out.println(i * 2); }\n}\nclass A extends B {\n  // This method overloads the method in B\n  public void p(int i) { System.out.println(i); }\n}'), bul('Overridden methods are in different classes related by inheritance and have the same signature.'), bul('Overloaded methods can be either in the same class, or in different classes related by inheritance, have the same name but different parameter lists.')],
      explain: '<p>The two programs differ in only <b>one word</b>: double or int in A’s p.</p><ul><li><b>Overriding</b> (first program): A’s p(double) has the same signature as B’s p(double). B’s version is replaced, so a.p(10) and a.p(10.0) both run A’s: 10.0 and 10.0. (10 becomes 10.0 because the parameter is a double.)</li><li><b>Overloading</b> (second program): A’s p(int) has different parameters. Now A has <b>two</b> methods named p. a.p(10) picks p(int) → 10; a.p(10.0) picks B’s p(double) → 20.0.</li></ul><p>Override = same signature, replaces. Overload = same name, different parameters, adds one more.</p>' },
    31: { image: false, title: 'The Object Class and Its Methods', blocks: [bul('Every class in Java is descended from java.lang.Object'), bul('If no inheritance is specified when a class is defined, the superclass of the class is Object.'), bul('Classes such as String and StringBuilder are implicitly subclasses of Object, as all the main classes you have seen or written so far.')],
      explain: '<p>Every class has a superclass. If you write no extends, Java uses <b>java.lang.Object</b>:</p><pre class="ex">public class Circle { }\n// is the same as\npublic class Circle extends Object { }</pre><p>So Object is the root at the top of every class tree, and every object, of any class, has Object’s methods, like toString() and equals().</p>' },
    32: { image: false, title: 'The toString() method in Object', blocks: [bul('The toString() method returns a string representation of the object.'), para('The default implementation returns a string consisting of a class name of which the object is an instance, the @ sign, and a number representing the object’s memory address in hexadecimal.'), code('Loan loan = new Loan();\nSystem.out.print(loan.toString());'), bul('The code displays something like Loan@15037e5 . This message is not very helpful or informative.'), bul('Usually, you should override the toString method so that it returns a readable string representation of the object.'), bul('You can pass an object to System.out.print(object). This is equivalent to System.out.print(object.toString()).')],
      explain: '<p>toString() should return a text that describes the object. Object’s default version only knows the class name, so it returns something like <code>Loan@15037e5</code>: the class name, @, and a number in hexadecimal. Not useful for people.</p><p>That is why classes <b>override</b> toString. Also good to know: <code>System.out.print(loan)</code> calls <code>loan.toString()</code> for you, and so does joining with a string: <code>"Loan: " + loan</code>.</p>' },
    33: outline('Next . . .', [4], '<p>Next: polymorphism.</p>'),
    34: { image: false, title: 'Polymorphism', blocks: [bul('In Java, polymorphism means that a variable of a supertype can refer to a subtype object.'), code('public class PolymorphismDemo {\n  /** Main method */\n  public static void main(String[] args) {\n    // Display circle and rectangle properties\n    displayObject(new Circle(1, "red", false));\n    displayObject(new Rectangle(1, 1, "black", true));\n  }\n\n  /** Display geometric object properties */\n  public static void displayObject(GeometricObject object) {\n    System.out.println("Created on " + object.getDateCreated() +\n      ". Color is " + object.getColor());\n  }\n}'), code('Created on Mon Mar 09 19:25:20 EDT 2011. Color is red\nCreated on Mon Mar 09 19:25:20 EDT 2011. Color is black', 'none')],
      explain: '<p><b>{{Polymorphism|تعدّد الأشكال}}</b> means “many forms”. In Java: a variable of a <b>supertype</b> can refer to an object of any <b>subtype</b>.</p><p>displayObject has a parameter of type GeometricObject. You can pass it a Circle, a Rectangle, or any future subclass, because each of them <b>is a</b> GeometricObject.</p><p>Why this is useful: you write displayObject <b>once</b>, and it works for every shape. Follow the drawing: the same variable refers first to a Circle, then to a Rectangle.</p>' },
    35: { image: false, title: 'Polymorphism and Dynamic Binding', blocks: [code(PD), note('Method m takes a parameter of the Object type. You can invoke it with any subtype of Object. This feature is known as polymorphism.'), note('When the method m(Object x) is executed, the x.toString() method is invoked. x may be an instance of GraduateStudent, Student, or Object. Classes GraduateStudent, Student, and Object have their own implementation of the toString() method.'), para('The used toString() method will be determined dynamically at runtime. This capability is known as dynamic binding.')],
      explain: '<p>Method m has a parameter <code>Object x</code>, so you can pass it any object at all. Inside m there is only one line: <code>x.toString()</code>.</p><p>Which toString runs? Not the one of the variable’s type (Object). Java looks at the <b>object</b> that x refers to <b>at that moment</b>: a GraduateStudent gives “Graduate Student”, a Student gives “Student”, a plain Object gives “java.lang.Object@…”.</p><p>This choice is made while the program runs, so it is called <b>{{dynamic binding|الربط الديناميكي: وقت التشغيل}}</b>. Remember: <b>the object decides, not the variable</b>.</p>' },
    36: { image: false, blocks: [bul('Dynamic binding works as follows: Suppose an object o is an instance of classes C1, C2, ..., and Cn, where C1 is a subclass of C2, C2 is a subclass of C3, ..., and Cn-1 is a subclass of Cn.'), bul('In Java, Cn is the Object class. If o invokes a method p, the JVM searches the implementation for the method p in C1, C2, ..., Cn-1 and Cn, in this order, until it is found. Once an implementation is found, the search stops, and the first-found implementation is invoked.')],
      explain: '<p>How does the JVM find the method? An object belongs to a chain of classes: its own class C1, its superclass C2, and so on up to Cn, which is always Object.</p><p>When you call a method p, the JVM looks in C1 first. If p is there, it runs it and <b>stops</b>. If not, it looks in C2, then C3, and so on. The <b>first</b> version found is the one that runs.</p><p>The drawing uses a clear example: a Kitten object (Kitten → Cat → Animal → Object). Press Next and watch where the search stops for name(), sound() and toString().</p><p class="watch">The search always starts at the class of the <b>object</b>, never at the type of the variable.</p>' },
    37: { image: false, title: 'Method Matching versus Binding', blocks: [bul('Matching a method signature and binding a method implementation are two different issues.'), bul('The compiler finds a matching method according to parameter type, number of parameters, and order of the parameters at compilation time.'), bul('A method may be implemented in several subclasses. The Java Virtual Machine dynamically binds the implementation of the method at runtime.')],
      explain: '<p>Two different questions, answered at two different times:</p><ul><li><b>Matching</b>, by the <b>compiler</b>, before the program runs: “Is this call allowed?” It looks at the <b>variable</b> type and checks the method name and the parameters (their types, number and order).</li><li><b>Binding</b>, by the <b>JVM</b>, while the program runs: “Which version runs?” It looks at the <b>object</b> type and searches up the classes.</li></ul><p>Example: with <code>Animal a = new Kitten();</code>, the call <code>a.purr()</code> does not compile, because Animal has no purr(), even though the object could purr. The call <code>a.sound()</code> compiles because Animal has sound(), but at run time Cat’s sound() runs.</p>' },
    38: outline('Next . . .', [5], '<p>Next: casting objects.</p>'),
    39: { image: false, blocks: [bul('You have already used the casting operator to convert variables of one primitive type to another. Casting can also be used to convert an object of one class type to another within an inheritance hierarchy.'), code('Object o = new Student(); // Implicit casting'), bul('The above statement is legal because an instance of Student is automatically an instance of Object (Student is a subclass of Object).'), bul('Suppose you want to assign the object reference o to a variable of the Student type using the following statement:'), code('Student b = o; // Compiler error'), bul('The compiler generates an error because an Object o is not a subtype of Student. To tell the compiler o is indeed a Student object, use explicit casting, as follows:'), code('Student b = (Student) o; // Explicit casting')],
      explain: '<p>Casting works with objects too, but only inside one family of classes.</p><ul><li><code>Object o = new Student();</code> works with <b>no cast</b>: every Student is an Object. This is <b>implicit casting</b>.</li><li><code>Student b = o;</code> does <b>not</b> compile. You know o refers to a Student, but the compiler only knows its type, Object, and not every Object is a Student.</li><li><code>Student b = (Student) o;</code> works: the cast tells the compiler “this one is a Student”. This is <b>explicit casting</b>.</li></ul><p class="watch">A cast does not change the object. It only changes how the compiler lets you use the reference.</p>' },
    40: { image: false, title: 'The instanceof Operator', blocks: [bul('It is always possible to cast an object of a subclass to an object of a superclass, known as upcasting or implicit casting.'), bul('When casting an object of a superclass to an object of its subclass, known as downcasting, explicit casting must be used using the cast notation.'), bul('For the casting to be successful, you must make sure the object to be casted is an instance of the subclass. If the superclass object is not an instance of the subclass, a runtime ClassCastException occurs.'), bul('Use the instanceof operator to test if an object is an instance of a class:'), code('void method(Object obj) {\n  // Perform casting if obj is an instance of Circle\n  if (obj instanceof Circle)\n    System.out.print("The diameter is " +\n      ((Circle) obj).getDiameter());\n}')],
      explain: '<p>Two directions:</p><ul><li><b>{{Upcasting|التحويل للأعلى}}</b>: subclass → superclass (Circle to Object). Always safe, done automatically.</li><li><b>{{Downcasting|التحويل للأسفل}}</b>: superclass → subclass (Object to Circle). It needs <code>(Circle)</code>, and it is checked while the program runs.</li></ul><p>If the object is not really a Circle, the program stops with a <b>ClassCastException</b>. So test first with <b>instanceof</b>, which gives true or false:</p><pre class="ex">if (obj instanceof Circle)\n  System.out.print(((Circle) obj).getDiameter());</pre>' },
    41: { image: false, title: 'Demonstrating instanceOf and Type Casting', blocks: [code(CD)], explain: '<p>displayObject gets an Object, so it must find out what the object really is. For each object: test with instanceof, then cast, then call getArea.</p><p>Why the cast? <code>object.getArea()</code> does not compile, because the compiler checks the variable type, Object, and Object has no getArea (matching, slide 37).</p><p>Why the extra parentheses in <code>((Circle) object).getArea()</code>? The dot is done before the cast. Without them, Java would try <code>object.getArea()</code> first.</p>' },
    42: { image: false, title: 'The equals Method', blocks: [bul('Like the toString() method, the equals(Object) method is another useful method defined in the Object class. Its signature:'), code('public boolean equals(Object o)', 'none'), bul('This method tests whether two objects are equal. The syntax for calling it is:'), code('object1.equals(object2);', 'none'), bul('The default implementation of the equals method in the Object class is:'), code('public boolean equals(Object obj) {\n  return this == obj;\n}'), bul('This implementation checks whether two reference variables point to the same object using the == operator. You should override this method in your custom class to test whether two distinct objects have the same content.')],
      explain: '<p>equals(Object) is in the Object class, so every object has it. You call it like <code>a.equals(b)</code>.</p><p>But Object’s version is only <code>return this == obj;</code>: it is true only when a and b are the <b>very same object</b>. Two different circles with the same radius are <b>not</b> equal by default.</p><p>To compare the <b>{{contents|المحتوى}}</b>, a class must override equals. String already does this, which is why "hi".equals("hi") is true.</p>' },
    43: { image: false, title: 'Overriding the equals Method', blocks: [bul('The equals method is overridden in many classes in the Java API, such as java.lang.String and java.util.Date, to compare whether the contents of two objects are equal.'), bul('The equals method in the String class is overridden to test whether two strings are identical in content.'), bul('You can override the equals method in the Circle class to compare whether two circles are equal based on their radius as follows:'), code('@Override // Annotation: compiler checks signature\npublic boolean equals(Object o) {\n  if (o instanceof Circle)\n    return radius == ((Circle)o).radius;\n  else return false;\n}'), para('Using the signature equals(Circle c) to override the equals method in a subclass is a common mistake. You should use equals(Object o).')],
      explain: '<p>To make two circles equal when their radius is the same, Circle overrides equals:</p><ol><li>The parameter must be <code>Object o</code>, exactly as in the Object class.</li><li><code>o instanceof Circle</code>: if o is not a circle, the answer is false.</li><li>Cast, then compare: <code>radius == ((Circle) o).radius</code>.</li></ol><p class="watch">A common {{mistake|خطأ}} is <code>equals(Circle c)</code>. It has different parameters, so it <b>overloads</b> instead of overriding, and code that calls equals(Object) still gets the old version. Writing <b>@Override</b> above the method makes the compiler catch this mistake.</p>' },
    44: { image: false, title: 'NOTE', blocks: [bul('The == comparison operator is used for comparing two primitive data type values or for determining whether two objects have the same references.'), bul('The equals method is intended to test whether two objects have the same contents, provided that the equals method is overridden in the subclass.'), bul('The == operator is stronger than the equals method, in that the == operator checks whether the two reference variables refer to the same object in memory.')],
      explain: '<p><code>==</code> and <code>equals</code> answer different questions:</p><ul><li><code>==</code> with two references: are they the <b>same object</b> in memory?</li><li><code>equals</code>: do the two objects have the <b>same contents</b>? (Only if the class overrides it.)</li></ul><pre class="ex">String a = new String("cs"), b = new String("cs");\na == b        // false: two objects\na.equals(b)   // true: the same characters</pre><p>For primitive values like int, use ==. For Strings and other objects, compare the contents with equals.</p>' },
    45: outline('Next . . .', [6], '<p>Next: ArrayList.</p>'),
    46: { image: false, title: 'The ArrayList Class', blocks: [bul('You can create an array to store objects. But the array’s size is fixed once the array is created. Java provides the ArrayList class that can be used to store an unlimited number of objects.')],
      explain: '<p>An array has a fixed size: <code>new String[10]</code> always has exactly 10 places. But often you do not know how many items there will be, like the students who join a course.</p><p><b>ArrayList</b> (in java.util) is a list that <b>grows and shrinks</b> by itself. Its main methods are add, get, set, remove, size, contains, indexOf, isEmpty and clear. You will meet them in the next slides.</p>' },
    47: { image: false, title: 'Generic Type', blocks: [bul('ArrayList is a generic class with a generic object type <E>'), bul('You can specify a type to replace <E> when creating an ArrayList object.'), bul('For example, the following statement creates an ArrayList of <String>. This ArrayList can be used to store a list of strings:'), code('ArrayList<String> cityList = new ArrayList<String>();'), code('// The concrete type is not required in the constructor\nArrayList<String> cityList = new ArrayList<>();')],
      explain: '<p>ArrayList is a <b>{{generic|عام: يأخذ النوع كمعامل}}</b> class: in the angle brackets you say what type it holds. <code>ArrayList&lt;String&gt;</code> holds strings; <code>ArrayList&lt;Circle&gt;</code> holds circles.</p><p>The compiler then checks every add: putting a number into an ArrayList&lt;String&gt; is a compile error.</p><p>On the right side you may write the type again, or leave the brackets empty: <code>new ArrayList&lt;&gt;()</code>.</p><p class="watch">The type must be a class. <code>ArrayList&lt;int&gt;</code> is wrong; use the wrapper class: <code>ArrayList&lt;Integer&gt;</code>.</p>' },
    48: { image: false, title: 'Testing the ArrayList class', blocks: [code('import java.util.ArrayList;\n\npublic class TestArrayList {\n  public static void main(String[] args) {\n    // Create a list to store cities\n    ArrayList<String> cityList = new ArrayList<>();\n\n    // Add some cities in the list\n    cityList.add("London");   // cityList = [London]\n    cityList.add("Denver");   // cityList = [London, Denver]\n    cityList.add("Paris");    // cityList = [London, Denver, Paris]\n    cityList.add("Miami");    // cityList = [London, Denver, Paris, Miami]\n    cityList.add("Tokyo");    // [London, Denver, Paris, Miami, Tokyo]\n\n    System.out.println("City list = " + cityList.toString());\n    System.out.println("List size = " + cityList.size());\n    System.out.println("Is Miami in the list? " + cityList.contains("Miami"));\n    System.out.println("Index of Denver? " + cityList.indexOf("Denver"));\n    System.out.println("Is the list empty? " + cityList.isEmpty());')],
      explain: '<p>Follow the list in the drawing while each line runs:</p><ul><li><code>add(x)</code> puts x at the <b>end</b>; the size grows by 1.</li><li><code>size()</code> is the number of elements (like length for arrays).</li><li><code>contains(x)</code>: is x in the list? true or false.</li><li><code>indexOf(x)</code>: the index of the first x, or -1 if it is not there. Indexes start at 0, as in arrays.</li><li><code>isEmpty()</code>: true when the size is 0.</li></ul><p>Printing the list shows all the elements in brackets: [London, Denver, …].</p>' },
    49: { image: false, title: 'Testing the ArrayList class – cont\'d', blocks: [code('    // Insert "Xian" at index 2\n    cityList.add(2, "Xian");  // [London, Denver, Xian, Paris, Miami, Tokyo]\n    cityList.remove("Miami"); // [London, Denver, Xian, Paris, Tokyo]\n    cityList.remove(1);       // [London, Xian, Paris, Tokyo]\n    System.out.println ("City list = " + cityList.toString());\n\n    // Display the contents of cityList in reverse order\n    for (int i = cityList.size() - 1; i >= 0; i--)\n      System.out.print(cityList.get(i) + " ");\n    System.out.println();\n\n    // Create a list to store two circles\n    ArrayList<Circle> list = new ArrayList<>();\n    list.add(new Circle(2));\n    list.add(new Circle(3));\n\n    // Display the area of the first circle in the list\n    System.out.println("The area of the circle = " + list.get(0).getArea());\n  }\n}')],
      explain: '<p>More operations:</p><ul><li><code>add(2, "Xian")</code> <b>inserts</b> at index 2. The elements after it move one place to the right.</li><li><code>remove("Miami")</code> removes that <b>element</b>. <code>remove(1)</code> removes the element <b>at index 1</b>. The others move left to close the gap.</li><li><code>get(i)</code> reads the element at index i, so a for loop can visit the list backwards.</li></ul><p>An ArrayList can hold any objects, even Circles: <code>list.get(0).getArea()</code> takes the first Circle and calls its method.</p>' },
    50: { image: false, title: 'Differences and Similarities between Arrays and ArrayList', blocks: [tbl(['Operation', 'Array', 'ArrayList'], [['Creating an array/ArrayList', '<code>String[] a = new String[10]</code>', '<code>ArrayList&lt;String&gt; list = new ArrayList&lt;&gt;();</code>'], ['Accessing an element', '<code>a[index]</code>', '<code>list.get(index);</code>'], ['Updating an element', '<code>a[index] = "London";</code>', '<code>list.set(index, "London");</code>'], ['Returning size', '<code>a.length</code>', '<code>list.size();</code>'], ['Adding a new element', '', '<code>list.add("London");</code>'], ['Inserting a new element', '', '<code>list.add(index, "London");</code>'], ['Removing an element', '', '<code>list.remove(index);</code>'], ['Removing an element', '', '<code>list.remove(Object);</code>'], ['Removing all elements', '', '<code>list.clear();</code>']])],
      explain: '<p>The table puts the two side by side:</p><ul><li>Read: <code>a[i]</code> or <code>list.get(i)</code></li><li>Change: <code>a[i] = x</code> or <code>list.set(i, x)</code></li><li>Size: <code>a.length</code> (no parentheses) or <code>list.size()</code></li></ul><p>Only the list can add, insert, remove and clear. Use an array when the size is known and fixed; use an ArrayList when the number of items changes.</p>' },
    51: { image: false, title: 'Distinct Numbers', blocks: [code('import java.util.ArrayList;\nimport java.util.Scanner;\n\npublic class DistinctNumbers {\n  public static void main(String[] args) {\n' + DN.split('\n').map(function (l) { return '    ' + l; }).join('\n') + '\n  }\n}')],
      explain: '<p>The task: read numbers until 0, and keep each number only <b>once</b>.</p><p>The key line is <code>if (!list.contains(value) &amp;&amp; value != 0) list.add(value);</code>: add the value only if it is not in the list yet, and it is not the 0 that ends the input.</p><p>The list keeps the numbers in the order they first came. Try the example buttons in the drawing: repeated numbers, all the same, and 0 at once (an empty list).</p>' },
    52: { image: false, title: 'A Custom Stack Class', blocks: [bul('You can use an ArrayList to implement a stack. The UML diagram for the class MyStack is shown below:')],
      explain: '<p>A stack is last-in, first-out (unit 3). MyStack builds one on top of an ArrayList: the <b>end</b> of the list is the <b>top</b> of the stack.</p><ul><li>push = add at the end</li><li>pop = take the last element and remove it</li><li>peek = look at the last element</li></ul><p>Compare with StackOfIntegers: there you had to manage an array and its {{capacity|السعة}}. Here the ArrayList grows by itself, so the code is much shorter. And it holds Objects, so it can stack anything.</p>' },
    53: { image: false, title: 'The MyStack Class', blocks: [code(MS)], explain: '<p>Each method is one or two lines, because ArrayList does the work. The top element is always at index <code>getSize() - 1</code>, the last index.</p><p>pop must first <b>save</b> the element in o, then remove it, then return o. If it removed first, the element would be lost.</p><p>toString is overridden, so printing a stack shows <code>stack: [a, b]</code>.</p><p class="watch">The slide writes the minus sign as “−”; in real code it must be the normal - sign.</p>' },
    54: outline('Next . . .', [7], '<p>Next: protected and the full visibility rules.</p>'),
    55: { image: false, title: 'Visibility or Accessibility Modifiers', blocks: [bul('The modifiers private, protected, and public are known as visibility or accessibility modifiers because they specify how classes and class members are accessed. The visibility of these modifiers increases in this order:'), para('Visibility increases: private, default (no modifier), protected, public'), bul('A protected data or method in a public class can be accessed by any class in the same package or its subclasses, even if the subclasses are in a different package.')],
      explain: '<p>Visibility modifiers decide <b>who</b> may use a member of a class. From the most closed to the most open:</p><p><b>private</b> → <b>default</b> (no modifier) → <b>protected</b> → <b>public</b></p><p><b>{{protected|محمي: للحزمة وللأبناء}}</b> is new here: like default, every class in the same package can use it; in addition, <b>subclasses</b> can use it even when they are in another package. It is made for inheritance: “for my family”.</p>' },
    56: { image: false, title: 'Data and Methods Visibility', blocks: [tbl(['Modifier on members in a class', 'Accessed from the same class', 'Accessed from the same package', 'Accessed from a subclass in a different package', 'Accessed from a different package'], [['Public', '✓', '✓', '✓', '✓'], ['Protected', '✓', '✓', '✓', '–'], ['Default (no modifier)', '✓', '✓', '–', '–'], ['Private', '✓', '–', '–', '–']]), bul('Use the private modifier to hide the members of the class completely so they cannot be accessed directly from outside the class.'), bul('Use no modifier (the default) to allow members of the class to be accessed directly from any class within the same package but not from other packages.'), bul('Use the protected modifier to enable members of the class to be accessed by the subclasses in any package or classes in the same package.'), bul('Use the public modifier to enable members of the class to be accessed by any class.')],
      explain: '<p>Read the table row by row, from the bottom up; each row has one more ✓:</p><ul><li><b>private</b>: only inside the class itself.</li><li><b>default</b>: plus every class in the same package.</li><li><b>protected</b>: plus subclasses in other packages.</li><li><b>public</b>: plus everyone else.</li></ul><p>Good practice: make fields private, and open each method only as much as it is needed.</p>' },
    57: { image: false, title: 'Example of Visibility Modifiers', blocks: [code('package p1;\n\npublic class C1 {\n  public int x;\n  protected int y;\n  int z;\n  private int u;\n\n  protected void m() {\n  }\n}')],
      explain: '<p>C1 is in package p1 and has one member of each kind: x is public, y is protected, z has no modifier, u is private.</p><p>The drawing tests four classes: C2 (p1, not a subclass), C3 (p1, a subclass), C4 (p2, a subclass) and C5 (p2, not a subclass). Before each step, guess which members the class can use. Use the table of slide 56: first ask “same package?”, then “subclass?”.</p>' },
    58: { image: false, title: 'Notes', blocks: [bul('The private and protected modifiers can be used only for members of the class, but not for the class itself.'), bul('The public modifier and the default modifier (no modifier) can be used on members as well as on the class.'), bul('A class with no modifier cannot be accessed by classes from other packages. However, it can be accessed by classes in the same package.'), bul('A subclass may override a protected method in its superclass and change its visibility to public.'), bul('A subclass cannot weaken the accessibility of a method defined in the superclass. For example, if a method is defined as public in the superclass, it must be defined as public in the subclass.')],
      explain: '<p>More rules:</p><ul><li>A <b>class</b> itself can only be public or default. private and protected are only for members.</li><li>A default class cannot be used from another package.</li><li>An overriding method may make access <b>wider</b> (protected → public), but never <b>narrower</b> (public → protected is an error).</li></ul><p>Why the last rule? Code that uses the superclass expects to be able to call the method. A subclass cannot take that away.</p>' },
    59: { image: false, title: 'Preventing Extending and Overriding', blocks: [bul('You may occasionally want to prevent classes from being extended. In such cases, use the final modifier to indicate a class is final and cannot be a parent class.'), bul('For example, class A is final and cannot be extended:'), code('public final class A {\n  // Data fields, constructors, and methods omitted\n}'), bul('You also can define a method to be final; a final method cannot be overridden by its subclasses:'), code('public final void m() {\n  // Do something\n}')],
      explain: '<p>The word <b>{{final|نهائي: لا يُغيَّر}}</b> stops changes:</p><ul><li><code>final class A</code>: no class can extend A.</li><li><code>final void m()</code>: subclasses cannot override m.</li></ul><pre class="ex">public final class A { }\nclass B extends A { }   // ✗ compile error</pre><p>Use it when a class or a method must work exactly as written, for example for safety.</p>' },
    60: { image: false, title: 'The final Modifier', blocks: [bul('The Math class is a final class and cannot be extended:'), code('public final class Math {\n  ...\n}'), bul('The String, StringBuilder, and all wrapper classes for primitive data types are also final classes.'), bul('A final data field is a constant.'), code('final static double PI = 3.1415926535897932;')],
      explain: '<p>The Java library uses final a lot: Math, String, StringBuilder and all the wrapper classes (Integer, Double, …) are final classes, so nobody can change how they work.</p><p>On a data field, final makes a <b>constant</b>: it gets its value once and can never change. Constants are written in capitals: <code>final static double PI = 3.14159…;</code>, as in CS I.</p>' }
  };
  [16, 17, 18, 19, 20, 21, 22, 23, 24].forEach(function (n, i) { slides[n].explain = '<p>' + ['main creates one Faculty object with <code>new Faculty()</code>. Only one object will exist at the end, but three constructors work together to build it.', 'Faculty() starts. Its first line is hidden: the compiler added <code>super();</code>. So before line (4) can print, Faculty() must call Employee(). Faculty() waits.', 'Employee() starts. Its first line is <code>this("(2) …")</code>: it calls another constructor of the <b>same</b> class. A constructor that starts with this(…) gets no hidden super().', 'Employee(String s) starts. It has no this(…) or super(…), so the compiler added <code>super();</code> as its first line. Now Person() is called. Three constructors are waiting.', 'Person() starts. Its superclass is Object, whose constructor prints nothing. There is nothing above: the chain has reached the top.', 'Person()’s body runs, so line (1) is printed <b>first</b>, even though Person() was the last constructor to start.', 'Person() is done, so we go back to the constructor that called it: Employee(String s). It prints s: line (2).', 'Back in Employee(): the this(…) call is finished, so the rest of its body runs: line (3).', 'Last, Faculty()’s body runs: line (4). The order is 1, 2, 3, 4: the bodies run from the top class down to the class you created.'][i] + '</p>'; });

  addUnit({
    course: 'cs2', lesson: '04-inheritance-and-polymorphism',
    blurb: 'Build new classes from existing ones: extends and super, constructor chaining, overriding, the Object class, polymorphism and dynamic binding, casting, ArrayList, protected and final.',
    parts: [
      {
        title: 'Superclasses and subclasses', from: 1, to: 10,
        quiz: [
          { q: 'In <code>class Circle extends GeometricObject</code>, which is the superclass?', options: ['Object only', 'Circle', 'GeometricObject'], answer: 2, why: 'The class after extends is the superclass (slide 3).' },
          { q: 'Can Circle’s code use the private field color of GeometricObject directly?', options: ['Yes, because it is inherited', 'No, only through getColor and setColor', 'Only inside the constructor'], answer: 1, why: 'Slide 8.' },
          { type: 'output', q: 'What does this print?', code: 'Circle c = new Circle(3.0);\nSystem.out.println(c.getColor() + " " + c.isFilled());', answer: 'white false', why: 'The inherited defaults (slide 6).' },
          { type: 'output', q: 'And this?', code: 'Rectangle r = new Rectangle(2.0, 5.0, "red", true);\nSystem.out.println(r.getPerimeter() + " " + r.getColor());', answer: '14.0 red', why: '2 × (2 + 5) = 14.0; the color was set with setColor.' },
          { type: 'tf', q: 'A subclass can add new data fields and new methods.', answer: true, why: 'Slide 8.' }
        ]
      },
      {
        title: 'Constructors and super', from: 11, to: 26,
        quiz: [
          { q: 'What does the compiler add to a constructor that calls neither this(…) nor super(…)?', options: ['super(); as the first statement', 'Nothing: the constructor stays as written', 'this(); as the first statement'], answer: 0, why: 'Slide 12.' },
          { type: 'tf', q: 'A subclass inherits the constructors of its superclass.', answer: false, why: 'Constructors are not inherited; call them with super (slide 13).' },
          { type: 'order', q: 'Put the output lines of slide 15 in order.', lines: ["(1) Performs Person's tasks", "(2) Invoke Employee's overloaded constructor", "(3) Performs Employee's tasks", "(4) Performs Faculty's tasks"], why: 'The chain goes up first; the bodies run from the top down.' },
          { q: 'Why does Apple (slide 25) not compile?', options: ['Apple has no fields of its own', 'Its hidden super() needs Fruit(), which does not exist', 'Fruit is not public, so Apple cannot extend it'], answer: 1, why: 'Fruit has only Fruit(String name).' },
          { q: 'Where must <code>super(…)</code> appear?', options: ['As the first statement of the constructor', 'Anywhere inside the constructor', 'As the last statement of the constructor'], answer: 0, why: 'Slide 14.' }
        ]
      },
      {
        title: 'Overriding and Object', from: 27, to: 32,
        quiz: [
          { q: 'Overriding means…', options: ['calling super', 'the same name with other parameters', 'the same signature in a subclass, replacing the method'], answer: 2, why: 'Slides 28 and 30.' },
          { type: 'output', q: 'TestOverloading of slide 30: what does this print?', code: 'A a = new A();\na.p(10);\na.p(10.0);', answer: '10\n20.0', why: 'p(int) in A, then p(double) in B.' },
          { type: 'tf', q: 'A private method can be overridden.', answer: false, why: 'It is not accessible in the subclass (slide 29).' },
          { q: 'What is the superclass of a class that says no extends?', options: ['It has none', 'java.lang.Object', 'java.lang.Class'], answer: 1, why: 'Slide 31.' },
          { q: 'What does the default toString return?', options: ['Class name, @, and a hex number, like Loan@15037e5', 'All the field values, like Loan[rate=2.5]', 'An empty string, until you override it'], answer: 0, why: 'Slide 32.' }
        ]
      },
      {
        title: 'Polymorphism and dynamic binding', from: 33, to: 37,
        quiz: [
          { q: 'Polymorphism means…', options: ['a method has many parameters of different types', 'a class has many constructors with different parameters', 'a variable of a supertype can refer to a subtype object'], answer: 2, why: 'Slide 34.' },
          { type: 'output', q: 'With the classes of slide 35, what does this print?', code: 'Object x = new GraduateStudent();\nSystem.out.println(x.toString());', answer: 'Graduate Student', why: 'The object’s class decides, at run time.' },
          { q: 'Who decides which implementation runs?', options: ['The JVM, at run time', 'The compiler', 'The programmer at each call'], answer: 0, why: 'Dynamic binding (slide 37).' },
          { q: 'C1 extends C2 extends Object. Only C2 defines p(). o is a C1. Which p() runs for <code>o.p()</code>?', options: ['Object’s', 'C2’s', 'None: error'], answer: 1, why: 'The search goes C1, C2, … and stops at the first one found (slide 36).' },
          { type: 'trace', q: 'Which class’s info() runs for each object? Write the class name.', code: 'class Vehicle {\n  public String info() { return \"vehicle\"; }\n  public String wheels() { return \"4 wheels\"; }\n}\nclass Car extends Vehicle {\n  public String info() { return \"car\"; }\n}\nclass SportsCar extends Car {\n  public void openRoof() { }\n}', cols: ['v refers to', 'info() from class'], rows: [['new Vehicle()', '?Vehicle'], ['new Car()', '?Car'], ['new SportsCar()', '?Car']], why: 'The search starts at the object’s class. SportsCar has no info(), so the search goes up one class to Car.' },
          { type: 'fill', q: 'Write the parameter type so that show works for a Vehicle, a Car and a SportsCar (the classes of the question above).', code: 'public static void show(___ x) {\n  System.out.println(x.info());\n}', answer: ['Vehicle'], why: 'Vehicle is the most general class that has info(). With Object, x.info() would not compile: Object has no info().' },
          { type: 'bug', q: 'With the same classes, one line does not compile. Tap it.', code: 'Vehicle v = new SportsCar();\nSystem.out.println(v.info());\nv.openRoof();', answer: 3, why: 'The compiler checks the variable type, Vehicle, and Vehicle has no openRoof(). It would work with a cast: ((SportsCar) v).openRoof().' },
          { type: 'tf', q: 'The compiler decides which overridden version of a method runs.', answer: false, why: 'The compiler only checks that the call is allowed. The JVM chooses the version at run time, from the object.' }
        ]
      },
      {
        title: 'Casting and equals', from: 38, to: 44,
        quiz: [
          { q: 'Which line compiles?', options: ['Student s = o;  (o is an Object variable)', 'Student s = new Object();', 'Object o = new Student();'], answer: 2, why: 'Upcasting is automatic (slide 39).' },
          { q: 'What happens if you cast an object to a class it is not an instance of?', options: ['Nothing', 'ClassCastException at run time', 'It becomes that class'], answer: 1, why: 'Slide 40: test with instanceof first.' },
          { type: 'output', q: 'What does this print?', code: 'Object o = new Circle(1);\nSystem.out.println(o instanceof Circle);\nSystem.out.println(o instanceof Rectangle);', answer: 'true\nfalse', why: 'The object is a Circle.' },
          { type: 'output', q: 'With equals overridden as in slide 43, what does this print?', code: 'Circle a = new Circle(2), b = new Circle(2);\nSystem.out.println((a == b) + " " + a.equals(b));', answer: 'false true', why: '== compares references; equals compares the radius.' }
        ]
      },
      {
        title: 'The ArrayList class', from: 45, to: 53,
        quiz: [
          { type: 'output', q: 'What does this print?', code: 'ArrayList<String> l = new ArrayList<>();\nl.add("A"); l.add("B"); l.add(1, "C");\nSystem.out.println(l);', answer: '[A, C, B]', why: 'add(1, "C") inserts at index 1.' },
          { type: 'output', q: 'And this?', code: 'ArrayList<String> l = new ArrayList<>();\nl.add("x"); l.add("y"); l.add("z");\nl.remove(0);\nSystem.out.println(l.size() + " " + l.get(0));', answer: '2 y', why: 'remove(0) removes "x".' },
          { q: 'Which line is wrong?', options: ['ArrayList<int> list = new ArrayList<>();', 'ArrayList<Integer> list = new ArrayList<>();', 'ArrayList<String> list = new ArrayList<String>();'], answer: 0, why: 'A generic type must be a class: use Integer.' },
          { type: 'output', q: 'DistinctNumbers (slide 51) reads 4 4 2 4 0. What does the last loop print?', code: 'for (int i = 0; i < list.size(); i++)\n  System.out.print(list.get(i) + " ");', answer: '4 2', why: 'Each number is added only once; 0 ends the input.' },
          { type: 'output', q: 'With MyStack, what does this print?', code: 'MyStack s = new MyStack();\ns.push(1); s.push(2); s.push(3);\ns.pop();\nSystem.out.println(s.peek() + " " + s.getSize());', answer: '2 2', why: 'pop removes 3; the top is 2.' }
        ]
      },
      {
        title: 'Visibility and final', from: 54, to: 60,
        quiz: [
          { q: 'Who can use a <b>protected</b> member?', options: ['Only the same class and nobody else', 'The same package, and subclasses in any package', 'Every class in every package'], answer: 1, why: 'Slides 55-56.' },
          { q: 'C4 extends C1 but is in another package. Can it use C1’s field <code>int z;</code> (no modifier)?', options: ['No', 'Yes'], answer: 0, why: 'Default access is the package only (slide 57).' },
          { q: 'A superclass method is public. In the subclass, the overriding method may be…', options: ['private', 'protected', 'only public'], answer: 2, why: 'You cannot weaken access (slide 58).' },
          { type: 'tf', q: 'You can write <code>class MyMath extends Math</code>.', answer: false, why: 'Math is final (slide 60).' }
        ]
      }
    ],
    slides: slides,
    visuals: ALL,
    exam: {
      questions: [
        { q: 'A subclass is also called…', options: ['a child class, extended class or derived class', 'a parent class or superclass', 'a base class or general class'], answer: 0, review: 3, why: 'Slide 3.' },
        { type: 'output', q: 'What does this print?', code: 'Circle c = new Circle(1.0, "green", true);\nSystem.out.println(c.getColor() + " " + c.getDiameter());', answer: 'green 2.0', review: 7, why: 'setColor in the constructor; diameter 2 × 1.0.' },
        { type: 'output', q: 'What does this print?', code: 'class A {\n  A() { System.out.print("A"); }\n}\nclass B extends A {\n  B() { System.out.print("B"); }\n}\n// in main:\nnew B();', answer: 'AB', review: 12, why: 'B() first calls the hidden super().' },
        { type: 'output', q: 'And this?', code: 'class A {\n  A() { System.out.print("A"); }\n}\nclass B extends A {\n  B() { System.out.print("B"); }\n}\nclass C extends B {\n  C() { System.out.print("C"); }\n}\n// in main:\nnew C();', answer: 'ABC', review: 15, why: 'Constructor chaining.' },
        { q: 'Where must super(…) be written?', options: ['In any method', 'First in the subclass constructor', 'After the fields are set'], answer: 1, review: 14, why: 'Slide 14.' },
        { q: 'Class P has only <code>P(int x)</code>. What about <code>class Q extends P { Q() { } }</code>?', options: ['It works if P is public', 'It works with x = 0', 'Compile error'], answer: 2, review: 25, why: 'The hidden super() needs P().' },
        { type: 'output', q: 'What does this print?', code: 'class B { void p(double i) { System.out.println(i * 2); } }\nclass A extends B { void p(double i) { System.out.println(i); } }\n// in main:\nB b = new A();\nb.p(3);', answer: '3.0', review: 30, why: 'A overrides p, and the object is an A: dynamic binding.' },
        { q: 'What is overloading?', options: ['Same name, different parameter lists', 'Same signature in a subclass', 'A final method'], answer: 0, review: 30, why: 'Slide 30.' },
        { type: 'output', q: 'What does this print?', code: 'class Pet { public String toString() { return "Pet"; } }\nclass Dog extends Pet { public String toString() { return "Dog"; } }\n// in main:\nPet p = new Dog();\nSystem.out.println(p);', answer: 'Dog', review: 35, why: 'print calls toString; the object is a Dog.' },
        { q: 'Which is decided by the compiler?', options: ['Which overridden version runs', 'Whether a method call matches a signature', 'The object’s real class'], answer: 1, review: 37, why: 'Matching at compile time; binding at run time.' },
        { q: 'Which cast needs the (Type) notation?', options: ['From superclass to subclass (downcasting)', 'From subclass to superclass', 'Neither'], answer: 0, review: 40, why: 'Slide 40.' },
        { type: 'output', q: 'What does this print?', code: 'Object o = "Java";\nif (o instanceof String)\n  System.out.println(((String) o).length());', answer: '4', review: 41, why: 'The object is a String, so the cast is safe.' },
        { type: 'output', q: 'What does this print? (Circle has no equals of its own.)', code: 'Circle a = new Circle(1), b = new Circle(1);\nSystem.out.println(a.equals(b));', answer: 'false', review: 42, why: 'Object’s equals is the same as ==.' },
        { type: 'output', q: 'What does this print?', code: 'String s1 = new String("hi"), s2 = new String("hi");\nSystem.out.println((s1 == s2) + " " + s1.equals(s2));', answer: 'false true', review: 44, why: 'Two objects; String overrides equals.' },
        { type: 'output', q: 'What does this print?', code: 'ArrayList<Integer> l = new ArrayList<>();\nl.add(5); l.add(7); l.add(5);\nSystem.out.println(l.indexOf(5) + " " + l.contains(9));', answer: '0 false', review: 48, why: 'The first 5 is at index 0.' },
        { type: 'output', q: 'What does this print?', code: 'ArrayList<String> l = new ArrayList<>();\nl.add("a"); l.add("b");\nl.set(0, "z");\nSystem.out.println(l);', answer: '[z, b]', review: 50, why: 'set replaces the element.' },
        { q: 'Which member can a class in another package that is not a subclass use?', options: ['everything except private', 'public and protected', 'public only'], answer: 2, review: 56, why: 'The last column of the table.' },
        { q: 'A final method…', options: ['cannot be overridden', 'cannot be called', 'must be static'], answer: 0, review: 59, why: 'Slide 59.' },
        { type: 'fill', q: 'Complete the constructor so it calls Animal(String name).', code: 'class Dog extends Animal {\n  public Dog(String name) {\n    ___(name);\n  }\n}', answer: ['super'], review: 13, why: 'super(arguments) calls the superclass constructor, as the first statement.' },
        { type: 'fill', q: 'Complete this equals, so it really overrides Object’s equals.', code: 'public boolean equals(___ o) {\n  if (o ___ Circle)\n    return radius == ((Circle) o).radius;\n  return false;\n}', answer: ['Object', 'instanceof'], review: 43, why: 'The parameter must be Object, as in the Object class; instanceof tests the object before the cast.' },
        { type: 'write', q: 'Square extends GeometricObject and has a field side. Override toString so it returns the superclass text followed by " side = " and the side. Use super.', rows: 3, checks: [{ re: /public\s+String\s+toString\s*\(\s*\)/, label: 'public String toString()' }, { re: /return\s+super\s*\.\s*toString\s*\(\s*\)\s*\+\s*" side = "\s*\+\s*side\s*;/, label: 'return super.toString() + " side = " + side;' }], solution: 'public String toString() {\n  return super.toString() + " side = " + side;\n}', review: 28, why: 'super.toString() runs GeometricObject’s version; the subclass adds its own part.' },
        { type: 'write', q: 'obj is an Object variable. If it refers to a Rectangle, print its area (use instanceof and a cast).', rows: 3, checks: [{ re: /if\s*\(\s*obj\s+instanceof\s+Rectangle\s*\)/, label: 'if (obj instanceof Rectangle)' }, { re: /\(\s*\(\s*Rectangle\s*\)\s*obj\s*\)\s*\.\s*getArea\s*\(\s*\)/, label: '((Rectangle) obj).getArea()' }], solution: 'if (obj instanceof Rectangle)\n  System.out.println(((Rectangle) obj).getArea());', review: 41, why: 'Without the cast, obj.getArea() does not compile: Object has no getArea.' },
        { type: 'trace', q: 'v refers to a SportsCar. In which class is each method found?', code: 'class Vehicle {\n  public String info() { return \"vehicle\"; }\n  public String wheels() { return \"4 wheels\"; }\n}\nclass Car extends Vehicle {\n  public String info() { return \"car\"; }\n}\nclass SportsCar extends Car {\n  public void openRoof() { }\n}', cols: ['call', 'found in class'], rows: [['v.info()', '?Car'], ['v.wheels()', '?Vehicle'], ['v.toString()', '?Object']], review: 36, why: 'Start at SportsCar and go up: Car has info(), Vehicle has wheels(), only Object has toString().' },
        { type: 'bug', q: 'This does not compile. Tap the wrong line.', code: 'class B {\n  public void show() { }\n}\nclass A extends B {\n  protected void show() { }\n}', answer: 5, review: 58, why: 'An overriding method cannot weaken access: public in B must stay public in A.' },
        { type: 'match', q: 'Animal a = new Kitten(); Match each question with who answers it.', pairs: [['Is a.sound() allowed?', 'The compiler, using the type Animal'], ['Which sound() runs?', 'The JVM, using the object Kitten']], review: 37, why: 'Matching at compile time; binding at run time.' }
      ],
      tasks: [
        {
          title: 'A subclass with super',
          task: '<p>Class <code>Animal</code> has a constructor <code>Animal(String name)</code> and a method <code>getName()</code>. Write <code>class Dog extends Animal</code> with a constructor <code>Dog(String name)</code> that calls <b>super(name)</b>, and a method <code>speak()</code> that returns <code>getName() + " says Woof"</code>.</p>',
          starter: 'class Animal {\n  private String name;\n  public Animal(String name) { this.name = name; }\n  public String getName() { return name; }\n}\n\n',
          output: 'new Dog("Rex").speak() returns "Rex says Woof"',
          checks: [
            { re: /class\s+Dog\s+extends\s+Animal/, label: '<code>class Dog extends Animal</code>', review: 7 },
            { re: /Dog\s*\(\s*String\s+\w+\s*\)\s*\{\s*super\s*\(\s*\w+\s*\)\s*;/, label: 'Constructor starts with <code>super(name);</code>', review: 13 },
            { re: /String\s+speak\s*\(\s*\)\s*\{\s*return\s+getName\s*\(\s*\)\s*\+\s*" says Woof"\s*;/, label: '<code>speak()</code> returns <code>getName() + " says Woof"</code>', review: 8 },
            { fn: braces, label: 'Braces match', review: 7 }
          ],
          solution: 'class Animal {\n  private String name;\n  public Animal(String name) { this.name = name; }\n  public String getName() { return name; }\n}\n\nclass Dog extends Animal {\n  public Dog(String name) {\n    super(name);\n  }\n\n  public String speak() {\n    return getName() + " says Woof";\n  }\n}'
        },
        {
          title: 'Override toString and equals',
          task: '<p>In class <code>Point</code> (fields x and y), <b>override</b> <code>toString()</code> to return <code>"(" + x + ", " + y + ")"</code>, and override <code>equals(Object o)</code> so that two points are equal when x and y are the same. Use <code>instanceof</code> and a cast.</p>',
          starter: 'public class Point {\n  private int x, y;\n  public Point(int x, int y) { this.x = x; this.y = y; }\n\n}',
          output: 'new Point(1, 2).equals(new Point(1, 2)) is true',
          checks: [
            { re: /public\s+String\s+toString\s*\(\s*\)/, label: '<code>public String toString()</code>', review: 32 },
            { re: /public\s+boolean\s+equals\s*\(\s*Object\s+\w+\s*\)/, label: '<code>public boolean equals(Object o)</code> (not equals(Point p))', review: 43 },
            { re: /instanceof\s+Point/, label: 'Tests <code>o instanceof Point</code>', review: 40 },
            { re: /\(\s*\(\s*Point\s*\)\s*\w+\s*\)\s*\.\s*x|\(\s*Point\s*\)\s*\w+\s*;/, label: 'Casts to Point', review: 41 },
            { fn: braces, label: 'Braces match', review: 43 }
          ],
          solution: 'public class Point {\n  private int x, y;\n  public Point(int x, int y) { this.x = x; this.y = y; }\n\n  @Override\n  public String toString() {\n    return "(" + x + ", " + y + ")";\n  }\n\n  @Override\n  public boolean equals(Object o) {\n    if (o instanceof Point)\n      return x == ((Point) o).x && y == ((Point) o).y;\n    else\n      return false;\n  }\n}'
        },
        {
          title: 'An ArrayList of names',
          task: '<p>Create an <code>ArrayList&lt;String&gt;</code>, add "Ali", "Sara" and "Omar", remove "Sara", insert "Lina" at index 0, then print the list and its size.</p>',
          starter: 'import java.util.ArrayList;\n\npublic class Names {\n  public static void main(String[] args) {\n    \n  }\n}',
          output: '[Lina, Ali, Omar]\n3',
          checks: [
            { re: /ArrayList\s*<\s*String\s*>\s+\w+\s*=\s*new\s+ArrayList\s*<\s*(String)?\s*>\s*\(\s*\)/, label: 'Creates an <code>ArrayList&lt;String&gt;</code>', review: 47 },
            { re: /\.add\s*\(\s*"Ali"\s*\)[\s\S]*\.add\s*\(\s*"Sara"\s*\)[\s\S]*\.add\s*\(\s*"Omar"\s*\)/, label: 'Adds Ali, Sara and Omar', review: 48 },
            { re: /\.remove\s*\(\s*"Sara"\s*\)/, label: 'Removes "Sara"', review: 49 },
            { re: /\.add\s*\(\s*0\s*,\s*"Lina"\s*\)/, label: 'Inserts "Lina" at index 0', review: 49 },
            { re: /\.size\s*\(\s*\)/, label: 'Prints the size with <code>size()</code>', review: 48 }
          ],
          solution: 'import java.util.ArrayList;\n\npublic class Names {\n  public static void main(String[] args) {\n    ArrayList<String> names = new ArrayList<>();\n    names.add("Ali");\n    names.add("Sara");\n    names.add("Omar");\n    names.remove("Sara");\n    names.add(0, "Lina");\n    System.out.println(names);\n    System.out.println(names.size());\n  }\n}'
        }
      ]
    }
  });
})();
