/* Data Structures · Unit 8 Recursion (31 slides): base case and infinite recursion, f(x) = f(x+2) − 3, the sum of
   1..n, factorial, Fibonacci and its call tree, analysis of recursive methods, and the Towers of Hanoi */
(function () {
  function L(src, frag, nth) { var ls = src.split('\n'), c = 0; for (var i = 0; i < ls.length; i++) if (ls[i].indexOf(frag) >= 0 && ++c === (nth || 1)) return i + 1; throw new Error('no line ' + frag); }
  var SOE = 'Exception in thread "main" java.lang.StackOverflowError';
  /* the call stack, main at the bottom. frames: [{id, t, note, tone}]; long stacks show main, "…" and the top 7 */
  function stack(frames, o) {
    o = o || {};
    var out = [], x = o.x || 20, w = o.w || 200, hh = 26, y0 = o.y0 || 318, show = frames;
    if (frames.length > 9) show = [frames[0], { id: 'fmore', t: '… ' + (frames.length - 8) + ' more calls …', tone: 'muted', dots: true }].concat(frames.slice(-7));
    show.forEach(function (f, i) {
      var y = y0 - (i + 1) * (hh + 3), top = i === show.length - 1 && !o.done;
      out.push(B(f.id, x, y, w, hh, { title: f.t, mono: true, size: 12, align: 'left', tone: f.tone || (top ? 'accent' : i === 0 ? 'muted' : 'blue'), fill: top ? 'solid' : 'soft', hi: top, dash: f.dots }));
      if (f.note) out.push(T(f.id + 'n', x + w + 10, y + 18, f.note, { mono: true, size: 12, tone: f.ntone || 'muted', bold: !!f.ntone }));
    });
    out.push(T('stl', x, y0 + 16, o.label || 'call stack: the top box is running', { size: 11, tone: 'muted' }));
    return out;
  }

  /* ---------- 1. base case and infinite recursion (slides 2-4) ---------- */
  function irun(v) {
    var n = Math.trunc(v.n), b = Math.trunc(v.base) === 1;
    return '// SimpleRecursion idea: count from n down to zero\nstatic void countDown(int n) {\n  if (n == 0) {                    // base case: stop\n    System.out.println("Done");\n    return;\n  }\n  System.out.println(n);\n  countDown(n - 1);                // recursive call: a smaller problem\n}\n// SimpleInfiniteRecursion idea: no base case\nstatic void forever(int n) {\n  System.out.println(n);\n  forever(n - 1);                  // calls itself again and again\n}\n// in main:\n' + (b ? 'countDown(' + n + ');' : 'forever(' + n + ');');
  }
  var infinite = {
    id: 'infinite', slides: [2, 4], title: 'A base case stops the calls',
    code: irun,
    inputs: [{ id: 'n', label: 'n', value: 3, min: 1, max: 6 }, { id: 'base', label: 'base case (1 yes, 0 no)', value: 1, min: 0, max: 1 }],
    presets: [{ label: 'countDown(3)', values: { n: 3, base: 1 } }, { label: 'countDown(1)', values: { n: 1, base: 1 } }, { label: 'no base case', values: { n: 3, base: 0 } }],
    steps: function (v) {
      var code = irun(v), n = Math.trunc(v.n), b = Math.trunc(v.base) === 1, st = [], fr = [{ id: 'fm', t: 'main' }], last = code.split('\n').length;
      var snap = function (o) { o.fr = fr.map(function (f) { return { id: f.id, t: f.t, note: f.note }; }); st.push(o); return o; };
      snap({ slide: 2, line: last, cap: '<b>Recursion</b>: a method that calls <b>itself</b> to do its job. Each call works on a smaller part of the problem.' });
      if (b) {
        for (var k = n; k >= 0; k--) {
          fr.push({ id: 'f' + k, t: 'countDown(' + k + ')' });
          if (k > 0) {
            snap({ slide: 4, line: (k === n ? last + ',' : '') + L(code, 'if (n == 0)') + ',' + L(code, 'System.out.println(n);'), out: String(k), cap: 'countDown(' + k + '): n is not 0, so print ' + k + ' and call countDown(' + (k - 1) + '). A <b>new</b> box goes on the stack, with its own n.' });
            fr[fr.length - 1].note = 'waits';
          } else snap({ slide: 3, line: L(code, 'if (n == 0)') + '-' + L(code, 'return;'), out: 'Done', cap: 'countDown(0): n == 0 is the <b>base case</b>. It prints Done and returns without calling again.' });
        }
        while (fr.length > 1) { var f = fr.pop(); if (fr.length > 1) { fr[fr.length - 1].note = ''; snap({ slide: 4, line: L(code, 'countDown(n - 1);') + ',' + L(code, 'return;', 1), cap: f.t + ' is finished and leaves the stack. Control goes back to the caller, ' + fr[fr.length - 1].t + ', which has nothing left to do.' }); } }
        snap({ slide: 4, line: last, cap: 'Back in main. ' + (n + 1) + ' calls were made, and the base case stopped them.' });
      } else {
        for (k = n; k > n - 6; k--) { fr.push({ id: 'f' + k, t: 'forever(' + k + ')' }); snap({ slide: 3, line: L(code, 'System.out.println(n);', 2) + '-' + L(code, 'forever(n - 1);'), out: String(k), cap: 'forever(' + k + ') prints ' + k + ' and calls forever(' + (k - 1) + '). There is no base case, so nothing ever says “stop”.' }); }
        for (k = 0; k < 6; k++) fr.push({ id: 'fx' + k, t: 'forever(' + (n - 6 - k) + ')' });
        snap({ slide: 3, line: L(code, 'forever(n - 1);'), err: true, out: SOE, cap: '<b>Infinite recursion</b>: every call adds a box to the call stack. The stack memory runs out and Java throws a <b>StackOverflowError</b>. It is like an infinite loop, but it crashes.' });
      }
      return st;
    },
    draw: function (k, s) {
      var items = stack(s.fr, { x: 40, w: 180 });
      if (s.err) items.push(T('er', 400, 120, 'StackOverflowError', { anchor: 'middle', mono: true, size: 16, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* ---------- 2. f(x) = 3x + 5 if x > 10, else f(x + 2) − 3 (slides 5-10) ---------- */
  function frun(v) { var x = Math.trunc(v.x); return 'package myjava;\nimport java.util.*;\npublic class MyJava {\n  public static int fun( int x )\n  {\n    if( x > 10 )\n      return  (3*x+5);         //base step\n    else\n      return fun( x +2 ) -3;   //recursive step\n  }\n  public static void main (String args[]) {\n    System.out.print("the result of fun(' + x + ') =  “ + fun( ' + x + ' ) );\n  }\n}'; }
  var fun = {
    id: 'fun', slides: [5, 10], title: 'Calls go down, answers come back up',
    code: frun,
    inputs: [{ id: 'x', label: 'x', value: 5, min: -3, max: 14 }],
    presets: [{ label: 'f(5) (slides 7-8)', values: { x: 5 } }, { label: 'f(10): one step from the base', values: { x: 10 } }, { label: 'f(12): base at once', values: { x: 12 } }, { label: 'f(-2)', values: { x: -2 } }],
    steps: function (v) {
      var code = frun(v), x0 = Math.trunc(v.x), st = [], fr = [{ id: 'fm', t: 'main' }], xs = [], x;
      var bl = L(code, 'if( x > 10 )'), rl = L(code, 'return fun( x +2 ) -3;'), ml = L(code, 'System.out.print(');
      var snap = function (o) { o.fr = fr.map(function (f) { return { id: f.id, t: f.t, note: f.note, ntone: f.ntone }; }); st.push(o); return o; };
      snap({ slide: 5, line: ml, ph: 'fact', cap: 'Math often defines things <b>recursively</b>: 1! = 1 and N! = N × (N−1)!. A factorial is defined by a smaller factorial, until the base case 1! is reached.' });
      snap({ slide: 6, line: (bl) + '-' + rl, ph: 'def', cap: 'A function with two rules: if x &gt; 10, f(x) = 3x + 5 (no f on the right side: the <b>base</b>). Otherwise f(x) = f(x + 2) − 3 (it uses f again: the <b>recursive</b> rule).' });
      for (x = x0; x <= 10; x += 2) { xs.push(x); fr.push({ id: 'f' + x, t: 'fun(' + x + ')' }); snap({ slide: 7, line: (x === x0 ? ml + ',' : '') + bl + ',' + rl, cap: 'fun(' + x + '): ' + x + ' is not &gt; 10, so it needs fun(' + (x + 2) + ') first. fun(' + x + ') <b>waits</b>: its answer is “fun(' + (x + 2) + ') − 3”, still unknown.' }); fr[fr.length - 1].note = '= fun(' + (x + 2) + ') − 3'; }
      var val = 3 * x + 5;
      fr.push({ id: 'f' + x, t: 'fun(' + x + ')' });
      snap({ slide: 7, line: (xs.length ? '' : ml + ',') + bl + '-' + (bl + 1), cap: 'fun(' + x + '): ' + x + ' &gt; 10, the <b>base step</b>: 3·' + x + ' + 5 = <b>' + val + '</b>. No more calls.' + (xs.length ? ' But fun(' + x0 + ') is not known yet!' : '') });
      fr[fr.length - 1].note = '= ' + val; fr[fr.length - 1].ntone = 'teal';
      snap({ slide: 8, line: bl + 1, done: true, cap: 'fun(' + x + ') returns ' + val + ' to the call that is waiting below it.' });
      fr.pop();
      while (xs.length) {
        var y = xs.pop(); val -= 3; fr[fr.length - 1].note = '= ' + (val + 3) + ' − 3 = ' + val; fr[fr.length - 1].ntone = 'teal';
        snap({ slide: 8, line: rl, cap: 'Working <b>backwards</b>: fun(' + y + ') = fun(' + (y + 2) + ') − 3 = ' + (val + 3) + ' − 3 = <b>' + val + '</b>, and it returns.' });
        fr.pop();
      }
      snap({ slide: 9, line: ml, ph: 'series', xs: (function () { var a = []; for (var q = x0; q <= x; q += 2) a.push(q); return a; })(), val: val, cap: 'The series of calls: ' + (function () { var a = []; for (var q = x0; q <= x; q += 2) a.push('f(' + q + ')'); return a.join(' → '); })() + '. Calls go down to the base case; the values come back up in the opposite order.' });
      snap({ slide: 10, line: ml, out: 'the result of fun(' + x0 + ') =  ' + val, cap: 'main prints the result: <b>' + val + '</b>. (On the slide the string ends with a curly quote “ instead of ", so as written it does not compile.)' });
      return st;
    },
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'fact') {
        ['4! = 4 × 3!', '3! = 3 × 2!', '2! = 2 × 1!', '1! = 1'].forEach(function (t, i) { items.push(B('fa' + i, 60 + i * 40, 40 + i * 64, 220, 44, { title: t, mono: true, size: 16, tone: i === 3 ? 'teal' : 'blue', fill: i === 3 ? 'solid' : 'soft' })); });
        items.push(T('fb', 400, 250, 'base case', { size: 14, bold: true, tone: 'teal' }));
        return items;
      }
      if (s.ph === 'def') {
        items.push(B('d1', 60, 70, 440, 50, { title: 'f(x) = 3x + 5        if x > 10', mono: true, size: 16, tone: 'teal', fill: 'solid', tag: 'base step' }));
        items.push(B('d2', 60, 180, 440, 50, { title: 'f(x) = f(x + 2) − 3   otherwise', mono: true, size: 16, tone: 'accent', tag: 'recursive step' }));
        return items;
      }
      if (s.ph === 'series') {
        s.xs.forEach(function (q, i) { items.push(B('se' + i, 40 + i * Math.min(110, 480 / s.xs.length), 60, Math.min(96, 480 / s.xs.length - 10), 40, { title: 'f(' + q + ')', mono: true, size: 13, tone: i === s.xs.length - 1 ? 'teal' : 'blue' })); });
        items.push(T('sa', 40, 150, 'calls →', { size: 13, bold: true, tone: 'accent' }));
        items.push(T('sb', 40, 180, '← values come back', { size: 13, bold: true, tone: 'teal' }));
        items.push(T('sc', 40, 230, 'f(' + s.xs[0] + ') = ' + s.val, { mono: true, size: 20, bold: true, tone: 'accent' }));
        return items;
      }
      return stack(s.fr, { x: 30, w: 150, done: s.done });
    }
  };

  /* ---------- 3. the sum of 1 to n (slides 11-16) ---------- */
  function srun(v) { return 'package myjava;\nimport java.util.*;\npublic class MyJava {\n  public static int sum( int n )\n  {\n    if(n == 0)          //base step\n      return (0);\n    else                //recursive step\n      return(sum (n-1) +n);\n  }\n  public static void main (String args[]) {\n    Scanner scan=new Scanner(System.in);\n    System.out.println("enter any number :" );\n    int x = scan.nextInt();             // the user types ' + Math.trunc(v.n) + '\n    System.out.println("the summation from 1 to " +x+ " = "+ sum( x ));\n  }\n}'; }
  var sum = {
    id: 'sum', slides: [11, 16], title: 'sum(n) = sum(n − 1) + n',
    code: srun,
    inputs: [{ id: 'n', label: 'the number typed', value: 4, min: -2, max: 8 }],
    presets: [{ label: 'sum(4)', values: { n: 4 } }, { label: 'sum(0): base case', values: { n: 0 } }, { label: 'sum(8)', values: { n: 8 } }, { label: 'a negative number', values: { n: -1 } }],
    steps: function (v) {
      var code = srun(v), n = Math.trunc(v.n), st = [], fr = [{ id: 'fm', t: 'main (x = ' + n + ')' }];
      var bl = L(code, 'if(n == 0)'), rl = L(code, 'return(sum (n-1) +n);'), ml = L(code, 'System.out.println("the summation');
      var snap = function (o) { o.fr = fr.map(function (f) { return { id: f.id, t: f.t, note: f.note, ntone: f.ntone }; }); st.push(o); return o; };
      snap({ slide: 11, line: L(code, 'System.out.println("enter') + '-' + L(code, 'int x = scan.nextInt();'), out: 'enter any number :\n' + n, cap: 'A recursive method must handle the <b>base case</b> and the <b>recursive case</b>. Each call gets a <b>new</b> set of parameters and local variables.' });
      snap({ slide: 12, line: rl, ph: 'idea', n: n, cap: 'The sum of 1 to N is <b>N plus the sum of 1 to N − 1</b>. So sum(n) = sum(n − 1) + n, and sum(0) = 0 (slide 13).' });
      if (n < 0) {
        for (var k = n; k > n - 5; k--) { fr.push({ id: 's' + k, t: 'sum(' + k + ')', note: '= sum(' + (k - 1) + ') + ' + k }); snap({ slide: 14, line: bl + ',' + rl, cap: 'sum(' + k + '): ' + k + ' is not 0, so call sum(' + (k - 1) + '). n goes <b>down</b>, away from 0: the base case is never reached.' }); }
        for (k = 0; k < 8; k++) fr.push({ id: 'sx' + k, t: 'sum(' + (n - 5 - k) + ')' });
        snap({ slide: 14, line: rl, err: true, out: SOE, cap: '<b>StackOverflowError</b>: n == 0 only catches 0 itself. A safer base case would be <code>n &lt;= 0</code>.' });
        return st;
      }
      for (k = n; k >= 0; k--) {
        fr.push({ id: 's' + k, t: 'sum(' + k + ')' });
        if (k) { snap({ slide: 14, line: (k === n ? ml + ',' : '') + bl + ',' + rl, cap: 'sum(' + k + ') = sum(' + (k - 1) + ') + ' + k + ': it must wait for sum(' + (k - 1) + '). A new call goes on top of the stack.' }); fr[fr.length - 1].note = '= sum(' + (k - 1) + ') + ' + k; }
        else { fr[fr.length - 1].note = '= 0'; fr[fr.length - 1].ntone = 'teal'; snap({ slide: 14, line: (n === 0 ? ml + ',' : '') + bl + '-' + (bl + 1), cap: 'sum(0): the <b>base step</b> returns 0. ' + (n + 1) + ' calls are on the stack now.' }); }
      }
      var val = 0; fr.pop();
      for (k = 1; k <= n; k++) { val += k; fr[fr.length - 1].note = '= ' + (val - k) + ' + ' + k + ' = ' + val; fr[fr.length - 1].ntone = 'teal'; snap({ slide: 14, line: rl, cap: 'sum(' + k + ') gets ' + (val - k) + ' back, adds ' + k + ', and returns <b>' + val + '</b>.' }); fr.pop(); }
      snap({ slide: 14, line: ml, out: 'the summation from 1 to ' + n + ' = ' + val, cap: 'main prints ' + val + '.' });
      snap({ slide: 15, line: rl, ph: 'loop', n: n, val: val, cap: 'Recursion is not always the best choice. A loop is easier here, and there is even a formula: n(n + 1)/2 = ' + val + '.' });
      snap({ slide: 16, line: rl, ph: 'loop', n: n, val: val, more: true, cap: 'Every recursive solution has an iterative one. The recursive sum made <b>' + (n + 1) + '</b> method calls (each one costs time and stack memory); the loop makes none. But for some problems, recursion is simpler and more elegant.' });
      return st;
    },
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'idea') {
        var n = Math.max(s.n, 1);
        items.push(T('i1', 40, 60, 'sum(' + n + ') = 1 + 2 + … + ' + (n - 1) + ' + ' + n, { mono: true, size: 15 }));
        items.push(B('i2', 120, 80, 240, 34, { title: 'sum(' + (n - 1) + ')', mono: true, size: 14, tone: 'accent', tag: 'the same problem, smaller' }));
        items.push(T('i3', 380, 102, '+ ' + n, { mono: true, size: 16, bold: true, tone: 'accent' }));
        items.push(B('i4', 40, 190, 200, 40, { title: 'sum(n) = sum(n−1) + n', mono: true, size: 13, tone: 'blue', tag: 'recursive step' }));
        items.push(B('i5', 300, 190, 160, 40, { title: 'sum(0) = 0', mono: true, size: 13, tone: 'teal', fill: 'solid', tag: 'base step' }));
        return items;
      }
      if (s.ph === 'loop') {
        items.push(B('l1', 30, 40, 240, 120, { title: 'recursion', mono: true, lines: ['calls: ' + (s.n + 1), 'stack boxes: ' + (s.n + 2), 'result: ' + s.val], tone: 'accent' }));
        items.push(B('l2', 300, 40, 240, 120, { title: 'a loop', mono: true, lines: ['for (i = 1; i <= n; i++)', '  total += i;', 'result: ' + s.val], tone: 'teal' }));
        if (s.more) items.push(T('l3', 280, 230, 'n(n + 1) / 2 = ' + s.val + '   (no loop at all)', { anchor: 'middle', mono: true, size: 15, bold: true, tone: 'blue' }));
        return items;
      }
      items = stack(s.fr, { x: 30, w: 170 });
      if (s.err) items.push(T('er', 420, 60, 'StackOverflowError', { anchor: 'middle', mono: true, size: 16, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* ---------- 4. factorial (slides 17-18) ---------- */
  function frun2(v) { return 'package myjava;\nimport java.util.*;\npublic class MyJava {\n  public static int facto( int n )\n  {\n    if(n == 1)          //base step\n      return (1);\n    else                //recursive step\n      return(facto (n-1)*n);\n  }\n  public static void main (String args[]) {\n    Scanner scan=new Scanner(System.in);\n    System.out.println("enter any number :" );\n    int x = scan.nextInt();             // the user types ' + Math.trunc(v.n) + '\n    System.out.println("the summation from 1 to " +x+ " = "+ facto( x ));\n  }\n}'; }
  var fact = {
    id: 'fact', slides: [17, 18], title: 'facto(n) = facto(n − 1) × n',
    code: frun2,
    inputs: [{ id: 'n', label: 'the number typed', value: 4, min: 0, max: 13 }],
    presets: [{ label: 'facto(4)', values: { n: 4 } }, { label: 'facto(1): base case', values: { n: 1 } }, { label: 'facto(13): int overflow', values: { n: 13 } }, { label: 'facto(0): no base case reached', values: { n: 0 } }],
    steps: function (v) {
      var code = frun2(v), n = Math.trunc(v.n), st = [], fr = [{ id: 'fm', t: 'main (x = ' + n + ')' }];
      var bl = L(code, 'if(n == 1)'), rl = L(code, 'return(facto (n-1)*n);'), ml = L(code, 'System.out.println("the summation');
      var snap = function (o) { o.fr = fr.map(function (f) { return { id: f.id, t: f.t, note: f.note, ntone: f.ntone }; }); st.push(o); return o; };
      snap({ slide: 17, line: rl, ph: 'def', n: Math.max(n, 2), cap: 'n! = n × (n − 1)!, and 1! = 1 is the base step. So 4! = 4 × 3!, 3! = 3 × 2!, …' });
      if (n < 1) {
        for (var k = n; k > n - 4; k--) { fr.push({ id: 'c' + k, t: 'facto(' + k + ')', note: '= facto(' + (k - 1) + ') * ' + k }); snap({ slide: 18, line: (k === n ? ml + ',' : '') + bl + ',' + rl, cap: 'facto(' + k + '): ' + k + ' is not 1, so call facto(' + (k - 1) + '). n moves away from 1: the base case is never reached.' }); }
        for (k = 0; k < 8; k++) fr.push({ id: 'cx' + k, t: 'facto(' + (n - 4 - k) + ')' });
        snap({ slide: 18, line: rl, err: true, out: SOE, cap: '<b>StackOverflowError</b>. (Math says 0! = 1, but this code has no rule for 0.)' });
        return st;
      }
      for (k = n; k >= 1; k--) {
        fr.push({ id: 'c' + k, t: 'facto(' + k + ')' });
        if (k > 1) { snap({ slide: 18, line: (k === n ? ml + ',' : '') + bl + ',' + rl, cap: 'facto(' + k + ') needs facto(' + (k - 1) + ') first. The multiplication by ' + k + ' waits until it comes back.' }); fr[fr.length - 1].note = '= facto(' + (k - 1) + ') * ' + k; }
        else { fr[fr.length - 1].note = '= 1'; fr[fr.length - 1].ntone = 'teal'; snap({ slide: 18, line: (n === 1 ? ml + ',' : '') + bl + '-' + (bl + 1), cap: 'facto(1): the base step returns 1.' }); }
      }
      var val = 1, real = 1, over = false; fr.pop();
      for (k = 2; k <= n; k++) {
        var prev = val; val = (val * k) | 0; real *= k; var bad = val !== real && !over; if (val !== real) over = true;
        fr[fr.length - 1].note = '= ' + prev + ' * ' + k + ' = ' + val; fr[fr.length - 1].ntone = bad || over ? 'red' : 'teal';
        snap({ slide: 18, line: rl, cap: 'facto(' + k + ') = ' + prev + ' × ' + k + ' = <b>' + val + '</b>' + (bad ? '. <b>Wrong!</b> The true value ' + real + ' is bigger than the largest int (2,147,483,647), so it <b>overflows</b>.' : over ? ' (still wrong after the overflow).' : '.') });
        fr.pop();
      }
      snap({ slide: 18, line: ml, out: 'the summation from 1 to ' + n + ' = ' + val, cap: 'main prints ' + val + (over ? ' instead of ' + real + ': a long would be needed' : '') + '. The message says “summation” because it was copied from the sum program; it should say factorial.' });
      return st;
    },
    draw: function (k, s) {
      if (s.ph === 'def') {
        var items = [], n = Math.min(s.n, 5);
        for (var i = n; i >= 1; i--) items.push(B('d' + i, 40 + (n - i) * 36, 30 + (n - i) * 54, 230, 40, { title: i === 1 ? '1! = 1' : i + '! = ' + i + ' × ' + (i - 1) + '!', mono: true, size: 15, tone: i === 1 ? 'teal' : 'blue', fill: i === 1 ? 'solid' : 'soft' }));
        return items;
      }
      var it = stack(s.fr, { x: 30, w: 170 });
      if (s.err) it.push(T('er', 420, 60, 'StackOverflowError', { anchor: 'middle', mono: true, size: 16, bold: true, tone: 'red' }));
      return it;
    }
  };

  /* ---------- 5. Fibonacci and its call tree (slides 19-23) ---------- */
  function brun(v) { return 'package myjava;\nimport java.util.*;\npublic class MyJava {\n  public static int Fib(int n){\n    if(n<=1)\n      return n;\n    else\n      return (Fib(n-1)+Fib(n-2));\n  }\n  public static void main (String args[]) {\n    int x =' + Math.trunc(v.n) + ';\n    System.out.println("the Fib of " +x + " equal to "+ Fib( x ) );\n  }\n}'; }
  var fib = {
    id: 'fib', slides: [19, 23], title: 'The Fibonacci call tree', vb: [560, 360],
    code: brun,
    inputs: [{ id: 'n', label: 'x', value: 4, min: 0, max: 6 }],
    presets: [{ label: 'Fib(4)', values: { n: 4 } }, { label: 'Fib(1): base case', values: { n: 1 } }, { label: 'Fib(6)', values: { n: 6 } }],
    steps: function (v) {
      var code = brun(v), n = Math.trunc(v.n), st = [], nodes = [], calls = 0, leaves = 0, done = {}, path = [];
      var bl = L(code, 'if(n<=1)'), rl = L(code, 'return (Fib(n-1)+Fib(n-2));'), ml = L(code, 'System.out.println(');
      /* layout: leaves get x slots from left to right */
      var build = function (k, d) { var nd = { k: k, d: d, id: 'b' + nodes.length }; nodes.push(nd); if (k > 1) { nd.l = build(k - 1, d + 1); nd.r = build(k - 2, d + 1); nd.x = (nd.l.x + nd.r.x) / 2; } else nd.x = leaves++; return nd; };
      var root = build(n, 0), depth = Math.max.apply(null, nodes.map(function (q) { return q.d; }));
      var snap = function (o) { o.vis = Object.keys(done).length; o.done = JSON.parse(JSON.stringify(done)); o.path = path.slice(); o.calls = calls; o.lv = leaves; o.dp = depth; o.nodes = nodes; st.push(o); return o; };
      snap({ slide: 19, line: bl + '-' + rl, ph: 'seq', cap: 'Fibonacci numbers: 0, 1, 1, 2, 3, 5, 8, 13, … Each one is the sum of the two before it: Fib(n) = Fib(n−1) + Fib(n−2), with <b>two</b> base steps, Fib(0) = 0 and Fib(1) = 1.' });
      var run = function (nd) {
        calls++; path.push(nd.id); done[nd.id] = { v: null };
        if (nd.k <= 1) { done[nd.id].v = nd.k; snap({ slide: 20, line: (nd === root ? ml + ',' : '') + bl + '-' + (bl + 1), cap: 'Fib(' + nd.k + '): base step, returns ' + nd.k + '.' }); path.pop(); return nd.k; }
        snap({ slide: 20, line: (nd === root ? ml + ',' : '') + bl + ',' + rl, cap: 'Fib(' + nd.k + ') calls Fib(' + (nd.k - 1) + ') first; Fib(' + (nd.k - 2) + ') must wait until it is finished.' });
        var a = run(nd.l), b = run(nd.r);
        done[nd.id].v = a + b;
        snap({ slide: 20, line: rl, cap: 'Fib(' + nd.k + ') = ' + a + ' + ' + b + ' = <b>' + (a + b) + '</b>, returned to its caller.' });
        path.pop(); return a + b;
      };
      var val = run(root);
      snap({ slide: 20, line: ml, out: 'the Fib of ' + n + ' equal to ' + val, cap: 'Fib(' + n + ') = ' + val + ', but it took <b>' + calls + '</b> calls.' });
      var rep = {}; nodes.forEach(function (q) { rep[q.k] = (rep[q.k] || 0) + 1; });
      var worst = n >= 2 ? Object.keys(rep).filter(function (k) { return rep[k] > 1; }).map(Number).sort(function (a, b) { return a - b; }) : [];
      snap({ slide: 21, line: rl, rep: true, cap: 'Analysis: (work in one call) × (number of calls). sum(n) makes n calls of O(1): O(n). Fib makes two calls each time, so the number of calls grows <b>exponentially</b>.' });
      snap({ slide: 22, line: rl, rep: true, cap: 'The same happens in the Towers of Hanoi: each call makes two more, so it needs 2ⁿ − 1 moves: <b>O(2ⁿ)</b>.' });
      snap({ slide: 23, line: rl, rep: true, memo: worst, cap: worst.length ? 'The orange calls are <b>repeated work</b>: ' + worst.filter(function (k) { return k >= 2; }).map(function (k) { return 'Fib(' + k + ') is computed ' + rep[k] + ' times'; }).join(', ') + '. <b>Memoization</b> saves each answer the first time, so each Fib(k) is computed only once.' : 'With x = ' + n + ' there is no repeated work. Try a bigger x: the same calls appear many times, and memoization saves them.' });
      return st;
    },
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'seq') {
        [0, 1, 1, 2, 3, 5, 8, 13, 21, 34].forEach(function (q, i) { items.push(B('q' + i, 20 + i * 53, 120, 46, 40, { title: String(q), mono: true, size: 15, tone: i < 2 ? 'teal' : 'blue', fill: i < 2 ? 'solid' : 'soft' })); items.push(T('qi' + i, 43 + i * 53, 180, 'Fib(' + i + ')', { anchor: 'middle', mono: true, size: 10, tone: 'muted' })); if (i > 1) items.push(A('qa' + i, 43 + (i - 1) * 53, 116, 43 + i * 53, 116, { bend: -14, tone: 'muted', head: false })); });
        items.push(T('qt', 280, 240, 'each number = the two before it added', { anchor: 'middle', size: 13, tone: 'muted' }));
        return items;
      }
      var lv = Math.max(s.lv, 1), cw = Math.min(110, 540 / lv), lh = Math.min(56, 270 / Math.max(s.dp, 1)), bw = Math.min(64, cw - 6), small = bw < 50;
      var cnt = {}; s.nodes.forEach(function (q) { cnt[q.k] = (cnt[q.k] || 0) + 1; });
      var pos = function (q) { return [280 - lv * cw / 2 + q.x * cw + cw / 2, 40 + q.d * lh]; };
      s.nodes.forEach(function (q) {
        var d = s.done[q.id]; if (!d) return;
        var p = pos(q), on = s.path.indexOf(q.id) >= 0, top = s.path[s.path.length - 1] === q.id && !s.rep;
        var memo = s.memo && s.memo.indexOf(q.k) >= 0 && q.k >= 2;
        items.push(B(q.id, p[0] - bw / 2, p[1], bw, 26, { title: (small ? 'F(' : 'Fib(') + q.k + ')', mono: true, size: small ? 10 : 12, tone: memo ? 'accent' : top ? 'accent' : on ? 'accent' : d.v != null ? 'teal' : 'blue', fill: top || memo ? 'solid' : 'soft', hi: top }));
        if (d.v != null) items.push(T(q.id + 'v', p[0], p[1] + 38, '= ' + d.v, { anchor: 'middle', mono: true, size: 11, bold: true, tone: 'teal' }));
        [q.l, q.r].forEach(function (c, j) { if (c && s.done[c.id]) { var pc = pos(c); items.push(A(q.id + 'e' + j, p[0] + (j ? 1 : -1) * bw * 0.36, p[1] + 26, pc[0], pc[1], { tone: 'muted', head: false })); } });
      });
      items.push(T('cl', 548, 30, 'calls: ' + s.calls, { anchor: 'end', mono: true, size: 14, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 6. Towers of Hanoi (slides 24-30) ---------- */
  function hrun(v) { return 'package myjava;\nimport java.util.*;\npublic class MyJava {\n  public static void move(int n, char start, char finish, char buf){\n    if(n==1)            // stop condition: move one disk\n      System.out.println("Move from " +start + " to "+ finish );\n    else{\n      move(n-1,start,buf,finish);   // move n-1 from start to buf using\n                                    //finish as temporary storage\n      System.out.println("Move from " +start + " to "+ finish );\n      move(n-1,buf,finish,start);   // move n-1 from buf to finish using\n                                    //start as temporary storage\n    }};\n  public static void main (String args[]) {\n    move(' + Math.trunc(v.n) + ', \'A\', \'C\', \'B\');\n  }\n}'; }
  var hanoi = {
    id: 'hanoi', slides: [24, 30], title: 'Towers of Hanoi: move n − 1, move 1, move n − 1', vb: [560, 380],
    code: hrun,
    inputs: [{ id: 'n', label: 'disks', value: 3, min: 1, max: 5 }],
    presets: [{ label: '3 disks (slide 30)', values: { n: 3 } }, { label: '2 disks (slide 25)', values: { n: 2 } }, { label: '4 disks (slides 27-29)', values: { n: 4 } }, { label: '1 disk', values: { n: 1 } }],
    steps: function (v) {
      var code = hrun(v), n = Math.trunc(v.n), st = [], peg = { A: [], B: [], C: [] }, fr = [], moves = 0, i;
      for (i = n; i >= 1; i--) peg.A.push(i);
      var bl = L(code, 'if(n==1)'), c1 = L(code, 'move(n-1,start,buf,finish);'), pm = L(code, 'System.out.println("Move from', 2), c2 = L(code, 'move(n-1,buf,finish,start);'), ml = L(code, 'move(' + n + ', \'A\'');
      var snap = function (o) { o.peg = { A: peg.A.slice(), B: peg.B.slice(), C: peg.C.slice() }; o.fr = fr.slice(); o.moves = moves; st.push(o); return o; };
      snap({ slide: 24, line: ml, cap: 'Goal: move all ' + n + ' disk' + (n > 1 ? 's' : '') + ' from A to C. Rules: move <b>one</b> disk at a time, and never put a bigger disk on a smaller one. B is a helper peg.' });
      snap({ slide: 26, line: bl + ',' + c1 + ',' + pm + ',' + c2, plan: true, cap: 'The recursive idea for n disks: ① move n − 1 disks from A to B (using C), ② move disk n from A to C, ③ move n − 1 disks from B to C (using A). Steps ① and ③ are the same problem, one disk smaller.' });
      var rec = function (k, s, f, b) {
        fr.push('move(' + k + ', ' + s + ', ' + f + ', ' + b + ')');
        if (k > 1) rec(k - 1, s, b, f);
        var d = peg[s].pop(); peg[f].push(d); moves++;
        snap({ slide: n === 4 ? (moves <= 5 ? 27 : moves <= 10 ? 28 : 29) : n === 2 ? 25 : 30, line: k === 1 ? bl + '-' + (bl + 1) : (c1 + ',' + pm), disk: d, from: s, to: f, out: 'Move from ' + s + ' to ' + f, cap: 'Move ' + moves + ': disk ' + d + ' from ' + s + ' to ' + f + (k === 1 ? ' (n == 1: the stop condition).' : ' (the big step ② of move(' + k + ', ' + s + ', ' + f + ', ' + b + '): its n − 1 disks are already on ' + b + ').') });
        if (k > 1) rec(k - 1, b, f, s);
        fr.pop();
      };
      rec(n, 'A', 'C', 'B');
      snap({ slide: 30, line: ml, cap: 'Done: ' + moves + ' moves = 2<sup>' + n + '</sup> − 1. One more disk doubles the work (plus one): O(2ⁿ).' });
      return st;
    },
    draw: function (k, s, v) {
      var items = [], n = Math.trunc(v.n), px = { A: 100, B: 280, C: 460 }, base = 210;
      Object.keys(px).forEach(function (p) {
        items.push(B('peg' + p, px[p] - 4, 60, 8, base - 60, { tone: 'muted', fill: 'solid', r: 2 }));
        items.push(T('pl' + p, px[p], base + 24, p, { anchor: 'middle', size: 16, bold: true, tone: 'muted' }));
        s.peg[p].forEach(function (d, i) { var w = 30 + d * 22, hot = d === s.disk; items.push(B('disk' + d, px[p] - w / 2, base - (i + 1) * 22, w, 20, { title: String(d), mono: true, size: 11, tone: hot ? 'accent' : 'blue', fill: 'solid', hi: hot, r: 6, z: 2 })); });
      });
      items.push(B('base', 20, base, 520, 6, { tone: 'muted', fill: 'solid', r: 2 }));
      if (s.from) items.push(A('mv', px[s.from], 50, px[s.to], 50, { tone: 'accent', bend: -20 }));
      if (s.plan) {
        items.push(T('p1', 190, 44, '① n−1 disks A → B', { anchor: 'middle', size: 12, bold: true, tone: 'accent' }));
        items.push(T('p2', 280, 30, '② disk n A → C', { anchor: 'middle', size: 12, bold: true, tone: 'teal' }));
        items.push(T('p3', 370, 44, '③ n−1 disks B → C', { anchor: 'middle', size: 12, bold: true, tone: 'accent' }));
      }
      var lines = s.fr.slice().reverse();
      if (lines.length) items.push(B('stk', 20, 250, 260, 30 + lines.length * 18 + 10, { title: 'call stack (top first)', mono: true, size: 12, lines: lines, tone: 'blue' }));
      items.push(T('mc', 540, 270, 'moves: ' + s.moves + ' / ' + (Math.pow(2, n) - 1), { anchor: 'end', mono: true, size: 15, bold: true, tone: 'accent' }));
      return items;
    }
  };

  var code = function (t) { return { type: 'code', lang: 'java', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; }, pre = function (t) { return { type: 'code', lang: 'text', text: t }; };

  addUnit({
    course: 'ds', lesson: '08-recursion',
    blurb: 'Methods that call themselves: the base case, f(x), the sum of 1 to n, factorial, Fibonacci, the cost of recursion and the Towers of Hanoi.',
    parts: [
      { title: 'Recursion and the base case', from: 1, to: 4 },
      { title: 'Recursion in math', from: 5, to: 10 },
      { title: 'Recursive programming', from: 11, to: 16 },
      { title: 'Factorial, Fibonacci and analysis', from: 17, to: 23 },
      { title: 'Towers of Hanoi', from: 24, to: 31 }
    ],
    visuals: [infinite, fun, sum, fact, fib, hanoi],
    slides: {
      1: { cover: true, explain: '<p><b>Recursion</b>: a method that calls itself. Each call solves a smaller copy of the same problem, until the problem is so small that the answer is known at once.</p><pre class="ex">sum(3) = sum(2) + 3\nsum(2) = sum(1) + 2 …   sum(0) = 0</pre><p>In this unit: the base case, math examples, sum, factorial, Fibonacci, the cost of recursion, and the Towers of Hanoi.</p>' },
      2: { explain: '<p><b>Recursion</b> is a technique where a method calls <b>itself</b> to do its job: something defined in terms of itself.</p><pre class="ex">a list of numbers = one number, or\n                    one number + a list of numbers</pre><p>Some ideas are easiest to say this way. Before writing recursive code, practice <b>thinking</b> recursively: “how can I use the answer of a smaller problem?”</p>' },
      3: { explain: '<p>Every recursive definition needs a <b>non-recursive part</b>, the <b>base case</b>: a case answered directly, without calling itself again.</p><pre class="ex">countDown(0): print "Done" and stop   ← base case\ncountDown(n): print n, countDown(n − 1)</pre><p>Without a base case the calls never end: <b>infinite recursion</b>, like an infinite loop. In Java it ends with a StackOverflowError.</p><p class="watch">A base case is not enough: each call must also move <b>toward</b> it.</p>' },
      4: { explain: '<p>Two example programs:</p><ul><li><b>SimpleInfiniteRecursion</b>: a method that calls itself forever (no base case);</li><li><b>SimpleRecursion</b>: it calls itself, counting from n down to zero, and stops at the base case.</li></ul><pre class="ex">countDown(3) → prints 3, 2, 1, Done</pre><p>The drawing shows both: change “base case” to 0 to see what happens without one.</p>' },
      5: { blocks: [bul('Mathematical formulas are often expressed recursively'), bul('N!, for any positive integer N, is defined to be the product of all integers between 1 and N inclusive'), bul('This definition can be expressed recursively:'), pre('1!  =  1\nN!  =  N * (N-1)!'), bul('A factorial is defined in terms of another factorial until the base case of 1! is reached')],
        explain: '<p>Math uses recursion a lot. N! (N {{factorial|مضروب}}) is 1 × 2 × … × N. Said recursively:</p><pre class="ex">1! = 1             (base case)\nN! = N × (N − 1)!  (recursive case)\n4! = 4 × 3! = 4 × 3 × 2! = … = 24</pre><p>Each factorial is defined by a smaller factorial, until 1!.</p>' },
      6: { blocks: [bul('We are familiar with'), pre('f(x) = 3x+5'), bul('How about'), pre('f(x) = 3x+5      if x > 10\nf(x) = f(x+2) -3  otherwise')],
        explain: '<p>A normal function: f(x) = 3x + 5, so f(2) = 11. Now a recursive one:</p><pre class="ex">f(x) = 3x + 5        if x &gt; 10\nf(x) = f(x + 2) − 3  otherwise</pre><p>For x &gt; 10 the answer is direct (the base case). For other x, we must first know f(x + 2). x goes up by 2 each time, so it reaches 11 or more at some point.</p>' },
      7: { title: 'Calculate f(5)', blocks: [pre('f(x) = 3x+5      if x > 10\nf(x) = f(x+2) -3  otherwise'), bul('f(5) = f(7)-3'), bul('f(7) = f(9)-3'), bul('f(9) = f(11)-3'), bul('f(11) = 3(11)+5 = 38'), { type: 'paragraph', text: 'But we have not determined what f(5) is yet!' }],
        explain: '<p>To find f(5) we go <b>down</b>:</p><pre class="ex">f(5) = f(7) − 3\nf(7) = f(9) − 3\nf(9) = f(11) − 3\nf(11) = 3·11 + 5 = 38   ← base case</pre><p>We know f(11) now, but each line above is still waiting: f(5) is not known yet.</p><p class="watch">Reaching the base case is only half of the work.</p>' },
      8: { title: 'Calculate f(5)', blocks: [pre('f(x) = 3x+5      if x > 10\nf(x) = f(x+2) -3  otherwise'), pre('f(5) = f(7)-3 = 29\nf(7) = f(9)-3 = 32\nf(9) = f(11)-3 = 35\nf(11) = 3(11)+5 = 38'), { type: 'paragraph', text: 'Working backwards we see that f(5)=29' }],
        explain: '<p>Now we go back <b>up</b>, putting each answer into the line above:</p><pre class="ex">f(9) = 38 − 3 = 35\nf(7) = 35 − 3 = 32\nf(5) = 32 − 3 = 29</pre><p>Working backwards, f(5) = 29. Recursion always has these two phases: calls going down to the base case, then values coming back.</p>' },
      9: { title: 'Series of calls', blocks: [pre('f(5)\n  f(7)\n    f(9)\n      f(11)')], explain: '<p>The series of calls: f(5) calls f(7), which calls f(9), which calls f(11). Four calls are waiting at the same time.</p><pre class="ex">f(5) → f(7) → f(9) → f(11)   calls\n29  ←  32  ←  35  ←  38      values</pre><p>The last call made is the first one to finish: the calls behave like a <b>stack</b>.</p>' },
      10: { title: 'Calculate f(5)', blocks: [code('package myjava;\nimport java.util.*;\npublic class MyJava {\n  public static int fun( int x )\n  {\n    if( x > 10 )\n      return  (3*x+5);         //base step\n    else\n      return fun( x +2 ) -3;   //recursive step\n  }\n  public static void main (String args[]) {\n    System.out.print("the result of fun(5) =  “ + fun( 5 ) );\n  }\n}')],
        explain: '<p>The same function in Java:</p><pre class="ex">if (x &gt; 10) return 3*x + 5;     // base step\nelse return fun(x + 2) - 3;     // recursive step</pre><p>Each call of fun has its <b>own</b> x. fun(5) prints 29.</p><p class="watch">On the slide, the string ends with a curly quote “ instead of a straight ", so the code does not compile as written. In code, always use the straight ".</p>' },
      11: { explain: '<p>A Java method can call itself: it is then a <b>recursive method</b>. Its code must handle the base case and the recursive case.</p><pre class="ex">sum(3) has n = 3\nsum(2) has n = 2   (a different n)</pre><p>Each call gets a new execution environment, with its own parameters and local variables. When a call finishes, control returns to the method that called it, which may be another copy of itself.</p>' },
      12: { explain: '<p>Problem: the sum of all integers from 1 to N. For N = 5: 1 + 2 + 3 + 4 + 5 = 15. Recursively:</p><pre class="ex">sum of 1 to N = N + (sum of 1 to N − 1)\nsum(5) = 5 + sum(4)</pre><p>The smaller sum is the same problem with N − 1, so the method can call itself for it.</p>' },
      13: { title: 'Summation', blocks: [pre('sum(100) = 1+2+3+…+100\n         = 1+2+…+ 99 + 100\n         = sum(99) + 100'), pre('sum(n) = sum(n-1) + n     Recursive step\nsum(0) = 0                Base step')],
        explain: '<p>The two parts written as rules:</p><pre class="ex">sum(n) = sum(n − 1) + n   recursive step\nsum(0) = 0                base step</pre><p>sum(100) = sum(99) + 100, and sum(99) = sum(98) + 99, and so on until sum(0) = 0.</p><p class="watch">The base case must be a value the calls really reach: n goes down by 1 each time, so from a positive n it reaches 0.</p>' },
      14: { title: 'Summation Method', blocks: [code('package myjava;\nimport java.util.*;\npublic class MyJava {\n  public static int sum( int n )\n  {\n    if(n == 0)          //base step\n      return (0);\n    else                //recursive step\n      return(sum (n-1) +n);\n  }\n  public static void main (String args[]) {\n    Scanner scan=new Scanner(System.in);\n    System.out.println("enter any number :" );\n    int x = scan.nextInt();\n    System.out.println("the summation from 1 to " +x+ " = "+ sum( x ));\n  }\n}')],
        explain: '<p>The sum in Java:</p><pre class="ex">if (n == 0) return 0;\nelse return sum(n - 1) + n;</pre><p>main reads a number with a Scanner and prints the sum. For 4: sum(4) → sum(3) → … → sum(0) = 0, then 1, 3, 6, 10 come back.</p><p class="watch">If the user types a negative number, n never equals 0: the calls never stop and Java throws a StackOverflowError.</p>' },
      15: { title: 'Recursion vs. Iteration', explain: '<p>Just because recursion <b>can</b> solve a problem does not mean it <b>should</b>. For the sum of 1 to N:</p><pre class="ex">loop:    for (i = 1; i &lt;= n; i++) total += i;\nformula: n * (n + 1) / 2</pre><p>The loop is easier to understand, and the formula needs no loop at all. You must learn to judge when recursion is the right tool.</p>' },
      16: { title: 'Recursion vs. Iteration', explain: '<ul><li>Every recursive solution has a matching <b>iterative</b> (loop) solution.</li><li>The recursive one may be less efficient: each call costs time and stack memory (the {{overhead|التكلفة الإضافية}} of method calls).</li><li>But for some problems the recursive solution is much simpler and more {{elegant|أنيق}}.</li></ul><pre class="ex">sum(1000): 1001 calls on the stack\nloop: one method, one variable</pre>' },
      17: { title: 'Factorial', blocks: [pre('4! = 4 * 3 * 2 * 1\nn! = n * (n-1) * … * 1\n4! = 4 * 3!\nn! = n * (n-1)!'), pre('factorial(n) = n * factorial(n-1)   //recursive step\nfactorial(1) = 1                    //base step')],
        explain: '<p>Factorial as rules:</p><pre class="ex">factorial(n) = n * factorial(n − 1)   recursive step\nfactorial(1) = 1                      base step\n4! = 4 * 3! = 4 * 6 = 24</pre><p>Same pattern as sum, but with × instead of +, and the base case at 1.</p>' },
      18: { title: 'Method Factorial', blocks: [code('package myjava;\nimport java.util.*;\npublic class MyJava {\n  public static int facto( int n )\n  {\n    if(n == 1)          //base step\n      return (1);\n    else                //recursive step\n      return(facto (n-1)*n);\n  }\n  public static void main (String args[]) {\n    Scanner scan=new Scanner(System.in);\n    System.out.println("enter any number :" );\n    int x = scan.nextInt();\n    System.out.println("the summation from 1 to " +x+ " = "+ facto( x ));\n  }\n}')],
        explain: '<p>facto(n) returns 1 when n == 1, otherwise <code>facto(n-1)*n</code>. The multiplication happens <b>after</b> the inner call returns.</p><pre class="ex">facto(4) = facto(3)*4 = 6*4 = 24</pre><p class="watch">Three traps: the message says “summation” (copied from the sum program); facto(0) never reaches n == 1 (StackOverflowError); and int overflows from 13! on, giving a wrong number.</p>' },
      19: { title: 'Fibonacci Sequence Numbers', blocks: [pre('0, 1, 1, 2, 3, 5, 8, 13, 21, 34…'), pre('Fib(n) = Fib(n-1) + Fib(n-2)   // recursive step\nFib(0) = 0                     //base step\nFib(1) = 1                     //base step')],
        explain: '<p>In the Fibonacci {{sequence|متتالية}}, each number is the sum of the two before it:</p><pre class="ex">0, 1, 1, 2, 3, 5, 8, 13 …\nFib(6) = Fib(5) + Fib(4) = 5 + 3 = 8</pre><p>It needs <b>two</b> base cases, Fib(0) = 0 and Fib(1) = 1, because each step looks two numbers back.</p>' },
      20: { title: 'Recursive Implementation of Fibonacci Numbers', blocks: [code('package myjava;\nimport java.util.*;\npublic class MyJava {\n  public static int Fib(int n){\n    if(n<=1)\n      return n;\n    else\n      return (Fib(n-1)+Fib(n-2));\n  }\n  public static void main (String args[]) {\n    int x =5;\n    System.out.println("the Fib of " +x + " equal to "+ Fib( x ) );\n  }\n}')],
        explain: '<p><code>if (n &lt;= 1) return n;</code> covers both base cases. Otherwise the method calls itself <b>twice</b>, so the calls form a <b>tree</b>:</p><pre class="ex">        Fib(4)\n     Fib(3)  Fib(2)\n  Fib(2) Fib(1) …</pre><p>The numbers on the arrows in the picture are the values returned. Fib(n−1) is finished completely before Fib(n−2) starts.</p><p class="watch">The same calls appear many times in the tree: Fib(2) and Fib(1) are computed again and again.</p>' },
      21: { explain: '<p>For a loop: (cost of the body) × (number of times it runs). For a recursive method: (cost of the body) × (number of calls).</p><pre class="ex">sum(n): n calls, each O(1) → O(n)</pre><p>So recursion is not slow by itself; what matters is <b>how many</b> calls it makes.</p>' },
      22: { blocks: [bul('For the Towers of Hanoi puzzle, the step of moving one disk is O(1)'), bul('But each call results in calling itself twice more, so for N > 1, the growth function is'), pre('f(n) = 2ⁿ – 1'), bul('This is exponential efficiency: O(2ⁿ)'), bul('As the number of disks increases, the number of required moves increases exponentially')],
        explain: '<p>In the Towers of Hanoi one move is O(1), but each call makes <b>two</b> more calls:</p><pre class="ex">f(n) = 2ⁿ − 1 moves → O(2ⁿ)\n3 disks: 7,  10 disks: 1023,  20 disks: 1048575</pre><p>Adding one disk doubles the work. This is {{exponential|أُسّي}} growth.</p><p class="watch">On the slide the powers lost their format: “2n” means 2 to the power n.</p>' },
      23: { blocks: [bul('https://www.nayuki.io/page/fast-fibonacci-algorithms'), bul('O(logn)', 1), bul('Recursive Fibonacci with Memoization:'), bul('https://www.javabrahman.com/gen-java-programs/recursive-fibonacci-in-java-with-memoization/', 1)],
        explain: '<p>The simple recursive Fib is exponential, because it repeats the same work. Faster ways exist:</p><ul><li>special fast algorithms reach O(log n);</li><li><b>memoization</b>: remember (store) each Fib(k) the first time it is computed, and reuse it.</li></ul><pre class="ex">with memoization each Fib(k) is computed once → O(n)</pre><p>The links are for extra reading.</p>' },
      24: { title: 'Tower Of Hanoi', blocks: [bul('Goal: Move all disks from A to C'), bul('Rule:'), bul('No bigger disk is on top of smaller disk at any time', 1), bul('Move one disk at a time', 1)],
        explain: '<p>The puzzle: three pegs A, B, C and disks of different sizes on A, biggest at the bottom.</p><pre class="ex">goal: all disks from A to C\nrule 1: one disk at a time\nrule 2: never a bigger disk on a smaller one</pre><p>B is used as a helper peg.</p>' },
      25: { title: 'Tower Of Hanoi', blocks: [bul('1 disk moves from A to C: Simple!'), bul('2 disks move from A to C')],
        explain: '<p>1 disk: just move it from A to C. 2 disks: three moves:</p><pre class="ex">1. small disk A → B\n2. big disk   A → C\n3. small disk B → C</pre><p>The small disk “gets out of the way” on B, then comes back on top of the big one.</p>' },
      26: { title: 'N disks from A to C?', blocks: [{ type: 'paragraph', text: '1. Move n-1 disks from A to B' }, { type: 'paragraph', text: '2. Move disk n from A to C' }, { type: 'paragraph', text: '3. Move n-1 disks from B to C' }],
        explain: '<p>The same idea for n disks:</p><pre class="ex">1. move n − 1 disks from A to B   (a smaller Hanoi)\n2. move disk n from A to C        (one move)\n3. move n − 1 disks from B to C   (a smaller Hanoi)</pre><p>Steps 1 and 3 are the same problem with one disk less: that is the recursion. The base case is 1 disk.</p>' },
      27: { text: false, explain: '<p>A 4-disk example, step by step. First the top 3 disks must leave A, so that disk 4 can go to C. The first moves start that work:</p><pre class="ex">disk 1 A → B,  disk 2 A → C,  disk 1 B → C, …</pre><p>Use the drawing with 4 disks to follow every move.</p>' },
      28: { text: false, explain: '<p>The middle of the 4-disk example: the 3 small disks are on B, disk 4 moves from A to C (the big step 2), and then the 3 disks start moving from B to C.</p><pre class="ex">move 8 of 15: disk 4 A → C</pre>' },
      29: { text: false, explain: '<p>The end of the 4-disk example: the 3 small disks finish moving from B onto disk 4 on C.</p><pre class="ex">4 disks: 2⁴ − 1 = 15 moves</pre><p>Each half (3 disks) took 7 moves, plus 1 for disk 4: 7 + 1 + 7 = 15.</p>' },
      30: { title: 'Recursive Code For Hanoi Tower (Trace of Recursive)', blocks: [code('package myjava;\nimport java.util.*;\npublic class MyJava {\n  public static void move(int n, char start, char finish, char buf){\n    if(n==1)            // stop condition: move one disk\n      System.out.println("Move from " +start + " to "+ finish );\n    else{\n      move(n-1,start,buf,finish);   // move n-1 from start to buf using\n                                    //finish as temporary storage\n      System.out.println("Move from " +start + " to "+ finish );\n      move(n-1,buf,finish,start);   // move n-1 from buf to finish using\n                                    //start as temporary storage\n    }};\n  public static void main (String args[]) {\n    move(3, \'A\', \'C\', \'B\');\n  }\n}')],
        explain: '<p><code>move(n, start, finish, buf)</code> follows the plan exactly:</p><pre class="ex">move(n-1, start, buf, finish);   // 1\nprint "Move from start to finish"  // 2\nmove(n-1, buf, finish, start);   // 3</pre><p>Notice how the pegs change roles in each call. move(3, \'A\', \'C\', \'B\') prints 7 moves.</p><p class="watch">The <code>}};</code> at the end of move has an extra semicolon; Java accepts it, but it is not needed.</p>' },
      31: { title: 'Demo Of Hanoi', blocks: [bul('A nice animation of Hanoi online:'), bul('https://www.mathsisfun.com/games/towerofhanoi.html', 1)], explain: '<p>You can play the puzzle online and try to beat the minimum: 2ⁿ − 1 moves for n disks.</p><pre class="ex">3 disks: 7 moves    4 disks: 15 moves</pre><p>The drawing on slides 24-30 moves the disks exactly like the Java code.</p>' }
    },
    exam: {
      questions: [
        { type: 'tf', q: 'The base case of a recursive method is the part that does not call the method again.', answer: true, review: 3,
          why: 'The base case is the non-recursive part (slide 3). It gives an answer directly and so ends the chain of calls.',
          lessons: ['08-recursion'], skills: ['concept'], available_after: '08-recursion', level: 1 },
        { q: 'Which list is the start of the Fibonacci sequence of slide 19?',
          options: ['0, 1, 1, 2, 3, 5, 8', '0, 1, 2, 3, 5, 8', '1, 2, 3, 5, 8, 13', '1, 1, 2, 4, 8, 16'], answer: 0, review: 19,
          why: 'Fib(0) = 0 and Fib(1) = 1, and each next number is the sum of the two before it: 0 + 1 = 1, 1 + 1 = 2, 1 + 2 = 3, 2 + 3 = 5, 3 + 5 = 8.',
          lessons: ['08-recursion'], skills: ['concept'], available_after: '08-recursion', level: 1 },
        { type: 'output', q: 'With the sum method of slide 14, what does `System.out.println(sum(7));` print?', review: 14,
          code: 'public static int sum(int n) {\n  if (n == 0)\n    return 0;\n  else\n    return sum(n - 1) + n;\n}',
          answer: '28',
          why: 'sum(7) = 7 + 6 + 5 + 4 + 3 + 2 + 1 + 0 = 28. The additions happen on the way back from sum(0).',
          lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 1 },
        { q: 'With fun of slide 10 (3x + 5 if x &gt; 10, otherwise fun(x + 2) − 3), what is fun(1)?',
          options: ['20', '23', '26', '38'], answer: 1, review: 10,
          why: 'x goes 1, 3, 5, 7, 9, 11: five recursive steps, then fun(11) = 38. Each step subtracts 3 on the way back: 38 − 15 = 23.',
          lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 2 },
        { source: { assignment: 5, question: 10 },
          q: 'A robot records its journey using the following code:',
          code: 'void walk(int n)\n{\n  if (n == 0) return;\n  System.out.print(n + " ");\n  walk(n - 1);\n  System.out.print(n + " ");\n}',
          ask: 'What does walk(3) print?',
          options: ['3 2 1 1 2 3', '1 2 3 3 2 1', '3 2 1 0 1 2 3', '3 3 2 2 1 1'], answer: 0, review: 11,
          why: 'Each call prints n before its recursive call (on the way down: 3 2 1) and again after it returns (on the way back up: 1 2 3). walk(0) is the base case and prints nothing, so no 0 appears.',
          lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 2 },
        { source: { assignment: 5, question: 6 },
          q: 'A singly linked list has values: A -> B -> C -> null. What will be printed if the following code is run:',
          code: 'void Visit(Node head)\n{\n  if(head == null) return;\n  Visit(head.next);\n  System.out.print(head.value);\n}',
          options: ['B A C', 'C B A', 'A B C'], answer: 1, review: 11,
          why: 'Each call first visits the rest of the list and prints its own value only after that call returns. The call for C returns first (its next is null), then B, then A: the list is printed backwards. Printing before the recursive call would give A B C.',
          lessons: ['08-recursion', '04-linked-stacks'], skills: ['trace'], available_after: '08-recursion', level: 2 },
        { type: 'fill', q: 'Complete facto of slide 18.', review: 18,
          code: 'public static int facto(int n) {\n  if (n == ___)\n    return 1;\n  else\n    return facto(___) * n;\n}',
          answer: ['1', 'n-1|n - 1'],
          why: 'The base step is factorial(1) = 1, and the recursive step is n * factorial(n − 1).',
          lessons: ['08-recursion'], skills: ['concept'], available_after: '08-recursion', level: 2 },
        { type: 'bug', q: 'This method should print n, n − 1, …, 1, but for n = 3 it never stops. Tap the line with the mistake.', review: 3,
          code: 'static void down(int n) {\n  if (n == 0) return;\n  System.out.println(n);\n  down(n + 1);\n}',
          answer: 4,
          why: 'The base case is n == 0, but each call makes n bigger, so the calls move away from it: 3, 4, 5, … until a StackOverflowError. The call must be <code>down(n - 1)</code>.',
          lessons: ['08-recursion'], skills: ['bug'], available_after: '08-recursion', level: 2 },
        { q: 'How many moves do the Towers of Hanoi need for 6 disks?',
          options: ['12', '36', '63', '64'], answer: 2, review: 22,
          why: '2⁶ − 1 = 64 − 1 = 63. Each extra disk doubles the work and adds one move.',
          lessons: ['08-recursion'], skills: ['complexity'], available_after: '08-recursion', level: 2 },
        { type: 'output', q: 'With the move method of slide 30, what does `move(2, \'A\', \'B\', \'C\');` print?', review: 30,
          code: 'public static void move(int n, char start, char finish, char buf) {\n  if (n == 1)\n    System.out.println("Move from " + start + " to " + finish);\n  else {\n    move(n - 1, start, buf, finish);\n    System.out.println("Move from " + start + " to " + finish);\n    move(n - 1, buf, finish, start);\n  }\n}',
          answer: 'Move from A to C\nMove from A to B\nMove from C to B',
          why: 'start = A, finish = B, buf = C. The small disk goes to the spare peg C, the big disk goes A → B, then the small disk C → B.',
          lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 2 },
        { type: 'write', q: 'Write the body of the recursive method `int sumOdd(int n)` that returns 1 + 3 + 5 + … + n for an odd n ≥ 1. Use the base case n == 1 and no loop.', review: 13,
          rows: 5, starter: 'static int sumOdd(int n) {\n  \n}',
          checks: [{ re: /if\s*\(\s*n\s*==\s*1\s*\)\s*return\s+1\s*;/, label: 'Base case: <code>if (n == 1) return 1;</code>' },
            { re: /return\s+(n\s*\+\s*sumOdd\s*\(\s*n\s*-\s*2\s*\)|sumOdd\s*\(\s*n\s*-\s*2\s*\)\s*\+\s*n)\s*;/, label: 'Recursive step: n + sumOdd(n - 2)' },
            { fn: function (c) { return !/\b(for|while)\b/.test(c); }, label: 'No loop' }],
          solution: 'static int sumOdd(int n) {\n  if (n == 1) return 1;\n  return n + sumOdd(n - 2);\n}',
          why: 'Like sum of slide 14, but the next smaller odd number is n − 2. For n = 7: 7 + 5 + 3 + 1 = 16. With n − 1 the method would add even numbers too, and from 1 it would jump past the base case.',
          lessons: ['08-recursion'], skills: ['design'], available_after: '08-recursion', level: 2 },
        { q: 'Calls of a recursive method finish in the opposite order to the order they started: the last call made is the first to return. Which structure works the same way?',
          options: ['A queue (FIFO)', 'An ordered list', 'An ArrayList', 'A stack (LIFO)'], answer: 3, review: 11,
          why: 'Each new call waits on top of the ones that called it, and control returns to the caller (slide 11): last in, first out. That is a stack, and Java keeps the waiting calls on its call stack.',
          lessons: ['03-stacks', '08-recursion'], skills: ['concept'], available_after: '08-recursion', level: 2 },
        { q: 'For the list A -> B -> C -> D (4 nodes), what does `count(head)` return, and how many calls of count are made?',
          code: 'int count(Node head) {\n  if (head == null) return 0;\n  return 1 + count(head.next);\n}',
          options: ['4 and 5 calls', '4 and 4 calls', '5 and 5 calls', '3 and 4 calls'], answer: 0, review: 11,
          why: 'There is one call per node (A, B, C, D) plus one more for the null after D, which is the base case: 5 calls. Each node adds 1 on the way back: 4.',
          lessons: ['04-linked-stacks', '08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 2 },
        { source: { assignment: 5, question: 3 },
          q: 'What does the following recursive method \'clean\' return when called as clean("AAABBCCA"):',
          code: 'String clean(String s)\n{\n  if (s.length() <= 1) return s;\n  if (s.charAt(0) == s.charAt(1)) return clean(s.substring(1));\n  return s.charAt(0) + clean(s.substring(1));\n}',
          options: ['ABCA', 'ABC', 'ABCCA', 'AABBCA'], answer: 0, review: 11,
          why: 'A character is kept only when the next character is different, so each run of equal letters shrinks to one: AAA → A, BB → B, CC → C, and the last A stays (length 1 is the base case). The last A is not next to the first ones, so it is not removed: "ABC" would drop it.',
          lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 3 },
        { q: 'For the list A -> B -> C -> D -> E, what does `p(head)` print?',
          code: 'void p(Node h) {\n  if (h == null || h.next == null) return;\n  System.out.print(h.next.value);\n  p(h.next.next);\n}',
          options: ['ACE', 'DB', 'BDE', 'BD'], answer: 3, review: 11,
          why: 'p(A) prints B and jumps two nodes to C. p(C) prints D and jumps to E. p(E) stops, because E.next is null. So "BD". The test <code>h.next == null</code> stops before reading a missing node.',
          lessons: ['04-linked-stacks', '08-recursion'], skills: ['trace', 'edge_case'], available_after: '08-recursion', level: 3 }
      ],
      tasks: [
        {
          title: 'A recursive power method',
          task: '<p>Write a program with a <b>recursive</b> method <code>static int power(int b, int e)</code> that returns b to the power e (e ≥ 0), using power(b, 0) = 1 and power(b, e) = b * power(b, e − 1). No loops. In main, print <code>power(2, 10)</code> and, on the next line, <code>power(5, 0)</code>.</p>',
          starter: 'public class Power {\n  \n\n  public static void main(String[] args) {\n    \n  }\n}',
          output: '1024\n1',
          checks: [
            { re: /static\s+int\s+power\s*\(\s*int\s+b\s*,\s*int\s+e\s*\)/, label: '<code>static int power(int b, int e)</code>', review: 11 },
            { re: /if\s*\(\s*e\s*==\s*0\s*\)\s*return\s+1\s*;/, label: 'Base case: <code>if (e == 0) return 1;</code>', review: 13 },
            { re: /return\s+(b\s*\*\s*power\s*\(\s*b\s*,\s*e\s*-\s*1\s*\)|power\s*\(\s*b\s*,\s*e\s*-\s*1\s*\)\s*\*\s*b)\s*;/, label: 'Recursive step: <code>b * power(b, e - 1)</code>', review: 18 },
            { re: /System\.out\.println\s*\(\s*power\s*\(\s*2\s*,\s*10\s*\)\s*\)\s*;[\s\S]*System\.out\.println\s*\(\s*power\s*\(\s*5\s*,\s*0\s*\)\s*\)\s*;/, label: 'Prints power(2, 10), then power(5, 0)', review: 14 },
            { fn: function (c) { return !/\b(for|while)\b/.test(c); }, label: 'No loop', review: 15 }
          ],
          solution: 'public class Power {\n  static int power(int b, int e) {\n    if (e == 0) return 1;\n    return b * power(b, e - 1);\n  }\n\n  public static void main(String[] args) {\n    System.out.println(power(2, 10));\n    System.out.println(power(5, 0));\n  }\n}'
        },
        {
          title: 'Counting the nodes recursively',
          task: '<p>The nodes of a singly linked list have the fields <code>element</code> and <code>next</code>. Write a <b>recursive</b> method <code>int size(Node&lt;T&gt; node)</code> that returns the number of nodes from <code>node</code> to the end of the list. An empty list (node == null) has size 0. No loops.</p>',
          starter: 'int size(Node<T> node) {\n  \n}',
          checks: [
            { re: /if\s*\(\s*node\s*==\s*null\s*\)\s*return\s+0\s*;/, label: 'Base case: <code>if (node == null) return 0;</code>', review: 3 },
            { re: /return\s+(1\s*\+\s*size\s*\(\s*node\.next\s*\)|size\s*\(\s*node\.next\s*\)\s*\+\s*1)\s*;/, label: 'Recursive step: <code>1 + size(node.next)</code>', review: 12 },
            { fn: function (c) { return !/\b(for|while)\b/.test(c); }, label: 'No loop', review: 15 }
          ],
          solution: 'int size(Node<T> node) {\n  if (node == null) return 0;\n  return 1 + size(node.next);\n}'
        }
      ]
    }
  });
})();
