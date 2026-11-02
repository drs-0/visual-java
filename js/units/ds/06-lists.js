/* Data Structures · Unit 6 Lists (45 slides): ordered, unordered and indexed lists, the Java List interface (TestList),
   the ProgramOfStudy example, our own ArrayList<T> that shifts elements, our own doubly linked LinkedList<T> with
   nodeAt / add at an index / removeNode, and the time complexity table */
(function () {
  function L(src, frag, nth) { var ls = src.split('\n'), c = 0; for (var i = 0; i < ls.length; i++) if (ls[i].indexOf(frag) >= 0 && ++c === (nth || 1)) return i + 1; throw new Error('no line ' + frag); }
  function h(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function toks(s, max) { return String(s).trim().split(/[\s,]+/).filter(Boolean).slice(0, max || 10); }
  /* list operations typed as short words: A add, 1:A add at index, -A remove(element), -1 remove(index), @1 get,
     =1:A set, #A indexOf, ##A lastIndexOf, ?A contains, p print, clear. own = our own mylist classes */
  function parse(s, own, len) {
    var out = [], re = '(\\w{1,' + len + '})';
    toks(s, 24).forEach(function (t) {
      var m;
      if (t === 'p') { if (!own) out.push({ k: 'print' }); }
      else if (t === 'clear') { if (own) out.push({ k: 'clear' }); }
      else if ((m = new RegExp('^##' + re).exec(t))) { if (!own) out.push({ k: 'lastIndexOf', x: m[1] }); }
      else if ((m = new RegExp('^#' + re).exec(t))) out.push({ k: 'indexOf', x: m[1] });
      else if ((m = new RegExp('^\\?' + re).exec(t))) out.push({ k: 'contains', x: m[1] });
      else if ((m = /^@(\d{1,2})$/.exec(t))) out.push({ k: 'get', i: +m[1] });
      else if ((m = new RegExp('^=(\\d{1,2}):' + re).exec(t))) out.push({ k: 'set', i: +m[1], x: m[2] });
      else if ((m = new RegExp('^(\\d{1,2}):' + re).exec(t))) out.push({ k: 'addAt', i: +m[1], x: m[2] });
      else if ((m = /^-(\d{1,2})$/.exec(t))) out.push({ k: 'removeAt', i: +m[1] });
      else if ((m = new RegExp('^-' + re).exec(t))) out.push({ k: 'remove', x: m[1] });
      else if ((m = new RegExp('^' + re).exec(t))) out.push({ k: 'add', x: m[1] });
    });
    return out;
  }
  var OPSLABEL = '<code>A</code> add, <code>2:A</code> add at index 2, <code>-A</code> remove("A"), <code>-2</code> remove(2), <code>@2</code> get(2), <code>=2:A</code> set(2, "A"), <code>#A</code> indexOf, <code>?A</code> contains';
  function bounds(i, n) { return 'Exception in thread "main" java.lang.IndexOutOfBoundsException: Index ' + i + ' out of bounds for length ' + n; }
  function bounds2(i, n) { return 'Exception in thread "main" java.lang.IndexOutOfBoundsException: Index: ' + i + ', Size: ' + n; }

  /* ---------- 1. ordered, unordered and indexed lists (slides 3-6) ---------- */
  var KC = '// Ordered list: add(x) keeps the elements sorted by key\ni = 0\nwhile i < size and list[i] < x\n    i = i + 1\nput x before list[i]        // the rest move one place right\n\n// Unordered list: x goes where we put it\nadd x at the front, at the rear, or after another element\n\n// Indexed list: elements have the indexes 0 .. size-1\nadd x at an index           // the indexes after it go up by 1\nremove the element at an index   // the indexes after it go down by 1';
  function row(list, o) {
    var out = [], n = list.length, cw = Math.min(56, Math.floor(510 / Math.max(n, 1))), x0 = 280 - n * cw / 2;
    list.forEach(function (e, i) {
      var tone = (o.tone && o.tone[i]) || 'blue', x = x0 + i * cw;
      out.push(B(e.id, x + 2, o.y, cw - 4, 44, { title: e.t, mono: true, size: cw < 46 ? 12 : 14, tone: tone, fill: tone === 'accent' ? 'solid' : 'soft', hi: tone === 'accent', from: e.id === o.fresh ? [x, o.y - 100] : undefined }));
      if (o.idx) { var c = o.chg && o.chg.indexOf(i) >= 0; out.push(T('ix' + i, x + cw / 2, o.y + 64, String(i), { anchor: 'middle', mono: true, size: 12, bold: c, tone: c ? 'accent' : 'muted' })); }
    });
    if (n) { out.push(P('pfr', x0 + cw / 2, o.y - 4, 'front', { dir: 'down', len: 26 })); out.push(P('prr', x0 + (n - 1) * cw + cw / 2, o.y - 4, 'rear', { dir: 'down', len: 26 })); }
    return out;
  }
  var listkinds = {
    id: 'listkinds', slides: [3, 6], title: 'Ordered, unordered and indexed lists', lang: 'text',
    code: KC,
    inputs: [{ id: 'vals', type: 'text', label: 'add to the ordered list', value: '54', minlen: 1, maxlen: 20 }],
    inputsLabel: 'Whole numbers to add to the ordered list (up to 3).',
    presets: [{ label: 'slide 4: add 54', values: { vals: '54' } }, { label: 'smallest, largest, middle', values: { vals: '5 95 30' } }, { label: 'a key already there', values: { vals: '42' } }],
    steps: function (v) {
      var vals = toks(v.vals, 3).filter(function (t) { return /^-?\d{1,3}$/.test(t); }).map(Number), st = [], n = 0;
      if (!vals.length) vals = [54];
      var list = [12, 25, 33, 42, 49, 57, 73, 81].map(function (x) { return { id: 'o' + n++, t: String(x), v: x }; });
      st.push({ slide: 3, line: 1, ph: 'kinds', cap: 'Three kinds of lists: in an <b>ordered</b> list the elements are always sorted by a key; in an <b>unordered</b> list they are where we put them; in an <b>indexed</b> list each element has a number, its index.' });
      vals.forEach(function (x) {
        var i = 0; while (i < list.length && list[i].v < x) i++;
        var tone = list.map(function (e, j) { return j < i ? 'teal' : j === i ? 'accent' : 'blue'; });
        st.push({ slide: 4, line: '2-4', list: list.slice(), tone: tone, title: 'ordered list', cap: 'add(' + x + '): walk from the front while the element is smaller than ' + x + '. ' + (i === list.length ? 'Every element is smaller, so ' + x + ' goes at the <b>rear</b>.' : i === 0 ? list[0].t + ' is not smaller, so ' + x + ' goes at the <b>front</b>.' : 'Stop at ' + list[i].t + ': it is not smaller than ' + x + '.') + (i < list.length && list[i].v === x ? ' (Equal is not smaller, so the new ' + x + ' goes before the old one.)' : '') });
        var e = { id: 'o' + n++, t: String(x), v: x };
        list.splice(i, 0, e);
        st.push({ slide: 4, line: 5, list: list.slice(), fresh: e.id, tone: list.map(function (q) { return q === e ? 'accent' : 'blue'; }), title: 'ordered list', cap: x + ' is placed by its <b>key value</b>, not by our choice. The list stays sorted: ' + list.map(function (q) { return q.t; }).join(', ') + '.' });
      });
      var u = ['33', '81', '12', '57'].map(function (t, i) { return { id: 'u' + i, t: t }; });
      st.push({ slide: 5, line: 8, list: u.slice(), title: 'unordered list', cap: 'An <b>unordered</b> list: the elements are not sorted. Their order is only the order in which we placed them.' });
      var a = { id: 'u4', t: '25' }; u.unshift(a);
      st.push({ slide: 5, line: 8, list: u.slice(), fresh: 'u4', tone: ['accent'], title: 'unordered list', cap: 'Add 25 at the <b>front</b>…' });
      var b = { id: 'u5', t: '49' }; u.push(b);
      st.push({ slide: 5, line: 8, list: u.slice(), fresh: 'u5', tone: [0, 0, 0, 0, 0].map(function () { return 'blue'; }).concat(['accent']), title: 'unordered list', cap: '…add 49 at the <b>rear</b>…' });
      var c = { id: 'u6', t: '73' }; u.splice(3, 0, c);
      st.push({ slide: 5, line: 8, list: u.slice(), fresh: 'u6', tone: ['blue', 'blue', 'blue', 'accent'], title: 'unordered list', cap: '…and add 73 <b>after</b> 12. Anywhere is allowed: the user decides.' });
      var ix = ['A', 'B', 'C', 'D', 'E'].map(function (t, i) { return { id: 'x' + i, t: t }; });
      st.push({ slide: 6, line: 11, list: ix.slice(), idx: true, title: 'indexed list', cap: 'An <b>indexed</b> list: every element has an index, from 0 at the front to size − 1 at the rear.' });
      var d = { id: 'x5', t: 'X' }; ix.splice(2, 0, d);
      st.push({ slide: 6, line: 11, list: ix.slice(), idx: true, fresh: 'x5', tone: ['blue', 'blue', 'accent'], chg: [3, 4, 5], title: 'indexed list', cap: 'Add X at index 2. C, D and E did not change, but their indexes did: 2 → 3, 3 → 4, 4 → 5.' });
      ix.shift();
      st.push({ slide: 6, line: 12, list: ix.slice(), idx: true, chg: [0, 1, 2, 3, 4], title: 'indexed list', cap: 'Remove the element at index 0 (A). Now <b>every</b> index goes down by 1: X is at index 1. Indexes are updated each time the list changes.' });
      return st;
    },
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'kinds') {
        [['ordered', ['12', '25', '33', '42', '49'], 'sorted by a key'], ['unordered', ['33', '81', '12', '57'], 'any order'], ['indexed', ['A', 'B', 'C', 'D'], 'index 0, 1, 2, 3']].forEach(function (r, j) {
          var y = 40 + j * 100;
          items.push(T('kl' + j, 20, y + 28, r[0], { size: 15, bold: true, tone: j === 0 ? 'accent' : j === 1 ? 'teal' : 'blue' }));
          r[1].forEach(function (t, i) { items.push(B('k' + j + i, 130 + i * 56, y, 50, 44, { title: t, mono: true, size: 14, tone: j === 0 ? 'accent' : j === 1 ? 'teal' : 'blue' })); if (j === 2) items.push(T('ki' + i, 155 + i * 56, y + 62, String(i), { anchor: 'middle', mono: true, size: 12, tone: 'muted' })); });
          items.push(T('kd' + j, 430, y + 28, r[2], { size: 12, tone: 'muted' }));
        });
        return items;
      }
      items.push(T('lt', 280, 30, s.title, { anchor: 'middle', size: 15, bold: true, tone: 'muted' }));
      return items.concat(row(s.list, { y: 150, tone: s.tone, fresh: s.fresh, idx: s.idx, chg: s.chg }));
    }
  };

  /* ---------- 2. the Java List interface: TestList (slides 8-12) ---------- */
  var SL = 'Ahmad Rakan Turki Hadi Ibrahim Omar Rakan Hadi #Rakan ##Rakan 1:Ali p #Rakan -Hadi p -2 p @2 ?Baraa =1:Mobarak p';
  function jline(o) {
    var q = function (x) { return '"' + x + '"'; };
    return o.k === 'add' ? 'list.add(' + q(o.x) + ');' : o.k === 'addAt' ? 'list.add(' + o.i + ', ' + q(o.x) + ');' : o.k === 'remove' ? 'list.remove(' + q(o.x) + ');' : o.k === 'removeAt' ? 'list.remove(' + o.i + ');' :
      o.k === 'get' ? 'System.out.println("The list at index ' + o.i + ' is " + list.get(' + o.i + '));' : o.k === 'set' ? 'list.set(' + o.i + ',' + q(o.x) + ');' :
      o.k === 'indexOf' ? 'System.out.println("Index of ' + o.x + ' is " + list.indexOf(' + q(o.x) + '));' : o.k === 'lastIndexOf' ? 'System.out.println("Last Index of ' + o.x + ' is " + list.lastIndexOf(' + q(o.x) + '));' :
      o.k === 'contains' ? 'System.out.println("The list contains ' + o.x + '? " + list.contains(' + q(o.x) + '));' : 'System.out.println(list);';
  }
  function trun(v) {
    var ops = parse(v.ops, false, 7), code = ['List<String> list1 = new ArrayList<>();   // list1 is an ArrayList object', 'System.out.println("Testing ArrayList");', 'test(list1);', 'List<String> list2 = new LinkedList<>();  // list2 is a LinkedList object', 'System.out.println("Testing LinkedList");', 'test(list2);', '', 'private static void test(List<String> list) {'];
    ops.forEach(function (o) { o.line = code.length + 1; code.push('  ' + jline(o)); });
    code.push('  System.out.println();', '}');
    return { code: code.join('\n'), ops: ops };
  }
  var testlist = {
    id: 'testlist', slides: [8, 12], title: 'One test, two List classes',
    code: function (v) { return trun(v).code; },
    inputs: [{ id: 'ops', type: 'text', label: 'operations', value: SL, maxlen: 140 }],
    inputsLabel: OPSLABEL + ', <code>##A</code> lastIndexOf, <code>p</code> print the list.',
    presets: [{ label: 'slides 11-12', values: { ops: SL } }, { label: 'insert at the front', values: { ops: 'Sara Huda 0:Nora 0:Lama p #Sara' } }, { label: 'not in the list', values: { ops: 'Ali Omar #Zaid -Zaid ?Zaid p' } }, { label: 'index out of bounds', values: { ops: 'Ali Omar Sara @3' } }, { label: 'add past the end', values: { ops: 'Ali Omar 3:Sara' } }],
    steps: function (v) {
      var R = trun(v), st = [], list = [], n = 0, outs = [];
      var snap = function (o) { o.list = list.slice(); st.push(o); return o; };
      var str = function () { return '[' + list.map(function (e) { return e.t; }).join(', ') + ']'; };
      var find = function (x, last) { for (var i = 0; i < list.length; i++) { var j = last ? list.length - 1 - i : i; if (list[j].t === x) return j; } return -1; };
      snap({ slide: 8, line: 1, ph: 'api', cap: 'In the Java API, <b>List</b> is an interface (it extends Collection, which extends Iterable). <b>ArrayList</b> and <b>LinkedList</b> are classes that implement it. There is no class for an ordered list.' });
      snap({ slide: 9, line: 8, ph: 'methods', cap: 'List&lt;T&gt; is an <b>indexed</b> list: add, remove, get and set can work at any index. indexOf and lastIndexOf return −1 when the element is not there.' });
      snap({ slide: 10, line: '1-3', cap: 'list1 refers to an ArrayList. Its type is the <b>interface</b> List&lt;String&gt;, so test(list) can take any class that implements List.', out: 'Testing ArrayList' });
      for (var k = 0; k < R.ops.length; k++) {
        var o = R.ops[k], s = { slide: /^(add|addAt|indexOf|lastIndexOf)$/.test(o.k) ? 11 : 12, line: o.line };
        if (o.k === 'add') { list.push({ id: 'n' + n++, t: o.x }); s.fresh = list.length - 1; s.cap = '<b>add("' + h(o.x) + '")</b> puts it at the <b>end</b>: index ' + (list.length - 1) + '. size() = ' + list.length + '.'; }
        else if (o.k === 'addAt') {
          if (o.i > list.length) { s.err = true; s.out = bounds2(o.i, list.length); s.cap = '<b>add(' + o.i + ', "' + h(o.x) + '")</b>: the index can be 0 to size() = ' + list.length + ' (size means “at the end”). ' + o.i + ' is too big, so Java throws an <b>IndexOutOfBoundsException</b>.'; snap(s); break; }
          list.splice(o.i, 0, { id: 'n' + n++, t: o.x }); s.fresh = o.i; s.moved = [o.i + 1, list.length - 1];
          s.cap = '<b>add(' + o.i + ', "' + h(o.x) + '")</b>: ' + h(o.x) + ' goes in at index ' + o.i + '. ' + (o.i < list.length - 1 ? 'Every element after it moves one place right, so its index grows by 1.' : 'It is at the end, so nothing moves.');
        } else if (o.k === 'remove' || o.k === 'removeAt') {
          var j = o.k === 'remove' ? find(o.x) : o.i;
          if (o.k === 'removeAt' && j >= list.length) { s.err = true; s.out = bounds(j, list.length); s.cap = '<b>remove(' + j + ')</b>: the indexes go from 0 to ' + (list.length - 1) + '. Java throws an <b>IndexOutOfBoundsException</b>.'; snap(s); break; }
          if (j < 0) { s.res = { t: 'false', lb: 'remove returned' }; s.cap = '<b>remove("' + h(o.x) + '")</b>: "' + h(o.x) + '" is not in the list. It returns <b>false</b> and the list does not change.'; }
          else {
            var e = list.splice(j, 1)[0]; s.gone = e; s.moved = [j, list.length - 1];
            s.cap = o.k === 'remove' ? '<b>remove("' + h(o.x) + '")</b> removes the <b>first</b> "' + h(o.x) + '" (index ' + j + ')' + (find(o.x) >= 0 ? '. The other one stays.' : '.') + ' The elements after it move one place left.' : '<b>remove(' + j + ')</b>: the argument is an <b>int</b>, so this is remove(int index): it removes the element at index ' + j + ' ("' + h(e.t) + '"), not a value.';
          }
        } else if (o.k === 'get' || o.k === 'set') {
          if (o.i >= list.length) { s.err = true; s.out = bounds(o.i, list.length); s.cap = '<b>' + o.k + '(' + o.i + ')</b>: the last index is ' + (list.length - 1) + ', so Java throws an <b>IndexOutOfBoundsException</b>.'; snap(s); break; }
          if (o.k === 'get') { s.look = o.i; s.out = 'The list at index ' + o.i + ' is ' + list[o.i].t; s.cap = '<b>get(' + o.i + ')</b> returns the element at index ' + o.i + ': ' + h(list[o.i].t) + '. The list does not change.'; }
          else { var old = list[o.i].t; list[o.i] = { id: 'n' + n++, t: o.x }; s.fresh = o.i; s.cap = '<b>set(' + o.i + ', "' + h(o.x) + '")</b> <b>replaces</b> ' + h(old) + ' with ' + h(o.x) + '. The size stays ' + list.length + ' (set does not insert).'; }
        } else if (o.k === 'indexOf' || o.k === 'lastIndexOf') {
          var f = find(o.x, o.k === 'lastIndexOf'); s.look = f; s.scan = o.k === 'indexOf' ? [0, f < 0 ? list.length - 1 : f] : [f < 0 ? 0 : f, list.length - 1];
          s.out = (o.k === 'indexOf' ? 'Index of ' : 'Last Index of ') + o.x + ' is ' + f;
          s.cap = '<b>' + o.k + '("' + h(o.x) + '")</b> searches from the ' + (o.k === 'indexOf' ? 'front' : 'rear') + (f < 0 ? ' and does not find it: <b>−1</b>.' : ' and finds it at index <b>' + f + '</b>.');
        } else if (o.k === 'contains') { var c = find(o.x); s.look = c; s.out = 'The list contains ' + o.x + '? ' + (c >= 0); s.cap = '<b>contains("' + h(o.x) + '")</b> is <b>' + (c >= 0) + '</b>.'; }
        else { s.out = str(); s.cap = 'println(list) prints the elements in index order, inside [ ]. (Java’s list classes have a toString.)'; }
        snap(s);
      }
      if (!st[st.length - 1].err) snap({ slide: 12, line: R.code.split('\n').length - 1, cap: 'Then test(list2) runs the <b>same</b> calls on a LinkedList, and the output is exactly the same. The code only uses List methods, so it does not care which class is behind the reference.', out: '' });
      return st;
    },
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'api') {
        ['Iterable', 'Collection', 'List'].forEach(function (t, i) { items.push(B('ap' + i, 200, 24 + i * 76, 160, 40, { title: t, mono: true, size: 14, tone: 'blue', fill: 'solid' })); if (i) items.push(A('aa' + i, 280, 24 + i * 76, 280, 64 + (i - 1) * 76, { tone: 'blue', label: 'extends', la: 'start', lx: 8 })); });
        items.push(B('ap3', 110, 270, 150, 40, { title: 'ArrayList', mono: true, size: 14, tone: 'teal', fill: 'solid' }));
        items.push(B('ap4', 300, 270, 150, 40, { title: 'LinkedList', mono: true, size: 14, tone: 'teal', fill: 'solid' }));
        items.push(A('ai1', 185, 270, 250, 176, { dash: true, tone: 'teal', label: 'implements', la: 'end', lx: -8 }));
        items.push(A('ai2', 375, 270, 310, 176, { dash: true, tone: 'teal' }));
        items.push(T('an1', 420, 80, 'interfaces', { size: 13, bold: true, tone: 'blue' }));
        items.push(T('an2', 470, 294, 'classes', { size: 13, bold: true, tone: 'teal' }));
        return items;
      }
      if (s.ph === 'methods') {
        ['add(e)', 'add(i, e)', 'remove(e)', 'remove(i)', 'get(i)', 'set(i, e)', 'indexOf(e)', 'lastIndexOf(e)', 'contains(e)', 'size()', 'clear()'].forEach(function (t, i) {
          items.push(B('me' + i, 30 + (i % 3) * 170, 40 + Math.floor(i / 3) * 62, 156, 40, { title: t, mono: true, size: 13, tone: /\(i/.test(t) ? 'accent' : 'blue' }));
        });
        items.push(T('mn', 280, 316, 'orange: the methods that take an index', { anchor: 'middle', size: 12, tone: 'muted' }));
        return items;
      }
      var n = s.list.length, cw = Math.min(64, Math.floor(540 / Math.max(n, 1))), x0 = 280 - n * cw / 2, y = 120;
      s.list.forEach(function (e, i) {
        var hot = i === s.fresh || i === s.look, mv = s.moved && i >= s.moved[0] && i <= s.moved[1], sc = s.scan && i >= s.scan[0] && i <= s.scan[1] && i !== s.look;
        var x = x0 + i * cw;
        items.push(B(e.id, x + 2, y, cw - 4, 44, { title: e.t, mono: true, size: cw < 66 ? 11 : 13, tone: hot ? 'accent' : mv || sc ? 'teal' : 'blue', fill: hot ? 'solid' : 'soft', hi: hot, from: i === s.fresh ? [x, y - 80] : undefined }));
        items.push(T('ix' + i, x + cw / 2, y + 64, String(i), { anchor: 'middle', mono: true, size: 12, tone: mv ? 'teal' : 'muted', bold: mv }));
      });
      items.push(T('sz', 30, 50, 'size() = ' + n, { mono: true, size: 14, bold: true }));
      if (!n) items.push(T('emp', 280, 146, 'list → a new, empty ArrayList', { anchor: 'middle', mono: true, size: 14, tone: 'muted' }));
      if (s.gone) items.push(B(s.gone.id, 30, 250, 110, 40, { title: s.gone.t, mono: true, size: 14, tone: 'red', tag: 'removed', o: 0.85 }));
      if (s.res) items.push(B('res', 30, 250, 110, 40, { title: s.res.t, mono: true, size: 14, tone: 'accent', fill: 'solid', tag: s.res.lb }));
      if (s.err) items.push(T('er', 280, 270, 'IndexOutOfBoundsException', { anchor: 'middle', mono: true, size: 15, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* ---------- 3. ProgramOfStudy (slides 14-19) ---------- */
  var CO = '// ---- Course.java ----\npackage lists;\npublic class Course {        // Represents a course taken by a student\n  final String prefix;       // course prefix\n  final int number;          // course number\n  final String title;        // course title\n  String grade;              // grade received in this course\n  // Constructs a course object with the specified information\n  Course(String prefix, int number, String title, String grade) {\n    this.prefix = prefix;\n    this.number = number;\n    this.title = title;\n    this.grade = grade;\n  }\n  // Creates and returns a string representation of this course\n  public String toString() {\n    return prefix + " " + number + ": " + title + "  [" + grade + "]";\n  }\n}';
  var PO = '// ---- ProgramOfStudy.java ----\npackage lists;\nimport java.util.*;\n// Represents a Program of Study\n// A list of courses taken and planned for a student\npublic class ProgramOfStudy {\n  private final List<Course> list = new ArrayList<>();\n  // Adds the specified course at the end of list\n  public void addCourse(String prefix, int number, String title, String grade) {\n    Course c = new Course(prefix, number, title, grade);\n    list.add(c);\n  }\n  // Adds the specified course at the specified index\n  public void addCourse(int index, String prefix, int number, String title,\n                                                              String grade) {\n    Course c = new Course(prefix, number, title, grade);\n    list.add(index, c);\n  }\n  // Finds and returns the course matching the specified prefix and number\n  public Course find(String prefix, int number) {\n    for (Course course : list) {\n      if (prefix.equals(course.prefix) && number == course.number)\n        return course;\n    }\n    return null;   // Course not found\n  }\n  // Replaces the specified target course with newCourse\n  // Does nothing if the target course is not found\n  public void replace(Course target, Course newCourse) {\n    int targetIndex = list.indexOf(target);\n    if (targetIndex != -1) list.set(targetIndex, newCourse);\n  }\n  public void print() {\n    for (int i=0; i<list.size(); i++) System.out.println(i + ": " + list.get(i));\n    System.out.println("=====================================");\n  }\n}';
  var C7 = [['MATH', 1422, 'Calculus I', 'B+'], ['PHYS', 1421, 'Physics I', 'B'], ['GEIT', 1411, 'Computer Science I', 'A'], ['MATH', 1423, 'Calculus II', 'A'], ['PHYS', 1422, 'Physics II', ''], ['GEIT', 1412, 'Computer Science II', ''], ['COEN', 2411, 'Electronics', '']];
  function ftarget(s, def) { var m = /^\s*(\w{1,6})\s+(\d{1,5})\s*$/.exec(String(s)); return m ? [m[1], +m[2]] : def; }
  function prun(v) {
    var f1 = ftarget(v.f1, ['GEIT', 1412]), f2 = ftarget(v.f2, ['COEN', 2411]);
    var te = '// ---- POSTester.java ----\npackage lists;\npublic class POSTester {\n  public static void main(String[] args) {\n    ProgramOfStudy pos = new ProgramOfStudy();\n' +
      C7.map(function (c) { return '    pos.addCourse("' + c[0] + '", ' + c[1] + ', "' + c[2] + '", "' + c[3] + '");'; }).join('\n') +
      '\n    pos.print();\n    pos.addCourse(0, "COMM", 1311, "Written Communication", "C");\n    pos.addCourse(3, "COMM", 1312, "Writing and Research", "C+");\n    pos.print();\n    Course c1 = pos.find("' + f1[0] + '", ' + f1[1] + ');\n    if (c1 != null) {\n       c1.grade = "A+";\n       System.out.println("\\nNew grade for " + c1 + "\\n");\n    }\n    Course c2 = pos.find("' + f2[0] + '", ' + f2[1] + ');\n    pos.replace(c2, new Course("COEN", 2411, "Circuits", ""));\n    pos.print();\n  }\n}';
    return { f1: f1, f2: f2, code: CO + '\n\n' + PO + '\n\n' + te };
  }
  var pos = {
    id: 'pos', slides: [14, 19], title: 'A list of Course objects',
    code: function (v) { return prun(v).code; },
    inputs: [{ id: 'f1', type: 'text', label: 'c1 = find', value: 'GEIT 1412', minlen: 3, maxlen: 12 }, { id: 'f2', type: 'text', label: 'c2 = find', value: 'COEN 2411', minlen: 3, maxlen: 12 }],
    inputsLabel: 'A prefix and a number, like <code>MATH 1423</code>.',
    presets: [{ label: 'slide 19', values: { f1: 'GEIT 1412', f2: 'COEN 2411' } }, { label: 'a course added at index 0', values: { f1: 'COMM 1311', f2: 'COEN 2411' } }, { label: 'lowercase prefix', values: { f1: 'geit 1412', f2: 'COEN 2411' } }, { label: 'c2 not found', values: { f1: 'MATH 1423', f2: 'COEN 9999' } }],
    steps: function (v) {
      var R = prun(v), code = R.code, st = [], list = [], n = 0, c1 = null, c2 = null;
      var tl = function (frag, nth) { return L(code, frag, nth); };
      var str = function (c) { return c.p + ' ' + c.no + ': ' + c.ti + '  [' + c.g + ']'; };
      var mk = function (a) { return { id: 'c' + n++, p: a[0], no: a[1], ti: a[2], g: a[3] }; };
      var snap = function (o) { o.list = list.map(function (c) { return { id: c.id, s: str(c) }; }); o.c1 = c1 && list.indexOf(c1); o.c2 = c2 && list.indexOf(c2); st.push(o); return o; };
      var print = function () { return list.map(function (c, i) { return i + ': ' + str(c); }).join('\n') + '\n====================================='; };
      snap({ slide: 14, line: tl('ProgramOfStudy pos = new ProgramOfStudy();'), ph: 'classes', cap: 'Three classes: <b>Course</b> (one course), <b>ProgramOfStudy</b> (an indexed list of courses, using Java’s ArrayList) and <b>POSTester</b> (main, to test it).' });
      var first = mk(C7[0]);
      snap({ slide: 15, line: tl('Course(String prefix, int number') + '-' + tl('this.grade = grade;'), ph: 'course', one: first, cap: 'A <b>Course</b> object keeps prefix, number, title (all final) and grade (not final: it can change). toString() gives a line like “' + h(str(first)) + '”.' });
      list.push(first);
      snap({ slide: 16, line: tl('pos.addCourse("MATH", 1422') + ',' + tl('Course c = new Course(prefix, number, title, grade);') + '-' + tl('list.add(c);'), fresh: 0, cap: 'addCourse(prefix, number, title, grade) builds a Course and <code>list.add(c)</code> puts it at the end: index 0.' });
      C7.slice(1).forEach(function (a) { list.push(mk(a)); });
      snap({ slide: 18, line: (tl('pos.addCourse("PHYS", 1421') + '-' + tl('pos.addCourse("COEN", 2411')), cap: 'Six more courses, each added at the end: indexes 1 to 6.' });
      snap({ slide: 17, line: tl('pos.print();') + ',' + tl('public void print()') + '-' + (tl('public void print()') + 2), cap: 'print() uses the index: <code>i + ": " + list.get(i)</code>. println calls each Course’s toString().', out: print() });
      list.splice(0, 0, mk(['COMM', 1311, 'Written Communication', 'C']));
      snap({ slide: 19, line: tl('pos.addCourse(0, "COMM"') + ',' + tl('list.add(index, c);'), fresh: 0, moved: [1, 7], cap: 'addCourse(<b>0</b>, …) uses the other addCourse (overloading): <code>list.add(index, c)</code>. COMM 1311 goes in at index 0 and all 7 courses move down one place.' });
      list.splice(3, 0, mk(['COMM', 1312, 'Writing and Research', 'C+']));
      snap({ slide: 19, line: tl('pos.addCourse(3, "COMM"') + ',' + tl('list.add(index, c);'), fresh: 3, moved: [4, 8], cap: 'addCourse(<b>3</b>, …): COMM 1312 goes in at index 3. Courses from index 3 on move down. The list now has 9 courses.' });
      snap({ slide: 19, line: tl('pos.print();', 2), cap: 'The second print shows the new indexes.', out: print() });
      var find = function (f, nm, nth) {
        var k = -1; for (var i = 0; i < list.length; i++) if (list[i].p === f[0] && list[i].no === f[1]) { k = i; break; }
        var ln = tl('Course ' + nm + ' = pos.find(') + ',' + tl('for (Course course : list)') + '-' + tl('return course;');
        if (k < 0) snap({ slide: 17, line: tl('Course ' + nm + ' = pos.find(') + ',' + tl('return null;'), scan: [0, list.length - 1], cap: 'find("' + h(f[0]) + '", ' + f[1] + ') checks all ' + list.length + ' courses: none has this prefix <b>and</b> number' + (/[a-z]/.test(f[0]) ? ' (<code>equals</code> is case-sensitive: "' + h(f[0]) + '" is not "' + h(f[0].toUpperCase()) + '")' : '') + '. It returns <b>null</b>.' });
        else snap({ slide: 17, line: ln, scan: [0, k - 1], look: k, pt: [k, nm], cap: 'find("' + h(f[0]) + '", ' + f[1] + '): the for-each loop checks the courses in order. ' + (k ? 'Indexes 0 to ' + (k - 1) + ' do not match. ' : '') + 'Index ' + k + ' matches, so it returns <b>a reference to that Course object</b> (not a copy).' });
        return k < 0 ? null : list[k];
      };
      c1 = find(R.f1, 'c1');
      if (c1) {
        c1.g = 'A+';
        snap({ slide: 19, line: tl('c1.grade = "A+";') + '-' + tl('System.out.println("\\nNew grade'), look: list.indexOf(c1), cap: '<code>c1.grade = "A+"</code> changes the object that <b>is in the list</b>: c1 and the list refer to the same object. No set() is needed.', out: '\nNew grade for ' + str(c1) + '\n' });
      } else snap({ slide: 19, line: tl('if (c1 != null) {'), cap: 'c1 is null, so the if block is skipped: no grade changes and nothing is printed.' });
      c2 = find(R.f2, 'c2');
      var t = c2 ? list.indexOf(c2) : -1, nc = mk(['COEN', 2411, 'Circuits', '']);
      if (t >= 0) { list[t] = nc; c2 = null; snap({ slide: 19, line: tl('pos.replace(c2') + ',' + tl('int targetIndex = list.indexOf(target);') + '-' + tl('if (targetIndex != -1) list.set'), fresh: t, cap: 'replace(c2, new Course(…)): <code>list.indexOf(c2)</code> = ' + t + ', then <code>list.set(' + t + ', newCourse)</code> puts the new Course object in that place.' }); }
      else snap({ slide: 19, line: tl('pos.replace(c2') + ',' + tl('int targetIndex = list.indexOf(target);') + '-' + tl('if (targetIndex != -1) list.set'), cap: 'replace(null, …): <code>list.indexOf(null)</code> is −1 (no element is null), so replace does <b>nothing</b>.' });
      snap({ slide: 19, line: tl('pos.print();', 3), cap: 'The last print.', out: print() });
      return st;
    },
    draw: function (k, s) {
      var items = [];
      if (s.ph === 'classes') {
        items.push(CLS('pt', 30, 40, 150, { name: 'POSTester', methods: ['main(String[])'], tone: 'muted' }));
        items.push(CLS('pp', 210, 40, 170, { name: 'ProgramOfStudy', fields: ['list : List<Course>'], methods: ['addCourse(…)', 'find(…) : Course', 'replace(…)', 'print()'], tone: 'blue' }));
        items.push(CLS('pc', 410, 40, 130, { name: 'Course', fields: ['prefix', 'number', 'title', 'grade'], tone: 'teal' }));
        items.push(A('p1', 180, 70, 210, 70, { tone: 'muted' }));
        items.push(A('p2', 380, 70, 410, 70, { tone: 'muted' }));
        items.push(B('pa', 210, 250, 170, 40, { title: 'ArrayList<Course>', mono: true, size: 12, tone: 'accent', tag: 'list is an' }));
        return items;
      }
      if (s.ph === 'course') {
        items.push(OBJ('co', 140, 60, 280, { name: 'Course', fields: ['prefix = "' + s.one.p + '"', 'number = ' + s.one.no, 'title  = "' + s.one.ti + '"', 'grade  = "' + s.one.g + '"'] }));
        items.push(T('ct', 280, 230, 'toString():', { anchor: 'middle', size: 12, tone: 'muted' }));
        items.push(T('cs', 280, 254, s.one.p + ' ' + s.one.no + ': ' + s.one.ti + '  [' + s.one.g + ']', { anchor: 'middle', mono: true, size: 14, bold: true, tone: 'accent' }));
        return items;
      }
      s.list.forEach(function (c, i) {
        var hot = i === s.fresh || i === s.look, mv = s.moved && i >= s.moved[0] && i <= s.moved[1], sc = s.scan && i >= s.scan[0] && i <= s.scan[1];
        items.push(B(c.id, 30, 30 + i * 32, 330, 26, { title: i + ': ' + c.s, mono: true, size: 11, align: 'left', tone: hot ? 'accent' : mv ? 'teal' : sc ? 'muted' : 'blue', fill: hot ? 'solid' : 'soft', hi: hot, from: i === s.fresh ? [60, 30 + i * 32 - 30] : undefined }));
      });
      if (s.c1 != null && s.c1 >= 0) items.push(P('pc1', 362, 43 + s.c1 * 32, 'c1', { dir: 'left', len: 30 }));
      if (s.pt) items.push(P('p' + s.pt[1], 362, 43 + s.pt[0] * 32, s.pt[1], { dir: 'left', len: 30 }));
      if (s.c2 != null && s.c2 >= 0) items.push(P('pc2', 362, 43 + s.c2 * 32, 'c2', { dir: 'left', len: 30 }));
      items.push(T('ls', 548, 30, 'list (ArrayList)', { anchor: 'end', size: 12, bold: true, tone: 'muted' }));
      items.push(T('lz', 548, 50, 'size() = ' + s.list.length, { anchor: 'end', mono: true, size: 13, bold: true }));
      return items;
    }
  };

  /* ---------- 4. our own ArrayList<T>: shifting (slides 23-29) ---------- */
  var AL = 'package mylist;\n// ArrayList<T> represents an array implementation of List<T>\n// The front of the list is kept always at index 0\npublic class ArrayList<T> implements List<T> {\n  private static final int DEFAULT_CAPACITY = 100;\n  private T[] array;   // array of elements of type T\n  private int count;   // count of elements in the list\n  // Creates an empty list using the default capacity\n  public ArrayList() {\n    this(DEFAULT_CAPACITY);\n  }\n  // Creates an empty list using the specified capacity\n  public ArrayList(int initialCapacity) {\n    array = (T[]) new Object[initialCapacity];\n    count = 0;\n  }\n  // Adds an element e at the rear of the list\n  public void add(T e) {\n    if (count == array.length) expandCapacity();   // if array is full\n    array[count] = e;\n    count++;\n  }\n  // Adds an element e at the given index\n  public void add(int index, T e) throws IndexOutOfBoundsException {\n    if (index < 0 || index > count) throw new\n       IndexOutOfBoundsException("Index: " + index + ", Size: " + size);\n    if (count == array.length) expandCapacity();   // if array is full\n    // Shift the appropriate array elements before adding element e\n    for (int i=count; i>index; i--) array[i] = array[i-1];\n    array[index] = e;\n    count++;\n  }\n  // Removes the first occurrence of element e in the list\n  // Returns true if the element was found and removed\n  public boolean remove(T e) {\n    int index = indexOf(e);\n    if (index == -1) return false;\n    count--;\n    // Shift the appropriate array elements\n    for (int i = index; i < count; i++) {\n      array[i] = array[i+1];\n    }\n    array[count] = null;\n    return true;\n  }\n  // Returns the element at the given index\n  // If index is out of bounds, then an exception is thrown\n  public T get(int index) throws IndexOutOfBoundsException {\n    if (index < 0 || index >= count) throw new\n       IndexOutOfBoundsException("Index: " + index + ", Size: ", count);\n    return array[index];\n  }\n  // Sets the element at the given index to e\n  // If index is out of bounds, then an exception is thrown\n  public void set(int index, T e) throws IndexOutOfBoundsException {\n    if (index < 0 || index >= count) throw new\n       IndexOutOfBoundsException("Index: " + index + ", Size: ", count);\n    array[index] = e;\n  }\n  // Removes and returns the element at the given index\n  public T remove(int index) throws IndexOutOfBoundsException {\n    T element = get(index);\n    count--;\n    // shift the appropriate array elements\n    for (int i = index; i < count; i++) {\n      array[i] = array[i+1];\n    }\n    array[count] = null;\n    return element;\n  }\n  // Index of first occurrence of element e (or -1 if not found)\n  public int indexOf(T e) {\n    for (int i=0; i<count; i++)\n      if (array[i].equals(e)) return i;\n    return -1;\n  }\n  // Returns true if the list contains element e\n  public boolean contains(T e) {\n    int index = indexOf(e);\n    return (index != -1);\n  }\n  // Removes all elements in the list\n  public void clear() {\n    array = (T[]) new Object[DEFAULT_CAPACITY];\n    count = 0;\n  }\n  // not on the slides: the same idea as in ArrayStack\n  private void expandCapacity() { array = java.util.Arrays.copyOf(array, array.length * 2); }\n  public boolean isEmpty() { return count == 0; }\n  public int size() { return count; }\n}';
  function oline(o, v) {
    var q = function (x) { return '"' + x + '"'; };
    return o.k === 'add' ? v + '.add(' + q(o.x) + ');' : o.k === 'addAt' ? v + '.add(' + o.i + ', ' + q(o.x) + ');' : o.k === 'remove' ? 'System.out.println(' + v + '.remove(' + q(o.x) + '));' :
      o.k === 'removeAt' ? 'System.out.println(' + v + '.remove(' + o.i + '));' : o.k === 'get' ? 'System.out.println(' + v + '.get(' + o.i + '));' : o.k === 'set' ? v + '.set(' + o.i + ', ' + q(o.x) + ');' :
      o.k === 'indexOf' ? 'System.out.println(' + v + '.indexOf(' + q(o.x) + '));' : o.k === 'contains' ? 'System.out.println(' + v + '.contains(' + q(o.x) + '));' : v + '.clear();';
  }
  function arun(v) {
    var cap = Math.min(8, Math.max(2, Math.trunc(v.c))), ops = parse(v.ops, true, 3), code = AL.split('\n');
    code.push('', '// in main:', 'List<String> list = new ArrayList<>(' + cap + ');');
    ops.forEach(function (o) { o.line = code.length + 1; code.push(oline(o, 'list')); });
    return { cap: cap, code: code.join('\n'), ops: ops };
  }
  var arraylist = {
    id: 'arraylist', slides: [23, 29], title: 'ArrayList: shift to make room, shift to close the gap',
    code: function (v) { return arun(v).code; },
    inputs: [{ id: 'ops', type: 'text', label: 'operations', value: 'A B C D 1:X -C @2', maxlen: 60 }, { id: 'c', label: 'capacity', value: 6, min: 2, max: 8 }],
    inputsLabel: OPSLABEL + ', <code>clear</code>. Values up to 3 letters.',
    presets: [{ label: 'insert and remove in the middle', values: { ops: 'A B C D 1:X -C @2', c: 6 } }, { label: 'full → expandCapacity', values: { ops: 'A B C 0:Z', c: 3 } }, { label: 'remove by index, set', values: { ops: 'K L M N -0 =1:Q #N', c: 5 } }, { label: 'not found', values: { ops: 'A B -Q #Q ?B', c: 4 } }, { label: 'index out of bounds', values: { ops: 'A B @2', c: 4 } }, { label: 'clear', values: { ops: 'A B clear C', c: 2 } }],
    steps: function (v) {
      var R = arun(v), st = [], arr = [], cnt = 0, n = 0, decl = R.code.split('\n').length - R.ops.length, i, j;
      for (i = 0; i < R.cap; i++) arr.push(null);
      var snap = function (o) { o.arr = arr.map(function (e) { return e && { id: e.id, t: e.t, g: e.g }; }); o.cnt = cnt; st.push(o); return o; };
      var real = function (e) { return { id: e.id, t: e.t }; }, ghost = function (e, at) { return { id: 'g' + at, t: e.t, g: true }; };
      var expand = function (line) { var la = arr.length; arr = arr.concat(arr.map(function () { return null; })); snap({ slide: 25, line: line + ',' + L(AL, 'private void expandCapacity()'), cap: 'count == array.length (' + la + '): the array is <b>full</b>. expandCapacity copies it into a new array of ' + arr.length + ' cells.' }); };
      var shiftLeft = function (index, line, sl) {
        for (j = index; j < cnt; j++) { arr[j] = real(arr[j + 1]); arr[j + 1] = ghost(arr[j], j + 1); snap({ slide: sl, line: line, hi: j, cap: 'i = ' + j + ': <code>array[' + j + '] = array[' + (j + 1) + ']</code>. "' + h(arr[j].t) + '" moves left. (Cell ' + (j + 1) + ' still has a copy for now.)' }); }
      };
      snap({ slide: 23, line: L(AL, 'private T[] array;') + '-' + L(AL, 'private int count;'), ph: 'idea', cap: 'An indexed list in an array: the elements sit in cells 0 to count − 1, with no gaps, and the front is always at index 0.' });
      snap({ slide: 24, line: decl + ',' + L(AL, 'array = (T[]) new Object[initialCapacity];') + '-' + (L(AL, 'array = (T[]) new Object[initialCapacity];') + 1), cap: 'new ArrayList&lt;&gt;(' + R.cap + '): an array of ' + R.cap + ' cells and count = 0. (Without a number, the default capacity is 100.)' });
      for (var k = 0; k < R.ops.length; k++) {
        var o = R.ops[k], ln = o.line;
        if (o.k === 'add') {
          if (cnt === arr.length) expand(ln + ',' + L(AL, 'if (count == array.length) expandCapacity();'));
          arr[cnt] = { id: 'e' + n++, t: o.x }; cnt++;
          snap({ slide: 25, line: ln + ',' + L(AL, 'array[count] = e;') + '-' + (L(AL, 'array[count] = e;') + 1), hi: cnt - 1, fresh: cnt - 1, cap: '<b>add("' + h(o.x) + '")</b>: <code>array[count] = e</code> puts it at index ' + (cnt - 1) + ', then count++ → ' + cnt + '. No shifting: O(1).' });
        } else if (o.k === 'addAt') {
          var ck = L(AL, 'if (index < 0 || index > count) throw new');
          if (o.i > cnt) { snap({ slide: 25, line: ln + ',' + ck + '-' + (ck + 1), err: true, out: bounds2(o.i, cnt), cap: '<b>add(' + o.i + ', "' + h(o.x) + '")</b>: index ' + o.i + ' &gt; count (' + cnt + '), so it throws an <b>IndexOutOfBoundsException</b>. (index == count is allowed: it adds at the end.)' }); break; }
          if (cnt === arr.length) expand(ln + ',' + L(AL, 'if (count == array.length) expandCapacity();', 2));
          var fl = L(AL, 'for (int i=count; i>index; i--)');
          if (cnt === o.i) snap({ slide: 25, line: ln + ',' + fl, cap: 'add(' + o.i + ', …): index == count, so the loop does not run: nothing to shift.' });
          for (j = cnt; j > o.i; j--) { arr[j] = real(arr[j - 1]); arr[j - 1] = ghost(arr[j], j - 1); snap({ slide: 25, line: ln + ',' + fl, hi: j, cap: 'i = ' + j + ': <code>array[' + j + '] = array[' + (j - 1) + ']</code>. "' + h(arr[j].t) + '" moves one cell right. The loop starts at the <b>end</b>, so nothing is overwritten.' }); }
          arr[o.i] = { id: 'e' + n++, t: o.x }; cnt++;
          snap({ slide: 25, line: ln + ',' + L(AL, 'array[index] = e;') + '-' + (L(AL, 'array[index] = e;') + 1), hi: o.i, fresh: o.i, cap: '<code>array[' + o.i + '] = e</code> writes "' + h(o.x) + '" over the old copy, and count++ → ' + cnt + '. Shifted: ' + (cnt - 1 - o.i) + ' element' + (cnt - 1 - o.i === 1 ? '' : 's') + '.' });
        } else if (o.k === 'remove' || o.k === 'indexOf' || o.k === 'contains') {
          var f = -1; for (j = 0; j < cnt; j++) if (arr[j].t === o.x) { f = j; break; }
          var il = L(AL, 'for (int i=0; i<count; i++)') + '-' + L(AL, 'return -1;');
          if (o.k === 'indexOf') { snap({ slide: 29, line: ln + ',' + il, scan: f < 0 ? cnt - 1 : f - 1, hi: f, out: String(f), cap: '<b>indexOf("' + h(o.x) + '")</b> compares with <code>equals</code> from index 0: ' + (f < 0 ? 'not found, returns <b>−1</b>.' : 'found at index <b>' + f + '</b>.') }); continue; }
          if (o.k === 'contains') { snap({ slide: 29, line: ln + ',' + L(AL, 'int index = indexOf(e);', 2) + '-' + L(AL, 'return (index != -1);') + ',' + il, scan: f < 0 ? cnt - 1 : f - 1, hi: f, out: String(f >= 0), cap: '<b>contains("' + h(o.x) + '")</b> calls indexOf → ' + f + ', and returns <code>index != -1</code>: <b>' + (f >= 0) + '</b>.' }); continue; }
          var rl = L(AL, 'int index = indexOf(e);');
          if (f < 0) { snap({ slide: 26, line: ln + ',' + rl + '-' + (rl + 1), scan: cnt - 1, out: 'false', cap: '<b>remove("' + h(o.x) + '")</b>: indexOf returns −1, so it returns <b>false</b>. Nothing changes.' }); continue; }
          var gone = arr[f]; cnt--;
          snap({ slide: 26, line: ln + ',' + rl + '-' + (rl + 2), scan: f - 1, hi: f, res: { id: gone.id + 'r', t: gone.t, lb: 'removing' }, cap: '<b>remove("' + h(o.x) + '")</b>: indexOf finds it at index ' + f + '. count-- → ' + cnt + '. Now the elements after it must move left to close the gap.' });
          shiftLeft(f, ln + ',' + L(AL, 'for (int i = index; i < count; i++) {') + '-' + (L(AL, 'for (int i = index; i < count; i++) {') + 2), 26);
          arr[cnt] = null;
          snap({ slide: 26, line: ln + ',' + L(AL, 'array[count] = null;') + '-' + (L(AL, 'array[count] = null;') + 1), out: 'true', cap: '<code>array[count] = null</code> clears the extra copy in cell ' + cnt + ', and remove returns <b>true</b>.' });
        } else if (o.k === 'get' || o.k === 'set' || o.k === 'removeAt') {
          var gl = o.k === 'set' ? L(AL, 'public void set(int index, T e)') + 1 : L(AL, 'public T get(int index)') + 1;
          if (o.i >= cnt) { snap({ slide: 27, line: ln + ',' + (o.k === 'removeAt' ? L(AL, 'T element = get(index);') + ',' : '') + gl + '-' + (gl + 1), err: true, out: bounds2(o.i, cnt), cap: '<b>' + (o.k === 'removeAt' ? 'remove' : o.k) + '(' + o.i + ')</b>: the index must be less than count (' + cnt + '). It throws an <b>IndexOutOfBoundsException</b>. (On the slide this line has a typo; see the explanation.)' }); break; }
          if (o.k === 'get') { snap({ slide: 27, line: ln + ',' + gl + '-' + (gl + 2), hi: o.i, out: arr[o.i].t, cap: '<b>get(' + o.i + ')</b> = <code>array[' + o.i + ']</code> = "' + h(arr[o.i].t) + '". One step, no loop: <b>O(1)</b>.' }); continue; }
          if (o.k === 'set') { arr[o.i] = { id: 'e' + n++, t: o.x }; snap({ slide: 27, line: ln + ',' + L(AL, 'array[index] = e;', 2), hi: o.i, fresh: o.i, cap: '<b>set(' + o.i + ', "' + h(o.x) + '")</b>: <code>array[' + o.i + '] = e</code> replaces the old element. count stays ' + cnt + '. O(1).' }); continue; }
          var g = arr[o.i]; cnt--;
          snap({ slide: 28, line: ln + ',' + L(AL, 'T element = get(index);') + '-' + (L(AL, 'T element = get(index);') + 1), hi: o.i, res: { id: g.id + 'r', t: g.t, lb: 'element' }, cap: '<b>remove(' + o.i + ')</b>: get(' + o.i + ') checks the index and gives "' + h(g.t) + '". count-- → ' + cnt + '.' });
          shiftLeft(o.i, ln + ',' + L(AL, 'for (int i = index; i < count; i++) {', 2) + '-' + (L(AL, 'for (int i = index; i < count; i++) {', 2) + 2), 28);
          arr[cnt] = null;
          snap({ slide: 28, line: ln + ',' + L(AL, 'array[count] = null;', 2) + '-' + L(AL, 'return element;'), res: { id: g.id + 'r', t: g.t, lb: 'remove returned' }, out: g.t, cap: '<code>array[count] = null</code>, then return "' + h(g.t) + '".' });
        } else {
          arr = []; for (j = 0; j < 100; j++) arr.push(null); cnt = 0;
          snap({ slide: 29, line: ln + ',' + L(AL, 'array = (T[]) new Object[DEFAULT_CAPACITY];') + '-' + (L(AL, 'array = (T[]) new Object[DEFAULT_CAPACITY];') + 1), cap: '<b>clear()</b> makes a <b>new</b> array of DEFAULT_CAPACITY = 100 cells (not ' + R.cap + '!) and count = 0. The old elements are lost.' });
        }
      }
      if (!st[st.length - 1].err) snap({ slide: 29, line: L(AL, 'public int size()'), cap: 'count = ' + cnt + ', array.length = ' + arr.length + '. Shifting makes add(index) and remove at the front <b>O(n)</b>; get and set are <b>O(1)</b>.' });
      return st;
    },
    draw: function (k, s) {
      var items = [], len = s.arr.length, show = Math.min(len, 12), cw = Math.min(58, Math.floor(520 / show)), x0 = 280 - show * cw / 2, y = 130;
      if (s.ph === 'idea') {
        ['A', 'B', 'C', 'D', null, null, null, null].forEach(function (t, i) { items.push(B('ic' + i, 50 + i * 58, y, 56, 46, { tone: 'muted', dash: !t })); if (t) items.push(B('ie' + i, 55 + i * 58, y + 5, 46, 36, { title: t, mono: true, size: 14, tone: 'blue', z: 2 })); items.push(T('ii' + i, 78 + i * 58, y - 12, String(i), { anchor: 'middle', mono: true, size: 11, tone: 'muted' })); });
        items.push(T('ict', 280, 230, 'count = 4: indexes 0 … count − 1 are used', { anchor: 'middle', mono: true, size: 14, bold: true, tone: 'accent' }));
        return items;
      }
      for (var i = 0; i < show; i++) {
        var e = s.arr[i], hot = i === s.hi, sc = s.scan != null && i <= s.scan, x = x0 + i * cw;
        items.push(B('cell' + i, x, y, cw - 2, 46, { tone: hot ? 'accent' : i < s.cnt ? 'muted' : 'muted', dash: i >= s.cnt, r: 4 }));
        items.push(T('ci' + i, x + cw / 2 - 1, y - 10, String(i), { anchor: 'middle', mono: true, size: 11, tone: hot ? 'accent' : 'muted', bold: hot }));
        if (e) items.push(B(e.id, x + 4, y + 5, cw - 10, 36, { title: e.t, mono: true, size: cw < 40 ? 11 : 14, tone: e.g ? 'muted' : hot ? 'accent' : sc ? 'teal' : 'blue', fill: hot && !e.g ? 'solid' : 'soft', dash: e.g, o: e.g ? 0.55 : 1, hi: hot && !e.g, z: 2, from: i === s.fresh ? [x, y - 80] : undefined }));
      }
      if (len > show) items.push(T('more', 280, y + 76, '… ' + (len - show) + ' more empty cells (array.length = ' + len + ')', { anchor: 'middle', size: 12, tone: 'muted' }));
      if (s.cnt < show) items.push(P('pcnt', x0 + s.cnt * cw + cw / 2 - 1, y + 50, 'count', { dir: 'up', len: 24 }));
      items.push(T('cn', 30, 40, 'count = ' + s.cnt, { mono: true, size: 15, bold: true, tone: 'accent' }));
      items.push(T('al', 30, 64, 'array.length = ' + len, { mono: true, size: 13, tone: 'muted' }));
      if (s.res) items.push(B(s.res.id, 400, 250, 120, 40, { title: s.res.t, mono: true, size: 15, tone: 'accent', fill: 'solid', hi: true, tag: s.res.lb }));
      if (s.err) items.push(T('er', 280, 280, 'IndexOutOfBoundsException', { anchor: 'middle', mono: true, size: 15, bold: true, tone: 'red' }));
      return items;
    }
  };

  /* ---------- 5. our own doubly linked LinkedList<T> (slides 31-44) ---------- */
  var LL = 'package mylist;\n// The LinkedList<T> class is a doubly-linked implementation of List<T>\npublic class LinkedList<T> implements List<T> {\n  private Node<T> front;   // reference to front node\n  private Node<T> rear;    // reference to rear node\n  private int count;       // count of elements in the list\n  // Constructor of an empty LinkedList object\n  public LinkedList() {\n    front = rear = null;\n    count = 0;\n  }\n  private static class Node<T> {   // Generic doubly-linked node\n    Node<T> next;                  // Pointer to next node\n    Node<T> prev;                  // Pointer to previous node\n    T element;                     // Reference to an element\n    Node(T elem) {                 // Constructor of a new node\n      next = prev = null;\n      element = elem;              // References elem of type T\n    }\n  }\n  // Returns a reference to the node at the given index\n  private Node<T> nodeAt(int index) throws IndexOutOfBoundsException {\n    if (index < 0 || index >= count) throw new\n        IndexOutOfBoundsException("Index: " + index + ", Size: " + count);\n    if (index < count/2) {\n      Node<T> node = front;    // Start at the front node\n      for (int i = 0; i < index; i++) node = node.next;\n      return node;             // Reference to node at given index\n    }\n    Node<T> node = rear;       // Start at the rear node\n    for (int i = count-1; i > index; i--) node = node.prev;\n    return node;               // Reference to node at given index\n  }\n  // Returns the element at the given index\n  // Throws an exception if the index is out of bounds\n  public T get(int index) throws IndexOutOfBoundsException {\n    Node<T> node = nodeAt(index);\n    return node.element;\n  }\n  // Sets the element at the given index to e\n  // Throws an exception if the index is out of bounds\n  public void set(int index, T e) throws IndexOutOfBoundsException {\n    Node<T> node = nodeAt(index);\n    node.element = e;\n  }\n  // Adds an element e at the rear of the list\n  public void add(T e) {\n    Node<T> node = new Node<>(e);   // New node for element e\n    if (count==0)                   // If empty list\n      front = node;                 // add a front node\n    else {\n      rear.next = node;             // Link rear to node\n      node.prev = rear;             // Link node to rear\n    }\n    rear = node;                    // rear now points to node\n    count++;                        // Count the newly added node\n  }\n  // Adds an element e at the given index in the list\n  public void add(int index, T e) throws IndexOutOfBoundsException {\n    if (index < 0 || index > count) throw new\n     IndexOutOfBoundsException("Index: " + index + ", Size: " + count);\n    if (index==count) {add(e); return;}  // Add a rear node for element e\n    Node<T> node = new Node<>(e);   // Create new node for element e\n    Node<T> next = nodeAt(index);   // Locate next node at index\n    Node<T> prev = next.prev;       // Reference to previous node\n    node.next = next;               // Link new node to next node\n    node.prev = prev;               // Link new node to previous node\n    next.prev = node;               // Link next node to new node\n    if (prev == null) front = node; // Add a head node at index 0\n    else prev.next = node;          // Link previous node to new node\n    count++;                        // Count the newly added node\n  }\n  // Removes and returns the element at the given index\n  // Throws an exception if the index is out of bounds\n  public T remove(int index) throws IndexOutOfBoundsException {\n    if (index < 0 || index >= count) throw new\n    IndexOutOfBoundsException("Index: " + index + ", Size: " + count);\n    Node<T> node = nodeAt(index);   // Locate node at index\n    removeNode(node);               // Remove current node\n    return node.element;            // Reference to node element\n  }\n  // Helper method to remove a node from a doubly-linked list\n  // Relinks the previous node to the next node\n  private void removeNode(Node<T> node) {\n    Node<T> next = node.next;       // Reference to next node\n    Node<T> prev = node.prev;       // Reference to previous node\n    node.next = null;               // Unlink the next node\n    node.prev = null;               // Unlink the previous node\n    if (prev != null) prev.next=next;   // Relink prev node to next\n    if (next != null) next.prev=prev;   // Relink next node to prev\n    if (node == front) front = next;    // Adjust the front pointer\n    if (node == rear)  rear = prev;     // Adjust the rear pointer\n    count--;                            // Decrement count of nodes\n  }\n  // Removes the first occurrence of element e in the list\n  // Returns true if the element was found and node is removed\n  public boolean remove(T e) {\n    // Search for the first occurrence of element e\n    Node<T> node = front;           // Start at the front node\n    while (node != null && !e.equals(node.element))\n      node = node.next;\n    if (node == null) return false; // Element e was not found\n    removeNode(node);               // Remove current node\n    return true;                    // Return success\n  }\n  // Returns index of first occurrence of element e (or -1 if not found)\n  public int indexOf(T e) {\n    Node<T> node = front;                     // Start at the front node\n    for (int i=0; i<count; i++) {             // Loop traverses the list\n      if (e.equals(node.element)) return i;   // return index i if found\n      node = node.next;                       // point to next node\n    }\n    return -1;                                // Element e was not found\n  }\n  // Returns true if the linked list contains element e\n  public boolean contains(T e) {\n    int index = indexOf(e); return (index != -1);\n  }\n  // Removes all elements in the linked list\n  public void clear() {\n    front = rear = null; count = 0;\n  }\n  // not on the slides\n  public boolean isEmpty() { return count == 0; }\n  public int size() { return count; }\n}';
  function lrun(v) {
    var ops = parse(v.ops, true, 3), code = LL.split('\n');
    code.push('', '// in main:', 'List<String> list = new LinkedList<>();');
    ops.forEach(function (o) { o.line = code.length + 1; code.push(oline(o, 'list')); });
    return { code: code.join('\n'), ops: ops };
  }
  /* draws a doubly linked list. s: N {id: {t, next, prev}}, row (ids in list order), fl (a node out of the row) and
     gap (its place in the row), front, rear, count, cur / curLb (a walking reference), pv / nx (prev and next locals),
     lk (arrow ids to highlight), hot, born, single (only next links), res, err */
  function dlDraw(s) {
    var out = [], y = 104, fy = 226, slots = s.row.length + (s.gap != null ? 1 : 0);
    var st = Math.min(88, Math.floor(500 / Math.max(slots, 1))), w = Math.min(50, st - 30), x0 = Math.round((560 - ((slots - 1) * st + w)) / 2);
    var pos = {}, r = 0, lk = s.lk || [];
    for (var i = 0; i < slots; i++) {
      if (i === s.gap) { if (s.fl) pos[s.fl] = { x: x0 + i * st, y: fy, f: true }; continue; }
      pos[s.row[r++]] = { x: x0 + i * st, y: y };
    }
    var link = function (aid, p, tid, dy, fwd) {
      var tone = lk.indexOf(aid) >= 0 ? 'accent' : fwd ? 'blue' : 'teal';
      if (tid == null) {
        if (!p.f && !(s.single && !fwd)) {
          var ex = fwd ? p.x + w : p.x, d = fwd ? 1 : -1;
          out.push(A(aid, ex, p.y + dy, ex + d * 14, p.y + dy, { head: false, tone: lk.indexOf(aid) >= 0 ? 'accent' : 'muted' }));
          out.push(B(aid + 'z', fwd ? ex + 14 : ex - 22, p.y + dy - 4, 8, 8, { tone: 'muted', fill: 'solid', r: 1 }));
        }
        return;
      }
      var q = pos[tid]; if (!q) return;
      var sx = fwd ? p.x + w : p.x, ex2 = fwd ? q.x : q.x + w, sy = p.y + dy, ey = q.y + dy;
      if (sy === ey) out.push(A(aid, sx, sy, ex2, ey, { tone: tone }));
      else { var mx = (sx + ex2) / 2 + (fwd ? -6 : 6); out.push(A(aid, sx, sy, ex2, ey, { via: [[mx, sy], [mx, ey]], tone: tone })); }
    };
    Object.keys(pos).forEach(function (id) {
      var nd = s.N[id], p = pos[id], hot = s.hot === id || s.cur === id;
      out.push(B(id, p.x, p.y, w, 40, { title: nd.t, mono: true, size: w < 40 ? 12 : 14, tone: p.f ? (s.rm ? 'red' : 'accent') : hot ? 'accent' : 'blue', fill: hot || (p.f && !s.rm) ? 'solid' : 'soft', hi: hot, tag: p.f ? 'node' : undefined, from: s.born === id ? [p.x, p.y + 70] : undefined }));
      link('n' + id, p, nd.next, 12, true);
      if (!s.single) link('p' + id, p, nd.prev, 28, false);
    });
    var ptr = function (pid, id, label, below) {
      var p = pos[id]; if (!p) return;
      if (p.f) out.push(P(pid, p.x + w / 2, p.y - 18, label, { dir: 'down', len: 16 }));
      else if (below) out.push(P(pid, p.x + w / 2, p.y + 44, label, { dir: 'up', len: 22 }));
      else out.push(P(pid, p.x + w / 2, p.y - 4, label, { dir: 'down', len: 24 }));
    };
    if (s.front != null && s.front === s.rear) ptr('pfront', s.front, 'front rear');
    else { if (s.front != null) ptr('pfront', s.front, 'front'); if (s.rear != null) ptr('prear', s.rear, 'rear'); }
    if (s.cur != null) ptr('pcur', s.cur, s.curLb || 'node', true);
    if (s.pv != null && s.pv !== s.nx) ptr('ppv', s.pv, 'prev', true);
    if (s.nx != null) ptr('pnx', s.nx, s.pv === s.nx ? 'prev next' : 'next', true);
    if (!slots) out.push(T('emp', 280, y + 26, 'front = rear = null', { anchor: 'middle', mono: true, size: 15, tone: 'muted' }));
    out.push(T('cnt', 20, 34, 'count = ' + (s.count != null ? s.count : s.row.length), { mono: true, size: 15, bold: true, tone: 'accent' }));
    if (s.res) out.push(B(s.res.id, 420, 290, 120, 38, { title: s.res.t, mono: true, size: 15, tone: 'accent', fill: 'solid', hi: true, tag: s.res.lb }));
    if (s.err) out.push(T('er', 280, 312, 'IndexOutOfBoundsException', { anchor: 'middle', mono: true, size: 15, bold: true, tone: 'red' }));
    if (s.note) out.push(T('nt', 280, 300, s.note, { anchor: 'middle', size: 13, bold: true, tone: s.noteTone || 'muted' }));
    return out;
  }
  var dlist = {
    id: 'dlist', slides: [31, 44], title: 'A doubly linked list: next and prev', vb: [560, 340],
    code: function (v) { return lrun(v).code; },
    inputs: [{ id: 'ops', type: 'text', label: 'operations', value: 'A B C D 2:X -1', maxlen: 60 }],
    inputsLabel: OPSLABEL + ', <code>clear</code>. Values up to 3 letters.',
    presets: [{ label: 'insert and remove in the middle', values: { ops: 'A B C D 2:X -1' } }, { label: 'insert at index 0', values: { ops: 'K L M 0:Z' } }, { label: 'nodeAt from the rear', values: { ops: 'P Q R S T @3 -4' } }, { label: 'remove by value', values: { ops: 'A B C -B -Q #C' } }, { label: 'remove the only node', values: { ops: 'A -0 ?A' } }, { label: 'index out of bounds', values: { ops: 'A B 3:X' } }],
    steps: function (v) {
      var R = lrun(v), st = [], M = { N: {}, front: null, rear: null, count: 0, row: [], fl: null, gap: null }, ids = 0, decl = R.code.split('\n').length - R.ops.length;
      var snap = function (o) {
        if (!o.N) { var N = {}; for (var q in M.N) N[q] = { t: M.N[q].t, next: M.N[q].next, prev: M.N[q].prev }; o.N = N; o.front = M.front; o.rear = M.rear; o.count = M.count; o.row = M.row.slice(); o.fl = M.fl; o.gap = M.gap; }
        st.push(o); return o;
      };
      var T4 = function (t) { return '"' + h(M.N[t] ? M.N[t].t : t) + '"'; };
      /* the slide 31 and 32 pictures */
      var demo = function (single) { var N = {}, row = ['dA', 'dB', 'dC', 'dD']; row.forEach(function (id, i) { N[id] = { t: id.slice(1), next: row[i + 1] || null, prev: single ? null : row[i - 1] || null }; }); return { N: N, row: row, front: 'dA', rear: 'dD', count: 4, single: single }; };
      var d1 = demo(true); d1.slide = 31; d1.line = L(LL, 'private Node<T> front;') + '-' + L(LL, 'private int count;'); d1.cap = 'A <b>singly</b> linked list (like LinkedQueue): each node only knows the <b>next</b> node. Removing the front is easy: front = front.next.'; snap(d1);
      var d2 = demo(true); d2.slide = 31; d2.line = d1.line; d2.cur = 'dC'; d2.curLb = 'walk to C'; d2.lk = ['ndA', 'ndB']; d2.note = 'to remove D, rear must move back to C: walk from the front, O(n)'; d2.noteTone = 'red'; d2.cap = 'But to remove the <b>rear</b> (D) we need the node <b>before</b> it, and D has no link back. We must walk from the front: <b>O(n)</b>. The same problem for a node in the middle.'; snap(d2);
      var d3 = demo(false); d3.slide = 32; d3.line = L(LL, 'Node<T> next;') + '-' + L(LL, 'Node<T> prev;'); d3.cap = 'A <b>doubly</b> linked list: every node has <b>next</b> (blue, forward) and <b>prev</b> (green, backward). The front’s prev and the rear’s next are null. We can walk both ways, and a node can reach its neighbours in O(1).'; snap(d3);
      snap({ slide: 33, line: decl + ',' + L(LL, 'public LinkedList() {') + '-' + (L(LL, 'public LinkedList() {') + 3), cap: 'Our LinkedList&lt;T&gt; implements our List&lt;T&gt; with front, rear and count. The constructor makes an empty list: <code>front = rear = null; count = 0</code>.' });
      var nodeAt = function (index, ln, sl, verb) {
        var half = Math.floor(M.count / 2), id, i;
        if (index < half) {
          id = M.front; snap({ slide: sl, line: ln + ',' + L(LL, 'if (index < count/2) {') + '-' + L(LL, 'Node<T> node = front;    // Start'), cur: id, curLb: 'node', cap: verb + ' calls <b>nodeAt(' + index + ')</b>: ' + index + ' &lt; count/2 = ' + half + ', so the walk starts at the <b>front</b>.' });
          for (i = 0; i < index; i++) { id = M.N[id].next; snap({ slide: sl, line: ln + ',' + L(LL, 'for (int i = 0; i < index; i++) node = node.next;'), cur: id, curLb: 'node', lk: ['n' + M.N[id].prev], cap: 'node = node.next → index ' + (i + 1) + (i + 1 === index ? ': arrived.' : '.') }); }
        } else {
          id = M.rear; snap({ slide: sl, line: ln + ',' + L(LL, 'Node<T> node = rear;') + (M.count - 1 > index ? '' : ',' + L(LL, 'return node;', 2)), cur: id, curLb: 'node', cap: verb + ' calls <b>nodeAt(' + index + ')</b>: ' + index + ' is not &lt; count/2 = ' + half + ', so the walk starts at the <b>rear</b> and goes back with prev.' + (M.count - 1 === index ? ' The rear is already at index ' + index + '.' : '') });
          for (i = M.count - 1; i > index; i--) { id = M.N[id].prev; snap({ slide: sl, line: ln + ',' + L(LL, 'for (int i = count-1; i > index; i--) node = node.prev;'), cur: id, curLb: 'node', lk: ['p' + M.N[id].next], cap: 'node = node.prev → index ' + (i - 1) + (i - 1 === index ? ': arrived. At most count/2 steps either way.' : '.') }); }
        }
        return id;
      };
      var addRear = function (x, ln) {
        var id = 'd' + ids++; M.N[id] = { t: x, next: null, prev: null }; M.fl = id; M.gap = M.row.length;
        snap({ slide: 37, line: ln + ',' + L(LL, 'Node<T> node = new Node<>(e);   // New node'), born: id, cap: '<b>add("' + h(x) + '")</b>: a new node for "' + h(x) + '". Its next and prev are null.' });
        if (!M.count) { M.front = id; snap({ slide: 37, line: ln + ',' + L(LL, 'if (count==0)') + '-' + L(LL, '// add a front node'), cap: 'The list is empty, so <code>front = node</code>.' }); }
        else { var r0 = M.rear; M.N[r0].next = id; M.N[id].prev = r0; snap({ slide: 37, line: ln + ',' + L(LL, 'rear.next = node;') + '-' + L(LL, 'node.prev = rear;'), lk: ['n' + r0, 'p' + id], cap: '<code>rear.next = node</code> and <code>node.prev = rear</code>: the old rear (' + T4(r0) + ') and the new node are linked <b>both ways</b>.' }); }
        M.rear = id; M.count++; M.row.push(id); M.fl = null; M.gap = null;
        snap({ slide: 37, line: ln + ',' + L(LL, '// rear now points to node') + '-' + L(LL, 'count++;', 1), hot: id, cap: '<code>rear = node</code>, count++ → ' + M.count + '. No walking: O(1).' });
      };
      var removeNode = function (id, ln) {
        var nx = M.N[id].next, pv = M.N[id].prev, at = M.row.indexOf(id);
        M.row.splice(at, 1); M.fl = id; M.gap = at;
        snap({ slide: 42, line: ln + ',' + L(LL, 'Node<T> next = node.next;') + '-' + L(LL, 'Node<T> prev = node.prev;'), rm: true, pv: pv, nx: nx, cap: '<b>removeNode</b>: keep <code>next = node.next</code> (' + (nx ? T4(nx) : 'null') + ') and <code>prev = node.prev</code> (' + (pv ? T4(pv) : 'null') + '). (The drawing moves the node down; its links are still there.)' });
        M.N[id].next = null; M.N[id].prev = null;
        snap({ slide: 42, line: ln + ',' + L(LL, 'node.next = null;') + '-' + L(LL, 'node.prev = null;'), rm: true, pv: pv, nx: nx, cap: '<code>node.next = null; node.prev = null;</code>: the node lets go of its neighbours.' });
        if (pv != null) M.N[pv].next = nx;
        if (nx != null) M.N[nx].prev = pv;
        snap({ slide: 42, line: ln + ',' + L(LL, 'if (prev != null) prev.next=next;') + '-' + L(LL, 'if (next != null) next.prev=prev;'), rm: true, pv: pv, nx: nx, lk: [pv ? 'n' + pv : 'x', nx ? 'p' + nx : 'x'], cap: (pv ? '<code>prev.next = next</code>' : 'prev is null (no node before it)') + ' and ' + (nx ? '<code>next.prev = prev</code>' : 'next is null (no node after it)') + ': the neighbours now <b>skip</b> the node.' });
        var adj = [];
        if (id === M.front) { M.front = nx; adj.push('it was the front, so <code>front = next</code>'); }
        if (id === M.rear) { M.rear = pv; adj.push('it was the rear, so <code>rear = prev</code>'); }
        if (adj.length) snap({ slide: 42, line: ln + ',' + L(LL, 'if (node == front) front = next;') + '-' + L(LL, 'if (node == rear)  rear = prev;'), rm: true, pv: pv, nx: nx, cap: adj.join(', and ') + '.' + (M.front == null ? ' The list is now empty.' : '') });
        M.count--; M.fl = null; M.gap = null; delete M.N[id];
        return { pv: pv, nx: nx };
      };
      var lineOf = function (frag, nth) { return L(LL, frag, nth); };
      for (var k = 0; k < R.ops.length; k++) {
        var o = R.ops[k], ln = o.line, id, j;
        if (o.k === 'add') addRear(o.x, ln);
        else if (o.k === 'addAt') {
          var ck = lineOf('if (index < 0 || index > count) throw new');
          if (o.i > M.count) { snap({ slide: 39, line: ln + ',' + ck + '-' + (ck + 1), err: true, out: bounds2(o.i, M.count), cap: '<b>add(' + o.i + ', "' + h(o.x) + '")</b>: index ' + o.i + ' &gt; count (' + M.count + '): IndexOutOfBoundsException.' }); break; }
          if (o.i === M.count) { snap({ slide: 39, line: ln + ',' + lineOf('if (index==count) {add(e); return;}'), cap: '<b>add(' + o.i + ', "' + h(o.x) + '")</b>: index == count, so it calls add(e) to add a rear node, and returns.' }); addRear(o.x, ln + ',' + lineOf('if (index==count) {add(e); return;}')); continue; }
          id = 'd' + ids++; M.N[id] = { t: o.x, next: null, prev: null }; M.fl = id; M.gap = o.i;
          snap({ slide: 39, line: ln + ',' + lineOf('// Create new node'), born: id, cap: '<b>add(' + o.i + ', "' + h(o.x) + '")</b>: create the new node. (The drawing makes room at index ' + o.i + '; in memory, no node moves.)' });
          var nx = nodeAt(o.i, ln + ',' + lineOf('Node<T> next = nodeAt(index);'), 39, 'add'), pv = M.N[nx].prev;
          snap({ slide: 38, line: ln + ',' + lineOf('Node<T> next = nodeAt(index);') + '-' + lineOf('Node<T> prev = next.prev;'), pv: pv, nx: nx, cap: '<code>next</code> = the node at index ' + o.i + ' (' + T4(nx) + '), <code>prev = next.prev</code> (' + (pv ? T4(pv) : 'null: we add at index 0') + '). The new node goes between them.' });
          M.N[id].next = nx; snap({ slide: 38, line: ln + ',' + lineOf('node.next = next;'), pv: pv, nx: nx, lk: ['n' + id], cap: '① <code>node.next = next</code>.' });
          M.N[id].prev = pv; snap({ slide: 38, line: ln + ',' + lineOf('node.prev = prev;'), pv: pv, nx: nx, lk: ['p' + id], cap: '② <code>node.prev = prev</code>' + (pv ? '.' : ' (null).') + ' The new node is linked, but the list does not know it yet.' });
          M.N[nx].prev = id; snap({ slide: 38, line: ln + ',' + lineOf('next.prev = node;'), pv: pv, nx: nx, lk: ['p' + nx], cap: '③ <code>next.prev = node</code>: ' + T4(nx) + ' now points back to the new node' + (pv ? ', not to ' + T4(pv) : '') + '.' });
          if (pv == null) { M.front = id; snap({ slide: 38, line: ln + ',' + lineOf('if (prev == null) front = node;'), pv: pv, nx: nx, cap: '④ prev is null (index 0), so <code>front = node</code>: the new node is the new front.' }); }
          else { M.N[pv].next = id; snap({ slide: 38, line: ln + ',' + lineOf('else prev.next = node;'), pv: pv, nx: nx, lk: ['n' + pv], cap: '④ <code>prev.next = node</code>. The old links between ' + T4(pv) + ' and ' + T4(nx) + ' are replaced: 4 links changed.' }); }
          M.count++; M.row.splice(o.i, 0, id); M.fl = null; M.gap = null;
          snap({ slide: 39, line: ln + ',' + lineOf('count++;', 2), hot: id, cap: 'count++ → ' + M.count + '. "' + h(o.x) + '" is at index ' + o.i + '. Only links changed; no element was copied.' });
        } else if (o.k === 'removeAt') {
          var rk = lineOf('public T remove(int index)') + 1;
          if (o.i >= M.count) { snap({ slide: 41, line: ln + ',' + rk + '-' + (rk + 1), err: true, out: bounds2(o.i, M.count), cap: '<b>remove(' + o.i + ')</b>: the index must be less than count (' + M.count + '): IndexOutOfBoundsException.' }); break; }
          id = nodeAt(o.i, ln + ',' + lineOf('// Locate node at index'), 41, 'remove(' + o.i + ')');
          var tx = M.N[id].t;
          removeNode(id, ln + ',' + lineOf('removeNode(node);', 1));
          snap({ slide: 41, line: ln + ',' + lineOf('// Reference to node element'), res: { id: id, t: tx, lb: 'remove returned' }, out: tx, cap: 'count-- → ' + M.count + '. remove(' + o.i + ') returns "' + h(tx) + '". No shifting: only the links around it changed.' });
        } else if (o.k === 'remove') {
          id = M.front; var wl = lineOf('while (node != null && !e.equals(node.element))');
          snap({ slide: 43, line: ln + ',' + (lineOf('// Search for the first occurrence') + 1), cur: id, curLb: 'node', cap: '<b>remove("' + h(o.x) + '")</b>: search from the front for the first node whose element equals "' + h(o.x) + '".' });
          while (id != null && M.N[id].t !== o.x) { id = M.N[id].next; snap({ slide: 43, line: ln + ',' + wl + '-' + (wl + 1), cur: id, curLb: 'node', cap: id ? 'Not equal: node = node.next.' : 'Not equal, and node.next is null: node = null.' }); }
          if (id == null) { snap({ slide: 43, line: ln + ',' + lineOf('if (node == null) return false;'), out: 'false', cap: 'node == null: "' + h(o.x) + '" is not in the list. remove returns <b>false</b>.' }); continue; }
          snap({ slide: 43, line: ln + ',' + wl, cur: id, curLb: 'node', cap: 'Found "' + h(o.x) + '": the loop stops. Now removeNode(node).' });
          removeNode(id, ln + ',' + lineOf('removeNode(node);', 2));
          snap({ slide: 43, line: ln + ',' + lineOf('// Return success'), out: 'true', cap: 'count-- → ' + M.count + '. remove returns <b>true</b>.' });
        } else if (o.k === 'get' || o.k === 'set') {
          var nl = lineOf('if (index < 0 || index >= count) throw new');
          if (o.i >= M.count) { snap({ slide: 35, line: ln + ',' + lineOf('Node<T> node = nodeAt(index);', o.k === 'get' ? 1 : 2) + ',' + nl + '-' + (nl + 1), err: true, out: bounds2(o.i, M.count), cap: '<b>' + o.k + '(' + o.i + ')</b>: nodeAt checks the index first. ' + o.i + ' &gt;= count (' + M.count + '): IndexOutOfBoundsException.' }); break; }
          id = nodeAt(o.i, ln + ',' + lineOf('Node<T> node = nodeAt(index);', o.k === 'get' ? 1 : 2), 36, o.k + '(' + o.i + ')');
          if (o.k === 'get') snap({ slide: 36, line: ln + ',' + lineOf('return node.element;'), hot: id, out: M.N[id].t, cap: 'get returns node.element = "' + h(M.N[id].t) + '". In a linked list, get needs a walk: up to n/2 steps.' });
          else { var old = M.N[id].t; M.N[id].t = o.x; snap({ slide: 36, line: ln + ',' + lineOf('node.element = e;'), hot: id, cap: 'set: <code>node.element = e</code>: "' + h(old) + '" becomes "' + h(o.x) + '". The links do not change.' }); }
        } else if (o.k === 'indexOf' || o.k === 'contains') {
          var il = lineOf('// Loop traverses the list');
          id = M.front; var f = -1;
          for (j = 0; j < M.count; j++) {
            if (M.N[id].t === o.x) { f = j; snap({ slide: 44, line: ln + ',' + lineOf('if (e.equals(node.element)) return i;'), cur: id, curLb: 'i = ' + j, cap: 'i = ' + j + ': equal! return ' + j + '.' }); break; }
            snap({ slide: 44, line: ln + ',' + il + '-' + (il + 2), cur: id, curLb: 'i = ' + j, cap: 'i = ' + j + ': "' + h(M.N[id].t) + '" is not "' + h(o.x) + '": node = node.next.' });
            id = M.N[id].next;
          }
          if (f < 0) snap({ slide: 44, line: ln + ',' + lineOf('return -1;'), cap: 'The loop ends: not found, return −1.' });
          if (o.k === 'contains') snap({ slide: 44, line: ln + ',' + lineOf('int index = indexOf(e); return (index != -1);'), out: String(f >= 0), cap: 'contains returns <code>index != -1</code>: <b>' + (f >= 0) + '</b>.' });
          else st[st.length - 1].out = String(f);
        } else {
          M.N = {}; M.row = []; M.front = M.rear = null; M.count = 0;
          snap({ slide: 44, line: ln + ',' + lineOf('front = rear = null; count = 0;'), cap: '<b>clear()</b>: <code>front = rear = null; count = 0</code>. The nodes are no longer reachable, so Java’s garbage collector frees them.' });
        }
      }
      if (!st[st.length - 1].err) snap({ slide: 44, line: lineOf('public int size()'), cap: 'count = ' + M.count + '. In this list, add/remove at the front or rear are O(1); at an index, nodeAt walks up to n/2 nodes.' });
      return st;
    },
    draw: function (k, s) { return dlDraw(s); }
  };

  /* ---------- 6. time complexity: shifts vs hops (slide 45) ---------- */
  var CX = 'operation        ArrayList (n elements)      LinkedList (n elements)\nadd(e)           O(1): no shifting           O(1): no traversal\nadd(index, e)    shift n − index elements    walk min(index, n − index) nodes\nremove(index)    shift n − 1 − index         walk min(index, n − 1 − index)\nget(index), set  O(1): array indexing        walk min(index, n − 1 − index)\nindexOf(e)       O(n) if not found           O(n) if not found\nexpandCapacity   O(n): copy n elements       not needed';
  var cost = {
    id: 'cost', slides: [45, 45], title: 'Shifts in an array, hops in a linked list', lang: 'text',
    code: CX,
    inputs: [{ id: 'n', label: 'n (elements)', value: 8, min: 2, max: 12 }, { id: 'i', label: 'index', value: 0, min: 0, max: 12 }],
    presets: [{ label: 'index 0', values: { n: 8, i: 0 } }, { label: 'middle (n/2)', values: { n: 8, i: 4 } }, { label: 'the end', values: { n: 8, i: 7 } }, { label: 'n = 12, index 3', values: { n: 12, i: 3 } }],
    steps: function (v) {
      var n = Math.trunc(v.n), i = Math.min(Math.trunc(v.i), n), r = Math.min(i, n - 1), st = [];
      var hops = function (x, cnt) { return x < Math.floor(cnt / 2) ? x : cnt - 1 - x; };
      st.push({ line: 3, op: 'add', i: i, n: n, sh: n - i, hp: i === n ? 0 : hops(i, n), cap: '<b>add(' + i + ', e)</b> with n = ' + n + ': the ArrayList shifts <b>' + (n - i) + '</b> element' + (n - i === 1 ? '' : 's') + ' right. The LinkedList walks <b>' + (i === n ? 0 : hops(i, n)) + '</b> node' + ((i === n ? 0 : hops(i, n)) === 1 ? '' : 's') + (i === n ? ' (index == count: it is just add(e))' : ' to reach index ' + i) + ', then changes 4 links.' });
      st.push({ line: 4, op: 'remove', i: r, n: n, sh: n - 1 - r, hp: hops(r, n), cap: '<b>remove(' + r + ')</b>: the ArrayList shifts <b>' + (n - 1 - r) + '</b> element' + (n - 1 - r === 1 ? '' : 's') + ' left; the LinkedList walks <b>' + hops(r, n) + '</b> node' + (hops(r, n) === 1 ? '' : 's') + '. Index 0 is the worst case for the array but the best for the linked list.' });
      st.push({ line: 5, op: 'get', i: r, n: n, sh: 0, hp: hops(r, n), cap: '<b>get(' + r + ')</b>: the ArrayList jumps straight to array[' + r + ']: <b>O(1)</b>. The LinkedList must walk <b>' + hops(r, n) + '</b> node' + (hops(r, n) === 1 ? '' : 's') + '. Its worst case is the middle: about n/2, so O(n).' });
      st.push({ line: '2-7', op: 'sum', i: r, n: n, sh: 0, hp: 0, cap: 'No list is best for everything: the <b>ArrayList</b> is good for get/set by index; the <b>LinkedList</b> is good for adding and removing at the two ends.' });
      return st.map(function (s) { s.slide = 45; return s; });
    },
    draw: function (k, s) {
      var items = [], n = s.n, cw = Math.min(42, Math.floor(480 / n)), x0 = 280 - n * cw / 2;
      if (s.op === 'sum') {
        [['ArrayList', ['get / set: O(1)', 'add / remove at the rear: O(1)', 'add / remove at index 0: O(n)']], ['LinkedList', ['get / set: O(n)', 'add / remove at the rear: O(1)', 'add / remove at index 0: O(1)']]].forEach(function (c, j) {
          items.push(B('sm' + j, 30 + j * 260, 60, 240, 130, { title: c[0], mono: true, lines: c[1], tone: j ? 'teal' : 'blue' }));
        });
        return items;
      }
      items.push(T('t1', 20, 40, 'ArrayList', { size: 14, bold: true, tone: 'blue' }));
      var sl = s.op === 'add' ? [s.i, n - 1] : s.op === 'remove' ? [s.i + 1, n - 1] : null;
      for (var i = 0; i < n; i++) {
        var on = sl && i >= sl[0] && i <= sl[1], tgt = i === s.i && s.op !== 'add';
        items.push(B('a' + i, x0 + i * cw, 54, cw - 4, 36, { title: String.fromCharCode(65 + i), mono: true, size: 12, tone: tgt ? 'accent' : on ? 'red' : 'blue', fill: tgt ? 'solid' : 'soft' }));
        items.push(T('ai' + i, x0 + i * cw + cw / 2 - 2, 106, String(i), { anchor: 'middle', mono: true, size: 10, tone: 'muted' }));
      }
      if (s.op === 'add' && s.i === n) items.push(B('anew', x0 + n * cw, 54, cw - 4, 36, { title: '+', mono: true, size: 14, tone: 'accent', fill: 'solid' }));
      items.push(T('t2', 540, 40, 'shifts: ' + s.sh, { anchor: 'end', mono: true, size: 15, bold: true, tone: s.sh ? 'red' : 'teal' }));
      items.push(T('t3', 20, 170, 'LinkedList', { size: 14, bold: true, tone: 'teal' }));
      var back = s.i >= Math.floor(n / 2) && !(s.op === 'add' && s.i === n);
      for (i = 0; i < n; i++) {
        var walk = back ? i >= n - 1 - s.hp && i <= n - 1 : i <= s.hp, tg = i === s.i;
        items.push(B('l' + i, x0 + i * cw, 186, cw - 12, 34, { title: String.fromCharCode(65 + i), mono: true, size: 12, tone: tg ? 'accent' : walk ? 'teal' : 'muted', fill: tg ? 'solid' : 'soft' }));
        if (i < n - 1) items.push(A('la' + i, x0 + i * cw + cw - 12, 203, x0 + (i + 1) * cw, 203, { tone: 'muted', head: false }));
      }
      if (s.op === 'add' && s.i === n) items.push(B('lnew', x0 + n * cw, 186, cw - 12, 34, { title: '+', mono: true, size: 14, tone: 'accent', fill: 'solid' }));
      items.push(T('t4', 540, 170, 'hops: ' + s.hp + (s.hp ? back ? ' (from rear)' : ' (from front)' : ''), { anchor: 'end', mono: true, size: 15, bold: true, tone: s.hp ? 'red' : 'teal' }));
      items.push(T('t5', 280, 290, s.op === 'add' ? 'add(' + s.i + ', e)' : s.op + '(' + s.i + ')', { anchor: 'middle', mono: true, size: 16, bold: true, tone: 'accent' }));
      return items;
    }
  };

  var code = function (t) { return { type: 'code', lang: 'java', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; };
  var OUT = ['Conceptual List', 'Lists in the Java Collection API', 'Using Lists: Program of Study', 'Array Implementation of an Indexed List', 'Linked Implementation of an Indexed List'];
  function outline(on, ex) { return { blocks: OUT.map(function (t, i) { return { type: 'bullet', html: i === on ? '<b>' + t + '</b>' : t }; }), explain: ex }; }
  var sliceAL = function (a, b) { return AL.slice(AL.indexOf(a), b ? AL.indexOf(b) : undefined).replace(/\n$/, ''); };
  var sliceLL = function (a, b) { return LL.slice(LL.indexOf(a), b ? LL.indexOf(b) : undefined).replace(/\n$/, ''); };

  addUnit({
    course: 'ds', lesson: '06-lists',
    blurb: 'Ordered, unordered and indexed lists, Java’s List interface, a program of study, our own ArrayList that shifts elements and a doubly linked LinkedList.',
    parts: [
      { title: 'The conceptual list', from: 1, to: 6 },
      { title: 'Lists in the Java Collections API', from: 7, to: 12 },
      { title: 'Using lists: program of study', from: 13, to: 19 },
      { title: 'Array implementation of an indexed list', from: 20, to: 29 },
      { title: 'Linked implementation of an indexed list', from: 30, to: 45 }
    ],
    visuals: [listkinds, testlist, pos, arraylist, dlist, cost],
    slides: {
      1: { cover: true, explain: '<p>A <b>list</b> is a linear collection (the elements are in a row), but it is more {{flexible|مرن}} than a stack or a queue:</p><pre class="ex">stack: add and remove only at the top\nqueue: add at the rear, remove at the front\nlist:  add and remove anywhere</pre><p>In this unit: three kinds of lists, Java’s List classes, and two ways to build a list ourselves (an array and linked nodes).</p>' },
      2: outline(-1, '<p>The plan: the idea of a list, lists in Java, an example program, a list built on an array, and a list built with links.</p>'),
      3: { blocks: [bul('Ordered Lists'), bul('The elements are always ordered as they are added into the list', 1), bul('For examples, a list of people ordered alphabetically by name', 1), bul('The list is always sorted based on some key value', 1), bul('Unordered Lists'), bul('The elements have no inherent order and are not sorted', 1), bul('A new element can be put at the front, rear, or anywhere in the list', 1), bul('Indexed Lists'), bul('The elements can be referenced using a numeric index', 1)],
        explain: '<p>Three kinds of lists:</p><ul><li><b>ordered</b>: always sorted by a <b>key</b> (a name, a number). The list decides where a new element goes.</li><li><b>unordered</b>: no {{inherent|أصلي/طبيعي}} order. The user decides where it goes.</li><li><b>indexed</b>: each element has a number, its index.</li></ul><pre class="ex">ordered:   12 25 33 42   (54 must go after 42)\nunordered: 33 81 12 57   (54 can go anywhere)</pre><p class="watch">“Ordered” means sorted by value, not “in the order we added”.</p>' },
      4: { explain: '<p>In an <b>ordered</b> list, a new element goes to the place its key decides. To add 54:</p><pre class="ex">12 25 33 42 49 | 57 73 81\n54 goes after 49 and before 57</pre><p>We walk from the front while the elements are smaller; the first element that is not smaller marks the place. The list stays sorted after every add.</p><p class="watch">You cannot say “put 54 at the front” in an ordered list: that would break the order.</p>' },
      5: { explain: '<p>In an <b>unordered</b> list, a new element can go at the front, at the rear, or in the middle (for example after another element). The order of the elements is just the order of their placement.</p><pre class="ex">33 81 12 57   add 25 at the front → 25 33 81 12 57</pre><p class="watch">Unordered does not mean random: the list keeps exactly the order in which you placed the elements.</p>' },
      6: { explain: '<p>In an <b>indexed</b> list, every element has an index: 0 for the front, 1 for the next, up to size − 1.</p><pre class="ex">A B C D E     add X at index 2 →\nA B X C D E   C is now index 3, not 2</pre><p>An index is not stored inside the element: it is just the position, so it changes when elements are added or removed before it.</p><p class="watch">After an add or remove, an old index may point to a <b>different</b> element.</p>' },
      7: outline(1, '<p>Next: the List classes that Java already gives us.</p>'),
      8: { blocks: [bul('The list classes in the Java API support the concept of an indexed list, and somewhat an unordered list.'), bul('The API does not have any class that directly implements an ordered list.'), bul('The ArrayList and LinkedList classes (shown in green) implement the List interface (shown in blue).')],
        explain: '<p>In java.util:</p><pre class="ex">Iterable ← Collection ← List   (interfaces)\nArrayList, LinkedList            (classes)</pre><p>List <b>extends</b> Collection, which extends Iterable. ArrayList and LinkedList <b>implement</b> List. They work as <b>indexed</b> lists (and can be used as unordered lists).</p><p class="watch">Java has no ordered-list class: if you need the elements sorted, you must put each one in the right place yourself.</p>' },
      9: { text: false, explain: '<p>The main methods of Java’s List&lt;T&gt; interface:</p><pre class="ex">add(e)  add(i, e)  remove(e)  remove(i)  get(i)  set(i, e)\nindexOf(e)  lastIndexOf(e)  contains(e)  size()  clear()</pre><ul><li><b>remove(e)</b> removes the <b>first</b> occurrence of e;</li><li><b>indexOf</b> / <b>lastIndexOf</b> give the first / last index of e, or <b>−1</b>;</li><li><b>set</b> replaces; <b>add(i, e)</b> inserts.</li></ul><p class="watch">set(i, e) does not make the list longer; add(i, e) does.</p>' },
      10: { explain: '<p>main creates two lists and tests them with the <b>same</b> method:</p><pre class="ex">List&lt;String&gt; list1 = new ArrayList&lt;&gt;();\nList&lt;String&gt; list2 = new LinkedList&lt;&gt;();</pre><p>The variables have the <b>interface</b> type List&lt;String&gt;. So <code>test(List&lt;String&gt; list)</code> accepts both, and the output is the same.</p><p class="watch">Through a List reference you can only call List methods, even if the object is an ArrayList.</p>' },
      11: { explain: '<p>The test adds 8 names at the end (Rakan and Hadi twice), then searches:</p><pre class="ex">indexOf("Rakan")     → 1   (first one)\nlastIndexOf("Rakan") → 6   (last one)</pre><p><code>add(1, "Ali")</code> {{inserts|يُدخل}} Ali at index 1; everything after it moves right, so indexOf("Rakan") is now <b>2</b>.</p><p class="watch">Indexes start at 0: “Ahmad” is at index 0, not 1.</p>' },
      12: { explain: '<p>Two different removes:</p><pre class="ex">list.remove("Hadi")  // removes the first "Hadi" (a value)\nlist.remove(2)       // removes the element at index 2</pre><p>Java picks the method by the argument type: a String or an int. Then <code>get(2)</code> reads index 2, <code>contains("Baraa")</code> is false, and <code>set(1, "Mobarak")</code> replaces index 1.</p><p class="watch">For a List&lt;Integer&gt;, <code>remove(2)</code> still means index 2. To remove the value 2, write <code>remove(Integer.valueOf(2))</code>.</p>' },
      13: outline(2, '<p>Next: a real program that uses a list.</p>'),
      14: { explain: '<p>The example: a student’s <b>program of study</b>, the courses they must take to {{fulfill|يُكمل}} the degree {{requirements|المتطلبات}}.</p><pre class="ex">Course          one course (taken or planned)\nProgramOfStudy  an indexed list of Course objects\nPOSTester       main: builds and tests a program</pre><p>The list is Java’s <b>ArrayList</b>, so we use the List methods we just saw.</p>' },
      15: { blocks: [code(CO.slice(CO.indexOf('package')))], explain: '<p>A Course has four fields:</p><pre class="ex">final String prefix;   "MATH"\nfinal int number;      1422\nfinal String title;    "Calculus I"\nString grade;          "B+" (or "" if not taken yet)</pre><p>toString() makes one line: <code>MATH 1422: Calculus I  [B+]</code>.</p><p class="watch">prefix, number and title are <b>final</b>: they cannot change after the constructor. Only grade can change.</p>' },
      16: { blocks: [code(PO.slice(PO.indexOf('package'), PO.indexOf('  // Finds')) + '  ...')], explain: '<p>ProgramOfStudy keeps <code>List&lt;Course&gt; list = new ArrayList&lt;&gt;()</code>. Two <b>overloaded</b> addCourse methods:</p><pre class="ex">addCourse(prefix, number, title, grade)         → list.add(c)\naddCourse(index, prefix, number, title, grade)  → list.add(index, c)</pre><p>Both build a Course object first. The first adds at the end; the second inserts at an index.</p><p class="watch">The list is <b>final</b>: the reference cannot change, but courses can still be added and removed.</p>' },
      17: { blocks: [code(PO.slice(PO.indexOf('  // Finds'), PO.lastIndexOf('}')).replace(/\n$/, ''))], explain: '<ul><li><b>find</b>: a for-each loop compares prefix (with equals) and number (with ==), and returns the matching Course, or <b>null</b>.</li><li><b>replace</b>: indexOf(target), then set at that index; nothing happens if it is −1.</li><li><b>print</b>: prints <code>i + ": " + course</code> for each index.</li></ul><pre class="ex">0: MATH 1422: Calculus I  [B+]</pre><p class="watch">find returns a <b>reference</b> to the object in the list, not a copy.</p>' },
      18: { explain: '<p>main creates a ProgramOfStudy and adds 7 courses at the end, so they get indexes 0 to 6 in the order of the calls. Then it prints:</p><pre class="ex">0: MATH 1422: Calculus I  [B+]\n1: PHYS 1421: Physics I  [B]\n…\n6: COEN 2411: Electronics  []</pre><p class="watch">Courses not taken yet have grade "", so toString prints <code>[]</code>.</p>' },
      19: { explain: '<p>Then main:</p><ul><li>inserts COMM 1311 at index <b>0</b> and COMM 1312 at index <b>3</b> (the others move down);</li><li>finds GEIT 1412 and sets <code>c1.grade = "A+"</code>;</li><li>finds COEN 2411 and replaces it with a new Course “Circuits”.</li></ul><pre class="ex">c1.grade = "A+";   // changes the object inside the list</pre><p class="watch">No set() is needed after <code>c1.grade = "A+"</code>: c1 and the list refer to the <b>same</b> object.</p>' },
      20: outline(3, '<p>Next: we build our own indexed list on an array.</p>'),
      21: { blocks: [bul('Let us now implement our own generic indexed list')], explain: '<p>Now we write our <b>own</b> generic indexed list, with almost the same methods as Java’s List:</p><pre class="ex">add(e)  add(i, e)  remove(e)  remove(i)  get(i)  set(i, e)\nindexOf(e)  contains(e)  size()  clear()</pre><p>The table is the same as on slide 9, but without lastIndexOf.</p><p class="watch">Our class will be called ArrayList too, but it is in our package mylist, not java.util.</p>' },
      22: { blocks: [code('package mylist;\n// List<T> defines the interface of a generic indexed list collection\npublic interface List<T> {\n  void add(T e);             // Adds an element e at the end of the list\n  void add(int index, T e);  // Adds an element e at the given index\n  boolean remove(T e);       // Removes first occurrence of the element e\n  T remove(int index);       // Removes the element at the given index\n  T get(int index);          // Returns the element at the given index\n  void set(int index, T e);  // Sets the element at the given index to e\n  int indexOf(T e);          // Index of first occurrence of e (or -1)\n  boolean contains(T e);     // true if list contains the element e\n  boolean isEmpty();         // true if the list is empty\n  int size();                // Returns number of elements in the list\n  void clear();              // Removes all the elements in the list\n}')],
        explain: '<p>The interface <code>List&lt;T&gt;</code> in package mylist lists the methods; the classes write the bodies.</p><pre class="ex">boolean remove(T e);    // was e found?\nT remove(int index);    // the removed element</pre><p>The two removes are <b>overloaded</b>: same name, different parameter types and return types.</p><p class="watch">Overloading needs different <b>parameters</b>. Two methods that differ only in return type are not allowed.</p>' },
      23: { explain: '<p>An indexed list fits an array well:</p><pre class="ex">index: 0 1 2 3 4 …\n       A B C D _      count = 4</pre><ul><li>the elements use cells 0 to count − 1, with no gaps;</li><li>the front is always index 0;</li><li>adding or removing in the middle needs <b>shifting</b> elements to keep no gaps.</li></ul><p class="watch">count is the number of elements, and also the index of the first free cell.</p>' },
      24: { blocks: [code(sliceAL('package mylist;', '  // Adds an element e at the rear'))], explain: '<p>Our ArrayList&lt;T&gt; has an array and a count:</p><pre class="ex">new ArrayList&lt;&gt;()    → 100 cells (DEFAULT_CAPACITY)\nnew ArrayList&lt;&gt;(10)  → 10 cells, count = 0</pre><p>The first constructor calls the second with <code>this(DEFAULT_CAPACITY)</code>. The array is made as Object[] and cast to T[], because <code>new T[n]</code> is not allowed.</p><p class="watch">The capacity (cells) is not the size (elements): a new list has 100 cells but size 0.</p>' },
      25: { title: 'The add methods', blocks: [code(sliceAL('  // Adds an element e at the rear', '  // Removes the first occurrence'))], explain: '<p><b>add(e)</b> puts e at <code>array[count]</code>. <b>add(index, e)</b> must first make room: shift elements right, starting from the <b>end</b>:</p><pre class="ex">for (int i=count; i>index; i--) array[i] = array[i-1];</pre><p>Then <code>array[index] = e</code> and count++. index == count is allowed: it adds at the end.</p><p class="watch">Shifting from the front would copy the same element into every cell. Also, the slide’s message uses <code>size</code>, which is not a field: it should be <code>count</code> (or size()).</p>' },
      26: { title: 'Remove First Occurrence of an Element', blocks: [code(sliceAL('  // Removes the first occurrence', '  // Returns the element at the given index'))], explain: '<p>remove(e) finds the index with indexOf. If it is −1, return false. Otherwise:</p><pre class="ex">count--;\nfor (i = index; i &lt; count; i++) array[i] = array[i+1];\narray[count] = null;</pre><p>The elements after the gap move one cell <b>left</b>. The last cell still has a copy, so it is set to null.</p><p class="watch">Without <code>array[count] = null</code>, the array keeps a hidden reference to an element that is no longer in the list.</p>' },
      27: { title: 'The get and set Methods', blocks: [code(sliceAL('  // Returns the element at the given index', '  // Removes and returns the element'))], explain: '<p>get and set check the index, then use the array directly:</p><pre class="ex">valid index: 0 ≤ index &lt; count\nget: return array[index];   set: array[index] = e;</pre><p>Both are <b>O(1)</b>: no loop.</p><p class="watch">The slide’s code has a typo: <code>"…, Size: ", count</code> uses a comma, so it does not compile. It should be <code>"…, Size: " + count</code>. Also note <code>&gt;= count</code> here, but <code>&gt; count</code> in add(index, e).</p>' },
      28: { title: 'Remove the Element at a given Index', blocks: [code(sliceAL('  // Removes and returns the element', '  // Index of first occurrence'))], explain: '<p>remove(index) reuses <b>get(index)</b>: it checks the index and gives the element to return. Then the same shift left as remove(e):</p><pre class="ex">[A][B][C][D]  remove(1) → returns B\n[A][C][D][ ]</pre><p>Removing at index 0 shifts all the other elements: the worst case, O(n).</p><p class="watch">The element is saved <b>before</b> shifting; after the shift, array[index] holds a different element.</p>' },
      29: { title: 'indexOf, contains and clear', blocks: [code(sliceAL('  // Index of first occurrence', '  // not on the slides'))], explain: '<ul><li><b>indexOf</b>: compare each element with <code>equals</code> from index 0; return i, or −1.</li><li><b>contains</b>: indexOf(e) != −1.</li><li><b>clear</b>: a new empty array and count = 0.</li></ul><pre class="ex">[A][B][A]   indexOf(A) → 0, contains(Q) → false</pre><p class="watch">clear() makes an array of DEFAULT_CAPACITY (100) cells, even if the list was created with another capacity.</p>' },
      30: outline(4, '<p>Last: an indexed list built with linked nodes.</p>'),
      31: { blocks: [bul('We can implement an indexed list collection as a singly linked list of Node objects, as we did with queues.'), bul('We can efficiently remove a node at the front of the list.'), bul('However, we cannot efficiently remove a node at the rear of middle of the singly linked list.')], explain: '<p>A <b>singly</b> linked list (each node has only <code>next</code>) can remove the front in O(1). But to remove the rear or a middle node we need the node <b>before</b> it, and we can only find it by walking from the front:</p><pre class="ex">front → A → B → C → D ← rear\nremove D: walk A, B, C to find C: O(n)</pre><p class="watch">The slide says “rear <b>of</b> middle”: it means “rear <b>or</b> middle”.</p>' },
      32: { blocks: [bul('We need a doubly linked list to efficiently remove any node.'), bul('Each node in a doubly linked list stores references to the previous node before it and the next node after it.'), bul('A doubly linked list can be traversed forward and backward.'), bul('Insertions and deletions can be done efficiently at arbitrary positions.')], explain: '<p>In a <b>doubly</b> linked list every node has two links:</p><pre class="ex">null ← A ⇄ B ⇄ C ⇄ D → null\n       next →    ← prev</pre><p>We can {{traverse|نمرّ على}} it forward (next) and backward (prev). A node knows both neighbours, so it can be removed or have a node inserted next to it at an {{arbitrary|أي}} position, without searching for the node before it.</p><p class="watch">More links means more memory per node, and more links to update on every change.</p>' },
      33: { blocks: [bul('We will define a LinkedList<T> class to implement a doubly-linked list version of the indexed List<T>.'), code(sliceLL('package mylist;', '  private static class Node'))], explain: '<p>Our LinkedList&lt;T&gt; implements our List&lt;T&gt; with three fields:</p><pre class="ex">front → the first node (index 0)\nrear  → the last node (index count − 1)\ncount → the number of nodes</pre><p>An empty list has <code>front = rear = null</code> and count = 0.</p><p class="watch">It is our mylist.LinkedList, not java.util.LinkedList, although both are doubly linked.</p>' },
      34: { blocks: [bul('To implement a doubly-linked list, Node<T> must contain a reference to the next and prev nodes, and a reference to a generic element of type T.'), bul('Node<T> is defined as a nested private static class.'), code(sliceLL('  private static class Node', '  // Returns a reference to the node at'))], explain: '<p>The Node now has <b>three</b> references:</p><pre class="ex">next     the node after it\nprev     the node before it\nelement  the data</pre><p>It is a <b>private static nested</b> class: only LinkedList can use it, and it does not need a LinkedList object. A new node starts with <code>next = prev = null</code>.</p>' },
      35: { title: 'Reaching the Node at a Given Index', blocks: [bul('The nodeAt method is used by methods that index the list. It traverses a linked list forward or backward to reach the node at given index.'), code(sliceLL('  // Returns a reference to the node at', '  // Returns the element at the given'))], explain: '<p>A linked list has no index, so <b>nodeAt</b> walks to it, from the {{nearer|الأقرب}} end:</p><pre class="ex">count = 8: nodeAt(2) starts at front: 2 steps\n           nodeAt(6) starts at rear:  1 step</pre><p>If index &lt; count/2, start at front and follow next; otherwise start at rear and follow prev. At most about n/2 steps.</p><p class="watch">count/2 is integer division: with count = 5 it is 2, so nodeAt(2) starts at the rear.</p>' },
      36: { title: 'Get and Set an Element at a Given Index', blocks: [code(sliceLL('  // Returns the element at the given', '  // Adds an element e at the rear'))], explain: '<p>get and set both start with <code>nodeAt(index)</code> (which also checks the index):</p><pre class="ex">get: return node.element;\nset: node.element = e;</pre><p>set changes only the element; the links stay the same.</p><p class="watch">In an array, get(i) is O(1). Here it is O(n), because nodeAt must walk.</p>' },
      37: { title: 'Adding a Rear Element to a Linked List', blocks: [bul('The add(T e) method creates a new node for an element e at the rear of this list, and increments count of elements.'), code(sliceLL('  // Adds an element e at the rear', '  // Adds an element e at the given'))], explain: '<p>add(e) adds a node at the <b>rear</b>:</p><pre class="ex">empty list: front = node\notherwise:  rear.next = node;  node.prev = rear;\nthen:       rear = node;  count++;</pre><p>Two links connect the old rear and the new node, one each way. O(1): no walking.</p><p class="watch">Forgetting <code>node.prev = rear</code> leaves the list broken when walking backward.</p>' },
      38: { blocks: [bul('Adding a node at the front or rear of a list is simple and does not require traversing the list.'), bul('Adding a node at an index requires traversing the list.'), bul('The next node at index is located first. The new node is inserted and linked between the previous and next nodes.')],
        explain: '<p>To insert at an index: find <b>next</b> (the node at index) with nodeAt, take <b>prev</b> = next.prev, then change four links (the numbers in the picture):</p><pre class="ex">① node.next = next    ② node.prev = prev\n③ next.prev = node    ④ prev.next = node</pre><p>The old links between prev and next (red ✕) are replaced.</p><p class="watch">If prev is null (index 0), there is no prev.next: front must change instead.</p>' },
      39: { title: 'Adding a Node at a Given Index', blocks: [code(sliceLL('  // Adds an element e at the given', '  // Removes and returns the element at'))], explain: '<p>add(index, e):</p><ol><li>check 0 ≤ index ≤ count;</li><li>index == count: just add(e) at the rear;</li><li>otherwise create the node, find next and prev, set the four links;</li><li>count++.</li></ol><pre class="ex">A ⇄ B ⇄ C   add(1, X) →   A ⇄ X ⇄ B ⇄ C</pre><p class="watch">The order matters: <code>prev = next.prev</code> must be read <b>before</b> <code>next.prev = node</code> changes it.</p>' },
      40: { blocks: [bul('Removing the front node is very simple and done in few steps.'), bul('Removing a node at an index requires traversing the linked list. The node at index−1 is relinked to the successor node at index+1.'), bul('Removing the first occurrence of an element requires searching the linked list locating the first node that has the target element. The previous node is then relinked to the successor node.')],
        explain: '<p>To remove a node, its two neighbours are linked to each other, skipping it:</p><pre class="ex">prev ⇄ node ⇄ next   →   prev ⇄ next</pre><p>Finding the node needs a walk: by index (nodeAt) or by value (a search from the front). After that, the {{relinking|إعادة الربط}} is O(1).</p><p class="watch">“Successor” means the node <b>after</b> it (index + 1).</p>' },
      41: { title: 'Removing a Node at a Given Index', blocks: [code(sliceLL('  // Removes and returns the element at', '  // Helper method to remove'))], explain: '<p>remove(index) checks the index, finds the node with nodeAt, removes it with the helper removeNode, and returns its element:</p><pre class="ex">Node&lt;T&gt; node = nodeAt(index);\nremoveNode(node);\nreturn node.element;</pre><p class="watch">The node is unlinked, but the local variable <code>node</code> still refers to it, so <code>node.element</code> is still available.</p>' },
      42: { title: 'Helper Method to Remove a Node', blocks: [code(sliceLL('  // Helper method to remove', '  // Removes the first occurrence'))], explain: '<p>removeNode works for <b>any</b> node: front, rear, middle, or the only node.</p><pre class="ex">prev.next = next   (if prev is not null)\nnext.prev = prev   (if next is not null)\nfront = next       (if it was the front)\nrear = prev        (if it was the rear)</pre><p>Then count--. Each <code>if</code> handles one edge case.</p><p class="watch">Removing the only node: prev and next are both null, so front and rear both become null.</p>' },
      43: { title: 'Removing First Occurrence of an Element', blocks: [code(sliceLL('  // Removes the first occurrence', '  // Returns index of first occurrence'))], explain: '<p>remove(e) searches from the front:</p><pre class="ex">while (node != null &amp;&amp; !e.equals(node.element))\n  node = node.next;</pre><p>If the loop reaches null, e is not in the list: return false. Otherwise removeNode(node) and return true.</p><p class="watch">The test <code>node != null</code> comes first: if node is null, Java does not evaluate the second part (short-circuit &amp;&amp;), so there is no NullPointerException.</p>' },
      44: { title: 'indexOf, contains and clear', blocks: [code(sliceLL('  // Returns index of first occurrence', '  // not on the slides'))], explain: '<ul><li><b>indexOf</b>: walk from the front with a counter i; return i when equal, −1 at the end.</li><li><b>contains</b>: indexOf(e) != −1.</li><li><b>clear</b>: <code>front = rear = null; count = 0</code>.</li></ul><pre class="ex">A ⇄ B ⇄ C   indexOf(C) → 2</pre><p class="watch">clear does not delete nodes one by one: once nothing refers to them, Java’s garbage collector frees them.</p>' },
      45: { blocks: [bul('Time complexity of ArrayList and doubly LinkedList with n elements for various functions are shown in the table below.')], explain: '<p>The cost depends on <b>where</b>:</p><pre class="ex">               ArrayList        LinkedList\nadd/remove(0)  O(n) shift all   O(1)\nmiddle (n/2)   O(n)             O(n) walk n/2\nget/set(i)     O(1)             O(n) walk\nadd(e) at end  O(1)             O(1)</pre><p>An ArrayList also pays O(n) when expandCapacity copies the array; a LinkedList never needs that.</p><p class="watch">For the ArrayList, remove at index n − 1 is O(1) (nothing to shift), but add at index 0 is the worst case.</p>' }
    },
    exam: {
      questions: [
        { q: 'An indexed list holds k, m, p. Then z is added at index 0. What is the index of p now?',
          options: ['0', '1', '2', '3'], answer: 3, review: 6,
          why: 'z takes index 0 and every element moves one place to the right: k → 1, m → 2, p → 3. The indexes are updated after every change.',
          lessons: ['06-lists'], skills: ['trace'], available_after: '06-lists', level: 1 },
        { source: { assignment: 4, question: 3 },
          q: 'What is the key advantage of ArrayList over LinkedList?',
          options: ['Faster random access', 'Lower memory usage for nodes', 'No resizing needed', 'Faster insertion at head'], answer: 0, review: 45,
          why: 'get(index) and set(index, e) are O(1) on an ArrayList, because <code>array[index]</code> jumps straight to the cell; a LinkedList must walk to the node (O(n)). An ArrayList has no nodes at all, it does need resizing (expandCapacity), and inserting at the head is where the LinkedList wins.',
          lessons: ['06-lists'], skills: ['design'], available_after: '06-lists', level: 1 },
        { source: { assignment: 4, question: 21 },
          q: 'A system frequently accesses elements by index and rarely inserts/deletes. Best choice?',
          options: ['LinkedList', 'ArrayList', 'Queue', 'Stack'], answer: 1, review: 45,
          why: 'Access by index is O(1) on an ArrayList and O(n) on a LinkedList, and the rare inserts or deletes do not matter much. A queue or a stack cannot reach elements by index at all.',
          lessons: ['06-lists'], skills: ['design'], available_after: '06-lists', level: 1 },
        { source: { assignment: 4, question: 29 },
          q: 'A programmer repeatedly inserts elements at the beginning of a list. Which structure is MOST suitable?',
          options: ['LinkedList', 'Stack', 'Queue', 'ArrayList'], answer: 0, review: 38,
          why: 'Adding at the front of a LinkedList creates a node and changes a few links: O(1). An ArrayList shifts every element on each insertion at index 0: O(n). A stack or a queue is not a list: it cannot insert at any position.',
          lessons: ['06-lists'], skills: ['design'], available_after: '06-lists', level: 1 },
        { type: 'tf', q: '`List<String> x = new LinkedList<>();` compiles, and later the same variable can be given `new ArrayList<>()`.', answer: true, review: 8,
          why: 'Both classes implement the List interface, so a List variable can refer to an object of either class (slide 8).',
          lessons: ['06-lists'], skills: ['concept'], available_after: '06-lists', level: 1 },
        { type: 'output', q: 'What does this print?', review: 9,
          code: 'List<String> L = new ArrayList<>();\nL.add("b");\nL.add("a");\nL.add("b");\nL.add(0, "a");\nSystem.out.println(L.indexOf("a") + " " + L.lastIndexOf("b"));\nL.remove(0);\nSystem.out.println(L);',
          answer: '0 3\n[b, a, b]',
          why: 'After add(0, "a") the list is [a, b, a, b]: the first a is at 0 and the last b at 3. remove(0) gets an int, so it removes the element at index 0: [b, a, b].',
          lessons: ['06-lists'], skills: ['trace'], available_after: '06-lists', level: 2 },
        { type: 'fill', q: 'Complete the shifting loop of `add(int index, T e)` in our ArrayList (slide 25).', review: 25,
          code: 'for (int i = ___; i > index; i--)\n  array[i] = array[___];\narray[index] = e;\ncount++;',
          answer: ['count', 'i-1|i - 1'],
          why: 'The loop starts at the first free cell, count, and moves each element one place right, from the end down to the index: array[i] = array[i − 1]. Starting from the end means no element is written over before it is moved.',
          lessons: ['06-lists'], skills: ['design'], available_after: '06-lists', level: 2 },
        { q: 'A LinkedList has count = 9. From which end does `nodeAt(5)` start, and how many steps does its loop take?',
          options: ['From the front, 5 steps', 'From the rear, 4 steps', 'From the rear, 3 steps', 'From the front, 4 steps'], answer: 2, review: 35,
          why: 'count/2 = 4 and 5 &lt; 4 is false, so it starts at the rear, index 8, and steps back 8 → 7 → 6 → 5: 3 steps. From the front it would need 5.',
          lessons: ['06-lists'], skills: ['trace'], available_after: '06-lists', level: 2 },
        { type: 'trace', q: 'Our doubly LinkedList starts empty. Fill in the list (front → rear), front, rear and count after each operation.', review: 39,
          cols: ['operation', 'list', 'front', 'rear', 'count'],
          rows: [['add(A), add(B)', 'A B', 'A', 'B', '2'], ['add(0, C)', '?C A B', '?C', '?B', '?3'], ['add(2, D)', '?C A D B', '?C', '?B', '?4'], ['remove(0)', '?A D B', '?A', '?B', '?3']],
          why: 'add(0, C) finds no previous node, so C becomes the front. add(2, D) links D between A (index 1) and B (index 2). remove(0) removes C, the front node, so front moves to its next node, A. The rear stays B the whole time.',
          lessons: ['06-lists'], skills: ['trace'], available_after: '06-lists', level: 2 },
        { q: 'The list is A ⇄ B ⇄ C. After `removeNode(C)`, what are rear and B.next?',
          options: ['rear = C, B.next = null', 'rear = B, B.next = null', 'rear = null, B.next = C', 'rear = B, B.next = C'], answer: 1, review: 42,
          why: 'For C, next is null and prev is B. <code>prev.next = next</code> sets B.next to null; next is null, so the second relink is skipped; C was the rear, so <code>rear = prev</code> = B.',
          lessons: ['06-lists'], skills: ['trace', 'edge_case'], available_after: '06-lists', level: 2 },
        { type: 'bug', q: 'This indexOf of our ArrayList throws a NullPointerException when the element is not in the list. Tap the line that causes it.', review: 29,
          code: 'public int indexOf(T e) {\n  for (int i = 0; i < array.length; i++)\n    if (array[i].equals(e)) return i;\n  return -1;\n}',
          answer: 2,
          why: 'The loop goes past count into the free cells, which hold null, and <code>null.equals(e)</code> throws. The slide loops <code>i &lt; count</code>.',
          lessons: ['06-lists'], skills: ['bug', 'edge_case'], available_after: '06-lists', level: 2 },
        { type: 'write', q: 'Write the body of `contains(T e)` for our doubly LinkedList <b>without</b> calling indexOf: walk from front and return true as soon as a node holds an element equal to e; return false at the end.', review: 44,
          rows: 6, starter: 'public boolean contains(T e) {\n  \n}',
          checks: [{ re: /Node\s*<\s*T\s*>\s+(\w+)\s*=\s*front\s*;/, label: 'Starts a Node&lt;T&gt; variable at front' },
            { re: /while\s*\(\s*\w+\s*!=\s*null\s*\)|for\s*\([^;]*;\s*\w+\s*!=\s*null\s*;/, label: 'Loops while the node is not null' },
            { re: /e\.equals\s*\(\s*\w+\.element\s*\)|\w+\.element\.equals\s*\(\s*e\s*\)/, label: 'Compares with equals' },
            { re: /return\s+true\s*;/, label: 'Returns true when found' },
            { re: /(\w+)\s*=\s*\1\.next/, label: 'Moves to the next node' },
            { re: /return\s+false\s*;/, label: 'Returns false at the end' },
            { fn: function (c) { return !/indexOf/.test(c); }, label: 'Does not call indexOf' }],
          solution: 'public boolean contains(T e) {\n  Node<T> node = front;\n  while (node != null) {\n    if (e.equals(node.element)) return true;\n    node = node.next;\n  }\n  return false;\n}',
          why: 'Testing <code>node != null</code> visits every node, also the last one, and works for an empty list (the loop never runs). Like indexOf it is O(n) when the element is missing.',
          lessons: ['06-lists'], skills: ['design'], available_after: '06-lists', level: 2 },
        { source: { assignment: 4, question: 15 },
          q: 'A method sums n integers using `for (int i = 0; i < list.size(); i++) sum += list.get(i);`. What are its time complexities for Java ArrayList and LinkedList, respectively?',
          options: ['O(n) and O(n squared)', 'O(n squared) and O(n)', 'O(1) and O(n)', 'O(n) and O(n)'], answer: 0, review: 45,
          why: 'The loop calls get n times. On an ArrayList each get is O(1), so the sum is O(n). On a LinkedList each get(i) walks to node i (O(n), like nodeAt), so n calls cost about 1 + 2 + … + n/2 steps from each end: O(n²). "O(n) and O(n)" forgets that get itself walks; "O(1)" ignores the loop.',
          lessons: ['06-lists', '02-analysis-of-algorithms'], skills: ['complexity'], available_after: '06-lists', level: 3 },
        { q: 'A program uses an ArrayList as a queue: enqueue = `add(e)`, dequeue = `remove(0)`. It enqueues n values and then dequeues all of them. What is the total cost, and what would it be with our doubly LinkedList?',
          options: ['O(n) with both', 'O(n) with the ArrayList, O(n²) with the LinkedList', 'O(n²) with the ArrayList, O(n) with the LinkedList', 'O(n²) with both'], answer: 2, review: 45,
          why: 'Each remove(0) on the ArrayList shifts all remaining elements left: (n − 1) + (n − 2) + … = O(n²). On the LinkedList, remove(0) only moves front: O(1) each, O(n) in total. The adds are O(1) on both. That is why the circular array of unit 5 moves front instead of shifting.',
          lessons: ['05-queues', '06-lists', '02-analysis-of-algorithms'], skills: ['complexity', 'design'], available_after: '06-lists', level: 3 },
        { q: 'A stack S and an empty list L. Push 5, 1, 4 onto S (in that order). Then, while S is not empty: `L.add(0, S.pop());`. What does L hold?',
          options: ['[5, 1, 4]', '[1, 4, 5]', '[4, 1, 5]', '[5, 4, 1]'], answer: 0, review: 9,
          why: 'S pops 4, 1, 5. Each value is added at index 0, in front of the others: [4] → [1, 4] → [5, 1, 4]. The stack reverses the order once, and adding at the front reverses it again, so L has the original order. "[4, 1, 5]" would come from add(e) at the rear.',
          lessons: ['03-stacks', '06-lists'], skills: ['trace'], available_after: '06-lists', level: 3 }
      ],
      tasks: [
        {
          title: 'Using java.util.List',
          task: '<p>Write a program that creates a <code>List&lt;String&gt;</code> as an <code>ArrayList</code>, adds "red", "green" and "blue" at the end, inserts "black" at index 1, removes "green" by value, changes the element at index 0 to "white", then prints the list and, on the next line, its size.</p>',
          starter: 'import java.util.*;\n\npublic class Colors {\n  public static void main(String[] args) {\n    \n  }\n}',
          output: '[white, black, blue]\n3',
          checks: [
            { re: /List\s*<\s*String\s*>\s+(\w+)\s*=\s*new\s+ArrayList\s*<\s*(String\s*)?>\s*\(\s*\)/, label: 'A <code>List&lt;String&gt;</code> variable with a new ArrayList', review: 10 },
            { re: /\.add\s*\(\s*"red"\s*\)[\s\S]*\.add\s*\(\s*"green"\s*\)[\s\S]*\.add\s*\(\s*"blue"\s*\)/, label: 'Adds red, green and blue in order', review: 11 },
            { re: /\.add\s*\(\s*1\s*,\s*"black"\s*\)/, label: '<code>add(1, "black")</code>', review: 11 },
            { re: /\.remove\s*\(\s*"green"\s*\)/, label: '<code>remove("green")</code>', review: 12 },
            { re: /\.set\s*\(\s*0\s*,\s*"white"\s*\)/, label: '<code>set(0, "white")</code>', review: 12 },
            { re: /System\.out\.println\s*\(\s*\w+\s*\)\s*;[\s\S]*System\.out\.println\s*\(\s*\w+\.size\s*\(\s*\)\s*\)\s*;/, label: 'Prints the list, then its size', review: 9 }
          ],
          solution: 'import java.util.*;\n\npublic class Colors {\n  public static void main(String[] args) {\n    List<String> list = new ArrayList<>();\n    list.add("red");\n    list.add("green");\n    list.add("blue");\n    list.add(1, "black");\n    list.remove("green");\n    list.set(0, "white");\n    System.out.println(list);\n    System.out.println(list.size());\n  }\n}'
        },
        {
          title: 'nodeAt for the doubly linked list',
          task: '<p>Write <code>nodeAt(int index)</code> for the slides\' <code>LinkedList&lt;T&gt;</code> (fields <code>front</code>, <code>rear</code>, <code>count</code>; nodes have <code>next</code> and <code>prev</code>). If the index is out of bounds, throw <code>new IndexOutOfBoundsException("Index: " + index + ", Size: " + count)</code>. If <code>index &lt; count/2</code>, walk forward from front; otherwise walk backward from rear. Return the node.</p>',
          starter: 'private Node<T> nodeAt(int index) throws IndexOutOfBoundsException {\n  \n}',
          checks: [
            { re: /if\s*\(\s*index\s*<\s*0\s*\|\|\s*index\s*>=\s*count\s*\)\s*throw\s+new\s+IndexOutOfBoundsException\s*\(/, label: 'Throws when <code>index &lt; 0 || index &gt;= count</code>', review: 35 },
            { re: /if\s*\(\s*index\s*<\s*count\s*\/\s*2\s*\)/, label: '<code>if (index &lt; count/2)</code>', review: 35 },
            { re: /Node\s*<\s*T\s*>\s+(\w+)\s*=\s*front\s*;[\s\S]*for\s*\(\s*int\s+(\w+)\s*=\s*0\s*;\s*\2\s*<\s*index\s*;\s*\2\s*\+\+\s*\)\s*\1\s*=\s*\1\.next\s*;/, label: 'From front: <code>index</code> steps with next', review: 35 },
            { re: /Node\s*<\s*T\s*>\s+(\w+)\s*=\s*rear\s*;[\s\S]*for\s*\(\s*int\s+(\w+)\s*=\s*count\s*-\s*1\s*;\s*\2\s*>\s*index\s*;\s*\2\s*--\s*\)\s*\1\s*=\s*\1\.prev\s*;/, label: 'From rear: steps back with prev while <code>i &gt; index</code>', review: 35 },
            { re: /return\s+\w+\s*;[\s\S]*return\s+\w+\s*;/, label: 'Returns the node in both cases', review: 35 }
          ],
          solution: 'private Node<T> nodeAt(int index) throws IndexOutOfBoundsException {\n  if (index < 0 || index >= count) throw new\n      IndexOutOfBoundsException("Index: " + index + ", Size: " + count);\n  if (index < count/2) {\n    Node<T> node = front;\n    for (int i = 0; i < index; i++) node = node.next;\n    return node;\n  }\n  Node<T> node = rear;\n  for (int i = count-1; i > index; i--) node = node.prev;\n  return node;\n}'
        }
      ]
    }
  });
})();
