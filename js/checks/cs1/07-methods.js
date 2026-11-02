/* CS1 · Methods: quick checks under the slides (1-2 per slide) and more part-quiz questions. */
addChecks({
  course: 'cs1', lesson: '07-methods',
  slides: {
    3: [
      { type: 'output', q: 'What does this print?', code: 'public static int max(int num1, int num2) {\n  int result;\n  if (num1 > num2)\n    result = num1;\n  else\n    result = num2;\n  return result;\n}\n// in main:\nSystem.out.println(max(-4, -9));', answer: '-4', why: '-4 > -9 is true, so result is num1 = -4.' }
    ],
    4: [
      { type: 'match', q: 'Match each part of the method with an example from slide 4.', pairs: [['Method header', 'public static int max(int num1, int num2)'], ['Method body', 'The statements between { and }'], ['Method call', 'int z = max(x, y);']], why: 'The header is the first line; the body is in braces.' }
    ],
    5: [
      { q: 'Which is the signature of public static double area(double w, double h)?', options: ['area(double w, double h)', 'public static double', 'double area'], answer: 0, why: 'The name plus the parameter list. The return type is not part of it.' }
    ],
    6: [
      { type: 'tf', q: 'Formal parameters get their values when the method is called.', answer: true, why: 'They are like empty boxes in the header.' }
    ],
    7: [
      { type: 'fill', q: 'Call max with the arguments 10 and 4 and store the result in big.', code: 'int big = ___(10, 4);', answer: ['max'], why: 'The values in the call (10 and 4) are the arguments.' }
    ],
    8: [
      { type: 'match', q: 'Match each method header with its return value type.', pairs: [['public static int max(int a, int b)', 'int'], ['public static void printLine()', 'void'], ['public static char getGrade(double s)', 'char']], why: 'The type before the name. void means no return value.' },
      { type: 'tf', q: 'The main method returns an int.', answer: false, why: 'Its returnValueType is void.' }
    ],
    9: [
      { type: 'bug', q: 'This method does not compile. Tap the line that should be only else.', code: 'public static int sign(int n) {\n  if (n > 0)\n    return 1;\n  else if (n == 0)\n    return 0;\n  else if (n < 0)\n    return -1;\n}', answer: 6, why: 'With else if (n < 0), the compiler sees a path without a return. Write else.' }
    ],
    10: [
      { type: 'output', q: 'In TestMax, i is 3 and j is 8. What is printed?', code: 'int k = max(i, j);\nSystem.out.println("The maximum between " + i +\n  " and " + j + " is " + k);', answer: 'The maximum between 3 and 8 is 8', why: 'max returns 8, which is stored in k.' }
    ],
    11: [
      { q: 'What is redundant code?', options: ['Code that has a bug in it', 'Code that is written again and again', 'Code that is inside a comment'], answer: 1, why: 'Methods reduce redundant code.' }
    ],
    12: [
      { type: 'match', q: 'Match each benefit with its meaning.', pairs: [['Reuse', 'Write a method once, use it anywhere'], ['Information hiding', 'The user knows what it does, not how'], ['Reduce complexity', 'Small methods are easier to understand']], why: 'Slide 12.' }
    ],
    13: [
      { type: 'output', q: 'What does the first part of slide 13 print?', code: 'int sum = 0;\nfor (int i = 1; i <= 10; i++)\n  sum += i;\nSystem.out.println("Sum from 1 to 10 is " + sum);', answer: 'Sum from 1 to 10 is 55', why: '1 + 2 + … + 10 = 55.' }
    ],
    14: [
      { q: 'Which parts of the three copies are different?', options: ['Nothing: the three copies are the same', 'The whole loop is different each time', 'Only the start and the end numbers'], answer: 2, why: 'Those two numbers become the parameters of a method.' }
    ],
    15: [
      { type: 'trace', q: 'What does sum(i1, i2) of slide 15 return?', cols: ['call', 'returns'], rows: [['sum(20, 30)', '?275'], ['sum(4, 4)', '?4'], ['sum(1, 5)', '?15']], why: '20 + 21 + … + 30 = 275. sum(4, 4) adds only 4. 1 + 2 + 3 + 4 + 5 = 15.' }
    ],
    16: [
      { type: 'output', q: 'What does TestReturnGradeMethod print?', code: 'System.out.print("The grade is " + getGrade(78.5));\nSystem.out.print("\\nThe grade is " + getGrade(59.5));', answer: 'The grade is C\nThe grade is F', why: '78.5 >= 70.0 gives C; 59.5 is below 60.0, so F.' },
      { type: 'write', q: 'Write the header of a method named isPass that takes a double score and returns a boolean. End it with {.', checks: [{ re: /public\s+static\s+boolean\s+isPass\s*\(\s*double\s+\w+\s*\)\s*\{/, label: 'public static boolean isPass(double score) {' }], solution: 'public static boolean isPass(double score) {', why: 'Modifiers, return type, name, parameter list.' }
    ],
    17: [
      { q: 'Where does the scope of a local variable end?', options: ['At the next method call', 'At the end of the program', 'At the end of the block that contains it'], answer: 2, why: 'It starts at its declaration and ends with its block.' }
    ],
    18: [
      { type: 'match', q: 'Match each kind of blocks with the rule for one name.', pairs: [['Non-nesting blocks (side by side)', 'You may declare the same name in each'], ['Nested blocks (one inside the other)', 'You cannot declare the same name twice']], why: 'Slide 18.' }
    ],
    19: [
      { type: 'bug', q: 'One line does not compile. Tap it.', code: 'for (int i = 1; i < 10; i++) {\n  int j = i * 2;\n}\nSystem.out.println(j);', answer: 4, why: 'j lives only inside the loop body. After the loop it does not exist.' }
    ],
    20: [
      { type: 'tf', q: 'In method1 of slide 20, declaring i in both for loops is fine.', answer: true, why: 'The two loops are side by side (non-nesting).' }
    ],
    21: [
      { type: 'output', q: 'What does this print?', code: 'int x = 1, y = 1;\nfor (int i = 1; i < 4; i++)\n  x += i;\nfor (int i = 1; i < 3; i++)\n  y += i;\nSystem.out.println(x + " " + y);', answer: '7 4', why: 'x = 1 + 1 + 2 + 3 = 7; y = 1 + 1 + 2 = 4.' }
    ],
    22: [
      { type: 'bug', q: 'This method does not compile. Tap the wrong line.', code: 'public static void incorrectMethod() {\n  int x = 1;\n  for (int i = 1; i < 10; i++) {\n    int x = 0;\n    x += i;\n  }\n}', answer: 4, why: 'The first x is still in scope inside the loop, so x is declared twice.' }
    ],
    23: [
      { type: 'output', q: 'What does myPrintln("Bye", 3) print?', code: 'public static void myPrintln(String message, int n) {\n  for (int i = 0; i < n; i++)\n    System.out.println(message);\n}', answer: 'Bye\nBye\nBye', why: 'The message is printed n = 3 times.' },
      { type: 'match', q: 'Does each call compile?', pairs: [['myPrintln("Hi", 2)', 'Yes'], ['myPrintln(2, "Hi")', 'No: the order and types are wrong'], ['myPrintln("Hi")', 'No: one argument is missing']], why: 'Arguments must match the parameters in number, order and type.' }
    ],
    24: [
      { type: 'output', q: 'What does the Increment program print when x starts at 4?', code: 'int x = 4;\nSystem.out.println("Before the call, x is " + x);\nincrement(x);\nSystem.out.println("after the call, x is " + x);\n// increment: n++; then prints "n inside the method is " + n', answer: 'Before the call, x is 4\nn inside the method is 5\nafter the call, x is 4', why: 'The method changes its own copy n, not x.' }
    ],
    25: [
      { type: 'order', q: 'Put the call stack pictures of slide 25 in order.', lang: 'none', lines: ['main is invoked', 'max is invoked', 'max is being executed', 'max is finished; its value goes to k', 'main is finished'], why: 'A new call goes on top; a finished method is removed.' }
    ],
    26: [
      { q: 'Where is i stored when main runs?', options: ['In main’s activation record on the call stack', 'In max’s activation record', 'On the disk, with the program file'], answer: 0, why: 'Local variables live in their method’s record.' }
    ],
    27: [
      { type: 'tf', q: 'After int j = 2; main’s record holds i and j.', answer: true, why: 'Each local variable is added to the record.' }
    ],
    28: [
      { q: 'What is the value of k right after it is declared on slide 28?', options: ['0', 'It has no value yet', '5'], answer: 1, why: 'k gets its value only after max returns.' }
    ],
    29: [
      { type: 'tf', q: 'While max runs, main waits.', answer: true, why: 'main stops at max(i, j) until max returns.' }
    ],
    30: [
      { q: 'What happens to the stack when max(i, j) is called?', options: ['Nothing changes: max uses main’s record', 'main’s record is removed and replaced by max’s', 'A new record for max goes on top, with num1 and num2'], answer: 2, why: 'The values 5 and 2 are copied into num1 and num2.' }
    ],
    31: [
      { q: 'In which record is result?', options: ['max’s record', 'main’s record', 'Both'], answer: 0, why: 'result is a local variable of max.' }
    ],
    32: [
      { q: 'num1 is 5 and num2 is 2. What is num1 > num2?', options: ['false', 'true'], answer: 1, why: 'So result = num1.' }
    ],
    33: [
      { type: 'fill', q: 'Complete the step of slide 33.', lang: 'none', code: 'result = ___', answer: ['5'], why: 'result gets num1, which is 5.' }
    ],
    34: [
      { type: 'tf', q: 'After return result; max’s record stays on the stack.', answer: false, why: 'The value 5 goes to k, and max’s record is removed.' }
    ],
    35: [
      { type: 'output', q: 'What does main print at the end of the trace?', code: 'System.out.println(\n  "The maximum between " + i +\n  " and " + j + " is " + k);', answer: 'The maximum between 5 and 2 is 5', why: 'i is 5, j is 2 and k is 5.' }
    ],
    36: [
      { type: 'output', q: 'What does this print?', code: 'public static void swap(int n1, int n2) {\n  int temp = n1;\n  n1 = n2;\n  n2 = temp;\n  System.out.println(n1 + " " + n2);\n}\n// in main:\nint a = 3, b = 9;\nswap(a, b);\nSystem.out.println(a + " " + b);', answer: '9 3\n3 9', why: 'Inside swap the copies are swapped; a and b in main do not change.' }
    ],
    37: [
      { type: 'trace', q: 'Convert hex 3C with value = value * 16 + digit.', cols: ['digit', 'value after it'], rows: [['3', '?3'], ['C (12)', '?60']], why: '0 * 16 + 3 = 3, then 3 * 16 + 12 = 60.' },
      { type: 'trace', q: 'What is each hex number in decimal?', cols: ['hex', 'decimal'], rows: [['FF', '?255'], ['10', '?16'], ['ABCD', '?43981']], why: 'FF = 15 * 16 + 15 = 255; 10 = 1 * 16 + 0 = 16; ABCD = ((10*16 + 11)*16 + 12)*16 + 13 = 43981.' }
    ],
    38: [
      { type: 'tf', q: 'Two methods can have the same name if their parameter lists are different.', answer: true, why: 'This is overloading.' },
      { q: 'max(int, int) and max(double, double) both exist. Which one does max(4.0, 9.0) call?', options: ['max(int, int)', 'max(double, double)', 'Neither: error'], answer: 1, why: 'The arguments are doubles.' }
    ],
    39: [
      { q: 'What is an ambiguous invocation?', options: ['A method that calls itself with no end', 'A method that has no parameters at all', 'Two methods fit equally well, so the compiler cannot choose'], answer: 2, why: 'It is a compile error.' }
    ],
    40: [
      { type: 'match', q: 'Only max(int, double) and max(double, int) exist. Match each call with its result.', pairs: [['max(1, 2.5)', 'max(int, double) is called'], ['max(1.5, 2)', 'max(double, int) is called'], ['max(1, 2)', 'Compile error: ambiguous']], why: 'Each of the first two calls fits one method exactly; max(1, 2) fits both after one conversion each.' }
    ],
    41: [
      { q: 'What range does (int)(Math.random() * (65535 + 1)) give?', options: ['0 to 65534', '0 to 65535', '1 to 65536'], answer: 1, why: 'Math.random() is less than 1, so adding 1 makes 65535 possible.' }
    ],
    42: [
      { q: 'What is (int)\'a\'?', options: ['0', '65', '97'], answer: 2, why: 'The lowercase letters have the codes 97 to 122.' }
    ],
    43: [
      { type: 'bug', q: 'The expression of slide 43 is missing one ). Tap its line.', code: 'int a = (int)\'a\';\nint code = (int)((int)\'a\' + Math.random() * ((int)\'z\' - (int)\'a\' + 1);\nchar c = (char)code;', answer: 2, why: 'Count the parentheses: one closing ) is missing at the end.' }
    ],
    44: [
      { type: 'tf', q: 'In \'a\' + Math.random() * (\'z\' - \'a\' + 1), the (int) casts are not needed.', answer: true, why: 'A char in arithmetic is used as its code.' }
    ],
    45: [
      { type: 'write', q: 'Write an expression that gives a random uppercase letter, using the formula of slide 45. Store it in a new char named ch.', checks: [{ re: /char\s+ch\s*=\s*\(\s*char\s*\)\s*\(\s*'A'\s*\+\s*Math\s*\.\s*random\s*\(\s*\)\s*\*\s*\(\s*'Z'\s*-\s*'A'\s*\+\s*1\s*\)\s*\)\s*;/, label: 'char ch = (char)(\'A\' + Math.random() * (\'Z\' - \'A\' + 1));' }], solution: 'char ch = (char)(\'A\' + Math.random() * (\'Z\' - \'A\' + 1));', why: 'ch1 is \'A\' and ch2 is \'Z\'.' }
    ],
    46: [
      { q: 'What does getRandomDigitCharacter() return?', options: ['A random character from \'0\' to \'9\'', 'A random int from 0 to 9', 'Always \'0\''], answer: 0, why: 'It calls getRandomCharacter(\'0\', \'9\').' },
      { type: 'tf', q: 'The two getRandomCharacter methods are overloaded.', answer: true, why: 'One has two char parameters, the other has none.' }
    ],
    47: [
      { q: 'How many arguments does main pass to maximum?', options: ['Two ints', 'Three doubles', 'One array'], answer: 1, why: 'maximum(number1, number2, number3).' }
    ],
    48: [
      { type: 'trace', q: 'Follow maximum(4.0, 7.5, 6.0). What is maximumValue after each step?', cols: ['step', 'maximumValue'], rows: [['start: maximumValue = x', '?4.0'], ['if (y > maximumValue)', '?7.5'], ['if (z > maximumValue)', '?7.5']], why: '7.5 > 4.0, so it is replaced. 6.0 > 7.5 is false, so it stays 7.5.' }
    ],
    49: [
      { type: 'output', q: 'The user types 1.5 8.25 3.0. What is printed?', code: 'System.out.println("Maximum is: " + result);', answer: 'Maximum is: 8.25', why: 'The biggest of the three values is 8.25.' }
    ],
    50: [
      { type: 'bug', q: 'One line of slide 50 does not compile. Tap it.', code: 'System.out.println ("Enter  Rate value");\nR = in.nextInt();\nSystem.out.println "Enter number of working hours");\nh = in.nextInt();\nsal = Pay(R, h);', answer: 3, why: 'This println has no opening parenthesis.' }
    ],
    51: [
      { type: 'trace', q: 'What does Pay(x, y) of slide 51 return?', code: 'if (y <= 40)\n  p = x*y;\nelse\n  p = (40*x) + ((y - 40)*1.5*x);', cols: ['call', 'returns'], rows: [['Pay(10, 30)', '?300.0'], ['Pay(20, 50)', '?1100.0'], ['Pay(8, 40)', '?320.0']], why: '30 hours: 10 x 30. 50 hours: 40 x 20 = 800, plus 10 x 1.5 x 20 = 300. 40 hours is not overtime: 8 x 40.' }
    ]
  },
  parts: {
    0: [
      { type: 'write', q: 'Write a method named triple that takes an int n and returns n * 3.', rows: 3, checks: [{ re: /public\s+static\s+int\s+triple\s*\(\s*int\s+n\s*\)/, label: 'public static int triple(int n)' }, { re: /return\s+(n\s*\*\s*3|3\s*\*\s*n)\s*;/, label: 'return n * 3;' }], solution: 'public static int triple(int n) {\n  return n * 3;\n}', why: 'The header says it returns an int; the body returns n * 3.' },
      { type: 'match', q: 'In int z = max(x, y); match each word with an example.', pairs: [['Formal parameters', 'num1 and num2'], ['Arguments', 'x and y'], ['Return value type', 'int']], why: 'Slides 6 to 8.' },
      { type: 'output', q: 'What does this print?', code: 'public static int max(int num1, int num2) {\n  if (num1 > num2) return num1;\n  else return num2;\n}\n// in main:\nSystem.out.println(max(max(1, 9), 4));', answer: '9', why: 'The inner call returns 9, then max(9, 4) returns 9.' }
    ],
    1: [
      { type: 'output', q: 'With sum of slide 15, what does this print?', code: 'System.out.println(sum(2, 4) + sum(10, 10));', answer: '19', why: 'sum(2, 4) = 9 and sum(10, 10) = 10.' },
      { type: 'trace', q: 'What does getGrade of slide 16 return?', cols: ['score', 'returns'], rows: [['91.0', '?A|\'A\''], ['69.9', '?D|\'D\''], ['70.0', '?C|\'C\'']], why: '69.9 is below 70.0 but at least 60.0. 70.0 >= 70.0 gives C.' },
      { type: 'tf', q: 'Each return statement in getGrade ends the method at once.', answer: true, why: 'So only one grade is returned.' }
    ],
    2: [
      { type: 'output', q: 'What does this print?', code: 'public static void addTen(int n) {\n  n = n + 10;\n}\n// in main:\nint score = 50;\naddTen(score);\nSystem.out.println(score);', answer: '50', why: 'Pass-by-value: addTen changes only its own copy.' },
      { type: 'bug', q: 'One line does not compile. Tap it.', code: 'int total = 0;\nfor (int i = 1; i <= 3; i++) {\n  int total = i;\n}\nSystem.out.println(total);', answer: 3, why: 'total is already declared before the loop, so it cannot be declared again inside it.' },
      { type: 'fill', q: 'Call myPrintln to print Hello four times.', code: 'myPrintln(___, ___);', answer: ['"Hello"', '4'], why: 'The first argument is the String, the second the int.' }
    ],
    3: [
      { type: 'order', q: 'Put the steps of a method call in order.', lang: 'none', lines: ['main reaches max(i, j) and waits', 'A record for max goes on top of the stack', 'max runs and returns its value', 'max’s record is removed', 'main stores the value in k'], why: 'The stack grows with the call and shrinks when it returns.' },
      { type: 'trace', q: 'Convert hex 7B to decimal, digit by digit.', cols: ['digit', 'value after it'], rows: [['7', '?7'], ['B (11)', '?123']], why: '0 * 16 + 7 = 7, then 7 * 16 + 11 = 123.' }
    ],
    4: [
      { type: 'write', q: 'Overload max: write the header of a max method for two double parameters that returns a double. End it with {.', checks: [{ re: /public\s+static\s+double\s+max\s*\(\s*double\s+\w+\s*,\s*double\s+\w+\s*\)\s*\{/, label: 'public static double max(double num1, double num2) {' }], solution: 'public static double max(double num1, double num2) {', why: 'Same name, different parameter types.' },
      { type: 'tf', q: 'Two methods that differ only in their return type are overloaded.', answer: false, why: 'The return type is not part of the signature, so this is a compile error.' }
    ],
    5: [
      { type: 'trace', q: 'Which characters can each call return?', cols: ['call', 'from', 'to'], rows: [['getRandomCharacter(\'c\', \'f\')', '?c|\'c\'', '?f|\'f\''], ['getRandomUpperCaseLetter()', '?A|\'A\'', '?Z|\'Z\'']], why: 'ch1 to ch2, both included.' },
      { type: 'output', q: 'With Pay of slide 51, what does this print?', code: 'System.out.println(Pay(12, 40) + Pay(12, 41));', answer: '978.0', why: 'Pay(12, 40) = 480.0 (40 hours is not overtime). Pay(12, 41) = 480 + 1 x 1.5 x 12 = 498.0. Together: 978.0.' }
    ]
  }
});
