/* CS2 · Unit 3 · Object-Oriented Thinking (51 slides): class abstraction and encapsulation (Loan, BMI), class relationships
   (association, aggregation, composition, Course, StackOfIntegers), wrapper classes and boxing, BigInteger and BigDecimal,
   the String class (immutability, replace, split, valueOf, format) and StringBuilder (with the palindrome case study) */
(function () {
  function mix(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }
  function jd(x) {
    if (isNaN(x)) return 'NaN';
    if (x === 0) return '0.0';
    var a = Math.abs(x);
    if (a >= 1e-3 && a < 1e7) { var s = String(x); return s.indexOf('.') < 0 ? s + '.0' : s; }
    var e = x.toExponential().split('e'), m = e[0];
    return (m.indexOf('.') < 0 ? m + '.0' : m) + 'E' + Number(e[1]);
  }
  function plain(a) { var m = a.toExponential().split('e'), d = m[0].replace('.', ''), e = +m[1]; if (e >= 0) return d.length > e + 1 ? d.slice(0, e + 1) + '.' + d.slice(e + 1) : d + new Array(e + 2 - d.length).join('0'); return '0.' + new Array(-e).join('0') + d; }
  /* Java's %.pf */
  function jfix(x, p) {
    if (!isFinite(x)) return isNaN(x) ? 'NaN' : x > 0 ? 'Infinity' : '-Infinity';
    var neg = x < 0, s = plain(Math.abs(x)), parts = s.split('.'), ip = parts[0], fp = parts[1] || '';
    if (fp.length <= p) return (neg ? '-' : '') + ip + (p ? '.' + fp + new Array(p - fp.length + 1).join('0') : '');
    var all = (BigInt(ip + fp.slice(0, p)) + (+fp[p] >= 5 ? 1n : 0n)).toString();
    while (all.length < p + 1) all = '0' + all;
    return (neg ? '-' : '') + (p ? all.slice(0, all.length - p) + '.' + all.slice(all.length - p) : all);
  }
  function padL(t, w) { t = String(t); while (t.length < w) t = ' ' + t; return t; }
  function I(x) { return Math.trunc(x); }
  function h(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function jstr(s) { return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'; }
  function vbox(id, x, y, w, name, type, value, o) {
    return B(id, x, y, w, 48, mix({ tag: type + ' ' + name, title: value == null ? 'no value' : String(value), mono: true, size: 15, tone: value == null ? 'muted' : 'teal', dash: value == null, r: 6 }, o || {}));
  }
  function hot(o) { return mix(o || {}, { tone: 'accent', hi: true }); }
  function obj(id, x, y, w, name, fields, o) {
    o = o || {};
    return B(id, x, y, w, boxH(fields.length), mix({ title: name, band: true, mono: true, size: 12.5, lsize: 12.5, lines: fields.map(function (f) { return typeof f === 'string' ? { t: f } : f; }), tone: o.tone || 'teal', hi: !!o.hi }, o.extra || {}));
  }
  function ref(id, x, y, name, o) { return B(id, x, y, 120, 44, mix({ tag: name, title: 'reference', size: 12, tone: 'blue' }, o || {})); }
  /* the characters of a string as cells */
  function cells(p, x, y, s, o) {
    o = o || {};
    var arr = String(s).split(''), n = arr.length, cw = o.cw || Math.max(12, Math.min(30, Math.floor((o.w || 520) / Math.max(n, 1)))), out = [];
    arr.forEach(function (c, i) {
      var t = o.tone ? o.tone(i) : 'muted';
      out.push(B(p + i, x + i * cw, y, cw - 2, o.ch || 34, { title: c === ' ' ? '␣' : c, mono: true, size: cw < 20 ? 10 : 14, r: 3, tone: t }));
      if (o.idx) out.push(T(p + 'i' + i, x + i * cw + cw / 2 - 1, y - 6, String(i), { anchor: 'middle', mono: true, size: cw < 20 ? 9 : 11, tone: 'muted' }));
    });
    if (!n) out.push(B(p + 'e', x, y, 56, o.ch || 34, { title: '""', mono: true, tone: 'muted', dash: true }));
    return out;
  }

  /* ---------- 1. class abstraction (slide 3) ---------- */
  var abstraction = {
    id: 'abstraction', slides: [3, 3], title: 'Clients use the contract, not the code inside',
    steps: [
      { k: 0, cap: '<b>Class abstraction</b> separates how a class is <b>implemented</b> from how it is <b>used</b>.' },
      { k: 1, cap: 'The implementation is a black box, hidden from the clients: it is <b>encapsulated</b>.' },
      { k: 2, cap: 'The creator publishes the <b>class contract</b>: the signatures of the public constructors, methods and data fields.' },
      { k: 3, cap: 'Clients use the class only through that contract. The inside can change, and the clients still work.' }
    ],
    draw: function (k) {
      return [
        B('cls', 20, 110, 160, 90, { title: 'Class', size: 15, tone: 'ink', fill: 'solid', hi: k === 1 }),
        T('cl', 100, 226, 'implementation (hidden)', { anchor: 'middle', size: 11.5, tone: k === 1 ? 'accent' : 'muted', bold: k === 1 }),
        B('con', 180, 110, 190, 90, { title: 'Class Contract', lines: ['public constructors,', 'methods, data fields'], size: 13, lsize: 11, tone: k === 2 ? 'accent' : 'blue', hi: k === 2 }),
        A('ar', 374, 155, 416, 155, { tone: k === 3 ? 'accent' : 'muted' }), A('ar2', 416, 155, 374, 155, { tone: k === 3 ? 'accent' : 'muted' }),
        B('cli', 420, 110, 120, 90, { title: 'Clients', lines: ['use the class', 'through it'], size: 14, lsize: 11, tone: k === 3 ? 'accent' : 'teal', hi: k === 3 })
      ];
    }
  };

  /* ---------- 2. the Loan class (slides 4-8) ---------- */
  var LOANT = 'Loan loan = new Loan(annualInterestRate, numberOfYears, loanAmount);\nSystem.out.printf("The loan was created on %s\\n" +\n  "The monthly payment is %.2f\\nThe total payment is %.2f\\n",\n  loan.getLoanDate().toString(), loan.getMonthlyPayment(),\n  loan.getTotalPayment());\n\npublic double getMonthlyPayment() {\n  double monthlyInterestRate = annualInterestRate / 1200;\n  double monthlyPayment = loanAmount * monthlyInterestRate /\n    (1 - (1 / Math.pow(1 + monthlyInterestRate, numberOfYears * 12)));\n  return monthlyPayment;\n}\n\npublic double getTotalPayment() {\n  double totalPayment = getMonthlyPayment() * numberOfYears * 12;\n  return totalPayment;\n}';
  function monthly(r, y, a) { var m = r / 1200; return a * m / (1 - (1 / Math.pow(1 + m, y * 12))); }
  var loan = {
    id: 'loan', slides: [4, 8], title: 'A Loan object computes its own payments', code: LOANT,
    inputs: [{ id: 'r', label: 'annual rate %', value: 8.25, min: 0.1, max: 30 }, { id: 'y', label: 'years', value: 5, min: 1, max: 40 }, { id: 'a', label: 'amount', value: 120000, min: 100, max: 10000000 }],
    presets: [{ label: '8.25%, 5 years, 120000', values: { r: 8.25, y: 5, a: 120000 } }, { label: 'no-arg: 2.5%, 1, 1000', values: { r: 2.5, y: 1, a: 1000 } }, { label: '5%, 30 years, 250000', values: { r: 5, y: 30, a: 250000 } }],
    steps: function (v) {
      var r = v.r, y = I(v.y), a = v.a, mp = monthly(r, y, a), tp = mp * y * 12;
      return [
        { line: 1, slide: 4, ph: 'uml', cap: 'The Loan class: four <b>private</b> data fields (rate, years, amount, date) and public get/set methods. The no-arg constructor uses the defaults 2.5%, 1 year and 1000: <code>this(2.5, 1, 1000)</code>.' },
        { slide: 5, line: 1, ph: 'obj', cap: 'The constructor stores the three values with <code>this.</code> and records the date of creation with <code>new java.util.Date()</code>.' },
        { slide: 7, line: '7-12', ph: 'mp', mp: mp, cap: 'getMonthlyPayment: the monthly rate is ' + r + ' / 1200 = ' + jd(r / 1200) + ', and the formula with Math.pow gives ' + jfix(mp, 2) + '.' },
        { slide: 7, line: '14-17', ph: 'tp', mp: mp, tp: tp, cap: 'getTotalPayment <b>reuses</b> getMonthlyPayment: ' + jfix(mp, 2) + ' × ' + y + ' × 12 = ' + jfix(tp, 2) + '.' },
        { slide: 8, line: '2-5', ph: 'out', mp: mp, tp: tp, cap: 'TestLoanClass only creates the object and calls its methods. It does not need to know the formula: that is class abstraction.', out: ['The loan was created on ' + new Date().toString().slice(0, 24), 'The monthly payment is ' + jfix(mp, 2), 'The total payment is ' + jfix(tp, 2)] }
      ];
    },
    draw: function (k, s, v) {
      if (s.ph === 'uml') return [B('u', 110, 10, 340, boxH(12), { title: 'Loan', band: true, mono: true, lsize: 11.5, lines: [{ t: '-annualInterestRate: double', tone: 'red' }, { t: '-numberOfYears: int', tone: 'red' }, { t: '-loanAmount: double', tone: 'red' }, { t: '-loanDate: java.util.Date', tone: 'red' }, '---', { t: '+Loan()', tone: 'teal' }, { t: '+Loan(rate, years, amount)', tone: 'teal' }, { t: '+getAnnualInterestRate(): double  …', tone: 'teal' }, { t: '+setAnnualInterestRate(r): void  …', tone: 'teal' }, { t: '+getMonthlyPayment(): double', tone: 'teal' }, { t: '+getTotalPayment(): double', tone: 'teal' }], tone: 'blue' })];
      var items = [ref('l', 20, 40, 'Loan loan', {}), A('a', 144, 62, 196, 62, { tone: 'blue' })];
      items.push(obj('o', 200, 20, 330, ': Loan', ['annualInterestRate = ' + v.r, 'numberOfYears = ' + I(v.y), 'loanAmount = ' + jd(v.a), 'loanDate = (now)'], { hi: s.ph === 'obj' }));
      if (s.mp != null) items.push(vbox('mp', 40, 200, 220, 'getMonthlyPayment()', 'returns', jfix(s.mp, 2), s.ph === 'mp' ? hot() : {}));
      if (s.tp != null) items.push(vbox('tp', 300, 200, 230, 'getTotalPayment()', 'returns', jfix(s.tp, 2), s.ph === 'tp' ? hot() : {}));
      return items;
    }
  };

  /* ---------- 3. the BMI class (slides 9-12) ---------- */
  function bmiOf(w, hh) { return Math.round(w / (hh * hh) * 100) / 100.0; }
  function status(b) { return b < 18.5 ? 'Underweight' : b < 25 ? 'Normal' : b < 30 ? 'Overweight' : 'Obese'; }
  function UB(v) { return 'public class UseBMIClass {\n  public static void main(String[] args) {\n    // Create a BMI object\n    BMI bmi1 = new BMI("Kim Yang", 18, ' + v.w1 + ', ' + v.h1 + ');\n    System.out.println("The BMI for " + bmi1.getName() + " is "\n      + bmi1.getBMI() + " " + bmi1.getStatus());\n\n    // Create a BMI object\n    BMI bmi2 = new BMI("Susan King", ' + v.w2 + ', ' + v.h2 + ');\n    System.out.println("The BMI for " + bmi2.getName() + " is "\n      + bmi2.getBMI() + " " + bmi2.getStatus());\n  }\n}'; }
  var bmi = {
    id: 'bmi', slides: [9, 12], title: 'Two BMI objects, two results', code: UB,
    inputs: [{ id: 'w1', label: 'weight 1 (kg)', value: 65, min: 20, max: 250 }, { id: 'h1', label: 'height 1 (m)', value: 1.72, min: 1, max: 2.5 }, { id: 'w2', label: 'weight 2', value: 97, min: 20, max: 250 }, { id: 'h2', label: 'height 2', value: 1.83, min: 1, max: 2.5 }],
    presets: [{ label: 'Slide 12', values: { w1: 65, h1: 1.72, w2: 97, h2: 1.83 } }, { label: 'underweight and obese', values: { w1: 50, h1: 1.80, w2: 120, h2: 1.70 } }, { label: 'exactly 25', values: { w1: 64, h1: 1.6, w2: 81, h2: 1.8 } }],
    steps: function (v) {
      var b1 = bmiOf(v.w1, v.h1), b2 = bmiOf(v.w2, v.h2);
      return [
        { line: '4,9', slide: 9, ph: 'uml', cap: 'BMI keeps name, age, weight (kilograms) and height (meters) private. getBMI and getStatus compute the results. (The slide’s table says pounds and inches, but the code of slide 10 uses kilograms and meters.)' },
        { slide: 10, line: 4, ph: 'b1', b: [b1], cap: 'bmi1 uses the constructor with four parameters: name, age 18, weight, height.' },
        { slide: 11, line: '5-6', ph: 'b1', b: [b1], cap: 'getBMI = weight / height² = ' + jd(v.w1 / (v.h1 * v.h1)) + ', rounded to 2 digits with Math.round(bmi * 100) / 100.0: <b>' + jd(b1) + '</b>. getStatus: ' + status(b1) + '.', out: 'The BMI for Kim Yang is ' + jd(b1) + ' ' + status(b1) },
        { slide: 10, line: 9, ph: 'b2', b: [b1, b2], cap: 'bmi2 has no age: the three-parameter constructor calls <code>this(name, 20, weight, height)</code>, so age is 20.' },
        { slide: 12, line: '10-11', ph: 'b2', b: [b1, b2], cap: 'Its BMI is ' + jd(b2) + ': ' + status(b2) + '. The thresholds: under 18.5, under 25, under 30, else Obese.', out: 'The BMI for Susan King is ' + jd(b2) + ' ' + status(b2) }
      ];
    },
    draw: function (k, s, v) {
      if (s.ph === 'uml') return [B('u', 110, 20, 340, boxH(8), { title: 'BMI', band: true, mono: true, lsize: 12, lines: [{ t: '-name: String', tone: 'red' }, { t: '-age: int', tone: 'red' }, { t: '-weight: double', tone: 'red' }, { t: '-height: double', tone: 'red' }, '---', { t: '+BMI(name, age, weight, height)', tone: 'teal' }, { t: '+BMI(name, weight, height)', tone: 'teal' }, { t: '+getBMI(): double  +getStatus(): String', tone: 'teal' }], tone: 'blue' })];
      var items = [], rows = [['bmi1', 'Kim Yang', 18, v.w1, v.h1], ['bmi2', 'Susan King', 20, v.w2, v.h2]];
      s.b.forEach(function (b, i) {
        var r = rows[i], y = 20 + i * 150;
        items.push(obj('o' + i, 20, y, 260, r[0] + ': BMI', ['name = "' + r[1] + '"', { t: 'age = ' + r[2], b: i === 1 && k === 3, tone: i === 1 && k === 3 ? 'accent' : undefined }, 'weight = ' + jd(r[3]), 'height = ' + jd(r[4])], { hi: k === (i ? 3 : 1) }));
        if (k >= (i ? 4 : 2)) items.push(B('r' + i, 300, y + 20, 240, 60, { tag: 'getBMI() and getStatus()', title: jd(b) + '  ' + status(b), mono: true, size: 15, tone: status(b) === 'Normal' ? 'teal' : 'red', hi: true }));
      });
      return items;
    }
  };

  /* ---------- 4. association, aggregation, composition (slides 14-17) ---------- */
  var relations = {
    id: 'relations', slides: [14, 17], title: 'How classes are related',
    steps: [
      { slide: 14, ph: 'assoc', cap: '<b>Association</b>: an activity between two classes, drawn as a solid line with labels. A student <b>takes</b> courses; a faculty member <b>teaches</b> courses.' },
      { slide: 14, ph: 'mult', cap: 'The numbers are <b>multiplicities</b>: a course has 5..60 students, a student takes any number (*) of courses, a faculty member teaches 0..3 courses, and a course has exactly 1 teacher.' },
      { slide: 15, ph: 'code', cap: 'In code, an association becomes <b>data fields and methods</b>: Student has a Course[] courseList and addCourse; Course has a Student[] classList, a Faculty field, addStudent and setFaculty.' },
      { slide: 16, ph: 'agg', cap: '<b>Aggregation</b> is ownership, a <b>has-a</b> relationship (empty diamond): a Student has 1..3 Addresses. <b>Composition</b> (filled diamond) is stronger: the Name cannot exist without its Student.' },
      { slide: 17, ph: 'rep', cap: 'Both are written the same way in Java: a data field of the owned class inside the owner (the <b>aggregating</b> class). So many books call both “composition”.' }
    ],
    draw: function (k, s) {
      var items = [], ph = s.ph;
      if (ph === 'assoc' || ph === 'mult') {
        items.push(B('s', 10, 120, 100, 44, { title: 'Student', size: 14, tone: 'blue' }), B('c', 230, 120, 100, 44, { title: 'Course', size: 14, tone: 'blue' }), B('f', 450, 120, 100, 44, { title: 'Faculty', size: 14, tone: 'blue' }));
        items.push(A('l1', 110, 142, 230, 142, { head: false, tone: 'ink' }), A('l2', 330, 142, 450, 142, { head: false, tone: 'ink' }));
        items.push(T('t1', 170, 100, 'Take ▶', { anchor: 'middle', size: 13, bold: true, tone: 'accent' }), T('t2', 390, 100, '◀ Teach', { anchor: 'middle', size: 13, bold: true, tone: 'accent' }), T('t3', 410, 186, 'Teacher', { anchor: 'middle', size: 12, tone: 'muted' }));
        if (ph === 'mult') [['5..60', 132], ['*', 220], ['0..3', 350], ['1', 440]].forEach(function (m, i) { items.push(T('m' + i, m[1], 134, m[0], { anchor: 'middle', size: 13, bold: true, tone: 'accent', mono: true })); });
        return items;
      }
      if (ph === 'code') {
        [['Student', ['private Course[] courseList;', 'addCourse(Course c)']], ['Course', ['private Student[] classList;', 'private Faculty faculty;', 'addStudent(Student s)', 'setFaculty(Faculty f)']], ['Faculty', ['private Course[] courseList;', 'addCourse(Course c)']]].forEach(function (c, i) {
          items.push(B('c' + i, 6 + i * 184, 40, 180, boxH(c[1].length), { title: c[0], band: true, mono: true, lsize: 9.5, lines: c[1], tone: 'blue' }));
        });
        return items;
      }
      if (ph === 'agg') {
        items.push(B('n', 10, 120, 100, 44, { title: 'Name', size: 14, tone: 'blue' }), B('s', 230, 120, 100, 44, { title: 'Student', size: 14, tone: 'accent', hi: true }), B('a', 450, 120, 100, 44, { title: 'Address', size: 14, tone: 'blue' }));
        items.push(A('l1', 110, 142, 212, 142, { head: false, tone: 'ink' }), A('l2', 348, 142, 450, 142, { head: false, tone: 'ink' }));
        items.push(B('d1', 212, 132, 18, 20, { shape: 'diamond', fill: 'solid', tone: 'ink' }), B('d2', 330, 132, 18, 20, { shape: 'diamond', fill: 'clear', tone: 'ink' }));
        items.push(T('c', 200, 100, 'Composition', { anchor: 'middle', size: 12.5, bold: true, tone: 'accent' }), T('g', 380, 100, 'Aggregation', { anchor: 'middle', size: 12.5, bold: true, tone: 'teal' }));
        [['1', 125], ['1', 200], ['1..3', 365], ['1', 440]].forEach(function (m, i) { items.push(T('m' + i, m[1], 186, m[0], { anchor: 'middle', size: 12, mono: true, tone: 'muted' })); });
        items.push(T('e', 280, 250, 'Each student has a name and an address.', { anchor: 'middle', size: 13 }));
        return items;
      }
      [['Name', ['...'], 'aggregated class'], ['Student', ['private Name name;', 'private Address address;'], 'aggregating class'], ['Address', ['...'], 'aggregated class']].forEach(function (c, i) {
        items.push(B('c' + i, 10 + i * 184, 60, 176, boxH(c[1].length), { title: 'class ' + c[0], band: true, mono: true, lsize: 11, lines: c[1], tone: i === 1 ? 'accent' : 'blue', hi: i === 1 }));
        items.push(T('l' + i, 98 + i * 184, 190, c[2], { anchor: 'middle', size: 12, tone: 'muted' }));
      });
      return items;
    }
  };

  /* ---------- 5. the Course class (slides 18-20) ---------- */
  var TCO = 'public class TestCourse {\n  public static void main(String[] args) {\n    Course course1 = new Course("Data Structures");\n    Course course2 = new Course("Database Systems");\n\n    course1.addStudent("Peter Jones");\n    course1.addStudent("Kim Smith");\n    course1.addStudent("Anne Kennedy");\n\n    course2.addStudent("Peter Jones");\n    course2.addStudent("Steve Smith");\n\n    System.out.println("Number of students in course1: "\n      + course1.getNumberOfStudents());\n    String[] students = course1.getStudents();\n    for (int i = 0; i < course1.getNumberOfStudents(); i++)\n      System.out.println(students[i]);\n\n    System.out.println();\n    System.out.print("Number of students in course2: "\n      + course2.getNumberOfStudents());\n  }\n}';
  var C1 = ['Peter Jones', 'Kim Smith', 'Anne Kennedy'], C2 = ['Peter Jones', 'Steve Smith'];
  var course = {
    id: 'course', slides: [18, 20], title: 'Each Course keeps its own array of students', code: TCO,
    steps: [
      { slide: 18, line: '3-4', a: 0, b: 0, cap: 'Two Course objects. Each has its own courseName, a String[] students with room for 100, and numberOfStudents = 0.' },
      { slide: 19, line: 6, a: 1, b: 0, cap: '<code>addStudent</code> puts the name at index numberOfStudents, then adds 1: students[0] = "Peter Jones", numberOfStudents = 1.' },
      { slide: 19, line: '7-8', a: 3, b: 0, cap: 'Two more for course1: numberOfStudents = 3.' },
      { slide: 20, line: '10-11', a: 3, b: 2, cap: 'course2 gets 2 students in <b>its own</b> array. "Peter Jones" is in both courses.' },
      { slide: 20, line: '13-17', a: 3, b: 2, cap: 'getStudents returns the array. The loop goes only up to getNumberOfStudents(), because the other 97 elements are null.', out: ['Number of students in course1: 3', 'Peter Jones', 'Kim Smith', 'Anne Kennedy'] },
      { slide: 20, line: '19-21', a: 3, b: 2, cap: 'An empty line, then the count for course2. (dropStudent is left as an exercise on slide 19.)', out: ['', 'Number of students in course2: 2'] }
    ],
    draw: function (k, s) {
      var items = [];
      [['course1', 'Data Structures', C1, s.a], ['course2', 'Database Systems', C2, s.b]].forEach(function (c, i) {
        var y = 14 + i * 160;
        items.push(B('c' + i, 10, y, 240, boxH(2), { title: c[0] + ': Course', band: true, mono: true, lsize: 11, lines: ['courseName = "' + c[1] + '"', 'numberOfStudents = ' + c[3]], tone: 'teal' }));
        items.push(A('a' + i, 250, y + 40, 266, y + 40, { tone: 'blue' }));
        for (var j = 0; j < 4; j++) items.push(B('s' + i + '_' + j, 270, y + j * 34, 270, 30, { title: j < c[3] ? '"' + c[2][j] + '"' : j === 3 ? '… (100 places)' : 'null', mono: true, size: 12, tone: j < c[3] ? (j === c[3] - 1 && (k === (i ? 3 : 1) || (k === 2 && !i)) ? 'accent' : 'blue') : 'muted', dash: j >= c[3], r: 3 }));
      });
      return items;
    }
  };

  /* ---------- 6. stacks: StackOfIntegers (slides 21-25) ---------- */
  var STK = 'public class StackOfIntegers {\n  private int[] elements;\n  private int size;\n  public static final int DEFAULT_CAPACITY = 16;\n\n  public StackOfIntegers() { this(DEFAULT_CAPACITY); }\n\n  public StackOfIntegers(int capacity) { elements = new int[capacity]; }\n\n  public void push(int value) {\n    if (size >= elements.length) {\n      int[] temp = new int[elements.length * 2];\n      System.arraycopy(elements, 0, temp, 0, elements.length);\n      elements = temp;\n    }\n    elements[size++] = value;\n  }\n\n  public int pop() { return elements[--size]; }\n  public int peek() { return elements[size - 1]; }\n  public boolean empty() { return size == 0; }\n  public int getSize() { return size; }\n}';
  var stack = {
    id: 'stack', slides: [21, 25], title: 'Last in, first out', code: STK,
    inputs: [{ id: 'n', label: 'values pushed', value: 10, min: 1, max: 12 }, { id: 'c', label: 'capacity', value: 16, min: 1, max: 16 }],
    presets: [{ label: '10 values, capacity 16 (slide 25)', values: { n: 10, c: 16 } }, { label: '5 values, capacity 4 (it grows)', values: { n: 5, c: 4 } }, { label: '3 values, capacity 1', values: { n: 3, c: 1 } }],
    steps: function (v) {
      var n = I(v.n), cap = I(v.c), st = [], els = [], size = 0;
      st.push({ line: '10,19', slide: 21, cap0: cap, els: [], size: 0, ph: 'lifo', cap: 'A <b>stack</b> holds data in <b>Last-In, First-Out</b> (LIFO) order, like a pile of plates: you add on top and remove from the top.' });
      st.push({ line: '2-3', slide: 22, cap0: cap, els: [], size: 0, ph: 'uml', cap: 'StackOfIntegers hides an int array (elements) and a size. Its public methods: push, pop, peek, empty and getSize.' });
      for (var i = 0; i < n; i++) {
        var grow = size >= cap;
        if (grow) cap *= 2;
        els[size++] = i;
        st.push({ slide: grow ? 24 : 23, line: grow ? '11-15' : 16, cap0: cap, els: els.slice(), size: size, ph: 'push', grow: grow, cap: 'push(' + i + '): ' + (grow ? 'the array is full, so a new array twice as big (' + cap + ') is made and the elements are copied with System.arraycopy. Then ' : '') + 'elements[' + (size - 1) + '] = ' + i + ' and size becomes ' + size + '.' });
      }
      var out = [];
      while (size > 0) { out.push(els[--size]); if (size === n - 1 || size === 0) st.push({ slide: 25, line: 19, cap0: cap, els: els.slice(0, size), size: size, ph: 'pop', popped: out[out.length - 1], cap: size === 0 ? '… pop until the stack is empty. The numbers come out in <b>reverse</b> order.' : 'pop() takes the top element (' + out[0] + ') and size goes down. The while loop continues while !stack.empty().', out: size === 0 ? out.join(' ') + ' ' : undefined }); }
      return st;
    },
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'uml') return [B('u', 120, 20, 320, boxH(10), { title: 'StackOfIntegers', band: true, mono: true, lsize: 12, lines: [{ t: '-elements: int[]', tone: 'red' }, { t: '-size: int', tone: 'red' }, '---', '+StackOfIntegers()', '+StackOfIntegers(capacity: int)', '+empty(): boolean', '+peek(): int', '+push(value: int): void', '+pop(): int', '+getSize(): int'], tone: 'blue' })];
      if (s.ph === 'lifo') {
        ['Data1', 'Data2', 'Data3'].forEach(function (d, i) { items.push(B('d' + i, 200, 250 - i * 50, 160, 44, { title: d, mono: true, size: 14, tone: i === 2 ? 'accent' : 'blue' })); });
        items.push(A('in', 470, 100, 366, 170, { tone: 'teal', label: 'push on top', la: 'start', lx: 10 }), A('out', 366, 150, 470, 210, { tone: 'red', label: 'pop from top', la: 'start', lx: 10 }));
        return items;
      }
      var shown = Math.min(s.cap0, 12), ch = Math.min(26, Math.floor(300 / shown));
      for (var i = 0; i < shown; i++) {
        var y = 320 - (i + 1) * ch, has = i < s.size;
        items.push(B('e' + i, 160, y, 120, ch - 2, { title: has ? String(s.els[i]) : '', mono: true, size: ch < 20 ? 10 : 13, tone: has ? (i === s.size - 1 ? 'accent' : 'blue') : 'muted', r: 2, dash: !has }));
        items.push(T('ei' + i, 150, y + ch / 2 + 3, '[' + i + ']', { anchor: 'end', mono: true, size: 10, tone: 'muted' }));
      }
      if (s.size) items.push(T('top', 290, 320 - s.size * ch + ch / 2 + 3, '← top', { size: 12, bold: true, tone: 'accent' }));
      items.push(vbox('sz', 380, 40, 150, 'size', 'int', s.size, {}));
      items.push(vbox('cp', 380, 120, 150, 'capacity', 'elements.length', s.cap0, s.grow ? hot() : {}));
      if (s.popped != null) items.push(T('pp', 455, 230, 'popped: ' + s.popped, { anchor: 'middle', mono: true, size: 14, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* ---------- 7. wrapper classes and boxing (slides 27-33) ---------- */
  var WR = 'int i = 2;                 // primitive type\nInteger obj = i + 3;       // Auto boxing\nint j = obj - 1;           // Auto unboxing\n\nSystem.out.println(Integer.MAX_VALUE);\nInteger integerObject = Integer.valueOf("12");\nint k = Integer.parseInt("13");\ndouble d = integerObject.doubleValue();';
  var wrapper = {
    id: 'wrapper', slides: [27, 33], title: 'A primitive in an object box', code: WR,
    steps: [
      { line: 2, slide: 27, ph: 'list', cap: 'A primitive is not an object. Each primitive type has a <b>wrapper class</b>: Byte, Short, Integer, Long, Float, Double, Character, Boolean. Wrapper objects are <b>immutable</b>.' },
      { line: '5-8', slide: 28, ph: 'uml', cap: 'Integer and Double hold a private value and offer constants (MAX_VALUE, MIN_VALUE) and conversion methods (intValue, doubleValue, compareTo, toString, valueOf, parseInt / parseDouble).' },
      { slide: 29, line: 1, ph: 'i', cap: '<code>int i = 2;</code> a primitive value in a simple box.' },
      { slide: 29, line: 2, ph: 'box', cap: '<b>Auto boxing</b>: i + 3 = 5 is put into an Integer object automatically.' },
      { slide: 29, line: 3, ph: 'unbox', cap: '<b>Auto unboxing</b>: obj − 1 takes the int out of the object: j = 4.' },
      { slide: 30, line: 5, ph: 'max', cap: 'Each numeric wrapper class has MAX_VALUE and MIN_VALUE. For Double, MIN_VALUE is the smallest <b>positive</b> value, 4.9E-324, not a negative number.', out: '2147483647' },
      { slide: 32, line: 6, ph: 'val', cap: 'The static <code>valueOf(String)</code> creates a wrapper object from a string. <code>parseInt</code> (slide 33) returns a primitive int instead.' },
      { slide: 31, line: 8, ph: 'conv', cap: '<code>doubleValue()</code> (one of byteValue, shortValue, intValue, longValue, floatValue, doubleValue) converts the object into a primitive: 12.0.' }
    ],
    draw: function (k, s) {
      var ph = s.ph, items = [];
      if (ph === 'list') {
        [['byte', 'Byte'], ['short', 'Short'], ['int', 'Integer'], ['long', 'Long'], ['float', 'Float'], ['double', 'Double'], ['char', 'Character'], ['boolean', 'Boolean']].forEach(function (p, i) {
          var x = 20 + (i % 4) * 134, y = 50 + Math.floor(i / 4) * 120;
          items.push(T('p' + i, x + 62, y, p[0], { anchor: 'middle', mono: true, size: 13, tone: 'muted' }), A('a' + i, x + 62, y + 8, x + 62, y + 34, { tone: 'muted' }), B('w' + i, x, y + 38, 124, 40, { title: p[1], mono: true, size: 13, tone: 'teal' }));
        });
        return items;
      }
      if (ph === 'uml') {
        [['java.lang.Integer', 'int'], ['java.lang.Double', 'double']].forEach(function (c, i) { items.push(B('u' + i, 20 + i * 272, 20, 250, boxH(9), { title: c[0], band: true, mono: true, lsize: 11, lines: ['-value: ' + c[1], { t: '+MAX_VALUE: ' + c[1], u: true }, { t: '+MIN_VALUE: ' + c[1], u: true }, '---', '+intValue(): int', '+doubleValue(): double', '+compareTo(o): int', { t: '+valueOf(s: String)', u: true }, { t: i ? '+parseDouble(s: String)' : '+parseInt(s: String)', u: true }], tone: 'blue' })); });
        return items;
      }
      if (ph === 'max') return [T('m1', 40, 60, 'Integer.MAX_VALUE =  2147483647', { mono: true, size: 14 }), T('m2', 40, 100, 'Integer.MIN_VALUE = -2147483648', { mono: true, size: 14 }), T('m3', 40, 160, 'Double.MAX_VALUE  =  1.79769313486231570E+308', { mono: true, size: 13 }), T('m4', 40, 200, 'Double.MIN_VALUE  =  4.9E-324  (smallest positive)', { mono: true, size: 13, bold: true, tone: 'accent' })];
      items.push(vbox('i', 20, 60, 110, 'i', 'int', 2, ph === 'i' ? hot() : {}));
      if (ph !== 'i') items.push(ref('o', 180, 60, 'Integer obj', {}), A('oa', 304, 82, 356, 82, { tone: 'blue' }), obj('ob', 360, 60, 170, ': Integer', ['value = 5'], { hi: ph === 'box', tone: ph === 'box' ? 'accent' : 'teal' }));
      if (ph === 'unbox' || ph === 'val' || ph === 'conv') items.push(vbox('j', 20, 190, 110, 'j', 'int', 4, ph === 'unbox' ? hot() : {}));
      if (ph === 'val' || ph === 'conv') items.push(ref('io', 180, 190, 'Integer integerObject', {}), A('ia', 304, 212, 356, 212, { tone: 'blue' }), obj('iob', 360, 190, 170, ': Integer', ['value = 12'], { hi: ph === 'val', tone: ph === 'val' ? 'accent' : 'teal' }));
      if (ph === 'conv') items.push(vbox('d', 360, 290, 170, 'd', 'double', '12.0', hot()));
      return items;
    }
  };

  /* ---------- 8. BigInteger and BigDecimal (slides 34-36) ---------- */
  function fact(n) { var r = 1n; for (var i = 2n; i <= BigInt(n); i++) r *= i; return r.toString(); }
  var LF = 'public static BigInteger factorial(int n) {\n  BigInteger result = new BigInteger("1");\n  for (int i = 2; i <= n; i++)\n    result = result.multiply(new BigInteger(i + ""));\n  return result;\n}';
  var big = {
    id: 'big', slides: [34, 36], title: 'Numbers that do not fit in a long',
    code: '// Slide 35: BigInteger\nBigInteger a = new BigInteger("9223372036854775807");\nBigInteger b = new BigInteger("2");\nBigInteger c = a.multiply(b); // c = a * b\nSystem.out.println(c);        // 18446744073709551614\n\n// Slide 35: BigDecimal (a separate example)\nBigDecimal a = new BigDecimal(2.0);\nBigDecimal b = new BigDecimal(3);\nBigDecimal c = a.divide(b, 20, RoundingMode.HALF_UP);\nSystem.out.println(c);        // 0.66666666666666666667\n\n// Slide 36: large factorial\n' + LF,
    inputs: [{ id: 'n', label: 'n', value: 50, min: 0, max: 100 }],
    presets: [{ label: '5', values: { n: 5 } }, { label: '20', values: { n: 20 } }, { label: '21 (past long)', values: { n: 21 } }, { label: '50', values: { n: 50 } }],
    steps: function (v) {
      var n = I(v.n), f = fact(n), lim = 9223372036854775807n;
      return [
        { slide: 34, line: 2, ph: 'why', cap: 'long can hold at most 9223372036854775807. For bigger integers, or decimals with many exact digits, use <b>BigInteger</b> and <b>BigDecimal</b> from java.math. Both are immutable.' },
        { slide: 35, line: '4-5', ph: 'mul', cap: '<code>a.multiply(b)</code> with a = 9223372036854775807 (the largest long) and b = 2 gives 18446744073709551614: too big for a long, but fine for BigInteger. There is no * for objects; you call a method.', out: '18446744073709551614' },
        { slide: 35, line: '10-11', ph: 'div', cap: '<code>a.divide(b, 20, RoundingMode.HALF_UP)</code>: 2 / 3 with 20 digits after the point, rounded half up.', out: '0.66666666666666666667' },
        { slide: 36, line: '15-18', ph: 'fact', f: f, cap: n + '! = ' + (f.length > 40 ? 'a number with <b>' + f.length + ' digits</b>' : f) + '. Each loop step creates a new BigInteger with multiply (the old one cannot change).' + (BigInt(f) > lim ? ' A long would have overflowed here.' : ''), out: n + '! is ' + f }
      ];
    },
    draw: function (k, s) {
      if (s.ph === 'why') return [B('l', 40, 60, 480, 50, { tag: 'Long.MAX_VALUE', title: '9223372036854775807', mono: true, size: 18, tone: 'blue' }), T('t', 280, 170, 'bigger? → java.math.BigInteger', { anchor: 'middle', mono: true, size: 15, bold: true, tone: 'accent' })];
      if (s.ph === 'mul') return [B('a', 30, 50, 300, 44, { tag: 'BigInteger a', title: '9223372036854775807', mono: true, size: 15, tone: 'blue' }), B('b', 360, 50, 170, 44, { tag: 'BigInteger b', title: '2', mono: true, size: 15, tone: 'blue' }), A('m', 280, 100, 280, 150, { tone: 'accent', label: 'a.multiply(b)', la: 'start', lx: 8 }), B('c', 80, 160, 400, 50, { tag: 'BigInteger c', title: '18446744073709551614', mono: true, size: 17, tone: 'accent', hi: true })];
      if (s.ph === 'div') return [B('a', 60, 50, 180, 44, { tag: 'BigDecimal a', title: '2', mono: true, size: 15, tone: 'blue' }), B('b', 320, 50, 180, 44, { tag: 'BigDecimal b', title: '3', mono: true, size: 15, tone: 'blue' }), A('m', 280, 100, 280, 150, { tone: 'accent', label: 'divide(b, 20, HALF_UP)', la: 'start', lx: 8 }), B('c', 80, 160, 400, 50, { tag: 'BigDecimal c', title: '0.66666666666666666667', mono: true, size: 17, tone: 'accent', hi: true })];
      var f = s.f, lines = []; for (var i = 0; i < f.length; i += 34) lines.push(f.slice(i, i + 34));
      return [B('r', 30, 30, 500, boxH(Math.min(lines.length, 9)), { tag: 'result: ' + f.length + ' digits', lines: lines.slice(0, 9), mono: true, lsize: 14, tone: 'accent', hi: true })];
    }
  };

  /* ---------- 9. strings are immutable (slides 38-39) ---------- */
  var immut = {
    id: 'immut', slides: [38, 39], title: 's = "HTML" makes a new object',
    code: 'String message = new String("Welcome to Java");\nString message2 = "Welcome to Java";\n\nString s = "Java";\ns = "HTML";',
    steps: [
      { slide: 38, line: '1-2', ph: 'new', cap: 'A String can be made with new, or with the shorthand: a string literal in double quotes.' },
      { slide: 39, line: 4, ph: 'java', cap: 'After <code>String s = "Java";</code>: s refers to a String object for "Java". Its contents <b>cannot be changed</b>.' },
      { slide: 39, line: 5, ph: 'html', cap: 'After <code>s = "HTML";</code>: a <b>new</b> String object is made for "HTML", and s now refers to it. The "Java" object is not changed; it is just no longer referenced.' }
    ],
    draw: function (k, s) {
      if (s.ph === 'new') return [B('a', 40, 60, 480, 44, { title: 'new String("Welcome to Java")', mono: true, size: 15, tone: 'blue' }), B('b', 40, 140, 480, 44, { title: '"Welcome to Java"  (shorthand)', mono: true, size: 15, tone: 'teal' })];
      var items = [ref('s', 20, 60, 'String s', {})];
      items.push(obj('j', 300, 40, 230, ': String', ['String object for "Java"'], { tone: s.ph === 'html' ? 'muted' : 'teal' }));
      if (s.ph === 'java') items.push(A('a1', 144, 82, 296, 70, { tone: 'blue' }));
      else {
        items.push(A('a1', 144, 82, 296, 70, { tone: 'red', dash: true }), T('x', 220, 70, '✗', { anchor: 'middle', size: 20, bold: true, tone: 'red' }));
        items.push(obj('h', 300, 180, 230, ': String', ['String object for "HTML"'], { tone: 'accent', hi: true }), A('a2', 144, 90, 296, 200, { tone: 'accent' }));
        items.push(T('un', 415, 140, 'now unreferenced', { anchor: 'middle', size: 12, tone: 'red', bold: true }));
      }
      return items;
    }
  };

  /* ---------- 10. replace and split (slides 40-41) ---------- */
  function jsplit(s, d) { if (d === '') return s.split(''); var p = s.split(d); while (p.length > 1 && p[p.length - 1] === '') p.pop(); return p; }
  var replace = {
    id: 'replace', slides: [40, 41], title: 'replace makes a new string; split makes an array',
    inputs: [{ id: 's', type: 'text', label: 'string', value: 'Welcome', maxlen: 16 }, { id: 'o', type: 'text', label: 'old', value: 'e', minlen: 1, maxlen: 4 }, { id: 'n', type: 'text', label: 'new', value: 'AB', maxlen: 4 }],
    presets: [{ label: '"Welcome", e → AB', values: { s: 'Welcome', o: 'e', n: 'AB' } }, { label: '"Welcome", el → AB', values: { s: 'Welcome', o: 'el', n: 'AB' } }, { label: '"banana", a → o', values: { s: 'banana', o: 'a', n: 'o' } }, { label: 'not found', values: { s: 'Java', o: 'x', n: 'y' } }],
    code: function (v) { return 'String s = ' + jstr(v.s) + ';\nString r1 = s.replaceFirst(' + jstr(v.o) + ', ' + jstr(v.n) + ');\nString r2 = s.replace(' + jstr(v.o) + ', ' + jstr(v.n) + ');\n\nString[] tokens = "Java#HTML#Perl".split("#");\nfor (int i = 0; i < tokens.length; i++)\n  System.out.println(tokens[i]);'; },
    steps: function (v) {
      var s = v.s, o = v.o, n = v.n, at = s.indexOf(o), first = at >= 0 ? s.slice(0, at) + n + s.slice(at + o.length) : s, rx = /[.*+?^$|()[\]{}\\]/.test(o), all = s.split(o).join(n);
      return [
        { slide: 40, line: 2, ph: 'first', r: first, cap: '<code>replaceFirst</code> replaces only the <b>first</b> match: ' + h(jstr(first)) + '.' + (at < 0 ? ' There is no match, so the result is the same text.' : '') + (rx ? ' Careful: replaceFirst reads its first argument as a pattern (a regular expression), and signs like . or * have a special meaning there.' : '') },
        { slide: 40, line: 3, ph: 'all', r: all, cap: '<code>replace</code> replaces <b>every</b> match: ' + h(jstr(all)) + '. s itself is still ' + h(jstr(s)) + ': strings are immutable. (Slide 40 also shows replace(\'e\', \'A\') with chars: "WAlcomA".)' },
        { slide: 41, line: '5-7', ph: 'split', cap: '<code>split("#")</code> cuts the string at each # (the <b>delimiter</b>) and returns an array of the pieces.', out: ['Java', 'HTML', 'Perl'] }
      ];
    },
    draw: function (k, s, v) {
      var items = [];
      if (s.ph === 'split') {
        items.push(cells('src', 40, 50, 'Java#HTML#Perl', { cw: 34, tone: function (i) { return 'Java#HTML#Perl'[i] === '#' ? 'red' : 'blue'; } }));
        ['Java', 'HTML', 'Perl'].forEach(function (t, i) { items.push(B('t' + i, 40 + i * 170, 170, 150, 44, { title: '"' + t + '"', mono: true, size: 15, tone: 'accent' }), T('ti' + i, 115 + i * 170, 236, 'tokens[' + i + ']', { anchor: 'middle', mono: true, size: 12, tone: 'muted' })); });
        return items;
      }
      var src = v.s, o = v.o, firstAt = src.indexOf(o);
      items.push(T('l1', 20, 40, 's', { mono: true, bold: true, size: 14 }));
      items.push(cells('a', 60, 20, src, { cw: 30, tone: function (i) { var hit = false, p = 0; while (true) { var j = src.indexOf(o, p); if (j < 0) break; if (i >= j && i < j + o.length && (s.ph === 'all' || j === firstAt)) hit = true; p = j + Math.max(o.length, 1); } return hit ? 'red' : 'blue'; } }));
      items.push(T('l2', 20, 140, s.ph === 'first' ? 'r1' : 'r2', { mono: true, bold: true, size: 14 }));
      items.push(cells('b', 60, 120, s.r, { cw: 30, tone: function () { return 'accent'; } }));
      return items;
    }
  };

  /* ---------- 11. valueOf and String.format (slides 42-43) ---------- */
  var formatv = {
    id: 'formatv', slides: [42, 43], title: 'From values to strings',
    inputs: [{ id: 'x', label: 'double', value: 45.556, min: -9999, max: 99999 }, { id: 'n', label: 'int', value: 14, min: -999, max: 99999 }, { id: 't', type: 'text', label: 'String', value: 'AB', maxlen: 6 }],
    presets: [{ label: '45.556, 14, "AB" (slide)', values: { x: 45.556, n: 14, t: 'AB' } }, { label: '3.14159, 7, "Hi"', values: { x: 3.14159, n: 7, t: 'Hi' } }, { label: 'too wide: 123456.7, 98765, "Java"', values: { x: 123456.7, n: 98765, t: 'Java' } }],
    code: function (v) { return 'String a = String.valueOf(5.44);\nString s =\n  String.format("%7.2f%4d%3s", ' + v.x + ', ' + I(v.n) + ', ' + jstr(v.t) + ');'; },
    steps: function (v) {
      var p1 = padL(jfix(v.x, 2), 7), p2 = padL(String(I(v.n)), 4), p3 = padL(v.t, 3), r = p1 + p2 + p3;
      return [
        { slide: 42, line: 1, ph: 'val', cap: 'The static <code>String.valueOf</code> methods turn a char, a char array, or a number into a String: <code>String.valueOf(5.44)</code> returns "5.44".' },
        { slide: 43, line: '2-3', ph: 'fmt', parts: [p1, p2, p3], cap: '<code>String.format</code> works like printf but <b>returns</b> the formatted string instead of printing it. %7.2f → ' + h(jstr(p1)) + ', %4d → ' + h(jstr(p2)) + ', %3s → ' + h(jstr(p3)) + '.' + (r.length > 14 ? ' A value wider than its width is not cut; it just takes more places.' : '') },
        { line: '2-3', slide: 43, ph: 'res', parts: [p1, p2, p3], cap: 'Together: ' + h(jstr(r)) + '. (The slide shows each space as a small box.)' }
      ];
    },
    draw: function (k, s) {
      if (s.ph === 'val') return [B('v', 60, 80, 180, 50, { title: '5.44', mono: true, size: 18, tone: 'blue', tag: 'double' }), A('a', 246, 105, 314, 105, { tone: 'accent', label: 'valueOf' }), B('r', 320, 80, 180, 50, { title: '"5.44"', mono: true, size: 18, tone: 'accent', tag: 'String', hi: true })];
      var items = [], x = 20, tones = ['blue', 'teal', 'accent'];
      s.parts.forEach(function (p, i) {
        var t = p.replace(/ /g, '·'), w = Math.max(60, t.length * 22);
        items.push(B('p' + i, x, 90, w, 50, { tag: ['%7.2f', '%4d', '%3s'][i], title: t, mono: true, size: 16, tone: tones[i], hi: s.ph === 'res' }));
        x += w + 6;
      });
      items.push(T('k', 280, 200, '· = a blank (space)', { anchor: 'middle', size: 12.5, tone: 'muted' }));
      return items;
    }
  };

  /* ---------- 12. StringBuilder (slides 45-48) ---------- */
  var SBOPS = [['s.append("Welcome");', function (b) { return b + 'Welcome'; }], ["s.append(' ');", function (b) { return b + ' '; }], ['s.append("to Java");', function (b) { return b + 'to Java'; }], ['s.insert(11, "Best ");', function (b) { return b.slice(0, 11) + 'Best ' + b.slice(11); }], ['s.delete(8, 16);', function (b) { return b.slice(0, 8) + b.slice(16); }], ['s.replace(8, 12, "HTML");', function (b) { return b.slice(0, 8) + 'HTML' + b.slice(12); }], ["s.setCharAt(0, 'w');", function (b) { return 'w' + b.slice(1); }], ['s.reverse();', function (b) { return b.split('').reverse().join(''); }]];
  var builder = {
    id: 'builder', slides: [45, 48], title: 'One StringBuilder, changed in place',
    code: 'StringBuilder s = new StringBuilder();\n' + SBOPS.map(function (o) { return o[0]; }).join('\n') + '\nSystem.out.println(s.length() + " " + s.capacity());',
    steps: (function () {
      var b = '', st = [{ slide: 45, line: 1, b: '', cap: 'A <b>StringBuilder</b> is like a String that <b>can be changed</b>: append, insert, delete, replace, reverse. <code>new StringBuilder()</code> is empty, with room (capacity) for 16 characters.' }];
      var caps = ['append adds text at the end.', 'append a char: a space.', 'Now "Welcome to Java".', 'insert(11, …) puts text before index 11.', 'delete(8, 16) removes indexes 8 to 15 (the end index is not included).', 'replace(8, 12, "HTML") replaces indexes 8 to 11.', 'setCharAt(0, \'w\') changes one character.', 'reverse() turns it around.'];
      SBOPS.forEach(function (o, i) {
        var prev = b; b = o[1](b);
        st.push({ slide: i < 3 ? 46 : 47, line: i + 2, b: b, prev: prev, op: i, cap: caps[i] + ' → ' + h(jstr(b)) });
      });
      st.push({ slide: 48, line: 10, b: b, cap: '<b>length</b> is the number of characters actually stored (12); <b>capacity</b> is how many fit before it must grow. It grew from 16 to 34 when the text passed 16 characters (16 × 2 + 2 = 34), and it does not shrink by itself.', out: b.length + ' 34' });
      return st;
    })(),
    draw: function (k, s) {
      var items = [ref('r', 20, 120, 'StringBuilder s', {}), A('a', 144, 142, 176, 142, { tone: 'blue' })];
      items.push(B('box', 180, 80, 364, 110, { tag: 'the same StringBuilder object', fill: 'none', tone: 'accent', z: 0 }));
      items.push(cells('c', 190, 120, s.b, { cw: 17, idx: true, tone: function (i) { return s.prev != null && s.b[i] !== s.prev[i] ? 'accent' : 'blue'; } }));
      if (s.op != null) items.push(T('op', 362, 230, SBOPS[s.op][0], { anchor: 'middle', mono: true, size: 14, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 13. palindromes (slides 49-51) ---------- */
  function isLD(c) { return /[\p{L}\p{Nd}]/u.test(c); }
  var PAL = 'public static boolean isPalindrome(String s) {\n  String s1 = filter(s);\n  String s2 = reverse(s1);\n  return s2.equals(s1);\n}\n\npublic static String filter(String s) {\n  StringBuilder stringBuilder = new StringBuilder();\n  for (int i = 0; i < s.length(); i++) {\n    if (Character.isLetterOrDigit(s.charAt(i)))\n      stringBuilder.append(s.charAt(i));\n  }\n  return stringBuilder.toString();\n}\n\npublic static String reverse(String s) {\n  StringBuilder stringBuilder = new StringBuilder(s);\n  stringBuilder.reverse();\n  return stringBuilder.toString();\n}';
  var palin = {
    id: 'palin', slides: [49, 51], title: 'Filter, reverse, compare', code: PAL,
    inputs: [{ id: 's', type: 'text', label: 'string', value: 'ab<c>cb?a', maxlen: 24 }],
    presets: [{ label: 'ab<c>cb?a', values: { s: 'ab<c>cb?a' } }, { label: 'abcc><?cab', values: { s: 'abcc><?cab' } }, { label: 'race car', values: { s: 'race car' } }, { label: 'Madam (capital M)', values: { s: 'Madam' } }],
    steps: function (v) {
      var s = v.s, f = s.split('').filter(isLD).join(''), r = f.split('').reverse().join(''), ok = r === f;
      return [
        { slide: 49, line: '7-14', ph: 'filter', f: f, cap: 'Step 1, <b>filter</b>: go through the string and append only letters and digits (<code>Character.isLetterOrDigit</code>) to a StringBuilder: ' + h(jstr(f)) + '.' },
        { slide: 51, line: '16-20', ph: 'rev', f: f, r: r, cap: 'Step 2, <b>reverse</b>: new StringBuilder(s1).reverse() gives ' + h(jstr(r)) + '.' },
        { slide: 50, line: '2-4', ph: 'cmp', f: f, r: r, ok: ok, cap: 'Step 3: compare with <code>equals</code>. ' + (ok ? 'They are the same, so it <b>is</b> a palindrome.' : 'They differ, so it is <b>not</b> a palindrome.') + (/[A-Z]/.test(f) && f.toLowerCase() === r.toLowerCase() && !ok ? ' (equals is case sensitive: \'M\' and \'m\' are different.)' : ''), out: 'Is filtered "' + f + '" a palindrome? ' + ok }
      ];
    },
    draw: function (k, s, v) {
      var items = [];
      items.push(T('l0', 20, 44, 's', { mono: true, bold: true, size: 14 }));
      items.push(cells('o', 60, 22, v.s, { cw: 20, tone: function (i) { return isLD(v.s[i]) ? 'blue' : 'muted'; } }));
      items.push(T('l1', 20, 124, 's1', { mono: true, bold: true, size: 14 }));
      items.push(cells('f', 60, 102, s.f, { cw: 20, tone: function () { return s.ph === 'filter' ? 'accent' : 'teal'; } }));
      if (s.r != null) {
        items.push(T('l2', 20, 204, 's2', { mono: true, bold: true, size: 14 }));
        items.push(cells('r', 60, 182, s.r, { cw: 20, tone: function (i) { return s.ph === 'cmp' ? (s.r[i] === s.f[i] ? 'teal' : 'red') : 'accent'; } }));
      }
      if (s.ph === 'cmp') items.push(T('res', 280, 290, s.ok ? 'equal → palindrome' : 'not equal → not a palindrome', { anchor: 'middle', size: 16, bold: true, tone: s.ok ? 'teal' : 'red' }));
      return items;
    }
  };

  var ALL = [abstraction, loan, bmi, relations, course, stack, wrapper, big, immut, replace, formatv, builder, palin];

  var para = function (t) { return { type: 'paragraph', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; },
    code = function (t, lang) { return lang ? { type: 'code', text: t, lang: lang } : { type: 'code', text: t }; }, note = function (t) { return { type: 'note', text: t }; };
  function braces(c) { var o = (c.match(/\{/g) || []).length, z = (c.match(/\}/g) || []).length; return o >= 2 && o === z; }
  var OUT = ['Class Abstraction and Encapsulation', 'Class Relationships', 'Wrapper Classes for primitive types', 'BigInteger and BigDecimal', 'The String class', 'The StringBuilder class'];
  function outline(title, on, ex) { return { image: false, title: title, blocks: OUT.map(function (t, i) { return { type: 'bullet', html: i === on ? '<b>' + t + '</b>' : t, level: 0 }; }), explain: ex }; }

  addUnit({
    course: 'cs2', lesson: '03-object-oriented-thinking',
    blurb: 'Design with classes: hide the details behind a contract, connect classes (association, aggregation, composition), and use Java’s ready classes: wrappers, BigInteger, String and StringBuilder.',
    parts: [
      {
        title: 'Class abstraction and encapsulation', from: 1, to: 12,
        quiz: [
          { q: 'What does class abstraction separate?', options: ['Static members from instance members', 'Data fields from methods', 'How a class is implemented from how it is used'], answer: 2, why: 'Slide 3.' },
          { q: 'What is the class contract?', options: ['The private fields and their types', 'The signatures of the public constructors, methods and data fields', 'The code inside the methods of the class'], answer: 1, why: 'Clients use the class through it (slide 3).' },
          { q: 'What does <code>new Loan()</code> create?', options: ['A loan with rate 2.5, 1 year and amount 1000', 'A loan with rate 0, 0 years and amount 0', 'A compile error: Loan needs three arguments'], answer: 0, why: 'The no-arg constructor calls this(2.5, 1, 1000) (slide 5).' },
          { type: 'output', q: 'With the BMI class, what does this print?', code: 'BMI b = new BMI("Ali", 70, 1.75);\nSystem.out.println(b.getAge());', answer: '20', why: 'The 3-parameter constructor uses age 20 (slide 10).' },
          { type: 'output', q: 'And this? (weight 90, height 2.0)', code: 'BMI b = new BMI("Sam", 90, 2.0);\nSystem.out.println(b.getBMI() + " " + b.getStatus());', answer: '22.5 Normal', why: '90 / 4 = 22.5, which is at least 18.5 and under 25.' }
        ]
      },
      {
        title: 'Class relationships', from: 13, to: 25,
        quiz: [
          { q: 'Which relationship is a “has-a” ownership?', options: ['Inheritance', 'Association only', 'Aggregation'], answer: 2, why: 'Slide 16.' },
          { q: 'In composition…', options: ['the owned object can exist alone', 'the owned object cannot exist on its own', 'there is no owner'], answer: 1, why: 'Composition is a special case of aggregation (slide 16).' },
          { q: 'In slide 14, how many teachers does a course have?', options: ['5..60', '0..3', '1'], answer: 2, why: 'The 1 next to Faculty.' },
          { type: 'output', q: 'What does this print?', code: 'Course c = new Course("AI");\nc.addStudent("A");\nc.addStudent("B");\nSystem.out.println(c.getNumberOfStudents());', answer: '2', why: 'Each addStudent adds 1 (slide 19).' },
          { type: 'output', q: 'With StackOfIntegers, what does this print?', code: 'StackOfIntegers st = new StackOfIntegers();\nst.push(1); st.push(2); st.push(3);\nSystem.out.println(st.pop() + " " + st.peek());', answer: '3 2', why: 'LIFO: pop removes 3; peek shows 2 without removing it.' },
          { q: 'What happens when push is called on a full StackOfIntegers?', options: ['A new array twice as big is made and the elements are copied', 'An error is thrown and the value is lost', 'The oldest element is removed to make room'], answer: 0, why: 'Slide 24.' }
        ]
      },
      {
        title: 'Wrapper classes and big numbers', from: 26, to: 36,
        quiz: [
          { q: 'What is the wrapper class of int?', options: ['Int', 'Integer', 'Number'], answer: 1, why: 'Slide 27. For char it is Character.' },
          { type: 'output', q: 'What does this print?', code: 'Integer obj = 10;     // auto boxing\nint j = obj + 5;      // auto unboxing\nSystem.out.println(j);', answer: '15', why: 'Slide 29.' },
          { type: 'tf', q: 'Double.MIN_VALUE is the most negative double.', answer: false, why: 'It is the smallest positive double, 4.9E-324 (slide 30).' },
          { type: 'output', q: 'What does this print?', code: 'int i = Integer.parseInt("13");\ndouble d = Double.parseDouble("1.5");\nSystem.out.println(i + d);', answer: '14.5', why: 'Slide 33.' },
          { type: 'output', q: 'What does this print?', code: 'BigInteger a = new BigInteger("10");\nBigInteger b = a.multiply(new BigInteger("3"));\nSystem.out.println(a + " " + b);', answer: '10 30', why: 'BigInteger is immutable: multiply returns a new object; a is still 10.' }
        ]
      },
      {
        title: 'The String class', from: 37, to: 43,
        quiz: [
          { q: 'After <code>String s = "Java"; s = "HTML";</code>, what happened to the "Java" object?', options: ['It was deleted at once by the assignment', 'It was changed to "HTML" in place', 'Nothing; s now refers to a new "HTML" object'], answer: 2, why: 'Strings are immutable (slide 39).' },
          { type: 'output', q: 'What does this print?', code: 'System.out.println("Welcome".replace(\'e\', \'A\'));', answer: 'WAlcomA', why: 'Every e becomes A (slide 40).' },
          { type: 'output', q: 'And this?', code: 'System.out.println("Welcome".replaceFirst("e", "AB"));', answer: 'WABlcome', why: 'Only the first match.' },
          { type: 'output', q: 'What does this print?', code: 'String[] t = "a,b,c".split(",");\nSystem.out.println(t.length + " " + t[1]);', answer: '3 b', why: 'Three pieces (slide 41).' },
          { type: 'output', q: 'What does this print? Type the spaces too.', code: 'String s = String.format("[%5d]", 42);\nSystem.out.println(s);', answer: '[   42]', why: 'Width 5, right-justified: 3 spaces and 42 (slide 43).' }
        ]
      },
      {
        title: 'The StringBuilder class', from: 44, to: 51,
        quiz: [
          { q: 'What is the main difference between String and StringBuilder?', options: ['A StringBuilder can be modified', 'A StringBuilder is a primitive', 'Only String has append'], answer: 0, why: 'Slide 45.' },
          { type: 'output', q: 'What does this print?', code: 'StringBuilder s = new StringBuilder("Java");\ns.append("!");\ns.insert(0, "I like ");\nSystem.out.println(s);', answer: 'I like Java!', why: 'append at the end, insert at index 0.' },
          { type: 'output', q: 'And this?', code: 'StringBuilder s = new StringBuilder("abc");\ns.reverse();\nSystem.out.println(s);', answer: 'cba', why: 'reverse changes the builder itself.' },
          { q: 'What is the capacity of <code>new StringBuilder()</code>?', options: ['0', '10', '16'], answer: 2, why: 'Slide 45. length() is 0, but there is room for 16.' },
          { q: 'With the program of slides 50-51, is "Ab-c-ba" a palindrome? (Filtered, it is "Abcba".)', options: ['Yes: the program ignores the case of letters', 'No: equals is case sensitive, A and a differ'], answer: 1, why: 'The reverse is "abcbA".' }
        ]
      }
    ],
    slides: {
      1: { image: false, blocks: [para('Classes provide more flexibility and modularity for building reusable software.'), para('You will gain insight on object-oriented programming and see the benefits of developing reusable code using objects and classes.')],
        explain: '<p>Unit 2 showed how to write a class and make objects. This unit is about <b>thinking</b> in objects: how to design a class that others can use easily, how classes work together, and which useful classes Java already gives you (wrapper classes, BigInteger, String and StringBuilder).</p><p>The goal is <b>reusable</b> code: a class written once and used in many programs.</p>' },
      2: outline('Outline', -1, '<p>The plan of this unit.</p>'),
      3: { image: false, blocks: [bul('Class abstraction means to separate class implementation from the use of the class.'), bul('The creator of the class provides a description of the class and let the user know how the class can be used.'), bul('The user of the class does not need to know how the class is implemented. The detail of implementation is encapsulated and hidden from the user.')],
        explain: '<p><b>{{Class abstraction|تجريد الكلاس}}</b> splits a class into two sides:</p><ul><li><b>How to use it</b>: the public methods and what they do. This is the class’s <b>contract</b>, given to the user.</li><li><b>How it works inside</b>: the private fields and the code of the methods. This part is <b>{{encapsulated|مُغلَّف ومخفي}}</b>: hidden from the user.</li></ul><p>A car is a good picture: you drive with the wheel and the pedals (the contract) without knowing how the engine works (the hidden part). The creator can even change the engine later, and you still drive the same way.</p>' },
      4: { image: false, title: 'Designing the Loan Class', blocks: [para('The UML diagram lists the private data fields (annual interest rate, number of years, loan amount, loan date) and the public constructors and methods.')],
        explain: '<p>Before writing code, the Loan class is <b>designed</b> as a UML diagram. It lists:</p><ul><li>four private fields: annualInterestRate, numberOfYears, loanAmount and loanDate;</li><li>two constructors, get and set methods, and two methods that compute: getMonthlyPayment and getTotalPayment.</li></ul><p>For a user, this diagram is the contract: it is enough to use the class. The next slides fill it with code.</p>' },
      5: { image: false, title: 'The Loan Class', blocks: [code('public class Loan {\n  private double annualInterestRate;\n  private int numberOfYears;\n  private double loanAmount;\n  private java.util.Date loanDate;\n\n  /** No-arg constructor */\n  public Loan() { this(2.5, 1, 1000); }\n\n  /** Construct a loan with specified interest rate, years, and amount */\n  public Loan(double annualInterestRate, int numberOfYears,\n              double loanAmount) {\n    this.annualInterestRate = annualInterestRate;\n    this.numberOfYears = numberOfYears;\n    this.loanAmount = loanAmount;\n    loanDate = new java.util.Date();\n  }\n\n  /** Return annualInterestRate */\n  public double getAnnualInterestRate() { return annualInterestRate; }')],
        explain: '<p>The fields are private, so only Loan’s own code can change them.</p><p>Look at the no-arg constructor: <code>this(2.5, 1, 1000);</code> It calls the other constructor with default values (2.5% interest, 1 year, 1000). So the real setup code is written only once.</p><p>The constructor also stores the moment the loan is made: <code>loanDate = new java.util.Date();</code></p>' },
      6: { image: false, title: 'The Loan Class – cont\'d', blocks: [code('  /** Set a new annualInterestRate */\n  public void setAnnualInterestRate(double annualInterestRate) {\n    this.annualInterestRate = annualInterestRate;\n  }\n\n  /** Return numberOfYears */\n  public int getNumberOfYears() { return numberOfYears; }\n\n  /** Set a new numberOfYears */\n  public void setNumberOfYears(int numberOfYears) {\n    this.numberOfYears = numberOfYears;\n  }\n\n  /** Return loanAmount */\n  public double getLoanAmount() { return loanAmount; }\n\n  /** Set a new loanAmount */\n  public void setLoanAmount(double loanAmount) {\n    this.loanAmount = loanAmount;\n  }')],
        explain: '<p>Each private field gets a <b>getter</b> to read it and a <b>setter</b> to change it. In every setter the parameter has the same name as the field, so <code>this.</code> is needed:</p><pre class="ex">this.loanAmount = loanAmount;   // field = parameter</pre><p>loanDate has a getter but no setter: the date a loan was made should not change.</p>' },
      7: { image: false, title: 'The Loan Class – cont\'d', blocks: [code('  /** Compute and return monthly payment */\n  public double getMonthlyPayment() {\n    double monthlyInterestRate = annualInterestRate / 1200;\n    double monthlyPayment = loanAmount * monthlyInterestRate /\n      (1 - (1 / Math.pow(1 + monthlyInterestRate, numberOfYears * 12)));\n    return monthlyPayment;\n  }\n\n  /** Compute and return total payment */\n  public double getTotalPayment() {\n    double totalPayment = getMonthlyPayment() * numberOfYears * 12;\n    return totalPayment;\n  }\n\n  /** Return loan date */\n  public java.util.Date getLoanDate() {\n    return loanDate;\n  }\n}')],
        explain: '<p>The two methods that do the real work:</p><ul><li>getMonthlyPayment: the yearly rate is a percent (like 8.25), so <code>/ 1200</code> turns it into a monthly fraction: ÷ 12 months and ÷ 100. Then the standard loan formula gives the monthly payment.</li><li>getTotalPayment: monthly payment × number of months. It <b>calls</b> getMonthlyPayment instead of repeating the formula.</li></ul><p>Notice: these results are <b>not stored</b> in fields. They are computed each time they are asked for, so they are always correct, even after a setter changes the amount.</p>' },
      8: { image: false, title: 'Testing the Loan Class', blocks: [code('import java.util.Scanner;\n\npublic class TestLoanClass {\n  public static void main(String[] args) {\n    Scanner input = new Scanner(System.in);  // Create a Scanner object\n\n    // Enter annual interest rate, number of years, and loan amount\n    System.out.print("Enter annual interest rate, for example, 8.25: ");\n    double annualInterestRate = input.nextDouble();\n    System.out.print("Enter number of years as an integer: ");\n    int numberOfYears = input.nextInt();\n    System.out.print("Enter loan amount, for example, 120000: ");\n    double loanAmount = input.nextDouble();\n\n    // Create a Loan object\n    Loan loan = new Loan(annualInterestRate, numberOfYears, loanAmount);\n\n    // Display loan date, monthly payment, and total payment\n    System.out.printf("The loan was created on %s\\n" +\n      "The monthly payment is %.2f\\nThe total payment is %.2f\\n",\n      loan.getLoanDate().toString(), loan.getMonthlyPayment(),\n      loan.getTotalPayment());\n  }\n}')],
        explain: '<p>The test program reads three numbers, creates one Loan object, and asks it for the results. It contains no loan formula at all.</p><p>This is the benefit of abstraction: the user of the class writes very little code, and does not need to know the formula. If the formula had a bug, it would be fixed in one place: the Loan class.</p>' },
      9: { image: false, title: 'Designing the BMI Class', blocks: [para('The BMI class encapsulates BMI information. The getter methods for the data fields are provided in the class, but omitted in the UML diagram for brevity.')],
        explain: '<p><b>{{BMI|مؤشر كتلة الجسم}}</b> (body mass index) measures if a weight is healthy for a height:</p><pre class="ex">BMI = weight / (height × height)    // kilograms, meters</pre><p>The BMI class holds a person’s name, age, weight and height (all private), and has methods getBMI() and getStatus(). The getters are left out of the diagram to keep it short.</p>' },
      10: { image: false, title: 'The BMI Class', blocks: [code('public class BMI {\n  private String name;\n  private int age;\n  private double weight; // in Kilograms\n  private double height; // in Meters\n\n  public BMI(String name, int age, double weight, double height) {\n    this.name = name;\n    this.age = age;\n    this.weight = weight;\n    this.height = height;\n  }\n\n  public BMI(String name, double weight, double height) {\n    this(name, 20, weight, height);\n  }')],
        explain: '<p>Two overloaded constructors. The first sets all four fields. The second has no age parameter:</p><pre class="ex">public BMI(String name, double weight, double height) {\n  this(name, 20, weight, height);\n}</pre><p>It calls the first constructor with age 20. So <code>new BMI("Ali", 70, 1.75)</code> makes a person aged 20.</p>' },
      11: { image: false, title: 'The BMI Class', blocks: [code('  public double getBMI() {\n    double bmi = weight / (height * height);\n    return Math.round(bmi * 100) / 100.0;\n  }\n\n  public String getStatus() {\n    double bmi = getBMI();\n    if (bmi < 18.5) return "Underweight";\n    else if (bmi < 25) return "Normal";\n    else if (bmi < 30) return "Overweight";\n    else return "Obese";\n  }\n\n  public String getName() { return name; }\n  public int getAge() { return age; }\n  public double getWeight() { return weight; }\n  public double getHeight() { return height; }\n}')],
        explain: '<p>getBMI computes the value and rounds it to two decimals: <code>Math.round(bmi * 100) / 100.0</code> (for example 21.971… → 2197 → 21.97).</p><p>getStatus calls getBMI and then chooses the words with an if-else chain: below 18.5 Underweight, below 25 Normal, below 30 Overweight, otherwise Obese.</p><p>Like the loan payments, BMI is computed when asked, not stored, so it always matches the current weight and height.</p>' },
      12: { image: false, title: 'Using the BMI Class', blocks: [code(UB({ w1: 65, h1: 1.72, w2: 97, h2: 1.83 }))],
        explain: '<p>The program makes two BMI objects and prints their results:</p><ul><li>Kim Yang: 65 / (1.72 × 1.72) = 21.97, Normal.</li><li>Susan King (age 20 from the short constructor): 97 / (1.83 × 1.83) = 28.96, Overweight.</li></ul><p>The client code only creates objects and asks them questions. All the rules live inside the class.</p>' },
      13: outline('Next . . .', 1, '<p>Next: how classes are related.</p>'),
      14: { image: false, blocks: [bul('To design classes, you need to explore the relationship among classes. These are:'), para('1. Association: describes activity between two classes'), para('2. Aggregation'), para('3. Composition'), para('4. Inheritance (Chapter 11)'), note('Association is shown as a solid line with optional labels.'), para('This UML diagram shows that a student may take any number of courses, a faculty member may teach at most three courses, a course may have from 5 to 60 students, and a course is taught by only one faculty member.')],
        explain: '<p>Classes in a program are connected. This unit shows three kinds of relationship (the fourth, inheritance, is the next unit).</p><p><b>{{Association|ارتباط}}</b> means two classes work together, like “a student <b>takes</b> a course”. In UML it is a solid line. The numbers at the ends are <b>{{multiplicities|التعددية: كم عدد}}</b>:</p><ul><li><code>*</code>: any number (a student takes any number of courses).</li><li><code>0..3</code>: a faculty member teaches at most three courses.</li><li><code>5..60</code>: a course has 5 to 60 students; <code>1</code>: exactly one teacher.</li></ul>' },
      15: { image: false, blocks: [bul('Associations are implemented using data fields and methods'), bul('The addCourse method in the Student class and addStudent in the Course class implement a student takes a course relation.'), bul('The addCourse method in the Faculty class and setFaculty in the Course class implement a faculty teaches a course relation.')],
        explain: '<p>How does an association look in code? With <b>fields and methods</b>. A Student keeps a list of its courses and has addCourse; a Course keeps its students and has addStudent. Each side has a field that refers to the other side.</p><p>So “is related to” in the diagram becomes “has a field that refers to” in Java.</p>' },
      16: { image: false, blocks: [bul('Aggregation is a special form of association that represents an ownership relationship between two objects.'), bul('Aggregation models has-a relationships. The owner object is called an aggregating object and its class an aggregating class. The subject object is called an aggregated object and its class an aggregated class.'), bul('Composition is a special case of the aggregation relationship, where the aggregated object cannot exist on its own.'), para('Each student has a name and an address.')],
        explain: '<p><b>{{Aggregation|تجميع}}</b> is a stronger association: <b>ownership</b>, a “has-a” relationship. A student <b>has a</b> name and <b>has an</b> address. The owner (Student) is the aggregating class; the owned parts (Name, Address) are the aggregated classes.</p><p><b>{{Composition|تركيب}}</b> is the strongest: the part <b>cannot exist</b> without its owner. A student’s name has no meaning without the student.</p><p>In UML, a diamond is drawn at the owner’s side: empty for aggregation, filled for composition.</p>' },
      17: { image: false, blocks: [bul('An aggregation relationship is represented as a data field in the aggregating class, as shown below.'), bul('Since aggregation and composition relationships are represented using classes in similar ways, many texts don’t differentiate them and call both compositions.'), code('public class Name {\n  ...\n}\n\npublic class Student {\n  private Name name;\n  private Address address;\n  ...\n}\n\npublic class Address {\n  ...\n}', 'none')],
        explain: '<p>In code, aggregation is simply a <b>data field</b> in the owner class:</p><pre class="ex">public class Student {\n  private Name name;\n  private Address address;\n}</pre><p>Aggregation and composition are written the same way in Java, so many books call both “composition”.</p>' },
      18: { image: false, title: 'Designing the Course Class', blocks: [para('The Course class models the courses.')],
        explain: '<p>The Course class is a full example of a relationship: one Course object keeps the names of its students. Its UML diagram shows a course name, an array for up to 100 students, a counter numberOfStudents, and methods to add, get and drop students.</p>' },
      19: { image: false, blocks: [code('public class Course {\n  private String courseName;\n  private String[] students = new String[100];\n  private int numberOfStudents;\n\n  public Course(String courseName) { this.courseName = courseName; }\n\n  public void addStudent(String student) {\n    students[numberOfStudents] = student;\n    numberOfStudents++;\n  }\n\n  public String[] getStudents() { return students; }\n\n  public int getNumberOfStudents() { return numberOfStudents; }\n\n  public String getCourseName() { return courseName; }\n\n  public void dropStudent(String student) {\n    // Left as an exercise\n  }\n}')],
        explain: '<p>The key is how addStudent uses the counter:</p><pre class="ex">students[numberOfStudents] = student;\nnumberOfStudents++;</pre><p>numberOfStudents has two jobs: it is the <b>count</b> of students, and the <b>index of the next free place</b> in the array. With 2 students, places 0 and 1 are used, so the next one goes to index 2.</p><p>The array has room for 100; adding a 101st student would stop the program with an error.</p>' },
      20: { image: false, blocks: [code(TCO)],
        explain: '<p>Two Course objects, each with its own array and its own counter. Peter Jones is in both: two separate copies of his name, in two arrays.</p><p>course1 gets 3 students, course2 gets 2. The loop prints course1’s students using getNumberOfStudents(), not students.length (which is 100, mostly null).</p><p>Small detail: the last line uses print, not println, so no new line follows “Number of students in course2: 2”.</p>' },
      21: { image: false, blocks: [para('A stack holds data in Last-In, First-Out (LIFO) fashion')],
        explain: '<p>A <b>{{stack|مكدس}}</b> keeps data in <b>Last-In, First-Out</b> ({{LIFO|آخر من يدخل أول من يخرج}}) order. Think of a pile of plates: you put a new plate on <b>top</b>, and you also take from the top. The plate put on last comes off first.</p><p>Stacks are used everywhere in computing; the call stack of CS I unit 7 is one.</p>' },
      22: { image: false, title: 'The StackOfIntegers Class Diagram', blocks: [para('The StackOfIntegers class encapsulates the stack storage and provides the operations for manipulating the stack.')],
        explain: '<p>The StackOfIntegers class hides how the data is stored and offers five {{operations|عمليات}}:</p><ul><li><code>push(value)</code>: put a value on top.</li><li><code>pop()</code>: remove the top value and return it.</li><li><code>peek()</code>: return the top value <b>without</b> removing it.</li><li><code>empty()</code>: is the stack empty?</li><li><code>getSize()</code>: how many values are in it.</li></ul>' },
      23: { image: false, blocks: [para('The StackOfIntegers uses an array to store the elements in a stack.')],
        explain: '<p>Inside, the stack is an int array named elements, plus a counter size.</p><ul><li><code>elements[0]</code> is the <b>bottom</b>.</li><li><code>elements[size - 1]</code> is the <b>top</b>.</li><li>The <b>capacity</b> is the length of the array: how many values fit before it must grow.</li></ul>' },
      24: { image: false, title: 'The StackOfIntegers Class', blocks: [code(STK)],
        explain: '<p>The tricky lines use ++ and -- inside an index:</p><ul><li><code>elements[size++] = value;</code> stores at index size, <b>then</b> adds 1 to size.</li><li><code>elements[--size]</code> first subtracts 1, <b>then</b> reads that element.</li></ul><p>When the array is full, push makes a new array <b>twice as big</b>, copies the old values with System.arraycopy, and uses the new array. So the stack never runs out of room.</p><pre class="ex">push 5, push 8:  elements = [5, 8], size = 2\npop() → 8         size = 1</pre>' },
      25: { image: false, title: 'Testing the StackOfIntegers Class', blocks: [code('public class TestStackOfIntegers {\n  public static void main(String[] args) {\n    StackOfIntegers stack = new StackOfIntegers();\n\n    for (int i = 0; i < 10; i++)\n      stack.push(i);                         // Push i on the stack\n\n    while (!stack.empty())                   // Test if the stack is empty\n      System.out.print(stack.pop() + " ");   // Remove the top element\n  }\n}')],
        explain: '<p>The test pushes 0, 1, 2, … 9, then pops until the stack is empty. Because the last value in is the first out, it prints:</p><pre class="ex">9 8 7 6 5 4 3 2 1 0</pre><p>A stack reverses the order. The array started with 16 places, so it never had to grow here.</p>' },
      26: outline('Next . . .', 2, '<p>Next: wrapper classes.</p>'),
      27: { image: false, blocks: [bul('A primitive type is not an object. However, Java defines wrapper classes that allow you to process primitive data types as objects:'), bul('Byte', 1), bul('Short', 1), bul('Integer', 1), bul('Long', 1), bul('Float', 1), bul('Double', 1), bul('Character', 1), bul('Boolean', 1), bul('The instances of all wrapper classes are immutable. Their internal values cannot be changed once the objects are created.')],
        explain: '<p>int, double, char and boolean are <b>not objects</b>: they have no methods. But some Java tools only work with objects (like ArrayList, in the next unit).</p><p>So Java has a <b>{{wrapper class|كلاس مغلِّف}}</b> for each primitive type: it wraps one value inside an object. Byte, Short, Integer, Long, Float, Double, Character and Boolean. Note the two special names: <b>Integer</b> (not Int) and <b>Character</b> (not Char).</p><p>{{Wrapper|غلاف}} objects are <b>immutable</b>: the value inside never changes.</p>' },
      28: { image: false, title: 'The Integer and Double Classes', blocks: [para('The wrapper classes provide constants and conversion methods for manipulating various data types')],
        explain: '<p>Integer and Double each hold one private value and offer:</p><ul><li>constants: MAX_VALUE and MIN_VALUE;</li><li>conversion methods: intValue(), doubleValue(), …;</li><li>compareTo, toString and the static methods valueOf and parseInt / parseDouble.</li></ul><p>In the diagram, the underlined members are static, so you call them with the class name: <code>Integer.MAX_VALUE</code>, <code>Integer.parseInt("13")</code>.</p>' },
      29: { image: false, title: 'Automatic Conversion Between Primitive Types and Wrapper Classes', blocks: [bul('Java allows primitive types and wrapper classes to be converted automatically.'), bul('Auto boxing converts a primitive value into an object'), bul('Auto unboxing converts an object into a primitive value'), code('int i = 2;           // primitive type\nInteger obj = i+3;   // Auto boxing\nint j = obj-1;       // Auto unboxing')],
        explain: '<p>Java moves values in and out of wrappers <b>by itself</b>:</p><pre class="ex">int i = 2;\nInteger obj = i + 3;   // boxing: 5 goes into an Integer object\nint j = obj - 1;       // unboxing: 5 comes out, j = 4</pre><p><b>{{Boxing|التغليف التلقائي}}</b> puts a primitive into a wrapper object; <b>unboxing</b> takes it out. You can mostly use Integer and int together without thinking about it.</p>' },
      30: { image: false, title: 'MAX_VALUE and MIN_VALUE Constants', blocks: [bul('Each numeric wrapper class has the constants:'), para('MAX_VALUE represents the maximum value. MIN_VALUE represents the minimum value'), bul('For Float and Double, MIN_VALUE represents the minimum positive (close to zero) float and double values.'), bul('Examples:'), code('Integer.MAX_VALUE =  2147483647\nInteger.MIN_VALUE = -2147483648\nDouble.MAX_VALUE  =  1.79769313486231570E+308\nDouble.MIN_VALUE  =  4.9E-324', 'none')],
        explain: '<p>Every numeric wrapper knows its limits:</p><ul><li><code>Integer.MAX_VALUE</code> is 2147483647 and <code>Integer.MIN_VALUE</code> is -2147483648: the int range from CS I. One more than MAX_VALUE overflows.</li><li><code>Double.MAX_VALUE</code> is about 1.8 × 10<sup>308</sup>.</li></ul><p class="watch">For Double and Float, MIN_VALUE is <b>not</b> the most negative number. It is the smallest <b>positive</b> value, very close to zero: 4.9E-324.</p>' },
      31: { image: false, blocks: [bul('Each numeric wrapper class implements the methods'), code('byteValue, shortValue, intValue, longValue,\nfloatValue, and doubleValue.', 'none'), bul('These methods convert objects into primitive type values.'), bul('Each numeric wrapper class implements the toString method that converts a numeric value into a string.'), bul('The toString method is invoked when printing an object.')],
        explain: '<p>Every numeric wrapper can give its value back as any number type: byteValue, shortValue, intValue, longValue, floatValue and doubleValue.</p><pre class="ex">Double d = 7.9;\nd.intValue()      // 7   (the fraction is cut off)\nd.doubleValue()   // 7.9</pre><p>toString turns the value into text. It is called automatically when you print the object: <code>System.out.println(d)</code> prints 7.9.</p>' },
      32: { image: false, title: 'The static valueOf Methods', blocks: [bul('The numeric wrapper classes have a useful static method:'), code('valueOf(String s).', 'none'), bul('This method creates a new object initialized to the value represented by the specified string.'), bul('Examples:'), code('Double doubleObject = Double.valueOf("12.4");\nInteger integerObject = Integer.valueOf("12");')],
        explain: '<p><code>valueOf(String s)</code> is static: it reads the text and makes a <b>new wrapper object</b>:</p><pre class="ex">Integer n = Integer.valueOf("12");    // an Integer object\nDouble x = Double.valueOf("12.4");    // a Double object</pre><p>If the text is not a number, like "12a", the program stops with an error (unit 5 calls it an exception).</p>' },
      33: { image: false, title: 'Parsing Strings into Numbers', blocks: [bul('Each numeric wrapper class has two static parse methods to convert a String into a numeric value.'), bul('The parseInt method in the Integer class parses a numeric String into an int value.'), bul('The parseDouble method in the Double class parses a numeric String into a double value.'), bul('Examples:'), code('int i = Integer.parseInt("13");       // returns 13\ndouble d = Double.parseDouble("1.5"); // returns 1.5')],
        explain: '<p>The parse methods also read a number from text, but they give a <b>primitive</b> value, not an object:</p><pre class="ex">int i = Integer.parseInt("13");        // 13\ndouble d = Double.parseDouble("1.5");  // 1.5</pre><p>So: <b>valueOf</b> → an object; <b>parse</b> → a primitive. You used parseInt in CS I unit 5 to read numbers from strings.</p>' },
      34: { image: false, title: 'BigInteger and BigDecimal', blocks: [bul('If you need to compute very large integers or high precision floating-point values, you can use the BigInteger and BigDecimal classes in the java.math package.'), bul('Both classes are immutable.'), bul('Both classes extend the Number class and implement the Comparable interface.')],
        explain: '<p>A long holds at most 9223372036854775807 (19 digits), and a double keeps only about 16 {{exact|دقيق}} digits. For bigger or more exact numbers, java.math has two classes:</p><ul><li><b>BigInteger</b>: whole numbers of any size.</li><li><b>BigDecimal</b>: decimal numbers with as many exact digits as you ask for.</li></ul><p>Both are immutable. (They “extend Number” and “implement Comparable”: those words come in units 7 and 8.)</p>' },
      35: { image: false, title: 'BigInteger and BigDecimal', blocks: [code('BigInteger a = new BigInteger("9223372036854775807");\nBigInteger b = new BigInteger("2");\nBigInteger c = a.multiply(b); // c = a * b\nSystem.out.println(c);        // 18446744073709551614'), code('BigDecimal a = new BigDecimal(2.0);\nBigDecimal b = new BigDecimal(3);\nBigDecimal c = a.divide(b, 20, RoundingMode.HALF_UP);\nSystem.out.println(c);        // 0.66666666666666666667')],
        explain: '<p>Big numbers are objects, so <code>*</code>, <code>+</code> and <code>/</code> do not work on them. You call methods instead: multiply, add, subtract, divide.</p><pre class="ex">BigInteger c = a.multiply(b);   // not a * b</pre><p>The largest long × 2 = 18446744073709551614: a long would overflow, but BigInteger is fine.</p><p>BigDecimal’s divide needs to know how many digits to keep and how to round: <code>divide(b, 20, RoundingMode.HALF_UP)</code> gives 2/3 with 20 digits. (2/3 never ends, so without this you would get an error.)</p>' },
      36: { image: false, title: 'Large Factorial', blocks: [code('import java.util.Scanner;\nimport java.math.BigInteger;\n\npublic class LargeFactorial {\n  public static void main(String[] args) {\n    Scanner input = new Scanner(System.in);\n    System.out.print("Enter an integer: ");\n    int n = input.nextInt();\n    System.out.println(n +"! is " + factorial(n));\n  }\n\n  public static BigInteger factorial(int n) {\n    BigInteger result = new BigInteger("1");\n    for (int i = 2; i <= n; i++)\n      result = result.multiply(new BigInteger(i + ""));\n    return result;\n  }\n}')],
        explain: '<p>n! = 1 × 2 × 3 × … × n grows very fast: 20! still fits in a long, but 21! does not. With BigInteger there is no limit: 50! has 65 digits.</p><pre class="ex">result = result.multiply(new BigInteger(i + ""));</pre><p><code>i + ""</code> turns the int into a String, because the constructor takes a String. And because BigInteger is immutable, multiply returns a <b>new</b> object; storing it back in result is what moves the loop forward.</p>' },
      37: outline('Next . . .', 4, '<p>Next: more about String.</p>'),
      38: { image: false, blocks: [bul('A String is an immutable object once the object is created'), bul('Constructing a String:'), code('String message = new String("Welcome to Java");'), bul('Java provides a shorthand initializer for creating a string:'), code('String message = "Welcome to Java";'), bul('The String class defines many methods:'), para('Obtaining string length and individual characters in a string'), para('String concatenation: concat'), para('Substrings: substring(index), substring(start, end)'), para('Comparison methods: equals, compareTo'), para('Conversions between Strings and Arrays'), para('Converting Characters and Numeric Values to Strings')],
        explain: '<p>You already know String from CS I. Two ways to make one:</p><pre class="ex">String message = new String("Welcome to Java");\nString message = "Welcome to Java";   // the short way</pre><p>The methods you know still apply: length, charAt, concat, substring, equals, compareTo, and conversions between strings, arrays and numbers. This part adds one key fact (strings are immutable) and a few new methods.</p>' },
      39: { image: false, blocks: [bul('A String object is immutable; its contents cannot be changed.'), para('Does the following code change the contents of the string?'), code('String s = "Java";\ns = "HTML";')],
        explain: '<p>A String object can <b>never change</b>. Then what does this do?</p><pre class="ex">String s = "Java";\ns = "HTML";</pre><p>It does not change the "Java" object. It creates a <b>new</b> object "HTML" and makes the <b>variable</b> s refer to it. The "Java" object is still there, unchanged (and becomes garbage if nothing else refers to it).</p><p>So the variable changes, the object does not.</p>' },
      40: { image: false, blocks: [code('"Welcome".replace(\'e\', \'A\');        // returns String "WAlcomA"\n"Welcome".replaceFirst("e","AB");  // returns String "WABlcome"\n"Welcome".replace("e", "AB");      // returns String "WABlcomAB"\n"Welcome".replace("el", "AB");     // returns String "WABcome"')],
        explain: '<p>The replace methods do not change the string; they <b>return a new one</b>:</p><ul><li><code>replace(\'e\', \'A\')</code>: every e becomes A: "WAlcomA".</li><li><code>replaceFirst("e", "AB")</code>: only the <b>first</b> e: "WABlcome".</li><li><code>replace("e", "AB")</code>: every e: "WABlcomAB".</li><li><code>replace("el", "AB")</code>: every "el": "WABcome".</li></ul><p class="watch">Writing <code>s.replace(\'e\', \'A\');</code> alone does nothing useful. Keep the result: <code>s = s.replace(\'e\', \'A\');</code></p>' },
      41: { image: false, title: 'Splitting a String into an array of Strings', blocks: [code('String[] tokens = "Java#HTML#Perl".split("#");\nfor (int i = 0; i < tokens.length; i++)\n  System.out.println(tokens[i]);'), bul('Displays:'), code('Java\nHTML\nPerl', 'none')],
        explain: '<p><code>split</code> cuts a string at a <b>{{delimiter|فاصل}}</b> and returns the pieces (<b>tokens</b>) as an array:</p><pre class="ex">"Java#HTML#Perl".split("#")   // {"Java", "HTML", "Perl"}</pre><p>The delimiter itself is thrown away. A loop over the array then prints each {{token|قطعة / جزء}} on its own line.</p>' },
      42: { image: false, title: 'Convert Character and Numbers to Strings', blocks: [bul('The String class provides several static valueOf methods for converting a char, an array of char, and numeric values to String.'), bul('For example, String.valueOf(5.44) returns the string "5.44".')],
        explain: '<p>The static <code>String.valueOf</code> turns other values into a String. It is overloaded: one version for char, char[], int, double, boolean and so on.</p><pre class="ex">String.valueOf(5.44)                 // "5.44"\nString.valueOf(new char[]{\'a\',\'b\'})  // "ab"</pre>' },
      43: { image: false, blocks: [bul('The String class contains the static format method to return a formatted string:'), code('String.format(format, item1, item2, ...);', 'none'), bul('The format method is similar to printf except that it returns a formatted string, whereas printf displays a formatted string.'), code('String s =\n  String.format("%7.2f%4d%3s", 45.556, 14, "AB");'), bul('Returns "  45.56  14 AB", where each space is a blank.')],
        explain: '<p><code>String.format</code> works exactly like printf, but instead of printing, it <b>returns</b> the formatted text:</p><pre class="ex">String s = String.format("%7.2f%4d%3s", 45.556, 14, "AB");\n// "  45.56  14 AB"</pre><p>%7.2f: 45.56 in 7 places (2 blanks first). %4d: 14 in 4 places. %3s: AB in 3 places. Use it when you need the text as a value, to store it or join it with other text.</p>' },
      44: outline('Next . . .', 5, '<p>Next: StringBuilder.</p>'),
      45: { image: false, title: 'The StringBuilder Class', blocks: [bul('The StringBuilder class is similar to String, except that a StringBuilder object is more flexible and can be modified.'), bul('You can append, delete, insert, replace, or reverse the content of a StringBuilder object, whereas a String object is fixed once the string is created.')],
        explain: '<p>A String can never change, so every “change” makes a new object. Building a long text piece by piece in a loop would create many objects.</p><p>A <b>StringBuilder</b> is a string that <b>can</b> change in place: you can append, insert, delete, replace and reverse its contents. Use it when you build text step by step, then call toString() at the end to get a normal String.</p>' },
      46: { image: false, blocks: [para('The StringBuilder class contains the methods for modifying string builders: append, delete, deleteCharAt, insert, replace, reverse and setCharAt.')],
        explain: '<p>The methods that change a StringBuilder:</p><ul><li><code>append(x)</code>: add at the end.</li><li><code>insert(i, x)</code>: add at index i.</li><li><code>delete(start, end)</code>, <code>deleteCharAt(i)</code>: remove.</li><li><code>replace(start, end, s)</code>: replace a part.</li><li><code>reverse()</code>, <code>setCharAt(i, c)</code>.</li></ul><p class="watch">Like substring, delete and replace include the start index but <b>not</b> the end index.</p>' },
      47: { image: false, title: 'Examples', blocks: [code('StringBuilder s = new StringBuilder();\ns.append("Welcome");       // "Welcome"\ns.append(\' \');             // "Welcome "\ns.append("to Java");       // "Welcome to Java"\ns.insert(11, "Best ");     // "Welcome to Best Java"\ns.delete(8, 16);           // "Welcome Java"\ns.replace(8, 12, "HTML");  // "Welcome HTML"\ns.setCharAt(0, \'w\');       // "welcome HTML"\ns.reverse();               // "LMTH emoclew"')],
        explain: '<p>Follow the comments: every line changes the <b>same</b> object s.</p><ul><li><code>insert(11, "Best ")</code>: index 11 is the J of “Java”, so “Best ” goes just before it.</li><li><code>delete(8, 16)</code>: removes the characters at 8 to 15, “to Best ”.</li><li><code>replace(8, 12, "HTML")</code>: “Java” (8 to 11) becomes “HTML”.</li></ul><p>Count the indexes yourself in the drawing: W is 0, the first space is 7.</p>' },
      48: { image: false, title: 'The toString, capacity, length, setLength, and charAt Methods', blocks: [bul('capacity returns the number of characters that can be stored.'), bul('length returns the number of characters actually stored.')],
        explain: '<p>Two sizes:</p><ul><li><b>length()</b>: how many characters are stored now.</li><li><b>capacity()</b>: how many fit before the builder must grow. A new empty StringBuilder has capacity 16; it grows by itself.</li></ul><p>toString() gives a normal String; charAt(i) reads one character; setLength(n) cuts the text to n characters (or fills with \'\\u0000\' if n is bigger).</p>' },
      49: { image: false, title: 'Checking Palindromes Ignoring Non-alphanumeric Characters', blocks: [para('Here are the steps to solve the problem:'), para('1. Filter the string by removing the non-alphanumeric characters. This is done by creating a StringBuilder object, appending only the alphanumeric characters, and returning a new filtered string.'), para('You can use the Character.isLetterOrDigit(ch) method in the Character class to check whether character ch is a letter or digit.'), para('2. Obtain a new string that is the reversal of the filtered string. Compare the reversed string with the filtered string using the equals method.')],
        explain: '<p>A <b>{{palindrome|كلمة تُقرأ من الجهتين}}</b> reads the same forwards and backwards, like “racecar”. This program also ignores everything that is not a {{letter or a digit|حرف أو رقم}}, so “race car!” counts too.</p><p>The plan has two steps:</p><ol><li><b>Filter</b>: keep only letters and digits (<code>Character.isLetterOrDigit</code>), using a StringBuilder.</li><li><b>Reverse</b> the filtered text and compare it with equals.</li></ol>' },
      50: { image: false, title: 'Checking Palindromes', blocks: [code('import java.util.Scanner;\n\npublic class Palindrome {\n  public static void main(String[] args) {     // Main method\n    Scanner input = new Scanner(System.in);    // Create a Scanner object\n    System.out.print("Enter a string: ");      // Prompt the user\n    String s = input.nextLine();               // Read the input line\n    System.out.printf("Is filtered \\"%s\\" a palindrome? %b",\n                      filter(s), isPalindrome(s)); // Display result\n  }\n\n  /** Return true if a string is a palindrome */\n  public static boolean isPalindrome(String s) {\n    // Create a new string s1 by eliminating nonalphanumeric chars\n    String s1 = filter(s);\n    String s2 = reverse(s1);  // s2 is the reverse of string s1\n    return s2.equals(s1);     // Check if s1 and s2 are equal\n  }')],
        explain: '<p>main reads a line and prints the filtered text and the answer with printf. <code>%b</code> prints a boolean (true or false) and <code>\\"</code> prints a quote mark.</p><p>isPalindrome is only three lines, because the work is split into two helper methods: filter and reverse.</p><p class="watch">equals is case sensitive: “Madam” reversed is “madaM”, so it is <b>not</b> a palindrome for this program.</p>' },
      51: { image: false, title: 'Checking Palindromes – cont\'d', blocks: [code('  /** Create a new string by eliminating nonalphanumeric chars */\n  public static String filter(String s) {\n    // Create a stringBuilder object\n    StringBuilder stringBuilder = new StringBuilder();\n\n    // Examine each char in the string to skip alphanumeric char\n    for (int i = 0; i < s.length(); i++) {\n      if (Character.isLetterOrDigit(s.charAt(i)))\n        stringBuilder.append(s.charAt(i));\n    }\n    return stringBuilder.toString();  // Return a new filtered string\n  }\n\n  /** Create a new string by reversing a specified string */\n  public static String reverse(String s) {\n    StringBuilder stringBuilder = new StringBuilder(s);\n    stringBuilder.reverse(); // Invoke reverse in StringBuilder\n    return stringBuilder.toString();\n  }\n}')],
        explain: '<p>Both helpers use a StringBuilder:</p><ul><li>filter starts with an empty builder and <b>appends</b> only the characters that are letters or digits. (The slide’s comment says “skip alphanumeric”, but the code keeps them.)</li><li>reverse makes a builder from s, calls reverse(), and returns it as a String.</li></ul><p>Both end with toString(), because the rest of the program works with String.</p>' }
    },
    visuals: ALL,
    exam: {
      questions: [
        { q: 'The user of a class needs to know…', options: ['how every method is coded inside', 'its contract: public constructors, methods and fields', 'its private fields and their values'], answer: 1, review: 3, why: 'Class abstraction.' },
        { type: 'output', q: 'What does this print?', code: 'Loan loan = new Loan();\nSystem.out.println(loan.getNumberOfYears());', answer: '1', review: 5, why: 'The no-arg constructor uses this(2.5, 1, 1000).' },
        { type: 'output', q: 'With the BMI class, what does this print?', code: 'BMI b = new BMI("Lee", 45, 1.70);\nSystem.out.println(b.getStatus());', answer: 'Underweight', review: 11, why: '45 / 2.89 = 15.57 < 18.5.' },
        { q: 'A class Car has a field <code>private Engine engine;</code>. This is…', options: ['aggregation (has-a)', 'inheritance', 'no relationship'], answer: 0, review: 17, why: 'A data field of another class type.' },
        { q: 'A course must have exactly one teacher. In UML this is shown by…', options: ['*', 'a filled diamond', 'the multiplicity 1'], answer: 2, review: 14, why: 'Multiplicities give the numbers.' },
        { type: 'output', q: 'What does this print?', code: 'StackOfIntegers st = new StackOfIntegers();\nfor (int i = 1; i <= 4; i++)\n  st.push(i * 10);\nst.pop();\nSystem.out.println(st.peek() + " " + st.getSize());', answer: '30 3', review: 24, why: 'pop removes 40; the top is 30 and three remain.' },
        { type: 'output', q: 'What does this print?', code: 'StackOfIntegers st = new StackOfIntegers(2);\nst.push(1); st.push(2); st.push(3);\nSystem.out.println(st.getSize());', answer: '3', review: 24, why: 'The array grows from 2 to 4 automatically.' },
        { type: 'output', q: 'What does this print?', code: 'Integer a = 7;\nint b = a * 2;\nSystem.out.println(b);', answer: '14', review: 29, why: 'Boxing, then unboxing.' },
        { type: 'output', q: 'What does this print?', code: 'System.out.println(Integer.MAX_VALUE + 1);', answer: '-2147483648', review: 30, why: 'int overflow wraps to MIN_VALUE.' },
        { type: 'output', q: 'What does this print?', code: 'Double d = Double.valueOf("2.5");\nSystem.out.println(d.intValue());', answer: '2', review: 31, why: 'intValue cuts the decimals.' },
        { type: 'output', q: 'What does this print?', code: 'BigInteger x = new BigInteger("5");\nx.multiply(new BigInteger("2"));\nSystem.out.println(x);', answer: '5', review: 34, why: 'BigInteger is immutable; the result was not saved.' },
        { type: 'output', q: 'What does this print?', code: 'String s = "Java";\ns.replace(\'a\', \'o\');\nSystem.out.println(s);', answer: 'Java', review: 39, why: 'replace returns a new string; s is unchanged.' },
        { type: 'output', q: 'What does this print?', code: 'System.out.println("banana".replace("an", "_"));', answer: 'b__a', review: 40, why: 'Both "an" are replaced.' },
        { type: 'output', q: 'What does this print?', code: 'String[] p = "2024-10-22".split("-");\nSystem.out.println(p[1]);', answer: '10', review: 41, why: 'The pieces are 2024, 10, 22.' },
        { type: 'output', q: 'What does this print?', code: 'StringBuilder sb = new StringBuilder("Hello");\nsb.delete(1, 3);\nSystem.out.println(sb);', answer: 'Hlo', review: 47, why: 'Indexes 1 and 2 (e, l) are removed.' },
        { type: 'output', q: 'What does this print?', code: 'StringBuilder sb = new StringBuilder();\nSystem.out.println(sb.length() + " " + sb.capacity());', answer: '0 16', review: 48, why: 'Empty, with room for 16.' },
        { type: 'output', q: 'With isPalindrome of slide 50, what does this print?', code: 'System.out.println(isPalindrome("a+b-a"));', answer: 'true', review: 49, why: 'Filtered: "aba", which reads the same backwards.' },
        { type: 'fill', q: 'The parameter has the same name as the field. Complete the setter.', code: 'public void setLoanAmount(double loanAmount) {\n  ___.loanAmount = loanAmount;\n}', answer: ['this'], review: 6, why: 'this.loanAmount is the field; loanAmount alone is the parameter.' },
        { type: 'fill', q: 'Name what Java does on each line.', code: 'Integer obj = 7;    // auto ___\nint j = obj + 1;    // auto ___', answer: ['boxing', 'unboxing'], review: 29, why: 'Boxing puts the int into an Integer object; unboxing takes it out again.' },
        { type: 'write', q: 'a and b are BigInteger variables. Store their sum in a new BigInteger named x (objects cannot use +).', checks: [{ re: /BigInteger\s+x\s*=\s*a\s*\.\s*add\s*\(\s*b\s*\)\s*;/, label: 'BigInteger x = a.add(b);' }], solution: 'BigInteger x = a.add(b);', review: 35, why: 'Big numbers are objects: you call methods like add and multiply.' },
        { type: 'write', q: 'Make a StringBuilder sb from "abc", append "def", reverse it, and print it (it prints fedcba).', rows: 4, checks: [{ re: /StringBuilder\s+sb\s*=\s*new\s+StringBuilder\s*\(\s*"abc"\s*\)\s*;/, label: 'StringBuilder sb = new StringBuilder("abc");' }, { re: /sb\s*\.\s*append\s*\(\s*"def"\s*\)/, label: 'sb.append("def")' }, { re: /sb\s*\.\s*reverse\s*\(\s*\)/, label: 'sb.reverse()' }, { re: /System\s*\.\s*out\s*\.\s*println\s*\(\s*sb\s*(\.\s*toString\s*\(\s*\)\s*)?\)\s*;/, label: 'System.out.println(sb);' }], solution: 'StringBuilder sb = new StringBuilder("abc");\nsb.append("def");\nsb.reverse();\nSystem.out.println(sb);', review: 47, why: 'Every call changes the same builder; println calls its toString.' },
        { type: 'trace', q: 'Follow the stack.', code: 'StackOfIntegers st = new StackOfIntegers();\nst.push(4);\nst.push(7);\nst.push(1);\nint a = st.pop();\nint b = st.peek();', cols: ['expression', 'value'], rows: [['a', '?1'], ['b', '?7'], ['st.getSize()', '?2']], review: 24, why: 'pop takes the last value in (1). peek looks at the new top (7) without removing it, so 4 and 7 stay.' },
        { type: 'bug', q: 'The comment says HELLO, but the program prints hello. Tap the line with the mistake.', code: 'String s = "hello";\ns.toUpperCase();\nSystem.out.println(s);   // should print HELLO', answer: 2, review: 39, why: 'Strings are immutable: toUpperCase returns a new string, and here it is thrown away. Write s = s.toUpperCase();' },
        { type: 'match', q: 'Match each sentence with the relationship.', pairs: [['A doctor treats patients', 'Association'], ['A library has books', 'Aggregation'], ['A house has rooms that cannot exist without it', 'Composition']], review: 16, why: 'Association: they work together. Aggregation: has-a ownership. Composition: the part cannot exist alone.' }
      ],
      tasks: [
        {
          title: 'Keep only the digits with a StringBuilder',
          task: '<p>Write <code>public static String digitsOnly(String s)</code> that returns only the digits of s. Use a <b>StringBuilder</b> and <code>Character.isDigit</code>, and return <code>toString()</code>.</p>',
          starter: 'public class Digits {\n  public static void main(String[] args) {\n    System.out.println(digitsOnly("a1b22c3"));\n  }\n\n}',
          output: '1223',
          checks: [
            { re: /public\s+static\s+String\s+digitsOnly\s*\(\s*String\s+\w+\s*\)/, label: 'Header: <code>public static String digitsOnly(String s)</code>', review: 51 },
            { re: /new\s+StringBuilder\s*\(\s*\)/, label: 'Creates a <code>new StringBuilder()</code>', review: 45 },
            { re: /Character\.isDigit\s*\(/, label: 'Uses <code>Character.isDigit</code>', review: 49 },
            { re: /\.append\s*\(/, label: 'Uses <code>append</code>', review: 47 },
            { re: /return\s+\w+\.toString\s*\(\s*\)\s*;/, label: 'Returns <code>….toString()</code>', review: 48 }
          ],
          solution: 'public class Digits {\n  public static void main(String[] args) {\n    System.out.println(digitsOnly("a1b22c3"));\n  }\n\n  public static String digitsOnly(String s) {\n    StringBuilder sb = new StringBuilder();\n    for (int i = 0; i < s.length(); i++) {\n      if (Character.isDigit(s.charAt(i)))\n        sb.append(s.charAt(i));\n    }\n    return sb.toString();\n  }\n}'
        },
        {
          title: 'Sum the pieces of a string',
          task: '<p>The string <code>data</code> holds numbers separated by commas. <b>split</b> it, turn each piece into an int with <code>Integer.parseInt</code>, and print the sum.</p>',
          starter: 'public class SumCsv {\n  public static void main(String[] args) {\n    String data = "4,15,8,23";\n    \n  }\n}',
          output: '50',
          checks: [
            { re: /String\s*\[\s*\]\s*\w+\s*=\s*data\.split\s*\(\s*","\s*\)/, label: 'Splits with <code>data.split(",")</code>', review: 41 },
            { re: /Integer\.parseInt\s*\(/, label: 'Uses <code>Integer.parseInt</code>', review: 33 },
            { re: /for\s*\(/, label: 'Loops over the pieces', review: 41 },
            { re: /println\s*\(\s*\w+\s*\)/, label: 'Prints the sum', review: 33 }
          ],
          solution: 'public class SumCsv {\n  public static void main(String[] args) {\n    String data = "4,15,8,23";\n    String[] parts = data.split(",");\n    int sum = 0;\n    for (int i = 0; i < parts.length; i++)\n      sum += Integer.parseInt(parts[i]);\n    System.out.println(sum);\n  }\n}'
        },
        {
          title: 'A small aggregating class',
          task: '<p>Write a class <code>Team</code> that <b>has</b> a private <code>String[] members</code> (room for 10) and a private int <code>count</code>. Add <code>addMember(String name)</code> (store at index count, then count++) and <code>getCount()</code>.</p>',
          starter: 'public class Team {\n  \n}',
          output: 'after addMember twice, getCount() returns 2',
          checks: [
            { re: /private\s+String\s*\[\s*\]\s*members\s*=\s*new\s+String\s*\[\s*10\s*\]/, label: '<code>private String[] members = new String[10];</code>', review: 19 },
            { re: /private\s+int\s+count/, label: '<code>private int count</code>', review: 19 },
            { re: /void\s+addMember\s*\(\s*String\s+\w+\s*\)\s*\{[\s\S]*members\s*\[\s*count\s*(\+\+)?\s*\]\s*=[\s\S]*\}/, label: '<code>addMember</code> stores at index count', review: 19 },
            { re: /count\s*\+\+|\+\+\s*count|members\s*\[\s*count\s*\+\+\s*\]/, label: 'count goes up by 1', review: 19 },
            { re: /int\s+getCount\s*\(\s*\)\s*\{\s*return\s+count\s*;/, label: '<code>getCount()</code> returns count', review: 19 }
          ],
          solution: 'public class Team {\n  private String[] members = new String[10];\n  private int count;\n\n  public void addMember(String name) {\n    members[count] = name;\n    count++;\n  }\n\n  public int getCount() {\n    return count;\n  }\n}'
        }
      ]
    }
  });
})();
