/* CS1 · Unit 9 · Multidimensional Arrays (20 slides): tables as two-dimensional arrays, declaring and creating them,
   lengths, initializers, ragged arrays, processing with nested loops, passing to methods, and three-dimensional arrays */
(function () {
  function mix(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }
  function jd(x) {
    if (x === 0) return '0.0';
    var a = Math.abs(x);
    if (a >= 1e-3 && a < 1e7) { var s = String(x); return s.indexOf('.') < 0 ? s + '.0' : s; }
    var e = x.toExponential().split('e'), m = e[0];
    return (m.indexOf('.') < 0 ? m + '.0' : m) + 'E' + Number(e[1]);
  }
  function I(x) { return Math.trunc(x); }
  function vbox(id, x, y, w, name, type, value, o) {
    return B(id, x, y, w, 48, mix({ tag: type + ' ' + name, title: value == null ? 'no value' : String(value), mono: true, size: 16, tone: value == null ? 'muted' : 'teal', dash: value == null, r: 6 }, o || {}));
  }
  function hot(o) { return mix(o || {}, { tone: 'accent', hi: true }); }
  /* a matrix typed as rows separated by ; like "1 2 3; 4 5 6" */
  function parseM(t, maxR, maxC) {
    var rows = String(t).split(';').map(function (r) { return (r.match(/-?\d+/g) || []).slice(0, maxC || 6).map(Number); }).filter(function (r) { return r.length; });
    rows = rows.slice(0, maxR || 5);
    return rows.length ? rows : [[0]];
  }
  /* draw a 2D array as a grid with [row] and [column] labels */
  function grid(p, x, y, m, o) {
    o = o || {};
    var cw = o.cw || 46, ch = o.ch || 34, out = [], cols = 0;
    m.forEach(function (r) { cols = Math.max(cols, r.length); });
    if (o.heads !== false) for (var c = 0; c < cols; c++) out.push(T(p + 'h' + c, x + c * cw + cw / 2 - 1, y - 8, '[' + c + ']', { anchor: 'middle', mono: true, size: 11, tone: o.colOn === c ? 'accent' : 'muted', bold: o.colOn === c }));
    m.forEach(function (r, i) {
      out.push(T(p + 'r' + i, x - 8, y + i * ch + ch / 2 + 4, '[' + i + ']', { anchor: 'end', mono: true, size: 11, tone: o.rowOn === i ? 'accent' : 'muted', bold: o.rowOn === i }));
      r.forEach(function (v, j) {
        var t = o.tone ? o.tone(i, j) : 'blue';
        out.push(B(p + i + '_' + j, x + j * cw, y + i * ch, cw - 3, ch - 3, { title: v == null ? '' : String(v), mono: true, size: o.size || (String(v).length > 4 ? 10 : 13), r: 3, tone: t, hi: !!(o.hot && o.hot(i, j)) }));
      });
    });
    return out;
  }

  /* ---------- 1. a table of distances (slide 2) ---------- */
  var CITIES = ['Chicago', 'Boston', 'New York', 'Atlanta', 'Miami', 'Dallas', 'Houston'];
  var DIST = [[0, 983, 787, 714, 1375, 967, 1087], [983, 0, 214, 1102, 1763, 1723, 1842], [787, 214, 0, 888, 1549, 1548, 1627], [714, 1102, 888, 0, 661, 781, 810], [1375, 1763, 1549, 661, 0, 1426, 1187], [967, 1723, 1548, 781, 1426, 0, 239], [1087, 1842, 1627, 810, 1187, 239, 0]];
  var distance = {
    id: 'distance', slides: [2, 2], title: 'A table needs two indexes',
    inputs: [{ id: 'r', label: 'from (row)', value: 1, min: 0, max: 6 }, { id: 'c', label: 'to (column)', value: 2, min: 0, max: 6 }],
    presets: [{ label: 'Boston → New York', values: { r: 1, c: 2 } }, { label: 'Dallas → Houston', values: { r: 5, c: 6 } }, { label: 'Miami → Miami', values: { r: 4, c: 4 } }],
    code: function (v) { return 'double[][] distances = { ... };  // 7 rows, 7 columns\nSystem.out.println(distances[' + I(v.r) + '][' + I(v.c) + ']);'; },
    steps: function (v) {
      var r = I(v.r), c = I(v.c);
      return [
        { ph: 'all', cap: 'A one-dimensional array is a single row. A table has <b>rows and columns</b>, so we need two indexes: one for the row, one for the column.' },
        { ph: 'row', line: 2, cap: 'The first index picks the <b>row</b>: ' + r + ' = ' + CITIES[r] + '.' },
        { ph: 'cell', line: 2, cap: 'The second index picks the <b>column</b>: ' + c + ' = ' + CITIES[c] + '. The distance from ' + CITIES[r] + ' to ' + CITIES[c] + ' is ' + DIST[r][c] + ' miles.', out: jd(DIST[r][c]) }
      ];
    },
    draw: function (k, s, v) {
      var r = I(v.r), c = I(v.c), items = [];
      CITIES.forEach(function (n, j) { items.push(T('ch' + j, 130 + j * 60 + 28, 22, n.slice(0, 6), { anchor: 'middle', size: 11, tone: k === 2 && j === c ? 'accent' : 'muted', bold: k === 2 && j === c })); });
      CITIES.forEach(function (n, i) { items.push(T('rh' + i, 122, 52 + i * 40, n, { anchor: 'end', size: 11.5, tone: k >= 1 && i === r ? 'accent' : 'muted', bold: k >= 1 && i === r })); });
      DIST.forEach(function (row, i) { row.forEach(function (d, j) {
        var on = k === 2 && i === r && j === c, inRow = k >= 1 && i === r;
        items.push(B('d' + i + '_' + j, 130 + j * 60, 30 + i * 40, 57, 36, { title: String(d), mono: true, size: 12, r: 3, tone: on ? 'accent' : inRow ? 'teal' : k === 2 && j === c ? 'teal' : 'blue', hi: on }));
      }); });
      return items;
    }
  };

  /* ---------- 2. create, assign, lengths (slides 3-5) ---------- */
  function zeros(r, c) { var m = []; for (var i = 0; i < r; i++) { m.push([]); for (var j = 0; j < c; j++) m[i].push(0); } return m; }
  var create2d = {
    id: 'create2d', slides: [3, 5], title: 'Rows first, then columns',
    inputs: [{ id: 'r', label: 'rows', value: 5, min: 1, max: 6 }, { id: 'c', label: 'columns', value: 5, min: 1, max: 6 }],
    presets: [{ label: '5 × 5 (slide)', values: { r: 5, c: 5 } }, { label: '3 × 4', values: { r: 3, c: 4 } }, { label: '1 × 6', values: { r: 1, c: 6 } }],
    code: function (v) { var r = I(v.r), c = I(v.c); return 'int[][] matrix = new int[' + r + '][' + c + '];\nmatrix[' + Math.min(2, r - 1) + '][' + Math.min(1, c - 1) + '] = 7;\nSystem.out.println(matrix.length);\nSystem.out.println(matrix[0].length);\n\nfor (int i = 0; i < matrix.length; i++)\n  for (int j = 0; j < matrix[i].length; j++)\n    matrix[i][j] = (int)(Math.random() * 1000);'; },
    steps: function (v) {
      var r = I(v.r), c = I(v.c), ri = Math.min(2, r - 1), cj = Math.min(1, c - 1), rnd = zeros(r, c).map(function (row) { return row.map(function () { return Math.floor(Math.random() * 1000); }); });
      return [
        { slide: 3, line: 1, ph: 'new', cap: '<code>new int[' + r + '][' + c + ']</code>: the first number is the number of <b>rows</b>, the second the number of <b>columns</b>. All elements start at 0. (<code>int matrix[][]</code> is also allowed.)' },
        { slide: 4, line: 2, ph: 'set', ri: ri, cj: cj, cap: '<code>matrix[' + ri + '][' + cj + '] = 7;</code> row ' + ri + ', column ' + cj + '.' },
        { slide: 4, line: 3, ph: 'rows', ri: ri, cj: cj, cap: '<code>matrix.length</code> is the number of <b>rows</b>: ' + r + '.', out: String(r) },
        { slide: 4, line: 4, ph: 'cols', ri: ri, cj: cj, cap: '<code>matrix[0].length</code> is the length of row 0: the number of <b>columns</b>, ' + c + '.', out: String(c) },
        { slide: 5, line: '6-8', ph: 'rnd', rnd: rnd, cap: 'A nested loop visits every element: the outer loop goes over the rows, the inner loop over the columns of that row. Here each element gets a random int from 0 to 999.' }
      ];
    },
    draw: function (k, s, v) {
      var r = I(v.r), c = I(v.c), m = s.rnd || zeros(r, c);
      if (s.ri != null) m[s.ri][s.cj] = 7;
      var cw = Math.min(60, Math.floor(400 / c)), ch = Math.min(40, Math.floor(250 / r));
      var items = grid('g', 80, 44, m, { cw: cw, ch: ch, rowOn: s.ph === 'set' ? s.ri : null, colOn: s.ph === 'set' ? s.cj : null, tone: function (i, j) { return s.ph === 'set' && i === s.ri && j === s.cj ? 'accent' : s.ph === 'rows' && j === 0 ? 'accent' : s.ph === 'cols' && i === 0 ? 'accent' : s.ph === 'rnd' ? 'teal' : 'blue'; } });
      if (s.ph === 'rows') items.push(T('rl', 80 + c * cw + 10, 44 + r * ch / 2, 'length = ' + r, { mono: true, size: 13, bold: true, tone: 'accent' }));
      if (s.ph === 'cols') items.push(T('cl', 80, 44 + r * ch + 20, 'matrix[0].length = ' + c, { mono: true, size: 13, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 3. initializers (slides 6-7) ---------- */
  var A43 = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]];
  var init2d = {
    id: 'init2d', slides: [6, 7], title: 'Each inner {...} is one row',
    code: 'int[][] array = {\n  {1, 2, 3},\n  {4, 5, 6},\n  {7, 8, 9},\n  {10, 11, 12}\n};\n\n// Same as\nint[][] array = new int[4][3];\narray[0][0] = 1; array[0][1] = 2; array[0][2] = 3;\narray[1][0] = 4; array[1][1] = 5; array[1][2] = 6;\narray[2][0] = 7; array[2][1] = 8; array[2][2] = 9;\narray[3][0] = 10; array[3][1] = 11; array[3][2] = 12;',
    steps: [
      { slide: 6, rows: 0, cap: 'Slide 6 writes the whole distance table as one initializer. Here is a smaller one: an array initializer in braces, with one inner pair of braces for each row.' },
      { slide: 7, line: 2, rows: 1, cap: '<code>{1, 2, 3}</code> becomes row 0.' },
      { slide: 7, line: 3, rows: 2, cap: '<code>{4, 5, 6}</code> becomes row 1.' },
      { slide: 7, line: '4-5', rows: 4, cap: 'And so on: 4 rows, 3 columns. So array.length is 4 and array[0].length is 3.' },
      { slide: 7, line: '9-13', rows: 4, same: true, cap: 'It is the same as creating a 4 × 3 array and assigning the 12 elements one by one.' }
    ],
    draw: function (k, s) {
      var m = A43.map(function (r, i) { return i < s.rows ? r : [null, null, null]; });
      return grid('g', 180, 60, m, { cw: 60, ch: 50, tone: function (i) { return i === s.rows - 1 && !s.same ? 'accent' : i < s.rows ? 'teal' : 'muted'; } });
    }
  };

  /* ---------- 4. ragged arrays (slides 8-9) ---------- */
  var TRI = [[1, 2, 3, 4, 5], [2, 3, 4, 5], [3, 4, 5], [4, 5], [5]];
  var ragged = {
    id: 'ragged', slides: [8, 9], title: 'Rows of different lengths',
    code: 'int[][] matrix = {\n  {1, 2, 3, 4, 5},\n  {2, 3, 4, 5},\n  {3, 4, 5},\n  {4, 5},\n  {5}\n};\nSystem.out.println(matrix.length);\nSystem.out.println(matrix[3].length);',
    steps: [
      { slide: 8, line: '1-7', ph: 'grid', cap: 'Each row of a two-dimensional array is <b>itself an array</b>, so the rows can have different lengths. This is a <b>ragged array</b>.' },
      { slide: 8, line: 8, ph: 'len', cap: 'matrix.length is 5 (five rows).', out: '5' },
      { slide: 8, line: 9, ph: 'row3', cap: 'matrix[3].length is 2. The rows have lengths 5, 4, 3, 2, 1.', out: '2' },
      { slide: 9, ph: 'refs', cap: 'How it is stored: matrix refers to an array of 5 <b>references</b>; each one refers to a row array. That is why rows can differ.' }
    ],
    draw: function (k, s) {
      if (s.ph === 'refs') {
        var items = [B('ref', 20, 120, 110, 44, { tag: 'triangleArray', title: 'reference', size: 12, tone: 'teal' }), A('r0', 134, 142, 196, 100, { tone: 'teal' })];
        TRI.forEach(function (r, i) {
          items.push(B('o' + i, 200, 40 + i * 50, 70, 44, { title: '●', size: 14, tone: 'blue', r: 2 }));
          items.push(A('a' + i, 262, 62 + i * 50, 316, 62 + i * 50, { tone: 'blue' }));
          r.forEach(function (v, j) { items.push(B('c' + i + '_' + j, 320 + j * 44, 42 + i * 50, 41, 40, { title: String(v), mono: true, size: 14, tone: 'accent', r: 2 })); });
        });
        return items;
      }
      return grid('g', 120, 50, TRI, { cw: 56, ch: 46, rowOn: s.ph === 'row3' ? 3 : null, tone: function (i) { return s.ph === 'row3' && i === 3 ? 'accent' : s.ph === 'len' ? 'teal' : 'blue'; } });
    }
  };

  /* ---------- 5. processing two-dimensional arrays (slides 10-15) ---------- */
  var P2 = 'java.util.Scanner input = new Scanner(System.in);\nSystem.out.println("Enter " + matrix.length + " rows and " +\n  matrix[0].length + " columns: ");\nfor (int row = 0; row < matrix.length; row++) {\n  for (int column = 0; column < matrix[row].length; column++) {\n    matrix[row][column] = input.nextInt();\n  }\n}\n\nfor (int row = 0; row < matrix.length; row++) {\n  for (int column = 0; column < matrix[row].length; column++) {\n    System.out.print(matrix[row][column] + " ");\n  }\n  System.out.println();\n}\n\nint total = 0;\nfor (int row = 0; row < matrix.length; row++) {\n  for (int column = 0; column < matrix[row].length; column++) {\n    total += matrix[row][column];\n  }\n}\n\nfor (int column = 0; column < matrix[0].length; column++) {\n  int total = 0;\n  for (int row = 0; row < matrix.length; row++)\n    total += matrix[row][column];\n  System.out.println("Sum for column " + column + " is "\n    + total);\n}';
  var proc2d = {
    id: 'proc2d', slides: [10, 15], title: 'Nested loops over rows and columns', code: P2,
    inputs: [{ id: 'm', type: 'text', label: 'matrix (rows split by ;)', value: '1 2 3 4; 5 6 7 8; 9 10 11 12', maxlen: 60 }],
    presets: [{ label: '3 × 4', values: { m: '1 2 3 4; 5 6 7 8; 9 10 11 12' } }, { label: '2 × 2', values: { m: '5 -1; 2 0' } }, { label: '1 row', values: { m: '7 8 9' } }],
    steps: function (v) {
      var M = parseM(v.m, 4, 6), R = M.length, C = M[0].length, st = [];
      M = M.map(function (r) { var x = r.slice(0, C); while (x.length < C) x.push(0); return x; });
      st.push({ slide: 10, M: M, ph: 'all', cap: 'Processing a two-dimensional array: the same jobs as before (fill, print, sum, …), but with a loop <b>inside</b> a loop: rows outside, columns inside.' });
      st.push({ slide: 11, line: '1-8', M: M, ph: 'fill', cap: 'Read the values row by row: row 0 from left to right, then row 1, and so on.', out: ['Enter ' + R + ' rows and ' + C + ' columns: ', M.map(function (r) { return r.join(' '); }).join(' ')] });
      st.push({ slide: 12, M: M.map(function (r) { return r.map(function () { return Math.floor(Math.random() * 100); }); }), ph: 'rnd', cap: 'With random values instead: <code>matrix[row][column] = (int)(Math.random() * 100);</code> (Below we go on with the typed values.)' });
      st.push({ slide: 13, line: '10-15', M: M, ph: 'print', cap: 'Print: after each row, <code>println()</code> ends the line, so the output looks like a table.', out: M.map(function (r) { return r.join(' ') + ' '; }) });
      var tot = 0;
      M.forEach(function (r, i) { r.forEach(function (x) { tot += x; }); st.push({ slide: 14, line: '17-22', M: M, ph: 'sum', row: i, total: tot, cap: 'After row ' + i + ': total = ' + tot + '.' + (i === R - 1 ? ' That is the sum of all elements.' : '') }); });
      for (var c = 0; c < C; c++) { var t = 0; M.forEach(function (r) { t += r[c]; }); st.push({ slide: 15, line: '24-30', M: M, ph: 'col', col: c, total: t, cap: 'Now the <b>outer</b> loop is over the columns. Column ' + c + ': ' + M.map(function (r) { return r[c]; }).join(' + ') + ' = ' + t + '.', out: 'Sum for column ' + c + ' is ' + t }); }
      return st;
    },
    draw: function (k, s) {
      var R = s.M.length, C = s.M[0].length, cw = Math.min(56, Math.floor(380 / C)), items = grid('g', 60, 40, s.M, { cw: cw, ch: 40, rowOn: s.row, colOn: s.col, tone: function (i, j) { return s.ph === 'fill' || s.ph === 'print' ? 'teal' : s.ph === 'rnd' ? 'muted' : s.ph === 'sum' ? (i === s.row ? 'accent' : i < s.row ? 'teal' : 'blue') : s.ph === 'col' ? (j === s.col ? 'accent' : 'blue') : 'blue'; } });
      if (s.total != null) items.push(vbox('tot', 60, 60 + R * 40, 160, 'total', 'int', s.total, hot()));
      return items;
    }
  };

  /* ---------- 6. random shuffling (slide 16) ---------- */
  var SH2 = 'for (int i = 0; i < matrix.length; i++) {\n  for (int j = 0; j < matrix[i].length; j++) {\n    int i1 = (int)(Math.random() * matrix.length);\n    int j1 = (int)(Math.random() * matrix[i].length);\n    // Swap matrix[i][j] with matrix[i1][j1]\n    int temp = matrix[i][j];\n    matrix[i][j] = matrix[i1][j1];\n    matrix[i1][j1] = temp;\n  }\n}';
  var shuffle2d = {
    id: 'shuffle2d', slides: [16, 16], title: 'Swap each element with a random one', code: SH2,
    steps: function () {
      var M = [[1, 2, 3], [4, 5, 6], [7, 8, 9]], st = [{ M: M.map(function (r) { return r.slice(); }), cap: 'A 3 × 3 matrix. For every element [i][j], pick a random row i1 and a random column j1, and swap.' }];
      for (var i = 0; i < 3; i++) for (var j = 0; j < 3; j++) {
        var i1 = Math.floor(Math.random() * 3), j1 = Math.floor(Math.random() * 3), t = M[i][j];
        M[i][j] = M[i1][j1]; M[i1][j1] = t;
        if (i === 0 || (i === 2 && j === 2)) st.push({ line: '3-8', M: M.map(function (r) { return r.slice(); }), a: [i, j], b: [i1, j1], cap: '[' + i + '][' + j + '] is swapped with the random [' + i1 + '][' + j1 + '].' + (i === 0 && j === 2 ? ' … The loops go on the same way for rows 1 and 2.' : '') });
      }
      st.push({ M: M, cap: 'The result is mixed. The random numbers are new each time the drawing is built.' });
      return st;
    },
    draw: function (k, s) {
      var items = grid('g', 200, 60, s.M, { cw: 60, ch: 60, tone: function (i, j) { return s.a && i === s.a[0] && j === s.a[1] ? 'accent' : s.b && i === s.b[0] && j === s.b[1] ? 'teal' : 'blue'; } });
      if (s.a && (s.a[0] !== s.b[0] || s.a[1] !== s.b[1])) items.push(A('sw', 228 + s.a[1] * 60, 88 + s.a[0] * 60, 228 + s.b[1] * 60, 88 + s.b[0] * 60, { tone: 'accent', bend: 30 }));
      return items;
    }
  };

  /* ---------- 7. passing a 2D array to a method (slide 17) ---------- */
  var PASS2 = 'import java.util.Scanner;\n\npublic class PassTwoDimensionalArray {\n  public static void main(String[] args) {\n    int[][] m = getArray(); // Get an array\n\n    // Display sum of elements\n    System.out.println("\\nSum of all elements is " + sum(m));\n  }\n\n  public static int[][] getArray() {\n    // Create a Scanner\n    Scanner input = new Scanner(System.in);\n\n    // Enter array values\n    int[][] m = new int[3][4];\n    System.out.println("Enter " + m.length + " rows and "\n      + m[0].length + " columns: ");\n    for (int i = 0; i < m.length; i++)\n      for (int j = 0; j < m[i].length; j++)\n        m[i][j] = input.nextInt();\n\n    return m;\n  }\n\n  public static int sum(int[][] m) {\n    int total = 0;\n    for (int row = 0; row < m.length; row++) {\n      for (int column = 0; column < m[row].length; column++) {\n        total += m[row][column];\n      }\n    }\n\n    return total;\n  }\n}';
  var pass2d = {
    id: 'pass2d', slides: [17, 17], title: 'A method returns a 2D array; another one gets it', code: PASS2,
    inputs: [{ id: 'm', type: 'text', label: 'the 12 numbers typed', value: '1 2 3 4 5 6 7 8 9 10 11 12', maxlen: 60 }],
    presets: [{ label: '1 to 12', values: { m: '1 2 3 4 5 6 7 8 9 10 11 12' } }, { label: 'all 1', values: { m: '1 1 1 1 1 1 1 1 1 1 1 1' } }],
    steps: function (v) {
      var n = (String(v.m).match(/-?\d+/g) || []).map(Number); while (n.length < 12) n.push(0);
      var M = [n.slice(0, 4), n.slice(4, 8), n.slice(8, 12)], tot = 0; n.slice(0, 12).forEach(function (x) { tot += x; });
      return [
        { line: 5, M: null, ph: 'call', cap: 'main calls getArray(). Its return type is <code>int[][]</code>: it will give back a reference to a two-dimensional array.' },
        { line: '16-21', M: M, ph: 'fill', cap: 'getArray creates a 3 × 4 array and reads 12 numbers into it, row by row.', out: ['Enter 3 rows and 4 columns: ', n.slice(0, 12).join(' ')] },
        { line: '23,5', M: M, ph: 'ret', cap: 'It returns the reference, and main stores it in its own m.' },
        { line: '26-34', M: M, ph: 'sum', total: tot, cap: 'sum(m) gets the reference as its parameter, adds every element with nested loops, and returns ' + tot + '.' },
        { line: 8, M: M, ph: 'out', total: tot, cap: 'The \\n starts with an empty line, then the result.', out: ['', 'Sum of all elements is ' + tot] }
      ];
    },
    draw: function (k, s) {
      var items = [B('main', 20, 40, 150, 60, { tag: 'main', title: s.ph === 'call' ? 'm = getArray()…' : 'int[][] m', mono: true, size: 13, tone: 'blue' })];
      if (s.M) {
        items.push(grid('g', 270, 50, s.M, { cw: 56, ch: 40, tone: function () { return s.ph === 'fill' ? 'accent' : s.ph === 'sum' ? 'teal' : 'blue'; } }));
        items.push(A('mr', 172, 70, 262, 70, { tone: s.ph === 'ret' ? 'accent' : 'teal', label: s.ph === 'ret' ? 'return m' : '' }));
      }
      if (s.ph === 'sum' || s.ph === 'out') items.push(B('sm', 20, 200, 150, 60, { tag: 'sum(int[][] m)', title: 'total = ' + s.total, mono: true, size: 13, tone: 'accent', hi: s.ph === 'sum' }), A('sr', 172, 230, 262, 160, { tone: 'accent', dash: true }));
      return items;
    }
  };

  /* ---------- 8. three-dimensional arrays (slides 18-20) ---------- */
  var SC = [[[7.5, 20.5], [9.0, 22.5], [15, 33.5], [13, 21.5], [15, 2.5]], [[4.5, 21.5], [9.0, 22.5], [15, 34.5], [12, 20.5], [14, 9.5]], [[6.5, 30.5], [9.4, 10.5], [11, 33.5], [11, 23.5], [10, 2.5]], [[6.5, 23.5], [9.4, 32.5], [13, 34.5], [11, 20.5], [16, 7.5]], [[8.5, 26.5], [9.4, 52.5], [13, 36.5], [13, 24.5], [16, 2.5]], [[9.5, 20.5], [9.4, 42.5], [13, 31.5], [12, 20.5], [16, 6.5]]];
  function totalOf(i) { var t = 0; SC[i].forEach(function (e) { t += e[0]; t += e[1]; }); return t; }
  var threeD = {
    id: 'threeD', slides: [18, 20], title: 'scores[student][exam][part]',
    inputs: [{ id: 'i', label: 'student i', value: 0, min: 0, max: 5 }, { id: 'j', label: 'exam j', value: 2, min: 0, max: 4 }, { id: 'k', label: 'part k', value: 1, min: 0, max: 1 }],
    presets: [{ label: '[0][2][1]', values: { i: 0, j: 2, k: 1 } }, { label: '[4][1][1]', values: { i: 4, j: 1, k: 1 } }, { label: '[5][0][0]', values: { i: 5, j: 0, k: 0 } }],
    code: function (v) { return 'double[][][] scores = { ... };  // 6 students, 5 exams, 2 parts\nSystem.out.println(scores[' + I(v.i) + '][' + I(v.j) + '][' + I(v.k) + ']);\n\nfor (int i = 0; i < scores.length; i++) {\n  double totalScore = 0;\n  for (int j = 0; j < scores[i].length; j++)\n    for (int k = 0; k < scores[i][j].length; k++)\n      totalScore += scores[i][j][k];\n  System.out.println("Student " + i + "\'s score is " + totalScore);\n}'; },
    steps: function (v) {
      var i = I(v.i), j = I(v.j), k = I(v.k), x = SC[i][j][k];
      return [
        { slide: 18, ph: 'idea', cap: 'Java allows arrays with any number of dimensions. A three-dimensional array is an array of two-dimensional arrays.' },
        { slide: 19, line: 2, ph: 'i', cap: 'The first index picks the <b>student</b>: scores[' + i + '] is the 5 × 2 table of student ' + i + '.' },
        { slide: 19, line: 2, ph: 'j', cap: 'The second picks the <b>exam</b>: scores[' + i + '][' + j + '] is a row of 2 parts.' },
        { slide: 19, line: 2, ph: 'k', cap: 'The third picks the <b>part</b>: 0 = multiple-choice, 1 = programming (essay). scores[' + i + '][' + j + '][' + k + '] = ' + jd(x) + '.', out: jd(x) },
        { slide: 20, line: '4-10', ph: 'tot', cap: 'TotalScore: three nested loops add all parts of all exams for each student. (The slide says 7 students; the data of slide 19 has 6 rows.)', out: SC.map(function (s, n) { return 'Student ' + n + "'s score is " + jd(totalOf(n)); }) }
      ];
    },
    draw: function (k, s, v) {
      var i = I(v.i), j = I(v.j), kk = I(v.k), items = [];
      if (s.ph === 'tot') {
        SC.forEach(function (st, n) { items.push(B('t' + n, 120, 20 + n * 50, 320, 40, { title: 'Student ' + n + ': ' + jd(totalOf(n)), mono: true, size: 14, tone: 'teal' })); });
        return items;
      }
      SC.forEach(function (st, n) { items.push(B('s' + n, 20, 20 + n * 50, 100, 40, { title: 'student ' + n, mono: true, size: 12, tone: s.ph !== 'idea' && n === i ? 'accent' : 'blue', hi: s.ph === 'i' && n === i })); });
      if (s.ph !== 'idea') {
        items.push(A('sel', 124, 40 + i * 50, 196, 90, { tone: 'accent' }));
        items.push(T('ph0', 266, 52, 'multiple-choice', { anchor: 'middle', size: 11, tone: s.ph === 'k' && kk === 0 ? 'accent' : 'muted', bold: s.ph === 'k' && kk === 0 }), T('ph1', 366, 52, 'programming', { anchor: 'middle', size: 11, tone: s.ph === 'k' && kk === 1 ? 'accent' : 'muted', bold: s.ph === 'k' && kk === 1 }));
        items.push(grid('g', 216, 64, SC[i].map(function (e) { return e.map(jd); }), { cw: 100, ch: 44, heads: false, rowOn: s.ph === 'j' || s.ph === 'k' ? j : null, tone: function (a, b) { return (s.ph === 'k' && a === j && b === kk) ? 'accent' : (s.ph === 'j' || s.ph === 'k') && a === j ? 'teal' : 'blue'; }, hot: function (a, b) { return s.ph === 'k' && a === j && b === kk; } }));
        items.push(T('ex', 470, 80, 'rows = exams', { size: 12, tone: 'muted' }));
      }
      return items;
    }
  };

  var ALL = [distance, create2d, init2d, ragged, proc2d, shuffle2d, pass2d, threeD];
  var para = function (t) { return { type: 'paragraph', text: t }; }, bul = function (t) { return { type: 'bullet', text: t, level: 0 }; },
    code = function (t, lang) { return lang ? { type: 'code', text: t, lang: lang } : { type: 'code', text: t }; }, note = function (t) { return { type: 'note', text: t }; };
  function braces(c) { var o = (c.match(/\{/g) || []).length, z = (c.match(/\}/g) || []).length; return o >= 2 && o === z; }
  function tbl(head, rows) { return { type: 'html', html: '<div class="tblwrap"><table><tr>' + head.map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr>' + rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table></div>' }; }

  addUnit({
    course: 'cs1', lesson: '09-multidimensional-arrays',
    blurb: 'Tables and grids: two-dimensional arrays with rows and columns, ragged arrays, nested loops over them, and arrays with three dimensions.',
    parts: [
      {
        title: 'Two-dimensional arrays', from: 1, to: 9,
        quiz: [
          { q: 'In <code>new int[3][5]</code>, what is 3?', options: ['The number of rows', 'The number of columns', 'The last index'], answer: 0, why: 'Rows first, then columns (slide 3).' },
          { type: 'output', q: 'What does this print?', code: 'int[][] m = new int[3][5];\nSystem.out.println(m.length + " " + m[0].length);', answer: '3 5', why: 'm.length is the rows; m[0].length the columns of row 0 (slide 4).' },
          { type: 'output', q: 'What does this print?', code: 'int[][] a = {\n  {1, 2, 3},\n  {4, 5, 6}\n};\nSystem.out.println(a[1][2]);', answer: '6', why: 'Row 1 is {4, 5, 6}; column 2 is 6.' },
          { type: 'output', q: 'What does this print?', code: 'int[][] t = {\n  {1, 2, 3},\n  {4, 5},\n  {6}\n};\nSystem.out.println(t[1].length + " " + t.length);', answer: '2 3', why: 'A ragged array: row 1 has 2 elements, and there are 3 rows (slide 8).' },
          { type: 'tf', q: 'Each row of a two-dimensional array is itself an array.', answer: true, why: 'That is why ragged arrays are possible (slides 8-9).' }
        ]
      },
      {
        title: 'Processing and passing', from: 10, to: 17,
        quiz: [
          { type: 'output', q: 'What does this print?', code: 'int[][] m = {{1, 2}, {3, 4}};\nint total = 0;\nfor (int row = 0; row < m.length; row++)\n  for (int column = 0; column < m[row].length; column++)\n    total += m[row][column];\nSystem.out.println(total);', answer: '10', why: '1 + 2 + 3 + 4 (slide 14).' },
          { type: 'output', q: 'What does this print?', code: 'int[][] m = {{1, 2}, {3, 4}};\nfor (int row = 0; row < m.length; row++) {\n  for (int column = 0; column < m[row].length; column++)\n    System.out.print(m[row][column] + " ");\n  System.out.println();\n}', answer: '1 2\n3 4', why: 'println() after each row (slide 13). (Each line also ends with a space.)' },
          { type: 'output', q: 'Summing by column (slide 15). What is printed for column 1?', code: 'int[][] m = {{1, 2}, {3, 4}, {5, 6}};\n// Sum for column 1 is ?', answer: 'Sum for column 1 is 12', why: '2 + 4 + 6.' },
          { q: 'What is the return type of getArray in slide 17?', options: ['int[][]', 'int[]', 'void'], answer: 0, why: 'It returns a reference to a two-dimensional array.' },
          { type: 'fill', q: 'Loop over the columns of row i.', code: 'for (int j = 0; j < matrix[i].___; j++)', answer: ['length'], why: 'matrix[i].length works for ragged arrays too.' }
        ]
      },
      {
        title: 'More dimensions', from: 18, to: 20,
        quiz: [
          { q: 'In <code>scores[i][j][k]</code> of slide 19, what is j?', options: ['Which exam', 'Which student', 'Which part'], answer: 0, why: 'Student, exam, then part.' },
          { type: 'output', q: 'With the data of slide 19, what does this print?', code: 'System.out.println(scores[0][0][1]);', answer: '20.5', why: 'Student 0, exam 0, part 1: {7.5, 20.5}.' },
          { type: 'output', q: 'What does this print?', code: 'double[][][] d = new double[2][3][4];\nSystem.out.println(d.length + " " + d[0].length + " " + d[0][0].length);', answer: '2 3 4', why: 'Each dimension has its own length.' }
        ]
      }
    ],
    slides: {
      1: { cover: true, image: false, title: '', blocks: [para('Chapter 8'), para('Multidimensional Arrays'), note('An adapted version of the lecture notes associated with the textbook')],
        explain: '<p>So far an array was one row of values. Now: <b>{{two-dimensional|ثنائي الأبعاد}}</b> arrays for tables, with rows and columns.</p>' },
      2: { image: false, title: 'Motivation: can we use a single dimensional array to represent a matrix or a table?', blocks: [para('Distance Table (in miles)'), tbl([''].concat(CITIES), DIST.map(function (r, i) { return [CITIES[i]].concat(r.map(String)); }))],
        explain: '<p>A <b>{{matrix|مصفوفة ثنائية: جدول}}</b> or table needs a row and a column to find a value. One index is not enough, so Java has arrays with two indexes.</p>' },
      3: { image: false, title: 'Declare/Create Two-dimensional Arrays', blocks: [code('// Declare array ref var\ndataType[][] refVar;\n\n// Create array and assign its reference to variable\nrefVar = new dataType[10][10];\n\n// Combine declaration and creation in one statement\ndataType[][] refVar = new dataType[10][10];\n\n// Alternative syntax\ndataType refVar[][] = new dataType[10][10];', 'none')],
        explain: '<p>Two pairs of brackets: <code>[][]</code>. The same steps as before: declare, create, or both in one line.</p>' },
      4: { image: false, blocks: [code('matrix = new int[5][5];'), code('matrix[2][1] = 7;'), code('int[][] array = {\n  {1, 2, 3},\n  {4, 5, 6},\n  {7, 8, 9},\n  {10, 11, 12}\n};'), para('matrix.length? 5    matrix[0].length? 5'), para('array.length? 4    array[0].length? 3')],
        explain: '<p><code>matrix[2][1]</code> is row 2, column 1. <code>matrix.length</code> counts the <b>rows</b>; <code>matrix[0].length</code> counts the elements of one row, the <b>columns</b>.</p>' },
      5: { image: false, title: 'Declaring and Creating Two-dimensional Arrays', blocks: [code('int[][] matrix = new int[10][10];'), para('or'), code('int matrix[][] = new int[10][10];\nmatrix[0][0] = 3;'), code('for (int i = 0; i < matrix.length; i++)\n  for (int j = 0; j < matrix[i].length; j++)\n    matrix[i][j] = (int)(Math.random() * 1000);'), code('double[][] x;')],
        explain: '<p>To visit every element, use <b>{{nested loops|حلقات متداخلة}}</b>: one for the rows, one inside it for the columns.</p>' },
      6: { image: false, title: 'Declaring, Creating and initializing Two-dimensional Arrays', blocks: [code('double[][] distances = {\n  {0, 983, 787, 714, 1375, 967, 1087},\n  {983, 0, 214, 1102, 1763, 1723, 1842},\n  {787, 214, 0, 888, 1549, 1548, 1627},\n  {714, 1102, 888, 0, 661, 781, 810},\n  {1375, 1763, 1549, 661, 0, 1426, 1187},\n  {967, 1723, 1548, 781, 1426, 0, 239},\n  {1087, 1842, 1627, 810, 1187, 239, 0},\n};')],
        explain: '<p>The distance table of slide 2 as one initializer. (The comma after the last row is allowed in Java.)</p>' },
      7: { image: false, title: 'Declaring, Creating, and Initializing Using Shorthand Notations', blocks: [para('You can also use an array initializer to declare, create and initialize a two-dimensional array. For example,'), code('int[][] array = {\n  {1, 2, 3},\n  {4, 5, 6},\n  {7, 8, 9},\n  {10, 11, 12}\n};'), note('Same as'), code('int[][] array = new int[4][3];\narray[0][0] = 1; array[0][1] = 2; array[0][2] = 3;\narray[1][0] = 4; array[1][1] = 5; array[1][2] = 6;\narray[2][0] = 7; array[2][1] = 8; array[2][2] = 9;\narray[3][0] = 10; array[3][1] = 11; array[3][2] = 12;')],
        explain: '<p>Each inner pair of braces is one row. Java counts the rows and the values in a row to find the sizes.</p>' },
      8: { image: false, blocks: [para('Each row in a two-dimensional array is itself an array. So, the rows can have different lengths. Such an array is known as a ragged array. For example,'), code('int[][] matrix = {\n  {1, 2, 3, 4, 5},\n  {2, 3, 4, 5},\n  {3, 4, 5},\n  {4, 5},\n  {5}\n};'), note('matrix.length is 5, matrix[0].length is 5, matrix[1].length is 4, matrix[2].length is 3, matrix[3].length is 2, matrix[4].length is 1')],
        explain: '<p>A <b>{{ragged array|مصفوفة غير منتظمة: صفوف بأطوال مختلفة}}</b> has rows of different lengths. Loops must use <code>matrix[i].length</code>, not one fixed number.</p>' },
      9: { image: false, title: 'Ragged Arrays, cont.', blocks: [code('int[][] triangleArray = {\n  {1, 2, 3, 4, 5},\n  {2, 3, 4, 5},\n  {3, 4, 5},\n  {4, 5},\n  {5}\n};')],
        explain: '<p>The picture on the slide: an array of references, each pointing to a row array of its own length.</p>' },
      10: { image: false, blocks: [para('Examples:'), para('1. (Initializing arrays with input values)'), para('2. (Printing arrays)'), para('3. (Summing all elements)'), para('4. (Summing all elements by column)'), para('5. (Which row has the largest sum)'), para('6. (Finding the smallest index of the largest element)'), para('7. (Random shuffling)')],
        explain: '<p>The same jobs as for one-dimensional arrays, now with two loops. The next slides show some of them.</p>' },
      11: { image: false, blocks: [code('java.util.Scanner input = new Scanner(System.in);\nSystem.out.println("Enter " + matrix.length + " rows and " +\n  matrix[0].length + " columns: ");\nfor (int row = 0; row < matrix.length; row++) {\n  for (int column = 0; column < matrix[row].length; column++) {\n    matrix[row][column] = input.nextInt();\n  }\n}')],
        explain: '<p>The numbers are read <b>row by row</b>. (The slide declares <code>java.util.Scanner</code> but writes <code>new Scanner</code>; that needs an import of java.util.Scanner.)</p>' },
      12: { image: false, blocks: [code('for (int row = 0; row < matrix.length; row++) {\n  for (int column = 0; column < matrix[row].length; column++) {\n    matrix[row][column] = (int)(Math.random() * 100);\n  }\n}')],
        explain: '<p>Random ints from 0 to 99 in every element.</p>' },
      13: { image: false, blocks: [code('for (int row = 0; row < matrix.length; row++) {\n  for (int column = 0; column < matrix[row].length; column++) {\n    System.out.print(matrix[row][column] + " ");\n  }\n\n  System.out.println();\n}')],
        explain: '<p>print inside the row, println() after the row: the output has the shape of the table.</p>' },
      14: { image: false, blocks: [code('int total = 0;\nfor (int row = 0; row < matrix.length; row++) {\n  for (int column = 0; column < matrix[row].length; column++) {\n    total += matrix[row][column];\n  }\n}')],
        explain: '<p>One total for the whole table.</p>' },
      15: { image: false, blocks: [code('for (int column = 0; column < matrix[0].length; column++) {\n  int total = 0;\n  for (int row = 0; row < matrix.length; row++)\n    total += matrix[row][column];\n  System.out.println("Sum for column " + column + " is "\n    + total);\n}')],
        explain: '<p>Here the loops are <b>swapped</b>: the outer loop goes over the columns, the inner over the rows. total starts again at 0 for each column.</p>' },
      16: { image: false, blocks: [code(SH2)],
        explain: '<p>Each element is swapped with an element at a random row i1 and random column j1.</p>' },
      17: { image: false, blocks: [code(PASS2)],
        explain: '<p>A two-dimensional array can be returned (<code>int[][] getArray()</code>) and passed (<code>sum(int[][] m)</code>), just like a one-dimensional one: what moves is the reference.</p>' },
      18: { image: false, blocks: [para('Occasionally, you will need to represent n- dimensional data structures. In Java, you can create n-dimensional arrays for any integer n.'), para('The way to declare two-dimensional array variables and create two-dimensional arrays can be generalized to declare n-dimensional array variables and create n-dimensional arrays for n >= 3.')],
        explain: '<p>A three-dimensional array has three indexes: <code>[][][]</code>.</p>' },
      19: { image: false, blocks: [code('double[][][] scores = {\n  {{7.5, 20.5}, {9.0, 22.5}, {15, 33.5}, {13, 21.5}, {15, 2.5}},\n  {{4.5, 21.5}, {9.0, 22.5}, {15, 34.5}, {12, 20.5}, {14, 9.5}},\n  {{6.5, 30.5}, {9.4, 10.5}, {11, 33.5}, {11, 23.5}, {10, 2.5}},\n  {{6.5, 23.5}, {9.4, 32.5}, {13, 34.5}, {11, 20.5}, {16, 7.5}},\n  {{8.5, 26.5}, {9.4, 52.5}, {13, 36.5}, {13, 24.5}, {16, 2.5}},\n  {{9.5, 20.5}, {9.4, 42.5}, {13, 31.5}, {12, 20.5}, {16, 6.5}}};'), code('scores[ i ] [ j ] [ k ]\n  Which student, Which exam, Multiple-choice or essay', 'none')],
        explain: '<p>Read the indexes from the outside in: the student, then the exam, then the part of the exam.</p>' },
      20: { image: false, blocks: [para('Objective: write a program that calculates the total score for students in a class. Suppose the scores are stored in a three-dimensional array named scores. The first index in scores refers to a student, the second refers to an exam, and the third refers to the part of the exam. Suppose there are 7 students, 5 exams, and each exam has two parts--the multiple-choice part and the programming part. So, scores[i][j][0] represents the score on the multiple-choice part for the i’s student on the j’s exam. Your program displays the total score for each student.'), note('Example program: TotalScore')],
        explain: '<p>Three nested loops: students, exams, parts. The drawing shows the totals for the data of slide 19.</p>' }
    },
    visuals: ALL,
    exam: {
      questions: [
        { type: 'output', q: 'What does this print?', code: 'int[][] m = new int[4][6];\nSystem.out.println(m.length + " " + m[0].length);', answer: '4 6', review: 4, why: 'Rows, then columns.' },
        { type: 'output', q: 'What does this print?', code: 'int[][] m = new int[3][3];\nm[1][2] = 5;\nSystem.out.println(m[2][1] + " " + m[1][2]);', answer: '0 5', review: 4, why: '[1][2] and [2][1] are different elements; the others stay 0.' },
        { q: 'Which line declares and creates a 2 × 3 int array?', options: ['int[][] a = new int[2][3];', 'int[] a = new int[2][3];', 'int[][] a = new int[2, 3];'], answer: 0, review: 3, why: 'Two pairs of brackets on both sides.' },
        { type: 'output', q: 'What does this print?', code: 'int[][] a = {\n  {1, 2},\n  {3, 4},\n  {5, 6}\n};\nSystem.out.println(a[2][0] + a[0][1]);', answer: '7', review: 7, why: '5 + 2.' },
        { type: 'output', q: 'What does this print?', code: 'int[][] r = {\n  {1},\n  {1, 2, 3}\n};\nSystem.out.println(r[0].length + r[1].length);', answer: '4', review: 8, why: 'A ragged array: 1 + 3.' },
        { type: 'output', q: 'What does this print?', code: 'int[][] m = {{2, 4}, {6, 8}};\nint total = 0;\nfor (int i = 0; i < m.length; i++)\n  for (int j = 0; j < m[i].length; j++)\n    total += m[i][j];\nSystem.out.println(total);', answer: '20', review: 14, why: 'All four elements.' },
        { type: 'output', q: 'What does this print?', code: 'int[][] m = {{1, 2, 3}, {4, 5, 6}};\nfor (int c = 0; c < m[0].length; c++) {\n  int total = 0;\n  for (int r = 0; r < m.length; r++)\n    total += m[r][c];\n  System.out.print(total + " ");\n}', answer: '5 7 9', review: 15, why: 'Column sums: 1+4, 2+5, 3+6. (A space follows the 9.)' },
        { q: 'Why is <code>j < matrix[i].length</code> better than <code>j < matrix[0].length</code>?', options: ['It also works for ragged arrays', 'It is faster', 'There is no difference ever'], answer: 0, review: 8, why: 'Rows may have different lengths.' },
        { q: 'What does sum in slide 17 receive?', options: ['A reference to the 2D array', 'A copy of all the numbers', 'Only the first row'], answer: 0, review: 17, why: 'Arrays are passed as references.' },
        { type: 'output', q: 'With scores of slide 19, what does this print?', code: 'System.out.println(scores[1][2][1]);', answer: '34.5', review: 19, why: 'Student 1, exam 2, part 1: {15, 34.5}.' }
      ],
      tasks: [
        {
          title: 'Print a table',
          task: '<p>Print the 2D array <code>m</code> as a table: each row on its own line, numbers separated by a space. Use nested for loops with <code>m.length</code> and <code>m[i].length</code>.</p>',
          starter: 'public class PrintTable {\n  public static void main(String[] args) {\n    int[][] m = {{1, 2, 3}, {4, 5, 6}};\n    \n  }\n}',
          output: '1 2 3 \n4 5 6 ',
          checks: [
            { re: /for\s*\(\s*int\s+(\w+)\s*=\s*0\s*;\s*\1\s*<\s*m\.length\s*;/, label: 'Outer loop: <code>i < m.length</code>', review: 13 },
            { re: /for\s*\(\s*int\s+(\w+)\s*=\s*0\s*;\s*\1\s*<\s*m\s*\[\s*\w+\s*\]\.length\s*;/, label: 'Inner loop: <code>j < m[i].length</code>', review: 13 },
            { re: /System\.out\.print\s*\(\s*m\s*\[\s*\w+\s*\]\s*\[\s*\w+\s*\]\s*\+\s*" "\s*\)/, label: 'Prints <code>m[i][j] + " "</code>', review: 13 },
            { re: /System\.out\.println\s*\(\s*\)/, label: 'Ends each row with <code>println()</code>', review: 13 }
          ],
          solution: 'public class PrintTable {\n  public static void main(String[] args) {\n    int[][] m = {{1, 2, 3}, {4, 5, 6}};\n    for (int i = 0; i < m.length; i++) {\n      for (int j = 0; j < m[i].length; j++)\n        System.out.print(m[i][j] + " ");\n      System.out.println();\n    }\n  }\n}'
        },
        {
          title: 'Sum of each row',
          task: '<p>For each row of <code>m</code>, add its elements and print <code>Sum of row i is …</code>. The total must start again at 0 for every row.</p>',
          starter: 'public class RowSums {\n  public static void main(String[] args) {\n    int[][] m = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};\n    \n  }\n}',
          output: 'Sum of row 0 is 6\nSum of row 1 is 15\nSum of row 2 is 24',
          checks: [
            { re: /for\s*\([^)]*m\.length[^)]*\)\s*\{\s*int\s+\w+\s*=\s*0\s*;/, label: 'Inside the row loop, the total starts at 0', review: 15 },
            { re: /\w+\s*\+=\s*m\s*\[\s*\w+\s*\]\s*\[\s*\w+\s*\]/, label: 'Adds <code>m[i][j]</code>', review: 14 },
            { re: /"Sum of row "\s*\+/, label: 'Prints <code>Sum of row </code> …', review: 15 },
            { fn: braces, label: 'Braces match', review: 13 }
          ],
          solution: 'public class RowSums {\n  public static void main(String[] args) {\n    int[][] m = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};\n    for (int i = 0; i < m.length; i++) {\n      int total = 0;\n      for (int j = 0; j < m[i].length; j++)\n        total += m[i][j];\n      System.out.println("Sum of row " + i + " is " + total);\n    }\n  }\n}'
        }
      ]
    }
  });
})();
