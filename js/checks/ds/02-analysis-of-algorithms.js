/* Data Structures · Unit 2 Analysis of Algorithms: questions under the slides and the part quizzes.
   Every question has lessons, skills, available_after and level (1 easy, 2 middle, 3 hard, never harder than the
   instructor's). source = the instructor's own question (Assignments 1 and 2), copied word for word with his answer.
   No checks on the cover and the two outline slides (1, 2, 18). Numbers differ from the drawing presets. */
addChecks({
  course: 'ds', lesson: '02-analysis-of-algorithms',
  slides: {
    3: [
      { q: 'Two programs solve the same problem. Program A uses 10 MB of memory and finishes in 2 seconds. Program B uses 1 MB and finishes in 9 seconds. Which sentence uses the words of slide 3 correctly?',
        options: ['A is better in both time and space efficiency', 'A has better time efficiency; B has better space efficiency', 'A has better space efficiency; B has better time efficiency', 'They have the same efficiency, because they solve the same problem'], answer: 1,
        why: '<b>Time</b> efficiency = execution time: A is faster (2 s). <b>Space</b> efficiency = memory used: B uses less (1 MB). So each program wins on one side. Solving the same problem does not make two algorithms equally efficient.',
        lessons: ['02-analysis-of-algorithms'], skills: ['concept'], available_after: '02-analysis-of-algorithms', level: 1 }
    ],
    4: [
      { q: 'With the careless method of slide 4, how many single drying actions happen in total for 4 dishes? (Drying one dish once = one action.)',
        options: ['4', '8', '10', '16'], answer: 2,
        why: 'After dish 1 you dry 1 dish, after dish 2 you dry 2, then 3, then 4: 1 + 2 + 3 + 4 = 10. "4" is the careful method (each dish dried once). "16" is 4 × 4, as if all 4 dishes were dried after every wash, even the ones not washed yet.',
        lessons: ['02-analysis-of-algorithms'], skills: ['trace'], available_after: '02-analysis-of-algorithms', level: 1 }
    ],
    5: [
      { q: 'Use the result of slide 5, Time(n) = 15n² + 45n seconds. How long does the careless method take for 6 dishes?',
        options: ['360 seconds', '540 seconds', '1,620 seconds', '810 seconds'], answer: 3,
        why: '15 × 6² + 45 × 6 = 15 × 36 + 270 = 540 + 270 = 810. "360" is the careful method (6 × 60). "540" forgets the 45n part. "1,620" uses 30n² instead of 15n² (it forgets the division by 2 in n(n + 1)/2).',
        lessons: ['02-analysis-of-algorithms'], skills: ['trace'], available_after: '02-analysis-of-algorithms', level: 2 },
      { type: 'tf', q: 'Using the formula of slide 5, 1 + 2 + 3 + … + 20 = 210.', answer: true,
        why: 'n(n + 1)/2 with n = 20 gives 20 × 21 / 2 = 210. Adding 20 numbers one by one gives the same, but the formula is one step.',
        lessons: ['02-analysis-of-algorithms'], skills: ['concept'], available_after: '02-analysis-of-algorithms', level: 1 }
    ],
    6: [
      { q: 'A method sorts an array of 50 numbers. Each number is between 1 and 1000. What is the problem size n?',
        options: ['50', '1000', '50,000', '1050'], answer: 0,
        why: 'For a sorting algorithm, n is the <b>number of elements</b> to sort (slide 6): 50. How big the values are (up to 1000) does not change how many elements must be put in order.',
        lessons: ['02-analysis-of-algorithms'], skills: ['concept'], available_after: '02-analysis-of-algorithms', level: 1 }
    ],
    7: [
      { type: 'tf', q: '<b>Space</b> complexity is the execution time of an algorithm as a function of n.', answer: false,
        why: 'Slide 7: <b>time</b> complexity is the execution time; <b>space</b> complexity is the memory the algorithm allocates. The growth function of this unit describes the time.',
        lessons: ['02-analysis-of-algorithms'], skills: ['concept'], available_after: '02-analysis-of-algorithms', level: 1 },
      { q: 'The growth function is t(n) = 15n² + 45n. What is t(2)?',
        options: ['60', '120', '150', '210'], answer: 2,
        why: '15 × 2² = 60 and 45 × 2 = 90, so t(2) = 150. "60" stops after the first term. "120" is 15 × 2 + 90: it forgets to square n. "210" uses 15 × 2³ = 120 + 90.',
        lessons: ['02-analysis-of-algorithms'], skills: ['trace'], available_after: '02-analysis-of-algorithms', level: 1 }
    ],
    8: [
      { q: 'In t(n) = 15n² + 45n, for which n are the two terms <b>equal</b>? (After that n, 15n² is always bigger.)',
        options: ['n = 1', 'n = 45', 'n = 15', 'n = 3'], answer: 3,
        why: '15n² = 45n means 15n = 45, so n = 3: both terms are 135. For n = 1 or 2, 45n is bigger; from n = 4 on, 15n² wins and the gap keeps growing. That is why the dominant term is decided by large n, not by small n.',
        lessons: ['02-analysis-of-algorithms'], skills: ['concept', 'trace'], available_after: '02-analysis-of-algorithms', level: 2 }
    ],
    9: [
      { q: 'Asymptotic complexity is based on the dominant term. Which term is dominant in t(n) = 400n + 2n² + 9000?',
        options: ['9000, because it is the largest number', '2n², because it grows fastest as n increases', '400n, because it has the largest coefficient', 'All three, because they are added'], answer: 1,
        why: 'The dominant term is the one that increases most quickly when n increases (slide 9). For small n, 9000 and 400n are bigger, but n² grows faster than n and much faster than a constant, so 2n² wins for large n.',
        lessons: ['02-analysis-of-algorithms'], skills: ['concept'], available_after: '02-analysis-of-algorithms', level: 1 }
    ],
    10: [
      { type: 'tf', q: 'Two algorithms of the same order, for example both O(n²), always take the same time for the same n.', answer: false,
        why: 'Slide 10: same order means same category, but not equal growth functions. 2n² and 50n² are both O(n²), and the second one is 25 times slower for every n.',
        lessons: ['02-analysis-of-algorithms'], skills: ['concept'], available_after: '02-analysis-of-algorithms', level: 1 },
      { q: 'Algorithm A has t(n) = 2n², and algorithm B has t(n) = 50n. Which statement is true?',
        options: ['A is O(n) and B is O(n²)', 'B is in a better category, so B is faster for every n', 'They are in the same category because both have one term', 'A is O(n²) and B is O(n); still, A is faster for n = 10'], answer: 3,
        why: 'Drop the coefficients: A is O(n²), B is O(n), so B is the better category. But for n = 10, A takes 200 and B takes 500. B wins only when n is big enough (from n = 25 on). Big-O tells how time grows for large n, not which one is faster for every n.',
        lessons: ['02-analysis-of-algorithms'], skills: ['concept', 'complexity'], available_after: '02-analysis-of-algorithms', level: 2 }
    ],
    11: [
      { type: 'match', q: 'Match each growth function with its Big-O category.',
        pairs: [['t(n) = 9', 'O(1)'], ['t(n) = 5 log n + 2', 'O(log n)'], ['t(n) = 7n + 3 log n', 'O(n)'], ['t(n) = n log n + 40n', 'O(n log n)'], ['t(n) = 2ⁿ + n³', 'O(2ⁿ)']],
        why: 'In every function keep only the dominant term and drop its coefficient: 9 is a constant, log n beats a constant, n beats log n, n log n beats n, and 2ⁿ beats n³.',
        lessons: ['02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 2 }
    ],
    12: [
      { q: 'What is the order of t(n) = 500n² + n³/1000?',
        options: ['O(n³)', 'O(n²), because 500 is much bigger than 1/1000', 'O(n⁵)', 'O(500n²)'], answer: 0,
        why: 'Coefficients do not decide the order: n³ grows faster than n², so for large n (here from n = 500,000) the n³ term wins. "O(n⁵)" multiplies the powers instead of comparing them, and Big-O never keeps a coefficient.',
        lessons: ['02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 2 },
      { q: 'What is the order of t(n) = log n⁴ + 25?',
        options: ['O(n⁴)', 'O(log n)', 'O(1)', 'O(4n)'], answer: 1,
        why: 'log n⁴ = 4 log n (like log n³ = 3 log n on slide 12). Drop the 4 and the constant 25: O(log n). The power is inside the log, so it is not O(n⁴), and log n still grows with n, so it is not O(1).',
        lessons: ['02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 2 }
    ],
    13: [
      { type: 'tf', q: 'In the chart of slide 13 (n up to 15), the 2ⁿ curve is below the n³ curve. So an O(2ⁿ) algorithm is better than an O(n³) algorithm.', answer: false,
        why: 'The chart only shows small n. At n = 10, 2ⁿ passes n³ (1024 &gt; 1000) and then grows much faster (slides 14 and 15). Big-O is about large n, so O(n³) is the better category.',
        lessons: ['02-analysis-of-algorithms'], skills: ['concept'], available_after: '02-analysis-of-algorithms', level: 2 }
    ],
    14: [
      { q: 'From which n on is 2ⁿ bigger than n³ for good?',
        options: ['n = 1', 'n = 5', 'n = 30', 'n = 10'], answer: 3,
        why: 'n = 9: 2⁹ = 512 &lt; 9³ = 729. n = 10: 2¹⁰ = 1024 &gt; 10³ = 1000, and after that 2ⁿ stays above. At n = 1, 2¹ = 2 &gt; 1, but the curves cross again (n = 2: 4 &lt; 8), so that is not "for good".',
        lessons: ['02-analysis-of-algorithms'], skills: ['trace', 'concept'], available_after: '02-analysis-of-algorithms', level: 2 }
    ],
    15: [
      { q: 'The chart of slide 15 goes up to 500,000. Why does the 2ⁿ curve leave the chart before n = 20?',
        options: ['Because 2ⁿ is negative for large n', 'Because the chart only draws polynomial functions', 'Because 2¹⁹ = 524,288 is already bigger than 500,000', 'Because 2ⁿ becomes constant after n = 20'], answer: 2,
        why: 'Each step doubles 2ⁿ: 2¹⁸ = 262,144 is still inside, 2¹⁹ = 524,288 is over the top. n³ at n = 60 is only 216,000, so it stays on the chart. That is the meaning of exponential growth.',
        lessons: ['02-analysis-of-algorithms'], skills: ['trace'], available_after: '02-analysis-of-algorithms', level: 2 }
    ],
    16: [
      { q: 'An O(n²) algorithm can solve a problem of size N in one hour. A new computer is 100 times faster. What size can it solve in one hour?',
        options: ['100N', '10N', '50N', 'N + 100'], answer: 1,
        why: 'In one hour the new computer does 100 × N² steps. (kN)² = 100N² gives k² = 100, so k = 10: the problem can be 10 times bigger. "100N" would be true only for O(n). "N + 100" mixes it up with the exponential case.',
        lessons: ['02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 2 }
    ],
    17: [
      { q: 'An O(2ⁿ) algorithm can solve size N in one minute. A CPU 32 times faster is used. What size can it solve in one minute now?',
        options: ['N + 5', '32N', '5N', 'N + 32'], answer: 0,
        why: '2^(N+k) = 32 × 2ᴺ means 2ᵏ = 32, so k = 5. A 32 times faster CPU only <b>adds</b> 5 to the size, like 10× added 3.32 on slide 17. "32N" is the linear case; "5N" uses the 5 as a factor; "N + 32" adds the speedup itself.',
        lessons: ['02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 2 }
    ],
    19: [
      { type: 'multi', q: 'Which are reasons for analyzing algorithms, as given on slide 19?',
        options: ['To predict how an algorithm behaves for large inputs', 'Because a simple measure is easier than implementing and timing the algorithm', 'To make the program code shorter', 'To compare algorithms and pick the best one', 'So that the program never needs testing'], answer: [0, 1, 3],
        why: 'Slide 19 gives three reasons: predicting the behavior for large inputs (scalable software), a simple measure instead of implementing and testing, and comparing algorithms. Analysis says nothing about code length, and a program still needs testing to find mistakes.',
        lessons: ['02-analysis-of-algorithms'], skills: ['concept'], available_after: '02-analysis-of-algorithms', level: 1 }
    ],
    20: [
      { q: 'What is the time complexity of this loop?',
        code: 'for (int i = 0; i < n; i += 3)\n  sum += i;',
        options: ['O(n)', 'O(n/3), and that cannot be simplified', 'O(1), because it skips most values', 'O(log n)'], answer: 0,
        why: 'The body is O(1) and the loop runs about n/3 times. n/3 = (1/3) · n, and Big-O drops the coefficient, so the loop is O(n). It still grows with n, so not O(1). O(log n) needs the counter to be multiplied (slide 21), not increased by 3.',
        lessons: ['02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 2 },
      { q: 'How many times does the body of `for (int i = 0; i <= n; i++)` run when n = 10?',
        options: ['9', '10', '11', '12'], answer: 2,
        why: 'i takes the values 0, 1, …, 10: that is 11 values, because &lt;= also includes 10. With &lt; it would be 10 times. Either way the loop is O(n).',
        lessons: ['02-analysis-of-algorithms'], skills: ['trace'], available_after: '02-analysis-of-algorithms', level: 1 }
    ],
    21: [
      { q: 'count starts at 1 and n = 40. How many times does the body of the loop of slide 21 run?',
        code: 'int count = 1;\nwhile (count < n) {\n  count = count * 2;\n}',
        options: ['5', '6', '20', '40'], answer: 1,
        why: 'count goes 1 → 2 → 4 → 8 → 16 → 32 → 64. The test is true for 1, 2, 4, 8, 16 and 32: 6 times; then 64 &lt; 40 is false. log₂ 40 ≈ 5.3, rounded up to 6. "20" and "40" think count grows by 1 or 2 each time.',
        lessons: ['02-analysis-of-algorithms'], skills: ['trace'], available_after: '02-analysis-of-algorithms', level: 2 },
      { type: 'bug', q: 'A student writes the doubling loop like this. For n = 10 it never stops. Tap the line that causes it.',
        code: 'int count = 0;\nwhile (count < n) {\n  count = count * 2;\n  System.out.println(count);\n}',
        answer: 1,
        why: '0 × 2 = 0, so count stays 0 forever and <code>count &lt; n</code> stays true. The loop of slide 21 only works because count starts at 1 (or any positive number). The doubling line itself is right.',
        lessons: ['02-analysis-of-algorithms'], skills: ['bug', 'edge_case'], available_after: '02-analysis-of-algorithms', level: 2 }
    ],
    22: [
      { q: 'What is the time complexity of these nested loops?',
        code: 'for (int i = 0; i < n; i++)\n  for (int j = 0; j < i; j++)\n    sum++;',
        options: ['O(n)', 'O(n log n)', 'O(2ⁿ)', 'O(n²)'], answer: 3,
        why: 'The inner loop runs 0, 1, 2, …, n − 1 times: 0 + 1 + … + (n − 1) = n(n − 1)/2 = n²/2 − n/2. The dominant term is n²/2, so O(n²). Half of n × n is still quadratic. O(n log n) needs an inner loop that doubles or halves.',
        lessons: ['02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 2 },
      { q: 'What is the time complexity of these nested loops?',
        code: 'for (int i = 0; i < n; i++)\n  for (int j = 0; j < 100; j++)\n    sum++;',
        options: ['O(n)', 'O(n²)', 'O(100)', 'O(1)'], answer: 0,
        why: 'Nested does not always mean O(n²). The inner loop runs 100 times whatever n is, so it is O(1). The outer loop runs n times: n × 100 = 100n, which is O(n).',
        lessons: ['02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 2 }
    ],
    23: [
      { type: 'tf', q: 'For a loop that calls a method, the complexity is the number of iterations times the complexity of the method; the cost of making the call itself is ignored.', answer: true,
        why: 'Slide 23: the method\'s own work must be counted (it may contain a loop), but the overhead of the call itself is ignored.',
        lessons: ['02-analysis-of-algorithms'], skills: ['concept'], available_after: '02-analysis-of-algorithms', level: 1 }
    ],
    24: [
      { q: 'The loop of slide 24 calls `printsum(count)` for count = 1 to n. When n = 5, how many times does `sum += i` run in total?',
        options: ['5', '10', '15', '25'], answer: 2,
        why: 'printsum(1) adds once, printsum(2) twice, … printsum(5) five times: 1 + 2 + 3 + 4 + 5 = 15 = 5 × 6 / 2. "5" counts only the calls, and "25" thinks every call runs the loop n times.',
        lessons: ['02-analysis-of-algorithms'], skills: ['trace'], available_after: '02-analysis-of-algorithms', level: 2 }
    ],
    25: [
      { q: 'The improved printsum of slide 25 is O(1). Why is the loop that calls it still O(n)?',
        options: ['Because the formula count*(count+1)/2 is O(n)', 'It is not: the loop is O(1) too', 'Because println is O(n)', 'Because the loop calls the O(1) method n times'], answer: 3,
        why: 'Loop rule: n iterations × O(1) per call = O(n). The formula is one calculation whatever count is, so it is O(1). The loop around it still runs n times.',
        lessons: ['02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 1 }
    ],
    26: [
      { q: 'What are the growth function and the order of these loops?',
        code: 'for (int i=0; i<n; i++)\n  for (int j=0; j<n; j += 3)\n    System.out.println(i + ", " + j);',
        options: ['t(n) = 3n², O(n²)', 't(n) = n/3, O(n)', 't(n) = n²/3, O(n²)', 't(n) = n²/3, O(n²/3)'], answer: 2,
        why: 'The outer loop runs n times and the inner one about n/3 times: n × n/3 = n²/3. Drop the 1/3: O(n²). "3n²" multiplies by the step instead of dividing. Big-O never keeps the coefficient, so "O(n²/3)" is not written.',
        lessons: ['02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 2 }
    ],
    27: [
      { type: 'output', q: 'How many lines does this print when n = 8? Type the number.',
        code: 'for (int i=0; i<n; i++)\n  for (int j=1; j<n; j *= 2)\n    System.out.println(i + ", " + j);',
        answer: '24',
        why: 'For n = 8 the inner loop takes j = 1, 2, 4 (8 &lt; 8 is false): 3 times = log₂ 8. The outer loop runs 8 times, so 8 × 3 = 24 lines. That is n × log₂ n, O(n log n).',
        lessons: ['02-analysis-of-algorithms'], skills: ['trace'], available_after: '02-analysis-of-algorithms', level: 2 }
    ],
    28: [
      { type: 'output', q: 'What does `towerHanoi(2, \'P\', \'Q\', \'R\')` print? (The method of slide 28: from, to, aux.)',
        code: 'public static void towerHanoi(int n, char from, char to, char aux) {\n  if (n == 1)\n    System.out.printf("Move disk 1 from %c to %c%n", from, to);\n  else {\n    towerHanoi(n-1, from, aux, to);\n    System.out.printf("Move disk %d from %c to %c%n", n, from, to);\n    towerHanoi(n-1, aux, to, from);\n  }\n}',
        answer: 'Move disk 1 from P to R\nMove disk 2 from P to Q\nMove disk 1 from R to Q',
        why: 'n = 2: first <code>towerHanoi(1, P, R, Q)</code> moves disk 1 from P to the helper R. Then disk 2 goes from P to Q. Then <code>towerHanoi(1, R, Q, P)</code> moves disk 1 from R to Q. Watch the order of the arguments: from, to, aux.',
        lessons: ['02-analysis-of-algorithms'], skills: ['trace'], available_after: '02-analysis-of-algorithms', level: 2 }
    ],
    29: [
      { q: 'How many times is towerHanoi called (counting the first call from main) for n = 5?',
        options: ['10', '25', '31', '32'], answer: 2,
        why: 'Number of calls = 2ⁿ − 1 (slide 29): 2⁵ − 1 = 31. Each call with n &gt; 1 makes two calls with n − 1, so the tree doubles at every level: 1 + 2 + 4 + 8 + 16 = 31. "32" forgets the − 1; "10" and "25" think it grows like 2n or n².',
        lessons: ['02-analysis-of-algorithms'], skills: ['trace', 'complexity'], available_after: '02-analysis-of-algorithms', level: 2 }
    ]
  },
  parts: {
    0: [
      { q: 'For a search algorithm, what is the problem size n (slide 6)?',
        options: ['The value we are searching for', 'The number of times the search is run', 'The number of elements in the search pool', 'The size of the largest element'], answer: 2,
        why: 'n is the number of elements the algorithm must look at. The value we look for, or how big the elements are, does not change how many elements there are.',
        lessons: ['02-analysis-of-algorithms'], skills: ['concept'], available_after: '02-analysis-of-algorithms', level: 1 },
      { source: { assignment: 2, question: 7 },
        type: 'multi', q: 'What is the sum of the following. 1 + 2 + 3 + ... + n',
        options: ['n(n-1)/2', 'n(n+1)/2', 'n^2/2 + n/2'], answer: [1, 2],
        why: 'Slide 5: 1 + 2 + … + n = n(n + 1)/2. Multiply it out: n(n + 1)/2 = (n² + n)/2 = n²/2 + n/2, so the third option is the same formula. n(n − 1)/2 is the sum that stops at n − 1. Check with n = 3: 1 + 2 + 3 = 6 = 3 × 4 / 2.',
        lessons: ['02-analysis-of-algorithms'], skills: ['concept'], available_after: '02-analysis-of-algorithms', level: 2 },
      { source: { assignment: 2, question: 4 },
        type: 'multi', q: 'What is the sum of the following. 1 + 2 + 3 + ... + (n-1)',
        options: ['n(n-1)/2', 'n^2/2 + n/2', 'n(n+1)/2'], answer: [0],
        why: 'Use the formula with the last number, which is n − 1: (n − 1)(n − 1 + 1)/2 = n(n − 1)/2. The other two options are the same formula, n(n + 1)/2, for the sum up to n. Check with n = 4: 1 + 2 + 3 = 6 = 4 × 3 / 2.',
        lessons: ['02-analysis-of-algorithms'], skills: ['concept'], available_after: '02-analysis-of-algorithms', level: 2 },
      { q: 'For 20 dishes, how many seconds more does the careless method (15n² + 45n) need than the careful one (60n)?',
        options: ['1,200', '5,700', '6,900', '8,100'], answer: 1,
        why: 'Careless: 15 × 400 + 45 × 20 = 6,000 + 900 = 6,900 s. Careful: 20 × 60 = 1,200 s. The difference is 5,700 s. "6,900" is the careless time itself, and "1,200" the careful time.',
        lessons: ['02-analysis-of-algorithms'], skills: ['trace'], available_after: '02-analysis-of-algorithms', level: 2 },
      { q: 'A washer is a little less careless than slide 4: after washing each new dish, he dries only the <b>last two</b> washed dishes again (only one after dish 1). Washing and drying still take 30 s each. What is his growth function?',
        options: ['t(n) = 90n − 30, so O(n)', 't(n) = 15n² + 45n, so O(n²)', 't(n) = 60n, so O(n)', 't(n) = 120n, so O(n)'], answer: 0,
        why: 'Washing: 30n. Drying: 1 dish after dish 1, then 2 dishes after each of the other n − 1 dishes: 1 + 2(n − 1) = 2n − 1 drying actions, × 30 = 60n − 30. Total 30n + 60n − 30 = 90n − 30: linear, because the extra work per dish is fixed. The n² of slide 5 comes from drying <b>all</b> dishes, a number that keeps growing.',
        lessons: ['02-analysis-of-algorithms'], skills: ['complexity', 'trace'], available_after: '02-analysis-of-algorithms', level: 3 }
    ],
    1: [
      { q: 'What is the dominant term of t(n) = 7 + 3n + 0.5n²?',
        options: ['7', '3n', '0.5n²', '3n + 0.5n²'], answer: 2,
        why: 'The dominant term is the one that grows fastest: n² beats n and a constant, even with the small coefficient 0.5. The dominant term is one term, not a sum.',
        lessons: ['02-analysis-of-algorithms'], skills: ['concept'], available_after: '02-analysis-of-algorithms', level: 1 },
      { source: { assignment: 2, question: 8 },
        type: 'tf', q: 'Asymptotically both functions "n lg n" and "n^2 lg n" are the same.', answer: false,
        why: 'n² lg n = n × (n lg n): it is n times bigger, and n keeps growing. So they are in different categories. Only constant factors are dropped (like the 3 in 3 n lg n), never a factor that depends on n.',
        lessons: ['02-analysis-of-algorithms'], skills: ['concept'], available_after: '02-analysis-of-algorithms', level: 1 },
      { source: { assignment: 2, question: 2 },
        type: 'tf', q: 'Asymptotically both functions "lg n" and "ln n" are the same.', answer: true,
        why: 'lg n is log₂ n and ln n is the log with base e. They differ only by a constant factor: lg n ≈ 1.44 × ln n, for every n. Big-O drops constant factors (slide 10), so both are O(log n). That is also why slide 12 turns log n³ into O(log n).',
        lessons: ['02-analysis-of-algorithms'], skills: ['concept'], available_after: '02-analysis-of-algorithms', level: 2 },
      { q: 'What is the order of t(n) = n² + 1000 n log n?',
        options: ['O(n²)', 'O(n log n), because of the big coefficient 1000', 'O(n³ log n)', 'O(1000 n log n)'], answer: 0,
        why: 'Compare n² with n log n: n² = n × n and n log n = n × log n, and n grows much faster than log n. So n² is dominant, whatever the coefficient. Terms are compared, not multiplied, so there is no n³.',
        lessons: ['02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 2 },
      { source: { assignment: 2, question: 10 },
        type: 'match', q: 'Match the following.',
        pairs: [['2n^3 + 3n^2 - 5n + 12', 'O(n^3)'], ['3^n', 'exponential'], ['20', 'O(1)'], ['4 lg(n^5) + 5 lg(n^3) + 6 lg(n)', 'O(lg n)']],
        why: '2n³ + … : n³ is dominant. 3ⁿ has n in the exponent: exponential. 20 does not change with n: constant, O(1). The last one: lg(n⁵) = 5 lg n and lg(n³) = 3 lg n, so it is 20 lg n + 15 lg n + 6 lg n = 41 lg n, which is O(lg n).',
        lessons: ['02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 2 },
      { type: 'multi', q: 'Which growth functions are in the <b>same</b> Big-O category as t(n) = 4n² + n?',
        options: ['100n²', 'n² log n', 'n³ / n', 'n² + 2ⁿ', '(n + 1)²'], answer: [0, 2, 4],
        why: '4n² + n is O(n²). 100n² is O(n²) (drop 100). n³/n = n². (n + 1)² = n² + 2n + 1, also O(n²). n² log n grows faster by a factor log n, and n² + 2ⁿ is dominated by 2ⁿ.',
        lessons: ['02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 3 }
    ],
    2: [
      { q: 'An O(n) algorithm solves size N in one second. A CPU 6 times faster is used. What size can it solve in one second?',
        options: ['36N', '√6 × N', 'N + 6', '6N'], answer: 3,
        why: 'For a linear algorithm the work grows like n, so 6 times more steps means a 6 times bigger problem. √6 is the quadratic case and N + log₂ 6 the exponential case.',
        lessons: ['02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 1 },
      { type: 'tf', q: 'With a CPU 10 times faster, an O(2ⁿ) algorithm can solve problems about 10 times bigger in the same time.', answer: false,
        why: 'Slide 17: for O(2ⁿ) the size only grows from N to N + 3.32, because 2³·³² ≈ 10. Each extra 1 in n doubles the work, so a faster CPU helps very little.',
        lessons: ['02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 2 },
      { source: { assignment: 2, question: 5 },
        type: 'match', q: 'If 1 means best algorithm and 8 means worst algorithm, arrange the following from best to worst.',
        pairs: [['O(n)', '3'], ['O(1)', '1'], ['O(n^3)', '6'], ['O(lg n)', '2'], ['O(n lg n)', '4'], ['O(n^2)', '5'], ['O(2^n)', '7'], ['O(3^n)', '8']],
        why: 'The slower the growth, the better: constant, then lg n, n, n lg n, n², n³, then the exponentials. 3ⁿ is worse than 2ⁿ: 3ⁿ / 2ⁿ = 1.5ⁿ keeps growing, so they are not the same category.',
        lessons: ['02-analysis-of-algorithms'], skills: ['concept'], available_after: '02-analysis-of-algorithms', level: 2 },
      { q: 'An O(n³) algorithm solves size N in one hour. A CPU 27 times faster is used. What size can it solve in one hour?',
        options: ['27N', '3N', '9N', 'N + 27'], answer: 1,
        why: '(kN)³ = 27N³ gives k³ = 27, so k = 3. "9N" takes the square root (that is the O(n²) case). "27N" is the linear case.',
        lessons: ['02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 2 },
      { source: { assignment: 2, question: 9 },
        type: 'match', q: 'If a processor \'q\' can execute \'N\' instructions in time \'t\' by running the given algorithms below, how many instructions a processor \'p\', which is 16 times faster than the processor \'q\', can execute in the same time using the same algorithm.',
        pairs: [['linear', '16N'], ['quadratic', '4N'], ['cubic', '2.5N'], ['binary exponential', '4+N']],
        why: 'p does 16 times more steps. Linear: 16N. Quadratic: (kN)² = 16N², k = 4. Cubic: k³ = 16, k = ∛16 ≈ 2.5. Binary exponential (2ⁿ): 2^(N+k) = 16 × 2ᴺ, 2ᵏ = 16, k = 4, so N + 4. Same method as slides 16 and 17.',
        lessons: ['02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 3 }
    ],
    3: [
      { source: { assignment: 1, question: 24 },
        q: 'What is the usual time complexity of reading one element A[i] from an array?',
        options: ['O(log n)', 'O(1)', 'O(n log n)', 'O(n)'], answer: 1,
        why: 'An array keeps its cells next to each other, so Java finds A[i] directly from the index, without looking at the other cells. The time does not depend on n: O(1). O(n) would mean walking from the start.',
        lessons: ['01-introduction', '02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 1 },
      { source: { assignment: 1, question: 23 },
        q: 'What is the usual worst-case time complexity of searching for a value in an unsorted array of n elements?',
        options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], answer: 0,
        why: 'In an unsorted array the value can be anywhere, or nowhere. In the worst case the loop checks all n elements: one loop, O(1) body, n iterations = O(n). O(log n) needs a sorted array (binary search, later in the course).',
        lessons: ['01-introduction', '02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 1 },
      { source: { assignment: 1, question: 6 },
        q: 'What is the time complexity of finding the largest value in an unsorted array.',
        options: ['O(n lg n)', 'O(1)', 'O(n)', 'O(lg n)'], answer: 2,
        why: 'Every element must be compared once (any one of them could be the largest), so one loop of n iterations: O(n), like problem 1 of unit 1. Sorting first would cost more (n lg n), and O(1) or O(lg n) would skip elements.',
        lessons: ['01-introduction', '02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 1 },
      { type: 'trace', q: 'For the loop of slide 21 (count starts at 1, doubles while count &lt; n), fill in how many times the body runs.',
        code: 'int count = 1;\nwhile (count < n) {\n  count = count * 2;\n}',
        cols: ['n', 'iterations'], rows: [['2', '?1'], ['5', '?3'], ['16', '?4'], ['17', '?5']],
        why: 'n = 2: 1 → 2 (one time). n = 5: 1, 2, 4 → 8 (3 times). n = 16: 1, 2, 4, 8 → 16 (4 times = log₂ 16). n = 17: 16 &lt; 17 still, so one more: 5. The count is log₂ n, rounded up.',
        lessons: ['02-analysis-of-algorithms'], skills: ['trace'], available_after: '02-analysis-of-algorithms', level: 2 },
      { source: { assignment: 1, question: 2 },
        q: 'What is the time complexity of finding the smallest element in a sorted array?',
        options: ['O(1)', 'O(n)', 'O(lg n)'], answer: 0,
        why: 'In an array sorted from small to large, the smallest element is always A[0], so it is one read: O(1). (In descending order it is the last cell, still one read.) O(n) is the cost for an <b>unsorted</b> array, where every element must be checked.',
        lessons: ['01-introduction', '02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 2 },
      { source: { assignment: 2, question: 1 },
        q: 'What is the time complexity of the following function in terms of big-O.',
        code: 'void fun(int n) {\n  int i=2;\n  int j=3;\n  int k = i + j;\n  for(int i=0; i<100; i++) {\n    j++;\n  }\n}',
        options: ['O(1)', 'O(n lg n)', 'O(n^2)', 'O(n)'], answer: 0,
        why: 'The loop runs 100 times, and 100 does not depend on n: it is the same for n = 5 and n = 5 million. So all the work is constant: O(1). A loop is O(n) only when the number of iterations grows with n. (As written, Java would reject the second <code>int i</code>, but the question is about the time.)',
        lessons: ['02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 2 },
      { source: { assignment: 1, question: 4 },
        q: 'What is the time complexity of visiting every cell in an r by c matrix once?',
        options: ['O(1)', 'O(r + c)', 'O(r times c)', 'O(log r)'], answer: 2,
        why: 'Nested loops: the outer loop runs r times and the inner loop c times for each row, so r × c cells, each O(1) (slide 22). O(r + c) would only visit one row and one column.',
        lessons: ['01-introduction', '02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 2 },
      { source: { assignment: 2, question: 6 },
        q: 'What is the time complexity of the following function in terms of big-O.',
        code: 'void fun(int n) {\n  for (int i = n; i > 0; i /= 2) {\n    System.out.print("hello");\n  }\n  for (int j = 0; j < n; j++) {\n    System.out.print(j);\n  }\n}',
        options: ['O(1)', 'O(n)', 'O(n^2)', 'O(n lg n)'], answer: 1,
        why: 'The two loops come <b>one after the other</b>, not nested, so their costs are added: lg n (i is halved each time) + n. The dominant term is n: O(n). Multiplying would only be right for nested loops (that would give n lg n).',
        lessons: ['02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 2 },
      { source: { assignment: 2, question: 3 },
        q: 'What is the time complexity of the following function in terms of big-O.',
        code: 'void f1(int n) {\n  for (int i = 1; i < n; i *= 2) {\n    for (int j = 0; j < n; j++) {\n      System.out.print(i + j);\n    }\n  }\n}',
        options: ['O(n^2)', 'O(n lg n)', 'O(n)', 'O(1)'], answer: 1,
        why: 'The outer loop doubles i, so it runs lg n times (slide 21). For each of those, the inner loop runs n times. Nested loops multiply: lg n × n = O(n lg n). "O(n²)" thinks both loops run n times.',
        lessons: ['02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 3 }
    ],
    4: [
      { q: 'What is the time complexity of this loop? (printsum is the <b>first</b> version, with a loop inside, slide 24.)',
        code: 'for (int count = 1; count <= n; count++)\n  printsum(5);',
        options: ['O(n²)', 'O(5n²)', 'O(1)', 'O(n)'], answer: 3,
        why: 'printsum(5) always loops 5 times, whatever n is, so each call is O(1). n calls × O(1) = O(n). On slide 24 it was O(n²) only because the argument count grows up to n.',
        lessons: ['02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 2 },
      { q: 'And this loop? (Again the first printsum, with a loop inside.)',
        code: 'for (int count = 1; count <= n; count++)\n  printsum(n);',
        options: ['O(n)', 'O(n²)', 'O(n log n)', 'O(1)'], answer: 1,
        why: 'Each call printsum(n) loops n times: O(n). It is called n times, so n × n = n²: O(n²). Here every call costs the most, so the total is n², not n(n + 1)/2, but the order is the same.',
        lessons: ['02-analysis-of-algorithms'], skills: ['complexity'], available_after: '02-analysis-of-algorithms', level: 2 },
      { type: 'multi', q: 'Which statements about towerHanoi (slides 28 and 29) are true?',
        options: ['n == 1 is the base case: it prints one move and makes no recursive call', 'A call with n > 1 makes two recursive calls with n − 1', 'The number of calls is 2n − 1', 'The time complexity is O(2ⁿ)', 'Each call prints two moves'], answer: [0, 1, 3],
        why: 'Every call prints exactly one line: the base case prints disk 1, the other calls print disk n between the two recursive calls. The calls form a tree that doubles at each level: 2ⁿ − 1 calls (not 2n − 1), so O(2ⁿ).',
        lessons: ['02-analysis-of-algorithms'], skills: ['concept', 'complexity'], available_after: '02-analysis-of-algorithms', level: 2 },
      { q: '`towerHanoi(4, \'A\', \'B\', \'C\')` prints 15 lines. What is the 8th line?',
        options: ['Move disk 1 from A to C', 'Move disk 4 from C to B', 'Move disk 3 from A to C', 'Move disk 4 from A to B'], answer: 3,
        why: 'The call with n = 4 first runs towerHanoi(3, …), which prints 2³ − 1 = 7 lines. The next line, the 8th, is its own print: "Move disk 4 from A to B" (from, to). Then the second towerHanoi(3, …) prints 7 more: 7 + 1 + 7 = 15. Disk 4 never moves from C: it moves once, from A to B.',
        lessons: ['02-analysis-of-algorithms'], skills: ['trace'], available_after: '02-analysis-of-algorithms', level: 3 }
    ]
  }
});
