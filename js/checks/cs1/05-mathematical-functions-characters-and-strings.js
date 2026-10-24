/* CS1 · Mathematical Functions, Characters, and Strings: quick checks under the slides (1-2 per slide) and more part-quiz questions. */
addChecks({
  course: 'cs1', lesson: '05-mathematical-functions-characters-and-strings',
  slides: {
    3: [
      { type: 'trace', q: 'Use the code blocks of slide 3. What is the code of each character?', cols: ['character', 'code'], rows: [['\'C\'', '?67'], ['\'a\'', '?97'], ['\'0\'', '?48'], ['\'5\'', '?53']], why: '\'A\' is 65, so \'C\' is 67. \'a\' is 97. \'0\' is 48, so \'5\' is 53.' },
      { type: 'tf', q: 'The char \'4\' and the int 4 are the same value.', answer: false, why: '\'4\' is a character with the code 52.' }
    ],
    4: [
      { q: 'How many bits does a Java char use?', options: ['16', '8', '32'], answer: 0, why: 'Unicode in Java is a 16-bit encoding (two bytes).' },
      { type: 'fill', q: 'Write the Greek letter β with its Unicode code (slide 4).', code: 'char beta = \'___\';', answer: ['\\u03b2|\\u03B2'], why: '\\u followed by four hexadecimal digits: \\u03b2.' }
    ],
    5: [
      { q: 'Which character is \'\\u0042\'?', options: ['B', 'A', '4'], answer: 0, why: 'Hexadecimal 42 is 66, the code of B.' }
    ],
    6: [
      { type: 'tf', q: 'The first 128 Unicode codes are the same as ASCII.', answer: true, why: 'So \'A\' is 65 in both.' }
    ],
    7: [
      { type: 'output', q: 'What does this print?', code: 'System.out.println("He said \\"Hi\\"");', answer: 'He said "Hi"', why: '\\" puts a quote character inside the string.' },
      { type: 'match', q: 'Match each escape sequence with its meaning.', pairs: [['\\n', 'New line (linefeed)'], ['\\t', 'Tab'], ['\\\\', 'Backslash'], ['\\"', 'Double quote']], why: 'Slide 7.' }
    ],
    8: [
      { type: 'trace', q: 'What is printed by each line?', cols: ['line', 'printed'], rows: [['System.out.println((int)\'a\');', '?97'], ['System.out.println((char)66);', '?B'], ['System.out.println((char)(\'a\' + 2));', '?c']], why: 'A char cast to int gives its code; an int cast to char gives the character with that code.' },
      { type: 'output', q: 'What does this print?', code: 'char ch = \'d\';\nch--;\nSystem.out.println(ch);', answer: 'c', why: '-- moves to the preceding character.' }
    ],
    9: [
      { type: 'output', q: 'What does this print?', code: 'char ch = \'q\';\nif (ch >= \'A\' && ch <= \'Z\')\n  System.out.println(ch + " is an uppercase letter");\nelse if (ch >= \'a\' && ch <= \'z\')\n  System.out.println(ch + " is a lowercase letter");\nelse if (ch >= \'0\' && ch <= \'9\')\n  System.out.println(ch + " is a numeric character");', answer: 'q is a lowercase letter', why: '\'q\' is between \'a\' and \'z\'.' },
      { type: 'fill', q: 'Test whether ch is a digit.', code: 'if (ch >= \'0\' ___ ch <= \'9\')', answer: ['&&'], why: 'Both comparisons must be true.' }
    ],
    10: [
      { type: 'trace', q: 'What does each Character method return?', cols: ['call', 'returns'], rows: [['Character.isUpperCase(\'g\')', '?false'], ['Character.toLowerCase(\'M\')', '?m|\'m\''], ['Character.isLetterOrDigit(\'#\')', '?false'], ['Character.isLetter(\'k\')', '?true']], why: '\'g\' is lowercase; \'#\' is not a letter or a digit.' },
      { q: 'What is the real Java name of the method the slide calls isLetterOfDigit?', options: ['isLetterOrDigit', 'isLetterOfDigit', 'isDigitOrLetter'], answer: 0, why: 'The slide has a typo: it is isLetterOrDigit.' }
    ],
    12: [
      { q: 'Which line declares a String correctly?', options: ['String name = "Ali";', 'String name = \'Ali\';', 'string name = "Ali";'], answer: 0, why: 'A string uses double quotes, and the type String starts with a capital S.' },
      { type: 'tf', q: 'String is a primitive type, like int.', answer: false, why: 'It is a reference type: the variable refers to a String object.' }
    ],
    13: [
      { type: 'trace', q: 'What does each method return?', cols: ['call', 'returns'], rows: [['"Programming".length()', '?11'], ['"hello".toUpperCase()', '?HELLO|"HELLO"'], ['"Hi".concat("!")', '?Hi!|"Hi!"']], why: 'length counts the characters; the other two return new strings.' },
      { type: 'output', q: 'What does this print?', code: 'String s = "java";\nString t = s.toUpperCase();\nSystem.out.println(s + " " + t);', answer: 'java JAVA', why: 's does not change; toUpperCase returns a new string.' }
    ],
    14: [
      { type: 'match', q: 'Is each call an instance method or a static method?', pairs: [['message.length()', 'Instance method'], ['Math.sqrt(4)', 'Static method']], why: 'An instance method needs an object; a static method uses the class name.' }
    ],
    15: [
      { type: 'output', q: 'What does this print?', code: 'String s = "Hi there";\nSystem.out.println(s.length());', answer: '8', why: 'The space counts too: H, i, space, t, h, e, r, e.' }
    ],
    16: [
      { type: 'output', q: 'What does this print?', code: 'String s = "Java";\nSystem.out.println(s.charAt(0) + "" + s.charAt(s.length() - 1));', answer: 'Ja', why: 'Index 0 is the first character; length() - 1 is the last one.' },
      { type: 'tf', q: '"Java".charAt(4) returns \'a\'.', answer: false, why: 'The indexes are 0 to 3, so charAt(4) stops the program with an error.' }
    ],
    17: [
      { type: 'output', q: 'What does this print?', code: 'System.out.println("[" + "  Good morning  ".trim() + "]");', answer: '[Good morning]', why: 'trim removes the spaces at both ends; the space in the middle stays.' }
    ],
    18: [
      { type: 'trace', q: 'What string does each expression make?', cols: ['expression', 'result'], rows: [['"Good" + 2 + 3', '?Good23'], ['2 + 3 + "Good"', '?5Good'], ['"Grade " + \'A\'', '?Grade A|GradeA']], why: '+ works from left to right. Once there is a string, the next values are joined as text.' }
    ],
    19: [
      { type: 'trace', q: 'The user types:  red green blue  What does each next() return?', code: 'String s1 = input.next();\nString s2 = input.next();\nString s3 = input.next();', cols: ['variable', 'value'], rows: [['s1', '?red'], ['s2', '?green'], ['s3', '?blue']], why: 'next() reads one word at a time.' }
    ],
    20: [
      { type: 'write', q: 'Store the first character of the String s in a new char named first.', checks: [{ re: /char\s+first\s*=\s*s\s*\.\s*charAt\s*\(\s*0\s*\)\s*;/, label: 'char first = s.charAt(0);' }], solution: 'char first = s.charAt(0);', why: 'charAt(0) gives the first character.' }
    ],
    21: [
      { type: 'trace', q: 'What does each comparison return?', cols: ['call', 'returns'], rows: [['"Cat".compareTo("Car")', '?2'], ['"Java".compareTo("Java")', '?0'], ['"Hello".startsWith("He")', '?true'], ['"Hello".endsWith("x")', '?false']], why: '\'t\' (116) − \'r\' (114) = 2. Equal strings give 0.' },
      { type: 'tf', q: '"BOX".equalsIgnoreCase("box") is true.', answer: true, why: 'Case insensitive: capital and small letters count as the same.' }
    ],
    22: [
      { type: 'trace', q: 's is "computer". What does each call return?', cols: ['call', 'returns'], rows: [['s.substring(3)', '?puter'], ['s.substring(0, 4)', '?comp'], ['s.substring(2, 5)', '?mpu']], why: 'The begin index is included, the end index is not.' }
    ],
    23: [
      { type: 'trace', q: 's is "mississippi". What does each call return?', cols: ['call', 'returns'], rows: [['s.indexOf(\'s\')', '?2'], ['s.lastIndexOf(\'s\')', '?6'], ['s.indexOf("ss", 3)', '?5'], ['s.indexOf(\'z\')', '?-1']], why: 'm0 i1 s2 s3 i4 s5 s6 i7 p8 p9 i10. "ss" after index 3 starts at 5. No z gives -1.' }
    ],
    24: [
      { type: 'trace', q: 's is "Sara Khan". Follow the code.', code: 'int k = s.indexOf(\' \');\nString firstName = s.substring(0, k);\nString lastName = s.substring(k + 1);', cols: ['k', 'firstName', 'lastName'], rows: [['?4', '?Sara', '?Khan']], why: 'The space is at index 4. Before it: Sara. After it (k + 1): Khan.' }
    ],
    25: [
      { type: 'trace', q: 'What is printed?', cols: ['line', 'printed'], rows: [['System.out.println(Double.parseDouble("2.5") * 2);', '?5.0'], ['System.out.println(Integer.parseInt("7") + "7");', '?77'], ['System.out.println(3 + "" + 4);', '?34']], why: 'parse turns text into a number. Joining with "" turns a number into text.' }
    ],
    27: [
      { type: 'tf', q: 'You must write your own method to compute a square root.', answer: false, why: 'The Math class already has sqrt.' }
    ],
    28: [
      { type: 'match', q: 'Match each item of the Math class with its group.', pairs: [['Math.PI', 'Class constant'], ['Math.sin', 'Trigonometric method'], ['Math.pow', 'Exponent method'], ['Math.floor', 'Rounding method']], why: 'Slide 28.' }
    ],
    29: [
      { q: 'You want the sine of 90 degrees. Which call is right?', options: ['Math.sin(Math.PI / 2)', 'Math.sin(90)', 'Math.sin(Math.PI * 90)'], answer: 0, why: 'The angle must be in radians: 90 x π/180 = π/2.' }
    ],
    30: [
      { type: 'trace', q: 'What does each call print?', cols: ['call', 'printed'], rows: [['Math.sqrt(16)', '?4.0'], ['Math.pow(5, 2)', '?25.0'], ['Math.pow(2, 0)', '?1.0']], why: 'These methods return a double. Any number to the power 0 is 1.' }
    ],
    31: [
      { type: 'match', q: 'Match each method with how it rounds.', pairs: [['ceil', 'Always up'], ['floor', 'Always down'], ['rint', 'To the nearest, the even one in a tie'], ['round', 'To the nearest, up in a tie']], why: 'Slide 31.' }
    ],
    32: [
      { type: 'trace', q: 'What does each call print?', cols: ['call', 'printed'], rows: [['Math.ceil(4.2)', '?5.0'], ['Math.floor(-4.2)', '?-5.0'], ['Math.rint(3.5)', '?4.0'], ['Math.round(-4.5)', '?-4']], why: 'Down for -4.2 is -5.0. 3.5 is between 3 and 4; the even one is 4. round(-4.5) = floor(-4.5 + 0.5) = -4.' }
    ],
    33: [
      { type: 'trace', q: 'What does each call print?', cols: ['call', 'printed'], rows: [['Math.max(4, 9)', '?9'], ['Math.min(-1, 3)', '?-1'], ['Math.abs(-7)', '?7'], ['Math.abs(-7.5)', '?7.5']], why: 'Two ints give an int; a double gives a double. abs is the distance from 0.' }
    ],
    34: [
      { q: 'What values can 10 + (int)(Math.random() * 5) have?', options: ['10 to 14', '10 to 15', '0 to 5'], answer: 0, why: 'The cast part is 0 to 4; adding 10 gives 10 to 14.' },
      { type: 'write', q: 'Store a random int from 0 to 99 in a new variable named r.', checks: [{ re: /int\s+r\s*=\s*\(\s*int\s*\)\s*\(\s*Math\s*\.\s*random\s*\(\s*\)\s*\*\s*100\s*\)\s*;/, label: 'int r = (int)(Math.random() * 100);' }], solution: 'int r = (int)(Math.random() * 100);', why: 'Multiply by how many values you want (100), then cut with (int).' }
    ],
    35: [
      { type: 'tf', q: 'The three angles of the triangle always add up to 180 degrees.', answer: true, why: 'You can check it in the drawing.' },
      { q: 'Which Math method gives the length of a side from the corners?', options: ['Math.sqrt', 'Math.acos', 'Math.random'], answer: 0, why: 'The distance is the square root of (x2 − x1)² + (y2 − y1)². acos gives the angles.' }
    ],
    36: [
      { type: 'fill', q: 'Every format specifier begins with a sign. Which one?', code: 'System.out.printf("___d apples", 3);', answer: ['%'], why: 'Each specifier begins with a percent sign.' }
    ],
    37: [
      { type: 'trace', q: 'What does each printf show?', cols: ['call', 'printed'], rows: [['printf("%s is %d", "Ali", 20)', '?Ali is 20'], ['printf("%b", 5 > 3)', '?true'], ['printf("%c", \'z\')', '?z'], ['printf("%.1f", 4.56)', '?4.6']], why: 'Each specifier takes the next item. %.1f rounds to one digit after the point.' },
      { type: 'bug', q: 'This printf stops with an error. Tap the wrong line.', code: 'int count = 5;\ndouble amount = 45.56;\nSystem.out.printf("count is %d and amount is %d", count, amount);', answer: 3, why: 'amount is a double, so it needs %f, not %d.' }
    ],
    38: [
      { type: 'output', q: 'What does this print? Type the spaces too.', code: 'System.out.printf("[%4d]", 7);', answer: '[   7]', why: 'Width 4: the number is pushed to the right, with 3 spaces before it.' },
      { q: 'What does the - in %-10d do?', options: ['Puts the value on the left of its 10 places', 'Makes the number negative', 'Removes 10 digits'], answer: 0, why: 'Without -, the value is on the right.' }
    ]
  },
  parts: {
    0: [
      { type: 'match', q: 'Match each character with its code.', pairs: [['\'A\'', '65'], ['\'Z\'', '90'], ['\'a\'', '97'], ['\'9\'', '57']], why: 'The blocks of slide 3: 65-90, 97-122 and 48-57.' },
      { type: 'output', q: 'What does this print?', code: 'char c = \'A\';\nc += 3;\nSystem.out.println(c);', answer: 'D', why: '\'A\' + 3 is the code of D.' },
      { type: 'write', q: 'Store the uppercase form of the char ch in a new char named big, using the Character class.', checks: [{ re: /char\s+big\s*=\s*Character\s*\.\s*toUpperCase\s*\(\s*ch\s*\)\s*;/, label: 'char big = Character.toUpperCase(ch);' }], solution: 'char big = Character.toUpperCase(ch);', why: 'The Character class has toUpperCase(ch).' }
    ],
    1: [
      { type: 'trace', q: 's is "Hello World". What does each call return?', cols: ['call', 'returns'], rows: [['s.length()', '?11'], ['s.charAt(4)', '?o|\'o\''], ['s.toLowerCase()', '?hello world']], why: '11 characters with the space; index 4 is the fifth character.' },
      { type: 'bug', q: 'This line does not compile. Tap it.', code: 'String a = "Hi";\nchar b = "H";\nString c = a + b;', answer: 2, why: 'A char uses single quotes: \'H\'. "H" is a String.' },
      { type: 'output', q: 'What does this print?', code: 'System.out.println("A" + 1 + 1);\nSystem.out.println(1 + 1 + "A");', answer: 'A11\n2A', why: 'Left to right: a string first joins the numbers as text; numbers first are added.' }
    ],
    2: [
      { type: 'trace', q: 's is "apple pie". What does each call return?', cols: ['call', 'returns'], rows: [['s.indexOf(\'p\')', '?1'], ['s.lastIndexOf(\'p\')', '?6'], ['s.substring(6)', '?pie'], ['s.indexOf("pie")', '?6']], why: 'a0 p1 p2 l3 e4 (space 5) p6 i7 e8.' },
      { type: 'write', q: 'Turn the String text into a double, and store it in a new variable named price.', checks: [{ re: /double\s+price\s*=\s*Double\s*\.\s*parseDouble\s*\(\s*text\s*\)\s*;/, label: 'double price = Double.parseDouble(text);' }], solution: 'double price = Double.parseDouble(text);', why: 'Double.parseDouble reads text and gives a double.' },
      { q: 'The user types New York. Which call stores the whole city name?', options: ['input.nextLine()', 'input.next()', 'input.nextInt()'], answer: 0, why: 'next() would read only New.' }
    ],
    3: [
      { type: 'trace', q: 'What does each call print?', cols: ['call', 'printed'], rows: [['Math.ceil(-0.5)', '?-0.0'], ['Math.floor(7.9)', '?7.0'], ['Math.round(7.5)', '?8'], ['Math.rint(4.5)', '?4.0']], why: 'Up for -0.5 is -0.0. round goes up in a tie; rint goes to the even one.' },
      { type: 'match', q: 'Match each expression with its possible values.', pairs: [['(int)(Math.random() * 10)', '0 to 9'], ['1 + (int)(Math.random() * 10)', '1 to 10'], ['20 + (int)(Math.random() * 10)', '20 to 29']], why: 'The cast part is 0 to 9; then add the first value.' },
      { type: 'tf', q: 'Math.max(2, 3.0) returns the int 3.', answer: false, why: 'One parameter is a double, so it returns 3.0.' }
    ],
    4: [
      { type: 'output', q: 'What does this print?', code: 'System.out.printf("%s has %d points (%.1f%%)", "Omar", 45, 90.0);', answer: 'Omar has 45 points (90.0%)', why: 'Three specifiers for three items; %% prints a percent sign.' },
      { type: 'write', q: 'Print the int age and the double gpa as: Age 20, GPA 3.50 (two digits after the point), using printf.', checks: [{ re: /System\s*\.\s*out\s*\.\s*printf\s*\(\s*"Age %d, GPA %\.2f"\s*,\s*age\s*,\s*gpa\s*\)\s*;/, label: 'System.out.printf("Age %d, GPA %.2f", age, gpa);' }], solution: 'System.out.printf("Age %d, GPA %.2f", age, gpa);', why: '%d for the int, %.2f for the double, in the same order as the items.' },
      { q: 'What does %e show for 12345.678?', options: ['1.234568e+04', '12345.678', '12345'], answer: 0, why: '%e is scientific notation, with 6 digits after the point.' }
    ]
  }
});
