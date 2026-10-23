/* CS2 · Unit 7 · Abstract Classes (22 slides): general superclasses, abstract methods, the abstract GeometricObject,
   rules for abstract classes, the abstract Number class (LargestNumber), and Calendar / GregorianCalendar */
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
  function hot(o) { return mix(o || {}, { tone: 'accent', hi: true }); }
  function cls(id, x, y, w, name, lines, o) {
    o = o || {};
    return B(id, x, y, w, boxH(lines.length), mix({ title: name, band: true, mono: true, size: 12.5, lsize: o.lsize || 11.5, italic: !!o.abs, lines: lines.map(function (f) { return typeof f === 'string' ? { t: f } : f; }), tone: o.tone || 'blue', hi: !!o.hi }, o.extra || {}));
  }

  /* ---------- 1. a general class with abstract methods (slides 3-5) ---------- */
  var abstractv = {
    id: 'abstractv', slides: [3, 5], title: 'getArea in GeometricObject has no body',
    steps: [
      { slide: 3, ph: 'gen', cap: 'Going up the inheritance tree, classes become more <b>general</b>. A superclass that is so general that it cannot make a real object is an <b>abstract class</b>.' },
      { slide: 4, ph: 'why', cap: 'Every shape has an area and a perimeter, so getArea and getPerimeter belong in GeometricObject. But GeometricObject cannot know <b>how</b> to compute them: it does not know if it is a circle or a rectangle.' },
      { slide: 4, ph: 'abs', cap: 'So they are <b>abstract methods</b>: declared with a header only, no body. Each subclass gives the body.' },
      { slide: 5, ph: 'uml', cap: 'In UML the name of an abstract class and its abstract methods are written in <i>italics</i>. <b>#</b> means protected (the constructors are protected: only subclasses call them).' }
    ],
    draw: function (k, s) {
      var ph = s.ph, items = [];
      items.push(cls('g', 120, 10, 320, 'GeometricObject', ['-color: String', '-filled: boolean', { t: '#GeometricObject()', tone: ph === 'uml' ? 'accent' : undefined }, '+getColor(), setColor(…) …', { t: '+getArea(): double', i: ph === 'abs' || ph === 'uml', tone: ph === 'why' || ph === 'abs' || ph === 'uml' ? 'accent' : 'muted', b: ph !== 'gen' }, { t: '+getPerimeter(): double', i: ph === 'abs' || ph === 'uml', tone: ph === 'why' || ph === 'abs' || ph === 'uml' ? 'accent' : 'muted', b: ph !== 'gen' }], { abs: ph === 'abs' || ph === 'uml', tone: ph === 'gen' ? 'accent' : 'blue', hi: ph === 'gen' }));
      items.push(cls('c', 20, 220, 240, 'Circle', ['getArea(): radius² × π'], { tone: 'teal' }), cls('r', 300, 220, 240, 'Rectangle', ['getArea(): width × height'], { tone: 'teal' }));
      items.push(A('i1', 140, 216, 230, 146, { tone: 'ink' }), A('i2', 420, 216, 330, 146, { tone: 'ink' }));
      if (ph === 'gen') items.push(T('gl', 280, 200, 'more general ↑   more specific ↓', { anchor: 'middle', size: 12.5, bold: true, tone: 'muted' }));
      if (ph === 'abs') items.push(T('nb', 280, 200, 'abstract: no body here; the subclasses implement it', { anchor: 'middle', size: 12.5, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 2. TestGeometricObject (slides 6-10) ---------- */
  var TGO = 'public class TestGeometricObject {\n  public static void main(String[] args) {\n    GeometricObject geoObject1 = new Circle(5);\n    GeometricObject geoObject2 = new Rectangle(5, 3);\n\n    System.out.println("The two objects have the same area? " +\n                       equalArea(geoObject1, geoObject2));\n    displayGeometricObject(geoObject1);  // Display circle\n    displayGeometricObject(geoObject2);  // Display rectangle\n  }\n\n  public static boolean equalArea(GeometricObject object1,\n                                  GeometricObject object2) {\n    return object1.getArea() == object2.getArea();\n  }\n\n  public static void displayGeometricObject(GeometricObject object) {\n    System.out.println("\\nThe area is " + object.getArea());\n    System.out.println("The perimeter is " + object.getPerimeter());\n  }\n}';
  function TGOc(v) { return TGO.replace('new Circle(5)', 'new Circle(' + jd(v.r).replace(/\.0$/, '') + ')').replace('new Rectangle(5, 3)', 'new Rectangle(' + jd(v.w).replace(/\.0$/, '') + ', ' + jd(v.h).replace(/\.0$/, '') + ')'); }
  var testgeo = {
    id: 'testgeo', slides: [6, 10], title: 'One method, the right getArea for each object', code: TGOc,
    inputs: [{ id: 'r', label: 'circle radius', value: 5, min: 0, max: 100 }, { id: 'w', label: 'width', value: 5, min: 0, max: 100 }, { id: 'h', label: 'height', value: 3, min: 0, max: 100 }],
    presets: [{ label: 'Circle(5), Rectangle(5, 3)', values: { r: 5, w: 5, h: 3 } }, { label: 'both zero', values: { r: 0, w: 0, h: 7 } }, { label: 'Circle(1), Rectangle(π, 1)', values: { r: 1, w: 3.141592653589793, h: 1 } }],
    steps: function (v) {
      var ca = v.r * v.r * Math.PI, cp = 2 * v.r * Math.PI, ra = v.w * v.h, rp = 2 * (v.w + v.h), eq = ca === ra;
      return [
        { slide: 6, ph: 'cls', cap: '<code>public abstract class GeometricObject</code>: the keyword <b>abstract</b> before class. Its constructors are <b>protected</b>.' },
        { slide: 7, ph: 'meth', cap: '<code>public abstract double getArea();</code> ends with a semicolon: <b>no implementation</b>. The same for getPerimeter.' },
        { slide: 8, ph: 'sub', cap: 'Circle and Rectangle (slides 8-9) extend it and <b>implement</b> getArea and getPerimeter with real bodies. Their toString uses super.toString().' },
        { slide: 10, line: '3-4', ph: 'objs', cap: 'Variables of the abstract type GeometricObject refer to a Circle and a Rectangle (polymorphism).' },
        { slide: 10, line: '6-7,14', ph: 'eq', cap: 'equalArea calls getArea on both. Dynamic binding runs Circle’s and Rectangle’s versions: ' + jd(ca) + ' and ' + jd(ra) + '.', out: 'The two objects have the same area? ' + eq },
        { slide: 10, line: '8,17-20', ph: 'd1', cap: 'displayGeometricObject works for <b>any</b> GeometricObject. For the circle:', out: ['', 'The area is ' + jd(ca), 'The perimeter is ' + jd(cp)] },
        { slide: 10, line: '9,17-20', ph: 'd2', cap: 'And for the rectangle. Without the abstract methods in GeometricObject, <code>object.getArea()</code> would not even compile.', out: ['', 'The area is ' + jd(ra), 'The perimeter is ' + jd(rp)] }
      ];
    },
    draw: function (k, s, v) {
      var ph = s.ph, items = [];
      if (ph === 'cls' || ph === 'meth') return [B('c', 30, 40, 500, boxH(5), { lines: [{ t: 'public abstract class GeometricObject {', b: ph === 'cls', tone: ph === 'cls' ? 'accent' : undefined }, '  protected GeometricObject() { … }', '  …', { t: '  public abstract double getArea();', b: ph === 'meth', tone: ph === 'meth' ? 'accent' : undefined }, { t: '  public abstract double getPerimeter();', b: ph === 'meth', tone: ph === 'meth' ? 'accent' : undefined }], mono: true, lsize: 13, tone: 'blue' })];
      items.push(cls('g', 170, 10, 220, 'GeometricObject', [{ t: 'getArea()  // abstract', i: true }], { abs: true }));
      items.push(cls('c', 20, 150, 240, 'Circle', ['radius = ' + jd(v.r), 'getArea() → ' + jd(v.r * v.r * Math.PI).slice(0, 12)], { tone: ph === 'd1' || ph === 'eq' ? 'accent' : 'teal', hi: ph === 'd1' }));
      items.push(cls('r', 300, 150, 240, 'Rectangle', ['width = ' + jd(v.w).slice(0, 8), 'height = ' + jd(v.h).slice(0, 8), 'getArea() → ' + jd(v.w * v.h).slice(0, 12)], { tone: ph === 'd2' || ph === 'eq' ? 'accent' : 'teal', hi: ph === 'd2' }));
      items.push(A('i1', 140, 146, 250, 60, { tone: 'ink' }), A('i2', 420, 146, 310, 60, { tone: 'ink' }));
      return items;
    }
  };

  /* ---------- 3. the rules (slides 11-13) ---------- */
  var rules = {
    id: 'rules', slides: [11, 13], title: 'What abstract allows and forbids',
    code: 'GeometricObject g = new GeometricObject();   // error!\n\nGeometricObject[] array = new GeometricObject[10];\narray[0] = new Circle(5.0);\narray[1] = new Rectangle(9.4, 3.5);',
    steps: [
      { slide: 11, ph: 'conc', cap: 'An abstract method can only be in an abstract class. A class that is not abstract is <b>concrete</b>. A concrete subclass must implement <b>all</b> the abstract methods; otherwise the subclass must be declared abstract too.' },
      { slide: 12, line: 1, ph: 'new', cap: 'You <b>cannot</b> create an object of an abstract class with new. But it can still have <b>constructors</b>: they are called by the subclass constructors (with super).' },
      { slide: 13, ph: 'notes', cap: 'An abstract class may have <b>no</b> abstract method at all (it is just a base). A subclass can be abstract even if its superclass is concrete: Object is concrete, GeometricObject is abstract.' },
      { slide: 13, line: '3-5', ph: 'type', cap: 'An abstract class can be used as a <b>type</b>: an array of GeometricObject can hold Circles and Rectangles. <code>new GeometricObject[10]</code> creates an array of 10 null references, not 10 objects, so it is allowed.' }
    ],
    draw: function (k, s) {
      var ph = s.ph, items = [];
      if (ph === 'conc') return [cls('a', 170, 20, 220, 'abstract class A', [{ t: 'abstract void m();', i: true }], { abs: true }), cls('b', 20, 170, 240, 'class B extends A', ['void m() { … }  ✓', 'concrete'], { tone: 'teal' }), cls('c', 300, 170, 240, 'abstract class C extends A', ['no m()', 'must be abstract'], { tone: 'accent', abs: true }), A('i1', 140, 166, 230, 76, { tone: 'ink' }), A('i2', 420, 166, 330, 76, { tone: 'ink' })];
      if (ph === 'new') return [B('bad', 40, 50, 480, 50, { title: 'new GeometricObject()   ✗', mono: true, size: 16, tone: 'red', hi: true }), B('ok', 40, 150, 480, 80, { title: 'new Circle(5)', lines: ['Circle() → super() → GeometricObject()  ✓'], mono: true, size: 15, lsize: 12, tone: 'teal', hi: true })];
      if (ph === 'notes') return [B('o', 200, 20, 160, 40, { title: 'Object (concrete)', mono: true, size: 12, tone: 'blue' }), B('g', 180, 120, 200, 40, { title: 'GeometricObject', mono: true, size: 12, italic: true, tone: 'accent' }), A('i', 280, 116, 280, 64, { tone: 'ink' }), T('t', 280, 200, 'abstract under a concrete class: allowed', { anchor: 'middle', size: 13, bold: true, tone: 'accent' })];
      items.push(B('ref', 20, 120, 120, 44, { tag: 'array', title: 'reference', size: 12, tone: 'blue' }), A('a', 144, 142, 176, 142, { tone: 'blue' }));
      for (var i = 0; i < 5; i++) {
        var t = i === 0 ? ': Circle' : i === 1 ? ': Rectangle' : 'null';
        items.push(B('c' + i, 180, 40 + i * 50, 90, 40, { title: i < 2 ? '●' : 'null', mono: true, size: 12, tone: i < 2 ? 'accent' : 'muted', dash: i >= 2, r: 2 }));
        if (i < 2) items.push(A('r' + i, 270, 60 + i * 50, 336, 60 + i * 50, { tone: 'accent' }), B('o' + i, 340, 40 + i * 50, 180, 40, { title: t, mono: true, size: 13, tone: 'teal' }));
      }
      items.push(T('more', 225, 305, '… [9]', { anchor: 'middle', mono: true, size: 11, tone: 'muted' }));
      return items;
    }
  };

  /* ---------- 4. the abstract Number class (slides 15-16) ---------- */
  var LN = 'public class LargestNumber {\n  public static void main(String[] args) {\n    ArrayList<Number> list = new ArrayList<>();\n    list.add(45);       // Add an integer\n    list.add(3445.53);  // Add a double\n    list.add(new BigInteger("3432323234344343101"));\n    list.add(new BigDecimal("2.0909090989091343433344343"));\n    System.out.println("The largest number = " + getLargestNumber(list));\n  }\n\n  public static Number getLargestNumber(ArrayList<Number> list) {\n    if (list == null || list.isEmpty()) return null;\n    Number num = list.get(0);\n    for (int i = 1; i < list.size(); i++)\n      if (num.doubleValue() < list.get(i).doubleValue()) num=list.get(i);\n    return num;\n  }\n}';
  var NUMS = [['45', 'Integer', 45], ['3445.53', 'Double', 3445.53], ['3432323234344343101', 'BigInteger', 3432323234344343101], ['2.0909090989091343433344343', 'BigDecimal', 2.0909090989091343]];
  var number = {
    id: 'number', slides: [15, 16], title: 'Different numbers, one doubleValue()', code: LN,
    steps: (function () {
      var st = [
        { slide: 15, ph: 'uml', k: -1, cap: '<b>Number</b> is the abstract superclass of Double, Float, Long, Integer, Short, Byte, BigInteger and BigDecimal. intValue, longValue, floatValue and doubleValue are <b>abstract</b>; byteValue and shortValue are already written using intValue.' },
        { slide: 16, line: '3-7', ph: 'list', k: -1, cap: 'An <code>ArrayList&lt;Number&gt;</code> can hold all of them: 45 is boxed into an Integer, 3445.53 into a Double, plus a BigInteger and a BigDecimal.' }
      ], best = 0;
      for (var i = 1; i < NUMS.length; i++) {
        var big = NUMS[i][2] > NUMS[best][2];
        st.push({ slide: 16, line: '14-15', ph: 'cmp', k: i, best: big ? i : best, cap: 'Compare with <code>doubleValue()</code>: each class implements it in its own way. ' + NUMS[i][0].slice(0, 20) + (NUMS[i][0].length > 20 ? '…' : '') + ' is ' + (big ? '<b>bigger</b>, so it becomes num.' : 'not bigger.') });
        if (big) best = i;
      }
      st.push({ slide: 16, line: 8, ph: 'out', k: 4, best: best, cap: 'The BigInteger is the largest. println shows it with its own toString.', out: 'The largest number = 3432323234344343101' });
      return st;
    })(),
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'uml') {
        items.push(cls('n', 150, 10, 260, 'java.lang.Number', ['+byteValue(): byte', '+shortValue(): short', { t: '+intValue(): int', i: true, tone: 'accent' }, { t: '+longValue(): long', i: true, tone: 'accent' }, { t: '+floatValue(): float', i: true, tone: 'accent' }, { t: '+doubleValue(): double', i: true, tone: 'accent' }], { abs: true }));
        ['Double', 'Float', 'Long', 'Integer', 'Short', 'Byte', 'BigInteger', 'BigDecimal'].forEach(function (n, i) { items.push(B('s' + i, 8 + i * 69, 260, 64, 32, { title: n, mono: true, size: 9, tone: 'teal', r: 3 })); });
        items.push(A('i', 280, 256, 280, 190, { tone: 'ink' }));
        return items;
      }
      NUMS.forEach(function (n, i) {
        var on = i === s.k, best = i === s.best;
        items.push(B('v' + i, 20, 20 + i * 70, 340, 56, { tag: n[1], title: n[0].length > 24 ? n[0].slice(0, 24) + '…' : n[0], mono: true, size: 13, tone: best ? 'accent' : on ? 'blue' : 'teal', hi: best }));
        items.push(T('d' + i, 380, 54 + i * 70, 'doubleValue ≈ ' + (n[2] > 1e7 ? n[2].toExponential(3) : String(n[2]).slice(0, 8)), { mono: true, size: 12, tone: on ? 'accent' : 'muted', bold: on }));
      });
      return items;
    }
  };

  /* ---------- 5. Calendar and GregorianCalendar (slides 17-22) ---------- */
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], MON = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  function CAL(v) { return 'Calendar calendar = new GregorianCalendar();\nSystem.out.println("YEAR: " + calendar.get(Calendar.YEAR));\nSystem.out.println("MONTH: " + calendar.get(Calendar.MONTH));\nSystem.out.println("DATE: " + calendar.get(Calendar.DATE));\n\n// Set the calendar to a date\ncalendar.set(' + I(v.y) + ', Calendar.' + MON[I(v.m)] + ', ' + I(v.d) + ');\nString[] dayNameOfWeek = {"Sunday", "Monday", "Tuesday",\n  "Wednesday", "Thursday", "Friday", "Saturday"};\nSystem.out.println("That day is a " +\n  dayNameOfWeek[calendar.get(Calendar.DAY_OF_WEEK) - 1]);'; }
  var calendar = {
    id: 'calendar', slides: [17, 22], title: 'Calendar fields, and the 0-based month', code: CAL,
    inputs: [{ id: 'y', label: 'year', value: 2024, min: 1900, max: 2100 }, { id: 'm', label: 'month (0 = January)', value: 0, min: 0, max: 11 }, { id: 'd', label: 'day', value: 1, min: 1, max: 28 }],
    presets: [{ label: 'January 1, 2024 (slide)', values: { y: 2024, m: 0, d: 1 } }, { label: 'December 25, 2026', values: { y: 2026, m: 11, d: 25 } }, { label: 'March 1, 2000', values: { y: 2000, m: 2, d: 1 } }],
    steps: function (v) {
      var y = I(v.y), m = I(v.m), d = I(v.d), dt = new Date(y, m, d), now = new Date();
      return [
        { slide: 17, ph: 'idea', cap: 'A Date is one instant in time (in milliseconds). <b>Calendar</b> is an abstract class that extracts year, month, day, hour, … from it. Each subclass can implement a calendar system; Java provides <b>GregorianCalendar</b>.' },
        { slide: 18, ph: 'uml', cap: 'Calendar has get(field), set(field, value), set(year, month, dayOfMonth), getActualMaximum, add, getTime and setTime. GregorianCalendar is a <b>concrete</b> subclass.' },
        { slide: 19, line: 1, ph: 'new', cap: '<code>new GregorianCalendar()</code> is now; <code>new GregorianCalendar(year, month, day)</code> is a given date. Careful: the month is <b>0-based</b>: 0 is January, 11 is December.' },
        { slide: 20, line: '2-4', ph: 'fields', cap: '<code>get(field)</code> reads one field, using constants like Calendar.YEAR, MONTH, DATE, HOUR (12-hour), HOUR_OF_DAY (24-hour), DAY_OF_WEEK (1 = Sunday), DAY_OF_YEAR …', out: ['YEAR: ' + now.getFullYear(), 'MONTH: ' + now.getMonth(), 'DATE: ' + now.getDate()] },
        { slide: 22, line: 7, ph: 'set', cap: '<code>calendar.set(' + y + ', Calendar.' + MON[m] + ', ' + d + ')</code> moves the calendar to that date. Calendar.' + MON[m] + ' is the constant ' + m + '.' },
        { slide: 22, line: '8-11', ph: 'dow', dow: dt.getDay(), cap: 'DAY_OF_WEEK is ' + (dt.getDay() + 1) + ' (1 = Sunday), so the array index is ' + dt.getDay() + ': ' + DAYS[dt.getDay()] + '. (The slide does this for January 1, 2024.)', out: 'That day is a ' + DAYS[dt.getDay()] }
      ];
    },
    draw: function (k, s, v) {
      var ph = s.ph, items = [];
      if (ph === 'idea' || ph === 'uml') {
        items.push(cls('c', 130, 10, 300, 'java.util.Calendar', ['#Calendar()', '+get(field: int): int', '+set(field: int, value: int): void', '+set(year, month, dayOfMonth): void', { t: '+add(field: int, amount: int): void', i: true, tone: 'accent' }, '+getTime(): java.util.Date'], { abs: true, tone: ph === 'idea' ? 'accent' : 'blue' }));
        items.push(cls('g', 130, 230, 300, 'java.util.GregorianCalendar', ['+GregorianCalendar()', '+GregorianCalendar(year, month, day)'], { tone: 'teal', hi: ph === 'uml' }));
        items.push(A('i', 280, 226, 280, 176, { tone: 'ink' }));
        return items;
      }
      if (ph === 'new' || ph === 'set') {
        ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].forEach(function (n, i) {
          var on = i === I(v.m);
          items.push(B('m' + i, 16 + (i % 6) * 90, 40 + Math.floor(i / 6) * 90, 82, 66, { title: String(i), lines: [n], mono: true, size: 18, lsize: 12, tone: on ? 'accent' : 'blue', hi: on }));
        });
        items.push(T('z', 280, 250, 'MONTH is 0-based: January is 0', { anchor: 'middle', size: 14, bold: true, tone: 'accent' }));
        return items;
      }
      if (ph === 'fields') return [['YEAR', 'the year'], ['MONTH', '0 for January'], ['DATE', 'day of the month'], ['HOUR_OF_DAY', '24-hour'], ['DAY_OF_WEEK', '1 for Sunday'], ['AM_PM', '0 AM, 1 PM']].map(function (r, i) { return B('f' + i, 20 + (i % 2) * 270, 20 + Math.floor(i / 2) * 90, 250, 70, { title: 'Calendar.' + r[0], lines: [r[1]], mono: true, size: 13, lsize: 12, tone: 'blue' }); });
      DAYS.forEach(function (n, i) { var on = i === s.dow; items.push(B('d' + i, 10 + i * 78, 100, 74, 60, { title: String(i + 1), lines: [n.slice(0, 3)], mono: true, size: 16, lsize: 11, tone: on ? 'accent' : 'blue', hi: on })); items.push(T('di' + i, 47 + i * 78, 186, '[' + i + ']', { anchor: 'middle', mono: true, size: 11, tone: on ? 'accent' : 'muted' })); });
      items.push(T('t', 280, 60, 'DAY_OF_WEEK (top) and array index (bottom)', { anchor: 'middle', size: 12.5, tone: 'muted' }));
      return items;
    }
  };

  var ALL = [abstractv, testgeo, rules, number, calendar];
  var para = function (t) { return { type: 'paragraph', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; },
    code = function (t, lang) { return lang ? { type: 'code', text: t, lang: lang } : { type: 'code', text: t }; }, note = function (t) { return { type: 'note', text: t }; };
  function braces(c) { var o = (c.match(/\{/g) || []).length, z = (c.match(/\}/g) || []).length; return o >= 2 && o === z; }
  var OUT = ['Abstract Classes and Methods', 'Abstract Geometric Object Class', 'Case Study: the Abstract Number Class', 'Case Study: the Abstract Calendar Class'];
  function outline(title, on, ex) { return { image: false, title: title, blocks: OUT.map(function (t, i) { return { type: 'bullet', html: on.indexOf(i) >= 0 ? '<b>' + t + '</b>' : t, level: 0 }; }), explain: ex }; }

  addUnit({
    course: 'cs2', lesson: '07-abstract-classes',
    blurb: 'Classes too general to make objects: abstract classes and abstract methods, with GeometricObject, Number and Calendar as examples.',
    parts: [
      {
        title: 'Abstract classes and methods', from: 1, to: 13,
        quiz: [
          { q: 'What is special about an abstract method?', options: ['It has a header but no body', 'It is private', 'It cannot be overridden'], answer: 0, why: 'Slide 7: public abstract double getArea();' },
          { type: 'tf', q: 'You can write <code>new GeometricObject()</code> when GeometricObject is abstract.', answer: false, why: 'An abstract class cannot be instantiated (slide 12).' },
          { q: 'A subclass of an abstract class does not implement one of its abstract methods. Then…', options: ['the subclass must be abstract too', 'it is fine', 'Java writes an empty body'], answer: 0, why: 'Slide 11.' },
          { type: 'output', q: 'With the classes of slides 8-10, what does this print?', code: 'GeometricObject g = new Rectangle(4, 2);\nSystem.out.println(g.getArea() + " " + g.getPerimeter());', answer: '8.0 12.0', why: 'Dynamic binding runs Rectangle’s versions.' },
          { type: 'tf', q: 'An abstract class can have constructors.', answer: true, why: 'They are called by the subclass constructors (slide 12).' },
          { q: 'Is <code>GeometricObject[] a = new GeometricObject[10];</code> allowed?', options: ['Yes: it creates an array of 10 null references', 'No: GeometricObject is abstract', 'Only with 0 elements'], answer: 0, why: 'Slide 13.' }
        ]
      },
      {
        title: 'Number and Calendar', from: 14, to: 22,
        quiz: [
          { q: 'Which class is the abstract superclass of Integer and Double?', options: ['Number', 'Object', 'Math'], answer: 0, why: 'Slide 15.' },
          { q: 'Why can getLargestNumber compare an Integer and a BigInteger?', options: ['Both implement Number’s doubleValue()', 'Java converts them to String', 'They are the same class'], answer: 0, why: 'Slide 16.' },
          { q: 'Which value of Calendar.MONTH means March?', options: ['2', '3', '1'], answer: 0, why: 'The month is 0-based (slide 19).' },
          { q: 'What does Calendar.DAY_OF_WEEK give for a Sunday?', options: ['1', '0', '7'], answer: 0, why: 'Slide 20.' },
          { type: 'tf', q: 'Calendar is a concrete class, so you can write new Calendar().', answer: false, why: 'Calendar is abstract; GregorianCalendar is concrete (slide 18).' }
        ]
      }
    ],
    slides: {
      1: { image: false, blocks: [para('An abstract class contains abstract methods that are implemented in concrete subclasses.'), para('An abstract class cannot be used to create objects because abstract methods are not implemented.')],
        explain: '<p><b>{{Abstract|مجرّد: غير مكتمل}}</b>: a class that describes a group, not one real thing.</p>' },
      2: outline('Outline', [], '<p>The plan of this unit.</p>'),
      3: { image: false, title: 'Abstract Classes', blocks: [bul('With inheritance, classes become more specific with each new subclass.'), bul('If you move up from a subclass to a superclass, the superclass becomes more general and less specific.'), bul('Class design should ensure that a superclass contains common features of its subclasses.'), bul('Such a superclass is referred to an abstract class. It cannot be used to create any specific instance.')],
        explain: '<p>“Shape” is abstract; “a circle with radius 5” is a real object.</p>' },
      4: { image: false, title: 'Abstract Methods', blocks: [bul('We previously defined GeometricObject as the superclass of Circle and Rectangle.'), bul('Both Circle and Rectangle contain the getArea and getPerimeter methods for a circle and rectangle object.'), bul('Since the area and perimeter can be computed for all geometric objects, we can define the getArea and getPerimeter methods in the GeometricObject class.'), bul('However, these two methods cannot be implemented in GeometricObject and are referred to as abstract methods.')],
        explain: '<p>The method is declared where it is common, and implemented where it is known.</p>' },
      5: { image: false, title: 'UML Class Diagram', blocks: [para('Abstract class names and abstract methods are italicized. The # sign indicates the protected modifier. Methods getArea and getPerimeter are overridden in Circle and Rectangle.')],
        explain: '<p>Italic = abstract; # = protected.</p>' },
      6: { image: false, title: 'Abstract Geometric Object Class', blocks: [code('public abstract class GeometricObject {\n  private String color = "white";\n  private boolean filled;\n  private Date dateCreated;\n\n  protected GeometricObject() {\n    dateCreated = new Date();\n  }\n\n  protected GeometricObject(String color, boolean filled) {\n    dateCreated = new Date();\n    this.color = color;\n    this.filled = filled;\n  }')],
        explain: '<p>The constructors are protected because only subclasses should call them.</p>' },
      7: { image: false, title: 'Abstract Area and Perimeter Methods', blocks: [code('  public String getColor() { return color; }\n  public void setColor(String color) { this.color = color; }\n  public boolean isFilled() { return filled; }\n  public void setFilled(boolean filled) { this.filled = filled; }\n  public Date getDateCreated() { return dateCreated; }\n\n  public String toString() {\n    return "created on " + dateCreated + "\\ncolor: " + color +\n      " and filled: " + filled;\n  }\n\n  public abstract double getArea();      // No implementation\n  public abstract double getPerimeter(); // No implementation\n}')],
        explain: '<p>An abstract class can mix normal methods and abstract ones.</p>' },
      8: { image: false, title: 'Circle Class', blocks: [code('public class Circle extends GeometricObject {\n  private double radius;\n\n  public Circle() { }\n  public Circle(double radius) { this.radius = radius; }\n\n  public double getRadius() { return radius; }\n  public void setRadius(double radius) { this.radius = radius; }\n  public double getArea() { return radius * radius * Math.PI; }\n  public double getDiameter() { return 2 * radius; }\n  public double getPerimeter() { return 2 * radius * Math.PI; }\n\n  public String toString() {\n    return super.toString() + " radius: " + radius;\n  }\n}')],
        explain: '<p>Circle implements both abstract methods, so it is concrete.</p>' },
      9: { image: false, title: 'Rectangle Class', blocks: [code('public class Rectangle extends GeometricObject {\n  private double width;\n  private double height;\n\n  public Rectangle() { }\n  public Rectangle(double width, double height) {\n    this.width = width;\n    this.height = height;\n  }\n\n  public double getWidth() { return width; }\n  public double getHeight() { return height; }\n  public double getArea() { return width * height; }\n  public double getPerimeter() { return 2 * (width + height); }\n\n  public String toString() {\n    return super.toString() + " width: "  + width +\n                              " height: " + height;\n  }\n}')],
        explain: '<p>The same two methods, with Rectangle’s formulas.</p>' },
      10: { image: false, title: 'Testing Geometric Object', blocks: [code(TGO)], explain: '<p>The helper methods take a GeometricObject and work for every subclass.</p>' },
      11: { image: false, title: 'Abstract Method in Abstract Class', blocks: [bul('An abstract method must be defined in an abstract class.'), bul('A non-abstract class is called a concrete class.'), bul('A concrete subclass of an abstract superclass must implement all the abstract methods of the superclass.'), bul('The Circle and Rectangle subclasses implement the getArea and getPerimeter abstract methods.'), bul('If a subclass of an abstract superclass does not implement all the abstract methods, the subclass must be defined abstract.')],
        explain: '<p>A <b>{{concrete|محسوس: كامل يمكن إنشاء كائنات منه}}</b> class can make objects.</p>' },
      12: { image: false, title: 'Cannot Instantiate an Abstract Class', blocks: [bul('Objects cannot be created from an abstract class.'), bul('Cannot use the new operator to instantiate an abstract class.'), bul('However, you can still define the constructors of an abstract class, which are invoked in the constructors of its subclasses.'), bul('For instance, the constructors of GeometricObject are invoked in the Circle and the Rectangle subclasses.')],
        explain: '<p>To <b>{{instantiate|يُنشئ نسخة / كائناً}}</b> is to create an object with new.</p>' },
      13: { image: false, title: 'Notes about Abstract Classes', blocks: [bul('It is possible to define an abstract class without any abstract method. The abstract class is used as a base for subclasses.'), bul('A subclass can be abstract even if its superclass is concrete.'), para('For example, the root class Object class is concrete, but a subclass, such as GeometricObject, is abstract.'), bul('An abstract class can be used as a data type. For example, but you can create an array of GeometricObject elements.'), code('GeometricObject[] array = new GeometricObject[10];\narray[0] = new Circle(5.0);\narray[1] = new Rectangle(9.4, 3.5);')],
        explain: '<p>The abstract type is useful exactly for variables, parameters and arrays.</p>' },
      14: outline('Next . . .', [2, 3], '<p>Next: two abstract classes from the Java library.</p>'),
      15: { image: false, title: 'Case Study: the Abstract Number Class', blocks: [bul('Number is an abstract superclass for the numeric wrapper classes, as well as BigInteger and BigDecimal.'), bul('intValue, longValue, floatValue, and doubleValue are defined as abstract in the Number class.'), code('public byte byteValue() {\n  return (byte) intValue();\n}\n\npublic short shortValue() {\n  return (short) intValue();\n}')],
        explain: '<p>byteValue is a normal method that uses the abstract intValue: each subclass supplies intValue, and byteValue works for all of them.</p>' },
      16: { image: false, title: 'Computing the Largest Number', blocks: [code(LN)], explain: '<p>The list type is Number, so any kind of number can be added (boxing turns 45 into an Integer).</p>' },
      17: { image: false, title: 'The Abstract Calendar Class', blocks: [bul('An instance of java.util.Date represents a specific instant in time with a long millisecond precision.'), bul('The java.util.Calendar is an abstract base class for extracting detailed information such as year, month, day, hour, minute and second from a Date object.'), bul('Subclasses of Calendar can implement specific calendar systems such as the Gregorian or lunar calendar.'), bul('The java.util.GregorianCalendar is supported in the Java API for the Gregorian calendar.')],
        explain: '<p>The <b>{{Gregorian|الميلادي}}</b> calendar is the usual one; a <b>{{lunar|القمري}}</b> calendar (like the Hijri one) could be another subclass.</p>' },
      18: { image: false, title: 'Case Study: the Abstract Calendar Class', blocks: [para('GregorianCalendar is a concrete subclass.')],
        explain: '<p>add is abstract in Calendar (italic in the diagram).</p>' },
      19: { image: false, title: 'The Concrete Gregorian Calendar Class', blocks: [bul('Use new GregorianCalendar() to construct a default GregorianCalendar object for the current time.'), bul('Use new GregorianCalendar(year, month, day) to construct a GregorianCalendar object for the specified year, month, and day.'), bul('The month parameter is 0-based, where 0 is for January.'), bul('Use new GregorianCalendar(year, month, day, hour, minute, second) to construct an object for the specified year, month, day, hour, minute, and second.')],
        explain: '<p>A common mistake: new GregorianCalendar(2024, 1, 1) is February 1, not January 1.</p>' },
      20: { image: false, title: 'Field Constants in the Calendar Class', blocks: [para('The get(field) method defined in the Calendar class extracts information from a Calendar object.')],
        explain: '<p>The constants (YEAR, MONTH, DATE, HOUR, HOUR_OF_DAY, MINUTE, SECOND, DAY_OF_WEEK, DAY_OF_MONTH, DAY_OF_YEAR, WEEK_OF_MONTH, WEEK_OF_YEAR, AM_PM) are static ints in Calendar.</p>' },
      21: { image: false, title: 'Getting Information from Calendar', blocks: [code('import java.util.*;\n\npublic class TestCalendar {\n  public static void main(String[] args) {\n    // Construct a Gregorian calendar object\n    Calendar calendar = new GregorianCalendar();\n    System.out.println("Current time is " + calendar.getTime());\n    System.out.println("YEAR: " + calendar.get(Calendar.YEAR));\n    System.out.println("MONTH: " + calendar.get(Calendar.MONTH));\n    System.out.println("DATE: " + calendar.get(Calendar.DATE));\n    System.out.println("HOUR: " + calendar.get(Calendar.HOUR));\n    System.out.println("HOUR_OF_DAY: " + calendar.get(Calendar.HOUR_OF_DAY));\n    System.out.println("MINUTE: " + calendar.get(Calendar.MINUTE));\n    System.out.println("SECOND: " + calendar.get(Calendar.SECOND));')],
        explain: '<p>The variable type is the abstract Calendar; the object is a GregorianCalendar.</p>' },
      22: { image: false, title: 'Getting Information from Calendar', blocks: [code('    System.out.println("DAY_OF_WEEK: " +  calendar.get(Calendar.DAY_OF_WEEK));\n    System.out.println("DAY_OF_MONTH: " + calendar.get(Calendar.DAY_OF_MONTH));\n    System.out.println("DAY_OF_YEAR: " + calendar.get(Calendar.DAY_OF_YEAR));\n    System.out.println("WEEK_OF_MONTH: " + calendar.get(Calendar.WEEK_OF_MONTH));\n    System.out.println("WEEK_OF_YEAR: " + calendar.get(Calendar.WEEK_OF_YEAR));\n    System.out.println("AM_PM: " + calendar.get(Calendar.AM_PM));\n\n    // Set the calendar to January 1, 2024\n    calendar.set(2024, Calendar.JANUARY, 1);\n    String[] dayNameOfWeek = {"Sunday", "Monday", "Tuesday",\n                              "Wednesday", "Thursday", "Friday", "Saturday"};\n    System.out.println("January 1, 2024 is a " +\n                       dayNameOfWeek[calendar.get(Calendar.DAY_OF_WEEK) - 1]);\n  }\n}')],
        explain: '<p>January 1, 2024 is a Monday. The −1 turns DAY_OF_WEEK (1-7) into an array index (0-6).</p>' }
    },
    visuals: ALL,
    exam: {
      questions: [
        { q: 'Which declares an abstract method correctly?', options: ['public abstract double getArea();', 'public abstract double getArea() { }', 'public double abstract getArea();'], answer: 0, review: 7, why: 'No body, just a semicolon.' },
        { q: 'Which class can have abstract methods?', options: ['Only an abstract class', 'Any class', 'Only a final class'], answer: 0, review: 11, why: 'Slide 11.' },
        { type: 'output', q: 'What does this print?', code: 'GeometricObject g = new Circle(1);\nSystem.out.println(g.getPerimeter() > 6);', answer: 'true', review: 10, why: '2 × π ≈ 6.28.' },
        { q: 'Why does the abstract class have getArea at all, if it has no body?', options: ['So code using a GeometricObject variable can call getArea', 'To make objects faster', 'It is required by Object'], answer: 0, review: 10, why: 'Without it, object.getArea() would not compile.' },
        { type: 'tf', q: 'An abstract class must have at least one abstract method.', answer: false, review: 13, why: 'It may have none.' },
        { type: 'output', q: 'What does this print?', code: 'Number n = 7;\nSystem.out.println(n.doubleValue());', answer: '7.0', review: 15, why: '7 is boxed into an Integer, which implements doubleValue.' },
        { q: 'Which of these is <b>not</b> a subclass of Number?', options: ['String', 'BigDecimal', 'Byte'], answer: 0, review: 15, why: 'Slide 15.' },
        { type: 'output', q: 'What does this print?', code: 'Calendar c = new GregorianCalendar(2024, 0, 1);\nSystem.out.println(c.get(Calendar.MONTH));', answer: '0', review: 19, why: 'January is 0.' },
        { q: 'Calendar.HOUR and Calendar.HOUR_OF_DAY differ how?', options: ['HOUR is 12-hour, HOUR_OF_DAY is 24-hour', 'They are the same', 'HOUR is in minutes'], answer: 0, review: 20, why: 'Slide 20.' }
      ],
      tasks: [
        {
          title: 'An abstract Shape',
          task: '<p>Write <code>public abstract class Shape</code> with an abstract method <code>public abstract double area();</code>, and a concrete <code>class Square extends Shape</code> with a double field <code>side</code>, a constructor <code>Square(double side)</code>, and <code>area()</code> returning side × side.</p>',
          starter: '\n',
          output: 'Shape s = new Square(3); s.area() returns 9.0',
          checks: [
            { re: /abstract\s+class\s+Shape/, label: '<code>abstract class Shape</code>', review: 6 },
            { re: /public\s+abstract\s+double\s+area\s*\(\s*\)\s*;/, label: '<code>public abstract double area();</code> with no body', review: 7 },
            { re: /class\s+Square\s+extends\s+Shape/, label: '<code>class Square extends Shape</code>', review: 8 },
            { re: /double\s+area\s*\(\s*\)\s*\{\s*return\s+(this\.)?side\s*\*\s*(this\.)?side\s*;/, label: 'Square implements <code>area()</code>', review: 11 },
            { re: /Square\s*\(\s*double\s+\w+\s*\)/, label: 'Constructor <code>Square(double side)</code>', review: 8 }
          ],
          solution: 'public abstract class Shape {\n  public abstract double area();\n}\n\nclass Square extends Shape {\n  private double side;\n\n  public Square(double side) {\n    this.side = side;\n  }\n\n  public double area() {\n    return side * side;\n  }\n}'
        },
        {
          title: 'Total area with the abstract type',
          task: '<p>Using the GeometricObject classes of the slides, write <code>public static double totalArea(GeometricObject[] a)</code> that adds <code>getArea()</code> of every element and returns the sum.</p>',
          starter: 'public class Total {\n  \n}',
          output: 'totalArea of {new Circle(1), new Rectangle(2, 3)} ≈ 9.14',
          checks: [
            { re: /public\s+static\s+double\s+totalArea\s*\(\s*GeometricObject\s*\[\s*\]\s*\w+\s*\)/, label: 'Header with a <code>GeometricObject[]</code> parameter', review: 13 },
            { re: /\.getArea\s*\(\s*\)/, label: 'Calls <code>getArea()</code> on each element', review: 10 },
            { re: /for\s*\(/, label: 'A loop over the array', review: 13 },
            { re: /return\s+\w+\s*;/, label: 'Returns the sum', review: 10 }
          ],
          solution: 'public class Total {\n  public static double totalArea(GeometricObject[] a) {\n    double sum = 0;\n    for (int i = 0; i < a.length; i++)\n      sum += a[i].getArea();\n    return sum;\n  }\n}'
        }
      ]
    }
  });
})();
