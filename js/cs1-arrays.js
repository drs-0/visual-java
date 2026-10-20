addModule({
  id: 'c8',
  track: 'cs1',
  title: 'Arrays',
  blurb: 'Keep many values in one variable, and visit them all with a loop.',
  lessons: [
    /* ------------------------------------------------------------ */
    {
      id: 'c8-1',
      title: 'Creating arrays',
      body: `
<p>Imagine you need the scores of 30 students. 30 variables? No! Use an <b>array</b>: one variable that holds many values of the <b>same type</b>.</p>
<h3>Two ways to create an array</h3>
~~~
int[] scores = new int[4];        // 4 empty boxes (all 0)
int[] nums = {4, 8, 15, 16};      // 4 boxes with values
~~~
<p>The <code>[]</code> after the type means "array of". <code>new int[4]</code> makes 4 boxes. Number boxes start with <code>0</code>, String boxes start with <code>null</code>.</p>
<h3>Index</h3>
<p>Each box has a position number, the <b>index</b>. The first index is <b>0</b>, not 1. So the last index is <code>length - 1</code>.</p>
~~~
scores[0] = 90;                    // put 90 in the first box
System.out.println(scores[0]);     // read it
System.out.println(scores.length); // 4
~~~
<div class="warn">An array has a <b>fixed size</b>. After you create it, you can't add more boxes. And <code>scores[4]</code> on a 4-box array is an error: <code>ArrayIndexOutOfBoundsException</code>.</div>`,
      code: `int[] scores = new int[4];
scores[0] = 90;
scores[2] = 75;
System.out.println(scores[2]);
System.out.println(scores.length);`,
      steps: [
        { cap: '<code>new int[4]</code> creates 4 boxes. Each one starts at 0. The index goes from 0 to 3.', line: 1 },
        { cap: '<code>scores[0] = 90</code> puts 90 in box number 0, the first box.', line: 2 },
        { cap: '<code>scores[2] = 75</code> puts 75 in box number 2. That is the <b>third</b> box!', line: 3 },
        { cap: '<code>scores[2]</code> reads the value of box 2.', line: 4, out: '75' },
        { cap: '<code>scores.length</code> is the number of boxes: 4. The last index is 4 − 1 = 3.', line: 5, out: '4' }
      ],
      draw: function (k) {
        var vals = [0, 0, 0, 0];
        if (k >= 1) vals[0] = 90;
        if (k >= 2) vals[2] = 75;
        var hl = [null, 0, 2, 2, null][k];
        var op = ['int[] scores = new int[4]', 'scores[0] = 90', 'scores[2] = 75', 'scores[2]  →  75', 'scores.length  →  4'][k];
        return [
          T('op', 280, 60, op, { anchor: 'middle', mono: true, bold: true, size: 17, tone: 'accent' }),
          ARR('s', 120, 120, vals, { cw: 85, ch: 64, name: 'scores', hl: hl, size: 22, done: k === 4 ? [0, 1, 2, 3] : null }),
          k === 4 && A('len', 120, 230, 460, 230, { tone: 'teal', head: false }),
          k === 4 && T('lent', 290, 255, 'length = 4 boxes   ·   last index = 3', { anchor: 'middle', bold: true, tone: 'teal', size: 13 }),
          k === 0 && T('zero', 290, 240, 'a new int array is full of 0', { anchor: 'middle', tone: 'muted', size: 13 })
        ];
      },
      quiz: [
        { q: 'What is the index of the first element?', options: ['0', '1', '-1'], answer: 0, why: 'Array indexes always start at 0.' },
        { type: 'fill', q: 'Create an array of 10 doubles.', code: 'double[] prices = new double[___];', answer: ['10'], why: 'The number in [ ] is the size.' },
        { q: 'An array has length 5. Which index does NOT exist?', options: ['0', '4', '5'], answer: 2, why: 'The indexes are 0 to 4.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'c8-2',
      title: 'Looping over an array',
      body: `
<p>To do something with <b>every</b> element, use a <code>for</code> loop. The counter <code>i</code> is used as the index:</p>
~~~
String[] fruits = {"Apple", "Banana", "Cherry"};
for (int i = 0; i < fruits.length; i++) {
    System.out.println(i + ": " + fruits[i]);
}
~~~
<ul>
<li><code>i</code> starts at 0, the first index.</li>
<li>The condition <code>i &lt; fruits.length</code> stops the loop after the last index.</li>
<li><code>fruits[i]</code> is the element at the current index.</li>
</ul>
<p>Watch the drawing: the list is on the left, its index is next to each box, and the arrow is <code>i</code>. Each round, <code>i</code> goes up by 1 and the arrow moves down to the next box.</p>
<div class="tip">Always use <code>array.length</code> in the condition, not a fixed number like 3. Then the loop still works if the array changes size.</div>`,
      code: `String[] fruits = {"Apple", "Banana", "Cherry"};
for (int i = 0; i < fruits.length; i++) {
    System.out.println(i + ": " + fruits[i]);
}`,
      steps: [
        { cap: 'An array with 3 elements. Next to each box is its index: 0, 1, 2.', line: 1 },
        { cap: '<code>i = 0</code>. 0 &lt; 3 is true. Print fruits[0].', line: [2, 3], out: '0: Apple' },
        { cap: '<code>i++</code> → <code>i = 1</code>. The arrow moves down. Print fruits[1].', line: [2, 3], out: '1: Banana' },
        { cap: '<code>i = 2</code>, the last index. Print fruits[2].', line: [2, 3], out: '2: Cherry' },
        { cap: '<code>i = 3</code>. 3 &lt; 3 is <b>false</b>. The loop ends. (fruits[3] does not exist.)', line: 2 }
      ],
      draw: function (k) {
        var vals = ['"Apple"', '"Banana"', '"Cherry"'];
        var i = k >= 1 ? k - 1 : null;
        var done = []; if (i != null) for (var d = 0; d < Math.min(i, 3); d++) done.push(d);
        return [
          ARR('f', 70, 50, vals, { dir: 'v', cw: 140, ch: 66, name: 'fruits', hl: i != null && i <= 2 ? i : null, done: done, size: 17 }),
          i != null && P('ptr', 268, 50 + i * 66 + 33, 'i = ' + i, { dir: 'left', len: 40, tone: i > 2 ? 'red' : 'accent' }),
          T('len', 365, 70, 'fruits.length = 3', { mono: true, size: 13, tone: 'muted' }),
          i != null && T('cond', 365, 100, i + ' < 3  →  ' + (i < 3 ? 'true' : 'false'), { mono: true, bold: true, size: 13, tone: i < 3 ? 'teal' : 'red' }),
          i != null && i <= 2 && T('now', 365, 130, 'fruits[' + i + '] = ' + vals[i], { mono: true, size: 13, tone: 'accent', bold: true })
        ];
      },
      quiz: [
        { q: 'Why do we write <code>i &lt; fruits.length</code> and not <code>i &lt;= fruits.length</code>?', options: ['It is faster', 'The last index is length − 1', 'Java does not allow <='], answer: 1, why: 'With <=, i would reach length, an index that does not exist.' },
        { type: 'fill', q: 'Print every number in the array.', code: 'int[] a = {2, 4, 6};\nfor (int i = 0; i < a.___; i++) {\n    System.out.println(a[___]);\n}', answer: ['length', 'i'], why: 'Loop until <code>a.length</code> and use <code>i</code> as the index.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'c8-3',
      title: 'The for-each loop',
      body: `
<p>When you only need the <b>values</b> (not the index), there is a shorter loop: the <b>for-each</b> loop.</p>
~~~
int[] nums = {3, 7, 2, 9};
for (int n : nums) {
    System.out.println(n);
}
~~~
<p>Read it as: "for each <code>n</code> in <code>nums</code>". Each round, <code>n</code> gets the next value. You don't need <code>i</code>, <code>length</code> or <code>[ ]</code>.</p>
<h3>Example: find the biggest number</h3>
<p>Start with the first value as the "best so far". Then look at every value. If it is bigger, it becomes the new best.</p>
~~~
int max = nums[0];
for (int n : nums) {
    if (n > max) {
        max = n;
    }
}
~~~
<div class="tip">for-each is great for reading. But you can't use it to <b>change</b> the boxes of the array, and you don't know the index. For those, use a normal <code>for</code> loop.</div>`,
      code: `int[] nums = {3, 7, 2, 9};
int max = nums[0];
for (int n : nums) {
    if (n > max) {
        max = n;
    }
}
System.out.println(max);`,
      steps: [
        { cap: 'Start: <code>max = nums[0]</code>, so max is 3.', line: 2 },
        { cap: 'n = 3. Is 3 > 3? No. max stays 3.', line: [3, 4] },
        { cap: 'n = 7. Is 7 > 3? <b>Yes</b>. max becomes 7.', line: [3, 4, 5] },
        { cap: 'n = 2. Is 2 > 7? No.', line: [3, 4] },
        { cap: 'n = 9. Is 9 > 7? <b>Yes</b>. max becomes 9.', line: [3, 4, 5] },
        { cap: 'All values checked. The biggest is 9.', line: 8, out: '9' }
      ],
      draw: function (k) {
        var vals = [3, 7, 2, 9];
        var maxv = [3, 3, 7, 7, 9, 9][k];
        var cur = k >= 1 && k <= 4 ? k - 1 : null;
        var bigger = cur != null && vals[cur] > [3, 3, 3, 7, 7][k];
        var items = [ARR('n', 110, 110, vals, { cw: 85, ch: 64, name: 'nums', hl: cur, done: k === 5 ? [3] : null, size: 22 })];
        if (cur != null) items.push(P('ptr', 110 + cur * 85 + 42, 106, 'n = ' + vals[cur], { dir: 'down', len: 30 }));
        items.push(B('max', 210, 230, 140, 70, { tag: 'int max', title: String(maxv), mono: true, size: 26, tone: 'teal', fill: k === 5 ? 'solid' : 'soft', hi: bigger }));
        if (cur != null) items.push(T('cmp', 440, 262, vals[cur] + ' > ' + [3, 3, 3, 7, 7][k] + ' ?  ' + (bigger ? 'yes' : 'no'), { anchor: 'middle', mono: true, bold: true, tone: bigger ? 'teal' : 'muted', size: 15 }));
        return items;
      },
      quiz: [
        { q: 'In <code>for (String s : names)</code>, what is <code>s</code>?', options: ['The index', 'Each value of the array, one by one', 'The length'], answer: 1, why: 'Each round, s gets the next element.' },
        { type: 'fill', q: 'Write a for-each loop over the array <code>prices</code>.', code: 'double[] prices = {1.5, 2.0, 3.25};\nfor (double p ___ prices) {\n    System.out.println(p);\n}', answer: [':'], why: 'for-each uses a colon: <code>for (type x : array)</code>.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'c8-4',
      title: '2D arrays',
      body: `
<p>A <b>2D array</b> is an array of arrays. Think of a table with <b>rows</b> and <b>columns</b>, like a spreadsheet or a chessboard.</p>
~~~
int[][] grid = {
    {1, 2, 3},
    {4, 5, 6}
};
~~~
<p>This grid has 2 rows and 3 columns. To reach one box, give two indexes: first the <b>row</b>, then the <b>column</b>:</p>
~~~
grid[1][2]   // row 1, column 2 → 6
grid[0][1] = 9;   // change row 0, column 1
~~~
<ul>
<li><code>grid.length</code> is the number of rows (2).</li>
<li><code>grid[0].length</code> is the number of columns in row 0 (3).</li>
</ul>
<div class="tip">To visit every box, use a loop inside a loop: the outer loop goes over the rows, the inner loop goes over the columns.</div>`,
      code: `int[][] grid = {
    {1, 2, 3},
    {4, 5, 6}
};
System.out.println(grid[1][2]);
grid[0][1] = 9;`,
      steps: [
        { cap: 'A table with 2 rows and 3 columns. Rows and columns both start at index 0.', line: '1-4' },
        { cap: '<code>grid[1]</code>: first, pick <b>row 1</b> (the second row).', line: 5 },
        { cap: '<code>grid[1][2]</code>: then pick <b>column 2</b> in that row. The value is 6.', line: 5, out: '6' },
        { cap: '<code>grid[0][1] = 9</code>: row 0, column 1 gets the new value 9.', line: 6 },
        { cap: '<code>grid.length</code> = 2 (rows). <code>grid[0].length</code> = 3 (columns).' }
      ],
      draw: function (k) {
        var vals = [[1, k >= 3 ? 9 : 2, 3], [4, 5, 6]];
        var items = [];
        for (var c = 0; c < 3; c++) items.push(T('ch' + c, 195 + c * 95, 72, 'col [' + c + ']', { anchor: 'middle', mono: true, size: 12, tone: k === 2 && c === 2 ? 'accent' : 'muted', bold: k === 2 && c === 2 }));
        for (var r = 0; r < 2; r++) {
          items.push(T('rh' + r, 135, 125 + r * 85, 'row [' + r + ']', { anchor: 'end', mono: true, size: 12, tone: (k === 1 || k === 2) && r === 1 ? 'accent' : 'muted', bold: (k === 1 || k === 2) && r === 1 }));
          for (var c2 = 0; c2 < 3; c2++) {
            var inRow = (k === 1 || k === 2) && r === 1, hit = (k === 2 && r === 1 && c2 === 2) || (k === 3 && r === 0 && c2 === 1);
            items.push(B('g' + r + c2, 150 + c2 * 95, 85 + r * 85, 90, 78, { title: String(vals[r][c2]), mono: true, size: 24, r: 4, tone: hit ? 'accent' : inRow ? 'blue' : 'muted', fill: hit ? 'solid' : 'soft', hi: hit }));
          }
        }
        if (k === 2) items.push(T('res', 290, 290, 'grid[1][2]  →  6', { anchor: 'middle', mono: true, bold: true, tone: 'accent', size: 16 }));
        if (k === 3) items.push(T('res', 290, 290, 'grid[0][1] = 9', { anchor: 'middle', mono: true, bold: true, tone: 'accent', size: 16 }));
        if (k === 4) {
          items.push(A('rl', 140, 85, 140, 253, { tone: 'teal', head: false }));
          items.push(A('cl', 150, 262, 435, 262, { tone: 'teal', head: false }));
          items.push(T('res', 290, 296, 'grid.length = 2 rows     grid[0].length = 3 columns', { anchor: 'middle', mono: true, bold: true, tone: 'teal', size: 12.5 }));
        }
        return items;
      },
      quiz: [
        { q: 'In <code>grid[r][c]</code>, what comes first?', options: ['The column', 'The row', 'The value'], answer: 1, why: 'Row first, then column.' },
        { q: 'With the grid from this lesson, what is <code>grid[0][2]</code>?', options: ['3', '2', '6'], answer: 0, why: 'Row 0 is {1, 2, 3}, and column 2 is 3.' },
        { type: 'fill', q: 'Create a 2D int array.', code: 'int___ table = new int[3][4];', answer: ['[][]'], why: 'Two pairs of brackets: <code>int[][]</code>.' }
      ]
    }
  ],
  challenge: {
    title: 'Sum of an array',
    task: `
<p>Here is an array: <code>int[] nums = {5, 10, 15};</code></p>
<ol>
<li>Make an <code>int</code> variable <code>sum</code> that starts at 0.</li>
<li>Use a loop (for or for-each) to add every element to <code>sum</code>.</li>
<li>Print <code>sum</code>.</li>
</ol>`,
    starter: `public class Main {
    public static void main(String[] args) {
        int[] nums = {5, 10, 15};

    }
}`,
    checks: [
      { re: /int\s*\[\s*\]\s*nums\s*=\s*\{\s*5\s*,\s*10\s*,\s*15\s*\}/, label: 'The array <code>{5, 10, 15}</code>' },
      { re: /int\s+sum\s*=\s*0\s*;/, label: '<code>int sum = 0;</code>' },
      { re: /for\s*\(/, label: 'A loop' },
      { re: /sum\s*\+=\s*\w+(\s*\[\s*\w+\s*\])?|sum\s*=\s*sum\s*\+/, label: 'Add each element to <code>sum</code>' },
      { re: /System\.out\.println\s*\(\s*sum\s*\)/, label: 'Print <code>sum</code>' }
    ],
    solution: `public class Main {
    public static void main(String[] args) {
        int[] nums = {5, 10, 15};
        int sum = 0;
        for (int n : nums) {
            sum += n;
        }
        System.out.println(sum);
    }
}`,
    output: '30'
  }
});
