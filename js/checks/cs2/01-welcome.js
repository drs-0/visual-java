/* CS2 · Welcome: quick checks under the slides (1-2 per slide) and more part-quiz questions. */
addChecks({
  course: 'cs2', lesson: '01-welcome',
  slides: {
    2: [
      { q: 'Where will the lectures and homework be?', options: ['On Blackboard', 'Only on paper', 'On the textbook website'], answer: 0, why: 'Blackboard is the university’s course website.' }
    ],
    3: [
      { type: 'tf', q: 'CS II is a continuation of CS I.', answer: true, why: 'It continues GEIT 1411 Computer Science I with more advanced Java topics.' },
      { q: 'What is an IDE?', options: ['A program to write, run and debug code in one place', 'A Java edition', 'A kind of exam'], answer: 0, why: 'IntelliJ IDEA and NetBeans are IDEs.' }
    ],
    4: [
      { type: 'match', q: 'Match each book with its role in the course.', pairs: [['Liang, Introduction to Java Programming and Data Structures', 'The main textbook'], ['Deitel and Deitel, Java How to Program', 'A reference book']], why: 'Slide 4.' }
    ],
    5: [
      { q: 'Which one is a course outcome (slide 5)?', options: ['Write recursive methods and think recursively', 'Build a computer', 'Learn assembly language'], answer: 0, why: 'The list also has classes, inheritance, files, exceptions, abstract classes and interfaces.' }
    ],
    6: [
      { type: 'tf', q: 'Object oriented programming is used in games, banking systems and mobile apps.', answer: true, why: 'Slide 6 lists these and more.' }
    ],
    7: [
      { type: 'trace', q: 'Fill in the grading policy of slide 7.', cols: ['part', 'weight'], rows: [['Lab', '?20%|20'], ['Exam 1', '?15%|15'], ['Final Exam', '?30%|30'], ['Project', '?10%|10']], why: 'Project 10, Quizzes 10, Lab 20, Exam 1 15, Exam 2 15, Final 30: together 100%.' }
    ]
  },
  parts: {
    0: [
      { type: 'match', q: 'Match each topic with the course where you learn it.', pairs: [['Loops and arrays', 'CS I'], ['Inheritance and interfaces', 'CS II']], why: 'CS II builds on CS I.' },
      { q: 'How much are Exam 1 and Exam 2 together?', options: ['30%', '15%', '20%'], answer: 0, why: '15% + 15% = 30%, the same as the final exam.' },
      { type: 'tf', q: 'You should install an IDE on your computer and practice with it.', answer: true, why: 'Slide 3: download the IDE software and learn how to use it.' }
    ]
  }
});
