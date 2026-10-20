/* Logical operators are drawn as electric circuits: each condition is a switch,
   the lamp is the result. && = switches in a line, || = switches side by side. */
function LOGIC_SWITCH(id, x, y, w, label, on) {
  return B(id, x, y, w, 50, { tag: label, title: on ? 'true' : 'false', mono: true, size: 15, tone: on ? 'teal' : 'red', fill: on ? 'soft' : 'none', dash: !on });
}
function LOGIC_LAMP(x, y, on) {
  return [
    B('lamp', x, y, 64, 64, { r: 32, title: on ? 'ON' : 'off', tone: on ? 'accent' : 'muted', fill: on ? 'solid' : 'none', size: 14, hi: on }),
    T('lampl', x + 32, y + 84, 'result', { anchor: 'middle', size: 12, tone: 'muted' })
  ];
}
function LOGIC_TABLE(rows, cur, x, y, op) {
  var out = [];
  rows.forEach(function (r, i) {
    out.push(T('tr' + i, x, y + i * 22, r[0] + '  ' + op + '  ' + r[1] + '   →   ' + r[2], { mono: true, size: 12.5, bold: i === cur, tone: i === cur ? (r[2] === 'true' ? 'teal' : 'red') : 'muted' }));
  });
  return out;
}

addModule({
  id: 'c6',
  track: 'cs1',
  title: 'Logical Operators',
  blurb: 'Combine conditions with AND, OR and NOT to make smarter decisions.',
  lessons: [
    /* ------------------------------------------------------------ */
    {
      id: 'c6-1',
      title: 'AND (&&)',
      body: `
<p>Sometimes one condition is not enough. "You can drive if you are 18 or older <b>and</b> you have a license." Both parts must be true.</p>
<p>In Java, <b>AND</b> is written <code>&amp;&amp;</code>:</p>
~~~
if (age >= 18 && hasLicense) {
    System.out.println("You can drive");
}
~~~
<p><code>&amp;&amp;</code> gives <code>true</code> only when <b>both</b> sides are true. If even one side is false, the result is false.</p>
<div class="tblwrap"><table>
<tr><th>A</th><th>B</th><th>A &amp;&amp; B</th></tr>
<tr><td>true</td><td>true</td><td><b>true</b></td></tr>
<tr><td>true</td><td>false</td><td>false</td></tr>
<tr><td>false</td><td>true</td><td>false</td></tr>
<tr><td>false</td><td>false</td><td>false</td></tr>
</table></div>
<p>Picture an electric {{circuit|دائرة كهربائية}} with two switches in a line. The lamp lights only when <b>both</b> switches are closed.</p>
<div class="tip">Java is smart: if the left side of <code>&amp;&amp;</code> is false, it does not even check the right side. The answer is already false.</div>`,
      code: `int age = 25;
boolean hasLicense = true;
if (age >= 18 && hasLicense) {
    System.out.println("You can drive");
}`,
      steps: [
        { cap: 'Both conditions are true. The power flows through both switches, and the lamp lights.', line: [3, 4], out: 'You can drive' },
        { cap: 'If <code>hasLicense</code> is false, the second switch is open. No light.', line: 3, out: [], clear: true },
        { cap: 'If the first condition is false, the power stops right away.', line: 3, clear: true },
        { cap: 'Both false: no light, of course.', line: 3, clear: true },
        { cap: '<code>&amp;&amp;</code> is true in only <b>one</b> case: when both sides are true.', line: 3, clear: true }
      ],
      draw: function (k) {
        var rows = [['true', 'true', 'true'], ['true', 'false', 'false'], ['false', 'true', 'false'], ['false', 'false', 'false']];
        var r = rows[Math.min(k, 3)], a = r[0] === 'true', b = r[1] === 'true', on = a && b;
        var flow1 = true, flow2 = a, flow3 = a && b;
        return [
          T('pw', 20, 105, 'power', { size: 12, tone: 'muted', bold: true }),
          A('w1', 30, 115, 120, 115, { head: false, tone: flow1 ? 'accent' : 'muted' }),
          LOGIC_SWITCH('s1', 120, 90, 140, 'age >= 18', a),
          A('w2', 260, 115, 300, 115, { head: false, tone: flow2 ? 'accent' : 'muted' }),
          LOGIC_SWITCH('s2', 300, 90, 140, 'hasLicense', b),
          A('w3', 440, 115, 470, 115, { head: false, tone: flow3 ? 'accent' : 'muted' }),
          LOGIC_LAMP(470, 83, on),
          T('op', 280, 60, '&&  (AND)', { anchor: 'middle', mono: true, bold: true, size: 15, tone: 'accent' }),
          LOGIC_TABLE(rows, k === 4 ? 0 : k, 150, 240, '&&')
        ];
      },
      quiz: [
        { q: 'What is <code>true &amp;&amp; false</code>?', options: ['true', 'false'], answer: 1, why: 'AND needs both sides to be true.' },
        { type: 'fill', q: 'Print "OK" only if x is bigger than 0 AND smaller than 10.', code: 'if (x > 0 ___ x < 10) {\n    System.out.println("OK");\n}', answer: ['&&'], why: '<code>&amp;&amp;</code> means both must be true.' },
        { q: 'age = 16, hasLicense = true. Can the person drive with the code from this lesson?', options: ['Yes', 'No'], answer: 1, why: '16 >= 18 is false, so the whole && is false.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'c6-2',
      title: 'OR (||)',
      body: `
<p>"No work today if it is the weekend <b>or</b> a holiday." Here, <b>one</b> true part is enough.</p>
<p>In Java, <b>OR</b> is written <code>||</code> (two vertical lines):</p>
~~~
if (isWeekend || isHoliday) {
    System.out.println("No work today!");
}
~~~
<p><code>||</code> gives <code>true</code> when <b>at least one</b> side is true. It is false only when both sides are false.</p>
<div class="tblwrap"><table>
<tr><th>A</th><th>B</th><th>A || B</th></tr>
<tr><td>true</td><td>true</td><td><b>true</b></td></tr>
<tr><td>true</td><td>false</td><td><b>true</b></td></tr>
<tr><td>false</td><td>true</td><td><b>true</b></td></tr>
<tr><td>false</td><td>false</td><td>false</td></tr>
</table></div>
<p>In the circuit picture, OR is two switches side by side ({{in parallel|على التوازي}}). The power can go through <b>either</b> one.</p>
<div class="tip">On most keyboards, <code>|</code> is on the same key as the backslash <code>\\</code>. Use Shift.</div>`,
      code: `boolean isWeekend = false;
boolean isHoliday = true;
if (isWeekend || isHoliday) {
    System.out.println("No work today!");
}`,
      steps: [
        { cap: 'isWeekend is false, but isHoliday is true. One path is open, so the lamp lights.', line: [3, 4], out: 'No work today!' },
        { cap: 'Both true: the lamp lights too.', line: 3, clear: true, out: 'No work today!' },
        { cap: 'Only the first true: still lights.', line: 3, clear: true, out: 'No work today!' },
        { cap: 'Both false: the only case where <code>||</code> is false.', line: 3, clear: true },
      ],
      draw: function (k) {
        var rows = [['true', 'true', 'true'], ['true', 'false', 'true'], ['false', 'true', 'true'], ['false', 'false', 'false']];
        var map = [2, 0, 1, 3];
        var r = rows[map[k]], a = r[0] === 'true', b = r[1] === 'true', on = a || b;
        return [
          T('pw', 20, 140, 'power', { size: 12, tone: 'muted', bold: true }),
          A('w0', 30, 150, 110, 150, { head: false, tone: 'accent' }),
          A('wv1', 110, 80, 110, 220, { head: false, tone: 'accent' }),
          A('wa1', 110, 80, 190, 80, { head: false, tone: 'accent' }),
          A('wb1', 110, 220, 190, 220, { head: false, tone: 'accent' }),
          LOGIC_SWITCH('s1', 190, 55, 150, 'isWeekend', a),
          LOGIC_SWITCH('s2', 190, 195, 150, 'isHoliday', b),
          A('wa2', 340, 80, 410, 80, { head: false, tone: a ? 'accent' : 'muted' }),
          A('wb2', 340, 220, 410, 220, { head: false, tone: b ? 'accent' : 'muted' }),
          A('wv2', 410, 80, 410, 220, { head: false, tone: on ? 'accent' : 'muted' }),
          A('w3', 410, 150, 460, 150, { head: false, tone: on ? 'accent' : 'muted' }),
          LOGIC_LAMP(460, 118, on),
          T('op', 265, 32, '||  (OR)', { anchor: 'middle', mono: true, bold: true, size: 15, tone: 'accent' }),
          LOGIC_TABLE(rows, map[k], 30, 268, '||')
        ];
      },
      quiz: [
        { q: 'What is <code>false || true</code>?', options: ['true', 'false'], answer: 0, why: 'One true side is enough for OR.' },
        { q: 'When is <code>a || b</code> false?', options: ['When one side is false', 'Only when both sides are false', 'Never'], answer: 1, why: 'OR is false only if both are false.' },
        { type: 'fill', q: 'Print "Free" if the day is Friday or Saturday.', code: 'if (day.equals("Friday") ___ day.equals("Saturday")) {\n    System.out.println("Free");\n}', answer: ['||'], why: 'One of the two is enough, so use OR.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'c6-3',
      title: 'NOT (!) and combining',
      body: `
<p><b>NOT</b> is written <code>!</code>. It {{flips|يقلب}} a boolean: true becomes false, and false becomes true.</p>
~~~
boolean isRaining = false;
if (!isRaining) {
    System.out.println("Let's go outside");
}
~~~
<p>Read <code>!isRaining</code> as "not raining".</p>
<h3>Combining operators</h3>
<p>You can mix them, like in math. Java does them in this order:</p>
<ol>
<li><code>!</code> (NOT) first</li>
<li>then <code>&amp;&amp;</code> (AND)</li>
<li>then <code>||</code> (OR)</li>
</ol>
<p>Use parentheses to make the order clear and easy to read:</p>
~~~
if ((age >= 18 && hasTicket) || isVIP) {
    System.out.println("You can enter");
}
~~~
<div class="tip">Don't confuse <code>!</code> with <code>!=</code>. <code>!x</code> flips a boolean. <code>a != b</code> asks "are a and b different?".</div>`,
      code: `boolean isRaining = false;
if (!isRaining) {
    System.out.println("Let's go outside");
}`,
      steps: [
        { cap: 'isRaining is false. <code>!</code> flips it to <b>true</b>, so the lamp lights.', line: [2, 3], out: "Let's go outside" },
        { cap: 'If isRaining is true, <code>!</code> makes it false. No light, we stay home.', line: 2, clear: true },
        { cap: 'Combining: <code>(true &amp;&amp; false) || true</code>. Inside the parentheses first: false. Then <code>false || true</code> = <b>true</b>.', clear: true }
      ],
      draw: function (k) {
        if (k === 2) return [
          T('e1', 40, 70, '(true && false) || true', { mono: true, bold: true, size: 19 }),
          B('g1', 36, 82, 182, 6, { tone: 'blue', fill: 'solid', r: 3 }),
          T('e2', 40, 150, '=       false     || true', { mono: true, size: 19, tone: 'blue' }),
          T('e2n', 360, 150, '← () first', { size: 13, tone: 'blue' }),
          T('e3', 40, 230, '=       true', { mono: true, bold: true, size: 19, tone: 'teal' }),
          T('e3n', 360, 230, '← OR: one true is enough', { size: 13, tone: 'teal' }),
          T('ord', 280, 310, 'order:  !   then   &&   then   ||', { anchor: 'middle', mono: true, bold: true, tone: 'accent', size: 14 })
        ];
        var rain = k === 1;
        return [
          LOGIC_SWITCH('s1', 40, 110, 140, 'isRaining', rain),
          A('w1', 180, 135, 230, 135, { head: false, tone: 'accent' }),
          B('not', 230, 105, 80, 60, { title: '!', mono: true, size: 28, tone: 'blue', fill: 'solid', tag: 'NOT: flip' }),
          A('w2', 310, 135, 350, 135, { head: false, tone: !rain ? 'accent' : 'muted' }),
          LOGIC_SWITCH('s2', 350, 110, 120, '!isRaining', !rain),
          A('w3', 470, 135, 480, 135, { head: false, tone: !rain ? 'accent' : 'muted' }),
          LOGIC_LAMP(480, 103, !rain),
          T('rule', 280, 270, '!true  →  false        !false  →  true', { anchor: 'middle', mono: true, bold: true, size: 14, tone: 'accent' })
        ];
      },
      quiz: [
        { q: 'What is <code>!true</code>?', options: ['true', 'false'], answer: 1, why: '! flips the value.' },
        { q: 'What is <code>true || false &amp;&amp; false</code>?', options: ['true', 'false'], answer: 0, why: '&& comes first: false && false = false. Then true || false = true.' },
        { type: 'fill', q: 'Print "Closed" when the shop is NOT open.', code: 'if (___isOpen) {\n    System.out.println("Closed");\n}', answer: ['!'], why: '<code>!isOpen</code> means "not open".' }
      ]
    }
  ],
  challenge: {
    title: 'In range',
    task: `
<p>Make an <code>int</code> variable <code>x</code> with the value <code>15</code>.</p>
<p>If <code>x</code> is between 10 and 20 (10 and 20 are included), print <code>In range</code>. Use one <code>if</code> with <code>&amp;&amp;</code>.</p>`,
    starter: `public class Main {
    public static void main(String[] args) {
        int x = 15;

    }
}`,
    checks: [
      { re: /int\s+x\s*=\s*\d+\s*;/, label: 'An <code>int x</code> variable' },
      { re: /x\s*>=\s*10/, label: 'Check <code>x >= 10</code>' },
      { re: /x\s*<=\s*20/, label: 'Check <code>x <= 20</code>' },
      { re: /if\s*\([^)]*&&[^)]*\)/, label: 'Join both checks with <code>&amp;&amp;</code> in one if' },
      { re: /System\.out\.println\s*\(\s*"In range"\s*\)/, label: 'Print <code>"In range"</code>' }
    ],
    solution: `public class Main {
    public static void main(String[] args) {
        int x = 15;
        if (x >= 10 && x <= 20) {
            System.out.println("In range");
        }
    }
}`,
    output: 'In range'
  }
});
