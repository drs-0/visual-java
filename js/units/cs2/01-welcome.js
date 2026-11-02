/* CS2 · Unit 1 · Welcome (7 slides): the course, the textbook, what you will learn, why it matters, and the grading */
(function () {
  /* ---------- 1. from CS I to CS II (slides 3-5) ---------- */
  var TOPICS = [['Objects and Classes', 'build your own types'], ['Object-Oriented Thinking', 'design with classes'], ['Inheritance and Polymorphism', 'reuse and extend'], ['Exception Handling', 'errors at run time'], ['File I/O', 'read and write files'], ['Abstract Classes', 'incomplete classes'], ['Interfaces', 'what a class can do'], ['Recursion', 'a method calls itself']];
  var roadmap = {
    id: 'roadmap', slides: [3, 5], title: 'From CS I to CS II',
    steps: [
      { slide: 3, k: -1, cap: 'CS II continues CS I. In CS I you learned the basics: variables, if, loops, methods and arrays. All of that is used again here.' },
      { slide: 3, k: 0, cap: 'The new big idea is <b>object-oriented programming</b>: programs built from objects. Each unit of this site follows one chapter of the slides.' },
      { slide: 5, k: 8, cap: 'By the end you should be able to describe objects and classes, use inheritance and polymorphism, work with files and exceptions, think recursively, and design abstract classes and interfaces.' }
    ],
    draw: function (k, s) {
      var items = [B('cs1', 20, 20, 520, 44, { title: 'CS I: variables · selections · loops · methods · arrays', size: 13, tone: s.k < 0 ? 'accent' : 'muted', hi: s.k < 0 })];
      items.push(A('dn', 280, 66, 280, 88, { tone: 'muted' }));
      TOPICS.forEach(function (t, i) {
        var x = 20 + (i % 4) * 132, y = 96 + Math.floor(i / 4) * 116, on = s.k >= 0 && (s.k === 8 || i <= s.k);
        items.push(B('t' + i, x, y, 124, 104, { title: t[0].replace(/ /g, '\n').replace('\nand\n', '\nand '), size: 12, tone: on ? (s.k === 8 ? 'teal' : 'accent') : 'blue', hi: s.k === 0 && i === 0 }));
        items.push(T('d' + i, x + 62, y + 88, t[1], { anchor: 'middle', size: 10, tone: 'muted' }));
      });
      return items;
    }
  };

  /* ---------- 2. the grading policy (slide 7) ---------- */
  var GR = [['Project', 10], ['Quizzes', 10], ['Lab', 20], ['Exam 1', 15], ['Exam 2', 15], ['Final Exam', 30]];
  var grading = {
    id: 'grading', slides: [7, 7], title: 'Where the marks come from',
    steps: [
      { k: 0, cap: 'Six parts make 100%. The final exam is the biggest part: 30%.' },
      { k: 1, cap: 'Lab, project and quizzes together are 40%: regular work during the term counts as much as the two midterm exams and more than the final alone.' },
      { k: 2, cap: 'There is <b>no makeup exam</b>, so do not miss an exam.' }
    ],
    draw: function (k) {
      var items = [], x = 20;
      GR.forEach(function (g, i) {
        var w = g[1] * 5.2, work = i < 3;
        items.push(B('g' + i, Math.round(x), 120, Math.round(w) - 3, 70, { title: g[0] + '\n' + g[1] + '%', size: w < 60 ? 10.5 : 12, tone: k === 0 && i === 5 ? 'accent' : k === 1 && work ? 'accent' : 'blue', fill: 'soft', hi: (k === 0 && i === 5) || (k === 1 && work) }));
        x += w;
      });
      if (k === 2) items.push(T('nm', 280, 250, 'NO makeup exam', { anchor: 'middle', size: 18, bold: true, tone: 'red' }));
      return items;
    }
  };

  var para = function (t) { return { type: 'paragraph', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; };
  addUnit({
    course: 'cs2', lesson: '01-welcome',
    blurb: 'Meet the course: what CS II covers, the textbook and tools, and how it is graded.',
    parts: [
      {
        title: 'Welcome to CS II', from: 1, to: 7,
        quiz: [
          { q: 'Which topic is part of CS II (slide 3)?', options: ['Your first if statement', 'Inheritance and polymorphism', 'Binary numbers only'], answer: 1, why: 'Slide 3 lists inheritance, polymorphism, interfaces, exceptions, files, recursion and more.' },
          { q: 'Which programs does slide 3 suggest for writing code?', options: ['IntelliJ IDEA or NetBeans', 'Only Notepad', 'A web browser'], answer: 0, why: 'They are IDEs: Integrated Development Environments.' },
          { type: 'tf', q: 'A makeup exam is given if you miss an exam.', answer: false, why: 'Slide 7: NO makeup exam will be given.' },
          { q: 'Which part of the grade is the biggest?', options: ['Project (10%)', 'Lab (20%)', 'Final Exam (30%)'], answer: 2, why: 'Slide 7.' }
        ]
      }
    ],
    slides: {
      1: { cover: true, image: false, title: '', blocks: [para('Welcome to CSII'), para('GEIT 1412'), para('Computer Science II'), para('Dr. Muhamed Mudawar'), para('Prince Mohammad Bin Fahd University')],
        explain: '<p>Welcome to the second course. Here you move from small programs to <b>{{object-oriented programming|البرمجة كائنية التوجه}}</b>, the way most real software is built.</p>' },
      2: { image: false, blocks: [bul('Professor: Muhamed F Mudawar'), bul('CCES Building – Room F026'), bul('Blackboard:'), para('https://blackboard.pmu.edu.sa'), bul('Lectures and Homework will be available on Blackboard')],
        explain: '<p>Lectures and homework are on <b>Blackboard</b>, the university’s course website.</p>' },
      3: { image: false, blocks: [bul('This course is a continuation of the GEIT 1411 Computer Science I. It covers more advanced topics related to the Java programming language including inheritance, polymorphism, interfaces, exception handling, files and streams, generic collections, recursion and GUI components.'), bul('Integrated Development Environments (IDE)'), bul('IntelliJ IDEA (Community Edition), or', 1), bul('NetBeans', 1), bul('Download the IDE software on your computer and learn how to use it')],
        explain: '<p>An <b>{{IDE|بيئة تطوير متكاملة}}</b> is a program where you write, run and debug Java in one place. Install one of the two and practice with it.</p>' },
      4: { image: false, blocks: [bul('Introduction to Java Programming and Data Structures'), bul('Y. Daniel Liang'), bul('Eleventh Edition', 1), bul('Pearson', 1), bul('Global Edition', 1), bul('Reference: Java How to Program'), bul('Deitel and Deitel', 1), bul('Eleventh Edition, Early Objects', 1)],
        explain: '<p>The main <b>{{textbook|الكتاب المقرر}}</b> is Liang’s book (the same author as the CS I slides). Deitel’s book is an extra <b>{{reference|مرجع}}</b>.</p>' },
      5: { image: false, blocks: [bul('Towards the end of this course, you should be able to:'), bul('Describe objects and classes, class membership, and visibility modifiers', 1), bul('Apply inheritance and polymorphism in your code', 1), bul('Read and write data files and handle exceptions', 1), bul('Write recursive methods and think recursively', 1), bul('Design abstract classes and interfaces', 1), bul('Develop communication and teamwork skills', 1)],
        explain: '<p>These are the course <b>{{outcomes|مخرجات التعلّم}}</b>. Each one matches a unit of this site.</p>' },
      6: { image: false, blocks: [bul('Absolutely!'), bul('Object oriented programming is used everywhere'), bul('Simulation systems, games, flight simulators, etc.', 1), bul('Banking systems, business logic, and data processing', 1), bul('Graphical user interfaces', 1), bul('Dynamic and interactive web applications', 1), bul('Developing applications for mobile devices and embedded systems', 1), bul('Creating tools and environments for software development', 1)],
        explain: '<p>Games, banks, phone apps and websites are all built with objects. What you learn here is used in real jobs.</p>' },
      7: { image: false, blocks: [bul('Project 10%'), bul('Quizzes 10%'), bul('Lab 20%'), bul('Exam 1 15%'), bul('Exam 2 15%'), bul('Final Exam 30%'), bul('NO makeup exam will be given')],
        explain: '<p>The marks are spread over the whole term. Keep up with the labs and quizzes every week.</p>' }
    },
    visuals: [roadmap, grading]
  });
})();
