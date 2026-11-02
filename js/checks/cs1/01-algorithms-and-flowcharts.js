/* CS1 · Algorithms and Flowcharts: quick checks under the slides (1-2 per slide) and more part-quiz questions. */
addChecks({
  course: 'cs1', lesson: '01-algorithms-and-flowcharts',
  slides: {
    2: [
      { q: 'What do you produce in the problem solving phase?', options: ['An ordered list of steps that solves the problem', 'A finished Java program that runs on the computer', 'A drawing of the screen the user will see'], answer: 0, why: 'This list of steps is the algorithm.' },
      { type: 'match', q: 'Match each phase with what you do in it.', pairs: [['Problem solving phase', 'Write the steps of the solution, in order'], ['Implementation phase', 'Write the steps in a programming language']], why: 'First think and plan, then write the code.' }
    ],
    3: [
      { type: 'tf', q: 'An algorithm is a step-by-step list of instructions for doing a task.', answer: true, why: 'Like a cooking recipe.' },
      { type: 'match', q: 'Match each word with its kind of solution.', pairs: [['The algorithm', 'The conceptual solution (the idea)'], ['The program', 'The technical solution (the code)']], why: 'The program follows the idea of the algorithm.' }
    ],
    4: [
      { type: 'order', q: 'Put the steps of problem solving in order.', lang: 'none', lines: ['Write a general algorithm (pseudocode)', 'Refine it again and again', 'Get a detailed algorithm, close to a computer language'], why: 'You start general, then make the steps smaller and clearer.' },
      { q: 'What is pseudocode?', options: ['A programming language that the computer runs', 'An informal language, very similar to everyday English', 'A drawing made of symbols'], answer: 1, why: 'It is artificial and informal: there are no strict rules.' }
    ],
    5: [
      { type: 'fill', q: 'Complete the programmer’s job.', lang: 'none', code: 'Create an ___ for the goal, then translate\neach step into a programming language.', answer: ['algorithm'], why: 'First the algorithm, then the translation into code.' },
      { type: 'tf', q: 'The computer understands the steps of an algorithm written in everyday English.', answer: false, why: 'The steps must be translated into a programming language that the computer can understand.' }
    ],
    6: [
      { q: 'In Example 1, how is the final grade calculated?', options: ['The biggest of the four marks', 'The average of the four marks', 'The sum of the four marks'], answer: 1, why: 'The slide says: the average of four marks.' }
    ],
    7: [
      { type: 'fill', q: 'Complete the pseudocode of Example 1.', lang: 'text', code: 'Input a set of 4 marks\nCalculate their average by summing and dividing by ___', answer: ['4'], why: 'There are four marks, so you divide the sum by 4.' },
      { type: 'tf', q: 'In the if ... else of the pseudocode, both Print lines run.', answer: false, why: 'Only one of them runs: FAIL when the average is below 50, PASS otherwise.' }
    ],
    8: [
      { type: 'bug', q: 'One line of this detailed algorithm is wrong. Tap it.', lang: 'text', code: 'Step 1:  Input M1,M2,M3,M4\nStep 2:  GRADE ← (M1+M2+M3+M4)/3\nStep 3:  if (GRADE < 50) then\n             Print “FAIL”\n         else\n             Print “PASS”\n         endif', answer: 2, why: 'There are four marks, so the sum must be divided by 4, not 3.' },
      { type: 'trace', q: 'Follow the detailed algorithm. Fill in GRADE and what is printed.', lang: 'text', code: 'GRADE ← (M1+M2+M3+M4)/4\nif (GRADE < 50) then Print “FAIL” else Print “PASS”', cols: ['M1', 'M2', 'M3', 'M4', 'GRADE', 'printed'], rows: [['60', '70', '80', '90', '?75', '?PASS|“PASS”|"PASS"'], ['20', '40', '60', '40', '?40', '?FAIL|“FAIL”|"FAIL"']], why: '(60+70+80+90)/4 = 300/4 = 75, not below 50: PASS. (20+40+60+40)/4 = 160/4 = 40, below 50: FAIL.' }
    ],
    9: [
      { q: 'What is a flowchart?', options: ['A drawing of the steps, in order', 'A list of Java commands', 'A table of marks'], answer: 0, why: 'It is a graphical representation of the sequence of operations.' },
      { type: 'match', q: 'Match each kind of flowchart with what it shows.', pairs: [['Program flowchart', 'The steps of one program'], ['Information system flowchart', 'How data moves through a whole system']], why: 'In this unit we draw program flowcharts.' }
    ],
    10: [
      { type: 'match', q: 'Match each symbol with its use (slide 10).', pairs: [['Oval', 'The beginning or end of the program'], ['Parallelogram', 'An input operation'], ['Rectangle', 'A process, like a calculation'], ['Diamond', 'A decision (one of two routes)'], ['Hybrid', 'An output operation']], why: 'These are the symbols of slide 10.' },
      { q: 'Which symbol shows the direction of the logic flow?', options: ['The oval', 'The flow line', 'The diamond'], answer: 1, why: 'The arrows (flow lines) show which step comes next.' }
    ],
    11: [
      { q: 'How many arrows go out of a Process block?', options: ['None', 'Two', 'One'], answer: 2, why: 'One arrow in and one arrow out. Only the decision has two arrows out.' },
      { type: 'tf', q: 'An arrow comes into the Start block.', answer: false, why: 'The flowchart begins at Start, so an arrow only goes out of it.' }
    ],
    12: [
      { q: 'Which symbol is used for the Start and End blocks?', options: ['Rectangle', 'Oval', 'Diamond'], answer: 1, why: 'Both use the oval.' },
      { type: 'tf', q: 'The label of a Start or End block should be short and simple.', answer: true, why: 'For example START and STOP.' }
    ],
    13: [
      { q: 'Which label fits an Input/Output block?', options: ['Input W, L', 'IS GRADE < 50', 'A ← L x W'], answer: 0, why: 'It reads data. IS GRADE < 50 is a decision, and A ← L x W is a process.' }
    ],
    14: [
      { type: 'tf', q: 'A process block often does a calculation.', answer: true, why: 'Like A ← L x W.' },
      { q: 'What should the label of a process block say?', options: ['A question with a yes or no answer', 'The name of the program', 'What operation is done, like A ← L x W'], answer: 2, why: 'It is a brief description of the process.' }
    ],
    15: [
      { q: 'Which label fits a decision block?', options: ['IS VALUE1 > VALUE2', 'Print MAX', 'Input VALUE1, VALUE2'], answer: 0, why: 'A decision block contains a question.' },
      { type: 'tf', q: 'The answer of a decision block can be True, False or Maybe.', answer: false, why: 'It is a True/False choice: only two answers, so two arrows.' }
    ],
    16: [
      { q: 'In the Example 1 flowchart, GRADE is 62. Which path is taken after IS GRADE < 50?', options: ['Y, then PRINT “FAIL”', 'N, then PRINT “PASS”'], answer: 1, why: '62 < 50 is false, so the flowchart follows N.' },
      { type: 'match', q: 'Match each block of the Example 1 flowchart with its symbol.', pairs: [['START', 'Oval'], ['Input M1,M2,M3,M4', 'Parallelogram'], ['GRADE ← (M1+M2+M3+M4)/4', 'Rectangle'], ['IS GRADE < 50', 'Diamond'], ['PRINT “PASS”', 'Hybrid']], why: 'Start/stop, input, process, decision, output.' }
    ],
    17: [
      { type: 'fill', q: 'Complete the pseudocode of Example 2.', lang: 'text', code: 'Input the length in feet (Lft)\nCalculate the length in cm (Lcm) by multiplying Lft with ___\nPrint length in cm (Lcm)', answer: ['30'], why: 'The slide multiplies the feet by 30.' },
      { type: 'tf', q: 'Example 2 needs a decision block.', answer: false, why: 'It only has input, calculate and print. There is no question to ask.' }
    ],
    18: [
      { type: 'trace', q: 'Follow Example 2 for each input. What is Lcm?', lang: 'text', code: 'Step 1:  Input Lft\nStep 2:  Lcm ← Lft x 30\nStep 3:  Print Lcm', cols: ['Lft', 'Lcm'], rows: [['2', '?60'], ['5', '?150'], ['0.5', '?15']], why: 'Lcm is Lft times 30: 2 x 30 = 60, 5 x 30 = 150, 0.5 x 30 = 15.' },
      { type: 'write', q: 'Write Step 2 of Example 2: store Lft times 30 in Lcm. Type <- for the arrow if you cannot type ←.', lang: 'text', checks: [{ re: /Lcm\s*←\s*(Lft\s*[x×*]\s*30|30\s*[x×*]\s*Lft)/, label: 'Lcm ← Lft x 30' }], solution: 'Lcm ← Lft x 30', why: 'The arrow stores the result of Lft x 30 in Lcm.' }
    ],
    19: [
      { q: 'How is the area calculated in Example 3?', options: ['Divide L by W', 'Add L and W', 'Multiply L with W'], answer: 2, why: 'The area of a rectangle is length times width.' },
      { type: 'tf', q: 'One input block can read two values, W and L.', answer: true, why: 'Input W, L reads both.' }
    ],
    20: [
      { type: 'bug', q: 'One step of this algorithm is wrong. Tap it.', lang: 'text', code: 'Step 1:  Input W, L\nStep 2:  A ← L + W\nStep 3:  Print A', answer: 2, why: 'The area is L x W, not L + W.' },
      { type: 'output', q: 'Example 3 with W = 5 and L = 8. What is printed?', lang: 'text', code: 'Step 1:  Input W, L\nStep 2:  A ← L x W\nStep 3:  Print A', answer: '40', why: 'A ← 8 x 5 = 40.' }
    ],
    21: [
      { q: 'What is an identifying message?', options: ['An error message that stops the program', 'A sentence that says what the number means', 'The name of the program, printed at the start'], answer: 1, why: 'Like “The largest value is”.' },
      { type: 'tf', q: 'Example 4 needs a decision, because it must find which value is bigger.', answer: true, why: 'It asks: is VALUE1 > VALUE2?' }
    ],
    22: [
      { type: 'trace', q: 'Follow the algorithm of Example 4. What is MAX?', lang: 'text', code: 'if (VALUE1 > VALUE2) then\n    MAX ← VALUE1\nelse\n    MAX ← VALUE2\nendif', cols: ['VALUE1', 'VALUE2', 'MAX'], rows: [['3', '8', '?8'], ['10', '2', '?10'], ['6', '6', '?6']], why: '3 > 8 is false: MAX ← VALUE2 = 8. 10 > 2 is true: MAX ← VALUE1 = 10. 6 > 6 is false: MAX ← VALUE2 = 6.' },
      { type: 'fill', q: 'Complete Step 2 of Example 4.', lang: 'text', code: 'if (VALUE1 > VALUE2) then\n    MAX ← ___\nelse\n    MAX ← ___\nendif', answer: ['VALUE1', 'VALUE2'], why: 'When VALUE1 is bigger, MAX gets VALUE1. Otherwise MAX gets VALUE2.' }
    ],
    23: [
      { q: 'In the Example 4 flowchart, where does the Y (yes) arrow lead?', options: ['To MAX ← VALUE1', 'To MAX ← VALUE2', 'Straight to STOP'], answer: 0, why: 'Yes means VALUE1 > VALUE2, so MAX gets VALUE1.' },
      { type: 'order', q: 'Put the blocks of the “yes” path of Example 4 in order.', lang: 'text', lines: ['START', 'Input VALUE1, VALUE2', 'is VALUE1 > VALUE2', 'MAX ← VALUE1', 'Print “The largest value is”, MAX', 'STOP'], why: 'Read the values, ask, store the bigger one, print, stop.' }
    ]
  },
  parts: {
    0: [
      { type: 'match', q: 'Match each word with its meaning.', pairs: [['Algorithm', 'Ordered steps that solve a problem'], ['Pseudocode', 'An informal language close to English'], ['Program', 'The algorithm written in a programming language']], why: 'Slides 2 to 5.' },
      { type: 'tf', q: 'You should write the program before you have an algorithm.', answer: false, why: 'The problem solving phase (the algorithm) comes first.' },
      { q: 'A cooking recipe is a good everyday example of…', options: ['an algorithm', 'a programming language', 'a computer'], answer: 0, why: 'It is a list of steps, in order, that does a task.' },
      { type: 'fill', q: 'Complete the sentence from slide 3.', lang: 'none', code: 'The algorithm is the ___ solution.\nThe program is the technical solution.', answer: ['conceptual'], why: 'The algorithm is the idea; the program is the code.' }
    ],
    1: [
      { type: 'trace', q: 'Follow Example 1 with these marks.', lang: 'text', code: 'GRADE ← (M1+M2+M3+M4)/4\nif (GRADE < 50) then Print “FAIL” else Print “PASS”', cols: ['M1', 'M2', 'M3', 'M4', 'GRADE', 'printed'], rows: [['90', '30', '20', '40', '?45', '?FAIL|“FAIL”|"FAIL"'], ['55', '45', '60', '40', '?50', '?PASS|“PASS”|"PASS"']], why: '180/4 = 45 is below 50: FAIL. 200/4 = 50 is not below 50: PASS.' },
      { type: 'bug', q: 'This algorithm gives the wrong answer for some marks. Tap the wrong line.', lang: 'text', code: 'Step 1:  Input M1,M2,M3,M4\nStep 2:  GRADE ← (M1+M2+M3+M4)/4\nStep 3:  if (GRADE > 50) then\n             Print “FAIL”\n         else\n             Print “PASS”\n         endif', answer: 3, why: 'The student fails when GRADE is below 50, so the test must be GRADE < 50.' },
      { type: 'write', q: 'Write Step 2 of Example 1: store the average of M1, M2, M3 and M4 in GRADE. Type <- for the arrow if you cannot type ←.', lang: 'text', checks: [{ re: /GRADE\s*←\s*\(\s*M1\s*\+\s*M2\s*\+\s*M3\s*\+\s*M4\s*\)\s*\/\s*4/, label: 'GRADE ← (M1+M2+M3+M4)/4' }], solution: 'GRADE ← (M1+M2+M3+M4)/4', why: 'Add the four marks in parentheses, then divide by 4.' }
    ],
    2: [
      { type: 'match', q: 'Match each block with its arrows (slide 11).', pairs: [['Start', 'No arrow in, one arrow out'], ['End', 'One arrow in, no arrow out'], ['Process', 'One arrow in, one arrow out'], ['Decision', 'One arrow in, two arrows out']], why: 'Only the decision has two ways out.' },
      { q: 'Which symbol would you use for the step S ← A + B?', options: ['Rectangle', 'Oval', 'Diamond'], answer: 0, why: 'It is a calculation, so it is a process.' },
      { type: 'tf', q: 'Information system flowcharts show the steps of one single program.', answer: false, why: 'They show how data moves through a whole system. Program flowcharts show one program.' }
    ],
    3: [
      { type: 'trace', q: 'Follow Example 3 for each rectangle. What is A?', lang: 'text', code: 'Step 1:  Input W, L\nStep 2:  A ← L x W\nStep 3:  Print A', cols: ['W', 'L', 'A'], rows: [['2', '9', '?18'], ['4.5', '2', '?9']], why: '9 x 2 = 18 and 2 x 4.5 = 9.' },
      { type: 'write', q: 'Write Step 3 of Example 4: print the identifying message and MAX.', lang: 'text', checks: [{ re: /Print\s*["“”]The largest value is["“”]\s*,\s*MAX/, label: 'Print “The largest value is”, MAX' }], solution: 'Print “The largest value is”, MAX', why: 'The message in quotation marks, a comma, then MAX.' },
      { q: 'Which example has a decision block?', options: ['Example 4', 'Example 2', 'Example 3'], answer: 0, why: 'Example 4 must decide which value is bigger. Examples 2 and 3 go in a straight line.' },
      { type: 'bug', q: 'This version of Example 4 is wrong. Tap the wrong line.', lang: 'text', code: 'Step 1:  Input VALUE1, VALUE2\nStep 2:  if (VALUE1 > VALUE2) then\n             MAX ← VALUE2\n         else\n             MAX ← VALUE2\n         endif\nStep 3:  Print “The largest value is”, MAX', answer: 3, why: 'When VALUE1 is bigger, MAX must get VALUE1.' }
    ]
  }
});
