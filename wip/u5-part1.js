/* CS1 · Unit 5 · Mathematical Functions, Characters and Strings (38 slides): char and Unicode, escape sequences, char/int casting,
   the Character class, String methods, reading strings, comparing, substrings, indexOf, parsing numbers, the Math class, printf */
(function () {
  function mix(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }
  /* a double the way Java prints it (Double.toString) */
  function jd(x) {
    if (isNaN(x)) return 'NaN';
    if (x === Infinity) return 'Infinity';
    if (x === -Infinity) return '-Infinity';
    if (x === 0) return Object.is(x, -0) ? '-0.0' : '0.0';
    var a = Math.abs(x);
    if (a >= 1e-3 && a < 1e7) { var s = String(x); return s.indexOf('.') < 0 ? s + '.0' : s; }
    var e = x.toExponential().split('e'), m = e[0];
    return (m.indexOf('.') < 0 ? m + '.0' : m) + 'E' + Number(e[1]);
  }
  function tf(b) { return b ? 'true' : 'false'; }
  function h(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  /* Java literals for a char and a String */
  function jch(c) { return c === "'" ? "'\\''" : c === '\\' ? "'\\\\'" : "'" + c + "'"; }
  function jstr(s) { return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'; }
  function hex4(n) { return ('000' + n.toString(16).toUpperCase()).slice(-4); }
  /* a char code shown as a character (control characters as \uXXXX) */
  function vis(n) { return n < 32 || n === 127 ? '\\u' + hex4(n) : String.fromCharCode(n); }
  function C1(v) { return String(v.c || 'A').charAt(0) || 'A'; }
  function jtrim(s) { return s.replace(/^[\x00-\x20]+|[\x00-\x20]+$/g, ''); }
  function jround(x) { return isNaN(x) ? 0 : Math.round(x); }
  /* shortest decimal digits of a >= 0, written without an exponent */
  function plain(a) {
    var m = a.toExponential().split('e'), d = m[0].replace('.', ''), e = +m[1];
    if (e >= 0) return d.length > e + 1 ? d.slice(0, e + 1) + '.' + d.slice(e + 1) : d + new Array(e + 2 - d.length).join('0');
    return '0.' + new Array(-e).join('0') + d;
  }
  /* round a decimal string half-up to p digits after the point */
  function roundStr(s, p) {
    var parts = s.split('.'), ip = parts[0], fp = parts[1] || '';
    if (fp.length <= p) return ip + (p ? '.' + fp + new Array(p - fp.length + 1).join('0') : '');
    var all = BigInt(ip + fp.slice(0, p)) + (+fp[p] >= 5 ? 1n : 0n), t = all.toString();
    while (t.length < p + 1) t = '0' + t;
    return p ? t.slice(0, t.length - p) + '.' + t.slice(t.length - p) : t;
  }
  /* Java's %.pf and %.pe */
  function jfix(x, p) {
    if (isNaN(x)) return 'NaN';
    if (!isFinite(x)) return x > 0 ? 'Infinity' : '-Infinity';
    var neg = x < 0 || Object.is(x, -0);
    return (neg ? '-' : '') + roundStr(plain(Math.abs(x)), p);
  }
  function jexp(x, p) {
    if (isNaN(x)) return 'NaN';
    if (!isFinite(x)) return x > 0 ? 'Infinity' : '-Infinity';
    var neg = x < 0, a = Math.abs(x), e = 0, d;
    if (a === 0) d = '0.' + new Array(p + 1).join('0');
    else {
      var m = a.toExponential().split('e'); e = +m[1];
      d = roundStr(m[0], p);
      if (d.indexOf('10') === 0) { d = roundStr('1', p); e++; }
    }
    return (neg ? '-' : '') + d + 'e' + (e < 0 ? '-' : '+') + ('0' + Math.abs(e)).slice(-2);
  }
  function fmt4(x) { var t = jfix(x, 4); return t === '-0.0000' ? '0.0000' : t; }

  function cwFor(n, w, max) { return Math.max(12, Math.min(max || 34, Math.floor(w / Math.max(n, 1)))); }
  /* the characters of a string as cells, with the index above each one */
  function cells(p, x, y, s, o) {
    o = o || {};
    var arr = typeof s === 'string' ? s.split('') : s, n = arr.length, cw = o.cw || cwFor(n, o.w || 520), ch = o.ch || 36, out = [];
    for (var i = 0; i < n; i++) {
      var t = o.tone ? o.tone(i) : null, c = arr[i] === ' ' ? '␣' : arr[i];
      out.push(B(p + i, x + i * cw, y, cw - 2, ch, { title: c, mono: true, size: o.size || (String(c).length > 1 ? 10 : cw < 22 ? 12 : 16), r: 3, tone: t || 'muted', hi: !!(o.hot && o.hot(i)) }));
      if (o.idx !== false) out.push(T(p + 'i' + i, x + i * cw + cw / 2 - 1, y - 6, String(i), { anchor: 'middle', mono: true, size: cw < 22 ? 9.5 : 11.5, tone: t && t !== 'muted' ? t : 'muted' }));
    }
    if (!n) out.push(B(p + 'empty', x, y, 56, ch, { title: '""', mono: true, tone: o.emptyTone || 'muted', dash: true }));
    return out;
  }
  function lbl(id, x, y, t, o) { return T(id, x, y, t, mix({ size: 13, tone: 'muted' }, o || {})); }
  function vbox(id, x, y, w, name, type, value, o) {
    return B(id, x, y, w, 48, mix({ tag: type + ' ' + name, title: value == null ? 'no value' : String(value), mono: true, size: 16, tone: value == null ? 'muted' : 'teal', dash: value == null, r: 6 }, o || {}));
  }
  function hot(o) { return mix(o || {}, { tone: 'accent', hi: true }); }

  /* ---------- 1. char codes and Unicode (slides 3-6) ---------- */
  var RANGES = [["'0' to '9'", 48, 57, '\\u0030 to \\u0039'], ["'A' to 'Z'", 65, 90, '\\u0041 to \\u005A'], ["'a' to 'z'", 97, 122, '\\u0061 to \\u007A']];
  function rangeOf(n) { for (var i = 0; i < 3; i++) if (n >= RANGES[i][1] && n <= RANGES[i][2]) return i; return -1; }
  var chars = {
    id: 'chars', slides: [3, 6], title: 'A char is a number inside',
    inputs: [{ id: 'c', type: 'text', label: 'character', value: 'A', minlen: 1, maxlen: 1 }],
    presets: [{ label: "'A'", values: { c: 'A' } }, { label: "'4'", values: { c: '4' } }, { label: "'z'", values: { c: 'z' } }, { label: 'a space', values: { c: ' ' } }, { label: "'α' (Greek)", values: { c: 'α' } }],
    steps: function (v) {
      var c = C1(v), n = c.charCodeAt(0), x = hex4(n), r = rangeOf(n), q = h(jch(c));
      return [
        { slide: 3, cap: '<code>char letter = ' + q + ';</code> A <b>char</b> holds exactly <b>one</b> character, written between single quotes.' },
        { slide: 3, cap: 'Inside the computer a char is stored as a <b>number</b>: its code. The code of ' + q + ' is <b>' + n + '</b>.' },
        { slide: 3, cap: r >= 0 ? q + ' (code ' + n + ') is in the range ' + h(RANGES[r][0]) + ', codes ' + RANGES[r][1] + ' to ' + RANGES[r][2] + '. Digits, capital letters and small letters each have their own block of codes, in order.' : q + ' (code ' + n + ') is not a digit or an English letter, so it is in none of these three ranges.' },
        { slide: 4, cap: 'Java uses <b>Unicode</b>: every char takes 16 bits (2 bytes). Group the bits in fours: each group is one hexadecimal digit, so the code is written <code>\\u' + x + '</code>.' },
        { slide: 4, cap: 'The codes go from <code>\\u0000</code> to <code>\\uFFFF</code>: 65535 + 1 = 65536 characters, enough for the world’s languages. <code>\\u03b1 \\u03b2 \\u03b3</code> are the Greek letters α β γ.' },
        { slide: 5, cap: '<code>char letter = \'\\u' + x + '\';</code> stores the same value as <code>char letter = ' + q + ';</code>. Both hold the code ' + n + '.' },
        { slide: 6, cap: 'The common ranges with both kinds of code. ' + (r >= 0 ? q + ' is in the highlighted row.' : 'Your character is in none of them.') }
      ];
    },
    draw: function (k, s, v) {
      var c = C1(v), n = c.charCodeAt(0), x = hex4(n), r = rangeOf(n), q = jch(c), items = [];
      if (k <= 1) {
        items.push(T('code', 280, 44, 'char letter = ' + q + ';', { anchor: 'middle', mono: true, size: 20, bold: true }));
        items.push(B('chr', k ? 60 : 210, 110, 140, 76, { tag: 'char letter', title: q, mono: true, size: 28, tone: 'teal', hi: k === 0 }));
        if (k) {
          items.push(A('st', 206, 148, 294, 148, { tone: 'accent', label: 'stored as' }));
          items.push(B('num', 300, 110, 200, 76, { tag: 'in memory: a number', title: String(n), mono: true, size: 28, tone: 'accent', hi: true }));
        }
        return items;
      }
      if (k === 2 || k === 6) {
        var three = k === 6, cols = three ? [110, 275, 440] : [150, 400];
        items.push(B('chr', 210, 30, 140, 60, { tag: 'char letter', title: q, mono: true, size: 24, tone: 'teal' }));
        (three ? ['Characters', 'Code in decimal', 'Unicode'] : ['Characters', 'Code in decimal']).forEach(function (t, j) {
          items.push(T('h' + (three ? 3 : 2) + j, cols[j], 124, t, { anchor: 'middle', bold: true, size: 13 }));
        });
        RANGES.forEach(function (row, i) {
          var on = i === r, y = 136 + i * 58;
          items.push(B('row' + i, 30, y, 500, 46, { tone: on ? 'accent' : 'muted', hi: on }));
          [row[0], row[1] + ' to ' + row[2]].concat(three ? [row[3]] : []).forEach(function (t, j) {
            items.push(T('c' + (three ? 3 : 2) + i + j, cols[j], y + 28, t, { anchor: 'middle', mono: true, size: 14, tone: on ? 'accent' : 'ink', bold: on }));
          });
        });
        if (r < 0) items.push(T('none', 280, 328, 'code ' + n + ' is not in these ranges', { anchor: 'middle', tone: 'red', bold: true, size: 13 }));
        return items;
      }
      if (k === 3) {
        var bits = ('0000000000000000' + n.toString(2)).slice(-16);
        items.push(T('t2', 280, 30, '16 bits = 2 bytes', { anchor: 'middle', bold: true, size: 15 }));
        items.push(T('by1', 176, 62, 'byte 1', { anchor: 'middle', size: 12, tone: 'muted' }));
        items.push(T('by2', 384, 62, 'byte 2', { anchor: 'middle', size: 12, tone: 'muted' }));
        for (var i = 0; i < 16; i++) items.push(B('bit' + i, 72 + i * 26, 72, 24, 34, { title: bits[i], mono: true, size: 15, tone: Math.floor(i / 4) % 2 ? 'teal' : 'blue', r: 3 }));
        for (var g = 0; g < 4; g++) {
          var gx = 72 + g * 104 + 51;
          items.push(A('gb' + g, gx, 112, gx, 132, { tone: 'muted' }));
          items.push(T('hx' + g, gx, 160, x[g], { anchor: 'middle', mono: true, size: 22, bold: true, tone: g % 2 ? 'teal' : 'blue' }));
        }
        items.push(B('u', 160, 196, 240, 64, { tag: 'Unicode of ' + q, title: '\\u' + x, mono: true, size: 26, tone: 'accent', hi: true }));
        items.push(T('dec', 280, 300, 'decimal ' + n + ' = hexadecimal ' + x, { anchor: 'middle', mono: true, size: 13, tone: 'muted' }));
        return items;
      }
      if (k === 4) {
        items.push(B('lo', 30, 40, 150, 50, { title: "'\\u0000'", mono: true, size: 17, tone: 'blue' }));
        items.push(A('rng', 186, 65, 374, 65, { tone: 'accent', label: '65536 characters' }));
        items.push(B('hi', 380, 40, 150, 50, { title: "'\\uFFFF'", mono: true, size: 17, tone: 'blue' }));
        ['03b1', '03b2', '03b3'].forEach(function (u, i) {
          var bx = 50 + i * 170;
          items.push(B('gu' + i, bx, 150, 120, 44, { title: '\\u' + u, mono: true, size: 16, tone: 'teal' }));
          items.push(A('ga' + i, bx + 60, 198, bx + 60, 234, { tone: 'muted' }));
          items.push(B('gl' + i, bx, 240, 120, 56, { title: 'αβγ'[i], size: 28, tone: 'accent', hi: true }));
        });
        return items;
      }
      items.push(B('u1', 30, 80, 220, 76, { tag: 'with Unicode', title: "'\\u" + x + "'", mono: true, size: 24, tone: 'blue' }));
      items.push(T('eq', 280, 128, '=', { anchor: 'middle', size: 30, bold: true, tone: 'accent' }));
      items.push(B('u2', 310, 80, 220, 76, { tag: 'with the character', title: q, mono: true, size: 24, tone: 'blue' }));
      items.push(A('a1', 140, 160, 236, 206, { tone: 'muted' }));
      items.push(A('a2', 420, 160, 324, 206, { tone: 'muted' }));
      items.push(B('val', 180, 232, 200, 60, { tag: 'both store the code', title: String(n), mono: true, size: 26, tone: 'teal', hi: true }));
      return items;
    }
  };

  /* ---------- 2. escape sequences (slide 7) ---------- */
  var ESC_SRC = ['Tab:\\tend', 'one\\ntwo', 'C:\\\\java', 'He said \\"Java is fun\\"'];
  var ESC_CODE = ESC_SRC.map(function (s) { return 'System.out.println("' + s + '");'; }).join('\n');
  var ESCV = { '\\t': ['⇥', 9], '\\n': ['↵', 10], '\\\\': ['\\', 92], '\\"': ['"', 34] };
  function etoks(src) { var t = []; for (var i = 0; i < src.length; i++) { if (src[i] === '\\') { t.push(src[i] + src[i + 1]); i++; } else t.push(src[i]); } return t; }
  var escape = {
    id: 'escape', slides: [7, 7], title: 'Two symbols in the code, one character in the string', code: ESC_CODE,
    steps: [
      { cap: 'An <b>escape sequence</b> is a backslash <code>\\</code> and one more symbol. In the code it takes two places, but in the string it is <b>one</b> character with its own code.' },
      { line: 1, cap: '<code>\\t</code> is a <b>tab</b> (code 9): the output jumps forward to the next tab stop.', out: 'Tab:\tend' },
      { line: 2, cap: '<code>\\n</code> is a <b>linefeed</b> (code 10): the rest goes on a new line.', out: ['one', 'two'] },
      { line: 3, cap: 'A backslash starts an escape sequence, so to print one backslash you write <b>two</b>: <code>\\\\</code> (code 92).', out: 'C:\\java' },
      { line: 4, cap: 'A <code>"</code> would end the string. <code>\\"</code> puts a double quote <b>inside</b> it (code 34).', out: 'He said "Java is fun"' },
      { cap: 'Without the backslashes: <code>"He said "Java is fun""</code>. The string ends at the second quote, and <code>Java is fun</code> is outside any string, so the code does not compile.' }
    ],
    draw: function (k) {
      if (k === 5) {
        var bad = '"He said "Java is fun""', bw = cwFor(bad.length, 520);
        return [
          lbl('l1', 20, 40, 'The compiler reads:'),
          cells('s', 20, 76, bad, { cw: bw, idx: false, tone: function (i) { return i === 0 || i === 9 || i >= 21 ? 'accent' : i < 9 ? 'teal' : 'red'; } }),
          T('m1', 20 + 5 * bw, 146, 'one string: "He said "', { anchor: 'middle', mono: true, size: 13, tone: 'teal', bold: true }),
          T('m2', 20 + 15 * bw, 178, 'not in any string → error', { anchor: 'middle', size: 13, tone: 'red', bold: true }),
          T('fix', 280, 270, 'correct:  "He said \\"Java is fun\\""', { anchor: 'middle', mono: true, tone: 'teal', size: 15, bold: true })
        ];
      }
      var src = k === 0 ? 'a\\tb' : ESC_SRC[k - 1], tk = etoks(src), cw = cwFor(src.length, 520), items = [], pairs = {}, pos = 0;
      tk.forEach(function (t, j) { if (t.length === 2) { pairs[pos] = pairs[pos + 1] = j; } pos += t.length; });
      items.push(lbl('l1', 20, 40, 'In the code, between the quotes: ' + src.length + ' symbols'));
      items.push(cells('s', 20, 76, src, { cw: cw, idx: false, tone: function (i) { return pairs[i] != null ? 'accent' : 'muted'; } }));
      items.push(lbl('l2', 20, 178, 'In the string: ' + tk.length + ' characters'));
      items.push(cells('t', 20, 204, tk.map(function (t) { return ESCV[t] ? ESCV[t][0] : t; }), { cw: cw, idx: false, tone: function (j) { return tk[j].length === 2 ? 'accent' : 'muted'; } }));
      pos = 0;
      tk.forEach(function (t, j) {
        if (t.length === 2) {
          items.push(A('ar' + j, 20 + (pos + 1) * cw - 1, 116, 20 + j * cw + cw / 2 - 1, 200, { tone: 'accent' }));
          items.push(T('cd' + j, 20 + j * cw + cw / 2 - 1, 262, 'code ' + ESCV[t][1], { anchor: 'middle', mono: true, size: 11.5, tone: 'accent', bold: true }));
        }
        pos += t.length;
      });
      return items;
    }
  };

  /* ---------- 3. char <-> int and ++ (slide 8) ---------- */
  var charcast = {
    id: 'charcast', slides: [8, 8], title: 'char and int, and ++ on a char',
    inputs: [{ id: 'c', type: 'text', label: 'character', value: 'a', minlen: 1, maxlen: 1 }],
    presets: [{ label: "'a' (slide)", values: { c: 'a' } }, { label: "'Z'", values: { c: 'Z' } }, { label: "'9'", values: { c: '9' } }, { label: "'z'", values: { c: 'z' } }],
    code: function (v) { var c = C1(v), n = c.charCodeAt(0); return 'int i = ' + jch(c) + '; // Same as int i = (int)' + jch(c) + ';\nchar c = ' + n + '; // Same as char c = (char)' + n + ';\nchar ch = ' + jch(c) + ';\nSystem.out.println(++ch);'; },
    steps: function (v) {
      var c = C1(v), n = c.charCodeAt(0), up = (n + 1) & 0xFFFF, dn = (n + 0xFFFF) & 0xFFFF, q = h(jch(c));
      return [
        { line: 1, cap: 'A char can be stored in an int: Java uses its <b>code</b>. <code>int i = ' + q + ';</code> stores <b>' + n + '</b>.' },
        { line: 2, cap: 'The other way: <code>char c = ' + n + ';</code> stores the character with code ' + n + ', which is ' + h(jch(vis(n))) + '.' },
        { line: 3, cap: '<code>char ch = ' + q + ';</code> Now ch holds the code ' + n + '.' },
        { line: 4, cap: '<code>++ch</code> adds 1 to the code: ' + n + ' + 1 = ' + up + ', the <b>next</b> Unicode character: ' + h(jch(vis(up))) + '.', out: vis(up) },
        { line: 4, cap: 'In the same way, <code>--ch</code> would give the <b>preceding</b> character: code ' + dn + ', ' + h(jch(vis(dn))) + '.' }
      ];
    },
    draw: function (k, s, v) {
      var c = C1(v), n = c.charCodeAt(0), up = (n + 1) & 0xFFFF, dn = (n + 0xFFFF) & 0xFFFF, items = [];
      if (k <= 1) return [
        B('ch', 30, 70, 170, 70, { tag: k ? 'char c' : 'the char', title: jch(k ? vis(n) : c), mono: true, size: 26, tone: 'teal', hi: k === 1 }),
        A('ar', k ? 326 : 206, 105, k ? 206 : 326, 105, { tone: 'accent', label: k ? '(char)' : '(int)' }),
        B('in', 330, 70, 200, 70, { tag: k ? 'the number' : 'int i', title: String(n), mono: true, size: 26, tone: 'blue', hi: k === 0 }),
        T('note', 280, 230, k ? 'number → the character with that code' : 'character → its code', { anchor: 'middle', bold: true, tone: 'accent', size: 16 })
      ];
      var cur = k === 2 ? 1 : k === 3 ? 2 : 0;
      items.push(B('ch', 195, 36, 170, 64, { tag: 'char ch', title: jch(vis(k === 3 ? up : n)), mono: true, size: 24, tone: 'teal', hi: k === 3 }));
      [dn, n, up].forEach(function (code, i) {
        var x = 100 + i * 130, on = i === cur, t = vis(code);
        items.push(B('n' + i, x, 150, 100, 64, { title: t, mono: true, size: t.length > 1 ? 13 : 26, tone: on ? 'accent' : 'muted', hi: on }));
        items.push(T('nc' + i, x + 50, 238, 'code ' + code, { anchor: 'middle', mono: true, size: 13, tone: on ? 'accent' : 'muted', bold: on }));
        items.push(T('nl' + i, x + 50, 262, ['--ch', 'ch', '++ch'][i], { anchor: 'middle', mono: true, size: 13, tone: on ? 'accent' : 'muted' }));
      });
      return items;
    }
  };

  /* ---------- 4. comparing characters (slide 9) ---------- */
  var CMP_CODE = 'if (ch >= \'A\' && ch <= \'Z\')\n  System.out.println(ch + " is an uppercase letter");\nelse if (ch >= \'a\' && ch <= \'z\')\n  System.out.println(ch + " is a lowercase letter");\nelse if (ch >= \'0\' && ch <= \'9\')\n  System.out.println(ch + " is a numeric character");';
  var CTEST = [[65, 90, "'A'", "'Z'", 'is an uppercase letter', 'A-Z'], [97, 122, "'a'", "'z'", 'is a lowercase letter', 'a-z'], [48, 57, "'0'", "'9'", 'is a numeric character', '0-9']];
  var charcmp = {
    id: 'charcmp', slides: [9, 9], title: 'Characters are compared by their codes', code: CMP_CODE,
    inputs: [{ id: 'c', type: 'text', label: 'ch', value: 'G', minlen: 1, maxlen: 1 }],
    presets: [{ label: "'G'", values: { c: 'G' } }, { label: "'q'", values: { c: 'q' } }, { label: "'7'", values: { c: '7' } }, { label: "'#'", values: { c: '#' } }, { label: "'é'", values: { c: 'é' } }],
    steps: function (v) {
      var c = C1(v), n = c.charCodeAt(0), q = h(jch(c)), st = [];
      for (var i = 0; i < 3; i++) {
        var t = CTEST[i], ok = n >= t[0] && n <= t[1];
        st.push({ line: 1 + 2 * i, t: i, ok: ok, cap: (i ? 'Next test. ' : 'Characters are compared by their <b>codes</b>. ' + q + ' has code ' + n + '. ') + 'Is ' + n + ' >= ' + t[0] + ' (' + t[2] + ') and <= ' + t[1] + ' (' + t[3] + ')? <b>' + tf(ok) + '</b>.' });
        if (ok) { st.push({ line: 2 + 2 * i, t: i, ok: true, cap: 'True, so print. The rest of the chain is skipped.', out: c + ' ' + t[4] }); return st; }
      }
      st.push({ t: 3, cap: 'All three tests are false and there is no last else, so nothing is printed.' });
      return st;
    },
    draw: function (k, s, v) {
      var c = C1(v), n = c.charCodeAt(0), sc = 520 / 128, items = [];
      items.push(A('axis', 20, 172, 540, 172, { head: false, tone: 'muted' }));
      [0, 32, 64, 96, 127].forEach(function (m) { items.push(T('tk' + m, 20 + (m + 0.5) * sc, 192, String(m), { anchor: 'middle', mono: true, size: 11, tone: 'muted' })); });
      CTEST.forEach(function (t, i) {
        var cur = s.t === i, done = s.t > i;
        items.push(B('band' + i, 20 + t[0] * sc, 128, (t[1] - t[0] + 1) * sc, 40, { tone: cur ? (s.ok ? 'teal' : 'accent') : done ? 'red' : 'blue', hi: cur, r: 3 }));
        items.push(T('bl' + i, 20 + (t[0] + t[1] + 1) / 2 * sc, 154, t[5], { anchor: 'middle', mono: true, size: 12, bold: true, tone: cur ? 'accent' : 'ink' }));
        if (i <= s.t) {
          var res = i === s.t && s.t < 3 ? s.ok : false;
          items.push(T('res' + i, 20, 232 + i * 28, "ch >= " + t[2] + " && ch <= " + t[3] + '   →   ' + tf(res), { mono: true, size: 13.5, bold: i === s.t, tone: res ? 'teal' : 'red' }));
        }
      });
      if (n <= 127) items.push(P('ptr', 20 + (n + 0.5) * sc, 124, jch(c) + ' = ' + n, { dir: 'down' }));
      else items.push(T('far', 540, 100, jch(c) + ' = ' + n + ', far to the right →', { anchor: 'end', mono: true, size: 13, bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 5. the Character class (slide 10) ---------- */
  function one(f) { return function (c) { var r = f(c); return r.length === 1 ? r : c; }; }
  var CM = [
    ['isDigit', function (c) { return /\p{Nd}/u.test(c); }, 'a digit'],
    ['isLetter', function (c) { return /\p{L}/u.test(c); }, 'a letter'],
    ['isLetterOrDigit', function (c) { return /[\p{L}\p{Nd}]/u.test(c); }, 'a letter or a digit'],
    ['isLowerCase', function (c) { return /\p{Ll}/u.test(c); }, 'a lowercase letter'],
    ['isUpperCase', function (c) { return /\p{Lu}/u.test(c); }, 'an uppercase letter'],
    ['toLowerCase', one(function (c) { return c.toLowerCase(); })],
    ['toUpperCase', one(function (c) { return c.toUpperCase(); })]
  ];
  function cmRes(m, c) { var r = m[1](c); return typeof r === 'boolean' ? tf(r) : r; }
  var charmeth = {
    id: 'charmeth', slides: [10, 10], title: 'Asking the Character class',
    inputs: [{ id: 'c', type: 'text', label: 'ch', value: 'b', minlen: 1, maxlen: 1 }],
    presets: [{ label: "'b'", values: { c: 'b' } }, { label: "'Q'", values: { c: 'Q' } }, { label: "'5'", values: { c: '5' } }, { label: "'$'", values: { c: '$' } }, { label: "'é'", values: { c: 'é' } }],
    code: function (v) { return 'char ch = ' + jch(C1(v)) + ';\n' + CM.map(function (m) { return 'System.out.println(Character.' + m[0] + '(ch));'; }).join('\n'); },
    steps: function (v) {
      var c = C1(v), q = h(jch(c));
      return CM.map(function (m, i) {
        var r = cmRes(m, c);
        var cap = m[2] ? 'Is ' + q + ' ' + m[2] + '? <b>' + r + '</b>.' : '<code>' + m[0] + '</code> returns the ' + (i === 5 ? 'lowercase' : 'uppercase') + ' form: ' + h(jch(r)) + (r === c ? ' (no change: it has no other form, or it is already like that).' : '.');
        if (i === 2) cap += ' (The slide writes isLetterOfDigit; the real name is <code>isLetterOrDigit</code>.)';
        return { line: i + 2, cap: cap, out: r };
      });
    },
    draw: function (k, s, v) {
      var c = C1(v), items = [];
      CM.forEach(function (m, i) {
        var y = 14 + i * 45, cur = i === k;
        items.push(B('m' + i, 20, y, 340, 38, { title: 'Character.' + m[0] + '(' + jch(c) + ')', mono: true, size: 13, align: 'left', tone: cur ? 'accent' : 'muted', hi: cur }));
        if (i <= k) {
          var r = cmRes(m, c);
          items.push(B('r' + i, 380, y, 150, 38, { title: m[2] ? r : jch(r), mono: true, size: 15, tone: r === 'true' ? 'teal' : r === 'false' ? 'red' : 'blue', hi: cur }));
        }
      });
      return items;
    }
  };

  /* ---------- 6. String is a reference type, instance and static methods (slides 12-14) ---------- */
  var MSG = 'Welcome to Java';
  var strref = {
    id: 'strref', slides: [12, 14], title: 'A String variable refers to an object',
    code: 'char letter = \'A\';\nString message = "Welcome to Java";\nint n = message.length();\nString big = message.toUpperCase();\ndouble r = Math.sqrt(4);',
    steps: [
      { slide: 12, line: 1, cap: 'A <b>char</b> holds only <b>one</b> character.' },
      { slide: 12, line: 2, cap: 'For a row of characters, use <b>String</b>. <code>"Welcome to Java"</code> is a string of 15 characters, in double quotes.' },
      { slide: 12, line: 2, cap: 'String is a <b>class</b> (like System and Scanner), not a primitive type. It is a <b>reference type</b>: the variable holds a reference (an arrow) to the string object.' },
      { slide: 13, line: 3, cap: '<code>message.length()</code> is an <b>instance method</b>: it is called on one particular string (message) and tells about that string: 15.' },
      { slide: 13, line: 4, cap: '<code>message.toUpperCase()</code> returns a <b>new</b> string object. message itself does not change.' },
      { slide: 14, line: 5, cap: '<code>Math.sqrt(4)</code> is a <b>static method</b>: it is called with the class name, and no object is needed. All the methods of Math are static.' }
    ],
    draw: function (k) {
      var items = [];
      if (k === 5) return [
        B('mathc', 40, 50, 200, boxH(4), { title: 'Math', band: true, lines: ['PI, E', 'sqrt(a)', 'pow(a, b)', '...'], mono: true, tone: 'blue' }),
        T('call', 400, 100, 'Math.sqrt(4)', { anchor: 'middle', mono: true, size: 18, bold: true, tone: 'accent' }),
        A('ca', 330, 108, 246, 120, { tone: 'accent' }),
        T('ret', 400, 150, 'returns 2.0', { anchor: 'middle', mono: true, size: 15, tone: 'teal', bold: true }),
        T('no', 280, 270, 'no object: just the class name', { anchor: 'middle', size: 15, bold: true, tone: 'accent' })
      ];
      items.push(B('lt', 20, 36, 120, 56, { tag: 'char letter', title: "'A'", mono: true, size: 22, tone: 'teal', hi: k === 0 }));
      if (k >= 1) {
        items.push(cells('w', 206, 150, MSG, { cw: 22, tone: function () { return k === 1 || k === 3 ? 'accent' : 'blue'; } }));
        if (k === 1) items.push(T('n15', 371, 220, '15 characters', { anchor: 'middle', bold: true, tone: 'accent' }));
      }
      if (k >= 2) {
        items.push(B('obj', 196, 120, 344, 80, { tag: 'a String object', fill: 'none', tone: 'blue', z: 0 }));
        items.push(B('msg', 20, 140, 130, 56, { tag: 'String message', title: '●', size: 20, tone: 'teal', hi: k === 2 }));
        items.push(A('ref', 150, 168, 194, 168, { tone: 'teal' }));
      }
      if (k === 3) items.push(T('call', 368, 236, 'message.length()  →  15', { anchor: 'middle', mono: true, size: 15, bold: true, tone: 'accent' }));
      if (k === 4) {
        items.push(cells('W', 206, 274, MSG.toUpperCase(), { cw: 22, idx: false, tone: function () { return 'accent'; } }));
        items.push(B('obj2', 196, 262, 344, 60, { tag: 'a new String object', fill: 'none', tone: 'accent', z: 0 }));
        items.push(B('big', 20, 266, 130, 56, { tag: 'String big', title: '●', size: 20, tone: 'accent', hi: true }));
        items.push(A('ref2', 150, 294, 194, 294, { tone: 'accent' }));
      }
      return items;
    }
  };

  /* ---------- 7. length and charAt (slides 15-16) ---------- */
  var strlen = {
    id: 'strlen', slides: [15, 16], title: 'length() and charAt(index)',
    inputs: [{ id: 's', type: 'text', label: 'message', value: MSG, maxlen: 18 }, { id: 'i', label: 'index', value: 0, min: -3, max: 25 }],
    presets: [{ label: 'Slide', values: { s: MSG, i: 0 } }, { label: 'index 11', values: { s: MSG, i: 11 } }, { label: '"Hi", index 1', values: { s: 'Hi', i: 1 } }, { label: 'index = length', values: { s: 'Java', i: 4 } }, { label: 'empty ""', values: { s: '', i: 0 } }],
    code: function (v) {
      var i = Math.trunc(v.i);
      return 'String message = ' + jstr(v.s) + ';\nSystem.out.println("The length of " + message + " is "\n  + message.length());\nSystem.out.println(' + (i === 0 ? '"The first character in message is "' : '"The character at index ' + i + ' is "') + '\n  + message.charAt(' + i + '));';
    },
    steps: function (v) {
      var s = v.s, n = s.length, i = Math.trunc(v.i), ok = i >= 0 && i < n;
      var st = [
        { line: 1, cap: n ? 'message refers to a string of <b>' + n + '</b> characters. Each one has an <b>index</b>, starting at <b>0</b>.' : 'message refers to the <b>empty string</b> <code>""</code>: no characters at all.' },
        { line: '2-3', cap: '<code>message.length()</code> counts the characters' + (s.indexOf(' ') >= 0 ? ', spaces too' : '') + ': <b>' + n + '</b>.', out: 'The length of ' + s + ' is ' + n },
        ok ? { line: '4-5', cap: '<code>message.charAt(' + i + ')</code> returns the character at index ' + i + ': ' + h(jch(s[i])) + '.', out: (i === 0 ? 'The first character in message is ' : 'The character at index ' + i + ' is ') + s[i] }
          : { line: '4-5', cap: 'There is no index ' + i + ' (' + (n ? 'the indexes are 0 to ' + (n - 1) : 'the string is empty') + '). charAt throws an error and the program stops.', out: 'Exception in thread "main" java.lang.StringIndexOutOfBoundsException' }
      ];
      if (n) st.push({ cap: 'The first index is 0, and the last index is <code>length() - 1</code> = ' + (n - 1) + '. So <code>message.charAt(message.length() - 1)</code> is the last character: ' + h(jch(s[n - 1])) + '.' });
      return st;
    },
    draw: function (k, s, v) {
      var str = v.s, n = str.length, i = Math.trunc(v.i), ok = i >= 0 && i < n, cw = cwFor(n, 520, 30), x0 = Math.round(280 - n * cw / 2), items = [];
      items.push(cells('c', x0, 90, str, { cw: cw, tone: function (j) { return k === 1 ? 'teal' : k === 2 && j === i ? 'accent' : k === 3 && (j === 0 || j === n - 1) ? (j === n - 1 ? 'accent' : 'teal') : 'muted'; }, hot: function (j) { return k === 2 && j === i; } }));
      if (k === 1) {
        items.push(A('len', x0, 140, x0 + Math.max(n * cw, 56), 140, { head: false, tone: 'teal' }));
        items.push(T('lt', 280, 166, 'length() = ' + n, { anchor: 'middle', mono: true, bold: true, size: 16, tone: 'teal' }));
      }
      if (k === 2) {
        if (ok) items.push(P('p', x0 + i * cw + cw / 2 - 1, 130, 'charAt(' + i + ')', { dir: 'up' }));
        else items.push(T('err', 280, 176, 'charAt(' + i + '): no character there', { anchor: 'middle', bold: true, size: 15, tone: 'red' }));
      }
      if (k === 3) {
        items.push(P('p0', x0 + cw / 2 - 1, 130, '0', { dir: 'up' }));
        if (n > 1) items.push(P('pl', x0 + (n - 1) * cw + cw / 2 - 1, 130, 'length() - 1', { dir: 'up' }));
      }
      return items;
    }
  };

  /* ---------- 8. toLowerCase, toUpperCase, trim (slide 17) ---------- */
  var strconv = {
    id: 'strconv', slides: [17, 17], title: 'New strings: lower, upper, trim',
    inputs: [{ id: 's', type: 'text', label: 's', value: '  Welcome  ', maxlen: 16 }],
    presets: [{ label: '"  Welcome  "', values: { s: '  Welcome  ' } }, { label: '"Java 101"', values: { s: 'Java 101' } }, { label: '"hello WORLD"', values: { s: 'hello WORLD' } }, { label: 'only spaces', values: { s: '   ' } }],
    code: function (v) { return 'String s = ' + jstr(v.s) + ';\nString low = s.toLowerCase();\nString up = s.toUpperCase();\nString t = s.trim();\nSystem.out.println("[" + t + "]");'; },
    steps: function (v) {
      var s = v.s, t = jtrim(s);
      return [
        { line: 1, cap: 's has ' + s.length + ' characters' + (s !== t ? ', with whitespace at the ends' : '') + '.' },
        { line: 2, cap: '<code>toLowerCase()</code> returns a <b>new</b> string with all letters small. Digits, spaces and signs stay as they are.' },
        { line: 3, cap: '<code>toUpperCase()</code> returns a new string with all letters capital.' },
        { line: 4, cap: '<code>trim()</code> returns a new string without the whitespace on <b>both sides</b>' + (s === t ? '. Here there is none, so the text is the same.' : ': ' + (s.length - t.length) + ' removed. Spaces in the middle stay.') },
        { line: 5, cap: 'The brackets show exactly where t starts and ends.', out: '[' + t + ']' },
        { cap: 'And s? It is <b>still</b> ' + h(jstr(s)) + '. These methods never change the string; they give back a new one.' }
      ];
    },
    draw: function (k, s, v) {
      var str = v.s, vals = [str, str.toLowerCase(), str.toUpperCase(), jtrim(str)], names = ['s', 'low', 'up', 't'];
      var cw = cwFor(Math.max(str.length, 1), 420, 26), items = [];
      vals.forEach(function (val, i) {
        if (i > k) return;
        var y = 34 + i * 74, cur = i === k || (k === 5 && i === 0);
        items.push(T('nm' + i, 20, y + 24, names[i], { mono: true, bold: true, size: 15, tone: cur ? 'accent' : 'ink' }));
        items.push(cells('r' + i + '_', 100, y, val, { cw: cw, idx: false, emptyTone: cur ? 'accent' : 'muted', tone: function (j) { return cur ? (val[j] === ' ' ? 'muted' : 'accent') : 'muted'; } }));
      });
      return items;
    }
  };

  /* ---------- 9. concatenation (slide 18) ---------- */
  function chain(p, y, parts, cur) {
    var ws = parts.map(function (t) { return Math.max(44, 18 + t.t.length * 9.6); }), total = ws.reduce(function (a, b) { return a + b; }, 0) + (parts.length - 1) * 34, x = 280 - total / 2, out = [];
    parts.forEach(function (t, i) {
      out.push(B(p + i, Math.round(x), y, Math.round(ws[i]), 46, { title: t.t, mono: true, size: 15, tone: t.tone || 'blue', tag: t.tag, hi: i === cur || cur === 'all' }));
      x += ws[i];
      if (i < parts.length - 1) { out.push(T(p + 'p' + i, Math.round(x + 17), y + 29, '+', { anchor: 'middle', bold: true, size: 18 })); x += 34; }
    });
    return out;
  }
  var concat = {
    id: 'concat', slides: [18, 18], title: 'Joining strings with concat and +',
    inputs: [{ id: 'a', type: 'text', label: 's1', value: 'Welcome ', maxlen: 10 }, { id: 'b', type: 'text', label: 's2', value: 'to Java', maxlen: 10 }, { id: 'n', label: 'number', value: 2, min: -99, max: 999 }],
    presets: [{ label: '"Welcome " "to Java" 2', values: { a: 'Welcome ', b: 'to Java', n: 2 } }, { label: 'no space: "Hi" "there"', values: { a: 'Hi', b: 'there', n: 2 } }, { label: 'number 10', values: { a: 'Welcome ', b: 'to Java', n: 10 } }, { label: 'empty s2', values: { a: 'Java', b: '', n: 5 } }],
    code: function (v) { var n = Math.trunc(v.n); return 'String s1 = ' + jstr(v.a) + ', s2 = ' + jstr(v.b) + ';\nString s3 = s1.concat(s2);\nString s4 = s1 + s2;\nString s = "Chapter" + ' + n + ';\nString t = "Supplement" + \'B\';\nString u = "Chapter" + ' + n + ' + ' + n + ';\nString w = ' + n + ' + ' + n + ' + "Chapter";'; },
    steps: function (v) {
      var a = v.a, b = v.b, n = Math.trunc(v.n);
      return [
        { line: 2, cap: '<code>s1.concat(s2)</code> returns a new string: the characters of s1, then the characters of s2: ' + h(jstr(a + b)) + '.' + (a && b && a[a.length - 1] !== ' ' && b[0] !== ' ' ? ' No space is added for you.' : '') },
        { line: 3, cap: '<code>s1 + s2</code> does the same thing. When an operand of + is a string, + means <b>join</b>.' },
        { line: 4, cap: 'If one operand is a string and the other is a number, the number is turned into text first: <code>"Chapter" + ' + n + '</code> is ' + h(jstr('Chapter' + n)) + '.' },
        { line: 5, cap: 'A char joins in the same way: <code>"Supplement" + \'B\'</code> is "SupplementB".' },
        { line: 6, cap: '+ goes from <b>left to right</b>. <code>"Chapter" + ' + n + '</code> is already a string, so the next <code>+ ' + n + '</code> joins again: ' + h(jstr('Chapter' + n + n)) + '.' },
        { line: 7, cap: 'Here the first + has two numbers, so it <b>adds</b>: ' + n + ' + ' + n + ' = ' + (n + n) + '. Only then a string comes: ' + h(jstr((n + n) + 'Chapter')) + '.' }
      ];
    },
    draw: function (k, s, v) {
      var a = v.a, b = v.b, n = Math.trunc(v.n), items = [];
      if (k <= 1) {
        var cw = cwFor(a.length + b.length + 1, 520, 26), bx = 20 + Math.max(a.length * cw, 56) + cw;
        items.push(lbl('la', 20, 34, 's1'), lbl('lb', bx, 34, 's2'));
        items.push(cells('a', 20, 50, a, { cw: cw, idx: false, tone: function () { return 'accent'; } }));
        items.push(cells('b', bx, 50, b, { cw: cw, idx: false, tone: function () { return 'blue'; } }));
        items.push(A('j1', 20 + a.length * cw / 2, 92, 60, 180, { tone: 'accent' }), A('j2', bx + b.length * cw / 2, 92, 140, 180, { tone: 'blue' }));
        items.push(lbl('lr', 20, 196, k ? 's4 = s1 + s2' : 's3 = s1.concat(s2)', { tone: 'ink', bold: true, mono: true }));
        items.push(cells('r', 20, 212, a + b, { cw: cw, idx: false, tone: function (j) { return j < a.length ? 'accent' : 'blue'; } }));
        return items;
      }
      if (k === 2) return chain('x', 50, [{ t: '"Chapter"', tag: 'String' }, { t: String(n), tag: 'int', tone: 'accent' }], 1).concat([A('d', 280, 104, 280, 176, { tone: 'muted', label: 'the number becomes text', la: 'start', lx: 8 })], chain('y', 190, [{ t: jstr('Chapter' + n), tone: 'teal', tag: 'String' }], 'all'));
      if (k === 3) return chain('x', 50, [{ t: '"Supplement"', tag: 'String' }, { t: "'B'", tag: 'char', tone: 'accent' }], 1).concat([A('d', 280, 104, 280, 176, { tone: 'muted' })], chain('y', 190, [{ t: '"SupplementB"', tone: 'teal', tag: 'String' }], 'all'));
      var first = k === 4 ? [{ t: '"Chapter"', tag: 'String' }, { t: String(n), tag: 'int' }, { t: String(n), tag: 'int' }] : [{ t: String(n), tag: 'int', tone: 'accent' }, { t: String(n), tag: 'int', tone: 'accent' }, { t: '"Chapter"', tag: 'String' }];
      var mid = k === 4 ? [{ t: jstr('Chapter' + n), tag: 'String', tone: 'teal' }, { t: String(n), tag: 'int' }] : [{ t: String(n + n), tag: 'int', tone: 'accent' }, { t: '"Chapter"', tag: 'String' }];
      var last = k === 4 ? jstr('Chapter' + n + n) : jstr((n + n) + 'Chapter');
      return chain('x', 30, first, k === 4 ? null : 'all').concat(
        [A('d1', 280, 82, 280, 120, { tone: 'muted', label: k === 4 ? 'join' : 'add', la: 'start', lx: 8 })],
        chain('m', 140, mid, 0),
        [A('d2', 280, 192, 280, 230, { tone: 'muted', label: 'join', la: 'start', lx: 8 })],
        chain('y', 250, [{ t: last, tone: 'teal', tag: 'String' }], 'all'));
    }
  };
