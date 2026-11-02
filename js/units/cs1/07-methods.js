/* CS1 · Unit 7 · Methods (51 slides): defining and calling methods, signature, parameters, return, modular code,
   scope of local variables, pass-by-value, call stacks, overloading, and case studies (hex, random characters, maximum, pay) */
(function () {
  function mix(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }
  function jd(x) {
    if (isNaN(x)) return 'NaN';
    if (x === 0) return Object.is(x, -0) ? '-0.0' : '0.0';
    var a = Math.abs(x);
    if (a >= 1e-3 && a < 1e7) { var s = String(x); return s.indexOf('.') < 0 ? s + '.0' : s; }
    var e = x.toExponential().split('e'), m = e[0];
    return (m.indexOf('.') < 0 ? m + '.0' : m) + 'E' + Number(e[1]);
  }
  function I(x) { return Math.trunc(x); }
  function h(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function jch(c) { return c === "'" ? "'\\''" : c === '\\' ? "'\\\\'" : "'" + c + "'"; }
  function vbox(id, x, y, w, name, type, value, o) {
    return B(id, x, y, w, 48, mix({ tag: type + ' ' + name, title: value == null ? 'no value' : String(value), mono: true, size: 16, tone: value == null ? 'muted' : 'teal', dash: value == null, r: 6 }, o || {}));
  }
  function hot(o) { return mix(o || {}, { tone: 'accent', hi: true }); }
  /* a frame (activation record) on the call stack */
  function frame(id, x, y, w, name, vars, o) {
    o = o || {};
    return B(id, x, y, w, boxH(vars.length), mix({ title: name, band: true, mono: true, lsize: 13, size: 12,
      lines: vars.map(function (v) { return { t: v[0] + ': ' + (v[1] == null ? '' : v[1]), b: !!v[2], tone: v[2] ? 'accent' : undefined }; }), tone: o.tone || 'blue', hi: !!o.hi }, o.extra || {}));
  }

  /* ---------- 1. the parts of a method (slides 3-8) ---------- */
  var MAXDEF = 'public static int max(int num1, int num2) {\n  int result;\n  if (num1 > num2)\n    result = num1;\n  else\n    result = num2;\n  return result;\n}\n\nint z = max(x, y);';
  var PARTS = [['mod', 'public static', 'modifier'], ['rt', 'int', 'return value type'], ['nm', 'max', 'method name'], ['pl', '(int num1, int num2)', 'formal parameters']];
  var anatomy = {
    id: 'anatomy', slides: [3, 8], title: 'The parts of a method', code: MAXDEF,
    steps: [
      { slide: 3, line: '1-8', on: ['all'], cap: 'A <b>method</b> is a group of statements with a name. This one, max, finds the bigger of two ints.' },
      { slide: 4, line: 1, on: ['mod'], cap: '<code>public static</code> are <b>modifiers</b>. For now every method you write starts with them.' },
      { slide: 4, line: 1, on: ['rt'], cap: '<code>int</code> is the <b>return value type</b>: the type of the value the method gives back.' },
      { slide: 4, line: 1, on: ['nm'], cap: '<code>max</code> is the <b>method name</b>.' },
      { slide: 4, line: 1, on: ['head'], cap: 'The whole first line is the <b>method header</b>. The part in braces is the <b>method body</b>.' },
      { slide: 4, line: 7, on: ['ret'], cap: '<code>return result;</code> sends the <b>return value</b> back to the caller and ends the method.' },
      { slide: 5, line: 1, on: ['nm', 'pl'], cap: 'The <b>method signature</b> is the name plus the parameter list: <code>max(int num1, int num2)</code>.' },
      { slide: 6, line: 1, on: ['pl'], cap: 'The variables in the header, <code>num1</code> and <code>num2</code>, are the <b>formal parameters</b>.' },
      { slide: 7, line: 10, on: ['call'], cap: 'To use the method, <b>invoke</b> (call) it: <code>max(x, y)</code>. The values of x and y are the <b>actual parameters</b>, also called <b>arguments</b>.' },
      { slide: 8, line: 1, on: ['rt'], cap: 'If a method returns nothing, its return value type is <code>void</code>, like <code>public static void main</code>.' }
    ],
    draw: function (k, s) {
      var on = function (id) { return s.on.indexOf(id) >= 0 || s.on.indexOf('all') >= 0; }, items = [], x = 20;
      var ws = { mod: 120, rt: 40, nm: 44, pl: 190 };
      PARTS.forEach(function (p) {
        var w = ws[p[0]], lit = on(p[0]) || on('head');
        items.push(B('p' + p[0], x, 46, w, 40, { title: p[1], mono: true, size: 13, tone: lit ? 'accent' : 'blue', hi: on(p[0]) }));
        if (on(p[0]) && s.on.indexOf('all') < 0) items.push(T('l' + p[0], x + w / 2, 30, p[2], { anchor: 'middle', size: 12, bold: true, tone: 'accent' }));
        x += w + 6;
      });
      items.push(T('br', x + 4, 72, '{', { mono: true, size: 18, bold: true }));
      if (on('nm') && on('pl') && s.on.indexOf('all') < 0) items.push(A('sig', 192, 96, 432, 96, { head: false, tone: 'accent', label: 'method signature', ly: 22 }));
      items.push(B('body', 40, 120, 300, boxH(5), { title: 'method body', band: true, mono: true, lsize: 12, lines: ['int result;', 'if (num1 > num2) result = num1;', 'else result = num2;', { t: 'return result;', b: on('ret'), tone: on('ret') ? 'accent' : undefined }, '}'], tone: on('head') ? 'muted' : 'teal', hi: on('ret') }));
      items.push(B('call', 380, 130, 160, 60, { tag: 'invoke a method', title: 'int z = max(x, y);', mono: true, size: 12, tone: on('call') ? 'accent' : 'muted', hi: on('call') }));
      if (on('call')) items.push(T('args', 460, 212, 'x, y: actual parameters', { anchor: 'middle', size: 12, bold: true, tone: 'accent' }));
      if (k === 9) items.push(T('void', 460, 260, 'void = returns nothing', { anchor: 'middle', size: 13, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 2. a return on every path (slide 9) ---------- */
  var sign = {
    id: 'sign', slides: [9, 9], title: 'Every path must reach a return',
    inputs: [{ id: 'n', label: 'n', value: -7, min: -100, max: 100 }],
    presets: [{ label: 'n = -7', values: { n: -7 } }, { label: 'n = 0', values: { n: 0 } }, { label: 'n = 4', values: { n: 4 } }],
    code: 'public static int sign(int n) {\n  if (n > 0)\n    return 1;\n  else if (n == 0)\n    return 0;\n  else\n    return -1;\n}',
    steps: function (v) {
      var n = I(v.n), r = n > 0 ? 1 : n === 0 ? 0 : -1;
      return [
        { line: 6, ph: 'a', cap: 'Version (a) ends with <code>else if (n < 0) return -1;</code>. We know one of the three tests is always true, but the <b>compiler</b> does not reason like that: it sees a path where no return is reached, and stops with an error (missing return statement).' },
        { ph: 'b', line: '6-7', cap: 'Version (b) ends with a plain <code>else</code>. Now every path ends in a return, so it compiles. This is the fix: delete <code>if (n < 0)</code>.' },
        { ph: 'run', line: n > 0 ? '2-3' : n === 0 ? '4-5' : '6-7', cap: 'Run (b) with n = ' + n + ': ' + (n > 0 ? 'n > 0 is true' : n === 0 ? 'n == 0 is true' : 'both tests are false, so the else') + ', and the method returns <b>' + r + '</b>.' }
      ];
    },
    draw: function (k, s, v) {
      var n = I(v.n), path = n > 0 ? 0 : n === 0 ? 1 : 2, items = [];
      var la = ['if (n > 0)', '  return 1;', 'else if (n == 0)', '  return 0;', 'else if (n < 0)', '  return -1;', '// what if no test is true?'];
      var lb = ['if (n > 0)', '  return 1;', 'else if (n == 0)', '  return 0;', 'else', '  return -1;'];
      items.push(B('a', 20, 40, 250, boxH(la.length), { tag: '(a) compile error', lines: la.map(function (t, i) { return { t: t, tone: i === 4 ? 'red' : i === 6 ? 'red' : undefined, b: i === 4 }; }), mono: true, lsize: 12, tone: k === 0 ? 'red' : 'muted', hi: k === 0 }));
      items.push(B('b', 290, 40, 250, boxH(lb.length), { tag: '(b) should be', lines: lb.map(function (t, i) { return { t: t, tone: k === 2 && (i === path * 2 || i === path * 2 + 1) ? 'accent' : i === 4 && k === 1 ? 'teal' : undefined, b: k === 2 && i === path * 2 + 1 }; }), mono: true, lsize: 12, tone: k >= 1 ? 'teal' : 'muted', hi: k >= 1 }));
      if (k === 2) items.push(T('r', 415, 230, 'sign(' + n + ') returns ' + (n > 0 ? 1 : n === 0 ? 0 : -1), { anchor: 'middle', mono: true, bold: true, size: 15, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 3. calling max (slide 10) ---------- */
  var TESTMAX = 'public class TestMax {\n  /** Main method */\n  public static void main(String[] args) {\n    int i = 5;\n    int j = 2;\n    int k = max(i, j);\n    System.out.println("The maximum between " + i +\n      " and " + j + " is " + k);\n  }\n\n  /** Return the max between two numbers */\n  public static int max(int num1, int num2) {\n    int result;\n\n    if (num1 > num2)\n      result = num1;\n    else\n      result = num2;\n\n    return result;\n  }\n}';
  function TM(v) { return TESTMAX.replace('int i = 5;', 'int i = ' + I(v.i) + ';').replace('int j = 2;', 'int j = ' + I(v.j) + ';'); }
  var testmax = {
    id: 'testmax', slides: [10, 10], title: 'Control goes into max and comes back', code: TM,
    inputs: [{ id: 'i', label: 'i', value: 5, min: -99, max: 99 }, { id: 'j', label: 'j', value: 2, min: -99, max: 99 }],
    presets: [{ label: '5, 2 (slide)', values: { i: 5, j: 2 } }, { label: '2, 5', values: { i: 2, j: 5 } }, { label: '4, 4', values: { i: 4, j: 4 } }, { label: '-3, -8', values: { i: -3, j: -8 } }],
    steps: function (v) {
      var i = I(v.i), j = I(v.j), r = i > j ? i : j;
      return [
        { line: '4-5', at: 'main', cap: 'The program starts in main: i = ' + i + ', j = ' + j + '.' },
        { line: 6, at: 'call', cap: '<code>max(i, j)</code> calls the method. Java <b>jumps</b> to max and copies the values: num1 = ' + i + ', num2 = ' + j + '.' },
        { line: 15, at: 'max', cap: 'Inside max: is ' + i + ' > ' + j + '? <b>' + (i > j) + '</b>, so result = ' + (i > j ? 'num1' : 'num2') + ' = ' + r + '.' + (i === j ? ' (When they are equal, the else gives num2: the same number.)' : '') },
        { line: 20, at: 'ret', cap: '<code>return result;</code> ends max and sends ' + r + ' back to the place of the call.' },
        { line: 6, at: 'back', cap: 'Back in main: the call <code>max(i, j)</code> is replaced by its value, so k = ' + r + '.' },
        { line: '7-8', at: 'print', cap: 'Print the result.', out: 'The maximum between ' + i + ' and ' + j + ' is ' + r }
      ];
    },
    draw: function (k, s, v) {
      var i = I(v.i), j = I(v.j), r = i > j ? i : j, items = [], inMax = s.at === 'call' || s.at === 'max' || s.at === 'ret';
      items.push(B('main', 20, 30, 240, 160, { tag: 'main', fill: 'none', tone: inMax ? 'muted' : 'accent', hi: !inMax, z: 0 }));
      items.push(vbox('vi', 36, 50, 100, 'i', 'int', i, {}), vbox('vj', 146, 50, 100, 'j', 'int', j, {}));
      items.push(vbox('vk', 36, 124, 210, 'k', 'int', s.at === 'back' || s.at === 'print' ? r : null, s.at === 'back' ? hot() : {}));
      items.push(B('mx', 300, 30, 240, 160, { tag: 'max', fill: 'none', tone: inMax ? 'accent' : 'muted', hi: inMax, z: 0 }));
      if (inMax) {
        items.push(vbox('n1', 316, 50, 100, 'num1', 'int', i, s.at === 'call' ? hot() : {}), vbox('n2', 426, 50, 100, 'num2', 'int', j, s.at === 'call' ? hot() : {}));
        items.push(vbox('res', 316, 124, 210, 'result', 'int', s.at === 'call' ? null : r, s.at === 'max' ? hot() : {}));
      }
      if (s.at === 'call') items.push(A('pass', 250, 74, 312, 74, { tone: 'accent', label: 'copy values' }));
      if (s.at === 'ret') items.push(A('back', 312, 148, 250, 148, { tone: 'teal', label: 'return ' + r }));
      if (s.at === 'print') items.push(T('out', 280, 250, 'The maximum between ' + i + ' and ' + j + ' is ' + r, { anchor: 'middle', mono: true, size: 14, bold: true, tone: 'teal' }));
      return items;
    }
  };

  /* ---------- 4. a black box (slides 11-12) ---------- */
  var blackbox = {
    id: 'blackbox', slides: [11, 12], title: 'A method is a black box',
    steps: [
      { slide: 11, ph: 'head', cap: 'The <b>method header</b> is all a caller needs to know: the name, what goes in, what comes out.' },
      { slide: 11, ph: 'in', cap: 'Optional <b>arguments</b> go in as input.' },
      { slide: 11, ph: 'out', cap: 'An optional <b>return value</b> comes out.' },
      { slide: 11, ph: 'box', cap: 'The <b>method body</b> is a black box: the caller does not see, and does not need to know, how it works inside.' },
      { slide: 12, ph: 'b1', cap: 'Benefit 1: write a method <b>once</b> and reuse it anywhere.' },
      { slide: 12, ph: 'b2', cap: 'Benefit 2: <b>information hiding</b>: the implementation is hidden from the user.' },
      { slide: 12, ph: 'b3', cap: 'Benefit 3: <b>reduce complexity</b>: a big problem becomes small named pieces. The next slides show how to think this way.' }
    ],
    draw: function (k, s) {
      var items = [];
      items.push(B('hd', 150, 120, 260, 44, { title: 'Method Header', size: 16, tone: s.ph === 'head' ? 'accent' : 'blue', hi: s.ph === 'head' }));
      items.push(B('bd', 150, 164, 260, 90, { title: 'Method body', size: 16, tone: s.ph === 'box' ? 'accent' : 'ink', fill: 'solid', hi: s.ph === 'box' }));
      items.push(A('ain', 210, 40, 210, 116, { tone: s.ph === 'in' ? 'accent' : 'muted', label: 'arguments in', la: 'end', lx: -8, ly: 30 }));
      items.push(A('aout', 350, 116, 350, 40, { tone: s.ph === 'out' ? 'accent' : 'muted', label: 'return value out', la: 'start', lx: 8, ly: 30 }));
      items.push(A('abb', 520, 209, 416, 209, { tone: s.ph === 'box' ? 'accent' : 'muted', label: 'black box', la: 'middle', ly: -4 }));
      if (k >= 4) ['write once, reuse', 'hide the details', 'less complexity'].forEach(function (t, i) {
        items.push(B('bn' + i, 20 + i * 180, 280, 160, 44, { title: t, size: 13, tone: k - 4 === i ? 'accent' : 'teal', hi: k - 4 === i }));
      });
      return items;
    }
  };

  /* ---------- 5. from copies to one method (slides 13-15) ---------- */
  var SUMM = 'public static int sum(int i1, int i2) {\n  int sum = 0;\n  for (int i = i1; i <= i2; i++)\n    sum += i;\n  return sum;\n}\n\npublic static void main(String[] args) {\n  System.out.println("Sum from 1 to 10 is " + sum(1, 10));\n  System.out.println("Sum from 20 to 30 is " + sum(20, 30));\n  System.out.println("Sum from 35 to 45 is " + sum(35, 45));\n}';
  var RANGES = [[1, 10], [20, 30], [35, 45]];
  function sumR(a, b) { var s = 0; for (var i = a; i <= b; i++) s += i; return s; }
  var sums = {
    id: 'sums', slides: [13, 15], title: 'Three copies become one method', code: SUMM,
    steps: [
      { line: '9-11', slide: 13, ph: 'copies', cap: 'A typical solution writes the same loop <b>three</b> times. Only the start and the end numbers change.' },
      { line: '3-4', slide: 14, ph: 'same', cap: 'Notice: the colored parts are the same, except two numbers. Repeated code is hard to change and easy to get wrong.' },
      { slide: 15, line: '1-6', ph: 'method', cap: 'A better solution: put the loop in a method, and make the two numbers <b>parameters</b>: i1 and i2.' },
      { slide: 15, line: 9, ph: 'c0', out: 'Sum from 1 to 10 is 55', cap: '<code>sum(1, 10)</code>: i1 = 1, i2 = 10, the method returns 55.' },
      { slide: 15, line: 10, ph: 'c1', out: 'Sum from 20 to 30 is 275', cap: '<code>sum(20, 30)</code> uses the <b>same</b> code with other values: 275.' },
      { slide: 15, line: 11, ph: 'c2', out: 'Sum from 35 to 45 is 440', cap: '<code>sum(35, 45)</code>: 440. One method, three calls.' }
    ],
    draw: function (k, s) {
      var items = [];
      if (k <= 1) {
        RANGES.forEach(function (r, i) {
          var y = 20 + i * 104;
          items.push(B('cp' + i, 30, y, 330, boxH(3), { lines: ['sum = 0;', { t: 'for (int i = ' + r[0] + '; i <= ' + r[1] + '; i++)', b: k === 1 }, '  sum += i;'], mono: true, lsize: 12, tone: k === 1 ? 'accent' : 'blue', hi: k === 1 }));
          if (k === 1) items.push(T('dif' + i, 380, y + 50, 'only ' + r[0] + ' and ' + r[1] + ' change', { size: 13, bold: true, tone: 'accent' }));
        });
        return items;
      }
      var c = s.ph.charAt(0) === 'c' ? +s.ph.charAt(1) : -1;
      items.push(B('m', 150, 20, 260, boxH(4), { title: 'sum(int i1, int i2)', band: true, mono: true, lsize: 12, lines: ['int sum = 0;', 'for (int i = i1; i <= i2; i++)', '  sum += i;', 'return sum;'], tone: c >= 0 ? 'accent' : 'teal', hi: true }));
      RANGES.forEach(function (r, i) {
        var x = 20 + i * 180, on = i === c, done = i <= c;
        items.push(B('call' + i, x, 210, 160, 44, { title: 'sum(' + r[0] + ', ' + r[1] + ')', mono: true, size: 14, tone: on ? 'accent' : done ? 'teal' : 'muted', hi: on }));
        if (done) items.push(T('rv' + i, x + 80, 280, '→ ' + sumR(r[0], r[1]), { anchor: 'middle', mono: true, size: 15, bold: on, tone: on ? 'accent' : 'teal' }));
        if (on) items.push(A('ca' + i, x + 80, 206, 280, 136, { tone: 'accent', dash: true }));
      });
      return items;
    }
  };

  /* ---------- 6. getGrade returns a char (slide 16) ---------- */
  function GG(v) { return 'public class TestReturnGradeMethod {\n  public static void main(String[] args) {\n    System.out.print("The grade is " + getGrade(' + jd(v.a) + '));\n    System.out.print("\\nThe grade is " + getGrade(' + jd(v.b) + '));\n  }\n\n  public static char getGrade(double score) {\n    if (score >= 90.0)\n      return \'A\';\n    else if (score >= 80.0)\n      return \'B\';\n    else if (score >= 70.0)\n      return \'C\';\n    else if (score >= 60.0)\n      return \'D\';\n    else\n      return \'F\';\n  }\n}'; }
  function grade(x) { return x >= 90 ? 'A' : x >= 80 ? 'B' : x >= 70 ? 'C' : x >= 60 ? 'D' : 'F'; }
  var gradeLine = { A: 9, B: 11, C: 13, D: 15, F: 17 };
  var getgrade = {
    id: 'getgrade', slides: [16, 16], title: 'A method that returns a char', code: GG,
    inputs: [{ id: 'a', label: 'first score', value: 78.5, min: 0, max: 100 }, { id: 'b', label: 'second score', value: 59.5, min: 0, max: 100 }],
    presets: [{ label: '78.5 and 59.5 (slide)', values: { a: 78.5, b: 59.5 } }, { label: '90 and 89.9', values: { a: 90, b: 89.9 } }, { label: '100 and 0', values: { a: 100, b: 0 } }],
    steps: function (v) {
      var ga = grade(v.a), gb = grade(v.b);
      return [
        { line: 3, w: 0, cap: 'main calls <code>getGrade(' + jd(v.a) + ')</code>. The argument goes into the parameter score.' },
        { line: gradeLine[ga], w: 0, cap: 'The first test that is true decides: return <b>\'' + ga + '\'</b>. A return ends the method at once, so no other test runs.', out: 'The grade is ' + ga },
        { line: 4, w: 1, cap: 'The second call, <code>getGrade(' + jd(v.b) + ')</code>. The \\n in the string starts a new line first.' },
        { line: gradeLine[gb], w: 1, cap: 'This time the method returns <b>\'' + gb + '\'</b>.', out: 'The grade is ' + gb }
      ];
    },
    draw: function (k, s, v) {
      var sc = s.w ? v.b : v.a, g = grade(sc), items = [];
      [['A', 90], ['B', 80], ['C', 70], ['D', 60], ['F', 0]].forEach(function (r, i) {
        var on = r[0] === g && (k === 1 || k === 3);
        items.push(B('g' + i, 300, 20 + i * 58, 240, 48, { title: r[0] === 'F' ? 'else → \'F\'' : 'score >= ' + r[1] + '.0 → \'' + r[0] + '\'', mono: true, size: 14, tone: on ? 'accent' : 'muted', hi: on }));
      });
      items.push(vbox('sc', 30, 60, 180, 'score', 'double', jd(sc), k % 2 === 0 ? hot() : {}));
      if (k % 2) items.push(vbox('rv', 30, 160, 180, 'value', 'char returns', "'" + g + "'", hot()));
      return items;
    }
  };

  /* ---------- 7. scope of local variables (slides 17-22) ---------- */
  /* a code listing in the drawing; bars mark the lines where a variable can be used */
  function listing(id, x, y, w, lines, o) {
    o = o || {};
    var items = [B(id, x, y, w, 19 + lines.length * 18 + 8, { tag: o.tag, lines: lines.map(function (t) { return typeof t === 'string' ? { t: t } : t; }), mono: true, lsize: 12, tone: o.tone || 'muted', hi: !!o.hi })];
    (o.bars || []).forEach(function (b, j) {
      var bx = x - 8 - j * 9, y1 = y + 6 + 18 * b.a, y2 = y + 24 + 18 * b.b;
      items.push(A(id + 'bar' + j, bx, y1, bx, y2, { head: false, tone: b.tone }));
      items.push(A(id + 'bt' + j, bx, y1, bx + 5, y1, { head: false, tone: b.tone }), A(id + 'bb' + j, bx, y2, bx + 5, y2, { head: false, tone: b.tone }));
      if (b.label) items.push(T(id + 'bl' + j, x + (o.lx || 0), y + 19 + lines.length * 18 + 26 + j * 18, '▌ ' + b.label, { mono: true, size: 12, bold: true, tone: b.tone }));
    });
    return items;
  }
  var scope = {
    id: 'scope', slides: [17, 22], title: 'Where can a variable be used?',
    steps: [
      { slide: 17, cap: 'A <b>local variable</b> is declared inside a method. Its <b>scope</b> starts at the declaration and ends at the <code>}</code> of the block that contains it. Before or after that, the name does not exist.' },
      { slide: 18, cap: 'So the same name can be declared again in <b>another</b> block that is not inside the first one; but not in a block <b>inside</b> it (nested).' },
      { slide: 19, cap: 'A variable declared in the for header (i) can be used in the <b>whole loop</b>. A variable declared in the loop body (j) only from its declaration to the end of the body.' },
      { slide: 20, cap: 'method1: the two loops are separate blocks, so each may declare its own i. method2: i is declared, and then declared <b>again</b> inside its scope: not allowed.' },
      { slide: 21, cap: '<b>Fine</b>: each <code>int i</code> lives only in its own loop, so they never meet.' },
      { slide: 22, cap: '<b>Error</b>: <code>int x = 0;</code> is inside the scope of the first x (declared at the top of the method). Two variables with the same name in nested blocks: the code does not compile.' }
    ],
    draw: function (k) {
      if (k === 0) return listing('a', 60, 20, 330, ['public static void m() {', '  int x = 1;', '  x++;', '  if (x > 0) {', '    int y = x * 2;', '    System.out.println(y);', '  }', '  // y cannot be used here', '}'], { bars: [{ a: 1, b: 8, tone: 'teal', label: 'scope of x: line 2 to the end' }, { a: 4, b: 6, tone: 'accent', label: 'scope of y: only inside the if block' }] });
      if (k === 1) return [
        B('ok', 20, 40, 250, 120, { tag: 'non-nesting blocks', lines: ['{ int i ... }', '{ int i ... }', '', 'OK: two separate scopes'], mono: true, lsize: 13, tone: 'teal', hi: true }),
        B('bad', 290, 40, 250, 120, { tag: 'nested blocks', lines: ['{ int i ...', '    { int i ... }', '}', 'Error: one inside the other'], mono: true, lsize: 13, tone: 'red', hi: true })
      ];
      if (k === 2) return listing('b', 80, 20, 330, ['public static void method1() {', '  .', '  for (int i = 1; i < 10; i++) {', '    .', '    int j;', '    .', '    .', '  }', '}'], { bars: [{ a: 2, b: 7, tone: 'blue', label: 'the scope of i' }, { a: 4, b: 7, tone: 'accent', label: 'the scope of j' }] });
      if (k === 3) return listing('c', 30, 16, 250, ['method1() {', '  int x = 1;', '  int y = 1;', '  for (int i = 1; i < 10; i++) {', '    x += i;', '  }', '  for (int i = 1; i < 10; i++) {', '    y += i;', '  }', '}'], { tone: 'teal', tag: 'fine', bars: [{ a: 3, b: 5, tone: 'teal' }, { a: 6, b: 8, tone: 'blue' }] })
        .concat(listing('d', 310, 16, 240, ['method2() {', '  int i = 1;', '  int sum = 0;', '  for (int i = 1; i < 10; i++)', '    sum += i;', '  }', '}'].map(function (t, i) { return i === 3 ? { t: t, tone: 'red', b: true } : t; }), { tone: 'red', tag: 'wrong', bars: [{ a: 1, b: 6, tone: 'red' }, { a: 3, b: 4, tone: 'accent' }] }));
      if (k === 4) return listing('e', 70, 16, 360, ['// Fine with no errors', 'public static void correctMethod() {', '  int x = 1;', '  int y = 1;', '  // i is declared', '  for (int i = 1; i < 10; i++) {', '    x += i;', '  }', '  // i is declared again', '  for (int i = 1; i < 10; i++) {', '    y += i;', '  }', '}'], { tone: 'teal', bars: [{ a: 5, b: 7, tone: 'teal', label: 'first i' }, { a: 9, b: 11, tone: 'blue', label: 'second i' }], lx: 380 });
      return listing('f', 70, 16, 360, ['// With errors', 'public static void incorrectMethod() {', '  int x = 1;', '  int y = 1;', '  for (int i = 1; i < 10; i++) {', { t: '    int x = 0;   // error!', tone: 'red', b: true }, '    x += i;', '  }', '}'], { tone: 'red', bars: [{ a: 2, b: 8, tone: 'teal', label: 'scope of the first x' }, { a: 5, b: 7, tone: 'red', label: 'a second x inside it' }] });
    }
  };

  /* ---------- 8. matching arguments to parameters (slide 23) ---------- */
  var MYP = 'public static void myPrintln(String message, int n)\n{\n  for (int i = 0; i < n; i++)\n    System.out.println(message);\n}\n\nmyPrintln("Welcome to Java", 5);\nmyPrintln(5, "Computer Science");\nmyPrintln("Computer Science");';
  var myprintln = {
    id: 'myprintln', slides: [23, 23], title: 'Arguments must match the parameters', code: MYP,
    steps: [
      { line: 7, c: 0, cap: 'The arguments are matched to the parameters <b>in order</b>: "Welcome to Java" → message (a String), 5 → n (an int). Both fit.' },
      { line: '3-4', c: 0, run: true, cap: 'The loop prints the message n = 5 times.', out: ['Welcome to Java', 'Welcome to Java', 'Welcome to Java', 'Welcome to Java', 'Welcome to Java'] },
      { line: 8, c: 1, cap: 'No: the order is wrong. 5 cannot go into <code>String message</code>, and "Computer Science" cannot go into <code>int n</code>. This is a compile error.' },
      { line: 9, c: 2, cap: 'No: the method needs <b>two</b> arguments, and only one is given. Also a compile error.' }
    ],
    draw: function (k, s) {
      var calls = [['"Welcome to Java"', '5'], ['5', '"Computer Science"'], ['"Computer Science"', null]], c = calls[s.c], items = [];
      items.push(B('pm', 300, 60, 240, 50, { tag: 'parameter 1', title: 'String message', mono: true, size: 15, tone: 'blue' }));
      items.push(B('pn', 300, 170, 240, 50, { tag: 'parameter 2', title: 'int n', mono: true, size: 15, tone: 'blue' }));
      [0, 1].forEach(function (i) {
        var ok = s.c === 0, y = 60 + i * 110;
        if (c[i] != null) {
          items.push(B('ar' + i, 20, y, 210, 50, { tag: 'argument ' + (i + 1), title: c[i], mono: true, size: 14, tone: ok ? 'teal' : 'red', hi: true }));
          items.push(A('m' + i, 234, y + 25, 296, y + 25, { tone: ok ? 'teal' : 'red', label: ok ? 'fits' : '✗', la: 'middle' }));
        } else items.push(B('ar' + i, 20, y, 210, 50, { tag: 'argument ' + (i + 1), title: 'missing', size: 14, tone: 'red', dash: true, hi: true }));
      });
      if (s.run) items.push(T('rn', 280, 290, 'prints "Welcome to Java" 5 times', { anchor: 'middle', size: 14, bold: true, tone: 'teal' }));
      if (s.c > 0) items.push(T('er', 280, 290, 'compile error', { anchor: 'middle', size: 16, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* ---------- 9. pass by value (slide 24) ---------- */
  function INC(v) { return 'public class Increment {\n  public static void main(String[] args) {\n    int x = ' + I(v.x) + ';\n    System.out.println("Before the call, x is " + x);\n    increment(x);\n    System.out.println("after the call, x is " + x);\n  }\n\n  public static void increment(int n) {\n    n++;\n    System.out.println("n inside the method is " + n);\n  }\n}'; }
  var passval = {
    id: 'passval', slides: [24, 24], title: 'The method gets a copy of the value', code: INC,
    inputs: [{ id: 'x', label: 'x', value: 1, min: -99, max: 99 }],
    presets: [{ label: 'x = 1 (slide)', values: { x: 1 } }, { label: 'x = 41', values: { x: 41 } }, { label: 'x = -1', values: { x: -1 } }],
    steps: function (v) {
      var x = I(v.x);
      return [
        { line: '3-4', ph: 'main', n: null, cap: 'x = ' + x + ' in main.', out: 'Before the call, x is ' + x },
        { line: 5, ph: 'call', n: x, cap: '<code>increment(x)</code> passes the <b>value</b> of x. The parameter n is a <b>new</b> variable that gets a copy: n = ' + x + '.' },
        { line: '10-11', ph: 'inc', n: x + 1, cap: '<code>n++</code> changes n only: n = ' + (x + 1) + '. x is a different variable, still ' + x + '.', out: 'n inside the method is ' + (x + 1) },
        { line: 6, ph: 'back', n: null, cap: 'The method ends and n disappears. x was never touched: it is still ' + x + '. This is <b>pass-by-value</b>.', out: 'after the call, x is ' + x }
      ];
    },
    draw: function (k, s, v) {
      var x = I(v.x), items = [];
      items.push(B('mf', 30, 60, 220, 140, { tag: 'main', fill: 'none', tone: 'blue', z: 0 }));
      items.push(vbox('vx', 60, 100, 160, 'x', 'int', x, s.ph === 'back' ? hot({ tone: 'teal' }) : {}));
      if (s.n != null) {
        items.push(B('if', 310, 60, 220, 140, { tag: 'increment', fill: 'none', tone: 'accent', z: 0, hi: true }));
        items.push(vbox('vn', 340, 100, 160, 'n', 'int', s.n, s.ph === 'inc' ? hot() : {}));
      }
      if (s.ph === 'call') items.push(A('cp', 224, 124, 336, 124, { tone: 'accent', label: 'copy of ' + x }));
      if (s.ph === 'inc') items.push(T('nt', 280, 250, 'n changes, x does not', { anchor: 'middle', size: 15, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 10. the call stack, traced (slides 25-35) ---------- */
  var STK = 'public static void main(String[] args) {\n  int i = 5;\n  int j = 2;\n  int k = max(i, j);\n\n  System.out.println(\n    "The maximum between " + i +\n    " and " + j + " is " + k);\n}\n\npublic static int max(int num1, int num2) {\n  int result;\n\n  if (num1 > num2)\n    result = num1;\n  else\n    result = num2;\n\n  return result;\n}';
  function STKc(v) { return STK.replace('int i = 5;', 'int i = ' + I(v.i) + ';').replace('int j = 2;', 'int j = ' + I(v.j) + ';'); }
  var stack = {
    id: 'stack', slides: [25, 35], title: 'The call stack', code: STKc,
    inputs: [{ id: 'i', label: 'i', value: 5, min: -99, max: 99 }, { id: 'j', label: 'j', value: 2, min: -99, max: 99 }],
    presets: [{ label: '5, 2 (slides)', values: { i: 5, j: 2 } }, { label: '3, 8', values: { i: 3, j: 8 } }],
    steps: function (v) {
      var i = I(v.i), j = I(v.j), t = i > j, r = t ? i : j;
      var M = function (a, b, c, hi) { return [['k', c, hi === 'k'], ['j', b, hi === 'j'], ['i', a, hi === 'i']]; };
      var X = function (n1, n2, res, hi) { return [['result', res, hi === 'result'], ['num2', n2, hi === 'n'], ['num1', n1, hi === 'n']]; };
      return [
        { slide: 25, line: '2-4,12', st: [], who: '', bal: 'Each call of a method gets its own space on the call stack: an activation record. It holds the method’s parameters and local variables.' },
        { slide: 26, line: 2, st: [M(i, null, null, 'i')], vis: ['i'], who: 'The main method is invoked.', bal: 'i is declared and initialized' },
        { slide: 27, line: 3, st: [M(i, j, null, 'j')], vis: ['i', 'j'], who: 'The main method is invoked.', bal: 'j is declared and initialized' },
        { slide: 28, line: 4, st: [M(i, j, '', 'k')], vis: ['i', 'j', 'k'], who: 'The main method is invoked.', bal: 'Declare k' },
        { slide: 29, line: 4, st: [M(i, j, '')], vis: ['i', 'j', 'k'], who: 'The main method is invoked.', bal: 'Invoke max(i, j)' },
        { slide: 30, line: 11, st: [M(i, j, ''), X(i, j, null, 'n')], who: 'The max method is invoked.', bal: 'pass the values of i and j to num1 and num2', pass: true },
        { slide: 31, line: 12, st: [M(i, j, ''), X(i, j, '', 'result')], who: 'The max method is invoked.', bal: 'Declare result' },
        { slide: 32, line: 14, st: [M(i, j, ''), X(i, j, '')], who: 'The max method is invoked.', bal: '(num1 > num2) is ' + t },
        { slide: 33, line: t ? 15 : 17, st: [M(i, j, ''), X(i, j, r, 'result')], who: 'The max method is invoked.', bal: 'Assign ' + (t ? 'num1' : 'num2') + ' to result' },
        { slide: 34, line: '19', st: [M(i, j, r, 'k'), X(i, j, r)], who: 'The max method is invoked.', bal: 'Return result and assign it to k', ret: true },
        { slide: 35, line: '6-8', st: [M(i, j, r)], who: 'The main method is invoked.', bal: 'Execute print statement', out: 'The maximum between ' + i + ' and ' + j + ' is ' + r },
        { slide: 35, line: 9, st: [], who: 'The main method is finished.', bal: 'main ends: its record is removed too. The stack is empty.' }
      ].map(function (s) { s.cap = s.bal + (s.slide === 34 ? '. Then max is finished, and its activation record is removed from the stack.' : /\.$/.test(s.bal) ? '' : '.'); return s; });
    },
    draw: function (k, s) {
      var items = [], names = ['main', 'max'];
      items.push(A('wl', 300, 20, 300, 322, { head: false, tone: 'muted' }), A('wr', 544, 20, 544, 322, { head: false, tone: 'muted' }), A('wb', 300, 322, 544, 322, { head: false, tone: 'muted' }));
      var y = 320;
      s.st.forEach(function (f, n) {
        var hgt = boxH(f.length);
        y -= hgt + (n ? 6 : 0);
        var vars = f.filter(function (v) { return v[1] !== null || !s.vis || s.vis.indexOf(v[0]) >= 0; });
        items.push(frame('f' + n, 310, y + (hgt - boxH(vars.length)), 224, 'the ' + names[n] + ' method', vars, { tone: n ? 'accent' : 'blue', hi: n === s.st.length - 1 }));
      });
      if (!s.st.length && k) items.push(T('empty', 422, 300, 'Stack is empty', { anchor: 'middle', size: 14, tone: 'muted', bold: true }));
      var words = s.bal.split(' '), lines = [], cur = '';
      words.forEach(function (w) { if ((cur + ' ' + w).length > 28) { lines.push(cur); cur = w; } else cur = cur ? cur + ' ' + w : w; });
      lines.push(cur);
      items.push(B('bal', 20, 30, 260, 26 + lines.length * 20, { title: lines.join('\n'), size: 14, tone: 'accent', hi: true }));
      if (s.who) items.push(T('who', 20, 312, s.who, { size: 13, tone: 'muted', bold: true }));
      if (s.pass) items.push(A('p1', 300, 280, 300, 150, { tone: 'accent', dash: true, via: [[288, 280], [288, 150]], head: true }));
      if (s.ret) items.push(A('p2', 548, 160, 548, 250, { tone: 'teal', dash: true, via: [[556, 160], [556, 250]] }));
      return items;
    }
  };

  /* ---------- 11. swap does not swap the caller's variables (slide 36) ---------- */
  function SWP(v) { return 'public static void main(String[] args) {\n  int num1 = ' + I(v.a) + ';\n  int num2 = ' + I(v.b) + ';\n  swap(num1, num2);\n  System.out.println("num1 is " + num1 + " and num2 is " + num2);\n}\n\npublic static void swap(int n1, int n2) {\n  int temp = n1;\n  n1 = n2;\n  n2 = temp;\n}'; }
  var swap = {
    id: 'swap', slides: [36, 36], title: 'swap changes only its own copies', code: SWP,
    inputs: [{ id: 'a', label: 'num1', value: 1, min: -99, max: 99 }, { id: 'b', label: 'num2', value: 2, min: -99, max: 99 }],
    presets: [{ label: '1, 2 (slide)', values: { a: 1, b: 2 } }, { label: '7, 3', values: { a: 7, b: 3 } }],
    steps: function (v) {
      var a = I(v.a), b = I(v.b);
      var M = [['num2', b], ['num1', a]];
      return [
        { line: '2-3', st: [M], cap: 'The main method is invoked: num1 = ' + a + ', num2 = ' + b + '.' },
        { line: 4, st: [M, [['temp', ''], ['n2', b, 1], ['n1', a, 1]]], pass: true, cap: 'The swap method is invoked. The <b>values</b> of num1 and num2 are passed to n1 and n2.' },
        { line: 9, st: [M, [['temp', a, 1], ['n2', b], ['n1', a]]], cap: 'temp = n1 = ' + a + '.' },
        { line: 10, st: [M, [['temp', a], ['n2', b], ['n1', b, 1]]], cap: 'n1 = n2 = ' + b + '.' },
        { line: 11, st: [M, [['temp', a], ['n2', a, 1], ['n1', b]]], cap: 'n2 = temp = ' + a + '. The values for n1 and n2 are swapped, but it does not affect num1 and num2.' },
        { line: 5, st: [M], cap: 'The swap method is finished: its record is gone. In main nothing changed.', out: 'num1 is ' + a + ' and num2 is ' + b }
      ];
    },
    draw: function (k, s) {
      var items = [A('wl', 300, 20, 300, 322, { head: false, tone: 'muted' }), A('wr', 544, 20, 544, 322, { head: false, tone: 'muted' }), A('wb', 300, 322, 544, 322, { head: false, tone: 'muted' })], y = 320;
      s.st.forEach(function (f, n) {
        var hh = boxH(f.length); y -= hh + (n ? 6 : 0);
        items.push(frame('f' + n, 310, y, 224, n ? 'the swap method' : 'the main method', f, { tone: n ? 'accent' : 'blue', hi: n === s.st.length - 1 }));
      });
      if (s.pass) items.push(A('p', 300, 270, 300, 170, { tone: 'accent', dash: true, via: [[286, 270], [286, 170]] }));
      items.push(T('t', 20, 60, k === 4 ? 'n1 and n2 are swapped…' : k === 5 ? '…but num1 and num2 are not' : '', { size: 15, bold: true, tone: k === 5 ? 'red' : 'accent' }));
      return items;
    }
  };

  /* ---------- 12. hexadecimal to decimal (slide 37) ---------- */
  var HEX = 'public static int hexToDecimal(String hex) {\n  int decimalValue = 0;\n  for (int i = 0; i < hex.length(); i++) {\n    char hexChar = hex.charAt(i);\n    decimalValue = decimalValue * 16 + hexCharToDecimal(hexChar);\n  }\n  return decimalValue;\n}\n\npublic static int hexCharToDecimal(char ch) {\n  if (ch >= \'A\' && ch <= \'F\')\n    return 10 + ch - \'A\';\n  else // ch is \'0\', \'1\', ..., or \'9\'\n    return ch - \'0\';\n}';
  function hexd(c) { return c >= 'A' && c <= 'F' ? 10 + c.charCodeAt(0) - 65 : c.charCodeAt(0) - 48; }
  var hex = {
    id: 'hex', slides: [37, 37], title: 'Multiply by 16, add the next digit', code: HEX,
    inputs: [{ id: 'hx', type: 'text', label: 'hex', value: 'ABCD', minlen: 1, maxlen: 6 }],
    presets: [{ label: 'ABCD (slide)', values: { hx: 'ABCD' } }, { label: '1F', values: { hx: '1F' } }, { label: 'FF', values: { hx: 'FF' } }, { label: '100', values: { hx: '100' } }, { label: 'G1 (not hex)', values: { hx: 'G1' } }],
    steps: function (v) {
      var s = v.hx.toUpperCase(), val = 0, st = [{ line: 2, i: -1, val: 0, cap: 'Read the digits from the left. Each step: <b>value × 16 + digit</b>. This is the slide’s form ((A×16 + B)×16 + C)×16 + D, written as a loop. (The user’s text is made uppercase first.)' }];
      for (var i = 0; i < s.length; i++) {
        var c = s[i], d = hexd(c), ok = /[0-9A-F]/.test(c), nv = val * 16 + d;
        st.push({ line: '3-5', i: i, val: nv, cap: 'hexChar = \'' + h(c) + '\': hexCharToDecimal gives ' + d + (ok ? (d >= 10 ? ' (A = 10, …, F = 15)' : '') : ' — but \'' + h(c) + '\' is <b>not</b> a hex digit, so this number is nonsense; a real program should check the input') + '. value = ' + val + ' × 16 + ' + d + ' = <b>' + nv + '</b>.' });
        val = nv;
      }
      st.push({ line: 7, i: s.length, val: val, cap: 'Return ' + val + '. So hex ' + h(s) + ' = decimal <b>' + val + '</b>.' });
      return st;
    },
    draw: function (k, s, v) {
      var str = v.hx.toUpperCase(), n = str.length, items = [], cw = 70, x0 = 280 - n * cw / 2;
      for (var i = 0; i < n; i++) {
        var c = str[i], ok = /[0-9A-F]/.test(c);
        items.push(B('d' + i, x0 + i * cw, 30, cw - 8, 50, { title: c, mono: true, size: 24, tone: i === s.i ? (ok ? 'accent' : 'red') : i < s.i ? 'teal' : 'muted', hi: i === s.i }));
        items.push(T('dv' + i, x0 + i * cw + cw / 2 - 4, 100, '= ' + hexd(c), { anchor: 'middle', mono: true, size: 13, tone: ok ? 'muted' : 'red' }));
      }
      items.push(vbox('val', 180, 150, 200, 'decimalValue', 'int', s.val, k > 0 && k < n + 1 ? hot() : {}));
      if (s.i >= 0 && s.i < n) items.push(T('f', 280, 250, 'value × 16 + ' + hexd(str[s.i]), { anchor: 'middle', mono: true, size: 16, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 13. overloading max (slide 38) ---------- */
  var OVL = 'public static int max(int num1, int num2) {\n  if (num1 > num2) return num1;\n  else return num2;\n}\n\npublic static double max(double num1,\n  double num2) {\n  if (num1 > num2)\n    return num1;\n  else\n    return num2;\n}\n\nSystem.out.println(max(3, 4));\nSystem.out.println(max(3.0, 5.4));\nSystem.out.println(max(3, 5.4));';
  var overload = {
    id: 'overload', slides: [38, 38], title: 'Same name, different parameter lists', code: OVL,
    steps: [
      { line: '1-12', c: -1, cap: '<b>Overloading</b>: two methods with the <b>same name</b> but <b>different parameter lists</b>. Java picks one by looking at the arguments.' },
      { line: 14, c: 0, cap: '<code>max(3, 4)</code>: two ints, so the int version runs and returns the int 4.', out: '4' },
      { line: 15, c: 1, cap: '<code>max(3.0, 5.4)</code>: two doubles, so the double version runs.', out: '5.4' },
      { line: 16, c: 2, cap: '<code>max(3, 5.4)</code>: there is no max(int, double). The 3 can become 3.0, so the double version is used.', out: '5.4' }
    ],
    draw: function (k, s) {
      var use = [0, 1, 1][s.c], items = [];
      items.push(B('mi', 20, 40, 250, 70, { title: 'max(int num1, int num2)', lines: ['returns int'], mono: true, lsize: 12, size: 13, tone: s.c >= 0 && use === 0 ? 'accent' : 'blue', hi: s.c >= 0 && use === 0 }));
      items.push(B('md', 290, 40, 250, 70, { title: 'max(double num1, double num2)', lines: ['returns double'], mono: true, lsize: 12, size: 13, tone: s.c >= 0 && use === 1 ? 'accent' : 'blue', hi: s.c >= 0 && use === 1 }));
      if (s.c >= 0) {
        var c = ['max(3, 4)', 'max(3.0, 5.4)', 'max(3, 5.4)'][s.c];
        items.push(B('call', 200, 210, 160, 46, { title: c, mono: true, size: 15, tone: 'accent', hi: true }));
        items.push(A('to', 280, 206, use ? 415 : 145, 114, { tone: 'accent' }));
        if (s.c === 2) items.push(T('wd', 280, 290, '3 becomes 3.0', { anchor: 'middle', size: 14, bold: true, tone: 'accent' }));
      }
      return items;
    }
  };

  /* ---------- 14. an ambiguous call (slides 39-40) ---------- */
  var AMB = 'public class AmbiguousOverloading {\n  public static void main(String[] args) {\n    System.out.println(max(1, 2));\n  }\n\n  public static double max(int num1, double num2) {\n    if (num1 > num2)\n      return num1;\n    else\n      return num2;\n  }\n\n  public static double max(double num1, int num2) {\n    if (num1 > num2)\n      return num1;\n    else\n      return num2;\n  }\n}';
  var ambig = {
    id: 'ambig', slides: [39, 40], title: 'Two matches, no winner', code: AMB,
    steps: [
      { slide: 40, line: 3, c: 0, cap: 'The call <code>max(1, 2)</code> has two ints. There is no max(int, int).' },
      { slide: 40, line: 6, c: 1, cap: '<code>max(int, double)</code> could work: 2 becomes 2.0.' },
      { slide: 40, line: 13, c: 2, cap: '<code>max(double, int)</code> could work too: 1 becomes 1.0.' },
      { slide: 39, line: 3, c: 3, cap: 'Neither one is more specific than the other, so the compiler cannot choose: an <b>ambiguous invocation</b>, which is a compile error.' }
    ],
    draw: function (k, s) {
      var items = [];
      items.push(B('call', 200, 30, 160, 46, { title: 'max(1, 2)', mono: true, size: 16, tone: 'accent', hi: true }));
      items.push(B('m1', 20, 170, 240, 60, { title: 'max(int, double)', lines: ['2 → 2.0'], mono: true, size: 13, lsize: 12, tone: s.c === 1 || s.c === 3 ? 'accent' : 'blue', hi: s.c === 1 }));
      items.push(B('m2', 300, 170, 240, 60, { title: 'max(double, int)', lines: ['1 → 1.0'], mono: true, size: 13, lsize: 12, tone: s.c === 2 || s.c === 3 ? 'accent' : 'blue', hi: s.c === 2 }));
      if (s.c >= 1) items.push(A('a1', 250, 80, 140, 166, { tone: s.c === 3 ? 'red' : 'accent', dash: s.c === 3 }));
      if (s.c >= 2) items.push(A('a2', 310, 80, 420, 166, { tone: s.c === 3 ? 'red' : 'accent', dash: s.c === 3 }));
      if (s.c === 3) items.push(T('err', 280, 290, '? which one → compile error', { anchor: 'middle', size: 16, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* ---------- 15. random characters (slides 41-46) ---------- */
  var RC = '// RandomCharacter.java: Generate random characters\npublic class RandomCharacter {\n  /** Generate a random character between ch1 and ch2 */\n  public static char getRandomCharacter(char ch1, char ch2) {\n    return (char)(ch1 + Math.random() * (ch2 - ch1 + 1));\n  }\n\n  /** Generate a random lowercase letter */\n  public static char getRandomLowerCaseLetter() {\n    return getRandomCharacter(\'a\', \'z\');\n  }\n\n  /** Generate a random uppercase letter */\n  public static char getRandomUpperCaseLetter() {\n    return getRandomCharacter(\'A\', \'Z\');\n  }\n\n  /** Generate a random digit character */\n  public static char getRandomDigitCharacter() {\n    return getRandomCharacter(\'0\', \'9\');\n  }\n\n  /** Generate a random character */\n  public static char getRandomCharacter() {\n    return getRandomCharacter(\'\\u0000\', \'\\uFFFF\');\n  }\n}';
  var randchar = {
    id: 'randchar', slides: [41, 46], title: 'A random character between ch1 and ch2', code: RC,
    inputs: [{ id: 'c1', type: 'text', label: 'ch1', value: 'a', minlen: 1, maxlen: 1 }, { id: 'c2', type: 'text', label: 'ch2', value: 'z', minlen: 1, maxlen: 1 }],
    presets: [{ label: "'a' to 'z'", values: { c1: 'a', c2: 'z' } }, { label: "'A' to 'Z'", values: { c1: 'A', c2: 'Z' } }, { label: "'0' to '9'", values: { c1: '0', c2: '9' } }, { label: "'x' to 'x'", values: { c1: 'x', c2: 'x' } }],
    steps: function (v) {
      var a = v.c1.charCodeAt(0), b = v.c2.charCodeAt(0), lo = Math.min(a, b), hi = Math.max(a, b), r = Math.random(), code = Math.floor(lo + r * (hi - lo + 1)), big = Math.floor(r * 65536);
      var base = { r: r, lo: lo, hi: hi, code: code };
      return [
        mix(base, { slide: 41, line: 5, ph: 'all', cap: 'Every character has a Unicode code from 0 to 65535. A random code: <code>(int)(Math.random() * (65535 + 1))</code>. We add 1 because Math.random() is always less than 1.0. This time: ' + big + '.' }),
        mix(base, { slide: 42, line: 5, ph: 'codes', cap: 'The codes of ' + h(jch(String.fromCharCode(lo))) + ' to ' + h(jch(String.fromCharCode(hi))) + ' are ' + lo + ' to ' + hi + ', in order. So a random code in this range is <code>(int)\'' + h(String.fromCharCode(lo)) + '\' + Math.random() * (' + hi + ' − ' + lo + ' + 1)</code>.' }),
        mix(base, { slide: 43, line: 5, ph: 'pick', cap: 'Math.random() = ' + r.toFixed(3) + '…, so the code is ' + lo + ' + ' + r.toFixed(3) + ' × ' + (hi - lo + 1) + ' ≈ ' + (lo + r * (hi - lo + 1)).toFixed(2) + ', which becomes ' + code + '.' }),
        mix(base, { slide: 44, line: 5, ph: 'cast', cap: 'chars can be used directly in arithmetic, so write <code>\'a\' + Math.random() * (\'z\' − \'a\' + 1)</code>, and cast with <code>(char)</code> to get the letter: ' + h(jch(String.fromCharCode(code))) + '.' }),
        mix(base, { slide: 45, line: 5, ph: 'cast', cap: 'In general, between any ch1 and ch2: <code>(char)(ch1 + Math.random() * (ch2 − ch1 + 1))</code>.' }),
        mix(base, { slide: 46, line: '9-11', ph: 'class', cap: 'The RandomCharacter class puts the formula in <b>one</b> method, and the other methods just call it with fixed ends: \'a\'-\'z\', \'A\'-\'Z\', \'0\'-\'9\', or every character.' })
      ];
    },
    draw: function (k, s) {
      var items = [], n = s.hi - s.lo + 1, X = function (c) { return 40 + (c - s.lo + 0.5) / n * 480; };
      if (s.ph === 'all') {
        items.push(A('ax', 40, 160, 520, 160, { head: false, tone: 'muted' }));
        items.push(T('z', 40, 186, '0', { anchor: 'middle', mono: true, size: 12 }), T('m', 520, 186, '65535', { anchor: 'middle', mono: true, size: 12 }));
        items.push(B('pt', 40 + s.r * 480 - 6, 154, 12, 12, { shape: 'oval', fill: 'solid', tone: 'accent' }));
        items.push(T('lb', 280, 100, '65536 possible characters', { anchor: 'middle', size: 15, bold: true, tone: 'accent' }));
        return items;
      }
      if (s.ph === 'class') {
        [['getRandomLowerCaseLetter()', "('a', 'z')"], ['getRandomUpperCaseLetter()', "('A', 'Z')"], ['getRandomDigitCharacter()', "('0', '9')"], ['getRandomCharacter()', "('\\u0000', '\\uFFFF')"]].forEach(function (m, i) {
          items.push(B('c' + i, 20, 20 + i * 62, 270, 46, { title: m[0], mono: true, size: 12, tone: i === 0 ? 'accent' : 'blue', hi: i === 0 }));
          items.push(A('ca' + i, 294, 43 + i * 62, 340, 150, { tone: 'muted' }));
        });
        items.push(B('core', 344, 120, 200, 60, { title: 'getRandomCharacter', lines: ['(char ch1, char ch2)'], mono: true, size: 12, lsize: 11, tone: 'teal', hi: true }));
        return items;
      }
      var cw = Math.min(40, 480 / n);
      if (n <= 26) for (var c = s.lo; c <= s.hi; c++) items.push(B('k' + c, Math.round(40 + (c - s.lo) * cw), 120, Math.max(8, Math.round(cw) - 2), 40, { title: n <= 26 ? String.fromCharCode(c) : '', mono: true, size: 13, tone: (s.ph === 'pick' || s.ph === 'cast') && c === s.code ? 'accent' : 'muted', hi: (s.ph === 'pick' || s.ph === 'cast') && c === s.code, r: 3 }));
      else items.push(A('ax', 40, 140, 520, 140, { head: false, tone: 'muted' }));
      items.push(T('l1', 40, 186, String(s.lo), { anchor: 'start', mono: true, size: 12 }), T('l2', 520, 186, String(s.hi), { anchor: 'end', mono: true, size: 12 }));
      if (s.ph === 'cast') items.push(B('res', 210, 230, 140, 60, { tag: '(char) result', title: jch(String.fromCharCode(s.code)), mono: true, size: 24, tone: 'accent', hi: true }));
      return items;
    }
  };

  /* ---------- 16. maximum of three doubles (slides 47-49) ---------- */
  var MF = '// Fig. 6.3: MaximumFinder.java\n// Programmer-declared method maximum with three double parameters.\nimport java.util.Scanner;\n\npublic class MaximumFinder\n{\n   // obtain three floating-point values and locate the maximum value\n   public static void main(String[] args)\n   {\n      // create Scanner for input from command window\n      Scanner input = new Scanner(System.in);\n\n      // prompt for and input three floating-point values\n      System.out.print(\n         "Enter three floating-point values separated by spaces: ");\n      double number1 = input.nextDouble(); // read first double\n      double number2 = input.nextDouble(); // read second double\n      double number3 = input.nextDouble(); // read third double\n\n      // determine the maximum value\n      double result = maximum(number1, number2, number3);\n\n      // display maximum value\n      System.out.println("Maximum is: " + result);\n   }\n\n   // returns the maximum of its three double parameters\n   public static double maximum(double x, double y, double z)\n   {\n      double maximumValue = x; // assume x is the largest to start\n\n      // determine whether y is greater than maximumValue\n      if (y > maximumValue)\n         maximumValue = y;\n\n      // determine whether z is greater than maximumValue\n      if (z > maximumValue)\n         maximumValue = z;\n\n      return maximumValue;\n   }\n} // end class MaximumFinder';
  var maxfinder = {
    id: 'maxfinder', slides: [47, 49], title: 'Keep the biggest value seen so far', code: MF,
    inputs: [{ id: 'a', label: 'number1', value: 9.35, min: -999, max: 999 }, { id: 'b', label: 'number2', value: 2.74, min: -999, max: 999 }, { id: 'c', label: 'number3', value: 5.1, min: -999, max: 999 }],
    presets: [{ label: '9.35 2.74 5.1', values: { a: 9.35, b: 2.74, c: 5.1 } }, { label: '5.8 12.45 8.32', values: { a: 5.8, b: 12.45, c: 8.32 } }, { label: '6.46 4.12 10.54', values: { a: 6.46, b: 4.12, c: 10.54 } }, { label: 'all equal', values: { a: 2, b: 2, c: 2 } }],
    steps: function (v) {
      var a = v.a, b = v.b, c = v.c, m1 = b > a ? b : a, m2 = c > m1 ? c : m1;
      return [
        { slide: 47, line: '14-18', m: null, cap: 'Read three doubles.', out: 'Enter three floating-point values separated by spaces: ' + [a, b, c].map(String).join(' ') },
        { slide: 47, line: 21, m: null, cap: 'Call <code>maximum(number1, number2, number3)</code>: x = ' + jd(a) + ', y = ' + jd(b) + ', z = ' + jd(c) + '.' },
        { slide: 48, line: 30, m: a, at: 0, cap: 'Start by assuming x is the largest: maximumValue = ' + jd(a) + '.' },
        { slide: 48, line: '33-34', m: m1, at: 1, cap: 'Is y (' + jd(b) + ') > maximumValue (' + jd(a) + ')? <b>' + (b > a) + '</b>' + (b > a ? ', so maximumValue = ' + jd(b) + '.' : ', no change.') },
        { slide: 48, line: '37-38', m: m2, at: 2, cap: 'Is z (' + jd(c) + ') > maximumValue (' + jd(m1) + ')? <b>' + (c > m1) + '</b>' + (c > m1 ? ', so maximumValue = ' + jd(c) + '.' : ', no change.') },
        { slide: 49, line: [40, 24], m: m2, at: 3, cap: 'Return ' + jd(m2) + ' and print it.', out: 'Maximum is: ' + jd(m2) }
      ];
    },
    draw: function (k, s, v) {
      var vals = [v.a, v.b, v.c], items = [];
      ['x', 'y', 'z'].forEach(function (n, i) { items.push(vbox('p' + i, 20 + i * 180, 40, 160, n, 'double', k >= 1 ? jd(vals[i]) : null, s.at === i ? hot() : {})); });
      items.push(vbox('mv', 180, 180, 200, 'maximumValue', 'double', s.m == null ? null : jd(s.m), s.at != null ? hot({ tone: s.at === 3 ? 'teal' : 'accent' }) : {}));
      if (s.at === 1 || s.at === 2) items.push(A('cmp', 100 + s.at * 180, 92, 280, 172, { tone: 'accent', dash: true, label: '>' }));
      return items;
    }
  };

  /* ---------- 17. pay with overtime (slides 50-51) ---------- */
  var PAY = '// Write a method that finds the salary based on number of\n//working hours\nimport java.util.Scanner;\npublic class Main{\npublic static void main(String[] args) {\nScanner in = new Scanner(System.in);\ndouble sal;       // salary\nint R, h;  // R is the rate and h is number of working hours\nSystem.out.println ("Enter  Rate value");\n      R= in.nextInt();\n      System.out.println "Enter number of working hours");\n      h= in.nextInt();\n       sal= Pay(R,h);\n System.out.println(" The total salary using rate of\\t"+R+"\\t of working\\t"+h+"\\thours is\\t"+sal);\n}\npublic static double Pay (int x, int y) {\n  double p;\n     if (y <=40)\n        p = x*y;\n     else\n        p = ( 40*x ) + ((y - 40)*1.5*x );\n     return p;\n}\n}';
  var pay = {
    id: 'pay', slides: [50, 51], title: 'Pay: normal hours and overtime', code: PAY,
    inputs: [{ id: 'r', label: 'rate R', value: 10, min: 0, max: 200 }, { id: 'h', label: 'hours h', value: 45, min: 0, max: 100 }],
    presets: [{ label: 'R = 10, h = 45', values: { r: 10, h: 45 } }, { label: 'R = 10, h = 40', values: { r: 10, h: 40 } }, { label: 'R = 20, h = 30', values: { r: 20, h: 30 } }, { label: 'R = 15, h = 60', values: { r: 15, h: 60 } }],
    steps: function (v) {
      var R = I(v.r), hh = I(v.h), over = hh > 40, p = over ? 40 * R + (hh - 40) * 1.5 * R : R * hh;
      return [
        { slide: 50, line: 11, cap: 'Careful: this line of slide 50 is missing the <code>(</code> after println, so as written the program does <b>not compile</b>. We trace it as if it were <code>System.out.println("Enter number of working hours");</code>.' },
        { slide: 50, line: '9-12', cap: 'Read the rate R = ' + R + ' and the hours h = ' + hh + '.', out: ['Enter  Rate value', String(R), 'Enter number of working hours', String(hh)] },
        { slide: 50, line: 13, cap: '<code>Pay(R, h)</code>: the values go into the parameters x = ' + R + ' and y = ' + hh + '.' },
        { slide: 51, line: over ? 21 : 19, cap: over ? 'y > 40: the first 40 hours at the normal rate, the other ' + (hh - 40) + ' at 1.5 × the rate: 40 × ' + R + ' + ' + (hh - 40) + ' × 1.5 × ' + R + ' = ' + jd(p) + '.' : 'y <= 40: p = x × y = ' + R * hh + '. It is stored in a double, so it is ' + jd(p) + '.' },
        { slide: 51, line: 22, cap: 'Return p. Back in main, sal = ' + jd(p) + '. \\t puts tabs between the parts.', out: ' The total salary using rate of\t' + R + '\t of working\t' + hh + '\thours is\t' + jd(p) }
      ];
    },
    draw: function (k, s, v) {
      var R = I(v.r), hh = I(v.h), items = [], sc = 4.6, over = hh > 40;
      items.push(A('ax', 40, 150, 40 + 100 * sc, 150, { head: false, tone: 'muted' }));
      items.push(B('nh', 40, 120, Math.min(hh, 40) * sc, 30, { tone: 'blue', fill: 'solid', r: 2 }));
      if (over) items.push(B('oh', 40 + 40 * sc, 120, (hh - 40) * sc, 30, { tone: 'accent', fill: 'solid', r: 2 }));
      items.push(A('m40', 40 + 40 * sc, 100, 40 + 40 * sc, 160, { head: false, tone: 'red', dash: true, label: '40 hours', la: 'middle', ly: -6 }));
      items.push(T('l1', 40, 186, 'rate ' + R, { mono: true, size: 12, tone: 'blue', bold: true }));
      if (over) items.push(T('l2', 40 + 40 * sc + 4, 186, '1.5 × rate', { mono: true, size: 12, tone: 'accent', bold: true }));
      if (k >= 2) items.push(vbox('x', 40, 230, 110, 'x', 'int', R, k === 2 ? hot() : {}), vbox('y', 170, 230, 110, 'y', 'int', hh, k === 2 ? hot() : {}));
      if (k >= 3) items.push(vbox('p', 300, 230, 220, 'p', 'double', jd(over ? 40 * R + (hh - 40) * 1.5 * R : R * hh), hot()));
      return items;
    }
  };

  var ALL = [anatomy, sign, testmax, blackbox, sums, getgrade, scope, myprintln, passval, stack, swap, hex, overload, ambig, randchar, maxfinder, pay];

  var para = function (t) { return { type: 'paragraph', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; },
    code = function (t, lang) { return lang ? { type: 'code', text: t, lang: lang } : { type: 'code', text: t }; }, note = function (t) { return { type: 'note', text: t }; };
  function braces(c) { var o = (c.match(/\{/g) || []).length, z = (c.match(/\}/g) || []).length; return o >= 2 && o === z; }
  var MAXONLY = 'public static int max(int num1, int num2) {\n  int result;\n  if (num1 > num2)\n    result = num1;\n  else\n    result = num2;\n  return result;\n}';
  function anat(intro, ex) { return { image: false, blocks: [para(intro), note('Define a method'), code(MAXONLY), note('Invoke a method'), code('int z = max(x, y);')], explain: ex }; }
  function trace(bal, who, ex) { return { image: false, title: 'Trace Call Stack', blocks: [note(bal), code(STK), para(who)], explain: ex }; }
  var RANDTXT = 'Now let us consider how to generate a random lowercase letter. The Unicode for lowercase letters are consecutive integers starting from the Unicode for \'a\', then for \'b\', \'c\', ..., and \'z\'. The Unicode for \'a\' is';

  addUnit({
    course: 'cs1', lesson: '07-methods',
    blurb: 'Group statements under a name and use them again: define and call methods, pass parameters, return values, follow the call stack, and overload methods.',
    parts: [
      {
        title: 'Defining and calling methods', from: 1, to: 10,
        quiz: [
          { q: 'In <code>public static int max(int num1, int num2)</code>, what is the return value type?', options: ['max', 'static', 'int'], answer: 2, why: 'The type written just before the name (slide 4).' },
          { q: 'What is the <b>method signature</b> here?', code: 'public static int max(int num1, int num2)', options: ['public static int', 'max(int num1, int num2)', 'int num1, int num2'], answer: 1, why: 'The name plus the parameter list (slide 5).' },
          { q: 'In <code>int z = max(x, y);</code>, x and y are…', options: ['actual parameters (arguments)', 'formal parameters of max', 'return values of max'], answer: 0, why: 'The values passed in a call are the arguments (slide 7).' },
          { type: 'fill', q: 'A method that returns nothing:', code: 'public static ___ printHello() {\n  System.out.println("Hello");\n}', answer: ['void'], why: 'void means no return value (slide 8).' },
          { type: 'output', q: 'What does this print?', code: 'public static int max(int num1, int num2) {\n  if (num1 > num2) return num1;\n  else return num2;\n}\n// in main:\nSystem.out.println(max(3, 8) + max(6, 1));', answer: '14', why: 'max(3, 8) is 8 and max(6, 1) is 6; 8 + 6 = 14.' },
          { type: 'tf', q: 'The sign method in slide 9 (a) compiles, because one of the three conditions is always true.', answer: false, why: 'The compiler only sees that no return follows the last else if, so it reports an error.' }
        ]
      },
      {
        title: 'Modularizing code', from: 11, to: 16,
        quiz: [
          { q: 'Why is the method body called a “black box”?', options: ['It is always empty until it is called', 'The caller uses it without knowing how it works inside', 'It cannot return values to the caller'], answer: 1, why: 'Slide 11: only the header matters to the caller.' },
          { type: 'output', q: 'With the sum method of slide 15, what does this print?', code: 'System.out.println(sum(3, 5));', answer: '12', why: '3 + 4 + 5 = 12.' },
          { q: 'What do the three repeated parts of slide 13 have in common?', options: ['They print different things', 'Nothing', 'Only the start and end numbers differ'], answer: 2, why: 'So the two numbers become the parameters of one method.' },
          { type: 'output', q: 'With getGrade of slide 16, what does this print?', code: 'System.out.println(getGrade(80.0));', answer: 'B', why: '80.0 >= 90.0 is false, 80.0 >= 80.0 is true.' },
          { q: 'Which is a benefit of methods (slide 12)?', options: ['Write once, reuse anywhere', 'Programs run without main', 'No variables are needed'], answer: 0, why: 'Plus information hiding and less complexity.' }
        ]
      },
      {
        title: 'Scope and passing parameters', from: 17, to: 24,
        quiz: [
          { q: 'Where does the scope of a local variable start?', options: ['At its declaration', 'At the start of the method', 'At the start of the class'], answer: 0, why: 'And it ends at the end of the block that contains it (slide 17).' },
          { type: 'tf', q: 'Two for loops, one after the other, may both declare <code>int i</code>.', answer: true, why: 'They are non-nesting blocks (slides 20-21).' },
          { q: 'Why does slide 22 not compile?', code: 'int x = 1;\nfor (int i = 1; i < 10; i++) {\n  int x = 0;\n  x += i;\n}', options: ['i is not declared before the loop uses it', 'x is declared again inside its own scope', 'x += i is wrong: += needs two different types'], answer: 1, why: 'You cannot declare the same name twice in nested blocks.' },
          { type: 'output', q: 'What does this print?', code: 'myPrintln("Hi", 2);', answer: 'Hi\nHi', why: 'message = "Hi", n = 2: the loop prints twice (slide 23).' },
          { q: 'Can you call <code>myPrintln(5, "Computer Science")</code>?', options: ['Yes, it prints "Computer Science" 5 times', 'Yes, Java swaps the arguments to fit', 'No: the arguments are in the wrong order and types'], answer: 2, why: 'Arguments are matched to parameters in order (slide 23).' },
          { type: 'output', q: 'What does this print?', code: 'public static void increment(int n) {\n  n++;\n}\n// in main:\nint x = 7;\nincrement(x);\nSystem.out.println(x);', answer: '7', why: 'Pass-by-value: n is a copy, so x does not change (slide 24).' }
        ]
      },
      {
        title: 'Call stacks', from: 25, to: 37,
        quiz: [
          { q: 'What is put on the call stack when a method is called?', options: ['A copy of the whole program', 'An activation record with its parameters and local variables', 'Only the return value of the method'], answer: 1, why: 'Slide 25.' },
          { q: 'When max returns, what happens to its activation record?', options: ['It is removed from the stack', 'It stays forever', 'It moves into main'], answer: 0, why: 'Slide 34-35: only main’s record is left.' },
          { type: 'order', q: 'Put the steps of <code>int k = max(i, j);</code> in order.', lines: ['the values of i and j are passed to num1 and num2', 'max computes result', 'max returns result', 'the value is assigned to k'], why: 'Slides 30-34.' },
          { type: 'output', q: 'What does this print?', code: 'int num1 = 1, num2 = 2;\nswap(num1, num2);   // swaps n1 and n2 inside\nSystem.out.println(num1 + " " + num2);', answer: '1 2', why: 'swap works on copies (slide 36).' },
          { type: 'output', q: 'What decimal number is hex <code>2A</code>?', code: '// value = value * 16 + digit\nhexToDecimal("2A")', answer: '42', why: '2 × 16 + 10 = 42 (A is 10).' }
        ]
      },
      {
        title: 'Overloading methods', from: 38, to: 40,
        quiz: [
          { q: 'What is overloading?', options: ['Methods with the same name but different parameter lists', 'A method that calls itself again and again', 'A method with too many statements in its body'], answer: 0, why: 'Slide 38.' },
          { type: 'output', q: 'max(int, int) and max(double, double) both exist. What does this print?', code: 'System.out.println(max(2, 7));\nSystem.out.println(max(2.5, 7));', answer: '7\n7.0', why: 'Two ints → the int version. A double is involved → the double version.' },
          { q: 'Only <code>max(int, double)</code> and <code>max(double, int)</code> exist. What is <code>max(1, 2)</code>?', options: ['2.0, from max(int, double)', '2, from max(double, int)', 'A compile error: ambiguous invocation'], answer: 2, why: 'Both could work, and neither is more specific (slides 39-40).' }
        ]
      },
      {
        title: 'Case studies', from: 41, to: 51,
        quiz: [
          { q: 'Why does <code>(int)(Math.random() * (65535 + 1))</code> add 1?', options: ['It is a mistake: 65535 alone would be right', 'To skip 0, which is not a character', 'Math.random() is always less than 1.0, so 65535 would never come'], answer: 2, why: 'Slide 41.' },
          { q: 'What does <code>(char)(\'a\' + Math.random() * (\'z\' - \'a\' + 1))</code> give?', options: ['A random lowercase letter', 'Always \'a\'', 'A random digit'], answer: 0, why: 'Slide 44.' },
          { type: 'output', q: 'With maximum(x, y, z) of slide 48, what does this print?', code: 'System.out.println(maximum(3.5, 9.0, 2.25));', answer: '9.0', why: 'maximumValue starts at 3.5, then becomes 9.0; 2.25 is not bigger.' },
          { type: 'output', q: 'With Pay of slide 51, what does this print?', code: 'System.out.println(Pay(10, 42));', answer: '430.0', why: '40 × 10 + 2 × 1.5 × 10 = 400 + 30 = 430.0.' },
          { type: 'tf', q: 'Slide 50 compiles exactly as written.', answer: false, why: 'One println is missing its opening parenthesis.' }
        ]
      }
    ],
    slides: {
      1: { cover: true, image: false, title: '', blocks: [para('Chapter 6'), para('Methods'), note('An adapted version of the lecture notes associated with the textbook')],
        explain: '<p>A <b>{{method|دالة / طريقة}}</b> is a named group of statements. You write it once and call it whenever you need it. You already used methods like <code>Math.sqrt</code> and <code>println</code>; now you write your own.</p>' },
      2: { image: false, blocks: [bul('Overview'), bul('Method Signature'), bul('Modularizing Code'), bul('Scope of Local Variables'), bul('Passing Parameters'), bul('Call Stacks'), bul('Overloading Methods'), bul('Case Studies')],
        explain: '<p>The topics of this unit, in order.</p>' },
      3: { image: false, blocks: [para('A method is a collection of statements that are grouped together to perform an operation.'), code(MAXONLY)],
        explain: '<p>A <b>{{method|دالة}}</b> is a group of statements with a name. Instead of writing the same steps again and again, you write them once in a method and <b>call</b> the method whenever you need them.</p><p>This max method gets two ints and gives back the bigger one:</p><pre class="ex">max(3, 8)   → 8\nmax(-4, -9) → -4</pre><p>Follow the drawing to see each part of the method get its name.</p>' },
      4: anat('A method is a collection of statements that are grouped together to perform an operation.', '<p>A method has two parts:</p><ul><li>The <b>{{method header|رأس الدالة}}</b>, the first line: <code>public static int max(int num1, int num2)</code>. It has the <b>modifiers</b> (public static), the <b>return value type</b> (int), the <b>name</b> (max) and the <b>parameters</b> in parentheses.</li><li>The <b>{{method body|جسم الدالة}}</b>: the statements between { and }, which do the work.</li></ul><p>To use it, you <b>invoke</b> (call) it: <code>int z = max(x, y);</code></p>'),
      5: anat('Method signature is the combination of the method name and the parameter list.', '<p>The <b>{{signature|توقيع الدالة}}</b> of a method is its <b>name plus its parameter list</b>: <code>max(int num1, int num2)</code>.</p><p>The signature is how Java tells methods apart. The return type and the modifiers are <b>not</b> part of it. This matters later, when two methods share a name (overloading).</p>'),
      6: anat('The variables defined in the method header are known as formal parameters.', '<p>The variables in the header, <code>num1</code> and <code>num2</code>, are the <b>{{formal parameters|المعاملات الشكلية}}</b>. They are like empty boxes with a type: they have no value until the method is called.</p><p>Inside the body you use them like normal variables.</p>'),
      7: anat('When a method is invoked, you pass a value to the parameter. This value is referred to as actual parameter or argument.', '<p>To <b>{{invoke|يستدعي}}</b> a method is to call it by name with values in parentheses. Those values are the <b>actual parameters</b>, also called <b>{{arguments|الوسائط: القيم المُمرَّرة}}</b>:</p><pre class="ex">int z = max(x, y);   // x and y are the arguments</pre><p>When the call runs, the value of x goes into num1 and the value of y into num2, in that order.</p>'),
      8: anat('A method may return a value. The returnValueType is the data type of the value the method returns. If the method does not return a value, the returnValueType is the keyword void. For example, the returnValueType in the main method is void.', '<p>The <b>return value type</b> says what the method gives back:</p><ul><li><code>int max(…)</code> must end with <code>return</code> and an int value. The call <code>max(x, y)</code> then <b>is</b> that value: you can store it, print it, or use it in a calculation.</li><li><code>void</code> means the method returns nothing; it only does something, like printing. main is void.</li></ul><pre class="ex">public static void printLine() { System.out.println("-----"); }</pre>'),
      9: { image: false, title: 'CAUTION', blocks: [para('A return statement is required for a value-returning method. The method shown below in (a) is logically correct, but it has a compilation error because the Java compiler thinks it possible that this method does not return any value.'), note('(a)'), code('public static int sign(int n) {\n  if (n > 0)\n    return 1;\n  else if (n == 0)\n    return 0;\n  else if (n < 0)\n    return -1;\n}'), note('Should be (b)'), code('public static int sign(int n) {\n  if (n > 0)\n    return 1;\n  else if (n == 0)\n    return 0;\n  else\n    return -1;\n}'), para('To fix this problem, delete if (n < 0) in (a), so that the compiler will see a return statement to be reached regardless of how the if statement is evaluated.')],
        explain: '<p>A value-returning method needs a <code>return</code> on <b>every</b> {{path|مسار}}. In version (a) you know that one of the three conditions is always true, but the compiler does not reason about the values: it sees that if all three tests were false, the method would reach the end with no return. So (a) is a compile error.</p><p>Version (b) uses a plain <code>else</code> for the last case. Now every path ends in a return, and it compiles.</p>' },
      10: { image: false, blocks: [para('Testing the max method: This program demonstrates calling a method max to return the largest of the int values'), code(TESTMAX)],
        explain: '<p>Watch the flow of control:</p><ol><li>main sets i = 5 and j = 2.</li><li>At <code>max(i, j)</code>, main <b>pauses</b> and control jumps into max, with num1 = 5 and num2 = 2.</li><li>max runs and reaches <code>return result;</code> with 5.</li><li>Control jumps <b>back</b> to the exact place in main, and 5 is stored in k.</li></ol><p>Then main prints “The maximum between 5 and 2 is 5”.</p>' },
      11: { image: false, blocks: [bul('Methods can be used to reduce redundant coding and enable code reuse. Methods can also be used to modularize code and improve the quality of the program.'), bul('You can think of the method body as a black box that contains the detailed implementation for the method.')],
        explain: '<p>Why write methods?</p><ul><li>They remove <b>{{redundant|مكرر بلا داعٍ}}</b> code: steps written again and again are written once.</li><li>They let you <b>{{modularize|يقسّم إلى وحدات}}</b>: split a big program into small methods, each with one clear job.</li></ul><p>You can think of a method body as a <b>black box</b>: you know what goes in (arguments) and what comes out (the return value), but you do not need to look inside to use it, just as you use Math.sqrt.</p>' },
      12: { image: false, blocks: [bul('Write a method once and reuse it anywhere.'), bul('Information hiding. Hide the implementation from the user.'), bul('Reduce complexity.'), para('Q) But, when you are asked to solve a problem how to think in a modular solution???')],
        explain: '<p>Three benefits:</p><ul><li><b>Reuse</b>: write a method once, use it anywhere, in many programs.</li><li><b>{{Information hiding|إخفاء التفاصيل}}</b>: the user of a method needs to know <i>what</i> it does, not <i>how</i>.</li><li><b>Less complexity</b>: small methods are easier to read, test and fix.</li></ul><p>But how do you <i>see</i> which methods a problem needs? The next slides show one way: look for repeated code.</p>' },
      13: { image: false, blocks: [para('Find the sum of integers from 1 to 10, from 20 to 30, and from 35 to 45.'), para('A typical solution:'), code('int sum = 0;\nfor (int i = 1; i <= 10; i++)\n  sum += i;\nSystem.out.println("Sum from 1 to 10 is " + sum);\n////////////////////////////////////////\nsum = 0;\nfor (int i = 20; i <= 30; i++)\n  sum += i;\nSystem.out.println("Sum from 20 to 30 is " + sum);\n////////////////////////////////////////\nsum = 0;\nfor (int i = 35; i <= 45; i++)\n  sum += i;\nSystem.out.println("Sum from 35 to 45 is " + sum);')],
        explain: '<p>The problem: print three sums, from 1 to 10, from 20 to 30, and from 35 to 45.</p><p>This solution works, but look at it: the same three lines (reset sum, a for loop, print) are written <b>three times</b>. If you wanted to change how a sum is printed, you would have to change it in three places, and it is easy to forget one.</p>' },
      14: { image: false, blocks: [code('int sum = 0;\nfor (int i = 1; i <= 10; i++)\n  sum += i;\nSystem.out.println("Sum from 1 to 10 is " + sum);'), code('sum = 0;\nfor (int i = 20; i <= 30; i++)\n  sum += i;\nSystem.out.println("Sum from 20 to 30 is " + sum);'), code('sum = 0;\nfor (int i = 35; i <= 45; i++)\n  sum += i;\nSystem.out.println("Sum from 35 to 45 is " + sum);')],
        explain: '<p>Compare the three copies: they are the same except for <b>two numbers</b>, the start and the end of the loop.</p><p>This is the key idea: when code repeats with small changes, the <b>changing parts become parameters</b> of a method, and the rest becomes its body.</p>' },
      15: { image: false, blocks: [code('public static int sum(int i1, int i2) {\n  int sum = 0;\n  for (int i = i1; i <= i2; i++)\n    sum += i;\n  return sum;\n}'), code('public static void main(String[] args) {\n  System.out.println("Sum from 1 to 10 is " + sum(1, 10));\n  System.out.println("Sum from 20 to 30 is " + sum(20, 30));\n  System.out.println("Sum from 35 to 45 is " + sum(35, 45));\n}')],
        explain: '<p>Now the loop is written once. To change how sums are computed, you change one place. Note: inside sum, the local variable sum has the same name as the method; that is allowed, but a different name would be clearer.</p>' },
      16: { image: false, blocks: [code(GG({ a: 78.5, b: 59.5 }))],
        explain: '<p>A method can return any type. getGrade returns a <b>char</b>: \'A\', \'B\', \'C\', \'D\' or \'F\'.</p><p>A <code>return</code> ends the method <b>at once</b>. So for 78.5, the first true test is <code>score >= 70.0</code>; it returns \'C\' and none of the later tests runs.</p><pre class="ex">getGrade(78.5) → \'C\'\ngetGrade(59.5) → \'F\'</pre>' },
      17: { image: false, blocks: [para('A local variable: a variable defined inside a method.'), para('Scope: the part of the program where the variable can be referenced.'), para('The scope of a local variable starts from its declaration and continues to the end of the block that contains the variable. A local variable must be declared before it can be used.')],
        explain: '<p>A <b>{{local variable|متغير محلي}}</b> is a variable declared inside a method. It belongs to that method only.</p><p>Its <b>{{scope|النطاق: المكان الذي يُعرف فيه المتغير}}</b> is the part of the program where its name can be used: from the line where it is <b>declared</b> to the end of the <b>block</b> { } that contains it. Before the declaration, or after the block ends, the name does not exist.</p>' },
      18: { image: false, blocks: [para('You can declare a local variable with the same name multiple times in different non- nesting blocks in a method, but you cannot declare a local variable twice in nested blocks.')],
        explain: '<p>Can two variables have the same name? It depends on where their blocks are:</p><ul><li><b>Side by side</b> (non-nesting blocks, like two loops one after the other): yes, each name lives in its own block.</li><li><b>One inside the other</b> (<b>{{nested|متداخل}}</b> blocks): no, because the outer variable is still in scope inside the inner block.</li></ul>' },
      19: { image: false, blocks: [para('A variable declared in the initial action part of a for loop header has its scope in the entire loop. But a variable declared inside a for loop body has its scope limited in the loop body from its declaration and to the end of the block that contains the variable.'), code('public static void method1() {\n  .\n  .\n  for (int i = 1; i < 10; i++) {\n    .\n    .\n    int j;\n    .\n    .\n    .\n  }\n}', 'none')],
        explain: '<p>Loops have their own scopes:</p><ul><li>A variable declared in the <b>for header</b>, like <code>int i</code>, exists in the <b>whole loop</b> (header and body).</li><li>A variable declared <b>inside the body</b>, like <code>int j</code>, exists from its declaration to the end of the body.</li></ul><p>After the loop ends, neither i nor j can be used.</p><pre class="ex">for (int i = 1; i &lt; 10; i++) { int j = i * 2; }\nSystem.out.println(j);   // ✗ compile error: j does not exist here</pre>' },
      20: { image: false, blocks: [note('It is fine to declare i in two non-nesting blocks'), code('public static void method1() {\n  int x = 1;\n  int y = 1;\n\n  for (int i = 1; i < 10; i++) {\n    x += i;\n  }\n\n  for (int i = 1; i < 10; i++) {\n    y += i;\n  }\n}'), note('It is wrong to declare i in two nesting blocks'), code('public static void method2() {\n\n  int i = 1;\n  int sum = 0;\n\n  for (int i = 1; i < 10; i++)\n    sum += i;\n  }\n\n}')],
        explain: '<p>method1 declares i in two loops that are <b>side by side</b>: the first i is gone when the second loop starts, so this is fine.</p><p>method2 declares <code>int i = 1;</code> first, then <code>for (int i = 1; …)</code>. The loop is <b>inside</b> the scope of the first i, so the name is declared twice: a compile error. (The slide’s code also has an extra closing brace.)</p>' },
      21: { image: false, blocks: [code('// Fine with no errors\npublic static void correctMethod() {\n  int x = 1;\n  int y = 1;\n  // i is declared\n  for (int i = 1; i < 10; i++) {\n    x += i;\n  }\n  // i is declared again\n  for (int i = 1; i < 10; i++) {\n    y += i;\n  }\n}')],
        explain: '<p>correctMethod is the “fine” case again: each i exists only inside its own loop. When the first loop ends, its i is gone, so the second loop can declare a new i.</p><p>x and y are declared at the top of the method, so they can be used in both loops.</p>' },
      22: { image: false, blocks: [code('// With errors\npublic static void incorrectMethod() {\n  int x = 1;\n  int y = 1;\n  for (int i = 1; i < 10; i++) {\n    int x = 0;\n    x += i;\n  }\n}')],
        explain: '<p>incorrectMethod: x is declared on the first line, so its scope is the <b>rest of the method</b>, including the loop body. <code>int x = 0;</code> inside the loop declares a <b>second</b> x in a nested block: a compile error.</p><p>To fix it, either rename the inner variable, or just assign the outer one: <code>x = 0;</code> (no int).</p>' },
      23: { image: false, blocks: [code(MYP.split('\n\n')[0]), para('What would be the output if we invoke the method using:'), code('myPrintln("Welcome to Java", 5);'), para('Can you invoke the method using'), code('myPrintln(5, "Computer Science");'), para('Can you invoke the method using'), code('myPrintln("Computer Science");')],
        explain: '<p>The arguments of a call must match the parameters in <b>number, order and type</b>:</p><ul><li><code>myPrintln("Welcome to Java", 5)</code>: a String then an int. ✓ It prints the message 5 times.</li><li><code>myPrintln(5, "Computer Science")</code>: the order is wrong. ✗ Compile error.</li><li><code>myPrintln("Computer Science")</code>: one argument is missing. ✗ Compile error.</li></ul>' },
      24: { image: false, blocks: [bul('When you invoke a method with an argument, the value of the argument is passed to the parameter. This is referred to as pass-by-value.'), bul('If the argument is a variable rather than a literal value, the value of the variable is passed to the parameter. The variable is not affected, regardless of the changes made to the parameter inside the method!'), para('Example:'), code(INC({ x: 1 })), note('The output: Before the call, x is 1 / n inside the method is 2 / After the call, x is 1')],
        explain: '<p>Java passes arguments <b>by value</b>: the method gets a <b>copy</b> of the value, never the variable itself.</p><p>In Increment, x is 1. <code>increment(x)</code> copies 1 into the parameter n. <code>n++</code> makes the copy 2 and it prints “n inside the method is 2”, but x in main is still <b>1</b>.</p><p>Think of it like giving a friend a photocopy of a page: whatever they write on the copy, your page does not change. (The code prints “after” with a small a; the slide’s output box writes “After”.)</p>' },
      25: { image: false, title: 'Call Stacks', blocks: [para('(a) The main method is invoked. (b) The max method is invoked. (c) The max method is being executed. (d) The max method is finished and the return value is sent to k. (e) The main method is finished.')],
        explain: '<p>The <b>{{call stack|مكدّس الاستدعاءات}}</b> keeps one <b>{{activation record|سجل التنشيط}}</b> for each method that is running. A new call goes on top; when a method ends, its record is removed. The next slides trace this step by step.</p>' },
      26: trace('i is declared and initialized', 'The main method is invoked.', '<p>main’s record holds its local variables. i is the first one.</p>'),
      27: trace('j is declared and initialized', 'The main method is invoked.', '<p>j is added to main’s record.</p>'),
      28: trace('Declare k', 'Space required for the main method: k has no value yet.', '<p>k is declared, but it gets its value only after max returns.</p>'),
      29: trace('Invoke max(i, j)', 'The main method is invoked.', '<p>main stops here and waits for max.</p>'),
      30: trace('pass the values of i and j to num1 and num2', 'The max method is invoked.', '<p>A new record for max goes on <b>top</b> of the stack, with num1 and num2.</p>'),
      31: trace('Declare result', 'The max method is invoked.', '<p>result is a local variable of max, so it lives in max’s record.</p>'),
      32: trace('(num1 > num2) is true', 'The max method is invoked.', '<p>5 > 2 is true.</p>'),
      33: trace('Assign num1 to result', 'The max method is invoked.', '<p>result = 5.</p>'),
      34: trace('Return result and assign it to k', 'The max method is invoked.', '<p>The value 5 goes back to main and into k. Then max’s record is removed.</p>'),
      35: trace('Execute print statement', 'The main method is invoked.', '<p>Only main is left. When it ends, the stack is empty.</p>'),
      36: { image: false, title: 'Back to “Pass by Value” topic!', blocks: [para('The values of num1 and num2 are passed to n1 and n2.'), para('The values for n1 and n2 are swapped, but it does not affect num1 and num2.')],
        explain: '<p>Now you can see why pass-by-value works this way: n1 and n2 live in swap’s own record. Swapping them changes nothing in main’s record. The drawing uses a small program in the style of the slide.</p>' },
      37: { image: false, title: 'Case Study: Converting Hexadecimals to Decimals', blocks: [para('Write a method that converts a hexadecimal number into a decimal number.'), code('ABCD =>\n\n A*16^3 + B*16^2 + C*16^1+ D*16^0\n\n= ((A*16 + B)*16 + C)*16+D\n\n= ((10*16 + 11)*16 + 12)*16+13 = ?', 'none')],
        explain: '<p>The second form is easier for a loop: start with 0, and for each digit do <b>value × 16 + digit</b>. The answer for ABCD is 43981. The drawing shows the method and a helper method for one digit.</p>' },
      38: { image: false, blocks: [para('Overloading the max Method:'), code('public static double max(double num1,\n  double num2) {\n  if (num1 > num2)\n    return num1;\n  else\n    return num2;\n}')],
        explain: '<p>To <b>{{overload|يُحمِّل: نفس الاسم بقوائم معاملات مختلفة}}</b> a method is to write another method with the <b>same name</b> but a <b>different parameter list</b>.</p><pre class="ex">max(int num1, int num2)\nmax(double num1, double num2)</pre><p>Java looks at the arguments to choose: <code>max(3, 4)</code> calls the int version, <code>max(3.0, 5.4)</code> the double version. Same job, different types, one easy name.</p><p class="watch">The return type alone cannot tell two methods apart: the parameter lists must differ.</p>' },
      39: { image: false, blocks: [para('Sometimes there may be two or more possible matches for an invocation of a method, but the compiler cannot determine the most specific match. This is referred to as ambiguous invocation. Ambiguous invocation is a compile error.')],
        explain: '<p>Sometimes two methods match a call <b>equally well</b>, and the compiler cannot decide which is the better fit. This is an <b>{{ambiguous|غامض: له أكثر من معنى}} invocation</b>, and it is a compile error: Java refuses to guess.</p>' },
      40: { image: false, blocks: [code(AMB)],
        explain: '<p>Only <code>max(int, double)</code> and <code>max(double, int)</code> exist. The call is <code>max(1, 2)</code>, two ints.</p><ul><li>For the first method, 2 must be converted to double.</li><li>For the second method, 1 must be converted to double.</li></ul><p>Each needs one conversion, so neither is more specific: ambiguous, compile error. <code>max(1, 2.0)</code> would be fine: it fits only the first one exactly.</p>' },
      41: { image: false, title: 'Case Study: Generating Random Characters', blocks: [para('Computer programs process numerical data and characters. You have seen many examples that involve numerical data. It is also important to understand characters and how to process them. As introduced in Section 2.9, each character has a unique Unicode between 0 and FFFF in hexadecimal (65535 in decimal). To generate a random character is to generate a random integer between 0 and 65535 using the following expression: (note that since 0 <= Math.random() < 1.0, you have to add 1 to 65535.)'), code('(int)(Math.random() * (65535 + 1))')],
        explain: '<p>Every character has a Unicode code, a number from 0 to 65535 (FFFF in hexadecimal). So a random character is just a random code.</p><pre class="ex">(int)(Math.random() * (65535 + 1))</pre><p>Math.random() is from 0.0 up to, but <b>not including</b>, 1.0. Multiplying by 65536 gives 0 up to 65535.99…, and (int) cuts it to 0 … 65535. That is why 1 is added: without it, 65535 could never come out.</p>' },
      42: { image: false, title: 'Case Study: Generating Random Characters, cont.', blocks: [para(RANDTXT), code("(int)'a'"), para('So, a random integer between (int)\'a\' and (int)\'z\' is'), code("(int)((int)'a' + Math.random() * ((int)'z' - (int)'a' + 1)")],
        explain: '<p>The lowercase letters have codes next to each other: \'a\' is 97, \'b\' is 98, … \'z\' is 122. So a random lowercase letter is a random code from 97 to 122:</p><pre class="ex">(int)\'a\' + Math.random() * ((int)\'z\' - (int)\'a\' + 1)\n= 97 + Math.random() * 26</pre><p>It is the same recipe as before: start + random × (how many values).</p>' },
      43: { image: false, title: 'Case Study: Generating Random Characters, cont.', blocks: [para(RANDTXT), code("(int)'a'"), para('So, a random integer between (int)\'a\' and (int)\'z\' is'), code("(int)((int)'a' + Math.random() * ((int)'z' - (int)'a' + 1)")],
        explain: '<p>The same expression again, so you can check it carefully. Count the parentheses: the slide’s expression is missing one closing parenthesis at the end. Errors like this are common in long expressions; the next slide makes it shorter.</p>' },
      44: { image: false, title: 'Case Study: Generating Random Characters, cont.', blocks: [para('As discussed in Chapter 2., all numeric operators can be applied to the char operands. The char operand is cast into a number if the other operand is a number or a character. So, the preceding expression can be simplified as follows:'), code("'a' + Math.random() * ('z' - 'a' + 1)"), para('So a random lowercase letter is'), code("(char)('a' + Math.random() * ('z' - 'a' + 1))")],
        explain: '<p>In arithmetic, a char is used as its code. So the (int) casts are not needed:</p><pre class="ex">\'a\' + Math.random() * (\'z\' - \'a\' + 1)   // a number from 97.0 up to 123.0\n(char)(\'a\' + Math.random() * (\'z\' - \'a\' + 1))   // a random letter</pre><p>The final <code>(char)</code> cast drops the decimals and turns the code back into a character. For example 97 + 0.839 × 26 ≈ 118.8 → 118 → \'v\'.</p>' },
      45: { image: false, title: 'Case Study: Generating Random Characters, cont.', blocks: [para('To generalize the foregoing discussion, a random character between any two characters ch1 and ch2 with ch1 < ch2 can be generated as follows:'), code('(char)(ch1 + Math.random() * (ch2 - ch1 + 1))')],
        explain: '<p>Replace \'a\' and \'z\' by any two characters ch1 and ch2 (ch1 &lt; ch2), and you get one formula for <b>any range</b>:</p><pre class="ex">(char)(ch1 + Math.random() * (ch2 - ch1 + 1))</pre><p>\'A\' to \'Z\' gives an uppercase letter; \'0\' to \'9\' gives a digit character. A formula like this is a perfect candidate for a method: the next slide does exactly that.</p>' },
      46: { image: false, blocks: [code(RC)],
        explain: '<p>RandomCharacter is a class of small methods:</p><ul><li><code>getRandomCharacter(char ch1, char ch2)</code> does the real work, with the formula.</li><li>The others just <b>call it</b> with fixed ranges: \'a\'-\'z\', \'A\'-\'Z\', \'0\'-\'9\', or all characters.</li></ul><p>This is code {{reuse|إعادة استخدام}}: the formula is written once. Notice also that there are two methods named getRandomCharacter, one with two parameters and one with none: they are <b>overloaded</b>.</p>' },
      47: { image: false, title: 'MaximumFinder (Part 1 of 3)', blocks: [code(MF.split('\n').slice(0, 22).join('\n'))],
        explain: '<p>MaximumFinder reads three doubles from the user and passes them to a method with <b>three parameters</b>: <code>maximum(number1, number2, number3)</code>.</p><p>The order matters: number1 goes into x, number2 into y, number3 into z.</p>' },
      48: { image: false, title: 'MaximumFinder (Part 2 of 3)', blocks: [code(MF.split('\n').slice(22).join('\n'))],
        explain: '<p>maximum uses a common pattern, “the biggest so far”:</p><ol><li>Assume the first value is the biggest: <code>maximumValue = x</code>.</li><li>If y is bigger, it becomes the biggest so far.</li><li>If z is bigger than that, it becomes the biggest.</li></ol><pre class="ex">maximum(4.0, 7.5, 6.0): 4.0 → 7.5 → 7.5</pre><p>You will use the same idea with loops to find the largest value in an array.</p>' },
      49: { image: false, title: 'MaximumFinder (Part 3 of 3)', blocks: [code('Enter three floating-point values separated by spaces: 9.35 2.74 5.1\nMaximum is: 9.35', 'none'), code('Enter three floating-point values separated by spaces: 5.8 12.45 8.32\nMaximum is: 12.45', 'none'), code('Enter three floating-point values separated by spaces: 6.46 4.12 10.54\nMaximum is: 10.54', 'none')],
        explain: '<p>Three sample runs, and the maximum is in a different position each time: first (9.35), second (12.45) and third (10.54).</p><p>This is good testing: if the program worked only when the maximum is first, these runs would show the bug. Always test the different cases.</p>' },
      50: { image: false, blocks: [code(PAY.split('\npublic static double Pay')[0])],
        explain: '<p>main reads the rate and the hours and calls Pay. Careful: one println here has no opening parenthesis, so the code as written does not compile.</p>' },
      51: { image: false, blocks: [code('public static double Pay (int x, int y) {\n  double p;\n     if (y <=40)\n        p = x*y;\n     else\n        p = ( 40*x ) + ((y - 40)*1.5*x );\n     return p;\n}\n}')],
        explain: '<p>Pay computes a salary with <b>{{overtime|العمل الإضافي}}</b>:</p><ul><li>Up to 40 hours: pay = rate × hours.</li><li>More than 40 hours: 40 hours at the normal rate, plus each extra hour at 1.5 × the rate.</li></ul><pre class="ex">Pay(10, 30) = 10 × 30 = 300.0\nPay(10, 42) = 40 × 10 + 2 × 1.5 × 10 = 430.0</pre><p>Exactly 40 hours is not overtime, because the test is <code>y &lt;= 40</code>.</p>' }
    },
    visuals: ALL,
    exam: {
      questions: [
        { type: 'output', q: 'With max of slide 10, what does this print?', code: 'System.out.println(max(3, 7));', answer: '7', review: 10, why: '3 > 7 is false, so result = num2.' },
        { q: 'What is the signature of <code>public static double area(double r)</code>?', options: ['public static double', 'area(double r)', 'double area'], answer: 1, review: 5, why: 'Name plus parameter list.' },
        { q: 'In the header <code>max(int num1, int num2)</code>, num1 and num2 are…', options: ['formal parameters', 'arguments', 'return values'], answer: 0, review: 6, why: 'Variables in the header are formal parameters.' },
        { q: 'What is the return value type of a method that returns nothing?', options: ['null', 'void', 'int'], answer: 1, review: 8, why: 'Slide 8.' },
        { q: 'Why does this not compile?', code: 'public static int f(int n) {\n  if (n >= 0)\n    return 1;\n  else if (n < 0)\n    return -1;\n}', options: ['A method cannot have two returns', 'n >= 0 is wrong', 'The compiler sees a path with no return'], answer: 2, review: 9, why: 'Change <code>else if (n < 0)</code> to <code>else</code>.' },
        { type: 'output', q: 'With getGrade of slide 16, what does this print?', code: 'System.out.println(getGrade(85));', answer: 'B', review: 16, why: '85 >= 80.0 is the first true test.' },
        { type: 'output', q: 'With sum of slide 15, what does this print?', code: 'System.out.println(sum(1, 4));', answer: '10', review: 15, why: '1 + 2 + 3 + 4.' },
        { q: 'Where does the scope of a local variable end?', options: ['At the end of the class', 'At the end of the block that contains it', 'At the next method call'], answer: 1, review: 17, why: 'Slide 17.' },
        { q: 'Which code has an error?', options: ['int i = 1; for (int i = 0; i < 3; i++) { }', 'for (int i = 0; i < 3; i++) { } for (int i = 0; i < 3; i++) { }', 'for (int i = 0; i < 3; i++) { int j = i; }'], answer: 0, review: 20, why: 'The loop declares i again inside the scope of the first i.' },
        { type: 'output', q: 'What does this print?', code: 'public static void increment(int n) {\n  n++;\n  System.out.println(n);\n}\n// in main:\nint x = 5;\nincrement(x);\nSystem.out.println(x);', answer: '6\n5', review: 24, why: 'n changes; x is a different variable.' },
        { type: 'output', q: 'With myPrintln of slide 23, what does this print?', code: 'myPrintln("Hi", 2);', answer: 'Hi\nHi', review: 23, why: 'The message is printed n times.' },
        { q: 'What happens with <code>myPrintln(3, "Hi")</code>?', options: ['It prints 3', 'It prints Hi 3 times', 'A compile error'], answer: 2, review: 23, why: 'The arguments do not match the parameters in order and type.' },
        { q: 'When a method returns, its activation record…', options: ['stays on the stack', 'is removed from the call stack', 'is copied into main'], answer: 1, review: 34, why: 'Slide 34.' },
        { type: 'output', q: 'What is hex <code>1F</code> in decimal?', code: 'hexToDecimal("1F")', answer: '31', review: 37, why: '1 × 16 + 15 = 31.' },
        { type: 'output', q: 'max(int, int) and max(double, double) both exist. What does this print?', code: 'System.out.println(max(2, 3.5));', answer: '3.5', review: 38, why: '2 becomes 2.0, and the double version runs.' },
        { q: 'An ambiguous invocation is…', options: ['allowed', 'a runtime error', 'a compile error'], answer: 2, review: 39, why: 'Slide 39.' },
        { q: 'What can <code>(char)(\'0\' + Math.random() * (\'9\' - \'0\' + 1))</code> give?', options: ['A random digit character from \'0\' to \'9\'', 'A random number from 0 to 10', 'Always \'0\''], answer: 0, review: 45, why: 'The general formula with ch1 = \'0\' and ch2 = \'9\'.' },
        { type: 'output', q: 'With Pay of slide 51, what does this print?', code: 'System.out.println(Pay(10, 45));', answer: '475.0', review: 51, why: '400 + 5 × 1.5 × 10 = 475.0.' },
        { type: 'fill', q: 'The method returns a number with a decimal point. Write its return value type.', code: 'public static ___ average(int a, int b) {\n  return (a + b) / 2.0;\n}', answer: ['double'], review: 8, why: '(a + b) / 2.0 is a double, so the method must return a double.' },
        { type: 'fill', q: 'Complete the method: it prints word as many times as times says.', code: 'public static void repeat(String word, int times) {\n  for (int i = 0; i < ___; i++)\n    System.out.println(___);\n}', answer: ['times', 'word'], review: 6, why: 'Inside the body, the formal parameters are used like normal variables.' },
        { type: 'write', q: 'Write a method min that takes two ints a and b and returns the smaller one.', rows: 5, checks: [{ re: /public\s+static\s+int\s+min\s*\(\s*int\s+a\s*,\s*int\s+b\s*\)/, label: 'public static int min(int a, int b)' }, { re: /if\s*\(\s*a\s*<=?\s*b\s*\)\s*return\s+a\s*;\s*(else\s*)?return\s+b\s*;|if\s*\(\s*b\s*<=?\s*a\s*\)\s*return\s+b\s*;\s*(else\s*)?return\s+a\s*;|return\s*\(?\s*a\s*<=?\s*b\s*\)?\s*\?\s*a\s*:\s*b\s*;/, label: 'returns a when a < b, otherwise b' }], solution: 'public static int min(int a, int b) {\n  if (a < b)\n    return a;\n  else\n    return b;\n}', review: 3, why: 'Like max, but with the test the other way round. Every path ends with a return.' },
        { type: 'write', q: 'Use the sum method of slide 15 to print the sum from 5 to 9 (one statement).', checks: [{ re: /System\s*\.\s*out\s*\.\s*println\s*\(\s*sum\s*\(\s*5\s*,\s*9\s*\)\s*\)\s*;/, label: 'System.out.println(sum(5, 9));' }], solution: 'System.out.println(sum(5, 9));', review: 15, why: 'The call sum(5, 9) is its return value (35), so it can be printed directly.' },
        { type: 'trace', q: 'Follow the code. What are a and b at the end?', code: 'public static int twice(int n) {\n  n = n * 2;\n  return n;\n}\n// in main:\nint a = 4;\nint b = twice(a);', cols: ['variable', 'value'], rows: [['a', '?4'], ['b', '?8']], review: 24, why: 'twice changes its own copy n and returns 8. a itself is still 4: pass-by-value.' },
        { type: 'bug', q: 'This does not compile. Tap the line the compiler complains about.', code: 'public static double f(int x, double y) { return x + y; }\npublic static double f(double x, int y) { return x + y; }\n// in main:\nSystem.out.println(f(3, 4));', answer: 4, review: 40, why: 'f(3, 4) fits both methods after one conversion each: an ambiguous invocation.' }
      ],
      tasks: [
        {
          title: 'A square method',
          task: '<p>Write a method <code>public static int square(int n)</code> that <b>returns</b> n × n. In main, print <code>square(5)</code>.</p>',
          starter: 'public class Squares {\n  public static void main(String[] args) {\n    \n  }\n\n  // write the method square here\n}',
          output: '25',
          checks: [
            { re: /public\s+static\s+int\s+square\s*\(\s*int\s+\w+\s*\)/, label: 'Header: <code>public static int square(int n)</code>', review: 4 },
            { re: /return\s+(\w+)\s*\*\s*\1\s*;/, label: 'Returns <code>n * n</code>', review: 8 },
            { re: /println\s*\(\s*square\s*\(\s*5\s*\)\s*\)/, label: 'main prints <code>square(5)</code>', review: 10 },
            { fn: braces, label: 'Braces match', review: 3 }
          ],
          solution: 'public class Squares {\n  public static void main(String[] args) {\n    System.out.println(square(5));\n  }\n\n  public static int square(int n) {\n    return n * n;\n  }\n}'
        },
        {
          title: 'isEven',
          task: '<p>Write <code>public static boolean isEven(int n)</code> that returns true when n is even. In main, print <code>isEven(7)</code> and <code>isEven(10)</code>.</p>',
          starter: 'public class EvenTest {\n  public static void main(String[] args) {\n    \n  }\n\n}',
          output: 'false\ntrue',
          checks: [
            { re: /public\s+static\s+boolean\s+isEven\s*\(\s*int\s+\w+\s*\)/, label: 'Header: <code>public static boolean isEven(int n)</code>', review: 8 },
            { re: /return\s+\(?\s*\w+\s*%\s*2\s*==\s*0\s*\)?\s*;|if\s*\(\s*\w+\s*%\s*2\s*==\s*0\s*\)[\s\S]*return\s+true[\s\S]*return\s+false/, label: 'Returns the result of <code>n % 2 == 0</code>', review: 9 },
            { re: /isEven\s*\(\s*7\s*\)[\s\S]*isEven\s*\(\s*10\s*\)/, label: 'Calls <code>isEven(7)</code> and <code>isEven(10)</code>', review: 10 },
            { fn: braces, label: 'Braces match', review: 3 }
          ],
          solution: 'public class EvenTest {\n  public static void main(String[] args) {\n    System.out.println(isEven(7));\n    System.out.println(isEven(10));\n  }\n\n  public static boolean isEven(int n) {\n    return n % 2 == 0;\n  }\n}'
        },
        {
          title: 'printLine',
          task: '<p>Write a <b>void</b> method <code>printLine(char c, int n)</code> that prints c n times on one line (with a for loop and <code>print</code>), then ends the line. In main, call <code>printLine(\'*\', 10)</code>.</p>',
          starter: 'public class Lines {\n  public static void main(String[] args) {\n    \n  }\n\n}',
          output: '**********',
          checks: [
            { re: /public\s+static\s+void\s+printLine\s*\(\s*char\s+(\w+)\s*,\s*int\s+(\w+)\s*\)/, label: 'Header: <code>public static void printLine(char c, int n)</code>', review: 8 },
            { re: /for\s*\([^)]*<\s*\w+[^)]*\)/, label: 'A for loop that runs n times', review: 23 },
            { re: /System\.out\.print\s*\(\s*\w+\s*\)/, label: 'Prints c with <code>print</code>', review: 23 },
            { re: /System\.out\.println\s*\(\s*\)/, label: 'Ends the line with <code>println()</code>', review: 23 },
            { re: /printLine\s*\(\s*'\*'\s*,\s*10\s*\)/, label: 'main calls <code>printLine(\'*\', 10)</code>', review: 7 }
          ],
          solution: 'public class Lines {\n  public static void main(String[] args) {\n    printLine(\'*\', 10);\n  }\n\n  public static void printLine(char c, int n) {\n    for (int i = 0; i < n; i++)\n      System.out.print(c);\n    System.out.println();\n  }\n}'
        }
      ]
    }
  });
})();
