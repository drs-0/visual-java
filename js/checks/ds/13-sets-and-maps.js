/* Data Structures · Unit 13 Sets and Maps: questions under the slides and the part quizzes.
   Every question has lessons, skills, available_after and level (1 easy, 2 middle, 3 hard). The instructor's
   assignments have no questions for this unit, so all questions are written in his style (exact printed output,
   the slide code line by line, edge cases, bugs, combined with earlier units). Every printed HashSet / HashMap /
   TreeSet / TreeMap was run in Java with the real java.util classes (16 buckets, so the hash order is the real one),
   and every hash code was computed by String.hashCode(). No checks on the cover and the outline slides
   (1, 2, 11, 20, 28). The values differ from the drawing presets. */
addChecks({
  course: 'ds', lesson: '13-sets-and-maps',
  slides: {
    3: [
      { q: 'In the Java collections hierarchy of slide 3, which interface does <b>not</b> extend Collection?',
        options: ['Set', 'List', 'Map', 'Queue'], answer: 2,
        why: 'A Map holds (key, value) pairs, not single elements, so it has its own interface. HashMap, LinkedHashMap and TreeMap implement it.',
        lessons: ['13-sets-and-maps'], skills: ['concept'], available_after: '13-sets-and-maps', level: 1 }
    ],
    4: [
      { type: 'tf', q: 'A List cannot tell whether an element is in it.', answer: false,
        why: 'A list can (contains), but it checks the elements one by one: O(n). Slide 4: a set is made for this question and answers it faster.',
        lessons: ['06-lists', '13-sets-and-maps'], skills: ['concept'], available_after: '13-sets-and-maps', level: 1 }
    ],
    5: [
      { type: 'output', q: 'What does this print?',
        code: 'Set<String> a = new TreeSet<>();\nSystem.out.println(a.add("b") + " " + a.add("a") + " "\n    + a.add("b") + " " + a.size());',
        answer: 'true true false 2',
        why: 'add returns a boolean: true when the element was added, false when it was already there (the second "b"). The set holds a and b: size 2.',
        lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 2 },
      { type: 'match', q: 'Match each Set method with the set operation it performs on `s1` (with the collection `s2`).',
        pairs: [['s1.addAll(s2)', 'union: everything in s1 or s2'], ['s1.retainAll(s2)', 'intersection: only what is in both'], ['s1.removeAll(s2)', 'difference: s1 without the elements of s2']],
        why: 'Slide 5. All three change s1; s2 stays the same.',
        lessons: ['13-sets-and-maps'], skills: ['concept'], available_after: '13-sets-and-maps', level: 2 }
    ],
    6: [
      { type: 'output', q: 'A HashSet uses 16 buckets, and an Integer is placed in bucket value % 16 (for these small values). What does this print?',
        code: 'Set<Integer> s = new HashSet<>();\ns.add(40); s.add(17); s.add(33); s.add(40); s.add(2);\nSystem.out.println(s);',
        answer: '[17, 33, 2, 40]',
        why: 'Buckets: 40 → 8, 17 → 1, 33 → 1 (a collision: it goes after 17), 2 → 2. The second 40 is not added. Printing walks the buckets 0 to 15: 17, 33, then 2, then 40.',
        lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 3 }
    ],
    7: [
      { type: 'output', q: 'What does this print?',
        code: 'Set<Integer> t = new TreeSet<>();\nt.add(40); t.add(17); t.add(33); t.add(40); t.add(2);\nSystem.out.println(t + " " + t.remove(33) + " " + t.remove(33) + " " + t);',
        answer: '[2, 17, 33, 40] true false [2, 17, 40]',
        why: 'The string is built from left to right: first the sorted set, then remove(33) (true: it was there), then remove(33) again (false: already gone), then the set without 33.',
        lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 2 }
    ],
    8: [
      { type: 'output', q: 'What does this print?',
        code: 'Set<Integer> s1 = new HashSet<>();\ns1.add(5); s1.add(1); s1.add(9); s1.add(3);\nSet<Integer> s2 = new TreeSet<>();\ns2.add(9); s2.add(3); s2.add(7);\nSet<Integer> s3 = new TreeSet<>();\ns3.add(3); s3.add(9);\ns1.retainAll(s2);\nSystem.out.println(s1 + " " + s1.equals(s3) + " " + s2.equals(s3));',
        answer: '[3, 9] true false',
        why: 'retainAll keeps only 3 and 9 in s1 (in buckets 3 and 9). s1 and s3 hold the same elements, so they are equal although one is a HashSet and the other a TreeSet. s2 still has 7, so it is not equal to s3.',
        lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 3 }
    ],
    9: [
      { q: 'What is the cost of contains for a TreeSet with n elements?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], answer: 1,
        why: 'A TreeSet is a balanced binary search tree: contains walks one path from the root, like the BST search of unit 11.',
        lessons: ['11-binary-search-trees', '13-sets-and-maps'], skills: ['complexity'], available_after: '13-sets-and-maps', level: 1 }
    ],
    10: [
      { q: 'A program adds and removes many user names, and often prints them all in alphabetical order. Which set fits best?',
        options: ['HashSet, because it is faster', 'TreeSet, because it keeps the elements in order', 'An array', 'Any set: they all print sorted'], answer: 1,
        why: 'Slide 10: use TreeSet when the order matters. A HashSet would have to be copied and sorted before every print.',
        lessons: ['13-sets-and-maps'], skills: ['design'], available_after: '13-sets-and-maps', level: 2 }
    ],
    12: [
      { type: 'tf', q: 'In a map, two different keys may map to the same value.', answer: true,
        why: 'Slide 12: keys must be unique, but multiple keys could map to the same value.',
        lessons: ['13-sets-and-maps'], skills: ['concept'], available_after: '13-sets-and-maps', level: 1 },
      { q: 'A map is empty. `put("A", 1)`, `put("B", 1)` and `put("A", 2)` run. What is its size, and what does get("A") return?',
        options: ['3 and 1', '2 and 2', '2 and 1', '3 and 2'], answer: 1,
        why: 'The second put with key "A" replaces the value; it does not add an entry. Two keys, A → 2 and B → 1.',
        lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 2 }
    ],
    13: [
      { q: 'In the map of slide 13 (id → name and address), what do you give to search, and what do you get?',
        options: ['Give the name, get the id', 'Give the key (id), get the mapped value (name, address)', 'Give the index, get the key', 'Give the value, get the key'], answer: 1,
        why: 'A map searches by key. Finding the key of a value would mean checking every entry.',
        lessons: ['13-sets-and-maps'], skills: ['concept'], available_after: '13-sets-and-maps', level: 1 }
    ],
    14: [
      { type: 'output', q: 'What does this print?',
        code: 'Map<String, Integer> m = new HashMap<>();\nSystem.out.println(m.put("x", 1) + " " + m.put("x", 2) + " "\n    + m.putIfAbsent("x", 3) + " " + m.putIfAbsent("y", 4) + " "\n    + m.get("x") + " " + m.remove("z"));',
        answer: 'null 1 2 null 2 null',
        why: 'put returns the old value (null, then 1). putIfAbsent("x", 3) does not replace: it returns the current value 2. putIfAbsent("y", 4) adds and returns null. get("x") is still 2. remove of a missing key returns null.',
        lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 3 }
    ],
    15: [
      { q: 'Why does keySet() return a <b>Set</b> but values() only a <b>Collection</b>?',
        options: ['Keys are unique, but values may repeat', 'Values are always sorted', 'Sets are faster', 'Keys may repeat'], answer: 0,
        why: 'A Set cannot hold duplicates. Two keys may have the same value, so the values need a collection that allows repeats.',
        lessons: ['13-sets-and-maps'], skills: ['concept'], available_after: '13-sets-and-maps', level: 2 }
    ],
    16: [
      { type: 'output', q: 'Person is the class of slide 16. What does this print?',
        code: 'Person p = new Person("Lina", "Taif");\nSystem.out.println("p = " + p);',
        answer: 'p = {Lina,Taif}',
        why: 'String + object calls toString(), which writes the name and address inside braces with a comma and no space.',
        lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 1 }
    ],
    17: [
      { type: 'output', q: 'Person is the class of slide 16. A HashMap has 16 buckets; "3" hashes to bucket 3, "12" to bucket 1 and "7" to bucket 7. What does this print?',
        code: 'Map<String, Person> h = new HashMap<>();\nh.put("3", new Person("Sami", "Abha"));\nh.put("12", new Person("Lina", "Taif"));\nh.put("7", new Person("Omar", "Hail"));\nSystem.out.println(h);',
        answer: '{12={Lina,Taif}, 3={Sami,Abha}, 7={Omar,Hail}}',
        why: 'A HashMap prints its entries bucket by bucket, from 0 to 15: "12" (bucket 1), then "3", then "7". Each entry prints as key=value, and the value uses Person.toString().',
        lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 3 }
    ],
    18: [
      { q: 'map1 has "5501" → p1. Then `Person p2 = map1.put("1234", p1);` runs. Which statement is true afterwards?',
        options: ['map1 has a second entry with key "1234"', '"1234" and "5501" map to the same Person object, and p2 is the old value of "1234"', 'p2 is p1', '"5501" is removed'], answer: 1,
        why: 'put on an existing key replaces the value and returns the old one. Two keys pointing to one value is allowed (slide 12).',
        lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 2 }
    ],
    19: [
      { type: 'output', q: 'What does this print?',
        code: 'Map<String, Integer> tm = new TreeMap<>();\ntm.put("200", 1);\ntm.put("35", 2);\ntm.put("1000", 3);\nSystem.out.println(tm);',
        answer: '{1000=3, 200=1, 35=2}',
        why: 'The keys are Strings, and Strings are compared character by character: "1" &lt; "2" &lt; "3". So "1000" comes first, although 1000 is the largest number.',
        lessons: ['13-sets-and-maps'], skills: ['trace', 'edge_case'], available_after: '13-sets-and-maps', level: 2 }
    ],
    21: [
      { q: 'Why is a set the right structure for the blocked domains?',
        options: ['The main question is "is this domain in the list?", which a set answers fast, and duplicates are not needed', 'Sets keep the file order', 'Sets can hold key-value pairs', 'A set is the only way to read a file'], answer: 0,
        why: 'Membership is the main job of a set (slide 4). A TreeSet answers it in O(log n) and also keeps the domains sorted for printing.',
        lessons: ['13-sets-and-maps'], skills: ['design'], available_after: '13-sets-and-maps', level: 1 }
    ],
    22: [
      { q: 'blocked.txt has the lines spam.net, bet.com and spam.net. What does printBlockedDomains() print?',
        options: ['spam.net, bet.com, spam.net', 'bet.com, spam.net', 'spam.net, bet.com', 'bet.com, spam.net, spam.net'], answer: 1,
        why: 'The TreeSet keeps the second spam.net out, and the for-each loop visits the elements in sorted order.',
        lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 2 }
    ],
    23: [
      { type: 'trace', q: 'The blocked set is {bet.com, spam.net}. The user types shop.com, then Bet.com, then spam.net, then done. Fill in what main does for each input: blocked, fine, or stop.',
        cols: ['input', 'result'],
        rows: [['shop.com', '?fine'], ['Bet.com', '?fine'], ['spam.net', '?blocked'], ['done', '?stop']],
        why: 'contains is case-sensitive: "Bet.com" is not "bet.com", so it is fine. Only the test for DONE uses equalsIgnoreCase, so "done" ends the loop.',
        lessons: ['13-sets-and-maps'], skills: ['trace', 'edge_case'], available_after: '13-sets-and-maps', level: 2 }
    ],
    24: [
      { q: 'In the word counter, what are the keys and what are the values of the map?',
        options: ['Keys: counts; values: words', 'Keys: words; values: integer counters', 'Keys: line numbers; values: words', 'Keys and values are both words'], answer: 1,
        why: 'Slide 24: words are the keys (unique), and each maps to how many times it was seen.',
        lessons: ['13-sets-and-maps'], skills: ['concept'], available_after: '13-sets-and-maps', level: 1 }
    ],
    25: [
      { type: 'output', q: 'analyzeDocument runs on a file that contains only the text below, then the entries of countWords are printed with `System.out.println(countWords);`. What is printed?',
        code: 'Hi, hi! Bye-bye 2 HI',
        lang: 'text',
        answer: '{bye=2, hi=3}',
        why: 'useDelimiter("[^a-zA-Z]+") splits at every run of non-letters (", ", "! ", "-", " 2 "), so the words are Hi, hi, Bye, bye, HI. toLowerCase merges them: hi 3 times, bye twice. The TreeMap prints the keys sorted.',
        lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 3 }
    ],
    26: [
      { q: 'countWords were a HashMap instead of a TreeMap. What would change in the output of main?',
        options: ['Nothing at all', 'The counts would be wrong', 'The entries would come in hash order, not sorted by word', 'It would not compile'], answer: 2,
        why: 'Only the order depends on the class: a TreeMap walks its keys in sorted order, a HashMap walks its buckets. The counts are the same.',
        lessons: ['13-sets-and-maps'], skills: ['concept'], available_after: '13-sets-and-maps', level: 2 }
    ],
    27: [
      { q: 'Which application of slide 27 maps variable names to memory places?',
        options: ['Caching', 'A compiler\'s symbol table', 'Machine learning', 'Web sessions'], answer: 1,
        why: 'A compiler keeps a symbol table: each variable name (the key) leads to its memory location (the value).',
        lessons: ['13-sets-and-maps'], skills: ['concept'], available_after: '13-sets-and-maps', level: 1 }
    ],
    29: [
      { q: 'What is a <b>collision</b> in hashing?',
        options: ['Two equal keys in one map', 'Two different elements mapped to the same location of the hash table', 'A table that is full', 'A hash code below zero'], answer: 1,
        why: 'Slide 29. A perfect hash function would give every element its own place; in practice collisions happen and must be handled.',
        lessons: ['13-sets-and-maps'], skills: ['concept'], available_after: '13-sets-and-maps', level: 1 }
    ],
    30: [
      { q: 'With the first-letter hash of slide 30 (A → 0 … Z → 25), where do "Kamal", "Lina" and "Khalid" go?',
        options: ['10, 11, 10: Kamal and Khalid collide', '11, 12, 11', '10, 11, 12: no collision', '0, 1, 2'], answer: 0,
        why: 'K is the 11th letter, so index 10; L is index 11. Kamal and Khalid both start with K: a collision at index 10.',
        lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 2 }
    ],
    31: [
      { q: 'A hash table has 20 cells and a load factor of 0.75. When it reaches 75% of its capacity, it is resized. How many entries is that?',
        options: ['12', '15', '16', '20'], answer: 1,
        why: '0.75 × 20 = 15 entries. A fuller table would have more collisions; an emptier one would waste memory.',
        lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 2 }
    ],
    32: [
      { q: 'Why does the hash table of slide 32 store the <b>key</b> next to the value?',
        options: ['To sort the table', 'Because different keys can reach the same index, so the key must be checked after jumping there', 'To compute the load factor', 'Keys are not stored'], answer: 1,
        why: 'The index alone does not prove it is the right entry. get compares the stored key with the one it was given (with equals).',
        lessons: ['13-sets-and-maps'], skills: ['concept'], available_after: '13-sets-and-maps', level: 2 }
    ],
    33: [
      { q: 'Person (slide 16) does not override equals or hashCode. Two objects `new Person("Ali", "Hail")` are added to a HashSet. What is its size?',
        options: ['1', '2', '0', 'It throws an exception'], answer: 1,
        why: 'Without overriding, equals compares references and hashCode comes from Object (based on memory). The two objects are different objects, so both are kept.',
        lessons: ['13-sets-and-maps'], skills: ['edge_case'], available_after: '13-sets-and-maps', level: 2 }
    ],
    34: [
      { q: 'What is `"Hi".hashCode()`? (The character code of H is 72 and of i is 105.)',
        options: ['177', '2337', '3327', '7305'], answer: 1,
        why: 's[0] × 31 + s[1] = 72 × 31 + 105 = 2232 + 105 = 2337.',
        lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 2 },
      { q: 'Which two strings have the <b>same</b> hash code? (Codes: A 65, B 66, C 67, a 97, b 98.)',
        options: ['"Ab" and "BC"', '"Ab" and "bA"', '"AB" and "BA"', '"ab" and "AB"'], answer: 0,
        why: '"Ab" = 65 × 31 + 98 = 2113 and "BC" = 66 × 31 + 67 = 2113. Raising the first character by 1 adds 31, and lowering the second by 31 takes it back. "AB" (2081) and "BA" (2111) differ: position matters.',
        lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 3 }
    ],
    35: [
      { type: 'tf', q: 'If a.hashCode() == b.hashCode(), then a.equals(b) must be true.', answer: false,
        why: 'Slide 35: the rule only goes one way. Equal objects must have equal codes, but unequal objects may share a code ("Ab" and "BC").',
        lessons: ['13-sets-and-maps'], skills: ['concept'], available_after: '13-sets-and-maps', level: 2 }
    ],
    36: [
      { q: 'Which line of the slide\'s Course class is a real mistake?',
        options: ['int number;', 'return (prefix == c.prefix && number == c.number);', 'String prefix;', 'return prefix.hashCode() + number;'], answer: 1,
        why: '== compares String <b>references</b>: two equal prefixes read from input may be different objects. It should be <code>prefix.equals(c.prefix)</code>. (Also, equals should take an Object, and hashCode must be public.)',
        lessons: ['13-sets-and-maps'], skills: ['bug'], available_after: '13-sets-and-maps', level: 3 }
    ],
    37: [
      { q: 'A hash table has N = 16 cells. Which index does the key "Hi" (hash code 2337) get with `Math.abs(key.hashCode() % N)`?',
        options: ['1', '7', '15', '146'], answer: 0,
        why: '2337 = 146 × 16 + 1, so the remainder is 1.',
        lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 2 },
      { q: 'A key\'s hash code is −17 and N = 5. What index does `Math.abs(key.hashCode() % N)` give?',
        options: ['3', '2', '−2', '17'], answer: 1,
        why: 'In Java the remainder keeps the sign of the left side: −17 % 5 = −2. Math.abs turns it into 2, a valid index.',
        lessons: ['13-sets-and-maps'], skills: ['edge_case'], available_after: '13-sets-and-maps', level: 3 }
    ],
    38: [
      { q: 'A chained hash table has N = 7 cells and Integer keys (hash code = value). 10, 3, 17, 24 and 5 are put in it. How long is the longest chain, and how many cells stay empty?',
        options: ['Longest 4; 5 cells empty', 'Longest 2; 3 cells empty', 'Longest 5; 6 cells empty', 'Longest 1; 2 cells empty'], answer: 0,
        why: '10 % 7 = 3, 3 % 7 = 3, 17 % 7 = 3, 24 % 7 = 3, 5 % 7 = 5. Cell 3 holds a list of 4 entries, cell 5 one entry, and the other 5 cells are empty. A get on cell 3 may compare 4 keys.',
        lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 2 }
    ]
  },
  parts: {
    0: [
      { type: 'tf', q: 'A set never holds two equal elements.', answer: true,
        why: 'Slide 4: a set is a collection with no duplicates. add returns false for an element that is already there.',
        lessons: ['13-sets-and-maps'], skills: ['concept'], available_after: '13-sets-and-maps', level: 1 },
      { q: 'Which set always prints its elements in sorted order?',
        options: ['HashSet', 'TreeSet', 'Both', 'Neither'], answer: 1,
        why: 'A TreeSet is a balanced BST and prints in-order. A HashSet prints in bucket order.',
        lessons: ['13-sets-and-maps'], skills: ['concept'], available_after: '13-sets-and-maps', level: 1 },
      { type: 'output', q: 'What does this print?',
        code: 'Set<String> ts = new TreeSet<>();\nts.add("pear"); ts.add("Apple"); ts.add("fig");\nSystem.out.println(ts);',
        answer: '[Apple, fig, pear]',
        why: 'Strings compare by character codes, and all capital letters (A = 65) come before small letters (f = 102, p = 112).',
        lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 2 },
      { type: 'multi', q: 'A HashSet holds 4 and 8. Which of these calls return <b>false</b>?',
        options: ['add(4)', 'add(5)', 'remove(9)', 'contains(8)', 'remove(8)'], answer: [0, 2],
        why: 'add(4): already there. remove(9): not there. add(5), contains(8) and remove(8) all return true.',
        lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 2 },
      { type: 'output', q: 'A HashSet has 16 buckets and puts an Integer in bucket value % 16 (for these small values). What does this print?',
        code: 'Set<Integer> s = new HashSet<>();\nfor (int v : new int[]{50, 18, 34, 2}) s.add(v);\nSystem.out.println(s);',
        answer: '[50, 18, 34, 2]',
        why: '50, 18, 34 and 2 all land in bucket 2 (50 = 3 × 16 + 2 …), so they are chained there in the order they were added. With a TreeSet the output would be sorted: [2, 18, 34, 50].',
        lessons: ['13-sets-and-maps'], skills: ['trace', 'edge_case'], available_after: '13-sets-and-maps', level: 3 },
      { q: 'A sorted array with binary search (unit 9) and a TreeSet both hold n numbers. Which statement is true?',
        options: ['Both find a number in O(log n), but adding a number is O(n) for the array and O(log n) for the TreeSet', 'Both add in O(1)', 'The array is faster at everything', 'The TreeSet searches in O(n)'], answer: 0,
        why: 'Searching halves the problem in both. But a sorted array must shift elements to make room for a new one, while the balanced tree only adds one leaf (and maybe rotates).',
        lessons: ['09-searching-and-sorting', '13-sets-and-maps'], skills: ['complexity'], available_after: '13-sets-and-maps', level: 3 }
    ],
    1: [
      { type: 'tf', q: '`get` on a key that is not in the map returns null.', answer: true,
        why: 'Slide 14: get returns the mapped value, or null if there is no mapping for the key.',
        lessons: ['13-sets-and-maps'], skills: ['concept'], available_after: '13-sets-and-maps', level: 1 },
      { q: 'Which call adds an entry only if the key is not in the map yet?',
        options: ['put', 'putAll', 'putIfAbsent', 'containsKey'], answer: 2,
        why: 'putIfAbsent never replaces an existing value; it returns the current value instead.',
        lessons: ['13-sets-and-maps'], skills: ['concept'], available_after: '13-sets-and-maps', level: 1 },
      { type: 'output', q: 'What does this print?',
        code: 'Map<String, Integer> m = new TreeMap<>();\nm.put("b", 2); m.put("a", 1); m.put("b", 3);\nm.putIfAbsent("a", 9); m.remove("c");\nSystem.out.println(m + " " + m.size());',
        answer: '{a=1, b=3} 2',
        why: 'The second put for "b" replaces 2 with 3. putIfAbsent("a", 9) keeps 1. remove("c") finds nothing. The TreeMap prints its keys sorted.',
        lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 2 },
      { type: 'output', q: 'A HashMap has 16 buckets and puts an Integer key in bucket key % 16 (for these small keys). What does this print?',
        code: 'Map<Integer, String> hm = new HashMap<>();\nhm.put(20, "a"); hm.put(4, "b"); hm.put(36, "c"); hm.put(4, "d");\nSystem.out.println(hm + " " + hm.size());',
        answer: '{20=a, 4=d, 36=c} 3',
        why: '20, 4 and 36 all land in bucket 4 and are chained in the order they were put. The last put finds key 4 in the chain and only replaces its value: no new entry, size 3.',
        lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 3 },
      { type: 'output', q: 'keySet() returns a <b>view</b> of the map (slide 18). What does this print? ("12" is in bucket 1, "7" in bucket 7.)',
        code: 'Map<String, String> h = new HashMap<>();\nh.put("3", "x"); h.put("12", "y"); h.put("7", "z");\nSet<String> k = h.keySet();\nh.remove("3");\nSystem.out.println(k + " " + h.values());',
        answer: '[12, 7] [y, z]',
        why: 'k was taken before the remove, but it is not a copy: it shows the map as it is now, without "3".',
        lessons: ['13-sets-and-maps'], skills: ['trace', 'edge_case'], available_after: '13-sets-and-maps', level: 3 }
    ],
    2: [
      { type: 'tf', q: 'In the domain blocker, typing "DONE", "done" or "Done" ends the loop.', answer: true,
        why: 'main tests <code>domain.equalsIgnoreCase("DONE")</code>.',
        lessons: ['13-sets-and-maps'], skills: ['concept'], available_after: '13-sets-and-maps', level: 1 },
      { q: 'In analyzeDocument, what does `countWords.get(word) == null` mean?',
        options: ['The word is empty', 'The word has not been counted yet', 'The file is empty', 'The count is 0'], answer: 1,
        why: 'get returns null for a key that is not in the map, so this is the first time the word is seen: put(word, 1).',
        lessons: ['13-sets-and-maps'], skills: ['concept'], available_after: '13-sets-and-maps', level: 1 },
      { type: 'trace', q: 'analyzeDocument runs on a file with the text "To be, or not to be: that is it. TO BE!". Fill in the final counts (0 if the word is not a key).',
        cols: ['word', 'be', 'to', 'it', 'or', 'that'],
        rows: [['count', '?3', '?3', '?1', '?1', '?1']],
        why: 'Every run of non-letters separates words, so the punctuation never becomes part of a word ("it." counts as "it"). toLowerCase merges To, to, TO (3) and be, be, BE (3). The map also holds is=1 and not=1.',
        lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 2 },
      { type: 'bug', q: 'This analyzeDocument loop counts every word as 1, however often it appears. Tap the line with the mistake.',
        code: 'while (scan.hasNext()) {\n  String word = scan.next().toLowerCase();\n  if (countWords.get(word) == null) { countWords.put(word, 1); }\n  else {\n    Integer count = countWords.get(word);\n    countWords.put(word, count);\n  }\n}',
        answer: 6,
        why: 'The old count is put back unchanged. The slide writes <code>countWords.put(word, count+1);</code>: put on an existing key replaces its value with the new count.',
        lessons: ['13-sets-and-maps'], skills: ['bug'], available_after: '13-sets-and-maps', level: 2 },
      { q: 'The word counter must also report each word\'s count in the order the words <b>first appear</b> in the file. Which change does that with the least work?',
        options: ['Use a TreeMap (already used)', 'Use a HashMap', 'Use a LinkedHashMap, which keeps insertion order (slide 3)', 'Sort the file first'], answer: 2,
        why: 'A TreeMap sorts by word and a HashMap uses bucket order. LinkedHashMap, in the hierarchy of slide 3, remembers the order in which the keys were first put.',
        lessons: ['13-sets-and-maps'], skills: ['design'], available_after: '13-sets-and-maps', level: 3 }
    ],
    3: [
      { type: 'tf', q: 'The hash code of an Integer object is equal to its value.', answer: true,
        why: 'Slide 34: for an Integer object, the hash code is its value. That is why small Integers spread so simply over the buckets.',
        lessons: ['13-sets-and-maps'], skills: ['concept'], available_after: '13-sets-and-maps', level: 1 },
      { q: 'What does chaining store in each cell of the hash table?',
        options: ['One entry only', 'A linked list of all the entries whose keys map to that index', 'The hash code', 'A sorted array'], answer: 1,
        why: 'Slide 37: with chaining, colliding entries share the cell through a linked list (unit 6).',
        lessons: ['06-lists', '13-sets-and-maps'], skills: ['concept'], available_after: '13-sets-and-maps', level: 1 },
      { q: '"Ok".hashCode() is 2556. Which index does it get in a table of N = 10 cells?',
        options: ['6', '5', '25', '0'], answer: 0,
        why: 'Math.abs(2556 % 10) = 6.',
        lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 2 },
      { q: 'A class overrides equals (two objects with the same id are equal) but not hashCode. What can go wrong in a HashSet?',
        options: ['Nothing', 'Two equal objects get different hash codes, land in different cells, and the set keeps both', 'equals is never called', 'The set becomes sorted'], answer: 1,
        why: 'The set first uses the hash code to choose a cell, and only compares with equals inside that cell. Equal objects in different cells are never compared.',
        lessons: ['13-sets-and-maps'], skills: ['design', 'edge_case'], available_after: '13-sets-and-maps', level: 2 },
      { type: 'trace', q: 'A chained hash table has N = 7 cells and Integer keys. 15, 8, 22, 4 and 29 are put in it. Fill in how many entries each cell holds.',
        cols: ['cell', '0', '1', '2', '3', '4', '5', '6'],
        rows: [['entries', '?0', '?4', '?0', '?0', '?1', '?0', '?0']],
        why: '15 % 7 = 1, 8 % 7 = 1, 22 % 7 = 1, 29 % 7 = 1, and 4 % 7 = 4. These keys all differ by multiples of 7, so they collide: a get for 29 may walk the whole chain of 4. A table size that does not divide the gaps in the keys spreads them better.',
        lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 3 },
      { q: 'Each cell of a chained hash table keeps its entries in a linked list. All n keys land in the same cell. What does get cost?',
        options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 2,
        why: 'get computes the index in O(1), but then must walk the one chain of n entries, comparing keys with equals: like a linked-list search.',
        lessons: ['06-lists', '13-sets-and-maps'], skills: ['complexity', 'edge_case'], available_after: '13-sets-and-maps', level: 3 }
    ]
  }
});
