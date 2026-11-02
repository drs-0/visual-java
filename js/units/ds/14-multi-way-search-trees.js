/* Data Structures · Unit 14 Multi-way Search Trees (25 slides): 2-3 trees (2-nodes and 3-nodes, adding with splits
   that ripple up to a new root), B-trees of order m, B*- and B+-trees, removing from a 2-3 tree (3-node to 2-node,
   rotations, several rotations, merging, a shorter tree, internal elements replaced by the in-order successor) and
   2-4 trees. One engine runs every drawing: keys are their own boxes, so they slide between nodes. */
(function () {
  function L(src, frag, nth) { var ls = src.split('\n'), c = 0; for (var i = 0; i < ls.length; i++) if (ls[i].indexOf(frag) >= 0 && ++c === (nth || 1)) return i + 1; throw new Error('no line ' + frag); }

  /* ---------- a multi-way tree: node = {id, keys, kids} ---------- */
  var NID = 0;
  function nd(keys, kids) { return { id: ++NID, keys: keys, kids: kids || [] }; }
  function cpM(n) { return n ? { id: n.id, keys: n.keys.slice(), kids: n.kids.map(cpM) } : null; }
  function isLeaf(n) { return !n.kids.length; }
  function inKeys(n, o) { o = o || []; if (!n) return o; if (isLeaf(n)) return o.concat(n.keys); n.kids.forEach(function (c, i) { o = inKeys(c, o); if (i < n.keys.length) o.push(n.keys[i]); }); return o; }
  function leavesOf(n, o) { o = o || []; if (!n) return o; if (isLeaf(n)) o.push(n); else n.kids.forEach(function (c) { leavesOf(c, o); }); return o; }
  function parentOf(r, x) { if (!r || isLeaf(r)) return null; for (var i = 0; i < r.kids.length; i++) { if (r.kids[i] === x) return { p: r, i: i }; var f = parentOf(r.kids[i], x); if (f) return f; } return null; }
  function height(n) { return !n ? -1 : isLeaf(n) ? 0 : 1 + height(n.kids[0]); }
  /* "45 / 30, 60 82 / 22, 35 40, 51 55, 75, 87": levels split by /, nodes by commas, keys by spaces */
  function parseStruct(s, m) {
    NID = 0; var lv = String(s).split('/').map(function (l) { return l.split(',').map(function (t) { return t.trim().split(/\s+/).filter(function (x) { return /^-?\d{1,3}$/.test(x); }).map(Number); }).filter(function (k) { return k.length; }); }).filter(function (l) { return l.length; });
    if (!lv.length) return { root: null };
    if (lv[0].length !== 1) return { err: 'The first level must be one node (the root).' };
    var levels = lv.map(function (l) { return l.map(function (k) { return nd(k); }); });
    for (var d = 1; d < levels.length; d++) {
      var need = levels[d - 1].reduce(function (a, n) { return a + n.keys.length + 1; }, 0);
      if (need !== levels[d].length) return { err: 'Level ' + (d + 1) + ' needs ' + need + ' nodes (one more than the elements above), but it has ' + levels[d].length + '.' };
      var c = 0; levels[d - 1].forEach(function (p) { for (var i = 0; i <= p.keys.length; i++) p.kids.push(levels[d][c++]); });
    }
    var all = levels.reduce(function (a, l) { return a.concat(l); }, []);
    if (all.some(function (n) { return n.keys.length > m - 1; })) return { err: 'A node has more than ' + (m - 1) + ' elements.' };
    var ks = inKeys(levels[0][0]);
    for (var i = 1; i < ks.length; i++) if (ks[i] <= ks[i - 1]) return { err: 'The elements are not in search-tree order (or one is repeated): ' + ks[i - 1] + ' then ' + ks[i] + '.' };
    return { root: levels[0][0] };
  }
  /* put the keys back in order into the same shape, with new sizes for some leaves */
  function refill(root, caps, keys) {
    var q = keys.slice();
    var go = function (n) { if (isLeaf(n)) { var c = caps[n.id] != null ? caps[n.id] : n.keys.length; n.keys = q.splice(0, c); return; } n.kids.forEach(function (k, i) { go(k); if (i < n.keys.length) n.keys[i] = q.shift(); }); };
    go(root);
  }

  /* ---------- drawing ---------- */
  function layoutM(root, o) {
    var pos = {}, kw = o.kw || 24, gap = 10, lv = leavesOf(root);
    var wOf = function (n) { return Math.max(1, n.keys.length) * kw + 6; };
    var total = lv.reduce(function (a, n) { return a + wOf(n); }, 0) + gap * Math.max(0, lv.length - 1);
    if (total > (o.W || 560)) { kw = Math.max(20, kw - Math.ceil((total - (o.W || 560)) / Math.max(1, lv.reduce(function (a, n) { return a + Math.max(1, n.keys.length); }, 0)))); gap = 6; total = lv.reduce(function (a, n) { return a + Math.max(1, n.keys.length) * kw + 6; }, 0) + gap * Math.max(0, lv.length - 1); }
    var x = (o.cx || 300) - total / 2;
    lv.forEach(function (n) { var w = Math.max(1, n.keys.length) * kw + 6; pos[n.id] = { cx: x + w / 2, w: w }; x += w + gap; });
    var walk = function (n, d) { if (!isLeaf(n)) { n.kids.forEach(function (c) { walk(c, d + 1); }); var a = pos[n.kids[0].id].cx, b = pos[n.kids[n.kids.length - 1].id].cx; pos[n.id] = { cx: (a + b) / 2, w: Math.max(1, n.keys.length) * kw + 6 }; } pos[n.id].y = (o.y0 || 40) + d * (o.dy || 74); };
    if (root) walk(root, 0);
    return { pos: pos, kw: kw };
  }
  /* o: tone {nodeId}, ktone {key}, ghost {key: true} (drawn dashed), etone {childId} */
  function drawM(root, o) {
    o = o || {}; var out = [], lay = layoutM(root, o), pos = lay.pos, kw = lay.kw;
    var walk = function (n) {
      var p = pos[n.id], x0 = p.cx - p.w / 2, tn = (o.tone && o.tone[n.id]) || 'muted';
      out.push(B('n' + n.id, x0, p.y, p.w, 30, { title: n.keys.length ? '' : '?', mono: true, size: 12, tone: n.keys.length ? tn : 'red', fill: 'soft', dash: !n.keys.length, z: 0 }));
      n.keys.forEach(function (k, i) { var kt = (o.ktone && o.ktone[k]) || 'blue'; out.push(B('k' + k, x0 + 3 + i * kw, p.y + 4, kw - 2, 22, { title: String(k), mono: true, size: String(k).length >= 3 ? (kw < 26 ? 9 : 11) : kw < 22 ? 10 : 12, tone: kt, fill: kt === 'accent' ? 'solid' : 'soft', hi: kt === 'accent', z: 1 })); });
      n.kids.forEach(function (c, j) { var cp = pos[c.id]; out.push(A('e' + c.id, x0 + 3 + j * (n.keys.length ? (p.w - 6) / n.keys.length : 0), p.y + 30, cp.cx, cp.y, { tone: (o.etone && o.etone[c.id]) || 'muted' })); walk(c); });
    };
    if (root) walk(root);
    else out.push(T('empty', 300, 60, '(empty tree)', { anchor: 'middle', mono: true, size: 14, tone: 'muted' }));
    return out;
  }

  /* ---------- the engine: add and remove with steps ---------- */
  function run(v, m, code, ops, slides) {
    var st = [], parsed = parseStruct(v.t, m), root = parsed.root, minK = Math.ceil(m / 2) - 1, nm = m === 3 ? '2-3 tree' : m === 4 ? '2-4 tree' : 'B-tree of order ' + m;
    var snap = function (o) { o.t = cpM(root); st.push(o); return o; };
    var ln = function (f) { return L(code, f); };
    if (parsed.err) { root = null; snap({ slide: slides.start, line: 1, cap: 'This start tree cannot be used: ' + parsed.err + ' The tree starts empty.' }); }
    else snap({ slide: slides.start, line: 1, cap: (root ? 'The start ' + nm + ': ' + inKeys(root).length + ' elements, height ' + height(root) + '. All leaves are on the same level.' : 'The ' + nm + ' starts empty.') + ' Each node holds up to ' + (m - 1) + ' elements and has up to ' + m + ' children.' });
    var tone1 = function (id, t) { var o = {}; o[id] = t; return o; };
    var key1 = function (k, t) { var o = {}; o[k] = t; return o; };
    var add = function (x) {
      if (!root) { root = nd([x]); snap({ slide: slides.add, line: ln('put x into the leaf'), ktone: key1(x, 'accent'), cap: 'add ' + x + ': the tree is empty, so ' + x + ' becomes a one-element root.' }); return; }
      var path = [], n = root;
      while (true) {
        if (n.keys.indexOf(x) >= 0) { snap({ slide: slides.add, line: ln('go down'), tone: tone1(n.id, 'red'), cap: 'add ' + x + ': ' + x + ' is already in the tree. A search tree keeps each element once here, so nothing is added.' }); return; }
        if (isLeaf(n)) break;
        var i = 0; while (i < n.keys.length && x > n.keys[i]) i++;
        snap({ slide: slides.add, line: ln('go down'), tone: tone1(n.id, 'accent'), cap: 'add ' + x + ': at [' + n.keys.join(' ') + '], ' + (i === 0 ? x + ' &lt; ' + n.keys[0] : i === n.keys.length ? x + ' &gt; ' + n.keys[i - 1] : n.keys[i - 1] + ' &lt; ' + x + ' &lt; ' + n.keys[i]) + ': go to child ' + (i + 1) + ' of ' + n.kids.length + '.' });
        path.push(n); n = n.kids[i];
      }
      var j = 0; while (j < n.keys.length && x > n.keys[j]) j++; n.keys.splice(j, 0, x);
      snap({ slide: slides.add, line: ln('put x into the leaf'), tone: tone1(n.id, n.keys.length >= m ? 'red' : 'teal'), ktone: key1(x, 'accent'), cap: 'Put ' + x + ' into the leaf, in order: [' + n.keys.join(' ') + '].' + (n.keys.length < m ? ' It fits (at most ' + (m - 1) + ' elements): done, no split.' : ' Now it has ' + m + ' elements: <b>too many</b>.') });
      while (n.keys.length >= m) {
        var mid = Math.floor(m / 2), up = n.keys[mid], right = nd(n.keys.slice(mid + 1), n.kids.slice(mid + 1)); n.keys = n.keys.slice(0, mid); n.kids = n.kids.slice(0, mid + 1);
        if (!path.length) {
          var old = n; root = nd([up], [old, right]);
          snap({ slide: slides.root, line: ln('new root'), tone: tone1(root.id, 'teal'), ktone: key1(up, 'accent'), cap: 'Split the root: ' + up + ' moves up into a <b>new root</b>; [' + old.keys.join(' ') + '] and [' + right.keys.join(' ') + '] become its children. The tree grows taller by one level, at the top, so all leaves stay on the same level.' });
          break;
        }
        var p = path.pop(), at = p.kids.indexOf(n), k2 = 0; while (k2 < p.keys.length && up > p.keys[k2]) k2++;
        p.keys.splice(k2, 0, up); p.kids.splice(at + 1, 0, right);
        snap({ slide: p.keys.length >= m ? slides.ripple : slides.split, line: ln('split it'), tone: tone1(p.id, p.keys.length >= m ? 'red' : 'teal'), ktone: key1(up, 'accent'), cap: 'Split: the middle element ' + up + ' moves <b>up</b> into its parent; [' + n.keys.join(' ') + '] and [' + right.keys.join(' ') + '] are two nodes now.' + (p.keys.length >= m ? ' The parent [' + p.keys.join(' ') + '] is too full too: the split <b>ripples</b> up.' : ' The parent has room: done.') });
        n = p;
      }
    };
    var fixInternal = function (N) {
      while (N.keys.length < minK) {
        if (N === root) { if (!N.keys.length) { root = N.kids[0]; snap({ slide: slides.shrink, line: ln('empty root'), cap: 'The root is empty: its only child becomes the new root. The tree is one level <b>shorter</b>, and all leaves are still on one level.' }); } return; }
        var f = parentOf(root, N), P = f.p, ci = f.i, Lf = ci > 0 ? P.kids[ci - 1] : null, Rt = ci < P.kids.length - 1 ? P.kids[ci + 1] : null;
        if (Lf && Lf.keys.length > minK) { N.keys.unshift(P.keys[ci - 1]); P.keys[ci - 1] = Lf.keys.pop(); N.kids.unshift(Lf.kids.pop()); snap({ slide: slides.rot, line: ln('a sibling has'), tone: tone1(N.id, 'teal'), cap: 'The empty inner node borrows through its parent: ' + N.keys[0] + ' comes down, ' + P.keys[ci - 1] + ' goes up from the left sibling, and that sibling’s last child moves over.' }); return; }
        if (Rt && Rt.keys.length > minK) { N.keys.push(P.keys[ci]); P.keys[ci] = Rt.keys.shift(); N.kids.push(Rt.kids.shift()); snap({ slide: slides.rot, line: ln('a sibling has'), tone: tone1(N.id, 'teal'), cap: 'The empty inner node borrows through its parent: ' + N.keys[N.keys.length - 1] + ' comes down, ' + P.keys[ci] + ' goes up from the right sibling, and that sibling’s first child moves over.' }); return; }
        if (Lf) { var sep = P.keys[ci - 1]; Lf.keys = Lf.keys.concat([sep], N.keys); Lf.kids = Lf.kids.concat(N.kids); P.keys.splice(ci - 1, 1); P.kids.splice(ci, 1); snap({ slide: slides.shrink, line: ln('else merge'), tone: tone1(Lf.id, 'teal'), ktone: key1(sep, 'accent'), cap: 'No sibling can lend: ' + sep + ' comes down from the parent and the two inner nodes <b>merge</b> into [' + Lf.keys.join(' ') + '].' + (P.keys.length < minK ? ' Now the parent is empty: fix it the same way, one level up.' : '') }); }
        else { var sep2 = P.keys[ci]; Rt.keys = N.keys.concat([sep2], Rt.keys); Rt.kids = N.kids.concat(Rt.kids); P.keys.splice(ci, 1); P.kids.splice(ci, 1); snap({ slide: slides.shrink, line: ln('else merge'), tone: tone1(Rt.id, 'teal'), ktone: key1(sep2, 'accent'), cap: 'No sibling can lend: ' + sep2 + ' comes down from the parent and the two inner nodes <b>merge</b> into [' + Rt.keys.join(' ') + '].' + (P.keys.length < minK ? ' Now the parent is empty: fix it the same way, one level up.' : '') }); }
        N = P;
      }
    };
    var remove = function (x) {
      var n = root, path = [];
      while (n && n.keys.indexOf(x) < 0) { if (isLeaf(n)) { n = null; break; } var i = 0; while (i < n.keys.length && x > n.keys[i]) i++; path.push(n); n = n.kids[i]; }
      if (!n) { snap({ slide: slides.rm, line: 1, cap: 'remove ' + x + ': ' + x + ' is not in the tree. Nothing changes.' }); return; }
      var leaf = n;
      if (!isLeaf(n)) {
        var ki = n.keys.indexOf(x), s = n.kids[ki + 1]; while (!isLeaf(s)) s = s.kids[0];
        var succ = s.keys[0];
        snap({ slide: slides.inner, line: ln('internal node'), tone: tone1(n.id, 'accent'), ktone: (function () { var o = key1(x, 'red'); o[succ] = 'teal'; return o; })(), cap: 'remove ' + x + ': it is in an <b>internal</b> node. Its in-order successor is ' + succ + ' (go right once, then left to a leaf). ' + succ + ' takes the place of ' + x + '.' });
        n.keys[ki] = succ; s.keys.shift(); leaf = s;
        snap({ slide: slides.inner, line: code.indexOf('(then remove') >= 0 ? ln('(then remove') : ln('internal node'), tone: tone1(s.id, s.keys.length < minK ? 'red' : 'teal'), ktone: key1(succ, 'accent'), cap: succ + ' moved up; its leaf now has ' + (s.keys.length ? '[' + s.keys.join(' ') + ']' : 'nothing left') + '.' + (s.keys.length < minK ? ' An empty leaf: an <b>underflow</b>.' : ' Done.') });
      } else {
        leaf.keys.splice(leaf.keys.indexOf(x), 1);
        snap({ slide: leaf.keys.length >= minK ? slides.rm : slides.rot, line: leaf.keys.length >= minK ? ln('just take x out') : ln('underflow'), tone: tone1(leaf.id, leaf.keys.length >= minK ? 'teal' : 'red'), cap: 'remove ' + x + ' from its leaf. ' + (leaf.keys.length >= minK ? 'The leaf still has ' + leaf.keys.length + ' element' + (leaf.keys.length === 1 ? '' : 's') + ' (a ' + (leaf.keys.length + 1) + '-node now): done.' : 'The leaf is <b>empty</b>: an underflow. Something must fill it.') });
      }
      if (leaf.keys.length >= minK) return;
      if (leaf === root) { root = null; snap({ slide: slides.rm, line: ln('underflow'), cap: 'It was the only element: the tree is empty.' }); return; }
      var f = parentOf(root, leaf), P = f.p, ci = f.i, Lf = ci > 0 ? P.kids[ci - 1] : null, Rt = ci < P.kids.length - 1 ? P.kids[ci + 1] : null;
      if (Lf && Lf.keys.length > minK) { var dn = P.keys[ci - 1], upk = Lf.keys[Lf.keys.length - 1]; leaf.keys.unshift(dn); P.keys[ci - 1] = Lf.keys.pop(); snap({ slide: slides.rot, line: ln('a sibling has'), tone: tone1(leaf.id, 'teal'), ktone: (function () { var o = key1(dn, 'accent'); o[upk] = 'accent'; return o; })(), cap: '<b>Rotation</b>: the left sibling has ' + (Lf.keys.length + 1) + ' elements. ' + dn + ' comes down from the parent into the empty leaf, and ' + upk + ' goes up from the sibling to replace it.' }); return; }
      if (Rt && Rt.keys.length > minK) { var dn2 = P.keys[ci], upk2 = Rt.keys[0]; leaf.keys.push(dn2); P.keys[ci] = Rt.keys.shift(); snap({ slide: slides.rot, line: ln('a sibling has'), tone: tone1(leaf.id, 'teal'), ktone: (function () { var o = key1(dn2, 'accent'); o[upk2] = 'accent'; return o; })(), cap: '<b>Rotation</b>: the right sibling has ' + (Rt.keys.length + 1) + ' elements. ' + dn2 + ' comes down from the parent into the empty leaf, and ' + upk2 + ' goes up from the sibling to replace it.' }); return; }
      if (P.keys.length > minK) {
        if (Lf) { var s1 = P.keys[ci - 1]; Lf.keys.push(s1); P.keys.splice(ci - 1, 1); P.kids.splice(ci, 1); snap({ slide: slides.merge, line: ln('the parent has'), tone: tone1(Lf.id, 'teal'), ktone: key1(s1, 'accent'), cap: 'No sibling can lend, but the parent has ' + (P.keys.length + 1) + ' elements: ' + s1 + ' comes down and <b>merges</b> with the left sibling into [' + Lf.keys.join(' ') + ']. The empty leaf is gone, and the parent loses one element and one child.' }); }
        else { var s2 = P.keys[ci]; Rt.keys.unshift(s2); P.keys.splice(ci, 1); P.kids.splice(ci, 1); snap({ slide: slides.merge, line: ln('the parent has'), tone: tone1(Rt.id, 'teal'), ktone: key1(s2, 'accent'), cap: 'No sibling can lend, but the parent has ' + (P.keys.length + 1) + ' elements: ' + s2 + ' comes down and <b>merges</b> with the right sibling into [' + Rt.keys.join(' ') + ']. The empty leaf is gone, and the parent loses one element and one child.' }); }
        return;
      }
      var lv = leavesOf(root), h = lv.indexOf(leaf), best = -1;
      for (var dd = 1; dd < lv.length && best < 0; dd++) { if (h + dd < lv.length && lv[h + dd].keys.length > minK) best = h + dd; else if (h - dd >= 0 && lv[h - dd].keys.length > minK) best = h - dd; }
      if (best >= 0) {
        var donor = lv[best], keys = inKeys(root), caps = {}, right = best > h;
        /* the leaf of the hole's side that touches the separator between the two sides gets one extra element first */
        var a = leaf, b = donor, pa = [], pb = []; var up1 = function (x0, arr) { var q = x0; while (q !== root) { var g = parentOf(root, q); arr.push(g); q = g.p; } }; up1(a, pa); up1(b, pb);
        var lca = null, sideA = null; for (var i1 = 0; i1 < pa.length && !lca; i1++) for (var j1 = 0; j1 < pb.length; j1++) if (pa[i1].p === pb[j1].p) { lca = pa[i1].p; sideA = pa[i1].i; break; }
        var sub = lca.kids[sideA]; while (!isLeaf(sub)) sub = right ? sub.kids[sub.kids.length - 1] : sub.kids[0];
        snap({ slide: slides.multi, line: ln('further away'), tone: (function () { var o = tone1(leaf.id, 'red'); o[donor.id] = 'teal'; return o; })(), cap: 'No sibling can lend and the parent has only one element. The nearest leaf with a spare element is [' + donor.keys.join(' ') + ']: elements will move along, one <b>rotation</b> at a time, toward the empty leaf.' });
        if (sub !== leaf && sub !== donor) {
          caps[donor.id] = donor.keys.length - 1; caps[sub.id] = sub.keys.length + 1; caps[leaf.id] = 0; refill(root, caps, keys);
          snap({ slide: slides.multi, line: ln('further away'), tone: tone1(sub.id, 'teal'), cap: 'First rotation, through [' + lca.keys.join(' ') + ']: an element comes down into the ' + (right ? 'left' : 'right') + ' part and one goes up from the ' + (right ? 'right' : 'left') + ' part. The leaf [' + sub.keys.join(' ') + '] now has a spare element, right next to the empty leaf’s side.' });
          caps = {}; caps[sub.id] = sub.keys.length - 1; caps[leaf.id] = minK; refill(root, caps, keys);
          snap({ slide: slides.multi, line: ln('further away'), tone: tone1(leaf.id, 'teal'), cap: 'Second rotation, inside that part: an element comes down into the empty leaf and one goes up. Done: the tree has the same shape, and every node has 1 or 2 elements.' });
        } else {
          caps[donor.id] = donor.keys.length - 1; caps[leaf.id] = minK; refill(root, caps, keys);
          snap({ slide: slides.multi, line: ln('further away'), tone: tone1(leaf.id, 'teal'), cap: 'The rotations move each element one place along the in-order list: the empty leaf is filled and the far leaf gives up its spare element.' });
        }
        return;
      }
      var sib = Lf || Rt, sp = Lf ? P.keys[ci - 1] : P.keys[ci];
      if (Lf) { Lf.keys.push(sp); } else { Rt.keys.unshift(sp); }
      P.keys.splice(Lf ? ci - 1 : ci, 1); P.kids.splice(ci, 1);
      snap({ slide: slides.shrink, line: ln('else merge'), tone: tone1(sib.id, 'teal'), ktone: key1(sp, 'accent'), cap: 'No leaf anywhere has a spare element, and the parent has one element: ' + sp + ' comes down and <b>merges</b> with the sibling into [' + sib.keys.join(' ') + ']. The parent is now empty.' });
      fixInternal(P);
    };
    ops.forEach(function (o) { if (o.rm) remove(o.x); else add(o.x); });
    return st;
  }
  function parseOps(s, rmDefault) {
    var out = [], mode = rmDefault ? 'rm' : 'add';
    String(s).split(/[\s,;]+/).filter(Boolean).forEach(function (w) { var lw = w.toLowerCase(); if (lw === 'add' || lw === 'insert') { mode = 'add'; return; } if (lw === 'remove' || lw === 'rm' || lw === 'delete') { mode = 'rm'; return; } if (/^-?\d{1,3}$/.test(w)) out.push({ rm: mode === 'rm', x: +w }); });
    return out.slice(0, 16);
  }
  function legend() { return T('lg', 300, 330, 'orange: the element moving now · teal: changed node · red: problem (too full or empty)', { anchor: 'middle', size: 11, tone: 'muted' }); }

  /* ---------- 1. adding to a 2-3 tree (slides 4-9) ---------- */
  var AC = 'add x:\n  go down from the root to a leaf, like a search\n  put x into the leaf, in order\n  while a node has 3 elements (one too many):\n    split it: the middle element moves up into the parent;\n    the left and right elements become two 2-nodes\n  if the root splits, its middle element is the new root\n    (the tree grows at the top: all leaves stay on one level)';
  var S5 = '45 / 30, 60 82 / 22, 35 40, 51 55, 75, 87';
  var t23add = {
    id: 't23add', slides: [4, 9], title: 'Adding to a 2-3 tree: fill a leaf, split, ripple', lang: 'text', vb: [600, 340],
    code: AC,
    inputs: [{ id: 't', type: 'text', label: 'start tree', value: S5, minlen: 0, maxlen: 90 }, { id: 'a', type: 'text', label: 'add', value: '27', minlen: 0, maxlen: 40 }],
    inputsLabel: 'Start tree: levels split by <code>/</code>, nodes by commas, elements by spaces (empty = no tree).',
    presets: [{ label: 'slide 6: add 27', values: { t: S5, a: '27' } }, { label: 'slide 7: add 32', values: { t: '45 / 30, 60 82 / 22 27, 35 40, 51 55, 75, 87', a: '32' } }, { label: 'slide 8: add 57', values: { t: '45 / 30 35, 60 82 / 22 27, 32, 40, 51 55, 75, 87', a: '57' } }, { label: 'slide 9: add 25', values: { t: '45 60 / 30 35, 55, 82 / 22 27, 32, 40, 51, 57, 75, 87', a: '25' } }, { label: 'all four in a row', values: { t: S5, a: '27 32 57 25' } }, { label: 'from empty: 1 to 7', values: { t: '', a: '1 2 3 4 5 6 7' } }],
    steps: function (v) { var st = run(v, 3, AC, parseOps(v.a, false), { start: 5, add: 6, split: 7, ripple: 8, root: 9 }); st[0].slide = 4; st.push({ t: st[st.length - 1].t, slide: 9, line: '6-8', cap: 'Every node is a 2-node (1 element, 0 or 2 children) or a 3-node (2 elements, 0 or 3 children), and all leaves are on the same level: the tree is always balanced.' }); return st; },
    draw: function (k, s) { return drawM(s.t, { tone: s.tone, ktone: s.ktone }).concat([legend()]); }
  };

  /* ---------- 2. B-trees of any order (slides 10-14) ---------- */
  var BC = 'a B-tree of order m: each node has at most m children\n  (at most m − 1 elements)\nadd x:\n  go down from the root to a leaf, like a search\n  put x into the leaf, in order\n  while a node has m elements (one too many):\n    split it: the middle element moves up into the parent\n  if the root splits, its middle element is the new root';
  var S12 = '5 12 22 35 55 / 1 3 4, 7 8 11, 13 16 17 21, 25 28 31 32 33, 40 43, 60 75 80';
  var btree = {
    id: 'btree', slides: [10, 14], title: 'B-trees: the order m is the most children a node may have', lang: 'text', vb: [600, 340],
    code: BC,
    inputs: [{ id: 'm', label: 'order m', value: 6, min: 3, max: 6 }, { id: 't', type: 'text', label: 'start tree', value: S12, minlen: 0, maxlen: 100 }, { id: 'a', type: 'text', label: 'add', value: '29', minlen: 0, maxlen: 40 }],
    presets: [{ label: 'slide 12 (order 6): add 29', values: { m: 6, t: S12, a: '29' } }, { label: 'order 6: add 2, 6, 9', values: { m: 6, t: S12, a: '2 6 9' } }, { label: 'order 3 = a 2-3 tree', values: { m: 3, t: '', a: '10 20 30 40 50' } }, { label: 'order 4 = a 2-4 tree', values: { m: 4, t: '', a: '10 20 30 40 50' } }, { label: 'order 5', values: { m: 5, t: '', a: '10 20 30 40 50 60 70' } }],
    steps: function (v) {
      var m = Math.trunc(v.m), st = run({ t: v.t }, m, BC, parseOps(v.a, false), { start: 11, add: 12, split: 12, ripple: 12, root: 12 });
      st[0].slide = 10; st[0].line = '1-2';
      st.push({ t: st[st.length - 1].t, slide: 13, line: '1-2', cap: 'Variations: a <b>B*-tree</b> keeps every node (except the root) at least two-thirds full; a <b>B+-tree</b> also keeps every element in a leaf and links the leaves, so all elements can be read in order, leaf after leaf.' });
      return st;
    },
    draw: function (k, s) { return drawM(s.t, { tone: s.tone, ktone: s.ktone, kw: 24 }).concat([legend()]); }
  };

  /* ---------- 3. removing from a 2-3 tree (slides 17-22) ---------- */
  var RC = 'remove x:\n  x in an internal node: replace it with its in-order successor\n    (then remove the successor from its leaf)\n  a leaf with 2 elements: just take x out (3-node → 2-node)\n  a leaf with 1 element: underflow (an empty leaf)\n    a sibling has 2 elements → rotation through the parent\n    else the parent has 2 elements → merge: one parent element\n         moves down and joins the sibling\n    else a leaf further away has 2 elements → several rotations\n    else merge, and fix the parent the same way;\n         an empty root is removed (the tree gets shorter)';
  var t23rm = {
    id: 't23rm', slides: [17, 22], title: 'Removing from a 2-3 tree: rotate, merge, or shrink', lang: 'text', vb: [600, 340],
    code: RC,
    inputs: [{ id: 't', type: 'text', label: 'start tree', value: S5, minlen: 0, maxlen: 90 }, { id: 'r', type: 'text', label: 'remove', value: '51', minlen: 0, maxlen: 40 }],
    inputsLabel: 'Start tree: levels split by <code>/</code>, nodes by commas, elements by spaces.',
    presets: [{ label: 'slide 17: remove 51', values: { t: S5, r: '51' } }, { label: 'slide 18: remove 22', values: { t: S5, r: '22' } }, { label: 'slide 19: remove 30', values: { t: '45 / 35, 60 82 / 30, 40, 51 55, 75, 87', r: '30' } }, { label: 'slide 20: remove 55', values: { t: '51 / 40, 60 82 / 30, 45, 55, 75, 87', r: '55' } }, { label: 'slide 21: remove 45', values: { t: '51 / 40, 82 / 35, 45, 75, 87', r: '45' } }, { label: 'slide 22: remove 30, 60', values: { t: S5, r: '30 60' } }],
    steps: function (v) { return run(v, 3, RC, parseOps(v.r, true), { start: 17, rm: 17, rot: 18, multi: 19, merge: 20, shrink: 21, inner: 22 }); },
    draw: function (k, s) { return drawM(s.t, { tone: s.tone, ktone: s.ktone }).concat([legend()]); }
  };

  /* ---------- 4. 2-4 trees (slides 23-25) ---------- */
  var FC = 'a 2-4 tree: nodes with 1, 2 or 3 elements (2, 3 or 4 children)\nadd x:\n  go down from the root to a leaf, like a search\n  put x into the leaf, in order\n  a node with 4 elements: split it: the third element moves up\n    into the parent (a new root if it was the root)\nremove x:\n  x in an internal node: replace it with its in-order successor\n  a leaf with 2 or 3 elements: just take x out\n  a leaf with 1 element: underflow (an empty leaf)\n    a sibling has 2 or more elements → rotation through the parent\n    else the parent has 2 or more elements → merge with a sibling\n    else a leaf further away has a spare element → rotations\n    else merge, and fix the parent the same way;\n         an empty root is removed (the tree gets shorter)';
  var t24 = {
    id: 't24', slides: [23, 25], title: '2-4 trees: the same rules, nodes of up to 3 elements', lang: 'text', vb: [600, 340],
    code: FC,
    inputs: [{ id: 't', type: 'text', label: 'start tree', value: '', minlen: 0, maxlen: 90 }, { id: 'o', type: 'text', label: 'operations', value: 'add 3 55 14 25 40 22 99 60 17', minlen: 0, maxlen: 90 }],
    inputsLabel: 'Operations: <code>add 3 55</code>, <code>remove 40</code>.',
    presets: [{ label: 'slide 24: insertions', values: { t: '', o: 'add 3 55 14 25 40 22 99 60 17' } }, { label: 'slide 25: removals', values: { t: '17 25 60 / 3 14, 22, 40 55, 99', o: 'remove 3 40 17 22 25 14 99' } }, { label: 'add then remove', values: { t: '', o: 'add 10 20 30 40 50 60, remove 10 20 30' } }],
    steps: function (v) { return run(v, 4, FC, parseOps(v.o, false), { start: 23, add: 24, split: 24, ripple: 24, root: 24, rm: 25, rot: 25, multi: 25, merge: 25, shrink: 25, inner: 25 }); },
    draw: function (k, s) { return drawM(s.t, { tone: s.tone, ktone: s.ktone }).concat([legend()]); }
  };

  var bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; };

  addUnit({
    course: 'ds', lesson: '14-multi-way-search-trees',
    blurb: '2-3 and 2-4 trees (nodes with more than one element), adding with splits, removing with rotations and merges, and B-trees used by file systems and databases.',
    parts: [
      { title: 'Multi-way trees and adding to a 2-3 tree', from: 1, to: 9 },
      { title: 'B-trees', from: 10, to: 16 },
      { title: 'Removing from 2-3 trees, and 2-4 trees', from: 17, to: 25 }
    ],
    visuals: [t23add, btree, t23rm, t24],
    slides: {
      1: { cover: true, explain: '<p>A <b>multi-way search tree</b> lets a node hold <b>more than one</b> element and have more than two children.</p><pre class="ex">     [45]\n    /    \\\n [30]   [60 82]</pre><p>This unit: 2-3 trees, 2-4 trees and B-trees. They stay perfectly balanced: all leaves are always on the same level.</p>' },
      2: { explain: '<p>The chapter covers:</p><pre class="ex">2-3 trees and 2-4 trees\nB-trees (the general idea)\nB*-trees and B+-trees (special B-trees)</pre><p>They are the trees behind databases and file systems.</p>' },
      3: { explain: '<p>We know two kinds of trees:</p><pre class="ex">general tree: many children, no order\nBST: order (left &lt; node ≤ right), only 2 children</pre><p>A <b>multi-way search tree</b> mixes them: many children per node, <b>and</b> an order between the elements, so we can still search quickly.</p>' },
      4: { blocks: [bul('In a 2-3 tree, each node has two or three children'), bul('A 2-node contains one element, and a 3-node contains two elements'), bul('A 2-node can has either two children or no children'), bul('A 3-node has either three children or no children')],
        explain: '<p>Two kinds of nodes:</p><pre class="ex">2-node: 1 element,  2 children (or none)\n3-node: 2 elements, 3 children (or none)</pre><p>The name counts <b>children</b>, not elements. A node never has just one child: it has all its children or none (a leaf).</p><p class="watch">The slide says "can has": it means "can have".</p>' },
      5: { text: false, blocks: [bul('A 2-3 tree:'), bul('The relationship among the parents and children reflect the contents')], explain: '<p>The order rule, like a BST but with more children:</p><pre class="ex">[60 82]: left child  &lt; 60       → 51 55\n         middle child 60 … 82  → 75\n         right child &gt; 82       → 87</pre><p>A search compares with the one or two elements of a node and picks one of its 2 or 3 children.</p>' },
      6: { text: false, blocks: [bul('Inserting an element may simply add an element to a leaf node'), bul('Adding 27:')], explain: '<p>New elements always go into a <b>leaf</b>. Adding 27:</p><pre class="ex">27 &lt; 45 → left; 27 &lt; 30 → left: leaf [22]\n[22] becomes [22 27]</pre><p>The leaf was a 2-node, so it simply becomes a 3-node. Nothing else changes.</p>' },
      7: { text: false, blocks: [bul('Inserting an element may split a 3-node and move an element up'), bul('Adding 32:')], explain: '<p>Adding 32 to the full leaf [35 40] gives [32 35 40]: three elements is one too many.</p><pre class="ex">split: 35 (the middle) moves up to the parent\n[30] becomes [30 35]\nchildren: [22 27], [32], [40]</pre><p>The parent had room, so the split stops there.</p>' },
      8: { text: false, blocks: [bul('Splitting a 3-node whose parent is already a 3-node causes ripple effects'), bul('Adding 57:')], explain: '<p>Adding 57: [51 55 57] splits, 55 moves up into [60 82] → [55 60 82], which is also too full.</p><pre class="ex">split again: 60 moves up into the root\nroot [45] → [45 60]</pre><p>One split can cause another one higher up: a <b>{{ripple|تموّج}} effect</b>.</p>' },
      9: { text: false, blocks: [bul('If a ripple effect propagates all the way to the root, a new 2-node is created'), bul('Adding 25:')], explain: '<p>Adding 25: [22 25 27] splits (25 up), [25 30 35] splits (30 up), and the root [30 45 60] splits too.</p><pre class="ex">45 goes up into a NEW root [45]\nthe tree is one level taller</pre><p>A 2-3 tree grows only at the <b>top</b>, so all leaves always stay on the same level.</p>' },
      10: { blocks: [bul('2-3 Tree is a B-tree of order 3'), bul('2-4 Tree is a B-tree of order 4'), bul('Visualization:'), bul('https://www.cs.usfca.edu/~galles/visualization/BTree.html', 1)], explain: '<p>2-3 and 2-4 trees are small members of one family, the <b>B-trees</b>:</p><pre class="ex">order 3 → at most 3 children (2-3 tree)\norder 4 → at most 4 children (2-4 tree)</pre><p>The link on the slide opens an online tool where you can add and remove elements and watch a B-tree change.</p>' },
      11: { explain: '<p>The <b>order</b> of a B-tree is the most children a node may have.</p><pre class="ex">order m: up to m children, up to m − 1 elements\norder 3: up to 2 elements per node\norder 6: up to 5 elements per node</pre><p>Adding works the same for every order: put the element in a leaf; when a node gets m elements, split it and move the middle one up.</p>' },
      12: { text: false, blocks: [bul('A B-tree of order 6:')], explain: '<p>A B-tree of order 6: the root has 5 elements and 6 children, each child holds up to 5 elements.</p><pre class="ex">5 12 22 35 55\nleaf 13 16 17 21: between 12 and 22</pre><p>Wide nodes make the tree very short: millions of elements fit in 3 or 4 levels, so only a few nodes are read from the disk.</p><p class="watch">The empty boxes are free places in a node, waiting for new elements.</p>' },
      13: { blocks: [bul('A B*-tree is a B-tree that guarantees that each non-root node is at least two-thirds full'), bul('This avoids the problem of the B-tree being half empty', 1), bul('In a B+-tree, each element appears in a leaf, even if it also appears in an internal node'), bul('This improves the sequential access to all elements of the tree', 1)],
        explain: '<p>Two variations:</p><pre class="ex">B*-tree: every node (not the root) is\n         at least 2/3 full → less wasted space\nB+-tree: every element is also in a leaf,\n         and the leaves are linked in order</pre><p>In a B+-tree you can read all elements in order by walking the leaves from left to right.</p>' },
      14: { text: false, blocks: [bul('A B+-tree of order 6:')], explain: '<p>The B+-tree picture: the root elements 5, 12, 22, 35, 55 appear <b>again</b> in the leaves (5 7 8, 12 16 17 21 …), and arrows link each leaf to the next one.</p><pre class="ex">sorted walk: 1 3 4 → 5 7 8 → 12 … → 55 60 80</pre><p>Inner nodes are only signposts; the data is all in the leaves.</p>' },
      15: { blocks: [bul('File systems: B-trees are often used to implement file systems, particularly in systems that need to manage large numbers of files and directories. For example, the NTFS file system used by Windows uses a variant of the B-tree data structure to organize files and directories.'), bul('Database systems: Many database systems use B-trees to manage indexes and to store and retrieve data. B-trees are particularly useful in these applications because they allow for efficient search and retrieval of data, even when dealing with large amounts of data.'), bul('Search engines: Search engines use B-trees to store the index of web pages. The B-tree data structure allows for fast searching and retrieval of web pages based on keywords.'), bul('Operating systems: B-trees are used in operating systems to manage memory allocation and to organize file caches. For example, the FreeBSD operating system uses B-trees to manage the file system cache.'), bul('Network routers: B-trees are used in network routers to manage routing tables. The B-tree data structure allows for efficient lookup of routing information and helps to ensure that packets are delivered to their intended destinations as quickly as possible.'), bul('File transfer protocols: B-trees are used in file transfer protocols, such as the BitTorrent protocol, to manage the distribution of files across a network. The data structure allows for efficient tracking of which pieces of a file have been downloaded and which still need to be downloaded.')],
        explain: '<p>B-trees are used where data is <b>big</b> and lives on a disk:</p><pre class="ex">file systems (NTFS), databases (indexes),\nsearch engines, operating systems,\nrouters, BitTorrent</pre><p>Reading from a disk is slow, so a short, wide tree that needs few reads is a big win.</p>' },
      16: { explain: '<p>This slide has no content: it only marks where the material for one semester (Fall 2024) stopped. The slides after it show how to <b>remove</b> elements from 2-3 trees, and 2-4 trees.</p><pre class="ex">next: removing (rotation, merge), 2-4 trees</pre>' },
      17: { text: false, blocks: [bul('Removing an element may convert a 3-node into a 2-node'), bul('Removing 51:')], explain: '<p>The easy case: 51 is in a leaf with two elements, [51 55].</p><pre class="ex">[51 55] → [55]   (a 3-node becomes a 2-node)</pre><p>The leaf still has one element, so the tree is still a valid 2-3 tree. Nothing else moves.</p>' },
      18: { text: false, blocks: [bul('Removing a 2-node leaf causes an underflow and requires a rotation'), bul('Removing 22:')], explain: '<p>Removing 22 empties its leaf: an <b>{{underflow|نقص}}</b>. Its sibling [35 40] has a spare element, so we <b>rotate</b>:</p><pre class="ex">30 comes down from the parent into the empty leaf\n35 goes up from the sibling to the parent</pre><p>Result: [35] with children [30] and [40]. The order is kept.</p>' },
      19: { text: false, blocks: [bul('Underflows may require multiple rotations'), bul('Removing 30:')], explain: '<p>Removing 30: its sibling [40] has no spare element, and neither does the parent [35]. The nearest leaf with a spare is [51 55], on the other side of the root.</p><pre class="ex">rotation 1: 45 comes down, 51 goes up (root)\nrotation 2: 35 comes down, 40 goes up</pre><p>Elements move one place along the sorted order until the empty leaf is filled.</p>' },
      20: { text: false, blocks: [bul('Removing 55:')], explain: '<p>Removing 55 empties a leaf whose sibling [75] has no spare. But the parent [60 82] has two elements, so it can give one:</p><pre class="ex">60 comes down and joins 75: [60 75]\nthe parent becomes [82]</pre><p>This is a <b>merge</b>: the empty leaf disappears and the parent has one child less.</p><p class="watch">The result picture shows 35 where the initial tree shows 30: a slip on the slide; that leaf does not change.</p>' },
      21: { text: false, blocks: [bul('Rotations may not solve everything – the height of the tree may have to be reduced'), bul('Removing 45:')], explain: '<p>Removing 45: every node here is a 2-node, so no rotation is possible.</p><pre class="ex">merge 40 into [35 40]  → its parent is empty\nmerge 51 into [51 82]  → the root is empty\nremove the empty root: one level less</pre><p>A 2-3 tree gets <b>shorter</b> at the top, just as it grows at the top.</p>' },
      22: { text: false, blocks: [bul('Removing internal nodes 30, then 60:')], explain: '<p>To remove an element of an <b>internal</b> node, replace it with its <b>in-order successor</b> (the smallest element of its right subtree), which is in a leaf:</p><pre class="ex">remove 30: 35 replaces it, leaf [35 40] → [40]\nremove 60: 75 replaces it, leaf [75] is empty (?)\n           rotation: 75 comes down, 55 goes up</pre><p>So every removal ends up as a removal from a leaf.</p>' },
      23: { blocks: [bul('A 2-4 tree is similar to a 2-3 tree, with nodes that can contain three elements'), bul('A 4-node has either four children or no children'), bul('The same ordering rules apply'), bul('Similar cases govern insertions and removals')], explain: '<p>A <b>2-4 tree</b> also allows a <b>4-node</b>: 3 elements and 4 children.</p><pre class="ex">2-node: 1 element, 3-node: 2, 4-node: 3</pre><p>Adding and removing follow the same ideas as in a 2-3 tree: split when a node is too full, rotate or merge when a leaf becomes empty.</p>' },
      24: { text: false, blocks: [bul('Insertions into a 2-4 tree:')], explain: '<p>Insertions: 3, 55, 14 fit in one node [3 14 55]. Adding 25 makes 4 elements: split, 25 goes up.</p><pre class="ex">[3 14 25 55] → 25 up, [3 14] and [55]\n[40 55 60 99] → 60 up\n[3 14 17 22] → 17 up</pre><p>With 4 elements, the <b>third</b> one moves up.</p>' },
      25: { text: false, blocks: [bul('Removals from a 2-4 tree:')], explain: '<p>Removals:</p><pre class="ex">3, 40: leaves keep an element\n17: the successor 22 replaces it; the empty leaf\n    merges: [14 22], parent [25 60]\n25: 55 replaces it; merge: [14 55], root [60]\n14, 99: [55 60] is the last node</pre><p>Same cases as a 2-3 tree; a parent with spare elements makes merging easy.</p>' }
    },
    exam: {
      questions: [
        { type: 'tf', q: 'A 2-3 tree gets taller only when the root splits.', answer: true, review: 9,
          why: 'A split moves an element up; only when the root itself splits is a new root made above it. So all leaves stay on one level.',
          lessons: ['14-multi-way-search-trees'], skills: ['concept'], available_after: '14-multi-way-search-trees', level: 1 },
        { q: 'Which B-tree variation keeps every element in a leaf and links the leaves, for fast sequential access?',
          options: ['B*-tree', 'B+-tree', '2-3 tree', 'AVL tree'], answer: 1, review: 13,
          why: 'Slides 13-14: in a B+-tree the inner nodes are signposts, and the linked leaves hold all the elements in order.',
          lessons: ['14-multi-way-search-trees'], skills: ['concept'], available_after: '14-multi-way-search-trees', level: 1 },
        { type: 'match', q: 'Match each kind of node with the number of elements it holds.', review: 23,
          pairs: [['2-node', '1 element'], ['3-node', '2 elements'], ['4-node', '3 elements']],
          why: 'The name counts the children of an inner node; it always holds one element less than that.',
          lessons: ['14-multi-way-search-trees'], skills: ['concept'], available_after: '14-multi-way-search-trees', level: 1 },
        { q: 'Tree E: root [40]; children [15] and [60 75]; leaves [5 10], [25] under [15]; [50], [65 70], [80] under [60 75]. A search for 68 runs. Which nodes does it visit?',
          options: ['[40], [60 75], [65 70], then not found', '[40], [60 75], [80]', '[40], [15], [25]', '[40], [60 75], [50]'], answer: 0, review: 5,
          why: '68 &gt; 40 → right; 60 &lt; 68 &lt; 75 → middle child; [65 70] is a leaf without 68: not found.',
          lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 2 },
        { q: '7 is added to tree E (root [40]; [15] → [5 10], [25]; [60 75] → [50], [65 70], [80]). What do [15] and its children look like afterwards?',
          options: ['[7 15] with [5], [10], [25]', '[15] with [5 7 10], [25]', '[10 15] with [5 7], [25]', '[7] with [5], [10 15 25]'], answer: 0, review: 7,
          why: 'The leaf becomes [5 7 10] and splits: 7, the middle element, moves up into [15], which has room.',
          lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 2 },
        { q: '25 is removed from tree E (root [40]; [15] → [5 10], [25]; [60 75] → [50], [65 70], [80]). What happens?',
          options: ['A rotation: 15 comes down, 10 goes up: [10] → [5], [15]', 'A merge: [5 10 15]', 'The tree gets shorter', 'Nothing: the leaf keeps an element'], answer: 0, review: 18,
          why: 'The leaf [25] becomes empty. Its sibling [5 10] has a spare element, so a rotation through the parent fills it.',
          lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 2 },
        { q: 'A B-tree of order 5 has a leaf [12 18 24 30]. 21 is added to it. Which element moves up?',
          options: ['21', '18', '24', '30'], answer: 0, review: 11,
          why: 'The leaf becomes [12 18 21 24 30]: 5 elements, one too many for order 5 (at most 4). The middle one, 21, moves up; [12 18] and [24 30] are the two halves.',
          lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 2 },
        { type: 'write', q: 'A 3-node holds the elements k1 &lt; k2. Write `static int childIndex(int k1, int k2, int x)` that returns which child a search for x (not equal to k1 or k2) goes to: 0 (left), 1 (middle) or 2 (right).', review: 5,
          rows: 6, starter: 'static int childIndex(int k1, int k2, int x) {\n  \n}',
          checks: [{ re: /if\s*\(\s*x\s*<\s*k1\s*\)\s*return\s+0\s*;/, label: 'Less than k1 → left child (0)' },
            { re: /x\s*<\s*k2[\s\S]*return\s+1\s*;/, label: 'Between k1 and k2 → middle child (1)' },
            { re: /return\s+2\s*;/, label: 'Greater than k2 → right child (2)' }],
          solution: 'static int childIndex(int k1, int k2, int x) {\n  if (x < k1) return 0;\n  if (x < k2) return 1;\n  return 2;\n}',
          why: 'The two elements cut the values into three ranges, one per child (slide 5). Once x &lt; k1 is false, x &lt; k2 is enough for the middle.',
          lessons: ['14-multi-way-search-trees'], skills: ['design'], available_after: '14-multi-way-search-trees', level: 2 },
        { q: '80 is removed from tree E (root [40]; [15] → [5 10], [25]; [60 75] → [50], [65 70], [80]). What does [60 75] become, with which leaves?',
          options: ['[60 70] with [50], [65], [75]', '[60] with [50], [65 70 75]', '[60 75] with [50], [65], [70]', '[65 75] with [50 60], [70]'], answer: 0, review: 18,
          why: 'The empty leaf\'s sibling [65 70] has a spare: 75 comes down from the parent into the empty leaf, and 70 goes up to replace it.',
          lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 2 },
        { q: '67 is added to tree E (root [40]; [15] → [5 10], [25]; [60 75] → [50], [65 70], [80]). What is the root afterwards?',
          options: ['[40 67]', '[67]', '[40]', '[40 60]'], answer: 0, review: 8,
          why: '[65 67 70] splits: 67 goes up, and [60 67 75] is too full, so it splits as well: 67 is again the middle element and goes up into the root [40], which has room.',
          lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 3 },
        { type: 'trace', q: 'From tree E (root [40]; [15] → [5 10], [25]; [60 75] → [50], [65 70], [80]), 50 is removed, then 65. Fill in the fix for each removal (rotation or merge) and what the root\'s right child [60 75] has become.', review: 22,
          cols: ['remove', 'fix', 'right child of the root'],
          rows: [['50', '?rotation', '?[65 75]|65 75|65,75|[65,75]'], ['65', '?merge', '?[75]|75']],
          why: 'Removing 50 empties a leaf whose right sibling [65 70] can lend: 60 comes down, 65 goes up. Now 65 is internal: its successor 70 replaces it, which empties the leaf [70]. Neither sibling can lend, so 70 comes down and merges with [60]: the node becomes [75].',
          lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 3 },
        { q: 'The root element 40 of tree E (root [40]; [15] → [5 10], [25]; [60 75] → [50], [65 70], [80]) is removed. What is the tree afterwards?',
          options: ['Root [50]; [15] → [5 10], [25]; [65 75] → [60], [70], [80]', 'Root [25]; [15] → [5 10]; [60 75] → …', 'Root [50]; [60 75] → [65 70], [80]', 'Root [60]; [15], [75]'], answer: 0, review: 22,
          why: 'The successor of 40 is 50 (right once, then left to a leaf). 50 moves up, and its leaf is empty. The sibling [65 70] can lend: 60 comes down, 65 goes up.',
          lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 3 },
        { q: '30, 10, 50, 20, 40, 60, 70, 80 are added to an empty <b>2-4</b> tree. What is the tree at the end?',
          options: ['Root [30 60]; leaves [10 20], [40 50], [70 80]', 'Root [40]; leaves [10 20 30], [50 60 70 80]', 'Root [20 50]; leaves [10], [30 40], [60 70 80]', 'Root [30]; leaves [10 20], [40 50 60 70 80]'], answer: 0, review: 24,
          why: '[10 20 30 50] splits: the third, 30, goes up. [40 50 60 70] splits: 60 goes up into [30 60]. 80 joins [70].',
          lessons: ['14-multi-way-search-trees'], skills: ['trace'], available_after: '14-multi-way-search-trees', level: 3 },
        { q: 'A 2-3 tree holds 30 elements. What is its smallest possible height?',
          options: ['1', '2', '3', '4'], answer: 2, review: 9,
          why: 'Height 2 holds at most 13 nodes × 2 = 26 elements (all 3-nodes). 30 elements need one more level: height 3.',
          lessons: ['14-multi-way-search-trees'], skills: ['trace', 'complexity'], available_after: '14-multi-way-search-trees', level: 3 },
        { q: 'The numbers 1, 2, 3, …, n are added in this order to a plain BST (unit 11) and to a 2-3 tree. How do their heights compare?',
          options: ['The BST becomes a list of height n − 1; the 2-3 tree stays about log n tall', 'Both have height n − 1', 'Both stay about log n tall', 'The 2-3 tree is taller'], answer: 0, review: 9,
          why: 'The BST puts every new number on the right of the last one (a degenerate tree). The 2-3 tree splits full leaves and grows only at the root, so it stays balanced whatever the order.',
          lessons: ['11-binary-search-trees', '14-multi-way-search-trees'], skills: ['complexity'], available_after: '14-multi-way-search-trees', level: 3 }
      ],
      tasks: [
        {
          title: 'Searching a 2-3 tree',
          task: '<p>A 2-3 tree node is stored as <code>class Node23 { int k1, k2; boolean three; Node23 left, middle, right; }</code>: <code>three</code> is true for a 3-node (elements k1 &lt; k2, children left, middle, right); a 2-node uses only k1, left and right. A leaf has null children. Write a <b>recursive</b> <code>static boolean contains(Node23 n, int x)</code>: return false for null; true if x is one of the node\'s elements; otherwise search the right child (slide 5).</p>',
          starter: 'static boolean contains(Node23 n, int x) {\n  \n}',
          checks: [
            { re: /if\s*\(\s*n\s*==\s*null\s*\)\s*return\s+false\s*;/, label: 'An empty subtree does not contain x', review: 7 },
            { re: /x\s*==\s*n\.k1/, label: 'Checks the first element', review: 5 },
            { re: /n\.three\s*&&\s*x\s*==\s*n\.k2|x\s*==\s*n\.k2\s*&&\s*n\.three/, label: 'Checks the second element only in a 3-node', review: 4 },
            { re: /x\s*<\s*n\.k1[\s\S]*return\s+contains\s*\(\s*n\.left\s*,\s*x\s*\)\s*;/, label: 'Smaller than k1 → left child', review: 5 },
            { re: /x\s*<\s*n\.k2[\s\S]*return\s+contains\s*\(\s*n\.middle\s*,\s*x\s*\)\s*;/, label: 'Between k1 and k2 → middle child', review: 5 },
            { re: /return\s+contains\s*\(\s*n\.right\s*,\s*x\s*\)\s*;/, label: 'Otherwise → right child', review: 5 }
          ],
          solution: 'static boolean contains(Node23 n, int x) {\n  if (n == null) return false;\n  if (x == n.k1 || (n.three && x == n.k2)) return true;\n  if (x < n.k1) return contains(n.left, x);\n  if (n.three && x < n.k2) return contains(n.middle, x);\n  return contains(n.right, x);\n}'
        },
        {
          title: 'Counting the elements',
          task: '<p>With the same <code>Node23</code> class, write a <b>recursive</b> <code>static int countElements(Node23 n)</code> that returns how many elements the tree holds: 0 for null; otherwise 1 for a 2-node or 2 for a 3-node, plus the counts of all its children (the middle child only in a 3-node).</p>',
          starter: 'static int countElements(Node23 n) {\n  \n}',
          checks: [
            { re: /if\s*\(\s*n\s*==\s*null\s*\)\s*return\s+0\s*;/, label: 'An empty tree has 0 elements', review: 4 },
            { re: /n\.three\s*\?\s*2\s*:\s*1|if\s*\(\s*n\.three\s*\)[\s\S]*2/, label: '2 elements for a 3-node, else 1', review: 4 },
            { re: /countElements\s*\(\s*n\.left\s*\)/, label: 'Counts the left child', review: 5 },
            { re: /countElements\s*\(\s*n\.middle\s*\)/, label: 'Counts the middle child', review: 5 },
            { re: /countElements\s*\(\s*n\.right\s*\)/, label: 'Counts the right child', review: 5 },
            { fn: function (c) { return !/\b(for|while)\b/.test(c); }, label: 'No loop', review: 4 }
          ],
          solution: 'static int countElements(Node23 n) {\n  if (n == null) return 0;\n  int c = (n.three ? 2 : 1) + countElements(n.left) + countElements(n.right);\n  if (n.three) c += countElements(n.middle);\n  return c;\n}'
        }
      ]
    }
  });
})();
