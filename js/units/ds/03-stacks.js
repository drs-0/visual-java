/* Data Structures · Unit 3 Stacks (34 slides): collections, linear and non-linear, abstraction, the Java Collections
   Framework, the stack and its operations (with two-stack ideas: a MIN stack for getMin, and IN/OUT stacks), postfix
   expressions evaluated with a stack, a generic Stack<T> interface, and ArrayStack<T> with expandCapacity.
   The parts follow the slide outline (slide 2). The unit exam questions are the question sample (do not change them). */
(function () {
  function L(src, frag, nth) { var ls = src.split('\n'), c = 0; for (var i = 0; i < ls.length; i++) if (ls[i].indexOf(frag) >= 0 && ++c === (nth || 1)) return i + 1; throw new Error('no line ' + frag); }
  function h(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function toks(s) { return String(s).trim().split(/[\s,]+/).filter(Boolean).slice(0, 10); }
  function isInt(t) { return /^-?\d{1,4}$/.test(t); }
  /* a stack drawn as a column inside walls: list[0] is the bottom. o: { h, label, top (draw the top pointer), hiTop } */
  function column(px, x, w, yb, list, o) {
    o = o || {};
    var hh = o.h || 26, out = [A(px + 'w1', x - 6, yb - 10 * hh - 8, x - 6, yb + 4, { head: false, tone: 'muted' }), A(px + 'w2', x + w + 6, yb - 10 * hh - 8, x + w + 6, yb + 4, { head: false, tone: 'muted' }), A(px + 'w3', x - 6, yb + 4, x + w + 6, yb + 4, { head: false, tone: 'muted' })];
    if (o.label) out.push(T(px + 'lb', x + w / 2, yb + 24, o.label, { anchor: 'middle', size: 13, bold: true, mono: true }));
    list.forEach(function (e, i) {
      var y = yb - (i + 1) * hh, top = i === list.length - 1;
      out.push(B(e.id, x, y, w, hh - 3, { title: e.t, mono: true, size: hh < 24 ? 11 : 13, tone: e.tone || (top && o.hiTop ? 'accent' : 'blue'), fill: top && o.hiTop ? 'solid' : 'soft', hi: top && o.hiTop, r: 4, from: e.from }));
    });
    if (o.top !== false) {
      var ty = list.length ? yb - list.length * hh + (hh - 3) / 2 : yb - hh / 2;
      out.push(P(px + 'tp', x - 8, ty, list.length ? 'top' : 'empty', { dir: 'right', len: 22 }));
    }
    return out;
  }

  /* ---------- 1. collections, abstraction and the framework (slides 3-7) ---------- */
  var collect = {
    id: 'collect', slides: [3, 7], title: 'How a collection is organized, and who can see inside',
    steps: [
      { slide: 3, ph: 'coll', cap: 'A <b>collection</b> is an object that holds other objects, its <b>elements</b>, and gives operations to add, remove and look at them.' },
      { slide: 4, ph: 'lin', cap: '<b>Linear</b> collection: the elements are in a line. Each one has (at most) one element before it and one after it.' },
      { slide: 4, ph: 'non', cap: '<b>Non-linear</b> collection: an element can be linked to several others, like this tree. The organization is not a line.' },
      { slide: 5, ph: 'abs', cap: '<b>Abstraction</b>: the <b>interface</b> in the middle lists the operations. The class on the left only uses these operations.' },
      { slide: 5, ph: 'hide', cap: 'The class on the right <b>implements</b> the interface. Its data is <b>private</b> (hidden): the user cannot see or touch it.' },
      { slide: 5, ph: 'call', cap: 'The user calls push("A") through the interface; the implementing class does the work on its private data. The user never needs to know how.' },
      { slide: 6, ph: 'api', cap: 'Java comes with a large library of classes, the <b>Java API</b>. The classes for collections are the <b>Java Collections API</b>. We will use them, and also write our own.' },
      { slide: 7, ph: 'fw', cap: 'In the framework, <b>Stack</b> is an old (legacy) class that extends <b>Vector</b>, which implements <b>List</b>. In this unit we write our own stack.' }
    ],
    draw: function (k, s) {
      var items = [], i;
      if (s.ph === 'coll') {
        items.push(B('cbox', 140, 60, 280, 170, { tone: 'blue', tag: 'a collection (an object)', r: 14 }));
        ['A', 'B', 'C', 'D'].forEach(function (x, i) { items.push(B('el' + i, 166 + i * 64, 120, 50, 44, { title: x, mono: true, size: 16, tone: 'teal' })); });
        ['add', 'remove', 'look'].forEach(function (x, i) { items.push(B('op' + i, 140 + i * 100, 270, 80, 32, { title: x, mono: true, size: 13, tone: 'accent', shape: 'oval' })); items.push(A('opa' + i, 180 + i * 100, 270, 180 + i * 100 + (1 - i) * 20, 232, { tone: 'accent' })); });
        return items;
      }
      if (s.ph === 'lin' || s.ph === 'non') {
        for (i = 0; i < 6; i++) items.push(B('ln' + i, 40, 22 + i * 50, 70, 38, { tone: s.ph === 'lin' ? 'accent' : 'muted', o: s.ph === 'lin' ? 1 : 0.4 }));
        for (i = 1; i < 6; i++) items.push(A('la' + i, 75, 22 + (i - 1) * 50 + 38, 75, 22 + i * 50, { tone: 'muted', head: false, o: s.ph === 'lin' ? 1 : 0.4 }));
        var T3 = [[330, 30], [240, 110], [420, 110], [190, 190], [290, 190], [380, 190], [470, 190], [240, 270], [340, 270]], par = [-1, 0, 0, 1, 1, 2, 2, 4, 4];
        T3.forEach(function (p, i) {
          items.push(B('tn' + i, p[0] - 32, p[1], 64, 36, { tone: s.ph === 'non' ? 'accent' : 'muted', o: s.ph === 'non' ? 1 : 0.4 }));
          if (par[i] >= 0) items.push(A('ta' + i, T3[par[i]][0], T3[par[i]][1] + 36, p[0], p[1], { tone: 'muted', head: false, o: s.ph === 'non' ? 1 : 0.4 }));
        });
        items.push(T('l1', 75, 334, 'linear', { anchor: 'middle', size: 13, bold: true, tone: s.ph === 'lin' ? 'accent' : 'muted' }));
        items.push(T('l2', 330, 334, 'non-linear', { anchor: 'middle', size: 13, bold: true, tone: s.ph === 'non' ? 'accent' : 'muted' }));
        return items;
      }
      if (s.ph === 'abs' || s.ph === 'hide' || s.ph === 'call') {
        items.push(B('user', 20, 80, 160, 190, { title: 'Class that\nuses the\ncollection', size: 14, band: true, tone: s.ph === 'abs' || s.ph === 'call' ? 'accent' : 'blue', r: 14 }));
        items.push(B('wall', 270, 40, 14, 270, { tone: 'blue', fill: 'solid', r: 2, tag: 'interface' }));
        ['push', 'pop', 'peek', 'isEmpty', 'size'].forEach(function (m, i) {
          var on = s.ph === 'call' && i === 0;
          items.push(B('plug' + i, 196, 64 + i * 48, 70, 30, { title: m + '()', mono: true, size: 11, tone: on ? 'accent' : 'teal', fill: on ? 'solid' : 'soft', hi: on, shape: 'oval' }));
        });
        items.push(B('impl', 340, 80, 200, 190, { title: 'Class that\nimplements the\ncollection', size: 14, band: true, tone: s.ph === 'hide' ? 'accent' : 'blue', r: 14 }));
        if (s.ph !== 'abs') items.push(B('priv', 356, 210, 168, 48, { title: 'private T[] array;\nprivate int top;', mono: true, size: 11, tone: 'red', dash: true, tag: 'hidden data' }));
        if (s.ph === 'call') {
          items.push(A('c1', 180, 100, 196, 79, { tone: 'accent' }));
          items.push(T('c1l', 100, 296, 'calls push("A")', { anchor: 'middle', mono: true, size: 13, bold: true, tone: 'accent' }));
          items.push(A('c2', 284, 79, 400, 210, { tone: 'accent', dash: true }));
        }
        return items;
      }
      if (s.ph === 'api') {
        items.push(B('api', 60, 50, 440, 240, { tone: 'muted', tag: 'Java API: a large library of classes', r: 14 }));
        ['String', 'Scanner', 'Math', 'Random', 'Integer', 'System'].forEach(function (c, i) { items.push(B('ac' + i, 80 + (i % 3) * 140, 70 + Math.floor(i / 3) * 50, 120, 36, { title: c, mono: true, size: 12, tone: 'muted' })); });
        items.push(B('capi', 80, 180, 400, 90, { tone: 'accent', tag: 'Java Collections API', r: 10 }));
        ['ArrayList', 'LinkedList', 'Stack', 'HashMap'].forEach(function (c, i) { items.push(B('cc' + i, 92 + i * 96, 212, 88, 36, { title: c, mono: true, size: 11.5, tone: 'accent' })); });
        return items;
      }
      var fw = [['Collection', 220, 30, 'blue'], ['List', 220, 110, 'blue'], ['Vector', 220, 190, 'muted'], ['Stack', 220, 270, 'accent'], ['ArrayList', 400, 190, 'teal'], ['LinkedList', 40, 190, 'teal']];
      fw.forEach(function (f) { items.push(B('fw' + f[0], f[1], f[2], 120, 36, { title: f[0], mono: true, size: 13, tone: f[3], fill: f[3] === 'accent' ? 'solid' : 'soft', hi: f[3] === 'accent' })); });
      items.push(A('f1', 280, 110, 280, 66, { tone: 'muted' }));
      items.push(A('f2', 280, 190, 280, 146, { tone: 'muted', dash: true }));
      items.push(A('f3', 280, 270, 280, 226, { tone: 'muted' }));
      items.push(A('f4', 460, 190, 330, 146, { tone: 'muted', dash: true }));
      items.push(A('f5', 100, 190, 230, 146, { tone: 'muted', dash: true }));
      items.push(T('fl', 360, 292, '← legacy class', { size: 12, tone: 'muted' }));
      return items;
    }
  };

  /* ---------- 2. stack operations, and two-stack designs (slides 8-10) ---------- */
  /* m = 1: one java.util.Stack · 2: getMin with a MIN stack · 3: IN and OUT stacks */
  function stackRun(v) {
    var m = Math.min(3, Math.max(1, Math.trunc(v.m))), tk = toks(v.ops), code = [], ops = [];
    if (m === 1) {
      var allInt = tk.every(function (t) { return !/^(-|pop|\?|peek|size|empty|isEmpty)$/.test(t) ? isInt(t) : true; });
      var ty = allInt ? 'Integer' : 'String';
      code.push('import java.util.Stack;', '', 'Stack<' + ty + '> stack = new Stack<>();');
      tk.forEach(function (t) {
        var o = /^(-|pop)$/.test(t) ? { k: 'pop' } : /^(\?|peek)$/.test(t) ? { k: 'peek' } : t === 'size' ? { k: 'size' } : /^(empty|isEmpty)$/.test(t) ? { k: 'empty' } : { k: 'push', x: t.slice(0, 6) };
        o.line = code.length + 1;
        code.push(o.k === 'push' ? 'stack.push(' + (allInt ? o.x : '"' + o.x + '"') + ');' : o.k === 'empty' ? 'System.out.println(stack.isEmpty());' : 'System.out.println(stack.' + o.k + '());');
        ops.push(o);
      });
    } else if (m === 2) {
      code = ('import java.util.Stack;\n\npublic class MinStack {\n  private Stack<Integer> stack = new Stack<>();\n  private Stack<Integer> min = new Stack<>();   // MIN: the minimums\n\n  public void push(int x) {\n    stack.push(x);\n    if (min.isEmpty() || x <= min.peek()) min.push(x);\n  }\n\n  public int pop() {\n    int x = stack.pop();\n    if (x == min.peek()) min.pop();\n    return x;\n  }\n\n  public int getMin() {\n    return min.peek();   // O(1): just look at the top of MIN\n  }\n}\n\n// in main:\nMinStack s = new MinStack();').split('\n');
      tk.forEach(function (t) {
        var o = /^(-|pop)$/.test(t) ? { k: 'pop' } : /^(\?|min|getMin)$/.test(t) ? { k: 'min' } : isInt(t) ? { k: 'push', x: +t } : null;
        if (!o) return;
        o.line = code.length + 1;
        code.push(o.k === 'push' ? 's.push(' + o.x + ');' : o.k === 'pop' ? 'System.out.println(s.pop());' : 'System.out.println(s.getMin());');
        ops.push(o);
      });
    } else {
      code = ('import java.util.Stack;\n\npublic class TwoStacks {\n  private Stack<Integer> in = new Stack<>();    // IN: takes any value\n  private Stack<Integer> out = new Stack<>();   // OUT: never a value smaller than its top\n\n  public void arrive(int x) {\n    if (out.isEmpty() || x >= out.peek()) out.push(x);\n    else in.push(x);\n  }\n\n  public void move() {   // the top of OUT goes on IN\n    in.push(out.pop());\n  }\n}\n\n// in main:\nTwoStacks t = new TwoStacks();').split('\n');
      tk.forEach(function (t) {
        var o = /^(>|move)$/.test(t) ? { k: 'move' } : isInt(t) ? { k: 'arrive', x: +t } : null;
        if (!o) return;
        o.line = code.length + 1;
        code.push(o.k === 'move' ? 't.move();' : 't.arrive(' + o.x + ');');
        ops.push(o);
      });
    }
    return { m: m, code: code.join('\n'), ops: ops };
  }
  var EMPTY = 'Exception in thread "main" java.util.EmptyStackException';
  var stackops = {
    id: 'stackops', slides: [8, 10], title: 'Push, pop, peek: always at the top',
    code: function (v) { return stackRun(v).code; },
    inputs: [{ id: 'ops', type: 'text', label: 'operations', value: 'A B C - D ? -', maxlen: 40 }, { id: 'm', label: 'stacks', value: 1, min: 1, max: 3 }],
    inputsLabel: 'Type values to push, <code>-</code> for pop, <code>?</code> for peek (or getMin). stacks: 1 = one stack, 2 = with a MIN stack, 3 = IN and OUT.',
    presets: [{ label: 'push and pop', values: { ops: 'A B C - D ? -', m: 1 } }, { label: 'pop too many', values: { ops: 'A B - - -', m: 1 } }, { label: 'size, isEmpty', values: { ops: '7 3 size - - empty', m: 1 } },
      { label: 'getMin (MIN stack)', values: { ops: '5 3 7 3 1 ? - ? - ?', m: 2 } }, { label: 'IN / OUT', values: { ops: '5 8 3 9 6 > 7', m: 3 } }],
    steps: function (v) {
      var R = stackRun(v), m = R.m, st = [], A1 = [], A2 = [], n = 0;
      var cl = R.code.split('\n'), decl = m === 1 ? 3 : cl.length - (R.ops.length);
      var snap = function (o) { o.a = A1.slice(); o.b = A2.slice(); return o; };
      st.push(snap({ slide: 8, line: decl, cap: 'A <b>stack</b> is <b>last in, first out</b> (LIFO): like a stack of books, you can only add or take a book at the <b>top</b>.' }));
      st.push(snap({ slide: 9, line: decl, cap: 'A stack is usually drawn standing up. The <b>top</b> is the only end where elements are added and removed. ' + (m === 1 ? 'The stack starts empty.' : m === 2 ? 'Here a second stack, <b>MIN</b>, remembers the minimums.' : 'Here there are two stacks: <b>IN</b> takes any value; <b>OUT</b> never takes a value smaller than its top.') }));
      if (!R.ops.length) { st.push(snap({ slide: 10, line: decl, cap: 'Type some operations above to see them run.' })); return st; }
      for (var i = 0; i < R.ops.length; i++) {
        var o = R.ops[i], s = { slide: 10, line: o.line };
        if (m === 1) {
          if (o.k === 'push') { A1.push({ id: 'e' + n++, t: o.x }); s.cap = '<b>push(' + h(o.x) + ')</b>: ' + h(o.x) + ' goes on the top. size = ' + A1.length + '.'; s.fresh = true; }
          else if (o.k === 'size') { s.cap = '<b>size()</b> counts the elements: ' + A1.length + '.'; s.out = String(A1.length); }
          else if (o.k === 'empty') { s.cap = '<b>isEmpty()</b>: ' + (A1.length ? 'false, there are ' + A1.length + ' element' + (A1.length > 1 ? 's' : '') + '.' : 'true, the stack has no elements.'); s.out = String(!A1.length); }
          else if (!A1.length) { s.cap = '<b>' + o.k + '()</b> on an <b>empty</b> stack: there is no top element, so Java throws an exception and the program stops. (Our own ArrayStack in slide 32 throws a RuntimeException.)'; s.out = EMPTY; s.err = true; st.push(snap(s)); break; }
          else if (o.k === 'pop') { var e = A1.pop(); s.res = e; s.resLb = 'pop() returned'; s.cap = '<b>pop()</b> removes the top element, ' + h(e.t) + ', and returns it. The element under it is the new top.'; s.out = e.t; }
          else { s.peek = A1[A1.length - 1]; s.resLb = 'peek() returned'; s.cap = '<b>peek()</b> returns the top element, ' + h(s.peek.t) + ', <b>without removing it</b>. The stack does not change.'; s.out = s.peek.t; }
        } else if (m === 2) {
          if (o.k === 'push') {
            var toMin = !A2.length || o.x <= +A2[A2.length - 1].t; A1.push({ id: 'e' + n, t: String(o.x) }); if (toMin) A2.push({ id: 'm' + n, t: String(o.x), tone: 'teal' }); n++;
            s.line = o.line + ',' + L(R.code, 'stack.push(x)') + '-' + L(R.code, 'min.push(x)');
            s.cap = '<b>push(' + o.x + ')</b> on the main stack. ' + (toMin ? (A2.length === 1 ? 'MIN is empty' : o.x + ' ≤ ' + A2[A2.length - 2].t + ' (top of MIN)') + ', so ' + o.x + ' is pushed on MIN too.' : o.x + ' > ' + A2[A2.length - 1].t + ' (top of MIN): MIN does not change.');
          } else if (!A1.length || (o.k === 'min' && !A2.length)) { s.cap = (o.k === 'pop' ? '<b>pop()</b>' : '<b>getMin()</b>') + ' with no elements: <code>' + (o.k === 'pop' ? 'stack.pop()' : 'min.peek()') + '</code> throws an exception and the program stops.'; s.line = o.line + ',' + L(R.code, o.k === 'pop' ? 'int x = stack.pop()' : 'return min.peek()'); s.out = EMPTY; s.err = true; st.push(snap(s)); break; }
          else if (o.k === 'pop') {
            var x = A1.pop(), same = x.t === A2[A2.length - 1].t; s.res = x; s.resLb = 'pop() returned';
            var mx = same ? A2.pop() : null; s.gone = mx;
            s.line = o.line + ',' + L(R.code, 'int x = stack.pop()') + '-' + L(R.code, 'return x;');
            s.cap = '<b>pop()</b> removes ' + x.t + '. ' + (same ? 'It equals the top of MIN, so MIN is popped too.' : 'The top of MIN is ' + A2[A2.length - 1].t + ', not ' + x.t + ': MIN does not change.'); s.out = x.t;
          } else { s.peek = A2[A2.length - 1]; s.resLb = 'getMin() returned'; s.line = o.line + ',' + L(R.code, 'return min.peek()'); s.cap = '<b>getMin()</b> just peeks at the top of MIN: <b>' + s.peek.t + '</b>. No search through the stack, so it is O(1).'; s.out = s.peek.t; }
        } else {
          if (o.k === 'arrive') {
            var ok = !A2.length || o.x >= +A2[A2.length - 1].t;
            s.line = o.line + ',' + L(R.code, ok ? 'out.push(x)' : 'else in.push(x)');
            s.cap = o.x + ' arrives. ' + (!A2.length ? 'OUT is empty, so it goes on <b>OUT</b>.' : ok ? o.x + ' ≥ ' + A2[A2.length - 1].t + ' (top of OUT), so it goes on <b>OUT</b>.' : o.x + ' < ' + A2[A2.length - 1].t + ' (top of OUT): OUT refuses it, so it goes on <b>IN</b>.');
            (ok ? A2 : A1).push({ id: 'e' + n++, t: String(o.x) }); s.fresh = true;
          } else if (!A2.length) { s.cap = '<b>move()</b> with OUT empty: <code>out.pop()</code> throws an exception and the program stops.'; s.line = o.line + ',' + L(R.code, 'in.push(out.pop())'); s.out = EMPTY; s.err = true; st.push(snap(s)); break; }
          else { var mv = A2.pop(); A1.push(mv); s.line = o.line + ',' + L(R.code, 'in.push(out.pop())'); s.cap = '<b>move()</b>: pop ' + mv.t + ' from OUT and push it on IN. Moving elements one by one <b>reverses</b> their order.'; s.moved = mv; }
        }
        st.push(snap(s));
      }
      var last = st[st.length - 1];
      if (!last.err) st.push(snap({ slide: 10, line: R.ops[R.ops.length - 1].line, end: true, cap: m === 1 ? 'Done. The last element pushed is always the first one out: <b>LIFO</b>. ' + (A1.length ? 'Top now: ' + h(A1[A1.length - 1].t) + ', size ' + A1.length + '.' : 'The stack is empty again.') : m === 2 ? 'Every push and pop also updates MIN, so the top of MIN is always the smallest value in the stack' + (A2.length ? ': now ' + A2[A2.length - 1].t + '.' : '.') : 'IN (bottom → top): ' + (A1.map(function (e) { return e.t; }).join(', ') || 'empty') + ' · OUT: ' + (A2.map(function (e) { return e.t; }).join(', ') || 'empty') + '.' }));
      return st;
    },
    draw: function (k, s, v) {
      var m = Math.min(3, Math.max(1, Math.trunc(v.m))), items = [], fr = s.fresh;
      var mark = function (list) { return list.map(function (e, i) { return i === list.length - 1 && fr ? { id: e.id, t: e.t, tone: e.tone, from: [0, -60] } : e; }); };
      if (m === 1) {
        items = items.concat(column('s', 190, 140, 300, mark(s.a), { label: 'stack', hiTop: !!s.peek || fr }));
        items.push(T('sz', 400, 60, 'size() = ' + s.a.length, { mono: true, size: 15, bold: true }));
        items.push(T('em', 400, 88, 'isEmpty() = ' + !s.a.length, { mono: true, size: 13, tone: 'muted' }));
      } else {
        items = items.concat(column('s', 70, 130, 300, mark(s.a), { label: m === 2 ? 'stack' : 'IN', hiTop: fr && m === 3 }));
        items = items.concat(column('n', 290, 130, 300, m === 2 ? s.b : mark(s.b), { label: m === 2 ? 'MIN' : 'OUT', hiTop: m === 2 ? !!s.peek : fr }));
        if (m === 2 && s.b.length) items.push(T('mn', 490, 60, 'min = ' + s.b[s.b.length - 1].t, { anchor: 'middle', mono: true, size: 14, bold: true, tone: 'teal' }));
      }
      if (s.res) items.push(B(s.res.id, 420, 170, 120, 40, { title: s.res.t, mono: true, size: 15, tone: 'accent', fill: 'solid', hi: true, tag: s.resLb }));
      if (s.gone) items.push(B(s.gone.id, 420, 250, 120, 30, { title: s.gone.t, mono: true, size: 13, tone: 'teal', dash: true, tag: 'MIN popped too', o: 0.6 }));
      if (s.peek) items.push(B('pk', 420, 170, 120, 40, { title: s.peek.t, mono: true, size: 15, tone: 'teal', fill: 'solid', hi: true, tag: s.resLb }));
      if (s.err) items.push(T('er', 470, 190, 'empty!', { anchor: 'middle', size: 18, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* ---------- 3. evaluating postfix expressions (slides 12-20) ---------- */
  var PC = '// Evaluates the specified postfix expression.\npublic int evaluate(String expr) {\n  int op1, op2, result = 0;\n  String token;\n  Scanner parser = new Scanner(expr);\n  while (parser.hasNext()) {\n    token = parser.next();\n    if (isOperator(token)) {               // if token is + - * or /\n      op2 = stack.pop();                   // pop 2nd Integer operand\n      op1 = stack.pop();                   // pop 1st Integer operand\n      result = evaluateSingleOperator(token.charAt(0), op1, op2);\n      stack.push(result);                  // push int result on the stack\n    }\n    else                                   // token is an integer operand\n      stack.push(Integer.valueOf(token))); // push Integer operand\n  }\n  return result;                           // return final expression result\n}\n\nprivate boolean isOperator(String token) {\n  return ( token.equals("+") ||\n           token.equals("-") ||\n           token.equals("*") ||\n           token.equals("/") );\n}\n\nprivate int evaluateSingleOperator(char operation, int op1, int op2) {\n  int result = 0;\n  switch (operation) {\n    case ADD:      result = op1 + op2; break;\n    case SUBTRACT: result = op1 - op2; break;\n    case MULTIPLY: result = op1 * op2; break;\n    case DIVIDE:   result = op1 / op2;\n  }\n  return result;\n}';
  var OPL = { '+': 'case ADD', '-': 'case SUBTRACT', '*': 'case MULTIPLY', '/': 'case DIVIDE' };
  var postfix = {
    id: 'postfix', slides: [12, 20], title: 'A stack evaluates a postfix expression', code: PC,
    inputs: [{ id: 'e', type: 'text', label: 'postfix expression', value: '7 4 -3 * 1 5 + / *', minlen: 1, maxlen: 40 }],
    presets: [{ label: 'slide 14', values: { e: '7 4 -3 * 1 5 + / *' } }, { label: 'slide 13', values: { e: '3 4 * 2 5 + - 4 * 2 /' } }, { label: '4 5 2 * +', values: { e: '4 5 2 * +' } }, { label: '9 3 - (order)', values: { e: '9 3 -' } },
      { label: '5 + (missing operand)', values: { e: '5 +' } }, { label: '5 4 (no operator)', values: { e: '5 4' } }, { label: '8 0 /', values: { e: '8 0 /' } }],
    steps: function (v) {
      var tk = String(v.e).trim().split(/\s+/).filter(Boolean).slice(0, 16), st = [], stack = [], n = 0, result = 0, first = true;
      var snap = function (o) { o.st = stack.slice(); o.tk = tk; o.result = result; return o; };
      st.push(snap({ slide: 12, line: 2, i: -1, ph: 'intro', cap: '<b>Infix</b> puts the operator between the operands: 12 – 7. <b>Postfix</b> puts it after them: 12 7 –.' }));
      st.push(snap({ slide: 13, line: 2, i: -1, ph: 'prec', cap: 'Infix needs precedence rules and parentheses: 4 + 5 * 2 = 14. In postfix, 4 5 2 * + already says that * comes first. <b>No parentheses</b> are needed.' }));
      st.push(snap({ slide: 14, line: '6-7', i: -1, cap: 'The rule: scan left to right. An <b>operand</b>: push it. An <b>operator</b>: pop two, compute, push the result. At the end the value is on top of the stack.' }));
      st.push(snap({ slide: 16, line: '3-5', i: -1, cap: 'PostfixEvaluator’s constructor made an empty Stack&lt;Integer&gt;. evaluate starts with result = 0 and a Scanner that reads the tokens of “' + h(tk.join(' ')) + '”.' }));
      for (var i = 0; i < tk.length; i++) {
        var t = tk[i], isOp = /^[-+*/]$/.test(t);
        if (!isOp) {
          if (!/^-?\d+$/.test(t)) { st.push(snap({ slide: 17, line: '7,15', i: i, err: true, cap: '“' + h(t) + '” is not an operator and not a whole number: Integer.valueOf throws a NumberFormatException.', out: 'Exception: java.lang.NumberFormatException: For input string: "' + t + '"' })); return st; }
          stack.push({ id: 'v' + n++, t: String(Number(t)) });
          st.push(snap({ slide: 14, line: '7,15', i: i, fresh: true, cap: '“' + h(t) + '” is an operand: <b>push</b> it.' + (t.charAt(0) === '-' ? ' (-3 is a negative number, not the operator -: the token is not exactly "-".)' : '') }));
          continue;
        }
        if (first) { st.push(snap({ slide: 18, line: '8,20-25', i: i, cap: '“' + t + '”: isOperator(token) is true, because the token equals "+", "-", "*" or "/".' })); first = false; }
        if (stack.length < 2) {
          var only = stack.pop();
          st.push(snap({ slide: 17, line: stack.length || only ? 10 : 9, i: i, err: true, cap: 'The operator “' + t + '” needs two operands, but the stack has ' + (only ? 'only one (' + only.t + ')' : 'none') + '. stack.pop() on an empty stack throws an exception.', out: 'Exception in thread "main" java.util.EmptyStackException' }));
          return st;
        }
        var b = stack.pop(), a = stack.pop();
        st.push(snap({ slide: 17, line: '9-10', i: i, op1: a, op2: b, cap: '“' + t + '”: pop the top into <b>op2 = ' + b.t + '</b>, then the next into <b>op1 = ' + a.t + '</b>. The first pop is the <b>second</b> operand.' }));
        if (t === '/' && +b.t === 0) { st.push(snap({ slide: 19, line: '11,' + L(PC, 'case DIVIDE'), i: i, op1: a, op2: b, err: true, cap: 'op1 / op2 = ' + a.t + ' / 0: division by zero throws an ArithmeticException.', out: 'Exception in thread "main" java.lang.ArithmeticException: / by zero' })); return st; }
        var r = t === '+' ? +a.t + +b.t : t === '-' ? a.t - b.t : t === '*' ? a.t * b.t : Math.trunc(a.t / b.t);
        result = r;
        var nv = { id: 'v' + n++, t: String(r) };
        stack.push(nv);
        st.push(snap({ slide: i === tk.length - 1 || t !== '/' ? 17 : 19, line: '11-12,' + L(PC, OPL[t]), i: i, op1: a, op2: b, calc: a.t + ' ' + t + ' ' + b.t + ' = ' + r, fresh: true, cap: 'evaluateSingleOperator computes op1 ' + t + ' op2 = ' + a.t + ' ' + t + ' ' + b.t + ' = <b>' + r + '</b>' + (t === '/' && a.t % b.t ? ' (int division drops the part after the point)' : '') + '. Push the result.' }));
      }
      var endCap = stack.length === 1 ? 'No tokens left. evaluate returns result = <b>' + result + '</b>, the value on top of the stack.' : stack.length === 0 ? 'No tokens at all: result stays 0.' : 'No tokens left, but ' + stack.length + ' values are still on the stack: the expression is missing an operator. evaluate returns result = <b>' + result + '</b>' + (result === 0 ? ' (its first value, because no operator ever ran)' : '') + ': a wrong answer, not an error.';
      st.push(snap({ slide: 15, line: L(PC, 'return result;   '), i: tk.length, end: true, warn: stack.length !== 1, cap: endCap, out: 'That expression equals ' + result }));
      return st;
    },
    draw: function (k, s) {
      var items = [], tk = s.tk, cw = Math.min(46, Math.floor(530 / Math.max(tk.length, 1))), x0 = 280 - tk.length * cw / 2;
      if (s.ph === 'intro' || s.ph === 'prec') {
        var rows = s.ph === 'intro' ? [['infix', '12 – 7'], ['postfix', '12 7 –']] : [['infix', '4 + 5 * 2 = 4 + (5*2) = 14'], ['postfix', '4 5 2 * +'], ['infix', '(3 * 4 – (2 + 5)) * 4 / 2'], ['postfix', '3 4 * 2 5 + – 4 * 2 /']];
        rows.forEach(function (r, i) {
          items.push(T('rk' + i, 110, 70 + i * 60, r[0], { anchor: 'end', size: 14, bold: true, tone: r[0] === 'postfix' ? 'accent' : 'blue' }));
          items.push(B('rv' + i, 124, 46 + i * 60, 420, 38, { title: r[1], mono: true, size: 14, tone: r[0] === 'postfix' ? 'accent' : 'blue', align: 'left' }));
        });
        if (s.ph === 'intro') items.push(T('ru', 280, 220, '<operand> operator <operand>   →   <operand> <operand> operator', { anchor: 'middle', size: 12, mono: true, tone: 'muted' }));
        return items;
      }
      tk.forEach(function (t, i) {
        var cur = i === s.i, done = i < s.i;
        items.push(B('tk' + i, x0 + i * cw, 10, cw - 4, 34, { title: t, mono: true, size: cw < 34 ? 11 : 14, tone: cur ? (s.err ? 'red' : 'accent') : done ? 'muted' : 'blue', fill: cur ? 'solid' : 'soft', hi: cur, o: done ? 0.45 : 1 }));
      });
      items = items.concat(column('s', 80, 110, 300, s.st.map(function (e, j) { return j === s.st.length - 1 && s.fresh ? { id: e.id, t: e.t, from: [0, -60] } : e; }), { label: 'stack', h: 26, hiTop: s.fresh || s.end }));
      if (s.op1) {
        items.push(B(s.op1.id, 250, 110, 100, 40, { title: s.op1.t, mono: true, size: 15, tone: 'teal', tag: 'op1 (2nd pop)' }));
        items.push(B(s.op2.id, 400, 110, 100, 40, { title: s.op2.t, mono: true, size: 15, tone: 'teal', tag: 'op2 (1st pop)' }));
      }
      if (s.calc) items.push(T('calc', 375, 200, s.calc, { anchor: 'middle', mono: true, size: 17, bold: true, tone: 'accent' }));
      items.push(T('res', 250, 290, 'result = ' + s.result, { mono: true, size: 15, bold: true, tone: s.end ? (s.warn ? 'red' : 'teal') : 'muted' }));
      if (s.err) items.push(T('er', 375, 250, 'exception!', { anchor: 'middle', size: 17, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* ---------- 4. the generic Stack<T> interface (slides 22-24) ---------- */
  var IC = 'package mystack;\n\n// Interface of a stack collection\npublic interface Stack<T> {\n   // Adds element on top of this stack\n   void push(T element);\n   // Removes and returns the top element\n   T pop();\n   // Returns the element on top of the stack without removing it\n   T peek();\n   // Returns true if this stack contains no elements\n   boolean isEmpty();\n   // Returns the number of elements in this stack\n   int size();\n   // Returns a string representation of this stack\n   String toString();\n}';
  var METH = [['push(T element) : void', 'void push(T element)'], ['pop() : T', 'T pop()'], ['peek() : T', 'T peek()'], ['isEmpty() : boolean', 'boolean isEmpty()'], ['size() : int', 'int size()'], ['toString() : String', 'String toString()']];
  var iface = {
    id: 'iface', slides: [22, 24], title: 'One interface, any element type T', code: IC,
    inputs: [{ id: 't', type: 'text', label: 'T =', value: 'Integer', minlen: 1, maxlen: 12 }],
    presets: [{ label: 'Integer', values: { t: 'Integer' } }, { label: 'String', values: { t: 'String' } }, { label: 'Student', values: { t: 'Student' } }],
    steps: function (v) {
      var T0 = String(v.t).replace(/[^\w]/g, '') || 'Integer', st = [];
      st.push({ slide: 22, line: '1,4', on: -1, cap: 'We write our <b>own</b> Stack, in the package <code>mystack</code>. A Java <b>interface</b> gives each method’s signature, without a body.' });
      METH.forEach(function (mm, i) { st.push({ slide: 23, line: L(IC, mm[1]) - 1 + '-' + L(IC, mm[1]), on: i, cap: '<code>' + h(mm[1]) + '</code>: ' + ['adds an element on top.', 'removes and returns the top element.', 'returns the top element <b>without removing it</b>.', 'true when there are no elements.', 'the number of elements.', 'a String that shows the stack (not a usual stack operation).'][i] }); });
      st.push({ slide: 24, line: 4, on: -1, uml: true, cap: 'The UML box: the dashed box at the corner shows the <b>generic type T</b>; the middle part is empty because an interface has <b>no data members</b>; the bottom lists the public methods.' });
      st.push({ slide: 22, line: '4,6,8', on: -1, bind: T0, cap: 'T is a <b>placeholder</b>. <code>Stack&lt;' + h(T0) + '&gt;</code> fills it in: push takes a ' + h(T0) + ', pop and peek return a ' + h(T0) + '. The same interface works for any class type.' });
      return st;
    },
    draw: function (k, s) {
      var items = [], tt = s.bind || 'T';
      items.push(B('uml', 120, 40, 300, 270, { tone: 'blue', r: 4 }));
      items.push(T('ust', 270, 66, '<<interface>>', { anchor: 'middle', size: 12, tone: 'muted' }));
      items.push(T('unm', 270, 88, 'Stack', { anchor: 'middle', size: 17, bold: true }));
      items.push(A('us1', 120, 100, 420, 100, { head: false, tone: 'muted' }));
      items.push(A('us2', 120, 124, 420, 124, { head: false, tone: 'muted' }));
      if (s.uml) items.push(T('und', 270, 117, 'no data members', { anchor: 'middle', size: 11, tone: 'accent', italic: true }));
      METH.forEach(function (mm, i) {
        var txt = mm[0].replace(/\bT\b/g, tt);
        items.push(B('um' + i, 136, 136 + i * 28, 268, 24, { title: txt, mono: true, size: 12, tone: i === s.on ? 'accent' : s.bind && /\bT\b/.test(mm[0]) ? 'teal' : 'muted', fill: i === s.on ? 'solid' : 'soft', hi: i === s.on, align: 'left' }));
      });
      items.push(B('ut', 380, 16, s.bind ? Math.max(60, 12 + 9 * tt.length) : 50, 40, { title: tt, mono: true, size: 15, tone: s.uml || s.bind ? 'accent' : 'blue', dash: true, hi: !!(s.uml || s.bind) }));
      if (s.bind) items.push(T('ub', 270, 330, 'Stack<' + tt + '> s = new ArrayStack<>();', { anchor: 'middle', mono: true, size: 13, bold: true, tone: 'teal' }));
      return items;
    }
  };

  /* ---------- 5. ArrayStack<T>: an array, top, and expandCapacity (slides 25-34) ---------- */
  var AC = 'package mystack;\nimport java.util.Arrays;\n// An array implementation of a generic stack in which the\n// bottom of the stack is fixed at index 0.\npublic class ArrayStack<T> implements Stack<T> {\n  private final static int DEFAULT_CAPACITY = 100;\n  private int top;\n  private T[] array;\n\n  // Creates an empty stack using the default capacity.\n  public ArrayStack() {\n    this(DEFAULT_CAPACITY);\n  }\n  // Creates an empty stack using the specified capacity.\n  // initialCapacity is the initial capacity of the array\n  public ArrayStack(int initialCapacity) {\n    top = 0;\n    array = (T[]) new Object[initialCapacity];\n  }\n  // Adds the specified element to the top of this stack, expanding\n  // the capacity of the array if necessary.\n  public void push(T element) {\n    if (size() == array.length) expandCapacity();\n    array[top] = element;\n    top++;\n  }\n  // Creates a new array to store the contents of this stack with\n  // twice the capacity of the old one.\n  private void expandCapacity() {\n    array = Arrays.copyOf(array, array.length * 2);\n  }\n  // Removes and returns the element at the top of this stack.\n  // throws RuntimeException if stack is empty.\n  public T pop() throws RuntimeException {\n    if (isEmpty()) throw new RuntimeException("Stack is empty\\n");\n    top--;\n    T result = array[top];\n    array[top] = null;\n    return result;\n  }\n  // Returns a reference to the element at the top of this stack.\n  // The element is not removed from the stack.\n  // throws RuntimeException if stack is empty.\n  public T peek() throws RuntimeException {\n    if (isEmpty()) throw new RuntimeException("Stack is empty\\n");\n    return array[top-1];\n  }\n  // not on the slides: top is also the count (slide 27)\n  public boolean isEmpty() { return top == 0; }\n  public int size() { return top; }\n}';
  function arun(v) {
    var cap = Math.min(6, Math.max(1, Math.trunc(v.c))), tk = toks(v.ops), code = AC.split('\n'), ops = [];
    code.push('', '// in main:', 'Stack<String> s = new ArrayStack<>(' + cap + ');');
    tk.forEach(function (t) {
      var o = /^(-|pop)$/.test(t) ? { k: 'pop' } : /^(\?|peek)$/.test(t) ? { k: 'peek' } : { k: 'push', x: t.slice(0, 5) };
      o.line = code.length + 1;
      code.push(o.k === 'push' ? 's.push("' + o.x + '");' : 'System.out.println(s.' + o.k + '());');
      ops.push(o);
    });
    return { cap: cap, code: code.join('\n'), ops: ops };
  }
  var arraystack = {
    id: 'arraystack', slides: [25, 34], title: 'ArrayStack: an array, an index called top, and room to grow',
    code: function (v) { return arun(v).code; },
    inputs: [{ id: 'ops', type: 'text', label: 'operations', value: 'A B C D E - ?', maxlen: 40 }, { id: 'c', label: 'initial capacity', value: 4, min: 1, max: 6 }],
    inputsLabel: 'Values to push, <code>-</code> for pop, <code>?</code> for peek.',
    presets: [{ label: 'push 5 (capacity 4)', values: { ops: 'A B C D E - ?', c: 4 } }, { label: 'grows twice (capacity 2)', values: { ops: 'A B C D E F', c: 2 } }, { label: 'pop an empty stack', values: { ops: 'A - - ', c: 3 } }, { label: 'capacity 1', values: { ops: 'A B C ?', c: 1 } }],
    steps: function (v) {
      var R = arun(v), st = [], arr = [], top = 0, n = 0, cl = R.code.split('\n').length - R.ops.length;
      for (var i = 0; i < R.cap; i++) arr.push(null);
      var snap = function (o) { o.arr = arr.slice(); o.top = top; return o; };
      st.push({ slide: 25, ph: 'refs', line: L(AC, 'private T[] array'), cap: 'The stack keeps its elements in an <b>array</b>. An array of objects stores <b>references</b> (arrows) to the objects, not the objects themselves.' });
      st.push({ slide: 26, ph: 'capa', line: L(AC, 'array.length * 2'), cap: 'The number of cells is the <b>capacity</b>, and a Java array cannot change it. When the array is full, push makes a <b>new array twice as big</b> and copies the elements. The user does not even notice.' });
      st.push({ slide: 27, ph: 'idx', line: L(AC, 'private int top'), cap: 'The bottom of the stack is always index 0. <b>top</b> is the index <b>after</b> the top element, so it is also the number of elements: top = 0 → empty, top = array.length → full.' });
      st.push(snap({ slide: 29, line: cl + ',' + L(AC, 'top = 0;') + '-' + L(AC, '(T[]) new Object'), cap: 'new ArrayStack&lt;&gt;(' + R.cap + '): top = 0 and an array with ' + R.cap + ' empty (null) cell' + (R.cap > 1 ? 's' : '') + '.' }));
      st.push(snap({ slide: 30, line: L(AC, '(T[]) new Object'), cap: '<code>new T[initialCapacity]</code> is not allowed in Java. So the constructor creates an array of <b>Object</b> and casts it to <b>T[]</b>.' }));
      for (i = 0; i < R.ops.length; i++) {
        var o = R.ops[i], s = { slide: 31, line: o.line };
        if (o.k === 'push') {
          if (top === arr.length) {
            var old = arr.slice();
            arr = arr.concat(arr.map(function () { return null; }));
            st.push(snap({ slide: 31, line: o.line + ',' + L(AC, 'if (size() == array.length)') + ',' + L(AC, 'Arrays.copyOf'), old: old, cap: 'push("' + h(o.x) + '"): size() = ' + top + ' = array.length, the array is <b>full</b>. expandCapacity copies the ' + top + ' elements into a new array of ' + arr.length + ' cells: O(n), but it happens rarely.' }));
          }
          arr[top] = { id: 'e' + n++, t: o.x }; top++;
          st.push(snap({ slide: 31, line: o.line + ',' + L(AC, 'array[top] = element') + '-' + L(AC, 'top++'), fresh: top - 1, cap: '<b>push("' + h(o.x) + '")</b>: array[' + (top - 1) + '] = "' + h(o.x) + '", then top++ → top = ' + top + '. O(1).' }));
        } else if (top === 0) {
          st.push(snap({ slide: 34, line: o.line + ',' + L(AC, o.k === 'pop' ? 'Stack is empty' : 'Stack is empty', o.k === 'pop' ? 1 : 2), err: true, cap: '<b>' + o.k + '()</b> on an empty stack (top = 0): isEmpty() is true, so it <b>throws a RuntimeException</b> and the program stops. The caller should catch it.', out: 'Exception in thread "main" java.lang.RuntimeException: Stack is empty' }));
          break;
        } else if (o.k === 'pop') {
          top--; var e = arr[top]; arr[top] = null;
          st.push(snap({ slide: 32, line: o.line + ',' + L(AC, 'top--;') + '-' + L(AC, 'return result;'), res: e, resLb: 'pop() returned', cap: '<b>pop()</b>: top-- → ' + top + ', result = array[' + top + '] = "' + h(e.t) + '", and the cell is set to <b>null</b>. O(1).', out: e.t }));
        } else {
          st.push(snap({ slide: 32, line: o.line + ',' + L(AC, 'return array[top-1]'), peek: top - 1, cap: '<b>peek()</b> returns array[top-1] = array[' + (top - 1) + '] = "' + h(arr[top - 1].t) + '". Nothing changes. O(1).', out: arr[top - 1].t }));
        }
      }
      var last = st[st.length - 1];
      if (!last.err) st.push(snap({ slide: 33, line: cl, end: true, cap: 'A full array is <b>not</b> an error for the user: push grows it. An exception is thrown only for a real stack problem: pop or peek on an <b>empty</b> stack.' }));
      return st;
    },
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'refs') {
        ['"A"', '"B"', '"C"'].forEach(function (x, i) { items.push(B('rc' + i, 40 + i * 60, 120, 56, 44, { title: '●', size: 14, tone: 'blue' })); items.push(OBJ('ro' + i, 20 + i * 180, 240, 140, { name: 'String', fields: [x] })); items.push(A('ra' + i, 68 + i * 60, 152, 90 + i * 180, 240, { tone: 'accent' })); });
        for (var c = 3; c < 7; c++) items.push(B('rc' + c, 40 + c * 60, 120, 56, 44, { title: 'null', mono: true, size: 11, tone: 'muted' }));
        items.push(T('rl', 40, 100, 'array', { mono: true, bold: true, size: 13 }));
        return items;
      }
      if (s.ph === 'capa') {
        ['A', 'B', 'C', 'D'].forEach(function (x, i) { items.push(B('o' + i, 40 + i * 52, 70, 48, 40, { title: x, mono: true, size: 14, tone: 'muted' })); items.push(B('n' + i, 40 + i * 52, 190, 48, 40, { title: x, mono: true, size: 14, tone: 'teal' })); items.push(A('ca' + i, 64 + i * 52, 112, 64 + i * 52, 188, { tone: 'muted' })); });
        for (var j = 4; j < 8; j++) items.push(B('n' + j, 40 + j * 52, 190, 48, 40, { tone: 'teal', dash: true }));
        items.push(T('cl1', 260, 96, 'full: capacity 4', { size: 13, bold: true, tone: 'red' }));
        items.push(T('cl2', 40, 266, 'new array: capacity 8, the elements are copied', { size: 13, bold: true, tone: 'teal' }));
        return items;
      }
      if (s.ph === 'idx') {
        ['A', 'B', 'C', null, null].forEach(function (x, i) { items.push(B('ic' + i, 60 + i * 80, 120, 76, 46, { title: x || '', mono: true, size: 15, tone: x ? 'blue' : 'muted' })); items.push(T('ii' + i, 98 + i * 80, 186, '[' + i + ']', { anchor: 'middle', mono: true, size: 12, tone: 'muted' })); });
        items.push(P('itp', 98 + 3 * 80, 204, 'top = 3', { dir: 'up' }));
        items.push(T('ib', 98, 104, 'bottom', { anchor: 'middle', size: 12, bold: true, tone: 'muted' }));
        items.push(T('it', 258, 104, 'top element', { anchor: 'middle', size: 12, bold: true, tone: 'accent' }));
        return items;
      }
      var cap = s.arr.length, cw = Math.min(64, Math.floor(520 / cap)), x0 = 20, y = 150;
      if (s.old) s.old.forEach(function (e, i) { items.push(B('old' + i, x0 + i * cw, 50, cw - 4, 40, { title: e ? e.t : '', mono: true, size: 13, tone: 'muted', dash: true, o: 0.6 })); });
      if (s.old) items.push(T('oldl', x0, 40, 'old array (full)', { size: 12, tone: 'muted' }));
      s.arr.forEach(function (e, i) {
        var fresh = i === s.fresh, pk = i === s.peek;
        items.push(B('cell' + i, x0 + i * cw, y, cw - 4, 44, { tone: fresh || pk ? 'accent' : 'muted', dash: !e, r: 4 }));
        if (e) items.push(B(e.id, x0 + i * cw + 3, y + 3, cw - 10, 38, { title: e.t, mono: true, size: cw < 40 ? 11 : 14, tone: fresh || pk ? 'accent' : 'blue', fill: fresh || pk ? 'solid' : 'soft', hi: fresh || pk, from: fresh && !s.old ? [x0 + i * cw + 3, y - 60] : undefined, z: 2 }));
        else items.push(T('nl' + i, x0 + i * cw + cw / 2 - 2, y + 27, 'null', { anchor: 'middle', mono: true, size: cw < 40 ? 9 : 11, tone: 'muted' }));
        items.push(T('ix' + i, x0 + i * cw + cw / 2 - 2, y + 62, String(i), { anchor: 'middle', mono: true, size: 11, tone: 'muted' }));
      });
      items.push(P('top', x0 + Math.min(s.top, cap) * cw + cw / 2 - 2 - (s.top >= cap ? cw / 2 : 0), y + 72, 'top = ' + s.top, { dir: 'up', len: 22 }));
      items.push(T('info', 20, 300, 'size() = ' + s.top + '    array.length = ' + cap, { mono: true, size: 14, bold: true }));
      if (s.res) items.push(B(s.res.id, 420, 270, 110, 40, { title: s.res.t, mono: true, size: 15, tone: 'accent', fill: 'solid', hi: true, tag: s.resLb }));
      if (s.err) items.push(T('er', 470, 290, 'empty!', { anchor: 'middle', size: 18, bold: true, tone: 'red' }));
      return items;
    }
  };

  var bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; }, code = function (t) { return { type: 'code', lang: 'java', text: t }; };
  var OUT = ['Collections', 'A Stack Collection', 'Postfix Expressions', 'A Generic Stack interface', 'Implementing a Stack with an array'];
  function outline(on, ex) { return { blocks: OUT.map(function (t, i) { return { type: 'bullet', html: i === on ? '<b>' + t + '</b>' : t }; }), explain: ex }; }

  addUnit({
    course: 'ds', lesson: '03-stacks',
    blurb: 'Last in, first out: stack operations, evaluating postfix expressions with a stack, a generic Stack interface and an array-based stack.',
    parts: [
      { title: 'Collections and the stack', from: 1, to: 10 },
      { title: 'Postfix expressions', from: 11, to: 20 },
      { title: 'A generic Stack interface', from: 21, to: 24 },
      { title: 'Implementing a stack with an array', from: 25, to: 34 }
    ],
    visuals: [collect, stackops, postfix, iface, arraystack],
    slides: {
      1: { cover: true, explain: '<p>A <b>stack</b> is a collection where the <b>last</b> element added is the <b>first</b> one removed: <b>LIFO</b> (last in, first out).</p><pre class="ex">add A, add B, add C  →  remove gives C, then B, then A</pre><p>Think of a stack of plates: you put a plate on top, and you take the plate from the top.</p><p class="watch">LIFO is about <b>time</b> (when an element was added), not about size or value.</p>' },
      2: outline(-1, '<p>The plan: collections in general, the stack, how a stack evaluates postfix expressions, our own generic Stack interface, and a stack built with an array.</p>'),
      3: { explain: '<p>A <b>collection</b> is an object that holds and {{organizes|ينظّم}} other objects, called its <b>elements</b>. It gives operations to add, remove and reach them.</p><pre class="ex">a stack, a queue, a list → all collections</pre><p>Some collections are <b>linear</b> (the elements are in a line), others are <b>non-linear</b>.</p><p class="watch">The collection is the container object; the elements are the objects inside it.</p>' },
      4: { explain: '<p>A collection is defined by how its elements are {{arranged|مرتّبة}} relative to each other:</p><ul><li><b>linear</b> (left): one after another, like a line of people;</li><li><b>non-linear</b> (right): an element can connect to several others, like a family tree.</li></ul><pre class="ex">linear: stacks, queues, lists\nnon-linear: trees, graphs (later units)</pre>' },
      5: { blocks: [{ type: 'bullet', text: 'Abstraction means hiding the details of implementation.' }, { type: 'bullet', text: 'The interface defines the operations, such as adding and removing the elements of a collection.' }, { type: 'bullet', text: 'A class implements the interface of the collection by encapsulating (hiding) its private data and implementing its public methods.' }, { type: 'bullet', text: 'A user class interacts with the collection through its interface.' }], explain: '<p><b>{{Abstraction|التجريد}}</b> means hiding the details of how something works.</p><ul><li>The <b>interface</b> lists the operations (add, remove…).</li><li>A class <b>implements</b> it, with <b>private</b> data and <b>public</b> methods.</li><li>The user class only talks to the interface.</li></ul><pre class="ex">stack.push("A");   // the user does not know if it is\n                   // an array or linked nodes inside</pre><p class="watch">Because the data is private, the user cannot break the stack by reaching into the middle of it.</p>' },
      6: { blocks: [{ type: 'bullet', text: 'The Java programming language is accompanied by a large library of classes.' }, { type: 'bullet', text: 'These classes are referred to as the Java API Application Programmer Interface.' }, { type: 'bullet', text: 'The subset of those classes that support collections is called the Java Collections API.' }, { type: 'bullet', text: 'We will explore the Java Collections API and examine its classes. We will also develop our own implementation of these classes.' }], explain: '<p>Java comes with a big library of ready classes: the <b>Java API</b> (Application Programmer Interface). The part for collections is the <b>Java Collections API</b>.</p><pre class="ex">java.util.Stack, java.util.ArrayList, java.util.LinkedList</pre><p>In this course we use these classes, and we also write <b>our own</b> versions to understand how they work inside.</p>' },
      7: { explain: '<p>The same map of the Collections Framework as unit 1. Find <b>Stack</b>: it is a legacy (old) class that extends <b>Vector</b>, which implements <b>List</b>.</p><pre class="ex">dashed arrow → implements (an interface)\nsolid arrow  → extends (a class)</pre><p class="watch">java.util.Stack is old: it also has list methods, so a user can reach the middle of it. Our own stack will allow only real stack operations.</p>' },
      8: { explain: '<p>In stack words, we <b>push</b> an element on the stack and <b>pop</b> an element off it. Both happen at the <b>top</b>.</p><pre class="ex">push(1), push(2), push(3)\npop() → 3     pop() → 2</pre><p>Like a stack of books: you can add or take a book only at the top, never from the middle or the bottom.</p><p class="watch">To reach the bottom element, you must pop every element above it first.</p>' },
      9: { explain: '<p>A stack is usually drawn <b>standing up</b>. The <b>top</b> is the end where elements are added and removed; the bottom never moves.</p><pre class="ex">top → | C |\n      | B |\n      | A | ← bottom (pushed first)</pre><p class="watch">In a drawing the top is up, but in code the “top” is just a position: in an array it can be the <b>end</b> of the array.</p>' },
      10: { blocks: [{ type: 'bullet', text: 'The classic stack operations are push, pop, peek, isEmpty, and size.' }, { type: 'bullet', text: 'The peek operation is sometimes called top and returns the top element without removing it.' }], explain: '<p>The five classic stack operations:</p><pre class="ex">push(x)    add x on top\npop()      remove the top and return it\npeek()     return the top, do NOT remove it\nisEmpty()  true if there are no elements\nsize()     the number of elements</pre><p><b>peek</b> is sometimes called <b>top</b>. The drawing can run any list of operations, and two smart designs built from two stacks: getMin with a MIN stack, and IN/OUT stacks.</p><p class="watch">pop and peek both return the top, but only pop removes it.</p>' },
      11: outline(2, '<p>Next: a real use of a stack, evaluating postfix expressions.</p>'),
      12: { explain: '<p>An <b>{{infix|بين العاملين}}</b> expression puts the operator <b>between</b> its two operands; a <b>{{postfix|بعد العاملين}}</b> expression puts it <b>after</b> them.</p><pre class="ex">infix:    12 - 7\npostfix:  12 7 -      (both are 5)</pre><p>Postfix looks strange to people, but it is very easy for a program to evaluate with a stack.</p><p class="watch">The order of the operands stays the same: 12 7 - is 12 − 7, not 7 − 12.</p>' },
      13: { explain: '<p>In infix we need <b>{{precedence|أولوية}}</b> rules and parentheses: 4 + 5 * 2 is 14 because * comes first. In postfix the order of the tokens already says what comes first:</p><pre class="ex">4 + 5 * 2      →  4 5 2 * +\n(4 + 5) * 2    →  4 5 + 2 *</pre><p>So postfix needs <b>no parentheses</b>. The slide’s longer example evaluates to 10.</p><p class="watch">Each operator works on the two values just before it (after they are computed), not on the first two numbers of the line.</p>' },
      14: { explain: '<p>The algorithm, with one stack:</p><ol><li>read the tokens left to right;</li><li>an <b>operand</b> (number): push it;</li><li>an <b>operator</b>: pop two, compute, push the result;</li><li>at the end, the answer is on top.</li></ol><pre class="ex">7 4 -3 * 1 5 + / *\n4 * -3 = -12 · 1 + 5 = 6 · -12 / 6 = -2 · 7 * -2 = -14</pre><p class="watch">Operators are never pushed. Only numbers live on the stack.</p>' },
      15: { title: 'The PostfixTester class', blocks: [code('package postfix;\nimport java.util.Scanner;                    // Scanner class in java\npublic class PostfixTester {                 // Tests postfix expressions\n  public static void main(String[] args) {\n    String expression, again;\n    Scanner in = new Scanner(System.in);\n    do {\n      PostfixEvaluator evaluator = new PostfixEvaluator();\n      System.out.println("Enter a postfix expression (e.g. 5 4 + 3 2 1 - + *)");\n      System.out.println("Each token must be an integer or an operator (+ - * /)");\n      expression = in.nextLine();\n      int result = evaluator.evaluate(expression);\n      System.out.println();\n      System.out.println("That expression equals " + result);\n      System.out.print("Evaluate another expression [Y/N]? ");\n      again = in.nextLine();\n      System.out.println();\n    } while (again.equalsIgnoreCase("y"));\n  }\n}')],
        explain: '<p>PostfixTester is the <b>main</b> program. In a do-while loop it:</p><ol><li>reads a whole line (the expression) with nextLine;</li><li>calls <code>evaluator.evaluate(expression)</code>;</li><li>prints the result and asks “another one?”.</li></ol><pre class="ex">Enter: 5 4 + 3 2 1 - + *\nThat expression equals 36</pre><p class="watch">Each token must be separated by spaces: “5 4+” is read as two tokens, “5” and “4+”, and fails.</p>' },
      16: { title: 'The PostfixEvaluator class', blocks: [code('package postfix;\nimport java.util.Stack;          // java Stack class\nimport java.util.Scanner;\n\n// Evaluates postfix expressions having constant integer operands\npublic class PostfixEvaluator {\n  private final static char ADD = \'+\';\n  private final static char SUBTRACT = \'-\';\n  private final static char MULTIPLY = \'*\';\n  private final static char DIVIDE = \'/\';\n\n  private Stack<Integer> stack;\n\n  // constructor creates a new stack of Integer\n  public PostfixEvaluator() {\n    stack = new Stack<>();\n  }')],
        explain: '<p>PostfixEvaluator uses Java’s own <b>java.util.Stack</b>. It has:</p><ul><li>four <b>constants</b> for the operators: ADD = \'+\', SUBTRACT = \'-\'…;</li><li>a field <code>Stack&lt;Integer&gt; stack</code>;</li><li>a constructor that creates the empty stack.</li></ul><pre class="ex">Stack&lt;Integer&gt; stack = new Stack&lt;&gt;();   // only Integers allowed</pre><p class="watch">The tester makes a <b>new</b> evaluator for each expression, so each one starts with an empty stack.</p>' },
      17: { blocks: [code(PC.split('\n\nprivate boolean')[0])],
        explain: '<p>evaluate reads the tokens with a Scanner. For each token:</p><ul><li>an operator: pop <b>op2</b> first, then <b>op1</b>, compute, push the result;</li><li>otherwise: <code>Integer.valueOf(token)</code> makes a number, push it.</li></ul><pre class="ex">"9 3 -": push 9, push 3\n"-": op2 = 3, op1 = 9 → 9 - 3 = 6</pre><p class="watch">The slide has an extra “)” in <code>stack.push(Integer.valueOf(token)));</code>: that line does not compile. One “)” must be removed.</p>' },
      18: { explain: '<p>isOperator returns <b>true</b> only if the token is exactly "+", "-", "*" or "/". It is <b>private</b>: only evaluate uses it.</p><pre class="ex">isOperator("*")  → true\nisOperator("-3") → false   (a negative number)</pre><p>The comment above it is a <b>Javadoc</b> comment, with @param and @return tags (slide 20).</p><p class="watch">Strings are compared with <code>equals</code>, not <code>==</code>.</p>' },
      19: { title: 'The evaluteSingleOperator Method', blocks: [code('/**\n * Performs evaluation of a single operator and two operands.\n * @param operation operation to be performed\n * @param op1 the first operand\n * @param op2 the second operand\n * @return result of the expression\n */\nprivate int evaluateSingleOperator(char operation, int op1, int op2) {\n  int result = 0;\n  switch (operation) {\n    case ADD:      result = op1 + op2; break;\n    case SUBTRACT: result = op1 - op2; break;\n    case MULTIPLY: result = op1 * op2; break;\n    case DIVIDE:   result = op1 / op2;\n  }\n  return result;\n}\n\n} // end of the PostfixEvaluator class')],
        explain: '<p>A switch on the operator character computes <b>op1 operator op2</b>. The cases use the constants ADD, SUBTRACT…</p><pre class="ex">(\'-\', 9, 3) → 9 - 3 = 6\n(\'/\', 7, 2) → 7 / 2 = 3    (int division)</pre><p>The Javadoc comment explains each parameter (@param) and the result (@return).</p><p class="watch">With int division, 7 / 2 is 3, and dividing by 0 throws an ArithmeticException.</p>' },
      20: { explain: '<p><b>Javadoc</b> comments start with <code>/**</code> and end with <code>*/</code>. Tags that start with <b>@</b> mark special information:</p><pre class="ex">@author   who wrote it\n@version  which version\n@param    one parameter\n@return   what the method returns</pre><p>The <b>javadoc</b> tool reads these comments and makes web pages that document the classes.</p><p class="watch">A normal <code>/* … */</code> comment (one star) is ignored by javadoc.</p>' },
      21: outline(3, '<p>Next: our own Stack interface.</p>'),
      22: { explain: '<p>Now we define <b>our own</b> stack. First an <b>interface</b> that lists every method’s signature, without bodies.</p><p>It is generic: <code>Stack&lt;T&gt;</code>. <b>T</b> is a placeholder for the element type, used for parameters and results.</p><pre class="ex">Stack&lt;String&gt;  → push(String), String pop()\nStack&lt;Integer&gt; → push(Integer), Integer pop()</pre><p>It lives in the package <code>mystack</code>.</p><p class="watch">T must be a class type: Stack&lt;int&gt; is not allowed, use Stack&lt;Integer&gt;.</p>' },
      23: { explain: '<p>The interface has the five stack operations, plus toString:</p><pre class="ex">void push(T element);   T pop();   T peek();\nboolean isEmpty();      int size();\nString toString();</pre><p>Any class that says <code>implements Stack&lt;T&gt;</code> must write all of them. We will do it twice: with an array (this unit) and with links (unit 4).</p><p class="watch">An interface method has no body: a semicolon, not { }.</p>' },
      24: { text: false, explain: '<p>The interface in <b>UML</b>:</p><ul><li>the dashed box at the corner holds the <b>generic type T</b>;</li><li>the middle part is empty: an interface has <b>no data members</b>;</li><li>the bottom lists the public methods with their types.</li></ul><pre class="ex">push(T element) : void      pop() : T</pre><p class="watch">In UML the return type comes <b>after</b> the colon; in Java it comes before the name.</p>' },
      25: { explain: '<p>Our first stack implementation keeps the elements in an <b>array</b>, the {{underlying|الأساسي: الذي تحته}} data structure.</p><pre class="ex">array[0] → "A"   array[1] → "B"   array[2] → "C"</pre><p>An array of objects stores <b>references</b> to the objects. One problem: the array can become <b>full</b>. What then?</p><p class="watch">The cells hold arrows to the objects, so popping only removes an arrow from the array.</p>' },
      26: { explain: '<p>The number of cells is the <b>capacity</b>. A Java array cannot grow after it is created. When it is full, push could:</p><ul><li>throw an exception: not good;</li><li>return “failed”: not good;</li><li><b>create a bigger array and copy</b> the elements: the best choice.</li></ul><pre class="ex">capacity 4 full → new array of 8, copy 4 elements</pre><p class="watch">Growing is rare, and the user of the stack never has to think about it.</p>' },
      27: { explain: '<p><b>ArrayStack&lt;T&gt;</b>: the name tells how it is built (with an array). Its rules:</p><ul><li>the bottom is fixed at index <b>0</b>;</li><li><b>top</b> is the index <b>after</b> the top element;</li><li>so top also <b>counts</b> the elements.</li></ul><pre class="ex">A, B, C in cells 0, 1, 2  →  top = 3\ntop == 0  → empty\ntop == array.length → full</pre><p class="watch">top is not the index of the top element; that is <b>top − 1</b>.</p>' },
      28: { explain: '<p>The class header and fields:</p><pre class="ex">public class ArrayStack&lt;T&gt; implements Stack&lt;T&gt;\nDEFAULT_CAPACITY = 100\nint top;   T[] array;</pre><p>It implements our Stack&lt;T&gt; interface, so it must have push, pop, peek, isEmpty, size and toString. <code>import java.util.Arrays</code> is needed for <code>Arrays.copyOf</code> (slide 31).</p><p class="watch">The fields are <b>private</b>: users can only use the stack methods.</p>' },
      29: { explain: '<p>Two constructors:</p><ul><li><code>ArrayStack()</code> calls the other one with <code>this(DEFAULT_CAPACITY)</code>, so capacity 100;</li><li><code>ArrayStack(int initialCapacity)</code> sets top = 0 and creates the array.</li></ul><pre class="ex">new ArrayStack&lt;String&gt;()    → 100 cells\nnew ArrayStack&lt;String&gt;(10)  → 10 cells</pre><p class="watch"><code>this(...)</code> must be the first line of the constructor.</p>' },
      30: { blocks: [bul('You cannot instantiate an array of a generic type directly.'), code('array = new T[initialCapacity];       // Wrong!'), bul('Instead, create an array of Object references and cast them to the generic type.')],
        explain: '<p>Java does not allow <code>new T[...]</code>: at run time Java does not know what T is.</p><p>The fix: create an array of <b>Object</b> (any object fits there) and <b>cast</b> it to T[]:</p><pre class="ex">array = (T[]) new Object[initialCapacity];</pre><p class="watch">The compiler shows an “unchecked” warning for this cast. It is safe here, because the stack only puts T elements in the array.</p>' },
      31: { explain: '<p><b>push</b>: if the array is full, expand it first; then put the element at index <b>top</b> and add 1 to top.</p><pre class="ex">top = 2:  array[2] = "C";  top = 3</pre><p><b>expandCapacity</b> uses <code>Arrays.copyOf(array, array.length * 2)</code>: a new array, twice as long, with the old elements copied.</p><p>push is <b>O(1)</b>; expanding is <b>O(n)</b>, but it happens only after n pushes, so on average push stays fast.</p><p class="watch">Doubling (× 2) is important: adding only 1 cell would copy the whole array on every push.</p>' },
      32: { explain: '<p><b>pop</b>: if empty, throw an exception. Else top--, take array[top], set that cell to <b>null</b>, and return the element.</p><pre class="ex">top = 3: top = 2, result = array[2], array[2] = null</pre><p><b>peek</b> just returns <code>array[top-1]</code> and changes nothing. Both are <b>O(1)</b>.</p><p class="watch">pop must do <code>top--</code> <b>before</b> reading the cell, because top is one past the top element.</p>' },
      33: { explain: '<p>When should a collection throw an exception? Only for a problem that belongs to the <b>idea</b> of the collection:</p><pre class="ex">pop() on an empty stack   → exception (a real problem)\npush() on a full array    → no exception: grow the array</pre><p>“Full” is a problem of the <b>implementation</b> (the array), so the class solves it itself.</p>' },
      34: { explain: '<p>pop and peek on an empty stack throw a <b>RuntimeException</b>. An exception is an object, so it is created with <b>new</b>:</p><pre class="ex">throw new RuntimeException("Stack is empty\\n");</pre><p>The code that calls pop or peek should <b>catch</b> it:</p><pre class="ex">try { s.pop(); }\ncatch (RuntimeException e) { System.out.println(e.getMessage()); }</pre><p class="watch">Better: check <code>isEmpty()</code> before pop, so the exception never happens.</p>' }
    },
  exam: {
    questions: [
      { q: 'Which postfix expression is the same as the infix expression `(8 - 2) * (1 + 3)`?',
        options: ['8 2 - 1 3 + *', '8 2 1 3 - + *', '8 2 - * 1 3 +', '- 8 2 + 1 3 *'], answer: 0, review: 13,
        why: 'Each bracket becomes its own postfix part: `8 2 -` and `1 3 +`. The `*` works on their two results, so it comes last. "8 2 1 3 - + *" computes 8 * (2 + (1 - 3)). "8 2 - * 1 3 +" puts `*` when only one value is on the stack. "- 8 2 + 1 3 *" writes operators first (that is not postfix).',
        lessons: ['03-stacks'], skills: ['concept'], available_after: '03-stacks', level: 2 },
      { source: { assignment: 3, question: 13 },
        q: "A stack implements getMin() using an {{auxiliary|مساعد}} stack called MIN. When pushing a value, it is also pushed onto MIN if MIN is empty or the value is less than or equal to MIN's top. When popping a value, MIN is also popped if MIN's top equals that value. Starting with both stacks empty, execute: push(8), push(4), push(6), push(2), push(2), pop(), pop(). What does getMin() return now, and why does it take O(1) time?",
        options: ['4, because the top of MIN holds the current minimum and can be read directly.', '6, because the top of the main stack is always its minimum.',
          '2, because MIN {{permanently|بشكل دائم}} stores the smallest value ever pushed.', '4, because getMin() scans the main stack to find its smallest value.'],
        answer: 0, review: 10,
        why: 'MIN gets 8, 4, then 2, then the second 2 (equal values are pushed too). The two pops remove 2 and 2 from the main stack, and each time MIN\'s top is 2, so MIN loses both. Main: 8, 4, 6 · MIN: 8, 4. getMin() is a peek on MIN: O(1). "6" confuses top with minimum; "2" forgets that MIN is popped too; the last option has the right number but the wrong reason: there is no scan.',
        lessons: ['03-stacks'], skills: ['trace', 'design'], available_after: '03-stacks', level: 3 },
      { q: 'Two stacks, IN and OUT, start empty. OUT never accepts a value smaller than its top; IN accepts any value. Each arriving value goes on OUT if OUT is empty or the value is not smaller than OUT\'s top; otherwise it goes on IN. The values 4, 7, 2, 9, 5 arrive in that order. Then OUT is popped twice, and each popped value is pushed on IN. Finally, 6 arrives (same rule). What do the stacks hold now (bottom → top)?',
        options: ['IN: 2, 5, 9, 7 · OUT: 4, 6', 'IN: 2, 5, 7, 9 · OUT: 4, 6', 'IN: 2, 5, 9, 7, 6 · OUT: 4', 'IN: 2, 5, 4, 7, 6 · OUT: 9'], answer: 0, review: 10,
        why: 'Arrivals: OUT 4, 7 · IN 2 · OUT 9 · IN 5. So OUT is 4, 7, 9 and IN is 2, 5. Popping OUT twice gives 9 then 7, so IN becomes 2, 5, 9, 7 (the order flips). OUT\'s top is now 4, so 6 is accepted by OUT. "2, 5, 7, 9" thinks moving keeps the order. The third option still compares 6 with the old top 9. The last one pops OUT from the bottom, like a queue.',
        lessons: ['03-stacks'], skills: ['trace'], available_after: '03-stacks', level: 3 }
    ]
  }
  });
})();
