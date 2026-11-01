/* Data Structures · Unit 2 Analysis of Algorithms (29 slides): time and space efficiency, the dishwashing example,
   growth functions, the dominant term and Big-O, comparing growth functions and faster CPUs, analyzing loops,
   nested loops, method calls and a recursive method (Tower of Hanoi) */
(function () {
  /* the line (1-based) of src that contains frag; nth = which match (1 = first) */
  function L(src, frag, nth) { var ls = src.split('\n'), c = 0; for (var i = 0; i < ls.length; i++) if (ls[i].indexOf(frag) >= 0 && ++c === (nth || 1)) return i + 1; throw new Error('no line ' + frag); }
  function fmt(x) { return Math.round(x).toLocaleString('en-US'); }
  function log2(x) { return Math.log(x) / Math.LN2; }
  var SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻' };
  function sup(n) { return String(n).split('').map(function (c) { return SUP[c]; }).join(''); }
  /* a big number as "≈ 3 × 10¹⁹" from its log10 */
  function big(lg) { if (lg < 6) return fmt(Math.pow(10, lg)); var e = Math.floor(lg), m = Math.pow(10, lg - e); return '≈ ' + (Math.round(m * 10) / 10) + ' × 10' + sup(e); }

  /* ---------- 1. washing dishes (slides 4-6) ---------- */
  var DC = '// careful: wash and dry each dish once\nfor i = 1 to n:\n    wash dish i               // 30 seconds\n    dry dish i                // 30 seconds\n\n// careless: water splashes on the dishes already dried\nfor i = 1 to n:\n    wash dish i               // 30 seconds\n    dry dishes 1, 2, ..., i   // i × 30 seconds';
  var dishes = {
    id: 'dishes', slides: [4, 6], title: 'Careful or careless: how the time grows', code: DC, lang: 'text',
    inputs: [{ id: 'n', label: 'dishes n', value: 5, min: 1, max: 8 }],
    presets: [{ label: '3 dishes', values: { n: 3 } }, { label: '5 dishes', values: { n: 5 } }, { label: '8 dishes', values: { n: 8 } }, { label: '1 dish', values: { n: 1 } }],
    steps: function (v) {
      var n = Math.trunc(v.n), st = [], t = 0;
      st.push({ slide: 4, line: '1-4', ph: 'careful', i: n, t: n * 60, cap: 'Careful way: each dish is washed (30 s) and dried (30 s) once. ' + n + ' dish' + (n > 1 ? 'es' : '') + ' need ' + n + ' × 60 = <b>' + n * 60 + ' seconds</b>.' });
      for (var i = 1; i <= n; i++) {
        t += 30 + 30 * i;
        st.push({ slide: i < 3 ? 4 : 5, line: '7-9', ph: 'careless', i: i, t: t, cap: 'Careless way, dish ' + i + ': wash it (30 s), then dry <b>' + i + ' dish' + (i > 1 ? 'es' : '') + '</b> again (' + i + ' × 30 = ' + 30 * i + ' s). Time so far: <b>' + t + ' s</b>.' });
      }
      st.push({ slide: 5, line: '7-9', ph: 'formula', i: n, t: t, cap: 'Total: wash 30n + dry 30 × (1 + 2 + … + n) = 30n + 30 · n(n + 1)/2 = <b>15n² + 45n</b>. For n = ' + n + ': 15·' + n * n + ' + 45·' + n + ' = ' + (15 * n * n + 45 * n) + ' s.' });
      st.push({ slide: 6, line: '2,7', ph: 'size', i: n, t: t, cap: 'The <b>problem size</b> here is n, the number of dishes. Both loops run n times; the careless one also dries more and more dishes each time.' });
      return st;
    },
    draw: function (k, s, v) {
      var n = Math.trunc(v.n), items = [], cw = Math.min(62, Math.floor(500 / n)), x0 = 280 - n * cw / 2, max = 15 * n * n + 45 * n;
      for (var j = 1; j <= n; j++) {
        var shown = s.ph !== 'careless' || j <= s.i, wash = s.ph === 'careless' && j === s.i, dried = s.ph === 'careful' ? 1 : s.ph === 'careless' ? Math.max(0, s.i - j + 1) : n - j + 1;
        items.push(B('d' + j, x0 + (j - 1) * cw + 4, 40, cw - 8, cw - 8 > 46 ? 46 : cw - 8, { shape: 'oval', title: String(j), mono: true, size: 14, tone: wash ? 'accent' : s.ph === 'careless' && j < s.i ? 'teal' : shown ? 'blue' : 'muted', hi: wash, o: shown ? 1 : 0.25 }));
        if (shown && s.ph !== 'size') items.push(T('dt' + j, x0 + (j - 1) * cw + cw / 2, 110, 'dried ' + dried + '×', { anchor: 'middle', size: cw < 60 ? 10 : 12, tone: dried > 1 ? 'red' : 'muted' }));
      }
      var bw = 400;
      items.push(T('lc', 20, 172, 'careful', { size: 13, bold: true }));
      items.push(B('bc', 100, 156, Math.max(4, bw * n * 60 / max), 24, { tone: 'teal', fill: 'solid', r: 3 }));
      items.push(T('vc', 104 + Math.max(4, bw * n * 60 / max), 173, n * 60 + ' s', { size: 12, mono: true }));
      if (s.ph !== 'careful') {
        items.push(T('ll', 20, 222, 'careless', { size: 13, bold: true }));
        items.push(B('bl', 100, 206, Math.max(4, bw * s.t / max), 24, { tone: 'red', fill: 'solid', r: 3 }));
        items.push(T('vl', Math.min(104 + bw * s.t / max, 500), 223, s.t + ' s', { size: 12, mono: true }));
      }
      if (s.ph === 'formula') items.push(T('f', 280, 290, 't(n) = 30n + 30 · n(n + 1)/2 = 15n² + 45n', { anchor: 'middle', mono: true, size: 15, bold: true, tone: 'accent' }));
      if (s.ph === 'size') items.push(T('f', 280, 290, 'problem size: n = ' + n + ' dishes', { anchor: 'middle', size: 16, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 2. the growth function and its dominant term (slides 7-10) ---------- */
  var growth = {
    id: 'growth', slides: [7, 10], title: 'Which term matters when n is big?',
    inputs: [{ id: 'n', label: 'n', value: 10, min: 1, max: 10000000 }],
    presets: [{ label: 'n = 1', values: { n: 1 } }, { label: 'n = 10', values: { n: 10 } }, { label: 'n = 1,000', values: { n: 1000 } }, { label: 'n = 10,000,000', values: { n: 10000000 } }],
    steps: [
      { slide: 7, ph: 'fn', cap: 'The <b>growth function</b> t(n) gives the execution time for a problem of size n. The careless dishwasher: t(n) = 15n² + 45n seconds.' },
      { slide: 8, ph: 'share', cap: 'Compare the two terms for your n. The bar shows how much of t(n) comes from each term.' },
      { slide: 8, ph: 'table', cap: 'The slide’s table as shares: 15n² is 25% of the time at n = 1, but almost 100% when n is large. 15n² is the <b>dominant term</b>.' },
      { slide: 9, ph: 'dom', cap: '<b>Asymptotic complexity</b> keeps only the dominant term, the one that grows fastest. For large n, t(n) ≈ 15n²: the 45n part hardly changes the answer.' },
      { slide: 10, ph: 'bigo', cap: 'For large n the coefficient (15) matters less too. Drop it: the algorithm is of <b>order n²</b>, written <b>O(n²)</b>. This is Big-O notation.' }
    ],
    draw: function (k, s, v) {
      var n = Math.trunc(v.n), a = 15 * n * n, b = 45 * n, t = a + b, items = [];
      items.push(T('fn', 280, 40, 't(n) = 15n² + 45n', { anchor: 'middle', mono: true, size: 22, bold: true, tone: 'accent' }));
      if (s.ph === 'fn') {
        items.push(T('nv', 280, 110, 'n = ' + fmt(n), { anchor: 'middle', mono: true, size: 18 }));
        items.push(T('tv', 280, 160, 't(' + fmt(n) + ') = ' + fmt(a) + ' + ' + fmt(b), { anchor: 'middle', mono: true, size: 15 }));
        items.push(T('tt', 280, 200, '= ' + fmt(t) + ' seconds', { anchor: 'middle', mono: true, size: 18, bold: true, tone: 'teal' }));
        return items;
      }
      if (s.ph === 'share') {
        var wa = Math.max(2, 480 * a / t);
        items.push(T('nv', 280, 90, 'n = ' + fmt(n), { anchor: 'middle', mono: true, size: 16 }));
        items.push(B('ba', 40, 130, wa, 48, { tone: 'accent', fill: 'solid', r: 3 }));
        items.push(B('bb', 40 + wa, 130, Math.max(2, 480 - wa), 48, { tone: 'blue', fill: 'solid', r: 3 }));
        items.push(T('la', 40, 210, '15n² = ' + fmt(a) + '  (' + (100 * a / t).toFixed(1) + '%)', { mono: true, size: 14, bold: true, tone: 'accent' }));
        items.push(T('lb', 40, 240, '45n = ' + fmt(b) + '  (' + (100 * b / t).toFixed(1) + '%)', { mono: true, size: 14, bold: true, tone: 'blue' }));
        return items;
      }
      if (s.ph === 'table') {
        [1, 2, 10, 100, 1000, 10000000].forEach(function (m, i) {
          var p = 15 * m * m / (15 * m * m + 45 * m), y = 80 + i * 40;
          items.push(T('tn' + i, 130, y + 18, 'n = ' + fmt(m), { anchor: 'end', mono: true, size: 13 }));
          items.push(B('tb' + i, 145, y, Math.max(2, 300 * p), 26, { tone: 'accent', fill: 'solid', r: 3 }));
          items.push(B('tc' + i, 145 + Math.max(2, 300 * p), y, Math.max(2, 300 * (1 - p)), 26, { tone: 'blue', fill: 'solid', r: 3 }));
          items.push(T('tp' + i, 455, y + 18, (100 * p).toFixed(p > 0.999 ? 4 : 1) + '%', { mono: true, size: 13, bold: true, tone: 'accent' }));
        });
        return items;
      }
      if (s.ph === 'dom') {
        items.push(B('da', 90, 110, 170, 56, { title: '15n²', mono: true, size: 22, tone: 'accent', fill: 'solid', hi: true, tag: 'dominant term' }));
        items.push(B('db', 300, 110, 170, 56, { title: '45n', mono: true, size: 22, tone: 'muted', dash: true, o: 0.5, tag: 'grows slower' }));
        items.push(T('ap', 280, 240, 'large n:  t(n) ≈ 15n²', { anchor: 'middle', mono: true, size: 18, bold: true, tone: 'teal' }));
        return items;
      }
      ['15n² + 45n', '15n²', 'n²', 'O(n²)'].forEach(function (x, i) {
        items.push(B('st' + i, 20 + i * 135, 120, 115, 50, { title: x, mono: true, size: i === 3 ? 20 : 15, tone: i === 3 ? 'accent' : 'blue', fill: i === 3 ? 'solid' : 'soft', hi: i === 3 }));
        if (i) items.push(A('sa' + i, 20 + i * 135 - 20, 145, 20 + i * 135, 145, { tone: 'muted' }));
      });
      items.push(T('s1', 210, 200, 'drop 45n', { anchor: 'middle', size: 12, tone: 'muted' }));
      items.push(T('s2', 345, 200, 'drop 15', { anchor: 'middle', size: 12, tone: 'muted' }));
      items.push(T('s3', 280, 270, 'order n²: quadratic', { anchor: 'middle', size: 16, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 3. Big-O categories and the class exercise (slides 11-12) ---------- */
  var KIND = ['c', 'log', 'n', 'nlog', 'n2', 'n3', 'n4', 'n5', '2n'];
  var KO = { c: 'O(1)', log: 'O(log n)', n: 'O(n)', nlog: 'O(n log n)', n2: 'O(n²)', n3: 'O(n³)', n4: 'O(n⁴)', n5: 'O(n⁵)', '2n': 'O(2ⁿ)' };
  var KC = { c: 'Constant', log: 'Logarithmic', n: 'Linear', nlog: 'n log n', n2: 'Quadratic', n3: 'Cubic', n4: 'n⁴', n5: 'n⁵', '2n': 'Exponential' };
  /* log10 of the term at n = 1,000,000 */
  function lg(kind, c) {
    var n = 1e6, g = { c: 0, log: Math.log10(log2(n)), n: 6, nlog: 6 + Math.log10(log2(n)), n2: 12, n3: 18, n4: 24, n5: 30, '2n': n * Math.log10(2) }[kind];
    return Math.log10(Math.abs(c)) + g;
  }
  var FUNS = [
    { s: 't(n) = 17', sl: 11, t: [['17', 'c', 17]] },
    { s: 't(n) = 3 log n', sl: 11, t: [['3 log n', 'log', 3]] },
    { s: 't(n) = 20n + 4', sl: 11, t: [['20n', 'n', 20], ['4', 'c', 4]] },
    { s: 't(n) = 12 n log n + 100n', sl: 11, t: [['12 n log n', 'nlog', 12], ['100n', 'n', 100]] },
    { s: 't(n) = 3n² + 5n – 2', sl: 11, t: [['3n²', 'n2', 3], ['5n', 'n', 5], ['– 2', 'c', 2]] },
    { s: 't(n) = 8n³ + 3n² + 5', sl: 11, t: [['8n³', 'n3', 8], ['3n²', 'n2', 3], ['5', 'c', 5]] },
    { s: 't(n) = 2ⁿ + 18n³ + 3n²', sl: 11, t: [['2ⁿ', '2n', 1], ['18n³', 'n3', 18], ['3n²', 'n2', 3]] },
    { s: 'a) t(n) = 30n³ + 200n² + 1000n + 10000', sl: 12, t: [['30n³', 'n3', 30], ['200n²', 'n2', 200], ['1000n', 'n', 1000], ['10000', 'c', 10000]] },
    { s: 'b) t(n) = 4n⁴ + 10', sl: 12, t: [['4n⁴', 'n4', 4], ['10', 'c', 10]] },
    { s: 'c) t(n) = 2n + n³ + n⁵', sl: 12, t: [['2n', 'n', 2], ['n³', 'n3', 1], ['n⁵', 'n5', 1]] },
    { s: 'd) t(n) = 1000', sl: 12, t: [['1000', 'c', 1000]] },
    { s: 'e) t(n) = n log n + 10n', sl: 12, t: [['n log n', 'nlog', 1], ['10n', 'n', 10]] },
    { s: 'f) t(n) = log n³ + 100', sl: 12, t: [['log n³ = 3 log n', 'log', 3], ['100', 'c', 100]] }
  ];
  var bigo = {
    id: 'bigo', slides: [11, 12], title: 'Find the dominant term, then drop its coefficient',
    inputs: [{ id: 'f', label: 'function #', value: 7, min: 1, max: 13 }],
    presets: [{ label: '2ⁿ + 18n³ + 3n²', values: { f: 7 } }, { label: '12 n log n + 100n', values: { f: 4 } }, { label: 'a', values: { f: 8 } }, { label: 'b', values: { f: 9 } }, { label: 'c', values: { f: 10 } }, { label: 'd', values: { f: 11 } }, { label: 'e', values: { f: 12 } }, { label: 'f', values: { f: 13 } }],
    steps: function (v) {
      var F = FUNS[Math.trunc(v.f) - 1], dom = F.t.reduce(function (m, t) { return KIND.indexOf(t[1]) > KIND.indexOf(m[1]) ? t : m; }, F.t[0]);
      return [
        { slide: F.sl, ph: 'terms', F: F, d: dom, cap: F.s + (F.t.length > 1 ? ' has ' + F.t.length + ' terms. Which one grows fastest as n increases?' : ' has one term only.') },
        { slide: F.sl, ph: 'vals', F: F, d: dom, cap: 'Try a big n: n = 1,000,000. The value of each term is under it.' + (F.t.some(function (t) { return t[1] === 'c'; }) && F.t.length > 1 ? ' A constant never grows at all.' : '') },
        { slide: F.sl, ph: 'dom', F: F, d: dom, cap: 'The dominant term is <b>' + dom[0] + '</b>. The other terms become less and less important as n grows.' },
        { slide: F.sl, ph: 'o', F: F, d: dom, cap: 'Drop its coefficient: the order is <b>' + KO[dom[1]] + '</b> (' + KC[dom[1]] + ').' + (F.s.indexOf('log n³') >= 0 ? ' Note: log n³ = 3 log n, so it is a logarithm with coefficient 3.' : '') }
      ];
    },
    draw: function (k, s) {
      var items = [], F = s.F, ki = KIND.indexOf(s.d[1]);
      items.push(T('fs', 14, 30, F.s, { mono: true, size: F.s.length > 34 ? 13 : 15, bold: true }));
      F.t.forEach(function (t, i) {
        var isD = t === s.d, late = s.ph === 'dom' || s.ph === 'o';
        items.push(B('t' + i, 14, 60 + i * 62, 330, 44, { title: t[0], mono: true, size: 16, tone: late ? (isD ? 'accent' : 'muted') : 'blue', fill: late && isD ? 'solid' : 'soft', hi: late && isD, dash: late && !isD, o: late && !isD ? 0.5 : 1, tag: s.ph !== 'terms' ? 'n = 10⁶: ' + big(lg(t[1], t[2])) : undefined }));
      });
      KIND.forEach(function (kd, i) {
        var on = s.ph === 'o' && i === ki;
        items.push(B('k' + kd, 400, 300 - i * 34, 146, 28, { title: KO[kd], mono: true, size: 13, tone: on ? 'accent' : 'muted', fill: on ? 'solid' : 'soft', hi: on }));
      });
      items.push(T('kl', 473, 16, 'slower ↓  faster ↑', { anchor: 'middle', size: 11, tone: 'muted' }));
      if (s.ph === 'o') items.push(T('res', 180, 316, KO[s.d[1]] + ' · ' + KC[s.d[1]], { anchor: 'middle', mono: true, size: 18, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 4. comparing growth functions, and faster CPUs (slides 13-17) ---------- */
  var CURVES = [
    { id: 'lg', f: function (n) { return log2(n); }, lb: 'log₂ n', tone: 'muted' },
    { id: 'n1', f: function (n) { return n; }, lb: 'n', tone: 'ink' },
    { id: 'nl', f: function (n) { return n * log2(n); }, lb: 'n log₂ n', tone: 'blue' },
    { id: 'n2', f: function (n) { return n * n; }, lb: 'n²', tone: 'teal' },
    { id: 'e2', f: function (n) { return Math.pow(2, n); }, lb: '2ⁿ', tone: 'red', dash: true },
    { id: 'n3', f: function (n) { return n * n * n; }, lb: 'n³', tone: 'accent' }
  ];
  var X0 = 66, X1 = 540, Y0 = 296, Y1 = 26;
  function curve(c, nmax, ymax) {
    var pts = [], last = null;
    for (var i = 0; i <= 80; i++) {
      var n = 1 + (nmax - 1) * i / 80, y = c.f(n), px = X0 + (X1 - X0) * (n - 1) / (nmax - 1);
      if (y > ymax) {
        if (last) { var n0 = last[2], y0 = c.f(n0), lo = n0, hi = n; for (var r = 0; r < 30; r++) { var m = (lo + hi) / 2; if (c.f(m) > ymax) hi = m; else lo = m; } pts.push([X0 + (X1 - X0) * (lo - 1) / (nmax - 1), Y1]); }
        break;
      }
      last = [px, Y0 - (Y0 - Y1) * y / ymax, n]; pts.push(last);
    }
    return pts;
  }
  var SCALES = [{ n: 15, y: 100 }, { n: 30, y: 5000 }, { n: 60, y: 500000 }];
  var compare = {
    id: 'compare', slides: [13, 17], title: 'Growth functions side by side',
    inputs: [{ id: 's', label: 'new CPU is … times faster', value: 10, min: 2, max: 1000 }],
    presets: [{ label: '10× (slide 17)', values: { s: 10 } }, { label: '25× (slide 16)', values: { s: 25 } }, { label: '1000×', values: { s: 1000 } }],
    steps: function (v) {
      var sp = v.s, st = [], caps = [
        'log₂ n grows very slowly: at n = 15 it is less than 4.',
        't(n) = n: a straight line, it grows at a steady rate.',
        'n log₂ n grows a bit faster than n.',
        'n² bends upward: at n = 15 it is already 225, off the top of the chart.',
        '2ⁿ (dashed). For small n it is below n³: at n = 9, 2⁹ = 512 but 9³ = 729.',
        'n³ is the fastest one in this small range… but only for now.'];
      CURVES.forEach(function (c, i) { st.push({ slide: 13, sc: 0, show: i + 1, cap: caps[i] }); });
      st.push({ slide: 14, sc: 1, show: 6, cap: 'Larger n (up to 30, time up to 5000): at n = 10, 2ⁿ passes n³ (1024 > 1000) and then leaves it far behind. n² and n log n now look small.' });
      st.push({ slide: 15, sc: 2, show: 6, cap: 'Up to n = 60 (time up to 500,000): 2ⁿ goes off the chart before n = 20. Next to it, n³ looks slow and n² looks flat.' });
      st.push({ slide: 16, ph: 'sq', cap: 'An O(n²) algorithm on a CPU ' + sp + ' times faster: in the same time it can do ' + sp + ' × N² steps, and (k·N)² = ' + sp + ' × N² gives k = √' + sp + ' = <b>' + (Math.round(Math.sqrt(sp) * 100) / 100) + '</b>. With 25× faster, the size grows only 5×.' });
      st.push({ slide: 17, ph: 'cpu', cap: 'A CPU ' + sp + ' times faster: O(n) grows ' + sp + '×, O(n²) only ' + (Math.round(Math.sqrt(sp) * 100) / 100) + '×, O(n³) ' + (Math.round(Math.cbrt(sp) * 100) / 100) + '×, and O(2ⁿ) just <b>adds ' + (Math.round(log2(sp) * 100) / 100) + '</b>. A faster CPU cannot save a bad algorithm.' });
      return st;
    },
    draw: function (k, s, v) {
      var items = [], sp = v.s;
      if (s.ph === 'sq') {
        var r = Math.sqrt(sp), side = Math.min(250, 46 * r), a = side / r;
        items.push(B('big', 280, 300 - side, side, side, { tone: 'teal', r: 2, tag: '(' + (Math.round(r * 100) / 100) + 'N)² = ' + sp + ' N²' }));
        items.push(B('old', 280, 300 - a, a, a, { tone: 'accent', fill: 'solid', r: 2 }));
        items.push(T('ol', 270, 296 - a / 2, 'old: N²', { anchor: 'end', size: 13, bold: true, tone: 'accent' }));
        items.push(T('t1', 20, 40, 'O(n²), ' + sp + '× faster CPU', { size: 15, bold: true }));
        items.push(T('t2', 20, 70, 'old size N  →  new size ' + (Math.round(r * 100) / 100) + ' × N', { size: 14, mono: true, tone: 'teal' }));
        return items;
      }
      if (s.ph === 'cpu') {
        var N = 20, rows = [['A  O(n)', sp * N, sp + ' × N'], ['B  O(n²)', Math.sqrt(sp) * N, (Math.round(Math.sqrt(sp) * 100) / 100) + ' × N'], ['C  O(n³)', Math.cbrt(sp) * N, (Math.round(Math.cbrt(sp) * 100) / 100) + ' × N'], ['D  O(2ⁿ)', N + log2(sp), 'N + ' + (Math.round(log2(sp) * 100) / 100)]];
        var mx = Math.max.apply(null, rows.map(function (q) { return q[1]; }));
        items.push(T('h', 20, 30, 'max problem size, old N = 20 → with a ' + sp + '× faster CPU', { size: 13, bold: true }));
        rows.forEach(function (q, i) {
          var y = 60 + i * 66;
          items.push(T('rn' + i, 20, y + 30, q[0], { mono: true, size: 13, bold: true }));
          items.push(B('ro' + i, 120, y + 8, 300 * N / mx, 18, { tone: 'muted', fill: 'solid', r: 2 }));
          items.push(B('rb' + i, 120, y + 30, Math.max(2, 300 * q[1] / mx), 18, { tone: i === 3 ? 'red' : 'teal', fill: 'solid', r: 2 }));
          items.push(T('rv' + i, 126 + Math.max(2, 300 * q[1] / mx), y + 44, q[2], { mono: true, size: 12, bold: true, tone: i === 3 ? 'red' : 'teal' }));
        });
        items.push(T('lg', 120, 330, 'grey: old size N    color: new size', { size: 11, tone: 'muted' }));
        return items;
      }
      var sc = SCALES[s.sc];
      items.push(A('ax', X0, Y0, X1 + 6, Y0, { tone: 'muted' }));
      items.push(A('ay', X0, Y0, X0, Y1 - 10, { tone: 'muted' }));
      items.push(T('xl', X1, Y0 + 32, 'input size n', { anchor: 'end', size: 11, tone: 'muted' }));
      items.push(T('yl', X0 - 4, Y1 - 12, 'time', { anchor: 'end', size: 11, tone: 'muted' }));
      [0, 0.5, 1].forEach(function (f, i) { items.push(T('yt' + i, X0 - 6, Y0 - (Y0 - Y1) * f + 4, fmt(sc.y * f), { anchor: 'end', size: 10, mono: true, tone: 'muted' })); });
      [1, 0.25, 0.5, 0.75, 1].forEach(function (f, i) { if (!i) return; var n = Math.round(1 + (sc.n - 1) * f); items.push(T('xt' + i, X0 + (X1 - X0) * (n - 1) / (sc.n - 1), Y0 + 16, String(n), { anchor: 'middle', size: 10, mono: true, tone: 'muted' })); });
      items.push(T('x0', X0, Y0 + 16, '1', { anchor: 'middle', size: 10, mono: true, tone: 'muted' }));
      var labels = [];
      CURVES.slice(0, s.show).forEach(function (c, i) {
        var p = curve(c, sc.n, sc.y), a = p[0], z = p[p.length - 1], newest = i === s.show - 1 && s.sc === 0;
        if (p.length < 2) return;
        items.push(A('c' + c.id, a[0], a[1], z[0], z[1], { via: p.slice(1, -1).map(function (q) { return [q[0], q[1]]; }), head: false, tone: c.tone, dash: c.dash, hi: newest }));
        var top = z[1] <= Y1 + 1;
        labels.push({ id: c.id, lb: c.lb, tone: c.tone, top: top, x: top ? z[0] + 4 : Math.min(z[0] - 2, 536), y: top ? Y1 + 14 : Math.min(z[1] - 6, Y0 - 6) });
      });
      /* labels at the right end of flat curves would sit on each other: push them up until they are 14 px apart */
      labels.sort(function (p, q) { return q.y - p.y; });
      labels.forEach(function (lb, i) {
        for (var j = 0; j < i; j++) { var o = labels[j]; if (Math.abs(o.x - lb.x) < 80 && lb.y > o.y - 14) lb.y = o.y - 14; }
        items.push(T('cl' + lb.id, lb.x, lb.y, lb.lb, { size: 12, bold: true, tone: lb.tone, anchor: lb.top ? 'start' : 'end' }));
      });
      return items;
    }
  };

  /* ---------- 5. analyzing loops (slides 19-22) ---------- */
  var LC = '// slide 20: a loop that runs n times\nfor (int i = 0; i < n; i++) {\n  // Sequence of statements that execute in O(1)\n}\n\n// slide 21: count doubles each time (it starts at 1)\nint count = 1;\nwhile (count < n) {\n  count = count * 2;\n  // Sequence of statements that execute in O(1)\n}\n\n// slide 22: nested loops\nfor (int i=0; i < n; i++)\n  for (int j=0; j < n; j++) {\n    // Sequence of statements that execute in O(1)\n  }';
  var loops = {
    id: 'loops', slides: [19, 22], title: 'Count how many times the body runs', code: LC,
    inputs: [{ id: 'n', label: 'n', value: 8, min: 1, max: 12 }],
    presets: [{ label: 'n = 8', values: { n: 8 } }, { label: 'n = 12', values: { n: 12 } }, { label: 'n = 5', values: { n: 5 } }, { label: 'n = 1', values: { n: 1 } }],
    steps: function (v) {
      var n = Math.trunc(v.n), st = [], c = 0;
      st.push({ slide: 19, line: L(LC, 'for (int i = 0; i < n'), ph: 'lin', k: 0, cap: 'To compare algorithms, we do not need to run them: we <b>count</b> how many times the loop body runs, as a function of n.' });
      for (var i = 0; i < n; i++) st.push({ slide: 20, line: L(LC, 'execute in O(1)'), ph: 'lin', k: i + 1, cap: 'i = ' + i + ': the body runs (time O(1)). Body runs so far: <b>' + (i + 1) + '</b>.' });
      st.push({ slide: 20, line: L(LC, 'for (int i = 0; i < n'), ph: 'lin', k: n, done: true, cap: 'The body ran <b>n = ' + n + '</b> times. O(1) × n = <b>O(n)</b>.' });
      var cnt = 1, jumps = [1];
      st.push({ slide: 21, line: L(LC, 'int count = 1'), ph: 'dbl', j: jumps.slice(), c: 0, cap: 'Now count starts at 1 and <b>doubles</b> each time. The loop stops when count reaches n.' });
      while (cnt < n) { cnt *= 2; c++; jumps.push(cnt); st.push({ slide: 21, line: L(LC, 'count = count * 2'), ph: 'dbl', j: jumps.slice(), c: c, cap: 'count = ' + cnt + '. Body runs so far: <b>' + c + '</b>.' }); }
      st.push({ slide: 21, line: L(LC, 'while (count < n)'), ph: 'dbl', j: jumps.slice(), c: c, done: true, cap: (n === 1 ? 'count = 1 is not less than n = 1: the body never runs.' : 'count = ' + cnt + ' is not less than ' + n + ': stop. The body ran ' + c + ' times') + ' ≈ log₂ ' + n + ' = ' + log2(n).toFixed(2) + '. Each step halves what is left: <b>O(log n)</b>.' });
      for (i = 0; i < n; i++) st.push({ slide: 22, line: L(LC, 'for (int j=0'), ph: 'nest', r: i + 1, cap: 'i = ' + i + ': the inner loop runs n = ' + n + ' times. Body runs so far: ' + (i + 1) + ' × ' + n + ' = <b>' + (i + 1) * n + '</b>.' });
      st.push({ slide: 22, line: L(LC, 'for (int i=0; i < n'), ph: 'nest', r: n, done: true, cap: 'Outer O(n) × inner O(n): the body ran n × n = ' + n * n + ' times. Nested loops: <b>O(n²)</b>.' });
      st.push({ slide: 22, line: L(LC, 'for (int i=0; i < n') + '-' + LC.split('\n').length, ph: 'sum', cap: 'The three loops for n = ' + n + ': ' + n + ', ' + c + ' and ' + n * n + ' runs. Try n = 12: the gap gets bigger quickly.' });
      return st;
    },
    draw: function (k, s, v) {
      var n = Math.trunc(v.n), items = [], cw;
      if (s.ph === 'lin') {
        cw = Math.min(40, Math.floor(480 / n));
        for (var i = 0; i < n; i++) items.push(B('l' + i, 280 - n * cw / 2 + i * cw, 120, cw - 4, 40, { title: String(i), mono: true, size: 12, tone: i < s.k ? 'accent' : 'muted', fill: i === s.k - 1 && !s.done ? 'solid' : 'soft', hi: i === s.k - 1 && !s.done }));
        items.push(T('lt', 280, 60, 'for i = 0 … n − 1', { anchor: 'middle', mono: true, size: 15, bold: true }));
        items.push(T('lc', 280, 230, 'body runs: ' + s.k, { anchor: 'middle', mono: true, size: 20, bold: true, tone: 'accent' }));
        if (s.done) items.push(T('lo', 280, 280, 'O(n)', { anchor: 'middle', mono: true, size: 22, bold: true, tone: 'teal' }));
        return items;
      }
      if (s.ph === 'dbl') {
        var x0 = 50, w = 460, px = function (q) { return x0 + w * (q - 1) / Math.max(1, 2 * n - 1); };
        items.push(A('nl', x0, 170, x0 + w + 4, 170, { tone: 'muted', head: false }));
        items.push(T('nx1', x0, 194, '1', { anchor: 'middle', size: 11, mono: true, tone: 'muted' }));
        items.push(B('nn', px(n) - 2, 150, 4, 40, { tone: 'red', fill: 'solid', r: 1 }));
        items.push(T('nnl', px(n), 212, 'n = ' + n, { anchor: 'middle', size: 12, mono: true, bold: true, tone: 'red' }));
        s.j.forEach(function (q, i) {
          items.push(B('jc' + i, px(q) - 15, 156, 30, 28, { title: String(q), mono: true, size: 11, tone: i === s.j.length - 1 ? 'accent' : 'blue', fill: i === s.j.length - 1 ? 'solid' : 'soft', r: 14, z: 2 }));
          if (i) items.push(A('ja' + i, px(s.j[i - 1]), 150, px(q), 150, { bend: -Math.min(60, 10 + (px(q) - px(s.j[i - 1])) / 3), tone: 'accent' }));
        });
        items.push(T('dt', 280, 50, 'count = 1, 2, 4, 8, …', { anchor: 'middle', mono: true, size: 15, bold: true }));
        items.push(T('dc', 280, 260, 'body runs: ' + s.c, { anchor: 'middle', mono: true, size: 20, bold: true, tone: 'accent' }));
        if (s.done) items.push(T('do', 280, 305, 'O(log n)', { anchor: 'middle', mono: true, size: 22, bold: true, tone: 'teal' }));
        return items;
      }
      if (s.ph === 'nest') {
        cw = Math.min(22, Math.floor(250 / n));
        var gx = 150 - n * cw / 2, gy = 40;
        for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) items.push(B('g' + r + '_' + c, gx + c * cw, gy + r * cw, cw - 2, cw - 2, { tone: r < s.r ? (r === s.r - 1 && !s.done ? 'accent' : 'teal') : 'muted', fill: r < s.r ? 'solid' : 'soft', r: 2 }));
        items.push(T('gi', gx - 6, gy + 12, 'i', { anchor: 'end', mono: true, size: 12, tone: 'muted' }));
        items.push(T('gj', gx, gy - 8, 'j →', { mono: true, size: 12, tone: 'muted' }));
        items.push(T('nc', 420, 150, 'body runs:', { anchor: 'middle', size: 15 }));
        items.push(T('nv', 420, 185, s.r + ' × ' + n + ' = ' + s.r * n, { anchor: 'middle', mono: true, size: 20, bold: true, tone: 'accent' }));
        if (s.done) items.push(T('no', 420, 240, 'O(n²)', { anchor: 'middle', mono: true, size: 22, bold: true, tone: 'teal' }));
        return items;
      }
      var lc = 0, q = 1; while (q < n) { q *= 2; lc++; }
      var rows = [['O(n)', n, 'accent'], ['O(log n)', lc, 'blue'], ['O(n²)', n * n, 'red']], mx = n * n;
      rows.forEach(function (q, i) {
        items.push(T('sn' + i, 110, 92 + i * 80, q[0], { anchor: 'end', mono: true, size: 14, bold: true }));
        items.push(B('sb' + i, 120, 70 + i * 80, Math.max(3, 380 * q[1] / mx), 34, { tone: q[2], fill: 'solid', r: 3 }));
        items.push(T('sv' + i, 126 + Math.max(3, 380 * q[1] / mx), 93 + i * 80, String(q[1]), { mono: true, size: 14, bold: true }));
      });
      items.push(T('sh', 280, 36, 'body runs for n = ' + n, { anchor: 'middle', size: 15, bold: true }));
      return items;
    }
  };

  /* ---------- 6. method calls inside loops, and two exercises (slides 23-27) ---------- */
  var MC = 'for (int count=1; count <= n; count++) {\n  printsum(count); // Is it constant time?\n}\n\n// Print the sum of numbers from 1 to count\npublic void printsum(int count) {\n  int sum = 0;\n  for (int i=1; i <= count; i++) sum += i;\n  System.out.println("sum = " + sum);\n}\n\n// slide 25: the improved printsum\npublic void printsum(int count) {\n  int sum = count*(count+1)/2;\n  System.out.println("sum = " + sum);\n}\n\n// slide 26\nfor (int i=0; i<n; i++)\n  for (int j=0; j<n; j += 2)\n    System.out.println(i + ", " + j);\n\n// slide 27\nfor (int i=0; i<n; i++)\n  for (int j=1; j<n; j *= 2)\n    System.out.println(i + ", " + j);';
  var methods = {
    id: 'methods', slides: [23, 27], title: 'Look inside the method before you count', code: MC,
    inputs: [{ id: 'n', label: 'n', value: 6, min: 1, max: 10 }],
    presets: [{ label: 'n = 4', values: { n: 4 } }, { label: 'n = 6', values: { n: 6 } }, { label: 'n = 10', values: { n: 10 } }, { label: 'n = 1', values: { n: 1 } }],
    steps: function (v) {
      var n = Math.trunc(v.n), st = [], tot = 0, sums = [];
      st.push({ slide: 23, line: '1-3', ph: 'tri', r: 0, cap: 'The loop calls printsum n times. Is the body O(1)? Only if printsum is O(1). We must look <b>inside</b> the method (the cost of the call itself is ignored).' });
      for (var c = 1; c <= n; c++) {
        tot += c; sums.push('sum = ' + c * (c + 1) / 2);
        st.push({ slide: 24, line: c === 1 ? '2,8' : '8', ph: 'tri', r: c, cap: 'printsum(' + c + '): its loop runs <b>' + c + '</b> time' + (c > 1 ? 's' : '') + '. Inner loop runs so far: 1 + … + ' + c + ' = <b>' + tot + '</b>.', out: 'sum = ' + c * (c + 1) / 2 });
      }
      st.push({ slide: 24, line: '1,8', ph: 'tri', r: n, done: true, cap: 'In total 1 + 2 + … + n = n(n + 1)/2 = ' + tot + ' runs: the triangle is about half of an n × n square. So it is <b>O(n²)</b>.' });
      st.push({ slide: 25, line: L(MC, 'count*(count+1)/2'), ph: 'imp', cap: 'The improved printsum uses the formula count × (count + 1) / 2: no loop, so it is <b>O(1)</b>. The loop that calls it n times is now <b>O(n)</b>: ' + n + ' steps instead of ' + tot + '.', out: sums, clear: true });
      var h = Math.ceil(n / 2), lg = 0; for (var q = 1; q < n; q *= 2) lg++;
      st.push({ slide: 26, line: L(MC, 'j += 2'), ph: 'ex1', cap: 'Slide 26: j goes 0, 2, 4, … so the inner loop runs about n/2 times. t(n) = n × n/2 = n²/2 → <b>O(n²)</b>. For n = ' + n + ': ' + n + ' × ' + h + ' = ' + n * h + ' prints.', clear: true });
      st.push({ slide: 27, line: L(MC, 'j *= 2'), ph: 'ex2', cap: 'Slide 27: j goes 1, 2, 4, 8, … (doubling), so the inner loop runs about log₂ n times. t(n) = n × log₂ n → <b>O(n log n)</b>. For n = ' + n + ': ' + n + ' × ' + lg + ' = ' + n * lg + ' prints.' });
      return st;
    },
    draw: function (k, s, v) {
      var n = Math.trunc(v.n), items = [], cw = Math.min(26, Math.floor(260 / n)), gx = 40, gy = 40, r, c;
      if (s.ph === 'tri' || s.ph === 'imp') {
        for (r = 1; r <= n; r++) {
          items.push(T('rl' + r, gx - 6, gy + (r - 1) * cw + cw / 2 + 4, String(r), { anchor: 'end', mono: true, size: 10, tone: 'muted' }));
          var cells = s.ph === 'imp' ? 1 : r;
          for (c = 0; c < cells; c++) items.push(B('t' + r + '_' + c, gx + c * cw, gy + (r - 1) * cw, cw - 2, cw - 2, { tone: s.ph === 'imp' ? 'teal' : r <= s.r ? (r === s.r && !s.done ? 'accent' : 'blue') : 'muted', fill: s.ph === 'imp' || r <= s.r ? 'solid' : 'soft', r: 2 }));
        }
        items.push(T('tl', gx, gy - 12, 'count ↓   inner loop runs →', { size: 11, tone: 'muted' }));
        var runs = s.ph === 'imp' ? n : s.r * (s.r + 1) / 2;
        items.push(T('tc', 440, 150, s.ph === 'imp' ? 'steps:' : 'inner loop runs:', { anchor: 'middle', size: 15 }));
        items.push(T('tv', 440, 190, String(runs), { anchor: 'middle', mono: true, size: 24, bold: true, tone: 'accent' }));
        if (s.done || s.ph === 'imp') items.push(T('to', 440, 240, s.ph === 'imp' ? 'O(n)' : 'O(n²)', { anchor: 'middle', mono: true, size: 22, bold: true, tone: 'teal' }));
        return items;
      }
      var js = []; if (s.ph === 'ex1') for (c = 0; c < n; c += 2) js.push(c); else for (c = 1; c < n; c *= 2) js.push(c);
      items.push(T('gh', gx, gy - 12, 'i ↓   j = ' + (js.length ? js.join(', ') : '(none)'), { size: 11, mono: true, tone: 'muted' }));
      for (r = 0; r < n; r++) {
        items.push(T('rl' + r, gx - 6, gy + r * cw + cw / 2 + 4, String(r), { anchor: 'end', mono: true, size: 10, tone: 'muted' }));
        for (c = 0; c < js.length; c++) items.push(B('t' + r + '_' + c, gx + c * cw, gy + r * cw, cw - 2, cw - 2, { tone: 'accent', fill: 'solid', r: 2 }));
      }
      items.push(T('tc', 440, 150, 'prints:', { anchor: 'middle', size: 15 }));
      items.push(T('tv', 440, 190, n + ' × ' + js.length + ' = ' + n * js.length, { anchor: 'middle', mono: true, size: 22, bold: true, tone: 'accent' }));
      items.push(T('to', 440, 240, s.ph === 'ex1' ? 'O(n²)' : 'O(n log n)', { anchor: 'middle', mono: true, size: 22, bold: true, tone: 'teal' }));
      return items;
    }
  };

  /* ---------- 7. the tree of recursive calls (slides 28-29) ---------- */
  var HC = '// Recursive method for finding the solution to move n disks\n// from a source tower to a target tower using auxiliary tower\npublic static void towerHanoi(int n, char from, char to, char aux) {\n  if (n == 1)     // Base Case, no recursive call\n    System.out.printf("Move disk 1 from %c to %c%n", from, to);\n  else {\n    // First recursive call to move n-1 disks\n    towerHanoi(n-1, from, aux, to);\n    System.out.printf("Move disk %d from %c to %c%n", n, from, to);\n    // Second recursive call to move n-1 disks\n    towerHanoi(n-1, aux, to, from);\n  }\n}';
  function hanoiEvents(n) {
    var ev = [], id = 0;
    (function go(m, f, t, a, d, x) {
      var me = { id: id++, n: m, f: f, t: t, a: a, d: d, x: x };
      ev.push({ k: 'call', node: me });
      if (m === 1) { ev.push({ k: 'print', node: me }); return; }
      go(m - 1, f, a, t, d + 1, 2 * x);
      ev.push({ k: 'print', node: me });
      go(m - 1, a, t, f, d + 1, 2 * x + 1);
    })(n, 'A', 'B', 'C', 0, 0);
    return ev;
  }
  var hanoi = {
    id: 'hanoi', slides: [28, 29], title: 'Every call makes two more calls', code: HC,
    inputs: [{ id: 'n', label: 'n disks', value: 3, min: 1, max: 4 }],
    presets: [{ label: 'n = 3 (slide 29)', values: { n: 3 } }, { label: 'n = 1', values: { n: 1 } }, { label: 'n = 2', values: { n: 2 } }, { label: 'n = 4', values: { n: 4 } }],
    steps: function (v) {
      var n = Math.trunc(v.n), ev = hanoiEvents(n), st = [], calls = 0, nodes = [], done = [];
      st.push({ slide: 28, line: 3, nodes: [], done: [], cur: null, calls: 0, cap: 'main calls towerHanoi(' + n + ', \'A\', \'B\', \'C\'). How many calls will run in total?' });
      ev.forEach(function (e) {
        var m = e.node;
        if (e.k === 'call') {
          calls++; nodes.push(m);
          st.push({ slide: 29, line: m.n === 1 ? 4 : m.d === 0 ? 3 : (m.x % 2 ? 11 : 8), nodes: nodes.slice(), done: done.slice(), cur: m.id, calls: calls, cap: 'Call ' + calls + ': towerHanoi(' + m.n + ', \'' + m.f + '\', \'' + m.t + '\', \'' + m.a + '\')' + (m.n === 1 ? ': the base case, no more calls.' : ': n > 1, so it will make two calls with n − 1 = ' + (m.n - 1) + '.') });
        } else {
          done.push(m.id);
          st.push({ slide: 29, line: m.n === 1 ? 5 : 9, nodes: nodes.slice(), done: done.slice(), cur: m.id, calls: calls, mv: true, cap: 'It prints its move: disk ' + m.n + ' from ' + m.f + ' to ' + m.t + '.', out: 'Move disk ' + m.n + ' from ' + m.f + ' to ' + m.t });
        }
      });
      st.push({ slide: 29, line: '8,11', nodes: nodes.slice(), done: done.slice(), cur: null, calls: calls, end: true, cap: 'A tree of calls: each level has twice as many calls as the one above. Total calls = 2<sup>' + n + '</sup> − 1 = <b>' + calls + '</b>, so the time complexity is <b>O(2ⁿ)</b>.' });
      return st;
    },
    draw: function (k, s, v) {
      var n = Math.trunc(v.n), items = [], W = 560;
      items.push(B('main', 245, 6, 70, 26, { title: 'main', mono: true, size: 12, tone: 'blue' }));
      s.nodes.forEach(function (m) {
        var slots = Math.pow(2, m.d), cx = (m.x + 0.5) * W / slots, y = 56 + m.d * 70, bw = Math.min(118, W / Math.pow(2, n - 1) - 8);
        var isDone = s.done.indexOf(m.id) >= 0, cur = m.id === s.cur;
        items.push(B('h' + m.id, cx - bw / 2, y, bw, 34, { title: '(' + m.n + ',' + m.f + ',' + m.t + ',' + m.a + ')', mono: true, size: bw < 80 ? 10 : 12, tone: cur ? 'accent' : isDone ? 'teal' : 'blue', fill: cur ? 'solid' : 'soft', hi: cur }));
        var py = m.d ? 56 + (m.d - 1) * 70 + 34 : 32, pcx = m.d ? ((m.x >> 1) + 0.5) * W / Math.pow(2, m.d - 1) : 280;
        items.push(A('e' + m.id, pcx, py, cx, y, { tone: 'muted' }));
        if (isDone && W / slots > 60) items.push(T('mv' + m.id, cx, y + 48, 'disk ' + m.n + ': ' + m.f + '→' + m.t, { anchor: 'middle', size: 10, mono: true, tone: 'teal' }));
      });
      items.push(T('cn', 12, 24, 'calls: ' + s.calls + (s.end ? ' = 2' + sup(n) + ' − 1' : ''), { mono: true, size: 14, bold: true, tone: 'accent' }));
      return items;
    }
  };

  var bh = function (html, l) { return { type: 'bullet', html: html, level: l || 0 }; }, ph = function (html) { return { type: 'paragraph', html: html }; },
    code = function (t) { return { type: 'code', lang: 'java', text: t }; };

  addUnit({
    course: 'ds', lesson: '02-analysis-of-algorithms',
    blurb: 'How fast is an algorithm? Growth functions, the dominant term, Big-O categories, and counting the work done by loops, nested loops, method calls and recursion.',
    parts: [
      { title: 'Algorithm efficiency', from: 1, to: 6 },
      { title: 'Growth functions and Big-O', from: 7, to: 12 },
      { title: 'Comparing growth functions', from: 13, to: 17 },
      { title: 'Analyzing loop execution', from: 18, to: 22 },
      { title: 'Analyzing methods', from: 23, to: 29 }
    ],
    visuals: [dishes, growth, bigo, compare, loops, methods, hanoi],
    slides: {
      1: { cover: true, explain: '<p>Before we build data structures, we need a way to say how <b>fast</b> an algorithm is, without running it. This unit gives us that tool: <b>Big-O</b>.</p><pre class="ex">two ways to solve the same problem:\n  A: 1,000 steps for 1,000 items\n  B: 1,000,000 steps for 1,000 items  → B is worse</pre><p>A data structure that is built well can be {{reused|يُعاد استخدامه}} in many programs, so its {{efficiency|كفاءة}} matters a lot.</p>' },
      2: { explain: '<p>The plan of this unit: what efficiency means, growth functions and Big-O, comparing them, and then counting the work done by loops and by methods.</p>' },
      3: { explain: '<p>An <b>algorithm</b> is a list of steps that solves a problem. Its <b>efficiency</b> has two sides:</p><ul><li><b>time</b>: how long it runs;</li><li><b>space</b>: how much memory it uses.</li></ul><pre class="ex">sum of an array: one loop, one variable\n→ time grows with the array, space stays small</pre><p><b>Analysis of algorithms</b> puts each algorithm in a {{category|فئة}} by its time and space.</p><p class="watch">“Efficient” is not only “fast”: an algorithm that needs too much memory is not efficient either.</p>' },
      4: { explain: '<p>A simple example. Washing a dish takes 30 s and drying it 30 s more. Done carefully, n dishes take <b>n × 60</b> seconds: 10 dishes → 600 s.</p><p>Now we are careless and {{splash|نرشّ}} water: after washing each new dish, we must dry <b>all</b> the dishes washed so far again.</p><pre class="ex">dish 2 → dry 1, 2\ndish 3 → dry 1, 2, 3</pre><p class="watch">The careless way does not add a fixed cost: the extra work gets <b>bigger</b> with every dish.</p>' },
      5: { blocks: [bh('After washing dish <i>i</i>, we should dry <i>i</i> dishes.'), bh('Time to wash <i>n</i> dishes = <i>n</i> × 30 seconds'), bh('Time to dry <i>n</i> dishes = (1 + 2 + … + <i>n</i>) × 30 seconds'),
        ph('Σ<sub>i=1</sub><sup>n</sup> i = (1 + 2 + ⋯ + n) = n(n + 1) / 2'), bh('<i>Time</i> (<i>n</i> dishes) = 30n + 30 · n(n+1)/2 = 15n² + 45n seconds')],
        explain: '<p>Count the careless time. Washing: 30n seconds. Drying: 1 dish, then 2, then 3… so 1 + 2 + … + n dishes, each 30 s.</p><p>The sum 1 + 2 + … + n equals <b>n(n + 1)/2</b>. So:</p><pre class="ex">30n + 30 · n(n + 1)/2 = 30n + 15n² + 15n\n                      = 15n² + 45n\nn = 10 → 1500 + 450 = 1950 s</pre><p class="watch">Careful: 10 dishes = 600 s. Careless: 1950 s. With 100 dishes: 6,000 s against 154,500 s!</p>' },
      6: { explain: '<p>To analyze an algorithm, first decide what n, the <b>problem size</b>, means:</p><ul><li>dishes: n = the number of dishes;</li><li>searching: n = the number of elements to search in;</li><li>sorting: n = the number of elements to sort.</li></ul><pre class="ex">search a list of 500 names → n = 500</pre><p>Then the time is written as a {{function|دالة}} of n.</p><p class="watch">n is the size of the input, not the value inside it: sorting the numbers 7, 900, 3 has n = 3.</p>' },
      7: { blocks: [bh('We must decide what we are trying to efficiently optimize'), bh('<i>Time complexity</i> is the execution time', 1), bh('<i>Space complexity</i> is the memory space allocated by the algorithm', 1), bh('Execution time is generally the focus'), bh('A <i>growth function</i> is the execution time of an algorithm as a function of the problem size <i>n</i>.'), bh('Growth function of the inefficient dishwashing algorithm is <i>t</i>(<i>n</i>) = 15n² + 45n')],
        explain: '<p>We can measure <b>time complexity</b> (execution time) or <b>space complexity</b> (memory). Usually we care most about time.</p><p>A <b>growth function</b> t(n) gives the time for a problem of size n:</p><pre class="ex">t(n) = 15n² + 45n      (careless dishes)\nt(4) = 240 + 180 = 420 seconds</pre><p class="watch">t(n) is not one number: it tells how the time <b>grows</b> when n grows.</p>' },
      8: { blocks: [bh('The term 15n² grows much faster than 45n'), bh('Therefore, 15n² is the dominant term in <i>t</i>(<i>n</i>) = 15n² + 45n')],
        explain: '<p>Look at the table. For small n the two terms are close (n = 1: 15 and 45; 45n is even bigger!). But 15n² grows much faster:</p><pre class="ex">n = 1,000:  15n² = 15,000,000   45n = 45,000</pre><p>When n is big, 15n² is almost all of t(n). It is the <b>{{dominant|المسيطر}} term</b>.</p><p class="watch">Do not judge by small n: at n = 1, 45n is bigger, but it is still not the dominant term.</p>' },
      9: { blocks: [bh('<i>Asymptotic complexity</i> is based on the dominant term of the growth function. The term that increases most quickly as <i>n</i> increases.'), bh('The dominant term for <i>t</i>(<i>n</i>) = 15n² + 45n is 15n²'), bh('Typically, it is not necessary to know the exact growth function for an algorithm.'), bh('We are mainly interested in the <i>asymptotic complexity</i> of an algorithm, the general nature of the algorithm as <i>n</i> increases.')],
        explain: '<p><b>{{Asymptotic|التقاربي: عندما تكبر n جدًا}} complexity</b> looks only at the dominant term: how the algorithm behaves when n becomes very large.</p><pre class="ex">t(n) = 15n² + 45n  →  behaves like 15n²</pre><p>So we usually do not need the exact growth function. We only need its general {{shape|شكل}}: does it grow like n, like n², like 2ⁿ…?</p>' },
      10: { blocks: [bh('The coefficients and the lower order terms become increasingly less important as <i>n</i> increases'), bh('We say that the algorithm is of <i>order</i> n², written O(n²)'), bh('This is called <i>Big-O notation</i>'), bh('There are different Big-O categories: O(n), O(n²), etc.'), bh('Two algorithms that have the same order of execution time are considered to have the same efficiency and belong to the same category, but this doesn\'t mean they have equal growth functions or behave exactly the same for all values of <i>n</i>.')],
        explain: '<p>When n grows, the {{coefficients|المعاملات}} (like 15) and the smaller terms (like 45n) matter less and less. Drop them both:</p><pre class="ex">15n² + 45n  →  n²  →  O(n²)   “order n squared”</pre><p>This is <b>Big-O notation</b>. Two algorithms with the same Big-O are in the same {{category|فئة}}.</p><p class="watch">Same Big-O does not mean same time: 15n² and 2n² are both O(n²), but one is 7.5 times slower.</p>' },
      11: { blocks: [bh('Some sample growth functions and their Big-O categories')],
        explain: '<p>The common Big-O categories, from slowest growth to fastest:</p><pre class="ex">O(1)        constant      t(n) = 17\nO(log n)    logarithmic   t(n) = 3 log n\nO(n)        linear        t(n) = 20n + 4\nO(n log n)  n log n\nO(n²)       quadratic\nO(n³)       cubic\nO(2ⁿ)       exponential</pre><p>In each row only the dominant term decides the category.</p><p class="watch">O(1) does not mean “one step”: t(n) = 17 is O(1) because the time does not change with n.</p>' },
      12: { blocks: [bh('Determine the order of each growth function'),
        ph('a) <i>t</i>(<i>n</i>) = 30n³ + 200n² + 1000n + 10000 &nbsp;&nbsp;&nbsp; <b>a) O(n³)</b>'), ph('b) <i>t</i>(<i>n</i>) = 4n⁴ + 10 &nbsp;&nbsp;&nbsp; <b>b) O(n⁴)</b>'), ph('c) <i>t</i>(<i>n</i>) = 2n + n³ + n⁵ &nbsp;&nbsp;&nbsp; <b>c) O(n⁵)</b>'),
        ph('d) <i>t</i>(<i>n</i>) = 1000 &nbsp;&nbsp;&nbsp; <b>d) O(1)</b>'), ph('e) <i>t</i>(<i>n</i>) = n log n + 10n &nbsp;&nbsp;&nbsp; <b>e) O(n log n)</b>'), ph('f) <i>t</i>(<i>n</i>) = log n³ + 100 &nbsp;&nbsp;&nbsp; <b>f) O(log n)</b>')],
        explain: '<p>The method is always the same: find the dominant term, then drop its coefficient.</p><pre class="ex">a) 30n³ + 200n² + … → 30n³ → O(n³)\nc) 2n + n³ + n⁵      → n⁵   → O(n⁵)   (order of terms does not matter)\nd) 1000              → O(1)\nf) log n³ = 3 log n  → O(log n)</pre><p class="watch">Big coefficients do not win: in a), 10000 and 1000n look big, but n³ grows faster than both.</p>' },
      13: { text: false, explain: '<p>The chart draws six growth functions for n from 1 to 15. The higher a curve, the slower the algorithm.</p><pre class="ex">n = 15:  log₂ n ≈ 3.9   n = 15   n² = 225</pre><p>For small n the curves are close, and some even cross: here n³ is above 2ⁿ.</p><p class="watch">A chart with small n can fool you: 2ⁿ looks better than n³ here, but not for long (next slides).</p>' },
      14: { text: false, explain: '<p>Now n goes up to 30 and the time up to 5000. At n = 10, 2ⁿ passes n³:</p><pre class="ex">n = 10:  2¹⁰ = 1024 > 10³ = 1000\nn = 15:  2¹⁵ = 32768 > 15³ = 3375</pre><p>n² and n log₂ n, which looked fast before, now look small next to n³ and 2ⁿ.</p>' },
      15: { text: false, explain: '<p>Up to n = 60, and time up to 500,000. 2ⁿ leaves the chart before n = 20; n³ is still on it at n = 60 (216,000); n² is almost flat at the bottom.</p><pre class="ex">n = 60:  n² = 3,600   n³ = 216,000\n         2ⁿ ≈ 1,150,000,000,000,000,000</pre><p class="watch">An exponential algorithm, O(2ⁿ), is only usable for very small n.</p>' },
      16: { blocks: [bh('An algorithm has a quadratic time complexity = O(n²)'), bh('Suppose that we use a new processor which is 25 times faster than the old processor'), bh('If the maximum problem size for the algorithm is <i>N</i> on the old processor, what is the maximum problem size that we can run on the new processor in the same amount of time?'),
        bh('Solution: The maximum problem size on the new processor with 25X speedup is √(25N²) = 5N. This is because the time complexity = O(n²) and (5N)² = 25 × old execution time N²')],
        explain: '<p>The new CPU is 25 times faster, so in the same time it can do 25 × N² steps. Which size k·N needs that many steps?</p><pre class="ex">(k·N)² = 25 · N²  →  k² = 25  →  k = 5</pre><p>So the problem can only be <b>5 times</b> bigger, not 25 times.</p><p class="watch">“25× faster” does not mean “25× bigger problems”. That is only true for O(n).</p>' },
      17: { text: false, explain: '<p>With a CPU 10 times faster, how much bigger can the problem be?</p><pre class="ex">O(n)   → 10 × N\nO(n²)  → √10 ≈ 3.16 × N\nO(n³)  → ∛10 ≈ 2.15 × N\nO(2ⁿ)  → N + 3.32   (2^3.32 ≈ 10)</pre><p>The worse the Big-O, the less a faster CPU helps. For O(2ⁿ) it only <b>adds</b> about 3 to the size.</p><p class="watch">A better algorithm helps more than faster {{hardware|العتاد}}: changing O(n²) to O(n) beats a 10× faster CPU.</p>' },
      18: { explain: '<p>Next: how to find the Big-O of real code, by looking at its loops and its method calls.</p>' },
      19: { explain: '<p>Why analyze algorithms instead of just running them?</p><ul><li>to {{predict|نتوقّع}} how they behave with <b>large</b> inputs, so the software can grow (is <b>scalable</b>);</li><li>a simple measure (like O(n²)) is easier than writing the program and timing it;</li><li>we can compare algorithms and pick the best one.</li></ul><pre class="ex">works in 1 s for 1,000 users\nO(n²): 10,000 users → about 100 s</pre>' },
      20: { blocks: [bh('First determine the order of the loop body, then multiply it by the number of times the loop will execute'), bh('Example:'), code('for (int i = 0; i < n; i++) {\n  // Sequence of statements that execute in O(1)\n}'), bh('The statements in loop body execute in constant time = O(1)'), bh('The number of loop iterations is equal to n'), bh('Therefore, the time complexity of the loop is O(n)')],
        explain: '<p>The rule for a loop: <b>cost of the body × number of {{iterations|التكرارات}}</b>.</p><pre class="ex">for (int i = 0; i < n; i++)\n  sum += i;              // O(1)\n→ O(1) × n = O(n)</pre><p>The body is O(1) (it does not depend on n), and the loop runs n times, so the loop is O(n).</p><p class="watch">Count iterations from the loop header: <code>i < n</code> with i++ runs n times; <code>i <= n</code> runs n + 1 times, still O(n).</p>' },
      21: { blocks: [bh('Consider the following loop:'), code('while (count < n) {\n  count = count * 2;\n  // Sequence of statements that execute in O(1)\n}'), bh('The statements in loop body execute in constant time = O(1)'), bh('The number of loop iterations = log₂ n'), bh('Therefore, the time complexity of the loop is O(log₂ n)')],
        explain: '<p>Here count <b>doubles</b> each time: 1, 2, 4, 8, 16… It reaches n after about <b>log₂ n</b> steps.</p><pre class="ex">n = 16: count 1 → 2 → 4 → 8 → 16   (4 steps, log₂ 16 = 4)\nn = 1,000,000 → only about 20 steps</pre><p>So the loop is <b>O(log n)</b>: very fast.</p><p class="watch">count must start at 1 (the slide does not show it). If count starts at 0, 0 × 2 = 0 forever: an infinite loop.</p>' },
      22: { blocks: [bh('When loops are nested, we multiply the complexity of the outer loop by the complexity of the inner loop'), bh('Consider the following nested loops:'), code('for (int i=0; i < n; i++)\n  for (int j=0; j < n; j++) {\n    // Sequence of statements that execute in O(1)\n  }'), bh('Both the inner and outer loops have complexity of O(n)'), bh('The overall time complexity of the nested loops is O(n²)')],
        explain: '<p>For <b>nested</b> loops, multiply: (outer loop) × (inner loop).</p><pre class="ex">n = 3: i = 0 → j = 0, 1, 2\n       i = 1 → j = 0, 1, 2\n       i = 2 → j = 0, 1, 2   → 3 × 3 = 9 runs</pre><p>The inner loop runs n times for <b>each</b> of the n outer iterations: n × n = <b>O(n²)</b>.</p><p class="watch">Two loops one <b>after</b> the other are added (n + n = O(n)), not multiplied.</p>' },
      23: { explain: '<p>A loop body can call a method. Then the body is O(1) only if the method is O(1). We must look <b>inside</b> the method.</p><pre class="ex">for (int count = 1; count <= n; count++)\n  printsum(count);     // O(1)? we must check</pre><p>The time of the call itself (jumping into the method) is {{ignored|يُهمَل}}; only the work inside counts.</p><p class="watch">A loop with one line is not always O(n): one method call can hide a whole loop.</p>' },
      24: { blocks: [code('// Print the sum of numbers from 1 to count\npublic void printsum(int count) {\n  int sum = 0;\n  for (int i=1; i <= count; i++) sum += i;\n  System.out.println("sum = " + sum);\n}'), bh('There is a loop inside <code>printsum</code> that repeats <code>count</code> times. The method is called <i>n</i> times with <code>count</code> = 1, 2, …, <i>n</i>.'), bh('The <b>for</b> loop inside <code>printsum</code> is executed 1 + 2 + ⋯ + n = n×(n+1)/2 iterations and has a time complexity = O(n²)')], explain: '<p>printsum(count) has a loop that runs <b>count</b> times. The outer loop calls it with count = 1, 2, …, n, so the inner loop runs:</p><pre class="ex">1 + 2 + … + n = n × (n + 1) / 2\nn = 100 → 5,050 times</pre><p>n(n + 1)/2 = n²/2 + n/2, and its dominant term is n²/2, so this is <b>O(n²)</b>.</p><p class="watch">The inner loop does not run n times every time, but about n/2 on average: still O(n²).</p>' },
      25: { blocks: [code('for (int count=1; count <= n; count++) {\n  printsum(count);\n}\n// Print the sum of numbers from 1 to count\npublic void printsum(int count) {\n  int sum = count*(count+1)/2;\n  System.out.println("sum = " + sum);\n}'), bh('The time complexity of the improved <code>printsum</code> is O(1)'), bh('The time complexity of the for loop that calls the method <code>printsum</code> <i>n</i> times is O(n).')], explain: '<p>A better printsum uses the formula from slide 5 instead of a loop:</p><pre class="ex">sum = count*(count+1)/2;    // count = 4 → 4*5/2 = 10</pre><p>It does the same work in a fixed number of steps: <b>O(1)</b>. The loop that calls it n times is now <b>O(n)</b> instead of O(n²).</p><p class="watch">Same output, different Big-O: improving the method inside a loop improves the whole loop.</p>' },
      26: { blocks: [bh('Determine the growth function <i>t</i>(<i>n</i>) and order of execution time in Big-O notation of the following nested loops:'), code('for (int i=0; i<n; i++)\n  for (int j=0; j<n; j += 2)\n    System.out.println(i + ", " + j);'), bh('Solution: The outer for loop is repeated <i>n</i> times. The inner for loop is repeated <i>n</i>/2 times.'), bh('The growth function <i>t</i>(<i>n</i>) = n × n/2 = n²/2'), bh('The order of execution time is O(n²)')], explain: '<p>The inner loop adds 2 each time (<code>j += 2</code>), so it runs about <b>n/2</b> times. The outer loop runs n times.</p><pre class="ex">n = 6: j = 0, 2, 4  → 3 times for each i\nt(n) = n × n/2 = n²/2 = 18 prints</pre><p>Drop the coefficient 1/2: <b>O(n²)</b>.</p><p class="watch">Jumping by 2 halves the work, but halving is only a coefficient: the order stays n².</p>' },
      27: { blocks: [bh('Determine the growth function <i>t</i>(<i>n</i>) and order of execution time in Big-O notation of the following nested loops:'), code('for (int i=0; i<n; i++)\n  for (int j=1; j<n; j *= 2)\n    System.out.println(i + ", " + j);'), bh('Solution: The outer for loop is repeated <i>n</i> times. The inner for loop is repeated log₂ n times.'), bh('The growth function <i>t</i>(<i>n</i>) = n × log₂ n'), bh('The order of execution time is O(n log₂ n)')], explain: '<p>Now the inner loop <b>doubles</b> j (<code>j *= 2</code>): 1, 2, 4, 8… It runs about <b>log₂ n</b> times, like slide 21. The outer loop runs n times.</p><pre class="ex">n = 8: j = 1, 2, 4  → 3 times (log₂ 8 = 3) for each i\nt(n) = n × log₂ n = 24 prints</pre><p>So the order is <b>O(n log n)</b>.</p><p class="watch">Compare with slide 26: <code>j += 2</code> gives n/2, but <code>j *= 2</code> gives log₂ n. Adding and multiplying are very different.</p>' },
      28: { blocks: [bh('Consider the following <code>towerHanoi</code> recursive method:'), code(HC)],
        explain: '<p>This is the Tower of Hanoi from CS II. For n > 1, one call makes <b>two</b> recursive calls with n − 1:</p><pre class="ex">towerHanoi(3) → towerHanoi(2) twice\ntowerHanoi(2) → towerHanoi(1) twice</pre><p>Each call does O(1) work itself (one printf), so the time depends on <b>how many calls</b> there are.</p><p class="watch">A recursive method has no loop, but it can still do a lot of work: count its calls.</p>' },
      29: { text: false, explain: '<p>The calls form a <b>tree</b>: 1 call with n = 3, 2 with n = 2, 4 with n = 1.</p><pre class="ex">1 + 2 + 4 = 7 = 2³ − 1\nn = 10 → 1,023 calls\nn = 20 → 1,048,575 calls</pre><p>In general there are <b>2ⁿ − 1</b> calls, so the time complexity is <b>O(2ⁿ)</b>: exponential.</p><p class="watch">Each extra disk <b>doubles</b> the work. That is why exponential algorithms become slow so fast.</p>' }
    }
  });
})();
