addModule({
  id: 'c2',
  track: 'cs1',
  title: 'Variables',
  blurb: 'Keep data in named boxes, choose the right type, and do math.',
  lessons: [
    /* ------------------------------------------------------------ */
    {
      id: 'c2-1',
      title: 'What is a variable?',
      body: `
<p>A <b>variable</b> is a box with a name. It keeps one value, so you can use it later.</p>
~~~
int age = 20;
~~~
<p>This one line has three parts:</p>
<ul>
<li><code>int</code> is the <b>type</b>: what kind of value goes in the box. <code>int</code> means a whole number.</li>
<li><code>age</code> is the <b>name</b> of the box.</li>
<li><code>= 20</code> puts the <b>value</b> 20 in the box.</li>
</ul>
<p>You can change the value later. The old value is gone, and the new one takes its place:</p>
~~~
age = 21;
~~~
<p>Notice: we don't write <code>int</code> again. The box already exists.</p>
<h3>Rules for names</h3>
<ul>
<li>Start with a letter. No spaces. You can use letters, numbers and <code>_</code>.</li>
<li>Names are case-sensitive: <code>age</code> and <code>Age</code> are two different variables.</li>
<li>You can't use Java keywords like <code>int</code> or <code>class</code> as names.</li>
<li>By {{convention|عُرف متفق عليه}}, use <b>camelCase</b>: <code>myAge</code>, <code>totalPrice</code>.</li>
</ul>`,
      code: `int age = 20;
System.out.println(age);
age = 21;
System.out.println(age);`,
      steps: [
        { cap: '<code>int age = 20;</code> makes a box named <b>age</b> of type <b>int</b>, with the value <b>20</b>.', line: 1 },
        { cap: 'Printing the variable shows the value inside the box (no quotes!).', line: 2, out: '20' },
        { cap: '<code>age = 21;</code> puts a new value in the box. The old value 20 is thrown away.', line: 3 },
        { cap: 'Now the box holds 21.', line: 4, out: '21' }
      ],
      draw: function (k) {
        var v = k >= 2 ? '21' : '20';
        return [
          B('age', 180, 100, 170, 90, { tag: 'int age', title: v, mono: true, size: 30, tone: 'accent', fill: 'soft', hi: k === 0 || k === 2, from: [180, 30] }),
          T('p1', 390, 110, 'type:  int', { mono: true, size: 13, tone: 'blue', bold: true }),
          T('p2', 390, 140, 'name:  age', { mono: true, size: 13, tone: 'teal', bold: true }),
          T('p3', 390, 170, 'value: ' + v, { mono: true, size: 13, tone: 'accent', bold: true }),
          k === 2 && B('old', 230, 280, 70, 40, { title: '20', mono: true, size: 18, tone: 'red', fill: 'soft', from: [230, 125], o: 0.6 }),
          k === 2 && T('oldl', 310, 306, 'old value: gone', { tone: 'red', size: 12, bold: true }),
          (k === 1 || k === 3) && A('rd', 265, 192, 265, 250, { tone: 'teal', label: 'read', la: 'start', lx: 10 }),
          (k === 1 || k === 3) && T('pv', 265, 274, v, { anchor: 'middle', mono: true, bold: true, size: 18, tone: 'teal' })
        ];
      },
      quiz: [
        { q: 'In <code>int score = 50;</code>, what is the name of the variable?', options: ['`int`', '`score`', '`50`'], answer: 1, why: 'The type comes first, then the name, then the value.' },
        { type: 'fill', q: 'Make a variable <code>count</code> with the value 3, then change it to 4.', code: '___ count = 3;\ncount ___ 4;', answer: ['int', '='], why: 'Write the type only once, when you create the variable.' },
        { q: 'Which name is NOT allowed?', options: ['`myAge`', '`total_2`', '`2total`'], answer: 2, why: 'A name cannot start with a number.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'c2-2',
      title: 'Data types',
      body: `
<p>Every variable has a <b>type</b>. The type says what kind of value the box can hold. These are the most common ones:</p>
<div class="tblwrap"><table>
<tr><th>Type</th><th>For</th><th>Example</th></tr>
<tr><td><code>int</code></td><td>whole numbers</td><td><code>int count = 5;</code></td></tr>
<tr><td><code>double</code></td><td>numbers with a {{decimal point|فاصلة عشرية}}</td><td><code>double price = 9.99;</code></td></tr>
<tr><td><code>boolean</code></td><td><code>true</code> or <code>false</code> only</td><td><code>boolean isOpen = true;</code></td></tr>
<tr><td><code>char</code></td><td>one single character, in <b>single</b> quotes</td><td><code>char grade = 'A';</code></td></tr>
<tr><td><code>String</code></td><td>text, in <b>double</b> quotes</td><td><code>String name = "Sara";</code></td></tr>
</table></div>
<div class="warn">Java is <b>strict</b> about types. <code>int count = 9.99;</code> is an error: 9.99 does not fit in an int box.</div>
<div class="tip"><code>String</code> starts with a capital S. That is because it is a <b>class</b>, not a simple type. You will learn about classes in CS2.</div>
<p>There are a few more number types, like <code>long</code> (very big whole numbers) and <code>float</code> (smaller decimals), but <code>int</code> and <code>double</code> are the ones you will use most.</p>`,
      code: `int count = 5;
double price = 9.99;
boolean isOpen = true;
char grade = 'A';
String name = "Sara";`,
      steps: [
        { cap: '<code>int</code>: a whole number, like 5, -12 or 1000.', line: 1 },
        { cap: '<code>double</code>: a number with a decimal point, like 9.99.', line: 2 },
        { cap: '<code>boolean</code>: only two possible values, <code>true</code> or <code>false</code>.', line: 3 },
        { cap: '<code>char</code>: one character, in single quotes <code>\' \'</code>.', line: 4 },
        { cap: '<code>String</code>: text of any length, in double quotes <code>" "</code>.', line: 5 },
        { cap: 'Five boxes, five types. The type decides what can go in each box.' }
      ],
      draw: function (k) {
        var data = [
          ['int', 'int count', '5', 'whole numbers', 20, 40, 160, 'blue'],
          ['dbl', 'double price', '9.99', 'decimal numbers', 200, 40, 160, 'teal'],
          ['bool', 'boolean isOpen', 'true', 'true or false', 380, 40, 160, 'accent'],
          ['chr', 'char grade', "'A'", 'one character', 20, 185, 160, 'muted'],
          ['str', 'String name', '"Sara"', 'text (many characters)', 200, 185, 340, 'red']
        ];
        var items = [];
        data.forEach(function (d, i) {
          if (k < i) return;
          items.push(B(d[0], d[4], d[5], d[6], 74, { tag: d[1], title: d[2], mono: true, size: 20, tone: d[7], hi: k === i, from: [d[4], d[5] - 30] }));
          items.push(T(d[0] + 'd', d[4] + d[6] / 2, d[5] + 96, d[3], { anchor: 'middle', size: 13, tone: k === i ? d[7] : 'muted', bold: k === i }));
        });
        if (k === 5) items.push(T('note', 280, 322, "char uses ' '   ·   String uses \" \"", { anchor: 'middle', mono: true, bold: true, tone: 'accent', size: 13 }));
        return items;
      },
      quiz: [
        { q: 'Which type is best for a price like 4.50?', options: ['`int`', '`double`', '`boolean`'], answer: 1, why: 'Decimal numbers need <code>double</code>.' },
        { q: 'Which line is correct?', options: ["`char c = \"A\";`", "`char c = 'A';`", "`char c = 'AB';`"], answer: 1, why: 'A char is one character in single quotes.' },
        { type: 'fill', q: 'Choose the right types.', code: '___ isStudent = true;\n___ city = "Riyadh";', answer: ['boolean', 'String'], why: 'true/false is a <code>boolean</code>, text is a <code>String</code>.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'c2-3',
      title: 'Math operators',
      body: `
<p>Java can do math with these {{operators|العمليات}}:</p>
<div class="tblwrap"><table>
<tr><th>Operator</th><th>Meaning</th><th>Example</th><th>Result</th></tr>
<tr><td><code>+</code></td><td>add</td><td><code>7 + 2</code></td><td>9</td></tr>
<tr><td><code>-</code></td><td>subtract</td><td><code>7 - 2</code></td><td>5</td></tr>
<tr><td><code>*</code></td><td>multiply</td><td><code>7 * 2</code></td><td>14</td></tr>
<tr><td><code>/</code></td><td>divide</td><td><code>7 / 2</code></td><td>3 (!)</td></tr>
<tr><td><code>%</code></td><td>{{remainder|الباقي}} (modulo)</td><td><code>7 % 2</code></td><td>1</td></tr>
</table></div>
<h3>Dividing whole numbers</h3>
<p>When both numbers are <code>int</code>, the answer is also an <code>int</code>. The decimal part is cut off: <code>7 / 2</code> is <b>3</b>, not 3.5.</p>
<p>To get 3.5, use at least one <code>double</code>: <code>7.0 / 2</code> is <b>3.5</b>.</p>
<h3>The remainder: %</h3>
<p><code>%</code> gives what is <b>left over</b> after dividing. Put 7 apples in bags of 2: you get 3 full bags, and <b>1</b> apple is left. So <code>7 % 2</code> is 1.</p>
<div class="tip"><code>%</code> is very useful: if <code>n % 2</code> is 0, the number is even. If it is 1, the number is odd.</div>
<p>Java follows the normal math order: <code>*</code>, <code>/</code> and <code>%</code> come before <code>+</code> and <code>-</code>. Use parentheses to change the order: <code>(2 + 3) * 4</code> is 20.</p>`,
      code: `int a = 7, b = 2;
System.out.println(a + b);   // 9
System.out.println(a - b);   // 5
System.out.println(a * b);   // 14
System.out.println(a / b);   // 3
System.out.println(a % b);   // 1
System.out.println(7.0 / 2); // 3.5`,
      steps: [
        { cap: '<code>a + b</code>: add. 7 + 2 = 9.', line: 2, out: '9' },
        { cap: '<code>a - b</code>: subtract. 7 - 2 = 5.', line: 3, out: '5' },
        { cap: '<code>a * b</code>: multiply. 7 × 2 = 14.', line: 4, out: '14' },
        { cap: '<code>a / b</code>: 7 apples in groups of 2 → <b>3</b> full groups. Both are int, so the answer is an int.', line: 5, out: '3' },
        { cap: '<code>a % b</code>: what is <b>left over</b>? One apple. 7 % 2 = <b>1</b>.', line: 6, out: '1' },
        { cap: '<code>7.0 / 2</code>: one number is a double, so the answer is a double: <b>3.5</b>.', line: 7, out: '3.5' }
      ],
      draw: function (k) {
        var ex = ['7 + 2 = 9', '7 - 2 = 5', '7 * 2 = 14', '7 / 2 = 3', '7 % 2 = 1', '7.0 / 2 = 3.5'][k];
        var items = [
          B('a', 30, 24, 90, 40, { tag: 'int a', title: '7', mono: true, size: 16, tone: 'blue' }),
          B('b', 135, 24, 90, 40, { tag: 'int b', title: '2', mono: true, size: 16, tone: 'blue' }),
          T('ex', 395, 54, ex, { anchor: 'middle', mono: true, bold: true, size: 24, tone: 'accent' })
        ];
        if (k === 3 || k === 4) {
          for (var j = 0; j < 3; j++) items.push(B('g' + j, 40 + j * 125, 130, 105, 70, { tone: k === 3 ? 'teal' : 'muted', fill: 'none', dash: true, r: 14, z: 0, tag: 'group ' + (j + 1) }));
          for (var i = 0; i < 7; i++) {
            var left = i === 6;
            var x = left ? 440 : 40 + Math.floor(i / 2) * 125 + 12 + (i % 2) * 46, y = 145;
            items.push(B('d' + i, x, y, 36, 40, { r: 18, tone: left ? (k === 4 ? 'accent' : 'muted') : (k === 3 ? 'teal' : 'muted'), fill: 'solid', hi: left && k === 4 }));
          }
          items.push(T('res', 280, 250, k === 3 ? '3 full groups  →  7 / 2 = 3' : '1 left over  →  7 % 2 = 1', { anchor: 'middle', bold: true, size: 15, tone: k === 3 ? 'teal' : 'accent' }));
          items.push(T('lft', 458, 210, 'left over', { anchor: 'middle', size: 12, tone: k === 4 ? 'accent' : 'muted', bold: true }));
        } else if (k === 5) {
          items.push(T('dn', 280, 170, 'int / int  →  int     (7 / 2 = 3)', { anchor: 'middle', mono: true, size: 14, tone: 'muted' }));
          items.push(T('dd', 280, 210, 'double / int  →  double     (7.0 / 2 = 3.5)', { anchor: 'middle', mono: true, size: 14, bold: true, tone: 'teal' }));
        } else {
          items.push(T('sym', 280, 190, ['+', '-', '×'][k], { anchor: 'middle', bold: true, size: 70, tone: 'blue' }));
        }
        return items;
      },
      quiz: [
        { q: 'What is <code>10 / 4</code> in Java (both are int)?', options: ['2.5', '2', '3'], answer: 1, why: 'int / int gives an int. The .5 is cut off.' },
        { q: 'What is <code>10 % 4</code>?', options: ['2', '2.5', '0'], answer: 0, why: '4 goes into 10 two times (8), and 2 is left over.' },
        { q: 'What is <code>2 + 3 * 4</code>?', options: ['20', '14', '24'], answer: 1, why: '* comes first: 3 * 4 = 12, then 2 + 12 = 14.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'c2-4',
      title: 'Increment and assignment',
      body: `
<p>Programs often change a variable using its own value. For example, add 1 to a counter. Java has short ways to write this.</p>
<div class="tblwrap"><table>
<tr><th>Short</th><th>Long version</th><th>Meaning</th></tr>
<tr><td><code>x++</code></td><td><code>x = x + 1</code></td><td>add 1 ({{increment|زيادة}})</td></tr>
<tr><td><code>x--</code></td><td><code>x = x - 1</code></td><td>subtract 1 ({{decrement|نقصان}})</td></tr>
<tr><td><code>x += 4</code></td><td><code>x = x + 4</code></td><td>add 4</td></tr>
<tr><td><code>x -= 3</code></td><td><code>x = x - 3</code></td><td>subtract 3</td></tr>
<tr><td><code>x *= 2</code></td><td><code>x = x * 2</code></td><td>multiply by 2</td></tr>
<tr><td><code>x /= 2</code></td><td><code>x = x / 2</code></td><td>divide by 2</td></tr>
</table></div>
<p>How do you read <code>x = x + 1</code>? Not like math! The <code>=</code> means "put into". First Java calculates the right side (<code>x + 1</code>), then it puts the result back into <code>x</code>.</p>
<div class="tip"><b>Prefix and postfix:</b> <code>++x</code> adds 1 <b>before</b> the value is used, and <code>x++</code> adds 1 <b>after</b>. When the line is only <code>x++;</code>, both are the same.</div>`,
      code: `int x = 5;
x++;        // 6
x += 4;     // 10
x -= 3;     // 7
x *= 2;     // 14
x--;        // 13`,
      steps: [
        { cap: 'x starts at 5.', line: 1 },
        { cap: '<code>x++</code> adds 1. Now x is 6.', line: 2 },
        { cap: '<code>x += 4</code> means x = x + 4. 6 + 4 = 10.', line: 3 },
        { cap: '<code>x -= 3</code>: 10 - 3 = 7.', line: 4 },
        { cap: '<code>x *= 2</code>: 7 × 2 = 14.', line: 5 },
        { cap: '<code>x--</code> subtracts 1: 13. The history row shows every value x had.', line: 6 }
      ],
      draw: function (k) {
        var vals = [5, 6, 10, 7, 14, 13];
        var ops = ['int x = 5', 'x++   →   x = x + 1', 'x += 4   →   x = x + 4', 'x -= 3   →   x = x - 3', 'x *= 2   →   x = x * 2', 'x--   →   x = x - 1'];
        return [
          T('op', 280, 60, ops[k], { anchor: 'middle', mono: true, bold: true, size: 17, tone: 'accent' }),
          B('x', 195, 100, 170, 90, { tag: 'int x', title: String(vals[k]), mono: true, size: 34, tone: 'accent', hi: true }),
          ARR('h', 110, 250, vals.slice(0, k + 1), { cw: 70, ch: 44, name: 'history', idx: false, drop: k, hl: k, size: 15 })
        ];
      },
      quiz: [
        { q: 'x is 8. What is x after <code>x += 2;</code>?', options: ['2', '10', '16'], answer: 1, why: 'x = x + 2 = 8 + 2.' },
        { type: 'fill', q: 'Write the short version of <code>count = count + 1;</code>', code: 'count___;', answer: ['++| += 1|+=1'], why: '<code>count++</code> adds 1.' },
        { q: 'n is 5. What is n after <code>n *= 3;</code>?', options: ['8', '15', '53'], answer: 1, why: 'n = n * 3 = 15.' }
      ]
    }
  ],
  challenge: {
    title: 'Area of a rectangle',
    task: `
<p>A rectangle is 8 wide and 5 high.</p>
<ol>
<li>Make an <code>int</code> variable <code>width</code> with the value 8.</li>
<li>Make an <code>int</code> variable <code>height</code> with the value 5.</li>
<li>Make an <code>int</code> variable <code>area</code> = width times height.</li>
<li>Print <code>area</code>.</li>
</ol>`,
    starter: `public class Main {
    public static void main(String[] args) {
        // your variables here
    }
}`,
    checks: [
      { re: /int\s+width\s*=\s*8\s*;/, label: '<code>int width = 8;</code>' },
      { re: /int\s+height\s*=\s*5\s*;/, label: '<code>int height = 5;</code>' },
      { re: /int\s+area\s*=\s*(width\s*\*\s*height|height\s*\*\s*width)\s*;/, label: '<code>int area = width * height;</code>' },
      { re: /System\.out\.println\s*\(\s*area\s*\)/, label: 'Print <code>area</code>' }
    ],
    solution: `public class Main {
    public static void main(String[] args) {
        int width = 8;
        int height = 5;
        int area = width * height;
        System.out.println(area);
    }
}`,
    output: '40'
  }
});
