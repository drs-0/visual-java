addModule({
  id: 'c7',
  track: 'cs1',
  title: 'Loops',
  blurb: 'Repeat code without writing it again: while, for, do...while, break and continue.',
  lessons: [
    /* ------------------------------------------------------------ */
    {
      id: 'c7-1',
      title: 'The while loop',
      body: `
<p>A <b>loop</b> repeats code. Instead of writing the same line 100 times, you write it once inside a loop.</p>
<p>The <code>while</code> loop repeats <b>as long as</b> its condition is true:</p>
~~~
int i = 1;
while (i <= 3) {
    System.out.println(i);
    i++;
}
~~~
<ol>
<li>Java checks the condition.</li>
<li>If it is true, the body (the code in <code>{ }</code>) runs once.</li>
<li>Then Java goes back to step 1 and checks again.</li>
<li>When the condition is false, the loop ends.</li>
</ol>
<p>Each time the body runs is called one <b>{{iteration|دورة/تكرار}}</b>.</p>
<div class="warn">Don't forget <code>i++</code>! If <code>i</code> never changes, the condition stays true forever. This is an <b>infinite loop</b>: the program never stops.</div>`,
      code: `int i = 1;
while (i <= 3) {
    System.out.println(i);
    i++;
}`,
      steps: [
        { cap: 'i starts at 1.', line: 1 },
        { cap: 'Check: 1 <= 3? <b>true</b>. Enter the loop.', line: 2 },
        { cap: 'Round 1: print 1, then i++ makes i = 2. Go back up.', line: [3, 4], out: '1' },
        { cap: 'Check: 2 <= 3? true. Round 2: print 2, i = 3.', line: [2, 3, 4], out: '2' },
        { cap: 'Check: 3 <= 3? true. Round 3: print 3, i = 4.', line: [2, 3, 4], out: '3' },
        { cap: 'Check: 4 <= 3? <b>false</b>. The loop ends.', line: 2 }
      ],
      draw: function (k) {
        var i = [1, 1, 2, 3, 4, 4][k];
        var rounds = [0, 0, 1, 2, 3, 3][k];
        var cond = k >= 1 ? ((k === 5 ? 4 : [1, 1, 1, 2, 3][k]) + ' <= 3 ?') : 'i <= 3 ?';
        var body = k >= 2 && k <= 4, exit = k === 5;
        return [
          B('cond', 200, 20, 180, 96, { shape: 'diamond', title: cond, mono: true, size: 14, tone: 'accent', hi: k === 1 || exit }),
          B('body', 205, 165, 170, boxH(2), { title: 'loop body', lines: ['println(i);', 'i++;'], mono: true, tone: 'teal', hi: body }),
          A('in', 290, 118, 290, 163, { tone: body || k === 1 ? 'teal' : 'muted', label: 'true', la: 'start', lx: 8 }),
          A('back', 203, 205, 198, 68, { tone: body ? 'accent' : 'muted', bend: -70, label: 'repeat', lx: -20 }),
          A('out', 382, 68, 470, 68, { tone: exit ? 'red' : 'muted', label: 'false' }),
          T('end', 480, 73, 'end', { bold: true, tone: exit ? 'red' : 'muted' }),
          B('i', 400, 175, 130, 56, { tag: 'int i', title: String(i), mono: true, size: 24, tone: 'blue', hi: k === 0 || body }),
          T('rd', 465, 270, 'rounds: ' + rounds, { anchor: 'middle', bold: true, tone: 'accent' })
        ];
      },
      quiz: [
        { q: 'How many times does this print?', code: 'int n = 0;\nwhile (n < 5) {\n    System.out.println("Hi");\n    n++;\n}', options: ['4', '5', '6'], answer: 1, why: 'n = 0, 1, 2, 3, 4. When n is 5, the condition is false.' },
        { q: 'What happens if you forget <code>i++</code> in the loop from this lesson?', options: ['The loop runs one time', 'The loop never stops', 'Java adds it for you'], answer: 1, why: 'i stays 1 and the condition stays true: an infinite loop.' },
        { type: 'fill', q: 'Repeat while x is greater than 0.', code: '___ (x > 0) {\n    x--;\n}', answer: ['while'], why: '<code>while (condition)</code>' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'c7-2',
      title: 'The for loop',
      body: `
<p>When you know <b>how many times</b> to repeat, the <code>for</code> loop is shorter. It puts all the counter work in one line:</p>
~~~
for (int i = 0; i < 5; i++) {
    System.out.println(i);
}
~~~
<p>The three parts inside <code>( )</code>, separated by <code>;</code>:</p>
<ol>
<li><code>int i = 0</code>: <b>start</b>. Runs only one time, at the beginning.</li>
<li><code>i &lt; 5</code>: <b>condition</b>. Checked before every round.</li>
<li><code>i++</code>: <b>update</b>. Runs after every round.</li>
</ol>
<p>This loop prints 0, 1, 2, 3, 4. That is 5 rounds. Programmers usually start counting at 0.</p>
<div class="tip">The same loop as a while: <code>int i = 0; while (i &lt; 5) { ...; i++; }</code>. The for loop just keeps the three parts together, so they are easy to see.</div>`,
      code: `for (int i = 0; i < 5; i++) {
    System.out.println(i);
}`,
      steps: [
        { cap: '<b>Start</b>: <code>int i = 0</code> runs one time.', line: 1 },
        { cap: '<b>Check</b>: 0 &lt; 5 is true. The body prints 0.', line: [1, 2], out: '0' },
        { cap: '<b>Update</b>: i++ → i = 1. Check 1 &lt; 5, print 1.', line: [1, 2], out: '1' },
        { cap: 'i = 2. Print 2.', line: [1, 2], out: '2' },
        { cap: 'i = 3. Print 3.', line: [1, 2], out: '3' },
        { cap: 'i = 4. Print 4.', line: [1, 2], out: '4' },
        { cap: 'i = 5. Check 5 &lt; 5 is <b>false</b>. The loop ends after 5 rounds.', line: 1 }
      ],
      draw: function (k) {
        var i = k === 0 ? 0 : k - 1;
        var part = k === 0 ? 0 : k === 6 ? 1 : k === 1 ? 1 : 2;
        var items = [
          B('p1', 20, 30, 150, 52, { title: 'int i = 0', mono: true, size: 14, tone: part === 0 ? 'accent' : 'blue', fill: part === 0 ? 'solid' : 'soft', tag: 'start (once)' }),
          B('p2', 195, 30, 160, 52, { title: k === 0 ? 'i < 5' : i + ' < 5', mono: true, size: 14, tone: part === 1 ? (k === 6 ? 'red' : 'accent') : 'blue', fill: part === 1 ? 'solid' : 'soft', tag: 'check (every round)' }),
          B('p3', 380, 30, 160, 52, { title: 'i++', mono: true, size: 14, tone: part === 2 ? 'accent' : 'blue', fill: part === 2 ? 'solid' : 'soft', tag: 'update (after body)' })
        ];
        for (var n = 0; n <= 5; n++) {
          var x = 70 + n * 72;
          var done = k >= 1 && n < i, cur = n === i && k >= 1 && k <= 5;
          items.push(B('n' + n, x, 160, 64, 56, { title: String(n), mono: true, size: 20, r: 4, tone: n === 5 ? (k === 6 ? 'red' : 'muted') : cur ? 'accent' : done ? 'teal' : 'muted', fill: cur ? 'solid' : 'soft', dash: n === 5 }));
        }
        items.push(P('ptr', 70 + i * 72 + 32, 156, 'i = ' + i, { dir: 'down', len: 30, tone: k === 6 ? 'red' : 'accent' }));
        items.push(T('note', 280, 260, k === 6 ? 'stop: 5 is not < 5' : 'printed: ' + (k >= 1 ? Array.from({ length: Math.min(k, 5) }, function (_, j) { return j; }).join(', ') : '-'), { anchor: 'middle', mono: true, bold: true, tone: k === 6 ? 'red' : 'teal' }));
        return items;
      },
      quiz: [
        { q: 'Which part of <code>for (int i = 0; i &lt; 3; i++)</code> runs only once?', options: ['`int i = 0`', '`i < 3`', '`i++`'], answer: 0, why: 'The start part runs one time, at the beginning.' },
        { q: 'What does <code>for (int i = 1; i &lt;= 3; i++)</code> go through?', options: ['0, 1, 2', '1, 2, 3', '1, 2, 3, 4'], answer: 1, why: 'Start at 1, stop after 3.' },
        { type: 'fill', q: 'Print the numbers 0 to 9.', code: 'for (int i = 0; i ___ 10; i___) {\n    System.out.println(i);\n}', answer: ['<', '++'], why: 'i goes from 0 while i &lt; 10, adding 1 each time.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'c7-3',
      title: 'The do...while loop',
      body: `
<p>The <code>do...while</code> loop is like <code>while</code>, with one difference: it checks the condition at the <b>end</b>.</p>
~~~
do {
    System.out.println(n);
    n++;
} while (n < 5);
~~~
<p>So the body always runs <b>at least one time</b>, even if the condition is false from the start.</p>
<div class="tblwrap"><table>
<tr><th>while</th><th>do...while</th></tr>
<tr><td>check first, then run</td><td>run first, then check</td></tr>
<tr><td>can run 0 times</td><td>runs at least 1 time</td></tr>
</table></div>
<div class="tip">A good use: a menu. Show the menu once, then repeat while the user does not choose "exit".</div>
<div class="warn">Note the <code>;</code> after <code>while (...)</code> at the end. It is needed in do...while.</div>`,
      code: `int n = 10;
do {
    System.out.println(n);
    n++;
} while (n < 5);`,
      steps: [
        { cap: 'n is 10. The condition <code>n &lt; 5</code> is already false!', line: 1 },
        { cap: 'But do...while runs the body <b>first</b>, without checking. It prints 10.', line: [2, 3, 4], out: '10' },
        { cap: 'Now it checks: 11 &lt; 5? false. The loop ends after <b>one</b> round.', line: 5 },
        { cap: 'Compare: a normal <code>while (n &lt; 5)</code> checks first, so its body would run <b>zero</b> times.' }
      ],
      draw: function (k) {
        var dw = k <= 2, cmp = k === 3;
        return [
          T('h1', 145, 26, 'do...while', { anchor: 'middle', bold: true, size: 15, tone: dw ? 'accent' : 'ink' }),
          T('h2', 420, 26, 'while', { anchor: 'middle', bold: true, size: 15, tone: cmp ? 'accent' : 'ink' }),
          B('db', 60, 45, 170, boxH(2), { title: 'body', lines: ['println(n);', 'n++;'], mono: true, tone: 'teal', fill: k >= 1 && dw ? 'solid' : 'soft', hi: k === 1 }),
          A('da', 145, 123, 145, 168, { tone: dw ? 'teal' : 'muted' }),
          B('dc', 55, 170, 180, 90, { shape: 'diamond', title: k >= 2 ? '11 < 5 ?' : 'n < 5 ?', mono: true, size: 13, tone: 'accent', hi: k === 2 }),
          A('dback', 57, 215, 58, 80, { tone: 'muted', bend: -45, label: 'true', lx: -14, dash: true }),
          A('dout', 145, 262, 145, 305, { tone: k === 2 ? 'red' : 'muted', label: 'false', la: 'start', lx: 8 }),
          T('dres', 145, 325, k >= 1 ? 'ran 1 time' : '', { anchor: 'middle', bold: true, tone: 'teal', size: 13 }),
          B('wc', 330, 45, 180, 90, { shape: 'diamond', title: 'n < 5 ?', mono: true, size: 13, tone: 'accent', hi: cmp, o: cmp ? 1 : 0.5 }),
          A('wa', 420, 137, 420, 168, { tone: 'muted', label: 'true', la: 'start', lx: 8, dash: true }),
          B('wb', 335, 170, 170, boxH(2), { title: 'body', lines: ['println(n);', 'n++;'], mono: true, tone: 'teal', o: cmp ? 0.35 : 0.5 }),
          A('wout', 512, 90, 545, 90, { tone: cmp ? 'red' : 'muted', label: 'false', la: 'end', lx: -2, ly: -4 }),
          T('wres', 420, 325, cmp ? 'ran 0 times' : '', { anchor: 'middle', bold: true, tone: 'red', size: 13 }),
          B('nv', 240, 280, 80, 40, { tag: 'n', title: k >= 2 ? '11' : '10', mono: true, tone: 'blue' })
        ];
      },
      quiz: [
        { q: 'How many times does a do...while body run, at least?', options: ['0', '1', '2'], answer: 1, why: 'It runs first and checks later.' },
        { type: 'fill', q: 'Complete the do...while loop.', code: '___ {\n    x++;\n} while (x < 3)___', answer: ['do', ';'], why: 'Start with <code>do</code> and end with <code>while (...);</code>' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'c7-4',
      title: 'break and continue',
      body: `
<p>Two keywords give you more control inside a loop:</p>
<ul>
<li><code>break</code>: <b>stop</b> the loop now, and leave it completely.</li>
<li><code>continue</code>: <b>skip</b> the rest of this round, and go to the next round.</li>
</ul>
~~~
for (int i = 1; i <= 6; i++) {
    if (i == 3) {
        continue;   // skip 3
    }
    if (i == 5) {
        break;      // stop at 5
    }
    System.out.println(i);
}
~~~
<p>Output: <code>1</code>, <code>2</code>, <code>4</code>. The number 3 is skipped, and the loop stops at 5, so 5 and 6 never print.</p>
<div class="tip">Think of a queue of people: <code>continue</code> = "skip this person, serve the next one". <code>break</code> = "the shop is closed, everyone goes home".</div>`,
      code: `for (int i = 1; i <= 6; i++) {
    if (i == 3) {
        continue;
    }
    if (i == 5) {
        break;
    }
    System.out.println(i);
}`,
      steps: [
        { cap: 'i = 1: no continue, no break. Print 1.', line: [1, 8], out: '1' },
        { cap: 'i = 2: print 2.', line: [1, 8], out: '2' },
        { cap: 'i = 3: <code>continue</code>! Skip the print and jump to the next round.', line: [2, 3] },
        { cap: 'i = 4: print 4.', line: [1, 8], out: '4' },
        { cap: 'i = 5: <code>break</code>! Leave the loop right now.', line: [5, 6] },
        { cap: 'Result: 1, 2, 4. Number 6 was never reached.' }
      ],
      draw: function (k) {
        var i = Math.min(k + 1, 5);
        var items = [];
        for (var n = 1; n <= 6; n++) {
          var x = 50 + (n - 1) * 78, st = 'wait';
          if (n < i || (n === i && k < 5)) st = n === 3 ? 'skip' : n === 5 ? 'break' : 'print';
          if (k === 5 && n <= 5) st = n === 3 ? 'skip' : n === 5 ? 'break' : 'print';
          var reached = n <= i;
          var tone = st === 'print' ? 'teal' : st === 'skip' ? 'muted' : st === 'break' ? 'red' : 'muted';
          items.push(B('n' + n, x, 130, 66, 60, { title: String(n), mono: true, size: 22, r: 6, tone: tone, fill: st === 'print' && n === i && k < 5 ? 'solid' : st === 'break' ? 'solid' : 'soft', dash: !reached || st === 'skip', o: !reached && n === 6 && k >= 4 ? 0.3 : 1 }));
          var lab = st === 'print' ? 'printed' : st === 'skip' ? 'continue' : st === 'break' ? 'break' : '';
          if (lab) items.push(T('l' + n, x + 33, 215, lab, { anchor: 'middle', size: 12, bold: true, tone: tone }));
        }
        if (k < 5) items.push(P('ptr', 50 + (i - 1) * 78 + 33, 126, 'i = ' + i, { dir: 'down', len: 30, tone: k === 4 ? 'red' : 'accent' }));
        if (k === 2) items.push(T('msg', 280, 280, 'continue: skip the rest of this round', { anchor: 'middle', bold: true, tone: 'muted' }));
        if (k >= 4) items.push(T('msg', 280, 280, k === 4 ? 'break: leave the loop now' : 'output: 1, 2, 4', { anchor: 'middle', bold: true, tone: k === 4 ? 'red' : 'teal' }));
        if (k >= 4) items.push(T('nr', 473, 240, 'never reached', { anchor: 'middle', size: 12, tone: 'muted', italic: true }));
        return items;
      },
      quiz: [
        { q: 'What does <code>continue</code> do?', options: ['Stops the loop', 'Skips to the next round', 'Starts the loop again from 0'], answer: 1, why: 'The rest of this round is skipped.' },
        { q: 'What does this print?', code: 'for (int i = 1; i <= 5; i++) {\n    if (i == 4) break;\n    System.out.println(i);\n}', options: ['1 2 3', '1 2 3 4', '1 2 3 5'], answer: 0, why: 'At i = 4, break leaves the loop before printing.' },
        { type: 'fill', q: 'Skip the even numbers.', code: 'for (int i = 1; i <= 6; i++) {\n    if (i % 2 == 0) {\n        ___;\n    }\n    System.out.println(i);\n}', answer: ['continue'], why: '<code>continue</code> skips the print for even numbers.' }
      ]
    }
  ],
  challenge: {
    title: 'Sum from 1 to 100',
    task: `
<p>Use a <code>for</code> loop to add all the numbers from 1 to 100 (1 + 2 + 3 + ... + 100).</p>
<ol>
<li>Make an <code>int</code> variable <code>sum</code> that starts at 0.</li>
<li>Loop with <code>i</code> from 1 to 100, and add <code>i</code> to <code>sum</code> each round.</li>
<li>After the loop, print <code>sum</code>.</li>
</ol>`,
    starter: `public class Main {
    public static void main(String[] args) {
        int sum = 0;

    }
}`,
    checks: [
      { re: /int\s+sum\s*=\s*0\s*;/, label: '<code>int sum = 0;</code>' },
      { re: /for\s*\(\s*int\s+i\s*=\s*1\s*;/, label: 'A for loop that starts at <code>i = 1</code>' },
      { re: /i\s*<=\s*100|i\s*<\s*101/, label: 'It goes up to 100' },
      { re: /sum\s*\+=\s*i|sum\s*=\s*sum\s*\+\s*i/, label: 'Add <code>i</code> to <code>sum</code>' },
      { re: /System\.out\.println\s*\(\s*sum\s*\)/, label: 'Print <code>sum</code>' }
    ],
    solution: `public class Main {
    public static void main(String[] args) {
        int sum = 0;
        for (int i = 1; i <= 100; i++) {
            sum += i;
        }
        System.out.println(sum);
    }
}`,
    output: '5050'
  }
});
