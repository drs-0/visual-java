/* Data Structures · Unit 3 Stacks: questions under the slides and the part quizzes.
   Every question has lessons, skills, available_after and level (1 easy, 2 middle, 3 hard, never harder than the
   instructor's). source = the instructor's own question (Assignment 3), copied word for word with his answer. */
addChecks({
  course: 'ds', lesson: '03-stacks',
  slides: {
    8: [
      { q: 'Plates are put on a stack in this order: red, green, blue. One plate is removed, then a yellow plate is added. Which plate is at the bottom, and which is on top?',
        options: ['Bottom: red · top: yellow', 'Bottom: yellow · top: red', 'Bottom: red · top: blue', 'Bottom: green · top: yellow'], answer: 0,
        why: 'The removed plate is blue, the last one added (LIFO). Red never moves: it was put on first, so it stays at the bottom. Yellow is added last, so it is on top. "Top: blue" forgets that blue was removed; "bottom: green" removes the first plate, which is queue thinking, not stack thinking.',
        lessons: ['03-stacks'], skills: ['trace'], available_after: '03-stacks', level: 1 }
    ],
    10: [
      { q: 'A stack starts empty. Run: `push(5)`, `push(8)`, `peek()`, `push(1)`, `pop()`, `peek()`. What do `size()` and the last `peek()` return?',
        options: ['size 2, peek 8', 'size 3, peek 1', 'size 1, peek 5', 'size 2, peek 1'], answer: 0,
        why: '`peek()` only looks at the top; it does not remove it. So the stack is 5, 8, 1, then `pop()` removes 1 and leaves 5, 8: two elements with 8 on top. "size 1, peek 5" treats `peek()` like `pop()`. "size 3, peek 1" forgets that `pop()` removes.',
        lessons: ['03-stacks'], skills: ['trace', 'concept'], available_after: '03-stacks', level: 1 }
    ],
    14: [
      { q: 'The postfix expression `6 2 3 + - 4 *` is evaluated with a stack. What is on the stack (bottom → top) just after the `+` is processed, and what is the final value?',
        options: ['6, 5 · final value 4', '6, 2, 3, + · final value 4', '11 · final value 44', '6, 5 · final value -4'], answer: 0,
        why: 'Operands are pushed: 6, 2, 3. The `+` pops 3 and 2 and pushes 5, so the stack is 6, 5. Then `-` pops 5 and 6 and pushes 6 - 5 = 1, and `*` gives 1 × 4 = 4. Operators are never pushed. "-4" comes from doing 5 - 6: the first popped value is the second operand.',
        lessons: ['03-stacks'], skills: ['trace'], available_after: '03-stacks', level: 2 }
    ],
    17: [
      { q: 'A student swaps the two pop lines in `evaluate`, so the code becomes `op1 = stack.pop(); op2 = stack.pop();`. The rest is the same. What does `evaluate("9 3 -")` return now?',
        options: ['-6', '6', '3', 'It throws an exception'], answer: 0,
        why: 'The stack holds 9, 3 with 3 on top. Now `op1` gets 3 and `op2` gets 9, and the method computes `op1 - op2` = 3 - 9 = -6. That is why the slide pops `op2` first: the top of the stack is the second operand. 6 is the right answer of the original code, not of the changed one. No exception: there are two operands to pop.',
        lessons: ['03-stacks'], skills: ['bug', 'trace'], available_after: '03-stacks', level: 2 }
    ],
    27: [
      { q: 'An `ArrayStack` from the slides has capacity 4 (top starts at 0). Run: `push(A)`, `push(B)`, `pop()`, `push(C)`, `push(D)`. What is `top`, and at which index is D?',
        options: ['top = 3, D at index 2', 'top = 2, D at index 2', 'top = 4, D at index 3', 'top = 3, D at index 3'], answer: 0,
        why: 'In the slides, `top` is the index after the top element, so it also counts the elements. A goes to [0], B to [1], `pop()` makes top 1, C goes to [1], D to [2], and top becomes 3. "top = 2" uses the other convention (top = index of the top element, -1 when empty). "top = 4" forgets that `pop()` decreases top.',
        lessons: ['03-stacks'], skills: ['trace'], available_after: '03-stacks', level: 1 }
    ],
    31: [
      { q: 'An `ArrayStack` is created with capacity 2 and uses the slide\'s `push` and `expandCapacity`. After 9 pushes (no pops), what is `array.length`, and how many times was `expandCapacity` called?',
        options: ['16, called 3 times', '8, called 2 times', '9, called 7 times', '18, called 4 times'], answer: 0,
        why: '`expandCapacity` runs when `size() == array.length`, and it doubles the length: the 3rd push grows 2 → 4, the 5th grows 4 → 8, the 9th grows 8 → 16. "8, 2 times" forgets that the 9th push finds the array full. "9, 7 times" is what happens when the array grows by one slot each time, not by doubling.',
        lessons: ['03-stacks'], skills: ['trace'], available_after: '03-stacks', level: 2 }
    ],
    32: [
      { q: 'A student writes `pop` in a different order. The stack holds A, B (so `top` is 2) and the capacity is 100. What does this `pop()` return?',
        code: 'T result = array[top];\ntop--;\narray[top] = null;\nreturn result;',
        options: ['null, and B is erased from the array', 'B', 'A', 'It throws an exception, because index 2 is outside the array'], answer: 0,
        why: '`top` is the index after the top element, so `array[2]` is an empty cell: `result` is null. Then top becomes 1 and `array[1] = null` erases B. The slide decreases top first, then reads `array[top]`. "B" would be right only if top pointed at the top element. No exception: the array has 100 cells.',
        lessons: ['03-stacks'], skills: ['bug', 'trace'], available_after: '03-stacks', level: 2 }
    ]
  },
  parts: {
    0: [
      { q: 'A stack starts empty. Run: `push(A)`, `push(B)`, `pop()`, `push(C)`, `push(D)`, `pop()`, `pop()`. In which order do the elements come out?',
        options: ['B, D, C', 'B, C, D', 'A, B, C', 'D, C, B'], answer: 0,
        why: 'Each `pop()` removes the element pushed last that is still there. First B (A is under it). Then D, then C. "B, C, D" and "A, B, C" take the oldest element first, which is a queue (FIFO), not a stack. "D, C, B" pops everything at the end and ignores the first `pop()`.',
        lessons: ['03-stacks'], skills: ['trace'], available_after: '03-stacks', level: 1 },
      { source: { assignment: 3, question: 2 },
        q: 'A stack receives {{distinct|مختلفة}} integers 1, 2, 3, 4, 5 pushed in that order. You may pop at any time between pushes. Each pop will represent the output sequence. Which output sequence is impossible?',
        options: ['3, 2, 1, 5, 4', '3, 1, 2, 5, 4', '1, 3, 2, 5, 4', '2, 1, 4, 3, 5'], answer: 1,
        why: 'To output 3 first, you push 1, 2, 3 and pop 3. Now 2 is on top of 1, so 1 cannot come out before 2: "3, 1, 2" is impossible. The others work: for "1, 3, 2, 5, 4" push 1, pop, push 2, push 3, pop, pop, push 4, push 5, pop, pop. Tip: after a number leaves, every smaller number still inside must come out in decreasing order.',
        lessons: ['03-stacks'], skills: ['trace'], available_after: '03-stacks', level: 2 }
    ],
    1: [
      { q: 'Which postfix expression is the same as the infix expression `(2 + 3) * 4`?',
        options: ['2 3 + 4 *', '2 3 4 + *', '+ 2 3 * 4', '2 + 3 4 *'], answer: 0,
        why: 'In postfix the operator comes after its two operands. `2 3 +` is 2 + 3; then that result and 4 go to `*`. "2 3 4 + *" means 2 * (3 + 4) = 14, not 20. "+ 2 3 * 4" puts operators first, and "2 + 3 4 *" is still partly infix.',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 1 },
      { q: 'Evaluate the postfix expression `5 1 2 + 4 * + 3 -` with a stack. What is the result?',
        options: ['14', '17', '-14', '11'], answer: 0,
        why: '1 2 + → 3; 3 4 * → 12; 5 12 + → 17; 17 3 - → 14. "17" stops before the last operator. "-14" does 3 - 17: the first value popped is the second operand. "11" reads the numbers as the infix 5 + 1 + 2 * 4 - 3, but in postfix each operator works on the two values on top of the stack.',
        lessons: ['03-stacks'], skills: ['trace'], available_after: '03-stacks', level: 2 }
    ],
    3: [
      { source: { assignment: 3, question: 5 },
        q: 'An array-based stack uses top = -1 to represent an empty stack. The array has capacity 6. After push(10), push(20), pop(), push(30), what is top?',
        options: ['3', '0', '1', '2'], answer: 2,
        why: 'Here top is the index of the top element (not the slides\' convention). push(10) → top 0, push(20) → 1, pop() → 0, push(30) → 1. "2" forgets the pop; "3" counts the operations; "0" stops before the last push. With the slides\' convention (empty = 0) the same steps end with top = 2.',
        lessons: ['03-stacks'], skills: ['trace'], available_after: '03-stacks', level: 1 },
      { type: 'multi', q: 'Which statements are true about the slides\' `ArrayStack<T>`?',
        options: ['The bottom of the stack is always at index 0.', 'When `top` equals `array.length`, the next `push` calls `expandCapacity` before storing the element.',
          '`pop()` is O(n), because the other elements move down one cell.', '`peek()` returns `array[top]`.', 'The array is created with `new T[initialCapacity]`.'],
        answer: [0, 1],
        why: 'True: the bottom is fixed at index 0 (slide 27), and `push` checks `size() == array.length` first (slide 31). False: nothing moves on a pop, only `top` changes, so it is O(1). `peek()` returns `array[top-1]`, because top is the index after the top element. `new T[...]` does not compile: the slides create an `Object` array and cast it (slide 30).',
        lessons: ['03-stacks'], skills: ['concept', 'design'], available_after: '03-stacks', level: 2 },
      { source: { assignment: 3, question: 16 },
        q: 'An array-based stack of object references pops an element by decreasing top but leaves the reference in the old array slot. What problem can this cause in a garbage-collected language?',
        options: ['The popped object may remain reachable thereby delaying garbage collection', 'The stack immediately becomes a queue', 'The remaining elements change their order', 'The next push must take O(n) time'], answer: 0,
        why: 'The array still holds a reference to the popped object, so Java thinks it is still in use and cannot free it. This is why the slide\'s `pop` writes `array[top] = null`. Leaving the reference does not change the order of the other elements, does not make a queue, and the next push simply writes over that cell in O(1).',
        lessons: ['03-stacks'], skills: ['bug'], available_after: '03-stacks', level: 2 },
      { source: { assignment: 3, question: 17 },
        q: 'An array-based stack stores n elements and doubles its capacity whenever full. What is the time complexity of a push that {{triggers|يُشغِّل}} resizing, and the time complexity of other push operations?',
        options: ['O(log n) for resizing push and O(1) otherwise', 'O(n) for resizing push and O(1) otherwise', 'O(n) for both', 'O(1) for both'], answer: 1,
        why: 'A resizing push copies all n elements into the new array: O(n) (slide 31). A normal push writes one cell and moves `top`: O(1). "O(n) for both" thinks every push copies; "O(1) for both" forgets the copy; O(log n) is the number of resizes over many pushes, not the cost of one.',
        lessons: ['03-stacks', '02-analysis-of-algorithms'], skills: ['complexity'], available_after: '03-stacks', level: 2 },
      { source: { assignment: 3, question: 9 },
        q: 'A student grows an array-based stack by exactly one slot whenever it becomes full. Starting with capacity 1, what is the total time for n pushes, including copying during resizing?',
        options: ['O(n)', 'O(n squared)', 'O(log n)', 'O(n log n)'], answer: 1,
        why: 'Growing by one means the array is full on almost every push, and each time all elements are copied: 1 + 2 + 3 + ... + (n-1) = n(n-1)/2 copies, which is O(n²). Doubling (the slides\' way) avoids this, because copies are rare. "O(n)" is the doubling answer; O(log n) and O(n log n) do not count the copies correctly.',
        lessons: ['03-stacks', '02-analysis-of-algorithms'], skills: ['complexity', 'design'], available_after: '03-stacks', level: 3 }
    ]
  }
});
