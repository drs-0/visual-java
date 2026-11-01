/* Data Structures · Unit 3 Stacks. The parts follow the slide outline (slide 2).
   Explanations and drawings come later; for now: parts and the unit exam questions (question sample). */
addUnit({
  course: 'ds', lesson: '03-stacks',
  blurb: 'Last in, first out: stack operations, evaluating postfix expressions with a stack, a generic Stack interface and an array-based stack.',
  parts: [
    { title: 'Collections and the stack', from: 1, to: 10 },
    { title: 'Postfix expressions', from: 11, to: 20 },
    { title: 'A generic Stack interface', from: 21, to: 24 },
    { title: 'Implementing a stack with an array', from: 25, to: 34 }
  ],
  exam: {
    questions: [
      { q: 'Which postfix expression is the same as the infix expression `(8 - 2) * (1 + 3)`?',
        options: ['8 2 - 1 3 + *', '8 2 1 3 - + *', '8 2 - * 1 3 +', '- 8 2 + 1 3 *'], answer: 0, review: 13,
        why: 'Each bracket becomes its own postfix part: `8 2 -` and `1 3 +`. The `*` works on their two results, so it comes last. "8 2 1 3 - + *" computes 8 * (2 + (1 - 3)). "8 2 - * 1 3 +" puts `*` when only one value is on the stack. "- 8 2 + 1 3 *" writes operators first (that is not postfix).',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 2 },
      { source: { assignment: 3, question: 13 },
        q: "A stack implements getMin() using an {{auxiliary|مساعد}} stack called MIN. When pushing a value, it is also pushed onto MIN if MIN is empty or the value is less than or equal to MIN's top. When popping a value, MIN is also popped if MIN's top equals that value. Starting with both stacks empty, execute: push(8), push(4), push(6), push(2), push(2), pop(), pop(). What does getMin() return now, and why does it take O(1) time?",
        options: ['4, because the top of MIN holds the current minimum and can be read directly.', '6, because the top of the main stack is always its minimum.',
          '2, because MIN {{permanently|بشكل دائم}} stores the smallest value ever pushed.', '4, because getMin() scans the main stack to find its smallest value.'],
        answer: 0, review: 10,
        why: 'MIN gets 8, 4, then 2, then the second 2 (equal values are pushed too). The two pops remove 2 and 2 from the main stack, and each time MIN\'s top is 2, so MIN loses both. Main: 8, 4, 6 · MIN: 8, 4. getMin() is a peek on MIN: O(1). "6" confuses top with minimum; "2" forgets that MIN is popped too; the last option has the right number but the wrong reason: there is no scan.',
        lessons: ['03-stacks'], skills: ['trace', 'design'], available_after: '03-stacks', level: 3 },
      { q: 'Two stacks, IN and OUT, start empty. OUT never accepts a value smaller than its top; IN accepts any value. Each arriving value goes on OUT if OUT is empty or the value is not smaller than OUT\'s top; otherwise it goes on IN. The values 4, 7, 2, 9, 5 arrive in that order. Then OUT is popped twice, and each popped value is pushed on IN. Finally, 6 arrives (same rule). What do the stacks hold now (bottom → top)?',
        options: ['IN: 2, 5, 9, 7 · OUT: 4, 6', 'IN: 2, 5, 7, 9 · OUT: 4, 6', 'IN: 2, 5, 9, 7, 6 · OUT: 4', 'IN: 2, 5, 4, 7, 6 · OUT: 9'], answer: 0, review: 10,
        why: 'Arrivals: OUT 4, 7 · IN 2 · OUT 9 · IN 5. So OUT is 4, 7, 9 and IN is 2, 5. Popping OUT twice gives 9 then 7, so IN becomes 2, 5, 9, 7 (the order flips). OUT\'s top is now 4, so 6 is accepted by OUT. "2, 5, 7, 9" thinks moving keeps the order. The third option still compares 6 with the old top 9. The last one pops OUT from the bottom, like a queue.',
        lessons: ['03-stacks'], skills: ['trace'], available_after: '03-stacks', level: 3 }
    ]
  }
});
