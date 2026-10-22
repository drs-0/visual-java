/* CS2 · Unit 2 · Objects and Classes (66 slides): objects, state and behavior, classes and UML, constructors, reference
   variables and the dot operator, primitive vs reference variables, garbage, default values, Date, Random, Point2D,
   static members, visibility modifiers and encapsulation, passing objects, arrays of objects, immutability, scope and this */
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
  /* %f with 6 digits, rounded half up on the shortest decimal form (like Java) */
  function plain(a) { var m = a.toExponential().split('e'), d = m[0].replace('.', ''), e = +m[1]; if (e >= 0) return d.length > e + 1 ? d.slice(0, e + 1) + '.' + d.slice(e + 1) : d + new Array(e + 2 - d.length).join('0'); return '0.' + new Array(-e).join('0') + d; }
  function jfix(x, p) {
    var neg = x < 0, s = plain(Math.abs(x)), parts = s.split('.'), ip = parts[0], fp = parts[1] || '';
    if (fp.length <= p) return (neg ? '-' : '') + ip + '.' + fp + new Array(p - fp.length + 1).join('0');
    var all = (BigInt(ip + fp.slice(0, p)) + (+fp[p] >= 5 ? 1n : 0n)).toString();
    while (all.length < p + 1) all = '0' + all;
    return (neg ? '-' : '') + all.slice(0, all.length - p) + '.' + all.slice(all.length - p);
  }
  function padR(t, w) { t = String(t); while (t.length < w) t += ' '; return t; }
  function I(x) { return Math.trunc(x); }
  function tf(b) { return b ? 'true' : 'false'; }
  function vbox(id, x, y, w, name, type, value, o) {
    return B(id, x, y, w, 48, mix({ tag: type + ' ' + name, title: value == null ? 'no value' : String(value), mono: true, size: 15, tone: value == null ? 'muted' : 'teal', dash: value == null, r: 6 }, o || {}));
  }
  function hot(o) { return mix(o || {}, { tone: 'accent', hi: true }); }
  /* an object drawn in UML style: "name: Class" over its fields */
  function obj(id, x, y, w, name, fields, o) {
    o = o || {};
    return B(id, x, y, w, boxH(fields.length), mix({ title: name, band: true, mono: true, size: 12.5, lsize: 12.5, lines: fields.map(function (f) { return typeof f === 'string' ? { t: f } : f; }), tone: o.tone || 'teal', hi: !!o.hi }, o.extra || {}));
  }
  function ref(id, x, y, name, o) { return B(id, x, y, 120, 44, mix({ tag: name, title: 'reference', size: 12, tone: 'blue' }, o || {})); }
  function area(r) { return r * r * Math.PI; }

  /* ---------- 1. a window full of objects (slide 1) ---------- */
  var GUI = [['OK', 'Button'], ['Cancel', 'Button'], ['Enter Your Name:', 'Label'], ['Type Name Here', 'TextField'], ['☑ Bold', 'CheckBox'], ['☑ Italic', 'CheckBox'], ['◉ Red', 'RadioButton'], ['○ Yellow', 'RadioButton'], ['Freshman ▾', 'ComboBox']];
  var gui = {
    id: 'gui', slides: [1, 1], title: 'Every part of a window is an object',
    steps: [
      { k: -1, cap: 'With selections, loops, methods and arrays alone, a window like this would be very hard to program.' },
      { k: 0, cap: 'With objects it is natural: each button, label, text field and check box is an <b>object</b>. It has its own data (its text, checked or not) and its own actions (being clicked).' },
      { k: 1, cap: 'Objects of the same kind come from the same <b>class</b>: OK and Cancel are two objects of the class Button.' }
    ],
    draw: function (k, s) {
      var items = [B('win', 20, 60, 520, 140, { tag: 'Show GUI', fill: 'none', tone: 'blue', z: 0 })];
      var x = 30, row = 0;
      GUI.forEach(function (g, i) {
        var w = 18 + g[0].length * 7.4;
        if (x + w > 530) { x = 30; row++; }
        var on = (s.k === 0) || (s.k === 1 && g[1] === 'Button');
        items.push(B('g' + i, Math.round(x), 80 + row * 60, Math.round(w), 36, { title: g[0], size: 12, tone: on ? 'accent' : 'muted', hi: on }));
        if (s.k >= 0 && on) items.push(T('gl' + i, Math.round(x + w / 2), 130 + row * 60, g[1], { anchor: 'middle', size: 10, tone: 'accent', mono: true }));
        x += w + 8;
      });
      return items;
    }
  };

  /* ---------- 2. objects have state and behavior (slides 3-5) ---------- */
  var oop = {
    id: 'oop', slides: [3, 5], title: 'One class, many objects',
    steps: [
      { slide: 3, ph: 'obj', cap: 'An <b>object</b> represents a thing of the real world: a student, a desk, a circle, a button, a loan. It has a unique <b>identity</b>, a <b>state</b> and <b>behaviors</b>.' },
      { slide: 3, ph: 'state', cap: 'The <b>state</b> is the set of <b>data fields</b> (properties) with their current values. For a circle: its radius.' },
      { slide: 3, ph: 'beh', cap: 'The <b>behavior</b> is defined by <b>methods</b>: what the object can do, like getArea.' },
      { slide: 4, ph: 'class', cap: 'A <b>class</b> is a template. It says which data fields and methods every Circle has, but not the values.' },
      { slide: 4, ph: 'three', cap: 'Three objects of the Circle class: each has its <b>own</b> radius: 1, 25 and 125.' },
      { slide: 5, ph: 'ctor', cap: 'In Java, a class uses <b>variables</b> for data fields, <b>methods</b> for behaviors, and special methods called <b>constructors</b> to create objects.' }
    ],
    draw: function (k, s) {
      var ph = s.ph, items = [];
      items.push(B('cls', 170, 16, 220, boxH(5), { title: 'Class Name: Circle', band: true, lsize: 12.5, mono: true, lines: [{ t: 'Data Fields: radius is ___', b: ph === 'state', tone: ph === 'state' ? 'accent' : undefined }, { t: 'Methods:', b: ph === 'beh' }, { t: '  getArea', tone: ph === 'beh' ? 'accent' : undefined }, { t: '  getPerimeter', tone: ph === 'beh' ? 'accent' : undefined }, { t: ph === 'ctor' ? 'Constructors: Circle(...)' : '  setRadius', tone: ph === 'ctor' ? 'accent' : ph === 'beh' ? 'accent' : undefined, b: ph === 'ctor' }], tone: ph === 'class' || ph === 'ctor' ? 'accent' : 'blue', hi: ph === 'class' || ph === 'ctor' }));
      [1, 25, 125].forEach(function (r, i) {
        var show = ph === 'three' || ph === 'obj' || ph === 'state' || ph === 'beh';
        if (!show) return;
        items.push(obj('o' + i, 20 + i * 182, 220, 170, 'Circle Object ' + (i + 1), [{ t: 'radius is ' + r, b: ph === 'state', tone: ph === 'state' ? 'accent' : undefined }], { tone: ph === 'three' ? 'accent' : 'teal', hi: ph === 'obj' && i === 0 }));
        if (ph === 'three') items.push(A('ia' + i, 280, 168, 105 + i * 182, 216, { tone: 'muted', dash: true }));
      });
      return items;
    }
  };

  /* ---------- 3. the Circle class and its UML diagram (slides 6-7) ---------- */
  var CIRC = 'class Circle {\n  /** The radius of this circle */\n  double radius = 1;\n\n  /** Construct a circle object */\n  Circle() {\n  }\n\n  /** Construct a circle object */\n  Circle(double newRadius) {\n    radius = newRadius;\n  }\n\n  /** Return the area of this circle */\n  double getArea() {\n    return radius * radius * Math.PI;\n  }\n\n  /** Return the perimeter of this circle */\n  double getPerimeter() {\n    return 2 * radius * Math.PI;\n  }\n\n  /** Set a new radius for this circle */\n  void setRadius(double newRadius) {\n    radius = newRadius;\n  }\n}';
  var circlecls = {
    id: 'circlecls', slides: [6, 7], title: 'From code to a UML class diagram', code: CIRC,
    steps: [
      { slide: 6, line: 3, ph: 'f', cap: '<code>double radius = 1;</code> is a <b>data field</b>. Every Circle object gets its own radius, 1 at the start.' },
      { slide: 6, line: '6-12', ph: 'c', cap: 'Two <b>constructors</b>: <code>Circle()</code> keeps radius 1; <code>Circle(double newRadius)</code> sets it.' },
      { slide: 6, line: '15-27', ph: 'm', cap: 'Three <b>methods</b>: getArea, getPerimeter and setRadius. They use the radius of the object they are called on.' },
      { slide: 7, ph: 'u', cap: 'The <b>UML class diagram</b> draws a class as a box: the class name on top, the data fields (<code>radius: double</code>) in the middle, the constructors and methods (<code>getArea(): double</code>) at the bottom. Type after the name, after a colon.' },
      { slide: 7, ph: 'o', cap: 'Objects are drawn as <code>circle1: Circle</code> (underlined in UML) with their current values.' }
    ],
    draw: function (k, s) {
      var ph = s.ph, items = [];
      items.push(B('uml', 120, 16, 320, boxH(7), { title: 'Circle', band: true, mono: true, lsize: 12.5, lines: [{ t: 'radius: double', b: ph === 'f', tone: ph === 'f' ? 'accent' : undefined }, '---', { t: 'Circle()', tone: ph === 'c' ? 'accent' : undefined, b: ph === 'c' }, { t: 'Circle(newRadius: double)', tone: ph === 'c' ? 'accent' : undefined, b: ph === 'c' }, { t: 'getArea(): double', tone: ph === 'm' ? 'accent' : undefined }, { t: 'getPerimeter(): double', tone: ph === 'm' ? 'accent' : undefined }, { t: 'setRadius(newRadius: double): void', tone: ph === 'm' ? 'accent' : undefined }], tone: ph === 'u' ? 'accent' : 'blue', hi: ph === 'u' }));
      if (ph === 'o') [1, 25, 125].forEach(function (r, i) { items.push(obj('o' + i, 20 + i * 182, 220, 170, 'circle' + (i + 1) + ': Circle', ['radius = ' + r], { tone: 'accent', hi: true })); });
      return items;
    }
  };

  /* ---------- 4. TestCircle (slide 8) ---------- */
  var TC = 'public class TestCircle {\n  // Main method\n  public static void main(String[] args) {\n    // Create a circle with radius 1\n    Circle circle1 = new Circle();\n    System.out.println("The area of the circle of radius "\n                       + circle1.radius + " is " + circle1.getArea());\n    // Create a circle with radius 25\n    Circle circle2 = new Circle(25);\n    System.out.println("The area of the circle of radius "\n                       + circle2.radius + " is " + circle2.getArea());\n    // Create a circle with radius 125\n    Circle circle3 = new Circle(125);\n    System.out.println("The area of the circle of radius "\n                       + circle3.radius + " is " + circle3.getArea());\n    // Modify circle radius\n    circle2.radius = 100; // or circle2.setRadius(100)\n    System.out.println("The area of the circle of radius "\n                       + circle2.radius + " is " + circle2.getArea());\n  }\n}';
  function line(r) { return 'The area of the circle of radius ' + jd(r) + ' is ' + jd(area(r)); }
  var testcircle = {
    id: 'testcircle', slides: [8, 8], title: 'Three objects, each with its own radius', code: TC,
    steps: [
      { line: '5-7', n: 1, r2: null, cap: '<code>new Circle()</code> uses the no-arg constructor, so radius stays 1. <code>circle1.radius</code> reads the field; <code>circle1.getArea()</code> calls the method on circle1.', out: line(1) },
      { line: '9-11', n: 2, r2: 25, cap: '<code>new Circle(25)</code> uses the other constructor: radius = 25.', out: line(25) },
      { line: '13-15', n: 3, r2: 25, cap: 'circle3 has radius 125. Three objects, three radii.', out: line(125) },
      { line: '17-19', n: 3, r2: 100, ch: true, cap: '<code>circle2.radius = 100;</code> changes the radius of circle2 <b>only</b>. circle1 and circle3 are not affected.', out: line(100) }
    ],
    draw: function (k, s) {
      var items = [], rs = [1, s.r2 || 25, 125];
      for (var i = 0; i < s.n; i++) {
        items.push(ref('v' + i, 20, 30 + i * 100, 'Circle circle' + (i + 1), {}));
        items.push(A('a' + i, 144, 52 + i * 100, 236, 52 + i * 100, { tone: 'blue' }));
        items.push(obj('o' + i, 240, 26 + i * 100, 170, 'circle' + (i + 1) + ': Circle', [{ t: 'radius = ' + jd(rs[i]), b: s.ch && i === 1, tone: s.ch && i === 1 ? 'accent' : undefined }], { tone: i === s.n - 1 && !s.ch || (s.ch && i === 1) ? 'accent' : 'teal', hi: i === s.n - 1 && !s.ch || (s.ch && i === 1) }));
        items.push(T('ar' + i, 420, 60 + i * 100, 'area ' + jd(area(rs[i])).slice(0, 10) + '…', { mono: true, size: 11.5, tone: 'muted' }));
      }
      return items;
    }
  };

  /* ---------- 5. the TV class (slides 9-12) ---------- */
  function TTV(v) { return 'public class TestTV {\n  public static void main(String[] args) {\n    TV tv1 = new TV();\n    tv1.turnOn();\n    tv1.setChannel(' + I(v.c) + ');\n    tv1.setVolume(' + I(v.vl) + ');\n\n    TV tv2 = new TV();\n    tv2.turnOn();\n    tv2.channelUp();\n    tv2.channelUp();\n    tv2.volumeUp();\n\n    System.out.println("tv1\'s channel is " + tv1.channel\n      + " and volume level is " + tv1.volumeLevel);\n    System.out.println("tv2\'s channel is " + tv2.channel\n      + " and volume level is " + tv2.volumeLevel);\n  }\n}'; }
  var tv = {
    id: 'tv', slides: [9, 12], title: 'Two TV objects, two states', code: TTV,
    inputs: [{ id: 'c', label: 'setChannel', value: 30, min: -5, max: 200 }, { id: 'vl', label: 'setVolume', value: 3, min: -5, max: 20 }],
    presets: [{ label: '30 and 3 (slide)', values: { c: 30, vl: 3 } }, { label: 'channel 150', values: { c: 150, vl: 3 } }, { label: 'volume 9', values: { c: 30, vl: 9 } }],
    steps: function (v) {
      var c = I(v.c), vl = I(v.vl), okC = c >= 1 && c <= 120, okV = vl >= 1 && vl <= 7, c1 = okC ? c : 1, v1 = okV ? vl : 1;
      return [
        { slide: 9, t: [[1, 1, false]], cap: 'The TV class models TV sets. Each TV has channel (1-120), volumeLevel (1-7) and on. The + in the diagram means public.' },
        { slide: 12, line: 3, t: [[1, 1, false]], cap: '<code>new TV()</code>: a TV object with the default values: channel 1, volume 1, off.' },
        { slide: 12, line: 4, t: [[1, 1, true]], cap: '<code>tv1.turnOn()</code> sets on = true <b>for tv1</b>.' },
        { slide: 10, line: 5, t: [[c1, 1, true]], cap: 'setChannel(' + c + '): ' + (okC ? 'on is true and ' + c + ' is between 1 and 120, so channel = ' + c + '.' : 'the method checks the value: ' + c + ' is not between 1 and 120, so nothing changes. The object protects its own state.') },
        { slide: 10, line: 6, t: [[c1, v1, true]], cap: 'setVolume(' + vl + '): ' + (okV ? 'volumeLevel = ' + vl + '.' : vl + ' is not between 1 and 7, so the volume stays 1.') },
        { slide: 11, line: '8-12', t: [[c1, v1, true], [3, 2, true]], cap: 'tv2 is a second object with its own state: turned on, channelUp twice (1 → 3), volumeUp once (1 → 2).' },
        { slide: 12, line: '14-17', t: [[c1, v1, true], [3, 2, true]], cap: 'Print both. Changing tv2 did nothing to tv1.', out: ["tv1's channel is " + c1 + ' and volume level is ' + v1, "tv2's channel is 3 and volume level is 2"] }
      ];
    },
    draw: function (k, s) {
      var items = [];
      if (k === 0) { items.push(B('uml', 140, 10, 280, boxH(11), { title: 'TV', band: true, mono: true, lsize: 11.5, lines: ['channel: int', 'volumeLevel: int', 'on: boolean', '---', '+TV()', '+turnOn(): void', '+turnOff(): void', '+setChannel(newChannel: int): void', '+setVolume(newVolumeLevel: int): void', '+channelUp(): void', '+volumeUp(): void …'], tone: 'blue' })); return items; }
      s.t.forEach(function (t, i) {
        items.push(ref('v' + i, 20, 50 + i * 130, 'TV tv' + (i + 1), {}));
        items.push(A('a' + i, 144, 72 + i * 130, 216, 72 + i * 130, { tone: 'blue' }));
        items.push(obj('o' + i, 220, 30 + i * 130, 200, 'tv' + (i + 1) + ': TV', ['channel = ' + t[0], 'volumeLevel = ' + t[1], 'on = ' + t[2]], { tone: i === s.t.length - 1 && k !== 6 ? 'accent' : 'teal', hi: i === s.t.length - 1 && k !== 6 }));
      });
      return items;
    }
  };

  /* ---------- 6. constructors (slides 14-16) ---------- */
  var ctor = {
    id: 'ctor', slides: [14, 16], title: 'Constructors build objects',
    code: '// no-arg Circle constructor\nCircle() {\n}\n\n// Circle constructor with one argument\nCircle(double newRadius) {\n  radius = newRadius;\n}\n\nnew Circle();\nnew Circle(5.0);',
    steps: [
      { slide: 14, ph: 'rules', cap: 'A <b>constructor</b> has the <b>same name</b> as the class and <b>no return type</b>, not even void. It runs when <code>new</code> creates an object, to give it its first values.' },
      { slide: 15, line: 10, ph: 'noarg', cap: '<code>new Circle()</code> calls the <b>no-arg</b> constructor (no parameters): radius keeps its first value, 1.' },
      { slide: 15, line: 11, ph: 'arg', cap: '<code>new Circle(5.0)</code> calls the constructor with one argument: radius = 5.0.' },
      { slide: 16, ph: 'def', cap: 'If a class has <b>no</b> constructor at all, Java adds an empty no-arg one: the <b>default constructor</b>. But if you write any constructor yourself, the default one is <b>not</b> added, so <code>new X()</code> may then be an error.' }
    ],
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'rules') {
        [['same name as the class', 'Circle(...)'], ['no return type', 'not even void'], ['called with new', 'new Circle()']].forEach(function (r, i) { items.push(B('r' + i, 20 + i * 180, 100, 170, 80, { title: r[0], lines: [r[1]], mono: true, size: 12, lsize: 12, tone: 'accent' })); });
        return items;
      }
      if (s.ph === 'def') {
        items.push(B('a', 20, 30, 250, 110, { tag: 'no constructors written', lines: ['class A {', '  int x;', '}', '// Java adds: A() { }'], mono: true, lsize: 12.5, tone: 'teal', hi: true }));
        items.push(B('b', 290, 30, 250, 110, { tag: 'one constructor written', lines: ['class B {', '  B(int v) { ... }', '}', '// no default B()'], mono: true, lsize: 12.5, tone: 'red', hi: true }));
        items.push(T('ok', 145, 190, 'new A()  ✓', { anchor: 'middle', mono: true, size: 15, bold: true, tone: 'teal' }), T('no', 415, 190, 'new B()  ✗ error', { anchor: 'middle', mono: true, size: 15, bold: true, tone: 'red' }));
        return items;
      }
      var r = s.ph === 'noarg' ? '1.0' : '5.0';
      items.push(B('call', 40, 60, 180, 46, { title: s.ph === 'noarg' ? 'new Circle()' : 'new Circle(5.0)', mono: true, size: 15, tone: 'accent', hi: true }));
      items.push(A('mk', 224, 83, 316, 83, { tone: 'accent', label: 'creates' }));
      items.push(obj('o', 320, 60, 180, ': Circle', ['radius = ' + r], { tone: 'teal', hi: true }));
      return items;
    }
  };

  /* ---------- 7. reference variables, traced (slides 17-24) ---------- */
  var REFS = 'Circle myCircle = new Circle(5.0);\nCircle yourCircle = new Circle();\nyourCircle.radius = 100;';
  var refs = {
    id: 'refs', slides: [17, 24], title: 'A variable holds a reference to an object', code: REFS,
    steps: [
      { slide: 17, ph: 0, cap: '<code>ClassName objectRefVar;</code> declares a <b>reference variable</b>. <code>ClassName objectRefVar = new ClassName();</code> also creates an object and stores its reference.' },
      { slide: 18, line: 1, ph: 1, cap: 'Declare myCircle: it has <b>no value</b> yet.' },
      { slide: 19, line: 1, ph: 2, cap: 'Create a Circle object: <code>new Circle(5.0)</code> makes an object with radius = 5.0.' },
      { slide: 20, line: 1, ph: 3, cap: 'Assign the object’s <b>reference</b> to myCircle. The variable does not contain the circle; it points to it.' },
      { slide: 21, line: 2, ph: 4, cap: 'Declare yourCircle: no value yet.' },
      { slide: 22, line: 2, ph: 5, cap: 'Create a new Circle object with the no-arg constructor: radius = 1.0.' },
      { slide: 23, line: 2, ph: 6, cap: 'Assign its reference to yourCircle.' },
      { slide: 24, line: 3, ph: 7, cap: 'Change radius in yourCircle: <code>yourCircle.radius = 100;</code> follows the reference and changes that object to radius = 100.0. myCircle’s object is untouched.' }
    ],
    draw: function (k, s) {
      var p = s.ph, items = [];
      if (p === 0) { items.push(B('syn', 60, 80, 440, 100, { lines: ['ClassName objectRefVar;', '', 'ClassName objectRefVar = new ClassName();', '                         create   assign'], mono: true, lsize: 14, tone: 'blue' })); return items; }
      items.push(ref('m', 20, 40, 'myCircle', { title: p >= 3 ? 'reference value' : 'no value', dash: p < 3, tone: p < 3 ? 'muted' : 'blue', hi: p === 1 || p === 3 }));
      if (p >= 2) items.push(obj('mo', 300, 30, 180, ': Circle', ['radius = 5.0'], { tone: p === 2 ? 'accent' : 'teal', hi: p === 2 }));
      if (p >= 3) items.push(A('ma', 144, 62, 296, 62, { tone: p === 3 ? 'accent' : 'blue' }));
      if (p >= 4) items.push(ref('y', 20, 200, 'yourCircle', { title: p >= 6 ? 'reference value' : 'no value', dash: p < 6, tone: p < 6 ? 'muted' : 'blue', hi: p === 4 || p === 6 }));
      if (p >= 5) items.push(obj('yo', 300, 190, 180, ': Circle', [{ t: 'radius = ' + (p >= 7 ? '100.0' : '1.0'), b: p === 7, tone: p === 7 ? 'accent' : undefined }], { tone: p === 5 || p === 7 ? 'accent' : 'teal', hi: p === 5 || p === 7 }));
      if (p >= 6) items.push(A('ya', 144, 222, 296, 222, { tone: p === 6 ? 'accent' : 'blue' }));
      return items;
    }
  };

  /* ---------- 8. the dot operator, and static vs non-static (slides 25-26) ---------- */
  var dot = {
    id: 'dot', slides: [25, 26], title: 'objectRefVar.member',
    code: 'Circle myCircle = new Circle(5.0);\nSystem.out.println(myCircle.radius);\nSystem.out.println(myCircle.getArea());\nSystem.out.println(Math.pow(3, 2.5));\nSystem.out.println(Circle.getArea());  // error!',
    steps: [
      { slide: 25, line: 2, ph: 'f', cap: 'The <b>dot operator</b> reaches inside an object: <code>myCircle.radius</code> is the radius of that object.', out: '5.0' },
      { slide: 25, line: 3, ph: 'm', cap: '<code>myCircle.getArea()</code> invokes the method on that object: 5.0 × 5.0 × π.', out: jd(area(5)) },
      { slide: 26, line: 4, ph: 's', cap: 'Math methods are <b>static</b>: they are called with the class name, <code>Math.pow(3, 2.5)</code>.', out: jd(Math.pow(3, 2.5)) },
      { slide: 26, line: 5, ph: 'e', cap: 'But getArea is <b>non-static</b>: it needs an object (whose radius?). <code>Circle.getArea()</code> does not compile.' }
    ],
    draw: function (k, s) {
      var items = [ref('m', 20, 60, 'myCircle', {}), A('a', 144, 82, 296, 82, { tone: 'blue' }), obj('o', 300, 60, 200, ': Circle', [{ t: 'radius = 5.0', b: s.ph === 'f', tone: s.ph === 'f' ? 'accent' : undefined }, { t: 'getArea()', b: s.ph === 'm', tone: s.ph === 'm' ? 'accent' : undefined }], { hi: s.ph === 'f' || s.ph === 'm' })];
      if (s.ph === 's') items.push(B('math', 300, 200, 200, 60, { title: 'Math (class)', lines: ['static pow(a, b)'], mono: true, size: 13, lsize: 12, tone: 'accent', hi: true }));
      if (s.ph === 'e') items.push(T('er', 280, 250, 'Circle.getArea()  →  which circle?  ✗', { anchor: 'middle', mono: true, size: 14, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* ---------- 9. primitive vs reference variables, garbage, null (slides 28-30) ---------- */
  var primref = {
    id: 'primref', slides: [28, 30], title: 'Copying a value vs copying a reference',
    code: 'int i = 1, j = 2;\ni = j;\n\nCircle c1 = new Circle(5);\nCircle c2 = new Circle(9);\nc1 = c2;\n\nc1 = null;',
    steps: [
      { slide: 28, ph: 'kinds', cap: 'A primitive variable holds the <b>value</b> itself (<code>int i = 1</code>: the box holds 1). A reference variable holds a <b>reference</b> to an object stored somewhere else in memory.' },
      { slide: 29, line: 2, ph: 'ij', cap: '<code>i = j;</code> copies the <b>value</b> 2 into i. i and j are still two separate boxes.' },
      { slide: 29, line: '4-5', ph: 'before', cap: 'Before <code>c1 = c2</code>: c1 points to a circle with radius 5, c2 to one with radius 9.' },
      { slide: 29, line: 6, ph: 'after', cap: 'After <code>c1 = c2</code>: the <b>reference</b> in c2 is copied, so both point to the radius-9 circle.' },
      { slide: 30, line: 6, ph: 'garbage', cap: 'The radius-5 circle has no reference left: it is <b>garbage</b>. The JVM frees its memory automatically (garbage collection).' },
      { slide: 30, line: 8, ph: 'null', cap: '<code>c1 = null;</code> means c1 refers to <b>nothing</b>. If no variable refers to an object any more, the JVM can collect it.' }
    ],
    draw: function (k, s) {
      var ph = s.ph, items = [];
      if (ph === 'kinds') {
        items.push(T('l1', 20, 70, 'int i = 1', { mono: true, size: 14 }), B('iv', 140, 46, 120, 40, { title: '1', mono: true, size: 16, tone: 'teal' }));
        items.push(T('l2', 20, 170, 'Circle c', { mono: true, size: 14 }), ref('cr', 140, 146, 'c', {}), A('ca', 264, 168, 336, 168, { tone: 'blue', dash: true }), obj('co', 340, 146, 160, 'c: Circle', ['radius = 1']));
        return items;
      }
      if (ph === 'ij') {
        items.push(vbox('i', 60, 80, 120, 'i', 'int', 2, hot()), vbox('j', 60, 170, 120, 'j', 'int', 2, {}), A('cp', 186, 194, 186, 108, { tone: 'accent', bend: -40, label: 'copy 2' }));
        return items;
      }
      var after = ph !== 'before';
      items.push(ref('c1', 20, 50, 'c1', { title: ph === 'null' ? 'null' : 'reference', tone: ph === 'null' ? 'muted' : after ? 'accent' : 'blue', hi: ph === 'after' || ph === 'null', dash: ph === 'null' }));
      items.push(ref('c2', 20, 200, 'c2', {}));
      items.push(obj('o5', 340, 40, 170, 'c1: Circle', ['radius = 5'], { tone: ph === 'garbage' || ph === 'null' ? 'red' : after ? 'muted' : 'teal', hi: ph === 'garbage', extra: { dash: ph === 'garbage' || ph === 'null' } }));
      items.push(obj('o9', 340, 190, 170, 'c2: Circle', ['radius = 9'], { tone: 'teal' }));
      items.push(A('r2', 144, 222, 336, 214, { tone: 'blue' }));
      if (!after) items.push(A('r1', 144, 72, 336, 64, { tone: 'blue' }));
      else if (ph !== 'null') items.push(A('r1', 144, 80, 336, 206, { tone: 'accent' }));
      if (ph === 'garbage' || ph === 'null') items.push(T('gb', 425, 30, 'garbage', { anchor: 'middle', size: 13, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* ---------- 10. default values of data fields (slides 31-33) ---------- */
  var TS = 'public class TestStudent {\n  public static void main(String[] args) {\n    Student student = new Student();\n    System.out.println("name? " + student.name);\n    System.out.println("age? " + student.age);\n    System.out.println("isScienceMajor? " + student.isScienceMajor);\n    System.out.println("gender? " + student.gender);\n  }\n}';
  var defaults = {
    id: 'defaults', slides: [31, 33], title: 'Data fields get default values; local variables do not', code: TS,
    steps: [
      { slide: 31, ph: 'cls', cap: 'A data field can be of a <b>reference type</b>, like <code>String name</code>, or of a primitive type, like int, boolean and char.' },
      { slide: 32, line: 3, ph: 'new', cap: '<code>new Student()</code>: the fields get <b>default values</b>: null for a reference, 0 for numbers, false for boolean, \'\\u0000\' for char.' },
      { slide: 32, line: '4-7', ph: 'out', cap: 'Print them. (\'\\u0000\' is an invisible character, so nothing shows after "gender? ".)', out: ['name? null', 'age? 0', 'isScienceMajor? false', 'gender? '] },
      { slide: 33, ph: 'local', cap: 'But a <b>local variable</b> inside a method gets <b>no</b> default value. Using x or y before giving them a value is a compile error: variables must be initialized.' }
    ],
    draw: function (k, s) {
      if (s.ph === 'local') return [B('loc', 100, 50, 360, 130, { tag: 'inside main', lines: ['int x;     // x has no default value', 'String y;  // y has no default value', 'System.out.println("x is " + x);  ✗', 'System.out.println("y is " + y);  ✗'], mono: true, lsize: 12.5, tone: 'red', hi: true }), T('ce', 280, 230, 'compile error: variables must be initialized', { anchor: 'middle', size: 13.5, bold: true, tone: 'red' })];
      var vals = ['null', '0', 'false', "'\\u0000'"], names = ['String name', 'int age', 'boolean isScienceMajor', 'char gender'];
      var items = [ref('st', 20, 120, 'Student student', { tone: s.ph === 'cls' ? 'muted' : 'blue' })];
      if (s.ph !== 'cls') items.push(A('a', 144, 142, 236, 142, { tone: 'blue' }));
      items.push(B('o', 240, 50, 290, boxH(4), { title: s.ph === 'cls' ? 'class Student' : ': Student', band: true, mono: true, lsize: 13, lines: names.map(function (n, i) { return { t: n + (s.ph === 'cls' ? ';' : ' = ' + vals[i]), tone: s.ph !== 'cls' ? 'accent' : i === 0 ? 'blue' : undefined }; }), tone: s.ph === 'new' ? 'accent' : 'teal', hi: s.ph === 'new' }));
      if (s.ph === 'cls') items.push(T('rt', 385, 200, 'name: a reference type; the rest: primitive', { anchor: 'middle', size: 12, tone: 'muted' }));
      return items;
    }
  };

  /* ---------- 11. the Date class (slides 35-36) ---------- */
  var date = {
    id: 'date', slides: [35, 36], title: 'A Date object holds a moment in time',
    code: 'java.util.Date date = new java.util.Date();\nSystem.out.println(date.toString());\nSystem.out.println(date.getTime());',
    steps: function () {
      var now = Date.now();
      return [
        { slide: 35, ph: 'uml', cap: 'java.util.Date has constructors <code>Date()</code> (now) and <code>Date(elapseTime: long)</code>, and methods toString, getTime and setTime.' },
        { slide: 36, line: 1, ph: 'new', now: now, cap: '<code>new java.util.Date()</code> creates a Date object for the current date and time.' },
        { slide: 36, line: 2, ph: 'str', now: now, cap: '<code>toString()</code> returns the date and time as a string, like <code>Sun Aug 25 13:50:19 AST 2024</code>.' },
        { slide: 35, line: 3, ph: 'ms', now: now, cap: '<code>getTime()</code> returns the time as the number of <b>milliseconds</b> since January 1, 1970, GMT: right now about ' + now + '.', out: String(now) }
      ];
    },
    draw: function (k, s) {
      if (s.ph === 'uml') return [B('u', 140, 30, 280, boxH(5), { title: 'java.util.Date', band: true, mono: true, lsize: 12, lines: ['+Date()', '+Date(elapseTime: long)', '+toString(): String', '+getTime(): long', '+setTime(elapseTime: long): void'], tone: 'blue' })];
      return [ref('d', 20, 60, 'Date date', {}), A('a', 144, 82, 236, 82, { tone: 'blue' }), obj('o', 240, 50, 290, ': Date', [{ t: 'ms since 1970: ' + s.now, b: s.ph === 'ms', tone: s.ph === 'ms' ? 'accent' : undefined }, { t: new Date(s.now).toString().slice(0, 24), tone: s.ph === 'str' ? 'accent' : undefined }], { hi: s.ph === 'new' })];
    }
  };

  /* ---------- 12. the Random class and seeds (slides 37-38) ---------- */
  function JRandom(seed) {
    var M = (1n << 48n) - 1n, st = (BigInt(seed) ^ 0x5DEECE66Dn) & M;
    function next(bits) { st = (st * 0x5DEECE66Dn + 0xBn) & M; return Number(st >> BigInt(48 - bits)); }
    return { nextInt: function (n) { if ((n & -n) === n) return Number((BigInt(n) * BigInt(next(31))) >> 31n); var bits, val; do { bits = next(31); val = bits % n; } while (bits - val + (n - 1) > 2147483647); return val; } };
  }
  function seq(seed) { var r = JRandom(seed), out = []; for (var i = 0; i < 10; i++) out.push(r.nextInt(1000)); return out; }
  function RND(v) { return 'Random random1 = new Random(' + I(v.s) + ');\nSystem.out.print("From random1: ");\nfor (int i = 0; i < 10; i++)\n  System.out.print(random1.nextInt(1000) + " ");\n\nRandom random2 = new Random(' + I(v.s) + ');\nSystem.out.print("\\nFrom random2: ");\nfor (int i = 0; i < 10; i++)\n  System.out.print(random2.nextInt(1000) + " ");'; }
  var random = {
    id: 'random', slides: [37, 38], title: 'Same seed, same numbers', code: RND,
    inputs: [{ id: 's', label: 'seed', value: 3, min: 0, max: 99999 }],
    presets: [{ label: 'seed 3 (slide)', values: { s: 3 } }, { label: 'seed 42', values: { s: 42 } }, { label: 'seed 0', values: { s: 0 } }],
    steps: function (v) {
      var a = seq(I(v.s));
      return [
        { slide: 37, ph: 'uml', a: a, cap: 'java.util.Random is a random number generator with more methods than Math.random(): <code>nextInt(n)</code> gives an int from 0 to n − 1, and there are nextDouble, nextBoolean and more.' },
        { slide: 38, line: '1-4', ph: 'r1', a: a, cap: '<code>new Random(' + I(v.s) + ')</code> starts the generator from the <b>seed</b> ' + I(v.s) + '. It prints 10 numbers from 0 to 999.', out: 'From random1: ' + a.join(' ') + ' ' },
        { slide: 38, line: '6-9', ph: 'r2', a: a, cap: 'A second Random with the <b>same seed</b> produces exactly the same sequence. (Without a seed, Java uses the current time, so the numbers differ each run.)', out: ['From random2: ' + a.join(' ') + ' '] }
      ];
    },
    draw: function (k, s) {
      if (s.ph === 'uml') return [B('u', 130, 20, 300, boxH(8), { title: 'java.util.Random', band: true, mono: true, lsize: 12, lines: ['+Random()', '+Random(seed: long)', '+nextInt(): int', '+nextInt(n: int): int', '+nextLong(): long', '+nextDouble(): double', '+nextFloat(): float', '+nextBoolean(): boolean'], tone: 'blue' })];
      var items = [];
      [0, 1].forEach(function (r) {
        if (r === 1 && s.ph !== 'r2') return;
        items.push(T('l' + r, 20, 70 + r * 110, 'random' + (r + 1), { mono: true, size: 13, bold: true }));
        s.a.forEach(function (x, i) { items.push(B('n' + r + '_' + i, 20 + i * 52, 84 + r * 110, 48, 40, { title: String(x), mono: true, size: 13, tone: r ? 'accent' : 'teal', r: 3 })); });
      });
      return items;
    }
  };

  /* ---------- 13. the Point2D class (slides 39-40) ---------- */
  var P2D = 'Point2D p1 = new Point2D(x1, y1);\nPoint2D p2 = new Point2D(x2, y2);\nSystem.out.println("p1 is " + p1.toString());\nSystem.out.println("p2 is " + p2.toString());\nSystem.out.println("The distance between p1 and p2 is " + p1.distance(p2));\nSystem.out.println("The midpoint between p1 and p2 is " +\n  p1.midpoint(p2).toString());';
  function pstr(x, y) { return 'Point2D [x = ' + jd(x) + ', y = ' + jd(y) + ']'; }
  var point2d = {
    id: 'point2d', slides: [39, 40], title: 'Point objects that know their distance', code: P2D,
    inputs: [{ id: 'x1', label: 'x1', value: 1.5, min: -50, max: 50 }, { id: 'y1', label: 'y1', value: 5.5, min: -50, max: 50 }, { id: 'x2', label: 'x2', value: -3, min: -50, max: 50 }, { id: 'y2', label: 'y2', value: -4, min: -50, max: 50 }],
    presets: [{ label: '(1.5, 5.5) (-3, -4)', values: { x1: 1.5, y1: 5.5, x2: -3, y2: -4 } }, { label: '(0, 0) (3, 4)', values: { x1: 0, y1: 0, x2: 3, y2: 4 } }],
    steps: function (v) {
      var d = Math.sqrt((v.x2 - v.x1) * (v.x2 - v.x1) + (v.y2 - v.y1) * (v.y2 - v.y1)), mx = v.x1 + (v.x2 - v.x1) / 2.0, my = v.y1 + (v.y2 - v.y1) / 2.0;
      return [
        { slide: 39, ph: 'uml', cap: 'javafx.geometry.Point2D represents a point in a two-dimensional plane, with methods like distance, getX, getY and midpoint.' },
        { slide: 40, line: '1-4', ph: 'pts', cap: 'Two Point2D objects. Their toString gives <code>Point2D [x = …, y = …]</code>.', out: ['p1 is ' + pstr(v.x1, v.y1), 'p2 is ' + pstr(v.x2, v.y2)] },
        { slide: 40, line: 5, ph: 'dist', cap: '<code>p1.distance(p2)</code>: the method of p1 measures the distance to p2.', out: 'The distance between p1 and p2 is ' + jd(d) },
        { slide: 40, line: '6-7', ph: 'mid', mx: mx, my: my, cap: '<code>p1.midpoint(p2)</code> returns a <b>new</b> Point2D object halfway between them.', out: 'The midpoint between p1 and p2 is ' + pstr(mx, my) }
      ];
    },
    draw: function (k, s, v) {
      if (s.ph === 'uml') return [B('u', 120, 20, 320, boxH(7), { title: 'javafx.geometry.Point2D', band: true, mono: true, lsize: 12, lines: ['+Point2D(x: double, y: double)', '+distance(x: double, y: double): double', '+distance(p: Point2D): double', '+getX(): double', '+getY(): double', '+midpoint(p: Point2D): Point2D', '+toString(): String'], tone: 'blue' })];
      var X = function (x) { return 280 + x * 4.5; }, Y = function (y) { return 170 - y * 2.8; }, items = [];
      items.push(A('ax', 40, 170, 520, 170, { head: false, tone: 'muted' }), A('ay', 280, 20, 280, 320, { head: false, tone: 'muted' }));
      items.push(B('p1', X(v.x1) - 7, Y(v.y1) - 7, 14, 14, { shape: 'oval', fill: 'solid', tone: 'teal' }), B('p2', X(v.x2) - 7, Y(v.y2) - 7, 14, 14, { shape: 'oval', fill: 'solid', tone: 'blue' }));
      items.push(T('t1', X(v.x1) > 450 ? X(v.x1) - 10 : X(v.x1) + 10, Y(v.y1) < 30 ? Y(v.y1) + 24 : Y(v.y1) - 8, v.x1 === v.x2 && v.y1 === v.y2 ? 'p1 = p2' : 'p1', { anchor: X(v.x1) > 450 ? 'end' : 'start', mono: true, bold: true, size: 13, tone: 'teal' }), T('t2', X(v.x2) + 10, Y(v.y2) - 8, v.x1 === v.x2 && v.y1 === v.y2 ? '' : 'p2', { mono: true, bold: true, size: 13, tone: 'blue' }));
      if (s.ph === 'dist' || s.ph === 'mid') items.push(A('dl', X(v.x1), Y(v.y1), X(v.x2), Y(v.y2), { head: false, tone: 'accent' }));
      if (s.ph === 'mid') items.push(B('pm', X(s.mx) - 7, Y(s.my) - 7, 14, 14, { shape: 'oval', fill: 'solid', tone: 'accent' }), T('tm', X(s.mx) < 280 ? X(s.mx) + 10 : X(s.mx) - 10, Y(s.my) + 30, v.x1 === v.x2 && v.y1 === v.y2 ? '' : 'midpoint', { anchor: X(s.mx) < 280 ? 'start' : 'end', size: 12, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 14. static variables and methods (slides 42-46) ---------- */
  var SM = 'public class TestCircleSM {\n  public static void main(String[] args) {\n    System.out.println("Before creating objects");\n    System.out.println("The number of Circle objects is " +\n                       CircleSM.numberOfObjects);\n    CircleSM c1 = new CircleSM();      // Create c1, radius = 1\n    System.out.println("\\nAfter creating c1");\n    System.out.println("c1: radius = " + c1.radius +\n      " and number of Circle objects = " + c1.numberOfObjects);\n    CircleSM c2 = new CircleSM(5);     // Create c2, radius = 5\n    c1.radius = 9;                     // Modify c1, radius = 9\n    System.out.println("\\nAfter creating c2 and modifying c1");\n    System.out.println("c1: radius = " + c1.radius +\n      " and number of Circle objects = " + c1.numberOfObjects);\n    System.out.println("c2: radius = " + c2.radius +\n      " and number of Circle objects = " + c2.numberOfObjects);\n  }\n}';
  var staticv = {
    id: 'staticv', slides: [42, 46], title: 'One shared numberOfObjects', code: SM,
    steps: [
      { slide: 42, ph: 'idea', n: 0, c: [], cap: '<b>Instance</b> variables belong to one object. <b>Static</b> variables (class variables) are <b>shared</b> by all objects of the class. A static method is not tied to an object.' },
      { slide: 43, ph: 'rules', n: 0, c: [], cap: 'An instance method can use everything. A <b>static</b> method can use only static methods and static data fields: it has no object, so it cannot reach instance data.' },
      { slide: 45, line: '3-5', ph: 'run', n: 0, c: [], cap: 'Before any object exists, the static variable is already there: 0.', out: ['Before creating objects', 'The number of Circle objects is 0'] },
      { slide: 44, line: '6-9', ph: 'run', n: 1, c: [1], cap: 'Each constructor does <code>numberOfObjects++</code>. After c1: 1.', out: ['', 'After creating c1', 'c1: radius = 1.0 and number of Circle objects = 1'] },
      { slide: 45, line: 10, ph: 'run', n: 2, c: [1, 5], cap: 'Creating c2 adds 1 to the <b>same</b> shared variable: 2.' },
      { slide: 45, line: '11-16', ph: 'run', n: 2, c: [9, 5], ch: true, cap: 'c1.radius = 9 changes only c1. Both c1.numberOfObjects and c2.numberOfObjects read the one shared value 2.', out: ['', 'After creating c2 and modifying c1', 'c1: radius = 9.0 and number of Circle objects = 2', 'c2: radius = 5.0 and number of Circle objects = 2'] },
      { slide: 46, ph: 'uml', n: 2, c: [9, 5], cap: 'In UML, static variables and methods are <b>underlined</b> ; instance members are not.' }
    ],
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'rules') {
        [['instance method', ['instance method ✓', 'instance field ✓', 'static method ✓', 'static field ✓']], ['static method', ['instance method ✗', 'instance field ✗', 'static method ✓', 'static field ✓']]].forEach(function (c, i) {
          items.push(B('r' + i, 30 + i * 270, 50, 230, boxH(4), { title: c[0], band: true, mono: true, lsize: 13, lines: c[1].map(function (t) { return { t: t, tone: /✗/.test(t) ? 'red' : 'teal' }; }), tone: i ? 'accent' : 'blue' }));
        });
        return items;
      }
      if (s.ph === 'uml') {
        items.push(B('u', 20, 60, 240, boxH(5), { title: 'CircleSM', band: true, mono: true, lsize: 12.5, lines: ['radius: double', { t: 'numberOfObjects: int', u: true, tone: 'accent' }, '---', { t: 'getNumberOfObjects(): int', u: true, tone: 'accent' }, 'getArea(): double'], tone: 'blue' }));
      }
      items.push(B('cnt', 330, 20, 200, 56, { tag: 'static: one copy, shared', title: 'numberOfObjects = ' + s.n, mono: true, size: 14, tone: 'accent', hi: s.ph === 'run' && k >= 2 }));
      s.c.forEach(function (r, i) {
        var y = 130 + i * 90;
        if (s.ph !== 'uml') items.push(ref('v' + i, 20, y + 4, 'CircleSM c' + (i + 1), {}), A('a' + i, 144, y + 26, 296, y + 26, { tone: 'blue' }));
        items.push(obj('o' + i, 300, y, 160, 'c' + (i + 1), [{ t: 'radius = ' + jd(r), b: s.ch && i === 0, tone: s.ch && i === 0 ? 'accent' : undefined }], {}));
        items.push(A('s' + i, 460, y + 20, 470, 80, { tone: 'muted', dash: true, head: false }));
      });
      return items;
    }
  };

  /* ---------- 15. visibility modifiers (slides 48-51) ---------- */
  var MEM = [['public int x', 'pub'], ['int y', 'def'], ['private int z', 'pri'], ['public void m1()', 'pub'], ['void m2()', 'def'], ['private void m3()', 'pri']];
  var visibility = {
    id: 'visibility', slides: [48, 51], title: 'public, default (nothing) and private',
    steps: [
      { slide: 48, w: 'C1', cap: '<b>public</b>: visible to any class in any package. <b>private</b>: only inside its own class. <b>No modifier</b> (default): any class in the same <b>package</b>. Private data is read and changed with get and set methods.' },
      { slide: 49, w: 'C2', cap: 'C2 is in the same package p1 as C1. It can use the public and the default members, but not the private ones.' },
      { slide: 49, w: 'C3', cap: 'C3 is in another package, p2. It can use only the public members.' },
      { slide: 50, w: 'self', cap: 'A class can always use its own private members, even through an object: class C can use <code>c.x</code> and <code>c.convert()</code>, but a class Test cannot. Making fields private <b>protects the data</b> and makes the code easier to maintain.' },
      { slide: 51, w: 'cls', cap: 'The same rules for classes: a class with no modifier can be used only in its package; a public class can be used everywhere.' }
    ],
    draw: function (k, s) {
      var items = [];
      if (s.w === 'cls') {
        items.push(B('k1', 20, 60, 160, 80, { tag: 'package p1', lines: ['class C1 { ... }'], mono: true, lsize: 12, tone: 'blue' }));
        items.push(B('k2', 200, 60, 160, 80, { tag: 'package p1', lines: ['public class C2', 'can access C1 ✓'], mono: true, lsize: 12, tone: 'teal' }));
        items.push(B('k3', 380, 60, 160, 80, { tag: 'package p2', lines: ['public class C3', 'cannot access C1 ✗', 'can access C2 ✓'], mono: true, lsize: 12, tone: 'accent' }));
        return items;
      }
      if (s.w === 'self') {
        items.push(B('c', 20, 40, 250, boxH(5), { tag: '(a) okay', lines: ['public class C {', '  private boolean x;', '  ... c.x ✓', '  ... c.convert() ✓', '}'], mono: true, lsize: 12.5, tone: 'teal', hi: true }));
        items.push(B('t', 290, 40, 250, boxH(5), { tag: '(b) wrong', lines: ['public class Test {', '  C c = new C();', '  ... c.x ✗', '  ... c.convert() ✗', '}'], mono: true, lsize: 12.5, tone: 'red', hi: true }));
        return items;
      }
      items.push(B('c1', 20, 30, 220, boxH(6), { tag: 'package p1: public class C1', lines: MEM.map(function (m) { return m[0]; }), mono: true, lsize: 12.5, tone: 'blue' }));
      MEM.forEach(function (m, i) {
        if (s.w === 'C1') { items.push(T('t' + i, 260, 77 + i * 18, m[1] === 'pub' ? 'everyone' : m[1] === 'def' ? 'same package' : 'only C1', { size: 12, bold: true, tone: m[1] === 'pub' ? 'teal' : m[1] === 'def' ? 'blue' : 'red' })); return; }
        var ok = m[1] === 'pub' || (m[1] === 'def' && s.w === 'C2');
        items.push(T('t' + i, 260, 77 + i * 18, (ok ? 'can ' : 'cannot ') + (i < 3 ? 'access o.' + m[0].split(' ').pop() : 'invoke o.' + m[0].split(' ').pop()), { size: 12, bold: true, tone: ok ? 'teal' : 'red' }));
      });
      if (s.w !== 'C1') items.push(B('w', 260, 220, 200, 44, { title: s.w === 'C2' ? 'class C2 in p1' : 'class C3 in p2', mono: true, size: 13, tone: 'accent', hi: true }));
      return items;
    }
  };

  /* ---------- 16. encapsulation: private fields with get and set (slides 52-54) ---------- */
  function ENC(v) { return 'public class TestCircle {\n  /** Main method */\n  public static void main(String[] args) {\n    // Create a circle with radius ' + jd(v.r) + '\n    Circle myCircle = new Circle(' + jd(v.r) + ');\n    System.out.println("The area of the circle of radius "\n      + myCircle.getRadius() + " is " + myCircle.getArea());\n    // Increase myCircle\'s radius by 10%\n    myCircle.setRadius(myCircle.getRadius() * 1.1);\n    System.out.println("The area of the circle of radius "\n      + myCircle.getRadius() + " is " + myCircle.getArea());\n    System.out.println("The number of objects created is "\n      + Circle.getNumberOfObjects());\n  }\n}'; }
  var encaps = {
    id: 'encaps', slides: [52, 54], title: 'Private data, public methods', code: ENC,
    inputs: [{ id: 'r', label: 'radius', value: 5, min: -20, max: 100 }],
    presets: [{ label: '5.0 (slide)', values: { r: 5 } }, { label: '10', values: { r: 10 } }, { label: '-3 (negative)', values: { r: -3 } }],
    steps: function (v) {
      var r0 = v.r >= 0 ? v.r : 0, r1 = r0 * 1.1;
      r1 = r1 >= 0 ? r1 : 0;
      return [
        { slide: 52, ph: 'uml', r: null, cap: 'In UML, <b>-</b> means private and <b>+</b> means public. radius and numberOfObjects are private; the methods are public. This is <b>data field encapsulation</b>.' },
        { slide: 54, line: 5, ph: 'new', r: r0, cap: '<code>new Circle(' + jd(v.r) + ')</code> calls <code>setRadius(' + jd(v.r) + ')</code>, which checks the value: <code>(newRadius >= 0) ? newRadius : 0</code>.' + (v.r < 0 ? ' The negative radius becomes 0.' : '') + ' numberOfObjects becomes 1.' },
        { slide: 54, line: '6-7', ph: 'get', r: r0, cap: 'Outside the class we cannot write myCircle.radius (it is private). We use the <b>accessor</b> getRadius().', out: 'The area of the circle of radius ' + jd(r0) + ' is ' + jd(area(r0)) },
        { slide: 54, line: 9, ph: 'set', r: r1, cap: 'The <b>mutator</b> setRadius changes it: radius × 1.1 = ' + jd(r1) + '.', out: 'The area of the circle of radius ' + jd(r1) + ' is ' + jd(area(r1)) },
        { slide: 54, line: '12-13', ph: 'count', r: r1, cap: 'getNumberOfObjects() is public and static, so it is called with the class name.', out: 'The number of objects created is 1' }
      ];
    },
    draw: function (k, s) {
      if (s.ph === 'uml') return [B('u', 100, 20, 360, boxH(8), { title: 'Circle', band: true, mono: true, lsize: 12.5, lines: [{ t: '-radius: double', tone: 'red' }, { t: '-numberOfObjects: int', tone: 'red', u: true }, '---', { t: '+Circle()', tone: 'teal' }, { t: '+Circle(radius: double)', tone: 'teal' }, { t: '+getRadius(): double', tone: 'teal' }, { t: '+setRadius(radius: double): void', tone: 'teal' }, { t: '+getArea(): double', tone: 'teal' }], tone: 'blue' })];
      var items = [ref('m', 20, 80, 'myCircle', {}), A('a', 144, 102, 216, 102, { tone: 'blue' })];
      items.push(B('wall', 220, 40, 320, 150, { tag: 'Circle object', fill: 'none', tone: 'muted', z: 0 }));
      items.push(B('pr', 240, 60, 140, 50, { tag: 'private', title: 'radius = ' + jd(s.r), mono: true, size: jd(s.r).length > 6 ? 8 : 12, tone: 'red', hi: s.ph === 'set' }));
      items.push(B('g', 390, 60, 130, 40, { title: 'getRadius()', mono: true, size: 12, tone: s.ph === 'get' ? 'accent' : 'teal', hi: s.ph === 'get' }));
      items.push(B('st', 390, 116, 130, 40, { title: 'setRadius(…)', mono: true, size: 12, tone: s.ph === 'set' || s.ph === 'new' ? 'accent' : 'teal', hi: s.ph === 'set' || s.ph === 'new' }));
      items.push(T('nt', 380, 230, 'outside code uses only the public methods', { anchor: 'middle', size: 12.5, tone: 'muted' }));
      return items;
    }
  };

  /* ---------- 17. passing objects to methods (slide 56) ---------- */
  var TPO = 'public class TestPassObject {\n  /** Main method */\n  public static void main(String[] args) {\n    // Create a Circle object with radius 1\n    Circle myCircle =\n      new Circle(1); // Use the Circle class\n\n    // Print areas for radius 1, 2, 3, 4, and 5.\n    int n = 5;\n    printAreas(myCircle, n);\n\n    // See myCircle.radius and times\n    System.out.println("\\n" + "Radius is " + myCircle.getRadius());\n    System.out.println("n is " + n);\n  }\n\n  /** Print a table of areas for radius */\n  public static void printAreas(Circle c, int times) {\n    System.out.println("Radius \\t\\tArea");\n    while (times >= 1) {\n      System.out.println(c.getRadius() + "\\t\\t" + c.getArea());\n      c.setRadius(c.getRadius() + 1);\n      times--;\n    }\n  }\n}';
  var passobj = {
    id: 'passobj', slides: [56, 56], title: 'The method changes the object, not n', code: TPO,
    steps: (function () {
      var st = [{ line: '5-10', r: 1, t: 5, ph: 'call', cap: 'printAreas(myCircle, n): c gets a copy of the <b>reference</b> (same object); times gets a copy of the <b>value</b> 5.', out: 'Radius \t\tArea' }];
      for (var i = 1; i <= 5; i++) st.push({ line: '21-23', r: i + 1, t: 5 - i, ph: 'loop', cap: 'Print radius ' + jd(i) + ' and its area, then setRadius(' + jd(i + 1) + ') on the shared object, and times-- (only the copy).', out: jd(i) + '\t\t' + jd(area(i)) });
      st.push({ line: '13-14', r: 6, t: 0, ph: 'back', cap: 'Back in main: the radius of myCircle <b>is</b> 6.0 (the object was changed), but n is still 5 (only the copy times changed).', out: ['', 'Radius is 6.0', 'n is 5'] });
      return st;
    })(),
    draw: function (k, s) {
      var items = [ref('m', 20, 40, 'Circle myCircle', {}), vbox('n', 20, 120, 120, 'n', 'int', 5, s.ph === 'back' ? hot({ tone: 'teal' }) : {})];
      items.push(A('a1', 144, 62, 296, 150, { tone: 'blue' }));
      items.push(obj('o', 300, 130, 180, ': Circle', [{ t: 'radius = ' + jd(s.r), b: true, tone: 'accent' }], { tone: 'accent', hi: s.ph === 'loop' || s.ph === 'back' }));
      if (s.ph !== 'back') {
        items.push(ref('c', 20, 220, 'Circle c (parameter)', { tone: 'accent' }), A('a2', 144, 242, 296, 170, { tone: 'accent' }));
        items.push(vbox('t', 160, 270, 120, 'times', 'int', s.t, s.ph === 'loop' ? hot() : {}));
      }
      return items;
    }
  };

  /* ---------- 18. arrays of objects (slides 57-59) ---------- */
  var TA = 'public static Circle[] createCircleArray() {\n  // Create an Array of 5 Circle references\n  Circle[] circleArray = new Circle[5];\n  for (int i = 0; i < circleArray.length; i++) {\n    // Create a Circle object with random radius\n    circleArray[i] = new Circle(Math.random() * 100);\n  }\n  return circleArray;\n}\n\npublic static double sum(Circle[] circleArray) {\n  double sum = 0;\n  for (int i = 0; i < circleArray.length; i++)\n    sum += circleArray[i].getArea();\n  return sum;\n}';
  var objarray = {
    id: 'objarray', slides: [57, 59], title: 'An array of references to objects', code: TA,
    steps: function () {
      var r = [0, 1, 2, 3, 4].map(function () { return Math.random() * 100; }), tot = 0; r.forEach(function (x) { tot += area(x); });
      return [
        { slide: 57, line: 3, ph: 'null', r: r, cap: '<code>new Circle[5]</code> creates an array of 5 <b>references</b>, all null. No Circle object exists yet!' },
        { slide: 58, line: '4-7', ph: 'fill', r: r, cap: 'The loop creates a Circle object for each element, with a random radius.' },
        { slide: 57, line: 14, ph: 'two', r: r, cap: '<code>circleArray[1].getArea()</code> uses <b>two</b> references: circleArray to reach the array, then circleArray[1] to reach Circle object 1.' },
        { slide: 59, line: '11-15', ph: 'sum', r: r, tot: tot, cap: 'sum adds the areas of all the circles. printCircleArray prints a table with printf (%-30f: a double in 30 places, left-justified).', out: [padR('Radius', 30) + 'Area'].concat(r.map(function (x) { return padR(jfix(x, 6), 30) + jfix(area(x), 6); }), ['---------------------------------------------', padR('The total area of circles is', 30) + jfix(tot, 6)]) }
      ];
    },
    draw: function (k, s) {
      var items = [ref('ca', 20, 130, 'circleArray', {}), A('a', 144, 152, 176, 152, { tone: 'blue' })];
      s.r.forEach(function (x, i) {
        var y = 30 + i * 56;
        items.push(B('c' + i, 180, y, 110, 44, { title: s.ph === 'null' ? 'null' : '●', mono: true, size: 14, tone: s.ph === 'two' && i === 1 ? 'accent' : s.ph === 'null' ? 'muted' : 'blue', dash: s.ph === 'null', r: 2 }));
        items.push(T('ci' + i, 172, y + 27, '[' + i + ']', { anchor: 'end', mono: true, size: 11, tone: 'muted' }));
        if (s.ph !== 'null') {
          items.push(A('r' + i, 290, y + 22, 346, y + 22, { tone: s.ph === 'two' && i === 1 ? 'accent' : 'blue' }));
          items.push(obj('o' + i, 350, y, 190, 'Circle object ' + i, ['radius = ' + x.toFixed(2) + '…'], { tone: s.ph === 'two' && i === 1 ? 'accent' : 'teal', hi: s.ph === 'two' && i === 1 }));
        }
      });
      return items;
    }
  };

  /* ---------- 19. immutable or not? (slides 60-62) ---------- */
  var IMM = 'public class Test {\n  public static void main(String[] args) {\n    Student student = new Student(111223333, "John");\n    java.util.Date dateCreated = student.getDateCreated();\n    dateCreated.setTime(200000); // Now dateCreated field is changed!\n  }\n}';
  var immutable = {
    id: 'immutable', slides: [60, 62], title: 'Private fields are not enough', code: IMM,
    steps: [
      { slide: 60, ph: 'def', cap: 'An <b>immutable</b> object cannot be changed after it is created. Circle without setRadius would be immutable: radius is private and nothing can change it.' },
      { slide: 61, line: 3, ph: 'new', cap: 'Student has only private fields and no set methods: id, name, and dateCreated (a reference to a Date object).' },
      { slide: 62, line: 4, ph: 'get', cap: 'But <code>getDateCreated()</code> returns the <b>reference</b> to the Date object inside the student. Now main has a second way to reach it.' },
      { slide: 62, line: 5, ph: 'set', cap: '<code>dateCreated.setTime(200000)</code> changes that Date object, so the student’s data changed: Student is <b>mutable</b>. To be immutable, a class needs all fields private, no mutators, and no accessor that returns a reference to a mutable field.' }
    ],
    draw: function (k, s) {
      if (s.ph === 'def') return [B('d', 120, 60, 320, 120, { lines: ['all data fields private', 'no mutator (set) methods', 'no getter that returns a', '  reference to a mutable field'], mono: true, lsize: 13, tag: 'immutable class', tone: 'teal' })];
      var items = [ref('s', 20, 40, 'Student student', {}), A('a', 144, 62, 216, 62, { tone: 'blue' })];
      items.push(obj('o', 220, 30, 180, ': Student', ['id = 111223333', 'name = "John"', 'dateCreated: ●'], { tone: 'blue' }));
      items.push(A('dc', 400, 102, 436, 200, { tone: 'blue' }));
      items.push(obj('d', 380, 204, 160, ': Date', [{ t: s.ph === 'set' ? 'time = 200000' : 'time = now', b: s.ph === 'set', tone: s.ph === 'set' ? 'accent' : undefined }], { tone: s.ph === 'set' ? 'accent' : 'teal', hi: s.ph === 'set' }));
      if (s.ph === 'get' || s.ph === 'set') items.push(ref('dv', 20, 220, 'Date dateCreated', { tone: 'accent', hi: s.ph === 'get' }), A('a2', 144, 242, 376, 228, { tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 20. scope of data fields, and this (slides 63-66) ---------- */
  var THIS = 'public class Circle {\n  private double radius;\n\n  public Circle(double radius) {\n    this.radius = radius;\n  }\n\n  public Circle() {\n    this(1.0);\n  }\n\n  public void setRadius(double radius) {\n    this.radius = radius;\n  }\n}';
  var thisv = {
    id: 'thisv', slides: [63, 66], title: 'this: the object itself', code: THIS,
    steps: [
      { slide: 63, line: 2, ph: 'scope', cap: 'The scope of instance and static variables is the <b>whole class</b>, wherever they are declared. A local variable starts at its declaration, and must be given a value before it is used.' },
      { slide: 64, ph: 'this', cap: '<b>this</b> is a reference to the object itself. Two common uses: to reach a data field that a parameter hides, and to call another constructor.' },
      { slide: 65, line: '12-13', ph: 'ok', cap: 'The parameter radius <b>hides</b> the field radius. <code>this.radius</code> means “the radius field of this object”; plain radius means the parameter.' },
      { slide: 65, ph: 'wrong', cap: 'Wrong: <code>radius = radius;</code> assigns the parameter to itself. The field is never changed.' },
      { slide: 66, line: '8-10', ph: 'call', cap: '<code>this(1.0);</code> inside a constructor calls the <b>other</b> constructor, Circle(double radius), with 1.0.' }
    ],
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'scope' || s.ph === 'this') {
        items.push(B('cls', 60, 30, 440, 150, { tag: 'class Circle', fill: 'none', tone: 'blue', z: 0 }));
        items.push(B('f', 80, 60, 180, 44, { title: 'private double radius', mono: true, size: 12, tone: 'teal', hi: s.ph === 'scope' }));
        items.push(T('fs', 280, 88, s.ph === 'scope' ? '← visible in the whole class' : '', { size: 12.5, bold: true, tone: 'teal' }));
        if (s.ph === 'this') items.push(T('th', 280, 140, 'this → the current object', { anchor: 'middle', mono: true, size: 15, bold: true, tone: 'accent' }));
        return items;
      }
      if (s.ph === 'call') {
        items.push(B('c0', 40, 40, 220, 70, { lines: ['public Circle() {', '  this(1.0);', '}'], mono: true, lsize: 12.5, tone: 'accent', hi: true }));
        items.push(B('c1', 300, 160, 240, 70, { lines: ['public Circle(double radius) {', '  this.radius = radius;', '}'], mono: true, lsize: 12, tone: 'teal' }));
        items.push(A('ca', 200, 114, 300, 170, { tone: 'accent', label: 'calls with 1.0', la: 'start', lx: 10 }));
        return items;
      }
      var ok = s.ph === 'ok';
      items.push(obj('o', 330, 40, 200, ': Circle', [{ t: 'radius = ' + (ok ? '7.5' : '1.0'), b: true, tone: ok ? 'accent' : 'red' }], { tone: ok ? 'teal' : 'red', hi: true }));
      items.push(vbox('p', 30, 160, 200, 'radius (parameter)', 'double', 7.5, {}));
      items.push(B('st', 30, 50, 240, 44, { title: ok ? 'this.radius = radius;' : 'radius = radius;   // Wrong!', mono: true, size: 13, tone: ok ? 'accent' : 'red', hi: true }));
      if (ok) items.push(A('w', 234, 184, 326, 74, { tone: 'accent', label: 'into the field' }));
      else items.push(A('w', 130, 156, 130, 98, { tone: 'red', bend: 40, label: 'into itself' }));
      return items;
    }
  };

  var ALL = [gui, oop, circlecls, testcircle, tv, ctor, refs, dot, primref, defaults, date, random, point2d, staticv, visibility, encaps, passobj, objarray, immutable, thisv];

  var para = function (t) { return { type: 'paragraph', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; },
    code = function (t, lang) { return lang ? { type: 'code', text: t, lang: lang } : { type: 'code', text: t }; }, note = function (t) { return { type: 'note', text: t }; };
  function braces(c) { var o = (c.match(/\{/g) || []).length, z = (c.match(/\}/g) || []).length; return o >= 2 && o === z; }
  function tbl(head, rows) { return { type: 'html', html: '<div class="tblwrap"><table><tr>' + head.map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr>' + rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table></div>' }; }
  var OUT = ['OO Programming Concepts: Classes and Objects', 'Example classes and methods, UML Class Diagram', 'Constructors, Default constructor', 'Object reference variables, Access dot (.) operator', 'Primitive data versus Object types, Garbage collection', 'Reference data fields, default value of a data field', 'Java library classes: Date, Random, and Point2D', 'Instance versus static variables and methods', 'Visibility modifiers, accessor and mutator methods', 'Passing objects, Array of objects, the keyword this'];
  function outline(title, from, ex) { return { image: false, title: title, blocks: OUT.map(function (t, i) { return { type: 'bullet', html: i >= from && i < from + 2 ? '<b>' + t + '</b>' : t, level: 0 }; }), explain: ex }; }
  var TVC = 'public class TV {\n  int channel = 1;      // Default channel is 1\n  int volumeLevel = 1;  // Default volume level is 1\n  boolean on = false;   // TV is off\n\n  public TV() { }\n\n  public void turnOn() { on = true; }\n\n  public void turnOff() { on = false; }\n\n  public void setChannel(int newChannel) {\n    if (on && newChannel>=1 && newChannel<=120) channel = newChannel;\n  }\n\n  public void setVolume(int newVolume) {\n    if (on && newVolume >= 1 && newVolume <= 7) volumeLevel = newVolume;\n  }';
  var CSM = 'public class CircleSM {\n  double radius;\n  static int numberOfObjects = 0;\n\n  // Construct a circle with radius 1\n  CircleSM() {\n    radius = 1;\n    numberOfObjects++;\n  }\n\n  // Construct a circle with newRadius\n  CircleSM(double newRadius) {\n    radius = newRadius;\n    numberOfObjects++;\n  }\n\n  // Return numberOfObjects\n  static int getNumberOfObjects() {\n    return numberOfObjects;\n  }\n\n  // Return the area of this circle\n  double getArea() {\n    return radius * radius * Math.PI;\n  }\n}';
  var CPD = 'public class Circle {\n  private double radius = 1;               // private radius\n  private static int numberOfObjects = 0;  // objects created\n\n  public Circle() { numberOfObjects++; }   // default radius = 1\n\n  public Circle(double newRadius) {\n    setRadius(newRadius);\n    numberOfObjects++;\n  }\n\n  public double getRadius() { return radius; }\n\n  public void setRadius(double newRadius) {\n    radius = (newRadius >= 0) ? newRadius : 0;\n  }\n\n  public static int getNumberOfObjects() { return numberOfObjects; }\n\n  public double getArea() { return radius * radius * Math.PI; }\n}';
  var STU = 'public class Student {\n  private int id;\n  private String name;\n  private java.util.Date dateCreated;\n\n  public Student(int ssn, String newName) {\n    id = ssn;\n    name = newName;\n    dateCreated = new java.util.Date();\n  }\n\n  public int getId() {\n    return id;\n  }\n\n  public String getName() {\n    return name;\n  }\n\n  public java.util.Date getDateCreated() {\n    return dateCreated;\n  }\n}';

  addUnit({
    course: 'cs2', lesson: '02-objects-and-classes',
    blurb: 'Build your own types: classes as templates, objects with state and behavior, constructors, references, static members, private data with get and set, and the keyword this.',
    parts: [
      {
        title: 'Classes and objects', from: 1, to: 12,
        quiz: [
          { q: 'What defines the <b>state</b> of an object?', options: ['Its data fields and their current values', 'Its methods', 'Its class name'], answer: 0, why: 'Behavior is defined by methods (slide 3).' },
          { q: 'What is a class?', options: ['A template that defines objects of the same type', 'One object', 'A method'], answer: 0, why: 'Slides 4-5.' },
          { type: 'output', q: 'With the Circle class of slide 6, what does this print?', code: 'Circle c = new Circle();\nSystem.out.println(c.radius);', answer: '1.0', why: 'The no-arg constructor keeps radius = 1, a double.' },
          { type: 'output', q: 'With the TV class, what does this print?', code: 'TV t = new TV();\nt.setChannel(30);\nSystem.out.println(t.channel);', answer: '1', why: 'The TV is off, so setChannel does nothing (slide 10).' },
          { q: 'In a UML class diagram, what does <code>getArea(): double</code> show?', options: ['A method getArea that returns a double', 'A field named double', 'A constructor'], answer: 0, why: 'The type comes after the colon (slide 7).' },
          { type: 'output', q: 'What does this print?', code: 'TV tv2 = new TV();\ntv2.turnOn();\ntv2.channelUp();\ntv2.channelUp();\nSystem.out.println(tv2.channel);', answer: '3', why: '1 → 2 → 3 (slide 12).' }
        ]
      },
      {
        title: 'Constructors and reference variables', from: 13, to: 26,
        quiz: [
          { q: 'Which is true about constructors?', options: ['Same name as the class, no return type', 'They must return void', 'They are called with the dot operator'], answer: 0, why: 'Slide 14.' },
          { q: 'When does Java give a class a default constructor?', options: ['Only when the class has no constructors at all', 'Always', 'Never'], answer: 0, why: 'Slide 16.' },
          { type: 'output', q: 'What does this print?', code: 'Circle a = new Circle(5.0);\nCircle b = new Circle();\nb.radius = 100;\nSystem.out.println(a.radius + " " + b.radius);', answer: '5.0 100.0', why: 'Two objects; changing b does not change a (slides 18-24).' },
          { q: 'What does a reference variable hold?', options: ['A reference to an object', 'The object itself', 'Always null'], answer: 0, why: 'Slide 20.' },
          { q: 'Why can you not write <code>Circle.getArea()</code>?', options: ['getArea is non-static: it needs an object', 'getArea is private', 'Circle has no getArea'], answer: 0, why: 'Slide 26: only static methods are called with the class name.' }
        ]
      },
      {
        title: 'Primitive and object variables', from: 27, to: 33,
        quiz: [
          { type: 'output', q: 'What does this print?', code: 'Circle c1 = new Circle(5);\nCircle c2 = new Circle(9);\nc1 = c2;\nc2.radius = 1;\nSystem.out.println(c1.radius);', answer: '1.0', why: 'After c1 = c2 both refer to the same object (slide 29).' },
          { q: 'After <code>c1 = c2</code>, what happens to the object c1 referred to before?', options: ['It is garbage and the JVM collects it', 'It is copied into c2', 'It becomes null'], answer: 0, why: 'Slide 30.' },
          { type: 'output', q: 'A Student object has <code>String name;</code> and <code>int age;</code> with no values given. What does this print?', code: 'Student s = new Student();\nSystem.out.println(s.name + " " + s.age);', answer: 'null 0', why: 'Default values: null for references, 0 for numbers (slide 32).' },
          { type: 'tf', q: 'A local variable inside a method gets a default value.', answer: false, why: 'Slide 33: using it before giving it a value is a compile error.' }
        ]
      },
      {
        title: 'Java library classes', from: 34, to: 40,
        quiz: [
          { q: 'What does <code>new java.util.Date().getTime()</code> return?', options: ['Milliseconds since January 1, 1970, GMT', 'The time as a String', 'Seconds since today'], answer: 0, why: 'Slide 35.' },
          { q: 'Two Random objects are created with the same seed. Their sequences are…', options: ['identical', 'different', 'empty'], answer: 0, why: 'Slide 38.' },
          { q: 'What can <code>random.nextInt(1000)</code> return?', options: ['0 to 999', '1 to 1000', '0 to 1000'], answer: 0, why: 'n is excluded (slide 37).' },
          { type: 'output', q: 'With Point2D, what does this print?', code: 'Point2D p1 = new Point2D(0, 0);\nPoint2D p2 = new Point2D(3, 4);\nSystem.out.println(p1.distance(p2));', answer: '5.0', why: 'The square root of 3² + 4².' }
        ]
      },
      {
        title: 'Static members', from: 41, to: 46,
        quiz: [
          { type: 'output', q: 'With CircleSM of slide 44, what does this print?', code: 'CircleSM a = new CircleSM();\nCircleSM b = new CircleSM(5);\nCircleSM c = new CircleSM(2);\nSystem.out.println(a.numberOfObjects);', answer: '3', why: 'One shared variable; each constructor adds 1.' },
          { q: 'Which of these can a static method do?', options: ['Use a static data field', 'Use an instance data field', 'Call an instance method directly'], answer: 0, why: 'Slide 43: a static method has no object.' },
          { q: 'How are static members shown in UML?', options: ['Underlined', 'In capital letters', 'With a + sign'], answer: 0, why: 'Slide 46. The + means public.' },
          { type: 'tf', q: 'Each CircleSM object has its own copy of numberOfObjects.', answer: false, why: 'Static variables are shared by all instances (slide 42).' }
        ]
      },
      {
        title: 'Visibility and encapsulation', from: 47, to: 54,
        quiz: [
          { q: 'Who can use a <b>private</b> member?', options: ['Only its own class', 'Classes in the same package', 'Everyone'], answer: 0, why: 'Slide 48.' },
          { q: 'C1 (package p1) has <code>int y;</code> with no modifier. Can C3 in package p2 use <code>o.y</code>?', options: ['No', 'Yes'], answer: 0, why: 'No modifier means: only the same package (slide 49).' },
          { q: 'Why should data fields be private?', options: ['To protect the data and make the code easy to maintain', 'To make the program faster', 'Because Java requires it'], answer: 0, why: 'Slide 50.' },
          { type: 'output', q: 'With the Circle of slide 53, what does this print?', code: 'Circle c = new Circle(-4);\nSystem.out.println(c.getRadius());', answer: '0.0', why: 'setRadius turns a negative value into 0.' },
          { q: 'In UML, what does the <b>-</b> sign mean?', options: ['private', 'public', 'static'], answer: 0, why: 'Slide 52.' }
        ]
      },
      {
        title: 'Objects in methods and arrays', from: 55, to: 62,
        quiz: [
          { type: 'output', q: 'What does this print?', code: 'public static void grow(Circle c, int n) {\n  c.setRadius(c.getRadius() + 1);\n  n++;\n}\n// in main:\nCircle k = new Circle(1);\nint n = 1;\ngrow(k, n);\nSystem.out.println(k.getRadius() + " " + n);', answer: '2.0 1', why: 'The object is shared; the int is a copy (slide 56).' },
          { q: 'What does <code>new Circle[10]</code> create?', options: ['An array of 10 null references', '10 Circle objects', 'One Circle with radius 10'], answer: 0, why: 'An array of objects is an array of references (slide 57).' },
          { q: 'Why is the Student class of slide 61 mutable?', options: ['getDateCreated returns a reference to its Date object', 'Its fields are public', 'It has a set method'], answer: 0, why: 'Slide 62.' }
        ]
      },
      {
        title: 'Scope and this', from: 63, to: 66,
        quiz: [
          { q: 'What is the scope of a data field?', options: ['The whole class', 'From its declaration to the end of the method', 'Only the constructor'], answer: 0, why: 'Slide 63.' },
          { type: 'output', q: 'What does this print?', code: 'public class Box {\n  private int size = 1;\n  public void setSize(int size) {\n    size = size;\n  }\n  public int getSize() { return size; }\n}\n// in main:\nBox b = new Box();\nb.setSize(9);\nSystem.out.println(b.getSize());', answer: '1', why: '<code>size = size;</code> assigns the parameter to itself. It should be <code>this.size = size;</code> (slide 65).' },
          { q: 'What does <code>this(1.0);</code> do inside a constructor?', options: ['Calls another constructor of the same class', 'Creates a new object', 'Returns 1.0'], answer: 0, why: 'Slide 66.' }
        ]
      }
    ],
    slides: {
      1: { image: false, blocks: [para('In the Computer Science I course, you learned how to solve programming problems using selections, loops, methods, and arrays. However, these Java features are not sufficient for developing large-scale software systems. Suppose you want to develop a graphical user interface as shown below. How do you program it? We will learn how to do it in this course.')],
        explain: '<p>Big programs need a better way to organize code: <b>{{objects|كائنات}}</b>. The window below the text is made of objects.</p>' },
      2: outline('Outline', -1, '<p>The plan of this unit.</p>'),
      3: { image: false, blocks: [bul('Object-oriented programming (OOP) involves programming using objects.'), bul('An object represents an entity in the real world. For example, a student, a desk, a circle, a button, and even a loan can all be viewed as objects.'), bul('An object has a unique identity, state, and behaviors.'), bul('The state of an object consists of a set of data fields (also known as properties) with their current values.'), bul('The behavior of an object is defined by a set of methods.')],
        explain: '<p>An <b>{{entity|كيان / شيء}}</b> is anything you can name. Its <b>{{state|الحالة}}</b> is what it knows (data fields); its <b>{{behavior|السلوك}}</b> is what it can do (methods).</p>' },
      4: { image: false, blocks: [bul('An object has both a state and behavior.'), bul('The state defines the object, and the behavior defines what the object does.')],
        explain: '<p>The class is the <b>{{template|قالب}}</b>; the objects are made from it, each with its own values.</p>' },
      5: { image: false, blocks: [bul('Classes are constructs that define objects of the same type.'), bul('A Java class uses variables to define data fields and methods to define behaviors.'), bul('Additionally, a class provides a special type of methods, known as constructors, which are invoked to construct objects from the class.')],
        explain: '<p>A <b>{{constructor|المُنشئ}}</b> is a special method that builds an object.</p>' },
      6: { image: false, title: 'class Circle', blocks: [code(CIRC)],
        explain: '<p>Data field, constructors, methods: the three parts of a class. The arrows on the slide name each part.</p>' },
      7: { image: false, blocks: [para('Classes and objects can be represented using UML notation.')],
        explain: '<p><b>{{UML|لغة رسم موحّدة لتصميم البرامج}}</b> is a standard way to draw classes and objects. The drawing shows the Circle diagram.</p>' },
      8: { image: false, title: 'Creating Objects and Testing the class Circle', blocks: [code(TC)],
        explain: '<p>Each <code>new</code> makes a separate object. The dot reaches the fields and methods of one object.</p>' },
      9: { image: false, title: 'Example: TV Class Diagram', blocks: [para('The TV class models TV sets.')],
        explain: '<p>The diagram lists the state (channel, volumeLevel, on) and the behavior of a TV. The + sign means <b>public</b>.</p>' },
      10: { image: false, title: 'TV Class', blocks: [code(TVC)],
        explain: '<p>The set methods <b>check</b> the value first: a channel must be 1 to 120 and the TV must be on. This keeps the object’s state valid.</p>' },
      11: { image: false, title: 'TV Class – cont\'d', blocks: [code('  public void channelUp() {\n    if (on && channel < 120) channel++;\n  }\n\n  public void channelDown() {\n    if (on && channel > 1) channel--;\n  }\n\n  public void volumeUp() {\n    if (on && volumeLevel < 7) volumeLevel++;\n  }\n\n  public void volumeDown() {\n    if (on && volumeLevel > 1) volumeLevel--;\n  }\n}')],
        explain: '<p>The up and down methods also stay inside the limits.</p>' },
      12: { image: false, title: 'TestTV Class', blocks: [code(TTV({ c: 30, vl: 3 }))],
        explain: '<p>Two TV objects live side by side, each with its own channel and volume.</p>' },
      13: outline('Next . . .', 2, '<p>Next: constructors and reference variables.</p>'),
      14: { image: false, blocks: [bul('Constructors are a special kind of methods that are invoked to construct objects.'), bul('Constructors must have the same name as the class itself.'), bul('Constructors do not have a return type – not even void.'), bul('Constructors are invoked using the new operator when an object is created. They play the role of initializing objects.'), bul('A constructor with no parameters is referred to as a no-arg constructor.')],
        explain: '<p>To <b>{{initialize|يهيّئ: يعطي القيم الأولى}}</b> an object is to give its fields their first values. That is the job of the constructor.</p>' },
      15: { image: false, blocks: [code('// no-arg Circle constructor\nCircle() {\n}'), code('// Circle constructor with one argument\nCircle(double newRadius) {\n  radius = newRadius;\n}'), code('// Using the new operator to Create an Object\nnew ClassName();', 'none'), para('Examples:'), code('new Circle();\nnew Circle(5.0);')],
        explain: '<p>Two constructors with different parameter lists: they are <b>overloaded</b>, like the methods of CS I unit 7.</p>' },
      16: { image: false, blocks: [bul('A class may be defined without constructors.'), para('In this case, a no-arg constructor with an empty body is implicitly defined in the class.'), bul('This constructor, called a default constructor, is provided automatically only if no constructors are explicitly defined in the class.')],
        explain: '<p><b>{{Implicitly|ضمنياً: تلقائياً دون أن تكتبه}}</b>: Java adds it for you, but only when you wrote no constructor.</p>' },
      17: { image: false, title: 'Declaring Reference Variables and Creating Objects in a Single Step', blocks: [bul('To declare a reference variable, use the syntax:'), code('ClassName objectRefVar;', 'none'), bul('Example:'), code('Circle myCircle;'), bul('To declare a reference variable and create an object, write:'), code('ClassName objectRefVar = new ClassName();', 'none'), bul('Example:'), code('Circle myCircle = new Circle();')],
        explain: '<p>The right side creates an object; the = assigns its reference to the variable.</p>' },
      18: { image: false, title: 'Trace Code', blocks: [note('Declare'), code(REFS)], explain: '<p>myCircle exists, but refers to nothing yet.</p>' },
      19: { image: false, title: 'Trace Code', blocks: [note('Create a Circle object'), code(REFS)], explain: '<p>The object is made somewhere in memory.</p>' },
      20: { image: false, title: 'Trace Code', blocks: [note('Assign object reference to myCircle'), code(REFS)], explain: '<p>Now myCircle points to the object.</p>' },
      21: { image: false, title: 'Trace Code', blocks: [note('Declare yourCircle'), code(REFS)], explain: '<p>A second reference variable.</p>' },
      22: { image: false, title: 'Trace Code', blocks: [note('Create a new Circle object'), code(REFS)], explain: '<p>The no-arg constructor: radius = 1.0.</p>' },
      23: { image: false, title: 'Trace Code', blocks: [note('Assign object reference to yourCircle'), code(REFS)], explain: '<p>Two variables, two objects.</p>' },
      24: { image: false, title: 'Trace Code', blocks: [note('Change radius in yourCircle'), code(REFS)], explain: '<p>The change happens in the object that yourCircle refers to.</p>' },
      25: { image: false, title: 'Accessing Object’s Members', blocks: [bul('Referencing object’s data using the dot operator:'), code('objectRefVar.data\nExample: myCircle.radius', 'none'), bul('Invoking object’s method using the dot operator:'), code('objectRefVar.methodName(arguments)\nExample: myCircle.getArea()', 'none')],
        explain: '<p>The <b>{{dot operator|عامل النقطة}}</b> means “the member of this object”.</p>' },
      26: { image: false, blocks: [bul('Recall that you use: Math.methodName(arguments); to invoke a method in the Math class.'), code('Example: Math.pow(3, 2.5);', 'none'), bul('Can you invoke getArea() using Circle.getArea()?'), para('The answer is no. All the methods used in Math are static, which are defined using the static keyword.'), bul('However, getArea() is non-static. It must be invoked from an object using: objectRefVar.getArea(arguments);'), code('Example: myCircle.getArea();', 'none')],
        explain: '<p>A <b>{{non-static|غير ثابت: تابع لكائن}}</b> method works on the data of one object, so it needs that object.</p>' },
      27: outline('Next . . .', 4, '<p>Next: primitive and object variables.</p>'),
      28: { image: false, blocks: [bul('Every variable represents a memory location that holds a value.'), bul('When you declare a variable, you are telling the compiler what type of value the variable can hold.'), bul('A variable of a primitive type holds a value of the primitive type, and a variable of a reference type holds a reference to where an object is stored in memory.')],
        explain: '<p>int, double, char and boolean are <b>{{primitive|بدائي}}</b> types. A class type is a reference type.</p>' },
      29: { image: false, title: 'Copying Variables of Primitive Data Types and Object Types', blocks: [code('i = j;      // primitive type assignment\nc1 = c2;    // object type assignment', 'none'), para('Reference variable c2 is copied to variable c1.')],
        explain: '<p>= always copies the content of the variable. For an int that is the number; for an object variable that is the reference.</p>' },
      30: { image: false, title: 'Garbage Collection and the null value', blocks: [bul('As shown in the previous figure, after the assignment c1 = c2, c1 points to the same object referenced by c2.'), bul('The object previously referenced by c1 is no longer referenced. This object is known as garbage. Garbage is automatically collected by the Java Virtual Machine.'), bul('If you know that an object is no longer needed, you can explicitly assign null to a reference variable for the object. The JVM will automatically collect the space if the object is not referenced by any variable.'), bul('The null value means referencing nothing in memory.')],
        explain: '<p><b>{{Garbage collection|جمع المهملات: تحرير الذاكرة تلقائياً}}</b>: the JVM frees objects that nothing refers to. <b>{{null|لا شيء}}</b> is the value of a reference that refers to no object.</p>' },
      31: { image: false, blocks: [bul('The data fields can be of reference types.'), bul('For example, the following Student class contains a data field name of the String type, which is a reference type.'), bul('However, int, boolean, and char are primitive types.'), code("public class Student {\n  String name;           // default value is null\n  int age;               // default value is 0\n  boolean isScienceMajor; // default value is false\n  char gender;           // default value is '\\u0000'\n}")],
        explain: '<p>A field can hold a reference to another object, like a String.</p>' },
      32: { image: false, blocks: [bul('The default value of a data field is null for a reference type'), bul('The default value is 0 for a numeric type'), bul('The default value is false for a boolean type'), bul("The default value is '\\u0000' for a char type."), bul('Java assigns no default value to a local variable inside a method.'), code(TS)],
        explain: '<p>Fields get default values; local variables do not.</p>' },
      33: { image: false, blocks: [bul('Java assigns no default value to a local variable inside a method.'), code('public class Test {\n  public static void main(String[] args) {\n    int x; // x has no default value\n    String y; // y has no default value\n    System.out.println("x is " + x);\n    System.out.println("y is " + y);\n  }\n}'), note('Compiler error: variables must be initialized')],
        explain: '<p>The compiler refuses to use a local variable that may have no value.</p>' },
      34: outline('Next . . .', 6, '<p>Next: some classes that come with Java.</p>'),
      35: { image: false, blocks: [bul('Java provides a system-independent encapsulation of date and time in the java.util.Date class.'), bul('You can use the Date class to create an instance for the current date and time and use its toString method to return the date and time as a string.')],
        explain: '<p><b>{{System-independent|مستقل عن نظام التشغيل}}</b>: the same code works on any computer.</p>' },
      36: { image: false, blocks: [bul('For example, the following statement creates a Date object:'), code('java.util.Date date = new java.util.Date();'), bul('The following statement'), code('System.out.println(date.toString());'), bul('Displays a string like:'), code('Sun Aug 25 13:50:19 AST 2024.', 'none')],
        explain: '<p>You use classes from the Java library the same way as your own: new, then the dot.</p>' },
      37: { image: false, blocks: [bul('You have used Math.random() to obtain a random double value between 0.0 and 1.0 (excluding 1.0).'), bul('A more useful random number generator is provided in the java.util.Random class.')],
        explain: '<p>A Random object can give ints, doubles, booleans, …</p>' },
      38: { image: false, blocks: [bul('If two Random objects have the same seed, they will generate identical sequences of numbers.'), bul('For example, the following code creates two Random objects with the same seed 3.'), code(RND({ s: 3 })), code('From random1: 734 660 210 581 128 202 549 564 459 961\nFrom random2: 734 660 210 581 128 202 549 564 459 961', 'none')],
        explain: '<p>The <b>{{seed|البذرة: القيمة التي يبدأ منها التوليد}}</b> decides the whole sequence. The same seed is useful for testing, because the “random” numbers repeat.</p>' },
      39: { image: false, blocks: [bul('Java API has a conveninent Point2D class in the javafx.geometry package for representing a point in a two-dimensional plane.')],
        explain: '<p>Point2D is part of <b>JavaFX</b>, Java’s library for graphics. (The slide writes “conveninent”: convenient.)</p>' },
      40: { image: false, title: 'TestPoint2D class', blocks: [code('import java.util.Scanner;\nimport javafx.geometry.Point2D;\n\npublic class TestPoint2D {\n  public static void main(String[] args) {\n    Scanner input = new Scanner(System.in);\n    System.out.print("Enter point1\'s x-, y-coordinates: ");\n    double x1 = input.nextDouble();\n    double y1 = input.nextDouble();\n    System.out.print("Enter point2\'s x-, y-coordinates: ");\n    double x2 = input.nextDouble();\n    double y2 = input.nextDouble();\n\n    Point2D p1 = new Point2D(x1, y1);\n    Point2D p2 = new Point2D(x2, y2);\n    System.out.println("p1 is " + p1.toString());\n    System.out.println("p2 is " + p2.toString());\n    System.out.println("The distance between p1 and p2 is " + p1.distance(p2));\n    System.out.println("The midpoint between p1 and p2 is " +\n      p1.midpoint(p2).toString());\n  }\n}')],
        explain: '<p>The points know how to measure distance and find a midpoint: the work is inside the objects.</p>' },
      41: outline('Next . . .', 7, '<p>Next: static members.</p>'),
      42: { image: false, title: 'Instance versus Static Variables, Constants, and Methods', blocks: [bul('Instance variables belong to a specific object of a class.'), bul('Instance methods are invoked by an object of a class.'), bul('Static variables are shared by all the instances of the class.'), para('They are known as class variables.'), bul('Static methods are not tied to a specific object.'), bul('Static methods cannot access instance data fields and instance methods of the class.'), bul('Static constants are final variables shared by all the instances of the class.')],
        explain: '<p>An <b>{{instance|نسخة / كائن}}</b> variable has one copy per object; a <b>{{static|ثابت: واحد للكلاس كله}}</b> variable has one copy for the whole class. Math.PI is a static constant.</p>' },
      43: { image: false, blocks: [bul('An instance method can invoke an instance or static method. It can also access an instance or static data field.'), bul('A static method can only invoke a static method and access a static data field.'), bul('A static method cannot invoke an instance method or access an instance data field, since static methods and static data fields don’t belong to a particular object.')],
        explain: '<p>A static method runs without any object, so “this object’s radius” has no meaning inside it.</p>' },
      44: { image: false, title: 'Adding Static Variables and Methods', blocks: [para('To declare static variables and methods, use the static modifier.'), note('This example adds a static variable numberOfObjects to track the number of Circle objects created and a static method getNumberOfObjects().'), code(CSM)],
        explain: '<p>Each constructor adds 1 to the shared counter, so it always tells how many objects exist.</p>' },
      45: { image: false, title: 'Test Circle with Static Members', blocks: [code(SM)],
        explain: '<p>The counter can be read through the class name or through any object: it is the same variable.</p>' },
      46: { image: false, blocks: [bul('Static variables and methods are underlined.'), bul('Non-static variables and methods are not underlined.')],
        explain: '<p>In the slide’s picture, radius is stored in each object, but numberOfObjects is stored once and both objects point to it.</p>' },
      47: outline('Next . . .', 8, '<p>Next: visibility modifiers and encapsulation.</p>'),
      48: { image: false, title: 'Visibility Modifiers and Accessor/Mutator Methods', blocks: [bul('By default, the class, variable, or method can be accessed by any class in the same package.'), bul('public'), para('The class, data, or method is visible to any class in any package.'), bul('private'), para('The data or methods can be accessed only by the declaring class.'), bul('The get and set methods are used to read and modify private data.')],
        explain: '<p>A <b>{{package|حزمة: مجموعة كلاسات}}</b> is a group of classes. An <b>{{accessor|دالة قراءة get}}</b> reads private data; a <b>{{mutator|دالة تعديل set}}</b> changes it.</p>' },
      49: { image: false, blocks: [bul('The private modifier restricts access to within a class.'), bul('The public modifier enables unrestricted access.'), bul('The default modifier (no modifier is used) restricts access to within a package.'), code('package p1;\n\npublic class C1 {\n  public int x;\n  int y;\n  private int z;\n\n  public void m1() {\n  }\n  void m2() {\n  }\n  private void m3() {\n  }\n}')],
        explain: '<p>Follow C2 (same package) and C3 (other package) in the drawing.</p>' },
      50: { image: false, title: 'Note', blocks: [bul('Class C can access its private members, as shown in (a).'), bul('However, class Test cannot access the private members of C, as in (b).'), bul('Why data fields should be made private?'), para('To protect the data and make code easy to maintain.')],
        explain: '<p>“private” is about the <b>class</b>, not the object: code inside class C may use the private members of any C object. (The slide’s code writes <code>string</code> and <code>system</code> in small letters; in Java they must be String and System.)</p>' },
      51: { image: false, blocks: [bul('The default modifier on a class restricts access to within a package.'), bul('The public modifier enables unrestricted access across packages.')],
        explain: '<p>The same rules work for a whole class.</p>' },
      52: { image: false, blocks: [para('The Circle class encapsulates circle properties and provides getter/setter and other methods.'), note('Programs: CircleWithPrivateDataFields, TestCircleWithPrivateDataFields')],
        explain: '<p><b>{{Encapsulation|التغليف: إخفاء البيانات خلف الدوال}}</b>: the data is hidden inside the object and reached only through public methods.</p>' },
      53: { image: false, title: 'Circle with Private Data Fields', blocks: [code(CPD)],
        explain: '<p>setRadius refuses negative values. Because radius is private, no other class can skip this check.</p>' },
      54: { image: false, title: 'Test Circle with Private Data Fields', blocks: [code(ENC({ r: 5 }))],
        explain: '<p>The test uses only the public methods: getRadius, setRadius, getArea and getNumberOfObjects.</p>' },
      55: outline('Next . . .', 9, '<p>Next: objects as parameters, arrays of objects, and this.</p>'),
      56: { image: false, blocks: [para('Pass by value for primitive type'), bul('The value is passed to the parameter'), para('Pass by reference for object type'), bul('The object reference is passed'), code(TPO)],
        explain: '<p>The slide says “pass by reference” for objects. To be exact, Java passes the <b>value of the reference</b> (as in CS I): the method gets a copy of the reference, so it reaches the same object, but it cannot make main’s variable point to another object.</p>' },
      57: { image: false, blocks: [code('Circle[] circleArray = new Circle[10];'), bul('Invoking circleArray[1].getArea() involves two levels of referencing: circleArray references the entire array, and circleArray[1] references Circle object 1.'), para('An array of objects is actually an array of references to objects.')],
        explain: '<p>Creating the array does not create the circles. Each element must get its own <code>new Circle(...)</code>.</p>' },
      58: { image: false, title: 'Example: Total Area of Circles', blocks: [code('public class TotalArea {\n  public static void main(String[] args) {  // Main method\n    Circle[] circleArray;                      // Declare circleArray\n    circleArray = createCircleArray();         // Create circleArray\n    printCircleArray(circleArray);             // Print circleArray\n  }\n\n  // Create an array of Circle objects\n  public static Circle[] createCircleArray() {\n    // Create an Array of 5 Circle references\n    Circle[] circleArray = new Circle[5];\n    for (int i = 0; i < circleArray.length; i++) {\n      // Create a Circle object with random radius\n      circleArray[i] = new Circle(Math.random() * 100);\n    }\n    return circleArray;                        // Return Circle array\n  }')],
        explain: '<p>A method can return an array of objects, just like an array of numbers.</p>' },
      59: { image: false, title: 'Total Area of Circles – cont\'d', blocks: [code('  // Print an array of circles and their total area\n  public static void printCircleArray(Circle[] circleArray) {\n    System.out.printf("%-30s%-15s\\n", "Radius", "Area");\n    for (int i = 0; i < circleArray.length; i++) {\n      System.out.printf("%-30f%-15f\\n", circleArray[i].getRadius(),\n                                        circleArray[i].getArea());\n    }\n    System.out.println("---------------------------------------------");\n    // Compute and display the total area of circles\n    System.out.printf("%-30s%-15f\\n", "The total area of circles is",\n                                      sum(circleArray));\n  }\n\n  // Add the circle areas\n  public static double sum(Circle[] circleArray) {\n    double sum = 0;                              // Initialize sum\n    for (int i = 0; i < circleArray.length; i++)\n      sum += circleArray[i].getArea();           // Add area to sum\n    return sum;\n  }\n}')],
        explain: '<p>printf with widths (from CS I unit 5) makes a neat table.</p>' },
      60: { image: false, blocks: [bul('If the contents of an object cannot be changed once the object is created, the object is called immutable, and its class is called an immutable class.'), bul('If you delete the set method in the Circle class, the class would be immutable because radius is private and cannot be changed without a set method.'), bul('A class with all private data fields and without mutators is not necessarily immutable. The following class Student has all private data fields and no mutators, but it is mutable.')],
        explain: '<p><b>{{Immutable|غير قابل للتغيير}}</b> objects are safe to share, because nobody can change them. String is immutable.</p>' },
      61: { image: false, title: 'Student class has private data fields', blocks: [code(STU)],
        explain: '<p>All fields private, only get methods. But one getter returns a reference to a mutable object…</p>' },
      62: { image: false, title: 'The Student class is mutable', blocks: [bul('The dateCreated is returned using the getDateCreated() method.'), bul('This is a reference to a Date object.'), bul('Through this reference, the content for dateCreated can be changed.'), code(IMM), para('For a class to be immutable, it must meet the following requirements:'), bul('All data fields must be private.'), bul('There can’t be any mutator methods for data fields.'), bul('No accessor methods can return a reference to a data field that is mutable.')],
        explain: '<p>The reference lets outside code change the Date inside the student, so Student is <b>{{mutable|قابل للتغيير}}</b>.</p>' },
      63: { image: false, blocks: [bul('The scope of instance and static variables is the entire class.'), para('They can be declared anywhere inside a class.'), bul('The scope of a local variable starts from its declaration and continues to the end of the block that contains the variable.'), bul('A local variable must be initialized before it is used.'), bul('The compiler will generate an error message if you use a local variable without initialization.')],
        explain: '<p>Fields can be used in every method of the class; locals only in their block.</p>' },
      64: { image: false, title: 'The Keyword this', blocks: [bul('The keyword this is the name of a reference that refers to an object itself.'), bul('One common use of the keyword this is reference a class’s hidden data fields.'), bul('Another common use of the keyword this is to enable a constructor to invoke another constructor of the same class.')],
        explain: '<p>A <b>{{hidden|مخفي}}</b> field is one whose name is also used by a parameter or local variable.</p>' },
      65: { image: false, blocks: [code('private double radius;\n\npublic void setRadius(double radius) {\n  this.radius = radius;\n}'), note('(a) this.radius refers the radius data field in this object.'), code('private double radius = 1;\n\npublic void setRadius(double radius) {\n  radius = radius;   // Wrong!\n}'), note('(b) radius is the parameter defined in the method header.')],
        explain: '<p>When a parameter has the same name as a field, the plain name means the parameter. Use <code>this.</code> for the field.</p>' },
      66: { image: false, title: 'Calling Overloaded Constructor', blocks: [code('public class Circle {\n  private double radius;\n\n  public Circle(double radius) {\n    this.radius = radius;\n  }\n\n  public Circle() {\n    this(1.0);\n  }\n  . . .\n}')],
        explain: '<p><code>this(…)</code> lets one constructor reuse another, so the setup code is written once.</p>' }
    },
    visuals: ALL,
    exam: {
      questions: [
        { q: 'An object’s behavior is defined by…', options: ['its methods', 'its data fields', 'its constructor only'], answer: 0, review: 3, why: 'Slide 3.' },
        { type: 'output', q: 'What does this print?', code: 'Circle a = new Circle(2);\nCircle b = new Circle();\nSystem.out.println(a.radius + b.radius);', answer: '3.0', review: 8, why: '2.0 + 1.0.' },
        { type: 'output', q: 'With the TV class, what does this print?', code: 'TV t = new TV();\nt.turnOn();\nt.setVolume(9);\nt.volumeUp();\nSystem.out.println(t.volumeLevel);', answer: '2', review: 10, why: '9 is out of range, so the volume stays 1; volumeUp makes it 2.' },
        { q: 'Which line is a correct constructor of class Box?', options: ['public Box(int s) { size = s; }', 'public void Box(int s) { size = s; }', 'public int Box() { return 0; }'], answer: 0, review: 14, why: 'No return type at all, not even void.' },
        { q: 'Class Box has only <code>Box(int s)</code>. What about <code>new Box()</code>?', options: ['Compile error: no default constructor is added', 'It works with s = 0', 'It works with s = 1'], answer: 0, review: 16, why: 'The default constructor exists only if no constructor is written.' },
        { type: 'output', q: 'What does this print?', code: 'Circle x = new Circle(3);\nCircle y = x;\ny.radius = 7;\nSystem.out.println(x.radius);', answer: '7.0', review: 29, why: 'x and y refer to the same object.' },
        { q: 'What is garbage in Java?', options: ['An object that no variable refers to', 'A variable set to 0', 'A compile error'], answer: 0, review: 30, why: 'The JVM collects it.' },
        { type: 'output', q: 'What does this print?', code: 'class P { String s; int n; boolean b; }\n// in main:\nP p = new P();\nSystem.out.println(p.s + " " + p.n + " " + p.b);', answer: 'null 0 false', review: 32, why: 'Default values of fields.' },
        { q: 'What does <code>new Random(7)</code> guarantee?', options: ['The same sequence every time it is created with seed 7', 'Numbers up to 7', 'Seven numbers'], answer: 0, review: 38, why: 'Same seed, same sequence.' },
        { type: 'output', q: 'With CircleSM, what does this print?', code: 'new CircleSM();\nnew CircleSM(3);\nSystem.out.println(CircleSM.getNumberOfObjects());', answer: '2', review: 44, why: 'Each constructor adds 1 to the shared static counter.' },
        { q: 'Inside a static method, which is allowed?', options: ['Using a static variable', 'Using an instance variable directly', 'Using this'], answer: 0, review: 43, why: 'A static method has no object.' },
        { q: 'A field has no modifier. Who can use it?', options: ['Classes in the same package', 'Only its own class', 'Every class'], answer: 0, review: 48, why: 'The default access is the package.' },
        { type: 'output', q: 'With the Circle of slide 53, what does this print?', code: 'Circle c = new Circle(4);\nc.setRadius(-1);\nSystem.out.println(c.getRadius());', answer: '0.0', review: 53, why: 'Negative values become 0.' },
        { type: 'output', q: 'What does this print?', code: 'public static void reset(Circle c) {\n  c.setRadius(0);\n  c = new Circle(50);\n}\n// in main:\nCircle k = new Circle(9);\nreset(k);\nSystem.out.println(k.getRadius());', answer: '0.0', review: 56, why: 'setRadius changes the shared object; the new Circle only changes the method’s copy of the reference.' },
        { type: 'output', q: 'What does this print?', code: 'Circle[] cs = new Circle[3];\nSystem.out.println(cs[0]);', answer: 'null', review: 57, why: 'An array of references starts with null.' },
        { q: 'Which makes a class immutable?', options: ['Private fields, no setters, and no getter returning a mutable field', 'Only private fields', 'Only a final class name'], answer: 0, review: 62, why: 'Slide 62.' },
        { type: 'output', q: 'What does this print?', code: 'class A {\n  int v = 1;\n  void set(int v) { this.v = v; }\n}\n// in main:\nA a = new A();\na.set(4);\nSystem.out.println(a.v);', answer: '4', review: 65, why: 'this.v is the field.' }
      ],
      tasks: [
        {
          title: 'A Rectangle class',
          task: '<p>Write a class <code>Rectangle</code> with two double data fields <code>width</code> and <code>height</code>, a constructor <code>Rectangle(double width, double height)</code> that uses <b>this</b> to set them, and a method <code>getArea()</code> that returns width × height.</p>',
          starter: 'public class Rectangle {\n  \n}',
          output: 'new Rectangle(3, 4).getArea() returns 12.0',
          checks: [
            { re: /double\s+width\s*;[\s\S]*double\s+height\s*;|double\s+height\s*;[\s\S]*double\s+width\s*;|double\s+width\s*,\s*height\s*;/, label: 'Fields <code>double width</code> and <code>double height</code>', review: 6 },
            { re: /Rectangle\s*\(\s*double\s+width\s*,\s*double\s+height\s*\)/, label: 'Constructor <code>Rectangle(double width, double height)</code> with no return type', review: 14 },
            { re: /this\.width\s*=\s*width\s*;[\s\S]*this\.height\s*=\s*height\s*;/, label: 'Uses <code>this.width = width;</code> and <code>this.height = height;</code>', review: 65 },
            { re: /double\s+getArea\s*\(\s*\)\s*\{\s*return\s+(this\.)?width\s*\*\s*(this\.)?height\s*;/, label: '<code>getArea()</code> returns <code>width * height</code>', review: 6 }
          ],
          solution: 'public class Rectangle {\n  double width;\n  double height;\n\n  public Rectangle(double width, double height) {\n    this.width = width;\n    this.height = height;\n  }\n\n  public double getArea() {\n    return width * height;\n  }\n}'
        },
        {
          title: 'Private data with get and set',
          task: '<p>Write a class <code>Account</code> with a <b>private</b> double field <code>balance</code>, a public <code>getBalance()</code>, and a public <code>setBalance(double b)</code> that refuses negative values (it keeps the old balance if b is negative).</p>',
          starter: 'public class Account {\n  \n}',
          output: 'setBalance(-5) leaves the balance unchanged',
          checks: [
            { re: /private\s+double\s+balance/, label: 'A <b>private</b> field <code>balance</code>', review: 53 },
            { re: /public\s+double\s+getBalance\s*\(\s*\)\s*\{\s*return\s+(this\.)?balance\s*;/, label: 'An accessor <code>getBalance()</code>', review: 48 },
            { re: /public\s+void\s+setBalance\s*\(\s*double\s+\w+\s*\)/, label: 'A mutator <code>setBalance(double b)</code>', review: 48 },
            { re: /if\s*\(\s*\w+\s*>=\s*0\s*\)|if\s*\(\s*\w+\s*<\s*0\s*\)|\?\s*\w+\s*:/, label: 'Checks for a negative value', review: 53 }
          ],
          solution: 'public class Account {\n  private double balance;\n\n  public double getBalance() {\n    return balance;\n  }\n\n  public void setBalance(double b) {\n    if (b >= 0)\n      balance = b;\n  }\n}'
        },
        {
          title: 'Count the objects',
          task: '<p>Write a class <code>Ticket</code> with a <b>static</b> int <code>count</code> (starting at 0) that the constructor increases by 1, and a static method <code>getCount()</code> that returns it.</p>',
          starter: 'public class Ticket {\n  \n}',
          output: 'after two new Ticket(), Ticket.getCount() returns 2',
          checks: [
            { re: /static\s+int\s+count\s*=\s*0\s*;/, label: '<code>static int count = 0;</code>', review: 44 },
            { re: /Ticket\s*\(\s*\)\s*\{[\s\S]*count\s*\+\+|Ticket\s*\(\s*\)\s*\{[\s\S]*count\s*\+=\s*1/, label: 'The constructor adds 1 to count', review: 44 },
            { re: /static\s+int\s+getCount\s*\(\s*\)\s*\{\s*return\s+count\s*;/, label: '<code>static int getCount()</code> returns count', review: 44 }
          ],
          solution: 'public class Ticket {\n  static int count = 0;\n\n  public Ticket() {\n    count++;\n  }\n\n  public static int getCount() {\n    return count;\n  }\n}'
        }
      ]
    }
  });
})();
