addModule({
  id: 'c3',
  track: 'cs1',
  title: 'User Input',
  blurb: 'Make your program talk with the user: read text and numbers from the keyboard.',
  lessons: [
    /* ------------------------------------------------------------ */
    {
      id: 'c3-1',
      title: 'Getting input with Scanner',
      body: `
<p>Until now, our programs always print the same thing. To make them {{interactive|تفاعلية}}, we need to read what the user types. In Java we use the <code>Scanner</code> class.</p>
<h3>Step 1: import it</h3>
<p><code>Scanner</code> is not loaded {{automatically|تلقائياً}}. Write this line at the very top of the file, before the class:</p>
~~~
import java.util.Scanner;
~~~
<h3>Step 2: create a Scanner</h3>
~~~
Scanner sc = new Scanner(System.in);
~~~
<p><code>System.in</code> means the keyboard. Now <code>sc</code> can read from it.</p>
<h3>Step 3: read</h3>
~~~
String name = sc.nextLine();
~~~
<p><code>nextLine()</code> <b>waits</b> until the user types something and presses Enter. Then it gives back the text.</p>
<div class="tip">It is polite to tell the user what to type first, with a message like <code>System.out.println("What is your name?");</code></div>`,
      code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine();
        System.out.println("Hello, " + name);
    }
}`,
      steps: [
        { cap: '<code>import</code> brings the Scanner class into our file. It lives in the package <code>java.util</code>.', line: 1 },
        { cap: '<code>new Scanner(System.in)</code> connects a Scanner to the keyboard.', line: 5 },
        { cap: '<code>nextLine()</code> waits. The user types <b>Omar</b> and presses Enter.', line: 6, out: 'Omar' },
        { cap: 'The text goes into the variable: <code>name = "Omar"</code>.', line: 6 },
        { cap: 'Now the program can use the value.', line: 7, out: 'Hello, Omar' }
      ],
      draw: function (k) {
        return [
          T('imp', 30, 36, 'import java.util.Scanner;', { mono: true, bold: true, size: 13, tone: k === 0 ? 'accent' : 'muted' }),
          B('kb', 20, 70, 120, 60, { title: 'Keyboard', tone: 'muted', size: 15, hi: k === 2 }),
          k >= 1 && A('in', 142, 100, 198, 100, { tone: 'blue', label: 'System.in' }),
          k >= 1 && B('sc', 200, 70, 150, 60, { title: 'Scanner sc', mono: true, tone: 'blue', hi: k === 1 }),
          k >= 1 && B('vn', 400, 72, 140, 56, { tag: 'String name', title: k >= 3 ? '' : '?', mono: true, tone: 'muted', fill: 'none', dash: true }),
          k === 3 && A('nl', 352, 100, 398, 100, { tone: 'accent', label: 'nextLine()', ly: -6 }),
          k >= 2 && B('ch', k === 2 ? 30 : 415, k === 2 ? 170 : 80, 110, 40, { title: k === 2 ? 'Omar ⏎' : '"Omar"', mono: true, tone: 'accent', fill: 'solid', tag: k === 2 ? 'typed' : undefined }),
          k === 2 && T('wait', 200, 196, '... the program waits here', { tone: 'muted', italic: true, size: 13 }),
          k === 4 && T('res', 280, 280, '"Hello, " + name   →   "Hello, Omar"', { anchor: 'middle', mono: true, bold: true, tone: 'teal', size: 14 })
        ];
      },
      quiz: [
        { q: 'Which line must come before you can use Scanner?', options: ['`import java.util.Scanner;`', '`new java.Scanner;`', '`use Scanner;`'], answer: 0, why: 'Scanner is in the package java.util.' },
        { type: 'fill', q: 'Create a Scanner for the keyboard.', code: 'Scanner sc = new Scanner(System.___);', answer: ['in'], why: '<code>System.in</code> is the keyboard input.' },
        { q: 'What does <code>sc.nextLine()</code> do?', options: ['Prints a line', 'Waits and reads one line the user types', 'Goes to the next line of code'], answer: 1, why: 'It reads text until the user presses Enter.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'c3-2',
      title: 'Reading numbers',
      body: `
<p>Everything the user types is text at first. To do math, we need a <b>number</b>. Scanner has methods that read and convert in one step:</p>
<div class="tblwrap"><table>
<tr><th>Method</th><th>Reads</th></tr>
<tr><td><code>nextLine()</code></td><td>a whole line of text (<code>String</code>)</td></tr>
<tr><td><code>next()</code></td><td>one word (<code>String</code>)</td></tr>
<tr><td><code>nextInt()</code></td><td>a whole number (<code>int</code>)</td></tr>
<tr><td><code>nextDouble()</code></td><td>a decimal number (<code>double</code>)</td></tr>
<tr><td><code>nextBoolean()</code></td><td><code>true</code> or <code>false</code></td></tr>
</table></div>
~~~
int age = sc.nextInt();
int next = age + 1;
System.out.println("Next year: " + next);
~~~
<div class="warn">If the user types something that is not a number, like <code>abc</code>, <code>nextInt()</code> stops the program with an <code>InputMismatchException</code> (an error). You will learn how to handle errors in CS2.</div>`,
      code: `Scanner sc = new Scanner(System.in);
int age = sc.nextInt();
int next = age + 1;
System.out.println("Next year: " + next);`,
      steps: [
        { cap: 'A Scanner is ready to read from the keyboard.', line: 1 },
        { cap: 'The user types <b>25</b>. At first, it is only text: the characters "2" and "5".', line: 2, out: '25' },
        { cap: '<code>nextInt()</code> turns the text into the int <b>25</b>, so we can do math with it.', line: 2 },
        { cap: '<code>age + 1</code> = 26.', line: 3 },
        { cap: 'Print the result.', line: 4, out: 'Next year: 26' },
        { cap: 'If the user types <b>abc</b>, nextInt() cannot make a number. The program stops with an error.' }
      ],
      draw: function (k) {
        var bad = k === 5;
        return [
          B('sc', 20, 30, 150, 50, { title: 'Scanner sc', mono: true, tone: 'blue', hi: k === 0 }),
          k >= 1 && B('t', 20, 130, 120, 48, { title: bad ? '"abc"' : '"25"', mono: true, size: 16, tone: bad ? 'red' : 'muted', fill: 'soft', tag: 'typed (text)', hi: k === 1 }),
          k >= 2 && A('ni', 142, 154, 200, 154, { tone: bad ? 'red' : 'accent', label: 'nextInt()' }),
          k >= 2 && !bad && B('age', 202, 122, 140, 64, { tag: 'int age', title: '25', mono: true, size: 24, tone: 'accent', hi: k === 2 }),
          k >= 3 && !bad && A('p1', 344, 154, 398, 154, { tone: 'teal', label: '+ 1' }),
          k >= 3 && !bad && B('nx', 400, 122, 140, 64, { tag: 'int next', title: '26', mono: true, size: 24, tone: 'teal', hi: k === 3 }),
          bad && B('err', 202, 128, 300, 52, { title: 'InputMismatchException', mono: true, tone: 'red', fill: 'solid', size: 14, r: 26 }),
          k === 1 && T('note', 30, 230, 'The keyboard always sends text.', { tone: 'muted', size: 13 }),
          k === 2 && T('note', 30, 230, 'nextInt(): text "25"  →  number 25', { tone: 'accent', size: 13, bold: true }),
          bad && T('note', 30, 230, '"abc" is not a number!', { tone: 'red', size: 13, bold: true })
        ];
      },
      quiz: [
        { q: 'Which method reads a decimal number like 3.5?', options: ['`nextInt()`', '`nextDouble()`', '`nextLine()`'], answer: 1, why: '<code>nextDouble()</code> reads a double.' },
        { type: 'fill', q: 'Read a whole number into <code>n</code>.', code: 'int n = sc.___();', answer: ['nextInt'], why: '<code>nextInt()</code> reads an int.' },
        { q: 'The user types <code>hello</code> for <code>nextInt()</code>. What happens?', options: ['n becomes 0', 'The program stops with an error', 'Java asks again'], answer: 1, why: 'It throws an InputMismatchException.' }
      ]
    }
  ],
  challenge: {
    title: 'Add two numbers',
    task: `
<p>Write a program that asks the user for two whole numbers and prints their sum.</p>
<ol>
<li>Import <code>Scanner</code> and create one for the keyboard.</li>
<li>Read two <code>int</code> values with <code>nextInt()</code>.</li>
<li>Print the sum.</li>
</ol>
<p>Example: the user types <code>3</code> and <code>5</code>, and the program prints <code>8</code>.</p>`,
    starter: `// import here

public class Main {
    public static void main(String[] args) {

    }
}`,
    checks: [
      { re: /import\s+java\.util\.(Scanner|\*)\s*;/, label: 'Import <code>java.util.Scanner</code>' },
      { re: /new\s+Scanner\s*\(\s*System\.in\s*\)/, label: 'Create <code>new Scanner(System.in)</code>' },
      { re: /nextInt\s*\(\s*\)[\s\S]*nextInt\s*\(\s*\)/, label: 'Read two numbers with <code>nextInt()</code>' },
      { re: /System\.out\.println\s*\([^;]*\w\s*\+\s*\w[^;]*\)\s*;|int\s+\w+\s*=\s*\w+\s*\+\s*\w+\s*;/, label: 'Add them with <code>+</code> and print the result' }
    ],
    solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int a = sc.nextInt();
        int b = sc.nextInt();
        System.out.println(a + b);
    }
}`,
    output: '8   (when the user types 3 and 5)'
  }
});
