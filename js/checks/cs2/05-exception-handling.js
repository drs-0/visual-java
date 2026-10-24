/* CS2 · Exception Handling: quick checks under the slides (1-2 per slide) and more part-quiz questions. */
addChecks({
  course: 'cs2', lesson: '05-exception-handling',
  slides: {
    1: [
      { q: 'What happens to a program with a runtime error that is not handled?', options: ['It terminates abnormally', 'It skips the error and goes on', 'It restarts'], answer: 0, why: 'Exception handling lets it continue gracefully.' }
    ],
    2: [
      { type: 'tf', q: 'This unit covers the finally clause.', answer: true, why: 'It is in the outline.' }
    ],
    3: [
      { type: 'match', q: 'Match each mistake with the exception it causes.', pairs: [['Dividing an integer by 0', 'ArithmeticException'], ['Typing a double when an int is expected', 'InputMismatchException'], ['Using an array index out of bounds', 'ArrayIndexOutOfBoundsException']], why: 'Slide 3.' }
    ],
    4: [
      { q: 'The user types 3 0 for the Quotient program. What happens?', options: ['An ArithmeticException stops the program at the division', 'It prints 3 / 0 is 0', 'It asks again'], answer: 0, why: 'The message names the exception and the line.' }
    ],
    5: [
      { type: 'output', q: 'QuotientWithIf: the user types 8 0. What is printed after the prompt?', code: 'if (number2 != 0)\n  System.out.println(number1 + " / " + number2\n    + " is " + (number1 / number2));\nelse\n  System.out.println("Divisor cannot be zero ");', answer: 'Divisor cannot be zero', why: 'number2 is 0, so the else part runs. (Spaces at the end do not matter.)' }
    ],
    6: [
      { type: 'tf', q: 'In QuotientWithMethod, quotient ends the whole program when the divisor is 0.', answer: true, why: 'It calls System.exit(1).' }
    ],
    7: [
      { q: 'Who should decide whether to terminate the program?', options: ['The caller', 'The quotient method', 'The JVM always'], answer: 0, why: 'The method can throw an exception; the caller can catch it.' }
    ],
    8: [
      { type: 'output', q: 'With slide 8, the user types 10 2. What is printed?', code: 'try {\n  int result = quotient(number1, number2);\n  System.out.println(number1 + " / " + number2 + " is " + result);\n}\ncatch (ArithmeticException ex) {\n  System.out.println("Exception: an integer cannot be divided by zero ");\n}\nSystem.out.println("Execution continues ...");', answer: '10 / 2 is 5\nExecution continues ...', why: 'No exception: the catch block is skipped.' }
    ],
    9: [
      { type: 'write', q: 'Throw an IllegalArgumentException with the message "Age is negative".', checks: [{ re: /throw\s+new\s+IllegalArgumentException\s*\(\s*"Age is negative"\s*\)\s*;/, label: 'throw new IllegalArgumentException("Age is negative");' }], solution: 'throw new IllegalArgumentException("Age is negative");', why: 'An exception is an object: create it with new, then throw it.' }
    ],
    10: [
      { type: 'order', q: 'Put the parts of a try-catch in order.', lines: ['try {', '  code that may throw an exception;', '} catch (ArithmeticException ex) {', '  code to process the exception;', '}'], why: 'The try block first, then the catch block.' }
    ],
    11: [
      { type: 'match', q: 'Match each job with where it is done.', pairs: [['Detecting the error', 'In the called method'], ['Handling the error', 'In the calling method']], why: 'The key benefit of exceptions: they are separated.' }
    ],
    12: [
      { type: 'output', q: 'The user types 4.5, then 7. What is printed? (Leave out the prompts.)', code: 'do {\n  try {\n    int number = input.nextInt();\n    System.out.println("The number entered is " + number);\n    continueInput = false;\n  }\n  catch (InputMismatchException ex) {\n    System.out.println("Try again. (Incorrect input: an integer is required)");\n    input.nextLine();\n  }\n} while (continueInput);', answer: 'Try again. (Incorrect input: an integer is required)\nThe number entered is 7', why: '4.5 is not an int, so the catch runs and the loop asks again.' }
    ],
    13: [
      { q: 'What comes next in the outline?', options: ['Exception types', 'The finally clause', 'Custom exceptions'], answer: 0, why: 'The family of exception classes.' }
    ],
    14: [
      { q: 'Which class is the root of all exception classes?', options: ['java.lang.Throwable', 'java.lang.Error', 'java.lang.RuntimeException'], answer: 0, why: 'Slide 14.' }
    ],
    15: [
      { type: 'match', q: 'Match each exception with its cause.', pairs: [['NullPointerException', 'Using an object through a null reference'], ['IOException', 'A problem with input or output, like a missing file'], ['IllegalArgumentException', 'Passing an illegal argument to a method'], ['ClassNotFoundException', 'Running a class that does not exist']], why: 'Slide 15.' }
    ],
    16: [
      { type: 'tf', q: 'The compiler forces you to deal with checked exceptions.', answer: true, why: 'All exceptions except RuntimeException, Error and their subclasses are checked.' }
    ],
    17: [
      { q: 'Which of these is unchecked?', options: ['ArithmeticException', 'IOException', 'ClassNotFoundException'], answer: 0, why: 'It is a RuntimeException.' }
    ],
    18: [
      { q: 'What is usually the right answer to an unchecked exception?', options: ['Fix the logic error in the code', 'Catch it everywhere', 'Ignore it'], answer: 0, why: 'Unchecked exceptions usually show programming mistakes.' }
    ],
    19: [
      { q: 'What comes next in the outline?', options: ['Declaring, throwing and catching exceptions', 'Exception types', 'When to use exceptions'], answer: 0, why: 'The three keywords: throws, throw and catch.' }
    ],
    20: [
      { type: 'match', q: 'Match each keyword with what it does.', pairs: [['throws', 'Declares that a method may throw an exception'], ['throw', 'Throws an exception object'], ['catch', 'Handles the exception']], why: 'Slide 20.' }
    ],
    21: [
      { type: 'write', q: 'Write the header of a method readFile that may throw an IOException. End it with {.', checks: [{ re: /public\s+void\s+readFile\s*\(\s*\)\s*throws\s+IOException\s*\{/, label: 'public void readFile() throws IOException {' }], solution: 'public void readFile() throws IOException {', why: 'throws goes in the header.' }
    ],
    22: [
      { type: 'bug', q: 'This line does not compile. Tap it.', code: 'if (radius <= 0)\n  throws new IllegalArgumentException("Radius must be positive");', answer: 2, why: 'In the body the keyword is throw (no s).' }
    ],
    23: [
      { type: 'output', q: 'What does this print?', code: 'try {\n  System.out.println("1");\n  Object o = null;\n  o.toString();\n  System.out.println("2");\n}\ncatch (ArithmeticException ex) {\n  System.out.println("3");\n}\ncatch (NullPointerException ex) {\n  System.out.println("4");\n}\nSystem.out.println("5");', answer: '1\n4\n5', why: 'The rest of the try is skipped; only the matching catch runs.' }
    ],
    24: [
      { type: 'trace', q: 'Use slide 24. Who catches each exception type?', cols: ['exception thrown in method3', 'caught by'], rows: [['Exception3', '?method2'], ['Exception2', '?method1'], ['Exception1', '?main']], why: 'The exception travels back along the calls until a method catches it.' }
    ],
    25: [
      { type: 'match', q: 'p2 declares throws IOException. Match each p1 with whether it compiles.', pairs: [['void p1() { p2(); }', 'No: it neither catches nor declares'], ['void p1() throws IOException { p2(); }', 'Yes: it declares'], ['void p1() { try { p2(); } catch (IOException ex) { } }', 'Yes: it catches']], why: 'Catch or declare.' }
    ],
    26: [
      { q: 'What comes next in the outline?', options: ['Getting information from exceptions', 'The finally clause', 'Exception types'], answer: 0, why: 'getMessage, toString and printStackTrace.' }
    ],
    27: [
      { type: 'match', q: 'Match each method with what it returns or does.', pairs: [['getMessage()', 'The message only'], ['toString()', 'The class name, ": " and the message'], ['printStackTrace()', 'Shows which methods were running']], why: 'Slide 27.' }
    ],
    28: [
      { type: 'tf', q: 'setRadius of slide 28 throws an exception when the radius is 0.', answer: false, why: 'It checks newRadius >= 0, so 0 is accepted. Only negative values throw.' }
    ],
    29: [
      { type: 'output', q: 'What does TestCircleWithException print?', code: 'try {\n  CircleWithException c1 = new CircleWithException(5);\n  CircleWithException c2 = new CircleWithException(-5);\n  CircleWithException c3 = new CircleWithException(2);\n}\ncatch (IllegalArgumentException ex) {\n  System.out.println(ex.getMessage());\n}\nSystem.out.println("Number of objects created: " +\n  CircleWithException.getNumberOfObjects());', answer: 'Radius cannot be negative\nNumber of objects created: 1', why: 'c2 throws before it is counted, and c3 is never created.' }
    ],
    30: [
      { q: 'What comes next in the outline?', options: ['The finally clause', 'Custom exceptions', 'Rethrowing'], answer: 0, why: 'Statements that always run.' }
    ],
    31: [
      { q: 'What is finally often used for?', options: ['Closing a file or freeing a resource', 'Throwing an exception', 'Starting the program'], answer: 0, why: 'It runs whatever happens in try.' }
    ],
    32: [
      { type: 'order', q: 'Case 1 (no exception). Put the parts in the order they run.', lang: 'none', lines: ['statement1, statement2, statement3', 'finalStatements', 'nextStatements'], why: 'The catch block is skipped.' }
    ],
    33: [
      { type: 'order', q: 'Case 2 (statement2 throws, and it is caught). Put what runs in order.', lang: 'none', lines: ['statement1', 'statement2 (throws)', 'handling ex', 'finalStatements', 'nextStatements'], why: 'statement3 is skipped.' }
    ],
    34: [
      { type: 'output', q: 'What does this print before the exception goes to the caller?', code: 'try {\n  System.out.println("A");\n  int x = 1 / 0;\n  System.out.println("B");\n}\ncatch (NullPointerException ex) {\n  System.out.println("C");\n}\nfinally {\n  System.out.println("D");\n}\nSystem.out.println("E");', answer: 'A\nD', why: 'The ArithmeticException is not caught: catch is skipped, finally runs, and E is skipped.' }
    ],
    35: [
      { q: 'What comes next in the outline?', options: ['When to use exceptions', 'Exception types', 'The try-catch block'], answer: 0, why: 'Then custom exception classes.' }
    ],
    36: [
      { type: 'tf', q: 'If you can handle an error in the method where it occurs, you do not need to throw an exception.', answer: true, why: 'Throw only when the caller must handle it.' }
    ],
    37: [
      { type: 'write', q: 'Without try-catch: print name.length() if name is not null, else print no name.', rows: 4, checks: [{ re: /if\s*\(\s*name\s*!=\s*null\s*\)/, label: 'if (name != null)' }, { re: /println\s*\(\s*name\s*\.\s*length\s*\(\s*\)\s*\)\s*;/, label: 'System.out.println(name.length());' }, { re: /else[\s\S]*println\s*\(\s*"no name"\s*\)\s*;/, label: 'else System.out.println("no name");' }], solution: 'if (name != null)\n  System.out.println(name.length());\nelse\n  System.out.println("no name");', why: 'Simple errors are best handled with if-else.' }
    ],
    38: [
      { type: 'output', q: 'What does this print?', code: 'public static void m() {\n  try {\n    throw new ArithmeticException("bad");\n  }\n  catch (ArithmeticException ex) {\n    System.out.println("m saw it");\n    throw ex;\n  }\n}\n// in main:\ntry { m(); }\ncatch (ArithmeticException ex) { System.out.println("main: " + ex.getMessage()); }', answer: 'm saw it\nmain: bad', why: 'm handles part of it, then rethrows it to main.' }
    ],
    39: [
      { q: 'How do you define a custom exception class?', options: ['Extend Exception or one of its subclasses', 'Write a method named throw', 'Use the keyword exception'], answer: 0, why: 'Slide 39.' }
    ],
    40: [
      { type: 'output', q: 'What does this print?', code: 'InvalidRadiusException ex = new InvalidRadiusException(-7.5);\nSystem.out.println(ex.getMessage() + " / " + ex.getRadius());', answer: 'Invalid radius -7.5 / -7.5', why: 'super("Invalid radius " + radius) sets the message; the field keeps the radius.' },
      { type: 'tf', q: 'InvalidRadiusException is a checked exception.', answer: false, why: 'It extends RuntimeException, so it is unchecked.' }
    ],
    41: [
      { type: 'output', q: 'What does this print?', code: 'CircleWithRadiusException c = new CircleWithRadiusException();\nSystem.out.println(c.getRadius());', answer: '1.0', why: 'The no-arg constructor calls this(1.0).' }
    ],
    42: [
      { type: 'output', q: 'What does TestCircleWithRadiusException print?', code: 'try {\n  new CircleWithRadiusException(5);\n  new CircleWithRadiusException(-5);\n  new CircleWithRadiusException(2);\n}\ncatch (InvalidRadiusException ex) {\n  System.out.println(ex);\n}\nSystem.out.println("Number of objects created: " +\n  CircleWithRadiusException.getNumberOfObjects());', answer: 'InvalidRadiusException: Invalid radius -5.0\nNumber of objects created: 1', why: 'println(ex) uses toString: the class name, ": " and the message.' }
    ]
  },
  parts: {
    0: [
      { type: 'write', q: 'Write a try-catch that prints the result of a / b, or Cannot divide by zero when an ArithmeticException happens.', rows: 6, checks: [{ re: /try\s*\{[\s\S]*a\s*\/\s*b[\s\S]*\}/, label: 'try { … a / b … }' }, { re: /catch\s*\(\s*ArithmeticException\s+\w+\s*\)/, label: 'catch (ArithmeticException ex)' }, { re: /println\s*\(\s*"Cannot divide by zero"\s*\)\s*;/, label: 'System.out.println("Cannot divide by zero");' }], solution: 'try {\n  System.out.println(a / b);\n}\ncatch (ArithmeticException ex) {\n  System.out.println("Cannot divide by zero");\n}', why: 'The risky code goes in try; the handler in catch.' },
      { type: 'output', q: 'With quotient of slide 8, what does this print?', code: 'try {\n  System.out.println(quotient(9, 3));\n  System.out.println(quotient(9, 0));\n  System.out.println("end of try");\n}\ncatch (ArithmeticException ex) {\n  System.out.println(ex.getMessage());\n}', answer: '3\nDivisor cannot be zero', why: 'The second call throws, so "end of try" is skipped.' },
      { type: 'tf', q: 'When an exception is thrown inside try, the rest of the try block still runs.', answer: false, why: 'Execution jumps to the catch block.' }
    ],
    1: [
      { type: 'match', q: 'Is each exception checked or unchecked?', pairs: [['IOException', 'Checked'], ['NullPointerException', 'Unchecked (a RuntimeException)'], ['VirtualMachineError', 'Unchecked (an Error)']], why: 'RuntimeException, Error and their subclasses are unchecked.' },
      { q: 'Which exception do you get with String s = null; s.length();?', options: ['NullPointerException', 'ArithmeticException', 'IOException'], answer: 0, why: 'You used an object through a null reference.' }
    ],
    2: [
      { type: 'output', q: 'What does this print?', code: 'try {\n  int[] a = {1, 2};\n  System.out.println(a[1]);\n  System.out.println(a[2]);\n}\ncatch (ArithmeticException ex) {\n  System.out.println("math");\n}\ncatch (ArrayIndexOutOfBoundsException ex) {\n  System.out.println("index");\n}', answer: '2\nindex', why: 'a[1] is fine; a[2] throws, and the second catch matches.' },
      { type: 'bug', q: 'This method does not compile. Tap the wrong line.', code: 'void p2() throws IOException { }\nvoid p1() {\n  p2();\n}', answer: 3, why: 'p2 declares a checked IOException, so p1 must catch it or declare throws IOException.' }
    ],
    3: [
      { type: 'output', q: 'What does this print?', code: 'try {\n  throw new ArithmeticException("Zero!");\n}\ncatch (ArithmeticException ex) {\n  System.out.println(ex.getMessage());\n  System.out.println(ex);\n}\nfinally {\n  System.out.println("done");\n}', answer: 'Zero!\njava.lang.ArithmeticException: Zero!\ndone', why: 'getMessage gives the message; toString adds the full class name.' },
      { type: 'tf', q: 'The finally block runs even when no exception is thrown.', answer: true, why: 'It always runs.' }
    ],
    4: [
      { type: 'write', q: 'Write a custom unchecked exception class NoMoneyException with a constructor NoMoneyException(double amount) that calls super("Not enough money: " + amount).', rows: 5, checks: [{ re: /class\s+NoMoneyException\s+extends\s+RuntimeException/, label: 'class NoMoneyException extends RuntimeException' }, { re: /NoMoneyException\s*\(\s*double\s+amount\s*\)/, label: 'NoMoneyException(double amount)' }, { re: /super\s*\(\s*"Not enough money: "\s*\+\s*amount\s*\)\s*;/, label: 'super("Not enough money: " + amount);' }], solution: 'public class NoMoneyException extends RuntimeException {\n  public NoMoneyException(double amount) {\n    super("Not enough money: " + amount);\n  }\n}', why: 'Extending RuntimeException makes it unchecked.' },
      { type: 'tf', q: 'try-catch is the best way to check if a reference is null.', answer: false, why: 'Use a simple if (ref != null).' }
    ]
  }
});
