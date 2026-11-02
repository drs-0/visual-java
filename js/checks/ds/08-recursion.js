/* Data Structures · Unit 8 Recursion: questions under the slides and the part quizzes.
   Every question has lessons, skills, available_after and level (1 easy, 2 middle, 3 hard, never harder than the
   instructor's). source = the instructor's own question (Assignment 5), copied word for word with his answer.
   No checks on the cover (1) and on the slides that only give links (23, 31). Numbers differ from the drawing presets
   and from the instructor's questions. */
addChecks({
  course: 'ds', lesson: '08-recursion',
  slides: {
    2: [
      { q: 'What is recursion in programming?',
        options: ['A loop that runs a fixed number of times', 'A technique in which a method calls itself to do its job', 'A method that calls another class', 'Running two methods at the same time'], answer: 1,
        why: 'Slide 2: recursion is a technique in which a method can call itself to fulfill its purpose: something defined in terms of itself.',
        lessons: ['08-recursion'], skills: ['concept'], available_after: '08-recursion', level: 1 }
    ],
    3: [
      { q: 'What is the <b>base case</b> of a recursive definition?',
        options: ['The first call of the method', 'The non-recursive part, answered directly, which stops the recursion', 'The biggest value of the parameter', 'The part that calls the method again'], answer: 1,
        why: 'Slide 3: the non-recursive part is called the base case. Without it, nothing stops the calls.',
        lessons: ['08-recursion'], skills: ['concept'], available_after: '08-recursion', level: 1 },
      { type: 'tf', q: 'A recursive definition without a non-recursive part causes infinite recursion, much like an infinite loop.', answer: true,
        why: 'Slide 3: with no base case there is no way to end the recursive path. The definition keeps "looping" by calling itself.',
        lessons: ['08-recursion'], skills: ['concept'], available_after: '08-recursion', level: 1 }
    ],
    4: [
      { type: 'output', q: 'What does `down(2)` print?',
        code: 'static void down(int n) {\n  if (n == 0) {\n    System.out.println("done");\n    return;\n  }\n  System.out.println(n);\n  down(n - 1);\n}',
        answer: '2\n1\ndone',
        why: 'down(2) prints 2 and calls down(1), which prints 1 and calls down(0). That is the base case: it prints "done" and returns without another call.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 1 },
      { q: 'In Java, what finally happens when a method keeps calling itself with no base case?',
        options: ['It runs forever without any problem', 'The compiler refuses the method', 'Every call takes memory for its own parameters, so the program finally stops with a StackOverflowError', 'It returns 0'], answer: 2,
        why: 'Each call sets up a new execution environment (slide 11) that waits on the call stack. The stack is finite, so endless calls fill it and Java stops the program. The compiler does not check for a base case.',
        lessons: ['08-recursion'], skills: ['concept', 'edge_case'], available_after: '08-recursion', level: 2 }
    ],
    5: [
      { q: 'Using the recursive definition of slide 5, which line is correct?',
        options: ['5! = 5 + 4!', '5! = 5 * 4', '5! = 5 * 4!', '5! = 4 * 5!'], answer: 2,
        why: 'N! = N * (N − 1)!, so 5! = 5 * 4!. The factorial on the right is smaller, which is what moves the definition towards the base case 1! = 1.',
        lessons: ['08-recursion'], skills: ['concept'], available_after: '08-recursion', level: 1 }
    ],
    6: [
      { q: 'f(x) = 3x + 5 if x &gt; 10, otherwise f(x) = f(x + 2) − 3. What is f(8)?',
        options: ['29', '35', '38', '41'], answer: 1,
        why: 'f(8) = f(10) − 3 and f(10) = f(12) − 3. 12 &gt; 10, so f(12) = 3·12 + 5 = 41. Going back: f(10) = 38, f(8) = 35.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 2 }
    ],
    7: [
      { q: 'Slide 7 reaches f(11) = 38, but f(5) is "not determined yet". Why?',
        options: ['Because f(11) is wrong', 'Because each call is still waiting for the result of the call it made; the answers must now be passed back up', 'Because f(5) is a base case', 'Because we need f(13) as well'], answer: 1,
        why: 'f(5) needs f(7), which needs f(9), which needs f(11). Only f(11) has an answer so far. The waiting calls finish one by one on the way back (slide 8).',
        lessons: ['08-recursion'], skills: ['concept'], available_after: '08-recursion', level: 1 }
    ],
    8: [
      { q: 'With the same f(x), what is f(6)?',
        options: ['32', '35', '29', '26'], answer: 0,
        why: 'f(6) = f(8) − 3, f(8) = f(10) − 3, f(10) = f(12) − 3, f(12) = 41. Working backwards: f(10) = 38, f(8) = 35, f(6) = 32.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 2 }
    ],
    9: [
      { q: 'How many calls of f are in the series of calls for f(4)?',
        options: ['4', '3', '5', '6'], answer: 2,
        why: 'f(4) → f(6) → f(8) → f(10) → f(12). x grows by 2 each time and the first value above 10 is 12: 5 calls, all waiting until f(12) answers.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 2 }
    ],
    10: [
      { type: 'output', q: 'This method has the same shape as fun on slide 10. What does it print?',
        code: 'public static int fun(int x) {\n  if (x > 6)\n    return 2 * x;\n  else\n    return fun(x + 3) - 1;\n}\npublic static void main(String[] args) {\n  System.out.println(fun(1));\n}',
        answer: '12',
        why: 'fun(1) = fun(4) − 1 and fun(4) = fun(7) − 1. 7 &gt; 6, so fun(7) = 14. Back up: fun(4) = 13, fun(1) = 12.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 2 },
      { type: 'tf', q: 'In `return fun(x + 2) - 3;` the subtraction happens only after the call fun(x + 2) has returned its value.', answer: true,
        why: 'Java needs the value of fun(x + 2) before it can subtract 3, so the current call waits. That is why the calls finish in reverse order.',
        lessons: ['08-recursion'], skills: ['concept'], available_after: '08-recursion', level: 1 }
    ],
    11: [
      { q: 'During sum(3), at the deepest moment, how many separate copies of the parameter n exist at the same time?',
        options: ['1', '3', '4', '0'], answer: 2,
        why: 'Each call has its own n (slide 11): sum(3), sum(2), sum(1) and sum(0) are all active when the base case runs. Four calls, four copies of n.',
        lessons: ['08-recursion'], skills: ['trace', 'concept'], available_after: '08-recursion', level: 2 }
    ],
    12: [
      { q: '"The sum of 1 to N is N plus the sum of 1 to N − 1." Which return statement says this?',
        options: ['return sum(n) + n - 1;', 'return n + sum(n + 1);', 'return sum(n - 1);', 'return n + sum(n - 1);'], answer: 3,
        why: 'N plus the sum of the smaller problem: n + sum(n − 1). sum(n + 1) moves away from the base case, and sum(n) would call itself with the same value forever.',
        lessons: ['08-recursion'], skills: ['concept'], available_after: '08-recursion', level: 1 }
    ],
    13: [
      { type: 'fill', lang: 'text', q: 'Complete the two rules of slide 13.',
        code: 'sum(n) = sum(___) + n     recursive step\nsum(0) = ___              base step',
        answer: ['n-1|n - 1', '0'],
        why: 'The recursive step uses the smaller problem sum(n − 1), and the base step answers the smallest one directly: the sum of no numbers is 0.',
        lessons: ['08-recursion'], skills: ['concept'], available_after: '08-recursion', level: 1 }
    ],
    14: [
      { type: 'output', q: 'With the sum method of slide 14, what does `System.out.println(sum(6));` print?',
        code: 'public static int sum(int n) {\n  if (n == 0)\n    return 0;\n  else\n    return sum(n - 1) + n;\n}',
        answer: '21',
        why: 'sum(6) = sum(5) + 6 = … = 0 + 1 + 2 + 3 + 4 + 5 + 6 = 21.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 1 },
      { q: 'The user enters −3. What does the program of slide 14 do?',
        options: ['It prints 0', 'It prints −6', 'n goes −4, −5, … and never reaches 0, so the program ends with a StackOverflowError', 'It prints 6'], answer: 2,
        why: 'The base case tests only n == 0. From −3, n − 1 moves away from 0 for ever. A safer base case would be <code>if (n &lt;= 0)</code>.',
        lessons: ['08-recursion'], skills: ['edge_case', 'bug'], available_after: '08-recursion', level: 2 }
    ],
    15: [
      { q: 'Why would we usually <b>not</b> use recursion for the sum of 1 to N?',
        options: ['Because recursion cannot compute sums', 'Because the loop is easier to understand, and a formula even gives the answer without a loop', 'Because recursion always gives a wrong answer for sums', 'Because Java has no recursion'], answer: 1,
        why: 'Slide 15: the iterative version is easier to understand, and n(n + 1)/2 computes it with no loop at all. Recursion works, it is just not the best tool here.',
        lessons: ['08-recursion'], skills: ['design'], available_after: '08-recursion', level: 1 }
    ],
    16: [
      { type: 'multi', q: 'Which statements about recursion and iteration are true (slide 16)?',
        options: ['Every recursive solution has a matching iterative solution', 'Recursion has the overhead of many method calls', 'A recursive solution is always faster than a loop', 'For some problems the recursive solution is simpler and more elegant'], answer: [0, 1, 3],
        why: 'Slide 16 says all three, and also that a recursive solution may be <b>less</b> efficient, so "always faster" is wrong.',
        lessons: ['08-recursion'], skills: ['concept'], available_after: '08-recursion', level: 2 }
    ],
    17: [
      { q: 'With factorial(n) = n * factorial(n − 1) and factorial(1) = 1, how many multiplications are done to get factorial(5)?',
        options: ['5', '4', '3', '6'], answer: 1,
        why: '5 * 4!, 4 * 3!, 3 * 2!, 2 * 1!: four multiplications. factorial(1) is the base step and multiplies nothing.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 2 }
    ],
    18: [
      { type: 'output', q: 'With facto of slide 18, what does `System.out.println(facto(5));` print?',
        code: 'public static int facto(int n) {\n  if (n == 1)\n    return 1;\n  else\n    return facto(n - 1) * n;\n}',
        answer: '120',
        why: 'facto(5) = facto(4) * 5 = 24 * 5 = 120. The multiplications happen on the way back: 1 · 2 · 3 · 4 · 5.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 1 },
      { q: 'In `return(facto (n-1)*n);`, what happens first?',
        options: ['The multiplication by n', 'The call facto(n − 1), which must return before the multiplication can be done', 'Both at the same time', 'The return'], answer: 1,
        why: 'The value of facto(n − 1) is needed to multiply, so each call waits for the inner call. The deepest call (facto(1)) finishes first.',
        lessons: ['08-recursion'], skills: ['concept'], available_after: '08-recursion', level: 2 }
    ],
    19: [
      { q: 'Fib(0) = 0, Fib(1) = 1, Fib(n) = Fib(n − 1) + Fib(n − 2). What is Fib(7)?',
        options: ['8', '21', '13', '11'], answer: 2,
        why: 'The sequence is 0, 1, 1, 2, 3, 5, 8, 13: counting from index 0, the value at index 7 is 13.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 1 },
      { q: 'Why does the Fibonacci definition need <b>two</b> base cases?',
        options: ['It does not; one is just for speed', 'Because Fib(n) uses the two values before it: with only Fib(0), Fib(1) would need Fib(−1) and never stop', 'Because Fib grows fast', 'Because n must be even'], answer: 1,
        why: 'The recursive step goes down by 1 and by 2. Starting at 1, a step of 2 would jump past 0, so Fib(1) must also be answered directly. The code does both at once with <code>if (n &lt;= 1) return n;</code>.',
        lessons: ['08-recursion'], skills: ['concept', 'edge_case'], available_after: '08-recursion', level: 2 }
    ],
    20: [
      { q: 'With the Fib method of slide 20, what does Fib(6) return?',
        options: ['5', '8', '13', '6'], answer: 1,
        why: 'Fib(6) = Fib(5) + Fib(4) = 5 + 3 = 8.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 1 },
      { q: 'Why is this Fib method slow for big n?',
        options: ['Because of the if statement', 'Because each call makes two more calls, so the same values are computed again and again and the calls grow very fast', 'Because int is too small', 'Because it uses a loop inside'], answer: 1,
        why: 'The tree of calls on slide 20 doubles at each level and repeats work: Fib(5) computes Fib(3) twice and Fib(2) three times. Remembering the values (memoization, slide 23) avoids this.',
        lessons: ['08-recursion'], skills: ['complexity'], available_after: '08-recursion', level: 2 }
    ],
    21: [
      { q: 'A recursive method is called n times, and each call (not counting its recursive call) does O(1) work. What is the order of the whole solution?',
        options: ['O(1)', 'O(n)', 'O(n²)', 'O(2ⁿ)'], answer: 1,
        why: 'Slide 21: order of the body × number of calls = O(1) × n = O(n), like the recursive sum.',
        lessons: ['08-recursion', '02-analysis-of-algorithms'], skills: ['complexity'], available_after: '08-recursion', level: 1 },
      { q: 'A recursive method is called n times, and each call also runs a loop of n steps. What is the order?',
        options: ['O(n)', 'O(n²)', 'O(2ⁿ)', 'O(log n)'], answer: 1,
        why: 'The body is now O(n), and it runs n times: O(n) × n = O(n²). It is the same rule as for nested loops.',
        lessons: ['08-recursion', '02-analysis-of-algorithms'], skills: ['complexity'], available_after: '08-recursion', level: 2 }
    ],
    22: [
      { q: 'The Towers of Hanoi need 2<sup>n</sup> − 1 moves for n disks. How many moves for 5 disks?',
        options: ['10', '25', '31', '32'], answer: 2,
        why: '2⁵ − 1 = 32 − 1 = 31.',
        lessons: ['08-recursion'], skills: ['complexity'], available_after: '08-recursion', level: 1 },
      { q: 'Going from 20 to 21 disks, about how does the number of moves change?',
        options: ['It grows by 1', 'It grows by 21', 'It about doubles', 'It stays the same'], answer: 2,
        why: '2²¹ − 1 is about twice 2²⁰ − 1: one more disk means doing the whole (n − 1)-disk job twice, plus one move. That is exponential growth, O(2ⁿ).',
        lessons: ['08-recursion', '02-analysis-of-algorithms'], skills: ['complexity'], available_after: '08-recursion', level: 2 }
    ],
    24: [
      { q: 'Disks are numbered by size (1 is the smallest). Peg B holds disk 2, and peg C holds disk 4. Which move is <b>not</b> allowed?',
        options: ['Disk 1 onto peg B', 'Disk 3 onto peg B', 'Disk 1 onto peg C', 'Disk 3 onto peg C'], answer: 1,
        why: 'The rule: no bigger disk on top of a smaller disk. Disk 3 is bigger than disk 2, so it cannot go onto B. Disk 3 onto disk 4 is fine, and disk 1 can go anywhere.',
        lessons: ['08-recursion'], skills: ['concept'], available_after: '08-recursion', level: 1 }
    ],
    25: [
      { q: 'Which moves take 2 disks from A to C?',
        options: ['A → C, A → B, B → C', 'A → B, A → C, B → C', 'A → B, B → C, A → C', 'A → C, A → C'], answer: 1,
        why: 'The small disk gets out of the way on B, the big disk goes to C, then the small disk goes on top of it. The other orders put the big disk on the small one or move the wrong disk.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 1 }
    ],
    26: [
      { type: 'order', q: 'Put the three steps in order to move n disks from A to C (slide 26).',
        lines: ['Move n − 1 disks from A to B', 'Move disk n from A to C', 'Move n − 1 disks from B to C'],
        why: 'Disk n is at the bottom, so the n − 1 disks above it must first go to B. Then disk n moves to C, and the n − 1 disks come back on top of it. Steps 1 and 3 are smaller Hanoi problems: that is the recursion.',
        lessons: ['08-recursion'], skills: ['design'], available_after: '08-recursion', level: 1 }
    ],
    27: [
      { q: 'In the 4-disk example, where are disks 1, 2 and 3 at the moment disk 4 moves from A to C?',
        options: ['On A, under disk 4', 'On C', 'All on B', 'Spread over B and C'], answer: 2,
        why: 'Step 1 moves the n − 1 = 3 smaller disks from A to B. Only then is disk 4 free, and C must be empty to receive it.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 2 }
    ],
    28: [
      { q: 'In the 4-disk example, how many moves happen before disk 4 moves?',
        options: ['3', '7', '8', '4'], answer: 1,
        why: 'Moving 3 disks from A to B is a 3-disk Hanoi: 2³ − 1 = 7 moves. Disk 4 makes move number 8.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 2 }
    ],
    29: [
      { q: 'How many moves does the whole 4-disk example take?',
        options: ['8', '16', '14', '15'], answer: 3,
        why: '7 moves for 3 disks to B, 1 move for disk 4, 7 moves for the 3 disks to C: 15 = 2⁴ − 1.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 1 }
    ],
    30: [
      { q: 'For `move(3, \'A\', \'C\', \'B\')` (slide 30), what is the 4th line printed?',
        options: ['Move from A to B', 'Move from A to C', 'Move from B to C', 'Move from C to B'], answer: 1,
        why: 'The first 3 lines move the 2 small disks from A to B (A → C, A → B, C → B). The 4th line is the middle step of the first call: the big disk from A to C.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 2 },
      { type: 'output', q: 'With the move method of slide 30, what does `move(2, \'B\', \'A\', \'C\');` print?',
        code: 'public static void move(int n, char start, char finish, char buf) {\n  if (n == 1)\n    System.out.println("Move from " + start + " to " + finish);\n  else {\n    move(n - 1, start, buf, finish);\n    System.out.println("Move from " + start + " to " + finish);\n    move(n - 1, buf, finish, start);\n  }\n}',
        answer: 'Move from B to C\nMove from B to A\nMove from C to A',
        why: 'start = B, finish = A, buf = C. move(1, B, C, A) puts the small disk on C; then the big disk goes B → A; then move(1, C, A, B) brings the small disk onto A.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 2 }
    ]
  },
  parts: {
    0: [
      { type: 'tf', q: 'Every recursive definition must have a non-recursive part.', answer: true,
        why: 'Slide 3: all recursive definitions must have a non-recursive part, the base case, or the recursion never ends.',
        lessons: ['08-recursion'], skills: ['concept'], available_after: '08-recursion', level: 1 },
      { type: 'output', q: 'What does `show(1)` print?',
        code: 'static void show(int n) {\n  if (n > 3) return;\n  System.out.println(n);\n  show(n + 1);\n}',
        answer: '1\n2\n3',
        why: 'show(1), show(2) and show(3) print their n and call with n + 1. show(4) is the base case (4 &gt; 3): it returns and prints nothing. Here the parameter goes <b>up</b> towards the base case.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 1 },
      { q: 'Which method stops for every n ≥ 0?',
        options: ['void g(int n) { if (n == 0) return; g(n - 1); }', 'void g(int n) { g(n - 1); if (n == 0) return; }', 'void g(int n) { if (n == 0) return; g(n + 1); }', 'void g(int n) { if (n == 0) return; g(n); }'], answer: 0,
        why: 'A base case only helps if it is checked <b>before</b> the next call and the calls move towards it. The second method calls itself before the test; the third moves away from 0; the fourth never changes n.',
        lessons: ['08-recursion'], skills: ['bug', 'edge_case'], available_after: '08-recursion', level: 2 },
      { q: 'How many times is `t` called (counting the first call) by `t(7)`?',
        code: 'static void t(int n) {\n  if (n <= 0) return;\n  t(n - 2);\n}',
        options: ['3', '4', '5', '7'], answer: 2,
        why: 't(7) → t(5) → t(3) → t(1) → t(−1). The last call is the base case (−1 &lt;= 0). Five calls. A test of n == 0 instead would never stop, because n skips 0.',
        lessons: ['08-recursion'], skills: ['trace', 'edge_case'], available_after: '08-recursion', level: 2 }
    ],
    1: [
      { q: 'Using N! = N * (N − 1)! and 1! = 1, what is 3!?',
        options: ['3', '6', '9', '27'], answer: 1,
        why: '3! = 3 * 2! = 3 * 2 * 1! = 3 * 2 * 1 = 6.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 1 },
      { q: 'f(x) = 3x + 5 if x &gt; 10, otherwise f(x) = f(x + 2) − 3. What is f(3)?',
        options: ['26', '29', '14', '23'], answer: 0,
        why: 'f(3) = f(5) − 3, and slide 8 found f(5) = 29. So f(3) = 26. Every step back down subtracts 3.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 2 },
      { type: 'output', q: 'What does this print?',
        code: 'static int g(int x) {\n  if (x >= 20) return x;\n  return g(2 * x) + 1;\n}\npublic static void main(String[] args) {\n  System.out.println(g(3));\n}',
        answer: '27',
        why: 'g(3) → g(6) → g(12) → g(24). 24 &gt;= 20, so g(24) = 24. Each waiting call adds 1 on the way back: g(12) = 25, g(6) = 26, g(3) = 27.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 2 },
      { source: { assignment: 5, question: 9 },
        q: 'A number game uses the following code:',
        code: 'int f(int n)\n{\n  if (n < 10) return n;\n  return f(n / 10) - n % 10;\n}',
        ask: 'What is f(572)?',
        options: ['0', '4', '-4', '10'], answer: 2,
        why: 'f(572) = f(57) − 2, f(57) = f(5) − 7, and f(5) = 5 (5 &lt; 10). Back up: f(57) = 5 − 7 = −2, f(572) = −2 − 2 = −4. "4" forgets the signs; "0" is 5 − 7 + 2, adding the last digit instead of subtracting it.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 2 },
      { q: 'A student changes the recursive step of slide 6 to f(x) = f(x − 2) − 3 (the base case stays x &gt; 10). What happens with f(5)?',
        options: ['It returns 29 as before', 'It returns 20', 'x goes 3, 1, −1, … and never passes 10: infinite recursion', 'It returns 3·5 + 5'], answer: 2,
        why: 'The base case is reached only when x grows past 10, but now each call makes x smaller. The calls move away from the base case and never stop.',
        lessons: ['08-recursion'], skills: ['bug', 'edge_case'], available_after: '08-recursion', level: 2 },
      { q: 'With fun of slide 10, what is fun(−4)?',
        options: ['20', '17', '38', '14'], answer: 1,
        why: 'x goes −4, −2, 0, 2, 4, 6, 8, 10, 12: eight recursive steps, then the base case fun(12) = 3·12 + 5 = 41. Each step subtracts 3 on the way back: 41 − 8·3 = 17.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 3 }
    ],
    2: [
      { type: 'tf', q: 'A recursive solution always runs faster than the matching loop.', answer: false,
        why: 'Slide 16: a recursive solution may be less efficient, because every call costs time and memory (the overhead of method invocations).',
        lessons: ['08-recursion'], skills: ['concept'], available_after: '08-recursion', level: 1 },
      { source: { assignment: 5, question: 1 },
        q: 'A developer writes the following code:',
        code: 'int sum(int n)\n{\n  if (n == 0) return 0;\n  return n + sum(n--);\n}',
        ask: 'For positive n, what is the problem? Assume Java semantics and a finite call stack.',
        options: ['The method correctly sums 1 through n', 'It skips every second integer', 'It returns n because n becomes zero before the call', 'The recursive call receives the original n, eventually causing stack overflow'], answer: 3,
        why: '<code>n--</code> is a post-decrement: its value is the <b>old</b> n, and n is decreased only afterwards. So sum(n) calls sum(n) with the same value again and again; the base case is never reached and the call stack overflows. The slide writes <code>sum(n-1)</code>, which passes a smaller value.',
        lessons: ['08-recursion'], skills: ['bug'], available_after: '08-recursion', level: 2 },
      { type: 'output', q: 'What does `System.out.println(s(4071));` print?',
        code: 'static int s(int n) {\n  if (n == 0) return 0;\n  return n % 10 + s(n / 10);\n}',
        answer: '12',
        why: 'n % 10 is the last digit and n / 10 drops it: 1 + s(407) = 1 + 7 + s(40) = 1 + 7 + 0 + s(4) = 1 + 7 + 0 + 4 + s(0) = 12. The method adds up the digits.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 2 },
      { type: 'output', q: 'What does `r(1203)` print?',
        code: 'static void r(int n) {\n  if (n < 10) {\n    System.out.print(n);\n    return;\n  }\n  System.out.print(n % 10);\n  r(n / 10);\n}',
        answer: '3021',
        why: 'Each call prints its last digit <b>before</b> the recursive call: 3, then r(120) prints 0, r(12) prints 2, and r(1) is the base case: 1. The digits come out in reverse.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 2 },
      { source: { assignment: 5, question: 2 },
        q: 'A secret decoder uses the following code:',
        code: 'String decode(String s)\n{\n  if (s.length() <= 1) return s;\n  return decode(s.substring(1)) + s.charAt(0);\n}',
        ask: 'What is decode("LEVEL")?',
        options: ['LEVE', 'LEVELLEVEL', 'LEVEL', 'An infinite recursion'], answer: 2,
        why: 'Each call puts its first character <b>after</b> the decoded rest, so decode reverses the string: decode("EVEL") + \'L\', and so on. LEVEL is a palindrome, so its reverse is LEVEL again. The string gets shorter each call, so the recursion ends at length 1.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 2 },
      { source: { assignment: 5, question: 5 },
        q: 'A palindrome checker uses the following code:',
        code: 'boolean p(String s, int l, int r)\n{\n  if (l >= r) return true;\n  return s.charAt(l) == s.charAt(r) && p(s, l + 1, r - 1);\n}',
        ask: 'What is the maximum number of simultaneously active p calls for p("racecar", 0, 6), including the initial and base-case calls?',
        options: ['7', '3', '8', '4'], answer: 3,
        why: 'The calls are p(0, 6), p(1, 5), p(2, 4) and p(3, 3). Each pair of characters matches, so each call waits for the next one, and p(3, 3) is the base case (l &gt;= r). All four are active at the same time. "7" counts characters, not calls: each call checks two of them.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 3 }
    ],
    3: [
      { type: 'tf', q: 'The base step of the factorial method on slide 18 is reached when n == 1.', answer: true,
        why: '<code>if(n == 1) return (1);</code>: factorial(1) = 1 (slide 17).',
        lessons: ['08-recursion'], skills: ['concept'], available_after: '08-recursion', level: 1 },
      { q: 'What is Fib(8)?',
        options: ['13', '21', '34', '8'], answer: 1,
        why: '0, 1, 1, 2, 3, 5, 8, 13, 21: Fib(8) = Fib(7) + Fib(6) = 13 + 8 = 21.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 1 },
      { q: 'What happens when facto of slide 18 is called with 0?',
        options: ['It returns 1', 'It returns 0', 'n goes 0, −1, −2, … and never equals 1, so the program ends with a StackOverflowError', 'It does not compile'], answer: 2,
        why: 'The base case tests n == 1 only, and from 0 the calls go down, away from 1. (In math 0! = 1, but this method has no base case for 0.)',
        lessons: ['08-recursion'], skills: ['edge_case'], available_after: '08-recursion', level: 2 },
      { q: 'What does `pw(3, 4)` return, and how many calls of pw are made in total?',
        code: 'static int pw(int b, int e) {\n  if (e == 0) return 1;\n  return b * pw(b, e - 1);\n}',
        options: ['81 and 4 calls', '81 and 5 calls', '12 and 5 calls', '64 and 4 calls'], answer: 1,
        why: 'pw(3,4) → pw(3,3) → pw(3,2) → pw(3,1) → pw(3,0): 5 calls, the last one the base case. Back up: 1, 3, 9, 27, 81. Like facto, it is O(n) in the exponent.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 2 },
      { source: { assignment: 5, question: 8 },
        q: 'A programmer uses the following code:',
        code: 'int fib(int n)\n{\n  if (n <= 1) return n;\n  return fib(n - 1) + fib(n - 2);\n}',
        ask: 'During fib(5), how many times is fib(2) called?',
        options: ['5', '2', '3', '4'], answer: 2,
        why: 'fib(5) calls fib(4) and fib(3). fib(4) calls fib(3) and fib(2) (one). Each of the two fib(3) calls makes one fib(2) call (two more). Total 3, exactly the fib(2) boxes in the tree of slide 20. The same value is computed again and again.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 2 },
      { q: 'With the Fib method of slide 20, how many calls in total does Fib(4) make (counting the first call)?',
        options: ['5', '7', '9', '4'], answer: 2,
        why: 'Fib(4) → Fib(3) + Fib(2). Fib(3) → Fib(2) + Fib(1); each Fib(2) → Fib(1) + Fib(0). Count: Fib(4) 1, Fib(3) 1, Fib(2) 2, Fib(1) 3, Fib(0) 2 = 9.',
        lessons: ['08-recursion'], skills: ['trace', 'complexity'], available_after: '08-recursion', level: 3 },
      { source: { assignment: 5, question: 4 },
        q: 'Consider two factorial methods for n >= 0, ignoring arithmetic overflow:',
        code: 'Method A:\nlong fact(int n)\n{\n  if (n == 0) return 1;\n  return n * fact(n - 1);\n}\nMethod B:\nlong factTail(int n, long acc)\n{\n  if (n == 0) return acc;\n  return factTail(n - 1, acc * n);\n}',
        ask: 'Method B is initially called with acc = 1. Which statement correctly compares their recursion and computational efficiency?',
        options: ['A is tail recursive because multiplication appears in the return statement; B is not', 'B takes Theta(log n) time because the accumulator avoids repeated multiplication', 'B always uses constant stack space in Java, while A uses Theta(n) stack space', 'B is tail recursive because no work remains after its recursive call; both take Theta(n) time, and B can use constant stack space if tail-call optimization is supported'], answer: 3,
        why: 'In A, the multiplication <code>n * …</code> must wait until fact(n − 1) returns, so work remains after the call. In B the recursive call is the very last thing: that is "tail recursion". Both make n + 1 calls with O(1) work each: Θ(n) (slide 21). Only a language that reuses the stack frame for a tail call (tail-call optimization) makes B use constant stack; standard Java does not, so "always constant in Java" is wrong.',
        lessons: ['08-recursion', '02-analysis-of-algorithms'], skills: ['concept', 'complexity'], available_after: '08-recursion', level: 3 }
    ],
    4: [
      { type: 'tf', q: 'In the Towers of Hanoi, one disk is moved at a time and a bigger disk is never put on a smaller one.', answer: true,
        why: 'These are the two rules of slide 24.',
        lessons: ['08-recursion'], skills: ['concept'], available_after: '08-recursion', level: 1 },
      { q: 'How many moves are needed for 3 disks?',
        options: ['3', '6', '7', '8'], answer: 2,
        why: '2³ − 1 = 7: 3 moves for the two small disks to B, 1 for the big disk, 3 to bring them back on top.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 1 },
      { q: 'In `move(n, start, finish, buf)`, what does the first recursive call `move(n-1, start, buf, finish)` do?',
        options: ['Moves n − 1 disks from start to buf, using finish as temporary storage', 'Moves the biggest disk', 'Moves n − 1 disks from buf to finish', 'Moves n disks to finish'], answer: 0,
        why: 'It is step 1 of slide 26: the n − 1 smaller disks go to the spare peg, so that disk n is free to go to finish. The roles of finish and buf are swapped in this call.',
        lessons: ['08-recursion'], skills: ['concept'], available_after: '08-recursion', level: 2 },
      { source: { assignment: 5, question: 7 },
        q: 'A parcel splitter uses the following code:',
        code: 'void split(int n)\n{\n  if (n <= 1) return;\n  split(n / 2);\n  split(n / 2);\n}',
        ask: 'For n = 8, how many total split calls occur, including the initial call and base-case calls?',
        options: ['15', '14', '7', '8'], answer: 0,
        why: 'Like Hanoi, each call (above the base case) makes two calls. split(8): 1 call; split(4): 2; split(2): 4; split(1): 8 base-case calls. 1 + 2 + 4 + 8 = 15. "7" counts only the calls that split; "8" counts only the base cases; "14" forgets the first call.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 2 },
      { type: 'output', q: 'With the move method of slide 30, what does `move(2, \'C\', \'B\', \'A\');` print?',
        code: 'public static void move(int n, char start, char finish, char buf) {\n  if (n == 1)\n    System.out.println("Move from " + start + " to " + finish);\n  else {\n    move(n - 1, start, buf, finish);\n    System.out.println("Move from " + start + " to " + finish);\n    move(n - 1, buf, finish, start);\n  }\n}',
        answer: 'Move from C to A\nMove from C to B\nMove from A to B',
        why: 'start = C, finish = B, buf = A. The small disk goes C → A (to buf), the big disk C → B, then the small disk A → B.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 2 },
      { q: 'How many times is the method move called (counting the first call) by `move(4, \'A\', \'C\', \'B\')`?',
        options: ['4', '8', '15', '16'], answer: 2,
        why: 'Every call prints exactly one line: a move(1, …) call prints its move, and a bigger call prints its middle move. 4 disks need 2⁴ − 1 = 15 moves, so there are 15 calls: 1 + 2 + 4 + 8.',
        lessons: ['08-recursion'], skills: ['trace', 'complexity'], available_after: '08-recursion', level: 3 },
      { q: 'In the 15-move solution for 4 disks, how many times does disk 1 (the smallest) move?',
        options: ['4', '7', '8', '1'], answer: 2,
        why: 'Disk 4 moves once, disk 3 twice (once in each 3-disk half), disk 2 four times, disk 1 eight times: 1 + 2 + 4 + 8 = 15. The smallest disk makes every other move.',
        lessons: ['08-recursion'], skills: ['trace'], available_after: '08-recursion', level: 3 }
    ]
  }
});
