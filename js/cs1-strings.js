addModule({
  id: 'c4',
  track: 'cs1',
  title: 'Strings',
  blurb: 'Work with text: join strings, use string methods, and write special characters.',
  lessons: [
    /* ------------------------------------------------------------ */
    {
      id: 'c4-1',
      title: 'Strings and joining',
      body: `
<p>A <code>String</code> is text: a {{sequence|سلسلة}} of characters inside double quotes.</p>
~~~
String city = "Jeddah";
String empty = "";
~~~
<h3>Joining strings with +</h3>
<p>With strings, <code>+</code> does not add. It <b>joins</b> (this is called {{concatenation|الدمج}}):</p>
~~~
String full = "Sara" + " " + "Ali";   // "Sara Ali"
~~~
<p>Don't forget the space <code>" "</code> in the middle, or you get <code>"SaraAli"</code>.</p>
<h3>Strings and numbers</h3>
<p>When you join a String with a number, the number becomes text:</p>
~~~
System.out.println("Age: " + 20);   // Age: 20
~~~
<div class="warn">Java works from <b>left to right</b>. <code>1 + 2 + "3"</code> → first <code>1 + 2 = 3</code> (math), then <code>3 + "3"</code> = <code>"33"</code> (joining). But <code>"1" + 2 + 3</code> = <code>"123"</code>, because it starts with text.</div>`,
      code: `String first = "Sara";
String last = "Ali";
String full = first + " " + last;
System.out.println(full);
System.out.println("Age: " + 20);
System.out.println(1 + 2 + "3");`,
      steps: [
        { cap: 'A String variable holds text.', line: 1 },
        { cap: 'A second String.', line: 2 },
        { cap: '<code>first + " " + last</code>: three pieces, side by side.', line: 3 },
        { cap: '<code>+</code> joins them into <b>one</b> new String.', line: [3, 4], out: 'Sara Ali' },
        { cap: 'String + number: the number becomes text and is joined.', line: 5, out: 'Age: 20' },
        { cap: 'Left to right: <code>1 + 2</code> is math (3). Then <code>3 + "3"</code> joins → <b>33</b>.', line: 6, out: '33' }
      ],
      draw: function (k) {
        var chip = function (id, x, y, w, t, tone, o) { return B(id, x, y, w, 46, { title: t, mono: true, size: 16, tone: tone || 'blue', fill: 'soft', r: 23, tag: o }); };
        var items = [];
        if (k <= 2) {
          items.push(chip('cf', k === 2 ? 60 : 40, k === 2 ? 210 : 50, 130, '"Sara"', 'blue', 'first'));
          if (k >= 1) items.push(chip('cl', k === 2 ? 270 : 40, k === 2 ? 210 : 130, 120, '"Ali"', 'blue', 'last'));
          if (k === 2) {
            items.push(chip('cs', 200, 210, 60, '" "', 'muted'));
            items.push(T('p1', 196, 196, '+', { bold: true, size: 20, tone: 'accent', anchor: 'middle' }));
            items.push(T('p2', 265, 196, '+', { bold: true, size: 20, tone: 'accent', anchor: 'middle' }));
          }
        } else if (k === 3) {
          items.push(chip('full', 60, 210, 330, '"Sara Ali"', 'teal', 'full'));
        } else if (k === 4) {
          items.push(chip('s1', 40, 110, 130, '"Age: "', 'blue'));
          items.push(chip('n1', 210, 110, 70, '20', 'accent'));
          items.push(T('pl', 190, 140, '+', { bold: true, size: 22, tone: 'accent', anchor: 'middle' }));
          items.push(chip('r1', 40, 220, 240, '"Age: 20"', 'teal', 'result'));
        } else {
          items.push(T('e1', 40, 80, '1 + 2 + "3"', { mono: true, bold: true, size: 20 }));
          items.push(T('e2', 40, 150, '= 3 + "3"', { mono: true, size: 20, tone: 'blue' }));
          items.push(T('e2n', 260, 150, '← math first: 1 + 2', { size: 13, tone: 'blue' }));
          items.push(T('e3', 40, 220, '= "33"', { mono: true, bold: true, size: 20, tone: 'teal' }));
          items.push(T('e3n', 260, 220, '← then joining: 3 + "3"', { size: 13, tone: 'teal' }));
        }
        return items;
      },
      quiz: [
        { q: 'What does <code>"Hi" + "There"</code> make?', options: ['`"Hi There"`', '`"HiThere"`', 'An error'], answer: 1, why: '+ joins exactly. It does not add a space.' },
        { q: 'What does <code>System.out.println("5" + 5);</code> print?', options: ['10', '55', '5 5'], answer: 1, why: 'A String + a number = joining.' },
        { type: 'fill', q: 'Join the name with a space between.', code: 'String full = first ___ " " ___ last;', answer: ['+', '+'], why: '<code>+</code> joins strings.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'c4-2',
      title: 'String methods',
      body: `
<p>A String is like a row of boxes. Each box holds one character, and each box has an <b>index</b>. Just like arrays, the index starts at <b>0</b>.</p>
<p>Strings have many ready methods. Use them with a dot:</p>
<div class="tblwrap"><table>
<tr><th>Method</th><th>Gives back</th><th><code>s = "Hello"</code></th></tr>
<tr><td><code>s.length()</code></td><td>how many characters</td><td>5</td></tr>
<tr><td><code>s.charAt(i)</code></td><td>the character at index i</td><td><code>s.charAt(1)</code> → 'e'</td></tr>
<tr><td><code>s.indexOf("x")</code></td><td>the index where "x" is first found (or -1)</td><td><code>s.indexOf("l")</code> → 2</td></tr>
<tr><td><code>s.substring(a, b)</code></td><td>a part from index a up to (not including) b</td><td><code>s.substring(1, 4)</code> → "ell"</td></tr>
<tr><td><code>s.toUpperCase()</code></td><td>all {{capital letters|حروف كبيرة}}</td><td>"HELLO"</td></tr>
<tr><td><code>s.toLowerCase()</code></td><td>all small letters</td><td>"hello"</td></tr>
<tr><td><code>s.equals(t)</code></td><td><code>true</code> if the text is the same</td><td><code>s.equals("Hello")</code> → true</td></tr>
</table></div>
<div class="warn">Strings never change. <code>s.toUpperCase()</code> makes a <b>new</b> String. <code>s</code> is still "Hello". To keep the result, save it: <code>s = s.toUpperCase();</code></div>
<div class="tip">To compare two Strings, always use <code>equals()</code>, not <code>==</code>.</div>`,
      code: `String s = "Hello";
System.out.println(s.length());        // 5
System.out.println(s.charAt(1));       // e
System.out.println(s.indexOf("l"));    // 2
System.out.println(s.substring(1, 4)); // ell
System.out.println(s.toUpperCase());   // HELLO`,
      steps: [
        { cap: 'The String "Hello" is 5 characters. Each one has an index, from 0 to 4.', line: 1 },
        { cap: '<code>length()</code> counts the characters: <b>5</b>.', line: 2, out: '5' },
        { cap: '<code>charAt(1)</code> gives the character at index 1: <b>e</b>.', line: 3, out: 'e' },
        { cap: '<code>indexOf("l")</code> finds the <b>first</b> "l". It is at index <b>2</b>.', line: 4, out: '2' },
        { cap: '<code>substring(1, 4)</code> takes index 1, 2, 3. Index 4 is <b>not</b> included: <b>ell</b>.', line: 5, out: 'ell' },
        { cap: '<code>toUpperCase()</code> makes a new String. The old one does not change.', line: 6, out: 'HELLO' }
      ],
      draw: function (k) {
        var hl = [null, null, 1, 2, [1, 2, 3], null][k];
        var res = [null, 's.length()  →  5', 's.charAt(1)  →  \'e\'', 's.indexOf("l")  →  2', 's.substring(1, 4)  →  "ell"', null][k];
        var items = [ARR('s', 120, 90, ['H', 'e', 'l', 'l', 'o'], { cw: 64, ch: 58, name: 's', hl: hl, done: k === 1 ? [0, 1, 2, 3, 4] : null, size: 22 })];
        if (k === 1) items.push(T('cnt', 280, 76, '1    2    3    4    5', { anchor: 'middle', mono: true, size: 13, tone: 'teal', bold: true }));
        if (k === 4) items.push(T('ex', 376, 186, 'index 4 not included', { anchor: 'middle', size: 12, tone: 'red', bold: true }));
        if (res) items.push(T('res', 280, 270, res, { anchor: 'middle', mono: true, bold: true, size: 16, tone: 'accent' }));
        if (k === 5) {
          items.push(ARR('u', 120, 220, ['H', 'E', 'L', 'L', 'O'], { cw: 64, ch: 58, name: 'new', size: 22, done: [0, 1, 2, 3, 4], idx: false }));
          items.push(T('same', 440, 70, 's is still "Hello"', { anchor: 'middle', size: 12.5, tone: 'muted', italic: true }));
        }
        return items;
      },
      quiz: [
        { q: 'What is <code>"Java".length()</code>?', options: ['3', '4', '5'], answer: 1, why: 'J-a-v-a: four characters.' },
        { q: 'What is <code>"Java".charAt(0)</code>?', options: ["'J'", "'a'", "'v'"], answer: 0, why: 'Index 0 is the first character.' },
        { type: 'fill', q: 'Make the text all small letters.', code: 'String s = "HeLLo";\nString low = s.___();', answer: ['toLowerCase'], why: '<code>toLowerCase()</code> gives a new String in small letters.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'c4-3',
      title: 'Escape characters',
      body: `
<p>Some characters are hard to write inside a String. How do you write a double quote, when the quote ends the String? Java uses the <b>backslash</b> <code>\\</code> to make special characters. They are called <b>escape characters</b>.</p>
<div class="tblwrap"><table>
<tr><th>Write</th><th>You get</th></tr>
<tr><td><code>\\n</code></td><td>a new line</td></tr>
<tr><td><code>\\t</code></td><td>a tab (a big space)</td></tr>
<tr><td><code>\\"</code></td><td>a double quote <code>"</code></td></tr>
<tr><td><code>\\'</code></td><td>a single quote <code>'</code></td></tr>
<tr><td><code>\\\\</code></td><td>one backslash <code>\\</code></td></tr>
</table></div>
~~~
System.out.println("She said \\"Hi\\"");   // She said "Hi"
~~~
<div class="tip">Each escape character counts as <b>one</b> character. <code>"a\\nb".length()</code> is 3.</div>`,
      code: `System.out.println("Line 1\\nLine 2");
System.out.println("A\\tB");
System.out.println("She said \\"Hi\\"");
System.out.println("C:\\\\Java");`,
      steps: [
        { cap: '<code>\\n</code> means <b>new line</b>. The text breaks into two lines.', line: 1, out: ['Line 1', 'Line 2'] },
        { cap: '<code>\\t</code> means <b>tab</b>: a big space, useful for columns.', line: 2, out: 'A\tB' },
        { cap: '<code>\\"</code> puts a real double quote inside the String.', line: 3, out: 'She said "Hi"' },
        { cap: '<code>\\\\</code> gives one real backslash.', line: 4, out: 'C:\\Java' }
      ],
      draw: function (k) {
        var src = ['"Line 1\\nLine 2"', '"A\\tB"', '"She said \\"Hi\\""', '"C:\\\\Java"'][k];
        var esc = ['\\n  =  new line', '\\t  =  tab', '\\"  =  "', '\\\\  =  \\'][k];
        var out = [['Line 1', 'Line 2'], ['A          B'], ['She said "Hi"'], ['C:\\Java']][k];
        var items = [
          B('src', 30, 40, 500, 54, { title: src, mono: true, size: 17, tone: 'blue', tag: 'you write' }),
          T('esc', 280, 128, esc, { anchor: 'middle', mono: true, bold: true, size: 16, tone: 'accent' }),
          A('ar', 280, 138, 280, 168, { tone: 'accent' }),
          B('con', 30, 172, 500, 140, { title: 'Console', band: true, tone: 'ink', fill: 'none', z: 0, tag: 'you get' })
        ];
        out.forEach(function (t, i) { items.push(T('o' + i, 50, 232 + i * 30, t, { mono: true, size: 17, tone: 'teal', bold: true })); });
        return items;
      },
      quiz: [
        { q: 'Which escape character makes a new line?', options: ['`\\t`', '`\\n`', '`\\\\`'], answer: 1, why: 'n = new line.' },
        { type: 'fill', q: 'Print: <code>He said "OK"</code>', code: 'System.out.println("He said ___OK___");', answer: ['\\"', '\\"'], why: '<code>\\"</code> puts a quote inside a String.' },
        { q: 'What does <code>"a\\tb"</code> look like when printed?', options: ['a\\tb', 'a and b with a big space between', 'a and b on two lines'], answer: 1, why: '<code>\\t</code> is a tab.' }
      ]
    }
  ],
  challenge: {
    title: 'Word facts',
    task: `
<p>Make a String variable <code>word</code> with the value <code>"java"</code>.</p>
<ol>
<li>Print how many characters it has, with <code>length()</code>.</li>
<li>Print it in capital letters, with <code>toUpperCase()</code>.</li>
</ol>`,
    starter: `public class Main {
    public static void main(String[] args) {

    }
}`,
    checks: [
      { re: /String\s+word\s*=\s*"java"\s*;/, label: '<code>String word = "java";</code>' },
      { re: /System\.out\.println\s*\(\s*word\.length\s*\(\s*\)\s*\)/, label: 'Print <code>word.length()</code>' },
      { re: /System\.out\.println\s*\(\s*word\.toUpperCase\s*\(\s*\)\s*\)/, label: 'Print <code>word.toUpperCase()</code>' }
    ],
    solution: `public class Main {
    public static void main(String[] args) {
        String word = "java";
        System.out.println(word.length());
        System.out.println(word.toUpperCase());
    }
}`,
    output: '4\nJAVA'
  }
});
