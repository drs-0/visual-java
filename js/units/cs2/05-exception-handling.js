/* CS2 · Unit 5 · Exception Handling (42 slides): runtime errors, the quotient examples, throw / try / catch,
   InputMismatchException, the exception class tree, checked vs unchecked, declaring, throwing and catching,
   getMessage and toString, finally (three cases), when to use exceptions, rethrowing, and a custom exception class */
(function () {
  function mix(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }
  function I(x) { return Math.trunc(x); }
  function jint(a, b) { return Math.trunc(a / b); }
  function h(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function vbox(id, x, y, w, name, type, value, o) {
    return B(id, x, y, w, 48, mix({ tag: type + ' ' + name, title: value == null ? 'no value' : String(value), mono: true, size: 15, tone: value == null ? 'muted' : 'teal', dash: value == null, r: 6 }, o || {}));
  }
  function hot(o) { return mix(o || {}, { tone: 'accent', hi: true }); }
  /* the path the program takes: a list of code rows, the current one marked; skipped rows are struck */
  function flow(p, x, y, w, rows, o) {
    o = o || {};
    return rows.map(function (r, i) {
      var st = (o.state && o.state[i]) || 'wait';
      return B(p + i, x, y + i * (o.gap || 38), w, (o.gap || 38) - 6, { title: r, mono: true, size: o.size || 12, align: 'left', r: 4,
        tone: st === 'on' ? 'accent' : st === 'done' ? 'teal' : st === 'skip' ? 'muted' : st === 'err' ? 'red' : 'blue', hi: st === 'on' || st === 'err', dash: st === 'skip' });
    });
  }

  /* ---------- 1. quotient: crash, if, and System.exit (slides 3-7) ---------- */
  var Q1 = 'import java.util.Scanner;\n\npublic class Quotient {\n  public static void main(String[] args) {\n    Scanner input = new Scanner(System.in);\n\n    // Prompt the user to enter two integers\n    System.out.print("Enter two integers: ");\n    int number1 = input.nextInt();\n    int number2 = input.nextInt();\n\n    System.out.println(number1 + " / " + number2 + " is " +\n      (number1 / number2));\n  }\n}';
  var quotient = {
    id: 'quotient', slides: [3, 7], title: 'Dividing by zero stops the program',
    code: Q1 + '\n\n// Slide 5: QuotientWithIf (the end of main)\nif (number2 != 0)\n  System.out.println(number1 + " / " + number2\n    + " is " + (number1 / number2));\nelse\n  System.out.println("Divisor cannot be zero ");\n\n// Slide 6: QuotientWithMethod\npublic static int quotient(int number1, int number2) {\n  if (number2 == 0) {\n    System.out.println("Divisor cannot be zero");\n    System.exit(1);\n  }\n  return number1 / number2;\n}',
    inputs: [{ id: 'a', label: 'number1', value: 3, min: -999, max: 999 }, { id: 'b', label: 'number2', value: 0, min: -999, max: 999 }],
    presets: [{ label: '3 0 (slide)', values: { a: 3, b: 0 } }, { label: '7 2', values: { a: 7, b: 2 } }, { label: '-9 4', values: { a: -9, b: 4 } }],
    steps: function (v) {
      var a = I(v.a), b = I(v.b), z = b === 0, st = [
        { slide: 3, line: 13, ph: 'what', cap: 'An <b>exception</b> is a runtime error: the JVM finds an operation it cannot do. Examples: integer division by 0 (ArithmeticException), a double typed when an int is expected (InputMismatchException), a bad array index (ArrayIndexOutOfBoundsException).' },
        { slide: 4, line: '8-10', ph: 'read', cap: 'The user types ' + a + ' and ' + b + '.', out: 'Enter two integers: ' + a + ' ' + b }
      ];
      if (z) st.push({ slide: 4, line: '12-13', ph: 'crash', cap: number1Is(a) + ' / 0 is impossible for integers. The JVM throws an <b>ArithmeticException</b> and, because nothing catches it, the program <b>terminates</b> with this message.', out: ['Exception in thread "main" java.lang.ArithmeticException: / by zero', 'at Quotient.main(Quotient.java:13)'] });
      else st.push({ slide: 4, line: '12-13', ph: 'ok', cap: 'number2 is not 0, so the division works: ' + a + ' / ' + b + ' = ' + jint(a, b) + ' (integer division).', out: a + ' / ' + b + ' is ' + jint(a, b) });
      st.push({ slide: 5, line: '18-22', ph: 'if', z: z, cap: 'QuotientWithIf: test <code>if (number2 != 0)</code> first. ' + (z ? 'Here it is 0, so it prints “Divisor cannot be zero” instead of crashing.' : 'Here it is not 0, so it divides as before.') });
      st.push({ slide: 6, line: '26-28', ph: 'exit', z: z, cap: 'QuotientWithMethod: the test moves into a method quotient. When number2 is 0 it prints a message and calls <code>System.exit(1)</code>: the <b>whole program</b> ends.' });
      st.push({ slide: 7, line: 28, ph: 'why', cap: 'That is a problem: a method should not decide to stop the program. Only the <b>caller</b> knows what to do. Java lets the method <b>throw</b> an exception that the caller can <b>catch</b>.' });
      return st;
      function number1Is(x) { return String(x); }
    },
    draw: function (k, s, v) {
      var ph = s.ph, items = [];
      if (ph === 'what') {
        [['10 / 0', 'ArithmeticException'], ['nextInt() reads 3.5', 'InputMismatchException'], ['a[10] in a[5]', 'ArrayIndexOutOfBoundsException']].forEach(function (r, i) {
          items.push(B('w' + i, 20, 30 + i * 90, 200, 50, { title: r[0], mono: true, size: 13, tone: 'blue' }), A('a' + i, 224, 55 + i * 90, 286, 55 + i * 90, { tone: 'red' }), B('e' + i, 290, 30 + i * 90, 250, 50, { title: r[1], mono: true, size: 11.5, tone: 'red' }));
        });
        return items;
      }
      items.push(vbox('n1', 20, 30, 130, 'number1', 'int', I(v.a), {}), vbox('n2', 170, 30, 130, 'number2', 'int', I(v.b), I(v.b) === 0 ? { tone: 'red' } : {}));
      if (ph === 'crash') items.push(B('boom', 60, 140, 440, 80, { title: 'ArithmeticException: / by zero', lines: ['nobody catches it → program terminates'], mono: true, size: 14, lsize: 12, tone: 'red', hi: true }));
      if (ph === 'ok') items.push(B('res', 60, 140, 440, 60, { title: I(v.a) + ' / ' + I(v.b) + ' = ' + jint(I(v.a), I(v.b) || 1), mono: true, size: 16, tone: 'teal', hi: true }));
      if (ph === 'if') items.push(B('d', 160, 120, 240, 80, { shape: 'diamond', title: 'number2 != 0', mono: true, size: 12.5, tone: s.z ? 'red' : 'teal', hi: true }), T('t', 280, 240, s.z ? '→ "Divisor cannot be zero"' : '→ divide', { anchor: 'middle', mono: true, size: 14, bold: true, tone: s.z ? 'red' : 'teal' }));
      if (ph === 'exit') items.push(B('m', 60, 120, 200, 80, { title: 'quotient(…)', lines: ['System.exit(1);'], mono: true, size: 13, lsize: 12, tone: 'accent', hi: s.z }), A('x', 264, 160, 330, 160, { tone: 'red' }), B('end', 334, 130, 200, 60, { title: 'whole program ends', size: 13, tone: s.z ? 'red' : 'muted' }));
      if (ph === 'why') items.push(B('m', 40, 130, 200, 70, { title: 'method', lines: ['finds the error'], size: 14, lsize: 12, tone: 'blue' }), A('th', 244, 150, 316, 150, { tone: 'red', label: 'throw' }), B('c', 320, 130, 200, 70, { title: 'caller', lines: ['decides what to do'], size: 14, lsize: 12, tone: 'teal' }), A('ca', 316, 180, 244, 180, { tone: 'teal', label: 'catch', ly: 26 }));
      return items;
    }
  };

  /* ---------- 2. throw and catch (slides 8-11) ---------- */
  var QE = 'public static int quotient(int number1, int number2) {\n  if (number2 == 0)\n    throw new ArithmeticException("Divisor cannot be zero");\n\n  return number1 / number2;\n}\n\npublic static void main(String[] args) {\n  ...\n  try {\n    int result = quotient(number1, number2);\n    System.out.println(number1 + " / " + number2 + " is "\n      + result);\n  }\n  catch (ArithmeticException ex) {\n    System.out.println("Exception: an integer " +\n      "cannot be divided by zero ");\n  }\n\n  System.out.println("Execution continues ...");\n}';
  var trycatch = {
    id: 'trycatch', slides: [8, 11], title: 'throw in the method, catch in the caller', code: QE,
    inputs: [{ id: 'a', label: 'number1', value: 5, min: -999, max: 999 }, { id: 'b', label: 'number2', value: 0, min: -999, max: 999 }],
    presets: [{ label: '5 0 (exception)', values: { a: 5, b: 0 } }, { label: '5 3 (no exception)', values: { a: 5, b: 3 } }],
    steps: function (v) {
      var a = I(v.a), b = I(v.b), z = b === 0, R = ['try: result = quotient(…)', 'println(… result)', 'catch (ArithmeticException ex)', 'println("Execution continues ...")'];
      var st = [{ slide: 9, line: 11, rows: R, state: ['on'], cap: 'The <b>try</b> block holds the normal code. It calls quotient(' + a + ', ' + b + ').' }];
      if (z) {
        st.push({ slide: 8, line: '2-3', rows: R, state: ['err'], cap: 'number2 is 0, so quotient <b>throws</b>: <code>throw new ArithmeticException("Divisor cannot be zero")</code>. The exception is an <b>object</b>; its constructor gets a message string. The method stops at once, with no return value.' });
        st.push({ slide: 9, line: 15, rows: R, state: ['err', 'skip', 'on'], cap: 'The normal flow is interrupted: the rest of the try block is <b>skipped</b>, and the matching <b>catch</b> block runs.', out: 'Exception: an integer cannot be divided by zero ' });
      } else {
        st.push({ slide: 9, line: '5,11', rows: R, state: ['done'], cap: 'No problem: quotient returns ' + jint(a, b) + '.' });
        st.push({ slide: 9, line: '12-13', rows: R, state: ['done', 'on', 'skip'], cap: 'The try block finishes, and the catch block is <b>skipped</b>.', out: a + ' / ' + b + ' is ' + jint(a, b) });
      }
      st.push({ slide: 10, line: 20, rows: R, state: z ? ['err', 'skip', 'done', 'on'] : ['done', 'done', 'skip', 'on'], cap: 'Either way, the program goes on after try-catch. It did not crash.', out: 'Execution continues ...' });
      st.push({ line: '3,15', slide: 11, rows: R, state: z ? ['err', 'skip', 'done', 'done'] : ['done', 'done', 'skip', 'done'], cap: 'The big advantage: <b>detecting</b> the error (in the called method) is separated from <b>handling</b> it (in the caller). Library methods work this way: they detect, you decide.' });
      return st;
    },
    draw: function (k, s) { return flow('r', 60, 40, 440, s.rows, { state: s.state, gap: 60, size: 13 }); }
  };

  /* ---------- 3. InputMismatchException in a loop (slide 12) ---------- */
  var IM = 'Scanner input = new Scanner(System.in);\nboolean continueInput = true;\n\ndo {\n  try {\n    System.out.print("Enter an integer: ");\n    int number = input.nextInt();\n\n    // Display the result\n    System.out.println(\n      "The number entered is " + number);\n\n    continueInput = false;\n  }\n  catch (InputMismatchException ex) {\n    System.out.println("Try again. (" +\n      "Incorrect input: an integer is required)");\n    input.nextLine(); // Discard input\n  }\n} while (continueInput);';
  var mismatch = {
    id: 'mismatch', slides: [12, 12], title: 'Ask again until the input is an int', code: IM,
    inputs: [{ id: 't', type: 'text', label: 'typed lines (split by ;)', value: '3.5; abc; 4', maxlen: 40 }],
    presets: [{ label: '3.5; abc; 4', values: { t: '3.5; abc; 4' } }, { label: '7 at once', values: { t: '7' } }, { label: '-2.0; 12', values: { t: '-2.0; 12' } }],
    steps: function (v) {
      var tries = String(v.t).split(';').map(function (x) { return x.trim(); }).filter(Boolean), st = [], done = false;
      if (!tries.length) tries = ['0'];
      tries.forEach(function (t, i) {
        if (done) return;
        var ok = /^[+-]?\d+$/.test(t);
        if (ok) { st.push({ line: '6-13', t: t, ok: true, n: i + 1, cap: 'Try ' + (i + 1) + ': "' + h(t) + '" is an int, so nextInt works, it is printed, and continueInput becomes false: the loop ends.', out: ['Enter an integer: ' + t, 'The number entered is ' + Number(t)] }); done = true; }
        else st.push({ line: '7,15-18', t: t, ok: false, n: i + 1, cap: 'Try ' + (i + 1) + ': "' + h(t) + '" is not an int, so nextInt throws an <b>InputMismatchException</b>. The catch block prints a message and calls <code>input.nextLine()</code> to throw away the bad input. continueInput is still true: ask again.', out: ['Enter an integer: ' + t, 'Try again. (Incorrect input: an integer is required)'] });
      });
      if (!done) st.push({ line: 20, t: '', ok: false, n: tries.length, cap: 'No valid int has been typed yet, so the loop would keep asking.' });
      return st;
    },
    draw: function (k, s) {
      return [
        B('in', 30, 40, 200, 60, { tag: 'try ' + s.n, title: '"' + s.t + '"', mono: true, size: 16, tone: s.ok ? 'teal' : 'red', hi: true }),
        A('a', 234, 70, 296, 70, { tone: s.ok ? 'teal' : 'red', label: 'nextInt()' }),
        B('r', 300, 40, 240, 60, { title: s.ok ? 'number = ' + s.t : 'InputMismatchException', mono: true, size: s.ok ? 15 : 12, tone: s.ok ? 'teal' : 'red', hi: true }),
        vbox('ci', 30, 170, 220, 'continueInput', 'boolean', s.ok ? 'false' : 'true', s.ok ? hot({ tone: 'teal' }) : {}),
        T('loop', 280, 280, s.ok ? 'loop ends' : 'loop again →', { anchor: 'middle', size: 15, bold: true, tone: s.ok ? 'teal' : 'accent' })
      ];
    }
  };

  /* ---------- 4. the exception class tree (slides 14-18) ---------- */
  var TREE = [['Object', 10, 150, 'muted'], ['Throwable', 110, 150, 'blue'], ['Exception', 240, 90, 'blue'], ['Error', 240, 250, 'red'], ['ClassNotFound', 390, 20, 'blue'], ['IOException', 390, 60, 'blue'], ['RuntimeException', 390, 110, 'teal'], ['LinkageError', 390, 230, 'red'], ['VirtualMachineError', 390, 270, 'red']];
  var RT = ['ArithmeticException', 'NullPointerException', 'IndexOutOfBounds', 'IllegalArgument'];
  var tree = {
    id: 'tree', slides: [14, 18], title: 'The family of exceptions',
    steps: [
      { slide: 14, ph: 'root', cap: 'Exceptions are <b>classes</b>. The root is <code>java.lang.Throwable</code>; every exception that is thrown is an object of one of its subclasses.' },
      { slide: 14, ph: 'exc', cap: '<b>Exception</b>: caused by your program or by outside circumstances (a missing file, bad input). These can be caught and handled.' },
      { slide: 14, ph: 'err', cap: '<b>Error</b>: an internal system error of the JVM, like LinkageError or VirtualMachineError. Rare, but it ends the program.' },
      { slide: 15, ph: 'rt', cap: '<b>RuntimeException</b>: programming errors: ArithmeticException (divide by 0), NullPointerException (using a null reference), IndexOutOfBoundsException (bad index), IllegalArgumentException (a bad argument).' },
      { slide: 16, ph: 'unch', cap: '<b>Unchecked</b> exceptions: RuntimeException, Error and their subclasses. They usually mean a logic error to fix, and can happen anywhere, so Java does <b>not</b> force you to catch them.' },
      { slide: 16, ph: 'chk', cap: 'All the others (like IOException, ClassNotFoundException) are <b>checked</b>: the compiler forces you to deal with them (catch or declare).' }
    ],
    draw: function (k, s) {
      var ph = s.ph, items = [];
      function tone(n, t) {
        if (ph === 'root') return n === 'Throwable' ? 'accent' : 'muted';
        if (ph === 'exc') return n === 'Exception' || n === 'ClassNotFound' || n === 'IOException' || n === 'RuntimeException' ? 'blue' : 'muted';
        if (ph === 'err') return t === 'red' ? 'red' : 'muted';
        if (ph === 'rt') return n === 'RuntimeException' ? 'teal' : 'muted';
        if (ph === 'unch') return n === 'RuntimeException' || t === 'red' ? 'accent' : 'muted';
        if (ph === 'chk') return n === 'ClassNotFound' || n === 'IOException' || n === 'Exception' ? 'accent' : 'muted';
        return t;
      }
      TREE.forEach(function (n) { items.push(B('t' + n[0], n[1], n[2], n[0].length > 13 ? 150 : 110, 32, { title: n[0], mono: true, size: n[0].length > 15 ? 9.5 : 11, tone: tone(n[0], n[3]), r: 4 })); });
      items.push(A('l1', 110, 166, 92, 166, { tone: 'muted' }), A('l2', 240, 106, 222, 160, { tone: 'muted' }), A('l3', 240, 266, 222, 172, { tone: 'muted' }));
      [20, 60, 110].forEach(function (y, i) { items.push(A('e' + i, 390, y + 16, 352, 106, { tone: 'muted', head: i === 0 })); });
      [230, 270].forEach(function (y, i) { items.push(A('r' + i, 390, y + 16, 352, 266, { tone: 'muted' })); });
      if (ph === 'rt' || ph === 'unch') RT.forEach(function (n, i) { items.push(B('rt' + i, 20 + i * 135, 310, 130, 26, { title: n, mono: true, size: 9, tone: ph === 'rt' ? 'teal' : 'accent', r: 3 })); });
      return items;
    }
  };

  /* ---------- 5. declare, throw, catch across methods (slides 20-25) ---------- */
  var propagate = {
    id: 'propagate', slides: [20, 25], title: 'Who catches it?',
    inputs: [{ id: 'e', label: 'exception type (1-4)', value: 2, min: 1, max: 4 }],
    presets: [{ label: 'Exception3', values: { e: 3 } }, { label: 'Exception2', values: { e: 2 } }, { label: 'Exception1', values: { e: 1 } }, { label: 'none of them', values: { e: 4 } }],
    steps: function (v) {
      var e = I(v.e), names = ['main', 'method1', 'method2'], catcher = e === 3 ? 2 : e === 2 ? 1 : e === 1 ? 0 : -1;
      var st = [
        { slide: 20, ph: 'dtc', cap: 'Three parts: method2 <b>declares</b> it may throw (<code>throws Exception</code>), <b>throws</b> it when an error occurs (<code>throw new Exception()</code>), and method1 <b>catches</b> it in a try-catch.' },
        { slide: 21, ph: 'decl', cap: '<b>Declaring</b>: <code>public void method() throws IOException</code>. Several types are separated by commas: <code>throws Exception1, Exception2, …</code>' },
        { slide: 22, ph: 'throw', cap: '<b>Throwing</b>: create an exception object and throw it: <code>if (radius <= 0) throw new IllegalArgumentException("Radius must be positive");</code> The string is the exception message.' },
        { slide: 23, ph: 'multi', cap: 'A try can have <b>several catch</b> blocks. If nothing is thrown, all are skipped. If a statement throws, the rest of the try is skipped and the first matching catch runs.' },
        { slide: 24, ph: 'chain', at: 3, cap: 'main calls method1, which calls method2, which calls method3. method3 throws ' + (e < 4 ? 'an Exception' + e : 'an exception none of them catches') + '.' }
      ];
      for (var m = 2; m >= 0; m--) {
        if (m > catcher) st.push({ slide: 24, ph: 'chain', at: m, abort: true, cap: names[m] + ' has no matching catch, so it is <b>aborted</b> and the exception goes up to its caller.' });
        else { st.push({ slide: 24, ph: 'chain', at: m, caught: true, cap: names[m] + ' catches it: ' + ['statement1 is skipped and statement2 runs', 'statement3 is skipped and statement4 runs', 'statement5 is skipped and statement6 runs'][m] + '.' }); break; }
      }
      if (catcher < 0) st.push({ slide: 24, ph: 'chain', at: -1, cap: 'Nobody caught it, so the program <b>terminates</b>.' });
      st.push({ slide: 25, ph: 'chk', cap: 'For a <b>checked</b> exception the compiler insists: if p2 declares <code>throws IOException</code>, the caller p1 must either call p2 in a try-catch, or declare <code>throws IOException</code> itself.' });
      return st;
    },
    draw: function (k, s, v) {
      var items = [], ph = s.ph;
      if (ph !== 'chain') {
        var t = { dtc: ['method1: try { method2(); } catch (Exception ex)', 'method2() throws Exception', 'throw new Exception();'], decl: ['void method() throws IOException', 'throws Exception1, Exception2, ...'], throw: ['if (radius <= 0)', '  throw new IllegalArgumentException(', '    "Radius must be positive");'], multi: ['try { statements; }', 'catch (Exception1 ex1) { ... }', 'catch (Exception2 ex2) { ... }', 'catch (ExceptionN exN) { ... }'], chk: ['void p1() { try { p2(); } catch (IOException ex) { } }', '   or', 'void p1() throws IOException { p2(); }'] }[ph];
        items.push(B('c', 20, 50, 520, boxH(t.length), { lines: t, mono: true, lsize: 13, tone: 'blue' }));
        return items;
      }
      var e = I(v.e);
      ['main', 'method1', 'method2', 'method3'].forEach(function (n, i) {
        var x = 10 + i * 137, on = s.at === i;
        items.push(B('m' + i, x, 60, 127, 120, { title: n, lines: i < 3 ? ['try {', '  invoke ' + ['method1', 'method2', 'method3'][i], '} catch (Exception' + (i + 1) + ')'] : ['throws', e < 4 ? 'Exception' + e : 'ExceptionX'], mono: true, size: 13, lsize: 9.5, tone: on ? (s.caught ? 'teal' : s.abort ? 'red' : 'accent') : s.at < i && s.at >= -1 && i < 3 ? 'muted' : 'blue', hi: on, dash: s.at < i && i < 3 }));
        if (i) items.push(A('a' + i, x - 8, 120, x - 2, 120, { tone: 'muted' }));
      });
      if (s.at === -1) items.push(T('term', 280, 250, 'not caught → program terminates', { anchor: 'middle', size: 16, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* ---------- 6. getMessage and toString (slides 27-29) ---------- */
  var TCE = 'public class TestCircleWithException {\n  public static void main(String[] args) {\n    try {\n      CircleWithException c1 = new CircleWithException(5);\n      CircleWithException c2 = new CircleWithException(-5);\n      CircleWithException c3 = new CircleWithException(2);\n    }\n    catch (IllegalArgumentException ex) {\n      System.out.println(ex.getMessage());\n    }\n\n    System.out.println("Number of objects created: " +\n                       CircleWithException.getNumberOfObjects());\n  }\n}';
  var info = {
    id: 'info', slides: [27, 29], title: 'What an exception object tells you', code: TCE,
    steps: [
      { line: 9, slide: 27, ph: 'uml', cap: 'Throwable’s methods: <code>getMessage()</code> returns the message; <code>toString()</code> returns the full class name, ": " and the message; <code>printStackTrace()</code> prints the object and the call stack.' },
      { line: 5, slide: 28, ph: 'set', cap: 'In CircleWithException, setRadius throws <code>new IllegalArgumentException("Radius cannot be negative")</code> for a negative radius. The constructor calls setRadius, then counts the object.' },
      { slide: 29, line: 4, ph: 'c1', n: 1, cap: 'c1 with radius 5: fine. numberOfObjects = 1.' },
      { slide: 29, line: 5, ph: 'c2', n: 1, cap: 'c2 with radius −5: setRadius throws, so the constructor stops <b>before</b> numberOfObjects++. The c3 line is skipped.' },
      { slide: 29, line: '8-9', ph: 'catch', n: 1, cap: 'The catch prints <code>ex.getMessage()</code>, only the message. (<code>System.out.println(ex)</code> would use toString: “java.lang.IllegalArgumentException: Radius cannot be negative”.)', out: 'Radius cannot be negative' },
      { slide: 29, line: '12-13', ph: 'count', n: 1, cap: 'Only one object was created.', out: 'Number of objects created: 1' }
    ],
    draw: function (k, s) {
      if (s.ph === 'uml') return [B('u', 100, 30, 360, boxH(4), { title: 'java.lang.Throwable', band: true, mono: true, lsize: 12.5, lines: ['+getMessage(): String', '+toString(): String', '+printStackTrace(): void', '+getStackTrace(): StackTraceElement[]'], tone: 'blue' })];
      if (s.ph === 'set') return [B('s', 40, 40, 480, boxH(4), { lines: ['public void setRadius(double newRadius)', '    throws IllegalArgumentException {', '  if (newRadius >= 0) radius = newRadius;', '  else throw new IllegalArgumentException("Radius cannot be negative");'], mono: true, lsize: 11, tone: 'accent' })];
      var items = flow('r', 40, 30, 280, ['new CircleWithException(5)', 'new CircleWithException(-5)', 'new CircleWithException(2)', 'catch: println(ex.getMessage())'], { state: { c1: ['on'], c2: ['done', 'err'], catch: ['done', 'err', 'skip', 'on'], count: ['done', 'err', 'skip', 'done'] }[s.ph], gap: 56, size: 11.5 });
      items.push(vbox('n', 360, 60, 180, 'numberOfObjects', 'static int', s.n, {}));
      return items;
    }
  };

  /* ---------- 7. finally: three cases (slides 31-34) ---------- */
  var FIN = 'try {\n  statement1;\n  statement2;\n  statement3;\n}\ncatch (ExceptionType ex) {\n  handling ex;\n}\nfinally {\n  finalStatements;\n}\nnextStatements;';
  var finallyv = {
    id: 'finallyv', slides: [31, 34], title: 'finally always runs', code: FIN,
    inputs: [{ id: 'c', label: 'case (1 = no exception, 2 = caught, 3 = not caught)', value: 2, min: 1, max: 3 }],
    presets: [{ label: 'Case 1: no exception', values: { c: 1 } }, { label: 'Case 2: caught', values: { c: 2 } }, { label: 'Case 3: not caught', values: { c: 3 } }],
    steps: function (v) {
      var c = I(v.c), R = ['statement1', 'statement2', 'statement3', 'catch: handling ex', 'finally: finalStatements', 'nextStatements'];
      var S = [];
      S.push({ slide: 31, line: '9-11', st: [], cap: 'The <b>finally</b> block runs whether or not an exception happens, and whether or not it is caught. Use it for work that must always be done.' });
      if (c === 1) {
        S.push({ slide: 32, line: '2-4', st: ['done', 'done', 'on'], cap: 'Case 1: no exception arises in the try block.' });
        S.push({ slide: 32, line: '6-10', st: ['done', 'done', 'done', 'skip', 'on'], cap: 'The catch block is skipped; the finally block is executed.' });
        S.push({ slide: 32, line: 12, st: ['done', 'done', 'done', 'skip', 'done', 'on'], cap: 'nextStatements run.' });
      } else if (c === 2) {
        S.push({ slide: 33, line: 3, st: ['done', 'err'], cap: 'Case 2: statement2 causes an exception of ExceptionType.' });
        S.push({ slide: 33, line: '4,7', st: ['done', 'err', 'skip', 'on'], cap: 'statement3 is skipped; the catch block is executed.' });
        S.push({ slide: 33, line: 10, st: ['done', 'err', 'skip', 'done', 'on'], cap: 'Then the finally block is executed.' });
        S.push({ slide: 33, line: 12, st: ['done', 'err', 'skip', 'done', 'done', 'on'], cap: 'nextStatements run: the method continues normally.' });
      } else {
        S.push({ slide: 34, line: 3, st: ['done', 'err'], cap: 'Case 3: statement2 causes a <b>different</b> exception, one the catch does not match.' });
        S.push({ slide: 34, line: '4,7', st: ['done', 'err', 'skip', 'skip'], cap: 'statement3 is skipped, and the catch block is skipped too.' });
        S.push({ slide: 34, line: 10, st: ['done', 'err', 'skip', 'skip', 'on'], cap: 'The finally block is <b>still</b> executed.' });
        S.push({ slide: 34, line: 12, st: ['done', 'err', 'skip', 'skip', 'done', 'skip'], cap: 'nextStatements are skipped, and the exception is passed to the caller.' });
      }
      S.forEach(function (x) { x.rows = R; });
      return S;
    },
    draw: function (k, s) { return flow('r', 100, 20, 360, s.rows, { state: s.st, gap: 50, size: 13 }); }
  };

  /* ---------- 8. when to use exceptions, rethrow (slides 36-38) ---------- */
  var when = {
    id: 'when', slides: [36, 38], title: 'Exceptions for the unexpected, if for the simple',
    code: 'try\n  System.out.println(refVar.toString());\ncatch (NullPointerException ex)\n  System.out.println("refVar is null");\n\n// is better written as:\nif (refVar != null)\n  System.out.println(refVar.toString());\nelse\n  System.out.println("refVar is null");\n\ntry {\n  statements;\n}\ncatch (ExceptionType ex) {\n  perform operations before rethrowing the exception;\n  throw ex;  // Rethrow the exception ex\n}',
    steps: [
      { line: '7-10', slide: 36, ph: 'rule', cap: 'Throw an exception when the <b>caller</b> must handle the error. If the method itself can handle it, no exception is needed. Use try-catch for <b>unexpected</b> errors, not for simple ones.' },
      { slide: 37, line: '1-10', ph: 'if', cap: 'A null reference can be tested with a simple if. That is clearer (and faster) than catching NullPointerException. (The slide’s try/catch has no braces; real try and catch blocks always need { }.)' },
      { slide: 38, line: '12-18', ph: 're', cap: '<b>Rethrowing</b>: a handler can do some work and then <code>throw ex;</code> again, so its caller is also told and gets a chance to handle it.' }
    ],
    draw: function (k, s) {
      if (s.ph === 'rule') return [B('a', 30, 50, 240, 120, { title: 'use try-catch', lines: ['unexpected errors', 'the caller must decide'], size: 14, lsize: 12.5, tone: 'accent' }), B('b', 290, 50, 240, 120, { title: 'use if-else', lines: ['simple, expected cases', 'like a null check'], size: 14, lsize: 12.5, tone: 'teal' })];
      if (s.ph === 'if') return [B('a', 30, 50, 240, 120, { tag: 'not good', lines: ['try …', 'catch (NullPointer…)'], mono: true, lsize: 12.5, tone: 'red' }), B('b', 290, 50, 240, 120, { tag: 'better', lines: ['if (refVar != null)', '  … refVar.toString()', 'else', '  "refVar is null"'], mono: true, lsize: 12.5, tone: 'teal', hi: true })];
      return [B('h', 40, 60, 220, 90, { title: 'catch (ExceptionType ex)', lines: ['do some work', 'throw ex;'], mono: true, size: 12, lsize: 12.5, tone: 'accent', hi: true }), A('up', 264, 105, 326, 105, { tone: 'red', label: 'rethrow' }), B('c', 330, 60, 200, 90, { title: 'caller', lines: ['can catch it too'], size: 14, lsize: 12.5, tone: 'teal' })];
    }
  };

  /* ---------- 9. a custom exception class (slides 39-42) ---------- */
  var TCR = 'public class TestCircleWithRadiusException {\n  public static void main(String[] args) {\n    try {\n      new CircleWithRadiusException(5);\n      new CircleWithRadiusException(-5);\n      new CircleWithRadiusException(2);\n    }\n    catch (InvalidRadiusException ex) {\n      System.out.println(ex);\n    }\n\n    System.out.println("Number of objects created: " +\n      CircleWithRadiusException.getNumberOfObjects());\n  }\n}';
  var custom = {
    id: 'custom', slides: [39, 42], title: 'Your own exception class, with extra data',
    code: function (v) { return 'public class InvalidRadiusException extends RuntimeException {\n  private double radius;\n\n  public InvalidRadiusException(double radius) {\n    super("Invalid radius " + radius);\n    this.radius = radius;\n  }\n\n  public double getRadius() { return radius; }\n}\n\n// in CircleWithRadiusException:\npublic void setRadius(double newRadius) throws InvalidRadiusException {\n  if (newRadius >= 0) radius =  newRadius;\n  else throw new InvalidRadiusException(newRadius);\n}\n\n// the test program:\n' + TCR.replace('(-5)', '(' + v.r + ')'); },
    inputs: [{ id: 'r', label: 'second radius', value: -5, min: -100, max: 100 }],
    presets: [{ label: '-5 (slide)', values: { r: -5 } }, { label: '-0.5', values: { r: -0.5 } }, { label: '3 (no exception)', values: { r: 3 } }],
    steps: function (v) {
      var r = v.r, bad = r < 0, rs = String(r).indexOf('.') < 0 ? r + '.0' : String(r);
      var st = [
        { slide: 39, line: 1, ph: 'why', cap: 'Use Java’s exception classes when you can. If none fits, or you want to carry extra data (here: the bad radius), define your own by <b>extending</b> Exception or one of its subclasses.' },
        { slide: 40, line: '1-7', ph: 'cls', cap: '<code>InvalidRadiusException extends RuntimeException</code>. Its constructor calls <code>super("Invalid radius " + radius)</code> to set the message, and keeps the radius in a field with getRadius().' },
        { slide: 41, line: '13-15', ph: 'use', cap: 'CircleWithRadiusException.setRadius throws <code>new InvalidRadiusException(newRadius)</code> for a negative radius.' },
        { slide: 42, line: 22, ph: 'run', n: 1, cap: 'The first circle (radius 5) is created: 1 object.' }
      ];
      if (bad) {
        st.push({ slide: 42, line: 23, ph: 'run', n: 1, err: true, cap: 'Radius ' + rs + ' is negative: the exception is thrown, and the third line is skipped.' });
        st.push({ slide: 42, line: '26-27', ph: 'run', n: 1, err: true, cap: '<code>System.out.println(ex)</code> calls toString: the class name, ": " and the message.', out: 'InvalidRadiusException: Invalid radius ' + rs });
        st.push({ slide: 42, line: '30-31', ph: 'run', n: 1, err: true, cap: 'One object was created.', out: 'Number of objects created: 1' });
      } else st.push({ slide: 42, line: '22-31', ph: 'run', n: 3, cap: 'All three radii are valid: no exception, the catch is skipped, and 3 objects are created.', out: 'Number of objects created: 3' });
      return st;
    },
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'why' || s.ph === 'cls') {
        items.push(B('rt', 200, 30, 180, 40, { title: 'RuntimeException', mono: true, size: 13, tone: 'blue' }));
        items.push(B('ir', 140, 140, 300, boxH(3), { title: 'InvalidRadiusException', band: true, mono: true, lsize: 12, lines: ['-radius: double', '+InvalidRadiusException(radius)', '+getRadius(): double'], tone: 'accent', hi: s.ph === 'cls' }));
        items.push(A('i', 290, 136, 290, 74, { tone: 'ink', label: 'extends', la: 'start', lx: 8 }));
        return items;
      }
      if (s.ph === 'use') return [B('u', 40, 50, 480, boxH(3), { lines: ['public void setRadius(double newRadius) throws InvalidRadiusException {', '  if (newRadius >= 0) radius = newRadius;', '  else throw new InvalidRadiusException(newRadius);'], mono: true, lsize: 10.5, tone: 'accent' })];
      items.push(vbox('n', 360, 60, 180, 'numberOfObjects', 'static int', s.n, {}));
      if (s.err) items.push(B('ex', 40, 160, 300, boxH(2), { title: ': InvalidRadiusException', band: true, mono: true, lsize: 12, lines: ['message = "Invalid radius …"', 'radius = the bad value'], tone: 'red', hi: true }));
      return items;
    }
  };

  var ALL = [quotient, trycatch, mismatch, tree, propagate, info, finallyv, when, custom];

  var para = function (t) { return { type: 'paragraph', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; },
    code = function (t, lang) { return lang ? { type: 'code', text: t, lang: lang } : { type: 'code', text: t }; }, note = function (t) { return { type: 'note', text: t }; };
  function braces(c) { var o = (c.match(/\{/g) || []).length, z = (c.match(/\}/g) || []).length; return o >= 2 && o === z; }
  var OUT = ['Exception-Handling Overview', 'Exception Types', 'Declaring, Throwing, and Catching Exceptions', 'Getting Information from Exceptions', 'The finally Clause', 'When to Use Exceptions', 'Defining Custom Exception Classes'];
  function outline(title, on, ex) { return { image: false, title: title, blocks: OUT.map(function (t, i) { return { type: 'bullet', html: i === on ? '<b>' + t + '</b>' : t, level: 0 }; }), explain: ex }; }
  var QIF = 'import java.util.Scanner;\n\npublic class QuotientWithIf {\n  public static void main(String[] args) {\n    Scanner input = new Scanner(System.in);\n\n    // Prompt the user to enter two integers\n    System.out.print("Enter two integers: ");\n    int number1 = input.nextInt();\n    int number2 = input.nextInt();\n\n    if (number2 != 0)\n      System.out.println(number1 + " / " + number2\n        + " is " + (number1 / number2));\n    else\n      System.out.println("Divisor cannot be zero ");\n  }\n}';
  var QM = 'import java.util.Scanner;\n\npublic class QuotientWithMethod {\n  public static int quotient(int number1, int number2) {\n    if (number2 == 0) {\n      System.out.println("Divisor cannot be zero");\n      System.exit(1);\n    }\n\n    return number1 / number2;\n  }\n\n  public static void main(String[] args) {\n    Scanner input = new Scanner(System.in);\n\n    // Prompt the user to enter two integers\n    System.out.print("Enter two integers: ");\n    int number1 = input.nextInt();\n    int number2 = input.nextInt();\n\n    int result = quotient(number1, number2);\n    System.out.println(number1 + " / " + number2 + " is "\n      + result);\n  }\n}';
  var CWE = 'public class CircleWithException {\n  private double radius;                   // Circle radius\n  private static int numberOfObjects = 0;  // Objects created\n\n  // Construct a circle with a specified radius\n  public CircleWithException(double newRadius) {\n    setRadius(newRadius);\n    numberOfObjects++;\n  }\n  . . .\n  // Set a new radius\n  public void setRadius(double newRadius) throws IllegalArgumentException {\n    if (newRadius >= 0) radius = newRadius;\n    else\n      throw new IllegalArgumentException("Radius cannot be negative");\n  }\n  . . .\n}';

  addUnit({
    course: 'cs2', lesson: '05-exception-handling',
    blurb: 'Handle runtime errors instead of crashing: throw and catch exceptions, the exception classes, checked and unchecked, finally, and your own exception classes.',
    parts: [
      {
        title: 'Exception-handling overview', from: 1, to: 12,
        quiz: [
          { q: 'What happens in <code>int x = 5 / 0;</code>?', options: ['An ArithmeticException is thrown', 'x becomes 0', 'x becomes Infinity'], answer: 0, why: 'Integer division by zero (slides 3-4).' },
          { q: 'Why is System.exit(1) inside quotient (slide 6) a bad idea?', options: ['The method ends the whole program; the caller should decide', 'It is a syntax error', 'It returns 1'], answer: 0, why: 'Slide 7.' },
          { type: 'output', q: 'With QuotientWithException (slide 8), the user types 5 0. What is printed?', code: 'try {\n  int result = quotient(5, 0);\n  System.out.println("5 / 0 is " + result);\n}\ncatch (ArithmeticException ex) {\n  System.out.println("Exception: an integer cannot be divided by zero ");\n}\nSystem.out.println("Execution continues ...");', answer: 'Exception: an integer cannot be divided by zero\nExecution continues ...', why: 'The rest of the try is skipped; after the catch the program continues.' },
          { type: 'fill', q: 'Complete the statement that throws an exception.', code: '___ new ArithmeticException("Divisor cannot be zero");', answer: ['throw'], why: 'throw (no s) throws an exception object (slide 9).' },
          { q: 'In InputMismatchExceptionDemo, why call <code>input.nextLine()</code> in the catch?', options: ['To discard the bad input before asking again', 'To read the next number', 'To end the loop'], answer: 0, why: 'Otherwise nextInt would read the same bad input again (slide 12).' }
        ]
      },
      {
        title: 'Exception types', from: 13, to: 18,
        quiz: [
          { q: 'What is the root class of all exceptions?', options: ['Throwable', 'Exception', 'Error'], answer: 0, why: 'Slide 14.' },
          { q: 'Which is an unchecked exception?', options: ['NullPointerException', 'IOException', 'ClassNotFoundException'], answer: 0, why: 'It is a RuntimeException (slide 16).' },
          { q: 'Which exception occurs if you use an object through a null reference?', options: ['NullPointerException', 'ArithmeticException', 'IllegalArgumentException'], answer: 0, why: 'Slide 15.' },
          { type: 'tf', q: 'Java forces you to catch every RuntimeException.', answer: false, why: 'Unchecked exceptions do not have to be caught (slide 18).' }
        ]
      },
      {
        title: 'Declaring, throwing and catching', from: 19, to: 25,
        quiz: [
          { q: 'Which keyword <b>declares</b> that a method may throw an exception?', options: ['throws', 'throw', 'catch'], answer: 0, why: 'Slide 21: void m() throws IOException.' },
          { q: 'In slide 24, method3 throws an Exception2. Who handles it?', options: ['method1', 'method2', 'main'], answer: 0, why: 'method2 has only catch (Exception3), so it is aborted; method1 catches Exception2.' },
          { q: 'p2 declares <code>throws IOException</code>. What must p1 (which calls p2) do?', options: ['Catch IOException or declare throws IOException', 'Nothing', 'Call p2 twice'], answer: 0, why: 'IOException is checked (slide 25).' },
          { type: 'output', q: 'What does this print?', code: 'try {\n  System.out.println("A");\n  int[] a = new int[2];\n  a[5] = 1;\n  System.out.println("B");\n}\ncatch (ArrayIndexOutOfBoundsException ex) {\n  System.out.println("C");\n}\nSystem.out.println("D");', answer: 'A\nC\nD', why: 'After the exception, B is skipped.' }
        ]
      },
      {
        title: 'Information and finally', from: 26, to: 34,
        quiz: [
          { type: 'output', q: 'What does this print?', code: 'try {\n  throw new IllegalArgumentException("Bad value");\n}\ncatch (IllegalArgumentException ex) {\n  System.out.println(ex.getMessage());\n}', answer: 'Bad value', why: 'getMessage returns only the message (slide 27).' },
          { type: 'output', q: 'And this?', code: 'try {\n  throw new IllegalArgumentException("Bad value");\n}\ncatch (IllegalArgumentException ex) {\n  System.out.println(ex);\n}', answer: 'java.lang.IllegalArgumentException: Bad value', why: 'println uses toString: class name, ": " and the message.' },
          { type: 'output', q: 'With TestCircleWithException (slide 29), how many objects are created? Type the number.', code: 'try {\n  new CircleWithException(5);\n  new CircleWithException(-5);\n  new CircleWithException(2);\n}\ncatch (IllegalArgumentException ex) { }', answer: '1', why: 'The second throws before it is counted, and the third is never reached.' },
          { type: 'output', q: 'What does this print?', code: 'try {\n  System.out.println("try");\n}\ncatch (Exception ex) {\n  System.out.println("catch");\n}\nfinally {\n  System.out.println("finally");\n}', answer: 'try\nfinally', why: 'Case 1: no exception (slide 32).' },
          { q: 'In Case 3 (an exception that is not caught), what happens to the finally block?', options: ['It still runs', 'It is skipped', 'It runs twice'], answer: 0, why: 'Slide 34.' }
        ]
      },
      {
        title: 'Using exceptions well', from: 35, to: 42,
        quiz: [
          { q: 'How should a possible null reference be checked?', options: ['With if (refVar != null)', 'With try-catch for NullPointerException', 'With finally'], answer: 0, why: 'Simple errors are better handled without exceptions (slide 37).' },
          { q: 'What does <code>throw ex;</code> inside a catch block do?', options: ['Rethrows the exception to the caller', 'Ends the program', 'Catches it again'], answer: 0, why: 'Slide 38.' },
          { q: 'How do you define your own exception class?', options: ['Extend Exception or one of its subclasses', 'Write a method named Exception', 'Use the keyword exception'], answer: 0, why: 'Slide 39.' },
          { type: 'output', q: 'With InvalidRadiusException (slide 40), what does this print?', code: 'try {\n  new CircleWithRadiusException(-2);\n}\ncatch (InvalidRadiusException ex) {\n  System.out.println(ex.getRadius());\n}', answer: '-2.0', why: 'The custom exception keeps the bad radius.' }
        ]
      }
    ],
    slides: {
      1: { image: false, blocks: [para('When a program runs into a runtime error, the program terminates abnormally.'), para('How can you handle the runtime error so that the program can continue to run gracefully?')],
        explain: '<p>Some errors only appear while a program <b>runs</b>: the user types a letter instead of a number, a file is missing, someone divides by zero. Without help, the program <b>{{crashes|ينهار ويتوقف}}</b>: it stops at once with an error message.</p><p><b>{{Exception handling|معالجة الاستثناءات}}</b> lets the program notice the problem, deal with it, and <b>keep running</b> {{gracefully|بهدوء ودون انهيار}}: show a clear message, ask again, or try another way.</p>' },
      2: outline('Outline', -1, '<p>The plan of this unit.</p>'),
      3: { image: false, title: 'Exceptions', blocks: [bul('Exceptions are runtime errors. The JVM detects an operation that is impossible to carry out.'), bul('Exception handling enables a program to handle runtime errors and continue its normal execution.'), bul('For example, if you divide an integer by 0, you will get an ArithmeticException.'), bul('If you enter a double value when your program expects an integer, you will get an InputMismatchException.'), bul('If you access an array using an index that is out of bounds, you will get an ArrayIndexOutOfBoundsException.')],
        explain: '<p>An <b>{{exception|استثناء}}</b> is an error found while the program runs: the JVM meets an operation it cannot do. Three examples you may have seen already:</p><ul><li><code>5 / 0</code> with integers → <b>ArithmeticException</b>.</li><li>The user types 3.5 when nextInt() expects an int → <b>InputMismatchException</b>.</li><li><code>a[10]</code> in an array of length 5 → <b>ArrayIndexOutOfBoundsException</b>.</li></ul><p>The program compiles fine; the problem only shows up when it runs with certain input.</p>' },
      4: { image: false, title: 'Example: Computing the Quotient', blocks: [code(Q1), code('Enter two integers: 3 0\nException in thread "main" java.lang.ArithmeticException: / by zero\nat Quotient.main(Quotient.java:13)', 'none')],
        explain: '<p>The Quotient program divides two numbers the user types. With 3 and 0, line 13 tries <code>3 / 0</code>. That is {{impossible|مستحيل}} for integers, so the JVM <b>throws</b> an ArithmeticException.</p><p>Nothing in the program handles it, so the program stops and prints the exception’s name, its message (/ by zero) and where it happened (Quotient.java line 13). The last println never runs.</p><p>Try the example buttons in the drawing: 7 2 works, 3 0 crashes.</p>' },
      5: { image: false, title: 'Fixing the code with an if statement', blocks: [code(QIF)], explain: '<p>The simplest fix: check before you divide.</p><pre class="ex">if (number2 != 0)\n  ... number1 / number2 ...\nelse\n  System.out.println("Divisor cannot be zero ");</pre><p>When the divisor is 0, the program prints a message instead of crashing. For a simple problem in one place, an if is the best tool.</p>' },
      6: { image: false, title: 'What if a Method caused the Exception?', blocks: [code(QM)], explain: '<p>Now the division is inside a method, quotient. The method finds the problem, but what should it <b>return</b>? There is no correct int for 3 / 0.</p><p>This version prints a message and calls <code>System.exit(1)</code>, which <b>ends the whole program</b>. The caller (main) never gets a chance to react, for example to ask the user for another number.</p>' },
      7: { image: false, title: 'Avoiding Program Termination', blocks: [bul('The method quotient returns the quotient of two integers.'), bul('If number2 is 0, it cannot return a value, so the program is terminated at line 7.'), bul('This is clearly a problem. You should not let the method terminate the program. The caller should decide whether to terminate the program.'), bul('How can a method notify its caller an exception has occurred?'), bul('Java enables a method to throw an exception that can be caught and handled by the caller.')],
        explain: '<p>A method should <b>not</b> decide to stop the whole program. Only the <b>{{caller|الدالة التي استدعت الدالة}}</b> knows what makes sense: ask again, use a default, or stop.</p><p>So the method needs a way to say “something went wrong” to its caller. That way is to <b>{{throw|يرمي}}</b> an exception. The caller can then <b>{{catch|يلتقط}}</b> it and decide what to do.</p>' },
      8: { image: false, title: 'Throwing an Exception', blocks: [code(QE)], explain: '<p>Two changes to QuotientWithMethod:</p><ol><li>quotient no longer exits. When the divisor is 0 it does <code>throw new ArithmeticException("Divisor cannot be zero");</code>.</li><li>main puts the call inside <code>try { … }</code> and adds <code>catch (ArithmeticException ex) { … }</code>.</li></ol><p>With 3 0: quotient throws, the rest of the try block is <b>skipped</b>, Java jumps into the catch block and prints the message, and then the program <b>continues</b>: “Execution continues ...” is printed. No crash!</p>' },
      9: { image: false, title: 'Catching the Exception', blocks: [bul('If number2 is 0, the quotient method throws an exception:'), code('throw new ArithmeticException("Divisor cannot be zero");'), bul('The exception is an object created from an exception class. In this case: java.lang.ArithmeticException.'), bul('The constructor ArithmeticException(str) is invoked to construct an exception object, where str is a string that describes the exception.'), bul('When an exception is thrown, execution flow is interrupted.'), bul('The try block contains the code that is executed in normal circumstances, when there is no exception.'), bul('The exception is caught by the catch block. The code in the catch block is executed to handle the exception.')],
        explain: '<p>An exception is a normal <b>object</b>. <code>new ArithmeticException("Divisor cannot be zero")</code> creates it, with a message inside; <code>throw</code> sends it up to the caller.</p><p>When it is thrown, the normal flow stops at once: no more lines of the method run.</p><ul><li>The <b>try</b> block holds the normal code, for when all goes well.</li><li>The <b>catch</b> block runs only if a matching exception is thrown inside the try.</li></ul>' },
      10: { image: false, title: 'The try-throw-catch block', blocks: [code('try {\n  Code to run;\n  A statement or method that may throw an exception;\n  More code to run;\n}\ncatch (type ex) {\n  Code to process the exception;\n}', 'none'), bul('An exception may be thrown directly using a throw statement in a try block, or indirectly by a method that may throw an exception.')],
        explain: '<p>The general shape:</p><pre class="ex">try {\n  code to run;\n  a statement or method that may throw;\n  more code to run;      // skipped if an exception is thrown\n}\ncatch (type ex) {\n  code to process the exception;\n}</pre><p>The catch names the exception <b>type</b> it handles and a variable, usually ex, that refers to the exception object. The exception can be thrown directly by a throw in the try block, or indirectly by a method called from it.</p>' },
      11: { image: false, title: 'Exception Advantages', blocks: [bul('Exception handling enables a method to throw an exception to its caller, enabling the caller to handle the exception.'), bul('Often the called method does not know what to do in case of an exception.'), bul('This is the case for the library methods. The library method can detect the error, but only the caller knows what needs to be done when an exception occurs.'), bul('The key benefit is separating the detection of an exception (done in a called method) from the handling of an exception (done in the calling method).')],
        explain: '<p>Why is this better than if-tests everywhere? Because the two jobs are <b>{{separated|مفصولان}}</b>:</p><ul><li>The <b>called</b> method <b>detects</b> the error (it knows the rules).</li><li>The <b>caller</b> <b>handles</b> it (it knows what the program should do next).</li></ul><p>Java’s library methods work exactly like this. Integer.parseInt("abc") cannot know if your program should ask again or stop, so it throws an exception and lets <b>you</b> decide.</p>' },
      12: { image: false, title: 'Handling InputMismatch Exception', blocks: [code('import java.util.*;\n\npublic class InputMismatchExceptionDemo {\n  public static void main(String[] args) {\n' + IM.split('\n').map(function (l) { return '    ' + l; }).join('\n') + '\n  }\n}')],
        explain: '<p>A practical use: keep asking until the user types a valid int.</p><ul><li>If nextInt() succeeds, the number is printed and <code>continueInput = false</code> ends the loop.</li><li>If the user types 4.5, nextInt() throws an <b>InputMismatchException</b>. The catch prints “Try again …” and the loop repeats.</li></ul><p class="watch"><code>input.nextLine()</code> in the catch throws away the bad input. Without it, nextInt() would read the same “4.5” again and again: an endless loop.</p>' },
      13: outline('Next . . .', 1, '<p>Next: the kinds of exceptions.</p>'),
      14: { image: false, blocks: [bul('Exceptions are classes in the Java API. The root class for exceptions is java.lang.Throwable.'), bul('Exceptions thrown are instances of the exception classes.')],
        explain: '<p>Exceptions are <b>classes</b> in the Java library, arranged as a family tree. The root, at the top, is <b>java.lang.Throwable</b>. Under it are two branches:</p><ul><li><b>Error</b>: serious problems inside the JVM.</li><li><b>Exception</b>: problems a program can handle. Under it are RuntimeException and many others.</li></ul><p>A thrown exception is always an <b>object</b> of one of these classes.</p>' },
      15: { image: false, title: 'Exception Types', blocks: [bul('Throwable is the root class of all exception classes. All Java exception classes inherit directly or indirectly from Throwable.'), bul('The Error class describes internal system errors that are thrown by the JVM, such as LinkageError and VirtualMachineError.'), bul('The ClassNotFoundException occurs if you run a nonexistent class.'), bul('The IOException is related to input/output operations, such as invalid input, reading past the end of a file, and opening a nonexistent file.'), bul('ArithmeticException occurs if you divide an integer by zero.'), bul('NullPointerException if you access an object through a null reference.'), bul('IndexOutOfBoundsException occurs if you index an array out of range.'), bul('IllegalArgumentException if you pass an illegal argument to a method.')],
        explain: '<p>The names tell you the problem:</p><ul><li><b>ClassNotFoundException</b>: you try to run a class that does not exist.</li><li><b>IOException</b>: input/output trouble, like a missing file.</li><li><b>ArithmeticException</b>: integer division by zero.</li><li><b>NullPointerException</b>: using an object through a null reference.</li><li><b>IndexOutOfBoundsException</b>: an index outside an array (or a string).</li><li><b>IllegalArgumentException</b>: a method got a bad argument.</li></ul><p>Error’s subclasses, like VirtualMachineError, are rare internal JVM problems.</p>' },
      16: { image: false, title: 'Unchecked versus Checked Exceptions', blocks: [bul('RuntimeException, Error, and their subclasses are known as unchecked exceptions.'), bul('In most cases, unchecked exceptions reflect programming logic errors that should be corrected by the programmer.'), bul('Unchecked exceptions can occur anywhere in the program.'), para('To avoid cumbersome overuse of try-catch blocks, Java does not force you to write code to catch unchecked exceptions.'), bul('All other exceptions are known as checked exceptions, meaning that the compiler forces the programmer to check and deal with the exceptions.')],
        explain: '<p>Two groups, with a different rule from the compiler:</p><ul><li><b>{{Unchecked|غير مُتحقَّق}}</b>: RuntimeException, Error and their subclasses. They usually mean a <b>bug</b> in the program (like a null reference). The compiler does not force you to catch them; otherwise there would be try-catch around almost every line.</li><li><b>{{Checked|مُتحقَّق منه: المترجم يجبرك تتعامل معه}}</b>: all the others, like IOException. The compiler <b>forces</b> you to deal with them: catch them or declare them.</li></ul>' },
      17: { image: false, title: 'Unchecked Exceptions', blocks: [bul('RuntimeException, Error, and their subclasses are known as the unchecked exceptions.'), para('Error is an internal system error thrown by the JVM. Rarely occurs but terminates program execution.'), para('RuntimeException is caused by programming errors, such as numeric errors and bad indexing.')],
        explain: '<p>In the slide’s tree, the colored parts are the unchecked exceptions:</p><ul><li><b>Error</b> and its subclasses: internal JVM errors. Rare, and they end the program.</li><li><b>RuntimeException</b> and its subclasses: programming errors, like dividing by zero or a bad index.</li></ul>' },
      18: { image: false, title: 'Unchecked Exceptions', blocks: [bul('In most cases, unchecked exceptions reflect programming logic errors that should be corrected in the program.'), bul('For example, a NullPointerException is thrown if you access an object through a null reference variable before an object is assigned to it.'), bul('An IndexOutOfBoundsException is thrown if you access an array element outside the bounds of the array.'), bul('Unchecked exceptions can occur anywhere in the program.'), para('To avoid overuse of the try-catch blocks, Java does not mandate you to write code to catch unchecked exceptions.')],
        explain: '<p>The right answer to an unchecked exception is usually to <b>fix the code</b>, not to catch it:</p><pre class="ex">String s = null;\ns.length();     // NullPointerException: give s a value first\n\nint[] a = new int[3];\na[3] = 1;       // ArrayIndexOutOfBoundsException: use index 0 to 2</pre><p>These can happen anywhere, so Java does not make you write try-catch for them.</p>' },
      19: outline('Next . . .', 2, '<p>Next: declaring, throwing and catching.</p>'),
      20: { image: false, title: 'Declaring, Throwing, and Catching Exceptions', blocks: [bul('method2() declares an Exception class.'), bul('If an error occurs, method2() throws an Exception object.'), bul('method1() catches and handles the exception.'), code('method1() {\n  try {\n    invoke method2;\n  }\n  catch (Exception ex) {\n    Process exception;\n  }\n}\n\nmethod2() throws Exception {\n  if (an error occurs) {\n    throw new Exception();\n  }\n}', 'none')],
        explain: '<p>Three keywords, three jobs:</p><ul><li><b>throws</b> (in the method header): “this method may throw this exception”. This is <b>declaring</b>.</li><li><b>throw</b> (in the body): actually throws an exception object.</li><li><b>try-catch</b> (in the caller): catches and handles it.</li></ul><p>method2 declares and throws; method1 calls it inside try and catches.</p>' },
      21: { image: false, title: 'Declaring Exceptions', blocks: [bul('In Java, every method must state the types of exceptions it might throw. This is known as declaring exceptions.'), bul('Use the keyword throws to declare an exception:'), code('public void method() throws IOException', 'none'), bul('If a method might throw multiple exceptions, you can list them after throws separated by commas:'), code('public void method()\n    throws Exception1, Exception2, ..., ExceptionN', 'none')],
        explain: '<p>A method <b>declares</b> the checked exceptions it may throw, with <b>throws</b> in its header:</p><pre class="ex">public void readFile() throws IOException\npublic void m() throws Exception1, Exception2</pre><p>Several types are separated by commas. This warns every caller: “be ready for this”.</p><p class="watch">Do not mix up the two words: <b>throws</b> (with s) in the header, <b>throw</b> (no s) in the body.</p>' },
      22: { image: false, title: 'Throwing Exceptions', blocks: [bul('When a method detects an error, the method can create an instance of an appropriate exception type and throw it. This is known as throwing an exception.'), bul('For example, suppose a method detects a wrong radius argument. The radius must be positive, but a negative radius is passed. The method should throw an instance of IllegalArgumentException, as follows:'), code('if (radius <= 0) throw new\n  IllegalArgumentException("Radius must be positive");')],
        explain: '<p>When a method finds an error, it creates an exception object of a fitting type and throws it:</p><pre class="ex">if (radius &lt;= 0)\n  throw new IllegalArgumentException("Radius must be positive");</pre><p>Choose the class whose name describes the problem, and write a clear message: the caller (and later you, when debugging) will read it.</p>' },
      23: { image: false, title: 'Catching Exceptions', blocks: [bul('When an exception is thrown, it can be caught and handled in a try-catch block, as follows:'), code('try {\n  statements;  // statements may throw exceptions\n}\ncatch (Exception1 ex1) {\n  handler for exception1;\n}\ncatch (Exception2 ex2) {\n  handler for exception2;\n}\n...\ncatch (ExceptionN exN) {\n  handler for exceptionN;\n}', 'none'), para('If no exceptions arise during the execution of the try block, the catch blocks are skipped.'), para('If one statement inside the try block throws an exception, the remaining statements are skipped and the catch block that handles the exception is executed.')],
        explain: '<p>A try can have <b>several catch blocks</b>, one per exception type:</p><ul><li>No exception in the try block: all catch blocks are skipped.</li><li>A statement throws: the rest of the try block is skipped, and Java runs the <b>first</b> catch block whose type matches. The other catch blocks are skipped.</li></ul><pre class="ex">try { … a[5] = 1; … }\ncatch (ArithmeticException ex)           { … }   // skipped\ncatch (ArrayIndexOutOfBoundsException ex) { … }   // runs</pre>' },
      24: { image: false, title: 'Catching Exceptions', blocks: [bul('If the exception type is Exception3, it is caught in method2, statement5 is skipped and statement6 is executed.'), bul('If the exception type is Exception2, method2 is aborted, method1 handles the exception, statement3 is skipped and statement4 is executed.'), bul('If the exception type is Exception1, method1 is aborted, main handles the exception, statement1 is skipped and statement2 is executed.'), bul('If the exception type is not caught, the program terminates.')],
        explain: '<p>main calls method1, which calls method2, which calls method3. If method3 throws, the exception {{travels|ينتقل}} <b>back</b> along the calls, looking for a matching catch:</p><ul><li>Exception3: method2 catches it. The rest of method2’s try (statement5) is skipped; statement6 runs.</li><li>Exception2: method2 has no matching catch, so it is <b>aborted</b>. method1 catches it.</li><li>Exception1: method2 and method1 are aborted; main catches it.</li><li>Not caught anywhere: the program terminates.</li></ul><p>Try each exception type in the drawing.</p>' },
      25: { image: false, title: 'Catch or Declare Checked Exceptions', blocks: [bul('If a method p2 declares a checked IOException, then a calling method p1 must invoke p2 in a try-catch block or throws the IOException in the calling method p1, as shown below.'), code('void p1() {\n  try { p2(); }\n  catch (IOException ex) {\n    ...\n  }\n  ...\n}'), code('void p1() throws IOException {\n  p2();\n  ...\n}'), code('void p2() throws IOException {\n  if (file not found) { throw new IOException ("File not found"); }\n  ...\n}', 'none')],
        explain: '<p>The compiler rule for <b>checked</b> exceptions: <b>catch or declare</b>. If p2 declares <code>throws IOException</code>, then p1, which calls p2, must do one of two things:</p><ul><li>catch it: call p2 inside try { } catch (IOException ex) { }, or</li><li>declare it too: <code>void p1() throws IOException</code>, so p1’s caller must handle it.</li></ul><p>If p1 does neither, the program does not compile.</p>' },
      26: outline('Next . . .', 3, '<p>Next: what an exception tells you.</p>'),
      27: { image: false, title: 'Getting Information from Exceptions', blocks: [bul('Throwable is the root class for all exception classes.'), bul('An exception object contains valuable information.'), bul('getMessage() returns a message carried by the exception object.'), bul('toString() returns the full name of the exception class concatenated with ": " and the getMessage() string.')],
        explain: '<p>The exception object {{carries|يحمل}} information you can use in the catch block (these methods come from Throwable):</p><ul><li><code>getMessage()</code>: only the message, like “Radius cannot be negative”.</li><li><code>toString()</code>: the full class name, ": ", then the message: “java.lang.IllegalArgumentException: Radius cannot be negative”. Printing <code>ex</code> calls it.</li><li><code>printStackTrace()</code>: prints which methods were running when it happened, very helpful for finding bugs.</li></ul>' },
      28: { image: false, title: 'Example: CircleWithException', blocks: [code(CWE)], explain: '<p>CircleWithException protects its radius with an exception:</p><pre class="ex">if (newRadius &gt;= 0) radius = newRadius;\nelse throw new IllegalArgumentException("Radius cannot be negative");</pre><p>The constructor calls setRadius first, then <code>numberOfObjects++</code>. So if the radius is negative, the exception is thrown <b>before</b> the counter goes up: a bad circle is never counted.</p>' },
      29: { image: false, title: 'The TestCircleWithException class', blocks: [code(TCE)], explain: '<p>Follow the test:</p><ul><li>c1 (radius 5): fine, the count is 1.</li><li>c2 (radius -5): setRadius throws. The rest of the try block is skipped, so c3 is <b>never created</b>.</li><li>The catch prints <code>ex.getMessage()</code>: “Radius cannot be negative”.</li><li>Then the program continues and prints “Number of objects created: 1”.</li></ul><p>(The slide writes −5 with a long dash; in code it must be the normal - sign.)</p>' },
      30: outline('Next . . .', 4, '<p>Next: finally.</p>'),
      31: { image: false, title: 'The finally Clause', blocks: [bul('Sometimes, you may want some statements to be executed regardless of whether an exception occurs or is caught.'), bul('The statements in the finally block are always executed, regardless of whether an exception occurs or caught.'), code('try {\n  statements;\n}\ncatch (ExceptionType ex) {\n  handling ex;\n}\nfinally {\n  finalStatements;\n}', 'none')],
        explain: '<p>Sometimes code must run <b>no matter what</b>: for example, a file must be closed whether the reading worked or not. That code goes in a <b>finally</b> block:</p><pre class="ex">try { … }\ncatch (ExceptionType ex) { … }\nfinally {\n  finalStatements;   // always runs\n}</pre><p>finally runs if there is no exception, if one is caught, and even if one is not caught.</p>' },
      32: { image: false, title: 'Case 1: No Exception in the try Block', blocks: [bul('If no exception arises, finalStatements and nextStatements are executed after the finally block.'), code(FIN, 'none')], explain: '<p><b>Case 1: no exception.</b> statement1, statement2 and statement3 all run. The catch block is skipped. Then finally runs, and then the next statements after the whole try.</p><p>Order: try → finally → next.</p>' },
      33: { image: false, title: 'Case 2: An Exception is Caught', blocks: [bul('Suppose that statement2 in the try block caused an exception of the ExceptionType in the catch block.'), note('statement3 is skipped. The catch block is executed. The finally block is executed. nextStatements are executed in the method.'), code(FIN, 'none')], explain: '<p><b>Case 2: an exception is caught.</b> statement2 throws a matching exception, so statement3 is skipped. The catch block runs, then finally, then the next statements.</p><p>Order: statement1 → statement2 (throws) → catch → finally → next.</p>' },
      34: { image: false, title: 'Case 3: An Exception is Not Caught', blocks: [bul('Suppose that statement2 in the try block caused an exception, which is NOT caught in the catch block.'), note('statement3 is skipped. The catch block is skipped. The finally block is executed. nextStatements are skipped, and the exception is passed to the caller.'), code(FIN, 'none')], explain: '<p><b>Case 3: an exception that is not caught.</b> statement2 throws a type that the catch does not match. statement3 and the catch are skipped, but <b>finally still runs</b>. Then the method stops: the next statements are skipped, and the exception goes up to the caller.</p><p>This is why finally is the right place for clean-up code.</p>' },
      35: outline('Next . . .', 5, '<p>Next: when to use exceptions.</p>'),
      36: { image: false, title: 'When to Use Exceptions', blocks: [bul('A method should throw an exception if the error needs to be handled by the caller.'), bul('Exception handling separates error-handling from normal code, making programs easier to read and modify.'), bul('If you can handle the exception in the method where it occurs, there is no need to throw or use exceptions.'), bul('Use the try-catch block to deal with unexpected error conditions. Do not use it to deal with simple errors.'), bul('Simple errors are best handled without throwing exceptions.')],
        explain: '<p>Exceptions are powerful, but do not use them for everything:</p><ul><li>Throw an exception when the <b>caller</b> must decide what to do.</li><li>If the method can handle the problem itself, just handle it; no exception is needed.</li><li>Use try-catch for <b>{{unexpected|غير متوقَّع}}</b> problems. For simple, expected checks, use if.</li></ul>' },
      37: { image: false, title: 'Using if-else to Check Simple Errors', blocks: [bul('The following code:'), code('try\n  System.out.println(refVar.toString());\ncatch (NullPointerException ex)\n  System.out.println("refVar is null");', 'none'), bul('Better replaced by:'), code('if (refVar != null)\n  System.out.println(refVar.toString());\nelse\n  System.out.println("refVar is null");')],
        explain: '<p>Testing for null with try-catch works, but it hides what you are checking:</p><pre class="ex">// not good\ntry { System.out.println(refVar.toString()); }\ncatch (NullPointerException ex) { System.out.println("refVar is null"); }\n\n// better\nif (refVar != null) System.out.println(refVar.toString());\nelse System.out.println("refVar is null");</pre><p>The if version says exactly what is tested, and it is faster.</p>' },
      38: { image: false, title: 'Rethrowing Exceptions', blocks: [bul('Java allows an exception handler to rethrow the exception if the handler cannot process the exception or wants its caller method be notified of the exception.'), bul('The caller gets a chance to process the exception.'), code('try {\n  statements;\n}\ncatch (ExceptionType ex) {\n  perform operations before rethrowing the exception;\n  throw ex;  // Rethrow the exception ex\n}', 'none')],
        explain: '<p>A catch block can do part of the work and then <b>throw the same exception again</b> ({{rethrow|يُعيد رمي}} it) with <code>throw ex;</code>.</p><p>Why? The handler may write a log message or close something, but still want its caller to know that the operation failed. The caller gets its own chance to handle it.</p>' },
      39: { image: false, title: 'Defining a Custom Exception Class', blocks: [bul('Use the Java exception classes whenever possible.'), bul('Define your own custom exception class if the predefined exception classes in the Java language are not sufficient.'), bul('Define an exception class by extending the Java Exception class or one of its subclasses, such as IOException.'), bul('For example, the setRadius method throws the IllegalArgumentException if radius is negative.'), bul('Suppose you want to pass the radius to the handler. Then, you can define a custom InvalidRadiusException.')],
        explain: '<p>Use Java’s exception classes when one fits. But sometimes you want your <b>own</b>: for example, to give the handler the bad radius itself, not only a message.</p><p>A {{custom|مخصّص}} exception is just a class that <b>extends</b> Exception or one of its subclasses (extends and super are from unit 4). If it extends RuntimeException it is unchecked; if it extends Exception directly it is checked.</p>' },
      40: { image: false, title: 'The InvalidRadiusException class', blocks: [bul('This exception class extends java.lang.RuntimeException'), code('public class InvalidRadiusException extends RuntimeException {\n  private double radius;\n\n  /** Construct an exception */\n  public InvalidRadiusException(double radius) {\n    super("Invalid radius " + radius); // super constructor\n    this.radius = radius;\n  }\n\n  /** Return the radius */\n  public double getRadius() {\n    return radius;\n  }\n}')],
        explain: '<p>InvalidRadiusException extends RuntimeException, so it is <b>unchecked</b>. It adds what the standard classes do not have: the bad radius.</p><ul><li>The constructor first calls <code>super("Invalid radius " + radius)</code> to set the message.</li><li>Then it stores the radius in its own field.</li><li>getRadius() lets the catch block read it.</li></ul>' },
      41: { image: false, title: 'The Circle with Radius Exception class', blocks: [code('public class CircleWithRadiusException {\n  private double radius;\n  private static int numberOfObjects = 0;\n\n  public CircleWithRadiusException() { this(1.0); }\n\n  public CircleWithRadiusException(double newRadius) {\n    setRadius(newRadius);\n    numberOfObjects++;\n  }\n\n  public double getRadius() { return radius; }\n\n  public void setRadius(double newRadius) throws InvalidRadiusException {\n    if (newRadius >= 0) radius =  newRadius;\n    else throw new InvalidRadiusException(newRadius);\n  }\n\n  public static int getNumberOfObjects() { return numberOfObjects; }\n\n  public double getArea() { return radius * radius * Math.PI; }\n}')],
        explain: '<p>The circle class is the same as before, except setRadius now throws the custom exception:</p><pre class="ex">else throw new InvalidRadiusException(newRadius);</pre><p>The handler can now get both the message and the bad value (ex.getRadius()).</p>' },
      42: { image: false, title: 'Testing Circle with Radius Exception', blocks: [code(TCR)], explain: '<p>The test creates circles with 5, -5 and 2. At -5 the exception is thrown, so the 2 is never created. The catch prints <code>ex</code>, which calls toString:</p><pre class="ex">InvalidRadiusException: Invalid radius -5.0\nNumber of objects created: 1</pre><p>The class name has no “java.lang.” in front, because this class is our own, not in a Java package. Try the other radii in the drawing.</p>' }
    },
    visuals: ALL,
    exam: {
      questions: [
        { q: 'An exception is…', options: ['an error found while the program runs', 'a syntax error', 'a comment'], answer: 0, review: 3, why: 'Slide 3.' },
        { type: 'output', q: 'What does this print?', code: 'try {\n  int x = 10 / 0;\n  System.out.println(x);\n}\ncatch (ArithmeticException ex) {\n  System.out.println("oops");\n}', answer: 'oops', review: 8, why: 'The division throws; the println in try is skipped.' },
        { q: 'Which is right?', options: ['throw new Exception("x");', 'throws new Exception("x");', 'catch new Exception("x");'], answer: 0, review: 9, why: 'throw in the body; throws in the header.' },
        { type: 'output', q: 'The user types abc, then 9, for the loop of slide 12. What is printed after the second prompt?', code: '// Enter an integer: abc\n// Try again. (Incorrect input: an integer is required)\n// Enter an integer: 9\n// ???', answer: 'The number entered is 9', review: 12, why: 'The second input is an int.' },
        { q: 'Which class is the root of all exceptions?', options: ['java.lang.Throwable', 'java.lang.Exception', 'java.lang.Object'], answer: 0, review: 14, why: 'Throwable itself extends Object.' },
        { q: 'Which is a checked exception?', options: ['IOException', 'ArithmeticException', 'NullPointerException'], answer: 0, review: 16, why: 'It is not a RuntimeException or Error.' },
        { q: 'A method may throw IOException and FileNotFoundException. Its header can be…', options: ['void m() throws IOException, FileNotFoundException', 'void m() throw IOException', 'void m() catch IOException'], answer: 0, review: 21, why: 'List them after throws, separated by commas.' },
        { type: 'output', q: 'What does this print?', code: 'try {\n  String s = null;\n  s.length();\n}\ncatch (ArithmeticException ex) {\n  System.out.println("A");\n}\ncatch (NullPointerException ex) {\n  System.out.println("N");\n}', answer: 'N', review: 23, why: 'The matching catch runs.' },
        { q: 'If no method in the call chain catches an exception…', options: ['the program terminates', 'it is ignored', 'main returns 0'], answer: 0, review: 24, why: 'Slide 24.' },
        { type: 'output', q: 'What does this print?', code: 'try {\n  throw new ArithmeticException("Divisor cannot be zero");\n}\ncatch (ArithmeticException ex) {\n  System.out.println(ex.getMessage());\n}', answer: 'Divisor cannot be zero', review: 27, why: 'getMessage returns the message.' },
        { type: 'output', q: 'What does this print?', code: 'try {\n  System.out.println("1");\n  throw new RuntimeException();\n}\ncatch (RuntimeException ex) {\n  System.out.println("2");\n}\nfinally {\n  System.out.println("3");\n}\nSystem.out.println("4");', answer: '1\n2\n3\n4', review: 33, why: 'Case 2: caught, then finally, then the rest.' },
        { q: 'When does the finally block run?', options: ['Always', 'Only if an exception occurs', 'Only if no exception occurs'], answer: 0, review: 31, why: 'Slide 31.' },
        { q: 'Which is the better way to handle a value that may be null?', options: ['An if-else test', 'A try-catch for NullPointerException', 'A finally block'], answer: 0, review: 37, why: 'Simple errors without exceptions.' },
        { type: 'output', q: 'With the classes of slides 40-42, what does this print?', code: 'try {\n  new CircleWithRadiusException(-3);\n}\ncatch (InvalidRadiusException ex) {\n  System.out.println(ex.getMessage());\n}', answer: 'Invalid radius -3.0', review: 40, why: 'The constructor called super("Invalid radius " + radius).' },
        { type: 'fill', q: 'Complete the method: it declares the exception in the header and throws it in the body.', code: 'public static void check(int age) ___ IllegalArgumentException {\n  if (age < 0)\n    ___ new IllegalArgumentException("Negative age");\n}', answer: ['throws', 'throw'], review: 21, why: 'throws (with s) in the header declares; throw (no s) in the body throws the object.' },
        { type: 'write', q: 'a is an int array and i an int. Print a[i] inside a try block; if the index is outside the array, catch the exception and print Bad index.', rows: 6, checks: [{ re: /try\s*\{[\s\S]*a\s*\[\s*i\s*\][\s\S]*\}/, label: 'try { … a[i] … }' }, { re: /catch\s*\(\s*ArrayIndexOutOfBoundsException\s+\w+\s*\)/, label: 'catch (ArrayIndexOutOfBoundsException ex)' }, { re: /println\s*\(\s*"Bad index"\s*\)\s*;/, label: 'System.out.println("Bad index");' }], solution: 'try {\n  System.out.println(a[i]);\n}\ncatch (ArrayIndexOutOfBoundsException ex) {\n  System.out.println("Bad index");\n}', review: 23, why: 'The risky line goes in try; the catch names the exception type and a variable.' },
        { type: 'write', q: 'Write a checked custom exception class AgeException with a constructor AgeException(String message) that passes the message to the superclass.', rows: 5, checks: [{ re: /class\s+AgeException\s+extends\s+Exception\b/, label: 'class AgeException extends Exception' }, { re: /AgeException\s*\(\s*String\s+\w+\s*\)\s*\{\s*super\s*\(\s*\w+\s*\)\s*;/, label: 'AgeException(String message) { super(message); }' }], solution: 'public class AgeException extends Exception {\n  public AgeException(String message) {\n    super(message);\n  }\n}', review: 39, why: 'Extending Exception (not RuntimeException) makes it checked. super(message) sets the message that getMessage() returns.' },
        { type: 'trace', q: 'For each case of slides 32-34 (statement2 is the one that may throw), write yes or no.', cols: ['case', 'statement3', 'catch block', 'finally', 'nextStatements'], rows: [['no exception', '?yes', '?no', '?yes', '?yes'], ['an exception that is caught', '?no', '?yes', '?yes', '?yes'], ['an exception that is not caught', '?no', '?no', '?yes', '?no']], review: 34, why: 'finally runs in every case. After an exception, the rest of the try is skipped; if nothing catches it, the method stops and the exception goes to the caller.' },
        { type: 'bug', q: 'This does not compile. Tap the wrong line.', code: 'try {\n  int x = 5 / 0;\n}\ncatch (ArithmeticException) {\n  System.out.println("error");\n}', answer: 4, review: 10, why: 'A catch needs the type and a variable name: catch (ArithmeticException ex).' },
        { type: 'order', q: 'Slide 24: method3 throws an Exception1, which only main catches. Put what happens in order.', lang: 'none', lines: ['method3 throws the Exception1', 'method2 is aborted (no matching catch)', 'method1 is aborted (no matching catch)', 'main runs its catch block for Exception1', 'main goes on with statement2'], review: 24, why: 'The exception travels back along the calls until a method catches it.' }
      ],
      tasks: [
        {
          title: 'Safe division',
          task: '<p>Write <code>public static int divide(int a, int b)</code> that <b>throws</b> <code>new ArithmeticException("b is zero")</code> when b is 0, and returns a / b otherwise. In main, call <code>divide(8, 0)</code> inside a <b>try</b>, <b>catch</b> the ArithmeticException and print its message.</p>',
          starter: 'public class SafeDivide {\n  public static void main(String[] args) {\n    \n  }\n\n}',
          output: 'b is zero',
          checks: [
            { re: /public\s+static\s+int\s+divide\s*\(\s*int\s+\w+\s*,\s*int\s+\w+\s*\)/, label: 'Header: <code>public static int divide(int a, int b)</code>', review: 8 },
            { re: /throw\s+new\s+ArithmeticException\s*\(\s*"b is zero"\s*\)/, label: '<code>throw new ArithmeticException("b is zero")</code>', review: 9 },
            { re: /try\s*\{[\s\S]*divide\s*\(\s*8\s*,\s*0\s*\)[\s\S]*\}\s*catch\s*\(\s*ArithmeticException\s+\w+\s*\)/, label: 'Calls divide(8, 0) in try, with catch (ArithmeticException ex)', review: 10 },
            { re: /\.getMessage\s*\(\s*\)/, label: 'Prints <code>ex.getMessage()</code>', review: 27 },
            { fn: braces, label: 'Braces match', review: 10 }
          ],
          solution: 'public class SafeDivide {\n  public static void main(String[] args) {\n    try {\n      System.out.println(divide(8, 0));\n    }\n    catch (ArithmeticException ex) {\n      System.out.println(ex.getMessage());\n    }\n  }\n\n  public static int divide(int a, int b) {\n    if (b == 0)\n      throw new ArithmeticException("b is zero");\n    return a / b;\n  }\n}'
        },
        {
          title: 'try, catch and finally',
          task: '<p>Inside a try block, read <code>arr[5]</code> of an array of length 3. Catch <code>ArrayIndexOutOfBoundsException</code> and print <code>bad index</code>. Add a <b>finally</b> block that prints <code>done</code>.</p>',
          starter: 'public class Finally {\n  public static void main(String[] args) {\n    int[] arr = {1, 2, 3};\n    \n  }\n}',
          output: 'bad index\ndone',
          checks: [
            { re: /try\s*\{[\s\S]*arr\s*\[\s*5\s*\]/, label: 'Reads <code>arr[5]</code> inside try', review: 23 },
            { re: /catch\s*\(\s*ArrayIndexOutOfBoundsException\s+\w+\s*\)/, label: 'catch (ArrayIndexOutOfBoundsException ex)', review: 23 },
            { re: /"bad index"/, label: 'Prints bad index', review: 23 },
            { re: /finally\s*\{[\s\S]*"done"/, label: 'A finally block that prints done', review: 31 }
          ],
          solution: 'public class Finally {\n  public static void main(String[] args) {\n    int[] arr = {1, 2, 3};\n    try {\n      System.out.println(arr[5]);\n    }\n    catch (ArrayIndexOutOfBoundsException ex) {\n      System.out.println("bad index");\n    }\n    finally {\n      System.out.println("done");\n    }\n  }\n}'
        },
        {
          title: 'A custom exception',
          task: '<p>Write <code>class NegativeAgeException extends RuntimeException</code> with a constructor <code>NegativeAgeException(int age)</code> that calls <code>super("Negative age " + age)</code>.</p>',
          starter: '\n',
          output: 'new NegativeAgeException(-4).getMessage() returns "Negative age -4"',
          checks: [
            { re: /class\s+NegativeAgeException\s+extends\s+RuntimeException/, label: '<code>class NegativeAgeException extends RuntimeException</code>', review: 40 },
            { re: /NegativeAgeException\s*\(\s*int\s+\w+\s*\)/, label: 'Constructor <code>NegativeAgeException(int age)</code>', review: 40 },
            { re: /super\s*\(\s*"Negative age "\s*\+\s*\w+\s*\)/, label: 'Calls <code>super("Negative age " + age)</code>', review: 40 }
          ],
          solution: 'public class NegativeAgeException extends RuntimeException {\n  public NegativeAgeException(int age) {\n    super("Negative age " + age);\n  }\n}'
        }
      ]
    }
  });
})();
