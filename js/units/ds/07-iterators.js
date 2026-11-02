/* Data Structures · Unit 7 Iterators (30 slides): Iterable and Iterator, three ways to traverse a list (get(i), an
   iterator object, the for-each loop), removing with an iterator and fail-fast iterators, our ArrayListIterator (an
   inner class with next, itrCount = modCount and canRemove) and our LinkedListIterator that removes the previous node */
(function () {
  function L(src, frag, nth) { var ls = src.split('\n'), c = 0; for (var i = 0; i < ls.length; i++) if (ls[i].indexOf(frag) >= 0 && ++c === (nth || 1)) return i + 1; throw new Error('no line ' + frag); }
  function h(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function toks(s, max) { return String(s).trim().split(/[\s,]+/).filter(Boolean).slice(0, max || 10); }
  function words(s, max, len) { var t = toks(s, max).map(function (x) { return x.replace(/\W/g, '').slice(0, len); }).filter(Boolean); return t; }
  var CME = 'Exception in thread "main" java.util.ConcurrentModificationException', NSE = 'Exception in thread "main" java.util.NoSuchElementException', ISE = 'Exception in thread "main" java.lang.IllegalStateException';
  /* a row of nodes; o: {y, w, step, x0, hot: {index: tone}, dbl (prev links too), ids} */
  function nodes(list, o) {
    var out = [], n = list.length, st = o.step, w = o.w, x0 = o.x0;
    list.forEach(function (e, i) {
      var x = x0 + i * st, tn = (o.tone && o.tone[i]) || 'blue';
      out.push(B(e.id, x, o.y, w, 40, { title: e.t, mono: true, size: w < 46 ? 9 : w < 64 ? 10 : 13, tone: tn, fill: tn === 'accent' || tn === 'red' ? 'solid' : 'soft', hi: tn === 'accent', o: e.o }));
      if (i < n - 1) {
        out.push(A('nx' + e.id, x + w, o.y + 13, x + st, o.y + 13, { tone: 'muted' }));
        if (o.dbl) out.push(A('pv' + e.id, x + st, o.y + 28, x + w, o.y + 28, { tone: 'muted' }));
      }
    });
    return out;
  }

  /* ---------- 1. Iterable and Iterator (slides 3-6) ---------- */
  function crun(v) {
    var w = words(v.vals, 6, 5);
    var code = ['List<String> list = new ArrayList<>();'];
    w.forEach(function (x) { code.push('list.add("' + x + '");'); });
    code.push('Iterator<String> itr = list.iterator();   // an iterator object', 'while (itr.hasNext()) {', '  String s = itr.next();', '  System.out.println(s);', '}', 'System.out.println(itr.hasNext());');
    return { w: w, code: code.join('\n') };
  }
  var concept = {
    id: 'concept', slides: [3, 6], title: 'An iterator walks through a collection',
    code: function (v) { return crun(v).code; },
    inputs: [{ id: 'vals', type: 'text', label: 'elements', value: 'Ali Sara Omar', minlen: 0, maxlen: 40 }],
    inputsLabel: 'Up to 6 words for the list.',
    presets: [{ label: 'three names', values: { vals: 'Ali Sara Omar' } }, { label: 'one element', values: { vals: 'Nora' } }, { label: 'an empty list', values: { vals: '' } }],
    steps: function (v) {
      var R = crun(v), st = [], n = R.w.length, base = n + 2, nx = 0;
      var it = function (o) { o.w = R.w; o.nx = nx; st.push(o); return o; };
      it({ slide: 3, line: 1 + (n ? ',2-' + (n + 1) : ''), ph: 'idea', cap: 'An <b>iterator</b> is a separate object that lets us visit the elements of a collection, one at a time. The collection keeps the elements; the iterator only remembers <b>where it is</b>.' });
      it({ slide: 4, line: 1, ph: 'tree', cap: 'Every Java collection is <b>Iterable</b>: Iterable is at the top of the Collection interfaces, so ArrayList, LinkedList, ArrayDeque, HashSet, TreeSet… all give iterators.' });
      it({ slide: 5, line: base, made: true, cap: '<code>list.iterator()</code> (the only method of Iterable) returns a <b>new</b> iterator object, positioned before the first element.' });
      for (var i = 0; i < n; i++) {
        it({ slide: 6, line: base + 1, made: true, ask: true, cap: '<b>hasNext()</b> → true: element ' + i + ' (' + h(R.w[i]) + ') has not been visited yet.' });
        nx++;
        it({ slide: 6, line: (base + 2) + '-' + (base + 3), made: true, got: i, cap: '<b>next()</b> returns ' + h(R.w[i]) + ' and moves the iterator one step forward.', out: R.w[i] });
      }
      it({ slide: 6, line: base + 1, made: true, ask: true, end: true, cap: '<b>hasNext()</b> → <b>false</b>: no more elements' + (n ? '' : ' (the list is empty, so the loop body never runs)') + '. The loop ends.' });
      it({ slide: 6, line: base + 5, made: true, end: true, out: 'false', cap: 'The iterator is now <b>used up</b>: it does not go back to the start. A new loop needs a new <code>list.iterator()</code>. (remove(), the third method, comes later.)' });
      return st;
    },
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'tree') {
        var bx = function (id, x, y, t, cls) { items.push(B(id, x, y, 104, 32, { title: t, mono: true, size: 11, tone: cls ? 'teal' : 'blue', fill: 'solid' })); };
        bx('h0', 228, 14, 'Iterable'); bx('h1', 228, 76, 'Collection'); bx('h2', 40, 146, 'Queue'); bx('h3', 228, 146, 'List'); bx('h4', 416, 146, 'Set');
        bx('h5', 40, 216, 'Deque'); bx('h6', 168, 216, 'LinkedList', 1); bx('h7', 288, 216, 'ArrayList', 1); bx('h8', 416, 216, 'SortedSet');
        bx('h9', 40, 286, 'ArrayDeque', 1); bx('h10', 416, 286, 'TreeSet', 1); bx('h11', 296, 286, 'HashSet', 1);
        [['h1', 280, 76, 280, 46], ['h3', 280, 146, 280, 108], ['h2', 92, 146, 250, 108], ['h4', 468, 146, 310, 108], ['h5', 92, 216, 92, 178], ['h8', 468, 216, 468, 178]].forEach(function (a, i) { items.push(A('he' + i, a[1], a[2], a[3], a[4], { tone: 'blue' })); });
        [[220, 216, 262, 178], [340, 216, 298, 178], [168, 232, 144, 232], [92, 286, 92, 248], [468, 286, 468, 248], [348, 286, 440, 248]].forEach(function (a, i) { items.push(A('hi' + i, a[0], a[1], a[2], a[3], { tone: 'teal', dash: true })); });
        items.push(T('hl1', 400, 40, 'interfaces: blue', { size: 12, bold: true, tone: 'blue' }));
        items.push(T('hl2', 400, 60, 'classes: green', { size: 12, bold: true, tone: 'teal' }));
        return items;
      }
      var n = s.w.length, cw = 76, x0 = 280 - n * cw / 2;
      items.push(T('lb', 30, 36, 'list (the collection)', { size: 12, bold: true, tone: 'muted' }));
      s.w.forEach(function (t, i) { var on = i === s.got; items.push(B('e' + i, x0 + i * cw + 3, 60, cw - 6, 42, { title: t, mono: true, size: 13, tone: on ? 'accent' : i < s.nx ? 'teal' : 'blue', fill: on ? 'solid' : 'soft', hi: on })); });
      if (!n) items.push(T('em', 280, 86, '(empty)', { anchor: 'middle', mono: true, size: 14, tone: 'muted' }));
      if (s.ph === 'idea') {
        items.push(OBJ('io', 190, 190, 180, { name: 'iterator', fields: ['remembers: where am I?'], tone: 'accent' }));
        items.push(A('ia', 280, 190, 280, 110, { tone: 'accent', dash: true, label: 'visits one by one', la: 'start', lx: 8 }));
        return items;
      }
      if (s.made) {
        var cx = n ? x0 + Math.min(s.nx, n) * cw : 280;
        items.push(B('cur', cx - 2, 52, 4, 58, { tone: s.end ? 'red' : 'accent', fill: 'solid', r: 2 }));
        items.push(T('curl', cx, 132, s.end ? 'at the end' : 'next comes here', { anchor: 'middle', size: 11, bold: true, tone: s.end ? 'red' : 'accent' }));
        items.push(OBJ('io', 30, 200, 210, { name: 'Iterator<String> itr', fields: ['hasNext()', 'next()', 'remove()'], tone: 'accent' }));
        if (s.ask) items.push(B('ans', 300, 222, 140, 40, { title: 'hasNext() = ' + !s.end, mono: true, size: 13, tone: s.end ? 'red' : 'teal', fill: 'solid' }));
        if (s.got != null) items.push(B('ret', 300, 222, 140, 40, { title: '"' + s.w[s.got] + '"', mono: true, size: 14, tone: 'accent', fill: 'solid', tag: 'next() returned' }));
      }
      return items;
    }
  };

  /* ---------- 2. three ways to traverse, and removing (slides 8-14) ---------- */
  var NM = 'Hadi Hadi Rakan Turki Hadi Ibrahim Omar Mostafa Hadi';
  var WAYS = [
    function () { return ['int size = list.size();', 'for (int i = 0; i < size; i++) {', '  System.out.println(list.get(i));', '}']; },
    function () { return ['Iterator<String> itr = list.iterator();', 'while (itr.hasNext()) {', '  System.out.println(itr.next());', '}']; },
    function () { return ['for (String s : list) {', '  System.out.println(s);', '}']; },
    function (t) { return ['Iterator<String> iter = list.iterator();', 'while (iter.hasNext()) {', '  String s = iter.next();   // next iterator element', '  System.out.println(s);', '  if (s.equals("' + t + '"))   // if "' + t + '" is found', '    iter.remove();           // Remove from the list', '}', 'System.out.println(list);']; },
    function (t) { return ['for (String s : list) {', '  System.out.println(s);', '  if (s.equals("' + t + '"))', '    list.add("Ali");   // the list changes during the loop!', '}']; }
  ];
  function wrun(v) {
    var w = words(v.names, 9, 7); if (!w.length) w = ['Hadi'];
    var way = Math.min(5, Math.max(1, Math.trunc(v.way))), t = (words(v.t, 1, 7)[0] || 'Hadi');
    var code = ['List<String> list = new LinkedList<>();', '// Adding names to the list'];
    w.forEach(function (x) { code.push('list.add("' + x + '");'); });
    code.push('// Way-' + Math.min(way, 3) + (way > 3 ? (way === 4 ? ': remove with an iterator' : ': change the list inside for-each') : ''));
    var base = code.length;
    code = code.concat(WAYS[way - 1](t));
    return { w: w, way: way, t: t, base: base, code: code.join('\n') };
  }
  var threeways = {
    id: 'threeways', slides: [8, 14], title: 'get(i), an iterator, or for-each',
    code: function (v) { return wrun(v).code; },
    inputs: [{ id: 'way', label: 'way', value: 1, min: 1, max: 5 }, { id: 'names', type: 'text', label: 'names', value: NM, minlen: 1, maxlen: 70 }, { id: 't', type: 'text', label: 'target', value: 'Hadi', minlen: 1, maxlen: 7 }],
    inputsLabel: 'way 1 get(i), 2 iterator, 3 for-each, 4 remove the target with an iterator, 5 list.add inside for-each.',
    presets: [{ label: 'Way-1: get(i)', values: { way: 1, names: NM, t: 'Hadi' } }, { label: 'Way-2: iterator', values: { way: 2, names: NM, t: 'Hadi' } }, { label: 'Way-3: for-each', values: { way: 3, names: NM, t: 'Hadi' } }, { label: 'remove every Hadi', values: { way: 4, names: NM, t: 'Hadi' } }, { label: 'remove: neighbours', values: { way: 4, names: 'Lama Lama Nora Lama', t: 'Lama' } }, { label: 'add during for-each', values: { way: 5, names: NM, t: 'Rakan' } }],
    steps: function (v) {
      var R = wrun(v), b = R.base, st = [], list = R.w.map(function (t, i) { return { id: 'n' + i, t: t }; }), hops = 0, nxt = 0, ids = list.length;
      var snap = function (o) { o.list = list.slice(); o.hops = hops; o.nxt = o.nxt != null ? o.nxt : nxt; st.push(o); return o; };
      snap({ slide: 8, line: '1-' + (b - 1), nxt: -1, cap: 'A <b>LinkedList</b> of ' + list.length + ' names (some repeat). Now three ways to print them all.' });
      if (R.way === 1) {
        snap({ slide: 9, line: b + 1, nxt: -1, cap: 'Way-1: an index loop with <code>get(i)</code>. It looks simple, but a linked list has no indexes: each get(i) must <b>walk</b> to node i.' });
        for (var i = 0; i < list.length; i++) {
          var n = list.length, fr = i < (n >> 1), h0 = fr ? i : n - 1 - i; hops += h0;
          snap({ slide: 9, line: (b + 2) + '-' + (b + 3), nxt: -1, look: i, walk: fr ? [0, i] : [i, n - 1], cap: 'get(' + i + ') starts at the ' + (fr ? 'front' : 'rear') + ' and walks <b>' + h0 + '</b> step' + (h0 === 1 ? '' : 's') + '. Total so far: ' + hops + '.', out: list[i].t });
        }
        snap({ slide: 9, line: b + 1, nxt: -1, cap: 'Way-1 walked <b>' + hops + '</b> steps for ' + list.length + ' elements (it grows like n², O(n²)). Also, this loop cannot remove elements safely.' });
      } else if (R.way === 2 || R.way === 3) {
        var w3 = R.way === 3;
        snap({ slide: w3 ? 11 : 10, line: b + 1, nxt: 0, cap: w3 ? 'Way-3: the <b>for-each</b> loop. Behind the scenes Java calls list.iterator(), hasNext() and next(), so it works for any Iterable.' : 'Way-2: <code>list.iterator()</code> gives an iterator that starts before the first node.' });
        for (i = 0; i < list.length; i++) {
          hops += i ? 1 : 0; nxt = i + 1;
          snap({ slide: w3 ? 11 : 10, line: w3 ? (b + 2) : (b + 2) + '-' + (b + 3), look: i, cap: (w3 ? 's = ' : 'next() returns ') + h(list[i].t) + ' and moves one node forward' + (i ? ' (one step)' : '') + '. Total steps: ' + hops + '.', out: list[i].t });
        }
        snap({ slide: w3 ? 11 : 10, line: w3 ? b + 1 : b + 2, cap: 'hasNext() is false: done. Only <b>' + hops + '</b> steps (O(n)): the iterator remembers its node. ' + (w3 ? 'But for-each gives <b>no access to remove()</b>.' : 'And the iterator can <b>remove</b> elements.') });
      } else if (R.way === 4) {
        snap({ slide: 12, line: b + 1, nxt: 0, cap: 'Use an iterator object when you want to <b>remove</b> elements while walking (or stop early, like a search). Here: remove every "' + h(R.t) + '".' });
        var out = [];
        while (nxt < list.length) {
          var e = list[nxt]; nxt++;
          snap({ slide: 13, line: (b + 3) + '-' + (b + 5), look: nxt - 1, cap: 'next() → ' + h(e.t) + '. Print it. ' + (e.t === R.t ? 'It equals "' + h(R.t) + '"…' : 'Not "' + h(R.t) + '": keep it.'), out: e.t });
          if (e.t === R.t) { list.splice(nxt - 1, 1); nxt--; snap({ slide: 13, line: b + 6, gone: e, cap: '…so <code>iter.remove()</code> removes it from the list (the last element next() returned). The iterator stays in the right place: the next name is still visited.' }); }
        }
        snap({ slide: 13, line: b + 8, cap: 'One walk, O(n): ' + (R.w.length - list.length) + ' removed.', out: '[' + list.map(function (q) { return q.t; }).join(', ') + ']' });
      } else {
        var mod = 0, exp = 0;
        snap({ slide: 14, line: b + 1, nxt: 0, cap: 'Java’s iterators are <b>fail-fast</b>: the structure of the list must not change while an iterator (here the hidden one of for-each) is in use. Watch what happens when we add.' });
        while (nxt < list.length) {
          if (mod !== exp) { snap({ slide: 14, line: b + 1, err: true, out: CME, cap: 'The next call to next() sees that the list was modified behind its back and throws a <b>ConcurrentModificationException</b>.' }); break; }
          e = list[nxt]; nxt++;
          snap({ slide: 14, line: (b + 1) + '-' + (b + 2), look: nxt - 1, cap: 's = ' + h(e.t) + '.', out: e.t });
          if (e.t === R.t) { list.push({ id: 'n' + ids++, t: 'Ali' }); mod++; snap({ slide: 14, line: (b + 3) + '-' + (b + 4), look: list.length - 1, cap: '"' + h(R.t) + '" → <code>list.add("Ali")</code>: the list changed, but not through the iterator.' }); }
        }
        if (!st[st.length - 1].err) snap({ slide: 14, line: b + 1, cap: mod ? 'The add happened at the last element, so the loop ended before next() could check. Still a bug: never change a list inside for-each.' : '"' + h(R.t) + '" is not in the list, so nothing was added and the loop ends normally.' });
      }
      return st;
    },
    draw: function (k, s) {
      var items = [], n = s.list.length, st = Math.min(60, Math.floor(536 / Math.max(n, 1))), w = st - 10, x0 = 280 - (n * st - 10) / 2, y = 120;
      var tone = s.list.map(function (e, i) { return i === s.look ? 'accent' : s.walk && i >= s.walk[0] && i <= s.walk[1] ? 'teal' : 'blue'; });
      items = items.concat(nodes(s.list, { y: y, w: w, step: st, x0: x0, tone: tone }));
      if (n === 1) items.push(P('pf', x0 + w / 2, y - 4, 'front rear', { dir: 'down', len: 24 }));
      else if (n) { items.push(P('pf', x0 + w / 2, y - 4, 'front', { dir: 'down', len: 24 })); items.push(P('pr', x0 + (n - 1) * st + w / 2, y - 4, 'rear', { dir: 'down', len: 24 })); }
      if (s.nxt >= 0) {
        var cx = s.nxt < n ? x0 + s.nxt * st + w / 2 : x0 + n * st;
        items.push(P('it', cx, y + 44, s.nxt < n ? 'next' : 'end', { dir: 'up', len: 30 }));
      }
      items.push(T('hp', 548, 36, 'steps walked: ' + s.hops, { anchor: 'end', mono: true, size: 14, bold: true, tone: 'accent' }));
      if (s.gone) items.push(B(s.gone.id, 30, 250, 90, 36, { title: s.gone.t, mono: true, size: 13, tone: 'red', tag: 'removed' }));
      if (s.err) items.push(T('er', 280, 280, 'ConcurrentModificationException', { anchor: 'middle', mono: true, size: 15, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* iterator operations: h hasNext, n next, r remove, +X list.add("X") */
  function iops(s) { var out = []; toks(s, 14).forEach(function (t) { var m; if (t === 'h' || t === 'n' || t === 'r') out.push({ k: t }); else if ((m = /^\+(\w{1,3})$/.exec(t))) out.push({ k: 'add', x: m[1] }); }); return out; }
  function iline(o) { return o.k === 'h' ? 'System.out.println(itr.hasNext());' : o.k === 'n' ? 'System.out.println(itr.next());' : o.k === 'r' ? 'itr.remove();' : 'list.add("' + o.x + '");   // not through the iterator'; }

  /* ---------- 3. our ArrayListIterator (slides 16-23) ---------- */
  var AI = 'public class ArrayList<T> implements List<T>, Iterable<T> {\n  private T[] array;      // array implementation of the list\n  private int count;      // count of elements in the list\n  private int modCount;   // modification counter\n  . . .\n  public void add(T e) {\n    . . .                 // statements\n    modCount++;           // count this add modification\n  }\n  public void add(int index, T e) {\n    . . .                 // statements\n    modCount++;           // count this add modification\n  }\n  public T remove(int index) {\n    . . .                 // statements\n    modCount++;           // count this remove modification\n    return element;       // return element at index\n  }\n  // Returns a new iterator object for the ArrayList class\n  public Iterator<T> iterator() {\n    return new ArrayListIterator();\n  }\n  private class ArrayListIterator implements Iterator<T> {\n    int next = 0;              // Index of next element in iterator\n    int itrCount = modCount;   // Iterator count of modifications\n    boolean canRemove = false; // Allows remove to delete element\n    // Returns true if this iterator has at least one more element\n    public boolean hasNext() {\n      // Detects modification done to the list while using iterator\n      if (itrCount != modCount)\n        throw new ConcurrentModificationException();\n      return (next < count);\n    }\n    // Returns next element in the iterator and increments next index\n    public T next() {\n      if (!hasNext()) throw new NoSuchElementException();\n      canRemove = true;   // Allows remove to delete this element\n      return array[next++];\n    }\n    // Removes the current element in the iterator\n    public void remove() {\n      // Detects modifications done to the list\n      if (itrCount != modCount)\n        throw new ConcurrentModificationException();\n      // Detects illegal state - should call next() before remove()\n      if (!canRemove) throw new IllegalStateException();\n      // Decrement next index before removing current element\n      next--;\n      // Call remove method in ArrayList to remove current element\n      ArrayList.this.remove(next);\n      itrCount++;          // Increment iterator counter\n      canRemove = false    // must call next() before remove()\n    }\n  }\n}';
  function arun(v) {
    var w = words(v.vals, 6, 3); if (!w.length) w = ['A'];
    var ops = iops(v.ops), code = AI.split('\n');
    code.push('', '// in main:', 'ArrayList<String> list = new ArrayList<>();');
    w.forEach(function (x) { code.push('list.add("' + x + '");'); });
    code.push('Iterator<String> itr = list.iterator();');
    var itl = code.length;
    ops.forEach(function (o) { o.line = code.length + 1; code.push(iline(o)); });
    return { w: w, ops: ops, itl: itl, code: code.join('\n') };
  }
  var alitr = {
    id: 'alitr', slides: [16, 23], title: 'ArrayListIterator: next, itrCount and canRemove',
    code: function (v) { return arun(v).code; },
    inputs: [{ id: 'vals', type: 'text', label: 'list', value: 'A B C D', minlen: 1, maxlen: 24 }, { id: 'ops', type: 'text', label: 'iterator calls', value: 'n n r h n', maxlen: 40 }],
    inputsLabel: '<code>h</code> hasNext(), <code>n</code> next(), <code>r</code> remove(), <code>+X</code> list.add("X") while the iterator is in use.',
    presets: [{ label: 'next, next, remove', values: { vals: 'A B C D', ops: 'n n r h n' } }, { label: 'remove twice', values: { vals: 'A B C', ops: 'n r r' } }, { label: 'remove before next', values: { vals: 'A B C', ops: 'r' } }, { label: 'next past the end', values: { vals: 'K L', ops: 'n n h n' } }, { label: 'list changes → exception', values: { vals: 'A B C', ops: 'n +Z h' } }],
    steps: function (v) {
      var R = arun(v), code = R.code, st = [], arr = R.w.map(function (t, i) { return { id: 'e' + i, t: t }; }), mod = arr.length, nx = 0, ic = mod, can = false, ids = arr.length;
      var tl = function (f, n) { return L(code, f, n); };
      var snap = function (o) { o.arr = arr.slice(); o.mod = mod; o.nx = nx; o.ic = ic; o.can = can; st.push(o); return o; };
      snap({ slide: 16, line: tl('public class ArrayList<T> implements') + ',' + tl('public Iterator<T> iterator()') + '-' + (tl('public Iterator<T> iterator()') + 2), ph: 'pre', cap: 'Our ArrayList now <b>implements Iterable&lt;T&gt;</b> and has an iterator() method, so it can give iterators and works with for-each.' });
      snap({ slide: 17, line: tl('private class ArrayListIterator'), ph: 'pre', cap: 'iterator() returns a new <b>ArrayListIterator</b>: a <b>private inner class</b> inside ArrayList, used only by iterator().' });
      snap({ slide: 18, line: tl('private class ArrayListIterator') + ',' + tl('ArrayList.this.remove(next);'), ph: 'inner', cap: 'An <b>inner</b> class (no static) is tied to an outer object: the iterator can read <code>array</code>, <code>count</code> and <code>modCount</code> of <b>its</b> list. A nested <b>static</b> class (like Node) cannot.' });
      snap({ slide: 19, line: tl('private int modCount;') + ',' + tl('list.add("' + R.w[0] + '");') + '-' + tl('list.add("' + R.w[R.w.length - 1] + '");'), ph: 'nolist', cap: '<b>modCount</b> counts every change by add and remove. ' + arr.length + ' adds → modCount = ' + mod + '.' });
      snap({ slide: 21, line: R.itl + ',' + tl('int next = 0;') + '-' + tl('boolean canRemove = false;'), cap: 'list.iterator(): the new iterator has <code>next = 0</code>, <code>itrCount = modCount</code> (' + mod + ') and <code>canRemove = false</code>.' });
      for (var k = 0; k < R.ops.length; k++) {
        var o = R.ops[k], ln = o.line, hl = tl('public boolean hasNext()');
        if (o.k === 'add') { arr.push({ id: 'e' + ids++, t: o.x }); mod++; snap({ slide: 20, line: ln + ',' + tl('modCount++;           // count this add', 1), fresh: arr.length - 1, cap: '<code>list.add("' + h(o.x) + '")</code> is called directly on the list: modCount++ → ' + mod + '. The iterator’s itrCount is still ' + ic + '.' }); continue; }
        if ((o.k === 'h' || o.k === 'n' || o.k === 'r') && ic !== mod) { snap({ slide: o.k === 'r' ? 23 : 22, line: ln + ',' + (o.k === 'r' ? tl('// Detects modifications done to the list') + 1 : hl + 2) + '-' + (o.k === 'r' ? tl('// Detects modifications done to the list') + 2 : hl + 3), err: 'cme', out: CME, cap: 'itrCount (' + ic + ') != modCount (' + mod + '): the list was changed outside the iterator. It throws a <b>ConcurrentModificationException</b> (fail-fast).' }); break; }
        if (o.k === 'h') { snap({ slide: 22, line: ln + ',' + (hl + 2) + '-' + (hl + 4), ask: true, out: String(nx < arr.length), cap: 'hasNext(): the counts agree, and <code>next &lt; count</code> is ' + nx + ' &lt; ' + arr.length + ' → <b>' + (nx < arr.length) + '</b>.' }); }
        else if (o.k === 'n') {
          var nl = tl('public T next()');
          if (nx >= arr.length) { snap({ slide: 22, line: ln + ',' + (nl + 1), err: 'nse', out: NSE, cap: 'next(): hasNext() is false (next = ' + nx + ' = count), so it throws a <b>NoSuchElementException</b>.' }); break; }
          can = true; var e = arr[nx]; nx++;
          snap({ slide: 22, line: ln + ',' + (nl + 1) + '-' + (nl + 3), got: nx - 1, out: e.t, cap: 'next(): canRemove = true, and <code>return array[next++]</code> returns array[' + (nx - 1) + '] = "' + h(e.t) + '", then next = ' + nx + '.' });
        } else {
          var rl = tl('if (!canRemove) throw new IllegalStateException();');
          if (!can) { snap({ slide: 23, line: ln + ',' + rl, err: 'ise', out: ISE, cap: 'remove(): canRemove is false (' + (nx ? 'remove was already called after the last next()' : 'next() was never called') + '). It throws an <b>IllegalStateException</b>.' }); break; }
          nx--; var g = arr[nx];
          snap({ slide: 23, line: ln + ',' + tl('next--;'), got: nx, cap: 'remove(): <code>next--</code> → ' + nx + ': the index of the element that next() just returned ("' + h(g.t) + '").' });
          arr.splice(nx, 1); mod++;
          snap({ slide: 23, line: ln + ',' + tl('ArrayList.this.remove(next);'), gone: g, cap: '<code>ArrayList.this.remove(' + nx + ')</code> calls the <b>outer</b> list’s remove: the elements after it shift left, and modCount++ → ' + mod + '.' });
          ic++; can = false;
          snap({ slide: 23, line: ln + ',' + tl('itrCount++;') + '-' + tl('canRemove = false    //'), cap: 'itrCount++ → ' + ic + ' (equal to modCount again: this change was made by the iterator itself). canRemove = false. next = ' + nx + ' now points at the element that came after the removed one.' });
        }
      }
      if (!st[st.length - 1].err) snap({ slide: 23, line: tl('canRemove = false    //'), cap: 'Note: on the slide this line has no <code>;</code> at the end, so it does not compile. It should be <code>canRemove = false;</code>' });
      return st;
    },
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'inner') {
        items.push(OBJ('ol', 30, 40, 220, { name: 'list : ArrayList', fields: ['array', 'count', 'modCount'], tone: 'blue' }));
        items.push(OBJ('it', 320, 40, 210, { name: 'ArrayListIterator', fields: ['next', 'itrCount', 'canRemove'], tone: 'accent' }));
        items.push(A('ot', 320, 80, 250, 80, { tone: 'accent', label: 'ArrayList.this' }));
        items.push(B('nd', 320, 220, 210, 50, { title: 'Node (static nested)', mono: true, size: 12, tone: 'muted', tag: 'no link to an outer object' }));
        items.push(T('t1', 30, 210, 'inner class → can use', { size: 12, tone: 'muted' }));
        items.push(T('t2', 30, 230, 'array, count, modCount', { mono: true, size: 12, bold: true, tone: 'accent' }));
        return items;
      }
      if (s.ph === 'pre') {
        items.push(CLS('c1', 30, 50, 250, { name: 'ArrayList<T>', fields: ['array, count, modCount'], methods: ['add, remove, get, …', 'iterator() : Iterator<T>'], tone: 'blue' }));
        items.push(CLS('c2', 330, 60, 200, { name: 'Iterable<T>', methods: ['iterator()'], tone: 'teal' }));
        items.push(A('ca', 280, 100, 330, 100, { dash: true, tone: 'teal', label: 'implements' }));
        items.push(B('c3', 60, 240, 240, 44, { title: 'private class ArrayListIterator', mono: true, size: 11, tone: 'accent', tag: 'inside ArrayList' }));
        items.push(A('cb', 180, 186, 180, 240, { tone: 'accent', label: 'new', la: 'start', lx: 8 }));
        return items;
      }
      var n = s.arr.length, cw = Math.min(64, Math.floor(400 / Math.max(n, 1))), x0 = 40, y = 70;
      s.arr.forEach(function (e, i) {
        var on = i === s.got, x = x0 + i * cw;
        items.push(B(e.id, x, y, cw - 6, 42, { title: e.t, mono: true, size: 14, tone: on ? 'accent' : i === s.fresh ? 'red' : i < s.nx ? 'teal' : 'blue', fill: on ? 'solid' : 'soft', hi: on }));
        items.push(T('ix' + i, x + cw / 2 - 3, y + 60, String(i), { anchor: 'middle', mono: true, size: 11, tone: 'muted' }));
      });
      if (s.ph !== 'nolist') items.push(P('pn', x0 + Math.min(s.nx, n) * cw + (s.nx < n ? cw / 2 - 3 : 0), y - 4, 'next = ' + s.nx, { dir: 'down', len: 22 }));
      items.push(T('cc', 548, 40, 'count = ' + n, { anchor: 'end', mono: true, size: 14, bold: true }));
      items.push(T('mc', 548, 64, 'modCount = ' + s.mod, { anchor: 'end', mono: true, size: 14, bold: true, tone: s.ic !== s.mod ? 'red' : 'blue' }));
      if (s.ph !== 'nolist') {
        items.push(OBJ('itr', 40, 170, 230, { name: 'itr (ArrayListIterator)', fields: ['next      = ' + s.nx, 'itrCount  = ' + s.ic, 'canRemove = ' + s.can], tone: s.ic !== s.mod ? 'red' : 'accent' }));
        if (s.ic !== s.mod) items.push(T('ne', 290, 230, 'itrCount != modCount', { mono: true, size: 13, bold: true, tone: 'red' }));
      }
      if (s.gone) items.push(B(s.gone.id, 420, 250, 100, 38, { title: s.gone.t, mono: true, size: 14, tone: 'red', tag: 'removed' }));
      if (s.err) items.push(T('er', 300, 310, s.err === 'cme' ? 'ConcurrentModificationException' : s.err === 'nse' ? 'NoSuchElementException' : 'IllegalStateException', { anchor: 'middle', mono: true, size: 14, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* ---------- 4. our LinkedListIterator (slides 25-30) ---------- */
  var LI = 'public class LinkedList<T> implements List<T>, Iterable<T> {\n  . . .\n  // Returns a new iterator object for the LinkedList class\n  public Iterator<T> iterator() {\n    return new LinkedListIterator();\n  }\n  private class LinkedListIterator implements Iterator<T> {\n    Node<T> node;        // reference to a node in iterator\n    int itrCount;        // Iterator count of modifications\n    boolean canRemove;   // track if remove() can be called\n    // Constructor for LinkedListIterator\n    public LinkedListIterator() {\n      node = front;          // start at the front node\n      itrCount = modCount;   // same as modCount before iterating\n      canRemove = false;     // must call next() before remove()\n    }\n    // Returns true if this iterator has at least one more node\n    public boolean hasNext() {\n      if (itrCount != modCount)   // Detects modifications in list\n        throw new ConcurrentModificationException();\n      return (node != null);\n    }\n    // Advances the node pointer and returns the current element\n    public T next() {\n      if (!hasNext()) throw new NoSuchElementException();\n      T element = node.element;   // current element\n      canRemove = true;           // remove() can delete this node\n      node = node.next;           // Point to next node in linked list\n      return element;\n    }\n    // Removes the previous node in the iterator\n    public void remove() {\n      if (itrCount != modCount)   // Detects modifications\n        throw new ConcurrentModificationException();\n      // Detects illegal state, should call next() before remove()\n      if (!canRemove) throw new IllegalStateException();\n      // Reference to previous node in the linked list\n      Node<T> prev = (node==null)? rear : node.prev;\n      removeNode(prev);           // Remove previous node from list\n      itrCount++;                 // Increment iterator counter\n      canRemove = false;          // must call next() before remove()\n    }\n  }\n  // Helper method to remove a node from a doubly-linked list\n  // Relinks the previous node to the next node\n  private void removeNode(Node<T> node) {\n    Node<T> next = node.next;   // Reference to next node\n    Node<T> prev = node.prev;   // Reference to previous node\n    node.next = null;           // Unlink the next node\n    node.prev = null;           // Unlink the previous node\n    if (prev != null) prev.next=next;   // Relink prev node to next\n    if (next != null) next.prev=prev;   // Relink next node to prev\n    if (node == front) front = next;    // Adjust the front pointer\n    if (node == rear)  rear = prev;     // Adjust the rear pointer\n    count--;                            // Decrement count of nodes\n    modCount++;                         // Count this modification\n  }\n}';
  function lrun(v) {
    var w = words(v.vals, 6, 3); if (!w.length) w = ['A'];
    var ops = iops(v.ops), code = LI.split('\n');
    code.push('', '// in main:', 'LinkedList<String> list = new LinkedList<>();');
    w.forEach(function (x) { code.push('list.add("' + x + '");'); });
    code.push('Iterator<String> itr = list.iterator();');
    var itl = code.length;
    ops.forEach(function (o) { o.line = code.length + 1; code.push(iline(o)); });
    return { w: w, ops: ops, itl: itl, code: code.join('\n') };
  }
  var llitr = {
    id: 'llitr', slides: [25, 30], title: 'LinkedListIterator removes the node before it',
    code: function (v) { return lrun(v).code; },
    inputs: [{ id: 'vals', type: 'text', label: 'list', value: 'A B C D', minlen: 1, maxlen: 24 }, { id: 'ops', type: 'text', label: 'iterator calls', value: 'n n r n n r h', maxlen: 40 }],
    inputsLabel: '<code>h</code> hasNext(), <code>n</code> next(), <code>r</code> remove(), <code>+X</code> list.add("X") while the iterator is in use.',
    presets: [{ label: 'remove a middle node and the rear', values: { vals: 'A B C D', ops: 'n n r n n r h' } }, { label: 'remove the front', values: { vals: 'P Q R', ops: 'n r n' } }, { label: 'remove every node', values: { vals: 'X Y', ops: 'n r n r h' } }, { label: 'remove twice', values: { vals: 'A B', ops: 'n r r' } }, { label: 'list changes → exception', values: { vals: 'A B C', ops: 'n +Z n' } }],
    steps: function (v) {
      var R = lrun(v), code = R.code, st = [], list = R.w.map(function (t, i) { return { id: 'd' + i, t: t }; }), mod = list.length, node = list[0].id, ic = mod, can = false, ids = list.length;
      var tl = function (f, n) { return L(code, f, n); };
      var idx = function () { if (node == null) return list.length; for (var i = 0; i < list.length; i++) if (list[i].id === node) return i; return list.length; };
      var snap = function (o) { o.list = list.slice(); o.mod = mod; o.at = o.at != null ? o.at : idx(); o.ic = ic; o.can = can; st.push(o); return o; };
      snap({ slide: 25, line: tl('public class LinkedList<T> implements') + ',' + tl('public Iterator<T> iterator()') + '-' + (tl('public Iterator<T> iterator()') + 2), cap: 'Our LinkedList also implements <b>Iterable&lt;T&gt;</b>: iterator() returns a new <b>LinkedListIterator</b>, an inner class. modCount = ' + mod + ' after ' + list.length + ' adds.', at: -1 });
      snap({ slide: 26, line: R.itl + ',' + tl('node = front;') + '-' + tl('canRemove = false;     // must'), cap: 'The constructor: <code>node = front</code> (the node next() will return), itrCount = modCount = ' + mod + ', canRemove = false.' });
      for (var k = 0; k < R.ops.length; k++) {
        var o = R.ops[k], ln = o.line, hl = tl('public boolean hasNext()'), at = idx();
        if (o.k === 'add') { list.push({ id: 'd' + ids++, t: o.x }); mod++; snap({ slide: 27, line: ln, fresh: list.length - 1, cap: '<code>list.add("' + h(o.x) + '")</code> changes the list directly: modCount → ' + mod + ', but itrCount is still ' + ic + '.' + (node == null ? ' (The iterator’s node stays null.)' : '') }); continue; }
        if (ic !== mod) { snap({ slide: o.k === 'r' ? 28 : 27, line: ln + ',' + (o.k === 'r' ? tl('public void remove()') + 1 : hl + 1) + '-' + (o.k === 'r' ? tl('public void remove()') + 2 : hl + 2), err: 'cme', out: CME, cap: 'itrCount (' + ic + ') != modCount (' + mod + '): <b>ConcurrentModificationException</b>.' }); break; }
        if (o.k === 'h') snap({ slide: 27, line: ln + ',' + (hl + 1) + '-' + (hl + 3), out: String(node != null), cap: 'hasNext(): <code>node != null</code> → <b>' + (node != null) + '</b>' + (node == null ? ' (node is null: we passed the rear).' : '.') });
        else if (o.k === 'n') {
          var nl = tl('public T next()');
          if (node == null) { snap({ slide: 27, line: ln + ',' + (nl + 1), err: 'nse', out: NSE, cap: 'next(): node is null, so hasNext() is false: <b>NoSuchElementException</b>.' }); break; }
          var e = list[at]; can = true; node = at + 1 < list.length ? list[at + 1].id : null;
          snap({ slide: 27, line: ln + ',' + (nl + 2) + '-' + (nl + 5), got: at, out: e.t, cap: 'next(): take node.element ("' + h(e.t) + '"), canRemove = true, then <code>node = node.next</code>' + (node == null ? ' = <b>null</b> (it was the rear).' : ' → "' + h(list[at + 1].t) + '".') + ' The returned node is now <b>behind</b> the iterator.' });
        } else {
          var rl = tl('if (!canRemove) throw new IllegalStateException();');
          if (!can) { snap({ slide: 28, line: ln + ',' + rl, err: 'ise', out: ISE, cap: 'remove(): canRemove is false: <b>IllegalStateException</b>. Call next() before each remove().' }); break; }
          var pi = at - 1, pv = list[pi];
          snap({ slide: 28, line: ln + ',' + tl('Node<T> prev = (node==null)? rear : node.prev;'), got: pi, rm: pi, cap: 'remove(): the node to delete is the one <b>before</b> node: ' + (node == null ? 'node is null, so <code>prev = rear</code>' : '<code>prev = node.prev</code>') + ' = "' + h(pv.t) + '".' });
          var where = list.length === 1 ? 'It is the only node: front and rear both become null.' : pi === 0 ? 'It was the front, so front = next.' : pi === list.length - 1 ? 'It was the rear, so rear = prev.' : 'Its prev and next nodes are relinked to each other.';
          list.splice(pi, 1); mod++;
          snap({ slide: 30, line: ln + ',' + tl('removeNode(prev);') + ',' + tl('private void removeNode(Node<T> node)') + '-' + tl('// Count this modification'), gone: pv, cap: '<b>removeNode(prev)</b>: ' + where + ' count-- and <b>modCount++</b> → ' + mod + '. The garbage collector deletes the unlinked node.' });
          ic++; can = false;
          snap({ slide: 28, line: ln + ',' + tl('itrCount++;') + '-' + tl('canRemove = false;          // must'), cap: 'itrCount++ → ' + ic + ' (equal to modCount), canRemove = false. node did not move: it still points at the next element to visit' + (node == null ? ' (null).' : ' ("' + h(list[idx()].t) + '").') });
        }
      }
      return st;
    },
    draw: function (k, s) {
      var items = [], n = s.list.length, st = Math.min(84, Math.floor(420 / Math.max(n, 1))), w = Math.min(50, st - 26), x0 = 40, y = 90;
      var tone = s.list.map(function (e, i) { return i === s.rm ? 'red' : i === s.got ? 'accent' : i === s.fresh ? 'red' : i < s.at ? 'teal' : 'blue'; });
      items = items.concat(nodes(s.list, { y: y, w: w, step: st, x0: x0, tone: tone, dbl: true }));
      if (n) {
        if (n === 1) items.push(P('pf', x0 + w / 2, y - 4, 'front rear', { dir: 'down', len: 22 }));
        else { items.push(P('pf', x0 + w / 2, y - 4, 'front', { dir: 'down', len: 22 })); items.push(P('pr', x0 + (n - 1) * st + w / 2, y - 4, 'rear', { dir: 'down', len: 22 })); }
      } else items.push(T('em', 40, y + 26, 'front = rear = null', { mono: true, size: 14, tone: 'muted' }));
      if (s.at >= 0) {
        if (s.at < n) items.push(P('pn', x0 + s.at * st + w / 2, y + 44, 'node', { dir: 'up', len: 24 }));
        else items.push(T('pn', n ? x0 + n * st + 4 : x0, n ? y + 26 : y + 66, 'node = null', { mono: true, size: 13, bold: true, tone: 'accent' }));
      }
      items.push(T('cc', 548, 34, 'count = ' + n, { anchor: 'end', mono: true, size: 14, bold: true }));
      items.push(T('mc', 548, 58, 'modCount = ' + s.mod, { anchor: 'end', mono: true, size: 14, bold: true, tone: s.ic !== s.mod ? 'red' : 'blue' }));
      if (s.at >= 0) items.push(OBJ('itr', 40, 190, 240, { name: 'itr (LinkedListIterator)', fields: ['node      → ' + (s.at < n ? '"' + s.list[s.at].t + '"' : 'null'), 'itrCount  = ' + s.ic, 'canRemove = ' + s.can], tone: s.ic !== s.mod ? 'red' : 'accent' }));
      if (s.gone) items.push(B(s.gone.id, 420, 220, 90, 38, { title: s.gone.t, mono: true, size: 14, tone: 'red', tag: 'removed', o: 0.8 }));
      if (s.err) items.push(T('er', 300, 318, s.err === 'cme' ? 'ConcurrentModificationException' : s.err === 'nse' ? 'NoSuchElementException' : 'IllegalStateException', { anchor: 'middle', mono: true, size: 14, bold: true, tone: 'red' }));
      return items;
    }
  };

  var code = function (t) { return { type: 'code', lang: 'java', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; };
  var OUT = ['What is an Iterator?', 'Using Iterators', 'Implementing an Array List Iterator', 'Implementing a Linked List Iterator'];
  function outline(on, ex) { return { blocks: OUT.map(function (t, i) { return { type: 'bullet', html: i === on ? '<b>' + t + '</b>' : t }; }), explain: ex }; }
  var part = function (src, a, b) { return src.slice(src.indexOf(a), b ? src.indexOf(b) : undefined).replace(/\n$/, ''); };
  var dedent = function (s, n) { return s.split('\n').map(function (l) { return l.slice(Math.min(n, l.length - l.trimStart().length)); }).join('\n'); };

  addUnit({
    course: 'ds', lesson: '07-iterators',
    blurb: 'Iterable and Iterator, three ways to traverse a list, removing while iterating, fail-fast iterators, and our own ArrayList and LinkedList iterators.',
    parts: [
      { title: 'What is an iterator?', from: 1, to: 6 },
      { title: 'Using iterators', from: 7, to: 14 },
      { title: 'Implementing an array list iterator', from: 15, to: 23 },
      { title: 'Implementing a linked list iterator', from: 24, to: 30 }
    ],
    visuals: [concept, threeways, alitr, llitr],
    slides: {
      1: { cover: true, explain: '<p>An <b>iterator</b> gives one standard way to visit every element of a collection, one at a time. The name comes from “{{iterating|التكرار}}”: looping through a group of objects.</p><pre class="ex">Iterator&lt;String&gt; itr = list.iterator();\nwhile (itr.hasNext()) System.out.println(itr.next());</pre><p>The same loop works for an ArrayList, a LinkedList, a set…</p>' },
      2: outline(-1, '<p>The plan: what an iterator is, how to use one, and how to write iterators for our own ArrayList and LinkedList.</p>'),
      3: { explain: '<p>An iterator is an <b>object</b>, separate from the collection, that lets us loop through the elements:</p><pre class="ex">collection: keeps the elements\niterator:   remembers the current position</pre><p>Java’s collection classes (ArrayList, LinkedList…) all give iterators. They make the usual job “visit each element and do something” simpler, and the same for every collection.</p><p class="watch">Two iterators on the same list are independent: each one has its own position.</p>' },
      4: { text: false, explain: '<p>The Java collections tree:</p><pre class="ex">Iterable ← Collection ← Queue, List, Set\nDeque ← Queue,  SortedSet ← Set</pre><p>Classes (green): LinkedList, ArrayList, ArrayDeque, HashSet, LinkedHashSet, TreeSet. Because <b>Iterable</b> is at the top, every one of them can give an iterator and works with the for-each loop.</p><p class="watch">LinkedList implements both List and Deque.</p>' },
      5: { blocks: [bul('Java implements iterators using two generic interfaces for a collection of elements: Iterable<T> and Iterator<T>.'), bul('The Iterable interface has only one method: iterator()'), { type: 'code', lang: 'text', text: 'Method                  Description\nIterator<T> iterator()  Returns an iterator object for a collection' }, bul('The iterator() method returns an object, which is used to iterate over a collection of elements.'), bul('A collection is iterable if it implements the iterator() method in the Iterable interface.')],
        explain: '<p>Two generic interfaces work together:</p><ul><li><b>Iterable&lt;T&gt;</b>: the collection. One method, <code>iterator()</code>, which returns an iterator.</li><li><b>Iterator&lt;T&gt;</b>: the object that does the walking.</li></ul><pre class="ex">Iterator&lt;String&gt; itr = list.iterator();</pre><p class="watch">Iterable and Iterator are different: the list <b>is</b> Iterable; it <b>gives</b> an Iterator.</p>' },
      6: { blocks: [bul('The generic Iterator<T> interface contains three methods: hasNext(), next(), and remove().'), bul('The hasNext() and next() methods can be used together to loop through and access all the elements of a collection.'), bul('The remove() method deletes the current element of a collection, when it is accessed.')],
        explain: '<p>The three Iterator&lt;T&gt; methods:</p><pre class="ex">boolean hasNext()  are there more elements?\nT next()           return the next one, move forward\nvoid remove()      remove the element next() just returned</pre><p>The usual loop: <code>while (itr.hasNext()) … itr.next() …</code></p><p class="watch">Calling next() when hasNext() is false throws a NoSuchElementException.</p>' },
      7: outline(1, '<p>Next: how to use iterators.</p>'),
      8: { blocks: [bul('Consider the following IteratorExample class:'), code('public class IteratorExample {\n  public static void main(String[] args) {\n    List<String> list = new LinkedList<>();\n    // Adding names to the list\n    list.add("Hadi");\n    list.add("Hadi");\n    list.add("Rakan");\n    list.add("Turki");\n    list.add("Hadi");\n    list.add("Ibrahim");\n    list.add("Omar");\n    list.add("Mostafa");\n    list.add("Hadi");')],
        explain: '<p>The example: a <b>LinkedList</b> of 9 names. “Hadi” appears 4 times, even two in a row.</p><pre class="ex">index 0  1  2     3     4  5       6    7       8\n      Hadi Hadi Rakan Turki Hadi Ibrahim Omar Mostafa Hadi</pre><p>The next slides print this list in three ways, then remove every “Hadi”.</p><p class="watch">The two Hadi in a row are a good test: a careless remove loop often skips the second one.</p>' },
      9: { title: 'Three Ways to Traverse and Print a List', explain: '<p><b>Way-1</b>: a normal index loop with <code>get(i)</code>.</p><pre class="ex">for (int i = 0; i &lt; size; i++)\n  System.out.println(list.get(i));</pre><p>Two problems:</p><ul><li>you cannot safely remove elements during this loop;</li><li>on a <b>linked</b> list, each get(i) walks from an end to node i, so the loop does far more work than needed.</li></ul><p class="watch">On an ArrayList get(i) is O(1), so Way-1 is fine there; on a LinkedList the loop is O(n²).</p>' },
      10: { explain: '<p><b>Way-2</b>: an iterator object.</p><pre class="ex">Iterator&lt;String&gt; itr = list.iterator();\nwhile (itr.hasNext()) System.out.println(itr.next());</pre><p>The iterator remembers its node, so each next() is one step: the loop is O(n) even on a linked list. And it can <b>remove</b> elements.</p><p class="watch">Call next() only once per loop pass: each call moves forward, so two calls would skip elements.</p>' },
      11: { explain: '<p><b>Way-3</b>: the for-each loop.</p><pre class="ex">for (String s : list) System.out.println(s);</pre><p>It is the shortest. Inside, Java creates an iterator and calls hasNext() and next() for you. It works on any class that implements <b>Iterable</b>.</p><p class="watch">for-each hides the iterator, so you cannot call remove(): it cannot be used to remove elements.</p>' },
      12: { blocks: [bul('You may want to use an Iterator object explicitly if you don\'t want to process all the elements.'), bul('For example, searching for a particular element', 1), bul('You may also want to use an Iterator object if you want to call the remove method to remove some elements.'), bul('The for-each loop does not give access to remove method.'), bul('If a class does not implement the Iterable interface, then the Iterator object and the for-each loop cannot be used to traverse the elements of the collection.')],
        explain: '<p>Use an iterator object yourself when:</p><ul><li>you may stop early (for example, a search: stop when found);</li><li>you want to <b>remove</b> some elements.</li></ul><pre class="ex">while (itr.hasNext())\n  if (itr.next().equals(key)) { found = true; break; }</pre><p class="watch">A class that does not implement Iterable cannot be used with for-each or give an iterator. Our ArrayList and LinkedList are like that until we fix them.</p>' },
      13: { blocks: [bul('Using an iterator object is more efficient when traversing and removing specific elements from a list.'), bul('For example, we can search for all occurrences of a specific element and remove them from the list.'), code('Iterator<String> iter = list.iterator();\nwhile (iter.hasNext()) {\n  String s = iter.next();   // next iterator element\n  System.out.println(s);\n  if (s.equals("Hadi"))     // if "Hadi" is found\n    iter.remove();          // Remove from the list\n}')],
        explain: '<p>To remove every “Hadi”, walk once with an iterator and call <code>iter.remove()</code> when you find one. remove() deletes the element that next() just returned.</p><pre class="ex">Hadi Hadi Rakan … → Rakan Turki Ibrahim Omar Mostafa</pre><p>One walk: O(n). The iterator stays in the right place after each remove, so two Hadi in a row are both removed.</p><p class="watch">Call <code>iter.remove()</code>, not <code>list.remove(s)</code>: changing the list behind the iterator’s back makes it throw an exception.</p>' },
      14: { explain: '<ul><li>An iterator promises no order in general; for a list it follows the list order.</li><li>Do <b>not</b> change the collection’s structure while an iterator is in use.</li><li>Java’s iterators are <b>fail-fast</b>: they throw a <b>ConcurrentModificationException</b> if the list was changed (for example an element added) outside the iterator.</li></ul><pre class="ex">for (String s : list) list.add("Ali");   // exception</pre><p class="watch">“Concurrent” here does not need threads: one loop that changes its own list is enough.</p>' },
      15: outline(2, '<p>Next: an iterator for our own ArrayList.</p>'),
      16: { blocks: [bul('Our ArrayList class does not implement the Iterable interface and does not provide an iterator() method.'), bul('We cannot use the for-each loop to iterate over the elements.'), bul('To have this capability, our revised ArrayList implements the Iterable interface and the iterator() method.'), code('public class ArrayList<T> implements List<T>, Iterable<T> {\n  . . .\n  // Returns a new iterator object for the ArrayList class\n  public Iterator<T> iterator() {\n    return new ArrayListIterator();\n  }\n  . . .\n}')],
        explain: '<p>Our ArrayList from the last unit cannot be used in for-each. The fix:</p><pre class="ex">class ArrayList&lt;T&gt; implements List&lt;T&gt;, Iterable&lt;T&gt;\npublic Iterator&lt;T&gt; iterator() { return new ArrayListIterator(); }</pre><p>A class can implement <b>several</b> interfaces, separated by commas. Each call of iterator() gives a fresh iterator.</p>' },
      17: { blocks: [bul('To have an iterator object, our revised ArrayList class must have a class that implements the Iterator interface.'), bul('We will name this class ArrayListIterator. It is defined as an inner private class because it is used only by the iterator() method in the outer class ArrayList.'), code('public class ArrayList<T> implements List<T>, Iterable<T> {\n  . . .\n  private class ArrayListIterator implements Iterator<T> {\n    . . .\n  }\n}')],
        explain: '<p>iterator() needs a class that implements <b>Iterator&lt;T&gt;</b>: <b>ArrayListIterator</b>. It is written <b>inside</b> ArrayList as a private inner class:</p><pre class="ex">ArrayList (outer)\n└── private class ArrayListIterator (inner)</pre><p>Private, because only iterator() creates it; other code just sees an Iterator&lt;T&gt;.</p><p class="watch">Inner means no <code>static</code> keyword. Node was <code>private static</code>; the iterator is not static.</p>' },
      18: { text: false, explain: '<p>Nested <b>static</b> class vs <b>inner</b> class:</p><pre class="ex">static nested (Node)     inner (ArrayListIterator)\nonly static members      ALL members, even private\nneeds no outer object    needs an outer object</pre><p>An inner object keeps a hidden reference to its outer object (<code>ArrayList.this</code>), so the iterator can read <code>array</code> and <code>count</code> of its own list. Node does not need that, so it is static.</p><p class="watch">You cannot create an ArrayListIterator without an ArrayList object.</p>' },
      19: { blocks: [bul('The outer class ArrayList should count the modifications done on a list object by the add and remove methods.'), bul('modCount counts all the modifications done by the add and remove methods. It is checked by an iterator to ensure that no changes are done to a list while an iterator is used.'), code('public class ArrayList<T> implements List<T>, Iterable<T> {\n  private T[] array;      // array implementation of the list\n  private int count;      // count of elements in the list\n  private int modCount;   // modification counter\n  . . .\n}')],
        explain: '<p>A new field, <b>modCount</b>, counts every change (add or remove) to the list:</p><pre class="ex">3 adds, 1 remove → modCount = 4</pre><p>An iterator remembers modCount when it is created. If the number changes later, someone changed the list while the iterator was in use.</p><p class="watch">modCount is not the size: an add and then a remove leave count the same but add 2 to modCount.</p>' },
      20: { title: 'Revised add and remove methods', blocks: [code('public void add(T e) {\n  . . .              // statements\n  modCount++;        // count this add modification\n}\npublic void add(int index, T e) {\n  . . .              // statements\n  modCount++;        // count this add modification\n}\npublic T remove(int index) {\n  . . .              // statements\n  modCount++;        // count this remove modification\n  return element;    // return element at index\n}')],
        explain: '<p>Each method that changes the list adds one line at the end: <code>modCount++</code>. The rest of the body stays as before.</p><pre class="ex">add(e)      … modCount++;\nadd(i, e)   … modCount++;\nremove(i)   … modCount++;  return element;</pre><p class="watch">get, set, indexOf and contains do not change the structure, so they do not touch modCount.</p>' },
      21: { blocks: [bul('The ArrayListIterator class initializes its own itrCount to modCount in the outer ArrayList class.'), bul('If these two counts become different the iterator throws a ConcurrentModificationException.'), code('private class ArrayListIterator implements Iterator<T> {\n  int next = 0;              // Index of next element in iterator\n  int itrCount = modCount;   // Iterator count of modifications\n  boolean canRemove = false; // Allows remove to delete element\n  public boolean hasNext() { . . . }\n  public T next() { . . . }\n  public void remove() { . . . }\n}')],
        explain: '<p>The iterator has three fields:</p><pre class="ex">next      index of the next element to return\nitrCount  modCount when the iterator was made\ncanRemove may remove() be called now?</pre><p><code>int itrCount = modCount</code> reads the <b>outer</b> list’s field: possible only because it is an inner class.</p><p class="watch">If itrCount != modCount, the list was changed outside the iterator.</p>' },
      22: { title: 'The hasNext and next methods', blocks: [code(dedent(part(AI, '    // Returns true if this iterator has at least', '    // Removes the current element'), 4))], explain: '<p><b>hasNext</b> first checks the counts, then returns <code>next &lt; count</code>. <b>next</b> calls hasNext(), sets canRemove = true, and returns:</p><pre class="ex">return array[next++];   // use next, then add 1</pre><p>So with next = 2 it returns array[2] and next becomes 3.</p><p class="watch"><code>next++</code> is a post-increment: the old value is used as the index, not the new one.</p>' },
      23: { title: 'Implementing the remove method', blocks: [code(dedent(part(AI, '    // Removes the current element', '  }\n}'), 4))], explain: '<p>remove deletes the element next() returned last, which is at index next − 1:</p><pre class="ex">next--;\nArrayList.this.remove(next);   // the outer list’s remove\nitrCount++;  canRemove = false;</pre><p>The list’s remove does modCount++, so itrCount++ keeps both equal. canRemove = false: two removes in a row throw IllegalStateException.</p><p class="watch">The slide’s last line has no <code>;</code>: <code>canRemove = false</code> must end with a semicolon to compile.</p>' },
      24: outline(3, '<p>Last: an iterator for our own LinkedList.</p>'),
      25: { blocks: [bul('Our LinkedList class does not implement the Iterable interface and does not provide an iterator() method.'), bul('We cannot use the for-each loop to iterate over the elements.'), bul('To have this capability, our revised LinkedList implements the Iterable interface and the iterator() method.'), code(part(LI, 'public class LinkedList', '  private class') + '  . . .\n}')],
        explain: '<p>The same change for our LinkedList: implement <b>Iterable&lt;T&gt;</b> and add iterator():</p><pre class="ex">public Iterator&lt;T&gt; iterator() { return new LinkedListIterator(); }</pre><p>Then for-each works on it, and an iterator walks it in O(n) instead of using get(i) in a loop.</p>' },
      26: { title: 'Inner Linked List Iterator Class', blocks: [bul('The inner class LinkedListIterator implements the Iterator interface.'), code(dedent(part(LI, '  private class LinkedListIterator', '    // Returns true if this iterator has at least one more node'), 2) + '  . . .')],
        explain: '<p>Instead of an index, this iterator keeps a <b>node</b> reference:</p><pre class="ex">node      = front      (the next node to return)\nitrCount  = modCount\ncanRemove = false</pre><p>It is an inner class, so it can read <code>front</code>, <code>rear</code> and <code>modCount</code> of its list.</p><p class="watch">For an empty list, front is null, so node starts as null and hasNext() is false at once.</p>' },
      27: { title: 'The hasNext and next methods', blocks: [code(dedent(part(LI, '    // Returns true if this iterator has at least one more node', '    // Removes the previous node'), 4))], explain: '<p><b>hasNext</b>: check the counts, then <code>node != null</code>. <b>next</b>:</p><pre class="ex">T element = node.element;   // keep the element\ncanRemove = true;\nnode = node.next;           // move forward\nreturn element;</pre><p>After next(), the node whose element was returned is <b>behind</b> the iterator: it is <code>node.prev</code>.</p><p class="watch">The element must be saved before <code>node = node.next</code>; after that line node is a different node.</p>' },
      28: { title: 'Implementing the remove method', blocks: [code(dedent(part(LI, '    // Removes the previous node', '  }\n  // Helper'), 4))], explain: '<p>remove deletes the node that next() returned, which is the node <b>before</b> node:</p><pre class="ex">prev = (node == null) ? rear : node.prev;\nremoveNode(prev);</pre><p>If node is null, next() returned the last node, so the one to delete is the <b>rear</b>. Then itrCount++ and canRemove = false.</p><p class="watch">node itself does not move: it still points at the next element to visit.</p>' },
      29: { title: 'Implementing removeNode in LinkedList', blocks: [code(dedent(LI.slice(LI.indexOf('  // Helper method')).replace(/\n}$/, ''), 2))], explain: '<p>The same removeNode as in the Lists unit, with one extra line at the end:</p><pre class="ex">count--;\nmodCount++;   // Count this modification</pre><p>Every remove (by index, by value, or by the iterator) goes through removeNode, so modCount is always counted.</p><p class="watch">The iterator’s remove does itrCount++ right after, so the iterator itself does not fail.</p>' },
      30: { blocks: [bul('Removing the front node changes the front pointer to next.'), bul('Removing the rear node changes the rear pointer to prev.'), bul('Removing an internal node relinks the prev node to next node.'), bul('The removed node is unlinked and deleted by the garbage collector.')],
        explain: '<p>Three cases in removeNode:</p><pre class="ex">front node:    front = next\nrear node:     rear = prev\ninternal node: prev.next = next;  next.prev = prev</pre><p>The removed node’s own links are set to null. Nothing refers to it any more, so Java’s <b>garbage collector</b> frees its memory later.</p><p class="watch">Java has no delete: an object is freed only when no reference points to it.</p>' }
    },
    exam: {
      questions: [
        { q: 'Which statement about the two interfaces is right?',
          options: ['Iterator has iterator(); Iterable has hasNext() and next()', 'Both have the same three methods', 'Iterable has iterator(); Iterator has hasNext(), next() and remove()', 'Iterable has next(); Iterator has hasNext()'], answer: 2, review: 5,
          why: 'Iterable has only one method, iterator(), which returns an Iterator object (slide 5). That object has hasNext(), next() and remove() (slide 6). A collection is Iterable; the object that walks through it is the Iterator.',
          lessons: ['07-iterators'], skills: ['concept'], available_after: '07-iterators', level: 1 },
        { type: 'tf', q: 'A for-each loop gives no access to the remove() method of its iterator.', answer: true, review: 11,
          why: 'The for-each loop creates and uses an iterator internally, but it does not show it to you, so you cannot call its remove(). Use an Iterator object to remove while looping (slide 12).',
          lessons: ['07-iterators'], skills: ['concept'], available_after: '07-iterators', level: 1 },
        { type: 'output', q: 'What does this print?', review: 10,
          code: 'List<Integer> nums = new ArrayList<>();\nnums.add(4);\nnums.add(5);\nnums.add(6);\nIterator<Integer> it = nums.iterator();\nint sum = 0;\nwhile (it.hasNext())\n  sum += it.next();\nSystem.out.println(sum);',
          answer: '15',
          why: 'next() is called once per loop, so each element is added once: 4 + 5 + 6 = 15. hasNext() only checks; it does not move.',
          lessons: ['07-iterators'], skills: ['trace'], available_after: '07-iterators', level: 1 },
        { q: 'You must print a LinkedList of 100,000 elements. Which way is the right choice, and why?',
          options: ['Way-1 with get(i), because indexes are always fast, also on a linked list', 'All three ways cost O(n²), because each one visits every element n times', 'Way-1, because an iterator copies the whole list first and needs more memory', 'An iterator (or for-each), because each next() moves one link and the whole loop is O(n)'], answer: 3, review: 10,
          why: 'On a linked list each get(i) walks from an end to index i, so Way-1 costs O(n²). An iterator keeps its place, so it costs O(n) (slides 9-10). Iterators do not copy anything.',
          lessons: ['06-lists', '07-iterators', '02-analysis-of-algorithms'], skills: ['complexity', 'design'], available_after: '07-iterators', level: 2 },
        { type: 'output', q: 'What does this print?', review: 13,
          code: 'List<Integer> list = new LinkedList<>();\nlist.add(1);\nlist.add(4);\nlist.add(4);\nlist.add(9);\nlist.add(4);\nint removed = 0;\nIterator<Integer> it = list.iterator();\nwhile (it.hasNext()) {\n  int x = it.next();\n  if (x == 4) {\n    it.remove();\n    removed++;\n  }\n}\nSystem.out.println(removed + " " + list);',
          answer: '3 [1, 9]',
          why: 'Every 4 is returned once by next() and removed through the iterator, also the two 4s next to each other. So 3 are removed and [1, 9] remains.',
          lessons: ['07-iterators'], skills: ['trace'], available_after: '07-iterators', level: 2 },
        { q: 'A list holds "", "a", "b" (the first one is an empty string). Which loop throws a ConcurrentModificationException?',
          options: ['for (String s : list) System.out.println(s);', 'Iterator<String> it = list.iterator(); while (it.hasNext()) if (it.next().isEmpty()) it.remove();', 'for (String s : list) if (s.isEmpty()) list.remove(s);', 'for (int i = 0; i < list.size(); i++) System.out.println(list.get(i));'], answer: 2, review: 14,
          why: 'Only the second loop changes the list behind the back of an iterator: list.remove(s) runs inside the for-each loop, whose hidden iterator throws at its next step. The iterator\'s own remove() is allowed, and the other two loops only read.',
          lessons: ['07-iterators'], skills: ['bug', 'edge_case'], available_after: '07-iterators', level: 2 },
        { q: 'Which statement about ArrayListIterator is true?',
          options: ['It can read array, count and modCount of the list that created it, because it is an inner class', 'It is a nested static class, so it can be created without a list', 'It keeps its own copy of the array', 'It is a public class that users create with new'], answer: 0, review: 18,
          why: 'An inner class object belongs to an outer object and has access to all its members, also private ones (slide 18). The iterator reads the list\'s own array; it does not copy it. It is private and created only by iterator().',
          lessons: ['07-iterators'], skills: ['concept'], available_after: '07-iterators', level: 2 },
        { type: 'fill', q: 'Complete hasNext() and next() of ArrayListIterator (slide 22).', review: 22,
          code: 'public boolean hasNext() {\n  if (itrCount != ___)\n    throw new ConcurrentModificationException();\n  return (next < ___);\n}\npublic T next() {\n  if (!hasNext()) throw new NoSuchElementException();\n  canRemove = true;\n  return array[___];\n}',
          answer: ['modCount', 'count', 'next++'],
          why: 'hasNext() compares the iterator\'s count of changes with the list\'s modCount, then checks that next is still below count. next() reads array[next] and only then moves next forward: <code>next++</code>.',
          lessons: ['07-iterators'], skills: ['design'], available_after: '07-iterators', level: 2 },
        { type: 'trace', q: 'A revised ArrayList gets add(A), add(B), add(C). Then an iterator is created and used. Fill in the table.', review: 23,
          cols: ['call', 'returns', 'next', 'itrCount', 'modCount'],
          rows: [['iterator()', '-', '0', '3', '3'], ['next()', '?A', '?1', '?3', '?3'], ['remove()', '?-', '?0', '?4', '?4'], ['next()', '?B', '?1', '?4', '?4']],
          why: 'The three adds made modCount = 3, and the new iterator copies it. remove() does next-- and calls the list\'s remove, which does modCount++, and then itrCount++: both are 4. B has shifted to index 0, so the next call returns B.',
          lessons: ['07-iterators'], skills: ['trace'], available_after: '07-iterators', level: 2 },
        { type: 'bug', q: 'With this hasNext(), a LinkedListIterator never returns the last element (and crashes on an empty list). Tap the line with the mistake.', review: 27,
          code: 'public boolean hasNext() {\n  if (itrCount != modCount)\n    throw new ConcurrentModificationException();\n  return (node.next != null);\n}',
          answer: 4,
          why: 'node points to the element that next() will return. It must be tested itself: <code>return (node != null);</code>. Testing node.next stops one element early, and when node is null (empty list) node.next throws.',
          lessons: ['07-iterators'], skills: ['bug', 'edge_case'], available_after: '07-iterators', level: 2 },
        { type: 'write', q: '`nums` is a `List<Integer>`. Write a loop with an Iterator that removes every negative number from it.', review: 13,
          rows: 6, starter: '',
          checks: [{ re: /Iterator\s*<\s*Integer\s*>\s+(\w+)\s*=\s*nums\.iterator\s*\(\s*\)\s*;/, label: '<code>Iterator&lt;Integer&gt; it = nums.iterator();</code>' },
            { re: /while\s*\(\s*\w+\.hasNext\s*\(\s*\)\s*\)/, label: 'Loops while hasNext()' },
            { re: /\w+\.next\s*\(\s*\)\s*<\s*0|(\w+)\s*=\s*\w+\.next\s*\(\s*\)[\s\S]*\1\s*<\s*0/, label: 'Checks whether next() is negative' },
            { re: /\w+\.remove\s*\(\s*\)\s*;/, label: 'Calls the iterator\'s remove()' },
            { fn: function (c) { return !/nums\.remove/.test(c); }, label: 'Does not call nums.remove' }],
          solution: 'Iterator<Integer> it = nums.iterator();\nwhile (it.hasNext()) {\n  if (it.next() < 0)\n    it.remove();\n}',
          why: 'next() is called exactly once per loop, and remove() deletes that element. Calling nums.remove inside the loop would throw a ConcurrentModificationException, and a second next() in the same loop would skip elements.',
          lessons: ['07-iterators'], skills: ['design'], available_after: '07-iterators', level: 2 },
        { q: 'A LinkedList holds one node, X. An iterator calls next() and then remove(). What does hasNext() return now, and what are front and rear?',
          options: ['true; front = rear = X', 'false; front = rear = null', 'false; front = X, rear = null', 'It throws, because remove() cannot delete the only node'], answer: 1, review: 28,
          why: 'After next() node is null, so remove() deletes rear = X. removeNode sees that X is both the front and the rear: front = next = null and rear = prev = null. node is still null, so hasNext() is false.',
          lessons: ['07-iterators'], skills: ['edge_case', 'trace'], available_after: '07-iterators', level: 3 },
        { q: 'An ArrayListIterator goes over A, B, C, D and calls next(), next(), remove(), next(), remove(), next(). What does the last next() return, and what is the list?',
          options: ['D; list A, D', 'C; list A, C, D', 'D; list A, B, D', 'B; list B, D'], answer: 0, review: 23,
          why: 'The first remove() deletes B (next goes back to 1): A, C, D. next() returns C (next = 2). The second remove() deletes C (next back to 1): A, D. The last next() returns array[1] = D.',
          lessons: ['07-iterators'], skills: ['trace'], available_after: '07-iterators', level: 3 },
        { q: 'What happens?', review: 14,
          code: 'Queue<String> q = new LinkedList<>();\nq.add("A");\nq.add("B");\nq.add("C");\nIterator<String> it = q.iterator();\nwhile (it.hasNext()) {\n  String e = it.next();\n  it.remove();\n  q.add(e.toLowerCase());\n}\nSystem.out.println(q);',
          options: ['It prints [a, b, c]', 'A ConcurrentModificationException is thrown', 'The loop never ends', 'It prints [A, B, C, a, b, c]'], answer: 1,
          why: 'it.remove() is allowed, but <code>q.add(...)</code> changes the queue behind the iterator\'s back. At the next step the fail-fast iterator notices it and throws. Adding to a collection while iterating over it is not allowed (slide 14).',
          lessons: ['05-queues', '07-iterators'], skills: ['trace', 'edge_case'], available_after: '07-iterators', level: 3 }
      ],
      tasks: [
        {
          title: 'Removing with an Iterator',
          task: '<p>Write a program that creates a <code>List&lt;String&gt;</code> as a <code>LinkedList</code> with "Huda", "Ali", "Huda", "Sami", "Huda". Use an <code>Iterator</code> to remove every "Huda" and count how many were removed. Then print <code>Removed 3</code> and, on the next line, the list.</p>',
          starter: 'import java.util.*;\n\npublic class RemoveHuda {\n  public static void main(String[] args) {\n    \n  }\n}',
          output: 'Removed 3\n[Ali, Sami]',
          checks: [
            { re: /List\s*<\s*String\s*>\s+(\w+)\s*=\s*new\s+LinkedList\s*<\s*(String\s*)?>\s*\(\s*\)/, label: 'A <code>List&lt;String&gt;</code> with a new LinkedList', review: 8 },
            { re: /Iterator\s*<\s*String\s*>\s+(\w+)\s*=\s*\w+\.iterator\s*\(\s*\)\s*;/, label: 'Gets an <code>Iterator&lt;String&gt;</code> from the list', review: 10 },
            { re: /while\s*\(\s*\w+\.hasNext\s*\(\s*\)\s*\)/, label: 'Loops while hasNext()', review: 10 },
            { re: /"Huda"\.equals\s*\(|\.equals\s*\(\s*"Huda"\s*\)/, label: 'Compares with equals("Huda")', review: 13 },
            { re: /\w+\.remove\s*\(\s*\)\s*;/, label: 'Removes with the iterator\'s remove()', review: 13 },
            { re: /System\.out\.println\s*\(\s*"Removed "\s*\+\s*\w+\s*\)\s*;/, label: 'Prints <code>"Removed " + count</code>', review: 13 }
          ],
          solution: 'import java.util.*;\n\npublic class RemoveHuda {\n  public static void main(String[] args) {\n    List<String> list = new LinkedList<>();\n    list.add("Huda");\n    list.add("Ali");\n    list.add("Huda");\n    list.add("Sami");\n    list.add("Huda");\n    int count = 0;\n    Iterator<String> it = list.iterator();\n    while (it.hasNext()) {\n      if (it.next().equals("Huda")) {\n        it.remove();\n        count++;\n      }\n    }\n    System.out.println("Removed " + count);\n    System.out.println(list);\n  }\n}'
        },
        {
          title: 'hasNext and next of LinkedListIterator',
          task: '<p>Write <code>hasNext()</code> and <code>next()</code> for the slides\' <code>LinkedListIterator</code> (fields <code>node</code>, <code>itrCount</code>, <code>canRemove</code>; the list has <code>modCount</code>). hasNext() throws a <code>ConcurrentModificationException</code> when itrCount differs from modCount, and returns whether a node is left. next() throws a <code>NoSuchElementException</code> when nothing is left; otherwise it saves the element, allows remove, moves to the next node and returns the element.</p>',
          starter: 'public boolean hasNext() {\n  \n}\n\npublic T next() {\n  \n}',
          checks: [
            { re: /if\s*\(\s*itrCount\s*!=\s*modCount\s*\)\s*throw\s+new\s+ConcurrentModificationException\s*\(\s*\)\s*;/, label: 'Throws when <code>itrCount != modCount</code>', review: 27 },
            { re: /return\s*\(?\s*node\s*!=\s*null\s*\)?\s*;/, label: '<code>return (node != null);</code>', review: 27 },
            { re: /if\s*\(\s*!\s*hasNext\s*\(\s*\)\s*\)\s*throw\s+new\s+NoSuchElementException\s*\(\s*\)\s*;/, label: 'Throws NoSuchElementException when nothing is left', review: 27 },
            { re: /T\s+(\w+)\s*=\s*node\.element\s*;[\s\S]*node\s*=\s*node\.next\s*;[\s\S]*return\s+\1\s*;/, label: 'Saves node.element, moves to node.next, returns the saved element', review: 27 },
            { re: /canRemove\s*=\s*true\s*;/, label: '<code>canRemove = true;</code>', review: 27 }
          ],
          solution: 'public boolean hasNext() {\n  if (itrCount != modCount)\n    throw new ConcurrentModificationException();\n  return (node != null);\n}\n\npublic T next() {\n  if (!hasNext()) throw new NoSuchElementException();\n  T element = node.element;\n  canRemove = true;\n  node = node.next;\n  return element;\n}'
        }
      ]
    }
  });
})();
