/* Data Structures · Unit 4 Linked Stacks: questions under the slides and the part quizzes.
   Every question has lessons, skills, available_after and level (1 easy, 2 middle, 3 hard, never harder than the
   instructor's). source = the instructor's own question (Assignments 3 and 4), copied word for word with his answer.
   No checks on the cover and the outline slides (1, 2, 7, 13). Names differ from the drawing presets. */
addChecks({
  course: 'ds', lesson: '04-linked-stacks',
  slides: {
    3: [
      { q: 'What does an object reference variable hold?',
        options: ['The address of the object, where it is stored in memory', 'A full copy of the object', 'The first field of the object', 'The number of bytes the object uses'], answer: 0,
        why: 'Slide 3: a reference holds the <b>address</b> of the object, so it "points" to the object (that is why it is also called a pointer). Two references can point to the same object; no copy is made.',
        lessons: ['04-linked-stacks'], skills: ['concept'], available_after: '04-linked-stacks', level: 1 }
    ],
    4: [
      { type: 'output', q: 'With the Person class of slide 4, what does this print?',
        code: 'Person a = new Person(); a.name = "Rami";\nPerson b = new Person(); b.name = "Lina";\nPerson c = new Person(); c.name = "Majid";\na.next = b;\nb.next = c;\nSystem.out.println(a.next.next.name);\nSystem.out.println(c.next);',
        answer: 'Majid\nnull',
        why: '<code>a.next</code> is b, and <code>b.next</code> is c, so <code>a.next.next.name</code> is "Majid". c\'s next was never set, so it is still null: c is the last node. A self-referential class lets each Person point to the next Person.',
        lessons: ['04-linked-stacks'], skills: ['trace'], available_after: '04-linked-stacks', level: 2 }
    ],
    5: [
      { q: 'A linked list has 4 nodes. How many of their `next` fields are null?',
        options: ['0', '1', '3', '4'], answer: 1,
        why: 'Each of the first 3 nodes points to the node after it. Only the last node points to nothing, so its next is null (slide 5). The first node is reached through front, a separate variable, not through a next field.',
        lessons: ['04-linked-stacks'], skills: ['concept'], available_after: '04-linked-stacks', level: 1 }
    ],
    6: [
      { q: 'Which of these needs a node with <b>more than one</b> link to other nodes?',
        options: ['A stack of plates, where each plate lies on the one below', 'A line of people at a bank, each behind the next', 'A family tree, where a person links to each of their children', 'A list of names in order, each name followed by the next'], answer: 2,
        why: 'A parent can have several children, so the node needs several references: a complex, non-linear structure (slide 6). Stacks, lines and lists are linear: one next link per node is enough.',
        lessons: ['04-linked-stacks'], skills: ['concept'], available_after: '04-linked-stacks', level: 1 }
    ],
    8: [
      { type: 'multi', q: 'Which are the basic techniques for managing the nodes of a linked list (slide 8)?',
        options: ['Accessing elements', 'Inserting elements', 'Removing elements', 'Resizing the array', 'Shifting the elements to the right'], answer: [0, 1, 2],
        why: 'Slide 8 lists accessing, inserting and removing. A linked list has no array to resize, and inserting never shifts elements: only links change.',
        lessons: ['04-linked-stacks'], skills: ['concept'], available_after: '04-linked-stacks', level: 1 }
    ],
    9: [
      { q: 'The list is Rami → Lina → Majid and the search loop of slide 9 looks for "Noor", who is not in the list. Where does `current` point when the loop stops?',
        code: 'Person current = first;\nwhile (!(current.name.equals(name)) && (current.next != null))\n  current = current.next;',
        options: ['To null', 'To the first node, Rami', 'The loop never stops', 'To the last node, Majid'], answer: 3,
        why: 'The loop also stops when <code>current.next</code> is null, that is, at the last node. So current is Majid, a node that does not hold "Noor". After the loop the code must still check <code>current.name.equals(name)</code> to know whether the name was found. current never becomes null in this loop.',
        lessons: ['04-linked-stacks'], skills: ['trace', 'edge_case'], available_after: '04-linked-stacks', level: 2 },
      { q: 'For which list does the loop of slide 9 crash?',
        options: ['A list where the name is in the last node', 'A list of one node', 'An empty list (first is null)', 'A list where the name is missing'], answer: 2,
        why: 'With an empty list, current is null, and <code>current.name</code> throws a NullPointerException. With one node, the loop test reads a real node and stops at once. A missing name stops at the last node (see the question above).',
        lessons: ['04-linked-stacks'], skills: ['edge_case', 'bug'], available_after: '04-linked-stacks', level: 2 }
    ],
    10: [
      { type: 'order', q: 'Put the lines in order to insert a new node at the front of the list.',
        lines: ['Person node = new Person();', 'node.next = front;', 'front = node;'],
        why: 'First create the node, then link it to the old front node, and only then move front to it. If front moved first, the old list would be lost.',
        lessons: ['04-linked-stacks'], skills: ['design'], available_after: '04-linked-stacks', level: 1 },
      { q: 'A student swaps the last two lines: `front = node;` then `node.next = front;`. What happens?',
        options: ['The new node points to itself, and the old nodes can no longer be reached', 'The same as the slide: the node is inserted at the front', 'The new node is inserted at the end', 'It does not compile'], answer: 0,
        why: 'After <code>front = node</code>, front already points to the new node, so <code>node.next = front</code> makes the node point to itself. Nothing points to the old first node any more: the old list is lost. It compiles; it is a logic mistake.',
        lessons: ['04-linked-stacks'], skills: ['bug', 'trace'], available_after: '04-linked-stacks', level: 2 }
    ],
    11: [
      { q: 'The list has only <b>one</b> node. The three lines of slide 11 delete it. What is `front` after them?',
        code: 'Person next = front.next;\nfront.next = null;\nfront = next;',
        options: ['It throws a NullPointerException', 'The deleted node', 'null: the list is empty', 'The same node, with next = null'], answer: 2,
        why: 'The only node\'s next is null, so the variable next is null, and <code>front = next</code> makes front null: an empty list. No exception, because front itself was not null when <code>front.next</code> was read.',
        lessons: ['04-linked-stacks'], skills: ['trace', 'edge_case'], available_after: '04-linked-stacks', level: 2 }
    ],
    12: [
      { q: 'What is the flaw of putting the `next` field inside Person (slide 12)?',
        options: ['Person objects become too big to be stored in memory', 'next cannot have the type Person inside the class Person', 'A list of Person objects cannot be traversed from the front', 'Person must become a node itself, so every class we want to store would need its own next field'], answer: 3,
        why: 'To be in the list, Person needs a link field, which has nothing to do with being a person. We want a list of any type T, so a generic Node&lt;T&gt; holds the link and a reference to the element. A Person list can be traversed, and a field of the same class is allowed (slide 4).',
        lessons: ['04-linked-stacks'], skills: ['design'], available_after: '04-linked-stacks', level: 2 }
    ],
    14: [
      { type: 'multi', q: 'Which statements about LinkedStack&lt;T&gt; are true (slide 14)?',
        options: ['It implements the same Stack<T> interface as ArrayStack', 'It uses a nested Node<T> class to form the list', 'It keeps the number of elements in count', 'Its array must grow when it is full', 'It stores the elements in an array'], answer: [0, 1, 2],
        why: 'Same interface, a different inside: linked nodes instead of an array. So there is no array and no capacity to grow; each push simply creates one node.',
        lessons: ['04-linked-stacks'], skills: ['concept'], available_after: '04-linked-stacks', level: 1 }
    ],
    15: [
      { q: 'What are `top` and `count` right after `new LinkedStack<String>()`?',
        options: ['top = 0, count = 0', 'top = a new empty node, count = 0', 'top = null, count = 1', 'top = null, count = 0'], answer: 3,
        why: 'The constructor sets top = null (no node yet) and count = 0. No node is created until the first push. top is a reference, so it cannot be 0.',
        lessons: ['04-linked-stacks'], skills: ['trace'], available_after: '04-linked-stacks', level: 1 }
    ],
    16: [
      { q: 'Why is Node&lt;T&gt; written as a <b>private static</b> class inside LinkedStack&lt;T&gt;?',
        options: ['So that users of the stack can create nodes', 'To group it with the stack and hide it: only LinkedStack uses nodes', 'Because Java does not allow a Node class in its own file', 'So that all stacks share one node'], answer: 1,
        why: 'Slide 16: nesting it gives better grouping and encapsulation. Users only see push, pop, peek…; the nodes are an inside detail. static here means a node does not belong to one stack object; it does not mean there is only one node.',
        lessons: ['04-linked-stacks'], skills: ['design'], available_after: '04-linked-stacks', level: 2 }
    ],
    17: [
      { q: 'The stack is top → C → B → A. During `push(D)`, just after `temp.next = top;` and before `top = temp;`, what is true?',
        options: ['top already points to D, and D\'s node points to C', 'C\'s node points to D, so the new node is below C', 'D\'s node points to null, because top has not moved yet', 'D\'s node points to C, but top still points to C'], answer: 3,
        why: 'temp is the new node with D. <code>temp.next = top</code> links it to the current top, C. Only the next line moves top to D. The links always point down the stack, from newer to older nodes, so C never points to D.',
        lessons: ['04-linked-stacks'], skills: ['trace'], available_after: '04-linked-stacks', level: 2 }
    ],
    18: [
      { q: 'Push 1, 2, 3, 4, 5, 6 on an empty LinkedStack, then pop twice. What is the top element, and what is count?',
        options: ['top 2, count 4', 'top 4, count 4', 'top 6, count 6', 'top 4, count 6'], answer: 1,
        why: 'After the pushes the list is top → 6 → 5 → 4 → 3 → 2 → 1 (slide 18). Each pop removes the top node and decreases count: 6 and 5 leave, so top is 4 and count is 4. "top 2" takes from the bottom, like a queue.',
        lessons: ['04-linked-stacks'], skills: ['trace'], available_after: '04-linked-stacks', level: 1 }
    ],
    19: [
      { q: 'The stack has exactly one node, holding X. After `pop()`, what are top and count, and what is returned?',
        options: ['top = null, count = 0, returns null', 'top = the X node, count = 0, returns X', 'top = null, count = 0, returns X', 'It throws a RuntimeException'], answer: 2,
        why: 'next = top.next is null; element = X; the node is disconnected; top = next = null; count becomes 0; X is returned. The exception is only for a stack that is already empty before the pop.',
        lessons: ['04-linked-stacks'], skills: ['trace', 'edge_case'], available_after: '04-linked-stacks', level: 2 },
      { type: 'tf', q: 'If pop forgot `count--`, then after popping the last element, isEmpty() would still return false.', answer: true,
        why: 'isEmpty is <code>count == 0</code> (slide 20). Without count--, count stays 1 although top is null. A next pop would pass the isEmpty check and crash on <code>top.next</code> with a NullPointerException.',
        lessons: ['04-linked-stacks'], skills: ['bug'], available_after: '04-linked-stacks', level: 2 }
    ],
    20: [
      { type: 'output', q: 'With the slides\' LinkedStack, what does this print?',
        code: 'LinkedStack<String> s = new LinkedStack<>();\nSystem.out.println(s.peek());\ns.push("Z");\nSystem.out.println(s.peek() + s.size());',
        answer: 'null\nZ1',
        why: 'This peek returns <b>null</b> on an empty stack (it does not throw, unlike ArrayStack\'s peek). After push("Z"), peek gives "Z" and size gives 1; String + int joins them: Z1.',
        lessons: ['04-linked-stacks'], skills: ['trace', 'edge_case'], available_after: '04-linked-stacks', level: 2 }
    ]
  },
  parts: {
    0: [
      { q: 'In a linked list, what is `front`?',
        options: ['The first node itself, with its element and next link', 'The number of nodes, kept up to date by add and remove', 'The next field of the last node, which is null', 'A separate reference variable that points to the first node'], answer: 3,
        why: 'front is not a node: it is a variable that holds the address of the first node (slide 5). Without it, the list could not be reached at all.',
        lessons: ['04-linked-stacks'], skills: ['concept'], available_after: '04-linked-stacks', level: 1 },
      { type: 'tf', q: 'A linked structure must decide its capacity when it is created, like an array.', answer: false,
        why: 'Each node is a separate object created when it is needed, so a linked list grows one node at a time. Only arrays have a fixed capacity.',
        lessons: ['04-linked-stacks'], skills: ['concept'], available_after: '04-linked-stacks', level: 1 },
      { q: 'Which loop prints <b>every</b> name in the list that starts at `front`?',
        options: ['Person cur = front; while (cur.next != null) { print(cur.name); cur = cur.next; }', 'Person cur = front; while (cur != null) { print(cur.name); cur = cur.next; }', 'Person cur = front.next; while (cur != null) { print(cur.name); cur = cur.next; }', 'Person cur = front; while (cur != null) { cur = cur.next; print(cur.name); }'], answer: 1,
        why: 'Visit a node while cur is not null, then move on. Testing <code>cur.next != null</code> stops before printing the last node. Starting at front.next skips the first node. Moving before printing skips the first node and crashes when cur becomes null.',
        lessons: ['04-linked-stacks'], skills: ['trace', 'bug'], available_after: '04-linked-stacks', level: 2 },
      { q: 'p points to a Person whose name is "Rami". After `Person q = p; q.name = "Noor";` what is `p.name`?',
        options: ['"Noor"', '"Rami"', 'null', 'It does not compile'], answer: 0,
        why: '<code>q = p</code> copies the reference, not the object: p and q point to the same Person. Changing the name through q changes the one object, so p.name is "Noor".',
        lessons: ['04-linked-stacks'], skills: ['concept', 'trace'], available_after: '04-linked-stacks', level: 2 },
      { type: 'output', q: 'The list is a → b → c (names A, B, C). What does this print?',
        code: 'a.next = c;\nPerson cur = a;\nwhile (cur != null) {\n  System.out.print(cur.name);\n  cur = cur.next;\n}',
        answer: 'AC',
        why: 'a now points straight to c, so b is no longer in the list (nothing in the list points to it). The loop visits a, then c, then stops at null. This is how a node in the middle is removed: the link around it is changed.',
        lessons: ['04-linked-stacks'], skills: ['trace'], available_after: '04-linked-stacks', level: 2 }
    ],
    1: [
      { type: 'tf', q: 'To insert a node at the front of a linked list, all the other nodes must move one place.', answer: false,
        why: 'Only two links change: the new node points to the old front, and front points to the new node (slide 10). The other nodes stay where they are. Moving elements is what an <b>array</b> must do.',
        lessons: ['04-linked-stacks'], skills: ['concept'], available_after: '04-linked-stacks', level: 1 },
      { q: 'A list and an array both hold n elements. What is the cost of inserting a new element at the front?',
        options: ['Linked list O(n), array O(1)', 'Linked list O(1), array O(n)', 'Both O(1)', 'Both O(n)'], answer: 1,
        why: 'The linked list changes two references, whatever n is: O(1). The array must shift all n elements one cell to the right to free cell 0: O(n) (unit 2).',
        lessons: ['04-linked-stacks', '02-analysis-of-algorithms'], skills: ['complexity'], available_after: '04-linked-stacks', level: 2 },
      { type: 'trace', q: 'The list starts as front → K → M. Fill in the list after each step (names from front to the end, or "empty").',
        cols: ['step', 'list after the step'], rows: [['insert P at the front', '?P K M'], ['delete the front node', '?K M'], ['insert R at the front', '?R K M'], ['delete the front node', '?K M'], ['delete the front node', '?M'], ['delete the front node', '?empty']],
        why: 'Inserting and deleting both happen at the front: the newest node is always the first one. Deleting the last node makes front null: the list is empty.',
        lessons: ['04-linked-stacks'], skills: ['trace'], available_after: '04-linked-stacks', level: 2 },
      { q: 'A student deletes the front node with only `front = front.next;` (no `front.next = null`). Is the list correct afterwards?',
        options: ['Yes: front now points to the second node, and the list is right; the slide\'s extra line only disconnects the removed node', 'No: the second node is lost, because nothing points to it any more', 'No: front becomes null, because the old node still holds the link', 'No: the removed node is still the first node, because its next was not cut'], answer: 0,
        why: 'The list is read from front, and front now points to the second node, so the list is correct. The slide also sets the old node\'s next to null so that the removed node no longer points into the list. Nothing is lost.',
        lessons: ['04-linked-stacks'], skills: ['design'], available_after: '04-linked-stacks', level: 2 },
      { source: { assignment: 4, question: 1 },
        q: 'What the following code Fun is doing:',
        code: 'public static <T> Node<T> Fun(Node<T> head) {\nNode<T> newHead = null;\nNode<T> current = head;\nwhile (current != null) {\n    Node<T> newNode = new Node<>(current.data);\n    newNode.next = newHead;\n    newHead = newNode;\n    current = current.next;\n}\nreturn newHead;\n}',
        options: ['Copying a linked list into another linked list.', 'Sorting the data in a linked list.', 'Reversing a linked list into another linked list.'], answer: 2,
        why: 'For each node it makes a <b>new</b> node and inserts it at the front of the new list (newNode.next = newHead; newHead = newNode), like slide 10. Inserting at the front reverses the order: 1 → 2 → 3 gives 3 → 2 → 1. The old list is not changed, so it is a reversed copy, not a plain copy. No values are compared, so it does not sort.',
        lessons: ['04-linked-stacks'], skills: ['trace'], available_after: '04-linked-stacks', level: 2 },
      { source: { assignment: 4, question: 20 },
        q: 'We have two pointers \'slow\' and \'fast\' set at the head of a singly linked list. The loop while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; } executes. Which value does slow reference after the loop exits?',
        options: ['middle of the list', 'this program will crash', 'the loop will never break'], answer: 0,
        why: 'fast moves two nodes for every one node of slow, so when fast reaches the end, slow has done half the way: the middle. With 5 nodes slow stops at the 3rd; with 6 nodes at the 4th (the second of the two middles). It does not crash: fast.next is read only after checking fast != null, and fast.next.next is read only after checking fast.next != null. fast reaches null or the last node, so the loop ends.',
        lessons: ['04-linked-stacks'], skills: ['trace'], available_after: '04-linked-stacks', level: 2 },
      { source: { assignment: 4, question: 30 },
        q: 'What the following code Fun is doing:',
        code: 'public static <T> Node<T> Fun(Node<T> head) {\nNode<T> previous = null;\nNode<T> current = head;\nwhile (current != null) {\n    Node<T> nextNode = current.next;\n    current.next = previous;\n    previous = current;\n    current = nextNode;\n}\nreturn previous; // New head\n}',
        options: ['Going over each node so that it can be printed out', 'randomly changing pointers to mess up the list', 'Reverses the list', 'Create a copy of the entire list.'], answer: 2,
        why: 'No new node is created, so it is not a copy. Each node\'s next is turned to point to the node <b>before</b> it (previous), after saving the old next in nextNode so the rest is not lost. At the end the old last node is the new head: 1 → 2 → 3 becomes 3 → 2 → 1, in place.',
        lessons: ['04-linked-stacks'], skills: ['trace'], available_after: '04-linked-stacks', level: 3 }
    ],
    2: [
      { q: 'In the slides\' LinkedStack, where is the top of the stack?',
        options: ['At the last node of the list, the one whose next is null', 'At the first node of the list, the one `top` points to', 'In the middle of the list, so both ends are equally near', 'In an array cell, at the index that top holds'], answer: 1,
        why: 'push inserts at the front of the list and pop deletes the front node (slides 17 and 19), so the first node is the top. The last node is the bottom of the stack, the element pushed first.',
        lessons: ['04-linked-stacks'], skills: ['concept'], available_after: '04-linked-stacks', level: 1 },
      { source: { assignment: 3, question: 6 },
        q: 'A stack is implemented using a singly linked list with only a head pointer. Which design allows both push and pop to take O(1) time?',
        options: ['Push and pop at the head', 'Push and pop at the tail', 'Push at the head and pop at the tail', 'Push at the tail and pop at the head'], answer: 0,
        why: 'Both operations must work at the <b>same</b> end (LIFO), and the head is the only node we can reach at once: inserting and deleting at the head change two links, O(1). The tail can only be reached by walking the whole list, O(n). Pushing and popping at different ends would give a queue, not a stack.',
        lessons: ['04-linked-stacks', '02-analysis-of-algorithms'], skills: ['design', 'complexity'], available_after: '04-linked-stacks', level: 2 },
      { q: 'Start with an empty LinkedStack. Run: push("A"), push("B"), push("C"), pop(), push("D"), peek(), pop(), pop(). What do `peek()` and `size()` return now?',
        options: ['peek null, size 0', 'peek "B", size 2', 'peek "D", size 1', 'peek "A", size 1'], answer: 3,
        why: 'A, B, C → pop removes C → A, B → push D → A, B, D → peek only looks → pop removes D, pop removes B → only A is left: peek "A", size 1.',
        lessons: ['04-linked-stacks'], skills: ['trace'], available_after: '04-linked-stacks', level: 2 },
      { source: { assignment: 3, question: 11 },
        q: 'A student implements a stack using a singly linked list with head and tail pointers, placing the stack top at the tail. Why does pop generally take O(n) time?',
        options: ['The value at the tail cannot be read directly', 'The entire list must be copied into a new list', 'The predecessor of the tail must be found by traversal', 'Every node must have its value shifted'], answer: 2,
        why: 'After removing the tail, tail must point to the node <b>before</b> it, and its next must become null. In a singly linked list nodes only point forward, so that node is found only by walking from the head: O(n). The tail\'s value can be read at once through the tail pointer, and nothing is copied or shifted.',
        lessons: ['04-linked-stacks', '02-analysis-of-algorithms'], skills: ['complexity', 'design'], available_after: '04-linked-stacks', level: 2 },
      { type: 'multi', q: 'A LinkedStack holds n elements. Which operations are O(1)?',
        options: ['push', 'pop', 'peek', 'size', 'building a string of all the elements'], answer: [0, 1, 2, 3],
        why: 'push and pop change a few links at the top, peek reads top.element, and size returns count (kept up to date by push and pop). Only visiting every element, for a string of all of them, depends on n: O(n).',
        lessons: ['04-linked-stacks', '02-analysis-of-algorithms'], skills: ['complexity'], available_after: '04-linked-stacks', level: 2 },
      { q: 'Two LinkedStacks: s1 holds 1, 2, 3 (3 on top) and s2 is empty. After `while (!s1.isEmpty()) s2.push(s1.pop());` and then `s1.push(s2.pop());`, what are the tops of s1 and s2?',
        options: ['s1: 3, s2: 2', 's1: 3, s2: 1', 's1: 1, s2: 3', 's1: 1, s2: 2'], answer: 3,
        why: 'Popping s1 gives 3, 2, 1, so s2 becomes 3, 2, 1 with <b>1 on top</b>: moving reverses the order. s2.pop() then gives 1, which goes back on s1. s2 is left with 3, 2: its top is 2.',
        lessons: ['04-linked-stacks'], skills: ['trace'], available_after: '04-linked-stacks', level: 3 }
    ]
  }
});
