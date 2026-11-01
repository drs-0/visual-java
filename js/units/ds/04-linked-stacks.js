/* Data Structures · Unit 4 Linked Stacks (20 slides): references as pointers, self-referential classes, linked lists
   (access, insert at the front, delete the front node), Node<T>, and LinkedStack<T> with push, pop, peek, isEmpty, size */
(function () {
  function L(src, frag, nth) { var ls = src.split('\n'), c = 0; for (var i = 0; i < ls.length; i++) if (ls[i].indexOf(frag) >= 0 && ++c === (nth || 1)) return i + 1; throw new Error('no line ' + frag); }
  function h(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function names(s, max) { return String(s).trim().split(/[\s,]+/).filter(function (t) { return /^\w{1,8}$/.test(t); }).slice(0, max); }
  /* a row of linked nodes. list: [{id, t, tone, hi, o}], o: { x0, y, w, step, ptr: name of the first reference, nullId } */
  function chain(list, o) {
    var out = [], w = o.w, st = o.step;
    list.forEach(function (n, i) {
      var x = o.x0 + i * st;
      out.push(B(n.id, x, o.y, w, 40, { title: n.t, mono: true, size: w < 64 ? 11 : 13, tone: n.tone || 'blue', fill: n.hi ? 'solid' : 'soft', hi: n.hi, o: n.o, from: n.from }));
      if (n.cut) out.push(T(n.id + 'x', x + w + (st - w) / 2, o.y + 26, '✕', { anchor: 'middle', size: 16, bold: true, tone: 'red' }));
      else if (i < list.length - 1) out.push(A(n.id + 'a', x + w, o.y + 20, x + st, o.y + 20, { tone: 'muted' }));
    });
    if (list.length && !list[list.length - 1].cut) {
      var lx = o.x0 + (list.length - 1) * st + w;
      out.push(A('nullA', lx, o.y + 20, lx + 18, o.y + 20, { head: false, tone: 'muted' }));
      out.push(B('nullB', lx + 18, o.y + 15, 10, 10, { tone: 'blue', fill: 'solid', r: 1 }));
    }
    return out;
  }

  /* ---------- 1. references, self-referential objects, linked lists (slides 3-6) ---------- */
  var RC = 'public class Person {\n  String name;      // Person name\n  String address;   // Person address\n  Person next;      // link to another Person object\n}\n\nPerson front = new Person();     front.name = "Ali";\nfront.next = new Person();       front.next.name = "Sara";\nfront.next.next = new Person();  front.next.next.name = "Omar";\n// the last next is null: the end of the list';
  var links = {
    id: 'links', slides: [3, 6], title: 'Objects that point to objects', code: RC,
    steps: [
      { slide: 3, line: 7, ph: 'ref', cap: 'A reference variable holds the <b>address</b> of an object: where it is in memory. So we draw it as an arrow, a <b>pointer</b>.' },
      { slide: 4, line: '1-5', ph: 'cls', k: 0, cap: 'Person has a field <code>next</code> of type <b>Person</b>: a class that refers to its own kind is <b>self-referential</b>.' },
      { slide: 4, line: 7, ph: 'cls', k: 1, cap: 'front refers to the first Person, Ali. Ali’s next is still null.' },
      { slide: 4, line: 8, ph: 'cls', k: 2, cap: 'Ali’s next now refers to a second Person, Sara: the first object points to the second.' },
      { slide: 4, line: 9, ph: 'cls', k: 3, cap: 'Sara’s next refers to Omar. A series of Person objects makes a <b>linked list</b>.' },
      { slide: 5, line: 10, ph: 'list', cap: 'The objects are the <b>nodes</b> of the list. <b>front</b> points to the first node, and the last node’s next is <b>null</b> (drawn as a small square).' },
      { slide: 6, line: 4, ph: 'cx', cap: 'If an object has <b>several</b> references to other objects, the links can form complex, <b>non-linear</b> structures like this one.' }
    ],
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'ref') {
        items.push(B('obj', 330, 120, 160, 70, { tone: 'teal', tag: 'an object at address 5A20', title: 'Person', mono: true, size: 15 }));
        items.push(B('var', 60, 130, 120, 50, { title: '5A20', mono: true, size: 15, tone: 'accent', tag: 'front' }));
        items.push(A('va', 180, 155, 330, 155, { tone: 'accent', label: 'points to' }));
        items.push(T('vn', 120, 220, 'the variable holds an address', { anchor: 'middle', size: 12, tone: 'muted' }));
        return items;
      }
      if (s.ph === 'cls' || s.ph === 'list') {
        var P3 = [['Ali', 'Jeddah'], ['Sara', 'Dammam'], ['Omar', 'Khobar']], n = s.ph === 'list' ? 3 : s.k;
        if (n === 0) { items.push(CLS('pc', 180, 90, 200, { name: 'Person', fields: ['String name', 'String address', 'Person next'], hi: true, tone: 'accent' })); return items; }
        items.push(B('fr', 14, 40, 70, 34, { title: 'front', mono: true, size: 13, tone: 'accent' }));
        P3.slice(0, n).forEach(function (p, i) {
          var x = 40 + i * 175;
          items.push(OBJ('p' + i, x, 120, 140, { name: 'Person', fields: ['name = "' + p[0] + '"', 'address = …', i < n - 1 ? 'next = ●' : 'next = null'], hi: i === n - 1 && s.ph === 'cls', tone: s.ph === 'list' ? 'blue' : 'teal' }));
          if (i < n - 1) items.push(A('pa' + i, x + 100, 197, x + 175, 140, { tone: 'accent' }));
        });
        items.push(A('fa', 49, 74, 70, 120, { tone: 'accent' }));
        if (s.ph === 'list') items.push(T('nd', 280, 290, 'node → node → node → null', { anchor: 'middle', mono: true, size: 15, bold: true, tone: 'accent' }));
        return items;
      }
      var G = [[120, 90], [250, 40], [380, 100], [250, 120], [250, 210], [360, 270], [450, 190], [480, 90]];
      G.forEach(function (p, i) { items.push(B('g' + i, p[0], p[1], 64, 36, { tone: 'teal' })); });
      [[0, 1], [0, 4], [1, 2], [4, 3], [4, 2], [4, 5], [5, 6], [6, 2], [6, 7]].forEach(function (e, i) {
        var a = G[e[0]], b = G[e[1]];
        items.push(A('ge' + i, a[0] + 32, a[1] + 18, b[0] + 32, b[1] + 18, { tone: 'accent' }));
      });
      items.push(T('en', 70, 70, 'entry', { mono: true, size: 13 }));
      items.push(A('ea', 90, 76, 120, 102, { tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 2. managing a linked list: access, insert at the front, delete the front (slides 8-12) ---------- */
  var MC = '// slide 9: search the list for a name\nString name = "Tom";\nPerson current = first;\nwhile (!(current.name.equals(name)) && (current.next != null))\n  current = current.next;\n\n// slide 10: insert a node at the front\nPerson node = new Person();\nnode.next = front;\nfront = node;\n\n// slide 11: delete the front node\nPerson next = front.next;\nfront.next = null;\nfront = next;';
  var listops = {
    id: 'listops', slides: [8, 12], title: 'Walk, insert, delete: only references change',
    code: function (v) { return MC.replace('"Tom"', '"' + (names(v.f, 1)[0] || '') + '"'); },
    inputs: [{ id: 'l', type: 'text', label: 'list', value: 'Ali Sara Tom Omar', maxlen: 36 }, { id: 'f', type: 'text', label: 'name to find', value: 'Tom', maxlen: 8 }],
    presets: [{ label: 'find Tom', values: { l: 'Ali Sara Tom Omar', f: 'Tom' } }, { label: 'find Ali (first)', values: { l: 'Ali Sara Tom Omar', f: 'Ali' } }, { label: 'find Huda (missing)', values: { l: 'Ali Sara Tom Omar', f: 'Huda' } }, { label: 'one node', values: { l: 'Omar', f: 'Omar' } }, { label: 'empty list', values: { l: '', f: 'Tom' } }],
    steps: function (v) {
      var list = names(v.l, 4).map(function (t, i) { return { id: 'n' + i, t: t }; }), want = names(v.f, 1)[0] || '', st = [], c = 0;
      var snap = function (o) { o.list = list.map(function (n) { return { id: n.id, t: n.t }; }); return o; };
      st.push(snap({ slide: 8, line: '3,8,13', cur: -1, cap: 'Three basic techniques work on any linked list: <b>accessing</b> nodes, <b>inserting</b> a node, and <b>removing</b> a node.' }));
      if (!list.length) {
        st.push(snap({ slide: 9, line: '3-4', cur: -1, err: true, cap: 'The list is empty: first is <b>null</b>. The test <code>current.name</code> uses a null reference and throws a <b>NullPointerException</b>. The slide’s loop assumes the list has at least one node.', out: 'Exception in thread "main" java.lang.NullPointerException' }));
      } else {
        st.push(snap({ slide: 9, line: 3, cur: 0, cap: 'To search for “' + h(want) + '”, <code>current</code> starts at the first node. (The slide calls the first reference <code>first</code> here and <code>front</code> on the next slides: it is the same reference.)' }));
        while (true) {
          var eq = list[c].t === want, last = c === list.length - 1;
          if (eq || last) { st.push(snap({ slide: 9, line: 4, cur: c, found: eq, cap: eq ? 'current.name equals “' + h(want) + '”: the loop stops. <b>Found</b> at node ' + (c + 1) + '.' : 'current.next is null: this is the last node, so the loop stops. current.name is “' + h(list[c].t) + '”, not “' + h(want) + '”: <b>not found</b>. After the loop we must check current.name again!' })); break; }
          st.push(snap({ slide: 9, line: '4-5', cur: c + 1, cap: '“' + h(list[c].t) + '” is not “' + h(want) + '” and there is a next node: <code>current = current.next</code>.' }));
          c++;
        }
      }
      var nn = { id: 'nw', t: 'New' };
      st.push(snap({ slide: 10, line: 8, ph: 'ins', newn: 1, cap: 'Insert at the front. First create the new node. It is not in the list yet.' }));
      st.push(snap({ slide: 10, line: 9, ph: 'ins', newn: 2, cap: '<code>node.next = front</code>: the new node now points to the old first node' + (list.length ? '' : ' (null: the list was empty)') + '. Nothing is lost.' }));
      list.unshift(nn);
      st.push(snap({ slide: 10, line: 10, ph: 'ins', hiF: true, cap: '<code>front = node</code>: front now points to the new node. Done: 2 references changed, <b>no element moved</b>.' }));
      st.push(snap({ slide: 11, line: 13, ph: 'del', tmp: true, cap: 'Delete the front node. First keep a reference to the second node: <code>next = front.next</code>.' }));
      st.push(snap({ slide: 11, line: 14, ph: 'del', tmp: true, cut: true, cap: '<code>front.next = null</code>: the old front node is disconnected from the list.' }));
      list.shift();
      st.push(snap({ slide: 11, line: 15, ph: 'del', gone: nn, hiF: true, cap: '<code>front = next</code>: front points to the second node. The old node is not reachable any more, and Java will free it.' + (list.length ? '' : ' The list is empty again: front is null.') }));
      st.push(snap({ slide: 12, line: '8-10', ph: 'gen', cap: 'So far each Person <b>is</b> a node (it has a next field). Better: a separate generic <b>Node&lt;T&gt;</b> class forms the list, and each node holds a <b>reference</b> to an element of any type T.' }));
      return st;
    },
    draw: function (k, s) {
      var items = [], gen = s.ph === 'gen', y = gen ? 90 : 150, ins = s.ph === 'ins' && !s.hiF, shift = s.newn ? 1 : 0;
      var list = s.list.map(function (n, i) {
        var o = { id: n.id, t: n.t, tone: 'blue' };
        if (i === s.cur) { o.tone = s.found === false ? 'red' : s.found ? 'teal' : 'accent'; o.hi = true; }
        if (n.id === 'nw' && s.ph === 'ins') { o.tone = 'accent'; o.hi = true; }
        if (s.cut && i === 0) { o.cut = true; o.tone = 'red'; o.o = 0.6; }
        if (gen) o.t = 'node';
        return o;
      });
      var x0 = 16 + (ins ? 104 : 0), st = 104, w = 80;
      items = items.concat(chain(list, { x0: x0, y: y, w: w, step: st }));
      if (s.newn) {
        items.push(B('nw', 16, y + 100, w, 40, { title: 'New', mono: true, size: 13, tone: 'accent', fill: 'solid', hi: true, from: [16, y + 160] }));
        items.push(P('pn', 56, y + 144, 'node', { dir: 'up', len: 18 }));
        if (s.newn === 2) items.push(A('nl', 56, y + 100, x0 + 30, y + 40, { tone: 'accent', label: 'next' }));
      }
      if (s.gone) items.push(B('nw', 16, y + 100, w, 40, { title: 'New', mono: true, size: 13, tone: 'muted', dash: true, o: 0.35 }));
      if (s.list.length) items.push(P('pf', x0 + w / 2, y - 4, 'front', { dir: 'down', len: 26 }));
      else items.push(T('emp', 120, y + 26, 'front = null (empty list)', { mono: true, size: 14, tone: 'muted' }));
      if (s.cur >= 0) items.push(P('pc', x0 + s.cur * st + w / 2, y + 44, 'current', { dir: 'up', len: 26 }));
      if (s.tmp) items.push(P('pt', x0 + st + w / 2, y + 44, 'next', { dir: 'up', len: 26 }));
      if (s.err) items.push(T('er', 280, 260, 'NullPointerException', { anchor: 'middle', size: 17, bold: true, tone: 'red' }));
      if (gen) s.list.forEach(function (n, i) {
        items.push(B('el' + n.id, x0 + i * st, y + 110, w, 40, { title: n.t, mono: true, size: 13, tone: 'teal', tag: i ? undefined : 'element' }));
        items.push(A('ea' + n.id, x0 + i * st + w / 2, y + 40, x0 + i * st + w / 2, y + 110, { tone: 'accent' }));
      });
      return items;
    }
  };

  /* ---------- 3. LinkedStack<T> (slides 14-20) ---------- */
  var SC = 'package mystack;\n// A Generic Linked Stack implementation of elements of type T\npublic class LinkedStack<T> implements Stack<T> {\n  private Node<T> top;     // Reference to top node in the stack\n  private int count;       // Count of nodes (elements)\n\n  // Constructor for an empty stack\n  public LinkedStack() {\n    top = null;\n    count = 0;\n  }\n\n  private static class Node<T> {   // Generic linked list node\n    Node<T> next;                  // Reference to next node\n    T element;                     // Reference to an element\n    Node(T elem) {                 // Construct a new node that\n      element = elem;              // references elem of type T\n      next = null;\n    }\n  }\n\n  // Add an element of type T on top of this stack\n  public void push(T element) {\n    // Create a new node for an element of T\n    Node<T> temp = new Node<>(element);\n    temp.next = top;       // Link it to the top of the stack\n    top = temp;            // The new node becomes the top node\n    count++;               // Increment the count of elements\n  }\n\n  public T pop() throws RuntimeException {\n    if (isEmpty()) throw new RuntimeException("Stack is empty");\n    Node<T> next = top.next;   // Reference to next node\n    T element = top.element;   // Reference to top element\n    top.next = null;           // Disconnect top node\n    top = next;                // top now references next node\n    count--;                   // Decrement count of elements\n    return element;            // Reference to popped element\n  }\n\n  // returns a reference to the top element without removing it\n  public T peek() {\n    // return null if the stack is empty\n    if (isEmpty()) return null;\n    return top.element;\n  }\n\n  // return true if the stack is empty\n  public boolean isEmpty() {\n    return (count==0);\n  }\n\n  // return the count of elements in the stack\n  public int size() {\n    return count;\n  }\n}';
  function srun(v) {
    var tk = String(v.ops).trim().split(/[\s,]+/).filter(Boolean).slice(0, 8), code = SC.split('\n'), ops = [];
    code.push('', '// in main:', 'Stack<String> s = new LinkedStack<>();');
    tk.forEach(function (t) {
      var o = /^(-|pop)$/.test(t) ? { k: 'pop' } : /^(\?|peek)$/.test(t) ? { k: 'peek' } : t === 'size' ? { k: 'size' } : { k: 'push', x: t.slice(0, 5) };
      o.line = code.length + 1;
      code.push(o.k === 'push' ? 's.push("' + o.x + '");' : 'System.out.println(s.' + o.k + '());');
      ops.push(o);
    });
    return { code: code.join('\n'), ops: ops };
  }
  var linkedstack = {
    id: 'linkedstack', slides: [14, 20], title: 'LinkedStack: push and pop re-link the top node',
    code: function (v) { return srun(v).code; },
    inputs: [{ id: 'ops', type: 'text', label: 'operations', value: 'A B C - ? size', maxlen: 40 }],
    inputsLabel: 'Values to push, <code>-</code> pop, <code>?</code> peek, <code>size</code>.',
    presets: [{ label: 'push, pop, peek', values: { ops: 'A B C - ? size' } }, { label: 'six pushes (slide 18)', values: { ops: '1 2 3 4 5 6' } }, { label: 'pop an empty stack', values: { ops: 'A - -' } }, { label: 'peek an empty stack', values: { ops: '? A ?' } }],
    steps: function (v) {
      var R = srun(v), st = [], list = [], n = 0, decl = R.code.split('\n').length - R.ops.length, pushes = 0;
      var snap = function (o) { o.list = list.slice(); o.count = list.length; return o; };
      st.push(snap({ slide: 14, line: 3, ph: 'intro', cap: 'LinkedStack&lt;T&gt; implements the <b>same</b> Stack&lt;T&gt; interface as ArrayStack, but keeps the elements in a <b>linked list</b>. A count field remembers how many there are.' }));
      st.push(snap({ slide: 16, line: '13-20', ph: 'node', cap: 'Node&lt;T&gt; is a <b>private static</b> class nested inside LinkedStack. A node has two references: <code>element</code> (the data) and <code>next</code> (the node below it).' }));
      st.push(snap({ slide: 15, line: decl + ',8-10', cap: 'new LinkedStack&lt;&gt;(): top = <b>null</b> and count = 0. No array, no capacity: nodes are created one by one.' }));
      for (var i = 0; i < R.ops.length; i++) {
        var o = R.ops[i];
        if (o.k === 'push') {
          var nd = { id: 'n' + n++, t: o.x };
          st.push(snap({ slide: 17, line: o.line + ',25-26', temp: nd, cap: '<b>push("' + h(o.x) + '")</b>: create a node for "' + h(o.x) + '" (temp), then <code>temp.next = top</code> links it to the old top' + (list.length ? ' ("' + h(list[0].t) + '")' : ' (null)') + '.' }));
          list.unshift(nd); pushes++;
          st.push(snap({ slide: pushes === 6 ? 18 : 17, line: o.line + ',27-28', fresh: true, cap: '<code>top = temp</code>: the new node is the top. count++ → ' + list.length + '. O(1): no element moves.' + (pushes === 6 ? ' After six pushes, count is 6 (slide 18).' : '') }));
        } else if (o.k === 'size') {
          st.push(snap({ slide: 20, line: o.line + ',' + L(SC, 'return count;'), cap: '<b>size()</b> returns count = ' + list.length + ' (no need to walk the list).', out: String(list.length) }));
        } else if (!list.length) {
          if (o.k === 'peek') st.push(snap({ slide: 20, line: o.line + ',' + L(SC, 'if (isEmpty()) return null'), cap: '<b>peek()</b> on an empty stack returns <b>null</b>. Careful: ArrayStack threw an exception here, LinkedStack does not.', out: 'null' }));
          else { st.push(snap({ slide: 19, line: o.line + ',' + L(SC, 'throw new RuntimeException'), err: true, cap: '<b>pop()</b> on an empty stack: isEmpty() is true, so it throws a <b>RuntimeException</b> and the program stops.', out: 'Exception in thread "main" java.lang.RuntimeException: Stack is empty' })); break; }
        } else if (o.k === 'peek') {
          st.push(snap({ slide: 20, line: o.line + ',' + L(SC, 'return top.element'), peek: true, cap: '<b>peek()</b> returns top.element = "' + h(list[0].t) + '". Nothing changes.', out: list[0].t }));
        } else {
          var tp = list[0];
          st.push(snap({ slide: 19, line: o.line + ',' + L(SC, 'Node<T> next = top.next') + '-' + L(SC, 'T element = top.element'), tmpNext: true, cap: '<b>pop()</b>: keep <code>next = top.next</code>' + (list.length > 1 ? ' ("' + h(list[1].t) + '")' : ' (null)') + ' and <code>element = top.element</code> ("' + h(tp.t) + '").' }));
          st.push(snap({ slide: 19, line: L(SC, 'top.next = null;'), tmpNext: true, cut: true, cap: '<code>top.next = null</code>: disconnect the top node from the list.' }));
          list.shift();
          st.push(snap({ slide: 19, line: o.line + ',' + L(SC, 'top = next;') + '-' + L(SC, 'return element;'), gone: tp, cap: '<code>top = next</code>, count-- → ' + list.length + ', and return "' + h(tp.t) + '". O(1).', out: tp.t }));
        }
      }
      if (!st[st.length - 1].err) st.push(snap({ slide: 20, line: L(SC, 'return (count==0)'), cap: 'isEmpty() is ' + !list.length + ' (count == ' + list.length + '). All the operations are O(1), and the stack never gets full.' }));
      return st;
    },
    draw: function (k, s) {
      var items = [], n = s.list.length + (s.temp ? 1 : 0), stp = Math.min(96, Math.floor(500 / Math.max(n, 1))), w = Math.max(40, stp - 24), x0 = 40, y = 150;
      if (s.ph === 'intro') {
        items.push(B('si', 170, 30, 220, 50, { title: 'Stack<T>', mono: true, size: 16, tone: 'blue', tag: 'interface' }));
        items.push(B('sa', 40, 200, 200, 50, { title: 'ArrayStack<T>', mono: true, size: 14, tone: 'muted', tag: 'unit 3: an array' }));
        items.push(B('sl', 320, 200, 200, 50, { title: 'LinkedStack<T>', mono: true, size: 14, tone: 'accent', fill: 'solid', hi: true, tag: 'this unit: linked nodes' }));
        items.push(A('ia', 140, 200, 250, 80, { dash: true, tone: 'muted' }));
        items.push(A('il', 420, 200, 310, 80, { dash: true, tone: 'accent' }));
        items.push(T('it', 280, 300, 'same methods, different inside', { anchor: 'middle', size: 14, bold: true, tone: 'muted' }));
        return items;
      }
      if (s.ph === 'node') {
        items.push(CLS('nc', 30, 70, 210, { name: 'Node<T>', fields: ['Node<T> next', 'T element'], tone: 'accent', hi: true }));
        items.push(B('nd', 330, 90, 90, 44, { title: 'node', mono: true, size: 13, tone: 'blue' }));
        items.push(B('ne', 330, 210, 90, 44, { title: '"A"', mono: true, size: 13, tone: 'teal', tag: 'element' }));
        items.push(A('nea', 375, 134, 375, 210, { tone: 'accent', label: 'element', la: 'start', lx: 6 }));
        items.push(A('nna', 420, 112, 470, 112, { head: false, tone: 'muted', label: 'next' }));
        items.push(B('nnb', 470, 107, 10, 10, { tone: 'blue', fill: 'solid', r: 1 }));
        return items;
      }
      var list = s.list.map(function (nd, i) { return { id: nd.id, t: nd.t, tone: i === 0 && (s.fresh || s.peek) ? 'accent' : i === 0 && s.cut ? 'red' : 'blue', hi: i === 0 && (s.fresh || s.peek), cut: i === 0 && s.cut, o: i === 0 && s.cut ? 0.6 : 1 }; });
      var lx0 = x0 + (s.temp ? stp : 0);
      items = items.concat(chain(list, { x0: lx0, y: y, w: w, step: stp }));
      if (s.temp) {
        items.push(B(s.temp.id, x0, y + 90, w, 40, { title: s.temp.t, mono: true, size: 13, tone: 'accent', fill: 'solid', hi: true, from: [x0, y + 150] }));
        items.push(P('ptmp', x0 + w / 2, y + 134, 'temp', { dir: 'up', len: 18 }));
        items.push(A('tl', x0 + w / 2, y + 90, list.length ? lx0 + w / 2 : x0 + w + 30, list.length ? y + 40 : y + 110, { tone: 'accent', label: 'next' }));
        if (!list.length) items.push(T('tn', x0 + w + 34, y + 114, 'null', { mono: true, size: 12, tone: 'muted' }));
      }
      if (s.gone) items.push(B(s.gone.id, 400, 260, 110, 40, { title: s.gone.t, mono: true, size: 15, tone: 'accent', fill: 'solid', hi: true, tag: 'pop() returned' }));
      if (list.length) items.push(P('ptop', lx0 + w / 2, y - 4, 'top', { dir: 'down', len: 30 }));
      else items.push(T('emp', 40, y + 26, s.temp ? '' : 'top = null', { mono: true, size: 14, tone: 'muted' }));
      if (s.tmpNext && list.length > 1) items.push(P('pnx', lx0 + stp + w / 2, y + 44, 'next', { dir: 'up', len: 22 }));
      items.push(T('cnt', 20, 40, 'count: ' + s.count, { mono: true, size: 16, bold: true, tone: 'accent' }));
      if (s.err) items.push(T('er', 280, 290, 'Stack is empty!', { anchor: 'middle', size: 17, bold: true, tone: 'red' }));
      return items;
    }
  };

  var code = function (t) { return { type: 'code', lang: 'java', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; };
  var OUT = ['Linked Structures', 'Managing Linked Lists', 'Implementing a Stack with Links'];
  function outline(on, ex) { return { blocks: OUT.map(function (t, i) { return { type: 'bullet', html: i === on ? '<b>' + t + '</b>' : t }; }), explain: ex }; }

  addUnit({
    course: 'ds', lesson: '04-linked-stacks',
    blurb: 'Object references as links: linked lists, inserting and deleting at the front, a generic Node<T>, and a stack built from linked nodes.',
    parts: [
      { title: 'Linked structures', from: 1, to: 6 },
      { title: 'Managing linked lists', from: 7, to: 12 },
      { title: 'Implementing a stack with links', from: 13, to: 20 }
    ],
    visuals: [links, listops, linkedstack],
    slides: {
      1: { cover: true, explain: '<p>An array keeps elements side by side in one block of memory. A <b>linked structure</b> keeps each element in its own object, and connects the objects with <b>references</b> (links).</p><pre class="ex">array:   [A][B][C]\nlinked:  A → B → C → null</pre><p>This unit builds a <b>linked stack</b>: the same Stack interface as unit 3, but with links instead of an array.</p>' },
      2: outline(-1, '<p>The plan: linked structures, how to manage a linked list, and a stack implemented with links.</p>'),
      3: { explain: '<p>A <b>linked structure</b> uses object references to make links between objects. It is the {{alternative|البديل}} to an array.</p><p>Remember: a reference variable holds the <b>address</b> of an object. That is why we also call it a <b>pointer</b> and draw it as an arrow.</p><pre class="ex">Person p = new Person();   // p holds the address of the new object</pre><p class="watch">Copying a reference (<code>q = p</code>) copies the address, not the object: both point to the same object.</p>' },
      4: { blocks: [bul('A class Person can have a data field next that references another object of the same Person class.'), bul('A series of Person objects would make up a linked list.'), bul('First Person object points to second Person object.'), bul('Second Person object points to third Person object, etc.'), code('public class Person {\n  String name;       // Person name\n  String address;    // Person address\n  . . .              // additional data\n  Person next;       // link to another Person object\n}')],
        explain: '<p>A class can have a field of <b>its own type</b>. Person has <code>Person next</code>: a link to another Person. Such a class is called {{self-referential|ذاتي المرجع}}.</p><pre class="ex">ali.next = sara;     // Ali points to Sara\nsara.next = omar;    // Sara points to Omar</pre><p>Following the next links one by one visits every person: a linked list.</p><p class="watch">The field holds a reference, not a whole Person inside another Person.</p>' },
      5: { explain: '<p>The objects in a list are its <b>nodes</b>. Two important things:</p><ul><li>a separate reference, <b>front</b>, points to the first node;</li><li>the <b>last</b> node’s next is <b>null</b>: it points to nothing.</li></ul><pre class="ex">front → [Ali] → [Sara] → [Omar] → null</pre><p class="watch">If you lose front (for example <code>front = null</code> by mistake), the whole list is lost: no reference reaches it any more.</p>' },
      6: { explain: '<p>A node can have <b>more than one</b> reference. Then the links can make complex, <b>non-linear</b> shapes, like the drawing on the slide.</p><pre class="ex">class Node {\n  Node left, right;   // two links → a tree (later units)\n}</pre><p>Trees and graphs (later in the course) are built this way.</p>' },
      7: outline(1, '<p>Next: the basic ways to manage a linked list.</p>'),
      8: { explain: '<p>Whatever a linked list stores, we use a few basic techniques on its nodes:</p><ol><li><b>accessing</b> (visiting) the elements;</li><li><b>inserting</b> a node;</li><li><b>removing</b> a node.</li></ol><pre class="ex">visit:  front → … → null\ninsert: link a new node in\nremove: link around a node</pre><p>Insert and remove only change a few references: no element is moved, unlike in an array.</p>' },
      9: { explain: '<p>To visit the nodes we start at the first node and follow the <b>next</b> links. A reference variable <b>current</b> walks the list:</p><pre class="ex">current = first;\nwhile (name not found && current.next != null)\n  current = current.next;</pre><p>The loop stops at the matching name or at the last node.</p><p class="watch">When the loop stops at the last node, the name may still be missing: check <code>current.name</code> after the loop. And on an empty list (first == null), <code>current.name</code> throws a NullPointerException.</p>' },
      10: { explain: '<p>To insert a node at the <b>front</b>, the order is important:</p><pre class="ex">Person node = new Person();\nnode.next = front;   // 1) link the new node to the old front\nfront = node;        // 2) then move front</pre><p>Inserting in the middle needs more work (later).</p><p class="watch">If you do <code>front = node</code> first, then <code>node.next = front</code> makes the node point to itself, and the rest of the list is lost.</p>' },
      11: { explain: '<p>To delete the <b>front</b> node, move front to the next node:</p><pre class="ex">Person next = front.next;  // remember the second node\nfront.next = null;         // disconnect the old front\nfront = next;              // front is now the second node</pre><p>The deleted node is no longer reachable, so Java frees its memory.</p><p class="watch">On an empty list (front == null), <code>front.next</code> throws a NullPointerException: check first.</p>' },
      12: { explain: '<p>The problem so far: to be in a list, Person needs a next field. Every class we want to store would have to become a node.</p><p>The fix: a generic <b>Node&lt;T&gt;</b> class makes the list, and each node holds a <b>reference</b> to an element of any type T.</p><pre class="ex">node → node → node → null\n  ↓      ↓      ↓\n "A"    "B"    "C"     (the elements)</pre><p>Now the elements do not need any link fields.</p>' },
      13: outline(2, '<p>Next: a stack built with linked nodes.</p>'),
      14: { explain: '<p><b>LinkedStack&lt;T&gt;</b> implements the same <b>Stack&lt;T&gt;</b> interface as ArrayStack, so a user can switch between them without changing other code.</p><pre class="ex">Stack&lt;String&gt; s = new ArrayStack&lt;&gt;();\nStack&lt;String&gt; s = new LinkedStack&lt;&gt;();   // same methods</pre><p>Inside: a nested <b>Node&lt;T&gt;</b> class forms the list, and an int <b>count</b> stores how many elements there are.</p>' },
      15: { blocks: [bul('The generic LinkedStack<T> class uses a Node<T> class to implement a linked list version of the stack.'), code('package mystack;\n// A Generic Linked Stack implementation of elements of type T\npublic class LinkedStack<T> implements Stack<T> {\n  private Node<T> top;     // Reference to top node in the stack\n  private int count;       // Count of nodes (elements)\n\n  // Constructor for an empty stack\n  public LinkedStack() {\n    top = null;\n    count = 0;\n  }')],
        explain: '<p>Two fields:</p><ul><li><code>top</code>: a reference to the top node;</li><li><code>count</code>: the number of nodes.</li></ul><p>The constructor makes an empty stack: no nodes yet.</p><pre class="ex">top = null;   count = 0;</pre><p class="watch">Here top is a <b>reference</b> to a node, not an index like in ArrayStack.</p>' },
      16: { blocks: [bul('Node<T> is defined as private static class nested under LinkedStack<T> for better grouping and encapsulation.'), bul('It serves as the node containing a reference to the next node and a reference to the generic element of type T.'), code('private static class Node<T> {   // Generic linked list node\n  Node<T> next;                  // Reference to next node\n  T element;                     // Reference to an element\n  Node(T elem) {                 // Construct a new node that\n    element = elem;              // references elem of type T\n    next = null;\n  }\n}')],
        explain: '<p>Node&lt;T&gt; is written <b>inside</b> LinkedStack (a nested class):</p><ul><li><b>private</b>: only LinkedStack can use it ({{encapsulation|التغليف}});</li><li><b>static</b>: it does not need a LinkedStack object to exist.</li></ul><pre class="ex">new Node&lt;&gt;("A")  →  element = "A", next = null</pre><p class="watch">The user of the stack never sees nodes: push takes an element, pop returns an element.</p>' },
      17: { blocks: [bul('The push(T) method creates a new node for an element of type T and links it to the top of the stack. It also increments the count of elements on the stack.'), code('// Add an element of type T on top of this stack\npublic void push(T element) {\n  // Create a new node for an element of T\n  Node<T> temp = new Node<>(element);\n  temp.next = top;       // Link it to the top of the stack\n  top = temp;            // The new node becomes the top node\n  count++;               // Increment the count of elements\n}')],
        explain: '<p>push is the “insert at the front” of slide 10, with top as the front:</p><pre class="ex">temp = new Node&lt;&gt;(element);\ntemp.next = top;   // new node → old top\ntop = temp;        // top → new node\ncount++;</pre><p>No loop, no copying: push is always <b>O(1)</b>, and the stack never becomes full.</p><p class="watch">Same order rule: link <code>temp.next = top</code> <b>before</b> changing top.</p>' },
      18: { explain: '<p>All stack work happens at <b>one end</b>, so one reference, <b>top</b>, is enough.</p><pre class="ex">push 1, 2, 3, 4, 5, 6:\ntop → 6 → 5 → 4 → 3 → 2 → 1 → null\ncount = 6</pre><p>The newest node is at the front of the list, the oldest one at the end.</p><p class="watch">The first element pushed is at the <b>end</b> of the list, next to null.</p>' },
      19: { blocks: [bul('The pop() method removes the top node and returns a reference to its element. If the stack is empty, then a RuntimeException is thrown.'), code('public T pop() throws RuntimeException {\n  if (isEmpty()) throw new RuntimeException("Stack is empty");\n  Node<T> next = top.next;   // Reference to next node\n  T element = top.element;   // Reference to top element\n  top.next = null;           // Disconnect top node\n  top = next;                // top now references next node\n  count--;                   // Decrement count of elements\n  return element;            // Reference to popped element\n}')],
        explain: '<p>pop is “delete the front node” (slide 11), plus returning the element:</p><pre class="ex">next = top.next;        element = top.element;\ntop.next = null;        top = next;\ncount--;                return element;</pre><p>It is <b>O(1)</b>. An empty stack throws a RuntimeException.</p><p class="watch">Save <code>top.element</code> <b>before</b> moving top, or you lose the element you must return.</p>' },
      20: { explain: '<p>The small methods:</p><ul><li><b>peek</b>: returns <code>top.element</code>, or <b>null</b> if the stack is empty;</li><li><b>isEmpty</b>: <code>count == 0</code>;</li><li><b>size</b>: returns count.</li></ul><pre class="ex">empty stack:  peek() → null    pop() → RuntimeException</pre><p class="watch">Here peek on an empty stack returns null, but ArrayStack’s peek threw an exception. Read each class’s code: the same interface can behave differently in the empty case.</p>' }
    }
  });
})();
