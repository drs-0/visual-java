/* CS1 · Unit 3 · Elementary Programming (47 slides): identifiers, variables, numeric types, operators, input, casting, literals, expressions, common errors, formatting */
(function () {
  function mix(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }
  /* a value the way Java prints a double: 20 -> 20.0, 1e7 -> 1.0E7 */
  function jd(x) {
    if (!isFinite(x)) return String(x);
    var a = Math.abs(x);
    if (a !== 0 && (a >= 1e7 || a < 1e-3)) {
      var e = x.toExponential(), m = e.split('e')[0], p = parseInt(e.split('e')[1], 10);
      if (m.indexOf('.') < 0) m += '.0';
      return m + 'E' + p;
    }
    return Number.isInteger(x) ? x.toFixed(1) : String(x);
  }
  function jint(x) { return x < 0 ? Math.ceil(x) : Math.floor(x); } /* Java int division truncates toward zero */
  function box(id, x, y, w, name, type, value, o) {
    return B(id, x, y, w, 48, mix({ tag: type + ' ' + name, title: value == null ? 'no value' : String(value), mono: true, size: value == null ? 13 : 16, tone: value == null ? 'muted' : 'teal', dash: value == null, r: 6 }, o || {}));
  }
  function hot(o) { return mix(o || {}, { tone: 'accent', hi: true }); }
  function stmt(id, text, o) { return T(id, 280, 26, text, mix({ anchor: 'middle', mono: true, bold: true, size: 14, tone: 'ink' }, o || {})); }

  /* ---------- 1. software development process (slide 3) ---------- */
  var PHASES = [['Requirements\nSpecification', 'What must the program do?'], ['System Analysis', 'What goes in, what comes out?'], ['System Design', 'Plan the steps (input, process, output)'], ['Implementation', 'Write the code: this chapter'], ['Testing', 'Does it give the right results?'], ['Deployment', 'Give it to the users'], ['Maintenance', 'Fix and improve it later']];
  var process = {
    id: 'process', slides: [3, 3], title: 'The software development process',
    steps: PHASES.map(function (p, i) { return { cap: '<b>' + p[0].replace('\n', ' ') + '</b>: ' + p[1] + (i === 2 ? ' This is the <b>IPO</b> idea.' : i === 3 ? '' : '') }; }),
    draw: function (k) {
      var items = [];
      PHASES.forEach(function (p, i) {
        var x = 10 + i * 64, y = 10 + i * 44, cur = i === k;
        items.push(B('p' + i, x, y, 150, 38, { title: p[0], size: 11.5, tone: cur ? 'accent' : i < k ? 'teal' : 'blue', hi: cur, fill: cur ? 'solid' : 'soft' }));
        if (i < 6) items.push(A('a' + i, x + 152, y + 19, x + 64 + 75, y + 42, { via: [[x + 64 + 75, y + 19]], tone: i < k ? 'accent' : 'muted' }));
        if (i > 0) items.push(A('b' + i, x - 2, y + 30, x - 64 + 40, y - 6 + 2, { via: [[x - 64 + 40, y + 30]], tone: 'muted', dash: true }));
      });
      if (k >= 1 && k <= 3) items.push(T('ipo', 330, 80, 'Input, Process, Output (IPO)', { tone: 'blue', bold: true, size: 13 }));
      return items;
    }
  };

  /* ---------- 2. identifier rules (slide 4) ---------- */
  var RESERVED = ['class', 'public', 'static', 'void', 'int', 'double', 'char', 'final', 'new'];
  var NAMES = ['radius', 'computeArea', '$money', '_count', '2pi', 'class', 'true', 'area of circle', 'my-name'];
  function checkName(nm) {
    var r = [];
    r.push({ t: 'only letters, digits, _ and $', ok: /^[A-Za-z0-9_$]+$/.test(nm) });
    r.push({ t: 'does not start with a digit', ok: !/^[0-9]/.test(nm) });
    r.push({ t: 'not a reserved word', ok: RESERVED.indexOf(nm) < 0 });
    r.push({ t: 'not true, false or null', ok: ['true', 'false', 'null'].indexOf(nm) < 0 });
    return r;
  }
  var ident = {
    id: 'ident', slides: [4, 4], title: 'Is it a legal identifier?', defaults: { i: 0 },
    presets: NAMES.map(function (n, i) { return { label: n, values: { i: i } }; }),
    steps: function (v) {
      var nm = NAMES[v.i], r = checkName(nm), ok = r.every(function (x) { return x.ok; });
      var st = [{ cap: 'Check the name <code>' + nm + '</code> against the four rules.' }];
      r.forEach(function (x) { st.push({ cap: 'Rule: ' + x.t + '. ' + (x.ok ? 'OK.' : '<b>Broken!</b>') }); });
      st.push({ cap: ok ? '<code>' + nm + '</code> is a <b>legal</b> identifier. (Any length is fine.)' : '<code>' + nm + '</code> is <b>not</b> a legal identifier.' });
      return st;
    },
    draw: function (k, s, v) {
      var nm = NAMES[v.i], r = checkName(nm), ok = r.every(function (x) { return x.ok; });
      var items = [B('nm', 140, 20, 280, 54, { title: nm, mono: true, size: 20, tone: k === 5 ? (ok ? 'teal' : 'red') : 'blue', fill: k === 5 ? 'solid' : 'soft' })];
      r.forEach(function (x, i) {
        var y = 100 + i * 50, done = k > i, cur = k === i + 1;
        items.push(B('r' + i, 60, y, 400, 40, { title: x.t, size: 13.5, align: 'left', tone: done ? (x.ok ? 'teal' : 'red') : 'muted', hi: cur, dash: !done }));
        if (done) items.push(T('m' + i, 490, y + 27, x.ok ? '✓' : '✗', { anchor: 'middle', bold: true, size: 22, tone: x.ok ? 'teal' : 'red' }));
      });
      return items;
    }
  };

  /* ---------- 3. variables in memory (slides 5-9) ---------- */
  var vars = {
    id: 'vars', slides: [5, 9], title: 'Variables are named boxes',
    steps: [
      { slide: 5, cap: '<code>int x;</code> declares a box named <b>x</b> for an integer. It has no value yet.' },
      { slide: 5, cap: '<code>double radius;</code> a box for a number with a decimal point. <code>char a;</code> a box for one character.' },
      { slide: 6, cap: '<code>radius = 1.0;</code> puts 1.0 into radius.' },
      { slide: 6, cap: '<code>double area = radius * radius * 3.14159;</code> declares area <b>and</b> gives it a value in one step.' },
      { slide: 6, cap: 'Print: "The area is 3.14159 for radius 1.0".', out: 'The area is 3.14159 for radius 1.0' },
      { slide: 6, cap: '<code>radius = 2.0;</code> The old value 1.0 is gone. Then area is computed again: 12.56636.', out: 'The area is 12.56636 for radius 2.0' },
      { slide: 6, cap: '<code>int year = 1435;</code> Declaring and initializing in one step.' },
      { slide: 7, clear: true, cap: 'Assignment statements: the value on the right goes into the variable on the left. <code>x = 1; radius = 1.0; a = \'A\';</code>' },
      { slide: 8, cap: 'Names: variables and methods start lowercase; each next word starts with a capital letter: <b>radius</b>, <b>area</b>, <b>computeArea</b>. Classes start uppercase: <b>ComputeArea</b>.' },
      { slide: 9, cap: 'A <b>constant</b> uses <code>final</code>. Its value cannot change. Name it in CAPITALS with _ between words: <b>PI</b>, <b>SIZE</b>, <b>MAX_VALUE</b>.' }
    ],
    draw: function (k) {
      var items = [];
      if (k <= 6) {
        var code = ['int x;', 'double radius;   char a;', 'radius = 1.0;', 'double area = radius * radius * 3.14159;', 'System.out.println("The area is " + area + ...);', 'radius = 2.0;   area = ...;', 'int year = 1435;'][k];
        items.push(stmt('st', code, { size: k === 3 || k === 4 ? 12 : 14 }));
        items.push(box('x', 30, 70, 110, 'x', 'int', null, k === 0 ? hot() : {}));
        if (k >= 1) items.push(box('r', 170, 70, 120, 'radius', 'double', k >= 5 ? '2.0' : k >= 2 ? '1.0' : null, k === 1 || k === 2 || k === 5 ? hot() : {}));
        if (k >= 1) items.push(box('a', 320, 70, 90, 'a', 'char', null, k === 1 ? hot() : {}));
        if (k >= 3) items.push(box('ar', 170, 170, 160, 'area', 'double', k >= 5 ? '12.56636' : '3.14159', k === 3 || k === 5 ? hot() : {}));
        if (k === 5) items.push(T('old', 300, 150, 'old 1.0 is replaced', { tone: 'red', size: 12.5, anchor: 'middle' }));
        if (k >= 6) items.push(box('yr', 360, 170, 120, 'year', 'int', 1435, k === 6 ? hot() : {}));
        return items;
      }
      if (k === 7) {
        items.push(stmt('st', 'x = 1;   radius = 1.0;   a = \'A\';'));
        items.push(box('x', 30, 110, 110, 'x', 'int', 1, hot()));
        items.push(box('r', 170, 110, 120, 'radius', 'double', '1.0', hot()));
        items.push(box('a', 320, 110, 90, 'a', 'char', "'A'", hot()));
        items.push(T('dir', 280, 230, 'variable  =  value ;   (the value moves to the left)', { anchor: 'middle', tone: 'muted', mono: true, size: 12.5 }));
        return items;
      }
      if (k === 8) {
        items.push(T('w', 30, 50, 'compute + area', { mono: true, size: 16, tone: 'muted' }));
        items.push(A('w1', 190, 45, 250, 45, { tone: 'accent' }));
        items.push(B('cm', 260, 22, 260, 44, { title: 'computeArea', mono: true, size: 17, tone: 'teal', fill: 'solid' }));
        items.push(T('wl', 390, 88, 'variable / method: first word lowercase', { anchor: 'middle', tone: 'teal', size: 12.5 }));
        items.push(A('w2', 190, 135, 250, 135, { tone: 'accent' }));
        items.push(T('w0', 30, 140, 'compute + area', { mono: true, size: 16, tone: 'muted' }));
        items.push(B('cl', 260, 112, 260, 44, { title: 'ComputeArea', mono: true, size: 17, tone: 'blue', fill: 'solid' }));
        items.push(T('cll', 390, 178, 'class: every word starts uppercase', { anchor: 'middle', tone: 'blue', size: 12.5 }));
        items.push(T('bad', 280, 250, 'not good:  computearea   Compute_Area   x1', { anchor: 'middle', tone: 'red', mono: true, size: 13 }));
        return items;
      }
      items.push(stmt('st', 'final double PI = 3.14159;'));
      items.push(B('pi', 170, 70, 220, 60, { tag: 'final double PI', title: '3.14159   🔒', mono: true, size: 18, tone: 'blue', hi: true }));
      items.push(T('try', 280, 180, 'PI = 3;   // compile error: PI is final', { anchor: 'middle', mono: true, tone: 'red', size: 13.5 }));
      items.push(T('sz', 280, 230, 'final int SIZE = 3;', { anchor: 'middle', mono: true, tone: 'ink', size: 14 }));
      return items;
    }
  };

  /* ---------- 4. trace ComputeArea (slides 10-14) ---------- */
  var COMPUTE = 'public class ComputeArea {\n  /** Main method */\n  public static void main(String[] args) {\n    double radius;\n    double area;\n\n    // Assign a radius\n    radius = 20;\n\n    // Compute area\n    area = radius * radius * 3.14159;\n\n    // Display results\n    System.out.println("The area for the circle of radius " +\n      radius + " is " + area);\n  }\n}';
  var trace = {
    id: 'trace', slides: [10, 14], title: 'Trace ComputeArea', code: COMPUTE,
    inputs: [{ id: 'r', label: 'radius', value: 20, min: 0, max: 1000 }], inputsLabel: 'Try another radius (line 8):',
    presets: [{ label: 'Slide: 20', values: { r: 20 } }, { label: '1', values: { r: 1 } }, { label: '2.5', values: { r: 2.5 } }, { label: '0', values: { r: 0 } }],
    steps: function (v) {
      var a = v.r * v.r * 3.14159;
      return [
        { slide: 10, line: 4, cap: '<code>double radius;</code> allocates memory for radius. It has <b>no value</b> yet.' },
        { slide: 11, line: 5, cap: '<code>double area;</code> allocates memory for area. No value yet.' },
        { slide: 12, line: 8, cap: 'Assign ' + jd(v.r) + ' to radius.' },
        { slide: 13, line: 11, cap: 'Compute ' + jd(v.r) + ' * ' + jd(v.r) + ' * 3.14159 = ' + jd(a) + ' and assign it to area.' },
        { slide: 14, line: '14-15', cap: 'Print a message to the console. The + joins the text and the numbers into one string.', out: 'The area for the circle of radius ' + jd(v.r) + ' is ' + jd(a) }
      ];
    },
    draw: function (k, s, v) {
      var a = v.r * v.r * 3.14159;
      return [
        T('mem', 280, 40, 'memory', { anchor: 'middle', bold: true, tone: 'muted' }),
        box('rad', 90, 70, 180, 'radius', 'double', k >= 2 ? jd(v.r) : null, k === 0 || k === 2 ? hot() : {}),
        k >= 1 ? box('ar', 300, 70, 180, 'area', 'double', k >= 3 ? jd(a) : null, k === 1 || k === 3 ? hot() : {}) : null,
        k === 3 ? T('f', 280, 170, jd(v.r) + ' * ' + jd(v.r) + ' * 3.14159', { anchor: 'middle', mono: true, tone: 'accent', bold: true }) : null,
        k === 3 ? A('fa', 390, 150, 390, 122, { tone: 'accent' }) : null,
        k === 4 ? B('con', 40, 170, 480, 60, { tag: 'console', title: 'The area for the circle of radius ' + jd(v.r) + ' is ' + jd(a), mono: true, size: 11.5, tone: 'teal' }) : null
      ];
    }
  };

  /* ---------- 5. numeric data types (slides 15-16) ---------- */
  var TYPES = [['byte', 8, '-128 to 127'], ['short', 16, '-32768 to 32767'], ['int', 32, '-2147483648 to 2147483647'], ['long', 64, 'about ±9.22 x 10^18'], ['float', 32, 'about ±3.4 x 10^38'], ['double', 64, 'about ±1.8 x 10^308']];
  var types = {
    id: 'types', slides: [15, 16], title: 'Six numeric types',
    steps: [
      { slide: 15, cap: 'Four types for <b>whole numbers</b>: byte, short, int and long. More bits = a bigger range.' },
      { slide: 15, cap: '<b>int</b> uses 32 bits: from -2147483648 to 2147483647. It is the usual type for whole numbers.' },
      { slide: 15, cap: 'Two types for numbers with a <b>decimal point</b>: float (32 bits) and double (64 bits).' },
      { slide: 16, cap: '<b>double</b> is more accurate. 1.0 / 3.0 shows 16 digits.', out: '1.0 / 3.0 is 0.3333333333333333' },
      { slide: 16, cap: '<b>float</b> keeps only about 7 digits. Write F after a number to make it a float.', out: '1.0F / 3.0F is 0.33333334' }
    ],
    draw: function (k) {
      var items = [];
      TYPES.forEach(function (t, i) {
        var y = 20 + i * 46, w = t[1] * 3.5, on = (k === 0 && i < 4) || (k === 1 && i === 2) || (k === 2 && i >= 4) || (k === 3 && i === 5) || (k === 4 && i === 4);
        items.push(T('n' + i, 20, y + 24, t[0], { mono: true, bold: true, tone: on ? 'accent' : 'ink' }));
        items.push(B('b' + i, 90, y + 4, w, 26, { tone: on ? 'accent' : i >= 4 ? 'blue' : 'teal', fill: on ? 'solid' : 'soft', r: 3 }));
        items.push(T('s' + i, 95 + w, y + 22, t[1] + ' bits' + (on ? ':  ' + t[2] : ''), { tone: on ? 'accent' : 'muted', size: 12, mono: !on, bold: on }));
      });
      if (k >= 3) items.push(T('dg', 280, 310, k === 3 ? '0.3333333333333333  (16 digits)' : '0.33333334  (7 digits)', { anchor: 'middle', mono: true, bold: true, tone: k === 3 ? 'teal' : 'blue', size: 14 }));
      return items;
    }
  };

  /* ---------- 6. numeric operators and integer division (slides 17-18) ---------- */
  function opsRows(a, b, dbl) {
    var ints = Number.isInteger(a) && Number.isInteger(b) && !dbl;
    var div = ints ? jint(a / b) : a / b, rem = a % b;
    var f = function (x) { return ints ? String(x) : jd(x); };
    return [['+', 'Addition', f(a + b)], ['-', 'Subtraction', f(a - b)], ['*', 'Multiplication', f(a * b)], ['/', 'Division', b === 0 ? (ints ? 'error' : 'Infinity') : f(div)], ['%', 'Remainder', b === 0 ? (ints ? 'error' : 'NaN') : f(rem)]];
  }
  var ops = {
    id: 'ops', slides: [17, 18], title: 'The five numeric operators',
    inputs: [{ id: 'a', value: 5, min: -999, max: 999 }, { id: 'b', value: 2, min: -999, max: 999 }], inputsLabel: 'Numbers (try 5.5 for a double):', defaults: { dbl: 0 },
    presets: [{ label: '5 and 2', values: { a: 5, b: 2, dbl: 0 } }, { label: '5.0 and 2', values: { a: 5, b: 2, dbl: 1 } }, { label: '20 and 3', values: { a: 20, b: 3, dbl: 0 } }, { label: '34 and 1', values: { a: 34, b: 1, dbl: 0 } }, { label: '34.0 and 0.1', values: { a: 34, b: 0.1, dbl: 1 } }],
    steps: function (v) {
      var ints = Number.isInteger(v.a) && Number.isInteger(v.b) && !v.dbl, rows = opsRows(v.a, v.b, v.dbl);
      var st = rows.map(function (r, i) {
        var cap = '<b>' + r[1] + '</b>: ' + (ints ? v.a : jd(v.a)) + ' ' + r[0] + ' ' + (ints ? v.b : jd(v.b)) + ' = <b>' + r[2] + '</b>';
        if (i === 3) cap += ints ? '. Both are integers, so the result is an integer: the fraction is dropped.' : '. One number is a double, so the result is a double.';
        if (i === 4) cap += '. % gives the <b>remainder</b> after division.';
        return { slide: i < 3 ? 17 : 18, cap: cap };
      });
      return st;
    },
    draw: function (k, s, v) {
      var ints = Number.isInteger(v.a) && Number.isInteger(v.b) && !v.dbl, rows = opsRows(v.a, v.b, v.dbl), items = [];
      items.push(T('t', 280, 26, ints ? 'int and int → int result' : 'a double is involved → double result', { anchor: 'middle', bold: true, tone: ints ? 'teal' : 'blue' }));
      rows.forEach(function (r, i) {
        var y = 48 + i * 52, cur = i === k;
        items.push(B('o' + i, 20, y, 50, 42, { title: r[0], mono: true, size: 20, tone: cur ? 'accent' : 'blue', fill: cur ? 'solid' : 'soft' }));
        items.push(T('e' + i, 90, y + 27, (ints ? v.a : jd(v.a)) + ' ' + r[0] + ' ' + (ints ? v.b : jd(v.b)), { mono: true, size: 15, tone: cur ? 'accent' : 'ink', bold: cur }));
        items.push(B('r' + i, 290, y, 150, 42, { title: i <= k ? r[2] : '?', mono: true, size: i <= k && r[2].length > 10 ? 12 : 17, tone: i <= k ? 'teal' : 'muted', dash: i > k }));
      });
      if (k === 3 && ints && v.b !== 0 && v.a % v.b !== 0) items.push(T('n', 548, 48 + 3 * 52 + 27, '(' + (v.a / v.b).toFixed(2) + '… cut)', { anchor: 'end', tone: 'red', size: 11.5 }));
      return items;
    }
  };

  /* ---------- 7. days of the week with % (slide 19) ---------- */
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var days = {
    id: 'days', slides: [19, 19], title: 'What day is in n days?',
    inputs: [{ id: 'd', label: 'today (0-6)', value: 6, min: 0, max: 6 }, { id: 'n', label: 'days later', value: 10, min: 0, max: 400 }],
    presets: [{ label: 'Slide: Saturday + 10', values: { d: 6, n: 10 } }, { label: 'Monday + 3', values: { d: 1, n: 3 } }, { label: 'Sunday + 7', values: { d: 0, n: 7 } }, { label: 'Friday + 30', values: { d: 5, n: 30 } }],
    steps: function (v) {
      var r = (v.d + v.n) % 7;
      return [
        { cap: 'Days are numbered 0 to 6: Sunday is 0 … Saturday is 6. Today is <b>' + DAYS[v.d] + '</b> = ' + v.d + '.' },
        { cap: 'Go ' + v.n + ' days forward: ' + v.d + ' + ' + v.n + ' = ' + (v.d + v.n) + '.' },
        { cap: 'A week has 7 days, so keep only the remainder: (' + v.d + ' + ' + v.n + ') % 7 = <b>' + r + '</b>.' },
        { cap: 'Day ' + r + ' is <b>' + DAYS[r] + '</b>.' }
      ];
    },
    draw: function (k, s, v) {
      var r = (v.d + v.n) % 7, items = [];
      DAYS.forEach(function (d, i) {
        var ang = -Math.PI / 2 + i * 2 * Math.PI / 7, x = 200 + Math.cos(ang) * 120, y = 165 + Math.sin(ang) * 120;
        var cur = (k <= 1 && i === v.d) || (k >= 3 && i === r);
        items.push(B('d' + i, x - 45, y - 20, 90, 40, { title: i + ' ' + d.slice(0, 3), size: 13, tone: cur ? 'accent' : 'blue', fill: cur ? 'solid' : 'soft' }));
      });
      items.push(T('e1', 450, 120, '(' + v.d + ' + ' + v.n + ') % 7', { anchor: 'middle', mono: true, bold: true, size: 15, tone: k >= 1 ? 'accent' : 'muted' }));
      if (k >= 2) items.push(T('e2', 450, 160, '= ' + (v.d + v.n) + ' % 7 = ' + r, { anchor: 'middle', mono: true, bold: true, size: 15, tone: 'teal' }));
      if (k >= 3) items.push(T('e3', 450, 200, DAYS[r], { anchor: 'middle', bold: true, size: 20, tone: 'accent' }));
      if (k === 1) items.push(T('lap', 450, 160, Math.floor((v.d + v.n) / 7) + ' full week(s) + ' + r, { anchor: 'middle', tone: 'muted', size: 12.5 }));
      return items;
    }
  };

  /* ---------- 8. augmented assignment and ++ -- (slides 20-21) ---------- */
  var AUG = [['+=', function (i) { return i + 8; }], ['-=', function (i) { return i - 8; }], ['*=', function (i) { return i * 8; }], ['/=', function (i) { return jint(i / 8); }], ['%=', function (i) { return i % 8; }]];
  var INC = [['int j = ++i;', 2, 2, 'add 1 to i first, then use it'], ['int j = i++;', 1, 2, 'use i first (1), then add 1'], ['int j = --i;', 0, 0, 'subtract 1 first, then use it'], ['int j = i--;', 1, 0, 'use i first (1), then subtract 1']];
  var shortcut = {
    id: 'shortcut', slides: [20, 21], title: 'Short ways to change a variable',
    inputs: [{ id: 'i', label: 'i', value: 20, min: -999, max: 999 }], inputsLabel: 'Start value of i (slide 20):',
    presets: [{ label: 'i = 20', values: { i: 20 } }, { label: 'i = 3', values: { i: 3 } }, { label: 'i = -17', values: { i: -17 } }],
    steps: function (v) {
      var st = AUG.map(function (a) { return { slide: 20, cap: '<code>i ' + a[0] + ' 8</code> is the same as <code>i = i ' + a[0][0] + ' 8</code>. With i = ' + v.i + ': i becomes <b>' + a[1](v.i) + '</b>.' }; });
      INC.forEach(function (c) { st.push({ slide: 21, cap: 'Start with i = 1. <code>' + c[0] + '</code> ' + c[3] + ': j is <b>' + c[1] + '</b>, i is <b>' + c[2] + '</b>.' }); });
      return st;
    },
    draw: function (k, s, v) {
      var items = [];
      if (k < 5) {
        var a = AUG[k];
        items.push(stmt('st', 'i ' + a[0] + ' 8;     // i = i ' + a[0][0] + ' 8;'));
        items.push(box('i0', 60, 90, 160, 'i', 'int', v.i, {}));
        items.push(A('go', 225, 114, 330, 114, { tone: 'accent', label: a[0][0] + ' 8' }));
        items.push(box('i1', 335, 90, 160, 'i', 'int', a[1](v.i), hot()));
        items.push(T('bef', 140, 170, 'before', { anchor: 'middle', tone: 'muted' }));
        items.push(T('aft', 415, 170, 'after', { anchor: 'middle', tone: 'accent', bold: true }));
        AUG.forEach(function (x, j) { items.push(T('l' + j, 60 + j * 100, 260, x[0], { mono: true, bold: j === k, size: 18, tone: j === k ? 'accent' : 'muted' })); });
        return items;
      }
      var c = INC[k - 5], pre = c[0].indexOf('++i') >= 0 || c[0].indexOf('--i') >= 0, plus = c[0].indexOf('++') >= 0;
      items.push(stmt('st', c[0] + '     // i starts at 1'));
      items.push(T('o1', 280, 70, pre ? '1) ' + (plus ? 'i = i + 1' : 'i = i - 1') + '    2) j = i' : '1) j = i    2) ' + (plus ? 'i = i + 1' : 'i = i - 1'), { anchor: 'middle', mono: true, tone: 'accent', bold: true, size: 14 }));
      items.push(box('i', 90, 110, 160, 'i', 'int', c[2], { tone: 'blue' }));
      items.push(box('j', 310, 110, 160, 'j', 'int', c[1], hot()));
      items.push(T('nm', 280, 230, pre ? 'pre: change first' : 'post: use first, change after', { anchor: 'middle', bold: true, tone: 'teal' }));
      return items;
    }
  };

  /* ---------- 9. reading numbers with Scanner (slide 22) ---------- */
  var SCAN = 'Scanner input = new Scanner(System.in);\nSystem.out.print("Enter a double value: ");\ndouble firstUserInput = input.nextDouble();\nSystem.out.print("Enter an int value: ");\nint secondUserInput = input.nextInt();\nSystem.out.print(firstUserInput );\nSystem.out.print(secondUserInput );';
  var scanner = {
    id: 'scanner', slides: [22, 22], title: 'Reading numbers from the keyboard', code: SCAN,
    inputs: [{ id: 'd', label: 'you type (double)', value: 3.5, min: -9999, max: 9999 }, { id: 'n', label: 'you type (int)', value: 7, min: -9999, max: 9999 }],
    presets: [{ label: '3.5 and 7', values: { d: 3.5, n: 7 } }, { label: '10 and 25', values: { d: 10, n: 25 } }, { label: '0.25 and -4', values: { d: 0.25, n: -4 } }],
    steps: function (v) {
      var n = Math.round(v.n);
      return [
        { line: 1, cap: 'Create a <b>Scanner</b> named input. It reads from <b>System.in</b>: the keyboard.' },
        { line: 2, cap: 'Show a prompt. <b>print</b> (not println) keeps the cursor on the same line.', out: 'Enter a double value: ' },
        { line: 3, cap: '<b>nextDouble()</b> waits for the user. The user types ' + v.d + ' and presses Enter. The number goes into firstUserInput.', out: '' + v.d },
        { line: 4, clear: false, cap: 'Another prompt.', out: 'Enter an int value: ' },
        { line: 5, cap: '<b>nextInt()</b> reads a whole number: ' + n + '.', out: '' + n },
        { line: '6-7', cap: 'Print both values with print, so they stick together on one line: ' + jd(v.d) + ' then ' + n + '.', out: jd(v.d) + '' + n }
      ];
    },
    draw: function (k, s, v) {
      var n = Math.round(v.n);
      return [
        B('kb', 15, 30, 110, 60, { title: 'keyboard', tone: k === 2 || k === 4 ? 'accent' : 'blue', hi: k === 2 || k === 4, size: 14 }),
        A('a1', 127, 60, 168, 60, { tone: 'muted', label: 'System.in', ly: -6 }),
        B('sc', 170, 30, 130, 60, { tag: 'Scanner', title: 'input', mono: true, tone: k === 0 ? 'accent' : 'teal', hi: k === 0, size: 16 }),
        A('a2', 302, 50, 373, 140, { tone: k === 2 ? 'accent' : 'muted', bend: -20, label: 'nextDouble()', ly: -4 }),
        A('a3', 302, 75, 373, 230, { tone: k === 4 ? 'accent' : 'muted', bend: 20, label: 'nextInt()', ly: 30 }),
        box('fu', 375, 118, 170, 'firstUserInput', 'double', k >= 2 ? jd(v.d) : null, k === 2 ? hot() : {}),
        box('su', 375, 208, 170, 'secondUserInput', 'int', k >= 4 ? n : null, k === 4 ? hot() : {}),
        T('tb', 20, 160, 'other methods:', { tone: 'muted', size: 12.5, bold: true }),
        T('tm', 20, 182, 'nextByte()  nextShort()', { tone: 'muted', mono: true, size: 12 }),
        T('tm2', 20, 202, 'nextLong()   nextFloat()', { tone: 'muted', mono: true, size: 12 })
      ];
    }
  };

  /* ---------- 10. i++ inside an expression (slides 23-24) ---------- */
  var incexpr = {
    id: 'incexpr', slides: [23, 24], title: 'i++ and ++i inside an expression',
    inputs: [{ id: 'i', label: 'i', value: 10, min: -999, max: 999 }], inputsLabel: 'Start value of i:',
    presets: [{ label: 'Slide: i = 10', values: { i: 10 } }, { label: 'i = 3', values: { i: 3 } }],
    steps: function (v) {
      return [
        { slide: 23, cap: '<code>int newNum = 10 * i++;</code> works like two statements: first <code>newNum = 10 * i</code> with the old i, then <code>i = i + 1</code>.' },
        { slide: 23, cap: 'Result: newNum = 10 * ' + v.i + ' = <b>' + 10 * v.i + '</b>, and i is now <b>' + (v.i + 1) + '</b>.' },
        { slide: 23, cap: '<code>int newNum = 10 * (++i);</code> is the other order: first <code>i = i + 1</code>, then <code>newNum = 10 * i</code>.' },
        { slide: 23, cap: 'Result: i = <b>' + (v.i + 1) + '</b>, and newNum = 10 * ' + (v.i + 1) + ' = <b>' + 10 * (v.i + 1) + '</b>.' },
        { slide: 24, cap: 'Short, but hard to read. Avoid expressions like <code>int k = ++i + i;</code> that change and use the same variable many times.' }
      ];
    },
    draw: function (k, s, v) {
      var items = [];
      if (k <= 1) {
        items.push(stmt('st', 'int newNum = 10 * i++;'));
        items.push(T('o', 280, 60, '1) newNum = 10 * i     2) i = i + 1', { anchor: 'middle', mono: true, tone: 'accent', size: 13.5 }));
        items.push(box('i', 90, 100, 160, 'i', 'int', k === 1 ? v.i + 1 : v.i, k === 1 ? { tone: 'blue' } : {}));
        items.push(box('nn', 310, 100, 160, 'newNum', 'int', k === 1 ? 10 * v.i : null, k === 1 ? hot() : {}));
      } else if (k <= 3) {
        items.push(stmt('st', 'int newNum = 10 * (++i);'));
        items.push(T('o', 280, 60, '1) i = i + 1     2) newNum = 10 * i', { anchor: 'middle', mono: true, tone: 'accent', size: 13.5 }));
        items.push(box('i', 90, 100, 160, 'i', 'int', k === 3 ? v.i + 1 : v.i, k === 3 ? { tone: 'blue' } : {}));
        items.push(box('nn', 310, 100, 160, 'newNum', 'int', k === 3 ? 10 * (v.i + 1) : null, k === 3 ? hot() : {}));
      } else {
        items.push(stmt('st', 'int k = ++i + i;', { tone: 'red' }));
        items.push(T('w', 280, 120, 'confusing: avoid it', { anchor: 'middle', bold: true, size: 20, tone: 'red' }));
        items.push(T('w2', 280, 170, 'use ++ and -- alone, in their own statement', { anchor: 'middle', tone: 'teal', bold: true }));
      }
      return items;
    }
  };

  /* ---------- 11. type conversion and the rules (slides 25-26) ---------- */
  var PAIRS = [['int', 'double'], ['float', 'int'], ['long', 'int'], ['byte', 'short'], ['int', 'int']];
  function ruleOf(a, b) { if (a === 'double' || b === 'double') return 0; if (a === 'float' || b === 'float') return 1; if (a === 'long' || b === 'long') return 2; return 3; }
  var RULES = ['double', 'float', 'long', 'int'];
  var conv = {
    id: 'conv', slides: [25, 26], title: 'Mixed types in one operation', defaults: { p: 0 },
    presets: PAIRS.map(function (p, i) { return { label: p[0] + ' + ' + p[1], values: { p: i } }; }),
    steps: function (v) {
      var pr = PAIRS[v.p], r = ruleOf(pr[0], pr[1]);
      var st = [
        { slide: 25, cap: '<code>byte i = 100;</code> Then <code>long k = i * 3 + 4;</code>: i * 3 + 4 = 304, computed as int, then stored in a long: k = 304.' },
        { slide: 25, cap: '<code>double d = i * 3.1 + k / 2;</code> i * 3.1 = 310.0 (a double). k / 2 = 152 (long / int). 310.0 + 152 = <b>462.0</b>.' }
      ];
      for (var j = 0; j <= r; j++) st.push({ slide: 26, cap: 'Rule ' + (j + 1) + (j < 3 ? ': is one operand <b>' + RULES[j] + '</b>? ' + (j === r ? 'Yes: convert the other to ' + RULES[j] + '.' : 'No, go on.') : ': otherwise, both operands become <b>int</b>.') + ' (' + pr[0] + ' + ' + pr[1] + ')' });
      st.push({ slide: 26, cap: pr[0] + ' + ' + pr[1] + ' gives a <b>' + RULES[r] + '</b> result.' });
      return st;
    },
    draw: function (k, s, v) {
      var items = [];
      if (k <= 1) {
        items.push(box('bi', 20, 40, 140, 'i', 'byte', 100, {}));
        items.push(box('k', 200, 40, 140, 'k', 'long', 304, k === 0 ? hot() : {}));
        items.push(box('d', 380, 40, 160, 'd', 'double', k === 1 ? '462.0' : null, k === 1 ? hot() : {}));
        if (k === 0) items.push(T('e', 280, 150, 'i * 3 + 4  →  300 + 4  →  304 (int)  →  long', { anchor: 'middle', mono: true, size: 13, tone: 'accent' }));
        else {
          items.push(T('e1', 280, 150, 'i * 3.1  →  310.0  (double)', { anchor: 'middle', mono: true, size: 13, tone: 'accent' }));
          items.push(T('e2', 280, 180, 'k / 2  →  152  (long)', { anchor: 'middle', mono: true, size: 13, tone: 'accent' }));
          items.push(T('e3', 280, 210, '310.0 + 152  →  462.0  (double)', { anchor: 'middle', mono: true, size: 13, tone: 'teal', bold: true }));
        }
        return items;
      }
      var pr = PAIRS[v.p], r = ruleOf(pr[0], pr[1]), at = Math.min(k - 2, r);
      items.push(T('pair', 280, 26, pr[0] + '  +  ' + pr[1], { anchor: 'middle', mono: true, bold: true, size: 17 }));
      RULES.forEach(function (t, j) {
        var y = 50 + j * 62, done = j < at || (j === at), yes = j === r;
        items.push(B('q' + j, 40, y, 300, 46, { title: j < 3 ? 'one operand ' + t + '?' : 'otherwise', size: 14, tone: j === at ? 'accent' : j < at ? 'muted' : 'blue', hi: j === at }));
        if (j < 3 && j < at) items.push(T('no' + j, 360, y + 29, 'no', { tone: 'muted', bold: true }));
        if (j === r && at >= r) {
          items.push(A('ya' + j, 342, y + 23, 418, y + 23, { tone: 'teal' }));
          items.push(B('res', 420, y, 120, 46, { title: t, mono: true, size: 17, tone: 'teal', fill: 'solid' }));
        }
      });
      return items;
    }
  };

  /* ---------- 12. casting (slides 27-29) ---------- */
  var cast = {
    id: 'cast', slides: [27, 29], title: 'Casting: changing the type',
    inputs: [{ id: 'p', label: 'purchase amount', value: 197.55, min: 0, max: 100000 }], inputsLabel: 'Slide 28: the purchase amount',
    presets: [{ label: '197.55', values: { p: 197.55 } }, { label: '10.00', values: { p: 10 } }, { label: '59.99', values: { p: 59.99 } }],
    steps: function (v) {
      var tax = v.p * 0.06, t2 = jint(tax * 100) / 100;
      return [
        { slide: 27, cap: '<b>Implicit casting</b> (type widening): <code>double d = 3;</code> Java changes the int 3 to 3.0 by itself. A small type fits into a bigger one.' },
        { slide: 27, cap: '<b>Explicit casting</b> (type narrowing): <code>(int)3.0</code> gives 3. You must write the cast yourself.' },
        { slide: 27, cap: '<code>(int)3.9</code> gives <b>3</b>, not 4: the fraction part is <b>truncated</b> (cut off).' },
        { slide: 27, cap: 'What is wrong? <code>int x = 5 / 2.0;</code> 5 / 2.0 is the double 2.5. It cannot go into an int without a cast: compile error.' },
        { slide: 28, cap: 'Sales tax with 6%: ' + jd(v.p) + ' * 0.06 = ' + jd(tax) + '. Too many digits!' },
        { slide: 28, cap: 'Keep two digits: <code>(int)(tax * 100) / 100.0</code> → (int)(' + jd(tax * 100) + ') = ' + jint(tax * 100) + ' → ' + jint(tax * 100) + ' / 100.0 = <b>' + jd(t2) + '</b>.', out: 'Sales tax is ' + jd(t2) },
        { slide: 29, clear: true, cap: '<code>int sum = 0; sum += 4.5;</code> is done as <code>sum = (int)(sum + 4.5)</code>, so sum becomes <b>4</b>.' }
      ];
    },
    draw: function (k, s, v) {
      var items = [], order = ['byte', 'short', 'int', 'long', 'float', 'double'];
      if (k <= 3) {
        order.forEach(function (t, i) { items.push(B('t' + i, 15 + i * 90, 240, 80, 36, { title: t, mono: true, size: 13.5, tone: (k === 0 && (i === 2 || i === 5)) || (k > 0 && (i === 2 || i === 5)) ? 'accent' : 'blue' })); });
        items.push(A('rng', 30, 300, 530, 300, { tone: 'muted', label: 'range increases', ly: 24 }));
        if (k === 0) { items.push(box('d', 180, 40, 200, 'd', 'double', '3.0', hot())); items.push(T('w', 280, 140, '3 (int)  →  3.0 (double): widening, automatic', { anchor: 'middle', tone: 'teal', bold: true })); items.push(A('wa', 255, 220, 470, 220, { tone: 'teal', bend: -30 })); }
        if (k === 1 || k === 2) { items.push(box('i', 180, 40, 200, 'i', 'int', 3, hot())); items.push(T('w', 280, 140, (k === 1 ? '(int)3.0' : '(int)3.9') + '  →  3 : narrowing, you write the cast', { anchor: 'middle', tone: 'accent', bold: true })); items.push(A('na', 470, 220, 255, 220, { tone: 'accent', bend: -30 })); if (k === 2) items.push(T('cut', 280, 175, '.9 is cut off, not rounded', { anchor: 'middle', tone: 'red' })); }
        if (k === 3) { items.push(T('x', 280, 60, 'int x = 5 / 2.0;', { anchor: 'middle', mono: true, size: 18, bold: true, tone: 'red' })); items.push(T('x2', 280, 110, '5 / 2.0 = 2.5 is a double', { anchor: 'middle', tone: 'ink' })); items.push(T('x3', 280, 150, 'a double does not fit into an int → error', { anchor: 'middle', tone: 'red', bold: true })); }
        return items;
      }
      if (k <= 5) {
        var tax = v.p * 0.06;
        items.push(box('pa', 20, 40, 160, 'purchaseAmount', 'double', jd(v.p), {}));
        items.push(box('tx', 200, 40, 340, 'tax', 'double', jd(tax), k === 4 ? hot() : {}));
        if (k === 5) {
          items.push(T('s1', 280, 150, 'tax * 100 = ' + jd(tax * 100), { anchor: 'middle', mono: true, size: 14 }));
          items.push(T('s2', 280, 180, '(int)(...) = ' + jint(tax * 100), { anchor: 'middle', mono: true, size: 14, tone: 'accent' }));
          items.push(T('s3', 280, 210, jint(tax * 100) + ' / 100.0 = ' + jd(jint(tax * 100) / 100), { anchor: 'middle', mono: true, size: 15, bold: true, tone: 'teal' }));
        }
        return items;
      }
      items.push(stmt('st', 'int sum = 0;   sum += 4.5;'));
      items.push(T('eq', 280, 70, 'sum = (int)(sum + 4.5)', { anchor: 'middle', mono: true, tone: 'accent', bold: true }));
      items.push(T('c', 280, 110, '(int)(0 + 4.5) = (int)4.5 = 4', { anchor: 'middle', mono: true }));
      items.push(box('sum', 200, 150, 160, 'sum', 'int', 4, hot()));
      return items;
    }
  };

  /* ---------- 13. floating-point numbers are approximate (slide 30) ---------- */
  var approx = {
    id: 'approx', slides: [30, 30], title: 'Doubles are not exact',
    steps: (function () {
      var x = 1.0, st = [{ cap: 'Start with 1.0 and subtract 0.1 five times. In math the answer is 0.5.' }];
      for (var i = 1; i <= 5; i++) { x = x - 0.1; st.push({ cap: 'After ' + i + ' subtraction' + (i > 1 ? 's' : '') + ': ' + jd(x) + (i >= 3 ? '  (a tiny error appears)' : ''), out: i === 5 ? jd(x) : undefined }); }
      st.push({ cap: '<code>1.0 - 0.9</code> shows ' + jd(1.0 - 0.9) + ', not 0.1. Doubles are stored with a tiny rounding error. Integers are stored exactly.', out: jd(1.0 - 0.9) });
      return st;
    })(),
    draw: function (k) {
      var x = 1.0, vals = [1.0];
      for (var i = 1; i <= 5; i++) { x = x - 0.1; vals.push(x); }
      var items = [];
      vals.forEach(function (val, i) {
        if (i > k || k === 6) return;
        items.push(B('v' + i, 140, 20 + i * 46, 280, 38, { title: jd(val), mono: true, size: 15, tone: i === k ? 'accent' : 'teal', fill: i === k ? 'solid' : 'soft' }));
        if (i > 0) items.push(T('m' + i, 125, 44 + i * 46, '- 0.1', { anchor: 'end', mono: true, tone: 'muted', size: 13 }));
      });
      if (k === 6) {
        items.push(T('a', 280, 120, '1.0 - 0.9', { anchor: 'middle', mono: true, size: 20, bold: true }));
        items.push(B('r', 130, 150, 300, 50, { title: jd(1.0 - 0.9), mono: true, size: 17, tone: 'red', fill: 'solid' }));
        items.push(T('i', 280, 260, 'int math is exact: 10 - 9 = 1', { anchor: 'middle', tone: 'teal', bold: true }));
      }
      return items;
    }
  };

  /* ---------- 14. Math.pow (slide 31) ---------- */
  var pow = {
    id: 'pow', slides: [31, 31], title: 'Exponents with Math.pow(a, b)',
    inputs: [{ id: 'a', value: 2, min: -100, max: 100 }, { id: 'b', value: 3, min: -20, max: 20 }],
    presets: [{ label: 'pow(2, 3)', values: { a: 2, b: 3 } }, { label: 'pow(4, 0.5)', values: { a: 4, b: 0.5 } }, { label: 'pow(2.5, 2)', values: { a: 2.5, b: 2 } }, { label: 'pow(2.5, -2)', values: { a: 2.5, b: -2 } }],
    steps: function (v) {
      var r = Math.pow(v.a, v.b), how = Number.isInteger(v.b) && v.b > 0 ? Array(v.b + 1).join(jd(v.a) + ' x ').slice(0, -3) : v.b === 0.5 ? 'the square root of ' + jd(v.a) : v.b < 0 ? '1 / ' + jd(Math.pow(v.a, -v.b)) : '';
      return [
        { cap: '<code>Math.pow(a, b)</code> computes a to the power b: a<sup>b</sup>. It always gives a <b>double</b>.' },
        { cap: 'Math.pow(' + jd(v.a).replace(/\.0$/, '') + ', ' + jd(v.b).replace(/\.0$/, '') + ')' + (how ? ' = ' + how : '') + '.' },
        { cap: 'Result: <b>' + jd(r) + '</b> (a double, so 8 is shown as 8.0).', out: jd(r) }
      ];
    },
    draw: function (k, s, v) {
      var r = Math.pow(v.a, v.b);
      return [
        T('c', 280, 60, 'Math.pow(' + jd(v.a).replace(/\.0$/, '') + ', ' + jd(v.b).replace(/\.0$/, '') + ')', { anchor: 'middle', mono: true, bold: true, size: 22, tone: k === 0 ? 'accent' : 'ink' }),
        T('m', 280, 130, jd(v.a).replace(/\.0$/, '') + ' to the power ' + jd(v.b).replace(/\.0$/, ''), { anchor: 'middle', tone: k === 1 ? 'accent' : 'muted', size: 15 }),
        k === 2 ? B('r', 160, 170, 240, 60, { tag: 'double', title: jd(r), mono: true, size: 20, tone: 'teal', fill: 'solid' }) : null
      ];
    }
  };

  /* ---------- 15. literals (slides 32-35) ---------- */
  var literals = {
    id: 'literals', slides: [32, 35], title: 'Number literals',
    steps: [
      { slide: 32, cap: 'A <b>literal</b> is a value written directly in the code: 34, 1000000 and 5.0 are literals.' },
      { slide: 33, cap: '<code>byte b = 1000;</code> is a compile error: a byte holds only -128 to 127.' },
      { slide: 33, cap: 'An integer literal is an <b>int</b> by default. For a long literal, add <b>L</b>: <code>2147483648L</code>. (Use L, not l: l looks like 1.)' },
      { slide: 34, cap: 'A literal with a decimal point is a <b>double</b> by default: 5.0. Add <b>f</b>/<b>F</b> for a float (100.2f) or <b>d</b>/<b>D</b> for a double (100.2D).' },
      { slide: 35, cap: 'Scientific notation: <code>1.23456e2</code> means 1.23456 x 10<sup>2</sup> = <b>123.456</b>. The point moves 2 places right.' },
      { slide: 35, cap: '<code>1.23456e-2</code> means 1.23456 x 10<sup>-2</sup> = <b>0.0123456</b>. The point moves 2 places left.' }
    ],
    draw: function (k) {
      var items = [];
      if (k === 0) {
        [['int i = ', '34', ';'], ['long x = ', '1000000', ';'], ['double d = ', '5.0', ';']].forEach(function (l, i) {
          items.push(T('c' + i, 60, 70 + i * 60, l[0], { mono: true, size: 16 }));
          items.push(B('l' + i, 175 + (i === 2 ? 20 : 0), 46 + i * 60, l[1].length * 11 + 20, 36, { title: l[1], mono: true, size: 16, tone: 'accent', fill: 'solid' }));
        });
        items.push(T('n', 280, 300, 'the orange values are literals', { anchor: 'middle', tone: 'accent', bold: true }));
        return items;
      }
      if (k === 1) {
        items.push(T('c', 280, 60, 'byte b = 1000;', { anchor: 'middle', mono: true, size: 20, bold: true, tone: 'red' }));
        items.push(A('rg', 60, 160, 500, 160, { head: false, tone: 'muted', z: 0 }));
        items.push(B('rb', 150, 140, 120, 40, { title: '-128 … 127', mono: true, size: 13, tone: 'teal', fill: 'solid' }));
        items.push(T('v', 470, 130, '1000', { anchor: 'middle', mono: true, bold: true, tone: 'red', size: 16 }));
        items.push(T('e', 280, 240, 'too large for a byte → compile error', { anchor: 'middle', tone: 'red', bold: true }));
        return items;
      }
      if (k === 2) {
        items.push(B('i', 40, 50, 220, 60, { tag: 'int literal', title: '2147483647', mono: true, size: 16, tone: 'blue' }));
        items.push(B('L', 300, 50, 220, 60, { tag: 'long literal', title: '2147483648L', mono: true, size: 16, tone: 'teal', hi: true }));
        items.push(T('w', 280, 190, 'L  not  l     (l looks like 1)', { anchor: 'middle', mono: true, size: 16, bold: true, tone: 'accent' }));
        return items;
      }
      if (k === 3) {
        [['5.0', 'double (default)'], ['100.2f', 'float'], ['100.2D', 'double']].forEach(function (l, i) {
          items.push(B('f' + i, 40 + i * 170, 70, 150, 60, { tag: l[1], title: l[0], mono: true, size: 18, tone: i === 1 ? 'blue' : 'teal' }));
        });
        return items;
      }
      var neg = k === 5, digits = '123456'.split(''), point = neg ? -1 : 3;
      items.push(T('c', 280, 50, neg ? '1.23456e-2' : '1.23456e2', { anchor: 'middle', mono: true, size: 20, bold: true, tone: 'accent' }));
      var str = neg ? '0.0123456' : '123.456';
      str.split('').forEach(function (ch, i) { items.push(B('d' + i, 120 + i * 36, 130, 32, 46, { title: ch, mono: true, size: 18, tone: ch === '.' ? 'accent' : 'blue', fill: ch === '.' ? 'solid' : 'soft' })); });
      items.push(T('r', 280, 240, neg ? '= 0.0123456 (point 2 places left)' : '= 123.456 (point 2 places right)', { anchor: 'middle', tone: 'teal', bold: true }));
      return items;
    }
  };

  /* ---------- 16. evaluating an expression (slides 36-37) ---------- */
  function tok(s) { return s.match(/\d+|[-+*/%()]/g); }
  function evalSteps(src) {
    var t = tok(src), lines = [{ t: t.slice(), hi: -1 }];
    var guard = 0;
    while (t.length > 1 && guard++ < 30) {
      /* innermost parentheses */
      var open = -1, close = -1;
      for (var i = 0; i < t.length; i++) { if (t[i] === '(') open = i; if (t[i] === ')' && open >= 0) { close = i; break; } }
      var lo = 0, hi = t.length - 1;
      if (open >= 0) { lo = open + 1; hi = close - 1; }
      var seg = t.slice(lo, hi + 1), idx = -1;
      for (var j = 1; j < seg.length; j += 2) if ('*/%'.indexOf(seg[j]) >= 0) { idx = j; break; }
      if (idx < 0) idx = 1;
      var a = +seg[idx - 1], op = seg[idx], b = +seg[idx + 1];
      var r = op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : op === '/' ? jint(a / b) : a % b;
      lines[lines.length - 1].hi = lo + idx;
      lines[lines.length - 1].op = op;
      lines[lines.length - 1].par = open >= 0;
      seg.splice(idx - 1, 3, String(r));
      if (open >= 0 && seg.length === 1) t.splice(open, close - open + 1, seg[0]);
      else t.splice(lo, hi - lo + 1, ...seg);
      lines.push({ t: t.slice(), hi: -1 });
    }
    return lines;
  }
  var EXPRS = ['3 + 4 * 4 + 5 * (4 + 3) - 1', '10 - 2 * 3 + 8 / 4', '(1 + 2) * (3 + 4)', '7 / 2 * 2', '17 % 5 + 2 * 3'];
  var NAMES_OP = { '*': 'multiplication', '/': 'division', '%': 'remainder', '+': 'addition', '-': 'subtraction' };
  var expr = {
    id: 'expr', slides: [36, 37], title: 'How Java evaluates an expression', defaults: { e: 0 },
    presets: EXPRS.map(function (e, i) { return { label: i === 0 ? 'Slide 37' : e, values: { e: i } }; }),
    steps: function (v) {
      var L = evalSteps(EXPRS[v.e]);
      var st = [{ slide: 36, cap: 'A math formula becomes one Java line: <code>(3+4*x)/5 – 10*(y-5)*(a+b+c)/x + 9*(4/x + (9+x)/y)</code>. Use * for multiply, / for divide, and parentheses.' }];
      L.forEach(function (l, i) {
        if (i === L.length - 1) st.push({ slide: 37, cap: 'Done: the value is <b>' + l.t[0] + '</b>.' });
        else st.push({ slide: 37, cap: '(' + (i + 1) + ') ' + (l.par ? 'inside parentheses first: ' : '') + NAMES_OP[l.op] + '. Rule: parentheses first, then * / %, then + -, from left to right.' });
      });
      return st;
    },
    draw: function (k, s, v) {
      var items = [];
      if (k === 0) {
        items.push(T('m1', 40, 80, '3 + 4x      10(y − 5)(a + b + c)           4     9 + x', { mono: true, size: 13 }));
        items.push(T('m2', 40, 100, '──────  −  ───────────────────  + 9 ( ─── + ─────── )', { mono: true, size: 13 }));
        items.push(T('m3', 40, 120, '   5                 x                     x       y', { mono: true, size: 13 }));
        items.push(A('dn', 280, 140, 280, 190, { tone: 'accent', label: 'is translated to', la: 'start', lx: 8 }));
        items.push(T('j', 280, 230, '(3+4*x)/5 – 10*(y-5)*(a+b+c)/x + 9*(4/x + (9+x)/y)', { anchor: 'middle', mono: true, size: 12.5, bold: true, tone: 'teal' }));
        return items;
      }
      var L = evalSteps(EXPRS[v.e]), cur = k - 1;
      L.forEach(function (l, i) {
        if (i > cur) return;
        var w = 30, total = l.t.length * w, x0 = 280 - total / 2, y = 20 + i * 44;
        l.t.forEach(function (tk, j) {
          var isHi = i === cur && j === l.hi;
          items.push(B('l' + i + '-' + j, x0 + j * w, y, w - 3, 34, { title: tk, mono: true, size: tk.length > 2 ? 11 : 14, tone: isHi ? 'accent' : i === cur ? 'blue' : 'muted', fill: isHi ? 'solid' : 'soft', r: 4 }));
        });
      });
      return items;
    }
  };

  /* ---------- 17. Fahrenheit to Celsius (slide 38) ---------- */
  var temp = {
    id: 'temp', slides: [38, 38], title: 'Converting temperatures',
    inputs: [{ id: 'f', label: 'fahrenheit', value: 100, min: -500, max: 1000 }],
    presets: [{ label: '100 °F', values: { f: 100 } }, { label: '32 °F (freezing)', values: { f: 32 } }, { label: '212 °F (boiling)', values: { f: 212 } }, { label: '-40 °F', values: { f: -40 } }],
    steps: function (v) {
      var c = (5.0 / 9) * (v.f - 32);
      return [
        { cap: 'The formula: celsius = (5/9)(fahrenheit − 32). In Java: <code>celsius = (5.0 / 9) * (fahrenheit - 32);</code>' },
        { cap: 'fahrenheit − 32 = ' + jd(v.f) + ' − 32 = ' + jd(v.f - 32) + '.' },
        { cap: '5.0 / 9 = 0.5555555555555556. Then times ' + jd(v.f - 32) + ' = <b>' + jd(c) + '</b>.', out: 'Fahrenheit ' + jd(v.f) + ' is ' + jd(c) + ' in Celsius' },
        { cap: 'Careful! <code>5 / 9</code> (two ints) is <b>0</b>, so <code>(5 / 9) * (fahrenheit - 32)</code> always gives 0.0. Write 5.0 / 9.' }
      ];
    },
    draw: function (k, s, v) {
      var c = (5.0 / 9) * (v.f - 32);
      var items = [
        T('fm', 280, 40, 'celsius = (5.0 / 9) * (fahrenheit - 32);', { anchor: 'middle', mono: true, bold: true, size: 14, tone: k === 3 ? 'muted' : 'ink' }),
        box('fa', 40, 80, 200, 'fahrenheit', 'double', jd(v.f), k === 1 ? hot() : {}),
        box('ce', 320, 80, 200, 'celsius', 'double', k >= 2 && k < 3 ? jd(c) : k === 3 ? '0.0 ✗' : null, k === 2 ? hot() : k === 3 ? { tone: 'red', hi: true } : {})
      ];
      if (k === 1) items.push(T('s1', 280, 190, jd(v.f) + ' - 32 = ' + jd(v.f - 32), { anchor: 'middle', mono: true, size: 15, tone: 'accent' }));
      if (k === 2) items.push(T('s2', 280, 190, '0.5555555555555556 * ' + jd(v.f - 32), { anchor: 'middle', mono: true, size: 14, tone: 'accent' }));
      if (k === 3) { items.push(T('s3', 280, 190, '(5 / 9) = 0   (integer division!)', { anchor: 'middle', mono: true, size: 15, tone: 'red', bold: true })); items.push(T('s4', 280, 230, '0 * anything = 0', { anchor: 'middle', mono: true, size: 14, tone: 'red' })); }
      return items;
    }
  };

  /* ---------- 18. current time from milliseconds (slides 39-40) ---------- */
  var clock = {
    id: 'clock', slides: [39, 40], title: 'From milliseconds to hour:minute:second', defaults: { ms: 1203183068328 },
    presets: [{ label: '1203183068328 ms', values: { ms: 1203183068328 } }, { label: '0 ms (the Unix epoch)', values: { ms: 0 } }, { label: '86399999 ms', values: { ms: 86399999 } }, { label: '47142000 ms', values: { ms: 47142000 } }],
    steps: function (v) {
      var ts = Math.floor(v.ms / 1000), cs = ts % 60, tm = Math.floor(ts / 60), cm = tm % 60, th = Math.floor(tm / 60), ch = th % 24;
      return [
        { slide: 39, cap: '<code>System.currentTimeMillis()</code> gives the milliseconds since midnight, January 1, 1970 GMT. Here: ' + v.ms + '.' },
        { slide: 39, cap: 'Total seconds = ' + v.ms + ' / 1000 = ' + ts + '. Current second = ' + ts + ' % 60 = <b>' + cs + '</b>.' },
        { slide: 39, cap: 'Total minutes = ' + ts + ' / 60 = ' + tm + '. Current minute = ' + tm + ' % 60 = <b>' + cm + '</b>.' },
        { slide: 39, cap: 'Total hours = ' + tm + ' / 60 = ' + th + '. Current hour = ' + th + ' % 24 = <b>' + ch + '</b>.' },
        { slide: 40, cap: 'Display it as hour:minute:second.', out: 'Current time is ' + ch + ':' + cm + ':' + cs + ' GMT' }
      ];
    },
    draw: function (k, s, v) {
      var ts = Math.floor(v.ms / 1000), cs = ts % 60, tm = Math.floor(ts / 60), cm = tm % 60, th = Math.floor(tm / 60), ch = th % 24;
      var rows = [['totalMilliseconds', v.ms], ['totalSeconds', ts], ['totalMinutes', tm], ['totalHours', th]];
      var items = [];
      rows.forEach(function (r, i) { if (i <= k) items.push(B('r' + i, 20, 20 + i * 62, 300, 48, { tag: 'long ' + r[0], title: String(r[1]), mono: true, size: 15, tone: i === k ? 'accent' : 'blue', hi: i === k })); });
      [['currentSecond', cs, 1], ['currentMinute', cm, 2], ['currentHour', ch, 3]].forEach(function (c, i) { if (c[2] <= k) items.push(B('c' + i, 360, 20 + c[2] * 62, 180, 48, { tag: c[0], title: String(c[1]), mono: true, size: 17, tone: 'teal', hi: c[2] === k })); });
      if (k === 4) items.push(B('t', 120, 280, 320, 50, { title: ch + ':' + cm + ':' + cs, mono: true, size: 22, tone: 'accent', fill: 'solid' }));
      return items;
    }
  };

  /* ---------- 19. common errors (slides 41-45) ---------- */
  var mistakes = {
    id: 'mistakes', slides: [41, 45], title: 'Common errors and pitfalls',
    steps: [
      { slide: 41, cap: 'Five common errors and one pitfall. The next slides show them.' },
      { slide: 42, cap: 'Error 1: <code>interestRate</code> is declared, but the next line uses <code>interestrate</code>. Java is case-sensitive: that name is <b>undeclared</b> → compile error.' },
      { slide: 43, cap: 'Error 2: <b>integer overflow</b>. 2147483647 is the biggest int. Add 1 and it wraps around to -2147483648.' },
      { slide: 44, cap: 'Error 3: <b>round-off errors</b>. Doubles are approximate: 1.0 − 0.9 is 0.09999999999999998.', out: ['0.5000000000000001', '0.09999999999999998'] },
      { slide: 45, clear: true, cap: 'Error 4: <b>unintended integer division</b>. (a) (1 + 2) / 2 is 1 (int division), so average is 1.0.', out: '1.0' },
      { slide: 45, cap: '(b) Divide by 2.0 instead: (1 + 2) / 2.0 = 1.5. Now the answer is right.', out: '1.5' }
    ],
    draw: function (k) {
      var items = [];
      if (k === 0) {
        ['1. Undeclared / uninitialized / unused variables', '2. Integer overflow', '3. Round-off errors', '4. Unintended integer division', '5. Redundant input objects', 'Pitfall 1: Redundant input objects'].forEach(function (t, i) { items.push(T('e' + i, 40, 50 + i * 44, t, { bold: true, tone: i < 5 ? 'ink' : 'muted' })); });
        return items;
      }
      if (k === 1) {
        items.push(T('c1', 30, 70, 'double interestRate = 0.05;', { mono: true, size: 16 }));
        items.push(T('c2', 30, 120, 'double interest = interestrate * 45;', { mono: true, size: 16 }));
        items.push(B('m', 225, 128, 135, 32, { tone: 'red', fill: 'clear', dash: true }));
        items.push(T('e', 280, 220, 'interestrate ≠ interestRate  →  cannot find symbol', { anchor: 'middle', tone: 'red', bold: true, size: 13.5 }));
        return items;
      }
      if (k === 2) {
        items.push(A('ln', 40, 150, 520, 150, { head: false, tone: 'muted' }));
        items.push(B('mn', 20, 100, 170, 40, { title: '-2147483648', mono: true, size: 13.5, tone: 'red', fill: 'solid' }));
        items.push(B('mx', 370, 100, 170, 40, { title: '2147483647', mono: true, size: 13.5, tone: 'blue', fill: 'solid' }));
        items.push(A('wrap', 455, 160, 105, 160, { tone: 'red', bend: -60, label: '+ 1 wraps around', ly: 64 }));
        items.push(T('c', 280, 60, 'int value = 2147483647 + 1;', { anchor: 'middle', mono: true, size: 15, bold: true }));
        return items;
      }
      if (k === 3) {
        items.push(T('c1', 280, 80, '1.0 - 0.1 - 0.1 - 0.1 - 0.1 - 0.1', { anchor: 'middle', mono: true, size: 15 }));
        items.push(T('r1', 280, 115, '→ 0.5000000000000001', { anchor: 'middle', mono: true, size: 15, tone: 'red', bold: true }));
        items.push(T('c2', 280, 180, '1.0 - 0.9', { anchor: 'middle', mono: true, size: 15 }));
        items.push(T('r2', 280, 215, '→ 0.09999999999999998', { anchor: 'middle', mono: true, size: 15, tone: 'red', bold: true }));
        return items;
      }
      var good = k === 5;
      items.push(box('n1', 30, 40, 140, 'number1', 'int', 1, {}));
      items.push(box('n2', 200, 40, 140, 'number2', 'int', 2, {}));
      items.push(T('c', 280, 150, good ? 'average = (number1 + number2) / 2.0;' : 'average = (number1 + number2) / 2;', { anchor: 'middle', mono: true, size: 14, bold: true }));
      items.push(T('c2', 280, 185, good ? '3 / 2.0 = 1.5' : '3 / 2 = 1  (int division)', { anchor: 'middle', mono: true, size: 14, tone: good ? 'teal' : 'red' }));
      items.push(box('av', 370, 40, 160, 'average', 'double', good ? '1.5' : '1.0', good ? { tone: 'teal', hi: true } : { tone: 'red', hi: true }));
      items.push(T('lab', 280, 260, good ? '(b) correct' : '(a) wrong', { anchor: 'middle', bold: true, size: 18, tone: good ? 'teal' : 'red' }));
      return items;
    }
  };

  /* ---------- 20. format specifiers (slide 46) ---------- */
  var FMT = [['%d', '42', '42', 'an integer in base 10'], ['%o', '42', '52', 'an integer in base 8 (octal)'], ['%x', '42', '2a', 'an integer in base 16 (hexadecimal)'], ['%X', '42', '2A', 'hexadecimal with capital letters'], ['%f', '3.141593', '3.141593', 'a floating-point number'], ['%.2f', '3.141593', '3.14', 'a floating-point number with 2 decimal places'], ['%e', '1234500.0', '1.234500e+06', 'scientific notation'], ['%s', '"Hello"', 'Hello', 'a value as a string']];
  var format = {
    id: 'format', slides: [46, 46], title: 'Format specifiers with printf',
    steps: FMT.map(function (f) { return { cap: '<code>System.out.printf("' + f[0] + '", ' + f[1] + ');</code> prints ' + f[3] + ': <b>' + f[2] + '</b>' + (f[0] === '%.2f' ? '. (Remember slide 28: two digits after the point.)' : '.'), out: f[2], clear: true }; }),
    draw: function (k) {
      var f = FMT[k], items = [];
      items.push(T('c', 280, 50, 'System.out.printf("' + f[0] + '", ' + f[1] + ');', { anchor: 'middle', mono: true, size: 15, bold: true }));
      items.push(B('sp', 60, 90, 130, 60, { tag: 'specifier', title: f[0], mono: true, size: 22, tone: 'accent', fill: 'solid' }));
      items.push(A('a', 192, 120, 238, 120, { tone: 'accent' }));
      items.push(B('val', 240, 90, 130, 60, { tag: 'value', title: f[1], mono: true, size: 14, tone: 'blue' }));
      items.push(A('b', 372, 120, 398, 120, { tone: 'accent' }));
      items.push(B('out', 400, 90, 140, 60, { tag: 'output', title: f[2], mono: true, size: 16, tone: 'teal', fill: 'solid' }));
      FMT.forEach(function (g, i) { items.push(T('l' + i, 30 + i * 66, 260, g[0], { mono: true, size: 15, bold: i === k, tone: i === k ? 'accent' : 'muted' })); });
      items.push(T('nt', 280, 310, '\\n = new line     \\t = tab', { anchor: 'middle', mono: true, tone: 'muted', size: 13 }));
      return items;
    }
  };

  var ALL = [process, ident, vars, trace, types, ops, days, shortcut, scanner, incexpr, conv, cast, approx, pow, literals, expr, temp, clock, mistakes, format];

  function tbl(head, rows) {
    return '<div class="tblwrap"><table><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table></div>';
  }
  var para = function (t) { return { type: 'paragraph', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; }, code = function (t) { return { type: 'code', text: t }; };
  function braces(c) { var o = (c.match(/\{/g) || []).length, z = (c.match(/\}/g) || []).length; return o >= 2 && o === z; }

  addUnit({
    course: 'cs1', lesson: '03-elementary-programming',
    blurb: 'Variables and their types, assignment, numeric operators, reading input with Scanner, casting, literals, expressions, common errors and printf.',
    parts: [
      {
        title: 'Getting started', from: 1, to: 3,
        quiz: [
          { q: 'In the software development process, in which phase do you write the code?', options: ['Requirements specification', 'Deployment', 'Implementation'], answer: 2, why: 'Slide 3: implementation is where the program is written. This chapter is about it.' },
          { q: 'What does <b>IPO</b> mean in slide 3?', options: ['Install, Print, Open', 'Input, Process, Output', 'Integer, Point, Object'], answer: 1, why: 'Most simple programs read input, process it, and show output.' },
          { type: 'tf', q: 'After deployment, the work on a program is finished forever.', answer: false, why: 'The last phase is <b>maintenance</b>: the program is fixed and improved later.' },
          { type: 'order', lang: 'none', q: 'Put the first four phases in order.', lines: ['Requirements Specification', 'System Analysis', 'System Design', 'Implementation'], why: 'Understand what is needed, analyze, design, then write the code.' }
        ]
      },
      {
        title: 'Identifiers, variables and constants', from: 4, to: 9,
        quiz: [
          { q: 'Which one is a <b>legal</b> identifier?', options: ['2ndValue', 'my value', 'class', '$total'], answer: 3, why: 'It uses only a $ and letters. 2ndValue starts with a digit, my value has a space, and class is reserved.' },
          { q: 'What happens to the old value when you assign a new one?', code: 'int x = 5;\nx = 9;', options: ['The old value 5 is replaced: x is 9', 'x keeps both values: 5 and then 9', 'It is a compile error: x already has a value'], answer: 0, why: 'A variable holds one value. The new value replaces the old one.' },
          { type: 'output', q: 'What does this code print?', code: 'double radius = 2.0;\ndouble area = radius * radius * 3.14159;\nSystem.out.println("The area is " + area);', answer: 'The area is 12.56636', why: '2.0 * 2.0 * 3.14159 = 12.56636. The + joins the text and the number.' },
          { type: 'fill', q: 'Declare a constant for PI (slide 9).', code: '___ double PI = 3.14159;', answer: ['final'], why: 'The keyword <code>final</code> makes a constant: its value cannot change.' },
          { q: 'Which name follows the naming convention for a <b>variable</b>?', options: ['ComputeArea', 'COMPUTE_AREA', 'computeArea'], answer: 2, why: 'Variables start lowercase; the next words start with a capital (slide 8). ComputeArea is a class style, COMPUTE_AREA a constant style.' },
          { type: 'tf', q: 'An identifier can start with an underscore _.', answer: true, why: 'Slide 4: it must start with a letter, an underscore or a dollar sign.' }
        ]
      },
      {
        title: 'Tracing a program', from: 10, to: 14,
        quiz: [
          { q: 'After <code>double radius;</code>, what is the value of radius?', options: ['0', 'It has no value yet', '20'], answer: 1, why: 'Slide 10: the declaration allocates memory, but there is no value yet.' },
          { type: 'output', q: 'What is printed when radius is 10?', code: 'double radius = 10;\ndouble area = radius * radius * 3.14159;\nSystem.out.println("The area for the circle of radius " +\n  radius + " is " + area);', answer: 'The area for the circle of radius 10.0 is 314.159', why: 'radius is a double, so 10 is printed as 10.0. 10 * 10 * 3.14159 = 314.159.' },
          { type: 'order', q: 'Put the statements of ComputeArea in the order they run.', lines: ['double radius;', 'radius = 20;', 'area = radius * radius * 3.14159;', 'System.out.println(radius + " " + area);'], why: 'Declare, assign, compute, then display. You cannot use radius before it has a value.' },
          { q: 'In <code>"... radius " + radius + " is " + area</code>, what does + do?', options: ['Joins the pieces into one string', 'Adds radius and area as numbers', 'Makes a compile error: + needs numbers'], answer: 0, why: 'With a string, + joins (concatenates) the values into one string.' }
        ]
      },
      {
        title: 'Numeric types and operators', from: 15, to: 19,
        quiz: [
          { q: 'Which type would you choose for the number 3.75?', options: ['double', 'int', 'byte'], answer: 0, why: 'int, byte, short and long hold whole numbers only. double holds numbers with a decimal point.' },
          { type: 'output', q: 'What does this print?', code: 'System.out.println(5 / 2);', answer: '2', why: 'Both numbers are int, so the result is an int: the .5 is dropped (slide 18).' },
          { type: 'output', q: 'And this?', code: 'System.out.println(5.0 / 2);', answer: '2.5', why: 'One operand is a double, so the result is a double.' },
          { type: 'output', q: 'What does this print?', code: 'System.out.println(20 % 3);', answer: '2', why: '20 = 3 * 6 + 2. The remainder is 2.' },
          { q: 'Today is Saturday (day 6). What day is in 3 days? Use (6 + 3) % 7.', options: ['Monday (1)', 'Sunday (0)', 'Tuesday (2)'], answer: 2, why: '(6 + 3) % 7 = 9 % 7 = 2. Sunday is 0, Monday is 1, so day 2 is Tuesday.' },
          { q: 'How can you test if a number n is even?', options: ['n / 2 is 0', 'n % 2 is 0', 'n % 2 is 1'], answer: 1, why: 'Slide 19: an even number % 2 is always 0.' }
        ]
      },
      {
        title: 'Shortcut operators and input', from: 20, to: 24,
        quiz: [
          { type: 'output', q: 'What does this print?', code: 'int i = 10;\ni += 8;\nSystem.out.println(i);', answer: '18', why: '<code>i += 8</code> is the same as <code>i = i + 8</code>.' },
          { type: 'output', q: 'What does this print?', code: 'int i = 1;\nint j = i++;\nSystem.out.println(j + " " + i);', answer: '1 2', why: 'Postincrement: j gets the old value 1, then i becomes 2.' },
          { type: 'output', q: 'And with ++i?', code: 'int i = 1;\nint j = ++i;\nSystem.out.println(j + " " + i);', answer: '2 2', why: 'Preincrement: i becomes 2 first, then j gets 2.' },
          { type: 'fill', q: 'Read a whole number from the keyboard.', code: 'Scanner input = new Scanner(System.in);\nint age = input.___();', answer: ['nextInt'], why: 'nextInt() reads an integer of the int type (slide 22).' },
          { q: 'Which method reads a number of the double type?', options: ['nextDouble()', 'nextInt()', 'nextLong()'], answer: 0, why: 'Slide 22.' },
          { type: 'output', q: 'What does this print? (i starts at 10)', code: 'int i = 10;\nint newNum = 10 * i++;\nSystem.out.println(newNum + " " + i);', answer: '100 11', why: 'Slide 23: newNum = 10 * 10 = 100 first, then i = 11.' }
        ]
      },
      {
        title: 'Type conversion and casting', from: 25, to: 31,
        quiz: [
          { q: 'int + double gives which type?', options: ['double', 'int', 'long'], answer: 0, why: 'Rule 1 of slide 26: if one operand is double, the other is converted to double.' },
          { type: 'output', q: 'What does this print?', code: 'int i = (int)3.9;\nSystem.out.println(i);', answer: '3', why: 'The fraction part is truncated (cut off), not rounded.' },
          { q: 'What is wrong with <code>int x = 5 / 2.0;</code>?', options: ['You cannot divide an int by 2.0, so the division itself fails', '5 / 2.0 is a double (2.5), and a double cannot be stored in an int without a cast', 'Nothing is wrong: Java rounds 2.5 down to 2 by itself'], answer: 1, why: 'Slide 27. Narrowing needs an explicit cast.' },
          { type: 'output', q: 'What does this print?', code: 'int sum = 0;\nsum += 4.5;\nSystem.out.println(sum);', answer: '4', why: 'Slide 29: sum += 4.5 is sum = (int)(sum + 4.5) = 4.' },
          { type: 'fill', q: 'Keep two digits after the decimal point (slide 28).', code: 'double tax = 11.853;\nSystem.out.println((int)(tax * ___) / 100.0);', answer: ['100'], why: '11.853 * 100 = 1185.3, (int) gives 1185, and 1185 / 100.0 = 11.85.' },
          { type: 'output', q: 'What does this print?', code: 'System.out.println(Math.pow(2, 3));', answer: '8.0', why: 'Math.pow always returns a double.' }
        ]
      },
      {
        title: 'Literals and expressions', from: 32, to: 37,
        quiz: [
          { q: 'Why is <code>byte b = 1000;</code> a compile error?', options: ['byte cannot hold numbers, only characters', '1000 is too big for a byte (-128 to 127)', 'byte must be written with a capital B'], answer: 1, why: 'Slide 33.' },
          { q: 'What type is the literal <code>5.0</code>?', options: ['double', 'float', 'int'], answer: 0, why: 'Slide 34: by default a floating-point literal is a double.' },
          { type: 'fill', lang: 'none', q: 'Write 123.456 in scientific notation.', code: '123.456 = 1.23456e___', answer: ['2|+2'], why: '1.23456 x 10<sup>2</sup> = 123.456.' },
          { type: 'output', q: 'What does this print?', code: 'System.out.println(3 + 4 * 4 + 5 * (4 + 3) - 1);', answer: '53', why: 'Parentheses first (7), then 4 * 4 = 16 and 5 * 7 = 35, then 3 + 16 + 35 - 1 = 53.' },
          { type: 'output', q: 'And this one?', code: 'System.out.println(10 - 2 * 3 + 8 / 4);', answer: '6', why: '2 * 3 = 6 and 8 / 4 = 2 first; then 10 - 6 + 2 = 6.' },
          { q: 'Which suffix makes a long literal?', options: ['F', 'D', 'L'], answer: 2, why: 'Slide 33. Use L, because l looks like the digit 1.' }
        ]
      },
      {
        title: 'Problems: temperature and time', from: 38, to: 40,
        quiz: [
          { type: 'output', q: 'What does this print?', code: 'double fahrenheit = 212;\ndouble celsius = (5.0 / 9) * (fahrenheit - 32);\nSystem.out.println(celsius);', answer: '100.0', why: '(5.0 / 9) * 180 = 100.0.' },
          { q: 'Why does <code>(5 / 9) * (fahrenheit - 32)</code> always give 0.0?', options: ['The formula is wrong', '5 / 9 is integer division: 0', 'fahrenheit is 0'], answer: 1, why: 'Two ints → int result. 5 / 9 = 0, and 0 * anything = 0.' },
          { type: 'output', q: 'totalSeconds is 125. What is the current second?', code: 'long totalSeconds = 125;\nlong currentSecond = totalSeconds % 60;\nSystem.out.println(currentSecond);', answer: '5', why: '125 = 2 * 60 + 5.' },
          { q: 'What does <code>System.currentTimeMillis()</code> return?', options: ['The seconds since the program started', 'The current hour', 'The milliseconds since January 1, 1970 GMT'], answer: 2, why: 'Slide 39.' }
        ]
      },
      {
        title: 'Common errors and formatting', from: 41, to: 47,
        quiz: [
          { q: 'Why does this code not compile?', code: 'double interestRate = 0.05;\ndouble interest = interestrate * 45;', options: ['interestrate is not declared: Java is case-sensitive', '0.05 is too small to be stored in a double', 'You cannot multiply a double by an int like 45'], answer: 0, why: 'Slide 42: interestRate and interestrate are different names.' },
          { type: 'output', q: 'What does this print?', code: 'int value = 2147483647 + 1;\nSystem.out.println(value);', answer: '-2147483648', why: 'Integer overflow: the int wraps around to the smallest value (slide 43).' },
          { type: 'output', q: 'What does this print?', code: 'int number1 = 1;\nint number2 = 2;\ndouble average = (number1 + number2) / 2;\nSystem.out.println(average);', answer: '1.0', why: 'Slide 45(a): 3 / 2 is 1 (int division), then 1 is stored as 1.0.' },
          { type: 'fill', q: 'Fix the code so that the average is 1.5.', code: 'double average = (number1 + number2) / ___;', answer: ['2.0'], why: 'Slide 45(b): divide by 2.0.' },
          { type: 'output', q: 'What does this print?', code: 'System.out.printf("%.2f", 3.141593);', answer: '3.14', why: '%.2f shows two decimal places.' },
          { q: 'Which specifier prints 42 as <b>2a</b>?', options: ['%d', '%o', '%x'], answer: 2, why: '%x is hexadecimal: 42 = 2 x 16 + 10, and 10 is a.' }
        ]
      }
    ],
    slides: {
      1: { cover: true, image: false, title: '', blocks: [para('Chapter 2 Elementary Programming'), { type: 'note', text: 'An adapted version of the lecture notes associated with the textbook' }],
        explain: '<p>In this unit you start writing real programs: you store values in <b>{{variables|متغيّر}}</b>, calculate with them, read numbers from the keyboard and print results.</p>' },
      2: { image: false, explain: '<p>Last unit you learned to create, compile and run a program. Now you learn to <b>solve problems</b> with code. On the way you meet {{data types|نوع البيانات}}, variables, {{constants|ثابت}}, {{operators|عامل / مؤثّر}}, {{expressions|تعبير}}, input and output.</p>' },
      3: { explain: '<p>Making software has seven phases, like a staircase. The arrows also go back up: when you find a problem, you return to an earlier phase.</p><p>The middle phases follow the <b>IPO</b> idea: what is the <b>input</b>, what <b>process</b> is needed, and what is the <b>output</b>? This chapter is about <b>implementation</b>: writing the code.</p>' },
      4: { image: false, blocks: [bul('An identifier is a sequence of characters that consist of letters, digits, underscores (_), and dollar signs ($).'), bul('An identifier must start with a letter, an underscore (_), or a dollar sign ($). It cannot start with a digit.'), bul('An identifier cannot be a reserved word. (See Appendix A, “Java Keywords,” for a list of reserved words).'), { type: 'bullet', html: 'An identifier cannot be <code>true</code>, <code>false</code>, or <code>null</code>.' }, bul('An identifier can be of any length.')],
        explain: '<p>An <b>{{identifier|مُعرِّف / اسم}}</b> is a name you choose: for a variable, a method or a class. Four rules: only letters, digits, _ and $; it does not start with a digit; it is not a reserved word; it is not true, false or null.</p><p>Press the names above the drawing to test them.</p>' },
      5: { image: false, blocks: [code('int x;         // Declare x to be an\n               // integer variable;\ndouble radius; // Declare radius to\n               // be a double variable;\nchar a;        // Declare a to be a\n               // character variable;')],
        explain: '<p>A <b>variable</b> is a named box in memory. To <b>{{declare|يعلن / يعرّف}}</b> it, write its <b>type</b> and then its name: <code>int x;</code></p><ul><li><code>int</code>: a whole number.</li><li><code>double</code>: a number with a decimal point.</li><li><code>char</code>: one character.</li></ul>' },
      6: { image: false, blocks: [code('double radius;\nradius = 1.0;\ndouble area = radius * radius * 3.14159;\nSystem.out.println("The area is " + area + "\n  for radius "+radius);'), code('radius = 2.0;\narea = radius * radius * 3.14159;\nSystem.out.println("The area is " + area + "\n  for radius "+radius);\n// Declaring and Initializing in One Step:\nint year = 1435;')],
        explain: '<p>Variables can change. First radius is 1.0 and the area is 3.14159. Then radius becomes 2.0, and we compute the area again with the same formula.</p><p>You can also declare a variable and give it its first value in <b>one step</b>: <code>int year = 1435;</code></p><p>(Note: the string in the slide is split over two lines only to fit the slide.)</p>' },
      7: { image: false, blocks: [code('x = 1;          // Assign 1 to x;\nradius = 1.0;   // Assign 1.0 to radius;\na = \'A\';        // Assign \'A\' to a;')],
        explain: '<p>An <b>{{assignment|الإسناد: إعطاء قيمة}} statement</b> puts a value into a variable. The <code>=</code> sign does <b>not</b> mean “equal” here; it means “store the right side in the left side”. A char value goes between single quotes: <code>\'A\'</code>.</p>' },
      8: { image: false, blocks: [bul('Choose meaningful and descriptive names.'), { type: 'bullet', html: '<b>Variables and method names:</b> use lowercase. If the name consists of several words, concatenate all in one, use lowercase for the first word, and capitalize the first letter of each subsequent word in the name. For example, the variables <code>radius</code> and <code>area</code>, and the method <code>computeArea</code>.' }, { type: 'bullet', html: '<b>Class names:</b> capitalize the first letter of each word in the name. For example, the class name <code>ComputeArea</code>.' }],
        explain: '<p>Join the words with no spaces. For variables and methods, the first word is all lowercase and each next word starts with a capital: <code>computeArea</code>. For classes, every word starts with a capital: <code>ComputeArea</code>.</p>' },
      9: { image: false, blocks: [bul('Constants: capitalize all letters in constants and use underscores to connect words.'), code('final datatype CONSTANTNAME = value;\n//Examples\nfinal double PI = 3.14159;\nfinal int SIZE = 3;')],
        explain: '<p>A <b>constant</b> is a value that never changes, like PI. Write <code>final</code> before the type. If you try to change it later, the compiler stops you. Constant names are in CAPITALS, with _ between words.</p>' },
      10: { image: false, title: 'Introducing Programming with an Example', blocks: [{ type: 'h', html: 'Computing the Area of a Circle' }, code(COMPUTE)],
        explain: '<p>A full program: compute the area of a circle. Follow it in the drawing. The first line of main, <code>double radius;</code>, makes a box for radius, but the box has <b>no value</b> yet.</p><p>Try another radius above the drawing.</p>' },
      11: { image: false, blocks: [code(COMPUTE)], explain: '<p><code>double area;</code> makes a second box, for area. Still no values.</p>' },
      12: { image: false, blocks: [code(COMPUTE)], explain: '<p><code>radius = 20;</code> stores 20 in radius. Because radius is a double, Java keeps it as 20.0.</p>' },
      13: { image: false, blocks: [code(COMPUTE)], explain: '<p>The right side is computed first: 20 * 20 * 3.14159 = 1256.636. Then the result is stored in area.</p>' },
      14: { image: false, blocks: [code(COMPUTE)], explain: '<p>The last statement prints a message. The <code>+</code> joins text and numbers into one string: “The area for the circle of radius 20.0 is 1256.636”.</p>' },
      15: { image: false, blocks: [{ type: 'html', html: tbl(['Name', 'Range', 'Storage Size'], [['<code>byte</code>', '–2<sup>7</sup> to 2<sup>7</sup> – 1 (-128 to 127)', '8-bit signed'], ['<code>short</code>', '–2<sup>15</sup> to 2<sup>15</sup> – 1 (-32768 to 32767)', '16-bit signed'], ['<code>int</code>', '–2<sup>31</sup> to 2<sup>31</sup> – 1 (-2147483648 to 2147483647)', '32-bit signed'], ['<code>long</code>', '–2<sup>63</sup> to 2<sup>63</sup> – 1 (i.e., -9223372036854775808 to 9223372036854775807)', '64-bit signed'], ['<code>float</code>', 'Negative range: -3.4028235E+38 to -1.4E-45<br>Positive range: 1.4E-45 to 3.4028235E+38', '32-bit IEEE 754'], ['<code>double</code>', 'Negative range: -1.7976931348623157E+308 to -4.9E-324<br>Positive range: 4.9E-324 to 1.7976931348623157E+308', '64-bit IEEE 754']]) }],
        explain: '<p>Java has six number types. Four are for <b>whole numbers</b> (byte, short, int, long); each one is bigger than the one before. Two are for numbers with a <b>decimal point</b> (float and double).</p><p>You do not need to remember the long numbers. Remember: int is the normal whole-number type, double is the normal decimal type.</p>' },
      16: { image: false, blocks: [para('The double type values are more accurate than the float type values. For example,'), code('System.out.println("1.0 / 3.0 is " + 1.0 / 3.0);'), { type: 'note', text: 'displays 1.0 / 3.0 is 0.3333333333333333   (16 digits)' }, code('System.out.println("1.0F / 3.0F is " + 1.0F / 3.0F);'), { type: 'note', text: 'displays 1.0F / 3.0F is 0.33333334   (7 digits)' }],
        explain: '<p>A double keeps about 16 digits; a float only about 7. That is why we usually use <b>double</b>. The F after a number makes it a float.</p>' },
      17: { image: false, blocks: [{ type: 'html', html: tbl(['Name', 'Meaning', 'Example', 'Result'], [['<code>+</code>', 'Addition', '<code>34 + 1</code>', '35'], ['<code>-</code>', 'Subtraction', '<code>34.0 - 0.1</code>', '33.9'], ['<code>*</code>', 'Multiplication', '<code>300 * 30</code>', '9000'], ['<code>/</code>', 'Division', '<code>1.0 / 2.0</code>', '0.5'], ['<code>%</code>', 'Remainder', '<code>20 % 3</code>', '2']]) }],
        explain: '<p>Five operators for numbers. Two need care: <code>/</code> (division) and <code>%</code> ({{remainder|باقي القسمة}}). Try them with your own numbers in the drawing.</p>' },
      18: { image: false, blocks: [para('+, -, *, /, and %'), para('5 / 2 yields an integer 2.'), para('5.0 / 2 yields a double value 2.5'), para('5 % 2 yields 1 (the remainder of the division)')],
        explain: '<p>When <b>both</b> numbers are integers, <code>/</code> gives an integer: the fraction is thrown away. 5 / 2 is 2, not 2.5. If one number is a double, you get the full answer: 5.0 / 2 is 2.5.</p><p><code>%</code> gives what is left after dividing: 5 % 2 is 1.</p>' },
      19: { image: false, blocks: [para('Remainder is very useful in programming. For example, an even number % 2 is always 0 and an odd number % 2 is always 1. So you can use this property to determine whether a number is even or odd. Suppose today is Saturday and you and your friends are going to meet in 10 days. What day is in 10 days? You can find that day is Tuesday using the following expression:'), { type: 'code', lang: 'none', text: 'Saturday is the 6th day in a week\n       |              A week has 7 days\n       v              /\n   (6 + 10) % 7 is 2\n        ^             \\\n        |              The 2nd day in a week is Tuesday\n   After 10 days' }],
        explain: '<p>Two uses of <code>%</code>:</p><ul><li><b>Even or odd</b>: n % 2 is 0 for even numbers and 1 for odd numbers.</li><li><b>Things that repeat</b>, like the days of a week: (today + days) % 7 gives the day number. Saturday is 6, so (6 + 10) % 7 = 2 = Tuesday.</li></ul>' },
      20: { image: false, blocks: [{ type: 'html', html: tbl(['Operator', 'Name', 'Example', 'Equivalent'], [['<code>+=</code>', 'Addition assignment', '<code>i += 8</code>', '<code>i = i + 8</code>'], ['<code>-=</code>', 'Subtraction assignment', '<code>i -= 8</code>', '<code>i = i - 8</code>'], ['<code>*=</code>', 'Multiplication assignment', '<code>i *= 8</code>', '<code>i = i * 8</code>'], ['<code>/=</code>', 'Division assignment', '<code>i /= 8</code>', '<code>i = i / 8</code>'], ['<code>%=</code>', 'Remainder assignment', '<code>i %= 8</code>', '<code>i = i % 8</code>']]) }],
        explain: '<p>A short way to change a variable using its own value. <code>i += 8</code> means “add 8 to i”. The same idea works for -, *, / and %.</p>' },
      21: { image: false, blocks: [{ type: 'html', html: tbl(['Operator', 'Name', 'Description', 'Example (assume i = 1)'], [['<code>++var</code>', 'preincrement', 'Increment <code>var</code> by 1, and use the new <code>var</code> value in the statement', '<code>int j = ++i;</code><br><code>// j is 2, i is 2</code>'], ['<code>var++</code>', 'postincrement', 'Increment <code>var</code> by 1, but use the original <code>var</code> value in the statement', '<code>int j = i++;</code><br><code>// j is 1, i is 2</code>'], ['<code>--var</code>', 'predecrement', 'Decrement <code>var</code> by 1, and use the new <code>var</code> value in the statement', '<code>int j = --i;</code><br><code>// j is 0, i is 0</code>'], ['<code>var--</code>', 'postdecrement', 'Decrement <code>var</code> by 1, and use the original <code>var</code> value in the statement', '<code>int j = i--;</code><br><code>// j is 1, i is 0</code>']]) }],
        explain: '<p><code>++</code> adds 1 and <code>--</code> subtracts 1. The position matters when you use it inside a statement:</p><ul><li><b>Before</b> the name (<code>++i</code>): change first, then use the new value.</li><li><b>After</b> the name (<code>i++</code>): use the old value, then change.</li></ul>' },
      22: { image: false, blocks: [code(SCAN), { type: 'html', html: tbl(['Method', 'Description'], [['<code>nextByte()</code>', 'reads an integer of the <code>byte</code> type.'], ['<code>nextShort()</code>', 'reads an integer of the <code>short</code> type.'], ['<code>nextInt()</code>', 'reads an integer of the <code>int</code> type.'], ['<code>nextLong()</code>', 'reads an integer of the <code>long</code> type.'], ['<code>nextFloat()</code>', 'reads a number of the <code>float</code> type.'], ['<code>nextDouble()</code>', 'reads a number of the <code>double</code> type.']]) }],
        explain: '<p>To read from the keyboard, create a <b>Scanner</b> on <code>System.in</code>. Then call the method for the type you want: <code>nextInt()</code> for an int, <code>nextDouble()</code> for a double, and so on. The program waits until the user types a value and presses Enter.</p><p>Notice that the last two lines use <code>print</code>, so the two values are printed next to each other.</p>' },
      23: { image: false, blocks: [code('int i = 10;\nint newNum = 10 * i++;'), { type: 'note', text: 'Same effect as' }, code('int newNum = 10 * i;\ni = i + 1;'), code('int i = 10;\nint newNum = 10 * (++i);'), { type: 'note', text: 'Same effect as' }, code('i = i + 1;\nint newNum = 10 * i;')],
        explain: '<p>Inside an expression, <code>i++</code> gives the <b>old</b> value and <code>++i</code> gives the <b>new</b> value. So the two lines give different results: 100 or 110.</p>' },
      24: { image: false, explain: '<p>A tip: ++ and -- make code short, but inside a big expression they make it hard to understand. Use them alone, like <code>i++;</code></p>' },
      25: { image: false, explain: '<p>The values in one expression can have <b>different types</b>. Java converts them so the operation can be done. Look at the drawing: byte, long and double are mixed, and Java still computes the right values.</p>' },
      26: { image: false, blocks: [para('When performing a binary operation involving two operands of different types, Java automatically converts the operand based on the following rules:'), para('1. If one of the operands is double, the other is converted into double.'), para('2. Otherwise, if one of the operands is float, the other is converted into float.'), para('3. Otherwise, if one of the operands is long, the other is converted into long.'), para('4. Otherwise, both operands are converted into int.')],
        explain: '<p>The rules go from the biggest type down: double, float, long. The result has the type of the biggest operand. If no operand is double, float or long, both become <b>int</b> (even byte and short).</p><p>Press a pair of types above the drawing to follow the rules.</p>' },
      27: { image: false, blocks: [para('Implicit casting'), code('double d = 3; (type widening)'), para('Explicit casting'), code('int i = (int)3.0; (type narrowing)\nint i = (int)3.9; (Fraction part is truncated)'), para('What is wrong?    int x = 5 / 2.0;'), { type: 'code', lang: 'none', text: '          range increases\n   ------------------------------>\nbyte, short, int, long, float, double' }],
        explain: '<p><b>{{Casting|تحويل النوع}}</b> changes a value from one type to another.</p><ul><li>To a <b>bigger</b> type (widening): Java does it alone. <code>double d = 3;</code> stores 3.0.</li><li>To a <b>smaller</b> type (narrowing): you must write the cast, like <code>(int)</code>. The fraction is cut off: <code>(int)3.9</code> is 3.</li></ul>' },
      28: { image: false, explain: '<p>An exercise from the slides: show a sales tax with only two digits after the point. One way uses casting: multiply by 100, cast to int (this cuts the extra digits), then divide by 100.0. The drawing shows it with a 6% tax.</p>' },
      29: { image: false, explain: '<p>Augmented operators include a hidden cast. <code>sum += 4.5</code> works like <code>sum = (int)(sum + 4.5)</code>, so it is allowed, and sum becomes 4.</p>' },
      30: { image: false, explain: '<p>Doubles are stored with tiny rounding errors, so some answers look strange: 0.5000000000000001 instead of 0.5. Integers do not have this problem. Watch the error appear step by step in the drawing.</p>' },
      31: { image: false, explain: '<p><code>Math.pow(a, b)</code> computes a<sup>b</sup> (a to the power b). The result is always a double, so 8 is printed as 8.0. A power of 0.5 is a square root, and a negative power means 1 divided by the power.</p>' },
      32: { image: false, blocks: [para('A literal is a constant value that appears directly in the program.'), para('Examples:'), code('int i = 34;\nlong x = 1000000;\ndouble d = 5.0;')],
        explain: '<p>A <b>{{literal|قيمة حرفية مكتوبة في الكود}}</b> is a value you type directly into the code: 34, 1000000, 5.0. The variable names are not literals; the numbers are.</p>' },
      33: { image: false, explain: '<p>An integer literal must fit in its variable: 1000 does not fit in a byte. A whole-number literal is an <b>int</b>. If you need a bigger number, make it a long literal with <b>L</b> at the end.</p>' },
      34: { image: false, explain: '<p>A number with a decimal point is a <b>double</b> literal by default. Add <b>f</b> or <b>F</b> to make it a float, or <b>d</b> or <b>D</b> to say double clearly.</p>' },
      35: { image: false, blocks: [{ type: 'paragraph', html: 'Floating-point literals can also be specified in scientific notation in the form a x 10<sup>b</sup>.' }, { type: 'paragraph', html: 'For example, 123.456 = 1.23456 x 10<sup>2</sup> = 1.23456e+2, same as 1.23456e2.' }, para('Also, 1.23456e-2 is equivalent to 0.0123456. E (or e) represents an exponent, and it can be either in lowercase or uppercase.')],
        explain: '<p><b>{{Scientific notation|الصيغة العلمية}}</b> is a short way to write very big or very small numbers. The number after <b>e</b> tells how many places the decimal point moves: right for a positive number, left for a negative number.</p>' },
      36: { blocks: [para('is translated to'), code('(3+4*x)/5 – 10*(y-5)*(a+b+c)/x + 9*(4/x + (9+x)/y)')],
        explain: '<p>A math formula is written on one line in Java. Fractions become <code>/</code> with parentheses around the top and the bottom. Multiplication must be written with <code>*</code>: 4x becomes <code>4*x</code>.</p>' },
      37: { blocks: [para('Though Java has its own way to evaluate an expression behind the scene, the result of a Java expression and its corresponding arithmetic expression are the same. Therefore, you can safely apply the arithmetic rule for evaluating a Java expression.')],
        explain: '<p>Java uses the same order as math:</p><ol><li>inside parentheses first,</li><li>then *, / and %, from left to right,</li><li>then + and -, from left to right.</li></ol><p>Choose another expression above the drawing and follow each step.</p>' },
      38: { image: false, blocks: [para('Write a program that converts a Fahrenheit degree to Celsius using the formula:'), code('celsius = (5 / 9)(fahrenheit - 32)')],
        explain: '<p>A problem to solve. The math formula is celsius = (5/9)(fahrenheit − 32). In Java, write <code>(5.0 / 9) * (fahrenheit - 32)</code>. Why 5.0? Because 5 / 9 with two ints is 0! Try different temperatures in the drawing.</p>' },
      39: { blocks: [{ type: 'paragraph', html: 'The <code>currentTimeMillis</code> method in the <code>System</code> class returns the current time in milliseconds since the midnight, January 1, 1970 GMT. (1970 was the year when the Unix operating system was formally introduced.) You can use this method to obtain the current time, and then compute the current second, minute, and hour as follows.' }],
        explain: '<p>The computer counts time as milliseconds since 1 January 1970. To get the time of day, use <code>/</code> and <code>%</code> again and again: divide by 1000 for seconds; % 60 gives the current second; divide by 60 for minutes; and so on. The drawing does it step by step.</p>' },
      40: { image: false, explain: '<p>Homework from the slides: print the current GMT time as hour:minute:second. The drawing shows the method, so you can write it yourself.</p>' },
      41: { image: false, explain: '<p>A list of mistakes that beginners often make. Each one is shown in the next slides.</p>' },
      42: { image: false, title: 'Common Error 1: Undeclared/Uninitialized Variables and Unused Variables', blocks: [code('double interestRate = 0.05;\ndouble interest = interestrate * 45;')],
        explain: '<p>Java is <b>{{case-sensitive|يفرّق بين الحروف الكبيرة والصغيرة}}</b>: <code>interestRate</code> and <code>interestrate</code> are two different names. The second one was never declared, so the code does not compile. Also, a variable must have a value before you use it.</p>' },
      43: { image: false, title: 'Common Error 2: Integer Overflow', blocks: [code('int value = 2147483647 + 1;\n// value will actually be -2147483648')],
        explain: '<p>An int cannot go above 2147483647. If a calculation goes past it, the value <b>{{overflows|يفيض}}</b>: it wraps around to the most negative int. Java gives no error, so be careful with very big numbers.</p>' },
      44: { image: false, title: 'Common Error 3: Round-off Errors', blocks: [code('System.out.println(1.0 - 0.1 - 0.1 - 0.1 - 0.1 - 0.1);'), code('System.out.println(1.0 - 0.9);')],
        explain: '<p>The same problem as slide 30: doubles are approximate, so the results are a tiny bit off.</p>' },
      45: { image: false, blocks: [{ type: 'note', text: '(a)' }, code('int number1 = 1;\nint number2 = 2;\ndouble average = (number1 + number2) / 2;\nSystem.out.println(average);'), { type: 'note', text: '(b)' }, code('int number1 = 1;\nint number2 = 2;\ndouble average = (number1 + number2) / 2.0;\nSystem.out.println(average);')],
        explain: '<p>In (a) all the values are ints, so <code>3 / 2</code> is 1, and average gets 1.0. Storing the result in a double does not help: the division was already done with ints. In (b), dividing by <b>2.0</b> makes it a double division: 1.5.</p>' },
      46: { image: false, blocks: [{ type: 'html', html: tbl(['Format Specifier', 'Description', 'Example', 'Output'], [['%d', 'Format an integer as decimal (base 10)', '%d: ’42’', '42'], ['%o', 'Format an integer as octal (base 8)', '%o: ‘42’', '52'], ['%x or %X', 'Format an integer as hexadecimal (base 16)', '%x: ’42’ or %X: ’42’', '%x: 2a or %X: 2A'], ['%f', 'Format a floating-point number as decimal', '%f: ‘3.141593’', '3.141593'], ['%.nf', 'Format a floating-point number with n decimal places', '%.2f: ‘3.141593’', '3.14'], ['%e or %E', 'Format a floating-point number in scientific notation', '%e: ‘1.234500e+06’', '%E: 1.234500E+06'], ['%s', 'Format a value as a string', '%s: "Hello"', '"Hello"'], ['\\n, \\t', '', '', '']]) }],
        explain: '<p><code>System.out.printf</code> prints with a <b>format</b>. A specifier like <code>%d</code> or <code>%.2f</code> says how to show a value. <code>%.2f</code> is the easy way to show two digits after the point. <code>\\n</code> starts a new line and <code>\\t</code> adds a tab.</p>' },
      47: { image: false, cover: true, title: 'Questions?', blocks: [para('Questions?')], explain: '<p>The end of the chapter. Go to the unit exam to check what you learned.</p>' }
    },
    visuals: ALL,
    exam: {
      questions: [
        { q: 'Which one is <b>not</b> a legal identifier?', options: ['area', '3sides', '_count', '$price'], answer: 1, review: 4, why: 'An identifier cannot start with a digit.' },
        { type: 'output', q: 'What does this print?', code: 'int x = 7;\nx = x + 3;\nSystem.out.println(x);', answer: '10', review: 7, why: 'The right side is computed with the old x (7), then stored in x.' },
        { type: 'fill', q: 'Declare a constant named SIZE with the value 3.', code: '___ int SIZE = 3;', answer: ['final'], review: 9, why: 'Constants use the keyword final.' },
        { type: 'output', q: 'What does this print?', code: 'double radius = 1;\ndouble area = radius * radius * 3.14159;\nSystem.out.println("Area: " + area);', answer: 'Area: 3.14159', review: 13, why: '1 * 1 * 3.14159.' },
        { type: 'output', q: 'What does this print?', code: 'System.out.println(7 / 2);', answer: '3', review: 18, why: 'int / int gives an int.' },
        { type: 'output', q: 'What does this print?', code: 'System.out.println(7 % 2);', answer: '1', review: 18, why: '7 = 2 * 3 + 1.' },
        { q: 'Today is Wednesday (day 3). Which expression gives the day in 12 days?', options: ['(3 + 12) % 7', '(3 + 12) / 7', '3 + 12 % 7'], answer: 0, review: 19, why: '(3 + 12) % 7 = 1: Monday.' },
        { type: 'output', q: 'What does this print?', code: 'int i = 5;\ni *= 3;\nSystem.out.println(i);', answer: '15', review: 20, why: 'i *= 3 is i = i * 3.' },
        { type: 'output', q: 'What does this print?', code: 'int i = 5;\nint j = i--;\nSystem.out.println(i + " " + j);', answer: '4 5', review: 21, why: 'Postdecrement: j gets the old 5, then i becomes 4.' },
        { q: 'Which line reads a double from the keyboard?', options: ['double d = input.nextInt();', 'double d = input.nextDouble();', 'double d = System.in;'], answer: 1, review: 22, why: 'nextDouble() reads a number of the double type.' },
        { q: 'long + int gives which type?', options: ['int', 'double', 'long'], answer: 2, review: 26, why: 'Rule 3: if one operand is long, the other is converted to long.' },
        { type: 'output', q: 'What does this print?', code: 'System.out.println((int)7.99);', answer: '7', review: 27, why: 'Casting to int cuts off the fraction.' },
        { type: 'output', q: 'What does this print?', code: 'System.out.println(2 + 3 * (4 - 1));', answer: '11', review: 37, why: '(4 - 1) = 3, then 3 * 3 = 9, then 2 + 9 = 11.' },
        { q: 'What type is the literal <code>100.2f</code>?', options: ['float', 'double', 'int'], answer: 0, review: 34, why: 'The f makes it a float.' },
        { type: 'output', q: 'What does this print?', code: 'double average = (1 + 2) / 2;\nSystem.out.println(average);', answer: '1.0', review: 45, why: 'Unintended integer division: 3 / 2 = 1, stored as 1.0.' },
        { type: 'output', q: 'What does this print?', code: 'System.out.printf("%.1f", 2.75);', answer: '2.8', review: 46, why: '%.1f shows one decimal place (rounded).' },
        { type: 'write', q: 'input is a Scanner. Read an int into a new variable age, then print age + 1.', rows: 2, checks: [{ re: /int\s+age\s*=\s*input\s*\.\s*nextInt\s*\(\s*\)\s*;/, label: 'int age = input.nextInt();' }, { re: /System\s*\.\s*out\s*\.\s*println\s*\(\s*\(?\s*age\s*\+\s*1\s*\)?\s*\)\s*;/, label: 'System.out.println(age + 1);' }], solution: 'int age = input.nextInt();\nSystem.out.println(age + 1);', review: 22, why: 'nextInt() waits for the user and returns the int typed.' },
        { type: 'write', q: 'radius is a double. Store the area of a circle, 3.14159 × radius², in a new double variable area.', checks: [{ re: /double\s+area\s*=\s*(3\.14159\s*\*\s*radius\s*\*\s*radius|radius\s*\*\s*radius\s*\*\s*3\.14159)\s*;/, label: 'double area = radius * radius * 3.14159;' }], solution: 'double area = radius * radius * 3.14159;', review: 36, why: 'Java has no ² sign: write radius * radius.' },
        { type: 'output', q: 'What does this print?', code: 'int i = 3;\nint a = i++;\nint b = ++i;\nSystem.out.println(a + " " + b + " " + i);', answer: '3 5 5', review: 21, why: 'a gets the old value 3, then i becomes 4. ++i makes i 5 first, so b is 5.' },
        { type: 'bug', q: 'This code does not compile. Tap the wrong line.', code: 'double interestRate = 0.05;\ndouble interest = interestrate * 45;', answer: 2, review: 42, why: 'Java is case-sensitive: interestrate is not the declared interestRate.' },
        { type: 'match', q: 'Match each expression with its value.', pairs: [['20 / 6', '3'], ['20 % 6', '2'], ['20.0 / 8', '2.5']], review: 17, why: 'Two ints give an int (the quotient); % gives the remainder; with a double the result is a double.' },
        { type: 'fill', q: 'The line must print Total: 12.50. Complete the specifier.', code: 'System.out.printf("Total: ___", 12.5);', answer: ['%.2f'], review: 46, why: '%.2f prints a double with 2 digits after the point.' },
        { type: 'trace', q: 'totalSeconds is 4000. Find the time.', code: 'long currentSecond = totalSeconds % 60;\nlong totalMinutes = totalSeconds / 60;\nlong currentMinute = totalMinutes % 60;\nlong totalHours = totalMinutes / 60;', cols: ['currentSecond', 'totalMinutes', 'currentMinute', 'totalHours'], rows: [['?40', '?66', '?6', '?1']], review: 39, why: '4000 % 60 = 40; 4000 / 60 = 66; 66 % 60 = 6; 66 / 60 = 1. The time is 1:6:40.' }
      ],
      tasks: [
        {
          title: 'Area of a rectangle',
          task: '<p>Write a program like ComputeArea (slide 10), but for a <b>rectangle</b>:</p><ul><li>Declare two double variables, <code>width</code> and <code>height</code>, with the values 4.5 and 2.</li><li>Compute <code>area</code> = width times height.</li><li>Print <code>The area is 9.0</code> by joining the text and the variable with +.</li></ul>',
          starter: 'public class RectangleArea {\n  public static void main(String[] args) {\n    \n  }\n}',
          output: 'The area is 9.0',
          checks: [
            { re: /double\s+width\s*=\s*4\.5\s*;/, label: 'Declares <code>double width = 4.5;</code>', review: 6 },
            { re: /double\s+height\s*=\s*2(\.0)?\s*;/, label: 'Declares <code>double height = 2;</code>', review: 6 },
            { re: /(double\s+)?area\s*=\s*(width\s*\*\s*height|height\s*\*\s*width)\s*;/, label: 'Computes <code>area = width * height;</code>', review: 13 },
            { re: /double\s+area\b/, label: 'area is a double variable', review: 5 },
            { re: /System\.out\.println\s*\(\s*"The area is "\s*\+\s*area\s*\)\s*;/, label: 'Prints <code>"The area is " + area</code>', review: 14 },
            { fn: braces, label: 'Braces match', review: 10 }
          ],
          solution: 'public class RectangleArea {\n  public static void main(String[] args) {\n    double width = 4.5;\n    double height = 2;\n    double area = width * height;\n    System.out.println("The area is " + area);\n  }\n}'
        },
        {
          title: 'Seconds to minutes',
          task: '<p>Read a number of seconds from the keyboard and print it as minutes and seconds. For 500 the program prints <code>8 minutes and 20 seconds</code>.</p><ul><li>Use a Scanner and <code>nextInt()</code> (slide 22).</li><li>Use <code>/ 60</code> for the minutes and <code>% 60</code> for the remaining seconds (slides 18 and 39).</li></ul><p>The first line, <code>import java.util.Scanner;</code>, is already there: it lets the program use the Scanner.</p>',
          starter: 'import java.util.Scanner;\n\npublic class SecondsToMinutes {\n  public static void main(String[] args) {\n    \n  }\n}',
          output: 'Enter seconds: 500\n8 minutes and 20 seconds',
          checks: [
            { re: /Scanner\s+\w+\s*=\s*new\s+Scanner\s*\(\s*System\.in\s*\)\s*;/, label: 'Creates a Scanner on <code>System.in</code>', review: 22 },
            { re: /int\s+\w+\s*=\s*\w+\.nextInt\s*\(\s*\)\s*;/, label: 'Reads an int with <code>nextInt()</code>', review: 22 },
            { re: /\w+\s*\/\s*60\b/, label: 'Computes the minutes with <code>/ 60</code>', review: 18 },
            { re: /\w+\s*%\s*60\b/, label: 'Computes the remaining seconds with <code>% 60</code>', review: 19 },
            { re: /System\.out\.println\s*\([^;]*"\s*minutes and\s*"[^;]*"\s*seconds"\s*\)\s*;/, label: 'Prints "… minutes and … seconds"', review: 14 },
            { fn: braces, label: 'Braces match', review: 10 }
          ],
          solution: 'import java.util.Scanner;\n\npublic class SecondsToMinutes {\n  public static void main(String[] args) {\n    Scanner input = new Scanner(System.in);\n    System.out.print("Enter seconds: ");\n    int seconds = input.nextInt();\n    int minutes = seconds / 60;\n    int remaining = seconds % 60;\n    System.out.println(minutes + " minutes and " + remaining + " seconds");\n  }\n}'
        },
        {
          title: 'Fix the average',
          task: '<p>This is code (a) from slide 45. It prints <code>1.0</code>, but the average of 1 and 2 is 1.5. Fix the <b>unintended integer division</b> so that it prints <code>1.5</code>. Keep number1 and number2 as ints.</p>',
          starter: 'public class Average {\n  public static void main(String[] args) {\n    int number1 = 1;\n    int number2 = 2;\n    double average = (number1 + number2) / 2;\n    System.out.println(average);\n  }\n}',
          output: '1.5',
          checks: [
            { re: /int\s+number1\s*=\s*1\s*;/, label: 'number1 is still an int', review: 45 },
            { re: /int\s+number2\s*=\s*2\s*;/, label: 'number2 is still an int', review: 45 },
            { re: /double\s+average\s*=\s*(\(\s*number1\s*\+\s*number2\s*\)\s*\/\s*2\.0|\(\s*number1\s*\+\s*number2\s*\)\s*\/\s*\(double\)\s*2|\(double\)\s*\(\s*number1\s*\+\s*number2\s*\)\s*\/\s*2)\s*;/, label: 'The division is a double division (for example <code>/ 2.0</code>)', review: 45 },
            { re: /System\.out\.println\s*\(\s*average\s*\)\s*;/, label: 'Prints average', review: 14 }
          ],
          solution: 'public class Average {\n  public static void main(String[] args) {\n    int number1 = 1;\n    int number2 = 2;\n    double average = (number1 + number2) / 2.0;\n    System.out.println(average);\n  }\n}'
        }
      ]
    }
  });
})();
