/* CS1 · Unit 4 · Selections (42 slides): boolean, relational operators, if, if-else, multi-way if, logical operators, switch, ternary, precedence, debugging */
(function () {
  function mix(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }
  function jd(x) { return Number.isInteger(x) ? x.toFixed(1) : String(x); }
  function tf(b) { return b ? 'true' : 'false'; }
  function box(id, x, y, w, name, type, value, o) {
    return B(id, x, y, w, 48, mix({ tag: type + ' ' + name, title: value == null ? 'no value' : String(value), mono: true, size: 16, tone: value == null ? 'muted' : 'teal', dash: value == null, r: 6 }, o || {}));
  }
  function hot(o) { return mix(o || {}, { tone: 'accent', hi: true }); }
  function dia(id, x, y, w, h, text, state, o) { return B(id, x, y, w, h, mix({ shape: 'diamond', title: text, mono: true, size: 12.5, tone: state === 'on' ? 'accent' : state === 'yes' ? 'teal' : state === 'no' ? 'red' : 'blue', hi: state === 'on' }, o || {})); }
  function act(id, x, y, w, h, text, state, o) { return B(id, x, y, w, h, mix({ title: text, mono: true, size: 12, tone: state === 'on' ? 'accent' : state === 'done' ? 'teal' : state === 'skip' ? 'muted' : 'blue', hi: state === 'on', dash: state === 'skip' }, o || {})); }
  function ln(id, x1, y1, x2, y2, used, o) { return A(id, x1, y1, x2, y2, mix({ tone: used ? 'accent' : 'muted' }, o || {})); }
  function tblH(head, rows) {
    return '<div class="tblwrap"><table><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table></div>';
  }

  /* ---------- 1. relational operators (slides 2-3) ---------- */
  var REL = [['<', 'less than', function (a, b) { return a < b; }], ['<=', 'less than or equal to', function (a, b) { return a <= b; }], ['>', 'greater than', function (a, b) { return a > b; }], ['>=', 'greater than or equal to', function (a, b) { return a >= b; }], ['==', 'equal to', function (a, b) { return a === b; }], ['!=', 'not equal to', function (a, b) { return a !== b; }]];
  var relational = {
    id: 'relational', slides: [2, 3], title: 'Comparing gives true or false',
    inputs: [{ id: 'r', label: 'radius', value: 5, min: -100, max: 100 }], inputsLabel: 'radius =',
    presets: [{ label: 'Slide: 5', values: { r: 5 } }, { label: '0', values: { r: 0 } }, { label: '-3', values: { r: -3 } }],
    steps: function (v) {
      var st = [{ slide: 2, cap: '<code>boolean b = (1 > 2);</code> A comparison gives a <b>boolean</b> value. Is 1 greater than 2? No, so b is <b>false</b>.' }];
      REL.forEach(function (o) { st.push({ slide: 3, cap: '<code>radius ' + o[0] + ' 0</code> (' + o[1] + '): ' + v.r + ' ' + o[0] + ' 0 is <b>' + tf(o[2](v.r, 0)) + '</b>.' }); });
      return st;
    },
    draw: function (k, s, v) {
      var items = [];
      if (k === 0) {
        items.push(T('c', 280, 60, 'boolean b = (1 > 2);', { anchor: 'middle', mono: true, size: 18, bold: true }));
        items.push(T('q', 280, 120, 'Is 1 > 2 ?', { anchor: 'middle', size: 16 }));
        items.push(box('b', 200, 160, 160, 'b', 'boolean', 'false', hot()));
        return items;
      }
      REL.forEach(function (o, i) {
        var y = 20 + i * 52, cur = i === k - 1, shown = i < k;
        items.push(B('op' + i, 20, y, 56, 42, { title: o[0], mono: true, size: 18, tone: cur ? 'accent' : 'blue', fill: cur ? 'solid' : 'soft' }));
        items.push(T('nm' + i, 92, y + 26, o[1], { size: 13.5, tone: cur ? 'accent' : 'ink', bold: cur }));
        items.push(T('ex' + i, 300, y + 26, 'radius ' + o[0] + ' 0', { mono: true, size: 14, tone: cur ? 'accent' : 'muted' }));
        if (shown) items.push(B('rs' + i, 440, y, 100, 42, { title: tf(o[2](v.r, 0)), mono: true, size: 15, tone: o[2](v.r, 0) ? 'teal' : 'red', fill: cur ? 'solid' : 'soft' }));
      });
      return items;
    }
  };

  /* ---------- 2. AdditionQuiz (slide 4) ---------- */
  var QUIZ = 'import java.util.Scanner;\npublic class AdditionQuiz {\n public static void main(String[] args) {\n    int number1 = (int)(System.currentTimeMillis() % 10);\n    int number2 = (int)(System.currentTimeMillis() / 7 % 10);\n    Scanner input = new Scanner(System.in);\n    System.out.print(  "What is " + number1 + " + " + number2 + "? ");\n    int answer = input.nextInt();\n    Boolean result = (number1 + number2 == answer);\n    System.out.println(\n    number1 + " + " + number2 + " = " + answer + " is " + result); } }';
  var addquiz = {
    id: 'addquiz', slides: [4, 4], title: 'A simple math learning tool', code: QUIZ,
    inputs: [{ id: 'a', label: 'number1', value: 7, min: 0, max: 9 }, { id: 'b', label: 'number2', value: 9, min: 0, max: 9 }, { id: 'ans', label: 'the answer typed', value: 16, min: -99, max: 99 }],
    presets: [{ label: 'Right answer', values: { a: 7, b: 9, ans: 16 } }, { label: 'Wrong answer', values: { a: 7, b: 9, ans: 15 } }, { label: '3 + 4 = 7', values: { a: 3, b: 4, ans: 7 } }],
    steps: function (v) {
      var r = v.a + v.b === v.ans;
      return [
        { line: '4-5', cap: 'Two single-digit numbers come from the clock (the current time % 10). Here: number1 = ' + v.a + ', number2 = ' + v.b + '.' },
        { line: 7, cap: 'Ask the question.', out: 'What is ' + v.a + ' + ' + v.b + '? ' + v.ans },
        { line: 8, cap: 'The student types ' + v.ans + '. nextInt() stores it in answer.' },
        { line: 9, cap: '<code>number1 + number2 == answer</code>: ' + v.a + ' + ' + v.b + ' = ' + (v.a + v.b) + ', and ' + (v.a + v.b) + ' == ' + v.ans + ' is <b>' + tf(r) + '</b>.' },
        { line: '10-11', cap: 'Print the whole line with the result.', out: v.a + ' + ' + v.b + ' = ' + v.ans + ' is ' + tf(r) }
      ];
    },
    draw: function (k, s, v) {
      var r = v.a + v.b === v.ans;
      return [
        box('n1', 20, 30, 120, 'number1', 'int', v.a, k === 0 ? hot() : {}),
        box('n2', 160, 30, 120, 'number2', 'int', v.b, k === 0 ? hot() : {}),
        k >= 2 ? box('an', 300, 30, 120, 'answer', 'int', v.ans, k === 2 ? hot() : {}) : null,
        k >= 3 ? T('cmp', 280, 150, v.a + ' + ' + v.b + ' == ' + v.ans, { anchor: 'middle', mono: true, bold: true, size: 18, tone: 'accent' }) : null,
        k >= 3 ? box('rs', 200, 180, 160, 'result', 'Boolean', tf(r), { tone: r ? 'teal' : 'red', hi: k === 3 }) : null
      ];
    }
  };

  /* ---------- 3. one-way if (slides 5-6) ---------- */
  var oneway = {
    id: 'oneway', slides: [5, 6], title: 'One-way if', vb: [560, 360],
    inputs: [{ id: 'r', label: 'radius', value: 5, min: -100, max: 100 }],
    presets: [{ label: 'radius 5', values: { r: 5 } }, { label: 'radius -2', values: { r: -2 } }, { label: 'radius 0', values: { r: 0 } }],
    steps: function (v) {
      var ok = v.r >= 0, area = v.r * v.r * 3.14159;
      var st = [
        { slide: 5, cap: '<code>if (boolean-expression) { statement(s); }</code> The statements run <b>only if</b> the expression is true.' },
        { slide: 5, cap: 'Is radius >= 0? ' + v.r + ' >= 0 is <b>' + tf(ok) + '</b>.' }
      ];
      if (ok) st.push({ slide: 5, cap: 'True: compute the area and print it.', out: 'The area for the circle of radius ' + jd(v.r) + ' is ' + jd(area) });
      else st.push({ slide: 5, cap: 'False: <b>skip</b> the block. Nothing is printed.' });
      st.push({ slide: 6, clear: true, cap: 'Note: the condition must be inside parentheses. <code>if i > 0 {</code> is wrong; <code>if (i > 0) {</code> is correct.' });
      st.push({ slide: 6, cap: 'If the block has only <b>one</b> statement, the braces can be left out. The two forms are equivalent.' });
      return st;
    },
    draw: function (k, s, v) {
      var ok = v.r >= 0, items = [];
      if (k <= 2) {
        items.push(B('start', 255, 6, 50, 24, { shape: 'oval', tone: 'muted', title: '' }));
        items.push(ln('l0', 280, 31, 280, 48, k >= 1));
        items.push(dia('d', 180, 50, 200, 90, '(radius >= 0)', k === 1 ? 'on' : k === 2 ? (ok ? 'yes' : 'no') : ''));
        items.push(ln('lt', 280, 141, 280, 178, k === 2 && ok, { label: 'true', la: 'start', lx: 8 }));
        items.push(act('blk', 120, 180, 320, 60, 'area = radius * radius * PI;\nSystem.out.println(...);', k === 2 ? (ok ? 'on' : 'skip') : ''));
        items.push(ln('lf', 382, 95, 300, 290, k === 2 && !ok, { via: [[480, 95], [480, 290]], label: 'false', lx: 30, ly: 0 }));
        items.push(ln('lb', 280, 241, 280, 310, k === 2 && ok));
        items.push(B('end', 255, 312, 50, 24, { shape: 'oval', tone: 'muted', title: '' }));
        items.push(box('rad', 20, 60, 130, 'radius', 'double', jd(v.r), {}));
        return items;
      }
      if (k === 3) {
        items.push(B('w', 20, 40, 250, 110, { tag: '(a) Wrong', lines: ['if i > 0 {', '  System.out.println(', '    "i is positive");', '}'], mono: true, tone: 'red' }));
        items.push(B('c', 290, 40, 250, 110, { tag: '(b) Correct', lines: ['if (i > 0) {', '  System.out.println(', '    "i is positive");', '}'], mono: true, tone: 'teal', hi: true }));
        items.push(T('n', 280, 220, 'the condition needs ( )', { anchor: 'middle', bold: true, tone: 'accent' }));
        return items;
      }
      items.push(B('a', 20, 40, 250, 110, { tag: '(a) with braces', lines: ['if (i > 0) {', '  System.out.println(', '    "i is positive");', '}'], mono: true, tone: 'blue' }));
      items.push(B('b', 290, 40, 250, 92, { tag: '(b) one statement, no braces', lines: ['if (i > 0)', '  System.out.println(', '    "i is positive");'], mono: true, tone: 'blue' }));
      items.push(T('eq', 280, 220, 'equivalent', { anchor: 'middle', bold: true, tone: 'teal', size: 18 }));
      return items;
    }
  };

  /* ---------- 4. HiFive / HiEven (slide 7) ---------- */
  var hifive = {
    id: 'hifive', slides: [7, 7], title: 'Two separate if statements', code: 'if (number % 5 == 0)\n  System.out.println("HiFive");\n\nif (number % 2 == 0)\n  System.out.println("HiEven");',
    inputs: [{ id: 'n', label: 'number', value: 10, min: -999, max: 9999 }],
    presets: [{ label: '10', values: { n: 10 } }, { label: '15', values: { n: 15 } }, { label: '4', values: { n: 4 } }, { label: '7', values: { n: 7 } }],
    steps: function (v) {
      var f = v.n % 5 === 0, e = v.n % 2 === 0;
      return [
        { line: 1, cap: 'First if: ' + v.n + ' % 5 = ' + (v.n % 5) + ', so ' + v.n + ' % 5 == 0 is <b>' + tf(f) + '</b>.' },
        { line: 2, cap: f ? 'Print HiFive.' : 'Skip the println.', out: f ? 'HiFive' : undefined },
        { line: 4, cap: 'The second if is checked <b>always</b>, no matter what the first one did: ' + v.n + ' % 2 == 0 is <b>' + tf(e) + '</b>.' },
        { line: 5, cap: e ? 'Print HiEven.' : 'Skip the println.' + (!f && !e ? ' Nothing was printed at all.' : ''), out: e ? 'HiEven' : undefined }
      ];
    },
    draw: function (k, s, v) {
      var f = v.n % 5 === 0, e = v.n % 2 === 0;
      return [
        box('n', 20, 20, 130, 'number', 'int', v.n, {}),
        dia('d1', 190, 10, 180, 80, 'number % 5 == 0', k === 0 ? 'on' : k >= 1 ? (f ? 'yes' : 'no') : ''),
        act('p1', 400, 25, 140, 50, 'HiFive', k >= 1 ? (f ? (k === 1 ? 'on' : 'done') : 'skip') : ''),
        ln('a1', 372, 50, 398, 50, k >= 1 && f),
        ln('mid', 280, 92, 280, 158, k >= 2, { label: 'then, always', la: 'start', lx: 8 }),
        dia('d2', 190, 160, 180, 80, 'number % 2 == 0', k === 2 ? 'on' : k >= 3 ? (e ? 'yes' : 'no') : ''),
        act('p2', 400, 175, 140, 50, 'HiEven', k >= 3 ? (e ? 'on' : 'skip') : ''),
        ln('a2', 372, 200, 398, 200, k >= 3 && e)
      ];
    }
  };

  /* ---------- 5. two-way if (slide 8) ---------- */
  var twoway = {
    id: 'twoway', slides: [8, 8], title: 'Two-way if-else', vb: [560, 340],
    inputs: [{ id: 'r', label: 'radius', value: 5, min: -100, max: 100 }],
    presets: [{ label: 'radius 5', values: { r: 5 } }, { label: 'radius -1', values: { r: -1 } }],
    steps: function (v) {
      var ok = v.r >= 0, area = v.r * v.r * 3.14159;
      return [
        { cap: 'With <b>else</b>, there are two paths. Exactly one of them runs: never both, never none.' },
        { cap: 'Is radius >= 0? ' + v.r + ' >= 0 is <b>' + tf(ok) + '</b>.' },
        { cap: ok ? 'True: the first block runs.' : 'False: the <b>else</b> block runs.', out: ok ? 'The area for the circle of radius ' + jd(v.r) + ' is ' + jd(area) : 'Negative input' }
      ];
    },
    draw: function (k, s, v) {
      var ok = v.r >= 0;
      return [
        box('rad', 20, 20, 130, 'radius', 'double', jd(v.r), {}),
        dia('d', 180, 20, 200, 90, '(radius >= 0)', k === 1 ? 'on' : k === 2 ? (ok ? 'yes' : 'no') : ''),
        ln('lt', 180, 65, 110, 178, k === 2 && ok, { via: [[110, 65]], label: 'true', lx: -10 }),
        ln('lf', 380, 65, 450, 178, k === 2 && !ok, { via: [[450, 65]], label: 'false', lx: 10 }),
        act('t', 20, 180, 230, 70, 'area = radius * radius\n  * 3.14159;\nprintln("The area ...");', k === 2 ? (ok ? 'on' : 'skip') : '', { size: 11.5 }),
        act('f', 330, 180, 210, 70, 'println("Negative input");', k === 2 ? (!ok ? 'on' : 'skip') : '', { size: 11.5 }),
        ln('j1', 135, 252, 280, 300, k === 2 && ok, { via: [[135, 290], [280, 290]] }),
        ln('j2', 435, 252, 280, 300, k === 2 && !ok, { via: [[435, 290], [280, 290]] }),
        B('end', 255, 302, 50, 24, { shape: 'oval', tone: 'muted', title: '' })
      ];
    }
  };

  /* ---------- 6. multi-way if-else (slides 9-14) ---------- */
  var GR = [[90, 'A'], [80, 'B'], [70, 'C'], [60, 'D']];
  function gradeOf(sc) { for (var i = 0; i < GR.length; i++) if (sc >= GR[i][0]) return i; return 4; }
  var multi = {
    id: 'multi', slides: [9, 14], title: 'Multi-way if-else', vb: [560, 360],
    code: 'if (score >= 90.0)\n  System.out.print("A");\nelse if (score >= 80.0)\n  System.out.print("B");\nelse if (score >= 70.0)\n  System.out.print("C");\nelse if (score >= 60.0)\n  System.out.print("D");\nelse\n  System.out.print("F");',
    inputs: [{ id: 's', label: 'score', value: 70, min: 0, max: 100 }],
    presets: [{ label: 'Slide: 70.0', values: { s: 70 } }, { label: '95', values: { s: 95 } }, { label: '85', values: { s: 85 } }, { label: '60', values: { s: 60 } }, { label: '42', values: { s: 42 } }],
    steps: function (v) {
      var g = gradeOf(v.s), st = [{ line: '1-10', slide: 9, cap: 'The nested if-else (a) and the else-if chain (b) are <b>equivalent</b>. (b) is better: easier to read.' }];
      for (var i = 0; i <= Math.min(g, 3); i++) {
        var yes = i === g;
        st.push({ slide: [10, 11, 12, 12][i], line: 1 + i * 2, cap: 'Suppose score is ' + jd(v.s) + '. Is score >= ' + GR[i][0] + '.0? <b>' + tf(yes) + '</b>.' + (yes ? '' : ' Go to the next else if.') });
      }
      st.push({ slide: 13, line: g < 4 ? 2 + g * 2 : 10, cap: g < 4 ? 'The condition is true: print ' + GR[g][1] + '. The grade is ' + GR[g][1] + '.' : 'All conditions are false: the last <b>else</b> runs. The grade is F.', out: g < 4 ? GR[g][1] : 'F' });
      st.push({ line: '7-10', slide: 14, cap: '<b>Exit</b> the if statement. The other conditions are not checked any more.' });
      return st;
    },
    draw: function (k, s, v) {
      var g = gradeOf(v.s), items = [], checking = k - 1, done = k >= Math.min(g, 3) + 2;
      if (k === 0) {
        items.push(B('a', 10, 20, 260, 300, { tag: '(a) nested', lines: ['if (score >= 90.0) A', 'else {', '  if (score >= 80.0) B', '  else', '    if (score >= 70.0) C', '    else', '      if (score >= 60.0) D', '      else F', '}'], mono: true, lsize: 11.5, tone: 'muted' }));
        items.push(B('b', 290, 20, 260, 210, { tag: '(b) else if: better', lines: ['if (score >= 90.0) A', 'else if (score >= 80.0) B', 'else if (score >= 70.0) C', 'else if (score >= 60.0) D', 'else F'], mono: true, lsize: 11.5, tone: 'teal', hi: true }));
        return items;
      }
      GR.forEach(function (gr, i) {
        var x = 10 + i * 108, y = 10 + i * 56;
        var st = i === checking && !done ? 'on' : (i < Math.min(g, 4) && (i <= checking)) ? 'no' : (i === g && done) ? 'yes' : '';
        items.push(dia('d' + i, x, y, 140, 60, 'score >= ' + gr[0], st, { size: 11.5 }));
        items.push(act('g' + i, x + 15, y + 80, 110, 34, 'grade is ' + gr[1], done && i === g ? 'on' : done ? 'skip' : '', { size: 11.5 }));
        items.push(ln('t' + i, x + 70, y + 62, x + 70, y + 78, done && i === g));
        if (i < 3) items.push(ln('f' + i, x + 142, y + 30, x + 108 + 70, y + 56, i < g && checking > i, { via: [[x + 108 + 70, y + 30]] }));
      });
      items.push(ln('f3', 10 + 3 * 108 + 142, 10 + 3 * 56 + 30, 500, 270, g === 4 && done, { via: [[500, 10 + 3 * 56 + 30]] }));
      items.push(act('g4', 445, 272, 110, 34, 'grade is F', done && g === 4 ? 'on' : done ? 'skip' : '', { size: 11.5 }));
      items.push(T('sc', 20, 330, 'score = ' + jd(v.s), { mono: true, bold: true, tone: 'blue', size: 14 }));
      if (k === Math.min(g, 3) + 3) items.push(T('ex', 545, 340, 'exit ↓', { anchor: 'end', tone: 'teal', bold: true }));
      return items;
    }
  };

  /* ---------- 7. which if does else belong to? (slide 15) ---------- */
  var dangling = {
    id: 'dangling', slides: [15, 15], title: 'else matches the nearest if',
    steps: [
      { cap: 'i = 1, j = 2, k = 3. The <b>else</b> belongs to the <b>most recent if</b> in the same block: the inner one, if (i > k). Indentation does not change this.' },
      { cap: 'Check i > j: 1 > 2 is <b>false</b>. The whole inner if-else is inside the first if, so it is skipped. <b>Nothing is printed.</b>' },
      { cap: 'Add braces around the inner if. Now the else belongs to the <b>first</b> if.' },
      { cap: 'i > j is false, so the else runs: it prints <b>B</b>.', out: 'B' }
    ],
    draw: function (k) {
      var items = [box('i', 20, 22, 100, 'i', 'int', 1, {}), box('j', 140, 22, 100, 'j', 'int', 2, {}), box('kk', 260, 22, 100, 'k', 'int', 3, {})];
      if (k <= 1) {
        items.push(B('outer', 20, 90, 520, 160, { tag: 'if (i > j)', tone: k === 1 ? 'red' : 'blue', dash: k === 1, title: '' }));
        items.push(B('inner', 50, 120, 460, 110, { tag: '', lines: ['if (i > k)', '  System.out.println("A");', 'else   ← belongs to if (i > k)', '  System.out.println("B");'], mono: true, tone: k === 1 ? 'muted' : 'accent', dash: k === 1 }));
        if (k === 1) items.push(T('n', 280, 290, '1 > 2 is false → skip all → nothing printed', { anchor: 'middle', bold: true, tone: 'red' }));
        return items;
      }
      items.push(B('outer', 20, 90, 300, 90, { tag: 'if (i > j) { ... }', lines: ['if (i > k)', '  System.out.println("A");'], mono: true, tone: k === 3 ? 'muted' : 'blue', dash: k === 3 }));
      items.push(B('els', 340, 90, 200, 90, { tag: 'else   ← belongs to if (i > j)', lines: ['System.out.println("B");'], mono: true, tone: k === 3 ? 'accent' : 'teal', hi: k === 3 }));
      if (k === 3) items.push(T('n', 280, 240, 'i > j is false → else → prints B', { anchor: 'middle', bold: true, tone: 'teal' }));
      return items;
    }
  };

  /* ---------- 8. the semicolon mistake (slide 16) ---------- */
  var semicolon = {
    id: 'semicolon', slides: [16, 16], title: 'A semicolon after if',
    inputs: [{ id: 'r', label: 'radius', value: -5, min: -100, max: 100 }],
    presets: [{ label: 'radius -5', values: { r: -5 } }, { label: 'radius 5', values: { r: 5 } }],
    steps: function (v) {
      var area = v.r * v.r * 3.14;
      return [
        { cap: '<code>if (radius >= 0);</code> The <b>;</b> ends the if right there. The if now controls an <b>empty statement</b>.' },
        { cap: 'The block { … } is no longer part of the if. It is just a block that always runs.' },
        { cap: 'So even with radius = ' + v.r + ', the area is computed and printed. A <b>logic error</b>: no compile error, no runtime error.', out: 'The area for the circle of radius ' + jd(v.r) + ' is ' + jd(area) }
      ];
    },
    draw: function (k, s, v) {
      return [
        T('c1', 30, 50, 'if (radius >= 0)', { mono: true, size: 16 }),
        B('semi', 192, 30, 22, 28, { title: ';', mono: true, size: 18, tone: 'red', fill: 'solid', hi: k === 0 }),
        T('e', 225, 50, '← the if ends here (empty statement)', { tone: 'red', bold: true, size: 12.5 }),
        B('blk', 30, 80, 500, 110, { tag: k >= 1 ? 'a normal block: it ALWAYS runs' : '', lines: ['{', '  area = radius*radius*PI;', '  System.out.println("The area ...");', '}'], mono: true, tone: k >= 1 ? 'accent' : 'blue', hi: k >= 1 }),
        box('rad', 30, 230, 140, 'radius', 'double', jd(v.r), { tone: v.r < 0 ? 'red' : 'teal' }),
        k === 2 ? T('lg', 360, 260, 'logic error', { anchor: 'middle', bold: true, size: 18, tone: 'red' }) : null
      ];
    }
  };

  /* ---------- 9. boolean variables (slide 17) ---------- */
  var boolvar = {
    id: 'boolvar', slides: [17, 17], title: 'A boolean can hold the answer',
    inputs: [{ id: 'n', label: 'number', value: 8, min: -999, max: 999 }],
    presets: [{ label: '8', values: { n: 8 } }, { label: '7', values: { n: 7 } }],
    steps: function (v) {
      var ev = v.n % 2 === 0;
      return [
        { cap: 'TIP (a): an if-else that sets even to true or false.' },
        { cap: 'TIP (b): the same in one line. <code>number % 2 == 0</code> is already true or false, so store it directly: even = <b>' + tf(ev) + '</b>.' },
        { cap: 'CAUTION: <code>if (even == true)</code> works, but <code>if (even)</code> says the same thing, shorter.', out: ev ? 'It is even.' : undefined }
      ];
    },
    draw: function (k, s, v) {
      var ev = v.n % 2 === 0, items = [box('n', 20, 20, 130, 'number', 'int', v.n, {})];
      if (k === 0) items.push(B('a', 180, 20, 360, boxH(4), { tag: '(a)', lines: ['if (number % 2 == 0)', '  even = true;', 'else', '  even = false;'], mono: true, tone: 'blue', hi: true }));
      if (k >= 1) items.push(B('b', 180, 20, 360, boxH(2), { tag: '(b) equivalent', lines: ['boolean even', '  = number % 2 == 0;'], mono: true, tone: 'teal', hi: k === 1 }));
      if (k >= 1) items.push(box('ev', 20, 140, 130, 'even', 'boolean', tf(ev), k === 1 ? hot() : {}));
      if (k === 2) {
        items.push(B('c1', 180, 140, 170, boxH(2), { tag: '(a)', lines: ['if (even == true)', '  ...'], mono: true, tone: 'muted' }));
        items.push(B('c2', 370, 140, 170, boxH(2), { tag: '(b) better', lines: ['if (even)', '  ...'], mono: true, tone: 'teal', hi: true }));
      }
      return items;
    }
  };

  /* ---------- 10. logical operators and truth tables (slides 18-19) ---------- */
  var logic = {
    id: 'logic', slides: [18, 19], title: 'Logical operators', defaults: { p1: 1, p2: 0 },
    presets: [{ label: 'p1 false, p2 false', values: { p1: 0, p2: 0 } }, { label: 'p1 false, p2 true', values: { p1: 0, p2: 1 } }, { label: 'p1 true, p2 false', values: { p1: 1, p2: 0 } }, { label: 'p1 true, p2 true', values: { p1: 1, p2: 1 } }],
    steps: function (v) {
      var a = !!v.p1, b = !!v.p2;
      return [
        { slide: 18, cap: 'Four logical operators combine booleans: <b>!</b> not, <b>&amp;&amp;</b> and, <b>||</b> or, <b>^</b> exclusive or.' },
        { slide: 19, cap: '<b>!p1</b> flips the value: !' + tf(a) + ' is <b>' + tf(!a) + '</b>.' },
        { slide: 19, cap: '<b>p1 &amp;&amp; p2</b> is true only when <b>both</b> are true: ' + tf(a) + ' &amp;&amp; ' + tf(b) + ' is <b>' + tf(a && b) + '</b>.' },
        { slide: 19, cap: '<b>p1 || p2</b> is true when <b>at least one</b> is true: ' + tf(a) + ' || ' + tf(b) + ' is <b>' + tf(a || b) + '</b>.' },
        { slide: 19, cap: '<b>p1 ^ p2</b> is true when they are <b>different</b>: ' + tf(a) + ' ^ ' + tf(b) + ' is <b>' + tf(a !== b) + '</b>.' }
      ];
    },
    draw: function (k, s, v) {
      var a = !!v.p1, b = !!v.p2, items = [];
      var sw = function (id, x, label, on) { return [B(id, x, 20, 110, 50, { tag: label, title: tf(on), mono: true, size: 16, tone: on ? 'teal' : 'red', fill: 'solid' })]; };
      items.push(sw('p1', 40, 'p1', a)); items.push(sw('p2', 180, 'p2', b));
      var rows = [['!p1', !a], ['p1 && p2', a && b], ['p1 || p2', a || b], ['p1 ^ p2', a !== b]];
      rows.forEach(function (r, i) {
        var y = 100 + i * 56, cur = k === i + 1;
        items.push(B('op' + i, 40, y, 200, 44, { title: r[0], mono: true, size: 16, tone: cur ? 'accent' : 'blue', hi: cur }));
        if (k > i) items.push(B('rs' + i, 260, y, 120, 44, { title: tf(r[1]), mono: true, size: 16, tone: r[1] ? 'teal' : 'red', fill: cur ? 'solid' : 'soft' }));
      });
      if (k === 0) items.push(T('ls', 470, 160, '!   not\n&&  and\n||  or\n^   exclusive or', { anchor: 'middle', mono: true, size: 14, tone: 'ink' }));
      return items;
    }
  };

  /* ---------- 11. divisible by 2 and 3 (slide 20) ---------- */
  var divis = {
    id: 'divis', slides: [20, 20], title: 'Divisible by 2 and 3?',
    code: 'if ((number % 2 == 0) && (number % 3 == 0))\n  System.out.println(number + " is divisible by 2 and 3");\nelse if ((number % 2 == 0) || (number % 3 == 0))\n  System.out.println(number + " is divisible by 2 or 3");\nif ((number % 2 == 0) ^ (number % 3 == 0))\n  System.out.println(number + " is divisible by 2 or 3, but not both");',
    inputs: [{ id: 'n', label: 'number', value: 6, min: -999, max: 9999 }],
    presets: [{ label: '6', values: { n: 6 } }, { label: '4', values: { n: 4 } }, { label: '9', values: { n: 9 } }, { label: '7', values: { n: 7 } }],
    steps: function (v) {
      var d2 = v.n % 2 === 0, d3 = v.n % 3 === 0;
      var st = [{ line: 1, cap: 'number % 2 == 0 is <b>' + tf(d2) + '</b>, number % 3 == 0 is <b>' + tf(d3) + '</b>. With &amp;&amp;: <b>' + tf(d2 && d3) + '</b>.', out: d2 && d3 ? v.n + ' is divisible by 2 and 3' : undefined }];
      if (!(d2 && d3)) st.push({ line: 3, cap: 'else if with ||: ' + tf(d2) + ' || ' + tf(d3) + ' is <b>' + tf(d2 || d3) + '</b>.', out: d2 || d3 ? v.n + ' is divisible by 2 or 3' : undefined });
      st.push({ line: 5, cap: 'A separate if with ^ (exclusive or): ' + tf(d2) + ' ^ ' + tf(d3) + ' is <b>' + tf(d2 !== d3) + '</b>.', out: d2 !== d3 ? v.n + ' is divisible by 2 or 3, but not both' : undefined });
      return st;
    },
    draw: function (k, s, v) {
      var d2 = v.n % 2 === 0, d3 = v.n % 3 === 0;
      return [
        box('n', 20, 20, 120, 'number', 'int', v.n, {}),
        B('a', 170, 20, 170, 48, { title: 'n % 2 == 0: ' + tf(d2), mono: true, size: 13, tone: d2 ? 'teal' : 'red' }),
        B('b', 360, 20, 180, 48, { title: 'n % 3 == 0: ' + tf(d3), mono: true, size: 13, tone: d3 ? 'teal' : 'red' }),
        B('and', 40, 110, 480, 44, { title: '&&  both: ' + tf(d2 && d3), mono: true, size: 15, tone: k === 0 ? 'accent' : 'muted', hi: k === 0 }),
        B('or', 40, 170, 480, 44, { title: '||  at least one: ' + tf(d2 || d3), mono: true, size: 15, tone: k === 1 && !(d2 && d3) ? 'accent' : 'muted', hi: k === 1 && !(d2 && d3), dash: d2 && d3 }),
        B('xor', 40, 230, 480, 44, { title: '^   exactly one: ' + tf(d2 !== d3), mono: true, size: 15, tone: (k === 2 || (k === 1 && d2 && d3)) ? 'accent' : 'muted', hi: k === 2 || (k === 1 && d2 && d3) })
      ];
    }
  };

  /* ---------- 12. leap year (slide 21) ---------- */
  var leap = {
    id: 'leap', slides: [21, 21], title: 'Is it a leap year?',
    inputs: [{ id: 'y', label: 'year', value: 2024, min: 1, max: 9999 }],
    presets: [{ label: '2024', values: { y: 2024 } }, { label: '1900', values: { y: 1900 } }, { label: '2000', values: { y: 2000 } }, { label: '2023', values: { y: 2023 } }],
    steps: function (v) {
      var a = v.y % 4 === 0, b = v.y % 100 !== 0, c = v.y % 400 === 0, r = (a && b) || c;
      return [
        { cap: 'A year is a leap year if it is divisible by 4 but not by 100, <b>or</b> divisible by 400.' },
        { cap: 'year % 4 == 0: ' + v.y + ' % 4 = ' + (v.y % 4) + ' → <b>' + tf(a) + '</b>. year % 100 != 0: ' + v.y + ' % 100 = ' + (v.y % 100) + ' → <b>' + tf(b) + '</b>.' },
        { cap: 'Left part with &amp;&amp;: ' + tf(a) + ' &amp;&amp; ' + tf(b) + ' = <b>' + tf(a && b) + '</b>.' },
        { cap: 'year % 400 == 0: ' + v.y + ' % 400 = ' + (v.y % 400) + ' → <b>' + tf(c) + '</b>.' },
        { cap: 'Join with ||: ' + tf(a && b) + ' || ' + tf(c) + ' = <b>' + tf(r) + '</b>. ' + v.y + (r ? ' is' : ' is not') + ' a leap year.', out: v.y + (r ? ' is' : ' is not') + ' a leap year' }
      ];
    },
    draw: function (k, s, v) {
      var a = v.y % 4 === 0, b = v.y % 100 !== 0, c = v.y % 400 === 0, r = (a && b) || c;
      var t = function (val, show) { return show ? (val ? 'teal' : 'red') : 'muted'; };
      return [
        box('y', 20, 20, 130, 'year', 'int', v.y, {}),
        T('f', 280, 100, '(year % 4 == 0  &&  year % 100 != 0)  ||  (year % 400 == 0)', { anchor: 'middle', mono: true, size: 12.5, bold: true }),
        B('a', 20, 130, 150, 44, { title: '% 4 == 0: ' + tf(a), mono: true, size: 12.5, tone: t(a, k >= 1) }),
        B('b', 190, 130, 160, 44, { title: '% 100 != 0: ' + tf(b), mono: true, size: 12.5, tone: t(b, k >= 1) }),
        B('c', 380, 130, 160, 44, { title: '% 400 == 0: ' + tf(c), mono: true, size: 12.5, tone: t(c, k >= 3) }),
        k >= 2 ? B('ab', 60, 200, 250, 40, { title: '&&  →  ' + tf(a && b), mono: true, size: 14, tone: t(a && b, true), hi: k === 2 }) : null,
        k >= 4 ? B('r', 130, 270, 300, 50, { title: v.y + (r ? ' is a leap year' : ' is not a leap year'), size: 15, tone: r ? 'teal' : 'red', fill: 'solid' }) : null
      ];
    }
  };

  /* ---------- 13. switch rules: cases, break, default (slides 22-28) ---------- */
  var SWX = 'switch (x) {\n  case 1:  System.out.println("one");\n           break;\n  case 2:  System.out.println("two");\n  case 3:  System.out.println("three");\n           break;\n  default: System.out.println("other");\n}';
  var swrules = {
    id: 'swrules', slides: [22, 28], title: 'How a switch statement runs', code: SWX,
    inputs: [{ id: 'x', value: 2, min: -99, max: 99 }], inputsLabel: 'The controlling expression x =',
    presets: [{ label: 'x = 1', values: { x: 1 } }, { label: 'x = 2 (no break!)', values: { x: 2 } }, { label: 'x = 3', values: { x: 3 } }, { label: 'x = 7', values: { x: 7 } }],
    steps: function (v) {
      var st = [{ slide: 22, line: 1, cap: 'The controlling expression in ( ) is evaluated first: x is <b>' + v.x + '</b>. It must be a char, int, short or byte.' }];
      var start = v.x === 1 ? 2 : v.x === 2 ? 4 : v.x === 3 ? 5 : 7;
      st.push({ slide: 23, line: start, cap: v.x >= 1 && v.x <= 3 ? 'Java jumps to the case label that matches: <b>case ' + v.x + ':</b>' : 'No case label matches ' + v.x + ', so Java jumps to <b>default:</b> (slide 24).' });
      var outs = [];
      if (v.x === 1) { st.push({ slide: 25, line: 2, cap: 'Run its statements.', out: 'one' }); st.push({ slide: 25, line: 3, cap: '<b>break</b> ends the switch.' }); }
      else if (v.x === 2) { st.push({ slide: 25, line: 4, cap: 'Run its statements.', out: 'two' }); st.push({ slide: 25, line: 5, cap: 'There is <b>no break</b> after case 2, so Java <b>falls through</b> into case 3 and runs it too. The compiler gives no warning!', out: 'three' }); st.push({ slide: 26, line: 6, cap: 'Now a break: the switch ends.' }); }
      else if (v.x === 3) { st.push({ slide: 25, line: 5, cap: 'Run its statements.', out: 'three' }); st.push({ slide: 26, line: 6, cap: '<b>break</b> ends the switch.' }); }
      else st.push({ slide: 25, line: 7, cap: 'The default statements run.', out: 'other' });
      st.push({ slide: 27, line: 8, cap: 'Rules: each case label is a constant of the same type, it appears only once, and <b>break</b> should end each case.' });
      st.push({ slide: 28, line: '1-8', cap: 'The general form: switch (Controlling_Expression) { case labels with statement sequences and breaks, and an optional default }.' });
      return st;
    },
    draw: function (k, s, v) {
      var items = [box('x', 20, 20, 110, 'x', 'int', v.x, k === 0 ? hot() : {})];
      var cases = [['c1', 'case 1:', 'println("one"); break;', v.x === 1], ['c2', 'case 2:', 'println("two");   (no break)', v.x === 2], ['c3', 'case 3:', 'println("three"); break;', v.x === 3 || v.x === 2], ['df', 'default:', 'println("other");', !(v.x >= 1 && v.x <= 3)]];
      cases.forEach(function (c, i) {
        var y = 90 + i * 58, run = c[3] && k >= 2;
        items.push(B(c[0], 160, y, 380, 46, { tag: c[1], title: c[2], mono: true, size: 13, align: 'left', tone: run ? 'accent' : (k === 1 && c[3] && (i === 3 || v.x === i + 1)) ? 'accent' : 'blue', hi: run, fill: run ? 'solid' : 'soft' }));
      });
      if (k >= 1) {
        var target = v.x === 1 ? 0 : v.x === 2 ? 1 : v.x === 3 ? 2 : 3;
        items.push(A('jump', 132, 44, 158, 113 + target * 58, { tone: 'accent', via: [[145, 44], [145, 113 + target * 58]] }));
      }
      if (v.x === 2 && k >= 3) items.push(A('fall', 152, 176, 152, 214, { tone: 'red', label: 'fall through', la: 'end', lx: -6, ly: 10 }));
      return items;
    }
  };

  /* ---------- 14. trace the slide switch (slides 29-35) ---------- */
  var DAYSW = 'switch (day) {\n  case 1:\n  case 2:\n  case 3:\n  case 4:\n  case 5: System.out.println("Weekday"); break;\n  case 0:\n  case 6: System.out.println("Weekend");\n}';
  var swtrace = {
    id: 'swtrace', slides: [29, 35], title: 'Trace a switch statement', code: DAYSW,
    inputs: [{ id: 'd', label: 'day', value: 2, min: -9, max: 9 }],
    presets: [{ label: 'Slide: day 2', values: { d: 2 } }, { label: 'day 5', values: { d: 5 } }, { label: 'day 6', values: { d: 6 } }, { label: 'day 9', values: { d: 9 } }],
    steps: function (v) {
      var d = v.d, st = [{ slide: 29, line: 1, cap: 'Suppose day is <b>' + d + '</b>.' }];
      if (d >= 1 && d <= 5) {
        st.push({ slide: 30, line: d + 1, cap: '<b>Match case ' + d + '</b>.' });
        for (var c = d + 1; c <= 5; c++) st.push({ slide: [31, 32, 33][Math.min(c - 3, 2)] || 31, line: c + 1, cap: 'No statement here and no break: <b>fall through</b> to case ' + c + '.' });
        st.push({ slide: 33, line: 6, cap: 'Print Weekday.', out: 'Weekday' });
        st.push({ slide: 34, line: 6, cap: '<b>Encounter break</b>.' });
        st.push({ slide: 35, line: 9, cap: '<b>Exit</b> the switch statement.' });
      } else if (d === 0 || d === 6) {
        st.push({ slide: 30, line: d === 0 ? 7 : 8, cap: 'Match case ' + d + '.' });
        if (d === 0) st.push({ slide: 31, line: 8, cap: 'Fall through to case 6.' });
        st.push({ slide: 33, line: 8, cap: 'Print Weekend.', out: 'Weekend' });
        st.push({ slide: 35, line: 9, cap: 'The end of the switch is reached (no break needed here).' });
      } else {
        st.push({ slide: 30, line: 1, cap: 'No case label is ' + d + ', and this switch has no default.' });
        st.push({ slide: 35, line: 9, cap: 'So nothing runs: exit the switch.' });
      }
      return st;
    },
    draw: function (k, s, v) {
      var d = v.d, cur = s, items = [box('day', 20, 20, 110, 'day', 'int', d, k === 0 ? hot() : {})];
      var labels = [1, 2, 3, 4, 5, 0, 6];
      labels.forEach(function (c, i) {
        var y = 20 + i * 42, line = i < 5 ? i + 2 : i + 2, active = cur && cur.line === line;
        items.push(B('c' + c, 170, y, 90, 34, { title: 'case ' + c + ':', mono: true, size: 13, tone: active ? 'accent' : 'blue', hi: active, fill: active ? 'solid' : 'soft' }));
      });
      items.push(B('wk', 280, 188, 260, 34, { title: 'println("Weekday"); break;', mono: true, size: 12, tone: cur && cur.line === 6 ? 'accent' : 'teal' }));
      items.push(B('we', 280, 272, 260, 34, { title: 'println("Weekend");', mono: true, size: 12, tone: cur && cur.line === 8 ? 'accent' : 'teal' }));
      return items;
    }
  };

  /* ---------- 15. month example (slides 36-37) ---------- */
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var month = {
    id: 'month', slides: [36, 37], title: 'switch on a month number',
    inputs: [{ id: 'm', label: 'month', value: -3, min: -99, max: 99 }],
    presets: [{ label: 'Slide: -3', values: { m: -3 } }, { label: '1', values: { m: 1 } }, { label: '7', values: { m: 7 } }, { label: '12', values: { m: 12 } }],
    steps: function (v) {
      var ok = v.m >= 1 && v.m <= 12;
      return [
        { slide: 36, cap: '<code>switch(month)</code> with month = <b>' + v.m + '</b>. There is one case for each month, 1 to 12.' },
        { slide: ok && v.m > 6 ? 37 : 36, cap: ok ? 'case ' + v.m + ' matches: print ' + MONTHS[v.m - 1] + ', then break.' : 'No case matches ' + v.m + ', so <b>default</b> runs.', out: ok ? MONTHS[v.m - 1] : 'Invalid Month' },
        { slide: 37, cap: 'The <b>default</b> section catches all the wrong values, like ' + (ok ? '-3 or 13' : v.m) + '. That is why it is good practice to include it.' }
      ];
    },
    draw: function (k, s, v) {
      var ok = v.m >= 1 && v.m <= 12, items = [box('m', 20, 20, 110, 'month', 'int', v.m, k === 0 ? hot() : {})];
      MONTHS.forEach(function (mn, i) {
        var x = 150 + (i % 4) * 100, y = 20 + Math.floor(i / 4) * 64, on = ok && v.m === i + 1 && k >= 1;
        items.push(B('c' + i, x, y, 92, 52, { tag: 'case ' + (i + 1), title: mn.slice(0, 3), size: 13, tone: on ? 'accent' : 'blue', fill: on ? 'solid' : 'soft' }));
      });
      items.push(B('def', 150, 220, 392, 48, { tag: 'default', title: 'Invalid Month', size: 14, tone: !ok && k >= 1 ? 'accent' : 'muted', fill: !ok && k >= 1 ? 'solid' : 'soft' }));
      return items;
    }
  };

  /* ---------- 16. switch on a char (slide 38) ---------- */
  var SHIPS = [['B', 'b', 'Battleship'], ['C', 'c', 'Cruiser'], ['D', 'd', 'Destroyer'], ['F', 'f', 'Frigate']];
  var ship = {
    id: 'ship', slides: [38, 38], title: 'switch on a char', defaults: { c: 66 },
    presets: [{ label: "'B'", values: { c: 66 } }, { label: "'c'", values: { c: 99 } }, { label: "'f'", values: { c: 102 } }, { label: "'X'", values: { c: 88 } }],
    steps: function (v) {
      var ch = String.fromCharCode(v.c), m = SHIPS.filter(function (sh) { return sh[0] === ch || sh[1] === ch; })[0];
      return [
        { cap: "sClass = '" + ch + "'. A switch can test a <b>char</b>. Two labels can share one block: case 'B': case 'b':" },
        { cap: m ? "'" + ch + "' matches: print " + m[2] + '.' : "No label matches '" + ch + "': the default prints a message with %c.", out: m ? m[2] : 'Unknown ship class ' + ch }
      ];
    },
    draw: function (k, s, v) {
      var ch = String.fromCharCode(v.c), items = [box('s', 20, 20, 120, 'sClass', 'char', "'" + ch + "'", k === 0 ? hot() : {})];
      SHIPS.forEach(function (sh, i) {
        var on = k >= 1 && (sh[0] === ch || sh[1] === ch);
        items.push(B('sh' + i, 170, 20 + i * 62, 370, 50, { tag: "case '" + sh[0] + "':  case '" + sh[1] + "':", title: sh[2], size: 14, tone: on ? 'accent' : 'blue', fill: on ? 'solid' : 'soft' }));
      });
      var none = k >= 1 && !SHIPS.some(function (sh) { return sh[0] === ch || sh[1] === ch; });
      items.push(B('df', 170, 270, 370, 44, { tag: 'default', title: 'Unknown ship class %c', mono: true, size: 13, tone: none ? 'accent' : 'muted', fill: none ? 'solid' : 'soft' }));
      return items;
    }
  };

  /* ---------- 17. ternary operator (slide 39) ---------- */
  var ternary = {
    id: 'ternary', slides: [39, 39], title: 'The ternary operator ? :',
    inputs: [{ id: 'x', value: 5, min: -99, max: 99 }],
    presets: [{ label: 'x = 5', values: { x: 5 } }, { label: 'x = -2', values: { x: -2 } }, { label: 'x = 0', values: { x: 0 } }],
    steps: function (v) {
      var c = v.x > 0;
      return [
        { cap: '<code>(testCondition) ? value1 : value2</code> If the condition is true, the result is value1; otherwise value2.' },
        { cap: 'Test: x > 0 → ' + v.x + ' > 0 is <b>' + tf(c) + '</b>.' },
        { cap: 'So y = <b>' + (c ? 1 : -1) + '</b>. The same as the if-else on the slide, in one line.' }
      ];
    },
    draw: function (k, s, v) {
      var c = v.x > 0;
      return [
        box('x', 20, 20, 110, 'x', 'int', v.x, {}),
        T('e', 280, 110, 'y = (x > 0) ? 1 : -1;', { anchor: 'middle', mono: true, size: 20, bold: true }),
        B('cond', 140, 140, 120, 44, { title: 'x > 0: ' + tf(c), mono: true, size: 13, tone: k >= 1 ? (c ? 'teal' : 'red') : 'muted', hi: k === 1 }),
        B('v1', 290, 140, 60, 44, { title: '1', mono: true, size: 18, tone: k === 2 && c ? 'accent' : 'muted', fill: k === 2 && c ? 'solid' : 'soft' }),
        B('v2', 370, 140, 70, 44, { title: '-1', mono: true, size: 18, tone: k === 2 && !c ? 'accent' : 'muted', fill: k === 2 && !c ? 'solid' : 'soft' }),
        k === 2 ? box('y', 200, 230, 160, 'y', 'int', c ? 1 : -1, hot()) : null
      ];
    }
  };

  /* ---------- 18. precedence with a relational operator (slides 40-41) ---------- */
  var PREC = [['*', '/', '%'], ['+', '-'], ['<', '<=', '>', '>='], ['==', '!='], ['^'], ['&&'], ['||']];
  function rank(op) { for (var i = 0; i < PREC.length; i++) if (PREC[i].indexOf(op) >= 0) return i; return 99; }
  function apply(a, op, b) {
    switch (op) {
      case '*': return a * b; case '/': return Math.trunc(a / b); case '%': return a % b; case '+': return a + b; case '-': return a - b;
      case '<': return a < b; case '<=': return a <= b; case '>': return a > b; case '>=': return a >= b; case '==': return a === b; case '!=': return a !== b;
      case '^': return a !== b; case '&&': return a && b; case '||': return a || b;
    }
  }
  var OPNAME = { '*': 'multiplication', '/': 'division', '%': 'remainder', '+': 'addition', '-': 'subtraction', '<': 'less than', '<=': 'less than or equal', '>': 'greater than', '>=': 'greater than or equal', '==': 'equal to', '!=': 'not equal to', '^': 'exclusive or', '&&': 'and', '||': 'or' };
  function tokens(src) { return src.match(/\d+|true|false|&&|\|\||<=|>=|==|!=|[-+*/%()<>^]/g).map(function (t) { return /^\d+$/.test(t) ? +t : t === 'true' ? true : t === 'false' ? false : t; }); }
  function reduceSteps(src) {
    var t = tokens(src), lines = [], g = 0;
    while (t.length > 1 && g++ < 40) {
      var open = -1, close = -1;
      for (var i = 0; i < t.length; i++) { if (t[i] === '(') open = i; if (t[i] === ')' && open >= 0) { close = i; break; } }
      var lo = open >= 0 ? open + 1 : 0, hi = open >= 0 ? close - 1 : t.length - 1, best = -1;
      for (var j = lo + 1; j <= hi; j += 2) if (best < 0 || rank(t[j]) < rank(t[best])) best = j;
      lines.push({ t: t.slice(), hi: best, op: t[best], par: open >= 0 });
      var r = apply(t[best - 1], t[best], t[best + 1]);
      t.splice(best - 1, 3, r);
      if (open >= 0 && t[open + 2] === ')' ) t.splice(open, 3, t[open + 1]);
    }
    lines.push({ t: t.slice(), hi: -1 });
    return lines;
  }
  var PEX = ['3 + 4 * 4 > 5 * (4 + 3) - 1', '2 * 3 == 6', '10 - 4 > 3 + 2', '5 > 3 && 2 > 4', '1 + 1 == 2 || 3 > 9'];
  var prec = {
    id: 'prec', slides: [40, 41], title: 'Operator precedence', defaults: { e: 0 },
    presets: PEX.map(function (e, i) { return { label: i === 0 ? 'Slide 41' : e, values: { e: i } }; }),
    steps: function (v) {
      var L = reduceSteps(PEX[v.e]), st = [{ slide: 40, cap: 'Higher in the list = done first: parentheses, then * / %, then + -, then comparisons, then == !=, then ^, &amp;&amp;, ||, and assignment last.' }];
      L.forEach(function (l, i) { st.push({ slide: 41, cap: i === L.length - 1 ? 'The result: <b>' + l.t[0] + '</b>.' : '(' + (i + 1) + ') ' + (l.par ? 'inside parentheses first: ' : '') + OPNAME[l.op] + '.' }); });
      return st;
    },
    draw: function (k, s, v) {
      var items = [];
      if (k === 0) {
        ['( )', 'var++  var--', '+ - (unary)  ++var  --var', '(type) casting', '! (not)', '*  /  %', '+  -', '<  <=  >  >=', '==  !=', '^', '&&', '||', '=  +=  -=  *=  /=  %='].forEach(function (r, i) {
          items.push(B('p' + i, 120, 8 + i * 25, 320, 22, { title: r, mono: true, size: 12, tone: i === 0 ? 'accent' : i <= 4 ? 'muted' : 'blue', r: 4 }));
        });
        items.push(A('hi', 470, 20, 470, 320, { tone: 'muted', label: 'lower', la: 'start', lx: 6, ly: 140 }));
        items.push(T('top', 460, 24, 'first', { anchor: 'end', tone: 'accent', bold: true, size: 12 }));
        return items;
      }
      var L = reduceSteps(PEX[v.e]), cur = k - 1;
      L.forEach(function (l, i) {
        if (i > cur) return;
        var w = Math.min(38, Math.floor(540 / l.t.length)), total = l.t.length * w, x0 = 280 - total / 2, y = 14 + i * 42;
        l.t.forEach(function (tk, j) {
          var hl = i === cur && j === l.hi, txt = String(tk);
          items.push(B('l' + i + '-' + j, x0 + j * w, y, w - 3, 34, { title: txt, mono: true, size: txt.length > 3 ? Math.min(w < 38 ? 9 : 10, Math.floor((w - 9) / (0.62 * txt.length) * 2) / 2) : 14, tone: hl ? 'accent' : i === cur ? (typeof tk === 'boolean' ? (tk ? 'teal' : 'red') : 'blue') : 'muted', fill: hl ? 'solid' : 'soft', r: 4 }));
        });
      });
      return items;
    }
  };

  /* ---------- 19. debugging (slide 42) ---------- */
  var DBG = 'int score = 75;\nchar grade;\nif (score >= 80)\n  grade = \'B\';\nelse\n  grade = \'C\';\nSystem.out.println(grade);';
  var debug = {
    id: 'debug', slides: [42, 42], title: 'What a debugger shows', code: DBG,
    steps: [
      { line: 1, cap: 'A debugger can <b>execute one statement at a time</b>. Line 1 runs: score = 75.' },
      { line: 3, cap: 'You can <b>set a breakpoint</b> (here on line 3): the program stops there, so you can look around.' },
      { line: 3, cap: 'It can <b>display variables</b>: score is 75, grade has no value yet.' },
      { line: 6, cap: 'Step again: 75 >= 80 is false, so line 6 runs. You can also <b>modify variables</b> while the program is stopped.' },
      { line: 7, cap: 'The last step prints C. Bugs are logic errors; debugging = finding and fixing them.', out: 'C' }
    ],
    draw: function (k) {
      return [
        B('bp', 20, 20, 200, 44, { title: k >= 1 ? '● breakpoint: line 3' : 'no breakpoint', size: 13, tone: k >= 1 ? 'red' : 'muted', fill: k >= 1 ? 'solid' : 'soft' }),
        B('vars', 260, 20, 280, boxH(2), { tag: 'variables', lines: ['score = ' + (k >= 0 ? 75 : '?'), 'grade = ' + (k >= 3 ? "'C'" : '(no value)')], mono: true, tone: k === 2 || k === 3 ? 'accent' : 'teal', hi: k === 2 }),
        B('step', 20, 140, 200, 44, { title: '▶ step', size: 15, tone: k === 0 || k === 3 || k === 4 ? 'accent' : 'blue', fill: 'solid' }),
        T('l', 20, 240, ['run one statement', 'stop at the breakpoint', 'look at the variables', 'step, change a value', 'see the output'][k], { bold: true, tone: 'accent', size: 15 })
      ];
    }
  };

  var ALL = [relational, addquiz, oneway, hifive, twoway, multi, dangling, semicolon, boolvar, logic, divis, leap, swrules, swtrace, month, ship, ternary, prec, debug];

  var para = function (t) { return { type: 'paragraph', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; }, code = function (t) { return { type: 'code', text: t }; }, note = function (t) { return { type: 'note', text: t }; };
  function braces(c) { var o = (c.match(/\{/g) || []).length, z = (c.match(/\}/g) || []).length; return o >= 2 && o === z; }
  var GRADE_ELSEIF = 'if (score >= 90.0)\n  System.out.print("A");\nelse if (score >= 80.0)\n  System.out.print("B");\nelse if (score >= 70.0)\n  System.out.print("C");\nelse if (score >= 60.0)\n  System.out.print("D");\nelse\n  System.out.print("F");';
  var DAYSW30 = 'switch (day) {\n  case 1:\n  case 2:\n  case 3:\n  case 4:\n  case 5: System.out.println("Weekday"); break;\n  case 0:\n  case 6: System.out.println("Weekend");\n}';
  function traceSlide(msg, ex) { return { image: false, title: 'Trace if-else statement', blocks: [note(msg), code(GRADE_ELSEIF)], explain: ex }; }
  function swSlide(msg, ex) { return { image: false, title: 'Trace switch statement', blocks: [note(msg), code(DAYSW30)], explain: ex }; }

  addUnit({
    course: 'cs1', lesson: '04-selections',
    blurb: 'Make decisions in code: boolean values, comparisons, if, if-else, else if chains, &&, ||, !, ^, the switch statement and the ? : operator.',
    parts: [
      {
        title: 'boolean and comparisons', from: 1, to: 4,
        quiz: [
          { type: 'output', q: 'What does this print?', code: 'boolean b = (1 > 2);\nSystem.out.println(b);', answer: 'false', why: '1 > 2 is false, and the comparison result is stored in b.' },
          { q: 'Which operator means “is equal to” in Java?', options: ['=', '!=', '=='], answer: 2, why: '<code>=</code> is assignment. <code>==</code> compares. <code>!=</code> means not equal.' },
          { type: 'output', q: 'radius is 5. What does this print?', code: 'int radius = 5;\nSystem.out.println(radius >= 5);', answer: 'true', why: '5 >= 5 is true: “greater than or equal”.' },
          { type: 'tf', q: 'The result of a comparison like i > j is a number.', answer: false, why: 'It is a <b>boolean</b> value: true or false (slide 2).' },
          { type: 'output', q: 'In AdditionQuiz, number1 is 4, number2 is 5 and the student types 10. What is printed?', code: 'System.out.println(\n  number1 + " + " + number2 + " = " + answer + " is " + result);', answer: '4 + 5 = 10 is false', why: '4 + 5 is 9, and 9 == 10 is false.' }
        ]
      },
      {
        title: 'if and if-else', from: 5, to: 8,
        quiz: [
          { type: 'output', q: 'What does this print?', code: 'int i = -3;\nif (i > 0) {\n  System.out.println("i is positive");\n}\nSystem.out.println("done");', answer: 'done', why: 'i > 0 is false, so the block is skipped. The last line always runs.' },
          { q: 'What is wrong here?', code: 'if i > 0 {\n  System.out.println("i is positive");\n}', options: ['The condition must be inside parentheses', 'The braces must be on their own lines', 'Nothing: Java accepts it as it is'], answer: 0, why: 'Slide 6: <code>if (i > 0)</code>.' },
          { type: 'output', q: 'number is 15. What is printed? (slide 7)', code: 'if (number % 5 == 0)\n  System.out.println("HiFive");\nif (number % 2 == 0)\n  System.out.println("HiEven");', answer: 'HiFive', why: '15 % 5 is 0 (HiFive), but 15 % 2 is 1, so no HiEven.' },
          { type: 'output', q: 'number is 10. What is printed?', code: 'if (number % 5 == 0)\n  System.out.println("HiFive");\nif (number % 2 == 0)\n  System.out.println("HiEven");', answer: 'HiFive\nHiEven', why: 'Two separate if statements: both conditions are true, so both lines print.' },
          { type: 'output', q: 'What does this print?', code: 'double radius = -1;\nif (radius >= 0) {\n  System.out.println("Area computed");\n}\nelse {\n  System.out.println("Negative input");\n}', answer: 'Negative input', why: 'The condition is false, so the else block runs.' },
          { type: 'fill', q: 'Complete the two-way if.', code: 'if (age >= 18)\n  System.out.println("adult");\n___\n  System.out.println("child");', answer: ['else'], why: 'else gives the path for the false case.' }
        ]
      },
      {
        title: 'Multi-way if and common errors', from: 9, to: 17,
        quiz: [
          { type: 'output', q: 'score is 85.0. What is printed?', code: GRADE_ELSEIF, answer: 'B', why: '85 >= 90 is false, 85 >= 80 is true: print B and exit.' },
          { type: 'output', q: 'score is 59.5. What is printed?', code: GRADE_ELSEIF, answer: 'F', why: 'All four conditions are false, so the last else runs.' },
          { q: 'When score is 95, how many conditions are checked?', options: ['1', '2', '4'], answer: 0, why: 'The first condition is true. After it runs, the rest of the chain is skipped.' },
          { type: 'output', q: 'What does this print? (slide 15)', code: 'int i = 1, j = 2, k = 3;\nif (i > j)\n  if (i > k)\n    System.out.println("A");\nelse\n  System.out.println("B");\nSystem.out.println("end");', answer: 'end', why: 'The else belongs to if (i > k). Since i > j is false, the whole inner if-else is skipped.' },
          { q: 'What is the problem in this code?', code: 'if (radius >= 0);\n{\n  area = radius * radius * PI;\n}', options: ['It does not compile: an if cannot end with ;', 'The ; ends the if, so the block always runs: a logic error', 'The block never runs, because the if is empty'], answer: 1, why: 'Slide 16. It compiles and runs, but gives wrong results for negative radius.' },
          { q: 'Which line is the short version of the if-else in slide 17 (a)?', options: ['even == number % 2 == 0;', 'boolean even = number % 2;', 'boolean even = number % 2 == 0;'], answer: 2, why: 'The comparison is already true or false, so store it directly.' }
        ]
      },
      {
        title: 'Logical operators', from: 18, to: 21,
        quiz: [
          { type: 'output', q: 'What does this print?', code: 'boolean a = true, b = false;\nSystem.out.println(a && b);', answer: 'false', why: '&& is true only when both are true.' },
          { type: 'output', q: 'And this?', code: 'boolean a = true, b = false;\nSystem.out.println(a || b);', answer: 'true', why: '|| is true when at least one is true.' },
          { type: 'output', q: 'And this?', code: 'boolean a = true, b = true;\nSystem.out.println(a ^ b);', answer: 'false', why: '^ (exclusive or) is true only when the two values are different.' },
          { q: 'number is 9. Which message from slide 20 is printed?', options: ['divisible by 2 and 3, and then: divisible by 2 or 3', 'nothing, because 9 is not divisible by 2', 'divisible by 2 or 3, and then: divisible by 2 or 3, but not both'], answer: 2, why: '9 % 3 == 0 but 9 % 2 != 0. The && test is false, the || test is true, and the ^ test is true.' },
          { type: 'fill', q: 'Complete the leap year test (slide 21).', code: 'boolean isLeap = (year % 4 == 0 ___ year % 100 != 0) || (year % 400 == 0);', answer: ['&&'], why: 'Divisible by 4 <b>and</b> not by 100, or divisible by 400.' },
          { q: 'Is 1900 a leap year?', options: ['No', 'Yes'], answer: 0, why: '1900 % 4 == 0, but 1900 % 100 == 0 too, and 1900 % 400 != 0.' }
        ]
      },
      {
        title: 'The switch statement', from: 22, to: 38,
        quiz: [
          { q: 'Which type can the controlling expression of a switch have (slide 22)?', options: ['char, int, short or byte', 'double', 'boolean'], answer: 0, why: 'Slide 22.' },
          { type: 'output', q: 'What does this print?', code: 'int x = 2;\nswitch (x) {\n  case 1: System.out.println("one"); break;\n  case 2: System.out.println("two");\n  case 3: System.out.println("three"); break;\n  default: System.out.println("other");\n}', answer: 'two\nthree', why: 'case 2 has no break, so it falls through into case 3.' },
          { type: 'output', q: 'day is 6. What does the switch of slide 30 print?', code: DAYSW30, answer: 'Weekend', why: 'case 6 matches and prints Weekend.' },
          { type: 'output', q: 'month is 13 in the month switch (slides 36-37). What is printed?', code: 'switch (month) {\n  case 1: System.out.println("January"); break;\n  // ... cases 2 to 12 ...\n  default: System.out.println("Invalid Month"); break;\n}', answer: 'Invalid Month', why: 'No case label matches 13, so the default runs.' },
          { type: 'tf', q: 'If you forget a break, the compiler gives an error.', answer: false, why: 'Slide 25: the compiler will not issue an error message. The next case simply runs too.' },
          { q: 'Can a case label contain a variable, like <code>case 1 + x:</code>?', options: ['Yes, any expression can be a case label', 'No, case labels must be constant expressions'], answer: 1, why: 'Slide 26.' }
        ]
      },
      {
        title: 'Ternary, precedence and debugging', from: 39, to: 42,
        quiz: [
          { type: 'output', q: 'What does this print?', code: 'int x = -4;\nint y = (x > 0) ? 1 : -1;\nSystem.out.println(y);', answer: '-1', why: 'x > 0 is false, so y gets value2: -1.' },
          { type: 'fill', q: 'Write the if-else as one line.', code: 'int max = (a > b) ___ a ___ b;', answer: ['?', ':'], why: '<code>(condition) ? value1 : value2</code>.' },
          { type: 'output', q: 'What does this print? (slide 41)', code: 'System.out.println(3 + 4 * 4 > 5 * (4 + 3) - 1);', answer: 'false', why: '3 + 16 = 19 and 35 - 1 = 34. 19 > 34 is false.' },
          { q: 'Which is done first in <code>a + b * c</code>?', options: ['b * c', 'a + b'], answer: 0, why: '* has a higher precedence than +.' },
          { q: 'What is debugging?', options: ['Writing comments', 'Finding and correcting errors (bugs)', 'Making the program faster'], answer: 1, why: 'Slide 42. Logic errors are called bugs.' }
        ]
      }
    ],
    slides: {
      1: { cover: true, image: false, title: '', blocks: [para('Chapter 3'), para('Selections'), note('An adapted version of the lecture notes associated with the textbook')],
        explain: '<p>Programs often have to <b>choose</b>: do this, or do that. In this unit you learn how a program makes decisions with <code>if</code>, <code>else</code> and <code>switch</code>.</p>' },
      2: { image: false, explain: '<p>To decide, we first need a <b>question</b> with a yes/no answer, like “is i greater than j?”. In Java, such a question is a comparison, and its answer is a <b>{{boolean|منطقي: صح أو خطأ}}</b>: true or false. You can store it in a boolean variable.</p>' },
      3: { image: false, blocks: [{ type: 'html', html: tblH(['Java Operator', 'Mathematics Symbol', 'Name', 'Example (radius is 5)', 'Result'], [['<code>&lt;</code>', '&lt;', 'less than', '<code>radius &lt; 0</code>', 'false'], ['<code>&lt;=</code>', '≤', 'less than or equal to', '<code>radius &lt;= 0</code>', 'false'], ['<code>&gt;</code>', '&gt;', 'greater than', '<code>radius &gt; 0</code>', 'true'], ['<code>&gt;=</code>', '≥', 'greater than or equal to', '<code>radius &gt;= 0</code>', 'true'], ['<code>==</code>', '=', 'equal to', '<code>radius == 0</code>', 'false'], ['<code>!=</code>', '≠', 'not equal to', '<code>radius != 0</code>', 'true']]) }],
        explain: '<p>Six <b>{{relational operators|عامل مقارنة}}</b>. Be careful with two of them: equality is <code>==</code> (two equal signs; one <code>=</code> is assignment), and “not equal” is <code>!=</code>. Change radius in the drawing to see each result change.</p>' },
      4: { image: false, blocks: [para('This example creates a program to let a first grader practice additions. The program randomly generates two single-digit integers number1 and number2 and displays a question such as “What is 7 + 9?” to the student. After the student types the answer, the program displays a message to indicate whether the answer is true or false.'), code(QUIZ)],
        explain: '<p>A small quiz program. It uses the clock to make two random digits (the time % 10 is always 0 to 9). The key line is <code>number1 + number2 == answer</code>: it compares the real sum with the answer, and the result is true or false.</p>' },
      5: { blocks: [code('if (boolean-expression) {\n  statement(s);\n}'), code('if (radius >= 0) {\n  area = radius * radius * PI;\n  System.out.println("The area"\n    + " for the circle of radius "\n    + radius + " is " + area);\n}')],
        explain: '<p>A <b>{{one-way if|if بفرع واحد}}</b>: when the {{condition|شرط}} is true, the statements in the block run. When it is false, they are skipped and the program goes on after the block. The flowchart shows the two ways.</p>' },
      6: { image: false, title: 'Note', blocks: [note('(a) Wrong'), code('if i > 0 {\n  System.out.println("i is positive");\n}'), note('(b) Correct'), code('if (i > 0) {\n  System.out.println("i is positive");\n}'), note('Equivalent'), code('if (i > 0) {\n  System.out.println("i is positive");\n}'), code('if (i > 0)\n  System.out.println("i is positive");')],
        explain: '<p>Two rules: the condition must be in <b>parentheses</b>; and if the block has only <b>one</b> statement, the braces are optional.</p>' },
      7: { image: false, explain: '<p>A practice problem: HiFive when the number is a multiple of 5, HiEven when it is divisible by 2. Use two <b>separate</b> if statements, because a number can be both (like 10). The drawing tries several numbers.</p>' },
      8: { image: false, blocks: [code('if (boolean-expression) {\n  statement(s)-for-the-true-case;\n}\nelse {\n  statement(s)-for-the-false-case;\n}'), code('if (radius >= 0) {\n  area = radius * radius * 3.14159;\n  System.out.println("The area for the "\n    + "circle of radius " + radius +\n    " is " + area);\n}\nelse {\n  System.out.println("Negative input");\n}')],
        explain: '<p>A <b>{{two-way if|if بفرعين}}</b> adds <code>else</code>: one block for true, one block for false. Exactly one of the two runs, every time.</p>' },
      9: { title: 'Multiple Alternative if Statements', explain: '<p>For more than two choices, you can put if-else inside else (a). The same logic written with <code>else if</code> (b) is shorter and easier to read, so it is better. Java checks the conditions from the top; the <b>first</b> true one wins, and the rest are skipped.</p>' },
      10: traceSlide('Suppose score is 70.0. The condition is false', '<p>Trace with score = 70.0. The first question, score >= 90.0, is false, so Java goes to the next <code>else if</code>.</p>'),
      11: traceSlide('Suppose score is 70.0. The condition is false', '<p>score >= 80.0 is also false. Go on.</p>'),
      12: traceSlide('Suppose score is 70.0. The condition is true', '<p>score >= 70.0 is <b>true</b>.</p>'),
      13: traceSlide('Suppose score is 70.0. grade is C', '<p>So the statement under it runs: it prints C.</p>'),
      14: traceSlide('Suppose score is 70.0. Exit the if statement', '<p>Done: the whole if statement ends. The last condition (>= 60.0) is never checked.</p>'),
      15: { image: false, blocks: [para('The else clause matches the most recent if clause in the same block.'), code('int i = 1, j = 2, k = 3;\nif (i > j)\n  if (i > k)\n    System.out.println("A");\nelse\n  System.out.println("B");'), note('Equivalent, better with correct indentation'), code('int i = 1, j = 2, k = 3;\nif (i > j)\n  if (i > k)\n    System.out.println("A");\n  else\n    System.out.println("B");'), para('Nothing is printed from the preceding statement. To force the else clause to match the first if clause, you must add a pair of braces:'), code('int i = 1, j = 2, k = 3;\nif (i > j) { if (i > k)\n                System.out.println("A");\n            }\nelse\n  System.out.println("B");'), para('This statement prints B.')],
        explain: '<p>An <code>else</code> always belongs to the <b>nearest if</b> above it (in the same block). Indentation does not change that: it only helps people read the code. To connect the else to the outer if, put braces around the inner if.</p>' },
      16: { image: false, blocks: [para('Adding a semicolon at the end of an if clause is a common mistake.'), note('Wrong'), code('if (radius >= 0);\n{\n  area = radius*radius*PI;\n  System.out.println(\n    "The area for the circle of radius " +\n    radius + " is " + area);\n}'), para('This mistake is hard to find, because it is not a compilation error or a runtime error, it is a logic error. This error often occurs when you use the next-line block style.')],
        explain: '<p>A semicolon after <code>if (…)</code> ends the if at once. The block below is not part of the if any more, so it <b>always</b> runs. The program compiles and runs, but gives wrong answers: a {{logic error|خطأ منطقي}}.</p>' },
      17: { image: false, blocks: [{ type: 'h', html: 'TIP' }, code('if (number % 2 == 0)\n  even = true;\nelse\n  even = false;'), note('Equivalent'), code('boolean even\n  = number % 2 == 0;'), { type: 'h', html: 'CAUTION' }, code('if (even == true)\n  System.out.println(\n    "It is even.");'), note('Equivalent'), code('if (even)\n  System.out.println(\n    "It is even.");')],
        explain: '<p>A comparison already gives true or false, so you can store it straight into a boolean, without if-else. And if a variable is already a boolean, write <code>if (even)</code> instead of <code>if (even == true)</code>.</p>' },
      18: { image: false, blocks: [{ type: 'html', html: tblH(['Operator', 'Name', 'Description'], [['<code>!</code>', 'not', 'logical negation'], ['<code>&amp;&amp;</code>', 'and', 'logical conjunction'], ['<code>||</code>', 'or', 'logical disjunction'], ['<code>^</code>', 'exclusive or', 'logical exclusion']]) }],
        explain: '<p><b>{{Logical operators|عامل منطقي}}</b> join or change boolean values, so you can ask bigger questions: “is it divisible by 2 <b>and</b> by 3?”.</p>' },
      19: { image: false, title: 'Truth Tables', blocks: [{ type: 'html', html: tblH(['p', '!p'], [['false', '<b>true</b>'], ['true', '<b>false</b>']]) + tblH(['p1', 'p2', 'p1 &amp;&amp; p2'], [['false', 'false', '<b>false</b>'], ['false', 'true', '<b>false</b>'], ['true', 'false', '<b>false</b>'], ['true', 'true', '<b>true</b>']]) + tblH(['p1', 'p2', 'p1 || p2'], [['false', 'false', '<b>false</b>'], ['false', 'true', '<b>true</b>'], ['true', 'false', '<b>true</b>'], ['true', 'true', '<b>true</b>']]) + tblH(['p1', 'p2', 'p1 ^ p2'], [['false', 'false', '<b>false</b>'], ['false', 'true', '<b>true</b>'], ['true', 'false', '<b>true</b>'], ['true', 'true', '<b>false</b>']]) }],
        explain: '<p>A <b>truth table</b> lists every combination. Short rules: <code>!</code> flips; <code>&amp;&amp;</code> needs <b>both</b> true; <code>||</code> needs <b>at least one</b> true; <code>^</code> needs them to be <b>different</b>. Press the buttons above the drawing for each row.</p>' },
      20: { image: false, blocks: [para('Here is a program that checks whether a number is divisible by 2 and 3, whether a number is divisible by 2 or 3, and whether a number is divisible by 2 or 3 but not both:'), code('if ((number % 2 == 0) && (number % 3 == 0))\n  System.out.println(number + " is divisible by 2 and 3");\nelse if ((number % 2 == 0) || (number % 3 == 0))\n  System.out.println(number + " is divisible by 2 or 3");\nif ((number % 2 == 0) ^ (number % 3 == 0))\n  System.out.println(number + " is divisible by 2 or 3, but not both");')],
        explain: '<p>The three operators in one program. Note that the <code>^</code> test is a <b>separate</b> if, so it is checked every time. Try 6, 4, 9 and 7 in the drawing.</p>' },
      21: { image: false, blocks: [para('This program first prompts the user to enter a year as an int value and checks if it is a leap year.'), para('A year is a leap year if it is divisible by 4 but not by 100, or it is divisible by 400.'), code('(year % 4 == 0 && year % 100 != 0) ||\n(year % 400 == 0)')],
        explain: '<p>The {{leap year|سنة كبيسة}} rule becomes one boolean expression. Read it in two parts: (divisible by 4 <b>and</b> not by 100) <b>or</b> (divisible by 400). Try 2024, 1900, 2000 and 2023.</p>' },
      22: { image: false, blocks: [para('The switch statement is the only other kind of Java statement that implements multiway branching'), bul('When a switch statement is evaluated, one of a number of different branches is executed', 1), bul('The choice of which branch to execute is determined by a controlling expression enclosed in parentheses after the keyword switch', 1), { type: 'bullet', level: 1, html: 'The controlling expression must evaluate to a <code>char</code>, <code>int</code>, <code>short</code>, or <code>byte</code>' }],
        explain: '<p>A <b>{{switch|جملة اختيار متعدد}}</b> is another way to choose between many paths. It looks at one value (the <b>controlling expression</b>) and jumps to the matching branch. The value must be a char, int, short or byte.</p>' },
      23: { image: false, explain: '<p>Each branch starts with <code>case</code>, a constant (the <b>case label</b>) and a colon. Labels must have the same type as the controlling expression, and each label can appear only once. A branch usually ends with <code>break;</code>.</p>' },
      24: { image: false, explain: '<p>The <b>{{default|الحالة الافتراضية}}</b> section is optional and usually last. It runs when no case label matches, so it is a good place for an error message. It is good practice to include it.</p>' },
      25: { image: false, explain: '<p>Important: after a matching case runs, Java keeps going <b>until a {{break|إيقاف / خروج}}</b> (or the end of the switch). If you forget a break, the next case runs too: this is called <b>{{fall through|التسرّب إلى الحالة التالية}}</b>. The compiler does not warn you. The drawing shows it with x = 2.</p>' },
      26: { image: false, title: 'switch Statement Rules', blocks: [code('switch (switch-expression) {\n  case value1: statement(s)1;\n       break;\n  case value2: statement(s)2;\n       break;\n  …\n  case valueN: statement(s)N;\n       break;\n  default: statement(s)-for-default;\n}'), para('The switch-expression must yield a value of char, byte, short, or int type and must always be enclosed in parentheses.'), para('The value1, ..., and valueN must have the same data type as the value of the switch-expression. The resulting statements in the case statement are executed when the value in the case statement matches the value of the switch-expression. Note that value1, ..., and valueN are constant expressions, meaning that they cannot contain variables in the expression, such as 1 + x.')],
        explain: '<p>The rules again, with the general form. Case values are <b>constants</b>: you cannot write <code>case 1 + x:</code>.</p>' },
      27: { image: false, title: 'switch Statement Rules', blocks: [code('switch (switch-expression) {\n  case value1: statement(s)1;\n       break;\n  case value2: statement(s)2;\n       break;\n  …\n  case valueN: statement(s)N;\n       break;\n  default: statement(s)-for-default;\n}'), para('The keyword break is optional, but it should be used at the end of each case in order to terminate the remainder of the switch statement. If the break statement is not present, the next case statement will be executed.'), para('The default case, which is optional, can be used to perform actions when none of the specified cases matches the switch-expression. When the value in a case statement matches the value of the switch-expression, the statements starting from this case are executed until either a break statement or the end of the switch statement is reached.')],
        explain: '<p>break is optional for the compiler, but you almost always want it. Without it, the statements of the next case also run.</p>' },
      28: { image: false, blocks: [code('switch (Controlling_Expression)\n{\n  case Case_Label_1:\n           Statement_Sequence_1\n           break;\n  case Case_Label_2:\n           Statement_Sequence_2\n           break;\n  …\n  case Case_Label_n:\n           Statement_Sequence_n\n           break;\n  default:\n           Default_Statement Sequence\n           break;\n}')],
        explain: '<p>The same structure with general names. This is a <b>template</b>: it is not real code.</p>' },
      29: { image: false, title: 'Trace switch statement', blocks: [note('Suppose day is 2:'), code('switch (day) {\n  case 1:\n  case 3:\n      System.out.println("Weekday");\n      break;\n  case 2:\n  case 4:\n  case 5: System.out.println("Weekday"); break;\n  case 0:\n  case 6: System.out.println("Weekend");\n  default:\n  ;\n}')],
        explain: '<p>Now a trace. Several case labels can share the same statements: write them one after another. Suppose day is 2. (The next slides use a shorter version of this switch.)</p>' },
      30: swSlide('Match case 2', '<p>Java jumps to <code>case 2:</code>.</p>'),
      31: swSlide('Fall through case 3', '<p>case 2 has no statements and no break, so Java <b>falls through</b> to case 3.</p>'),
      32: swSlide('Fall through case 4', '<p>Still no break: fall through to case 4.</p>'),
      33: swSlide('Fall through case 5', '<p>And to case 5, which prints Weekday.</p>'),
      34: swSlide('Encounter break', '<p>Then Java meets <code>break</code>.</p>'),
      35: swSlide('Exit the statement', '<p>break ends the switch. Java continues after the closing brace.</p>'),
      36: { image: false, title: 'The switch Statement Example', blocks: [code('int month=-3;\nswitch(month) {\n  case 1:\n    System.out.println("January");\n    break;\n  case 2:\n    System.out.println("February");\n    break;\n  case 3:\n    System.out.println("March");\n    break;\n  case 4:\n    System.out.println("April");\n    break;\n  case 5:\n    System.out.println("May");\n    break;\n  case 6:\n    System.out.println("June");\n    break;')],
        explain: '<p>A full example: print the name of a month. Here month is -3, which is not a real month. Which part of the switch will run? See the next slide.</p>' },
      37: { image: false, title: 'The switch Statement Example', blocks: [code('  case 7:\n    System.out.println("July");\n    break;\n  case 8:\n    System.out.println("August");\n    break;\n  case 9:\n    System.out.println("September");\n    break;\n  case 10:\n    System.out.println("October");\n    break;\n  case 11:\n    System.out.println("November");\n    break;\n  case 12:\n    System.out.println("December");\n    break;\n  default:\n    System.out.println("Invalid Month");\n    break;\n}')],
        explain: '<p>No case matches -3, so the <b>default</b> runs and prints “Invalid Month”. This is why default is useful.</p>' },
      38: { image: false, title: 'The switch Statement Example', blocks: [code('char sClass=\'B\';\nswitch (sClass) {\n  case \'B\':  case \'b\':\n    System.out.printf("Battleship\\n");\n    break;\n  case \'C\':  case \'c\':\n    System.out.printf("Cruiser\\n");\n    break;\n  case \'D\':  case \'d\':\n    System.out.printf("Destroyer\\n");\n    break;\n  case \'F\':  case \'f\':\n    System.out.printf("Frigate\\n");\n    break;\n  default:\n    System.out.printf("Unknown ship class %c\\n", sClass);\n    break;\n}')],
        explain: '<p>A switch on a <b>char</b>. Two labels for each ship let the user type a capital or a small letter. <code>%c</code> in printf prints a char.</p>' },
      39: { image: false, blocks: [code('(testCondition) ? value1 : value2;'), para('As described in the Sun documentation, this statement can be read as "If testCondition is true, assign the value of value1 to result; otherwise, assign the value of value2 to result."'), code('if (x > 0)\n  y = 1\nelse\n  y = -1;'), para('is equivalent to'), code('y = (x > 0) ? 1 : -1;')],
        explain: '<p>The <b>{{ternary|ثلاثي: شرط ? قيمة : قيمة}} operator</b> is a short if-else that gives a <b>value</b>. Read <code>(x > 0) ? 1 : -1</code> as: “is x > 0? If yes, 1; if not, -1”.</p>' },
      40: { image: false, blocks: [para('The expression in the parentheses (..) is evaluated first'), code('var++, var--\n+, - (Unary plus and minus), ++var,--var\n(type) Casting\n! (Not)\n*, /, % (Multiplication, division, and remainder)\n+, - (Binary addition and subtraction)\n<, <=, >, >= (Relational operators)\n==, !=; (Equality)\n^ (Exclusive OR)\n&& (Conditional AND) Short-circuit AND\n|| (Conditional OR) Short-circuit OR\n=, +=, -=, *=, /=, %= (Assignment operator)'), { type: 'paragraph', html: 'When two operators with the same precedence → <i>left-associative</i>. However, assignment operators are right associative' }],
        explain: '<p>When an expression has many operators, <b>{{precedence|أولوية العمليات}}</b> decides the order: the higher one in this list goes first. Operators with the same precedence go from left to right; assignment goes from right to left.</p>' },
      41: { image: false, blocks: [para('Applying the operator precedence and associativity rule, the expression 3 + 4 * 4 > 5 * (4 + 3) - 1 is evaluated as follows:'), { type: 'code', lang: 'none', text: '3 + 4 * 4 > 5 * (4 + 3) - 1     (1) inside parentheses first\n3 + 4 * 4 > 5 * 7 - 1           (2) multiplication\n3 + 16 > 5 * 7 - 1              (3) multiplication\n3 + 16 > 35 - 1                 (4) addition\n19 > 35 - 1                     (5) subtraction\n19 > 34                         (6) greater than\nfalse' }],
        explain: '<p>The arithmetic is done first, then the comparison <code>></code>. The final value is a boolean: false. Try other expressions in the drawing.</p>' },
      42: { image: false, explain: '<p>Logic errors are called <b>bugs</b>, and finding and fixing them is <b>{{debugging|تصحيح الأخطاء}}</b>. A debugger lets you run the program one statement at a time, stop it at a <b>{{breakpoint|نقطة توقّف}}</b>, and look at (or change) the variables.</p>' }
    },
    visuals: ALL,
    exam: {
      questions: [
        { type: 'output', q: 'What does this print?', code: 'int a = 4;\nSystem.out.println(a != 4);', answer: 'false', review: 3, why: 'a is 4, so “a is not equal to 4” is false.' },
        { q: 'Which line has a syntax error?', options: ['if (x > 0) y = 1;', 'if x > 0 y = 1;', 'if (x > 0) { y = 1; }'], answer: 1, review: 6, why: 'The condition must be inside parentheses.' },
        { type: 'output', q: 'What does this print?', code: 'int n = 12;\nif (n % 5 == 0)\n  System.out.println("HiFive");\nif (n % 2 == 0)\n  System.out.println("HiEven");', answer: 'HiEven', review: 7, why: '12 is not a multiple of 5, but it is even.' },
        { type: 'output', q: 'What does this print?', code: 'int t = 30;\nif (t > 25)\n  System.out.println("hot");\nelse\n  System.out.println("cool");', answer: 'hot', review: 8, why: '30 > 25 is true.' },
        { type: 'output', q: 'score is 70. What does the else-if chain print?', code: GRADE_ELSEIF, answer: 'C', review: 12, why: '70 >= 90 false, 70 >= 80 false, 70 >= 70 true.' },
        { type: 'output', q: 'What does this print?', code: 'int i = 5, j = 2, k = 9;\nif (i > j)\n  if (i > k)\n    System.out.println("A");\n  else\n    System.out.println("B");', answer: 'B', review: 15, why: 'i > j is true, i > k is false, so the else of the inner if runs.' },
        { q: 'Why is this code wrong?', code: 'if (x > 10);\n  System.out.println("big");', options: ['It never prints, because the if is empty', 'It is a syntax error: if cannot end with ;', 'The ; ends the if, so "big" is always printed'], answer: 2, review: 16, why: 'A logic error: the println is not part of the if.' },
        { type: 'output', q: 'What does this print?', code: 'int number = 7;\nboolean even = number % 2 == 0;\nSystem.out.println(even);', answer: 'false', review: 17, why: '7 % 2 is 1.' },
        { type: 'output', q: 'What does this print?', code: 'System.out.println(!(3 > 2) || (5 == 5));', answer: 'true', review: 19, why: '!(true) is false, (5 == 5) is true, false || true is true.' },
        { type: 'output', q: 'number is 6. What does this print?', code: 'if ((number % 2 == 0) ^ (number % 3 == 0))\n  System.out.println("not both");\nelse\n  System.out.println("both or none");', answer: 'both or none', review: 20, why: 'Both tests are true, and true ^ true is false.' },
        { q: 'Which years are leap years?', options: ['2000 and 2024', '1900 and 2024', '2000 and 2023'], answer: 0, review: 21, why: '2000 is divisible by 400; 2024 by 4 and not by 100. 1900 and 2023 are not.' },
        { type: 'output', q: 'What does this print?', code: 'int day = 3;\nswitch (day) {\n  case 1:\n  case 2:\n  case 3: System.out.println("early"); break;\n  case 4: System.out.println("late");\n}', answer: 'early', review: 31, why: 'case 3 matches, prints early, then break.' },
        { type: 'output', q: 'What does this print?', code: 'int c = 1;\nswitch (c) {\n  case 1: System.out.println("A");\n  case 2: System.out.println("B");\n  default: System.out.println("C");\n}', answer: 'A\nB\nC', review: 25, why: 'There is no break, so it falls through all the way to the end.' },
        { type: 'output', q: "What does this print? (slide 38)", code: "char sClass = 'd';\nswitch (sClass) {\n  case 'D': case 'd': System.out.println(\"Destroyer\"); break;\n  default: System.out.println(\"Unknown\");\n}", answer: 'Destroyer', review: 38, why: "'d' matches the second label of that case." },
        { type: 'output', q: 'What does this print?', code: 'int x = 0;\nint y = (x > 0) ? 1 : -1;\nSystem.out.println(y);', answer: '-1', review: 39, why: '0 > 0 is false, so y gets -1.' },
        { type: 'output', q: 'What does this print?', code: 'System.out.println(2 + 3 * 2 == 8);', answer: 'true', review: 41, why: '3 * 2 = 6, 2 + 6 = 8, and 8 == 8 is true.' },
        { type: 'write', q: 'Write an if-else: if temp is greater than 30 print Hot, otherwise print Nice.', rows: 4, checks: [{ re: /if\s*\(\s*temp\s*>\s*30\s*\)/, label: 'if (temp > 30)' }, { re: /println\s*\(\s*"Hot"\s*\)\s*;[\s\S]*else[\s\S]*println\s*\(\s*"Nice"\s*\)\s*;/, label: 'print Hot, else print Nice' }], solution: 'if (temp > 30)\n  System.out.println("Hot");\nelse\n  System.out.println("Nice");', review: 8, why: 'One block for true, one block after else for false.' },
        { type: 'write', q: 'Using the ?: operator, store "pass" in a new String s if mark is 50 or more, otherwise "fail".', checks: [{ re: /String\s+s\s*=\s*\(?\s*mark\s*>=\s*50\s*\)?\s*\?\s*"pass"\s*:\s*"fail"\s*;/, label: 'String s = (mark >= 50) ? "pass" : "fail";' }], solution: 'String s = (mark >= 50) ? "pass" : "fail";', review: 39, why: '(condition) ? value-if-true : value-if-false' },
        { type: 'trace', q: 'What does this print for each x and y?', code: 'if (x > 0)\n  if (y > 0)\n    System.out.println("A");\n  else\n    System.out.println("B");\nelse\n  System.out.println("C");', cols: ['x', 'y', 'printed'], rows: [['1', '1', '?A'], ['1', '-1', '?B'], ['-1', '5', '?C']], review: 15, why: 'The first else belongs to the nearest if (y > 0); the last else belongs to if (x > 0).' },
        { type: 'bug', q: 'This switch does not compile. Tap the wrong line.', code: 'double d = 2.0;\nswitch (d) {\n  case 2: System.out.println("two");\n}', answer: 2, review: 22, why: 'The switch expression must be a char, byte, short or int, not a double.' },
        { type: 'match', q: 'Match each operator with when it gives true.', pairs: [['&&', 'Only when both sides are true'], ['||', 'When at least one side is true'], ['!', 'When its operand is false']], review: 18, why: 'and, or, not.' },
        { type: 'fill', q: 'Complete the leap year test.', code: 'boolean isLeap = (year % 4 == 0 ___ year % 100 != 0) ___ (year % 400 == 0);', answer: ['&&', '||'], review: 21, why: 'Divisible by 4 and not by 100, or divisible by 400.' }
      ],
      tasks: [
        {
          title: 'Even or odd',
          task: '<p>Read an int from the keyboard. If it is even, print <code>even</code>; otherwise print <code>odd</code>. Use <code>%</code> and an <b>if-else</b>.</p>',
          starter: 'import java.util.Scanner;\n\npublic class EvenOdd {\n  public static void main(String[] args) {\n    Scanner input = new Scanner(System.in);\n    \n  }\n}',
          output: 'Enter a number: 7\nodd',
          checks: [
            { re: /int\s+\w+\s*=\s*input\.nextInt\s*\(\s*\)\s*;/, label: 'Reads an int with <code>input.nextInt()</code>', review: 4 },
            { re: /if\s*\(\s*\w+\s*%\s*2\s*==\s*0\s*\)/, label: 'Tests <code>number % 2 == 0</code> in the if', review: 17 },
            { re: /println\s*\(\s*"even"\s*\)/, label: 'Prints even', review: 8 },
            { re: /else[\s\S]*println\s*\(\s*"odd"\s*\)/, label: 'Prints odd in the else part', review: 8 },
            { fn: braces, label: 'Braces match', review: 5 }
          ],
          solution: 'import java.util.Scanner;\n\npublic class EvenOdd {\n  public static void main(String[] args) {\n    Scanner input = new Scanner(System.in);\n    System.out.print("Enter a number: ");\n    int number = input.nextInt();\n    if (number % 2 == 0)\n      System.out.println("even");\n    else\n      System.out.println("odd");\n  }\n}'
        },
        {
          title: 'Leap year',
          task: '<p>The variable <code>year</code> is given. Store the leap year test of slide 21 in a <b>boolean</b> named <code>isLeapYear</code>. Then use it in an if-else to print <code>leap year</code> or <code>not a leap year</code>. Write <code>if (isLeapYear)</code>, not <code>if (isLeapYear == true)</code> (slide 17).</p>',
          starter: 'public class LeapYear {\n  public static void main(String[] args) {\n    int year = 2024;\n    \n  }\n}',
          output: 'leap year',
          checks: [
            { re: /boolean\s+isLeapYear\s*=/, label: 'Declares <code>boolean isLeapYear</code>', review: 17 },
            { re: /year\s*%\s*4\s*==\s*0\s*&&\s*year\s*%\s*100\s*!=\s*0/, label: 'Has <code>year % 4 == 0 && year % 100 != 0</code>', review: 21 },
            { re: /\|\|\s*\(?\s*year\s*%\s*400\s*==\s*0/, label: 'Has <code>|| year % 400 == 0</code>', review: 21 },
            { re: /if\s*\(\s*isLeapYear\s*\)/, label: 'Uses <code>if (isLeapYear)</code>', review: 17 },
            { re: /println\s*\(\s*"leap year"\s*\)[\s\S]*else[\s\S]*println\s*\(\s*"not a leap year"\s*\)/, label: 'Prints the two messages with if-else', review: 8 }
          ],
          solution: 'public class LeapYear {\n  public static void main(String[] args) {\n    int year = 2024;\n    boolean isLeapYear = (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);\n    if (isLeapYear)\n      System.out.println("leap year");\n    else\n      System.out.println("not a leap year");\n  }\n}'
        },
        {
          title: 'Day name with switch',
          task: '<p>The variable <code>day</code> is a number from 0 (Sunday) to 6 (Saturday). Use a <b>switch</b> to print the name of the day. Every case needs a <code>break</code>. Add a <code>default</code> that prints <code>Invalid day</code>.</p>',
          starter: 'public class DayName {\n  public static void main(String[] args) {\n    int day = 3;\n    \n  }\n}',
          output: 'Wednesday',
          checks: [
            { re: /switch\s*\(\s*day\s*\)/, label: 'Has <code>switch (day)</code>', review: 22 },
            { fn: function (c) { for (var i = 0; i <= 6; i++) if (!new RegExp('case\\s+' + i + '\\s*:').test(c)) return false; return true; }, label: 'Has case 0 to case 6', review: 23 },
            { re: /"Sunday"[\s\S]*"Monday"[\s\S]*"Tuesday"[\s\S]*"Wednesday"[\s\S]*"Thursday"[\s\S]*"Friday"[\s\S]*"Saturday"/, label: 'Prints the seven day names, Sunday first', review: 23 },
            { fn: function (c) { return (c.match(/\bbreak\s*;/g) || []).length >= 7; }, label: 'Each case ends with <code>break;</code> (at least 7 breaks)', review: 25 },
            { re: /default\s*:[\s\S]*"Invalid day"/, label: 'default prints Invalid day', review: 24 }
          ],
          solution: 'public class DayName {\n  public static void main(String[] args) {\n    int day = 3;\n    switch (day) {\n      case 0: System.out.println("Sunday"); break;\n      case 1: System.out.println("Monday"); break;\n      case 2: System.out.println("Tuesday"); break;\n      case 3: System.out.println("Wednesday"); break;\n      case 4: System.out.println("Thursday"); break;\n      case 5: System.out.println("Friday"); break;\n      case 6: System.out.println("Saturday"); break;\n      default: System.out.println("Invalid day");\n    }\n  }\n}'
        }
      ]
    }
  });
})();
