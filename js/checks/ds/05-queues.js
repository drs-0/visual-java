/* Data Structures · Unit 5 Queues: questions under the slides and the part quizzes.
   Every question has lessons, skills, available_after and level (1 easy, 2 middle, 3 hard, never harder than the
   instructor's). source = the instructor's own question (Assignment 3), copied word for word with his answer.
   No checks on the cover and the outline slides (1, 2, 8, 15, 24, 30, 40). Numbers differ from the drawing presets. */
addChecks({
  course: 'ds', lesson: '05-queues',
  slides: {
    3: [
      { q: 'At which end of a queue are elements added, and at which end are they removed?',
        options: ['Both at the front', 'Added at the rear, removed at the front', 'Added at the front, removed at the rear', 'Both at the rear'], answer: 1,
        why: 'Slide 3: a queue adds at one end (the rear) and removes from the other (the front), like a waiting line: you join at the back and are served at the front. Adding and removing at the same end would be a stack.',
        lessons: ['05-queues'], skills: ['concept'], available_after: '05-queues', level: 1 }
    ],
    4: [
      { q: 'A queue starts empty. Run: `enqueue(4)`, `enqueue(8)`, `dequeue()`, `enqueue(1)`, `first()`. What does `first()` return, and how many elements are in the queue?',
        options: ['8, size 2', '4, size 2', '1, size 2', '8, size 3'], answer: 0,
        why: 'dequeue removes 4, the oldest element (FIFO). The queue is then 8, 1 with 8 at the front. first() only looks at the front, so the size stays 2. "1" is the newest element: that would be a stack\'s peek.',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 1 }
    ],
    5: [
      { type: 'tf', q: 'The Java API has a queue class, so we can write `new Queue<String>()`.', answer: false,
        why: 'Slide 5: Java has a Stack <b>class</b>, but for queues it only has a Queue <b>interface</b>, implemented by classes such as LinkedList. An interface cannot be created with new. This is what the slide means by "Java is not consistent".',
        lessons: ['05-queues'], skills: ['concept'], available_after: '05-queues', level: 1 }
    ],
    6: [
      { q: 'Which line matches the UML diagram of slide 6?',
        options: ['Queue<String> q = new LinkedList<>();', 'Queue<String> q = new Queue<>();', 'LinkedList<String> q = new Queue<>();', 'Queue<int> q = new LinkedList<>();'], answer: 0,
        why: 'LinkedList&lt;T&gt; implements Queue&lt;T&gt;, so a Queue variable can refer to a LinkedList object. Queue is an interface, so <code>new Queue&lt;&gt;()</code> fails, and a generic type must be a class (Integer, not int).',
        lessons: ['05-queues'], skills: ['concept'], available_after: '05-queues', level: 1 }
    ],
    7: [
      { type: 'match', q: 'Match each method of java.util.Queue with what it does (slide 7).',
        pairs: [['offer', 'Adds; returns false if it cannot'], ['add', 'Adds; throws an exception if it cannot'], ['poll', 'Removes the front; null if the queue is empty'], ['remove', 'Removes the front; throws if the queue is empty'], ['peek', 'Looks at the front; null if the queue is empty'], ['element', 'Looks at the front; throws if the queue is empty']],
        why: 'Each job has two versions that handle problems differently: add / remove / element throw an exception; offer / poll / peek return a special value (false or null).',
        lessons: ['05-queues'], skills: ['concept'], available_after: '05-queues', level: 2 },
      { type: 'output', q: 'What does this print?',
        code: 'Queue<Integer> q = new LinkedList<>();\nq.add(9);\nSystem.out.println(q.poll());\nSystem.out.println(q.poll());\nSystem.out.println(q.peek());',
        answer: '9\nnull\nnull',
        why: 'The first poll removes 9. The queue is now empty, so poll and peek return null instead of throwing. remove() or element() would throw an exception here.',
        lessons: ['05-queues'], skills: ['trace', 'edge_case'], available_after: '05-queues', level: 2 }
    ],
    9: [
      { q: 'With a Caesar cipher and k = 3, how is the word `dog` encoded?',
        options: ['grj', 'fqi', 'alc', 'gsj'], answer: 0,
        why: 'Each letter moves 3 places forward: d → g, o → r, g → j. "alc" moves backwards (that is decoding).',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 1 },
      { q: 'A message was encoded with a Caesar cipher and k = 3. Decode `cat`.',
        options: ['fdw', 'zxq', 'axr', 'zyq'], answer: 1,
        why: 'Decoding subtracts k. c − 3 goes back past a and wraps around: c → b → a → z. a − 3 = x, t − 3 = q. So "zxq". "fdw" adds 3 instead of subtracting.',
        lessons: ['05-queues'], skills: ['trace', 'edge_case'], available_after: '05-queues', level: 2 }
    ],
    10: [
      { q: 'The repeating key is 3 1 7 4 2 5. The message has 8 characters. By how much is the <b>8th</b> character shifted?',
        options: ['3', '1', '7', '5'], answer: 1,
        why: 'The 6 key values cover characters 1 to 6. Then the key starts again: the 7th character uses 3 and the 8th uses 1.',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 2 }
    ],
    11: [
      { q: 'Right after `for (int k : key) encodingQueue.add(k);` with key = {3, 2, -3, 4, -1, -2, 1}, what does `encodingQueue.peek()` return?',
        options: ['1', '3', '-3', '7'], answer: 1,
        why: 'add puts each value at the rear, in the order of the array, so the first value added, 3, is at the front. "1" is the last value added, at the rear.',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 1 },
      { q: 'Why does the Codes program keep the key values in a <b>queue</b>?',
        options: ['Because a queue sorts the key values', 'Because removing a value from the front and adding it back at the rear makes the key repeat in the same order', 'Because a queue is faster than an array for any job', 'Because LinkedList cannot store ints'], answer: 1,
        why: 'Each character uses the front value, and that value goes back to the rear. After all 7 values are used, 3 is at the front again: the key repeats forever, in order. A queue does not sort anything.',
        lessons: ['05-queues'], skills: ['design'], available_after: '05-queues', level: 2 }
    ],
    12: [
      { type: 'output', q: 'This is the encoding loop of slide 12 with a shorter key and message. What does it print?',
        code: 'Queue<Integer> q = new LinkedList<>();\nq.add(1);\nq.add(-1);\nString m = "ABC";\nStringBuilder e = new StringBuilder();\nfor (int i = 0; i < m.length(); i++) {\n  int keyValue = q.remove();\n  e.append((char) (m.charAt(i) + keyValue));\n  q.add(keyValue);\n}\nSystem.out.println(e);',
        answer: 'BAD',
        why: 'A + 1 = B. Then the key -1: B − 1 = A. The key repeats: C + 1 = D. Each key value goes back to the rear after it is used.',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 2 }
    ],
    13: [
      { q: 'Why does the program build a <b>new</b> decodingQueue instead of using encodingQueue again for decoding?',
        options: ['Because encodingQueue is empty after encoding', 'Because after encoding, encodingQueue was turned around message.length() times, so its front is usually not the first key value', 'Because a queue can be used only once in Java', 'Because decoding needs the key in reverse order'], answer: 1,
        why: 'Every character moved one value from the front to the rear. After m characters the front is the key at position m % 7. Decoding must start again with 3, the first value, so a fresh queue is built (reusing it would only work if the length were a multiple of 7). The queue is never empty: each value is added back.',
        lessons: ['05-queues'], skills: ['design', 'trace'], available_after: '05-queues', level: 3 }
    ],
    14: [
      { type: 'tf', q: 'The Codes program creates an object of the type Queue&lt;Integer&gt;.', answer: false,
        why: 'Queue&lt;Integer&gt; is an interface: the variables have that type, but the objects are LinkedList&lt;Integer&gt;, the class that implements it. The UML shows two bindings of T to Integer, one for each.',
        lessons: ['05-queues'], skills: ['concept'], available_after: '05-queues', level: 2 }
    ],
    16: [
      { type: 'multi', q: 'Which statements about our own Queue&lt;T&gt; interface (slide 16) are true?',
        options: ['It has the standard queue operations', 'It can have a linked implementation and an array implementation', 'toString is a standard queue operation', 'It is the same as java.util.Queue'], answer: [0, 1],
        why: 'Slide 16: standard operations, several implementations. It also includes toString, but the slide says that is <b>not</b> a standard queue operation. It is our own interface (enqueue, dequeue, first), not java.util.Queue (add, offer, poll…).',
        lessons: ['05-queues'], skills: ['concept'], available_after: '05-queues', level: 1 }
    ],
    17: [
      { q: 'In our Queue&lt;T&gt; interface, which method returns the front element <b>without</b> removing it?',
        options: ['peek()', 'first()', 'front()', 'dequeue()'], answer: 1,
        why: 'Our interface calls it first(). peek is the name in java.util.Queue (and in our stack). dequeue removes the element.',
        lessons: ['05-queues'], skills: ['concept'], available_after: '05-queues', level: 1 }
    ],
    18: [
      { q: 'Why does LinkedQueue need two references, front and rear, when LinkedStack needed only top?',
        options: ['Because a queue stores twice as many elements', 'Because a queue works at both ends: rear lets enqueue reach the last node at once', 'Because Java requires two references in every list', 'Because rear is needed to count the nodes'], answer: 1,
        why: 'A stack does everything at one end. A queue removes at the front and adds at the rear, so it keeps a reference to each end; without rear, every enqueue would walk the whole list. The number of nodes is kept in count.',
        lessons: ['05-queues'], skills: ['design'], available_after: '05-queues', level: 2 }
    ],
    19: [
      { q: 'What does the line `front = rear = null;` in the LinkedQueue constructor do?',
        options: ['Sets rear to null and front to the value of rear, so both are null', 'Compares front and rear', 'Sets only front to null', 'Makes front and rear point to the same new node'], answer: 0,
        why: 'Assignment works from right to left: rear = null first, then front gets that value. So the queue starts with no nodes at either end. A comparison would use ==.',
        lessons: ['05-queues'], skills: ['concept'], available_after: '05-queues', level: 1 }
    ],
    20: [
      { q: 'A LinkedQueue holds exactly one element. How many Node objects exist, and what do front and rear point to?',
        options: ['One node; front and rear both point to it', 'Two nodes, one for each end', 'One node; front points to it and rear is null', 'No node; the element is in front'], answer: 0,
        why: 'Each element has one node. With one element, that node is both the first and the last node, so front and rear point to the same node, and its next is null.',
        lessons: ['05-queues'], skills: ['concept', 'edge_case'], available_after: '05-queues', level: 1 }
    ],
    21: [
      { q: 'Why does enqueue test `count == 0` before writing `rear.next = node`?',
        options: ['To save time', 'Because in an empty queue rear is null, so rear.next would throw a NullPointerException; the new node becomes front instead', 'Because an empty queue cannot be enqueued', 'Because count must be 0 before every enqueue'], answer: 1,
        why: 'There is no last node in an empty queue, so the new node becomes the front node. In a non-empty queue it is linked after the rear node. In both cases rear then points to the new node.',
        lessons: ['05-queues'], skills: ['edge_case'], available_after: '05-queues', level: 2 },
      { type: 'trace', q: 'Start with an empty LinkedQueue. Fill in the element of the front node, of the rear node, and count after each enqueue.',
        cols: ['operation', 'front', 'rear', 'count'], rows: [['enqueue(K)', '?K', '?K', '?1'], ['enqueue(L)', '?K', '?L', '?2'], ['enqueue(M)', '?K', '?M', '?3']],
        why: 'The first enqueue sets both front and rear to the new node. After that only rear moves: front stays on the oldest element, K.',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 2 }
    ],
    22: [
      { q: 'The queue is front → A → B (rear). After `dequeue()`, what is returned, and where do front and rear point?',
        options: ['Returns A; front and rear both point to the B node', 'Returns B; front points to A, rear is null', 'Returns A; front points to B, rear is null', 'Returns A; front is null, rear points to B'], answer: 0,
        why: 'dequeue removes the front node, A. front moves to B. count becomes 1, not 0, so rear is not changed: it still points to B. Now one node is both front and rear.',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 2 }
    ],
    23: [
      { type: 'output', q: 'With the slides\' LinkedQueue, what does this print?',
        code: 'LinkedQueue<String> q = new LinkedQueue<>();\nSystem.out.println(q.first());\nq.enqueue("P");\nq.enqueue("Q");\nSystem.out.println(q.first() + q.size());',
        answer: 'null\nP2',
        why: 'first() returns null on an empty queue (it does not throw). After the two enqueues, P is at the front and there are 2 elements: "P" + 2 is P2.',
        lessons: ['05-queues'], skills: ['trace', 'edge_case'], available_after: '05-queues', level: 2 }
    ],
    25: [
      { q: 'In the ticket counter simulation, what changes from one run of the simulation to the next?',
        options: ['The arrival time between customers', 'The number of customers', 'The number of cashiers', 'The processing time per customer'], answer: 2,
        why: 'Slide 25: the simulation is repeated with more and more cashiers (1 to 10) to see how the average time goes down. The other values can be changed in the code, but stay the same during the runs.',
        lessons: ['05-queues'], skills: ['concept'], available_after: '05-queues', level: 1 }
    ],
    26: [
      { type: 'output', q: 'With the Customer class of slide 26, what does this print?',
        code: 'Customer c = new Customer(30);\nc.departureTime = 200;\nSystem.out.println(c.totalTime());',
        answer: '170',
        why: 'totalTime() = departureTime − arrivalTime = 200 − 30 = 170 seconds: waiting time plus service time.',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 1 }
    ],
    27: [
      { q: 'cashierTime is created with MAX_CASHIERS = 10 cells. What happens when the simulation runs with only 3 cashiers?',
        options: ['It throws an exception', 'Only cells 0, 1 and 2 are set to 0 and used; the other cells are ignored', 'The array is created again with 3 cells', 'All 10 cells are used, so 10 cashiers work'], answer: 1,
        why: 'The array is made once, big enough for the largest run. Each run resets only the first <code>cashiers</code> cells (<code>for (int c = 0; c &lt; cashiers; c++)</code>), and c goes round with <code>% cashiers</code>, so it never reaches the other cells.',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 2 }
    ],
    28: [
      { type: 'trace', q: 'Run the loop of slide 28 with 2 cashiers, 4 customers, ARRIVAL = 20 and PROCESS = 100. Fill in the serve time and the departure time.',
        cols: ['customer', 'arrival', 'cashier c', 'serveTime', 'departure'], rows: [['0', '0', '0', '?0', '?100'], ['1', '20', '1', '?20', '?120'], ['2', '40', '0', '?100', '?200'], ['3', '60', '1', '?120', '?220']],
        why: 'serveTime = max(arrival, the time the cashier becomes free). Customers 0 and 1 find a free cashier. Customer 2 arrives at 40, but cashier 0 is busy until 100, so it waits; customer 3 waits for cashier 1 until 120. Departure = serveTime + 100.',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 2 }
    ],
    29: [
      { q: 'With one cashier, customer i (counting from 0) arrives at 15·i and leaves at (i + 1) × 120. How long does the last customer (i = 99) spend in total?',
        options: ['120 seconds', '1,485 seconds', '10,515 seconds', '12,000 seconds'], answer: 2,
        why: 'Customer 99 arrives at 15 × 99 = 1,485 s and leaves at 100 × 120 = 12,000 s: 12,000 − 1,485 = 10,515 s, almost 3 hours. Customers arrive every 15 s but one cashier needs 120 s each, so the line keeps growing. That is why the average with one cashier is so big (5317 s).',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 3 }
    ],
    31: [
      { q: 'If an array queue keeps its front fixed at index 0, what does dequeue cost, and why?',
        options: ['O(1), because only count changes', 'O(n), because all the remaining elements must shift one cell to the left', 'O(log n), because half of the elements move', 'O(n²), because every element moves n times'], answer: 1,
        why: 'Removing the front element leaves cell 0 empty, and the next element must be at index 0, so all n − 1 others shift (slide 31). A stack does not have this problem because it works at only one end.',
        lessons: ['05-queues'], skills: ['complexity'], available_after: '05-queues', level: 1 }
    ],
    32: [
      { q: 'An array of 100 cells is used as a circular array. What is `(rear + 1) % 100` when rear = 99?',
        options: ['100', '0', '99', '1'], answer: 1,
        why: '100 % 100 = 0: after the last index (99) comes the first index (0). Index 100 does not exist in an array of 100 cells.',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 1 }
    ],
    33: [
      { type: 'tf', q: 'In a circular queue, the remaining elements move one cell toward the front after each dequeue.', answer: false,
        why: 'Slide 33: once an element is added, it stays in the same cell until it is removed. Only the indexes front and rear move (and wrap around), so nothing is shifted.',
        lessons: ['05-queues'], skills: ['concept'], available_after: '05-queues', level: 1 }
    ],
    34: [
      { q: 'In ArrayQueue, front and rear can be equal both when the queue is empty and when it is full. Which field tells the two cases apart?',
        options: ['array.length', 'count', 'DEFAULT_CAPACITY', 'front'], answer: 1,
        why: 'count holds the number of elements: 0 means empty, array.length means full. front and rear alone cannot tell, because after a wrap-around rear comes back to front.',
        lessons: ['05-queues'], skills: ['edge_case'], available_after: '05-queues', level: 2 }
    ],
    35: [
      { q: 'After `new ArrayQueue<String>(8)`, what are front, rear, count and array.length?',
        options: ['0, 0, 0, 8', '0, 7, 0, 8', '0, 0, 0, 100', '-1, -1, 0, 8'], answer: 0,
        why: 'This constructor sets front = rear = count = 0 and creates 8 cells. 100 is the default capacity, used only by the constructor without arguments.',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 1 }
    ],
    36: [
      { type: 'trace', q: 'An ArrayQueue has capacity 5 (front = rear = count = 0). Fill in front, rear and count after each operation.',
        cols: ['operation', 'front', 'rear', 'count'], rows: [['enqueue A, B, C, D', '0', '4', '4'], ['dequeue()', '?1', '?4', '?3'], ['dequeue()', '?2', '?4', '?2'], ['enqueue(E)', '?2', '?0', '?3'], ['enqueue(F)', '?2', '?1', '?4']],
        why: 'dequeue moves front forward. E goes into cell 4, and rear = (4 + 1) % 5 = 0 wraps around; F goes into cell 0 and rear becomes 1. count is never 5, so no expansion.',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 2 }
    ],
    37: [
      { q: 'array.length is 8 and rear is 6. After 5 more enqueues (no expansion), what is rear?',
        options: ['11', '3', '5', '7'], answer: 1,
        why: 'Each enqueue does rear = (rear + 1) % 8: 7, 0, 1, 2, 3. In one step: (6 + 5) % 8 = 3. "11" forgets the wrap-around.',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 2 }
    ],
    38: [
      { q: 'ArrayStack grew with `Arrays.copyOf`. Why does ArrayQueue\'s expandCapacity copy the elements one by one, starting at front?',
        options: ['Because Arrays.copyOf does not work with generic arrays', 'Because the queue may wrap around: copying cell 0 first would put the elements out of FIFO order', 'Because it is faster', 'Because the new array must be smaller'], answer: 1,
        why: 'In a full circular queue the oldest element may be in the middle of the array (at front) and the newest at a lower index. The loop copies from front, wrapping with %, so in the new array the order is right: oldest at 0, then front = 0 and rear = count.',
        lessons: ['05-queues'], skills: ['design'], available_after: '05-queues', level: 2 }
    ],
    39: [
      { type: 'bug', q: 'This dequeue breaks after the front reaches the end of the array. Tap the line with the mistake.',
        code: 'public T dequeue() {\n  if (count == 0) throw new RuntimeException("Queue is empty\\n");\n  T result = array[front];\n  array[front] = null;\n  front = front + 1;\n  count--;\n  return result;\n}',
        answer: 5,
        why: 'front must wrap around: <code>front = (front + 1) % array.length;</code>. Without %, front goes past the last index, and the next dequeue reads outside the array.',
        lessons: ['05-queues'], skills: ['bug'], available_after: '05-queues', level: 2 },
      { type: 'tf', q: 'In the slide\'s dequeue, the lines after `throw` are indented, so they run only when count == 0.', answer: false,
        why: 'Indentation means nothing to Java. Without braces, the if controls only the next statement, the throw. The other lines run whenever the queue is not empty.',
        lessons: ['05-queues'], skills: ['bug', 'concept'], available_after: '05-queues', level: 2 }
    ],
    41: [
      { type: 'multi', q: 'What can a double-ended queue (deque) do (slide 41)?',
        options: ['Add elements at both ends', 'Remove elements at both ends', 'Work as a queue', 'Work as a stack', 'Reach any element in the middle by its index'], answer: [0, 1, 2, 3],
        why: 'A deque allows adding, removing and viewing at both ends, so it can be used as a queue or as a stack (and can replace java.util.Stack). It still has no access to the middle.',
        lessons: ['05-queues'], skills: ['concept'], available_after: '05-queues', level: 1 }
    ],
    42: [
      { q: 'A deque holds 4, 7, 1 (first → last). After `addFirst(9)`, `removeLast()`, `addLast(5)`, what do `first()` and `last()` return?',
        options: ['first 9, last 5', 'first 4, last 5', 'first 9, last 1', 'first 5, last 9'], answer: 0,
        why: 'addFirst(9): 9, 4, 7, 1. removeLast removes 1: 9, 4, 7. addLast(5): 9, 4, 7, 5. So first is 9 and last is 5.',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 2 }
    ],
    43: [
      { type: 'match', q: 'Match each stack or queue operation with the deque method that does the same (slide 43).',
        pairs: [['enqueue', 'addLast'], ['push', 'addFirst'], ['pop', 'removeFirst'], ['peek', 'first']],
        why: 'As a queue: add at the back, remove at the front. As a stack: everything happens at the front (addFirst, removeFirst, first).',
        lessons: ['05-queues'], skills: ['concept'], available_after: '05-queues', level: 1 },
      { q: 'A student uses a deque as a stack, but pushes with `addLast`. Which method must pop use so it is still a stack?',
        options: ['removeFirst', 'removeLast', 'first', 'dequeue'], answer: 1,
        why: 'A stack needs push and pop at the <b>same</b> end. If push adds at the back, pop must remove at the back. removeFirst would give FIFO: a queue.',
        lessons: ['05-queues'], skills: ['design'], available_after: '05-queues', level: 2 }
    ],
    44: [
      { q: 'A deque on a circular array has capacity 6 and is empty, with front = 0. At which index does `addFirst(X)` put X?',
        options: ['0', '1', '5', '6'], answer: 2,
        why: 'addFirst first moves front back one cell, then stores the element. From 0 it wraps to the last index, array.length − 1 = 5. Index 6 does not exist.',
        lessons: ['05-queues'], skills: ['trace', 'edge_case'], available_after: '05-queues', level: 2 }
    ],
    45: [
      { type: 'trace', q: 'A deque has capacity 5 and starts empty (front = rear = 0). Fill in the index where each element is stored, and front and rear after each call.',
        code: 'public void addFirst(T element) {\n  if (count == array.length) expandCapacity();\n  front = (front == 0)? array.length-1 : front-1;\n  array[front] = element;\n  count++;\n}\npublic void addLast(T element) {\n  if (count == array.length) expandCapacity();\n  array[rear] = element;\n  rear = (rear + 1) % array.length;\n  count++;\n}',
        cols: ['call', 'stored at index', 'front', 'rear'], rows: [['addLast(A)', '?0', '?0', '?1'], ['addFirst(B)', '?4', '?4', '?1'], ['addFirst(C)', '?3', '?3', '?1'], ['addLast(D)', '?1', '?3', '?2']],
        why: 'addLast stores at rear, then moves rear forward. addFirst moves front back first (0 wraps to 4), then stores there. The deque is now C, B, A, D (first → last), in cells 3, 4, 0, 1.',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 2 }
    ],
    46: [
      { type: 'bug', q: 'This removeLast returns null instead of the last element. Tap the line that is in the wrong place.',
        code: 'public T removeLast() {\n  if (count == 0) throw new RuntimeException("Deque is empty");\n  T result = array[rear];\n  rear = (rear == 0)? array.length-1 : rear-1;\n  array[rear] = null;\n  count--;\n  return result;\n}',
        answer: 3,
        why: 'rear is the index <b>after</b> the last element, so array[rear] is an empty cell. The slide first moves rear back, then reads <code>array[rear]</code>. Here the read comes too early, and then the real last element is erased by line 5.',
        lessons: ['05-queues'], skills: ['bug'], available_after: '05-queues', level: 3 }
    ]
  },
  parts: {
    0: [
      { type: 'tf', q: 'In a queue, the element that has waited the longest is the next one removed.', answer: true,
        why: 'FIFO: first in, first out. The oldest element is at the front, and dequeue removes the front.',
        lessons: ['05-queues'], skills: ['concept'], available_after: '05-queues', level: 1 },
      { q: 'Which situation is best modeled by a queue?',
        options: ['Undo in a text editor (the last change is undone first)', 'Print jobs sent to one printer, printed in the order they were sent', 'Plates put on top of each other', 'Checking the browser\'s back button history'], answer: 1,
        why: 'Print jobs are served in arrival order: FIFO. Undo, plates and the back button all take the <b>newest</b> item first: they are stacks (LIFO).',
        lessons: ['05-queues'], skills: ['concept'], available_after: '05-queues', level: 1 },
      { type: 'output', q: 'What does this print?',
        code: 'Queue<String> q = new LinkedList<>();\nq.offer("a");\nq.offer("b");\nq.remove();\nq.add("c");\nSystem.out.println(q.peek() + q.size());',
        answer: 'b2',
        why: 'offer and add both add at the rear: a, b. remove takes away the front, a. Then c is added: b, c. peek looks at b, and there are 2 elements.',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 2 },
      { q: 'An empty queue is a normal situation in your program, and you do not want exceptions. Which java.util.Queue method should take out the front element?',
        options: ['remove()', 'poll()', 'element()', 'add()'], answer: 1,
        why: 'poll() returns null when the queue is empty; remove() throws an exception. element() only looks at the front, and add() adds.',
        lessons: ['05-queues'], skills: ['design'], available_after: '05-queues', level: 2 },
      { q: 'Queue Q holds 1, 2, 3, 4, 5, 6 (front → rear). Dequeue 3 values, pushing each on an empty stack S. Then pop S until it is empty, enqueueing each value into Q. Then run `Q.enqueue(Q.dequeue())` three times. What is Q now (front → rear)?',
        options: ['3, 2, 1, 4, 5, 6', '4, 5, 6, 3, 2, 1', '1, 2, 3, 4, 5, 6', '6, 5, 4, 1, 2, 3'], answer: 0,
        why: 'S gets 1, 2, 3 (3 on top) and Q is left with 4, 5, 6. Popping gives 3, 2, 1 at the rear: Q = 4, 5, 6, 3, 2, 1. Each enqueue(dequeue()) moves the front to the rear; three times moves 4, 5, 6 behind: 3, 2, 1, 4, 5, 6. So the first half was reversed.',
        lessons: ['03-stacks', '05-queues'], skills: ['trace'], available_after: '05-queues', level: 3 },
      { source: { assignment: 3, question: 10 },
        q: 'A queue is implemented using two stacks named "IN" and "OUT". That is, queue order (FIFO) will be obtained with the help of two stacks (which are LIFO). Enqueue: push data onto stack IN. Dequeue: transfers all the elements from IN to OUT but only when OUT is empty, otherwise nothing is transferred. Then pop out from OUT. Now, starting empty, execute enqueue(10), enqueue(20), dequeue(), enqueue(30), enqueue(40), dequeue(), dequeue(). What do the three dequeue operations return?',
        options: ['10, 30, 40', '10, 20, 30', '20, 10, 40', '10, 40, 30'], answer: 1,
        why: 'First dequeue: OUT is empty, so IN (10, 20) moves over and becomes 20, 10 with 10 on top: pop 10. Then 30 and 40 go on IN. Second dequeue: OUT still has 20, so nothing moves: pop 20. Third: OUT is empty, IN (30, 40) moves and 30 is on top: pop 30. The answers are in FIFO order. "10, 30, 40" moves IN even when OUT is not empty.',
        lessons: ['03-stacks', '05-queues'], skills: ['trace', 'design'], available_after: '05-queues', level: 3 }
    ],
    1: [
      { type: 'tf', q: 'The Caesar cipher is easy to break, because there are only 26 possible shifts to try.', answer: true,
        why: 'Slide 9: someone can simply try all 26 shifts. A repeating key (slide 10) is harder, because each character can use a different shift.',
        lessons: ['05-queues'], skills: ['concept'], available_after: '05-queues', level: 1 },
      { q: 'Caesar cipher with k = 2: how is `zoo` encoded?',
        options: ['bqq', 'xmm', 'aqq', '{qq'], answer: 0,
        why: 'z + 2 wraps around the alphabet: z → a → b. o + 2 = q. So "bqq". "xmm" subtracts; "{qq" forgets that the letters wrap after z.',
        lessons: ['05-queues'], skills: ['trace', 'edge_case'], available_after: '05-queues', level: 1 },
      { q: 'A repeating key 2 5 is used to encode `aaaa`. What is the result?',
        options: ['cccc', 'cfcf', 'ffff', 'cfff'], answer: 1,
        why: 'The shifts are 2, 5, 2, 5 (the key repeats): a + 2 = c, a + 5 = f. The same letter gives different code letters, which is why a repeating key is harder to break.',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 2 },
      { q: 'A queue holds the key values 3, 2, -3 (front → rear). The loop of slide 12 encodes 4 characters (remove, use, add back). What is at the front of the queue now?',
        options: ['3', '2', '-3', 'The queue is empty'], answer: 1,
        why: 'Each character moves one value from the front to the rear: after 3 characters the queue is 3, 2, -3 again, and the 4th character moves 3 to the rear: 2, -3, 3. So 2 is at the front: key position 4 % 3 = 1.',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 2 },
      { q: 'A student keeps the key values in a <b>stack</b> instead: for each character, pop a value, use it, and push it back. What happens?',
        options: ['The same as with the queue', 'The same key value (the one on top) is used for every character, like a Caesar cipher', 'The key is used in reverse order', 'The program throws an exception'], answer: 1,
        why: 'Pushing the value back puts it on top again, so the next pop returns the same value. The key never moves on: every character gets the same shift. The queue works because the used value goes to the <b>other</b> end.',
        lessons: ['03-stacks', '05-queues'], skills: ['design', 'trace'], available_after: '05-queues', level: 3 }
    ],
    2: [
      { q: 'A LinkedQueue holds exactly one element. Which statement is true?',
        options: ['front == rear, both pointing to the same node', 'front is null and rear points to the node', 'front points to the node and rear is null', 'front and rear point to two different nodes'], answer: 0,
        why: 'One element means one node, which is both the first and the last one. Only an empty queue has front and rear null.',
        lessons: ['05-queues'], skills: ['concept', 'edge_case'], available_after: '05-queues', level: 1 },
      { source: { assignment: 3, question: 12 },
        q: 'A student implements a queue using a singly linked list with head and tail pointers. Enqueue inserts at the head, and dequeue removes from the head. What behavior does this implementation actually provide?',
        options: ['FIFO queue behavior', 'Priority queue behavior', 'Circular queue behavior', 'LIFO stack behavior'], answer: 3,
        why: 'Adding and removing at the <b>same</b> end means the newest element leaves first: that is exactly the LinkedStack of unit 4 (push and pop at the head). A queue must add at one end (the tail) and remove at the other (the head). Nothing here compares priorities or wraps around.',
        lessons: ['04-linked-stacks', '05-queues'], skills: ['bug', 'design'], available_after: '05-queues', level: 2 },
      { source: { assignment: 3, question: 15 },
        q: 'A FIFO queue uses a singly linked list with only a head pointer. It enqueues at the tail and dequeues at the head. What are the time complexities?',
        options: ['Enqueue O(1), dequeue O(1)', 'Enqueue O(1), dequeue O(n)', 'Enqueue O(n), dequeue O(n)', 'Enqueue O(n), dequeue O(1)'], answer: 3,
        why: 'Dequeue at the head changes front only: O(1). But with no tail pointer, enqueue must walk from the head to the last node before linking the new node: O(n). That is why the slides\' LinkedQueue keeps a rear reference, which makes enqueue O(1) too.',
        lessons: ['05-queues', '02-analysis-of-algorithms'], skills: ['complexity', 'design'], available_after: '05-queues', level: 2 },
      { source: { assignment: 3, question: 20 },
        q: 'A linked-list queue maintains front and rear pointers. It contains exactly one node. After dequeue removes that node, which update is required?',
        options: ['Make the removed node point to itself', 'Set front to null and leave rear unchanged', 'Set both front and rear to null', 'Set rear to null and leave front unchanged'], answer: 2,
        why: 'The queue is now empty, so neither end has a node. front becomes null as usual (front = front.next, which is null), and rear must also be set to null, or it would still point to the removed node. That is the line <code>if (count == 0) rear = null;</code> of slide 22.',
        lessons: ['05-queues'], skills: ['edge_case'], available_after: '05-queues', level: 2 },
      { type: 'bug', q: 'This enqueue crashes when the queue is empty. Tap the line that causes it.',
        code: 'public void enqueue(T element) {\n  Node<T> node = new Node<T>(element);\n  rear.next = node;\n  if (count == 0) front = node;\n  rear = node;\n  count++;\n}',
        answer: 3,
        why: 'In an empty queue rear is null, so <code>rear.next</code> throws a NullPointerException before the if is reached. The slide writes <code>if (count==0) front = node; else rear.next = node;</code>.',
        lessons: ['05-queues'], skills: ['bug', 'edge_case'], available_after: '05-queues', level: 2 },
      { q: 'A student keeps front and rear but turns the list around: enqueue adds a node <b>before</b> front, and dequeue removes the node at rear. Is it still FIFO, and what does dequeue cost?',
        options: ['Not FIFO; O(1)', 'Still FIFO; dequeue is O(n), because the node before rear must be found by walking from front', 'Still FIFO; O(1)', 'Not FIFO; O(n)'], answer: 1,
        why: 'New elements enter at one end and leave at the other, so the order is still FIFO. But after removing the rear node, rear must move to the node before it, and the links only go forward: that needs a walk from the front, O(n). The slides add at the rear and remove at the front, so both are O(1).',
        lessons: ['05-queues', '02-analysis-of-algorithms'], skills: ['design', 'complexity'], available_after: '05-queues', level: 3 }
    ],
    3: [
      { q: 'Why does the simulation keep the customers in a queue?',
        options: ['To sort them by their processing time', 'Because customers are served in the order they arrive', 'Because a queue uses less memory than an array', 'So that the last customer is served first'], answer: 1,
        why: 'All customers are queued and served according to their arrival time (slide 25): first come, first served, which is FIFO. Serving the last one first would be a stack.',
        lessons: ['05-queues'], skills: ['concept'], available_after: '05-queues', level: 1 },
      { q: 'PROCESS is 120. A customer arrives at 75, and the cashier is busy until 160. What are the customer\'s departure time and totalTime()?',
        options: ['departure 195, total 120', 'departure 280, total 205', 'departure 280, total 120', 'departure 235, total 160'], answer: 1,
        why: 'serveTime = max(75, 160) = 160: the customer waits for the cashier. departure = 160 + 120 = 280, and totalTime = 280 − 75 = 205 (85 s waiting + 120 s service). "195" ignores the busy cashier.',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 2 },
      { q: 'With 3 cashiers, `c = (c+1) % cashiers` sends the customers to the cashiers in turn. Which cashier serves customer number 10 (the first customer is number 0)?',
        options: ['0', '1', '2', '3'], answer: 1,
        why: 'The cashiers go 0, 1, 2, 0, 1, 2, … so customer k goes to cashier k % 3: 10 % 3 = 1. There is no cashier 3: the indexes are 0, 1, 2.',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 2 },
      { q: 'At the end of one run, totalTime is 16,550 and NUM_CUSTOMERS is 100. What does the program print as the average?',
        options: ['Average serve time = 165.5 seconds', 'Average serve time = 165 seconds', 'Average serve time = 166 seconds', 'Average serve time = 16550 seconds'], answer: 1,
        why: '<code>int aveTime = totalTime / NUM_CUSTOMERS;</code> divides two ints, so the .5 is dropped (not rounded): 165.',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 2 },
      { q: 'Why does the average stop at 120 seconds from 8 cashiers on (ARRIVAL = 15, PROCESS = 120)?',
        options: ['Because the queue becomes full', 'Because with 8 cashiers each cashier gets a new customer every 8 × 15 = 120 seconds, just when the last one leaves, so nobody waits', 'Because MAX_CASHIERS is 8', 'Because the program stops at 8 cashiers'], answer: 1,
        why: 'Customers go to the cashiers in turn, so one cashier gets every 8th customer, who arrives 120 s after the one before, exactly the service time. No one waits, and each total is the 120 s of service. More cashiers cannot lower that. MAX_CASHIERS is 10, and the simulation runs up to 10.',
        lessons: ['05-queues'], skills: ['trace', 'concept'], available_after: '05-queues', level: 3 }
    ],
    4: [
      { type: 'tf', q: 'In a circular array queue, both enqueue and dequeue are O(1) when the array does not need to grow.', answer: true,
        why: 'Each one writes or clears one cell and moves one index with % array.length. No element is shifted (slide 33).',
        lessons: ['05-queues', '02-analysis-of-algorithms'], skills: ['complexity'], available_after: '05-queues', level: 1 },
      { source: { assignment: 3, question: 7 },
        q: 'A noncircular array queue increments rear on enqueue and front on dequeue without shifting elements. rear reaches the end of the array, although earlier dequeues have freed slots at the beginning. What is the underlying problem?',
        options: ['The implementation cannot reuse the freed slots without shifting or wrapping', 'The array has automatically reduced its capacity', 'The queue has violated FIFO ordering', 'The queue must actually contain as many elements as the array length'], answer: 0,
        why: 'Both indexes only move to the right, so the freed cells at the start are never used again, and the queue looks "full" although it has space. The fix is to shift the elements (O(n), slide 31) or to wrap the indexes around: the circular array. The order is still FIFO, and the array does not shrink by itself.',
        lessons: ['05-queues'], skills: ['bug', 'design'], available_after: '05-queues', level: 2 },
      { source: { assignment: 3, question: 3 },
        q: 'A circular queue of capacity 5 uses count to {{distinguish|يميّز}} empty from full. front = rear = 2. What can be concluded from the two indices alone?',
        options: ['The queue is definitely empty', 'The queue could be empty or full; count must be checked', 'The queue contains exactly two elements', 'The queue is definitely full'], answer: 1,
        why: 'front == rear happens when the queue is empty, and also after 5 enqueues on top of that, when rear has gone all the way round back to front: full. That is why the class keeps count (0 = empty, 5 = full). The value 2 is a position, not a number of elements.',
        lessons: ['05-queues'], skills: ['edge_case'], available_after: '05-queues', level: 2 },
      { type: 'trace', q: 'An ArrayQueue of capacity 4 is full: front = 2, rear = 2, count = 4, with W at index 2, X at 3, Y at 0 and Z at 1. Then expandCapacity runs. Fill in the new array and the indexes.',
        cols: ['larger[0]', 'larger[1]', 'larger[2]', 'larger[3]', 'front', 'rear', 'array.length'], rows: [['?W', '?X', '?Y', '?Z', '?0', '?4', '?8']],
        why: 'The loop copies count = 4 elements starting at front and wrapping: W (2), X (3), Y (0), Z (1). So the oldest element, W, goes to index 0. Then front = 0, rear = count = 4 (the next free cell), and the array has 8 cells.',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 2 },
      { source: { assignment: 3, question: 8 },
        q: 'A circular queue uses an array of length 8 (indexed 0 to 7) and an integer variable count to track the number of stored elements. front points to the next item to remove; rear points to the next free slot. Initially assume that front and rear both are at index 6, that is, front = rear = 6 and count = 0. After five enqueues followed by two dequeues, what are front, rear, and the number of items (count)?',
        options: ['front = 0, rear = 2, items = 2', 'front = 0, rear = 3, items = 3', 'front = 6, rear = 3, items = 5', 'front = 1, rear = 3, items = 2'], answer: 1,
        why: 'The five enqueues use cells 6, 7, 0, 1, 2, and rear moves to 3 (wrapping after 7). The two dequeues remove cells 6 and 7, so front wraps to 0. count = 5 − 2 = 3. "front = 6, rear = 3, items = 5" forgets the dequeues; "rear = 2" stops on the last used cell instead of the next free one.',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 2 },
      { source: { assignment: 3, question: 4 },
        q: 'A circular queue uses an array of length 6 and count. front = 4, rear = 1, and count = 3. The stored values are array[4] = 10, array[5] = 20, and array[0] = 30. What happens after dequeue(), then enqueue(40)?',
        options: ['Returns 10; front = 5, rear = 2, count = 3', 'Returns 20; front = 0, rear = 2, count = 3', 'Returns 30; front = 5, rear = 2, count = 3', 'Returns 10; front = 5, rear = 1, count = 2'], answer: 0,
        why: 'dequeue returns array[front] = 10, the oldest value, and front becomes 5; count 2. enqueue(40) writes into array[rear] = array[1] and rear becomes 2; count 3 again. "30" takes the value at index 0, as if the queue started there. The last option forgets the enqueue.',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 3 }
    ],
    5: [
      { q: 'Slide 41 says a Deque can replace which class?',
        options: ['java.util.LinkedList', 'java.util.Stack', 'java.util.Scanner', 'java.util.Arrays'], answer: 1,
        why: 'A deque can work as a stack (addFirst, removeFirst, first), so it can replace the old java.util.Stack class.',
        lessons: ['05-queues'], skills: ['concept'], available_after: '05-queues', level: 1 },
      { type: 'multi', q: 'In the circular array deque of slides 44-46, which operations are O(1) when the array does not need to grow?',
        options: ['addFirst', 'addLast', 'removeFirst', 'removeLast'], answer: [0, 1, 2, 3],
        why: 'All four change one cell and move one index (with a wrap-around when needed). Nothing is shifted, so none of them depends on n.',
        lessons: ['05-queues', '02-analysis-of-algorithms'], skills: ['complexity'], available_after: '05-queues', level: 2 },
      { q: 'A deque is used as a stack (push = addFirst, pop = removeFirst). After push(1), push(2), push(3), pop(), push(4), what do `first()` and `last()` return?',
        options: ['first 4, last 1', 'first 1, last 4', 'first 3, last 1', 'first 4, last 2'], answer: 0,
        why: 'addFirst puts each new value in front: 3, 2, 1. pop removes 3: 2, 1. push(4): 4, 2, 1. first is the top of the stack (4) and last is the bottom (1).',
        lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 2 },
      { q: 'The letters of `level` are added to a deque with addLast. Then, while the deque has more than one letter, `removeFirst()` and `removeLast()` are compared. How many pairs are compared before the loop ends?',
        options: ['1', '2', '3', '5'], answer: 1,
        why: 'Pair 1: l and l. Pair 2: e and e. Now only v is left (size 1), so the loop ends. All pairs matched, so the word reads the same from both ends. Each pair removes 2 letters: 5 letters give 2 pairs.',
        lessons: ['05-queues'], skills: ['trace', 'design'], available_after: '05-queues', level: 3 }
    ]
  }
});
