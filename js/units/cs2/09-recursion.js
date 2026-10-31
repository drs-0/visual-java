/* CS2 · Unit 9 · Recursion (25 slides): recursive factorial, tracing calls and the runtime stack, base cases and infinite
   recursion, recursive palindrome and helper methods, recursive binary search, Tower of Hanoi, recursion vs iteration */
(function () {
  function mix(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }
  function I(x) { return Math.trunc(x); }
  function h(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function hot(o) { return mix(o || {}, { tone: 'accent', hi: true }); }
  function fact(n) { var r = 1n; for (var i = 2n; i <= BigInt(n); i++) r *= i; return r.toString(); }
  function walls(x1, x2, y) { return [A('w1', x1, 20, x1, y, { head: false, tone: 'muted' }), A('w2', x2, 20, x2, y, { head: false, tone: 'muted' }), A('w3', x1, y, x2, y, { head: false, tone: 'muted' })]; }

  /* ---------- 1. factorial: calls, returns and the runtime stack (slides 3-9) ---------- */
  var CF = 'import java.util.Scanner;\n\npublic class ComputeFactorial {\n  public static void main(String[] args) {\n    Scanner input = new Scanner(System.in);\n    System.out.print("Enter a non-negative integer: ");\n    int n = input.nextInt();\n    System.out.println("Factorial of " + n + " is " + factorial(n));\n  }\n\n  // Computes and returns the factorial recursively\n  public static long factorial(int n) {\n    if (n == 0) return 1;         // Base case\n    return n * factorial(n - 1);  // Recursive call\n  }\n}';
  var factorial = {
    id: 'factorial', slides: [3, 9], title: 'The stack grows with each call, shrinks with each return', code: CF,
    inputs: [{ id: 'n', label: 'n', value: 4, min: 0, max: 7 }],
    presets: [{ label: '4 (slides)', values: { n: 4 } }, { label: '0', values: { n: 0 } }, { label: '6', values: { n: 6 } }],
    steps: function (v) {
      var n = I(v.n), st = [];
      st.push({ line: '13-14', slide: 3, ph: 'def', st: [], cap: 'n! = n × (n − 1) × … × 1. Recursively: <b>n! = n × (n − 1)!</b>, and the <b>base case</b> 0! = 1. So factorial(n) = n * factorial(n − 1), and factorial(0) = 1.' });
      st.push({ slide: 4, line: '7-8', ph: 'call', st: ['main'], cap: 'main reads n = ' + n + ' and calls factorial(' + n + ').', out: 'Enter a non-negative integer: ' + n });
      var stack = ['main'];
      for (var i = n; i >= 0; i--) {
        stack.push('factorial(' + i + '), n = ' + i);
        st.push({ slide: i === 0 ? 8 : (n - i < 2 ? 6 : 8), line: i === 0 ? 13 : 14, ph: 'call', st: stack.slice(), cap: i === 0 ? 'factorial(0): the <b>base case</b>. No more calls: return 1.' : 'factorial(' + i + ') is not the base case, so it calls factorial(' + (i - 1) + '). Each call gets its <b>own</b> n on the runtime stack: the stack <b>grows</b>.' });
      }
      var val = 1;
      for (i = 1; i <= n; i++) {
        stack.pop();
        var nv = (BigInt(val) * BigInt(i)).toString();
        st.push({ slide: 9, line: 14, ph: 'ret', st: stack.slice(), r: nv, cap: 'factorial(' + (i - 1) + ') returned ' + val + ' and its space is freed: the stack <b>shrinks</b>. factorial(' + i + ') computes ' + i + ' × ' + val + ' = ' + nv + '.' });
        val = nv;
      }
      stack.pop();
      st.push({ slide: 5, line: 8, ph: 'done', st: ['main'], cap: n + '! = ' + fact(n) + '. Written out (slide 5): factorial(4) = 4 * (3 * (2 * (1 * 1))) = 24.', out: 'Factorial of ' + n + ' is ' + fact(n) });
      st.push({ line: 14, slide: 7, ph: 'stack', st: ['main'], cap: 'The <b>runtime stack</b> holds the parameters and local variables of every method that is running. It grows on each call and shrinks on each return.' });
      return st;
    },
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'def') return [T('a', 280, 80, 'n! = n × (n − 1)!', { anchor: 'middle', mono: true, size: 22, bold: true, tone: 'accent' }), T('b', 280, 140, '0! = 1   (base case)', { anchor: 'middle', mono: true, size: 18, bold: true, tone: 'teal' }), T('c', 280, 220, '4! = 4 × 3! = 4 × 3 × 2! = …', { anchor: 'middle', mono: true, size: 15, tone: 'muted' })];
      items = items.concat(walls(150, 410, 326));
      var hh = Math.min(38, Math.floor(296 / Math.max(s.st.length, 1)));
      s.st.forEach(function (f, i) { var top = i === s.st.length - 1; items.push(B('f' + f.split(',')[0], 160, 320 - (i + 1) * hh, 240, hh - 4, { title: f, mono: true, size: hh < 28 ? 10 : 12.5, tone: i === 0 ? 'blue' : top ? (s.ph === 'ret' ? 'teal' : 'accent') : 'teal', hi: top && i > 0 })); });
      items.push(T('lb', 280, 14, 'Runtime Stack', { anchor: 'middle', size: 12, bold: true, tone: 'muted' }));
      if (s.r) items.push(B('rv', 430, 120, 120, 50, { tag: 'returned', title: s.r, mono: true, size: 15, tone: 'teal', hi: true }));
      return items;
    }
  };

  /* ---------- 2. base cases and infinite recursion (slides 11-12) ---------- */
  var basecase = {
    id: 'basecase', slides: [11, 12], title: 'Every call must get closer to a base case',
    code: 'public static long factorial(int n) {\n  if (n == 0) return 1;         // Base case\n  return n * factorial(n - 1);  // Recursive call\n}\n\npublic static long bad(int n) {\n  return n * bad(n - 1);        // no base case!\n}',
    steps: [
      { slide: 11, line: 2, ph: 'base', cap: 'A recursive method needs one or more <b>base cases</b> that stop the recursion.' },
      { slide: 11, line: 3, ph: 'reduce', cap: 'Each recursive call must work on a <b>smaller</b> problem of the same kind (n − 1 instead of n), so it comes closer and closer to the base case.' },
      { slide: 12, line: '6-8', ph: 'inf', cap: 'Without a base case (the non-recursive part), the calls never stop: <b>infinite recursion</b>, like an infinite loop. In Java the stack fills up and the program stops with a StackOverflowError.', out: 'Exception in thread "main" java.lang.StackOverflowError' }
    ],
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'inf') {
        items = items.concat(walls(150, 410, 326));
        for (var i = 0; i < 7; i++) items.push(B('b' + i, 160, 280 - i * 42, 240, 36, { title: 'bad(' + (4 - i) + ')', mono: true, size: 12.5, tone: 'red' }));
        items.push(T('ov', 280, 14, 'the stack overflows', { anchor: 'middle', size: 13, bold: true, tone: 'red' }));
        return items;
      }
      [4, 3, 2, 1, 0].forEach(function (n, i) { items.push(B('p' + i, 30 + i * 104, 120, 90, 60, { title: 'n = ' + n, mono: true, size: 15, tone: n === 0 ? 'teal' : s.ph === 'reduce' ? 'accent' : 'blue', hi: n === 0 && s.ph === 'base' })); if (i) items.push(A('a' + i, 26 + i * 104 - 10, 150, 26 + i * 104, 150, { tone: 'muted' })); });
      items.push(T('t', 280, 240, s.ph === 'base' ? 'n == 0 → stop' : 'smaller each time', { anchor: 'middle', size: 15, bold: true, tone: s.ph === 'base' ? 'teal' : 'accent' }));
      return items;
    }
  };

  /* ---------- 3. palindromes: substring vs helper method (slides 13-14) ---------- */
  var palin = {
    id: 'palin', slides: [13, 14], title: 'Check the ends, then the middle',
    inputs: [{ id: 's', type: 'text', label: 's', value: 'level', maxlen: 14 }],
    presets: [{ label: 'level', values: { s: 'level' } }, { label: 'abba', values: { s: 'abba' } }, { label: 'hello', values: { s: 'hello' } }, { label: 'a', values: { s: 'a' } }],
    code: '// Slide 13: the first version, with substring\npublic static boolean isPalindrome(String s) {\n  if (s.length() <= 1) return true;\n  if (s.charAt(0) != s.charAt(s.length() - 1)) return false;\n  return isPalindrome(s.substring(1, s.length() - 1));\n}\n\n// Slide 14: the same idea with a helper method\n' + 'public static boolean isPalindrome(String s) {\n  return isPalindrome(s, 0, s.length() - 1);\n}\n\npublic static boolean isPalindrome(String s, int low, int high) {\n  if (low >= high) return true;                       // Base case\n  if (s.charAt(low) != s.charAt(high)) return false;  // Base case\n  return isPalindrome(s, low+1, high-1);              // Recursive call\n}',
    steps: function (v) {
      var s = v.s, lo = 0, hi = s.length - 1, st = [{ line: '2-5', slide: 13, ph: 'sub', lo: -1, hi: -1, cap: 'Thinking recursively: a string is a palindrome if its first and last characters are equal <b>and</b> the middle part is a palindrome. Slide 13 passes the middle as <code>s.substring(1, s.length() - 1)</code>, a new string each time.' }];
      st.push({ slide: 14, line: 10, ph: 'help', lo: lo, hi: hi, cap: 'Making substrings is slow. The <b>helper method</b> isPalindrome(s, low, high) keeps the same string and only moves two indexes. The first method just starts it with low = 0, high = ' + hi + '.' });
      while (true) {
        if (lo >= hi) { st.push({ slide: 14, line: 14, ph: 'help', lo: lo, hi: hi, ok: true, cap: 'low (' + lo + ') >= high (' + hi + '): nothing left to compare. Base case: <b>true</b>, it is a palindrome.', out: 'true' }); break; }
        if (s[lo] !== s[hi]) { st.push({ slide: 14, line: 15, ph: 'help', lo: lo, hi: hi, ok: false, cap: '\'' + h(s[lo]) + '\' != \'' + h(s[hi]) + '\': base case, <b>false</b>. Not a palindrome.', out: 'false' }); break; }
        st.push({ slide: 14, line: 16, ph: 'help', lo: lo, hi: hi, cap: '\'' + h(s[lo]) + '\' == \'' + h(s[hi]) + '\'. Recursive call with low + 1 and high − 1.' });
        lo++; hi--;
      }
      return st;
    },
    draw: function (k, s, v) {
      var str = v.s, n = str.length, cw = Math.min(40, Math.floor(480 / Math.max(n, 1))), x0 = 280 - n * cw / 2, items = [];
      for (var i = 0; i < n; i++) {
        var inner = s.lo >= 0 && i >= s.lo && i <= s.hi, end = i === s.lo || i === s.hi;
        items.push(B('c' + i, x0 + i * cw, 100, cw - 3, 46, { title: str[i], mono: true, size: 18, tone: end ? (s.ok === false ? 'red' : 'accent') : inner ? 'blue' : 'muted', hi: end, dash: s.lo >= 0 && !inner }));
        items.push(T('i' + i, x0 + i * cw + cw / 2 - 1, 166, String(i), { anchor: 'middle', mono: true, size: 11, tone: 'muted' }));
      }
      if (s.lo >= 0 && s.lo < n) items.push(P('pl', x0 + s.lo * cw + cw / 2 - 1, 96, 'low', { dir: 'down' }));
      if (s.hi >= 0 && s.hi < n && s.hi !== s.lo) items.push(P('ph', x0 + s.hi * cw + cw / 2 - 1, 96, 'high', { dir: 'down' }));
      if (s.ok != null) items.push(T('r', 280, 250, s.ok ? 'palindrome: true' : 'not a palindrome: false', { anchor: 'middle', size: 16, bold: true, tone: s.ok ? 'teal' : 'red' }));
      return items;
    }
  };

  /* ---------- 4. recursive binary search (slides 16-17) ---------- */
  var BS = 'public static int binarySearch(int[] array, int target) {\n  return binarySearch(array, target, 0, array.length - 1);\n}\n\npublic static\nint binarySearch(int[] array, int target, int low, int high) {\n  if (low > high) return -1;              // target element not found\n  int mid = (low + high) / 2;             // middle index\n  if (target == array[mid]) return mid;   // found at mid index\n  if (target < array[mid])                // search left subarray\n    return binarySearch(array, target, low, mid-1);\n  return binarySearch(array, target, mid+1, high);  // right subarray\n}';
  var ARR = [2, 4, 7, 10, 11, 45, 50, 59, 60, 66, 69, 70, 79];
  var bsearch = {
    id: 'bsearch', slides: [16, 17], title: 'Halve the range each call', code: BS,
    inputs: [{ id: 't', label: 'target', value: 11, min: -10, max: 100 }],
    presets: [{ label: '11', values: { t: 11 } }, { label: '70', values: { t: 70 } }, { label: '2 (first)', values: { t: 2 } }, { label: '12 (missing)', values: { t: 12 } }],
    steps: function (v) {
      var t = I(v.t), lo = 0, hi = ARR.length - 1, st = [{ slide: 16, line: 2, lo: lo, hi: hi, mid: -1, cap: 'Binary search works on a <b>sorted</b> array. Look at the middle: found, or go left, or go right. Each call has half as much left to search.' }];
      while (true) {
        if (lo > hi) { st.push({ slide: 17, line: 7, lo: lo, hi: hi, mid: -1, cap: 'low (' + lo + ') > high (' + hi + '): the range is empty. Return <b>-1</b>: not found.', out: '-1' }); break; }
        var mid = Math.floor((lo + hi) / 2);
        if (t === ARR[mid]) { st.push({ slide: 17, line: '8-9', lo: lo, hi: hi, mid: mid, found: true, cap: 'mid = (' + lo + ' + ' + hi + ') / 2 = ' + mid + ', and array[' + mid + '] = ' + ARR[mid] + ' = target. Return <b>' + mid + '</b>.', out: String(mid) }); break; }
        var left = t < ARR[mid];
        st.push({ slide: 17, line: left ? '8,10-11' : '8,12', lo: lo, hi: hi, mid: mid, cap: 'mid = ' + mid + ', array[mid] = ' + ARR[mid] + '. ' + t + (left ? ' < ' : ' > ') + ARR[mid] + ', so search the <b>' + (left ? 'left' : 'right') + '</b> half: ' + (left ? 'low = ' + lo + ', high = ' + (mid - 1) : 'low = ' + (mid + 1) + ', high = ' + hi) + '.' });
        if (left) hi = mid - 1; else lo = mid + 1;
      }
      return st;
    },
    draw: function (k, s) {
      var items = [], cw = 41;
      ARR.forEach(function (x, i) {
        var inR = i >= s.lo && i <= s.hi;
        items.push(B('a' + i, 14 + i * cw, 110, cw - 3, 44, { title: String(x), mono: true, size: 14, tone: i === s.mid ? (s.found ? 'teal' : 'accent') : inR ? 'blue' : 'muted', hi: i === s.mid, dash: !inR }));
        items.push(T('i' + i, 14 + i * cw + cw / 2 - 1, 172, String(i), { anchor: 'middle', mono: true, size: 11, tone: 'muted' }));
      });
      if (s.mid >= 0) items.push(P('pm', 14 + s.mid * cw + cw / 2 - 1, 106, 'mid', { dir: 'down' }));
      items.push(T('r', 280, 240, 'low = ' + s.lo + '   high = ' + s.hi, { anchor: 'middle', mono: true, size: 15, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 5. the Tower of Hanoi (slides 19-24) ---------- */
  function hanoi(n, f, t, a, out) { if (n === 1) { out.push([1, f, t]); return; } hanoi(n - 1, f, a, t, out); out.push([n, f, t]); hanoi(n - 1, a, t, f, out); }
  var HN = '// Recursive method for finding the solution to move n disks\n// from a source tower to a target tower using auxiliary tower\npublic static void moveDisks (int n, char from, char to, char aux) {\n  if (n == 1)  // Base Case, no recursive call\n    System.out.printf("Move disk 1 from %c to %c%n", from, to);\n  else {\n    // First recursive call to move n-1 disks\n    moveDisks(n-1, from, aux, to);\n    System.out.printf("Move disk %d from %c to %c%n", n, from, to);\n    // Second recursive call to move n-1 disks\n    moveDisks(n-1, aux, to, from);\n  }\n}';
  var tower = {
    id: 'tower', slides: [19, 24], title: 'Move n − 1, move the big one, move n − 1 again', code: HN,
    inputs: [{ id: 'n', label: 'number of disks', value: 3, min: 1, max: 4 }],
    presets: [{ label: '3 disks (slides)', values: { n: 3 } }, { label: '1 disk', values: { n: 1 } }, { label: '4 disks', values: { n: 4 } }],
    steps: function (v) {
      var n = I(v.n), moves = [], pegs = { A: [], B: [], C: [] }, st = [];
      hanoi(n, 'A', 'B', 'C', moves);
      for (var d = n; d >= 1; d--) pegs.A.push(d);
      var copy = function () { return { A: pegs.A.slice(), B: pegs.B.slice(), C: pegs.C.slice() }; };
      st.push({ slide: 19, line: 3, pegs: copy(), cap: n + ' disk' + (n > 1 ? 's' : '') + ' on tower A; move them all to B. Rule 1: never a bigger disk on a smaller one. Rule 2: move one disk at a time, always a top disk.' });
      st.push({ slide: 22, line: '8-11', pegs: copy(), plan: true, cap: 'The recursive idea: (1) move the top n − 1 disks from A to C, using B; (2) move disk n from A to B; (3) move the n − 1 disks from C to B, using A. Base case: one disk is just moved.' });
      moves.forEach(function (m, i) {
        pegs[m[1]].pop(); pegs[m[2]].push(m[0]);
        st.push({ slide: n === 3 ? (i < 3 ? 20 : 21) : 23, line: m[0] === 1 ? 5 : 9, pegs: copy(), mv: m, cap: 'Move ' + (i + 1) + ' of ' + moves.length + ': disk ' + m[0] + ' from ' + m[1] + ' to ' + m[2] + '.' + (m[0] === n && n > 1 ? ' This is the biggest disk: the middle step of the plan.' : ''), out: 'Move disk ' + m[0] + ' from ' + m[1] + ' to ' + m[2] });
      });
      st.push({ slide: 24, line: '8,11', pegs: copy(), cap: 'Done in ' + moves.length + ' moves (2<sup>' + n + '</sup> − 1). Each call with n > 1 makes <b>two</b> recursive calls, so the calls form a tree (slide 24).' });
      return st;
    },
    draw: function (k, s, v) {
      var n = I(v.n), items = [], X = { A: 100, B: 280, C: 460 };
      ['A', 'B', 'C'].forEach(function (p) {
        items.push(B('peg' + p, X[p] - 4, 90, 8, 200, { tone: s.mv && (s.mv[1] === p || s.mv[2] === p) ? 'accent' : 'muted', fill: 'solid', r: 2, z: 0 }));
        items.push(T('pl' + p, X[p], 316, p, { anchor: 'middle', bold: true, size: 15 }));
        s.pegs[p].forEach(function (d, i) { var w = 40 + d * 28; items.push(B('disk' + d, X[p] - w / 2, 262 - i * 30, w, 26, { title: String(d), mono: true, size: 12, tone: s.mv && s.mv[0] === d ? 'accent' : 'teal', fill: 'solid', r: 8, hi: s.mv && s.mv[0] === d })); });
      });
      items.push(A('base', 20, 290, 540, 290, { head: false, tone: 'muted' }));
      if (s.plan) items.push(T('p', 280, 40, '(1) n−1: A→C   (2) disk n: A→B   (3) n−1: C→B', { anchor: 'middle', mono: true, size: 13, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 6. recursion vs iteration (slide 25) ---------- */
  var versus = {
    id: 'versus', slides: [25, 25], title: 'The same factorial, with and without recursion',
    inputs: [{ id: 'n', label: 'n', value: 5, min: 0, max: 12 }],
    presets: [{ label: '5', values: { n: 5 } }, { label: '10', values: { n: 10 } }],
    code: '// recursive\npublic static long factorial(int n) {\n  if (n == 0) return 1;\n  return n * factorial(n - 1);\n}\n\n// iterative\npublic static long factorialLoop(int n) {\n  long result = 1;\n  for (int i = 2; i <= n; i++)\n    result *= i;\n  return result;\n}',
    steps: function (v) {
      var n = I(v.n);
      return [
        { line: '2-5', ph: 'rec', cap: 'Recursion is repetition <b>without a loop</b>. The recursive factorial(' + n + ') makes ' + (n + 1) + ' calls, and each one takes space on the runtime stack.' },
        { line: '8-13', ph: 'it', cap: 'Every recursive solution can be written with a loop (iteration). The loop version uses one frame and one variable, so it needs less memory and time.' },
        { line: '2-5', ph: 'when', cap: 'So use recursion for problems that are <b>naturally recursive</b>, like the Tower of Hanoi: there the recursive solution is much simpler than a loop.', out: 'factorial(' + n + ') = ' + fact(n) }
      ];
    },
    draw: function (k, s, v) {
      var n = I(v.n), items = [];
      items.push(T('t1', 140, 30, 'recursion: ' + (n + 1) + ' frames', { anchor: 'middle', size: 13, bold: true, tone: s.ph === 'rec' ? 'accent' : 'muted' }));
      for (var i = 0; i <= Math.min(n, 9); i++) items.push(B('r' + i, 40, 290 - (i + 1) * 26, 200, 22, { title: 'factorial(' + (n - i < 0 ? 0 : i) + ')', mono: true, size: 10.5, tone: s.ph === 'rec' ? 'accent' : 'teal', r: 3 }));
      items.push(T('t2', 420, 30, 'loop: 1 frame', { anchor: 'middle', size: 13, bold: true, tone: s.ph === 'it' ? 'accent' : 'muted' }));
      items.push(B('l', 320, 238, 200, 48, { title: 'factorialLoop(' + n + ')', lines: [], mono: true, size: 12, tone: s.ph === 'it' ? 'accent' : 'teal' }));
      if (s.ph === 'when') items.push(T('w', 280, 320, 'recursion for naturally recursive problems', { anchor: 'middle', size: 13, bold: true, tone: 'accent' }));
      return items;
    }
  };

  var ALL = [factorial, basecase, palin, bsearch, tower, versus];
  var para = function (t) { return { type: 'paragraph', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; },
    code = function (t, lang) { return lang ? { type: 'code', text: t, lang: lang } : { type: 'code', text: t }; }, note = function (t) { return { type: 'note', text: t }; };
  function braces(c) { var o = (c.match(/\{/g) || []).length, z = (c.match(/\}/g) || []).length; return o >= 2 && o === z; }
  var OUT = ['Recursive Factorial and the Runtime Stack', 'Characteristics of Recursion', 'Thinking Recursively and Helper Methods', 'Implementing Binary Search with Recursion', 'Solving the Tower of Hanoi with Recursion'];
  function outline(title, on, ex) { return { image: false, title: title, blocks: OUT.map(function (t, i) { return { type: 'bullet', html: i === on ? '<b>' + t + '</b>' : t, level: 0 }; }), explain: ex }; }

  addUnit({
    course: 'cs2', lesson: '09-recursion',
    blurb: 'Methods that call themselves: base cases, the runtime stack, thinking recursively with helper methods, binary search and the Tower of Hanoi.',
    parts: [
      {
        title: 'Recursive factorial and the stack', from: 1, to: 9,
        quiz: [
          { q: 'What is the base case of the recursive factorial?', options: ['factorial(0) = 1', 'factorial(1) = 0', 'factorial(n) = n'], answer: 0, why: 'Slide 3.' },
          { type: 'output', q: 'With factorial of slide 4, what does this print?', code: 'System.out.println(factorial(5));', answer: '120', why: '5 × 4 × 3 × 2 × 1.' },
          { q: 'How many calls of factorial run for factorial(3)?', options: ['4 (3, 2, 1, 0)', '3', '1'], answer: 0, why: 'The calls go down to the base case 0.' },
          { q: 'What happens to the runtime stack when a method returns?', options: ['It shrinks', 'It grows', 'Nothing'], answer: 0, why: 'Slide 9.' },
          { type: 'tf', q: 'Every recursive call to factorial has its own copy of n.', answer: true, why: 'Each call has its own space on the stack (slide 7).' }
        ]
      },
      {
        title: 'Characteristics and thinking recursively', from: 10, to: 14,
        quiz: [
          { q: 'A recursive method with no base case causes…', options: ['infinite recursion', 'a faster program', 'a compile error always'], answer: 0, why: 'Slide 12. In Java it ends with a StackOverflowError.' },
          { q: 'Each recursive call must…', options: ['make the problem smaller, closer to a base case', 'use a loop', 'return void'], answer: 0, why: 'Slide 11.' },
          { type: 'output', q: 'With isPalindrome of slide 14, what does this print?', code: 'System.out.println(isPalindrome("noon") + " " + isPalindrome("note"));', answer: 'true false', why: 'n=n, o=o; but n≠e in "note".' },
          { q: 'Why is the helper method version better?', options: ['It does not create a new substring for every call', 'It has no base case', 'It uses a loop'], answer: 0, why: 'Slide 14.' }
        ]
      },
      {
        title: 'Binary search and Tower of Hanoi', from: 15, to: 25,
        quiz: [
          { q: 'Binary search needs the array to be…', options: ['sorted', 'of Strings', 'short'], answer: 0, why: 'Slide 16.' },
          { type: 'output', q: 'With the array {1, 3, 5, 7, 9}, what does binarySearch return for target 9?', code: 'binarySearch(new int[]{1, 3, 5, 7, 9}, 9)', answer: '4', why: 'mid 2 (5) → right; mid 3 (7) → right; mid 4 (9) found.' },
          { type: 'output', q: 'And for target 4?', code: 'binarySearch(new int[]{1, 3, 5, 7, 9}, 4)', answer: '-1', why: 'The range becomes empty.' },
          { q: 'How many moves does moveDisks need for 3 disks?', options: ['7', '3', '9'], answer: 0, why: '2³ − 1 = 7.' },
          { type: 'output', q: 'What does moveDisks(2, \'A\', \'B\', \'C\') print?', code: 'moveDisks(2, \'A\', \'B\', \'C\');', answer: 'Move disk 1 from A to C\nMove disk 2 from A to B\nMove disk 1 from C to B', why: 'n − 1 to the auxiliary tower, the big disk to the target, n − 1 on top.' },
          { type: 'tf', q: 'Every recursive solution can be rewritten with a loop.', answer: true, why: 'Slide 25.' }
        ]
      }
    ],
    slides: {
      1: { image: false, blocks: [para('Recursion is a programming technique in which a method calls itself to fulfill its purpose.'), para('In some situations, a recursive method definition is an appropriate way to solve a problem.')],
        explain: '<p><b>{{Recursion|الاستدعاء الذاتي}}</b> means a method <b>calls itself</b>. It sounds strange, but it is a natural way to solve some problems: the method solves a big problem by solving a <b>smaller version of the same problem</b> first.</p><p>Think of a line of people: you want to know your place in the line, so you ask the person in front of you “what is your place?”, and add 1. They ask the person in front of them, and so on, until the first person, who simply knows: “1”.</p>' },
      2: outline('Outline', -1, '<p>The plan of this unit, the last one of the course.</p>'),
      3: { image: false, title: 'Recursive Factorial', blocks: [bul('n! = n × (n – 1) × (n – 2) × . . . × 1'), bul('n! = n × (n – 1)!   Recursive definition'), bul('0! = 1   Base case'), bul('factorial(n) = n * factorial(n-1);'), bul('factorial(0) = 1;'), bul('We can write a recursive method to compute the factorial')],
        explain: '<p>The factorial of n is n! = n × (n − 1) × … × 1. For example 4! = 4 × 3 × 2 × 1 = 24.</p><p>Look again: 4! = 4 × <b>3!</b>. In general <b>n! = n × (n − 1)!</b>: the factorial is defined with a smaller factorial. That is a <b>recursive definition</b>.</p><p>It must stop somewhere: <b>0! = 1</b>. This case is solved {{directly|مباشرة}}, with no recursion; it is called the <b>{{base case|الحالة الأساسية}}</b>.</p>' },
      4: { image: false, title: 'Recursive Factorial Method', blocks: [code(CF)], explain: '<p>The recursive definition becomes Java almost word for word:</p><pre class="ex">if (n == 0) return 1;           // base case\nreturn n * factorial(n - 1);    // recursive call</pre><p>Each call works on a smaller n, so it gets closer to 0. The return type is <b>long</b>, because {{factorials|المضروب}} grow very fast (20! is already 2432902008176640000).</p>' },
      5: { image: false, title: 'Computing the Recursive Factorial', blocks: [code('factorial(n) = n*factorial(n-1);\nfactorial(0) = 1;', 'none'), code('factorial(4)\n= 4 * factorial(3)\n= 4 * (3 * factorial(2))\n= 4 * (3 * (2 * factorial(1)))\n= 4 * (3 * ( 2 * (1 * factorial(0))))\n= 4 * (3 * ( 2 * ( 1 * 1))))\n= 4 * (3 * ( 2 * 1))\n= 4 * (3 * 2)\n= 4 * (6)\n= 24', 'none')],
        explain: '<p>How does factorial(4) get its answer? First the calls go <b>down</b> until the base case:</p><pre class="ex">factorial(4) = 4 * factorial(3)\n             = 4 * (3 * factorial(2))\n             = 4 * (3 * (2 * factorial(1)))\n             = 4 * (3 * (2 * (1 * factorial(0))))</pre><p>factorial(0) returns 1. Now the {{multiplications|عمليات ضرب}} happen on the way <b>back up</b>: 1 × 1 = 1, 2 × 1 = 2, 3 × 2 = 6, 4 × 6 = 24.</p>' },
      6: { image: false, title: 'Tracing the Recursive Calls', blocks: [para('Steps 0 to 4 execute factorial(4), factorial(3), factorial(2), factorial(1) and factorial(0). Steps 5 to 9 return 1, 1, 2, 6 and 24.')],
        explain: '<p>The picture shows the same thing as a trace of 10 steps:</p><ul><li>Steps 0-4: five calls go down, factorial(4), (3), (2), (1), (0). Each one waits for the next.</li><li>Steps 5-9: five returns come back up, with 1, 1, 2, 6 and 24.</li></ul><p>Every call waits until the call it made has returned.</p>' },
      7: { image: false, title: 'The Runtime Stack', blocks: [bul('The runtime stack is used to implement methods and recursive calls.'), bul('The runtime stack is used to allocate space for the parameters and local variables that are used in the method.'), bul('Each call to factorial(n) has its copy of the parameter n and its space on the runtime stack.'), bul('The stack grows when there is a call to a method.'), bul('The stack shrinks when a method returns to its caller.')],
        explain: '<p>How can one method have five calls running at once? Each call gets its own space on the <b>runtime stack</b> (the {{call stack|مكدّس الاستدعاءات}} of CS I unit 7), with its <b>own copy</b> of the parameter n.</p><ul><li>A call pushes a new frame: the stack <b>grows</b>.</li><li>A return removes the top frame: the stack <b>shrinks</b>.</li></ul><p>So factorial(3)’s n is 3 and factorial(2)’s n is 2, at the same time, in different frames.</p>' },
      8: { image: false, title: 'Tracing Calls on the Runtime Stack', blocks: [bul('Each call to factorial(n) allocates space on the runtime stack and has its copy of the parameter n.'), bul('The stack grows when there is a call to a method.')],
        explain: '<p>Watch the stack grow: main calls factorial(4), which calls factorial(3), … down to factorial(0). With n = 4 there are <b>six {{frames|إطارات: مساحة كل استدعاء في المكدس}}</b>: main and five factorial calls, each with its own n.</p><p class="watch">Without a base case the calls would never stop, and the stack would grow until the program crashes.</p>' },
      9: { image: false, title: 'Tracing Returns on the Runtime Stack', blocks: [bul('Each return from factorial(n) returns a result to its caller and frees space on the runtime stack.'), bul('The stack shrinks when there is a return from a method.')],
        explain: '<p>Now the stack shrinks. factorial(0) returns 1 and its frame is removed. Then factorial(1) can finish: 1 × 1 = 1. Then 2 × 1 = 2, 3 × 2 = 6, and 4 × 6 = 24 goes back to main, which prints “Factorial of 4 is 24”.</p>' },
      10: outline('Next . . .', 1, '<p>Next: what every recursive method needs.</p>'),
      11: { image: false, title: 'Characteristics of Recursion', blocks: [bul('All recursive methods have the following characteristics:'), para('One or more base cases are used to stop recursion.'), para('Every recursive call reduces the original problem, bringing it increasingly closer to a base case until it becomes that case.'), bul('To solve a problem recursively, divide it into subproblems.'), para('If a subproblem resembles the original problem, you can call the same method recursively to solve the subproblem.'), para('The subproblem is similar to the original problem in nature, but smaller in size.')],
        explain: '<p>Every recursive method has two parts:</p><ol><li>One or more <b>base cases</b> that stop the recursion: they are solved directly.</li><li>A <b>recursive call</b> on a <b>smaller</b> problem, so that each call gets closer to a base case.</li></ol><p>To find them, split the problem into <b>{{subproblems|مسائل أصغر}}</b>. If a {{subproblem|مسألة فرعية}} looks like the original problem, only smaller, call the same method to solve it.</p><pre class="ex">sum(n) = n + sum(n - 1),   sum(0) = 0</pre>' },
      12: { image: false, title: 'Infinite Recursion', blocks: [bul('All recursive methods must have a non-recursive part.'), bul('The non-recursive part is called the base case that terminates the recursive calls.'), bul('A recursive method definition without a non-recursive part causes infinite recursion.'), bul('This problem is similar to an infinite loop, because there is no way to terminate the recursive calls.')],
        explain: '<p>A recursive method <b>must</b> have a non-recursive part, the base case. Without it, or if the calls never reach it, you get <b>{{infinite recursion|استدعاء ذاتي لا نهائي}}</b>: like an infinite loop, the calls never end, and the stack overflows.</p><pre class="ex">long f(int n) {\n  if (n == 0) return 1;\n  return n * f(n + 1);    // ✗ goes away from 0: never stops\n}</pre>' },
      13: { image: false, title: 'Thinking Recursively', blocks: [bul('Many problems can be solved using recursion if you think recursively.  For example, the palindrome problem can be solved recursively as follows:'), code('public static boolean isPalindrome(String s) {\n  // Base case\n  if (s.length() <= 1) return true;\n  // Base case\n  if (s.charAt(0) != s.charAt(s.length() - 1)) return false;\n  // Recursive call\n  return isPalindrome(s.substring(1, s.length() - 1));\n}')],
        explain: '<p>Think recursively about palindromes. A string is a palindrome if:</p><ul><li>it has 0 or 1 characters (<b>base case</b>: true), or</li><li>its first and last characters are equal <b>and</b> the middle part is a palindrome.</li></ul><p>If the first and last are different, the answer is false at once (a second <b>base case</b>). Otherwise check the middle: <code>s.substring(1, s.length() - 1)</code>, a smaller string of the same problem.</p><pre class="ex">"level" → "eve" → "v" → true</pre>' },
      14: { image: false, title: 'Recursive Helper Method', blocks: [bul('The preceding isPalindrome method is not efficient, because it creates a new substring for every recursive call. To avoid creating new substrings, use a helper method:'), code('public static boolean isPalindrome(String s) {\n  return isPalindrome(s, 0, s.length() - 1);\n}\n\npublic static boolean isPalindrome(String s, int low, int high) {\n  if (low >= high) return true;                       // Base case\n  if (s.charAt(low) != s.charAt(high)) return false;  // Base case\n  return isPalindrome(s, low+1, high-1);              // Recursive call\n}')],
        explain: '<p>The first version makes a <b>new substring</b> at every call, which wastes time and memory. Better: keep the same string and move two indexes, <code>low</code> and <code>high</code>, toward the middle.</p><p>The public method <code>isPalindrome(s)</code> just starts the work by calling a <b>{{helper method|دالة مساعدة}}</b> with extra parameters: <code>isPalindrome(s, 0, s.length() - 1)</code>. The two methods have the same name but different parameters: they are <b>overloaded</b>.</p><p>The base case is now <code>low >= high</code>: the indexes have met.</p>' },
      15: outline('Next . . .', 3, '<p>Next: binary search.</p>'),
      16: { image: false, title: 'Binary Search', blocks: [bul('Binary search is a fast algorithm for searching a sorted array.'), bul('The algorithm works as follows:'), para('Search the middle element in the array'), para('Case 1: If the target is found at the middle, the search ends with a match and the method returns the index of the found element.'), para('Case 2: If the target is less than the middle element, search recursively the first half of the array.'), para('Case 3: If the target is greater than the middle element, search recursively the second half of the array.')],
        explain: '<p><b>{{Binary search|البحث الثنائي}}</b> finds a value in a <b>{{sorted|مرتّب}}</b> array very fast. Look at the middle element:</p><ol><li>It is the target: done, return its index.</li><li>The target is <b>less</b>: search only the first half.</li><li>The target is <b>greater</b>: search only the second half.</li></ol><p>Each step throws away half of the array, so even 1,000,000 elements need only about 20 steps. {{Linear|خطّي}} search (CS I unit 8) may need 1,000,000. It only works because the array is sorted.</p>' },
      17: { image: false, title: 'Recursive Binary Search', blocks: [code(BS)], explain: '<p>The recursive version uses a helper with the range <code>low</code> to <code>high</code>:</p><ul><li>Base case 1: <code>low > high</code>, the range is empty: not found, return -1.</li><li>Base case 2: <code>array[mid]</code> is the {{target|الهدف: القيمة المطلوبة}}: return mid.</li><li>Otherwise call itself on the left half (<code>low, mid-1</code>) or the right half (<code>mid+1, high</code>).</li></ul><pre class="ex">{2, 4, 6, 8, 10, 12, 14}, target 12:\nlow 0 high 6 mid 3 (8)  → go right\nlow 4 high 6 mid 5 (12) → found: 5</pre>' },
      18: outline('Next . . .', 4, '<p>Next: the Tower of Hanoi.</p>'),
      19: { image: false, title: 'Tower of Hanoi', blocks: [bul('There are n disks labeled 1, 2, 3, . . . , n, and three towers labeled A, B, and C.'), bul('All the disks are initially placed on tower A.'), bul('The goal of the Tower of Hanoi problem is to move disks from tower A to B without breaking the rules.'), bul('Rule 1: No disk can be on top of a smaller disk at any time.'), bul('Rule 2: Only one disk can be moved at a time, and it must be the top disk on the tower.')],
        explain: '<p>The <b>Tower of Hanoi</b> is a {{classic|مشهور، تقليدي}} {{puzzle|لغز}}. There are n disks of different sizes on tower A, and two more towers, B and C. Move all the disks to B, following two rules:</p><ol><li>A disk may <b>never</b> be on top of a smaller disk.</li><li>Move one disk at a time, and only the <b>top</b> disk of a tower.</li></ol><p>It looks hard, but recursion solves it in a few lines.</p>' },
      20: { image: false, title: 'Moving Three Disks', blocks: [bul('First, move the top two disks from tower A to C using tower B as auxiliary.')],
        explain: '<p>Three disks. The big disk 3 must go to B, but two disks are on top of it. So first move those top <b>two</b> disks out of the way, from A to C, using B as the free helper tower (the <b>{{auxiliary|المساعد}}</b>).</p><p>Notice: “move two disks” is the same puzzle again, just smaller.</p>' },
      21: { image: false, title: 'Moving Three Disks – cont\'d', blocks: [bul('Move disk 3 from A to B, then move the top two disks from C to B, using tower A as auxiliary.')],
        explain: '<p>Now disk 3 is free: move it from A to B. Then move the two disks from C onto B, this time using A as the helper.</p><p>Again “move two disks” is the smaller puzzle. And moving two disks needs “move one disk”, the base case.</p>' },
      22: { image: false, title: 'Recursive Solution for the Tower of Hanoi', blocks: [para('Step 1: Move the first n – 1 disks from A to C recursively.'), para('Step 2: Move disk n from A to B.'), para('Step 3: Move n – 1 disks from C to B recursively.')],
        explain: '<p>The general solution for n disks has three steps:</p><ol><li>Move the top n − 1 disks from A to C (recursively, using B).</li><li>Move disk n from A to B.</li><li>Move the n − 1 disks from C to B (recursively, using A).</li></ol><p>Steps 1 and 3 are recursive calls; step 2 is a single move. The base case: one disk is just moved.</p>' },
      23: { image: false, title: 'Recursive Method for the Tower of Hanoi', blocks: [code(HN)], explain: '<p>The three steps in Java. The towers are parameters, so the same method works for any from, to and aux:</p><pre class="ex">moveDisks(n-1, from, aux, to);   // step 1\nprint "Move disk n from … to …";  // step 2\nmoveDisks(n-1, aux, to, from);   // step 3</pre><p><code>%n</code> in printf is a new line. (The slide writes n−1 with a long dash; in code it must be the normal - sign.)</p>' },
      24: { image: false, title: 'Tracing the Execution of Tower of Hanoi', blocks: [bul('moveDisks with n = 3, from = \'A\', to = \'B\', aux = \'C\''), bul('Two recursive calls if n > 1'), code('Move disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C\nMove disk 3 from A to B\nMove disk 1 from C to A\nMove disk 2 from C to B\nMove disk 1 from A to B', 'none')],
        explain: '<p>moveDisks(3, \'A\', \'B\', \'C\') prints seven moves. The calls form a <b>tree</b>: moveDisks(3) calls moveDisks(2) twice, and each of those calls moveDisks(1) twice.</p><p>The number of moves doubles with each disk, plus one: 1 disk = 1, 2 disks = 3, 3 disks = 7, 4 disks = 15 (2<sup>n</sup> − 1). Use the drawing to watch every move for 1 to 4 disks.</p>' },
      25: { image: false, title: 'Recursion versus Iteration', blocks: [bul('Recursion is an alternative form of program control. It is essentially repetition without using a loop. Every recursive solution can be converted into an iterative solution.'), bul('Recursion has some overhead. Each time the method calls itself recursively, the system must allocate space for all its local variables and parameters on the runtime stack.'), bul('This can consume considerable memory and requires extra time to manage the additional space on the stack.'), bul('Use recursion for solving the problems that are inherently recursive in nature. The recursive solution becomes simpler.')],
        explain: '<p><b>Recursion</b> repeats with method calls; <b>{{iteration|التكرار بالحلقات}}</b> repeats with a loop. Every recursive solution can be rewritten with a loop.</p><ul><li>Recursion has a cost: each call needs space on the stack for its parameters and local variables, and time to manage it.</li><li>But for problems that are <b>naturally recursive</b>, like the Tower of Hanoi, the recursive solution is much simpler and clearer.</li></ul><p>Choose the one that makes the problem easier to understand.</p>' }
    },
    visuals: ALL,
    exam: {
      questions: [
        { q: 'A recursive method is a method that…', options: ['calls itself', 'has a loop', 'is static'], answer: 0, review: 1, why: 'Slide 1.' },
        { type: 'output', q: 'What does this print?', code: 'public static int f(int n) {\n  if (n == 0) return 0;\n  return n + f(n - 1);\n}\n// in main:\nSystem.out.println(f(4));', answer: '10', review: 5, why: '4 + 3 + 2 + 1 + 0.' },
        { type: 'output', q: 'What does this print?', code: 'public static void p(int n) {\n  if (n == 0) return;\n  System.out.print(n);\n  p(n - 1);\n}\n// in main:\np(3);', answer: '321', review: 6, why: 'Print, then call with a smaller n.' },
        { type: 'output', q: 'And this?', code: 'public static void q(int n) {\n  if (n == 0) return;\n  q(n - 1);\n  System.out.print(n);\n}\n// in main:\nq(3);', answer: '123', review: 9, why: 'The print happens on the way back up.' },
        { q: 'factorial(4) is running. How many factorial frames are on the stack at the deepest point?', options: ['5', '4', '1'], answer: 0, review: 8, why: 'factorial(4) down to factorial(0).' },
        { q: 'What is wrong?', code: 'public static int g(int n) {\n  return g(n - 1) + 1;\n}', options: ['No base case: infinite recursion', 'Nothing', 'It returns 0'], answer: 0, review: 12, why: 'There is no non-recursive part.' },
        { type: 'output', q: 'With isPalindrome of slide 14, what does this print?', code: 'System.out.println(isPalindrome("racecar"));', answer: 'true', review: 14, why: 'r=r, a=a, c=c, then low >= high.' },
        { type: 'output', q: 'With the array {2, 4, 7, 10, 11, 45, 50}, how many times does the helper binarySearch(array, target, low, high) run for 45? Count the first call too.', code: 'binarySearch(array, 45)', answer: '2', review: 17, why: 'mid 3 (10) → right half; mid 5 (45) found. Two calls of the helper.' },
        { q: 'For moveDisks(n, …) with n > 1, how many recursive calls does one call make?', options: ['2', '1', 'n'], answer: 0, review: 24, why: 'Slide 24.' },
        { q: 'Why can recursion be slower than a loop?', options: ['Each call needs space on the runtime stack', 'Java cannot optimize methods', 'Loops are always shorter'], answer: 0, review: 25, why: 'Slide 25.' },
        { type: 'fill', q: 'Complete the recursive sum: sum(n) = 1 + 2 + … + n, and sum(0) = 0.', code: 'public static int sum(int n) {\n  if (n == ___) return 0;\n  return n + sum(___);\n}', answer: ['0', 'n - 1|n-1'], review: 11, why: 'The base case stops at 0; each call works on a smaller n.' },
        { type: 'write', q: 'Write a recursive method countDown(int n) that prints n, n − 1, …, 1, one number per line, and stops when n is 0.', rows: 6, checks: [{ re: /static\s+void\s+countDown\s*\(\s*int\s+n\s*\)/, label: 'public static void countDown(int n)' }, { re: /if\s*\(\s*n\s*(==\s*0|<=\s*0|<\s*1|>\s*0|>=\s*1|!=\s*0)\s*\)/, label: 'a base case test on n, like if (n == 0) return;' }, { re: /System\s*\.\s*out\s*\.\s*println\s*\(\s*n\s*\)\s*;/, label: 'System.out.println(n);' }, { re: /countDown\s*\(\s*n\s*-\s*1\s*\)\s*;/, label: 'countDown(n - 1);' }], solution: 'public static void countDown(int n) {\n  if (n == 0) return;\n  System.out.println(n);\n  countDown(n - 1);\n}', review: 11, why: 'Print first, then call on the smaller problem; n == 0 is the base case.' },
        { type: 'trace', q: 'binarySearch(new int[]{3, 9, 14, 20, 27, 31, 40, 52}, 9). Fill in each call.', cols: ['call', 'low', 'high', 'mid'], rows: [['1st', '0', '7', '?3'], ['2nd', '?0', '?2', '?1']], review: 17, why: 'mid 3 holds 20 and 9 < 20, so search the left half (0 to 2). mid 1 holds 9: found, it returns 1.' },
        { type: 'bug', q: 'down(3) never stops. Tap the wrong line.', code: 'public static int down(int n) {\n  if (n == 0) return 0;\n  return n + down(n);\n}', answer: 3, review: 12, why: 'down(n) calls itself with the same n, so it never gets closer to the base case. It should be down(n - 1).' },
        { type: 'output', q: 'With moveDisks of slide 23, what does this print?', code: 'moveDisks(2, \'A\', \'C\', \'B\');', answer: 'Move disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C', review: 23, why: 'Move disk 1 out of the way to the helper B, move disk 2 to C, then put disk 1 on top of it.' },
        { type: 'tf', q: 'A recursive method without a base case runs forever without any problem.', answer: false, review: 12, why: 'It is infinite recursion: every call takes stack space, so the program crashes.' }
      ],
      tasks: [
        {
          title: 'Recursive sum of digits',
          task: '<p>Write <code>public static int sumDigits(int n)</code> <b>recursively</b> (no loop): if n is less than 10 return n (base case); otherwise return <code>n % 10 + sumDigits(n / 10)</code>.</p>',
          starter: 'public class Digits {\n  public static void main(String[] args) {\n    System.out.println(sumDigits(1234));\n  }\n\n}',
          output: '10',
          checks: [
            { re: /public\s+static\s+int\s+sumDigits\s*\(\s*int\s+\w+\s*\)/, label: 'Header: <code>public static int sumDigits(int n)</code>', review: 4 },
            { re: /if\s*\(\s*\w+\s*<\s*10\s*\)\s*return\s+\w+\s*;/, label: 'Base case: <code>if (n < 10) return n;</code>', review: 11 },
            { re: /return\s+\w+\s*%\s*10\s*\+\s*sumDigits\s*\(\s*\w+\s*\/\s*10\s*\)\s*;/, label: 'Recursive call on <code>n / 10</code>', review: 11 },
            { fn: function (c) { return !/\b(for|while)\s*\(/.test(c); }, label: 'No loop: recursion only', review: 25 }
          ],
          solution: 'public class Digits {\n  public static void main(String[] args) {\n    System.out.println(sumDigits(1234));\n  }\n\n  public static int sumDigits(int n) {\n    if (n < 10) return n;\n    return n % 10 + sumDigits(n / 10);\n  }\n}'
        },
        {
          title: 'Recursive power',
          task: '<p>Write <code>public static long power(int base, int exp)</code> recursively: power(b, 0) is 1, and power(b, e) is b × power(b, e − 1).</p>',
          starter: 'public class Power {\n  public static void main(String[] args) {\n    System.out.println(power(2, 10));\n  }\n\n}',
          output: '1024',
          checks: [
            { re: /public\s+static\s+long\s+power\s*\(\s*int\s+\w+\s*,\s*int\s+\w+\s*\)/, label: 'Header: <code>public static long power(int base, int exp)</code>', review: 4 },
            { re: /if\s*\(\s*\w+\s*==\s*0\s*\)\s*return\s+1\s*;/, label: 'Base case: exponent 0 returns 1', review: 3 },
            { re: /return\s+\w+\s*\*\s*power\s*\(\s*\w+\s*,\s*\w+\s*-\s*1\s*\)\s*;/, label: 'Recursive call with <code>exp - 1</code>', review: 11 },
            { fn: function (c) { return !/\b(for|while)\s*\(/.test(c); }, label: 'No loop', review: 25 }
          ],
          solution: 'public class Power {\n  public static void main(String[] args) {\n    System.out.println(power(2, 10));\n  }\n\n  public static long power(int base, int exp) {\n    if (exp == 0) return 1;\n    return base * power(base, exp - 1);\n  }\n}'
        }
      ]
    }
  });
})();
