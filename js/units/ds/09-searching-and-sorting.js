/* Data Structures · Unit 9 Searching and Sorting (46 slides): static and generic methods, linear search, binary search
   with compareTo, selection / insertion / bubble sort, quick sort with partition, merge sort, the comparison of
   sorting algorithms, and radix sort with count and index arrays */
(function () {
  function L(src, frag, nth) { var ls = src.split('\n'), c = 0; for (var i = 0; i < ls.length; i++) if (ls[i].indexOf(frag) >= 0 && ++c === (nth || 1)) return i + 1; throw new Error('no line ' + frag); }
  function toks(s, max) { return String(s).trim().split(/[\s,{}]+/).filter(Boolean).slice(0, max || 10); }
  function ints(s, max, def, lo) { var a = toks(s, max).filter(function (t) { return /^-?\d{1,3}$/.test(t); }).map(Number).filter(function (x) { return lo == null || x >= lo; }); return a.length ? a : def.slice(); }
  function mk(a) { return a.map(function (v, i) { return { id: 'v' + i, v: v }; }); }
  /* a row of cells with stable ids, so swaps and shifts slide. o: {y, cw, x0, tone: {index: tone}, ptr: [[index, label, tone]], dim: [from, to] (shown), lift: index (drawn higher), idx} */
  function cells(arr, o) {
    var out = [], n = arr.length, cw = o.cw || Math.min(52, Math.floor(480 / Math.max(n, 1))), x0 = o.x0 != null ? o.x0 : 280 - n * cw / 2, y = o.y;
    arr.forEach(function (e, i) {
      var tn = (o.tone && o.tone[i]) || 'blue', off = o.dim && (i < o.dim[0] || i > o.dim[1]);
      out.push(B(e.id, x0 + i * cw + 2, y - (o.lift === i ? 54 : 0), cw - 4, 38, { title: String(e.v), mono: true, size: cw < 36 ? 11 : 14, tone: tn, fill: tn === 'accent' ? 'solid' : 'soft', hi: tn === 'accent', o: off ? 0.35 : 1 }));
      if (o.idx !== false) out.push(T((o.p || '') + 'ix' + i, x0 + i * cw + cw / 2, y - 8 - (o.lift === i ? 54 : 0), String(i), { anchor: 'middle', mono: true, size: 10, tone: 'muted' }));
    });
    var at = {};
    (o.ptr || []).forEach(function (p) { if (p[0] == null || p[0] < 0 || p[0] > n) return; (at[p[0]] = at[p[0]] || []).push(p); });
    Object.keys(at).forEach(function (k) { var ps = at[k], i = +k; out.push(P((o.p || '') + 'p' + ps.map(function (p) { return p[1]; }).join(''), x0 + i * cw + cw / 2, y + 42, ps.map(function (p) { return p[1]; }).join(' '), { dir: 'up', len: 22 })); });
    return out;
  }
  function counters(list) { return list.map(function (c, i) { return T('ct' + i, 548, 30 + i * 22, c, { anchor: 'end', mono: true, size: 13, bold: true, tone: i ? 'teal' : 'accent' }); }); }
  var aline = function (a) { return 'Integer[] array = {' + a.join(', ') + '};'; };

  /* ---------- 1. linear search (slides 3-6) ---------- */
  var LS = 'public class Search {\n  // Generic static linear search method\n  public static <T> int linearSearch(T[] array, T target) {\n    for (int i = 0; i < array.length; i++) {\n      if (array[i].equals(target))\n        return i;    // target found at index i\n    }\n    return -1;       // target not found\n  }\n}';
  function lrun(v) { var a = ints(v.a, 12, [31, 7, 58, 12, 7, 40]), t = ints(v.t, 1, [12])[0]; return { a: a, t: t, code: LS + '\n\n// in main:\n' + aline(a) + '\nint where = Search.linearSearch(array, ' + t + ');   // through the class name\nSystem.out.println(where);' }; }
  var linear = {
    id: 'linear', slides: [3, 6], title: 'Linear search: one element after another',
    code: function (v) { return lrun(v).code; },
    inputs: [{ id: 'a', type: 'text', label: 'array', value: '31 7 58 12 7 40', minlen: 1, maxlen: 50 }, { id: 't', type: 'text', label: 'target', value: '12', minlen: 1, maxlen: 4 }],
    presets: [{ label: 'found inside', values: { a: '31 7 58 12 7 40', t: '12' } }, { label: 'the first element (best case)', values: { a: '31 7 58 12 7 40', t: '31' } }, { label: 'not found (worst case)', values: { a: '31 7 58 12 7 40', t: '9' } }, { label: 'two copies', values: { a: '31 7 58 12 7 40', t: '7' } }],
    steps: function (v) {
      var R = lrun(v), st = [], arr = mk(R.a), cl = R.code.split('\n').length - 1, c = 0;
      var snap = function (o) { o.arr = arr; o.c = c; o.t = R.t; st.push(o); return o; };
      snap({ slide: 3, line: cl - 1, cap: '<b>Searching</b>: find the target ' + R.t + ' in the array, or decide that it is not there, with as few <b>comparisons</b> as possible.' });
      snap({ slide: 4, line: cl, cap: 'linearSearch is <b>static</b>: it is called through the class name, <code>Search.linearSearch(…)</code>, with no Search object (like Math.sqrt).' });
      snap({ slide: 5, line: L(LS, 'public static <T> int linearSearch'), cap: 'It is a <b>generic method</b>: <code>&lt;T&gt;</code> before the return type. It searches an array of any class type: Integer, String, …' });
      for (var i = 0; i < R.a.length; i++) {
        c++; var hit = R.a[i] === R.t;
        snap({ slide: 6, line: L(LS, 'for (int i = 0;') + '-' + L(LS, 'if (array[i].equals') + (hit ? ',' + L(LS, 'return i;') : ''), at: i, hit: hit, cap: 'i = ' + i + ': array[' + i + '] = ' + R.a[i] + (hit ? ' equals ' + R.t + '! Return <b>' + i + '</b> after ' + c + ' comparison' + (c > 1 ? 's' : '') + '.' : ' is not ' + R.t + '.'), out: hit ? String(i) : undefined });
        if (hit) break;
      }
      if (i === R.a.length) snap({ slide: 6, line: L(LS, 'return -1;'), at: -1, cap: 'All ' + R.a.length + ' elements checked: not found, return <b>−1</b>. This is the worst case: n comparisons, O(n).', out: '-1' });
      return st;
    },
    draw: function (k, s) {
      var tone = {}; for (var i = 0; i < s.arr.length; i++) tone[i] = i === s.at ? (s.hit ? 'accent' : 'red') : s.at != null && (i < s.at || s.at < 0) ? 'muted' : 'blue';
      var items = cells(s.arr, { y: 130, tone: s.at == null ? null : tone, ptr: s.at >= 0 ? [[s.at, 'i']] : [] });
      items.push(T('tg', 30, 50, 'target = ' + s.t, { mono: true, size: 16, bold: true, tone: 'accent' }));
      return items.concat(counters(['comparisons: ' + s.c]));
    }
  };

  /* ---------- 2. binary search (slides 7-12) ---------- */
  var BS = 'public static <T extends Comparable<T>>   // generic static method\n       int binarySearch(T[] array, T target) {\n  int left = 0;                        // left index\n  int right = array.length – 1;        // right index\n  while (left <= right) {              // more elements to search\n    int mid = (left + right) / 2;      // middle index\n    int c = target.compareTo(array[mid]);\n    if (c == 0) return mid;            // found at mid index\n    else if (c < 0) right = mid – 1;   // Search left half\n    else left = mid + 1;               // Search right half\n  }\n  return -1;                           // Element not found\n}';
  var SA = '10 12 18 22 31 34 40 46 59 67 69 72 80 84 98';
  function brun(v) { var a = ints(v.a, 15, [10, 12, 18]), t = ints(v.t, 1, [67])[0]; return { a: a, t: t, code: BS + '\n\n// in main:\n' + aline(a) + '\nSystem.out.println(binarySearch(array, ' + t + '));' }; }
  var binary = {
    id: 'binary', slides: [7, 12], title: 'Binary search: left, mid, right',
    code: function (v) { return brun(v).code; },
    inputs: [{ id: 'a', type: 'text', label: 'sorted array', value: SA, minlen: 1, maxlen: 70 }, { id: 't', type: 'text', label: 'target', value: '67', minlen: 1, maxlen: 4 }],
    presets: [{ label: 'slides 8-9: 67', values: { a: SA, t: '67' } }, { label: 'the first element', values: { a: SA, t: '10' } }, { label: 'not found', values: { a: SA, t: '50' } }, { label: 'array not sorted', values: { a: '50 10 40 20 30', t: '10' } }],
    steps: function (v) {
      var R = brun(v), st = [], arr = mk(R.a), l = 0, r = R.a.length - 1, c = 0, lc = 0;
      for (var q = 0; q < R.a.length; q++) { lc++; if (R.a[q] === R.t) break; }
      var sorted = R.a.every(function (x, i) { return !i || R.a[i - 1] <= x; });
      var snap = function (o) { o.arr = arr; o.c = c; o.t = R.t; o.l = o.l != null ? o.l : l; o.r = o.r != null ? o.r : r; st.push(o); return o; };
      snap({ slide: 7, line: L(BS, 'int left = 0;') + '-' + L(BS, 'int right = array.length'), cap: 'Binary search needs a <b>sorted</b> array. It starts in the <b>middle</b>; each comparison tells which half can still hold the target.' + (sorted ? '' : ' <b>This array is not sorted!</b>') });
      snap({ slide: 10, line: L(BS, 'int c = target.compareTo'), cmp: true, cap: '<code>x.compareTo(y)</code> (from the Comparable interface) returns a number &lt; 0 if x &lt; y, 0 if they are equal, &gt; 0 if x &gt; y. <code>&lt;T extends Comparable&lt;T&gt;&gt;</code> makes sure T has it.' });
      var found = -1;
      while (l <= r) {
        var m = Math.floor((l + r) / 2), cc = R.t < R.a[m] ? -1 : R.t > R.a[m] ? 1 : 0; c++;
        snap({ slide: c === 1 ? 8 : 9, line: L(BS, 'while (left <= right)') + '-' + L(BS, 'int c = target.compareTo'), m: m, cap: 'left = ' + l + ', right = ' + r + ': mid = (' + l + ' + ' + r + ') / 2 = <b>' + m + '</b>. Compare ' + R.t + ' with array[' + m + '] = ' + R.a[m] + '.' });
        if (cc === 0) { found = m; snap({ slide: 9, line: L(BS, 'if (c == 0) return mid;'), m: m, hit: true, out: String(m), cap: 'c == 0: found at index <b>' + m + '</b> after ' + c + ' comparison' + (c > 1 ? 's' : '') + '.' }); break; }
        if (cc < 0) { r = m - 1; snap({ slide: c === 1 ? 8 : 9, line: L(BS, 'else if (c < 0) right = mid'), cap: R.t + ' &lt; ' + R.a[m] + ': it can only be in the <b>left</b> half. right = mid − 1 = ' + r + '.' }); }
        else { l = m + 1; snap({ slide: c === 1 ? 8 : 9, line: L(BS, 'else left = mid + 1;'), cap: R.t + ' &gt; ' + R.a[m] + ': it can only be in the <b>right</b> half. left = mid + 1 = ' + l + '.' }); }
      }
      if (found < 0) snap({ slide: 9, line: L(BS, 'return -1;'), out: '-1', cap: 'left (' + l + ') &gt; right (' + r + '): nothing left to search. Return <b>−1</b>.' + (!sorted && R.a.indexOf(R.t) >= 0 ? ' But ' + R.t + ' <b>is</b> in the array (index ' + R.a.indexOf(R.t) + ')! Binary search threw away the wrong half because the array is not sorted.' : '') });
      snap({ slide: 12, line: L(BS, 'int mid = (left + right) / 2;'), sum: true, lc: lc, cap: 'Binary search: <b>' + c + '</b> comparison' + (c > 1 ? 's' : '') + '; linear search would need <b>' + lc + '</b>. Each step halves the pool, so at most about log₂ n steps: O(log n) instead of O(n).' });
      return st;
    },
    draw: function (k, s) {
      var items = [];
      if (s.cmp) {
        [['3.compareTo(8)', '< 0'], ['8.compareTo(8)', '0'], ['9.compareTo(8)', '> 0']].forEach(function (p, i) { items.push(B('cp' + i, 90, 50 + i * 70, 220, 44, { title: p[0], mono: true, size: 14, tone: 'blue' })); items.push(T('cv' + i, 340, 78 + i * 70, '→ ' + p[1], { mono: true, size: 16, bold: true, tone: 'accent' })); });
        return items;
      }
      var tone = {}; for (var i = 0; i < s.arr.length; i++) tone[i] = i === s.m ? (s.hit ? 'accent' : 'red') : 'blue';
      var ptr = []; if (s.l <= s.r || s.hit) { ptr.push([s.l, 'left']); ptr.push([s.r, 'right']); } if (s.m != null) ptr.push([s.m, 'mid']);
      items = cells(s.arr, { y: 120, tone: tone, ptr: s.sum ? [] : ptr, dim: [s.l, s.r] });
      items.push(T('tg', 30, 50, 'target = ' + s.t, { mono: true, size: 16, bold: true, tone: 'accent' }));
      if (s.sum) items.push(T('sm', 280, 260, 'binary: ' + s.c + '   ·   linear: ' + s.lc, { anchor: 'middle', mono: true, size: 18, bold: true, tone: 'teal' }));
      return items.concat(counters(['comparisons: ' + s.c]));
    }
  };

  /* ---------- 3. selection sort (slides 14-17) ---------- */
  var SS = 'public static <T extends Comparable<T>>   // Sorts the array using\n       void selectionSort(T[] array) {    // Selection sort\n  int indexMin;  // index of minimum element\n  for (int index = 0; index < array.length-1; index++) {\n    // find the index of the minimum element\n    indexMin = index;\n    for (int i = index+1; i < array.length; i++)\n      if (array[i].compareTo(array[indexMin])<0) indexMin = i;\n    // swap the elements at index and indexMin\n    T temp = array[index];\n    array[index] = array[indexMin];\n    array[indexMin] = temp;\n  }\n}';
  function srt(src, call) { return function (v) { var a = ints(v.a, 10, [3, 9, 6, 1, 2]); return { a: a, code: src + '\n\n// in main:\n' + aline(a) + '\n' + call + '(array);\nSystem.out.println(Arrays.toString(array));' }; }; }
  var srun = srt(SS, 'selectionSort');
  var selection = {
    id: 'selection', slides: [14, 17], title: 'Selection sort: pick the smallest, swap it into place',
    code: function (v) { return srun(v).code; },
    inputs: [{ id: 'a', type: 'text', label: 'array', value: '3 9 6 1 2', minlen: 1, maxlen: 40 }],
    presets: [{ label: 'slide 16', values: { a: '3 9 6 1 2' } }, { label: 'already sorted', values: { a: '1 2 3 4 5' } }, { label: 'reverse order', values: { a: '8 6 4 2 0' } }, { label: 'equal keys', values: { a: '4 1 4 1 3 2' } }],
    steps: function (v) {
      var R = srun(v), st = [], arr = mk(R.a), c = 0, sw = 0, n = arr.length;
      var snap = function (o) { o.arr = arr.slice(); o.c = c; o.sw = sw; st.push(o); return o; };
      snap({ slide: 14, line: L(R.code, 'selectionSort(array);'), done: 0, cap: '<b>Sorting</b>: put the elements in order, here ascending (small to large). Simple sorts need about n² comparisons; fast ones about n log n.' });
      for (var index = 0; index < n - 1; index++) {
        var mi = index;
        snap({ slide: 15, line: L(SS, 'for (int index = 0;') + ',' + L(SS, 'indexMin = index;'), done: index, idx: index, mi: mi, cap: 'index = ' + index + ': cells 0 to ' + (index - 1 < 0 ? '−' : index - 1) + ' are final. Look for the smallest from index ' + index + '; start with indexMin = ' + index + '.' });
        for (var i = index + 1; i < n; i++) {
          c++; var less = arr[i].v < arr[mi].v;
          snap({ slide: 16, line: L(SS, 'for (int i = index+1;') + '-' + L(SS, 'if (array[i].compareTo'), done: index, idx: index, mi: mi, at: i, cap: 'Is array[' + i + '] = ' + arr[i].v + ' smaller than array[indexMin] = ' + arr[mi].v + '? ' + (less ? '<b>Yes</b>: indexMin = ' + i + '.' : 'No.') });
          if (less) mi = i;
        }
        var t = arr[index]; arr[index] = arr[mi]; arr[mi] = t; if (mi !== index) sw++;
        snap({ slide: 17, line: L(SS, 'T temp = array[index];') + '-' + L(SS, 'array[indexMin] = temp;'), done: index + 1, idx: index, mi: mi, cap: (mi === index ? arr[index].v + ' is already the smallest: it is swapped with itself.' : 'Swap array[' + index + '] and array[' + mi + ']: ' + arr[index].v + ' goes to its final place.') });
      }
      snap({ slide: 17, line: L(R.code, 'System.out.println(Arrays'), done: n, out: '[' + arr.map(function (e) { return e.v; }).join(', ') + ']', cap: 'Sorted. Comparisons: <b>' + c + '</b> = n(n−1)/2, always, even for a sorted array. Swaps: ' + sw + ' (at most n − 1).' });
      return st;
    },
    draw: function (k, s) {
      var tone = {}; for (var i = 0; i < s.arr.length; i++) tone[i] = i < s.done ? 'teal' : i === s.at ? 'red' : i === s.mi ? 'accent' : 'blue';
      var items = cells(s.arr, { y: 140, cw: 60, tone: tone, ptr: s.idx != null && s.done < s.arr.length ? [[s.idx, 'index'], [s.mi, 'min'], [s.at, 'i']] : [] });
      return items.concat(counters(['comparisons: ' + s.c, 'swaps: ' + s.sw]));
    }
  };

  /* ---------- 4. insertion sort (slides 18-20) ---------- */
  var IS = '// Sorts the array using the insertion sort algorithm\npublic static <T extends Comparable<T>>\n              void insertionSort(T[] array) {\n  for (int index = 1; index < array.length; index++) {\n    T element = array[index];\n    int i = index;\n    // shift larger values to the right\n    while (i > 0 && array[i-1].compareTo(element) > 0) {\n      array[i] = array[i-1];\n      i--;\n    }\n    // insert element at the correct position i\n    array[i] = element;\n  }\n}';
  var irun = srt(IS, 'insertionSort');
  var insertion = {
    id: 'insertion', slides: [18, 20], title: 'Insertion sort: take one, shift the bigger ones, insert',
    code: function (v) { return irun(v).code; },
    inputs: [{ id: 'a', type: 'text', label: 'array', value: '3 9 6 1 2', minlen: 1, maxlen: 40 }],
    presets: [{ label: 'slide 19', values: { a: '3 9 6 1 2' } }, { label: 'already sorted', values: { a: '1 2 3 4 5' } }, { label: 'reverse order', values: { a: '8 6 4 2 0' } }, { label: 'one out of place', values: { a: '2 4 6 8 5' } }],
    steps: function (v) {
      var R = irun(v), st = [], arr = mk(R.a), c = 0, sh = 0, n = arr.length, held = null;
      var snap = function (o) { o.arr = arr.map(function (e) { return e; }); o.c = c; o.sh = sh; o.held = held; st.push(o); return o; };
      snap({ slide: 18, line: L(R.code, 'insertionSort(array);'), sorted: 1, cap: 'Insertion sort grows a sorted part on the left. At first it is just array[0].' });
      for (var index = 1; index < n; index++) {
        held = arr[index]; var i = index;
        snap({ slide: 19, line: L(IS, 'T element = array[index];') + '-' + L(IS, 'int i = index;'), sorted: index, lift: index, i: i, cap: 'index = ' + index + ': take element = ' + held.v + ' out. The cells 0 to ' + (index - 1) + ' are sorted (among themselves).' });
        while (i > 0) {
          c++;
          if (arr[i - 1].v > held.v) {
            arr[i] = arr[i - 1]; arr[i - 1] = held; i--; sh++;
            snap({ slide: 19, line: L(IS, 'while (i > 0') + '-' + L(IS, 'i--;'), sorted: index, lift: i, i: i, cap: arr[i + 1].v + ' &gt; ' + held.v + ': shift ' + arr[i + 1].v + ' one cell right; i = ' + i + '.' });
          } else { snap({ slide: 20, line: L(IS, 'while (i > 0'), sorted: index, lift: i, i: i, cap: arr[i - 1].v + ' is not bigger than ' + held.v + ': stop shifting.' }); break; }
        }
        held = null;
        snap({ slide: 20, line: L(IS, 'array[i] = element;'), sorted: index + 1, hot: i, cap: 'array[' + i + '] = ' + arr[i].v + '. Now cells 0 to ' + index + ' are sorted.' });
      }
      snap({ slide: 20, line: L(R.code, 'System.out.println(Arrays'), sorted: n, out: '[' + arr.map(function (e) { return e.v; }).join(', ') + ']', cap: 'Sorted. Comparisons: <b>' + c + '</b>, shifts: <b>' + sh + '</b>. A sorted array needs only n − 1 comparisons and no shifts; a reversed one needs n(n−1)/2.' });
      return st;
    },
    draw: function (k, s) {
      var tone = {}; for (var i = 0; i < s.arr.length; i++) tone[i] = i === s.lift || i === s.hot ? 'accent' : i < s.sorted ? 'teal' : 'blue';
      var items = cells(s.arr, { y: 160, cw: 60, tone: tone, lift: s.lift, ptr: s.i != null ? [[s.i, 'i']] : [] });
      if (s.lift != null) items.push(T('el', 30, 90, 'element', { size: 12, bold: true, tone: 'accent' }));
      return items.concat(counters(['comparisons: ' + s.c, 'shifts: ' + s.sh]));
    }
  };

  /* ---------- 5. bubble sort and the improved version (slides 21-24) ---------- */
  var BB = '// Sorts the specified array using the bubble sort algorithm\npublic static <T extends Comparable<T>>\n              void bubbleSort(T[] array) {\n  for (int pass = 1; pass < array.length; pass++) {\n    for (int i = 0; i < array.length - pass; i++)\n      // If two consecutive elements are unordered then swap them\n      if (array[i].compareTo(array[i+1]) > 0) {\n        T temp = array[i];\n        array[i] = array[i+1];\n        array[i+1] = temp;\n      }\n  }\n}';
  var BI = '// Sorts the specified array using the bubble sort algorithm\npublic static <T extends Comparable<T>>\n              void bubbleSort(T[] array) {\n  for (int pass = 1; pass < array.length; pass++) {\n    boolean sorted = true;          // checks if the array is sorted\n    for (int i = 0; i < array.length - pass; i++)\n      if (array[i].compareTo(array[i+1]) > 0) {\n        T temp = array[i];\n        array[i] = array[i+1];      // swap array[i] with array[i+1]\n        array[i+1] = temp;\n        sorted = false;             // because swapping is done\n      }\n    if (sorted) break;              // if sorted, terminate loop\n  }\n}';
  function burun(v) { var imp = Math.trunc(v.imp) === 1, a = ints(v.a, 10, [61, 53, 85, 74, 21, 49]); return { a: a, imp: imp, src: imp ? BI : BB, code: (imp ? BI : BB) + '\n\n// in main:\n' + aline(a) + '\nbubbleSort(array);\nSystem.out.println(Arrays.toString(array));' }; }
  var bubble = {
    id: 'bubble', slides: [21, 24], title: 'Bubble sort: the largest bubbles to the end',
    code: function (v) { return burun(v).code; },
    inputs: [{ id: 'a', type: 'text', label: 'array', value: '61 53 85 74 21 49', minlen: 1, maxlen: 40 }, { id: 'imp', label: 'improved (1 yes, 0 no)', value: 0, min: 0, max: 1 }],
    presets: [{ label: 'slide 22', values: { a: '61 53 85 74 21 49', imp: 0 } }, { label: 'nearly sorted', values: { a: '1 2 3 5 4 6', imp: 0 } }, { label: 'nearly sorted, improved', values: { a: '1 2 3 5 4 6', imp: 1 } }, { label: 'sorted, improved', values: { a: '2 4 6 8', imp: 1 } }],
    steps: function (v) {
      var R = burun(v), S = R.src, st = [], arr = mk(R.a), c = 0, sw = 0, n = arr.length;
      var snap = function (o) { o.arr = arr.slice(); o.c = c; o.sw = sw; st.push(o); return o; };
      snap({ slide: 21, line: L(R.code, 'bubbleSort(array);'), fixed: n, cap: 'Bubble sort compares <b>neighbours</b> and swaps them when they are in the wrong order. Each pass carries the largest remaining value to the end.' + (R.imp ? ' This is the <b>improved</b> version (slide 24).' : '') });
      for (var pass = 1; pass < n; pass++) {
        var sorted = true;
        for (var i = 0; i < n - pass; i++) {
          c++; var bad = arr[i].v > arr[i + 1].v;
          if (bad) { var t = arr[i]; arr[i] = arr[i + 1]; arr[i + 1] = t; sw++; sorted = false; }
          snap({ slide: R.imp ? 24 : 22, line: L(S, 'for (int i = 0;') + ',' + L(S, 'if (array[i].compareTo(array[i+1]) > 0)') + (bad ? '-' + (L(S, 'array[i+1] = temp;') + (R.imp ? 1 : 0)) : ''), fixed: n - pass + 1, at: i, sw1: bad, pass: pass, cap: 'Pass ' + pass + ', i = ' + i + ': ' + (bad ? arr[i + 1].v + ' &gt; ' + arr[i].v + ', <b>swap</b>.' : arr[i].v + ' ≤ ' + arr[i + 1].v + ', no swap.') });
        }
        snap({ slide: R.imp ? 24 : 23, line: L(S, 'for (int pass = 1;'), fixed: n - pass, pass: pass, cap: 'End of pass ' + pass + ': ' + arr[n - pass].v + ' is in its final place. The next pass stops one cell earlier (i &lt; array.length − pass).' + (!R.imp && sorted ? ' No swaps in this pass: the array is already sorted, but this version keeps going.' : '') });
        if (R.imp && sorted) { snap({ slide: 24, line: L(S, 'if (sorted) break;'), fixed: 0, cap: 'No swap in pass ' + pass + ': <code>sorted</code> stayed true, so <b>break</b>. The improved version stops early.' }); break; }
      }
      snap({ slide: R.imp ? 24 : 23, line: L(R.code, 'System.out.println(Arrays'), fixed: 0, out: '[' + arr.map(function (e) { return e.v; }).join(', ') + ']', cap: 'Sorted after ' + Math.min(pass, n - 1) + ' pass' + (Math.min(pass, n - 1) > 1 ? 'es' : '') + '. Comparisons: <b>' + c + '</b>, swaps: <b>' + sw + '</b>.' });
      return st;
    },
    draw: function (k, s) {
      var tone = {}; for (var i = 0; i < s.arr.length; i++) tone[i] = i >= s.fixed ? 'teal' : i === s.at || i === s.at + 1 ? (s.sw1 ? 'accent' : 'red') : 'blue';
      var items = cells(s.arr, { y: 140, cw: 60, tone: tone, ptr: s.at != null ? [[s.at, 'i'], [s.at + 1, 'i+1']] : [] });
      if (s.pass) items.push(T('ps', 30, 50, 'pass ' + s.pass, { mono: true, size: 16, bold: true, tone: 'accent' }));
      return items.concat(counters(['comparisons: ' + s.c, 'swaps: ' + s.sw]));
    }
  };

  /* ---------- 6. quick sort and partition (slides 26-30) ---------- */
  var QS = '// Sorts the specified array using the quick sort algorithm\npublic static <T extends Comparable<T>> void quickSort(T[] array) {\n  quickSort(array, 0, array.length - 1);\n}\n// Recursive quickSort: Sorts the subarray from low to high index\nprivate static <T extends Comparable<T>>\n               void quickSort(T[] array, int low, int high) {\n  if (low < high) {\n    int pivotIndex = partition(array, low, high);\n    quickSort(array, low, pivotIndex - 1);    // Sort left subarray\n    quickSort(array, pivotIndex + 1, high);   // Sort right subarray\n  }\n}\n// Used by quicksort to partition a generic array of elements\nprivate static <T extends Comparable<T>>\n        int partition(T[] array, int low, int high) {\n  T pivot = array[high];   // Use the high element as pivot\n  int i = low;\n  // Skip the elements that are smaller than the pivot\n  while (array[i].compareTo(pivot) < 0) i++;\n  for (int j=i+1; j<high; j++)\n    if (array[j].compareTo(pivot) < 0) {\n      swap(array, i, j);   // swap if array[j] < pivot\n      i++;                 // array[i] >= pivot\n    }\n  swap(array, i, high);    // Move the pivot element\n  return i;                // Return the index of the pivot\n}';
  var QA = '15 5 18 17 -2 34 98 46 59 67 19 14 12 15 18';
  function qrun(v) { var a = ints(v.a, 15, [15, 5, 18]); return { a: a, code: QS + '\n\n// in main:\n' + aline(a) + '\nquickSort(array);\nSystem.out.println(Arrays.toString(array));' }; }
  var quick = {
    id: 'quick', slides: [26, 30], title: 'Quick sort: partition around a pivot, then recurse', vb: [560, 360],
    code: function (v) { return qrun(v).code; },
    inputs: [{ id: 'a', type: 'text', label: 'array', value: QA, minlen: 1, maxlen: 70 }],
    presets: [{ label: 'slides 27 and 30', values: { a: QA } }, { label: 'a short array', values: { a: '7 2 9 4 5' } }, { label: 'already sorted (worst case)', values: { a: '1 2 3 4 5 6 7' } }, { label: 'all equal', values: { a: '4 4 4 4' } }],
    steps: function (v) {
      var R = qrun(v), st = [], arr = mk(R.a), c = 0, depth = 0, maxd = 0, done = {};
      var snap = function (o) { o.arr = arr.slice(); o.c = c; o.dn = JSON.parse(JSON.stringify(done)); o.dp = maxd; st.push(o); return o; };
      var sw = function (a, b) { var t = arr[a]; arr[a] = arr[b]; arr[b] = t; };
      snap({ slide: 26, line: L(QS, 'quickSort(array, 0, array.length - 1);'), cap: 'Quick sort: choose a <b>pivot</b> (here the rightmost element), <b>partition</b> so that smaller elements go left and the others go right, then quick sort each side recursively.' });
      var qs = function (lo, hi) {
        depth++; maxd = Math.max(maxd, depth);
        if (lo >= hi) { if (lo === hi) done[lo] = 1; depth--; return; }
        var pv = arr[hi].v, i = lo;
        snap({ slide: 28, line: L(QS, 'if (low < high) {') + ',' + L(QS, 'int pivotIndex = partition'), lo: lo, hi: hi, pv: hi, cap: 'quickSort(low = ' + lo + ', high = ' + hi + '): partition the cells ' + lo + ' to ' + hi + '. pivot = array[' + hi + '] = <b>' + pv + '</b>.' });
        while (arr[i].v < pv) { i++; c++; }
        c++;
        snap({ slide: 29, line: L(QS, 'T pivot = array[high];') + '-' + L(QS, 'while (array[i].compareTo(pivot) < 0) i++;'), lo: lo, hi: hi, pv: hi, i: i, cap: 'Skip the elements at the start that are already smaller than ' + pv + ': i stops at ' + i + ' (array[' + i + '] = ' + arr[i].v + ' ≥ pivot).' });
        for (var j = i + 1; j < hi; j++) {
          c++;
          if (arr[j].v < pv) { sw(i, j); i++; snap({ slide: 30, line: L(QS, 'for (int j=i+1;') + '-' + L(QS, 'i++;                 // array[i]'), lo: lo, hi: hi, pv: hi, i: i, j: j, hot: [i - 1, j], cap: 'j = ' + j + ': ' + arr[i - 1].v + ' &lt; ' + pv + ', so swap it with array[' + (i - 1) + '] (the first big one), and i++ → ' + i + '.' }); }
          else snap({ slide: 30, line: L(QS, 'for (int j=i+1;') + '-' + L(QS, 'if (array[j].compareTo(pivot) < 0)'), lo: lo, hi: hi, pv: hi, i: i, j: j, cap: 'j = ' + j + ': ' + arr[j].v + ' ≥ ' + pv + ': it stays on the right side.' });
        }
        sw(i, hi); done[i] = 1;
        snap({ slide: 30, line: L(QS, 'swap(array, i, high);') + '-' + L(QS, 'return i;'), lo: lo, hi: hi, pv: i, i: i, split: i, cap: 'swap(i, high): the pivot ' + pv + ' goes to index <b>' + i + '</b>, its final place. Left of it: smaller; right of it: ≥ ' + pv + '.' });
        snap({ slide: 27, line: L(QS, 'quickSort(array, low, pivotIndex - 1);') + '-' + L(QS, 'quickSort(array, pivotIndex + 1, high);'), lo: lo, hi: hi, split: i, cap: 'Now sort the two parts recursively: cells ' + lo + '–' + (i - 1) + ' and ' + (i + 1) + '–' + hi + '.' });
        qs(lo, i - 1); qs(i + 1, hi); depth--;
      };
      qs(0, arr.length - 1);
      for (var q = 0; q < arr.length; q++) done[q] = 1;
      snap({ slide: 27, line: L(R.code, 'System.out.println(Arrays'), out: '[' + arr.map(function (e) { return e.v; }).join(', ') + ']', cap: 'Sorted. Comparisons: <b>' + c + '</b>; deepest recursion: ' + maxd + ' levels (balanced partitions give about log₂ n levels; a sorted array gives n levels).' });
      return st;
    },
    draw: function (k, s) {
      var tone = {}, n = s.arr.length;
      for (var i = 0; i < n; i++) tone[i] = i === s.pv ? 'accent' : s.hot && s.hot.indexOf(i) >= 0 ? 'red' : s.dn[i] ? 'teal' : s.split != null && i >= s.lo && i < s.split ? 'blue' : 'blue';
      var ptr = []; if (s.lo != null && s.split == null) { if (s.i != null) ptr.push([s.i, 'i']); if (s.j != null) ptr.push([s.j, 'j']); }
      var items = cells(s.arr, { y: 140, tone: tone, ptr: ptr, dim: s.lo != null ? [s.lo, s.hi] : null });
      if (s.lo != null) {
        var cw = Math.min(52, Math.floor(520 / n)), x0 = 280 - n * cw / 2;
        items.push(A('rg', x0 + s.lo * cw + 2, 96, x0 + (s.hi + 1) * cw - 2, 96, { head: false, tone: 'accent', label: 'low ' + s.lo + ' … high ' + s.hi }));
        if (s.split != null) {
          if (s.split > s.lo) items.push(T('ls', x0 + (s.lo + s.split) * cw / 2, 230, '< pivot', { anchor: 'middle', size: 12, bold: true, tone: 'blue' }));
          if (s.split < s.hi) items.push(T('rs', x0 + (s.split + 1 + s.hi + 1) * cw / 2, 230, '≥ pivot', { anchor: 'middle', size: 12, bold: true, tone: 'blue' }));
        }
      }
      return items.concat(counters(['comparisons: ' + s.c, 'depth: ' + s.dp]));
    }
  };

  /* ---------- 7. merge sort (slides 31-37) ---------- */
  var MS = '// Sorts the specified array using the merge sort algorithm\npublic static <T extends Comparable<T>>\n              void mergeSort(T[] array) {\n  mergeSort(array, 0, array.length - 1);\n}\n// Recursive mergeSort: sorts a subarray from low to high index\nprivate static <T extends Comparable<T>>\n               void mergeSort(T[] array, int low, int high) {\n  if (low < high) {\n    int mid = (low + high) / 2;\n    mergeSort(array, low, mid);        // sorts the first half\n    mergeSort(array, mid+1, high);     // sorts the second half\n    merge(array, low, mid, high);      // merges the two halves\n  }\n}\n// Merges two sorted subarrays (low to mid) and (mid+1 to high)\nprivate static <T extends Comparable<T>>\n        void merge(T[] array, int low, int mid, int high) {\n  T[] temp = (T[]) new Comparable[high-low+1];   // new temporary array\n  int i = low;     // index for first subarray\n  int j = mid+1;   // index for second subarray\n  int k = 0;       // index for temp array\n  //  Copy smaller element from each subarray into temp array\n  while (i <= mid && j <= high)\n    if (array[i].compareTo(array[j]) < 0) temp[k++] = array[i++];\n    else temp[k++] = array[j++];\n  //  Copy remaining elements from the first and second subarray\n  while (i <= mid) temp[k++] = array[i++];\n  while (j <= high) temp[k++] = array[j++];\n  //  Copy merged temporary array into original array\n  for (i = low; i <= high; i++) array[i] = temp[i-low];\n}';
  var MA = '305 65 7 90 120 110 8';
  function mrun(v) { var a = ints(v.a, 10, [305, 65, 7]); return { a: a, code: MS + '\n\n// in main:\n' + aline(a) + '\nmergeSort(array);\nSystem.out.println(Arrays.toString(array));' }; }
  var merge = {
    id: 'merge', slides: [31, 37], title: 'Merge sort: split in halves, merge back in order', vb: [560, 360],
    code: function (v) { return mrun(v).code; },
    inputs: [{ id: 'a', type: 'text', label: 'array', value: MA, minlen: 1, maxlen: 50 }],
    presets: [{ label: 'slides 32-33', values: { a: MA } }, { label: '8 elements', values: { a: '38 27 43 3 9 82 10 1' } }, { label: 'already sorted', values: { a: '1 2 3 4 5' } }, { label: 'two elements', values: { a: '9 4' } }],
    steps: function (v) {
      var R = mrun(v), st = [], a = R.a.slice(), n = a.length, nodes = {}, c = 0, lv = 0;
      var key = function (lo, hi) { return lo + '-' + hi; };
      var snap = function (o) { o.nodes = JSON.parse(JSON.stringify(nodes)); o.n = n; o.c = c; o.lv = lv; st.push(o); return o; };
      nodes[key(0, n - 1)] = { lo: 0, hi: n - 1, d: 0, v: a.slice() };
      snap({ slide: 31, line: L(MS, 'mergeSort(array, 0, array.length - 1);'), cap: 'Merge sort: divide the array in two halves again and again, until each piece has one element; then <b>merge</b> the pieces back, two sorted pieces at a time.' });
      var ms = function (lo, hi, d) {
        lv = Math.max(lv, d);
        if (lo >= hi) return;
        var mid = Math.floor((lo + hi) / 2);
        nodes[key(lo, mid)] = { lo: lo, hi: mid, d: d + 1, v: a.slice(lo, mid + 1) };
        nodes[key(mid + 1, hi)] = { lo: mid + 1, hi: hi, d: d + 1, v: a.slice(mid + 1, hi + 1) };
        snap({ slide: 32, line: L(MS, 'int mid = (low + high) / 2;') + '-' + L(MS, 'mergeSort(array, mid+1, high);'), hot: key(lo, hi), cap: 'mergeSort(' + lo + ', ' + hi + '): mid = (' + lo + ' + ' + hi + ') / 2 = ' + mid + '. Split into ' + lo + '–' + mid + ' and ' + (mid + 1) + '–' + hi + '.' });
        ms(lo, mid, d + 1); ms(mid + 1, hi, d + 1);
        var tmp = [], i = lo, j = mid + 1, cc = 0;
        while (i <= mid && j <= hi) { c++; cc++; if (a[i] < a[j]) tmp.push(a[i++]); else tmp.push(a[j++]); }
        while (i <= mid) tmp.push(a[i++]); while (j <= hi) tmp.push(a[j++]);
        for (i = lo; i <= hi; i++) a[i] = tmp[i - lo];
        nodes[key(lo, hi)].v = tmp.slice(); nodes[key(lo, hi)].m = true;
        snap({ slide: 33, line: L(MS, 'merge(array, low, mid, high);') + ',' + L(MS, 'while (i <= mid && j <= high)') + '-' + L(MS, 'for (i = low; i <= high; i++)'), hot: key(lo, hi), cap: 'merge(' + lo + ', ' + mid + ', ' + hi + '): take the smaller front element of the two sorted halves each time (' + cc + ' comparison' + (cc === 1 ? '' : 's') + '), copy the rest, then copy temp back: ' + tmp.join(' ') + '.' });
      };
      ms(0, n - 1, 0);
      snap({ slide: 34, line: L(R.code, 'System.out.println(Arrays'), out: '[' + a.join(', ') + ']', cap: 'Sorted with <b>' + c + '</b> comparisons.' });
      snap({ slide: 36, line: L(MS, 'int mid = (low + high) / 2;'), sum: 1, cap: 'Selection, insertion and bubble sort use two nested loops: about n² comparisons, O(n²). Merge sort has about log₂ n levels (here ' + lv + '), and merging one whole level costs O(n): <b>O(n log n)</b>.' });
      snap({ slide: 37, line: L(MS, 'int mid = (low + high) / 2;'), sum: 2, cap: 'Quick sort: partitioning is O(n) per level. With balanced pivots there are about log₂ n levels: O(n log n) on average. With bad pivots (for example a sorted array) there are n levels: O(n²) in the worst case. Merge sort always splits in the middle.' });
      return st;
    },
    draw: function (k, s) {
      var items = [], n = s.n, cw = Math.min(56, Math.floor(520 / n)), x0 = 280 - n * cw / 2;
      if (s.sum) {
        var rows = s.sum === 1 ? [['selection / insertion / bubble', 'O(n²)', 'red'], ['merge sort', 'O(n log n)', 'teal']] : [['quick sort, average', 'O(n log n)', 'teal'], ['quick sort, worst case', 'O(n²)', 'red'], ['merge sort, always', 'O(n log n)', 'teal']];
        rows.forEach(function (r, i) { items.push(B('sr' + i, 40, 50 + i * 70, 300, 44, { title: r[0], size: 14, tone: 'blue' })); items.push(T('sv' + i, 370, 78 + i * 70, r[1], { mono: true, size: 18, bold: true, tone: r[2] })); });
        items.push(T('sn', 40, 300, 'n = 1000: n² = 1,000,000   n log₂ n ≈ 10,000', { mono: true, size: 13, tone: 'muted' }));
        return items;
      }
      Object.keys(s.nodes).forEach(function (kk) {
        var nd = s.nodes[kk], y = 30 + nd.d * 64, hot = kk === s.hot, w = (nd.hi - nd.lo + 1) * cw - 6;
        items.push(B('m' + kk, x0 + nd.lo * cw + 3, y, w, 34, { title: nd.v.join(' '), mono: true, size: cw < 44 ? 11 : 13, tone: hot ? 'accent' : nd.m ? 'teal' : 'blue', fill: hot ? 'solid' : 'soft', hi: hot }));
      });
      return items.concat(counters(['comparisons: ' + s.c]));
    }
  };

  /* ---------- 8. radix sort (slides 39-46) ---------- */
  var RX = 'public static void radixSort(int[] array, int maxdigits) {\n  // pos is the position weight = 1, 10, 100, etc.\n  for (int pass=1, pos=1; pass <= maxdigits; pass++, pos *= 10) {\n    int[] count = new int[10];   // 10 counters for digits 0 to 9\n    for (int element : array) count[(element / pos) % 10]++;\n    int[] index = new int[10];   // 10 indexes for digits 0 to 9\n    for (int i = 0; i < 9; i++) index[i+1] = index[i] + count[i];\n    // Sort the array elements by mapping them to their correct indexes\n    int[] sortarray = new int[array.length];\n    for (int element : array) {\n      int digit = (element/pos) % 10;   // digit at a given position\n      sortarray[index[digit]] = element;\n      index[digit]++;\n    }\n    System.arraycopy(sortarray, 0, array, 0, array.length);\n  }\n}';
  var RA = '442 503 629 312 145 250 341 99 2 420 75 47';
  function rrun(v) { var a = ints(v.a, 12, [442, 503, 629]), d = Math.trunc(v.d); return { a: a, d: d, code: RX + '\n\n// in main:\nint[] array = {' + a.join(',') + '};\nradixSort(array, ' + d + ');\nSystem.out.println(Arrays.toString(array));' }; }
  var radix = {
    id: 'radix', slides: [39, 46], title: 'Radix sort: count digits, compute indexes, place', vb: [560, 380],
    code: function (v) { return rrun(v).code; },
    inputs: [{ id: 'a', type: 'text', label: 'array', value: RA, minlen: 1, maxlen: 60 }, { id: 'd', label: 'maxdigits', value: 3, min: 1, max: 4 }],
    presets: [{ label: 'slide 41', values: { a: RA, d: 3 } }, { label: 'maxdigits too small', values: { a: RA, d: 2 } }, { label: 'two-digit numbers', values: { a: '38 27 43 3 9 82 10', d: 2 } }, { label: 'a negative number', values: { a: '31 -4 12', d: 2 } }],
    steps: function (v) {
      var R = rrun(v), st = [], a = mk(R.a), ids = a.length;
      var snap = function (o) { o.arr = a.slice(); st.push(o); return o; };
      snap({ slide: 39, line: L(R.code, 'radixSort(array,'), cap: 'All the sorts so far <b>compare</b> elements; the best was O(n log n). Radix sort never compares two elements: it groups numbers by their <b>digits</b> (radix 10: digits 0 to 9).' });
      snap({ slide: 40, line: L(RX, 'for (int pass=1, pos=1;'), cap: 'It makes one pass per digit: pass 1 uses the 1s digit, pass 2 the 10s digit, pass 3 the 100s digit (pos = 1, 10, 100). After the last pass the array is sorted.' });
      for (var pass = 1, pos = 1; pass <= R.d; pass++, pos *= 10) {
        var dg = a.map(function (e) { return Math.trunc(e.v / pos) % 10; });
        var neg = dg.findIndex(function (x) { return x < 0; });
        if (neg >= 0) { snap({ slide: 42, line: L(RX, 'for (int element : array) count['), pos: pos, dg: dg, err: true, out: 'Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index ' + dg[neg] + ' out of bounds for length 10', cap: 'For ' + a[neg].v + ': (' + a[neg].v + ' / ' + pos + ') % 10 = <b>' + dg[neg] + '</b>, a negative digit. count[' + dg[neg] + '] does not exist: <b>ArrayIndexOutOfBoundsException</b>. This radix sort works only for numbers ≥ 0.' }); return st; }
        var cnt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; dg.forEach(function (x) { cnt[x]++; });
        snap({ slide: 42, line: L(RX, 'int[] count = new int[10];') + '-' + L(RX, 'for (int element : array) count['), pos: pos, dg: dg, cnt: cnt, cap: 'Pass ' + pass + ' (pos = ' + pos + '): digit = (element / ' + pos + ') % 10. Count how many numbers have each digit.' });
        var idx = [0]; for (var i = 0; i < 9; i++) idx.push(idx[i] + cnt[i]);
        snap({ slide: 43, line: L(RX, 'int[] index = new int[10];') + '-' + L(RX, 'index[i+1] = index[i] + count[i];'), pos: pos, dg: dg, cnt: cnt, idx: idx, cap: 'index[d] = where the numbers with digit d start: index[i+1] = index[i] + count[i]. Digit 0 starts at 0, digit 1 after all the 0s, …' });
        var sa = new Array(a.length), ix = idx.slice();
        a.forEach(function (e, q) { sa[ix[dg[q]]] = e; ix[dg[q]]++; });
        snap({ slide: 44, line: L(RX, 'int[] sortarray') + '-' + L(RX, 'index[digit]++;'), pos: pos, dg: dg, cnt: cnt, idx: idx, sa: sa, cap: 'Each number goes to <code>sortarray[index[digit]]</code>, and that index moves up by one. Numbers with the same digit keep their old order (this is why the passes work).' });
        a = sa;
        snap({ slide: pass === 1 ? 44 : 45, line: L(RX, 'System.arraycopy'), pos: pos, cap: 'arraycopy: the array is now sorted by the last ' + pass + ' digit' + (pass > 1 ? 's' : '') + ': ' + a.map(function (e) { return e.v; }).join(', ') + '.' });
      }
      var ok = a.every(function (e, q) { return !q || a[q - 1].v <= e.v; });
      snap({ slide: 46, line: L(R.code, 'System.out.println(Arrays'), out: '[' + a.map(function (e) { return e.v; }).join(', ') + ']', cap: ok ? 'Sorted after ' + R.d + ' passes of n steps: O(d × n). With d fixed and n large this is O(n), faster than quick sort or merge sort. But it only sorts integer keys (not generic).' : '<b>Not sorted!</b> maxdigits = ' + R.d + ' is less than the number of digits of the largest number, so the last digit position was never used.' });
      return st;
    },
    draw: function (k, s) {
      var items = [], n = s.arr.length, cw = Math.min(40, Math.floor(470 / n)), x0 = 72;
      items.push(T('al', 20, 34, 'array', { size: 12, bold: true, tone: 'muted' }));
      items = items.concat(cells(s.arr, { y: 40, cw: cw, x0: x0, idx: false, tone: s.dg ? s.dg.reduce(function (o, d, i) { o[i] = d < 0 ? 'red' : 'blue'; return o; }, {}) : null }));
      if (s.dg) s.dg.forEach(function (d, i) { items.push(T('dg' + i, x0 + i * cw + cw / 2, 98, String(d), { anchor: 'middle', mono: true, size: 13, bold: true, tone: d < 0 ? 'red' : 'accent' })); });
      if (s.dg) items.push(T('dl', 20, 98, 'digit', { size: 11, tone: 'accent' }));
      var row = function (p, y, vals, lb) { items.push(T(p + 'l', 20, y + 22, lb, { size: 11, bold: true, tone: 'muted' })); vals.forEach(function (x, i) { items.push(B(p + i, 80 + i * 46, y, 42, 32, { title: String(x), mono: true, size: 13, tone: 'teal' })); items.push(T(p + 'i' + i, 101 + i * 46, y - 4, String(i), { anchor: 'middle', mono: true, size: 9, tone: 'muted' })); }); };
      if (s.cnt) row('cn', 136, s.cnt, 'count');
      if (s.idx) row('id', 196, s.idx, 'index');
      if (s.sa) { items.push(T('sl', 20, 274, 'sortarray', { size: 11, bold: true, tone: 'muted' })); items = items.concat(cells(s.sa, { y: 284, cw: cw, x0: x0, idx: false, p: 's', tone: {} }).map(function (it) { if (it.k === 'box') it.id = 's' + it.id; return it; })); }
      if (s.pos) items.push(T('ps', 548, 30, 'pos = ' + s.pos, { anchor: 'end', mono: true, size: 15, bold: true, tone: 'accent' }));
      return items;
    }
  };

  var code = function (t) { return { type: 'code', lang: 'java', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; };
  var OUT = ['Searching', 'Sorting', 'Fast Sorting Algorithms', 'Radix Sort'];
  function outline(on, ex) { return { blocks: OUT.map(function (t, i) { return { type: 'bullet', html: i === on ? '<b>' + t + '</b>' : t }; }), explain: ex }; }
  var part = function (src, a, b) { return src.slice(src.indexOf(a), b ? src.indexOf(b) : undefined).replace(/\n$/, ''); };

  addUnit({
    course: 'ds', lesson: '09-searching-and-sorting',
    blurb: 'Linear and binary search, generic static methods and compareTo, selection, insertion, bubble, quick, merge and radix sort, and how fast each one is.',
    parts: [
      { title: 'Searching', from: 1, to: 12 },
      { title: 'Sorting', from: 13, to: 24 },
      { title: 'Fast sorting algorithms', from: 25, to: 37 },
      { title: 'Radix sort', from: 38, to: 46 }
    ],
    visuals: [linear, binary, selection, insertion, bubble, quick, merge, radix],
    slides: {
      1: { cover: true, explain: '<p><b>Searching</b>: find a target element in a group of elements. <b>Sorting</b>: put a group of elements in order.</p><pre class="ex">search 12 in 31 7 58 12 → found at index 3\nsort 31 7 58 12        → 7 12 31 58</pre><p>Sorting and searching go together: a sorted array can be searched much faster.</p>' },
      2: outline(-1, '<p>The plan: searching, simple sorts, fast sorts (quick and merge sort), and radix sort.</p>'),
      3: { explain: '<p>Searching finds the target or decides that it is not there. Two common ways:</p><ul><li><b>linear search</b>: check the elements one by one;</li><li><b>binary search</b>: much faster, but the elements must be <b>sorted</b> first.</li></ul><pre class="ex">the cost of a search = the number of comparisons</pre><p class="watch">“Not found” must also be a clear answer (here −1), not an error.</p>' },
      4: { explain: '<p>A <b>static</b> method (class method) belongs to the class, not to an object. It is called through the class name:</p><pre class="ex">Math.sqrt(x)\nSearch.linearSearch(array, target)</pre><p>Because there is no object, a static method cannot use instance variables, and it can only call other static methods and use static variables.</p><p class="watch">Calling an instance method from main without an object is a common compile error: main is static.</p>' },
      5: { blocks: [bul('Instead of writing a generic class, we can write a generic static method that references a generic element of type T.'), bul('For example, a generic search method can be written as shown below. It can search an array of elements of type T.'), code('public class Search {\n  // Generic static linear search method\n  public static <T> int linearSearch(T[] array, T target) {\n    . . .\n  }\n}')],
        explain: '<p>A <b>generic method</b> has its own type parameter, written before the return type:</p><pre class="ex">public static &lt;T&gt; int linearSearch(T[] array, T target)</pre><p>The class Search is not generic; only the method is. The same method can search an Integer[], a String[], …</p><p class="watch">T must be a class type: an <code>int[]</code> cannot be passed as T[]; use <code>Integer[]</code>.</p>' },
      6: { blocks: [bul('The method returns the index of the first occurrence of target inside the array. If not found, it returns -1.'), bul('Linear search is slow. In the worst case, all the n array elements must be searched. Its time complexity is O(n).'), code(LS.slice(LS.indexOf('  // Generic'), LS.lastIndexOf('}') - 1).replace(/^  /gm, ''))],
        explain: '<p>Linear search checks index 0, 1, 2, … with <code>equals</code> and returns the first index where it matches, or −1.</p><pre class="ex">7 3 9 3   target 3 → 1 (the first 3)\n          target 8 → −1 (4 comparisons)</pre><p>Worst case: all n elements are checked, O(n). It works on any array, sorted or not.</p><p class="watch">Use <code>equals</code> to compare objects; <code>==</code> compares references.</p>' },
      7: { explain: '<p>If the array is <b>sorted</b>, we can do better. Binary search looks at the <b>middle</b> element first:</p><ul><li>equal: found;</li><li>target smaller: it can only be in the left half;</li><li>target bigger: only in the right half.</li></ul><pre class="ex">16 elements → 8 → 4 → 2 → 1   (at most 5 looks)</pre><p>Then it jumps to the middle of that half and repeats.</p>' },
      8: { text: false, blocks: [], explain: '<p>Search 67 in the sorted array (indexes 0 to 14):</p><pre class="ex">left = 0, right = 14 → mid = 7: array[7] = 46\n67 &gt; 46 → left = 8, mid = (8 + 14) / 2 = 11: 72</pre><p>One comparison removed half of the array: indexes 0 to 7 can be ignored.</p>' },
      9: { text: false, explain: '<p>Next: 67 &lt; 72, so right = 10 and mid = (8 + 10) / 2 = 9: array[9] = 67. Found at index <b>9</b>, after only 3 comparisons.</p><pre class="ex">linear search would need 10 comparisons</pre><p>With each comparison, binary search removes half of the elements that are still possible.</p>' },
      10: { explain: '<p>To search and sort generic elements we need an order. <b>Comparable&lt;T&gt;</b> gives it with one method:</p><pre class="ex">x.compareTo(y) &lt; 0   x is less than y\nx.compareTo(y) == 0  equal\nx.compareTo(y) &gt; 0   x is greater</pre><p>Integer and String already implement Comparable. For your own class, implement compareTo.</p><p class="watch">Only the <b>sign</b> of the result matters, not the exact number.</p>' },
      11: { title: 'Generic Binary Search Method', blocks: [code(BS)], explain: '<p><code>&lt;T extends Comparable&lt;T&gt;&gt;</code>: T must have compareTo. The loop keeps left and right around the part still to search:</p><pre class="ex">mid = (left + right) / 2;\nc &lt; 0 → right = mid − 1;   c &gt; 0 → left = mid + 1;</pre><p>When left &gt; right, nothing is left: return −1.</p><p class="watch">On the slide, “–” in <code>mid – 1</code> and <code>array.length – 1</code> is a long dash, not a minus: copied as is, the code does not compile.</p>' },
      12: { explain: '<ul><li>Linear search: the worst case (not found, or the last element) is n comparisons; on average n/2. Both are O(n).</li><li>Binary search: at most about log₂ n comparisons: O(log n).</li></ul><pre class="ex">n = 1,000,000: linear up to 1,000,000; binary about 20</pre><p class="watch">Binary search works only on a sorted array; on an unsorted one it may say −1 for an element that is there.</p>' },
      13: outline(1, '<p>Next: three simple sorting algorithms.</p>'),
      14: { blocks: [bul('Sorting is the process of arranging a group of items into a defined order based on a particular criteria.'), bul('Ascending order: small to large', 1), bul('Descending order: large to small', 1), bul('Many sorting algorithms have been designed'), bul('Sequential sorts typically require n² comparisons to sort n elements', 1), bul('Logarithmic sorts typically require n log₂ n comparisons.', 1), bul('As with searching, sorting must compare generic elements.')],
        explain: '<p>Sorting puts items in a defined order: <b>ascending</b> (small to large) or <b>descending</b> (large to small).</p><pre class="ex">sequential sorts:  about n² comparisons\nlogarithmic sorts: about n log₂ n comparisons\nn = 1000: 1,000,000 vs about 10,000</pre><p>Like searching, sorting compares generic elements with compareTo.</p>' },
      15: { explain: '<p><b>Selection sort</b>: find the smallest element and swap it into the first place; find the next smallest and swap it into the second place; and so on.</p><pre class="ex">3 9 6 1 2 → 1 9 6 3 2 → 1 2 6 3 9 → …</pre><p>After step k, the first k cells hold the k smallest elements in their final order.</p>' },
      16: { text: false, explain: '<p>The example 3 9 6 1 2:</p><pre class="ex">smallest from 3: 1 → swap 1 and 3 → 1 9 6 3 2\nsmallest from 9: 2 → swap 9 and 2 → 1 2 6 3 9\nsmallest from 6: 3 → swap 6 and 3 → 1 2 3 6 9\nsmallest from 6: 6 → swap with itself</pre><p>n − 1 = 4 rounds; the last element is then in place by itself.</p>' },
      17: { title: 'Generic Selection Sort Method', blocks: [code(SS)], explain: '<p>The outer loop picks the place <code>index</code>; the inner loop finds <code>indexMin</code>, the index of the smallest element from index on; then a swap with <code>temp</code>.</p><pre class="ex">comparisons: (n−1) + (n−2) + … + 1 = n(n−1)/2 → O(n²)</pre><p class="watch">Selection sort makes the same number of comparisons even for an array that is already sorted.</p>' },
      18: { blocks: [bul('Insertion sort orders an array by repeatedly inserting a new element into a subset that has already been sorted.'), bul('The Insertion Sort algorithm works as follows:'), bul('Start at the second array element.', 1), bul('Insert the second element into the proper position shifting the first element if needed.', 1), bul('Insert the third element into the sorted subarray, shifting the first two elements if needed.', 1), bul('Repeat until all array elements have been inserted properly.', 1)],
        explain: '<p><b>Insertion sort</b> works like sorting cards in your hand: take the next card and slide it left into the right place among the cards already sorted.</p><pre class="ex">sorted | rest\n3      | 9 6 1 2\n3 9    | 6 1 2\n3 6 9  | 1 2</pre><p>Bigger elements are <b>shifted</b> right one cell to make room.</p>' },
      19: { text: false, explain: '<p>The example 3 9 6 1 2:</p><pre class="ex">insert 9: shift nothing      → 3 9 6 1 2\ninsert 6: shift 9            → 3 6 9 1 2\ninsert 1: shift 9, 6, 3      → 1 3 6 9 2\ninsert 2: shift 9, 6, 3      → 1 2 3 6 9</pre><p>Each element moves left until the element before it is not bigger.</p>' },
      20: { title: 'Generic Insertion Sort Method', blocks: [code(IS)], explain: '<p>Save <code>element = array[index]</code>, then shift while the left neighbour is bigger:</p><pre class="ex">while (i &gt; 0 &amp;&amp; array[i-1] &gt; element) { array[i] = array[i-1]; i--; }\narray[i] = element;</pre><p>Worst case (reversed): O(n²). Best case (already sorted): n − 1 comparisons, O(n).</p><p class="watch">element must be saved first: the first shift overwrites array[index].</p>' },
      21: { blocks: [bul('Bubble sort orders an array by comparing neighboring elements and swapping their positions if necessary.'), bul('The Bubble Sort algorithm works as follows:'), bul('Traverse the array, exchanging adjacent elements if they are not in their relative order.', 1), bul('After the first pass, the highest value is moved to the end of array', 1), bul('Traverse the array again, moving the second highest value', 1), bul('Repeat until all elements have been placed in their proper order', 1)],
        explain: '<p><b>Bubble sort</b> walks through the array comparing <b>neighbours</b> and swapping them when they are in the wrong order.</p><pre class="ex">61 53 → swap → 53 61</pre><p>In one pass the largest value “bubbles up” to the end. The next pass moves the second largest, and so on.</p>' },
      22: { text: false, explain: '<p>The example 61 53 85 74 21 49, pass by pass:</p><pre class="ex">pass 1: 53 61 74 21 49 85\npass 2: 53 61 21 49 74 85\npass 3: 53 21 49 61 74 85\npass 4: 21 49 53 61 74 85\npass 5: no change</pre><p>After each pass one more value (on the right) is final.</p>' },
      23: { title: 'Generic Bubble Sort Method', blocks: [code(BB)], explain: '<p>Pass p compares array[i] and array[i+1] for i from 0 to n − p − 1, and swaps when array[i] is bigger.</p><pre class="ex">i &lt; array.length - pass   // the last p values are already final</pre><p>Always n(n−1)/2 comparisons: O(n²).</p><p class="watch">Without “- pass”, i + 1 could reach array.length: ArrayIndexOutOfBoundsException (if the bound were array.length).</p>' },
      24: { title: 'Improved Bubble Sort Algorithm', blocks: [code(BI)], explain: '<p>The improvement: a flag <code>sorted</code>. If a whole pass makes <b>no swap</b>, the array is already sorted, so <code>break</code>.</p><pre class="ex">1 2 3 5 4 6: pass 1 swaps 5 and 4,\npass 2 has no swap → stop</pre><p>For a sorted array this needs only one pass: O(n). The worst case is still O(n²).</p>' },
      25: outline(2, '<p>Next: two fast sorting algorithms, quick sort and merge sort.</p>'),
      26: { blocks: [bul('Quick sort orders values by partitioning an array around one pivot element, then sorting each partition.'), bul('The Quick Sort algorithm works as follows:'), bul('Choose one element in the array to be the pivot element. The choice is arbitrary. We will choose the rightmost element as pivot.', 1), bul('Partition the array so that all elements less than the pivot element go to the left and all elements greater than or equal go to the right.', 1), bul('Apply the quick sort algorithm recursively to both partitions.', 1), bul('The algorithm works regardless of our choice of the pivot.')],
        explain: '<p><b>Quick sort</b>:</p><ol><li>choose a <b>pivot</b> (here: the rightmost element);</li><li><b>partition</b>: smaller elements to the left, the others to the right; the pivot lands in its final place;</li><li>quick sort the left part and the right part recursively.</li></ol><pre class="ex">7 2 9 4 | 5   → 2 4 | 5 | 9 7</pre><p class="watch">The pivot choice does not change the result, only the speed.</p>' },
      27: { text: false, explain: '<p>The slide shows the whole sort of 15 numbers. First pivot 18: everything &lt; 18 goes left, ≥ 18 right, and 18 is placed. Then each side gets its own pivot (15 and 46), and so on, until every part has one element.</p><pre class="ex">[ &lt; 18 ] 18 [ ≥ 18 ]\n[&lt;15] 15 [≥15]  18  [&lt;46] 46 [≥46]</pre>' },
      28: { title: 'Generic Quick Sort Method', blocks: [code(part(QS, '// Sorts the specified', '// Used by quicksort'))], explain: '<p>The public quickSort(array) calls the recursive one on the whole array (0 to length − 1):</p><pre class="ex">if (low &lt; high) {\n  pivotIndex = partition(array, low, high);\n  quickSort(array, low, pivotIndex - 1);\n  quickSort(array, pivotIndex + 1, high);\n}</pre><p>The base case: a part with 0 or 1 element (low ≥ high) is already sorted.</p><p class="watch">The pivot itself (pivotIndex) is in neither recursive call: it is already final.</p>' },
      29: { title: 'The partition Method', blocks: [code(part(QS, '// Used by quicksort'))], explain: '<p>partition with pivot = array[high]:</p><ul><li>i skips the elements at the start that are smaller than the pivot;</li><li>j scans the rest: each element &lt; pivot is swapped to position i, and i++;</li><li>at the end, <code>swap(array, i, high)</code> puts the pivot at i.</li></ul><pre class="ex">cells low..i-1: &lt; pivot,   cell i: pivot,   after i: ≥ pivot</pre><p class="watch">i always marks the first element that is ≥ pivot.</p>' },
      30: { text: false, explain: '<p>Partition of the 15 numbers with pivot 18: i stops at 18 (index 2), then j finds 17, −2, 14, 12, 15 (all &lt; 18) one after another; each is swapped to position i and i moves right. Finally 18 (the pivot) is swapped into position i = 7.</p><pre class="ex">15 5 17 −2 14 12 15 | 18 | 59 67 19 46 34 98 18</pre>' },
      31: { explain: '<p><b>Merge sort</b>:</p><ol><li>divide the array into two (roughly) equal halves;</li><li>keep dividing until each piece has one element;</li><li><b>merge</b> two sorted pieces into one sorted piece;</li><li>keep merging until the whole array is sorted.</li></ol><pre class="ex">[38 27] [43 3] → [27 38] [3 43] → [3 27 38 43]</pre><p>A piece with one element is always sorted: that is the base case.</p>' },
      32: { text: false, blocks: [bul('Dividing the array into roughly two equal parts recursively until each subarray has only one element left.')], explain: '<p>The decomposition of 305 65 7 90 120 110 8: split in halves again and again until every piece has one element.</p><pre class="ex">305 65 7 90 120 110 8\n→ 305 65 7 | 90 120 110 8 → … → single elements</pre><p class="watch">The picture puts the extra element on the right (3 + 4). The code uses mid = (low + high) / 2, so its left half gets the extra one: 305 65 7 90 | 120 110 8. The sorted result is the same.</p>' },
      33: { text: false, blocks: [bul('The subarrays are merged recursively into a sorted array.')], explain: '<p>Merging back up: two sorted pieces are combined by always taking the smaller front element.</p><pre class="ex">[7 65 305] + [8 90 110 120]\n→ 7 8 65 90 110 120 305</pre><p>Each level of merging handles all n elements once.</p>' },
      34: { title: 'Generic Merge Sort Method', blocks: [code(part(MS, '// Sorts the specified', '// Merges two'))], explain: '<p>The recursive mergeSort:</p><pre class="ex">mid = (low + high) / 2;\nmergeSort(low, mid);  mergeSort(mid+1, high);\nmerge(low, mid, high);</pre><p>The two halves are sorted first (recursion), then merged. Unlike quick sort, the real work happens <b>after</b> the recursive calls.</p>' },
      35: { title: 'Merging Two Sorted Subarrays', blocks: [code(part(MS, '// Merges two'))], explain: '<p>merge uses a temporary array:</p><ol><li>while both halves have elements, copy the smaller front one (i or j) into temp;</li><li>copy what is left of either half;</li><li>copy temp back into array[low..high].</li></ol><pre class="ex">[3 27] + [9 43] → 3, 9, 27, 43</pre><p class="watch">Merge sort needs this extra temp array: more memory than quick sort.</p>' },
      36: { blocks: [bul('The selection sort, insertion sort, and bubble sort algorithms are relatively simple but use two nested loops.'), bul('They require about n² comparisons.'), bul('Their time complexity is O(n²).'), bul('The merge sort algorithm divides the array repeatedly in half, resulting in log₂ n number of levels for merging.'), bul('The time to merge n elements at each level is O(n).'), bul('Therefore, the time complexity of merge sort is O(n log n).')],
        explain: '<pre class="ex">selection, insertion, bubble: two nested loops → O(n²)\nmerge sort: log₂ n levels × O(n) per level → O(n log n)</pre><p>For n = 1000: about 1,000,000 steps against about 10,000. The bigger n is, the bigger the difference.</p>' },
      37: { blocks: [bul('For quick sort, the partitioning of n elements is O(n).'), bul('If the partitioning of elements is balanced and divides the subarray elements into nearly two equal halves, then the depth of partitioning is O(log₂ n) levels.'), bul('However, if the partitioning of elements is unbalanced around the pivot, then the number of levels becomes O(n).'), bul('The average time complexity of quick sort is O(n log n).'), bul('However, the worst-case complexity of quick sort is O(n²).')],
        explain: '<p>Quick sort: each level of partitioning is O(n). The number of levels depends on the pivots:</p><pre class="ex">balanced pivots:   log₂ n levels → O(n log n)  (average)\nunbalanced pivots: n levels      → O(n²)       (worst)</pre><p class="watch">With the rightmost pivot, an array that is already sorted is the worst case: every partition leaves one side empty.</p>' },
      38: outline(3, '<p>Last: a sort that does not compare elements at all.</p>'),
      39: { blocks: [bul('All the sorting algorithms we have discussed so far compare the elements to each other. The best was O(n log n).'), bul('Can we sort an array without comparing elements?'), bul('A sort algorithm is typically based on some key value.'), bul('For example, we can sort people based on their ID or last name.', 1), bul('To sort integer IDs, we can group the numbers according to 10 possible digits (0 to 9). The radix is 10.'), bul('To sort by last name, we can group the strings according to 26 possible letters. The radix becomes 26.')],
        explain: '<p>Can we sort <b>without comparing</b>? Yes, by grouping keys by their symbols:</p><pre class="ex">integers: 10 groups (digits 0-9)   radix = 10\nnames:    26 groups (letters A-Z)  radix = 26</pre><p>The <b>radix</b> is the number of possible symbols in one position.</p>' },
      40: { explain: '<p>Radix sort makes one <b>pass</b> per digit position, from right to left:</p><pre class="ex">pass 1: sort by the 1s digit   (pos = 1)\npass 2: sort by the 10s digit  (pos = 10)\npass 3: sort by the 100s digit (pos = 100)</pre><p>After the last pass, the array is sorted.</p><p class="watch">Each pass must keep the order of numbers that have the same digit; otherwise the earlier passes would be lost.</p>' },
      41: { explain: '<p>The example with 12 numbers (at most 3 digits, so 3 passes):</p><pre class="ex">by 1s:   250 420 341 442 312 2 503 145 75 47 629 99\nby 10s:  2 503 312 420 629 341 442 145 47 250 75 99\nby 100s: 2 47 75 99 145 250 312 341 420 442 503 629</pre><p>Look at 47 and 75: both have 100s digit 0, and they stay in the order from pass 2.</p>' },
      42: { blocks: [bul('Use an integer array of 10 counters for the digits 0 to 9'), code('int[] count = new int[10];'), bul('To get the digit of an element at a given position pos:'), code('digit = (element/pos) % 10;   // pos=1,10,100,etc.'), bul('To count the array elements according to their digits:'), code('for (int element : array) {\n  int digit = (element/pos) % 10;\n  count[digit]++;\n}')],
        explain: '<p>The digit at position pos: <code>(element / pos) % 10</code>.</p><pre class="ex">442 with pos = 10: 442 / 10 = 44, 44 % 10 = 4\n442 with pos = 1:  442 % 10 = 2</pre><p>An array of 10 counters counts how many numbers have each digit.</p><p class="watch">For a negative number the digit is negative (−4 % 10 is −4), so count[digit] fails: this method only works for numbers ≥ 0.</p>' },
      43: { blocks: [bul('Consider again the same integer array:'), code('{442,503,629,312,145,250,341,99,2,420,75,47}'), bul('Counting elements based on digits in the 1s position gives:'), code('count = {2, 1, 3, 1, 0, 2, 0, 1, 0, 2}'), bul('Before sorting, we need an index array and a loop to generate the start index of each array element:'), code('int[] index = new int[10];\nfor (int i=0;i<9;i++) index[i+1]=index[i]+count[i];'), bul('For the above example, the index array is computed as:'), code('index = {0, 2, 3, 6, 7, 7, 9, 9, 10, 10}')],
        explain: '<p>count[d] = how many numbers end in d. Then <b>index[d]</b> = where the group of digit d starts in the sorted array:</p><pre class="ex">index[0] = 0\nindex[1] = index[0] + count[0] = 0 + 2 = 2\nindex[2] = 2 + 1 = 3 …</pre><p>Each group starts right after all the groups before it.</p>' },
      44: { blocks: [bul('To sort, we map each array element according to its digit at position pos to a unique index in the sorted array:'), code('int[] sortarray = new int[array.length];\nfor (int element : array) {\n  int digit = (element / pos) % 10;\n  sortarray[index[digit]] = element;\n  index[digit]++;\n}'), bul('The sort array based on digits in the 1s position becomes:'), code('{250,420,341,442,312,2,503,145,75,47,629,99}')],
        explain: '<p>Walk through the array in order; put each element at <code>index[digit]</code> in sortarray, then move that index one place on:</p><pre class="ex">442: digit 2 → sortarray[3], index[2] = 4\n312: digit 2 → sortarray[4]</pre><p>Elements with the same digit keep their original order (442 before 312, and 2 after them).</p>' },
      45: { title: 'Radix Sort Method', blocks: [code(RX)], explain: '<p>The full method repeats count → index → map for pos = 1, 10, 100, …, maxdigits times, and copies sortarray back with <code>System.arraycopy</code> after each pass.</p><pre class="ex">radixSort(array, 3)   // numbers up to 999</pre><p class="watch">maxdigits must be the number of digits of the <b>largest</b> number; if it is too small, the array is not fully sorted.</p>' },
      46: { explain: '<ul><li>Radix sort is <b>non-comparative</b>: it never compares two elements.</li><li>It is not generic: it needs integer (or letter) keys.</li><li>Time: d passes of n steps: O(d × n). With d fixed and n large: O(n).</li></ul><pre class="ex">n = 1,000,000, d = 6: about 6,000,000 steps\nmerge sort: about 20,000,000 comparisons</pre><p class="watch">For small n it is slower than it looks: the count and index arrays cost time in every pass.</p>' }
    }
  });
})();
