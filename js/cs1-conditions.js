addModule({
  id: 'c5',
  track: 'cs1',
  title: 'Conditions',
  blurb: 'Make decisions with if, else, else if and switch.',
  lessons: [
    /* ------------------------------------------------------------ */
    {
      id: 'c5-1',
      title: 'The if statement',
      body: `
<p>Programs often need to make a {{decision|قرار}}: "do this only if something is true". For this we use <code>if</code>.</p>
~~~
if (age >= 18) {
    System.out.println("Adult");
}
~~~
<p>The part inside <code>( )</code> is the <b>condition</b>. It is always <code>true</code> or <code>false</code>. If it is true, the code inside <code>{ }</code> runs. If it is false, Java skips it.</p>
<h3>Comparison operators</h3>
<div class="tblwrap"><table>
<tr><th>Operator</th><th>Meaning</th><th>Example (age = 20)</th></tr>
<tr><td><code>==</code></td><td>equal to</td><td><code>age == 20</code> → true</td></tr>
<tr><td><code>!=</code></td><td>not equal to</td><td><code>age != 20</code> → false</td></tr>
<tr><td><code>&gt;</code></td><td>greater than</td><td><code>age &gt; 18</code> → true</td></tr>
<tr><td><code>&lt;</code></td><td>less than</td><td><code>age &lt; 18</code> → false</td></tr>
<tr><td><code>&gt;=</code></td><td>greater than or equal</td><td><code>age &gt;= 20</code> → true</td></tr>
<tr><td><code>&lt;=</code></td><td>less than or equal</td><td><code>age &lt;= 19</code> → false</td></tr>
</table></div>
<div class="warn"><code>=</code> and <code>==</code> are different! <code>=</code> <b>puts</b> a value in a variable. <code>==</code> <b>compares</b> two values.</div>`,
      code: `int age = 20;
if (age >= 18) {
    System.out.println("Adult");
}
System.out.println("Done");`,
      steps: [
        { cap: 'age is 20.', line: 1 },
        { cap: 'Java checks the condition: is 20 >= 18? <b>true</b>.', line: 2 },
        { cap: 'The condition is true, so the code inside <code>{ }</code> runs.', line: 3, out: 'Adult' },
        { cap: 'After the if block, the program continues.', line: 5, out: 'Done' },
        { cap: 'What if age were <b>15</b>? 15 >= 18 is false, so Java skips the block and goes straight to "Done".', line: [2, 5], out: 'Done', clear: true }
      ],
      draw: function (k) {
        var f = k === 4, age = f ? 15 : 20;
        var tPath = k === 2 || k === 3, fPath = f;
        return [
          B('v', 30, 50, 120, 46, { tag: 'int age', title: String(age), mono: true, size: 18, tone: 'blue', hi: k === 0 || f }),
          B('cond', 190, 30, 190, 100, { shape: 'diamond', title: 'age >= 18 ?', mono: true, size: 13.5, tone: 'accent', hi: k === 1 || f }),
          B('yes', 200, 185, 170, 46, { title: 'println("Adult");', mono: true, size: 12.5, tone: 'teal', hi: k === 2, o: f ? 0.35 : 1 }),
          B('done', 200, 280, 170, 42, { title: 'println("Done");', mono: true, size: 12.5, tone: 'muted', hi: k === 3 || f }),
          A('t', 285, 132, 285, 183, { tone: tPath ? 'teal' : 'muted', label: 'true', la: 'start', lx: 8 }),
          A('yd', 285, 233, 285, 278, { tone: tPath ? 'teal' : 'muted' }),
          A('f', 382, 80, 372, 300, { tone: fPath ? 'red' : 'muted', bend: -60, label: 'false', la: 'start', lx: 14, dash: !fPath }),
          (k >= 1) && T('ev', 470, 60, f ? '15 >= 18' : '20 >= 18', { anchor: 'middle', mono: true, size: 13 }),
          (k >= 1) && T('ev2', 470, 84, f ? 'false' : 'true', { anchor: 'middle', mono: true, bold: true, size: 16, tone: f ? 'red' : 'teal' })
        ];
      },
      quiz: [
        { q: 'Which operator checks if two values are equal?', options: ['`=`', '`==`', '`!=`'], answer: 1, why: '<code>=</code> assigns. <code>==</code> compares.' },
        { type: 'fill', q: 'Print "Cold" only if temp is less than 10.', code: '___ (temp ___ 10) {\n    System.out.println("Cold");\n}', answer: ['if', '<'], why: '<code>if (temp &lt; 10)</code>' },
        { q: 'x is 5. What does <code>x != 5</code> give?', options: ['true', 'false'], answer: 1, why: 'x is equal to 5, so "not equal" is false.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'c5-2',
      title: 'if ... else',
      body: `
<p><code>else</code> gives a second path: the code that runs when the condition is <b>false</b>.</p>
~~~
if (temp > 25) {
    System.out.println("Hot");
} else {
    System.out.println("Not hot");
}
~~~
<p>Exactly <b>one</b> of the two blocks runs. Never both, never none.</p>
<p>Think of a road that splits in two. The condition decides which way you go.</p>
<div class="tip">If a block has only one statement, you can leave out the <code>{ }</code>. But it is safer to always write them. It stops many bugs.</div>`,
      code: `int temp = 15;
if (temp > 25) {
    System.out.println("Hot");
} else {
    System.out.println("Not hot");
}`,
      steps: [
        { cap: 'temp is 15.', line: 1 },
        { cap: 'Is 15 > 25? <b>false</b>.', line: 2 },
        { cap: 'The condition is false, so the <code>else</code> block runs.', line: [4, 5], out: 'Not hot' },
        { cap: 'With temp = <b>30</b>: 30 > 25 is true, so the first block runs instead. One path, never both.', line: [2, 3], out: 'Hot', clear: true }
      ],
      draw: function (k) {
        var hot = k === 3;
        var t = hot ? 30 : 15;
        return [
          B('v', 20, 40, 120, 46, { tag: 'int temp', title: String(t), mono: true, size: 18, tone: 'blue', hi: k === 0 || hot }),
          B('cond', 185, 25, 190, 100, { shape: 'diamond', title: 'temp > 25 ?', mono: true, size: 13.5, tone: 'accent', hi: k === 1 || hot }),
          B('yes', 40, 200, 180, 46, { title: 'println("Hot");', mono: true, size: 12.5, tone: 'teal', hi: hot, o: k === 2 ? 0.35 : 1, tag: 'if block' }),
          B('no', 340, 200, 190, 46, { title: 'println("Not hot");', mono: true, size: 12.5, tone: 'teal', hi: k === 2, o: hot ? 0.35 : 1, tag: 'else block' }),
          A('t', 185, 75, 130, 196, { tone: hot ? 'teal' : 'muted', label: 'true', bend: 20 }),
          A('f', 375, 75, 435, 196, { tone: k === 2 ? 'red' : 'muted', label: 'false', bend: -20 }),
          k >= 1 && T('ev', 280, 300, hot ? '30 > 25  →  true' : '15 > 25  →  false', { anchor: 'middle', mono: true, bold: true, size: 15, tone: hot ? 'teal' : 'red' })
        ];
      },
      quiz: [
        { q: 'With if/else, how many blocks run?', options: ['Both', 'Exactly one', 'Maybe none'], answer: 1, why: 'Either the if block or the else block.' },
        { q: 'What does this print?', code: 'int n = 4;\nif (n > 10) {\n    System.out.println("Big");\n} else {\n    System.out.println("Small");\n}', options: ['Big', 'Small', 'Big and Small'], answer: 1, why: '4 > 10 is false, so else runs.' },
        { type: 'fill', q: 'Add the second path.', code: 'if (isOpen) {\n    System.out.println("Come in");\n} ___ {\n    System.out.println("Closed");\n}', answer: ['else'], why: '<code>else</code> runs when the condition is false.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'c5-3',
      title: 'else if',
      body: `
<p>What if there are more than two choices? Use <code>else if</code> to check another condition.</p>
~~~
if (score >= 90) {
    System.out.println("A");
} else if (score >= 70) {
    System.out.println("B");
} else {
    System.out.println("C");
}
~~~
<p>Java checks the conditions <b>from top to bottom</b>. The first one that is true wins. Its block runs, and all the rest is skipped.</p>
<p>The last <code>else</code> (with no condition) is optional. It runs when <b>none</b> of the conditions are true.</p>
<div class="warn">Order matters! If you check <code>score >= 70</code> first, a score of 95 would get "B", because 95 >= 70 is also true.</div>`,
      code: `int score = 75;
if (score >= 90) {
    System.out.println("A");
} else if (score >= 70) {
    System.out.println("B");
} else {
    System.out.println("C");
}`,
      steps: [
        { cap: 'score is 75.', line: 1 },
        { cap: 'First check: 75 >= 90? <b>false</b>. Go down to the next check.', line: 2 },
        { cap: 'Second check: 75 >= 70? <b>true</b>!', line: 4 },
        { cap: 'The block for B runs.', line: 5, out: 'B' },
        { cap: 'The rest is skipped. Java stops at the first true condition.', line: [6, 7] }
      ],
      draw: function (k) {
        return [
          B('d1', 30, 15, 180, 90, { shape: 'diamond', title: 'score >= 90 ?', mono: true, size: 12.5, tone: 'accent', hi: k === 1 }),
          B('d2', 30, 140, 180, 90, { shape: 'diamond', title: 'score >= 70 ?', mono: true, size: 12.5, tone: 'accent', hi: k === 2 }),
          B('a', 300, 38, 150, 44, { title: 'print "A"', mono: true, tone: 'teal', o: k >= 1 ? 0.4 : 1 }),
          B('b', 300, 163, 150, 44, { title: 'print "B"', mono: true, tone: 'teal', fill: k >= 3 ? 'solid' : 'soft', hi: k === 3 }),
          B('c', 45, 275, 150, 44, { title: 'print "C"', mono: true, tone: 'teal', o: k >= 2 ? 0.4 : 1, tag: 'else' }),
          A('t1', 212, 60, 298, 60, { tone: 'muted', label: 'true' }),
          A('f1', 120, 107, 120, 138, { tone: k === 1 ? 'red' : 'muted', label: 'false', la: 'start', lx: 8 }),
          A('t2', 212, 185, 298, 185, { tone: k >= 2 ? 'teal' : 'muted', label: 'true' }),
          A('f2', 120, 232, 120, 273, { tone: 'muted', label: 'false', la: 'start', lx: 8, dash: k >= 2 }),
          B('v', 400, 270, 140, 46, { tag: 'int score', title: '75', mono: true, size: 18, tone: 'blue', hi: k === 0 }),
          k === 4 && T('skip', 470, 240, 'skipped', { anchor: 'middle', tone: 'muted', italic: true, size: 13 })
        ];
      },
      quiz: [
        { q: 'score = 95. What does the code in this lesson print?', options: ['A', 'B', 'A and B'], answer: 0, why: 'The first condition (95 >= 90) is true, and Java stops there.' },
        { q: 'When does the last <code>else</code> run?', options: ['Always', 'When none of the conditions are true', 'When all conditions are true'], answer: 1, why: 'It is the "none of the above" path.' },
        { type: 'fill', q: 'Add a middle check.', code: 'if (n > 0) {\n    System.out.println("Positive");\n} ___ ___ (n < 0) {\n    System.out.println("Negative");\n} else {\n    System.out.println("Zero");\n}', answer: ['else', 'if'], why: '<code>else if</code> checks another condition.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'c5-4',
      title: 'Nested if',
      body: `
<p>You can put an <code>if</code> <b>inside</b> another <code>if</code>. This is called a <b>nested</b> if.</p>
~~~
if (age >= 18) {
    if (hasTicket) {
        System.out.println("Welcome!");
    }
}
~~~
<p>The inner <code>if</code> is checked <b>only</b> when the outer condition is true. Think of two doors, one after the other. You must pass the first door to reach the second.</p>
<div class="tip">Use {{indentation|المسافة البادئة}} (spaces at the start of the line) to show which code is inside which block. Java does not need it, but people do!</div>
<p>Many nested ifs can be written more simply with the <b>logical operators</b> of the next module, like <code>if (age >= 18 && hasTicket)</code>.</p>`,
      code: `int age = 20;
boolean hasTicket = true;
if (age >= 18) {
    if (hasTicket) {
        System.out.println("Welcome!");
    }
}`,
      steps: [
        { cap: 'Two variables: age = 20 and hasTicket = true.', line: [1, 2] },
        { cap: 'First door: is age >= 18? <b>true</b>. We go inside.', line: 3 },
        { cap: 'Second door: hasTicket? <b>true</b>.', line: 4 },
        { cap: 'Both doors are open. The message prints.', line: 5, out: 'Welcome!' },
        { cap: 'If the first door is closed (false), Java never even checks the second one.', line: 3 }
      ],
      draw: function (k) {
        return [
          B('d1', 40, 25, 190, 90, { shape: 'diamond', title: 'age >= 18 ?', mono: true, size: 13, tone: 'accent', hi: k === 1, tag: 'door 1' }),
          B('d2', 40, 165, 190, 90, { shape: 'diamond', title: 'hasTicket ?', mono: true, size: 13, tone: 'accent', hi: k === 2, o: k === 0 ? 0.6 : 1, tag: 'door 2' }),
          B('ok', 310, 188, 200, 44, { title: 'print "Welcome!"', mono: true, tone: 'teal', fill: k >= 3 ? 'solid' : 'soft', hi: k === 3 }),
          B('n1', 310, 48, 200, 44, { title: '(nothing happens)', tone: 'muted', fill: 'none', dash: true, hi: k === 4 }),
          A('t1', 135, 117, 135, 163, { tone: k >= 1 && k <= 3 ? 'teal' : 'muted', label: 'true', la: 'start', lx: 8 }),
          A('f1', 232, 70, 308, 70, { tone: k === 4 ? 'red' : 'muted', label: 'false' }),
          A('t2', 232, 210, 308, 210, { tone: k >= 2 && k <= 3 ? 'teal' : 'muted', label: 'true' }),
          A('f2', 135, 257, 135, 292, { tone: 'muted', label: 'false', la: 'start', lx: 8 }),
          T('f2t', 135, 312, '(nothing happens)', { anchor: 'middle', size: 12, tone: 'muted' }),
          T('vars', 410, 300, 'age = 20    hasTicket = true', { anchor: 'middle', mono: true, size: 12.5, tone: 'blue', bold: k === 0 }),
          k === 4 && T('skip', 410, 150, 'door 2 is never checked', { anchor: 'middle', size: 12.5, tone: 'red', bold: true })
        ];
      },
      quiz: [
        { q: 'When is the inner if checked?', options: ['Always', 'Only when the outer condition is true', 'Only when the outer condition is false'], answer: 1, why: 'It is inside the outer block.' },
        { q: 'What does this print?', code: 'int x = 5;\nif (x > 0) {\n    if (x > 10) {\n        System.out.println("Big");\n    } else {\n        System.out.println("Small");\n    }\n}', options: ['Big', 'Small', 'Nothing'], answer: 1, why: '5 > 0 is true, then 5 > 10 is false, so the inner else runs.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'c5-5',
      title: 'The switch statement',
      body: `
<p>When you compare <b>one</b> variable with many possible values, a long <code>else if</code> chain gets hard to read. <code>switch</code> is cleaner:</p>
~~~
switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    default:
        System.out.println("Other day");
}
~~~
<ul>
<li>Java compares the value with each <code>case</code>, from top to bottom.</li>
<li>When a case {{matches|يطابق}}, its code runs.</li>
<li><code>break</code> jumps out of the switch.</li>
<li><code>default</code> runs when no case matches. It is optional.</li>
</ul>
<div class="warn">Without <code>break</code>, Java does not stop. It continues and runs the code of the next cases too! This is called "fall-through".</div>
<p><code>switch</code> works with <code>int</code>, <code>char</code>, <code>String</code> and a few other types.</p>`,
      code: `int day = 3;
switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    case 3:
        System.out.println("Wednesday");
        break;
    default:
        System.out.println("Other day");
}`,
      steps: [
        { cap: 'day is 3. The switch will compare it with each case.', line: [1, 2] },
        { cap: 'Is 3 == 1? No. Move on.', line: 3 },
        { cap: 'Is 3 == 2? No. Move on.', line: 6 },
        { cap: 'Is 3 == 3? <b>Yes!</b> This case runs.', line: [9, 10], out: 'Wednesday' },
        { cap: '<code>break</code> jumps out of the switch. default is skipped.', line: 11 }
      ],
      draw: function (k) {
        var cases = [['case 1:', 'Monday'], ['case 2:', 'Tuesday'], ['case 3:', 'Wednesday'], ['default:', 'Other day']];
        var at = [0, 0, 1, 2, 2][k];
        var items = [];
        cases.forEach(function (c, i) {
          var y = 25 + i * 62;
          var match = i === 2 && k >= 3, checked = k >= 1 && i < at;
          items.push(B('c' + i, 220, y, 220, 48, { title: c[0] + '  ' + c[1], mono: true, size: 13.5, align: 'left', tone: match ? 'teal' : i === 3 ? 'muted' : 'blue', fill: match ? 'solid' : 'soft', o: checked || (i === 3 && k === 4) ? 0.4 : 1, hi: k >= 1 && i === at && k <= 3 }));
        });
        items.push(B('v', 40, 25 + at * 62, 130, 48, { tag: 'day', title: '3', mono: true, size: 20, tone: 'accent', fill: 'solid' }));
        if (k >= 1 && k <= 3) items.push(T('cmp', 455, 25 + at * 62 + 30, k === 3 ? '3 == 3  yes' : '3 == ' + (at + 1) + '  no', { mono: true, bold: true, size: 13, tone: k === 3 ? 'teal' : 'red' }));
        if (k === 4) {
          items.push(A('brk', 442, 174, 500, 300, { tone: 'accent', label: 'break', bend: -20 }));
          items.push(T('out', 400, 320, 'leave the switch', { anchor: 'middle', bold: true, tone: 'accent', size: 13 }));
        }
        return items;
      },
      quiz: [
        { q: 'What does <code>break</code> do in a switch?', options: ['Stops the whole program', 'Jumps out of the switch', 'Goes to the next case'], answer: 1, why: 'Without break, Java falls through into the next case.' },
        { q: 'When does <code>default</code> run?', options: ['Always first', 'When no case matches', 'Never'], answer: 1, why: 'It is like the last else.' },
        { type: 'fill', q: 'Complete the switch.', code: '___ (color) {\n    ___ "red":\n        System.out.println("Stop");\n        break;\n    default:\n        System.out.println("Go");\n}', answer: ['switch', 'case'], why: '<code>switch (value)</code> and <code>case ...:</code>' }
      ]
    }
  ],
  challenge: {
    title: 'Even or odd',
    task: `
<p>Make an <code>int</code> variable <code>n</code> with the value <code>7</code>.</p>
<ul>
<li>If <code>n</code> is even, print <code>Even</code>.</li>
<li>Otherwise, print <code>Odd</code>.</li>
</ul>
<div class="tip">Hint: a number is even when <code>n % 2 == 0</code>.</div>`,
    starter: `public class Main {
    public static void main(String[] args) {
        int n = 7;

    }
}`,
    checks: [
      { re: /int\s+n\s*=\s*7\s*;/, label: '<code>int n = 7;</code>' },
      { re: /if\s*\(\s*n\s*%\s*2\s*(==|!=)\s*[01]\s*\)/, label: 'Check <code>n % 2</code> in an if' },
      { re: /\}\s*else\s*\{/, label: 'An <code>else</code> block' },
      { re: /System\.out\.println\s*\(\s*"Even"\s*\)/, label: 'Print <code>"Even"</code>' },
      { re: /System\.out\.println\s*\(\s*"Odd"\s*\)/, label: 'Print <code>"Odd"</code>' }
    ],
    solution: `public class Main {
    public static void main(String[] args) {
        int n = 7;
        if (n % 2 == 0) {
            System.out.println("Even");
        } else {
            System.out.println("Odd");
        }
    }
}`,
    output: 'Odd'
  }
});
