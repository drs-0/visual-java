/* Data Structures · Unit 10 Trees (38 slides): tree terms (root, leaf, level, height, subtree, degree, balanced,
   complete), linked and array implementations of a binary tree, pre-, in-, post- and level-order traversals, the
   LinkedBT class with recursive size, height and find, and expression trees */
(function () {
  function L(src, frag, nth) { var ls = src.split('\n'), c = 0; for (var i = 0; i < ls.length; i++) if (ls[i].indexOf(frag) >= 0 && ++c === (nth || 1)) return i + 1; throw new Error('no line ' + frag); }
  function toks(s, max) { return String(s).trim().split(/[\s,]+/).filter(Boolean).slice(0, max || 10); }
  /* a binary tree in array form: index i has children 2i+1 and 2i+2; "-" = no node */
  function parseTree(s) {
    var t = toks(s, 31).map(function (x) { return /^(-|null)$/i.test(x) ? null : x.replace(/\W/g, '').slice(0, 3) || null; });
    for (var i = 1; i < t.length; i++) if (t[i] != null && t[(i - 1) >> 1] == null) t[i] = null;
    while (t.length && t[t.length - 1] == null) t.pop();
    return t.length ? t : ['A'];
  }
  function kids(t, i) { return [2 * i + 1 < t.length && t[2 * i + 1] != null ? 2 * i + 1 : -1, 2 * i + 2 < t.length && t[2 * i + 2] != null ? 2 * i + 2 : -1]; }
  function layout(t, o) {
    var rank = 0, pos = {}, lv = function (i) { return Math.floor(Math.log2(i + 1)); };
    var walk = function (i) { if (i < 0) return; var k = kids(t, i); walk(k[0]); pos[i] = { r: rank++, d: lv(i) }; walk(k[1]); };
    walk(0);
    var n = rank, w = o.w || 500, x0 = o.x0 != null ? o.x0 : 30, gap = n > 1 ? Math.min(70, w / (n - 1)) : 0, left = x0 + (w - gap * (n - 1)) / 2;
    Object.keys(pos).forEach(function (i) { pos[i].x = left + pos[i].r * gap; pos[i].y = (o.y0 || 30) + pos[i].d * (o.dy || 56); });
    return pos;
  }
  /* o: {tone: {i: tone}, val: {i: text}, y0, dy, x0, w, show: {i: true} (only these), nulls} */
  function drawTree(t, o) {
    var out = [], pos = layout(t, o), nw = 40, nh = 30;
    Object.keys(pos).forEach(function (k) {
      var i = +k, p = pos[i], tn = (o.tone && o.tone[i]) || 'blue';
      if (o.show && !o.show[i]) return;
      out.push(B('n' + i, p.x - nw / 2, p.y, nw, nh, { title: t[i], mono: true, size: 13, shape: 'oval', tone: tn, fill: tn === 'accent' ? 'solid' : 'soft', hi: tn === 'accent' }));
      if (o.val && o.val[i] != null) out.push(T('v' + i, p.x + nw / 2 + 4, p.y + 8, String(o.val[i]), { mono: true, size: 11, bold: true, tone: 'teal' }));
      kids(t, i).forEach(function (c, j) {
        if (c >= 0 && (!o.show || o.show[c])) out.push(A('e' + c, p.x + (j ? 8 : -8), p.y + nh, pos[c].x, pos[c].y, { tone: 'muted', head: !!o.heads }));
        else if (c < 0 && o.nulls) out.push(T('z' + i + j, p.x + (j ? 22 : -22), p.y + nh + 14, 'null', { anchor: 'middle', mono: true, size: 9, tone: 'red' }));
      });
    });
    return out;
  }

  /* ---------- 1. tree terms (slides 3-10) ---------- */
  var TT = 'root      the only node with no parent (level 0)\nparent    the node just above a node\nchildren  the nodes just below a node\nsiblings  nodes with the same parent\ninternal  a node with at least one child\nleaf      a node with no children\npath      root → … → node; its length = edges followed\nlevel     the path length from the root to the node\nheight    the longest path from the root to a leaf\nsubtree   a node with all its descendants\nancestor  a node on the path from the root\ndegree    the most children any node may have\nbalanced  all leaves on the same level, or within one';
  var GT = { A: ['B', 'C', 'D'], B: ['E', 'F'], D: ['G'], E: ['H'], G: ['I', 'J', 'K'] };
  var GP = { A: [280, 30], B: [150, 100], C: [280, 100], D: [410, 100], E: [100, 170], F: [200, 170], G: [410, 170], H: [100, 240], I: [340, 240], J: [410, 240], K: [480, 240] };
  var par = {}; Object.keys(GT).forEach(function (p) { GT[p].forEach(function (c) { par[c] = p; }); });
  var lvl = function (x) { var d = 0; while (par[x]) { x = par[x]; d++; } return d; };
  var pathTo = function (x) { var p = [x]; while (par[x]) { x = par[x]; p.unshift(x); } return p; };
  var desc = function (x) { var o = [x]; (GT[x] || []).forEach(function (c) { o = o.concat(desc(c)); }); return o; };
  var terms = {
    id: 'terms', slides: [3, 10], title: 'Root, leaves, levels and subtrees', lang: 'text',
    code: TT,
    inputs: [{ id: 'x', type: 'text', label: 'node', value: 'G', minlen: 1, maxlen: 1 }],
    inputsLabel: 'A node of the tree, A to K.',
    presets: [{ label: 'node G', values: { x: 'G' } }, { label: 'node E', values: { x: 'E' } }, { label: 'the root A', values: { x: 'A' } }, { label: 'a leaf: K', values: { x: 'K' } }, { label: 'not in the tree', values: { x: 'Z' } }],
    steps: function (v) {
      var x = String(v.x).toUpperCase().slice(0, 1), ok = !!GP[x], st = [];
      var leaf = function (y) { return !GT[y]; };
      st.push({ slide: 3, line: '1,5-6', ph: 'kinds', cap: 'A <b>tree</b> is non-linear: <b>nodes</b> joined by <b>edges</b>. A is the <b>root</b>; B, D, E, G are <b>internal</b> nodes (they have children); H, F, C, I, J, K are <b>leaves</b>.' });
      if (!ok) { st.push({ slide: 4, line: 1, cap: '"' + x + '" is not a node of this tree. Choose a letter from A to K.' }); return st; }
      var p = par[x], sib = p ? GT[p].filter(function (c) { return c !== x; }) : [];
      st.push({ slide: 4, line: '1-6', ph: 'fam', x: x, cap: x + ': ' + (p ? 'its <b>parent</b> is ' + p + '. ' : 'it is the root, so it has <b>no parent</b>. ') + (GT[x] ? 'Its <b>children</b>: ' + GT[x].join(', ') + ', so it is an internal node. ' : 'No children: it is a <b>leaf</b>. ') + (sib.length ? 'Its <b>siblings</b>: ' + sib.join(', ') + '.' : 'It has no siblings.') });
      st.push({ slide: 5, line: 8, ph: 'lvl', x: x, cap: 'Each node is on a <b>level</b>: A on level 0; B, C, D on 1; E, F, G on 2; H, I, J, K on 3. ' + x + ' is on level <b>' + lvl(x) + '</b>.' });
      var pt = pathTo(x);
      st.push({ slide: 6, line: '7-9', ph: 'path', x: x, path: pt, cap: 'The <b>path</b> from A to ' + x + ': ' + pt.join(' → ') + '. Its <b>length</b> is ' + (pt.length - 1) + ' edge' + (pt.length === 2 ? '' : 's') + ' = the level of ' + x + '. The <b>height</b> of the tree is 3 (the longest path, for example A → D → G → J).' });
      st.push({ slide: 7, line: '10-11', ph: 'sub', x: x, sub: desc(x), path: pt, cap: 'The <b>subtree</b> of ' + x + ': ' + x + ' and all its descendants (' + desc(x).join(', ') + '). Its <b>ancestors</b> are the nodes on the path from the root: ' + (pt.length > 1 ? pt.slice(0, -1).join(', ') : 'none (it is the root)') + '.' });
      st.push({ slide: 8, line: 12, ph: 'deg', cap: 'The most children any node has here is 3 (A and G), so this tree can be seen as a <b>ternary</b> tree (degree 3). A <b>binary</b> tree has degree 2: at most 2 children per node.' });
      st.push({ slide: 9, line: 13, ph: 'bal', cap: 'Leaves here are on levels 1 (C), 2 (F) and 3 (H, I, J, K): more than one level apart, so this tree is <b>not balanced</b>. Balanced trees keep search, insertion and deletion fast.' });
      st.push({ slide: 10, line: 12, ph: 'full', cap: 'A k-ary tree is <b>complete</b> when every level has its k<sup>l</sup> nodes except the last, whose nodes are all on the <b>left</b>. If the last level is also full, the tree is <b>full</b>. (Here k = 2.)' });
      return st;
    },
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'full') {
        [[[1, 1, 1, 1, 1], 'complete'], [[1, 1, 1, 1, 0, 0], 'complete'], [[1, 1, 1], 'full'], [[1, 1, 1, 0, 1], 'not complete']].forEach(function (c, j) {
          var x0 = 20 + j * 136, mid = x0 + 60, pts = [[mid, 60], [mid - 34, 120], [mid + 34, 120], [mid - 50, 180], [mid - 18, 180], [mid + 18, 180]];
          c[0].forEach(function (on, i) { if (!on) return; items.push(B('c' + j + i, pts[i][0] - 14, pts[i][1], 28, 24, { shape: 'oval', tone: c[1] === 'not complete' ? 'red' : 'blue', fill: 'soft' })); if (i) { var p = pts[(i - 1) >> 1]; items.push(A('ce' + j + i, p[0], p[1] + 24, pts[i][0], pts[i][1], { head: false, tone: 'muted' })); } });
          items.push(T('ct' + j, mid, 240, c[1], { anchor: 'middle', size: 13, bold: true, tone: c[1] === 'not complete' ? 'red' : c[1] === 'full' ? 'teal' : 'blue' }));
        });
        return items;
      }
      Object.keys(GT).forEach(function (p) { GT[p].forEach(function (c) { var hot = s.path && s.path.indexOf(c) > 0 && s.path.indexOf(p) >= 0; items.push(A('e' + c, GP[p][0], GP[p][1] + 30, GP[c][0], GP[c][1], { tone: hot ? 'accent' : 'muted', head: true })); }); });
      Object.keys(GP).forEach(function (n) {
        var tn = 'blue', leaf = !GT[n];
        if (s.ph === 'kinds') tn = n === 'A' ? 'accent' : leaf ? 'teal' : 'blue';
        else if (s.ph === 'fam') tn = n === s.x ? 'accent' : n === par[s.x] ? 'red' : (GT[s.x] || []).indexOf(n) >= 0 ? 'teal' : par[n] && par[n] === par[s.x] ? 'blue' : 'muted';
        else if (s.ph === 'lvl') tn = lvl(n) === lvl(s.x) ? 'accent' : 'blue';
        else if (s.ph === 'path') tn = s.path.indexOf(n) >= 0 ? 'accent' : 'muted';
        else if (s.ph === 'sub') tn = s.sub.indexOf(n) >= 0 ? 'teal' : s.path.indexOf(n) >= 0 ? 'accent' : 'muted';
        else if (s.ph === 'deg') tn = (GT[n] || []).length === 3 ? 'accent' : 'blue';
        else if (s.ph === 'bal') tn = leaf ? (lvl(n) === 3 ? 'teal' : 'red') : 'muted';
        items.push(B('g' + n, GP[n][0] - 22, GP[n][1], 44, 30, { title: n, mono: true, size: 14, shape: 'oval', tone: tn, fill: tn === 'accent' ? 'solid' : 'soft', hi: tn === 'accent' }));
      });
      if (s.ph === 'lvl') [0, 1, 2, 3].forEach(function (d) { items.push(T('lv' + d, 20, 50 + d * 70, 'level ' + d, { mono: true, size: 12, bold: true, tone: 'muted' })); });
      if (s.ph === 'fam') items.push(T('lg', 20, 320, 'orange: the node · red: parent · green: children · blue: siblings', { size: 11, tone: 'muted' }));
      if (s.ph === 'sub') items.push(T('lg', 20, 320, 'green: the subtree · orange: the ancestors and the node', { size: 11, tone: 'muted' }));
      if (s.ph === 'bal') items.push(T('lg', 20, 320, 'leaves: red ones are not on the deepest level', { size: 11, tone: 'muted' }));
      return items;
    }
  };

  /* ---------- 2. linked and array forms of a binary tree (slides 12-16) ---------- */
  var TN = 'class TreeNode<T> {\n  T element;            // pointer to element object\n  TreeNode<T> left;     // pointer to left child\n  TreeNode<T> right;    // pointer to right child\n}\n// Array implementation: no left and right pointers\n// root at index 0\n// left child of index i  → index 2i + 1\n// right child of index i → index 2i + 2\n// Simulated links: each array node keeps the index of its left and\n// right child node (-1 for no child)';
  var T15 = 'A B C - - D - - - - - E F - - - - - - - - - - G';
  var arrtree = {
    id: 'arrtree', slides: [12, 16], title: 'A binary tree: links, an array, or simulated links', vb: [560, 380],
    code: TN,
    inputs: [{ id: 't', type: 'text', label: 'tree (array form)', value: 'A B C D E - F', minlen: 1, maxlen: 70 }],
    inputsLabel: 'Elements by index (index i has children 2i+1 and 2i+2); <code>-</code> = no node.',
    presets: [{ label: 'a small tree', values: { t: 'A B C D E - F' } }, { label: 'slide 15', values: { t: T15 } }, { label: 'complete tree', values: { t: 'A B C D E F G H' } }, { label: 'only right children', values: { t: 'A - B - - - C' } }],
    steps: function (v) {
      var t = parseTree(v.t), st = [], used = t.filter(function (x) { return x != null; }).length;
      st.push({ slide: 12, line: '1-5', t: t, ph: 'node', cap: 'A binary tree node (<b>TreeNode&lt;T&gt;</b>) keeps the element and two links: <b>left</b> and <b>right</b> child.' });
      st.push({ slide: 13, line: '3-4', t: t, nulls: true, cap: 'The linked form: every node points to its children; a missing child is <b>null</b>. This tree has ' + used + ' nodes.' });
      var steps = [];
      t.forEach(function (x, i) { if (x == null) return; var k = kids(t, i); steps.push('index ' + i + ' (' + x + '): left → ' + (2 * i + 1) + (k[0] >= 0 ? ' (' + t[k[0]] + ')' : ' (none)') + ', right → ' + (2 * i + 2) + (k[1] >= 0 ? ' (' + t[k[1]] + ')' : ' (none)')); });
      for (var i = 0; i < Math.min(t.length, 3); i++) if (t[i] != null) st.push({ slide: 14, line: '7-9', t: t, arr: true, at: i, cap: steps.shift() + '. The links are not stored: they are <b>computed</b> from the index.' });
      st.push({ slide: 15, line: '6-9', t: t, arr: true, cap: 'The array needs ' + t.length + ' cells for ' + used + ' nodes: <b>' + (t.length - used) + '</b> null cell' + (t.length - used === 1 ? '' : 's') + '. ' + (t.length - used ? 'When the tree is not complete, space is wasted.' : 'No waste: the tree is complete.') });
      st.push({ slide: 16, line: '10-11', t: t, sim: true, cap: 'Simulated links: the array holds the <b>nodes</b> in the order they were added, and each node keeps the index of its left and right child (−1 for none). ' + used + ' cells, no waste.' });
      return st;
    },
    draw: function (k, s) {
      var items = [], t = s.t;
      if (s.ph === 'node') {
        items.push(B('nl', 160, 80, 70, 50, { title: 'left', mono: true, size: 13, tone: 'blue' }));
        items.push(B('ne', 230, 80, 100, 50, { title: 'element', mono: true, size: 13, tone: 'accent', fill: 'solid' }));
        items.push(B('nr', 330, 80, 70, 50, { title: 'right', mono: true, size: 13, tone: 'blue' }));
        items.push(A('a1', 195, 130, 140, 200, { tone: 'blue', label: 'left child', la: 'end', lx: -6 }));
        items.push(A('a2', 365, 130, 420, 200, { tone: 'blue', label: 'right child', la: 'start', lx: 6 }));
        return items;
      }
      var tone = {}; if (s.at != null) { tone[s.at] = 'accent'; kids(t, s.at).forEach(function (c) { if (c >= 0) tone[c] = 'teal'; }); }
      items = items.concat(drawTree(t, { tone: tone, nulls: s.nulls, heads: true, y0: 24, dy: 48, w: 460, x0: 50 }));
      if (s.arr) {
        var n = t.length, cw = Math.min(46, Math.floor(540 / n)), x0 = 280 - n * cw / 2;
        t.forEach(function (x, i) { var tn = x == null ? 'red' : tone[i] || 'blue'; items.push(B('c' + i, x0 + i * cw + 1, 290, cw - 2, 30, { title: x == null ? 'null' : x, mono: true, size: x == null ? (cw < 26 ? 6 : cw < 34 ? 7 : 9) : 12, tone: tn, fill: tn === 'accent' ? 'solid' : 'soft', o: x == null ? 0.7 : 1 })); items.push(T('ci' + i, x0 + i * cw + cw / 2, 284, String(i), { anchor: 'middle', mono: true, size: cw < 30 ? 8 : 10, tone: 'muted' })); });
      }
      if (s.sim) {
        var ord = [], q = [0]; while (q.length) { var j = q.shift(); ord.push(j); kids(t, j).forEach(function (c) { if (c >= 0) q.push(c); }); }
        var at = {}; ord.forEach(function (j, r) { at[j] = r; });
        var cw2 = Math.min(64, Math.floor(540 / ord.length)), xs = 280 - ord.length * cw2 / 2;
        ord.forEach(function (j, r) { var kk = kids(t, j); items.push(B('s' + j, xs + r * cw2 + 1, 272, cw2 - 2, 58, { title: t[j], mono: true, size: 12, tone: 'blue', lines: [(kk[0] >= 0 ? at[kk[0]] : -1) + ', ' + (kk[1] >= 0 ? at[kk[1]] : -1)], lsize: 10 })); items.push(T('si' + r, xs + r * cw2 + cw2 / 2, 266, String(r), { anchor: 'middle', mono: true, size: 10, tone: 'muted' })); });
        items.push(T('sl', 280, 350, 'each cell: element, then the left and right child indexes', { anchor: 'middle', size: 11, tone: 'muted' }));
      }
      return items;
    }
  };

  /* ---------- 3. the four traversals (slides 18-23) ---------- */
  var TR = [
    'preOrder() {\n  visit();\n  if (left!=null) left.preOrder();\n  if (right!=null) right.preOrder();\n}',
    'inOrder() {\n  if (left!=null) left.inOrder();\n  visit();\n  if (right!=null) right.inOrder();\n}',
    'postOrder () {\n  if (left!=null) left.postOrder();\n  if (right!=null) right.postOrder();\n  visit();\n}',
    'levelOrder () {\n  queue.add(root);\n  while (!queue.isEmpty()) {\n    node = queue.remove();\n    node.visit();\n    if (node.left != null)\n      queue.add(node.left);\n    if (node.right != null)\n      queue.add(node.right);\n  }\n}'
  ];
  var NAMES = ['Pre-order', 'In-order', 'Post-order', 'Level-order'], ST = 'A B C D E F - - - G H';
  var traverse = {
    id: 'traverse', slides: [18, 23], title: 'Pre-, in-, post- and level-order', lang: 'text',
    code: function (v) { return TR[Math.min(4, Math.max(1, Math.trunc(v.o))) - 1]; },
    inputs: [{ id: 'o', label: 'order (1 pre, 2 in, 3 post, 4 level)', value: 1, min: 1, max: 4 }, { id: 't', type: 'text', label: 'tree (array form)', value: ST, minlen: 1, maxlen: 70 }],
    inputsLabel: 'Tree elements by index (children of i at 2i+1, 2i+2); <code>-</code> = no node.',
    presets: [{ label: 'pre-order (slide 19)', values: { o: 1, t: ST } }, { label: 'in-order (slide 20)', values: { o: 2, t: ST } }, { label: 'post-order (slide 21)', values: { o: 3, t: ST } }, { label: 'level-order (slide 22)', values: { o: 4, t: ST } }, { label: 'a tree that leans left', values: { o: 2, t: 'P Q - R' } }],
    steps: function (v) {
      var o = Math.min(4, Math.max(1, Math.trunc(v.o))), t = parseTree(v.t), st = [], out = [], path = [], sl = 18 + o + (o === 4 ? 0 : 0), q = [];
      var snap = function (x) { x.t = t; x.seq = out.slice(); x.path = path.slice(); x.q = q.slice(); x.o = o; st.push(x); return x; };
      snap({ slide: 18, line: 1, cap: 'A list has one natural order; a tree has several. Each node is the root of its own subtree, so we choose <b>when</b> to visit a node: before, between or after its subtrees, or level by level.' });
      if (o < 4) {
        var vl = o === 1 ? 2 : o === 2 ? 3 : 4, ll = o === 1 ? 3 : 2, rl = o === 3 ? 3 : 4;
        var rec = function (i) {
          path.push(i);
          snap({ slide: sl, line: 1, cap: NAMES[o - 1] + ' call on ' + t[i] + '.' + (path.length > 1 ? ' (called from ' + t[path[path.length - 2]] + ')' : '') });
          var k = kids(t, i);
          var visit = function () { out.push(t[i]); snap({ slide: sl, line: vl, vis: i, cap: '<b>visit ' + t[i] + '</b>' + (o === 1 ? ': first the node itself…' : o === 2 ? ': its left subtree is done, now the node, then the right subtree.' : ': both subtrees are done, the node comes last.') }); };
          if (o === 1) visit();
          if (k[0] >= 0) { snap({ slide: sl, line: ll, cap: t[i] + ' has a left child (' + t[k[0]] + '): go left.' }); rec(k[0]); }
          if (o === 2) visit();
          if (k[1] >= 0) { snap({ slide: sl, line: rl, cap: t[i] + ' has a right child (' + t[k[1]] + '): go right.' }); rec(k[1]); }
          if (o === 3) visit();
          path.pop();
        };
        rec(0);
        snap({ slide: sl, line: 5, cap: NAMES[o - 1] + ' traversal: <b>' + out.join(', ') + '</b>.' });
      } else {
        q.push(0);
        snap({ slide: 23, line: 2, cap: 'Level-order (breadth-first) uses a <b>queue</b>: start by adding the root.' });
        while (q.length) {
          var i = q.shift(); out.push(t[i]);
          snap({ slide: 22, line: '4-5', vis: i, cap: 'Remove ' + t[i] + ' from the front of the queue and visit it.' });
          var k = kids(t, i), add = [];
          k.forEach(function (c) { if (c >= 0) { q.push(c); add.push(t[c]); } });
          snap({ slide: 23, line: '6-9', vis: i, cap: add.length ? 'Add its children (' + add.join(', ') + ') at the rear of the queue.' : t[i] + ' has no children: nothing to add.' });
        }
        snap({ slide: 23, line: 3, cap: 'The queue is empty. Level-order: <b>' + out.join(', ') + '</b>: level by level, left to right.' });
      }
      return st;
    },
    draw: function (k, s) {
      var tone = {}; s.path.forEach(function (i) { tone[i] = 'red'; }); var visited = {};
      s.t.forEach(function (x, i) { if (x != null && s.seq.indexOf(x) >= 0) visited[i] = 1; });
      Object.keys(visited).forEach(function (i) { tone[i] = 'teal'; }); if (s.vis != null) tone[s.vis] = 'accent';
      var items = drawTree(s.t, { tone: tone, y0: 30, dy: 50 });
      items.push(T('ol', 20, 300, (NAMES[s.o - 1]) + ':', { size: 13, bold: true, tone: 'muted' }));
      items.push(T('ov', 120, 300, s.seq.join(', '), { mono: true, size: 15, bold: true, tone: 'accent' }));
      if (s.o === 4) { items.push(T('ql', 20, 330, 'queue:', { size: 13, bold: true, tone: 'muted' })); items.push(T('qv', 120, 330, s.q.map(function (i) { return s.t[i]; }).join(' ') || '(empty)', { mono: true, size: 14, bold: true, tone: 'blue' })); }
      else if (s.path.length) items.push(T('cs', 548, 30, 'calls: ' + s.path.map(function (i) { return s.t[i]; }).join(' → '), { anchor: 'end', mono: true, size: 12, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* ---------- 4. LinkedBT: size, height, find, levelOrder (slides 25-35) ---------- */
  var BT = '// ---- in the nested class TreeNode<T> ----\n// Recursively computes and returns the number of tree nodes\npublic int size() {\n  int lsize = (left != null)? left.size() : 0;\n  int rsize = (right != null)? right.size() : 0;\n  return lsize + rsize + 1;   // +1 for this tree node\n}\n// Recursively computes and returns the height of the binary tree\npublic int height() {\n  int lheight = (left != null)? left.height() + 1 : 0;\n  int rheight = (right != null)? right.height() + 1 : 0;\n  return Math.max(lheight, rheight);\n}\n// Recursively finds a TreeNode object that contains target\npublic TreeNode<T> find(T target) {\n  // If found then return reference to this node object\n  if (element.equals(target)) return this;\n  TreeNode<T> node = null;   // If target not found\n  // Recursively search the left subtree\n  if (left != null) node = left.find(target);\n  // If not found in left subtree, then search right subtree\n  if (node == null && right != null) node = right.find(target);\n  return node;\n}\n// ---- in LinkedBT<T> ----\npublic int size() { return (root == null)? 0 : root.size(); }\npublic int height() { return (root == null)? 0 : root.height(); }\n// Returns a list of elements along the level-order tree traversal\npublic List<T> levelOrder() {\n  List<T> list = new LinkedList<>();             // list of elements\n  Queue<TreeNode<T>> queue = new LinkedList<>(); // queue of nodes\n  if (root != null) queue.add(root);             // add root node to queue\n  while (!queue.isEmpty()) {                     // queue has tree nodes\n    TreeNode<T> node = queue.remove();           // remove front node\n    list.add(node.element);                      // add element to list\n    // add left and right nodes to queue\n    if (node.left != null) queue.add(node.left);\n    if (node.right != null) queue.add(node.right);\n  }\n  return list;\n}';
  function brun(v) { var op = Math.min(3, Math.max(1, Math.trunc(v.op))), x = String(v.x).replace(/\W/g, '').slice(0, 3) || 'X'; return { op: op, x: x, t: parseTree(v.t), code: BT + '\n\n// in main (tree built with the LinkedBT constructors):\nSystem.out.println(' + (op === 1 ? 'tree.size()' : op === 2 ? 'tree.height()' : 'tree.find("' + x + '").getRoot()') + ');' }; }
  var linkedbt = {
    id: 'linkedbt', slides: [25, 35], title: 'Recursive size, height and find',
    code: function (v) { return brun(v).code; },
    inputs: [{ id: 'op', label: 'method (1 size, 2 height, 3 find)', value: 1, min: 1, max: 3 }, { id: 't', type: 'text', label: 'tree (array form)', value: 'A B C D E - F', minlen: 1, maxlen: 70 }, { id: 'x', type: 'text', label: 'find target', value: 'E', minlen: 1, maxlen: 3 }],
    inputsLabel: 'Tree elements by index (children of i at 2i+1, 2i+2); <code>-</code> = no node.',
    presets: [{ label: 'size()', values: { op: 1, t: 'A B C D E - F', x: 'E' } }, { label: 'height()', values: { op: 2, t: 'A B C D E - F', x: 'E' } }, { label: 'find("E")', values: { op: 3, t: 'A B C D E - F', x: 'E' } }, { label: 'find a missing element', values: { op: 3, t: 'A B C D E - F', x: 'Q' } }, { label: 'height of one node', values: { op: 2, t: 'K', x: 'K' } }],
    steps: function (v) {
      var R = brun(v), t = R.t, code = R.code, st = [], val = {}, path = [], seen = {}, main = code.split('\n').length;
      var snap = function (o) { o.t = t; o.val = JSON.parse(JSON.stringify(val)); o.path = path.slice(); o.seen = JSON.parse(JSON.stringify(seen)); st.push(o); return o; };
      snap({ slide: 25, line: L(code, '// ---- in LinkedBT<T>'), ph: 'iface', cap: 'Java has no binary-tree interface, so we write our own <b>BinaryTree&lt;T&gt;</b>: getRoot, isEmpty, size, height, left, right, find, and the four traversals (they return a List).' });
      snap({ slide: 27, line: L(code, '// ---- in the nested class TreeNode<T>'), ph: 'cls', cap: '<b>LinkedBT&lt;T&gt;</b> keeps only <code>root</code>. Its nested static class <b>TreeNode&lt;T&gt;</b> has element, left and right, and the recursive methods that walk the nodes.' });
      snap({ slide: 32, line: main, cap: 'The LinkedBT constructors build a tree from a root element and two smaller trees: new LinkedBT&lt;&gt;(element, left, right). Our tree: ' + t.map(function (x) { return x || '-'; }).join(' ') + '.' });
      if (R.op === 1 || R.op === 2) {
        var h = R.op === 2, m0 = L(code, h ? 'public int height() {' : 'public int size() {'), m1 = m0 + 1, m2 = m0 + 2, m3 = m0 + 3;
        var rec = function (i) {
          path.push(i); seen[i] = 1;
          snap({ slide: 29, line: (i === 0 ? main + ',' + L(code, h ? 'public int height() { return' : 'public int size() { return') + ',' : '') + m0, cap: t[i] + '.' + (h ? 'height' : 'size') + '() starts.' });
          var k = kids(t, i), a = k[0] >= 0 ? rec(k[0]) + (h ? 1 : 0) : 0;
          snap({ slide: 29, line: m1, cap: h ? 'lheight = ' + (k[0] >= 0 ? t[k[0]] + '.height() + 1 = ' + a : '0 (no left child)') + '.' : 'lsize = ' + (k[0] >= 0 ? a + ' (the size of ' + t[k[0]] + '’s subtree)' : '0 (no left child)') + '.' });
          var b = k[1] >= 0 ? rec(k[1]) + (h ? 1 : 0) : 0;
          var r = h ? Math.max(a, b) : a + b + 1; val[i] = r;
          snap({ slide: 29, line: m2 + '-' + m3, done: i, cap: h ? t[i] + ': rheight = ' + b + '; height = max(' + a + ', ' + b + ') = <b>' + r + '</b>.' : t[i] + ': rsize = ' + b + '; size = ' + a + ' + ' + b + ' + 1 = <b>' + r + '</b>.' });
          path.pop(); return r;
        };
        var res = rec(0);
        snap({ slide: 34, line: main, out: String(res), cap: (h ? 'height() = ' + res + ': the longest path from the root to a leaf has ' + res + ' edge' + (res === 1 ? '' : 's') + '.' + (t.length === 1 ? ' A single node has height 0, and so does an empty tree here: the slide uses 0 for both.' : '') : 'size() = ' + res + ' nodes. Every node is visited once: O(n).') });
      } else {
        var f0 = L(code, 'public TreeNode<T> find(T target)'), found = null;
        var rf = function (i) {
          path.push(i); seen[i] = 1;
          if (t[i] === R.x) { snap({ slide: 30, line: f0 + 2, done: i, cap: t[i] + '.equals("' + R.x + '"): <b>found</b>, return this node.' }); path.pop(); return i; }
          snap({ slide: 30, line: f0 + 2 + ',' + (f0 + 3), cap: t[i] + ' is not "' + R.x + '". node = null; search the left subtree first.' });
          var k = kids(t, i), n = -1;
          if (k[0] >= 0) n = rf(k[0]);
          if (n < 0 && k[1] >= 0) { snap({ slide: 30, line: f0 + 7, cap: 'Not found on the left of ' + t[i] + ': search its right subtree (' + t[k[1]] + ').' }); n = rf(k[1]); }
          snap({ slide: 30, line: f0 + 8, cap: t[i] + '.find returns ' + (n >= 0 ? 'the node ' + t[n] : '<b>null</b>') + '.' });
          path.pop(); return n;
        };
        found = rf(0);
        snap({ slide: 34, line: main, done: found >= 0 ? found : undefined, out: found >= 0 ? R.x : 'null', cap: found >= 0 ? 'LinkedBT.find wraps the node in a new LinkedBT (a subtree whose root holds "' + R.x + '"), so getRoot() gives ' + R.x + '.' : 'Not found: find gives a LinkedBT with root = null, and getRoot() returns null. (On slide 33, getRoot has <code>root = null</code> instead of <code>root == null</code>, which does not compile.)' });
      }
      var lq = [0], lo = [];
      while (lq.length) { var i = lq.shift(); lo.push(t[i]); kids(t, i).forEach(function (c) { if (c >= 0) lq.push(c); }); }
      snap({ slide: 35, line: L(code, 'public List<T> levelOrder()') + '-' + L(code, 'return list;'), level: true, cap: 'levelOrder is <b>not</b> recursive: it uses a queue of TreeNodes, exactly like the level-order algorithm. For this tree: ' + lo.join(', ') + '.' });
      return st;
    },
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'iface') {
        ['getRoot()', 'isEmpty()', 'size()', 'height()', 'left()', 'right()', 'find(T target)', 'preOrder()', 'inOrder()', 'postOrder()', 'levelOrder()'].forEach(function (m, i) { items.push(B('m' + i, 30 + (i % 3) * 172, 40 + Math.floor(i / 3) * 60, 160, 38, { title: m, mono: true, size: 13, tone: i > 6 ? 'teal' : 'blue' })); });
        return items;
      }
      if (s.ph === 'cls') {
        items.push(CLS('c1', 40, 50, 210, { name: 'LinkedBT<T>', fields: ['root : TreeNode<T>'], methods: ['size(), height(), find()', 'levelOrder()', '…'], tone: 'blue' }));
        items.push(CLS('c2', 300, 50, 220, { name: 'TreeNode<T> (static)', fields: ['element : T', 'left : TreeNode<T>', 'right : TreeNode<T>'], methods: ['size(), height(), find()'], tone: 'teal' }));
        items.push(A('ca', 250, 90, 300, 90, { tone: 'muted', label: 'root' }));
        return items;
      }
      var tone = {}; Object.keys(s.seen).forEach(function (i) { tone[i] = 'teal'; }); s.path.forEach(function (i) { tone[i] = 'red'; }); if (s.done != null) tone[s.done] = 'accent';
      items = drawTree(s.t, { tone: s.level ? {} : tone, val: s.val, y0: 30, dy: 54 });
      if (s.path.length) items.push(T('cs', 548, 320, 'calls: ' + s.path.map(function (i) { return s.t[i]; }).join(' → '), { anchor: 'end', mono: true, size: 12, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* ---------- 5. expression trees (slides 37-38) ---------- */
  var ET = ['*', '+', '/', 'a', '3', '–', 'c', null, null, null, null, 'b', '5'];
  function erun(v) { return '// the expression tree of (a + 3) * ((b - 5) / c)\nint a = ' + Math.trunc(v.a) + ', b = ' + Math.trunc(v.b) + ', c = ' + Math.trunc(v.c) + ';\nint result = (a + 3) * ((b - 5) / c);   // evaluated bottom up\nSystem.out.println(result);\n// post-order: a 3 + b 5 – c / *     (postfix)\n// pre-order:  * + a 3 / – b 5 c     (prefix)\n// in-order:   (a + 3) * ((b – 5) / c) (infix, with parentheses)'; }
  var expr = {
    id: 'expr', slides: [37, 38], title: 'An expression tree is evaluated bottom up',
    code: erun,
    inputs: [{ id: 'a', label: 'a', value: 2, min: -9, max: 9 }, { id: 'b', label: 'b', value: 9, min: -9, max: 20 }, { id: 'c', label: 'c', value: 2, min: -5, max: 5 }],
    presets: [{ label: 'a = 2, b = 9, c = 2', values: { a: 2, b: 9, c: 2 } }, { label: 'int division: c = 3', values: { a: 2, b: 9, c: 3 } }, { label: 'c = 0', values: { a: 2, b: 9, c: 0 } }],
    steps: function (v) {
      var a = Math.trunc(v.a), b = Math.trunc(v.b), c = Math.trunc(v.c), st = [], val = {};
      var leafv = { a: a, '3': 3, b: b, '5': 5, c: c };
      var snap = function (o) { o.val = JSON.parse(JSON.stringify(val)); st.push(o); return o; };
      snap({ slide: 37, line: 1, cap: 'An <b>expression tree</b>: operators (*, +, /, –) are internal nodes; operands (a, 3, b, 5, c) are leaves. Each operator works on the values of its two subtrees.' });
      var ev = function (i) {
        var k = kids(ET, i);
        if (k[0] < 0) { val[i] = leafv[ET[i]]; return val[i]; }
        var x = ev(k[0]), y = ev(k[1]), op = ET[i], r;
        if (op === '/' && y === 0) { snap({ slide: 37, line: 3, at: i, err: true, out: 'Exception in thread "main" java.lang.ArithmeticException: / by zero', cap: 'The / node: ' + x + ' / 0. Division by zero: Java throws an <b>ArithmeticException</b>.' }); throw 0; }
        r = op === '*' ? x * y : op === '+' ? x + y : op === '/' ? Math.trunc(x / y) : x - y; val[i] = r;
        snap({ slide: 37, line: 3, at: i, cap: 'The ' + op + ' node: its children are done (' + x + ' and ' + y + '), so ' + x + ' ' + (op === '–' ? '−' : op) + ' ' + y + ' = <b>' + r + '</b>' + (op === '/' && x % y !== 0 ? ' (int division drops the fraction)' : '') + '.' });
        return r;
      };
      try { var res = ev(0); } catch (e) { return st; }
      snap({ slide: 37, line: 4, at: 0, out: String(res), cap: 'The root gives the result: <b>' + res + '</b>. Children before parents: that is a <b>post-order</b> evaluation.' });
      snap({ slide: 38, line: 5, ord: 'post', cap: 'Post-order traversal gives the <b>postfix</b> form: a 3 + b 5 – c / * (the form the stack evaluated in the Stacks unit).' });
      snap({ slide: 38, line: 6, ord: 'pre', cap: 'Pre-order traversal gives the <b>prefix</b> form: * + a 3 / – b 5 c.' });
      snap({ slide: 38, line: 7, ord: 'in', cap: 'In-order traversal, with parentheses added, gives the usual <b>infix</b> form: (a + 3) * ((b – 5) / c).' });
      return st;
    },
    draw: function (k, s) {
      var tone = {}; Object.keys(s.val).forEach(function (i) { tone[i] = 'teal'; }); if (s.at != null) tone[s.at] = s.err ? 'red' : 'accent';
      var items = drawTree(ET, { tone: tone, val: s.val, y0: 30, dy: 60, w: 420, x0: 70 });
      if (s.ord) items.push(T('or', 280, 300, s.ord === 'post' ? 'a 3 + b 5 – c / *' : s.ord === 'pre' ? '* + a 3 / – b 5 c' : '(a + 3) * ((b – 5) / c)', { anchor: 'middle', mono: true, size: 18, bold: true, tone: 'accent' }));
      return items;
    }
  };

  var code = function (t) { return { type: 'code', lang: 'java', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; }, pre = function (t) { return { type: 'code', lang: 'text', text: t }; };
  var OUT = ['Tree Terminology', 'Implementing Trees', 'Tree Traversals', 'Linked Tree Implementation', 'Expression Trees'];
  function outline(on, ex) { return { blocks: OUT.map(function (t, i) { return { type: 'bullet', html: i === on ? '<b>' + t + '</b>' : t }; }), explain: ex }; }

  addUnit({
    course: 'ds', lesson: '10-trees',
    blurb: 'Tree terms, linked and array binary trees, pre-, in-, post- and level-order traversals, a linked binary tree with recursive methods, and expression trees.',
    parts: [
      { title: 'Tree terminology', from: 1, to: 10 },
      { title: 'Implementing trees', from: 11, to: 16 },
      { title: 'Tree traversals', from: 17, to: 23 },
      { title: 'Linked tree implementation', from: 24, to: 35 },
      { title: 'Expression trees', from: 36, to: 38 }
    ],
    visuals: [terms, arrtree, traverse, linkedbt, expr],
    slides: {
      1: { cover: true, explain: '<p>A <b>tree</b> is a <b>non-linear</b> structure: the elements form a {{hierarchy|تسلسل هرمي}}, like a family tree or the folders on a computer.</p><pre class="ex">        A\n      / | \\\n     B  C  D</pre><p>Trees make adding, deleting and searching efficient. This unit: tree terms, two ways to store a binary tree, four traversals, a linked binary tree, and expression trees.</p>' },
      2: outline(-1, '<p>The plan: terms, implementations, traversals, a linked binary tree class, and expression trees.</p>'),
      3: { blocks: [bul('A tree is a non-linear data structure composed of nodes that store the elements and edges that link one node to another.')], explain: '<p>A tree has <b>nodes</b> (they hold the elements) and <b>edges</b> (the links between nodes).</p><pre class="ex">root:     A (the top node)\ninternal: B, D, E, G (they have children)\nleaves:   H, F, C, I, J, K (no children)</pre><p class="watch">Computer trees grow downward: the root is drawn at the top.</p>' },
      4: { explain: '<ul><li>There is only <b>one root</b>, at the top, with no parent.</li><li>The nodes on the next level below a node are its <b>children</b>; it is their <b>parent</b>: B, C, D are children of A.</li><li>An <b>internal</b> node has at least one child; a <b>leaf</b> has none.</li><li>Nodes with the same parent are <b>siblings</b>: E and F.</li></ul><pre class="ex">every node except the root has exactly one parent</pre>' },
      5: { blocks: [bul('Each node appears on a particular level in the tree hierarchy. The root is the only node at level 0.')], explain: '<p>Every node is on a <b>level</b>:</p><pre class="ex">level 0: A\nlevel 1: B, C, D\nlevel 2: E, F, G\nlevel 3: H, I, J, K</pre><p>The root is the only node on level 0. Children are one level below their parent.</p>' },
      6: { explain: '<ul><li>A <b>path</b> goes down from a node to a lower node: A → D → G → J.</li><li>Its <b>length</b> is the number of <b>edges</b>: 3.</li><li>The <b>level</b> of a node = the path length from the root: G is on level 2.</li><li>The <b>height</b> of the tree = the longest path from the root to a leaf: 3.</li></ul><p class="watch">Path length counts edges, not nodes: A → D → G → J has 4 nodes but length 3.</p>' },
      7: { blocks: [bul('A subtree is formed by selecting any node (called the root of the subtree) along with all its descendants (children, grand children, and so on).'), bul('A node is an ancestor of another node if it is on the path from the root.')], explain: '<p>A <b>subtree</b>: any node plus all its {{descendants|الأحفاد}} (children, grandchildren, …). That node is the root of the subtree.</p><pre class="ex">subtree of D: D, G, I, J, K\nancestors of J: A, D, G</pre><p>An <b>ancestor</b> of a node is any node on the path from the root to it. This is why trees fit recursion: every subtree is a tree.</p>' },
      8: { explain: '<p>The <b>degree</b> of a tree is the most children any node may have:</p><pre class="ex">binary tree:  at most 2 children\nternary tree: at most 3\nk-ary tree:   at most k\ngeneral tree: no limit</pre><p>From now on we mostly use <b>binary</b> trees: each node has a left and a right child.</p>' },
      9: { blocks: [bul('A tree is balanced if all the leaf nodes are on the same level or within one level of each other.'), bul('The tree remains balanced in height to maintain efficient operations such as search, insertion, and deletion.')], explain: '<p>A tree is <b>balanced</b> when all leaves are on the same level, or within one level of each other.</p><pre class="ex">balanced: short and wide → few levels\nunbalanced: tall and thin → like a linked list</pre><p>Keeping the height small keeps search, insertion and deletion fast.</p>' },
      10: { blocks: [bul('A k-ary tree is complete if each level l has the maximum number of nodes kˡ, except for the last level in which all the nodes appear to the left side of the tree. If the last level of the tree is also complete, then the tree becomes full.')], explain: '<p><b>Complete</b>: every level is full (k<sup>l</sup> nodes on level l) except maybe the last, and the nodes of the last level are all on the <b>left</b>. <b>Full</b>: the last level is full too.</p><pre class="ex">binary: level 0 → 1 node, level 1 → 2, level 2 → 4</pre><p class="watch">A missing node on the left of the last level makes the tree not complete.</p>' },
      11: outline(1, '<p>Next: how to store a tree in memory.</p>'),
      12: { blocks: [bul('The most obvious implementation is a linked structure.'), bul('Each tree node contains a reference to the element object as well as pointers for each possible child of a node.'), bul('For a binary tree, there is only a left and a right child node. The generic TreeNode<T> class is defined as follows:'), code('class TreeNode<T> {\n  T element;            // pointer to element object\n  TreeNode<T> left;     // pointer to left child\n  TreeNode<T> right;    // pointer to right child\n}')],
        explain: '<p>The usual way: linked nodes. A binary tree node has three references:</p><pre class="ex">element  the data\nleft     the left child (or null)\nright    the right child (or null)</pre><p>It is like a list node, but with two “next” links instead of one.</p>' },
      13: { text: false, blocks: [bul('The tree is implemented using links.')], explain: '<p>The tree A (B (D (F), E), C) as linked nodes: <code>root</code> points to A; each node’s left and right point to its children; missing children are <b>null</b>.</p><pre class="ex">A.left = B, A.right = C\nD.left = F, D.right = null\nC, E, F: both links null (leaves)</pre>' },
      14: { explain: '<p>A binary tree can also live in an <b>array</b>, with no links at all:</p><pre class="ex">root at index 0\nleft child of i  → 2i + 1\nright child of i → 2i + 2</pre><p>The parent of i is at (i − 1) / 2. The array can grow like an array list.</p><p class="watch">It works best for complete trees; gaps in the tree become null cells.</p>' },
      15: { text: false, explain: '<p>The slide’s tree in an array: A at 0, B at 1, C at 2, D (left child of C) at 2·2 + 1 = 5, E and F (children of D) at 11 and 12, G (left child of E) at 2·11 + 1 = 23.</p><pre class="ex">7 elements need 24 cells: 17 are null</pre><p>The drawback: when the tree is not complete, many cells are wasted.</p>' },
      16: { text: false, blocks: [bul('The array indexes the nodes, not the elements (index -1 for no child node).'), bul('The array nodes are added according to request (can appear in any order).'), bul('Each array node indexes its left and right child node.')], explain: '<p><b>Simulated links</b>: each array cell is a node holding the element and the <b>indexes</b> of its left and right child (−1 = no child).</p><pre class="ex">index 0: A, left 1, right 2\nindex 2: C, left 3, right −1</pre><p>Nodes can be stored in any order, and no cells are wasted.</p>' },
      17: outline(2, '<p>Next: the ways to visit all nodes of a tree.</p>'),
      18: { blocks: [bul('For a linear structure, such as a list, the process of iterating through the elements is simple (forward or backward).'), bul('For a tree structure, there are more choices for tree traversal. Each node in the tree becomes the root of a subtree.'), bul('There are four basic methods for traversing a tree:'), bul('Preorder Traversal', 1), bul('Inorder Traversal', 1), bul('Postorder Traversal', 1), bul('Level-order Traversal', 1)],
        explain: '<p>A list has one order (forward or backward). A tree has four basic {{traversals|طرق المرور}}:</p><pre class="ex">pre-order   node, left, right\nin-order    left, node, right\npost-order  left, right, node\nlevel-order level by level</pre><p>The first three are recursive, because every node is the root of a subtree.</p>' },
      19: { blocks: [bul('Pre-order traversal: starting at the root, visit the node, then traverse the subtrees recursively from left to right.'), bul('For a binary tree, the preOrder traversal algorithm is as follows:'), pre('preOrder() {\n  visit();\n  if (left!=null) left.preOrder();\n  if (right!=null) right.preOrder();\n}')],
        explain: '<p><b>Pre-order</b>: visit the node <b>first</b>, then its left subtree, then its right subtree.</p><pre class="ex">A, B, D, E, G, H, C, F</pre><p>A comes first; then all of B’s subtree (B, D, E, G, H) before anything of C’s.</p><p class="watch">“Pre” means the node is visited <b>before</b> its children.</p>' },
      20: { blocks: [bul('In-order traversal: first traverse the left subtree, then visit the node, then traverse the right subtree recursively.'), bul('For a binary tree, the inOrder traversal algorithm is as follows:'), pre('inOrder() {\n  if (left!=null) left.inOrder();\n  visit();\n  if (right!=null) right.inOrder();\n}')],
        explain: '<p><b>In-order</b>: the left subtree, then the node, then the right subtree.</p><pre class="ex">D, B, G, E, H, A, F, C</pre><p>The root A is in the <b>middle</b>: everything of its left subtree is before it, everything of its right subtree after it.</p><p class="watch">F comes before C because F is C’s <b>left</b> child.</p>' },
      21: { blocks: [bul('Post-order traversal: first traverse all the subtrees recursively from left to right, then visit the node.'), bul('For a binary tree, the postOrder traversal algorithm is as follows:'), pre('postOrder () {\n  if (left!=null) left.postOrder();\n  if (right!=null) right.postOrder();\n  visit();\n}')],
        explain: '<p><b>Post-order</b>: both subtrees first, then the node.</p><pre class="ex">D, G, H, E, B, F, C, A</pre><p>The root is <b>last</b>. A node is visited only after all its descendants: useful when children must be handled first (like computing a size, or evaluating an expression).</p>' },
      22: { blocks: [bul('The level-order traversal is also known as breadth-first traversal.'), bul('Starting at the root, visit the root node, then visit all its children at each level from left to right, one level at a time.'), bul('The level-order algorithm uses a queue to traverse a tree.'), bul('It removes the node at the front of the queue, visits this node, then adds all its children at the rear of the queue.')],
        explain: '<p><b>Level-order</b> (breadth-first): level 0, then level 1 from left to right, then level 2, …</p><pre class="ex">A, B, C, D, E, F, G, H</pre><p>It is not recursive: it uses a <b>queue</b>. Remove the front node, visit it, and add its children at the rear.</p>' },
      23: { blocks: [bul('For a binary tree, the levelOrder traversal algorithm is as follows:'), pre(TR[3])], explain: '<p>The algorithm:</p><pre class="ex">add root\nwhile the queue is not empty:\n  node = remove; visit node\n  add node.left, then node.right (if not null)</pre><p>Because the queue is FIFO, all nodes of one level leave before the nodes of the next level.</p><p class="watch">Using a <b>stack</b> instead of a queue would not give level order.</p>' },
      24: outline(3, '<p>Next: a full linked binary tree class.</p>'),
      25: { text: false, blocks: [bul('The Java collection API does not define an interface for a binary tree. A possible set of operations is listed below.')], explain: '<p>Java has no binary tree interface, so we design one:</p><pre class="ex">getRoot  isEmpty  size  height  left  right  find\npreOrder  inOrder  postOrder  levelOrder</pre><p>left() and right() return the subtrees, which are binary trees too. The traversals return a <b>List</b> of the elements in that order.</p>' },
      26: { blocks: [code('package mytree;\nimport java.util.List;\npublic interface BinaryTree<T> {\n  T getRoot();                   // returns root element\n  boolean isEmpty();             // returns true if tree is empty\n  int size();                    // returns number of elements\n  int height();                  // returns height of binary tree\n  BinaryTree<T> left();          // returns left subtree object\n  BinaryTree<T> right();         // returns right subtree object\n  BinaryTree<T> find(T target)   // subtree that contains target\n  List<T> preOrder();            // preorder list of elements\n  List<T> inOrder();             // inorder list of elements\n  List<T> postOrder();           // post-order list of elements\n  List<T> levelOrder();          // level-order list of elements\n}')],
        explain: '<p>The generic interface <code>BinaryTree&lt;T&gt;</code>. Notice that left(), right() and find() return a <b>BinaryTree&lt;T&gt;</b>: a subtree is a tree.</p><pre class="ex">tree.find("E").getRoot()  →  "E"</pre><p class="watch">On the slide, the find line has no <code>;</code> at the end, so as written it does not compile.</p>' },
      27: { title: 'Generic Linked Binary Tree class', blocks: [code('public class LinkedBT<T> implements BinaryTree<T> {\n  protected TreeNode<T> root;   // reference to root node\n  protected static class TreeNode<T> {\n    T element;                  // pointer to element object\n    TreeNode<T> left;           // pointer to left subtree\n    TreeNode<T> right;          // pointer to right subtree\n    // Constructs a tree node object with no children\n    public TreeNode(T element) { this (element, null, null); }\n    // Constructs a tree node with left and right subtrees\n    public TreeNode(T element, TreeNode<T> left, TreeNode<T> right) {\n      this.element = element;\n      this.left = left;\n      this.right = right;\n    }')],
        explain: '<p><b>LinkedBT&lt;T&gt;</b> keeps one field, <code>root</code>. Inside it, the nested class <b>TreeNode&lt;T&gt;</b> has two constructors:</p><pre class="ex">new TreeNode&lt;&gt;("F")              // a leaf\nnew TreeNode&lt;&gt;("D", fNode, null)  // with children</pre><p>The first calls the second with <code>this(element, null, null)</code>.</p><p class="watch">root and TreeNode are <b>protected</b>, not private: subclasses (like a search tree later) can use them.</p>' },
      28: { explain: '<p>TreeNode is a <b>nested static</b> class of LinkedBT: it does not need a LinkedBT object, only its own three references:</p><ol><li>the element (type T);</li><li>the left subtree;</li><li>the right subtree.</li></ol><pre class="ex">TreeNode methods: size(), height(), find(), traversals</pre><p>The real work is done by TreeNode methods that call themselves on left and right.</p>' },
      29: { title: 'Recursive size and height methods', blocks: [code(BT.slice(BT.indexOf('// Recursively computes and returns the number'), BT.indexOf('// Recursively finds')).replace(/\n$/, ''))], explain: '<p>Both are recursive:</p><pre class="ex">size   = left size + right size + 1\nheight = max(left height + 1, right height + 1)</pre><p>A missing child counts 0. A leaf has size 1 and height 0 (no edges below it).</p><p class="watch">In height, the +1 is added only when the child exists: one edge down to it.</p>' },
      30: { title: 'Recursive find method', blocks: [code(BT.slice(BT.indexOf('// Recursively finds'), BT.indexOf('// ---- in LinkedBT')).replace(/\n$/, ''))], explain: '<p>find(target): if this node’s element equals target, return this node. Otherwise search the <b>left</b> subtree; only if not found there, search the <b>right</b> subtree. null means “not here”.</p><pre class="ex">the search order is pre-order: node, left, right</pre><p class="watch">In the worst case (not found), every node is checked: O(n). An ordinary binary tree has no order to guide the search.</p>' },
      31: { title: 'Recursive Tree Traversals', blocks: [code('public void preOrder(List<T> list) {    // Pre-order traversal\n  list.add(element);                     // add element to list\n  if (left != null) left.preOrder(list);    // Recursive call\n  if (right != null) right.preOrder(list);  // Recursive call\n}\npublic void inOrder(List<T> list) {     // In-order traversal\n  if (left != null) left.inOrder(list);     // Recursive call\n  list.add(element);                     // add element to list\n  if (right != null) right.inOrder(list);   // Recursive call\n}\npublic void postOrder(List<T> list) {   // post-order traversal\n  if (left != null) left.postOrder(list);   // Recursive call\n  if (right != null) right.postOrder(list); // Recursive call\n  list.add(element);                     // add element to list\n}')],
        explain: '<p>The three traversals in Java: “visit” means <code>list.add(element)</code>. The <b>same</b> list object is passed down to every call, so all elements end up in one list.</p><pre class="ex">preOrder:  add, left, right\ninOrder:   left, add, right\npostOrder: left, right, add</pre><p>Only the position of <code>list.add</code> changes.</p>' },
      32: { title: 'LinkedBT constructors', blocks: [code('// Constructs an empty linked binary tree\npublic LinkedBT() { root = null; }\n// Constructs a linked binary tree with a root node\npublic LinkedBT(T element) { root = new TreeNode<>(element); }\n// Constructs a linked binary tree with root, left and right subtrees\npublic LinkedBT(T element, LinkedBT<T> left, LinkedBT<T> right) {\n  TreeNode<T> lnode = (left  == null)? null: left.root;\n  TreeNode<T> rnode = (right == null)? null: right.root;\n  root = new TreeNode<>(element, lnode, rnode);\n}\n// Constructs a linked binary tree as a reference to a tree node\nprotected LinkedBT(TreeNode<T> node) { root = node; }')],
        explain: '<p>Four constructors: an empty tree, a one-node tree, a tree from an element and two subtrees, and (protected) a tree that wraps an existing node.</p><pre class="ex">LinkedBT&lt;String&gt; d = new LinkedBT&lt;&gt;("D");\nLinkedBT&lt;String&gt; b = new LinkedBT&lt;&gt;("B", d, null);</pre><p>Trees are built <b>bottom up</b>: children first, then the parent.</p>' },
      33: { title: 'Implementing Linked Tree Methods', blocks: [code('// returns a reference to the root element\npublic T getRoot() { return (root = null)? null: root.element; }\n// returns true if the linked binary tree is empty\npublic boolean isEmpty() { return (root == null); }\n// returns a linked binary tree object for the left subtree\npublic LinkedBT<T> left() {\n  TreeNode<T> left = (root == null)? null : root.left;\n  return new LinkedBT<>(left);\n}\n// returns a linked binary tree object for the right subtree\npublic LinkedBT<T> right() {\n  TreeNode<T> right = (root == null)? null : root.right;\n  return new LinkedBT<>(right);\n}')],
        explain: '<p>getRoot returns the root element; isEmpty checks root == null; left() and right() wrap the child node in a <b>new LinkedBT</b> (the protected constructor), so a subtree can be used like a tree.</p><pre class="ex">tree.left().getRoot()   // the left child’s element</pre><p class="watch">getRoot on the slide uses <code>root = null</code> (assignment) instead of <code>root == null</code>: it does not compile.</p>' },
      34: { title: 'Calling TreeNode Methods', blocks: [code('// Returns the number of nodes in the linked tree\npublic int size() { return (root == null)? 0 : root.size(); }\n// Returns the height of the linked tree\npublic int height() { return (root == null)? 0 : root.height(); }\n// Returns a linked binary tree object that references target node\npublic LinkedBT<T> find(T target) {\n  TreeNode<T> node = (root == null)? null: root.find(target);\n  return new LinkedBT<>(node);\n}\n// Returns a list of elements along the pre-order tree traversal\npublic List<T> preOrder() {\n  List<T> list = new LinkedList<>();\n  if (root != null) root.preOrder(list);\n  return list;\n}')],
        explain: '<p>The LinkedBT methods are short: check for an empty tree, then let the root TreeNode do the recursive work.</p><pre class="ex">size():     root == null ? 0 : root.size()\npreOrder(): make a list, root.preOrder(list), return it</pre><p class="watch">An empty tree and a one-node tree both get height 0 here.</p>' },
      35: { title: 'Non-Recursive Level-Order Traversal', blocks: [code(BT.slice(BT.indexOf('// Returns a list of elements along the level-order')))], explain: '<p>levelOrder in Java: a <b>queue of TreeNodes</b> (Java’s LinkedList used as a Queue) and a list of elements.</p><pre class="ex">add root; while queue not empty:\n  node = remove; list.add(node.element);\n  add node.left, node.right</pre><p class="watch">The queue holds <b>nodes</b>, not elements: we need their left and right links.</p>' },
      36: outline(4, '<p>Last: trees that hold expressions.</p>'),
      37: { text: false, blocks: [bul('An expression tree is a tree that shows the relationship among operators and operands in an expression'), bul('The operators are internal nodes in the tree'), bul('The operands are leaf nodes in the tree'), bul('An expression tree is evaluated from the bottom up')],
        explain: '<p>An <b>expression tree</b>: operators are internal nodes, operands are leaves.</p><pre class="ex">(a + 3) * ((b − 5) / c)\nroot: *   left: a + 3   right: (b − 5) / c</pre><p>It is evaluated <b>bottom up</b>: an operator can be computed only after both of its subtrees have values. No parentheses are needed: the shape of the tree shows the order.</p>' },
      38: { text: false, blocks: [bul('The post-order traversal gives the postfix form of the expression: a 3 + b 5 – c / *'), bul('The pre-order traversal gives the prefix form of the expression: * + a 3 / – b 5 c'), bul('The in-order traversal, with the insertion of parentheses, gives the infix form of the expression: (a + 3) * ((b – 5) / c)')],
        explain: '<p>The three traversals give the three forms of the expression:</p><pre class="ex">post-order → postfix: a 3 + b 5 – c / *\npre-order  → prefix:  * + a 3 / – b 5 c\nin-order   → infix:   (a + 3) * ((b – 5) / c)</pre><p>The postfix form is exactly what the stack algorithm of the Stacks unit evaluates.</p><p class="watch">In-order alone loses the grouping: parentheses must be added.</p>' }
    },
    exam: {
      questions: [
        { q: 'Tree W: R is the root, with K (left) and X (right). K has C (left) and N (right); N has a right child P; X has a left child S. Which nodes are internal nodes?',
          options: ['C, P and S', 'R, K, N and X', 'Only R', 'K, N and X'], answer: 1, review: 3,
          why: 'An internal node has at least one child: R, K, N and X. C, P and S have no children, so they are leaves. The root is also an internal node when it has children (slide 3).',
          lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 1 },
        { type: 'tf', q: 'A binary tree has degree 2: every node has at most 2 children.', answer: true, review: 8,
          why: 'Slide 8: the degree is the maximum number of children per node; binary = 2, ternary = 3, k-ary = k.',
          lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 1 },
        { type: 'match', q: 'Match each traversal with the order in which it visits a node and its subtrees.', review: 18,
          pairs: [['Pre-order', 'node, left subtree, right subtree'], ['In-order', 'left subtree, node, right subtree'], ['Post-order', 'left subtree, right subtree, node'], ['Level-order', 'one level at a time, left to right']],
          why: 'The names say where the node goes: pre = before its subtrees, in = between them, post = after them. Level-order is the breadth-first traversal of slide 22.',
          lessons: ['10-trees'], skills: ['concept'], available_after: '10-trees', level: 1 },
        { q: 'In tree W (R → K, X; K → C, N; N → P (right); X → S (left)), what are the level of N and the height of the tree?',
          options: ['level 2, height 3', 'level 1, height 3', 'level 2, height 2', 'level 3, height 4'], answer: 0, review: 6,
          why: 'N is two edges below the root (R → K → N): level 2. The longest path from the root to a leaf is R → K → N → P: height 3.',
          lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 },
        { q: 'What is the <b>in-order</b> traversal of tree W (R → K, X; K → C, N; N → P (right); X → S (left))?',
          options: ['C, K, N, P, R, S, X', 'C, K, P, N, R, X, S', 'R, K, C, N, P, X, S', 'C, K, N, P, R, X, S'], answer: 0, review: 20,
          why: 'K\'s subtree gives C, K, then N\'s subtree: N has no left child, so N, then P. Then the root R. Then X\'s subtree: its left child S first, then X.',
          lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 },
        { q: 'What is the <b>post-order</b> traversal of tree W?',
          options: ['C, N, P, K, S, X, R', 'C, P, N, K, S, X, R', 'P, C, N, K, S, X, R', 'C, P, N, K, X, S, R'], answer: 1, review: 21,
          why: 'K\'s subtree: C, then N\'s subtree (P, then N), then K. X\'s subtree: S, then X. The root R comes last.',
          lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 },
        { type: 'trace', q: 'levelOrder runs on tree W. Fill in the node removed in each turn and the queue after that turn (front → rear).', review: 35,
          cols: ['turn', 'removed', 'queue after'],
          rows: [['1', '?R', '?K X'], ['2', '?K', '?X C N'], ['3', '?X', '?C N S'], ['4', '?C', '?N S'], ['5', '?N', '?S P'], ['6', '?S', '?P'], ['7', '?P', '?empty']],
          why: 'Each removed node adds its children at the rear. P is added only when N is removed, so it comes after S although it was further left: the order is R, K, X, C, N, S, P, level by level.',
          lessons: ['05-queues', '10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 },
        { type: 'fill', q: 'Complete size() of slide 29.', review: 29,
          code: 'public int size() {\n  int lsize = (left != null)? left.size() : ___;\n  int rsize = (right != null)? right.size() : 0;\n  return lsize + rsize + ___;\n}',
          answer: ['0', '1'],
          why: 'A missing subtree has 0 nodes, and the node itself counts 1. A leaf therefore returns 0 + 0 + 1 = 1.',
          lessons: ['10-trees'], skills: ['design'], available_after: '10-trees', level: 2 },
        { q: 'Tree W is stored with the array implementation (left child at 2i + 1, right child at 2i + 2). At which index is P, the right child of N?',
          options: ['6', '9', '10', '8'], answer: 2, review: 15,
          why: 'R 0, K 1, X 2, C 3, N 4, S 5 (left child of 2). P is the right child of N: 2·4 + 2 = 10. The cells 6 to 9 stay null.',
          lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 2 },
        { type: 'write', q: 'Write the recursive postOrder(List&lt;T&gt; list) method of TreeNode (fields element, left, right).', review: 31,
          rows: 6, starter: 'public void postOrder(List<T> list) {\n  \n}',
          checks: [{ re: /if\s*\(\s*left\s*!=\s*null\s*\)\s*left\.postOrder\s*\(\s*list\s*\)\s*;/, label: 'Visits the left subtree if it exists' },
            { re: /if\s*\(\s*right\s*!=\s*null\s*\)\s*right\.postOrder\s*\(\s*list\s*\)\s*;/, label: 'Visits the right subtree if it exists' },
            { re: /right\.postOrder\s*\(\s*list\s*\)\s*;\s*list\.add\s*\(\s*element\s*\)\s*;/, label: 'Adds the element <b>after</b> both subtrees' },
            { re: /left\.postOrder[\s\S]*right\.postOrder/, label: 'Left subtree before the right one' }],
          solution: 'public void postOrder(List<T> list) {\n  if (left != null) left.postOrder(list);\n  if (right != null) right.postOrder(list);\n  list.add(element);\n}',
          why: 'Post-order: both subtrees, from left to right, then the node. The null tests stop the recursion at the missing children.',
          lessons: ['10-trees'], skills: ['design'], available_after: '10-trees', level: 2 },
        { q: 'In tree W, how many nodes does `find("S")` compare with the target, counting S itself?',
          options: ['3', '6', '7', '2'], answer: 2, review: 30,
          why: 'find follows the pre-order: R, K, C, N, P (the whole left subtree, nothing found), then X, then S. Seven comparisons, although S is only 2 levels down: find is O(n), it cannot jump to the right half.',
          lessons: ['10-trees'], skills: ['trace', 'complexity'], available_after: '10-trees', level: 3 },
        { q: 'A binary tree has the pre-order G, H, I and the in-order G, I, H. What is its post-order?',
          options: ['I, H, G', 'G, H, I', 'H, I, G', 'I, G, H'], answer: 0, review: 20,
          why: 'G is the root, and it is first in the in-order, so it has no left subtree: H and I are on its right. In that subtree H comes first in pre-order, so H is its root, and I is left of H (I comes before H in the in-order). Post-order: I, H, G.',
          lessons: ['10-trees'], skills: ['trace'], available_after: '10-trees', level: 3 },
        { q: 'An expression tree has / at the root, with + (9, 3) on the left and − (7, 5) on the right. Its post-order is evaluated with a stack (unit 3). What is on the stack (bottom → top) just before the last operator is processed?',
          options: ['12, 2', '9, 3, 2', '6', '12, 7, 5'], answer: 0, review: 38,
          why: 'Post-order: 9 3 + 7 5 − /. Push 9, 3; + gives 12. Push 7, 5; − gives 2. The stack is 12, 2, and the final / gives 6: the value of (9 + 3) / (7 − 5).',
          lessons: ['03-stacks', '10-trees'], skills: ['trace'], available_after: '10-trees', level: 3 },
        { q: 'A LinkedBT `t` has one node. Which statement is true?',
          options: ['t.size() is 1 and t.height() is 0, the same height as an empty tree', 't.size() is 1 and t.height() is 1', 't.left() returns null', 't.size() is 0'], answer: 0, review: 34,
          why: 'size() counts the node: 1. height() counts edges, and a single node has none: 0, which is also what an empty LinkedBT returns. left() returns an empty LinkedBT object, not null.',
          lessons: ['10-trees'], skills: ['edge_case'], available_after: '10-trees', level: 3 }
      ],
      tasks: [
        {
          title: 'Counting the leaves',
          task: '<p>Write a recursive method <code>public int countLeaves()</code> for the slides\' <code>TreeNode&lt;T&gt;</code> (fields <code>element</code>, <code>left</code>, <code>right</code>). A node with no children is a leaf and returns 1. Otherwise return the sum of the leaves of the children that exist. No loops.</p>',
          starter: 'public int countLeaves() {\n  \n}',
          checks: [
            { re: /if\s*\(\s*left\s*==\s*null\s*&&\s*right\s*==\s*null\s*\)\s*return\s+1\s*;/, label: 'A leaf returns 1', review: 4 },
            { re: /left\s*!=\s*null[\s\S]*left\.countLeaves\s*\(\s*\)/, label: 'Counts the left subtree when it exists', review: 29 },
            { re: /right\s*!=\s*null[\s\S]*right\.countLeaves\s*\(\s*\)/, label: 'Counts the right subtree when it exists', review: 29 },
            { fn: function (c) { return !/\b(for|while)\b/.test(c); }, label: 'No loop', review: 29 }
          ],
          solution: 'public int countLeaves() {\n  if (left == null && right == null) return 1;\n  int n = 0;\n  if (left != null) n += left.countLeaves();\n  if (right != null) n += right.countLeaves();\n  return n;\n}'
        },
        {
          title: 'Level-order with a queue',
          task: '<p>Write <code>public List&lt;T&gt; levelOrder()</code> for <code>LinkedBT&lt;T&gt;</code> (field <code>root</code>; nodes have <code>element</code>, <code>left</code>, <code>right</code>). Use a <code>List&lt;T&gt;</code> for the result and a <code>Queue&lt;TreeNode&lt;T&gt;&gt;</code>, both <code>new LinkedList&lt;&gt;()</code>. Add the root if the tree is not empty; then, while the queue is not empty, remove the front node, add its element to the list, and add its left and right children that exist. Return the list.</p>',
          starter: 'public List<T> levelOrder() {\n  \n}',
          checks: [
            { re: /Queue\s*<\s*TreeNode\s*<\s*T\s*>\s*>\s+(\w+)\s*=\s*new\s+LinkedList\s*<\s*>\s*\(\s*\)\s*;/, label: 'A <code>Queue&lt;TreeNode&lt;T&gt;&gt;</code>', review: 35 },
            { re: /if\s*\(\s*root\s*!=\s*null\s*\)\s*\w+\.add\s*\(\s*root\s*\)\s*;/, label: 'Adds the root only if the tree is not empty', review: 35 },
            { re: /while\s*\(\s*!\s*\w+\.isEmpty\s*\(\s*\)\s*\)/, label: 'Loops while the queue is not empty', review: 35 },
            { re: /TreeNode\s*<\s*T\s*>\s+(\w+)\s*=\s*\w+\.remove\s*\(\s*\)\s*;/, label: 'Removes the front node', review: 35 },
            { re: /\w+\.add\s*\(\s*\w+\.element\s*\)\s*;/, label: 'Adds its element to the list', review: 35 },
            { re: /if\s*\(\s*\w+\.left\s*!=\s*null\s*\)\s*\w+\.add\s*\(\s*\w+\.left\s*\)\s*;[\s\S]*if\s*\(\s*\w+\.right\s*!=\s*null\s*\)\s*\w+\.add\s*\(\s*\w+\.right\s*\)\s*;/, label: 'Adds the left child, then the right child', review: 35 },
            { re: /return\s+\w+\s*;/, label: 'Returns the list', review: 35 }
          ],
          solution: 'public List<T> levelOrder() {\n  List<T> list = new LinkedList<>();\n  Queue<TreeNode<T>> queue = new LinkedList<>();\n  if (root != null) queue.add(root);\n  while (!queue.isEmpty()) {\n    TreeNode<T> node = queue.remove();\n    list.add(node.element);\n    if (node.left != null) queue.add(node.left);\n    if (node.right != null) queue.add(node.right);\n  }\n  return list;\n}'
        }
      ]
    }
  });
})();
