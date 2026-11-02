/* CS2 · File IO: quick checks under the slides (1-2 per slide) and more part-quiz questions. */
addChecks({
  course: 'cs2', lesson: '06-file-io',
  slides: {
    1: [
      { type: 'tf', q: 'The values of a program’s variables stay after the program ends.', answer: false, why: 'They are temporary. To keep data, store it in a file on disk.' }
    ],
    2: [
      { type: 'match', q: 'Match each job with the class of this unit.', pairs: [['Names and properties of files', 'File'], ['Writing data to a file', 'PrintWriter'], ['Reading data from a file', 'Scanner']], why: 'The three parts of the outline.' }
    ],
    3: [
      { type: 'match', q: 'Match each operating system with its root and its separator.', pairs: [['Windows', 'Root like c:\\, separator \\'], ['Linux', 'Root /, separator /']], why: 'Slide 3.' }
    ],
    4: [
      { type: 'trace', q: 'Is each file name absolute or relative?', cols: ['file name', 'kind'], rows: [['c:\\Users\\mudawar\\Documents\\data.txt', '?absolute'], ['/home/mudawar/JavaCode/src/Welcome.java', '?absolute'], ['src/Welcome.java', '?relative'], ['Welcome.java', '?relative']], why: 'An absolute name has the complete path from the root.' }
    ],
    5: [
      { type: 'tf', q: 'A File object can rename or delete a file.', answer: true, why: 'But it cannot read or write the file’s contents.' }
    ],
    6: [
      { type: 'write', q: 'Create a File object named f for c:\\data\\marks.txt (write the backslashes correctly).', checks: [{ re: /File\s+f\s*=\s*new\s+(java\s*\.\s*io\s*\.\s*)?File\s*\(\s*"c:\\\\data\\\\marks\.txt"\s*\)\s*;/, label: 'File f = new File("c:\\\\data\\\\marks.txt");' }], solution: 'File f = new File("c:\\\\data\\\\marks.txt");', why: 'In a string literal each backslash is written \\\\.' }
    ],
    7: [
      { type: 'trace', q: 'f is new File("c:\\\\book\\\\test.dat"). What do the calls return on Windows?', cols: ['call', 'returns'], rows: [['f.getName()', '?test.dat'], ['f.getParent()', '?c:\\book']], why: 'getName is the last part; getParent is the directory before it.' }
    ],
    8: [
      { q: 'TestFileClass prints Is it absolute? for "image/us.gif". What is printed?', options: ['true', 'false: it is a relative name', 'It does not compile'], answer: 1, why: 'The name starts at the current directory.' }
    ],
    9: [
      { type: 'output', q: 'In the sample run of slide 9, what is printed for the size?', code: 'System.out.println("The file has " + file.length() + " bytes");', answer: 'The file has 2998 bytes', why: 'The sample run on Windows shows 2998 bytes.' }
    ],
    11: [
      { type: 'match', q: 'Match each job with the class you need.', pairs: [['Read data from a text file', 'Scanner'], ['Write data to a text file', 'PrintWriter']], why: 'A File object alone cannot read or write.' }
    ],
    12: [
      { type: 'write', q: 'Create a PrintWriter named out for the file "log.txt".', checks: [{ re: /PrintWriter\s+out\s*=\s*new\s+PrintWriter\s*\(\s*"log\.txt"\s*\)\s*;/, label: 'PrintWriter out = new PrintWriter("log.txt");' }], solution: 'PrintWriter out = new PrintWriter("log.txt");', why: 'Then use print, println and printf on it.' }
    ],
    13: [
      { type: 'tf', q: 'PrintWriter has printf, just like System.out.', answer: true, why: 'print, println and printf are all there.' }
    ],
    14: [
      { type: 'output', q: 'What is in scores.txt after WriteData?', code: 'PrintWriter output = new PrintWriter(file);\noutput.print("John Smith ");\noutput.println(90);\noutput.print("Eric Jones ");\noutput.println(85);\noutput.close();', answer: 'John Smith 90\nEric Jones 85', why: 'print stays on the line; println ends it.' }
    ],
    15: [
      { q: 'What is a resource in try-with-resources?', options: ['A variable that never changes', 'A kind of exception', 'Something that must be closed, like a file'], answer: 2, why: 'It is closed automatically.' }
    ],
    16: [
      { q: 'A program writes two lines with a PrintWriter but never calls close(). What may happen?', options: ['The file is deleted', 'The data may not be saved in the file', 'Nothing: close() is never needed'], answer: 1, why: 'Close the file (or use try-with-resources) to make sure the data is saved.' }
    ],
    18: [
      { type: 'match', q: 'Match each Scanner with what it reads.', pairs: [['new Scanner(System.in)', 'The keyboard'], ['new Scanner(new File("a.txt"))', 'A file'], ['new Scanner("1 2 3")', 'A string']], why: 'The same methods work on each one.' }
    ],
    19: [
      { type: 'tf', q: 'useDelimiter can make a Scanner split tokens at commas.', answer: true, why: 'It changes what separates the tokens.' }
    ],
    20: [
      { type: 'output', q: 'scores.txt holds the two lines below. What does ReadData print?', code: '// scores.txt:\n// Sara Ali 95\n// Omar Saad 78\nwhile (input.hasNext()) {\n  String firstName = input.next();\n  String lastName = input.next();\n  int score = input.nextInt();\n  System.out.println(firstName + " " + lastName + " " + score);\n}', answer: 'Sara Ali 95\nOmar Saad 78', why: 'Each record is three tokens.' }
    ],
    21: [
      { type: 'trace', q: 'The input is the line:  Hi there 42  What does each call return?', code: 'Scanner in = new Scanner("Hi there 42");\nString a = in.next();\nString b = in.nextLine();', cols: ['variable', 'value'], rows: [['a', '?Hi'], ['b', '? there 42|there 42']], why: 'next reads one token; nextLine reads the rest of the line (it starts with the space).' }
    ],
    22: [
      { type: 'match', q: 'Match each method with what it returns for the token "25".', pairs: [['next()', 'The String "25"'], ['nextInt()', 'The int 25'], ['nextDouble()', 'The double 25.0']], why: 'Token-based methods convert the token; next does not.' }
    ],
    23: [
      { type: 'output', q: 'What does slide 23 print?', code: 'String s = "12 13";\nScanner in = new Scanner(s);\nint i = in.nextInt();\nint j = in.nextInt();\nint sum = i+j;\nSystem.out.printf("i=%d, j=%d, sum=%d\\n", i, j, sum);', answer: 'i=12, j=13, sum=25', why: 'The Scanner reads the two numbers from the string.' }
    ],
    24: [
      { q: 'What does ReplaceText ask the user for?', options: ['A number of lines to copy from the file', 'Only one file name, which it changes in place', 'The source and target file names, the string to find and the string to replace'], answer: 2, why: 'Slide 24.' }
    ],
    25: [
      { type: 'output', q: 'A line of the source file is  ababa  find is "ab" and replace is "X". What is written to the target file?', code: 'String replaceline = line.replaceAll(find, replace);\noutput.println(replaceline);', answer: 'XXa', why: 'Every "ab" is replaced: ab-ab-a becomes X-X-a.' }
    ]
  },
  parts: {
    0: [
      { type: 'trace', q: 'file is new File("notes.txt"), and the file does not exist. What does each call return?', cols: ['call', 'returns'], rows: [['file.exists()', '?false'], ['file.length()', '?0'], ['file.isAbsolute()', '?false']], why: 'length() is 0 for a file that does not exist; notes.txt is a relative name.' },
      { type: 'tf', q: 'The file name "image/us.gif" works on Windows and Linux.', answer: true, why: 'The forward slash is the Java directory separator.' }
    ],
    1: [
      { type: 'write', q: 'With try-with-resources, open a PrintWriter named out for "data.txt" and write the line Hello.', rows: 3, checks: [{ re: /try\s*\(\s*PrintWriter\s+out\s*=\s*new\s+PrintWriter\s*\(\s*"data\.txt"\s*\)\s*;?\s*\)\s*\{/, label: 'try (PrintWriter out = new PrintWriter("data.txt")) {' }, { re: /out\s*\.\s*println\s*\(\s*"Hello"\s*\)\s*;/, label: 'out.println("Hello");' }], solution: 'try (PrintWriter out = new PrintWriter("data.txt")) {\n  out.println("Hello");\n}', why: 'The file closes by itself when the block ends.' },
      { type: 'output', q: 'What is in nums.txt?', code: 'PrintWriter p = new PrintWriter("nums.txt");\nfor (int i = 1; i <= 3; i++)\n  p.print(i * 10 + " ");\np.println();\np.print("end");\np.close();', answer: '10 20 30\nend', why: 'print keeps the numbers on one line; println ends it.' }
    ],
    2: [
      { type: 'output', q: 'What does this print?', code: 'Scanner in = new Scanner("4 apples 2.5");\nint n = in.nextInt();\nString w = in.next();\ndouble d = in.nextDouble();\nSystem.out.println(n * d + " " + w);', answer: '10.0 apples', why: '4 * 2.5 = 10.0.' },
      { type: 'bug', q: 'This code stops with an InputMismatchException. Tap the wrong line.', code: '// the file holds: Ali 90 A\nString name = input.next();\nint score = input.nextInt();\nint grade = input.nextInt();', answer: 4, why: 'The token A is not an int, so nextInt throws an InputMismatchException. Read it with next().' },
      { type: 'tf', q: 'nextLine() returns the newline character at the end of the line.', answer: false, why: 'The newline is read but is not part of the returned string.' }
    ]
  }
});
