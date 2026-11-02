/* CS1 · Unit 1 · Algorithms and Flowcharts (23 slides) */
(function () {
  /* ---------- drawing helpers for flowcharts ---------- */
  function mix(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }
  /* state: 'idle' | 'on' | 'done' */
  function node(id, x, y, w, h, shape, text, state, o) {
    return B(id, x, y, w, h, mix({
      shape: shape, title: text, size: 13, mono: shape !== 'oval',
      tone: state === 'on' ? 'accent' : state === 'done' ? 'teal' : 'blue', hi: state === 'on'
    }, o || {}));
  }
  function line(id, x1, y1, x2, y2, used, o) { return A(id, x1, y1, x2, y2, mix({ tone: used ? 'accent' : 'muted' }, o || {})); }
  function mem(id, x, y, w, name, value, on) {
    return B(id, x, y, w, 44, { tag: name, title: value == null ? '?' : String(value), mono: true, size: 16, tone: on ? 'accent' : value == null ? 'muted' : 'teal', fill: on ? 'solid' : 'soft', dash: value == null, r: 6 });
  }
  function num(v) { return Math.round(v * 100) / 100; }
  function st(k, at) { return k === at ? 'on' : k > at ? 'done' : 'idle'; }

  /* ---------- visual 1: the two phases (slides 2-5) ---------- */
  var phases = {
    id: 'phases', slides: [2, 5], title: 'From a problem to a program',
    steps: [
      { slide: 2, cap: 'Every programming task starts with a <b>problem</b>: something we want the computer to do.' },
      { slide: 2, cap: '<b>Phase 1: problem solving.</b> We write an ordered list of steps that solves the problem. This list is the <b>algorithm</b>.' },
      { slide: 2, cap: '<b>Phase 2: implementation.</b> We write the same steps in a programming language. Now it is a <b>program</b>.' },
      { slide: 3, cap: 'The algorithm is the <b>conceptual</b> solution: the idea. The program is the <b>technical</b> solution: the real code that runs.' },
      { slide: 4, cap: 'First write a <b>general</b> algorithm (pseudocode is fine). Then refine it, again and again, until each step is very close to a computer language.' },
      { slide: 5, cap: 'So the programmer has two jobs: <b>1.</b> create the algorithm, then <b>2.</b> translate each step into a programming language.' }
    ],
    draw: function (k) {
      var alg = k >= 1, prog = k >= 2;
      var items = [
        B('prob', 10, 40, 100, 60, { title: 'Problem', tone: k === 0 ? 'accent' : 'ink', hi: k === 0, size: 15 }),
        A('a1', 112, 70, 178, 70, { tone: alg ? 'accent' : 'muted', dash: !alg }),
        T('a1t', 145, 36, 'phase 1', { anchor: 'middle', size: 12, bold: true, tone: k === 1 ? 'accent' : 'muted' }),
        T('a1u', 145, 92, 'problem\nsolving', { anchor: 'middle', size: 11.5, tone: k === 1 ? 'accent' : 'muted' }),
        B('alg', 180, 20, 150, boxH(3), { title: 'Algorithm', lines: ['Step 1: ...', 'Step 2: ...', 'Step 3: ...'], tone: alg ? (k === 1 || k === 4 ? 'accent' : 'teal') : 'muted', hi: k === 1, dash: !alg, mono: true }),
        A('a2', 332, 70, 418, 70, { tone: prog ? 'accent' : 'muted', dash: !prog }),
        T('a2t', 375, 36, 'phase 2', { anchor: 'middle', size: 12, bold: true, tone: k === 2 ? 'accent' : 'muted' }),
        T('a2u', 375, 92, 'implementation', { anchor: 'middle', size: 11.5, tone: k === 2 ? 'accent' : 'muted' }),
        B('prog', 420, 20, 130, boxH(3), { title: 'Program', lines: ['class Grade {', '  ...', '}'], tone: prog ? (k === 2 ? 'accent' : 'blue') : 'muted', hi: k === 2, dash: !prog, mono: true })
      ];
      if (k === 3) {
        items.push(T('c1', 255, 150, 'conceptual solution', { anchor: 'middle', bold: true, tone: 'teal' }));
        items.push(T('c1b', 255, 170, '(the idea)', { anchor: 'middle', size: 12.5, tone: 'teal' }));
        items.push(T('c2', 485, 150, 'technical solution', { anchor: 'middle', bold: true, tone: 'blue' }));
        items.push(T('c2b', 485, 170, '(the code)', { anchor: 'middle', size: 12.5, tone: 'blue' }));
      }
      if (k === 4) {
        items.push(B('g1', 20, 200, 150, 64, { title: 'general\nalgorithm', tone: 'muted', size: 13 }));
        items.push(T('g1t', 95, 285, 'pseudocode', { anchor: 'middle', size: 12.5, tone: 'muted', italic: true }));
        items.push(A('g12', 172, 232, 218, 232, { tone: 'accent', label: 'refine' }));
        items.push(B('g2', 220, 200, 120, 64, { title: 'more\ndetail', tone: 'blue', size: 13 }));
        items.push(A('g23', 342, 232, 388, 232, { tone: 'accent', label: 'refine' }));
        items.push(B('g3', 390, 200, 155, 64, { title: 'detailed\nalgorithm', tone: 'teal', size: 13, hi: true }));
        items.push(T('g3t', 467, 285, 'close to a computer language', { anchor: 'middle', size: 11.5, tone: 'teal' }));
      }
      if (k === 5) {
        items.push(B('j1', 60, 200, 200, 70, { tag: 'job 1', title: 'create the\nalgorithm', tone: 'teal', size: 14 }));
        items.push(A('j12', 262, 235, 308, 235, { tone: 'accent', label: 'then' }));
        items.push(B('j2', 310, 200, 200, 70, { tag: 'job 2', title: 'translate each step\ninto a language', tone: 'blue', size: 14 }));
      }
      return items;
    }
  };

  /* ready-made marks for Example 1: a pass, a fail, and the two cases right at the border */
  var MARKS = [
    { label: 'PASS', values: { M1: 60, M2: 45, M3: 70, M4: 30 } },
    { label: 'FAIL', values: { M1: 40, M2: 35, M3: 55, M4: 30 } },
    { label: 'Exactly 50', values: { M1: 50, M2: 50, M3: 50, M4: 50 } },
    { label: 'Just below 50', values: { M1: 49, M2: 50, M3: 50, M4: 50 } }
  ];

  /* ---------- visual 2: Example 1 as pseudocode and detailed algorithm (slides 6-8) ---------- */
  var grade = {
    id: 'grade', slides: [6, 8], title: 'Example 1: pass or fail?',
    inputs: [{ id: 'M1', value: 60, min: 0, max: 100 }, { id: 'M2', value: 45, min: 0, max: 100 }, { id: 'M3', value: 70, min: 0, max: 100 }, { id: 'M4', value: 30, min: 0, max: 100 }],
    inputsLabel: 'Change the marks:', presets: MARKS,
    lang: 'text',
    code: 'Step 1:  Input M1,M2,M3,M4\nStep 2:  GRADE ← (M1+M2+M3+M4)/4\nStep 3:  if (GRADE < 50) then\n             Print “FAIL”\n         else\n             Print “PASS”\n         endif',
    steps: function (v) {
      var sum = v.M1 + v.M2 + v.M3 + v.M4, g = num(sum / 4), fail = g < 50;
      var word = fail ? 'FAIL' : 'PASS';
      return [
        { line: '1-2', slide: 6, cap: 'The task: a student has <b>four marks</b>. The final grade is their average. Then we say <b>PASS</b> or <b>FAIL</b>.' },
        { line: 1, slide: 7, cap: 'Pseudocode, line 1: <i>Input a set of 4 marks</i>. The marks are ' + [v.M1, v.M2, v.M3, v.M4].join(', ') + '.' },
        { line: 2, slide: 7, cap: 'Line 2: <i>sum and divide by 4</i>. ' + [v.M1, v.M2, v.M3, v.M4].join(' + ') + ' = ' + sum + ', and ' + sum + ' / 4 = <b>' + g + '</b>.' },
        { line: '3-7', slide: 7, cap: 'Line 3: is the average below 50? ' + g + (fail ? ' is below 50, so we print <b>FAIL</b>.' : ' is not below 50, so the else part runs: <b>PASS</b>.'), out: word },
        { slide: 8, clear: true, line: 1, cap: 'Now the <b>detailed algorithm</b>. Step 1 gives each mark a name: M1, M2, M3 and M4.' },
        { slide: 8, line: 2, cap: 'Step 2: calculate the right side, then the arrow <b>←</b> stores the result in GRADE. GRADE = ' + g + '.' },
        { slide: 8, line: fail ? [3, 4] : [3, 5, 6], cap: 'Step 3: is GRADE &lt; 50? ' + g + ' &lt; 50 is <b>' + fail + '</b>, so ' + (fail ? 'the then part prints FAIL.' : 'the else part prints PASS.'), out: word },
        { slide: 8, line: 7, cap: '<b>endif</b> marks the end of the if. Only one of the two Print lines ran. Change the marks above and try again.' }
      ];
    },
    draw: function (k, s, v) {
      var sum = v.M1 + v.M2 + v.M3 + v.M4, g = num(sum / 4), fail = g < 50;
      var named = k >= 4, haveMarks = k >= 1, avg = k === 2 || k === 3 || k >= 5;
      var items = [];
      ['M1', 'M2', 'M3', 'M4'].forEach(function (m, i) {
        items.push(mem('m' + i, 20 + i * 80, 40, 66, named ? m : 'mark ' + (i + 1), haveMarks ? v[m] : null, k === 1 || k === 4));
      });
      items.push(T('plus', 170, 120, haveMarks ? [v.M1, v.M2, v.M3, v.M4].join(' + ') + ' = ' + sum : 'four marks', { anchor: 'middle', mono: true, tone: k === 2 || k === 5 ? 'accent' : 'muted', bold: k === 2 || k === 5 }));
      items.push(A('down', 170, 130, 170, 160, { tone: avg ? 'accent' : 'muted', dash: !avg, label: '÷ 4', la: 'start', lx: 10, ly: 4 }));
      items.push(mem('g', 115, 182, 110, named ? 'GRADE' : 'average', avg ? g : null, k === 2 || k === 5));
      items.push(B('q', 70, 250, 200, 64, { shape: 'diamond', title: (named ? 'GRADE' : 'average') + ' < 50 ?', size: 12.5, mono: true, tone: k === 3 || k === 6 ? 'accent' : 'muted', hi: k === 3 || k === 6 }));
      var dec = k === 3 || k >= 6;
      items.push(B('fail', 380, 120, 150, 50, { shape: 'display', title: 'FAIL', mono: true, size: 15, tone: dec && fail ? 'red' : 'muted', fill: dec && fail ? 'solid' : 'soft', dash: !(dec && fail) }));
      items.push(B('pass', 380, 220, 150, 50, { shape: 'display', title: 'PASS', mono: true, size: 15, tone: dec && !fail ? 'teal' : 'muted', fill: dec && !fail ? 'solid' : 'soft', dash: !(dec && !fail) }));
      items.push(A('toF', 272, 282, 378, 145, { tone: dec && fail ? 'red' : 'muted', bend: -30, label: 'yes', dash: !(dec && fail) }));
      items.push(A('toP', 272, 282, 378, 245, { tone: dec && !fail ? 'teal' : 'muted', bend: 12, label: 'no (else)', ly: 26, dash: !(dec && !fail) }));
      if (k === 0) items.push(T('task', 460, 70, '?', { anchor: 'middle', size: 30, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- visual 3: flowchart symbols (slides 9-15) ---------- */
  var SYM = [
    { id: 'oval', shape: 'oval', name: 'Oval', use: 'the beginning or end of the program' },
    { id: 'para', shape: 'para', name: 'Parallelogram', use: 'an input operation' },
    { id: 'rect', shape: 'rect', name: 'Rectangle', use: 'a process, e.g. addition, subtraction, division' },
    { id: 'dia', shape: 'diamond', name: 'Diamond', use: 'a decision: continue along one of two routes' },
    { id: 'hyb', shape: 'display', name: 'Hybrid', use: 'an output operation' },
    { id: 'flow', shape: 'line', name: 'Flow line', use: 'the direction of logic flow' }
  ];
  function icon(s, id, x, y, w, h, tone, hi) {
    if (s.shape === 'line') return A(id, x + 6, y + h / 2, x + w - 6, y + h / 2, { tone: tone });
    return B(id, x, y, w, h, { shape: s.shape, tone: tone, hi: hi, fill: hi ? 'solid' : 'soft' });
  }
  var symbols = {
    id: 'symbols', slides: [9, 15], title: 'Flowchart symbols',
    steps: [
      { slide: 9, cap: 'A flowchart draws an algorithm. Each kind of step has its own <b>symbol</b>, and <b>flow lines</b> show the order.' },
      { slide: 10, cap: '<b>Oval</b>: the beginning or the end of the program.' },
      { slide: 10, cap: '<b>Parallelogram</b>: an input operation (data comes in).' },
      { slide: 10, cap: '<b>Rectangle</b>: a process, like addition, subtraction or division.' },
      { slide: 10, cap: '<b>Diamond</b>: a decision. The program continues along <b>one of two</b> routes (IF / THEN / ELSE).' },
      { slide: 10, cap: '<b>Hybrid</b>: an output operation (the program shows a result).' },
      { slide: 10, cap: '<b>Flow line</b>: an arrow that shows the direction of the logic flow.' },
      { slide: 11, cap: 'Count the arrows. <b>Start</b>: one out. <b>End</b>: one in. <b>Process</b> and <b>Input/Output</b>: one in, one out. <b>Decision</b>: one in, <b>two</b> out.' },
      { slide: 12, cap: '<b>Start</b> and <b>End</b> blocks begin and finish the program. Their labels are simple, like START and STOP.' },
      { slide: 13, cap: 'The <b>Input/Output</b> block reads data or shows data. Label it with a short description, like <i>Input W, L</i>.' },
      { slide: 14, cap: 'The <b>Process</b> block does an operation on data, often a calculation. Label it with what happens, like <i>A ← L x W</i>.' },
      { slide: 15, cap: 'The <b>Decision</b> block asks a True/False question. T and F each have their own arrow.' }
    ],
    draw: function (k) {
      var items = [];
      if (k === 0) {
        items.push(node('s0', 210, 30, 140, 40, 'oval', 'START', 'done'));
        items.push(line('l0', 280, 72, 280, 108, true));
        items.push(node('s1', 190, 110, 180, 50, 'rect', 'do a step', 'on'));
        items.push(line('l1', 280, 162, 280, 198, true));
        items.push(node('s2', 210, 200, 140, 40, 'oval', 'STOP', 'done'));
        items.push(T('t1', 390, 140, '← a symbol', { tone: 'accent', bold: true }));
        items.push(T('t2', 300, 92, '← a flow line', { tone: 'accent', bold: true, size: 13 }));
        return items;
      }
      if (k <= 6) {
        var cur = k - 1;
        SYM.forEach(function (s, i) {
          items.push(icon(s, 'ic' + i, 18 + i * 90, 18, 70, 34, i === cur ? 'accent' : i < cur ? 'teal' : 'muted', i === cur));
        });
        var s = SYM[cur];
        if (s.shape === 'line') items.push(A('big', 150, 160, 410, 160, { tone: 'accent' }));
        else items.push(B('big', 180, 100, 200, 110, { shape: s.shape, tone: 'accent', hi: true }));
        items.push(T('nm', 280, 260, s.name, { anchor: 'middle', bold: true, size: 20, tone: 'accent' }));
        items.push(T('us', 280, 290, 'denotes ' + s.use, { anchor: 'middle', size: 14, tone: 'ink' }));
        return items;
      }
      if (k === 7) {
        items.push(T('h1', 75, 30, 'Start', { anchor: 'middle', bold: true }));
        items.push(B('st', 25, 42, 100, 40, { shape: 'oval', tone: 'blue' }));
        items.push(A('st1', 75, 84, 75, 118, { tone: 'accent' }));
        items.push(T('h2', 200, 30, 'End', { anchor: 'middle', bold: true }));
        items.push(A('en1', 200, 40, 200, 70, { tone: 'accent' }));
        items.push(B('en', 150, 72, 100, 40, { shape: 'oval', tone: 'blue' }));
        items.push(T('h3', 75, 170, 'Input/Output', { anchor: 'middle', bold: true }));
        items.push(A('io1', 75, 180, 75, 206, { tone: 'accent' }));
        items.push(B('io', 20, 208, 110, 48, { shape: 'para', tone: 'blue' }));
        items.push(A('io2', 75, 258, 75, 292, { tone: 'accent' }));
        items.push(T('h4', 260, 170, 'Process', { anchor: 'middle', bold: true }));
        items.push(A('pr1', 260, 180, 260, 206, { tone: 'accent' }));
        items.push(B('pr', 210, 208, 100, 52, { tone: 'blue', r: 2 }));
        items.push(A('pr2', 260, 262, 260, 296, { tone: 'accent' }));
        items.push(T('h5', 440, 30, 'Decision', { anchor: 'middle', bold: true }));
        items.push(A('de1', 440, 40, 440, 68, { tone: 'accent' }));
        items.push(B('de', 390, 70, 100, 100, { shape: 'diamond', tone: 'blue' }));
        items.push(A('de2', 440, 172, 440, 220, { tone: 'accent' }));
        items.push(A('de3', 492, 120, 525, 220, { tone: 'accent', via: [[525, 120]] }));
        items.push(T('h6', 482, 250, 'two ways out', { anchor: 'middle', size: 12.5, tone: 'accent', bold: true }));
        return items;
      }
      var big = { 8: null, 9: 'para', 10: 'rect', 11: 'diamond' }[k];
      if (k === 8) {
        items.push(T('h1', 170, 70, 'Start', { anchor: 'middle', bold: true, size: 16 }));
        items.push(node('a', 100, 85, 140, 50, 'oval', 'START', 'on'));
        items.push(A('a1', 170, 137, 170, 190, { tone: 'accent' }));
        items.push(T('h2', 390, 70, 'End', { anchor: 'middle', bold: true, size: 16 }));
        items.push(A('b1', 390, 80, 390, 128, { tone: 'accent' }));
        items.push(node('b', 320, 130, 140, 50, 'oval', 'STOP', 'on'));
        items.push(T('n', 280, 260, 'short, simple labels', { anchor: 'middle', tone: 'teal', bold: true }));
        return items;
      }
      var label = { 9: 'Input W, L', 10: 'A ← L x W', 11: 'IS GRADE\n< 50' }[k];
      var name = { 9: 'Input/Output', 10: 'Process', 11: 'Decision' }[k];
      var h = big === 'diamond' ? 120 : 60;
      items.push(T('nm', 280, 34, name, { anchor: 'middle', bold: true, size: 17 }));
      items.push(A('in', 280, 44, 280, 78, { tone: 'accent' }));
      items.push(node('big', 180, 80, 200, h, big, label, 'on', { size: 15 }));
      if (big === 'diamond') {
        items.push(A('t', 280, 202, 280, 280, { tone: 'teal' }));
        items.push(T('tt', 262, 250, 'T', { anchor: 'end', bold: true, tone: 'teal', size: 16 }));
        items.push(A('f', 382, 140, 440, 280, { tone: 'red', via: [[440, 140]] }));
        items.push(T('ft', 410, 128, 'F', { anchor: 'middle', bold: true, tone: 'red', size: 16 }));
        items.push(T('q', 280, 310, 'a True / False choice', { anchor: 'middle', tone: 'accent', bold: true }));
      } else {
        items.push(A('out', 280, 142, 280, 190, { tone: 'accent' }));
        items.push(T('q', 280, 240, k === 9 ? 'reads data in, or shows data out' : 'an operation on data, like a calculation', { anchor: 'middle', tone: 'teal', bold: true }));
      }
      return items;
    }
  };

  /* ---------- visual 4: Example 1 flowchart (slide 16) ---------- */
  var ex1 = {
    id: 'ex1', slides: [16, 16], title: 'Run the Example 1 flowchart', vb: [560, 430], demo: true,
    inputs: [{ id: 'M1', value: 40, min: 0, max: 100 }, { id: 'M2', value: 35, min: 0, max: 100 }, { id: 'M3', value: 55, min: 0, max: 100 }, { id: 'M4', value: 30, min: 0, max: 100 }],
    inputsLabel: 'Marks:', presets: MARKS,
    steps: function (v) {
      var g = num((v.M1 + v.M2 + v.M3 + v.M4) / 4), fail = g < 50;
      return [
        { cap: 'Start at the <b>START</b> oval and follow the arrows.' },
        { cap: 'Input block: read the four marks. M1 = ' + v.M1 + ', M2 = ' + v.M2 + ', M3 = ' + v.M3 + ', M4 = ' + v.M4 + '.' },
        { cap: 'Process block: GRADE ← (' + [v.M1, v.M2, v.M3, v.M4].join('+') + ')/4, so GRADE = <b>' + g + '</b>.' },
        { cap: 'Decision: IS GRADE &lt; 50? ' + g + ' &lt; 50 is ' + (fail ? '<b>true</b>, so we follow <b>Y</b> (yes).' : '<b>false</b>, so we follow <b>N</b> (no).') },
        { cap: 'Output block: ' + (fail ? 'PRINT “FAIL”.' : 'PRINT “PASS”.'), out: fail ? 'FAIL' : 'PASS' },
        { cap: 'Both paths meet again and go to <b>STOP</b>. Press another example above to take the other path.' }
      ];
    },
    draw: function (k, s, v) {
      var g = num((v.M1 + v.M2 + v.M3 + v.M4) / 4), fail = g < 50;
      var yes = k >= 4 && fail, no = k >= 4 && !fail;
      return [
        node('st', 140, 10, 120, 36, 'oval', 'START', st(k, 0)),
        line('e0', 200, 47, 200, 64, k >= 1),
        node('in', 95, 66, 210, 48, 'para', 'Input\nM1,M2,M3,M4', st(k, 1)),
        line('e1', 200, 115, 200, 132, k >= 2),
        node('pr', 80, 134, 240, 40, 'rect', 'GRADE←(M1+M2+M3+M4)/4', st(k, 2), { size: 12 }),
        line('e2', 200, 175, 200, 194, k >= 3),
        node('dc', 120, 196, 160, 84, 'diamond', 'IS GRADE\n< 50', st(k, 3)),
        line('eN', 120, 238, 85, 298, no, { via: [[85, 238]], label: 'N', lx: -8, ly: 2 }),
        line('eY', 280, 238, 315, 298, yes, { via: [[315, 238]], label: 'Y', lx: 8, ly: 2 }),
        node('ps', 10, 300, 150, 52, 'display', 'PRINT\n“PASS”', no ? (k === 4 ? 'on' : 'done') : 'idle'),
        node('fl', 240, 300, 150, 52, 'display', 'PRINT\n“FAIL”', yes ? (k === 4 ? 'on' : 'done') : 'idle'),
        line('j1', 85, 353, 200, 370, no && k >= 5, { via: [[85, 370]], head: false }),
        line('j2', 315, 353, 200, 370, yes && k >= 5, { via: [[315, 370]], head: false }),
        line('j3', 200, 370, 200, 386, k >= 5),
        node('sp', 140, 388, 120, 36, 'oval', 'STOP', st(k, 5)),
        T('mt', 480, 26, 'memory', { anchor: 'middle', bold: true, tone: 'muted', size: 12.5 }),
        mem('m1', 415, 44, 60, 'M1', k >= 1 ? v.M1 : null, k === 1),
        mem('m2', 485, 44, 60, 'M2', k >= 1 ? v.M2 : null, k === 1),
        mem('m3', 415, 110, 60, 'M3', k >= 1 ? v.M3 : null, k === 1),
        mem('m4', 485, 110, 60, 'M4', k >= 1 ? v.M4 : null, k === 1),
        mem('mg', 415, 186, 130, 'GRADE', k >= 2 ? g : null, k === 2 || k === 3)
      ];
    }
  };

  /* ---------- visuals 5 and 6: straight-line examples (slides 17-18, 19-20) ---------- */
  function straight(cfg) {
    return {
      id: cfg.id, slides: cfg.slides, title: cfg.title, inputs: cfg.inputs, inputsLabel: cfg.inputsLabel, presets: cfg.presets, lang: 'text', code: cfg.code,
      steps: function (v) {
        var r = cfg.calc(v);
        return [
          { slide: cfg.slides[0], line: '1-3', cap: cfg.task },
          { slide: cfg.slides[1], line: 1, cap: 'START, then <b>Step 1</b> (input block): ' + cfg.inText(v) + '.' },
          { slide: cfg.slides[1], line: 2, cap: '<b>Step 2</b> (process block): ' + cfg.calcText(v, r) + '.' },
          { slide: cfg.slides[1], line: 3, cap: '<b>Step 3</b> (output block): print ' + cfg.res + ' = ' + r + '.', out: String(r) },
          { slide: cfg.slides[1], line: 3, cap: '<b>STOP</b>. No decision here, so the flowchart is one straight line. Try other values above.' }
        ];
      },
      draw: function (k, s, v) {
        var r = cfg.calc(v);
        var at = [-1, 1, 2, 3, 4][k];
        var items = [
          node('st', 110, 12, 120, 36, 'oval', 'START', k === 0 ? 'idle' : 'done'),
          line('e0', 170, 49, 170, 70, k >= 1),
          node('in', 75, 72, 190, 50, 'para', cfg.inBox, st(at, 1)),
          line('e1', 170, 123, 170, 144, k >= 2),
          node('pr', 80, 146, 180, 42, 'rect', cfg.prBox, st(at, 2)),
          line('e2', 170, 189, 170, 210, k >= 3),
          node('ot', 85, 212, 170, 52, 'display', cfg.outBox, st(at, 3)),
          line('e3', 170, 265, 170, 286, k >= 4),
          node('sp', 110, 288, 120, 36, 'oval', 'STOP', st(at, 4)),
          T('mt', 450, 40, 'memory', { anchor: 'middle', bold: true, tone: 'muted', size: 12.5 })
        ];
        cfg.vars.forEach(function (name, i) {
          items.push(mem('v' + i, 330 + (i % 2) * 125, 60 + Math.floor(i / 2) * 0, 105, name, k >= 1 ? v[name] : null, k === 1));
        });
        items.push(mem('res', 365, 150, 150, cfg.res, k >= 2 ? r : null, k === 2 || k === 3));
        if (k === 0) items.push(T('q', 440, 260, cfg.question, { anchor: 'middle', tone: 'accent', bold: true }));
        return items;
      }
    };
  }
  var ex2 = straight({
    id: 'ex2', slides: [17, 18], title: 'Example 2: feet to centimeters',
    inputs: [{ id: 'Lft', value: 5, min: 0, max: 999 }], inputsLabel: 'Length in feet:',
    presets: [{ label: '1 foot', values: { Lft: 1 } }, { label: '5 feet', values: { Lft: 5 } }, { label: '12 feet', values: { Lft: 12 } }, { label: '0 feet', values: { Lft: 0 } }],
    code: 'Step 1:  Input Lft\nStep 2:  Lcm ← Lft x 30\nStep 3:  Print Lcm',
    task: 'The task: read a length in <b>feet</b> (Lft), multiply it by 30 to get centimeters (Lcm), and print it.',
    vars: ['Lft'], res: 'Lcm', calc: function (v) { return v.Lft * 30; },
    inText: function (v) { return 'read Lft = ' + v.Lft; },
    calcText: function (v, r) { return 'Lcm ← ' + v.Lft + ' x 30, so Lcm = ' + r; },
    inBox: 'Input\nLft', prBox: 'Lcm ← Lft x 30', outBox: 'Print\nLcm', question: 'feet → cm ?'
  });
  var ex3 = straight({
    id: 'ex3', slides: [19, 20], title: 'Example 3: area of a rectangle',
    inputs: [{ id: 'W', value: 4, min: 0, max: 999 }, { id: 'L', value: 6, min: 0, max: 999 }], inputsLabel: 'Width and length:',
    presets: [{ label: '4 x 6', values: { W: 4, L: 6 } }, { label: 'A square: 5 x 5', values: { W: 5, L: 5 } }, { label: 'Long and thin: 2 x 30', values: { W: 2, L: 30 } }],
    code: 'Step 1:  Input W,L\nStep 2:  A ← L x W\nStep 3:  Print A',
    task: 'The task: read the <b>width</b> (W) and <b>length</b> (L) of a rectangle, then calculate and print its area (A).',
    vars: ['W', 'L'], res: 'A', calc: function (v) { return v.L * v.W; },
    inText: function (v) { return 'read W = ' + v.W + ' and L = ' + v.L + ' in one block'; },
    calcText: function (v, r) { return 'A ← ' + v.L + ' x ' + v.W + ', so A = ' + r; },
    inBox: 'Input\nW, L', prBox: 'A ← L x W', outBox: 'Print\nA', question: 'area = ?'
  });

  /* ---------- visual 7: Example 4, the largest value (slides 21-23) ---------- */
  var ex4 = {
    id: 'ex4', slides: [21, 23], title: 'Example 4: the largest value', vb: [560, 430],
    inputs: [{ id: 'VALUE1', value: 8, min: -999, max: 999 }, { id: 'VALUE2', value: 13, min: -999, max: 999 }], inputsLabel: 'Values:',
    presets: [{ label: 'VALUE1 is bigger', values: { VALUE1: 13, VALUE2: 8 } }, { label: 'VALUE2 is bigger', values: { VALUE1: 8, VALUE2: 13 } }, { label: 'Equal', values: { VALUE1: 7, VALUE2: 7 } }, { label: 'Negative numbers', values: { VALUE1: -3, VALUE2: -9 } }],
    lang: 'text',
    code: 'Step 1:  Input VALUE1, VALUE2\nStep 2:  if (VALUE1 > VALUE2) then\n             MAX ← VALUE1\n         else\n             MAX ← VALUE2\n         endif\nStep 3:  Print “The largest value is”, MAX',
    steps: function (v) {
      var big = v.VALUE1 > v.VALUE2, max = big ? v.VALUE1 : v.VALUE2;
      return [
        { line: '1-7', slide: 21, cap: 'The task: read <b>two values</b>, find the larger one, and print it with a message.' },
        { slide: 22, line: 1, cap: 'Step 1: read VALUE1 = ' + v.VALUE1 + ' and VALUE2 = ' + v.VALUE2 + '.' },
        { slide: 22, line: 2, cap: 'Step 2: is VALUE1 &gt; VALUE2? ' + v.VALUE1 + ' &gt; ' + v.VALUE2 + ' is <b>' + big + '</b>.' + (v.VALUE1 === v.VALUE2 ? ' (They are equal, so it is false.)' : '') },
        { slide: 22, line: big ? 3 : 5, cap: big ? 'True, so the then part runs: MAX ← VALUE1. MAX = ' + max + '.' : 'False, so the else part runs: MAX ← VALUE2. MAX = ' + max + '.' },
        { slide: 22, line: 7, cap: 'Step 3: print the message and MAX.', out: 'The largest value is ' + max },
        { line: 1, slide: 23, clear: true, cap: 'Now the same algorithm as a flowchart. START, then the input block.' },
        { slide: 23, line: 2, cap: 'Decision: is VALUE1&gt;VALUE2? ' + (big ? 'Yes, follow <b>Y</b> to the left.' : 'No, follow <b>N</b> to the right.') },
        { slide: 23, line: big ? 3 : 5, cap: (big ? 'MAX ← VALUE1' : 'MAX ← VALUE2') + ', so MAX = ' + max + '.' },
        { line: 7, slide: 23, cap: 'The two paths meet. Print the message and MAX, then STOP.', out: 'The largest value is ' + max }
      ];
    },
    draw: function (k, s, v) {
      var big = v.VALUE1 > v.VALUE2, max = big ? v.VALUE1 : v.VALUE2;
      var items = [];
      var memAt = k >= 5 ? 5 : 1; /* the flowchart run starts again at step 5 */
      var phase = k >= 5 ? k - 5 : -1; /* 0 input, 1 decision, 2 max, 3 print */
      var a = function (n) { return phase < 0 ? (k === 0 ? 'idle' : 'done') : st(phase, n); };
      var pY = phase >= 2 && big, pN = phase >= 2 && !big;
      items.push(node('st', 220, 8, 120, 34, 'oval', 'START', phase < 0 ? (k === 0 ? 'idle' : 'done') : 'done'));
      items.push(line('e0', 280, 43, 280, 60, phase >= 0));
      items.push(node('in', 175, 62, 210, 48, 'para', 'Input\nVALUE1,VALUE2', a(0)));
      items.push(line('e1', 280, 111, 280, 128, phase >= 1));
      items.push(node('dc', 195, 130, 170, 84, 'diamond', 'is\nVALUE1>VALUE2', a(1), { size: 11.5 }));
      items.push(line('eY', 195, 172, 110, 236, pY, { via: [[110, 172]], label: 'Y', lx: -6, ly: 2 }));
      items.push(line('eN', 365, 172, 450, 236, pN, { via: [[450, 172]], label: 'N', lx: 6, ly: 2 }));
      items.push(node('m1', 25, 238, 170, 40, 'rect', 'MAX ← VALUE1', pY ? (phase === 2 ? 'on' : 'done') : phase < 0 && k >= 3 && big ? 'done' : 'idle'));
      items.push(node('m2', 365, 238, 170, 40, 'rect', 'MAX ← VALUE2', pN ? (phase === 2 ? 'on' : 'done') : phase < 0 && k >= 3 && !big ? 'done' : 'idle'));
      items.push(line('j1', 110, 279, 280, 296, pY && phase >= 3, { via: [[110, 296]], head: false }));
      items.push(line('j2', 450, 279, 280, 296, pN && phase >= 3, { via: [[450, 296]], head: false }));
      items.push(line('j3', 280, 296, 280, 312, phase >= 3));
      items.push(node('pr', 150, 314, 260, 60, 'display', 'Print\n“The largest value is”,\nMAX', phase === 3 ? 'on' : phase < 0 && k >= 4 ? 'done' : 'idle', { size: 12 }));
      items.push(line('e4', 280, 375, 280, 390, phase >= 3));
      items.push(node('sp', 220, 392, 120, 34, 'oval', 'STOP', phase === 3 ? 'done' : 'idle'));
      items.push(mem('v1', 15, 50, 100, 'VALUE1', k >= 1 ? v.VALUE1 : null, k === 1 || k === memAt));
      items.push(mem('v2', 445, 50, 100, 'VALUE2', k >= 1 ? v.VALUE2 : null, k === 1 || k === memAt));
      var mx = (k >= 3 && k <= 4) || phase >= 2;
      items.push(mem('mx', 445, 120, 100, 'MAX', mx ? max : null, k === 3 || phase === 2));
      return items;
    }
  };

  addUnit({
    course: 'cs1', lesson: '01-algorithms-and-flowcharts',
    blurb: 'Plan before you code: the two programming phases, pseudocode, algorithms and flowchart symbols, with four worked examples.',
    parts: [
      {
        title: 'Programming phases', from: 1, to: 5,
        quiz: [
          { q: 'Slide 4 says: “Refine the algorithm successively”. What does this mean?', options: ['Throw the algorithm away and start again', 'Write the program only one time', 'Make the steps more detailed, again and again'], answer: 2, why: '<i>Refine</i> = make it better and more detailed. <i>Successively</i> = one time after another.' },
          { type: 'tf', q: 'The algorithm is the <b>technical</b> solution of a problem.', answer: false, why: 'Slide 3: the algorithm is the <b>conceptual</b> solution. The program is the technical solution.' },
          { type: 'fill', lang: 'text', q: 'Complete the sentence from slide 2.', code: 'This sequence of steps is called an ___.', answer: ['algorithm'], why: 'An ordered sequence of steps that solves a problem is an <b>algorithm</b>.' },
          { q: 'In which phase do we write the steps in a programming language?', options: ['The problem solving phase', 'The implementation (programming) phase'], answer: 1, why: 'Problem solving makes the algorithm. Implementation turns it into a program.' },
          { type: 'order', lang: 'text', q: 'Put the programmer’s work in the right order (slides 2 and 5).', lines: ['Understand the problem', 'Create an algorithm for it', 'Translate each step into a programming language'], why: 'First solve the problem (the algorithm), then implement it (the program).' }
        ]
      },
      {
        title: 'Pseudocode and algorithm', from: 6, to: 8,
        quiz: [
          { type: 'output', lang: 'text', q: 'What does this algorithm print?', code: 'M1 = 40, M2 = 35, M3 = 55, M4 = 30\nGRADE ← (M1+M2+M3+M4)/4\nif (GRADE < 50) then\n    Print “FAIL”\nelse\n    Print “PASS”\nendif', answer: 'FAIL|“FAIL”|"FAIL"', why: '(40 + 35 + 55 + 30) / 4 = 40. 40 &lt; 50 is true, so it prints FAIL.' },
          { q: 'All four marks are 50. What does Example 1 print?', options: ['PASS', 'FAIL'], answer: 0, why: 'GRADE = 50. Is 50 &lt; 50? No, so the else part runs: PASS.' },
          { type: 'fill', lang: 'text', q: 'The final grade is the average of <b>four</b> marks. What is missing?', code: 'GRADE ← (M1+M2+M3+M4)/___', answer: ['4'], why: 'The average of four marks: add them, then divide by 4.' },
          { type: 'fill', lang: 'text', q: 'Two words are missing from the detailed algorithm.', code: 'if (GRADE < 50) ___\n    Print “FAIL”\nelse\n    Print “PASS”\n___', answer: ['then', 'endif'], why: '<code>if ... then ... else ... endif</code>: <b>endif</b> shows where the if ends.' },
          { q: 'What does the arrow mean in <code>GRADE ← (M1+M2+M3+M4)/4</code>?', options: ['Go back to Step 1', 'GRADE is smaller than the right side', 'Calculate the right side and store it in GRADE'], answer: 2, why: 'The arrow puts the value on the right into the name on the left.' },
          { type: 'order', q: 'Put the steps of the detailed algorithm in the right order.', lang: 'text', lines: ['Input M1,M2,M3,M4', 'GRADE ← (M1+M2+M3+M4)/4', 'if (GRADE < 50) then Print “FAIL” else Print “PASS”'], why: 'First read the marks, then calculate GRADE, then decide. You cannot test GRADE before you calculate it.' }
        ]
      },
      {
        title: 'Flowchart symbols', from: 9, to: 15,
        quiz: [
          { q: 'Which symbol denotes an <b>input</b> operation?', options: ['Oval', 'Rectangle', 'Diamond', 'Parallelogram'], answer: 3, why: 'Slide 10: the parallelogram denotes an input operation.' },
          { q: 'Which symbol is used for a <b>decision</b>?', options: ['Rectangle', 'Diamond', 'Hybrid'], answer: 1, why: 'The diamond asks a question. The program continues along one of two routes.' },
          { q: 'In the table on slide 10, which symbol denotes an <b>output</b> operation?', options: ['Rectangle', 'Oval', 'Hybrid'], answer: 2, why: 'Slide 10: the hybrid shape denotes an output operation.' },
          { type: 'tf', q: 'The decision block should be a True/False choice.', answer: true, why: 'Slide 15. The label is a question, and the answer is True or False.' },
          { q: 'Slide 10: the flow line “denotes the direction of logic flow”. What does that mean?', options: ['It is a calculation', 'It shows which step comes next', 'It ends the program'], answer: 1, why: 'The arrows tell you the order: follow them from one symbol to the next.' },
          { q: 'How many arrows come <b>out</b> of a decision block?', options: ['One', 'None', 'Two'], answer: 2, why: 'One arrow for True and one for False (slides 11 and 15).' }
        ]
      },
      {
        title: 'Flowchart examples', from: 16, to: 23,
        quiz: [
          { q: 'Example 2 with Lft = 3. What is printed?', options: ['10', '33', '90'], answer: 2, why: 'Lcm ← 3 x 30 = 90.' },
          { type: 'fill', lang: 'text', q: 'Example 2 changes feet to centimeters. Which sign is missing?', code: 'Lcm ← Lft ___ 30', answer: ['x|*|×'], why: 'Multiply the length in feet by 30: <code>Lcm ← Lft x 30</code>.' },
          { type: 'output', lang: 'text', q: 'What does this part of Example 3 print?', code: 'W = 3, L = 7\nA ← L x W\nPrint A', answer: '21', why: 'A ← 7 x 3 = 21.' },
          { q: 'Example 4 with VALUE1 = 7 and VALUE2 = 7. Which process block runs?', options: ['MAX ← VALUE1', 'MAX ← VALUE2', 'Both of them'], answer: 1, why: '7 &gt; 7 is false, so the N path runs: MAX ← VALUE2. Only one path runs.' },
          { type: 'output', q: 'The input is VALUE1 = 4 and VALUE2 = 9. What does the algorithm print?', lang: 'text', code: 'Step 1:  Input VALUE1, VALUE2\nStep 2:  if (VALUE1 > VALUE2) then\n             MAX ← VALUE1\n         else\n             MAX ← VALUE2\n         endif\nStep 3:  Print “The largest value is”, MAX', answer: 'The largest value is 9|The largest value is, 9|The largest value is9', why: '4 &gt; 9 is false, so MAX ← VALUE2 = 9. Then it prints the message and 9.' }
        ]
      }
    ],
    slides: {
      1: {
        cover: true,
        explain: '<p>This first unit is about <b>planning</b> a program before writing it. You will learn two tools that programmers use to plan: an <b>algorithm</b> (the steps, written in words) and a <b>flowchart</b> (the same steps, drawn).</p><p>There is no Java code yet. Press <b>Next</b> at the bottom to start.</p>'
      },
      2: {
        blocks: [
          { type: 'bullet', text: 'A typical programming task can be divided into 2 phases:' },
          { type: 'bullet', html: '<b><i>Problem solving phase</i></b>' },
          { type: 'bullet', level: 1, text: 'produce an ordered sequence of steps that describe a solution of the problem' },
          { type: 'bullet', level: 1, html: 'this sequence of steps is called an <b><i>algorithm</i></b>' },
          { type: 'bullet', html: '<b><i>Implementation/Programming phase</i></b>' },
          { type: 'bullet', level: 1, text: 'implement the program in some programming language' }
        ],
        explain: '<p>Making a program happens in two {{phases|مراحل}}:</p><ol><li><b>Problem solving:</b> you think first, and write the steps of the solution in the right order. This list of steps is the <b>algorithm</b>.</li><li><b>Implementation:</b> you write those same steps in a programming language, like Java.</li></ol><p>Press <b>Next step</b> in the drawing to see the two phases.</p>'
      },
      3: {
        blocks: [
          { type: 'bullet', html: 'The central concept underlying all computation is that of the <i>algorithm</i>' },
          { type: 'bullet', level: 1, text: 'an algorithm is a step-by-step sequence of instructions for carrying out some task.' },
          { type: 'bullet', level: 1, text: 'The algorithm is a conceptual solution' },
          { type: 'bullet', level: 1, text: 'The technical solution is the program implementing the algorithm.' }
        ],
        explain: '<p>The algorithm is the most important idea in computing. It is a list of {{instructions|تعليمات}}, one step after another, that does a task. A cooking {{recipe|وصفة}} is a good everyday example of an algorithm.</p><p>The algorithm is the <b>{{conceptual|فكري / على مستوى الفكرة}}</b> solution: the idea. The program is the <b>technical</b> solution: real code that follows the idea.</p>'
      },
      4: {
        blocks: [
          { type: 'bullet', html: 'First produce a general algorithm (one can use <b><i>pseudocode</i></b>)' },
          { type: 'bullet', html: 'Refine the algorithm successively to get step by step detailed <b><i>algorithm</i></b> that is very close to a computer language.' },
          { type: 'bullet', html: '<b><i>Pseudocode</i></b> is an artificial and informal language that helps programmers develop algorithms.' },
          { type: 'bullet', level: 1, text: 'Pseudocode is very similar to everyday English.' }
        ],
        explain: '<p>Solving a problem is done in small moves:</p><ol><li>Write a <b>general</b> algorithm first. You can write it in pseudocode.</li><li>{{Refine|حسّن وفصّل}} it {{successively|مرة بعد مرة}}: make each step smaller and clearer, until the steps are very close to a computer language.</li></ol><p><b>Pseudocode</b> is a made-up ({{artificial|مصطنع}}), {{informal|غير رسمي}} language: there are no strict rules. It reads almost like normal English.</p>'
      },
      5: {
        blocks: [
          { type: 'bullet', text: 'Programming can be viewed as the process of designing and implementing algorithms that a computer can carry out.' },
          { type: 'bullet', text: 'A programmer’s job is to:' },
          { type: 'bullet', level: 1, text: 'create an algorithm for accomplishing a given objective, then' },
          { type: 'bullet', level: 1, text: 'translate the individual steps of the algorithm into a programming language that the computer can understand' }
        ],
        explain: '<p>So programming means two things: <b>design</b> an algorithm, then <b>implement</b> it (write it as code).</p><p>A programmer first creates an algorithm for a goal ({{objective|هدف}}). Then the programmer {{translates|يترجم}} each step into a programming language, because the computer only understands exact instructions.</p>'
      },
      6: {
        blocks: [
          { type: 'bullet', html: '<b>Example 1:</b> Write an algorithm to determine a student’s final grade and indicate whether it is passing or failing. The final grade is calculated as the average of four marks.' }
        ],
        explain: '<p>Now a full example. A student has <b>four marks</b>. The final grade is their {{average|متوسط}}. If the grade is below 50 the student fails, otherwise the student passes.</p><p>In the drawing, press the example buttons: <b>PASS</b>, <b>FAIL</b>, <b>Exactly 50</b> and <b>Just below 50</b>. Or type your own marks. Watch how the answer changes, especially at the border: is 50 a pass?</p>'
      },
      7: {
        blocks: [
          { type: 'h', html: '<b>Pseudocode</b>:' },
          { type: 'bullet', html: '<i>Input a set of 4 marks</i>' },
          { type: 'bullet', html: '<i>Calculate their average by summing and dividing by 4</i>' },
          { type: 'bullet', html: '<i>if average is below 50<br>&emsp;&emsp;Print “FAIL”<br>else<br>&emsp;&emsp;Print “PASS”</i>' }
        ],
        explain: '<p>This is the <b>pseudocode</b>: short English sentences, one step each.</p><ul><li><i>summing and dividing by 4</i> means: add the four marks, then divide the total by 4.</li><li><i>if ... else</i> makes a choice. Only <b>one</b> of the two Print lines runs: FAIL when the average is below 50, PASS in every other case.</li></ul>'
      },
      8: {
        blocks: [
          { type: 'bullet', text: 'Detailed Algorithm' },
          { type: 'code', lang: 'text', text: 'Step 1:  Input M1,M2,M3,M4\nStep 2:  GRADE ← (M1+M2+M3+M4)/4\nStep 3:  if (GRADE < 50) then\n             Print “FAIL”\n         else\n             Print “PASS”\n         endif' }
        ],
        explain: '<p>The <b>detailed algorithm</b> says the same as the pseudocode, but more exactly:</p><ul><li>The marks now have names: <b>M1, M2, M3, M4</b>.</li><li>The arrow <b>←</b> means: calculate the right side, then store the result in the name on the left. So <code>GRADE ← (M1+M2+M3+M4)/4</code> puts the average into GRADE.</li><li><b>endif</b> shows where the if ends.</li></ul>'
      },
      9: {
        blocks: [
          { type: 'bullet', text: 'A schematic representation of a sequence of operations, as in a manufacturing process or computer program.' },
          { type: 'bullet', text: 'A graphical representation of the sequence of operations in an information system or program.' },
          { type: 'bullet', level: 1, text: 'Information system flowcharts show how data flows from source documents through the computer to final distribution to users.' },
          { type: 'bullet', level: 1, text: 'Program flowcharts show the sequence of instructions in a single program or subroutine.' },
          { type: 'bullet', level: 2, text: 'Different symbols are used to draw each type of flowchart.' }
        ],
        explain: '<p>A <b>flowchart</b> is a drawing ({{graphical representation|تمثيل بالرسم}}) of the steps, in order.</p><ul><li><b>Information system</b> flowcharts show how data moves through a whole system, from papers to the computer to the users.</li><li><b>Program</b> flowcharts show the steps of one program. This is the kind we draw in this unit.</li></ul><p>Each kind of step has its own {{symbol|رمز}}.</p>'
      },
      10: {
        text: false,
        explain: '<p>Learn these six symbols. Every flowchart in this unit uses them:</p><div class="tblwrap"><table><tr><th>Name</th><th>Use</th></tr><tr><td>Oval</td><td>the beginning or end of the program</td></tr><tr><td>Parallelogram</td><td>input</td></tr><tr><td>Rectangle</td><td>a process, like a calculation</td></tr><tr><td>Diamond</td><td>a decision (one of two routes)</td></tr><tr><td>Hybrid</td><td>output</td></tr><tr><td>Flow line</td><td>the direction of the flow</td></tr></table></div><p>Press <b>Next step</b> in the drawing to see each symbol.</p>'
      },
      11: {
        text: false,
        explain: '<p>Look at the <b>arrows</b> in and out of each symbol:</p><ul><li><b>Start</b>: one arrow goes out. <b>End</b>: one arrow comes in.</li><li><b>Input/Output</b> and <b>Process</b>: one arrow in, one arrow out.</li><li><b>Decision</b>: one arrow in, but <b>two</b> arrows out, one for each answer.</li></ul>'
      },
      12: {
        blocks: [
          { type: 'paragraph', html: '<b>These blocks are used to start and end a process or program.</b>' },
          { type: 'paragraph', html: '<b>They should contain simple labels to indicate the process or program.</b>' }
        ],
        explain: '<p>A flowchart begins at the <b>Start</b> block and finishes at the <b>End</b> block. Both use the oval. Keep the label short: the examples in this unit use <b>START</b> and <b>STOP</b>.</p><p>The slide shows the two blocks. The drawing next to it shows them too.</p>'
      },
      13: {
        blocks: [
          { type: 'paragraph', html: '<b>This block can represent either input or output statements.</b>' },
          { type: 'paragraph', html: '<b>It should be labeled with a brief description of the input or output.</b>' }
        ],
        explain: '<p>This block is used for <b>input</b> (data comes in, like reading numbers) or <b>output</b> (the program shows something). Write a short ({{brief|مختصر}}) label, like <i>Input W, L</i>.</p><p>Note: slide 10 gives output its own hybrid shape. The examples in this unit use the parallelogram for <i>Input</i> and the hybrid shape for <i>Print</i>.</p>'
      },
      14: {
        blocks: [
          { type: 'paragraph', html: '<b>The process block represents some operation carried out on an element of data. This could be a calculation.</b>' },
          { type: 'paragraph', html: '<b>This block should be labeled with a brief description of the process being carried out.</b>' }
        ],
        explain: '<p>A <b>process</b> block (a rectangle) does something with data. Most of the time it is a calculation, like <i>A ← L x W</i>. Its label says what happens.</p>'
      },
      15: {
        blocks: [
          { type: 'paragraph', html: '<b>The decision block should be a True/False choice.</b>' },
          { type: 'paragraph', html: '<b>The label on the block should contain the question to the decision that should be made.</b>' }
        ],
        explain: '<p>A <b>decision</b> block asks a yes/no question, like <i>IS GRADE &lt; 50</i>. The answer is <b>T</b> (True, yes) or <b>F</b> (False, no). Each answer has its own arrow, so the flowchart follows only one of the two paths.</p>'
      },
      16: {
        text: false,
        explain: '<p>Example 1 as a flowchart, next to its algorithm. Follow it from <b>START</b>:</p><ol><li>Input the four marks (parallelogram).</li><li>Calculate GRADE (rectangle).</li><li>Ask: <i>IS GRADE &lt; 50</i>? (diamond). <b>Y</b> goes to PRINT “FAIL”, <b>N</b> goes to PRINT “PASS”.</li><li>Both paths meet again, then <b>STOP</b>.</li></ol><p>The drawing starts with marks that FAIL. Press <b>PASS</b> or <b>Exactly 50</b> to take the other path.</p>'
      },
      17: {
        blocks: [
          { type: 'bullet', text: 'Write an algorithm and draw a flowchart to convert the length in feet to centimeter.' },
          { type: 'h', html: '<b>Pseudocode</b>:' },
          { type: 'bullet', level: 1, html: '<i>Input the length in feet (Lft)</i>' },
          { type: 'bullet', level: 1, html: '<i>Calculate the length in cm (Lcm) by multiplying Lft with 30</i>' },
          { type: 'bullet', level: 1, html: '<i>Print length in cm (Lcm)</i>' }
        ],
        explain: '<p>Example 2 changes ({{converts|يحوّل}}) a length from <b>feet</b> to <b>centimeters</b>. The slide multiplies by 30.</p><p>Only three steps: input, calculate, print. There is no question to ask, so there is no decision.</p>'
      },
      18: {
        text: false,
        explain: '<p>The algorithm and the flowchart side by side. Each step becomes one symbol:</p><ul><li><i>Input Lft</i>: parallelogram.</li><li><i>Lcm ← Lft x 30</i>: rectangle. Calculate Lft times 30, and store it in Lcm.</li><li><i>Print Lcm</i>: hybrid (output).</li></ul><p>The flowchart is one straight line from START to STOP. Try other lengths in the drawing.</p>'
      },
      19: {
        blocks: [
          { type: 'paragraph', text: 'Write an algorithm and draw a flowchart that will read the two sides of a rectangle and calculate its area.' },
          { type: 'h', html: '<b>Pseudocode</b>' },
          { type: 'bullet', html: '<i>Input the width (W) and Length (L) of a rectangle</i>' },
          { type: 'bullet', html: '<i>Calculate the area (A) by multiplying L with W</i>' },
          { type: 'bullet', html: '<i>Print A</i>' }
        ],
        explain: '<p>Example 3: the {{area|المساحة}} of a {{rectangle|مستطيل}} is its length times its width. One input block can read <b>two</b> values at the same time: W and L.</p>'
      },
      20: {
        text: false,
        explain: '<p>This flowchart has the same shape as Example 2: START, input, process, output, STOP.</p><p><i>A ← L x W</i> stores the area in A. Then <i>Print A</i> shows it.</p>'
      },
      21: {
        explain: '<p>Example 4 needs a <b>decision</b>: which of the two values is bigger?</p><p>An <b>{{identifying message|رسالة توضيحية}}</b> is a sentence that says what the number means, like <i>The largest value is</i>.</p>'
      },
      22: {
        blocks: [
          { type: 'h', html: '<b>ALGORITHM</b>' },
          { type: 'code', lang: 'text', text: 'Step 1:  Input VALUE1, VALUE2\nStep 2:  if (VALUE1 > VALUE2) then\n             MAX ← VALUE1\n         else\n             MAX ← VALUE2\n         endif\nStep 3:  Print “The largest value is”, MAX' }
        ],
        explain: '<p><b>MAX</b> is a name that will hold the larger value.</p><ul><li>If <i>VALUE1 &gt; VALUE2</i> is true, MAX gets VALUE1.</li><li>Else, MAX gets VALUE2.</li></ul><p>What if the two values are the same? Then <i>VALUE1 &gt; VALUE2</i> is false, so MAX gets VALUE2. That is fine: both numbers are equal. Try it in the drawing.</p>'
      },
      23: {
        text: false,
        explain: '<p>The full flowchart of Example 4. After the diamond, <b>Y</b> goes left and <b>N</b> goes right. Each path stores a value in MAX. The two paths meet, then one Print block shows the message and MAX.</p>'
      }
    },
    visuals: [phases, grade, symbols, ex1, ex2, ex3, ex4],
    exam: {
      questions: [
        { q: 'Which phase produces the <b>algorithm</b>?', options: ['The problem solving phase', 'The implementation phase'], answer: 0, review: 2, why: 'The problem solving phase produces the ordered steps: the algorithm.' },
        { type: 'tf', q: 'Pseudocode has strict rules, like a programming language.', answer: false, review: 4, why: 'Pseudocode is <b>informal</b>: there are no strict rules. It is very similar to everyday English.' },
        { q: 'What is the <b>first</b> job of a programmer?', options: ['Translate the steps into a programming language', 'Create an algorithm for the objective', 'Draw the flowchart symbols'], answer: 1, review: 5, why: 'Slide 5: first create the algorithm, then translate it.' },
        { type: 'output', lang: 'text', q: 'What does this algorithm print?', code: 'M1 = 70, M2 = 80, M3 = 20, M4 = 30\nGRADE ← (M1+M2+M3+M4)/4\nif (GRADE < 50) then\n    Print “FAIL”\nelse\n    Print “PASS”\nendif', answer: 'PASS|“PASS”|"PASS"', review: 8, why: '(70 + 80 + 20 + 30) / 4 = 50. 50 &lt; 50 is false, so it prints PASS.' },
        { type: 'fill', lang: 'text', q: 'Which symbol stores the value in GRADE?', code: 'Step 2:  GRADE ___ (M1+M2+M3+M4)/4', answer: ['←|<-'], review: 8, why: 'The arrow ← stores the value of the right side in GRADE.' },
        { q: 'Which symbol denotes a <b>process</b>, like a calculation?', options: ['Oval', 'Parallelogram', 'Rectangle'], answer: 2, review: 10, why: 'Slide 10: the rectangle denotes a process, e.g. addition, subtraction, division.' },
        { q: 'Which symbol has one arrow in and <b>two</b> arrows out?', options: ['Decision', 'Process', 'Input/Output'], answer: 0, review: 11, why: 'A decision has two ways out: one for each answer.' },
        { type: 'tf', q: 'The End block has an arrow going <b>out</b> of it.', answer: false, review: 11, why: 'Slide 11: arrows go <b>into</b> the End block. Nothing comes after the end.' },
        { q: 'What should the label on a decision block contain?', options: ['The name of the program', 'The question of the decision', 'The output'], answer: 1, review: 15, why: 'Slide 15: the label contains the question to the decision that should be made.' },
        { q: 'In the Example 1 flowchart, GRADE is 49.75. Which path is taken?', options: ['Y, then PRINT “FAIL”', 'N, then PRINT “PASS”'], answer: 0, review: 16, why: '49.75 &lt; 50 is true, so the flowchart follows Y to PRINT “FAIL”.' },
        { type: 'output', lang: 'text', q: 'Example 2 with this input. What is printed?', code: 'Lft = 10\nLcm ← Lft x 30\nPrint Lcm', answer: '300', review: 18, why: 'Lcm ← 10 x 30 = 300.' },
        { type: 'order', lang: 'text', q: 'Put the blocks of the Example 3 flowchart in order, from top to bottom.', lines: ['START', 'Input W, L', 'A ← L x W', 'Print A', 'STOP'], review: 20, why: 'Start, read the values, calculate, show the result, stop.' },
        { type: 'output', lang: 'text', q: 'Example 4 with VALUE1 = 12 and VALUE2 = 5. What is printed?', code: 'if (VALUE1 > VALUE2) then\n    MAX ← VALUE1\nelse\n    MAX ← VALUE2\nendif\nPrint “The largest value is”, MAX', answer: 'The largest value is 12|The largest value is, 12|The largest value is12', review: 22, why: '12 &gt; 5 is true, so MAX ← VALUE1 = 12.' },
        { type: 'fill', lang: 'text', q: 'Example 4 asks if VALUE1 is bigger. Which sign is missing?', code: 'if (VALUE1 ___ VALUE2) then', answer: ['>'], review: 22, why: '<code>VALUE1 &gt; VALUE2</code> asks: is VALUE1 greater than VALUE2?' },
        { type: 'write', lang: 'text', q: 'Write Step 2 of an algorithm that changes minutes (M) into hours (H): divide M by 60 and store it in H. Type <- for the arrow if you cannot type ←.', checks: [{ re: /H\s*←\s*M\s*\/\s*60/, label: 'H ← M / 60' }], solution: 'H ← M / 60', review: 18, why: 'The arrow stores the result of the right side in the name on the left.' },
        { type: 'trace', lang: 'text', q: 'Follow the algorithm of Example 4. What is MAX?', code: 'if (VALUE1 > VALUE2) then\n    MAX ← VALUE1\nelse\n    MAX ← VALUE2\nendif', cols: ['VALUE1', 'VALUE2', 'MAX'], rows: [['-3', '-8', '?-3'], ['100', '250', '?250'], ['7', '7', '?7']], review: 22, why: '-3 > -8 is true. 100 > 250 is false, so MAX gets VALUE2. 7 > 7 is false, so MAX gets VALUE2, which is also 7.' },
        { type: 'bug', lang: 'text', q: 'This algorithm should change feet to centimeters. Tap the wrong step.', code: 'Step 1:  Input Lft\nStep 2:  Lcm ← Lft / 30\nStep 3:  Print Lcm', answer: 2, review: 18, why: 'The length in feet must be multiplied by 30, not divided.' },
        { type: 'match', q: 'Match each block of the Example 4 flowchart with its symbol.', pairs: [['Input VALUE1, VALUE2', 'Parallelogram'], ['is VALUE1 > VALUE2', 'Diamond'], ['MAX ← VALUE1', 'Rectangle'], ['STOP', 'Oval']], review: 23, why: 'Input, decision, process and the end.' },
        { type: 'order', lang: 'text', q: 'Put the blocks of the Example 2 flowchart in order.', lines: ['START', 'Input Lft', 'Lcm ← Lft x 30', 'Print Lcm', 'STOP'], review: 18, why: 'A straight line: input, process, output.' },
        { type: 'fill', lang: 'text', q: 'Complete the decision of Example 4.', code: 'if (VALUE1 ___ VALUE2) then\n    MAX ← VALUE1', answer: ['>'], review: 22, why: 'MAX gets VALUE1 only when VALUE1 is bigger.' }
      ],
      tasks: [
        {
          lang: 'text', title: 'Perimeter of a rectangle',
          task: '<p>Write the <b>detailed algorithm</b> for this problem, like slides 18 and 20:</p><p class="tip">Read the length <b>L</b> and the width <b>W</b> of a rectangle. Calculate the perimeter <b>P</b> as 2 x (L + W). Print P.</p>',
          starter: 'Step 1:  \nStep 2:  \nStep 3:  ',
          checks: [
            { re: /input\s+(l\s*,\s*w|w\s*,\s*l)\b/i, label: 'Step 1 reads L and W with <b>Input</b>', review: 19 },
            { re: /\bP\s*←\s*2\s*[x*×]\s*\(\s*(L\s*\+\s*W|W\s*\+\s*L)\s*\)/i, label: 'Step 2 calculates P with the arrow ←: <code>P ← 2 x (L + W)</code>', review: 8 },
            { re: /print\s+P\b/i, label: 'Step 3 prints P with <b>Print</b>', review: 20 },
            { re: /input[\s\S]*P\s*←[\s\S]*print/i, label: 'The steps are in order: input, then calculate, then print', review: 2 }
          ],
          solution: 'Step 1:  Input L, W\nStep 2:  P ← 2 x (L + W)\nStep 3:  Print P'
        },
        {
          lang: 'text', title: 'Positive or not?',
          task: '<p>Write the <b>detailed algorithm</b>, like Example 4 on slide 22:</p><p class="tip">Read a number <b>N</b>. If N is greater than 0, print “POSITIVE”. Else, print “NOT POSITIVE”.</p>',
          starter: 'Step 1:  \nStep 2:  ',
          checks: [
            { re: /input\s+N\b/i, label: 'Reads N with <b>Input</b>', review: 22 },
            { re: /if\s*\(?\s*N\s*>\s*0\s*\)?\s*then/i, label: 'Asks the question with <code>if (N &gt; 0) then</code>', review: 22 },
            { re: /print\s*[“"]POSITIVE[”"]/i, label: 'Prints “POSITIVE” in the then part', review: 8 },
            { re: /else[\s\S]*print\s*[“"]NOT POSITIVE[”"]/i, label: 'Prints “NOT POSITIVE” after <b>else</b>', review: 22 },
            { re: /endif/i, label: 'Ends the if with <b>endif</b>', review: 8 },
            { re: /input[\s\S]*if[\s\S]*else[\s\S]*endif/i, label: 'The order is right: input, if ... then, else, endif', review: 22 }
          ],
          solution: 'Step 1:  Input N\nStep 2:  if (N > 0) then\n             Print “POSITIVE”\n         else\n             Print “NOT POSITIVE”\n         endif'
        },
        {
          type: 'flow', title: 'Build the flowchart: average of three numbers', review: 20,
          task: '<p>Build the flowchart for this problem:</p><p class="tip">Read three numbers <b>A</b>, <b>B</b> and <b>C</b>. Calculate their sum <b>S</b>, then their average <b>AVG</b>. Print AVG.</p><p>The cards below are mixed up. Put them in the right order with ▲ and ▼, and choose the right symbol for each card. Your flowchart is drawn as you work.</p>',
          cards: [
            { text: 'START', shape: 'oval' },
            { text: 'Input A, B, C', shape: 'para' },
            { text: 'S ← A + B + C', shape: 'rect' },
            { text: 'AVG ← S / 3', shape: 'rect' },
            { text: 'Print AVG', shape: 'display' },
            { text: 'STOP', shape: 'oval' }
          ]
        }
      ]
    }
  });
})();
