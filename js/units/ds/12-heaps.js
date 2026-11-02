/* Data Structures · Unit 12 Heaps and Priority Queues (47 slides): the minheap rule (complete tree + every parent <=
   its children), addElement (move up) and removeMin (last leaf to the root, move down), priority queues with
   PrioritizedObject, the linked heap (parent links, lastNode, getNextParentAdd, getNewLastNode), the array heap
   (children at 2n+1 and 2n+2) and heap sort */
(function () {
  function L(src, frag, nth) { var ls = src.split('\n'), c = 0; for (var i = 0; i < ls.length; i++) if (ls[i].indexOf(frag) >= 0 && ++c === (nth || 1)) return i + 1; throw new Error('no line ' + frag); }
  function nums(s, max) { return String(s).split(/[\s,;]+/).filter(function (x) { return /^-?\d{1,3}$/.test(x); }).map(Number).slice(0, max || 15); }
  var SC = {
    5: 'package jsjf;\n/**\n * HeapADT defines the interface to a Heap.\n *\n * @author Lewis and Chase\n * @version 4.0\n */\npublic interface HeapADT<T> extends BinaryTreeADT<T>\n{\n    /**\n     * Adds the specified object to this heap.\n     *\n     * @param obj the element to be added to the heap\n     */\n    public void addElement(T obj);\n    /**\n     * Removes element with the lowest value from this heap.\n     *\n     * @return the element with the lowest value from the heap\n     */\n    public T removeMin();\n    /**\n     * Returns a reference to the element with the lowest value in\n     * this heap.\n     *\n     * @return a reference to the element with the lowest value in the heap\n     */\n    public T findMin();\n}',
    19: '/**\n * PrioritizedObject represents a node in a priority queue containing a\n * comparable object, arrival order, and a priority value.\n *\n * @author Lewis and Chase\n * @version 4.0\n */\npublic class PrioritizedObject<T> implements Comparable<PrioritizedObject>\n{\n    private static int nextOrder = 0;\n    private int priority;\n    private int arrivalOrder;\n    private T element;\n    /**\n     * Creates a new PrioritizedObject with the specified data.\n     *\n     * @param element the element of the new priority queue node\n     * @param priority the priority of the new queue node\n     */\n    public PrioritizedObject(T element, int priority)\n    {\n        this.element = element;\n        this.priority = priority;\n        arrivalOrder = nextOrder;\n        nextOrder++;\n    }',
    20: '/**\n * Returns the element in this node.\n *\n * @return the element contained within the node\n */\npublic T getElement()\n{\n    return element;\n}\n/**\n * Returns the priority value for this node.\n *\n * @return the integer priority for this node\n */\npublic int getPriority()\n{\n    return priority;\n}\n/**\n * Returns the arrival order for this node.\n *\n * @return the integer arrival order for this node\n */\npublic int getArrivalOrder()\n{\n    return arrivalOrder;\n}',
    21: '    /**\n     * Returns a string representation for this node.\n     *\n     */\n    public String toString()\n    {\n        return (element + "  " + priority + "  " + arrivalOrder);\n    }\n    /**\n     * Returns 1 if the this object has higher priority than\n     * the given object and -1 otherwise.\n     *\n     * @param obj the object to compare to this node\n     * @return the result of the comparison of the given object and\n     *         this one\n     */\n    public int compareTo(PrioritizedObject obj)\n    {\n        int result;\n        if (priority > obj.getPriority())\n            result = 1;\n        else if (priority < obj.getPriority())\n            result = -1;\n        else if (arrivalOrder > obj.getArrivalOrder())\n            result = 1;\n        else\n            result = -1;\n        return result;\n    }\n}',
    22: 'import jsjf.*;\n/**\n * PriorityQueue implements a priority queue using a heap.\n *\n * @author Lewis and Chase\n * @version 4.0\n */\npublic class PriorityQueue<T> extends ArrayHeap<PrioritizedObject<T>>\n{\n    /**\n     * Creates an empty priority queue.\n     */\n    public PriorityQueue()\n    {\n        super();\n    }\n    /**\n     * Adds the given element to this PriorityQueue.\n     *\n     * @param object the element to be added to the priority queue\n     * @param priority the integer priority of the element to be added\n     */\n    public void addElement(T object, int priority)\n    {\n        PrioritizedObject<T> obj = new PrioritizedObject<T>(object, priority);\n        super.addElement(obj);\n    }',
    23: '    /**\n     * Removes the next highest priority element from this priority\n     * queue and returns a reference to it.\n     *\n     * @return a reference to the next highest priority element in this queue\n     */\n    public T removeNext()\n    {\n        PrioritizedObject<T> obj = (PrioritizedObject<T>)super.removeMin();\n        return obj.getElement();\n    }\n}',
    26: 'package jsjf;\n/**\n * HeapNode represents a binary tree node with a parent pointer for use\n * in heaps.\n *\n * @author Lewis and Chase\n * @version 4.0\n */\npublic class HeapNode<T> extends BinaryTreeNode<T>\n{\n    protected HeapNode<T> parent;\n    /**\n     * Creates a new heap node with the specified data.\n     *\n     * @param obj the data to be contained within the new heap node\n     */\n    public HeapNode(T obj)\n    {\n        super(obj);\n        parent = null;\n    }',
    27: '    /**\n     * Return the parent of this node.\n     *\n     * @return the parent of the node\n     */\n    public HeapNode<T> getParent()\n    {\n        return parent;\n    }\n    /**\n     * Sets the element stored at this node.\n     *\n     * @param the element to be stored\n     */\n    public void setElement(T obj)\n    {\n        element = obj;\n    }\n    /**\n     * Sets the parent of this node.\n     *\n     * @param node the parent of the node\n     */\n    public void setParent(HeapNode<T> node)\n    {\n        parent = node;\n    }\n}',
    28: 'package jsjf;\nimport jsjf.exceptions.*;\n/**\n * LinkedHeap implements a heap.\n *\n * @author Lewis and Chase\n * @version 4.0\n */\npublic class LinkedHeap<T> extends LinkedBinaryTree<T> implements HeapADT<T>\n{\n    public HeapNode<T> lastNode;\n    public LinkedHeap()\n    {\n        super();\n    }',
    29: '/**\n * Adds the specified element to this heap in the appropriate\n * position according to its key value.\n *\n * @param obj the element to be added to the heap\n */\npublic void addElement(T obj)\n{\n    HeapNode<T> node = new HeapNode<T>(obj);\n    if (root == null)\n        root=node;\n    else\n    {\n        HeapNode<T> nextParent = getNextParentAdd();\n        if (nextParent.getLeft() == null)\n            nextParent.setLeft(node);\n        else\n            nextParent.setRight(node);\n        node.setParent(nextParent);\n    }\n    lastNode = node;\n    modCount++;\n    if (size() > 1)\n        heapifyAdd();\n}',
    30: '/**\n * Returns the node that will be the parent of the new node\n *\n * @return the node that will be the parent of the new node\n */\nprivate HeapNode<T> getNextParentAdd()\n{\n    HeapNode<T> result = lastNode;\n    while ((result != root) && (result.getParent().getLeft() != result))\n        result = result.getParent();\n    if (result != root)\n        if (result.getParent().getRight() == null)\n            result = result.getParent();\n        else\n        {\n            result = (HeapNode<T>)result.getParent().getRight();\n            while (result.getLeft() != null)\n                result = (HeapNode<T>)result.getLeft();\n        }\n    else\n        while (result.getLeft() != null)\n            result = (HeapNode<T>)result.getLeft();\n    return result;\n}',
    31: '/**\n * Reorders this heap after adding a node.\n */\nprivate void heapifyAdd()\n{\n    T temp;\n    HeapNode<T> next = lastNode;\n    temp = next.getElement();\n    while ((next != root) &&\n        (((Comparable)temp).compareTo(next.getParent().getElement()) < 0))\n    {\n        next.setElement(next.getParent().getElement());\n        next = next.parent;\n    }\n    next.setElement(temp);\n}',
    32: '/**\n * Remove the element with the lowest value in this heap and\n * returns a reference to it. Throws an EmptyCollectionException\n * if the heap is empty.\n *\n * @return the element with the lowest value in this heap\n * @throws EmptyCollectionException if the heap is empty\n */\npublic T removeMin() throws EmptyCollectionException\n{\n    if (isEmpty())\n        throw new EmptyCollectionException("LinkedHeap");\n    T minElement =  root.getElement();\n    if (size() == 1)\n    {\n        root = null;\n        lastNode = null;\n    }',
    33: '    else\n    {\n        HeapNode<T> nextLast = getNewLastNode();\n        if (lastNode.getParent().getLeft() == lastNode)\n            lastNode.getParent().setLeft(null);\n        else\n            lastNode.getParent().setRight(null);\n        ((HeapNode<T>)root).setElement(lastNode.getElement());\n        lastNode = nextLast;\n        heapifyRemove();\n    }\n    modCount++;\n    return minElement;\n}',
    34: '/**\n * Returns the node that will be the new last node after a remove.\n *\n * @return the node that willbe the new last node after a remove\n */\nprivate HeapNode<T> getNewLastNode()\n{\n    HeapNode<T> result = lastNode;\n    while ((result != root) && (result.getParent().getLeft() == result))\n        result = result.getParent();\n    if (result != root)\n        result = (HeapNode<T>)result.getParent().getLeft();\n    while (result.getRight() != null)\n        result = (HeapNode<T>)result.getRight();\n    return result;\n}',
    35: '/**\n * Reorders this heap after removing the root element.\n */\nprivate void heapifyRemove()\n{\n    T temp;\n    HeapNode<T> node = (HeapNode<T>)root;\n    HeapNode<T> left = (HeapNode<T>)node.getLeft();\n    HeapNode<T> right = (HeapNode<T>)node.getRight();\n    HeapNode<T> next;\n    if ((left == null) && (right == null))\n        next = null;\n    else if (right == null)\n        next = left;\n    else if (((Comparable)left.getElement()).compareTo(right.getElement()) < 0)\n        next = left;\n    else\n        next = right;\n    temp = node.getElement();',
    36: '    while ((next != null) &&\n        (((Comparable)next.getElement()).compareTo(temp) < 0))\n    {\n        node.setElement(next.getElement());\n        node = next;\n        left = (HeapNode<T>)node.getLeft();\n        right = (HeapNode<T>)node.getRight();\n        if ((left == null) && (right == null))\n            next = null;\n        else if (right == null)\n            next = left;\n        else if (((Comparable)left.getElement()).compareTo(right.getElement()) < 0)\n            next = left;\n        else\n            next = right;\n    }\n    node.setElement(temp);\n}',
    38: 'package jsjf;\nimport java.util.*;\nimport jsjf.exceptions.*;\n/**\n * ArrayBinaryTree implements the BinaryTreeADT interface using an array\n *\n * @author Lewis and Chase\n * @version 4.0\n */\npublic class ArrayBinaryTree<T> implements BinaryTreeADT<T>, Iterable<T>\n{\n    private static final int DEFAULT_CAPACITY = 50;\n    protected int count;\n    protected T[] tree;\n    protected int modCount;\n    /**\n     * Creates an empty binary tree.\n     */\n    public ArrayBinaryTree()\n    {\n        count = 0;\n        tree = (T[]) new Object[DEFAULT_CAPACITY];\n    }',
    39: '/**\n * Creates a binary tree with the specified element as its root.\n *\n * @param element the element which will become the root of the new tree\n */\npublic ArrayBinaryTree(T element)\n{\n    count = 1;\n    tree = (T[]) new Object[DEFAULT_CAPACITY];\n    tree[0] = element;\n}',
    40: 'package jsjf;\nimport jsjf.exceptions.*;\n/**\n * ArrayHeap provides an array implementation of a minheap.\n *\n * @author Lewis and Chase\n * @version 4.0\n */\npublic class ArrayHeap<T> extends ArrayBinaryTree<T> implements HeapADT<T>\n{\n    /**\n     * Creates an empty heap.\n     */\n    public ArrayHeap()\n    {\n        super();\n    }',
    41: '/**\n * Adds the specified element to this heap in the appropriate\n * position according to its key value.\n *\n * @param obj the element to be added to the heap\n */\npublic void addElement(T obj)\n{\n    if (count == tree.length)\n        expandCapacity();\n    tree[count] = obj;\n    count++;\n    modCount++;\n    if (count > 1)\n        heapifyAdd();\n}',
    42: '/**\n * Reorders this heap to maintain the ordering property after\n * adding a node.\n */\nprivate void heapifyAdd()\n{\n    T temp;\n    int next = count - 1;\n    temp = tree[next];\n    while ((next != 0) &&\n        (((Comparable)temp).compareTo(tree[(next-1)/2]) < 0))\n    {\n        tree[next] = tree[(next-1)/2];\n        next = (next-1)/2;\n    }\n    tree[next] = temp;\n}',
    43: '/**\n * Remove the element with the lowest value in this heap and\n * returns a reference to it. Throws an EmptyCollectionException if\n * the heap is empty.\n *\n * @return a reference to the element with the lowest value in this heap\n * @throws EmptyCollectionException if the heap is empty\n */\npublic T removeMin() throws EmptyCollectionException\n{\n    if (isEmpty())\n        throw new EmptyCollectionException("ArrayHeap");\n    T minElement = tree[0];\n    tree[0] = tree[count-1];\n    heapifyRemove();\n    count--;\n    modCount--;\n    return minElement;\n}',
    44: '/**\n * Reorders this heap to maintain the ordering property\n * after the minimum element has been removed.\n */\nprivate void heapifyRemove()\n{\n    T temp;\n    int node = 0;\n    int left = 1;\n    int right = 2;\n    int next;\n    if ((tree[left] == null) && (tree[right] == null))\n        next = count;\n    else if (tree[right] == null)\n        next = left;\n    else if (((Comparable)tree[left]).compareTo(tree[right]) < 0)\n        next = left;\n    else\n        next = right;\n    temp = tree[node];',
    45: '    while ((next < count) &&\n        (((Comparable)tree[next]).compareTo(temp) < 0))\n    {\n        tree[node] = tree[next];\n        node = next;\n        left = 2 * node + 1;\n        right = 2 * (node + 1);\n        if ((tree[left] == null) && (tree[right] == null))\n            next = count;\n        else if (tree[right] == null)\n            next = left;\n        else if (((Comparable)tree[left]).compareTo(tree[right]) < 0)\n            next = left;\n        else\n            next = right;\n    }\n    tree[node] = temp;\n}',
    47: 'package jsjf;\n/**\n * HeapSort sorts a given array of Comparable objects using a heap.\n *\n * @author Lewis and Chase\n * @version 4.0\n */\npublic class HeapSort<T>\n{\n    /**\n     * Sorts the specified array using a Heap\n     *\n     * @param data the data to be added to the heapsort\n     */\n    public void HeapSort(T[] data)\n    {\n        ArrayHeap<T> temp = new ArrayHeap<T>();\n        // copy the array into a heap\n        for (int i = 0; i < data.length; i++)\n            temp.addElement(data[i]);\n        // place the sorted elements back into the array\n        int count = 0;\n        while (!(temp.isEmpty()))\n        {\n            data[count] = temp.removeMin();\n            count++;\n        }\n    }\n}'
  };

  /* ---------- drawing a complete tree stored by index (children of i at 2i+1, 2i+2) ---------- */
  function lvl(i) { return Math.floor(Math.log2(i + 1)); }
  function layoutIdx(n, o) {
    var pres = o.present || function (i) { return i < n; }, rank = 0, pos = {};
    var walk = function (i) { if (i >= n || !pres(i)) return; walk(2 * i + 1); pos[i] = { r: rank++, d: lvl(i) }; walk(2 * i + 2); };
    walk(0);
    var c = rank, W = o.w || 500, x0 = o.x0 != null ? o.x0 : 30, gap = c > 1 ? Math.min(o.gmax || 62, W / (c - 1)) : 0, left = x0 + (W - gap * (c - 1)) / 2;
    Object.keys(pos).forEach(function (i) { pos[i].x = left + pos[i].r * gap; pos[i].y = (o.y0 || 24) + pos[i].d * (o.dy || 50); });
    return { pos: pos, gap: gap };
  }
  /* a: values (or {id, v}) by index; o: n, tone {i}, etone {child i}, idOf(i), title(i), present(i), nw, cells {y, from, upto (count), stale}, tags {i: text} */
  function drawHeap(a, o) {
    o = o || {}; var n = o.n != null ? o.n : a.length, out = [], lay = layoutIdx(n, o), pos = lay.pos;
    var nw = o.nw || (lay.gap ? Math.min(44, Math.max(26, 2 * lay.gap - 8)) : 44), nh = 28;
    var idOf = o.idOf || function (i) { return 'n' + i; }, txt = o.title || function (i) { var e = a[i]; return e == null ? '' : String(e.v != null ? e.v : e); };
    Object.keys(pos).forEach(function (k) {
      var i = +k, p = pos[i], tn = (o.tone && o.tone[i]) || 'blue';
      out.push(B(idOf(i), p.x - nw / 2, p.y, nw, nh, { title: txt(i), mono: true, size: nw < 34 ? 11 : 13, tone: tn, fill: tn === 'accent' ? 'solid' : 'soft', hi: tn === 'accent' }));
      if (o.tags && o.tags[i]) out.push(T('pt' + idOf(i), p.x + nw / 2 + 5, p.y + 19, o.tags[i], { mono: true, size: 11, bold: true, tone: 'red' }));
      if (i) { var pp = pos[(i - 1) >> 1]; if (pp) out.push(A('e' + i, pp.x + (i % 2 ? -6 : 6), pp.y + nh, p.x, p.y, { tone: (o.etone && o.etone[i]) || 'muted', head: !o.noHeads })); }
    });
    if (!Object.keys(pos).length && o.empty !== false) out.push(T('empty', (o.x0 != null ? o.x0 : 30) + (o.w || 500) / 2, (o.y0 || 24) + 30, '(empty heap)', { anchor: 'middle', mono: true, size: 14, tone: 'muted' }));
    if (o.cells) {
      var C = o.cells, m = C.upto != null ? C.upto : n, cw = C.cw || Math.min(44, Math.floor(540 / Math.max(m, 1))), x0 = C.x0 != null ? C.x0 : 300 - m * cw / 2;
      for (var i = 0; i < m; i++) {
        var stale = C.count != null && i >= C.count, tn2 = stale ? 'muted' : (o.tone && o.tone[i]) || 'blue', v = txt(i);
        out.push(B((C.p || 'c') + (C.ids ? C.ids(i) : i), x0 + i * cw + 1, C.y, cw - 2, 30, { title: v === '' ? 'null' : v, mono: true, size: v === '' ? 9 : cw < 34 ? 11 : 13, tone: tn2, fill: tn2 === 'accent' ? 'solid' : 'soft', o: stale ? 0.45 : 1 }));
        out.push(T((C.p || 'c') + 'ix' + i, x0 + i * cw + cw / 2, C.y - 6, String(i), { anchor: 'middle', mono: true, size: 10, tone: 'muted' }));
      }
      if (C.count != null) out.push(P('cnt', x0 + C.count * cw, C.y + 34, 'count = ' + C.count, { dir: 'up', len: 18 }));
    }
    return out;
  }
  function tempBox(v, x, y) { return v == null ? [] : [B('temp', x, y, 84, 34, { title: 'temp = ' + v, mono: true, size: 13, tone: 'teal', fill: 'soft' })]; }

  /* ---------- 1. what is a heap (slides 3-7) ---------- */
  var HD = 'heap = a complete binary tree               (structure)\n  + every element <= both of its children    (order: minheap)\nmaxheap: every element >= both of its children\noperations: addElement, removeMin, findMin\nfindMin: the minimum is always at the root';
  function parseLevel(s) { var t = String(s).trim().split(/[\s,]+/).filter(Boolean).slice(0, 15).map(function (x) { return /^-?\d{1,3}$/.test(x) ? +x : null; }); while (t.length && t[t.length - 1] == null) t.pop(); return t; }
  var heapdef = {
    id: 'heapdef', slides: [3, 7], title: 'Is it a heap? Shape first, then order', lang: 'text', vb: [560, 340],
    code: HD,
    inputs: [{ id: 't', type: 'text', label: 'tree, level by level', value: '3 5 4 8 7 9', minlen: 1, maxlen: 50 }, { id: 'k', label: 'kind (1 min, 2 max)', value: 1, min: 1, max: 2 }],
    inputsLabel: 'Elements level by level, left to right; <code>-</code> = no node there.',
    presets: [{ label: 'slide 7, left', values: { t: '3 5 4 8 7 9', k: 1 } }, { label: 'slide 7, right', values: { t: '3 7 4 8 9 5', k: 1 } }, { label: 'a gap: not complete', values: { t: '3 5 4 8 - 9', k: 1 } }, { label: 'order broken', values: { t: '3 5 4 8 2 9', k: 1 } }, { label: 'a maxheap', values: { t: '9 8 5 7 3 4', k: 2 } }],
    steps: function (v) {
      var a = parseLevel(v.t), mx = Math.trunc(v.k) === 2, st = [], tone = {}, bad = false, name = mx ? 'maxheap' : 'minheap';
      if (!a.length || a[0] == null) a = [1];
      var pres = function (i) { return a[i] != null; };
      var snap = function (o) { o.a = a; o.tone = JSON.parse(JSON.stringify(tone)); st.push(o); return o; };
      var gap = -1; for (var i = 0; i < a.length; i++) if (a[i] == null) { gap = i; break; }
      if (gap >= 0) { tone = {}; snap({ slide: 3, line: 1, hole: gap, cap: 'Shape: position ' + gap + ' is empty but later positions are used. The nodes are not all packed to the left, so the tree is <b>not complete</b>: this is <b>not a heap</b>, whatever the values are.' }); return st; }
      snap({ slide: 3, line: 1, cap: 'Shape: ' + a.length + ' nodes fill the levels from the top, left to right, with no gap: a <b>complete</b> binary tree. ✓' });
      for (var p = 0; 2 * p + 1 < a.length && !bad; p++) {
        var ks = [2 * p + 1, 2 * p + 2].filter(function (c) { return c < a.length; }), okAll = true;
        ks.forEach(function (c) { var ok = mx ? a[p] >= a[c] : a[p] <= a[c]; if (!ok) okAll = false; });
        tone = {}; for (var q = 0; q < p; q++) tone[q] = 'teal'; tone[p] = okAll ? 'accent' : 'red'; ks.forEach(function (c) { tone[c] = okAll ? 'blue' : ((mx ? a[p] >= a[c] : a[p] <= a[c]) ? 'blue' : 'red'); });
        snap({ slide: 3, line: mx ? 3 : 2, cap: a[p] + (mx ? ' ≥ ' : ' ≤ ') + ks.map(function (c) { return a[c]; }).join(' and ') + '? ' + (okAll ? 'Yes ✓' : '<b>No</b>: ' + ks.filter(function (c) { return !(mx ? a[p] >= a[c] : a[p] <= a[c]); }).map(function (c) { return a[c]; }).join(', ') + (mx ? ' is bigger than' : ' is smaller than') + ' its parent ' + a[p] + '.') });
        if (!okAll) bad = true;
      }
      tone = {};
      if (bad) { snap({ slide: 3, line: mx ? 3 : 2, cap: 'One parent breaks the order rule, so this is <b>not a ' + name + '</b>.' }); return st; }
      tone[0] = 'accent';
      snap({ slide: 3, line: mx ? 3 : 2, cap: 'Every parent is ' + (mx ? '≥' : '≤') + ' its children: this <b>is a ' + name + '</b>. Notice the rule says nothing about left versus right, and nothing about cousins.' });
      snap({ slide: 4, line: 4, cap: 'A heap has only three operations of its own: <b>addElement</b>, <b>removeMin</b> and <b>findMin</b>. It does not search for any element, only the smallest.' });
      snap({ slide: 6, line: 5, cap: 'findMin is instant: the ' + (mx ? 'maximum' : 'minimum') + ' is always at the root: <b>' + a[0] + '</b>. (In a ' + (mx ? 'maxheap the root holds the largest' : 'minheap the root holds the smallest') + '.)' });
      snap({ slide: 7, line: '1-2', cap: 'Other heaps can hold the same numbers: as long as every parent is ' + (mx ? '≥' : '≤') + ' its children, the arrangement is valid. There is more than one correct heap.' });
      return st;
    },
    draw: function (k, s) {
      var a = s.a, items = drawHeap(a, { n: a.length, present: function (i) { return a[i] != null; }, tone: s.tone, title: function (i) { return String(a[i]); }, y0: 26, dy: 62, w: 440, x0: 60 });
      if (s.hole != null) { var lay = layoutIdx(a.length + 1, { present: function (i) { return i === s.hole || a[i] != null; }, y0: 26, dy: 62, w: 440, x0: 60 }); var hp = lay.pos[s.hole]; if (hp) items.push(B('hole', hp.x - 20, hp.y, 40, 28, { dash: true, tone: 'red', title: '?', mono: true })); }
      items.push(T('arr', 20, 300, 'array: [' + a.map(function (x) { return x == null ? '-' : x; }).join(', ') + ']', { mono: true, size: 13, bold: true, tone: 'muted' }));
      return items;
    }
  };

  /* ---------- 2. addElement: a new leaf moves up (slides 8-12) ---------- */
  var EID = 0;
  function els(vs) { return vs.map(function (v) { return { id: ++EID, v: v }; }); }
  var AD = 'addElement(x):\n  put x in the next free place (the tree stays complete)\n  while x is not the root and x < its parent:\n    swap x with its parent (x moves up one level)\n  done: every parent <= its children again';
  function heapView(a, o) { return drawHeap(a, Object.assign({ idOf: function (i) { return 'h' + a[i].id; }, y0: 24, dy: 52, w: 480, x0: 40, cells: { y: 268, ids: function (i) { return a[i].id; } } }, o)); }
  var heapadd = {
    id: 'heapadd', slides: [8, 12], title: 'addElement: a new leaf moves up', lang: 'text', vb: [600, 320],
    code: AD,
    inputs: [{ id: 't', type: 'text', label: 'heap', value: '3 5 4 8 7 9', minlen: 0, maxlen: 50 }, { id: 'a', type: 'text', label: 'add', value: '2', minlen: 0, maxlen: 20 }],
    inputsLabel: 'The heap level by level (it should already be a heap), then the numbers to add.',
    presets: [{ label: 'slide 10: add 2', values: { t: '3 5 4 8 7 9', a: '2' } }, { label: 'slide 11: add 32, 11, 7', values: { t: '12 34 47 39 57 56 56 45 48', a: '32 11 7' } }, { label: 'a big number stays down', values: { t: '3 5 4 8 7 9', a: '10' } }, { label: 'equal to the parent', values: { t: '3 5 4 8 7 9', a: '4' } }, { label: 'start from empty', values: { t: '', a: '6 2 8 1' } }],
    steps: function (v) {
      EID = 0; var a = els(nums(v.t, 12)), adds = nums(v.a, 4), st = [], slideA = /^12 34 47/.test(String(v.t).trim()) ? 11 : 10;
      var snap = function (o) { o.a = a.slice(); st.push(o); return o; };
      snap({ slide: 8, line: 1, cap: a.length ? 'The heap: ' + a.map(function (e) { return e.v; }).join(', ') + ' (the array below is the same tree, level by level).' : 'The heap is empty.' });
      adds.forEach(function (x, ai) {
        var e = { id: ++EID, v: x }; a.push(e); var i = a.length - 1, mv = 0;
        snap({ slide: ai || slideA === 11 ? slideA : 9, line: 2, at: i, cap: 'add ' + x + ': it goes in the <b>next free place</b>: index ' + i + (i ? ', the ' + (i % 2 ? 'left' : 'right') + ' child of ' + a[(i - 1) >> 1].v : ' (the root)') + '. The tree stays complete.' });
        while (i > 0) {
          var p = (i - 1) >> 1;
          if (!(x < a[p].v)) { snap({ slide: slideA, line: 3, at: i, cmp: p, cap: x + ' &lt; ' + a[p].v + '? No' + (x === a[p].v ? ' (equal is fine)' : '') + ': ' + x + ' stops here.' }); break; }
          snap({ slide: slideA, line: 3, at: i, cmp: p, cap: x + ' &lt; its parent ' + a[p].v + ': they are in the wrong order.' });
          var t = a[p]; a[p] = a[i]; a[i] = t; i = p; mv++;
          snap({ slide: slideA, line: 4, at: i, cap: 'Swap: ' + x + ' moves up to index ' + i + (i ? '.' : ': it is the new <b>root</b>.') });
        }
        snap({ slide: slideA === 11 ? 12 : 10, line: 5, at: i, cap: x + (mv ? ' moved up ' + mv + ' level' + (mv === 1 ? '' : 's') : ' stays where it was') + '. Every parent is ≤ its children again. At most one swap per level: O(log n).' });
      });
      if (slideA === 11 && adds.length) st[st.length - 1].cap += ' This is the solution of slide 12.';
      return st;
    },
    draw: function (k, s) {
      var tone = {}; if (s.cmp != null) tone[s.cmp] = 'red'; if (s.at != null) tone[s.at] = 'accent';
      return heapView(s.a, { tone: tone });
    }
  };

  /* ---------- 3. removeMin: the last leaf goes to the root and moves down (slides 13-17) ---------- */
  var RM = 'removeMin():\n  min = the root\n  move the last leaf to the root (the tree stays complete)\n  while it has a child smaller than it:\n    swap it with its smaller child (it moves down one level)\n  return min';
  var heaprem = {
    id: 'heaprem', slides: [13, 17], title: 'removeMin: the last leaf moves down', lang: 'text', vb: [600, 320],
    code: RM,
    inputs: [{ id: 't', type: 'text', label: 'heap', value: '3 5 4 8 7 9', minlen: 1, maxlen: 50 }, { id: 'k', label: 'how many removeMin', value: 1, min: 1, max: 6 }],
    presets: [{ label: 'slide 15: remove 3', values: { t: '3 5 4 8 7 9', k: 1 } }, { label: 'slide 16: remove 3 times', values: { t: '7 12 11 39 32 47 56 45 48 57 34 56', k: 3 } }, { label: 'until empty', values: { t: '2 6 4 9', k: 5 } }, { label: 'two equal children', values: { t: '1 5 5 8 9 7', k: 1 } }],
    steps: function (v) {
      EID = 0; var a = els(nums(v.t, 12)), k = Math.trunc(v.k), st = [], ex = /^7 12 11/.test(String(v.t).trim()), out = [];
      var snap = function (o) { o.a = a.slice(); o.got = out.slice(); st.push(o); return o; };
      snap({ slide: 13, line: 1, cap: 'removeMin always removes the <b>root</b>: in a minheap the root holds the smallest element.' });
      for (var r = 0; r < k; r++) {
        if (!a.length) { snap({ slide: ex ? 16 : 15, line: 1, cap: 'The heap is empty: there is nothing to remove (the Java code throws an EmptyCollectionException).' }); break; }
        var min = a[0]; out.push(min.v);
        snap({ slide: ex ? 16 : 14, line: 2, at: 0, cap: 'removeMin: take the root, <b>' + min.v + '</b>.' });
        var last = a.pop();
        if (!a.length) { snap({ slide: ex ? 16 : 14, line: 6, cap: min.v + ' was the only element: the heap is now empty.' }); continue; }
        if (last === min) continue;
        a[0] = last;
        snap({ slide: ex ? 16 : 14, line: 3, at: 0, cap: 'The <b>last leaf</b> (' + last.v + ', at index ' + a.length + ') moves to the root. The tree stays complete, but ' + last.v + ' may be too big for the root.' });
        var i = 0;
        for (;;) {
          var l = 2 * i + 1, rr = 2 * i + 2; if (l >= a.length) { snap({ slide: ex ? 16 : 15, line: 4, at: i, cap: last.v + ' has no children now: it stops.' }); break; }
          var c = rr < a.length && !(a[l].v < a[rr].v) ? rr : l;
          var why = rr < a.length ? 'its children are ' + a[l].v + ' and ' + a[rr].v + '; the smaller is ' + a[c].v + (a[l].v === a[rr].v ? ' (equal: the code takes the right one)' : '') : 'its only child is ' + a[c].v;
          if (!(a[c].v < last.v)) { snap({ slide: ex ? 16 : 15, line: 4, at: i, cmp: c, cap: last.v + ': ' + why + '. ' + a[c].v + ' is not smaller than ' + last.v + ', so it stops.' }); break; }
          snap({ slide: ex ? 16 : 15, line: 4, at: i, cmp: c, cap: last.v + ': ' + why + '. ' + a[c].v + ' &lt; ' + last.v + ': swap.' });
          var t = a[c]; a[c] = a[i]; a[i] = t; i = c;
          snap({ slide: ex ? 16 : 15, line: 5, at: i, cap: a[(i - 1) >> 1].v + ' moved up, ' + last.v + ' moved down to index ' + i + '.' });
        }
        snap({ slide: ex ? 17 : 15, line: 6, cap: 'removeMin returns ' + min.v + '. The heap is valid again; the new root ' + (a.length ? a[0].v : '') + ' is the next smallest. O(log n).' + (ex && r === k - 1 && k === 3 ? ' This is the solution of slide 17.' : '') });
      }
      return st;
    },
    draw: function (k, s) {
      var tone = {}; if (s.cmp != null) tone[s.cmp] = 'red'; if (s.at != null) tone[s.at] = 'accent';
      var items = heapView(s.a, { tone: tone });
      if (s.got.length) items.push(T('got', 580, 26, 'removed: ' + s.got.join(', '), { anchor: 'end', mono: true, size: 13, bold: true, tone: 'teal' }));
      return items;
    }
  };

  /* ---------- 4. a priority queue built on a heap (slides 18-23) ---------- */
  var PQ = 'public int compareTo(PrioritizedObject obj) {\n  int result;\n  if (priority > obj.getPriority())\n    result = 1;\n  else if (priority < obj.getPriority())\n    result = -1;\n  else if (arrivalOrder > obj.getArrivalOrder())\n    result = 1;\n  else\n    result = -1;\n  return result;\n}\npublic void addElement(T object, int priority) {\n  PrioritizedObject<T> obj = new PrioritizedObject<T>(object, priority);\n  super.addElement(obj);\n}\npublic T removeNext() {\n  PrioritizedObject<T> obj = (PrioritizedObject<T>)super.removeMin();\n  return obj.getElement();\n}\n// ---- main ----\nPriorityQueue<String> pq = new PriorityQueue<String>();';
  function pqOps(s) { var out = [], re = /(add)\s+([A-Za-z]\w{0,5})\s+(-?\d{1,2})|(next)/gi, m; while ((m = re.exec(String(s))) && out.length < 9) out.push(m[4] ? { op: 'next' } : { op: 'add', name: m[2], p: +m[3] }); return out; }
  function pqCode(v) { return PQ + '\n' + pqOps(v.ops).map(function (o) { return o.op === 'add' ? 'pq.addElement("' + o.name + '", ' + o.p + ');' : 'System.out.println(pq.removeNext());'; }).join('\n'); }
  var pq = {
    id: 'pq', slides: [18, 23], title: 'Priority queue: smallest priority first, then first come', vb: [600, 320],
    code: pqCode,
    inputs: [{ id: 'ops', type: 'text', label: 'operations', value: 'add Ann 2, add Bob 1, add Cy 2, next, next, next', minlen: 0, maxlen: 80 }],
    inputsLabel: '<code>add Name priority</code> or <code>next</code> (removeNext). A smaller number is served first.',
    presets: [{ label: 'urgent jumps ahead', values: { ops: 'add Ann 2, add Bob 1, add Cy 2, next, next, next' } }, { label: 'same priority: first come, first served', values: { ops: 'add Ann 5, add Bob 5, add Cy 5, next, next' } }, { label: 'arrivals between removals', values: { ops: 'add Ann 3, add Bob 2, next, add Cy 1, add Dan 3, next, next, next' } }, { label: 'removeNext on empty', values: { ops: 'add Ann 1, next, next' } }],
    steps: function (v) {
      var code = pqCode(v), ops = pqOps(v.ops), a = [], st = [], order = 0, ms = L(code, '// ---- main ----'), C0 = L(code, 'public int compareTo'), AE = L(code, 'public void addElement'), RN = L(code, 'public T removeNext');
      var less = function (x, y) { return x.p < y.p || (x.p === y.p && x.o < y.o); };
      var cmpTxt = function (x, y) { return x.p !== y.p ? 'priority ' + x.p + (x.p < y.p ? ' &lt; ' : ' &gt; ') + y.p : 'same priority ' + x.p + ', arrival ' + x.o + (x.o < y.o ? ' &lt; ' : ' &gt; ') + y.o; };
      var cmpLine = function (x, y) { return x.p > y.p ? C0 + 3 : x.p < y.p ? C0 + 5 : x.o > y.o ? C0 + 7 : C0 + 9; };
      var snap = function (o) { o.a = a.slice(); st.push(o); return o; };
      snap({ slide: 18, line: ms + 1, cap: 'A priority queue removes by <b>priority</b>, not by arrival. Here it is a heap of PrioritizedObjects: element, priority and arrival order.' });
      ops.forEach(function (o, oi) {
        var ml = ms + 2 + oi;
        if (o.op === 'add') {
          var e = { id: oi + 1, name: o.name, p: o.p, o: order++ }; a.push(e); var i = a.length - 1;
          snap({ slide: 22, line: ml + ',' + (AE + 1) + '-' + (AE + 2), at: i, cap: 'addElement("' + o.name + '", ' + o.p + '): a new PrioritizedObject with arrival order ' + e.o + ' (nextOrder counts up), added to the heap as a new leaf.' });
          while (i > 0) {
            var p = (i - 1) >> 1, up = less(a[i], a[p]);
            snap({ slide: 21, line: cmpLine(a[i], a[p]) + ',' + (cmpLine(a[i], a[p]) + 1), at: i, cmp: p, cap: e.name + '.compareTo(' + a[p].name + '): ' + cmpTxt(a[i], a[p]) + ' → ' + (up ? '-1: ' + e.name + ' moves up.' : '1: ' + e.name + ' stays.') });
            if (!up) break;
            var t = a[p]; a[p] = a[i]; a[i] = t; i = p;
          }
        } else {
          if (!a.length) { snap({ slide: 23, line: ml + ',' + (RN + 1), out: 'Exception in thread "main" jsjf.exceptions.EmptyCollectionException: ArrayHeap', err: true, cap: 'removeNext on an empty queue: super.removeMin() throws an <b>EmptyCollectionException</b>.' }); return; }
          var m = a[0], last = a.pop();
          if (a.length) {
            a[0] = last; var j = 0;
            for (;;) { var l = 2 * j + 1, r = l + 1; if (l >= a.length) break; var c = r < a.length && !less(a[l], a[r]) ? r : l; if (!less(a[c], a[j])) break; var t2 = a[c]; a[c] = a[j]; a[j] = t2; j = c; }
          }
          snap({ slide: 23, line: ml + ',' + (RN + 1) + '-' + (RN + 2), out: m.name, cap: 'removeNext(): removeMin takes the root, <b>' + m.name + '</b> (priority ' + m.p + ', arrival ' + m.o + '), and getElement() returns the name. The heap reorders itself.' });
        }
      });
      if (!ops.length) snap({ slide: 19, line: ms + 1, cap: 'Type operations like add Ann 2, next.' });
      return st;
    },
    draw: function (k, s) {
      var a = s.a, tone = {}; if (s.cmp != null) tone[s.cmp] = 'red'; if (s.at != null) tone[s.at] = 'accent';
      return drawHeap(a, { idOf: function (i) { return 'h' + a[i].id; }, title: function (i) { return a[i].name + ' ' + a[i].p + ' #' + a[i].o; }, nw: 92, tone: tone, y0: 30, dy: 64, w: 440, x0: 80, gmax: 110 }).concat([T('lg', 300, 300, 'each node: element, priority, #arrival order', { anchor: 'middle', size: 11, tone: 'muted' })]);
    }
  };

  /* ---------- 5. the linked heap (slides 25-36) ---------- */
  var LH = 'public void addElement(T obj) {\n  HeapNode<T> node = new HeapNode<T>(obj);\n  if (root == null)\n    root = node;\n  else {\n    HeapNode<T> nextParent = getNextParentAdd();\n    if (nextParent.getLeft() == null)\n      nextParent.setLeft(node);\n    else\n      nextParent.setRight(node);\n    node.setParent(nextParent);\n  }\n  lastNode = node;\n  modCount++;\n  if (size() > 1)\n    heapifyAdd();\n}\nprivate HeapNode<T> getNextParentAdd() {\n  HeapNode<T> result = lastNode;\n  while ((result != root) && (result.getParent().getLeft() != result))\n    result = result.getParent();\n  if (result != root)\n    if (result.getParent().getRight() == null)\n      result = result.getParent();\n    else {\n      result = (HeapNode<T>)result.getParent().getRight();\n      while (result.getLeft() != null)\n        result = (HeapNode<T>)result.getLeft();\n    }\n  else\n    while (result.getLeft() != null)\n      result = (HeapNode<T>)result.getLeft();\n  return result;\n}\nprivate void heapifyAdd() {\n  T temp;\n  HeapNode<T> next = lastNode;\n  temp = next.getElement();\n  while ((next != root) &&\n    (((Comparable)temp).compareTo(next.getParent().getElement()) < 0)) {\n    next.setElement(next.getParent().getElement());\n    next = next.parent;\n  }\n  next.setElement(temp);\n}\npublic T removeMin() throws EmptyCollectionException {\n  if (isEmpty())\n    throw new EmptyCollectionException("LinkedHeap");\n  T minElement = root.getElement();\n  if (size() == 1) {\n    root = null;\n    lastNode = null;\n  }\n  else {\n    HeapNode<T> nextLast = getNewLastNode();\n    if (lastNode.getParent().getLeft() == lastNode)\n      lastNode.getParent().setLeft(null);\n    else\n      lastNode.getParent().setRight(null);\n    ((HeapNode<T>)root).setElement(lastNode.getElement());\n    lastNode = nextLast;\n    heapifyRemove();\n  }\n  modCount++;\n  return minElement;\n}\nprivate HeapNode<T> getNewLastNode() {\n  HeapNode<T> result = lastNode;\n  while ((result != root) && (result.getParent().getLeft() == result))\n    result = result.getParent();\n  if (result != root)\n    result = (HeapNode<T>)result.getParent().getLeft();\n  while (result.getRight() != null)\n    result = (HeapNode<T>)result.getRight();\n  return result;\n}\nprivate void heapifyRemove() {\n  T temp;\n  HeapNode<T> node = (HeapNode<T>)root;\n  HeapNode<T> left = (HeapNode<T>)node.getLeft();\n  HeapNode<T> right = (HeapNode<T>)node.getRight();\n  HeapNode<T> next;\n  if ((left == null) && (right == null))\n    next = null;\n  else if (right == null)\n    next = left;\n  else if (((Comparable)left.getElement()).compareTo(right.getElement()) < 0)\n    next = left;\n  else\n    next = right;\n  temp = node.getElement();\n  while ((next != null) &&\n    (((Comparable)next.getElement()).compareTo(temp) < 0)) {\n    node.setElement(next.getElement());\n    node = next;\n    left = (HeapNode<T>)node.getLeft();\n    right = (HeapNode<T>)node.getRight();\n    if ((left == null) && (right == null))\n      next = null;\n    else if (right == null)\n      next = left;\n    else if (((Comparable)left.getElement()).compareTo(right.getElement()) < 0)\n      next = left;\n    else\n      next = right;\n  }\n  node.setElement(temp);\n}\n// ---- main ----\nLinkedHeap<Integer> heap = new LinkedHeap<Integer>();';
  function hOps(s) { var out = [], re = /(add)\s*(-?\d{1,3})|(removemin|remove|rm)/gi, m; while ((m = re.exec(String(s))) && out.length < 8) out.push(m[1] ? { op: 'add', x: +m[2] } : { op: 'rm' }); return out; }
  function lhCode(v) { var s = nums(v.t, 10); return LH + (s.length ? '\n// start: ' + s.join(', ') + ' added with addElement' : '') + '\n' + hOps(v.ops).map(function (o) { return o.op === 'add' ? 'heap.addElement(' + o.x + ');' : 'System.out.println(heap.removeMin());'; }).join('\n'); }
  var linked = {
    id: 'linked', slides: [25, 36], title: 'LinkedHeap: parent links and the last node', vb: [600, 340],
    code: lhCode,
    inputs: [{ id: 't', type: 'text', label: 'start (added in order)', value: '3 5 4 8 7', minlen: 0, maxlen: 40 }, { id: 'ops', type: 'text', label: 'operations', value: 'add 2, removeMin', minlen: 0, maxlen: 60 }],
    inputsLabel: 'Operations: <code>add 6</code> or <code>removeMin</code> (up to 8).',
    presets: [{ label: 'add 2, then removeMin', values: { t: '3 5 4 8 7', ops: 'add 2, removeMin' } }, { label: 'next parent is on another branch', values: { t: '1 2 3 4 5 6 7', ops: 'add 9' } }, { label: 'new level starts at the far left', values: { t: '1 2 3', ops: 'add 0' } }, { label: 'last node on the far left', values: { t: '1 2 3 4', ops: 'removeMin' } }, { label: 'empty heap', values: { t: '', ops: 'add 5, removeMin, removeMin' } }],
    steps: function (v) {
      var code = lhCode(v), ops = hOps(v.ops), st = [], NID = 0, root = null, last = null, size = 0;
      var ms = L(code, '// ---- main ----'), AE = L(code, 'public void addElement'), GP = L(code, 'private HeapNode<T> getNextParentAdd'), HA = L(code, 'private void heapifyAdd'), RMn = L(code, 'public T removeMin'), GL = L(code, 'private HeapNode<T> getNewLastNode'), HR = L(code, 'private void heapifyRemove');
      var nn = function (x) { return { id: ++NID, el: x, l: null, r: null, p: null }; };
      var nextParent = function () { var r = last; while (r !== root && r.p.l !== r) r = r.p; if (r !== root) { if (r.p.r == null) r = r.p; else { r = r.p.r; while (r.l) r = r.l; } } else while (r.l) r = r.l; return r; };
      var rawAdd = function (x) { var n = nn(x); if (!root) root = n; else { var np = nextParent(); if (!np.l) np.l = n; else np.r = n; n.p = np; } last = n; size++; var nx = last, t = nx.el; while (nx !== root && t < nx.p.el) { nx.el = nx.p.el; nx = nx.p; } nx.el = t; };
      nums(v.t, 10).forEach(rawAdd);
      var bfs = function () { var o = []; if (root) { var q = [root]; while (q.length) { var n = q.shift(); o.push(n); if (n.l) q.push(n.l); if (n.r) q.push(n.r); } } return o; };
      var snap = function (o) { var list = bfs(); o.nodes = list.map(function (n) { return { id: n.id, el: n.el }; }); o.lastId = last ? last.id : null; o.tags = o.tags || {}; st.push(o); return o; };
      snap({ slide: 25, line: ms + 1, cap: 'A LinkedHeap is a linked binary tree where every HeapNode also knows its <b>parent</b>, and the heap keeps <b>lastNode</b>, the last leaf. ' + (size ? 'Start: ' + size + ' nodes.' : 'It starts empty.') });
      ops.forEach(function (o, oi) {
        var ml = ms + 2 + oi + (nums(v.t, 10).length ? 1 : 0);
        if (o.op === 'add') {
          var n = nn(o.x);
          if (!root) { root = n; last = n; size++; snap({ slide: 29, line: ml + ',' + (AE + 1) + '-' + (AE + 3) + ',' + (AE + 12), at: n.id, cap: 'addElement(' + o.x + '): root == null, so the new node is the root, and lastNode = node. One node: no heapifyAdd.' }); return; }
          snap({ slide: 29, line: ml + ',' + (AE + 1) + ',' + (AE + 5), newEl: o.x, cap: 'addElement(' + o.x + '): a new HeapNode. Where does it go? getNextParentAdd() finds the node that will be its <b>parent</b>.' });
          var r = last, tg = function (x, extra) { var t = {}; t[x.id] = 'result'; if (extra) Object.keys(extra).forEach(function (k) { t[k] = extra[k]; }); return t; };
          snap({ slide: 30, line: GP + 1, newEl: o.x, tags: tg(r), at: r.id, cap: 'result = lastNode (' + r.el + ').' });
          while (r !== root && r.p.l !== r) { r = r.p; snap({ slide: 30, line: (GP + 2) + '-' + (GP + 3), newEl: o.x, tags: tg(r), at: r.id, cap: 'result was a <b>right</b> child: go up to its parent (' + r.el + ').' }); }
          if (r !== root) {
            if (r.p.r == null) { r = r.p; snap({ slide: 30, line: (GP + 4) + '-' + (GP + 6), newEl: o.x, tags: tg(r), at: r.id, cap: 'result is a left child and its parent has no right child: the parent (' + r.el + ') gets the new node.' }); }
            else {
              r = r.p.r; snap({ slide: 30, line: (GP + 4) + ',' + (GP + 7) + '-' + (GP + 8), newEl: o.x, tags: tg(r), at: r.id, cap: 'result is a left child: move to its sibling on the right (' + r.el + ').' });
              while (r.l) { r = r.l; snap({ slide: 30, line: (GP + 9) + '-' + (GP + 10), newEl: o.x, tags: tg(r), at: r.id, cap: 'Then go down-left as far as possible: ' + r.el + '.' }); }
            }
          } else {
            snap({ slide: 30, line: (GP + 2) + ',' + (GP + 12), newEl: o.x, tags: tg(r), at: r.id, cap: 'result reached the <b>root</b>: the bottom level is full. A new level starts at the far left.' });
            while (r.l) { r = r.l; snap({ slide: 30, line: (GP + 13) + '-' + (GP + 14), newEl: o.x, tags: tg(r), at: r.id, cap: 'Go down-left: ' + r.el + '.' }); }
          }
          var side = !r.l ? 'Left' : 'Right'; if (!r.l) r.l = n; else r.r = n; n.p = r; last = n; size++;
          snap({ slide: 29, line: (side === 'Left' ? AE + 7 : AE + 9) + ',' + (AE + 10) + ',' + (AE + 12), at: n.id, cap: 'nextParent = ' + r.el + ': set' + side + '(node), node.setParent(' + r.el + '), and lastNode = the new node.' });
          var nx = last, t = nx.el, tags = function (x) { var q = {}; q[x.id] = 'next'; return q; };
          snap({ slide: 31, line: (AE + 15) + ',' + (HA + 2) + '-' + (HA + 3), temp: t, tags: tags(nx), at: nx.id, cap: 'size() &gt; 1, so heapifyAdd(): next = lastNode, temp = ' + t + '. The element is kept in temp while parents move down.' });
          while (nx !== root && t < nx.p.el) {
            var pe = nx.p.el; nx.el = pe; nx = nx.p;
            snap({ slide: 31, line: (HA + 4) + '-' + (HA + 7), temp: t, tags: tags(nx), at: nx.id, cap: t + ' &lt; parent ' + pe + ': copy ' + pe + ' <b>down</b> into next, then next = next.parent.' });
          }
          nx.el = t;
          snap({ slide: 31, line: HA + 9, tags: tags(nx), at: nx.id, cap: nx === root ? 'next is the root: the loop ends. next.setElement(' + t + '): ' + t + ' is the new minimum.' : t + ' is not smaller than its parent ' + nx.p.el + ': the loop ends. next.setElement(' + t + ').' });
        } else {
          if (!root) { snap({ slide: 32, line: ml + ',' + (RMn + 1) + '-' + (RMn + 2), out: 'Exception in thread "main" jsjf.exceptions.EmptyCollectionException: LinkedHeap', cap: 'The heap is empty: removeMin throws an <b>EmptyCollectionException</b>.' }); return; }
          var minE = root.el;
          if (size === 1) { root = null; last = null; size = 0; snap({ slide: 32, line: ml + ',' + (RMn + 3) + '-' + (RMn + 6) + ',' + (RMn + 19), out: String(minE), cap: 'minElement = ' + minE + '. size() == 1: root = null, lastNode = null. Return ' + minE + '.' }); return; }
          snap({ slide: 32, line: ml + ',' + (RMn + 3), at: root.id, cap: 'removeMin(): minElement = root element (' + minE + '). The root node stays; only its element will change.' });
          var g = last, tg2 = function (x) { var t = {}; t[x.id] = 'result'; return t; };
          snap({ slide: 34, line: (RMn + 9) + ',' + (GL + 1), tags: tg2(g), at: g.id, cap: 'First find the node that will be the <b>new</b> last node: getNewLastNode(). result = lastNode (' + g.el + ').' });
          while (g !== root && g.p.l === g) { g = g.p; snap({ slide: 34, line: (GL + 2) + '-' + (GL + 3), tags: tg2(g), at: g.id, cap: 'result was a <b>left</b> child: go up (' + g.el + ').' }); }
          if (g !== root) { g = g.p.l; snap({ slide: 34, line: (GL + 4) + '-' + (GL + 5), tags: tg2(g), at: g.id, cap: 'result is a right child: move to its sibling on the left (' + g.el + ').' }); }
          while (g.r) { g = g.r; snap({ slide: 34, line: (GL + 6) + '-' + (GL + 7), tags: tg2(g), at: g.id, cap: 'Go down-right as far as possible: ' + g.el + '.' }); }
          var nextLast = g, old = last, isL = old.p.l === old, le = old.el;
          var tq = {}; tq[nextLast.id] = 'nextLast'; tq[old.id] = 'lastNode';
          snap({ slide: 33, line: (RMn + 9) + ',' + (GL + 8), tags: tq, cut: old.id, cap: 'nextLast = ' + nextLast.el + '. Now unlink the old lastNode (' + le + ') from its parent.' });
          if (isL) old.p.l = null; else old.p.r = null;
          root.el = le; last = nextLast; size--;
          var tq2 = {}; tq2[root.id] = 'node'; tq2[last.id] = (last === root ? 'node, ' : '') + 'lastNode';
          snap({ slide: 33, line: (RMn + 10) + '-' + (RMn + 15), tags: tq2, at: root.id, cap: 'set' + (isL ? 'Left' : 'Right') + '(null) cuts it off; root.setElement(' + le + ') puts its element in the root; lastNode = nextLast. Then heapifyRemove().' });
          var node = root, pick = function (nd) { var l = nd.l, rr = nd.r; return !l && !rr ? null : !rr ? l : l.el < rr.el ? l : rr; };
          var nxt = pick(node), tmp = node.el, tg3 = function () { var t = {}; t[node.id] = 'node'; if (nxt) t[nxt.id] = 'next'; return t; };
          snap({ slide: 35, line: (HR + 2) + '-' + (HR + 13), temp: tmp, tags: tg3(), at: node.id, cap: 'heapifyRemove(): node = root; next = ' + (nxt ? 'the smaller child (' + nxt.el + ')' : 'null (no children)') + '; temp = ' + tmp + '.' });
          while (nxt && nxt.el < tmp) {
            var ce = nxt.el; node.el = ce; node = nxt; nxt = pick(node);
            snap({ slide: 36, line: (HR + 14) + '-' + (HR + 28), temp: tmp, tags: tg3(), at: node.id, cap: ce + ' &lt; ' + tmp + ': copy ' + ce + ' <b>up</b>, node moves down; next = ' + (nxt ? 'its smaller child ' + nxt.el : 'null') + '.' });
          }
          node.el = tmp;
          snap({ slide: 36, line: (HR + 30) + ',' + (RMn + 18) + '-' + (RMn + 19) + ',' + ml, out: String(minE), tags: tg3(), at: node.id, cap: (nxt ? nxt.el + ' is not smaller than ' + tmp : 'No child left') + ': node.setElement(' + tmp + '). removeMin returns ' + minE + '.' });
        }
      });
      if (!ops.length) snap({ slide: 28, line: ms + 1, cap: 'Type operations like add 2, removeMin.' });
      return st;
    },
    draw: function (k, s) {
      var a = s.nodes, tone = {}, tags = {}, idx = {};
      a.forEach(function (n, i) { idx[n.id] = i; if (n.id === s.lastId) tone[i] = 'teal'; });
      Object.keys(s.tags).forEach(function (id) { if (idx[id] != null) tags[idx[id]] = s.tags[id]; });
      if (s.lastId != null && idx[s.lastId] != null && !/lastNode/.test(tags[idx[s.lastId]] || '')) tags[idx[s.lastId]] = (tags[idx[s.lastId]] ? tags[idx[s.lastId]] + ', ' : '') + 'lastNode';
      if (s.at != null && idx[s.at] != null) tone[idx[s.at]] = 'accent'; if (s.cut != null && idx[s.cut] != null) tone[idx[s.cut]] = 'red';
      var items = drawHeap(a, { idOf: function (i) { return 'n' + a[i].id; }, title: function (i) { return String(a[i].el); }, tone: tone, tags: tags, y0: 40, dy: 60, w: 420, x0: 40, gmax: 70 });
      items = items.concat(tempBox(s.temp, 500, 40));
      if (s.newEl != null) items.push(B('newn', 500, 100, 84, 34, { title: 'new ' + s.newEl, mono: true, size: 13, tone: 'accent', fill: 'soft', dash: true }));
      items.push(T('lg', 300, 330, 'green: lastNode · orange: the node the code is at now', { anchor: 'middle', size: 11, tone: 'muted' }));
      return items;
    }
  };

  /* ---------- 6. the array heap (slides 37-45) ---------- */
  var AH = 'public void addElement(T obj) {\n  if (count == tree.length)\n    expandCapacity();\n  tree[count] = obj;\n  count++;\n  modCount++;\n  if (count > 1)\n    heapifyAdd();\n}\nprivate void heapifyAdd() {\n  T temp;\n  int next = count - 1;\n  temp = tree[next];\n  while ((next != 0) &&\n    (((Comparable)temp).compareTo(tree[(next-1)/2]) < 0)) {\n    tree[next] = tree[(next-1)/2];\n    next = (next-1)/2;\n  }\n  tree[next] = temp;\n}\npublic T removeMin() throws EmptyCollectionException {\n  if (isEmpty())\n    throw new EmptyCollectionException("ArrayHeap");\n  T minElement = tree[0];\n  tree[0] = tree[count-1];\n  heapifyRemove();\n  count--;\n  modCount--;\n  return minElement;\n}\nprivate void heapifyRemove() {\n  T temp;\n  int node = 0;\n  int left = 1;\n  int right = 2;\n  int next;\n  if ((tree[left] == null) && (tree[right] == null))\n    next = count;\n  else if (tree[right] == null)\n    next = left;\n  else if (((Comparable)tree[left]).compareTo(tree[right]) < 0)\n    next = left;\n  else\n    next = right;\n  temp = tree[node];\n  while ((next < count) &&\n    (((Comparable)tree[next]).compareTo(temp) < 0)) {\n    tree[node] = tree[next];\n    node = next;\n    left = 2 * node + 1;\n    right = 2 * (node + 1);\n    if ((tree[left] == null) && (tree[right] == null))\n      next = count;\n    else if (tree[right] == null)\n      next = left;\n    else if (((Comparable)tree[left]).compareTo(tree[right]) < 0)\n      next = left;\n    else\n      next = right;\n  }\n  tree[node] = temp;\n}\n// ---- main ----\nArrayHeap<Integer> heap = new ArrayHeap<Integer>();';
  function ahCode(v) { var s = nums(v.t, 10); return AH + (s.length ? '\n// start: ' + s.join(', ') + ' added with addElement' : '') + '\n' + hOps(v.ops).map(function (o) { return o.op === 'add' ? 'heap.addElement(' + o.x + ');' : 'System.out.println(heap.removeMin());'; }).join('\n'); }
  var arrheap = {
    id: 'arrheap', slides: [37, 45], title: 'ArrayHeap: the parent of n is at (n-1)/2', vb: [600, 340],
    code: ahCode,
    inputs: [{ id: 't', type: 'text', label: 'start (added in order)', value: '3 5 4 8 7 9', minlen: 0, maxlen: 40 }, { id: 'ops', type: 'text', label: 'operations', value: 'add 2, removeMin', minlen: 0, maxlen: 60 }],
    inputsLabel: 'Operations: <code>add 6</code> or <code>removeMin</code> (up to 8). Grey cells are at or after <code>count</code>.',
    presets: [{ label: 'add 2, then removeMin', values: { t: '3 5 4 8 7 9', ops: 'add 2, removeMin' } }, { label: 'removeMin three times', values: { t: '2 4 3 9 5 6', ops: 'removeMin, removeMin, removeMin' } }, { label: 'add to an empty heap', values: { t: '', ops: 'add 8, add 6, add 7, add 1' } }, { label: 'empty: exception', values: { t: '', ops: 'add 4, removeMin, removeMin' } }],
    steps: function (v) {
      var code = ahCode(v), ops = hOps(v.ops), st = [], tree = [], count = 0, mod = 0;
      var ms = L(code, '// ---- main ----'), AE = L(code, 'public void addElement'), HA = L(code, 'private void heapifyAdd'), RMn = L(code, 'public T removeMin'), HR = L(code, 'private void heapifyRemove');
      var cell = function (i) { return tree[i] === undefined ? null : tree[i]; };
      var rawAdd = function (x) { tree[count] = x; count++; var nx = count - 1, t = tree[nx]; while (nx !== 0 && t < tree[(nx - 1) >> 1]) { tree[nx] = tree[(nx - 1) >> 1]; nx = (nx - 1) >> 1; } tree[nx] = t; };
      nums(v.t, 10).forEach(rawAdd);
      var snap = function (o) { o.tree = tree.slice(); o.count = count; o.mod = mod; st.push(o); return o; };
      snap({ slide: 37, line: ms + 1, cap: 'A heap is a complete tree, so it fits an array with no gaps: the children of n are at <b>2n+1</b> and <b>2n+2</b>, and the parent of n is at <b>(n−1)/2</b>. count = ' + count + '.' });
      snap({ slide: 38, line: ms + 1, cap: 'ArrayHeap extends ArrayBinaryTree: it has <code>count</code> (the number of elements) and the array <code>tree</code> (capacity 50 at the start).' });
      ops.forEach(function (o, oi) {
        var ml = ms + 2 + oi + (nums(v.t, 10).length ? 1 : 0);
        if (o.op === 'add') {
          tree[count] = o.x; count++; mod++;
          snap({ slide: 41, line: ml + ',' + (AE + 1) + ',' + (AE + 3) + '-' + (AE + 5), at: count - 1, cap: 'addElement(' + o.x + '): tree[' + (count - 1) + '] = ' + o.x + '; count++ → ' + count + '. (count == tree.length would call expandCapacity first.)' });
          if (count > 1) {
            var nx = count - 1, t = tree[nx];
            snap({ slide: 42, line: (AE + 6) + '-' + (AE + 7) + ',' + (HA + 2) + '-' + (HA + 3), at: nx, temp: t, cap: 'heapifyAdd(): next = count − 1 = ' + nx + ', temp = ' + t + '.' });
            while (nx !== 0 && t < tree[(nx - 1) >> 1]) {
              var p = (nx - 1) >> 1;
              snap({ slide: 42, line: (HA + 4) + '-' + (HA + 5), at: nx, cmp: p, temp: t, cap: 'next = ' + nx + ', parent index (' + nx + '−1)/2 = ' + p + ' holds ' + tree[p] + '. ' + t + ' &lt; ' + tree[p] + ': keep going.' });
              tree[nx] = tree[p]; nx = p;
              snap({ slide: 42, line: (HA + 6) + '-' + (HA + 7), at: nx, temp: t, cap: 'tree[next] = tree[parent]: ' + tree[nx] + ' is copied <b>down</b>; next = ' + nx + '.' });
            }
            tree[nx] = t;
            snap({ slide: 42, line: HA + 9, at: nx, cap: (nx === 0 ? 'next is 0 (the root)' : t + ' is not smaller than tree[' + ((nx - 1) >> 1) + '] = ' + tree[(nx - 1) >> 1]) + ': tree[' + nx + '] = temp = ' + t + '.' });
          }
        } else {
          if (!count) { snap({ slide: 43, line: ml + ',' + (RMn + 1) + '-' + (RMn + 2), out: 'Exception in thread "main" jsjf.exceptions.EmptyCollectionException: ArrayHeap', cap: 'count is 0: removeMin throws an <b>EmptyCollectionException</b>.' }); return; }
          var minE = tree[0]; tree[0] = tree[count - 1];
          snap({ slide: 43, line: ml + ',' + (RMn + 3) + '-' + (RMn + 4), at: 0, cap: 'removeMin(): minElement = tree[0] = ' + minE + '; tree[0] = tree[count−1] = ' + tree[0] + '. Notice: the old cell ' + (count - 1) + ' still holds ' + tree[count - 1] + ', and count is not changed yet.' });
          var node = 0, left = 1, right = 2, next;
          var pick = function () { if (cell(left) == null && cell(right) == null) return count; if (cell(right) == null) return left; return tree[left] < tree[right] ? left : right; };
          next = pick(); var tmp = tree[node];
          snap({ slide: 44, line: (RMn + 5) + ',' + (HR + 2) + '-' + (HR + 13), at: node, cmp: next < count ? next : undefined, temp: tmp, nxt: next, cap: 'heapifyRemove(): node = 0, left = 1, right = 2. next = ' + next + (next < count ? ' (tree[' + next + '] = ' + tree[next] + ')' : ' = count: no child to look at') + '; temp = ' + tmp + '.' });
          while (next < count && tree[next] < tmp) {
            tree[node] = tree[next]; node = next; left = 2 * node + 1; right = 2 * (node + 1); next = pick();
            snap({ slide: 45, line: (HR + 15) + '-' + (HR + 28), at: node, cmp: next < count ? next : undefined, temp: tmp, nxt: next, cap: tree[node] + ' &lt; ' + tmp + ': copy it <b>up</b>; node = ' + node + ', left = ' + left + ', right = ' + right + ', next = ' + next + (next < count ? ' (' + tree[next] + ')' : ' (= count or more: stop)') + '.' });
          }
          tree[node] = tmp; count--; mod--;
          snap({ slide: 43, line: (HR + 30) + ',' + (RMn + 6) + '-' + (RMn + 8) + ',' + ml, at: node, out: String(minE), cap: 'tree[' + node + '] = temp = ' + tmp + '. Back in removeMin: count-- → ' + count + '; return ' + minE + '. (The slide writes modCount-- here; adding uses modCount++.)' });
        }
      });
      if (!ops.length) snap({ slide: 40, line: ms + 1, cap: 'Type operations like add 2, removeMin.' });
      return st;
    },
    draw: function (k, s) {
      var tree = s.tree, n = s.count, tone = {}; if (s.cmp != null) tone[s.cmp] = 'red'; if (s.at != null) tone[s.at] = 'accent';
      var upto = Math.max(n, tree.length);
      var items = drawHeap(tree, { n: n, tone: tone, title: function (i) { return tree[i] == null ? '' : String(tree[i]); }, y0: 24, dy: 50, w: 400, x0: 40, cells: { y: 262, upto: Math.max(upto, 1), count: n } });
      items = items.concat(tempBox(s.temp, 500, 30));
      if (s.nxt != null) items.push(T('nx', 542, 90, 'next = ' + s.nxt, { anchor: 'middle', mono: true, size: 13, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* ---------- 7. heap sort (slides 46-47) ---------- */
  var HS = 'public class HeapSort<T> {\n  public void HeapSort(T[] data) {\n    ArrayHeap<T> temp = new ArrayHeap<T>();\n    // copy the array into a heap\n    for (int i = 0; i < data.length; i++)\n      temp.addElement(data[i]);\n    // place the sorted elements back into the array\n    int count = 0;\n    while (!(temp.isEmpty())) {\n      data[count] = temp.removeMin();\n      count++;\n    }\n  }\n}\n// ---- main ----';
  function hsCode(v) { var d = nums(v.d, 10); return HS + '\nInteger[] data = {' + d.join(', ') + '};\nnew HeapSort<Integer>().HeapSort(data);\nSystem.out.println(Arrays.toString(data));'; }
  var hsort = {
    id: 'hsort', slides: [46, 47], title: 'Heap sort: add everything, then removeMin again and again', vb: [600, 340],
    code: hsCode,
    inputs: [{ id: 'd', type: 'text', label: 'data', value: '6 2 9 4 1 7', minlen: 1, maxlen: 40 }],
    presets: [{ label: 'mixed', values: { d: '6 2 9 4 1 7' } }, { label: 'already sorted', values: { d: '1 2 3 4 5 6' } }, { label: 'backwards', values: { d: '6 5 4 3 2 1' } }, { label: 'with copies', values: { d: '5 3 5 1 3' } }, { label: 'one element', values: { d: '8' } }],
    steps: function (v) {
      var code = hsCode(v), d = nums(v.d, 10), st = [], heap = [], out = d.map(function () { return null; }), ids = d.map(function (x, i) { return i + 1; }), hid = [], sw = 0;
      var LA = L(code, 'temp.addElement(data[i])'), LR = L(code, 'data[count] = temp.removeMin()'), LM = L(code, 'new HeapSort<Integer>()');
      var snap = function (o) { o.heap = heap.slice(); o.hid = hid.slice(); o.slots = out.slice(); o.data = d; st.push(o); return o; };
      snap({ slide: 46, line: (LM - 1) + '-' + LM + ',' + (LM - 12) + '-' + (LM - 11), cap: 'Heap sort uses a heap as a helper: first <b>add</b> every element (the heap keeps the smallest on top), then <b>removeMin</b> again and again.' });
      d.forEach(function (x, i) {
        heap.push(x); hid.push(ids[i]); var j = heap.length - 1, mv = 0;
        while (j > 0 && heap[j] < heap[(j - 1) >> 1]) { var p = (j - 1) >> 1, t = heap[p]; heap[p] = heap[j]; heap[j] = t; t = hid[p]; hid[p] = hid[j]; hid[j] = t; j = p; mv++; }
        sw += mv;
        snap({ slide: 47, line: (LA - 1) + '-' + LA, at: j, cap: 'i = ' + i + ': temp.addElement(' + x + ')' + (mv ? ': it moved up ' + mv + ' level' + (mv === 1 ? '' : 's') + '.' : ': it stays at the bottom.') });
      });
      var c = 0;
      while (heap.length) {
        var m = heap[0], mid = hid[0], last = heap.pop(), lid = hid.pop();
        if (heap.length) {
          heap[0] = last; hid[0] = lid; var j2 = 0;
          for (;;) { var l = 2 * j2 + 1, r = l + 1; if (l >= heap.length) break; var cc = r < heap.length && !(heap[l] < heap[r]) ? r : l; if (!(heap[cc] < heap[j2])) break; var t2 = heap[cc]; heap[cc] = heap[j2]; heap[j2] = t2; t2 = hid[cc]; hid[cc] = hid[j2]; hid[j2] = t2; j2 = cc; }
        }
        out[c] = { v: m, id: mid };
        snap({ slide: 47, line: (LR - 1) + '-' + (LR + 1), put: c, cap: 'count = ' + c + ': data[' + c + '] = temp.removeMin() = <b>' + m + '</b>. The smallest left always comes off first.' });
        c++;
      }
      snap({ slide: 47, line: (LR + 1) + ',' + (LM + 1), out: '[' + out.map(function (e) { return e.v; }).join(', ') + ']', cap: 'The heap is empty, the array is sorted in ascending order. n adds and n removals, each O(log n): heap sort is <b>O(n log n)</b>.' });
      return st;
    },
    draw: function (k, s) {
      var heap = s.heap, hid = s.hid, tone = {}; if (s.at != null) tone[s.at] = 'accent';
      var items = drawHeap(heap, { idOf: function (i) { return 'h' + hid[i]; }, tone: tone, title: function (i) { return String(heap[i]); }, y0: 24, dy: 50, w: 440, x0: 80, empty: false });
      var n = s.data.length, cw = Math.min(48, Math.floor(520 / n)), x0 = 300 - n * cw / 2;
      items.push(T('dl', x0 - 8, 296, 'data', { anchor: 'end', mono: true, size: 12, bold: true, tone: 'muted' }));
      for (var i = 0; i < n; i++) {
        var e = s.slots[i];
        items.push(B('slot' + i, x0 + i * cw + 1, 280, cw - 2, 30, { title: '', tone: 'muted', fill: 'soft', dash: true }));
        if (e) items.push(B('h' + e.id, x0 + i * cw + 4, 283, cw - 8, 24, { title: String(e.v), mono: true, size: 12, tone: s.put === i ? 'accent' : 'teal', fill: s.put === i ? 'solid' : 'soft' }));
        items.push(T('di' + i, x0 + i * cw + cw / 2, 274, String(i), { anchor: 'middle', mono: true, size: 10, tone: 'muted' }));
      }
      return items;
    }
  };

  var code = function (t) { return { type: 'code', lang: 'java', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; };
  var cs = function (n) { return [code(SC[n])]; };

  addUnit({
    course: 'ds', lesson: '12-heaps',
    blurb: 'Minheaps (complete tree, parent ≤ children), adding with a move up, removeMin with a move down, priority queues, linked and array heaps, and heap sort.',
    parts: [
      { title: 'Heaps, conceptually', from: 1, to: 7 },
      { title: 'Adding and removing', from: 8, to: 17 },
      { title: 'Priority queues', from: 18, to: 24 },
      { title: 'A linked heap', from: 25, to: 36 },
      { title: 'An array heap and heap sort', from: 37, to: 47 }
    ],
    visuals: [heapdef, heapadd, heaprem, pq, linked, arrheap, hsort],
    slides: {
      1: { cover: true, explain: '<p>A <b>heap</b> is a special binary tree that always keeps its <b>smallest</b> element at the root, so you can get the minimum at once.</p><pre class="ex">      3\n    /   \\\n   5     4</pre><p>A <b>priority queue</b> ({{priority|أولوية}}: who is served first) is built on a heap. This unit: the heap rules, adding, removing, two implementations and heap sort.</p>' },
      2: { explain: '<p>The four topics of the chapter:</p><pre class="ex">1. what a heap is\n2. using heaps (add, remove, exercises)\n3. implementing heaps (links, arrays)\n4. priority queues built on heaps</pre><p>The slides first show the ideas with pictures, then the Java code.</p>' },
      3: { explain: '<p>A (min)heap has <b>two</b> rules:</p><pre class="ex">shape: a complete binary tree\norder: every element &lt;= both of its children</pre><p>So the smallest element is always at the root. A <b>maxheap</b> is the opposite: every element &gt;= its children, and the largest is at the root.</p><p class="watch">Unlike a BST, left and right have no order: the left child may be bigger or smaller than the right child.</p>' },
      4: { text: false, blocks: [bul('Operations on a heap:')], explain: '<p>A heap has three operations of its own:</p><pre class="ex">addElement  add an element\nremoveMin   remove (and return) the smallest\nfindMin     look at the smallest</pre><p>There is no "find any element" or "remove any element": a heap is made for one job, giving the minimum fast.</p>' },
      5: { blocks: cs(5), explain: '<p><code>HeapADT&lt;T&gt;</code> is an interface that <b>extends</b> BinaryTreeADT: a heap is also a binary tree, so it has size, isEmpty, the iterators and so on.</p><pre class="ex">void addElement(T obj);\nT removeMin();\nT findMin();</pre><p>The javadoc comments (/** … */) describe each method; tools turn them into documentation.</p>' },
      6: { text: false, explain: '<p>The UML picture of the same interfaces: HeapADT adds three methods, and the dashed arrow with a hollow head means "<b>extends</b>" (an interface extending an interface).</p><pre class="ex">HeapADT: addElement, removeMin, findMin\nBinaryTreeADT: getRootElement, size, find, iterators …</pre><p>The small box with T shows that both are generic.</p>' },
      7: { text: false, blocks: [bul('Two minheaps containing the same data:')], explain: '<p>The same six numbers (3, 4, 5, 7, 8, 9) in two different valid heaps:</p><pre class="ex">left:  3 / 5 4 / 8 7 9\nright: 3 / 7 4 / 8 9 5</pre><p>Both follow the rules: complete shape, and every parent ≤ its children. Only the root is fixed: it must be the minimum, 3.</p><p class="watch">A heap is <b>not</b> sorted. 5 sits below 7 in the right heap, on another branch.</p>' },
      8: { explain: '<p>Adding keeps both rules:</p><pre class="ex">1. shape: put the new element in the next free\n   leaf place (the tree stays complete)\n2. order: while it is smaller than its parent,\n   swap them (it moves up)</pre><p>It stops at the root or below a parent that is not bigger. At most one swap per level: O(log n).</p>' },
      9: { text: false, blocks: [bul('The initial insertion point for a new element in a heap:')], explain: '<p>The next insertion point is always the first empty place on the bottom level, from the left.</p><pre class="ex">left heap:  right child of 4\nright heap: the bottom level is full,\n            so a new level starts under 8</pre><p class="watch">The new element goes there first, whatever its value. Only after that does it move up.</p>' },
      10: { text: false, blocks: [bul('Inserting an element and moving it up the tree as far as appropriate:')], explain: '<p>Adding 2:</p><pre class="ex">2 goes under 4 (next place)\n2 &lt; 4 → swap\n2 &lt; 3 → swap: 2 is the root</pre><p>Each swap moves 2 up one level and the parent down one level. The other parts of the tree (5, 8, 7) do not change at all.</p>' },
      11: { text: false, blocks: [bul('How would this minheap be updated if we add the following numbers: 32, 11, 7')], explain: '<p>An exercise: add 32, then 11, then 7, one at a time. For each one:</p><pre class="ex">place it in the next free spot\ncompare with the parent, swap while smaller</pre><p>Try it on paper first, then check with the drawing (preset "slide 11"). Notice there are two 56s: equal values are fine in a heap.</p>' },
      12: { text: false, explain: '<p>The solution, step by step:</p><pre class="ex">32: under 57 → swap with 57, swap with 34\n11: under 34 → swaps with 34, 32 and 12\n 7: under 56 → swaps with 56, 47 and 11</pre><p>7 becomes the root. Every element was added as a leaf and moved up only as far as needed.</p>' },
      13: { explain: '<p>removeMin takes the root, then repairs the heap:</p><pre class="ex">1. move the LAST leaf to the root\n   (the tree stays complete)\n2. while a child is smaller, swap it\n   with the SMALLER of its children</pre><p>It moves down until both children are bigger, or it is a leaf. O(log n).</p><p class="watch">Swap with the smaller child, or the bigger child would end up above the smaller one.</p>' },
      14: { text: false, blocks: [bul('The element to replace the root is the "last leaf" in the tree:')], explain: '<p>The "last leaf" is the right-most node on the bottom level: the last element added (in level order).</p><pre class="ex">left heap:   last leaf 9\nmiddle heap: last leaf 4\nright heap:  last leaf 8</pre><p>Taking that one keeps the tree complete: the bottom level just gets one node shorter.</p>' },
      15: { text: false, explain: '<p>Removing 3:</p><pre class="ex">9 (last leaf) moves to the root\nchildren 5 and 4: smaller is 4, 4 &lt; 9 → swap\n9 is now a leaf → stop</pre><p>The new root is 4: the next smallest. The heap again follows both rules.</p>' },
      16: { text: false, blocks: [bul('How would this heap be updated if we remove the 3 minimum numbers: 7, 11 and 12')], explain: '<p>An exercise: call removeMin three times. Each time:</p><pre class="ex">the last leaf goes to the root\nswap it down with the smaller child</pre><p>Work it out on paper, then check with the drawing (preset "slide 16"). Watch how the last leaf changes after each removal.</p>' },
      17: { text: false, explain: '<p>The result after removing 7, 11 and 12:</p><pre class="ex">7:  56 to the root → 11, 47 move up\n11: 34 to the root → 12, 32 move up\n12: 57 to the root → 32, 34 move up</pre><p>The root is now 32, the smallest of what is left. The heap went from 12 nodes to 9.</p>' },
      18: { explain: '<p>A normal <b>queue</b> is FIFO: first in, first out. A <b>priority queue</b> serves by priority, whatever the arrival order.</p><pre class="ex">hospital: the most urgent patient first\nprinter: short jobs before long ones</pre><p>A minheap fits perfectly: removeMin always gives the element with the smallest value, the highest priority.</p>' },
      19: { blocks: cs(19), explain: '<p><b>PrioritizedObject</b> wraps an element with two numbers:</p><pre class="ex">priority      given by the user\narrivalOrder  0, 1, 2 … in order of creation</pre><p><code>nextOrder</code> is <b>static</b>: one counter shared by all objects. Each constructor copies it and adds 1, so every object gets the next number.</p>' },
      20: { blocks: cs(20), explain: '<p>Three getters: <code>getElement</code>, <code>getPriority</code> and <code>getArrivalOrder</code>.</p><pre class="ex">new PrioritizedObject&lt;&gt;("Ann", 2)\ngetPriority() → 2\ngetArrivalOrder() → 0 (the first one)</pre><p>compareTo (next slide) uses them to compare two objects.</p>' },
      21: { blocks: cs(21), explain: '<p>compareTo decides who comes first:</p><pre class="ex">smaller priority      → -1 (comes first)\nsame priority, earlier arrival → -1\notherwise             → 1</pre><p>So equal priorities are served first come, first served. It never returns 0: two objects always have different arrival orders.</p><p class="watch">The comment says "higher priority" returns 1, but here a <b>bigger number</b> returns 1 and goes later. A small number means urgent.</p>' },
      22: { blocks: cs(22), explain: '<p><b>PriorityQueue&lt;T&gt;</b> extends <code>ArrayHeap&lt;PrioritizedObject&lt;T&gt;&gt;</code>: it is a heap of wrapped objects.</p><pre class="ex">addElement("Ann", 2):\n  wrap it → PrioritizedObject("Ann", 2)\n  super.addElement(obj)   // the heap add</pre><p>The heap uses compareTo of PrioritizedObject to move the object up.</p>' },
      23: { blocks: cs(23), explain: '<p>removeNext() calls the heap’s <code>removeMin()</code>: the object with the smallest priority (earliest arrival on ties). Then it unwraps it with <code>getElement()</code>.</p><pre class="ex">Ann 2, Bob 1, Cy 2  →  Bob, Ann, Cy</pre><p class="watch">removeMin returns T of the heap, so the result is cast to <code>PrioritizedObject&lt;T&gt;</code>.</p>' },
      24: { explain: '<p>This slide has no content: it only marks where the material for one semester (Fall 2024) stopped. The slides after it show how a heap is implemented: with links, and with an array.</p><pre class="ex">next: LinkedHeap, ArrayHeap, heap sort</pre>' },
      25: { explain: '<p>A linked heap must move <b>up</b> (adding) and <b>down</b> (removing). Moving up needs a link to the parent:</p><pre class="ex">HeapNode = BinaryTreeNode + parent\nLinkedHeap keeps lastNode (the last leaf)</pre><p><code>lastNode</code> tells where the last element is: it is needed to find the next free place and the leaf that moves to the root.</p>' },
      26: { blocks: cs(26), explain: '<p><b>HeapNode&lt;T&gt;</b> extends BinaryTreeNode (element, left, right) and adds one field:</p><pre class="ex">protected HeapNode&lt;T&gt; parent;</pre><p>The constructor calls <code>super(obj)</code> for the element and sets <code>parent = null</code>; the heap sets the real parent when it links the node.</p>' },
      27: { blocks: cs(27), explain: '<p>Three small methods: <code>getParent()</code>, <code>setElement(obj)</code> and <code>setParent(node)</code>.</p><pre class="ex">setElement: change the value in a node\nsetParent:  link a node to its parent</pre><p>setElement matters: the heap moves <b>elements</b> between nodes, not the nodes themselves.</p><p class="watch">The javadoc of setElement says <code>@param the element</code>: the parameter name (obj) is missing.</p>' },
      28: { blocks: cs(28), explain: '<p><b>LinkedHeap&lt;T&gt;</b> extends LinkedBinaryTree (it gets <code>root</code>, size and the iterators) and implements HeapADT.</p><pre class="ex">public HeapNode&lt;T&gt; lastNode;</pre><p>The constructor just calls <code>super()</code>: an empty tree.</p><p class="watch">lastNode is <b>public</b> on the slide: any class could change it. protected or private would be safer.</p>' },
      29: { blocks: cs(29), explain: '<p>addElement in three steps:</p><pre class="ex">1. empty heap → the new node is the root\n2. else link it under getNextParentAdd()\n   (left if free, else right) + set its parent\n3. lastNode = node; heapifyAdd() if size &gt; 1</pre><p>Step 2 keeps the shape, step 3 fixes the order.</p>' },
      30: { blocks: cs(30), explain: '<p>getNextParentAdd finds the parent of the next free place, starting at lastNode:</p><pre class="ex">go up while result is a right child\nleft child, parent has no right → the parent\nleft child, parent full → go to the sibling,\n  then down-left to the bottom\nreached the root → new level: far left</pre><p>Try each case in the drawing; it is the hardest method of the unit.</p>' },
      31: { blocks: cs(31), explain: '<p>heapifyAdd moves the new element up, but it does not swap. It keeps the element in <code>temp</code> and copies each bigger parent <b>down</b> one level:</p><pre class="ex">while temp &lt; parent:\n  next.element = parent.element\n  next = next.parent\nnext.element = temp</pre><p>Fewer writes than swapping, same result.</p>' },
      32: { blocks: cs(32), explain: '<p>removeMin starts by saving the root’s element:</p><pre class="ex">empty → throw EmptyCollectionException\nminElement = root.getElement()\nsize 1 → root = null, lastNode = null</pre><p>For a one-element heap, removing makes the heap empty; no reordering is needed.</p>' },
      33: { blocks: cs(33), explain: '<p>With more than one node:</p><pre class="ex">nextLast = getNewLastNode()   // find it first\ncut lastNode from its parent\nroot.element = lastNode.element\nlastNode = nextLast\nheapifyRemove()</pre><p>The new last node is found <b>before</b> the old one is cut, while the links still exist.</p>' },
      34: { blocks: cs(34), explain: '<p>getNewLastNode finds the leaf before lastNode in level order:</p><pre class="ex">go up while result is a left child\nnot the root → go to the left sibling\nthen down-right as far as possible</pre><p>It mirrors getNextParentAdd: there we went up from right children and then down-left.</p><p class="watch">The javadoc says "willbe" (a typo for "will be").</p>' },
      35: { blocks: cs(35), explain: '<p>heapifyRemove starts at the root. <code>next</code> is the child to compare with:</p><pre class="ex">no children   → next = null\nonly left     → next = left\nboth          → the smaller one\n                (equal → right)</pre><p>The element of the root is kept in <code>temp</code>.</p>' },
      36: { blocks: cs(36), explain: '<p>While the chosen child is smaller than temp, its element is copied <b>up</b> and <code>node</code> moves down; then the next child is chosen the same way.</p><pre class="ex">node.element = next.element\nnode = next\n…\nnode.element = temp</pre><p>Like heapifyAdd, it copies instead of swapping, and writes temp once at the end.</p>' },
      37: { explain: '<p>A heap is always complete, so an array has <b>no gaps</b>:</p><pre class="ex">children of n: 2n + 1 and 2n + 2\nparent of n:   (n − 1) / 2   (int division)\nindex 4 → parent 1, children 9 and 10</pre><p>No links and no lastNode are needed: the last element is at <code>count − 1</code> and the next free place is <code>count</code>.</p>' },
      38: { blocks: cs(38), explain: '<p><b>ArrayBinaryTree&lt;T&gt;</b> stores the tree in <code>T[] tree</code> with <code>count</code> elements (start capacity 50).</p><pre class="ex">tree = (T[]) new Object[DEFAULT_CAPACITY];</pre><p class="watch">Java cannot create a generic array with <code>new T[50]</code>, so it creates an Object array and casts it (the compiler gives a warning).</p>' },
      39: { blocks: cs(39), explain: '<p>The second constructor makes a tree with one element: the root at index 0.</p><pre class="ex">count = 1;\ntree[0] = element;</pre><p>Index 0 is always the root in the array form.</p>' },
      40: { blocks: cs(40), explain: '<p><b>ArrayHeap&lt;T&gt;</b> extends ArrayBinaryTree and implements HeapADT: it adds addElement, removeMin and findMin on top of the array tree.</p><pre class="ex">public ArrayHeap() { super(); }</pre><p>PriorityQueue (slide 22) and HeapSort (slide 47) are built on this class.</p>' },
      41: { blocks: cs(41), explain: '<p>addElement with an array is short:</p><pre class="ex">full? → expandCapacity()\ntree[count] = obj   // the next free place\ncount++\nheapifyAdd() if count &gt; 1</pre><p>The next free place is simply <code>tree[count]</code>: no searching like getNextParentAdd.</p>' },
      42: { blocks: cs(42), explain: '<p>heapifyAdd with indexes: <code>next</code> starts at count − 1 and the parent is at <code>(next−1)/2</code>.</p><pre class="ex">while temp &lt; tree[(next-1)/2]:\n  copy the parent down, next = its index\ntree[next] = temp</pre><p>Same idea as the linked version, but parents are found by math instead of links.</p>' },
      43: { blocks: cs(43), explain: '<p>removeMin: save <code>tree[0]</code>, copy the last element to index 0, reorder, then <code>count--</code>.</p><pre class="ex">minElement = tree[0]\ntree[0] = tree[count-1]</pre><p class="watch">Two slips on the slide: <code>modCount--</code> should be <code>modCount++</code> (it counts changes), and the old last cell is never set to null, so it still holds a value after count.</p>' },
      44: { blocks: cs(44), explain: '<p>heapifyRemove starts at node 0 with left = 1 and right = 2, and picks <code>next</code>:</p><pre class="ex">both children null → next = count (stop)\nno right child      → next = left\nelse                → the smaller (equal: right)</pre><p class="watch">The null tests only work if empty cells are null. Cells after count are never cleared, so the loop also needs <code>next &lt; count</code>.</p>' },
      45: { blocks: cs(45), explain: '<p>The loop moves the hole down: copy the smaller child up, then compute the new children with the formulas.</p><pre class="ex">left  = 2 * node + 1\nright = 2 * (node + 1)   // = 2n + 2</pre><p>It stops when next ≥ count or the child is not smaller than temp, then writes temp into tree[node].</p>' },
      46: { explain: '<p><b>Heap sort</b>: put every element into a heap, then take them out with removeMin. They come out smallest first:</p><pre class="ex">add: 6 2 9 4\nremove: 2, 4, 6, 9  → sorted</pre><p>n adds + n removes, each O(log n): O(n log n) in total, like merge sort.</p>' },
      47: { blocks: cs(47), explain: '<p>The code: a temporary ArrayHeap, a for loop that adds every <code>data[i]</code>, then a while loop that fills <code>data[0], data[1] …</code> with removeMin.</p><pre class="ex">data = {6, 2, 9} → heap → {2, 6, 9}</pre><p class="watch"><code>public void HeapSort(T[] data)</code> has the class name but a return type (void), so it is a normal method, not a constructor: call it as <code>new HeapSort&lt;&gt;().HeapSort(data)</code>.</p>' }
    },
    exam: {
      questions: [
        { type: 'tf', q: 'The root of a minheap always holds its smallest element.', answer: true, review: 3,
          why: 'Every element is ≤ its children, so going up never gets bigger: the root is ≤ every element.',
          lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 1 },
        { q: 'Two jobs in a PriorityQueue have the same priority. Which one does removeNext give first?',
          options: ['The one added first', 'The one added last', 'The one with the smaller element', 'Either one, by chance'], answer: 0, review: 21,
          why: 'compareTo falls back on arrivalOrder when the priorities are equal: the earlier arrival returns −1 and comes out first.',
          lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 1 },
        { type: 'match', q: 'Match each place in an array heap with its index (count elements, node at index n).', review: 37,
          pairs: [['children of n', '2n + 1 and 2n + 2'], ['parent of n', '(n − 1) / 2'], ['the last leaf', 'count − 1'], ['the next free place', 'count']],
          why: 'Slides 37 and 41: a complete tree has no gaps, so the formulas and count are enough; no links are needed.',
          lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 1 },
        { q: 'Heap HB (level order) is [3, 8, 5, 12, 9, 7, 14, 20, 15, 11]. What is the parent of 11?',
          options: ['8', '9', '12', '15'], answer: 1, review: 37,
          why: '11 is at index 9; its parent is at (9 − 1) / 2 = 4, which holds 9. 9 ≤ 11, as the heap rule wants.',
          lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 2 },
        { q: '4 is added to heap HB [3, 8, 5, 12, 9, 7, 14, 20, 15, 11]. What is the array afterwards?',
          options: ['[3, 8, 5, 12, 9, 7, 14, 20, 15, 11, 4]', '[3, 8, 5, 12, 4, 7, 14, 20, 15, 11, 9]', '[3, 4, 5, 8, 9, 7, 14, 20, 15, 11, 12]', '[3, 4, 5, 12, 8, 7, 14, 20, 15, 11, 9]'], answer: 3, review: 10,
          why: '4 starts at index 10, under 9 (index 4): swap. Its parent is now 8 (index 1): swap. Its parent is 3: stop. 9 and 8 each moved down one level.',
          lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 2 },
        { q: 'removeMin runs on heap HB [3, 8, 5, 12, 9, 7, 14, 20, 15, 11]. What is the array afterwards?',
          options: ['[5, 8, 7, 12, 9, 11, 14, 20, 15]', '[5, 8, 11, 12, 9, 7, 14, 20, 15]', '[8, 9, 5, 12, 11, 7, 14, 20, 15]', '[5, 8, 7, 12, 9, 14, 11, 20, 15]'], answer: 0, review: 15,
          why: 'The last leaf 11 goes to the root. Children 8 and 5: swap with 5. Children 7 and 14: swap with 7. 11 is now at index 5, a leaf.',
          lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 2 },
        { type: 'fill', q: 'Complete the start of the array removeMin (slide 43).', review: 43,
          code: 'public T removeMin() throws EmptyCollectionException\n{\n  if (isEmpty())\n    throw new EmptyCollectionException("ArrayHeap");\n  T minElement = tree[___];\n  tree[0] = tree[___];\n  heapifyRemove();\n  count--;\n  modCount--;\n  return minElement;\n}',
          answer: ['0', 'count - 1|count-1'],
          why: 'The minimum is at the root, index 0. The last element, at count − 1, is copied there before heapifyRemove moves it down.',
          lessons: ['12-heaps'], skills: ['design'], available_after: '12-heaps', level: 2 },
        { type: 'output', q: 'PriorityQueue is the class of slides 22-23. What does this print?', review: 23,
          code: 'PriorityQueue<String> q = new PriorityQueue<>();\nq.addElement("D", 5);\nq.addElement("E", 2);\nq.addElement("F", 5);\nq.addElement("G", 2);\nSystem.out.println(q.removeNext() + q.removeNext() + q.removeNext() + q.removeNext());',
          answer: 'EGDF',
          why: 'Priority 2 comes before 5. Inside each priority, the earlier arrival first: E before G, D before F.',
          lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 2 },
        { type: 'write', q: 'Write `public T findMin()` for ArrayHeap (fields `tree` and `count`). Throw an `EmptyCollectionException("ArrayHeap")` if the heap is empty; otherwise return the minimum without removing it.', review: 37,
          rows: 6, starter: 'public T findMin() throws EmptyCollectionException\n{\n  \n}',
          checks: [{ re: /if\s*\(\s*(isEmpty\s*\(\s*\)|count\s*==\s*0)\s*\)\s*throw\s+new\s+EmptyCollectionException\s*\(\s*"ArrayHeap"\s*\)\s*;/, label: 'Throws the exception for an empty heap' },
            { re: /return\s+tree\s*\[\s*0\s*\]\s*;/, label: 'Returns the root, tree[0]' },
            { fn: function (c) { return !/count\s*--|tree\s*\[\s*0\s*\]\s*=/.test(c); }, label: 'Does not change the heap' }],
          solution: 'public T findMin() throws EmptyCollectionException\n{\n  if (isEmpty())\n    throw new EmptyCollectionException("ArrayHeap");\n  return tree[0];\n}',
          why: 'The minimum is always at the root, so findMin is O(1): no loop and no reordering.',
          lessons: ['12-heaps'], skills: ['design'], available_after: '12-heaps', level: 2 },
        { q: 'All the elements of heap HB [3, 8, 5, 12, 9, 7, 14, 20, 15, 11] are taken out with removeMin and pushed onto a stack (unit 3) in that order. Then the stack is popped three times. What do the pops give?',
          options: ['11, 15, 20', '3, 5, 7', '20, 15, 14', '20, 14, 15'], answer: 2, review: 46,
          why: 'removeMin gives the elements in ascending order: 3, 5, 7, 8, 9, 11, 12, 14, 15, 20. The stack gives them back in reverse: 20, 15, 14 first. Heap + stack sorts in descending order.',
          lessons: ['03-stacks', '12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 2 },
        { type: 'trace', q: 'Heap HB [3, 8, 5, 12, 9, 7, 14, 20, 15, 11]: add 4, then removeMin twice. Fill in what each operation returns ("-" for none), the root and count after it.', review: 16,
          cols: ['operation', 'returns', 'root', 'count'],
          rows: [['add 4', '-', '?3', '?11'], ['removeMin', '?3', '?4', '?10'], ['removeMin', '?4', '?5', '?9']],
          why: 'After the add: [3, 4, 5, 12, 8, 7, 14, 20, 15, 11, 9]. removeMin returns 3; 9 sinks below 4 and 8: [4, 8, 5, 12, 9, 7, 14, 20, 15, 11]. removeMin returns 4; 11 sinks below 5 and 7: [5, 8, 7, 12, 9, 11, 14, 20, 15].',
          lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 3 },
        { q: 'HB is stored as a LinkedHeap (10 nodes). Which element is in the node that getNextParentAdd() returns?',
          options: ['7', '9', '11', '12'], answer: 1, review: 30,
          why: 'lastNode holds 11 (index 9), a <b>left</b> child, so the loop does not go up. Its parent (index 4, element 9) has no right child, so that parent is returned: the new node becomes index 10.',
          lessons: ['12-heaps'], skills: ['trace'], available_after: '12-heaps', level: 3 },
        { q: 'A minheap holds distinct values. Where can its <b>largest</b> value be?',
          options: ['Only in the last leaf', 'Only on level 1', 'At the root', 'In any leaf'], answer: 3, review: 7,
          why: 'The largest value cannot have a child (a child would have to be larger), so it is a leaf, but any leaf: the heap does not order the leaves. That is why a findMax must check all the leaves.',
          lessons: ['12-heaps'], skills: ['concept'], available_after: '12-heaps', level: 3 },
        { q: 'removeMin of the slides\' ArrayHeap (slide 43) runs on HB [3, 8, 5, 12, 9, 7, 14, 20, 15, 11]. What is in tree[9] afterwards?',
          options: ['null', '15', '11, the old last element', '3'], answer: 2, review: 43,
          why: '11 is copied to the root, but tree[9] is never cleared. count drops to 9, so index 9 is outside the heap, yet it still holds 11: a stale value.',
          lessons: ['12-heaps'], skills: ['edge_case'], available_after: '12-heaps', level: 3 },
        { q: 'n elements are already in a heap. Which of these takes O(n) time, and not O(log n) or O(1)?',
          options: ['findMin (returns the smallest element)', 'addElement (adds a new element)', 'removeMin (removes the smallest element)', 'finding the largest element'], answer: 3, review: 3,
          why: 'findMin is O(1); add and removeMin follow one path, O(log n). The largest element can be in any of about n/2 leaves, so they must all be checked: O(n).',
          lessons: ['02-analysis-of-algorithms', '12-heaps'], skills: ['complexity'], available_after: '12-heaps', level: 3 }
      ],
      tasks: [
        {
          title: 'Is it a heap?',
          task: '<p>Write <code>public boolean isHeap()</code> for <code>ArrayHeap&lt;T&gt;</code> (fields <code>tree</code> and <code>count</code>). Check every element from index 1 to count − 1 against its parent at <code>(i-1)/2</code>, using <code>((Comparable)tree[i]).compareTo(...)</code>. Return false as soon as an element is smaller than its parent, and true after the loop.</p>',
          starter: 'public boolean isHeap()\n{\n  \n}',
          checks: [
            { re: /for\s*\(\s*int\s+(\w+)\s*=\s*1\s*;\s*\1\s*<\s*count\s*;\s*\1\s*\+\+\s*\)/, label: 'Loops over the indexes 1 to count − 1', review: 37 },
            { re: /\(\s*\(\s*Comparable\s*\)\s*tree\s*\[\s*(\w+)\s*\]\s*\)\s*\.compareTo\s*\(\s*tree\s*\[\s*\(\s*\1\s*-\s*1\s*\)\s*\/\s*2\s*\]\s*\)\s*<\s*0/, label: 'Compares each element with its parent', review: 37 },
            { re: /return\s+false\s*;/, label: 'Returns false for a smaller child', review: 3 },
            { re: /return\s+true\s*;\s*\}\s*$/, label: 'Returns true after the loop', review: 3 }
          ],
          solution: 'public boolean isHeap()\n{\n  for (int i = 1; i < count; i++)\n    if (((Comparable)tree[i]).compareTo(tree[(i-1)/2]) < 0)\n      return false;\n  return true;\n}'
        },
        {
          title: 'The largest element',
          task: '<p>Write <code>public T findMax()</code> for <code>ArrayHeap&lt;T&gt;</code>. Throw an <code>EmptyCollectionException("ArrayHeap")</code> for an empty heap. The largest element is a leaf, and the leaves are at the indexes <code>count/2</code> to <code>count − 1</code>, so only check those: start with <code>max = tree[count/2]</code> and loop over the other leaves.</p>',
          starter: 'public T findMax() throws EmptyCollectionException\n{\n  \n}',
          checks: [
            { re: /if\s*\(\s*(isEmpty\s*\(\s*\)|count\s*==\s*0)\s*\)\s*throw\s+new\s+EmptyCollectionException\s*\(\s*"ArrayHeap"\s*\)\s*;/, label: 'Throws the exception for an empty heap', review: 43 },
            { re: /T\s+(\w+)\s*=\s*tree\s*\[\s*count\s*\/\s*2\s*\]\s*;/, label: 'Starts with the first leaf, tree[count/2]', review: 37 },
            { re: /for\s*\(\s*int\s+(\w+)\s*=\s*count\s*\/\s*2\s*(\+\s*1\s*)?;\s*\1\s*<\s*count\s*;\s*\1\s*\+\+\s*\)/, label: 'Loops over the leaves only', review: 37 },
            { re: /compareTo\s*\(\s*\w+\s*\)\s*>\s*0/, label: 'Keeps the larger element', review: 3 },
            { re: /return\s+\w+\s*;\s*\}\s*$/, label: 'Returns the maximum', review: 3 }
          ],
          solution: 'public T findMax() throws EmptyCollectionException\n{\n  if (isEmpty())\n    throw new EmptyCollectionException("ArrayHeap");\n  T max = tree[count / 2];\n  for (int i = count / 2 + 1; i < count; i++)\n    if (((Comparable)tree[i]).compareTo(max) > 0)\n      max = tree[i];\n  return max;\n}'
        }
      ]
    }
  });
})();
