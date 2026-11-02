/* CS1 · Introduction: quick checks under the slides (1-2 per slide) and more part-quiz questions. */
addChecks({
  course: 'cs1', lesson: '02-introduction',
  slides: {
    2: [
      { q: 'Which of these is one of the goals of this chapter?', options: ['To write a simple Java program', 'To build a computer', 'To design a Web page'], answer: 0, why: 'The chapter ends with your first Java program.' }
    ],
    3: [
      { type: 'match', q: 'Match each part with its kind.', pairs: [['Keyboard', 'Input device'], ['Monitor', 'Output device'], ['Hard disk', 'Storage device']], why: 'Input brings data in, output shows results, storage keeps data.' },
      { type: 'tf', q: 'The bus carries data between the parts of the computer.', answer: true, why: 'All the parts are connected to the bus.' }
    ],
    4: [
      { q: 'What does the CPU do, again and again?', options: ['It shows pictures on the screen', 'It keeps the files when the power is off', 'It takes an instruction from memory and executes it'], answer: 2, why: 'The CPU retrieves instructions from memory and executes them.' },
      { type: 'fill', q: 'Complete the fact from slide 4.', lang: 'none', code: '1 megahertz = 1 ___ pulses per second', answer: ['million'], why: 'Mega means million.' }
    ],
    5: [
      { q: 'How many bits does one memory byte hold?', options: ['4', '8', '16'], answer: 1, why: 'Each byte holds eight bits.' },
      { type: 'tf', q: 'A program can run from the disk without being brought into memory.', answer: false, why: 'A program and its data must be brought to memory before they can be executed.' }
    ],
    6: [
      { q: 'A number is too big for one byte. What does the computer do?', options: ['It cannot store the number', 'It shares a byte with another number', 'It uses several bytes next to each other'], answer: 2, why: 'It uses a number of adjacent bytes. Two data never share one byte.' },
      { type: 'tf', q: 'The programmer must change every letter into bits by hand.', answer: false, why: 'The system does the encoding and decoding automatically.' }
    ],
    7: [
      { type: 'fill', q: 'Complete the sentence.', lang: 'none', code: 'Memory is ___, because information is lost\nwhen the power is off.', answer: ['volatile'], why: 'Volatile means it forgets everything without power.' },
      { q: 'Which one is a storage device?', options: ['The CPU', 'A CD drive', 'The bus'], answer: 1, why: 'Disk drives, CD drives and tape drives are the three main types.' }
    ],
    8: [
      { q: 'What kind of device is the monitor?', options: ['An output device', 'An input device', 'A storage device'], answer: 0, why: 'It displays (outputs) text and graphics.' }
    ],
    9: [
      { type: 'match', q: 'Match each word with its meaning.', pairs: [['Pixel', 'A tiny dot of the picture'], ['Resolution', 'How many pixels across and down'], ['Dot pitch', 'The space between pixels']], why: 'Slide 9.' },
      { q: 'Which screen is sharper?', options: ['A bigger dot pitch', 'A smaller dot pitch', 'They are always the same'], answer: 1, why: 'The smaller the dot pitch, the sharper the display.' }
    ],
    10: [
      { q: 'How fast is a DSL compared with a regular modem?', options: ['About 20 times faster', 'The same speed', 'Slower'], answer: 0, why: 'Slide 10: a DSL is 20 times faster than a regular modem.' },
      { type: 'tf', q: 'A cable modem uses the TV cable line.', answer: true, why: 'And it is as fast as a DSL.' }
    ],
    11: [
      { type: 'match', q: 'Match each part of the CPU with its job.', pairs: [['Control unit', 'Directs the work of the other parts'], ['ALU', 'Does the calculations'], ['Registers', 'Very small, very fast places for values']], why: 'Slide 11.' }
    ],
    12: [
      { q: 'What does “bit” stand for?', options: ['Byte item', 'Big integer', 'Binary digit'], answer: 2, why: 'A bit is a binary digit: 0 or 1.' },
      { type: 'tf', q: 'A digital computer recognizes ten states, like our ten digits.', answer: false, why: 'Only two states: on or off.' }
    ],
    13: [
      { q: 'Which pair is NOT a way to name the two binary states?', options: ['up and left', '1 and 0', 'true and false', 'on and off'], answer: 0, why: 'Binary means two states: 1/0, true/false or on/off.' }
    ],
    14: [
      { type: 'fill', q: 'Complete the table of slide 14.', lang: 'none', code: '1 kilobyte = ___ bytes', answer: ['1024|1,024'], why: 'A kilobyte is 2 to the power 10 = 1024 bytes.' },
      { type: 'tf', q: 'A megabyte is 1024 kilobytes.', answer: true, why: 'Each unit is 1024 times the one before.' }
    ],
    15: [
      { type: 'order', q: 'Put the sizes in order, from the smallest to the biggest.', lang: 'none', lines: ['Kilo (K)', 'Mega (M)', 'Giga (G)', 'Tera (T)', 'Peta (P)'], why: 'K, M, G, T, P, E, Z, Y: each one 1024 times bigger.' }
    ],
    16: [
      { type: 'match', q: 'Match each name with its size.', pairs: [['nybble', '4 bits'], ['byte', '8 bits'], ['(short) word', '16 bits'], ['(long) word', '64 bits']], why: 'Slide 16.' }
    ],
    17: [
      { q: 'The voltage on a wire is below the threshold. What does it mean?', options: ['on (1)', 'off (0)', 'The wire is broken'], answer: 1, why: 'Below the threshold is off; above it is on.' }
    ],
    18: [
      { q: 'In base 16, which digit stands for the value 12?', options: ['C', 'B', '12'], answer: 0, why: 'A = 10, B = 11, C = 12.' },
      { type: 'trace', q: 'Write each number in the other bases.', lang: 'none', cols: ['base 10', 'base 2', 'base 8', 'base 16'], rows: [['10', '?1010', '?12', '?A|a'], ['15', '?1111', '?17', '?F|f']], why: '10 = 8 + 2 = 1010 in binary, 1·8 + 2 = 12 in octal, A in hex. 15 = 1111, 1·8 + 7 = 17 in octal, F in hex.' }
    ],
    19: [
      { type: 'fill', q: 'Add the binary numbers (6 + 3).', lang: 'none', code: '  0110\n+ 0011\n------\n  ___', answer: ['1001|01001'], why: '6 + 3 = 9, and 9 in binary is 1001.' },
      { type: 'fill', q: 'Subtract the binary numbers (10 − 3).', lang: 'none', code: '  1010\n− 0011\n------\n  ___', answer: ['0111|111'], why: '10 − 3 = 7, and 7 in binary is 111.' }
    ],
    20: [
      { type: 'trace', q: 'Change 19 into binary. Divide by 2 again and again.', lang: 'none', cols: ['number', '÷ 2 (quotient)', 'remainder'], rows: [['19', '?9', '?1'], ['9', '?4', '?1'], ['4', '?2', '?0'], ['2', '?1', '?0'], ['1', '?0', '?1']], why: 'Read the remainders from the bottom up: 19 = 10011.' },
      { q: 'In which order do you read the remainders?', options: ['Any order', 'From the top to the bottom', 'From the bottom to the top'], answer: 2, why: 'The last remainder is the first (leftmost) digit.' }
    ],
    21: [
      { type: 'order', q: 'Put the steps of slide 21 in order.', lang: 'none', lines: ['The user presses shift+D', 'A signal for D goes to the system unit', 'The signal becomes the ASCII code 01000100 in memory', 'The code becomes a picture of D on the screen'], why: 'Key press, signal, binary code in memory, image on the output device.' }
    ],
    22: [
      { type: 'tf', q: 'Without programs, a computer is an empty machine.', answer: true, why: 'Programs (software) tell the computer what to do.' },
      { q: 'Why do we need programming languages?', options: ['They replace the operating system', 'They make the computer faster', 'Computers do not understand human languages'], answer: 2, why: 'We use computer languages to communicate with computers.' }
    ],
    23: [
      { q: 'Which language is pure binary code?', options: ['Machine language', 'Assembly language', 'Java'], answer: 0, why: 'Machine language is built into every computer, in binary.' }
    ],
    24: [
      { type: 'fill', q: 'Complete the sentence.', lang: 'none', code: 'A program called an ___ converts\nassembly language into machine code.', answer: ['assembler'], why: 'The computer cannot run assembly language directly.' },
      { type: 'tf', q: 'ADDF3 R1, R2, R3 is an example of machine language.', answer: false, why: 'It is assembly language: short words instead of binary.' }
    ],
    25: [
      { type: 'match', q: 'Match each line with its kind of language.', pairs: [['1101101010011010', 'Machine language'], ['ADDF3 R1, R2, R3', 'Assembly language'], ['area = 5 * 5 * 3.1415;', 'High-level language']], why: 'Slides 23 to 25.' }
    ],
    26: [
      { type: 'match', q: 'Match each language with what it was made for (slide 26).', pairs: [['COBOL', 'Business applications'], ['FORTRAN', 'Scientific and mathematical work'], ['BASIC', 'Beginners'], ['Java', 'Platform-independent Internet applications']], why: 'Each language was made for a kind of job.' }
    ],
    27: [
      { q: 'What must happen to source code before the computer can run it?', options: ['Nothing, the computer runs it directly', 'It must be printed', 'It must be translated into machine code'], answer: 2, why: 'An interpreter or a compiler does the translation.' }
    ],
    28: [
      { type: 'tf', q: 'An interpreter translates one statement and runs it right away.', answer: true, why: 'Then it goes to the next statement.' },
      { type: 'tf', q: 'One statement of source code always becomes exactly one machine instruction.', answer: false, why: 'A statement may be translated into several machine instructions.' }
    ],
    29: [
      { q: 'What does a compiler make?', options: ['One statement at a time, run at once', 'A machine-code file of the whole program', 'A picture of the program'], answer: 1, why: 'It translates the entire source code first; the file is run later.' }
    ],
    30: [
      { q: 'Which one needs an operating system to run?', options: ['The keyboard', 'Nothing needs it', 'A Web browser'], answer: 2, why: 'Application programs cannot run unless an OS is installed and running.' },
      { type: 'tf', q: 'Linux is an operating system.', answer: true, why: 'Windows, Mac OS and Linux are popular operating systems.' }
    ],
    31: [
      { q: 'Where can you use Java, according to slide 31?', options: ['Servers, desktop computers and hand-held devices', 'Only on servers that run Web sites', 'Only inside Web pages, as small applets'], answer: 0, why: 'Java is a general purpose and Internet programming language.' }
    ],
    32: [
      { type: 'tf', q: 'Java can be used to develop standalone applications.', answer: true, why: 'Also from a browser, on hand-held devices and on Web servers.' }
    ],
    33: [
      { q: 'What was the first name of Java?', options: ['C++--', 'HotJava', 'Oak'], answer: 2, why: 'It was renamed Java and shown on May 20, 1995.' },
      { type: 'match', q: 'Match each name with its role in Java’s history.', pairs: [['James Gosling', 'Made Java at Sun Microsystems'], ['HotJava', 'The first Java-enabled Web browser']], why: 'Slide 33.' }
    ],
    34: [
      { q: 'Which one is NOT in the list of Java’s characteristics?', options: ['Java is secure', 'Java is robust', 'Java is portable', 'Java is slow to learn'], answer: 3, why: 'The list has simple, object-oriented, distributed, interpreted, robust, secure, architecture-neutral, portable, performance, multithreaded and dynamic.' }
    ],
    35: [
      { q: 'Java is partly modeled on which language?', options: ['COBOL', 'C++', 'Assembly'], answer: 1, why: 'It is like C++ but simplified, so some call it “C++--”.' }
    ],
    36: [
      { q: 'What is one big gift of object-oriented programming?', options: ['No variables are needed', 'Programs need no testing', 'You can reuse code'], answer: 2, why: 'OOP gives flexibility, modularity, clarity and reusability.' }
    ],
    37: [
      { type: 'fill', q: 'Complete the sentence.', lang: 'none', code: '___ computing means several computers\nworking together on a network.', answer: ['Distributed|distributed'], why: 'Java has networking built in.' }
    ],
    38: [
      { type: 'order', q: 'Put the way a Java program runs in order.', lang: 'none', lines: ['You write the source code', 'The compiler makes bytecode', 'The JVM interprets the bytecode'], why: 'Java is compiled into bytecode, then the JVM runs it.' },
      { type: 'tf', q: 'Bytecode can run only on one kind of machine.', answer: false, why: 'Bytecode is machine-independent: it runs on any machine with a JVM.' }
    ],
    39: [
      { type: 'tf', q: 'Java compilers find many problems before the program runs.', answer: true, why: 'That is one reason Java is robust.' }
    ],
    40: [
      { q: 'What does “Java is secure” mean?', options: ['Java programs never have errors when they run', 'It protects your system from harm by stray programs', 'Java code is secret, so nobody can read it'], answer: 1, why: 'Java has several security mechanisms.' }
    ],
    41: [
      { type: 'fill', q: 'Complete the motto of slide 41.', lang: 'none', code: 'Write once, run ___', answer: ['anywhere'], why: 'With a JVM, one program runs on any platform.' }
    ],
    42: [
      { q: 'You move a Java program to another platform. What must you do?', options: ['Nothing: it runs without being recompiled', 'Write it again', 'Translate it into assembly'], answer: 0, why: 'Java programs are portable.' }
    ],
    43: [
      { type: 'tf', q: 'Slide 43 says Java programs can run on any platform without being recompiled.', answer: true, why: 'It repeats the portability sentence.' }
    ],
    44: [
      { q: 'What is a multithreaded program?', options: ['A program that runs on many computers', 'A program with many classes', 'A program that does several tasks at the same time'], answer: 2, why: 'Each task is a thread. Java has this built in.' }
    ],
    45: [
      { type: 'tf', q: 'In Java, new code can be loaded while the program is running.', answer: true, why: 'Java is dynamic: code is loaded on the fly, without recompiling.' }
    ],
    46: [
      { q: 'JDK 1.8 is also called …', options: ['Java 1', 'Java 8', 'Java 18'], answer: 1, why: 'From JDK 1.5, the versions are also called Java 5, 6, 7, 8.' }
    ],
    47: [
      { type: 'match', q: 'Match each edition with its use.', pairs: [['J2SE', 'Standalone (client-side) applications'], ['J2EE', 'Server-side applications'], ['J2ME', 'Mobile devices like cell phones']], why: 'This course uses J2SE.' }
    ],
    48: [
      { q: 'What is an IDE?', options: ['A program where you write, compile and run code in one place', 'A kind of computer that is made for running Java', 'A Java edition, like Java SE or Java EE'], answer: 0, why: 'IDE = integrated development environment, like NetBeans or Eclipse.' }
    ],
    49: [
      { type: 'output', q: 'What does this program print?', code: 'public class Hello {\n  public static void main(String[] args) {\n    System.out.println("Hello from Java!");\n  }\n}', answer: 'Hello from Java!', why: 'println prints the text between the quotation marks.' }
    ],
    50: [
      { q: 'Which one is NOT one of the seven parts on slide 50?', options: ['Class name', 'Monitor', 'Comments', 'Blocks'], answer: 1, why: 'The parts are class name, main method, statements, statement terminator, reserved words, comments and blocks.' }
    ],
    51: [
      { type: 'fill', q: 'The class is named Hello. Complete the line.', code: 'public class ___ {', answer: ['Hello'], why: 'The name comes after the word class.' },
      { q: 'By convention, a class name starts with …', options: ['a lowercase letter', 'a digit', 'an uppercase letter'], answer: 2, why: 'Like Welcome.' }
    ],
    52: [
      { type: 'fill', q: 'Complete the line that starts the program.', code: 'public static void ___(String[] args) {', answer: ['main'], why: 'The program is executed from the main method.' }
    ],
    53: [
      { type: 'write', q: 'Write one statement that prints I like Java on the screen.', checks: [{ re: /System\s*\.\s*out\s*\.\s*println\s*\(\s*"I like Java"\s*\)\s*;/, label: 'System.out.println("I like Java");' }], solution: 'System.out.println("I like Java");', why: 'The text goes between quotation marks, inside println( ), and the statement ends with ;.' }
    ],
    54: [
      { type: 'bug', q: 'One line has a missing statement terminator. Tap it.', code: 'public class Welcome {\n  public static void main(String[] args) {\n    System.out.println("Welcome")\n  }\n}', answer: 3, why: 'Every statement ends with a semicolon: println("Welcome");' }
    ],
    55: [
      { q: 'Which word is a reserved word?', options: ['Welcome', 'class', 'args'], answer: 1, why: 'class has a fixed meaning to the compiler. Welcome and args are names.' },
      { type: 'tf', q: 'You can name your class static.', answer: false, why: 'static is a reserved word, so it cannot be used as a name.' }
    ],
    56: [
      { q: 'How many blocks does the Welcome program have?', options: ['Two: the class block and the method block', 'One: the whole program is one block', 'Seven: one block for every line'], answer: 0, why: 'Each pair of braces makes one block.' }
    ],
    57: [
      { type: 'match', q: 'Match each symbol with its job (slide 57).', pairs: [['{ }', 'Encloses a block of statements'], ['( )', 'Used with methods'], ['[ ]', 'Denotes an array'], ['//', 'Starts a comment line'], ['" "', 'Encloses a string'], [';', 'Ends a statement']], why: 'Six special symbols.' }
    ],
    58: [
      { type: 'tf', q: 'Every { in a program needs its own }.', answer: true, why: 'They come in pairs; each pair makes a block.' }
    ],
    59: [
      { q: 'In main(String[] args), what do the brackets [ ] mean?', options: ['A block', 'A comment', 'An array'], answer: 2, why: 'Brackets denote an array (a later unit).' }
    ],
    60: [
      { type: 'fill', q: 'Two statements. Complete them.', code: 'System.out.println("A")___\nSystem.out.println("B")___', answer: [';', ';'], why: 'Each statement ends with its own semicolon.' }
    ],
    61: [
      { type: 'output', q: 'What does this code print?', code: '// System.out.println("one");\nSystem.out.println("two");', answer: 'two', why: 'The first line is a comment, so Java ignores it.' }
    ],
    62: [
      { type: 'tf', q: 'The text between the quotation marks is printed exactly as it is.', answer: true, why: 'It is a string: a sequence of characters.' }
    ],
    63: [
      { q: 'Why do good style and documentation matter?', options: ['People must read and fix the code too', 'The computer runs faster', 'The compiler requires it'], answer: 0, why: 'Code is read by people, not only by the computer.' }
    ],
    64: [
      { q: 'What should the comment at the start of a program include?', options: ['The output that the program prints', 'Only the class name and nothing else', 'What the program does, your name and the date'], answer: 2, why: 'A summary, plus your name, section, instructor, date and a brief description.' }
    ],
    65: [
      { type: 'match', q: 'Match each name with the rule it follows or breaks.', pairs: [['ShowLogicErrors', 'Good class name'], ['showlogicerrors', 'Bad: the words do not start with capitals'], ['X1', 'Bad: the name does not describe anything']], why: 'Names should be meaningful; class names capitalize each word.' }
    ],
    66: [
      { q: 'How far should the lines inside a block be pushed to the right?', options: ['Two spaces', 'Ten spaces', 'Not at all'], answer: 0, why: 'Slide 66: indent two spaces.' },
      { type: 'tf', q: 'Blank lines can separate groups of code.', answer: true, why: 'Use blank lines to separate segments of the code.' }
    ],
    67: [
      { q: 'Which style is this?', code: 'public class Test {\n  public static void main(String[] args) {\n    System.out.println("Hi");\n  }\n}', options: ['Next-line style', 'End-of-line style'], answer: 1, why: 'Each { is at the end of the line before it. This is the style the slides ask for.' }
    ],
    68: [
      { type: 'match', q: 'Match each kind of error with what happens.', pairs: [['Syntax error', 'The compiler finds it'], ['Runtime error', 'The program aborts while it runs'], ['Logic error', 'The program runs but the result is wrong']], why: 'Slide 68.' }
    ],
    69: [
      { type: 'bug', q: 'This code has one syntax error. Tap the line.', code: 'public class Test {\n  public static void main(String[] args) {\n    System.out.println("Good morning);\n  }\n}', answer: 3, why: 'The string has no closing quotation mark.' }
    ],
    70: [
      { type: 'tf', q: 'A program with a runtime error compiles without errors.', answer: true, why: 'The error shows only when the program runs, like 1 / 0.' }
    ],
    71: [
      { type: 'output', q: 'What does this line print?', code: 'System.out.println((9 / 5) * 10 + 32);', answer: '42', why: '9 / 5 is 1 with whole numbers, so 1 * 10 + 32 = 42. (The right answer for 10 °C would be 50.)' }
    ],
    72: [
      { type: 'fill', q: 'Complete the two commands.', lang: 'none', code: '___ Welcome.java\n___ Welcome', answer: ['javac', 'java'], why: 'javac compiles the source code; java runs the bytecode.' }
    ],
    73: [
      { q: 'Why can Java bytecode run on Windows, Mac and Linux?', options: ['Each has a Java Virtual Machine that interprets it', 'It is machine code for all of them', 'It is recompiled each time'], answer: 0, why: 'The JVM is software that interprets Java bytecode.' }
    ]
  },
  parts: {
    0: [
      { type: 'match', q: 'Match each part with its job.', pairs: [['CPU', 'Executes instructions'], ['Memory', 'Holds the running program and its data'], ['Hard disk', 'Keeps programs and data when the power is off'], ['NIC', 'Connects to a local network']], why: 'Slides 3 to 10.' },
      { type: 'tf', q: 'When you write new data into a memory byte, the old data stays there too.', answer: false, why: 'The current content is lost whenever new information is placed in it.' },
      { q: 'A screen is 1,024 pixels wide and 768 pixels high. What is this number called?', options: ['The resolution', 'The dot pitch', 'The speed'], answer: 0, why: 'Resolution = pixels across and down.' }
    ],
    1: [
      { type: 'trace', q: 'Change each binary number into decimal.', lang: 'none', cols: ['binary', 'decimal'], rows: [['110', '?6'], ['1000', '?8'], ['11111', '?31']], why: '110 = 4 + 2 = 6. 1000 = 8. 11111 = 16 + 8 + 4 + 2 + 1 = 31.' },
      { type: 'fill', q: 'Change 25 into binary.', lang: 'none', code: '25 (base 10) = ___ (base 2)', answer: ['11001'], why: '25 = 16 + 8 + 1, so 11001.' },
      { q: 'How many bits are in a (double) word?', options: ['16', '32', '64'], answer: 1, why: 'A (double) word is 4 bytes = 32 bits.' }
    ],
    2: [
      { type: 'match', q: 'Match each tool with how it works.', pairs: [['Interpreter', 'One statement: translate, then run at once'], ['Compiler', 'Whole program into a machine-code file first'], ['Assembler', 'Assembly language into machine code']], why: 'Slides 24, 28 and 29.' },
      { type: 'tf', q: 'High-level languages are English-like and easy to learn.', answer: true, why: 'Java is a high-level language.' },
      { q: 'Which language was made for scientific and mathematical work?', options: ['Visual Basic', 'COBOL', 'FORTRAN'], answer: 2, why: 'FORTRAN = FORmula TRANslation.' }
    ],
    3: [
      { type: 'match', q: 'Match each characteristic with its meaning.', pairs: [['Portable', 'Runs on another platform without recompiling'], ['Multithreaded', 'Does several tasks at the same time'], ['Dynamic', 'Loads new code while running'], ['Distributed', 'Several computers work together on a network']], why: 'Slides 37 to 45.' },
      { q: 'Who made Java?', options: ['Ada Lovelace, the first programmer', 'Bill Gates at Microsoft', 'James Gosling at Sun Microsystems'], answer: 2, why: 'Slide 33.' },
      { type: 'tf', q: 'This course uses J2EE to introduce Java programming.', answer: false, why: 'The book uses J2SE, the standard edition.' }
    ],
    4: [
      { type: 'bug', q: 'This program has one mistake. Tap the wrong line.', code: 'public class Welcome {\n  public static void Main(String[] args) {\n    System.out.println("Welcome to Java!");\n  }\n}', answer: 2, why: 'Java is case-sensitive: the method must be named main, with a small m.' },
      { type: 'write', q: 'Write the line that starts the main method, with its opening brace.', checks: [{ re: /public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]\s*\w+\s*\)\s*\{/, label: 'public static void main(String[] args) {' }], solution: 'public static void main(String[] args) {', why: 'Every program starts running from this method.' },
      { type: 'match', q: 'Match each part of the program with an example.', pairs: [['Comment', '// This program prints Welcome to Java!'], ['Class name', 'Welcome'], ['Statement', 'System.out.println("Welcome to Java!");'], ['Reserved word', 'void']], why: 'Slides 50 to 61.' }
    ],
    5: [
      { type: 'write', q: 'Rewrite this line in the end-of-line style: put the { at the end of the class line.', code: 'public class Test\n{', checks: [{ re: /public\s+class\s+Test\s*\{/, label: 'public class Test {' }], solution: 'public class Test {', why: 'In the end-of-line style the brace goes at the end of the line.' },
      { q: 'Which name follows the class naming convention?', options: ['maxnumberfinder', 'MaxNumberFinder', 'MAXNUMBERFINDER'], answer: 1, why: 'Capitalize the first letter of each word.' },
      { type: 'tf', q: 'A comment at the start of the program should say what the program does.', answer: true, why: 'Slide 64.' }
    ],
    6: [
      { type: 'match', q: 'Match each line with the kind of error it has.', pairs: [['System.out.println("Hi")', 'Syntax error'], ['System.out.println(10 / 0);', 'Runtime error'], ['System.out.println("2 + 2 = 5");', 'Logic error']], why: 'A missing ; is found by the compiler; dividing by zero aborts; a wrong answer is a logic error.' },
      { type: 'bug', q: 'Find the syntax error.', code: 'public class ShowErrors {\n  public static void main(String[] args) {\n    System.out.println("Hello";\n  }\n}', answer: 3, why: 'The ) that closes println( is missing: println("Hello");' },
      { type: 'tf', q: 'A logic error makes the compiler show an error message.', answer: false, why: 'The program compiles and runs, but the result is wrong.' }
    ],
    7: [
      { type: 'match', q: 'Match each file with what it holds.', pairs: [['Welcome.java', 'The source code'], ['Welcome.class', 'The bytecode']], why: 'javac makes the .class file from the .java file.' },
      { q: 'You run java Welcome and the result is wrong. Where do you go back to?', options: ['The JVM, to change it', 'The source code, to fix it', 'Nowhere, it cannot be fixed'], answer: 1, why: 'Slide 72: fix the source code, then compile and run again.' },
      { type: 'tf', q: 'With most other languages, the compiled program runs only on one kind of machine.', answer: true, why: 'That is why it must be recompiled for each machine. Java bytecode does not need that.' }
    ]
  }
});
