/* CS2 · Unit 6 · File IO (25 slides): files and directories, absolute and relative names, the File class,
   writing with PrintWriter, try-with-resources, reading with Scanner, how the Scanner methods work, and ReplaceText */
(function () {
  function mix(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }
  function I(x) { return Math.trunc(x); }
  function h(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function jstr(s) { return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'; }
  function vbox(id, x, y, w, name, type, value, o) {
    return B(id, x, y, w, 48, mix({ tag: type + ' ' + name, title: value == null ? 'no value' : String(value), mono: true, size: 14, tone: value == null ? 'muted' : 'teal', dash: value == null, r: 6 }, o || {}));
  }
  function hot(o) { return mix(o || {}, { tone: 'accent', hi: true }); }
  /* a text file drawn as a page with lines */
  function page(id, x, y, w, name, lines, o) {
    o = o || {};
    var L = lines.length ? lines : [''];
    return B(id, x, y, w, Math.max(boxH(L.length), 80), mix({ title: name, band: true, mono: true, lsize: 12.5, lines: L.map(function (t, i) { return { t: t === '' ? ' ' : t, tone: o.hiLine === i ? 'accent' : undefined, b: o.hiLine === i }; }), tone: o.tone || 'teal', hi: !!o.hi }, o.extra || {}));
  }

  /* ---------- 1. the file system tree (slides 3-4) ---------- */
  var DIRS = [['c:\\', 0, 0], ['Users', 1, 1], ['mudawar', 2, 2], ['Documents', 3, 3], ['JavaCode', 4, 4], ['src', 5, 5], ['Welcome.java', 6, 6]];
  var tree = {
    id: 'tree', slides: [3, 4], title: 'Absolute and relative file names',
    inputs: [{ id: 'cwd', label: 'current directory (4 = JavaCode, 5 = src)', value: 5, min: 0, max: 5 }],
    presets: [{ label: 'in src', values: { cwd: 5 } }, { label: 'in JavaCode', values: { cwd: 4 } }, { label: 'in Documents', values: { cwd: 3 } }],
    steps: function (v) {
      var c = I(v.cwd), rel = DIRS.slice(c + 1).map(function (d) { return d[0]; }).join('\\');
      return [
        { slide: 3, ph: 'tree', cap: 'The file system is a <b>tree of directories</b>. The root is a drive letter like <code>c:\\</code> on Windows, or <code>/</code> on Linux. Each file is inside a directory.' },
        { slide: 4, ph: 'abs', cap: 'An <b>absolute</b> file name gives the whole path from the root: <code>c:\\Users\\mudawar\\Documents\\JavaCode\\src\\Welcome.java</code>. On Linux: <code>/home/mudawar/JavaCode/src/Welcome.java</code>.' },
        { slide: 4, ph: 'rel', c: c, cap: 'A <b>relative</b> name starts at the <b>current working directory</b> (here ' + DIRS[c][0] + '): <code>' + h(rel) + '</code>. Separators are \\ on Windows and / on Linux.' }
      ];
    },
    draw: function (k, s, v) {
      var c = I(v.cwd), items = [];
      DIRS.forEach(function (d, i) {
        var x = 20 + d[1] * 34, y = 14 + i * 44, onPath = s.ph === 'abs' || (s.ph === 'rel' && i > c);
        items.push(B('d' + i, x, y, i === 6 ? 140 : 120, 34, { title: (i === 6 ? '' : '📁 ') + d[0], mono: true, size: 12, tone: s.ph === 'rel' && i === c ? 'teal' : onPath ? 'accent' : 'blue', hi: s.ph === 'rel' && i === c }));
        if (i) items.push(A('l' + i, x - 18, y - 10, x - 2, y + 17, { head: false, tone: onPath ? 'accent' : 'muted', via: [[x - 18, y + 17]] }));
      });
      if (s.ph === 'rel') items.push(T('cw', 20 + DIRS[c][1] * 34 + 130, 14 + c * 44 + 22, '← current directory', { size: 12, bold: true, tone: 'teal' }));
      return items;
    }
  };

  /* ---------- 2. the File class (slides 5-9) ---------- */
  var TFC = 'public class TestFileClass {\n  public static void main(String[] args) {\n    java.io.File file = new java.io.File("image/us.gif");\n    System.out.println("Does it exist? " + file.exists());\n    System.out.println("The file has " + file.length() + " bytes");\n    System.out.println("Can it be read? " + file.canRead());\n    System.out.println("Can it be written? " + file.canWrite());\n    System.out.println("Is it a directory? " + file.isDirectory());\n    System.out.println("Is it a file? " + file.isFile());\n    System.out.println("Is it absolute? " + file.isAbsolute());\n    System.out.println("Is it hidden? " + file.isHidden());\n    System.out.println("Absolute path is " + file.getAbsolutePath());\n    System.out.println("Last modified on " +\n                        new java.util.Date(file.lastModified()));\n  }\n}';
  var ANS = [['exists()', 'true', 'Does it exist? true'], ['length()', '2998', 'The file has 2998 bytes'], ['canRead()', 'true', 'Can it be read? true'], ['canWrite()', 'true', 'Can it be written? true'], ['isDirectory()', 'false', 'Is it a directory? false'], ['isFile()', 'true', 'Is it a file? true'], ['isAbsolute()', 'false', 'Is it absolute? false'], ['isHidden()', 'false', 'Is it hidden? false'], ['getAbsolutePath()', 'C:\\book\\image\\us.gif', 'Absolute path is C:\\book\\image\\us.gif'], ['lastModified()', '(a long: ms since 1970)', 'Last modified on Tue Nov 02 08:20:45 EST 2004']];
  var fileclass = {
    id: 'fileclass', slides: [5, 9], title: 'A File object answers questions about a file', code: TFC,
    steps: (function () {
      var st = [
        { line: 3, slide: 5, ph: 'idea', k: -1, cap: 'The <b>File</b> class wraps a file name and its directory path. It can tell you about the file (does it exist? how big?) and rename or delete it, but it does <b>not</b> read or write the contents.' },
        { line: 3, slide: 6, ph: 'esc', k: -1, cap: 'In a string, a backslash must be written <code>\\\\</code>: <code>new File("c:\\\\Users\\\\mudawar\\\\Documents\\\\data.txt")</code> is the file c:\\Users\\mudawar\\Documents\\data.txt. (Remember the escape sequences of CS I unit 5.)' },
        { line: '12-14', slide: 7, ph: 'more', k: -1, cap: 'More methods: getAbsolutePath, getName (“test.dat” for c:\\book\\test.dat), getPath, getParent (c:\\book), lastModified, length, listFiles, delete, renameTo, mkdir and mkdirs.' }
      ];
      ANS.forEach(function (a, i) { st.push({ slide: 8, line: i + 4 > 13 ? '13-14' : i + 4, ph: 'run', k: i, cap: '<code>file.' + h(a[0]) + '</code> → ' + h(a[1]) + '.' + (i === 6 ? ' "image/us.gif" is a <b>relative</b> name.' : ''), out: a[2] }); });
      st.push({ line: 3, slide: 9, ph: 'sep', k: 10, cap: 'Use the forward slash <code>/</code> in Java file names: "image/us.gif" works on Windows, Unix and other systems. On Unix the absolute path printed is /home/daniel/book/image/us.gif.' });
      return st;
    })(),
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'idea') return [B('f', 60, 60, 200, 80, { tag: 'java.io.File', title: '"image/us.gif"', mono: true, size: 14, tone: 'blue' }), A('a', 264, 100, 316, 100, { tone: 'muted' }), B('d', 320, 50, 200, 100, { title: 'us.gif on disk', lines: ['name, size, date', 'contents: not here'], size: 13, lsize: 12, tone: 'teal' })];
      if (s.ph === 'esc') return [B('s', 30, 60, 500, 50, { tag: 'in the Java code', title: '"c:\\\\Users\\\\mudawar\\\\Documents\\\\data.txt"', mono: true, size: 13, tone: 'accent' }), A('a', 280, 116, 280, 156, { tone: 'muted' }), B('r', 30, 160, 500, 50, { tag: 'the real file name', title: 'c:\\Users\\mudawar\\Documents\\data.txt', mono: true, size: 14, tone: 'teal' })];
      if (s.ph === 'more') return [B('u', 60, 10, 440, boxH(10), { title: 'java.io.File (more)', band: true, mono: true, lsize: 12, lines: ['+getAbsolutePath(): String', '+getName(): String', '+getPath(): String', '+getParent(): String', '+lastModified(): long', '+length(): long', '+listFiles(): File[]', '+delete(): boolean', '+renameTo(dest: File): boolean', '+mkdir(), mkdirs(): boolean'], tone: 'blue' })];
      items.push(B('f', 20, 20, 190, 60, { tag: 'File file', title: '"image/us.gif"', mono: true, size: 13, tone: 'blue' }));
      ANS.forEach(function (a, i) {
        if (i > s.k) return;
        items.push(T('q' + i, 230, 30 + i * 30, a[0], { mono: true, size: 12, tone: i === s.k ? 'accent' : 'muted', bold: i === s.k }));
        items.push(T('a' + i, 400, 30 + i * 30, a[1].length > 20 ? a[1].slice(0, 20) + '…' : a[1], { mono: true, size: 12, tone: a[1] === 'false' ? 'red' : 'teal', bold: i === s.k }));
      });
      if (s.ph === 'sep') items.push(T('sl', 115, 140, 'use / in Java', { anchor: 'middle', size: 14, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 3. writing a file with PrintWriter (slides 11-16) ---------- */
  var WD = 'import java.io.*;\n\npublic class WriteData {\n  public static void main(String[] args) throws IOException {\n    File file = new File("scores.txt");\n    if (file.exists()) {\n      System.out.println("File scores.txt already exists");\n      System.exit(1);  // Exit the program\n    }\n\n    PrintWriter output = new PrintWriter(file);\n    output.print("John Smith ");  // Print to output file\n    output.println(90);           // Print to output file\n    output.print("Eric Jones ");  // Print to output file\n    output.println(85);           // Print to output file\n    output.close();               // Close the output file\n  }                               // to ensure saving the data\n}';
  var write = {
    id: 'write', slides: [11, 16], title: 'print and println into a file',
    code: WD + '\n\n// Slide 16: the same writing with try-with-resources\ntry ( PrintWriter output = new PrintWriter(file); ) {\n  output.print("John Perez ");\n  output.println(92);\n  output.print("Fahd Amr ");\n  output.println(89);\n}',
    inputs: [{ id: 'ex', label: 'scores.txt already exists? (0 = no, 1 = yes)', value: 0, min: 0, max: 1 }],
    presets: [{ label: 'new file', values: { ex: 0 } }, { label: 'file already there', values: { ex: 1 } }],
    steps: function (v) {
      var ex = I(v.ex) === 1, st = [
        { line: '5,11', slide: 11, ph: 'io', f: null, cap: 'File knows about a file but cannot read or write it. For text files: <b>PrintWriter</b> writes, <b>Scanner</b> reads.' },
        { line: '12-15', slide: 13, ph: 'uml', f: null, cap: 'PrintWriter has the same print, println and printf you know from System.out, but they go into a file. println writes a line separator (\\r\\n on Windows, \\n on Unix).' },
        { slide: 14, line: '5-9', ph: 'chk', f: ex ? ['(old contents)'] : null, cap: ex ? 'scores.txt already exists, so the program prints a message and stops: it does not overwrite the old file.' : 'scores.txt does not exist yet, so the program goes on.', out: ex ? 'File scores.txt already exists' : undefined }
      ];
      if (ex) return st;
      st.push({ slide: 12, line: 11, ph: 'open', f: [''], cap: '<code>new PrintWriter(file)</code> creates the file, empty. (Creating it may throw an IOException, so main declares <code>throws IOException</code>.)' });
      st.push({ slide: 14, line: 12, ph: 'w', f: ['John Smith '], cap: 'print writes text, and stays on the same line.' });
      st.push({ slide: 14, line: 13, ph: 'w', f: ['John Smith 90', ''], cap: 'println writes 90 and ends the line.' });
      st.push({ slide: 14, line: '14-15', ph: 'w', f: ['John Smith 90', 'Eric Jones 85', ''], cap: 'The second line.' });
      st.push({ slide: 14, line: 16, ph: 'close', f: ['John Smith 90', 'Eric Jones 85'], cap: '<code>close()</code> makes sure the data is really saved. Forgetting it can leave the file empty or incomplete.' });
      st.push({ line: '21,26', slide: 15, ph: 'twr', f: ['John Smith 90', 'Eric Jones 85'], cap: '<b>try-with-resources</b>: <code>try (PrintWriter output = new PrintWriter(file);) { … }</code>. Java closes the file automatically at the end of the block, even if an exception happens.' });
      st.push({ line: '22-25', slide: 16, ph: 'twr2', f: ['John Perez 92', 'Fahd Amr 89'], cap: 'WriteDataWithAutoClose writes “John Perez 92” and “Fahd Amr 89” this way, with no close() call.' });
      return st;
    },
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'io') return [B('f', 30, 40, 160, 60, { title: 'File', lines: ['about a file'], size: 14, lsize: 12, tone: 'blue' }), B('w', 210, 40, 160, 60, { title: 'PrintWriter', lines: ['writes text'], size: 14, lsize: 12, tone: 'accent' }), B('r', 390, 40, 160, 60, { title: 'Scanner', lines: ['reads text'], size: 14, lsize: 12, tone: 'teal' })];
      if (s.ph === 'uml') return [B('u', 120, 20, 320, boxH(7), { title: 'java.io.PrintWriter', band: true, mono: true, lsize: 12, lines: ['+PrintWriter(file: File)', '+PrintWriter(filename: String)', '+print(s: String): void', '+print(i: int): void', '+print(d: double): void  …', '+println(…) methods', '+printf(…) methods'], tone: 'blue' })];
      items.push(B('prog', 20, 60, 160, 60, { title: s.ph === 'twr' || s.ph === 'twr2' ? 'try (PrintWriter …)' : 'PrintWriter output', mono: true, size: 12, tone: s.ph === 'close' || s.ph === 'twr' ? 'teal' : 'accent' }));
      if (s.f) {
        items.push(A('a', 184, 90, 266, 90, { tone: s.ph === 'w' ? 'accent' : 'muted', label: s.ph === 'close' || s.ph === 'twr' || s.ph === 'twr2' ? 'closed' : 'writes' }));
        items.push(page('pg', 270, 40, 260, 'scores.txt', s.f, { hiLine: s.ph === 'w' ? s.f.length - (s.f[s.f.length - 1] === '' ? 2 : 1) : -1, tone: s.ph === 'chk' ? 'red' : 'teal' }));
      }
      return items;
    }
  };

  /* ---------- 4. reading a file with Scanner (slides 18-20) ---------- */
  var RD = 'import java.util.Scanner;  // Scanner class\nimport java.io.File;       // File class\n\npublic class ReadData {\n  public static void main(String[] args) throws Exception {\n    File file = new File("scores.txt");        // Create a File object\n    try ( Scanner input = new Scanner(file) ) {  // Scanner input for file\n      while (input.hasNext()) {                // while more input to read\n        String firstName = input.next();       // Read data from file\n        String lastName = input.next();        // Read data from file\n        int score = input.nextInt();           // Read data from file\n        System.out.println(firstName + " " + lastName + " " + score);\n      }\n    }\n    catch (Exception ex) { System.out.println(ex); }\n  }\n}';
  function toks(lines) { var t = []; lines.forEach(function (l, i) { var re = /\S+/g, m; while ((m = re.exec(l))) t.push({ t: m[0], line: i }); }); return t; }
  var read = {
    id: 'read', slides: [18, 20], title: 'Read tokens until hasNext() is false', code: RD,
    inputs: [{ id: 'f', type: 'text', label: 'scores.txt (lines split by ;)', value: 'John Smith 90; Eric Jones 85', maxlen: 60 }],
    presets: [{ label: 'two lines', values: { f: 'John Smith 90; Eric Jones 85' } }, { label: 'three lines', values: { f: 'Ali Saad 77; Mona Ali 95; Sam Lee 60' } }, { label: 'bad score', values: { f: 'John Smith ninety' } }, { label: 'empty file', values: { f: '' } }],
    steps: function (v) {
      var lines = String(v.f).split(';').map(function (x) { return x.trim(); }).filter(function (x, i, a) { return x || a.length === 1; }), TK = toks(lines), st = [];
      st.push({ line: '6-7', slide: 18, lines: lines, pos: -1, cap: 'From the keyboard we used <code>new Scanner(System.in)</code>. For a file: <code>new Scanner(new File(filename))</code>, or a File object as here. The Scanner splits the input into <b>tokens</b> separated by whitespace.' });
      st.push({ slide: 20, line: 7, lines: lines, pos: -1, cap: 'Opening the file can throw a FileNotFoundException. It is inside try-with-resources, so the Scanner is closed automatically.' });
      var p = 0, out = [];
      while (true) {
        if (p >= TK.length) { st.push({ slide: 20, line: 8, lines: lines, pos: p, cap: '<code>hasNext()</code> is false: no more tokens. The loop ends.' }); break; }
        var a = TK[p], b = TK[p + 1], c = TK[p + 2];
        if (!b || !c) { st.push({ slide: 20, line: '9-11', lines: lines, pos: p, err: true, cap: 'The file ends in the middle of a record: next() finds no token and throws a NoSuchElementException, which the catch prints.', out: 'java.util.NoSuchElementException' }); break; }
        if (!/^[+-]?\d+$/.test(c.t)) { st.push({ slide: 20, line: 11, lines: lines, pos: p + 2, err: true, cap: '"' + h(c.t) + '" is not an int, so nextInt throws an <b>InputMismatchException</b>. The catch block prints it.', out: 'java.util.InputMismatchException' }); break; }
        st.push({ slide: 20, line: '9-12', lines: lines, pos: p, n: 3, cap: 'next() reads "' + h(a.t) + '", next() reads "' + h(b.t) + '", nextInt() reads ' + Number(c.t) + '. Print the record.', out: a.t + ' ' + b.t + ' ' + Number(c.t) });
        p += 3;
      }
      return st;
    },
    draw: function (k, s) {
      var items = [page('pg', 20, 20, 250, 'scores.txt', s.lines, {})], TK = toks(s.lines);
      TK.forEach(function (t, i) {
        var done = i < s.pos, on = i >= s.pos && i < s.pos + (s.n || 1);
        items.push(B('t' + i, 300 + (i % 3) * 82, 30 + Math.floor(i / 3) * 50, 78, 40, { title: t.t, mono: true, size: t.t.length > 7 ? 10 : 12, tone: on ? (s.err ? 'red' : 'accent') : done ? 'teal' : 'muted', r: 4, hi: on }));
      });
      if (!TK.length) items.push(T('e', 400, 60, 'no tokens', { anchor: 'middle', size: 13, tone: 'muted' }));
      items.push(T('lb', 300, 20, 'tokens', { size: 11, tone: 'muted' }));
      return items;
    }
  };

  /* ---------- 5. how the Scanner methods work (slides 21-23) ---------- */
  var tokens = {
    id: 'tokens', slides: [21, 23], title: 'Tokens, lines, and scanning a String',
    code: 'String s = "12 13";\nScanner in = new Scanner(s);\nint i = in.nextInt();\nint j = in.nextInt();\nint sum = i+j;\nSystem.out.printf("i=%d, j=%d, sum=%d\\n", i, j, sum);',
    inputs: [{ id: 's', type: 'text', label: 's', value: '12 13', maxlen: 20 }],
    presets: [{ label: '"12 13"', values: { s: '12 13' } }, { label: '"  7    8  "', values: { s: '  7    8  ' } }, { label: '"4 x"', values: { s: '4 x' } }],
    steps: function (v) {
      var t = String(v.s).match(/\S+/g) || [], ok = t.length >= 2 && t.slice(0, 2).every(function (x) { return /^[+-]?\d+$/.test(x); });
      var st = [
        { line: '3-4', slide: 21, ph: 'tok', cap: '<b>Token-based</b> methods (next, nextInt, nextDouble, …) skip delimiters (by default whitespace), then read one token that ends at a delimiter. <b>nextLine()</b> instead reads a whole line up to the newline (the newline itself is not returned).' },
        { line: 3, slide: 22, ph: 'conv', cap: 'nextInt converts the token into an int, nextDouble into a double, nextByte into a byte; next returns it as a String. If the token does not fit the type, a <b>java.util.InputMismatchException</b> is thrown.' },
        { slide: 23, line: '1-2', ph: 'str', t: t, cap: 'A Scanner can also scan a <b>String</b>: <code>new Scanner(s)</code>. Here the tokens are ' + t.map(function (x) { return '"' + h(x) + '"'; }).join(', ') + (t.length ? '.' : ': none.') }
      ];
      if (ok) st.push({ slide: 23, line: '3-6', ph: 'sum', t: t, cap: 'Two nextInt() calls give ' + Number(t[0]) + ' and ' + Number(t[1]) + '. The extra spaces do not matter: they are delimiters.', out: 'i=' + Number(t[0]) + ', j=' + Number(t[1]) + ', sum=' + (Number(t[0]) + Number(t[1])) });
      else st.push({ slide: 23, line: '3-4', ph: 'bad', t: t, cap: 'A token is missing or is not an int, so nextInt throws an exception (InputMismatchException, or NoSuchElementException when nothing is left).', out: 'Exception in thread "main" java.util.' + (t.length >= 2 ? 'InputMismatchException' : 'NoSuchElementException') });
      return st;
    },
    draw: function (k, s, v) {
      if (s.ph === 'tok') return [B('l', 30, 60, 500, 44, { title: 'John␣␣Smith␣90⏎', mono: true, size: 16, tone: 'blue' }), T('a', 40, 150, 'next() → "John", next() → "Smith", nextInt() → 90', { mono: true, size: 13, tone: 'accent', bold: true }), T('b', 40, 190, 'nextLine() → "John  Smith 90"', { mono: true, size: 13, tone: 'teal', bold: true })];
      if (s.ph === 'conv') return [['nextInt()', 'int'], ['nextDouble()', 'double'], ['nextByte()', 'byte'], ['next()', 'String (no conversion)']].map(function (r, i) { return B('c' + i, 60, 20 + i * 64, 440, 50, { title: r[0] + '  →  ' + r[1], mono: true, size: 14, tone: i === 3 ? 'teal' : 'blue' }); });
      var items = [B('s', 30, 30, 300, 44, { tag: 'String s', title: '"' + v.s.replace(/ /g, '␣') + '"', mono: true, size: 15, tone: 'blue' })];
      (s.t || []).forEach(function (x, i) { items.push(B('t' + i, 30 + i * 100, 130, 90, 44, { title: x, mono: true, size: 14, tone: s.ph === 'bad' && (i >= 2 || !/^[+-]?\d+$/.test(x)) ? 'red' : s.ph === 'sum' && i < 2 ? 'accent' : 'teal', r: 4 })); });
      if (s.ph === 'sum') items.push(vbox('sum', 360, 220, 160, 'sum', 'int', Number(s.t[0]) + Number(s.t[1]), hot()));
      return items;
    }
  };

  /* ---------- 6. ReplaceText (slides 24-25) ---------- */
  function replaceAll(line, f, r) { return f ? line.split(f).join(r) : line; }
  var RT = 'try (\n  Scanner input = new Scanner(sourcefile);\n  PrintWriter output = new PrintWriter(target);\n) {\n  while (input.hasNext()) {\n    String line = input.nextLine();\n    String replaceline = line.replaceAll(find, replace);\n    output.println(replaceline);\n  }\n}\ncatch (IOException ex) { System.out.println(ex); }';
  var replace = {
    id: 'replace', slides: [24, 25], title: 'Read a line, replace, write the line', code: RT,
    inputs: [{ id: 'src', type: 'text', label: 'source lines (split by ;)', value: 'I like Java; Java is fun; Bye', maxlen: 60 }, { id: 'f', type: 'text', label: 'find', value: 'Java', minlen: 1, maxlen: 10 }, { id: 'r', type: 'text', label: 'replace', value: 'C++', maxlen: 10 }],
    presets: [{ label: 'Java → C++', values: { src: 'I like Java; Java is fun; Bye', f: 'Java', r: 'C++' } }, { label: 'a → o', values: { src: 'banana; apple', f: 'a', r: 'o' } }, { label: 'not found', values: { src: 'one; two', f: 'xyz', r: 'Q' } }],
    steps: function (v) {
      var src = String(v.src).split(';').map(function (x) { return x.trim(); }), f = v.f, r = v.r, out = [], st = [];
      st.push({ line: '1-4', slide: 24, src: src, out: [], cur: -1, cap: 'ReplaceText asks for the source and target file names, the string to find and the string to replace it with. Then it opens both files in <b>one</b> try-with-resources.' });
      src.forEach(function (l, i) { var nl = replaceAll(l, f, r); out.push(nl); st.push({ slide: 25, line: '5-8', src: src, out: out.slice(), cur: i, cap: 'nextLine() reads "' + h(l) + '"; replaceAll gives "' + h(nl) + '"; println writes it to the target file.' }); });
      st.push({ slide: 25, line: '9-11', src: src, out: out.slice(), cur: -1, cap: 'No more lines: both files are closed automatically. (replaceAll reads its first argument as a pattern, so signs like . or * have a special meaning.)' });
      return st;
    },
    draw: function (k, s, v) {
      return [page('in', 20, 30, 240, 'source file', s.src, { hiLine: s.cur, tone: 'blue' }), A('a', 264, 90, 296, 90, { tone: 'accent', label: 'replace' }), page('out', 300, 30, 240, 'target file', s.out, { hiLine: s.cur, tone: 'teal' }), T('fr', 280, 300, '"' + v.f + '"  →  "' + v.r + '"', { anchor: 'middle', mono: true, size: 14, bold: true, tone: 'accent' })];
    }
  };

  var ALL = [tree, fileclass, write, read, tokens, replace];

  var para = function (t) { return { type: 'paragraph', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; },
    code = function (t, lang) { return lang ? { type: 'code', text: t, lang: lang } : { type: 'code', text: t }; }, note = function (t) { return { type: 'note', text: t }; };
  function braces(c) { var o = (c.match(/\{/g) || []).length, z = (c.match(/\}/g) || []).length; return o >= 2 && o === z; }
  var OUT = ['Files and Directories – the File class', 'Writing Data to a File – the PrintWriter class', 'Reading Data from a File – the Scanner class'];
  function outline(title, on, ex) { return { image: false, title: title, blocks: OUT.map(function (t, i) { return { type: 'bullet', html: i === on ? '<b>' + t + '</b>' : t, level: 0 }; }), explain: ex }; }

  addUnit({
    course: 'cs2', lesson: '06-file-io',
    blurb: 'Keep data after the program ends: file names and the File class, writing text files with PrintWriter, and reading them with Scanner.',
    parts: [
      {
        title: 'Files and the File class', from: 1, to: 9,
        quiz: [
          { q: 'Which is an absolute file name?', options: ['c:\\Users\\mudawar\\Documents\\data.txt', 'Users\\mudawar\\Documents\\data.txt', 'src\\Welcome.java'], answer: 0, why: 'It starts at the root (slide 4).' },
          { q: 'How do you write the file name c:\\book\\test.dat in a Java string?', options: ['"c:/book\\test.dat"', '"c:\\book\\test.dat"', '"c:\\\\book\\\\test.dat"'], answer: 2, why: 'A backslash is written \\\\ in a string literal (slide 6).' },
          { type: 'tf', q: 'The File class has methods to read the contents of a file.', answer: false, why: 'It only deals with names and properties (slide 5).' },
          { type: 'output', q: 'What does this print?', code: 'java.io.File f = new java.io.File("c:\\\\book\\\\test.dat");\nSystem.out.println(f.getName());', answer: 'test.dat', why: 'getName returns the last part of the path (slide 7).' },
          { q: 'Which separator makes a file name work on every system?', options: ['/', '\\', ':'], answer: 0, why: 'Slide 9: "image/us.gif".' }
        ]
      },
      {
        title: 'Writing data with PrintWriter', from: 10, to: 16,
        quiz: [
          { q: 'Which class writes data to a text file?', options: ['PrintWriter', 'File', 'Scanner'], answer: 0, why: 'Slide 11.' },
          { type: 'output', q: 'What is in out.txt after this?', code: 'PrintWriter output = new PrintWriter("out.txt");\noutput.print("A ");\noutput.println(1);\noutput.print("B");\noutput.close();', answer: 'A 1\nB', why: 'print stays on the line; println ends it.' },
          { q: 'Why call <code>output.close()</code>?', options: ['To delete the file when the program ends', 'To make sure the data is saved in the file', 'To read the file back from the start'], answer: 1, why: 'Slide 14.' },
          { q: 'What does try-with-resources do?', options: ['Makes the file read-only for other programs', 'Catches every exception thrown in the block', 'Closes the file automatically at the end of the block'], answer: 2, why: 'Slide 15.' },
          { q: 'Why does WriteData’s main say <code>throws IOException</code>?', options: ['Every main method must declare it', 'new PrintWriter(file) may throw a checked IOException', 'It closes the file when main ends'], answer: 1, why: 'Checked exceptions must be caught or declared (unit 5).' }
        ]
      },
      {
        title: 'Reading data with Scanner', from: 17, to: 25,
        quiz: [
          { q: 'How do you create a Scanner for a file?', options: ['new Scanner(new File(filename))', 'new Scanner(System.in)', 'new File(new Scanner())'], answer: 0, why: 'Slide 18.' },
          { type: 'output', q: 'scores.txt holds “Ann Lee 70” and “Bo Kim 88”. ReadData prints…', code: '// the loop of slide 20', answer: 'Ann Lee 70\nBo Kim 88', why: 'next, next, nextInt for each line.' },
          { q: 'What does <code>input.hasNext()</code> return when the file has no more tokens?', options: ['null', 'true', 'false'], answer: 2, why: 'That is what ends the while loop.' },
          { q: 'The token is "abc" and you call nextInt(). What happens?', options: ['It returns 0', 'InputMismatchException', 'It returns "abc"'], answer: 1, why: 'Slide 22.' },
          { type: 'output', q: 'What does this print?', code: 'Scanner in = new Scanner("5 6 7");\nint a = in.nextInt();\nint b = in.nextInt();\nSystem.out.println(a * b);', answer: '30', why: 'A Scanner can read a String (slide 23).' },
          { q: 'What is the difference between next() and nextLine()?', options: ['next reads one token; nextLine reads the rest of the line', 'They are the same: both read one word', 'next reads a number; nextLine reads text'], answer: 0, why: 'Slide 21.' }
        ]
      }
    ],
    slides: {
      1: { image: false, blocks: [para('Data stored in a program are temporary. They are lost when the program terminates.'), para('To permanently save the data created by a program, you should store them in a file on disk.')],
        explain: '<p>Variables live in the computer’s <b>{{memory|الذاكرة}}</b>, and memory is emptied when the program ends. Run a game again and your score is gone.</p><p>To keep data, a program must save it in a <b>{{file|ملف}}</b> on the disk. A file stays after the program ends, and after the computer is turned off. Next time, the program can read the file and continue.</p><p>This unit shows how Java names files, writes text into them, and reads it back.</p>' },
      2: outline('Outline', -1, '<p>Three parts: file names, writing, reading. (The slide footer says “Exception Handling”; it is the File IO chapter.)</p>'),
      3: { image: false, title: 'Files and Directories', blocks: [bul('Every operating system, such as Windows or Linux, comes with a file system for storing files.'), bul('The file system is organized as a tree of directories.'), bul('Every file is placed in a directory in the file system.'), bul('The root of the file system starts with a drive letter, such as c:\\ on the Windows OS, or slash / on the Linux OS.'), bul('Directory names are separated by backslash \\ on Windows, or slash / on the Linux OS.')],
        explain: '<p>Every operating system keeps files in a <b>tree of directories</b> (folders). A {{directory|مجلد}} can hold files and other directories.</p><ul><li>The top of the tree, the <b>{{root|الجذر}}</b>, is a drive like <code>c:\\</code> on Windows, or <code>/</code> on Linux.</li><li>Between directory names, Windows writes a backslash <code>\\</code>; Linux writes a slash <code>/</code>.</li></ul><p>So the same kind of path looks like <code>c:\\Users\\ali\\notes.txt</code> on Windows and <code>/home/ali/notes.txt</code> on Linux.</p>' },
      4: { image: false, title: 'Absolute versus Relative File Names', blocks: [bul('An absolute file name contains the complete directory path'), code('c:\\Users\\mudawar\\Documents\\JavaCode\\src\\Welcome.java', 'none'), para('is an absolute file name on the Windows OS.'), code('/home/mudawar/JavaCode/src/Welcome.java', 'none'), para('is an absolute file name on the Linux OS.'), bul('A relative file name starts at the current working directory and does not include the complete directory path.'), para('Welcome.java is a relative file name in the src directory.'), para('src/Welcome.java is a relative name in the JavaCode directory.')],
        explain: '<p>Two ways to name a file:</p><ul><li>An <b>{{absolute|مطلق: من الجذر}}</b> name gives the <b>whole path from the root</b>: <code>c:\\Users\\mudawar\\Documents\\JavaCode\\src\\Welcome.java</code>. It works from anywhere.</li><li>A <b>{{relative|نسبي: من المجلد الحالي}}</b> name starts from the <b>current working directory</b> (where the program runs): <code>Welcome.java</code> or <code>src/Welcome.java</code>. It is short, but it only works if the program runs in the right folder.</li></ul><p>Quick test: does the name start at a drive or at <code>/</code>? Then it is absolute.</p>' },
      5: { image: false, title: 'The File class', blocks: [bul('The File class provides an abstraction that deals with file and directory path names in a machine-independent fashion.'), bul('The File class contains the methods for obtaining the properties of a file or directory, and for renaming and deleting a file or directory.'), bul('However, the File class does not contain the methods for reading and writing file contents.'), bul('The file name is a string. The File class is a wrapper for the file name and its directory path.')],
        explain: '<p>The <b>File</b> class (in java.io) holds a file’s <b>name and path</b>, and works the same on every system.</p><p>A File object can answer questions about the file (does it exist? how big is it? is it a folder?) and can rename or delete it.</p><p class="watch">A File object does <b>not</b> read or write the file’s {{contents|المحتوى}}. Think of it as the label on a box, not the box’s contents. For reading and writing you need Scanner and PrintWriter (later in this unit).</p>' },
      6: { image: false, title: 'The java.io.File class', blocks: [para('For example, new File("c:\\\\Users\\\\mudawar\\\\Documents\\\\data.txt") creates a File object for the file c:\\Users\\mudawar\\Documents\\data.txt on Windows.'), note('The backslash \\ should be written as "\\\\" in a string literal.')],
        explain: '<p>Make a File object with the path as a String:</p><pre class="ex">new File("c:\\\\Users\\\\mudawar\\\\Documents\\\\data.txt")</pre><p>Why the double backslash? In a Java string, <code>\\</code> starts an escape sequence, like <code>\\n</code> (CS I unit 5). To get one real backslash you must write <code>\\\\</code>. So this string means the file <code>c:\\Users\\mudawar\\Documents\\data.txt</code>.</p><p>Question methods: exists(), canRead(), canWrite(), isDirectory(), isFile(), isAbsolute(), isHidden(). Each returns true or false.</p>' },
      7: { image: false, title: 'The java.io.File class', blocks: [para('More methods: getAbsolutePath, getCanonicalPath, getName, getPath, getParent, lastModified, length, listFile, delete, renameTo, mkdir and mkdirs.')],
        explain: '<p>More File methods:</p><ul><li><code>getName()</code>: the last part, like test.dat; <code>getParent()</code>: the directory before it, like c:\\book.</li><li><code>getAbsolutePath()</code>, <code>getPath()</code>: the full or the given path.</li><li><code>length()</code>: the size in bytes; <code>lastModified()</code>: when it was last changed.</li><li><code>delete()</code>, <code>renameTo(…)</code>, <code>mkdir()</code>: they change the disk and return true if they worked.</li></ul><p>(The slide writes listFile; the real method is listFiles.)</p>' },
      8: { image: false, title: 'Testing the File class', blocks: [code(TFC)], explain: '<p>TestFileClass makes a File object for the relative name "image/us.gif" and prints its properties.</p><p>Notice that creating the File object does not create or open the file. If the file does not exist, exists() is false and length() is 0. The output therefore depends on the computer it runs on.</p>' },
      9: { image: false, title: 'Sample Run', blocks: [bul('The forward slash / is the Java directory separator.'), bul('The file name "image/us.gif" is platform independent, and can be used on Windows, Unix, and other operating systems.', 1), code('C:\\book>java TestFileClass\nDoes it exist? true\nThe file has 2998 bytes\nCan it be read? true\nCan it be written? true\nIs it a directory? false\nIs it a file? true\nIs it absolute? false\nIs it hidden? false\nAbsolute path is C:\\book\\image\\us.gif\nLast modified on Tue Nov 02 08:20:45 EST 2004', 'none')],
        explain: '<p>The sample run on Windows: the file exists (2998 bytes), it can be read and written, it is a file and not a directory, and the name is <b>not absolute</b>. getAbsolutePath() adds the current directory in front: C:\\book\\image\\us.gif.</p><p>The name was written with a forward slash, "image/us.gif", and it still worked on Windows. In Java, <code>/</code> works as a directory {{separator|فاصل}} on every system, so prefer it.</p>' },
      10: outline('Next . . .', 1, '<p>Next: writing to a file.</p>'),
      11: { image: false, title: 'File Input and Output', blocks: [bul('A File object encapsulates the properties of a file or a path, but it does not contain the methods for reading/writing data from/to a file.'), bul('To perform file input and output (or I/O for short), you need to create objects using the appropriate Java I/O classes.'), bul('To read data from a text file, use the Scanner class.'), bul('To write data to a text file, use the PrintWriter class.'), bul('The Scanner and PrintWriter objects contain the methods for reading/writing data from/to a file.')],
        explain: '<p>To work with the <b>contents</b> of a text file you need two other classes:</p><ul><li><b>Scanner</b> to <b>read</b> from a file (you know it from the keyboard).</li><li><b>PrintWriter</b> to <b>write</b> to a file.</li></ul><p>{{I/O|الإدخال والإخراج}} is short for input and output: input comes into the program, output goes out of it.</p>' },
      12: { image: false, title: 'Writing Data using PrintWriter', blocks: [bul('The java.io.PrintWriter class is used to create and write data to a text file.'), bul('First, you should create a PrintWriter object as follows:'), code('PrintWriter output = new PrintWriter(filename);'), bul('Then you can use the print, println, and printf methods on the PrintWriter object to write data to a file.'), code('output.print("John T Smith ");\noutput.print(90);')],
        explain: '<p>Writing has two steps:</p><pre class="ex">PrintWriter output = new PrintWriter("scores.txt");\noutput.print("John T Smith ");\noutput.print(90);</pre><p>Creating the PrintWriter creates the file. Then print, println and printf write into the file instead of the screen.</p><p class="watch">If the file already exists, <code>new PrintWriter</code> <b>empties it</b> first: its old contents are lost.</p>' },
      13: { image: false, title: 'The java.io.PrintWriter class', blocks: [para('The PrintWriter class contains the methods for writing data to a text file.')],
        explain: '<p>PrintWriter has the same methods as System.out: print, println and printf. print is overloaded for String, char, char[], int, long, float, double and boolean.</p><p>println ends the line with the system’s line separator. So anything you can print on the screen, you can write into a file the same way.</p>' },
      14: { image: false, title: 'Example of Writing Data to a Text File', blocks: [code(WD)], explain: '<p>WriteData does three things:</p><ol><li>It checks <code>file.exists()</code> first. If scores.txt is already there, it stops, so the old data is not {{destroyed|يُتلف}}.</li><li>It writes two lines: print stays on the line, println ends it. The file holds <code>John Smith 90</code> and <code>Eric Jones 85</code>.</li><li>It calls <code>output.close()</code>.</li></ol><p class="watch">Without close(), the data may <b>not be saved</b> in the file. And main says <code>throws IOException</code>, because creating the PrintWriter may throw this checked exception (unit 5).</p>' },
      15: { image: false, title: 'Try with Resources', blocks: [bul('Programmers sometimes forget to close the files.'), bul('The Java language provides the try-with-resources syntax that automatically closes the open files:'), code('try (declare and create resources) {\n  Use the resource to process the file;\n}', 'none'), bul('Using the try-with-resources syntax, we can rewrite the code as shown in the next slide.')],
        explain: '<p>Forgetting close() is a common mistake. Java has a safer form, <b>{{try-with-resources|try مع موارد تُغلق تلقائياً}}</b>:</p><pre class="ex">try (PrintWriter output = new PrintWriter(file)) {\n  use output here;\n}   // output is closed here automatically</pre><p>A <b>{{resource|مورد: شيء يجب إغلاقه}}</b> is something that must be closed, like a file. Declared in the parentheses after try, it is closed automatically when the block ends, even if an exception happens inside.</p>' },
      16: { image: false, title: 'Example of Writing Data with Auto Close', blocks: [code('import java.io.*;\n\npublic class WriteDataWithAutoClose {\n  public static void main(String[] args) throws IOException {\n    File file = new File("scores.txt");\n    if (file.exists()) {\n      System.out.println("File scores.txt already exists");\n      System.exit(1);  // Exit the program\n    }\n\n    try ( PrintWriter output = new PrintWriter(file); ) {\n      output.print("John Perez ");  // Print to output file\n      output.println(92);           // Print to output file\n      output.print("Fahd Amr ");    // Print to output file\n      output.println(89);           // Print to output file\n    }\n  }\n}')],
        explain: '<p>The same program with try-with-resources. The PrintWriter is created inside <code>try ( … )</code>, the four writes are inside the block, and there is <b>no close()</b>: Java closes the file when the block ends.</p><p>The file holds <code>John Perez 92</code> and <code>Fahd Amr 89</code>. Use this form whenever you open a file.</p>' },
      17: outline('Next . . .', 2, '<p>Next: reading from a file.</p>'),
      18: { image: false, title: 'Reading Data using Scanner', blocks: [bul('The java.util.Scanner class was used to read strings and primitive values from the keyboard.'), bul('To read from the keyboard, create a Scanner object for System.in, as follows:'), code('Scanner input = new Scanner(System.in);'), bul('The Scanner class breaks its input into tokens separated by whitespace characters.'), bul('To read from a file, create a Scanner object for a file:'), code('Scanner input = new Scanner(new File(filename));')],
        explain: '<p>You already used Scanner with the keyboard: <code>new Scanner(System.in)</code>. To read a file, give it a File instead:</p><pre class="ex">Scanner input = new Scanner(new File("scores.txt"));</pre><p>Everything else is the same: next(), nextInt(), nextLine() and the others. The Scanner breaks the input into <b>tokens</b>: pieces separated by whitespace (spaces, tabs, new lines).</p>' },
      19: { image: false, title: 'The java.util.Scanner class', blocks: [para('The Scanner class contains the methods for scanning data: Scanner(source: File), Scanner(source: String), close(), hasNext(), next(), nextLine(), nextByte(), nextShort(), nextInt(), nextLong(), nextFloat(), nextDouble(), useDelimiter(pattern).')],
        explain: '<p>Scanner can read from a File or from a String. Its main methods:</p><ul><li><code>hasNext()</code>: is there another token? (true or false)</li><li><code>next()</code>, <code>nextInt()</code>, <code>nextDouble()</code>, …: read one token.</li><li><code>nextLine()</code>: read the rest of the line.</li><li><code>close()</code>: close the source.</li><li><code>useDelimiter(…)</code>: change what {{separates|يفصل}} {{tokens|وحدات نصية مفصولة بمسافات}}, for example a comma.</li></ul>' },
      20: { image: false, title: 'Example of Reading Data from a Text File', blocks: [code(RD), note('new Scanner(file) can throw FileNotFoundException')],
        explain: '<p>ReadData reads scores.txt record by record. Each line is <b>three tokens</b>: first name, last name, score.</p><pre class="ex">while (input.hasNext()) {\n  String firstName = input.next();\n  String lastName = input.next();\n  int score = input.nextInt();\n  …\n}</pre><p>The loop stops when hasNext() is false: no tokens left. The Scanner is opened in a try-with-resources, so it is closed automatically. <code>new Scanner(file)</code> can throw a FileNotFoundException if the file is missing; the catch prints it.</p>' },
      21: { image: false, title: 'How does the Scanner Methods Work?', blocks: [bul('Token-based methods read input separated by delimiters:'), code('next(), nextByte(), nextShort(), nextInt(),\nnextLong(), nextFloat(), and nextDouble().', 'none'), bul('By default, the delimiters are whitespace characters.'), bul('A token-based input method skips any delimiters then reads a token ending at a delimiter.'), bul('However, nextLine() reads a complete line ending with a newline separator. The newline is read but is not part of the returned string.')],
        explain: '<p>How does the Scanner find tokens? A <b>{{delimiter|فاصل}}</b> separates them; by default that is whitespace.</p><ul><li><b>Token methods</b> (next, nextInt, nextDouble, …) first skip any delimiters, then read characters until the next delimiter.</li><li><b>nextLine()</b> reads everything up to the end of the line. The newline is read, but it is <b>not</b> part of the returned string.</li></ul><pre class="ex">input "Hi there 42":\nnext()     → "Hi"\nnextLine() → " there 42"</pre>' },
      22: { image: false, title: 'How does the Scanner Methods Work?', blocks: [bul('The token-based methods convert an input token into a primitive numeric value. For example:'), para('nextByte() converts an input token into a byte.'), para('nextInt() converts an input token into an int.'), para('nextDouble() converts an input token into a double.'), para('However, next() returns a string token without conversion.'), bul('If the token does not match the expected type, a runtime java.util.InputMismatchException is thrown.')],
        explain: '<p>Token methods also <b>convert</b> the token: nextInt() turns "25" into the int 25, nextDouble() into 25.0, nextByte() into a byte. Only next() returns the token as a String, without converting it.</p><p class="watch">If the token does not fit the type, like "abc" for nextInt(), the program throws an <b>InputMismatchException</b>: the same exception you handled in unit 5.</p>' },
      23: { image: false, title: 'Scanning a String', blocks: [bul('You can also use the Scanner class to scan a string.'), bul('Example:'), code('String s = "12 13";\nScanner in = new Scanner(s);\nint i = in.nextInt();\nint j = in.nextInt();\nint sum = i+j;\nSystem.out.printf("i=%d, j=%d, sum=%d\\n", i, j, sum);')],
        explain: '<p>A Scanner can also read from a <b>String</b>:</p><pre class="ex">Scanner in = new Scanner("12 13");\nint i = in.nextInt();   // 12\nint j = in.nextInt();   // 13</pre><p>The program prints <code>i=12, j=13, sum=25</code>. This is a handy way to split a line of text into numbers.</p>' },
      24: { image: false, title: 'Replacing Text', blocks: [bul('Write a class ReplaceText that finds all occurrences of a string in a text file and replaces them with a new string.'), bul('Ask the user to enter the source and target filenames, the string to find and the string to replace.'), code('import java.io.*;\nimport java.util.*;\n\npublic class ReplaceText {\n  public static void main(String[] args) throws IOException {\n    Scanner in = new Scanner(System.in);\n    System.out.print("Enter Source filename: ");\n    String source = in.next();  // source filename\n    System.out.print("Enter Target filename: ");\n    String target = in.next();  // target filename')],
        explain: '<p>A complete program that uses everything in this unit: keyboard input, reading one file, and writing another.</p><p>ReplaceText asks for four things: the source file name, the target file name, the text to find, and the text to replace it with. Then it copies the source into the target line by line, changing the text as it goes.</p>' },
      25: { image: false, title: 'Replacing Text – cont’d', blocks: [code('    System.out.print("Enter string to find: ");\n    String find = in.next();     // string to find\n    System.out.print("Enter string to replace: ");\n    String replace = in.next();  // string to replace\n\n    File sourcefile = new File(source);  // source file object\n    try (                                 // try with resources\n      Scanner input = new Scanner(sourcefile);\n      PrintWriter output = new PrintWriter(target);\n    ) {\n      while (input.hasNext()) {\n        String line = input.nextLine();\n        String replaceline = line.replaceAll(find, replace);\n        output.println(replaceline);\n      }\n    }\n    catch (IOException ex) { System.out.println(ex); }\n  }\n}')],
        explain: '<p>The core loop:</p><pre class="ex">while (input.hasNext()) {\n  String line = input.nextLine();\n  String replaceline = line.replaceAll(find, replace);\n  output.println(replaceline);\n}</pre><p>Read a line, replace every match in it (replaceAll returns a new string), write the new line. The try-with-resources opens <b>two</b> resources, the Scanner and the PrintWriter, separated by a semicolon; both are closed {{automatically|تلقائياً}} at the end.</p>' }
    },
    visuals: ALL,
    exam: {
      questions: [
        { q: 'Why store data in a file?', options: ['Files are faster than variables', 'Data in a program is lost when the program ends', 'Java needs it'], answer: 1, review: 1, why: 'Slide 1.' },
        { q: 'The current directory is JavaCode. What is the relative name of Welcome.java in JavaCode\\src?', options: ['src\\Welcome.java', 'Welcome.java', 'c:\\src\\Welcome.java'], answer: 0, review: 4, why: 'Slide 4.' },
        { type: 'output', q: 'What does this print?', code: 'java.io.File f = new java.io.File("c:\\\\book\\\\test.dat");\nSystem.out.println(f.getParent());', answer: 'c:\\book', review: 7, why: 'The parent directory.' },
        { q: 'What does <code>file.length()</code> return for a file that does not exist?', options: ['an exception', '-1', '0'], answer: 2, review: 7, why: 'Slide 7.' },
        { type: 'output', q: 'What is in data.txt?', code: 'PrintWriter out = new PrintWriter("data.txt");\nout.println("x");\nout.print(3);\nout.print(4);\nout.close();', answer: 'x\n34', review: 12, why: 'println ends the first line; print keeps going.' },
        { q: 'What happens to the old contents if you create a PrintWriter for an existing file?', options: ['New text is added at the end', 'They are erased', 'An error'], answer: 1, review: 14, why: 'That is why WriteData checks file.exists() first.' },
        { q: 'Which is the try-with-resources form?', options: ['try PrintWriter out { }', 'try { PrintWriter out ... } finally', 'try (PrintWriter out = new PrintWriter(f)) { ... }'], answer: 2, review: 15, why: 'Resources go in parentheses after try.' },
        { type: 'output', q: 'A file holds the line “7 9”. What does this print?', code: 'Scanner in = new Scanner(new File("n.txt"));\nint a = in.nextInt();\nint b = in.nextInt();\nSystem.out.println(a + b);', answer: '16', review: 18, why: 'Two tokens converted to ints.' },
        { q: 'Which call reads a whole line?', options: ['nextLine()', 'next()', 'nextInt()'], answer: 0, review: 21, why: 'Slide 21.' },
        { type: 'output', q: 'What does this print?', code: 'Scanner in = new Scanner("  a   b ");\nSystem.out.println(in.next() + in.next());', answer: 'ab', review: 21, why: 'Spaces are delimiters and are skipped.' },
        { q: 'In ReplaceText, what does <code>line.replaceAll(find, replace)</code> do to the file?', options: ['It deletes the line', 'It changes the source file directly', 'Nothing; it returns a new String that is then written'], answer: 2, review: 25, why: 'Strings are immutable; the new line goes to the target file.' },
        { type: 'fill', q: 'The file is c:\\data\\marks.txt. Complete the string.', code: 'File f = new File("c:___data___marks.txt");', answer: ['\\\\', '\\\\'], review: 6, why: 'In a string literal one backslash is written as two: \\\\.' },
        { type: 'fill', q: 'Complete the code that writes Hi into log.txt and saves it.', code: 'PrintWriter out = new ___("log.txt");\nout.println("Hi");\nout.___();', answer: ['PrintWriter', 'close'], review: 14, why: 'PrintWriter writes text files; close() makes sure the data is saved.' },
        { type: 'write', q: 'f is a File object. Print Found if the file exists, otherwise print Missing.', rows: 4, checks: [{ re: /if\s*\(\s*f\s*\.\s*exists\s*\(\s*\)\s*\)/, label: 'if (f.exists())' }, { re: /println\s*\(\s*"Found"\s*\)\s*;/, label: 'System.out.println("Found");' }, { re: /else[\s\S]*println\s*\(\s*"Missing"\s*\)\s*;/, label: 'else System.out.println("Missing");' }], solution: 'if (f.exists())\n  System.out.println("Found");\nelse\n  System.out.println("Missing");', review: 6, why: 'exists() returns true or false; a File object can answer questions about a file.' },
        { type: 'write', q: 'file is a File object. With try-with-resources, open a Scanner named in for it and print every token on its own line.', rows: 6, checks: [{ re: /try\s*\(\s*Scanner\s+in\s*=\s*new\s+Scanner\s*\(\s*file\s*\)\s*;?\s*\)/, label: 'try (Scanner in = new Scanner(file))' }, { re: /while\s*\(\s*in\s*\.\s*hasNext\s*\(\s*\)\s*\)/, label: 'while (in.hasNext())' }, { re: /println\s*\(\s*in\s*\.\s*next\s*\(\s*\)\s*\)\s*;/, label: 'System.out.println(in.next());' }], solution: 'try (Scanner in = new Scanner(file)) {\n  while (in.hasNext())\n    System.out.println(in.next());\n}', review: 20, why: 'hasNext() stops the loop when no tokens are left; the Scanner closes by itself.' },
        { type: 'trace', q: 'The Scanner reads the two lines “7 apples” and “end”. What is in each variable?', code: 'Scanner in = new Scanner("7 apples\\nend");\nint n = in.nextInt();\nString w = in.next();\nString rest = in.nextLine();   // the rest of line 1\nString last = in.nextLine();', cols: ['variable', 'value'], rows: [['n', '?7'], ['w', '?apples'], ['last', '?end']], review: 21, why: 'nextInt and next read tokens. The first nextLine reads what is left of line 1 (nothing); the second reads the whole next line, end.' },
        { type: 'bug', q: 'One line does not compile. Tap it.', code: 'File f = new File("data.txt");\nSystem.out.println(f.exists());\nf.println("Hello");', answer: 3, review: 11, why: 'A File object cannot write a file’s contents. Use a PrintWriter for that.' },
        { type: 'match', q: 'Match each Scanner method with what it gives you.', pairs: [['hasNext()', 'true if another token is left'], ['next()', 'One token, as a String'], ['nextLine()', 'The rest of the line']], review: 21, why: 'Token methods read one token; nextLine reads to the end of the line.' }
      ],
      tasks: [
        {
          title: 'Write a file',
          task: '<p>Write the two lines <code>Hello</code> and <code>File</code> into <code>out.txt</code> using a <b>PrintWriter</b> in a <b>try-with-resources</b>. main must declare <code>throws IOException</code>.</p>',
          starter: 'import java.io.*;\n\npublic class WriteTwo {\n  public static void main(String[] args) throws IOException {\n    \n  }\n}',
          output: 'out.txt:\nHello\nFile',
          checks: [
            { re: /try\s*\(\s*PrintWriter\s+\w+\s*=\s*new\s+PrintWriter\s*\(\s*"out\.txt"\s*\)\s*;?\s*\)/, label: '<code>try (PrintWriter output = new PrintWriter("out.txt"))</code>', review: 15 },
            { re: /\.println\s*\(\s*"Hello"\s*\)/, label: 'Writes Hello with println', review: 12 },
            { re: /\.println\s*\(\s*"File"\s*\)/, label: 'Writes File with println', review: 12 },
            { fn: braces, label: 'Braces match', review: 16 }
          ],
          solution: 'import java.io.*;\n\npublic class WriteTwo {\n  public static void main(String[] args) throws IOException {\n    try (PrintWriter output = new PrintWriter("out.txt")) {\n      output.println("Hello");\n      output.println("File");\n    }\n  }\n}'
        },
        {
          title: 'Sum the numbers in a file',
          task: '<p>The file <code>nums.txt</code> holds integers separated by spaces. Read it with a <b>Scanner</b> on a <b>File</b>, add the numbers in a <code>while (input.hasNext())</code> loop, and print the sum.</p>',
          starter: 'import java.io.*;\nimport java.util.Scanner;\n\npublic class SumFile {\n  public static void main(String[] args) throws Exception {\n    \n  }\n}',
          output: 'nums.txt: 4 5 6\n15',
          checks: [
            { re: /new\s+Scanner\s*\(\s*new\s+File\s*\(\s*"nums\.txt"\s*\)\s*\)|new\s+Scanner\s*\(\s*\w+\s*\)/, label: 'A Scanner on <code>new File("nums.txt")</code>', review: 18 },
            { re: /File\s*\(\s*"nums\.txt"\s*\)/, label: 'Uses the file nums.txt', review: 18 },
            { re: /while\s*\(\s*\w+\.hasNext\s*\(\s*\)\s*\)/, label: '<code>while (input.hasNext())</code>', review: 20 },
            { re: /\w+\s*\+=\s*\w+\.nextInt\s*\(\s*\)/, label: 'Adds <code>input.nextInt()</code> to the sum', review: 22 },
            { re: /println\s*\(\s*\w+\s*\)/, label: 'Prints the sum', review: 20 }
          ],
          solution: 'import java.io.*;\nimport java.util.Scanner;\n\npublic class SumFile {\n  public static void main(String[] args) throws Exception {\n    int sum = 0;\n    try (Scanner input = new Scanner(new File("nums.txt"))) {\n      while (input.hasNext())\n        sum += input.nextInt();\n    }\n    System.out.println(sum);\n  }\n}'
        }
      ]
    }
  });
})();
