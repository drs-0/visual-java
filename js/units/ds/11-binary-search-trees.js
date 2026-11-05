/* Data Structures · Unit 11 Binary Search Trees (39 slides): the BST rule, adding and searching, the three cases of
   removing a node, the LinkedBST class (add, find, remove, findMin, findMax, removeMin), height and cost, degenerate
   trees, right / left / RightLeft / LeftRight rotations and AVL trees with balance factors */
(function () {
  function L(src, frag, nth) { var ls = src.split('\n'), c = 0; for (var i = 0; i < ls.length; i++) if (ls[i].indexOf(frag) >= 0 && ++c === (nth || 1)) return i + 1; throw new Error('no line ' + frag); }
  function nums(s, max) { return String(s).split(/[\s,;]+/).filter(function (x) { return /^-?\d{1,3}$/.test(x); }).map(Number).slice(0, max || 16); }

  /* ---------- a small BST library: nodes keep a stable id, so a node slides when the tree changes ---------- */
  var UID = 0;
  function mk(v) { return { id: ++UID, v: v, l: null, r: null }; }
  function cp(n) { return n ? { id: n.id, v: n.v, l: cp(n.l), r: cp(n.r) } : null; }
  function ht(n) { return n ? 1 + Math.max(ht(n.l), ht(n.r)) : -1; }
  function bfac(n) { return ht(n.r) - ht(n.l); }
  function cnt(n) { return n ? 1 + cnt(n.l) + cnt(n.r) : 0; }
  function inorder(n, o) { o = o || []; if (n) { inorder(n.l, o); o.push(n); inorder(n.r, o); } return o; }
  function sub(n, o) { o = o || {}; if (n) { o[n.id] = 1; sub(n.l, o); sub(n.r, o); } return o; }
  /* add as in any BST; returns the root and the values met on the way */
  function addBST(root, v, way) { var n = mk(v); if (!root) return n; var c = root; for (;;) { if (way) way.push(c); if (v < c.v) { if (!c.l) { c.l = n; break; } c = c.l; } else { if (!c.r) { c.r = n; break; } c = c.r; } } return root; }
  function build(seq) { UID = 0; var r = null; seq.forEach(function (v) { r = addBST(r, v); }); return r; }
  function findParent(t, n) { if (!t) return null; if (t.l === n || t.r === n) return t; return findParent(t.l, n) || findParent(t.r, n); }
  function relink(root, p, old, nu) { if (!p) return nu; if (p.l === old) p.l = nu; else p.r = nu; return root; }
  function hs(n) { return n ? String(ht(n)) : '−1 (empty)'; }
  function sign(x) { return x > 0 ? '+' + x : x < 0 ? '−' + (-x) : '0'; }

  function layoutT(root, o) {
    var list = inorder(root), n = list.length, pos = {}, lv = ht(root) + 1;
    var W = o.w || 540, x0 = o.x0 != null ? o.x0 : 30, gap = n > 1 ? Math.min(o.gmax || 60, W / (n - 1)) : 0, left = x0 + (W - gap * (n - 1)) / 2;
    var dy = Math.min(o.dy || 52, (o.hmax || 250) / Math.max(lv - 1, 1));
    var walk = function (t, d) { if (!t) return; pos[t.id] = { d: d }; walk(t.l, d + 1); walk(t.r, d + 1); };
    walk(root, 0);
    list.forEach(function (t, i) { pos[t.id].x = left + i * gap; pos[t.id].y = (o.y0 || 24) + pos[t.id].d * dy; });
    return { pos: pos, gap: gap, dy: dy };
  }
  /* o: tone {id: tone}, etone {childId: tone}, title(t), nw, hide {childId: no edge}, float {id: dy}, shape */
  function drawT(root, o) {
    o = o || {}; var out = [], lay = layoutT(root, o), pos = lay.pos;
    var nw = o.nw || (lay.gap ? Math.min(40, Math.max(22, 2 * lay.gap - 6)) : 40), nh = Math.min(28, lay.dy - 8);
    var Y = function (t) { return pos[t.id].y + ((o.float && o.float[t.id]) || 0); };
    var walk = function (t) {
      if (!t) return; var p = pos[t.id], tn = (o.tone && o.tone[t.id]) || 'blue';
      out.push(B('n' + t.id, p.x - nw / 2, Y(t), nw, nh, { title: o.title ? o.title(t) : String(t.v), mono: true, size: o.size || (nh < 24 || nw < 30 ? 11 : 13), shape: o.shape === 'box' ? undefined : 'oval', tone: tn, fill: tn === 'accent' ? 'solid' : 'soft', hi: tn === 'accent', o: o.dim && o.dim[t.id] ? 0.35 : 1 }));
      [t.l, t.r].forEach(function (c, j) { if (c && !(o.hide && o.hide[c.id])) out.push(A('e' + c.id, p.x + (j ? 6 : -6), Y(t) + nh, pos[c.id].x, Y(c), { tone: (o.etone && o.etone[c.id]) || 'muted' })); });
      walk(t.l); walk(t.r);
    };
    walk(root);
    if (!root) out.push(T('empty', (o.x0 != null ? o.x0 : 30) + (o.w || 540) / 2, 120, '(empty tree: root = null)', { anchor: 'middle', mono: true, size: 14, tone: 'muted' }));
    return out;
  }
  function status(lines, y) { return lines.map(function (s, i) { return T('st' + i, 20, y + i * 24, s[0], { mono: true, size: 13, bold: true, tone: s[1] || 'muted' }); }); }
  function corner(lines) { return lines.map(function (s, i) { return T('cn' + i, 580, 26 + i * 20, s, { anchor: 'end', mono: true, size: 12, bold: true, tone: i ? 'teal' : 'accent' }); }); }

  var S4 = '45 12 69 7 15 51 70 14 39 81 33 42 25 38 44';
  var S11 = '45 12 69 7 15 51 70 4 14 39 47 68 81 12 33 42 49 95 25 38 44';

  /* ---------- 1. is it a BST? (slides 3-4) ---------- */
  var VC = 'BST rule, for every node:\n  left subtree:  elements <  node\n  right subtree: elements >= node\ncheck(node, low, high):        // the range allowed here\n  if node == null: return true\n  if node < low or node >= high: return false\n  return check(node.left, low, node)\n     and check(node.right, node, high)\ncheck(root, −∞, +∞)';
  function rng(lo, hi) { return '[' + (lo == null ? '−∞' : lo) + ', ' + (hi == null ? '+∞' : hi) + ')'; }
  var valid = {
    id: 'valid', slides: [3, 4], title: 'Is it a binary search tree? Every node has an allowed range', lang: 'text', vb: [600, 380],
    code: VC,
    inputs: [{ id: 't', type: 'text', label: 'tree (added in this order)', value: S4, minlen: 1, maxlen: 80 }, { id: 'ch', type: 'text', label: 'then change (old=new)', value: '', minlen: 0, maxlen: 9 }],
    inputsLabel: 'The tree is built by adding the numbers in order. The change (like <code>38=40</code>) may break the rule.',
    presets: [{ label: 'slide 4 tree', values: { t: S4, ch: '' } }, { label: 'change 38 to 40', values: { t: S4, ch: '38=40' } }, { label: 'change 51 to 44', values: { t: S4, ch: '51=44' } }, { label: 'equal on the right: 14 to 12', values: { t: S4, ch: '14=12' } }, { label: 'equal on the left: 7 to 12', values: { t: S4, ch: '7=12' } }],
    steps: function (v) {
      var root = build(nums(v.t, 20)), st = [], m = String(v.ch).match(/^\s*(-?\d{1,3})\s*(?:=|->|→|to)\s*(-?\d{1,3})\s*$/), chId = null, note = '';
      if (m) { var hit = inorder(root).filter(function (t) { return t.v === +m[1]; })[0]; if (hit) { hit.v = +m[2]; chId = hit.id; note = ' The value ' + m[1] + ' was changed to <b>' + m[2] + '</b> (red outline).'; } else note = ' ' + m[1] + ' is not in the tree, so nothing was changed.'; }
      var ok = {}, snap = function (o) { o.t = cp(root); o.ok = JSON.parse(JSON.stringify(ok)); o.ch = chId; st.push(o); return o; };
      var side = {}; if (root) { side[root.id] = 'accent'; Object.keys(sub(root.l)).forEach(function (k) { side[k] = 'blue'; }); Object.keys(sub(root.r)).forEach(function (k) { side[k] = 'teal'; }); }
      snap({ slide: 3, line: '1-3', side: side, cap: 'The BST rule: for <b>every</b> node, the elements in its left subtree are smaller, and the elements in its right subtree are greater or equal. Root ' + (root ? root.v : '') + ': its left subtree is blue, its right subtree is green.' + note });
      snap({ slide: 4, line: 9, cap: 'To check the whole tree, give every node a <b>range</b> of allowed values. The root may be anything: ' + rng(null, null) + '.' });
      var bad = null;
      var chk = function (t, lo, hi, why) {
        if (!t || bad) return true;
        var good = (lo == null || t.v >= lo) && (hi == null || t.v < hi);
        if (!good) { bad = t; snap({ slide: 4, line: 6, at: t.id, bad: t.id, range: t.v + ' must be in ' + rng(lo, hi), cap: '<b>' + t.v + '</b> must be in ' + rng(lo, hi) + why + ', but it is not. This is <b>not</b> a binary search tree.' }); return false; }
        ok[t.id] = 1;
        snap({ slide: 4, line: '6-8', at: t.id, range: t.v + ' in ' + rng(lo, hi) + ' ✓', cap: t.v + ' is in ' + rng(lo, hi) + ': good. Its left child must be in ' + rng(lo, t.v) + ', its right child in ' + rng(t.v, hi) + '.' });
        return chk(t.l, lo, t.v, ' (it is in the left subtree of ' + t.v + ')') && chk(t.r, t.v, hi, ' (it is in the right subtree of ' + t.v + ')');
      };
      var res = chk(root, null, null, '');
      if (res) snap({ slide: 4, line: 9, done: true, cap: 'Every node is inside its range: this <b>is</b> a valid binary search tree.' + (chId ? ' (A value equal to a node may sit in its <b>right</b> subtree.)' : '') });
      else {
        var p = findParent(root, bad);
        snap({ slide: 4, line: 6, bad: bad.id, cap: p && ((bad === p.l && bad.v < p.v) || (bad === p.r && bad.v >= p.v)) ? 'Watch out: ' + bad.v + ' looks fine next to its parent ' + p.v + ', but it breaks the rule with a node higher up. Checking only parent and child is <b>not enough</b>.' : bad.v + ' is on the wrong side of its own parent' + (p ? ' ' + p.v : '') + '.' + (p && bad === p.l && bad.v === p.v ? ' An <b>equal</b> value must go to the right, not the left.' : '') });
      }
      return st;
    },
    draw: function (k, s) {
      var tone = {}; Object.keys(s.ok).forEach(function (i) { tone[i] = 'teal'; }); if (s.side) tone = s.side; if (s.at) tone[s.at] = 'accent'; if (s.bad) tone[s.bad] = 'red'; if (s.ch && !s.bad && !s.side) tone[s.ch] = tone[s.ch] || 'red';
      if (s.ch && s.side) tone[s.ch] = 'red';
      var items = drawT(s.t, { tone: tone, w: 540, x0: 30, y0: 22, hmax: 250 });
      if (s.range) items.push(T('rg', 300, 340, s.range, { anchor: 'middle', mono: true, size: 16, bold: true, tone: s.bad ? 'red' : 'accent' }));
      if (s.done) items.push(T('rg', 300, 340, 'valid BST ✓', { anchor: 'middle', mono: true, size: 16, bold: true, tone: 'teal' }));
      items.push(T('lg', 300, 368, s.side ? 'orange: root · blue: left subtree (smaller) · green: right subtree (greater or equal)' : 'green: checked · orange: now · red: breaks the rule', { anchor: 'middle', size: 11, tone: 'muted' }));
      return items;
    }
  };

  /* ---------- 2. adding and searching (slides 5-8) ---------- */
  var AC = 'add(x):\n  if the tree is empty: x becomes the root\n  node = root\n  repeat:\n    if x < node: no left child?  x becomes the left child, stop\n                 else node = node.left\n    else:        no right child? x becomes the right child, stop\n                 else node = node.right\nsearch(target):\n  node = root\n  while node != null:\n    if target == node: found, stop\n    if target < node: node = node.left\n    else: node = node.right\n  not found (the path ended)';
  var addsearch = {
    id: 'addsearch', slides: [5, 8], title: 'Adding and searching: one path from the root', lang: 'text', vb: [600, 380],
    code: AC,
    inputs: [{ id: 't', type: 'text', label: 'start tree', value: '', minlen: 0, maxlen: 80 }, { id: 'a', type: 'text', label: 'add', value: '5 7 3 4', minlen: 0, maxlen: 30 }, { id: 's', label: 'search for', value: 4, min: -99, max: 999 }],
    inputsLabel: 'The start tree is built from its numbers in order (empty = no tree). Then the "add" numbers are added one by one.',
    presets: [{ label: 'slide 5: add 5, 7, 3, 4', values: { t: '', a: '5 7 3 4', s: 4 } }, { label: 'slide 6: add to a big tree', values: { t: S4, a: '47 68 12 4 75', s: 33 } }, { label: 'search a missing value', values: { t: S4, a: '', s: 40 } }, { label: 'equal values go right', values: { t: '20 10 30', a: '20 20', s: 20 } }],
    steps: function (v) {
      var root = build(nums(v.t, 20)), add = nums(v.a, 8), x = Math.trunc(v.s), st = [], cmp = 0, path = [], fresh = null, slideA = root ? 6 : 5;
      var snap = function (o) { o.t = cp(root); o.path = path.slice(); o.fresh = fresh; o.cmp = cmp; o.h = ht(root); o.n = cnt(root); st.push(o); return o; };
      snap({ slide: slideA, line: 1, cap: root ? 'The start tree: ' + cnt(root) + ' nodes, height ' + ht(root) + '. Each new element follows <b>one path</b> down from the root and becomes a new leaf.' : 'The tree is empty. Each new element follows one path down from the root and becomes a new <b>leaf</b>.' });
      add.forEach(function (e) {
        cmp = 0; path = []; fresh = null;
        if (!root) { root = mk(e); fresh = root.id; snap({ slide: slideA, line: 2, cap: 'add ' + e + ': the tree is empty, so <b>' + e + '</b> becomes the root.' }); return; }
        var c = root;
        for (;;) {
          path.push(c.id); cmp++;
          var lt = e < c.v, nx = lt ? c.l : c.r;
          if (!nx) {
            var n = mk(e); if (lt) c.l = n; else c.r = n; fresh = n.id;
            snap({ slide: slideA, line: lt ? 5 : 7, at: c.id, cap: 'add ' + e + ': ' + e + (lt ? ' &lt; ' : ' ≥ ') + c.v + ' and ' + c.v + ' has no ' + (lt ? 'left' : 'right') + ' child, so <b>' + e + '</b> becomes its ' + (lt ? 'left' : 'right') + ' child (' + cmp + ' comparison' + (cmp === 1 ? '' : 's') + ').' + (e === c.v ? ' Equal goes <b>right</b>.' : '') });
            break;
          }
          snap({ slide: slideA, line: lt ? '5-6' : '7-8', at: c.id, cap: 'add ' + e + ': ' + e + (lt ? ' &lt; ' : ' ≥ ') + c.v + ', go <b>' + (lt ? 'left' : 'right') + '</b> to ' + nx.v + '.' + (e === c.v ? ' (equal goes right)' : '') });
          c = nx;
        }
      });
      if (add.length) { path = []; fresh = null; snap({ slide: slideA, line: 4, cap: 'All added. The tree is still a BST: nothing above was moved. Each add was one path: at most height + 1 = ' + (ht(root) + 1) + ' comparisons, O(log₂ n) when the tree is balanced.' }); }
      cmp = 0; path = []; fresh = null;
      snap({ slide: 7, line: 10, cap: 'search(' + x + '): start at the root.' });
      var c2 = root, found = false;
      while (c2) {
        path.push(c2.id); cmp++;
        if (x === c2.v) { found = true; snap({ slide: 8, line: 12, at: c2.id, hitf: c2.id, cap: x + ' == ' + c2.v + ': <b>found</b> after ' + cmp + ' comparison' + (cmp === 1 ? '' : 's') + '.' }); break; }
        var lt2 = x < c2.v;
        snap({ slide: 8, line: lt2 ? 13 : 14, at: c2.id, cap: x + (lt2 ? ' &lt; ' : ' &gt; ') + c2.v + ': go <b>' + (lt2 ? 'left' : 'right') + '</b>' + ((lt2 ? c2.l : c2.r) ? ' to ' + (lt2 ? c2.l : c2.r).v + '.' : ', but there is no ' + (lt2 ? 'left' : 'right') + ' child.') });
        c2 = lt2 ? c2.l : c2.r;
      }
      if (!found) snap({ slide: 8, line: 15, cap: 'The path ended at null: ' + x + ' is <b>not in the tree</b>. ' + cmp + ' comparison' + (cmp === 1 ? '' : 's') + ', never more than height + 1.' });
      return st;
    },
    draw: function (k, s) {
      var tone = {}; s.path.forEach(function (i) { tone[i] = 'red'; }); if (s.at) tone[s.at] = 'accent'; if (s.fresh) tone[s.fresh] = 'teal'; if (s.hitf) tone[s.hitf] = 'accent';
      var et = {}; s.path.forEach(function (i, j) { if (j) et[i] = 'red'; }); if (s.fresh) et[s.fresh] = 'teal';
      var items = drawT(s.t, { tone: tone, etone: et, w: 520, x0: 20, y0: 22, hmax: 250 });
      return items.concat(corner([s.n + ' nodes · height ' + s.h, 'comparisons: ' + s.cmp]));
    }
  };

  /* ---------- 3. removing a node: three cases (slides 10-17) ---------- */
  var RC = 'remove(target):\n  find the node: go left if smaller, right if larger\n  Case 1: the node is a leaf\n    cut the link from its parent\n  Case 2: the node has one child\n    relink its parent to that child\n  Case 3: the node has two children\n    successor = the smallest element in the right subtree\n      (go right once, then left until there is no left child)\n    copy the successor\'s element into the node\n    remove the successor node as in case 1 or 2';
  var remove = {
    id: 'remove', slides: [10, 17], title: 'Removing a node: leaf, one child, two children', lang: 'text', vb: [600, 380],
    code: RC,
    inputs: [{ id: 't', type: 'text', label: 'tree (added in this order)', value: S11, minlen: 1, maxlen: 90 }, { id: 'x', type: 'text', label: 'remove', value: '44', minlen: 0, maxlen: 20 }],
    inputsLabel: 'Numbers to remove, one after the other.',
    presets: [{ label: 'case 1: leaf 44', values: { t: S11, x: '44' } }, { label: 'case 2: 70 (one child)', values: { t: S11, x: '70' } }, { label: 'case 3: 45 (two children)', values: { t: S11, x: '45' } }, { label: 'all three, one after the other', values: { t: S11, x: '44 70 45' } }, { label: 'not in the tree', values: { t: S11, x: '50' } }, { label: 'the root with one child', values: { t: '30 50 40 60', x: '30' } }],
    steps: function (v) {
      var root = build(nums(v.t, 24)), xs = nums(v.x, 6), st = [], path = [];
      var snap = function (o) { o.t = cp(root); o.path = o.path || path.slice(); st.push(o); return o; };
      snap({ slide: 10, line: 1, cap: 'After removing a node, the tree must still be a valid BST. There are <b>three cases</b>, depending on how many children the node has.' });
      if (!xs.length) snap({ slide: 11, line: 1, cap: 'Type a number to remove.' });
      xs.forEach(function (x) {
        path = []; var c = root, par = null;
        while (c && c.v !== x) { path.push(c.id); par = c; c = x < c.v ? c.l : c.r; }
        if (!c) { snap({ slide: 11, line: 2, cap: 'remove ' + x + ': the search path ends at null. ' + x + ' is <b>not in the tree</b>: nothing changes.' }); return; }
        snap({ slide: 11, line: 2, at: c.id, cap: 'remove ' + x + ': ' + (path.length ? 'follow the path ' + path.map(function (i) { return inorder(root).filter(function (t) { return t.id === +i; })[0].v; }).join(' → ') + ' → ' + x : x + ' is the root') + '. It has <b>' + ((c.l ? 1 : 0) + (c.r ? 1 : 0)) + '</b> child' + ((c.l ? 1 : 0) + (c.r ? 1 : 0) === 1 ? '' : 'ren') + '.' });
        if (!c.l && !c.r) {
          snap({ slide: 12, line: '3-4', at: c.id, cut: c.id, cap: 'Case 1: ' + x + ' is a <b>leaf</b>. Just cut the link ' + (par ? 'from its parent ' + par.v : '(it is the only node: the tree becomes empty)') + '.' });
          root = relink(root, par, c, null);
          snap({ slide: 12, line: 4, cap: x + ' is gone. Nothing else moved, and the tree is still a BST.' });
        } else if (!c.l || !c.r) {
          var ch = c.l || c.r;
          snap({ slide: 13, line: '5-6', at: c.id, kid: Object.keys(sub(ch)), cut: c.id, cap: 'Case 2: ' + x + ' has <b>one child</b> (' + ch.v + '). ' + (par ? 'Relink its parent ' + par.v + ' straight to ' + ch.v + '.' : 'It is the root, so ' + ch.v + ' becomes the new root.') });
          root = relink(root, par, c, ch);
          snap({ slide: 14, line: 6, kid: Object.keys(sub(ch)), cap: ch.v + ' and its subtree moved up one level. ' + (par ? 'They were all on the ' + (par.l === ch ? 'left' : 'right') + ' side of ' + par.v + ', and they still are' : 'The new root is ' + ch.v) + ': the tree is still a BST.' });
        } else {
          snap({ slide: 15, line: 7, at: c.id, cap: 'Case 3: ' + x + ' has <b>two children</b>. We cannot remove the node itself. Instead we find its <b>in-order successor</b>: the smallest element in its right subtree.' });
          var sp = [c.id], sc = c.r, spar = c; sp.push(sc.id);
          snap({ slide: 15, line: 9, at: sc.id, path: sp.slice(), cap: 'Go right once, to ' + sc.v + '.' });
          while (sc.l) { spar = sc; sc = sc.l; sp.push(sc.id); snap({ slide: 15, line: 9, at: sc.id, path: sp.slice(), cap: 'Go left to ' + sc.v + '.' + (sc.l ? '' : ' It has no left child: <b>' + sc.v + '</b> is the successor.') }); }
          if (spar === c) snap({ slide: 15, line: 9, at: sc.id, path: sp.slice(), cap: sc.v + ' has no left child, so it is the successor itself.' });
          var old = c.v; c.v = sc.v;
          snap({ slide: 15, line: 10, at: c.id, succ: sc.id, path: sp.slice(), cap: 'Copy ' + sc.v + ' into the node: ' + old + ' is replaced by <b>' + sc.v + '</b>. Everything on the left is still smaller, and everything on the right is still ≥ ' + sc.v + '.' });
          var only = sc.r;
          snap({ slide: 15, line: 11, succ: sc.id, cut: sc.id, path: sp.slice(), cap: 'Now remove the old ' + sc.v + ' node. It has no left child, so it is ' + (only ? 'case 2: relink ' + spar.v + ' to its child ' + only.v : 'case 1: a leaf, just cut it') + '.' });
          root = relink(root, spar, sc, only);
          snap({ slide: 16, line: 11, at: c.id, path: [], cap: 'Done: ' + old + ' is gone and ' + sc.v + ' took its place. The successor is always in the right subtree and never has a left child, so removing it is easy.' });
        }
      });
      path = [];
      snap({ slide: 17, line: '3-11', cap: 'Summary: a leaf is cut, a node with one child is replaced by that child, and a node with two children takes the element of its in-order successor, which is then removed as in case 1 or 2.' });
      return st;
    },
    draw: function (k, s) {
      var tone = {}, et = {}; s.path.forEach(function (i) { tone[i] = 'red'; }); (s.kid || []).forEach(function (i) { tone[i] = 'teal'; });
      if (s.at) tone[s.at] = 'accent'; if (s.succ) tone[s.succ] = 'teal'; if (s.cut) { tone[s.cut] = 'red'; et[s.cut] = 'red'; }
      var items = drawT(s.t, { tone: tone, etone: et, w: 540, x0: 30, y0: 22, hmax: 250 });
      return items.concat(corner([cnt(s.t) + ' nodes · height ' + ht(s.t)]));
    }
  };

  /* ---------- 4. LinkedBST in Java (slides 20-26) ---------- */
  var IM = '// ---- in LinkedBST<T extends Comparable<T>> ----\npublic void add(T element) {\n if (root == null) root = new TreeNode<>(element);\n else add(root, element);\n}\nprivate void add(TreeNode<T> node, T element) {\n  if (element.compareTo(node.element) < 0) {\n    if (node.left == null) node.left = new TreeNode<>(element);\n    else add(node.left, element);        // Recursive call\n  }\n  else {\n    if (node.right == null) node.right = new TreeNode<>(element);\n    else add(node.right, element);       // Recursive call\n  }\n}\npublic BinaryTree<T> find(T target) {\n  TreeNode<T> node = root;\n  while (node != null) {\n    if (target.equals(node.element)) break;\n    if (target.compareTo(node.element) < 0) node = node.left;\n    else node = node.right;\n  }\n  return new LinkedTree<>(node);\n}\npublic void remove(T target) { root = remove(root, target); }\nprivate TreeNode<T> remove(TreeNode<T> node, T target) {\n  if (node == null) return null;\n  if (target.compareTo(node.element) < 0)        // target is smaller\n    node.left = remove(node.left, target);       // recursive call\n  else if (target.compareTo(node.element) > 0)   // target is larger\n    node.right = remove(node.right, target);     // recursive call\n  else { // target is equal to node.element\n    // Case 1: Node with only one child or no child\n    if (node.left == null) return node.right;    // No left child\n    if (node.right == null) return node.left;    // No right child\n    // Case 2: Node with two children\n    node.element = findMin(node.right);          // find min in right subtree\n    node.right = remove(node.right, node.element); // recursive call\n  }\n  return node;\n}\npublic T findMin() {\n  if (root == null) return null;               // empty tree\n  TreeNode<T> node = root;                     // root node\n  while (node.left != null) node = node.left;  // leftmost node\n  return node.element;\n}\npublic T findMax() {\n  if (root == null) return null;               // empty tree\n  TreeNode<T> node = root;                     // root node;\n  while (node.right != null) node = node.right; // rightmost node\n  return node.element;\n}\npublic T removeMin() {                 // Removes the minimum element node\n  if (root == null) return null;       // empty tree\n  if (root.left == null) {             // if no left child\n    T element = root.element;          // then root has the minimum\n    root = root.right;                 // root points to right child\n    return element;\n  }\n  TreeNode<T> parent = root;           // parent = root node\n  TreeNode<T> curr = root.left;        // current = left child\n  while (curr.left != null) {          // current has a left child\n    parent = curr;\n    curr = curr.left;                  // leftmost node contains minimum\n  }\n  parent.left = curr.right;            // remove the minimum element node\n  return curr.element;\n}\n// ---- main ----\nLinkedBST<Integer> tree = new LinkedBST<>();';
  function parseOps(s) {
    var out = [], re = /(removemin|remove|findmin|findmax|find|add|min|max)\s*\(?\s*(-?\d{1,3})?/gi, m;
    while ((m = re.exec(String(s))) && out.length < 8) {
      var op = m[1].toLowerCase(); if (op === 'findmin') op = 'min'; if (op === 'findmax') op = 'max';
      if ((op === 'add' || op === 'find' || op === 'remove') && m[2] == null) continue;
      out.push({ op: op, x: m[2] != null ? +m[2] : null });
    }
    return out;
  }
  function opLine(o) { return o.op === 'add' ? 'tree.add(' + o.x + ');' : o.op === 'remove' ? 'tree.remove(' + o.x + ');' : o.op === 'find' ? 'System.out.println(tree.find(' + o.x + ').getRoot());' : 'System.out.println(tree.' + (o.op === 'min' ? 'findMin' : o.op === 'max' ? 'findMax' : 'removeMin') + '());'; }
  function imCode(v) { var s = nums(v.t, 12); return IM + '\nint[] start = {' + s.join(', ') + '};\nfor (int x : start) tree.add(x);\n' + parseOps(v.ops).map(opLine).join('\n'); }
  var impl = {
    id: 'impl', slides: [20, 26], title: 'LinkedBST: add, find, remove, findMin, findMax, removeMin', vb: [560, 360],
    code: imCode,
    inputs: [{ id: 't', type: 'text', label: 'start tree', value: '50 30 70 20 40 60 80', minlen: 0, maxlen: 50 }, { id: 'ops', type: 'text', label: 'operations', value: 'add 35, find 35, find 65', minlen: 0, maxlen: 70 }],
    inputsLabel: 'Operations: <code>add 35</code>, <code>find 35</code>, <code>remove 30</code>, <code>min</code>, <code>max</code>, <code>removeMin</code> (up to 8).',
    presets: [{ label: 'add and find', values: { t: '50 30 70 20 40 60 80', ops: 'add 35, find 35, find 65' } }, { label: 'remove: leaf, one child, two children', values: { t: '50 30 70 20 40 60 80', ops: 'remove 20, remove 30, remove 50' } }, { label: 'min, max, removeMin', values: { t: '50 30 70 20 40 60 80', ops: 'min, max, removeMin, removeMin, min' } }, { label: 'removeMin at the root', values: { t: '10 20 15 30', ops: 'removeMin, min' } }, { label: 'empty tree', values: { t: '', ops: 'min, remove 5, add 5, max' } }, { label: 'a copy of the root', values: { t: '40 20 60', ops: 'add 40, remove 40, find 40' } }],
    steps: function (v) {
      var code = imCode(v), ops = parseOps(v.ops), root = build(nums(v.t, 12)), st = [], path = [];
      var ms = L(code, '// ---- main ----'), A0 = L(code, 'public void add(T element)'), A1 = L(code, 'private void add('), F0 = L(code, 'public BinaryTree<T> find'), R0 = L(code, 'public void remove('), R1 = L(code, 'private TreeNode<T> remove('),
        MN = L(code, 'public T findMin()'), MX = L(code, 'public T findMax()'), RM = L(code, 'public T removeMin()');
      var snap = function (o) { o.t = cp(root); o.path = o.path || path.slice(); st.push(o); return o; };
      snap({ slide: 21, line: (ms + 1) + '-' + (ms + 3), cap: 'LinkedBST&lt;T extends Comparable&lt;T&gt;&gt; extends LinkedBT: it keeps <code>root</code> and the TreeNode class, and adds the BST methods. The start tree is built with add: ' + (cnt(root) ? cnt(root) + ' nodes.' : 'it is empty.') });
      ops.forEach(function (o, oi) {
        var ml = ms + 4 + oi, x = o.x; path = [];
        if (o.op === 'add') {
          if (!root) { root = mk(x); snap({ slide: 22, line: ml + ',' + (A0 + 1), at: root.id, cap: 'add(' + x + '): root == null, so the new node ' + x + ' becomes the root.' }); return; }
          snap({ slide: 22, line: ml + ',' + (A0 + 2), cap: 'add(' + x + '): the tree is not empty: call the private add(root, ' + x + ').' });
          var c = root;
          for (;;) {
            path.push(c.id); var lt = x < c.v, nx = lt ? c.l : c.r;
            if (!nx) { var n = mk(x); if (lt) c.l = n; else c.r = n; snap({ slide: 22, line: (lt ? A1 + 1 : A1 + 5) + ',' + (lt ? A1 + 2 : A1 + 6), at: n.id, cap: x + '.compareTo(' + c.v + ') ' + (lt ? '&lt; 0' : '≥ 0') + ' and node.' + (lt ? 'left' : 'right') + ' == null: <b>new TreeNode(' + x + ')</b> becomes the ' + (lt ? 'left' : 'right') + ' child of ' + c.v + '.' }); break; }
            snap({ slide: 22, line: (lt ? A1 + 1 : A1 + 5) + ',' + (lt ? A1 + 3 : A1 + 7), at: c.id, cap: x + '.compareTo(' + c.v + ') ' + (lt ? '&lt; 0' : '≥ 0') + ': node.' + (lt ? 'left' : 'right') + ' is ' + nx.v + ', so call add(' + nx.v + ', ' + x + ') <b>recursively</b>.' });
            c = nx;
          }
        } else if (o.op === 'find') {
          snap({ slide: 23, line: ml + ',' + (F0 + 1), cap: 'find(' + x + '): node = root. find is <b>not recursive</b>: a while loop walks down one path.' });
          var c2 = root;
          while (c2) {
            path.push(c2.id);
            if (x === c2.v) { snap({ slide: 23, line: F0 + 3, at: c2.id, cap: 'target.equals(' + c2.v + '): break out of the loop.' }); break; }
            var lt2 = x < c2.v; snap({ slide: 23, line: lt2 ? F0 + 4 : F0 + 5, at: c2.id, cap: x + (lt2 ? ' &lt; ' : ' &gt; ') + c2.v + ': node = node.' + (lt2 ? 'left' : 'right') + (((lt2 ? c2.l : c2.r)) ? ' (' + (lt2 ? c2.l : c2.r).v + ').' : ' = null: the loop ends.') });
            c2 = lt2 ? c2.l : c2.r;
          }
          snap({ slide: 23, line: (F0 + 7) + ',' + ml, out: c2 ? String(x) : 'null', at: c2 ? c2.id : undefined, cap: 'return new LinkedTree&lt;&gt;(node): a tree object around the node' + (c2 ? ' with ' + x + ', so getRoot() prints ' + x + '.' : '. node is null, so getRoot() prints null.') + ' (LinkedTree is a slip on the slide: the class is LinkedBT.)' });
        } else if (o.op === 'remove') {
          snap({ slide: 24, line: ml + ',' + R0, cap: 'remove(' + x + '): root = remove(root, ' + x + '). The private method returns the (new) root of each subtree, and the caller links it back in.' });
          var rem = function (node, tg, depth) {
            if (!node) { snap({ slide: 24, line: R1 + 1, cap: 'node == null: ' + tg + ' is not on this path. return null.' }); return null; }
            path.push(node.id);
            if (tg < node.v || tg > node.v) {
              var lt3 = tg < node.v, kid = lt3 ? node.l : node.r;
              snap({ slide: 24, line: (lt3 ? R1 + 2 : R1 + 4) + ',' + (lt3 ? R1 + 3 : R1 + 5), at: node.id, cap: tg + (lt3 ? ' &lt; ' : ' &gt; ') + node.v + ': node.' + (lt3 ? 'left' : 'right') + ' = remove(' + (kid ? kid.v : 'null') + ', ' + tg + ').' });
              var r = rem(kid, tg, depth + 1);
              if (lt3) node.l = r; else node.r = r;
              path.pop();
              snap({ slide: 24, line: (lt3 ? R1 + 3 : R1 + 5) + ',' + (R1 + 14), at: node.id, cap: 'Back in ' + node.v + ': node.' + (lt3 ? 'left' : 'right') + ' = ' + (r ? r.v : 'null') + (r === kid ? ' (the same node: no change)' : ' (<b>relinked</b>)') + '. return node (' + node.v + ').' });
              return node;
            }
            if (!node.l) { path.pop(); snap({ slide: 24, line: R1 + 8, at: node.id, cut: node.id, path: path.concat([node.id]), cap: node.v + ' found. node.left == null: return node.right (' + (node.r ? node.r.v : 'null') + '). The caller links that in place of ' + node.v + '.' }); return node.r; }
            if (!node.r) { path.pop(); snap({ slide: 24, line: R1 + 9, at: node.id, cut: node.id, path: path.concat([node.id]), cap: node.v + ' found. node.right == null: return node.left (' + node.l.v + '). The caller links that in place of ' + node.v + '.' }); return node.l; }
            var mn = node.r; while (mn.l) mn = mn.l;
            snap({ slide: 24, line: R1 + 11, at: node.id, succ: mn.id, cap: node.v + ' found, with two children. findMin(node.right): the leftmost node of the right subtree is <b>' + mn.v + '</b>.' });
            node.v = mn.v;
            snap({ slide: 24, line: R1 + 11, at: node.id, succ: mn.id, cap: 'node.element = ' + mn.v + '. Now remove the old ' + mn.v + ' from the right subtree: node.right = remove(' + node.r.v + ', ' + mn.v + ').' });
            var before = node.r, r2 = rem(node.r, node.v, depth + 1); node.r = r2; path.pop();
            snap({ slide: 24, line: (R1 + 12) + ',' + (R1 + 14), at: node.id, cap: 'Back in ' + node.v + ': node.right = ' + (r2 ? r2.v : 'null') + (r2 === before ? '' : ' (relinked)') + '. return node.' });
            return node;
          };
          root = rem(root, x, 0); path = [];
          snap({ slide: 24, line: R0 + ',' + ml, cap: 'root = ' + (root ? root.v : 'null') + '. remove(' + x + ') is done.' });
        } else if (o.op === 'min' || o.op === 'max') {
          var mn2 = o.op === 'min', F = mn2 ? MN : MX;
          if (!root) { snap({ slide: 25, line: ml + ',' + (F + 1), out: 'null', cap: 'The tree is empty: find' + (mn2 ? 'Min' : 'Max') + '() returns null.' }); return; }
          var c3 = root; path = [c3.id];
          snap({ slide: 25, line: ml + ',' + (F + 2), at: c3.id, cap: 'find' + (mn2 ? 'Min' : 'Max') + '(): start at the root and keep going ' + (mn2 ? 'left' : 'right') + '.' });
          while (mn2 ? c3.l : c3.r) { c3 = mn2 ? c3.l : c3.r; path.push(c3.id); snap({ slide: 25, line: F + 3, at: c3.id, cap: 'node = node.' + (mn2 ? 'left' : 'right') + ' (' + c3.v + ').' }); }
          snap({ slide: 25, line: (F + 4) + ',' + ml, at: c3.id, out: String(c3.v), cap: c3.v + ' has no ' + (mn2 ? 'left' : 'right') + ' child: it is the ' + (mn2 ? 'leftmost' : 'rightmost') + ' node, the <b>' + (mn2 ? 'minimum' : 'maximum') + '</b>. ' + path.length + ' node' + (path.length === 1 ? '' : 's') + ' visited.' });
        } else {
          if (!root) { snap({ slide: 26, line: ml + ',' + (RM + 1), out: 'null', cap: 'removeMin(): the tree is empty, return null.' }); return; }
          if (!root.l) { var e = root.v, nr = root.r; snap({ slide: 26, line: ml + ',' + (RM + 2) + '-' + (RM + 4), at: root.id, cut: root.id, cap: 'root.left == null: the root ' + e + ' is the minimum. root = root.right (' + (nr ? nr.v : 'null') + ').' }); root = nr; snap({ slide: 26, line: (RM + 5) + ',' + ml, out: String(e), cap: 'return ' + e + '. ' + (root ? root.v + ' is the new root.' : 'The tree is now empty.') }); return; }
          var pa = root, cu = root.l; path = [pa.id, cu.id];
          snap({ slide: 26, line: ml + ',' + (RM + 7) + '-' + (RM + 8), at: cu.id, cap: 'parent = root (' + pa.v + '), curr = root.left (' + cu.v + ').' });
          while (cu.l) { pa = cu; cu = cu.l; path.push(cu.id); snap({ slide: 26, line: (RM + 9) + '-' + (RM + 11), at: cu.id, cap: 'curr has a left child: parent = ' + pa.v + ', curr = ' + cu.v + '.' }); }
          snap({ slide: 26, line: RM + 13, at: cu.id, cut: cu.id, cap: cu.v + ' has no left child: it is the minimum. parent.left = curr.right (' + (cu.r ? cu.r.v : 'null') + ').' });
          var mv = cu.v; pa.l = cu.r; path = [];
          snap({ slide: 26, line: (RM + 14) + ',' + ml, out: String(mv), cap: 'return ' + mv + '. The minimum node is unlinked.' });
        }
      });
      path = [];
      if (!ops.length) snap({ slide: 22, line: ms + 1, cap: 'Type some operations, like add 35, find 35, remove 30, min.' });
      return st;
    },
    draw: function (k, s) {
      var tone = {}, et = {}; s.path.forEach(function (i) { tone[i] = 'red'; }); if (s.at) tone[s.at] = 'accent'; if (s.succ) tone[s.succ] = 'teal'; if (s.cut) { tone[s.cut] = 'red'; et[s.cut] = 'red'; }
      var items = drawT(s.t, { tone: tone, etone: et, w: 500, x0: 30, y0: 22, hmax: 230 });
      items.push(T('lg', 280, 340, 'orange: current node · red: the path / calls · green: the successor', { anchor: 'middle', size: 11, tone: 'muted' }));
      return items;
    }
  };

  /* ---------- 5. height and cost (slides 27-28) ---------- */
  var HC = 'level l has at most 2^l nodes\na full tree of height h: N = 2^(h+1) − 1 nodes\nso h = log2(N + 1) − 1 = O(log2 N)\nsearch, add, remove, findMin, findMax: O(log2 N)\nin-order traversal gives the sorted list: O(N)';
  function full(h) { UID = 0; var mkf = function (lo, hi) { if (lo > hi) return null; var m = (lo + hi) >> 1, n = mk(m); n.l = mkf(lo, m - 1); n.r = mkf(m + 1, hi); return n; }; return mkf(1, Math.pow(2, h + 1) - 1); }
  var height = {
    id: 'height', slides: [27, 28], title: 'Height of a balanced tree: about log₂ N', lang: 'text', vb: [600, 360],
    code: HC,
    inputs: [{ id: 'h', label: 'height h', value: 3, min: 0, max: 4 }],
    presets: [{ label: 'h = 1', values: { h: 1 } }, { label: 'h = 2', values: { h: 2 } }, { label: 'h = 3', values: { h: 3 } }, { label: 'h = 4', values: { h: 4 } }, { label: 'one node: h = 0', values: { h: 0 } }],
    steps: function (v) {
      var h = Math.trunc(v.h), root = full(h), s0 = root, N = cnt(root), st = [], byLv = [];
      var walk = function (t, d) { if (!t) return; (byLv[d] = byLv[d] || []).push(t.id); walk(t.l, d + 1); walk(t.r, d + 1); }; walk(root, 0);
      var show = {}, snap = function (o) { o.t = cp(root); o.show = JSON.parse(JSON.stringify(show)); o.h = h; o.N = N; st.push(o); return o; };
      byLv.forEach(function (ids, l) { ids.forEach(function (i) { show[i] = 1; }); snap({ slide: 27, line: 1, lv: l, cap: 'Level ' + l + ' holds at most 2<sup>' + l + '</sup> = <b>' + ids.length + '</b> node' + (ids.length === 1 ? '' : 's') + '. Each level doubles the room.' }); });
      snap({ slide: 27, line: 2, cap: 'A full tree of height ' + h + ': N = 2<sup>' + (h + 1) + '</sup> − 1 = <b>' + N + '</b> node' + (N === 1 ? '' : 's') + '.' });
      snap({ slide: 27, line: 3, cap: 'Turned around: h = log₂(' + (N + 1) + ') − 1 = ' + h + '. The height grows like <b>log₂ N</b>: a balanced tree of 1,000,000 nodes is only about 20 levels tall.' });
      var p = [], c = root; while (c) { p.push(c.id); c = c.r; }
      snap({ slide: 28, line: 4, path: p, cap: 'The longest search goes from the root to a leaf: at most h + 1 = <b>' + (h + 1) + '</b> comparison' + (h ? 's' : '') + ' for ' + N + ' element' + (N === 1 ? '' : 's') + '.' + (N > 1 ? ' A list (or a degenerate tree) could need ' + N + '.' : '') });
      snap({ slide: 28, line: 5, vals: true, cap: 'In-order traversal (left, node, right) visits the elements in <b>sorted</b> order: ' + (N > 3 ? '1, 2, 3, … ' + N : inorder(s0).map(function (t) { return t.v; }).join(', ')) + '. It visits all N nodes: O(N).' });
      return st;
    },
    draw: function (k, s) {
      var tone = {}, dim = {}; (s.path || []).forEach(function (i) { tone[i] = 'accent'; });
      var items = drawT(s.t, { tone: tone, w: 540, x0: 30, y0: 30, dy: 56, hmax: 230, title: function (t) { return s.vals ? String(t.v) : ''; } }).filter(function (it) { var m = /^[ne](\d+)$/.exec(it.id); return !m || s.show[m[1]]; });
      items.push(T('nn', 580, 330, 'h = ' + s.h + '   N = ' + s.N, { anchor: 'end', mono: true, size: 15, bold: true, tone: 'accent' }));
      if (s.lv != null) items.push(T('lv', 20, 330, 'level ' + s.lv + ': 2^' + s.lv + ' = ' + Math.pow(2, s.lv), { mono: true, size: 14, bold: true, tone: 'teal' }));
      return items;
    }
  };

  /* ---------- 6-8. degenerate trees, rotations, AVL trees (slides 31-39) ---------- */
  var DC = 'add x:\n  start at the root\n  x < node: go left;  x >= node: go right\n  x becomes a new leaf where the path ends\nheight = the longest path from the root to a leaf\nsearch cost: up to height + 1 comparisons\nsorted input: every new node goes right\n  → a degenerate tree (like a linked list): O(n)';
  var RT = 'add x as in any BST (or remove x: -x)\nif a node\'s two subtrees now differ in height by 2:\n  long path in the left subtree of its left child   → right rotation\n  long path in the right subtree of its right child → left rotation\n  long path in the left subtree of its right child  → RightLeft rotation\n  long path in the right subtree of its left child  → LeftRight rotation\nright rotation around R  (P = R.left, M = P.right):\n  A: P takes R\'s place (the new root)\n  B: P.right = R   (R is the new right child)\n  C: R.left = M    (M is R\'s new left child)\nleft rotation around R  (P = R.right, M = P.left):\n  A: P takes R\'s place (the new root)\n  B: P.left = R    (R is the new left child)\n  C: R.right = M   (M is R\'s new right child)\nRightLeft: right rotation around R.right, then left rotation around R\nLeftRight: left rotation around R.left, then right rotation around R';
  var AV = 'add x as in any BST (or remove x: -x)\nbf(node) = height(right subtree) − height(left subtree)\nupdate bf from that point up to the root\nif bf(node) == −2:                     (left side 2 longer)\n  bf(node.left) <= 0 → right rotation\n  bf(node.left) > 0  → LeftRight rotation\nif bf(node) == +2:                     (right side 2 longer)\n  bf(node.right) >= 0 → left rotation\n  bf(node.right) < 0  → RightLeft rotation\nright rotation around R (P = R.left, M = P.right):\n  A: P takes R\'s place  B: P.right = R  C: R.left = M\nleft rotation around R (P = R.right, M = P.left):\n  A: P takes R\'s place  B: P.left = R  C: R.right = M\nRightLeft = right rotation around R.right, then left rotation around R\nLeftRight = left rotation around R.left, then right rotation around R';
  function ops2(s) { return String(s).split(/[\s,;]+/).filter(function (x) { return /^-?\d{1,3}$/.test(x); }).slice(0, 14).map(function (x) { return x[0] === '-' ? { rm: true, v: -x } : { v: +x }; }); }
  function vals(n) { return n ? n.v : 'null'; }
  function wayText(way, x) { return way.map(function (c) { return x < c.v ? x + ' &lt; ' + c.v + ' → left' : x + ' ≥ ' + c.v + ' → right'; }).join(', '); }
  /* mode: 'plain' (no balancing), 'rot' (slides 33-36 words), 'avl' (balance factors) */
  function balRun(seqText, mode) {
    var code = mode === 'plain' ? DC : mode === 'rot' ? RT : AV, ops = ops2(seqText), st = [], root = null, bfOn = mode === 'avl';
    UID = 0;
    var snap = function (o) { if (!o.keep) o.t = cp(root); o.bf = bfOn && !o.nobf; o.code = code; st.push(o); return o; };
    var lowest = function (t) { if (!t) return null; return lowest(t.l) || lowest(t.r) || (Math.abs(bfac(t)) >= 2 ? t : null); };
    var lineOf = function (f, n) { return L(code, f, n); };
    if (mode === 'avl') snap({ slide: 37, line: 2, cap: 'In an <b>AVL tree</b> every node keeps a <b>balance factor</b>: bf = height of the right subtree − height of the left subtree. −1, 0 and +1 are fine; −2 or +2 means "rotate".' });
    var trig = null;
    var rotate = function (R, dir, slide, tag) {
      var P = dir === 'R' ? R.l : R.r, M = dir === 'R' ? P.r : P.l, par = findParent(root, R), mids = sub(M), ids = { R: R.id, P: P.id };
      var ln = function (k) { return mode === 'rot' ? lineOf((dir === 'R' ? 'right' : 'left') + ' rotation around R  (') + k : lineOf((dir === 'R' ? 'right' : 'left') + ' rotation around R (') + 1; };
      snap({ slide: slide, line: mode === 'rot' ? lineOf((dir === 'R' ? 'right' : 'left') + ' rotation around R  (') : lineOf((dir === 'R' ? 'right' : 'left') + ' rotation around R ('), rot: ids, mid: mids, nobf: true, cap: tag + (dir === 'R' ? '<b>Right</b>' : '<b>Left</b>') + ' rotation around ' + R.v + ': P = its ' + (dir === 'R' ? 'left' : 'right') + ' child ' + P.v + ', M = ' + (M ? 'P\'s ' + (dir === 'R' ? 'right' : 'left') + ' child ' + M.v : 'nothing (P has no ' + (dir === 'R' ? 'right' : 'left') + ' child)') + '.' });
      /* do the rotation, then draw the in-between steps with links hidden */
      if (dir === 'R') { R.l = M; P.r = R; } else { R.r = M; P.l = R; }
      root = relink(root, par, R, P);
      var fl = {}; Object.keys(mids).forEach(function (i) { fl[i] = 40; });
      var hideA = {}; hideA[R.id] = 1; if (M) hideA[M.id] = 1; var hideB = {}; if (M) hideB[M.id] = 1;
      snap({ slide: slide, line: ln(1), rot: ids, mid: mids, hide: hideA, float: fl, nobf: true, cap: 'Step A: ' + P.v + ' takes the place of ' + R.v + (par ? ' under ' + par.v : ' and becomes the new <b>root</b>') + '.' + (M ? ' ' + M.v + ' is waiting on the side.' : '') });
      snap({ slide: slide, line: ln(2), rot: ids, mid: mids, hide: hideB, float: fl, nobf: true, cap: 'Step B: ' + (par ? 'the old top node ' : 'the former root ') + R.v + ' becomes the ' + (dir === 'R' ? 'right' : 'left') + ' child of ' + P.v + '.' });
      snap({ slide: slide, line: ln(3), rot: ids, mid: mids, nobf: true, cap: 'Step C: ' + (M ? M.v + ' (the ' + (dir === 'R' ? 'right' : 'left') + ' child of ' + P.v + ') becomes the ' + (dir === 'R' ? 'left' : 'right') + ' child of ' + R.v + '. It is still between ' + Math.min(P.v, R.v) + ' and ' + Math.max(P.v, R.v) + ', so the order is kept.' : R.v + ' gets no new ' + (dir === 'R' ? 'left' : 'right') + ' child (M is empty).') });
    };
    ops.forEach(function (o) {
      var x = o.v, way = [];
      if (!o.rm) {
        root = addBST(root, x, way);
        var me = way.length ? (x < way[way.length - 1].v ? way[way.length - 1].l : way[way.length - 1].r) : root;
        snap({ slide: mode === 'plain' ? 31 : mode === 'rot' ? 0 : 38, line: mode === 'plain' ? '1-4' : 1, fresh: me.id, path: way.map(function (w) { return w.id; }), cap: 'add ' + x + (way.length ? ': ' + wayText(way, x) + '.' : ': the tree was empty, ' + x + ' is the root.') + (mode === 'plain' ? ' Height now ' + ht(root) + '.' : '') });
      } else {
        var c = root, par = null; while (c && c.v !== x) { way.push(c); par = c; c = x < c.v ? c.l : c.r; }
        if (!c) { snap({ slide: mode === 'avl' ? 39 : 0, line: 1, cap: 'remove ' + x + ': it is not in the tree.' }); return; }
        if (c.l && c.r) { var s2 = c.r, sp = c; while (s2.l) { sp = s2; s2 = s2.l; } var old = c.v; c.v = s2.v; root = relink(root, sp, s2, s2.r); snap({ slide: mode === 'avl' ? 39 : 0, line: 1, fresh: c.id, cap: 'remove ' + old + ': it has two children, so its in-order successor ' + c.v + ' takes its place.' }); }
        else { root = relink(root, par, c, c.l || c.r); snap({ slide: mode === 'avl' ? 39 : 0, line: 1, cap: 'remove ' + x + ': ' + (c.l || c.r ? 'its only child takes its place.' : 'it was a leaf, the link is cut.') }); }
      }
      if (mode === 'plain') return;
      var guard = 0;
      for (var u = lowest(root); u && guard < 6; u = lowest(root), guard++) {
        var b = bfac(u), left = b < 0, ch = left ? u.l : u.r, cb = bfac(ch), dbl = left ? cb > 0 : cb < 0;
        var kind = left ? (dbl ? 'LR' : 'R') : (dbl ? 'RL' : 'L'), slide = mode === 'avl' ? (o.rm ? 39 : 38) : { R: 33, L: 34, RL: 35, LR: 36 }[kind];
        if (!trig) trig = slide;
        var lp = [], w = u; while (w) { lp.push(w.id); w = ht(w.l) > ht(w.r) ? w.l : ht(w.r) > ht(w.l) ? w.r : (w.l || w.r); }
        var why = mode === 'avl'
          ? u.v + ' has bf ' + sign(b) + ': its ' + (left ? 'left' : 'right') + ' side is 2 longer. Its ' + (left ? 'left' : 'right') + ' child ' + ch.v + ' has bf ' + sign(cb) + ', so: <b>' + { R: 'right rotation', L: 'left rotation', RL: 'RightLeft rotation', LR: 'LeftRight rotation' }[kind] + '</b>.'
          : u.v + ' is out of balance: its left subtree has height ' + hs(u.l) + ', its right subtree ' + hs(u.r) + '. The long path (red) is in the ' + (kind === 'R' || kind === 'RL' ? 'left' : 'right') + ' subtree of its ' + (left ? 'left' : 'right') + ' child ' + ch.v + ': <b>' + { R: 'right rotation', L: 'left rotation', RL: 'RightLeft rotation', LR: 'LeftRight rotation' }[kind] + '</b>.';
        var wl = mode === 'avl' ? (left ? (dbl ? lineOf('LeftRight rotation', 1) : lineOf('→ right rotation')) : (dbl ? lineOf('RightLeft rotation', 1) : lineOf('→ left rotation'))) + ',' + lineOf(left ? 'if bf(node) == −2' : 'if bf(node) == +2')
          : lineOf({ R: '→ right rotation', L: '→ left rotation', RL: '→ RightLeft rotation', LR: '→ LeftRight rotation' }[kind]) + ',' + lineOf('if a node');
        snap({ slide: slide, line: wl, bad: u.id, lp: lp, cap: why });
        if (kind === 'R') rotate(u, 'R', slide, '');
        else if (kind === 'L') rotate(u, 'L', slide, '');
        else if (kind === 'RL') { rotate(ch, 'R', slide, 'RightLeft, first: '); rotate(u, 'L', slide, 'RightLeft, then: '); }
        else { rotate(ch, 'L', slide, 'LeftRight, first: '); rotate(u, 'R', slide, 'LeftRight, then: '); }
        snap({ slide: slide, line: mode === 'avl' ? lineOf('update bf') : lineOf('if a node'), cap: mode === 'avl' ? 'The balance factors are updated: every node is −1, 0 or +1 again. Height ' + ht(root) + ' with ' + cnt(root) + ' nodes.' : 'Balanced again: height ' + ht(root) + ', and it is still a binary search tree (in-order is unchanged).' });
      }
      if (mode === 'avl' && !guard) st[st.length - 1].cap += ' All balance factors are between −1 and +1: no rotation.';
    });
    if (mode === 'plain') {
      var n = cnt(root), h = ht(root), mx = root; while (mx && (mx.l || mx.r)) mx = mx.l || mx.r;
      snap({ slide: 31, line: '5-6', cap: n + ' nodes, height <b>' + h + '</b>. ' + (h === n - 1 && n > 2 ? 'Every node has one child: a <b>degenerate tree</b>. Searching ' + (mx ? mx.v : '') + ' needs ' + n + ' comparisons: O(n), not O(log n).' : 'A balanced tree of ' + n + ' nodes needs only height ' + (n ? Math.floor(Math.log2(n)) : 0) + '.') });
      snap({ slide: 32, line: '7-8', cap: 'Our LinkedBST does nothing to stay balanced: the shape depends only on the order of the adds. AVL and Red/Black trees use <b>rotations</b> to keep the height near log₂ N.' });
    }
    if (mode === 'rot') { st.forEach(function (s) { if (!s.slide) s.slide = trig || 33; }); }
    return st;
  }
  function balDraw(s) {
    var tone = {}, et = {};
    if (s.path) s.path.forEach(function (i) { tone[i] = 'red'; });
    if (s.fresh) { tone[s.fresh] = 'accent'; et[s.fresh] = 'teal'; }
    if (s.lp) s.lp.forEach(function (i, j) { tone[i] = 'red'; if (j) et[i] = 'red'; });
    if (s.bad) tone[s.bad] = 'red';
    if (s.rot) { Object.keys(s.mid || {}).forEach(function (i) { tone[i] = 'teal'; }); tone[s.rot.R] = 'red'; tone[s.rot.P] = 'accent'; }
    var items = drawT(s.t, { tone: tone, etone: et, hide: s.hide, float: s.float, shape: 'box', nw: s.bf ? 64 : 44, size: 13, w: 500, x0: 50, y0: 26, dy: 58, hmax: 240, gmax: 72, title: s.bf ? function (t) { return t.v + ' (' + sign(bfac(t)) + ')'; } : null });
    if (s.rot) items.push(T('lg', 300, 345, 'red: R (old root) · orange: P (new root) · green: M (moves)', { anchor: 'middle', size: 11, tone: 'muted' }));
    else if (s.t) items.push(T('lg', 300, 345, cnt(s.t) + ' nodes · height ' + ht(s.t), { anchor: 'middle', mono: true, size: 13, bold: true, tone: 'muted' }));
    return items;
  }
  var degen = {
    id: 'degen', slides: [31, 32], title: 'The order of adding decides the shape', lang: 'text', vb: [600, 360],
    code: DC,
    inputs: [{ id: 'q', type: 'text', label: 'add in this order', value: '3 5 9 12 18 20', minlen: 1, maxlen: 50 }],
    presets: [{ label: 'slide 31: sorted', values: { q: '3 5 9 12 18 20' } }, { label: 'same numbers, middle first', values: { q: '12 5 18 3 9 20' } }, { label: 'sorted backwards', values: { q: '20 18 12 9 5 3' } }, { label: 'zig-zag', values: { q: '3 20 5 18 9 12' } }],
    steps: function (v) { return balRun(v.q, 'plain'); },
    draw: function (k, s) { return balDraw(s); }
  };
  var rotate = {
    id: 'rotate', slides: [33, 36], title: 'Rotations: A, B, C', lang: 'text', vb: [600, 360],
    code: RT,
    inputs: [{ id: 'q', type: 'text', label: 'add in this order', value: '13 7 15 5 10 3', minlen: 1, maxlen: 50 }],
    inputsLabel: 'A rotation happens as soon as a node is out of balance. <code>-x</code> removes x.',
    presets: [{ label: 'right (slide 33)', values: { q: '13 7 15 5 10 3' } }, { label: 'left (slide 34)', values: { q: '5 3 10 7 13 15' } }, { label: 'RightLeft (slide 35)', values: { q: '5 3 13 10 15 7' } }, { label: 'LeftRight (slide 36)', values: { q: '13 5 15 3 7 10' } }, { label: 'sorted input', values: { q: '1 2 3 4 5 6 7' } }],
    steps: function (v) { return balRun(v.q, 'rot'); },
    draw: function (k, s) { return balDraw(s); }
  };
  var avl = {
    id: 'avl', slides: [37, 39], title: 'AVL tree: balance factors and rotations', lang: 'text', vb: [600, 360],
    code: AV,
    inputs: [{ id: 'q', type: 'text', label: 'operations', value: '7 5 9 3 6 1', minlen: 1, maxlen: 50 }],
    inputsLabel: 'Numbers are added; <code>-x</code> removes x.',
    presets: [{ label: 'insert (slide 38)', values: { q: '7 5 9 3 6 1' } }, { label: 'remove 3 (slide 39)', values: { q: '10 5 15 3 13 17 11 -3' } }, { label: 'sorted input stays short', values: { q: '10 20 30 40 50 60 70' } }, { label: 'no rotation needed', values: { q: '40 20 60 10 30' } }],
    steps: function (v) { return balRun(v.q, 'avl'); },
    draw: function (k, s) { return balDraw(s); }
  };

  var code = function (t) { return { type: 'code', lang: 'java', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; }, bh = function (h, l) { return { type: 'bullet', html: h, level: l || 0 }; };
  var OUT = ['What is a Binary Search Tree?', 'Adding Elements and Searching a BST', 'Removing Elements from a BST', 'Binary Search Tree Implementation', 'Balanced Binary Search Trees'];
  function outline(on, ex) { return { blocks: OUT.map(function (t, i) { return { type: 'bullet', html: on.indexOf(i) >= 0 ? '<b>' + t + '</b>' : t }; }), explain: ex }; }

  addUnit({
    course: 'ds', lesson: '11-binary-search-trees',
    blurb: 'The BST rule, adding and searching on one path, the three cases of removing a node, the LinkedBST class, and rotations and AVL trees that keep the tree balanced.',
    parts: [
      { title: 'What is a BST? Adding and searching', from: 1, to: 8 },
      { title: 'Removing elements', from: 9, to: 17 },
      { title: 'BST implementation', from: 18, to: 29 },
      { title: 'Balanced binary search trees', from: 30, to: 39 }
    ],
    visuals: [valid, addsearch, remove, impl, height, degen, rotate, avl],
    slides: {
      1: { cover: true, explain: '<p>A <b>binary search tree</b> (BST) is a binary tree with an order: smaller elements on the left, larger ones on the right. This order makes finding an element fast.</p><pre class="ex">      45\n     /  \\\n   12    69     12 &lt; 45 &lt;= 69</pre><p>This unit: the rule, adding, searching, removing, a Java class, and how to keep the tree {{balanced|متوازن}}.</p>' },
      2: outline([], '<p>The plan: what a BST is, adding and searching, removing, the Java class, and balanced trees.</p>'),
      3: { blocks: [bul('A binary search tree is a binary tree with the added property that for each node:'), bul('The left child contains an element which is less than the element stored in the parent node.', 1), bul('The right child contains an element which is greater than or equal to the element stored in the parent node.', 1), bul('Adding an element to a binary search tree or removing an element should be done without violating its main property.')],
        explain: '<p>The BST rule holds at <b>every</b> node, not only at the root:</p><pre class="ex">left side:  less than the node\nright side: greater than or EQUAL to the node</pre><p>So equal values always go to the <b>right</b>. Adding and removing must never break this rule; that is the hard part of the methods in this unit.</p><p class="watch">The rule is about whole subtrees: every element below on the left must be smaller, not only the child.</p>' },
      4: { text: false, explain: '<p>How to check a BST: give each node a {{range|مدى}}. Going left, the node becomes the new <b>upper</b> limit; going right, it becomes the new <b>lower</b> limit.</p><pre class="ex">45: anything\n12: less than 45\n15: from 12 up to (not including) 45\n39: from 15 up to 45</pre><p class="watch">Checking only parent and child is not enough. A 44 placed under 69 looks fine next to 69, but it is in the right subtree of 45, so it must be ≥ 45.</p>' },
      5: { explain: '<p>Adding 5, 7, 3, 4 to an empty tree:</p><pre class="ex">5: the tree is empty → root\n7: 7 ≥ 5 → right of 5\n3: 3 &lt; 5 → left of 5\n4: 4 &lt; 5 → left, 4 ≥ 3 → right of 3</pre><p>A new element always becomes a new <b>leaf</b>. Nothing already in the tree moves.</p><p class="watch">The order of the adds matters: adding 3, 4, 5, 7 would give a different tree.</p>' },
      6: { blocks: [bul('Adding 47, 68, 12, 4, and 75 to a non-empty binary search tree.'), bul('The height of a balanced binary search tree with n nodes is O(log₂ n).'), bul('Adding an element to a balanced search tree is O(log₂ n).')],
        explain: '<p>Each new element (red on the slide) walks down from the root and stops where a link is null.</p><pre class="ex">12: 12 &lt; 45 left, 12 ≥ 12 right,\n    12 &lt; 15 left, 12 &lt; 14 left of 14</pre><p>The second 12 goes to the <b>right</b> of the first one, because equal goes right. One add follows one path, so its cost is the height: O(log₂ n) when the tree is balanced.</p>' },
      7: { blocks: [bul('To determine if a particular target element exists in a tree:'), bul('Start at the root node', 1), bul('Compare the target with the element at the current node', 1), bul('Move left if the target is less than the element at the current node', 1), bul('Move right if target is greater than the element at the current node', 1), bul('Stop at the current node if the target element is found', 1), bul('We either find the target element or encounter the end of a path and conclude that the target is not found.')],
        explain: '<p>Searching is like <b>binary search</b> on an array: each comparison throws away one whole side of the tree.</p><pre class="ex">target &lt; node → go left\ntarget &gt; node → go right\ntarget = node → found\nnull link     → not found</pre><p>We never have to come back up, so we look at one node per level at most.</p>' },
      8: { blocks: [bul('Searching for the target element 33.'), bul('The height of a balanced binary search tree with n nodes is O(log₂ n).'), bul('Searching an element in a balanced search tree is O(log₂ n).')],
        explain: '<p>Searching for 33:</p><pre class="ex">33 &lt; 45 → left to 12\n33 &gt; 12 → right to 15\n33 &gt; 15 → right to 39\n33 &lt; 39 → left: found 33</pre><p>Only 5 of the 20 nodes were looked at. For a balanced tree the number of comparisons is at most the height + 1, so search is O(log₂ n).</p><p class="watch">An ordinary binary tree has no order, so its find must look everywhere: O(n).</p>' },
      9: outline([2], '<p>Next: removing a node without breaking the BST rule.</p>'),
      10: { blocks: [bul('Removing a target node in a Binary Search Tree (BST) is not as simple as that for a linear data structure.'), bul('After removing a node, the resulting tree must still be valid.'), bul('Three distinct situations must be considered when removing a node in a binary search tree.'), bul('The node to remove is a leaf', 1), bul('The node to remove has one child', 1), bul('The node to remove has two children', 1)],
        explain: '<p>In a list, removing means "skip one node". In a tree, the removed node may have children that must stay in the tree, still in the right order.</p><pre class="ex">0 children → case 1 (easy)\n1 child    → case 2 (relink)\n2 children → case 3 (use the successor)</pre><p>First we find the node with the normal search path, then we look at how many children it has.</p>' },
      11: { text: false, explain: '<p>The three cases in one tree:</p><pre class="ex">44 is a leaf          → case 1\n70 has one child (81) → case 2\n45 has two children   → case 3</pre><p>The next slides remove each of them from this same tree. Notice the tree has two 12s: the second one is in the right subtree of the first.</p>' },
      12: { text: false, explain: '<p><b>Case 1: a leaf.</b> Removing 44 is easy: its parent 42 sets its right link to <code>null</code>.</p><pre class="ex">42.right = null</pre><p>No other node moves, and the BST rule cannot break: we only took an element away from the bottom.</p><p class="watch">If the leaf is also the root (a one-node tree), the tree becomes empty: root = null.</p>' },
      13: { text: false, explain: '<p><b>Case 2: one child.</b> 70 has only a right child, 81 (with 95 below it). Relink the parent of 70 straight to 81:</p><pre class="ex">69.right = 81   (it was 70)</pre><p>The whole subtree of 81 moves up one level. The node 70 is now unreachable, so it is gone.</p>' },
      14: { text: false, explain: '<p>After removing 70, 81 is the right child of 69. Is the rule still true? 81 and 95 were in the right subtree of 69 before, and they still are; they are still in the right subtree of 45 too.</p><pre class="ex">69 → 81 → 95    all ≥ 69</pre><p>A node’s whole subtree can move up into its place without breaking the order.</p>' },
      15: { text: false, explain: '<p><b>Case 3: two children.</b> 45 has two subtrees; we cannot link both to one parent. Instead, find the <b>in-order successor</b>: the smallest element in the right subtree.</p><pre class="ex">right once (69), then left (51), left (47)\n47 has no left child → successor</pre><p>Copy 47 into the node of 45, then remove the old 47 node (it has one child, 49: case 2).</p><p class="watch">The slide says "replace it with the element to be removed": it means the successor’s element replaces the removed one.</p>' },
      16: { text: false, explain: '<p>After the removal, 47 is the root. Why is this still a BST?</p><pre class="ex">left side:  all &lt; 45 &lt; 47   ✓\nright side: all ≥ 47 (47 was the smallest there) ✓</pre><p>The old 47 node is gone and 51 now points to 49. The successor never has a <b>left</b> child (otherwise that child would be smaller), so removing it is always case 1 or 2.</p>' },
      17: { blocks: [bul('Case 1: Node is a leaf and can be simply deleted'), bul('Case 2: Node has only one child'), bul('It is removed by relinking its parent node to its only child node', 1), bul('Case 3: Node has two children'), bul('The in-order successor is the smallest element in the right subtree', 1), bul('The element to be removed is replaced with its in-order successor', 1), bul('The in-order successor node does NOT have a left child', 1), bul('The in-order successor node is removed as in case 1 or 2', 1)],
        explain: '<p>The whole method in three lines:</p><pre class="ex">leaf      → cut the link\none child → parent points to the child\ntwo       → copy the successor, remove the successor</pre><p>The cost is one path down (find the node, then the successor further down): O(height), so O(log₂ n) for a balanced tree.</p><p class="watch">Some books use the in-order <b>predecessor</b> (the largest on the left). This course uses the successor.</p>' },
      18: outline([3], '<p>Next: the Java class LinkedBST.</p>'),
      19: { blocks: [bul('The definition of a binary search tree is an extension to the definition of a binary tree. The following operations are defined in addition to the ones defined on a binary tree.')],
        explain: '<p>A BST can do everything a binary tree can (size, height, traversals …) plus these:</p><pre class="ex">add, remove, removeAll\nfindMin, findMax\nremoveMin, removeMax</pre><p>findMin and findMax are easy in a BST: the minimum is the leftmost node, the maximum the rightmost.</p><p class="watch">remove removes only the <b>first</b> match; removeAll removes every copy of the target.</p>' },
      20: { blocks: [code('// Generic BinarySearchTree interface that extends BinaryTree\npublic interface BinarySearchTree<T> extends BinaryTree<T> {\n  void add(T element);          // Adds an element to the BST\n  void remove(T target);        // Removes target element from BST\n  void removeAll(T target);     // Removes all target occurrences\n  T findMin();                  // Returns the minimum element\n  T findMax();                  // Returns the maximum element\n  T removeMin();                // Removes the minimum element\n  T removeMax();                // Removes the maximum element\n}')],
        explain: '<p><code>BinarySearchTree&lt;T&gt;</code> is an interface that <b>extends</b> another interface, BinaryTree&lt;T&gt;. A class that implements it must write the methods of both.</p><pre class="ex">BinaryTree:       size, height, find, traversals …\nBinarySearchTree: + add, remove, findMin …</pre><p>Notice find already comes from BinaryTree; the BST version will just be faster.</p>' },
      21: { blocks: [code('// Linked implementation of a Binary Search Tree (BST)\npublic class LinkedBST<T extends Comparable<T>>\n       extends LinkedBT<T>\n       implements BinarySearchTree<T> {\n  // Constructor of an empty binary search tree\n  public LinkedBST() { super(); }\n  // Creates a binary search tree with a root element\n  public LinkedBST(T element) { super(element); }')],
        explain: '<p><code>LinkedBST</code> reuses the linked binary tree: it <b>extends</b> LinkedBT (so it gets root, TreeNode, size, traversals) and implements the BST interface.</p><pre class="ex">T extends Comparable&lt;T&gt;</pre><p>This {{bound|قيد}} means T must have <code>compareTo</code>: Integer, String … The tree needs it to decide left or right.</p><p class="watch">The constructors only call <code>super(...)</code>: the LinkedBT constructors build the empty tree or the one-node tree.</p>' },
      22: { blocks: [code('// Adds an element at the proper location in a BST\npublic void add(T element) {\n if (root == null) root = new TreeNode<>(element);\n else add(root, element);\n}\n// Recursively adds an element to a binary search tree\nprivate void add(TreeNode<T> node, T element) {\n  if (element.compareTo(node.element) < 0) {\n    if (node.left == null) node.left = new TreeNode<>(element);\n    else add(node.left, element);        // Recursive call\n  }\n  else {\n    if (node.right == null) node.right = new TreeNode<>(element);\n    else add(node.right, element);       // Recursive call\n  }\n}')],
        explain: '<p>Two methods: the public <code>add</code> handles the empty tree; the private one does the recursive walk.</p><pre class="ex">compareTo &lt; 0  → left side\notherwise      → right side (equal goes right)\nlink is null   → put the new node there</pre><p>Each call moves one level down, so it ends after at most height + 1 calls.</p><p class="watch">The two methods have the same name but different parameters: this is <b>overloading</b>.</p>' },
      23: { blocks: [code('// Finds the specified target element in a binary search tree\n// Returns a binary tree object for the target node\npublic BinaryTree<T> find(T target) {\n  TreeNode<T> node = root;\n  while (node != null) {\n    if (target.equals(node.element)) break;\n    if (target.compareTo(node.element) < 0) node = node.left;\n    else node = node.right;\n  }\n  return new LinkedTree<>(node);\n}')],
        explain: '<p>This find <b>overrides</b> the LinkedBT one. It uses a loop, not recursion: walk down until the target is found (<code>break</code>) or node becomes null.</p><pre class="ex">tree.find(33).getRoot()   → 33\ntree.find(40).getRoot()   → null</pre><p>It returns a tree object around the node, like LinkedBT.find.</p><p class="watch">The slide writes <code>new LinkedTree&lt;&gt;(node)</code>, a class that does not exist here. It should be LinkedBT (its protected constructor), or the code does not compile.</p>' },
      24: { blocks: [code('// Removes the first node that matches the specified target\npublic void remove(T target) { root = remove(root, target); }\n// Recursively removes a target node in a binary search tree\nprivate TreeNode<T> remove(TreeNode<T> node, T target) {\n  if (node == null) return null;\n  if (target.compareTo(node.element) < 0)          // target is smaller\n    node.left = remove(node.left, target);         // recursive call\n  else if (target.compareTo(node.element) > 0)     // target is larger\n    node.right = remove(node.right, target);       // recursive call\n  else { // target is equal to node.element\n    // Case 1: Node with only one child or no child\n    if (node.left == null) return node.right;      // No left child\n    if (node.right == null) return node.left;      // No right child\n    // Case 2: Node with two children\n    node.element = findMin(node.right);            // find min in right subtree\n    node.right = remove(node.right, node.element); // recursive call\n  }\n  return node;\n}')],
        explain: '<p>The private remove <b>returns</b> the root of the subtree after removing, and the caller links it back:</p><pre class="ex">node.left = remove(node.left, target);</pre><p>A node with no left child returns its right child (null for a leaf), and the parent links that instead. Two children: copy the minimum of the right subtree, then remove that minimum recursively.</p><p class="watch">The code’s "Case 1" covers both a leaf and one child (slide 17’s cases 1 and 2). <code>findMin(node.right)</code> is a private helper that is not on the slides.</p>' },
      25: { blocks: [code('// Returns the minimum element stored in a binary search tree\npublic T findMin() {\n  if (root == null) return null;               // empty tree\n  TreeNode<T> node = root;                     // root node\n  while (node.left != null) node = node.left;  // leftmost node\n  return node.element;\n}\n// Returns the maximum element stored in a binary search tree\npublic T findMax() {\n  if (root == null) return null;               // empty tree\n  TreeNode<T> node = root;                     // root node;\n  while (node.right != null) node = node.right; // rightmost node\n  return node.element;\n}')],
        explain: '<p>The smallest element is the <b>leftmost</b> node: keep going left until there is no left child. The largest is the <b>rightmost</b> node.</p><pre class="ex">min: 50 → 30 → 20 (no left) → 20\nmax: 50 → 70 → 80 (no right) → 80</pre><p>No comparisons are needed, only one path: O(height).</p><p class="watch">The minimum may have a right child; it just has no left child. An empty tree returns null.</p>' },
      26: { blocks: [code('public T removeMin() {                 // Removes the minimum element node\n  if (root == null) return null;       // empty tree\n  if (root.left == null) {             // if no left child\n    T element = root.element;          // then root has the minimum\n    root = root.right;                 // root points to right child\n    return element;\n  }\n  TreeNode<T> parent = root;           // parent = root node\n  TreeNode<T> curr = root.left;        // current = left child\n  while (curr.left != null) {          // current has a left child\n    parent = curr;\n    curr = curr.left;                  // leftmost node contains minimum\n  }\n  parent.left = curr.right;            // remove the minimum element node\n  return curr.element;\n}')],
        explain: '<p>removeMin walks to the leftmost node, keeping its <b>parent</b>, then unlinks it:</p><pre class="ex">parent.left = curr.right;</pre><p>The minimum has no left child, so it is case 1 or 2: its right child (maybe null) takes its place. If the root itself is the minimum, <code>root = root.right</code>.</p><p class="watch">We need <code>parent</code> because a node cannot remove itself: the link to change is in its parent.</p>' },
      27: { blocks: [bul('The shape of a binary search tree depends on the order in which the elements are added and removed.'), bh('In a <i>balanced</i> binary search tree, the maximum number of nodes at level <i>l</i> is 2<sup><i>l</i></sup>.'), bh('In a <i>balanced</i> binary search tree of height <i>h</i>, all the levels are fully populated, except for the last level. The number of nodes is <i>N</i> = O(2<sup><i>h</i></sup>). If the tree is <i>full</i> then <i>N</i> = 2<sup><i>h</i>+1</sup> – 1.'), bh('In a balanced binary search tree with <i>N</i> nodes, the height of the tree is <i>h</i> = O(log<sub>2</sub> <i>N</i>).')],
        explain: '<p>Each level can hold twice as many nodes as the one above:</p><pre class="ex">level 0: 1, level 1: 2, level 2: 4, level 3: 8\nfull, height 3: N = 2⁴ − 1 = 15</pre><p>So the nodes grow like 2<sup>h</sup>, and the other way round the height grows like <b>log₂ N</b>. Doubling N adds just one level.</p><p class="watch">All of this is true only for a <b>balanced</b> tree. The same elements in another order can give a tall, thin tree.</p>' },
      28: { blocks: [bul('Efficient searching'), bul('Searching for an element is O(log2 N) for a balanced BST, where log2 N is approximately the height of a balanced BST with N nodes.', 1), bul('Finding the minimum and maximum element is also O((log2 N) for a balanced BST.', 1), bul('Efficient insertion and deletion of elements'), bul('Adding and removing an element is O(log2 N) for a balanced BST.', 1), bul('Ordered Structure'), bul('The get a sorted list of elements, perform in-order traversal of BST, which is O(N), because all N nodes are traversed.', 1)],
        explain: '<p>Why a BST is useful:</p><pre class="ex">search, findMin, findMax: O(log₂ N)\nadd, remove:              O(log₂ N)\nsorted list (in-order):   O(N)</pre><p>A sorted array searches fast but adds slowly (shifting); a linked list adds fast but searches slowly. A balanced BST is fast at both.</p><p class="watch">In-order (left, node, right) gives the sorted order because everything left is smaller and everything right is greater or equal.</p>' },
      29: { blocks: [bul('Databases: BSTs are often used to implement database indexes, which allow for fast searching and retrieval of data.'), bul('File systems: BSTs are often used to store and organize files. For example, Unix uses a BST to store file names.'), bul('Network routing: Each node in the BST represents a destination for fast lookup and routing of packets through the network.'), bul('Dictionary implementations: Many programming languages provide built-in support for dictionaries, which are implemented using BSTs.'), bul('Game development: Binary search trees can be used in game development to store and search for game objects.')],
        explain: '<p>BSTs are used wherever data must be found fast <b>and</b> kept in order:</p><pre class="ex">database {{index|فهرس}}   find a row by key\nfile names       find a file\nrouting          find a destination\ndictionary       find a word, list words in order</pre><p>Java’s own TreeMap and TreeSet (next units) are balanced binary search trees.</p>' },
      30: outline([4], '<p>Last: what happens when the tree is not balanced, and how to fix it.</p>'),
      31: { explain: '<p>Adding sorted numbers 3, 5, 9, 12, 18, 20: each one is larger than all before, so it always goes <b>right</b>.</p><pre class="ex">3 → 5 → 9 → 12 → 18 → 20\nheight 5 for 6 nodes</pre><p>This is a <b>degenerate</b> tree: it works like a linked list. Searching 20 checks every node: O(n), not O(log n).</p><p class="watch">Nothing is wrong with the BST rule here: the tree is valid, just badly shaped.</p>' },
      32: { explain: '<p>Our LinkedBST does not keep itself balanced. Other trees do: <b>AVL</b> trees and <b>Red/Black</b> trees.</p><pre class="ex">goal: height h = log₂ N</pre><p>Their tool is the <b>rotation</b>: a small re-linking of a few nodes that makes one side shorter and the other longer, while keeping the BST order.</p>' },
      33: { explain: '<p><b>Right rotation</b> around the root 13 (its left side is too long):</p><pre class="ex">A: the left child 7 becomes the new root\nB: the old root 13 becomes 7’s right child\nC: 10 (7’s old right child) becomes 13’s left child</pre><p>The order is kept: 10 was bigger than 7 and smaller than 13, and it still is. The height goes from 3 to 2.</p>' },
      34: { explain: '<p><b>Left rotation</b> is the mirror picture, used when the right side is too long:</p><pre class="ex">A: the right child 10 becomes the new root\nB: the old root 5 becomes 10’s left child\nC: 7 (10’s old left child) becomes 5’s right child</pre><p>Again only three links change, so a rotation is O(1).</p><p class="watch">Right rotation fixes a long <b>left</b> side; left rotation fixes a long <b>right</b> side.</p>' },
      35: { explain: '<p>Here the long path is 5 → 13 → 10 → 7: in the <b>left</b> subtree of the <b>right</b> child. A single left rotation would just move the problem to the other side.</p><pre class="ex">1. right rotation around 13 → 5, 10, 13 …\n2. left rotation around 5   → root 10</pre><p>The first rotation makes the path straight (all to the right), then the second one fixes it.</p>' },
      36: { explain: '<p>The mirror case: the long path 13 → 5 → 7 → 10 is in the <b>right</b> subtree of the <b>left</b> child.</p><pre class="ex">1. left rotation around 5   → 13, 7, 5 …\n2. right rotation around 13 → root 7</pre><p>Rule of thumb: the name tells the order of the rotations. RightLeft = first right, then left; LeftRight = first left, then right.</p>' },
      37: { explain: '<p>An <b>AVL</b> tree checks its balance after every add and remove. Each node keeps a <b>balance factor</b>:</p><pre class="ex">bf = height(right) − height(left)\n−1, 0, +1 → fine\n−2 or +2  → rotate</pre><p>−2 means the left subtree is 2 levels taller than the right one; +2 means the right one is taller.</p><p class="watch">A missing subtree counts as height −1, so a leaf has bf 0.</p>' },
      38: { explain: '<p>Adding 1 makes the left side of 7 too long: the bf values change on the path 1 → 3 → 5 → 7, and 7 becomes −2.</p><pre class="ex">7 (−2), its left child 5 (−1) → right rotation\nnew root 5: 3 on the left, 7 on the right</pre><p>After the rotation, 6 moved under 7 and every bf is 0 or −1.</p><p class="watch">Only the nodes on the path from the new node up to the root can change their bf.</p>' },
      39: { explain: '<p>Removing 3 makes the root 10 too heavy on the right: bf +2. Its right child 15 has bf −1: the long path is in the <b>left</b> subtree of the right child.</p><pre class="ex">RightLeft: right rotation around 15,\n           then left rotation around 10\nnew root: 13</pre><p>Removing can also unbalance a tree, and it is checked the same way.</p><p class="watch">On the slide the middle picture shows bf values before they are updated; only the last picture has the final values.</p>' }
    },
    exam: {
      questions: [
        { type: 'tf', q: 'In a BST, an element equal to a node is placed in that node\'s <b>left</b> subtree.', answer: false, review: 3,
          why: 'Slide 3: the right child holds an element greater than <b>or equal to</b> the parent. Equal elements always go right.',
          lessons: ['11-binary-search-trees'], skills: ['concept'], available_after: '11-binary-search-trees', level: 1 },
        { q: 'Tree R is built by adding 47, 23, 71, 11, 35, 59, 88, 29, 41, 64, 35 to an empty BST. What do findMin() and findMax() return?',
          options: ['11 and 88', '47 and 88', '11 and 64', '23 and 71'], answer: 0, review: 25,
          why: 'findMin goes left from the root: 47 → 23 → 11. findMax goes right: 47 → 71 → 88.',
          lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 1 },
        { type: 'match', q: 'Match the node to remove with what the removal does.', review: 17,
          pairs: [['a leaf', 'cut the link from its parent'], ['a node with one child', 'link its parent to that child'], ['a node with two children', 'copy the in-order successor, then remove the successor']],
          why: 'Slide 17. In case 3 the node stays and only its element changes; the successor node is the one cut out.',
          lessons: ['11-binary-search-trees'], skills: ['concept'], available_after: '11-binary-search-trees', level: 1 },
        { q: 'In tree R (adds 47, 23, 71, 11, 35, 59, 88, 29, 41, 64, 35), where is the second 35?',
          options: ['Right child of the first 35', 'Left child of 41', 'Right child of 29', 'Left child of the first 35'], answer: 1, review: 6,
          why: 'Path: 35 &lt; 47 → 23; 35 ≥ 23 → the first 35; 35 ≥ 35 → right to 41; 35 &lt; 41 → left, and that link is null. Equal goes right once, and then the normal rule continues.',
          lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 2 },
        { q: 'A search for 30 runs in tree R. Which nodes are compared with 30 before the search ends?',
          options: ['47, 23, 35, 29, 41', '47, 23, 11', '47, 23, 35, 29', '47, 23, 29'], answer: 2, review: 8,
          why: '30 &lt; 47 → 23; 30 ≥ 23 → 35; 30 &lt; 35 → 29; 30 ≥ 29 → right link of 29 is null: not found after 4 comparisons.',
          lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 2 },
        { q: 'What is the <b>pre-order</b> traversal of tree R?',
          options: ['11, 23, 29, 35, 35, 41, 47, 59, 64, 71, 88', '47, 23, 11, 35, 29, 41, 35, 71, 59, 64, 88', '47, 23, 71, 11, 35, 59, 88, 29, 41, 64, 35', '47, 23, 11, 35, 29, 35, 41, 71, 59, 64, 88'], answer: 1, review: 6,
          why: 'Tree: 47 → 23, 71; 23 → 11, 35; 35 → 29, 41; 41 → 35 (left); 71 → 59, 88; 59 → 64 (right). Pre-order visits each node before its subtrees. The first option is the in-order (sorted), the third the level-order.',
          lessons: ['10-trees', '11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 2 },
        { type: 'fill', q: 'Complete the private add of slide 22.', review: 22,
          code: 'private void add(TreeNode<T> node, T element) {\n  if (element.compareTo(node.element) ___ 0) {\n    if (node.left == null) node.left = ___;\n    else add(node.left, element);\n  }\n  else {\n    if (node.right == null) node.right = new TreeNode<>(element);\n    else ___(node.right, element);\n  }\n}',
          answer: ['<', 'new TreeNode<>(element)|new TreeNode<T>(element)', 'add'],
          why: 'Only smaller elements go left (<code>&lt; 0</code>). At a null link a new leaf is made; otherwise the method calls itself one level down.',
          lessons: ['11-binary-search-trees'], skills: ['design'], available_after: '11-binary-search-trees', level: 2 },
        { type: 'output', q: 'LinkedBST is the class of slides 21-26, and inOrder() comes from LinkedBT (unit 10). What does this print?', review: 24,
          code: 'LinkedBST<String> s = new LinkedBST<>();\nfor (String w : "pear fig kiwi apple plum fig".split(" ")) s.add(w);\ns.remove("pear");\nSystem.out.println(s.inOrder() + " " + s.findMin() + " " + s.findMax());',
          answer: '[apple, fig, fig, kiwi, plum] apple plum',
          why: 'Strings compare in alphabetical order. Tree: pear → fig (→ apple, kiwi (→ left fig)), plum. pear has two children; its successor is the smallest on the right: plum, a leaf. plum is copied into the root and the old leaf is cut off. The in-order is sorted alphabetically, with both copies of fig.',
          lessons: ['10-trees', '11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 2 },
        { type: 'write', q: 'Write `public boolean contains(T target)` for LinkedBST with a <b>loop</b>, like find of slide 23: start at the root, go left or right with compareTo, and return true as soon as the target is found.', review: 23,
          rows: 8, starter: 'public boolean contains(T target) {\n  \n}',
          checks: [{ re: /TreeNode\s*<\s*T\s*>\s+(\w+)\s*=\s*root\s*;/, label: 'Starts at the root' },
            { re: /while\s*\(\s*\w+\s*!=\s*null\s*\)/, label: 'Loops until it reaches a null link' },
            { re: /return\s+true\s*;/, label: 'Returns true when the target is found' },
            { re: /target\.compareTo\s*\(\s*\w+\.element\s*\)\s*<\s*0/, label: 'Uses compareTo to choose a side' },
            { re: /=\s*\w+\.left\s*;[\s\S]*=\s*\w+\.right\s*;/, label: 'Moves to the left or the right child' },
            { re: /return\s+false\s*;\s*\}\s*$/, label: 'Returns false after the loop' }],
          solution: 'public boolean contains(T target) {\n  TreeNode<T> node = root;\n  while (node != null) {\n    if (target.equals(node.element)) return true;\n    if (target.compareTo(node.element) < 0) node = node.left;\n    else node = node.right;\n  }\n  return false;\n}',
          why: 'The same walk as find: one path from the root, so O(height). Reaching null means the target is not in the tree.',
          lessons: ['11-binary-search-trees'], skills: ['design'], available_after: '11-binary-search-trees', level: 2 },
        { q: 'A balanced BST holds about one million (2²⁰) elements. About how many comparisons does one search need at most?',
          options: ['One million', 'About 1000', 'About 500 000', 'About 20'], answer: 3, review: 28,
          why: 'Search is O(log₂ N), and log₂ 2²⁰ = 20: one comparison per level. A degenerate tree with the same elements could need a million.',
          lessons: ['02-analysis-of-algorithms', '11-binary-search-trees'], skills: ['complexity'], available_after: '11-binary-search-trees', level: 2 },
        { type: 'trace', q: 'Tree R: 47 → 23, 71; 23 → 11, 35; 35 → 29, 41; 41 → 35 (left); 71 → 59, 88; 59 → 64 (right). Remove 23, then 47, then 35, with the slides\' remove. Fill in the case (1, 2 or 3), the in-order successor used ("-" if none) and the root after each removal.', review: 24,
          cols: ['remove', 'case', 'successor', 'root'],
          rows: [['23', '?3', '?29', '?47'], ['47', '?3', '?59', '?59'], ['35', '?2', '?-', '?59']],
          why: '23: the smallest on its right is 29 (35 → left 29), a leaf. 47: the smallest on the right is 59 (71 → left 59); 59 has a right child 64, which moves up to 71.left. 35 (the first one, now the right child of 29) has no left child, so it is replaced by its right child 41: case 2. The second 35 stays.',
          lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 3 },
        { type: 'multi', q: 'A new value is added to tree R and becomes the <b>left</b> child of 29. Which values could it be?', review: 4,
          options: ['23', '28', '29', '24', '22'], answer: [0, 1, 3],
          why: 'Left of 47: x &lt; 47. Right of 23: x ≥ 23. Left of 35: x &lt; 35. Left of 29: x &lt; 29. So 23 ≤ x &lt; 29. 29 would go to the right of 29, and 22 to the left of 23 … then right of 11.',
          lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 3 },
        { type: 'multi', q: 'The values 2, 4, 6, 8, 10, 12, 14 are added to an empty BST. Which add orders give a tree of height 2?', review: 31,
          options: ['8, 4, 12, 2, 6, 10, 14', '8, 4, 2, 6, 12, 10, 14', '2, 4, 6, 8, 10, 12, 14', '8, 12, 14, 10, 4, 6, 2', '4, 8, 12, 2, 6, 10, 14'], answer: [0, 1, 3],
          why: 'Height 2 for 7 nodes means the full tree 8 → 4 (→ 2, 6), 12 (→ 10, 14). Any order works if each node comes after its parent: 8 first, then 4 before 2 and 6, and 12 before 10 and 14. Sorted order gives a degenerate tree (height 6); starting with 4 gives height 3.',
          lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 3 },
        { q: 'AVL tree: 30 → 10 (left), 40 (right); 10 → 5 (left), 20 (right). 25 is added. Which rotation is done, and what is the new root?',
          options: ['A LeftRight rotation; root 20', 'A right rotation around 30; root 10', 'A RightLeft rotation; root 25', 'No rotation; root 30'], answer: 0, review: 36,
          why: '25 goes 30 → 10 → 20 → right. Now 30 has bf −2, and its left child 10 has bf +1: the long path is in the right subtree of the left child. Left rotation around 10, then right rotation around 30: 20 becomes the root, with 10 (→ 5) and 30 (→ 25, 40).',
          lessons: ['11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 3 },
        { q: '47 is removed from tree R (47 → 23, 71; 23 → 11, 35; 35 → 29, 41; 41 → 35 left; 71 → 59, 88; 59 → 64 right). Then levelOrder (unit 10, with a queue) runs. What does it give?',
          options: ['59, 23, 71, 11, 35, 59, 88, 29, 41, 35', '59, 23, 71, 11, 35, 64, 88, 29, 41, 35', '64, 23, 71, 11, 35, 59, 88, 29, 41, 35', '59, 23, 71, 11, 35, 88, 64, 29, 41, 35'], answer: 1, review: 16,
          why: 'The successor of 47 is 59; it is copied into the root, and its right child 64 moves up to 71.left. Level by level: 59; 23, 71; 11, 35, 64, 88; 29, 41; 35.',
          lessons: ['05-queues', '10-trees', '11-binary-search-trees'], skills: ['trace'], available_after: '11-binary-search-trees', level: 3 }
      ],
      tasks: [
        {
          title: 'Removing the maximum',
          task: '<p>Write <code>public T removeMax()</code> for <code>LinkedBST&lt;T&gt;</code> (field <code>root</code>; nodes have <code>element</code>, <code>left</code>, <code>right</code>). It is the mirror of removeMin (slide 26): return null for an empty tree; if the root has no right child, the root holds the maximum, so <code>root = root.left</code>; otherwise walk to the rightmost node, keeping its parent, and link the parent to the maximum\'s <b>left</b> child. Return the removed element.</p>',
          starter: 'public T removeMax() {\n  \n}',
          checks: [
            { re: /if\s*\(\s*root\s*==\s*null\s*\)\s*return\s+null\s*;/, label: 'An empty tree returns null', review: 26 },
            { re: /if\s*\(\s*root\.right\s*==\s*null\s*\)/, label: 'Checks if the root is the maximum', review: 26 },
            { re: /root\s*=\s*root\.left\s*;/, label: 'The root\'s left child becomes the root', review: 26 },
            { re: /TreeNode\s*<\s*T\s*>\s+(\w+)\s*=\s*root\.right\s*;/, label: 'Starts at the root\'s right child', review: 26 },
            { re: /while\s*\(\s*\w+\.right\s*!=\s*null\s*\)/, label: 'Walks right while there is a right child', review: 25 },
            { re: /\w+\.right\s*=\s*\w+\.left\s*;/, label: 'Links the parent to the maximum\'s left child', review: 26 },
            { re: /return\s+\w+\.element\s*;/, label: 'Returns the removed element', review: 26 }
          ],
          solution: 'public T removeMax() {\n  if (root == null) return null;\n  if (root.right == null) {\n    T element = root.element;\n    root = root.left;\n    return element;\n  }\n  TreeNode<T> parent = root;\n  TreeNode<T> curr = root.right;\n  while (curr.right != null) {\n    parent = curr;\n    curr = curr.right;\n  }\n  parent.right = curr.left;\n  return curr.element;\n}'
        },
        {
          title: 'The level of a target',
          task: '<p>Write <code>public int levelOf(T target)</code> for <code>LinkedBST&lt;T&gt;</code>. Walk down from the root like find (slide 23), counting the levels: the root is on level 0. Return the level of the first node that equals the target, or −1 if the target is not in the tree. Use a loop, not recursion.</p>',
          starter: 'public int levelOf(T target) {\n  \n}',
          checks: [
            { re: /TreeNode\s*<\s*T\s*>\s+(\w+)\s*=\s*root\s*;/, label: 'Starts at the root', review: 23 },
            { re: /int\s+(\w+)\s*=\s*0\s*;/, label: 'The level starts at 0', review: 5 },
            { re: /while\s*\(\s*\w+\s*!=\s*null\s*\)/, label: 'Loops until a null link', review: 23 },
            { re: /if\s*\(\s*target\.equals\s*\(\s*\w+\.element\s*\)\s*\)\s*return\s+\w+\s*;/, label: 'Returns the level when the target is found', review: 23 },
            { re: /target\.compareTo\s*\(\s*\w+\.element\s*\)\s*<\s*0/, label: 'compareTo chooses the side', review: 7 },
            { re: /\w+\s*\+\+\s*;|\w+\s*\+=\s*1\s*;|(\w+)\s*=\s*\1\s*\+\s*1\s*;/, label: 'Adds 1 for each step down', review: 5 },
            { re: /return\s+-\s*1\s*;/, label: 'Returns −1 when the target is not found', review: 7 }
          ],
          solution: 'public int levelOf(T target) {\n  TreeNode<T> node = root;\n  int level = 0;\n  while (node != null) {\n    if (target.equals(node.element)) return level;\n    if (target.compareTo(node.element) < 0) node = node.left;\n    else node = node.right;\n    level++;\n  }\n  return -1;\n}'
        }
      ]
    }
  });
})();
