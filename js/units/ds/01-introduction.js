/* Data Structures · Unit 1 Introduction (16 slides): the course, why data structures, Java data types,
   basic data structures (objects and arrays), array problems, and the map of the course (Java Collection Framework) */
(function () {
  function h(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  /* ---------- 1. primitive types and references (slides 9-10) ---------- */
  var TYPES = [
    { n: 'byte', b: 1, lo: -128, hi: 127, r: '-128 to 127' },
    { n: 'short', b: 2, lo: -32768, hi: 32767, r: '-32768 to 32767' },
    { n: 'int', b: 4, lo: -2147483648, hi: 2147483647, r: '-2³¹ to 2³¹ − 1' },
    { n: 'long', b: 8, lo: -9223372036854775808, hi: 9223372036854775807, r: '-2⁶³ to 2⁶³ − 1' },
    { n: 'float', b: 4, r: 'about 6 significant digits', fl: 6 },
    { n: 'double', b: 8, r: 'about 15 significant digits', fl: 15 },
    { n: 'boolean', b: 0, r: 'true or false' },
    { n: 'char', b: 2, r: 'one character' }
  ];
  var TC = 'byte b = 100;                 // 1 byte  = 8 bits\nshort s = 30000;              // 2 bytes = 16 bits\nint i = 2000000000;           // 4 bytes = 32 bits\nlong n = 9000000000L;         // 8 bytes = 64 bits\nfloat f = 3.1415927f;         // 4 bytes, about 6 digits\ndouble d = 3.141592653589793; // 8 bytes, about 15 digits\nboolean ok = true;            // 1 bit: true or false\nchar c = \'A\';                 // 2 bytes: one character\nString name = "Ahmed";        // a class: name refers to an object\nObject obj = name;            // Object is the root class';
  function digits(x, d) { return Number(x).toPrecision(d).replace(/\.?0+$/, '').replace(/\.?0+e/, 'e'); }
  var types = {
    id: 'types', slides: [9, 10], title: 'How much memory each type uses', code: TC,
    inputs: [{ id: 'v', label: 'a value', value: 300, min: -10000000000, max: 10000000000 }],
    inputsLabel: 'Which types can store it?',
    presets: [{ label: '100', values: { v: 100 } }, { label: '300', values: { v: 300 } }, { label: '-40000', values: { v: -40000 } }, { label: '3000000000', values: { v: 3000000000 } }, { label: '2.5', values: { v: 2.5 } }],
    steps: function (v) {
      var x = Number(v.v), whole = Number.isInteger(x), st = [];
      st.push({ slide: 9, line: '1-8', t: -1, cap: 'Java has <b>8 primitive types</b>. Each one uses a fixed amount of memory: 1 byte = 8 bits. A bigger type can store bigger numbers, but it uses more memory.' });
      TYPES.forEach(function (t, k) {
        var fit = '';
        if (t.lo != null) fit = !whole ? x + ' is not a whole number, so ' + t.n + ' cannot store it.' : (x >= t.lo && x <= t.hi) ? '<b>' + x + ' fits</b> in a ' + t.n + '.' : '<b>' + x + ' does not fit</b> in a ' + t.n + ': it is outside ' + t.r + '.';
        else if (t.fl) fit = 'A ' + t.n + ' keeps about ' + t.fl + ' digits: π is stored as ' + digits(Math.PI, t.fl + 1) + '.';
        else if (t.n === 'boolean') fit = 'Only two values, so one bit is enough.';
        else fit = 'For example \'A\', \'7\' or \'?\'.';
        st.push({ slide: 9, line: k + 1, t: k, ok: t.lo != null ? whole && x >= t.lo && x <= t.hi : null, cap: '<b>' + t.n + '</b>: ' + (t.b ? t.b + (t.b > 1 ? ' bytes' : ' byte') + ' = ' + t.b * 8 + ' bits' : '1 bit') + '. Stores ' + t.r + '. ' + fit });
      });
      st.push({ slide: 10, line: 9, t: 8, cap: 'A <b>class</b> is a non-primitive type. <code>name</code> does not hold the characters: it holds a <b>reference</b> (an address) to a String object somewhere else in memory.' });
      st.push({ slide: 10, line: 10, t: 9, cap: '<b>Object</b> is the root class: every class is a kind of Object. String, System, Exception, Number, Scanner, Date and Random are classes of the Java library.' });
      return st;
    },
    draw: function (k, s, v) {
      var items = [], x = Number(v.v);
      TYPES.forEach(function (t, i) {
        items.push(B('chip' + i, 10, 14 + i * 34, 82, 28, { title: t.n, mono: true, size: 13, tone: i === s.t ? 'accent' : 'muted', fill: i === s.t ? 'solid' : 'soft', hi: i === s.t }));
      });
      items.push(B('chip8', 10, 14 + 8 * 34, 82, 28, { title: 'String', mono: true, size: 13, tone: s.t >= 8 ? 'accent' : 'muted', fill: s.t >= 8 ? 'solid' : 'soft', dash: true }));
      if (s.t === -1) {
        TYPES.forEach(function (t, i) {
          var w = t.b ? t.b * 44 : 8;
          items.push(B('bar' + i, 110, 18 + i * 34, w, 22, { tone: t.fl ? 'teal' : t.n === 'boolean' || t.n === 'char' ? 'blue' : 'accent', fill: 'soft', r: 3 }));
          items.push(T('bl' + i, 118 + w, 34 + i * 34, t.b ? t.b * 8 + ' bits' : '1 bit', { size: 12, tone: 'muted', mono: true }));
        });
        items.push(T('hint', 110, 318, 'one cell = 1 byte = 8 bits', { size: 12, tone: 'muted' }));
        return items;
      }
      if (s.t < 8) {
        var t = TYPES[s.t], n = t.b || 1, cw = 52, x0 = 112;
        items.push(T('tn', x0, 40, t.n, { mono: true, bold: true, size: 22, tone: 'accent' }));
        items.push(T('ts', x0 + 110, 40, t.b ? t.b + (t.b > 1 ? ' bytes' : ' byte') + ' = ' + t.b * 8 + ' bits' : '1 bit', { size: 15, tone: 'muted' }));
        for (var c = 0; c < n; c++) items.push(B('byte' + c, x0 + c * cw, 70, cw - 4, 44, { title: t.b ? '8 bits' : '1 bit', size: 11, tone: 'blue', fill: 'soft', r: 4 }));
        items.push(T('rg', x0, 150, 'Stores ' + t.r, { size: 15 }));
        if (s.ok != null) {
          items.push(B('val', x0, 190, 420, 54, { title: String(x), mono: true, size: 18, tone: s.ok ? 'teal' : 'red', hi: true, tag: 'your value' }));
          items.push(T('vk', x0 + 210, 270, s.ok ? '✓ fits in ' + t.n : '✗ does not fit in ' + t.n, { anchor: 'middle', size: 15, bold: true, tone: s.ok ? 'teal' : 'red' }));
        } else if (t.fl) {
          items.push(B('val', x0, 190, 420, 54, { title: digits(Math.PI, t.fl + 1), mono: true, size: 18, tone: 'teal', tag: 'π stored in a ' + t.n }));
        } else items.push(B('val', x0, 190, 160, 54, { title: t.n === 'boolean' ? 'true' : '\'A\'', mono: true, size: 18, tone: 'teal', tag: 'a value' }));
        return items;
      }
      if (s.t === 8) {
        items.push(B('vi', 120, 40, 120, 50, { title: '2000000000', mono: true, size: 13, tone: 'blue', tag: 'int i' }));
        items.push(T('vit', 260, 70, 'the value itself is in the box', { size: 13, tone: 'muted' }));
        items.push(B('vn', 120, 150, 120, 50, { title: '●', size: 16, tone: 'accent', tag: 'String name' }));
        items.push(OBJ('obj', 330, 130, 190, { name: 'String object', fields: ['"Ahmed"'], tone: 'teal' }));
        items.push(A('ref', 196, 175, 330, 160, { tone: 'accent', label: 'reference' }));
        items.push(T('vnt', 120, 260, 'a class type holds a reference to an object', { size: 13, tone: 'muted' }));
        return items;
      }
      var kids = ['String', 'System', 'Exception', 'Number', 'Scanner', 'Date', 'Random'];
      items.push(B('root', 270, 30, 120, 40, { title: 'Object', mono: true, size: 15, tone: 'accent', fill: 'solid', hi: true, tag: 'the root class' }));
      kids.forEach(function (c, i) {
        var row = i < 4 ? 0 : 1, col = row ? i - 4 : i, n = row ? 3 : 4, bw = 96, gap = 14, x0 = 330 - (n * bw + (n - 1) * gap) / 2;
        var bx = x0 + col * (bw + gap), by = row ? 230 : 140;
        items.push(B('k' + c, bx, by, bw, 34, { title: c, mono: true, size: 12.5, tone: 'teal', tag: c === 'Number' ? 'abstract' : undefined }));
        /* lines to the second row run down through the gaps of the first row; Number's line starts right of its tag */
        var lx = row ? bx + bw / 2 : c === 'Number' ? bx + bw - 12 : bx + bw / 2;
        items.push(A('ka' + c, lx, by, 330, 72, { tone: 'muted', via: [[lx, row ? 118 : 112]] }));
      });
      return items;
    }
  };

  /* ---------- 2. basic data structures and array problems (slides 11-12) ---------- */
  var AC = 'Student stu = new Student("Ahmed", 1234);\nint[] arr = new int[10];\nStudent[] students = new Student[5];\ndouble[][] table = new double[20][5];\n\n// Problem 1: index of the maximum and the minimum\npublic static int[] maxMinIndex(int[] array) {\n  int max = 0, min = 0;\n  for (int i = 1; i < array.length; i++) {\n    if (array[i] > array[max]) max = i;\n    if (array[i] < array[min]) min = i;\n  }\n  return new int[] {max, min};\n}\n\n// Problem 2: the top N numbers (take the maximum N times)\npublic static void topN(int[] array, int n) {\n  boolean[] taken = new boolean[array.length];\n  for (int k = 0; k < n; k++) {\n    int max = -1;\n    for (int i = 0; i < array.length; i++)\n      if (!taken[i] && (max == -1 || array[i] > array[max])) max = i;\n    taken[max] = true;\n    System.out.println(array[max] + " at index " + max);\n  }\n}\n\n// Problem 3: Two Sum\npublic static int[] twoSum(int[] array, int target) {\n  for (int i = 0; i < array.length; i++)\n    for (int j = i + 1; j < array.length; j++)\n      if (array[i] + array[j] == target)\n        return new int[] {i, j};\n  return null;   // no two elements add up to target\n}';
  function nums(s) { return String(s).split(/[\s,]+/).filter(function (t) { return /^-?\d{1,3}$/.test(t); }).map(Number).slice(0, 8); }
  var arrays = {
    id: 'arrays', slides: [11, 12], title: 'Objects, arrays, and three array problems', code: AC,
    inputs: [{ id: 'a', type: 'text', label: 'array', value: '2 7 11 15 6', minlen: 1, maxlen: 30 }, { id: 'n', label: 'N', value: 2, min: 1, max: 8 }, { id: 't', label: 'target', value: 8, min: -999, max: 1998 }],
    presets: [{ label: 'slide example', values: { a: '2 7 11 15 6', n: 2, t: 8 } }, { label: 'target 21', values: { a: '2 7 11 15 6', n: 2, t: 21 } }, { label: 'no pair', values: { a: '2 7 11 15 6', n: 3, t: 100 } }, { label: 'negatives', values: { a: '-4 9 -1 3', n: 1, t: 2 } }, { label: 'one element', values: { a: '5', n: 1, t: 10 } }],
    steps: function (v) {
      var a = nums(v.a), st = [], L = a.length;
      st.push({ slide: 11, line: 1, ph: 'obj', cap: 'An <b>object</b> is a basic data structure: one Student object stores a name and an id together. <code>stu</code> refers to it.' });
      st.push({ slide: 11, line: 2, ph: 'arr', cap: 'A <b>one-dimensional array</b> of a primitive type: 10 int cells next to each other, indexes 0 to 9. A new int array starts with 0 in every cell.' });
      st.push({ slide: 11, line: 3, ph: 'objs', cap: 'An <b>array of objects</b> stores references. <code>new Student[5]</code> makes 5 empty references (<b>null</b>): no Student objects exist yet.' });
      st.push({ slide: 11, line: 4, ph: 'grid', cap: 'A <b>two-dimensional array</b>: 20 rows and 5 columns, 100 double cells. (The slide forgets the variable name: Java needs one, like <code>table</code>.)' });
      if (L < 1) { st.push({ slide: 12, line: 7, ph: 'none', cap: 'Type some whole numbers (from -999 to 999) separated by spaces to run the three problems.' }); return st; }
      var mx = 0, mn = 0;
      st.push({ slide: 12, line: '7-8', ph: 'mm', i: 0, mx: 0, mn: 0, cap: 'Problem 1. Start by guessing that index 0 is both the maximum and the minimum.' });
      for (var i = 1; i < L; i++) {
        var nm = a[i] > a[mx], nn = a[i] < a[mn];
        if (nm) mx = i; if (nn) mn = i;
        st.push({ slide: 12, line: nm || nn ? (nm ? '10' : '11') : '9-11', ph: 'mm', i: i, mx: mx, mn: mn, cap: 'i = ' + i + ': array[' + i + '] = ' + a[i] + '. ' + (nm ? 'Bigger than the max so far: <b>max = ' + i + '</b>.' : nn ? 'Smaller than the min so far: <b>min = ' + i + '</b>.' : 'Not a new max or min.') });
      }
      st.push({ slide: 12, line: 13, ph: 'mm', i: -1, mx: mx, mn: mn, cap: 'One pass over the array is enough: the maximum ' + a[mx] + ' is at index <b>' + mx + '</b>, the minimum ' + a[mn] + ' at index <b>' + mn + '</b>.', out: 'max at index ' + mx + ', min at index ' + mn });
      var n = Math.min(Math.max(1, Math.trunc(v.n)), L), taken = [];
      st.push({ slide: 12, line: '17-19', ph: 'top', taken: [], pick: -1, cap: 'Problem 2: the top ' + n + '. Take the largest element that is not taken yet, ' + n + ' time' + (n > 1 ? 's' : '') + '.' + (Math.trunc(v.n) > L ? ' (N was bigger than the array, so N = ' + L + ' here; with a bigger N the code would fail.)' : ''), clear: true });
      for (var k = 0; k < n; k++) {
        var best = -1;
        for (i = 0; i < L; i++) if (taken.indexOf(i) < 0 && (best === -1 || a[i] > a[best])) best = i;
        taken.push(best);
        st.push({ slide: 12, line: '21-24', ph: 'top', taken: taken.slice(), pick: best, cap: 'Round ' + (k + 1) + ': the largest one not taken is ' + a[best] + ' at index ' + best + '. Mark it as taken and print it.', out: a[best] + ' at index ' + best });
      }
      st.push({ slide: 12, line: '29-30', ph: 'two', i: 0, j: -1, cap: 'Problem 3: Two Sum, target ' + v.t + '. Try every pair (i, j) with j after i and add the two elements.', clear: true });
      var found = null;
      outer: for (i = 0; i < L; i++) for (var j = i + 1; j < L; j++) {
        var hit = a[i] + a[j] === v.t;
        st.push({ slide: 12, line: hit ? '31-32' : '31', ph: 'two', i: i, j: j, hit: hit, cap: 'array[' + i + '] + array[' + j + '] = ' + a[i] + ' + ' + a[j] + ' = ' + (a[i] + a[j]) + (hit ? ' = target. Return <b>{' + i + ', ' + j + '}</b>.' : ' ≠ ' + v.t + '.'), out: hit ? 'indices ' + i + ' and ' + j : undefined });
        if (hit) { found = [i, j]; break outer; }
      }
      if (!found) st.push({ slide: 12, line: 33, ph: 'two', i: -1, j: -1, cap: L < 2 ? 'With one element there is no pair at all: return <b>null</b>.' : 'No pair adds up to ' + v.t + ': both loops end, and the method returns <b>null</b>.', out: 'no pair' });
      return st;
    },
    draw: function (k, s, v) {
      var items = [], a = nums(v.a), L = a.length;
      if (/^(obj|arr|objs|grid)$/.test(s.ph)) {
        var at = ['obj', 'arr', 'objs', 'grid'].indexOf(s.ph), op = function (q) { return q === at ? 1 : 0.45; };
        items.push(B('stu', 16, 30, 70, 38, { title: '●', size: 15, tone: 'accent', tag: 'stu', o: op(0) }));
        items.push(OBJ('sobj', 150, 14, 170, { name: 'Student', fields: ['name = "Ahmed"', 'id = 1234'], o: op(0) }));
        items.push(A('sref', 62, 49, 150, 49, { tone: 'accent', o: op(0) }));
        if (at >= 1) {
          items.push(T('arrn', 16, 130, 'arr', { mono: true, bold: true, size: 13, o: op(1) }));
          for (var c = 0; c < 10; c++) items.push(B('ac' + c, 50 + c * 34, 110, 32, 30, { title: '0', mono: true, size: 12, tone: at === 1 ? 'blue' : 'muted', o: op(1), r: 3 }));
          items.push(T('arri', 50, 158, '[0] … [9]', { mono: true, size: 11, tone: 'muted', o: op(1) }));
        }
        if (at >= 2) {
          items.push(T('stn', 16, 205, 'students', { mono: true, bold: true, size: 13, o: op(2) }));
          for (c = 0; c < 5; c++) items.push(B('sc' + c, 90 + c * 52, 185, 50, 30, { title: 'null', mono: true, size: 11, tone: at === 2 ? 'red' : 'muted', o: op(2), r: 3 }));
        }
        if (at >= 3) {
          items.push(T('tbn', 440, 30, 'table: 20 × 5', { mono: true, bold: true, size: 12, anchor: 'middle' }));
          for (var r = 0; r < 20; r++) for (c = 0; c < 5; c++) items.push(B('g' + r + '_' + c, 395 + c * 18, 42 + r * 13, 17, 12, { tone: 'teal', r: 1 }));
        }
        return items;
      }
      if (s.ph === 'none') return [T('no', 280, 170, 'type some numbers above', { anchor: 'middle', size: 15, tone: 'muted' })];
      var cw = Math.min(62, Math.floor(520 / Math.max(L, 1))), x0 = 280 - L * cw / 2, y = 130;
      a.forEach(function (x, i) {
        var tone = 'muted', hi = false;
        if (s.ph === 'mm') { if (i === s.mx) tone = 'accent'; else if (i === s.mn) tone = 'blue'; if (i === s.i) hi = true; }
        if (s.ph === 'top') { if (s.taken.indexOf(i) >= 0) tone = 'teal'; if (i === s.pick) { tone = 'accent'; hi = true; } }
        if (s.ph === 'two') { if (i === s.i || i === s.j) { tone = s.hit ? 'teal' : 'accent'; hi = true; } }
        items.push(B('c' + i, x0 + i * cw, y, cw - 4, 46, { title: String(x), mono: true, size: 16, tone: tone, fill: hi ? 'solid' : 'soft', hi: hi }));
        items.push(T('ix' + i, x0 + i * cw + cw / 2 - 2, y + 66, '[' + i + ']', { anchor: 'middle', mono: true, size: 12, tone: 'muted' }));
      });
      var mid = function (i) { return x0 + i * cw + cw / 2 - 2; };
      if (s.ph === 'mm') {
        if (s.i > 0) items.push(P('pi', mid(s.i), y - 4, 'i', { dir: 'down' }));
        items.push(T('mm', 280, 270, 'max = ' + s.mx + ' (' + a[s.mx] + ')     min = ' + s.mn + ' (' + a[s.mn] + ')', { anchor: 'middle', mono: true, size: 15, bold: true, tone: 'accent' }));
        items.push(T('h1', 280, 40, 'Problem 1: index of the max and the min', { anchor: 'middle', size: 14, bold: true }));
      }
      if (s.ph === 'top') {
        items.push(T('h1', 280, 40, 'Problem 2: the top ' + Math.min(Math.max(1, Math.trunc(v.n)), L), { anchor: 'middle', size: 14, bold: true }));
        items.push(T('tk', 280, 270, s.taken.length ? 'taken: ' + s.taken.map(function (i) { return a[i] + ' [' + i + ']'; }).join(', ') : 'nothing taken yet', { anchor: 'middle', mono: true, size: 14, bold: true, tone: 'teal' }));
      }
      if (s.ph === 'two') {
        items.push(T('h1', 280, 40, 'Problem 3: Two Sum, target ' + v.t, { anchor: 'middle', size: 14, bold: true }));
        if (s.i >= 0 && s.j >= 0) {
          items.push(P('pi', mid(s.i), y - 4, 'i', { dir: 'down' }));
          items.push(P('pj', mid(s.j), y - 4, 'j', { dir: 'down' }));
          items.push(T('sum', 280, 270, a[s.i] + ' + ' + a[s.j] + ' = ' + (a[s.i] + a[s.j]) + (s.hit ? '  ✓' : '  ≠ ' + v.t), { anchor: 'middle', mono: true, size: 16, bold: true, tone: s.hit ? 'teal' : 'accent' }));
        } else items.push(T('sum', 280, 270, 'no pair found → null', { anchor: 'middle', mono: true, size: 16, bold: true, tone: 'red' }));
      }
      return items;
    }
  };

  /* ---------- 3. the map of the course: the Java Collection Framework (slides 13-16) ---------- */
  var NODES = {
    Iterable: [176, 8, 'i'], Collection: [176, 52, 'i'],
    List: [16, 104, 'i'], ArrayList: [40, 150, 'c'], LinkedList: [40, 196, 'c'], Vector: [40, 242, 'l'], Stack: [40, 288, 'l'],
    Queue: [176, 104, 'i'], PriorityQueue: [200, 150, 'c', 112], Deque: [176, 196, 'i'], ArrayDeque: [200, 242, 'c'],
    Set: [340, 104, 'i'], HashSet: [374, 150, 'c'], LinkedHashSet: [374, 196, 'c', 112], SortedSet: [340, 242, 'i'], TreeSet: [374, 288, 'c'],
    Map: [504, 104, 'i'], HashMap: [538, 150, 'c'], LinkedHashMap: [538, 196, 'c', 112], SortedMap: [504, 242, 'i'], TreeMap: [538, 288, 'c'],
    HashTable: [646, 150, 'l', 70]
  };
  function nw(n) { return NODES[n][3] || 100; }
  /* arrows, child → parent: [child, parent, dashed (implements), kind]: 'up' = straight up at x, 'side' = left side line at x,
     'top' = from the child's top to the parent through y 90, 'right' = from the child's right side */
  var LINKS = [['Collection', 'Iterable', 0, 'up', 226], ['List', 'Collection', 0, 'top', 200], ['Queue', 'Collection', 0, 'up', 226], ['Set', 'Collection', 0, 'top', 252],
    ['ArrayList', 'List', 1, 'side', 34], ['LinkedList', 'List', 1, 'side', 28], ['Vector', 'List', 1, 'side', 22], ['Stack', 'Vector', 0, 'up', 90],
    ['PriorityQueue', 'Queue', 1, 'side', 194], ['Deque', 'Queue', 0, 'up', 186], ['ArrayDeque', 'Deque', 1, 'up', 226], ['LinkedList', 'Deque', 1, 'right'],
    ['HashSet', 'Set', 1, 'side', 366], ['LinkedHashSet', 'Set', 1, 'side', 360], ['SortedSet', 'Set', 0, 'up', 348], ['TreeSet', 'SortedSet', 1, 'up', 400],
    ['HashMap', 'Map', 1, 'side', 530], ['LinkedHashMap', 'Map', 1, 'side', 524], ['SortedMap', 'Map', 0, 'up', 512], ['TreeMap', 'SortedMap', 1, 'up', 564],
    ['HashTable', 'Map', 1, 'corner', 681]];
  function link(l, i) {
    var c = NODES[l[0]], p = NODES[l[1]], o = { dash: !!l[2], tone: 'muted' }, cy = c[1] + 13, pb = p[1] + 26;
    if (l[3] === 'up') return A('l' + i, l[4], c[1], l[4], pb, o);
    if (l[3] === 'side') { o.via = [[l[4], cy]]; return A('l' + i, c[0], cy, l[4], pb, o); }
    if (l[3] === 'top') { var cx = c[0] + nw(l[0]) / 2; o.via = [[cx, 90], [l[4], 90]]; return A('l' + i, cx, c[1], l[4], pb, o); }
    if (l[3] === 'right') return A('l' + i, c[0] + nw(l[0]), cy, p[0], cy, o);
    o.via = [[l[4], p[1] + 13]]; return A('l' + i, l[4], c[1], p[0] + nw(l[1]), p[1] + 13, o);
  }
  var GROUPS = [
    { on: [], slide: 13, cap: 'The course studies these data structures, how they are used, and how to <b>implement</b> them. Java already has many of them in its library: the <b>Java Collection Framework</b>.' },
    { on: ['Stack', 'Vector'], slide: 13, cap: '<b>Stacks</b> (units 3 and 4). Java has a Stack class, but we will write our own two: <b>ArrayStack</b> (with an array) and <b>LinkedStack</b> (with links).' },
    { on: ['Queue', 'Deque', 'ArrayDeque', 'PriorityQueue', 'LinkedList'], slide: 13, cap: '<b>Queues</b> (unit 5): our own ArrayQueue and LinkedQueue. In Java, Queue is an interface, and LinkedList is one class that implements it.' },
    { on: ['List', 'ArrayList', 'LinkedList'], slide: 13, cap: '<b>Lists</b>: ArrayList and LinkedList. Both implement the List interface.' },
    { on: ['Set', 'HashSet', 'LinkedHashSet', 'SortedSet', 'TreeSet'], slide: 13, cap: '<b>Sets</b>: the Set interface and the classes that implement it.' },
    { on: ['Map', 'HashMap', 'LinkedHashMap', 'SortedMap', 'TreeMap', 'HashTable'], slide: 13, cap: '<b>Maps</b>: HashMap and HashTable. Map is not a Collection: it is a separate family in the picture.' },
    { on: [], slide: 14, cap: '<b>Trees</b> and <b>graphs</b> are not boxes in this picture: we will build them ourselves. The course also covers algorithms: binary search, five sorting algorithms, and tree and graph traversal.' },
    { on: ['Iterable', 'Collection'], slide: 16, cap: 'A <b>collection</b> is an object that represents a group of objects. Dark boxes are <b>interfaces</b>, green ones are <b>classes</b>, light blue ones are old (<b>legacy</b>) classes. A dashed arrow means <i>implements</i>, a solid arrow means <i>extends</i>.' }
  ];
  var map = {
    id: 'map', slides: [13, 16], title: 'The data structures of this course', vb: [720, 330],
    steps: GROUPS,
    draw: function (k, s) {
      var items = [], on = s.on;
      Object.keys(NODES).forEach(function (n) {
        var d = NODES[n], lit = on.indexOf(n) >= 0;
        items.push(B('n' + n, d[0], d[1], nw(n), 26, { title: n, size: 11.5, r: 6, tone: lit ? 'accent' : d[2] === 'i' ? 'blue' : d[2] === 'c' ? 'teal' : 'muted', fill: d[2] === 'i' || lit ? 'solid' : 'soft', hi: lit, o: on.length && !lit ? 0.5 : 1 }));
      });
      LINKS.forEach(function (l, i) { items.push(link(l, i)); });
      return items;
    }
  };

  addUnit({
    course: 'ds', lesson: '01-introduction',
    blurb: 'What data structures are and why they matter, Java data types, objects and arrays as basic data structures, and a map of the course.',
    parts: [
      { title: 'The course and why data structures', from: 1, to: 8 },
      { title: 'Data types and basic data structures', from: 9, to: 12 },
      { title: 'What we will study', from: 13, to: 16 }
    ],
    visuals: [types, arrays, map],
    slides: {
      1: { cover: true, explain: '<p>Welcome to <b>Data Structures</b> (GEIT 2421). In CS I and CS II you learned to write Java programs. This course is about the <b>data</b> inside programs: how to {{organize|ننظّم}} and store it so that the program is fast and simple.</p><pre class="ex">the same 1000 names:\n  in a random pile → slow to find one\n  in a good structure → fast to find one</pre><p>Every unit has its slides, simple explanations and drawings that move step by step.</p>' },
      2: { explain: '<p>Practical information about the course: who teaches it, where his office is, and where the lectures and homework are: on <b>Blackboard</b>.</p><pre class="ex">Blackboard → lectures, homework, announcements</pre><p class="watch">Check Blackboard often: homework and {{announcements|الإعلانات}} are posted there, not only in class.</p>' },
      3: { explain: '<p>A <b>data structure</b> is a way to <b>organize and store</b> data in a computer so that we can reach it and use it {{efficiently|بكفاءة}} (fast, without wasting memory).</p><pre class="ex">a stack of plates: take the top one\na line at a bank: the first person is served first</pre><p>In this course: stacks, queues, lists, trees, sets, maps and graphs; sorting and hashing algorithms; and how to <b>measure</b> how fast an algorithm is.</p><p class="watch">A data structure is not only “where the data is”: it also decides which {{operations|العمليات}} are fast and which are slow.</p>' },
      4: { explain: '<p>The main {{textbook|الكتاب المقرر}} is <i>Java Software Structures</i> by Lewis and Chase (4th edition). A second book, by Koffman and Wolfgang, is a {{reference|مرجع}} for extra reading.</p><pre class="ex">main book → Lewis and Chase\nreference → Koffman and Wolfgang</pre><p>The slides follow the main book, so its chapters match the units of this site.</p>' },
      5: { explain: '<p>The goals of the course. At the end you should be able to:</p><ul><li><b>describe</b> how stacks, queues, lists, trees, sets, maps and graphs are used;</li><li><b>analyze</b> how fast an algorithm is, with math;</li><li><b>compare</b> two implementations of the same structure (their good and bad sides);</li><li><b>choose</b> the right structure for a problem.</li></ul><p class="watch">Knowing the code is not enough: the course also asks <i>why</i> one structure is better than another for a job.</p>' },
      6: { explain: '<p>How the final grade is made. The parts add up to 100%:</p><pre class="ex">10 + 20 + 15 + 15 + 10 + 30 = 100</pre><p>The <b>final exam</b> is the biggest part (30%), and the lab is 20%. Together the two exams before the final are also 30%.</p><p class="watch">There is <b>no {{makeup|تعويضي}} exam</b>: if you miss an exam, you cannot take it again later.</p>' },
      7: { explain: '<p>Why use data structures? Four {{advantages|مزايا}}:</p><ol><li><b>Efficiency</b>: data is stored and found fast, so programs run faster.</li><li><b>Flexibility</b>: data is easy to change and move around.</li><li><b>Reusability</b>: write a structure once, use it in many programs.</li><li><b>Maintainability</b>: well designed structures make programs easier to understand and fix.</li></ol><pre class="ex">write a Stack class once → use it in a calculator, an editor, …</pre>' },
      8: { explain: '<p>Data structures are everywhere:</p><ul><li><b>Databases</b> organize huge amounts of data so a search is fast.</li><li><b>Operating systems</b> use them to manage memory and files.</li><li><b>Computer graphics</b> uses them to represent shapes.</li><li><b>Artificial intelligence</b> uses them to represent knowledge.</li></ul><pre class="ex">folders inside folders on your laptop → a structure of the OS</pre>' },
      9: { text: false, explain: '<p>Java has 8 <b>primitive</b> types. Each has a fixed size; 1 <b>byte</b> = 8 <b>bits</b>.</p><pre class="ex">byte 1 · short 2 · int 4 · long 8 bytes\nfloat 4 (≈ 6 digits) · double 8 (≈ 15 digits)\nboolean 1 bit · char 2 bytes</pre><p>A bigger type stores bigger numbers but uses more memory. float and double store numbers with a decimal point; double is more {{precise|دقيق}}.</p><p class="watch">An int cannot store 3000000000: it is bigger than 2³¹ − 1 (2147483647). Use long. Try it in the drawing.</p>' },
      10: { explain: '<p>A <b>class</b> is a <b>non-primitive</b> type. Programmers write their own classes, and Java’s library has many ready ones:</p><ul><li><b>Object</b>: the root class, every class comes from it;</li><li>String, System, Exception, Number, Scanner, Date, Random…</li></ul><pre class="ex">int n = 5;          // n holds 5\nString s = "Hi";    // s holds a reference to an object</pre><p class="watch">A variable of a class type does not hold the object itself, only a <b>reference</b> to it.</p>' },
      11: { explain: '<p>The basic data structures you already know:</p><ul><li>an <b>object</b> stores related data together (a student’s name and id);</li><li>a <b>1D array</b> of a primitive type, or of objects (references, null at first);</li><li>a <b>2D array</b>: rows and columns.</li></ul><pre class="ex">double[][] table = new double[20][5];   // 20 rows, 5 columns</pre><p class="watch">The slide writes <code>double[][] = new double[20][5];</code> without a variable name. Java needs one, like <code>table</code>.</p>' },
      12: { explain: '<p>Three practice problems on arrays:</p><ol><li>the <b>index</b> of the maximum and of the minimum;</li><li>the <b>top N</b> numbers;</li><li><b>Two Sum</b>: two indices whose elements add up to a {{target|هدف}}.</li></ol><pre class="ex">[2, 7, 11, 15, 6], target 8 → indices 0 and 4\n(array[0] + array[4] = 2 + 6 = 8)</pre><p>The drawing solves all three on any array you type.</p><p class="watch">Problem 1 asks for the <b>index</b> (the position), not the value: for [2, 7, 11, 15, 6] the max is at index 3, not “15”.</p>' },
      13: { explain: '<p>The data structures of this course, each with its Java {{implementations|تطبيقات برمجية}}:</p><pre class="ex">Stacks → ArrayStack, LinkedStack\nQueues → ArrayQueue, LinkedQueue\nLists  → ArrayList, LinkedList\nSets, Maps (HashMap, HashTable), Trees, Graphs</pre><p>The name tells how it is built: <b>Array</b>… keeps the data in an array, <b>Linked</b>… uses linked nodes.</p><p class="watch">A stack is an idea (last in, first out); ArrayStack and LinkedStack are two different ways to build the same idea.</p>' },
      14: { explain: '<p>The course also covers some {{algorithms|خوارزميات}}:</p><ol><li><b>binary search</b>;</li><li><b>sorting</b>: selection, insertion, bubble, quick and merge sort;</li><li>ways to visit every node of a <b>tree</b>;</li><li>ways to visit every node of a <b>graph</b>.</li></ol><pre class="ex">sorting: [5, 2, 9, 1] → [1, 2, 5, 9]</pre><p>We will also compare how fast they are (unit 2).</p>' },
      15: { blocks: [{ type: 'bullet', text: 'You need to spend some time reviewing Java programming' },
        { type: 'bullet', html: 'Use this link to review the basics of Java <a href="https://www.w3schools.com/java/default.asp" target="_blank" rel="noopener">https://www.w3schools.com/java/default.asp</a>' },
        { type: 'bullet', html: 'Use this link to review Java methods <a href="https://www.w3schools.com/java/java_methods.asp" target="_blank" rel="noopener">https://www.w3schools.com/java/java_methods.asp</a>' },
        { type: 'bullet', html: 'Use this link to review Java classes and objects <a href="https://www.w3schools.com/java/java_oop.asp" target="_blank" rel="noopener">https://www.w3schools.com/java/java_oop.asp</a>' }],
        explain: '<p>This course uses CS I and CS II Java all the time: methods, classes, objects, arrays, interfaces and exceptions. If some of it is not clear, {{review|راجع}} it now.</p><pre class="ex">class, object, new, this,\ninterface, implements, throw, try/catch</pre><p>The links open W3Schools pages. The CS1 and CS2 courses on this site are also a good review.</p>' },
      16: { explain: '<p>The <b>Java Collection Framework</b> is the part of Java’s library for {{collections|المجموعات}}. A collection is an object that holds a group of objects.</p><ul><li>dark boxes: <b>interfaces</b> (List, Queue, Set, Map…);</li><li>green: <b>classes</b> that implement them (ArrayList, HashMap…);</li><li>light blue: old (<b>legacy</b>) classes (Vector, Stack, HashTable).</li></ul><pre class="ex">List&lt;String&gt; names = new ArrayList&lt;&gt;();</pre><p class="watch">In this course we do not only <i>use</i> these classes: we write our own versions of them.</p>' }
    },
    exam: {
      questions: [
        { source: { assignment: 1, question: 21 },
          q: 'A 3 by 3 matrix is stored in M. Which condition identifies its main-diagonal cells?',
          options: ['row + column == 3', 'row < column', 'row > column', 'row == column'], answer: 3, review: 11,
          why: 'The main diagonal goes from the top left to the bottom right: M[0][0], M[1][1], M[2][2]. In every one of them the row equals the column. "row &lt; column" is the part above the diagonal and "row &gt; column" the part below it. With indexes from 0, the other diagonal is row + column == 2, not 3.',
          lessons: ['01-introduction'], skills: ['concept'], available_after: '01-introduction', level: 1 },
        { source: { assignment: 1, question: 3 },
          q: 'For a matrix M with r rows and c columns, which nested-loop bounds visit every cell once?',
          options: ['Both loops 0 to c', 'Both loops 0 to r', 'Outer loop 0 to r-1 and inner loop 0 to c-1', 'Outer loop 1 to r and inner loop 1 to c'], answer: 2, review: 11,
          why: 'The row index goes from 0 to r − 1 and the column index from 0 to c − 1 (indexes start at 0). Using c or r for both loops only works for a square matrix. "1 to r" skips row 0 and column 0 and goes one step past the end.',
          lessons: ['01-introduction'], skills: ['concept'], available_after: '01-introduction', level: 1 },
        { source: { assignment: 1, question: 13 },
          q: 'Which is an important edge case when testing a function that processes arrays?',
          options: ['An empty array', 'Only arrays containing positive values', 'Only an array of length exactly 100', 'Only arrays whose elements are distinct'], answer: 0, review: 12,
          why: 'An empty array is the classic {{edge case|حالة حدّية}}: a method that reads <code>array[0]</code> (like problem 1 of slide 12) crashes on it. The other options are the opposite of testing edge cases: they test only the easy, normal arrays.',
          lessons: ['01-introduction'], skills: ['edge_case'], available_after: '01-introduction', level: 1 },
        { source: { assignment: 1, question: 17 },
          q: 'To reverse an array in place, which pair of elements should be swapped first?',
          options: ['The smallest and largest values', 'The first and second elements', 'The two middle elements', 'The first and last elements'], answer: 3, review: 12,
          why: 'Reversing means the first element becomes the last and the last becomes the first. So swap index 0 with index length − 1, then 1 with length − 2, and move inward until the middle. Values do not matter (the array is not sorted), and swapping neighbours does not reverse anything.',
          lessons: ['01-introduction'], skills: ['concept'], available_after: '01-introduction', level: 1 },
        { q: 'A program must keep the number 3.14159265358979 with all of its 15 significant digits. Which type of slide 9 should it use?',
          options: ['float', 'double', 'long', 'int'], answer: 1, review: 9,
          why: 'double stores floating-point numbers with about 15 significant digits. float keeps only about 6, so most of the digits are lost. long and int store whole numbers only, so the part after the point is lost.',
          lessons: ['01-introduction'], skills: ['concept'], available_after: '01-introduction', level: 1 },
        { source: { assignment: 1, question: 5 },
          q: 'A programmer loops from i = 0 through i <= length(A). What is the most likely problem?',
          options: ['The last element is skipped', 'The loop attempts to access one position beyond the array', 'The first element is skipped', 'The loop executes only once'], answer: 1, review: 12,
          why: 'The last valid index is length − 1. With &lt;= the loop also runs with i = length, a position that does not exist (in Java: ArrayIndexOutOfBoundsException). Nothing is skipped: the loop visits every element and then one more.',
          lessons: ['01-introduction'], skills: ['bug'], available_after: '01-introduction', level: 2 },
        { source: { assignment: 1, question: 7 },
          q: 'An array A has length n. Which condition safely checks whether index i is valid?',
          options: ['i <= n', '0 < i AND i <= n', '0 <= i AND i < n', 'i < n'], answer: 2, review: 12,
          why: 'Valid indexes are 0 to n − 1, so i must be at least 0 <b>and</b> smaller than n. "i &lt; n" alone accepts -1. "i &lt;= n" accepts n. "0 &lt; i AND i &lt;= n" uses positions 1 to n, which rejects index 0 and accepts n.',
          lessons: ['01-introduction'], skills: ['edge_case'], available_after: '01-introduction', level: 2 },
        { source: { assignment: 1, question: 10 },
          q: 'A = [1, 2, 3, 4, 5]. After two left rotations, what is A?',
          options: ['[5, 1, 2, 3, 4]', '[3, 4, 5, 1, 2]', '[4, 5, 1, 2, 3]', '[2, 3, 4, 5, 1]'], answer: 1, review: 12,
          why: 'One left rotation moves the first element to the end: [2, 3, 4, 5, 1]. A second one gives [3, 4, 5, 1, 2]. "[2, 3, 4, 5, 1]" stops after one rotation; "[4, 5, 1, 2, 3]" and "[5, 1, 2, 3, 4]" rotate to the right.',
          lessons: ['01-introduction'], skills: ['trace'], available_after: '01-introduction', level: 2 },
        { source: { assignment: 1, question: 20 },
          q: 'A = [0, 1, 0, 3, 12]. You must move all zeros to the end while {{preserving|مع الحفاظ على}} the order of nonzero values. What should the result be?',
          options: ['[1, 3, 12, 0, 0]', '[12, 3, 1, 0, 0]', '[1, 0, 3, 0, 12]', '[0, 0, 1, 3, 12]'], answer: 0, review: 12,
          why: 'The nonzero values keep their order 1, 3, 12, and the two zeros go after them. "[12, 3, 1, 0, 0]" reverses the order of the nonzero values. "[0, 0, 1, 3, 12]" moves the zeros to the front, and "[1, 0, 3, 0, 12]" does not move them at all.',
          lessons: ['01-introduction'], skills: ['trace'], available_after: '01-introduction', level: 2 },
        { type: 'output', q: 'What does this print?',
          code: 'Student[] team = new Student[3];\nteam[0] = new Student("Omar", 10);\nSystem.out.println(team[2]);',
          answer: 'null', review: 11,
          why: 'An array of objects holds <b>references</b>, and every cell starts as null (slide 11). Only cell 0 got a Student, so team[2] is still null and println prints <code>null</code>.',
          lessons: ['01-introduction'], skills: ['trace', 'concept'], available_after: '01-introduction', level: 2 },
        { type: 'trace', q: 'The topN method of slide 12 (the drawing) takes the largest element that is not taken yet, N times; with a tie it keeps the first index. Fill in what each round prints for array = {5, 8, 2, 8} and n = 3.',
          code: 'for (int k = 0; k < n; k++) {\n  int max = -1;\n  for (int i = 0; i < array.length; i++)\n    if (!taken[i] && (max == -1 || array[i] > array[max])) max = i;\n  taken[max] = true;\n  System.out.println(array[max] + " at index " + max);\n}',
          cols: ['round', 'index printed', 'value printed'], rows: [['1', '?1', '?8'], ['2', '?3', '?8'], ['3', '?0', '?5']], review: 12,
          why: 'Round 1: 8 at index 1 wins (the second 8 is not <b>bigger</b>, so index 1 stays). Index 1 is now taken, so round 2 finds the other 8 at index 3. Round 3: only 5 and 2 are left, so 5 at index 0.',
          lessons: ['01-introduction'], skills: ['trace'], available_after: '01-introduction', level: 2 },
        { type: 'write', q: '`m` is a square 2D int array (as many rows as columns). Write a loop that adds up the cells of the main diagonal into `sum` (already declared as `int sum = 0;`).',
          rows: 3, starter: 'int sum = 0;\n',
          checks: [{ re: /for\s*\(\s*int\s+(\w+)\s*=\s*0\s*;\s*\1\s*<\s*m\.length\s*;/, label: 'A loop from 0 while i < m.length' },
            { re: /m\s*\[\s*(\w+)\s*\]\s*\[\s*\1\s*\]/, label: 'Uses m[i][i] (row == column)' },
            { re: /sum\s*\+=|sum\s*=\s*sum\s*\+/, label: 'Adds to sum' }],
          solution: 'int sum = 0;\nfor (int i = 0; i < m.length; i++)\n  sum += m[i][i];', review: 11,
          why: 'The diagonal cells are the ones where the row equals the column, so one loop is enough: m[0][0], m[1][1], … Two nested loops would also work, but they visit every cell to use only n of them.',
          lessons: ['01-introduction'], skills: ['design'], available_after: '01-introduction', level: 2 },
        { type: 'order', q: 'Put the lines in order to reverse the array `a` in place.',
          lines: ['int i = 0, j = a.length - 1;', 'while (i < j) {', '  int temp = a[i];', '  a[i] = a[j];', '  a[j] = temp;', '  i++; j--;', '}'], review: 12,
          why: 'Start with the first and last index and swap them, using temp so that a[i] is not lost. Then move both indexes toward the middle. The loop stops when they meet (i &lt; j), otherwise the elements would be swapped back.',
          lessons: ['01-introduction'], skills: ['design'], available_after: '01-introduction', level: 2 },
        { q: 'The Two Sum method of slide 12 checks the pairs (i, j) with j starting at i + 1. What does it return for array = [4, -2, 9, 6, 2] and target 8?',
          options: ['{0, 0}, because 4 + 4 = 8', 'null, because no pair adds up to 8', '{3, 4}', '{1, 2}'], answer: 2, review: 12,
          why: 'The same element cannot be used twice: j starts at i + 1, so 4 + 4 is never tried. Going through the pairs in order: i = 0 gives 2, 13, 10, 6; i = 1 gives 7, 4, 0; i = 2 gives 15, 11; i = 3 gives 6 + 2 = 8. So it returns {3, 4}. -2 + 9 = 7, not 8.',
          lessons: ['01-introduction'], skills: ['trace', 'edge_case'], available_after: '01-introduction', level: 3 }
      ],
      tasks: [
        {
          title: 'Index of the smallest element',
          task: '<p>Write <code>public static int minIndex(int[] a)</code> that returns the <b>index</b> of the smallest element of a nonempty array (the first one if there is a tie). Start with index 0 as the smallest so far, not with a fixed number. In main, print <code>minIndex(new int[] {6, -2, 8, -2})</code>.</p>',
          starter: 'public class MinIndex {\n  public static void main(String[] args) {\n    \n  }\n\n}',
          output: '1',
          checks: [
            { re: /public\s+static\s+int\s+minIndex\s*\(\s*int\s*\[\s*\]\s*\w+\s*\)/, label: 'Header: <code>public static int minIndex(int[] a)</code>', review: 12 },
            { re: /int\s+\w+\s*=\s*0\s*;/, label: 'Starts with index 0 as the smallest', review: 12 },
            { re: /for\s*\(\s*int\s+(\w+)\s*=\s*[01]\s*;\s*\1\s*<\s*a\.length\s*;/, label: 'Loop <code>for (int i = 1; i &lt; a.length; i++)</code>', review: 12 },
            { re: /a\s*\[\s*\w+\s*\]\s*<\s*a\s*\[\s*\w+\s*\]/, label: 'Compares <code>a[i] &lt; a[min]</code> (strictly smaller keeps the first tie)', review: 12 },
            { re: /minIndex\s*\(\s*new\s+int\s*\[\s*\]\s*\{\s*6\s*,\s*-2\s*,\s*8\s*,\s*-2\s*\}\s*\)/, label: 'main calls <code>minIndex(new int[] {6, -2, 8, -2})</code>', review: 12 }
          ],
          solution: 'public class MinIndex {\n  public static void main(String[] args) {\n    System.out.println(minIndex(new int[] {6, -2, 8, -2}));\n  }\n\n  public static int minIndex(int[] a) {\n    int min = 0;\n    for (int i = 1; i < a.length; i++)\n      if (a[i] < a[min]) min = i;\n    return min;\n  }\n}'
        },
        {
          title: 'Reverse an array in place',
          task: '<p>Write <code>public static void reverse(int[] a)</code> that reverses the array <b>in place</b> (no second array): swap the first and the last element, then the second and the one before the last, and so on until the middle. In main, reverse <code>{1, 2, 3, 4, 5}</code> and print the elements on one line, separated by spaces.</p>',
          starter: 'public class Reverse {\n  public static void main(String[] args) {\n    int[] a = {1, 2, 3, 4, 5};\n    \n  }\n\n}',
          output: '5 4 3 2 1',
          checks: [
            { re: /public\s+static\s+void\s+reverse\s*\(\s*int\s*\[\s*\]\s*\w+\s*\)/, label: 'Header: <code>public static void reverse(int[] a)</code>', review: 12 },
            { re: /a\.length\s*\/\s*2|\w+\s*<\s*\w+\s*\)/, label: 'Stops at the middle (<code>i &lt; a.length / 2</code> or <code>i &lt; j</code>)', review: 12 },
            { re: /a\.length\s*-\s*1\s*-\s*\w+|\w+\s*--/, label: 'The second index moves from the end (<code>a.length - 1 - i</code>)', review: 12 },
            { re: /int\s+\w+\s*=\s*a\s*\[[^\]]+\]\s*;/, label: 'Keeps one element in a temp variable before the swap', review: 12 },
            { re: /reverse\s*\(\s*a\s*\)/, label: 'main calls <code>reverse(a)</code>', review: 12 }
          ],
          solution: 'public class Reverse {\n  public static void main(String[] args) {\n    int[] a = {1, 2, 3, 4, 5};\n    reverse(a);\n    for (int i = 0; i < a.length; i++)\n      System.out.print(a[i] + " ");\n    System.out.println();\n  }\n\n  public static void reverse(int[] a) {\n    for (int i = 0; i < a.length / 2; i++) {\n      int temp = a[i];\n      a[i] = a[a.length - 1 - i];\n      a[a.length - 1 - i] = temp;\n    }\n  }\n}'
        }
      ]
    }
  });
})();
