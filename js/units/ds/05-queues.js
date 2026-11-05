/* Data Structures · Unit 5 Queues (46 slides): FIFO, queue operations and the Java Queue interface, encoding with a
   repeating key (Codes), LinkedQueue<T> with front and rear, the ticket counter simulation, the circular ArrayQueue<T>
   with wrap-around and expandCapacity, and the double-ended queue (deque) on a circular array */
(function () {
  function L(src, frag, nth) { var ls = src.split('\n'), c = 0; for (var i = 0; i < ls.length; i++) if (ls[i].indexOf(frag) >= 0 && ++c === (nth || 1)) return i + 1; throw new Error('no line ' + frag); }
  function h(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function toks(s, max) { return String(s).trim().split(/[\s,]+/).filter(Boolean).slice(0, max || 10); }
  function isInt(t) { return /^-?\d{1,4}$/.test(t); }
  /* a row of linked nodes (as in unit 4) */
  function chain(list, o) {
    var out = [], w = o.w, st = o.step;
    list.forEach(function (n, i) {
      var x = o.x0 + i * st;
      out.push(B(n.id, x, o.y, w, 40, { title: n.t, mono: true, size: w < 56 ? 11 : 13, tone: n.tone || 'blue', fill: n.hi ? 'solid' : 'soft', hi: n.hi, o: n.o, from: n.from }));
      if (n.cut) out.push(T(n.id + 'x', x + w + (st - w) / 2, o.y + 26, '✕', { anchor: 'middle', size: 16, bold: true, tone: 'red' }));
      else if (i < list.length - 1) out.push(A(n.id + 'a', x + w, o.y + 20, x + st, o.y + 20, { tone: 'muted' }));
    });
    if (list.length && !list[list.length - 1].cut) {
      var lx = o.x0 + (list.length - 1) * st + w;
      out.push(A('nullA', lx, o.y + 20, lx + 16, o.y + 20, { head: false, tone: 'muted' }));
      out.push(B('nullB', lx + 16, o.y + 15, 10, 10, { tone: 'blue', fill: 'solid', r: 1 }));
    }
    return out;
  }
  /* a circular array drawn as a ring. arr: cells (null or {id, t}); o: { front, rear, cx, cy, R, hi (index), showPtr } */
  function ring(arr, o) {
    var out = [], cap = arr.length, R = o.R || 118, cx = o.cx || 165, cy = o.cy || 172, w = Math.min(48, Math.floor(0.82 * 2 * Math.PI * R / cap)), hh = 30;
    var at = function (i, r) { var a = -Math.PI / 2 + 2 * Math.PI * i / cap; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
    arr.forEach(function (e, i) {
      var p = at(i, R), hot = i === o.hi;
      out.push(B('cell' + i, p[0] - w / 2, p[1] - hh / 2, w, hh, { tone: hot ? 'accent' : 'muted', dash: !e, r: 4 }));
      if (e) out.push(B(e.id, p[0] - w / 2 + 3, p[1] - hh / 2 + 3, w - 6, hh - 6, { title: e.t, mono: true, size: w < 36 ? 10 : 12, tone: hot ? 'accent' : 'blue', fill: hot ? 'solid' : 'soft', hi: hot, z: 2, from: e.from }));
      var q = at(i, R - 30);
      out.push(T('ix' + i, q[0], q[1] + 4, String(i), { anchor: 'middle', mono: true, size: 10, tone: 'muted' }));
    });
    if (o.showPtr !== false) {
      /* same cell: one label above the other; many cells: rear further inside, so the two labels never touch */
      var same = o.front === o.rear, f = at(o.front, R - 58), r = at(o.rear, same ? R - 58 : cap > 8 ? R - 86 : R - 58);
      out.push(T('pf', f[0], f[1] + (same ? -3 : 4), 'front', { anchor: 'middle', mono: true, size: 11, bold: true, tone: 'accent' }));
      out.push(T('pr', r[0], r[1] + (same ? 11 : 4), 'rear', { anchor: 'middle', mono: true, size: 11, bold: true, tone: 'teal' }));
    }
    return out;
  }
  var EMPTYQ = 'Exception in thread "main" java.lang.RuntimeException: Queue is empty';

  /* ---------- 1. the conceptual queue and Java's Queue interface (slides 3-7) ---------- */
  function qrun(v) {
    var tk = toks(v.ops), code = ['import java.util.*;', ''], ops = [];
    var allInt = tk.every(function (t) { return /^(-|\?|poll|peek|remove|element)$/.test(t) || isInt(t); });
    code.push('Queue<' + (allInt ? 'Integer' : 'String') + '> queue = new LinkedList<>();');
    tk.forEach(function (t) {
      var o = /^(-|remove)$/.test(t) ? { k: 'remove' } : /^(\?|peek)$/.test(t) ? { k: 'peek' } : t === 'poll' ? { k: 'poll' } : t === 'element' ? { k: 'element' } : { k: 'add', x: t.slice(0, 5) };
      o.line = code.length + 1;
      code.push(o.k === 'add' ? 'queue.add(' + (allInt ? o.x : '"' + o.x + '"') + ');' : 'System.out.println(queue.' + o.k + '());');
      ops.push(o);
    });
    return { code: code.join('\n'), ops: ops };
  }
  var queueops = {
    id: 'queueops', slides: [3, 7], title: 'In at the rear, out at the front',
    code: function (v) { return qrun(v).code; },
    inputs: [{ id: 'ops', type: 'text', label: 'operations', value: 'Ali Sara Omar - ? Huda -', maxlen: 40 }],
    inputsLabel: 'Values to add, <code>-</code> remove, <code>?</code> peek, or the words <code>poll</code> and <code>element</code>.',
    presets: [{ label: 'a waiting line', values: { ops: 'Ali Sara Omar - ? Huda -' } }, { label: 'remove until empty', values: { ops: '5 7 - - -' } }, { label: 'poll and peek on empty', values: { ops: '5 - poll peek element' } }],
    steps: function (v) {
      var R = qrun(v), st = [], q = [], n = 0;
      var snap = function (o) { o.q = q.slice(); return o; };
      st.push(snap({ slide: 3, line: 3, ph: 'line', cap: 'A <b>queue</b> is <b>first in, first out</b> (FIFO): like a line at a bank. People join at the <b>rear</b> and are served at the <b>front</b>.' }));
      st.push(snap({ slide: 4, line: 3, cap: 'The operations: <b>enqueue</b> adds at the rear, <b>dequeue</b> removes from the front, <b>first</b> looks at the front without removing.' }));
      st.push(snap({ slide: 6, line: 3, cap: 'In Java, <b>Queue</b> is an interface, and the class <b>LinkedList</b> implements it. Java names the operations differently: add / offer, remove / poll, element / peek.' }));
      for (var i = 0; i < R.ops.length; i++) {
        var o = R.ops[i], s = { slide: 4, line: o.line };
        if (o.k === 'add') { q.push({ id: 'q' + n++, t: o.x }); s.fresh = true; s.cap = '<b>add(' + h(o.x) + ')</b> (enqueue): ' + h(o.x) + ' joins at the <b>rear</b>.'; }
        else if (!q.length) {
          s.slide = 7;
          if (o.k === 'poll' || o.k === 'peek') { s.cap = '<b>' + o.k + '()</b> on an empty queue returns <b>null</b>: no exception.'; s.out = 'null'; }
          else { s.cap = '<b>' + o.k + '()</b> on an empty queue <b>throws an exception</b> and the program stops. (poll or peek would return null instead.)'; s.out = 'Exception in thread "main" java.util.NoSuchElementException'; s.err = true; st.push(snap(s)); break; }
        } else if (o.k === 'remove' || o.k === 'poll') { var e = q.shift(); s.res = e; s.resLb = o.k + '() returned'; s.slide = o.k === 'poll' ? 7 : 4; s.cap = '<b>' + o.k + '()</b> (dequeue): the <b>front</b> element, ' + h(e.t) + ', leaves. Everyone else moves one place closer to the front.'; s.out = e.t; }
        else { s.peek = true; s.slide = o.k === 'element' ? 7 : 4; s.cap = '<b>' + o.k + '()</b> (first): returns the front element, ' + h(q[0].t) + ', without removing it.'; s.out = q[0].t; }
        st.push(snap(s));
      }
      if (!st[st.length - 1].err) st.push(snap({ slide: 7, line: 3, cap: 'The first one in is always the first one out: <b>FIFO</b>. ' + (q.length ? 'Front now: ' + h(q[0].t) + ', rear: ' + h(q[q.length - 1].t) + '.' : 'The queue is empty.') }));
      return st;
    },
    draw: function (k, s) {
      var items = [], n = s.q.length, cw = Math.min(80, Math.floor(400 / Math.max(n, 1))), x0 = 80, y = 140;
      items.push(T('fl', 37, y + 8, 'front', { anchor: 'middle', size: 13, bold: true, tone: 'accent' }));
      items.push(A('out', 60, y + 22, 14, y + 22, { tone: 'accent' }));
      items.push(T('rl', 524, y + 8, 'rear', { anchor: 'middle', size: 13, bold: true, tone: 'teal' }));
      items.push(A('in', 548, y + 22, 500, y + 22, { tone: 'teal' }));
      items.push(A('w1', x0 - 4, y - 8, 486, y - 8, { head: false, tone: 'muted' }));
      items.push(A('w2', x0 - 4, y + 52, 486, y + 52, { head: false, tone: 'muted' }));
      s.q.forEach(function (e, i) {
        var hot = (i === 0 && s.peek) || (i === n - 1 && s.fresh);
        items.push(B(e.id, x0 + i * cw, y, cw - 6, 44, { title: e.t, mono: true, size: cw < 56 ? 11 : 14, tone: hot ? 'accent' : 'blue', fill: hot ? 'solid' : 'soft', hi: hot, from: i === n - 1 && s.fresh ? [560, y] : undefined }));
      });
      if (s.res) items.push(B(s.res.id, 20, 250, 110, 40, { title: s.res.t, mono: true, size: 15, tone: 'accent', fill: 'solid', hi: true, tag: s.resLb }));
      if (s.err) items.push(T('er', 280, 270, 'the queue is empty!', { anchor: 'middle', size: 17, bold: true, tone: 'red' }));
      if (s.ph === 'line') items.push(T('bank', 280, 60, 'a line at a bank: join at the rear, leave at the front', { anchor: 'middle', size: 13, tone: 'muted' }));
      items.push(T('sz', 400, 300, 'size() = ' + n, { mono: true, size: 14, bold: true }));
      return items;
    }
  };

  /* ---------- 2. encoding with a repeating key (slides 9-14) ---------- */
  var CC = '// key values, for example {3, 2, -3, 4, -1, -2, 1}\nint[] key = {…};\n// A queue of integer key values for encoding the message\nQueue<Integer> encodingQueue = new LinkedList<>();\n// Add the key values in encodingQueue\nfor (int k : key) encodingQueue.add(k);\nStringBuilder encoded = new StringBuilder();\n// Encode the message using the key values stored in encodingQueue\nfor (int i = 0; i < message.length(); i++) {\n  int keyValue = encodingQueue.remove();\n  encoded.append((char) (message.charAt(i) + keyValue));\n  encodingQueue.add(keyValue);\n}\nSystem.out.println ("Encoded Message:\\n" + encoded + "\\n");\n// Decode: the same key values, and subtract them\nfor (int i = 0; i < encoded.length(); i++) {\n  int keyValue = decodingQueue.remove();\n  decoded.append((char) (encoded.charAt(i) - keyValue));\n  decodingQueue.add(keyValue);\n}';
  function keys(s) { var k = toks(s, 8).filter(isInt).map(Number).map(function (x) { return Math.max(-9, Math.min(9, x)); }); return k.length ? k : [3]; }
  function show(c) { return c >= 33 && c <= 126 ? String.fromCharCode(c) : c === 32 ? '␣' : '#' + c; }
  var codes = {
    id: 'codes', slides: [9, 14], title: 'The key values go around a queue',
    code: function (v) { return CC.replace('{…}', '{' + keys(v.k).join(', ') + '}'); },
    inputs: [{ id: 'msg', type: 'text', label: 'message', value: 'knowledge', minlen: 1, maxlen: 16 }, { id: 'k', type: 'text', label: 'key values', value: '3 1 7 4 2 5', minlen: 1, maxlen: 24 }],
    presets: [{ label: 'slide 10: knowledge', values: { msg: 'knowledge', k: '3 1 7 4 2 5' } }, { label: 'Caesar k = 3', values: { msg: 'simplicity', k: '3' } }, { label: 'xyz with k = 3', values: { msg: 'xyz', k: '3' } }, { label: 'slide 11 key', values: { msg: 'This message', k: '3 2 -3 4 -1 -2 1' } }],
    steps: function (v) {
      var msg = String(v.msg).slice(0, 16), K = keys(v.k), st = [], q = K.map(function (x, i) { return { id: 'k' + i, t: String(x), v: x }; }), enc = [];
      var snap = function (o) { o.q = q.slice(); o.enc = enc.slice(); return o; };
      st.push(snap({ slide: 9, line: 2, i: -1, cap: 'A <b>Caesar cipher</b> shifts every letter by the same amount k: with k = 3, a → d, b → e. It is easy to break: there are only 26 possible shifts.' }));
      st.push(snap({ slide: 10, line: 2, i: -1, cap: 'Better: a <b>repeating key</b>. The 1st character is shifted by the 1st key value, the 2nd by the 2nd, and so on. When the keys run out, they <b>repeat</b>.' }));
      st.push(snap({ slide: 11, line: '4-6', i: -1, cap: 'The program puts the key values in a <b>queue</b>: ' + K.join(', ') + '. The front of the queue is the key for the next character.' }));
      for (var i = 0; i < msg.length; i++) {
        var kv = q.shift(), c = msg.charCodeAt(i), e = c + kv.v;
        enc.push({ id: 'c' + i, t: show(e) });
        st.push(snap({ slide: 12, line: '10-11', i: i, cur: kv, cap: '“' + h(show(c)) + '” (' + c + ') + ' + kv.v + ' = ' + e + ' → “' + h(show(e)) + '”. The key ' + kv.v + ' was <b>removed</b> from the front' + (i === msg.length - 1 ? '.' : '…') + (msg.charAt(i) === 'w' && kv.v === 4 && K[0] === 3 ? ' (Slide 10 shows “a” here: it wraps around the alphabet. The program does not, so it gives “{”.)' : '') }));
        q.push(kv);
        st.push(snap({ slide: 12, line: 12, i: i, moved: kv, cap: '…and <b>added</b> back at the rear, so it will be used again after the other ' + (K.length - 1) + ' key' + (K.length === 2 ? '' : 's') + '.' }));
        if (i >= 5 && msg.length > 8) { /* keep long messages short: the rest goes faster */
          for (i = i + 1; i < msg.length; i++) { kv = q.shift(); enc.push({ id: 'c' + i, t: show(msg.charCodeAt(i) + kv.v) }); q.push(kv); }
          st.push(snap({ slide: 12, line: '9-13', i: msg.length - 1, cap: 'The loop does the same for the rest of the message: remove a key from the front, shift, add the key back at the rear.' }));
          break;
        }
      }
      var encS = enc.map(function (x) { return x.t; }).join('');
      st.push(snap({ slide: 12, line: 14, i: -2, cap: 'The encoded message. Only someone who knows the key values can read it.', out: 'Encoded Message: ' + encS }));
      st.push(snap({ slide: 13, line: '16-20', i: -2, dec: true, cap: 'To decode, a second queue with the <b>same</b> key values goes around the same way, and each key is <b>subtracted</b>. We get the message back.', out: 'Decoded Message: ' + msg }));
      st.push(snap({ slide: 14, line: 4, i: -2, uml: true, cap: 'In the UML diagram, the generic T is <b>bound</b> to Integer twice: Queue&lt;Integer&gt; (the interface) and LinkedList&lt;Integer&gt; (the class that implements it).' }));
      return st;
    },
    draw: function (k, s, v) {
      var items = [], msg = String(v.msg).slice(0, 16), n = msg.length, cw = Math.min(34, Math.floor(520 / Math.max(n, 1))), x0 = 280 - n * cw / 2;
      if (s.uml) {
        items.push(B('u1', 300, 60, 220, 60, { title: 'Queue<Integer>', mono: true, size: 14, tone: 'blue', tag: '<<interface>>' }));
        items.push(B('u2', 40, 180, 230, 60, { title: 'LinkedList<Integer>', mono: true, size: 14, tone: 'teal', tag: 'class' }));
        items.push(B('u3', 300, 180, 220, 60, { title: 'Codes', mono: true, size: 14, tone: 'accent' }));
        items.push(A('ua', 160, 180, 360, 120, { dash: true, tone: 'muted', label: 'implements' }));
        items.push(A('ub', 410, 180, 410, 120, { dash: true, tone: 'accent', label: 'uses', la: 'start', lx: 8 }));
        items.push(T('ut', 280, 300, 'T is bound to Integer', { anchor: 'middle', size: 14, bold: true, tone: 'accent' }));
        return items;
      }
      items.push(T('ml', x0 - 6, 52, 'message', { anchor: 'end', size: 11, tone: 'muted' }));
      for (var i = 0; i < n; i++) {
        var cur = i === s.i;
        items.push(B('m' + i, x0 + i * cw, 30, cw - 3, 34, { title: show(msg.charCodeAt(i)), mono: true, size: 13, tone: cur ? 'accent' : 'blue', fill: cur ? 'solid' : 'soft', hi: cur }));
      }
      if (s.enc.length) items.push(T('el', x0 - 6, 122, s.dec ? 'decoded' : 'encoded', { anchor: 'end', size: 11, tone: 'muted' }));
      s.enc.forEach(function (e, i) { items.push(B(e.id, x0 + i * cw, 100, cw - 3, 34, { title: s.dec ? show(msg.charCodeAt(i)) : e.t, mono: true, size: 13, tone: s.dec ? 'teal' : i === s.i ? 'accent' : 'teal', fill: i === s.i ? 'solid' : 'soft', from: i === s.i && s.cur ? [x0 + i * cw, 30] : undefined })); });
      var kq = s.q, kw = Math.min(56, Math.floor(360 / Math.max(kq.length + 1, 1))), kx = 110, ky = 240;
      items.push(T('kl', 280, 206, 'key queue', { anchor: 'middle', size: 13, bold: true }));
      items.push(T('kf', kx - 10, ky + 24, 'front', { anchor: 'end', size: 11, bold: true, tone: 'accent' }));
      kq.forEach(function (e, j) { var hot = s.moved === e; items.push(B(e.id, kx + j * kw, ky, kw - 4, 36, { title: e.t, mono: true, size: 13, tone: hot ? 'teal' : 'blue', fill: hot ? 'solid' : 'soft', hi: hot })); });
      items.push(T('kr', kx + kq.length * kw + 6, ky + 24, 'rear', { size: 11, bold: true, tone: 'teal' }));
      if (s.cur) {
        items.push(B(s.cur.id, 20, 150, 60, 36, { title: (s.cur.v > 0 ? '+' : '') + s.cur.v, mono: true, size: 14, tone: 'accent', fill: 'solid', hi: true, tag: 'removed' }));
        if (s.i >= 0 && s.i < n) items.push(A('ka', 80, 168, x0 + s.i * cw + cw / 2, 136, { tone: 'accent' }));
      }
      return items;
    }
  };

  /* ---------- 3. LinkedQueue<T> (slides 16-23) ---------- */
  var LQ = 'package myqueue;\n// The LinkedQueue<T> class is a linked implementation of Queue<T>.\npublic class LinkedQueue<T> implements Queue<T> {\n  private Node<T> front;   // reference to front node\n  private Node<T> rear;    // reference to rear node\n  private int count;       // count of elements in the queue\n\n  // Constructor of an empty LinkedQueue object.\n  public LinkedQueue() {\n    front = rear = null;\n    count = 0;\n  }\n\n  private static class Node<T> {   // Generic linked list node\n    Node<T> next;                  // Pointer to next node\n    T element;                     // Reference to an element\n    Node(T elem) {                 // Constructor of a new node\n      next = null;\n      element = elem;              // References elem of type T\n    }\n  }\n\n  // Add an element of type T to the tail of this queue.\n  public void enqueue(T element) {\n    // Create a new node for an element of type T\n    Node<T> node = new Node<T>(element);\n    if (count==0) front = node;  // If empty queue, insert a front node.\n    else rear.next = node;       // Otherwise, insert after rear node.\n    rear = node;                 // rear now points to the inserted node.\n    count++;                     // Count the newly inserted node.\n  }\n\n  // Remove the head node of this queue and return its element\n  // If queue is empty, then throw RuntimeException\n  public T dequeue() throws RuntimeException {\n    if (count == 0) throw new RuntimeException("Queue is empty\\n");\n    T element = front.element;   // Reference to front element\n    Node<T> next = front.next;   // Reference to next node\n    front.next = null;           // Disconnect front node from list\n    front = next;                // front now references next node\n    count--;                     // Decrement the count of elements\n    if (count == 0) rear = null; // If queue becomes empty\n    return element;              // Reference to removed element\n  }\n\n  // returns a reference to the first element without removing it.\n  public T first() {\n    // return null if this queue is empty\n    if (isEmpty()) return null;\n    return front.element;\n  }\n\n  // return true if this queue is empty\n  public boolean isEmpty() {\n    return (count==0);\n  }\n\n  // return the count of elements in this queue\n  public int size() {\n    return count;\n  }\n}';
  function lrun(v) {
    var tk = toks(v.ops, 9), code = LQ.split('\n'), ops = [];
    code.push('', '// in main:', 'Queue<String> q = new LinkedQueue<>();');
    tk.forEach(function (t) {
      var o = /^(-|dequeue)$/.test(t) ? { k: 'dequeue' } : /^(\?|first)$/.test(t) ? { k: 'first' } : { k: 'enqueue', x: t.slice(0, 5) };
      o.line = code.length + 1;
      code.push(o.k === 'enqueue' ? 'q.enqueue("' + o.x + '");' : 'System.out.println(q.' + o.k + '());');
      ops.push(o);
    });
    return { code: code.join('\n'), ops: ops };
  }
  var linkedqueue = {
    id: 'linkedqueue', slides: [16, 23], title: 'LinkedQueue: two references, front and rear',
    code: function (v) { return lrun(v).code; },
    inputs: [{ id: 'ops', type: 'text', label: 'operations', value: 'A B C - D ? -', maxlen: 40 }],
    inputsLabel: 'Values to enqueue, <code>-</code> dequeue, <code>?</code> first.',
    presets: [{ label: 'enqueue and dequeue', values: { ops: 'A B C - D ? -' } }, { label: 'until empty', values: { ops: 'A B - - ?' } }, { label: 'dequeue an empty queue', values: { ops: 'A - -' } }],
    steps: function (v) {
      var R = lrun(v), st = [], list = [], n = 0, decl = R.code.split('\n').length - R.ops.length;
      var snap = function (o) { o.list = list.slice(); return o; };
      st.push(snap({ slide: 16, line: 3, ph: 'iface', cap: 'Our own generic interface <b>Queue&lt;T&gt;</b> has enqueue, dequeue, first, isEmpty, size and toString. It can have several implementations: with linked nodes, or with an array.' }));
      st.push(snap({ slide: 18, line: '4-6', ph: 'idea', cap: 'A linked queue needs <b>two</b> references: <b>front</b> (to dequeue) and <b>rear</b> (to enqueue), plus a count. A stack needed only top, because it works at one end.' }));
      st.push(snap({ slide: 19, line: decl + ',9-12', cap: 'new LinkedQueue&lt;&gt;(): front = rear = null and count = 0.' }));
      for (var i = 0; i < R.ops.length; i++) {
        var o = R.ops[i];
        if (o.k === 'enqueue') {
          var nd = { id: 'n' + n++, t: o.x }, was = list.length;
          st.push(snap({ slide: 21, line: o.line + ',' + L(LQ, 'Node<T> node = new Node<T>') + ',' + L(LQ, was ? 'else rear.next = node' : 'if (count==0) front = node'), nw: nd, linkFrom: was, cap: '<b>enqueue("' + h(o.x) + '")</b>: create a node. ' + (was ? '<code>rear.next = node</code>: link it after the old rear ("' + h(list[list.length - 1].t) + '").' : 'The queue is empty, so <code>front = node</code>.') }));
          list.push(nd);
          st.push(snap({ slide: 21, line: o.line + ',' + L(LQ, 'rear = node;') + '-' + L(LQ, 'count++;'), fresh: true, cap: '<code>rear = node</code> and count++ → ' + list.length + '. O(1): no walking through the list.' }));
        } else if (!list.length) {
          if (o.k === 'first') st.push(snap({ slide: 23, line: o.line + ',' + L(LQ, 'if (isEmpty()) return null'), cap: '<b>first()</b> on an empty queue returns <b>null</b>.', out: 'null' }));
          else { st.push(snap({ slide: 22, line: o.line + ',' + L(LQ, 'throw new RuntimeException'), err: true, cap: '<b>dequeue()</b> on an empty queue throws a <b>RuntimeException</b>.', out: EMPTYQ })); break; }
        } else if (o.k === 'first') {
          st.push(snap({ slide: 23, line: o.line + ',' + L(LQ, 'return front.element'), peek: true, cap: '<b>first()</b> returns front.element = "' + h(list[0].t) + '". Nothing changes.', out: list[0].t }));
        } else {
          var fr = list[0];
          st.push(snap({ slide: 22, line: o.line + ',' + L(LQ, 'T element = front.element') + '-' + L(LQ, 'front.next = null;'), cut: true, cap: '<b>dequeue()</b>: keep the element ("' + h(fr.t) + '") and <code>next = front.next</code>, then disconnect the front node.' }));
          list.shift();
          st.push(snap({ slide: 22, line: o.line + ',' + L(LQ, 'front = next;') + '-' + L(LQ, 'return element;'), gone: fr, cap: '<code>front = next</code>, count-- → ' + list.length + '.' + (list.length ? '' : ' The queue is now empty, so <b>rear = null</b> too: otherwise rear would still point to the removed node.'), out: fr.t }));
        }
      }
      if (!st[st.length - 1].err) st.push(snap({ slide: 23, line: L(LQ, 'return (count==0)'), cap: 'isEmpty() is ' + !list.length + ', size() is ' + list.length + '. enqueue and dequeue are both <b>O(1)</b>.' }));
      return st;
    },
    draw: function (k, s) {
      var items = [], y = 140;
      if (s.ph === 'iface') {
        items.push(CLS('qi', 40, 40, 240, { name: 'Queue<T>', methods: ['enqueue(T element) : void', 'dequeue() : T', 'first() : T', 'isEmpty() : boolean', 'size() : int', 'toString() : String'], tone: 'blue' }));
        items.push(B('l1', 330, 60, 200, 44, { title: 'LinkedQueue<T>', mono: true, size: 13, tone: 'accent', fill: 'solid', hi: true, tag: 'linked nodes' }));
        items.push(B('l2', 330, 180, 200, 44, { title: 'ArrayQueue<T>', mono: true, size: 13, tone: 'muted', tag: 'a circular array' }));
        items.push(A('la1', 330, 82, 280, 100, { dash: true, tone: 'accent' }));
        items.push(A('la2', 330, 202, 280, 160, { dash: true, tone: 'muted' }));
        return items;
      }
      var list = s.list.map(function (nd, i) { var last = i === s.list.length - 1; return { id: nd.id, t: nd.t, tone: (s.fresh && last) || (s.peek && i === 0) ? 'accent' : s.cut && i === 0 ? 'red' : 'blue', hi: (s.fresh && last) || (s.peek && i === 0), cut: s.cut && i === 0, o: s.cut && i === 0 ? 0.6 : 1 }; });
      if (s.ph === 'idea') list = ['A', 'B', 'C', 'D'].map(function (t, i) { return { id: 'id' + i, t: t }; });
      var n = list.length + (s.nw ? 1 : 0), stp = Math.min(100, Math.floor(480 / Math.max(n, 1))), w = Math.max(40, stp - 24), x0 = 40;
      items = items.concat(chain(list, { x0: x0, y: y, w: w, step: stp }));
      if (s.nw) {
        var nx = x0 + list.length * stp;
        items.push(B(s.nw.id, nx, y + 90, w, 40, { title: s.nw.t, mono: true, size: 13, tone: 'accent', fill: 'solid', hi: true, from: [nx, y + 150] }));
        items.push(P('pn', nx + w / 2, y + 134, 'node', { dir: 'up', len: 16 }));
        if (s.linkFrom) items.push(A('nl', nx - stp + w, y + 26, nx + w / 2, y + 90, { tone: 'accent', label: 'rear.next' }));
      }
      if (!list.length && s.nw) items.push(P('pf', x0 + w / 2, y + 86, 'front', { dir: 'down', len: 24 }));
      else if (list.length) {
        items.push(P('pf', x0 + w / 2, y - 4, 'front', { dir: 'down', len: 28 }));
        if (list.length) items.push(P('pr', x0 + (list.length - 1) * stp + w / 2, y + 44, 'rear', { dir: 'up', len: 28 }));
      } else items.push(T('emp', 40, y + 26, 'front = rear = null', { mono: true, size: 14, tone: 'muted' }));
      items.push(T('cnt', 20, 40, 'count: ' + (s.ph === 'idea' ? 4 : s.list.length), { mono: true, size: 16, bold: true, tone: 'accent' }));
      if (s.gone) items.push(B(s.gone.id, 400, 270, 110, 40, { title: s.gone.t, mono: true, size: 15, tone: 'accent', fill: 'solid', hi: true, tag: 'dequeue() returned' }));
      if (s.err) items.push(T('er', 280, 290, 'Queue is empty!', { anchor: 'middle', size: 17, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* ---------- 4. the ticket counter simulation (slides 25-29) ---------- */
  function TC(v) { return 'private static final int PROCESS = ' + v.p + ';         // Process time per customer\nprivate static final int ARRIVAL = ' + v.a + ';          // Arrival rate per customer\nprivate static final int MAX_CASHIERS = 10;     // Max cashiers to simulate\nprivate static final int NUM_CUSTOMERS = ' + v.n + ';    // Total arriving customers\n\nQueue<Customer> customerQueue = new LinkedQueue<>();\nint[] cashierTime = new int[MAX_CASHIERS];\nfor (int cashiers = 1; cashiers <= MAX_CASHIERS; cashiers++) {\n  for (int c = 0; c < cashiers; c++) cashierTime[c] = 0;\n  // Load customer queue: one customer arrives every ARRIVAL seconds\n  for (int count = 0; count < NUM_CUSTOMERS; count++)\n    customerQueue.enqueue(new Customer(count * ARRIVAL));\n  int totalTime = 0;   // total time to process all customers\n  int c = 0;           // cashier c\n  // Process all the waiting customers in customerQueue\n  while (!customerQueue.isEmpty()) {\n    Customer customer = customerQueue.dequeue();\n    // ServeTime is maximum of customer arrivalTime and cashierTime\n    int serveTime = Math.max(customer.arrivalTime, cashierTime[c]);\n    // cashier c will become available after customer departs\n    cashierTime[c] = customer.departureTime = serveTime + PROCESS;\n    totalTime += customer.totalTime();   // Accumulate total time\n    c = (c+1) % cashiers;                // Switch to next cashier\n  }\n  int aveTime = totalTime / NUM_CUSTOMERS;\n  System.out.println("Average serve time = " + aveTime + " seconds\\n");\n}'; }
  function simulate(N, k, A0, P0) { var ct = [], tot = 0, c = 0, i; for (i = 0; i < k; i++) ct.push(0); for (i = 0; i < N; i++) { var a = i * A0, s = Math.max(a, ct[c]); ct[c] = s + P0; tot += s + P0 - a; c = (c + 1) % k; } return Math.trunc(tot / N); }
  var tickets = {
    id: 'tickets', slides: [25, 29], title: 'Customers wait in a queue for the cashiers',
    code: function (v) { return TC({ p: Math.trunc(v.p), a: Math.trunc(v.a), n: Math.trunc(v.n) }); },
    inputs: [{ id: 'n', label: 'customers', value: 8, min: 1, max: 12 }, { id: 'k', label: 'cashiers', value: 2, min: 1, max: 4 }, { id: 'a', label: 'ARRIVAL', value: 15, min: 1, max: 200 }, { id: 'p', label: 'PROCESS', value: 120, min: 10, max: 300 }],
    presets: [{ label: '8 customers, 2 cashiers', values: { n: 8, k: 2, a: 15, p: 120 } }, { label: '1 cashier', values: { n: 8, k: 1, a: 15, p: 120 } }, { label: '4 cashiers', values: { n: 8, k: 4, a: 15, p: 120 } }, { label: 'slow arrivals (60 s)', values: { n: 6, k: 2, a: 60, p: 120 } }],
    steps: function (v) {
      var N = Math.trunc(v.n), K = Math.trunc(v.k), A0 = Math.trunc(v.a), P0 = Math.trunc(v.p), st = [], q = [], ct = [], tot = 0, c = 0, done = [];
      for (var i = 0; i < K; i++) ct.push(0);
      var snap = function (o) { o.q = q.slice(); o.ct = ct.slice(); o.tot = tot; o.done = done.slice(); return o; };
      st.push(snap({ slide: 25, line: '1-4', cap: 'The simulation: customers arrive every ' + A0 + ' s, each needs ' + P0 + ' s at a cashier, and they are served in order of arrival. How long does a customer spend, from arriving to leaving?' }));
      st.push(snap({ slide: 26, line: 12, cap: 'A <b>Customer</b> object stores its arrivalTime and departureTime; totalTime() = departureTime − arrivalTime.' }));
      for (i = 0; i < N; i++) q.push({ id: 'cu' + i, t: String(i * A0), a: i * A0 });
      st.push(snap({ slide: 28, line: '9-12', cap: 'The round with <b>' + K + ' cashier' + (K > 1 ? 's' : '') + '</b>: every cashier is free at time 0, and ' + N + ' customers are enqueued with arrival times 0, ' + A0 + ', ' + 2 * A0 + ', …' }));
      while (q.length) {
        var cu = q.shift(), sv = Math.max(cu.a, ct[c]), dep = sv + P0, waited = sv - cu.a;
        ct[c] = dep; tot += dep - cu.a; done.push({ id: cu.id, t: cu.t, c: c, dep: dep });
        st.push(snap({ slide: 28, line: '17-23', cur: cu, cash: c, cap: 'Dequeue the customer who arrived at ' + cu.a + ' s. Cashier ' + (c + 1) + ' is free at ' + (sv === cu.a ? 'or before ' + cu.a : sv) + ' s, so service starts at ' + sv + ' s' + (waited ? ' (waited ' + waited + ' s)' : ' (no wait)') + ' and ends at ' + dep + ' s. Time spent: ' + (dep - cu.a) + ' s.' }));
        c = (c + 1) % K;
      }
      st.push(snap({ slide: 28, line: '25-26', end: true, cap: 'Average = totalTime / customers = ' + tot + ' / ' + N + ' = <b>' + Math.trunc(tot / N) + ' s</b> (int division).', out: 'Average serve time = ' + Math.trunc(tot / N) + ' seconds' }));
      st.push(snap({ slide: 29, line: 8, chart: true, cap: 'The real run: 100 customers, cashiers from 1 to 10. More cashiers help a lot at first, but from 8 on the average stays at ' + P0 + ' s: nobody waits any more, and serving takes PROCESS seconds anyway.' }));
      return st;
    },
    draw: function (k, s, v) {
      var items = [], K = Math.trunc(v.k), A0 = Math.trunc(v.a), P0 = Math.trunc(v.p);
      if (s.chart) {
        var vals = []; for (var c = 1; c <= 10; c++) vals.push(simulate(100, c, A0, P0));
        var mx = Math.max.apply(null, vals);
        vals.forEach(function (x, i) {
          var bh = Math.max(2, 230 * x / mx), bx = 40 + i * 50;
          items.push(B('bar' + i, bx, 290 - bh, 38, bh, { tone: i + 1 === K ? 'accent' : 'teal', fill: 'solid', r: 3 }));
          items.push(T('bv' + i, bx + 19, 284 - bh, String(x), { anchor: 'middle', mono: true, size: 10, bold: true }));
          items.push(T('bn' + i, bx + 19, 308, String(i + 1), { anchor: 'middle', mono: true, size: 12 }));
        });
        items.push(T('bt', 40, 330, 'cashiers (100 customers) → average time in seconds', { size: 11, tone: 'muted' }));
        return items;
      }
      items.push(T('ql', 20, 34, 'customerQueue (arrival times)', { size: 12, bold: true, tone: 'muted' }));
      s.q.forEach(function (e, i) { items.push(B(e.id, 20 + i * 44, 44, 40, 32, { title: e.t, mono: true, size: 11, tone: 'blue' })); });
      for (var j = 0; j < K; j++) {
        var cx = 20 + j * 136, on = j === s.cash;
        items.push(B('cash' + j, cx, 120, 124, 70, { title: 'cashier ' + (j + 1), lines: ['free at ' + s.ct[j] + ' s'], size: 12, tone: on ? 'accent' : 'teal', hi: on }));
      }
      if (s.cur) items.push(B(s.cur.id, 20 + s.cash * 136 + 12, 200, 100, 34, { title: 'arr ' + s.cur.a + ' s', mono: true, size: 11, tone: 'accent', fill: 'solid', hi: true }));
      var shown = s.done.filter(function (d) { return !s.cur || d.id !== s.cur.id; }).slice(-8);
      if (shown.length) items.push(T('dl', 20, 268, 'served (arrival → departure)', { size: 12, bold: true, tone: 'muted' }));
      shown.forEach(function (d, i) { items.push(B(d.id, 20 + i * 66, 278, 62, 30, { title: d.t + '→' + d.dep, mono: true, size: 9.5, tone: 'muted' })); });
      items.push(T('tt', 548, 34, 'totalTime = ' + s.tot, { anchor: 'end', mono: true, size: 13, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 5. the circular ArrayQueue<T> (slides 31-39) ---------- */
  var AQ = 'package myqueue;\n/**\n * ArrayQueue represents an array implementation of a\n * queue in which the front and rear indexes of the queue\n * circle back to 0 when they reach the end of the array.\n */\npublic class ArrayQueue<T> implements Queue<T> {\n  private final static int DEFAULT_CAPACITY = 100;\n  private int front, rear, count;\n  private T[] array;\n\n  // Creates an empty queue using the specified capacity.\n  public ArrayQueue (int initialCapacity) {\n    front = rear = count = 0;\n    array = (T[]) (new Object[initialCapacity]);\n  }\n  // Creates an empty queue using the default capacity.\n  public ArrayQueue() {\n    this(DEFAULT_CAPACITY);\n  }\n  // Adds the specified element to the rear of this queue\n  // Expand the capacity of the queue array if necessary\n  public void enqueue(T element) {\n    if (size() == array.length)\n      expandCapacity();\n    array[rear] = element;\n    rear = (rear+1) % array.length;\n    count++;\n  }\n  // Create a new array to store the contents of this queue\n  // with twice the capacity of the old one.\n  private void expandCapacity() {\n    T[] larger = (T[]) new Object[array.length * 2];\n    for (int i = 0; i < count; i++) {\n      larger[i] = array[front];\n      front = (front + 1) % array.length;\n    }\n    front = 0;\n    rear = count;\n    array = larger;\n  }\n  // Remove the element at the front of this queue\n  public T dequeue() throws RuntimeException {\n    if (count == 0)\n      throw new RuntimeException("Queue is empty\\n");\n    T result = array[front];\n    array[front] = null;\n    front = (front+1) % array.length;\n    count--;\n    return result;\n  }\n  // not on the slides\n  public T first() { return (count == 0)? null : array[front]; }\n  public boolean isEmpty() { return count == 0; }\n  public int size() { return count; }\n}';
  function crun(v) {
    var cap = Math.min(8, Math.max(2, Math.trunc(v.c))), tk = toks(v.ops, 12), code = AQ.split('\n'), ops = [];
    code.push('', '// in main:', 'Queue<String> q = new ArrayQueue<>(' + cap + ');');
    tk.forEach(function (t) {
      var o = /^(-|dequeue)$/.test(t) ? { k: 'dequeue' } : { k: 'enqueue', x: t.slice(0, 3) };
      o.line = code.length + 1;
      code.push(o.k === 'enqueue' ? 'q.enqueue("' + o.x + '");' : 'System.out.println(q.dequeue());');
      ops.push(o);
    });
    return { cap: cap, code: code.join('\n'), ops: ops };
  }
  var circular = {
    id: 'circular', slides: [31, 39], title: 'A circular array: front and rear go around',
    code: function (v) { return crun(v).code; },
    inputs: [{ id: 'ops', type: 'text', label: 'operations', value: 'A B C - - D E F', maxlen: 40 }, { id: 'c', label: 'capacity', value: 4, min: 2, max: 8 }],
    inputsLabel: 'Values to enqueue, <code>-</code> dequeue.',
    presets: [{ label: 'wrap around (capacity 4)', values: { ops: 'A B C - - D E F', c: 4 } }, { label: 'full → expand', values: { ops: 'A B C - D E F', c: 4 } }, { label: 'dequeue an empty queue', values: { ops: 'A - -', c: 3 } }, { label: 'capacity 2', values: { ops: 'A B - C - D E', c: 2 } }],
    steps: function (v) {
      var R = crun(v), st = [], arr = [], f = 0, r = 0, cnt = 0, n = 0, decl = R.code.split('\n').length - R.ops.length, i;
      for (i = 0; i < R.cap; i++) arr.push(null);
      var snap = function (o) { o.arr = arr.slice(); o.f = f; o.r = r; o.cnt = cnt; return o; };
      st.push({ slide: 31, ph: 'shift', k: 0, line: L(AQ, 'T result = array[front]'), cap: 'Idea 1: keep the front fixed at index 0, like the stack’s bottom. A, B, C, D are in cells 0 to 3.' });
      st.push({ slide: 31, ph: 'shift', k: 1, line: L(AQ, 'T result = array[front]'), cap: 'Dequeue A… and then <b>every</b> other element must shift one cell to the left to keep the front at 0. That is <b>O(n)</b> for each dequeue: too slow.' });
      st.push({ slide: 32, ph: 'demo', line: L(AQ, 'private int front, rear, count'), cap: 'Idea 2: treat the array as a <b>circle</b>: after the last index comes index 0. Two indexes, front and rear, mark the ends of the queue.' });
      st.push({ slide: 33, ph: 'demo', line: L(AQ, 'rear = (rear+1) % array.length'), cap: 'Here the queue is in cells 6, 7, 0, 1: front = 6, rear = 2, count = 4. The rear <b>wrapped around</b> to 0. Elements never move; only front and rear change.' });
      st.push(snap({ slide: 35, line: decl + ',' + L(AQ, 'front = rear = count = 0') + '-' + L(AQ, '(new Object[initialCapacity])'), cap: 'new ArrayQueue&lt;&gt;(' + R.cap + '): front = rear = count = 0 and an array of ' + R.cap + ' cells.' }));
      for (i = 0; i < R.ops.length; i++) {
        var o = R.ops[i];
        if (o.k === 'enqueue') {
          if (cnt === arr.length) {
            var larger = [], ff = f, j;
            for (j = 0; j < arr.length * 2; j++) larger.push(null);
            for (j = 0; j < cnt; j++) { larger[j] = arr[ff]; ff = (ff + 1) % arr.length; }
            var oldF = f; arr = larger; f = 0; r = cnt;
            st.push(snap({ slide: 38, line: o.line + ',' + L(AQ, 'if (size() == array.length)') + ',' + L(AQ, 'T[] larger') + '-' + L(AQ, 'array = larger;'), cap: 'enqueue("' + h(o.x) + '"): count = array.length, the array is <b>full</b>. expandCapacity makes an array of ' + arr.length + ' and copies the elements <b>in queue order</b>, starting at the old front (' + oldF + '). Now front = 0 and rear = count = ' + cnt + '.' }));
          }
          var at = r;
          arr[r] = { id: 'e' + n++, t: o.x }; var oldR = r; r = (r + 1) % arr.length; cnt++;
          st.push(snap({ slide: oldR + 1 === arr.length ? 37 : 36, line: o.line + ',' + L(AQ, 'array[rear] = element') + '-' + L(AQ, 'count++;'), hi: at, fresh: at, cap: '<b>enqueue("' + h(o.x) + '")</b>: array[' + oldR + '] = "' + h(o.x) + '", then rear = (' + oldR + ' + 1) % ' + arr.length + ' = <b>' + r + '</b>' + (r === 0 ? ': it <b>wraps around</b> to 0!' : '.') + ' count = ' + cnt + '.' }));
        } else if (!cnt) {
          st.push(snap({ slide: 39, line: o.line + ',' + L(AQ, 'if (count == 0)') + '-' + L(AQ, 'throw new RuntimeException'), err: true, cap: '<b>dequeue()</b> with count = 0 throws a <b>RuntimeException</b>. (front == rear here; it is also true when the queue is full: <b>count</b> tells the two cases apart.)', out: EMPTYQ }));
          break;
        } else {
          var e = arr[f], oldf = f; arr[f] = null; f = (f + 1) % arr.length; cnt--;
          st.push(snap({ slide: 39, line: o.line + ',' + L(AQ, 'T result = array[front]') + '-' + L(AQ, 'return result;'), res: e, cap: '<b>dequeue()</b>: result = array[' + oldf + '] = "' + h(e.t) + '", the cell becomes null, front = (' + oldf + ' + 1) % ' + arr.length + ' = <b>' + f + '</b>' + (f === 0 && oldf > 0 ? ' (wraps around)' : '') + '. count = ' + cnt + '. Nothing shifts: O(1).', out: e.t }));
        }
      }
      if (!st[st.length - 1].err) st.push(snap({ slide: 37, line: L(AQ, 'rear = (rear+1) % array.length'), cap: 'front = ' + f + ', rear = ' + r + ', count = ' + cnt + '. The <code>% array.length</code> makes an index go from the last cell back to 0, so the array is used like a circle.' }));
      return st;
    },
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'shift') {
        var vals = s.k ? ['B', 'C', 'D', null, null, null] : ['A', 'B', 'C', 'D', null, null];
        vals.forEach(function (x, i) { items.push(B('sc' + i, 40 + i * 80, 140, 76, 46, { tone: 'muted', dash: !x })); if (x) items.push(B('se' + x, 44 + i * 80, 144, 68, 38, { title: x, mono: true, size: 15, tone: 'blue', z: 2 })); items.push(T('si' + i, 78 + i * 80, 206, String(i), { anchor: 'middle', mono: true, size: 11, tone: 'muted' })); });
        if (s.k) { items.push(B('seA', 40, 250, 76, 40, { title: 'A', mono: true, size: 15, tone: 'accent', fill: 'solid', tag: 'dequeued' })); [1, 2, 3].forEach(function (i) { items.push(A('sa' + i, 78 + i * 80, 128, 78 + (i - 1) * 80, 128, { tone: 'red', bend: -14 })); }); items.push(T('sw', 360, 260, 'every element moves: O(n)', { size: 14, bold: true, tone: 'red' })); }
        items.push(T('sf', 78, 120, 'front', { anchor: 'middle', size: 12, bold: true, tone: 'accent' }));
        return items;
      }
      if (s.ph === 'demo') {
        var d = [null, null, null, null, null, null, null, null];
        d[6] = { id: 'dA', t: 'A' }; d[7] = { id: 'dB', t: 'B' }; d[0] = { id: 'dC', t: 'C' }; d[1] = { id: 'dD', t: 'D' };
        items = items.concat(ring(d, { front: 6, rear: 2, hi: s.line === L(AQ, 'rear = (rear+1) % array.length') ? 0 : -1 }));
        items.push(T('i1', 340, 80, 'front = 6', { mono: true, size: 15, bold: true, tone: 'accent' }));
        items.push(T('i2', 340, 110, 'rear = 2', { mono: true, size: 15, bold: true, tone: 'teal' }));
        items.push(T('i3', 340, 140, 'count = 4', { mono: true, size: 15, bold: true }));
        items.push(T('i4', 340, 200, 'index 7 is followed by 0', { size: 13, tone: 'muted' }));
        return items;
      }
      var arr = s.arr.map(function (e, i) { return e && i === s.fresh ? { id: e.id, t: e.t, from: [480, 40] } : e; });
      items = items.concat(ring(arr, { front: s.f, rear: s.r, hi: s.hi }));
      items.push(T('i1', 340, 60, 'front = ' + s.f, { mono: true, size: 15, bold: true, tone: 'accent' }));
      items.push(T('i2', 340, 90, 'rear = ' + s.r, { mono: true, size: 15, bold: true, tone: 'teal' }));
      items.push(T('i3', 340, 120, 'count = ' + s.cnt, { mono: true, size: 15, bold: true }));
      items.push(T('i4', 340, 150, 'array.length = ' + s.arr.length, { mono: true, size: 13, tone: 'muted' }));
      if (s.res) items.push(B(s.res.id, 400, 230, 110, 40, { title: s.res.t, mono: true, size: 15, tone: 'accent', fill: 'solid', hi: true, tag: 'dequeue() returned' }));
      if (s.err) items.push(T('er', 440, 250, 'empty!', { anchor: 'middle', size: 18, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* ---------- 6. the deque on a circular array (slides 41-46) ---------- */
  var DQ = '// front, rear, count, array, the constructor and\n// expandCapacity are the same as in ArrayQueue\n\n// Adds an element at the front of the deque\npublic void addFirst(T element) {\n  if (count == array.length) expandCapacity();\n  front = (front == 0)? array.length-1 : front-1;\n  array[front] = element;\n  count++;\n}\n// Adds an element at the back of the deque\npublic void addLast(T element) {\n  if (count == array.length) expandCapacity();\n  array[rear] = element;\n  rear = (rear + 1) % array.length;\n  count++;\n}\n// Removes the element at the front of the deque\npublic T removeFirst() throws RuntimeException {\n  if (count == 0) throw new RuntimeException("Deque is empty");\n  T result = array[front]; array[front] = null;\n  front = (front + 1) % array.length;\n  count--; return result;\n}\n// Removes the element at the back of the deque\npublic T removeLast() throws RuntimeException {\n  if (count == 0) throw new RuntimeException("Deque is empty");\n  rear = (rear == 0)? array.length-1 : rear-1;\n  T result = array[rear]; array[rear] = null;\n  count--; return result;\n}';
  function drun(v) {
    var cap = Math.min(8, Math.max(2, Math.trunc(v.c))), tk = toks(v.ops, 12), code = DQ.split('\n'), ops = [];
    code.push('', '// in main:', 'ArrayDeque<String> d = new ArrayDeque<>(' + cap + ');   // our own deque');
    tk.forEach(function (t) {
      var m = /^(af|al)(\w{1,3})$/.exec(t), o = m ? { k: m[1] === 'af' ? 'addFirst' : 'addLast', x: m[2] } : t === 'rf' ? { k: 'removeFirst' } : t === 'rl' ? { k: 'removeLast' } : null;
      if (!o) return;
      o.line = code.length + 1;
      code.push(o.x != null ? 'd.' + o.k + '("' + o.x + '");' : 'System.out.println(d.' + o.k + '());');
      ops.push(o);
    });
    return { cap: cap, code: code.join('\n'), ops: ops };
  }
  var deque = {
    id: 'deque', slides: [41, 46], title: 'A deque adds and removes at both ends',
    code: function (v) { return drun(v).code; },
    inputs: [{ id: 'ops', type: 'text', label: 'operations', value: 'al1 al2 af0 af9 rl rf', maxlen: 40 }, { id: 'c', label: 'capacity', value: 6, min: 2, max: 8 }],
    inputsLabel: '<code>af5</code> = addFirst("5"), <code>al5</code> = addLast("5"), <code>rf</code> = removeFirst, <code>rl</code> = removeLast.',
    presets: [{ label: 'both ends', values: { ops: 'al1 al2 af0 af9 rl rf', c: 6 } }, { label: 'used as a queue', values: { ops: 'al1 al2 al3 rf rf', c: 6 } }, { label: 'used as a stack', values: { ops: 'af1 af2 af3 rf rf', c: 6 } }, { label: 'full → expand', values: { ops: 'af1 af2 al3 af4', c: 3 } }, { label: 'remove from empty', values: { ops: 'al1 rl rf', c: 4 } }],
    steps: function (v) {
      var R = drun(v), st = [], arr = [], f = 0, r = 0, cnt = 0, n = 0, decl = R.code.split('\n').length - R.ops.length, i;
      for (i = 0; i < R.cap; i++) arr.push(null);
      var snap = function (o) { o.arr = arr.slice(); o.f = f; o.r = r; o.cnt = cnt; return o; };
      st.push(snap({ slide: 41, line: decl, ph: 'idea', cap: 'A <b>deque</b> (double-ended queue) can add, remove and look at elements at <b>both</b> ends. Java has a Deque&lt;T&gt; interface; a deque can be built with an array or a linked list.' }));
      st.push(snap({ slide: 43, line: decl, ph: 'map', cap: 'A deque can act as a <b>queue</b> (addLast + removeFirst) or as a <b>stack</b> (addFirst + removeFirst). It can replace java.util.Stack.' }));
      st.push(snap({ slide: 44, line: decl, cap: 'On a circular array (capacity ' + R.cap + '): addFirst <b>decrements</b> front, then inserts; addLast inserts at rear, then <b>increments</b> rear. front = rear = count = 0 at the start.' }));
      for (i = 0; i < R.ops.length; i++) {
        var o = R.ops[i], s = { slide: 45, line: o.line };
        if (o.x != null && cnt === arr.length) {
          var larger = [], ff = f, j;
          for (j = 0; j < arr.length * 2; j++) larger.push(null);
          for (j = 0; j < cnt; j++) { larger[j] = arr[ff]; ff = (ff + 1) % arr.length; }
          arr = larger; f = 0; r = cnt;
          st.push(snap({ slide: 45, line: o.line + ',' + L(DQ, 'expandCapacity();', o.k === 'addFirst' ? 1 : 2), cap: o.k + '("' + h(o.x) + '"): the array is full, so expandCapacity copies the elements in order into ' + arr.length + ' cells: front = 0, rear = ' + cnt + '.' }));
        }
        if (o.k === 'addFirst') {
          var of = f; f = f === 0 ? arr.length - 1 : f - 1; arr[f] = { id: 'e' + n++, t: o.x }; cnt++;
          s.line += ',' + L(DQ, 'front = (front == 0)') + '-' + (L(DQ, 'front = (front == 0)') + 2); s.hi = f; s.fresh = f;
          s.cap = '<b>addFirst("' + h(o.x) + '")</b>: front ' + (of === 0 ? 'is 0, so it jumps to the <b>last</b> index, ' + f : 'goes back to ' + f) + '; the element goes there. count = ' + cnt + '.';
        } else if (o.k === 'addLast') {
          var or = r; arr[r] = { id: 'e' + n++, t: o.x }; r = (r + 1) % arr.length; cnt++;
          s.line += ',' + L(DQ, 'array[rear] = element') + '-' + (L(DQ, 'array[rear] = element') + 2); s.hi = or; s.fresh = or;
          s.cap = '<b>addLast("' + h(o.x) + '")</b>: the element goes in cell ' + or + ', then rear = ' + r + (r === 0 ? ' (wraps around)' : '') + '. count = ' + cnt + '.';
        } else if (!cnt) {
          s.slide = 46; s.line += ',' + L(DQ, 'Deque is empty', o.k === 'removeFirst' ? 1 : 2); s.err = true; s.out = 'Exception in thread "main" java.lang.RuntimeException: Deque is empty';
          s.cap = '<b>' + o.k + '()</b> on an empty deque throws a RuntimeException.'; st.push(snap(s)); break;
        } else if (o.k === 'removeFirst') {
          var e = arr[f], of2 = f; arr[f] = null; f = (f + 1) % arr.length; cnt--;
          s.slide = 46; s.line += ',' + L(DQ, 'T result = array[front]') + '-' + (L(DQ, 'T result = array[front]') + 2); s.res = e; s.resLb = 'removeFirst() returned'; s.out = e.t;
          s.cap = '<b>removeFirst()</b>: take array[' + of2 + '] = "' + h(e.t) + '", then front moves forward to ' + f + '. count = ' + cnt + '.';
        } else {
          var or2 = r; r = r === 0 ? arr.length - 1 : r - 1; var e2 = arr[r]; arr[r] = null; cnt--;
          s.slide = 46; s.line += ',' + L(DQ, 'rear = (rear == 0)') + '-' + (L(DQ, 'rear = (rear == 0)') + 2); s.res = e2; s.resLb = 'removeLast() returned'; s.out = e2.t;
          s.cap = '<b>removeLast()</b>: rear ' + (or2 === 0 ? 'is 0, so it jumps to the last index, ' + r : 'goes back to ' + r) + ' (the last element is in the cell <b>before</b> rear); take "' + h(e2.t) + '". count = ' + cnt + '.';
        }
        st.push(snap(s));
      }
      return st;
    },
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'idea') {
        ['A', 'B', 'C', 'D'].forEach(function (x, i) { items.push(B('di' + i, 150 + i * 66, 140, 60, 44, { title: x, mono: true, size: 15, tone: 'blue' })); });
        items.push(A('d1', 140, 150, 60, 150, { tone: 'accent', label: 'removeFirst' }));
        items.push(A('d2', 60, 176, 140, 176, { tone: 'teal', label: 'addFirst', ly: 30 }));
        items.push(A('d3', 420, 150, 500, 150, { tone: 'accent', label: 'removeLast' }));
        items.push(A('d4', 500, 176, 420, 176, { tone: 'teal', label: 'addLast', ly: 30 }));
        items.push(T('df', 180, 120, 'first()', { anchor: 'middle', mono: true, size: 12, tone: 'muted' }));
        items.push(T('dl', 380, 120, 'last()', { anchor: 'middle', mono: true, size: 12, tone: 'muted' }));
        return items;
      }
      if (s.ph === 'map') {
        var rows = [['enqueue(x)', 'addLast(x)'], ['dequeue()', 'removeFirst()'], ['first()', 'first()'], ['push(x)', 'addFirst(x)'], ['pop()', 'removeFirst()'], ['peek()', 'first()']];
        items.push(T('mq', 40, 30, 'Queue', { size: 14, bold: true, tone: 'teal' }));
        items.push(T('ms', 40, 182, 'Stack', { size: 14, bold: true, tone: 'accent' }));
        rows.forEach(function (rw, i) {
          var y = 42 + i * 46 + (i >= 3 ? 14 : 0);
          items.push(B('ml' + i, 40, y, 180, 34, { title: rw[0], mono: true, size: 13, tone: i < 3 ? 'teal' : 'accent' }));
          items.push(A('ma' + i, 230, y + 17, 300, y + 17, { tone: 'muted' }));
          items.push(B('mr' + i, 310, y, 200, 34, { title: rw[1], mono: true, size: 13, tone: 'blue' }));
        });
        return items;
      }
      var arr = s.arr.map(function (e, i) { return e && i === s.fresh ? { id: e.id, t: e.t, from: [480, 40] } : e; });
      items = items.concat(ring(arr, { front: s.f, rear: s.r, hi: s.hi }));
      items.push(T('i1', 340, 60, 'front = ' + s.f, { mono: true, size: 15, bold: true, tone: 'accent' }));
      items.push(T('i2', 340, 90, 'rear = ' + s.r, { mono: true, size: 15, bold: true, tone: 'teal' }));
      items.push(T('i3', 340, 120, 'count = ' + s.cnt, { mono: true, size: 15, bold: true }));
      items.push(T('i4', 340, 150, 'array.length = ' + s.arr.length, { mono: true, size: 13, tone: 'muted' }));
      var order = []; for (var q = 0; q < s.cnt; q++) order.push(s.arr[(s.f + q) % s.arr.length].t);
      items.push(T('i5', 340, 190, 'first → last: ' + (order.join(' ') || '(empty)'), { mono: true, size: 13, tone: 'blue' }));
      if (s.res) items.push(B(s.res.id, 400, 240, 120, 40, { title: s.res.t, mono: true, size: 15, tone: 'accent', fill: 'solid', hi: true, tag: s.resLb }));
      if (s.err) items.push(T('er', 440, 260, 'empty!', { anchor: 'middle', size: 18, bold: true, tone: 'red' }));
      return items;
    }
  };

  var code = function (t) { return { type: 'code', lang: 'java', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; };
  var OUT = ['Conceptual Queue', 'Queues in the Java API', 'Using Queues: Code Keys', 'A Linked Implementation of a Queue', 'Ticket Counter Simulation', 'A Circular Array Implementation of a Queue', 'Double-Ended Queue'];
  function outline(on, ex) { return { blocks: OUT.map(function (t, i) { return { type: 'bullet', html: i === on ? '<b>' + t + '</b>' : t }; }), explain: ex }; }

  addUnit({
    course: 'ds', lesson: '05-queues',
    blurb: 'First in, first out: queue operations, Java’s Queue interface, a repeating-key cipher, LinkedQueue, a ticket counter simulation, the circular ArrayQueue and the deque.',
    parts: [
      { title: 'The queue and the Java API', from: 1, to: 7 },
      { title: 'Using queues: code keys', from: 8, to: 14 },
      { title: 'A linked implementation', from: 15, to: 23 },
      { title: 'Ticket counter simulation', from: 24, to: 29 },
      { title: 'A circular array implementation', from: 30, to: 39 },
      { title: 'Double-ended queue', from: 40, to: 46 }
    ],
    visuals: [queueops, codes, linkedqueue, tickets, circular, deque],
    slides: {
      1: { cover: true, explain: '<p>A <b>queue</b> is a collection where the <b>first</b> element added is the first one removed: <b>FIFO</b> (first in, first out). It has two ends: elements join at one end and leave from the other.</p><pre class="ex">add A, add B, add C  →  remove gives A, then B, then C</pre><p class="watch">A stack is LIFO (last in, first out); a queue is FIFO. Same elements, opposite order.</p>' },
      2: outline(-1, '<p>The plan: the idea of a queue, queues in Java, a cipher that uses a queue, a linked queue, a simulation, a queue on a circular array, and the double-ended queue.</p>'),
      3: { blocks: [{ type: 'bullet', text: 'A queue is a collection whose elements are added at one end (rear of queue) and removed from the other (front of queue).' }, { type: 'bullet', text: 'The elements processed in a first in, first out (FIFO) manner.' }, { type: 'bullet', text: 'Example: waiting line in a bank, or cars at a red light.' }], explain: '<p>Elements are added at the <b>rear</b> of the queue and removed from the <b>front</b>. So they are processed in the order they arrived: <b>FIFO</b>.</p><pre class="ex">a line at a bank, cars at a red light:\nthe first to arrive is the first to go</pre><p class="watch">Nobody can enter in the middle, and nobody can leave from the middle.</p>' },
      4: { explain: '<p>The queue operations:</p><pre class="ex">enqueue(x)  add x at the rear\ndequeue()   remove the front element and return it\nfirst()     return the front element, do not remove it</pre><p>Plus isEmpty and size, as in a stack. Compare: a stack adds and removes at the <b>same</b> end; a queue adds at one end and removes at the <b>other</b>.</p><p class="watch">first() is like a stack’s peek(): it only looks, the queue does not change.</p>' },
      5: { explain: '<p>Java is not {{consistent|متّسق}} here:</p><ul><li>for stacks it has a <b>class</b>, java.util.Stack;</li><li>for queues it has a <b>Queue interface</b>, and classes like <b>LinkedList</b> implement it.</li></ul><pre class="ex">Queue&lt;Integer&gt; q = new LinkedList&lt;&gt;();</pre><p>Java’s Queue does not use the names enqueue, dequeue and first. It has two versions of each operation, which handle problems differently.</p>' },
      6: { explain: '<p>The UML diagram: <b>Queue&lt;T&gt;</b> is a generic interface; <b>LinkedList&lt;T&gt;</b> is a generic class that implements it (the dashed arrow with an open triangle).</p><pre class="ex">element() : T     add(T o) : void     offer(T o) : boolean\npeek() : T        poll() : T          remove() : T</pre><p class="watch">You cannot write <code>new Queue&lt;&gt;()</code>: Queue is an interface. Create a class that implements it, like LinkedList.</p>' },
      7: { explain: '<p>Each operation comes in two versions:</p><pre class="ex">add      throws an exception  |  offer  returns false\nremove   throws an exception  |  poll   returns null\nelement  throws an exception  |  peek   returns null</pre><p>The left ones <b>throw</b> an exception when they cannot work; the right ones return a special value.</p><p class="watch">With an empty queue, <code>remove()</code> stops the program, but <code>poll()</code> just returns null. Try both in the drawing.</p>' },
      8: outline(2, '<p>Next: a real use of a queue, encoding secret messages.</p>'),
      9: { blocks: [bul('A Caesar cipher is a simple approach to encoding messages by shifting each letter by a constant amount k.'), bul('For example, if k is 3, the message:'), code('simplicity follows complexity'), { type: 'paragraph', text: 'is encoded as:' }, code('vlpsolflwb iroorzv frpsohalwb'), bul('The letter x is encoded as a, y becomes b, and z becomes c'), bul('To decode a message, we subtract k from each letter.'), bul('Unfortunately, the Caesar cipher is easy to break.'), bul('There are only 26 possibilities for shifting the characters.')], explain: '<p>A <b>Caesar {{cipher|شيفرة}}</b> shifts every letter by the same number k. With k = 3:</p><pre class="ex">s → v, i → l, m → p …\nsimplicity → vlpsolflwb</pre><p>At the end of the alphabet it wraps: x → a, y → b, z → c. To <b>decode</b>, shift back by k.</p><p class="watch">It is easy to break: there are only 26 possible shifts, so just try them all.</p>' },
      10: { explain: '<p>Stronger: a <b>repeating key</b>, a list of shifts. The 1st character uses the 1st key value, the 2nd the 2nd… and when the list ends, it starts again.</p><pre class="ex">key 3 1 7 4 2 5\nk+3 = n, n+1 = o, o+7 = v, w+4 = a (wraps), …</pre><p>Now the same letter can become different letters.</p><p class="watch">On this slide spaces are skipped and letters wrap around the alphabet. The program on the next slides shifts <b>every</b> character, spaces too, and does not wrap.</p>' },
      11: { explain: '<p>The program puts the key values in a <b>queue</b>:</p><pre class="ex">int[] key = {3, 2, -3, 4, -1, -2, 1};\nfor (int k : key) encodingQueue.add(k);</pre><p>A queue is perfect here: the front holds the next key to use, and a used key goes to the rear to wait for its next turn.</p><p>The encoded text is built with a <b>StringBuilder</b>.</p>' },
      12: { explain: '<p>For each character of the message:</p><ol><li><code>remove()</code> the key at the front;</li><li>add it to the character: <code>(char) (message.charAt(i) + keyValue)</code>;</li><li><code>add</code> the key back at the rear.</li></ol><pre class="ex">\'T\' (84) + 3 = 87 → \'W\'</pre><p>Then the key values for decoding go into a second queue.</p><p class="watch">Without step 3 the queue would be empty after 7 characters, and remove() would throw an exception.</p>' },
      13: { explain: '<p>Decoding does the same loop with the second queue, but <b>subtracts</b> each key value:</p><pre class="ex">\'W\' (87) − 3 = 84 → \'T\'</pre><p>Because both queues start with the same keys in the same order, every character gets back its own key, and the original message comes back.</p><p class="watch">Encoding and decoding must start the keys at the same place; one extra remove() would shift every key after it.</p>' },
      14: { blocks: [{ type: 'bullet', text: 'The UML diagram shows the binding of the generic type T to Integer.' }, { type: 'bullet', text: 'We have two bindings, one for the Queue<T> interface and one for the LinkedList<T> class.' }, { type: 'bullet', text: 'Codes instantiates the LinkedList<Integer> class that implements Queue<Integer>.' }], explain: '<p>In this UML diagram, the generic T is <b>bound</b> to Integer:</p><pre class="ex">Queue&lt;T&gt;      → Queue&lt;Integer&gt;\nLinkedList&lt;T&gt; → LinkedList&lt;Integer&gt;</pre><p>Codes creates a <code>LinkedList&lt;Integer&gt;</code> and uses it through the <code>Queue&lt;Integer&gt;</code> interface. So it can only call queue methods (add, remove…), even though the object is a LinkedList.</p><p class="watch">The type in &lt;&gt; must be a class: Queue&lt;Integer&gt;, not Queue&lt;int&gt;.</p>' },
      15: outline(3, '<p>Next: our own queue, built with linked nodes.</p>'),
      16: { explain: '<p>As with stacks, we define our <b>own</b> generic interface <b>Queue&lt;T&gt;</b> with the standard operations: enqueue, dequeue, first, isEmpty, size.</p><pre class="ex">two implementations of one interface:\nLinkedQueue&lt;T&gt;   (linked nodes)\nArrayQueue&lt;T&gt;    (a circular array)</pre><p class="watch">toString is in the interface too, but it is not a real queue operation.</p>' },
      17: { explain: '<p>The interface, in the package <code>myqueue</code>:</p><pre class="ex">void enqueue(T element);   T dequeue();   T first();\nboolean isEmpty();         int size();    String toString();</pre><p>Only the signatures: each implementing class writes the bodies.</p><p class="watch">This is our own Queue, not java.util.Queue: it uses enqueue and dequeue, not add and remove.</p>' },
      18: { explain: '<p>A linked queue is a linked list of Node objects, as in the linked stack. But a queue works at <b>two</b> ends, so it needs two references:</p><pre class="ex">front → [A] → [B] → [C] ← rear</pre><ul><li><b>front</b>: where we dequeue;</li><li><b>rear</b>: where we enqueue.</li></ul><p>A <b>count</b> keeps the number of nodes.</p><p class="watch">Without rear, every enqueue would walk the whole list to find the end: O(n).</p>' },
      19: { blocks: [bul('The generic LinkedQueue<T> class implements a linked list version of the queue.'), code('package myqueue;\n// The LinkedQueue<T> class is a linked implementation of Queue<T>.\npublic class LinkedQueue<T> implements Queue<T> {\n  private Node<T> front;   // reference to front node\n  private Node<T> rear;    // reference to rear node\n  private int count;       // count of elements in the queue\n\n  // Constructor of an empty LinkedQueue object.\n  public LinkedQueue() {\n    front = rear = null;\n    count = 0;\n  }')],
        explain: '<p>Three fields: front, rear and count. The constructor makes an empty queue:</p><pre class="ex">front = rear = null;   // both null at the same time\ncount = 0;</pre><p><code>front = rear = null</code> sets both references to null in one line (assignment works right to left).</p>' },
      20: { blocks: [bul('To construct a linked list, the LinkedQueue<T> class defines Node<T> as a nested private static class.'), bul('Node<T> serves as the node containing a reference to the next node and a reference to a generic element of type T.'), code('private static class Node<T> {   // Generic linked list node\n    Node<T> next;                // Pointer to next node\n    T element;                   // Reference to an element\n    Node(T elem) {               // Constructor of a new node\n        next = null;\n        element = elem;          // References elem of type T\n    }\n}')],
        explain: '<p>The same Node&lt;T&gt; as in LinkedStack: a private static class nested inside LinkedQueue, with two references, <code>next</code> and <code>element</code>.</p><pre class="ex">new Node&lt;T&gt;("A")  →  element = "A", next = null</pre><p class="watch">Each class has its <b>own</b> nested Node class; LinkedQueue cannot use LinkedStack’s private Node.</p>' },
      21: { blocks: [bul('The enqueue(T) method creates a new node for an element of type T and links it at the rear of this queue. It also increments the count of elements.'), code('  // Add an element of type T to the tail of this queue.\n  public void enqueue(T element) {\n     // Create a new node for an element of type T\n     Node<T> node = new Node<T>(element);\n     if (count==0) front = node; // If empty queue, insert a front node.\n     else rear.next = node;      // Otherwise, insert after rear node.\n     rear = node;                // rear now points to the inserted node.\n     count++;                    // Count the newly inserted node.\n   }')],
        explain: '<p>enqueue adds a node at the <b>rear</b>:</p><ul><li>empty queue: the new node is also the front: <code>front = node</code>;</li><li>otherwise: link it after the old rear: <code>rear.next = node</code>.</li></ul><p>Then <code>rear = node</code> and count++.</p><pre class="ex">front → A → B ← rear;  enqueue C:\nB.next = C;  rear = C</pre><p class="watch">With an empty queue, <code>rear.next</code> would throw a NullPointerException: that is why the empty case is separate.</p>' },
      22: { blocks: [bul('The dequeue() method removes the head node of this queue and returns a reference to its element. It also decrements the count of elements.'), code('  // Remove the head node of this queue and return its element\n  // If queue is empty, then throw RuntimeException\n  public T dequeue() throws RuntimeException {\n    if (count == 0) throw new RuntimeException("Queue is empty\\n");\n    T element = front.element;   // Reference to front element\n    Node<T> next = front.next;   // Reference to next node\n    front.next = null;           // Disconnect front node from list\n    front = next;                // front now references next node\n    count--;                     // Decrement the count of elements\n    if (count == 0) rear = null; // If queue becomes empty\n    return element;              // Reference to removed element\n  }')],
        explain: '<p>dequeue removes the <b>front</b> node, like the stack’s pop:</p><pre class="ex">element = front.element;   next = front.next;\nfront.next = null;         front = next;   count--;</pre><p>One extra line: if the queue becomes empty, set <code>rear = null</code> too.</p><p class="watch">Forget that line and rear still points to the removed node; the next enqueue would link the new node to garbage, and front would stay null.</p>' },
      23: { explain: '<p>The small methods:</p><ul><li><b>first</b>: returns front.element, or <b>null</b> if empty;</li><li><b>isEmpty</b>: count == 0;</li><li><b>size</b>: count.</li></ul><pre class="ex">enqueue, dequeue, first, isEmpty, size → all O(1)</pre><p class="watch">dequeue on an empty queue throws an exception, but first only returns null.</p>' },
      24: outline(4, '<p>Next: using a queue to simulate a real waiting line.</p>'),
      25: { explain: '<p>A queue can <b>simulate</b> a waiting line at a theatre:</p><ul><li>a customer arrives every 15 s, 100 customers;</li><li>serving one customer takes 120 s;</li><li>customers are served in order of arrival, and wait until a cashier is free.</li></ul><pre class="ex">1 cashier → average 5317 s\n7 cashiers → average 219 s</pre><p>The program repeats the simulation with 1, 2, … 10 cashiers and computes the average time per customer.</p>' },
      26: { title: 'The Customer class', blocks: [code('package qexamples;\n// Customer represents a waiting customer\npublic class Customer {\n  int arrivalTime;       // arrival time (seconds) of a customer\n  int departureTime;     // departure time (seconds) of a customer\n\n  // Create a new customer with the specified arrival time.\n  public Customer(int arrival) {\n    arrivalTime = arrival;\n  }\n\n  // Compute and return the total time spent by this customer.\n  public int totalTime() {\n    return departureTime - arrivalTime;\n  }\n}')],
        explain: '<p>A Customer only stores two times, in seconds:</p><ul><li><b>arrivalTime</b>: when they join the queue;</li><li><b>departureTime</b>: when they leave the cashier.</li></ul><pre class="ex">arrives at 30, leaves at 270 → totalTime() = 240 s</pre><p>totalTime includes the <b>waiting</b> time and the 120 s of service.</p>' },
      27: { blocks: [code('package qexamples; import myqueue.Queue; import myqueue.LinkedQueue;\n// TicketCounter uses a queue to simulate a line of waiting customers\npublic class TicketCounter {\n  private static final int PROCESS = 120;        // Process time per customer\n  private static final int ARRIVAL = 15;         // Arrival rate per customer\n  private static final int MAX_CASHIERS = 10;    // Max cashiers to simulate\n  private static final int NUM_CUSTOMERS = 100;  // Total arriving customers\n\n  public static void main(String[] args) {\n    // customerQueue stores all the arriving customers\n    Queue<Customer> customerQueue = new LinkedQueue<>();\n    // cashierTime array keeps track of each cashier time\n    int[] cashierTime = new int[MAX_CASHIERS];\n    // Repeat the simulation for various number of cashiers\n    for (int cashiers = 1; cashiers <= MAX_CASHIERS; cashiers++) {\n      System.out.println("Number of cashiers serving customers is " + cashiers);\n      // Initialize each cashier time to zero\n      for (int c = 0; c < cashiers; c++) cashierTime[c] = 0;')],
        explain: '<p>The settings are constants (easy to change): PROCESS = 120, ARRIVAL = 15, MAX_CASHIERS = 10, NUM_CUSTOMERS = 100.</p><ul><li><code>customerQueue</code>: our own LinkedQueue of customers;</li><li><code>cashierTime[c]</code>: the time when cashier c becomes free.</li></ul><pre class="ex">for cashiers = 1 … 10: cashierTime[0 … cashiers-1] = 0</pre><p>The whole simulation runs again for each number of cashiers.</p>' },
      28: { blocks: [code('      // Load customer queue: one customer arrives every ARRIVAL seconds\n      for (int count = 0; count < NUM_CUSTOMERS; count++)\n        customerQueue.enqueue(new Customer(count * ARRIVAL));\n\n      int totalTime = 0;    // total time to process all customers\n      int c = 0;            // cashier c\n\n      // Process all the waiting customers in customerQueue\n      while (!customerQueue.isEmpty()) {\n        Customer customer = customerQueue.dequeue();\n        // ServeTime is maximum of customer arrivalTime and cashierTime\n        int serveTime = Math.max(customer.arrivalTime, cashierTime[c]);\n        // cashier c will become available after customer departs\n        cashierTime[c] = customer.departureTime = serveTime + PROCESS;\n        totalTime += customer.totalTime();   // Accumulate total time\n        c = (c+1) % cashiers;                // Switch to next cashier\n      }\n      int aveTime = totalTime / NUM_CUSTOMERS;\n      System.out.println("Average serve time = " + aveTime + " seconds\\n");\n    }\n  }\n}')],
        explain: '<p>Enqueue all customers (arrival 0, 15, 30…). Then, while the queue is not empty, dequeue one:</p><pre class="ex">serveTime = max(arrival, cashierTime[c])\ndeparture = serveTime + 120</pre><p>A customer starts when they have arrived <b>and</b> cashier c is free. Then the next customer goes to the next cashier: <code>c = (c+1) % cashiers</code>.</p><p class="watch">Customers do not pick the cashier who is free first: they take turns, 0, 1, 2, 0, 1, 2…</p>' },
      29: { explain: '<p>The results:</p><pre class="ex">1 cashier  → 5317 s (1 hour 28 min)\n7 cashiers → 219 s\n8, 9, 10   → 120 s</pre><p>With 8 cashiers nobody waits: each customer only spends the 120 s of service. More cashiers cannot make it faster.</p><p class="watch">The average can never be less than PROCESS (120 s): that time is always needed.</p>' },
      30: outline(5, '<p>Next: a queue built with an array.</p>'),
      31: { explain: '<p>Can we build a queue like ArrayStack, with one end fixed at index 0? A queue works at <b>both</b> ends, so:</p><pre class="ex">[A][B][C][D]  dequeue A →\n[B][C][D][ ]  every element shifts left: O(n)</pre><p>Shifting n elements on every dequeue is <b>{{inefficient|غير فعّال}}</b>. We need a way to avoid shifting.</p><p class="watch">If instead the rear is fixed at 0, then every <b>enqueue</b> shifts. Either way, one end is O(n).</p>' },
      32: { explain: '<p>The better idea: treat the array as a <b>circle</b>. With 100 cells, after index 99 comes index 0 again.</p><pre class="ex">… 97, 98, 99, 0, 1, 2 …</pre><p>Two indexes, <b>front</b> and <b>rear</b>, mark where the queue starts and ends. They move forward around the circle.</p>' },
      33: { explain: '<p>When <b>rear</b> reaches the end of the array, it <b>wraps around</b> to index 0. In the picture the queue is in cells 98, 99, 0, 1:</p><pre class="ex">front = 98, rear = 2, count = 4</pre><p>An element stays in its cell until it is removed; <b>nothing shifts</b>. Only front and rear move.</p><p class="watch">rear is the index of the next <b>free</b> cell, not of the last element.</p>' },
      34: { title: 'The ArrayQueue<T> class', blocks: [code('package myqueue;\n/**\n * ArrayQueue represents an array implementation of a\n * queue in which the front and rear indexes of the queue\n * circle back to 0 when they reach the end of the array.\n */\npublic class ArrayQueue<T> implements Queue<T> {\n  private final static int DEFAULT_CAPACITY = 100;\n  private int front, rear, count;\n  private T[] array;')],
        explain: '<p>ArrayQueue&lt;T&gt; implements our Queue&lt;T&gt; with a circular array. Its fields:</p><pre class="ex">int front;   // index of the first element\nint rear;    // index of the next free cell\nint count;   // how many elements\nT[] array;</pre><p class="watch">front == rear when the queue is empty, and also when it is full. Only <b>count</b> tells which one it is.</p>' },
      35: { explain: '<p>Two constructors, like ArrayStack:</p><pre class="ex">new ArrayQueue&lt;&gt;(10) → front = rear = count = 0, 10 cells\nnew ArrayQueue&lt;&gt;()   → this(DEFAULT_CAPACITY), 100 cells</pre><p>The array is created as an <b>Object</b> array and cast to T[], because <code>new T[...]</code> is not allowed (the same trick as ArrayStack).</p><p class="watch">An empty queue has front = rear = 0, but they do not stay at 0: after some enqueues and dequeues the queue can start anywhere in the array.</p>' },
      36: { explain: '<p>enqueue:</p><ol><li>if the array is full, expand it;</li><li>put the element at <code>array[rear]</code>;</li><li>move rear forward <b>circularly</b>: <code>rear = (rear+1) % array.length</code>;</li><li>count++.</li></ol><pre class="ex">length 4, rear = 3:  array[3] = x;  rear = 4 % 4 = 0</pre><p class="watch">Without <code>% array.length</code>, rear would become 4 and the next enqueue would be out of the array.</p>' },
      37: { blocks: [{ type: 'bullet', text: 'Both the front and rear index values are incremented, wrapping back to 0 when necessary.' }], explain: '<p>The <b>circular increment</b>:</p><pre class="ex">rear = (rear + 1) % array.length;\nlength 8: 5 → 6, 6 → 7, 7 → 0 (wraps)</pre><p>Add 1 normally; the <code>%</code> (remainder) brings the index back to 0 when it reaches the length. front moves the same way in dequeue.</p><p class="watch">% only wraps from the end to 0. It does not work for going <b>back</b> from 0 (the deque needs another trick, slide 45).</p>' },
      38: { title: 'The expandCapacity method', blocks: [code('/**\n * Create a new array to store the contents of this queue\n * with twice the capacity of the old one.\n */\nprivate void expandCapacity() {\n    T[] larger = (T[]) new Object[array.length * 2];\n    for (int i = 0; i < count; i++) {\n        larger[i] = array[front];\n        front = (front + 1) % array.length;\n    }\n    front = 0;\n    rear = count;\n    array = larger;\n}')],
        explain: '<p>A full circular array cannot just be copied cell by cell: the queue may start in the middle and wrap around. So expandCapacity copies <b>in queue order</b>, starting at front:</p><pre class="ex">old: [C][D][A][B]  front = 2\nnew: [A][B][C][D][ ][ ][ ][ ]  front = 0, rear = 4</pre><p class="watch">Arrays.copyOf (used by ArrayStack) would keep C, D before A, B, and break the queue order.</p>' },
      39: { explain: '<p>dequeue:</p><pre class="ex">result = array[front];\narray[front] = null;\nfront = (front+1) % array.length;\ncount--;  return result;</pre><p>No shifting: just one index moves, so dequeue is <b>O(1)</b>. An empty queue (count == 0) throws a RuntimeException.</p><p class="watch">The slide’s indentation makes the lines after <code>throw</code> look like they belong to the if. They do not: the if only controls the throw.</p>' },
      40: outline(6, '<p>Last: a queue with two open ends, the deque.</p>'),
      41: { explain: '<p>A <b>double-ended queue</b> (<b>deque</b>, said “deck”) lets you add, remove and look at elements at <b>both</b> ends.</p><pre class="ex">addFirst  addLast  removeFirst  removeLast  first  last</pre><p>Java gives a <b>Deque&lt;T&gt;</b> interface. A deque can be built with an array or a linked list, and it can act as a queue or as a stack, so it can replace java.util.Stack.</p>' },
      42: { text: false, explain: '<p>The Deque&lt;T&gt; methods:</p><pre class="ex">void addFirst(T e)    void addLast(T e)\nT removeFirst()       T removeLast()\nT first()             T last()\nint size()            boolean isEmpty()</pre><p>The add methods throw an exception if they cannot add; the remove, first and last methods throw one if the deque is empty.</p>' },
      43: { text: false, explain: '<p>A deque can play both roles:</p><pre class="ex">Queue:  enqueue → addLast     dequeue → removeFirst   first → first\nStack:  push    → addFirst    pop     → removeFirst   peek  → first</pre><p>As a queue, elements go in at one end and out at the other. As a stack, they go in and out at the <b>same</b> end (the front).</p>' },
      44: { explain: '<p>On a circular array, two indexes again:</p><ul><li><b>addFirst</b>: front moves <b>back</b> one cell, then the element is stored there;</li><li><b>addLast</b>: store at rear, then rear moves <b>forward</b>;</li><li><b>removeFirst</b>: remove at front, then front moves forward;</li><li><b>removeLast</b>: rear moves back, then remove there.</li></ul><pre class="ex">front = 3, rear = 7, count = 4  → elements in 3, 4, 5, 6</pre>' },
      45: { title: 'addFirst and addLast', blocks: [code(DQ.slice(DQ.indexOf('// Adds an element at the front'), DQ.indexOf('// Removes the element at the front') - 1))], explain: '<p><b>addFirst</b> moves front back by one. From 0 it must jump to the <b>last</b> index:</p><pre class="ex">front = (front == 0)? array.length-1 : front-1;\nlength 8: front 0 → 7</pre><p><b>addLast</b> is the queue’s enqueue: store at rear, then <code>rear = (rear + 1) % array.length</code>.</p><p class="watch">For going back, <code>(front - 1) % array.length</code> does not work in Java: -1 % 8 is -1, not 7. That is why the slide uses the ? : test.</p>' },
      46: { title: 'removeFirst and removeLast', blocks: [code(DQ.slice(DQ.indexOf('// Removes the element at the front')))], explain: '<p><b>removeFirst</b> is the queue’s dequeue. <b>removeLast</b> first moves rear back (rear is one past the last element), then takes that element:</p><pre class="ex">rear = (rear == 0)? array.length-1 : rear-1;\nT result = array[rear];  array[rear] = null;</pre><p>All four operations are <b>O(1)</b>. Both removes throw a RuntimeException on an empty deque.</p><p class="watch">In removeLast, move rear <b>before</b> reading the cell; in removeFirst, read <b>before</b> moving front.</p>' }
    },
    exam: {
      questions: [
        { q: 'A queue starts empty. Run: enqueue(P), enqueue(Q), enqueue(R), dequeue(), enqueue(S), dequeue(). In which order did the two dequeues return their elements?',
          options: ['Q, P', 'R, S', 'P, R', 'P, Q'], answer: 3, review: 4,
          why: 'FIFO: the oldest element leaves first. P was enqueued first, then Q. S came later, so it is not reached yet. "R, S" takes the newest elements, which is what a stack would do.',
          lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 1 },
        { type: 'tf', q: 'In the slides\' ArrayQueue, `rear` is the index of the next free cell, where the next element will be stored.', answer: true, review: 36,
          why: 'enqueue does <code>array[rear] = element;</code> and then moves rear forward. So rear always points one past the newest element, like top in ArrayStack.',
          lessons: ['05-queues'], skills: ['concept'], available_after: '05-queues', level: 1 },
        { source: { assignment: 3, question: 14 },
          q: 'A queue uses a singly linked list with front and rear pointers. Initially it is empty. After enqueue(10), enqueue(20), dequeue(), dequeue(), and enqueue(30), which statement must be true in a correct implementation?',
          options: ['front is null and rear points to the node containing 30', 'front points to the node containing 30 and rear is null', 'front points to the node containing 20 and rear points to the node containing 30', 'front and rear both point to the node containing 30'], answer: 3, review: 22,
          why: 'The two dequeues empty the queue (and a correct dequeue sets rear to null too). enqueue(30) on an empty queue makes the new node both the front node and the rear node (slide 21). 20 was already removed, and a queue with one node never has a null end.',
          lessons: ['05-queues'], skills: ['trace', 'edge_case'], available_after: '05-queues', level: 2 },
        { type: 'fill', q: 'Complete the slides\' enqueue of ArrayQueue.',
          code: 'public void enqueue(T element) {\n  if (size() == array.length)\n    expandCapacity();\n  array[___] = element;\n  rear = (___) % array.length;\n  count++;\n}',
          answer: ['rear', 'rear+1|rear + 1|1+rear|1 + rear'], review: 36,
          why: 'The element goes into the next free cell, rear; then rear moves forward and wraps around to 0 after the last cell, thanks to % array.length.',
          lessons: ['05-queues'], skills: ['design'], available_after: '05-queues', level: 2 },
        { q: 'A Deque is used as a queue. Which pair of methods gives FIFO order?',
          options: ['addLast and removeFirst', 'addFirst and removeFirst', 'addLast and removeLast', 'addFirst and first'], answer: 0, review: 43,
          why: 'A queue adds at one end and removes at the other: enqueue = addLast, dequeue = removeFirst (slide 43). Using the same end for both (addFirst/removeFirst or addLast/removeLast) gives a stack.',
          lessons: ['05-queues'], skills: ['concept'], available_after: '05-queues', level: 2 },
        { q: 'In the ticket counter loop, cashier 1 is free at 300. The next customer for cashier 1 arrived at 240. PROCESS is 120. What is added to totalTime for this customer?',
          options: ['60', '120', '180', '420'], answer: 2, review: 28,
          why: 'serveTime = max(240, 300) = 300, so departure = 300 + 120 = 420, and totalTime() = 420 − 240 = 180: 60 s of waiting plus 120 s of service. "420" adds the departure time itself.',
          lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 2 },
        { type: 'output', q: 'What does this print?',
          code: 'Queue<Integer> q = new LinkedList<>();\nfor (int i = 1; i <= 3; i++)\n  q.add(i * 5);\nq.add(q.remove());\nSystem.out.println(q.peek());\nSystem.out.println(q);',
          answer: '10\n[10, 15, 5]', review: 7,
          why: 'The queue is 5, 10, 15. remove() takes 5 from the front, and add puts it back at the rear: 10, 15, 5. peek shows the new front, 10. Printing a LinkedList shows the elements from front to rear in brackets.',
          lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 2 },
        { type: 'bug', q: 'This LinkedQueue dequeue leaves the queue in a wrong state after its last element is removed. Tap the line with the mistake.',
          code: 'public T dequeue() {\n  if (count == 0) throw new RuntimeException("Queue is empty\\n");\n  T element = front.element;\n  Node<T> next = front.next;\n  front.next = null;\n  front = next;\n  count--;\n  if (count == 0) front = null;\n  return element;\n}',
          answer: 8, review: 22,
          why: 'When the queue becomes empty, <b>rear</b> must be set to null (slide 22), not front: front is already null at that point (front = next, and next was null). Here rear keeps pointing to the removed node.',
          lessons: ['05-queues'], skills: ['bug', 'edge_case'], available_after: '05-queues', level: 2 },
        { type: 'trace', q: 'An ArrayQueue starts with capacity 3. Fill in front, rear, count and array.length after each operation.',
          cols: ['operation', 'front', 'rear', 'count', 'array.length'], rows: [['enqueue(A)', '0', '1', '1', '3'], ['enqueue(B)', '?0', '?2', '?2', '?3'], ['dequeue()', '?1', '?2', '?1', '?3'], ['enqueue(C)', '?1', '?0', '?2', '?3'], ['enqueue(D)', '?1', '?1', '?3', '?3'], ['enqueue(E)', '?0', '?4', '?4', '?6']],
          review: 38,
          why: 'C goes into cell 2 and rear wraps to 0; D goes into cell 0 and rear becomes 1. Now count = 3 = array.length, so enqueue(E) first expands: B, C, D are copied from front into cells 0, 1, 2, front = 0, rear = 3; then E goes into cell 3 and rear becomes 4.',
          lessons: ['05-queues'], skills: ['trace'], available_after: '05-queues', level: 3 },
        { source: { assignment: 3, question: 18 },
          q: 'An initially empty queue Q receives A, B, C, D in that order (that is, A was enqueued first and D was enqueued last). Execute: while Q is not empty, push( Q.dequeue() ) onto stack S; then while S is not empty, enqueue S.pop() into Q. Finally execute: Q.enqueue(Q.dequeue()) twice. What is Q from front to rear? (that is, read the answers from left to right)',
          options: ['A, B, C, D', 'C, D, A, B', 'B, A, D, C', 'D, C, B, A'], answer: 2, review: 4,
          why: 'S gets A, B, C, D with D on top, so popping gives D, C, B, A: the queue is reversed. Q.enqueue(Q.dequeue()) moves the front to the rear: once gives C, B, A, D; twice gives B, A, D, C. "D, C, B, A" stops after the reversal, and "C, D, A, B" rotates the original order.',
          lessons: ['03-stacks', '05-queues'], skills: ['trace'], available_after: '05-queues', level: 3 },
        { source: { assignment: 3, question: 19 },
          q: 'A circular queue of length 8 contains five items in FIFO order at indices 6, 7, 0, 1, and 2. It is resized to length 16 by copying the items in FIFO order into indices 0 through 4. front points to the next removal and rear to the next insertion. What should the new front and rear be?',
          options: ['front = 5, rear = 0', 'front = 6, rear = 3', 'front = 0, rear = 4', 'front = 0, rear = 5'], answer: 3, review: 38,
          why: 'After the copy the oldest item is at index 0, so front = 0. The items fill 0 to 4, so the next free cell is 5: rear = count = 5, exactly as expandCapacity does (front = 0; rear = count). "rear = 4" is the last used cell, not the next free one; "front = 6, rear = 3" are the old indexes.',
          lessons: ['05-queues'], skills: ['trace', 'design'], available_after: '05-queues', level: 3 },
        { q: 'A queue Q holds 6, 3, 8, 8, 1, 10 (front → rear). Two stacks, IN and OUT, start empty. Each value is dequeued from Q and goes on OUT if OUT is empty or the value is not smaller than OUT\'s top; otherwise it goes on IN. When Q is empty, IN is popped until it is empty, and each popped value is enqueued back into Q. What do Q and OUT hold now?',
          options: ['Q: 3, 1 · OUT holds 4 values', 'Q: 1, 3 · OUT holds 4 values', 'Q: 1, 8, 3 · OUT holds 3 values', 'Q: 3, 8, 1 · OUT holds 3 values'], answer: 1, review: 10,
          why: '6 → OUT. 3 is smaller than 6 → IN. 8 → OUT. The second 8 is not smaller than 8 → OUT. 1 → IN. 10 → OUT. So OUT = 6, 8, 8, 10 and IN = 3, 1 (1 on top). Popping IN gives 1, then 3, so Q = 1, 3. "Q: 1, 8, 3" treats the equal 8 as refused; "Q: 3, 1" forgets that popping reverses the order.',
          lessons: ['03-stacks', '05-queues'], skills: ['trace'], available_after: '05-queues', level: 3 }
      ],
      tasks: [
        {
          title: 'A queue made of two stacks',
          task: '<p>Write a class <code>TwoStackQueue</code> with two <code>java.util.Stack&lt;Integer&gt;</code> fields, <code>in</code> and <code>out</code>. <code>enqueue(int x)</code> pushes x on in. <code>dequeue()</code>: if out is empty, move <b>all</b> elements from in to out (pop from in, push on out); then pop and return the top of out. In main, run enqueue(10), enqueue(20), print dequeue(), enqueue(30), enqueue(40), then print dequeue() three times.</p>',
          starter: 'import java.util.Stack;\n\npublic class TwoStackQueue {\n  \n\n  public static void main(String[] args) {\n    \n  }\n}',
          output: '10\n20\n30\n40',
          checks: [
            { re: /Stack\s*<\s*Integer\s*>\s+in\s*=\s*new\s+Stack/, label: 'A field <code>Stack&lt;Integer&gt; in</code>', review: 4 },
            { re: /Stack\s*<\s*Integer\s*>\s+out\s*=\s*new\s+Stack/, label: 'A field <code>Stack&lt;Integer&gt; out</code>', review: 4 },
            { re: /void\s+enqueue\s*\(\s*int\s+\w+\s*\)\s*\{\s*in\.push\s*\(\s*\w+\s*\)\s*;/, label: '<code>enqueue</code> pushes on in', review: 4 },
            { re: /if\s*\(\s*out\.isEmpty\s*\(\s*\)\s*\)[\s\S]*while\s*\(\s*!\s*in\.isEmpty\s*\(\s*\)\s*\)\s*\{?\s*out\.push\s*\(\s*in\.pop\s*\(\s*\)\s*\)/, label: 'Moves everything from in to out, only when out is empty', review: 4 },
            { re: /return\s+out\.pop\s*\(\s*\)\s*;/, label: '<code>return out.pop();</code>', review: 4 }
          ],
          solution: 'import java.util.Stack;\n\npublic class TwoStackQueue {\n  private Stack<Integer> in = new Stack<>();\n  private Stack<Integer> out = new Stack<>();\n\n  public void enqueue(int x) {\n    in.push(x);\n  }\n\n  public int dequeue() {\n    if (out.isEmpty())\n      while (!in.isEmpty())\n        out.push(in.pop());\n    return out.pop();\n  }\n\n  public static void main(String[] args) {\n    TwoStackQueue q = new TwoStackQueue();\n    q.enqueue(10);\n    q.enqueue(20);\n    System.out.println(q.dequeue());\n    q.enqueue(30);\n    q.enqueue(40);\n    System.out.println(q.dequeue());\n    System.out.println(q.dequeue());\n    System.out.println(q.dequeue());\n  }\n}'
        },
        {
          title: 'dequeue for the circular ArrayQueue',
          task: '<p>Write <code>dequeue()</code> for the slides\' <code>ArrayQueue&lt;T&gt;</code> (fields <code>front</code>, <code>rear</code>, <code>count</code>, <code>array</code>). If the queue is empty, throw <code>new RuntimeException("Queue is empty\\n")</code>. Otherwise take the front element, clear its cell, move front forward <b>with wrap-around</b>, decrease count and return the element.</p>',
          starter: 'public T dequeue() throws RuntimeException {\n  \n}',
          checks: [
            { re: /if\s*\(\s*(count\s*==\s*0|isEmpty\s*\(\s*\))\s*\)\s*throw\s+new\s+RuntimeException\s*\(/, label: 'Throws a RuntimeException when the queue is empty', review: 39 },
            { re: /T\s+\w+\s*=\s*array\s*\[\s*front\s*\]\s*;/, label: 'Takes <code>array[front]</code>', review: 39 },
            { re: /array\s*\[\s*front\s*\]\s*=\s*null\s*;/, label: 'Clears the cell: <code>array[front] = null;</code>', review: 39 },
            { re: /front\s*=\s*\(\s*front\s*\+\s*1\s*\)\s*%\s*array\.length\s*;/, label: '<code>front = (front + 1) % array.length;</code>', review: 37 },
            { re: /count\s*--|count\s*-=\s*1|count\s*=\s*count\s*-\s*1/, label: 'Decreases count', review: 39 },
            { re: /return\s+\w+\s*;/, label: 'Returns the element', review: 39 }
          ],
          solution: 'public T dequeue() throws RuntimeException {\n  if (count == 0)\n    throw new RuntimeException("Queue is empty\\n");\n  T result = array[front];\n  array[front] = null;\n  front = (front + 1) % array.length;\n  count--;\n  return result;\n}'
        }
      ]
    }
  });
})();
