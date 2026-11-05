/* Data Structures · Unit 1 Introduction: questions under the slides and the part quizzes.
   Every question has lessons, skills, available_after and level (1 easy, 2 middle, 3 hard, never harder than the
   instructor's). source = the instructor's own question (Assignment 1), copied word for word with his answer.
   No checks on the cover and on the course-information slides (1, 2, 4, 6, 15). */
addChecks({
  course: 'ds', lesson: '01-introduction',
  slides: {
    3: [
      { q: 'Which sentence matches the slide\'s meaning of a <b>data structure</b>?',
        options: ['A Java class that can store only numbers, one after another', 'The number of bytes that one variable uses in memory', 'An algorithm that puts data in order, such as sorting', 'A way to organize and store data so that it can be reached and used efficiently'], answer: 3,
        why: 'Slide 3: a data structure is about how data is <b>organized and stored</b> so the program can use it efficiently. Sorting is an <b>algorithm</b> that works on data, not a way to store it. A data structure can hold any kind of data, not only numbers, and the size of one variable is a data type question (slide 9).',
        lessons: ['01-introduction'], skills: ['concept'], available_after: '01-introduction', level: 1 },
      { type: 'multi', q: 'Which of these are <b>data structures</b> that this course studies (slide 3)?',
        options: ['Stacks', 'Queues', 'Hashing', 'Graphs', 'Sorting', 'Maps'], answer: [0, 1, 3, 5],
        why: 'Slide 3 names the structures: stacks, queues, lists, trees, sets, maps and graphs. Sorting and hashing are also in the course, but the slide calls them <b>algorithms</b>: ways of working on data, not ways of storing it.',
        lessons: ['01-introduction'], skills: ['concept'], available_after: '01-introduction', level: 2 }
    ],
    5: [
      { q: 'A student says: "When I know what a stack does, I know everything. How it is built inside does not matter." Which goal on slide 5 shows that the course wants more?',
        options: ['Explain and summarize the advantages and disadvantages of various data structure implementations', 'Describe the usage of some algorithms, such as sorting and hashing', 'Develop improved communication and collaborative skills', 'Describe the usage of stacks, queues, lists, trees, sets, maps, and graphs'],
        answer: 0,
        why: 'One structure can be built in different ways (for example with an array or with linked nodes), and each way has good and bad sides. The course wants you to compare them, so the inside matters. "Describe the usage" is only the first step: knowing what a stack does. The other two goals are true but are not about how a structure is built.',
        lessons: ['01-introduction'], skills: ['concept'], available_after: '01-introduction', level: 2 }
    ],
    7: [
      { type: 'match', q: 'Match each advantage of data structures (slide 7) with the situation that shows it.',
        pairs: [['Efficiency', 'A name is found among a million names in a moment'], ['Flexibility', 'Data is added and removed easily while the program runs'],
          ['Reusability', 'One queue class is used in a printer program and in a chat app'], ['Maintainability', 'Another programmer can understand and change the program a year later']],
        why: 'Efficiency = fast storage and retrieval. Flexibility = easy to change and move data. Reusability = write once, use in many programs. Maintainability = easy to understand, modify and maintain over time.',
        lessons: ['01-introduction'], skills: ['concept'], available_after: '01-introduction', level: 2 }
    ],
    8: [
      { q: 'A drawing app keeps every line, circle and rectangle the user drew, so it can move them or draw them again. Which application area of slide 8 is this?',
        options: ['Databases', 'Computer Graphics', 'Operating Systems', 'Artificial Intelligence'], answer: 1,
        why: 'Slide 8: in computer graphics, data structures represent geometric shapes and other graphical elements. Databases store records for retrieval, operating systems manage memory and files, and AI represents knowledge.',
        lessons: ['01-introduction'], skills: ['concept'], available_after: '01-introduction', level: 1 }
    ],
    9: [
      { q: 'A program must store the whole number <b>32768</b>. Using the table on slide 9, which is the <b>smallest</b> type that can hold it?',
        options: ['byte', 'short', 'int', 'long'], answer: 2,
        why: 'short goes from -32768 to <b>32767</b>, so 32768 is one too big for it. int (4 bytes) goes up to 2³¹ − 1, so it fits. byte stops at 127. long works too, but it uses 8 bytes, so it is not the smallest.',
        lessons: ['01-introduction'], skills: ['concept', 'edge_case'], available_after: '01-introduction', level: 2 },
      { type: 'tf', q: 'According to slide 9, a `char` uses 1 byte and a `boolean` uses 1 byte.', answer: false,
        why: 'Both parts are wrong. A char uses <b>2 bytes</b> (16 bits), and a boolean is listed as <b>1 bit</b>, because it only stores true or false.',
        lessons: ['01-introduction'], skills: ['concept'], available_after: '01-introduction', level: 1 }
    ],
    10: [
      { type: 'multi', q: 'Which of these are <b>non-primitive</b> data types (slide 10)?',
        options: ['String', 'int', 'Scanner', 'double', 'Object', 'char'], answer: [0, 2, 4],
        why: 'Non-primitive types are <b>classes</b>: String, Scanner and Object (the root class) come with Java. int, double and char are three of the 8 primitive types of slide 9.',
        lessons: ['01-introduction'], skills: ['concept'], available_after: '01-introduction', level: 1 },
      { q: 'After `String s = "Hi";` what does the variable `s` hold?',
        options: ['The two characters H and i, stored in s itself', 'A reference to a String object', 'The class String', 'A primitive value of 2 bytes'], answer: 1,
        why: 'String is a class, so s is a variable of a non-primitive type: it holds a <b>reference</b> (the address of the object), and the characters are inside the object. Only primitive variables like <code>int n = 5</code> hold the value itself.',
        lessons: ['01-introduction'], skills: ['concept'], available_after: '01-introduction', level: 2 }
    ],
    11: [
      { q: 'How many Student <b>objects</b> exist after these two lines?',
        code: 'Student[] group = new Student[8];\ngroup[2] = new Student("Sara", 77);',
        options: ['0', '1', '8', '9'], answer: 1,
        why: '<code>new Student[8]</code> makes an <b>array of 8 references</b>, all null: no Student object yet (slide 11). The second line creates one Student and puts its reference in cell 2. The array itself is an object, but it is not a Student. "8" thinks the array creates the students; "9" adds the new one to those 8.',
        lessons: ['01-introduction'], skills: ['trace', 'concept'], available_after: '01-introduction', level: 2 },
      { type: 'output', q: 'What does this print?',
        code: 'int[][] grid = new int[4][6];\nSystem.out.println(grid.length + " " + grid[0].length);',
        answer: '4 6',
        why: 'The first size is the number of <b>rows</b>, the second the number of <b>columns</b>. <code>grid.length</code> counts the rows (4); <code>grid[0]</code> is the first row, and its length is the number of columns (6).',
        lessons: ['01-introduction'], skills: ['trace'], available_after: '01-introduction', level: 2 }
    ],
    12: [
      { type: 'output', q: 'The drawing of slide 12 uses this method for problem 1. What does `maxMinIndex(new int[] {4, 9, 1, 9, 1})` give? Type the two indexes like the print line shows them.',
        code: 'int max = 0, min = 0;\nfor (int i = 1; i < array.length; i++) {\n  if (array[i] > array[max]) max = i;\n  if (array[i] < array[min]) min = i;\n}\nSystem.out.println(max + " " + min);',
        answer: '1 2',
        why: 'i = 1: 9 > 4, max = 1. i = 2: 1 < 4, min = 2. i = 3: 9 is <b>not</b> bigger than 9 (the test is &gt;, not &gt;=), so max stays 1. i = 4: 1 is not smaller than 1, so min stays 2. With a tie, the <b>first</b> index wins. "3 4" would need &gt;= and &lt;=.',
        lessons: ['01-introduction'], skills: ['trace', 'edge_case'], available_after: '01-introduction', level: 2 },
      { q: 'The Two Sum method of the drawing tries the pairs (i, j) in order: i = 0 with every j after it, then i = 1, and so on. It returns the first pair it finds. For array = [6, 1, 5, 3, 7, 2] and target 8, what does it return?',
        options: ['{0, 5}', '{1, 4}', '{2, 3}', 'All three pairs'], answer: 0,
        why: 'Three pairs add up to 8: 6 + 2, 1 + 7 and 5 + 3. But the outer loop starts at i = 0 and checks every j first: 6+1, 6+5, 6+3, 6+7, then 6+2 = 8 at j = 5. It returns {0, 5} at once and never reaches the other pairs. The method returns one pair (an int array of two indexes), not all of them.',
        lessons: ['01-introduction'], skills: ['trace'], available_after: '01-introduction', level: 3 }
    ],
    13: [
      { q: 'Slide 13 lists ArrayStack and LinkedStack. How are they related?',
        options: ['They are two unrelated data structures', 'LinkedStack is a stack and ArrayStack is a queue', 'They are the same idea (a stack) built in two different ways', 'ArrayStack is only for numbers and LinkedStack only for objects'], answer: 2,
        why: 'A stack is an idea: last in, first out. ArrayStack keeps the elements in an array and LinkedStack in linked nodes, but both behave like a stack. The same is true for ArrayQueue / LinkedQueue and ArrayList / LinkedList.',
        lessons: ['01-introduction'], skills: ['concept', 'design'], available_after: '01-introduction', level: 1 }
    ],
    14: [
      { type: 'multi', q: 'Which items of slide 14 are <b>sorting</b> algorithms?',
        options: ['Selection Sort', 'Binary Search', 'Quick Sort', 'Merge Sort', 'Graph traversal', 'Insertion Sort'], answer: [0, 2, 3, 5],
        why: 'Slide 14 lists five sorting algorithms: selection, insertion, bubble, quick and merge sort. Binary search <b>finds</b> a value, it does not sort; graph traversal visits every node of a graph.',
        lessons: ['01-introduction'], skills: ['concept'], available_after: '01-introduction', level: 1 }
    ],
    16: [
      { q: 'In the Java Collection Framework, List is an interface and ArrayList is a class. What does that mean for `List<String> names = new ArrayList<>();`?',
        options: ['ArrayList is the interface and List is the class', 'List says which methods a list has; ArrayList is a class that implements them', 'List and ArrayList are two names of the same class', 'You could also write `new List<>()`'], answer: 1,
        why: 'An <b>interface</b> lists the methods; a <b>class</b> implements them and can be created with new. That is why the variable can have the type List while the object is an ArrayList. An interface cannot be created with new, so <code>new List&lt;&gt;()</code> does not compile.',
        lessons: ['01-introduction'], skills: ['concept'], available_after: '01-introduction', level: 2 }
    ]
  },
  parts: {
    0: [
      { q: 'Slide 3 says that algorithm analysis "measures the performance of an algorithm". Which question does it answer?',
        options: ['Is the code written with nice indentation?', 'Which programming language is the algorithm written in?', 'How much time and memory does the algorithm need as the data grows?', 'How many comments does the code have?'], answer: 2,
        why: 'Performance means how fast the algorithm is and how much memory it uses, especially when there is a lot of data. Indentation, language and comments do not change how fast the algorithm is.',
        lessons: ['01-introduction'], skills: ['concept'], available_after: '01-introduction', level: 1 },
      { type: 'tf', q: 'Data structures are useful only inside databases.', answer: false,
        why: 'Slide 8 lists four areas (databases, operating systems, computer graphics, artificial intelligence), and slide 7 says a structure can be reused in many programs. Almost every program uses data structures.',
        lessons: ['01-introduction'], skills: ['concept'], available_after: '01-introduction', level: 1 },
      { type: 'match', q: 'Match each application area (slide 8) with what data structures do there.',
        pairs: [['Databases', 'Organize stored records so they can be found quickly'], ['Operating Systems', 'Manage memory and files'],
          ['Computer Graphics', 'Represent shapes and graphical elements'], ['Artificial Intelligence', 'Represent knowledge and information']],
        why: 'These are the four examples of slide 8, each with its own job for data structures.',
        lessons: ['01-introduction'], skills: ['concept'], available_after: '01-introduction', level: 1 },
      { q: 'A shop keeps its customers in no order. Finding one customer among a million is now slow. Which advantage of data structures (slide 7) is the shop missing?',
        options: ['Reusability', 'Maintainability', 'Flexibility', 'Efficiency'], answer: 3,
        why: 'Efficiency = data is stored so it can be found fast. The problem here is speed of retrieval. Reusability is about using the same structure in many programs, maintainability about understanding and changing the code later, and flexibility about changing the data easily.',
        lessons: ['01-introduction'], skills: ['concept'], available_after: '01-introduction', level: 2 },
      { q: 'A team writes one `Queue` class and uses it in a printer program, a chat app and a game, instead of writing a new one each time. Which advantage is this?',
        options: ['Reusability', 'Efficiency', 'Flexibility', 'Maintainability'], answer: 0,
        why: 'Reusability: the same data structure is used in many programs, so no redundant code is written. The question does not say anything about speed (efficiency) or about changing the data (flexibility).',
        lessons: ['01-introduction'], skills: ['concept'], available_after: '01-introduction', level: 2 },
      { type: 'multi', q: 'Which of these are learning outcomes of the course (slide 5)?',
        options: ['Analyze the performance of algorithms using mathematical techniques', 'Design and apply appropriate data structures for solving computing problems', 'Write a complete operating system', 'Describe the usage of some algorithms, such as sorting and hashing', 'Build computer graphics applications'], answer: [0, 1, 3],
        why: 'Slide 5 lists describing structures and algorithms, analyzing performance, comparing implementations, choosing structures, and teamwork. Operating systems and graphics appear on slide 8 only as places where data structures are used, not as things you will build.',
        lessons: ['01-introduction'], skills: ['concept'], available_after: '01-introduction', level: 2 }
    ],
    1: [
      { source: { assignment: 1, question: 22 },
        q: 'A two-dimensional array has 3 rows and 4 columns. How many elements does it contain?',
        options: ['7', '3', '4', '12'], answer: 3,
        why: 'Every row has 4 cells, and there are 3 rows: 3 × 4 = 12. "7" adds rows and columns instead of multiplying. "3" and "4" count only the rows or only the columns.',
        lessons: ['01-introduction'], skills: ['concept'], available_after: '01-introduction', level: 1 },
      { source: { assignment: 1, question: 11 },
        q: 'Consider A = [7, 2, 9, 4]. After swap(A[1], A[3]), what is A?',
        options: ['[7, 4, 9, 2]', '[2, 7, 4, 9]', '[7, 9, 2, 4]', '[4, 2, 9, 7]'], answer: 0,
        why: 'Indexes start at 0: A[1] = 2 and A[3] = 4. Swapping them gives [7, 4, 9, 2]; A[0] and A[2] do not move. "[4, 2, 9, 7]" swaps the 1st and 4th elements, as if indexes started at 1.',
        lessons: ['01-introduction'], skills: ['trace'], available_after: '01-introduction', level: 1 },
      { source: { assignment: 1, question: 16 },
        q: 'A = [2, 4, 6, 8]. What is the value of sum after: sum = 0; for each x in A: sum = sum + x?',
        options: ['18', '24', '20', '16'], answer: 2,
        why: 'sum goes 0 → 2 → 6 → 12 → 20. "18" or "16" forget one element (the first or the second); "24" adds an extra 4.',
        lessons: ['01-introduction'], skills: ['trace'], available_after: '01-introduction', level: 1 },
      { source: { assignment: 1, question: 15 },
        q: 'A = [5, 1, 5, 3]. What is the output of this code? count = 0; for each x in A: if x == 5: count++',
        options: ['1', '2', '3', '4'], answer: 1,
        why: 'The loop visits every element and adds 1 only when it equals 5: the elements at index 0 and 2. So count = 2. "1" stops at the first 5; "4" counts every element.',
        lessons: ['01-introduction'], skills: ['trace'], available_after: '01-introduction', level: 1 },
      { source: { assignment: 1, question: 19 },
        q: 'Which loop correctly visits every element of a zero-based array A exactly once?',
        options: ['for i = 1; i < length(A); i++', 'for i = 1; i <= length(A); i++', 'for i = 0; i <= length(A); i++', 'for i = 0; i < length(A); i++'], answer: 3,
        why: 'The valid indexes are 0 to length − 1. Starting at 1 skips the first element. Using &lt;= reaches index length, which does not exist (ArrayIndexOutOfBoundsException in Java).',
        lessons: ['01-introduction'], skills: ['bug', 'edge_case'], available_after: '01-introduction', level: 1 },
      { source: { assignment: 1, question: 14 },
        q: 'A = [1, 2, 3, 4, 5]. After one right rotation, what is A?',
        options: ['[4, 5, 1, 2, 3]', '[5, 4, 3, 2, 1]', '[5, 1, 2, 3, 4]', '[2, 3, 4, 5, 1]'], answer: 2,
        why: 'A right rotation moves every element one place to the right, and the last one comes around to the front: [5, 1, 2, 3, 4]. "[2, 3, 4, 5, 1]" is a <b>left</b> rotation. "[4, 5, 1, 2, 3]" is two right rotations, and "[5, 4, 3, 2, 1]" is a reverse, not a rotation.',
        lessons: ['01-introduction'], skills: ['trace'], available_after: '01-introduction', level: 1 },
      { source: { assignment: 1, question: 25 },
        q: 'What is the safest {{initialization|القيمة الابتدائية}} for finding the maximum in a nonempty array?',
        options: ['Set maximum to 0', 'Set maximum to length(A)', 'Set maximum to the last valid index', 'Set maximum to A[0]'], answer: 3,
        why: 'A[0] is a real element of the array, so the answer can never be a value that is not in the array. 0 fails when all values are negative. length(A) and an index are positions, not values: they may be bigger than every element. The drawing of slide 12 does the same with the index: it starts with max = 0, the index of A[0].',
        lessons: ['01-introduction'], skills: ['edge_case'], available_after: '01-introduction', level: 2 },
      { source: { assignment: 1, question: 1 },
        q: 'To find the largest element in an array, a programmer sets maximum = 0 before scanning the array. Why can the algorithm return a wrong answer?',
        options: ['Maximum finding requires sorting', 'Negative numbers cannot be stored in arrays', 'The loop must begin at index 1', 'Zero is not an element and is greater than every array value if all values are negative'], answer: 3,
        why: 'For [-7, -3, -9], no element is bigger than 0, so maximum stays 0, a number that is not even in the array. The right answer is -3. Arrays store negative numbers without problems, sorting is not needed (one pass is enough), and the start index is not the problem.',
        lessons: ['01-introduction'], skills: ['bug', 'edge_case'], available_after: '01-introduction', level: 2 },
      { type: 'bug', q: 'This version of problem 1 (slide 12) crashes on every array. Tap the line with the mistake.',
        code: 'public static int maxIndex(int[] array) {\n  int max = 0;\n  for (int i = 1; i <= array.length; i++)\n    if (array[i] > array[max]) max = i;\n  return max;\n}',
        answer: 3,
        why: 'With <code>i &lt;= array.length</code> the last turn reads <code>array[array.length]</code>, one cell after the end, so Java throws ArrayIndexOutOfBoundsException. It must be <code>i &lt; array.length</code>. Starting at i = 1 is fine, because max already starts at index 0.',
        lessons: ['01-introduction'], skills: ['bug'], available_after: '01-introduction', level: 2 },
      { source: { assignment: 1, question: 8 },
        q: 'The maximum {{contiguous|متّصل}}-subarray sum problem asks you to find a continuous part of an array of numbers that produces the largest possible total sum. For A = [-2, 3, -1, 4, -5], what is the maximum contiguous-subarray sum?',
        options: ['6', '4', '5', '9'], answer: 0,
        why: 'The part [3, -1, 4] gives 3 − 1 + 4 = 6. Taking the -1 is worth it, because the 4 after it is bigger. "4" is only the largest single element. 3 + 4 = 7 is not allowed, because 3 and 4 are not next to each other: the part must be continuous. "5" and "9" do not come from any continuous part.',
        lessons: ['01-introduction'], skills: ['trace'], available_after: '01-introduction', level: 3 }
    ],
    2: [
      { type: 'match', q: 'Match each data structure with the two implementations named on slide 13.',
        pairs: [['Stacks', 'ArrayStack and LinkedStack'], ['Queues', 'ArrayQueue and LinkedQueue'], ['Lists', 'ArrayList and LinkedList'], ['Maps', 'HashMap and HashTable']],
        why: 'The first word of each name says how the structure is built (an array, linked nodes, or hashing); the second word says which structure it is.',
        lessons: ['01-introduction'], skills: ['concept'], available_after: '01-introduction', level: 1 },
      { type: 'tf', q: 'Binary search is one of the sorting algorithms listed on slide 14.', answer: false,
        why: 'Binary search is listed alone as item 1: it <b>finds</b> a value. The sorting algorithms are item 2: selection, insertion, bubble, quick and merge sort.',
        lessons: ['01-introduction'], skills: ['concept'], available_after: '01-introduction', level: 1 },
      { type: 'multi', q: 'In the Java Collection Framework picture (slide 16), which names are <b>interfaces</b>?',
        options: ['List', 'ArrayList', 'Queue', 'Set', 'HashMap', 'Map'], answer: [0, 2, 3, 5],
        why: 'List, Queue, Set and Map are interfaces: they only say which methods exist. ArrayList and HashMap are classes that implement them.',
        lessons: ['01-introduction'], skills: ['concept'], available_after: '01-introduction', level: 2 },
      { q: 'Why does the course say "we will study the implementation of these interfaces and classes" (slide 16), when Java already has them?',
        options: ['Because Java\'s own classes have mistakes, and our versions fix them', 'Because the exam does not allow java.util, so we must write everything', 'Because writing them ourselves shows how they work inside, and so their good and bad sides', 'Because our own classes are always faster than the ones in Java'], answer: 2,
        why: 'Writing our own stack or list shows what happens inside each operation, and so which implementation is good for which job (slide 5). Java\'s classes are fine and we also use them; our versions are for understanding, not for speed.',
        lessons: ['01-introduction'], skills: ['concept', 'design'], available_after: '01-introduction', level: 2 }
    ]
  }
});
