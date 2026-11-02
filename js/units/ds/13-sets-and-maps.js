/* Data Structures · Unit 13 Sets and Maps (38 slides): the Set and Map interfaces, HashSet versus TreeSet, HashMap
   versus TreeMap (put, get, remove, keySet, values, entrySet), a domain blocker with a TreeSet, a word counter with
   a TreeMap, and hashing: hash tables, load factor, String.hashCode, equals and hashCode, collisions and chaining.
   The hash drawings copy Java's own HashMap (16 buckets, index = (h ^ h>>>16) & 15), so the printed order is real. */
(function () {
  function L(src, frag, nth) { var ls = src.split('\n'), c = 0; for (var i = 0; i < ls.length; i++) if (ls[i].indexOf(frag) >= 0 && ++c === (nth || 1)) return i + 1; throw new Error('no line ' + frag); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  /* ---------- Java's hashing, copied ---------- */
  function jhash(k) { if (typeof k === 'number') return k | 0; var h = 0; for (var i = 0; i < k.length; i++) h = (Math.imul(31, h) + k.charCodeAt(i)) | 0; return h; }
  function spread(h) { return (h ^ (h >>> 16)); }
  function HT() { this.cap = 16; this.b = []; for (var i = 0; i < 16; i++) this.b.push([]); this.size = 0; }
  HT.prototype.idx = function (k) { return spread(jhash(k)) & (this.cap - 1); };
  HT.prototype.find = function (k) { var c = this.b[this.idx(k)]; for (var i = 0; i < c.length; i++) if (c[i].k === k) return c[i]; return null; };
  HT.prototype.put = function (k, v) { var e = this.find(k); if (e) { var o = e.v; e.v = v; return { old: o, had: true }; } this.b[this.idx(k)].push({ k: k, v: v }); this.size++; return { old: null, had: false }; };
  HT.prototype.remove = function (k) { var c = this.b[this.idx(k)]; for (var i = 0; i < c.length; i++) if (c[i].k === k) { var e = c.splice(i, 1)[0]; this.size--; return e; } return null; };
  HT.prototype.list = function () { var o = []; this.b.forEach(function (c) { c.forEach(function (e) { o.push(e); }); }); return o; };
  HT.prototype.copy = function () { return this.b.map(function (c) { return c.map(function (e) { return { k: e.k, v: e.v }; }); }); };
  function sortedKeys(m) { return Object.keys(m).map(function (k) { return m[k]; }).sort(function (a, b) { return typeof a.k === 'number' ? a.k - b.k : a.k < b.k ? -1 : a.k > b.k ? 1 : 0; }); }

  /* the 16 buckets on the left, the sorted tree (TreeSet / TreeMap) on the right */
  function drawBuckets(b, o) {
    var out = [], y0 = o.y0 || 34, rh = o.rh || 17, cw = o.cw || 50, x0 = o.x0 || 20;
    out.push(T('bt', x0, y0 - 12, o.label, { mono: true, size: 12, bold: true, tone: 'blue' }));
    b.forEach(function (c, i) {
      var hot = o.at === i;
      out.push(B('bk' + i, x0, y0 + i * rh, 26, rh - 2, { title: String(i), mono: true, size: 10, tone: hot ? 'accent' : 'muted', fill: hot ? 'solid' : 'soft' }));
      c.forEach(function (e, j) {
        if (j > 3) return;
        var key = String(e.k), t = j === 3 && c.length > 4 ? '+' + (c.length - 3) : o.text(e), mine = o.hit === key;
        out.push(B('be' + (o.p || '') + key, x0 + 32 + j * (cw + 6), y0 + i * rh, cw, rh - 2, { title: t, mono: true, size: 10, tone: mine ? 'accent' : (o.fresh === key ? 'teal' : 'blue'), fill: mine ? 'solid' : 'soft' }));
        if (j) out.push(A('ba' + (o.p || '') + key, x0 + 32 + j * (cw + 6) - 6, y0 + i * rh + (rh - 2) / 2, x0 + 32 + j * (cw + 6), y0 + i * rh + (rh - 2) / 2, { tone: 'muted' }));
      });
    });
    return out;
  }
  function drawSorted(list, o) {
    var out = [], x0 = o.x0 || 340, y0 = o.y0 || 34, cw = o.cw || 54, cols = o.cols || 4, rh = o.rh || 30;
    out.push(T('st', x0, y0 - 12, o.label, { mono: true, size: 12, bold: true, tone: 'teal' }));
    list.forEach(function (e, i) {
      var key = String(e.k), mine = o.hit === key;
      out.push(B('se' + (o.p || '') + key, x0 + (i % cols) * (cw + 4), y0 + Math.floor(i / cols) * rh, cw, rh - 6, { title: o.text(e), mono: true, size: 10, tone: mine ? 'accent' : (o.fresh === key ? 'teal' : 'blue'), fill: mine ? 'solid' : 'soft' }));
    });
    if (!list.length) out.push(T('se0', x0, y0 + 14, '(empty)', { mono: true, size: 12, tone: 'muted' }));
    return out;
  }

  /* ---------- 1. HashSet and TreeSet side by side (slides 5-10) ---------- */
  var SET0 = 'import java.util.*;\npublic class SetDemo {\n  static Set<Integer> set1 = new HashSet<>();  // hash table\n  static Set<Integer> set2 = new TreeSet<>();  // Red-Black tree\n  static void add(int x) { set1.add(x); set2.add(x); }\n  public static void main(String[] args) {';
  function setOps(s) {
    var out = [], mode = null;
    String(s).split(/[\s,;]+/).filter(Boolean).forEach(function (w) {
      var lw = w.toLowerCase();
      if (/^(add|remove|contains)$/.test(lw)) { mode = lw; return; }
      if (/^(print|size)$/.test(lw)) { mode = null; out.push({ op: lw }); return; }
      if (/^\d{1,3}$/.test(w) && mode) { out.push({ op: mode, x: +w }); if (mode !== 'add') mode = null; }
    });
    return out.slice(0, 16);
  }
  function setLine(o) { return o.op === 'add' ? '    add(' + o.x + ');' : o.op === 'print' ? '    System.out.println(set1 + " " + set2);' : o.op === 'size' ? '    System.out.println(set1.size() + " " + set2.size());' : '    System.out.println(set1.' + o.op + '(' + o.x + ') + " " + set2.' + o.op + '(' + o.x + '));'; }
  function setCode(v) { return SET0 + '\n' + setOps(v.ops).map(setLine).join('\n') + '\n  }\n}'; }
  var S6 = 'add 135 234 197 135 53 25 65, print, size, contains 53, contains 89, remove 135, remove 135, print';
  var sets = {
    id: 'sets', slides: [5, 10], title: 'The same adds in a HashSet and a TreeSet', vb: [600, 340],
    code: setCode,
    inputs: [{ id: 'ops', type: 'text', label: 'operations', value: S6, minlen: 0, maxlen: 120 }],
    inputsLabel: '<code>add 5 9 2</code>, <code>remove 9</code>, <code>contains 2</code>, <code>print</code>, <code>size</code> (numbers 0 to 999).',
    presets: [{ label: 'slides 6 and 7', values: { ops: S6 } }, { label: 'copies are not added', values: { ops: 'add 7 7 7 3 3, print, size' } }, { label: 'same bucket (x % 16)', values: { ops: 'add 5 21 37 100, print' } }, { label: 'remove something missing', values: { ops: 'add 40 10, remove 99, contains 10, print' } }],
    steps: function (v) {
      var code = setCode(v), ops = setOps(v.ops), st = [], ht = new HT(), tree = {}, out = [], m0 = L(code, 'public static void main'), added = 0;
      var snap = function (o) { o.b = ht.copy(); o.tr = sortedKeys(tree); st.push(o); return o; };
      snap({ slide: 5, line: '3-5', cap: 'Two sets get exactly the same operations: <b>set1</b> is a HashSet (a hash table of 16 buckets), <b>set2</b> is a TreeSet (a balanced search tree that keeps the elements sorted).' });
      ops.forEach(function (o, i) {
        var ln = m0 + 1 + i, x = o.x;
        if (o.op === 'add') {
          if (added >= 12 && !ht.find(x)) { snap({ slide: 6, line: ln, cap: 'This drawing keeps at most 12 elements (with more, Java makes the table bigger).' }); return; }
          var r = ht.put(x, x), b = ht.idx(x); if (!r.had) { tree[x] = { k: x, v: x }; added++; }
          snap({ slide: r.had ? 6 : 6, line: ln + ',5', at: b, fresh: r.had ? null : String(x), hit: r.had ? String(x) : null, cap: r.had ? 'add(' + x + '): ' + x + ' is <b>already</b> in both sets, so add returns false and nothing changes. No duplicates!' : 'add(' + x + '): hash code ' + x + ', bucket ' + x + ' % 16 = <b>' + b + '</b> in set1' + (ht.b[b].length > 1 ? ' (it joins ' + ht.b[b].filter(function (e) { return e.k !== x; }).map(function (e) { return e.k; }).join(', ') + ' there: a collision)' : '') + '. In set2 it goes to its sorted place.' });
        } else if (o.op === 'print') {
          var a = '[' + ht.list().map(function (e) { return e.k; }).join(', ') + ']', t = '[' + sortedKeys(tree).map(function (e) { return e.k; }).join(', ') + ']';
          snap({ slide: 7, line: ln, out: a + ' ' + t, cap: 'Printing: set1 lists bucket 0, 1, 2 … so its order looks <b>random</b>: ' + a + '. set2 is <b>sorted</b>: ' + t + '.' });
        } else if (o.op === 'size') snap({ slide: 6, line: ln, out: ht.size + ' ' + ht.size, cap: 'size() = ' + ht.size + ': only different elements are counted.' });
        else if (o.op === 'contains') {
          var f = !!ht.find(x), b2 = ht.idx(x);
          snap({ slide: 9, line: ln, at: b2, hit: f ? String(x) : null, out: f + ' ' + f, cap: 'contains(' + x + '): set1 looks only in bucket ' + b2 + ' (O(1)); set2 walks down the tree (O(log n)). ' + (f ? 'Found: true.' : 'Not there: false.') });
        } else {
          var b3 = ht.idx(x), e = ht.remove(x); if (e) delete tree[x];
          snap({ slide: 10, line: ln, at: b3, out: !!e + ' ' + !!e, cap: 'remove(' + x + '): ' + (e ? 'found in bucket ' + b3 + ' and removed: true.' : 'not in the sets: false, nothing changes.') });
        }
      });
      if (!ops.length) snap({ slide: 6, line: m0, cap: 'Type operations like add 5 9 2, print.' });
      snap({ slide: 10, line: '3-4', cap: 'HashSet: fastest lookup, no order. TreeSet: always sorted (in-order), O(log n) for add, remove and contains.' });
      return st;
    },
    draw: function (k, s) {
      var tx = function (e) { return String(e.k); };
      return drawBuckets(s.b, { label: 'set1: HashSet (bucket = x % 16)', at: s.at, hit: s.hit, fresh: s.fresh, text: tx, cw: 40, rh: 18, y0: 36 }).concat(drawSorted(s.tr, { label: 'set2: TreeSet (sorted)', hit: s.hit, fresh: s.fresh, text: tx, x0: 330, cols: 4, cw: 58 }));
    }
  };

  /* ---------- 2. HashMap and TreeMap side by side (slides 12-19) ---------- */
  var MAP0 = 'import java.util.*;\npublic class MapDemo {\n  static Map<String, Person> map1 = new HashMap<>();\n  static Map<String, Person> map2 = new TreeMap<>();\n  static Person put(String id, String name, String city) {\n    Person p = new Person(name, city);\n    map2.put(id, p);\n    return map1.put(id, p);       // the old value, or null\n  }\n  public static void main(String[] args) {';
  function mapOps(s) {
    var out = [];
    String(s).split(/\s*[,;]\s*/).forEach(function (part) {
      var w = part.trim().split(/\s+/), op = (w[0] || '').toLowerCase();
      if (op === 'put' && /^\d{4}$/.test(w[1] || '') && w[2]) out.push({ op: 'put', k: w[1], name: w[2].replace(/\W/g, '').slice(0, 8) || 'X', city: (w[3] || 'Riyadh').replace(/\W/g, '').slice(0, 8) || 'Riyadh' });
      else if ((op === 'get' || op === 'remove' || op === 'containskey') && /^\d{4}$/.test(w[1] || '')) out.push({ op: op === 'containskey' ? 'containsKey' : op, k: w[1] });
      else if (op === 'print' || op === 'keys' || op === 'values') out.push({ op: op });
    });
    return out.slice(0, 12);
  }
  function mapLine(o) {
    if (o.op === 'put') return '    System.out.println(put("' + o.k + '", "' + o.name + '", "' + o.city + '"));';
    if (o.op === 'print') return '    System.out.println(map1 + "\\n" + map2);';
    if (o.op === 'keys') return '    System.out.println(map1.keySet() + " " + map2.keySet());';
    if (o.op === 'values') return '    System.out.println(map2.values());';
    if (o.op === 'remove') return '    map2.remove("' + o.k + '"); System.out.println(map1.remove("' + o.k + '"));';
    return '    System.out.println(map1.' + o.op + '("' + o.k + '") + " " + map2.' + o.op + '("' + o.k + '"));';
  }
  function mapCode(v) { return MAP0 + '\n' + mapOps(v.ops).map(mapLine).join('\n') + '\n  }\n}'; }
  var M17 = 'put 1234 Ibrahim Khobar, put 7290 Rakan Dammam, put 5501 Aiman Riyadh, put 1001 Ahmed Jeddah, put 2250 Huda Cairo, print, get 5501, put 1234 Aiman Riyadh, keys';
  var maps = {
    id: 'maps', slides: [12, 19], title: 'The same entries in a HashMap and a TreeMap', vb: [600, 340],
    code: mapCode,
    inputs: [{ id: 'ops', type: 'text', label: 'operations', value: M17, minlen: 0, maxlen: 240 }],
    inputsLabel: '<code>put 1234 Name City</code>, <code>get 1234</code>, <code>remove 1234</code>, <code>containsKey 1234</code>, <code>print</code>, <code>keys</code>, <code>values</code> (ids of 4 digits).',
    presets: [{ label: 'slides 17 and 18', values: { ops: M17 } }, { label: 'slide 19: sorted keys', values: { ops: 'put 4321 Munir Dubai, put 0781 Fouad Riyadh, put 1502 Manal Khobar, put 1001 Randa Cairo, put 2250 Noura Riyadh, print' } }, { label: 'get a missing key', values: { ops: 'put 1111 Sara Taif, get 2222, containsKey 1111, remove 2222, print' } }, { label: 'two keys, one value', values: { ops: 'put 3001 Omar Abha, put 3002 Omar Abha, values' } }],
    steps: function (v) {
      var code = mapCode(v), ops = mapOps(v.ops), st = [], ht = new HT(), tree = {}, m0 = L(code, 'public static void main');
      var pStr = function (p) { return p ? '{' + p.name + ',' + p.city + '}' : 'null'; };
      var mStr = function (list) { return '{' + list.map(function (e) { return e.k + '=' + pStr(e.v); }).join(', ') + '}'; };
      var snap = function (o) { o.b = ht.copy(); o.tr = sortedKeys(tree); st.push(o); return o; };
      snap({ slide: 12, line: '3-4', cap: 'A map stores <b>entries</b>: (key, value) pairs. Here the key is an id and the value is a Person. map1 is a HashMap, map2 a TreeMap; both get the same entries.' });
      ops.forEach(function (o, i) {
        var ln = m0 + 1 + i;
        if (o.op === 'put') {
          var p = { name: o.name, city: o.city }, r = ht.put(o.k, p), b = ht.idx(o.k); tree[o.k] = { k: o.k, v: p };
          snap({ slide: r.had ? 18 : 17, line: ln + ',5-8', at: b, fresh: o.k, out: pStr(r.old), cap: 'put("' + o.k + '", ' + pStr(p) + '): "' + o.k + '".hashCode() = ' + jhash(o.k) + ', bucket ' + b + '. ' + (r.had ? 'The key is already there: its value is <b>replaced</b> and put returns the old one, ' + pStr(r.old) + '.' : 'A new entry; put returns null.') });
        } else if (o.op === 'print') {
          snap({ slide: 17, line: ln, out: mStr(ht.list()) + '\n' + mStr(sortedKeys(tree)), cap: 'map1 prints in bucket order (no clear order); map2 (TreeMap) prints the keys <b>sorted</b>.' });
        } else if (o.op === 'keys') {
          var k1 = '[' + ht.list().map(function (e) { return e.k; }).join(', ') + ']', k2 = '[' + sortedKeys(tree).map(function (e) { return e.k; }).join(', ') + ']';
          snap({ slide: 18, line: ln, out: k1 + ' ' + k2, cap: 'keySet() is a Set view of the keys: keys are unique, so a set fits.' });
        } else if (o.op === 'values') {
          snap({ slide: 18, line: ln, out: '[' + sortedKeys(tree).map(function (e) { return pStr(e.v); }).join(', ') + ']', cap: 'values() is a Collection, not a Set: two keys may map to equal values.' });
        } else if (o.op === 'get' || o.op === 'containsKey') {
          var e = ht.find(o.k), b2 = ht.idx(o.k), val = o.op === 'get' ? pStr(e && e.v) : String(!!e);
          snap({ slide: 17, line: ln, at: b2, hit: e ? o.k : null, out: val + ' ' + val, cap: o.op + '("' + o.k + '"): only bucket ' + b2 + ' is searched. ' + (e ? 'Found.' : 'No entry with this key: ' + (o.op === 'get' ? 'null.' : 'false.')) });
        } else {
          var b3 = ht.idx(o.k), e2 = ht.remove(o.k); delete tree[o.k];
          snap({ slide: 14, line: ln, at: b3, out: pStr(e2 && e2.v), cap: 'remove("' + o.k + '"): ' + (e2 ? 'the entry is removed and its value is returned.' : 'no such key: returns null.') });
        }
      });
      if (!ops.length) snap({ slide: 17, line: m0, cap: 'Type operations like put 1234 Ali Khobar, print.' });
      return st;
    },
    draw: function (k, s) {
      var tx = function (e) { return e.k + '→' + e.v.name; };
      return drawBuckets(s.b, { label: 'map1: HashMap (16 buckets)', at: s.at, hit: s.hit, fresh: s.fresh, text: tx, cw: 82, rh: 18, y0: 36, p: 'm' }).concat(drawSorted(s.tr, { label: 'map2: TreeMap (sorted keys)', hit: s.hit, fresh: s.fresh, text: tx, x0: 400, cols: 2, cw: 92, p: 'm' }));
    }
  };

  /* ---------- 3. the domain blocker (slides 21-23) ---------- */
  var DB = 'blockedSet = new TreeSet<>();\nwhile (scan.hasNextLine()) blockedSet.add(scan.nextLine());\nfor (String s: blockedSet) System.out.println(s);\nwhile (true) {\n  System.out.print("\\nEnter a domain (DONE to quit): ");\n  String domain = scan.nextLine();\n  if (domain.equalsIgnoreCase("DONE")) break;\n  if (blocker.isBlocked(domain))       // blockedSet.contains(domain)\n    System.out.println("Domain " + domain + " is blocked.");\n  else\n    System.out.println("Domain " + domain + " is fine.");\n}';
  function list(s, n) { return String(s).split(/[\s,]+/).filter(Boolean).map(function (x) { return x.slice(0, 18); }).slice(0, n); }
  var blocker = {
    id: 'blocker', slides: [21, 23], title: 'Domain blocker: a TreeSet of blocked names', vb: [600, 320],
    code: DB,
    inputs: [{ id: 'f', type: 'text', label: 'blocked.txt', value: 'games.com, chat.net, ads.org, bet.com', minlen: 1, maxlen: 90 }, { id: 'q', type: 'text', label: 'user types', value: 'news.com, ads.org, DONE', minlen: 1, maxlen: 60 }],
    inputsLabel: 'The lines of the file, then what the user types (DONE ends the loop).',
    presets: [{ label: 'blocked and fine', values: { f: 'games.com, chat.net, ads.org, bet.com', q: 'news.com, ads.org, DONE' } }, { label: 'capital letters', values: { f: 'games.com, chat.net, ads.org, bet.com', q: 'Games.com, games.com, done' } }, { label: 'the same line twice in the file', values: { f: 'bet.com, ads.org, bet.com', q: 'bet.com, DONE' } }],
    steps: function (v) {
      var file = list(v.f, 8), qs = list(v.q, 5), st = [], set = {}, out = [];
      var snap = function (o) { o.tr = Object.keys(set).sort().map(function (k) { return { k: k, v: k }; }); st.push(o); return o; };
      snap({ slide: 21, line: 1, cap: 'The blocker keeps the blocked domains in a <b>TreeSet&lt;String&gt;</b>: no duplicates, sorted, and contains is fast.' });
      file.forEach(function (d) { var had = !!set[d]; set[d] = 1; snap({ slide: 22, line: 2, fresh: d, cap: 'Read the line "' + d + '" and add it.' + (had ? ' It is already in the set: nothing changes.' : '') }); });
      var sorted = Object.keys(set).sort();
      snap({ slide: 22, line: 3, out: sorted.join('\n'), cap: 'printBlockedDomains: the for-each loop visits the TreeSet in <b>sorted</b> order.' });
      for (var i = 0; i < qs.length; i++) {
        var d = qs[i];
        snap({ slide: 23, line: '5-6', out: '\nEnter a domain (DONE to quit): ' + d, cap: 'The user types "' + d + '".' });
        if (d.toUpperCase() === 'DONE') { snap({ slide: 23, line: 7, cap: '"' + d + '".equalsIgnoreCase("DONE") is true (any capitals): <b>break</b> ends the loop.' }); break; }
        var b = !!set[d];
        snap({ slide: 23, line: b ? '8-9' : '8,10-11', hit: b ? d : null, out: 'Domain ' + d + ' is ' + (b ? 'blocked.' : 'fine.'), cap: 'blockedSet.contains("' + d + '") is ' + b + '.' + (!b && set[d.toLowerCase()] ? ' contains is <b>case-sensitive</b>: "' + d + '" is not "' + d.toLowerCase() + '".' : '') });
      }
      return st;
    },
    draw: function (k, s) { return drawSorted(s.tr, { label: 'blockedSet: TreeSet<String> (sorted)', hit: s.hit, fresh: s.fresh, text: function (e) { return e.k; }, x0: 30, y0: 40, cols: 3, cw: 170, rh: 36 }); }
  };

  /* ---------- 4. the word counter (slides 24-26) ---------- */
  var WC = 'Scanner scan = new Scanner(inputFile).useDelimiter("[^a-zA-Z]+");\nwhile (scan.hasNext()) {\n  String word = scan.next().toLowerCase();\n  if (countWords.get(word) == null) { countWords.put(word, 1); }\n  else {\n    Integer count = countWords.get(word);\n    countWords.put(word, count+1);\n  }\n}\nfor (Map.Entry<String, Integer> entry: entries) {\n  System.out.println(entry);\n}';
  var words = {
    id: 'words', slides: [24, 26], title: 'Word counter: a TreeMap from words to counts', vb: [600, 320],
    code: WC,
    inputs: [{ id: 'x', type: 'text', label: 'input.txt', value: 'The cat saw the dog. The dog ran!', minlen: 1, maxlen: 90 }],
    presets: [{ label: 'a short story', values: { x: 'The cat saw the dog. The dog ran!' } }, { label: 'digits and quotes split words', values: { x: "It's 2 o'clock, it is." } }, { label: 'capital letters', values: { x: 'Map MAP map mAp' } }],
    steps: function (v) {
      var ws = String(v.x).split(/[^a-zA-Z]+/).filter(Boolean).slice(0, 18), st = [], m = {};
      var snap = function (o) { o.tr = Object.keys(m).sort().map(function (k) { return { k: k, v: m[k] }; }); st.push(o); return o; };
      snap({ slide: 24, line: 1, cap: 'The Scanner uses the delimiter <code>[^a-zA-Z]+</code>: anything that is not a letter separates words. The words are: ' + (ws.length ? ws.join(', ') : '(none)') + '.' });
      ws.forEach(function (w0) {
        var w = w0.toLowerCase(), had = m[w] != null;
        if (!had) { m[w] = 1; snap({ slide: 25, line: '3-4', fresh: w, cap: '"' + w0 + '" → "' + w + '". get("' + w + '") is null: the first time, so put("' + w + '", 1).' }); }
        else { m[w]++; snap({ slide: 25, line: '3,6-7', hit: w, cap: '"' + w0 + '" → "' + w + '". get gives ' + (m[w] - 1) + ', so put("' + w + '", ' + m[w] + '): the old count is replaced.' }); }
      });
      snap({ slide: 26, line: '10-12', out: Object.keys(m).sort().map(function (k) { return k + '=' + m[k]; }).join('\n'), cap: 'The entrySet of a TreeMap comes in <b>sorted</b> key order; each entry prints as key=value.' });
      return st;
    },
    draw: function (k, s) { return drawSorted(s.tr, { label: 'countWords: TreeMap<String, Integer>', hit: s.hit, fresh: s.fresh, text: function (e) { return e.k + '=' + e.v; }, x0: 30, y0: 40, cols: 4, cw: 128, rh: 36 }); }
  };

  /* ---------- 5. first-letter hashing (slides 29-32) ---------- */
  var H26 = 'hash table: an array of 26 cells, one for each letter\nindex = first letter − \'A\'     (\'A\' → 0, \'B\' → 1 … \'Z\' → 25)\nput the name at table[index]          O(1)\ntwo names, same index → collision\nload factor = filled cells / 26';
  var hash26 = {
    id: 'hash26', slides: [29, 32], title: 'A simple hash table: the first letter is the index', lang: 'text', vb: [600, 330],
    code: H26,
    inputs: [{ id: 'n', type: 'text', label: 'names', value: 'Ann, Doug, Elizabeth, Hal, Mary, Tim, Walter, Young, Andrew', minlen: 1, maxlen: 100 }],
    presets: [{ label: 'slide 30', values: { n: 'Ann, Doug, Elizabeth, Hal, Mary, Tim, Walter, Young, Andrew' } }, { label: 'many collisions', values: { n: 'Sara, Sami, Saud, Salem, Omar' } }, { label: 'small letters too', values: { n: 'zaid, Zaid, 7eleven' } }],
    steps: function (v) {
      var names = String(v.n).split(/[\s,]+/).filter(Boolean).slice(0, 12), st = [], tab = [];
      for (var i = 0; i < 26; i++) tab.push([]);
      var snap = function (o) { o.tab = tab.map(function (c) { return c.slice(); }); st.push(o); return o; };
      snap({ slide: 29, line: 1, cap: 'A <b>hash function</b> turns a key into an array index. Here it is very simple: the index is the position of the first letter in the alphabet.' });
      names.forEach(function (nm) {
        var c = nm[0].toUpperCase(), ix = c.charCodeAt(0) - 65;
        if (ix < 0 || ix > 25) { snap({ slide: 30, line: 2, cap: '"' + nm + '" does not start with a letter: this hash function has no cell for it. A real hash function must work for every key.' }); return; }
        var col = tab[ix].length > 0; tab[ix].push(nm);
        snap({ slide: 30, line: col ? '2,4' : '2-3', at: ix, bad: col, cap: '"' + nm + '": \'' + c + '\' → index <b>' + ix + '</b>. ' + (col ? '<b>Collision</b>: ' + tab[ix].slice(0, -1).join(', ') + ' is already there. Where should ' + nm + ' go?' : 'One step, no search: O(1).') + (nm[0] !== c ? ' (A small letter is changed to a capital first.)' : '') });
      });
      var filled = tab.filter(function (c) { return c.length; }).length;
      snap({ slide: 31, line: 5, cap: 'Load factor = ' + filled + ' / 26 = <b>' + (filled / 26).toFixed(2) + '</b>. With load factor 0.75, a table is made bigger when it is 75% full (here: at 20 filled cells).' });
      snap({ slide: 32, line: '1-2', cap: 'The goal of a hashing function: give each key its own index. First letters are a poor choice (many names start with the same letter); Java uses hashCode, next.' });
      return st;
    },
    draw: function (k, s) {
      var out = [];
      s.tab.forEach(function (c, i) {
        var col = i < 13 ? 0 : 1, r = i % 13, x = 20 + col * 290, y = 22 + r * 23, hot = s.at === i;
        out.push(B('ix' + i, x, y, 46, 20, { title: i + ' ' + String.fromCharCode(65 + i), mono: true, size: 10, tone: hot ? 'accent' : 'muted', fill: hot ? 'solid' : 'soft' }));
        out.push(B('cell' + i, x + 50, y, 220, 20, { title: c.join(', '), mono: true, size: 10, tone: hot && s.bad ? 'red' : c.length > 1 ? 'red' : c.length ? 'blue' : 'muted', fill: 'soft', align: 'left' }));
      });
      return out;
    }
  };

  /* ---------- 6. String.hashCode and the index (slides 33-37) ---------- */
  function hcCode(v) { return 'String s = "' + String(v.s).slice(0, 12) + '";\nint h = 0;\nfor (int i = 0; i < s.length(); i++)\n  h = 31 * h + s.charAt(i);         // the same as s.hashCode()\nint index = Math.abs(h % N);         // N = ' + Math.trunc(v.n) + ': 0 to N-1\nSystem.out.println(h + " " + index);'; }
  var hashcode = {
    id: 'hashcode', slides: [33, 37], title: 'String.hashCode, one character at a time', vb: [600, 330],
    code: hcCode,
    inputs: [{ id: 's', type: 'text', label: 'string', value: 'Ahmed', minlen: 1, maxlen: 12 }, { id: 'n', label: 'table size N', value: 11, min: 2, max: 50 }],
    presets: [{ label: '"Ahmed" (slide 34)', values: { s: 'Ahmed', n: 11 } }, { label: '"Aa"', values: { s: 'Aa', n: 11 } }, { label: '"BB": same hash as "Aa"', values: { s: 'BB', n: 11 } }, { label: 'long: int overflow', values: { s: 'Information', n: 16 } }],
    steps: function (v) {
      var s = String(v.s).slice(0, 12), N = Math.trunc(v.n), st = [], rows = [], h = 0;
      var snap = function (o) { o.rows = rows.slice(); o.h = h; st.push(o); return o; };
      snap({ slide: 33, line: '1-2', cap: 'Every Java object has <b>hashCode()</b>. String overrides it: the hash code is built from the character codes, so equal strings always get the same number.' });
      for (var i = 0; i < s.length; i++) {
        var c = s.charCodeAt(i), before = h, exact = 31 * before + c; h = (Math.imul(31, before) + c) | 0;
        rows.push({ i: i, ch: s[i], c: c, h: h, ov: exact !== h });
        snap({ slide: 34, line: '3-4', at: i, cap: 'i = ' + i + ': \'' + s[i] + '\' has code ' + c + '. h = 31 × ' + before + ' + ' + c + ' = <b>' + h + '</b>' + (exact !== h ? ' (too big for an int: it <b>overflows</b> and wraps around)' : '') + '.' });
      }
      var ix = Math.abs(h % N);
      snap({ slide: 34, line: 4, cap: '"' + s + '".hashCode() = <b>' + h + '</b>.' + (s === 'Ahmed' ? ' The same number as on slide 34.' : '') + (s === 'Aa' || s === 'BB' ? ' "Aa" and "BB" both give 2112: two <b>unequal</b> strings with the same hash code (allowed!).' : '') });
      snap({ slide: 37, line: '5-6', out: h + ' ' + ix, ix: ix, cap: 'index = Math.abs(' + h + ' % ' + N + ') = <b>' + ix + '</b>. The remainder keeps the index between 0 and N − 1; Math.abs fixes negative hash codes.' });
      return st;
    },
    draw: function (k, s) {
      var out = [T('hd', 30, 26, 'i   char   code   h = 31·h + code', { mono: true, size: 12, bold: true, tone: 'muted' })];
      s.rows.forEach(function (r, j) { out.push(B('r' + j, 24, 36 + j * 22, 380, 20, { title: r.i + '    ' + r.ch + '     ' + String(r.c).padStart(4) + '    ' + r.h, mono: true, size: 11, tone: s.at === j ? 'accent' : r.ov ? 'red' : 'blue', fill: s.at === j ? 'solid' : 'soft', align: 'left' })); });
      out.push(B('hres', 430, 60, 150, 50, { title: 'hashCode', lines: [String(s.h)], mono: true, size: 12, tone: 'teal' }));
      if (s.ix != null) out.push(B('ires', 430, 140, 150, 50, { title: 'index', lines: [String(s.ix)], mono: true, size: 12, tone: 'accent' }));
      return out;
    }
  };

  /* ---------- 7. chaining (slide 38) ---------- */
  var CH = '// table: an array of N linked lists of entries\nint index = Math.abs(key.hashCode() % N);    // 0 to N-1\ntable[index].add(new Entry(key, value));     // put: add to that list\n// get(key): search only the list at index\nfor (Entry e : table[index])\n  if (e.key.equals(key)) return e.value;\nreturn null;';
  var S38 = 'Jack Williams 779-64-52, Sam Taylor 486-25-13, Sandra Miller 254-63-56, Mattew Davis 183-74-90, Andrew Wilson 576-31-87';
  function pairs(s) { return String(s).split(',').map(function (p) { var w = p.trim().split(/\s+/), val = /\d/.test(w[w.length - 1] || '') && w.length > 1 ? w.pop() : '-'; return { k: w.join(' ').slice(0, 16), v: val.slice(0, 10) }; }).filter(function (e) { return e.k; }).slice(0, 8); }
  var chain = {
    id: 'chain', slides: [38, 38], title: 'Chaining: each cell holds a linked list', vb: [600, 340],
    code: CH,
    inputs: [{ id: 'kv', type: 'text', label: 'entries (name value)', value: S38, minlen: 1, maxlen: 200 }, { id: 'n', label: 'N', value: 11, min: 3, max: 13 }, { id: 'f', type: 'text', label: 'get', value: 'Sandra Miller', minlen: 0, maxlen: 16 }],
    presets: [{ label: 'slide 38 names, N = 11', values: { kv: S38, n: 11, f: 'Sandra Miller' } }, { label: 'N = 14: two collisions', values: { kv: S38, n: 14, f: 'Andrew Wilson' } }, { label: 'N = 3: long chains', values: { kv: S38, n: 3, f: 'Mattew Davis' } }, { label: 'get a missing key', values: { kv: S38, n: 11, f: 'Sam Miller' } }],
    steps: function (v) {
      var es = pairs(v.kv), N = Math.trunc(v.n), st = [], tab = [], f = String(v.f).trim();
      for (var i = 0; i < N; i++) tab.push([]);
      var snap = function (o) { o.tab = tab.map(function (c) { return c.slice(); }); o.N = N; st.push(o); return o; };
      snap({ slide: 38, line: 1, cap: 'Chaining: each of the ' + N + ' cells holds a <b>linked list</b> of entries, so many keys can share one index.' });
      es.forEach(function (e) {
        var h = jhash(e.k), ix = Math.abs(h % N), col = tab[ix].length > 0; tab[ix].push(e);
        snap({ slide: 38, line: '2-3', at: ix, fresh: e.k, cap: '"' + e.k + '".hashCode() = ' + h + ', index = |' + h + ' % ' + N + '| = <b>' + ix + '</b>. ' + (col ? '<b>Collision</b> with ' + tab[ix].slice(0, -1).map(function (x) { return x.k; }).join(', ') + ': the entry is added to the same list.' : 'The list there was empty.') });
      });
      if (f) {
        var ix2 = Math.abs(jhash(f) % N), found = null;
        snap({ slide: 38, line: '4-5', at: ix2, cap: 'get("' + f + '"): index ' + ix2 + '. Only that one list is searched.' });
        for (var j = 0; j < tab[ix2].length; j++) {
          var e2 = tab[ix2][j], eq = e2.k === f;
          snap({ slide: 38, line: 6, at: ix2, hit: e2.k, cap: '"' + e2.k + '".equals("' + f + '")? ' + (eq ? 'Yes: return <b>' + e2.v + '</b>.' : 'No, next in the list.') });
          if (eq) { found = e2; break; }
        }
        if (!found) snap({ slide: 38, line: 7, at: ix2, cap: 'The list ended: "' + f + '" is not in the table, return null. A short list keeps this fast: on average O(1).' });
      }
      return st;
    },
    draw: function (k, s) {
      var out = [], rh = Math.min(24, 300 / s.N), y0 = 20;
      s.tab.forEach(function (c, i) {
        var hot = s.at === i, y = y0 + i * rh;
        out.push(B('ci' + i, 20, y, 30, rh - 3, { title: String(i), mono: true, size: 10, tone: hot ? 'accent' : 'muted', fill: hot ? 'solid' : 'soft' }));
        c.forEach(function (e, j) {
          if (j > 2) return;
          var x = 80 + j * 172, t = j === 2 && c.length > 3 ? '+' + (c.length - 2) + ' more' : e.k + '  ' + e.v;
          out.push(B('ce' + e.k.replace(/\W/g, ''), x, y, 160, rh - 3, { title: t, mono: true, size: 10, tone: s.hit === e.k ? 'accent' : s.fresh === e.k ? 'teal' : c.length > 1 ? 'teal' : 'blue', fill: s.hit === e.k ? 'solid' : 'soft' }));
          out.push(A('ca' + e.k.replace(/\W/g, ''), j ? x - 12 : 50, y + (rh - 3) / 2, x, y + (rh - 3) / 2, { tone: c.length > 1 ? 'teal' : 'muted' }));
        });
      });
      return out;
    }
  };

  var code = function (t) { return { type: 'code', lang: 'java', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; }, bh = function (h, l) { return { type: 'bullet', html: h, level: l || 0 }; };
  var OUT = ['Set Collection in Java', 'Maps in Java', 'Using Sets and Maps to Solve Problems', 'The Hashing Technique'];
  function outline(on, ex) { return { blocks: OUT.map(function (t, i) { return { type: 'bullet', html: i === on ? '<b>' + t + '</b>' : t }; }), explain: ex }; }

  addUnit({
    course: 'ds', lesson: '13-sets-and-maps',
    blurb: 'Sets (no duplicates) and maps (key → value) in Java, HashSet/HashMap versus TreeSet/TreeMap, two programs that use them, and how hashing works.',
    parts: [
      { title: 'Sets in Java', from: 1, to: 10 },
      { title: 'Maps in Java', from: 11, to: 19 },
      { title: 'Using sets and maps', from: 20, to: 27 },
      { title: 'Hashing', from: 28, to: 38 }
    ],
    visuals: [sets, maps, blocker, words, hash26, hashcode, chain],
    slides: {
      1: { cover: true, explain: '<p>A <b>set</b> is a collection with <b>no duplicates</b>, like a set in math. A <b>map</b> is like a dictionary: it links each <b>key</b> to a <b>value</b>.</p><pre class="ex">set: {Riyadh, Jeddah, Dammam}\nmap: "1234" → Ibrahim, "7290" → Rakan</pre><p>Both are made for one job: finding things fast.</p>' },
      2: outline(-1, '<p>The plan: sets in Java, maps in Java, two programs that use them, and the hashing technique behind HashSet and HashMap.</p>'),
      3: { explain: '<p>The Java collection {{hierarchy|تسلسل هرمي}}: dark boxes are interfaces, green boxes are classes.</p><pre class="ex">Set → HashSet, LinkedHashSet, TreeSet (via SortedSet)\nMap → HashMap, LinkedHashMap, TreeMap (via SortedMap)</pre><p>Set is a Collection (it extends it), but <b>Map is not</b>: a map holds pairs, so it has its own interface.</p><p class="watch">Solid arrows mean extends, dashed arrows mean implements.</p>' },
      4: { blocks: [bul('A set is a collection of elements with no duplicates.'), bul('Like the mathematical definition of a set.', 1), bul('The primary purpose is to determine whether a particular element is a member of a set.'), bul('Must have a fast way to lookup for an element in the set.', 1), bul('Other collections, such as lists, can also lookup an element.'), bul('However, it is more efficient to use sets for fast lookup.', 1)],
        explain: '<p>The main question a set answers: "is this element <b>in</b> the set?"</p><pre class="ex">blocked sites: is "ads.org" in it?\nvisited cities: did we see Jeddah?</pre><p>A list can answer too, but it checks the elements one by one (O(n)). A set is built to answer fast: O(1) for a HashSet, O(log n) for a TreeSet.</p>' },
      5: { text: false, blocks: [code('public interface Set<E> extends Collection<E>')], explain: '<p>The main Set methods:</p><pre class="ex">add(e)       true if added, false if already there\nremove(e)    true if it was there\ncontains(e)  is it in the set?\naddAll / removeAll / retainAll   whole collections</pre><p>add returns a <b>boolean</b>: false tells you it was a duplicate and nothing changed.</p><p class="watch">retainAll keeps only the common elements: it is the {{intersection|التقاطع}} of two sets.</p>' },
      6: { blocks: [code('// set1 is a HashSet object that does not add duplicate elements\nSet<Integer> set1 = new HashSet<>();\nset1.add(135); set1.add(234); set1.add(197);\nset1.add(135); set1.add(53); set1.add(25); set1.add(65);\n// Elements can appear in any order in set1 (HashSet object)\nSystem.out.println("set1 elements: " + set1);\nSystem.out.println("set1 size = " + set1.size());\n// Efficient searching for elements\nSystem.out.println("set1 contains 53? " + set1.contains(53));\nSystem.out.println("set1 contains 89? " + set1.contains(89));\n// Efficient removing of elements\nSystem.out.println("set1 removes 135? " + set1.remove(135));\nSystem.out.println("set1 removes 135? " + set1.remove(135));\nSystem.out.println("set1 elements after removing 135: " + set1);')],
        explain: '<p>135 is added twice, but the set keeps one: size is <b>6</b>, not 7.</p><pre class="ex">set1 elements: [65, 197, 53, 135, 25, 234]\ncontains 53? true    contains 89? false\nremoves 135? true    removes 135? false</pre><p>The second remove returns false: 135 is already gone.</p><p class="watch">The HashSet order is not the adding order and not sorted: it comes from the hash table (the drawing shows why).</p>' },
      7: { blocks: [code('// set2 is a TreeSet object that does not add duplicate elements\nSet<Integer> set2 = new TreeSet<>();\nset2.add(135); set2.add(234); set2.add(197);\nset2.add(135); set2.add(53); set2.add(25); set2.add(65);\n// Elements appear sorted in set2 (TreeSet object)\nSystem.out.println("set2 elements: " + set2);\nSystem.out.println("set2 size = " + set2.size());\n// Efficient searching for elements\nSystem.out.println("set2 contains 53? " + set2.contains(53));\nSystem.out.println("set2 contains 89? " + set2.contains(89));\n// Efficient removing of elements\nSystem.out.println("set2 removes 135? " + set2.remove(135));\nSystem.out.println("set2 removes 135? " + set2.remove(135));\nSystem.out.println("set2 elements after removing 135: " + set2);')],
        explain: '<p>The same code with a <b>TreeSet</b>. Everything is the same except the order:</p><pre class="ex">set2 elements: [25, 53, 65, 135, 197, 234]</pre><p>A TreeSet is a balanced binary search tree, and printing walks it in-order, so the elements always come out <b>sorted</b>.</p><p class="watch">The variable type is still <code>Set&lt;Integer&gt;</code>: only the <code>new</code> part decides HashSet or TreeSet.</p>' },
      8: { blocks: [code('// set3 is a HashSet object\nSet<Integer> set3 = new HashSet<>();\nset3.add(34); set3.add(53); set3.add(65); set3.add(135);\nSystem.out.println("set3 elements: " + set3);\n// Testing the equality of two sets\nSystem.out.println("set1 equals set2? " + set1.equals(set2));\nSystem.out.println("set1 equals set3? " + set1.equals(set3));\n// Adding, Retaining, and Removing all the elements of set3\nset1.addAll(set3);\nSystem.out.println("set1 after adding all set3: " + set1);\nset2.retainAll(set3);\nSystem.out.println("set2 after retaining all set3: " + set2);\nset1.removeAll(set3);\nSystem.out.println("set1 after removing all set3: " + set1);')],
        explain: '<p>Two sets are <b>equal</b> when they hold the same elements, even if one is a HashSet and the other a TreeSet: set1.equals(set2) is true.</p><pre class="ex">addAll    union        set1 ∪ set3\nretainAll intersection set2 ∩ set3 → [53, 65]\nremoveAll difference   set1 − set3</pre><p class="watch">These methods <b>change</b> the set they are called on (set1, set2); set3 stays the same.</p>' },
      9: { blocks: [bul('HashSet and TreeSet are classes that implement Set'), bul('HashSet is implemented using the hashing technique'), bul('Elements are mapped and stored in a hash table', 1), bul('The HashSet class implements the hashCode method that computes and returns the hash value of a given object', 1), bul('The hashCode method is very efficient: time complexity is O(1)', 1), bul('TreeSet is implemented as a balanced binary search tree'), bul('The in-order traversal produces an ordered set of elements', 1), bul('The basic operations are implemented in O(log n) efficiency', 1)],
        explain: '<p>Two ways to build a set:</p><pre class="ex">HashSet  hash table      add/contains/remove O(1)\nTreeSet  balanced BST    add/contains/remove O(log n)</pre><p>A HashSet computes the place of an element from its hash code, so it goes straight there. A TreeSet walks down a balanced tree, like the BSTs of unit 11.</p><p class="watch">hashCode belongs to the element’s class (Integer, String …), not really to HashSet: the set calls it.</p>' },
      10: { explain: '<p>Which one to use?</p><pre class="ex">need the fastest lookup, order does not matter → HashSet\nneed the elements in order (sorted)           → TreeSet</pre><p>The tree inside a TreeSet is a <b>Red-Black tree</b>: a balanced BST like the AVL tree, so it never becomes a long, thin list.</p>' },
      11: outline(1, '<p>Next: maps, which link keys to values.</p>'),
      12: { blocks: [bul('A map is an abstract data type that establishes an efficient mapping between keys and values.'), bul('A map stores key-value pairs (k, v), which are called entries.'), bul('The keys of a map must be unique.'), bul('Each key maps to only one value. However, multiple keys could map to the same value.'), bul('For example, a person id is used as a key mapped to a person object that contains name and address.')],
        explain: '<p>A map stores <b>entries</b>: (key, value) pairs.</p><pre class="ex">"1234" → {Ibrahim, Khobar}\n"7290" → {Rakan, Dammam}</pre><p>Keys are <b>unique</b> (like student ids). Values may repeat: two ids could point to the same person data.</p><p class="watch">Putting a key that already exists does not add a second entry: it replaces the old value.</p>' },
      13: { text: false, blocks: [bul('A map entry is a (key, value) pair, as shown below:')], explain: '<p>The picture: you search with the <b>key</b> (an id) and get the mapped <b>value</b> (name and address).</p><pre class="ex">key 20151234 → Ibrahim, Khobar\nkey 20137290 → Rakan, Dammam</pre><p>Like a real dictionary: you look up the word (key) to find its meaning (value).</p>' },
      14: { text: false, blocks: [code('public interface Map<K, V>')], explain: '<p>Map has two type parameters: <b>K</b> for keys, <b>V</b> for values.</p><pre class="ex">put(k, v)   add or replace; returns the old value or null\nget(k)      the value, or null\nremove(k)   remove; returns the value or null\nputIfAbsent(k, v)  add only if k is new</pre><p><code>Map.Entry&lt;K, V&gt;</code> is a nested interface for one (key, value) pair.</p>' },
      15: { text: false, explain: '<p>More Map methods:</p><pre class="ex">containsKey(k), containsValue(v)\nkeySet()    a Set of the keys\nvalues()    a Collection of the values\nentrySet()  a Set of Map.Entry pairs</pre><p>keySet is a <b>Set</b> (keys are unique), but values is only a <b>Collection</b> (values may repeat).</p><p class="watch">containsKey is fast (it uses the key); containsValue must look at every entry.</p>' },
      16: { blocks: [code('public class Person {\n  String name;\n  String address;\n  // Other data fields can be added as needed\n  // Constructs a Person object\n  public Person(String name, String address) {\n    this.name = name;\n    this.address = address;\n  }\n  // Returns a String representation of a Person object\n  public String toString() {\n    return "{" + name + "," + address + "}";\n  }\n}')],
        explain: '<p>The values of the next example are <b>Person</b> objects with a name and an address.</p><pre class="ex">new Person("Ibrahim", "Khobar")\nprints as {Ibrahim,Khobar}</pre><p>toString decides how a Person looks when a map is printed.</p>' },
      17: { blocks: [code('// map1 is a HashMap object that maps a String id to a Person object\nMap<String, Person> map1 = new HashMap<>();\n// Adding key-value entries to map1\nmap1.put("1234", new Person("Ibrahim", "Khobar"));\nmap1.put("7290", new Person("Rakan", "Dammam"));\nmap1.put("5501", new Person("Aiman", "Riyadh"));\nmap1.put("1001", new Person("Ahmed", "Jeddah"));\nmap1.put("2250", new Person("Huda", "Cairo"));\n// Printing map1\nSystem.out.println("map1 = " + map1);\n// Getting Person "5501"\nPerson p1 = map1.get("5501");\nSystem.out.println("Person 5501 is " + p1);')],
        explain: '<p>A HashMap from id to Person. Printing a map shows <code>{key=value, …}</code>:</p><pre class="ex">map1 = {1234={Ibrahim,Khobar}, 1001={Ahmed,Jeddah},\n        5501={Aiman,Riyadh}, 7290={Rakan,Dammam},\n        2250={Huda,Cairo}}\nPerson 5501 is {Aiman,Riyadh}</pre><p>get uses the key to jump to the entry: no loop over all persons.</p><p class="watch">The keys are Strings ("1234"), not ints: "0781" keeps its 0.</p>' },
      18: { blocks: [code('// Changing the mapping of "1234"\nPerson p2 = map1.put("1234", p1);\nSystem.out.println("Changing 1234 from " + p2 + " to " + p1);\nSystem.out.println("map1 = " + map1);\n// keys of map1\nSet<String> keys = map1.keySet();\nSystem.out.println("keys of map1 = " + keys);\n// values of map1\nCollection<Person> values = map1.values();\nSystem.out.println("values of map1 = " + values);\n// map2 is a TreeMap object that maps a String id to a Person object\nMap<String, Person> map2 = new TreeMap<>();')],
        explain: '<p><code>put("1234", p1)</code> on an existing key <b>replaces</b> the value and returns the old one:</p><pre class="ex">Changing 1234 from {Ibrahim,Khobar} to {Aiman,Riyadh}</pre><p>Now "1234" and "5501" map to the same Person object: two keys, one value, which is allowed.</p><p class="watch">keySet() and values() are <b>views</b> of the map, not copies: they follow later changes to the map.</p>' },
      19: { blocks: [code('// Adding key-value entries to map2\nmap2.put("4321", new Person("Munir", "Dubai"));\nmap2.put("0781", new Person("Fouad", "Riyadh"));\nmap2.put("1502", new Person("Manal", "Khobar"));\nmap2.put("1001", new Person("Randa", "Cairo"));\nmap2.put("2250", new Person("Noura", "Riyadh"));\n// Printing map2: the keys are sorted in a TreeMap object\nSystem.out.println("\\nmap2 = " + map2);\n// Adding All map1 entries to map2\nmap2.putAll(map1);\n// Printing map2 after adding all map1 entries to map2\nSet<Map.Entry<String, Person>> entries = map2.entrySet();\nfor (Map.Entry<String, Person> entry : entries)\n  System.out.println(entry);')],
        explain: '<p>A <b>TreeMap</b> keeps its keys sorted: 0781, 1001, 1502, 2250, 4321.</p><pre class="ex">map2.putAll(map1): every entry of map1 is put\n"1001" and "2250" exist: their values are replaced</pre><p>entrySet() gives the entries (in key order for a TreeMap); each prints as <code>key=value</code>.</p><p class="watch">Strings sort by characters, not by number: "0781" &lt; "1001" &lt; "1234".</p>' },
      20: outline(2, '<p>Next: two small programs that use a set and a map.</p>'),
      21: { blocks: [bul('Write a domain blocker class that reads a list of blocked domains from an input text file.'), bul('The domain blocker class should store the list of blocked domains in a set.'), bul('A TreeSet object of String elements can be used to store all the blocked domains in a sorted order.'), bul('Ask the user to enter a domain name and check whether the domain is blocked.')],
        explain: '<p>The task: block some web sites. The question "is this domain blocked?" is a <b>membership</b> question, the main job of a set.</p><pre class="ex">blocked.txt → TreeSet&lt;String&gt;\nuser types a domain → contains?</pre><p>A TreeSet also keeps them sorted, which helps when we print the list.</p>' },
      22: { blocks: [code('public class DomainBlocker {     // A URL domain blocker\n  private TreeSet<String> blockedSet;\n  // Constructor reads the blocked domain names from a file\n  public DomainBlocker(String filename) throws IOException {\n    blockedSet = new TreeSet<>();\n    Scanner scan = new Scanner(new File(filename));\n    while (scan.hasNextLine()) blockedSet.add(scan.nextLine());\n  }\n  // This method prints all blocked domains on the screen\n  public void printBlockedDomains() {\n    for (String s: blockedSet) System.out.println(s);\n  }\n  public boolean isBlocked(String domain) {\n    return blockedSet.contains(domain);\n  }')],
        explain: '<p>The constructor reads the file line by line and adds each line to the set. A line that appears twice is kept once.</p><pre class="ex">isBlocked(d) → blockedSet.contains(d)   O(log n)</pre><p>The for-each loop prints the set in sorted order.</p><p class="watch">The constructor <code>throws IOException</code>: if the file is missing, the caller must handle it.</p>' },
      23: { blocks: [code('public static void main(String[] args) throws IOException {\n  DomainBlocker blocker = new DomainBlocker("src/setsmaps/blocked.txt");\n  blocker.printBlockedDomains();\n  while (true) {\n    System.out.print("\\nEnter a domain (DONE to quit): ");\n    Scanner scan = new Scanner(System.in);\n    String domain = scan.nextLine();\n    if (domain.equalsIgnoreCase("DONE")) break;\n    if (blocker.isBlocked(domain))\n      System.out.println("Domain " + domain + " is blocked.");\n    else\n      System.out.println("Domain " + domain + " is fine.");\n  }\n}}')],
        explain: '<p>main prints the blocked list, then asks again and again until the user types DONE.</p><pre class="ex">while (true) { … if (DONE) break; … }</pre><p><code>equalsIgnoreCase</code> accepts done, Done, DONE.</p><p class="watch">contains is case-sensitive: "Games.com" is not blocked if the file has "games.com". Also, a new Scanner is made in every loop; one Scanner before the loop would be enough.</p>' },
      24: { blocks: [bul('Write a word counter class that counts the occurrences of each word in an input text document.'), bul('Words consists of letters only and converted to lowercase.'), bul('A map is an ideal data structure that maps words to counters.'), bul('Words are the keys and integer counters are the values.'), bul('If the word is entered for the first time, set its counter to 1.'), bul('For each entered word, increment its counter in the map.')],
        explain: '<p>Counting words is a map job: <b>word → count</b>.</p><pre class="ex">"The cat saw the dog"\nthe=2, cat=1, saw=1, dog=1</pre><p>New word: put(word, 1). Seen before: get the count and put count + 1.</p>' },
      25: { blocks: [code('public class WordCounter {\n  // countWords: maps each word in a file to an integer counter\n  private Map<String, Integer> countWords = new TreeMap<>();\n  // This method analyzes filename and creates a map of words to counts\n  private void analyzeDocument(String filename) throws IOException {\n    File inputFile = new File(filename);\n    Scanner scan = new Scanner(inputFile).useDelimiter("[^a-zA-Z]+");\n    while (scan.hasNext()) {\n      String word = scan.next().toLowerCase();\n      if (countWords.get(word) == null) { countWords.put(word, 1); }\n      else {\n         Integer count = countWords.get(word);\n         countWords.put(word, count+1);\n      }\n    }\n  }')],
        explain: '<p><code>useDelimiter("[^a-zA-Z]+")</code>: one or more characters that are <b>not</b> letters separate the words, so spaces, digits and punctuation are all cut out.</p><pre class="ex">"It\'s 2 o\'clock" → it, s, o, clock</pre><p>toLowerCase makes "The" and "the" the same key. get == null means the word is new.</p><p class="watch">put on an existing key replaces the count: that is how count + 1 is stored.</p>' },
      26: { blocks: [code('public static void main(String[] args) {\n    try {\n      WordCounter wc = new WordCounter();\n      wc.analyzeDocument("src/setsmaps/input.txt");\n      Set<Map.Entry<String, Integer>>\n        entries = wc.countWords.entrySet();\n      for (Map.Entry<String, Integer> entry: entries) {\n        System.out.println(entry);\n      }\n    }\n    catch (IOException ex) {\n      System.out.println(ex);\n    }\n  }\n}')],
        explain: '<p>main analyzes the file inside <b>try</b>: if the file cannot be read, the catch block prints the exception.</p><pre class="ex">cat=1\ndog=2\nthe=3</pre><p>Because countWords is a <b>TreeMap</b>, the entries come out sorted by word.</p><p class="watch">main can use the private field countWords because main is inside the same class.</p>' },
      27: { explain: '<p>Maps are everywhere a key leads to data:</p><pre class="ex">database    id → record\ncache       question → saved answer\ncompiler    variable name → memory place\nweb login   session id → user\nspell check word → found or not</pre><p>The key idea is always the same: find the value in about O(1) or O(log n), without looking at everything.</p>' },
      28: outline(3, '<p>Last: the hashing technique inside HashSet and HashMap.</p>'),
      29: { blocks: [bul('The HashSet and HashMap classes are implemented using a technique called hashing.'), bul('The hashing technique uses a hash function to compute the location of an element in a hash table for fast access.'), bul('A function that maps each element to a unique location in a hash table is called a perfect hash function.'), bul('However, sometimes multiple elements are mapped to the same location in a hash table, which causes a collision.')],
        explain: '<p><b>Hashing</b>: a <b>hash function</b> computes where an element lives in an array (the <b>hash table</b>), so we jump there directly.</p><pre class="ex">key → hash function → index → table[index]</pre><p>A <b>perfect</b> hash function gives every element its own cell. Usually that is impossible, and two elements get the same index: a <b>{{collision|تصادم}}</b>.</p>' },
      30: { blocks: [bul('A simple hashing example uses an array of 26 elements, called hash table, for letters A to Z.'), bul("The first letter of a name maps to an array index: 'A' → 0, 'B' → 1, and 'Z' → 25."), bul('Mapping a name to an array index is very efficient and can be done in constant time O(1).'), bul('Collision occurs if two names map to the same index: "Ann" and "Andrew" map to index 0.'), bul('The question is how to handle collisions.')],
        explain: '<p>The simplest hash function: the first letter.</p><pre class="ex">Ann → \'A\' → 0     Doug → 3     Young → 24\nAndrew → 0 too: collision!</pre><p>Finding a name is one step (O(1)): compute the index and look. But "Ann" and "Andrew" both want cell 0.</p>' },
      31: { blocks: [bul('A hash table is an array of elements or map entries.'), bul('The hashing technique converts a key into an integer index.'), bul('Indexing an array is done is constant time = O(1)'), bul('The hash table array can be dynamically resized if the size of the data is not known in advance.'), bul('The main question is how large should the hash table be?'), bul('The load factor of a hash table is the percent of its full capacity.', 1), bul('For example, if the load factor is 0.75 then the hash table should be resized each time it reaches 75% of its full capacity.', 1)],
        explain: '<p>The <b>load factor</b> = how full the table is.</p><pre class="ex">12 entries in 16 cells → 0.75\nload factor 0.75 → grow at 75% full</pre><p>A fuller table has more collisions (slower); an emptier table wastes memory. Java’s HashMap starts with 16 cells and doubles when it is 75% full.</p><p class="watch">"is done is constant time" on the slide means "is done in constant time".</p>' },
      32: { blocks: [bul('A hashing function converts a key into an integer, which is used to index the hash table array.'), bul('The goal is to map each key to a unique array index.')], explain: '<p>The picture: three keys go into the hashing function and come out as indexes 3, 0 and 2. The table stores the (key, value) entry at that index.</p><pre class="ex">Key1 → 3, Key2 → 0, Key3 → 2</pre><p>The table keeps the <b>key</b> too: after jumping to an index, we still check that the key there is the one we want.</p>' },
      33: { blocks: [bul('The root class Object defines the hashCode method that returns an integer based on the object memory location.'), bul('Classes often override the hashCode method and provide their own version. For example, the String and Integer classes define their own version of hashCode.'), bul('It is also preferrable to define your own hashCode method for any object that you intend to store in a hash table.'), bul('If two objects are equal according to the equals() method, then their hashCode() values must also be the same.')],
        explain: '<p>Every object has <code>hashCode()</code>, from the class Object. By default it depends on where the object is in memory, so two equal-looking objects get different codes.</p><pre class="ex">String, Integer override it:\n"Ahmed".hashCode() is always 63235109</pre><p>The rule: <b>equal objects must have equal hash codes</b>, or a HashSet would look in the wrong bucket and miss them.</p>' },
      34: { blocks: [bul('The hash code of a string s is computed in Java as follows:'), { type: 'html', html: '<pre class="code block plain"><span class="ln">s[0] × 31<sup>(n-1)</sup> + s[1] × 31<sup>(n-2)</sup> + … + s[n-1] =</span><span class="ln">(((s[0] × 31 + s[1]) × 31 + s[2]) × 31 + … ) × 31 + s[n-1]</span></pre>' }, bul('Where s[i] represents the ith character code in the string s'), bul('s.hashCode() computes the hash code of any string s'), bul('For example, the hash code of "Ahmed" is 63235109'), bul('For an Integer object, the hash code is equal to its value')],
        explain: '<p>For a string, every character counts, and its <b>position</b> counts too (it is multiplied by 31 for each later character).</p><pre class="ex">"AB": 65 × 31 + 66 = 2081\n"BA": 66 × 31 + 65 = 2111</pre><p>The second line of the formula is the fast way: multiply by 31, add the next code, repeat. An Integer’s hash code is just its value.</p><p class="watch">For long strings the number gets too big for an int and wraps around: hash codes can be negative.</p>' },
      35: { blocks: [bul('The implementation of the equals method describes what makes two instances of the class equal.'), bul('For example, two Course objects as equal if they have same prefix and number.', 1), bul('Typically, whenever the equals method is overridden, the hashCode method is also overridden.'), bul('Two equal objects must have the same hash code.', 1), bul('The inverse is not necessarily true: two unequal objects can have the same hash code.', 1)],
        explain: '<p>equals and hashCode go together:</p><pre class="ex">a.equals(b)  →  a.hashCode() == b.hashCode()   (must)\nsame hashCode → maybe equal, maybe not</pre><p>"Aa" and "BB" have the same hash code (2112) but are not equal: that is allowed, it just causes a collision.</p><p class="watch">Override equals without hashCode and a HashSet may keep two "equal" objects.</p>' },
      36: { blocks: [bul('Two course objects are equal if they have the same prefix and number. The hash code of a course object is computed using the hash code of its prefix and number.'), code('public class Course {\n  String prefix;                // Course prefix: e.g. MATH\n  int number;                   // Course number: e.g. 1324\n  . . .\n  boolean equals(Course c) {\n    return (prefix == c.prefix && number == c.number);\n  }\n  int hashCode() { return prefix.hashCode() + number; }\n}')],
        explain: '<p>The idea: equal courses (same prefix and number) get the same hash code, because hashCode uses exactly those two fields.</p><pre class="ex">MATH 1324 and MATH 1324 → same code\nMATH 1324 and MATH 1325 → codes differ by 1</pre><p class="watch">Three slips in the slide code: <code>prefix == c.prefix</code> compares references (use <code>prefix.equals(c.prefix)</code>); <code>equals(Course c)</code> overloads instead of overriding <code>equals(Object o)</code>; and <code>hashCode()</code> must be <code>public</code> to override Object’s method, or it does not compile.</p>' },
      37: { blocks: [bul('If a hash table has N entries, then the hash code of a key is mapped to an index using the remainder operator:'), code('index = Math.abs(key.hashCode() % N); // 0 to N-1'), bul('Collisions occur if two keys are mapped to the same index'), bul('The question is how to resolve collisions?'), bul('We can handle collisions using chaining. Rather than storing one entry at each index in a hash table, we can store a linked list of entries.')],
        explain: '<p>A hash code can be any int, so the remainder <code>% N</code> squeezes it into 0 … N−1, and <code>Math.abs</code> removes a minus sign.</p><pre class="ex">63235109 % 11 = 3 → index 3</pre><p>Different keys can still land on the same index. <b>Chaining</b> fixes this: each cell keeps a linked list of all the entries that land there.</p>' },
      38: { text: false, explain: '<p><b>Chaining</b>: Jack Williams and Andrew Wilson hash to the same cell, so that cell points to a linked list with both entries (green).</p><pre class="ex">put: add to the list at index\nget: compute index, then check the keys\n     in that list with equals</pre><p>If the lists stay short (low load factor), get and put stay about O(1).</p>' }
    },
    exam: {
      questions: [
        { type: 'tf', q: 'A HashSet prints its elements in the order they were added.', answer: false, review: 6,
          why: 'A HashSet prints bucket by bucket, in the order of the hash table. Only elements that share a bucket keep their adding order.',
          lessons: ['13-sets-and-maps'], skills: ['concept'], available_after: '13-sets-and-maps', level: 1 },
        { q: 'How is a TreeSet implemented?',
          options: ['As a hash table', 'As a balanced binary search tree (a Red-Black tree)', 'As a sorted array', 'As a linked list'], answer: 1, review: 10,
          why: 'Slide 10. That is why its elements stay sorted and its basic operations are O(log n).',
          lessons: ['13-sets-and-maps'], skills: ['concept'], available_after: '13-sets-and-maps', level: 1 },
        { type: 'match', q: 'Match each Map method with what it returns.', review: 14,
          pairs: [['put(k, v)', 'the old value of k, or null'], ['get(k)', 'the value of k, or null'], ['containsKey(k)', 'true or false'], ['keySet()', 'a Set of all the keys']],
          why: 'Slides 14-15. put and get both return null when the key had no mapping.',
          lessons: ['13-sets-and-maps'], skills: ['concept'], available_after: '13-sets-and-maps', level: 1 },
        { type: 'output', q: 'What does this print?', review: 8,
          code: 'Set<Integer> a = new TreeSet<>();\na.add(8); a.add(3); a.add(8); a.add(11);\nSet<Integer> b = new TreeSet<>();\nb.add(3); b.add(5);\na.addAll(b);\nSystem.out.println(a + " " + a.size());\na.removeAll(b);\nSystem.out.println(a);',
          answer: '[3, 5, 8, 11] 4\n[8, 11]',
          why: 'a holds 3, 8, 11 (one 8). addAll adds 5 (3 is already there): 4 elements. removeAll takes out 3 and 5, everything that is in b.',
          lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 2 },
        { q: 'A TreeMap b holds k2=20 and k3=30. A HashMap a holds k1=1 and k2=2. After `b.putAll(a)`, what is b?',
          options: ['{k1=1, k2=2, k3=30}', '{k1=1, k2=20, k3=30}', '{k2=20, k3=30, k1=1, k2=2}', '{k1=1, k3=30}'], answer: 0, review: 19,
          why: 'putAll puts every entry of a into b. k2 already exists, so its value is replaced by 2. The TreeMap keeps the keys sorted.',
          lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 2 },
        { q: 'What is `"NL".hashCode()`? (N is 78, L is 76.)',
          options: ['154', '2494', '2432', '2418'], answer: 1, review: 34,
          why: '78 × 31 + 76 = 2418 + 76 = 2494. (2418 alone forgets the last character.)',
          lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 2 },
        { type: 'fill', q: 'Complete the loop of analyzeDocument (slide 25).', review: 25,
          code: 'while (scan.hasNext()) {\n  String word = scan.next().toLowerCase();\n  if (countWords.get(word) == ___) { countWords.put(word, ___); }\n  else {\n    Integer count = countWords.___(word);\n    countWords.put(word, count+1);\n  }\n}',
          answer: ['null', '1', 'get'],
          why: 'A new word has no mapping (null) and starts at 1. A known word: read its count with get and put back count + 1, which replaces the old value.',
          lessons: ['13-sets-and-maps'], skills: ['design'], available_after: '13-sets-and-maps', level: 2 },
        { type: 'write', q: 'Write `public static int countDistinct(String[] words)` that returns how many <b>different</b> words the array holds. Use a `Set<String>` made with `new HashSet<>()`.', review: 5,
          rows: 6, starter: 'public static int countDistinct(String[] words) {\n  \n}',
          checks: [{ re: /Set\s*<\s*String\s*>\s+(\w+)\s*=\s*new\s+HashSet\s*<\s*>\s*\(\s*\)\s*;/, label: 'Makes a HashSet of Strings' },
            { re: /for\s*\(\s*String\s+\w+\s*:\s*words\s*\)/, label: 'Loops over the words' },
            { re: /\w+\.add\s*\(\s*\w+\s*\)\s*;/, label: 'Adds each word to the set' },
            { re: /return\s+\w+\.size\s*\(\s*\)\s*;/, label: 'Returns the size of the set' }],
          solution: 'public static int countDistinct(String[] words) {\n  Set<String> set = new HashSet<>();\n  for (String w : words) set.add(w);\n  return set.size();\n}',
          why: 'The set ignores duplicates, so its size is the number of different words. Each add is O(1): O(n) in total.',
          lessons: ['13-sets-and-maps'], skills: ['design'], available_after: '13-sets-and-maps', level: 2 },
        { q: 'Java\'s HashMap starts with 16 cells and a load factor of 0.75. How many entries can it hold before it has to grow?',
          options: ['8', '12', '15', '16'], answer: 1, review: 31,
          why: '0.75 × 16 = 12. Adding more entries makes the table double to 32 cells.',
          lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 2 },
        { type: 'output', q: 'A HashMap has 16 buckets and puts an Integer key in bucket key % 16 (for these small keys). What does this print?', review: 17,
          code: 'Map<Integer, String> m = new HashMap<>();\nm.put(25, "u"); m.put(9, "v"); m.put(3, "w"); m.put(25, "x");\nm.remove(9);\nSystem.out.println(m + " " + m.containsValue("u"));',
          answer: '{3=w, 25=x} false',
          why: '25 and 9 share bucket 9 (25 first), and 3 is in bucket 3. The last put replaces "u" with "x", so "u" is no longer a value. After removing 9, the walk over the buckets gives 3, then 25.',
          lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 3 },
        { type: 'trace', q: 'A chained hash table has N = 5 cells and Integer keys. 12, 7, 20, 2 and 15 are put in it. Fill in how many entries each cell holds.', review: 38,
          cols: ['cell', '0', '1', '2', '3', '4'],
          rows: [['entries', '?2', '?0', '?3', '?0', '?0']],
          why: '12 % 5 = 2, 7 % 5 = 2, 20 % 5 = 0, 2 % 5 = 2, 15 % 5 = 0. Cell 2 holds a chain of 3 entries, cell 0 a chain of 2.',
          lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 3 },
        { type: 'multi', q: 'Two Course objects are equal when they have the same prefix and number. Which hashCode bodies follow the rule "equal objects have equal hash codes"?', review: 35,
          options: ['return prefix.hashCode() + number;', 'return number;', 'return 7;', 'return (int) (Math.random() * 100);', 'return super.hashCode();'], answer: [0, 1, 2],
          why: 'Any code computed only from prefix and number (or a constant) is the same for equal courses. "return 7" is legal but puts every course in one chain: slow. A random number or Object\'s memory-based code breaks the rule.',
          lessons: ['13-sets-and-maps'], skills: ['design'], available_after: '13-sets-and-maps', level: 3 },
        { type: 'output', q: '"Aa" and "BB" both have the hash code 2112, which is bucket 0 of 16; "C" (67) is in bucket 3. What does this print?', review: 35,
          code: 'Set<String> s = new HashSet<>();\ns.add("BB"); s.add("C"); s.add("Aa");\nSystem.out.println(s);',
          answer: '[BB, Aa, C]',
          why: '"BB" and "Aa" collide in bucket 0 and are chained in adding order; equals tells them apart, so both stay. Bucket 3 comes after bucket 0.',
          lessons: ['13-sets-and-maps'], skills: ['trace'], available_after: '13-sets-and-maps', level: 3 },
        { q: 'To check whether an array of n values has a duplicate, one program compares every pair with two nested loops; another adds the values to a HashSet and stops when add returns false. What are their costs?',
          options: ['O(n²) and O(n)', 'Both O(n)', 'O(n) and O(n²)', 'O(n log n) and O(1)'], answer: 0, review: 9,
          why: 'The nested loops compare about n²/2 pairs (unit 2). Each HashSet add is O(1), so n adds are O(n).',
          lessons: ['02-analysis-of-algorithms', '13-sets-and-maps'], skills: ['complexity'], available_after: '13-sets-and-maps', level: 3 },
        { q: 'A key\'s hash code is −38 and the table has N = 8 cells. Which index does `Math.abs(key.hashCode() % N)` give?',
          options: ['6', '2', '4', '−6'], answer: 0, review: 37,
          why: '−38 % 8 = −6 in Java (the sign of the left side), and Math.abs gives 6. (−38 = −4 × 8 − 6.)',
          lessons: ['13-sets-and-maps'], skills: ['edge_case'], available_after: '13-sets-and-maps', level: 3 }
      ],
      tasks: [
        {
          title: 'Common words',
          task: '<p>Write <code>public static Set&lt;String&gt; commonWords(Set&lt;String&gt; a, Set&lt;String&gt; b)</code>. It returns a new <code>TreeSet</code> with the words that are in <b>both</b> sets, sorted, and it must not change a or b (so do not call retainAll on a). Loop over a and use contains on b.</p>',
          starter: 'public static Set<String> commonWords(Set<String> a, Set<String> b) {\n  \n}',
          checks: [
            { re: /Set\s*<\s*String\s*>\s+(\w+)\s*=\s*new\s+TreeSet\s*<\s*>\s*\(\s*\)\s*;/, label: 'Makes a new TreeSet for the result', review: 7 },
            { re: /for\s*\(\s*String\s+\w+\s*:\s*a\s*\)/, label: 'Loops over the words of a', review: 22 },
            { re: /if\s*\(\s*b\.contains\s*\(\s*\w+\s*\)\s*\)/, label: 'Checks if b contains the word', review: 5 },
            { re: /\w+\.add\s*\(\s*\w+\s*\)\s*;/, label: 'Adds the common word to the result', review: 5 },
            { fn: function (c) { return !/\ba\.(retainAll|removeAll|addAll|add|remove)\s*\(/.test(c); }, label: 'Does not change a', review: 8 },
            { re: /return\s+\w+\s*;/, label: 'Returns the result', review: 5 }
          ],
          solution: 'public static Set<String> commonWords(Set<String> a, Set<String> b) {\n  Set<String> result = new TreeSet<>();\n  for (String w : a)\n    if (b.contains(w)) result.add(w);\n  return result;\n}'
        },
        {
          title: 'Counting values',
          task: '<p>Write <code>public static Map&lt;Integer, Integer&gt; countValues(int[] data)</code> that maps each value of the array to the number of times it appears, like the word counter of slide 25. Use a <code>TreeMap</code>, so the values come out sorted. For {4, 1, 4, 9, 4} it returns {1=1, 4=3, 9=1}.</p>',
          starter: 'public static Map<Integer, Integer> countValues(int[] data) {\n  \n}',
          checks: [
            { re: /Map\s*<\s*Integer\s*,\s*Integer\s*>\s+(\w+)\s*=\s*new\s+TreeMap\s*<\s*>\s*\(\s*\)\s*;/, label: 'Makes a TreeMap&lt;Integer, Integer&gt;', review: 25 },
            { re: /for\s*\(\s*int\s+\w+\s*:\s*data\s*\)/, label: 'Loops over the data', review: 25 },
            { re: /\.get\s*\(\s*\w+\s*\)\s*==\s*null/, label: 'Tests for a value seen for the first time', review: 25 },
            { re: /\.put\s*\(\s*\w+\s*,\s*1\s*\)\s*;/, label: 'Starts a new value at 1', review: 24 },
            { re: /\.put\s*\(\s*\w+\s*,\s*[\w.()]+\s*\+\s*1\s*\)\s*;/, label: 'Adds 1 to a known value', review: 25 },
            { re: /return\s+\w+\s*;/, label: 'Returns the map', review: 25 }
          ],
          solution: 'public static Map<Integer, Integer> countValues(int[] data) {\n  Map<Integer, Integer> counts = new TreeMap<>();\n  for (int v : data) {\n    if (counts.get(v) == null) counts.put(v, 1);\n    else counts.put(v, counts.get(v) + 1);\n  }\n  return counts;\n}'
        }
      ]
    }
  });
})();
