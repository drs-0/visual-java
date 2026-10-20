addModule({
  id: 'm5',
  title: 'Exceptions',
  blurb: 'Errors happen while a program runs. Catch them, so the program does not crash.',
  lessons: [
    /* ------------------------------------------------------------ */
    {
      id: 'm5-1',
      title: 'Exceptions and try / catch',
      body: `
<p>An <b>exception</b> is an error that happens <b>while the program runs</b>. For example:</p>
<ul>
<li>You divide by zero: <code>ArithmeticException</code></li>
<li>You use an index that does not exist: <code>ArrayIndexOutOfBoundsException</code></li>
<li>You use an object variable that is <code>null</code>: <code>NullPointerException</code></li>
<li>You turn "abc" into a number: <code>NumberFormatException</code></li>
</ul>
<p>If nobody handles the exception, the program <b>crashes</b> and stops.</p>
<h3>try and catch</h3>
<p>Put the {{risky|الخطير}} code inside <code>try</code>. Put the code that handles the problem inside <code>catch</code>:</p>
~~~
try {
    int[] arr = {1, 2, 3};
    System.out.println(arr[5]);
} catch (Exception e) {
    System.out.println("Oops! Error caught.");
}
~~~
<p>When an exception happens inside <code>try</code>:</p>
<ol>
<li>Java <b>stops</b> the try block at that line. The rest of the try block is skipped.</li>
<li>Java jumps to the <code>catch</code> block.</li>
<li>After catch, the program <b>continues</b> normally.</li>
</ol>
<div class="tip">The variable <code>e</code> is the exception object. <code>e.getMessage()</code> gives a short text about the error.</div>`,
      code: `try {
    int[] arr = {1, 2, 3};
    System.out.println(arr[5]);
    System.out.println("Never printed");
} catch (Exception e) {
    System.out.println("Oops! Error caught.");
}
System.out.println("Program continues");`,
      steps: [
        { cap: 'Java runs the code inside <code>try</code>, line by line.', line: 2 },
        { cap: '<code>arr[5]</code>! The array only has index 0, 1 and 2.', line: 3 },
        { cap: 'Java creates an {{exception|استثناء (خطأ)}} object and throws it.', line: 3 },
        { cap: 'The rest of try is skipped. The <code>catch</code> block {{catches|يمسك}} the exception.', line: [5, 6], out: 'Oops! Error caught.' },
        { cap: 'The program does <b>not</b> crash. It continues after catch.', line: 8, out: 'Program continues' }
      ],
      draw: function (k) {
        var curY = [67, 85, 85, 207, 290][k];
        return [
          B('try', 30, 20, 340, boxH(3), { title: 'try', lines: ['int[] arr = {1, 2, 3};', { t: 'println(arr[5]);', tone: k >= 1 && k <= 2 ? 'red' : undefined, b: k === 1 || k === 2 }, { t: 'println("Never printed");', tone: k >= 3 ? 'muted' : undefined, strike: k >= 3 }], tone: 'blue', mono: true, align: 'left', hi: k <= 1 }),
          B('catch', 30, 160, 340, boxH(1), { title: 'catch (Exception e)', lines: ['println("Oops! Error caught.");'], tone: 'teal', mono: true, align: 'left', hi: k === 3 }),
          B('after', 30, 265, 340, 44, { title: 'println("Program continues");', mono: true, size: 12.5, tone: 'muted', hi: k === 4 }),
          T('cur', 14, curY, '▶', { tone: 'accent', size: 13 }),
          (k === 2 || k === 3) && B('ex', 395, k === 2 ? 64 : 174, 150, 42, { title: 'Exception!', tone: 'red', fill: 'solid', r: 21, tag: 'IndexOutOfBounds', size: 15 }),
          k === 3 && A('jump', 470, 108, 470, 170, { tone: 'red', label: 'thrown', la: 'start', lx: 8 }),
          k === 3 && T('skip', 380, 112, 'skipped', { tone: 'muted', italic: true, size: 12 })
        ];
      },
      quiz: [
        { q: 'What happens to the lines after the error inside <code>try</code>?', options: ['They still run', 'They are skipped', 'They run after catch'], answer: 1, why: 'Java leaves the try block at the line with the error.' },
        { type: 'fill', q: 'Complete the code to handle the error.', code: '___ {\n    int x = 10 / 0;\n} ___ (Exception e) {\n    System.out.println("Error");\n}', answer: ['try', 'catch'], why: 'Risky code in <code>try</code>, handling code in <code>catch</code>.' },
        { q: 'Which exception do you get from <code>10 / 0</code>?', options: ['`NullPointerException`', '`ArithmeticException`', '`NumberFormatException`'], answer: 1, why: 'Dividing an int by zero is a math (arithmetic) error.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm5-2',
      title: 'Multiple catch and finally',
      body: `
<p>Different problems need different answers. You can write <b>more than one</b> <code>catch</code> block:</p>
~~~
try {
    // risky code
} catch (ArithmeticException e) {
    System.out.println("Math error");
} catch (Exception e) {
    System.out.println("Other error");
}
~~~
<p>Java checks the catch blocks <b>from top to bottom</b>. The <b>first</b> one that {{matches|يطابق}} the exception runs. The others are skipped.</p>
<div class="warn"><b>Order matters:</b> put the specific exceptions first, and the general <code>Exception</code> last. <code>Exception</code> matches everything, so a catch after it would never run.</div>
<h3>finally</h3>
<p>A <code>finally</code> block runs <b>always</b>: with an error or without one.</p>
~~~
finally {
    System.out.println("Always runs");
}
~~~
<p>Use it to clean up, for example to close a file or a connection.</p>
<p>Think of the catch blocks as {{filters|مصافي}}, one under the other. The exception falls down and stops in the first filter that fits it.</p>`,
      code: `try {
    int x = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Math error");
} catch (Exception e) {
    System.out.println("Other error");
} finally {
    System.out.println("Always runs");
}`,
      steps: [
        { cap: '<code>10 / 0</code> is not possible. Java throws an <code>ArithmeticException</code>.', line: 2 },
        { cap: 'First catch: is it an ArithmeticException? <b>Yes</b> ✓. This block runs.', line: [3, 4], out: 'Math error' },
        { cap: 'Only one catch block runs. The second one is skipped.', line: 5 },
        { cap: '<code>finally</code> runs always, with an error or without one.', line: [7, 8], out: 'Always runs' }
      ],
      draw: function (k) {
        var exY = [32, 122, 122, 122][k];
        return [
          B('try', 30, 20, 260, boxH(1), { title: 'try', lines: ['int x = 10 / 0;'], tone: 'blue', mono: true, align: 'left', hi: k === 0 }),
          B('c1', 30, 105, 260, boxH(1), { title: 'catch (ArithmeticException e)', lines: ['println("Math error");'], tone: 'teal', mono: true, size: 12.5, align: 'left', hi: k === 1 }),
          B('c2', 30, 185, 260, boxH(1), { title: 'catch (Exception e)', lines: ['println("Other error");'], tone: 'teal', mono: true, size: 12.5, align: 'left', o: k >= 2 ? 0.4 : 1 }),
          B('fin', 30, 268, 260, boxH(1), { title: 'finally', lines: ['println("Always runs");'], tone: 'accent', mono: true, align: 'left', hi: k === 3 }),
          k <= 2 && B('ex', 340, exY, 200, 40, { title: 'ArithmeticException', mono: true, tone: 'red', fill: 'solid', r: 20, size: 12.5, o: k === 2 ? 0.5 : 1 }),
          k === 1 && T('m1', 440, 186, 'matches? yes ✓', { anchor: 'middle', tone: 'teal', bold: true, size: 13 }),
          k === 2 && T('m2', 440, 214, 'skipped', { anchor: 'middle', tone: 'muted', italic: true, size: 13 }),
          k === 3 && T('m3', 420, 300, 'runs always', { anchor: 'middle', tone: 'accent', bold: true, size: 14 })
        ];
      },
      quiz: [
        { q: 'There are two catch blocks that both match. Which one runs?', options: ['Both', 'The first one that matches', 'The last one'], answer: 1, why: 'Java checks from top to bottom and runs only the first match.' },
        { q: 'When does the <code>finally</code> block run?', options: ['Only if there is an error', 'Only if there is no error', 'Always'], answer: 2, why: '<code>finally</code> always runs.' },
        { type: 'fill', q: 'Add a block that always closes the file.', code: 'try {\n    readFile();\n} catch (Exception e) {\n    System.out.println("Error");\n} ___ {\n    closeFile();\n}', answer: ['finally'], why: '<code>finally</code> is the place for cleanup.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm5-3',
      title: 'throw, throws and exception types',
      body: `
<h3>throw: make your own exception</h3>
<p>You can throw an exception yourself when something is wrong:</p>
~~~
static void checkAge(int age) {
    if (age < 18) {
        throw new ArithmeticException("Too young");
    }
    System.out.println("Welcome!");
}
~~~
<p>When Java reaches <code>throw</code>, the method stops at once. The exception travels back to the code that called the method, until a <code>catch</code> catches it.</p>
<h3>Checked and unchecked exceptions</h3>
<p>All exceptions are classes, in a family tree. The two big groups are:</p>
<ul>
<li><b>Checked</b> exceptions, like <code>IOException</code> and <code>FileNotFoundException</code>. Java <b>forces</b> you to handle them. If you don't, the code does not compile.</li>
<li><b>Unchecked</b> exceptions: <code>RuntimeException</code> and its children, like <code>ArithmeticException</code> and <code>NullPointerException</code>. Java does not force you. They are usually bugs in the code.</li>
</ul>
<h3>throws: warn the caller</h3>
<p>If your method can throw a checked exception and you don't want to catch it inside, write <code>throws</code> in the method {{header|رأس الدالة}}. Now the code that calls the method must handle it:</p>
~~~
static void readFile() throws IOException {
    // ...
}
~~~
<div class="tip">Remember the difference: <code>throw</code> (no s) <b>throws</b> one exception now. <code>throws</code> (with s) <b>warns</b> that a method might throw.</div>`,
      code: `static void checkAge(int age) {
    if (age < 18) {
        throw new ArithmeticException("Too young");
    }
    System.out.println("Welcome!");
}

public static void main(String[] args) {
    try {
        checkAge(15);
    } catch (ArithmeticException e) {
        System.out.println(e.getMessage());
    }
}`,
      steps: [
        { cap: '<code>main</code> calls <code>checkAge(15)</code> inside a try block.', line: 10 },
        { cap: 'Is 15 &lt; 18? Yes.', line: 2 },
        { cap: '<code>throw</code> creates the exception and throws it. The method stops here. "Welcome!" never prints.', line: 3 },
        { cap: 'The exception travels back to main, and catch catches it. <code>e.getMessage()</code> is "Too young".', line: [11, 12], out: 'Too young' },
        { cap: 'All exceptions are classes in a family {{tree|شجرة}}. <code>Throwable</code> is at the top.' },
        { cap: '<b>Checked</b> exceptions (orange): Java forces you to use try/catch or <code>throws</code>.' },
        { cap: '<b>Unchecked</b> exceptions (green): <code>RuntimeException</code> and its children. Java does not force you.' }
      ],
      draw: function (k) {
        if (k >= 4) {
          var ch = k === 5, un = k === 6;
          var nd = function (id, x, y, w, name, tone, on) { return B(id, x, y, w, 40, { title: name, mono: true, size: 12.5, tone: tone, fill: on ? 'solid' : 'soft', o: (k === 4 || on || tone === 'blue') ? 1 : 0.45 }); };
          return [
            nd('thr', 200, 20, 160, 'Throwable', 'blue', false),
            nd('err', 30, 100, 140, 'Error', 'muted', false),
            nd('exc', 300, 100, 160, 'Exception', 'blue', false),
            nd('io', 190, 185, 150, 'IOException', 'accent', ch),
            nd('rt', 370, 185, 175, 'RuntimeException', 'teal', un),
            nd('fnf', 150, 270, 200, 'FileNotFoundException', 'accent', ch),
            nd('ari', 365, 270, 185, 'ArithmeticException', 'teal', un),
            A('t1', 250, 62, 110, 98, { tone: 'muted' }), A('t2', 300, 62, 370, 98, { tone: 'muted' }),
            A('t3', 350, 142, 270, 183, { tone: 'muted' }), A('t4', 410, 142, 450, 183, { tone: 'muted' }),
            A('t5', 260, 227, 250, 268, { tone: 'muted' }), A('t6', 455, 227, 455, 268, { tone: 'muted' }),
            T('lg1', 20, 200, 'checked', { tone: 'accent', bold: true, size: 13 }),
            T('lg1b', 20, 218, 'must handle', { tone: 'accent', size: 12 }),
            T('lg2', 20, 250, 'unchecked', { tone: 'teal', bold: true, size: 13 }),
            T('lg2b', 20, 268, 'not forced', { tone: 'teal', size: 12 }),
            T('lg3', 30, 162, 'Error: serious,', { tone: 'muted', size: 11.5 }),
            T('lg3b', 30, 177, 'don\'t catch it', { tone: 'muted', size: 11.5 })
          ];
        }
        return [
          B('ca', 30, 30, 300, boxH(3), { title: 'checkAge(15)', lines: [{ t: 'if (age < 18)', tone: k === 1 ? 'accent' : undefined, b: k === 1 }, { t: 'throw new ArithmeticException(...)', tone: k === 2 ? 'red' : undefined, b: k === 2 }, { t: 'println("Welcome!");', tone: k >= 2 ? 'muted' : undefined, strike: k >= 2 }], tone: 'blue', mono: true, size: 13, lsize: 12, align: 'left', hi: k === 1 || k === 2 }),
          B('mn', 30, 195, 300, boxH(2), { title: 'main', lines: [{ t: 'try { checkAge(15); }', tone: k === 0 ? 'accent' : undefined, b: k === 0 }, { t: 'catch (...) { print message }', tone: k === 3 ? 'teal' : undefined, b: k === 3 }], tone: 'teal', mono: true, align: 'left', hi: k === 3 }),
          k === 0 && A('call', 200, 193, 200, 126, { tone: 'accent', label: 'call', la: 'start', lx: 8 }),
          (k === 2 || k === 3) && B('ex', 370, k === 2 ? 75 : 238, 170, 42, { title: '"Too young"', mono: true, tone: 'red', fill: 'solid', r: 21, tag: 'ArithmeticException', size: 14 }),
          k === 3 && A('back', 455, 120, 455, 234, { tone: 'red', label: 'goes back', la: 'start', lx: 8 })
        ];
      },
      quiz: [
        { q: 'Which keyword throws an exception right now?', options: ['`throws`', '`throw`', '`catch`'], answer: 1, why: '<code>throw</code> (no s) throws one exception. <code>throws</code> only warns.' },
        { q: 'Is <code>NullPointerException</code> checked or unchecked?', options: ['Checked', 'Unchecked'], answer: 1, why: 'It is a child of RuntimeException, so it is unchecked.' },
        { type: 'fill', q: 'Say that this method might throw an IOException.', code: 'static void load() ___ IOException {\n    // read a file\n}', answer: ['throws'], why: '<code>throws</code> in the method header warns the caller.' }
      ]
    }
  ],
  challenge: {
    title: 'Safe division',
    task: `
<p>Write code that tries to divide <code>10</code> by <code>0</code>.</p>
<ul>
<li>Put the division inside a <code>try</code> block.</li>
<li>Catch the <code>ArithmeticException</code>.</li>
<li>In the catch block, print <code>Cannot divide by zero</code>.</li>
</ul>`,
    starter: `public class Main {
    public static void main(String[] args) {
        // your try / catch here
    }
}`,
    checks: [
      { re: /try\s*\{[\s\S]*?10\s*\/\s*0[\s\S]*?\}\s*catch/, label: 'Divide <code>10 / 0</code> inside a try block' },
      { re: /catch\s*\(\s*ArithmeticException\s+\w+\s*\)/, label: 'Catch <code>ArithmeticException</code>' },
      { re: /catch\s*\([^)]*\)\s*\{[\s\S]*?System\.out\.println\s*\(\s*"Cannot divide by zero"\s*\)/, label: 'Print <code>"Cannot divide by zero"</code> in the catch block' }
    ],
    solution: `public class Main {
    public static void main(String[] args) {
        try {
            int result = 10 / 0;
            System.out.println(result);
        } catch (ArithmeticException e) {
            System.out.println("Cannot divide by zero");
        }
    }
}`,
    output: 'Cannot divide by zero'
  }
});
