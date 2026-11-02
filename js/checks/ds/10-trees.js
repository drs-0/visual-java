/* Data Structures · Unit 10 Trees: questions under the slides and the part quizzes.
   Every question has lessons, skills, available_after and level (1 easy, 2 middle, 3 hard). The instructor's
   assignments have no questions for this unit, so all questions are written in his style (tracing exact state,
   implementation reasoning, edge cases, bugs, combined structures). Every traversal was run with the slide code in
   Java. No checks on the cover and the outline slides (1, 2, 11, 17, 24, 36). Trees differ from the drawing presets.
   Trees used (described in words in each question):
   Y (general): P → Q, R, S; Q → T, U; S → V; V → W, X.
   X (binary):  M → F (left), T (right); F → B, H; H → G (left); T → W (right); W → V (left).
   Z (binary):  K → L (left), N (right); L → O (right); N → Q (left). */
addChecks({
  course: 'ds', lesson: '10-trees',
  slides: {
    3: [
      { type: 'multi', q: 'Tree Y: P is the root, with children Q, R and S. Q has children T and U; S has one child V; V has children W and X. Which nodes are <b>leaves</b>?',
        options: ['R', 'Q', 'T', 'V', 'X'], answer: [0, 2, 4],
        why: 'A leaf has no children: T, U, R, W and X. Q and V have children, so they are internal nodes (slide 3).',
        lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 1 }
    ],
    4: [
      { q: 'In tree Y (P → Q, R, S; Q → T, U; S → V; V → W, X), which two nodes are <b>siblings</b>?',
        options: ['T and U', 'U and V', 'Q and T', 'S and V'], answer: 0,
        why: 'Siblings have the same parent: T and U are both children of Q. U and V are on the same level but have different parents. Q and T (or S and V) are parent and child.',
        lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 1 }
    ],
    5: [
      { q: 'In tree Y (P → Q, R, S; Q → T, U; S → V; V → W, X), on which level is V?',
        options: ['0', '1', '2', '3'], answer: 2,
        why: 'The root P is on level 0, its children Q, R, S on level 1, and V, a child of S, on level 2. W and X are on level 3.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 1 }
    ],
    6: [
      { q: 'In tree Y (P → Q, R, S; Q → T, U; S → V; V → W, X), what is the path from P to W, and its length?',
        options: ['P → Q → U → W, length 3', 'P → S → V → W, length 4', 'P → V → W, length 2', 'P → S → V → W, length 3'], answer: 3,
        why: 'The path goes down through W\'s ancestors: P, S, V, W. The path length counts the <b>edges</b>, not the nodes: 3. That is also W\'s level, and the height of Y.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 },
      { type: 'tf', q: 'The height of tree Y is 3.', answer: true,
        why: 'The height is the length of the longest path from the root to a leaf: P → S → V → W (or X) has 3 edges. The other leaves are closer to the root.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 1 }
    ],
    7: [
      { q: 'In tree Y (P → Q, R, S; Q → T, U; S → V; V → W, X), which nodes are the <b>ancestors</b> of W?',
        options: ['Only V', 'P, S and V', 'V and X', 'P, Q, R and S'], answer: 1,
        why: 'A node is an ancestor of W if it is on the path from the root to W (slide 7): P, S, V. X is a sibling of W, not an ancestor.',
        lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 2 },
      { q: 'How many nodes are in the subtree of Y whose root is S?',
        options: ['1', '2', '3', '4'], answer: 3,
        why: 'A subtree is a node with all its descendants: S, V, W and X.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 1 }
    ],
    8: [
      { q: 'What kind of tree is Y (P has 3 children, the others at most 2), if 3 is the most children a node may have?',
        options: ['A binary tree', 'A ternary tree (degree 3)', 'A general tree with degree 2', 'A 4-ary tree'], answer: 1,
        why: 'The degree is the maximum number of children a node may have. With at most 3 children per node, the tree is ternary. In a binary tree P could not have 3 children.',
        lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 1 }
    ],
    9: [
      { q: 'Is tree Y balanced? (Leaves: R on level 1; T, U on level 2; W, X on level 3.)',
        options: ['Yes, because the root has 3 children and every node is used', 'Yes, all leaves are within one level of each other', 'No: its leaves are on levels 1 to 3, more than one level apart', 'No, because only binary trees can be balanced'], answer: 2,
        why: 'A tree is balanced if all the leaves are on the same level or within one level of each other (slide 9). R (level 1) and W (level 3) are two levels apart.',
        lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 2 }
    ],
    10: [
      { q: 'A binary tree has levels 0, 1 and 2 completely filled, and two nodes on level 3, both on the far left. What is it?',
        options: ['Complete but not full', 'Full', 'Neither complete nor full', 'Full but not complete'], answer: 0,
        why: 'Every level except the last has the maximum number of nodes (1, 2, 4), and the last level is filled from the left: complete. It is full only if level 3 is also complete (8 nodes).',
        lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 2 },
      { q: 'How many nodes does a <b>full ternary</b> tree with levels 0, 1 and 2 have?',
        options: ['7', '9', '13', '27'], answer: 2,
        why: 'Level l of a full k-ary tree has kˡ nodes: 1 + 3 + 9 = 13.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 }
    ],
    12: [
      { type: 'tf', q: 'A leaf of a linked binary tree is a TreeNode whose left and right are both null.', answer: true,
        why: 'Each TreeNode has an element and two child pointers. A leaf has no children, so both pointers are null.',
        lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 1 }
    ],
    13: [
      { q: 'A linked binary tree has 6 nodes. How many of its left/right references are null?',
        options: ['5', '6', '7', '12'], answer: 2,
        why: '6 nodes have 12 child references. Every node except the root is pointed to by exactly one of them, so 5 are used and 12 − 5 = 7 are null. (n nodes always leave n + 1 null references.)',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 3 }
    ],
    14: [
      { q: 'In the array implementation, a node is at index 4. Where are its children?',
        options: ['8 and 9', '3 and 5', '5 and 6', '9 and 10'], answer: 3,
        why: 'Left child at 2i + 1 = 9, right child at 2i + 2 = 10.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 1 },
      { q: 'A node is at index 11. At which index is its parent?',
        options: ['5', '6', '10', '22'], answer: 0,
        why: '11 is odd, so it is a left child: 2i + 1 = 11 gives i = 5. (Index 12 would be the right child of 5 too.)',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 }
    ],
    15: [
      { q: 'Tree X: M is the root, with F (left) and T (right). F has B (left) and H (right); H has a left child G; T has a right child W; W has a left child V. In the array implementation, at which index is V?',
        options: ['7', '11', '13', '14'], answer: 2,
        why: 'M 0, F 1, T 2, B 3, H 4, W 6 (right child of 2: 2·2 + 2). V is the left child of W: 2·6 + 1 = 13. The array needs 14 cells for 8 elements, so 6 cells stay null: the drawback of slide 15.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 }
    ],
    16: [
      { q: 'In the simulated-link array of slide 16, what does a left value of −1 mean?',
        options: ['The node is the root', 'The node has no left child', 'The left child is at the end of the array', 'The node was removed'], answer: 1,
        why: 'Each array node stores the indexes of its children, and −1 means "no child node". Unlike the 2i + 1 rule, the nodes can be stored in any order.',
        lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 1 }
    ],
    18: [
      { q: 'Why are there more ways to traverse a tree than a list?',
        options: ['Because trees are bigger than lists, so they need more ways to be visited', 'Because every node is the root of a subtree, so we can choose when to visit the node: before, between or after its subtrees, or level by level', 'Because a tree has no first element, so each traversal starts at a different node', 'Because trees cannot be traversed backward, so other ways must be used instead'], answer: 1,
        why: 'A list is linear: forward or backward. In a tree each node has subtrees, and the traversals differ in when the node itself is visited (slide 18).',
        lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 1 }
    ],
    19: [
      { q: 'Tree X: M → F (left), T (right); F → B (left), H (right); H → G (left); T → W (right); W → V (left). What is its <b>pre-order</b> traversal?',
        options: ['M, F, B, H, G, T, W, V', 'B, F, G, H, M, T, V, W', 'M, F, T, B, H, W, G, V', 'B, G, H, F, V, W, T, M'], answer: 0,
        why: 'Visit the node, then the left subtree, then the right one, recursively: M, then F\'s subtree (F, B, H, G), then T\'s subtree (T, W, V). The other options are the level-order, in-order and post-order.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 }
    ],
    20: [
      { q: 'Same tree X. What is its <b>in-order</b> traversal?',
        options: ['B, F, G, H, M, V, W, T', 'B, F, H, G, M, T, W, V', 'M, F, B, H, G, T, W, V', 'B, F, G, H, M, T, V, W'], answer: 3,
        why: 'Left subtree, node, right subtree: B F G H (F\'s subtree: B, F, then H\'s subtree G, H), then M, then T\'s subtree: T has no left child, so T first, then W\'s subtree V, W.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 }
    ],
    21: [
      { q: 'Same tree X. What is its <b>post-order</b> traversal?',
        options: ['B, G, H, F, V, W, T, M', 'B, G, H, F, W, V, T, M', 'M, T, W, V, F, H, G, B', 'G, B, H, F, V, W, T, M'], answer: 0,
        why: 'Left subtree, right subtree, then the node: F\'s subtree gives B, G, H, F; T\'s subtree gives V, W, T; the root M comes last.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 },
      { type: 'tf', q: 'In a post-order traversal the root of the tree is always visited last.', answer: true,
        why: 'Post-order visits a node after both of its subtrees, so the root, whose subtrees are the whole rest of the tree, comes last. In pre-order it comes first.',
        lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 1 }
    ],
    22: [
      { q: 'Same tree X. What is its <b>level-order</b> traversal?',
        options: ['M, F, B, H, G, T, W, V', 'M, F, T, B, H, W, G, V', 'M, F, T, B, H, G, W, V', 'M, T, F, W, H, B, V, G'], answer: 1,
        why: 'Level 0: M. Level 1: F, T. Level 2: B, H, W. Level 3: G, V. Each level from left to right.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 }
    ],
    23: [
      { type: 'trace', q: 'Tree Z: K → L (left), N (right); L → O (right); N → Q (left). levelOrder runs. Fill in the node removed in each turn and the queue after that turn (front → rear).',
        cols: ['turn', 'removed', 'queue after'],
        rows: [['1', '?K', '?L N'], ['2', '?L', '?N O'], ['3', '?N', '?O Q'], ['4', '?O', '?Q'], ['5', '?Q', '?empty']],
        why: 'Each turn removes the front node, visits it, and adds its children at the rear: L adds O behind N, then N adds Q behind O. The visiting order K, L, N, O, Q is level by level.',
        lessons: ['05-queues', '10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 }
    ],
    25: [
      { type: 'tf', q: 'The Java collections API has a BinaryTree interface that our LinkedBT can use.', answer: false,
        why: 'Slide 25: the API does not define an interface for a binary tree, so the slides define their own BinaryTree&lt;T&gt;.',
        lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 1 }
    ],
    26: [
      { type: 'fill', q: 'Complete these lines of the BinaryTree&lt;T&gt; interface (slide 26).',
        code: 'public interface BinaryTree<T> {\n  ___ getRoot();\n  int height();\n  ___ left();\n  ___ inOrder();\n}',
        answer: ['T', 'BinaryTree<T>', 'List<T>'],
        why: 'getRoot returns the root <b>element</b> (T). left() returns the left subtree as a tree object. The traversals return a list of elements.',
        lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 2 }
    ],
    27: [
      { q: 'What does `new TreeNode<>("Q")` create?',
        options: ['A node whose left child is "Q"', 'An empty tree', 'A node with element "Q" and no children (a leaf)', 'A whole tree with root "Q" and two empty nodes'], answer: 2,
        why: 'The one-argument constructor calls <code>this(element, null, null)</code>: left and right are null.',
        lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 1 }
    ],
    28: [
      { q: 'Why can TreeNode be a nested <b>static</b> class?',
        options: ['Because it is generic, and generic nested classes must be static', 'Because static classes are faster than inner classes', 'Because it must be public, and only static classes can be public', 'Because a node only needs its element and child pointers; it never uses the fields of a LinkedBT object'], answer: 3,
        why: 'Like Node&lt;T&gt; in the linked list (unit 7, slide 18): a nested static class does not belong to an outer object. An inner class is needed only when the class uses the outer object, like an iterator.',
        lessons: ['07-iterators', '10-trees'], skills: ['design'], available_after: '10-trees', level: 2 }
    ],
    29: [
      { q: 'In tree X (M → F, T; F → B, H; H → G; T → W; W → V), what do `size()` and `height()` return for the node F?',
        options: ['size 4, height 3', 'size 3, height 2', 'size 4, height 2', 'size 8, height 3'], answer: 2,
        why: 'F\'s subtree holds F, B, H, G: size 4. The longest path down from F is F → H → G: 2 edges. 8 and 3 are the values for the whole tree (node M).',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 },
      { q: 'What does `height()` of slide 29 return for a leaf?',
        options: ['0', '1', '−1', 'It throws a NullPointerException'], answer: 0,
        why: 'Both children are null, so lheight = rheight = 0 and the method returns 0. The +1 is only added for a child that exists, so no null is ever used.',
        lessons: ['10-trees'], skills: ['edge_case'], available_after: '10-trees', level: 1 }
    ],
    30: [
      { q: 'In tree X (M → F, T; F → B, H; H → G; T → W; W → V), how many nodes does `find("V")` compare with the target, counting V itself?',
        options: ['3', '4', '6', '8'], answer: 3,
        why: 'find checks the node, then the whole left subtree, then the right one: the pre-order M, F, B, H, G, T, W, V. V is the last node in that order, so all 8 nodes are compared.',
        lessons: ['10-trees'], skills: ['trace', 'complexity'], available_after: '10-trees', level: 2 },
      { type: 'tf', q: 'find searches the right subtree only if the target was not found in the left subtree.', answer: true,
        why: '<code>if (node == null &amp;&amp; right != null)</code>: when the left search returned a node, the right subtree is skipped.',
        lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 1 }
    ],
    31: [
      { type: 'order', q: 'Put the lines of the recursive inOrder(List&lt;T&gt; list) in order.',
        lines: ['if (left != null) left.inOrder(list);', 'list.add(element);', 'if (right != null) right.inOrder(list);'],
        why: 'In-order: left subtree, then the node itself, then the right subtree. Moving list.add first or last gives pre-order or post-order.',
        lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 1 },
      { q: 'Tree Z: K → L (left), N (right); L → O (right); N → Q (left). What list does postOrder build?',
        options: ['L, O, K, Q, N', 'O, L, Q, N, K', 'K, L, O, N, Q', 'O, Q, L, N, K'], answer: 1,
        why: 'L\'s subtree: O then L. N\'s subtree: Q then N. Then K. "L, O, K, Q, N" is the in-order; "O, Q, L, N, K" mixes the two subtrees: post-order finishes the whole subtree of L before it starts the subtree of N.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 }
    ],
    32: [
      { q: 'What is the in-order of `new LinkedBT<>("A", new LinkedBT<>("B"), new LinkedBT<>("C", null, new LinkedBT<>("D")))`?',
        options: ['A, B, C, D', 'B, D, C, A', 'B, A, C, D', 'B, A, D, C'], answer: 2,
        why: 'The tree is A with left child B and right child C; C has a right child D (its left is null). In-order: B, A, then C\'s subtree: C (no left child), then D.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 }
    ],
    33: [
      { q: 'What does `left()` return for an empty LinkedBT?',
        options: ['A new LinkedBT whose root is null: an empty tree', 'null', 'It throws a NullPointerException', 'The same tree'], answer: 0,
        why: '<code>TreeNode&lt;T&gt; left = (root == null)? null : root.left;</code> then <code>return new LinkedBT&lt;&gt;(left);</code>. The caller always gets a tree object, which may be empty, so it can call isEmpty() on it safely.',
        lessons: ['10-trees'], skills: ['edge_case'], available_after: '10-trees', level: 2 }
    ],
    34: [
      { q: 'Which two LinkedBT trees return the <b>same</b> value from height()?',
        options: ['A tree with one node and a tree with two nodes', 'An empty tree and a tree with one node', 'An empty tree and a tree with two nodes', 'No two different trees can have the same height'], answer: 1,
        why: '<code>height()</code> returns 0 when root == null, and a single node also has height 0 (no edges). size() tells them apart: 0 and 1.',
        lessons: ['10-trees'], skills: ['edge_case'], available_after: '10-trees', level: 3 }
    ],
    35: [
      { q: 'In levelOrder, the queue is replaced by a stack (add = push, remove = pop); the left child is still added before the right one. What order does tree Z (K → L, N; L → O right; N → Q left) give?',
        options: ['K, L, N, O, Q', 'Q, O, N, L, K', 'K, L, O, N, Q', 'K, N, Q, L, O'], answer: 3,
        why: 'Pop K, push L then N. Pop N (the top), push Q. Pop Q. Pop L, push O. Pop O. Result K, N, Q, L, O: not level by level any more. The FIFO queue is what keeps the levels in order.',
        lessons: ['03-stacks', '10-trees'], skills: ['trace', 'design'], available_after: '10-trees', level: 3 }
    ],
    37: [
      { q: 'An expression tree has * at the root; its left child is − with leaves 8 and 2; its right child is + with leaves 3 and 1. What is its value?',
        options: ['10', '12', '14', '24'], answer: 3,
        why: 'Evaluate from the bottom up: 8 − 2 = 6 and 3 + 1 = 4, then 6 * 4 = 24.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 },
      { type: 'tf', q: 'In an expression tree, the operands are leaves and the operators are internal nodes.', answer: true,
        why: 'Slide 37: each operator has its operands (numbers, variables or smaller expressions) as children; a plain operand has no children.',
        lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 1 }
    ],
    38: [
      { q: 'For the same tree (* with − (8, 2) on the left and + (3, 1) on the right), what does the post-order traversal give?',
        options: ['* - 8 2 + 3 1', '8 - 2 * 3 + 1', '8 2 - 3 1 + *', '8 2 3 1 - + *'], answer: 2,
        why: 'Post-order visits both subtrees before the operator: 8 2 −, then 3 1 +, then *. That is the postfix form; pre-order gives the prefix form "* - 8 2 + 3 1".',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 },
      { q: 'The postfix form `8 2 - 3 1 + *` is evaluated with a stack (unit 3). What does the stack hold right after the + is processed (bottom → top)?',
        options: ['6, 4', '24', '8, 2, 4', '6, 3, 1'], answer: 0,
        why: 'Push 8, 2; − pops them and pushes 6. Push 3, 1; + pops them and pushes 4. The stack is 6, 4, and the final * leaves 24. The post-order of an expression tree is exactly the input the stack algorithm needs.',
        lessons: ['03-stacks', '10-trees'], skills: ['trace'], available_after: '10-trees', level: 3 }
    ]
  },
  parts: {
    0: [
      { type: 'tf', q: 'A tree has exactly one root, and the root has no parent.', answer: true,
        why: 'Slide 4: there is only one root node, at the top level, and it has no parent node.',
        lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 1 },
      { q: 'What is a node with no children called?',
        options: ['A root', 'An internal node', 'A sibling', 'A leaf'], answer: 3,
        why: 'A node without children is a leaf (slide 4). An internal node has at least one child.',
        lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 1 },
      { q: 'At most how many nodes can level 3 of a binary tree have?',
        options: ['3', '6', '8', '9'], answer: 2,
        why: 'Each level can have twice as many nodes as the one above: 1, 2, 4, 8. In general kˡ for a k-ary tree (slide 10), here 2³.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 },
      { q: 'A tree has 12 nodes. How many edges does it have?',
        options: ['11', '12', '13', '24'], answer: 0,
        why: 'Every node except the root has exactly one edge to its parent, so there are n − 1 = 11 edges.',
        lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 2 },
      { q: 'How many nodes does a <b>full</b> binary tree of height 3 have?',
        options: ['7', '8', '15', '16'], answer: 2,
        why: 'Levels 0 to 3 are all complete: 1 + 2 + 4 + 8 = 15.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 },
      { q: 'A <b>complete</b> binary tree has 10 nodes. What is its height?',
        options: ['2', '3', '4', '9'], answer: 1,
        why: 'Levels 0 to 2 hold 1 + 2 + 4 = 7 nodes, and the other 3 are on level 3 (filled from the left). The longest path from the root to a leaf has 3 edges.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 3 }
    ],
    1: [
      { type: 'tf', q: 'In the array implementation of a binary tree, the root is at index 0.', answer: true,
        why: 'Slide 14: the root starts at index 0, and the children of index i are at 2i + 1 and 2i + 2.',
        lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 1 },
      { q: 'Where are the children of the node at index 2?',
        options: ['5 and 6', '4 and 5', '3 and 4', '6 and 7'], answer: 0,
        why: '2·2 + 1 = 5 and 2·2 + 2 = 6.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 1 },
      { q: 'A binary tree is stored as the array A, B, C, null, D. What is D?',
        options: ['The left child of B', 'The right child of B', 'The left child of C', 'The right child of A'], answer: 1,
        why: 'B is at index 1; its children are at 3 (null: no left child) and 4. So D, at index 4, is B\'s right child.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 },
      { q: 'In the simulated-link array, node 3 has left = −1. A new node is stored at index 7 and becomes node 3\'s left child. What changes?',
        options: ['All the nodes after index 3 move one cell to the right', 'Nothing can change: a new child can only go at the end of the array', 'The array must be rebuilt so that node 7 sits right after node 3', 'Only node 3\'s left value becomes 7 (and node 7 gets −1, −1)'], answer: 3,
        why: 'With simulated links, nodes are added in any order (slide 16); a child is found through the stored index, not by a formula. No element moves.',
        lessons: ['10-trees'], skills: ['design'], available_after: '10-trees', level: 2 },
      { q: 'A binary tree of 4 nodes is a chain of right children: the root, its right child, that node\'s right child, and so on. How many cells does the array implementation need?',
        options: ['4', '7', '8', '15'], answer: 3,
        why: 'The indexes are 0, 2 (2·0 + 2), 6 (2·2 + 2) and 14 (2·6 + 2), so the array needs 15 cells for 4 elements: 11 are null. This is the waste slide 15 warns about when a tree is not complete.',
        lessons: ['10-trees'], skills: ['trace', 'edge_case'], available_after: '10-trees', level: 3 }
    ],
    2: [
      { type: 'tf', q: 'The level-order traversal uses a queue.', answer: true,
        why: 'Slide 22: it removes the node at the front, visits it, and adds its children at the rear: FIFO keeps the levels in order.',
        lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 1 },
      { q: 'Which traversal visits the root first?',
        options: ['Pre-order (and also level-order)', 'Post-order (and also in-order)', 'In-order, which starts in the middle', 'None: every traversal starts at a leaf'], answer: 0,
        why: 'Pre-order visits the node before its subtrees, so it starts with the root. Level-order also starts at the root (level 0).',
        lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 1 },
      { type: 'trace', q: 'Tree Z: K → L (left), N (right); L → O (right); N → Q (left). Fill in the four traversals.',
        cols: ['traversal', '1st', '2nd', '3rd', '4th', '5th'],
        rows: [['pre-order', '?K', '?L', '?O', '?N', '?Q'], ['in-order', '?L', '?O', '?K', '?Q', '?N'], ['post-order', '?O', '?L', '?Q', '?N', '?K'], ['level-order', '?K', '?L', '?N', '?O', '?Q']],
        why: 'O is the <b>right</b> child of L, so in-order gives L before O; Q is the <b>left</b> child of N, so in-order gives Q before N. Post-order ends with the root, level-order goes level by level.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 },
      { q: 'A binary tree has the pre-order A, B, C and the in-order B, A, C. What is its post-order?',
        options: ['B, A, C', 'C, B, A', 'A, C, B', 'B, C, A'], answer: 3,
        why: 'Pre-order starts with the root: A. In the in-order, B is left of A and C is right of A, so B is the left child and C the right child. Post-order: B, C, A.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 3 },
      { q: 'A binary tree has the pre-order D, E, F and the in-order F, E, D. What is its post-order?',
        options: ['D, E, F', 'F, E, D', 'E, F, D', 'F, D, E'], answer: 1,
        why: 'D is the root (first in pre-order), and in the in-order everything is left of D: E and F are in D\'s left subtree. In that subtree E comes first in pre-order, so E is its root, and F is left of E. The tree is a chain D → E → F of left children, so post-order is F, E, D.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 3 }
    ],
    3: [
      { type: 'tf', q: 'TreeNode is a nested static class inside LinkedBT.', answer: true,
        why: 'Slide 28: <code>protected static class TreeNode&lt;T&gt;</code>, used to build the nodes of the linked tree.',
        lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 1 },
      { q: 'What does size() of slide 29 return for a leaf?',
        options: ['0', '1', '2', 'It throws'], answer: 1,
        why: 'Both children are null, so lsize = rsize = 0, and the method returns 0 + 0 + 1: the leaf counts itself.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 1 },
      { type: 'output', q: 'LinkedBT is the class of slides 27-35 (with the size and height of slide 34). What does this print?',
        code: 'LinkedBT<String> t = new LinkedBT<>("A",\n    new LinkedBT<>("B"),\n    new LinkedBT<>("C", null, new LinkedBT<>("D")));\nSystem.out.println(t.size() + " " + t.height() + " " + t.preOrder());',
        answer: '4 2 [A, B, C, D]',
        why: 'The tree is A → B (left), C (right), and C → D (right): 4 nodes. The longest path A → C → D has 2 edges. Pre-order: A, B, C, D. preOrder() returns a java.util List, which prints in brackets.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 },
      { type: 'bug', q: 'This height() gives a wrong value for a tree whose longest path goes through left children. Tap the line with the mistake.',
        code: 'public int height() {\n  int lheight = (left != null)? left.height() : 0;\n  int rheight = (right != null)? right.height() + 1 : 0;\n  return Math.max(lheight, rheight);\n}',
        answer: 2,
        why: 'Line 2 forgets the + 1 for the edge to the left child. A chain of three left children, for example, gets height 0 instead of 2. The slide adds 1 on both sides: <code>left.height() + 1</code>.',
        lessons: ['10-trees'], skills: ['bug'], available_after: '10-trees', level: 2 },
      { q: 'A tree has n nodes. How many times is size() of slide 29 called in total by `root.size()`?',
        options: ['n', 'log₂ n', '1', '2n'], answer: 0,
        why: 'Each node calls size() only on its children that exist, so every node is reached exactly once: n calls, each O(1), so size() is O(n).',
        lessons: ['08-recursion', '10-trees'], skills: ['complexity'], available_after: '10-trees', level: 2 },
      { type: 'bug', q: 'This find returns null for a target in the <b>left</b> subtree whenever the node also has a right child. Tap the line with the mistake.',
        code: 'public TreeNode<T> find(T target) {\n  if (element.equals(target)) return this;\n  TreeNode<T> node = null;\n  if (left != null) node = left.find(target);\n  if (right != null) node = right.find(target);\n  return node;\n}',
        answer: 5,
        why: 'The node found on the left is overwritten by the result of the right search, which is null when the target is not there. The slide only searches the right side when nothing was found: <code>if (node == null &amp;&amp; right != null)</code>.',
        lessons: ['10-trees'], skills: ['bug', 'trace'], available_after: '10-trees', level: 3 }
    ],
    4: [
      { type: 'tf', q: 'An expression tree is evaluated from the bottom up.', answer: true,
        why: 'Slide 37: an operator can only be applied once the values of its subtrees are known, so the leaves are used first and the root last.',
        lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 1 },
      { q: 'For the expression tree * with − (8, 2) on the left and + (3, 1) on the right, what does the pre-order traversal give?',
        options: ['8 2 - 3 1 + *', '* - 8 2 + 3 1', '* + 3 1 - 8 2', '- 8 2 * + 3 1'], answer: 1,
        why: 'Pre-order visits the operator before its operands: *, then the left subtree − 8 2, then the right subtree + 3 1. That is the prefix form.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 },
      { q: 'The post-order of an expression tree is `4 2 + 3 *`. Which expression is it (in-order with parentheses)?',
        options: ['4 + (2 * 3)', '4 * 2 + 3', '(4 + 2) * 3', '(4 * 3) + 2'], answer: 2,
        why: 'The last symbol, *, is the root. Its left operand is the subtree "4 2 +", which is 4 + 2, and its right operand is 3. Value: 18.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 },
      { q: '`a - b - c` is computed from left to right. What does the post-order of its expression tree give?',
        options: ['a b c - -', 'a b - c -', '- - a b c', 'a - b - c'], answer: 1,
        why: 'Left to right means (a − b) − c, so the root − has the subtree a − b on the left and c on the right. Post-order: a b −, then c, then −. "a b c - -" would be a − (b − c), a different value.',
        lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 3 }
    ]
  }
});
