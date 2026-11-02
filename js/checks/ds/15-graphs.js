/* Data Structures · Unit 15 Graphs: questions under the slides and the part quizzes.
   Every question has lessons, skills, available_after and level (1 easy, 2 middle, 3 hard). The instructor's
   assignments have no questions for this unit, so all questions are written in his style (exact BFS / DFS order with
   the slides' adjacency-matrix code, queue and stack states, the matrix itself, MST with a minheap of edges,
   cheapest paths, combined with earlier units). Every traversal was run in Java with the slides' iteratorBFS and
   iteratorDFS (neighbours checked in index order); MST and cheapest-path steps come from the unit's own engine.
   No checks on the cover, the chapter scope and the "End of Fall" slide (1, 2, 37). Graphs differ from the presets.
   Graph G1 (undirected, vertices added in the order A, B, C, D, E, F): A-B, A-C, B-D, C-D, C-E, D-F, E-F.
   Network W (undirected, vertices P, Q, R, S, T): P-Q 4, P-R 2, Q-R 1, Q-S 5, R-S 8, R-T 10, S-T 2. */
addChecks({
  course: 'ds', lesson: '15-graphs',
  slides: {
    3: [
      { type: 'tf', q: 'In an undirected graph, (A, B) and (B, A) are the same edge.', answer: true,
        why: 'Slide 3: the pairings of an undirected graph are unordered.',
        lessons: ['15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 1 }
    ],
    4: [
      { q: 'Graph G1 has the vertices A to F and the edges A-B, A-C, B-D, C-D, C-E, D-F, E-F. Which vertices are adjacent to C?',
        options: ['A, D and E', 'A and B', 'D, E and F', 'All the others'], answer: 0,
        why: 'Look for every edge that contains C: A-C, C-D and C-E.',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 1 }
    ],
    5: [
      { q: 'How many edges does a <b>complete</b> undirected graph with 6 vertices have (no self-loops)?',
        options: ['6', '12', '15', '30'], answer: 2,
        why: 'Every pair of vertices is joined once: 6 × 5 / 2 = 15. Graph G1 has 6 vertices but only 7 edges, so it is far from complete.',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 2 }
    ],
    6: [
      { q: 'In graph G1 (A-B, A-C, B-D, C-D, C-E, D-F, E-F), what is the length of the shortest path from A to F?',
        options: ['2', '3', '4', '6'], answer: 1,
        why: 'For example A → B → D → F or A → C → E → F: 3 edges (4 vertices − 1). F is not adjacent to A, B or C, so 2 edges are not enough.',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 2 }
    ],
    7: [
      { q: 'Graph G1 (A-B, A-C, B-D, C-D, C-E, D-F, E-F) is connected. Is there one edge whose removal makes it <b>not</b> connected?',
        options: ['No: every edge lies on a cycle, so another path always remains', 'Yes, A-B', 'Yes, D-F', 'Yes, any edge'], answer: 0,
        why: 'A-B-D-C-A and C-D-F-E-C are cycles that use all 7 edges. Removing one edge of a cycle still leaves the rest of the cycle as a path between its ends.',
        lessons: ['15-graphs'], skills: ['concept', 'edge_case'], available_after: '15-graphs', level: 3 }
    ],
    8: [
      { type: 'multi', q: 'Which of these are <b>cycles</b> in graph G1 (A-B, A-C, B-D, C-D, C-E, D-F, E-F)?',
        options: ['A-B-D-C-A', 'A-B-A', 'C-D-F-E-C', 'A-C-E-F-D-B-A', 'A-B-D-F'], answer: [0, 2, 3],
        why: 'A cycle comes back to its start without repeating an edge. A-B-A uses the edge A-B twice; A-B-D-F does not come back to A.',
        lessons: ['15-graphs'], skills: ['concept', 'trace'], available_after: '15-graphs', level: 2 }
    ],
    9: [
      { type: 'tf', q: 'In a directed graph, the edges (A, B) and (B, A) are two different edges.', answer: true,
        why: 'Slide 9: the edges are ordered pairs, so (A, B) goes from A to B and (B, A) from B to A.',
        lessons: ['15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 1 }
    ],
    10: [
      { type: 'multi', q: 'A directed graph has the edges A→B, B→C, C→A, C→D, D→E. From which vertices is there a path <b>to E</b>?',
        options: ['A', 'B', 'C', 'D', 'none'], answer: [0, 1, 2, 3],
        why: 'A → B → C → D → E, and every vertex of the cycle A, B, C can reach D. E itself has no outgoing edge, and the question asks for paths ending at E.',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 2 }
    ],
    11: [
      { type: 'multi', q: 'A directed graph without cycles has the edges A→B, A→C, B→D, C→D. Which orders put every vertex before the vertices its edges point to?',
        options: ['A, B, C, D', 'A, C, B, D', 'B, A, C, D', 'A, B, D, C', 'A, D, B, C'], answer: [0, 1],
        why: 'A must come before B and C, and both B and C before D. B and C have no edge between them, so either may come first.',
        lessons: ['15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 2 }
    ],
    12: [
      { q: 'The directed graph A→B, B→C, C→A, C→D, D→E is not connected (E reaches nothing). Which one new edge makes it connected?',
        options: ['E→A', 'A→E', 'D→C', 'B→A'], answer: 0,
        why: 'With E→A the arrows go round A → B → C → D → E → A, so every vertex can reach every other one. A→E or D→C still leaves E with no way out.',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 3 }
    ],
    13: [
      { q: 'In network W (P-Q 4, P-R 2, Q-R 1, Q-S 5, R-S 8, R-T 10, S-T 2), what is the weight of the path P → Q → S → T?',
        options: ['3', '9', '11', '17'], answer: 2,
        why: 'The weight of a path is the sum of its edges: 4 + 5 + 2 = 11.',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 1 }
    ],
    14: [
      { q: 'In network W (P-Q 4, P-R 2, Q-R 1, Q-S 5, R-S 8, R-T 10, S-T 2), what is the cheapest trip from P to S?',
        options: ['P → Q → S, 9', 'P → R → S, 10', 'P → R → Q → S, 8', 'P → R → T → S, 14'], answer: 2,
        why: '2 + 1 + 5 = 8 is cheaper than the direct-looking routes: the cheapest path may use more edges.',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 2 }
    ],
    15: [
      { q: 'In a directed network, X→Y costs 120 and Y→X costs 140. What does the round trip X → Y → X cost?',
        options: ['240', '260', '280', '120'], answer: 1,
        why: '120 + 140 = 260. Slide 15: in a directed network each direction has its own weight.',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 1 }
    ],
    16: [
      { q: 'A graph has 1000 vertices and only 2000 edges. Which representation uses far less memory?',
        options: ['The adjacency matrix: 1000 × 1000 booleans', 'Adjacency lists: about 2 × 2000 list entries', 'Both use the same', 'Neither can store it'], answer: 1,
        why: 'The matrix always has n² cells (one million), even when most are false. Lists store only the edges that exist (each undirected edge twice).',
        lessons: ['15-graphs'], skills: ['design', 'complexity'], available_after: '15-graphs', level: 2 }
    ],
    17: [
      { q: 'In the adjacency lists of graph G1 (A-B, A-C, B-D, C-D, C-E, D-F, E-F), what is D\'s list, and how many entries do all lists have together?',
        options: ['B, C, F; 14 entries', 'B, C, F; 7 entries', 'F; 7 entries', 'A, B, C, F; 14 entries'], answer: 0,
        why: 'D is in the edges B-D, C-D and D-F. Every undirected edge appears in two lists, so 7 edges give 14 entries.',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 2 }
    ],
    18: [
      { type: 'trace', q: 'Fill in row C of the adjacency matrix of graph G1 (A-B, A-C, B-D, C-D, C-E, D-F, E-F). Use T and F.',
        cols: ['row', 'A', 'B', 'C', 'D', 'E', 'F'],
        rows: [['C', '?T', '?F', '?F', '?T', '?T', '?F']],
        why: 'C is joined to A, D and E. [C][C] is F: there is no self-loop. Column C has the same values (the matrix is symmetric).',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 2 }
    ],
    19: [
      { q: 'The directed graph A→B, B→C, C→A, C→D, D→E is stored in an adjacency matrix. How many cells are true, and which row is all false?',
        options: ['5 true; row E', '10 true; row E', '5 true; row A', '10 true; no row'], answer: 0,
        why: 'A directed edge sets only one cell, [from][to]: 5 edges, 5 cells. E has no outgoing edges, so its row is all false (its column has one true, from D).',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 2 }
    ],
    20: [
      { q: 'What do the first two methods of GraphADT (slide 20) do?',
        options: ['Add and remove a vertex', 'Add and remove an edge', 'Traverse the graph', 'Return the size'], answer: 0,
        why: '<code>addVertex(T vertex)</code> and <code>removeVertex(T vertex)</code>. The edges come next, on slide 21.',
        lessons: ['15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 1 }
    ],
    21: [
      { q: 'What does `iteratorBFS(startVertex)` return?',
        options: ['A list of edges', 'An Iterator that gives the vertices in breadth-first order from startVertex', 'The number of vertices', 'A boolean'], answer: 1,
        why: 'Like the iterators of unit 7: the caller walks the result with hasNext() and next().',
        lessons: ['07-iterators', '15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 1 }
    ],
    22: [
      { q: 'What does `iteratorShortestPath(start, target)` give back?',
        options: ['The length of the path', 'An Iterator over the vertices of the shortest path, in order', 'A boolean', 'The cheapest weight'], answer: 1,
        why: 'Slide 22: an iterator that contains the shortest path between the two vertices.',
        lessons: ['15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 1 }
    ],
    23: [
      { q: 'For graph G1 (6 vertices, 7 edges), what does `size()` return?',
        options: ['6', '7', '13', '36'], answer: 0,
        why: 'Slide 23: size() returns the number of vertices in the graph.',
        lessons: ['15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 1 }
    ],
    24: [
      { q: 'A new Graph&lt;String&gt; is made with the constructor of slide 24. What is the size of its adjacency matrix?',
        options: ['0 × 0', '5 × 5', '10 × 10', '1 × 1'], answer: 1,
        why: 'DEFAULT_CAPACITY is 5: <code>new boolean[5][5]</code>, and the vertices array also has 5 places. numVertices starts at 0.',
        lessons: ['15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 1 }
    ],
    25: [
      { type: 'tf', q: 'addEdge(int, int) of slide 25 sets two cells of the matrix, so the Graph class stores undirected graphs.', answer: true,
        why: '<code>adjMatrix[index1][index2] = true;</code> and <code>adjMatrix[index2][index1] = true;</code>: the edge can be used both ways.',
        lessons: ['15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 1 },
      { q: 'The graph has the vertices A and B. What does `addEdge("A", "Z")` do?',
        options: ['Adds the vertex Z and the edge', 'Throws an exception', 'Nothing: Z has no index, so indexIsValid fails', 'Adds a self-loop on A'], answer: 2,
        why: 'getIndex("Z") finds no vertex (−1), so the test <code>indexIsValid(index1) &amp;&amp; indexIsValid(index2)</code> is false and the method silently does nothing.',
        lessons: ['15-graphs'], skills: ['edge_case'], available_after: '15-graphs', level: 2 }
    ],
    26: [
      { q: '12 vertices are added one by one to a new Graph (capacity 5). How many times does expandCapacity run, and what is the capacity at the end?',
        options: ['Twice; 20', 'Once; 10', 'Twice; 15', 'Three times; 40'], answer: 0,
        why: 'The test is <code>(numVertices + 1) == adjMatrix.length</code>. Adding the 5th vertex (numVertices 4): 5 → 10. Adding the 10th (numVertices 9): 10 → 20. 12 vertices then fit.',
        lessons: ['15-graphs'], skills: ['trace', 'edge_case'], available_after: '15-graphs', level: 3 }
    ],
    27: [
      { q: 'After expandCapacity, what is in the new cells of the larger matrix?',
        options: ['Copies of the old rows', 'false: Java\'s default for boolean, so no edges', 'null', 'true'], answer: 1,
        why: 'Only the part [0 … numVertices−1] is copied; every other cell of a new boolean array is false.',
        lessons: ['15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 2 }
    ],
    28: [
      { type: 'match', q: 'Match each question about a graph with the algorithm that answers it.',
        pairs: [['Visit every vertex once', 'a traversal'], ['Fewest edges from A to B', 'shortest path'], ['Cheapest way from A to B', 'least costly path'], ['Is every vertex reachable?', 'connectivity']],
        why: 'Slide 28. The traversals are the base of the others.',
        lessons: ['15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 1 }
    ],
    29: [
      { q: 'Which tree traversal does a <b>breadth-first</b> graph traversal behave like?',
        options: ['Pre-order', 'In-order', 'Post-order', 'Level-order'], answer: 3,
        why: 'Slide 29: breadth-first visits the vertices near the start first, like level-order; depth-first behaves like pre-order.',
        lessons: ['10-trees', '15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 1 }
    ],
    30: [
      { type: 'trace', q: 'BFS runs on graph G1 (vertices A to F in this order; A-B, A-C, B-D, C-D, C-E, D-F, E-F) from A. Fill in the vertex dequeued in each round and the queue afterwards (front → rear).',
        cols: ['round', 'dequeued', 'queue after'],
        rows: [['1', '?A', '?B C'], ['2', '?B', '?C D'], ['3', '?C', '?D E'], ['4', '?D', '?E F'], ['5', '?E', '?F'], ['6', '?F', '?empty']],
        why: 'A enqueues B and C. B enqueues D. C finds A and D already marked, so it enqueues only E. D enqueues F. E and F find nothing new. Result: A, B, C, D, E, F.',
        lessons: ['05-queues', '15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 2 }
    ],
    31: [
      { q: 'In iteratorBFS, why is a vertex marked visited when it is <b>enqueued</b>, not when it is dequeued?',
        options: ['So that it can never be put in the queue twice by two different neighbours', 'To save memory', 'Because dequeue is slow', 'It makes no difference'], answer: 0,
        why: 'If marking waited until dequeue, a vertex with two visited neighbours could be enqueued twice and appear twice in the result.',
        lessons: ['15-graphs'], skills: ['design'], available_after: '15-graphs', level: 2 }
    ],
    32: [
      { q: 'What does iteratorBFS give for graph G1 (vertices A to F in this order; A-B, A-C, B-D, C-D, C-E, D-F, E-F) started at D?',
        options: ['D, B, C, F, A, E', 'D, B, A, C, E, F', 'D, F, C, B, E, A', 'D, B, C, A, E, F'], answer: 0,
        why: 'Row D is checked in index order: B, C, F are enqueued. B adds A. C adds E (A is marked). The result is the enqueue order. The second option is the DFS from D.',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 2 }
    ],
    33: [
      { q: 'In the 9-vertex graph of slide 33 (1-2, 1-3, 1-4, 2-4, 2-5, 3-6, 4-6, 5-7, 5-8, 6-9, 7-9, 8-9), which vertices are adjacent to 6?',
        options: ['3, 4 and 9', '3 and 9', '4, 5 and 9', '1, 3 and 4'], answer: 0,
        why: 'The edges with 6 are 3-6, 4-6 and 6-9.',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 1 }
    ],
    34: [
      { q: 'BFS runs on the graph of slide 33 from vertex 4 (neighbours in number order). What is the result?',
        options: ['4, 1, 2, 6, 3, 5, 9, 7, 8', '4, 1, 2, 3, 5, 6, 9, 7, 8', '4, 1, 3, 6, 9, 7, 5, 2, 8', '4, 2, 1, 6, 5, 3, 9, 8, 7'], answer: 0,
        why: '4 enqueues 1, 2, 6. 1 adds 3; 2 adds 5; 6 adds 9 (3 is marked). 3 adds nothing, 5 adds 7 and 8, 9 adds nothing new.',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 2 }
    ],
    35: [
      { q: 'BFS runs on the graph of slide 33 from vertex 7. Which vertex comes <b>last</b>?',
        options: ['3', '1', '4', '8'], answer: 0,
        why: 'The result is 7, 5, 9, 2, 8, 6, 1, 4, 3. 1, 4 and 3 are all 3 edges away from 7, but 1 and 4 are enqueued by 2, which is dequeued before 6, the vertex that enqueues 3.',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 3 }
    ],
    36: [
      { q: 'In a social network graph, what are the vertices and the edges?',
        options: ['Vertices: people; edges: relationships', 'Vertices: messages; edges: people', 'Vertices: roads; edges: cities', 'Vertices: pixels; edges: genes'], answer: 0,
        why: 'Slide 36: nodes represent individuals and edges represent relationships between them.',
        lessons: ['15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 1 }
    ],
    38: [
      { q: 'Which two changes turn the breadth-first algorithm into the depth-first one (slide 38)?',
        options: ['Use a stack instead of a queue, and mark a vertex visited only when it is added to the result', 'Use a heap and sort the vertices', 'Start at the last vertex', 'Use recursion and a queue'], answer: 0,
        why: 'Slide 38: replace the queue with a stack; a vertex is marked when it is added to the iterator.',
        lessons: ['03-stacks', '15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 1 }
    ],
    39: [
      { type: 'tf', q: 'In iteratorDFS, the start vertex is added to the result before the loop begins.', answer: true,
        why: 'Slide 39: push startIndex, <code>resultList.addToRear(vertices[startIndex])</code>, and mark it, all before the while loop.',
        lessons: ['15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 1 }
    ],
    40: [
      { type: 'trace', q: 'DFS runs on graph G1 (vertices A to F in this order; A-B, A-C, B-D, C-D, C-E, D-F, E-F) from A. In each round, fill in the top vertex looked at, whether it pushes or pops, and the vertex pushed ("-" for a pop).',
        cols: ['round', 'top', 'push/pop', 'pushed'],
        rows: [['1', 'A', 'push', '?B'], ['2', '?B', '?push', '?D'], ['3', '?D', '?push', '?C'], ['4', '?C', '?push', '?E'], ['5', '?E', '?push', '?F'], ['6', '?F', '?pop', '?-']],
        why: 'Each round takes the <b>first</b> unvisited neighbour of the top in index order: B of A, D of B, then C of D (A and B are visited), E of C, F of E. F has none left: pop. The result is A, B, D, C, E, F; the next rounds only pop.',
        lessons: ['03-stacks', '15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 3 }
    ],
    41: [
      { q: 'The directed graph A→B, B→C, C→A, C→D, D→E is tested with the rule of slide 41. Which BFS is the first to show that it is not connected?',
        options: ['The BFS from A, which reaches only 4 vertices', 'The BFS from D, which reaches only D and E', 'None: it is connected', 'The BFS from B'], answer: 1,
        why: 'The BFS from A, B and C each reach all 5 vertices. The BFS from D gives D, E (2 of 5), so the graph is not connected. A directed graph needs the test from every vertex.',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 3 }
    ],
    42: [
      { q: 'How many edges does a spanning tree of graph G1 (6 vertices, 7 edges) have?',
        options: ['5', '6', '7', '4'], answer: 0,
        why: 'A spanning tree keeps all n vertices with n − 1 edges: 5. Two edges of G1 must be left out (one from each cycle).',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 2 }
    ],
    43: [
      { type: 'tf', q: 'A connected graph that is already a tree has exactly one spanning tree: itself.', answer: true,
        why: 'Slide 42: removing any edge of a tree disconnects it, so all its edges must stay.',
        lessons: ['15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 1 }
    ],
    44: [
      { q: 'What is the total weight of the minimum spanning tree of network W (P-Q 4, P-R 2, Q-R 1, Q-S 5, R-S 8, R-T 10, S-T 2)?',
        options: ['10', '9', '12', '14'], answer: 0,
        why: 'The MST uses Q-R 1, P-R 2, S-T 2 and Q-S 5: 10. P-Q 4 is left out: Q and P are already joined through R more cheaply.',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 2 }
    ],
    45: [
      { type: 'trace', q: 'The MST algorithm of slide 45 runs on network W (P-Q 4, P-R 2, Q-R 1, Q-S 5, R-S 8, R-T 10, S-T 2) from P, with a minheap of edges. Fill in each edge removed from the heap, its weight, and whether it is added or skipped.',
        cols: ['removeMin', 'edge', 'weight', 'added?'],
        rows: [['1', '?P-R|R-P', '?2', '?yes'], ['2', '?R-Q|Q-R', '?1', '?yes'], ['3', '?P-Q|Q-P', '?4', '?no'], ['4', '?Q-S|S-Q', '?5', '?yes'], ['5', '?S-T|T-S', '?2', '?yes']],
        why: 'The heap starts with P-Q 4 and P-R 2. Each new vertex adds its edges: R adds R-Q 1, R-S 8, R-T 10; Q adds Q-S 5. P-Q 4 comes out when P and Q are both in the tree, so it is skipped (it would make a cycle). S adds S-T 2. Total 10.',
        lessons: ['12-heaps', '15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 3 }
    ],
    46: [
      { q: 'In network W (P-Q 4, P-R 2, Q-R 1, Q-S 5, R-S 8, R-T 10, S-T 2), compare the path with the fewest edges from P to T and the cheapest path.',
        options: ['Fewest edges: P → R → T (2 edges, weight 12); cheapest: P → R → Q → S → T (weight 10)', 'Both are P → R → T', 'Both are P → Q → S → T', 'Fewest edges: P → Q → S → T; cheapest: P → R → T'], answer: 0,
        why: 'A BFS from P reaches T in 2 edges through R. The cheapest search takes P 0, R 2, Q 3, S 8, T 10 from the minheap: four edges, but cheaper.',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 3 }
    ]
  },
  parts: {
    0: [
      { type: 'tf', q: 'A tree is an example of an acyclic graph.', answer: true,
        why: 'Slide 8: a tree has no cycles. It is a connected acyclic graph.',
        lessons: ['10-trees', '15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 1 },
      { q: 'What is a <b>self-loop</b> (sling)?',
        options: ['An edge from a vertex to itself', 'A cycle of length 3', 'A vertex with no edges', 'Two edges between the same vertices'], answer: 0,
        why: 'Slide 5: an edge of a graph that connects a vertex to itself.',
        lessons: ['15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 1 },
      { q: 'An undirected graph has 5 vertices and is a tree. How many edges does it have, and how many more would make it complete?',
        options: ['4 edges; 6 more', '5 edges; 5 more', '4 edges; 10 more', '10 edges; none'], answer: 0,
        why: 'A tree with n vertices has n − 1 = 4 edges. A complete graph with 5 vertices has 5 × 4 / 2 = 10, so 6 are missing.',
        lessons: ['10-trees', '15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 2 },
      { q: 'A path in graph G1 (A-B, A-C, B-D, C-D, C-E, D-F, E-F) visits the vertices A, C, D, F. What is its length?',
        options: ['3', '4', '2', '6'], answer: 0,
        why: 'The length is the number of edges: A-C, C-D, D-F, which is the number of vertices minus 1.',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 2 },
      { type: 'multi', q: 'A directed graph has the edges 1→2, 2→3, 3→1, 3→4. Which statements are true?',
        options: ['1, 2 and 3 form a cycle', 'From 4 there is a path to 1', 'The graph is connected', 'Vertex 1 can reach every other vertex'], answer: [0, 3],
        why: '1 → 2 → 3 → 1 is a cycle, and 1 reaches 2, 3 and 4. But 4 has no outgoing edge, so nothing is reachable from 4: the graph is not connected.',
        lessons: ['15-graphs'], skills: ['concept', 'trace'], available_after: '15-graphs', level: 2 },
      { q: 'A directed network has X→Y 50, Y→Z 30, X→Z 90 and Z→X 20. What is the cheapest round trip X → … → Z → … → X?',
        options: ['100', '110', '170', '80'], answer: 0,
        why: 'Going: X → Y → Z = 80 is cheaper than X → Z = 90. Coming back: only Z → X = 20. Total 100.',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 3 }
    ],
    1: [
      { type: 'tf', q: 'The adjacency matrix of an undirected graph is symmetric.', answer: true,
        why: 'An edge (A, B) sets [A][B] and [B][A], so the matrix equals its mirror over the main diagonal.',
        lessons: ['15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 1 },
      { q: 'What does each cell of the slides\' adjacency matrix hold?',
        options: ['A boolean: is there an edge between the two vertices?', 'The vertex value', 'A linked list', 'The weight'], answer: 0,
        why: 'Slide 16: each intersection is a boolean value. (A weighted graph would need numbers instead.)',
        lessons: ['15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 1 },
      { q: 'An undirected graph with 4 vertices has 10 true cells in its adjacency matrix and no self-loops. How many edges does it have?',
        options: ['5', '10', '20', '4'], answer: 0,
        why: 'Every undirected edge sets two cells, so 10 / 2 = 5 edges.',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 2 },
      { type: 'fill', q: 'Complete addEdge(int, int) of slide 25.',
        code: 'public void addEdge(int index1, int index2)\n{\n  if (indexIsValid(index1) && indexIsValid(index2))\n  {\n    adjMatrix[index1][index2] = ___;\n    adjMatrix[___][___] = true;\n    modCount++;\n  }\n}',
        answer: ['true', 'index2', 'index1'],
        why: 'Both directions are set because the graph is undirected.',
        lessons: ['15-graphs'], skills: ['design'], available_after: '15-graphs', level: 2 },
      { type: 'bug', q: 'This version of addVertex can write past the end of the arrays. Tap the line with the mistake.',
        code: 'public void addVertex(T vertex)\n{\n  if (numVertices == adjMatrix.length + 1)\n    expandCapacity();\n  vertices[numVertices] = vertex;\n  for (int i = 0; i < numVertices; i++)\n  {\n    adjMatrix[numVertices][i] = false;\n    adjMatrix[i][numVertices] = false;\n  }\n  numVertices++;\n  modCount++;\n}',
        answer: 3,
        why: 'numVertices never reaches length + 1, so the arrays never grow, and the 6th vertex goes to vertices[5] of a 5-place array: ArrayIndexOutOfBoundsException. The slide tests <code>(numVertices + 1) == adjMatrix.length</code>.',
        lessons: ['15-graphs'], skills: ['bug'], available_after: '15-graphs', level: 3 },
      { q: 'Checking whether two given vertices are adjacent costs how much in an adjacency matrix and in adjacency lists (n vertices)?',
        options: ['Matrix O(1); lists up to O(n) (walk one list)', 'Both O(1)', 'Matrix O(n); lists O(1)', 'Both O(n²)'], answer: 0,
        why: 'The matrix answers with one array access, adjMatrix[i][j]. A list must be walked, and a vertex may have up to n − 1 neighbours.',
        lessons: ['02-analysis-of-algorithms', '06-lists', '15-graphs'], skills: ['complexity'], available_after: '15-graphs', level: 3 }
    ],
    2: [
      { type: 'tf', q: 'A graph traversal may start at any vertex.', answer: true,
        why: 'Slide 29: a graph has no root node.',
        lessons: ['15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 1 },
      { q: 'Which structure does iteratorBFS use to manage the traversal?',
        options: ['A stack', 'A queue', 'A heap', 'A set'], answer: 1,
        why: 'Slide 30: a queue manages the traversal, and the result list builds the iterator.',
        lessons: ['05-queues', '15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 1 },
      { q: 'BFS runs on graph G1 (vertices A to F in this order; A-B, A-C, B-D, C-D, C-E, D-F, E-F) from E. What is the result?',
        options: ['E, C, F, A, D, B', 'E, C, A, B, D, F', 'E, F, C, D, A, B', 'E, C, F, D, A, B'], answer: 0,
        why: 'E enqueues C and F (index order). C adds A and D. F adds nothing new (D and E are marked). A adds B.',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 2 },
      { q: 'In BFS from a vertex s, what do the vertices that come before vertex v in the result have in common?',
        options: ['They are at most as many edges away from s as v is', 'They have smaller names', 'They are adjacent to v', 'Nothing'], answer: 0,
        why: 'The queue handles the vertices one distance at a time: all at distance 1, then all at distance 2, and so on. That is why BFS finds the path with the fewest edges.',
        lessons: ['15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 2 },
      { type: 'trace', q: 'BFS runs on the graph of slide 33 (1-2, 1-3, 1-4, 2-4, 2-5, 3-6, 4-6, 5-7, 5-8, 6-9, 7-9, 8-9) from 3. Fill in the result.',
        cols: ['position', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        rows: [['vertex', '?3', '?1', '?6', '?2', '?4', '?9', '?5', '?7', '?8']],
        why: '3 enqueues 1 and 6. 1 adds 2 and 4. 6 adds 9 (4 is marked). 2 adds 5. 4 adds nothing new. 9 adds 7 and 8. 5 finds 7 and 8 already marked.',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 3 }
    ],
    3: [
      { type: 'tf', q: 'A spanning tree of a graph with n vertices has n − 1 edges.', answer: true,
        why: 'It is a tree that contains all n vertices, and every tree with n vertices has n − 1 edges.',
        lessons: ['15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 1 },
      { q: 'Why does the MST algorithm keep the candidate edges in a <b>minheap</b>?',
        options: ['removeMin gives the cheapest edge quickly, in O(log n)', 'To keep the edges in adding order', 'To remove cycles', 'Because edges are vertices'], answer: 0,
        why: 'Each step needs the cheapest edge leaving the tree; the heap of unit 12 gives it without searching all edges.',
        lessons: ['12-heaps', '15-graphs'], skills: ['design'], available_after: '15-graphs', level: 1 },
      { q: 'DFS runs on graph G1 (vertices A to F in this order; A-B, A-C, B-D, C-D, C-E, D-F, E-F) from D. What is the result?',
        options: ['D, B, A, C, E, F', 'D, B, C, F, A, E', 'D, F, E, C, A, B', 'D, B, A, C, F, E'], answer: 0,
        why: 'D → its first unvisited neighbour B → A → C (A\'s next unvisited) → E (C\'s first unvisited: A and D are visited) → F. The second option is the BFS from D.',
        lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 2 },
      { q: 'The MST algorithm runs on network W (P-Q 4, P-R 2, Q-R 1, Q-S 5, R-S 8, R-T 10, S-T 2) from T instead of P. In which order are the vertices added?',
        options: ['T, S, Q, R, P', 'T, S, R, Q, P', 'T, R, P, Q, S', 'T, S, Q, P, R'], answer: 0,
        why: 'From T: S-T 2 (S), then Q-S 5 (Q; R-S 8 is dearer), then Q-R 1 (R), then R-P 2 (P). The MST is the same set of edges, total 10, reached in another order.',
        lessons: ['12-heaps', '15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 3 },
      { type: 'trace', q: 'The cheapest-path search of slide 46 runs on network W (P-Q 4, P-R 2, Q-R 1, Q-S 5, R-S 8, R-T 10, S-T 2) from P, with a minheap of (vertex, total) pairs. Fill in the order in which vertices are removed and their final totals.',
        cols: ['removed', '1st', '2nd', '3rd', '4th', '5th'],
        rows: [['vertex', '?P', '?R', '?Q', '?S', '?T'], ['total', '?0', '?2', '?3', '?8', '?10']],
        why: 'P (0) gives Q 4 and R 2. R (2) improves Q to 3 and gives S 10, T 12. Q (3) improves S to 8. S (8) improves T to 10. Each removed vertex has its final, cheapest total.',
        lessons: ['12-heaps', '15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 3 },
      { q: 'DFS uses a stack, BFS a queue. For a graph that is one long chain A-B-C-D-E (vertices in this order), started at A, how do their results compare?',
        options: ['Both give A, B, C, D, E', 'BFS gives A, B, C, D, E and DFS gives A, E, D, C, B', 'They differ in every position', 'DFS cannot run on a chain'], answer: 0,
        why: 'Each vertex has only one new neighbour, so going wide and going deep are the same here. The difference shows only when a vertex has several unvisited neighbours.',
        lessons: ['03-stacks', '05-queues', '15-graphs'], skills: ['trace', 'edge_case'], available_after: '15-graphs', level: 3 }
    ]
  }
});
