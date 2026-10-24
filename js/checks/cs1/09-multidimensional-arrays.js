/* CS1 · Multidimensional Arrays: quick checks under the slides (1-2 per slide) and more part-quiz questions. */
addChecks({
  course: 'cs1', lesson: '09-multidimensional-arrays',
  slides: {
    2: [
      { q: 'Why is one index not enough for the distance table?', options: ['A value is found by its row and its column', 'The table has too many numbers', 'Distances are doubles'], answer: 0, why: 'A table needs two indexes.' }
    ],
    3: [
      { type: 'write', q: 'Declare and create a two-dimensional int array named grid with 3 rows and 4 columns, in one line.', checks: [{ re: /int\s*\[\s*\]\s*\[\s*\]\s*grid\s*=\s*new\s+int\s*\[\s*3\s*\]\s*\[\s*4\s*\]\s*;/, label: 'int[][] grid = new int[3][4];' }], solution: 'int[][] grid = new int[3][4];', why: 'Two pairs of brackets: rows first, then columns.' }
    ],
    4: [
      { type: 'trace', q: 'Use the array of slide 4. Fill in each value.', code: 'int[][] array = {\n  {1, 2, 3},\n  {4, 5, 6},\n  {7, 8, 9},\n  {10, 11, 12}\n};', cols: ['expression', 'value'], rows: [['array[0][2]', '?3'], ['array[3][0]', '?10'], ['array.length', '?4'], ['array[2].length', '?3']], why: 'array[row][column]. length counts the rows; array[2].length counts the elements of row 2.' }
    ],
    5: [
      { type: 'output', q: 'What does this print?', code: 'int[][] matrix = new int[2][3];\nmatrix[1][2] = 8;\nSystem.out.println(matrix[0][0] + " " + matrix[1][2]);', answer: '0 8', why: 'The elements start at 0; only matrix[1][2] was changed.' },
      { type: 'fill', q: 'Complete the inner loop so it visits every column of row i.', code: 'for (int i = 0; i < matrix.length; i++)\n  for (int j = 0; j < matrix[___].length; j++)\n    matrix[i][j] = 1;', answer: ['i'], why: 'matrix[i].length is the length of row i.' }
    ],
    6: [
      { type: 'trace', q: 'Read the distance table of slide 6 (Chicago 0, Boston 1, New York 2, Atlanta 3, Miami 4, Dallas 5, Houston 6).', cols: ['expression', 'value'], rows: [['distances[1][2]', '?214|214.0'], ['distances[5][6]', '?239|239.0'], ['distances[3][3]', '?0|0.0']], why: 'Boston to New York is 214, Dallas to Houston is 239, and a city to itself is 0.' }
    ],
    7: [
      { q: 'int[][] array = {{1, 2, 3}, {4, 5, 6}}; is the same as…', options: ['new int[2][3] and then 6 assignments', 'new int[3][2] and then 6 assignments', 'new int[6]'], answer: 0, why: 'Two rows (inner braces), three values in each row.' }
    ],
    8: [
      { type: 'trace', q: 'Use the ragged matrix of slide 8. Fill in each value.', cols: ['expression', 'value'], rows: [['matrix.length', '?5'], ['matrix[1].length', '?4'], ['matrix[4].length', '?1'], ['matrix[2][1]', '?4']], why: 'Row 2 is {3, 4, 5}, so matrix[2][1] is 4.' }
    ],
    9: [
      { type: 'tf', q: 'In a ragged array, each row is its own array, with its own length.', answer: true, why: 'triangleArray is an array of references to rows.' }
    ],
    10: [
      { q: 'How many loops do you usually need to visit every element of a 2D array?', options: ['Two nested loops', 'One loop', 'Three loops'], answer: 0, why: 'One for the rows, one inside it for the columns.' }
    ],
    11: [
      { type: 'fill', q: 'Complete the line that reads each element.', code: 'for (int row = 0; row < matrix.length; row++)\n  for (int column = 0; column < matrix[row].length; column++)\n    matrix[row][column] = input.___();', answer: ['nextInt'], why: 'The numbers are read row by row.' }
    ],
    12: [
      { q: 'What values does (int)(Math.random() * 100) give?', options: ['0 to 99', '1 to 100', '0 to 100'], answer: 0, why: 'Math.random() is below 1, so the product is below 100.' }
    ],
    13: [
      { type: 'output', q: 'What does this print?', code: 'int[][] matrix = {{7, 8, 9}, {1, 2}};\nfor (int row = 0; row < matrix.length; row++) {\n  for (int column = 0; column < matrix[row].length; column++)\n    System.out.print(matrix[row][column] + " ");\n  System.out.println();\n}', answer: '7 8 9\n1 2', why: 'print inside the row, println() after each row.' }
    ],
    14: [
      { type: 'output', q: 'What does this print?', code: 'int[][] matrix = {{1, 2, 3}, {10, 20, 30}};\nint total = 0;\nfor (int row = 0; row < matrix.length; row++)\n  for (int column = 0; column < matrix[row].length; column++)\n    total += matrix[row][column];\nSystem.out.println(total);', answer: '66', why: '6 + 60 = 66.' }
    ],
    15: [
      { type: 'trace', q: 'Sum by column for this matrix.', code: 'int[][] matrix = {{2, 5}, {4, 1}, {3, 3}};', cols: ['column', 'sum'], rows: [['0', '?9'], ['1', '?9']], why: 'Column 0: 2 + 4 + 3 = 9. Column 1: 5 + 1 + 3 = 9.' },
      { type: 'bug', q: 'This code adds every column into one total. Tap the line that is in the wrong place.', code: 'int total = 0;\nfor (int column = 0; column < matrix[0].length; column++) {\n  for (int row = 0; row < matrix.length; row++)\n    total += matrix[row][column];\n  System.out.println("Sum for column " + column + " is " + total);\n}', answer: 1, why: 'total must start again at 0 for each column, so int total = 0; belongs inside the outer loop.' }
    ],
    16: [
      { q: 'In the 2D shuffle, where does matrix[i][j] go?', options: ['It is swapped with matrix[i1][j1], a random element', 'It moves one row down', 'It is sorted'], answer: 0, why: 'i1 is a random row and j1 a random column.' }
    ],
    17: [
      { type: 'write', q: 'Write the header of a method named rowCount that takes an int[][] and returns an int. End it with {.', checks: [{ re: /public\s+static\s+int\s+rowCount\s*\(\s*int\s*\[\s*\]\s*\[\s*\]\s*\w+\s*\)\s*\{/, label: 'public static int rowCount(int[][] m) {' }], solution: 'public static int rowCount(int[][] m) {', why: 'A 2D array is passed like a 1D one: the parameter type is int[][].' },
      { type: 'output', q: 'With sum of slide 17, what does this print?', code: 'System.out.println(sum(new int[][]{{1, 1}, {2, 2}, {3, 3}}));', answer: '12', why: '2 + 4 + 6 = 12.' }
    ],
    18: [
      { type: 'fill', q: 'Declare a three-dimensional double array named cube.', code: 'double___ cube;', answer: ['[][][]'], why: 'Three pairs of brackets for three indexes.' }
    ],
    19: [
      { type: 'trace', q: 'Use the scores of slide 19. Fill in each value.', cols: ['expression', 'value'], rows: [['scores[2][1][0]', '?9.4'], ['scores[5][4][1]', '?6.5'], ['scores.length', '?6'], ['scores[0].length', '?5']], why: 'scores[student][exam][part]. There are 6 rows of students and 5 exams each.' }
    ],
    20: [
      { type: 'output', q: 'Student 0 of slide 19. What is the total of the two parts of exam 0?', code: 'System.out.println(scores[0][0][0] + scores[0][0][1]);', answer: '28.0', why: '7.5 + 20.5 = 28.0.' },
      { type: 'tf', q: 'TotalScore needs three nested loops.', answer: true, why: 'One over the students, one over the exams, and one over the two parts of each exam.' }
    ]
  },
  parts: {
    0: [
      { type: 'bug', q: 'This code stops with an error. Tap the wrong line.', code: 'int[][] m = new int[2][3];\nm[1][2] = 5;\nm[2][1] = 7;', answer: 3, why: 'The rows are 0 and 1, so m[2] does not exist.' },
      { type: 'write', q: 'Declare, create and initialize a 2D int array named t with the rows {1, 2} and {3, 4}, in one line.', checks: [{ re: /int\s*\[\s*\]\s*\[\s*\]\s*t\s*=\s*\{\s*\{\s*1\s*,\s*2\s*\}\s*,\s*\{\s*3\s*,\s*4\s*\}\s*\}\s*;/, label: 'int[][] t = {{1, 2}, {3, 4}};' }], solution: 'int[][] t = {{1, 2}, {3, 4}};', why: 'Each inner pair of braces is one row.' },
      { type: 'match', q: 'Match each expression with its value for int[][] r = {{1, 2, 3}, {4}, {5, 6}};', pairs: [['r.length', '3 (the number of rows)'], ['r[1].length', '1'], ['r[2][1]', '6']], why: 'r has 3 rows; row 1 is {4}, so its length is 1; row 2 is {5, 6}.' }
    ],
    1: [
      { type: 'trace', q: 'Find the sum of each row.', code: 'int[][] m = {{3, 4, 5}, {10, 0, 1}, {7, 7, 7}};', cols: ['row', 'sum'], rows: [['0', '?12'], ['1', '?11'], ['2', '?21']], why: '3 + 4 + 5 = 12, 10 + 0 + 1 = 11, 7 + 7 + 7 = 21. Row 2 has the largest sum.' },
      { type: 'write', q: 'Complete the code: add every element of the 2D array m to total (already 0).', rows: 3, checks: [{ re: /for\s*\(\s*int\s+(\w+)\s*=\s*0\s*;\s*\1\s*<\s*m\s*\.\s*length\s*;/, label: 'a loop over the rows: i < m.length' }, { re: /for\s*\(\s*int\s+(\w+)\s*=\s*0\s*;\s*\1\s*<\s*m\s*\[\s*\w+\s*\]\s*\.\s*length\s*;/, label: 'a loop over the columns: j < m[i].length' }, { re: /total\s*\+=\s*m\s*\[\s*\w+\s*\]\s*\[\s*\w+\s*\]\s*;/, label: 'total += m[i][j];' }], solution: 'for (int i = 0; i < m.length; i++)\n  for (int j = 0; j < m[i].length; j++)\n    total += m[i][j];', why: 'Nested loops: rows outside, columns inside.' },
      { type: 'tf', q: 'For a ragged array, j < matrix[0].length is a safe inner condition.', answer: false, why: 'Rows can have different lengths. Use matrix[i].length.' }
    ],
    2: [
      { type: 'output', q: 'What does this print?', code: 'int[][][] a = new int[3][2][5];\nSystem.out.println(a.length * a[0].length * a[0][0].length);', answer: '30', why: '3 x 2 x 5 = 30 elements in all.' },
      { type: 'match', q: 'In scores[i][j][k] of slide 19, match each index with its meaning.', pairs: [['i', 'Which student'], ['j', 'Which exam'], ['k', 'Multiple-choice or essay part']], why: 'Read the indexes from the outside in.' }
    ]
  }
});
