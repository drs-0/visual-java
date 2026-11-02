/* CS2 · Unit 8 · Interfaces (33 slides): what an interface is, Edible, omitted modifiers, Comparable and compareTo,
   ComparableRectangle and Arrays.sort, interfaces vs abstract classes, multiple interfaces, and the Rational class */
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
  function hot(o) { return mix(o || {}, { tone: 'accent', hi: true }); }
  function cls(id, x, y, w, name, lines, o) {
    o = o || {};
    return B(id, x, y, w, lines.length ? boxH(lines.length) : 40, mix({ title: name, band: lines.length > 0, mono: true, size: o.size || 12.5, lsize: o.lsize || 11.5, italic: !!o.abs, lines: lines.map(function (f) { return typeof f === 'string' ? { t: f } : f; }), tone: o.tone || 'blue', hi: !!o.hi, tag: o.tag }, o.extra || {}));
  }

  /* ---------- 1. the Edible interface (slides 3-8) ---------- */
  var TE = 'abstract class Animal { /* Data fields and methods omitted */ }\n\nclass Chicken extends Animal implements Edible {\n  public String howToEat() { return "Chicken: Fry it"; }\n  public String sound() { return "Chicken sound"; }\n}\n\nabstract class Fruit implements Edible { /* Data and methods */ }\n\nclass Apple extends Fruit {\n  public String howToEat() { return "Apple: Make apple cider"; }\n}\n\nObject[] objects = {new Tiger(), new Chicken(), new Apple()};\nfor (int i = 0; i < objects.length; i++)\n  if (objects[i] instanceof Edible)\n    System.out.println(((Edible)objects[i]).howToEat());';
  var edible = {
    id: 'edible', slides: [3, 8], title: 'Edible: a behavior shared by unrelated classes',
    code: 'public interface Edible {\n  public abstract String howToEat();   // or just: String howToEat();\n}\n\n' + TE,
    steps: [
      { line: '1-3', slide: 3, ph: 'what', cap: 'An <b>interface</b> is like a class, but contains only <b>abstract methods</b> and <b>constants</b>. It describes a <b>behavior</b>: objects that are comparable, edible, cloneable…' },
      { line: 1, slide: 4, ph: 'def', cap: '<code>public interface Edible { String howToEat(); }</code> uses the keyword <b>interface</b> instead of class.' },
      { line: 2, slide: 5, ph: 'rules', cap: 'An interface is a special abstract class: all its methods are abstract, it can be used as a <b>type</b> for a variable, it cannot be created with new, and it is compiled into its own .class file.' },
      { slide: 6, line: '7-10', ph: 'uml', cap: 'Chicken <b>extends</b> Animal and <b>implements</b> Edible. In UML an interface is marked «interface» and in italics; a <b>dashed</b> line with a hollow triangle points to it. Tiger is an Animal but not Edible.' },
      { slide: 7, line: '12-16', ph: 'fruit', cap: 'Fruit implements Edible but is abstract, so it need not write howToEat; its concrete subclass Apple (and Orange) must.' },
      { slide: 7, line: '18-21', ph: 'run', cap: 'TestEdible: for each object, <code>instanceof Edible</code> tells if it can be eaten. The Tiger is skipped.', out: ['Chicken: Fry it', 'Apple: Make apple cider'] },
      { line: 2, slide: 8, ph: 'omit', cap: 'In an interface every field is <code>public static final</code> and every method is <code>public abstract</code>, so these words may be left out. A constant K of interface T is used as <code>T.K</code>.' }
    ],
    draw: function (k, s) {
      var ph = s.ph, items = [];
      if (ph === 'what' || ph === 'def' || ph === 'rules') {
        items.push(cls('e', 150, 30, 260, 'Edible', [{ t: '+howToEat(): String', i: true }], { tag: '«interface»', abs: true, tone: 'accent', hi: ph === 'def' }));
        if (ph === 'rules') [['all methods abstract'], ['usable as a type'], ['no new Edible()'], ['own .class file']].forEach(function (r, i) { items.push(B('r' + i, 20 + (i % 2) * 270, 150 + Math.floor(i / 2) * 70, 250, 54, { title: r[0], size: 13, tone: i === 2 ? 'red' : 'teal' })); });
        if (ph === 'what') ['Comparable', 'Edible', 'Cloneable'].forEach(function (n, i) { items.push(B('b' + i, 30 + i * 175, 170, 160, 44, { title: n, mono: true, size: 13, italic: true, tone: 'blue' })); });
        return items;
      }
      if (ph === 'omit') return [B('a', 20, 50, 250, 100, { lines: ['public interface T {', '  public static final int K = 1;', '  public abstract void p();', '}'], mono: true, lsize: 11.5, tone: 'blue' }), T('eq', 280, 104, '=', { anchor: 'middle', size: 26, bold: true, tone: 'accent' }), B('b', 300, 50, 240, 100, { lines: ['public interface T {', '  int K = 1;', '  void p();', '}'], mono: true, lsize: 12, tone: 'teal', hi: true }), T('k', 280, 220, 'use the constant as T.K', { anchor: 'middle', mono: true, size: 14, bold: true, tone: 'accent' })];
      items.push(cls('e', 180, 24, 200, 'Edible', [{ t: '+howToEat(): String', i: true }], { tag: '«interface»', abs: true, tone: 'accent' }));
      items.push(cls('an', 400, 24, 150, 'Animal', ['-weight: double', { t: '+sound(): String', i: true }], { abs: true }));
      items.push(B('fr', 60, 170, 120, 40, { title: 'Fruit', mono: true, size: 13, italic: true, tone: ph === 'fruit' ? 'accent' : 'blue', hi: ph === 'fruit' }));
      items.push(B('ch', 230, 170, 120, 40, { title: 'Chicken', mono: true, size: 13, tone: ph === 'uml' || ph === 'run' ? 'accent' : 'blue', hi: ph === 'uml' }));
      items.push(B('ti', 420, 170, 120, 40, { title: 'Tiger', mono: true, size: 13, tone: ph === 'run' ? 'muted' : 'blue', dash: ph === 'run' }));
      items.push(B('or', 10, 270, 110, 40, { title: 'Orange', mono: true, size: 13, tone: 'blue' }), B('ap', 140, 270, 110, 40, { title: 'Apple', mono: true, size: 13, tone: ph === 'fruit' || ph === 'run' ? 'accent' : 'blue' }));
      items.push(A('i1', 120, 166, 230, 92, { tone: 'ink', dash: true }), A('i2', 290, 166, 290, 92, { tone: 'ink', dash: true }), A('e1', 310, 170, 440, 112, { tone: 'ink' }), A('e2', 480, 166, 480, 112, { tone: 'ink' }), A('f1', 65, 266, 110, 214, { tone: 'ink' }), A('f2', 195, 266, 130, 214, { tone: 'ink' }));
      items.push(T('lb', 178, 130, 'implements (dashed)', { anchor: 'middle', size: 11, tone: 'muted' }), T('lb2', 400, 130, 'extends', { anchor: 'middle', size: 11, tone: 'muted' }));
      return items;
    }
  };

  /* ---------- 2. Comparable and compareTo (slides 10-12) ---------- */
  var cmp = {
    id: 'cmp', slides: [10, 12], title: 'compareTo: negative, zero, or positive',
    inputs: [{ id: 'a', type: 'text', label: 'object1 (a String)', value: 'abc', maxlen: 12 }, { id: 'b', type: 'text', label: 'object2', value: 'abe', maxlen: 12 }],
    presets: [{ label: '"abc" vs "abe" (slide)', values: { a: 'abc', b: 'abe' } }, { label: '"Tampa" vs "Boston"', values: { a: 'Tampa', b: 'Boston' } }, { label: 'equal', values: { a: 'Java', b: 'Java' } }],
    code: function (v) { return 'public interface Comparable<T> {\n  public int compareTo(T obj);\n}\n\n' + 'int result = "' + v.a + '".compareTo("' + v.b + '");\nSystem.out.println(result);\n\nCalendar date1 = new GregorianCalendar(2024, 0, 1);\nCalendar date2 = new GregorianCalendar(2023, 0, 1);\nSystem.out.println(date1.compareTo(date2)); // >0'; },
    steps: function (v) {
      var a = v.a, b = v.b, r = 0, m = Math.min(a.length, b.length), i;
      for (i = 0; i < m; i++) if (a.charCodeAt(i) !== b.charCodeAt(i)) { r = a.charCodeAt(i) - b.charCodeAt(i); break; }
      if (i === m) r = a.length - b.length;
      return [
        { line: '1-3', slide: 10, ph: 'iface', cap: '<code>Comparable&lt;T&gt;</code> (in java.lang) is a <b>generic</b> interface with one method: <code>public int compareTo(T obj)</code>. It compares two objects of the <b>same type</b> T.' },
        { slide: 11, line: '5-6', ph: 'str', r: r, cap: 'The result is <b>zero</b> if they are equal, <b>negative</b> if object1 is less, <b>positive</b> if it is greater. "' + h(a) + '" vs "' + h(b) + '": ' + r + '.', out: String(r) },
        { slide: 11, line: '8-10', ph: 'date', r: 1, cap: 'Calendars are comparable too: January 1, 2024 is after January 1, 2023, so the result is positive.', out: '1' },
        { line: 2, slide: 12, ph: 'impl', cap: 'String, Date, the wrapper classes, BigInteger and others <b>implement</b> Comparable, so each one provides its own compareTo: <code>public final class String implements Comparable&lt;String&gt;</code>.' }
      ];
    },
    draw: function (k, s, v) {
      var items = [];
      if (s.ph === 'iface' || s.ph === 'impl') {
        items.push(cls('c', 130, 20, 300, 'java.lang.Comparable<T>', [{ t: '+compareTo(obj: T): int', i: true }], { tag: '«interface»', abs: true, tone: 'accent' }));
        if (s.ph === 'impl') ['String', 'Date', 'Integer', 'Double', 'BigInteger'].forEach(function (n, i) { items.push(B('i' + i, 10 + i * 110, 200, 100, 40, { title: n, mono: true, size: 12, tone: 'teal' })); items.push(A('a' + i, 60 + i * 110, 196, 280, 104, { tone: 'ink', dash: true })); });
        return items;
      }
      var r = s.r;
      items.push(A('ax', 40, 160, 520, 160, { head: false, tone: 'muted' }));
      [['negative', 120, 'object1 < object2'], ['0', 280, 'equal'], ['positive', 440, 'object1 > object2']].forEach(function (z, i) {
        var on = (i === 0 && r < 0) || (i === 1 && r === 0) || (i === 2 && r > 0);
        items.push(B('z' + i, z[1] - 70, 130, 140, 60, { title: z[0], lines: [z[2]], size: 14, lsize: 11, tone: on ? 'accent' : 'muted', hi: on }));
      });
      items.push(T('res', 280, 260, s.ph === 'date' ? 'date1.compareTo(date2) > 0' : '"' + v.a + '".compareTo("' + v.b + '") = ' + r, { anchor: 'middle', mono: true, size: 14, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 3. ComparableRectangle and sorting (slides 13-17) ---------- */
  var RECTS = [[3.4, 5.4], [13.24, 55.4], [7.4, 35.4], [1.4, 25.4]];
  var CR = 'public class ComparableRectangle extends Rectangle\n    implements Comparable<ComparableRectangle> {\n  public ComparableRectangle(double width, double height) {\n    super(width, height);\n  }\n\n  public int compareTo(ComparableRectangle obj) {\n    if (getArea() > obj.getArea()) return 1;\n    else if (getArea() < obj.getArea()) return -1;\n    else return 0;\n  }\n\n  public String toString() {\n    return "Width: " + getWidth() + " Height: " + getHeight() +\n           " Area: " + getArea();\n  }\n}\n\nComparableRectangle[] rectangles = { ... four rectangles ... };\njava.util.Arrays.sort(rectangles);\nfor (Rectangle rectangle: rectangles)\n  System.out.println(rectangle);';
  var sortr = {
    id: 'sortr', slides: [13, 17], title: 'Give Rectangle a compareTo, and Arrays.sort works', code: CR,
    steps: function () {
      var rs = RECTS.map(function (r) { return { w: r[0], h: r[1], a: r[0] * r[1] }; }), sorted = rs.slice().sort(function (p, q) { return p.a - q.a; });
      return [
        { line: '1-2', slide: 13, ph: 'uml', rs: rs, cap: 'Rectangle cannot be sorted: it has no compareTo. <b>ComparableRectangle</b> extends Rectangle <b>and</b> implements <code>Comparable&lt;ComparableRectangle&gt;</code>.' },
        { slide: 14, line: '7-11', ph: 'ct', rs: rs, cap: 'Its compareTo compares the <b>areas</b>: 1 if this area is bigger, −1 if smaller, 0 if equal.' },
        { line: 20, slide: 15, ph: 'sort', rs: rs, cap: '<code>java.util.Arrays.sort(Object[] array)</code> sorts any array whose elements implement Comparable: it calls their compareTo to decide the order. (Slide 16 sorts Strings and BigIntegers the same way.)' },
        { slide: 17, line: 20, ph: 'done', rs: sorted, cap: 'After sorting, the rectangles are in increasing order of area.' },
        { slide: 17, line: '21-22', ph: 'out', rs: sorted, cap: 'println uses the overridden toString. (The second area prints as 35.559999999999995: 1.4 × 25.4 is not exact in binary.)', out: sorted.map(function (r) { return 'Width: ' + jd(r.w) + ' Height: ' + jd(r.h) + ' Area: ' + jd(r.a); }) }
      ];
    },
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'uml') return [cls('g', 20, 20, 200, 'GeometricObject', [], { abs: true }), cls('r', 20, 120, 200, 'Rectangle', []), cls('cr', 20, 230, 220, 'ComparableRectangle', [], { tone: 'accent', hi: true }), cls('c', 290, 60, 260, 'Comparable<ComparableRectangle>', [{ t: '+compareTo(o): int', i: true }], { tag: '«interface»', abs: true, size: 10.5 }), A('e1', 120, 116, 120, 64, { tone: 'ink' }), A('e2', 120, 226, 120, 164, { tone: 'ink' }), A('im', 244, 250, 420, 130, { tone: 'ink', dash: true, label: 'implements', la: 'start', lx: 10 })];
      var max = 733.496;
      s.rs.forEach(function (r, i) {
        var y = 20 + i * 70;
        items.push(B('b' + r.w, 20, y, 110 + r.a / max * 220, 50, { title: 'area ' + jd(r.a).slice(0, 7), mono: true, size: 12, tone: s.ph === 'done' || s.ph === 'out' ? 'teal' : 'blue', fill: 'soft' }));
        items.push(T('t' + r.w, 360, y + 30, jd(r.w) + ' × ' + jd(r.h), { mono: true, size: 13, tone: 'muted' }));
      });
      if (s.ph === 'ct') items.push(T('c', 280, 310, 'compareTo looks only at the area', { anchor: 'middle', size: 13, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 4. interfaces vs abstract classes (slides 19-24) ---------- */
  var vs = {
    id: 'vs', slides: [19, 24], title: 'Interface or abstract class?',
    steps: [
      { slide: 19, ph: 'tbl', cap: 'An interface has only static final constants, method signatures with no body, and no constructors. An abstract class can have any data, methods with or without bodies, and constructors. Neither can be created with new.' },
      { slide: 20, ph: 'multi', cap: 'A class can extend only <b>one</b> class (single inheritance), but it can implement <b>many</b> interfaces: <code>class NewClass extends BaseClass implements Interface1, …, InterfaceN</code>. An interface can extend many interfaces.' },
      { slide: 22, ph: 'tree', cap: 'Class1 implements Interface1 (which extends Interface1_1 and Interface1_2). Class2 extends Class1 and implements Interface2_1 and Interface2_2. An object of Class2 is also an instance of <b>all</b> of these types, and of Object.' },
      { slide: 21, ph: 'root', cap: 'All classes have one root, Object; interfaces have no root. Everything in an interface is public. An implemented interface acts like a superclass: you can use it as a type and cast to and from it.' },
      { slide: 23, ph: 'choose', cap: 'A <b>strong is-a</b> relation → a class (a GregorianCalendar <b>is a</b> Calendar). A <b>weak is-a</b> (is-kind-of) → an interface (a String is comparable). Interfaces are often preferred because unrelated classes can share them.' },
      { slide: 24, ph: 'conflict', cap: 'Rarely, two interfaces conflict: constants with the same name and different values, or methods with the same signature and different return types. The compiler reports it.' }
    ],
    draw: function (k, s) {
      var ph = s.ph, items = [];
      if (ph === 'tbl') {
        [['only static final constants', 'all types of data'], ['signatures, no bodies', 'methods with or without bodies'], ['no constructors', 'constructors'], ['extends other interfaces', 'one superclass, many interfaces']].forEach(function (r, i) {
          items.push(B('a' + i, 10, 40 + i * 70, 260, 58, { title: r[0], size: 12.5, tone: 'accent' }), B('b' + i, 290, 40 + i * 70, 260, 58, { title: r[1], size: 12.5, tone: 'blue' }));
        });
        items.push(T('h1', 140, 26, 'Interface', { anchor: 'middle', bold: true, size: 14 }), T('h2', 420, 26, 'Abstract Class', { anchor: 'middle', bold: true, size: 14 }));
        return items;
      }
      if (ph === 'multi') return [B('bc', 30, 30, 160, 44, { title: 'BaseClass', mono: true, size: 13, tone: 'blue' }), B('i1', 230, 30, 140, 44, { title: 'Interface1', mono: true, size: 12, italic: true, tone: 'accent' }), B('in', 400, 30, 140, 44, { title: 'InterfaceN', mono: true, size: 12, italic: true, tone: 'accent' }), B('nc', 200, 200, 180, 50, { title: 'NewClass', mono: true, size: 14, tone: 'teal', hi: true }), A('e', 250, 196, 110, 78, { tone: 'ink', label: 'extends: one', la: 'end' }), A('m1', 290, 196, 300, 78, { tone: 'ink', dash: true }), A('m2', 330, 196, 470, 78, { tone: 'ink', dash: true, label: 'implements: many', la: 'start', lx: 6 })];
      if (ph === 'tree' || ph === 'root') {
        var N = [['Interface1_2', 20, 20, 1], ['Interface1_1', 20, 110, 1], ['Interface1', 220, 110, 1], ['Interface2_2', 400, 20, 1], ['Interface2_1', 400, 110, 1], ['Object', 20, 240, 0], ['Class1', 220, 240, 0], ['Class2', 420, 240, 0]];
        N.forEach(function (n) { items.push(B('n' + n[0], n[1], n[2], 140, 40, { title: n[0], mono: true, size: 12, italic: !!n[3], tone: ph === 'tree' ? (n[0] === 'Class2' ? 'teal' : 'accent') : n[3] ? 'muted' : 'blue', hi: n[0] === 'Class2' })); });
        items.push(A('a1', 220, 130, 164, 40, { tone: 'ink' }), A('a2', 220, 130, 164, 130, { tone: 'ink' }), A('a3', 290, 236, 290, 154, { tone: 'ink', dash: true }), A('a4', 220, 260, 164, 260, { tone: 'ink' }), A('a5', 420, 260, 364, 260, { tone: 'ink' }), A('a6', 490, 236, 470, 64, { tone: 'ink', dash: true }), A('a7', 490, 236, 470, 154, { tone: 'ink', dash: true }));
        if (ph === 'root') items.push(T('r', 90, 310, 'one root for classes', { anchor: 'middle', size: 12, bold: true, tone: 'blue' }));
        return items;
      }
      if (ph === 'choose') return [B('s', 20, 60, 250, 120, { title: 'strong is-a → class', lines: ['GregorianCalendar is a', 'Calendar'], size: 14, lsize: 12, tone: 'blue' }), B('w', 290, 60, 250, 120, { title: 'is-kind-of → interface', lines: ['a String is comparable'], size: 14, lsize: 12, tone: 'accent', hi: true })];
      return [B('i1', 30, 60, 220, 70, { title: 'interface A', lines: ['int K = 1;'], mono: true, size: 13, lsize: 12, tone: 'blue' }), B('i2', 310, 60, 220, 70, { title: 'interface B', lines: ['int K = 2;'], mono: true, size: 13, lsize: 12, tone: 'blue' }), B('c', 170, 210, 220, 50, { title: 'class C implements A, B', mono: true, size: 12, tone: 'red', hi: true }), A('x1', 240, 206, 150, 134, { tone: 'red', dash: true }), A('x2', 320, 206, 410, 134, { tone: 'red', dash: true }), T('t', 280, 300, 'which K? → compile error', { anchor: 'middle', size: 13, bold: true, tone: 'red' })];
    }
  };

  /* ---------- 5. the Rational class (slides 26-33) ---------- */
  function gcd(n, d) { n = Math.abs(n); d = Math.abs(d); while (d !== 0) { var r = n % d; n = d; d = r; } return n; }
  function rat(n, d) { var g = gcd(n, d) || 1; return { n: (d > 0 ? 1 : -1) * n / g, d: Math.abs(d) / g }; }
  function rs(r) { return r.d === 1 ? String(r.n) : r.n + '/' + r.d; }
  function RT(v) { return 'Rational r1 = new Rational(' + I(v.a) + ', ' + I(v.b) + ');\nRational r2 = new Rational(' + I(v.c) + ', ' + I(v.d) + ');\nSystem.out.println(r1 + " + " + r2 + " = " + r1.add(r2));\nSystem.out.println(r1 + " - " + r2 + " = " + r1.subtract(r2));\nSystem.out.println(r1 + " * " + r2 + " = " + r1.multiply(r2));\nSystem.out.println(r1 + " / " + r2 + " = " + r1.divide(r2));\nSystem.out.println(r2 + " is " + r2.doubleValue());'; }
  var rational = {
    id: 'rational', slides: [26, 33], title: 'Exact fractions with Rational',
    code: function (v) { return 'public class Rational extends Number implements Comparable<Rational> {\n  private long numerator, denominator;    // always reduced, denominator > 0\n  private static long gcd(long n, long d) { … }   // Euclid (slide 29)\n  public Rational add(Rational second) { … }      // and subtract, multiply, divide\n  public int compareTo(Rational second) { … }     // the sign of this - second\n  public String toString() { … }                  // "a/b", or "a" when b is 1\n}\n\n// the test program (slide 33)\n' + RT(v); },
    inputs: [{ id: 'a', label: 'r1 numerator', value: 4, min: -50, max: 50 }, { id: 'b', label: 'r1 denominator', value: 2, min: -50, max: 50 }, { id: 'c', label: 'r2 numerator', value: 2, min: -50, max: 50 }, { id: 'd', label: 'r2 denominator', value: 3, min: -50, max: 50 }],
    presets: [{ label: '4/2 and 2/3 (slide)', values: { a: 4, b: 2, c: 2, d: 3 } }, { label: '1/2 and 1/3', values: { a: 1, b: 2, c: 1, d: 3 } }, { label: '3/-6 and 5/10', values: { a: 3, b: -6, c: 5, d: 10 } }],
    steps: function (v) {
      var b = I(v.b) || 1, d = I(v.d) || 1, r1 = rat(I(v.a), b), r2 = rat(I(v.c), d);
      var add = rat(r1.n * r2.d + r1.d * r2.n, r1.d * r2.d), sub = rat(r1.n * r2.d - r1.d * r2.n, r1.d * r2.d), mul = rat(r1.n * r2.n, r1.d * r2.d);
      var dv = r2.n === 0 ? null : rat(r1.n * r2.d, r1.d * r2.n);
      return [
        { line: 1, slide: 26, ph: 'what', cap: 'A <b>rational number</b> is a/b: numerator a, denominator b (never 0). It is <b>exact</b>, unlike a double: 1/3 stays 1/3. Rational numbers can be compared, so the class implements Comparable.' },
        { line: 1, slide: 27, ph: 'uml', cap: '<code>Rational extends Number implements Comparable&lt;Rational&gt;</code>: it is a Number (it must implement doubleValue and the others) and it is comparable.' },
        { slide: 28, line: '10-11', ph: 'ctor', r1: r1, r2: r2, cap: 'The constructor divides both parts by their <b>gcd</b> and keeps the sign in the numerator: ' + I(v.a) + '/' + b + ' becomes ' + rs(r1) + ', and ' + I(v.c) + '/' + d + ' becomes ' + rs(r2) + '. (toString shows only the numerator when the denominator is 1.)' },
        { line: 3, slide: 29, ph: 'gcd', r1: r1, r2: r2, cap: 'gcd uses Euclid’s method: repeat n1 % n2 until the remainder is 0. For example gcd(4, 2): 4 % 2 = 0, so the gcd is 2.' },
        { slide: 30, line: '12-13', ph: 'ops', r1: r1, r2: r2, cap: 'add: a/b + c/d = (a·d + b·c) / (b·d), then the constructor reduces it. subtract is the same with −.', out: [rs(r1) + ' + ' + rs(r2) + ' = ' + rs(add), rs(r1) + ' - ' + rs(r2) + ' = ' + rs(sub)] },
        { slide: 31, line: '14-15', ph: 'ops2', r1: r1, r2: r2, cap: 'multiply: (a·c) / (b·d). divide: (a·d) / (b·c).' + (dv ? '' : ' Here r2 is 0, so divide would make a denominator of 0.'), out: [rs(r1) + ' * ' + rs(r2) + ' = ' + rs(mul), dv ? rs(r1) + ' / ' + rs(r2) + ' = ' + rs(dv) : rs(r1) + ' / ' + rs(r2) + ' = (denominator 0)'] },
        { line: 5, slide: 32, ph: 'cmp', r1: r1, r2: r2, cap: 'compareTo subtracts the two and looks at the sign of the numerator: here ' + (sub.n > 0 ? '1 (r1 > r2)' : sub.n < 0 ? '−1 (r1 < r2)' : '0 (equal)') + '. equals is true when the difference is 0.' },
        { slide: 33, line: 16, ph: 'dbl', r1: r1, r2: r2, cap: 'doubleValue (from Number) gives the approximate double: numerator × 1.0 / denominator.', out: rs(r2) + ' is ' + jd(r2.n * 1.0 / r2.d) }
      ];
    },
    draw: function (k, s) {
      var ph = s.ph, items = [];
      if (ph === 'what') return [B('f', 180, 60, 200, 110, { tone: 'accent' }), T('fa', 280, 98, 'a', { anchor: 'middle', mono: true, size: 26, bold: true }), A('fl', 230, 115, 330, 115, { head: false, tone: 'ink' }), T('fb', 280, 150, 'b', { anchor: 'middle', mono: true, size: 26, bold: true }), T('n', 400, 90, '← numerator', { size: 13, tone: 'muted' }), T('d', 400, 150, '← denominator (≠ 0)', { size: 13, tone: 'muted' })];
      if (ph === 'uml') return [cls('n', 20, 20, 220, 'java.lang.Number', [], { abs: true }), cls('c', 300, 20, 250, 'Comparable<Rational>', [], { tag: '«interface»', abs: true }), cls('r', 140, 140, 280, 'Rational', ['-numerator: long', '-denominator: long', '+add, subtract, multiply, divide', '+compareTo, doubleValue, toString', { t: '-gcd(n: long, d: long): long', u: true }], { tone: 'accent', hi: true }), A('e', 220, 136, 130, 64, { tone: 'ink' }), A('i', 340, 136, 420, 64, { tone: 'ink', dash: true })];
      if (ph === 'gcd') {
        var n1 = 4, n2 = 2, rows = [];
        while (n2 !== 0) { rows.push(n1 + ' % ' + n2 + ' = ' + (n1 % n2)); var r = n1 % n2; n1 = n2; n2 = r; }
        return [B('g', 120, 60, 320, boxH(rows.length + 1), { title: 'gcd(4, 2)', band: true, mono: true, lsize: 14, lines: rows.concat(['gcd = ' + n1]), tone: 'accent' })];
      }
      items.push(B('r1', 40, 40, 200, 70, { tag: 'Rational r1', title: rs(s.r1), mono: true, size: 24, tone: 'teal' }));
      items.push(B('r2', 320, 40, 200, 70, { tag: 'Rational r2', title: rs(s.r2), mono: true, size: 24, tone: 'teal' }));
      if (ph === 'cmp') items.push(T('c', 280, 200, 'r1.compareTo(r2) uses the sign of r1 − r2', { anchor: 'middle', size: 13.5, bold: true, tone: 'accent' }));
      if (ph === 'dbl') items.push(B('dv', 180, 180, 200, 50, { tag: 'r2.doubleValue()', title: jd(s.r2.n * 1.0 / s.r2.d), mono: true, size: 14, tone: 'accent', hi: true }));
      return items;
    }
  };

  var ALL = [edible, cmp, sortr, vs, rational];
  var para = function (t) { return { type: 'paragraph', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; },
    code = function (t, lang) { return lang ? { type: 'code', text: t, lang: lang } : { type: 'code', text: t }; }, note = function (t) { return { type: 'note', text: t }; };
  function braces(c) { var o = (c.match(/\{/g) || []).length, z = (c.match(/\}/g) || []).length; return o >= 2 && o === z; }
  function tbl(head, rows) { return { type: 'html', html: '<div class="tblwrap"><table><tr>' + head.map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr>' + rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table></div>' }; }
  var OUT = ['What is an Interface?', 'Example: The Edible Interface', 'The Comparable Interface', 'Interfaces versus Abstract Classes', 'Case Study: The Rational Class'];
  function outline(title, on, ex) { return { image: false, title: title, blocks: OUT.map(function (t, i) { return { type: 'bullet', html: i === on ? '<b>' + t + '</b>' : t, level: 0 }; }), explain: ex }; }

  addUnit({
    course: 'cs2', lesson: '08-interfaces',
    blurb: 'Common behavior for unrelated classes: define and implement interfaces, use Comparable to sort objects, compare interfaces with abstract classes, and build the Rational class.',
    parts: [
      {
        title: 'What is an interface?', from: 1, to: 8,
        quiz: [
          { q: 'An interface contains…', options: ['only abstract methods and constants', 'only data fields that each object can change', 'only constructors and static methods'], answer: 0, why: 'Slide 3.' },
          { q: 'Which keyword does a class use for an interface?', options: ['interface', 'extends', 'implements'], answer: 2, why: 'class Chicken extends Animal implements Edible (slide 7).' },
          { type: 'tf', q: 'You can write <code>new Edible()</code>.', answer: false, why: 'An interface cannot be instantiated (slide 5).' },
          { type: 'output', q: 'With the classes of slide 7, what does this print?', code: 'Edible e = new Apple();\nSystem.out.println(e.howToEat());', answer: 'Apple: Make apple cider', why: 'An interface can be a variable type.' },
          { q: 'In an interface, <code>int K = 1;</code> is really…', options: ['private int K = 1;', 'public static final int K = 1;', 'a local variable of each method'], answer: 1, why: 'Slide 8.' }
        ]
      },
      {
        title: 'The Comparable interface', from: 9, to: 17,
        quiz: [
          { type: 'output', q: 'What does this print?', code: 'System.out.println("abc".compareTo("abc"));', answer: '0', why: 'Equal objects give 0 (slide 11).' },
          { q: '<code>object1.compareTo(object2)</code> is negative. This means…', options: ['object1 is less than object2', 'object1 is greater', 'they are equal'], answer: 0, why: 'Slide 11.' },
          { q: 'What must a class that implements Comparable&lt;T&gt; provide?', options: ['A constructor with no arguments', 'A sort method', 'A compareTo(T obj) method'], answer: 2, why: 'Slide 12.' },
          { type: 'output', q: 'What does this print?', code: 'String[] c = {"Savannah", "Boston", "Atlanta", "Tampa"};\njava.util.Arrays.sort(c);\nSystem.out.println(c[0] + " " + c[3]);', answer: 'Atlanta Tampa', why: 'Strings are Comparable, so Arrays.sort can sort them (slide 16).' },
          { q: 'ComparableRectangle compares rectangles by…', options: ['their width', 'their area', 'their color'], answer: 1, why: 'Slide 14.' }
        ]
      },
      {
        title: 'Interfaces versus abstract classes', from: 18, to: 24,
        quiz: [
          { q: 'How many classes can a class extend, and how many interfaces can it implement?', options: ['One of each', 'Many classes, one interface', 'One class, many interfaces'], answer: 2, why: 'Slide 20.' },
          { q: 'Which can have constructors?', options: ['An interface', 'An abstract class', 'Both'], answer: 1, why: 'Slide 19.' },
          { q: 'Class2 extends Class1, which implements Interface1. c is a Class2. Is <code>c instanceof Interface1</code> true?', options: ['Yes', 'No'], answer: 0, why: 'Slide 22.' },
          { q: 'A weak is-a (is-kind-of) relation is best modeled with…', options: ['a class', 'an interface', 'a final class'], answer: 1, why: 'Slide 23.' }
        ]
      },
      {
        title: 'The Rational class', from: 25, to: 33,
        quiz: [
          { type: 'output', q: 'With the Rational class, what does this print?', code: 'System.out.println(new Rational(6, 8));', answer: '3/4', why: 'The constructor divides by the gcd, 2.' },
          { type: 'output', q: 'And this?', code: 'Rational a = new Rational(1, 2), b = new Rational(1, 3);\nSystem.out.println(a.add(b));', answer: '5/6', why: '(1·3 + 2·1) / (2·3) = 5/6.' },
          { type: 'output', q: 'And this?', code: 'System.out.println(new Rational(4, 2));', answer: '2', why: 'When the denominator is 1, only the numerator is shown.' },
          { q: 'Why does Rational extend Number?', options: ['To be comparable with other Rational objects', 'To be used as a number, with doubleValue and the other methods', 'Because every class must extend Number'], answer: 1, why: 'Slide 27.' }
        ]
      }
    ],
    slides: {
      1: { image: false, blocks: [para('An interface is used to specify common behavior for objects.'), para('An interface is treated like a special abstract class in Java.')],
        explain: '<p>A class says what an object <b>is</b> (a Chicken is an Animal). An <b>{{interface|واجهة}}</b> says what an object <b>can do</b>: it can be eaten, it can be compared, it can be copied.</p><p>Very different classes can share one ability. A chicken and an apple are not related at all, but both can be eaten. An interface gives them a common type for that ability. Java treats an interface like a special abstract class.</p>' },
      2: outline('Outline', -1, '<p>The plan of this unit.</p>'),
      3: { image: false, title: 'What is an Interface?', blocks: [bul('An interface is a class-like construct that contains only abstract methods and constants.'), bul('In many ways, an interface is like an abstract class.'), bul('The purpose of an interface is to specify common behavior for objects.'), bul('For example, you can specify that objects are comparable, edible, cloneable using appropriate interfaces.')],
        explain: '<p>An interface is a class-like construct that holds only <b>abstract methods</b> and <b>constants</b>. Its job is to name a <b>common behavior</b>.</p><p>Interface names often end in <b>-able</b>, because they describe an {{ability|قدرة}}: <code>Comparable</code> (can be compared), <code>Edible</code> (can be eaten), <code>Cloneable</code> (can be copied).</p>' },
      4: { image: false, title: 'Defining an Interface', blocks: [bul('Java uses the interface keyword to distinguish an interface from a class. An interface has the following syntax:'), code('public interface InterfaceName {\n  constant declarations;\n  abstract method signatures;\n}', 'none'), bul('Example:'), code('public interface Edible {\n  String howToEat();  // public abstract method\n}')],
        explain: '<p>You write an interface like a class, but with the keyword <b>interface</b>:</p><pre class="ex">public interface Edible {\n  String howToEat();   // no body: a semicolon\n}</pre><p>Inside are constant declarations and method <b>signatures</b> without bodies. Any class that wants to be Edible must write the body of howToEat.</p>' },
      5: { image: false, title: 'An Interface is a Special Abstract Class', blocks: [bul('An interface is treated like a special abstract class in Java.'), bul('All the methods of an interface are abstract.'), bul('You can use an interface as a data type for a variable.'), bul('Like an abstract class, you cannot create an instance of an interface using the new operator.'), bul('Each interface is compiled into a separate bytecode file, just like a regular class.')],
        explain: '<p>An interface works like a special abstract class:</p><ul><li>All its methods are abstract.</li><li>You can use it as a <b>data type</b>: <code>Edible e = new Apple();</code></li><li>You <b>cannot</b> create an object of it: <code>new Edible()</code> is an error.</li><li>It is compiled into its own .class file: Edible.java becomes Edible.class.</li></ul>' },
      6: { image: false, title: 'Example: The Edible Interface', blocks: [code('public interface Edible {\n  // Describe how to eat\n  public abstract String howToEat();\n}')],
        explain: '<p>The UML diagram mixes inheritance and an interface:</p><ul><li>A <b>solid</b> line with a {{hollow|مفرّغ من الداخل}} triangle means <b>extends</b>: Chicken extends Animal, Apple extends Fruit.</li><li>A <b>{{dashed|متقطّع}}</b> line with a hollow triangle means <b>implements</b>: Chicken implements Edible, Fruit implements Edible.</li></ul><p>The interface is marked «interface», and its name and abstract method are in italics.</p>' },
      7: { image: false, title: 'Implementing an Interface', blocks: [bul('You can use the Edible interface to specify whether an object is edible. For example, the classes Chicken and Fruit implement the Edible interface.'), code('abstract class Animal { // Data fields and methods omitted }\n\nclass Chicken extends Animal implements Edible {\n  public String howToEat() { return "Chicken: Fry it"; }\n  public String sound() { return "Chicken sound"; }\n}\n\nabstract class Fruit implements Edible { // Data and methods }\n\nclass Apple extends Fruit {\n  public String howToEat() { return "Apple: Make apple cider"; }\n}', 'none')],
        explain: '<p>To <b>{{implement|يطبّق: يكتب جسم الدالة}}</b> an interface, a class writes <code>implements Edible</code> and gives howToEat a body:</p><ul><li>Chicken extends Animal <b>and</b> implements Edible: a class can do both at once. Its howToEat returns "Chicken: Fry it".</li><li>Fruit implements Edible but is <b>abstract</b>, so it may leave howToEat without a body. Its concrete subclass Apple must write it.</li></ul><p>The test loop asks each object <code>instanceof Edible</code>: the Tiger is not edible, so it is skipped; for the others it casts to Edible and calls howToEat.</p>' },
      8: { image: false, title: 'Omitting Modifiers in an Interface', blocks: [bul('In an interface, all data fields are public static final.'), bul('In an interface, all methods are public abstract.'), bul('These modifiers can be omitted, as shown below:'), code('public interface T {\n  public static final int K = 1;\n\n  public abstract void p();\n}'), note('Equivalent'), code('public interface T {\n  int K = 1;\n\n  void p();\n}'), bul('The constant K is accessed using the interface name as T.K')],
        explain: '<p>Inside an interface, Java adds some words for you:</p><ul><li>every data field is <code>public static final</code> (a constant);</li><li>every method is <code>public abstract</code>.</li></ul><pre class="ex">public interface T {         public interface T {\n  public static final int K = 1;    =    int K = 1;\n  public abstract void p();          void p();\n}                            }</pre><p>Use the constant with the interface name: <code>T.K</code>.</p><p class="watch">The interface methods are public, so a class that implements them must make them <b>public</b> too; leaving out public is a compile error.</p>' },
      9: outline('Next . . .', 2, '<p>Next: Comparable.</p>'),
      10: { image: false, title: 'The Comparable Interface', blocks: [bul('The generic Comparable interface defines the compareTo method for comparing two objects of the same type T.'), bul('The generic compareTo method can be used to compare two strings, two dates, two students, two circles, etc.'), code('// Interface for comparing objects in java.lang\npackage java.lang;\n\npublic interface Comparable<T> {\n  public int compareTo(T obj);\n}')],
        explain: '<p><b>Comparable</b> (in java.lang) is one of the most used interfaces. It has one method:</p><pre class="ex">public interface Comparable&lt;T&gt; {\n  public int compareTo(T obj);\n}</pre><p><code>&lt;T&gt;</code> is a generic type, like E in ArrayList&lt;E&gt;: it is the type of the objects being compared. compareTo can compare two strings, two dates, two students, two circles…</p>' },
      11: { image: false, title: 'Comparing Objects of the same Type', blocks: [bul('The compareTo method compares objects of the same type.'), code('int result = object1.compareTo(object2);', 'none'), para('The result is zero if object1 and object2 are equal. The result is negative if object1 is less than object2. The result is positive if object1 is greater than object2.'), bul('Examples:'), code('System.out.println("abc".compareTo("abe")); // <0\nCalendar date1 = new GregorianCalendar(2024, 0, 1);\nCalendar date2 = new GregorianCalendar(2023, 0, 1);\nSystem.out.println(date1.compareTo(date2)); // >0')],
        explain: '<p><code>object1.compareTo(object2)</code> returns an int whose <b>sign</b> is the answer:</p><ul><li><b>negative</b>: object1 is less than object2</li><li><b>zero</b>: they are equal</li><li><b>positive</b>: object1 is greater</li></ul><p><code>"abc".compareTo("abe")</code> is negative, because c comes before e. A date in 2024 compared with one in 2023 is positive. Only the sign matters, not the exact number.</p>' },
      12: { image: false, title: 'Implementing the Comparable Interface', blocks: [bul('Any class that implements the Comparable interface must provide an implementation of the compareTo method.'), code('public final class String implements Comparable<String> {\n  // class body omitted\n  public int compareTo(String obj) {\n    // Implementation omitted\n  }\n}'), code('public class Date implements Comparable<Date> {\n  // class body omitted\n  public int compareTo(Date obj) {\n    // Implementation omitted\n  }\n}')],
        explain: '<p>A class that implements Comparable must write compareTo for its own type:</p><pre class="ex">public final class String implements Comparable&lt;String&gt; {\n  public int compareTo(String obj) { … }\n}</pre><p>That is why String.compareTo, which you used in CS I, exists: String implements Comparable. Date, the wrapper classes and BigInteger do the same.</p>' },
      13: { image: false, title: 'Defining a Comparable Rectangle Class', blocks: [bul('The Rectangle class is not comparable because it does not implement the compareTo method.'), bul('The ComparableRectangle class extends Rectangle and implements the Comparable interface.')],
        explain: '<p>The Rectangle class has no compareTo, so two rectangles cannot be compared, and an array of them cannot be sorted.</p><p>The fix: a new class <b>ComparableRectangle</b> that <b>extends Rectangle</b> (it keeps everything a rectangle has) and <b>implements Comparable&lt;ComparableRectangle&gt;</b> (it adds the ability to be compared). One class can extend one class and implement an interface at the same time.</p>' },
      14: { image: false, title: 'The Comparable Rectangle Class', blocks: [code(CR.split('\n\nComparableRectangle[]')[0])], explain: '<p>ComparableRectangle compares two rectangles by their <b>area</b>:</p><pre class="ex">if (getArea() &gt; obj.getArea()) return 1;\nelse if (getArea() &lt; obj.getArea()) return -1;\nelse return 0;</pre><p>The constructor reuses Rectangle’s constructor with <code>super(width, height)</code>, and toString shows the width, the height and the area.</p><p>A 2 × 6 rectangle and a 3 × 4 rectangle both have area 12, so compareTo returns 0: equal by area.</p>' },
      15: { image: false, title: 'Sorting Arrays of Objects', blocks: [bul('The Arrays.sort(Object[] array) method in the java.util package can sort an array of objects.'), bul('The Array.sort method uses the compareTo method to compare and sort the array elements.'), bul('Any class that implements the Comparable interface and the compareTo method can use the Array.sort method.')],
        explain: '<p><code>java.util.Arrays.sort(array)</code> can sort an array of <b>any</b> objects, as long as they implement Comparable. It does not know what rectangles, strings or numbers are; it only calls <code>compareTo</code> to decide which comes first.</p><p>This is the {{power|قوة}} of an interface: sort is written once, and it works for every class that has the compareTo ability.</p>' },
      16: { image: false, title: 'Sorting Comparable Objects', blocks: [code('import java.math.*;\n\npublic class SortComparableObjects {\n  public static void main(String[] args) {\n    String[] cities = {"Savannah", "Boston", "Atlanta", "Tampa"};\n    java.util.Arrays.sort(cities);\n    for (String city: cities) System.out.print(city + " ");\n    System.out.println();\n\n    BigInteger[] hugeNumbers = {\n       new BigInteger("2323231092923992"),\n       new BigInteger("432232323239292"),\n       new BigInteger("54623239292")\n    };\n    java.util.Arrays.sort(hugeNumbers);\n    for (BigInteger number: hugeNumbers)\n      System.out.print(number + " ");\n  }\n}')],
        explain: '<p>Arrays.sort works on Strings and BigIntegers because both implement Comparable:</p><pre class="ex">{"Savannah", "Boston", "Atlanta", "Tampa"}\n→ Atlanta Boston Savannah Tampa</pre><p>The BigIntegers are sorted from small to big: 54623239292, then 432232323239292, then 2323231092923992.</p><p><code>for (String city: cities)</code> is a <b>{{for-each loop|حلقة لكل عنصر}}</b>: it visits each element in turn, with no index.</p>' },
      17: { image: false, title: 'Sorting Rectangles', blocks: [code('public class SortRectangles {\n  public static void main(String[] args) {\n    ComparableRectangle[] rectangles = {\n      new ComparableRectangle(3.4, 5.4),\n      new ComparableRectangle(13.24, 55.4),\n      new ComparableRectangle(7.4, 35.4),\n      new ComparableRectangle(1.4, 25.4)\n    };\n    java.util.Arrays.sort(rectangles);  // Sort rectangles\n    for (Rectangle rectangle: rectangles) {\n      System.out.println(rectangle);\n    }\n  }\n}')],
        explain: '<p>Now four ComparableRectangle objects can be sorted. Arrays.sort calls compareTo, so they come out ordered by <b>area</b>, from the smallest to the largest.</p><p>The loop variable has the type Rectangle, yet println uses ComparableRectangle’s toString: the object decides (dynamic binding, unit 4).</p>' },
      18: outline('Next . . .', 3, '<p>Next: interfaces vs abstract classes.</p>'),
      19: { image: false, title: 'Interfaces versus Abstract Classes', blocks: [tbl(['Interface', 'Abstract Class'], [['Can have only static final constants', 'Can have all types of data'], ['Can only define method signatures with no implementation', 'Can define methods with or without implementation'], ['No constructors', 'Can have constructors'], ['An interface can extend other interfaces, but not classes', 'A class can extend its superclass and implement multiple interfaces']]), bul('Both an interface and an abstract class cannot be instantiated using the new operator.')],
        explain: '<p>Interfaces and abstract classes are similar, but not the same:</p><ul><li><b>Data</b>: an interface has only static final constants; an abstract class can have any fields.</li><li><b>Methods</b>: an interface has only method signatures; an abstract class can have methods with or without bodies.</li><li><b>Constructors</b>: an interface has none; an abstract class can have them.</li></ul><p>Neither can be created with new. (Newer Java versions allow some method bodies in interfaces, but this course follows the slides.)</p>' },
      20: { image: false, title: 'Single versus Multiple Inheritance', blocks: [bul('Java allows only single inheritance for class extension'), bul('However, a class can implement multiple interfaces'), code('public class NewClass extends BaseClass implements\n             Interface1, ... , InterfaceN\n{ . . . }', 'none'), bul('An interface can extend and inherit multiple interfaces'), code('public interface NewInterface extends\n                 Interface1, ... , InterfaceN\n{ // constant and abstract methods }', 'none')],
        explain: '<p>A class can <b>extend only one</b> class ({{single inheritance|وراثة مفردة}}), but it can <b>implement many</b> interfaces:</p><pre class="ex">public class NewClass extends BaseClass\n    implements Interface1, Interface2, Interface3 { … }</pre><p>An interface can even extend <b>several</b> other interfaces: <code>public interface NewInterface extends Interface1, Interface2</code>. So interfaces give Java a kind of {{multiple|متعدد}} inheritance.</p>' },
      21: { image: false, title: 'Interfaces versus Abstract Classes', blocks: [bul('All classes share a single root, which is the Object class.'), para('However, there is no root for interfaces.'), bul('All the data and methods of an interface are public.'), para('However, there is no restriction for abstract classes.'), bul('If a class implements an interface, then the interface becomes like a superclass for the class.'), bul('You can use an interface as a data type and cast a variable of an interface type to its subclass, and vice versa.')],
        explain: '<p>More differences:</p><ul><li>All classes share one root, Object. Interfaces have <b>no root</b>.</li><li>Everything in an interface is public; an abstract class can use any modifier.</li></ul><p>When a class implements an interface, the interface becomes like a superclass for it. You can use the interface as a variable type, test with instanceof, and cast in both directions, just as with classes:</p><pre class="ex">Edible e = new Chicken();     // upcast: automatic\nChicken c = (Chicken) e;      // downcast: needs the cast</pre>' },
      22: { image: false, title: 'Example of Classes and Interfaces', blocks: [para('Class1 implements Interface1, which extends Interface1_1 and Interface1_2. Class2 extends Class1 and implements Interface2_1 and Interface2_2.'), para('Suppose that c is an instance of Class2, then c is also an instance of Object, Class1, Interface1, Interface1_1, Interface1_2, Interface2_1, and Interface2_2.')],
        explain: '<p>One object can have <b>many types</b> at once. If c is a Class2 object, then c is an {{instance|كائن من الكلاس}} of:</p><ul><li>its class, Class2, and the superclass Class1, and Object;</li><li>every interface that these classes implement: Interface2_1 and Interface2_2 (from Class2), Interface1 (from Class1), and Interface1_1 and Interface1_2 (because Interface1 extends them).</li></ul><p>So <code>c instanceof Interface1_2</code> is true, even though Class2 never names it.</p>' },
      23: { image: false, title: 'Whether to use an Interface or Class', blocks: [bul('Abstract classes and interfaces can both be used to specify common behavior. When to use an interface or abstract class?'), bul('In general, a strong is-a relationship should be modeled using classes. For example, a Gregorian calendar is a Calendar.'), bul('A weak is-a relationship, also known as is-kind-of relationship, can be modeled using interfaces. All strings are comparable, so the String class implements the Comparable interface.'), bul('In general, interfaces are preferred over abstract classes because an interface can define a common supertype for unrelated classes.')],
        explain: '<p>When should you use a class, and when an interface?</p><ul><li>A <b>strong is-a</b> relationship → a class (extends). A GregorianCalendar <b>is a</b> Calendar.</li><li>A <b>weak is-a</b>, also called <b>is-kind-of</b> (an ability) → an interface. All strings are comparable, so String implements Comparable.</li></ul><p>Interfaces are often preferred, because they can give a common type to <b>{{unrelated|غير مرتبطة ببعض}}</b> classes: Chicken and Apple share nothing, but both are Edible.</p>' },
      24: { image: false, title: 'Caution: Conflicting Interfaces', blocks: [bul('In rare occasions, a class may implement two interfaces with conflicting constant names or methods.'), bul('Two named constants are conflicting if they have the same name but different values.'), bul('Two methods are conflicting if they have the same signature but different return type.'), bul('These type of errors will be detected by the compiler.')],
        explain: '<p>A rare problem: a class implements two interfaces that {{clash|تتعارض}}.</p><ul><li>Two constants clash if they have the same name but different values.</li><li>Two methods clash if they have the same signature but different return types.</li></ul><p>The <b>compiler</b> finds such conflicts, so the program does not compile; you will not meet them at run time.</p>' },
      25: outline('Next . . .', 4, '<p>Next: the Rational class.</p>'),
      26: { image: false, title: 'Case Study: The Rational Class', blocks: [bul('A rational number has the form a/b, where a is the numerator and b is the denominator.'), bul('Rational numbers are used to compute exact fractions.'), bul('For example, 1/3, 2/7, and 10/3 are rational numbers.'), bul('A rational number cannot have a denominator of 0.'), bul('An integer i is equivalent to a rational number i/1.'), bul('Since rational numbers are comparable, the Rational class should implement the Comparable interface.')],
        explain: '<p>A case study that uses Comparable. A <b>rational number</b> is a fraction a/b: <b>a</b> is the {{numerator|البسط}} (on top) and <b>b</b> the {{denominator|المقام}} (below), and b can never be 0.</p><p>A double cannot hold 1/3 exactly (0.3333…), but a fraction can: rationals give <b>exact</b> results. An integer i is the rational i/1.</p><p>Fractions can be compared (1/2 &gt; 1/3), so the Rational class implements Comparable.</p>' },
      27: { image: false, title: 'The Rational Class UML Diagram', blocks: [para('Rational extends java.lang.Number and implements java.lang.Comparable<Rational>.')],
        explain: '<p>The UML diagram: Rational <b>extends Number</b> and <b>implements Comparable&lt;Rational&gt;</b>.</p><ul><li>Because it is a Number, it must implement Number’s abstract methods: intValue, longValue, floatValue, doubleValue (unit 7).</li><li>Because it is Comparable, it must implement compareTo.</li></ul><p>gcd is private and static (underlined): a helper that only the class itself uses.</p>' },
      28: { image: false, title: 'The Rational Class', blocks: [code('public class Rational extends Number implements Comparable<Rational> {\n  private long numerator;\n  private long denominator;\n\n  public Rational() {\n    this(0, 1);\n  }\n\n  public Rational(long numerator, long denominator) {\n    long gcd = gcd(numerator, denominator);\n    this.numerator = (denominator>0 ? 1 : -1) * numerator / gcd;\n    this.denominator = Math.abs(denominator) / gcd;\n  }\n\n  public long getNumerator() { return numerator; }\n  public long getDenominator() { return denominator; }')],
        explain: '<p>The constructor always stores the {{fraction|كسر}} <b>{{reduced|مختصر، مبسّط}}</b> (in lowest terms) with a <b>positive denominator</b>:</p><pre class="ex">new Rational(6, 8)    // stored as 3/4\nnew Rational(2, -4)   // stored as -1/2\nnew Rational(4, 2)    // stored as 2/1</pre><p>It divides both parts by their greatest common divisor, and <code>(denominator > 0 ? 1 : -1)</code> moves a minus sign up to the numerator. The no-arg constructor makes 0/1.</p>' },
      29: { image: false, title: 'Greatest Common Divisor', blocks: [code('  // Computes and returns the greatest common divisor of n and d\n  private static long gcd(long n, long d) {\n    long n1 = Math.abs(n);\n    long n2 = Math.abs(d);\n\n    while (n2 != 0) {\n      long rem = n1 % n2;\n      n1 = n2;\n      n2 = rem;\n    }\n    return n1;\n  }\n\n  // Implement the abstract doubleValue method in Number\n  public double doubleValue() {\n    return numerator * 1.0 / denominator;\n  }')],
        explain: '<p>gcd uses <b>Euclid’s method</b>: replace the pair (n1, n2) by (n2, n1 % n2) until n2 is 0; then n1 is the gcd.</p><pre class="ex">gcd(48, 18): (48, 18) → (18, 12) → (12, 6) → (6, 0) → 6</pre><p>This is much faster than trying every k, as in CS I unit 6.</p><p>doubleValue gives the approximate decimal value: <code>numerator * 1.0 / denominator</code> (the 1.0 avoids integer division).</p>' },
      30: { image: false, title: 'Arithmetic Operations', blocks: [code('  // Add this rational to a second rational number\n  public Rational add(Rational second) {\n    long n = numerator * second.denominator\n             + denominator * second.numerator;\n    long d = denominator * second.denominator;\n    return new Rational(n, d);\n  }\n\n  // Subtract a second rational number from this rational\n  public Rational subtract(Rational second) {\n    long n = numerator * second.denominator\n             - denominator * second.numerator;\n    long d = denominator * second.denominator;\n    return new Rational(n, d);\n  }')],
        explain: '<p>add and subtract use school math:</p><pre class="ex">a/b + c/d = (a·d + b·c) / (b·d)\na/b − c/d = (a·d − b·c) / (b·d)</pre><p>Each method returns a <b>new</b> Rational; the constructor reduces it. The objects themselves never change, so Rational is <b>{{immutable|لا يتغيّر بعد إنشائه}}</b>, like String and BigInteger. Example: 1/2 + 1/3 = (3 + 2)/6 = 5/6.</p>' },
      31: { image: false, title: 'Arithmetic Operations – cont\'d', blocks: [code('  // Multiply this rational by a second rational number\n  public Rational multiply(Rational second) {\n    long n = numerator * second.numerator;\n    long d = denominator * second.denominator;\n    return new Rational(n, d);\n  }\n\n  // Divide this rational by a second rational number\n  public Rational divide(Rational second) {\n    long n = numerator * second.denominator;\n    long d = denominator * second.numerator;\n    return new Rational(n, d);\n  }')],
        explain: '<p>multiply and divide:</p><pre class="ex">a/b × c/d = (a·c) / (b·d)\na/b ÷ c/d = (a·d) / (b·c)</pre><p>Dividing by a fraction is multiplying by its reverse. Example: 1/2 ÷ 1/4 = (1·4)/(2·1) = 4/2, stored as 2.</p>' },
      32: { image: false, title: 'Comparing Rational Numbers', blocks: [code('  // Implement the compareTo method in Comparable\n  public int compareTo(Rational second) {\n    if (this.subtract(second).numerator > 0) return 1;\n    else if (this.subtract(second).numerator < 0) return -1;\n    else return 0;\n  }\n\n  // Compares the equality of two rational numbers\n  public boolean equals(Rational second) {\n    return (this.subtract(second).numerator == 0);\n  }\n\n  public String toString() {  // Override the toString method\n    if (denominator == 1) return numerator + "";\n    else return numerator + "/" + denominator;\n  }')],
        explain: '<p>compareTo subtracts the two fractions and looks at the <b>sign of the numerator</b> (the denominator is always positive): positive → 1, negative → -1, zero → 0.</p><p>equals is true when the difference is 0, so 2/4 equals 1/2.</p><p>toString prints just the numerator when the denominator is 1 (so 4/2 prints as 2), and “a/b” otherwise.</p><p class="watch"><code>equals(Rational second)</code> has a Rational parameter, so it <b>overloads</b> Object’s equals(Object) instead of overriding it (unit 4).</p>' },
      33: { image: false, title: 'Testing the Rational Class', blocks: [code(RT({ a: 4, b: 2, c: 2, d: 3 }))],
        explain: '<p>The test with r1 = 4/2 (stored as 2) and r2 = 2/3:</p><pre class="ex">2 + 2/3 = 8/3\n2 - 2/3 = 4/3\n2 * 2/3 = 4/3\n2 / 2/3 = 3\n2/3 is 0.6666666666666666</pre><p>Try other fractions with the example buttons in the drawing, including a negative denominator.</p>' }
    },
    visuals: ALL,
    exam: {
      questions: [
        { q: 'Which line defines an interface?', options: ['public abstract interface class Flyable', 'public class Flyable { void fly(); }', 'public interface Flyable { void fly(); }'], answer: 2, review: 4, why: 'The keyword interface.' },
        { q: 'A class implements an interface but does not implement all its methods. Then the class must be…', options: ['abstract', 'final', 'static'], answer: 0, review: 7, why: 'Like Fruit in slide 7.' },
        { q: 'In an interface, the method <code>void p();</code> is…', options: ['static', 'private', 'public abstract'], answer: 2, review: 8, why: 'Slide 8.' },
        { type: 'output', q: 'What does this print?', code: 'Integer a = 5, b = 9;\nSystem.out.println(a.compareTo(b) < 0);', answer: 'true', review: 11, why: '5 is less than 9.' },
        { q: 'What does Arrays.sort need from the objects it sorts?', options: ['They are Strings', 'They implement Comparable', 'They have a sort method'], answer: 1, review: 15, why: 'It uses compareTo.' },
        { type: 'output', q: 'With ComparableRectangle, what does this print?', code: 'ComparableRectangle a = new ComparableRectangle(2, 6);\nComparableRectangle b = new ComparableRectangle(3, 4);\nSystem.out.println(a.compareTo(b));', answer: '0', review: 14, why: 'Both areas are 12.' },
        { q: 'Which is true?', options: ['A class can implement several interfaces', 'A class can extend several classes', 'An interface can extend a class'], answer: 0, review: 20, why: 'Slides 19-20.' },
        { q: 'Which has no single root?', options: ['Classes', 'Interfaces', 'Both have Object'], answer: 1, review: 21, why: 'Slide 21.' },
        { type: 'output', q: 'With the Rational class, what does this print?', code: 'Rational r = new Rational(2, -4);\nSystem.out.println(r);', answer: '-1/2', review: 28, why: 'Reduced by gcd 2, and the sign moves to the numerator.' },
        { type: 'output', q: 'And this?', code: 'Rational a = new Rational(1, 2), b = new Rational(3, 4);\nSystem.out.println(a.multiply(b) + " " + a.compareTo(b));', answer: '3/8 -1', review: 32, why: '1·3 / 2·4; 1/2 is less than 3/4.' },
        { type: 'fill', q: 'Duck extends Animal and has two abilities. Complete the header.', code: 'class Duck extends Animal ___ Edible, Comparable<Duck> {', answer: ['implements'], review: 20, why: 'One class after extends; any number of interfaces after implements, separated by commas.' },
        { type: 'fill', q: 'Complete the class so that books can be sorted with Arrays.sort.', code: 'public class Book implements ___<Book> {\n  public int ___(Book other) { … }\n}', answer: ['Comparable', 'compareTo'], review: 12, why: 'Arrays.sort calls compareTo, which a class gets by implementing Comparable.' },
        { type: 'write', q: 'Write an interface Playable with a constant MAX_PLAYERS equal to 4 and a method play() that returns nothing.', rows: 4, checks: [{ re: /interface\s+Playable\s*\{/, label: 'public interface Playable {' }, { re: /(public\s+)?(static\s+)?(final\s+)?int\s+MAX_PLAYERS\s*=\s*4\s*;/, label: 'int MAX_PLAYERS = 4;' }, { re: /void\s+play\s*\(\s*\)\s*;/, label: 'void play();' }], solution: 'public interface Playable {\n  int MAX_PLAYERS = 4;\n  void play();\n}', review: 8, why: 'The field is public static final and the method public abstract, even without these words.' },
        { type: 'write', q: 'Student has an int field age and implements Comparable<Student>. Write compareTo so students are compared by age (return 1, -1 or 0).', rows: 5, checks: [{ re: /public\s+int\s+compareTo\s*\(\s*Student\s+(\w+)\s*\)/, label: 'public int compareTo(Student other)' }, { re: /age\s*>\s*\w+\s*\.\s*age\s*\)\s*return\s+1\s*;/, label: 'if (age > other.age) return 1;' }, { re: /age\s*<\s*\w+\s*\.\s*age\s*\)\s*return\s+-\s*1\s*;/, label: 'else if (age < other.age) return -1;' }, { re: /return\s+0\s*;/, label: 'else return 0;' }], solution: 'public int compareTo(Student other) {\n  if (age > other.age) return 1;\n  else if (age < other.age) return -1;\n  else return 0;\n}', review: 14, why: 'The same shape as ComparableRectangle.compareTo, with age instead of the area.' },
        { type: 'trace', q: 'With the Rational class, what does each line print?', cols: ['expression', 'printed'], rows: [['new Rational(1, 2).add(new Rational(1, 4))', '?3/4'], ['new Rational(3, 4).multiply(new Rational(2, 3))', '?1/2'], ['new Rational(1, 2).divide(new Rational(3, 4))', '?2/3'], ['new Rational(9, 3)', '?3']], review: 31, why: 'add: (1·4 + 2·1)/8 = 6/8 = 3/4. multiply: 6/12 = 1/2. divide: (1·4)/(2·3) = 4/6 = 2/3. 9/3 is reduced to 3/1 and printed as 3.' },
        { type: 'bug', q: 'This does not compile. Tap the line the compiler complains about.', code: 'interface Movable {\n  void move();\n}\nclass Car implements Movable {\n  public void stop() { }\n}', answer: 4, review: 7, why: 'Car is concrete but does not implement move(). It must write move(), or be declared abstract.' },
        { type: 'output', q: 'What does this print?', code: 'class A implements Comparable<A> {\n  public int compareTo(A o) { return 0; }\n}\n// in main:\nObject x = new A();\nSystem.out.println((x instanceof Comparable) + " " + (x instanceof A));', answer: 'true true', review: 22, why: 'The object is an A, and A implements Comparable, so it is an instance of both.' }
      ],
      tasks: [
        {
          title: 'Define and implement an interface',
          task: '<p>Write <code>interface Speaker</code> with the method <code>String speak();</code>, and a class <code>Dog implements Speaker</code> whose speak() returns <code>"Woof"</code>.</p>',
          starter: '\n',
          output: 'Speaker s = new Dog(); s.speak() returns "Woof"',
          checks: [
            { re: /interface\s+Speaker\s*\{\s*(public\s+)?(abstract\s+)?String\s+speak\s*\(\s*\)\s*;\s*\}/, label: '<code>interface Speaker { String speak(); }</code>', review: 4 },
            { re: /class\s+Dog\s+implements\s+Speaker/, label: '<code>class Dog implements Speaker</code>', review: 7 },
            { re: /public\s+String\s+speak\s*\(\s*\)\s*\{\s*return\s+"Woof"\s*;/, label: 'A <b>public</b> speak() that returns "Woof"', review: 8 }
          ],
          solution: 'interface Speaker {\n  String speak();\n}\n\nclass Dog implements Speaker {\n  public String speak() {\n    return "Woof";\n  }\n}'
        },
        {
          title: 'A Comparable class',
          task: '<p>Write <code>class Student implements Comparable&lt;Student&gt;</code> with a private int <code>grade</code>, a constructor <code>Student(int grade)</code>, and <code>compareTo(Student other)</code> that returns 1, −1 or 0 by comparing grades (like slide 14).</p>',
          starter: '\n',
          output: 'new Student(90).compareTo(new Student(80)) returns 1',
          checks: [
            { re: /class\s+Student\s+implements\s+Comparable\s*<\s*Student\s*>/, label: '<code>implements Comparable&lt;Student&gt;</code>', review: 12 },
            { re: /public\s+int\s+compareTo\s*\(\s*Student\s+\w+\s*\)/, label: '<code>public int compareTo(Student other)</code>', review: 12 },
            { re: /return\s+1\s*;[\s\S]*return\s+-1\s*;[\s\S]*return\s+0\s*;|return\s+-1\s*;[\s\S]*return\s+1\s*;[\s\S]*return\s+0\s*;/, label: 'Returns 1, −1 and 0', review: 14 },
            { re: /grade\s*[<>]\s*\w+\.grade|\w+\.grade\s*[<>]\s*grade/, label: 'Compares the grades', review: 14 }
          ],
          solution: 'class Student implements Comparable<Student> {\n  private int grade;\n\n  public Student(int grade) {\n    this.grade = grade;\n  }\n\n  public int compareTo(Student other) {\n    if (grade > other.grade) return 1;\n    else if (grade < other.grade) return -1;\n    else return 0;\n  }\n}'
        }
      ]
    }
  });
})();
