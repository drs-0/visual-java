/* Data Structures · Unit 11 Binary Search Trees: questions under the slides and the part quizzes.
   Every question has lessons, skills, available_after and level (1 easy, 2 middle, 3 hard). The instructor's
   assignments have no questions for this unit, so all questions are written in his style (exact state after adds and
   removes, the slide code line by line, edge cases, bugs, combined with earlier units). Every add, search, remove,
   removeMin and AVL rotation was run in Java with the slide code. No checks on the cover and the outline slides
   (1, 2, 9, 18, 30). The trees differ from the drawing presets.
   Trees used (built by adding the numbers in this order to an empty LinkedBST):
   P: 52, 26, 78, 13, 39, 65, 91, 33, 47, 71, 30  →  52(26(13 39(33(30 .) 47)) 78(65(. 71) 91))
   Q: 60, 25, 80, 10, 40, 70, 95, 35, 50, 45, 55, 75, 90  →  60(25(10 40(35 50(45 55))) 80(70(. 75) 95(90 .))) */
addChecks({
  course: 'ds', lesson: '11-binary-search-trees',
  slides: {
    3: [
      { q: 'A BST node holds 40, and its right child holds 40 too. Is that allowed?',
        options: ['No, a BST cannot hold the same element twice', 'Only if 40 is the root', 'Yes: the right child may be greater than <b>or equal to</b> its parent', 'Yes, but only on the left side'], answer: 2,
        why: 'Slide 3: the right child contains an element that is greater than or equal to the parent. So a copy always goes to the right, never to the left.',
        lessons: ['11-binary-search-trees'], skills: ['concept'], available_after: '11-binary-search-trees', level: 1 },
      { type: 'tf', q: 'If every left child is smaller than its parent and every right child is greater than or equal to its parent, the tree is a valid BST.', answer: false,
        why: 'The rule is about whole subtrees. Root 50 with left child 30, and 30 with right child 70: each parent/child pair looks fine, but 70 is in the <b>left</b> subtree of 50 and is larger than 50.',
        lessons: ['11-binary-search-trees'], skills: ['concept', 'edge_case'], available_after: '11-binary-search-trees', level: 2 }
    ],
    4: [
      { type: 'multi', q: 'A BST has root 60. 60 has a left child 30, and 30 has a right child 45. A new node will be placed as the <b>right</b> child of 45. Which values may it hold?',
        options: ['50', '62', '31', '59', '45'], answer: [0, 3, 4],
        why: 'Follow the ranges: left of 60 → less than 60; right of 30 → at least 30; right of 45 → at least 45. So 45 ≤ x &lt; 60: 50, 59 and 45 fit. 62 breaks the rule of the root, 31 breaks the rule of 45.',
        lessons: ['11-binary-search-trees'], skills: ['concept', 'trace'], available_after: '11-binary-search-trees', level: 2 }
    ],
    5: [
      { q: '8, 3, 10, 1, 6 and then 6 again are added to an empty BST. Where does the second 6 go?',
        options: ['It is not added', 'Right child of the first 6', 'Left child of the first 6', 'Right child of 3'], answer: 1,
        why: 'Path: 6 &lt; 8 → left to 3; 6 ≥ 3 → right to the first 6; 6 ≥ 6 → right, and that link is null. Equal elements go to the right.',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 2 },
      { type: 'multi', q: 'Adding 5, 7, 3, 4 to an empty BST gives the tree of slide 5. Which other add orders give <b>exactly the same</b> tree?',
        options: ['5, 3, 4, 7', '5, 3, 7, 4', '3, 5, 7, 4', '7, 5, 3, 4', '5, 7, 4, 3'], answer: [0, 1],
        why: 'The root is the first element, so it must be 5. Then 4 must come after 3 (to hang under 3). "5, 7, 4, 3" makes 4 the left child of 5 and 3 the left child of 4: a different tree.',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 3 }
    ],
    6: [
      { type: 'trace', q: 'Tree P is built by adding 52, 26, 78, 13, 39, 65, 91, 33, 47, 71, 30 to an empty BST. Then 68, 35 and 26 are added. For each new element, fill in its parent and the side (L or R).',
        cols: ['added', 'parent', 'side'],
        rows: [['68', '?71', '?L'], ['35', '?33', '?R'], ['26', '?30', '?L']],
        why: '68: right of 52 → 78, left → 65, right → 71, left: null. 35: left of 52 → 26, right → 39, left → 33, right: null. 26: left of 52 → the first 26, <b>right</b> (equal) → 39, left → 33, left → 30, left: null.',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 2 }
    ],
    7: [
      { type: 'tf', q: 'When the search reaches a null link, the target is not in the tree.', answer: true,
        why: 'Slide 7: the target would have been on this path if it were in the tree. Reaching the end of the path means "not found".',
        lessons: ['11-binary-search-trees'], skills: ['concept'], available_after: '11-binary-search-trees', level: 1 },
      { q: 'A BST has height 6. At most how many nodes does one search compare with the target?',
        options: ['6', '7', '64', '127'], answer: 1,
        why: 'A search looks at one node per level, from level 0 down to level 6: at most 7 nodes, height + 1.',
        lessons: ['11-binary-search-trees'], skills: ['complexity'], available_after: '11-binary-search-trees', level: 2 }
    ],
    8: [
      { q: 'Tree P: 52 → 26 (left), 78 (right); 26 → 13, 39; 39 → 33, 47; 33 → 30 (left); 78 → 65, 91; 65 → 71 (right). Which nodes does a search for 71 visit?',
        options: ['52, 78, 71', '52, 26, 39, 47, 78, 65, 71', '52, 78, 91, 71', '52, 78, 65, 71'], answer: 3,
        why: '71 ≥ 52 → right to 78; 71 &lt; 78 → left to 65; 71 ≥ 65 → right: found 71. Four nodes, one per level.',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 2 },
      { q: 'In the same tree P, a search for 40 ends with "not found". How many nodes were compared with 40?',
        options: ['3', '4', '5', '11'], answer: 1,
        why: '40 &lt; 52 → 26; 40 ≥ 26 → 39; 40 ≥ 39 → 47; 40 &lt; 47 → left link of 47 is null. Four nodes: 52, 26, 39, 47.',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 2 }
    ],
    10: [
      { q: 'Why can a node with <b>two</b> children not be removed by linking its parent to one of its children?',
        options: ['The parent has only one link for it, so the other child\'s subtree would be lost', 'Because the tree would become a list, with every node on one side', 'Because a node with two children is always the root of the tree', 'Because both children are always leaves, and leaves cannot move up'], answer: 0,
        why: 'The parent has one link where the removed node was. With one child, that child fits there (case 2). With two, one whole subtree would be cut off, so case 3 uses the in-order successor instead.',
        lessons: ['11-binary-search-trees'], skills: ['concept', 'design'], available_after: '11-binary-search-trees', level: 2 }
    ],
    11: [
      { type: 'match', q: 'Tree Q is built by adding 60, 25, 80, 10, 40, 70, 95, 35, 50, 45, 55, 75, 90. Match each node with its removal case.',
        pairs: [['10', 'case 1: a leaf'], ['70', 'case 2: one child'], ['40', 'case 3: two children']],
        why: '10 has no children. 70 has only a right child, 75. 40 has two children, 35 and 50.',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 2 }
    ],
    12: [
      { q: 'Tree Q (adds 60, 25, 80, 10, 40, 70, 95, 35, 50, 45, 55, 75, 90): 45 is the left child of 50. Which link changes when the leaf 45 is removed?',
        options: ['40.right = null', '55 moves to the left of 50', '50 takes the place of 45', '50.left = null'], answer: 3,
        why: 'Case 1: cut the link from the parent. 50.left becomes null; nothing else moves.',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 1 }
    ],
    13: [
      { q: 'In tree Q, 70 has only a right child, 75, and 70 is the left child of 80. What changes when 70 is removed?',
        options: ['75 is removed too', '80.right = 75', '80.left = 75', '80.left = null'], answer: 2,
        why: 'Case 2: the parent of the removed node is linked to its only child. 70 was on the left of 80, so 75 becomes the left child of 80. 75 ≥ 60 and &lt; 80, so it fits there.',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 2 }
    ],
    14: [
      { type: 'tf', q: 'After removing a node with one child, the in-order traversal of the tree is the old in-order without the removed element.', answer: true,
        why: 'The child\'s subtree moves up as a block, and it stays on the same side of every ancestor. So the order of all the other elements does not change.',
        lessons: ['10-trees', '11-binary-search-trees'], skills: ['concept'], available_after: '11-binary-search-trees', level: 2 }
    ],
    15: [
      { q: 'In tree Q (adds 60, 25, 80, 10, 40, 70, 95, 35, 50, 45, 55, 75, 90), what is the in-order successor of 40?',
        options: ['35', '45', '50', '55'], answer: 1,
        why: 'The successor is the smallest element in the right subtree: go right once (50), then left as long as possible (45). 45 has no left child.',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 2 },
      { q: '25 is removed from tree Q. Its successor is found and copied into the node of 25. How is the successor node then removed?',
        options: ['As case 1: the successor 35 is a leaf', 'As case 2: the successor 40 has one child', 'As case 3 again', 'It is not removed'], answer: 0,
        why: 'Right of 25 is 40, then left to 35, which has no left child: the successor is 35, and it has no children at all. After the copy, the old 35 node is cut off like any leaf.',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 3 }
    ],
    16: [
      { q: 'The root 60 is removed from tree Q. What is the new root, and what becomes the left child of 80?',
        options: ['Root 75; 80.left = 70', 'Root 55; 80 does not change', 'Root 70; 80.left = 75', 'Root 80; 80.left = 25'], answer: 2,
        why: 'The successor is the smallest element on the right: 80, then left to 70 (no left child). 70 is copied into the root. The old 70 node has one child, 75, so 80.left = 75 (case 2).',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 3 }
    ],
    17: [
      { type: 'order', q: 'Put the steps for removing a node with two children in order.',
        lines: ['Find the node that holds the target', 'Find the smallest element in its right subtree (the in-order successor)', 'Copy the successor\'s element into the node', 'Remove the successor node as in case 1 or 2'],
        why: 'The node itself stays; only its element changes. The successor node, which has no left child, is the one that is really cut out.',
        lessons: ['11-binary-search-trees'], skills: ['concept'], available_after: '11-binary-search-trees', level: 1 }
    ],
    19: [
      { type: 'match', q: 'Match each BST operation with what it does.',
        pairs: [['remove(target)', 'removes the first node that matches target'], ['removeAll(target)', 'removes every copy of target'], ['findMax()', 'returns the largest element'], ['removeMin()', 'removes and returns the smallest element']],
        why: 'Slide 19. remove takes out one copy only; removeAll keeps going until no copy is left.',
        lessons: ['11-binary-search-trees'], skills: ['concept'], available_after: '11-binary-search-trees', level: 1 }
    ],
    20: [
      { type: 'fill', q: 'Complete the interface of slide 20.',
        code: 'public interface BinarySearchTree<T> ___ BinaryTree<T> {\n  void add(T element);\n  void remove(T target);\n  ___ findMin();\n  T removeMax();\n}',
        answer: ['extends', 'T'],
        why: 'One interface <b>extends</b> another interface (a class would use implements). findMin returns the element, so its type is T.',
        lessons: ['11-binary-search-trees'], skills: ['concept'], available_after: '11-binary-search-trees', level: 2 }
    ],
    21: [
      { q: 'Why does the class header say `LinkedBST<T extends Comparable<T>>`?',
        options: ['So the tree can store any object, also one that cannot be compared', 'So that the tree stays balanced after every add and remove', 'Because the parent class LinkedBT requires it in its own header', 'Because add and find call compareTo on the elements to choose left or right'], answer: 3,
        why: 'A BST must compare elements. The bound promises that every T has <code>compareTo</code>, so <code>element.compareTo(node.element)</code> compiles.',
        lessons: ['11-binary-search-trees'], skills: ['concept'], available_after: '11-binary-search-trees', level: 2 },
      { type: 'tf', q: '`LinkedBST<Object> t = new LinkedBST<>();` compiles.', answer: false,
        why: 'Object does not implement Comparable&lt;Object&gt;, so it is outside the bound <code>T extends Comparable&lt;T&gt;</code>. Integer and String are fine.',
        lessons: ['11-binary-search-trees'], skills: ['edge_case'], available_after: '11-binary-search-trees', level: 2 }
    ],
    22: [
      { type: 'bug', q: 'This private add breaks the rule of slide 3 when the same element is added twice. Tap the line with the mistake.',
        code: 'private void add(TreeNode<T> node, T element) {\n  if (element.compareTo(node.element) <= 0) {\n    if (node.left == null) node.left = new TreeNode<>(element);\n    else add(node.left, element);\n  }\n  else {\n    if (node.right == null) node.right = new TreeNode<>(element);\n    else add(node.right, element);\n  }\n}',
        answer: 2,
        why: 'With <code>&lt;= 0</code> an equal element goes to the left. The slides\' rule says left is only for smaller elements; equal ones go right. The slide uses <code>&lt; 0</code>.',
        lessons: ['11-binary-search-trees'], skills: ['bug'], available_after: '11-binary-search-trees', level: 2 },
      { q: 'Tree P is built by adding 52, 26, 78, 13, 39, 65, 91, 33, 47, 71, 30. Then `add(26)` is called. How many times does the <b>private</b> add run?',
        options: ['2', '4', '5', '6'], answer: 2,
        why: 'The public add calls add(52, 26). Then: 26 &lt; 52 → add(26, 26); 26 ≥ 26 → add(39, 26); 26 &lt; 39 → add(33, 26); 26 &lt; 33 → add(30, 26); 26 &lt; 30 and 30.left is null → new node, no more calls. Five calls.',
        lessons: ['08-recursion', '11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 3 }
    ],
    23: [
      { q: '`find(65)` runs on tree P (52 → 26, 78; 78 → 65, 91; 65 → 71 right; …). Which values does the variable `node` hold, in order?',
        options: ['52, 78, 65, 71', '52, 65', '52, 26, 78, 65', '52, 78, 65'], answer: 3,
        why: 'node starts at the root 52. 65 ≥ 52 → node = 78. 65 &lt; 78 → node = 65. Now target.equals(65), so <code>break</code> stops the loop.',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 2 },
      { type: 'tf', q: 'When the target is not in the tree, find returns null.', answer: false,
        why: 'The loop ends with node == null, and the method still returns <code>new LinkedTree&lt;&gt;(node)</code>: a tree <b>object</b> that is empty (its root is null).',
        lessons: ['11-binary-search-trees'], skills: ['edge_case'], available_after: '11-binary-search-trees', level: 2 }
    ],
    24: [
      { type: 'trace', q: '`remove(26)` runs on tree P (52 → 26, 78; 26 → 13, 39; 39 → 33, 47; 33 → 30 left; …). Fill in the node of each call of the private remove (its element when the call starts) and the element of the node it returns ("null" if none).',
        cols: ['call', 'node', 'returns'],
        rows: [['1', '52', '?52'], ['2', '?26', '?30'], ['3', '?39', '?39'], ['4', '?33', '?33'], ['5', '?30', '?null']],
        why: 'Call 2 finds 26 with two children: it copies findMin(39\'s subtree) = 30 into the node and calls remove on its right subtree for 30. That goes 39 → 33 → 30; the old 30 has no left child, so it returns its right link, null, and 33.left becomes null. Call 2 returns its own node, which now holds 30.',
        lessons: ['08-recursion', '11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 3 },
      { q: 'What does the private remove return when the node that holds the target is a leaf?',
        options: ['null, the value of node.right', 'The node itself', 'Its parent', 'It throws an exception'], answer: 0,
        why: '<code>if (node.left == null) return node.right;</code>: for a leaf node.right is null, so the parent links null instead: the leaf is cut off. The same line handles case 1 and the "only a right child" case.',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 2 }
    ],
    25: [
      { q: 'A BST is built by adding 9, 7, 5, 3. How many times does the while loop of findMax run?',
        options: ['0', '1', '3', '4'], answer: 0,
        why: 'Each element is smaller than the ones before, so they all go left: the root 9 has no right child. The loop test fails at once and findMax returns 9.',
        lessons: ['11-binary-search-trees'], skills: ['edge_case'], available_after: '11-binary-search-trees', level: 2 },
      { type: 'tf', q: 'The minimum of a BST may have a right child.', answer: true,
        why: 'The minimum is the leftmost node: it has no <b>left</b> child. A right child is allowed (it is greater). Example: adding 5, 2, 3 makes 2 the minimum with right child 3.',
        lessons: ['11-binary-search-trees'], skills: ['concept'], available_after: '11-binary-search-trees', level: 1 }
    ],
    26: [
      { q: 'removeMin() is called twice on tree P (52 → 26, 78; 26 → 13, 39; 39 → 33, 47; …). What do the calls return, and what is the left child of 52 afterwards?',
        options: ['13 and 26; left child null', '13 and 26; left child 39', '13 and 30; left child 26', '13 and 13; left child 39'], answer: 1,
        why: 'First call: 13 is the leftmost node; parent 26 gets 13\'s right link (null). Second call: now 26 is the leftmost (it has no left child), its parent is 52, so 52.left = 26.right = 39.',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 2 },
      { type: 'bug', q: 'This removeMin loses elements when the minimum has a right child. Tap the line with the mistake.',
        code: 'public T removeMin() {\n  if (root == null) return null;\n  if (root.left == null) {\n    T element = root.element;\n    root = root.right;\n    return element;\n  }\n  TreeNode<T> parent = root;\n  TreeNode<T> curr = root.left;\n  while (curr.left != null) {\n    parent = curr;\n    curr = curr.left;\n  }\n  parent.left = null;\n  return curr.element;\n}',
        answer: 14,
        why: 'Setting the link to null throws away the right subtree of the minimum. The slide writes <code>parent.left = curr.right;</code>, so that subtree moves up (case 2).',
        lessons: ['11-binary-search-trees'], skills: ['bug'], available_after: '11-binary-search-trees', level: 3 }
    ],
    27: [
      { q: 'A <b>full</b> BST has height 4. How many nodes does it have?',
        options: ['15', '16', '31', '32'], answer: 2,
        why: 'N = 2<sup>h+1</sup> − 1 = 2⁵ − 1 = 31: levels 0 to 4 hold 1 + 2 + 4 + 8 + 16.',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 2 },
      { q: 'A balanced BST holds 1000 elements. About how tall is it?',
        options: ['About 100', 'About 10', 'About 500', '1000'], answer: 1,
        why: 'h = O(log₂ N), and 2¹⁰ = 1024. So about 10 levels, and a search makes about 10 comparisons.',
        lessons: ['02-analysis-of-algorithms', '11-binary-search-trees'], skills: ['complexity'], available_after: '11-binary-search-trees', level: 2 }
    ],
    28: [
      { q: 'Which task costs O(N) even for a <b>balanced</b> BST with N elements?',
        options: ['Finding the minimum element', 'Adding one new element', 'Searching for one element', 'Printing all the elements in sorted order'], answer: 3,
        why: 'The in-order traversal must visit all N nodes. The others follow one path from the root: O(log₂ N).',
        lessons: ['11-binary-search-trees'], skills: ['complexity'], available_after: '11-binary-search-trees', level: 2 },
      { type: 'tf', q: 'The in-order traversal of a BST gives its elements in ascending order.', answer: true,
        why: 'In-order visits the left subtree (smaller), then the node, then the right subtree (greater or equal), at every node.',
        lessons: ['10-trees', '11-binary-search-trees'], skills: ['concept'], available_after: '11-binary-search-trees', level: 1 }
    ],
    29: [
      { q: 'Why are BSTs used for database indexes?',
        options: ['They use less memory than arrays, because a node stores no links', 'They never need to compare keys, so a search is O(1)', 'They find a row by its key quickly and keep the keys in order', 'They store each key twice, so a lost key can be found again'], answer: 2,
        why: 'Slide 29: an index must find data fast (O(log N) for a balanced tree) and often list keys in order (in-order).',
        lessons: ['11-binary-search-trees'], skills: ['concept'], available_after: '11-binary-search-trees', level: 1 }
    ],
    31: [
      { type: 'multi', q: 'Which add orders of 1, 2, 3, 4 give a degenerate tree (each node has at most one child, height 3)?',
        options: ['1, 2, 3, 4', '4, 3, 2, 1', '1, 4, 2, 3', '2, 1, 3, 4', '3, 1, 2, 4'], answer: [0, 1, 2],
        why: '1, 4, 2, 3 is a zig-zag: 4 right of 1, 2 left of 4, 3 right of 2. One child per node, so it is a list too. "2, 1, 3, 4" and "3, 1, 2, 4" give a root with two children: height 2.',
        lessons: ['11-binary-search-trees'], skills: ['trace', 'edge_case'], available_after: '11-binary-search-trees', level: 2 }
    ],
    32: [
      { type: 'tf', q: 'The slides\' LinkedBST keeps itself balanced after every add.', answer: false,
        why: 'Slide 32: our implementation does not ensure the BST stays balanced. AVL and Red/Black trees do.',
        lessons: ['11-binary-search-trees'], skills: ['concept'], available_after: '11-binary-search-trees', level: 1 }
    ],
    33: [
      { q: 'Tree: 40 → 20 (left), 50 (right); 20 → 10 (left), 30 (right); 10 → 5 (left). After a right rotation around 40, what is the pre-order?',
        options: ['20, 5, 10, 40, 50, 30', '20, 10, 5, 30, 40, 50', '10, 5, 20, 40, 30, 50', '20, 10, 5, 40, 30, 50'], answer: 3,
        why: 'The left child 20 becomes the root, 40 becomes 20\'s right child, and 30 (20\'s old right child) becomes 40\'s left child. Tree: 20 → 10 (→ 5), 40 (→ 30, 50).',
        lessons: ['10-trees', '11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 2 }
    ],
    34: [
      { q: 'Tree: 20 → 10 (left), 40 (right); 40 → 30 (left), 50 (right); 50 → 60 (right). After a left rotation around 20, which node is the <b>right</b> child of 20?',
        options: ['30', '50', '40', 'null'], answer: 0,
        why: '40 becomes the root and 20 its left child. 40\'s old left child, 30, moves to 20\'s right side. 30 is between 20 and 40, so the order is kept.',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 2 }
    ],
    35: [
      { q: 'Tree: 20 → 10 (left), 50 (right); 50 → 40 (left), 60 (right); 40 → 30 (left). The long path is in the left subtree of the right child. What is the root after the RightLeft rotation?',
        options: ['20', '30', '40', '50'], answer: 2,
        why: 'First a right rotation around 50: 40 moves up (20 → 40 → 50 → 60). Then a left rotation around 20: 40 becomes the root with 20 (→ 10, 30) and 50 (→ 60).',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 2 }
    ],
    36: [
      { q: 'Tree: 50 → 20 (left), 60 (right); 20 → 10 (left), 30 (right); 30 → 40 (right). A LeftRight rotation is done. Where is 40 afterwards?',
        options: ['It is the root', 'Left child of 50', 'Right child of 30', 'Right child of 20'], answer: 1,
        why: 'Left rotation around 20: 30 moves up. Right rotation around 50: 30 becomes the root, with 20 (→ 10) on the left and 50 (→ 40, 60) on the right. 40 was 30\'s right child and moves to 50\'s left.',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 3 }
    ],
    37: [
      { q: 'Tree: 30 → 20 (left), 40 (right); 20 → 10, 25; 25 → 27 (right); 40 → 50 (right). With bf = height(right) − height(left), what are the balance factors of 30 and of 20?',
        options: ['30: −2, 20: +1', '30: +1, 20: −1', '30: −1, 20: +1', '30: 0, 20: 0'], answer: 2,
        why: 'Height of 20\'s subtree is 2 (20 → 25 → 27) and of 40\'s subtree 1: bf(30) = 1 − 2 = −1. For 20: right subtree 25 has height 1, left subtree 10 has height 0: bf = +1. Both are fine (−1, 0, +1).',
        lessons: ['10-trees', '11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 2 },
      { type: 'tf', q: 'A node with balance factor −2 has a left subtree that is 2 levels taller than its right subtree.', answer: true,
        why: 'Slide 37: −2 means the right subtree is shorter than the left one by 2, so a right rotation (or LeftRight) is needed.',
        lessons: ['11-binary-search-trees'], skills: ['concept'], available_after: '11-binary-search-trees', level: 1 }
    ],
    38: [
      { type: 'trace', q: 'An AVL tree starts empty. 30, 20, 10, 40, 50, 25 are added in this order. After each add, fill in the rotation done (- for none, R, L, RL or LR) and the root.',
        cols: ['add', 'rotation', 'root'],
        rows: [['30', '-', '30'], ['20', '?-', '?30'], ['10', '?R', '?20'], ['40', '?-', '?20'], ['50', '?L', '?20'], ['25', '?RL', '?30']],
        why: '10 makes 30 −2 with left child 20 at −1: right rotation, root 20. 50 makes 30 +2 (child 40 at +1): left rotation around 30, inside the tree. 25 goes 20 → 40 → 30 → left: the root 20 is +2 and its right child 40 is −1, so RightLeft: 30 becomes the root.',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 3 }
    ],
    39: [
      { q: 'AVL tree: 20 → 10 (left), 30 (right); 10 → 5 (left); 30 → 25, 40; 40 → 35 (left). 5 is removed. What happens?',
        options: ['A single left rotation around 20; new root 30', 'A RightLeft rotation; new root 25', 'Nothing: the tree is still balanced', 'A right rotation around 20; new root 10'], answer: 0,
        why: 'Now 20 has bf +2. Its right child 30 has bf +1 (40\'s side is taller than 25\'s), not −1, so the long path is on the outside and one left rotation is enough: 30 becomes the root, 20 (→ 10, 25) on its left.',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 3 }
    ]
  },
  parts: {
    0: [
      { type: 'tf', q: 'A new element in a BST is always added as a leaf.', answer: true,
        why: 'The add walks down until it meets a null link and puts the new node there. Nothing that is already in the tree moves.',
        lessons: ['11-binary-search-trees'], skills: ['concept'], available_after: '11-binary-search-trees', level: 1 },
      { q: 'Where is the smallest element of a BST?',
        options: ['In the leftmost node', 'At the root', 'In the leftmost leaf of the last level', 'In the rightmost node'], answer: 0,
        why: 'Keep going left from the root until there is no left child. That node may still have a right child, so it is not always a leaf.',
        lessons: ['11-binary-search-trees'], skills: ['concept'], available_after: '11-binary-search-trees', level: 1 },
      { q: '15, 9, 23, 12, 20 and then 9 again are added to an empty BST. What is its pre-order?',
        options: ['15, 9, 9, 12, 23, 20', '15, 9, 12, 9, 23, 20', '9, 9, 12, 15, 20, 23', '15, 9, 23, 12, 20, 9'], answer: 1,
        why: 'The second 9 goes left of 15, right of the first 9 (equal), then left of 12. Tree: 15 → 9 (→ right 12 → left 9), 23 (→ left 20). Pre-order: 15, 9, 12, 9, 23, 20. The third option is the in-order.',
        lessons: ['10-trees', '11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 2 },
      { q: 'A full BST holds the 15 numbers 1 to 15 (height 3). A search for 16 compares with how many nodes?',
        options: ['1', '3', '4', '15'], answer: 2,
        why: '16 is greater than everything, so the search goes right at each level: 8, 12, 14, 15, then a null link. One node per level: 4.',
        lessons: ['11-binary-search-trees'], skills: ['trace', 'complexity'], available_after: '11-binary-search-trees', level: 2 },
      { type: 'multi', q: 'A BST has root 50. 50 → 20 (left); 20 → 35 (right); 35 → 28 (left). A new value x is added and becomes the <b>right</b> child of 28. Which values can x be?',
        options: ['28', '34', '35', '30', '27'], answer: [0, 1, 3],
        why: 'Left of 50: x &lt; 50. Right of 20: x ≥ 20. Left of 35: x &lt; 35. Right of 28: x ≥ 28. So 28 ≤ x &lt; 35. 35 would go right of 35, 27 left of 28.',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 3 },
      { q: 'A sorted array and a <b>full</b> BST hold the same 15 values. How do binary search (unit 9) and the BST search compare?',
        options: ['The BST search is O(1), because it starts at the middle element', 'The BST search looks at all 15 elements, because it has no indexes', 'Binary search looks at all 15, and the BST search at most at 4', 'Both look at most at 4 elements: the root is the middle element, like the first midpoint of binary search'], answer: 3,
        why: 'In a full BST the root splits the values in two halves, its children split the halves again … the same splits as binary search. Both are O(log₂ n): at most 4 steps for 15 values.',
        lessons: ['09-searching-and-sorting', '11-binary-search-trees'], skills: ['complexity', 'concept'], available_after: '11-binary-search-trees', level: 3 }
    ],
    1: [
      { type: 'tf', q: 'The in-order successor of a node with two children never has a left child.', answer: true,
        why: 'It is the leftmost node of the right subtree. If it had a left child, that child would be smaller and would be the successor.',
        lessons: ['11-binary-search-trees'], skills: ['concept'], available_after: '11-binary-search-trees', level: 1 },
      { q: 'Which removal is done by cutting one link and nothing else?',
        options: ['Removing a leaf', 'Removing the root', 'Removing a node with one child', 'Removing a node with two children'], answer: 0,
        why: 'Case 1: the parent\'s link to the leaf becomes null. Case 2 relinks the parent to the child; case 3 copies the successor.',
        lessons: ['11-binary-search-trees'], skills: ['concept'], available_after: '11-binary-search-trees', level: 1 },
      { q: 'Why is the removed element replaced by the <b>smallest</b> element of its right subtree, and not by any element of it?',
        options: ['Because it is the fastest to find, and any element of the right subtree would also keep the rule', 'Because then the right subtree becomes empty, so nothing else has to be fixed', 'Because it is always a leaf, and only a leaf can be moved in a BST', 'Because it is greater than or equal to everything on the left and not greater than anything else on the right, so the rule still holds'], answer: 3,
        why: 'Any element of the right subtree is ≥ all of the left subtree. Only the smallest one is also ≤ all the others on the right, so the right side stays ≥ the new element.',
        lessons: ['11-binary-search-trees'], skills: ['concept', 'design'], available_after: '11-binary-search-trees', level: 2 },
      { q: 'Tree Q (adds 60, 25, 80, 10, 40, 70, 95, 35, 50, 45, 55, 75, 90). 80 is removed. What are the children of the node that held 80 now?',
        options: ['70 and 95', '75 and 95', '70 and 90', '90 and 95'], answer: 0,
        why: '80 has two children. Its successor is the smallest on its right: 95, then left to 90. 90 is copied into the node; the old 90, a leaf, is cut off from 95. The node (now 90) still has children 70 and 95.',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 2 },
      { type: 'trace', q: 'Tree Q: 60 → 25, 80; 25 → 10, 40; 40 → 35, 50; 50 → 45, 55; 80 → 70, 95; 70 → 75 (right); 95 → 90 (left). Remove 45, then 70, then 25, then 60. After each removal, fill in the case (1, 2 or 3) and the root.',
        cols: ['remove', 'case', 'root'],
        rows: [['45', '?1', '?60'], ['70', '?2', '?60'], ['25', '?3', '?60'], ['60', '?3', '?75']],
        why: '45 is a leaf. 70 has one child (75), so 80.left = 75. 25 has two children: its successor 35 is copied. 60 has two children: the smallest on the right is now 75 (70 is gone), so 75 becomes the root.',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 3 },
      { q: 'A BST is built by adding 30, 20, 40, 30, 20. Then remove(30) runs with the slides\' code. What does the tree look like?',
        options: ['20 → 20, 40 (→ left 30)', '40 → 20 (→ right 20), 30', '30 → 20 (→ right 20), 40', '30 → 20 (→ right 20), 40 (→ left 30)'], answer: 2,
        why: 'The root 30 has two children. Its successor is the smallest on the right: 40, then left to the second 30. So 30 is copied over 30, and the old copy under 40 is removed. One 30 is gone, and it is the one under 40.',
        lessons: ['11-binary-search-trees'], skills: ['trace', 'edge_case'], available_after: '11-binary-search-trees', level: 3 }
    ],
    2: [
      { type: 'tf', q: 'LinkedBST extends LinkedBT, so it already has size(), height() and the traversals.', answer: true,
        why: 'Slide 21: <code>LinkedBST&lt;T …&gt; extends LinkedBT&lt;T&gt; implements BinarySearchTree&lt;T&gt;</code>. It inherits root, TreeNode and all the LinkedBT methods.',
        lessons: ['11-binary-search-trees'], skills: ['concept'], available_after: '11-binary-search-trees', level: 1 },
      { q: 'What does findMin() return for an empty LinkedBST?',
        options: ['0', 'The root', 'It throws a NullPointerException', 'null'], answer: 3,
        why: 'The first line is <code>if (root == null) return null;</code>, so the loop never touches a null node.',
        lessons: ['11-binary-search-trees'], skills: ['edge_case'], available_after: '11-binary-search-trees', level: 1 },
      { type: 'fill', q: 'Complete findMax of slide 25.',
        code: 'public T findMax() {\n  if (root == null) return null;\n  TreeNode<T> node = ___;\n  while (node.___ != null) node = node.right;\n  return node.___;\n}',
        answer: ['root', 'right', 'element'],
        why: 'Start at the root and keep going right; the rightmost node holds the largest element.',
        lessons: ['11-binary-search-trees'], skills: ['concept'], available_after: '11-binary-search-trees', level: 2 },
      { type: 'output', q: 'LinkedBST is the class of slides 21-26. What does this print?',
        code: 'LinkedBST<Integer> t = new LinkedBST<>();\nfor (int x : new int[]{34, 12, 56, 12, 78, 45}) t.add(x);\nSystem.out.println(t.removeMin() + " " + t.removeMin() + " "\n    + t.findMin() + " " + t.findMax());',
        answer: '12 12 34 78',
        why: 'Tree: 34 → 12 (→ right 12), 56 (→ 45, 78). removeMin: the first 12 is leftmost; 34.left = its right child, the second 12. removeMin again: that 12; 34.left = null. Now 34 is the minimum and 78 the maximum.',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 2 },
      { q: 'A LinkedBST is built by adding 1, 2, 3, …, n in this order. How long do findMin() and findMax() take?',
        options: ['findMin O(1), findMax O(n)', 'Both O(log n)', 'findMin O(n), findMax O(1)', 'Both O(1)'], answer: 0,
        why: 'Every element goes right, so the root 1 has no left child: findMin stops at once. findMax walks the whole chain of n nodes.',
        lessons: ['02-analysis-of-algorithms', '11-binary-search-trees'], skills: ['complexity', 'edge_case'], available_after: '11-binary-search-trees', level: 3 },
      { type: 'bug', q: 'After removing a node with two children, this remove leaves the successor in the tree twice. Tap the line with the mistake.',
        code: 'private TreeNode<T> remove(TreeNode<T> node, T target) {\n  if (node == null) return null;\n  if (target.compareTo(node.element) < 0)\n    node.left = remove(node.left, target);\n  else if (target.compareTo(node.element) > 0)\n    node.right = remove(node.right, target);\n  else {\n    if (node.left == null) return node.right;\n    if (node.right == null) return node.left;\n    node.element = findMin(node.right);\n    node.right = remove(node.right, target);\n  }\n  return node;\n}',
        answer: 11,
        why: 'After the copy, the old successor node must be removed: <code>remove(node.right, node.element)</code>. The old target is normally not in the right subtree (unless a copy of it is there), so nothing is removed and the successor\'s element is now in the tree twice.',
        lessons: ['11-binary-search-trees'], skills: ['bug'], available_after: '11-binary-search-trees', level: 3 },
      { q: 'n values are added one by one to a BST that stays balanced, and then an in-order traversal prints them. What is the total cost?',
        options: ['O(n)', 'O(n log n)', 'O(log n)', 'O(n²)'], answer: 1,
        why: 'Each add is O(log n), so n adds are O(n log n); the in-order is O(n) more. The total is O(n log n): a way of sorting, as fast as merge sort (unit 9).',
        lessons: ['09-searching-and-sorting', '11-binary-search-trees'], skills: ['complexity'], available_after: '11-binary-search-trees', level: 3 }
    ],
    3: [
      { type: 'tf', q: 'A rotation keeps the BST order of the elements.', answer: true,
        why: 'A rotation only re-links three nodes, and each moved subtree stays between the same two values. The in-order traversal is the same before and after.',
        lessons: ['11-binary-search-trees'], skills: ['concept'], available_after: '11-binary-search-trees', level: 1 },
      { q: 'What is the worst-case cost of a search in a degenerate BST with n nodes?',
        options: ['O(1)', 'O(log n)', 'O(n²)', 'O(n)'], answer: 3,
        why: 'Slide 31: a degenerate tree is like a linked list, so a search may check every node.',
        lessons: ['11-binary-search-trees'], skills: ['complexity'], available_after: '11-binary-search-trees', level: 1 },
      { q: 'A node has no left child and one right child, which is a leaf. What is its balance factor?',
        options: ['0', '+1', '−1', '+2'], answer: 1,
        why: 'bf = height(right) − height(left) = 0 − (−1) = +1. A missing subtree counts as height −1, and a leaf has height 0.',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 2 },
      { q: 'Three nodes form the chain 10 → 20 → 30 (each one the right child of the one before). Which single rotation balances it?',
        options: ['A right rotation around 10', 'A RightLeft rotation', 'A left rotation around 10', 'A left rotation around 20'], answer: 2,
        why: 'The right side is too long, so rotate left around the root: 20 becomes the root with 10 and 30 as its children.',
        lessons: ['11-binary-search-trees'], skills: ['concept'], available_after: '11-binary-search-trees', level: 2 },
      { type: 'trace', q: 'An AVL tree starts empty. 50, 40, 30, 45, 47 are added in this order. After each add, fill in the rotation done (- for none, R, L, RL or LR) and the root.',
        cols: ['add', 'rotation', 'root'],
        rows: [['50', '-', '50'], ['40', '?-', '?50'], ['30', '?R', '?40'], ['45', '?-', '?40'], ['47', '?LR', '?40']],
        why: '30 makes 50 −2 (child 40 at −1): right rotation, root 40. 47 goes 40 → 50 → 45 → right: 50 is −2 and its left child 45 is +1, so LeftRight around 50: 47 takes 50\'s place, with 45 and 50 as children. The root 40 does not change.',
        lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 3 },
      { q: 'AVL tree: 20 → 10 (left), 30 (right); 30 → 25, 40. 10 is removed. 20 now has bf +2 and its right child 30 has bf 0. What happens?',
        options: ['A RightLeft rotation: 25 goes up and becomes the root, with 20 and 30 as children', 'A right rotation around 30: 25 goes up, and 30 becomes its right child', 'Nothing: bf 0 at 30 means the tree is still balanced', 'A left rotation around 20: root 30, with 20 (→ right 25) and 40'], answer: 3,
        why: 'Only a right child with bf −1 needs the double rotation. With bf 0 one left rotation is enough: 30 goes up and 25 moves to 20\'s right side. The new bf values are −1 (30), +1 (20) and 0.',
        lessons: ['11-binary-search-trees'], skills: ['trace', 'edge_case'], available_after: '11-binary-search-trees', level: 3 }
    ]
  }
});
