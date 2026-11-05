/* CS1 · Unit 8 · Single-Dimensional Arrays (82 slides): declaring and creating arrays, length, default values, indexes,
   initializers, a traced program, processing arrays, copying, passing and returning arrays, the heap, linear search,
   Arrays.sort and Arrays.toString, and passing arguments to main */
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
  function tf(b) { return b ? 'true' : 'false'; }
  function vbox(id, x, y, w, name, type, value, o) {
    return B(id, x, y, w, 48, mix({ tag: type + ' ' + name, title: value == null ? 'no value' : String(value), mono: true, size: 16, tone: value == null ? 'muted' : 'teal', dash: value == null, r: 6 }, o || {}));
  }
  function hot(o) { return mix(o || {}, { tone: 'accent', hi: true }); }
  /* numbers typed in a text input, like "6 4 1 9" */
  function nums(t, max) { var m = String(t).match(/-?\d+(\.\d+)?/g) || []; return m.slice(0, max || 10).map(Number); }
  function ints(t, max) { return nums(t, max).map(function (x) { return Math.trunc(x); }); }
  function jlist(a, dbl) { return '{' + a.map(function (x) { return dbl ? jd(x) : String(x); }).join(', ') + '}'; }
  /* an array drawn as cells with [index] labels under them */
  function cellsA(p, x, y, vals, o) {
    o = o || {};
    var n = vals.length, cw = o.cw || Math.max(34, Math.min(56, Math.floor((o.w || 480) / Math.max(n, 1)))), out = [];
    vals.forEach(function (v, i) {
      var t = o.tone ? o.tone(i) : 'muted';
      out.push(B(p + i, x + i * cw, y, cw - 3, o.ch || 40, { title: v == null ? '' : String(v), mono: true, size: o.size || (String(v).length > 5 ? 11 : 14), r: 4, tone: t, hi: !!(o.hot && o.hot(i)), dash: !!(o.dash && o.dash(i)) }));
      if (o.idx !== false) out.push(T(p + 'i' + i, x + i * cw + cw / 2 - 1, y + (o.ch || 40) + 16, '[' + i + ']', { anchor: 'middle', mono: true, size: 11.5, tone: t !== 'muted' ? t : 'muted' }));
    });
    return out;
  }
  function refBox(id, x, y, name, o) { return B(id, x, y, 120, 44, mix({ tag: name, title: 'reference', size: 12, tone: 'teal' }, o || {})); }

  /* ---------- 1. an array of ten doubles (slide 4) ---------- */
  var ML = [5.6, 4.5, 3.3, 13.2, 4.0, 34.33, 34.0, 45.45, 99.993, 11123];
  var intro = {
    id: 'intro', slides: [4, 4], title: 'One name, many values',
    code: 'double[] myList = new double[10];',
    steps: [
      { line: 1, ph: 'var', cap: '<code>myList</code> is an <b>array reference variable</b>. It does not hold the numbers; it holds a <b>reference</b> to the array.' },
      { line: 1, ph: 'arr', cap: 'The array itself is a row of 10 elements, all of the <b>same type</b> (double).' },
      { line: 1, ph: 'idx', cap: 'Each element has an <b>index</b>, from 0 to 9. <code>myList[5]</code> is the element at index 5.' },
      { line: 1, ph: 'val', cap: 'The <b>element value</b> of myList[5] is 34.33.' }
    ],
    draw: function (k, s) {
      var items = [refBox('ref', 20, 40, 'double[] myList', { hi: k === 0 })];
      items.push(A('ra', 144, 62, 196, 62, { tone: 'teal' }));
      ML.forEach(function (v, i) {
        var y = 20 + i * 31, on = k >= 2 && i === 5;
        items.push(T('n' + i, 290, y + 21, 'myList[' + i + ']', { anchor: 'end', mono: true, size: 13, tone: on ? 'accent' : 'muted', bold: on }));
        items.push(B('c' + i, 300, y, 120, 29, { title: k >= 1 ? jd(v).replace(/\.0$/, i === 9 ? '' : '.0') : '', mono: true, size: 13, r: 2, tone: on ? 'accent' : k === 1 ? 'teal' : 'blue', hi: on }));
      });
      if (k === 3) items.push(A('ev', 548, 191, 424, 191, { tone: 'accent', label: 'element value' }));
      return items;
    }
  };

  /* ---------- 2. declare, create, length, default values (slides 5-9) ---------- */
  var declare = {
    id: 'declare', slides: [5, 9], title: 'Declare, create, and the default values',
    inputs: [{ id: 'n', label: 'arraySize', value: 10, min: 1, max: 12 }],
    presets: [{ label: '10 (slides)', values: { n: 10 } }, { label: '3', values: { n: 3 } }, { label: '1', values: { n: 1 } }],
    code: function (v) { return 'double[] myList;\nmyList = new double[' + I(v.n) + '];\n\ndouble[] list2 = new double[' + I(v.n) + '];  // both in one step\nSystem.out.println(myList.length);'; },
    steps: function (v) {
      var n = I(v.n);
      return [
        { slide: 5, line: 1, ph: 'decl', cap: '<code>double[] myList;</code> only <b>declares</b> the variable. No array exists yet. (<code>double myList[];</code> is also allowed, but not preferred.)' },
        { slide: 6, line: 2, ph: 'new', cap: '<code>new double[' + n + ']</code> <b>creates</b> an array of ' + n + ' elements, and its reference is stored in myList. myList[0] is the first element and myList[' + (n - 1) + '] the last.' },
        { slide: 7, line: 4, ph: 'one', cap: 'Declaring and creating can be done in <b>one step</b>.' },
        { slide: 8, line: 5, ph: 'len', cap: 'Once created, the size is <b>fixed</b>. <code>myList.length</code> gives it: ' + n + '. Note: length has no parentheses (it is not a method).', out: String(n) },
        { line: 2, slide: 9, ph: 'def', cap: 'A new array is filled with <b>default values</b>: 0 for numbers (0.0 for double), \'\\u0000\' for char, and false for boolean.' }
      ];
    },
    draw: function (k, s, v) {
      var n = I(v.n), items = [];
      if (s.ph === 'def') {
        [['double[]', '0.0', 'blue'], ['int[]', '0', 'blue'], ['char[]', "'\\u0000'", 'teal'], ['boolean[]', 'false', 'red']].forEach(function (r, i) {
          items.push(T('t' + i, 20, 50 + i * 72, r[0], { mono: true, size: 14, bold: true }));
          items.push(cellsA('d' + i + '_', 120, 26 + i * 72, [r[1], r[1], r[1]], { cw: 100, ch: 36, idx: false, size: 13, tone: function () { return r[2]; } }));
        });
        return items;
      }
      items.push(refBox('ref', 20, 40, 'double[] myList', { title: s.ph === 'decl' ? '(no array yet)' : 'reference', dash: s.ph === 'decl', tone: s.ph === 'decl' ? 'muted' : 'teal', hi: s.ph === 'decl' || s.ph === 'new' }));
      if (s.ph !== 'decl') {
        var vals = []; for (var i = 0; i < n; i++) vals.push('0.0');
        items.push(A('ra', 144, 62, 176, 62, { tone: 'teal' }));
        var cw = Math.min(56, Math.floor(360 / n));
        items.push(cellsA('c', 180, 42, vals, { cw: cw, size: cw < 34 ? 10 : 14, tone: function (i) { return s.ph === 'new' && (i === 0 || i === n - 1) ? 'accent' : 'blue'; } }));
        if (s.ph === 'len') items.push(A('len', 180, 120, 180 + cw * n - 3, 120, { head: false, tone: 'accent', label: 'myList.length = ' + n, ly: 34 }));
      }
      return items;
    }
  };

  /* ---------- 3. indexed variables (slides 10-11) ---------- */
  var index = {
    id: 'index', slides: [10, 11], title: 'Use myList[i] like a variable',
    inputs: [{ id: 'a', label: 'myList[0]', value: 1.5, min: -99, max: 99 }, { id: 'b', label: 'myList[1]', value: 2.25, min: -99, max: 99 }],
    presets: [{ label: '1.5 and 2.25', values: { a: 1.5, b: 2.25 } }, { label: '10 and -4', values: { a: 10, b: -4 } }],
    code: function (v) { return 'double[] myList = new double[5];\nmyList[0] = ' + jd(v.a) + ';\nmyList[1] = ' + jd(v.b) + ';\nmyList[2] = myList[0] + myList[1];\nmyList[5] = 1;  // error!'; },
    steps: function (v) {
      var a = v.a, b = v.b;
      return [
        { slide: 10, line: 1, ph: 0, cap: 'Indexes are <b>0-based</b>: they go from 0 to <code>length - 1</code>, here 0 to 4. An element is written <code>arrayRefVar[index]</code>, an <b>indexed variable</b>.' },
        { slide: 11, line: '2-3', ph: 1, cap: 'An indexed variable is used like a normal variable: give it a value…' },
        { slide: 11, line: 4, ph: 2, cap: '…or use it in an expression: myList[2] = ' + jd(a) + ' + ' + jd(b) + ' = ' + jd(a + b) + '.' },
        { slide: 10, line: 5, ph: 3, cap: 'There is no index 5 in an array of length 5. The program stops with an <b>ArrayIndexOutOfBoundsException</b>.', out: 'Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5' }
      ];
    },
    draw: function (k, s, v) {
      var vals = ['0.0', '0.0', '0.0', '0.0', '0.0'];
      if (s.ph >= 1) { vals[0] = jd(v.a); vals[1] = jd(v.b); }
      if (s.ph >= 2) vals[2] = jd(v.a + v.b);
      var items = cellsA('c', 60, 80, vals, { cw: 80, tone: function (i) { return s.ph === 1 && i < 2 ? 'accent' : s.ph === 2 && i === 2 ? 'accent' : s.ph === 2 && i < 2 ? 'teal' : 'blue'; } });
      if (s.ph === 3) { items.push(B('x5', 460, 80, 77, 40, { title: '?', mono: true, size: 16, tone: 'red', dash: true, hi: true })); items.push(T('x5i', 498, 136, '[5]', { anchor: 'middle', mono: true, size: 11.5, tone: 'red' })); }
      if (s.ph === 2) items.push(A('p1', 99, 74, 260, 74, { tone: 'teal', bend: -40 }), A('p2', 179, 74, 260, 74, { tone: 'teal', bend: -24 }));
      if (s.ph === 0) items.push(T('rng', 260, 190, 'indexes 0 … length - 1', { anchor: 'middle', mono: true, size: 15, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 4. array initializers (slides 12-14) ---------- */
  var INI = [1.9, 2.9, 3.4, 3.5];
  var init = {
    id: 'init', slides: [12, 14], title: 'An initializer does three things at once',
    code: 'double[] myList = {1.9, 2.9, 3.4, 3.5};\n\n// is the same as:\ndouble[] myList = new double[4];\nmyList[0] = 1.9;\nmyList[1] = 2.9;\nmyList[2] = 3.4;\nmyList[3] = 3.5;',
    steps: [
      { slide: 12, line: 1, k: 4, cap: 'The <b>array initializer</b> <code>{1.9, 2.9, 3.4, 3.5}</code> declares, creates and fills the array in <b>one</b> statement. Its length is the number of values: 4.' },
      { slide: 13, line: 4, k: 0, cap: 'It is the same as creating an array of 4…' },
      { slide: 13, line: '5-8', k: 4, cap: '…and assigning the four values one by one.' },
      { line: 1, slide: 14, k: -1, cap: 'But the short form must be one statement. <code>double[] myList;</code> then <code>myList = {1.9, 2.9, 3.4, 3.5};</code> on another line is a <b>syntax error</b>.' }
    ],
    draw: function (k, s) {
      if (s.k < 0) return [
        B('a', 60, 40, 440, 44, { title: 'double[] myList;', mono: true, size: 15, tone: 'muted' }),
        B('b', 60, 110, 440, 44, { title: 'myList = {1.9, 2.9, 3.4, 3.5};', mono: true, size: 15, tone: 'red', hi: true }),
        T('e', 280, 200, 'syntax error: {…} only in the declaration', { anchor: 'middle', size: 15, bold: true, tone: 'red' })
      ];
      var vals = INI.map(function (x, i) { return i < s.k ? jd(x) : '0.0'; });
      return [refBox('ref', 20, 50, 'double[] myList', {}), A('ra', 144, 72, 196, 72, { tone: 'teal' })].concat(cellsA('c', 200, 52, vals, { cw: 80, tone: function (i) { return i < s.k ? (k === 2 ? 'accent' : 'teal') : 'blue'; } }));
    }
  };

  /* ---------- 5. trace a program with an array (slides 15-30) ---------- */
  function TR(v) { var n = I(v.n); return 'public class Test {\n  public static void main(String[] args) {\n    int[] values = new int[' + n + '];\n    for (int i = 1; i < ' + n + '; i++) {\n      values[i] = i + values[i-1];\n    }\n    values[0] = values[1] + values[' + (n - 1) + '];\n  }\n}'; }
  var trace = {
    id: 'trace', slides: [15, 30], title: 'values[i] = i + values[i-1]', code: TR,
    inputs: [{ id: 'n', label: 'array size', value: 5, min: 2, max: 8 }],
    presets: [{ label: '5 (slides)', values: { n: 5 } }, { label: '3', values: { n: 3 } }, { label: '8', values: { n: 8 } }],
    steps: function (v) {
      var n = I(v.n), a = [], st = [], i;
      for (i = 0; i < n; i++) a.push(0);
      var snap = function () { return a.slice(); };
      st.push({ slide: 15, line: 3, a: snap(), i: null, cap: 'Declare the array variable values, create an array of ' + n + ' ints (all 0), and assign its reference to values.' });
      st.push({ slide: 16, line: 4, a: snap(), i: 1, cap: 'i becomes 1.' });
      var SL = [[17, 18, 19], [20, 21, 22], [23, 24, 25], [26, 27, 28]];
      for (i = 1; i < n; i++) {
        var sl = SL[Math.min(i - 1, 3)];
        st.push({ slide: sl[0], line: 4, a: snap(), i: i, test: true, cap: 'i (= ' + i + ') is less than ' + n + '.' });
        a[i] = i + a[i - 1];
        st.push({ slide: sl[1], line: 5, a: snap(), i: i, w: i, r: i - 1, cap: 'After this line, values[' + i + '] is ' + a[i] + ' (' + i + ' + ' + a[i - 1] + ').' });
        st.push({ slide: sl[2], line: 4, a: snap(), i: i + 1, cap: 'After i++, i becomes ' + (i + 1) + '.' });
      }
      st.push({ slide: 29, line: 4, a: snap(), i: n, fin: true, cap: 'i (= ' + n + ') < ' + n + ' is false. Exit the loop.' });
      a[0] = a[1] + a[n - 1];
      st.push({ slide: 30, line: 7, a: snap(), i: null, w: 0, r2: [1, n - 1], cap: 'After this line, values[0] is ' + a[0] + ' (' + a[1] + ' + ' + a[n - 1] + ').' });
      return st;
    },
    draw: function (k, s) {
      var n = s.a.length, items = [refBox('ref', 20, 40, 'int[] values', {}), A('ra', 144, 62, 176, 62, { tone: 'teal' })];
      items.push(cellsA('c', 180, 42, s.a, { w: 360, tone: function (j) { return j === s.w ? 'accent' : j === s.r || (s.r2 && s.r2.indexOf(j) >= 0) ? 'teal' : 'blue'; }, hot: function (j) { return j === s.w; } }));
      if (s.i != null) items.push(vbox('iv', 20, 170, 120, 'i', 'int', s.i, s.test ? hot() : {}));
      if (s.test) items.push(T('t', 160, 200, s.i + ' < ' + n + '  →  true', { mono: true, size: 15, bold: true, tone: 'teal' }));
      if (s.fin) items.push(T('t', 160, 200, s.i + ' < ' + n + '  →  false', { mono: true, size: 15, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* ---------- 6. processing arrays (slides 31-36) ---------- */
  var PROC = 'java.util.Scanner input = new java.util.Scanner(System.in);\nSystem.out.print("Enter " + myList.length + " values: ");\nfor (int i = 0; i < myList.length; i++)\n  myList[i] = input.nextDouble();\n\nfor (int i = 0; i < myList.length; i++) {\n  myList[i] = Math.random() * 100;\n}\n\nfor (int i = 0; i < myList.length; i++) {\n  System.out.print(myList[i] + " ");\n}\n\ndouble total = 0;\nfor (int i = 0; i < myList.length; i++) {\n  total += myList[i];\n}\n\ndouble max = myList[0];\nfor (int i = 1; i < myList.length; i++) {\n  if (myList[i] > max) max = myList[i];\n}';
  var process = {
    id: 'process', slides: [31, 36], title: 'Fill, print, sum and find the largest', code: PROC,
    inputs: [{ id: 'v', type: 'text', label: 'the values typed', value: '5.6 4.5 3.3 13.2 4.0', maxlen: 40 }],
    presets: [{ label: '5.6 4.5 3.3 13.2 4.0', values: { v: '5.6 4.5 3.3 13.2 4.0' } }, { label: '3 3 3', values: { v: '3 3 3' } }, { label: 'negative: -2 -9 -1', values: { v: '-2 -9 -1' } }, { label: 'one value: 7', values: { v: '7' } }],
    steps: function (v) {
      var a = nums(v.v, 8); if (!a.length) a = [0];
      var n = a.length, st = [{ line: '3-4', slide: 31, a: a, cap: 'Eight common jobs with an array: fill it from input, fill it with random values, print it, sum it, find the largest element, find the index of the largest, shuffle it, and shift it. Most of them are one for loop over the indexes.' }];
      st.push({ slide: 32, line: '1-4', a: a, all: true, cap: 'Fill the array from the keyboard: <code>myList[i] = input.nextDouble();</code> for each index i.', out: 'Enter ' + n + ' values: ' + v.v });
      var r = a.map(function () { return Math.round(Math.random() * 10000) / 100; });
      st.push({ slide: 33, line: '6-8', a: r, rnd: true, cap: '<code>Math.random() * 100</code> would fill it with random numbers from 0 up to 100 instead (they have more digits; here they are cut for the drawing). Below we go on with the typed values.' });
      st.push({ slide: 34, line: '10-12', a: a, all: true, cap: 'Print each element and a space.', out: a.map(jd).join(' ') + ' ' });
      var t = 0;
      a.forEach(function (x, i) { t += x; st.push({ slide: 35, line: '15-16', a: a, i: i, total: t, cap: (i ? '' : '<code>double total = 0;</code> Then ') + 'total += myList[' + i + ']: total is ' + jd(t) + '.' + (i === n - 1 ? ' That is the sum of all elements.' : '') }); });
      var m = a[0];
      st.push({ slide: 36, line: 19, a: a, i: 0, max: m, cap: 'Start with <code>max = myList[0]</code> = ' + jd(m) + '.' });
      for (var i = 1; i < n; i++) { var b = a[i] > m; if (b) m = a[i]; st.push({ slide: 36, line: '20-21', a: a, i: i, max: m, big: b, cap: 'Is myList[' + i + '] (' + jd(a[i]) + ') > max? <b>' + tf(b) + '</b>' + (b ? ': max = ' + jd(m) + '.' : '.') + (i === n - 1 ? ' The largest element is ' + jd(m) + '.' : '') }); }
      return st;
    },
    draw: function (k, s) {
      var items = cellsA('c', 30, 40, s.a.map(function (x) { return s.rnd ? x.toFixed(2) : jd(x); }), { w: 500, tone: function (i) { return s.rnd ? 'teal' : s.all ? 'accent' : i === s.i ? 'accent' : s.i != null && i < s.i ? 'teal' : 'blue'; } });
      if (s.total != null) items.push(vbox('tot', 30, 180, 200, 'total', 'double', jd(s.total), hot()));
      if (s.max != null) items.push(vbox('mx', 30, 180, 200, 'max', 'double', jd(s.max), s.big || k === 0 ? hot() : {}));
      return items;
    }
  };

  /* ---------- 7. random shuffling (slide 37) ---------- */
  var SHUF = 'for (int i = myList.length - 1; i > 0; i--) {\n  // Generate an index j randomly with 0 <= j <= i\n  int j = (int)(Math.random()\n    * (i + 1));\n\n  // Swap myList[i] with myList[j]\n  double temp = myList[i];\n  myList[i] = myList[j];\n  myList[j] = temp;\n}';
  var shuffle = {
    id: 'shuffle', slides: [37, 37], title: 'Swap each element with a random earlier one', code: SHUF,
    inputs: [{ id: 'n', label: 'myList.length', value: 6, min: 2, max: 8 }],
    presets: [{ label: '6', values: { n: 6 } }, { label: '3', values: { n: 3 } }],
    steps: function (v) {
      var n = I(v.n), a = [], st = [];
      for (var t = 1; t <= n; t++) a.push(t);
      st.push({ line: 1, a: a.slice(), cap: 'myList holds ' + n + ' values (1.0, 2.0, …). The loop goes from the <b>last</b> index down to 1.' });
      for (var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        st.push({ line: '3-4', a: a.slice(), i: i, j: j, cap: 'i = ' + i + ': pick a random j from 0 to ' + i + '. This time j = ' + j + '.' });
        var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
        st.push({ line: '7-9', a: a.slice(), i: i, j: j, sw: true, cap: i === j ? 'j = i, so the element stays where it is (a swap with itself).' : 'Swap myList[' + i + '] and myList[' + j + '] using temp. Position ' + i + ' is now final.' });
      }
      st.push({ line: '7-9', a: a.slice(), done: true, cap: 'Done: a random order. Every order is equally likely. Change the size to shuffle again.' });
      return st;
    },
    draw: function (k, s) {
      var cw = Math.min(56, Math.floor(480 / s.a.length)), items = cellsA('c', 40, 80, s.a.map(function (x) { return jd(x); }), { cw: cw, tone: function (q) { return q === s.i ? 'accent' : q === s.j ? 'teal' : s.i != null && q > s.i ? 'muted' : 'blue'; } });
      if (s.i != null && s.i !== s.j) items.push(A('sw', 40 + s.i * cw + cw / 2, 76, 40 + s.j * cw + cw / 2, 76, { tone: s.sw ? 'accent' : 'muted', bend: 40, dash: !s.sw, label: s.sw ? 'swap' : '' }));
      if (s.i != null) items.push(T('ij', 280, 200, 'i = ' + s.i + '   j = ' + s.j, { anchor: 'middle', mono: true, size: 16, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 8. shifting elements (slide 38) ---------- */
  var SHIFT = 'double temp = myList[0]; // Retain the first element\n\n// Shift elements left\nfor (int i = 1; i < myList.length; i++) {\n  myList[i - 1] = myList[i];\n}\n\n// Move the first element to fill in the last position\nmyList[myList.length - 1] = temp;';
  var shift = {
    id: 'shift', slides: [38, 38], title: 'Shift left, and the first goes to the end', code: SHIFT,
    inputs: [{ id: 'v', type: 'text', label: 'myList', value: '1 2 3 4 5 6', maxlen: 30 }],
    presets: [{ label: '1 2 3 4 5 6', values: { v: '1 2 3 4 5 6' } }, { label: '9 8 7', values: { v: '9 8 7' } }],
    steps: function (v) {
      var a = nums(v.v, 8); if (a.length < 2) a = a.concat([0, 0]).slice(0, 2);
      var n = a.length, st = [], temp = a[0];
      st.push({ line: 1, a: a.slice(), temp: temp, cap: 'Keep the first element in temp (' + jd(temp) + '), because it will be overwritten.' });
      for (var i = 1; i < n; i++) { a[i - 1] = a[i]; st.push({ line: '4-5', a: a.slice(), temp: temp, i: i, cap: 'i = ' + i + ': myList[' + (i - 1) + '] = myList[' + i + '] (' + jd(a[i]) + '). Each value moves one place to the left.' }); }
      a[n - 1] = temp;
      st.push({ line: 9, a: a.slice(), temp: temp, last: true, cap: 'Put temp in the last position. The array is rotated left by one.' });
      return st;
    },
    draw: function (k, s) {
      var n = s.a.length, cw = Math.min(56, Math.floor(440 / n)), items = cellsA('c', 100, 80, s.a.map(function (x) { return jd(x); }), { cw: cw, tone: function (q) { return s.i != null && q === s.i - 1 ? 'accent' : s.last && q === n - 1 ? 'accent' : 'blue'; } });
      if (s.i != null) items.push(A('mv', 100 + s.i * cw + cw / 2, 76, 100 + (s.i - 1) * cw + cw / 2, 76, { tone: 'accent', bend: 26 }));
      items.push(vbox('tmp', 100, 200, 140, 'temp', 'double', jd(s.temp), k === 0 || s.last ? hot() : {}));
      if (s.last) items.push(A('tl', 244, 224, 100 + (n - 1) * cw + cw / 2, 140, { tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 9. the opening problem: AnalyzeNumbers (slides 2, 39) ---------- */
  var ANA = 'java.util.Scanner input = new java.util.Scanner(System.in);\nSystem.out.print("Enter the number of items: ");\nint n = input.nextInt();\ndouble[] numbers = new double[n];\ndouble sum = 0;\n\nSystem.out.print("Enter the numbers: ");\nfor (int i = 0; i < n; i++) {\n  numbers[i] = input.nextDouble();\n  sum += numbers[i];\n}\n\ndouble average = sum / n;\n\nint count = 0; // The number of elements above average\nfor (int i = 0; i < n; i++)\n  if (numbers[i] > average)\n    count++;\n\nSystem.out.println("Average is " + average);\nSystem.out.println("Number of elements above the average is " + count);';
  var analyze = {
    id: 'analyze', slides: [39, 39], title: 'Why we need an array: read, then compare again', code: ANA,
    inputs: [{ id: 'v', type: 'text', label: 'the numbers', value: '3.4 5 6 1 6.5 7.8 3.5 8.5', maxlen: 48 }],
    presets: [{ label: '8 numbers', values: { v: '3.4 5 6 1 6.5 7.8 3.5 8.5' } }, { label: '1 2 3 4', values: { v: '1 2 3 4' } }, { label: 'all the same: 5 5 5', values: { v: '5 5 5' } }],
    steps: function (v) {
      var a = nums(v.v, 10); if (!a.length) a = [0];
      var n = a.length, sum = 0; a.forEach(function (x) { sum += x; });
      var avg = sum / n, cnt = a.filter(function (x) { return x > avg; }).length;
      return [
        { line: '2-4', a: a, ph: 'new', cap: 'Read n = ' + n + ' and create an array for exactly n numbers.', out: 'Enter the number of items: ' + n },
        { line: '7-11', a: a, ph: 'fill', sum: sum, cap: 'Read the numbers <b>into the array</b> and add them up: sum = ' + jd(sum) + '.', out: 'Enter the numbers: ' + v.v },
        { line: 13, a: a, ph: 'avg', sum: sum, avg: avg, cap: 'average = sum / n = ' + jd(avg) + '. Only now do we know the average…' },
        { line: '15-18', a: a, ph: 'cnt', avg: avg, cnt: cnt, cap: '…so we need the numbers <b>again</b> to compare each one with it. That is why they were kept in an array. ' + cnt + ' of them are above the average.' },
        { line: '20-21', a: a, ph: 'out', avg: avg, cnt: cnt, cap: 'Print the results.', out: ['Average is ' + jd(avg), 'Number of elements above the average is ' + cnt] }
      ];
    },
    draw: function (k, s) {
      var items = cellsA('c', 30, 40, s.a.map(function (x) { return s.ph === 'new' ? '0.0' : jd(x); }), { w: 500, tone: function (i) { return s.ph === 'cnt' || s.ph === 'out' ? (s.a[i] > s.avg ? 'teal' : 'muted') : s.ph === 'fill' ? 'accent' : 'blue'; } });
      if (s.sum != null) items.push(vbox('sm', 30, 160, 150, 'sum', 'double', jd(s.sum), s.ph === 'fill' ? hot() : {}));
      if (s.avg != null) items.push(vbox('av', 200, 160, 160, 'average', 'double', jd(s.avg), s.ph === 'avg' ? hot() : {}));
      if (s.cnt != null) items.push(vbox('ct', 380, 160, 150, 'count', 'int', s.cnt, s.ph === 'cnt' ? hot() : {}));
      if (s.ph === 'cnt' || s.ph === 'out') items.push(T('key', 30, 300, 'teal: above the average', { size: 12.5, bold: true, tone: 'teal' }));
      return items;
    }
  };

  /* ---------- 10. copying arrays (slides 40-42) ---------- */
  var COPY = 'int[] list1 = {2, 3, 1, 5, 10};\nint[] list2 = new int[5];\nlist2 = list1;\n\nint[] sourceArray = {2, 3, 1, 5, 10};\nint[] targetArray = new int[sourceArray.length];\nfor (int i = 0; i < sourceArray.length; i++)\n  targetArray[i] = sourceArray[i];\n\nSystem.arraycopy(sourceArray, 0, targetArray, 0, sourceArray.length);';
  var SRC = [2, 3, 1, 5, 10];
  var copy = {
    id: 'copy', slides: [40, 42], title: 'Copying the reference is not copying the array', code: COPY,
    steps: [
      { slide: 40, line: '1-2', ph: 'before', cap: '<b>Before</b> <code>list2 = list1;</code>: two variables, two separate arrays.' },
      { slide: 40, line: 3, ph: 'after', cap: '<b>After</b> it: list2 gets the <b>reference</b> of list1, so both point to the <b>same</b> array. The old contents of list2 can no longer be reached (Java will clean it up). Nothing was copied!' },
      { slide: 41, line: '5-6', ph: 'new', cap: 'To really copy, create a new array of the same length…' },
      { slide: 41, line: '7-8', ph: 'loop', cap: '…and copy each element with a loop. Now there are two separate arrays with the same values. (Slide 41 writes <code>sourceArrays.length</code>; the variable is <code>sourceArray</code>.)' },
      { slide: 42, line: 10, ph: 'ac', cap: '<code>System.arraycopy(sourceArray, src_pos, targetArray, tar_pos, length)</code> does the same in one call: copy <b>length</b> elements, starting at src_pos in the source, into the target starting at tar_pos.' }
    ],
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'before' || s.ph === 'after') {
        items.push(refBox('l1', 20, 50, 'list1', {}), refBox('l2', 20, 190, 'list2', { hi: s.ph === 'after', tone: s.ph === 'after' ? 'accent' : 'teal' }));
        items.push(cellsA('a', 240, 52, SRC, { cw: 56, tone: function () { return 'blue'; } }));
        items.push(cellsA('b', 240, 192, [0, 0, 0, 0, 0], { cw: 56, tone: function () { return s.ph === 'after' ? 'muted' : 'blue'; }, dash: function () { return s.ph === 'after'; } }));
        items.push(A('r1', 144, 72, 236, 72, { tone: 'teal' }));
        if (s.ph === 'before') items.push(A('r2', 144, 212, 236, 212, { tone: 'teal' }));
        else { items.push(A('r2', 144, 206, 236, 92, { tone: 'accent' })); items.push(T('gb', 380, 278, 'no longer reachable', { anchor: 'middle', size: 12.5, tone: 'muted', bold: true })); }
        return items;
      }
      var full = s.ph !== 'new';
      items.push(refBox('s', 20, 50, 'sourceArray', {}), refBox('t', 20, 190, 'targetArray', {}));
      items.push(cellsA('a', 240, 52, SRC, { cw: 56, tone: function () { return 'blue'; } }));
      items.push(cellsA('b', 240, 192, full ? SRC : [0, 0, 0, 0, 0], { cw: 56, tone: function () { return full ? 'accent' : 'blue'; } }));
      items.push(A('r1', 144, 72, 236, 72, { tone: 'teal' }), A('r2', 144, 212, 236, 212, { tone: 'teal' }));
      if (full) for (var i = 0; i < 5; i++) items.push(A('cp' + i, 266 + i * 56, 112, 266 + i * 56, 186, { tone: 'accent', dash: true }));
      return items;
    }
  };

  /* ---------- 11. passing an array to a method (slides 43-44) ---------- */
  var PA = 'public static void printArray(int[] array) {\n  for (int i = 0; i < array.length; i++) {\n    System.out.print(array[i] + " ");\n  }\n}\n\nint[] list = {3, 1, 2, 6, 4, 2};\nprintArray(list);\n\nprintArray(new int[]{3, 1, 2, 6, 4, 2});';
  var LST = [3, 1, 2, 6, 4, 2];
  var passarr = {
    id: 'passarr', slides: [43, 44], title: 'The method gets the reference', code: PA,
    steps: [
      { slide: 43, line: 7, ph: 'list', cap: 'list refers to an array of six ints.' },
      { slide: 43, line: 8, ph: 'call', cap: '<code>printArray(list)</code>: the parameter <code>array</code> gets a copy of the <b>reference</b>, so it points to the same array.' },
      { slide: 43, line: '2-4', ph: 'print', cap: 'The loop prints each element and a space.', out: '3 1 2 6 4 2 ' },
      { slide: 44, line: 10, ph: 'anon', cap: '<code>new int[]{3, 1, 2, 6, 4, 2}</code> creates an array with <b>no</b> variable for it: an <b>anonymous array</b>. It is passed straight to the method (and printed again, on the same line, because print does not end the line).' }
    ],
    draw: function (k, s) {
      var items = [];
      if (s.ph !== 'anon') items.push(refBox('l', 20, 40, 'int[] list', {}), A('r1', 144, 62, 196, 100, { tone: 'teal' }));
      if (s.ph === 'call' || s.ph === 'print' || s.ph === 'anon') items.push(refBox('p', 20, 200, 'int[] array (parameter)', { tone: 'accent', hi: s.ph !== 'print' }), A('r2', 144, 222, 206, 143, { tone: 'accent', via: [[206, 222]] }));
      items.push(cellsA('c', 200, 100, LST, { cw: 56, tone: function () { return s.ph === 'print' ? 'accent' : s.ph === 'anon' ? 'teal' : 'blue'; } }));
      if (s.ph === 'anon') items.push(T('an', 368, 80, 'anonymous array: no variable', { anchor: 'middle', size: 13, bold: true, tone: 'teal' }));
      return items;
    }
  };

  /* ---------- 12. pass by value with an array: the heap (slides 45-49) ---------- */
  var M46 = 'public class Test {\n  public static void main(String[] args) {\n    int x = 1; // x represents an int value\n    int[] y = new int[10]; // y represents an array of int values\n\n    m(x, y); // Invoke m with arguments x and y\n\n    System.out.println("x is " + x);\n    System.out.println("y[0] is " + y[0]);\n  }\n\n  public static void m(int number, int[] numbers) {\n    number = 1001; // Assign a new value to number\n    numbers[0] = 5555; // Assign a new value to numbers[0]\n  }\n}';
  function stackWalls(x1, x2) { return [A('sw1', x1, 30, x1, 322, { head: false, tone: 'muted' }), A('sw2', x2, 30, x2, 322, { head: false, tone: 'muted' }), A('sw3', x1, 322, x2, 322, { head: false, tone: 'muted' }), T('stl', x1 + 6, 22, 'Stack', { size: 12, bold: true, tone: 'muted' })]; }
  var passref = {
    id: 'passref', slides: [45, 49], title: 'A primitive is copied; an array is shared', code: M46,
    steps: [
      { line: 12, slide: 45, ph: 'idea', cap: 'Java always passes <b>by value</b>. For an int, the value is the number. For an array, the value is the <b>reference</b>, so the method can reach the same array.' },
      { slide: 46, line: '3-4', ph: 'main', cap: 'x = 1. y refers to a new array of 10 ints (all 0) that lives in the <b>heap</b>.' },
      { slide: 47, line: 6, ph: 'call', cap: 'm(x, y): number gets the value 1; numbers gets the <b>same reference</b> as y, so both point to the same array.' },
      { slide: 47, line: 13, ph: 'n1001', cap: 'number = 1001 changes only number. x is still 1.' },
      { slide: 47, line: 14, ph: 'n5555', cap: 'numbers[0] = 5555 changes the array in the heap: the <b>one</b> array that y also refers to.' },
      { slide: 48, line: '8-9', ph: 'back', cap: 'm ends. x is 1, but y[0] is 5555. (Slide 48 shows the same picture for the TestPassArray program of slides 50-51.)', out: ['x is 1', 'y[0] is 5555'] },
      { line: 4, slide: 49, ph: 'heap', cap: 'The JVM stores arrays in an area of memory called the <b>heap</b>, used for dynamic memory: blocks are allocated and freed in any order. The stack holds only the reference.' }
    ],
    draw: function (k, s) {
      var items = stackWalls(20, 270), ph = s.ph, inM = ph === 'call' || ph === 'n1001' || ph === 'n5555';
      items.push(A('hw1', 340, 30, 340, 322, { head: false, tone: 'muted' }), A('hw2', 540, 30, 540, 322, { head: false, tone: 'muted' }), T('hpl', 346, 22, 'Heap', { size: 12, bold: true, tone: 'muted' }));
      if (ph === 'idea') {
        items.push(T('i1', 145, 120, 'int: the value', { anchor: 'middle', size: 15, bold: true, tone: 'teal' }), T('i2', 145, 170, 'array: the reference', { anchor: 'middle', size: 15, bold: true, tone: 'accent' }));
        return items;
      }
      items.push(B('mf', 30, 214, 230, boxH(2), { title: 'main', band: true, mono: true, lsize: 13, lines: ['int x: 1', 'int[] y: reference'], tone: 'blue' }));
      var v0 = ph === 'n5555' || ph === 'back' || ph === 'heap' ? 5555 : 0;
      items.push(cellsA('h', 360, 120, [v0, 0, 0, '…'], { cw: 42, tone: function (i) { return i === 0 && ph === 'n5555' ? 'accent' : 'blue'; } }));
      items.push(A('yr', 260, 262, 356, 140, { tone: 'teal' }));
      if (inM) {
        items.push(B('mm', 30, 110, 230, boxH(2), { title: 'm', band: true, mono: true, lsize: 13, lines: [{ t: 'int number: ' + (ph === 'call' ? 1 : 1001), b: ph === 'n1001', tone: ph === 'n1001' ? 'accent' : undefined }, 'int[] numbers: reference'], tone: 'accent', hi: true }));
        items.push(A('nr', 260, 158, 356, 132, { tone: 'accent' }));
      }
      if (ph === 'heap') items.push(T('hp', 440, 260, 'arrays live here', { anchor: 'middle', size: 13, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 13. TestPassArray (slides 50-51) ---------- */
  var TPA = 'public static void main(String[] args) {\n  int[] a = {1, 2};\n  swap(a[0], a[1]);\n  System.out.println("After swap: {" + a[0] + ", " + a[1] + "}");\n  swapFirstTwoInArray(a);\n  System.out.println("After swapFirstTwoInArray: {" + a[0] + ", " + a[1] + "}");\n}\n\npublic static void swap(int n1, int n2) {\n  int temp = n1;\n  n1 = n2;\n  n2 = temp;\n}\n\npublic static void swapFirstTwoInArray(int[] array) {\n  int temp = array[0];\n  array[0] = array[1];\n  array[1] = temp;\n}';
  var testpass = {
    id: 'testpass', slides: [50, 51], title: 'swap vs swapFirstTwoInArray', code: TPA,
    steps: [
      { line: 2, ph: 'main', a: [1, 2], cap: 'a refers to the array {1, 2} in the heap.' },
      { line: 3, ph: 'swap', a: [1, 2], n: [1, 2], cap: 'swap(a[0], a[1]) passes the two <b>int values</b> 1 and 2 to n1 and n2.' },
      { line: '10-12', ph: 'swap2', a: [1, 2], n: [2, 1], cap: 'swap exchanges n1 and n2 inside its own record…' },
      { line: 4, ph: 'after1', a: [1, 2], cap: '…but the array did not change.', out: 'After swap: {1, 2}' },
      { line: 5, ph: 'sfta', a: [1, 2], cap: 'swapFirstTwoInArray(a) passes the <b>reference</b> in a. The parameter array points to the same array.' },
      { line: '16-18', ph: 'sfta2', a: [2, 1], cap: 'It swaps array[0] and array[1]: the elements of the <b>shared</b> array.' },
      { line: 6, ph: 'after2', a: [2, 1], cap: 'Back in main, a sees the change.', out: 'After swapFirstTwoInArray: {2, 1}' }
    ],
    draw: function (k, s) {
      var items = stackWalls(20, 270), ph = s.ph;
      items.push(A('hw1', 340, 30, 340, 322, { head: false, tone: 'muted' }), A('hw2', 540, 30, 540, 322, { head: false, tone: 'muted' }), T('hpl', 346, 22, 'Heap', { size: 12, bold: true, tone: 'muted' }));
      items.push(B('mf', 30, 240, 230, boxH(1), { title: 'main', band: true, mono: true, lsize: 13, lines: ['int[] a: reference'], tone: 'blue' }));
      items.push(cellsA('h', 380, 150, s.a, { cw: 56, tone: function () { return ph === 'sfta2' ? 'accent' : 'blue'; } }));
      items.push(A('ar', 260, 280, 376, 170, { tone: 'teal' }));
      if (s.n) items.push(B('sw', 30, 130, 230, boxH(3), { title: 'swap', band: true, mono: true, lsize: 13, lines: ['temp: ' + (ph === 'swap2' ? 1 : ''), 'n2: ' + s.n[1], 'n1: ' + s.n[0]], tone: 'accent', hi: true }));
      if (ph === 'swap') items.push(A('cp', 380, 196, 262, 196, { tone: 'accent', dash: true, label: 'values' }));
      if (ph === 'sfta' || ph === 'sfta2') {
        items.push(B('sf', 30, 150, 230, boxH(1), { title: 'swapFirstTwoInArray', band: true, mono: true, lsize: 13, size: 12, lines: ['int[] array: reference'], tone: 'accent', hi: true }));
        items.push(A('ar2', 260, 190, 376, 160, { tone: 'accent' }));
      }
      return items;
    }
  };

  /* ---------- 14. returning an array: reverse (slides 52-75) ---------- */
  var REV = 'public static int[] reverse(int[] list) {\n  int[] result = new int[list.length];\n\n  for (int i = 0, j = result.length - 1;\n       i < list.length; i++, j--) {\n    result[j] = list[i];\n  }\n\n  return result;\n}\n\nint[] list1 = {1, 2, 3, 4, 5, 6};\nint[] list2 = reverse(list1);';
  function REVc(v) { return REV.replace('{1, 2, 3, 4, 5, 6}', jlist(revList(v))); }
  function revList(v) { var a = ints(v.v, 8); return a.length ? a : [0]; }
  var reverse = {
    id: 'reverse', slides: [52, 75], title: 'reverse: i goes up, j goes down', code: REVc,
    inputs: [{ id: 'v', type: 'text', label: 'list1', value: '1 2 3 4 5 6', maxlen: 30 }],
    presets: [{ label: '1 2 3 4 5 6 (slides)', values: { v: '1 2 3 4 5 6' } }, { label: '7 8 9', values: { v: '7 8 9' } }, { label: 'one element: 5', values: { v: '5' } }],
    steps: function (v) {
      var L = revList(v), n = L.length, r = [], st = [];
      for (var t = 0; t < n; t++) r.push(0);
      st.push({ slide: 52, line: '12-13', r: null, cap: 'A method can <b>return an array</b>: its return type is <code>int[]</code>. reverse builds a new array with the elements in the opposite order.' });
      st.push({ slide: 53, line: 2, r: r.slice(), cap: 'Declare result and create an array of the same length (' + n + '), all 0.' });
      st.push({ slide: 54, line: 4, r: r.slice(), i: 0, j: n - 1, cap: 'i = 0 and j = ' + (n - 1) + '.' });
      for (var i = 0, j = n - 1; i < n; i++, j--) {
        st.push({ slide: Math.min(55 + 3 * i, 70), line: 5, r: r.slice(), i: i, j: j, test: true, cap: 'i (= ' + i + ') is less than ' + n + '.' });
        r[j] = L[i];
        st.push({ slide: Math.min(56 + 3 * i, 71), line: 6, r: r.slice(), i: i, j: j, as: true, cap: 'i = ' + i + ' and j = ' + j + '. Assign list[' + i + '] to result[' + j + ']: ' + L[i] + '.' });
        st.push({ slide: Math.min(57 + 3 * i, 72), line: 5, r: r.slice(), i: i + 1, j: j - 1, cap: 'After this, i becomes ' + (i + 1) + ' and j becomes ' + (j - 1) + '.' });
      }
      st.push({ slide: 73, line: 5, r: r.slice(), i: n, j: -1, fin: true, cap: 'i (= ' + n + ') < ' + n + ' is false. So exit the loop.' });
      st.push({ slide: 74, line: 9, r: r.slice(), ret: true, cap: 'Return result: its reference is stored in list2.' });
      st.push({ line: '12-13', slide: 75, r: r.slice(), ret: true, cap: 'Slide 75 puts it all in a program with a printArray method. Between lines of stars it prints list1, then list2.', out: [L.join(' ') + ' ', r.join(' ') + ' '] });
      return st;
    },
    draw: function (k, s, v) {
      var L = revList(v), n = L.length, cw = Math.min(56, Math.floor(400 / n)), items = [];
      items.push(T('ll', 20, 66, 'list', { mono: true, bold: true, size: 14 }));
      items.push(cellsA('a', 110, 40, L, { cw: cw, tone: function (q) { return q === s.i && s.i < n && (s.as || s.test) ? 'accent' : 'blue'; } }));
      if (s.r) {
        items.push(T('rl', 20, 196, s.ret ? 'result\nlist2' : 'result', { mono: true, bold: true, size: 14 }));
        items.push(cellsA('b', 110, 170, s.r, { cw: cw, tone: function (q) { return q === s.j && s.as ? 'accent' : s.ret ? 'teal' : 'blue'; } }));
        if (s.as) items.push(A('mv', 110 + s.i * cw + cw / 2, 102, 110 + s.j * cw + cw / 2, 166, { tone: 'accent' }));
      }
      if (s.i != null && !s.ret) items.push(T('ij', 110, 290, 'i = ' + s.i + '    j = ' + s.j, { mono: true, size: 15, bold: true, tone: s.fin ? 'red' : 'accent' }));
      return items;
    }
  };

  /* ---------- 15. linear search (slides 76-78) ---------- */
  var LIN = 'public class LinearSearch {\n  /** The method for finding a key in the list */\n  public static int linearSearch(int[] list, int key) {\n    for (int i = 0; i < list.length; i++)\n      if (key == list[i])\n        return i;\n    return -1;\n  }\n}';
  var linear = {
    id: 'linear', slides: [76, 78], title: 'Compare the key with each element in turn', code: LIN,
    inputs: [{ id: 'v', type: 'text', label: 'list', value: '6 4 1 9 7 3 2 8', maxlen: 30 }, { id: 'key', label: 'key', value: 3, min: -99, max: 99 }],
    presets: [{ label: 'key 3 (slide)', values: { v: '6 4 1 9 7 3 2 8', key: 3 } }, { label: 'key 6 (first)', values: { v: '6 4 1 9 7 3 2 8', key: 6 } }, { label: 'key 5 (missing)', values: { v: '6 4 1 9 7 3 2 8', key: 5 } }, { label: 'two 4s', values: { v: '4 1 4 2', key: 4 } }],
    steps: function (v) {
      var L = ints(v.v, 10), key = I(v.key), st = [{ line: '4-5', i: -1, cap: 'Search for key = ' + key + '. Linear search compares the key with list[0], list[1], … in order.' }];
      for (var i = 0; i < L.length; i++) {
        var hit = L[i] === key;
        st.push({ line: hit ? '5-6' : '4-5', i: i, hit: hit, cap: 'key == list[' + i + ']? ' + key + ' == ' + L[i] + ' is <b>' + tf(hit) + '</b>.' + (hit ? ' Found: return ' + i + '. The search stops at the first match.' : '') });
        if (hit) return st;
      }
      st.push({ line: 7, i: L.length, cap: 'The list is exhausted without a match: return <b>-1</b>.' });
      return st;
    },
    draw: function (k, s, v) {
      var L = ints(v.v, 10), key = I(v.key), cw = Math.min(56, Math.floor(480 / Math.max(L.length, 1))), items = [];
      items.push(B('key', 20, 30, 80, 50, { tag: 'key', title: String(key), mono: true, size: 20, tone: 'accent', hi: true }));
      items.push(cellsA('c', 40, 130, L, { cw: cw, tone: function (q) { return q === s.i ? (s.hit ? 'teal' : 'accent') : q < s.i ? 'muted' : 'blue'; }, dash: function (q) { return q < s.i; } }));
      if (s.i >= 0 && s.i < L.length) items.push(A('cmp', 60, 84, 40 + s.i * cw + cw / 2, 126, { tone: s.hit ? 'teal' : 'accent', dash: !s.hit }));
      if (s.i === L.length) items.push(T('nf', 280, 260, 'not found: -1', { anchor: 'middle', size: 18, bold: true, tone: 'red' }));
      if (s.hit) items.push(T('fd', 280, 260, 'found at index ' + s.i, { anchor: 'middle', size: 18, bold: true, tone: 'teal' }));
      return items;
    }
  };

  /* ---------- 16. Arrays.sort and Arrays.toString (slides 79-80) ---------- */
  var SORT = 'double[] numbers = {6.0, 4.4, 1.9, 2.9, 3.4, 3.5};\njava.util.Arrays.sort(numbers);\n\nchar[] chars = {\'a\', \'A\', \'4\', \'F\', \'D\', \'P\'};\njava.util.Arrays.sort(chars);\n\nSystem.out.println(java.util.Arrays.toString(numbers));\nSystem.out.println(java.util.Arrays.toString(chars));';
  var NUMS = [6.0, 4.4, 1.9, 2.9, 3.4, 3.5], CHS = ['a', 'A', '4', 'F', 'D', 'P'];
  var sortv = {
    id: 'sortv', slides: [79, 80], title: 'Sorting with java.util.Arrays', code: SORT,
    steps: [
      { slide: 79, line: 1, ph: 'n0', cap: 'An array of doubles, not in order.' },
      { slide: 79, line: 2, ph: 'n1', cap: '<code>java.util.Arrays.sort(numbers)</code> sorts it in increasing order. It changes the array itself.' },
      { slide: 79, line: 4, ph: 'c0', cap: 'An array of chars.' },
      { slide: 79, line: 5, ph: 'c1', cap: 'chars are sorted by their <b>Unicode codes</b>: \'4\' (52) < \'A\' (65) < \'D\' (68) < \'F\' (70) < \'P\' (80) < \'a\' (97). Digits come before capitals, capitals before small letters. (Java 8 also has Arrays.parallelSort, which uses several processor cores.)' },
      { slide: 80, line: '7-8', ph: 'str', cap: '<code>Arrays.toString(list)</code> returns the elements as one string, in brackets, separated by commas.', out: ['[1.9, 2.9, 3.4, 3.5, 4.4, 6.0]', '[4, A, D, F, P, a]'] }
    ],
    draw: function (k, s) {
      var ns = NUMS.slice(), cs = CHS.slice();
      if (s.ph !== 'n0') ns.sort(function (a, b) { return a - b; });
      if (s.ph === 'c1' || s.ph === 'str') cs.sort(function (a, b) { return a.charCodeAt(0) - b.charCodeAt(0); });
      var items = [T('nl', 20, 60, 'numbers', { mono: true, bold: true, size: 13 })];
      items.push(cellsA('n', 110, 36, ns.map(jd), { cw: 70, tone: function () { return s.ph === 'n1' ? 'accent' : 'blue'; } }));
      if (k >= 2) {
        items.push(T('cl', 20, 190, 'chars', { mono: true, bold: true, size: 13 }));
        items.push(cellsA('c', 110, 166, cs.map(function (c) { return "'" + c + "'"; }), { cw: 70, tone: function () { return s.ph === 'c1' ? 'accent' : 'blue'; } }));
        if (s.ph === 'c1') cs.forEach(function (c, i) { items.push(T('cc' + i, 110 + i * 70 + 34, 250, String(c.charCodeAt(0)), { anchor: 'middle', mono: true, size: 12, tone: 'accent' })); });
      }
      return items;
    }
  };

  /* ---------- 17. passing arguments to main (slides 81-82) ---------- */
  var MAINA = 'class B {\n  public static void main(String[] args) {\n    for (int i = 0; i < args.length; i++)\n      System.out.println(args[i]);\n  }\n}\n\npublic class A {\n  public static void main(String[] args) {\n    String[] strings = {"New York",\n      "Boston", "Atlanta"};\n    B.main(strings);\n  }\n}';
  var mainargs = {
    id: 'mainargs', slides: [81, 82], title: 'main is a method too: it takes a String[]', code: MAINA,
    steps: [
      { slide: 82, line: '10-11', ph: 'arr', cap: 'In A, strings refers to an array of three Strings.' },
      { slide: 82, line: 12, ph: 'call', cap: '<code>B.main(strings)</code> calls the main method of B like any static method. Its parameter <code>args</code> gets the reference.' },
      { slide: 82, line: '3-4', ph: 'print', cap: 'B’s loop prints each element of args.', out: ['New York', 'Boston', 'Atlanta'] },
      { line: 2, slide: 81, ph: 'cmd', cap: 'Normally the JVM calls main for you. The words you type after the class name on the command line, like <code>java B New York</code>, become the elements of args: here "New" and "York".' }
    ],
    draw: function (k, s) {
      var items = [];
      var vals = s.ph === 'cmd' ? ['"New"', '"York"'] : ['"New York"', '"Boston"', '"Atlanta"'];
      if (s.ph !== 'cmd') items.push(refBox('st', 20, 40, 'String[] strings', {}), A('r1', 144, 62, 216, 100, { tone: 'teal' }));
      if (s.ph !== 'arr') items.push(refBox('ar', 20, 200, 'String[] args', { tone: 'accent', hi: s.ph === 'call' }), A('r2', 144, 222, 216, 150, { tone: 'accent' }));
      items.push(cellsA('c', 220, 100, vals, { cw: 106, size: 13, tone: function () { return s.ph === 'print' ? 'accent' : 'blue'; } }));
      if (s.ph === 'cmd') items.push(T('cm', 330, 60, 'java B New York', { anchor: 'middle', mono: true, size: 16, bold: true, tone: 'accent' }));
      return items;
    }
  };

  var ALL = [intro, declare, index, init, trace, process, shuffle, shift, analyze, copy, passarr, passref, testpass, reverse, linear, sortv, mainargs];

  var para = function (t) { return { type: 'paragraph', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; },
    code = function (t, lang) { return lang ? { type: 'code', text: t, lang: lang } : { type: 'code', text: t }; }, note = function (t) { return { type: 'note', text: t }; };
  function braces(c) { var o = (c.match(/\{/g) || []).length, z = (c.match(/\}/g) || []).length; return o >= 2 && o === z; }
  var T5 = TR({ n: 5 });
  var TV = [[0, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 1, 3, 0, 0], [0, 1, 3, 6, 0], [0, 1, 3, 6, 10], [11, 1, 3, 6, 10]];
  var TVL = ['After the array is created', 'After the first iteration', 'After the second iteration', 'After the third iteration', 'After the fourth iteration', ''];
  function tr(msg, v) { return { image: false, title: 'Trace Program with Arrays', blocks: [note(msg), code(T5), para((TVL[v] ? TVL[v] + ': ' : '') + 'values = {' + TV[v].join(', ') + '}')], explain: null }; }
  var RV = 'int[] list1 = {1, 2, 3, 4, 5, 6};\nint[] list2 = reverse(list1);\n\npublic static int[] reverse(int[] list) {\n  int[] result = new int[list.length];\n\n  for (int i = 0, j = result.length - 1;\n       i < list.length; i++, j--) {\n    result[j] = list[i];\n  }\n\n  return result;\n}';
  function rv(msg) { return { image: false, title: 'Trace the reverse Method', blocks: [note(msg), code(RV)] }; }
  var S75 = 'public class Main{\npublic static void main(String[] args)          {\nint[] list1 = {1, 2, 3, 4, 5, 6};\nSystem.out.println("*******************************************\\n");\nprintArray(list1);\nint[] list2 = reverse(list1);\nSystem.out.println("\\n****************************************\\n");\nprintArray(list2);\n}\npublic static int[] reverse(int[] list){\nint[] result = new int[list.length];\nfor (int i = 0, j = result.length - 1;\ni < list.length; i++, j--)\n    {\nresult[j] = list[i];\n  }\n return result;}\npublic static void printArray(int[] array)\n{  for (int i = 0; i < array.length; i++)\n{    System.out.print(array[i] + " ");\n}\n}\n}';
  var slides = {
    1: { cover: true, image: false, title: '', blocks: [para('Chapter 7'), para('Single-Dimensional Arrays')],
      explain: '<p>Until now, every value had its own variable. But what if a program must keep 100 marks? 100 variables, mark1 to mark100, would be impossible to work with.</p><p>An <b>{{array|مصفوفة}}</b> solves this: it stores many values of the <b>same type</b> under <b>one name</b>. Each value has a number, its <b>index</b>, and a loop can visit them all.</p>' },
    2: { image: false, blocks: [para('Read one hundred numbers, compute their average, and find out how many numbers are above the average.')],
      explain: '<p>The hard part: you know the average only after reading <b>all</b> the numbers, and then you must look at each number <b>again</b>. So the numbers must be kept somewhere. The answer is an array (see the drawing at slide 39).</p>' },
    3: { image: false, blocks: ['To describe why arrays are necessary in programming (§7.1).', 'To declare array reference variables and create arrays (§§7.2.1–7.2.2).', 'To obtain array size using arrayRefVar.length and know default values in an array (§7.2.3).', 'To access array elements using indexes (§7.2.4).', 'To declare, create, and initialize an array using an array initializer (§7.2.5).', 'To program common array operations (displaying arrays, summing all elements, finding the minimum and maximum elements, random shuffling, and shifting elements) (§7.2.6).', 'To simplify programming using the foreach loops (§7.2.7).', 'To apply arrays in application development (AnalyzeNumbers, DeckOfCards) (§§7.3–7.4).', 'To copy contents from one array to another (§7.5).', 'To develop and invoke methods with array arguments and return values (§§7.6–7.8).', 'To define a method with a variable-length argument list (§7.9).', 'To search elements using the linear (§7.10.1) or binary (§7.10.2) search algorithm.', 'To sort an array using the selection sort approach (§7.11).', 'To use the methods in the java.util.Arrays class (§7.12).', 'To pass arguments to the main method from the command line (§7.13).'].map(function (t) { return bul(t); }),
      explain: '<p>The objectives of the book chapter. Some of them (foreach loops, {{variable-length|متغيّر الطول: عددها غير ثابت}} arguments, binary search, selection sort) have no slides in this course, so they are not taught here.</p>' },
    4: { image: false, blocks: [para('Array is a data structure that represents a collection of the same types of data.'), code('double[] myList = new double[10];')],
      explain: '<p>A <b>{{data structure|بنية بيانات}}</b> is a way to {{organize|ينظّم}} data. An array is the simplest one: a row of boxes, all of the same type.</p><pre class="ex">double[] myList = new double[10];</pre><p>This makes 10 boxes for doubles. You reach each box with its {{index|الفهرس}}: <code>myList[0]</code> is the first, <code>myList[9]</code> the last. The variable myList does not hold the numbers itself; it holds a <b>reference</b> to the array.</p>' },
    5: { image: false, title: 'Declaring Array Variables', blocks: [code('datatype[] arrayRefVar;', 'none'), para('Example:'), code('double[] myList;'), code('datatype arrayRefVar[]; // This style is allowed, but not preferred', 'none'), para('Example:'), code('double myList[];')],
      explain: '<p>To declare an array variable, put <b>[ ]</b> after the element type:</p><pre class="ex">double[] myList;   // read: “array of double, named myList”</pre><p>The form <code>double myList[];</code> is also allowed (it comes from the C language), but <code>double[] myList</code> is preferred, because the type “array of double” is all together.</p><p class="watch">Declaring only makes the variable. There is no array yet: that needs <b>new</b> (next slide).</p>' },
    6: { image: false, blocks: [code('arrayRefVar = new datatype[arraySize];', 'none'), para('Example:'), code('myList = new double[10];'), para('myList[0] references the first element in the array.'), para('myList[9] references the last element in the array.')],
      explain: '<p><code>new</code> creates the array in memory, with a fixed number of elements:</p><pre class="ex">myList = new double[10];</pre><p>Indexes start at <b>0</b>. So 10 elements have the indexes <b>0 to 9</b>, not 1 to 10: myList[0] is the first element and myList[9] is the last.</p>' },
    7: { image: false, title: 'Declaring and Creating in One Step', blocks: [code('datatype[] arrayRefVar = new\n  datatype[arraySize];', 'none'), code('double[] myList = new double[10];'), code('datatype arrayRefVar[] = new\n  datatype[arraySize];', 'none'), code('double myList[] = new double[10];')],
      explain: '<p>Most programs declare the variable and create the array in <b>one line</b>:</p><pre class="ex">double[] myList = new double[10];\nint[] marks = new int[100];</pre><p>The size can also be a variable, like <code>new int[n]</code>, but once the array is made, its size never changes.</p>' },
    8: { image: false, blocks: [para('Once an array is created, its size is fixed. It cannot be changed. You can find its size using arrayRefVar.length'), para('For example, myList.length returns 10')],
      explain: '<p>Once an array is created, its size is <b>{{fixed|ثابت لا يتغير}}</b>. To have more elements, you would need a new, bigger array.</p><p>Every array knows its size: <code>myList.length</code> (no parentheses: it is not a method). For myList, it is 10.</p><p>Use length in loops instead of writing the number: <code>for (int i = 0; i &lt; myList.length; i++)</code> keeps working even if you change the size later.</p>' },
    9: { image: false, blocks: [para('When an array is created, its elements are assigned the default value of'), para("0 for the numeric primitive data types, '\\u0000' for char types, and false for boolean types.")],
      explain: '<p>A new array is never empty: every element gets a <b>{{default value|القيمة الافتراضية}}</b>:</p><ul><li>0 for number types (0.0 for double),</li><li><code>\'\\u0000\'</code> (the “empty” character) for char,</li><li>false for boolean.</li></ul><p>So <code>new int[3]</code> is {0, 0, 0}. (Remember: local variables have <b>no</b> default value, but array elements do.)</p>' },
    10: { image: false, blocks: [para('The array elements are accessed through the index. The array indices are 0-based, i.e., it starts from 0 to arrayRefVar.length-1. In the example in Figure 6.1, myList holds ten double values and the indices are from 0 to 9.'), para('Each element in the array is represented using the following syntax, known as an indexed variable:'), code('arrayRefVar[index];', 'none')],
      explain: '<p>Each element is reached with an <b>indexed variable</b>: <code>arrayRefVar[index]</code>.</p><p>Indexes are <b>{{0-based|يبدأ من صفر}}</b>: they go from 0 to <code>length - 1</code>. For an array of 10, that is 0 to 9.</p><p class="watch">Any other index, like myList[10] or myList[-1], stops the program with an error. The compiler does not catch this; it happens while the program runs.</p>' },
    11: { image: false, blocks: [para('After an array is created, an indexed variable can be used in the same way as a regular variable. For example, the following code adds the value in myList[0] and myList[1] to myList[2].'), code('myList[2] = myList[0] + myList[1];')],
      explain: '<p>An indexed variable works exactly like a normal variable of the element type. You can read it, change it, and use it in expressions:</p><pre class="ex">myList[2] = myList[0] + myList[1];\nmyList[i] = myList[i] * 2;</pre><p>The index can be any int expression, like i or i + 1. That is what makes loops over arrays possible.</p>' },
    12: { image: false, blocks: [bul('Declaring, creating, initializing in one step:'), code('double[] myList = {1.9, 2.9, 3.4, 3.5};'), para('This shorthand syntax must be in one statement.')],
      explain: '<p>An <b>{{initializer|المُهيِّئ: قائمة القيم الأولى}}</b> declares, creates and fills an array in one statement:</p><pre class="ex">double[] myList = {1.9, 2.9, 3.4, 3.5};</pre><p>There is no new and no size: Java counts the values in the braces, so this array has length 4. Use it when you know the values when you write the program.</p>' },
    13: { image: false, title: 'Declaring, creating, initializing Using the Shorthand Notation', blocks: [code('double[] myList = {1.9, 2.9, 3.4, 3.5};'), para('This shorthand notation is equivalent to the following statements:'), code('double[] myList = new double[4];\nmyList[0] = 1.9;\nmyList[1] = 2.9;\nmyList[2] = 3.4;\nmyList[3] = 3.5;')],
      explain: '<p>The short line is the same as these five statements:</p><pre class="ex">double[] myList = new double[4];\nmyList[0] = 1.9;\nmyList[1] = 2.9;\nmyList[2] = 3.4;\nmyList[3] = 3.5;</pre><p>The first value goes to index 0, the next to index 1, and so on.</p>' },
    14: { image: false, title: 'CAUTION', blocks: [para('Using the shorthand notation, you have to declare, create, and initialize the array all in one statement. Splitting it would cause a syntax error. For example, the following is wrong:'), code('double[] myList;\nmyList = {1.9, 2.9, 3.4, 3.5};')],
      explain: '<p>The braces form works <b>only in the declaration</b>, in one statement. Splitting it is a syntax error:</p><pre class="ex">double[] myList;\nmyList = {1.9, 2.9, 3.4, 3.5};   // ✗ syntax error</pre><p>(Later you can write <code>myList = new double[]{1.9, 2.9, 3.4, 3.5};</code>: the anonymous arrays of slide 44.)</p>' },
    15: tr('Declare array variable values, create an array, and assign its reference to values', 0),
    16: tr('i becomes 1', 0), 17: tr('i (=1) is less than 5', 0), 18: tr('After this line is executed, value[1] is 1', 1), 19: tr('After i++, i becomes 2', 1),
    20: tr('i (= 2) is less than 5', 1), 21: tr('After this line is executed, values[2] is 3 (2 + 1)', 2), 22: tr('After this, i becomes 3.', 2), 23: tr('i (=3) is still less than 5.', 2),
    24: tr('After this line, values[3] becomes 6 (3 + 3)', 3), 25: tr('After this, i becomes 4', 3), 26: tr('i (=4) is still less than 5', 3), 27: tr('After this, values[4] becomes 10 (4 + 6)', 4),
    28: tr('After i++, i becomes 5', 4), 29: tr('i ( =5) < 5 is false. Exit the loop', 4), 30: tr('After this line, values[0] is 11 (1 + 10)', 5),
    31: { image: false, blocks: [para('See the examples in the text.'), para('1. (Initializing arrays with input values)'), para('2. (Initializing arrays with random values)'), para('3. (Printing arrays)'), para('4. (Summing all elements)'), para('5. (Finding the largest element)'), para('6. (Finding the smallest index of the largest element)'), para('7. (Random shuffling)'), para('8. (Shifting elements)')],
      explain: '<p>Some jobs with arrays come up {{again and again|مرة بعد مرة}}. This part shows eight of them: fill an array from the user, fill it with random values, print it, add up the elements, find the largest, find its index, shuffle, and shift.</p><p>They all use the same shape: a for loop over the indexes, <code>for (int i = 0; i &lt; myList.length; i++)</code>, doing one small thing with <code>myList[i]</code>. Learn the shape once and you can write all of them.</p>' },
    32: { image: false, blocks: [code('java.util.Scanner input = new java.util.Scanner(System.in);\nSystem.out.print("Enter " + myList.length + " values: ");\nfor (int i = 0; i < myList.length; i++)\n  myList[i] = input.nextDouble();')],
      explain: '<p>To fill an array with values the user types, read one value for each index:</p><pre class="ex">for (int i = 0; i &lt; myList.length; i++)\n  myList[i] = input.nextDouble();</pre><p>The prompt uses myList.length, so it says how many values to type. <code>java.util.Scanner</code> is the full name of the class, so this works without an import line.</p>' },
    33: { image: false, blocks: [code('for (int i = 0; i < myList.length; i++) {\n  myList[i] = Math.random() * 100;\n}')],
      explain: '<p>To test a program you often want random data:</p><pre class="ex">myList[i] = Math.random() * 100;</pre><p>Math.random() is from 0.0 up to (not including) 1.0, so each element gets a random double from 0.0 up to (not including) 100.0.</p>' },
    34: { image: false, blocks: [code('for (int i = 0; i < myList.length; i++) {\n  System.out.print(myList[i] + " ");\n}')],
      explain: '<p>Print each element followed by a space:</p><pre class="ex">for (int i = 0; i &lt; myList.length; i++)\n  System.out.print(myList[i] + " ");</pre><p>It is <b>print</b>, not println, so all elements stay on one line, like <code>4 8 15</code>.</p><p class="watch"><code>System.out.println(myList)</code> does not print the elements: it prints the reference, something like [D@1b6d3586.</p>' },
    35: { image: false, blocks: [code('double total = 0;\nfor (int i = 0; i < myList.length; i++) {\n  total += myList[i];\n}')],
      explain: '<p>To add up all elements, keep a <b>running total</b>:</p><pre class="ex">double total = 0;\nfor (int i = 0; i &lt; myList.length; i++)\n  total += myList[i];</pre><p>total starts at 0 and grows by one element each time. For {2.5, 1.5, 4.0} it goes 0 → 2.5 → 4.0 → 8.0. Divide by myList.length to get the average.</p>' },
    36: { image: false, blocks: [code('double max = myList[0];\nfor (int i = 1; i < myList.length; i++) {\n  if (myList[i] > max) max = myList[i];\n}')],
      explain: '<p>To find the largest element, keep the <b>biggest so far</b>:</p><pre class="ex">double max = myList[0];\nfor (int i = 1; i &lt; myList.length; i++)\n  if (myList[i] &gt; max) max = myList[i];</pre><p>Start with the first element, then compare each of the others with it.</p><p class="watch">Do not start with <code>max = 0</code>: if all the elements are negative, like {-5, -2, -9}, the answer would wrongly be 0. Starting with myList[0] always works.</p>' },
    37: { image: false, blocks: [code(SHUF)],
      explain: '<p>To <b>{{shuffle|يخلط}}</b> an array (put it in a {{random order|ترتيب عشوائي}}), go from the <b>last</b> index down to 1. For each index i, choose a random index j from 0 to i, and <b>swap</b> the two elements:</p><pre class="ex">double temp = myList[i];\nmyList[i] = myList[j];\nmyList[j] = temp;</pre><p>The swap needs temp: without it, the first assignment would destroy myList[i]’s value. Press Next in the drawing to see each swap.</p>' },
    38: { image: false, blocks: [code(SHIFT)],
      explain: '<p>To <b>{{shift|يزيح}}</b> left, each element moves one place to the left: myList[1] goes to index 0, myList[2] to index 1, and so on.</p><p>But then the first element would be lost. So it is saved in temp <b>before</b> the loop, and put in the last place <b>after</b> it:</p><pre class="ex">{5, 6, 7}  →  {6, 7, 5}</pre>' },
    39: { image: false, title: 'Opening Problem', blocks: [para('Read one hundred numbers, compute their average, and find out how many numbers are above the average.'), note('Example program: AnalyzeNumbers')],
      explain: '<p>Back to the opening problem: read the numbers, compute the average, count how many are above it.</p><p>With an array it is easy:</p><ol><li>read all the numbers into an array and add them up;</li><li>average = sum / count;</li><li>go through the array a <b>second time</b> and count the numbers above the average.</li></ol><p>Step 3 is only possible because the numbers were kept. Try your own numbers in the drawing.</p>' },
    40: { image: false, blocks: [para('Often, in a program, you need to duplicate an array or a part of an array. In such cases you could attempt to use the assignment statement (=), as follows:'), code('list2 = list1;')],
      explain: '<p>Can you copy an array with =?</p><pre class="ex">list2 = list1;</pre><p>No! An array variable holds a <b>{{reference|المرجع: عنوان المصفوفة}}</b>, so = copies only the reference. {{Afterwards|بعد ذلك}} list1 and list2 are two names for the <b>same</b> array: a change through list2 is seen through list1. The array list2 referred to before is lost (garbage).</p>' },
    41: { image: false, blocks: [para('Using a loop:'), code('int[] sourceArray = {2, 3, 1, 5, 10};\nint[] targetArray = new\n  int[sourceArray.length];'), code('for (int i = 0; i < sourceArrays.length; i++)\n    targetArray[i] = sourceArray[i];')],
      explain: '<p>A real copy needs a <b>new array</b> and a loop that copies each element:</p><pre class="ex">int[] targetArray = new int[sourceArray.length];\nfor (int i = 0; i &lt; sourceArray.length; i++)\n  targetArray[i] = sourceArray[i];</pre><p>Now there are two separate arrays: changing targetArray[0] does not change sourceArray. (The slide writes sourceArrays with an s; the variable is sourceArray.)</p>' },
    42: { image: false, title: 'The arraycopy Utility', blocks: [code('arraycopy(sourceArray, src_pos,\n  targetArray, tar_pos, length);', 'none'), para('Example:'), code('System.arraycopy(sourceArray, 0,\n  targetArray, 0, sourceArray.length);')],
      explain: '<p>Java has a ready-made method for copying:</p><pre class="ex">System.arraycopy(sourceArray, 0, targetArray, 0, sourceArray.length);</pre><p>The five arguments: the source array, the start index in the source, the target array, the start index in the target, and <b>how many</b> elements to copy.</p><p class="watch">arraycopy does not create the target: it must already exist and be big enough.</p>' },
    43: { image: false, blocks: [code('public static void printArray(int[] array) {\n  for (int i = 0; i < array.length; i++) {\n    System.out.print(array[i] + " ");\n  }\n}'), note('Invoke the method'), code('int[] list = {3, 1, 2, 6, 4, 2};\nprintArray(list);'), note('Invoke the method (anonymous array)'), code('printArray(new int[]{3, 1, 2, 6, 4, 2});')],
      explain: '<p>A method can take an array as a parameter: <code>printArray(int[] array)</code>. Inside, it uses <code>array.length</code>, so it works for an int array of <b>any length</b>.</p><pre class="ex">int[] list = {3, 1, 2, 6, 4, 2};\nprintArray(list);                        // a variable\nprintArray(new int[]{3, 1, 2, 6, 4, 2}); // an anonymous array</pre>' },
    44: { image: false, blocks: [para('The statement'), code('printArray(new int[]{3, 1, 2, 6, 4, 2});'), para('creates an array using the following syntax:'), code('new dataType[]{literal0, literal1, ..., literalk};', 'none'), para('There is no explicit reference variable for the array. Such array is called an anonymous array.')],
      explain: '<p><code>new int[]{3, 1, 2, 6, 4, 2}</code> creates an array with these values right where it is needed, with no variable for it. It is an <b>{{anonymous|بلا اسم}} array</b>.</p><p>It is handy when the array is used only once, like as an argument. Unlike the initializer, this form can be used anywhere, not only in a declaration.</p>' },
    45: { image: false, blocks: [para('Java uses pass by value to pass arguments to a method. There are important differences between passing a value of variables of primitive data types and passing arrays.'), bul('For a parameter of a primitive type value, the actual value is passed. Changing the value of the local parameter inside the method does not affect the value of the variable outside the method.'), bul('For a parameter of an array type, the value of the parameter contains a reference to an array; this reference is passed to the method. Any changes to the array that occur inside the method body will affect the original array that was passed as the argument.')],
      explain: '<p>Java always passes arguments <b>by value</b>, but the value is different for the two kinds of variables:</p><ul><li>A <b>primitive</b> (like int): the value is the number. The method gets a copy; changing it does not change the caller’s variable.</li><li>An <b>array</b>: the value is the <b>reference</b>. The method gets a copy of the reference, which points to the <b>same array</b>. So changes to the elements inside the method <b>are</b> seen by the caller.</li></ul>' },
    46: { image: false, title: 'Simple Example', blocks: [code(M46)],
      explain: '<p>A small test of the rule. m gets x (an int) and y (an array):</p><ul><li><code>number = 1001;</code> changes only m’s copy. x in main stays 1.</li><li><code>numbers[0] = 5555;</code> changes the array that y also refers to.</li></ul><p>{{Predict|يتوقّع}} the output before you step through the drawing: “x is 1” and “y[0] is 5555”.</p>' },
    47: { image: false, title: 'Call Stack', blocks: [para('When invoking m(x, y), the values of x and y are passed to number and numbers. Since y contains the reference value to the array, numbers now contains the same reference value to the same array.')],
      explain: '<p>The call stack holds one record per running method: main’s record has x and y, and m’s record has number and numbers.</p><p>But the array itself is <b>not</b> in any record. It is in another part of memory, the heap. y and numbers both hold the same reference, so both point to that one array.</p>' },
    48: { image: false, title: 'Call Stack', blocks: [para('When invoking m(x, y), the values of x and y are passed to number and numbers. Since y contains the reference value to the array, numbers now contains the same reference value to the same array.')],
      explain: '<p>The same text as slide 47. The picture on this slide belongs to the swap example of slides 50-51: it shows the two copies of the values in swap’s record, while the array stays in the heap.</p>' },
    49: { image: false, title: 'Heap', blocks: [para('The arrays are stored in a heap.'), para('The JVM stores the array in an area of memory, called heap, which is used for dynamic memory allocation where blocks of memory are allocated and freed in an arbitrary order.')],
      explain: '<p>The JVM keeps arrays in the <b>{{heap|الكومة: منطقة ذاكرة للمصفوفات والكائنات}}</b>, an area of memory separate from the call stack. Blocks in the heap are given and freed in any order.</p><p>The difference matters: a method record {{disappears|يختفي}} when its method ends, but an array in the heap stays as long as some variable still refers to it. That is how a method can create an array and return it.</p>' },
    50: { image: false, title: 'Passing Arrays as Arguments', blocks: [bul('Objective: Demonstrate differences of passing primitive data type variables and array variables.'), note('Example program: TestPassArray')],
      explain: '<p>Two methods try to swap the first two elements of an array a:</p><ul><li><code>swap(a[0], a[1])</code> gets two <b>int values</b>. It swaps its own copies, and the array does not change.</li><li><code>swapFirstTwoInArray(a)</code> gets the <b>reference</b>, so it swaps the real elements.</li></ul><p>Only the second one works. The drawing shows why.</p>' },
    51: { image: false, title: 'Example, cont.', blocks: [para('Invoke swap(int n1, int n2). The primitive type values in a[0] and a[1] are passed to the swap method.'), para('The arrays are stored in a heap.'), para('Invoke swapFirstTwoInArray(int[] array). The reference value in a is passed to the swapFirstTwoInArray method.')],
      explain: '<p>The pictures show the difference:</p><ul><li>In swap, n1 and n2 are copies of a[0] and a[1] in swap’s own record. Swapping them changes nothing in the array.</li><li>In swapFirstTwoInArray, the parameter array refers to the same array in the heap, so <code>array[0]</code> and <code>array[1]</code> really change.</li></ul><pre class="ex">a = {1, 2}\nswap(a[0], a[1])        → a is still {1, 2}\nswapFirstTwoInArray(a)  → a is {2, 1}</pre>' },
    52: { image: false, title: 'Returning an Array from a Method', blocks: [code('public static int[] reverse(int[] list) {\n  int[] result = new int[list.length];\n\n  for (int i = 0, j = result.length - 1;\n       i < list.length; i++, j--) {\n    result[j] = list[i];\n  }\n\n  return result;\n}'), code('int[] list1 = {1, 2, 3, 4, 5, 6};\nint[] list2 = reverse(list1);')],
      explain: '<p>A method can <b>return</b> an array. The return type <code>int[]</code> means it gives back a reference to an int array.</p><p>reverse makes a new array result of the same length, copies the elements in reverse order, and returns it. The loop has <b>two counters</b>: i goes up from the start of list, and j goes down from the end of result:</p><pre class="ex">result[j] = list[i];   // i = 0, j = 5 ... i = 5, j = 0</pre><p>The next slides trace it step by step.</p>' },
    53: rv('Declare result and create array'), 54: rv('i = 0 and j = 5'), 55: rv('i (= 0) is less than 6'), 56: rv('i = 0 and j = 5. Assign list[0] to result[5]'), 57: rv('After this, i becomes 1 and j becomes 4'),
    58: rv('i (=1) is less than 6'), 59: rv('i = 1 and j = 4. Assign list[1] to result[4]'), 60: rv('After this, i becomes 2 and j becomes 3'), 61: rv('i (=2) is still less than 6'), 62: rv('i = 2 and j = 3. Assign list[i] to result[j]'),
    63: rv('After this, i becomes 3 and j becomes 2'), 64: rv('i (=3) is still less than 6'), 65: rv('i = 3 and j = 2. Assign list[i] to result[j]'), 66: rv('After this, i becomes 4 and j becomes 1'), 67: rv('i (=4) is still less than 6'),
    68: rv('i = 4 and j = 1. Assign list[i] to result[j]'), 69: rv('After this, i becomes 5 and j becomes 0'), 70: rv('i (=5) is still less than 6'), 71: rv('i = 5 and j = 0. Assign list[i] to result[j]'), 72: rv('After this, i becomes 6 and j becomes -1'),
    73: rv('i (=6) < 6 is false. So exit the loop.'), 74: rv('Return result'),
    75: { image: false, title: 'A complete program', blocks: [code(S75)],
      explain: '<p>The whole program puts the pieces together: main makes list1, prints it with printArray, gets list2 from reverse, and prints it too, with lines of stars between them.</p><pre class="ex">1 2 3 4 5 6\n6 5 4 3 2 1</pre><p>Each method has one job: that is the modular style of unit 7.</p>' },
    76: { image: false, title: 'Searching Arrays', blocks: [para('Searching is the process of looking for a specific element in an array; for example, discovering whether a certain score is included in a list of scores. Searching is a common task in computer programming. There are many algorithms and data structures devoted to searching. In this section, two commonly used approaches are discussed, linear search and binary search.'), code(LIN)],
      explain: '<p><b>Searching</b> means looking for a value in an array, for example: is the score 90 in the list of scores? The value you look for is the <b>{{key|المفتاح: القيمة التي نبحث عنها}}</b>.</p><p>linearSearch returns the <b>index</b> of the key, or <b>-1</b> if it is not there. -1 can never be a real index, so it clearly means “not found”. (Only linear search has slides in this course.)</p>' },
    77: { image: false, blocks: [para('The linear search approach compares the key element, key, sequentially with each element in the array list. The method continues to do so until the key matches an element in the list or the list is exhausted without a match being found. If a match is made, the linear search returns the index of the element in the array that matches the key. If no match is found, the search returns -1.')],
      explain: '<p>Linear search compares the key with each element <b>{{sequentially|بالترتيب واحداً بعد الآخر}}</b>: list[0], list[1], list[2], … As soon as one matches, it returns that index and stops. If the loop ends with no match, it returns -1.</p><p>If the key appears twice, it returns the <b>first</b> index. In the worst case (the key is last, or missing), it checks every element.</p>' },
    78: { image: false, title: 'Linear Search Animation', blocks: [para('Key: 3'), para('List: 6 4 1 9 7 3 2 8')],
      explain: '<p>Key 3 in the list 6 4 1 9 7 3 2 8: it is compared with 6, 4, 1, 9 and 7 (no match), and then it matches at <b>index 5</b>. That took six comparisons.</p><p>Try other keys in the drawing: the first element (one comparison), and a key that is not in the list (all eight, then -1).</p>' },
    79: { image: false, title: 'The Arrays.sort Method', blocks: [para('Since sorting is frequently used in programming, Java provides several overloaded sort methods for sorting an array of int, double, char, short, long, and float in the java.util.Arrays class. For example, the following code sorts an array of numbers and an array of characters.'), code('double[] numbers = {6.0, 4.4, 1.9, 2.9, 3.4, 3.5};\njava.util.Arrays.sort(numbers);'), code("char[] chars = {'a', 'A', '4', 'F', 'D', 'P'};\njava.util.Arrays.sort(chars);"), para('Java 8 now provides Arrays.parallelSort(list) that utilizes the multicore for fast sorting.')],
      explain: '<p>To <b>{{sort|يرتّب}}</b> is to put the elements in order, from small to big. The java.util.Arrays class has a sort method for each type of array (it is overloaded):</p><pre class="ex">double[] numbers = {6.0, 4.4, 1.9, 2.9, 3.4, 3.5};\njava.util.Arrays.sort(numbers);   // 1.9 2.9 3.4 3.5 4.4 6.0</pre><p>chars are sorted by their codes: digits first, then capital letters, then small letters. (Java 8 also has parallelSort, which uses several processor cores.)</p>' },
    80: { image: false, title: 'The Arrays.toString(list) Method', blocks: [para('The Arrays.toString(list) method can be used to return a string representation for the list.')],
      explain: '<p>Printing an array variable directly, <code>System.out.println(numbers)</code>, does not show the elements: it prints something like <code>[D@1b6d3586</code>, its reference.</p><p><code>java.util.Arrays.toString(numbers)</code> returns the elements as one string, in brackets and separated by commas: <code>[1.9, 2.9, 3.4]</code>. It is the easy way to look at an array.</p>' },
    81: { image: false, title: 'Pass Arguments to Invoke the Main Method', blocks: [para('Pass Arguments to Invoke the Main Method')],
      explain: '<p>Look at main again: <code>public static void main(String[] args)</code>. It has a parameter, an <b>array of Strings</b> named args.</p><p>So main is a method like any other, and it can receive values. The next slide shows who passes them.</p>' },
    82: { image: false, title: 'Main Method Is Just a Regular Method', blocks: [para('You can call a regular method by passing actual parameters. Can you pass arguments to main? Of course, yes. For example, the main method in class B is invoked by a method in A, as shown below:'), code(MAINA)],
      explain: '<p>main is a normal static method, so another class can call it: class A calls <code>B.main(strings)</code> and passes an array of three cities. B’s main prints each element of args:</p><pre class="ex">New York\nBoston\nAtlanta</pre><p>Usually the JVM calls main for you. When you run a program from the command line, like <code>java B New York</code>, the words after the class name become the elements of args.</p>' }
  };
  /* short explanations for the trace slides */
  var TRX = { 15: 'All five elements start at 0.', 16: 'The loop starts at i = 1, so values[0] is not touched yet.', 17: 'The condition is checked first.', 18: 'values[1] = 1 + values[0] = 1 + 0.', 19: 'The update runs after the body.', 20: '2 < 5: one more time.', 21: 'Each element uses the one before it: 2 + values[1].', 22: 'Next index.', 23: 'Still inside the array.', 24: '3 + values[2] = 3 + 3.', 25: 'Next index.', 26: 'The last index of the loop.', 27: '4 + values[3] = 4 + 6.', 28: 'i is now 5, one past the last index.', 29: 'The loop stops before values[5], which does not exist.', 30: 'After the loop: values[1] + values[4] = 1 + 10.' };
  Object.keys(TRX).forEach(function (n) { slides[n].explain = '<p>' + TRX[n] + '</p>'; });
  for (var rn = 53; rn <= 74; rn++) slides[rn].explain = rn === 53 ? '<p>result has the same length as list, all 0.</p>' : rn === 54 ? '<p>Two counters: i starts at the front, j at the back.</p>' : rn === 73 ? '<p>All six elements were copied in reverse order.</p>' : rn === 74 ? '<p>The reference of result is returned, and list2 now refers to the new array {6, 5, 4, 3, 2, 1}.</p>' : (rn - 56) % 3 === 0 ? '<p>The element from the front of list goes to the back of result.</p>' : (rn - 57) % 3 === 0 ? '<p>i goes up and j goes down, at the same time.</p>' : '<p>Check the loop condition.</p>';

  addUnit({
    course: 'cs1', lesson: '08-arrays-1d',
    blurb: 'Keep many values under one name: create arrays, use indexes, process them with loops, copy them, pass them to methods and return them, search and sort them.',
    parts: [
      {
        title: 'Array basics', from: 1, to: 14,
        quiz: [
          { type: 'output', q: 'What does this print?', code: 'double[] myList = new double[10];\nSystem.out.println(myList.length);', answer: '10', why: 'length is the number of elements (slide 8).' },
          { q: 'What are the indexes of an array of length 10?', options: ['0 to 10', '1 to 10', '0 to 9'], answer: 2, why: 'Indexes are 0-based: 0 to length − 1 (slide 10).' },
          { type: 'output', q: 'What does this print?', code: 'int[] a = new int[3];\nboolean[] b = new boolean[2];\nSystem.out.println(a[1] + " " + b[0]);', answer: '0 false', why: 'Default values: 0 for numbers, false for boolean (slide 9).' },
          { type: 'output', q: 'What does this print?', code: 'int[] a = {4, 7, 1};\na[2] = a[0] + a[1];\nSystem.out.println(a[2]);', answer: '11', why: 'An indexed variable is used like a normal variable (slide 11).' },
          { q: 'What happens here?', code: 'int[] a = {4, 7, 1};\nSystem.out.println(a[3]);', options: ['ArrayIndexOutOfBoundsException', 'It prints 0, the default value', 'It prints 1, the last element'], answer: 0, why: 'The last index is 2.' },
          { type: 'tf', q: '<code>double[] d; d = {1.5, 2.5};</code> is correct.', answer: false, why: 'The braces form must be in the declaration (slide 14).' }
        ]
      },
      {
        title: 'Tracing an array program', from: 15, to: 30,
        quiz: [
          { type: 'output', q: 'The program of slides 15-30. What is values[3] at the end?', code: 'int[] values = new int[5];\nfor (int i = 1; i < 5; i++) {\n  values[i] = i + values[i-1];\n}\nvalues[0] = values[1] + values[4];', answer: '6', why: '1, 3, 6, 10: values[3] = 3 + 3.' },
          { type: 'output', q: 'And values[0]?', code: 'values[0] = values[1] + values[4];', answer: '11', why: '1 + 10 (slide 30).' },
          { type: 'output', q: 'What does this print?', code: 'int[] v = new int[4];\nfor (int i = 1; i < 4; i++)\n  v[i] = v[i-1] + 2;\nSystem.out.println(v[3]);', answer: '6', why: '0, 2, 4, 6.' },
          { q: 'Why does the loop of slide 15 start at i = 1?', options: ['values[i-1] would be values[-1] for i = 0', 'Arrays start at index 1 in Java', 'No reason: 0 would work the same'], answer: 0, why: 'Index -1 does not exist.' }
        ]
      },
      {
        title: 'Processing arrays', from: 31, to: 39,
        quiz: [
          { type: 'output', q: 'What does this print?', code: 'double[] myList = {2.5, 1.5, 4.0};\ndouble total = 0;\nfor (int i = 0; i < myList.length; i++)\n  total += myList[i];\nSystem.out.println(total);', answer: '8.0', why: '2.5 + 1.5 + 4.0 (slide 35).' },
          { type: 'output', q: 'What does this print?', code: 'int[] a = {-5, -2, -9};\nint max = a[0];\nfor (int i = 1; i < a.length; i++)\n  if (a[i] > max) max = a[i];\nSystem.out.println(max);', answer: '-2', why: 'Starting from a[0] works even when all numbers are negative (slide 36).' },
          { type: 'fill', q: 'Fill an array with random doubles from 0 up to 100.', code: 'for (int i = 0; i < myList.length; i++)\n  myList[i] = Math.___() * 100;', answer: ['random'], why: 'Slide 33.' },
          { type: 'output', q: 'After the shift of slide 38, what is the array?', code: 'int[] a = {1, 2, 3, 4};\nint temp = a[0];\nfor (int i = 1; i < a.length; i++)\n  a[i - 1] = a[i];\na[a.length - 1] = temp;\nSystem.out.println(a[0] + " " + a[3]);', answer: '2 1', why: 'Everything moves left, and the old first element goes to the end.' },
          { q: 'In random shuffling (slide 37), which j can be chosen when i = 4?', options: ['0 to 4', '0 to 3', '1 to 4'], answer: 0, why: '(int)(Math.random() * (i + 1)) is 0 to i.' },
          { q: 'Why does the opening problem need an array?', options: ['Scanner can only read numbers into an array', 'Arrays make the loop faster to type', 'The numbers must be checked again after the average is known'], answer: 2, why: 'Slides 2 and 39.' }
        ]
      },
      {
        title: 'Copying and passing arrays', from: 40, to: 51,
        quiz: [
          { type: 'output', q: 'What does this print?', code: 'int[] list1 = {1, 2, 3};\nint[] list2 = list1;\nlist2[0] = 99;\nSystem.out.println(list1[0]);', answer: '99', why: 'list2 = list1 copies the reference: one array, two names (slide 40).' },
          { type: 'output', q: 'And this?', code: 'int[] src = {1, 2, 3};\nint[] t = new int[3];\nfor (int i = 0; i < src.length; i++)\n  t[i] = src[i];\nt[0] = 99;\nSystem.out.println(src[0]);', answer: '1', why: 'A real copy: two separate arrays (slide 41).' },
          { q: 'What is an anonymous array?', options: ['An array that has no elements', 'An array with no reference variable', 'An array of Strings with no names'], answer: 1, why: 'Slide 44.' },
          { type: 'output', q: 'What does this print?', code: 'public static void m(int number, int[] numbers) {\n  number = 1001;\n  numbers[0] = 5555;\n}\n// in main:\nint x = 1;\nint[] y = new int[10];\nm(x, y);\nSystem.out.println(x + " " + y[0]);', answer: '1 5555', why: 'The int is copied; the array is shared (slides 46-47).' },
          { q: 'Where are arrays stored?', options: ['In the heap', 'In the method’s activation record', 'In the code'], answer: 0, why: 'Slide 49.' }
        ]
      },
      {
        title: 'Returning an array', from: 52, to: 75,
        quiz: [
          { type: 'output', q: 'With reverse of slide 52, what does this print?', code: 'int[] r = reverse(new int[]{7, 8, 9});\nSystem.out.println(r[0] + " " + r[2]);', answer: '9 7', why: 'The first becomes the last.' },
          { q: 'What is the return type of reverse?', options: ['int[]', 'int', 'void'], answer: 0, why: 'It returns a reference to an int array.' },
          { q: 'In the reverse loop, when i is 1 and the length is 6, what is j?', options: ['1', '4', '5'], answer: 1, why: 'j = length − 1 − i.' },
          { type: 'tf', q: 'reverse changes the array list1.', answer: false, why: 'It only reads list and fills a new array, result.' }
        ]
      },
      {
        title: 'Searching, sorting and main', from: 76, to: 82,
        quiz: [
          { type: 'output', q: 'With linearSearch of slide 76, what does this print?', code: 'int[] list = {6, 4, 1, 9, 7, 3, 2, 8};\nSystem.out.println(linearSearch(list, 9));\nSystem.out.println(linearSearch(list, 5));', answer: '3\n-1', why: '9 is at index 3; 5 is not in the list.' },
          { type: 'output', q: 'What does this print?', code: 'int[] a = {3, 1, 2};\njava.util.Arrays.sort(a);\nSystem.out.println(java.util.Arrays.toString(a));', answer: '[1, 2, 3]', why: 'Slides 79-80.' },
          { q: 'How are chars sorted by Arrays.sort?', options: ['Alphabetically, ignoring case', 'By their Unicode codes', 'In the order they were typed'], answer: 1, why: 'So \'Z\' (90) comes before \'a\' (97).' },
          { type: 'output', q: 'With class B of slide 82, what does this print?', code: 'B.main(new String[]{"Hi", "there"});', answer: 'Hi\nthere', why: 'main prints each element of args.' }
        ]
      }
    ],
    slides: slides,
    visuals: ALL,
    exam: {
      questions: [
        { type: 'output', q: 'What does this print?', code: 'int[] a = new int[7];\nSystem.out.println(a.length + " " + a[6]);', answer: '7 0', review: 9, why: 'Length 7, default value 0.' },
        { q: 'Which line creates an array of 5 ints?', options: ['int[] a = int[5];', 'int a = new int[5];', 'int[] a = new int[5];'], answer: 2, review: 7, why: 'Slide 7.' },
        { type: 'output', q: 'What does this print?', code: 'char[] c = {\'J\', \'a\', \'v\', \'a\'};\nSystem.out.println(c[c.length - 1]);', answer: 'a', review: 10, why: 'The last index is length − 1 = 3.' },
        { type: 'output', q: 'What does this print?', code: 'int[] v = {1, 2, 3, 4};\nv[0] = v[1] + v[3];\nSystem.out.println(v[0]);', answer: '6', review: 11, why: '2 + 4.' },
        { q: 'What is wrong?', code: 'int[] a;\na = {1, 2, 3};', options: ['Nothing: the code compiles and runs', 'The braces form must be in the declaration', 'a must be a double array, not an int array'], answer: 1, review: 14, why: 'Slide 14.' },
        { type: 'output', q: 'What does this print?', code: 'int[] v = new int[4];\nfor (int i = 1; i < 4; i++)\n  v[i] = i + v[i-1];\nSystem.out.println(v[3]);', answer: '6', review: 24, why: '1, 3, 6.' },
        { type: 'output', q: 'What does this print?', code: 'double[] d = {1.5, 2.5, 3.0};\ndouble t = 0;\nfor (int i = 0; i < d.length; i++)\n  t += d[i];\nSystem.out.println(t / d.length);', answer: '2.3333333333333335', review: 35, why: 'The sum is 7.0, and 7.0 / 3 prints as 2.3333333333333335.' },
        { type: 'output', q: 'What does this print?', code: 'int[] a = {4, 9, 2, 9};\nint max = a[0];\nfor (int i = 1; i < a.length; i++)\n  if (a[i] > max) max = a[i];\nSystem.out.println(max);', answer: '9', review: 36, why: 'The largest element.' },
        { type: 'output', q: 'What does this print?', code: 'int[] x = {5, 6};\nint[] y = x;\ny[1] = 0;\nSystem.out.println(x[1]);', answer: '0', review: 40, why: 'x and y refer to the same array.' },
        { q: 'What does <code>System.arraycopy(a, 0, b, 0, 3)</code> do?', options: ['Copies 0 into b', 'Makes b refer to a', 'Copies a[0..2] into b[0..2]'], answer: 2, review: 42, why: 'Source, start, target, start, length.' },
        { type: 'output', q: 'What does this print?', code: 'public static void zero(int[] arr) {\n  arr[0] = 0;\n}\n// in main:\nint[] a = {8, 8};\nzero(a);\nSystem.out.println(a[0]);', answer: '0', review: 45, why: 'The method gets the reference, so it changes the original array.' },
        { type: 'output', q: 'What does this print?', code: 'public static void zero(int n) {\n  n = 0;\n}\n// in main:\nint[] a = {8, 8};\nzero(a[0]);\nSystem.out.println(a[0]);', answer: '8', review: 51, why: 'a[0] is an int: only its value is passed.' },
        { type: 'output', q: 'With reverse of slide 52, what does this print?', code: 'int[] r = reverse(new int[]{1, 2, 3, 4});\nSystem.out.println(r[1]);', answer: '3', review: 52, why: '{4, 3, 2, 1}.' },
        { type: 'output', q: 'With linearSearch, what does this print?', code: 'System.out.println(linearSearch(new int[]{2, 5, 5}, 5));', answer: '1', review: 77, why: 'The first match is returned.' },
        { type: 'output', q: 'What does this print?', code: 'char[] c = {\'b\', \'B\', \'1\'};\njava.util.Arrays.sort(c);\nSystem.out.println(java.util.Arrays.toString(c));', answer: '[1, B, b]', review: 79, why: '\'1\' (49) < \'B\' (66) < \'b\' (98).' },
        { q: 'What is the type of the parameter of main?', options: ['String[]', 'String', 'int[]'], answer: 0, review: 82, why: '<code>main(String[] args)</code>.' },
        { type: 'fill', q: 'Create an array with room for 30 int scores.', code: 'int[] scores = ___ int[___];', answer: ['new', '30'], review: 7, why: 'new datatype[arraySize] creates the array; here 30 elements, indexes 0 to 29.' },
        { type: 'fill', q: 'Complete the code that finds the largest element of the int array a.', code: 'int max = a[___];\nfor (int i = 1; i < a.___; i++)\n  if (a[i] > max) max = a[i];', answer: ['0', 'length'], review: 36, why: 'Start with the first element, then loop over the others up to a.length.' },
        { type: 'write', q: 'a is an int array. Store the average of its elements in a new double variable avg.', rows: 4, checks: [{ re: /for\s*\(\s*int\s+(\w+)\s*=\s*0\s*;\s*\1\s*<\s*a\s*\.\s*length\s*;/, label: 'a loop over all the indexes: for (int i = 0; i < a.length; i++)' }, { re: /\w+\s*\+=\s*a\s*\[\s*\w+\s*\]\s*;/, label: 'add each element: sum += a[i];' }, { re: /double\s+avg\s*=\s*[^;]*\/\s*(\(\s*double\s*\)\s*)?a\s*\.\s*length\s*;/, label: 'double avg = … / a.length;' }], solution: 'double sum = 0;\nfor (int i = 0; i < a.length; i++)\n  sum += a[i];\ndouble avg = sum / a.length;', review: 35, why: 'A running total, then divide by the number of elements. (With an int sum, cast to double first, or integer division cuts the fraction.)' },
        { type: 'write', q: 'Make a real copy of the int array src: a new array named copy, filled with a for loop.', rows: 3, checks: [{ re: /int\s*\[\s*\]\s*copy\s*=\s*new\s+int\s*\[\s*src\s*\.\s*length\s*\]\s*;/, label: 'int[] copy = new int[src.length];' }, { re: /for\s*\(\s*int\s+(\w+)\s*=\s*0\s*;\s*\1\s*<\s*(src|copy)\s*\.\s*length\s*;/, label: 'for (int i = 0; i < src.length; i++)' }, { re: /copy\s*\[\s*(\w+)\s*\]\s*=\s*src\s*\[\s*\1\s*\]\s*;/, label: 'copy[i] = src[i];' }], solution: 'int[] copy = new int[src.length];\nfor (int i = 0; i < src.length; i++)\n  copy[i] = src[i];', review: 41, why: 'copy = src would only copy the reference; a new array and a loop make a separate copy.' },
        { type: 'trace', q: 'After change(x, y), what are the values in main?', code: 'public static void change(int n, int[] a) {\n  n = 50;\n  a[0] = 50;\n}\n// in main:\nint x = 5;\nint[] y = {5, 6};\nchange(x, y);', cols: ['in main', 'value'], rows: [['x', '?5'], ['y[0]', '?50'], ['y[1]', '?6']], review: 45, why: 'n is a copy of the int, so x stays 5. a holds the same reference as y, so a[0] = 50 changes the real array.' },
        { type: 'bug', q: 'b was meant to be a separate copy of a, but b[0] = 9 also changes a. Tap the line with the mistake.', code: 'int[] a = {1, 2, 3};\nint[] b = a;\nb[0] = 9;', answer: 2, review: 40, why: '= copies only the reference: a and b are one array. Make a new array and copy the elements (or use System.arraycopy).' }
      ],
      tasks: [
        {
          title: 'Sum and average',
          task: '<p>The array <code>scores</code> is given. Use a for loop with <code>scores.length</code> to add all the elements, then print the sum and the average (as a double).</p>',
          starter: 'public class Average {\n  public static void main(String[] args) {\n    int[] scores = {70, 85, 90, 64};\n    \n  }\n}',
          output: 'Sum: 309\nAverage: 77.25',
          checks: [
            { re: /for\s*\(\s*int\s+(\w+)\s*=\s*0\s*;\s*\1\s*<\s*scores\.length\s*;/, label: 'Loops with <code>i < scores.length</code>', review: 35 },
            { re: /\w+\s*\+=\s*scores\s*\[\s*\w+\s*\]/, label: 'Adds <code>scores[i]</code> to the sum', review: 35 },
            { re: /\(\s*double\s*\)|\/\s*\(double\)|\*\s*1\.0|double\s+\w+\s*=\s*\w+\s*\/|\/\s*\d+\.\d|\/\s*\(\s*double/, label: 'Computes the average as a double (no integer division)', review: 35 },
            { re: /"Sum: "[\s\S]*"Average: "/, label: 'Prints <code>Sum: </code> and <code>Average: </code>', review: 34 }
          ],
          solution: 'public class Average {\n  public static void main(String[] args) {\n    int[] scores = {70, 85, 90, 64};\n    int sum = 0;\n    for (int i = 0; i < scores.length; i++) {\n      sum += scores[i];\n    }\n    double average = (double) sum / scores.length;\n    System.out.println("Sum: " + sum);\n    System.out.println("Average: " + average);\n  }\n}'
        },
        {
          title: 'The largest and where it is',
          task: '<p>Find the largest element of <code>list</code> and the <b>index</b> where it is (the first one, if it appears twice). Print both.</p>',
          starter: 'public class Largest {\n  public static void main(String[] args) {\n    int[] list = {4, 11, 7, 11, 2};\n    \n  }\n}',
          output: 'Largest: 11 at index 1',
          checks: [
            { re: /int\s+\w+\s*=\s*list\s*\[\s*0\s*\]/, label: 'Starts with <code>max = list[0]</code>', review: 36 },
            { re: /int\s+\w+\s*=\s*0\s*;/, label: 'Keeps the index of the largest (starting at 0)', review: 31 },
            { re: /if\s*\(\s*list\s*\[\s*\w+\s*\]\s*>\s*\w+\s*\)/, label: 'Uses <code>></code> (not >=), so the first largest index is kept', review: 36 },
            { re: /"Largest: "[\s\S]*" at index "/, label: 'Prints <code>Largest: </code> … <code> at index </code> …', review: 34 }
          ],
          solution: 'public class Largest {\n  public static void main(String[] args) {\n    int[] list = {4, 11, 7, 11, 2};\n    int max = list[0];\n    int indexOfMax = 0;\n    for (int i = 1; i < list.length; i++) {\n      if (list[i] > max) {\n        max = list[i];\n        indexOfMax = i;\n      }\n    }\n    System.out.println("Largest: " + max + " at index " + indexOfMax);\n  }\n}'
        },
        {
          title: 'A method with an array parameter',
          task: '<p>Write <code>public static int countPositives(int[] a)</code> that returns how many elements are greater than 0. In main, print <code>countPositives(new int[]{3, -1, 0, 8, -5})</code>.</p>',
          starter: 'public class Count {\n  public static void main(String[] args) {\n    \n  }\n\n}',
          output: '2',
          checks: [
            { re: /public\s+static\s+int\s+countPositives\s*\(\s*int\s*\[\s*\]\s*\w+\s*\)/, label: 'Header: <code>public static int countPositives(int[] a)</code>', review: 43 },
            { re: /\.length/, label: 'Loops over the array with <code>a.length</code>', review: 43 },
            { re: /if\s*\(\s*\w+\s*\[\s*\w+\s*\]\s*>\s*0\s*\)/, label: 'Tests <code>a[i] > 0</code>', review: 36 },
            { re: /return\s+\w+\s*;/, label: 'Returns the count', review: 52 },
            { re: /countPositives\s*\(\s*new\s+int\s*\[\s*\]\s*\{/, label: 'main passes an anonymous array', review: 44 }
          ],
          solution: 'public class Count {\n  public static void main(String[] args) {\n    System.out.println(countPositives(new int[]{3, -1, 0, 8, -5}));\n  }\n\n  public static int countPositives(int[] a) {\n    int count = 0;\n    for (int i = 0; i < a.length; i++) {\n      if (a[i] > 0)\n        count++;\n    }\n    return count;\n  }\n}'
        }
      ]
    }
  });
})();
