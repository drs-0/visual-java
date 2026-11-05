/* Data Structures · Unit 7 Iterators: questions under the slides and the part quizzes.
   Every question has lessons, skills, available_after and level (1 easy, 2 middle, 3 hard). The instructor's
   assignments have no questions for this unit, so all questions are written in his style (tracing exact state,
   implementation reasoning, edge cases, bugs, combined structures). No checks on the cover and the outline slides
   (1, 2, 7, 15, 24). Numbers and names differ from the drawing presets. */
addChecks({
  course: 'ds', lesson: '07-iterators',
  slides: {
    3: [
      { q: 'What is an iterator?',
        options: ['An object, separate from the collection, that lets the user go through the elements of the collection one at a time', 'A loop variable of type int that counts from 0 to size() − 1', 'A method of the collection that sorts its elements before they are used', 'A copy of the collection that can be changed without changing the original'], answer: 0,
        why: 'Slide 3: an iterator works with a collection but is defined as a separate object. It is not a copy and does not sort: it only hands out the elements, one by one.',
        lessons: ['07-iterators'], skills: ['concept'], available_after: '07-iterators', level: 1 }
    ],
    4: [
      { type: 'multi', q: 'In the diagram of slide 4, which of these are <b>interfaces</b>?',
        options: ['Iterable', 'Collection', 'LinkedList', 'Deque', 'ArrayDeque'], answer: [0, 1, 3],
        why: 'Interfaces are blue: Iterable, Collection, Queue, List, Set, Deque, SortedSet. LinkedList and ArrayDeque are classes (green) that implement them. Because every collection is below Iterable, all of them can be iterated.',
        lessons: ['07-iterators'], skills: ['concept'], available_after: '07-iterators', level: 1 }
    ],
    5: [
      { q: 'A class wants its objects to be used in a for-each loop. Which method must it provide?',
        options: ['hasNext(), which tells the loop if there are more elements', 'iterator(), the only method of the Iterable interface', 'next(), which gives the loop the next element', 'size(), which tells the loop how many times to run'], answer: 1,
        why: 'A collection is iterable if it implements iterator() of Iterable (slide 5). iterator() returns an Iterator object, and that object has hasNext() and next().',
        lessons: ['07-iterators'], skills: ['concept'], available_after: '07-iterators', level: 1 }
    ],
    6: [
      { type: 'output', q: 'What does this print?',
        code: 'List<String> list = new LinkedList<>();\nlist.add("p");\nlist.add("q");\nlist.add("r");\nIterator<String> it = list.iterator();\nit.next();\nit.next();\nSystem.out.println(it.next());\nSystem.out.println(it.hasNext());',
        answer: 'r\nfalse',
        why: 'Each next() returns the next element and moves on: p, q, then r. After r there are no more elements, so hasNext() returns false.',
        lessons: ['07-iterators'], skills: ['trace'], available_after: '07-iterators', level: 1 },
      { q: 'Which element does `remove()` of an iterator delete?',
        options: ['The first element of the collection', 'The element that the next call of next() would return', 'The last element of the collection', 'The current element: the one returned by the last call of next()'], answer: 3,
        why: 'Slide 6: remove() deletes the current element, the one just accessed with next(). That is why next() must be called before remove().',
        lessons: ['07-iterators'], skills: ['concept'], available_after: '07-iterators', level: 2 }
    ],
    8: [
      { q: 'In the list built on slide 8, at which indexes is "Hadi"?',
        options: ['0 and 1', '0, 4 and 8', '1, 2, 5 and 9', '0, 1, 4 and 8'], answer: 3,
        why: 'The adds go to the rear in order: Hadi (0), Hadi (1), Rakan (2), Turki (3), Hadi (4), Ibrahim (5), Omar (6), Mostafa (7), Hadi (8). Four Hadis, two of them next to each other.',
        lessons: ['07-iterators'], skills: ['trace'], available_after: '07-iterators', level: 1 }
    ],
    9: [
      { q: 'Way-1 prints a <b>LinkedList</b> of n elements with `list.get(i)` in a loop. What is the cost of the whole loop?',
        options: ['O(n), because each get(i) takes one step', 'O(1), because get(i) uses an index', 'O(n²), because each get(i) walks through the nodes to index i', 'O(log n), because get(i) halves the list each time'], answer: 2,
        why: 'Slide 9: "indexing a linked list implementation in a loop is inefficient". Each get(i) is O(n) (like nodeAt in unit 6), and the loop calls it n times: O(n²). On an ArrayList the same loop is O(n).',
        lessons: ['06-lists', '07-iterators', '02-analysis-of-algorithms'], skills: ['complexity'], available_after: '07-iterators', level: 2 }
    ],
    10: [
      { type: 'fill', q: 'Complete Way-2 (slide 10).',
        code: 'Iterator<String> itr = list.___();\nwhile (itr.___()) {\n  System.out.println(itr.___());\n}',
        answer: ['iterator', 'hasNext', 'next'],
        why: 'iterator() gives a new iterator; hasNext() asks if an element is left; next() returns it and moves on. Calling next() only once per loop is important: a second call would skip an element.',
        lessons: ['07-iterators'], skills: ['concept'], available_after: '07-iterators', level: 1 },
      { q: 'Why is Way-2 more efficient than Way-1 on a linked list?',
        options: ['Because an iterator copies the list into an array first, and arrays are fast', 'Because the iterator remembers its place (the current node), so each next() moves one link: O(1) per element', 'Because an iterator skips some elements, so it does less work', 'Because hasNext() sorts the list, so the elements are found faster'], answer: 1,
        why: 'The iterator keeps a reference to where it is, so it never starts again from the front. n elements cost O(n) in total, instead of O(n²) with get(i).',
        lessons: ['07-iterators', '02-analysis-of-algorithms'], skills: ['complexity', 'design'], available_after: '07-iterators', level: 2 }
    ],
    11: [
      { q: 'Which of these jobs <b>cannot</b> be done with a for-each loop?',
        options: ['Removing some elements through the iterator while looping', 'Adding up all the elements', 'Printing every element', 'Counting the elements equal to "Hadi"'], answer: 0,
        why: 'The for-each loop uses an iterator internally, but it hides that iterator, so its remove() cannot be called (slide 11). Reading every element is fine.',
        lessons: ['07-iterators'], skills: ['concept'], available_after: '07-iterators', level: 1 }
    ],
    12: [
      { q: 'A class does not implement Iterable. Which way can loop over its elements?',
        options: ['Only a for-each loop, because it does not need an iterator', 'Only an Iterator object, made with new Iterator()', 'Both a for-each loop and an Iterator object, as for any collection', 'Neither of them; only the class\'s own methods (such as get(i)) can be used'], answer: 3,
        why: 'Slide 12: without Iterable there is no iterator() method, so there is no Iterator object, and the for-each loop (which needs one) does not compile either.',
        lessons: ['07-iterators'], skills: ['concept', 'edge_case'], available_after: '07-iterators', level: 2 },
      { q: 'You must delete every empty string from a list while you go through it. What should you use?',
        options: ['A for-each loop with list.remove(s)', 'A for-each loop with a break', 'An Iterator object and its remove() method', 'Way-1 with a second list'], answer: 2,
        why: 'Slide 12: use an Iterator object when you want to call remove. The for-each loop does not give access to remove, and changing the list behind its back throws a ConcurrentModificationException.',
        lessons: ['07-iterators'], skills: ['design'], available_after: '07-iterators', level: 1 }
    ],
    13: [
      { type: 'output', q: 'What does this print?',
        code: 'List<String> list = new LinkedList<>();\nlist.add("Ali");\nlist.add("Hadi");\nlist.add("Hadi");\nlist.add("Sara");\nIterator<String> iter = list.iterator();\nwhile (iter.hasNext()) {\n  String s = iter.next();\n  System.out.println(s);\n  if (s.equals("Hadi")) iter.remove();\n}\nSystem.out.println(list);',
        answer: 'Ali\nHadi\nHadi\nSara\n[Ali, Sara]',
        why: 'Every element is printed once, before the if, also the two Hadis. Each Hadi is removed right after it is printed. The two Hadis next to each other are both caught: removing through the iterator does not skip an element.',
        lessons: ['07-iterators'], skills: ['trace'], available_after: '07-iterators', level: 2 },
      { q: 'The index loop `for (int i = 0; i < list.size(); i++) if (list.get(i).equals("Hadi")) list.remove(i);` misses a Hadi when two are next to each other. Why does the iterator loop of slide 13 not miss it?',
        options: ['Because the iterator keeps its own position correct after a removal, so the element that moved into the gap is still the next one returned', 'Because iter.remove() deletes every Hadi in the list at once, also the ones that come later', 'Because the iterator goes backward from the end, so the shifting never affects it', 'Because next() is slower than get(i) and waits until the shifting is finished'], answer: 0,
        why: 'With the index loop, the next element slides into index i, but i++ jumps over it. The iterator\'s remove() adjusts the iterator\'s own position (in the slides\' ArrayList it does next--), so the following next() returns the element that moved into the gap.',
        lessons: ['06-lists', '07-iterators'], skills: ['bug', 'design'], available_after: '07-iterators', level: 3 }
    ],
    14: [
      { q: 'What happens?',
        code: 'List<String> list = new ArrayList<>();\nlist.add("A");\nlist.add("B");\nlist.add("C");\nfor (String s : list)\n  if (s.equals("B")) list.add("Z");\nSystem.out.println(list);',
        options: ['It prints [A, B, C, Z], because Z is added at the end', 'It prints [A, B, Z, C], because Z is added after B', 'A ConcurrentModificationException is thrown', 'The loop never ends, because the list keeps growing'], answer: 2,
        why: 'The for-each loop uses an iterator. list.add changes the list while that iterator is in use, and the Java API iterators are fail-fast (slide 14): the next step of the iterator notices the change and throws.',
        lessons: ['07-iterators'], skills: ['trace', 'edge_case'], available_after: '07-iterators', level: 2 },
      { type: 'tf', q: 'For a list, an iterator usually delivers the elements in the list\'s linear order, from index 0 to the end.', answer: true,
        why: 'Slide 14: an iterator makes no general promise about order, but a list has a linear order, so its iterator typically follows it.',
        lessons: ['07-iterators'], skills: ['concept'], available_after: '07-iterators', level: 1 }
    ],
    16: [
      { type: 'tf', q: 'The ArrayList we wrote in unit 6 (slides 24-29) can be used in a for-each loop.', answer: false,
        why: 'Slide 16: that class implements only our List&lt;T&gt;, not Iterable&lt;T&gt;, and has no iterator() method, so for-each does not compile. The revised class adds <code>implements List&lt;T&gt;, Iterable&lt;T&gt;</code> and iterator().',
        lessons: ['06-lists', '07-iterators'], skills: ['concept'], available_after: '07-iterators', level: 1 },
      { q: 'Two for-each loops run one after the other over the same list. Why does the second loop also start at the first element?',
        options: ['Because the first loop resets the list to its first element when it ends', 'Because hasNext() goes back to index 0 when it reaches the end of the list', 'Because each loop calls iterator(), which returns a <b>new</b> ArrayListIterator whose next index starts at 0', 'It does not: the second loop prints nothing, because the iterator is finished'], answer: 2,
        why: 'iterator() is <code>return new ArrayListIterator();</code>. Every loop gets its own fresh iterator with next = 0. The first iterator is finished, but it is simply not used any more.',
        lessons: ['07-iterators'], skills: ['design'], available_after: '07-iterators', level: 2 }
    ],
    17: [
      { q: 'Why is ArrayListIterator a <b>private</b> class inside ArrayList?',
        options: ['Because Java does not allow a public class inside another class', 'Because private classes run faster than public ones', 'Because an iterator must not have any public methods', 'Because it is used only by the iterator() method of ArrayList; other code only sees the Iterator interface'], answer: 3,
        why: 'Slide 17: the class is used only by iterator(). Users write <code>Iterator&lt;T&gt; it = list.iterator();</code> and never need the class name.',
        lessons: ['07-iterators'], skills: ['design'], available_after: '07-iterators', level: 1 }
    ],
    18: [
      { q: 'Why is ArrayListIterator an <b>inner</b> (non-static) class, while Node&lt;T&gt; is a nested static class?',
        options: ['Because inner classes cannot be private, so only the iterator can use the list\'s fields', 'Because the iterator must read the fields of its own list object (array, count, modCount); a node needs nothing from the list', 'Because Node<T> is generic, and a generic class must always be static', 'There is no reason: both classes could be written either way'], answer: 1,
        why: 'An inner class object is tied to an outer object and can use all its members (slide 18). The iterator needs the array and the counters of the list that created it. A node only stores its element and links, so it can exist on its own.',
        lessons: ['07-iterators'], skills: ['design'], available_after: '07-iterators', level: 2 },
      { type: 'tf', q: 'A nested <b>static</b> class can read the private instance fields `array` and `count` of its outer ArrayList object.', answer: false,
        why: 'A nested static class has no outer object, so it can only access the static members of the outer class (slide 18). Reading array and count needs an inner class.',
        lessons: ['07-iterators'], skills: ['concept'], available_after: '07-iterators', level: 2 }
    ],
    19: [
      { q: 'Why does the revised ArrayList keep a modCount field?',
        options: ['So that an iterator can find out that the list was changed (by add or remove) while the iterator is in use', 'To count how many elements the list holds, so that size() is O(1)', 'To count how many times next() was called on all the iterators', 'To decide when the array is full and must grow to twice its size'], answer: 0,
        why: 'count is the number of elements. modCount counts the modifications done by add and remove; an iterator compares it with its own copy and throws if they differ (slides 19 and 21).',
        lessons: ['07-iterators'], skills: ['concept'], available_after: '07-iterators', level: 1 }
    ],
    20: [
      { q: 'A new revised ArrayList runs: `add(A)`, `add(B)`, `remove(0)`, `add(0, C)`, `set(0, X)`, `get(1)`. What is modCount?',
        options: ['3', '4', '5', '6'], answer: 1,
        why: 'Only the add and remove methods increase modCount (slides 19-20): add, add, remove, add = 4. set changes an element but not the structure of the list, and get changes nothing.',
        lessons: ['07-iterators'], skills: ['trace'], available_after: '07-iterators', level: 2 }
    ],
    21: [
      { q: 'A revised ArrayList had 5 adds and 1 remove. Then `list.iterator()` is called. What are next, itrCount and canRemove of the new iterator?',
        options: ['5, 6, true', '0, 0, false', '0, 6, false', '1, 6, false'], answer: 2,
        why: 'The fields start with <code>next = 0</code>, <code>itrCount = modCount</code> (5 + 1 = 6) and <code>canRemove = false</code>. remove() is not allowed until next() has been called.',
        lessons: ['07-iterators'], skills: ['trace'], available_after: '07-iterators', level: 2 }
    ],
    22: [
      { type: 'trace', q: 'An ArrayListIterator goes over a list holding K, L, M. Fill in what each call returns and the value of next after it.',
        cols: ['call', 'returns', 'next'],
        rows: [['hasNext()', '?true', '?0'], ['next()', '?K', '?1'], ['next()', '?L', '?2'], ['hasNext()', '?true', '?2'], ['next()', '?M', '?3'], ['hasNext()', '?false', '?3']],
        why: 'hasNext() only compares next &lt; count, so it never moves. next() returns <code>array[next++]</code>: the element at the old index, then next grows by one. At next = 3 = count, hasNext() is false.',
        lessons: ['07-iterators'], skills: ['trace'], available_after: '07-iterators', level: 2 },
      { q: 'A student writes `return array[++next];` in next() instead of `return array[next++];`. What goes wrong?',
        options: ['Nothing: both forms return the same element', 'hasNext() always returns false after the first call', 'The last element is returned twice at the end', 'The first element is skipped: the first call returns array[1]'], answer: 3,
        why: '++next increases next <b>before</b> reading, so the first call reads index 1. The iterator skips array[0] and, on its last call, reads array[count], which is not an element (null).',
        lessons: ['07-iterators'], skills: ['bug', 'trace'], available_after: '07-iterators', level: 3 }
    ],
    23: [
      { q: 'Why does remove() do `next--` before `ArrayList.this.remove(next)`?',
        options: ['Because ArrayList.this.remove counts the indexes from 1, not from 0, so next must first be lowered by one', 'To go back to the first element of the list, so that the loop can start again from the front after the removal', 'Because next points one past the element returned by next(); the current element is at next − 1, and after the removal the following element shifts into that index', 'To make hasNext() return false right after the removal, so that the loop stops and no element is skipped'], answer: 2,
        why: 'After next() returned array[i], next is i + 1. The element to remove is at i, so next-- first. The removal shifts the later elements left, so index i now holds the element that comes next: the iterator\'s position is right again.',
        lessons: ['07-iterators'], skills: ['design'], available_after: '07-iterators', level: 3 },
      { type: 'tf', q: 'The iterator\'s remove() increases itrCount because `ArrayList.this.remove(next)` has increased modCount.', answer: true,
        why: 'The list\'s remove counts the change in modCount. The iterator made that change itself, so it adds one to itrCount too; the two counts stay equal and no exception is thrown.',
        lessons: ['07-iterators'], skills: ['concept'], available_after: '07-iterators', level: 2 }
    ],
    25: [
      { q: 'What must our LinkedList class have so that `for (String s : myList)` compiles?',
        options: ['A method get(int index) that the loop calls for each index', 'A static Node class with element and next fields', 'A field modCount that counts the changes to the list', '`implements Iterable<T>` and an iterator() method that returns a LinkedListIterator'], answer: 3,
        why: 'Slide 25: like the ArrayList, the revised LinkedList implements Iterable&lt;T&gt; and its iterator() returns <code>new LinkedListIterator()</code>. The for-each loop calls that method.',
        lessons: ['07-iterators'], skills: ['concept'], available_after: '07-iterators', level: 1 }
    ],
    26: [
      { q: 'A LinkedListIterator is created for an <b>empty</b> list. What does its first hasNext() return?',
        options: ['true', 'It throws a NullPointerException', 'false, because node = front = null', 'It throws a ConcurrentModificationException'], answer: 2,
        why: 'The constructor sets node = front, which is null for an empty list. hasNext() returns node != null: false. A for-each loop over an empty list therefore does nothing.',
        lessons: ['07-iterators'], skills: ['edge_case'], available_after: '07-iterators', level: 1 }
    ],
    27: [
      { q: 'An iterator goes over the list A ⇄ B ⇄ C. After two calls of next(), what does the field node point to?',
        options: ['C', 'B', 'A', 'null'], answer: 0,
        why: 'next() saves node.element, then moves <code>node = node.next</code>. The first call returns A and moves to B; the second returns B and moves to C. So node always points to the element that will be returned next.',
        lessons: ['07-iterators'], skills: ['trace'], available_after: '07-iterators', level: 1 },
      { q: 'The same iterator calls next() a third and a fourth time. What happens?',
        options: ['The third returns C; the fourth returns A again', 'The third returns null', 'The third returns C; the fourth throws a NoSuchElementException', 'Both throw'], answer: 2,
        why: 'The third call returns C and node becomes null. The fourth call starts with <code>if (!hasNext()) throw new NoSuchElementException();</code>. An iterator does not wrap around.',
        lessons: ['07-iterators'], skills: ['edge_case'], available_after: '07-iterators', level: 2 }
    ],
    28: [
      { q: 'Why does remove() use `(node == null) ? rear : node.prev` to find the node to delete?',
        options: ['Because node points one past the element returned by next(); after the last element node is null, and then the node to delete is the rear', 'Because the rear is always the node to delete, and node is only used when the list has one element', 'Because prev is null for every node, so node.prev cannot be used to find the node', 'To delete two nodes at once: the rear and the node before node'], answer: 0,
        why: 'The node to delete holds the element returned by the last next(), which is just before node. When that element was the last one, node is null and null.prev would throw, so the code uses rear.',
        lessons: ['07-iterators'], skills: ['design', 'edge_case'], available_after: '07-iterators', level: 3 },
      { q: 'An iterator over A ⇄ B ⇄ C ⇄ D calls next(), next(), remove(). Which node is removed, and what does the following next() return?',
        options: ['B is removed; next() returns D', 'C is removed; next() returns D', 'A is removed; next() returns B', 'B is removed; next() returns C'], answer: 3,
        why: 'After two calls, B was returned and node points to C. remove() deletes node.prev = B. node still points to C, so the next call returns C.',
        lessons: ['07-iterators'], skills: ['trace'], available_after: '07-iterators', level: 2 }
    ],
    29: [
      { q: 'An iterator is in use. Then the list\'s own `remove(0)` is called (not the iterator\'s remove). What happens at the iterator\'s next hasNext()?',
        options: ['It returns true as usual, because the iterator still has elements', 'It throws a ConcurrentModificationException, because removeNode increased modCount but itrCount did not change', 'It throws a NoSuchElementException, because the element it pointed to is gone', 'It throws an IllegalStateException, because remove() was not called on the iterator'], answer: 1,
        why: 'removeNode ends with modCount++. Only the iterator\'s own remove() also does itrCount++. So the counts differ, and hasNext() throws.',
        lessons: ['07-iterators'], skills: ['trace', 'edge_case'], available_after: '07-iterators', level: 2 }
    ],
    30: [
      { q: 'An iterator over A ⇄ B ⇄ C calls next() three times and then remove(). Which node is removed, and what is rear now?',
        options: ['C; rear = B', 'C; rear = null', 'B; rear = C', 'A; rear = C'], answer: 0,
        why: 'After the third next(), C was returned and node is null, so remove() deletes rear = C. In removeNode, C is the rear, so <code>rear = prev</code> = B, and B.next becomes null.',
        lessons: ['07-iterators'], skills: ['trace', 'edge_case'], available_after: '07-iterators', level: 2 }
    ]
  },
  parts: {
    0: [
      { type: 'tf', q: 'An iterator is defined as an object separate from the collection it goes through.', answer: true,
        why: 'Slide 3: it works with a collection but is a separate object. That is why one collection can have several iterators.',
        lessons: ['07-iterators'], skills: ['concept'], available_after: '07-iterators', level: 1 },
      { q: 'Which Iterator method returns an element <b>and</b> moves the iterator forward?',
        options: ['hasNext()', 'iterator()', 'next()', 'remove()'], answer: 2,
        why: 'next() returns the next element and moves on. hasNext() only asks; iterator() belongs to Iterable and creates the iterator; remove() deletes the current element.',
        lessons: ['07-iterators'], skills: ['concept'], available_after: '07-iterators', level: 1 },
      { q: 'Two iterators, it1 and it2, are created from the same list [a, b]. Then `it1.next()` runs. What does `it2.next()` return?',
        options: ['b', 'a', 'null', 'It throws an exception'], answer: 1,
        why: 'Each iterator keeps its own position. it1 has moved past a, but it2 has not moved yet, so it starts with a. Reading does not change the list.',
        lessons: ['07-iterators'], skills: ['concept', 'trace'], available_after: '07-iterators', level: 2 },
      { type: 'output', q: 'What does this print?',
        code: 'List<Integer> list = new LinkedList<>();\nlist.add(3);\nlist.add(6);\nlist.add(9);\nIterator<Integer> it = list.iterator();\nit.next();\nit.remove();\nSystem.out.println(it.next() + " " + list);',
        answer: '6 [6, 9]',
        why: 'The first next() returns 3, and remove() deletes that current element. The next call returns the following element, 6, and the list is now [6, 9].',
        lessons: ['07-iterators'], skills: ['trace'], available_after: '07-iterators', level: 2 },
      { q: 'A `Queue<Integer> q = new LinkedList<>();` gets `add(4)`, `add(8)`, `add(2)`. In which order does `for (int x : q)` give the elements?',
        options: ['4, 8, 2', '2, 8, 4', '2, 4, 8', '8, 4, 2'], answer: 0,
        why: 'Queue extends Collection, which extends Iterable, so a queue can be iterated. The LinkedList keeps the elements in list order, which for a queue is front to rear: 4, 8, 2. Iterating does not dequeue anything.',
        lessons: ['05-queues', '07-iterators'], skills: ['trace'], available_after: '07-iterators', level: 2 }
    ],
    1: [
      { type: 'tf', q: 'A for-each loop uses an iterator internally.', answer: true,
        why: 'Slide 11: internally the for-each loop calls iterator(), then hasNext() and next(). That is why it works on any Iterable collection.',
        lessons: ['07-iterators'], skills: ['concept'], available_after: '07-iterators', level: 1 },
      { q: 'Which way to traverse a list gives a ConcurrentModificationException when `list.remove(s)` is called inside it?',
        options: ['All three ways', 'Way-1, get(i) with an index', 'None of the three ways', 'Way-3, the for-each loop'], answer: 3,
        why: 'The for-each loop has a hidden iterator; list.remove changes the list behind it, and the fail-fast iterator throws. Way-1 uses no iterator, so there is nothing to detect the change (it can skip elements instead).',
        lessons: ['07-iterators'], skills: ['concept', 'edge_case'], available_after: '07-iterators', level: 1 },
      { q: 'A list holds n elements. What do Way-1 (get(i)) and Way-2 (an iterator) cost on a <b>LinkedList</b>?',
        options: ['O(n) and O(n)', 'O(n²) and O(n)', 'O(n) and O(n²)', 'O(n²) and O(n²)'], answer: 1,
        why: 'Each get(i) on a linked list walks to index i, so the n calls add up to O(n²). The iterator moves one link per next(): O(n) in total. On an ArrayList both are O(n).',
        lessons: ['06-lists', '07-iterators', '02-analysis-of-algorithms'], skills: ['complexity'], available_after: '07-iterators', level: 2 },
      { type: 'output', q: 'What does this print?',
        code: 'List<String> list = new ArrayList<>();\nlist.add("Omar");\nlist.add("Ali");\nlist.add("Nora");\nlist.add("Zaid");\nlist.add("Lin");\nIterator<String> iter = list.iterator();\nwhile (iter.hasNext()) {\n  String s = iter.next();\n  if (s.length() > 3) iter.remove();\n}\nSystem.out.println(list);',
        answer: '[Ali, Lin]',
        why: 'The names with more than 3 letters (Omar, Nora, Zaid) are removed through the iterator. Nora and Zaid are next to each other, and both are removed: the iterator does not skip after a removal.',
        lessons: ['07-iterators'], skills: ['trace'], available_after: '07-iterators', level: 2 },
      { q: 'What happens?',
        code: 'List<String> list = new ArrayList<>();\nlist.add("Hadi");\nlist.add("Rakan");\nlist.add("Turki");\nfor (String s : list)\n  if (s.equals("Hadi")) list.remove(s);\nSystem.out.println(list);',
        options: ['A ConcurrentModificationException is thrown', 'It prints [Hadi, Rakan, Turki]', 'It prints [Rakan, Turki]', 'It does not compile'], answer: 0,
        why: 'list.remove(s) changes the list while the for-each loop\'s hidden iterator is in use. At its next step the fail-fast iterator sees the change and throws. Use an Iterator and iter.remove() instead (slide 13).',
        lessons: ['07-iterators'], skills: ['bug', 'trace'], available_after: '07-iterators', level: 2 },
      { type: 'output', q: 'This loop removes every element that is smaller than the element returned just before it. What does it print?',
        code: 'List<Integer> list = new LinkedList<>();\nlist.add(5);\nlist.add(2);\nlist.add(8);\nlist.add(2);\nlist.add(7);\nIterator<Integer> it = list.iterator();\nint last = it.next();\nwhile (it.hasNext()) {\n  int x = it.next();\n  if (x < last) it.remove();\n  last = x;\n}\nSystem.out.println(list);',
        answer: '[5, 8, 7]',
        why: 'last = 5. x = 2 &lt; 5: removed, last = 2. x = 8: kept, last = 8. x = 2 &lt; 8: removed, last = 2. x = 7 &gt; 2: kept. Note that last is the element <b>returned</b> before, even if it was removed, so 7 is compared with 2, not with 8.',
        lessons: ['07-iterators'], skills: ['trace'], available_after: '07-iterators', level: 3 }
    ],
    2: [
      { type: 'tf', q: 'The revised ArrayList implements both List&lt;T&gt; and Iterable&lt;T&gt;.', answer: true,
        why: '<code>public class ArrayList&lt;T&gt; implements List&lt;T&gt;, Iterable&lt;T&gt;</code> (slide 16). A class can implement several interfaces.',
        lessons: ['07-iterators'], skills: ['concept'], available_after: '07-iterators', level: 1 },
      { q: 'Which kind of nested class can be created without an object of the outer class?',
        options: ['An inner class', 'A nested static class', 'Both', 'Neither'], answer: 1,
        why: 'Slide 18: a nested static class object exists on its own. An inner class object always belongs to an outer object, like an ArrayListIterator belongs to its list.',
        lessons: ['07-iterators'], skills: ['concept'], available_after: '07-iterators', level: 1 },
      { q: 'An iterator calls next() and then remove() <b>twice</b> in a row. What happens on the second remove()?',
        options: ['It removes the element before the current one', 'It does nothing, because that element is already gone', 'It throws a ConcurrentModificationException, because modCount changed', 'It throws an IllegalStateException, because the first remove() set canRemove to false'], answer: 3,
        why: 'remove() ends with canRemove = false, and only next() sets it to true again. One next() allows one remove().',
        lessons: ['07-iterators'], skills: ['edge_case'], available_after: '07-iterators', level: 2 },
      { type: 'trace', q: 'An ArrayListIterator goes over P, Q, R (count = 3). Fill in what each call returns, next, and count.',
        cols: ['call', 'returns', 'next', 'count'],
        rows: [['next()', '?P', '?1', '?3'], ['remove()', '?-', '?0', '?2'], ['next()', '?Q', '?1', '?2'], ['next()', '?R', '?2', '?2'], ['hasNext()', '?false', '?2', '?2']],
        why: 'remove() does next-- (back to 0) and removes index 0; Q and R shift left, so count = 2. The next call returns array[0] = Q, then R. At next = 2 = count, hasNext() is false. remove() returns nothing (void): write "-".',
        lessons: ['07-iterators'], skills: ['trace'], available_after: '07-iterators', level: 2 },
      { q: 'An ArrayListIterator is in use. The program then calls the list\'s own `add(e)`. What happens at the iterator\'s next hasNext()?',
        options: ['It throws a ConcurrentModificationException', 'It returns true, because there is a new element', 'It throws an IllegalStateException', 'It returns false'], answer: 0,
        why: 'add(e) does modCount++, but the iterator\'s itrCount stays the same. hasNext() starts with <code>if (itrCount != modCount) throw new ConcurrentModificationException();</code>.',
        lessons: ['07-iterators'], skills: ['trace'], available_after: '07-iterators', level: 2 },
      { type: 'bug', q: 'This remove() of ArrayListIterator deletes the wrong element. Tap the line with the mistake.',
        code: 'public void remove() {\n  if (itrCount != modCount)\n    throw new ConcurrentModificationException();\n  if (!canRemove) throw new IllegalStateException();\n  next++;\n  ArrayList.this.remove(next);\n  itrCount++;\n  canRemove = false;\n}',
        answer: 5,
        why: 'The current element is at next − 1, so the slide does <code>next--</code>. With next++ the iterator removes the element two places after the current one (or throws at the end of the list), and it then skips an element.',
        lessons: ['07-iterators'], skills: ['bug'], available_after: '07-iterators', level: 3 },
      { q: 'A student forgets `itrCount++;` in the iterator\'s remove(). What happens in the loop of slide 13 after the first Hadi is removed?',
        options: ['Nothing changes: the loop removes every Hadi as before', 'The next hasNext() throws a ConcurrentModificationException, although the iterator itself made the change', 'All the Hadis are removed at once by the first remove()', 'The loop never ends, because next stays at the same index'], answer: 1,
        why: 'ArrayList.this.remove increases modCount. Without itrCount++, the counts differ, and the iterator treats its own removal as a change from outside.',
        lessons: ['07-iterators'], skills: ['bug', 'trace'], available_after: '07-iterators', level: 3 }
    ],
    3: [
      { type: 'tf', q: 'A new LinkedListIterator starts with node = front.', answer: true,
        why: 'The constructor sets <code>node = front;</code>, <code>itrCount = modCount;</code> and <code>canRemove = false;</code> (slide 26).',
        lessons: ['07-iterators'], skills: ['concept'], available_after: '07-iterators', level: 1 },
      { q: 'An iterator over P ⇄ Q ⇄ R calls next() and then remove(). What are front and the list now?',
        options: ['front = P; list P, R', 'front = Q; list Q, R', 'front = R; list R', 'front = null; list empty'], answer: 1,
        why: 'next() returned P and node moved to Q. remove() deletes node.prev = P, the front node, so removeNode sets <code>front = next</code> = Q.',
        lessons: ['07-iterators'], skills: ['trace'], available_after: '07-iterators', level: 2 },
      { type: 'trace', q: 'An iterator goes over A ⇄ B ⇄ C ⇄ D. Fill in what each call returns and the list after it.',
        cols: ['call', 'returns', 'list'],
        rows: [['next()', 'A', 'A B C D'], ['next()', '?B', '?A B C D'], ['remove()', '?-', '?A C D'], ['next()', '?C', '?A C D'], ['remove()', '?-', '?A D'], ['hasNext()', '?true', '?A D']],
        why: 'Each remove() deletes node.prev, the node just returned: first B, then C. After the second removal node still points to D, so hasNext() is true. remove() returns nothing: write "-".',
        lessons: ['07-iterators'], skills: ['trace'], available_after: '07-iterators', level: 2 },
      { type: 'bug', q: 'This remove() of LinkedListIterator crashes when the element just returned was the last one. Tap the line that causes it.',
        code: 'public void remove() {\n  if (itrCount != modCount)\n    throw new ConcurrentModificationException();\n  if (!canRemove) throw new IllegalStateException();\n  Node<T> prev = node.prev;\n  removeNode(prev);\n  itrCount++;\n  canRemove = false;\n}',
        answer: 5,
        why: 'After the last element, node is null, and <code>node.prev</code> throws a NullPointerException. The slide writes <code>(node==null)? rear : node.prev</code>.',
        lessons: ['07-iterators'], skills: ['bug', 'edge_case'], available_after: '07-iterators', level: 3 },
      { q: 'An iterator removes every "Hadi" from a list of n names. What does the whole loop cost on our LinkedList, and on our ArrayList in the worst case?',
        options: ['O(n) on both', 'O(n²) on both', 'O(n²) on the LinkedList, O(n) on the ArrayList', 'O(n) on the LinkedList, O(n²) on the ArrayList'], answer: 3,
        why: 'The LinkedList iterator\'s remove() only relinks the neighbours (removeNode): O(1), so the loop is O(n). The ArrayList iterator calls remove(index), which shifts the later elements: O(n) per removal, O(n²) when many names are Hadi.',
        lessons: ['06-lists', '07-iterators', '02-analysis-of-algorithms'], skills: ['complexity'], available_after: '07-iterators', level: 3 }
    ]
  }
});
