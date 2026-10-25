/* CS1 · Unit 6 · Loops (31 slides): while, tracing, floating-point loop control, do-while, for, common mistakes,
   which loop to use, break, continue, nested loops, and sample problems (GCD, tuition, guessing, primes, confirmation dialog) */
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
  function tf(b) { return b ? 'true' : 'false'; }
  function I(x) { return Math.trunc(x); }
  function vbox(id, x, y, w, name, type, value, o) {
    return B(id, x, y, w, 48, mix({ tag: type + ' ' + name, title: value == null ? 'no value' : String(value), mono: true, size: 16, tone: value == null ? 'muted' : 'teal', dash: value == null, r: 6 }, o || {}));
  }
  function hot(o) { return mix(o || {}, { tone: 'accent', hi: true }); }
  function dia(id, x, y, w, h, text, state) { return B(id, x, y, w, h, { shape: 'diamond', title: text, mono: true, size: 12.5, tone: state === 'on' ? 'accent' : state === 'yes' ? 'teal' : state === 'no' ? 'red' : 'blue', hi: state === 'on' || state === 'yes' || state === 'no' }); }
  function act(id, x, y, w, h, text, state, o) { return B(id, x, y, w, h, mix({ title: text, mono: true, size: 12, tone: state === 'on' ? 'accent' : state === 'done' ? 'teal' : state === 'skip' ? 'muted' : 'blue', hi: state === 'on', dash: state === 'skip' }, o || {})); }
  function ln(id, x1, y1, x2, y2, used, o) { return A(id, x1, y1, x2, y2, mix({ tone: used ? 'accent' : 'muted' }, o || {})); }
  /* a little flowchart of a loop: init -> condition -> body -> back; false -> next statement */
  function loopChart(p, o) {
    var on = o.on || '', items = [];
    if (o.init) {
      items.push(act(p + 'init', 60, 8, 180, 34, o.init, on === 'init' ? 'on' : 'done'));
      items.push(ln(p + 'a0', 150, 42, 150, 66, on === 'init'));
    }
    items.push(dia(p + 'cond', 40, 68, 220, 80, o.cond, on === 'cond' ? (o.res == null ? 'on' : o.res ? 'yes' : 'no') : ''));
    items.push(ln(p + 'at', 150, 148, 150, 176, on === 'cond' && o.res === true, { label: 'true', la: 'start', lx: 8 }));
    items.push(act(p + 'body', 30, 178, 240, 30 + 16 * o.body.split('\n').length, o.body, on === 'body' ? 'on' : on === 'cond' && o.res === false ? 'skip' : ''));
    var by = 178 + 30 + 16 * o.body.split('\n').length;
    items.push(ln(p + 'back', 150, by, 38, 108, on === 'back', { via: [[150, by + 18], [16, by + 18], [16, 108]] }));
    items.push(ln(p + 'af', 262, 108, 306, 296, on === 'cond' && o.res === false || on === 'exit', { via: [[306, 108]], label: 'false', la: 'start', lx: 6, ly: 2 }));
    items.push(B(p + 'next', 240, 298, 132, 32, { title: 'next statement', size: 12, tone: on === 'exit' ? 'accent' : 'muted', hi: on === 'exit' }));
    return items;
  }

  /* ---------- 1. the while loop, traced (slides 2-11) ---------- */
  var whileloop = {
    id: 'whileloop', slides: [2, 11], title: 'Trace a while loop',
    inputs: [{ id: 'n', label: 'count <', value: 2, min: 0, max: 6 }],
    presets: [{ label: 'count < 2 (slides)', values: { n: 2 } }, { label: 'count < 3', values: { n: 3 } }, { label: 'count < 0', values: { n: 0 } }],
    code: function (v) { return 'int count = 0;\nwhile (count < ' + I(v.n) + ') {\n  System.out.println("Welcome to Java!");\n  count++;\n}'; },
    steps: function (v) {
      var n = I(v.n), st = [
        { line: 2, slide: 2, ph: '', c: null, cap: 'A <b>while loop</b> repeats its body <b>while</b> the loop-continuation-condition is true. The condition is checked <b>before</b> every repetition. (Slide 2 uses <code>count < 100</code>: “Welcome to Java!” 100 times. Here we trace a small number.)' },
        { slide: 3, line: 1, ph: 'init', c: 0, cap: 'Initialize count: <code>int count = 0;</code>' }
      ];
      for (var i = 0; i < n; i++) {
        st.push({ slide: i ? 7 : 4, line: 2, ph: 'cond', res: true, c: i, cap: '(count < ' + n + ') is <b>true</b>' + (i ? ', still, since count is ' + i : '') + '. Go into the body.' });
        st.push({ slide: i ? 8 : 5, line: 3, ph: 'body', c: i, cap: 'Print Welcome to Java. (Line ' + (i + 1) + ' of the output.)', out: 'Welcome to Java!' });
        st.push({ slide: i ? 9 : 6, line: 4, ph: 'back', c: i + 1, cap: 'Increase count by 1: count is <b>' + (i + 1) + '</b> now. Go back up to the condition.' });
      }
      st.push({ slide: 10, line: 2, ph: 'cond', res: false, c: n, cap: '(count < ' + n + ') is <b>false</b> since count is ' + n + ' now.' + (n === 0 ? ' It was false the very first time, so the body never runs.' : '') });
      st.push({ slide: 11, line: 5, ph: 'exit', c: n, cap: 'The loop exits. Execute the next statement after the loop. The body ran <b>' + n + '</b> time' + (n === 1 ? '' : 's') + '.' });
      return st;
    },
    draw: function (k, s, v) {
      var n = I(v.n);
      var items = loopChart('w', { init: 'count = 0', cond: 'count < ' + n, body: 'System.out.println(...);\ncount++;', on: s.ph, res: s.res });
      items.push(vbox('cv', 390, 40, 150, 'count', 'int', s.c, s.ph === 'init' || s.ph === 'back' ? hot() : {}));
      items.push(T('runs', 465, 150, 'printed: ' + (s.ph === 'body' ? s.c + 1 : s.ph === '' || s.ph === 'init' ? 0 : s.c) + ' time(s)', { anchor: 'middle', mono: true, size: 13, bold: true, tone: s.ph === 'body' ? 'accent' : 'ink' }));
      if (s.ph === 'cond') items.push(T('test', 465, 200, s.c + ' < ' + n + '  →  ' + tf(s.res), { anchor: 'middle', mono: true, size: 15, bold: true, tone: s.res ? 'teal' : 'red' }));
      return items;
    }
  };

  /* ---------- 2. floating-point loop control (slide 12) ---------- */
  var FLOAT = 'double item = 1;\ndouble sum = 0;\nwhile (item != 0) { // No guarantee item will be 0\n  sum += item;\n  item -= 0.1;\n}\nSystem.out.println(sum);';
  function floatSeq() { var item = 1, sum = 0, out = []; for (var i = 0; i < 13; i++) { out.push({ item: item, sum: sum }); sum += item; item -= 0.1; } return out; }
  var floatloop = {
    id: 'floatloop', slides: [12, 12], title: 'item is never exactly 0', code: FLOAT,
    steps: (function () {
      var q = floatSeq(), st = [{ line: '1-2', i: -1, cap: 'The plan: add 1 + 0.9 + 0.8 + … + 0.1, and stop when item becomes 0.' }];
      [0, 1, 2, 3].forEach(function (i) { st.push({ line: '3-5', i: i, cap: 'item = ' + jd(q[i].item) + ': not 0, so add it and subtract 0.1.' + (i === 3 ? ' Look: item is now ' + jd(q[4].item) + ', not 0.6. 0.1 cannot be stored exactly.' : '') }); });
      st.push({ line: '3-5', i: 9, cap: 'After 10 subtractions item should be 0, but it is ' + jd(q[10].item) + ': a tiny number, <b>not 0</b>. So <code>item != 0</code> is still true!' });
      st.push({ line: '3-5', i: 11, cap: 'item goes on: ' + jd(q[11].item) + ', ' + jd(q[12].item) + ', … It jumps <b>over</b> 0 and never equals it, so the loop never ends (an infinite loop).' });
      st.push({ line: 3, i: 12, cap: 'The fix: never test doubles with <code>==</code> or <code>!=</code> in a loop. Use a condition like <code>item > 0.05</code>, or count with an int.' });
      return st;
    })(),
    draw: function (k, s) {
      var q = floatSeq(), items = [], X = function (t) { return 40 + (1 - t) * 400; };
      items.push(A('axis', 30, 250, 540, 250, { head: false, tone: 'muted' }));
      [1, 0.5, 0].forEach(function (t, i) { items.push(T('tk' + i, X(t), 274, jd(t), { anchor: 'middle', mono: true, size: 12 })); });
      items.push(B('zero', X(0) - 2, 226, 4, 48, { tone: 'red', fill: 'solid', r: 1 }));
      for (var i = 0; i <= Math.max(s.i, 0) && i < q.length; i++) {
        if (s.i < 0) break;
        items.push(B('d' + i, X(q[i].item) - 6, 244, 12, 12, { shape: 'oval', fill: 'solid', tone: i === s.i ? 'accent' : 'blue' }));
      }
      var rows = s.i < 0 ? [] : s.i <= 3 ? [0, 1, 2, 3, 4].slice(0, s.i + 2) : [9, 10, 11, 12].slice(0, s.i - 7);
      rows.forEach(function (r, j) { items.push(T('r' + j, 40, 40 + j * 34, 'item = ' + jd(q[r].item), { mono: true, size: 15, bold: r === s.i + 1 || r === s.i, tone: r >= 10 ? 'red' : 'ink' })); });
      if (s.i >= 9) items.push(T('nz', 540, 214, 'never exactly 0', { anchor: 'end', bold: true, tone: 'red', size: 14 }));
      return items;
    }
  };

  /* ---------- 3. do-while (slide 13) ---------- */
  var dowhile = {
    id: 'dowhile', slides: [13, 13], title: 'do-while: the body runs first',
    inputs: [{ id: 's', label: 'i starts at', value: 0, min: -5, max: 9 }],
    presets: [{ label: 'start 0', values: { s: 0 } }, { label: 'start 2', values: { s: 2 } }, { label: 'start 5', values: { s: 5 } }],
    code: function (v) { return 'int i = ' + I(v.s) + ';\ndo {\n  System.out.println("i is " + i);\n  i++;\n} while (i < 3);'; },
    steps: function (v) {
      var i = I(v.s), st = [{ line: 1, ph: 'init', c: i, cap: 'i starts at ' + i + '. A do-while loop does <b>not</b> check first.' }], guard = 0;
      do {
        st.push({ line: '3-4', ph: 'body', c: i, cap: 'Run the body: print, then i becomes ' + (i + 1) + '.' + (guard === 0 ? ' The body always runs at least once.' : ''), out: 'i is ' + i });
        i++;
        st.push({ line: 5, ph: 'cond', res: i < 3, c: i, cap: 'Now check <code>i < 3</code>: ' + i + ' < 3 is <b>' + tf(i < 3) + '</b>' + (i < 3 ? ', so go back to do.' : ', so the loop ends.') });
        guard++;
      } while (i < 3 && guard < 12);
      var s0 = I(v.s);
      st.push({ line: 5, ph: 'exit', c: i, cap: s0 >= 3 ? 'Compare: a <b>while</b> loop with the same condition would check first and print <b>nothing</b>, because ' + s0 + ' < 3 is false from the start.' : 'Here a while loop would print the same lines. The difference shows only when the condition is false at the start: try “start 5”.' });
      return st;
    },
    draw: function (k, s) {
      var items = [];
      items.push(act('init', 60, 8, 180, 34, 'i = start', s.ph === 'init' ? 'on' : 'done'));
      items.push(ln('a0', 150, 42, 150, 66, s.ph === 'init'));
      items.push(act('body', 30, 68, 240, 62, 'System.out.println("i is " + i);\ni++;', s.ph === 'body' ? 'on' : ''));
      items.push(ln('a1', 150, 130, 150, 160, s.ph === 'body'));
      items.push(dia('cond', 40, 162, 220, 80, 'i < 3', s.ph === 'cond' ? (s.res ? 'yes' : 'no') : ''));
      items.push(ln('back', 38, 202, 28, 99, s.ph === 'cond' && s.res, { via: [[16, 202], [16, 99]], label: 'true', la: 'start', lx: 4, ly: -6 }));
      items.push(ln('af', 150, 242, 150, 290, s.ph === 'cond' && !s.res || s.ph === 'exit', { label: 'false', la: 'start', lx: 8 }));
      items.push(B('next', 84, 292, 132, 32, { title: 'next statement', size: 12, tone: s.ph === 'exit' ? 'accent' : 'muted', hi: s.ph === 'exit' }));
      items.push(vbox('iv', 390, 40, 150, 'i', 'int', s.c, s.ph === 'body' ? hot() : {}));
      items.push(T('nt', 465, 160, 'body first,', { anchor: 'middle', bold: true, size: 14, tone: 'accent' }), T('nt2', 465, 182, 'test after', { anchor: 'middle', bold: true, size: 14, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 4. the for loop (slide 14) ---------- */
  var forloop = {
    id: 'forloop', slides: [14, 14], title: 'The parts of a for loop',
    inputs: [{ id: 'n', label: 'i <', value: 3, min: 0, max: 6 }],
    presets: [{ label: 'i < 3', values: { n: 3 } }, { label: 'i < 1', values: { n: 1 } }, { label: 'i < 0', values: { n: 0 } }],
    code: function (v) { return 'int i;\nfor (i = 0; i < ' + I(v.n) + '; i++) {\n  System.out.println("Welcome to Java!");\n}'; },
    steps: function (v) {
      var n = I(v.n), st = [{ line: 2, ph: '', c: null, cap: 'A for loop puts three things in its header: the <b>initial-action</b> (<code>i = 0</code>), the <b>loop-continuation-condition</b> (<code>i < ' + n + '</code>) and the <b>action-after-each-iteration</b> (<code>i++</code>). (Slide 14 uses <code>i < 100</code>.)' },
        { line: 2, ph: 'init', c: 0, cap: '① The initial-action runs <b>once</b>, at the start: i = 0.' }];
      for (var i = 0; i < n; i++) {
        st.push({ line: 2, ph: 'cond', res: true, c: i, cap: '② Check the condition: ' + i + ' < ' + n + ' is <b>true</b>.' });
        st.push({ line: 3, ph: 'body', c: i, cap: '③ Run the body.', out: 'Welcome to Java!' });
        st.push({ line: 2, ph: 'back', c: i + 1, cap: '④ The action-after-each-iteration: i++ makes i ' + (i + 1) + '. Then back to ②.' });
      }
      st.push({ line: 2, ph: 'cond', res: false, c: n, cap: '② ' + n + ' < ' + n + ' is <b>false</b>: the loop ends. The body ran ' + n + ' time' + (n === 1 ? '' : 's') + '.' });
      return st;
    },
    draw: function (k, s, v) {
      var n = I(v.n), items = [], parts = [['for (', null], ['i = 0', 'init'], ['; ', null], ['i < ' + n, 'cond'], ['; ', null], ['i++', 'back'], [') { body }', 'body']];
      var x = 40;
      parts.forEach(function (p, i) {
        var w = 14 + p[0].length * 10;
        if (p[1]) items.push(B('h' + i, x, 30, w, 44, { title: p[0], mono: true, size: 15, tone: s.ph === p[1] ? (p[1] === 'cond' && s.res === false ? 'red' : 'accent') : 'blue', hi: s.ph === p[1] }));
        else items.push(T('h' + i, x + w / 2, 58, p[0], { anchor: 'middle', mono: true, size: 15, bold: true }));
        if (p[1]) items.push(T('n' + i, x + w / 2, 96, { init: '① once', cond: '② each time', back: '④ after body', body: '③' }[p[1]], { anchor: 'middle', size: 12, tone: s.ph === p[1] ? 'accent' : 'muted', bold: s.ph === p[1] }));
        x += w + 4;
      });
      items.push(vbox('iv', 40, 150, 150, 'i', 'int', s.c, s.ph === 'init' || s.ph === 'back' ? hot() : {}));
      if (s.ph === 'cond') items.push(T('t', 230, 180, s.c + ' < ' + n + '  →  ' + tf(s.res), { mono: true, size: 16, bold: true, tone: s.res ? 'teal' : 'red' }));
      var order = ['①', '②', '③', '④', '②', '③', '④', '②', '…'];
      items.push(T('ord', 280, 290, 'order: ' + order.join(' → '), { anchor: 'middle', mono: true, size: 13, tone: 'muted' }));
      return items;
    }
  };

  /* ---------- 5. unusual for loops (slides 15-16) ---------- */
  var fornotes = {
    id: 'fornotes', slides: [15, 16], title: 'Unusual (but correct) for loops',
    code: 'for (int i = 1; i < 100; System.out.println(i++));\n\nfor (int i = 0, j = 0; (i + j < 10); i++, j++) {\n  // Do something\n}\n\nfor ( ; ; ) {\n  // Do something\n}',
    steps: [
      { slide: 15, line: 1, ph: 'a', cap: 'The body is empty (just <code>;</code>). The printing is done in the action-after-each-iteration: <code>System.out.println(i++)</code> prints i, then adds 1.', out: ['1', '2', '3', '…', '99'] },
      { slide: 15, line: 3, ph: 'b', cap: 'The initial-action can have <b>two</b> parts with a comma: <code>int i = 0, j = 0</code>. The action-after-each-iteration too: <code>i++, j++</code>.', clear: true },
      { slide: 15, line: 3, ph: 'c', cap: 'Trace: (0, 0) sum 0, (1, 1) sum 2, (2, 2) sum 4, (3, 3) sum 6, (4, 4) sum 8, then (5, 5) sum 10 is not < 10. The body runs <b>5</b> times.' },
      { slide: 16, line: 7, ph: 'd', cap: 'If the condition is left out, it is <b>true</b>: <code>for ( ; ; )</code> is an infinite loop. It is correct Java, but <code>while (true)</code> means the same and is clearer.' }
    ],
    draw: function (k, s) {
      var items = [];
      if (k === 0) {
        items.push(B('h', 30, 30, 500, 44, { title: 'for (int i = 1; i < 100; System.out.println(i++));', mono: true, size: 13, tone: 'blue' }));
        items.push(T('b', 280, 110, 'empty body:  ;', { anchor: 'middle', mono: true, size: 15, bold: true, tone: 'accent' }));
        items.push(T('p', 280, 150, 'the update prints: 1, 2, 3, …, 99', { anchor: 'middle', size: 15 }));
        return items;
      }
      if (k <= 2) {
        items.push(B('h', 30, 30, 500, 44, { title: 'for (int i = 0, j = 0; (i + j < 10); i++, j++)', mono: true, size: 13, tone: 'blue' }));
        if (k === 2) for (var t = 0; t <= 5; t++) {
          var ok = t + t < 10;
          items.push(B('r' + t, 40 + t * 82, 120, 74, 60, { title: '(' + t + ', ' + t + ')\nsum ' + (2 * t), mono: true, size: 12, tone: ok ? 'teal' : 'red' }));
          items.push(T('rt' + t, 77 + t * 82, 200, ok ? 'run' : 'stop', { anchor: 'middle', size: 12, bold: true, tone: ok ? 'teal' : 'red' }));
        }
        return items;
      }
      items.push(B('a', 40, 60, 200, 90, { tag: '(a)', lines: ['for ( ; ; ) {', '  // Do something', '}'], mono: true, tone: 'blue' }));
      items.push(T('eq', 280, 110, '=', { anchor: 'middle', size: 26, bold: true, tone: 'accent' }));
      items.push(B('b', 320, 60, 200, 90, { tag: '(b) clearer', lines: ['while (true) {', '  // Do something', '}'], mono: true, tone: 'teal', hi: true }));
      items.push(T('inf', 280, 230, 'no condition = always true = infinite loop', { anchor: 'middle', size: 14, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* ---------- 6. the extra semicolon (slides 17-18) ---------- */
  var semi = {
    id: 'semi', slides: [17, 18], title: 'One extra semicolon',
    code: 'for (int i=0; i<10; i++);\n{\n  // Do something\n}\n\nint i=0;\nwhile (i < 10);\n{\n  System.out.println("i is " + i);\n  i++;\n}',
    steps: [
      { slide: 17, line: 1, cap: 'The <code>;</code> right after the for header <b>is</b> the body: an empty statement. The loop runs 10 times and does nothing.' },
      { slide: 17, line: '2-4', cap: 'The block in braces is not part of the loop. It runs only <b>once</b>, after the loop. It compiles, but the result is wrong: a <b>logic error</b>.' },
      { slide: 18, line: 7, cap: 'The same with while: <code>while (i < 10);</code> repeats the empty statement. i never changes, so i < 10 stays true: an <b>infinite loop</b>.' },
      { slide: 18, line: '8-11', cap: 'The block that would change i is never reached. Nothing is printed, and the program never ends.' },
      { line: 7, slide: 18, cap: 'In a <b>do-while</b> loop the semicolon after <code>while (i<10)</code> is <b>needed</b>: it ends the statement. That one is correct.' }
    ],
    draw: function (k) {
      var items = [];
      if (k <= 1) {
        items.push(B('hd', 40, 30, 300, 44, { title: 'for (int i=0; i<10; i++) ;', mono: true, size: 15, tone: 'blue' }));
        items.push(B('sc', 300, 34, 30, 36, { title: '', fill: 'clear', tone: 'red', hi: k === 0, dash: true }));
        items.push(A('lp', 340, 52, 300, 40, { tone: k === 0 ? 'accent' : 'muted', bend: -40, label: '10 times, empty', la: 'start', lx: 30 }));
        items.push(act('blk', 40, 120, 300, 60, '{\n  // Do something\n}', k === 1 ? 'on' : ''));
        items.push(T('once', 360, 156, k === 1 ? 'runs once, after the loop' : '', { size: 14, bold: true, tone: 'red' }));
        return items;
      }
      if (k <= 3) {
        items.push(B('hd', 40, 30, 240, 44, { title: 'while (i < 10) ;', mono: true, size: 15, tone: 'blue' }));
        items.push(B('sc', 240, 34, 30, 36, { title: '', fill: 'clear', tone: 'red', dash: true, hi: k === 2 }));
        items.push(A('lp', 280, 52, 240, 40, { tone: 'red', bend: -40, label: 'forever: i stays 0', la: 'start', lx: 30 }));
        items.push(act('blk', 40, 120, 300, 76, '{\n  System.out.println(...);\n  i++;\n}', k === 3 ? 'skip' : ''));
        items.push(vbox('iv', 390, 120, 140, 'i', 'int', 0, {}));
        return items;
      }
      items.push(B('dw', 120, 40, 320, 110, { lines: ['int i=0;', 'do {', '  System.out.println("i is " + i);', '  i++;', '} while (i<10);'], mono: true, tone: 'teal', hi: true, tag: 'Correct' }));
      items.push(T('ok', 280, 210, 'here the ; ends the do-while statement', { anchor: 'middle', size: 14, bold: true, tone: 'teal' }));
      return items;
    }
  };

  /* ---------- 7. which loop? (slide 19) ---------- */
  var equiv = {
    id: 'equiv', slides: [19, 19], title: 'while and for can do the same job',
    inputs: [{ id: 'x', label: 'x starts at', value: 2, min: -3, max: 8 }],
    presets: [{ label: 'x = 2', values: { x: 2 } }, { label: 'x = 4', values: { x: 4 } }, { label: 'x = 7', values: { x: 7 } }],
    code: function (v) { return 'int x = ' + I(v.x) + ';\nwhile (x < 5) {\n  x++;\n}\n\nx = ' + I(v.x) + ';\nfor ( ; x < 5; ) {\n  x++;\n}'; },
    steps: function (v) {
      var x0 = I(v.x), n = Math.max(0, 5 - x0);
      return [
        { line: '2-4', cap: 'The while loop: x goes from ' + x0 + ' up to ' + Math.max(x0, 5) + '. The body runs <b>' + n + '</b> time' + (n === 1 ? '' : 's') + '.' },
        { line: '7-9', cap: 'The for loop with an empty initial-action and an empty update: exactly the same. Both run ' + n + ' time' + (n === 1 ? '' : 's') + '.' },
        { line: '2,7', cap: 'Which one to choose? A <b>for</b> loop when you know the number of repetitions; a <b>while</b> loop when you do not; a <b>do-while</b> when the body must run before the test.' }
      ];
    },
    draw: function (k, s, v) {
      var x0 = I(v.x), n = Math.max(0, 5 - x0), items = [];
      [['while (x < 5)', 0], ['for ( ; x < 5; )', 1]].forEach(function (p) {
        var y = 30 + p[1] * 110, on = k === p[1] || k === 2;
        items.push(B('l' + p[1], 30, y, 200, 44, { title: p[0], mono: true, size: 15, tone: on ? 'accent' : 'blue', hi: k === p[1] }));
        for (var i = 0; i < Math.max(n, 0) && i < 8; i++) items.push(B('c' + p[1] + i, 250 + i * 36, y + 4, 32, 36, { title: String(x0 + i + 1), mono: true, size: 13, tone: on ? 'teal' : 'muted', r: 4 }));
        if (!n) items.push(T('z' + p[1], 250, y + 28, 'body never runs', { size: 13, tone: 'red', bold: true }));
      });
      if (k === 2) [['for', ['the number of', 'repetitions is known']], ['while', ['the number of reps', 'is not known']], ['do-while', ['the body must run', 'before the test']]].forEach(function (r, i) {
        items.push(B('w' + i, 30 + i * 172, 250, 160, boxH(2), { title: r[0], lines: r[1], mono: true, lsize: 11, tone: 'accent' }));
      });
      return items;
    }
  };

  /* ---------- 8. break (slide 20) ---------- */
  function TB(v) { return 'public class TestBreak {\n  public static void main(String[] args) {\n    int sum =' + I(v.s0) + ';\n    int number = 0;\n\n    while (number < 20) {\n      number++;\n      sum += number;\n      if (sum >= 100)\n        break;\n    }\n\n    System.out.println("The number is " + number);\n    System.out.println("The sum is " + sum);\n  }\n}'; }
  var breakv = {
    id: 'breakv', slides: [20, 20], title: 'break leaves the loop at once', code: TB,
    inputs: [{ id: 's0', label: 'sum starts at', value: 90, min: -50, max: 300 }],
    presets: [{ label: 'sum = 90 (slide)', values: { s0: 90 } }, { label: 'sum = 0', values: { s0: 0 } }, { label: 'sum = 200', values: { s0: 200 } }, { label: 'sum = -150', values: { s0: -150 } }],
    steps: function (v) {
      var sum = I(v.s0), number = 0, st = [{ line: '3-4', sum: sum, num: 0, cap: 'sum starts at ' + sum + ', number at 0.' }], broke = false;
      while (number < 20) {
        number++; sum += number;
        var b = sum >= 100;
        st.push({ line: '7-9', sum: sum, num: number, hit: b, cap: 'number becomes ' + number + ', sum becomes ' + sum + '. Is sum >= 100? <b>' + tf(b) + '</b>.' });
        if (b) { st.push({ line: 10, sum: sum, num: number, brk: true, cap: '<b>break</b>: leave the loop right now, even though <code>number < 20</code> is still true. Jump to the first line after the loop.' }); broke = true; break; }
      }
      if (!broke) st.push({ line: 6, sum: sum, num: number, cap: 'number is 20, so <code>number < 20</code> is false: the loop ends normally. sum never reached 100, so break never ran.' });
      st.push({ line: '13-14', sum: sum, num: number, cap: 'Print the results.', out: ['The number is ' + number, 'The sum is ' + sum] });
      return st;
    },
    draw: function (k, s) {
      var items = [], sc = 520 / 20;
      items.push(vbox('n', 20, 30, 150, 'number', 'int', s.num, k && !s.out ? hot() : {}));
      items.push(vbox('s', 200, 30, 160, 'sum', 'int', s.sum, s.hit ? hot({ tone: 'red' }) : {}));
      for (var i = 1; i <= 20; i++) items.push(B('c' + i, 20 + (i - 1) * sc, 150, sc - 2, 30, { title: String(i), mono: true, size: 10, tone: i < s.num ? 'teal' : i === s.num ? 'accent' : 'muted', r: 3 }));
      items.push(T('lb', 20, 140, 'number:', { size: 12, tone: 'muted' }));
      if (s.brk) items.push(T('br', 280, 240, 'break → out of the loop (numbers ' + (s.num + 1) + ' to 20 are never used)', { anchor: 'middle', size: 13, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* ---------- 9. continue (slide 21) ---------- */
  var TC = 'public class TestContinue {\n  public static void main(String[] args) {\n    int sum = 0;\n    int number = 0;\n\n    while (number < 20) {\n      number++;\n      if (number == 10 || number == 11)\n        continue;\n      sum += number;\n    }\n\n    System.out.println("The sum is " + sum);\n  }\n}';
  var continuev = {
    id: 'continuev', slides: [21, 21], title: 'continue skips the rest of one iteration', code: TC,
    steps: (function () {
      var st = [{ line: '3-4', n: 0, sum: 0, cap: 'sum = 0, number = 0.' }], sum = 0;
      for (var n = 1; n <= 20; n++) {
        var skip = n === 10 || n === 11;
        if (!skip) sum += n;
        if (n <= 2 || n === 10 || n === 11 || n === 12 || n === 20) st.push({ line: skip ? '7-9' : '7-10', n: n, sum: sum, skip: skip, cap: skip ? 'number is ' + n + ': the if is true, so <b>continue</b>. Skip <code>sum += number</code> and go straight to the next check of the loop. sum stays ' + sum + '.' : 'number is ' + n + ': the if is false, so add it: sum = ' + sum + '.' + (n === 12 ? ' (Numbers 3 to 9 were added the same way.)' : '') });
        else if (n === 3) st.push({ line: '7-10', n: 9, sum: 45, cap: '… numbers 3 to 9 are added the same way: sum = 45 after number 9.' });
        if (n === 13) st.push({ line: '7-10', n: 19, sum: 168, cap: '… numbers 13 to 19 are added too: sum = 168.' });
      }
      st.push({ line: 13, n: 20, sum: 189, done: true, cap: 'number is 20, so the loop ends. The sum is 1 + 2 + … + 20 without 10 and 11: 210 − 21 = <b>189</b>.', out: 'The sum is 189' });
      return st;
    })(),
    draw: function (k, s) {
      var items = [], sc = 520 / 20;
      for (var i = 1; i <= 20; i++) {
        var sk = i === 10 || i === 11, past = i < s.n || (s.done && i <= 20);
        items.push(B('c' + i, 20 + (i - 1) * sc, 100, sc - 2, 34, { title: String(i), mono: true, size: 10, tone: i === s.n && !s.done ? (sk ? 'red' : 'accent') : past ? (sk ? 'red' : 'teal') : 'muted', r: 3, dash: sk && (past || i === s.n) }));
      }
      items.push(T('lb', 20, 90, 'number:', { size: 12, tone: 'muted' }));
      items.push(vbox('s', 200, 190, 160, 'sum', 'int', s.sum, {}));
      if (s.skip) items.push(T('sk', 280, 170, 'continue: ' + s.n + ' is not added', { anchor: 'middle', size: 14, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* ---------- 10. the multiplication table (slide 22) ---------- */
  function pad4(n) { var t = String(n); while (t.length < 4) t = ' ' + t; return t; }
  var MT = 'public class MultiplicationTable {\n  /** Main method */\n  public static void main(String[] args) {\n    // Display the table heading\n    System.out.println("           Multiplication Table");\n\n    // Display the number title\n    System.out.print("    ");\n    for (int j = 1; j <= 9; j++)\n      System.out.print("   " + j);\n\n    System.out.println("\\n-----------------------------------------");\n\n    // Print table body\n    for (int i = 1; i <= 9; i++) {\n      System.out.print(i + " | ");\n      for (int j = 1; j <= 9; j++) {\n        // Display the product and align properly\n        System.out.printf("%4d", i * j);\n      }\n      System.out.println();\n    }\n  }\n}';
  var multtable = {
    id: 'multtable', slides: [22, 22], title: 'Nested loops: a row for each i, a cell for each j', code: MT,
    steps: (function () {
      var st = [
        { line: 5, i: 0, j: 0, cap: 'Print the heading.', out: '           Multiplication Table' },
        { line: '8-10', i: 0, j: 0, cap: 'One loop prints the numbers 1 to 9 at the top, each after 3 spaces.', out: '       1   2   3   4   5   6   7   8   9' },
        { line: 12, i: 0, j: 0, cap: '\\n starts a new line, then a line of dashes.', out: ['', '-----------------------------------------'] },
        { line: '15-16', i: 1, j: 0, cap: 'The <b>outer</b> loop starts: i = 1. Print “1 | ” at the start of the row.' }
      ];
      for (var j = 1; j <= 3; j++) st.push({ line: '17-19', i: 1, j: j, cap: 'The <b>inner</b> loop: j = ' + j + '. Print 1 × ' + j + ' = ' + j + ' in 4 places (<code>%4d</code>).' });
      st.push({ line: '17-21', i: 1, j: 9, cap: 'The inner loop goes on to j = 9, then <code>println()</code> ends the row.', out: '1 | ' + [1, 2, 3, 4, 5, 6, 7, 8, 9].map(pad4).join('') });
      for (var i = 2; i <= 9; i++) st.push({ line: '15-21', i: i, j: 9, cap: i === 2 ? 'i = 2: the inner loop runs <b>again</b>, all 9 times, from j = 1. The inner loop restarts for every i.' : 'i = ' + i + ': another full row.' + (i === 9 ? ' In total the inner body ran 9 × 9 = 81 times.' : ''), out: i + ' | ' + [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (x) { return pad4(i * x); }).join('') });
      return st;
    })(),
    draw: function (k, s) {
      var items = [], cw = 50, ch = 28, x0 = 60, y0 = 46;
      for (var j = 1; j <= 9; j++) items.push(T('hj' + j, x0 + (j - 1) * cw + cw / 2, y0 - 10, String(j), { anchor: 'middle', mono: true, size: 12, bold: j === s.j && s.j < 9, tone: j === s.j && s.j < 9 ? 'accent' : 'muted' }));
      for (var i = 1; i <= 9; i++) {
        items.push(T('hi' + i, x0 - 14, y0 + (i - 1) * ch + 19, String(i), { anchor: 'middle', mono: true, size: 12, bold: i === s.i, tone: i === s.i ? 'accent' : 'muted' }));
        for (j = 1; j <= 9; j++) {
          var done = i < s.i || (i === s.i && j <= s.j);
          if (!done) continue;
          var cur = i === s.i && (j === s.j && s.j < 9 || s.j === 9);
          items.push(B('m' + i + '_' + j, x0 + (j - 1) * cw, y0 + (i - 1) * ch, cw - 3, ch - 3, { title: String(i * j), mono: true, size: 12, tone: cur ? 'accent' : 'teal', r: 3 }));
        }
      }
      return items;
    }
  };

  /* ---------- 11. the Omar shape (slide 23) ---------- */
  var OMAR = 'import java.util.Scanner;\npublic class Main\n{\npublic static void main(String[] args)\n{\nScanner key = new Scanner(System.in);\nSystem.out.println("Enter the number of lines");\nint n = key.nextInt();\nfor (int i= 0; i <=n; i++)\n{for (int j = 0; j <=i; j++)\nSystem.out.print("Omar");\nSystem.out.println();\n}\nfor (int i= n; i >=0; i--)\n{ for (int j = 0; j <=i; j++)\nSystem.out.print("Omar");\nSystem.out.println();\n}\n}\n}';
  function rep(t, n) { return new Array(n + 1).join(t); }
  var omar = {
    id: 'omar', slides: [23, 23], title: 'Two nested loops: up, then down', code: OMAR,
    inputs: [{ id: 'n', label: 'n (typed)', value: 2, min: 0, max: 4 }],
    presets: [{ label: 'n = 2', values: { n: 2 } }, { label: 'n = 0', values: { n: 0 } }, { label: 'n = 4', values: { n: 4 } }],
    steps: function (v) {
      var n = I(v.n), st = [{ line: '7-8', row: -1, cap: 'The user types n = ' + n + '.', out: ['Enter the number of lines', String(n)] }];
      for (var i = 0; i <= n; i++) st.push({ line: '9-12', row: i, part: 1, cap: 'First loop, i = ' + i + ': the inner loop runs for j = 0 to ' + i + ', so it prints “Omar” <b>' + (i + 1) + '</b> time' + (i ? 's' : '') + ', then a new line.', out: rep('Omar', i + 1) });
      for (i = n; i >= 0; i--) st.push({ line: '14-17', row: 2 * n + 1 - i, part: 2, cap: 'Second loop counts <b>down</b>, i = ' + i + ': ' + (i + 1) + ' time' + (i ? 's' : '') + ' “Omar”.' + (i === n ? ' The longest row is printed twice: once by each loop.' : ''), out: rep('Omar', i + 1) });
      return st;
    },
    draw: function (k, s, v) {
      var n = I(v.n), rows = [], items = [];
      for (var i = 0; i <= n; i++) rows.push(i + 1);
      for (i = n; i >= 0; i--) rows.push(i + 1);
      var rh = Math.min(30, Math.floor(320 / rows.length)), bw = Math.min(56, Math.floor(440 / (n + 1)));
      rows.forEach(function (c, r) {
        if (r > s.row) return;
        for (var j = 0; j < c; j++) items.push(B('o' + r + '_' + j, 80 + j * bw, 10 + r * rh, bw - 3, rh - 4, { title: 'Omar', mono: true, size: rh < 22 ? 9 : 11, tone: r === s.row ? 'accent' : r <= n ? 'teal' : 'blue', r: 3 }));
        items.push(T('ri' + r, 64, 10 + r * rh + rh / 2 + 3, 'i=' + (r <= n ? r : 2 * n + 1 - r), { anchor: 'end', mono: true, size: 10.5, tone: r === s.row ? 'accent' : 'muted' }));
      });
      if (s.row < 0) items.push(T('w', 280, 170, 'n = ' + n + '  →  ' + rows.length + ' lines', { anchor: 'middle', size: 18, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 12. the star triangle (slide 24) ---------- */
  var STARS = 'import java.util.Scanner;\npublic class Main{\npublic static void main(String[] args) {\nScanner key = new Scanner(System.in);\nSystem.out.println("Enter the number of lines");\nint n = key.nextInt();\n     for (int i= 0; i <=n; i++)\n        {\n            for (int j = 0; j <=i; j++)\n          System.out.print("*");\n             System.out.println();\n           }\n}\n}';
  var stars = {
    id: 'stars', slides: [24, 24], title: 'Row i gets i + 1 stars', code: STARS,
    inputs: [{ id: 'n', label: 'n (typed)', value: 4, min: 0, max: 8 }],
    presets: [{ label: 'n = 4', values: { n: 4 } }, { label: 'n = 1', values: { n: 1 } }, { label: 'n = 8', values: { n: 8 } }],
    steps: function (v) {
      var n = I(v.n), st = [{ line: '5-6', row: -1, cap: 'The user types n = ' + n + '. Note: i goes from 0 to n, so there will be <b>' + (n + 1) + '</b> lines, not ' + n + '.', out: ['Enter the number of lines', String(n)] }];
      for (var i = 0; i <= n; i++) st.push({ line: '7-11', row: i, cap: 'i = ' + i + ': the inner loop (j = 0 to ' + i + ') prints ' + (i + 1) + ' star' + (i ? 's' : '') + ', then <code>println()</code> moves to the next line.', out: rep('*', i + 1) });
      return st;
    },
    draw: function (k, s, v) {
      var n = I(v.n), rh = Math.min(34, Math.floor(320 / (n + 1))), bw = Math.min(40, Math.floor(440 / (n + 1))), items = [];
      for (var r = 0; r <= s.row; r++) {
        for (var j = 0; j <= r; j++) items.push(B('s' + r + '_' + j, 80 + j * bw, 10 + r * rh, bw - 3, rh - 4, { title: '*', mono: true, size: 16, tone: r === s.row ? 'accent' : 'teal', r: 3 }));
        items.push(T('ri' + r, 64, 10 + r * rh + rh / 2 + 3, 'i=' + r, { anchor: 'end', mono: true, size: 11, tone: r === s.row ? 'accent' : 'muted' }));
      }
      if (s.row < 0) items.push(T('w', 280, 170, 'n = ' + n + '  →  ' + (n + 1) + ' lines', { anchor: 'middle', size: 18, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 13. greatest common divisor (slide 26) ---------- */
  var GCD = 'int gcd = 1;\nint k = 2;\nwhile (k <= n1 && k <= n2) {\n  if (n1 % k == 0 && n2 % k == 0)\n    gcd = k;\n  k++;\n}\nSystem.out.println("The greatest common divisor for " + n1 +\n  " and " + n2 + " is " + gcd);';
  var gcd = {
    id: 'gcd', slides: [26, 26], title: 'Try every k, keep the last common divisor', code: GCD,
    inputs: [{ id: 'a', label: 'n1', value: 16, min: 1, max: 30 }, { id: 'b', label: 'n2', value: 24, min: 1, max: 30 }],
    presets: [{ label: '4 and 2', values: { a: 4, b: 2 } }, { label: '16 and 24', values: { a: 16, b: 24 } }, { label: '7 and 5', values: { a: 7, b: 5 } }, { label: '12 and 12', values: { a: 12, b: 12 } }, { label: '1 and 9', values: { a: 1, b: 9 } }],
    steps: function (v) {
      var a = I(v.a), b = I(v.b), m = Math.min(a, b), g = 1, st = [{ line: '1-2', k: 1, g: 1, cap: 'gcd starts at 1, because 1 divides every number. The search starts at k = 2.' }], from = -1;
      function flush(to) { if (from < 0) return; st.push({ line: '3-6', k: to, g: g, cap: from === to ? 'k = ' + from + ': it does not divide both numbers. Go on.' : 'k = ' + from + ' to ' + to + ': none of them divides both numbers. Go on.' }); from = -1; }
      for (var k = 2; k <= m; k++) {
        if (a % k === 0 && b % k === 0) { flush(k - 1); g = k; st.push({ line: '4-5', k: k, g: g, hit: true, cap: 'k = ' + k + ': ' + a + ' % ' + k + ' == 0 and ' + b + ' % ' + k + ' == 0, so ' + k + ' is a <b>common divisor</b>. gcd = ' + k + '.' }); }
        else if (from < 0) from = k;
      }
      flush(m);
      st.push({ line: 3, k: m + 1, g: g, cap: 'k is now ' + (m + 1) + ', bigger than ' + (a <= b ? 'n1' : 'n2') + ', so the loop stops.' + (m < 2 ? ' (It never ran: k = 2 was already too big.)' : '') });
      st.push({ line: '8-9', k: m + 1, g: g, cap: 'The last common divisor found is the <b>greatest</b>: ' + g + '.', out: 'The greatest common divisor for ' + a + ' and ' + b + ' is ' + g });
      return st;
    },
    draw: function (k, s, v) {
      var a = I(v.a), b = I(v.b), m = Math.min(a, b), cw = Math.max(13, Math.min(34, Math.floor(520 / Math.max(m, 1)))), items = [];
      for (var t = 1; t <= m; t++) {
        var common = a % t === 0 && b % t === 0, seen = t <= s.k;
        items.push(B('k' + t, 20 + (t - 1) * cw, 80, cw - 2, 34, { title: String(t), mono: true, size: cw < 20 ? 9 : 12, r: 3, tone: !seen ? 'muted' : t === s.k && s.hit ? 'accent' : common ? 'teal' : 'muted', hi: t === s.k && s.hit, dash: seen && !common }));
      }
      items.push(T('lb', 20, 70, 'k:', { size: 12, tone: 'muted' }));
      items.push(vbox('g', 20, 190, 160, 'gcd', 'int', s.g, s.hit ? hot() : {}));
      items.push(vbox('kv', 210, 190, 140, 'k', 'int', s.k, {}));
      items.push(T('key', 20, 300, 'teal: divides both numbers', { size: 12, tone: 'teal', bold: true }));
      return items;
    }
  };

  /* ---------- 14. future tuition (slides 27-28) ---------- */
  var tuition = {
    id: 'tuition', slides: [27, 28], title: 'Repeat until it doubles',
    inputs: [{ id: 'r', label: 'increase %', value: 7, min: 1, max: 50 }],
    presets: [{ label: '7% (slide)', values: { r: 7 } }, { label: '10%', values: { r: 10 } }, { label: '25%', values: { r: 25 } }, { label: '3%', values: { r: 3 } }],
    code: function (v) { return 'double tuition = 10000;\nint year = 0;\nwhile (tuition < 20000) {\n  tuition = tuition * ' + (1 + I(v.r) / 100) + ';\n  year++;\n}\nSystem.out.println("Tuition will be doubled in "\n  + year + " years");'; },
    steps: function (v) {
      var f = 1 + I(v.r) / 100, t = 10000, y = 0, list = [10000];
      while (t < 20000) { t = t * f; y++; list.push(t); }
      var st = [{ slide: 28, line: '1-2', y: 0, list: list, cap: 'Year 0: tuition = $10,000. Slide 28 writes the same two lines again and again; a loop does it for us. We do not know how many years, so a <b>while</b> loop fits.' }];
      for (var i = 1; i <= y; i++) {
        if (y > 8 && i > 3 && i < y - 1) { if (i === 4) st.push({ slide: 28, line: '3-6', y: y - 2, list: list, cap: '… the loop repeats the same way until year ' + (y - 2) + ': tuition ≈ $' + list[y - 2].toFixed(2) + '.' }); continue; }
        st.push({ slide: 28, line: '3-6', y: i, list: list, cap: 'Year ' + i + ': tuition = tuition × ' + f + ' ≈ $' + list[i].toFixed(2) + '.' + (list[i] >= 20000 ? ' Now tuition < 20000 is false.' : ' Still under 20000.') });
      }
      st.push({ slide: 27, line: '7-8', y: y, list: list, cap: 'The loop stops after ' + y + ' years.', out: 'Tuition will be doubled in ' + y + ' years' });
      return st;
    },
    draw: function (k, s) {
      var L = s.list, n = L.length, bw = Math.max(6, Math.min(40, Math.floor(480 / n))), top = Math.max(L[n - 1], 20000), H = 240, items = [];
      var Y = function (x) { return 290 - x / top * H; };
      items.push(A('dbl', 40, Y(20000), 540, Y(20000), { head: false, dash: true, tone: 'red', label: 'doubled: 20000', la: 'end', lx: 0 }));
      items.push(A('base', 40, 290, 540, 290, { head: false, tone: 'muted' }));
      for (var i = 0; i <= s.y; i++) {
        var h = 290 - Y(L[i]);
        items.push(B('b' + i, 44 + i * bw, Math.round(Y(L[i])), bw - 2, Math.max(2, Math.round(h)), { tone: i === s.y ? 'accent' : L[i] >= 20000 ? 'teal' : 'blue', fill: 'solid', r: 2 }));
      }
      items.push(T('yl', 44, 312, 'year 0', { mono: true, size: 11, tone: 'muted' }));
      items.push(T('cur', 300, 30, 'year ' + s.y + ': $' + L[s.y].toFixed(2), { anchor: 'middle', mono: true, bold: true, size: 15, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 15. guessing a number with break (slide 29) ---------- */
  var GUESS = 'int number = (int)(Math.random() * 101);\nScanner input = new Scanner(System.in);\nSystem.out.println("Guess a magic number between 0 and 100");\nwhile (true) {\n  System.out.print("Enter your guess: ");\n  int guess = input.nextInt();\n  if (guess == number) {\n    System.out.println("Yes, the number is " + number);\n    break;\n  }\n  else if (guess > number)\n    System.out.println("Your guess is too high");\n  else\n    System.out.println("Your guess is too low");\n}';
  var guess = {
    id: 'guess', slides: [29, 29], title: 'while (true) and break', code: GUESS,
    inputs: [{ id: 'm', label: 'the magic number', value: 39, min: 0, max: 100 }],
    presets: [{ label: '39', values: { m: 39 } }, { label: '50', values: { m: 50 } }, { label: '0', values: { m: 0 } }, { label: '100', values: { m: 100 } }],
    steps: function (v) {
      var m = I(v.m), lo = 0, hi = 100, st = [{ line: '1-3', lo: 0, hi: 100, g: null, cap: 'The program picks a magic number (here we use ' + m + '). The user guesses smartly: always the middle of what is left.', out: 'Guess a magic number between 0 and 100' }];
      for (var t = 0; t < 10; t++) {
        var g = (lo + hi) >> 1;
        if (g === m) { st.push({ line: '5-9', lo: lo, hi: hi, g: g, ok: true, cap: 'Guess ' + g + ': correct! Print it, then <b>break</b>. This is the only way out of <code>while (true)</code>. It took ' + (t + 1) + ' guess' + (t ? 'es' : '') + '.', out: ['Enter your guess: ' + g, 'Yes, the number is ' + m] }); break; }
        st.push({ line: g > m ? '5-12' : '5-14', lo: lo, hi: hi, g: g, cap: 'Guess ' + g + ': ' + (g > m ? 'too high, so the number is below ' + g + '.' : 'too low, so the number is above ' + g + '.') + ' The loop goes on: the condition is always true.', out: ['Enter your guess: ' + g, g > m ? 'Your guess is too high' : 'Your guess is too low'] });
        if (g > m) hi = g - 1; else lo = g + 1;
      }
      return st;
    },
    draw: function (k, s, v) {
      var X = function (t) { return 50 + t * 4.6; }, items = [];
      items.push(A('ax', 40, 150, 520, 150, { head: false, tone: 'muted' }));
      [0, 50, 100].forEach(function (t) { items.push(T('t' + t, X(t), 176, String(t), { anchor: 'middle', mono: true, size: 12 })); });
      items.push(B('rng', X(s.lo), 128, Math.max(4, X(s.hi) - X(s.lo)), 20, { tone: 'teal', r: 3 }));
      items.push(T('rl', 280, 116, 'still possible: ' + s.lo + ' to ' + s.hi, { anchor: 'middle', size: 13, tone: 'teal', bold: true }));
      if (s.g != null) {
        items.push(P('p', X(s.g), 154, 'guess ' + s.g, { dir: 'up' }));
        items.push(T('res', 280, 250, s.ok ? 'correct → break' : s.g > I(v.m) ? 'too high' : 'too low', { anchor: 'middle', size: 18, bold: true, tone: s.ok ? 'teal' : 'red' }));
      }
      items.push(T('wt', 280, 40, 'while (true)  →  only break can end it', { anchor: 'middle', mono: true, size: 14, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 16. prime numbers (slide 30) ---------- */
  var PRIME = 'final int NUMBER_OF_PRIMES = 50;\nfinal int NUMBER_OF_PRIMES_PER_LINE = 10;\nint count = 0;\nint number = 2;\nwhile (count < NUMBER_OF_PRIMES) {\n  boolean isPrime = true;\n  for (int divisor = 2; divisor <= number / 2; divisor++) {\n    if (number % divisor == 0) {\n      isPrime = false;\n      break;\n    }\n  }\n  if (isPrime) {\n    count++;\n    if (count % NUMBER_OF_PRIMES_PER_LINE == 0)\n      System.out.println(number);\n    else\n      System.out.print(number + " ");\n  }\n  number++;\n}';
  function isPrime(n) { for (var d = 2; d <= n / 2; d++) if (n % d === 0) return d; return 0; }
  var PR = (function () { var p = [], n = 2; while (p.length < 50) { if (!isPrime(n)) p.push(n); n++; } return p; })();
  var primes = {
    id: 'primes', slides: [30, 30], title: 'Test each number, count the primes', code: PRIME,
    steps: (function () {
      var st = [{ line: '1-4', n: 1, cap: 'Two constants: 50 primes, 10 per line. count = 0, and the first number to test is 2.' }];
      [2, 3, 4, 5, 6, 9].forEach(function (n) {
        var d = isPrime(n);
        st.push({ line: d ? '7-10' : '13-18', n: n, cap: 'number = ' + n + ': ' + (n < 4 ? 'there is no divisor from 2 to ' + n + ' / 2, so it stays prime.' : d ? n + ' % ' + d + ' == 0, so it is <b>not</b> prime. <code>break</code> stops the divisor loop early: no need to test more.' : 'no divisor from 2 to ' + Math.floor(n / 2) + ' works, so it is <b>prime</b>.') + (d ? '' : ' count becomes ' + (PR.indexOf(n) + 1) + '.') });
      });
      st.push({ line: '5-20', n: 29, cap: 'The outer loop goes on number by number. When count reaches 10 (the prime 29), <code>println</code> ends the first line.' });
      st.push({ line: '5-20', n: PR[49], cap: 'When count reaches 50 (the prime ' + PR[49] + '), the condition <code>count < 50</code> is false and the loop ends: 5 lines of 10 primes.', out: [0, 1, 2, 3, 4].map(function (r) { return PR.slice(r * 10, r * 10 + 10).join(' '); }) });
      return st;
    })(),
    draw: function (k, s) {
      var items = [], cols = 20, cw = 26, ch = 24, last = PR[49];
      for (var n = 2; n <= last; n++) {
        var idx = n - 2, x = 20 + (idx % cols) * cw, y = 12 + Math.floor(idx / cols) * ch, done = n <= s.n, p = !isPrime(n);
        items.push(B('n' + n, x, y, cw - 2, ch - 2, { title: String(n), mono: true, size: 9, r: 3, tone: n === s.n ? 'accent' : done && p ? 'teal' : 'muted', hi: n === s.n, dash: done && !p }));
      }
      var cnt = PR.filter(function (p) { return p <= s.n; }).length;
      items.push(T('c', 20, 312, 'count = ' + cnt, { mono: true, size: 14, bold: true, tone: 'accent' }));
      items.push(T('key', 540, 312, 'teal: prime', { anchor: 'end', size: 12, tone: 'teal', bold: true }));
      return items;
    }
  };

  /* ---------- 17. a confirmation dialog controls the loop (slide 31) ---------- */
  var CONF = 'int option = 0;\nwhile (option == JOptionPane.YES_OPTION) {\n  System.out.println("continue loop");\n  option = JOptionPane.showConfirmDialog(null, "Continue?");\n}';
  var confirm = {
    id: 'confirm', slides: [31, 31], title: 'The user decides when the loop stops', code: CONF,
    inputs: [{ id: 'y', label: 'times the user clicks Yes', value: 2, min: 0, max: 5 }],
    presets: [{ label: 'Yes twice, then No', values: { y: 2 } }, { label: 'No at once', values: { y: 0 } }],
    steps: function (v) {
      var y = I(v.y), st = [{ line: 1, opt: 0, cap: '<code>option = 0</code>. 0 is the value of <code>JOptionPane.YES_OPTION</code>, so the loop starts.' }];
      for (var i = 0; i <= y; i++) {
        st.push({ line: '2-3', opt: 0, cap: 'option == YES_OPTION is true: print.', out: 'continue loop' });
        st.push({ line: 4, opt: i < y ? 0 : 1, dlg: i < y ? 'Yes' : 'No', cap: 'A dialog asks “Continue?”. The user clicks <b>' + (i < y ? 'Yes' : 'No') + '</b>, so option = ' + (i < y ? '0 (YES_OPTION).' : '1 (NO_OPTION).') });
      }
      st.push({ line: 2, opt: 1, cap: 'option is no longer YES_OPTION, so the loop ends. The answer works like a <b>sentinel</b> value: a special value that means “stop”. (Cancel, value 2, would also stop it.)' });
      return st;
    },
    draw: function (k, s) {
      var items = [vbox('o', 380, 40, 150, 'option', 'int', s.opt, s.dlg ? hot() : {})];
      if (s.dlg) {
        items.push(B('dlg', 30, 40, 300, 170, { tag: 'Select an Option', fill: 'none', tone: 'blue', z: 0 }));
        items.push(T('q', 180, 96, 'Continue?', { anchor: 'middle', size: 16, bold: true }));
        ['Yes', 'No', 'Cancel'].forEach(function (b, i) { items.push(B('bt' + i, 50 + i * 92, 140, 84, 40, { title: b, size: 14, tone: b === s.dlg ? 'accent' : 'muted', hi: b === s.dlg, fill: b === s.dlg ? 'solid' : 'soft' })); });
      } else items.push(T('st', 180, 130, s.opt === 0 ? 'option == YES_OPTION  →  keep going' : 'option != YES_OPTION  →  stop', { anchor: 'middle', size: 14, bold: true, tone: s.opt === 0 ? 'teal' : 'red' }));
      items.push(T('codes', 455, 140, 'YES_OPTION = 0\nNO_OPTION = 1\nCANCEL_OPTION = 2', { anchor: 'middle', mono: true, size: 12, tone: 'muted' }));
      return items;
    }
  };

  var ALL = [whileloop, floatloop, dowhile, forloop, fornotes, semi, equiv, breakv, continuev, multtable, omar, stars, gcd, tuition, guess, primes, confirm];

  var para = function (t) { return { type: 'paragraph', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; },
    code = function (t, lang) { return lang ? { type: 'code', text: t, lang: lang } : { type: 'code', text: t }; }, note = function (t) { return { type: 'note', text: t }; };
  function braces(c) { var o = (c.match(/\{/g) || []).length, z = (c.match(/\}/g) || []).length; return o >= 2 && o === z; }
  var W2 = 'int count = 0;\nwhile (count < 2) {\n  System.out.println("Welcome to Java!");\n  count++;\n}';
  function traceSlide(msg, nt, ex) { return { image: false, title: 'Trace while Loop', blocks: [note(msg)].concat([code(W2)]).concat(nt ? [para(nt)] : []), explain: ex }; }

  addUnit({
    course: 'cs1', lesson: '06-loops',
    blurb: 'Repeat code without writing it again: the while, do-while and for loops, break and continue, loops inside loops, and some classic loop problems.',
    parts: [
      {
        title: 'The while loop', from: 1, to: 12,
        quiz: [
          { type: 'output', q: 'What does this print?', code: 'int c = 0;\nwhile (c < 3) {\n  System.out.println("Hi");\n  c++;\n}', answer: 'Hi\nHi\nHi', why: 'c is 0, 1, 2: three times. When c is 3, the condition is false.' },
          { q: 'How many times does the body run? <code>int count = 0; while (count < 100) { …; count++; }</code>', options: ['100', '99', '101'], answer: 0, why: 'count takes the values 0 to 99: that is 100 values (slide 2).' },
          { type: 'output', q: 'What does this print?', code: 'int i = 5;\nwhile (i < 3) {\n  System.out.println(i);\n  i++;\n}\nSystem.out.println("end");', answer: 'end', why: '5 < 3 is false at the very first check, so the body never runs.' },
          { type: 'tf', q: 'A while loop checks its condition before every run of the body.', answer: true, why: 'Slides 4, 7 and 10: the check comes first each time.' },
          { type: 'output', q: 'What does this print?', code: 'int n = 1;\nwhile (n < 20)\n  n = n * 2;\nSystem.out.println(n);', answer: '32', why: '1, 2, 4, 8, 16 are all < 20; 16 * 2 = 32 is not, so the loop stops with n = 32.' },
          { q: 'Why is <code>while (item != 0)</code> with <code>item -= 0.1</code> a bad idea?', options: ['item may never be exactly 0, so the loop may never stop', 'It does not compile', 'It runs only once'], answer: 0, why: 'Slide 12: doubles like 0.1 are approximations.' }
        ]
      },
      {
        title: 'do-while and for', from: 13, to: 19,
        quiz: [
          { type: 'output', q: 'What does this print?', code: 'int i = 5;\ndo {\n  System.out.println(i);\n  i++;\n} while (i < 3);', answer: '5', why: 'The body runs first, then 6 < 3 is false. A do-while body runs at least once.' },
          { type: 'output', q: 'What does this print?', code: 'for (int i = 0; i < 3; i++)\n  System.out.println(i);', answer: '0\n1\n2', why: 'i = 0, 1, 2. At i = 3 the condition is false.' },
          { type: 'output', q: 'And this?', code: 'for (int i = 1; i <= 10; i += 3)\n  System.out.println(i);', answer: '1\n4\n7\n10', why: 'The update adds 3 each time; 13 is not <= 10.' },
          { type: 'order', q: 'Put the parts of a for loop in the order they first run.', lines: ['initial-action', 'loop-continuation-condition', 'loop body', 'action-after-each-iteration'], why: 'The initial-action runs once; then condition, body, update, condition, … (slide 14).' },
          { type: 'tf', q: '<code>for ( ; ; ) { }</code> is a syntax error.', answer: false, why: 'Slide 16: it is correct. The missing condition counts as true, so it is an infinite loop.' },
          { type: 'output', q: 'What does this print? Look closely.', code: 'int s = 0;\nfor (int i = 0; i < 5; i++);\ns++;\nSystem.out.println(s);', answer: '1', why: 'The ; is the empty body of the loop (slide 17). s++ is after the loop and runs once.' },
          { q: 'Which loop fits best when you know the number of repetitions?', options: ['for', 'while', 'do-while'], answer: 0, why: 'Slide 19.' }
        ]
      },
      {
        title: 'break and continue', from: 20, to: 21,
        quiz: [
          { type: 'output', q: 'What does this print?', code: 'for (int i = 1; i <= 10; i++) {\n  if (i == 4)\n    break;\n  System.out.println(i);\n}', answer: '1\n2\n3', why: 'At i = 4, break leaves the loop before printing.' },
          { type: 'output', q: 'And this?', code: 'for (int i = 1; i <= 5; i++) {\n  if (i == 3)\n    continue;\n  System.out.println(i);\n}', answer: '1\n2\n4\n5', why: 'continue skips the rest of that one iteration; the loop goes on with i = 4.' },
          { q: 'What does <code>continue</code> do?', options: ['Ends the current iteration and goes to the next one', 'Ends the whole loop', 'Ends the program'], answer: 0, why: 'Slide 21. break ends the whole loop (slide 20).' },
          { type: 'output', q: 'In TestBreak (slide 20), sum starts at 0 instead of 90. What is printed?', code: 'int sum = 0;\nint number = 0;\nwhile (number < 20) {\n  number++;\n  sum += number;\n  if (sum >= 100)\n    break;\n}\nSystem.out.println(number + " " + sum);', answer: '14 105', why: '1 + 2 + … + 13 = 91 is under 100; adding 14 gives 105, so break.' },
          { type: 'tf', q: 'break only leaves the if statement it is in.', answer: false, why: 'break leaves the whole loop (here the while), not just the if.' }
        ]
      },
      {
        title: 'Nested loops', from: 22, to: 24,
        quiz: [
          { type: 'output', q: 'What does this print?', code: 'for (int i = 1; i <= 2; i++) {\n  for (int j = 1; j <= 3; j++)\n    System.out.print("*");\n  System.out.println();\n}', answer: '***\n***', why: 'For each of the 2 values of i, the inner loop prints 3 stars.' },
          { q: 'In the multiplication table (slide 22), how many times does <code>printf("%4d", i * j)</code> run?', options: ['81', '18', '9'], answer: 0, why: '9 rows × 9 columns.' },
          { type: 'output', q: 'What does this print?', code: 'for (int i = 0; i <= 2; i++) {\n  for (int j = 0; j <= i; j++)\n    System.out.print("*");\n  System.out.println();\n}', answer: '*\n**\n***', why: 'The inner loop depends on i: i + 1 stars in row i (slide 24).' },
          { q: 'In the star program of slide 24, the user types 3. How many lines are printed?', options: ['4', '3', '6'], answer: 0, why: 'i goes from 0 to n (<code>i <= n</code>): 0, 1, 2, 3.' },
          { type: 'fill', q: 'Make the inner loop run 5 times for every i.', code: 'for (int i = 0; i < 3; i++)\n  for (int j = 0; j < ___; j++)\n    System.out.print("#");', answer: ['5'], why: 'j = 0, 1, 2, 3, 4.' }
        ]
      },
      {
        title: 'Sample problems', from: 25, to: 31,
        quiz: [
          { q: 'What is the greatest common divisor of 16 and 24?', options: ['8', '4', '2'], answer: 0, why: 'Slide 26. The common divisors are 1, 2, 4 and 8.' },
          { type: 'output', q: 'What does this print?', code: 'double t = 100;\nint y = 0;\nwhile (t < 200) {\n  t = t * 1.5;\n  y++;\n}\nSystem.out.println(y);', answer: '2', why: '100 → 150 (still < 200) → 225. Two years.' },
          { q: 'In the guessing program, how does <code>while (true)</code> end?', options: ['With break, when the guess is right', 'When the condition becomes false', 'It never ends'], answer: 0, why: 'The condition is always true; break is the only way out (slide 29).' },
          { q: 'Which number is prime?', options: ['7', '9', '1'], answer: 0, why: 'Slide 30: 9 = 3 × 3, and a prime must be greater than 1.' },
          { type: 'tf', q: 'In slide 31, the loop goes on as long as the user clicks Yes.', answer: true, why: 'option == JOptionPane.YES_OPTION is the condition.' }
        ]
      }
    ],
    slides: {
      1: { cover: true, image: false, title: '', blocks: [para('Chapter 5'), para('Loops'), note('An adapted version of the lecture notes associated with the textbook')],
        explain: '<p>Printing “Welcome to Java!” 100 times with 100 println lines would be silly. A <b>{{loop|حلقة تكرار}}</b> repeats code for us. This unit shows the three loops of Java and how to control them.</p>' },
      2: { image: false, blocks: [code('while (loop-continuation-condition) {\n  // loop-body;\n  Statement(s);\n}', 'none'), code('int count = 0;\nwhile (count < 100) {\n  System.out.println("Welcome to Java!");\n  count++;\n}')],
        explain: '<p>The <b>{{loop-continuation-condition|شرط الاستمرار}}</b> is a boolean expression. While it is true, the <b>{{loop body|جسم الحلقة}}</b> runs again and again. Something in the body must change, like <code>count++</code>, or the loop never stops.</p>' },
      3: traceSlide('Initialize count', null, '<p>The next slides trace the loop one step at a time. Use the drawing: it moves with the slides.</p>'),
      4: traceSlide('(count < 2) is true', null, '<p>count is 0, and 0 < 2, so the body runs.</p>'),
      5: traceSlide('Print Welcome to Java', null, '<p>The first line of output.</p>'),
      6: traceSlide('Increase count by 1', 'count is 1 now', '<p>After the last statement of the body, Java goes back to the condition.</p>'),
      7: traceSlide('(count < 2) is still true since count is 1', null, '<p>1 < 2, so one more time.</p>'),
      8: traceSlide('Print Welcome to Java', null, '<p>The second line of output.</p>'),
      9: traceSlide('Increase count by 1', 'count is 2 now', '<p>Back to the condition again.</p>'),
      10: traceSlide('(count < 2) is false since count is 2 now', null, '<p>2 < 2 is false, so the body does not run again.</p>'),
      11: traceSlide('The loop exits. Execute the next statement after the loop.', null, '<p>Each run of the body is called an <b>{{iteration|دورة / تكرار}}</b>. This loop had 2 iterations.</p>'),
      12: { explain: '<p>A double like 0.1 is stored only <b>{{approximately|تقريبياً}}</b>. After subtracting 0.1 ten times, item is a tiny number, not 0, so <code>item != 0</code> stays true and the loop runs {{forever|للأبد}}. Control a loop with an int, or with < and >, not with == or != on doubles.</p>' },
      13: { image: false, title: 'do-while Loop', blocks: [code('do {\n  // Loop body;\n  Statement(s);\n} while (loop-continuation-condition);', 'none')],
        explain: '<p>The <b>do-while</b> loop runs the body <b>first</b> and checks the condition <b>after</b>. So its body always runs at least once. Note the semicolon at the end.</p>' },
      14: { image: false, title: 'for Loops', blocks: [code('for (initial-action; loop-continuation-\n   condition; action-after-each-iteration) {\n  // loop body;\n  Statement(s);\n}', 'none'), code('int i;\nfor (i = 0; i < 100; i++) {\n  System.out.println("Welcome to Java!");\n}')],
        explain: '<p>A <b>for</b> loop {{collects|يجمع}} the three parts of a counting loop in one line: start, condition, and step. The variable that counts, like i, is the <b>{{control variable|متغير التحكم}}</b>.</p>' },
      15: { explain: '<p>These forms are legal Java, but hard to read, so they are {{rarely|نادراً}} used. Knowing them helps you read other people’s code.</p>' },
      16: { image: false, blocks: [para('If the loop-continuation-condition in a for loop is omitted, it is implicitly true. Thus the statement given below in (a), which is an infinite loop, is correct. Nevertheless, it is better to use the equivalent loop in (b) to avoid confusion:'), note('(a)'), code('for ( ; ; ) {\n  // Do something\n}'), note('Equivalent (b)'), code('while (true) {\n  // Do something\n}')],
        explain: '<p>An <b>{{infinite loop|حلقة لا نهائية}}</b> never ends by itself. Sometimes it is on purpose, and a <code>break</code> inside it ends it (see slide 29).</p>' },
      17: { explain: '<p>A semicolon right after the header is an empty statement, and it becomes the whole body. The code compiles, so the compiler does not warn you: this is a <b>{{logic error|خطأ منطقي}}</b>.</p>' },
      18: { explain: '<p>With while, the same mistake is worse: the empty body repeats forever. Only do-while needs a semicolon after its condition.</p>' },
      19: { image: false, blocks: [bul('The three forms of loop statements, while, do-while, and for, are expressively equivalent. Example:'), note('(a)'), code('while (x < 5) {\n  // Loop body\n}'), note('Equivalent (b)'), code('for ( ; x < 5; ) {\n  // Loop body\n}'), bul('Use the one that is most intuitive and comfortable for you.'), bul('In general, a for loop may be used if the number of repetitions is known.'), bul('A while loop may be used if the number of repetitions is not known.'), bul('A do-while loop can be used to replace a while loop if the loop body has to be executed before testing the continuation condition.')],
        explain: '<p><b>{{Equivalent|متكافئ: نفس النتيجة}}</b> means any loop can be written with any of the three forms. Choose the one that is easiest to read for the job.</p>' },
      20: { image: false, title: 'Using break', blocks: [code(TB({ s0: 90 }))],
        explain: '<p><b>break</b> ends the loop at once, even if the condition is still true. The program goes on with the first statement after the loop. Note that sum starts at 90 here.</p>' },
      21: { image: false, title: 'Using continue', blocks: [code(TC)],
        explain: '<p><b>continue</b> ends only the <b>current</b> iteration: the rest of the body is skipped, and the loop goes to its next check. Here 10 and 11 are not added.</p>' },
      22: { image: false, blocks: [para('Problem: Write a program that uses nested for loops to print a multiplication table.'), code(MT)],
        explain: '<p><b>{{Nested loops|حلقات متداخلة}}</b> are a loop inside a loop. For <b>each</b> value of the outer i, the inner loop runs <b>all</b> its j values. <code>%4d</code> prints each number in 4 places, so the columns line up.</p>' },
      23: { image: false, blocks: [code(OMAR)],
        explain: '<p>Two nested loops one after the other. The first one counts up, so the rows grow; the second counts down, so they {{shrink|يصغر}}. The inner condition <code>j <= i</code> ties the row length to i. Note: print("Omar") adds no space, so it prints OmarOmar.</p>' },
      24: { image: false, blocks: [para('Problem: Write a program that uses nested for loops to print a pyramid of stars in java'), code(STARS)],
        explain: '<p>The same idea with stars: row i has i + 1 stars. Because i starts at 0 and goes up to n (<code><=</code>), there are n + 1 rows.</p>' },
      25: { cover: true, image: false, title: 'Some Samples…', blocks: [para('Some Samples…')], explain: '<p>Now some classic problems that use loops.</p>' },
      26: { image: false, title: 'Problem: Finding the Greatest Common Divisor', blocks: [para('Problem: Write a program that prompts the user to enter two positive integers and finds their greatest common divisor.'), para('Solution: Suppose you enter two integers 4 and 2, their greatest common divisor is 2. Suppose you enter two integers 16 and 24, their greatest common divisor is 8. So, how do you find the greatest common divisor? Let the two input integers be n1 and n2. You know number 1 is a common divisor, but it may not be the greatest commons divisor. So you can check whether k (for k = 2, 3, 4, and so on) is a common divisor for n1 and n2, until k is greater than n1 or n2.'), note('Example program: GreatestCommonDivisor')],
        explain: '<p>The <b>{{greatest common divisor|القاسم المشترك الأكبر}}</b> (GCD) is the biggest number that divides both. The idea: try every k from 2 up, remember the last one that divides both. The drawing runs the program of the idea.</p>' },
      27: { image: false, blocks: [para('Problem: Suppose that the tuition for a university is $10,000 this year and tuition increases 7% every year. In how many years will the tuition be doubled?'), note('Example program: FutureTuition')], explain: '<p>Each year the {{tuition|الرسوم الدراسية}} is multiplied by 1.07 (7% more). We do not know in {{advance|مسبقاً}} how many years it takes, so we repeat until it reaches $20,000.</p>' },
      28: { image: false, title: 'Problem: Predicating the Future Tuition', blocks: [code('double tuition = 10000;   int year = 0  // Year 0\ntuition = tuition * 1.07; year++;       // Year 1\ntuition = tuition * 1.07; year++;       // Year 2\ntuition = tuition * 1.07; year++;       // Year 3\n...'), note('Example program: FutureTuition')], explain: '<p>The same two statements repeat every year, with only the count changing: a clear sign that a loop is needed. (The slide’s first line is missing a semicolon after <code>int year = 0</code>.)</p>' },
      29: { image: false, blocks: [para('Here is a program for guessing a number. You can rewrite it using a break statement.'), note('Example program: GuessNumberUsingBreak')],
        explain: '<p>With <code>while (true)</code> the condition never stops the loop. Inside, a <b>break</b> runs when the guess is right. The drawing shows one way to write the program.</p>' },
      30: { image: false, blocks: [para('Problem: Write a program that displays the first 50 prime numbers in five lines, each of which contains 10 numbers. An integer greater than 1 is prime if its only positive divisor is 1 or itself. For example, 2, 3, 5, and 7 are prime numbers, but 4, 6, 8, and 9 are not.'), para('Solution: The problem can be broken into the following tasks:'), bul('For number = 2, 3, 4, 5, 6, ..., test whether the number is prime.'), bul('Determine whether a given number is prime.'), bul('Count the prime numbers.'), bul('Print each prime number, and print 10 numbers per line.'), note('Example program: PrimeNumber')], explain: '<p>A <b>{{prime|عدد أوّلي}}</b> has no divisor except 1 and itself. The program has a loop inside a loop: the outer one goes number by number, the inner one looks for a divisor and uses <b>break</b> as soon as it finds one.</p>' },
      31: { image: false, title: '(GUI) Controlling a Loop with a Confirmation Dialog', blocks: [para('A sentinel-controlled loop can be implemented using a confirmation dialog. The answers Yes or No to continue or terminate the loop. The template of the loop may look as follows:'), code(CONF), note('Example program: SentinelValueUsingConfirmationDialog')], explain: '<p>A <b>{{sentinel|قيمة حارسة: قيمة خاصة تعني توقّف}}</b> value is a special value that ends the loop. Here the user’s click is the sentinel: Yes means go on, No means stop. JOptionPane is a class for small {{dialog|نافذة حوار}} windows.</p>' }
    },
    visuals: ALL,
    exam: {
      questions: [
        { type: 'output', q: 'What does this print?', code: 'int i = 1, sum = 0;\nwhile (i <= 4) {\n  sum += i;\n  i++;\n}\nSystem.out.println(sum);', answer: '10', review: 2, why: '1 + 2 + 3 + 4 = 10.' },
        { type: 'output', q: 'What does this print?', code: 'int count = 0;\nwhile (count < 3)\n  count++;\nSystem.out.println(count);', answer: '3', review: 11, why: 'The loop stops when count is 3.' },
        { q: 'When does the body of a while loop run zero times?', options: ['When the condition is false the first time', 'Never: it always runs once', 'When the body is long'], answer: 0, review: 10, why: 'The check comes first.' },
        { type: 'output', q: 'What does this print?', code: 'int x = 10;\ndo {\n  x -= 3;\n} while (x > 0);\nSystem.out.println(x);', answer: '-2', review: 13, why: '10 → 7 → 4 → 1 → -2; then -2 > 0 is false.' },
        { type: 'output', q: 'What does this print?', code: 'for (int i = 10; i > 0; i -= 4)\n  System.out.println(i);', answer: '10\n6\n2', review: 14, why: '-2 is not > 0.' },
        { type: 'output', q: 'What does this print?', code: 'for (int i = 0, j = 10; i < j; i += 2, j -= 2)\n  System.out.println(i + " " + j);', answer: '0 10\n2 8\n4 6', review: 15, why: 'Next would be 6 and 4, and 6 < 4 is false.' },
        { q: 'How many times is "Hi" printed?', code: 'for (int i = 0; i < 10; i++);\n{\n  System.out.println("Hi");\n}', options: ['Once', '10 times', 'Never'], answer: 0, review: 17, why: 'The ; is the body. The block runs once, after the loop.' },
        { q: 'What happens here?', code: 'int i = 0;\nwhile (i < 10);\n{\n  i++;\n}', options: ['An infinite loop', 'i becomes 10', 'A syntax error'], answer: 0, review: 18, why: 'The empty statement repeats forever; i never changes.' },
        { type: 'tf', q: 'Every while loop can be written as a for loop.', answer: true, review: 19, why: 'The three loops are expressively equivalent.' },
        { type: 'output', q: 'What does this print?', code: 'int n = 0;\nwhile (true) {\n  n += 5;\n  if (n > 12)\n    break;\n}\nSystem.out.println(n);', answer: '15', review: 20, why: '5, 10, 15; 15 > 12, so break.' },
        { type: 'output', q: 'What does this print?', code: 'int s = 0;\nfor (int i = 1; i <= 6; i++) {\n  if (i % 2 == 0)\n    continue;\n  s += i;\n}\nSystem.out.println(s);', answer: '9', review: 21, why: 'Even numbers are skipped: 1 + 3 + 5 = 9.' },
        { type: 'output', q: 'What does this print?', code: 'int c = 0;\nfor (int i = 0; i < 3; i++)\n  for (int j = 0; j < 4; j++)\n    c++;\nSystem.out.println(c);', answer: '12', review: 22, why: '3 × 4.' },
        { type: 'output', q: 'What does this print?', code: 'for (int i = 1; i <= 3; i++) {\n  for (int j = 1; j <= i; j++)\n    System.out.print(j);\n  System.out.println();\n}', answer: '1\n12\n123', review: 24, why: 'Row i prints 1 to i.' },
        { type: 'output', q: 'The GCD program of slide 26 gets n1 = 12 and n2 = 8. What is gcd at the end?', code: 'int gcd = 1;\nint k = 2;\nwhile (k <= n1 && k <= n2) {\n  if (n1 % k == 0 && n2 % k == 0)\n    gcd = k;\n  k++;\n}', answer: '4', review: 26, why: '2 and 4 divide both; 8 does not divide 12.' },
        { q: 'Tuition is $10,000 and grows 7% a year. In how many years is it doubled?', options: ['11', '10', '14'], answer: 0, review: 27, why: '1.07 to the power 10 is about 1.97; to the power 11 it is about 2.10.' },
        { q: 'Why does the guessing program of slide 29 need break?', options: ['while (true) has no other way to end', 'To skip a guess', 'break is needed in every loop'], answer: 0, review: 29, why: 'The condition is always true.' },
        { q: 'Which list has only prime numbers?', options: ['2, 3, 5, 7', '1, 3, 5, 7', '2, 3, 9, 11'], answer: 0, review: 30, why: '1 is not prime, and 9 = 3 × 3.' },
        { type: 'write', q: 'Write a for loop that prints the even numbers from 2 to 10, one per line.', rows: 3, checks: [{ re: /for\s*\(\s*int\s+(\w+)\s*=\s*2\s*;\s*\1\s*(<=\s*10|<\s*11|<\s*12)\s*;\s*\1\s*(\+=\s*2|=\s*\1\s*\+\s*2)\s*\)/, label: 'for (int i = 2; i <= 10; i += 2)' }, { re: /System\s*\.\s*out\s*\.\s*println\s*\(\s*\w+\s*\)\s*;/, label: 'System.out.println(i);' }], solution: 'for (int i = 2; i <= 10; i += 2)\n  System.out.println(i);', review: 14, why: 'Start at 2 and add 2 after each iteration.' },
        { type: 'write', q: 'sum is 0 and i is 1. Write a while loop that adds 1 + 2 + … + n into sum.', rows: 4, checks: [{ re: /while\s*\(\s*i\s*<=\s*n\s*\)/, label: 'while (i <= n)' }, { re: /sum\s*\+=\s*i\s*;|sum\s*=\s*sum\s*\+\s*i\s*;/, label: 'sum += i;' }, { re: /i\s*\+\+|\+\+\s*i|i\s*\+=\s*1/, label: 'i++;' }], solution: 'while (i <= n) {\n  sum += i;\n  i++;\n}', review: 2, why: 'The body must change i, or the loop never ends.' },
        { type: 'trace', q: 'Follow the loop. What is sum after the iterations shown?', code: 'int sum = 0;\nfor (int i = 1; i <= 10; i++) {\n  if (i % 4 == 0) continue;\n  if (sum > 15) break;\n  sum += i;\n}', cols: ['iteration', 'sum after it'], rows: [['i = 3', '?6'], ['i = 4', '?6'], ['i = 6', '?17'], ['i = 7', '?17']], review: 21, why: '1 + 2 + 3 = 6; i = 4 is skipped by continue; 6 + 5 + 6 = 17; at i = 7 sum > 15, so break ends the loop.' },
        { type: 'bug', q: 'This loop never stops. Tap the line with the mistake.', code: 'int i = 0;\nwhile (i < 3);\n{\n  i++;\n}', answer: 2, review: 18, why: 'The semicolon after while (…) is an empty body that repeats forever; the block below is never reached.' },
        { type: 'match', q: 'Match each loop with how it tests its condition.', pairs: [['while', 'Tests first: the body may run 0 times'], ['do-while', 'Runs the body first: at least once']], review: 13, why: 'do-while checks after the body.' },
        { type: 'fill', q: 'Complete the code that prints a 3 × 3 multiplication table.', code: 'for (int i = 1; i <= 3; i++) {\n  for (int j = 1; j <= 3; j++)\n    System.out.print(___ + " ");\n  System.out.___();\n}', answer: ['i * j|i*j|j * i|j*i', 'println'], review: 22, why: 'Each cell is i * j; println() ends each row.' }
      ],
      tasks: [
        {
          title: 'Sum from 1 to n',
          task: '<p>Read a positive int n. Use a <b>for</b> loop to add 1 + 2 + … + n, then print <code>The sum is</code> and the result.</p>',
          starter: 'import java.util.Scanner;\n\npublic class SumToN {\n  public static void main(String[] args) {\n    Scanner input = new Scanner(System.in);\n    System.out.print("Enter n: ");\n    int n = input.nextInt();\n    \n  }\n}',
          output: 'Enter n: 5\nThe sum is 15',
          checks: [
            { re: /int\s+\w+\s*=\s*0\s*;/, label: 'Starts a sum at 0', review: 20 },
            { re: /for\s*\(\s*int\s+(\w+)\s*=\s*1\s*;\s*\1\s*<=\s*n\s*;\s*\1\s*\+\+\s*\)/, label: 'Has <code>for (int i = 1; i <= n; i++)</code>', review: 14 },
            { re: /\w+\s*\+=\s*\w+\s*;|(\w+)\s*=\s*\1\s*\+\s*\w+\s*;/, label: 'Adds i to the sum in the body', review: 20 },
            { re: /println\s*\(\s*"The sum is "\s*\+/, label: 'Prints <code>The sum is </code> and the sum', review: 21 },
            { fn: braces, label: 'Braces match', review: 14 }
          ],
          solution: 'import java.util.Scanner;\n\npublic class SumToN {\n  public static void main(String[] args) {\n    Scanner input = new Scanner(System.in);\n    System.out.print("Enter n: ");\n    int n = input.nextInt();\n    int sum = 0;\n    for (int i = 1; i <= n; i++) {\n      sum += i;\n    }\n    System.out.println("The sum is " + sum);\n  }\n}'
        },
        {
          title: 'Countdown',
          task: '<p>Use a <b>while</b> loop to print the numbers 10, 9, 8, …, 1, one per line. After the loop, print <code>Go!</code>.</p>',
          starter: 'public class Countdown {\n  public static void main(String[] args) {\n    \n  }\n}',
          output: '10\n9\n8\n7\n6\n5\n4\n3\n2\n1\nGo!',
          checks: [
            { re: /int\s+(\w+)\s*=\s*10\s*;/, label: 'Starts a counter at 10', review: 3 },
            { re: /while\s*\(\s*\w+\s*(>\s*0|>=\s*1)\s*\)/, label: 'Has <code>while (i > 0)</code>', review: 2 },
            { re: /\w+\s*--|--\s*\w+|\w+\s*-=\s*1/, label: 'Makes the counter smaller in the body', review: 6 },
            { re: /\}\s*System\.out\.println\s*\(\s*"Go!"\s*\)/, label: 'Prints Go! <b>after</b> the loop', review: 11 },
            { fn: braces, label: 'Braces match', review: 2 }
          ],
          solution: 'public class Countdown {\n  public static void main(String[] args) {\n    int i = 10;\n    while (i > 0) {\n      System.out.println(i);\n      i--;\n    }\n    System.out.println("Go!");\n  }\n}'
        },
        {
          title: 'A rectangle of stars',
          task: '<p>Use <b>nested for loops</b> to print 3 lines with 5 stars each. The inner loop prints one <code>*</code> at a time with <code>print</code>; after it, <code>println()</code> ends the line.</p>',
          starter: 'public class Rectangle {\n  public static void main(String[] args) {\n    \n  }\n}',
          output: '*****\n*****\n*****',
          checks: [
            { re: /for\s*\([^)]*<\s*3[^)]*\)|for\s*\([^)]*<=\s*3[^)]*\)/, label: 'An outer loop for the 3 lines', review: 22 },
            { re: /for\s*\([^)]*<\s*5[^)]*\)|for\s*\([^)]*<=\s*5[^)]*\)/, label: 'An inner loop for the 5 stars', review: 22 },
            { re: /for[\s\S]*for/, label: 'The loops are nested', review: 22 },
            { re: /System\.out\.print\s*\(\s*"\*"\s*\)/, label: 'Prints one star with <code>print("*")</code>', review: 24 },
            { re: /System\.out\.println\s*\(\s*\)/, label: 'Ends each line with <code>println()</code>', review: 24 }
          ],
          solution: 'public class Rectangle {\n  public static void main(String[] args) {\n    for (int i = 0; i < 3; i++) {\n      for (int j = 0; j < 5; j++) {\n        System.out.print("*");\n      }\n      System.out.println();\n    }\n  }\n}'
        }
      ]
    }
  });
})();
