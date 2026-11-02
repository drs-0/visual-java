/* CS1 · Arrays (1D): quick checks under the slides (1-2 per slide) and more part-quiz questions. */
addChecks({
  course: 'cs1', lesson: '08-arrays-1d',
  slides: {
    2: [
      { q: 'Why is the opening problem hard without an array?', options: ['Each number must be checked again after the average is known', 'Java cannot add 100 numbers in one loop', 'Scanner reads only 10 numbers at a time'], answer: 0, why: 'The numbers must be kept somewhere until the average is ready.' }
    ],
    3: [
      { type: 'tf', q: 'All the objectives of slide 3 have slides in this course.', answer: false, why: 'foreach loops, variable-length arguments, binary search and selection sort have no slides here.' }
    ],
    4: [
      { q: 'What can an array hold?', options: ['Values of any mixed types', 'Many values of the same type', 'Only one value'], answer: 1, why: 'A collection of the same type of data, under one name.' }
    ],
    5: [
      { type: 'fill', q: 'Declare a variable that refers to an array of int (the preferred style).', code: '___ scores;', answer: ['int[]'], why: 'The brackets after the type mean “an array of”.' },
      { type: 'tf', q: 'double myList[]; is allowed, but not preferred.', answer: true, why: 'The preferred style is double[] myList;' }
    ],
    6: [
      { type: 'write', q: 'Create an array of 20 doubles and store it in the variable prices (already declared as double[]).', checks: [{ re: /prices\s*=\s*new\s+double\s*\[\s*20\s*\]\s*;/, label: 'prices = new double[20];' }], solution: 'prices = new double[20];', why: 'new datatype[arraySize] makes the array.' },
      { q: 'myList = new double[10]; What is the index of the last element?', options: ['1', '9', '10'], answer: 1, why: 'Ten elements have the indexes 0 to 9.' }
    ],
    7: [
      { type: 'write', q: 'Declare and create an array of 5 chars named letters in one line.', checks: [{ re: /char\s*\[\s*\]\s*letters\s*=\s*new\s+char\s*\[\s*5\s*\]\s*;|char\s+letters\s*\[\s*\]\s*=\s*new\s+char\s*\[\s*5\s*\]\s*;/, label: 'char[] letters = new char[5];' }], solution: 'char[] letters = new char[5];', why: 'Declare and create in one step.' }
    ],
    8: [
      { type: 'output', q: 'What does this print?', code: 'int[] a = new int[25];\nSystem.out.println(a.length);', answer: '25', why: 'length is the number of elements.' },
      { type: 'tf', q: 'After an array is created, you can make it longer.', answer: false, why: 'Its size is fixed. You would need a new, bigger array.' }
    ],
    9: [
      { type: 'match', q: 'Match each array type with the default value of its elements.', pairs: [['int[]', '0'], ['double[]', '0.0'], ['boolean[]', 'false'], ['char[]', '\'\\u0000\'']], why: 'Slide 9.' }
    ],
    10: [
      { type: 'trace', q: 'a has length 6. Is each index allowed?', cols: ['index', 'allowed?'], rows: [['0', '?yes'], ['5', '?yes'], ['6', '?no'], ['-1', '?no']], why: 'The indexes go from 0 to length − 1 = 5.' }
    ],
    11: [
      { type: 'output', q: 'What does this print?', code: 'double[] myList = {2.5, 4.0, 0.0};\nmyList[2] = myList[0] + myList[1];\nSystem.out.println(myList[2]);', answer: '6.5', why: 'myList[2] is used like a normal double variable.' }
    ],
    12: [
      { type: 'output', q: 'What does this print?', code: 'double[] myList = {1.9, 2.9, 3.4, 3.5};\nSystem.out.println(myList.length + " " + myList[1]);', answer: '4 2.9', why: 'Java counts the values to find the length. Index 1 is the second value.' }
    ],
    13: [
      { type: 'order', q: 'Put the long version of the initializer in order.', lines: ['double[] myList = new double[3];', 'myList[0] = 1.5;', 'myList[1] = 2.5;', 'myList[2] = 3.5;'], why: 'Create the array first, then fill each index.' }
    ],
    14: [
      { type: 'bug', q: 'This code does not compile. Tap the wrong line.', code: 'int[] marks;\nmarks = {80, 75, 92};\nSystem.out.println(marks[0]);', answer: 2, why: 'The braces form must be in the declaration: int[] marks = {80, 75, 92};' }
    ],
    15: [
      { type: 'output', q: 'What does this print?', code: 'int[] values = new int[5];\nSystem.out.println(values[0] + values[4]);', answer: '0', why: 'All five elements start at 0.' }
    ],
    16: [
      { q: 'At the start of the loop, which index is changed first?', options: ['values[4]', 'values[0]', 'values[1]'], answer: 2, why: 'The loop starts at i = 1.' }
    ],
    17: [
      { type: 'tf', q: 'Before the body runs, Java checks i < 5.', answer: true, why: 'A for loop checks its condition first.' }
    ],
    18: [
      { type: 'fill', q: 'Complete the first iteration.', code: 'values[1] = 1 + values[0];   // values[1] is ___', answer: ['1'], why: '1 + 0 = 1.' }
    ],
    19: [
      { q: 'When does i++ run?', options: ['Before the body', 'After the body', 'Only once'], answer: 1, why: 'It is the action after each iteration.' }
    ],
    20: [
      { q: 'i is 2. Is i < 5?', options: ['true', 'false'], answer: 0, why: 'So the body runs again.' }
    ],
    21: [
      { type: 'fill', q: 'Complete the second iteration.', code: 'values[2] = 2 + values[1];   // values[2] is ___', answer: ['3'], why: 'values[1] is 1, so 2 + 1 = 3.' }
    ],
    22: [
      { q: 'What is i after this step?', options: ['2', '3', '4'], answer: 1, why: 'i++ made it 3.' }
    ],
    23: [
      { type: 'tf', q: 'i is 3, so the loop is still inside the array.', answer: true, why: '3 < 5 and index 3 exists.' }
    ],
    24: [
      { type: 'fill', q: 'Complete the third iteration.', code: 'values[3] = 3 + values[2];   // values[3] is ___', answer: ['6'], why: 'values[2] is 3, so 3 + 3 = 6.' }
    ],
    25: [
      { q: 'What does the array look like now?', options: ['{0, 1, 3, 6, 0}', '{0, 1, 2, 3, 0}', '{1, 3, 6, 10, 0}'], answer: 0, why: 'Three iterations are done.' }
    ],
    26: [
      { type: 'tf', q: 'i is 4, the last index the loop will use.', answer: true, why: 'After it, i becomes 5 and the loop stops.' }
    ],
    27: [
      { type: 'fill', q: 'Complete the fourth iteration.', code: 'values[4] = 4 + values[3];   // values[4] is ___', answer: ['10'], why: 'values[3] is 6, so 4 + 6 = 10.' }
    ],
    28: [
      { q: 'i is now 5. Does values[5] exist?', options: ['Yes, it is 0', 'Yes', 'No: the last index is 4'], answer: 2, why: 'The array has 5 elements: indexes 0 to 4.' }
    ],
    29: [
      { type: 'tf', q: 'The loop stops because 5 < 5 is false.', answer: true, why: 'So the body is not run with i = 5.' }
    ],
    30: [
      { type: 'trace', q: 'Run the same program with an array of length 4. Fill in the elements at the end.', code: 'int[] values = new int[4];\nfor (int i = 1; i < 4; i++)\n  values[i] = i + values[i-1];\nvalues[0] = values[1] + values[3];', cols: ['values[0]', 'values[1]', 'values[2]', 'values[3]'], rows: [['?7', '?1', '?3', '?6']], why: 'values[1] = 1, values[2] = 3, values[3] = 6, then values[0] = 1 + 6 = 7.' }
    ],
    31: [
      { type: 'match', q: 'Match each pattern with its code idea.', pairs: [['Summing all elements', 'total += myList[i];'], ['Finding the largest element', 'if (myList[i] > max) max = myList[i];'], ['Printing arrays', 'System.out.print(myList[i] + " ");']], why: 'Each one is a for loop over the indexes.' }
    ],
    32: [
      { type: 'write', q: 'Complete the loop body: read a double from input into each element of myList.', code: 'for (int i = 0; i < myList.length; i++)', checks: [{ re: /myList\s*\[\s*i\s*\]\s*=\s*input\s*\.\s*nextDouble\s*\(\s*\)\s*;/, label: 'myList[i] = input.nextDouble();' }], solution: 'myList[i] = input.nextDouble();', why: 'One value is read for each index.' }
    ],
    33: [
      { q: 'What values can myList[i] = Math.random() * 100; give?', options: ['Whole numbers from 1 to 100', 'From 0.0 up to, but not including, 100.0', 'From 0.0 to 100.0, both included'], answer: 1, why: 'Math.random() is from 0.0 up to (not including) 1.0.' }
    ],
    34: [
      { type: 'output', q: 'What does this print?', code: 'int[] a = {4, 8, 15};\nfor (int i = 0; i < a.length; i++)\n  System.out.print(a[i] + " ");', answer: '4 8 15', why: 'print keeps all the elements on one line.' }
    ],
    35: [
      { type: 'output', q: 'What does this print?', code: 'int[] a = {10, -3, 7, 6};\nint total = 0;\nfor (int i = 0; i < a.length; i++)\n  total += a[i];\nSystem.out.println(total);', answer: '20', why: '10 − 3 + 7 + 6 = 20.' }
    ],
    36: [
      { type: 'bug', q: 'This code gives a wrong answer when all elements are negative. Tap the wrong line.', code: 'double[] myList = {-4.0, -1.5, -9.0};\ndouble max = 0;\nfor (int i = 0; i < myList.length; i++)\n  if (myList[i] > max) max = myList[i];', answer: 2, why: 'max must start with myList[0], not 0. Here it would stay 0, which is not in the array.' },
      { type: 'trace', q: 'Find the largest element step by step.', code: 'double[] myList = {3.0, 7.5, 2.0, 9.5};\ndouble max = myList[0];\nfor (int i = 1; i < myList.length; i++)\n  if (myList[i] > max) max = myList[i];', cols: ['i', 'myList[i]', 'max after it'], rows: [['1', '7.5', '?7.5'], ['2', '2.0', '?7.5'], ['3', '9.5', '?9.5']], why: 'max changes only when a bigger value comes.' }
    ],
    37: [
      { q: 'In the shuffle loop, i goes from…', options: ['1 up to 10', '0 up to the last index', 'the last index down to 1'], answer: 2, why: 'for (int i = myList.length - 1; i > 0; i--)' },
      { type: 'order', q: 'Put the three lines of a swap in order.', lines: ['double temp = myList[i];', 'myList[i] = myList[j];', 'myList[j] = temp;'], why: 'Keep one value in temp first, or it is lost.' }
    ],
    38: [
      { type: 'output', q: 'What does this print?', code: 'int[] a = {5, 6, 7};\nint temp = a[0];\nfor (int i = 1; i < a.length; i++)\n  a[i - 1] = a[i];\na[a.length - 1] = temp;\nSystem.out.println(a[0] + " " + a[1] + " " + a[2]);', answer: '6 7 5', why: 'Each element moves one place left, and the first goes to the end.' }
    ],
    39: [
      { type: 'trace', q: 'AnalyzeNumbers with the numbers 2, 8, 5, 9. Fill in the values.', cols: ['sum', 'average', 'numbers above the average'], rows: [['?24', '?6.0|6', '?2']], why: '2 + 8 + 5 + 9 = 24, 24 / 4 = 6.0, and 8 and 9 are above 6.' }
    ],
    40: [
      { type: 'output', q: 'What does this print?', code: 'int[] list1 = {4, 5};\nint[] list2 = {1, 2};\nlist2 = list1;\nlist1[1] = 50;\nSystem.out.println(list2[1]);', answer: '50', why: 'After list2 = list1, both names refer to the same array.' }
    ],
    41: [
      { type: 'bug', q: 'One line of slide 41 does not compile. Tap it.', code: 'int[] sourceArray = {2, 3, 1, 5, 10};\nint[] targetArray = new int[sourceArray.length];\nfor (int i = 0; i < sourceArrays.length; i++)\n  targetArray[i] = sourceArray[i];', answer: 3, why: 'The slide writes sourceArrays, but the variable is sourceArray.' }
    ],
    42: [
      { type: 'write', q: 'Copy all the elements of src into dst (dst already exists and is big enough) with System.arraycopy.', checks: [{ re: /System\s*\.\s*arraycopy\s*\(\s*src\s*,\s*0\s*,\s*dst\s*,\s*0\s*,\s*src\s*\.\s*length\s*\)\s*;/, label: 'System.arraycopy(src, 0, dst, 0, src.length);' }], solution: 'System.arraycopy(src, 0, dst, 0, src.length);', why: 'source, start in source, target, start in target, how many.' }
    ],
    43: [
      { type: 'output', q: 'What does this print?', code: 'public static void printArray(int[] array) {\n  for (int i = 0; i < array.length; i++)\n    System.out.print(array[i] + " ");\n}\n// in main:\nprintArray(new int[]{9, 0, 4});', answer: '9 0 4', why: 'The method works with an int array of any length.' }
    ],
    44: [
      { q: 'Which line uses an anonymous array?', options: ['printArray(new int[]{3, 1, 2});', 'int[] list = {3, 1, 2};', 'printArray(list);'], answer: 0, why: 'The array has no variable of its own.' }
    ],
    45: [
      { type: 'match', q: 'Match each kind of parameter with what the method gets.', pairs: [['int number', 'A copy of the value'], ['int[] numbers', 'A copy of the reference to the same array']], why: 'Still pass-by-value, but the value of an array variable is a reference.' }
    ],
    46: [
      { type: 'output', q: 'What does the Test program of slide 46 print?', code: 'int x = 1;\nint[] y = new int[10];\nm(x, y);\nSystem.out.println("x is " + x);\nSystem.out.println("y[0] is " + y[0]);', answer: 'x is 1\ny[0] is 5555', why: 'number = 1001 changes a copy; numbers[0] = 5555 changes the shared array.' }
    ],
    47: [
      { type: 'tf', q: 'During m(x, y), y and numbers refer to the same array.', answer: true, why: 'The reference value in y was passed to numbers.' }
    ],
    48: [
      { q: 'What is kept on the call stack?', options: ['The arrays themselves, with all their elements', 'The method records with their parameters and local variables', 'The source code of the methods'], answer: 1, why: 'The arrays are in the heap.' }
    ],
    49: [
      { type: 'tf', q: 'An array in the heap disappears when the method that made it ends, even if something still refers to it.', answer: false, why: 'It stays as long as something refers to it.' }
    ],
    50: [
      { q: 'Which method can really swap the first two elements of an array?', options: ['Both methods, because both get the values', 'swap(int n1, int n2)', 'swapFirstTwoInArray(int[] array)'], answer: 2, why: 'It gets the reference, so it can change the real elements.' }
    ],
    51: [
      { type: 'output', q: 'What does this print?', code: 'int[] a = {1, 2};\nswap(a[0], a[1]);\nSystem.out.println(a[0] + " " + a[1]);\nswapFirstTwoInArray(a);\nSystem.out.println(a[0] + " " + a[1]);', answer: '1 2\n2 1', why: 'swap changes only copies; swapFirstTwoInArray changes the array.' }
    ],
    52: [
      { type: 'write', q: 'Write the header of a method named copyOf that takes an int array and returns an int array. End it with {.', checks: [{ re: /public\s+static\s+int\s*\[\s*\]\s*copyOf\s*\(\s*int\s*\[\s*\]\s*\w+\s*\)\s*\{/, label: 'public static int[] copyOf(int[] list) {' }], solution: 'public static int[] copyOf(int[] list) {', why: 'The return type int[] means it gives back a reference to an int array.' }
    ],
    53: [
      { q: 'list1 is {1, 2, 3, 4, 5, 6}. What is result right after it is created?', options: ['{1, 2, 3, 4, 5, 6}', '{0, 0, 0, 0, 0, 0}', 'It has no elements'], answer: 1, why: 'Same length as list, all 0.' }
    ],
    54: [
      { type: 'fill', q: 'At the start of the loop, what is j?', code: 'int j = result.length - 1;   // j is ___', answer: ['5'], why: 'The length is 6, so j starts at the last index, 5.' }
    ],
    55: [
      { type: 'tf', q: 'The loop condition is i < list.length.', answer: true, why: 'i goes over every index of list.' }
    ],
    56: [
      { type: 'fill', q: 'i = 0 and j = 5. Which element is set?', code: 'result[___] = list[0];', answer: ['5'], why: 'The first element of list goes to the last place of result.' }
    ],
    57: [
      { q: 'After i++ and j--, what are i and j?', options: ['i = 1, j = 4', 'i = 1, j = 5', 'i = 0, j = 4'], answer: 0, why: 'Both change at the same time.' }
    ],
    58: [
      { type: 'tf', q: 'i is 1, so the loop continues.', answer: true, why: '1 < 6.' }
    ],
    59: [
      { q: 'What is result after result[4] = list[1]?', options: ['{0, 0, 0, 0, 1, 2}', '{1, 2, 0, 0, 0, 0}', '{0, 0, 0, 0, 2, 1}'], answer: 2, why: 'result[5] is 1 and now result[4] is 2.' }
    ],
    60: [
      { q: 'What are i and j now?', options: ['i = 3, j = 2', 'i = 2, j = 3', 'i = 2, j = 4'], answer: 1, why: 'One more step: i up, j down.' }
    ],
    61: [
      { type: 'tf', q: 'i + j is always 5 in this loop.', answer: true, why: 'i goes up by 1 while j goes down by 1, so their sum stays length − 1.' }
    ],
    62: [
      { type: 'fill', q: 'i = 2 and j = 3. Complete the step.', code: 'result[3] = list[2];   // result[3] is ___', answer: ['3'], why: 'list[2] is 3.' }
    ],
    63: [
      { q: 'After this step, which is bigger, i or j?', options: ['i (3) is bigger than j (2)', 'j (3) is bigger than i (2)', 'They are equal: both are 2'], answer: 0, why: 'They have passed each other, but the loop goes on while i < 6.' }
    ],
    64: [
      { type: 'tf', q: 'The loop stops when i is greater than j.', answer: false, why: 'It stops only when i < list.length is false.' }
    ],
    65: [
      { type: 'fill', q: 'i = 3 and j = 2. Complete the step.', code: 'result[2] = list[3];   // result[2] is ___', answer: ['4'], why: 'list[3] is 4.' }
    ],
    66: [
      { q: 'What are i and j now?', options: ['i = 5, j = 1', 'i = 4, j = 2', 'i = 4, j = 1'], answer: 2, why: 'i up, j down.' }
    ],
    67: [
      { type: 'tf', q: 'Two more elements are still to be copied after this check.', answer: true, why: 'i = 4 and i = 5.' }
    ],
    68: [
      { q: 'What is result after result[1] = list[4]?', options: ['{0, 5, 4, 3, 2, 1}', '{5, 4, 3, 2, 1, 0}', '{0, 0, 4, 3, 2, 1}'], answer: 0, why: 'list[4] is 5, stored at index 1.' }
    ],
    69: [
      { type: 'fill', q: 'After this step, j is ___.', lang: 'none', code: 'i is 5 and j is ___', answer: ['0'], why: 'j went down from 1 to 0.' }
    ],
    70: [
      { type: 'tf', q: 'i is 5, so the body runs one last time.', answer: true, why: '5 < 6.' }
    ],
    71: [
      { q: 'What is result after result[0] = list[5]?', options: ['{0, 5, 4, 3, 2, 1}', '{1, 2, 3, 4, 5, 6}', '{6, 5, 4, 3, 2, 1}'], answer: 2, why: 'All six elements are now in reverse order.' }
    ],
    72: [
      { q: 'What are i and j after the last update?', options: ['i = 5, j = 0', 'i = 6, j = -1', 'i = 6, j = 0'], answer: 1, why: 'i++ and j-- run once more.' }
    ],
    73: [
      { type: 'tf', q: 'The loop exits because 6 < 6 is false.', answer: true, why: 'j = -1 is never used.' }
    ],
    74: [
      { type: 'tf', q: 'After list2 = reverse(list1), list1 is reversed too.', answer: false, why: 'reverse fills a new array; list1 does not change.' }
    ],
    75: [
      { type: 'output', q: 'With reverse of slide 52, what does this print?', code: 'int[] list2 = reverse(new int[]{3, 6, 9, 12});\nSystem.out.println(list2[0] + " " + list2[3]);', answer: '12 3', why: 'The last element comes first, and the first comes last.' }
    ],
    76: [
      { type: 'trace', q: 'What does linearSearch return for each key?', code: 'int[] list = {5, 8, 2, 8, 1};', cols: ['key', 'returns'], rows: [['2', '?2'], ['8', '?1'], ['1', '?4'], ['7', '?-1']], why: 'It returns the index of the first match, or -1.' }
    ],
    77: [
      { q: 'In the worst case, how many elements does linear search compare?', options: ['All of them', 'Only the first', 'Half of them, always'], answer: 0, why: 'When the key is last or not there.' }
    ],
    78: [
      { type: 'fill', q: 'Key 3 in the list 6 4 1 9 7 3 2 8. How many comparisons does linear search make?', lang: 'none', code: 'comparisons: ___', answer: ['6'], why: '6, 4, 1, 9, 7, then 3 matches: six comparisons, at index 5.' }
    ],
    79: [
      { type: 'output', q: 'What does this print?', code: 'char[] chars = {\'a\', \'A\', \'4\', \'F\', \'D\', \'P\'};\njava.util.Arrays.sort(chars);\nSystem.out.println(java.util.Arrays.toString(chars));', answer: '[4, A, D, F, P, a]', why: 'Chars are sorted by their codes: digits, then capitals, then small letters.' }
    ],
    80: [
      { q: 'What does System.out.println(myArray) print for an array variable?', options: ['Its length, like 10', 'All the elements, like [1.0, 2.0]', 'Something like [D@1b6d3586 (its reference)'], answer: 2, why: 'Use Arrays.toString(myArray) to see the elements.' }
    ],
    81: [
      { type: 'fill', q: 'Complete the parameter of main.', code: 'public static void main(___ args)', answer: ['String[]'], why: 'main takes an array of Strings.' }
    ],
    82: [
      { type: 'output', q: 'What does class A of slide 82 print?', code: 'String[] strings = {"New York", "Boston", "Atlanta"};\nB.main(strings);   // B.main prints each args[i]', answer: 'New York\nBoston\nAtlanta', why: 'B.main prints each element of the array it gets.' }
    ]
  },
  parts: {
    0: [
      { type: 'trace', q: 'What does each line print?', cols: ['line', 'printed'], rows: [['int[] a = new int[4]; System.out.println(a[3]);', '?0'], ['double[] d = {1.5, 2.5}; System.out.println(d.length);', '?2'], ['char[] c = {\'x\', \'y\'}; System.out.println(c[1]);', '?y']], why: 'Default 0; the initializer has 2 values; index 1 is the second element.' },
      { type: 'write', q: 'Declare, create and initialize an int array named days with the values 31, 28 and 31, in one line.', checks: [{ re: /int\s*\[\s*\]\s*days\s*=\s*\{\s*31\s*,\s*28\s*,\s*31\s*\}\s*;/, label: 'int[] days = {31, 28, 31};' }], solution: 'int[] days = {31, 28, 31};', why: 'An array initializer in one statement.' },
      { type: 'bug', q: 'This code stops with an error. Tap the wrong line.', code: 'int[] a = new int[3];\nfor (int i = 0; i <= a.length; i++)\n  a[i] = i;', answer: 2, why: 'i <= a.length lets i reach 3, but the last index is 2. Use i < a.length.' }
    ],
    1: [
      { type: 'trace', q: 'Follow the loop. Fill in the array at the end.', code: 'int[] v = new int[4];\nfor (int i = 1; i < 4; i++)\n  v[i] = v[i-1] + i * 2;', cols: ['v[0]', 'v[1]', 'v[2]', 'v[3]'], rows: [['?0', '?2', '?6', '?12']], why: 'v[1] = 0 + 2, v[2] = 2 + 4, v[3] = 6 + 6.' },
      { q: 'In the program of slides 15-30, what would happen if the loop started at i = 0?', options: ['values[0] would be 1 and the rest would shift', 'It would work the same as before', 'values[-1] would stop the program with an error'], answer: 2, why: 'values[i-1] with i = 0 is values[-1].' }
    ],
    2: [
      { type: 'write', q: 'Write a for loop that counts how many elements of the int array a are negative, in the variable count (already 0).', rows: 3, checks: [{ re: /for\s*\(\s*int\s+i\s*=\s*0\s*;\s*i\s*<\s*a\s*\.\s*length\s*;\s*i\s*\+\+\s*\)/, label: 'for (int i = 0; i < a.length; i++)' }, { re: /if\s*\(\s*a\s*\[\s*i\s*\]\s*<\s*0\s*\)/, label: 'if (a[i] < 0)' }, { re: /count\s*\+\+|count\s*\+=\s*1/, label: 'count++' }], solution: 'for (int i = 0; i < a.length; i++)\n  if (a[i] < 0)\n    count++;', why: 'Go over every index and test each element.' },
      { type: 'output', q: 'What does this print?', code: 'int[] a = {3, 9, 4};\nint max = a[0], index = 0;\nfor (int i = 1; i < a.length; i++)\n  if (a[i] > max) { max = a[i]; index = i; }\nSystem.out.println(max + " at " + index);', answer: '9 at 1', why: 'The largest element is 9, at index 1.' },
      { type: 'output', q: 'What does the shift of slide 38 make of {10, 20, 30, 40}?', code: 'int[] a = {10, 20, 30, 40};\nint temp = a[0];\nfor (int i = 1; i < a.length; i++)\n  a[i - 1] = a[i];\na[a.length - 1] = temp;\nSystem.out.println(java.util.Arrays.toString(a));', answer: '[20, 30, 40, 10]', why: 'Shift left, and the first element goes to the end.' }
    ],
    3: [
      { type: 'output', q: 'What does this print?', code: 'int[] a = {1, 2, 3};\nint[] b = new int[3];\nSystem.arraycopy(a, 0, b, 0, 3);\nb[0] = 100;\nSystem.out.println(a[0] + " " + b[0]);', answer: '1 100', why: 'arraycopy makes a real copy, so changing b does not change a.' },
      { type: 'output', q: 'What does this print?', code: 'public static void doubleAll(int[] arr) {\n  for (int i = 0; i < arr.length; i++)\n    arr[i] *= 2;\n}\n// in main:\nint[] a = {1, 5};\ndoubleAll(a);\nSystem.out.println(a[0] + " " + a[1]);', answer: '2 10', why: 'The method gets the reference, so it changes the real array.' },
      { type: 'match', q: 'Match each word with where it lives.', pairs: [['Method records (activation records)', 'The call stack'], ['Arrays', 'The heap']], why: 'Slides 47 to 49.' }
    ],
    4: [
      { type: 'trace', q: 'Follow reverse for list = {4, 7, 9}.', cols: ['i', 'j', 'result after this step'], rows: [['0', '?2', '?{0, 0, 4}|0,0,4|{0,0,4}'], ['1', '?1', '?{0, 7, 4}|0,7,4|{0,7,4}'], ['2', '?0', '?{9, 7, 4}|9,7,4|{9,7,4}']], why: 'i goes up and j goes down; result[j] = list[i].' },
      { type: 'tf', q: 'reverse returns a reference to a new array.', answer: true, why: 'The return type is int[].' }
    ],
    5: [
      { type: 'output', q: 'What does this print?', code: 'double[] numbers = {6.0, 4.4, 1.9, 2.9, 3.4, 3.5};\njava.util.Arrays.sort(numbers);\nSystem.out.println(numbers[0] + " " + numbers[5]);', answer: '1.9 6.0', why: 'After sorting, the smallest is first and the largest is last.' },
      { type: 'bug', q: 'This linearSearch returns -1 too early. Tap the wrong line.', code: 'public static int linearSearch(int[] list, int key) {\n  for (int i = 0; i < list.length; i++) {\n    if (key == list[i]) return i;\n    else return -1;\n  }\n  return -1;\n}', answer: 4, why: 'It gives up after the first element. return -1 belongs after the loop only.' },
      { type: 'write', q: 'Print the int array a with Arrays.toString (write the full name java.util.Arrays).', checks: [{ re: /System\s*\.\s*out\s*\.\s*println\s*\(\s*java\s*\.\s*util\s*\.\s*Arrays\s*\.\s*toString\s*\(\s*a\s*\)\s*\)\s*;/, label: 'System.out.println(java.util.Arrays.toString(a));' }], solution: 'System.out.println(java.util.Arrays.toString(a));', why: 'Arrays.toString gives a string like [1, 2, 3].' }
    ]
  }
});
