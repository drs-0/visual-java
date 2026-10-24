/* CS1 · Loops: quick checks under the slides (1-2 per slide) and more part-quiz questions. */
addChecks({
  course: 'cs1', lesson: '06-loops',
  slides: {
    2: [
      { type: 'output', q: 'What does this print?', code: 'int k = 10;\nwhile (k > 7) {\n  System.out.println(k);\n  k--;\n}', answer: '10\n9\n8', why: 'k is 10, 9, 8; when k is 7, k > 7 is false and the loop ends.' },
      { type: 'fill', q: 'Something must change in the body, or the loop never stops. Complete it.', code: 'int count = 0;\nwhile (count < 5) {\n  System.out.println("Hi");\n  count___;\n}', answer: ['++|+=1|+= 1'], why: 'count++ makes count bigger, so count < 5 becomes false one day.' }
    ],
    3: [
      { type: 'tf', q: 'int count = 0; runs only once, before the loop starts.', answer: true, why: 'It is not part of the loop body.' }
    ],
    4: [
      { q: 'count is 0. Why does the body run the first time?', options: ['Because 0 < 2 is true', 'Because the body always runs once', 'Because count is a number'], answer: 0, why: 'The while loop checks its condition first.' }
    ],
    5: [
      { q: 'What does this step print?', options: ['Welcome to Java!', 'count', 'Nothing'], answer: 0, why: 'The println in the body runs: the first line of output.' }
    ],
    6: [
      { type: 'tf', q: 'After count++, Java goes back to check the condition again.', answer: true, why: 'count++ is the last statement of the body.' }
    ],
    7: [
      { q: 'count is 1. What is count < 2?', options: ['true', 'false'], answer: 0, why: '1 is less than 2, so the body runs again.' }
    ],
    8: [
      { q: 'How many lines have been printed after this step?', options: ['2', '1', '3'], answer: 0, why: 'This is the second run of the body.' }
    ],
    9: [
      { type: 'fill', q: 'Complete the sentence of slide 9.', lang: 'none', code: 'count is ___ now', answer: ['2'], why: 'It was 1, and count++ adds 1.' }
    ],
    10: [
      { q: 'count is 2, so count < 2 is false. What happens?', options: ['The loop exits', 'The body runs again', 'The program stops with an error'], answer: 0, why: 'The next statement after the loop runs.' }
    ],
    11: [
      { type: 'trace', q: 'count starts at 0. How many iterations does each loop have?', code: 'int count = 0;\nwhile (count < N) {\n  System.out.println("Welcome to Java!");\n  count++;\n}', cols: ['N', 'iterations'], rows: [['2', '?2'], ['5', '?5'], ['0', '?0']], why: 'count takes the values 0 to N − 1. With N = 0 the condition is false at once.' }
    ],
    12: [
      { type: 'tf', q: 'For a double, while (item > 0) is safer than while (item != 0).', answer: true, why: 'item may never be exactly 0, but it will become less than 0.' }
    ],
    13: [
      { type: 'output', q: 'What does this print?', code: 'int n = 10;\ndo {\n  System.out.println(n);\n  n += 5;\n} while (n < 20);', answer: '10\n15', why: 'The body runs first (10), then 15 < 20 is true (15), then 20 < 20 is false.' },
      { type: 'tf', q: 'A do-while loop ends with a semicolon after the condition.', answer: true, why: '} while (condition);' }
    ],
    14: [
      { type: 'match', q: 'Match each part of for (int i = 0; i < 100; i++) with its name.', pairs: [['int i = 0', 'initial-action'], ['i < 100', 'loop-continuation-condition'], ['i++', 'action-after-each-iteration']], why: 'Start, condition, step.' },
      { type: 'write', q: 'Write the header of a for loop that counts i from 1 to 10 (10 included). End it with {.', checks: [{ re: /for\s*\(\s*int\s+i\s*=\s*1\s*;\s*i\s*(<=\s*10|<\s*11)\s*;\s*(i\s*\+\+|\+\+\s*i|i\s*\+=\s*1)\s*\)\s*\{/, label: 'for (int i = 1; i <= 10; i++) {' }], solution: 'for (int i = 1; i <= 10; i++) {', why: 'i starts at 1, runs while i <= 10, and grows by 1.' }
    ],
    15: [
      { type: 'output', q: 'What does this print?', code: 'for (int i = 1; i < 4; System.out.println(i++));', answer: '1\n2\n3', why: 'The action after each iteration prints i, then adds 1. The body is empty.' }
    ],
    16: [
      { q: 'Which loop is the same as for ( ; ; ) { }?', options: ['while (true) { }', 'while (false) { }', 'do { } while (false);'], answer: 0, why: 'A missing condition counts as true: an infinite loop.' }
    ],
    17: [
      { type: 'bug', q: 'This code prints Hi only once. Tap the line with the mistake.', code: 'for (int i = 0; i < 3; i++);\n{\n  System.out.println("Hi");\n}', answer: 1, why: 'The ; after the header is an empty body. The block runs once, after the loop.' }
    ],
    18: [
      { q: 'Which loop needs a semicolon after its condition?', options: ['do-while', 'while', 'for'], answer: 0, why: 'After while or for, a semicolon is a logic error.' }
    ],
    19: [
      { type: 'match', q: 'Match each situation with the loop that fits it best.', pairs: [['You know how many repetitions', 'for'], ['You do not know how many repetitions', 'while'], ['The body must run before the test', 'do-while']], why: 'Slide 19.' },
      { type: 'write', q: 'Write while (x < 5) as the header of a for loop, with an empty first and last part. End it with {.', checks: [{ re: /for\s*\(\s*;\s*x\s*<\s*5\s*;\s*\)\s*\{/, label: 'for ( ; x < 5; ) {' }], solution: 'for ( ; x < 5; ) {', why: 'Slide 19 (b).' }
    ],
    20: [
      { type: 'trace', q: 'Follow TestBreak (sum starts at 90). Fill in number and sum after each iteration.', code: 'int sum = 90;\nint number = 0;\nwhile (number < 20) {\n  number++;\n  sum += number;\n  if (sum >= 100)\n    break;\n}', cols: ['iteration', 'number', 'sum'], rows: [['1', '?1', '?91'], ['2', '?2', '?93'], ['3', '?3', '?96'], ['4', '?4', '?100']], why: 'In iteration 4 the sum reaches 100, so break ends the loop. It prints The number is 4 and The sum is 100.' }
    ],
    21: [
      { type: 'output', q: 'What does TestContinue print?', code: 'int sum = 0;\nint number = 0;\nwhile (number < 20) {\n  number++;\n  if (number == 10 || number == 11)\n    continue;\n  sum += number;\n}\nSystem.out.println("The sum is " + sum);', answer: 'The sum is 189', why: '1 + 2 + … + 20 = 210. Without 10 and 11: 210 − 21 = 189.' },
      { type: 'fill', q: 'Skip the even numbers: do not add them.', code: 'for (int i = 1; i <= 9; i++) {\n  if (i % 2 == 0)\n    ___;\n  sum += i;\n}', answer: ['continue'], why: 'continue skips the rest of this iteration only.' }
    ],
    22: [
      { q: 'In the multiplication table, what is printed in row 3, column 4?', options: ['12', '7', '34'], answer: 0, why: 'Each cell is i * j: 3 * 4 = 12.' },
      { type: 'tf', q: 'For each value of i, the inner loop runs all its j values.', answer: true, why: 'The inner loop starts again for every i.' }
    ],
    23: [
      { type: 'output', q: 'The user types 1. What does the Omar program print?', code: 'for (int i = 0; i <= n; i++) {\n  for (int j = 0; j <= i; j++)\n    System.out.print("Omar");\n  System.out.println();\n}\nfor (int i = n; i >= 0; i--) {\n  for (int j = 0; j <= i; j++)\n    System.out.print("Omar");\n  System.out.println();\n}', answer: 'Omar\nOmarOmar\nOmarOmar\nOmar', why: 'Up: rows of 1 and 2. Down: rows of 2 and 1. print adds no space.' }
    ],
    24: [
      { type: 'trace', q: 'Follow the star program for each n.', cols: ['n', 'lines printed', 'stars in the last line'], rows: [['2', '?3', '?3'], ['5', '?6', '?6']], why: 'i goes from 0 to n: n + 1 lines. Row i has i + 1 stars.' }
    ],
    26: [
      { type: 'trace', q: 'What is the greatest common divisor?', cols: ['n1', 'n2', 'gcd'], rows: [['18', '12', '?6'], ['7', '3', '?1'], ['20', '20', '?20'], ['9', '6', '?3']], why: 'The biggest number that divides both. For 7 and 3 only 1 does.' }
    ],
    27: [
      { q: 'Why is a while loop a good fit for the tuition problem?', options: ['We do not know in advance how many years it takes', 'We know it takes 10 years', 'The tuition never changes'], answer: 0, why: 'Repeat until the tuition reaches $20,000.' }
    ],
    28: [
      { type: 'bug', q: 'One line of slide 28 does not compile. Tap it.', code: 'double tuition = 10000;\nint year = 0\ntuition = tuition * 1.07; year++;', answer: 2, why: 'The slide forgot the semicolon after int year = 0.' }
    ],
    29: [
      { type: 'write', q: 'Write the first line of a loop that runs until a break stops it. End it with {.', checks: [{ re: /while\s*\(\s*true\s*\)\s*\{/, label: 'while (true) {' }], solution: 'while (true) {', why: 'The condition is always true; a break inside ends the loop.' }
    ],
    30: [
      { type: 'trace', q: 'Is each number prime? Write true or false.', cols: ['number', 'prime?'], rows: [['11', '?true'], ['15', '?false'], ['2', '?true'], ['1', '?false']], why: '11 and 2 have no divisor but 1 and themselves. 15 = 3 x 5. A prime must be greater than 1.' }
    ],
    31: [
      { q: 'What is a sentinel value?', options: ['A special value that ends the loop', 'The first value of a counter', 'A value that never changes'], answer: 0, why: 'Here the click on No is the sentinel.' }
    ]
  },
  parts: {
    0: [
      { type: 'trace', q: 'Follow the loop. What is x after each iteration?', code: 'int x = 1;\nwhile (x < 30)\n  x = x * 3;', cols: ['iteration', 'x'], rows: [['1', '?3'], ['2', '?9'], ['3', '?27'], ['4', '?81']], why: 'After 27, 27 < 30 is still true, so x becomes 81. Then 81 < 30 is false.' },
      { type: 'bug', q: 'This loop never stops. Tap the wrong line.', code: 'int count = 0;\nwhile (count < 5) {\n  System.out.println(count);\n  count--;\n}', answer: 4, why: 'count gets smaller, so count < 5 stays true forever. It should be count++.' },
      { type: 'output', q: 'What does this print?', code: 'int sum = 0, i = 1;\nwhile (i <= 3) {\n  sum += i * i;\n  i++;\n}\nSystem.out.println(sum);', answer: '14', why: '1 + 4 + 9 = 14.' }
    ],
    1: [
      { type: 'trace', q: 'Which values does i take inside the body?', code: 'for (int i = 2; i < 12; i += 4)\n  System.out.println(i);', cols: ['iteration', 'i'], rows: [['1', '?2'], ['2', '?6'], ['3', '?10']], why: 'After 10, i becomes 14, and 14 < 12 is false.' },
      { type: 'write', q: 'Write a for loop that prints the numbers 0 to 4, one per line.', rows: 3, checks: [{ re: /for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*(<\s*5|<=\s*4)\s*;\s*(i\s*\+\+|\+\+\s*i|i\s*\+=\s*1)\s*\)/, label: 'for (int i = 0; i < 5; i++)' }, { re: /System\s*\.\s*out\s*\.\s*println\s*\(\s*i\s*\)\s*;/, label: 'System.out.println(i);' }], solution: 'for (int i = 0; i < 5; i++)\n  System.out.println(i);', why: 'i starts at 0 and the loop runs while i < 5.' },
      { type: 'tf', q: 'The body of a do-while loop can run zero times.', answer: false, why: 'The body always runs at least once, because the test comes after it.' }
    ],
    2: [
      { type: 'output', q: 'What does this print?', code: 'int sum = 0, number = 0;\nwhile (number < 20) {\n  number++;\n  sum += number;\n  if (sum >= 50)\n    break;\n}\nSystem.out.println(number + " " + sum);', answer: '10 55', why: '1 + … + 9 = 45 (not yet 50); adding 10 gives 55, and break stops the loop.' },
      { type: 'output', q: 'What does this print?', code: 'int sum = 0;\nfor (int i = 1; i <= 6; i++) {\n  if (i % 3 == 0)\n    continue;\n  sum += i;\n}\nSystem.out.println(sum);', answer: '12', why: '3 and 6 are skipped: 1 + 2 + 4 + 5 = 12.' },
      { type: 'match', q: 'Match each keyword with what it does.', pairs: [['break', 'Ends the whole loop'], ['continue', 'Ends only the current iteration']], why: 'Slides 20 and 21.' }
    ],
    3: [
      { type: 'output', q: 'What does this print?', code: 'for (int i = 1; i <= 3; i++) {\n  for (int j = 1; j <= 2; j++)\n    System.out.print(i * j + " ");\n  System.out.println();\n}', answer: '1 2\n2 4\n3 6', why: 'Row i prints i * 1 and i * 2. Spaces at the end do not matter.' },
      { type: 'fill', q: 'Make row i print i + 1 stars, like slide 24.', code: 'for (int i = 0; i <= n; i++) {\n  for (int j = 0; j ___ i; j++)\n    System.out.print("*");\n  System.out.println();\n}', answer: ['<='], why: 'j goes from 0 to i: that is i + 1 values.' },
      { q: 'In nested loops with 4 outer and 5 inner iterations, how many times does the inner body run?', options: ['20', '9', '5'], answer: 0, why: '4 x 5 = 20.' }
    ],
    4: [
      { type: 'output', q: 'Tuition grows 20% every year. What does this print?', code: 'double tuition = 10000;\nint year = 0;\nwhile (tuition < 20000) {\n  tuition = tuition * 1.2;\n  year++;\n}\nSystem.out.println(year);', answer: '4', why: '12000, 14400, 17280, 20736: after 4 years it is at least 20000.' },
      { type: 'trace', q: 'Follow the GCD idea for n1 = 8 and n2 = 12. Is k a common divisor?', cols: ['k', 'common divisor?', 'gcd after this k'], rows: [['2', '?yes|true', '?2'], ['3', '?no|false', '?2'], ['4', '?yes|true', '?4']], why: 'k goes up to 8 (the smaller number). 4 is the last k that divides both, so gcd is 4.' },
      { type: 'tf', q: 'In the prime program, break stops the inner loop as soon as a divisor is found.', answer: true, why: 'Then the number is not prime, so there is no need to look further.' }
    ]
  }
});
