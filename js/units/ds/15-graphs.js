/* Data Structures · Unit 15 Graphs (46 slides): vertices and edges, undirected / directed / weighted graphs, paths,
   connectivity, cycles, adjacency lists and matrices, the matrix Graph<T> class (addVertex, addEdge,
   expandCapacity), breadth-first and depth-first traversal in Java, connectivity by BFS, spanning trees, the minimum
   spanning tree with a minheap of edges, and shortest paths (fewest edges, cheapest) */
(function () {
  function L(src, frag, nth) { var ls = src.split('\n'), c = 0; for (var i = 0; i < ls.length; i++) if (ls[i].indexOf(frag) >= 0 && ++c === (nth || 1)) return i + 1; throw new Error('no line ' + frag); }

  /* ---------- graphs: "A-B" undirected edge, "A>B" directed edge, ":120" a weight, "D" a lonely vertex ---------- */
  function parseG(s) {
    var V = [], E = [], dir = false, has = {};
    var addV = function (v) { if (!has[v] && V.length < 10) { has[v] = 1; V.push(v); } return has[v]; };
    String(s).split(/[,;]+/).forEach(function (part) {
      var m = part.trim().match(/^([A-Za-z0-9_]{1,10})\s*(?:(-|>)\s*([A-Za-z0-9_]{1,10}))?\s*(?::\s*(\d{1,4}))?$/);
      if (!m) return;
      if (!addV(m[1])) return;
      if (m[3] && addV(m[3]) && E.length < 20) { if (m[2] === '>') dir = true; E.push({ a: m[1], b: m[3], d: m[2] === '>', w: m[4] != null ? +m[4] : null }); }
    });
    if (!V.length) { V = ['A']; }
    return { V: V, E: E, dir: dir, wt: E.some(function (e) { return e.w != null; }) };
  }
  /* neighbours of v in vertex (index) order; for an undirected edge both ways */
  function nbrs(g, v) { var o = {}; g.E.forEach(function (e) { if (e.a === v) o[e.b] = e.w; if (e.b === v && !e.d) o[e.a] = e.w; }); return g.V.filter(function (x) { return x in o; }).map(function (x) { return { v: x, w: o[x] }; }); }
  function edgeKey(e) { return e.d ? e.a + '>' + e.b : [e.a, e.b].sort().join('-'); }
  function keyOf(a, b, g) { var e = g.E.filter(function (x) { return (x.a === a && x.b === b) || (!x.d && x.a === b && x.b === a); })[0]; return e ? edgeKey(e) : a + '-' + b; }
  function bfsOrder(g, s) { var seen = {}, q = [s], o = []; seen[s] = 1; while (q.length) { var x = q.shift(); o.push(x); nbrs(g, x).forEach(function (n) { if (!seen[n.v]) { seen[n.v] = 1; q.push(n.v); } }); } return o; }
  function bfsPath(g, a, b) { var prev = {}, q = [a], seen = {}; seen[a] = 1; while (q.length) { var x = q.shift(); if (x === b) break; nbrs(g, x).forEach(function (n) { if (!seen[n.v]) { seen[n.v] = 1; prev[n.v] = x; q.push(n.v); } }); } if (!seen[b]) return null; var p = [b]; while (p[0] !== a) p.unshift(prev[p[0]]); return p; }

  var LAY = [
    { A: [80, 70], B: [260, 70], C: [260, 240], D: [80, 240] },
    { A: [70, 70], B: [180, 70], E: [270, 150], C: [70, 230], D: [180, 230] },
    { Boston: [330, 50], NewYork: [330, 180], Phila: [80, 200], Roanoke: [210, 295] },
    { 1: [70, 70], 2: [180, 70], 3: [290, 70], 6: [70, 220], 5: [180, 220], 4: [290, 220] },
    { 2: [116, 85], 1: [262, 52], 4: [227, 128], 5: [54, 161], 3: [334, 258] },
    { 1: [255, 50], 2: [105, 78], 3: [327, 116], 4: [219, 118], 5: [43, 152], 6: [318, 238], 7: [206, 190], 8: [75, 214], 9: [207, 282] }
  ];
  function place(g) {
    for (var i = 0; i < LAY.length; i++) { var l = LAY[i], ks = Object.keys(l); if (ks.length >= g.V.length && g.V.every(function (v) { return l[v]; }) && (ks.length === g.V.length || i < 2)) return l; }
    var o = {}, n = g.V.length; g.V.forEach(function (v, i) { var a = -Math.PI / 2 + 2 * Math.PI * i / n; o[v] = [180 + 130 * Math.cos(a), 165 + 125 * Math.sin(a)]; });
    return o;
  }
  /* o: vt {v: tone}, et {key: tone}, dx, dy (shift), hideE {key}, only {key: true} (draw only these edges), lbl {v: text under} */
  function drawG(g, o) {
    o = o || {}; var P = place(g), out = [], r = 17, dx = o.dx || 0, dy = o.dy || 0, keys = {};
    g.E.forEach(function (e) { keys[edgeKey(e)] = 1; });
    g.E.forEach(function (e) {
      var k = edgeKey(e); if (o.only && !o.only[k]) return; if (o.hideE && o.hideE[k]) return;
      var p = P[e.a], q = P[e.b]; if (!p || !q || e.a === e.b) return;
      var x1 = p[0] + dx, y1 = p[1] + dy, x2 = q[0] + dx, y2 = q[1] + dy, L0 = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L0, uy = (y2 - y1) / L0;
      var both = e.d && keys[e.b + '>' + e.a];
      var hw = function (v) { return Math.max(34, v.length * 8 + 14) / 2; }, cut = function (v) { return 1 / Math.sqrt(Math.pow(ux / hw(v), 2) + Math.pow(uy / r, 2)); }, c1 = cut(e.a), c2 = cut(e.b) + (e.d ? 2 : 0);
      out.push(A('g' + k.replace('>', 'to'), x1 + ux * c1, y1 + uy * c1, x2 - ux * c2, y2 - uy * c2, { head: e.d, tone: (o.et && o.et[k]) || 'muted', bend: both ? (e.w != null ? 34 : 14) : 0, label: e.w != null ? String(e.w) : undefined }));
    });
    g.E.forEach(function (e) { if (e.a === e.b && P[e.a]) out.push(T('self' + e.a, P[e.a][0] + dx, P[e.a][1] + dy - r - 6, '↻', { anchor: 'middle', size: 14, bold: true, tone: 'red' })); });
    g.V.forEach(function (v) {
      var p = P[v], tn = (o.vt && o.vt[v]) || 'blue', w = Math.max(34, v.length * 8 + 14);
      out.push(B('v' + v, p[0] + dx - w / 2, p[1] + dy - r, w, 2 * r, { title: v, mono: true, size: 12, shape: 'oval', tone: tn, fill: tn === 'accent' ? 'solid' : 'soft', hi: tn === 'accent' }));
      if (o.lbl && o.lbl[v] != null) out.push(T('lb' + v, p[0] + dx, p[1] + dy + r + 13, String(o.lbl[v]), { anchor: 'middle', mono: true, size: 11, bold: true, tone: 'teal' }));
    });
    return out;
  }
  function panel(id, x, y, label, items, tone) { return [T(id + 'l', x, y, label, { mono: true, size: 12, bold: true, tone: 'muted' }), T(id + 'v', x, y + 20, items, { mono: true, size: 14, bold: true, tone: tone || 'accent' })]; }

  /* ---------- 1. terms of undirected graphs (slides 3-8) ---------- */
  var TC = 'graph = vertices + edges; an edge (A, B) joins two vertices\nundirected: (A, B) and (B, A) are the same edge\nadjacent (neighbours): an edge joins them\nself-loop (sling): an edge from a vertex to itself\ncomplete: an edge between every pair: n(n-1)/2 edges\npath: edges that lead from one vertex to another\n  length = the number of edges on the path\nconnected: a path between ANY two vertices\ncycle: a path back to its first vertex, no edge repeated\nacyclic: no cycles at all (a tree is acyclic)';
  var G4 = 'A-B, A-C, B-C, B-D, C-D';
  var terms = {
    id: 'terms', slides: [3, 8], title: 'Vertices, edges, paths, cycles', lang: 'text', vb: [600, 340],
    code: TC,
    inputs: [{ id: 'g', type: 'text', label: 'edges', value: G4, minlen: 1, maxlen: 90 }, { id: 'x', type: 'text', label: 'from', value: 'A', minlen: 1, maxlen: 10 }, { id: 'y', type: 'text', label: 'to', value: 'D', minlen: 1, maxlen: 10 }],
    inputsLabel: 'Edges like <code>A-B</code>; a lonely vertex is just its name (<code>D</code>); <code>A-A</code> is a self-loop.',
    presets: [{ label: 'slide 4', values: { g: G4, x: 'A', y: 'D' } }, { label: 'slide 7: not connected', values: { g: 'A-B, A-C, B-C, D', x: 'A', y: 'D' } }, { label: 'complete: 4 vertices', values: { g: 'A-B, A-C, A-D, B-C, B-D, C-D', x: 'A', y: 'C' } }, { label: 'a tree: no cycle', values: { g: 'A-B, A-C, C-D, C-E', x: 'B', y: 'E' } }, { label: 'with a self-loop', values: { g: 'A-B, B-C, C-C', x: 'A', y: 'C' } }],
    steps: function (v) {
      var g = parseG(v.g), st = [], x = String(v.x).trim(), y = String(v.y).trim(), n = g.V.length;
      var real = g.E.filter(function (e) { return e.a !== e.b; }), loops = g.E.filter(function (e) { return e.a === e.b; });
      var snap = function (o) { o.g = g; st.push(o); return o; };
      snap({ slide: 3, line: 1, cap: '<b>' + n + ' vertices</b> (' + g.V.join(', ') + ') and <b>' + g.E.length + ' edges</b>: ' + g.E.map(function (e) { return '(' + e.a + ', ' + e.b + ')'; }).join(' ') + '. A graph is like a tree, but any vertex may connect to any other.' });
      snap({ slide: 4, line: 2, cap: 'The edges have no arrows: the graph is <b>undirected</b>. The edge (A, B) can be used both ways, from A to B and from B to A.' });
      if (g.V.indexOf(x) < 0) { snap({ slide: 5, line: 3, cap: '"' + x + '" is not a vertex of this graph. Use one of: ' + g.V.join(', ') + '.' }); return st; }
      var nb = nbrs(g, x).map(function (q) { return q.v; }), vt = {}; vt[x] = 'accent'; nb.forEach(function (q) { if (q !== x) vt[q] = 'teal'; });
      snap({ slide: 5, line: 3, vt: vt, cap: x + ' is <b>adjacent</b> to ' + (nb.filter(function (q) { return q !== x; }).join(', ') || 'no vertex') + ': these are its neighbours.' + (loops.length ? ' ' + loops.map(function (e) { return e.a; }).join(', ') + ' has a <b>self-loop</b> (an edge to itself).' : '') });
      var maxE = n * (n - 1) / 2;
      snap({ slide: 5, line: 5, cap: n + ' vertices can have at most ' + n + '·' + (n - 1) + '/2 = <b>' + maxE + '</b> edges. This graph has ' + real.length + (real.length === maxE ? ': it is <b>complete</b>.' : ', so it is not complete.') });
      var p = g.V.indexOf(y) >= 0 ? bfsPath(g, x, y) : null, et = {}, vt2 = {};
      if (p) { p.forEach(function (q) { vt2[q] = 'accent'; }); for (var i = 1; i < p.length; i++) et[keyOf(p[i - 1], p[i], g)] = 'accent'; }
      snap({ slide: 6, line: '6-7', vt: vt2, et: et, cap: p ? 'A <b>path</b> from ' + x + ' to ' + y + ': ' + p.join(' → ') + '. Its length is <b>' + (p.length - 1) + '</b> edge' + (p.length === 2 ? '' : 's') + ' (' + p.length + ' vertices − 1). This one is the shortest.' : 'There is <b>no path</b> from ' + x + ' to ' + (g.V.indexOf(y) >= 0 ? y : '"' + y + '"') + '.' });
      var comp = bfsOrder(g, g.V[0]), conn = comp.length === n, vt3 = {}; comp.forEach(function (q) { vt3[q] = 'teal'; }); g.V.forEach(function (q) { if (!vt3[q]) vt3[q] = 'red'; });
      snap({ slide: conn ? 6 : 7, line: 8, vt: vt3, cap: conn ? 'From ' + g.V[0] + ' every vertex can be reached, so there is a path between any two: the graph is <b>connected</b>.' : 'From ' + g.V[0] + ' only ' + comp.join(', ') + ' can be reached (green). ' + g.V.filter(function (q) { return comp.indexOf(q) < 0; }).join(', ') + ' cannot: the graph is <b>not connected</b>.' });
      /* find a cycle with a DFS that remembers the edge it came by */
      var cyc = null, vis = {}, par = {};
      var dfs = function (u, from) { vis[u] = 1; var ns = nbrs(g, u); for (var i = 0; i < ns.length && !cyc; i++) { var w = ns[i].v; if (w === u) { cyc = [u, u]; return; } if (w === from) continue; if (vis[w]) { var c = [w], t = u; while (t !== w && t != null) { c.unshift(t); t = par[t]; } c.unshift(w); cyc = c.reverse(); return; } par[w] = u; dfs(w, u); } };
      g.V.forEach(function (q) { if (!vis[q] && !cyc) dfs(q, null); });
      var et4 = {}, vt4 = {}; if (cyc) { cyc.forEach(function (q) { vt4[q] = 'accent'; }); for (var j = 1; j < cyc.length; j++) et4[keyOf(cyc[j - 1], cyc[j], g)] = 'accent'; }
      snap({ slide: 8, line: cyc ? 9 : 10, vt: vt4, et: et4, cap: cyc ? (cyc[0] === cyc[1] && cyc.length === 2 ? 'The self-loop at ' + cyc[0] + ' is already a <b>cycle</b> of one edge.' : 'A <b>cycle</b>: ' + cyc.join(' → ') + ': it ends where it started and uses no edge twice.') : 'No cycle anywhere: the graph is <b>acyclic</b>.' + (conn ? ' Connected and acyclic: it is a tree.' : '') });
      return st;
    },
    draw: function (k, s) { return drawG(s.g, { vt: s.vt, et: s.et }); }
  };

  /* ---------- 2. directed and weighted graphs (slides 9-15) ---------- */
  var DC = 'directed graph (digraph): an edge (A, B) is ordered: A → B\n(A, B) and (B, A) are two different edges\npath: follow the arrows only\nconnected: a path from every vertex to every other vertex\nno cycles → line up the vertices so every edge goes forward\nweighted graph (network): every edge has a weight (cost)\nan edge is a triple: (Boston, New York, 120)\nweight of a path = the sum of the weights on it';
  var CITY = 'Boston-NewYork:120, Boston-Phila:219, Phila-NewYork:225, NewYork-Roanoke:320';
  var CITYD = 'Phila>Boston:219, Boston>Phila:199, NewYork>Boston:140, Boston>NewYork:120, Phila>NewYork:205, NewYork>Phila:225, Roanoke>NewYork:240, NewYork>Roanoke:320';
  function reach(g, s) { return bfsOrder(g, s); }
  function cheapest(g, a, b) {
    var best = null, cost = 0, path = [a], seen = {}; seen[a] = 1;
    var go = function (u) { if (u === b) { if (!best || cost < best.c) best = { p: path.slice(), c: cost }; return; } nbrs(g, u).forEach(function (n) { if (seen[n.v]) return; seen[n.v] = 1; path.push(n.v); cost += n.w || 0; go(n.v); cost -= n.w || 0; path.pop(); seen[n.v] = 0; }); };
    go(a); return best;
  }
  var digraph = {
    id: 'digraph', slides: [9, 15], title: 'Directed graphs and weighted graphs', lang: 'text', vb: [600, 340],
    code: DC,
    inputs: [{ id: 'g', type: 'text', label: 'edges', value: 'A>B, A>D, B>C, B>D, D>C', minlen: 1, maxlen: 200 }, { id: 'x', type: 'text', label: 'from', value: 'A', minlen: 1, maxlen: 10 }, { id: 'y', type: 'text', label: 'to', value: 'C', minlen: 1, maxlen: 10 }],
    inputsLabel: '<code>A>B</code> is an arrow from A to B, <code>A-B</code> goes both ways, <code>:120</code> is a weight.',
    presets: [{ label: 'slide 10', values: { g: 'A>B, A>D, B>C, B>D, D>C', x: 'A', y: 'C' } }, { label: 'slide 12: connected', values: { g: '1>2, 2>3, 3>4, 4>5, 5>6, 6>1', x: '4', y: '2' } }, { label: 'slide 12: unconnected', values: { g: '1>2, 2>3, 3>4, 4>5, 5>6, 1>6', x: '4', y: '2' } }, { label: 'slide 14: flights', values: { g: CITY, x: 'Phila', y: 'Roanoke' } }, { label: 'slide 15: costs by direction', values: { g: CITYD, x: 'Roanoke', y: 'Phila' } }],
    steps: function (v) {
      var g = parseG(v.g), st = [], x = String(v.x).trim(), y = String(v.y).trim();
      var snap = function (o) { o.g = g; st.push(o); return o; };
      snap({ slide: g.wt ? 13 : 9, line: g.dir ? 1 : 6, cap: g.dir ? 'Each edge is an <b>ordered pair</b>: ' + g.E.map(function (e) { return '(' + e.a + ', ' + e.b + ')'; }).join(' ') + '. The arrow shows the only way it may be used.' : 'This graph has no arrows: each edge goes both ways.' + (g.wt ? ' Each edge has a <b>weight</b>: here the price of a flight.' : '') });
      if (g.dir) {
        var pairs = g.E.filter(function (e) { return e.d && g.E.some(function (f) { return f.d && f.a === e.b && f.b === e.a; }); });
        snap({ slide: 9, line: 2, cap: pairs.length ? 'Some pairs have <b>two</b> edges, one each way, like (' + pairs[0].a + ', ' + pairs[0].b + ') and (' + pairs[0].b + ', ' + pairs[0].a + ')' + (g.wt ? ', with different costs.' : '.') : '(A, B) and (B, A) would be two separate edges; here every edge has only one direction.' });
      }
      if (g.V.indexOf(x) < 0 || g.V.indexOf(y) < 0) { snap({ slide: 11, line: 3, cap: 'Choose "from" and "to" among: ' + g.V.join(', ') + '.' }); return st; }
      var p = g.wt ? (cheapest(g, x, y) || null) : null, bp = bfsPath(g, x, y), path = p ? p.p : bp, et = {}, vt = {};
      if (path) { path.forEach(function (q) { vt[q] = 'accent'; }); for (var i = 1; i < path.length; i++) et[keyOf(path[i - 1], path[i], g)] = 'accent'; }
      snap({ slide: g.wt ? 13 : 11, line: g.wt ? 8 : 3, vt: vt, et: et, cap: path ? (g.dir ? 'Following the arrows: ' : 'A path: ') + path.join(' → ') + '.' + (p ? ' Its weight: ' + path.slice(1).map(function (q, i) { return nbrs(g, path[i]).filter(function (n) { return n.v === q; })[0].w; }).join(' + ') + ' = <b>' + p.c + '</b>, the cheapest way.' : ' Length ' + (path.length - 1) + '.') : 'There is <b>no path</b> from ' + x + ' to ' + y + (g.dir ? ': the arrows do not lead there.' : '.') });
      var bad = null; g.V.forEach(function (s) { if (!bad) { var r = reach(g, s); if (r.length < g.V.length) bad = { s: s, r: r }; } });
      var vt2 = {}; if (bad) { bad.r.forEach(function (q) { vt2[q] = 'teal'; }); g.V.forEach(function (q) { if (!vt2[q]) vt2[q] = 'red'; }); vt2[bad.s] = 'accent'; }
      snap({ slide: 12, line: 4, vt: vt2, cap: bad ? 'Not connected: from ' + bad.s + ' you can reach only ' + bad.r.join(', ') + '; ' + g.V.filter(function (q) { return bad.r.indexOf(q) < 0; }).join(', ') + ' cannot be reached (red).' : 'From <b>every</b> vertex you can reach every other one: the graph is connected.' });
      if (g.dir) {
        var indeg = {}, order = [], rest = g.V.slice(); g.V.forEach(function (q) { indeg[q] = 0; }); g.E.forEach(function (e) { indeg[e.b]++; if (!e.d) indeg[e.a]++; });
        while (rest.length) { var nx = rest.filter(function (q) { return indeg[q] === 0; })[0]; if (nx == null) break; order.push(nx); rest.splice(rest.indexOf(nx), 1); g.E.forEach(function (e) { if (e.a === nx && e.d) indeg[e.b]--; }); }
        var lb = {}; order.forEach(function (q, i) { lb[q] = '#' + (i + 1); });
        snap({ slide: 11, line: 5, lbl: rest.length ? null : lb, cap: rest.length ? 'The graph has a <b>cycle</b>, so the vertices cannot be lined up with every edge going forward (' + rest.join(', ') + ' are on a cycle or after one).' : 'No cycles, so the vertices can be lined up: <b>' + order.join(', ') + '</b>. Every arrow goes from an earlier vertex to a later one.' });
      }
      if (g.wt) snap({ slide: g.dir ? 15 : 14, line: '6-7', cap: 'Each weighted edge is a triple, for example (' + g.E[0].a + ', ' + g.E[0].b + ', ' + g.E[0].w + ').' + (g.dir ? ' With arrows, the two directions can cost different amounts.' : '') });
      return st;
    },
    draw: function (k, s) { return drawG(s.g, { vt: s.vt, et: s.et, lbl: s.lbl }); }
  };

  /* ---------- 3. adjacency list and adjacency matrix (slides 16-19) ---------- */
  var AJ = 'adjacency list: each vertex keeps a linked list of its neighbours\n  (for a weighted graph each entry also keeps the weight)\nadjacency matrix: a 2D array of booleans\n  matrix[i][j] = true if there is an edge from vertex i to vertex j\nundirected graph: the matrix is symmetric (both [i][j] and [j][i])\nis there an edge i → j?   matrix: O(1)   list: walk the list of i\nspace:                    matrix: n × n  list: n + edges';
  var G17 = 'A-B, A-C, A-D, B-E, C-D, D-E';
  var adj = {
    id: 'adj', slides: [16, 19], title: 'Adjacency list and adjacency matrix', lang: 'text', vb: [600, 340],
    code: AJ,
    inputs: [{ id: 'g', type: 'text', label: 'edges', value: G17, minlen: 1, maxlen: 90 }],
    presets: [{ label: 'slide 17', values: { g: G17 } }, { label: 'slide 18', values: { g: G4 } }, { label: 'slide 19: directed', values: { g: 'A>B, A>C, B>C, B>D' } }, { label: 'few edges, many vertices', values: { g: 'A-B, C-D, E, F, G' } }],
    steps: function (v) {
      var g = parseG(v.g), st = [], n = g.V.length, rows = [];
      var snap = function (o) { o.g = g; o.rows = rows.slice(); st.push(o); return o; };
      snap({ slide: 16, line: '1,3', cap: 'Two ways to store a graph in memory. The drawing shows the graph, its adjacency lists, and its matrix (T = edge, F = no edge).' });
      g.V.forEach(function (x, i) {
        rows.push(x); var nb = nbrs(g, x).map(function (q) { return q.v; });
        snap({ slide: g.dir ? 19 : i < 2 ? 17 : 18, line: '1,4', at: x, cap: x + ': list → ' + (nb.join(' → ') || 'empty') + '. Row ' + x + ' of the matrix has T in column' + (nb.length === 1 ? ' ' : 's ') + (nb.join(', ') || '(none)') + '.' });
      });
      snap({ slide: g.dir ? 19 : 18, line: 5, cap: g.dir ? 'Directed: an edge A → B puts T only in row A, column B. The matrix is <b>not</b> symmetric.' : 'Undirected: every edge appears twice, at [A][B] and at [B][A]. The matrix is <b>symmetric</b> across its diagonal.' });
      var cells = n * n, entries = g.E.reduce(function (a, e) { return a + (e.d ? 1 : 2); }, 0);
      snap({ slide: 18, line: '6-7', cap: 'Space: the matrix always has n × n = <b>' + cells + '</b> cells; the lists have n heads + ' + entries + ' entries = <b>' + (n + entries) + '</b>. With few edges the lists are smaller; asking "is there an edge?" is fastest with the matrix.' });
      return st;
    },
    draw: function (k, s) {
      var g = s.g, n = g.V.length, out = drawG(g, { vt: s.at ? (function () { var o = {}; o[s.at] = 'accent'; return o; })() : null }).map(function (it) { var c = Object.assign({}, it); if ('x1' in c) { c.x1 = c.x1 * 0.62 + 4; c.x2 = c.x2 * 0.62 + 4; c.y1 = c.y1 * 0.62 + 6; c.y2 = c.y2 * 0.62 + 6; } else { c.x = c.x * 0.62 + 4; c.y = c.y * 0.62 + 6; } return c; });
      out.forEach(function (c) { if (c.k === 'box') { c.w *= 0.8; c.h *= 0.8; c.size = 10; } });
      var cw = Math.min(26, Math.floor(200 / n));
      s.rows.forEach(function (x, i) {
        var y = 30 + i * 26, nb = nbrs(g, x).map(function (q) { return q.v; });
        out.push(B('lh' + x, 236, y, 30, 22, { title: x, mono: true, size: 10, tone: s.at === x ? 'accent' : 'blue', fill: s.at === x ? 'solid' : 'soft' }));
        nb.slice(0, 4).forEach(function (q, j) { out.push(B('le' + x + q, 276 + j * 34, y, 28, 22, { title: q, mono: true, size: 10, tone: 'teal' })); out.push(A('la' + x + q, 266 + j * 34 + (j ? 4 : 0), y + 11, 276 + j * 34, y + 11, { tone: 'muted' })); });
        g.V.forEach(function (c, j) { var on = nb.indexOf(c) >= 0; out.push(B('m' + i + '_' + j, 400 + j * cw, 30 + i * 26, cw - 2, 22, { title: on ? 'T' : 'F', mono: true, size: 10, tone: on ? 'accent' : 'muted', fill: on ? 'solid' : 'soft', o: on ? 1 : 0.6 })); });
      });
      g.V.forEach(function (c, j) { out.push(T('mh' + j, 400 + j * cw + cw / 2 - 1, 22, c.slice(0, 3), { anchor: 'middle', mono: true, size: 10, bold: true, tone: 'muted' })); });
      out.push(T('lt', 236, 30 + n * 26 + 16, 'lists', { mono: true, size: 11, bold: true, tone: 'muted' })); out.push(T('mt', 400, 30 + n * 26 + 16, 'matrix (row → column)', { mono: true, size: 11, bold: true, tone: 'muted' }));
      return out;
    }
  };

  /* ---------- 4. the Graph<T> class with an adjacency matrix (slides 20-27) ---------- */
  var GC = 'public class Graph<T> implements GraphADT<T> {\n  protected final int DEFAULT_CAPACITY = 5;\n  protected int numVertices;          // number of vertices in the graph\n  protected boolean[][] adjMatrix;    // adjacency matrix\n  protected T[] vertices;             // values of vertices\n  protected int modCount;\n  public Graph() {\n    numVertices = 0;\n    this.adjMatrix = new boolean[DEFAULT_CAPACITY][DEFAULT_CAPACITY];\n    this.vertices = (T[])(new Object[DEFAULT_CAPACITY]);\n  }\n  public void addEdge(T vertex1, T vertex2) {\n    addEdge(getIndex(vertex1), getIndex(vertex2));\n  }\n  public void addEdge(int index1, int index2) {\n    if (indexIsValid(index1) && indexIsValid(index2)) {\n      adjMatrix[index1][index2] = true;\n      adjMatrix[index2][index1] = true;\n      modCount++;\n    }\n  }\n  public void addVertex(T vertex) {\n    if ((numVertices + 1) == adjMatrix.length)\n      expandCapacity();\n    vertices[numVertices] = vertex;\n    for (int i = 0; i < numVertices; i++) {\n      adjMatrix[numVertices][i] = false;\n      adjMatrix[i][numVertices] = false;\n    }\n    numVertices++;\n    modCount++;\n  }\n  protected void expandCapacity() {\n    T[] largerVertices = (T[])(new Object[vertices.length*2]);\n    boolean[][] largerAdjMatrix =\n      new boolean[vertices.length*2][vertices.length*2];\n    for (int i = 0; i < numVertices; i++) {\n      for (int j = 0; j < numVertices; j++) {\n        largerAdjMatrix[i][j] = adjMatrix[i][j];\n      }\n      largerVertices[i] = vertices[i];\n    }\n    vertices = largerVertices;\n    adjMatrix = largerAdjMatrix;\n  }\n}\n// ---- main ----\nGraph<String> g = new Graph<String>();';
  function gOps(s) { var out = []; String(s).split(/[,;]+/).forEach(function (p) { var w = p.trim().split(/\s+/); if (/^(addvertex|vertex|v)$/i.test(w[0]) && /^\w{1,6}$/.test(w[1] || '')) out.push({ op: 'v', a: w[1] }); else if (/^(addedge|edge|e)$/i.test(w[0]) && /^\w{1,6}$/.test(w[1] || '') && /^\w{1,6}$/.test(w[2] || '')) out.push({ op: 'e', a: w[1], b: w[2] }); }); return out.slice(0, 14); }
  function gcCode(v) { return GC + '\n' + gOps(v.ops).map(function (o) { return o.op === 'v' ? 'g.addVertex("' + o.a + '");' : 'g.addEdge("' + o.a + '", "' + o.b + '");'; }).join('\n'); }
  var graphcode = {
    id: 'graphcode', slides: [20, 27], title: 'Graph<T>: a vertices array and a boolean matrix', vb: [600, 340],
    code: gcCode,
    inputs: [{ id: 'ops', type: 'text', label: 'operations', value: 'addVertex A, addVertex B, addVertex C, addEdge A B, addEdge B C', minlen: 0, maxlen: 160 }],
    inputsLabel: '<code>addVertex A</code>, <code>addEdge A B</code> (up to 9 vertices).',
    presets: [{ label: 'three vertices, two edges', values: { ops: 'addVertex A, addVertex B, addVertex C, addEdge A B, addEdge B C' } }, { label: 'the 5th vertex: expandCapacity', values: { ops: 'addVertex A, addVertex B, addVertex C, addVertex D, addVertex E, addEdge A E' } }, { label: 'an edge to a missing vertex', values: { ops: 'addVertex A, addVertex B, addEdge A Z, addEdge A B' } }],
    steps: function (v) {
      var code = gcCode(v), ops = gOps(v.ops), st = [], cap = 5, n = 0, verts = [], M = [], mod = 0, ms = L(code, '// ---- main ----');
      var AE1 = L(code, 'public void addEdge(T vertex1'), AE2 = L(code, 'public void addEdge(int index1'), AV = L(code, 'public void addVertex'), EX = L(code, 'protected void expandCapacity');
      var mk = function (c) { var m = []; for (var i = 0; i < c; i++) { m.push([]); for (var j = 0; j < c; j++) m[i].push(false); } return m; };
      M = mk(cap);
      var snap = function (o) { o.cp = cap; o.n = n; o.verts = verts.slice(); o.M = M.map(function (r) { return r.slice(); }); o.mod = mod; st.push(o); return o; };
      snap({ slide: 24, line: (ms + 1) + ',' + L(code, 'public Graph()') + '-' + (L(code, 'public Graph()') + 3), cap: 'new Graph(): numVertices = 0, a 5 × 5 boolean matrix (all false) and an array for 5 vertices. Java fills new boolean arrays with false.' });
      var nv = 0;
      ops.forEach(function (o, oi) {
        var ml = ms + 2 + oi;
        if (o.op === 'v') {
          if (verts.length >= 9) { snap({ slide: 26, line: ml, cap: 'This drawing stops at 9 vertices.' }); return; }
          if (n + 1 === M.length) {
            snap({ slide: 26, line: ml + ',' + (AV + 1) + '-' + (AV + 2), cap: 'addVertex("' + o.a + '"): numVertices + 1 = ' + (n + 1) + ' == adjMatrix.length (' + M.length + '), so first <b>expandCapacity()</b>.' });
            var big = mk(cap * 2); for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) big[i][j] = M[i][j]; M = big; cap *= 2;
            snap({ slide: 27, line: EX + '-' + (EX + 12), cap: 'expandCapacity(): new arrays twice as big (' + cap + ' × ' + cap + '), and the old values are copied over.' });
          }
          verts[n] = o.a; for (var k2 = 0; k2 < n; k2++) { M[n][k2] = false; M[k2][n] = false; } n++; mod++;
          snap({ slide: 26, line: ml + ',' + (AV + 3) + '-' + (AV + 9), at: n - 1, cap: 'addVertex("' + o.a + '"): vertices[' + (n - 1) + '] = "' + o.a + '", its row and column are set to false, numVertices = ' + n + '.' });
        } else {
          var i1 = verts.indexOf(o.a), i2 = verts.indexOf(o.b), ok = i1 >= 0 && i2 >= 0;
          if (ok) { M[i1][i2] = true; M[i2][i1] = true; mod++; }
          snap({ slide: 25, line: ml + ',' + (AE1 + 1) + ',' + (AE2 + 1) + (ok ? '-' + (AE2 + 4) : ''), cell: ok ? [i1, i2] : null, cap: 'addEdge("' + o.a + '", "' + o.b + '"): getIndex gives ' + i1 + ' and ' + i2 + '. ' + (ok ? 'Both are valid: adjMatrix[' + i1 + '][' + i2 + '] = true and adjMatrix[' + i2 + '][' + i1 + '] = true (an undirected edge is stored twice).' : 'getIndex returns −1 for a missing vertex, so indexIsValid is false and <b>nothing happens</b>: no error, no edge.') });
        }
      });
      if (!ops.length) snap({ slide: 24, line: ms + 1, cap: 'Type operations like addVertex A, addEdge A B.' });
      return st;
    },
    draw: function (k, s) {
      var out = [], cw = s.cp > 5 ? 24 : 34, x0 = 40;
      out.push(T('vl', x0, 24, 'vertices (numVertices = ' + s.n + ')', { mono: true, size: 12, bold: true, tone: 'muted' }));
      for (var i = 0; i < s.cp; i++) {
        var used = i < s.n;
        out.push(B('vc' + i, x0 + i * cw, 34, cw - 2, 24, { title: used ? s.verts[i] : 'null', mono: true, size: used ? 11 : cw < 30 ? 6 : 8, tone: s.at === i ? 'accent' : used ? 'blue' : 'muted', fill: s.at === i ? 'solid' : 'soft', o: used ? 1 : 0.5 }));
        out.push(T('mr' + i, x0 - 8, 92 + i * 24 + 16, String(i), { anchor: 'end', mono: true, size: 10, tone: 'muted' }));
        out.push(T('mc' + i, x0 + i * cw + cw / 2 - 1, 88, String(i), { anchor: 'middle', mono: true, size: 10, tone: 'muted' }));
        for (var j = 0; j < s.cp; j++) {
          var on = s.M[i][j], live = i < s.n && j < s.n, hot = s.cell && ((s.cell[0] === i && s.cell[1] === j) || (s.cell[0] === j && s.cell[1] === i));
          out.push(B('mx' + i + '_' + j, x0 + j * cw, 92 + i * 24, cw - 2, 22, { title: on ? 'T' : 'F', mono: true, size: 10, tone: hot ? 'accent' : on ? 'teal' : 'muted', fill: hot ? 'solid' : 'soft', o: live ? 1 : 0.35 }));
        }
      }
      var g = { V: s.verts.slice(0, s.n), E: [], dir: false };
      for (var a = 0; a < s.n; a++) for (var b = a + 1; b < s.n; b++) if (s.M[a][b]) g.E.push({ a: s.verts[a], b: s.verts[b], d: false, w: null });
      if (s.n) out = out.concat(drawG(g, {}).map(function (it) { var c = Object.assign({}, it); if ('x1' in c) { c.x1 = c.x1 * 0.55 + 380; c.x2 = c.x2 * 0.55 + 380; c.y1 = c.y1 * 0.55 + 40; c.y2 = c.y2 * 0.55 + 40; } else { c.x = c.x * 0.55 + 380; c.y = c.y * 0.55 + 40; if (c.k === 'box') { c.w *= 0.8; c.h *= 0.8; c.size = 10; } } return c; }));
      out.push(T('mod', 580, 326, 'modCount = ' + s.mod + ' · capacity ' + s.cp, { anchor: 'end', mono: true, size: 12, bold: true, tone: 'teal' }));
      return out;
    }
  };

  /* ---------- 5. breadth-first traversal (slides 29-35) ---------- */
  var BC = 'public Iterator<T> iteratorBFS(int startIndex) {\n  Integer x;\n  QueueADT<Integer> traversalQueue = new LinkedQueue<Integer>();\n  UnorderedListADT<T> resultList = new ArrayUnorderedList<T>();\n  if (!indexIsValid(startIndex))\n    return resultList.iterator();\n  boolean[] visited = new boolean[numVertices];\n  for (int i = 0; i < numVertices; i++)\n    visited[i] = false;\n  traversalQueue.enqueue(new Integer(startIndex));\n  visited[startIndex] = true;\n  while (!traversalQueue.isEmpty()) {\n    x = traversalQueue.dequeue();\n    resultList.addToRear(vertices[x.intValue()]);\n    //  Find all vertices adjacent to x that have not been visited\n    //  and queue them up\n    for (int i = 0; i < numVertices; i++) {\n      if (adjMatrix[x.intValue()][i] && !visited[i]) {\n        traversalQueue.enqueue(new Integer(i));\n        visited[i] = true;\n      }\n    }\n  }\n  return new GraphIterator(resultList.iterator());\n}';
  var G33 = '1-2, 1-3, 1-4, 2-4, 2-5, 3-6, 4-6, 5-7, 5-8, 6-9, 7-9, 8-9';
  function travDraw(s) {
    var vt = {}; (s.done || []).forEach(function (q) { vt[q] = 'teal'; }); (s.vis || []).forEach(function (q) { if (!vt[q]) vt[q] = 'blue'; }); g0(s).V.forEach(function (q) { if (!vt[q]) vt[q] = 'muted'; }); if (s.at) vt[s.at] = 'accent';
    var out = drawG(s.g, { vt: vt, et: s.et });
    out = out.concat(panel('q', 372, 40, s.qname + (s.qname === 'queue' ? ' (front → rear)' : ' (bottom → top)'), s.q.join(', ') || '(empty)', 'blue'));
    out = out.concat(panel('r', 372, 110, 'result list', (s.done || []).join(', ') || '(empty)', 'teal'));
    out.push(T('vk', 372, 180, 'visited: ' + (s.vis || []).join(' '), { mono: true, size: 12, tone: 'muted' }));
    return out;
  }
  function g0(s) { return s.g; }
  var bfs = {
    id: 'bfs', slides: [29, 35], title: 'Breadth-first traversal with a queue', vb: [600, 340],
    code: BC,
    inputs: [{ id: 'g', type: 'text', label: 'edges', value: G33, minlen: 1, maxlen: 120 }, { id: 's', type: 'text', label: 'start vertex', value: '9', minlen: 1, maxlen: 10 }],
    inputsLabel: 'Vertex indexes follow the order the vertices first appear in the list.',
    presets: [{ label: 'slide 34: start at 9', values: { g: G33, s: '9' } }, { label: 'slide 35: start at 5', values: { g: G33, s: '5' } }, { label: 'start at 1', values: { g: G33, s: '1' } }, { label: 'not connected', values: { g: 'A-B, A-C, B-C, D', s: 'A' } }, { label: 'a start that does not exist', values: { g: G33, s: '0' } }],
    steps: function (v) {
      var g = parseG(v.g), st = [], s0 = String(v.s).trim(), q = [], vis = [], done = [], et = {};
      var snap = function (o) { o.g = g; o.q = q.slice(); o.vis = vis.slice(); o.done = done.slice(); o.et = JSON.parse(JSON.stringify(et)); o.qname = 'queue'; st.push(o); return o; };
      snap({ slide: 29, line: '1-4', cap: 'Breadth-first = level by level, like a level-order traversal of a tree. A graph has no root, so we may start anywhere: here at ' + s0 + '. We need a <b>queue</b> and a result list.' });
      if (g.V.indexOf(s0) < 0) { snap({ slide: 31, line: '5-6', cap: '"' + s0 + '" is not a vertex: indexIsValid fails and the iterator is <b>empty</b>.' }); return st; }
      snap({ slide: 31, line: '7-9', cap: 'visited[] has one boolean per vertex, all false.' });
      q.push(s0); vis.push(s0);
      snap({ slide: 31, line: '10-11', at: s0, cap: 'Enqueue the start vertex ' + s0 + ' and mark it visited.' });
      while (q.length) {
        var x = q.shift(); done.push(x);
        var ns = nbrs(g, x).map(function (n) { return n.v; }), fresh = ns.filter(function (n) { return vis.indexOf(n) < 0; });
        snap({ slide: 32, line: '12-14', at: x, cap: 'Dequeue ' + x + ' and add it to the result. Its neighbours: ' + (ns.join(', ') || 'none') + (ns.length > fresh.length ? ' (' + ns.filter(function (n) { return fresh.indexOf(n) < 0; }).join(', ') + ' already visited)' : '') + '.' });
        fresh.forEach(function (n) { q.push(n); vis.push(n); et[keyOf(x, n, g)] = 'accent'; snap({ slide: 32, line: '17-20', at: x, cap: 'adjMatrix[' + x + '][' + n + '] is true and ' + n + ' is not visited: enqueue ' + n + ', mark it visited.' }); });
      }
      snap({ slide: g.V.length === done.length ? (s0 === '9' ? 34 : s0 === '5' ? 35 : 33) : 33, line: 24, cap: 'The queue is empty. BFS from ' + s0 + ': <b>' + done.join(', ') + '</b>.' + (done.length < g.V.length ? ' ' + g.V.filter(function (q2) { return done.indexOf(q2) < 0; }).join(', ') + ' never appeared: the graph is not connected.' : ' The orange edges form a spanning tree of the graph.') });
      return st;
    },
    draw: function (k, s) { return travDraw(s); }
  };

  /* ---------- 6. depth-first traversal (slides 38-40) ---------- */
  var DFC = 'public Iterator<T> iteratorDFS(int startIndex) {\n  Integer x;\n  boolean found;\n  StackADT<Integer> traversalStack = new LinkedStack<Integer>();\n  UnorderedListADT<T> resultList = new ArrayUnorderedList<T>();\n  boolean[] visited = new boolean[numVertices];\n  if (!indexIsValid(startIndex))\n    return resultList.iterator();\n  for (int i = 0; i < numVertices; i++)\n    visited[i] = false;\n  traversalStack.push(new Integer(startIndex));\n  resultList.addToRear(vertices[startIndex]);\n  visited[startIndex] = true;\n  while (!traversalStack.isEmpty()) {\n    x = traversalStack.peek();\n    found = false;\n    //  Find a vertex adjacent to x that has not been visited\n    //  and push it on the stack\n    for (int i = 0; (i < numVertices) && !found; i++) {\n      if (adjMatrix[x.intValue()][i] && !visited[i]) {\n        traversalStack.push(new Integer(i));\n        resultList.addToRear(vertices[i]);\n        visited[i] = true;\n        found = true;\n      }\n    }\n    if (!found && !traversalStack.isEmpty())\n      traversalStack.pop();\n  }\n  return new GraphIterator(resultList.iterator());\n}';
  var dfs = {
    id: 'dfs', slides: [38, 40], title: 'Depth-first traversal with a stack', vb: [600, 340],
    code: DFC,
    inputs: [{ id: 'g', type: 'text', label: 'edges', value: G33, minlen: 1, maxlen: 120 }, { id: 's', type: 'text', label: 'start vertex', value: '9', minlen: 1, maxlen: 10 }],
    presets: [{ label: 'start at 9', values: { g: G33, s: '9' } }, { label: 'start at 5', values: { g: G33, s: '5' } }, { label: 'a path graph', values: { g: 'A-B, B-C, C-D, A-E', s: 'A' } }, { label: 'not connected', values: { g: 'A-B, A-C, B-C, D', s: 'A' } }],
    steps: function (v) {
      var g = parseG(v.g), st = [], s0 = String(v.s).trim(), stack = [], vis = [], done = [], et = {};
      var snap = function (o) { o.g = g; o.q = stack.slice(); o.vis = vis.slice(); o.done = done.slice(); o.et = JSON.parse(JSON.stringify(et)); o.qname = 'stack'; st.push(o); return o; };
      snap({ slide: 38, line: '1-6', cap: 'Depth-first uses a <b>stack</b> instead of a queue: it goes as deep as it can before it comes back. A vertex is added to the result when it is pushed.' });
      if (g.V.indexOf(s0) < 0) { snap({ slide: 39, line: '7-8', cap: '"' + s0 + '" is not a vertex: the iterator is empty.' }); return st; }
      stack.push(s0); done.push(s0); vis.push(s0);
      snap({ slide: 39, line: '11-13', at: s0, cap: 'Push ' + s0 + ', add it to the result, mark it visited.' });
      while (stack.length) {
        var x = stack[stack.length - 1], nx = nbrs(g, x).map(function (n) { return n.v; }).filter(function (n) { return vis.indexOf(n) < 0; })[0];
        if (nx != null) { stack.push(nx); done.push(nx); vis.push(nx); et[keyOf(x, nx, g)] = 'accent'; snap({ slide: 40, line: '15,19-24', at: nx, cap: 'peek: ' + x + '. Its first unvisited neighbour is ' + nx + ': push it, add it to the result, mark it visited.' }); }
        else { stack.pop(); snap({ slide: 40, line: '15,27-28', at: stack.length ? stack[stack.length - 1] : null, cap: 'peek: ' + x + '. No unvisited neighbour (found = false): <b>pop</b> ' + x + ' and go back' + (stack.length ? ' to ' + stack[stack.length - 1] + '.' : '. The stack is empty.') }); }
      }
      snap({ slide: 40, line: 30, cap: 'DFS from ' + s0 + ': <b>' + done.join(', ') + '</b>. Compare with BFS from the same vertex: DFS runs down one long path first.' });
      return st;
    },
    draw: function (k, s) { return travDraw(s); }
  };

  /* ---------- 7. connectivity (slide 41) ---------- */
  var CC = 'connected  ⇔  for every vertex v,\n               a breadth-first traversal from v\n               reaches all n vertices';
  var conn = {
    id: 'conn', slides: [41, 41], title: 'Connected? Run BFS from every vertex', lang: 'text', vb: [600, 340],
    code: CC,
    inputs: [{ id: 'g', type: 'text', label: 'edges', value: 'A-B, A-C, B-C, B-D', minlen: 1, maxlen: 90 }],
    presets: [{ label: 'slide 41: left', values: { g: 'A-B, A-C, B-C, B-D' } }, { label: 'slide 41: right', values: { g: 'A-B, A-C, B-C, D' } }, { label: 'directed: one way only', values: { g: 'A>B, B>C, C>D' } }],
    steps: function (v) {
      var g = parseG(v.g), st = [], rows = [];
      var snap = function (o) { o.g = g; o.rows = rows.slice(); st.push(o); return o; };
      snap({ slide: 41, line: 1, cap: 'n = ' + g.V.length + '. Run a breadth-first traversal from each vertex and count what it reaches.' });
      g.V.forEach(function (x) { var r = bfsOrder(g, x); rows.push({ s: x, r: r }); var vt = {}; r.forEach(function (q) { vt[q] = 'teal'; }); vt[x] = 'accent'; snap({ slide: 41, line: '2-3', vt: vt, cap: 'BFS from ' + x + ': ' + r.join(', ') + ' (' + r.length + ' of ' + g.V.length + ')' + (r.length === g.V.length ? '.' : ': <b>not all</b>.') }); });
      var ok = rows.every(function (r) { return r.r.length === g.V.length; });
      snap({ slide: 41, line: 1, cap: ok ? 'Every traversal reached all ' + g.V.length + ' vertices: the graph is <b>connected</b>.' : 'At least one traversal missed some vertices: the graph is <b>not connected</b>.' });
      return st;
    },
    draw: function (k, s) {
      var out = drawG(s.g, { vt: s.vt }).map(function (it) { var c = Object.assign({}, it); if ('x1' in c) { c.x1 *= 0.75; c.x2 *= 0.75; c.y1 *= 0.75; c.y2 *= 0.75; } else { c.x *= 0.75; c.y *= 0.75; } return c; });
      out.push(T('th', 300, 30, 'start   breadth-first traversal', { mono: true, size: 12, bold: true, tone: 'muted' }));
      s.rows.forEach(function (r, i) { var full = r.r.length === s.g.V.length; out.push(B('tr' + i, 296, 40 + i * 28, 280, 24, { title: r.s + '       ' + r.r.join(', '), mono: true, size: 11, tone: full ? 'teal' : 'red', align: 'left' })); });
      return out;
    }
  };

  /* ---------- 8. spanning tree and minimum spanning tree (slides 42-45) ---------- */
  var MC = 'pick a starting vertex; it is the first vertex of the MST\nadd all edges of the starting vertex to a minheap (by weight)\nrepeat until the minheap is empty or all vertices are in the MST:\n  remove the minimum edge from the minheap\n  (if both ends are already in the MST, skip it)\n  add the edge and its new vertex to the MST\n  add to the minheap the edges of the new vertex\n    whose other vertex is not in the MST yet';
  var G44 = '1-2:12, 1-4:6, 2-4:8, 2-5:3, 4-3:11, 5-3:1';
  var mst = {
    id: 'mst', slides: [42, 45], title: 'Minimum spanning tree with a minheap of edges', lang: 'text', vb: [600, 340],
    code: MC,
    inputs: [{ id: 'g', type: 'text', label: 'weighted edges', value: G44, minlen: 1, maxlen: 160 }, { id: 's', type: 'text', label: 'start', value: '1', minlen: 1, maxlen: 10 }],
    presets: [{ label: 'slide 44 network', values: { g: G44, s: '1' } }, { label: 'same network, start at 3', values: { g: G44, s: '3' } }, { label: 'slide 43: no weights (all 1)', values: { g: G33.split(', ').map(function (e) { return e + ':1'; }).join(', '), s: '9' } }, { label: 'flights', values: { g: CITY, s: 'Boston' } }],
    steps: function (v) {
      var g = parseG(v.g), st = [], s0 = String(v.s).trim(), inT = [], heap = [], tree = {}, total = 0, seq = 0;
      g.E.forEach(function (e) { if (e.w == null) e.w = 1; });
      var snap = function (o) { o.g = g; o.inT = inT.slice(); o.heap = heap.slice().sort(function (a, b) { return a.w - b.w || a.n - b.n; }); o.tree = JSON.parse(JSON.stringify(tree)); o.total = total; st.push(o); return o; };
      snap({ slide: 42, line: 1, cap: 'A <b>spanning tree</b> keeps all ' + g.V.length + ' vertices but only ' + (g.V.length - 1) + ' edges: enough to connect them, with no cycle. The <b>minimum</b> spanning tree has the smallest total weight.' });
      if (g.V.indexOf(s0) < 0) { snap({ slide: 45, line: 1, cap: '"' + s0 + '" is not a vertex. Choose one of: ' + g.V.join(', ') + '.' }); return st; }
      inT.push(s0);
      var pushEdges = function (u) { nbrs(g, u).forEach(function (n) { if (inT.indexOf(n.v) < 0) heap.push({ a: u, b: n.v, w: n.w, n: seq++ }); }); };
      pushEdges(s0);
      snap({ slide: 45, line: '1-2', cap: 'Start at ' + s0 + '. Its edges go into the minheap: ' + heap.map(function (e) { return e.a + '-' + e.b + ' (' + e.w + ')'; }).join(', ') + '.' });
      while (heap.length && inT.length < g.V.length) {
        heap.sort(function (a, b) { return a.w - b.w || a.n - b.n; }); var e = heap.shift();
        if (inT.indexOf(e.b) >= 0) { snap({ slide: 45, line: '4-5', cap: 'removeMin: ' + e.a + '-' + e.b + ' (' + e.w + '). Both ends are already in the tree: taking it would make a cycle, so skip it.' }); continue; }
        inT.push(e.b); tree[keyOf(e.a, e.b, g)] = 1; total += e.w;
        var before = heap.length; pushEdges(e.b);
        snap({ slide: g.V.length === 9 ? 43 : 44, line: '4,6-8', at: e.b, cap: 'removeMin: ' + e.a + '-' + e.b + ' (' + e.w + '), the cheapest edge leaving the tree. Add it and ' + e.b + '. ' + (heap.length > before ? 'New edges into the heap: ' + heap.slice(before).map(function (x) { return x.a + '-' + x.b + ' (' + x.w + ')'; }).join(', ') + '.' : 'No new edges.') });
      }
      snap({ slide: 44, line: 3, cap: (inT.length === g.V.length ? 'All vertices are in the tree: ' : 'The heap is empty, but only ' + inT.length + ' vertices were reached (the graph is not connected). ') + Object.keys(tree).length + ' edges, total weight <b>' + total + '</b>.' });
      return st;
    },
    draw: function (k, s) {
      var vt = {}; s.inT.forEach(function (q) { vt[q] = 'teal'; }); if (s.at) vt[s.at] = 'accent';
      var et = {}; Object.keys(s.tree).forEach(function (q) { et[q] = 'accent'; });
      var out = drawG(s.g, { vt: vt, et: et });
      out.push(T('hl', 380, 30, 'minheap (smallest first)', { mono: true, size: 12, bold: true, tone: 'muted' }));
      s.heap.slice(0, 9).forEach(function (e, i) { out.push(B('he' + e.n, 380, 40 + i * 26, 160, 22, { title: e.a + '-' + e.b + '  w=' + e.w, mono: true, size: 11, tone: i ? 'blue' : 'accent', fill: i ? 'soft' : 'solid' })); });
      out.push(T('tw', 580, 326, 'tree weight = ' + s.total, { anchor: 'end', mono: true, size: 13, bold: true, tone: 'teal' }));
      return out;
    }
  };

  /* ---------- 9. shortest paths (slide 46) ---------- */
  var SC = 'fewest edges: a breadth-first traversal from the start;\n  remember for each vertex the vertex it was reached from,\n  then follow these links back from the target\ncheapest (weighted): a minheap of (vertex, weight) pairs:\n  take the vertex with the smallest total weight so far,\n  update its neighbours if going through it is cheaper';
  var spath = {
    id: 'spath', slides: [46, 46], title: 'Shortest path: fewest edges or cheapest', lang: 'text', vb: [600, 340],
    code: SC,
    inputs: [{ id: 'g', type: 'text', label: 'edges', value: G44, minlen: 1, maxlen: 160 }, { id: 'a', type: 'text', label: 'from', value: '1', minlen: 1, maxlen: 10 }, { id: 'b', type: 'text', label: 'to', value: '3', minlen: 1, maxlen: 10 }, { id: 'm', label: 'kind (1 fewest edges, 2 cheapest)', value: 2, min: 1, max: 2 }],
    presets: [{ label: 'cheapest 1 → 3', values: { g: G44, a: '1', b: '3', m: 2 } }, { label: 'fewest edges 1 → 3', values: { g: G44, a: '1', b: '3', m: 1 } }, { label: 'slide 33 graph: 9 → 1', values: { g: G33, a: '9', b: '1', m: 1 } }, { label: 'flights: Phila → Roanoke', values: { g: CITY, a: 'Phila', b: 'Roanoke', m: 2 } }],
    steps: function (v) {
      var g = parseG(v.g), st = [], a = String(v.a).trim(), b = String(v.b).trim(), m = Math.trunc(v.m) === 2 ? 2 : 1, dist = {}, prev = {}, done = [], lbl = {};
      var snap = function (o) { o.g = g; o.lbl = JSON.parse(JSON.stringify(lbl)); o.done = done.slice(); st.push(o); return o; };
      if (g.V.indexOf(a) < 0 || g.V.indexOf(b) < 0) { snap({ slide: 46, line: 1, cap: 'Choose "from" and "to" among: ' + g.V.join(', ') + '.' }); return st; }
      if (m === 1) {
        var q = [a]; dist[a] = 0; lbl[a] = 0;
        snap({ slide: 46, line: 1, at: a, cap: 'Fewest edges: a BFS from ' + a + '. The number under a vertex = edges from ' + a + '.' });
        while (q.length) { var x = q.shift(); done.push(x); var add = []; nbrs(g, x).forEach(function (n) { if (dist[n.v] == null) { dist[n.v] = dist[x] + 1; prev[n.v] = x; lbl[n.v] = dist[n.v]; q.push(n.v); add.push(n.v); } }); snap({ slide: 46, line: '1-2', at: x, cap: 'Dequeue ' + x + ' (' + dist[x] + ' edge' + (dist[x] === 1 ? '' : 's') + ' away). ' + (add.length ? add.join(', ') + (add.length === 1 ? ' is' : ' are') + ' reached from ' + x + ', ' + (dist[x] + 1) + ' edge' + (dist[x] ? 's' : '') + ' away.' : 'Nothing new.') }); if (x === b) break; }
      } else {
        g.V.forEach(function (x2) { dist[x2] = Infinity; }); dist[a] = 0; lbl[a] = 0; var heap = [{ v: a, d: 0 }];
        snap({ slide: 46, line: 4, at: a, cap: 'Cheapest: put (' + a + ', 0) in the minheap. The number under a vertex = the cheapest total found so far.' });
        while (heap.length) {
          heap.sort(function (p, q2) { return p.d - q2.d; }); var cur = heap.shift(); if (done.indexOf(cur.v) >= 0) continue; done.push(cur.v);
          var upd = [];
          nbrs(g, cur.v).forEach(function (n) { var w = n.w == null ? 1 : n.w, nd = cur.d + w; if (done.indexOf(n.v) < 0 && nd < dist[n.v]) { dist[n.v] = nd; prev[n.v] = cur.v; lbl[n.v] = nd; heap.push({ v: n.v, d: nd }); upd.push(n.v + ' = ' + nd); } });
          snap({ slide: 46, line: '5-6', at: cur.v, cap: 'removeMin: (' + cur.v + ', ' + cur.d + '), the cheapest vertex left; its total is final. ' + (upd.length ? 'Cheaper through ' + cur.v + ': ' + upd.join(', ') + '.' : 'No neighbour gets cheaper.') });
          if (cur.v === b) break;
        }
      }
      if (dist[b] == null || dist[b] === Infinity) { snap({ slide: 46, line: 3, cap: 'The target ' + b + ' cannot be reached from ' + a + '.' }); return st; }
      var p = [b]; while (p[0] !== a) p.unshift(prev[p[0]]);
      var et = {}, vt = {}; p.forEach(function (x3) { vt[x3] = 'accent'; }); for (var i = 1; i < p.length; i++) et[keyOf(p[i - 1], p[i], g)] = 'accent';
      snap({ slide: 46, line: 3, vt: vt, et: et, cap: 'Follow the links back from ' + b + ': <b>' + p.join(' → ') + '</b>, ' + (m === 1 ? (p.length - 1) + ' edges.' : 'total weight ' + dist[b] + '.') + ' The two kinds of "shortest" can give different paths: try both.' });
      return st;
    },
    draw: function (k, s) { var vt = s.vt || {}; if (!s.vt) { s.done.forEach(function (q) { vt[q] = 'teal'; }); if (s.at) vt[s.at] = 'accent'; } return drawG(s.g, { vt: vt, et: s.et, lbl: s.lbl }); }
  };

  var code = function (t) { return { type: 'code', lang: 'java', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; };
  var SCODE = {
    20: 'package jsjf;\nimport java.util.Iterator;\n/**\n * GraphADT defines the interface to a graph data structure.\n *\n * @author Lewis and Chase\n * @version 4.0\n */\npublic interface GraphADT<T>\n{\n    /**\n     * Adds a vertex to this graph, associating object with vertex.\n     *\n     * @param vertex the vertex to be added to this graph\n     */\n    public void addVertex(T vertex);\n    /**\n     * Removes a single vertex with the given value from this graph.\n     *\n     * @param vertex the vertex to be removed from this graph\n     */\n    public void removeVertex(T vertex);',
    21: '/**\n * Inserts an edge between two vertices of this graph.\n *\n * @param vertex1 the first vertex\n * @param vertex2 the second vertex\n */\npublic void addEdge(T vertex1, T vertex2);\n/**\n * Removes an edge between two vertices of this graph.\n *\n * @param vertex1 the first vertex\n * @param vertex2 the second vertex\n */\npublic void removeEdge(T vertex1, T vertex2);\n/**\n * Returns a breadth first iterator starting with the given vertex.\n *\n * @param startVertex the starting vertex\n * @return a breadth first iterator beginning at the given vertex\n */\npublic Iterator iteratorBFS(T startVertex);',
    22: '/**\n * Returns a depth first iterator starting with the given vertex.\n *\n * @param startVertex the starting vertex\n * @return a depth first iterator starting at the given vertex\n */\npublic Iterator iteratorDFS(T startVertex);\n/**\n * Returns an iterator that contains the shortest path between\n * the two vertices.\n *\n * @param startVertex the starting vertex\n * @param targetVertex the ending vertex\n * @return an iterator that contains the shortest path\n *         between the two vertices\n */\npublic Iterator iteratorShortestPath(T startVertex, T targetVertex);\n/**\n * Returns true if this graph is empty, false otherwise.\n *\n * @return true if this graph is empty\n */\npublic boolean isEmpty();',
    23: '    /**\n     * Returns true if this graph is connected, false otherwise.\n     *\n     * @return true if this graph is connected\n     */\n    public boolean isConnected();\n    /**\n     * Returns the number of vertices in this graph.\n     *\n     * @return the integer number of vertices in this graph\n     */\n    public int size();\n    /**\n     * Returns a string representation of the adjacency matrix.\n     *\n     * @return a string representation of the adjacency matrix\n     */\n    public String toString();\n}',
    24: 'package jsjf;\nimport jsjf.exceptions.*;\nimport java.util.*;\n/**\n * Graph represents an adjacency matrix implementation of a graph.\n *\n * @author Lewis and Chase\n * @version 4.0\n */\npublic class Graph<T> implements GraphADT<T>\n{\n    protected final int DEFAULT_CAPACITY = 5;\n    protected int numVertices;    // number of vertices in the graph\n    protected boolean[][] adjMatrix;    // adjacency matrix\n    protected T[] vertices;    // values of vertices\n    protected int modCount;\n    /**\n     * Creates an empty graph.\n     */\n    public Graph()\n    {\n        numVertices = 0;\n        this.adjMatrix = new boolean[DEFAULT_CAPACITY][DEFAULT_CAPACITY];\n        this.vertices = (T[])(new Object[DEFAULT_CAPACITY]);\n    }',
    25: '/**\n * Inserts an edge between two vertices of the graph.\n *\n * @param vertex1  the first vertex\n * @param vertex2  the second vertex\n */\npublic void addEdge(T vertex1, T vertex2)\n{\n    addEdge(getIndex(vertex1), getIndex(vertex2));\n}\n/**\n * Inserts an edge between two vertices of the graph.\n *\n * @param index1  the first index\n * @param index2  the second index\n */\npublic void addEdge(int index1, int index2)\n{\n    if (indexIsValid(index1) && indexIsValid(index2))\n    {\n        adjMatrix[index1][index2] = true;\n        adjMatrix[index2][index1] = true;\n        modCount++;\n    }\n}',
    26: '/**\n * Adds a vertex to the graph, expanding the capacity of the graph\n * if necessary.  It also associates an object with the vertex.\n *\n * @param vertex  the vertex to add to the graph\n */\npublic void addVertex(T vertex)\n{\n    if ((numVertices + 1) == adjMatrix.length)\n        expandCapacity();\n    vertices[numVertices] = vertex;\n    for (int i = 0; i < numVertices; i++)\n    {\n        adjMatrix[numVertices][i] = false;\n        adjMatrix[i][numVertices] = false;\n    }\n    numVertices++;\n    modCount++;\n}',
    27: '/**\n * Creates new arrays to store the contents of the graph with\n * twice the capacity.\n */\nprotected void expandCapacity()\n{\n    T[] largerVertices = (T[])(new Object[vertices.length*2]);\n    boolean[][] largerAdjMatrix =\n    new boolean[vertices.length*2][vertices.length*2];\n    for (int i = 0; i < numVertices; i++)\n    {\n        for (int j = 0; j < numVertices; j++)\n        {\n            largerAdjMatrix[i][j] = adjMatrix[i][j];\n        }\n        largerVertices[i] = vertices[i];\n    }\n    vertices = largerVertices;\n    adjMatrix = largerAdjMatrix;\n}',
    31: '/**\n * Returns an iterator that performs a breadth first\n * traversal starting at the given index.\n *\n * @param startIndex the index from which to begin the traversal\n * @return an iterator that performs a breadth first traversal\n */\npublic Iterator<T> iteratorBFS(int startIndex)\n{\n    Integer x;\n    QueueADT<Integer> traversalQueue = new LinkedQueue<Integer>();\n    UnorderedListADT<T> resultList = new ArrayUnorderedList<T>();\n    if (!indexIsValid(startIndex))\n        return resultList.iterator();\n    boolean[] visited = new boolean[numVertices];\n    for (int i = 0; i < numVertices; i++)\n        visited[i] = false;\n    traversalQueue.enqueue(new Integer(startIndex));\n    visited[startIndex] = true;',
    32: '    while (!traversalQueue.isEmpty())\n    {\n        x = traversalQueue.dequeue();\n        resultList.addToRear(vertices[x.intValue()]);\n        //  Find all vertices adjacent to x that have not been visited\n        //  and queue them up\n        for (int i = 0; i < numVertices; i++)\n        {\n            if (adjMatrix[x.intValue()][i] && !visited[i])\n            {\n                traversalQueue.enqueue(new Integer(i));\n                visited[i] = true;\n            }\n        }\n    }\n    return new GraphIterator(resultList.iterator());\n}',
    39: '/**\n * Returns an iterator that performs a depth first traversal\n * starting at the given index.\n *\n * @param startIndex the index from which to begin the traversal\n * @return an iterator that performs a depth first traversal\n */\npublic Iterator<T> iteratorDFS(int startIndex)\n{\n    Integer x;\n    boolean found;\n    StackADT<Integer> traversalStack = new LinkedStack<Integer>();\n    UnorderedListADT<T> resultList = new ArrayUnorderedList<T>();\n    boolean[] visited = new boolean[numVertices];\n    if (!indexIsValid(startIndex))\n        return resultList.iterator();\n    for (int i = 0; i < numVertices; i++)\n        visited[i] = false;\n    traversalStack.push(new Integer(startIndex));\n    resultList.addToRear(vertices[startIndex]);\n    visited[startIndex] = true;',
    40: '    while (!traversalStack.isEmpty())\n    {\n        x = traversalStack.peek();\n        found = false;\n        //  Find a vertex adjacent to x that has not been visited\n        //  and push it on the stack\n        for (int i = 0; (i < numVertices) && !found; i++)\n        {\n            if (adjMatrix[x.intValue()][i] && !visited[i])\n            {\n                traversalStack.push(new Integer(i));\n                resultList.addToRear(vertices[i]);\n                visited[i] = true;\n                found = true;\n            }\n        }\n        if (!found && !traversalStack.isEmpty())\n            traversalStack.pop();\n    }\n    return new GraphIterator(resultList.iterator());\n}'
  };
  var cs = function (n) { return [code(SCODE[n])]; };

  addUnit({
    course: 'ds', lesson: '15-graphs',
    blurb: 'Undirected, directed and weighted graphs, adjacency lists and matrices, a Java Graph class, breadth-first and depth-first traversal, connectivity, minimum spanning trees and shortest paths.',
    parts: [
      { title: 'Graphs: terms and kinds', from: 1, to: 15 },
      { title: 'Implementing graphs', from: 16, to: 27 },
      { title: 'Breadth-first traversal', from: 28, to: 37 },
      { title: 'Depth-first, connectivity, spanning trees, paths', from: 38, to: 46 }
    ],
    visuals: [terms, digraph, adj, graphcode, bfs, dfs, conn, mst, spath],
    slides: {
      1: { cover: true, explain: '<p>A <b>graph</b> is a set of points (vertices) joined by lines (edges). Unlike a tree, any vertex may connect to any other, and there is no root.</p><pre class="ex">cities and flights, people and friendships,\ncomputers and cables</pre><p>This unit: kinds of graphs, how to store them, how to visit all vertices, and how to find cheap connections.</p>' },
      2: { explain: '<p>The chapter covers:</p><pre class="ex">directed and undirected graphs\nweighted graphs (networks)\ncommon graph algorithms</pre><p>The algorithms: two traversals (breadth-first and depth-first), connectivity, minimum spanning trees and shortest paths.</p>' },
      3: { explain: '<p>Graph words:</p><pre class="ex">vertex  a node (a point), named like A or Boston\nedge    a connection, written (A, B)</pre><p>In an <b>undirected</b> graph the pair is unordered: (A, B) and (B, A) are the same edge.</p><p class="watch">"vertex" is one, "vertices" is many.</p>' },
      4: { text: false, blocks: [bul('An undirected graph:')], explain: '<p>Four vertices and five edges:</p><pre class="ex">(A, B) (A, C) (B, C) (B, D) (C, D)</pre><p>The lines A–C and B–D cross in the picture, but crossing means nothing: only the listed pairs are edges. A and D are not joined.</p>' },
      5: { explain: '<ul><li>An undirected edge can be used both ways.</li><li>Two vertices joined by an edge are <b>adjacent</b> (neighbours).</li><li>A <b>self-loop</b> (sling) joins a vertex to itself.</li><li>A <b>complete</b> graph has every possible edge.</li></ul><pre class="ex">n vertices → at most n(n − 1) / 2 edges\n4 vertices → 6 edges</pre><p>The slide 4 graph has 5 of 6, so it is not complete (A–D is missing).</p>' },
      6: { explain: '<p>A <b>path</b> is a chain of edges from one vertex to another; its <b>length</b> is the number of edges.</p><pre class="ex">A → B → D: length 2 (3 vertices − 1)</pre><p>A graph is <b>connected</b> when there is a path between <b>any</b> two vertices.</p><p class="watch">"The length of a path in is …" on the slide has an extra word; it means "the length of a path is …".</p>' },
      7: { text: false, blocks: [bul('An example of an undirected graph that is not connected:')], explain: '<p>A, B and C are joined, but D has no edges at all.</p><pre class="ex">path from A to D? none → not connected</pre><p>One missing path is enough to make the whole graph not connected.</p>' },
      8: { explain: '<p>A <b>cycle</b> is a path that comes back to its start without using an edge twice:</p><pre class="ex">A → B → C → A</pre><p>A graph with no cycles is <b>acyclic</b>. A tree is a connected acyclic graph: there is exactly one path between any two of its vertices.</p><p class="watch">Going A → B → A uses the same edge twice: that is not a cycle.</p>' },
      9: { explain: '<p>In a <b>directed graph</b> (digraph) each edge is an <b>ordered</b> pair, drawn as an arrow:</p><pre class="ex">(A, B): A → B only\n(B, A): B → A, a different edge</pre><p>Think of one-way streets: you may only drive in the arrow’s direction.</p>' },
      10: { text: false, blocks: [bul('A directed graph with'), bul('vertices A, B, C, D', 1), bul('edges (A, B), (A, D), (B, C), (B, D) and (D, C)', 1)], explain: '<p>Five arrows: A → B, A → D, B → C, B → D, D → C.</p><pre class="ex">from A you can reach B, C, D\nfrom C you can reach nothing</pre><p>C has no outgoing arrows, so no path starts at C.</p>' },
      11: { blocks: [bul('Previous definitions change slightly for directed graphs'), bul('a path in a direct graph is a sequence of directed edges that connects two vertices in a graph', 1), bul('a directed graph is connected if for any two vertices in the graph there is a path between them', 1), bul('if a directed graph has no cycles, it is possible to arrange the vertices such that vertex A precedes vertex B if an edge exists from A to B', 1)],
        explain: '<p>With arrows:</p><pre class="ex">path: follow the arrows only\nconnected: from every vertex to every other one\nno cycles → the vertices can be lined up\n            so every arrow points forward</pre><p>That line-up is like an order of courses: a course comes before every course that needs it.</p>' },
      12: { text: false, blocks: [bul('A connected directed graph and an unconnected directed graph:')], explain: '<p>Left: the arrows go round 1 → 2 → 3 → 4 → 5 → 6 → 1, so every vertex can reach every other: <b>connected</b>.</p><pre class="ex">right: 1 → 6 instead of 6 → 1\nfrom 4 you can never get back to 1</pre><p>Turning one arrow around breaks the connection.</p>' },
      13: { blocks: [bul('A weighted graph, sometimes called a network, is a graph with weights (or costs) associated with each edge'), bul('The weight of a path in a weighted graph is the sum of the weights of the edges in the path'), bul('Weighted graphs may be either undirected or directed'), bul('For weighted graphs, we represent each edge with a triple including the starting vertex, ending vertex, and the weight (Boston, New York, 120)')],
        explain: '<p>A <b>weighted graph</b> (network) puts a number on each edge: a price, a distance, a time.</p><pre class="ex">edge triple: (Boston, New York, 120)\npath weight = sum of its edges</pre><p>Now "the best path" can mean the cheapest one, not the one with the fewest edges.</p>' },
      14: { text: false, blocks: [bul('We could use an undirected network to represent flights between cities'), bul('The weights are the cost')], explain: '<p>Flights and their prices, the same in both directions:</p><pre class="ex">Philadelphia → New York → Roanoke\n225 + 320 = 545</pre><p>There is no direct Philadelphia–Roanoke flight, so every trip between them goes through New York.</p>' },
      15: { text: false, blocks: [bul('A directed version of the graph could show different costs depending on the direction')], explain: '<p>With arrows, each direction has its own price:</p><pre class="ex">Boston → New York: 120\nNew York → Boston: 140</pre><p>A directed weighted graph models real life better: a trip there may cost more than the trip back.</p>' },
      16: { blocks: [bul('Strategies for implementing graphs:'), bul('Adjacency lists', 1), bul('use a set of graph nodes which contain a linked list storing the edges within each node', 2), bul('for weighted graphs, each edge would be stored as a triple including the weight', 2), bul('Adjacency matrices', 1), bul('use a two dimensional array', 2), bul('each position of the array represents an intersection between two vertices in the graph', 2), bul('each intersection is represented by a boolean value indicating whether or not the two vertices are connected', 2), bul('https://www.geeksforgeeks.org/graph-and-its-representations/', 1)],
        explain: '<p>Two ways to store a graph:</p><pre class="ex">adjacency list:   each vertex keeps a list\n                  of its neighbours\nadjacency matrix: a 2D boolean array,\n                  [i][j] = edge from i to j?</pre><p>The link on the slide shows more pictures of both.</p>' },
      17: { text: false, blocks: [bul("An undirected graph and it's adjacency list:")], explain: '<p>Each vertex has a linked list of its neighbours:</p><pre class="ex">A → B → C → D\nB → A → E\nD → A → C → E</pre><p>Each undirected edge appears in <b>two</b> lists: A–B is in A’s list and in B’s list.</p><p class="watch">"it\'s" on the slide should be "its" (it is a possessive).</p>' },
      18: { text: false, blocks: [bul("An undirected graph and it's adjacency matrix:")], explain: '<p>The matrix of the slide 4 graph: row A, column B is T because the edge A–B exists.</p><pre class="ex">    A B C D\nA   F T T F\nB   T F T T</pre><p>For an undirected graph the matrix is <b>symmetric</b>: [A][B] and [B][A] are the same.</p>' },
      19: { text: false, blocks: [bul('A directed graph and its adjacency matrix:')], explain: '<p>For a directed graph, row = from, column = to:</p><pre class="ex">A → B: [A][B] = T, but [B][A] = F</pre><p>So the matrix is no longer symmetric. Row C and row D are all F: no arrows leave C or D.</p>' },
      20: { blocks: cs(20), explain: '<p><b>GraphADT&lt;T&gt;</b>, the graph interface. Its first methods:</p><pre class="ex">addVertex(T vertex)\nremoveVertex(T vertex)</pre><p>The vertices hold values of type T (like Strings for city names).</p>' },
      21: { blocks: cs(21), explain: '<p>More methods: addEdge and removeEdge take the two vertices, and <code>iteratorBFS(startVertex)</code> returns an iterator over a breadth-first traversal.</p><pre class="ex">g.addEdge("A", "B");\nIterator it = g.iteratorBFS("A");</pre><p class="watch">The return type is the raw <code>Iterator</code>; <code>Iterator&lt;T&gt;</code> would be the generic form.</p>' },
      22: { blocks: cs(22), explain: '<p>A depth-first iterator, a shortest-path iterator between two vertices, and isEmpty:</p><pre class="ex">iteratorDFS(start)\niteratorShortestPath(start, target)</pre><p>The shortest path is also given as an iterator: you walk through the vertices of the path in order.</p>' },
      23: { blocks: cs(23), explain: '<p>The last methods: <code>isConnected()</code>, <code>size()</code> (the number of vertices) and <code>toString()</code>, which shows the adjacency matrix.</p><pre class="ex">g.isConnected() → true or false</pre><p>Notice there is no "get the neighbours" method: the traversals do that work inside the class.</p>' },
      24: { text: false, blocks: cs(24), explain: '<p><b>Graph&lt;T&gt;</b> uses an adjacency matrix:</p><pre class="ex">numVertices  how many vertices\nadjMatrix    boolean[][]  (5 × 5 at the start)\nvertices     T[] with the vertex values</pre><p>The vertex at index i in <code>vertices</code> is row i and column i of the matrix.</p>' },
      25: { text: false, blocks: cs(25), explain: '<p>Two <code>addEdge</code> methods (overloading): one takes vertices, finds their indexes with getIndex and calls the other one.</p><pre class="ex">adjMatrix[index1][index2] = true;\nadjMatrix[index2][index1] = true;</pre><p>Both cells are set: the edge is <b>undirected</b>.</p><p class="watch">getIndex and indexIsValid are not on the slides. A missing vertex gives index −1, so nothing is added and no error is shown.</p>' },
      26: { text: false, blocks: cs(26), explain: '<p>addVertex puts the value in <code>vertices[numVertices]</code> and clears its row and column (no edges yet), then numVertices++.</p><pre class="ex">(numVertices + 1) == adjMatrix.length → expandCapacity()</pre><p class="watch">It expands when <b>one</b> place is still free: with capacity 5, adding the 5th vertex already doubles the arrays.</p>' },
      27: { blocks: cs(27), explain: '<p>expandCapacity makes both arrays twice as big and copies the old values:</p><pre class="ex">5 × 5 matrix → 10 × 10 matrix\nonly [0..numVertices-1] is copied</pre><p>The rest of the new matrix is false (Java’s default for boolean), so there are no edges there yet.</p>' },
      28: { blocks: [bul('There are a number of a common algorithms that may apply to undirected, directed, and/or weighted graphs'), bul('These include'), bul('various traversal algorithms', 1), bul('algorithms for finding the shortest path', 1), bul('algorithms for finding the least costly path in a network', 1), bul('algorithms for answering simple questions (such as connectivity)', 1)],
        explain: '<p>Common questions about a graph:</p><pre class="ex">visit all vertices          traversal\nfewest edges from A to B    shortest path\ncheapest way from A to B    least costly path\nis everything reachable?    connectivity</pre><p>The traversals come first, because the other algorithms are built on them.</p>' },
      29: { blocks: [bul('There are two main types of graph traversal algorithms'), bul('breadth-first: behaves much like a level-order traversal of a tree', 1), bul('depth-first: behaves much like the preorder traversal of a tree', 1), bul('One difference: there is no root node present in a graph'), bul('Graph traversals may start at any vertex in the graph', 1)],
        explain: '<p>Two traversals:</p><pre class="ex">breadth-first: near vertices first (like level-order)\ndepth-first:   go deep first (like pre-order)</pre><p>A graph has no root, so a traversal may start at any vertex. Another difference from trees: a vertex can be reached in several ways, so we must remember which ones we already <b>visited</b>.</p>' },
      30: { blocks: [bul('We can construct a breadth-first traversal for a graph using a queue and an iterator'), bul('We will use the queue to manage the traversal and the iterator to build the result'), bul('Breadth-first traversal algorithm overview'), bul('enqueue the starting vertex, and mark it as “visited”', 1), bul('loop until queue is empty', 1), bul('dequeue first vertex and add it to iterator', 2), bul('enqueue each unmarked vertex adjacent to the dequeued vertex', 2), bul('mark each vertex enqueued as “visited”', 2)],
        explain: '<p>The breadth-first algorithm:</p><pre class="ex">enqueue start, mark it\nwhile the queue is not empty:\n  dequeue v, add v to the result\n  enqueue every unmarked neighbour, mark it</pre><p>A vertex is marked when it is <b>enqueued</b>, so it can never enter the queue twice.</p>' },
      31: { blocks: cs(31), explain: '<p>The Java version works with <b>indexes</b>: a queue of Integers and a result list of vertex values.</p><pre class="ex">visited = new boolean[numVertices]\nenqueue startIndex; visited[startIndex] = true</pre><p>An invalid start index gives an empty iterator.</p><p class="watch"><code>new Integer(startIndex)</code> is old Java (deprecated today); <code>Integer.valueOf</code> or autoboxing does the same.</p>' },
      32: { blocks: cs(32), explain: '<p>The loop: dequeue x, add <code>vertices[x]</code> to the result, then check the whole row x of the matrix:</p><pre class="ex">for i = 0 … numVertices-1:\n  if adjMatrix[x][i] and not visited[i]:\n    enqueue i, mark i</pre><p>Neighbours are checked in index order, which decides the order of the result.</p>' },
      33: { text: false, blocks: [bul('A traversal example:')], explain: '<p>The graph used for the next examples, with 9 vertices and 12 edges:</p><pre class="ex">1: 2, 3, 4      5: 2, 7, 8\n6: 3, 4, 9      9: 6, 7, 8</pre><p>Try the drawing with different start vertices: the result changes, but every vertex appears once.</p>' },
      34: { text: false, explain: '<p>BFS from 9 (neighbours in number order):</p><pre class="ex">9 → enqueue 6, 7, 8\n6 → 3, 4     7 → 5     8 → (nothing new)\n3 → 1       4 → 2\nresult: 9, 6, 7, 8, 3, 4, 5, 1, 2</pre><p>The result is exactly the order in which vertices entered the queue.</p>' },
      35: { text: false, explain: '<p>BFS from 5:</p><pre class="ex">5 → 2, 7, 8\n2 → 1, 4     7 → 9     8 → (nothing new)\n1 → 3       4 → 6\nresult: 5, 2, 7, 8, 1, 4, 9, 3, 6</pre><p>Vertices close to 5 (one edge away) come first, then those two edges away, and so on.</p>' },
      36: { blocks: [bul('Social Networks: Graphs are used to represent social networks, where nodes represent individuals and edges represent relationships between them. Graph algorithms can be used to analyze the structure of social networks and to identify influential individuals.'), bul('Maps and Navigation: Graphs are used to represent maps and road networks, where nodes represent locations and edges represent roads or other routes between them. Graph algorithms can be used to determine the shortest path between two locations and to optimize travel routes.'), bul('Recommendation Systems: Graphs are used in recommendation systems to model user preferences and item relationships. Graph algorithms can be used to identify similar items or users and to make personalized recommendations.'), bul('Computer Networks: Graphs are used to model computer networks, where nodes represent devices and edges represent network connections. Graph algorithms can be used to optimize network traffic and to identify potential security threats.'), bul('Genetic Analysis: Graphs are used to represent genetic data, where nodes represent genes and edges represent genetic interactions. Graph algorithms can be used to identify gene functions and to analyze genetic pathways.'), bul('Image Processing: Graphs are used in image processing applications to represent image data as a graph, where nodes represent pixels and edges represent relationships between pixels. Graph algorithms can be used to identify patterns in images and to perform image segmentation.'), bul('Machine Learning: Graphs are used in machine learning applications to represent data and relationships between data points. Graph algorithms can be used to identify clusters of data points and to perform graph-based clustering and classification.')],
        explain: '<p>Graphs are everywhere something is connected to something:</p><pre class="ex">social networks  people – friendships\nmaps             places – roads (shortest path)\nshops            users – products they like\nnetworks         devices – cables</pre><p>Also genes, image pixels and machine learning data.</p>' },
      37: { explain: '<p>This slide has no content: it only marks where the material for one semester (Fall 2024) stopped. The slides after it cover depth-first traversal, connectivity, spanning trees and shortest paths.</p><pre class="ex">next: DFS, connectivity, MST, shortest path</pre>' },
      38: { blocks: [bul('Use nearly the same approach as the breadth-first traversal, but replace the queue with a stack'), bul('Additionally, do not mark a vertex as visited until it has been added to the iterator')],
        explain: '<p>Depth-first traversal = breadth-first with a <b>stack</b> instead of a queue:</p><pre class="ex">queue (FIFO) → wide: near vertices first\nstack (LIFO) → deep: one path as far as it goes</pre><p>A vertex is marked visited when it is added to the result.</p>' },
      39: { blocks: cs(39), explain: '<p>The setup is like BFS, but with a stack, and the start vertex is added to the result <b>right away</b>:</p><pre class="ex">push startIndex\nresultList.addToRear(vertices[startIndex])\nvisited[startIndex] = true</pre><p><code>found</code> will tell whether the top vertex still has an unvisited neighbour.</p>' },
      40: { blocks: cs(40), explain: '<p>Each round looks at the <b>top</b> of the stack (peek, not pop):</p><pre class="ex">first unvisited neighbour i → push i, add it, mark it\nnone (found stays false)    → pop: go back</pre><p>The <code>!found</code> in the for condition stops at the first neighbour found, so DFS goes one step deeper each time.</p>' },
      41: { text: false, blocks: [bul('A graph is connected if and only if for each vertex v in a graph containing n vertices, the size of the result of a breadth-first traversal at v is n')], explain: '<p>A test for connectivity: start a BFS from every vertex; if each one reaches all n vertices, the graph is connected.</p><pre class="ex">left:  every BFS lists A, B, C, D → connected\nright: BFS from A gives A, B, C (3 of 4)\n       BFS from D gives only D → not connected</pre><p>For an undirected graph one BFS is enough; for a directed graph all n are needed.</p>' },
      42: { blocks: [bul('A spanning tree is a tree that includes all of the vertices of a graph and some, but possibly not all, of the edges'), bul('Since trees are also graphs, for some graphs, the graph itself will be a spanning tree, and thus the only spanning tree')],
        explain: '<p>A <b>spanning tree</b> keeps <b>all</b> vertices but only enough edges to connect them, with no cycle:</p><pre class="ex">n vertices → n − 1 edges</pre><p>If the graph is already a tree, it is its own (and only) spanning tree. A BFS or DFS from any vertex gives one: the edges used to reach new vertices.</p>' },
      43: { text: false, blocks: [bul('An example of a spanning tree:')], explain: '<p>A spanning tree of the slide 33 graph: all 9 vertices, 8 edges, no cycles.</p><pre class="ex">9 edges of the graph are gone: 12 → 8</pre><p>There is still exactly one path between any two vertices, for example 2 → 5 → 8 → 9 → 6 → 3.</p>' },
      44: { text: false, blocks: [bul('A minimum spanning tree (MST) is a spanning tree where the sum of the weights of the edges is less than or equal to the sum of the weights for any other spanning tree for the same graph')], explain: '<p>In a weighted graph, the <b>minimum spanning tree</b> is the spanning tree with the smallest total weight.</p><pre class="ex">kept:    1, 3, 6, 8   → total 18\ndropped: 11, 12</pre><p>Example: the cheapest way to lay cables so that every building is connected.</p>' },
      45: { blocks: [bul('Minimal Spanning Tree algorithm overview'), bul('pick an arbitrary starting vertex and add it to our MST', 1), bul('add all of the edges that include our starting vertex to a minheap ordered by weight', 1), bul('remove the minimum edge from the minheap and add the edge and the new vertex to our MST', 1), bul('add to the minheap all of the edges that include this new vertex and whose other vertex is not already in the MST', 1), bul('continue until the minheap is empty or all vertices are in the MST', 1)],
        explain: '<p>Growing the MST from one vertex:</p><pre class="ex">heap = edges of the start\nrepeat: removeMin → the cheapest edge leaving the tree\n        add it and its new vertex\n        add the new vertex’s edges to the heap</pre><p>The minheap (unit 12) gives the cheapest edge in O(log n).</p><p class="watch">An edge in the heap may end up with both ends in the tree; then it is skipped, or it would make a cycle.</p>' },
      46: { blocks: [bul('There are two possibilities for determining the “shortest” path in a graph'), bul('determine the literal shortest path between a starting vertex and a target vertex (the least number of edges between the two vertices)', 1), bul('simplest approach – a variation of the breadth-first traversal algorithm', 2), bul('look for the cheapest path in a weighted graph', 1), bul('use a minheap or a priority queue storing vertex, weight pairs', 2)],
        explain: '<p>"Shortest" can mean two things:</p><pre class="ex">fewest edges: BFS, remembering where each\n              vertex was reached from\ncheapest:     a minheap of (vertex, weight) pairs,\n              always taking the cheapest so far</pre><p>In the slide 44 network, 1 → 4 → 3 has the fewest edges (2, weight 17), but 1 → 2 → 5 → 3 is cheaper (16).</p>' }
    },
    exam: {
      questions: [
        { type: 'tf', q: 'The adjacency matrix of a directed graph is always symmetric.', answer: false, review: 19,
          why: 'An arrow A → B sets only [A][B]. [B][A] is true only if there is also an arrow B → A.',
          lessons: ['15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 1 },
        { q: 'Which structure does the depth-first traversal of slides 39-40 use?',
          options: ['A stack', 'A queue', 'A minheap', 'A hash table'], answer: 0, review: 38,
          why: 'A stack (LIFO) keeps the path being explored; when the top has no unvisited neighbour, it is popped to go back.',
          lessons: ['03-stacks', '15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 1 },
        { type: 'match', q: 'Match each graph word with its meaning.', review: 5,
          pairs: [['adjacent', 'joined by an edge'], ['path length', 'the number of edges in the path'], ['complete graph', 'has every possible edge'], ['acyclic graph', 'has no cycles']],
          why: 'Slides 5, 6 and 8.',
          lessons: ['15-graphs'], skills: ['concept'], available_after: '15-graphs', level: 1 },
        { q: 'Graph G2 (undirected, vertices 1 to 6) has the edges 1-4, 1-5, 2-3, 2-5, 3-6, 4-5, 5-6. How many true cells does row 5 of its adjacency matrix have?',
          options: ['3', '4', '5', '7'], answer: 1, review: 18,
          why: '5 is in the edges 1-5, 2-5, 4-5 and 5-6, so [5][1], [5][2], [5][4] and [5][6] are true.',
          lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 2 },
        { q: 'How many edges does a complete undirected graph with 8 vertices have?',
          options: ['8', '28', '56', '64'], answer: 1, review: 5,
          why: 'n(n − 1) / 2 = 8 × 7 / 2 = 28: every pair of vertices once.',
          lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 2 },
        { type: 'trace', q: 'BFS runs on G2 (vertices 1 to 6; 1-4, 1-5, 2-3, 2-5, 3-6, 4-5, 5-6) from 1. Fill in the vertex dequeued in each round and the queue afterwards (front → rear).', review: 32,
          cols: ['round', 'dequeued', 'queue after'],
          rows: [['1', '?1', '?4 5'], ['2', '?4', '?5'], ['3', '?5', '?2 6'], ['4', '?2', '?6 3'], ['5', '?6', '?3'], ['6', '?3', '?empty']],
          why: '1 enqueues 4 and 5. 4 finds only marked neighbours. 5 enqueues 2 and 6. 2 enqueues 3. 6 finds 3 already marked. Result: 1, 4, 5, 2, 6, 3.',
          lessons: ['05-queues', '15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 2 },
        { type: 'fill', q: 'Complete the inner loop of iteratorBFS (slide 32).', review: 32,
          code: 'for (int i = 0; i < numVertices; i++)\n{\n  if (adjMatrix[x.intValue()][i] && ___visited[i])\n  {\n    traversalQueue.___(new Integer(i));\n    visited[i] = ___;\n  }\n}',
          answer: ['!', 'enqueue', 'true'],
          why: 'Only an adjacent vertex that is not yet marked is put in the queue, and it is marked right away so it cannot be enqueued twice.',
          lessons: ['15-graphs'], skills: ['design'], available_after: '15-graphs', level: 2 },
        { type: 'write', q: 'Write `public int degree(int index)` for the Graph class of slide 24: return how many vertices are adjacent to the vertex at `index` (count the true cells of its row). Return 0 for an invalid index.', review: 24,
          rows: 7, starter: 'public int degree(int index)\n{\n  \n}',
          checks: [{ re: /if\s*\(\s*!\s*indexIsValid\s*\(\s*index\s*\)\s*\)\s*return\s+0\s*;/, label: 'An invalid index returns 0' },
            { re: /int\s+(\w+)\s*=\s*0\s*;/, label: 'A counter that starts at 0' },
            { re: /for\s*\(\s*int\s+(\w+)\s*=\s*0\s*;\s*\1\s*<\s*numVertices\s*;\s*\1\s*\+\+\s*\)/, label: 'Loops over all the vertices' },
            { re: /if\s*\(\s*adjMatrix\s*\[\s*index\s*\]\s*\[\s*\w+\s*\]\s*\)/, label: 'Tests the cell [index][i]' },
            { re: /return\s+\w+\s*;\s*\}\s*$/, label: 'Returns the count' }],
          solution: 'public int degree(int index)\n{\n  if (!indexIsValid(index)) return 0;\n  int count = 0;\n  for (int i = 0; i < numVertices; i++)\n    if (adjMatrix[index][i]) count++;\n  return count;\n}',
          why: 'Row index of the matrix lists the neighbours of that vertex. The loop costs O(n) even when the vertex has few neighbours.',
          lessons: ['15-graphs'], skills: ['design'], available_after: '15-graphs', level: 2 },
        { q: 'What does iteratorDFS give for G2 (vertices 1 to 6; 1-4, 1-5, 2-3, 2-5, 3-6, 4-5, 5-6) started at 1?',
          options: ['1, 4, 5, 2, 3, 6', '1, 4, 5, 2, 6, 3', '1, 5, 6, 3, 2, 4', '1, 4, 5, 6, 3, 2'], answer: 0, review: 40,
          why: '1 → 4 (first neighbour) → 5 (4\'s first unvisited) → 2 (5\'s first unvisited) → 3 → 6. Then only pops. The second option is the BFS from 1.',
          lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 2 },
        { q: 'Network V: A-B 7, A-C 3, B-C 2, B-D 4, C-D 8, C-E 6, D-E 1. What is the total weight of its minimum spanning tree?',
          options: ['9', '10', '12', '16'], answer: 1, review: 44,
          why: 'From A: A-C 3, then C-B 2, then B-D 4, then D-E 1. Total 10. C-E 6 and C-D 8 are not needed.',
          lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 2 },
        { type: 'trace', q: 'The cheapest-path search of slide 46 runs on network V (A-B 7, A-C 3, B-C 2, B-D 4, C-D 8, C-E 6, D-E 1) from A. Fill in the final cheapest total of each vertex.', review: 46,
          cols: ['vertex', 'A', 'B', 'C', 'D', 'E'],
          rows: [['total', '0', '?5', '?3', '?9', '?9']],
          why: 'C is reached for 3. Through C, B costs 3 + 2 = 5 (cheaper than the direct 7), E 3 + 6 = 9. Through B, D costs 5 + 4 = 9 (cheaper than 3 + 8 = 11). E through D would be 10, so it stays 9.',
          lessons: ['12-heaps', '15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 3 },
        { q: '10 vertices are added to a new Graph (capacity 5). What is the size of its adjacency matrix afterwards?',
          options: ['10 × 10', '15 × 15', '5 × 5', '20 × 20'], answer: 3, review: 26,
          why: 'expandCapacity runs when numVertices + 1 equals the length: adding the 5th vertex (5 → 10) and adding the 10th vertex (10 → 20).',
          lessons: ['15-graphs'], skills: ['trace', 'edge_case'], available_after: '15-graphs', level: 3 },
        { type: 'multi', q: 'In iteratorBFS, each vertex is first reached through one edge. For the BFS of G2 (1-4, 1-5, 2-3, 2-5, 3-6, 4-5, 5-6) from 1, these edges form a spanning tree. Which edges of G2 are <b>not</b> in it?', review: 42,
          options: ['4-5', '3-6', '1-4', '2-5', '5-6'], answer: [0, 1],
          why: '1 reaches 4 and 5; 5 reaches 2 and 6; 2 reaches 3. The tree edges are 1-4, 1-5, 2-5, 5-6, 2-3: 5 edges for 6 vertices. 4-5 and 3-6 join vertices that were already reached.',
          lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 3 },
        { q: 'Is the directed graph 1→2, 2→3, 3→1, 2→4, 4→2 connected (slide 11)?',
          options: ['No: 1 cannot reach 4', 'No: 4 cannot reach 1', 'Yes: every BFS reaches all 4 vertices', 'Only if it is undirected'], answer: 2, review: 41,
          why: 'BFS from 1 gives 1, 2, 3, 4; from 2: 2, 3, 4, 1; from 3: 3, 1, 2, 4; from 4: 4, 2, 3, 1. Every vertex reaches every other one.',
          lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 3 },
        { q: 'In network V (A-B 7, A-C 3, B-C 2, B-D 4, C-D 8, C-E 6, D-E 1), compare the fewest-edges path from A to D with the cheapest one.',
          options: ['Fewest edges: A → C → D (weight 11); cheapest: A → B → D (weight 11)', 'Both are A → C → D, with 2 edges and weight 11', 'Both are A → B → D, with 2 edges and weight 11', 'Fewest edges: A → B → D (weight 11); cheapest: A → C → B → D (weight 9)'], answer: 3, review: 46,
          why: 'The BFS reaches D first from B (B comes before C), so A → B → D with 2 edges, weight 7 + 4 = 11. A → C → D also has 2 edges but weight 11. The cheapest path uses 3 edges: 3 + 2 + 4 = 9.',
          lessons: ['15-graphs'], skills: ['trace'], available_after: '15-graphs', level: 3 }
      ],
      tasks: [
        {
          title: 'Counting the edges',
          task: '<p>Write <code>public int countEdges()</code> for the slides\' <code>Graph</code> class (fields <code>numVertices</code> and <code>boolean[][] adjMatrix</code>; the graph is undirected). Every edge sets two cells, so count only the cells <b>above the diagonal</b>: <code>adjMatrix[i][j]</code> with <code>j &gt; i</code>.</p>',
          starter: 'public int countEdges()\n{\n  \n}',
          checks: [
            { re: /int\s+(\w+)\s*=\s*0\s*;/, label: 'A counter that starts at 0', review: 18 },
            { re: /for\s*\(\s*int\s+(\w+)\s*=\s*0\s*;\s*\1\s*<\s*numVertices\s*;\s*\1\s*\+\+\s*\)/, label: 'Outer loop over the rows', review: 24 },
            { re: /for\s*\(\s*int\s+(\w+)\s*=\s*(\w+)\s*\+\s*1\s*;\s*\1\s*<\s*numVertices\s*;\s*\1\s*\+\+\s*\)/, label: 'Inner loop starts after the diagonal (j = i + 1)', review: 18 },
            { re: /if\s*\(\s*adjMatrix\s*\[\s*\w+\s*\]\s*\[\s*\w+\s*\]\s*\)\s*\w+\s*\+\+\s*;/, label: 'Counts a true cell', review: 25 },
            { re: /return\s+\w+\s*;\s*\}\s*$/, label: 'Returns the count', review: 18 }
          ],
          solution: 'public int countEdges()\n{\n  int count = 0;\n  for (int i = 0; i < numVertices; i++)\n    for (int j = i + 1; j < numVertices; j++)\n      if (adjMatrix[i][j]) count++;\n  return count;\n}'
        },
        {
          title: 'Is the graph connected?',
          task: '<p>Write <code>public boolean isConnected()</code> for the undirected <code>Graph</code> class (assume it is not empty). Following slide 41, walk the iterator <code>iteratorBFS(0)</code> and count the vertices it gives; the graph is connected when the count equals <code>numVertices</code>. (For an undirected graph one BFS is enough.)</p>',
          starter: 'public boolean isConnected()\n{\n  \n}',
          checks: [
            { re: /Iterator\s*<\s*T\s*>\s+(\w+)\s*=\s*iteratorBFS\s*\(\s*0\s*\)\s*;/, label: 'Starts a BFS from vertex 0', review: 31 },
            { re: /int\s+(\w+)\s*=\s*0\s*;/, label: 'A counter that starts at 0', review: 41 },
            { re: /while\s*\(\s*\w+\.hasNext\s*\(\s*\)\s*\)/, label: 'Loops while the iterator has more', review: 41 },
            { re: /\w+\.next\s*\(\s*\)\s*;/, label: 'Moves the iterator with next()', review: 41 },
            { re: /return\s+\w+\s*==\s*numVertices\s*;|return\s+numVertices\s*==\s*\w+\s*;/, label: 'Compares the count with numVertices', review: 41 }
          ],
          solution: 'public boolean isConnected()\n{\n  Iterator<T> it = iteratorBFS(0);\n  int count = 0;\n  while (it.hasNext())\n  {\n    it.next();\n    count++;\n  }\n  return count == numVertices;\n}'
        }
      ]
    }
  });
})();
