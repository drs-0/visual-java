/* Data Structures · Unit 14 Multi-way Search Trees: questions under the slides and the part quizzes.
   Every question has lessons, skills, available_after and level (1 easy, 2 middle, 3 hard). The instructor's
   assignments have no questions for this unit, so all questions are written in his style (exact tree after adds and
   removes, splits that ripple, rotations, merges, B-tree orders, combined with earlier units). Every add and remove
   was run with the unit's own tree engine (the one the drawings use, checked against the slides' pictures): split
   moves the middle element up (the third of four in a 2-4 tree); a removal rotates from a sibling with a spare
   element (left one first), else merges with the parent's element, else shrinks the tree.
   No checks on the cover, the chapter scope and the "End of Fall" slide (1, 2, 16). The trees differ from the presets.
   Tree M (2-3): root [50]; children [20] and [70 85]; leaves [10], [30 40] under [20]; [60 65], [75], [90] under [70 85]. */
addChecks({
  course: 'ds', lesson: '14-multi-way-search-trees',
  slides: {
    3: [
      { q: 'What does a multi-way search tree combine?',
        options: ['Many children per node (like a general tree) and an order among the elements (like a BST)', 'A stack and a queue', 'Two binary trees', 'A heap and a BST'], answer: 0,
        why: 'Slide 3: a general tree allows many children but has no order; a BST has order but only two children. A multi-way search tree has both.',
        lessons: ['10-trees', '11-binary-search-trees', '14-multi-way-search-trees'], skills: ['concept'], available_after: '14-multi-way-search-trees', level: 1 }
    ],
    4: [
      { type: 'tf', q: 'A 3-node of a 2-3 tree holds three elements.', answer: false,
        why: 'The name counts children: a 3-node holds <b>two</b> elements and has three children (or none). A 2-node holds one element.',
        lessons: ['14-multi-way-search-trees'], skills: ['concept'], available_after: '14-multi-way-search-trees', level: 1 },
      { q: 'A node of a 2-3 tree holds one element and has exactly one child. Is that allowed?',
        options: ['Yes, it is a 1-node', 'No: a 2-node has two children or none', 'Yes, if it is the root', 'Only in a leaf'], answer: 1,
        why: 'Slide 4: a 2-node has either two children or no children. A node always has all of its children or is a leaf.',
        lessons: ['14-multi-way-search-trees'], skills: ['concept', 'edge_case'], available_after: '14-multi-way-search-trees', level: 2 }
    ],
    5: [
      { type: 'multi', q: 'In a 2-3 tree, a node [70 85] has three children. Which elements may be in its <b>middle</b> child?',
        options: ['72', '69', '84', '86', '90'], answer: [0, 2],
        why: 'The left child holds elements less than 70, the middle child elements between 70 and 85, the right child elements greater than 85.',
        lessons: ['14-multi-way-search-trees'], skills: ['concept'], available_after: '14-multi-way-search-trees', level: 2 },
      { q: 'Tree M: root [50]; children [20] and [70 85]; leaves [10], [30 40] under [20]; [60 65], [75], [90] under [70 85]. Which nodes does a search for 77 visit?',
        options: ['[50], [70 85], [75], then not found', '[50], [20], [30 40]', '[50], [70 85], [90]', 'Every node'], answer: 0,
        why: '77 &gt; 50 → right child [70 85]; 70 &lt; 77 &lt; 85 → middle child [75]; 77 is not there and [75] is a leaf: not found. One node per level.',
        lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 2 }
    ],
    6: [
      { q: '15 is added to tree M (root [50]; [20] → [10], [30 40]; [70 85] → [60 65], [75], [90]). What happens?',
        options: ['The leaf [10] becomes [10 15]; nothing else changes', '15 becomes a new leaf under [10]', '[20] becomes [15 20]', 'The leaf splits'], answer: 0,
        why: 'The search for 15 ends in the leaf [10], a 2-node with room for one more element. New elements always go into a leaf.',
        lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 1 }
    ],
    7: [
      { q: '35 is added to tree M (root [50]; [20] → [10], [30 40]; [70 85] → [60 65], [75], [90]). What does the node [20] look like afterwards, and what are its children?',
        options: ['[20 35] with children [10], [30], [40]', '[20 30] with children [10], [35 40]', '[20] with children [10], [30 35 40]', '[35] with children [20], [40]'], answer: 0,
        why: 'The leaf becomes [30 35 40]: too many. It splits: the middle element 35 moves up into [20], and [30] and [40] become two leaves. [20] had room, so it stops there.',
        lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 2 }
    ],
    8: [
      { type: 'trace', q: '62 is added to tree M (root [50]; [20] → [10], [30 40]; [70 85] → [60 65], [75], [90]). Fill in the element that moves up at each split, and the node it moves into (as it is before it gets the element).',
        cols: ['split of', 'moves up', 'into'],
        rows: [['[60 62 65]', '?62', '?[70 85]|70 85|70,85|[70,85]'], ['[62 70 85]', '?70', '?[50]|50']],
        why: 'The leaf [60 65] gets 62 and splits: 62 goes up, and [70 85] becomes [62 70 85], too full. It splits too: 70 goes up into the root, which becomes [50 70]. A ripple effect, stopped by the root\'s free place.',
        lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 3 }
    ],
    9: [
      { q: 'A 2-3 tree: root [40 70]; children [20], [55], [85 90]; leaves [10], [30], [50], [60], [80], [87], [95 98]. 96 is added. What is the new root, and how tall is the tree now?',
        options: ['[70]; height 3', '[40 70 90]; height 2', '[90]; height 3', '[70 90]; height 2'], answer: 0,
        why: '[95 96 98] splits (96 up), [85 90 96] splits (90 up), the root [40 70 90] splits: 70 goes up into a new root. The tree grows one level, at the top.',
        lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 3 }
    ],
    10: [
      { q: 'Which B-tree order is a 2-4 tree?',
        options: ['2', '3', '4', '5'], answer: 2,
        why: 'Slide 10: the order is the maximum number of children. A 2-4 tree has up to 4.',
        lessons: ['14-multi-way-search-trees'], skills: ['concept'], available_after: '14-multi-way-search-trees', level: 1 }
    ],
    11: [
      { q: 'A B-tree has order 7. At most how many elements and how many children can one node have?',
        options: ['7 elements, 8 children', '6 elements, 7 children', '7 elements, 7 children', '3 elements, 4 children'], answer: 1,
        why: 'Order m = at most m children, and a node with k elements has k + 1 children: at most m − 1 = 6 elements.',
        lessons: ['14-multi-way-search-trees'], skills: ['concept'], available_after: '14-multi-way-search-trees', level: 2 }
    ],
    12: [
      { q: 'The B-tree of order 6 on slide 12 has the root [5 12 22 35 55]. A search for 40 goes into which child of the root?',
        options: ['The 4th', 'The 5th', 'The 6th', 'The 3rd'], answer: 1,
        why: 'The children are: &lt; 5, 5-12, 12-22, 22-35, 35-55, &gt; 55. 40 is between 35 and 55: the 5th child ([40 43] on the slide).',
        lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 2 }
    ],
    13: [
      { type: 'match', q: 'Match each tree with what it guarantees.',
        pairs: [['B-tree of order m', 'at most m children per node'], ['B*-tree', 'each non-root node at least two-thirds full'], ['B+-tree', 'every element also appears in a leaf']],
        why: 'Slide 13. The B*-tree avoids half-empty nodes; the B+-tree helps reading all elements in order.',
        lessons: ['14-multi-way-search-trees'], skills: ['concept'], available_after: '14-multi-way-search-trees', level: 1 }
    ],
    14: [
      { q: 'In the B+-tree of slide 14, how do you list all the elements in sorted order?',
        options: ['Walk the leaves from left to right using their links', 'Read the root only', 'Use a post-order traversal', 'You cannot'], answer: 0,
        why: 'Every element is in a leaf, and each leaf points to the next one: a simple walk gives the whole sorted list (sequential access).',
        lessons: ['14-multi-way-search-trees'], skills: ['concept'], available_after: '14-multi-way-search-trees', level: 2 }
    ],
    15: [
      { q: 'Why are B-trees used for data on a disk, like file systems and databases?',
        options: ['Their nodes are wide, so the tree is short and a search reads only a few nodes from the slow disk', 'They use no memory', 'They never need to compare', 'They are always sorted arrays'], answer: 0,
        why: 'Reading one node from disk is slow, so the number of levels matters most. A node with many elements keeps the height very small.',
        lessons: ['14-multi-way-search-trees'], skills: ['concept'], available_after: '14-multi-way-search-trees', level: 1 }
    ],
    17: [
      { q: '65 is removed from tree M (root [50]; [20] → [10], [30 40]; [70 85] → [60 65], [75], [90]). What happens?',
        options: ['The leaf [60 65] becomes [60]; nothing else changes', 'A rotation with [75]', 'The leaves [60 65] and [75] merge', 'The tree gets shorter'], answer: 0,
        why: 'The leaf was a 3-node, so it still has one element after the removal: no underflow.',
        lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 1 }
    ],
    18: [
      { q: '75 is removed from tree M (root [50]; [20] → [10], [30 40]; [70 85] → [60 65], [75], [90]). Its leaf is empty; its left sibling [60 65] has a spare element. What do the parent and the three leaves look like afterwards?',
        options: ['Parent [65 85]; leaves [60], [70], [90]', 'Parent [70 85]; leaves [60], [65], [90]', 'Parent [85]; leaves [60 65 70], [90]', 'Parent [60 85]; leaves [65], [70], [90]'], answer: 0,
        why: 'A rotation: 70 comes down from the parent into the empty leaf, and 65 goes up from the sibling to take its place. The order 60 &lt; 65 &lt; 70 &lt; 85 &lt; 90 is kept.',
        lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 2 }
    ],
    19: [
      { q: 'A 2-3 tree: root [50]; children [20] and [70 85]; leaves [10], [30] under [20]; [60 65], [75], [90] under [70 85]. 10 is removed. Its sibling [30] has no spare, and the parent [20] has one element. What is the tree afterwards?',
        options: ['Root [60]; [30] → [20], [50]; [70 85] → [65], [75], [90]', 'Root [50]; [30] → [20], [40]', 'Root [20 50]', 'Root [50 70 85]'], answer: 0,
        why: 'The nearest leaf with a spare is [60 65], on the other side of the root. Two rotations move elements along the sorted order: 50 comes down, 60 goes up into the root; then 20 comes down, 30 goes up. Same shape, every node has 1 or 2 elements.',
        lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 3 }
    ],
    20: [
      { q: '90 is removed from tree M (root [50]; [20] → [10], [30 40]; [70 85] → [60 65], [75], [90]). Its sibling [75] has no spare, but the parent [70 85] has two elements. What happens?',
        options: ['85 comes down and merges with [75]: leaf [75 85], parent [70]', 'A rotation with [60 65]', 'The tree gets shorter', '75 goes up into the parent'], answer: 0,
        why: 'A merge: the parent gives one element, the empty leaf disappears, and the parent has one child less. A rotation is only possible when the sibling next to the empty leaf has a spare element, and [75] has none.',
        lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 2 }
    ],
    21: [
      { q: 'A 2-3 tree where every node is a 2-node: root [50]; children [20] and [80]; leaves [10], [30], [60], [90]. 10 is removed. What is the tree afterwards?',
        options: ['Root [50 80] with leaves [20 30], [60], [90] (height 1)', 'Root [50]; [30] → [20], [40]', 'Root [20 50 80]', 'Root [30]; [20], [50 80]'], answer: 0,
        why: 'No leaf has a spare: 20 merges with 30 into [20 30], which empties [20]. That inner node merges too: 50 comes down, giving [50 80], and the root is empty: its only child becomes the root. One level shorter.',
        lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 3 }
    ],
    22: [
      { q: '50, the root element of tree M (root [50]; [20] → [10], [30 40]; [70 85] → [60 65], [75], [90]), is removed. Which element replaces it?',
        options: ['60, its in-order successor, taken from the leaf [60 65]', '40, its predecessor', '70', '85'], answer: 0,
        why: 'An internal element is replaced by the smallest element of its right subtree: go right to [70 85], then left to [60 65]. The leaf keeps 65, so no further fix is needed.',
        lessons: ['11-binary-search-trees', '14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 2 }
    ],
    23: [
      { type: 'tf', q: 'A 4-node of a 2-4 tree holds three elements and has four children or none.', answer: true,
        why: 'Slide 23. 2-nodes and 3-nodes follow the same rules as in a 2-3 tree.',
        lessons: ['14-multi-way-search-trees'], skills: ['concept'], available_after: '14-multi-way-search-trees', level: 1 }
    ],
    24: [
      { q: '5, 10, 15, 20 are added to an empty 2-4 tree. What does it look like after 20?',
        options: ['Root [15]; leaves [5 10] and [20]', 'One node [5 10 15 20]', 'Root [10]; leaves [5] and [15 20]', 'Root [10 15]'], answer: 0,
        why: '[5 10 15] fits in one node (3 elements). 20 makes 4 elements: split, and the third one, 15, moves up into a new root.',
        lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 2 }
    ],
    25: [
      { q: 'A 2-4 tree: root [20 50]; leaves [5 10], [30 40], [60 70 80]. 30 and then 40 are removed. What is the tree afterwards?',
        options: ['Root [10 50]; leaves [5], [20], [60 70 80]', 'Root [20 60]; leaves [5 10], [50], [70 80]', 'Root [50]; leaves [5 10 20], [60 70 80]', 'Root [20 50]; leaves [5 10], [], [60 70 80]'], answer: 0,
        why: 'Removing 30 leaves [40]. Removing 40 empties the leaf: the left sibling [5 10] can lend, so 20 comes down from the parent and 10 goes up (the left sibling is tried first).',
        lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 3 }
    ]
  },
  parts: {
    0: [
      { type: 'tf', q: 'In a 2-3 tree, all the leaves are on the same level.', answer: true,
        why: 'A 2-3 tree grows only at the top (a new root after a split), so every path from the root to a leaf has the same length.',
        lessons: ['14-multi-way-search-trees'], skills: ['concept'], available_after: '14-multi-way-search-trees', level: 1 },
      { q: 'Where is a new element first put in a 2-3 tree?',
        options: ['In the root', 'In a leaf', 'In a new node', 'In the parent of a leaf'], answer: 1,
        why: 'Slide 6: the search path ends in a leaf, and the element is put there in order. Only a split can move an element up.',
        lessons: ['14-multi-way-search-trees'], skills: ['concept'], available_after: '14-multi-way-search-trees', level: 1 },
      { q: 'At most how many elements can a 2-3 tree of height 2 hold?',
        options: ['7', '13', '26', '27'], answer: 2,
        why: 'All 3-nodes: 1 node on level 0, 3 on level 1, 9 on level 2 = 13 nodes, each with 2 elements: 26. (With only 2-nodes it holds 7.)',
        lessons: ['10-trees', '14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 2 },
      { q: 'What does an in-order walk of a 2-3 tree give (left child, first element, middle child, second element, right child)?',
        options: ['The elements in ascending order', 'The elements level by level', 'The leaves only', 'The elements in the order they were added'], answer: 0,
        why: 'Like a BST: everything in a child lies between the elements next to it, so the walk visits the elements from smallest to largest.',
        lessons: ['10-trees', '14-multi-way-search-trees'], skills: ['concept'], available_after: '14-multi-way-search-trees', level: 2 },
      { type: 'trace', q: '50, 20, 80, 10, 30, 60, 90, 40 are added to an empty 2-3 tree. Fill in the root after each listed add, and the height at the end.',
        cols: ['after adding', 'root'],
        rows: [['80', '?[50]|50'], ['30', '?[20 50]|20 50|20,50|[20,50]'], ['90', '?[50]|50'], ['40 (height)', '?2']],
        why: '[20 50 80] splits: 50 goes up into a new root, with [20] and [80]. 10 joins [20]; 30 makes [10 20 30] split, and 20 joins the root: [20 50]. 60 joins [80]; 90 makes [60 80 90] split, 80 goes up, and [20 50 80] splits: 50 is again the root, now of a tree of height 2. 40 joins the leaf [30].',
        lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 3 },
      { q: '35, 10, 60, 20, 45, 70, 5 are added to an empty 2-3 tree. What is the tree at the end?',
        options: ['Root [35]; [10] → [5], [20]; [60] → [45], [70]', 'Root [20 45]; leaves [5 10], [35], [60 70]', 'Root [35 60]; leaves [5 10 20], [45], [70]', 'Root [10]; [5], [20 35 45 60 70]'], answer: 0,
        why: '[10 35 60] splits: root [35]. 20 joins [10]; 45 joins [60]; 70 makes [45 60 70] split: 60 joins the root [35 60]. 5 makes [5 10 20] split: 10 goes up, and [10 35 60] splits too: 35 is the new root. All leaves are 2-nodes on level 2.',
        lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 3 }
    ],
    1: [
      { type: 'tf', q: 'A 2-3 tree is a B-tree of order 3.', answer: true,
        why: 'Slide 11: the order is the maximum number of children, which is 3.',
        lessons: ['14-multi-way-search-trees'], skills: ['concept'], available_after: '14-multi-way-search-trees', level: 1 },
      { q: 'At most how many elements does one node of a B-tree of order 5 hold?',
        options: ['3', '4', '5', '6'], answer: 1,
        why: 'Order m: at most m children and m − 1 elements.',
        lessons: ['14-multi-way-search-trees'], skills: ['concept'], available_after: '14-multi-way-search-trees', level: 1 },
      { q: '15, 25, 35, 45, 55, 65 are added to an empty B-tree of order 4 (a 2-4 tree). What is it at the end?',
        options: ['Root [35]; leaves [15 25] and [45 55 65]', 'Root [25 45]; leaves [15], [35], [55 65]', 'One node with all six', 'Root [45]; leaves [15 25 35] and [55 65]'], answer: 0,
        why: '[15 25 35] fits. 45 makes 4 elements: the third, 35, goes up. 55 and 65 fit into [45], which becomes [45 55 65].',
        lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 2 },
      { q: 'Why does a B*-tree waste less space than a plain B-tree?',
        options: ['Every node except the root is at least two-thirds full, not only half full', 'It stores no keys', 'Its leaves are linked', 'It has only one level'], answer: 0,
        why: 'Slide 13: this avoids the problem of a B-tree being half empty.',
        lessons: ['14-multi-way-search-trees'], skills: ['concept'], available_after: '14-multi-way-search-trees', level: 2 },
      { q: 'A B-tree has order 100 and 3 levels, all nodes full. About how many elements does it hold?',
        options: ['About 300', 'About 10 000', 'About one million', 'About 100'], answer: 2,
        why: '1 + 100 + 10 000 nodes, each with 99 elements: 10 101 × 99 ≈ 1 000 000. Any of a million elements is found by reading only 3 nodes.',
        lessons: ['02-analysis-of-algorithms', '14-multi-way-search-trees'], skills: ['complexity'], available_after: '14-multi-way-search-trees', level: 3 }
    ],
    2: [
      { type: 'tf', q: 'Removing an element from a 3-node leaf never needs a rotation or a merge.', answer: true,
        why: 'Slide 17: the leaf still holds one element, so it becomes a 2-node and the tree stays valid.',
        lessons: ['14-multi-way-search-trees'], skills: ['concept'], available_after: '14-multi-way-search-trees', level: 1 },
      { q: 'What is an <b>underflow</b> in a 2-3 tree?',
        options: ['A node with too many elements', 'A node left with no element after a removal', 'A tree that is too tall', 'A missing child'], answer: 1,
        why: 'Slide 18: removing the only element of a 2-node leaf leaves an empty node, which must be fixed by a rotation or a merge.',
        lessons: ['14-multi-way-search-trees'], skills: ['concept'], available_after: '14-multi-way-search-trees', level: 1 },
      { q: '10 is removed from tree M (root [50]; [20] → [10], [30 40]; [70 85] → [60 65], [75], [90]). What are [20]\'s node and leaves afterwards?',
        options: ['[30] with leaves [20] and [40]', '[20] with leaves [30 40]', '[40] with leaves [20 30]', '[20 30] with leaf [40]'], answer: 0,
        why: 'The sibling [30 40] can lend: 20 comes down into the empty leaf, and 30 goes up into the parent.',
        lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 2 },
      { q: '50 is removed from the 2-4 tree with root [20 50] and leaves [5 10], [30 40], [60 70 80]. What is the root afterwards?',
        options: ['[20 60]', '[20 40]', '[20]', '[10 50]'], answer: 0,
        why: '50 is internal: its in-order successor, 60 (the smallest of [60 70 80]), replaces it. That leaf keeps [70 80], so nothing else changes.',
        lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 2 },
      { type: 'trace', q: 'From tree M (root [50]; [20] → [10], [30 40]; [70 85] → [60 65], [75], [90]), 65 is removed, then 75. Fill in what fixes each removal (none, rotation or merge) and the node [70 85] becomes.',
        cols: ['remove', 'fix', 'that node'],
        rows: [['65', '?none', '?[70 85]|70 85|70,85|[70,85]'], ['75', '?merge', '?[85]|85']],
        why: 'After 65 the leaf is [60]. Removing 75 empties its leaf; neither sibling ([60] or [90]) has a spare, but the parent [70 85] has two elements: 70 comes down and merges with [60] into [60 70], and the parent becomes [85].',
        lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 3 },
      { q: 'A 2-3 tree has n elements. Why are add and remove O(log n)?',
        options: ['All leaves are on the same level, so the height is about log n, and splits, rotations and merges only work along one path', 'Because nodes hold 2 elements', 'Because they never compare elements', 'They are O(n)'], answer: 0,
        why: 'The tree is always balanced. Each fix works on one node and at most its parent, sibling or the next level up, so the work is proportional to the height.',
        lessons: ['02-analysis-of-algorithms', '14-multi-way-search-trees'], skills: ['complexity'], available_after: '14-multi-way-search-trees', level: 3 }
    ]
  }
});
