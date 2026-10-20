addModule({
  id: 'c1',
  track: 'cs1',
  title: 'Java Basics',
  blurb: 'What Java is, how a program runs, and how to print your first message.',
  lessons: [
    /* ------------------------------------------------------------ */
    {
      id: 'c1-1',
      title: 'Hello, Java!',
      body: `
<p><b>Java</b> is one of the most popular programming languages in the world. People use it to build Android apps, websites, games, bank systems and much more.</p>
<p>A <b>program</b> is a list of instructions for the computer. You write the instructions in a language that people can read, like Java. Then the computer {{translates|يترجم}} them and runs them.</p>
<h3>How a Java program runs</h3>
<ol>
<li>You write your code in a file that ends with <code>.java</code>, like <code>Main.java</code>.</li>
<li>The <b>compiler</b> (<code>javac</code>) checks your code and turns it into <b>bytecode</b>, in a <code>.class</code> file.</li>
<li>The <b>JVM</b> (Java Virtual Machine) runs the bytecode.</li>
</ol>
<p>There is a JVM for Windows, for Mac, for Linux and for Android. So the same bytecode runs on all of them. Java's famous {{slogan|شعار}} is: <b>"Write once, run anywhere."</b></p>
<div class="tip">You don't need to install anything to follow this course. Read, watch the drawings, and answer the questions. To run your own code, you can use an online compiler like <a href="https://www.jdoodle.com/online-java-compiler" target="_blank" rel="noopener">JDoodle</a>.</div>`,
      code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
      steps: [
        { cap: 'You write Java code in a file named <code>Main.java</code>. It is just text.', line: '1-5' },
        { cap: 'The {{compiler|المترجم}} <code>javac</code> checks the code. If there is a mistake, it tells you.', line: '1-5' },
        { cap: 'The result is <b>bytecode</b> in <code>Main.class</code>. People can\'t read it, but the JVM can.' },
        { cap: 'The JVM runs the bytecode. There is a JVM for every system: <b>write once, run anywhere</b>.' },
        { cap: 'The program runs and prints its message.', line: 3, out: 'Hello, World!' }
      ],
      draw: function (k) {
        return [
          B('src', 20, 60, 125, boxH(2), { title: 'Main.java', lines: ['your code', '(text)'], prose: true, tone: 'blue', mono: true, hi: k === 0 }),
          k >= 1 && A('a1', 147, 98, 178, 98, { tone: 'accent' }),
          k >= 1 && B('jc', 180, 75, 105, 46, { title: 'javac', mono: true, tone: 'accent', fill: k === 1 ? 'solid' : 'soft', tag: 'compiler' }),
          k >= 2 && A('a2', 287, 98, 318, 98, { tone: 'accent' }),
          k >= 2 && B('cls', 320, 60, 130, boxH(2), { title: 'Main.class', lines: ['bytecode', '0101 1100...'], prose: true, tone: 'teal', mono: true, hi: k === 2 }),
          k >= 3 && B('j1', 30, 215, 150, 50, { title: 'JVM on Windows', tone: 'teal', size: 13, hi: k === 3 }),
          k >= 3 && B('j2', 205, 215, 150, 50, { title: 'JVM on Mac', tone: 'teal', size: 13, hi: k === 3 }),
          k >= 3 && B('j3', 380, 215, 150, 50, { title: 'JVM on Android', tone: 'teal', size: 13, hi: k === 3 }),
          k >= 3 && A('b1', 385, 138, 105, 212, { tone: 'teal' }),
          k >= 3 && A('b2', 385, 138, 280, 212, { tone: 'teal' }),
          k >= 3 && A('b3', 385, 138, 455, 212, { tone: 'teal' }),
          k === 4 && T('out', 280, 310, 'Hello, World!', { anchor: 'middle', mono: true, bold: true, tone: 'accent', size: 18 })
        ];
      },
      quiz: [
        { q: 'What does the compiler (<code>javac</code>) make from your code?', options: ['A picture', 'Bytecode in a .class file', 'A new .java file'], answer: 1, why: 'The compiler turns your code into bytecode, and the JVM runs it.' },
        { q: 'What does "write once, run anywhere" mean?', options: ['You can only run the program one time', 'The same bytecode runs on every system that has a JVM', 'You must write the code again for each computer'], answer: 1, why: 'Every system has its own JVM, so the same program works everywhere.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'c1-2',
      title: 'Your first program',
      body: `
<p>Here is the smallest useful Java program. It prints one line:</p>
~~~
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
~~~
<p>It looks like a lot for one line! Let's look at it from the outside to the inside, like boxes inside boxes.</p>
<ul>
<li><code>public class Main { }</code> is the <b>class</b>. Every Java program lives inside a class. The name of the file must be the same: <code>Main.java</code>.</li>
<li><code>public static void main(String[] args) { }</code> is the <b>main method</b>. Java always starts the program here. Write it exactly like this. You will understand every word later.</li>
<li><code>System.out.println("...");</code> is a <b>statement</b>. It prints the text inside the quotes.</li>
</ul>
<div class="warn"><b>Three small rules that cause many errors:</b>
<ul>
<li>Every statement ends with a {{semicolon|فاصلة منقوطة}}: <code>;</code></li>
<li>Every <code>{</code> needs a matching <code>}</code>.</li>
<li>Java is <b>case-sensitive</b>: <code>System</code> is not the same as <code>system</code>.</li>
</ul></div>`,
      code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
      steps: [
        { cap: 'The outside box is the <b>class</b>. Its name, <code>Main</code>, is the same as the file name.', line: [1, 5] },
        { cap: 'Inside the class is the <b>main method</b>. The program starts here.', line: [2, 4] },
        { cap: 'Inside main is a <b>statement</b>. It tells Java to print a line.', line: 3 },
        { cap: 'The statement ends with <code>;</code> and the text is inside double quotes <code>" "</code>.', line: 3 },
        { cap: 'Java runs main from top to bottom. Here there is one line to run.', line: 3, out: 'Hello, World!' }
      ],
      draw: function (k) {
        return [
          B('cls', 20, 20, 520, 290, { title: 'public class Main', band: true, mono: true, tone: 'blue', z: 0, r: 16, hi: k === 0, tag: '' }),
          B('mth', 45, 70, 470, 200, { title: 'public static void main(String[] args)', band: true, mono: true, size: 13, tone: 'teal', z: 0, r: 14, hi: k === 1 }),
          B('st', 75, 135, 410, 54, { title: 'System.out.println("Hello, World!");', mono: true, size: 13.5, tone: 'accent', fill: k >= 2 ? 'solid' : 'soft', hi: k === 2 }),
          T('l1', 530, 46, 'class', { anchor: 'end', tone: 'blue', bold: true, size: 12 }),
          T('l2', 505, 96, 'main method', { anchor: 'end', tone: 'teal', bold: true, size: 12 }),
          k >= 2 && T('l3', 280, 210, 'statement', { anchor: 'middle', tone: 'accent', bold: true, size: 12 }),
          k === 3 && P('semi', 471, 192, 'ends with ;', { dir: 'up', len: 26 }),
          k === 3 && P('quo', 300, 133, 'text in " "', { dir: 'down', len: 22 })
        ];
      },
      quiz: [
        { q: 'Where does a Java program start?', options: ['At the first line of the file', 'In the main method', 'At the last `}`'], answer: 1, why: 'Java always starts in <code>main</code>.' },
        { type: 'fill', q: 'Complete the line so it prints Hi.', code: 'System.out.___("Hi")___', answer: ['println', ';'], why: '<code>println</code> prints a line, and every statement ends with <code>;</code>.' },
        { q: 'Is <code>system.out.println("Hi");</code> correct?', options: ['Yes', 'No, it must be `System` with a capital S'], answer: 1, why: 'Java is case-sensitive.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'c1-3',
      title: 'Printing: print and println',
      body: `
<p>There are two ways to print text:</p>
<ul>
<li><code>System.out.println("...")</code> prints the text, then moves to a <b>new line</b>. (println = print line)</li>
<li><code>System.out.print("...")</code> prints the text and stays on the <b>same line</b>.</li>
</ul>
~~~
System.out.print("Hi ");
System.out.print("there");
System.out.println("!");
System.out.println("New line");
~~~
<p>Output:</p>
~~~
Hi there!
New line
~~~
<p>Think of the {{cursor|المؤشر}} (the place where the next letter goes). <code>print</code> leaves the cursor at the end of the text. <code>println</code> moves the cursor down to the next line.</p>
<div class="tip">You can also print numbers and math: <code>System.out.println(5 + 3);</code> prints <code>8</code>. Without quotes, Java calculates. With quotes, <code>"5 + 3"</code> is just text.</div>`,
      code: `System.out.print("Hi ");
System.out.print("there");
System.out.println("!");
System.out.println("New line");`,
      steps: [
        { cap: '<code>print("Hi ")</code> writes the text. The cursor stays on the same line.', line: 1 },
        { cap: '<code>print("there")</code> continues on the same line.', line: 2 },
        { cap: '<code>println("!")</code> writes "!" and then moves the cursor to a <b>new line</b>.', line: 3 },
        { cap: '<code>println("New line")</code> starts on the second line.', line: 4 }
      ],
      draw: function (k) {
        var l1 = ['Hi', 'Hi there', 'Hi there!', 'Hi there!'][k];
        var curX = [60 + 3 * 9, 60 + 8 * 9, 60, 60][k], curY = [84, 84, 114, 144][k];
        return [
          B('scr', 40, 30, 480, 180, { title: 'Console (the screen)', band: true, tone: 'ink', fill: 'none', r: 10, z: 0 }),
          T('t1', 60, 98, l1, { mono: true, size: 15 }),
          k >= 3 && T('t2', 60, 128, 'New line', { mono: true, size: 15 }),
          B('cur', curX, curY, 9, 18, { tone: 'accent', fill: 'solid', r: 1 }),
          T('cl', 280, 250, ['print: stay on the same line', 'print: stay on the same line', 'println: go to a new line', 'println: go to a new line'][k], { anchor: 'middle', bold: true, tone: k >= 2 ? 'teal' : 'blue' }),
          T('cn', 280, 280, 'orange box = cursor (where the next letter goes)', { anchor: 'middle', tone: 'muted', size: 12 })
        ];
      },
      quiz: [
        { q: 'What does this print?', code: 'System.out.print("A");\nSystem.out.print("B");', options: ['A and B on two lines', 'AB', 'A B'], answer: 1, why: '<code>print</code> does not add a new line or a space.' },
        { q: 'Which one moves to a new line after printing?', options: ['`print`', '`println`'], answer: 1, why: 'println = print line.' },
        { q: 'What does <code>System.out.println(2 + 3);</code> print?', options: ['2 + 3', '5', '23'], answer: 1, why: 'There are no quotes, so Java calculates 2 + 3.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'c1-4',
      title: 'Comments',
      body: `
<p>A <b>comment</b> is a note for people. Java {{ignores|يتجاهل}} it completely. Comments explain what the code does, so you (and others) understand it later.</p>
<h3>Single-line comment</h3>
<p>Starts with <code>//</code>. Everything after it, until the end of the line, is a comment.</p>
~~~
// This program says hello
System.out.println("Hello!"); // greeting
~~~
<h3>Multi-line comment</h3>
<p>Starts with <code>/*</code> and ends with <code>*/</code>. It can be many lines long.</p>
~~~
/* Print a message
   to the screen */
~~~
<div class="tip">A good trick: to stop one line of code from running for a moment, put <code>//</code> in front of it. This is called "commenting out" a line.</div>`,
      code: `// This program says hello
public class Main {
    public static void main(String[] args) {
        /* Print a message
           to the screen */
        System.out.println("Hello!"); // greeting
    }
}`,
      steps: [
        { cap: 'This program has code and comments. Let\'s find the comments.' },
        { cap: '<code>//</code> makes the rest of the line a comment.', line: 1 },
        { cap: '<code>/* ... */</code> can cover many lines.', line: [4, 5] },
        { cap: 'A comment can also start in the middle of a line, after the code.', line: 6 },
        { cap: 'Java skips every comment. It only runs the real code.', line: [2, 3, 6, 7, 8], out: 'Hello!' }
      ],
      draw: function (k) {
        var rows = [
          ['// This program says hello', 1], ['public class Main {', 0], ['  public static void main(String[] args) {', 0],
          ['    /* Print a message', 2], ['       to the screen */', 2], ['    System.out.println("Hello!");', 3], ['  }', 0], ['}', 0]
        ];
        var items = [];
        rows.forEach(function (r, i) {
          var isCom = r[1] === 1 || r[1] === 2;
          var shown = (r[1] === 1 && k >= 1) || (r[1] === 2 && k >= 2);
          var cur = (r[1] === 1 && k === 1) || (r[1] === 2 && k === 2);
          items.push(B('r' + i, 30, 20 + i * 38, r[1] === 3 ? 320 : 400, 30, {
            title: r[0], mono: true, size: 12, align: 'left', r: 4,
            tone: shown ? (cur ? 'accent' : 'muted') : (k === 4 && !isCom ? 'teal' : 'ink'),
            fill: shown ? 'none' : 'soft', dash: shown, o: k === 4 && isCom ? 0.3 : 1
          }));
          if (r[1] === 3 && k >= 3) items.push(B('r5c', 356, 20 + i * 38, 110, 30, { title: '// greeting', mono: true, size: 12, align: 'left', r: 4, tone: k === 3 ? 'accent' : 'muted', fill: 'none', dash: true, o: k === 4 ? 0.3 : 1 }));
        });
        if (k === 4) items.push(T('note', 540, 120, 'Java runs\nonly the\ngreen lines', { anchor: 'end', tone: 'teal', bold: true, size: 13 }));
        else if (k >= 1 && k <= 3) items.push(T('note', 540, 120, 'comment:\nJava skips it', { anchor: 'end', tone: 'accent', bold: true, size: 13 }));
        return items;
      },
      quiz: [
        { q: 'What does Java do with comments?', options: ['Runs them first', 'Ignores them', 'Prints them'], answer: 1, why: 'Comments are only for people.' },
        { type: 'fill', q: 'Make this a single-line comment.', code: '___ calculate the total price', answer: ['//'], why: '<code>//</code> starts a single-line comment.' },
        { type: 'fill', q: 'Close the multi-line comment.', code: '/* This is a\n   long comment ___', answer: ['*/'], why: 'A multi-line comment ends with <code>*/</code>.' }
      ]
    }
  ],
  challenge: {
    title: 'Two lines',
    task: `
<p>Write a full Java program that prints these two lines:</p>
~~~
Hello, Java!
I am learning.
~~~
<ul>
<li>Use a class named <code>Main</code> and a <code>main</code> method.</li>
<li>Use <code>System.out.println</code> two times.</li>
<li>Add one comment that explains the program.</li>
</ul>`,
    starter: `public class Main {
    public static void main(String[] args) {

    }
}`,
    checks: [
      { re: /public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]\s*\w+\s*\)/, label: 'A <code>main</code> method' },
      { re: /System\.out\.println\s*\(\s*"Hello, Java!"\s*\)\s*;/, label: 'Print <code>Hello, Java!</code>' },
      { re: /System\.out\.println\s*\(\s*"I am learning\."\s*\)\s*;/, label: 'Print <code>I am learning.</code>' },
      { re: /\/\/|\/\*/, label: 'One comment', raw: true }
    ],
    solution: `// My first program: it prints two lines
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
        System.out.println("I am learning.");
    }
}`,
    output: 'Hello, Java!\nI am learning.'
  }
});
