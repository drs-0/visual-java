/* CS2 · Object Oriented Thinking: quick checks under the slides (1-2 per slide) and more part-quiz questions. */
addChecks({
  course: 'cs2', lesson: '03-object-oriented-thinking',
  slides: {
    1: [
      { q: 'What do classes give us, according to slide 1?', options: ['More flexibility and modularity for reusable software', 'Faster loops', 'Shorter variable names'], answer: 0, why: 'This unit shows the benefits of reusable code.' }
    ],
    2: [
      { type: 'tf', q: 'This unit covers the StringBuilder class.', answer: true, why: 'It is the last topic of the outline.' }
    ],
    3: [
      { type: 'match', q: 'Match each person with what they need to know.', pairs: [['The creator of the class', 'How the class is implemented'], ['The user (client) of the class', 'Only how the class can be used']], why: 'The implementation is encapsulated and hidden from the user.' }
    ],
    4: [
      { q: 'In the Loan UML diagram, which members are private?', options: ['The data fields', 'The constructors', 'The get methods'], answer: 0, why: 'The data fields are private; the constructors and methods are public.' }
    ],
    5: [
      { type: 'output', q: 'What does this print?', code: 'Loan loan = new Loan();\nSystem.out.println(loan.getAnnualInterestRate() + " " + loan.getLoanAmount());', answer: '2.5 1000.0', why: 'The no-arg constructor calls this(2.5, 1, 1000).' }
    ],
    6: [
      { type: 'output', q: 'What does this print?', code: 'Loan loan = new Loan(5, 10, 20000);\nloan.setNumberOfYears(15);\nSystem.out.println(loan.getNumberOfYears());', answer: '15', why: 'The setter changed the private field.' }
    ],
    7: [
      { q: 'Why is the annual rate divided by 1200?', options: ['To get the rate per month as a fraction (÷ 12 months, ÷ 100)', 'Because there are 1200 days', 'To round the result'], answer: 0, why: 'For example 6% a year is 0.005 per month.' },
      { type: 'tf', q: 'getTotalPayment calls getMonthlyPayment.', answer: true, why: 'Total = monthly payment x years x 12.' }
    ],
    8: [
      { type: 'tf', q: 'TestLoanClass computes the monthly payment itself, with a formula in main.', answer: false, why: 'The Loan object does the work; main only asks it.' }
    ],
    9: [
      { type: 'fill', q: 'Complete the BMI formula.', code: 'double bmi = weight / (height ___ height);', answer: ['*'], why: 'BMI is weight divided by height squared.' }
    ],
    10: [
      { type: 'output', q: 'What does this print?', code: 'BMI b = new BMI("Lina", 55, 1.6);\nSystem.out.println(b.getName() + " " + b.getAge());', answer: 'Lina 20', why: 'The constructor with three parameters calls this(name, 20, weight, height).' }
    ],
    11: [
      { type: 'trace', q: 'What do getBMI and getStatus return?', cols: ['weight', 'height', 'getBMI()', 'getStatus()'], rows: [['50', '1.6', '?19.53', '?Normal'], ['54', '1.8', '?16.67', '?Underweight'], ['80', '1.6', '?31.25', '?Obese']], why: '50 / 2.56 = 19.53, 54 / 3.24 = 16.67, 80 / 2.56 = 31.25. Then the status ranges of getStatus.' }
    ],
    12: [
      { type: 'output', q: 'What does the second line of UseBMIClass print?', code: 'BMI bmi2 = new BMI("Susan King", 97, 1.83);\nSystem.out.println("The BMI for " + bmi2.getName() + " is "\n  + bmi2.getBMI() + " " + bmi2.getStatus());', answer: 'The BMI for Susan King is 28.96 Overweight', why: '97 / (1.83 x 1.83) = 28.96, which is 25 or more but less than 30.' }
    ],
    13: [
      { q: 'What comes next in the outline?', options: ['Class relationships', 'The String class', 'Recursion'], answer: 0, why: 'Association, aggregation and composition.' }
    ],
    14: [
      { type: 'trace', q: 'Read the multiplicities of slide 14.', cols: ['question', 'answer'], rows: [['How many courses can a faculty member teach?', '?0..3|at most 3|3'], ['How many students can a course have?', '?5..60|5 to 60']], why: 'A faculty member teaches at most three courses; a course has 5 to 60 students.' }
    ],
    15: [
      { q: 'How is an association implemented in code?', options: ['With data fields and methods, like addCourse and addStudent', 'With a special keyword', 'It cannot be written in code'], answer: 0, why: 'Slide 15.' }
    ],
    16: [
      { type: 'match', q: 'Match each relationship with its UML mark.', pairs: [['Aggregation', 'An empty diamond on the owner’s side'], ['Composition', 'A filled diamond on the owner’s side'], ['Association', 'A solid line']], why: 'Slides 14 and 16.' }
    ],
    17: [
      { q: 'In slide 17, which is the aggregating class?', options: ['Student', 'Name', 'Address'], answer: 0, why: 'Student has the fields name and address.' }
    ],
    18: [
      { type: 'tf', q: 'A Course object keeps the names of its students in an array.', answer: true, why: 'String[] students = new String[100];' }
    ],
    19: [
      { type: 'trace', q: 'Follow the Course object.', code: 'Course c = new Course("Java");\nc.addStudent("Ali");\nc.addStudent("Mona");', cols: ['after line', 'numberOfStudents', 'students[1]'], rows: [['1', '?0', '?null'], ['2', '?1', '?null'], ['3', '?2', '?Mona']], why: 'numberOfStudents is the count and the index of the next free place.' }
    ],
    20: [
      { type: 'output', q: 'What does the first part of TestCourse print?', code: 'System.out.println("Number of students in course1: "\n  + course1.getNumberOfStudents());\nString[] students = course1.getStudents();\nfor (int i = 0; i < course1.getNumberOfStudents(); i++)\n  System.out.println(students[i]);', answer: 'Number of students in course1: 3\nPeter Jones\nKim Smith\nAnne Kennedy', why: 'course1 got three students, in this order.' }
    ],
    21: [
      { q: 'What does LIFO mean?', options: ['Last-In, First-Out', 'Last-In, Final-Out', 'List-In, First-Out'], answer: 0, why: 'The last item put on the stack is the first taken off.' }
    ],
    22: [
      { type: 'match', q: 'Match each stack operation with what it does.', pairs: [['push', 'Adds a value on top'], ['pop', 'Removes the top value and returns it'], ['peek', 'Returns the top value without removing it']], why: 'Slide 22.' }
    ],
    23: [
      { q: 'Where is the top of the stack in the elements array?', options: ['elements[size - 1]', 'elements[0]', 'elements[elements.length - 1]'], answer: 0, why: 'elements[0] is the bottom.' }
    ],
    24: [
      { type: 'trace', q: 'Follow the stack, line by line.', code: 'StackOfIntegers st = new StackOfIntegers();\nst.push(5);\nst.push(8);\nint a = st.pop();\nst.push(2);', cols: ['after line', 'size', 'top (peek)'], rows: [['2', '?1', '?5'], ['3', '?2', '?8'], ['4', '?1', '?5'], ['5', '?2', '?2']], why: 'push adds on top; pop takes the top (8) away.' }
    ],
    25: [
      { type: 'output', q: 'What does TestStackOfIntegers print?', code: 'StackOfIntegers stack = new StackOfIntegers();\nfor (int i = 0; i < 10; i++)\n  stack.push(i);\nwhile (!stack.empty())\n  System.out.print(stack.pop() + " ");', answer: '9 8 7 6 5 4 3 2 1 0', why: 'The values come out in the reverse order.' }
    ],
    26: [
      { q: 'What comes next in the outline?', options: ['Wrapper classes for primitive types', 'Class relationships', 'The Loan class'], answer: 0, why: 'Then BigInteger and BigDecimal.' }
    ],
    27: [
      { type: 'match', q: 'Match each primitive type with its wrapper class.', pairs: [['int', 'Integer'], ['char', 'Character'], ['double', 'Double'], ['boolean', 'Boolean']], why: 'Slide 27.' }
    ],
    28: [
      { q: 'Which member of Integer is static (underlined in UML)?', options: ['Integer.parseInt', 'intValue()', 'toString() of one object'], answer: 0, why: 'Static members are called with the class name.' }
    ],
    29: [
      { type: 'output', q: 'What does slide 29 compute?', code: 'int i = 2;\nInteger obj = i + 3;\nint j = obj - 1;\nSystem.out.println(obj + " " + j);', answer: '5 4', why: 'Auto boxing puts 5 into obj; auto unboxing takes it out for obj - 1.' }
    ],
    30: [
      { type: 'trace', q: 'Fill in the constants of slide 30.', cols: ['constant', 'value'], rows: [['Integer.MAX_VALUE', '?2147483647'], ['Integer.MIN_VALUE', '?-2147483648'], ['Double.MIN_VALUE', '?4.9E-324']], why: 'For Double, MIN_VALUE is the smallest positive value.' }
    ],
    31: [
      { type: 'output', q: 'What does this print?', code: 'Double d = 7.9;\nSystem.out.println(d.intValue() + " " + d.doubleValue());', answer: '7 7.9', why: 'intValue cuts the fraction off; doubleValue gives the double.' }
    ],
    32: [
      { type: 'write', q: 'Create an Integer object from the string "25" with valueOf, in a new variable named n.', checks: [{ re: /Integer\s+n\s*=\s*Integer\s*\.\s*valueOf\s*\(\s*"25"\s*\)\s*;/, label: 'Integer n = Integer.valueOf("25");' }], solution: 'Integer n = Integer.valueOf("25");', why: 'valueOf returns a new object.' }
    ],
    33: [
      { type: 'match', q: 'Match each call with what it returns.', pairs: [['Integer.parseInt("13")', 'the int 13'], ['Integer.valueOf("13")', 'an Integer object holding 13'], ['Double.parseDouble("1.5")', 'the double 1.5']], why: 'parse gives a primitive; valueOf gives an object.' }
    ],
    34: [
      { q: 'In which package are BigInteger and BigDecimal?', options: ['java.math', 'java.util', 'java.lang'], answer: 0, why: 'Slide 34.' },
      { type: 'tf', q: 'BigInteger and BigDecimal objects are immutable.', answer: true, why: 'A method like multiply returns a new object.' }
    ],
    35: [
      { type: 'output', q: 'What does this print?', code: 'BigInteger a = new BigInteger("9223372036854775807");\nBigInteger b = new BigInteger("2");\nBigInteger c = a.multiply(b);\nSystem.out.println(c);', answer: '18446744073709551614', why: 'The result does not fit in a long, but a BigInteger holds it.' }
    ],
    36: [
      { type: 'output', q: 'With factorial of slide 36, what does this print?', code: 'System.out.println(factorial(5) + " " + factorial(1));', answer: '120 1', why: '5! = 120. For n = 1 the loop does not run, so result stays 1.' }
    ],
    37: [
      { q: 'What comes next in the outline?', options: ['The String class', 'Wrapper classes', 'Stacks'], answer: 0, why: 'Then StringBuilder.' }
    ],
    38: [
      { type: 'match', q: 'Match each line with how it makes a String.', pairs: [['new String("Welcome to Java")', 'With the String constructor'], ['"Welcome to Java"', 'With the shorthand initializer']], why: 'Both give a String object.' }
    ],
    39: [
      { type: 'output', q: 'What does this print?', code: 'String s = "Java";\nString t = s;\ns = "HTML";\nSystem.out.println(s + " " + t);', answer: 'HTML Java', why: 's now refers to a new object; the "Java" object did not change, and t still refers to it.' }
    ],
    40: [
      { type: 'trace', q: 'What does each call return?', cols: ['call', 'returns'], rows: [['"Welcome".replace("e", "AB")', '?WABlcomAB'], ['"Welcome".replace("el", "AB")', '?WABcome'], ['"Hello".replace(\'l\', \'L\')', '?HeLLo']], why: 'replace changes every match; the original string stays the same.' }
    ],
    41: [
      { type: 'output', q: 'What does this print?', code: 'String[] tokens = "red;green;blue".split(";");\nSystem.out.println(tokens.length + " " + tokens[2]);', answer: '3 blue', why: 'The delimiter ; cuts the string into three tokens.' }
    ],
    42: [
      { type: 'output', q: 'What does this print?', code: 'String s = String.valueOf(5.44) + String.valueOf(\'x\');\nSystem.out.println(s);', answer: '5.44x', why: 'valueOf turns each value into a String; + joins them.' }
    ],
    43: [
      { type: 'output', q: 'What does this print? Type the spaces too.', code: 'String s = String.format("%6.1f|%3d", 3.14159, 7);\nSystem.out.println(s);', answer: '   3.1|  7', why: '%6.1f: 3.1 in 6 places (3 spaces). %3d: 7 in 3 places (2 spaces).' }
    ],
    44: [
      { q: 'What comes next in the outline?', options: ['The StringBuilder class', 'The String class', 'BigDecimal'], answer: 0, why: 'The last topic of the unit.' }
    ],
    45: [
      { type: 'tf', q: 'You can change the content of a StringBuilder object.', answer: true, why: 'append, delete, insert, replace and reverse change it.' }
    ],
    46: [
      { type: 'output', q: 'What does this print?', code: 'StringBuilder sb = new StringBuilder("abcdef");\nsb.delete(1, 4);\nSystem.out.println(sb);', answer: 'aef', why: 'delete(1, 4) removes the characters at 1, 2 and 3 (the end index is not included).' }
    ],
    47: [
      { type: 'trace', q: 'Follow the examples of slide 47.', cols: ['call', 's after it'], rows: [['s.append("Welcome")', '?Welcome'], ['s.append(\' \'); s.append("to Java")', '?Welcome to Java'], ['s.insert(11, "Best ")', '?Welcome to Best Java'], ['s.delete(8, 16)', '?Welcome Java']], why: 'Every call changes the same object s.' }
    ],
    48: [
      { type: 'output', q: 'What does this print?', code: 'StringBuilder sb = new StringBuilder();\nsb.append("Hi");\nSystem.out.println(sb.length() + " " + sb.capacity());', answer: '2 16', why: 'length is the characters stored; the capacity of a new builder is 16.' }
    ],
    49: [
      { type: 'trace', q: 'Filter each string: keep only letters and digits.', cols: ['string', 'filtered'], rows: [['"a,b-a"', '?aba'], ['"No 1 on!"', '?No1on'], ['"A1!b2"', '?A1b2']], why: 'Character.isLetterOrDigit keeps letters and digits only.' }
    ],
    50: [
      { type: 'output', q: 'What does the Palindrome program print for the input  race car ?', code: 'System.out.printf("Is filtered \\"%s\\" a palindrome? %b",\n                  filter(s), isPalindrome(s));', answer: 'Is filtered "racecar" a palindrome? true', why: 'The space is removed: racecar reads the same both ways.' }
    ],
    51: [
      { type: 'write', q: 'Write the body of reverse(String s): build a StringBuilder from s, reverse it, and return it as a String.', rows: 3, checks: [{ re: /new\s+StringBuilder\s*\(\s*s\s*\)/, label: 'new StringBuilder(s)' }, { re: /\.\s*reverse\s*\(\s*\)/, label: '.reverse()' }, { re: /return\s+[\s\S]*toString\s*\(\s*\)\s*;/, label: 'return … .toString();' }], solution: 'StringBuilder stringBuilder = new StringBuilder(s);\nstringBuilder.reverse();\nreturn stringBuilder.toString();', why: 'Like slide 51.' }
    ]
  },
  parts: {
    0: [
      { type: 'trace', q: 'What does getStatus return for each BMI value?', cols: ['BMI', 'status'], rows: [['18.4', '?Underweight'], ['18.5', '?Normal'], ['29.99', '?Overweight'], ['30.0', '?Obese']], why: 'Below 18.5 is Underweight; then below 25, below 30; 30 or more is Obese.' },
      { type: 'write', q: 'Create a Loan of 50000 for 5 years at 4.5% in a new variable named myLoan.', checks: [{ re: /Loan\s+myLoan\s*=\s*new\s+Loan\s*\(\s*4\.5\s*,\s*5\s*,\s*50000(\.0)?\s*\)\s*;/, label: 'Loan myLoan = new Loan(4.5, 5, 50000);' }], solution: 'Loan myLoan = new Loan(4.5, 5, 50000);', why: 'The order is: annualInterestRate, numberOfYears, loanAmount.' },
      { type: 'tf', q: 'A user of the Loan class must know the formula of getMonthlyPayment.', answer: false, why: 'Class abstraction: the user only needs the contract.' }
    ],
    1: [
      { type: 'output', q: 'What does this print?', code: 'StackOfIntegers st = new StackOfIntegers();\nst.push(4); st.push(6); st.push(9);\nst.pop();\nst.push(1);\nSystem.out.println(st.pop() + " " + st.pop() + " " + st.getSize());', answer: '1 6 1', why: 'After pop and push(1), the stack is 4, 6, 1. Popping twice gives 1 and 6; one value (4) is left.' },
      { type: 'match', q: 'Match each sentence with the relationship.', pairs: [['A student takes a course', 'Association'], ['A student has an address', 'Aggregation'], ['A body has a heart that cannot exist alone', 'Composition']], why: 'Composition is aggregation where the part cannot exist on its own.' },
      { type: 'bug', q: 'This addStudent loses students. Tap the wrong line.', code: 'public void addStudent(String student) {\n  students[numberOfStudents] = student;\n  numberOfStudents--;\n}', answer: 3, why: 'The count must go up: numberOfStudents++.' }
    ],
    2: [
      { type: 'output', q: 'What does this print?', code: 'Integer a = Integer.valueOf("40");\nint b = a + 2;\nSystem.out.println(b + " " + Integer.MAX_VALUE / 1000000000);', answer: '42 2', why: 'Unboxing gives 40 + 2. 2147483647 / 1000000000 is 2 (integer division).' },
      { type: 'output', q: 'What does this print?', code: 'BigInteger x = new BigInteger("7");\nx = x.multiply(new BigInteger("6"));\nSystem.out.println(x);', answer: '42', why: 'multiply returns a new object, and this time it is stored back in x.' },
      { type: 'tf', q: 'The instances of all wrapper classes are immutable.', answer: true, why: 'Their values cannot change once the objects are created.' }
    ],
    3: [
      { type: 'output', q: 'What does this print?', code: 'String s = "a-b-c-d";\nString t = s.replaceFirst("-", "+");\nSystem.out.println(t + " " + s.split("-").length);', answer: 'a+b-c-d 4', why: 'replaceFirst changes only the first -. s itself is unchanged and splits into 4 tokens.' },
      { type: 'write', q: 'Split the String line at each comma into a new array named parts.', checks: [{ re: /String\s*\[\s*\]\s*parts\s*=\s*line\s*\.\s*split\s*\(\s*","\s*\)\s*;/, label: 'String[] parts = line.split(",");' }], solution: 'String[] parts = line.split(",");', why: 'split returns an array of String tokens.' }
    ],
    4: [
      { type: 'output', q: 'What does this print?', code: 'StringBuilder s = new StringBuilder("Welcome Java");\ns.replace(8, 12, "HTML");\ns.setCharAt(0, \'w\');\ns.reverse();\nSystem.out.println(s);', answer: 'LMTH emoclew', why: 'The last steps of slide 47: "Welcome HTML", then "welcome HTML", then reversed.' },
      { type: 'tf', q: '"Madam" is a palindrome for the program of slides 50-51.', answer: false, why: 'equals is case sensitive: "madaM" is not equal to "Madam".' },
      { type: 'match', q: 'Match each class with a fact about it.', pairs: [['String', 'Immutable: methods return new strings'], ['StringBuilder', 'Can be changed in place']], why: 'Slides 39 and 45.' }
    ]
  }
});
