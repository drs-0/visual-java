/* CS1 · Selections: quick checks under the slides (1-2 per slide) and more part-quiz questions. */
addChecks({
  course: 'cs1', lesson: '04-selections',
  slides: {
    2: [
      { type: 'output', q: 'What does this print?', code: 'boolean b = (5 >= 5);\nSystem.out.println(b);', answer: 'true', why: '5 is equal to 5, so 5 >= 5 is true.' },
      { type: 'fill', q: 'Store in big whether x is greater than 100.', code: 'boolean big = (x ___ 100);', answer: ['>'], why: 'A comparison gives a boolean: true or false.' }
    ],
    3: [
      { type: 'trace', q: 'radius is -2. Write true or false for each comparison.', cols: ['comparison', 'result'], rows: [['radius < 0', '?true'], ['radius <= 0', '?true'], ['radius > 0', '?false'], ['radius == 0', '?false'], ['radius != 0', '?true']], why: '-2 is less than 0, so it is not equal to 0 and not greater than 0.' },
      { type: 'match', q: 'Match each math symbol with the Java operator.', pairs: [['≤', '<='], ['≥', '>='], ['≠', '!='], ['= (equal to)', '==']], why: 'Remember: one = is assignment; == compares.' }
    ],
    4: [
      { type: 'output', q: 'number1 is 3, number2 is 6 and the student types 9. What is printed?', code: 'boolean result = (number1 + number2 == answer);\nSystem.out.println(\n  number1 + " + " + number2 + " = " + answer + " is " + result);', answer: '3 + 6 = 9 is true', why: '3 + 6 is 9, so the comparison is true.' },
      { q: 'Why is (int)(System.currentTimeMillis() % 10) always a digit from 0 to 9?', options: ['The clock only counts up to 9 milliseconds', 'The remainder after dividing by 10 is 0 to 9', 'The cast to int makes every number small'], answer: 1, why: '% 10 gives the last digit of the number.' }
    ],
    5: [
      { type: 'output', q: 'What does this print?', code: 'int score = 75;\nif (score >= 50) {\n  System.out.println("pass");\n}\nSystem.out.println("end");', answer: 'pass\nend', why: 'The condition is true, so the block runs. Then the program goes on after the block.' },
      { type: 'write', q: 'Write a one-way if that prints Big when x is greater than 100.', rows: 3, checks: [{ re: /if\s*\(\s*x\s*>\s*100\s*\)/, label: 'if (x > 100)' }, { re: /System\s*\.\s*out\s*\.\s*println\s*\(\s*"Big"\s*\)\s*;/, label: 'System.out.println("Big");' }], solution: 'if (x > 100) {\n  System.out.println("Big");\n}', why: 'The condition goes in parentheses after if.' }
    ],
    6: [
      { type: 'bug', q: 'One line does not compile. Tap it.', code: 'int x = -2;\nif x < 0\n  System.out.println("negative");', answer: 2, why: 'The condition must be inside parentheses: if (x < 0).' },
      { type: 'tf', q: 'When the if block has only one statement, the braces are optional.', answer: true, why: 'Both forms on slide 6 are equivalent.' }
    ],
    7: [
      { type: 'trace', q: 'Follow the HiFive program for each number. What is printed? (Write both words if both are printed.)', code: 'if (number % 5 == 0)\n  System.out.println("HiFive");\nif (number % 2 == 0)\n  System.out.println("HiEven");', cols: ['number', 'printed'], rows: [['20', '?HiFive HiEven|HiFiveHiEven'], ['25', '?HiFive'], ['8', '?HiEven']], why: '20 is a multiple of 5 and even; 25 only a multiple of 5; 8 only even.' }
    ],
    8: [
      { type: 'output', q: 'What does this print?', code: 'double t = -5;\nif (t >= 0)\n  System.out.println("above zero");\nelse\n  System.out.println("below zero");', answer: 'below zero', why: '-5 >= 0 is false, so the else part runs.' },
      { type: 'tf', q: 'In an if-else, both blocks can run.', answer: false, why: 'Exactly one of the two runs, every time.' }
    ],
    9: [
      { q: 'Why is the else if form (b) better than the nested form (a)?', options: ['It gives other results', 'It is shorter and easier to read', 'It runs all the conditions'], answer: 1, why: 'Both do the same thing; (b) is clearer.' }
    ],
    10: [
      { type: 'trace', q: 'Follow the grade code for each score.', code: 'if (score >= 90.0) System.out.print("A");\nelse if (score >= 80.0) System.out.print("B");\nelse if (score >= 70.0) System.out.print("C");\nelse if (score >= 60.0) System.out.print("D");\nelse System.out.print("F");', cols: ['score', 'printed'], rows: [['95.0', '?A'], ['81.0', '?B'], ['64.0', '?D'], ['40.0', '?F']], why: 'The first true condition wins.' }
    ],
    11: [
      { type: 'tf', q: 'When the first condition is false, Java checks the next else if.', answer: true, why: 'It goes down the chain until a condition is true.' }
    ],
    12: [
      { q: 'score is 72.5. Which condition is the first true one?', options: ['score >= 60.0', 'score >= 80.0', 'score >= 70.0'], answer: 2, why: '72.5 is not >= 90 or >= 80, but it is >= 70.' }
    ],
    13: [
      { type: 'output', q: 'score is 60.0. What is printed?', code: 'if (score >= 90.0)\n  System.out.print("A");\nelse if (score >= 80.0)\n  System.out.print("B");\nelse if (score >= 70.0)\n  System.out.print("C");\nelse if (score >= 60.0)\n  System.out.print("D");\nelse\n  System.out.print("F");', answer: 'D', why: '60.0 >= 60.0 is true.' }
    ],
    14: [
      { q: 'score is 70.0. Is the condition score >= 60.0 checked?', options: ['No: the if statement ends after printing C', 'Yes, every condition is checked', 'Yes, and it prints D too'], answer: 0, why: 'After a true condition, the rest of the chain is skipped.' }
    ],
    15: [
      { type: 'output', q: 'What does this print?', code: 'int i = 3, j = 2, k = 1;\nif (i > j)\n  if (i > k)\n    System.out.println("A");\n  else\n    System.out.println("B");', answer: 'A', why: '3 > 2 and 3 > 1, so A is printed.' },
      { type: 'tf', q: 'The indentation decides which if an else belongs to.', answer: false, why: 'An else always matches the nearest if. Indentation only helps people read.' }
    ],
    16: [
      { type: 'bug', q: 'This code always prints “positive”. Tap the line with the mistake.', code: 'int x = -5;\nif (x > 0);\n  System.out.println("positive");', answer: 2, why: 'The semicolon ends the if, so the println is not part of it.' }
    ],
    17: [
      { type: 'write', q: 'Without if-else, store in a new boolean isAdult whether age is 18 or more.', checks: [{ re: /boolean\s+isAdult\s*=\s*\(?\s*age\s*>=\s*18\s*\)?\s*;/, label: 'boolean isAdult = age >= 18;' }], solution: 'boolean isAdult = age >= 18;', why: 'The comparison already gives true or false.' },
      { type: 'fill', q: 'even is a boolean. Write the condition the short way.', code: 'if (___)\n  System.out.println("It is even.");', answer: ['even'], why: 'if (even) means the same as if (even == true).' }
    ],
    18: [
      { type: 'match', q: 'Match each operator with its name.', pairs: [['!', 'not'], ['&&', 'and'], ['||', 'or'], ['^', 'exclusive or']], why: 'Slide 18.' }
    ],
    19: [
      { type: 'trace', q: 'Fill in the truth table.', cols: ['p1', 'p2', 'p1 && p2', 'p1 || p2', 'p1 ^ p2'], rows: [['true', 'false', '?false', '?true', '?true'], ['false', 'false', '?false', '?false', '?false'], ['true', 'true', '?true', '?true', '?false']], why: '&& needs both, || needs one, ^ needs them to be different.' }
    ],
    20: [
      { q: 'number is 4. Which messages are printed?', options: ['“divisible by 2 or 3” and “divisible by 2 or 3, but not both”', 'Only “divisible by 2 and 3”, because 4 is even', 'Only “divisible by 2 or 3”, because ^ is false'], answer: 0, why: '4 is divisible by 2 but not by 3: the && test is false, the || test is true, and ^ is true.' }
    ],
    21: [
      { type: 'trace', q: 'Is each year a leap year? Write true or false.', code: '(year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)', cols: ['year', 'leap year?'], rows: [['2028', '?true'], ['2100', '?false'], ['2400', '?true'], ['2019', '?false']], why: '2028: by 4, not by 100. 2100: by 100, not by 400. 2400: by 400. 2019: not by 4.' }
    ],
    22: [
      { q: 'Which type can NOT be used as the controlling expression of a switch (slide 22)?', options: ['int', 'double', 'char'], answer: 1, why: 'It must be a char, int, short or byte.' },
      { type: 'tf', q: 'A switch runs one of several branches.', answer: true, why: 'It is a multiway branch.' }
    ],
    23: [
      { type: 'bug', q: 'This switch does not compile. Tap the wrong line.', code: 'switch (n) {\n  case 1: System.out.println("one"); break;\n  case 2: System.out.println("two"); break;\n  case 1: System.out.println("uno"); break;\n}', answer: 4, why: 'Each case label may appear only once.' }
    ],
    24: [
      { q: 'When does the default section run?', options: ['Only when there is no break', 'Always, at the end', 'When no case label matches'], answer: 2, why: 'It is a good place for an error message.' }
    ],
    25: [
      { type: 'output', q: 'What does this print?', code: 'int x = 1;\nswitch (x) {\n  case 1: System.out.println("A");\n  case 2: System.out.println("B"); break;\n  case 3: System.out.println("C");\n}', answer: 'A\nB', why: 'case 1 has no break, so it falls through to case 2, which breaks.' }
    ],
    26: [
      { type: 'tf', q: 'The switch-expression must be inside parentheses.', answer: true, why: 'switch (switch-expression) { … }' }
    ],
    27: [
      { type: 'fill', q: 'Stop the switch after case 2.', code: 'case 2: System.out.println("two");\n        ___;', answer: ['break'], why: 'break ends the switch statement.' }
    ],
    28: [
      { q: 'In the template of slide 28, what comes after each Statement_Sequence?', options: ['default:', 'break;', 'else'], answer: 1, why: 'Each case ends with break;.' }
    ],
    29: [
      { type: 'output', q: 'day is 3. What does the switch of slide 29 print?', code: 'switch (day) {\n  case 1:\n  case 3:\n      System.out.println("Weekday");\n      break;\n  case 2:\n  case 4:\n  case 5: System.out.println("Weekday"); break;\n  case 0:\n  case 6: System.out.println("Weekend");\n  default:\n  ;\n}', answer: 'Weekday', why: 'case 3 shares the statements with case 1.' }
    ],
    30: [
      { q: 'day is 2. Where does Java jump?', options: ['To case 2:', 'To case 1:', 'To default'], answer: 0, why: 'It jumps to the matching case label.' }
    ],
    31: [
      { type: 'tf', q: 'case 2 has no statements and no break, so Java falls through to case 3.', answer: true, why: 'It keeps going until it meets a break.' }
    ],
    32: [
      { type: 'output', q: 'day is 4. What is printed?', code: 'switch (day) {\n  case 1:\n  case 2:\n  case 3:\n  case 4:\n  case 5: System.out.println("Weekday"); break;\n  case 0:\n  case 6: System.out.println("Weekend");\n}', answer: 'Weekday', why: 'case 4 falls through to case 5.' }
    ],
    33: [
      { q: 'Which case label has the println for the days 1 to 5?', options: ['case 1', 'case 5', 'case 3'], answer: 1, why: 'The others fall through to it.' }
    ],
    34: [
      { type: 'tf', q: 'Without the break after "Weekday", day 2 would also print Weekend.', answer: true, why: 'Java would fall through into case 0 and case 6.' }
    ],
    35: [
      { q: 'After break, where does Java continue?', options: ['At the default, which always runs last', 'At the next case, which runs next', 'After the closing brace of the switch'], answer: 2, why: 'break ends the whole switch.' }
    ],
    36: [
      { type: 'output', q: 'month is 4. What does the month switch print?', code: 'switch (month) {\n  case 3: System.out.println("March"); break;\n  case 4: System.out.println("April"); break;\n  case 5: System.out.println("May"); break;\n  default: System.out.println("Invalid Month"); break;\n}', answer: 'April', why: 'case 4 matches.' }
    ],
    37: [
      { type: 'trace', q: 'What does the full month switch (slides 36-37) print?', cols: ['month', 'printed'], rows: [['9', '?September'], ['12', '?December'], ['0', '?Invalid Month|InvalidMonth'], ['15', '?Invalid Month|InvalidMonth']], why: 'Months 1 to 12 have a case; any other number goes to default.' }
    ],
    38: [
      { type: 'output', q: 'sClass is \'f\'. What is printed?', code: 'switch (sClass) {\n  case \'B\': case \'b\': System.out.printf("Battleship\\n"); break;\n  case \'C\': case \'c\': System.out.printf("Cruiser\\n"); break;\n  case \'D\': case \'d\': System.out.printf("Destroyer\\n"); break;\n  case \'F\': case \'f\': System.out.printf("Frigate\\n"); break;\n  default: System.out.printf("Unknown ship class %c\\n", sClass); break;\n}', answer: 'Frigate', why: 'Two labels per ship accept a capital or a small letter.' },
      { type: 'output', q: 'And when sClass is \'X\'?', code: 'default: System.out.printf("Unknown ship class %c\\n", sClass);', answer: 'Unknown ship class X', why: 'No case matches, so default runs. %c prints the char.' }
    ],
    39: [
      { type: 'output', q: 'What does this print?', code: 'int x = 7;\nString s = (x % 2 == 0) ? "even" : "odd";\nSystem.out.println(s);', answer: 'odd', why: '7 % 2 == 0 is false, so the second value is used.' },
      { type: 'write', q: 'With the ternary operator, store the absolute value of n in a new int abs (-n when n is less than 0, else n).', checks: [{ re: /int\s+abs\s*=\s*\(?\s*n\s*<\s*0\s*\)?\s*\?\s*-\s*n\s*:\s*n\s*;/, label: 'int abs = (n < 0) ? -n : n;' }], solution: 'int abs = (n < 0) ? -n : n;', why: '(condition) ? value1 : value2' }
    ],
    40: [
      { type: 'order', q: 'Put these operators in order of precedence, highest first.', lines: ['!', '*', '+', '<', '&&', '='], why: 'Not, then multiplication, addition, relational, AND, and assignment last.' },
      { q: 'Which is done first: && or ||?', options: ['They are the same', '||', '&&'], answer: 2, why: '&& has a higher precedence than ||.' }
    ],
    41: [
      { type: 'output', q: 'What does this print?', code: 'System.out.println(2 * 3 + 4 > 10 - 1);', answer: 'true', why: '2 * 3 + 4 = 10 and 10 - 1 = 9; 10 > 9 is true.' }
    ],
    42: [
      { type: 'match', q: 'Match each word with its meaning.', pairs: [['Bug', 'A logic error'], ['Debugging', 'Finding and fixing errors'], ['Breakpoint', 'A place where the program stops'], ['Debugger', 'A program that helps you debug']], why: 'Slide 42.' }
    ]
  },
  parts: {
    0: [
      { type: 'output', q: 'What does this print?', code: 'int a = 7, b = 7;\nSystem.out.println(a <= b);', answer: 'true', why: '7 is equal to 7, so “less than or equal” is true.' },
      { type: 'bug', q: 'This line compares x with 5, but it is wrong. Tap it.', code: 'int x = 5;\nboolean same = (x = 5);\nSystem.out.println(same);', answer: 2, why: 'One = is assignment. To compare, write x == 5.' },
      { type: 'match', q: 'radius is 0. Match each comparison with its result.', pairs: [['radius < 0', 'false'], ['radius >= 0', 'true']], why: '0 is not less than 0, but it is equal to it.' }
    ],
    1: [
      { type: 'write', q: 'Write an if-else: when n >= 0 print positive, otherwise print negative.', rows: 4, checks: [{ re: /if\s*\(\s*n\s*>=\s*0\s*\)/, label: 'if (n >= 0)' }, { re: /println\s*\(\s*"positive"\s*\)\s*;[\s\S]*else[\s\S]*println\s*\(\s*"negative"\s*\)\s*;/, label: 'print positive, then else, then print negative' }], solution: 'if (n >= 0)\n  System.out.println("positive");\nelse\n  System.out.println("negative");', why: 'One block for true, one block (after else) for false.' },
      { type: 'trace', q: 'Follow the HiFive program again.', code: 'if (number % 5 == 0)\n  System.out.println("HiFive");\nif (number % 2 == 0)\n  System.out.println("HiEven");', cols: ['number', 'printed'], rows: [['30', '?HiFive HiEven|HiFiveHiEven'], ['35', '?HiFive']], why: '30 is a multiple of 5 and even; 35 is a multiple of 5 but odd.' },
      { type: 'fill', q: 'Test if number is a multiple of 5.', code: 'if (number % 5 ___ 0)', answer: ['=='], why: 'The remainder is 0 for a multiple of 5.' }
    ],
    2: [
      { type: 'trace', q: 'Follow the grade code for each score.', cols: ['score', 'printed'], rows: [['100.0', '?A'], ['89.9', '?B'], ['70.1', '?C'], ['0.0', '?F']], why: '89.9 is not >= 90, but it is >= 80.' },
      { type: 'output', q: 'With braces, what does this print? (slide 15)', code: 'int i = 1, j = 2, k = 3;\nif (i > j) {\n  if (i > k)\n    System.out.println("A");\n}\nelse\n  System.out.println("B");', answer: 'B', why: 'The braces make the else belong to the first if, and 1 > 2 is false.' },
      { type: 'bug', q: 'This code prints “big” for every x. Tap the wrong line.', code: 'int x = 3;\nif (x > 10);\n{\n  System.out.println("big");\n}', answer: 2, why: 'The semicolon after the if ends it, so the block always runs.' }
    ],
    3: [
      { type: 'output', q: 'What does this print?', code: 'System.out.println((5 > 3) && (2 > 4));', answer: 'false', why: 'The second part is false, so && is false.' },
      { type: 'write', q: 'Store in a new boolean named both whether n is divisible by 2 and by 3.', checks: [{ re: /boolean\s+both\s*=\s*\(?\s*\(?\s*n\s*%\s*2\s*==\s*0\s*\)?\s*&&\s*\(?\s*n\s*%\s*3\s*==\s*0\s*\)?\s*\)?\s*;/, label: 'boolean both = (n % 2 == 0) && (n % 3 == 0);' }], solution: 'boolean both = (n % 2 == 0) && (n % 3 == 0);', why: '&& needs both parts to be true.' },
      { q: 'Is 2000 a leap year?', options: ['No: it is divisible by 100', 'Yes: it is divisible by 400'], answer: 1, why: 'The second part of the rule, year % 400 == 0, is true.' }
    ],
    4: [
      { type: 'trace', q: 'What does this switch print for each x?', code: 'switch (x) {\n  case 1: System.out.println("one");\n  case 2: System.out.println("two"); break;\n  default: System.out.println("many");\n}', cols: ['x', 'printed'], rows: [['1', '?one two|onetwo'], ['2', '?two'], ['7', '?many']], why: 'case 1 has no break, so "two" is printed too. 7 has no case, so default runs.' },
      { type: 'fill', q: 'Complete the switch: print Error when no case matches.', code: 'switch (n) {\n  case 1: System.out.println("one"); break;\n  ___: System.out.println("Error");\n}', answer: ['default'], why: 'default runs when no case label matches.' },
      { type: 'output', q: 'What does this print?', code: 'char grade = \'b\';\nswitch (grade) {\n  case \'A\': case \'a\': System.out.println("Excellent"); break;\n  case \'B\': case \'b\': System.out.println("Good"); break;\n  default: System.out.println("Other");\n}', answer: 'Good', why: 'The small letter b matches the second label of the Good case.' }
    ],
    5: [
      { type: 'trace', q: 'What is y for each x?', code: 'int y = (x > 0) ? 1 : -1;', cols: ['x', 'y'], rows: [['5', '?1'], ['-3', '?-1'], ['0', '?-1']], why: 'Only x > 0 gives 1. 0 is not greater than 0.' },
      { type: 'output', q: 'What does this print?', code: 'System.out.println(10 - 2 * 3 >= 4 && 1 + 1 == 2);', answer: 'true', why: '10 − 6 = 4, and 4 >= 4 is true; 1 + 1 == 2 is true; true && true is true.' },
      { q: 'What can a debugger NOT do?', options: ['Fix the bug for you', 'Run one statement at a time', 'Show the values of variables'], answer: 0, why: 'It helps you find the bug; you fix it.' }
    ]
  }
});
