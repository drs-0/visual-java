addModule({
  id: 'm4',
  title: 'Collections',
  blurb: 'Keep many values together: arrays, ArrayList, LinkedList, HashMap and sets.',
  lessons: [
    /* ------------------------------------------------------------ */
    {
      id: 'm4-1',
      title: 'Arrays: a quick review',
      body: `
<p>Before we learn collections, let's review <b>arrays</b>. An array keeps many values of the <b>same type</b> in one variable.</p>
~~~
int[] nums = {4, 8, 15, 16};
~~~
<p>Each value has a position number called the <b>index</b>. The most important rule: <b>the index starts at 0</b>, not 1.</p>
<ul>
<li><code>nums[0]</code> is 4 (the first element)</li>
<li><code>nums[3]</code> is 16 (the last element)</li>
<li><code>nums.length</code> is 4 (how many elements)</li>
</ul>
<p>So the last index is always <code>length - 1</code>.</p>
<h3>Looping over an array</h3>
<p>A <code>for</code> loop is perfect. The variable <code>i</code> goes 0, 1, 2, 3 and visits each element. Watch the arrow in the drawing: each time the loop {{repeats|يتكرر}}, <code>i</code> goes up by 1 and moves to the next box.</p>
~~~
int sum = 0;
for (int i = 0; i < nums.length; i++) {
    sum += nums[i];
}
~~~
<h3>Creating an empty array</h3>
~~~
int[] scores = new int[5];   // 5 boxes, all 0
~~~
<div class="warn">An array has a <b>fixed size</b>. You cannot add a 6th box later. And <code>nums[4]</code> on a 4-element array gives an <code>ArrayIndexOutOfBoundsException</code>. Collections like <code>ArrayList</code> fix the size problem.</div>`,
      code: `int[] nums = {4, 8, 15, 16};
int sum = 0;
for (int i = 0; i < nums.length; i++) {
    sum += nums[i];
}
System.out.println(sum);`,
      steps: [
        { cap: 'An array with 4 {{elements|عناصر}}. On the right of each box is its index. It starts at <b>0</b>.', line: 1 },
        { cap: '<code>sum</code> starts at 0.', line: 2 },
        { cap: '<code>i = 0</code>. nums[0] is 4. sum = 0 + 4 = <b>4</b>.', line: [3, 4] },
        { cap: '<code>i++</code> → <code>i = 1</code>. The arrow moves down. sum = 4 + 8 = <b>12</b>.', line: [3, 4] },
        { cap: '<code>i = 2</code>. sum = 12 + 15 = <b>27</b>.', line: [3, 4] },
        { cap: '<code>i = 3</code>, the last index (length − 1). sum = 27 + 16 = <b>43</b>.', line: [3, 4] },
        { cap: '<code>i = 4</code>. Is 4 &lt; 4? <b>No</b>. The loop stops. (nums[4] does not exist!)', line: 3 },
        { cap: 'Print the result.', line: 6, out: '43' }
      ],
      draw: function (k) {
        var vals = [4, 8, 15, 16];
        var i = k >= 2 ? Math.min(k - 2, 4) : null;
        var sum = 0; if (i != null) for (var j = 0; j <= Math.min(i, 3); j++) sum += vals[j];
        var prev = i != null && i > 0 && i <= 3 ? sum - vals[i] : 0;
        var calc = i == null ? '' : i <= 3 ? 'sum = ' + prev + ' + ' + vals[i] + ' = ' + sum : 'loop finished';
        var cond = i == null ? '' : 'i < 4  →  ' + (i < 4 ? 'true' : 'false');
        var done = []; if (i != null) for (var d = 0; d < Math.min(i, 4); d++) done.push(d);
        return [
          ARR('n', 70, 50, vals, { dir: 'v', cw: 90, ch: 52, name: 'nums', hl: i != null && i <= 3 ? i : null, done: k === 7 ? [0, 1, 2, 3] : done, size: 18 }),
          i != null && k < 7 && P('ptr', 208, 50 + i * 52 + 26, 'i = ' + i, { dir: 'left', len: 40, tone: i > 3 ? 'red' : 'accent' }),
          k >= 1 && B('sum', 380, 50, 150, 64, { tag: 'int sum', title: String(sum), mono: true, size: 22, tone: k === 7 ? 'teal' : 'accent', fill: k === 7 ? 'solid' : 'soft' }),
          calc && T('calc', 455, 150, calc, { anchor: 'middle', mono: true, size: 13, bold: true }),
          cond && T('cond', 455, 185, cond, { anchor: 'middle', mono: true, size: 13, tone: i < 4 ? 'teal' : 'red', bold: true }),
          T('len', 380, 260, 'nums.length = 4', { mono: true, size: 13, tone: 'muted' }),
          T('last', 380, 284, 'last index = 3', { mono: true, size: 13, tone: k === 5 ? 'accent' : 'muted', bold: k === 5 })
        ];
      },
      quiz: [
        { q: 'An array has 6 elements. What is the index of the last one?', options: ['6', '5', '7'], answer: 1, why: 'The index starts at 0, so the last index is length − 1 = 5.' },
        { type: 'fill', q: 'Print the first element of the array.', code: 'String[] names = {"Ali", "Mona", "Sam"};\nSystem.out.println(names[___]);', answer: ['0'], why: 'The first element is always at index 0.' },
        { q: 'What does <code>new int[3]</code> contain?', options: ['Nothing, it is null', 'Three zeros', 'The numbers 1, 2, 3'], answer: 1, why: 'A new int array is filled with 0 values.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm4-2',
      title: 'ArrayList',
      body: `
<p>An <code>ArrayList</code> is like an array that can <b>grow and shrink</b>. You don't choose a size. You just add and remove items.</p>
~~~
import java.util.ArrayList;

ArrayList<String> colors = new ArrayList<>();
~~~
<p>The type in <code>&lt; &gt;</code> says what the list keeps. Here: Strings.</p>
<h3>Useful methods</h3>
<div class="tblwrap"><table>
<tr><th>Method</th><th>What it does</th></tr>
<tr><td><code>add(x)</code></td><td>Adds x at the end</td></tr>
<tr><td><code>add(i, x)</code></td><td>Puts x at index i. The others move right.</td></tr>
<tr><td><code>get(i)</code></td><td>Gives the item at index i</td></tr>
<tr><td><code>set(i, x)</code></td><td>Replaces the item at index i</td></tr>
<tr><td><code>remove(x)</code> / <code>remove(i)</code></td><td>Removes an item. The others move left.</td></tr>
<tr><td><code>size()</code></td><td>How many items</td></tr>
<tr><td><code>contains(x)</code></td><td><code>true</code> if x is in the list</td></tr>
<tr><td><code>clear()</code></td><td>Removes everything</td></tr>
</table></div>
<div class="warn">Collections keep <b>objects</b>, not primitives. Write <code>ArrayList&lt;Integer&gt;</code>, not <code>ArrayList&lt;int&gt;</code>. <code>Integer</code> is the {{wrapper|غلاف}} class of <code>int</code>. Others: <code>Double</code>, <code>Boolean</code>, <code>Character</code>.</div>
<p>Watch the index numbers in the drawing. When an item is added in the middle, the items after it move right and their index goes <b>up by 1</b>.</p>`,
      code: `ArrayList<String> colors = new ArrayList<>();
colors.add("Red");
colors.add("Blue");
colors.add("Green");
colors.add(1, "Pink");
colors.remove("Blue");
System.out.println(colors.get(0));
System.out.println(colors.size());`,
      steps: [
        { cap: 'A new, {{empty|فاضية}} ArrayList. size() = 0.', line: 1 },
        { cap: '<code>add("Red")</code> puts Red at the end. It gets index 0.', line: 2 },
        { cap: '<code>add("Blue")</code>: index 1.', line: 3 },
        { cap: '<code>add("Green")</code>: index 2. The list grows by itself.', line: 4 },
        { cap: '<code>add(1, "Pink")</code>: Pink goes to index 1. Blue and Green move right. Their index goes up by 1.', line: 5 },
        { cap: '<code>remove("Blue")</code>: Blue leaves. Green moves left to fill the gap.', line: 6 },
        { cap: '<code>get(0)</code> gives the item at index 0.', line: 7, out: 'Red' },
        { cap: '<code>size()</code> gives the number of items.', line: 8, out: '3' }
      ],
      draw: function (k) {
        var lists = [[], ['Red'], ['Red', 'Blue'], ['Red', 'Blue', 'Green'], ['Red', 'Pink', 'Blue', 'Green'], ['Red', 'Pink', 'Green'], ['Red', 'Pink', 'Green'], ['Red', 'Pink', 'Green']];
        var drops = [null, 'Red', 'Blue', 'Green', 'Pink'];
        var ops = ['new ArrayList<>()', 'colors.add("Red")', 'colors.add("Blue")', 'colors.add("Green")', 'colors.add(1, "Pink")', 'colors.remove("Blue")', 'colors.get(0)  →  "Red"', 'colors.size()  →  3'];
        var L = lists[k];
        return [
          T('op', 90, 60, ops[k], { mono: true, bold: true, tone: 'accent', size: 14 }),
          L.length === 0 && B('empty', 90, 130, 100, 52, { dash: true, tone: 'muted', fill: 'none', title: 'empty' }),
          ARR('c', 90, 130, L, { cw: 100, ch: 52, keys: L, name: 'colors', drop: drops[k], hl: k === 6 ? 0 : k === 4 ? 1 : null, size: 14 }),
          k === 5 && B('ccBlue', 290, 230, 100, 52, { title: 'Blue', mono: true, r: 4, tone: 'red', fill: 'soft', o: 0.5 }),
          T('size', 90, 300, 'colors.size() = ' + L.length, { mono: true, size: 13.5, tone: k === 7 ? 'accent' : 'muted', bold: k === 7 })
        ];
      },
      quiz: [
        { q: 'Which line creates a list of whole numbers?', options: ['`ArrayList<int> a = new ArrayList<>();`', '`ArrayList<Integer> a = new ArrayList<>();`', '`ArrayList a = new int[];`'], answer: 1, why: 'Collections need the wrapper class <code>Integer</code>.' },
        { type: 'fill', q: 'Add "Tea" to the list, then print how many items it has.', code: 'ArrayList<String> drinks = new ArrayList<>();\ndrinks.___("Tea");\nSystem.out.println(drinks.___());', answer: ['add', 'size'], why: '<code>add()</code> puts an item in, <code>size()</code> counts the items.' },
        { q: 'A list is [A, B, C]. After <code>add(0, "Z")</code>, what is the index of B?', options: ['1', '2', '0'], answer: 1, why: 'Z goes to index 0 and every item moves right by one.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm4-3',
      title: 'LinkedList',
      body: `
<p><code>LinkedList</code> has almost the same methods as <code>ArrayList</code>: <code>add</code>, <code>get</code>, <code>remove</code>, <code>size</code>... But inside, it is built in a very different way.</p>
<p>Each item lives in a small box called a <b>node</b>. Each node knows where the <b>next</b> node is, like people in a line holding hands.</p>
~~~
import java.util.LinkedList;

LinkedList<String> names = new LinkedList<>();
names.add("Ali");
names.addFirst("Zed");
~~~
<p>It also has extra methods: <code>addFirst()</code>, <code>addLast()</code>, <code>removeFirst()</code>, <code>getFirst()</code>...</p>
<h3>Which one to choose?</h3>
<div class="tblwrap"><table>
<tr><th></th><th>ArrayList</th><th>LinkedList</th></tr>
<tr><td><code>get(i)</code></td><td><b>Fast.</b> It jumps straight to index i.</td><td>Slow. It must walk from the start, node by node.</td></tr>
<tr><td>Add or remove in the middle</td><td>Slow. Many items must move.</td><td><b>Fast.</b> Only a few links change.</td></tr>
</table></div>
<div class="tip">Most of the time, <code>ArrayList</code> is a good choice. Use <code>LinkedList</code> when you add and remove at the start or the middle a lot.</div>`,
      code: `LinkedList<String> names = new LinkedList<>();
names.add("Ali");
names.add("Mona");
names.addFirst("Zed");
names.add(1, "Sam");
System.out.println(names.get(2));`,
      steps: [
        { cap: 'An empty LinkedList. <code>head</code> points to nothing (<code>null</code>).', line: 1 },
        { cap: '<code>add("Ali")</code>: the first node.', line: 2 },
        { cap: '<code>add("Mona")</code>: Ali now holds a link (next) to Mona.', line: 3 },
        { cap: '<code>addFirst("Zed")</code>: Zed becomes the new head. Zed links to Ali.', line: 4 },
        { cap: '<code>add(1, "Sam")</code>: only the links change. Zed → Sam → Ali. Nobody else moves in memory.', line: 5 },
        { cap: '<code>get(2)</code> must walk: Zed (0) → Sam (1) → Ali (2). It cannot jump.', line: 6, out: 'Ali' }
      ],
      draw: function (k) {
        var lists = [[], ['Ali'], ['Ali', 'Mona'], ['Zed', 'Ali', 'Mona'], ['Zed', 'Sam', 'Ali', 'Mona'], ['Zed', 'Sam', 'Ali', 'Mona']];
        var drop = [null, 'Ali', 'Mona', 'Zed', 'Sam', null][k];
        var L = lists[k], items = [];
        var X = function (i) { return 30 + i * 128; };
        L.forEach(function (name, i) {
          var walk = k === 5 && i <= 2;
          items.push(B('nd' + name, X(i), 150, 92, 46, {
            title: name, mono: true, size: 15, tone: walk ? (i === 2 ? 'accent' : 'teal') : 'blue', fill: k === 5 && i === 2 ? 'solid' : 'soft',
            from: drop === name ? [X(i), name === 'Zed' ? 90 : 240] : undefined, tag: 'node ' + i
          }));
          if (i < L.length - 1) items.push(A('ln' + name + L[i + 1], X(i) + 93, 173, X(i + 1) - 2, 173, { tone: k === 5 && i < 2 ? 'teal' : 'ink', label: 'next' }));
        });
        var endX = L.length ? X(L.length - 1) + 92 : 30;
        if (L.length) items.push(A('tonull', endX + 1, 173, endX + 16, 173, { tone: 'muted' }), T('null', endX + 19, 177, 'null', { mono: true, size: 11, tone: 'muted' }));
        else items.push(T('null', 76, 180, 'null', { mono: true, size: 14, tone: 'muted', anchor: 'middle' }));
        items.push(P('head', 76, 118, 'head', { dir: 'down', len: 26 }));
        if (k === 5) items.push(T('walk', 280, 270, 'step 1: Zed  →  step 2: Sam  →  step 3: Ali', { anchor: 'middle', mono: true, bold: true, tone: 'teal', size: 13 }));
        return items;
      },
      quiz: [
        { q: 'Which list is faster for <code>get(500)</code>?', options: ['ArrayList', 'LinkedList', 'They are the same'], answer: 0, why: 'ArrayList jumps straight to the index. LinkedList must walk node by node.' },
        { type: 'fill', q: 'Add "Start" at the beginning of a LinkedList.', code: 'LinkedList<String> steps = new LinkedList<>();\nsteps.___("Start");', answer: ['addFirst|push'], why: '<code>addFirst()</code> puts the item at the front.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm4-4',
      title: 'HashMap',
      body: `
<p>A <code>HashMap</code> keeps <b>pairs</b>: a <b>key</b> and its <b>value</b>. It is like a phone book: you look up a name (the key) and find the number (the value).</p>
~~~
import java.util.HashMap;

HashMap<String, Integer> ages = new HashMap<>();
~~~
<p>The first type is for the keys (<code>String</code>), the second is for the values (<code>Integer</code>).</p>
<div class="tblwrap"><table>
<tr><th>Method</th><th>What it does</th></tr>
<tr><td><code>put(key, value)</code></td><td>Adds a pair. If the key already exists, the old value is <b>replaced</b>.</td></tr>
<tr><td><code>get(key)</code></td><td>Gives the value for this key (or <code>null</code>)</td></tr>
<tr><td><code>containsKey(key)</code></td><td><code>true</code> if the key exists</td></tr>
<tr><td><code>remove(key)</code></td><td>Removes the pair</td></tr>
<tr><td><code>size()</code></td><td>How many pairs</td></tr>
</table></div>
<div class="warn">Keys are <b>unique</b>: one key can appear only once. Values can repeat. And a HashMap does <b>not</b> keep the order you added things.</div>
<h3>Why is it so fast?</h3>
<p>Inside, a HashMap has many small "buckets". It turns the key into a number (a <b>hash</b>). This number says which bucket to use. So <code>get("Lina")</code> goes straight to the right bucket. It does not search the whole map.</p>`,
      code: `HashMap<String, Integer> ages = new HashMap<>();
ages.put("Sara", 21);
ages.put("Omar", 30);
ages.put("Lina", 25);
ages.put("Omar", 31);
System.out.println(ages.get("Lina"));
System.out.println(ages.containsKey("Ali"));`,
      steps: [
        { cap: 'A HashMap stores pairs: key → value. Inside it has small {{buckets|خانات}}.', line: 1 },
        { cap: '<code>put("Sara", 21)</code>: Java makes a number from the key (the hash). It says: use bucket 2.', line: 2 },
        { cap: '<code>put("Omar", 30)</code>: the hash of "Omar" points to bucket 0.', line: 3 },
        { cap: '<code>put("Lina", 25)</code>: bucket 3.', line: 4 },
        { cap: '<code>put("Omar", 31)</code>: the key already exists. The old value is <b>replaced</b>. Keys are {{unique|فريدة (ما تتكرر)}}.', line: 5 },
        { cap: '<code>get("Lina")</code>: hash → bucket 3 → <b>25</b>. No need to check every pair. That is why it is fast.', line: 6, out: '25' },
        { cap: '<code>containsKey("Ali")</code>: hash → bucket 1. It is empty, so the answer is <b>false</b>.', line: 7, out: 'false' }
      ],
      draw: function (k) {
        var buckets = ['', '', '', '', ''];
        if (k >= 1) buckets[2] = 'Sara → 21';
        if (k >= 2) buckets[0] = 'Omar → 30';
        if (k >= 3) buckets[3] = 'Lina → 25';
        if (k >= 4) buckets[0] = 'Omar → 31';
        var op = [null, ['"Sara"', '21', 2], ['"Omar"', '30', 0], ['"Lina"', '25', 3], ['"Omar"', '31', 0], ['"Lina"', null, 3], ['"Ali"', null, 1]][k];
        var items = [];
        buckets.forEach(function (c, i) {
          var hit = op && op[2] === i;
          items.push(T('bi' + i, 372, 30 + i * 58 + 29, '[' + i + ']', { anchor: 'end', mono: true, size: 12.5, tone: hit ? 'accent' : 'muted', bold: hit }));
          items.push(B('bk' + i, 380, 30 + i * 58, 160, 48, { title: c || (hit && k === 6 ? 'empty' : ''), mono: true, size: 13.5, tone: hit ? (k === 6 ? 'red' : 'accent') : c ? 'teal' : 'muted', fill: c ? 'soft' : 'none', dash: !c, hi: hit }));
        });
        items.push(B('hash', 190, 95, 120, 64, { title: 'hash()', mono: true, tone: 'muted', size: 15, tag: 'key → number' }));
        if (op) {
          items.push(B('key', 30, 70, 120, 44, { tag: 'key', title: op[0], mono: true, tone: 'blue', fill: 'solid' }));
          if (op[1]) items.push(B('val', 30, 150, 120, 44, { tag: 'value', title: op[1], mono: true, tone: 'accent', fill: 'solid' }));
          items.push(A('kh', 152, 92, 188, 115, { tone: 'blue' }));
          items.push(A('hb' + op[2], 312, 127, 378, 30 + op[2] * 58 + 24, { tone: 'accent', label: 'bucket ' + op[2], la: 'end', lx: -10 }));
        }
        if (k === 4) items.push(T('rep', 30, 240, 'same key → value replaced', { tone: 'accent', bold: true, size: 13 }));
        items.push(T('note', 30, 325, 'The bucket numbers here are only an example.', { tone: 'muted', size: 11.5, italic: true }));
        return items;
      },
      quiz: [
        { q: 'What does this print?', code: 'HashMap<String, Integer> m = new HashMap<>();\nm.put("a", 1);\nm.put("a", 5);\nSystem.out.println(m.get("a"));', options: ['1', '5', '6'], answer: 1, why: 'The same key again replaces the old value.' },
        { type: 'fill', q: 'Make a map from country names (String) to populations (Integer), then add one pair.', code: 'HashMap<___, ___> pop = new HashMap<>();\npop.___("Kuwait", 4900000);', answer: ['String', 'Integer', 'put'], why: 'Key type first, value type second. <code>put</code> adds a pair.' },
        { q: 'Can two different keys have the same value?', options: ['Yes', 'No'], answer: 0, why: 'Only the keys must be unique. Values can repeat.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm4-5',
      title: 'Sets',
      body: `
<p>A <b>set</b> is a collection with <b>no duplicates</b>. Every item can appear only one time.</p>
~~~
import java.util.HashSet;

HashSet<String> set = new HashSet<>();
set.add("A");
set.add("A");   // ignored: A is already inside
~~~
<p><code>add()</code> returns <code>true</code> if the item was added, and <code>false</code> if it was already there.</p>
<p>Other useful methods: <code>contains(x)</code>, <code>remove(x)</code>, <code>size()</code>, <code>clear()</code>. <code>contains()</code> on a HashSet is very fast, like a HashMap.</p>
<h3>HashSet or LinkedHashSet?</h3>
<ul>
<li><code>HashSet</code>: no order. The items can come out in any order.</li>
<li><code>LinkedHashSet</code>: keeps the order you added the items.</li>
</ul>
<div class="tip">A set is great for removing {{duplicates|التكرارات}} from a list. Put all items in a set, and every copy disappears.</div>`,
      code: `HashSet<String> set = new HashSet<>();
set.add("A");
set.add("B");
set.add("A");
set.add("C");
System.out.println(set.size());`,
      steps: [
        { cap: 'An empty set.', line: 1 },
        { cap: '<code>add("A")</code> → true. A is inside.', line: 2 },
        { cap: '<code>add("B")</code> → true.', line: 3 },
        { cap: '<code>add("A")</code> again → <b>false</b>. A is already inside, so nothing changes.', line: 4 },
        { cap: '<code>add("C")</code> → true.', line: 5 },
        { cap: 'Three items, not four. A set never keeps {{duplicates|التكرارات}}.', line: 6, out: '3' }
      ],
      draw: function (k) {
        var chip = function (id, x, y, txt, from) { return B(id, x, y, 70, 44, { title: txt, mono: true, tone: 'teal', fill: 'solid', size: 16, r: 22, from: from }); };
        return [
          B('set', 200, 40, 330, 260, { tone: 'teal', fill: 'soft', r: 60, z: 0, tag: 'HashSet set' }),
          T('sz', 365, 285, 'size = ' + (k >= 4 ? 3 : k >= 2 ? 2 : k >= 1 ? 1 : 0), { anchor: 'middle', mono: true, bold: true, tone: k === 5 ? 'accent' : 'teal' }),
          k >= 1 && chip('cA', 250, 90, '"A"', [40, 150]),
          k >= 2 && chip('cB', 400, 110, '"B"', [40, 150]),
          k >= 4 && chip('cC', 320, 190, '"C"', [40, 150]),
          k === 3 && B('dup', 40, 150, 70, 44, { title: '"A"', mono: true, tone: 'red', fill: 'solid', size: 16, r: 22 }),
          k === 3 && A('bounce', 112, 172, 196, 172, { tone: 'red', dash: true, label: 'already inside' }),
          k === 3 && T('false', 75, 225, 'add() → false', { anchor: 'middle', mono: true, bold: true, tone: 'red', size: 13 })
        ];
      },
      quiz: [
        { q: 'What does this print?', code: 'HashSet<Integer> s = new HashSet<>();\ns.add(5); s.add(5); s.add(7);\nSystem.out.println(s.size());', options: ['3', '2', '1'], answer: 1, why: 'The second 5 is a duplicate, so the set has 5 and 7.' },
        { q: 'Which set keeps the order you added the items?', options: ['`HashSet`', '`LinkedHashSet`', 'Neither'], answer: 1, why: 'LinkedHashSet remembers the insertion order.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm4-6',
      title: 'Sorting lists',
      body: `
<p>The class <code>Collections</code> (with an <b>s</b> at the end) has many ready <code>static</code> methods for lists.</p>
~~~
import java.util.Collections;
~~~
<div class="tblwrap"><table>
<tr><th>Method</th><th>What it does</th></tr>
<tr><td><code>Collections.sort(list)</code></td><td>Sorts from small to big ({{ascending|تصاعدي}}). Strings are sorted A to Z.</td></tr>
<tr><td><code>Collections.reverse(list)</code></td><td>Reverses the order</td></tr>
<tr><td><code>Collections.max(list)</code></td><td>The biggest item</td></tr>
<tr><td><code>Collections.min(list)</code></td><td>The smallest item</td></tr>
<tr><td><code>Collections.shuffle(list)</code></td><td>Mixes the items in a random order</td></tr>
</table></div>
<p>These methods change the list itself. They don't create a new list.</p>
~~~
ArrayList<String> names = new ArrayList<>();
names.add("Omar"); names.add("Ali"); names.add("Mona");
Collections.sort(names);
System.out.println(names);   // [Ali, Mona, Omar]
~~~
<div class="tip">Want big to small? Sort first, then reverse. Watch the bars in the drawing move to their new places.</div>`,
      code: `ArrayList<Integer> nums = new ArrayList<>();
nums.add(5); nums.add(2); nums.add(9); nums.add(1);
Collections.sort(nums);
System.out.println(nums);
Collections.reverse(nums);
System.out.println(Collections.max(nums));`,
      steps: [
        { cap: 'A list with 4 numbers, in no order.', line: [1, 2] },
        { cap: '<code>Collections.sort(nums)</code>: the bars move from small to big.', line: 3 },
        { cap: 'Printing the list shows it in brackets.', line: 4, out: '[1, 2, 5, 9]' },
        { cap: '<code>Collections.reverse(nums)</code>: now big to small.', line: 5 },
        { cap: '<code>Collections.max(nums)</code> finds the biggest item.', line: 6, out: '9' }
      ],
      draw: function (k) {
        var order = k === 0 ? [5, 2, 9, 1] : k <= 2 ? [1, 2, 5, 9] : [9, 5, 2, 1];
        var op = ['nums', 'Collections.sort(nums)', 'System.out.println(nums)', 'Collections.reverse(nums)', 'Collections.max(nums)  →  9'][k];
        var items = [T('op', 280, 36, op, { anchor: 'middle', mono: true, bold: true, tone: 'accent' })];
        items.push(A('base', 70, 291, 500, 291, { head: false, tone: 'muted' }));
        order.forEach(function (v, pos) {
          var h = v * 24, x = 95 + pos * 110;
          items.push(B('bar' + v, x, 290 - h, 70, h, { title: String(v), mono: true, size: 15, r: 4, tone: k === 4 && v === 9 ? 'accent' : 'blue', fill: k === 4 && v === 9 ? 'solid' : 'soft' }));
          items.push(T('ix' + pos, x + 35, 312, '[' + pos + ']', { anchor: 'middle', mono: true, size: 12, tone: 'muted' }));
        });
        return items;
      },
      quiz: [
        { q: 'A list is [3, 1, 2]. What is it after <code>Collections.sort(list)</code>?', options: ['[3, 2, 1]', '[1, 2, 3]', '[3, 1, 2]'], answer: 1, why: 'sort() orders from small to big.' },
        { type: 'fill', q: 'Find the smallest item in the list.', code: 'int small = Collections.___(nums);', answer: ['min'], why: '<code>Collections.min</code> gives the smallest item.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm4-7',
      title: 'Iterators',
      body: `
<p>An <b>Iterator</b> is an object that walks through a collection, one item at a time.</p>
~~~
import java.util.Iterator;

Iterator<String> it = animals.iterator();
~~~
<p>It has three main methods:</p>
<ul>
<li><code>hasNext()</code>: is there another item? <code>true</code> or <code>false</code>.</li>
<li><code>next()</code>: move forward and give back the next item.</li>
<li><code>remove()</code>: remove the item that <code>next()</code> just gave.</li>
</ul>
<p>The usual pattern is a <code>while</code> loop:</p>
~~~
while (it.hasNext()) {
    String a = it.next();
    System.out.println(a);
}
~~~
<p>Picture the iterator as a {{cursor|مؤشر}} that stands <b>between</b> items. At the start, it stands before the first item.</p>
<div class="warn">Don't remove items with <code>list.remove()</code> inside a for-each loop over the same list. It throws a <code>ConcurrentModificationException</code>. Use <code>it.remove()</code> instead: it is the safe way.</div>`,
      code: `ArrayList<String> animals = new ArrayList<>();
animals.add("cat"); animals.add("dog"); animals.add("fox");
Iterator<String> it = animals.iterator();
while (it.hasNext()) {
    String a = it.next();
    System.out.println(a);
}`,
      steps: [
        { cap: 'The iterator starts <b>before</b> the first item.', line: 3 },
        { cap: '<code>hasNext()</code> → true. There is an item after the cursor.', line: 4 },
        { cap: '<code>next()</code> jumps over "cat" and gives it back.', line: [5, 6], out: 'cat' },
        { cap: 'hasNext() → true. <code>next()</code> gives "dog".', line: [4, 5, 6], out: 'dog' },
        { cap: 'hasNext() → true. <code>next()</code> gives "fox".', line: [4, 5, 6], out: 'fox' },
        { cap: '<code>hasNext()</code> → <b>false</b>. Nothing is after the cursor. The loop ends.', line: 4 }
      ],
      draw: function (k) {
        var vals = ['cat', 'dog', 'fox'];
        var pos = k <= 1 ? 0 : Math.min(k - 1, 3);
        var gaps = [62, 202, 342, 482];
        var got = k >= 2 && k <= 4 ? vals[k - 2] : null;
        var items = [];
        vals.forEach(function (v, i) {
          var x = 70 + i * 140;
          items.push(B('c' + v, x, 140, 115, 52, { title: '"' + v + '"', mono: true, size: 15, r: 4, tone: got === v ? 'accent' : i < pos ? 'teal' : 'muted', fill: got === v ? 'solid' : 'soft' }));
          items.push(T('ix' + i, x + 57, 212, '[' + i + ']', { anchor: 'middle', mono: true, size: 12, tone: 'muted' }));
        });
        items.push(P('cur', gaps[pos], 136, 'it', { dir: 'down', len: 34 }));
        items.push(B('curbar', gaps[pos] - 2, 136, 4, 60, { tone: 'accent', fill: 'solid', r: 2 }));
        items.push(T('hn', 70, 262, 'it.hasNext()  →  ' + (pos < 3 ? 'true' : 'false'), { mono: true, bold: true, tone: pos < 3 ? 'teal' : 'red' }));
        if (got) items.push(T('av', 70, 296, 'String a = it.next();   // a = "' + got + '"', { mono: true, size: 13, tone: 'accent' }));
        return items;
      },
      quiz: [
        { q: 'Which method tells you if there are more items?', options: ['`next()`', '`hasNext()`', '`remove()`'], answer: 1, why: '<code>hasNext()</code> returns true or false.' },
        { type: 'fill', q: 'Complete the loop.', code: 'Iterator<Integer> it = nums.iterator();\nwhile (it.___()) {\n    System.out.println(it.___());\n}', answer: ['hasNext', 'next'], why: 'Check with <code>hasNext()</code>, take the item with <code>next()</code>.' }
      ]
    }
  ],
  challenge: {
    title: 'A small shop stock',
    task: `
<p>Use a <code>HashMap</code> to keep how many fruits a shop has.</p>
<ol>
<li>Import <code>HashMap</code>.</li>
<li>Create a <code>HashMap&lt;String, Integer&gt;</code> called <code>stock</code>.</li>
<li>Put <code>"apples"</code> with <code>5</code>, and <code>"bananas"</code> with <code>3</code>.</li>
<li>Print the number of apples with <code>get</code>.</li>
</ol>`,
    starter: `// import here

public class Main {
    public static void main(String[] args) {
        // create the map

        // put the fruits

        // print the apples
    }
}`,
    checks: [
      { re: /import\s+java\.util\.(HashMap|\*)\s*;/, label: 'Import <code>java.util.HashMap</code>' },
      { re: /HashMap\s*<\s*String\s*,\s*Integer\s*>\s+stock\s*=\s*new\s+HashMap\s*<\s*(String\s*,\s*Integer\s*)?>\s*\(\s*\)/, label: 'Create <code>HashMap&lt;String, Integer&gt; stock</code>' },
      { re: /stock\.put\s*\(\s*"apples"\s*,\s*5\s*\)/, label: '<code>stock.put("apples", 5)</code>' },
      { re: /stock\.put\s*\(\s*"bananas"\s*,\s*3\s*\)/, label: '<code>stock.put("bananas", 3)</code>' },
      { re: /System\.out\.println\s*\(\s*stock\.get\s*\(\s*"apples"\s*\)\s*\)/, label: 'Print <code>stock.get("apples")</code>' }
    ],
    solution: `import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> stock = new HashMap<>();
        stock.put("apples", 5);
        stock.put("bananas", 3);
        System.out.println(stock.get("apples"));
    }
}`,
    output: '5'
  }
});
