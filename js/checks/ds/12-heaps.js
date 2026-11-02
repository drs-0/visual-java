/* Data Structures · Unit 12 Heaps and Priority Queues: questions under the slides and the part quizzes.
   Every question has lessons, skills, available_after and level (1 easy, 2 middle, 3 hard). The instructor's
   assignments have no questions for this unit, so all questions are written in his style (exact array state after
   adds and removes, the slide code line by line, edge cases, bugs, combined with earlier units). Every heap trace was
   run in Java with the slides' ArrayHeap (stale cells kept, loop test next < count) and with a clean copy that acts
   like LinkedHeap; both gave the same arrays. Priority queue answers come from the slides' PrioritizedObject.
   No checks on the cover, the chapter scope and the "End of Fall" slide (1, 2, 24). Heaps differ from the presets.
   Heap HA (array, level order): [4, 10, 6, 15, 12, 9, 20, 18]  →  4 → 10, 6; 10 → 15, 12; 6 → 9, 20; 15 → 18. */
addChecks({
  course: 'ds', lesson: '12-heaps',
  slides: {
    3: [
      { type: 'multi', q: 'Each array holds a complete binary tree in level order. Which of them are valid <b>minheaps</b>?',
        options: ['[2, 5, 3, 9, 6, 4]', '[2, 3, 5, 4, 1]', '[1, 1, 2, 1, 3]', '[5, 7, 6, 8]', '[3, 4, 5, 2]'], answer: [0, 2, 3],
        why: 'Check every parent against its children (index i has children 2i + 1 and 2i + 2). In [2, 3, 5, 4, 1] the 3 is above 1; in [3, 4, 5, 2] the 4 is above 2. Equal values are allowed: [1, 1, 2, 1, 3] is fine.',
        lessons: ['10-trees', '12-heaps'], skills: ['concept', 'trace'], available_after: '12-heaps', level: 2 },
      { type: 'tf', q: 'In a minheap, the left child of a node is always smaller than its right child.', answer: false,
        why: 'Slide 3 only says each element is ≤ both of its children. The two children have no order between them, unlike a BST.',
        lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 1 }
    ],
    4: [
      { q: 'Which of these is <b>not</b> an operation of a heap?',
        options: ['addElement', 'removeMin', 'findMin', 'remove an element chosen by its value'], answer: 3,
        why: 'Slide 4: a heap adds elements and finds or removes the minimum. It has no fast way to find or remove any other element.',
        lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 1 }
    ],
    5: [
      { type: 'fill', q: 'Complete the interface of slide 5 (comments left out).',
        code: 'public interface HeapADT<T> ___ BinaryTreeADT<T>\n{\n  public void addElement(T obj);\n  public T ___();\n  public T findMin();\n}',
        answer: ['extends', 'removeMin'],
        why: 'An interface extends another interface. removeMin removes and returns the element with the lowest value; findMin only returns it.',
        lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 1 }
    ],
    6: [
      { q: 'A class implements HeapADT (slide 6). Which methods must it write?',
        options: ['Only addElement, removeMin and findMin', 'The three heap methods and all the methods of BinaryTreeADT', 'Only the BinaryTreeADT methods', 'None: an interface writes them'], answer: 1,
        why: 'HeapADT extends BinaryTreeADT, so it contains the methods of both. In practice ArrayHeap gets the tree methods from ArrayBinaryTree and writes only the heap ones.',
        lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 2 }
    ],
    7: [
      { q: 'How many different valid minheaps can hold the three values 1, 2 and 3?',
        options: ['1', '2', '3', '6'], answer: 1,
        why: 'The shape is fixed (a root with two children) and the root must be 1. 2 and 3 can be the left and right child in either order: 2 heaps.',
        lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 2 },
      { type: 'tf', q: 'In every minheap of the seven values 1 to 7, the value 7 is a leaf.', answer: true,
        why: 'A node with a child must be ≤ that child. 7 is larger than all the other values, so it can never have a child.',
        lessons: ['12-heaps'], skills: ['concept', 'edge_case'], available_after: '12-heaps', level: 2 }
    ],
    8: [
      { q: 'A heap has 1000 elements. About how many swaps does one addElement need at most?',
        options: ['About 10', 'About 500', '1000', '1'], answer: 0,
        why: 'The new element moves up at most one level per swap, and a complete tree of 1000 nodes has about log₂ 1000 ≈ 10 levels: O(log n).',
        lessons: ['02-analysis-of-algorithms', '12-heaps'], skills: ['complexity'], available_after: '12-heaps', level: 2 }
    ],
    9: [
      { q: 'Heap HA (level order) is [4, 10, 6, 15, 12, 9, 20, 18]. Where is a new element placed <b>before</b> it moves up?',
        options: ['Left child of 9', 'Right child of 15', 'Right child of 20', 'It replaces the root'], answer: 1,
        why: 'The next free place is index 8, the first empty spot of the bottom level from the left. Its parent is index (8 − 1) / 2 = 3, which holds 15; index 7 (18) is already its left child.',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 2 }
    ],
    10: [
      { q: '5 is added to heap HA [4, 10, 6, 15, 12, 9, 20, 18]. Which elements does it swap with, and where does it end?',
        options: ['With 15 and 10; it ends as the left child of 4', 'With 15 only', 'With 15, 10 and 4; it becomes the root', 'With 18 and 15'], answer: 0,
        why: '5 starts under 15: 5 &lt; 15 swap; 5 &lt; 10 swap; 5 ≥ 4 stop. The array is [4, 5, 6, 10, 12, 9, 20, 18, 15].',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 2 }
    ],
    11: [
      { q: 'Instead of the slide\'s numbers, 3 is added to heap HA [4, 10, 6, 15, 12, 9, 20, 18]. How many swaps happen?',
        options: ['1', '2', '3', '4'], answer: 2,
        why: '3 starts under 15 and is smaller than 15, 10 and 4, so it swaps 3 times and becomes the root: one swap per level.',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 2 }
    ],
    12: [
      { type: 'trace', q: '13, then 7, then 5 are added to heap HA [4, 10, 6, 15, 12, 9, 20, 18], one at a time. Fill in the index where each new element ends and the number of swaps it made.',
        cols: ['added', 'ends at index', 'swaps'],
        rows: [['13', '?3', '?1'], ['7', '?1', '?2'], ['5', '?1', '?2']],
        why: '13 starts at index 8 under 15: one swap, then 13 ≥ 10. 7 starts at index 9 under 12: swaps with 12 and 10, stops under 4. 5 starts at index 10 under 10 (moved there by the 7): swaps with 10 and 7. Final array: [4, 5, 6, 13, 7, 9, 20, 18, 15, 12, 10].',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 3 }
    ],
    13: [
      { type: 'tf', q: 'removeMin puts the last leaf of the tree in the root\'s place before moving it down.', answer: true,
        why: 'Slide 13: taking the last leaf keeps the tree complete. Then it moves down until the order is right again.',
        lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 1 },
      { q: 'When the moving element is bigger than both children, why is it swapped with the <b>smaller</b> child?',
        options: ['It is faster', 'The child that moves up becomes the parent of the other child, so it must be the smaller one', 'To keep the tree complete', 'Because the left child is always smaller'], answer: 1,
        why: 'If the bigger child moved up, it would sit above the smaller child and break the heap rule.',
        lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 2 }
    ],
    14: [
      { q: 'Which element is the "last leaf" of heap HA [4, 10, 6, 15, 12, 9, 20, 18]?',
        options: ['20', '18', '9', '12'], answer: 1,
        why: 'The last leaf is the last element in level order: index 7, the value 18, the left child of 15. It is not the largest, it is the last one.',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 1 }
    ],
    15: [
      { q: 'removeMin runs on heap HA [4, 10, 6, 15, 12, 9, 20, 18]. What is the array afterwards?',
        options: ['[6, 10, 9, 15, 12, 18, 20]', '[6, 10, 18, 15, 12, 9, 20]', '[10, 15, 6, 18, 12, 9, 20]', '[6, 9, 10, 15, 12, 18, 20]'], answer: 0,
        why: '18 moves to the root. Children 10 and 6: 6 is smaller and &lt; 18, swap. Children of 18 now are 9 and 20: 9 &lt; 18, swap. 18 is a leaf.',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 2 }
    ],
    16: [
      { type: 'trace', q: 'removeMin is called three times on heap HA [4, 10, 6, 15, 12, 9, 20, 18]. Fill in the value each call returns and the root after it.',
        cols: ['call', 'returns', 'root after'],
        rows: [['1', '?4', '?6'], ['2', '?6', '?9'], ['3', '?9', '?10']],
        why: 'After call 1: [6, 10, 9, 15, 12, 18, 20]. Call 2 moves 20 to the root, which sinks below 9 and then 18: [9, 10, 18, 15, 12, 20]. Call 3 moves 20 down past 10 and 12: [10, 12, 18, 15, 20].',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 3 }
    ],
    17: [
      { q: 'After those three removals, heap HA is [10, 12, 18, 15, 20]. Which value was moved to the root during the <b>third</b> removal?',
        options: ['20', '15', '12', '18'], answer: 0,
        why: 'Before the third call the heap was [9, 10, 18, 15, 12, 20]: its last leaf was 20. 20 went to the root and sank down past 10 and 12.',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 3 }
    ],
    18: [
      { q: 'What is the difference between a FIFO queue and a priority queue?',
        options: ['A priority queue cannot hold equal elements', 'A FIFO queue serves in arrival order; a priority queue serves by priority, whatever the arrival order', 'A priority queue is a stack', 'There is none'], answer: 1,
        why: 'Slide 18. A heap is the classic way to build a priority queue: removeMin gives the highest priority (smallest value).',
        lessons: ['05-queues', '12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 1 }
    ],
    19: [
      { q: 'A program creates two PrioritizedObjects for queue q1, then one for queue q2. No other objects were created before. What is the arrivalOrder of q2\'s object?',
        options: ['0', '1', '2', '3'], answer: 2,
        why: '<code>nextOrder</code> is <b>static</b>: one counter shared by all PrioritizedObjects, whatever queue they are in. The first two got 0 and 1, so the third gets 2.',
        lessons: ['12-heaps'], skills: ['concept', 'trace'], available_after: '12-heaps', level: 2 }
    ],
    20: [
      { q: 'Which getter of slide 20 returns the number given automatically by the constructor (not by the user)?',
        options: ['getElement()', 'getPriority()', 'getArrivalOrder()', 'toString()'], answer: 2,
        why: 'The user gives the element and the priority. arrivalOrder is copied from the static counter nextOrder.',
        lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 1 }
    ],
    21: [
      { q: 'Three objects are made in this order: a = ("A", 2), b = ("B", 2), c = ("C", 1). What do `a.compareTo(b)`, `b.compareTo(a)` and `a.compareTo(c)` return?',
        options: ['−1, 1, 1', '0, 0, 1', '−1, 1, −1', '1, −1, 1'], answer: 0,
        why: 'a and b have the same priority, and a arrived first: a.compareTo(b) is −1, b.compareTo(a) is 1. c has a smaller priority number, so a comes after c: 1.',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 2 },
      { type: 'tf', q: 'The compareTo of slide 21 never returns 0, not even for `a.compareTo(a)`.', answer: true,
        why: 'Every branch sets −1 or 1. For the same object the priorities and arrival orders are equal, so the last <code>else</code> returns −1.',
        lessons: ['12-heaps'], skills: ['edge_case'], available_after: '12-heaps', level: 3 }
    ],
    22: [
      { q: 'Why does PriorityQueue&lt;T&gt; extend `ArrayHeap<PrioritizedObject<T>>` and not `ArrayHeap<T>`?',
        options: ['The heap must order by priority and arrival, not by the element itself, so it stores wrapped objects', 'Because T cannot be stored in an array', 'To save memory', 'Because ArrayHeap needs strings'], answer: 0,
        why: 'The heap compares its elements with compareTo. A PrioritizedObject compares priority, then arrival order, so the heap puts the most urgent object at the root. The element T itself may not even be Comparable.',
        lessons: ['12-heaps'], skills: ['design'], available_after: '12-heaps', level: 2 }
    ],
    23: [
      { type: 'trace', q: 'A new PriorityQueue&lt;String&gt; q runs: addElement("P", 3), addElement("Q", 1), addElement("R", 3), addElement("S", 2), removeNext(), addElement("T", 1), then removeNext() four times. Fill in what each removeNext returns.',
        cols: ['removeNext', 'returns'],
        rows: [['1', '?Q'], ['2', '?T'], ['3', '?S'], ['4', '?P'], ['5', '?R']],
        why: 'The smallest priority number goes first: Q (1). T (1) arrived later than Q but Q is gone, so T is next. Then S (2). P and R both have 3: P arrived first.',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 3 }
    ],
    25: [
      { q: 'Why does a linked heap need a parent pointer in each node?',
        options: ['To make the tree complete', 'addElement moves an element up toward the root, and a node needs a link to its parent for that', 'To store the priority', 'Because BinaryTreeNode has no left link'], answer: 1,
        why: 'Slide 25: adding moves up, removing moves down. Down needs left/right links; up needs a parent link.',
        lessons: ['12-heaps'], skills: ['design'], available_after: '12-heaps', level: 1 }
    ],
    26: [
      { q: 'Which fields does a HeapNode&lt;T&gt; object have?',
        options: ['element and parent', 'element, left, right and parent', 'left, right and lastNode', 'only parent'], answer: 1,
        why: 'HeapNode extends BinaryTreeNode (element, left, right) and adds <code>parent</code>. lastNode belongs to the heap, not to a node.',
        lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 1 }
    ],
    27: [
      { q: 'heapifyAdd and heapifyRemove call setElement. Why do they move <b>elements</b> between nodes instead of moving the nodes?',
        options: ['Because nodes cannot be moved in Java', 'Copying a value is simple, while moving nodes would mean changing many left, right and parent links (and maybe lastNode)', 'Because elements are smaller', 'To make the heap a BST'], answer: 1,
        why: 'The shape of the tree stays the same; only the values travel up or down. So no link has to change during the reorder.',
        lessons: ['12-heaps'], skills: ['design'], available_after: '12-heaps', level: 2 }
    ],
    28: [
      { q: 'A new LinkedHeap gets one element with addElement. What is lastNode then?',
        options: ['null', 'The root node', 'A new empty node', 'The parent of the root'], answer: 1,
        why: 'addElement sets <code>root = node</code> for an empty heap, and then <code>lastNode = node</code>: the only node is both the root and the last leaf.',
        lessons: ['12-heaps'], skills: ['edge_case'], available_after: '12-heaps', level: 2 }
    ],
    29: [
      { type: 'order', q: 'Put the steps of addElement (slide 29) for a non-empty heap in order.',
        lines: ['Create a HeapNode for the new element', 'Find the parent with getNextParentAdd()', 'Link the node as the left child, or the right child if left is taken', 'Set the node\'s parent', 'lastNode = node', 'Call heapifyAdd() to move the element up'],
        why: 'The first steps keep the shape complete; only the last one fixes the order.',
        lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 2 }
    ],
    30: [
      { q: 'A LinkedHeap has 7 nodes, a full tree with levels 0, 1 and 2. Which node does getNextParentAdd() return? (Count nodes 0, 1, 2 … in level order.)',
        options: ['Node 6, the last leaf', 'Node 3, the leftmost node of the bottom level', 'Node 2', 'The root'], answer: 1,
        why: 'lastNode is node 6, a right child: go up to node 2, also a right child: go up to the root. Reaching the root means the bottom level is full, so go down-left as far as possible: node 3. The new node becomes its left child.',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 3 }
    ],
    31: [
      { q: 'In the linked heapifyAdd, the new element moves up 2 levels. How many times is setElement called?',
        options: ['2', '3', '4', '6'], answer: 1,
        why: 'Each loop turn copies one parent down (2 calls), and after the loop <code>next.setElement(temp)</code> writes the new element once (1 call). Two real swaps would write 4 times.',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 2 }
    ],
    32: [
      { q: 'What does removeMin do on an empty LinkedHeap?',
        options: ['Returns null', 'Throws an EmptyCollectionException', 'Returns 0', 'Removes the root anyway'], answer: 1,
        why: '<code>if (isEmpty()) throw new EmptyCollectionException("LinkedHeap");</code> is the first line.',
        lessons: ['12-heaps'], skills: ['edge_case'], available_after: '12-heaps', level: 1 }
    ],
    33: [
      { q: 'Why does removeMin call getNewLastNode() <b>before</b> it cuts the old last node from its parent?',
        options: ['Because getNewLastNode walks the tree from the old lastNode through its links, which must still be there', 'Because it is faster', 'To throw the exception in time', 'Because the root changes'], answer: 0,
        why: 'getNewLastNode starts at lastNode and goes up through parent links. Once the old last node is cut off, that path would be broken.',
        lessons: ['12-heaps'], skills: ['design'], available_after: '12-heaps', level: 2 }
    ],
    34: [
      { q: 'A LinkedHeap has 8 nodes (numbered 0 to 7 in level order). Which node does getNewLastNode() return?',
        options: ['Node 6', 'Node 3', 'Node 7', 'Node 2'], answer: 0,
        why: 'lastNode is node 7, a left child: go up to 3 (a left child), to 1 (a left child), to the root. At the root, go down-right as far as possible: 2, then 6. Node 6 is the last node of the level above.',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 3 }
    ],
    35: [
      { q: 'In heapifyRemove, the root\'s two children hold equal elements, 5 and 5. Which child becomes `next`?',
        options: ['The left one', 'The right one', 'Neither: the loop stops', 'It throws an exception'], answer: 1,
        why: '<code>left.compareTo(right) &lt; 0</code> is false for equal elements, so the last <code>else</code> picks the right child.',
        lessons: ['12-heaps'], skills: ['edge_case'], available_after: '12-heaps', level: 2 }
    ],
    36: [
      { q: 'In the linked heapifyRemove, the element taken from the last leaf moves down 3 levels. How many times is setElement called in heapifyRemove?',
        options: ['3', '4', '6', '7'], answer: 1,
        why: 'Each loop turn copies one child up: 3 calls. After the loop, <code>node.setElement(temp)</code> writes temp once: 4 in total.',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 2 }
    ],
    37: [
      { q: 'In an array heap, where is the parent of index 9, and where are the children of index 5?',
        options: ['Parent 4; children 11 and 12', 'Parent 5; children 10 and 11', 'Parent 4; children 10 and 11', 'Parent 3; children 11 and 12'], answer: 0,
        why: 'Parent: (9 − 1) / 2 = 4. Children: 2·5 + 1 = 11 and 2·5 + 2 = 12.',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 1 },
      { q: 'What does the Java expression `(0 - 1) / 2` give, and why does heapifyAdd test `next != 0` first?',
        options: ['−1: the test avoids an index out of bounds', '0: the root would look like its own parent, so the loop must stop at index 0', '0.5: it is rounded', 'It throws an ArithmeticException'], answer: 1,
        why: 'Java int division cuts toward zero: −1 / 2 is 0. Without <code>next != 0</code> the root would be compared with itself; the test also states clearly that the root has no parent.',
        lessons: ['12-heaps'], skills: ['edge_case'], available_after: '12-heaps', level: 3 }
    ],
    38: [
      { q: 'Why does ArrayBinaryTree write `tree = (T[]) new Object[DEFAULT_CAPACITY];`?',
        options: ['Java cannot create an array of a generic type with new T[...]', 'Because Object arrays are faster', 'To store only Objects', 'Because T is always Object'], answer: 0,
        why: 'Generic types are not known when the program runs, so <code>new T[50]</code> does not compile. The Object array is cast to T[] (with a warning).',
        lessons: ['03-stacks', '12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 2 }
    ],
    39: [
      { type: 'tf', q: '`new ArrayBinaryTree<>("X")` makes a tree with count 1 and "X" at index 0.', answer: true,
        why: 'Slide 39: <code>count = 1; tree[0] = element;</code>. Index 0 is always the root.',
        lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 1 }
    ],
    40: [
      { q: 'Where does ArrayHeap get its array and count from?',
        options: ['It declares them itself', 'It inherits them from ArrayBinaryTree', 'From HeapADT', 'From PriorityQueue'], answer: 1,
        why: '<code>ArrayHeap&lt;T&gt; extends ArrayBinaryTree&lt;T&gt; implements HeapADT&lt;T&gt;</code>: <code>tree</code> and <code>count</code> are protected fields of ArrayBinaryTree.',
        lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 1 }
    ],
    41: [
      { type: 'bug', q: 'This addElement leaves an empty cell inside the heap. Tap the line with the mistake.',
        code: 'public void addElement(T obj)\n{\n  if (count == tree.length)\n    expandCapacity();\n  tree[count + 1] = obj;\n  count++;\n  modCount++;\n  if (count > 1)\n    heapifyAdd();\n}',
        answer: 5,
        why: 'The next free place is tree[count], not tree[count + 1]. The element goes one cell too far, tree[count] stays null inside the heap, and heapifyAdd starts at count − 1: the null cell. The slide writes <code>tree[count] = obj;</code>.',
        lessons: ['12-heaps'], skills: ['bug'], available_after: '12-heaps', level: 2 }
    ],
    42: [
      { type: 'trace', q: 'The array heap is [3, 6, 8, 9, 7, 10] and 1 is added. Fill in the values of `next` and of the parent index `(next-1)/2` at each test of the while loop, and the parent\'s element ("-" when the loop stops at the root).',
        cols: ['next', '(next-1)/2', 'tree[(next-1)/2]'],
        rows: [['6', '?2', '?8'], ['?2', '?0', '?3'], ['?0', '-', '-']],
        why: '1 is stored at index 6. 1 &lt; 8: copy 8 down to index 6, next = 2. 1 &lt; 3: copy 3 down to index 2, next = 0. next == 0 stops the loop and tree[0] = 1. Result [1, 6, 3, 9, 7, 10, 8].',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 2 }
    ],
    43: [
      { q: 'Which line of the ArrayHeap removeMin on slide 43 is a slip?',
        options: ['T minElement = tree[0];', 'tree[0] = tree[count-1];', 'count--;', 'modCount--;'], answer: 3,
        why: 'modCount counts changes to the collection (for the iterators of unit 7), so it should go up: <code>modCount++</code>.',
        lessons: ['07-iterators', '12-heaps'], skills: ['bug'], available_after: '12-heaps', level: 2 },
      { type: 'tf', q: 'After the slides\' removeMin, the cell tree[count] still holds a value.', answer: true,
        why: 'The old last element is copied to index 0, but its own cell is never set to null. After <code>count--</code> it is outside the heap but not empty: a stale value.',
        lessons: ['12-heaps'], skills: ['edge_case'], available_after: '12-heaps', level: 2 }
    ],
    44: [
      { q: 'In heapifyRemove, why is `next = count` used when both children are null?',
        options: ['So that the loop test next < count is false and the loop stops', 'To point at the last element', 'To add a new element', 'To make the array bigger'], answer: 0,
        why: 'count is never a valid heap index here, so it works as "no child to compare with": the while loop does not run.',
        lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 2 }
    ],
    45: [
      { type: 'tf', q: '`right = 2 * (node + 1)` gives the same index as 2 * node + 2.', answer: true,
        why: '2 · (node + 1) = 2 · node + 2: the right child formula of slide 37 written another way.',
        lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 1 },
      { type: 'trace', q: 'removeMin runs on the array heap [2, 5, 3, 9, 6, 4, 8]. 8 is copied to index 0. Fill in `node` and `next` at each test of the while loop, and the final array.',
        cols: ['node', 'next', 'loop goes on?'],
        rows: [['0', '?2', '?yes'], ['?2', '?5', '?yes'], ['?5', '?7', '?no']],
        why: 'At node 0 the children are 5 and 3: next = 2. 3 &lt; 8: copy 3 up, node = 2, children 4 (index 5) and 8 (index 6): next = 5. 4 &lt; 8: copy up, node = 5, no children: next = count = 7 (count is only decreased after heapifyRemove), and 7 &lt; 7 is false. tree[5] = 8. Result [3, 5, 4, 9, 6, 8].',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 3 }
    ],
    46: [
      { q: 'What is the cost of heap sort for n elements?',
        options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(n²)'], answer: 2,
        why: 'n adds and n removes, each O(log n). The same as merge sort, and better than the O(n²) of selection or insertion sort (unit 9).',
        lessons: ['09-searching-and-sorting', '12-heaps'], skills: ['complexity'], available_after: '12-heaps', level: 2 }
    ],
    47: [
      { q: 'How is the method of slide 47 called on an `Integer[] data`?',
        options: ['new HeapSort<>(data);', 'new HeapSort<Integer>().HeapSort(data);', 'HeapSort.HeapSort(data);', 'data.HeapSort();'], answer: 1,
        why: '<code>public void HeapSort(T[] data)</code> has a return type, so it is a normal (non-static) method with the class\'s name, not a constructor. You need an object first.',
        lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 2 },
      { q: 'HeapSort runs on {6, 9, 2, 7, 2, 5}. What does the heap array look like after all the adds, before the first removeMin?',
        options: ['[2, 2, 5, 9, 7, 6]', '[2, 2, 5, 6, 7, 9]', '[2, 9, 2, 7, 6, 5]', '[2, 6, 2, 9, 7, 5]'], answer: 0,
        why: 'Add 6, 9; 2 moves to the root: [2, 9, 6]; 7 swaps with 9: [2, 7, 6, 9]; the second 2 goes under 7, swaps with 7 and stops below the equal 2: [2, 2, 6, 9, 7]; 5 goes under 6 and swaps: [2, 2, 5, 9, 7, 6]. Not sorted yet: the removes do the sorting.',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 3 }
    ]
  },
  parts: {
    0: [
      { type: 'tf', q: 'In a <b>maxheap</b>, the largest element is at the root.', answer: true,
        why: 'Slide 3: a maxheap is the mirror of a minheap: every element is ≥ its children.',
        lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 1 },
      { q: 'Which two rules must every minheap follow?',
        options: ['Complete shape, and every element ≤ its children', 'Left < parent ≤ right', 'Balanced shape, and sorted levels', 'Full shape, and every element ≥ its children'], answer: 0,
        why: 'A structural rule (complete binary tree) and an ordering rule (parent ≤ children).',
        lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 1 },
      { q: 'A minheap has 10 elements. What is its height?',
        options: ['2', '3', '4', '9'], answer: 1,
        why: 'It is a complete tree: levels 0-2 hold 7 nodes and the other 3 are on level 3. Height 3, about log₂ n.',
        lessons: ['10-trees', '12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 2 },
      { q: 'A minheap holds distinct values. Where can the <b>second smallest</b> value be?',
        options: ['Anywhere', 'Only in a leaf', 'Always as a child of the root', 'Always as the left child of the root'], answer: 2,
        why: 'Its parent must be smaller, and only the minimum is smaller: so its parent is the root. It can be the left or the right child.',
        lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 3 },
      { q: 'A minheap holds the distinct values 1 to 15 in a full tree of height 3. On which levels can the value 3 be?',
        options: ['Only level 1', 'Level 1 or level 2', 'Any level', 'Only level 2'], answer: 1,
        why: 'Every ancestor of 3 must be smaller: only 1 and 2 are. So 3 has at most two ancestors: level 1 (child of 1) or level 2 (child of 2, which is a child of 1).',
        lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 3 }
    ],
    1: [
      { type: 'tf', q: 'addElement and removeMin are both O(log n).', answer: true,
        why: 'Each moves one element along one path between the root and a leaf, and a complete tree has about log₂ n levels.',
        lessons: ['12-heaps'], skills: ['complexity'], available_after: '12-heaps', level: 1 },
      { q: 'During addElement, when does the new element stop moving up?',
        options: ['When it reaches a leaf', 'At the root, or below a parent that is not bigger than it', 'After exactly one swap', 'When it is smaller than its parent'], answer: 1,
        why: 'Slide 8: it swaps with its parent only while it is smaller. An equal parent also stops it.',
        lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 1 },
      { type: 'trace', q: '9, 4, 7, 1, 8, 2 are added one by one to an empty minheap. Fill in the array (level order) after the last add.',
        cols: ['index', '0', '1', '2', '3', '4', '5'],
        rows: [['element', '?1', '?4', '?2', '?9', '?8', '?7']],
        why: '[9] → 4 swaps up: [4, 9] → [4, 9, 7] → 1 under 9, swaps with 9 and 4: [1, 4, 7, 9] → 8 under 4: [1, 4, 7, 9, 8] → 2 under 7, swaps with 7, stops under 1: [1, 4, 2, 9, 8, 7].',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 2 },
      { q: 'removeMin is called twice on the heap [2, 2, 5, 9, 7, 6]. What is the array after both calls?',
        options: ['[5, 6, 7, 9]', '[5, 7, 6, 9]', '[2, 6, 5, 9]', '[6, 7, 5, 9]'], answer: 0,
        why: 'Call 1: the last leaf 6 goes to the root. Its children are 2 and 5: swap with 2. Now its children are 9 and 7, both bigger: stop. [2, 6, 5, 9, 7]. Call 2: 7 goes to the root, children 6 and 5: swap with 5, which has no children left. [5, 6, 7, 9].',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 2 },
      { type: 'tf', q: 'Adding an element and then calling removeMin always gives back the same array as before.', answer: false,
        why: 'Example: heap HA [4, 10, 6, 15, 12, 9, 20, 18]. Add 5 → [4, 5, 6, 10, 12, 9, 20, 18, 15]. removeMin returns 4 (not 5) → [5, 10, 6, 15, 12, 9, 20, 18]. The heap holds other values in other places.',
        lessons: ['12-heaps'], skills: ['trace', 'edge_case'], available_after: '12-heaps', level: 3 },
      { q: 'A minheap and the stack of unit 3 both hold 4, 9, 2, 7 (pushed and added in this order). Three times, one element is taken out of each (pop and removeMin). What do they give?',
        options: ['Stack 7, 2, 9; heap 2, 4, 7', 'Stack 4, 9, 2; heap 2, 4, 7', 'Stack 7, 2, 9; heap 2, 7, 9', 'Both 2, 4, 7'], answer: 0,
        why: 'The stack is LIFO: the last pushed comes out first, 7, 2, 9. The heap always gives the smallest left: 2, 4, 7, whatever the order of the adds.',
        lessons: ['03-stacks', '12-heaps'], skills: ['trace', 'concept'], available_after: '12-heaps', level: 3 }
    ],
    2: [
      { type: 'tf', q: 'A priority queue built on a minheap serves the element with the smallest priority number first.', answer: true,
        why: 'removeNext calls removeMin, and compareTo of PrioritizedObject puts the smaller priority number first.',
        lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 1 },
      { q: 'All elements of a PriorityQueue get the same priority. In which order does removeNext give them?',
        options: ['Random order', 'The order in which they were added, like a FIFO queue', 'The reverse order, like a stack', 'Alphabetical order'], answer: 1,
        why: 'With equal priorities, compareTo looks at arrivalOrder: earlier arrival first. The priority queue then behaves like the queue of unit 5.',
        lessons: ['05-queues', '12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 2 },
      { q: 'What does `removeNext()` return?',
        options: ['The PrioritizedObject', 'The element inside it, unwrapped with getElement()', 'The priority number', 'The arrival order'], answer: 1,
        why: 'Slide 23: it removes the minimum PrioritizedObject from the heap, casts it, and returns <code>obj.getElement()</code>.',
        lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 2 },
      { type: 'output', q: 'No PrioritizedObject was created before this code. What does it print? (Watch the spaces in toString.)',
        code: 'PrioritizedObject<String> a = new PrioritizedObject<>("Ann", 3);\nPrioritizedObject<String> b = new PrioritizedObject<>("Bo", 3);\nSystem.out.println(b + "|" + b.compareTo(a));',
        answer: 'Bo  3  1|1',
        why: 'toString writes element, priority and arrival order with <b>two</b> spaces between them: "Bo  3  1" (b arrived second, order 1). Same priority, later arrival: compareTo gives 1.',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 3 },
      { type: 'trace', q: 'A new PriorityQueue&lt;String&gt; runs addElement("K", 4), ("L", 4), ("M", 4), ("N", 2), then removeNext() four times. Fill in the results.',
        cols: ['removeNext', 'returns'],
        rows: [['1', '?N'], ['2', '?K'], ['3', '?L'], ['4', '?M']],
        why: 'N has the smallest priority number, so it is first although it came last. K, L and M share priority 4 and come out in arrival order.',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 3 }
    ],
    3: [
      { type: 'tf', q: 'LinkedHeap keeps a reference to the last leaf in the field lastNode.', answer: true,
        why: 'Slide 28: <code>public HeapNode&lt;T&gt; lastNode;</code>. It is needed to find the next free place and the leaf that moves to the root.',
        lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 1 },
      { q: 'Why is heapifyAdd only called when size() &gt; 1?',
        options: ['A single element is already a heap: it has no parent to compare with', 'Because size() is slow', 'To avoid adding twice', 'Because lastNode is null'], answer: 0,
        why: 'With one node the new element is the root, and there is nothing to move up.',
        lessons: ['12-heaps'], skills: ['edge_case'], available_after: '12-heaps', level: 1 },
      { q: 'A LinkedHeap has 5 nodes (0 to 4 in level order). Which node does getNextParentAdd() return?',
        options: ['Node 1', 'Node 2', 'Node 3', 'Node 4'], answer: 1,
        why: 'lastNode is node 4, a right child: go up to node 1, a left child: stop. Its parent (the root) already has a right child (node 2), so go to node 2 and then down-left: node 2 has no left child. The new node becomes the left child of node 2 (index 5).',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 3 },
      { type: 'bug', q: 'This heapifyAdd leaves the new element in the wrong node. Tap the line with the mistake.',
        code: 'private void heapifyAdd()\n{\n  T temp;\n  HeapNode<T> next = lastNode;\n  temp = next.getElement();\n  while ((next != root) &&\n      (((Comparable)temp).compareTo(next.getParent().getElement()) < 0))\n  {\n    next.setElement(next.getParent().getElement());\n    next = next.parent;\n  }\n  lastNode.setElement(temp);\n}',
        answer: 12,
        why: 'After the loop, temp must be written where the moving stopped: <code>next.setElement(temp)</code>. Writing it into lastNode puts it back at the bottom, and the parent value that was copied down now appears twice.',
        lessons: ['12-heaps'], skills: ['bug'], available_after: '12-heaps', level: 3 },
      { q: 'getNewLastNode is called on a LinkedHeap with 6 nodes (0 to 5 in level order). Which node does it return?',
        options: ['Node 4', 'Node 2', 'Node 3', 'Node 5'], answer: 0,
        why: 'lastNode is node 5, a left child (of node 2): go up to 2, a right child: stop. Not the root, so go to the left sibling, node 1, then down-right as far as possible: node 4.',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 3 }
    ],
    4: [
      { type: 'tf', q: 'In the array heap, the parent of index n (n &gt; 0) is at (n − 1) / 2 with int division.', answer: true,
        why: 'Slide 37. For example, both 7 and 8 have the parent 3.',
        lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 1 },
      { q: 'An ArrayHeap has count = 9. At which index is the last leaf, and where will the next element go?',
        options: ['8 and 9', '9 and 10', '7 and 8', '0 and 9'], answer: 0,
        why: 'The elements are in tree[0] to tree[count − 1]: the last leaf is tree[8], and the next free place is tree[count] = tree[9].',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 1 },
      { type: 'fill', q: 'Complete the array heapifyAdd of slide 42.',
        code: 'private void heapifyAdd()\n{\n  T temp;\n  int next = ___;\n  temp = tree[next];\n  while ((next != 0) &&\n      (((Comparable)temp).compareTo(tree[___]) < 0))\n  {\n    tree[next] = tree[(next-1)/2];\n    next = (next-1)/2;\n  }\n  tree[next] = ___;\n}',
        answer: ['count - 1|count-1', '(next-1)/2|(next - 1) / 2', 'temp'],
        why: 'The new element is the last one, at count − 1. It is compared with its parent at (next−1)/2, and written once where the loop stopped.',
        lessons: ['12-heaps'], skills: ['design'], available_after: '12-heaps', level: 2 },
      { type: 'output', q: 'HeapSort is the class of slide 47. What does this print?',
        code: 'Integer[] data = {7, 3, 9, 3};\nnew HeapSort<Integer>().HeapSort(data);\nSystem.out.println(Arrays.toString(data));',
        answer: '[3, 3, 7, 9]',
        why: 'All four go into an ArrayHeap, then removeMin fills data[0], data[1] … smallest first. Equal values are fine: both 3s come out.',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 2 },
      { q: 'Heap sort and insertion sort (unit 9) both get an array that is <b>already sorted</b>. Which statement is true?',
        options: ['Both are O(n) here', 'Insertion sort is O(n) here; heap sort is still O(n log n), because each removeMin moves the last leaf down from the root', 'Heap sort is O(n) here, insertion sort O(n²)', 'Both are O(n²)'], answer: 1,
        why: 'For sorted input each add needs no swap, but every removeMin still puts a large leaf at the root and moves it down about log n levels. Insertion sort only makes one comparison per element on sorted input.',
        lessons: ['09-searching-and-sorting', '12-heaps'], skills: ['complexity'], available_after: '12-heaps', level: 3 },
      { type: 'trace', q: 'HeapSort runs on {5, 2, 8, 1}. Fill in the heap array after all four adds, and the value each removeMin returns.',
        cols: ['', '1st', '2nd', '3rd', '4th'],
        rows: [['heap array', '?1', '?2', '?8', '?5'], ['removeMin', '?1', '?2', '?5', '?8']],
        why: '[5] → 2 goes up: [2, 5] → [2, 5, 8] → 1 under 5, swaps with 5 and 2: [1, 2, 8, 5]. The removes give 1, 2, 5, 8 into data[0..3].',
        lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 3 }
    ]
  }
});
