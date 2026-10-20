addModule({
  id: 'm7',
  title: 'Scanner & Files',
  blurb: 'Read what the user types, and read and write text files.',
  lessons: [
    /* ------------------------------------------------------------ */
    {
      id: 'm7-1',
      title: 'Scanner: reading user input',
      body: `
<p>The <code>Scanner</code> class reads {{input|مُدخلات}}: text that comes into the program. The most common input is the keyboard.</p>
~~~
import java.util.Scanner;

Scanner sc = new Scanner(System.in);
~~~
<p><code>System.in</code> means "the keyboard" (the standard input). The Scanner connects to it.</p>
<div class="tblwrap"><table>
<tr><th>Method</th><th>What it reads</th></tr>
<tr><td><code>nextLine()</code></td><td>A whole line of text, until the user presses Enter</td></tr>
<tr><td><code>next()</code></td><td>One word (stops at a space)</td></tr>
<tr><td><code>nextInt()</code></td><td>A whole number, as an <code>int</code></td></tr>
<tr><td><code>nextDouble()</code></td><td>A decimal number, as a <code>double</code></td></tr>
</table></div>
<p>These methods <b>wait</b>. The program stops at that line until the user types something and presses Enter.</p>
<div class="warn">If you call <code>nextInt()</code> and the user types "hello", you get an <code>InputMismatchException</code>.</div>
<div class="tip">A common problem: after <code>nextInt()</code>, the Enter key is still waiting. A <code>nextLine()</code> right after it reads an empty line. Add an extra <code>sc.nextLine();</code> to skip it.</div>`,
      code: `Scanner sc = new Scanner(System.in);
System.out.println("Your name?");
String name = sc.nextLine();
System.out.println("Your age?");
int age = sc.nextInt();
System.out.println(name + " is " + age);`,
      steps: [
        { cap: '<code>new Scanner(System.in)</code> connects a Scanner to the keyboard.', line: 1 },
        { cap: 'The program asks a question.', line: 2, out: 'Your name?' },
        { cap: '<code>nextLine()</code> waits. The user types <b>Sara</b> and presses Enter.', line: 3, out: 'Sara' },
        { cap: 'The Scanner gives the text to the variable: <code>name = "Sara"</code>.', line: 3 },
        { cap: 'Another question.', line: 4, out: 'Your age?' },
        { cap: '<code>nextInt()</code> reads <b>21</b> and turns the text into the int 21.', line: 5, out: '21' },
        { cap: 'Now the program can use both values.', line: 6, out: 'Sara is 21' }
      ],
      draw: function (k) {
        var c1 = k >= 2 && B('ch1', k === 2 ? 30 : 425, k === 2 ? 135 : 48, 100, 40, { title: k === 2 ? 'Sara ⏎' : '"Sara"', mono: true, tone: 'accent', fill: 'solid', tag: k === 2 ? 'typed' : undefined });
        var c2 = k >= 5 && B('ch2', 425, 148, 100, 40, { title: '21', mono: true, tone: 'accent', fill: 'solid', from: [30, 135] });
        return [
          B('kb', 20, 40, 120, 60, { title: 'Keyboard', tone: 'muted', size: 15, hi: k === 2 }),
          A('in', 142, 70, 208, 70, { tone: 'blue', label: 'System.in' }),
          B('sc', 210, 40, 150, 60, { title: 'Scanner sc', mono: true, tone: 'blue', hi: k === 0 }),
          B('vn', 410, 40, 130, 56, { tag: 'String name', title: k >= 3 ? '' : '?', mono: true, tone: 'muted', fill: 'none', dash: true }),
          B('va', 410, 140, 130, 56, { tag: 'int age', title: k >= 5 ? '' : '?', mono: true, tone: 'muted', fill: 'none', dash: true }),
          k === 3 && A('nl', 362, 70, 408, 68, { tone: 'accent', label: 'nextLine()', ly: -6 }),
          k === 5 && A('ni', 362, 90, 408, 165, { tone: 'accent', label: 'nextInt()', bend: 12 }),
          k === 4 && B('ty2', 30, 135, 100, 40, { title: '21 ⏎', mono: true, tone: 'accent', fill: 'solid', tag: 'typed', o: 0.6 }),
          c1, c2
        ];
      },
      quiz: [
        { q: 'Which method reads a whole line of text?', options: ['`next()`', '`nextLine()`', '`nextInt()`'], answer: 1, why: '<code>nextLine()</code> reads until Enter.' },
        { type: 'fill', q: 'Create a Scanner for the keyboard and read a number.', code: 'Scanner sc = new Scanner(System.___);\nint n = sc.___();', answer: ['in', 'nextInt'], why: '<code>System.in</code> is the keyboard; <code>nextInt()</code> reads an int.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm7-2',
      title: 'The File class',
      body: `
<p>The class <code>File</code> (in the package <code>java.io</code>) {{represents|يمثّل}} a file or a folder on the disk.</p>
~~~
import java.io.File;

File f = new File("notes.txt");
~~~
<div class="warn">Creating a <code>File</code> object does <b>not</b> create, open or read the file. It only keeps the name and the {{path|المسار}}. Think of it as a label with an address.</div>
<p>Useful methods:</p>
<ul>
<li><code>exists()</code>: is the file really there? <code>true</code> or <code>false</code>.</li>
<li><code>getName()</code>: the file name, like <code>notes.txt</code>.</li>
<li><code>length()</code>: the size in bytes.</li>
<li><code>delete()</code>: deletes the file.</li>
</ul>
~~~
if (f.exists()) {
    System.out.println(f.getName() + " exists");
} else {
    System.out.println("File not found");
}
~~~
<p>A path can be short, like <code>"notes.txt"</code> (in the folder where the program runs), or full, like <code>"C:\\\\data\\\\notes.txt"</code>.</p>`,
      code: `import java.io.File;

File f = new File("notes.txt");
if (f.exists()) {
    System.out.println(f.getName() + " exists");
} else {
    System.out.println("File not found");
}`,
      steps: [
        { cap: '<code>new File("notes.txt")</code> makes an object that knows the name and path. It does not open the file.', line: 3 },
        { cap: '<code>exists()</code> checks the disk. The file is there: <b>true</b>.', line: [4, 5], out: 'notes.txt exists' },
        { cap: 'If the file is not on the disk, <code>exists()</code> gives <b>false</b>.', line: [4, 7], out: 'File not found', clear: true }
      ],
      draw: function (k) {
        var miss = k === 2;
        return [
          B('code', 20, 115, 120, 60, { title: 'your code', tone: 'blue', size: 14 }),
          A('mk', 142, 145, 188, 145, { tone: 'blue', label: 'new File' }),
          B('fo', 190, 116, 165, boxH(1), { title: 'File f', lines: ['"notes.txt"'], tone: 'teal', mono: true, tag: 'just a label', hi: k === 0 }),
          B('disk', 405, 40, 135, 250, { title: 'Disk', band: true, tone: 'muted', fill: 'none', r: 14, z: 0 }),
          B('doc', 425, 100, 95, 62, { title: miss ? '?' : 'notes.txt', mono: true, size: 11.5, tone: miss ? 'red' : 'ink', dash: miss, fill: miss ? 'none' : 'soft', r: 4, hi: k === 1 }),
          k >= 1 && A('ex', 357, 140, 422, 132, { tone: miss ? 'red' : 'teal', label: 'exists()?' }),
          k >= 1 && T('res', 272, 230, 'f.exists()  →  ' + (miss ? 'false' : 'true'), { anchor: 'middle', mono: true, bold: true, tone: miss ? 'red' : 'teal' })
        ];
      },
      quiz: [
        { q: 'What does <code>new File("a.txt")</code> do?', options: ['Creates the file on the disk', 'Makes an object with the file name and path', 'Reads the file'], answer: 1, why: 'A File object is only a label for a path.' },
        { type: 'fill', q: 'Check if the file is on the disk.', code: 'File f = new File("data.txt");\nif (f.___()) {\n    System.out.println("Found");\n}', answer: ['exists'], why: '<code>exists()</code> returns true or false.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm7-3',
      title: 'Reading a file',
      body: `
<p>The same <code>Scanner</code> class that reads the keyboard can also read a file. Just give it a <code>File</code> instead of <code>System.in</code>:</p>
~~~
File f = new File("notes.txt");
Scanner sc = new Scanner(f);
~~~
<p>Then read the file line by line with a loop:</p>
~~~
while (sc.hasNextLine()) {
    System.out.println(sc.nextLine());
}
sc.close();
~~~
<ul>
<li><code>hasNextLine()</code>: is there another line? <code>true</code> or <code>false</code>.</li>
<li><code>nextLine()</code>: read the next line, and move forward.</li>
<li><code>close()</code>: close the Scanner when you finish. This frees the file.</li>
</ul>
<div class="warn">If the file does not exist, <code>new Scanner(f)</code> throws a <code>FileNotFoundException</code>. This is a <b>checked</b> exception, so you <b>must</b> use try/catch (or <code>throws</code>).</div>
<p>You need these imports: <code>java.io.File</code>, <code>java.io.FileNotFoundException</code> and <code>java.util.Scanner</code>.</p>`,
      code: `try {
    File f = new File("notes.txt");
    Scanner sc = new Scanner(f);
    while (sc.hasNextLine()) {
        System.out.println(sc.nextLine());
    }
    sc.close();
} catch (FileNotFoundException e) {
    System.out.println("Error");
}`,
      steps: [
        { cap: 'The Scanner opens the file. It is ready to read before the first line.', line: [2, 3] },
        { cap: '<code>hasNextLine()</code> → true. <code>nextLine()</code> reads line 1.', line: [4, 5], out: 'Buy milk' },
        { cap: 'The loop repeats. Line 2.', line: [4, 5], out: 'Call Sara' },
        { cap: 'Line 3.', line: [4, 5], out: 'Study Java' },
        { cap: '<code>hasNextLine()</code> → <b>false</b>. No more lines. The loop stops.', line: 4 },
        { cap: '<code>close()</code>: always close the Scanner when you finish.', line: 7 },
        { cap: 'If the file is missing, <code>new Scanner(f)</code> throws <code>FileNotFoundException</code>. That is why we need try/catch.', line: [3, 8, 9] }
      ],
      draw: function (k) {
        var read = Math.min(Math.max(k, 0), 3);
        var lines = ['Buy milk', 'Call Sara', 'Study Java'].map(function (t, i) {
          return { t: t, tone: i < read ? (i === read - 1 && k <= 3 ? 'accent' : 'teal') : undefined, b: i === read - 1 && k <= 3 };
        });
        var curY = [70, 87, 105, 123, 140, 140, 140][k];
        return [
          B('doc', 30, 40, 200, boxH(3) + 14, { title: 'notes.txt', lines: lines, tone: 'muted', mono: true, r: 4, hi: k === 6, dash: k === 6 }),
          k <= 4 && T('cur', 14, curY, '▶', { tone: 'accent', size: 13 }),
          B('sc', 320, 60, 190, 50, { title: 'Scanner sc', mono: true, tone: k === 5 ? 'muted' : 'blue', tag: k >= 5 ? 'closed' : 'reading', dash: k >= 5 }),
          k >= 1 && k <= 3 && A('rd' + k, 232, 65 + 18 * k, 318, 90, { tone: 'accent', label: 'nextLine()' }),
          k <= 4 && T('hn', 320, 160, 'sc.hasNextLine()  →  ' + (k < 4 ? 'true' : 'false'), { mono: true, bold: true, size: 13, tone: k < 4 ? 'teal' : 'red' }),
          k === 6 && B('fnf', 300, 200, 245, 44, { title: 'FileNotFoundException', mono: true, tone: 'red', fill: 'solid', r: 22, size: 13 }),
          k === 6 && T('fnfl', 422, 270, 'caught by catch', { anchor: 'middle', tone: 'red', bold: true, size: 13 })
        ];
      },
      quiz: [
        { q: 'What do you give the Scanner to read a file?', options: ['`System.in`', 'A `File` object', 'The text of the file'], answer: 1, why: '<code>new Scanner(file)</code> reads from the file.' },
        { type: 'fill', q: 'Read every line of the file.', code: 'while (sc.___()) {\n    String line = sc.___();\n}', answer: ['hasNextLine', 'nextLine'], why: 'Check with <code>hasNextLine()</code>, read with <code>nextLine()</code>.' },
        { q: 'Why do we need try/catch here?', options: ['The file might not exist', 'Loops always need it', 'To make it faster'], answer: 0, why: '<code>FileNotFoundException</code> is checked, so Java forces us to handle it.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm7-4',
      title: 'Creating and writing files',
      body: `
<p>To write text into a file, you can use <code>FileWriter</code> (from <code>java.io</code>):</p>
~~~
FileWriter w = new FileWriter("data.txt");
w.write("Hello file!\\n");
w.close();
~~~
<ul>
<li><code>new FileWriter("data.txt")</code> creates the file if it does not exist.</li>
<li><code>write(text)</code> adds text. Use <code>"\\n"</code> for a new line.</li>
<li><code>close()</code> saves everything and closes the file.</li>
</ul>
<div class="warn"><b>Careful 1:</b> if the file already exists, its old text is <b>deleted</b>! To add text at the end instead, use <code>new FileWriter("data.txt", true)</code>.<br><b>Careful 2:</b> if you forget <code>close()</code>, your text may never reach the file.</div>
<p>Writing can fail (for example, no permission), so <code>FileWriter</code> throws an <code>IOException</code>. Put it in try/catch.</p>
<h3>Another way: Formatter</h3>
<p>The class <code>java.util.Formatter</code> can also create files, and it writes with a format:</p>
~~~
Formatter f = new Formatter("people.txt");
f.format("%s %s %s", "1", "John", "Smith");
f.close();
~~~
<p><code>%s</code> means "put a String here". The values come after the format text, in {{order|بالترتيب}}.</p>`,
      code: `try {
    FileWriter w = new FileWriter("data.txt");
    w.write("Hello file!\\n");
    w.write("Line two");
    w.close();
} catch (IOException e) {
    System.out.println("Error");
}`,
      steps: [
        { cap: '<code>new FileWriter("data.txt")</code> creates an empty file. (If it existed, the old text is deleted!)', line: 2 },
        { cap: '<code>write()</code> sends the first line. It is still in memory, not saved yet.', line: 3 },
        { cap: 'The second line.', line: 4 },
        { cap: '<code>close()</code> saves the text to the disk and closes the file. Done!', line: 5 },
        { cap: 'To <b>add</b> to the end of an old file, use <code>new FileWriter("data.txt", true)</code>.' }
      ],
      draw: function (k) {
        var lines = [];
        if (k >= 1) lines.push({ t: 'Hello file!', tone: k >= 3 ? undefined : 'muted', b: k === 1 });
        if (k >= 2) lines.push({ t: 'Line two', tone: k >= 3 ? undefined : 'muted', b: k === 2 });
        var saved = k >= 3;
        var ops = ['new FileWriter("data.txt")', 'w.write("Hello file!\\n")', 'w.write("Line two")', 'w.close()', 'new FileWriter("data.txt", true)'];
        return [
          B('code', 20, 70, 140, 60, { title: 'your code', tone: 'blue' }),
          A('cw', 162, 100, 198, 100, { tone: 'blue' }),
          B('w', 200, 70, 140, 60, { title: 'FileWriter w', mono: true, size: 12.5, tone: k === 3 ? 'muted' : 'accent', dash: k === 3 }),
          A('wd', 342, 100, 378, 100, { tone: 'accent', label: k >= 1 && k <= 2 ? 'write' : '' }),
          B('doc', 380, 50, 160, lines.length ? boxH(lines.length) + 10 : 80, { title: 'data.txt', lines: lines, band: true, mono: true, r: 4, tone: saved ? 'teal' : 'muted', tag: saved ? 'saved ✓' : 'not saved yet', fill: saved ? 'soft' : 'none' }),
          T('op', 30, 240, ops[k], { mono: true, bold: true, tone: k === 4 ? 'teal' : 'accent' }),
          k === 4 && T('ap', 30, 270, 'true = append (add at the end)', { size: 13, tone: 'teal' })
        ];
      },
      quiz: [
        { q: 'What happens if you forget <code>close()</code>?', options: ['Nothing, it is fine', 'The text may not be saved', 'The file is deleted'], answer: 1, why: 'close() saves the text and frees the file.' },
        { type: 'fill', q: 'Open the file in append mode, so old text is kept.', code: 'FileWriter w = new FileWriter("log.txt", ___);', answer: ['true'], why: 'The second argument <code>true</code> means append.' }
      ]
    }
  ],
  challenge: {
    title: 'Double the number',
    task: `
<p>Write a program that:</p>
<ol>
<li>imports <code>Scanner</code>,</li>
<li>creates a Scanner for the keyboard,</li>
<li>reads one <code>int</code> from the user,</li>
<li>prints the number times 2.</li>
</ol>
<p>Example: if the user types <code>7</code>, the program prints <code>14</code>.</p>`,
    starter: `// import here

public class Main {
    public static void main(String[] args) {
        // your code here
    }
}`,
    checks: [
      { re: /import\s+java\.util\.(Scanner|\*)\s*;/, label: 'Import <code>java.util.Scanner</code>' },
      { re: /new\s+Scanner\s*\(\s*System\.in\s*\)/, label: 'Create <code>new Scanner(System.in)</code>' },
      { re: /\.nextInt\s*\(\s*\)/, label: 'Read a number with <code>nextInt()</code>' },
      { re: /System\.out\.println\s*\([^;]*(\*\s*2|2\s*\*)[^;]*\)\s*;|\w+\s*\*=\s*2|=\s*\w+\s*\*\s*2|=\s*2\s*\*\s*\w+/, label: 'Multiply the number by 2' },
      { re: /System\.out\.println\s*\(/, label: 'Print the result' }
    ],
    solution: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(n * 2);
    }
}`,
    output: '14   (when the user types 7)'
  }
});
