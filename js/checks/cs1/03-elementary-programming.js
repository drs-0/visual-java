/* CS1 · Elementary Programming: quick checks under the slides (1-2 per slide) and more part-quiz questions. */
addChecks({
  course: 'cs1', lesson: '03-elementary-programming',
  slides: {
    2: [
      { q: 'What will you learn in this chapter?', options: ['Variables, data types, operators, input and output', 'How to build a computer from its parts', 'How to design Web pages with HTML'], answer: 0, why: 'Slide 2 lists these subjects.' }
    ],
    3: [
      { type: 'match', q: 'Match each part of IPO with its meaning.', pairs: [['Input', 'The data the program reads'], ['Process', 'The work done on the data'], ['Output', 'The result the program shows']], why: 'Most simple programs read, process, then show.' },
      { q: 'You find a problem while testing. What can you do?', options: ['Nothing: the phases go only one way', 'Go back to an earlier phase and fix it', 'Start a new program from zero'], answer: 1, why: 'The arrows of slide 3 also go back up.' }
    ],
    4: [
      { type: 'match', q: 'Is each name legal? Match it with the right reason.', pairs: [['total$', 'Legal: letters and $'], ['9lives', 'Not legal: it starts with a digit'], ['my-name', 'Not legal: - is not allowed'], ['null', 'Not legal: it cannot be null']], why: 'Only letters, digits, _ and $; no digit first; not a reserved word, true, false or null.' },
      { type: 'tf', q: 'An identifier can be of any length.', answer: true, why: 'Slide 4, last rule.' }
    ],
    5: [
      { type: 'fill', q: 'Declare a variable named price that holds a number with a decimal point.', code: '___ price;', answer: ['double'], why: 'double is the type for numbers with a decimal point.' },
      { q: 'Which type holds one character?', options: ['double', 'int', 'char'], answer: 2, why: 'char a; declares a character variable.' }
    ],
    6: [
      { type: 'output', q: 'What does this print?', code: 'int year = 1435;\nyear = year + 1;\nSystem.out.println(year);', answer: '1436', why: 'year gets a new value: 1435 + 1.' },
      { type: 'trace', q: 'Follow the code for each radius. What is area?', code: 'double area = radius * radius * 3.14159;', cols: ['radius', 'area'], rows: [['0.5', '?0.7853975'], ['4.0', '?50.26544']], why: '0.5 x 0.5 x 3.14159 = 0.7853975 and 4 x 4 x 3.14159 = 50.26544.' }
    ],
    7: [
      { type: 'tf', q: 'In x = 1; the = sign means “x is equal to 1?”.', answer: false, why: 'It means: store 1 in x.' },
      { type: 'fill', q: 'Store the character A in the char variable a.', code: 'a = ___;', answer: ['\'A\''], why: 'A char value goes between single quotes.' }
    ],
    8: [
      { q: 'Which is the best name for a variable that holds the number of students?', options: ['NumberOfStudents', 'numberOfStudents', 'n'], answer: 1, why: 'Meaningful, first word lowercase, next words with a capital.' },
      { type: 'match', q: 'Match each name with what it should name.', pairs: [['computeArea', 'A variable or a method'], ['ComputeArea', 'A class'], ['COMPUTE_AREA', 'A constant']], why: 'Slides 8 and 9.' }
    ],
    9: [
      { type: 'bug', q: 'This code does not compile. Tap the wrong line.', code: 'final int SIZE = 3;\nint area = SIZE * SIZE;\nSIZE = 5;', answer: 3, why: 'SIZE is a constant (final): its value cannot change.' },
      { type: 'write', q: 'Declare an int constant named MAX_SCORE with the value 100.', checks: [{ re: /final\s+int\s+MAX_SCORE\s*=\s*100\s*;/, label: 'final int MAX_SCORE = 100;' }], solution: 'final int MAX_SCORE = 100;', why: 'final, the type, the name in capitals, = value;' }
    ],
    10: [
      { q: 'In ComputeArea, which statement gives radius its value?', options: ['radius = 20;', 'double radius;', 'area = radius * radius * 3.14159;'], answer: 0, why: 'double radius; only makes the box.' }
    ],
    11: [
      { q: 'How many variables does ComputeArea declare?', options: ['Three', 'One', 'Two: radius and area'], answer: 2, why: 'double radius; and double area;' }
    ],
    12: [
      { type: 'output', q: 'What does this print?', code: 'double radius;\nradius = 20;\nSystem.out.println(radius);', answer: '20.0', why: 'radius is a double, so 20 is kept as 20.0.' }
    ],
    13: [
      { type: 'trace', q: 'Follow line by line. What is in each variable?', code: 'double radius = 5;\ndouble area = radius * radius * 3.14159;', cols: ['after line', 'radius', 'area'], rows: [['1', '?5.0', '(no value)'], ['2', '?5.0', '?78.53975']], why: 'Line 1 stores 5.0. Line 2 computes 5 x 5 x 3.14159 = 78.53975.' }
    ],
    14: [
      { type: 'fill', q: 'Join the text and the variable.', code: 'System.out.println("The area is " ___ area);', answer: ['+'], why: 'With a string, + joins the values into one string.' }
    ],
    15: [
      { type: 'match', q: 'Match each type with its size.', pairs: [['byte', '8-bit'], ['short', '16-bit'], ['int', '32-bit'], ['long', '64-bit']], why: 'Each one is bigger than the one before.' },
      { q: 'Which type can hold the whole number 3000000000 (three billion)?', options: ['short', 'int', 'long'], answer: 2, why: 'The biggest int is 2147483647, so you need a long.' }
    ],
    16: [
      { q: 'Which type is more accurate?', options: ['float (about 7 digits)', 'double (about 16 digits)'], answer: 1, why: 'That is why we usually use double.' },
      { type: 'tf', q: '1.0F is a float value.', answer: true, why: 'The F after a number makes it a float.' }
    ],
    17: [
      { type: 'trace', q: 'What is the result of each expression?', cols: ['expression', 'result'], rows: [['17 / 5', '?3'], ['17 % 5', '?2'], ['17.0 / 5', '?3.4'], ['4 * 2.5', '?10.0']], why: 'Two ints give an int (3, remainder 2). With a double the result is a double: 3.4 and 10.0.' }
    ],
    18: [
      { type: 'output', q: 'What does this print?', code: 'System.out.println(9 / 4);\nSystem.out.println(9.0 / 4);', answer: '2\n2.25', why: 'Integer division throws the fraction away. With 9.0 you get the full answer.' }
    ],
    19: [
      { q: 'Today is Monday (day 1). What day is in 15 days? Use (1 + 15) % 7.', options: ['Monday (1)', 'Tuesday (2)', 'Wednesday (3)'], answer: 1, why: '16 % 7 = 2, and day 2 is Tuesday.' },
      { type: 'tf', q: 'An odd number % 2 is always 1.', answer: true, why: 'And an even number % 2 is always 0.' }
    ],
    20: [
      { type: 'output', q: 'What does this print?', code: 'int i = 20;\ni -= 5;\ni *= 2;\nSystem.out.println(i);', answer: '30', why: '20 − 5 = 15, then 15 x 2 = 30.' },
      { type: 'match', q: 'Match each short form with its long form.', pairs: [['i += 3', 'i = i + 3'], ['i *= 3', 'i = i * 3'], ['i %= 3', 'i = i % 3']], why: 'Slide 20.' }
    ],
    21: [
      { type: 'trace', q: 'Before each line, i is 5. What are j and i after it?', cols: ['line', 'j', 'i'], rows: [['int j = ++i;', '?6', '?6'], ['int j = i--;', '?5', '?4'], ['int j = --i;', '?4', '?4']], why: 'Before the name: change first, then use. After the name: use the old value, then change.' }
    ],
    22: [
      { type: 'write', q: 'Read a double from the Scanner input and store it in a new variable named price.', checks: [{ re: /double\s+price\s*=\s*input\s*\.\s*nextDouble\s*\(\s*\)\s*;/, label: 'double price = input.nextDouble();' }], solution: 'double price = input.nextDouble();', why: 'nextDouble() reads a number of the double type.' },
      { q: 'What does the program do when it reaches input.nextInt()?', options: ['It makes up a random number and goes on', 'It waits until the user types a value and presses Enter', 'It stops with an error if nothing was typed before'], answer: 1, why: 'The value the user types is returned.' }
    ],
    23: [
      { type: 'output', q: 'What does this print?', code: 'int i = 3;\nint k = 5 * ++i;\nSystem.out.println(k + " " + i);', answer: '20 4', why: '++i changes i to 4 first, then 5 * 4 = 20.' }
    ],
    24: [
      { type: 'tf', q: 'int k = ++i + i; is a good line, easy to read.', answer: false, why: 'Slide 24: avoid ++ and -- in expressions that use the same variable more than once.' }
    ],
    25: [
      { type: 'output', q: 'What does this print?', code: 'byte i = 10;\nlong k = i * 3 + 4;\nSystem.out.println(k);', answer: '34', why: '10 * 3 + 4 = 34. Java converts the types for you.' }
    ],
    26: [
      { type: 'trace', q: 'Use the conversion rules. What is the type of the result?', cols: ['left operand', 'right operand', 'result type'], rows: [['int', 'double', '?double'], ['long', 'int', '?long'], ['byte', 'short', '?int'], ['float', 'long', '?float']], why: 'double, then float, then long; otherwise both become int.' }
    ],
    27: [
      { type: 'output', q: 'What does this print?', code: 'System.out.println((int)5.99);', answer: '5', why: 'The cast cuts the fraction off; it does not round.' },
      { type: 'tf', q: 'double d = 3; needs an explicit cast.', answer: false, why: 'To a bigger type (widening), Java converts by itself.' }
    ],
    28: [
      { type: 'output', q: 'What does this print?', code: 'double tax = 5.6789;\nSystem.out.println((int)(tax * 100) / 100.0);', answer: '5.67', why: '567.89 becomes 567, and 567 / 100.0 = 5.67.' }
    ],
    29: [
      { type: 'output', q: 'What does this print?', code: 'int sum = 10;\nsum += 2.7;\nSystem.out.println(sum);', answer: '12', why: 'sum += 2.7 works like sum = (int)(sum + 2.7) = (int)12.7 = 12.' }
    ],
    30: [
      { q: 'Why does 1.0 - 0.9 not print exactly 0.1?', options: ['The minus sign is wrong for doubles', 'Java has a bug in its subtraction', 'Floating-point numbers are stored as approximations'], answer: 2, why: 'Doubles have tiny rounding errors.' },
      { type: 'tf', q: 'Calculations with integers give a precise result.', answer: true, why: 'Integers are stored precisely.' }
    ],
    31: [
      { type: 'trace', q: 'What does Math.pow print? (Write it as Java prints it.)', cols: ['call', 'printed'], rows: [['Math.pow(3, 2)', '?9.0'], ['Math.pow(9, 0.5)', '?3.0'], ['Math.pow(2, -1)', '?0.5'], ['Math.pow(10, 3)', '?1000.0']], why: 'The result is always a double. A power of 0.5 is a square root; a negative power is 1 divided by the power.' }
    ],
    32: [
      { q: 'In int count = 25; which part is the literal?', options: ['int', 'count', '25'], answer: 2, why: 'A literal is a value typed directly in the code.' }
    ],
    33: [
      { type: 'bug', q: 'One line does not compile. Tap it.', code: 'int a = 100;\nbyte b = 200;\nlong c = 5L;', answer: 2, why: 'A byte holds only -128 to 127, so 200 does not fit.' },
      { type: 'tf', q: 'For a long literal, L is better than l.', answer: true, why: 'A lowercase l looks like the digit 1.' }
    ],
    34: [
      { q: 'How do you write 7.5 as a float literal?', options: ['7.5L', '7.5F', '7.5'], answer: 1, why: 'Without a letter, 7.5 is a double. F makes it a float.' }
    ],
    35: [
      { type: 'fill', q: 'Write 0.0123456 in scientific notation.', lang: 'none', code: '0.0123456 = 1.23456e___', answer: ['-2'], why: 'The point moves 2 places to the left, so the exponent is -2.' },
      { type: 'trace', q: 'Write each number without the e.', lang: 'none', cols: ['scientific', 'normal'], rows: [['2.5e3', '?2500|2500.0'], ['1.5e-1', '?0.15']], why: 'e3: move the point 3 places right. e-1: move it 1 place left.' }
    ],
    36: [
      { type: 'bug', q: 'This line does not compile. Find the mistake.', code: 'int x = 2;\ndouble r = (3 + 4x) / 5;\nSystem.out.println(r);', answer: 2, why: 'Multiplication must be written with *: 4 * x.' },
      { type: 'write', q: 'Store 4x + 2y (math) in the variable z. x, y and z are already declared.', checks: [{ re: /z\s*=\s*(4\s*\*\s*x\s*\+\s*2\s*\*\s*y|2\s*\*\s*y\s*\+\s*4\s*\*\s*x)\s*;/, label: 'z = 4 * x + 2 * y;' }], solution: 'z = 4 * x + 2 * y;', why: 'Each multiplication needs a *.' }
    ],
    37: [
      { type: 'output', q: 'What does this print?', code: 'System.out.println(8 - 6 / 3 * 2);', answer: '4', why: '6 / 3 = 2, then 2 * 2 = 4 (left to right), then 8 − 4 = 4.' },
      { q: 'In 10 + 4 * (5 - 2), what is done first?', options: ['5 - 2', '10 + 4', '4 * 5'], answer: 0, why: 'Parentheses first.' }
    ],
    38: [
      { type: 'bug', q: 'This line always gives 0.0. Tap it.', code: 'double fahrenheit = 100;\ndouble celsius = (5 / 9) * (fahrenheit - 32);\nSystem.out.println(celsius);', answer: 2, why: '5 / 9 is integer division: 0. Write 5.0 / 9.' },
      { type: 'output', q: 'What does this print?', code: 'double fahrenheit = 50;\ndouble celsius = (5.0 / 9) * (fahrenheit - 32);\nSystem.out.println(celsius);', answer: '10.0', why: '50 − 32 = 18, and 5/9 of 18 is 10.0.' }
    ],
    39: [
      { type: 'trace', q: 'totalMilliseconds is 3725000. Fill in each value.', code: 'long totalSeconds = totalMilliseconds / 1000;\nlong currentSecond = totalSeconds % 60;\nlong totalMinutes = totalSeconds / 60;\nlong currentMinute = totalMinutes % 60;\nlong totalHours = totalMinutes / 60;', cols: ['totalSeconds', 'currentSecond', 'totalMinutes', 'currentMinute', 'totalHours'], rows: [['?3725', '?5', '?62', '?2', '?1']], why: '3725000 / 1000 = 3725; 3725 % 60 = 5; 3725 / 60 = 62; 62 % 60 = 2; 62 / 60 = 1.' }
    ],
    40: [
      { type: 'write', q: 'Print the time as hour:minute:second, using the variables currentHour, currentMinute and currentSecond.', checks: [{ re: /System\s*\.\s*out\s*\.\s*println\s*\(\s*currentHour\s*\+\s*":"\s*\+\s*currentMinute\s*\+\s*":"\s*\+\s*currentSecond\s*\)\s*;/, label: 'System.out.println(currentHour + ":" + currentMinute + ":" + currentSecond);' }], solution: 'System.out.println(currentHour + ":" + currentMinute + ":" + currentSecond);', why: 'Join the numbers with ":" strings between them.' }
    ],
    41: [
      { type: 'match', q: 'Match each common error with an example.', pairs: [['Undeclared variable', 'interestrate * 45 when only interestRate exists'], ['Integer overflow', '2147483647 + 1'], ['Round-off error', '1.0 - 0.9'], ['Unintended integer division', '(1 + 2) / 2']], why: 'Slides 42 to 45.' }
    ],
    42: [
      { type: 'bug', q: 'This code does not compile. Tap the wrong line.', code: 'int count;\nint total = 10;\nSystem.out.println(count + total);', answer: 3, why: 'count has no value yet. A variable must get a value before you use it.' }
    ],
    43: [
      { type: 'output', q: 'What does this print?', code: 'int value = 2147483647;\nvalue = value + 2;\nSystem.out.println(value);', answer: '-2147483647', why: 'It goes past the biggest int and wraps around: −2147483648, then one more.' }
    ],
    44: [
      { type: 'tf', q: 'System.out.println(1.0 - 0.9); prints exactly 0.1.', answer: false, why: 'It prints 0.09999999999999998 because of round-off errors.' }
    ],
    45: [
      { type: 'output', q: 'What does this print?', code: 'int a = 3, b = 4;\ndouble avg = (a + b) / 2;\nSystem.out.println(avg);', answer: '3.0', why: '7 / 2 is integer division: 3. Then 3 is stored as 3.0.' }
    ],
    46: [
      { type: 'trace', q: 'What does each printf show?', cols: ['call', 'printed'], rows: [['printf("%d", 15)', '?15'], ['printf("%o", 8)', '?10'], ['printf("%x", 255)', '?ff'], ['printf("%.1f", 2.34)', '?2.3']], why: '%o is octal (8 = 10), %x is hexadecimal (255 = ff), %.1f keeps one digit after the point.' },
      { type: 'write', q: 'Print the double variable price with two digits after the point, using printf.', checks: [{ re: /System\s*\.\s*out\s*\.\s*printf\s*\(\s*"%\.2f"\s*,\s*price\s*\)\s*;/, label: 'System.out.printf("%.2f", price);' }], solution: 'System.out.printf("%.2f", price);', why: '%.2f formats a number with 2 decimal places.' }
    ]
  },
  parts: {
    0: [
      { q: 'In which phase do you decide what the program must do?', options: ['Requirements specification', 'Testing the program', 'Deployment to the users'], answer: 0, why: 'It is the first phase of slide 3.' },
      { type: 'tf', q: 'Testing comes after implementation.', answer: true, why: 'First you write the code, then you test it.' },
      { type: 'match', q: 'Match each phase with what happens in it.', pairs: [['Implementation', 'Writing the code'], ['Testing', 'Checking that the program works'], ['Deployment', 'Giving the program to the users'], ['Maintenance', 'Fixing and improving it later']], why: 'The last phases of slide 3.' }
    ],
    1: [
      { type: 'bug', q: 'One line does not compile. Tap it.', code: 'int first = 1;\nint 2ndPlace = 2;\nint _third = 3;', answer: 2, why: 'An identifier cannot start with a digit.' },
      { type: 'write', q: 'Declare an int variable named age and give it the value 18 in one step.', checks: [{ re: /int\s+age\s*=\s*18\s*;/, label: 'int age = 18;' }], solution: 'int age = 18;', why: 'Declaring and initializing in one step: type name = value;' },
      { type: 'match', q: 'Match each type with a value it can hold.', pairs: [['int', '42'], ['double', '3.5'], ['char', '\'z\'']], why: 'Whole number, number with a point, one character.' }
    ],
    2: [
      { type: 'trace', q: 'Follow ComputeArea with radius = 3. Fill in the boxes.', code: 'double radius;\ndouble area;\nradius = 3;\narea = radius * radius * 3.14159;', cols: ['after line', 'radius', 'area'], rows: [['2', '(no value)', '(no value)'], ['3', '?3.0', '(no value)'], ['4', '?3.0', '?28.27431']], why: 'The boxes have no value until line 3. Then 3 x 3 x 3.14159 = 28.27431.' },
      { type: 'fill', q: 'Complete the formula of ComputeArea.', code: 'area = radius * radius * ___;', answer: ['3.14159'], why: 'The slide uses 3.14159 for π.' },
      { type: 'output', q: 'What does this print?', code: 'double radius = 5;\ndouble area = radius * radius * 3.14159;\nSystem.out.println("Radius " + radius + " gives " + area);', answer: 'Radius 5.0 gives 78.53975', why: '+ joins the text and the two numbers. radius is printed as 5.0.' }
    ],
    3: [
      { type: 'trace', q: 'Find the quotient and the remainder.', cols: ['a', 'b', 'a / b', 'a % b'], rows: [['23', '4', '?5', '?3'], ['30', '6', '?5', '?0'], ['7', '9', '?0', '?7']], why: '23 = 5 x 4 + 3; 30 = 5 x 6 + 0; 7 = 0 x 9 + 7.' },
      { q: 'Today is Thursday (day 4). What day is in 10 days?', options: ['Thursday (4)', 'Monday (1)', 'Sunday (0)'], answer: 2, why: '(4 + 10) % 7 = 14 % 7 = 0, and day 0 is Sunday.' },
      { type: 'output', q: 'What does this print?', code: 'System.out.println(7 / 2.0);', answer: '3.5', why: 'One operand is a double, so the result is a double.' }
    ],
    4: [
      { type: 'trace', q: 'x starts at 4. Follow the lines in order.', code: 'x += 6;\nx /= 2;\nx -= 1;\nx %= 3;', cols: ['after', 'x'], rows: [['x += 6', '?10'], ['x /= 2', '?5'], ['x -= 1', '?4'], ['x %= 3', '?1']], why: '4 + 6 = 10, 10 / 2 = 5, 5 − 1 = 4, 4 % 3 = 1.' },
      { type: 'write', q: 'Add 5 to the variable total, using an augmented assignment operator.', checks: [{ re: /total\s*\+=\s*5\s*;/, label: 'total += 5;' }], solution: 'total += 5;', why: 'total += 5 means total = total + 5.' },
      { type: 'bug', q: 'One line does not compile. Tap it.', code: 'Scanner input = new Scanner(System.in);\nint n = input.nextDouble();\nSystem.out.println(n);', answer: 2, why: 'nextDouble() gives a double, which cannot be stored in an int. Use nextInt().' }
    ],
    5: [
      { type: 'output', q: 'What does this print?', code: 'System.out.println((int)(7.5 * 2));', answer: '15', why: '7.5 * 2 = 15.0, and the cast makes it 15.' },
      { type: 'write', q: 'Store the whole-number part of the double price in a new int variable named whole.', checks: [{ re: /int\s+whole\s*=\s*\(\s*int\s*\)\s*\(?\s*price\s*\)?\s*;/, label: 'int whole = (int) price;' }], solution: 'int whole = (int) price;', why: 'Narrowing from double to int needs an explicit cast.' },
      { type: 'tf', q: 'int x = 5 / 2.0; compiles.', answer: false, why: '5 / 2.0 is a double, and a double needs a cast to go into an int.' }
    ],
    6: [
      { type: 'match', q: 'Match each literal with its type.', pairs: [['12', 'int'], ['12L', 'long'], ['12.0', 'double'], ['12.0f', 'float']], why: 'A whole number is an int, a number with a point is a double; L and f change that.' },
      { type: 'output', q: 'What does this print?', code: 'System.out.println((2 + 4) * 3 - 10 / 4);', answer: '16', why: '(2 + 4) = 6, 6 * 3 = 18, 10 / 4 = 2, 18 − 2 = 16.' },
      { type: 'fill', q: 'Write 4500.0 in scientific notation.', lang: 'none', code: '4500.0 = 4.5e___', answer: ['3|+3'], why: 'The point moves 3 places: 4.5 x 10³.' }
    ],
    7: [
      { type: 'trace', q: 'totalSeconds is 7384. Find the time.', cols: ['currentSecond', 'totalMinutes', 'currentMinute', 'totalHours'], rows: [['?4', '?123', '?3', '?2']], why: '7384 % 60 = 4; 7384 / 60 = 123; 123 % 60 = 3; 123 / 60 = 2. The time is 2:3:4.' },
      { type: 'output', q: 'What does this print?', code: 'double fahrenheit = 41;\ndouble celsius = (5.0 / 9) * (fahrenheit - 32);\nSystem.out.println(celsius);', answer: '5.0', why: '41 − 32 = 9, and 5/9 of 9 is 5.0.' }
    ],
    8: [
      { type: 'match', q: 'Match each specifier with what it formats.', pairs: [['%d', 'An integer in base 10'], ['%x', 'An integer in base 16'], ['%e', 'A number in scientific notation'], ['%s', 'A string']], why: 'Slide 46.' },
      { type: 'bug', q: 'This code prints 2.0, but the right average is 2.5. Tap the line with the mistake.', code: 'int a = 2;\nint b = 3;\ndouble average = (a + b) / 2;\nSystem.out.println(average);', answer: 3, why: 'Unintended integer division: divide by 2.0.' },
      { type: 'tf', q: 'Java gives an error message when an int overflows.', answer: false, why: 'There is no error: the value silently wraps around.' }
    ]
  }
});
