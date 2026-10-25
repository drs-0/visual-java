/* CS2 · Recursion: quick checks under the slides (1-2 per slide) and more part-quiz questions. */
addChecks({
  course: 'cs2', lesson: '09-recursion',
  slides: {
    1: [
      { type: 'tf', q: 'A recursive method calls itself.', answer: true, why: 'Each call solves a smaller version of the problem.' }
    ],
    3: [
      { type: 'fill', q: 'Complete the recursive definition.', lang: 'none', code: 'factorial(6) = 6 * factorial(___);\nfactorial(0) = ___;', answer: ['5', '1'], why: 'n! = n × (n − 1)!, and 0! = 1 is the base case.' }
    ],
    4: [
      { type: 'write', q: 'The base case is written. Add the line with the recursive call.', rows: 4, starter: 'public static long factorial(int n) {\n  if (n == 0) return 1;\n  \n}', checks: [{ re: /return\s+(n\s*\*\s*factorial\s*\(\s*n\s*-\s*1\s*\)|factorial\s*\(\s*n\s*-\s*1\s*\)\s*\*\s*n)\s*;/, label: 'return n * factorial(n - 1);' }], solution: 'public static long factorial(int n) {\n  if (n == 0) return 1;\n  return n * factorial(n - 1);\n}', why: 'Each call works on a smaller n, until n is 0.' }
    ],
    5: [
      { type: 'order', q: 'Put the steps of factorial(3) in order.', lang: 'none', lines: ['factorial(3)', '= 3 * factorial(2)', '= 3 * (2 * factorial(1))', '= 3 * (2 * (1 * factorial(0)))', '= 3 * (2 * (1 * 1))', '= 3 * (2 * 1)', '= 3 * 2', '= 6'], why: 'First the calls go down to factorial(0), then the results come back up.' }
    ],
    6: [
      { q: 'How many steps (calls and returns together) does factorial(2) take?', options: ['6', '3', '4'], answer: 0, why: 'Three calls (factorial(2), (1) and (0)) and three returns.' }
    ],
    7: [
      { type: 'match', q: 'Match each event with what happens to the runtime stack.', pairs: [['A method is called', 'The stack grows'], ['A method returns', 'The stack shrinks']], why: 'Each call gets its own space on the stack.' }
    ],
    8: [
      { q: 'main calls factorial(2). What is the largest number of frames on the stack?', options: ['4', '3', '2'], answer: 0, why: 'main, factorial(2), factorial(1) and factorial(0).' }
    ],
    9: [
      { type: 'trace', q: 'main calls factorial(3). What does each call return?', cols: ['call', 'returns'], rows: [['factorial(0)', '?1'], ['factorial(1)', '?1'], ['factorial(2)', '?2'], ['factorial(3)', '?6']], why: '1, then 1*1, 2*1 and 3*2.' }
    ],
    11: [
      { q: 'sum(n) = n + sum(n - 1), and sum(0) = 0. Which part is the smaller subproblem?', options: ['sum(n - 1)', 'n', 'sum(0) = 0'], answer: 0, why: 'It is the same problem, only smaller. sum(0) = 0 is the base case.' }
    ],
    12: [
      { type: 'bug', q: 'f(3) never stops. Tap the wrong line.', code: 'public static long f(int n) {\n  if (n == 0) return 1;\n  return n * f(n + 1);\n}', answer: 3, why: 'n + 1 goes away from the base case, so this is infinite recursion. It should be n - 1.' }
    ],
    13: [
      { type: 'trace', q: 'isPalindrome("level") calls itself. What is s in each call?', cols: ['call', 's'], rows: [['1st', 'level'], ['2nd', '?eve'], ['3rd', '?v']], why: 'Each call removes the first and the last character. "v" has length 1, so it returns true.' }
    ],
    14: [
      { type: 'trace', q: 'isPalindrome("racecar") calls the helper. What are low and high in each call?', cols: ['call', 'low', 'high'], rows: [['1st', '0', '6'], ['2nd', '?1', '?5'], ['3rd', '?2', '?4'], ['4th', '?3', '?3']], why: 'low >= high in the 4th call, so it returns true. No new substrings are made.' }
    ],
    16: [
      { q: 'The target is less than the middle element. What does binary search do next?', options: ['Search the first half', 'Search the second half', 'Return -1'], answer: 0, why: 'In a sorted array, smaller values are to the left of the middle.' }
    ],
    17: [
      { type: 'trace', q: 'binarySearch(new int[]{2, 4, 6, 8, 10, 12, 14}, 12). Fill in each call.', cols: ['call', 'low', 'high', 'mid'], rows: [['1st', '0', '6', '?3'], ['2nd', '?4', '?6', '?5']], why: 'array[3] is 8 and 12 > 8, so search the right half. array[5] is 12: it returns 5.' },
      { type: 'write', q: 'One line is missing. Write it.', rows: 8, starter: 'public static int binarySearch(int[] array, int target, int low, int high) {\n  if (low > high) return -1;\n  \n  if (target == array[mid]) return mid;\n  if (target < array[mid])\n    return binarySearch(array, target, low, mid-1);\n  return binarySearch(array, target, mid+1, high);\n}', checks: [{ re: /int\s+mid\s*=\s*\(\s*low\s*\+\s*high\s*\)\s*\/\s*2\s*;/, label: 'int mid = (low + high) / 2;' }], solution: 'public static int binarySearch(int[] array, int target, int low, int high) {\n  if (low > high) return -1;\n  int mid = (low + high) / 2;\n  if (target == array[mid]) return mid;\n  if (target < array[mid])\n    return binarySearch(array, target, low, mid-1);\n  return binarySearch(array, target, mid+1, high);\n}', why: 'mid is the middle index of the range.' }
    ],
    19: [
      { type: 'tf', q: 'In the Tower of Hanoi, you may put a bigger disk on a smaller disk for a moment.', answer: false, why: 'Rule 1: no disk can be on top of a smaller disk at any time.' }
    ],
    20: [
      { q: 'To move 3 disks from A to B, where do the top two disks go first?', options: ['To C', 'To B', 'They stay on A'], answer: 0, why: 'Tower C holds them, so disk 3 can go from A to B.' }
    ],
    21: [
      { q: 'Disk 3 is now on B. The two disks on C move to B. Which tower helps (the auxiliary)?', options: ['A', 'B', 'C'], answer: 0, why: 'A is the free tower now.' }
    ],
    22: [
      { type: 'order', q: 'Put the three steps for n disks in order.', lang: 'none', lines: ['Move the first n - 1 disks from A to C', 'Move disk n from A to B', 'Move the n - 1 disks from C to B'], why: 'Steps 1 and 3 are the recursive calls.' }
    ],
    23: [
      { type: 'output', q: 'With moveDisks of slide 23, what does this print?', code: 'moveDisks(1, \'A\', \'C\', \'B\');', answer: 'Move disk 1 from A to C', why: 'n is 1: the base case, with no recursive call.' }
    ],
    24: [
      { q: 'moveDisks prints 7 moves for 3 disks. How many does it print for 4 disks?', options: ['15', '8', '12'], answer: 0, why: '7 moves for the top 3 disks, 1 move for disk 4, and 7 more: 7 + 1 + 7 = 15.' }
    ],
    25: [
      { type: 'match', q: 'Match each one with how it repeats.', pairs: [['Iteration', 'With a loop'], ['Recursion', 'With method calls']], why: 'Every recursive solution can also be written with a loop.' },
      { type: 'tf', q: 'Recursion can use more memory than a loop.', answer: true, why: 'Each call needs space on the runtime stack for its parameters and local variables.' }
    ]
  },
  parts: {
    0: [
      { type: 'write', q: 'Write a recursive method sum(n) that returns 1 + 2 + … + n. The base case is sum(0) = 0.', rows: 4, checks: [{ re: /static\s+int\s+sum\s*\(\s*int\s+n\s*\)/, label: 'public static int sum(int n)' }, { re: /if\s*\(\s*n\s*==\s*0\s*\)\s*return\s+0\s*;/, label: 'if (n == 0) return 0;' }, { re: /return\s+(n\s*\+\s*sum\s*\(\s*n\s*-\s*1\s*\)|sum\s*\(\s*n\s*-\s*1\s*\)\s*\+\s*n)\s*;/, label: 'return n + sum(n - 1);' }], solution: 'public static int sum(int n) {\n  if (n == 0) return 0;\n  return n + sum(n - 1);\n}', why: 'The same shape as factorial, with + instead of *.' },
      { type: 'output', q: 'What does this print?', code: 'public static int p(int n) {\n  if (n == 0) return 1;\n  return 2 * p(n - 1);\n}\n// in main:\nSystem.out.println(p(4));', answer: '16', why: '2 * 2 * 2 * 2 * 1 = 16.' },
      { type: 'output', q: 'What does up(3) print?', code: 'public static void up(int n) {\n  if (n == 0) return;\n  up(n - 1);\n  System.out.println(n);\n}', answer: '1\n2\n3', why: 'The println runs after the recursive call returns, so the smallest n prints first.' }
    ],
    1: [
      { type: 'output', q: 'With isPalindrome of slide 13, what does this print?', code: 'System.out.println(isPalindrome("abca"));', answer: 'false', why: 'The ends are both a, but then "bc" has different ends.' },
      { type: 'output', q: 'What does this print?', code: 'public static int digits(int n) {\n  if (n < 10) return 1;\n  return 1 + digits(n / 10);\n}\n// in main:\nSystem.out.println(digits(4096));', answer: '4', why: '4096, 409, 40, 4: four calls, one for each digit.' },
      { type: 'write', q: 'Write the body of the short isPalindrome, so it calls the helper on the whole string.', rows: 3, starter: 'public static boolean isPalindrome(String s) {\n  \n}', checks: [{ re: /return\s+isPalindrome\s*\(\s*s\s*,\s*0\s*,\s*s\s*\.\s*length\s*\(\s*\)\s*-\s*1\s*\)\s*;/, label: 'return isPalindrome(s, 0, s.length() - 1);' }], solution: 'public static boolean isPalindrome(String s) {\n  return isPalindrome(s, 0, s.length() - 1);\n}', why: 'low starts at the first index and high at the last index.' }
    ],
    2: [
      { type: 'write', q: 'The two recursive calls of moveDisks are missing. Write them in the empty lines.', rows: 9, starter: 'public static void moveDisks(int n, char from, char to, char aux) {\n  if (n == 1)\n    System.out.printf("Move disk 1 from %c to %c%n", from, to);\n  else {\n    \n    System.out.printf("Move disk %d from %c to %c%n", n, from, to);\n    \n  }\n}', checks: [{ re: /moveDisks\s*\(\s*n\s*-\s*1\s*,\s*from\s*,\s*aux\s*,\s*to\s*\)\s*;\s*System\s*\.\s*out\s*\.\s*printf\s*\(\s*"Move disk %d/, label: 'moveDisks(n-1, from, aux, to); before the printf' }, { re: /n\s*,\s*from\s*,\s*to\s*\)\s*;\s*moveDisks\s*\(\s*n\s*-\s*1\s*,\s*aux\s*,\s*to\s*,\s*from\s*\)\s*;/, label: 'moveDisks(n-1, aux, to, from); after the printf' }], solution: 'public static void moveDisks(int n, char from, char to, char aux) {\n  if (n == 1)\n    System.out.printf("Move disk 1 from %c to %c%n", from, to);\n  else {\n    moveDisks(n-1, from, aux, to);\n    System.out.printf("Move disk %d from %c to %c%n", n, from, to);\n    moveDisks(n-1, aux, to, from);\n  }\n}', why: 'First the n - 1 disks go to aux, then disk n goes to the target, then the n - 1 disks go from aux to the target.' },
      { type: 'output', q: 'With binarySearch of slide 17, what does this print?', code: 'System.out.println(binarySearch(new int[]{5, 10, 15, 20, 25, 30}, 10));', answer: '1', why: 'mid 2 (15): go left. mid 0 (5): go right. mid 1 is 10: it returns 1.' },
      { q: 'moveDisks(3, \'A\', \'B\', \'C\') runs. Which call does it make first?', options: ['moveDisks(2, \'A\', \'C\', \'B\')', 'moveDisks(2, \'C\', \'B\', \'A\')', 'moveDisks(1, \'A\', \'B\', \'C\')'], answer: 0, why: 'moveDisks(n-1, from, aux, to): the top two disks go from A to C.' }
    ]
  }
});
