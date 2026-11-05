/* Data Structures · Unit 3 Stacks: questions under the slides and the part quizzes.
   Every question has lessons, skills, available_after and level (1 easy, 2 middle, 3 hard, never harder than the
   instructor's). source = the instructor's own question (Assignment 3), copied word for word with his answer. */
addChecks({
  course: 'ds', lesson: '03-stacks',
  slides: {
    8: [
      { q: 'Plates are put on a stack in this order: red, green, blue. One plate is removed, then a yellow plate is added. Which plate is at the bottom, and which is on top?',
        options: ['Bottom: yellow · top: red', 'Bottom: red · top: yellow', 'Bottom: red · top: blue', 'Bottom: green · top: yellow'], answer: 1,
        why: 'The removed plate is blue, the last one added (LIFO). Red never moves: it was put on first, so it stays at the bottom. Yellow is added last, so it is on top. "Top: blue" forgets that blue was removed; "bottom: green" removes the first plate, which is queue thinking, not stack thinking.',
        lessons: ['03-stacks'], skills: ['trace'], available_after: '03-stacks', level: 1 }
    ],
    10: [
      { q: 'A stack starts empty. Run: `push(5)`, `push(8)`, `peek()`, `push(1)`, `pop()`, `peek()`. What do `size()` and the last `peek()` return?',
        options: ['size 1, peek 5', 'size 3, peek 1', 'size 2, peek 8', 'size 2, peek 1'], answer: 2,
        why: '`peek()` only looks at the top; it does not remove it. So the stack is 5, 8, 1, then `pop()` removes 1 and leaves 5, 8: two elements with 8 on top. "size 1, peek 5" treats `peek()` like `pop()`. "size 3, peek 1" forgets that `pop()` removes.',
        lessons: ['03-stacks'], skills: ['trace', 'concept'], available_after: '03-stacks', level: 1 }
    ],
    14: [
      { q: 'The postfix expression `6 2 3 + - 4 *` is evaluated with a stack. What is on the stack (bottom → top) just after the `+` is processed, and what is the final value?',
        options: ['6, 5 · final value -4', '6, 2, 3, + · final value 4', '11 · final value 44', '6, 5 · final value 4'], answer: 3,
        why: 'Operands are pushed: 6, 2, 3. The `+` pops 3 and 2 and pushes 5, so the stack is 6, 5. Then `-` pops 5 and 6 and pushes 6 - 5 = 1, and `*` gives 1 × 4 = 4. Operators are never pushed. "-4" comes from doing 5 - 6: the first popped value is the second operand.',
        lessons: ['03-stacks'], skills: ['trace'], available_after: '03-stacks', level: 2 }
    ],
    17: [
      { q: 'A student swaps the two pop lines in `evaluate`, so the code becomes `op1 = stack.pop(); op2 = stack.pop();`. The rest is the same. What does `evaluate("9 3 -")` return now?',
        options: ['It throws an exception', '6', '3', '-6'], answer: 3,
        why: 'The stack holds 9, 3 with 3 on top. Now `op1` gets 3 and `op2` gets 9, and the method computes `op1 - op2` = 3 - 9 = -6. That is why the slide pops `op2` first: the top of the stack is the second operand. 6 is the right answer of the original code, not of the changed one. No exception: there are two operands to pop.',
        lessons: ['03-stacks'], skills: ['bug', 'trace'], available_after: '03-stacks', level: 2 }
    ],
    27: [
      { q: 'An `ArrayStack` from the slides has capacity 4 (top starts at 0). Run: `push(A)`, `push(B)`, `pop()`, `push(C)`, `push(D)`. What is `top`, and at which index is D?',
        options: ['top = 2, D at index 2', 'top = 3, D at index 2', 'top = 4, D at index 3', 'top = 3, D at index 3'], answer: 1,
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
        options: ['A', 'B', 'null, and B is erased from the array', 'It throws an exception, because index 2 is outside the array'], answer: 2,
        why: '`top` is the index after the top element, so `array[2]` is an empty cell: `result` is null. Then top becomes 1 and `array[1] = null` erases B. The slide decreases top first, then reads `array[top]`. "B" would be right only if top pointed at the top element. No exception: the array has 100 cells.',
        lessons: ['03-stacks'], skills: ['bug', 'trace'], available_after: '03-stacks', level: 2 }
    ],
    3: [
      { q: 'Which statement is <b>not</b> part of the meaning of a collection on slide 3?',
        options: ['It holds and organizes other objects', 'It gives operations for accessing and managing its elements', 'The objects it holds are called its elements', 'All its elements must be numbers'], answer: 3,
        why: 'A collection holds any kind of objects (names, students, tasks…), not only numbers. The other three sentences are exactly what slide 3 says.',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 1 }
    ],
    4: [
      { type: 'multi', q: 'Which of these collections are <b>linear</b>?',
        options: ['Stack', 'Queue', 'Tree', 'List', 'Graph'], answer: [0, 1, 3],
        why: 'In a linear collection the elements are one after another, like a line. Stacks, queues and lists are linear. In trees and graphs one element can be connected to several others: they are non-linear.',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 1 }
    ],
    5: [
      { q: 'A user class wants to change one cell of the array inside our stack class directly. What does abstraction (slide 5) say?',
        options: ['It cannot: the data is private (hidden), and the user works only through the interface operations', 'It may, because the array is part of the stack and the user owns the stack', 'It may, but only with a for loop that goes through every cell', 'It cannot, because Java arrays cannot be changed after they are made'], answer: 0,
        why: 'Abstraction hides the implementation. The class encapsulates its data (private) and offers public methods from the interface, such as push and pop. That is how a stack can guarantee LIFO: nobody can reach the middle. Arrays can be changed, but only by the class that owns them.',
        lessons: ['03-stacks'], skills: ['concept', 'design'], available_after: '03-stacks', level: 2 }
    ],
    6: [
      { q: 'What is the <b>Java Collections API</b>?',
        options: ['All the classes of the Java library', 'A program that sorts collections', 'The part of the Java API classes that support collections', 'The stack and queue classes we write in this course'], answer: 2,
        why: 'The Java API is the whole library; the Collections API is the subset of it for collections (slide 6). Our own classes are new implementations we write to understand these, not part of Java.',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 1 }
    ],
    7: [
      { type: 'tf', q: 'java.util.Stack allows only stack operations, so a user can never reach an element in the middle of it.', answer: false,
        why: 'In the framework picture, Stack is a legacy class that extends Vector, which is a List. So it also has list methods (like get(i)) that reach the middle. Our own Stack interface will allow only push, pop, peek, isEmpty and size.',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 2 }
    ],
    9: [
      { q: 'A, B, C, D are pushed in this order. In the usual vertical drawing, which element is just <b>below</b> the top element?',
        options: ['A', 'B', 'D', 'C'], answer: 3,
        why: 'D was pushed last, so it is the top. C was pushed just before it, so it is right under D. A is at the bottom, the end that never moves.',
        lessons: ['03-stacks'], skills: ['trace'], available_after: '03-stacks', level: 1 }
    ],
    12: [
      { q: 'What is the value of the postfix expression `8 2 /`?',
        options: ['0', '4', '6', '16'], answer: 1,
        why: 'Postfix "operand operand operator" means 8 / 2 = 4: the first operand is the one written first. "0" reads it as 2 / 8 in integers. 16 and 6 use another operator.',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 1 }
    ],
    13: [
      { q: 'Which postfix expression is the same as the infix expression `(6 + 2) * 5 - 4`?',
        options: ['6 2 + 5 * 4 -', '6 2 + 5 4 - *', '6 2 5 4 + * -', '+ 6 2 * 5 - 4'], answer: 0,
        why: '`6 2 +` gives 8, `5 *` gives 40, `4 -` gives 36, the same as the infix. "6 2 + 5 4 - *" computes (6 + 2) * (5 - 4) = 8: the minus is done before the times. "6 2 5 4 + * -" is 6 - 2 * (5 + 4). The last one is prefix, not postfix.',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 2 },
      { type: 'tf', q: 'In postfix, parentheses are still needed when + must be done before *.', answer: false,
        why: 'Postfix never needs parentheses (slide 13): the position of the operator decides the order. (2 + 3) * 4 is simply `2 3 + 4 *`.',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 1 }
    ],
    15: [
      { q: 'The user types the example of the prompt, `5 4 + 3 2 1 - + *`. What does PostfixTester print?',
        options: ['That expression equals 36', 'That expression equals 45', 'That expression equals 14', 'That expression equals 24'], answer: 0,
        why: '5 4 + → 9. Then 3 2 1 -: 2 - 1 = 1, and 3 1 + = 4. Finally 9 4 * = 36. "45" does 9 × 5. "24" does 3 - 2 instead of 2 - 1: the minus works on the two values just before it (2 and 1).',
        lessons: ['03-stacks'], skills: ['trace'], available_after: '03-stacks', level: 2 },
      { type: 'multi', q: 'After one result, PostfixTester asks "Evaluate another expression [Y/N]?". Which answers make it evaluate <b>another</b> expression?',
        options: ['y', 'Y', 'yes', 'N', ' y (with a space before it)'], answer: [0, 1],
        why: 'The loop goes on while `again.equalsIgnoreCase("y")`: only the exact text y, in small or capital letters. "yes" is not equal to "y", so it stops the program; so does " y" with a space. N stops it too.',
        lessons: ['03-stacks'], skills: ['trace', 'edge_case'], available_after: '03-stacks', level: 2 }
    ],
    16: [
      { q: 'ADD, SUBTRACT, MULTIPLY and DIVIDE are declared `private final static char`. What does <b>final</b> mean here?',
        options: ['They can only be used once', 'They are constants: their value cannot change', 'They are the last fields of the class', 'They are created again for every new evaluator'], answer: 1,
        why: 'final makes a variable a constant: after `ADD = \'+\'` it can never get another value. static means one copy shared by the whole class (not one per object), and private means only this class can use them.',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 1 },
      { q: 'Why does PostfixEvaluator declare `Stack<Integer>` and not `Stack<int>`?',
        options: ['Because int values are too big to fit in the cells of a stack', 'Because Integer is faster than int when the stack pushes and pops', 'Because a generic type must be a class type, so the wrapper class Integer is used', 'It could be either: both versions compile and give the same result'], answer: 2,
        why: 'Generics work only with class (reference) types, so `Stack<int>` does not compile. Integer is the class that wraps an int; Java converts between int and Integer by itself when we push and pop.',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 2 }
    ],
    18: [
      { q: 'What happens when the slide\'s evaluate gets the expression `7 2 %`?',
        options: ['isOperator("%") is false, so "%" goes to `Integer.valueOf`, which throws an exception', 'It returns 0, because % is not one of the four operators', 'It returns 1, the remainder of 7 divided by 2', '"%" is skipped as an unknown token, so the result is 7'], answer: 0,
        why: 'isOperator only accepts "+", "-", "*" and "/". Every other token is treated as a number, and `Integer.valueOf("%")` cannot turn "%" into an int, so it throws a NumberFormatException. The evaluator does not know the % operator at all.',
        lessons: ['03-stacks'], skills: ['trace', 'edge_case'], available_after: '03-stacks', level: 3 }
    ],
    19: [
      { q: 'What does `evaluate("9 4 /")` return?',
        options: ['0', '2', '2.25', '36'], answer: 1,
        why: 'op1 = 9 and op2 = 4 are ints, so `op1 / op2` is integer division: 9 / 4 = 2 (the .25 is dropped). "0" divides 4 by 9 (wrong operand order).',
        lessons: ['03-stacks'], skills: ['trace'], available_after: '03-stacks', level: 2 },
      { type: 'tf', q: 'In evaluateSingleOperator, `case DIVIDE` has no `break`. That is a bug: the switch falls through and changes result.', answer: false,
        why: 'DIVIDE is the last case, so after it the switch ends anyway: there is nothing to fall into. A missing break is only a problem when another case comes after it.',
        lessons: ['03-stacks'], skills: ['bug'], available_after: '03-stacks', level: 2 }
    ],
    20: [
      { type: 'match', q: 'Match each Javadoc tag with what it describes.',
        pairs: [['@author', 'Who wrote the class'], ['@version', 'Which version of the class it is'], ['@param', 'One parameter of a method'], ['@return', 'What the method gives back']],
        why: 'Javadoc tags start with @ inside a /** … */ comment. The javadoc tool turns them into documentation pages.',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 1 }
    ],
    22: [
      { q: 'Why is our interface written as `Stack<T>`, with a generic type T?',
        options: ['Because T means "top", the end where push and pop work', 'So one interface works for any element type, and the compiler checks the type', 'So that the stack can only hold Strings and not other types', 'Because an interface cannot use normal types such as int or String'], answer: 1,
        why: 'T is a type parameter: `Stack<String>`, `Stack<Integer>` and `Stack<Student>` all use the same interface, and the compiler refuses a wrong element type. T does not mean top, and interfaces can use normal types too.',
        lessons: ['03-stacks'], skills: ['concept', 'design'], available_after: '03-stacks', level: 1 }
    ],
    23: [
      { type: 'multi', q: 'Which method headers match the Stack&lt;T&gt; interface of slide 23?',
        options: ['void push(T element)', 'T pop()', 'void peek()', 'int isEmpty()', 'int size()'], answer: [0, 1, 4],
        why: 'peek returns the top element, so its type is T, not void. isEmpty answers yes or no, so it returns boolean. push returns nothing (void), pop returns the removed element (T), and size returns an int.',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 2 }
    ],
    24: [
      { q: 'In the UML box of Stack&lt;T&gt; (slide 24), why is the middle part (the data part) empty?',
        options: ['Because the data was forgotten', 'Because T is not known yet', 'Because an interface has no data members', 'Because the data is private'], answer: 2,
        why: 'An interface only lists method signatures; it has no fields. The class that implements it (ArrayStack) adds the data: top and array. Private fields would still be shown in UML, with a minus sign.',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 1 }
    ],
    25: [
      { type: 'tf', q: 'In an array of objects, each cell holds the object itself.', answer: false,
        why: 'Slide 25: an array of objects stores <b>references</b> to the objects. The objects are somewhere else in memory, and each cell points to one of them (or is null).',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 1 }
    ],
    26: [
      { q: 'What does the push method of our stack do when the array is full (slide 26)?',
        options: ['It throws an exception', 'It returns false so the user can try again later', 'It writes over the bottom element', 'It creates a bigger array and copies the elements, then pushes'], answer: 3,
        why: 'Throwing an exception or returning a failure status are both called "not good": being full is a problem of the array, not of the stack idea. Growing is rare, so the user does not need to worry about it. Writing over an element would lose data.',
        lessons: ['03-stacks'], skills: ['design'], available_after: '03-stacks', level: 1 }
    ],
    28: [
      { q: '`ArrayStack<T> implements Stack<T>`. What happens if the class forgets to write the `size()` method?',
        options: ['Nothing: size() is optional, so the class still compiles', 'Java writes size() by itself, and it returns top', 'It does not compile: a class that implements an interface must write all its methods', 'It compiles, but every call of size() returns 0'], answer: 2,
        why: 'implements is a promise to give a body to every method of the interface. If one is missing, the compiler reports an error (unless the class is abstract). Java never writes the method by itself.',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 2 }
    ],
    29: [
      { q: 'After `new ArrayStack<String>()`, what are `array.length` and `top`?',
        options: ['10 and 0', '0 and 0', '100 and -1', '100 and 0'], answer: 3,
        why: 'The no-argument constructor calls `this(DEFAULT_CAPACITY)`, so the array has 100 cells. The other constructor sets top = 0: the stack is empty. -1 belongs to the other convention, not to the slides.',
        lessons: ['03-stacks'], skills: ['trace'], available_after: '03-stacks', level: 1 },
      { type: 'bug', q: 'This constructor does not compile. Tap the line with the mistake.',
        code: 'public ArrayStack() {\n  ArrayStack(DEFAULT_CAPACITY);\n}\npublic ArrayStack(int initialCapacity) {\n  top = 0;\n  array = (T[]) new Object[initialCapacity];\n}',
        answer: 2,
        why: 'Inside a constructor, another constructor of the same class is called with `this(...)`, not with the class name. `ArrayStack(DEFAULT_CAPACITY)` looks like a call of a method named ArrayStack, and there is no such method, so it does not compile. The slide writes `this(DEFAULT_CAPACITY);`.',
        lessons: ['03-stacks'], skills: ['bug'], available_after: '03-stacks', level: 2 }
    ],
    30: [
      { q: 'Which line correctly creates the array inside the generic ArrayStack&lt;T&gt;?',
        options: ['array = new T[initialCapacity];', 'array = (T[]) new Object[initialCapacity];', 'array = new Object[initialCapacity];', 'array = (Object[]) new T[initialCapacity];'], answer: 1,
        why: 'Java cannot create `new T[...]`, because T is not known at run time (options 1 and 4). An Object array can be created, but it cannot be stored in a T[] variable without the cast `(T[])`, so option 3 does not compile either.',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 2 }
    ],
    33: [
      { q: 'Which situation should make our stack throw an exception (slide 33)?',
        options: ['pop on an empty stack', 'push when the array is full', 'peek on a stack with one element', 'size on an empty stack'], answer: 0,
        why: 'Only problems of the stack idea itself: there is nothing to pop. A full array is an implementation problem, so the class grows the array instead. peek with one element and size on an empty stack (0) are normal.',
        lessons: ['03-stacks'], skills: ['concept', 'edge_case'], available_after: '03-stacks', level: 1 }
    ],
    34: [
      { type: 'output', q: 'With the slides\' ArrayStack, what does this print?',
        code: 'ArrayStack<String> s = new ArrayStack<>();\ns.push("X");\ns.pop();\ntry {\n  s.pop();\n  System.out.println("popped");\n} catch (RuntimeException e) {\n  System.out.print(e.getMessage());\n}\nSystem.out.println("end");',
        answer: 'Stack is empty\nend',
        why: 'The first pop removes X, so the second pop finds an empty stack and throws `new RuntimeException("Stack is empty\\n")`. "popped" is skipped. The catch prints the message, which already ends with a new line, so "end" comes on the next line.',
        lessons: ['03-stacks'], skills: ['trace', 'edge_case'], available_after: '03-stacks', level: 2 }
    ]
  },
  parts: {
    0: [
      { type: 'multi', q: 'Which stack operations <b>change</b> the stack?',
        options: ['push', 'pop', 'peek', 'isEmpty', 'size'], answer: [0, 1],
        why: 'push adds an element and pop removes one. peek only looks at the top, and isEmpty and size only report on the stack.',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 1 },
      { type: 'match', q: 'The stack holds 4, 9, 2 (bottom → top). Match each operation, done alone on this stack, with its result.',
        pairs: [['peek()', '2, and the stack does not change'], ['pop()', '2, and 2 leaves the stack'], ['size()', '3'], ['isEmpty()', 'false']],
        why: 'The top is 2, the last element pushed. peek returns it and leaves it there; pop returns it and removes it. There are 3 elements, so the stack is not empty.',
        lessons: ['03-stacks'], skills: ['concept', 'trace'], available_after: '03-stacks', level: 1 },
      { q: 'A stack starts empty. Run: `push(A)`, `push(B)`, `pop()`, `push(C)`, `push(D)`, `pop()`, `pop()`. In which order do the elements come out?',
        options: ['B, D, C', 'B, C, D', 'A, B, C', 'D, C, B'], answer: 0,
        why: 'Each `pop()` removes the element pushed last that is still there. First B (A is under it). Then D, then C. "B, C, D" and "A, B, C" take the oldest element first, which is a queue (FIFO), not a stack. "D, C, B" pops everything at the end and ignores the first `pop()`.',
        lessons: ['03-stacks'], skills: ['trace'], available_after: '03-stacks', level: 1 },
      { source: { assignment: 3, question: 2 },
        q: 'A stack receives {{distinct|مختلفة}} integers 1, 2, 3, 4, 5 pushed in that order. You may pop at any time between pushes. Each pop will represent the output sequence. Which output sequence is impossible?',
        options: ['3, 2, 1, 5, 4', '3, 1, 2, 5, 4', '1, 3, 2, 5, 4', '2, 1, 4, 3, 5'], answer: 1,
        why: 'To output 3 first, you push 1, 2, 3 and pop 3. Now 2 is on top of 1, so 1 cannot come out before 2: "3, 1, 2" is impossible. The others work: for "1, 3, 2, 5, 4" push 1, pop, push 2, push 3, pop, pop, push 4, push 5, pop, pop. Tip: after a number leaves, every smaller number still inside must come out in decreasing order.',
        lessons: ['03-stacks'], skills: ['trace'], available_after: '03-stacks', level: 2 },
      { q: 'The MIN-stack of the drawing: a value is also pushed on MIN if MIN is empty or the value is ≤ MIN\'s top; when popping, MIN is popped too if its top equals the popped value. Run push(6), push(9), push(2), push(2), pop(). What does getMin() return?',
        options: ['6', '9', 'MIN is empty', '2'], answer: 3,
        why: 'MIN gets 6, then 2, then the second 2 (equal values are pushed too); 9 is not ≤ 6, so it is not. pop() removes a 2, and MIN\'s top is 2, so MIN loses one 2 and keeps 6, 2. getMin() = 2, which is right: a 2 is still in the stack. "6" would happen if equal values were not pushed on MIN.',
        lessons: ['03-stacks'], skills: ['trace', 'design'], available_after: '03-stacks', level: 2 },
      { q: 'Two stacks, A and B, start empty. Push 1, 2, 3, 4, 5 on A. Then pop A three times, pushing each popped value on B. Then pop B once and push that value back on A. What are the tops of A and B now?',
        options: ['top of A = 2, top of B = 5', 'top of A = 5, top of B = 3', 'top of A = 3, top of B = 4', 'top of A = 3, top of B = 5'], answer: 2,
        why: 'Popping A gives 5, 4, 3, so B becomes 5, 4, 3 (bottom → top) and A keeps 1, 2. Popping B gives 3 (its top), which goes back on A: A = 1, 2, 3 and B = 5, 4. Moving elements between stacks reverses their order.',
        lessons: ['03-stacks'], skills: ['trace'], available_after: '03-stacks', level: 2 },
      { type: 'multi', q: 'A, B, C, D are pushed in this order, and you may pop at any time. Which output sequences are <b>possible</b>?',
        options: ['B, A, D, C', 'D, A, B, C', 'A, B, C, D', 'C, D, B, A', 'C, A, D, B'], answer: [0, 2, 3],
        why: 'B, A, D, C: push A, B, pop, pop, push C, D, pop, pop. A, B, C, D: pop each one right after pushing it. C, D, B, A: push A, B, C, pop C, push D, pop D, then pop B and A. Impossible: after D comes out first, C is on top, so A cannot come next; after C comes out first, B is above A, so A cannot come before B.',
        lessons: ['03-stacks'], skills: ['trace'], available_after: '03-stacks', level: 3 }
    ],
    1: [
      { q: 'Which postfix expression is the same as the infix expression `(2 + 3) * 4`?',
        options: ['+ 2 3 * 4', '2 3 4 + *', '2 3 + 4 *', '2 + 3 4 *'], answer: 2,
        why: 'In postfix the operator comes after its two operands. `2 3 +` is 2 + 3; then that result and 4 go to `*`. "2 3 4 + *" means 2 * (3 + 4) = 14, not 20. "+ 2 3 * 4" puts operators first, and "2 + 3 4 *" is still partly infix.',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 1 },
      { type: 'tf', q: 'When the postfix algorithm of slide 14 meets an operator, it pushes the operator on the stack.', answer: false,
        why: 'Only operands are pushed. An operator pops the top two values, computes, and pushes the <b>result</b>, which is a number.',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 1 },
      { q: 'Evaluate the postfix expression `5 1 2 + 4 * + 3 -` with a stack. What is the result?',
        options: ['-14', '11', '14', '17'], answer: 2,
        why: '1 2 + → 3; 3 4 * → 12; 5 12 + → 17; 17 3 - → 14. "17" stops before the last operator. "-14" does 3 - 17: the first value popped is the second operand. "11" reads the numbers as the infix 5 + 1 + 2 * 4 - 3, but in postfix each operator works on the two values on top of the stack.',
        lessons: ['03-stacks'], skills: ['trace'], available_after: '03-stacks', level: 2 },
      { type: 'trace', q: 'Evaluate `2 3 4 * +` with the algorithm of slide 14. Write the stack after each token (bottom → top, values separated by spaces).',
        cols: ['token', 'stack after the token'], rows: [['2', '2'], ['3', '?2 3'], ['4', '?2 3 4'], ['*', '?2 12'], ['+', '?14']],
        why: 'Operands are pushed. `*` pops 4 and 3 and pushes 12; `+` pops 12 and 2 and pushes 14. At the end the value is the only element left.',
        lessons: ['03-stacks'], skills: ['trace'], available_after: '03-stacks', level: 2 },
      { q: 'Which of these two postfix expressions equals <b>4</b>: P = `5 3 - 2 -` or Q = `5 3 2 - -`?',
        options: ['Q', 'P', 'Both', 'Neither'], answer: 0,
        why: 'P: 5 3 - gives 2, then 2 2 - gives 0. Q: 3 2 - gives 1 first, then 5 1 - gives 4. Same numbers, same operators: the position of each operator decides what it works on, which is why postfix needs no parentheses.',
        lessons: ['03-stacks'], skills: ['trace'], available_after: '03-stacks', level: 2 },
      { type: 'bug', q: 'This is the slide\'s evaluate loop, copied exactly. One line does not compile. Tap it.',
        code: 'while (parser.hasNext()) {\n  token = parser.next();\n  if (isOperator(token)) {\n    op2 = stack.pop();\n    op1 = stack.pop();\n    result = evaluateSingleOperator(token.charAt(0), op1, op2);\n    stack.push(result);\n  }\n  else\n    stack.push(Integer.valueOf(token)));\n}',
        answer: 10,
        why: 'Count the brackets: `push(` and `valueOf(` open two, but the line closes three. One ")" must be removed: `stack.push(Integer.valueOf(token));`. The pop order on lines 4 and 5 is right: op2 is popped first.',
        lessons: ['03-stacks'], skills: ['bug'], available_after: '03-stacks', level: 2 },
      { q: 'What does the slide\'s `evaluate("7")` return (a single number, no operator)?',
        options: ['7, the value on the stack', 'null', 'It throws an exception, because nothing is popped', '0'], answer: 3,
        why: 'evaluate returns the variable `result`, which starts at 0 and is set only when an operator is processed. Here 7 is pushed, but no operator comes, so result stays 0. The 7 is left on the stack; it is never returned. The method returns an int, so it cannot return null.',
        lessons: ['03-stacks'], skills: ['trace', 'edge_case'], available_after: '03-stacks', level: 3 }
    ],
    2: [
      { type: 'tf', q: 'A Java interface such as Stack&lt;T&gt; gives the body of each method.', answer: false,
        why: 'An interface only gives each method\'s signature, without a body (slide 22). The class that implements it, like ArrayStack&lt;T&gt;, writes the bodies.',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 1 },
      { type: 'fill', q: 'Complete the class header so that ArrayStack follows our Stack interface.',
        code: 'public class ArrayStack<T> ___ Stack<T> {',
        answer: ['implements'],
        why: 'A class <b>implements</b> an interface. <code>extends</code> is used for a class that inherits from another class.',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 1 },
      { q: 'Which line compiles? (Stack&lt;T&gt; is our interface, ArrayStack&lt;T&gt; our class.)',
        options: ['Stack<Integer> s = new Stack<Integer>();', 'Stack<Integer> s = new ArrayStack<Integer>();', 'ArrayStack<Integer> s = new Stack<>();', 'Stack<int> s = new ArrayStack<int>();'], answer: 1,
        why: 'An interface cannot be created with new, so options 1 and 3 fail. A variable of the interface type can refer to an object of a class that implements it. A generic type must be a class, so int is not allowed (Integer is).',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 2 },
      { q: 'What happens with these two lines?',
        code: 'Stack<String> s = new ArrayStack<>();\ns.push(5);',
        options: ['It does not compile: push expects a String, and 5 is an int', '5 is pushed as the text "5"', 'It compiles, and throws an exception when it runs', 'It compiles, because T can be any type'], answer: 0,
        why: 'With `Stack<String>`, T is String, so push takes a String. The compiler checks this and refuses an int. That is the benefit of generics: the mistake is found before the program runs. Java does not turn 5 into "5" by itself.',
        lessons: ['03-stacks'], skills: ['concept', 'bug'], available_after: '03-stacks', level: 2 },
      { type: 'match', q: 'Match each part of the UML box of Stack&lt;T&gt; (slide 24) with what it shows.',
        pairs: [['the small dashed box at the corner', 'the generic type T'], ['the empty middle part', 'no data members'], ['the bottom part', 'the public method signatures'], ['push(T element) : void', 'the return type after the colon']],
        why: 'UML puts the type parameter in a small dashed box, the fields in the middle (none for an interface) and the methods at the bottom. In UML the return type comes after the colon, not before the name as in Java.',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 2 },
      { type: 'multi', q: 'A user writes `Stack<Student> s = new ArrayStack<>();`. Which calls compile?',
        options: ['s.push(new Student("Ali", 5))', 'Student x = s.pop();', 'String n = s.peek();', 'boolean b = s.isEmpty();', 'int k = s.size();'], answer: [0, 1, 3, 4],
        why: 'T is Student, so push takes a Student and pop and peek return a Student. Storing peek() in a String variable does not compile. isEmpty returns boolean and size returns int.',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 2 }
    ],
    3: [
      { type: 'tf', q: 'In the slides\' ArrayStack, the variable `top` is also the number of elements in the stack.', answer: true,
        why: 'Slide 27: top is the index <b>after</b> the top element, and the bottom is at index 0, so with elements at 0 … top − 1 there are exactly top elements. That is why size() can simply return top.',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 1 },
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
      { type: 'trace', q: 'An ArrayStack from the slides starts with capacity 2. Fill in `top` and `array.length` after each operation.',
        cols: ['operation', 'top', 'array.length'], rows: [['push(A)', '1', '2'], ['push(B)', '?2', '?2'], ['push(C)', '?3', '?4'], ['pop()', '?2', '?4'], ['push(D)', '?3', '?4'], ['push(E)', '?4', '?4'], ['push(F)', '?5', '?8']],
        why: 'push(C) finds size() == array.length (2 == 2), so the array doubles to 4 first. pop() only moves top back: the array never shrinks. push(E) fills the 4 cells; push(F) finds it full and doubles it to 8.',
        lessons: ['03-stacks'], skills: ['trace'], available_after: '03-stacks', level: 2 },
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
