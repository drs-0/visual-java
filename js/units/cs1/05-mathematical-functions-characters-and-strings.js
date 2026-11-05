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
      { line: '1-4', cap: 'An <b>escape sequence</b> is a backslash <code>\\</code> and one more symbol. In the code it takes two places, but in the string it is <b>one</b> character with its own code.' },
      { line: 1, cap: '<code>\\t</code> is a <b>tab</b> (code 9): the output jumps forward to the next tab stop.', out: 'Tab:\tend' },
      { line: 2, cap: '<code>\\n</code> is a <b>linefeed</b> (code 10): the rest goes on a new line.', out: ['one', 'two'] },
      { line: 3, cap: 'A backslash starts an escape sequence, so to print one backslash you write <b>two</b>: <code>\\\\</code> (code 92).', out: 'C:\\java' },
      { line: 4, cap: 'A <code>"</code> would end the string. <code>\\"</code> puts a double quote <b>inside</b> it (code 34).', out: 'He said "Java is fun"' },
      { line: 4, cap: 'Without the backslashes: <code>"He said "Java is fun""</code>. The string ends at the second quote, and <code>Java is fun</code> is outside any string, so the code does not compile.' }
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
      items.push(lbl('l2', 20, 296, 'In the string: ' + tk.length + ' characters'));
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
      st.push({ line: '1,3,5', t: 3, cap: 'All three tests are false and there is no last else, so nothing is printed.' });
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
      if (n) st.push({ line: '4-5', cap: 'The first index is 0, and the last index is <code>length() - 1</code> = ' + (n - 1) + '. So <code>message.charAt(message.length() - 1)</code> is the last character: ' + h(jch(s[n - 1])) + '.' });
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
        if (n > 1) items.push(P('pl', x0 + (n - 1) * cw + cw / 2 - 1, 130, (n - 1) + ' = length() - 1', { dir: 'up', len: 56 }));
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
        { line: 1, cap: 'And s? It is <b>still</b> ' + h(jstr(s)) + '. These methods never change the string; they give back a new one.' }
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

  /* ---------- 10. reading words with next() (slide 19) ---------- */
  function wordSpans(line) { var out = [], re = /\S+/g, m; while ((m = re.exec(line))) out.push({ t: m[0], at: m.index }); return out; }
  var READW = 'Scanner input = new Scanner(System.in);\nSystem.out.print("Enter three words separated by spaces: ");\nString s1 = input.next();\nString s2 = input.next();\nString s3 = input.next();\nSystem.out.println("s1 is " + s1);\nSystem.out.println("s2 is " + s2);\nSystem.out.println("s3 is " + s3);';
  var readwords = {
    id: 'readwords', slides: [19, 19], title: 'next() reads one word', code: READW,
    inputs: [{ id: 'line', type: 'text', label: 'the user types', value: 'Welcome to Java', maxlen: 26 }],
    presets: [{ label: 'Welcome to Java', values: { line: 'Welcome to Java' } }, { label: 'extra spaces', values: { line: '  Java   is  fun' } }, { label: 'four words', values: { line: 'one two three four' } }, { label: 'only two words', values: { line: 'only two' } }],
    steps: function (v) {
      var w = wordSpans(v.line), st = [{ line: 2, w: -1, cap: 'The program asks. The user types a line and presses Enter.', out: 'Enter three words separated by spaces: ' + v.line }];
      for (var i = 0; i < 3; i++) {
        if (i < w.length) st.push({ line: 3 + i, w: i, cap: '<code>input.next()</code> skips the spaces, then reads up to the next space (or the end): <b>' + h(w[i].t) + '</b> goes into s' + (i + 1) + '.' });
        else { st.push({ line: 3 + i, w: i, wait: true, cap: 'No word is left on the line, so <code>next()</code> <b>waits</b> until the user types more. The program cannot go on before that.' }); return st; }
      }
      st.push({ line: '6-8', w: 3, cap: 'Print the three words. The spaces are never part of a word.' + (w.length > 3 ? ' The 4th word is still waiting, unread.' : ''), out: ['s1 is ' + w[0].t, 's2 is ' + w[1].t, 's3 is ' + w[2].t] });
      return st;
    },
    draw: function (k, s, v) {
      var line = v.line, w = wordSpans(line), cw = cwFor(Math.max(line.length, 1), 520, 26), items = [];
      items.push(lbl('l', 20, 34, 'the typed line'));
      items.push(cells('c', 20, 62, line, { cw: cw, tone: function (j) { for (var i = 0; i < w.length; i++) if (j >= w[i].at && j < w[i].at + w[i].t.length) return i === s.w ? 'accent' : i < s.w ? 'teal' : 'muted'; return 'muted'; } }));
      for (var i = 0; i < 3; i++) {
        var got = i < w.length && (s.w > i || (s.w === i && !s.wait));
        items.push(vbox('s' + i, 20 + i * 180, 214, 160, 's' + (i + 1), 'String', got ? jstr(w[i].t) : null, s.w === i ? (s.wait ? { tone: 'red', dash: true, hi: true, title: 'waiting…' } : hot()) : {}));
      }
      if (s.w >= 0 && s.w < 3 && !s.wait) items.push(A('rd', 20 + (w[s.w].at + w[s.w].t.length / 2) * cw, 104, 100 + s.w * 180, 192, { tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 11. reading a character (slide 20) ---------- */
  var READC = 'Scanner input = new Scanner(System.in);\nSystem.out.print("Enter a character: ");\nString s = input.nextLine();\nchar ch = s.charAt(0);\nSystem.out.println("The character entered is " + ch);';
  var readch = {
    id: 'readch', slides: [20, 20], title: 'Read a line, then take its first character', code: READC,
    inputs: [{ id: 'line', type: 'text', label: 'the user types', value: 'Java', maxlen: 20 }],
    presets: [{ label: 'Java', values: { line: 'Java' } }, { label: 'x', values: { line: 'x' } }, { label: '"  hi there"', values: { line: '  hi there' } }, { label: 'just Enter', values: { line: '' } }],
    steps: function (v) {
      var L = v.line, st = [
        { line: 2, cap: 'Ask for a character. The user types and presses Enter.', out: 'Enter a character: ' + L },
        { line: 3, cap: '<code>nextLine()</code> reads the <b>whole line</b>, spaces included, up to Enter: s is ' + h(jstr(L)) + '.' }
      ];
      if (!L.length) { st.push({ line: 4, cap: 'The line is empty, so there is no index 0. <code>charAt(0)</code> throws an error and the program stops.', out: 'Exception in thread "main" java.lang.StringIndexOutOfBoundsException' }); return st; }
      st.push({ line: 4, cap: 'Scanner has no method that reads one char, so take <code>s.charAt(0)</code>, the first character: ' + h(jch(L[0])) + (L[0] === ' ' ? '. Careful: it is a space, because nextLine keeps the spaces.' : '.') });
      st.push({ line: 5, cap: 'Print it.' + (L.length > 1 ? ' The other characters of the line are not used.' : ''), out: 'The character entered is ' + L[0] });
      return st;
    },
    draw: function (k, s, v) {
      var L = v.line, cw = cwFor(Math.max(L.length, 1), 520, 26), items = [];
      items.push(lbl('l', 20, 34, 'the typed line'));
      items.push(cells('c', 20, 62, L, { cw: cw, tone: function (j) { return k >= 2 && j === 0 ? 'accent' : k >= 1 ? 'teal' : 'muted'; } }));
      if (k >= 1) items.push(vbox('s', 20, 170, 330, 's', 'String', jstr(L), k === 1 ? hot() : {}));
      if (k >= 2) {
        if (s.out && !L.length) items.push(vbox('ch', 390, 170, 150, 'ch', 'char', null, { tone: 'red', dash: true, title: 'error', hi: true }));
        else {
          items.push(vbox('ch', 390, 170, 150, 'ch', 'char', jch(L[0]), k === 2 ? hot() : {}));
          items.push(A('ar', 20 + cw / 2, 104, 440, 150, { tone: 'accent', label: 'charAt(0)' }));
        }
      }
      return items;
    }
  };

  /* ---------- 12. comparing strings (slide 21) ---------- */
  function jcmp(a, b) { var m = Math.min(a.length, b.length); for (var i = 0; i < m; i++) if (a.charCodeAt(i) !== b.charCodeAt(i)) return { v: a.charCodeAt(i) - b.charCodeAt(i), at: i }; return { v: a.length - b.length, at: m }; }
  function fold(s) { return s.split('').map(function (c) { var u = c.toUpperCase(); u = u.length === 1 ? u : c; var l = u.toLowerCase(); return l.length === 1 ? l : u; }).join(''); }
  var CMPM = ['equals', 'equalsIgnoreCase', 'compareTo', 'compareToIgnoreCase', 'startsWith', 'endsWith'];
  function cmpRes(i, a, b) {
    return i === 0 ? tf(a === b) : i === 1 ? tf(fold(a) === fold(b)) : i === 2 ? String(jcmp(a, b).v) : i === 3 ? String(jcmp(fold(a), fold(b)).v) :
      i === 4 ? tf(a.indexOf(b) === 0) : tf(a.length >= b.length && a.slice(a.length - b.length) === b);
  }
  var compare = {
    id: 'compare', slides: [21, 21], title: 'Comparing two strings',
    inputs: [{ id: 'a', type: 'text', label: 's1', value: 'Chicago', maxlen: 14 }, { id: 'b', type: 'text', label: 's2', value: 'Atlanta', maxlen: 14 }],
    presets: [{ label: 'Chicago, Atlanta', values: { a: 'Chicago', b: 'Atlanta' } }, { label: 'Java, java', values: { a: 'Java', b: 'java' } }, { label: 'Welcome, Welcome to', values: { a: 'Welcome', b: 'Welcome to' } }, { label: 'Welcome to Java, Java', values: { a: 'Welcome to Java', b: 'Java' } }, { label: 'the same', values: { a: 'Java', b: 'Java' } }],
    code: function (v) { return 'String s1 = ' + jstr(v.a) + ', s2 = ' + jstr(v.b) + ';\n' + CMPM.map(function (m) { return 'System.out.println(s1.' + m + '(s2));'; }).join('\n') + '\nif (s1.compareTo(s2) < 0)\n  System.out.println(s1 + " " + s2);\nelse\n  System.out.println(s2 + " " + s1);'; },
    steps: function (v) {
      var a = v.a, b = v.b, st = [];
      function cmpCap(x, y, ic) {
        var c = jcmp(x, y), m = Math.min(x.length, y.length), t;
        if (c.at < m) t = 'Compare index by index. The first difference is at index ' + c.at + ': ' + h(jch(x[c.at])) + ' (code ' + x.charCodeAt(c.at) + ') and ' + h(jch(y[c.at])) + ' (code ' + y.charCodeAt(c.at) + '). ' + x.charCodeAt(c.at) + ' − ' + y.charCodeAt(c.at) + ' = <b>' + c.v + '</b>.';
        else if (!c.v) t = 'Every character is the same' + (ic ? ' (ignoring case)' : '') + ', so the result is <b>0</b>.';
        else t = 'No difference until one string ends. Then the result is the difference of the lengths: ' + x.length + ' − ' + y.length + ' = <b>' + c.v + '</b>.';
        return t + (c.v < 0 ? ' Negative: s1 comes <b>before</b> s2.' : c.v > 0 ? ' Positive: s1 comes <b>after</b> s2.' : '');
      }
      var caps = [
        'Are the strings equal: the same characters, in the same places? <b>' + cmpRes(0, a, b) + '</b>.',
        'The same test, but a capital and a small letter count as equal: <b>' + cmpRes(1, a, b) + '</b>.',
        cmpCap(a, b, false),
        'Like compareTo, but every letter is first made the same case. ' + cmpCap(fold(a), fold(b), true),
        'Does s1 <b>start</b> with s2? <b>' + cmpRes(4, a, b) + '</b>.',
        'Does s1 <b>end</b> with s2? <b>' + cmpRes(5, a, b) + '</b>.'
      ];
      CMPM.forEach(function (m, i) { st.push({ line: i + 2, m: i, cap: caps[i], out: cmpRes(i, a, b) }); });
      var first = jcmp(a, b).v < 0;
      st.push({ line: '8-11', m: 6, cap: 'This is how the OrderTwoCities program puts two names in alphabetical order: if <code>s1.compareTo(s2) < 0</code>, s1 comes first.', out: first ? a + ' ' + b : b + ' ' + a });
      return st;
    },
    draw: function (k, s, v) {
      var a = v.a, b = v.b, m = s.m, cw = cwFor(Math.max(a.length, b.length, 1), 470, 30), items = [];
      var c = m === 3 ? jcmp(fold(a), fold(b)) : jcmp(a, b), off = a.length - b.length;
      function tone(row, j) {
        var x = row ? b : a, y = row ? a : b;
        if (m === 0) return x[j] === y[j] ? 'teal' : 'red';
        if (m === 1) return y[j] != null && fold(x[j]) === fold(y[j]) ? 'teal' : 'red';
        if (m === 2 || m === 3) return j < c.at ? 'teal' : j === c.at ? 'accent' : 'muted';
        if (m === 4) return j < b.length ? (a[j] === b[j] ? 'teal' : 'red') : 'muted';
        if (m === 5) { if (row) return a[j + off] === b[j] ? 'teal' : 'red'; return j >= off ? (a[j] === b[j - off] ? 'teal' : 'red') : 'muted'; }
        return 'muted';
      }
      items.push(T('na', 20, 82, 's1', { mono: true, bold: true, size: 15 }), T('nb', 20, 156, 's2', { mono: true, bold: true, size: 15 }));
      items.push(cells('a', 70, 58, a, { cw: cw, tone: function (j) { return tone(0, j); } }));
      items.push(cells('b', 70, 132, b, { cw: cw, tone: function (j) { return tone(1, j); } }));
      if (m < 6) {
        var r = cmpRes(m, a, b);
        items.push(B('res', 130, 226, 300, 60, { tag: 's1.' + CMPM[m] + '(s2)', title: r, mono: true, size: 22, tone: r === 'true' ? 'teal' : r === 'false' ? 'red' : 'blue', hi: true }));
      } else {
        var f = jcmp(a, b).v < 0;
        items.push(T('ord', 280, 250, 'in order:  ' + (f ? a + '  ' + b : b + '  ' + a), { anchor: 'middle', mono: true, bold: true, size: 17, tone: 'accent' }));
      }
      return items;
    }
  };

  /* ---------- 13. substring (slide 22) ---------- */
  var ERR_IDX = 'Exception in thread "main" java.lang.StringIndexOutOfBoundsException';
  var substr = {
    id: 'substr', slides: [22, 22], title: 'substring: the end index is not included',
    inputs: [{ id: 's', type: 'text', label: 'message', value: MSG, maxlen: 18 }, { id: 'b', label: 'beginIndex', value: 0, min: -2, max: 20 }, { id: 'e', label: 'endIndex', value: 11, min: -2, max: 20 }],
    presets: [{ label: 'Slide (0, 11)', values: { s: MSG, b: 0, e: 11 } }, { label: '(8, 10)', values: { s: MSG, b: 8, e: 10 } }, { label: '(3, 3)', values: { s: MSG, b: 3, e: 3 } }, { label: '"Java" (0, 4)', values: { s: 'Java', b: 0, e: 4 } }, { label: 'end too big', values: { s: 'Java', b: 1, e: 6 } }, { label: 'begin > end', values: { s: MSG, b: 5, e: 2 } }],
    code: function (v) { var b = Math.trunc(v.b), e = Math.trunc(v.e); return 'String message = ' + jstr(v.s) + ';\nString part1 = message.substring(' + b + ', ' + e + ');\nString part2 = message.substring(' + e + ');\nSystem.out.println("[" + part1 + "]");\nSystem.out.println("[" + part2 + "]");'; },
    steps: function (v) {
      var s = v.s, n = s.length, b = Math.trunc(v.b), e = Math.trunc(v.e);
      var st = [{ line: 1, cap: n ? 'The indexes of message go from 0 to ' + (n - 1) + ' (its length is ' + n + ').' : 'message is the empty string: it has no indexes.' }];
      if (!(b >= 0 && b <= e && e <= n)) {
        st.push({ line: 2, bad: true, cap: 'This call is not allowed. It needs 0 <= beginIndex <= endIndex <= length(), but here ' + (b < 0 ? 'beginIndex is negative' : b > e ? 'beginIndex is bigger than endIndex' : 'endIndex is bigger than the length, ' + n) + '. substring throws an error and the program stops.', out: ERR_IDX });
        return st;
      }
      st.push({ line: 2, cap: b === e ? '<code>substring(' + b + ', ' + e + ')</code>: begin and end are the same, so no character is taken: the <b>empty string</b> "".' : '<code>substring(' + b + ', ' + e + ')</code> starts at index ' + b + ' and stops <b>before</b> index ' + e + ': indexes ' + b + ' to ' + (e - 1) + ', so ' + (e - b) + ' characters (end − begin).' });
      st.push({ line: 3, cap: e === n ? '<code>substring(' + e + ')</code>: ' + e + ' is the length, so nothing is left: "".' : '<code>substring(' + e + ')</code> goes from index ' + e + ' to the <b>end</b> of the string.' });
      st.push({ line: '4-5', cap: 'The brackets show each part exactly. part1 and part2 together are the string from index ' + b + ' to the end.', out: ['[' + s.slice(b, e) + ']', '[' + s.slice(e) + ']'] });
      return st;
    },
    draw: function (k, s, v) {
      var str = v.s, n = str.length, b = Math.trunc(v.b), e = Math.trunc(v.e), cw = cwFor(Math.max(n, 1), 520, 32), items = [];
      var lo = k === 1 ? b : k === 2 ? e : -1, hi = k === 1 ? e : k === 2 ? n : -1;
      items.push(cells('c', 20, 70, str, { cw: cw, tone: function (j) { return j >= lo && j < hi ? (k === 1 ? 'accent' : 'teal') : 'muted'; } }));
      if (s.bad) { items.push(T('err', 280, 170, 'StringIndexOutOfBoundsException', { anchor: 'middle', bold: true, tone: 'red', size: 15 })); return items; }
      if ((k === 1 || k === 2) && hi > lo) {
        var xs = 20 + lo * cw + 3, xe = 20 + hi * cw - 5;
        items.push(A('br', xs, 112, xe, 112, { head: false, tone: k === 1 ? 'accent' : 'teal', via: [[xs, 126], [xe, 126]] }));
        items.push(T('bl', Math.min(Math.max((xs + xe) / 2, 100), 460), 150, k === 1 ? 'substring(' + b + ', ' + e + ')' : 'substring(' + e + ')', { anchor: 'middle', mono: true, bold: true, size: 14, tone: k === 1 ? 'accent' : 'teal' }));
      }
      if (k === 1 && e < n) {
        items.push(B('ex', 20 + e * cw, 70, cw - 2, 36, { fill: 'clear', tone: 'red', dash: true }));
        items.push(T('nx', Math.min(Math.max(20 + e * cw + cw / 2, 90), 470), 176, 'index ' + e + ' is not included', { anchor: 'middle', size: 12.5, tone: 'red', bold: true }));
      }
      var cw2 = cwFor(Math.max(n, 1), 440, 28);
      if (k >= 1) { items.push(T('n1', 20, 232, 'part1', { mono: true, bold: true, size: 14 })); items.push(cells('p', 90, 208, str.slice(b, e), { cw: cw2, idx: false, emptyTone: 'accent', tone: function () { return 'accent'; } })); }
      if (k >= 2) { items.push(T('n2', 20, 296, 'part2', { mono: true, bold: true, size: 14 })); items.push(cells('q', 90, 272, str.slice(e), { cw: cw2, idx: false, emptyTone: 'teal', tone: function () { return 'teal'; } })); }
      return items;
    }
  };

  /* ---------- 14. indexOf, lastIndexOf and splitting a name (slides 23-24) ---------- */
  var findsub = {
    id: 'findsub', slides: [23, 24], title: 'Finding a character, then splitting a name',
    inputs: [{ id: 's', type: 'text', label: 's', value: 'Kim Jones', maxlen: 18 }, { id: 'f', type: 'text', label: 'find', value: ' ', minlen: 1, maxlen: 4 }],
    presets: [{ label: '"Kim Jones", space', values: { s: 'Kim Jones', f: ' ' } }, { label: "\"Welcome to Java\", 'o'", values: { s: MSG, f: 'o' } }, { label: '"banana", "an"', values: { s: 'banana', f: 'an' } }, { label: '"Ana Maria Lopez", space', values: { s: 'Ana Maria Lopez', f: ' ' } }, { label: '"Madonna" (no space)', values: { s: 'Madonna', f: ' ' } }],
    code: function (v) { var f = v.f.length === 1 ? jch(v.f) : jstr(v.f); return 'String s = ' + jstr(v.s) + ';\nint first = s.indexOf(' + f + ');\nint next = s.indexOf(' + f + ', first + 1);\nint last = s.lastIndexOf(' + f + ');\nint k = s.indexOf(\' \');\nString firstName = s.substring(0, k);\nString lastName = s.substring(k + 1);'; },
    steps: function (v) {
      var s = v.s, f = v.f, fl = h(f.length === 1 ? jch(f) : jstr(f)), first = s.indexOf(f), next = s.indexOf(f, first + 1), last = s.lastIndexOf(f), k = s.indexOf(' ');
      var st = [
        { line: 2, slide: 23, cap: '<code>indexOf(' + fl + ')</code> searches from the start and returns the index of the <b>first</b> match' + (first < 0 ? '. There is none, so it returns <b>-1</b>.' : ': <b>' + first + '</b>.') },
        { line: 3, slide: 23, cap: 'With a second number, the search starts from that index. <code>indexOf(' + fl + ', first + 1)</code> looks after the first match: ' + (next < 0 ? '<b>-1</b>, no other match.' : '<b>' + next + '</b>.') },
        { line: 4, slide: 23, cap: '<code>lastIndexOf(' + fl + ')</code> searches from the end, so it finds the <b>last</b> match: <b>' + last + '</b>.' },
        { line: 5, slide: 24, cap: 'Now split a full name. <code>k = s.indexOf(\' \')</code> is the index of the first space: <b>' + k + '</b>.' }
      ];
      if (k < 0) { st.push({ line: 6, slide: 24, bad: true, cap: 'There is no space, so k is -1, and <code>substring(0, -1)</code> is not allowed: the program stops with an error. A careful program checks that k is not -1 first.', out: ERR_IDX }); return st; }
      st.push({ line: 6, slide: 24, cap: '<code>s.substring(0, k)</code> is everything <b>before</b> the space: ' + h(jstr(s.slice(0, k))) + '.' });
      st.push({ line: 7, slide: 24, cap: '<code>s.substring(k + 1)</code> skips the space and takes the rest: ' + h(jstr(s.slice(k + 1))) + '.' + (s.indexOf(' ', k + 1) >= 0 ? ' The name has two spaces, so the rest still contains one.' : '') });
      return st;
    },
    draw: function (k, s, v) {
      var str = v.s, f = v.f, n = str.length, cw = cwFor(Math.max(n, 1), 520, 32), first = str.indexOf(f), next = str.indexOf(f, first + 1), last = str.lastIndexOf(f), sp = str.indexOf(' '), items = [];
      var at = k === 0 ? first : k === 1 ? next : k === 2 ? last : -1;
      items.push(cells('c', 20, 70, str, { cw: cw, tone: function (j) {
        if (k <= 2) return at >= 0 && j >= at && j < at + f.length ? 'accent' : 'muted';
        if (j === sp) return 'accent';
        if (k >= 4 && sp >= 0 && j < sp) return 'teal';
        if (k >= 5 && sp >= 0 && j > sp) return 'blue';
        return 'muted';
      } }));
      var pt = k <= 2 ? at : sp;
      if (pt >= 0) items.push(P('p', 20 + pt * cw + cw / 2 - 1, 112, String(pt), { dir: 'up' }));
      else items.push(T('none', 280, 150, k <= 2 ? 'no match: -1' : 'no space: k = -1', { anchor: 'middle', bold: true, tone: 'red', size: 15 }));
      if (k <= 2) {
        [['first', first], ['next', next], ['last', last]].forEach(function (p, i) { if (i <= k) items.push(vbox('v' + i, 20 + i * 180, 220, 160, p[0], 'int', p[1], i === k ? hot() : {})); });
      } else {
        items.push(vbox('vk', 20, 220, 110, 'k', 'int', sp, k === 3 ? hot() : {}));
        if (k >= 4) items.push(vbox('vf', 150, 220, 190, 'firstName', 'String', s.bad ? null : jstr(str.slice(0, sp)), s.bad ? { tone: 'red', dash: true, title: 'error', hi: true } : { size: 14, tone: 'teal', hi: k === 4 }));
        if (k >= 5) items.push(vbox('vl', 360, 220, 180, 'lastName', 'String', jstr(str.slice(sp + 1)), { size: 14, tone: 'blue', hi: true }));
      }
      return items;
    }
  };

  /* ---------- 15. strings and numbers (slide 25) ---------- */
  function jParseInt(t) { if (!/^[+-]?\d+$/.test(t)) return null; var n = Number(t); return n < -2147483648 || n > 2147483647 ? null : n; }
  function jParseDouble(t) { var x = jtrim(t); if (!/^[+-]?(NaN|Infinity|(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?[fFdD]?)$/.test(x)) return null; return Number(x.replace(/[fFdD]$/, '')); }
  function nfe(t, dbl) { return 'Exception in thread "main" java.lang.NumberFormatException: ' + (dbl && !jtrim(t) ? 'empty String' : 'For input string: "' + t + '"'); }
  var parse = {
    id: 'parse', slides: [25, 25], title: 'From text to a number, and back',
    inputs: [{ id: 'is', type: 'text', label: 'intString', value: '123', maxlen: 12 }, { id: 'ds', type: 'text', label: 'doubleString', value: '3.5', maxlen: 12 }, { id: 'num', label: 'number', value: 42, min: -9999, max: 99999 }],
    presets: [{ label: '"123" and "3.5"', values: { is: '123', ds: '3.5', num: 42 } }, { label: '"-7" and "2e3"', values: { is: '-7', ds: '2e3', num: 0 } }, { label: '"12a"', values: { is: '12a', ds: '3.5', num: 42 } }, { label: '" 5" (a space)', values: { is: ' 5', ds: '5', num: 7 } }, { label: '"3.5" as an int', values: { is: '3.5', ds: '3.5', num: 42 } }],
    code: function (v) { return 'String intString = ' + jstr(v.is) + ';\nString doubleString = ' + jstr(v.ds) + ';\nint intValue = Integer.parseInt(intString);\ndouble doubleValue = Double.parseDouble(doubleString);\nint number = ' + Math.trunc(v.num) + ';\nString s = number + "";'; },
    steps: function (v) {
      var iv = jParseInt(v.is), dv = jParseDouble(v.ds), n = Math.trunc(v.num);
      var st = [{ line: '1-2', cap: 'These are <b>strings</b>: text that only looks like numbers. You cannot do math with them: <code>intString + 1</code> would be ' + h(jstr(v.is + '1')) + ', not a sum.' }];
      if (iv == null) { st.push({ line: 3, cap: h(jstr(v.is)) + ' is not an int written with digits only' + (/\s/.test(v.is) ? ' (a space counts as a wrong character)' : /\./.test(v.is) ? ' (an int has no decimal point)' : '') + ', so <code>Integer.parseInt</code> throws an error and the program stops.', out: nfe(v.is) }); return st; }
      st.push({ line: 3, cap: '<code>Integer.parseInt</code> turns the text into the int <b>' + iv + '</b>. Now math works: intValue + 1 is ' + (iv + 1) + '.' });
      if (dv == null) { st.push({ line: 4, cap: h(jstr(v.ds)) + ' is not a number, so <code>Double.parseDouble</code> throws an error and the program stops.', out: nfe(v.ds, true) }); return st; }
      st.push({ line: 4, cap: '<code>Double.parseDouble</code> turns the text into the double <b>' + jd(dv) + '</b>.' });
      st.push({ line: '5-6', cap: 'The other way: <code>number + ""</code> joins the number with an empty string, so the result is the text ' + h(jstr(String(n))) + '.' });
      return st;
    },
    draw: function (k, s, v) {
      var iv = jParseInt(v.is), dv = jParseDouble(v.ds), n = Math.trunc(v.num), items = [];
      function row(p, y, str, name, show, val, type) {
        var cw = cwFor(Math.max(str.length, 1), 220, 26), err = show && val == null;
        items.push(lbl(p + 'l', 20, y - 12, 'String ' + name, { mono: true, tone: 'ink' }));
        items.push(cells(p, 20, y, str, { cw: cw, idx: false, tone: function () { return show ? 'blue' : 'muted'; } }));
        if (show) {
          items.push(A(p + 'a', 276, y + 18, 344, y + 18, { tone: err ? 'red' : 'accent', label: type === 'int' ? 'parseInt' : 'parseDouble' }));
          items.push(B(p + 'v', 350, y - 4, 190, 44, { tag: type, title: err ? 'error' : type === 'int' ? String(val) : jd(val), mono: true, size: 18, tone: err ? 'red' : 'teal', hi: true }));
        }
      }
      row('i', 50, v.is, 'intString', k >= 1, iv, 'int');
      if (k >= 2 || iv != null) row('d', 150, v.ds, 'doubleString', k >= 2, dv, 'double');
      if (k >= 3) {
        var t = String(n), cw = cwFor(t.length, 200, 26);
        items.push(B('nv', 20, 250, 150, 44, { tag: 'int number', title: t, mono: true, size: 18, tone: 'teal' }));
        items.push(A('na', 176, 272, 250, 272, { tone: 'accent', label: '+ ""' }));
        items.push(lbl('nl', 260, 238, 'String s', { mono: true, tone: 'ink' }));
        items.push(cells('n', 260, 254, t, { cw: cw, idx: false, tone: function () { return 'accent'; } }));
      }
      return items;
    }
  };

  /* ---------- 16. the Math class (slides 27-28) ---------- */
  var MG = [['Trigonometric', 'sin  cos  tan  asin  acos  atan'], ['Exponent', 'exp  log  log10  pow  sqrt'], ['Rounding', 'ceil  floor  rint  round'], ['min, max, abs, random', 'min  max  abs  random']];
  var mathcls = {
    id: 'mathcls', slides: [27, 28], title: 'What is inside the Math class',
    steps: [
      { slide: 27, cap: '<b>Math</b> is a class that comes with Java. You do not make it; you use it with its name: <code>Math.something</code>.' },
      { slide: 28, cap: 'Two <b>class constants</b>: <code>Math.PI</code> (π) and <code>Math.E</code> (e, the base of natural logarithms).' },
      { slide: 28, cap: '<b>Trigonometric</b> methods work with angles, given in radians.' },
      { slide: 28, cap: '<b>Exponent</b> methods: powers, square roots and logarithms.' },
      { slide: 28, cap: '<b>Rounding</b> methods: up, down, and to the nearest integer.' },
      { slide: 28, cap: 'And <b>min</b>, <b>max</b>, <b>abs</b> and <b>random</b>.' }
    ],
    draw: function (k) {
      var items = [B('m', 20, 110, 200, boxH(3), { title: 'Math', band: true, mono: true, lsize: 11, lines: [{ t: 'PI = 3.141592653589793', b: k === 1 }, { t: 'E  = 2.718281828459045', b: k === 1 }, { t: '+ methods' }], tone: k <= 1 ? 'accent' : 'blue', hi: k <= 1 })];
      MG.forEach(function (g, i) {
        var y = 30 + i * 74, on = k - 2 === i;
        items.push(B('g' + i, 250, y, 290, boxH(1), { title: g[0], lines: [g[1]], mono: true, lsize: 12, tone: on ? 'accent' : 'muted', hi: on }));
        items.push(A('ga' + i, 222, 150 + i * 10, 246, y + 29, { tone: on ? 'accent' : 'muted', head: false }));
      });
      return items;
    }
  };

  /* ---------- 17. trigonometric methods (slide 29) ---------- */
  var trig = {
    id: 'trig', slides: [29, 29], title: 'sin, cos and tan on a circle',
    inputs: [{ id: 'deg', label: 'angle in degrees', value: 30, min: -360, max: 360 }],
    presets: [{ label: '30°', values: { deg: 30 } }, { label: '0°', values: { deg: 0 } }, { label: '45°', values: { deg: 45 } }, { label: '90°', values: { deg: 90 } }, { label: '180°', values: { deg: 180 } }, { label: '-60°', values: { deg: -60 } }],
    code: function (v) { return 'double radians = ' + v.deg + ' * Math.PI / 180;\ndouble s = Math.sin(radians);\ndouble c = Math.cos(radians);\ndouble t = Math.tan(radians);\ndouble a = Math.acos(c);'; },
    steps: function (v) {
      var r = v.deg * Math.PI / 180, sn = Math.sin(r), cs = Math.cos(r), tn = Math.tan(r), ac = Math.acos(cs);
      return [
        { line: 1, cap: 'sin, cos and tan take the angle in <b>radians</b>, not degrees. One degree is π/180 radians, so ' + v.deg + '° is ≈ ' + fmt4(r) + ' radians.' },
        { line: 2, cap: '<code>Math.sin(radians)</code> is the <b>height</b> of the point on the circle: ≈ ' + fmt4(sn) + '.' + (v.deg === 30 ? ' (The slide says 0.5. Java really prints 0.49999999999999994, because π is not stored exactly.)' : v.deg === 180 ? ' Java prints 1.2246467991473532E-16: a tiny number instead of 0, because π is not stored exactly.' : '') },
        { line: 3, cap: '<code>Math.cos(radians)</code> is the <b>left-right</b> position of the point: ≈ ' + fmt4(cs) + '.' + (v.deg === 90 ? ' Java prints 6.123233995736766E-17: practically 0 (the slide writes 0).' : '') },
        { line: 4, cap: Math.abs(cs) < 1e-12 ? 'tan is sin / cos. Here cos is (almost) 0, so tan has no real value; Java gives a huge number: ≈ ' + jexp(tn, 3) + '.' : '<code>Math.tan(radians)</code> is sin / cos: ≈ ' + fmt4(tn) + '.' },
        { line: 5, cap: '<code>acos</code>, <code>asin</code> and <code>atan</code> go the other way: from a value back to an angle in radians. <code>Math.acos(c)</code> ≈ ' + fmt4(ac) + ' radians = ' + fmt4(ac * 180 / Math.PI) + '°' + (v.deg < 0 || v.deg > 180 ? ' (acos always gives an angle from 0° to 180°).' : '.') }
      ];
    },
    draw: function (k, s, v) {
      var r = v.deg * Math.PI / 180, sn = Math.sin(r), cs = Math.cos(r), tn = Math.tan(r), cx = 150, cy = 170, R = 120, px = cx + R * cs, py = cy - R * sn, items = [];
      items.push(B('circ', cx - R, cy - R, 2 * R, 2 * R, { shape: 'oval', fill: 'none', tone: 'muted', z: 0 }));
      items.push(A('ax', 20, cy, 280, cy, { head: false, tone: 'muted' }), A('ay', cx, 40, cx, 300, { head: false, tone: 'muted' }));
      items.push(A('rad', cx, cy, px, py, { head: false, tone: 'accent' }));
      if (k === 2 || k === 3) items.push(A('cs', cx, cy, px, cy, { head: false, tone: 'blue' }));
      if (k === 1 || k === 3) items.push(A('sn', px, cy, px, py, { head: false, tone: 'teal' }));
      items.push(B('pt', px - 6, py - 6, 12, 12, { shape: 'oval', fill: 'solid', tone: 'accent' }));
      /* the angle label: inside the swept angle, as far as possible from the ray and the axes */
      var best = 0, bd = -1;
      for (var a = Math.min(0, v.deg); a <= Math.max(0, v.deg); a += 5) { var dd = Math.min(Math.abs(a), Math.abs(a - v.deg), Math.abs(a - 90 * Math.round(a / 90))); if (dd > bd) { bd = dd; best = a; } }
      if (bd < 14) best = v.deg >= 0 ? -22 : 22;
      items.push(T('ang', cx + 44 * Math.cos(best * Math.PI / 180), cy - 44 * Math.sin(best * Math.PI / 180) + 4, v.deg + '°', { anchor: 'middle', mono: true, size: 13, bold: true, tone: 'accent' }));
      var rows = [['degrees', String(v.deg)], ['radians', '≈ ' + fmt4(r)], ['sin', '≈ ' + fmt4(sn)], ['cos', '≈ ' + fmt4(cs)], ['tan', Math.abs(cs) < 1e-12 ? 'huge' : '≈ ' + fmt4(tn)], ['acos(c)', '≈ ' + fmt4(Math.acos(cs))]];
      rows.forEach(function (row, i) {
        if (i > k + 1) return;
        var cur = i === k + 1;
        items.push(T('v' + i, 320, 70 + i * 40, row[0] + ' = ' + row[1], { mono: true, size: 15, bold: cur, tone: cur ? (i === 2 ? 'teal' : i === 3 ? 'blue' : 'accent') : 'ink' }));
      });
      return items;
    }
  };

  /* ---------- 18. exponent methods (slide 30) ---------- */
  var EM = [['exp', 'Math.exp(a)'], ['log', 'Math.log(a)'], ['log10', 'Math.log10(a)'], ['pow', 'Math.pow(a, b)'], ['sqrt', 'Math.sqrt(a)']];
  function emVal(i, a, b) { return [Math.exp(a), Math.log(a), Math.log10(a), Math.pow(a, b), Math.sqrt(a)][i]; }
  var expo = {
    id: 'expo', slides: [30, 30], title: 'Powers, roots and logarithms',
    inputs: [{ id: 'a', label: 'a', value: 2, min: -100, max: 100 }, { id: 'b', label: 'b', value: 3, min: -10, max: 10 }],
    presets: [{ label: 'a=2, b=3', values: { a: 2, b: 3 } }, { label: 'a=3, b=2', values: { a: 3, b: 2 } }, { label: 'a=3.5, b=2.5', values: { a: 3.5, b: 2.5 } }, { label: 'a=4, b=0.5', values: { a: 4, b: 0.5 } }, { label: 'a=-4', values: { a: -4, b: 2 } }, { label: 'a=0, b=0', values: { a: 0, b: 0 } }],
    code: function (v) { return 'double a = ' + v.a + ', b = ' + v.b + ';\n' + EM.map(function (m) { return 'System.out.println(' + m[1] + ');'; }).join('\n'); },
    steps: function (v) {
      var a = v.a, b = v.b;
      var caps = [
        '<code>Math.exp(a)</code> is e (≈ 2.718) raised to the power of a.',
        '<code>Math.log(a)</code> is the <b>natural</b> logarithm: the power of e that gives a.' + (a < 0 ? ' a is negative, so there is no answer: NaN (“not a number”).' : a === 0 ? ' log(0) has no finite answer: -Infinity.' : ''),
        '<code>Math.log10(a)</code>: the power of <b>10</b> that gives a.' + (a < 0 ? ' a is negative: NaN.' : a === 0 ? ' log10(0) is -Infinity.' : ''),
        '<code>Math.pow(a, b)</code> is a raised to the power of b' + (Number.isInteger(b) && b >= 1 && b <= 5 ? ': ' + new Array(b).fill(String(a)).join(' × ') + '.' : b === 0 ? ': anything to the power 0 is 1.' : b === 0.5 ? ': the power 0.5 is the same as the square root.' : '.') + ' The result is always a double.',
        '<code>Math.sqrt(a)</code> is the square root of a.' + (a < 0 ? ' A negative number has no real square root: NaN.' : '')
      ];
      return EM.map(function (m, i) { var r = jd(emVal(i, a, b)); return { line: i + 2, cap: caps[i] + ' Printed: <b>' + r + '</b>', out: r }; });
    },
    draw: function (k, s, v) {
      var items = [];
      EM.forEach(function (m, i) {
        var y = 20 + i * 62, cur = i === k, r = emVal(i, v.a, v.b);
        items.push(B('m' + i, 20, y, 300, 46, { title: m[1].replace(/\ba\b/, v.a).replace(/\bb\b/, v.b), mono: true, size: 15, tone: cur ? 'accent' : 'muted', hi: cur }));
        if (i <= k) items.push(B('r' + i, 340, y, 200, 46, { title: jd(r), mono: true, size: jd(r).length > 16 ? 13 : 15, tone: isNaN(r) || !isFinite(r) ? 'red' : 'teal', hi: cur }));
      });
      return items;
    }
  };

  /* ---------- 19. rounding (slides 31-32) ---------- */
  function rint(x) { if (!isFinite(x)) return x; var r = Math.round(x); if (Math.abs(x % 1) === 0.5) r = 2 * Math.round(x / 2); return r === 0 && x < 0 ? -0 : r; }
  var rounding = {
    id: 'rounding', slides: [31, 32], title: 'ceil, floor, rint and round on a number line',
    inputs: [{ id: 'x', label: 'x', value: 2.1, min: -100, max: 100 }],
    presets: [2.1, -2.1, 2.5, -2.5, 3.5, 2, -2.6].map(function (x) { return { label: jd(x), values: { x: x } }; }),
    code: function (v) { return 'double x = ' + jd(v.x) + ';\nSystem.out.println(Math.ceil(x));\nSystem.out.println(Math.floor(x));\nSystem.out.println(Math.rint(x));\nSystem.out.println(Math.round(x));'; },
    steps: function (v) {
      var x = v.x, c = Math.ceil(x), f = Math.floor(x), ri = rint(x), whole = Number.isInteger(x), half = Math.abs(x % 1) === 0.5;
      return [
        { line: 1, cap: whole ? 'x = ' + jd(x) + ' is already a whole number, so all four methods give ' + x + '.' : 'x = ' + jd(x) + ' is between the integers ' + f + ' and ' + c + '.' },
        { line: 2, cap: '<code>Math.ceil</code> rounds <b>up</b> (to the right on the line): ' + jd(c) + '. The result is a <b>double</b>.' + (x < 0 && !whole ? ' For a negative number, up means closer to 0.' : ''), out: jd(c) },
        { line: 3, cap: '<code>Math.floor</code> rounds <b>down</b> (to the left): ' + jd(f) + '. Also a double.' + (x < 0 && !whole ? ' For a negative number, down means away from 0.' : ''), out: jd(f) },
        { line: 4, cap: '<code>Math.rint</code> goes to the <b>nearest</b> integer' + (half ? '. x is exactly in the middle, so rint picks the <b>even</b> one: ' : ': ') + jd(ri) + '.', out: jd(ri) },
        { line: 5, cap: '<code>Math.round(x)</code> is <code>(long)Math.floor(x + 0.5)</code>: ' + jd(x) + ' + 0.5 = ' + jd(x + 0.5) + ', and floor gives ' + Math.floor(x + 0.5) + '. The result is a <b>long</b>, so it has no “.0”.' + (half ? ' In the middle, round goes <b>up</b>, while rint went to the even one.' : ''), out: String(Math.round(x)) }
      ];
    },
    draw: function (k, s, v) {
      var x = v.x, f = Math.floor(x), L = f - 1, X = function (t) { return 40 + (t - L) * 160; }, items = [];
      items.push(A('line', 30, 180, 530, 180, { head: false, tone: 'muted' }));
      for (var i = 0; i <= 3; i++) {
        items.push(A('tk' + i, X(L + i), 172, X(L + i), 188, { head: false, tone: 'muted' }));
        items.push(T('tl' + i, X(L + i), 210, String(L + i), { anchor: 'middle', mono: true, size: 15, bold: true }));
      }
      items.push(B('pt', X(x) - 7, 173, 14, 14, { shape: 'oval', fill: 'solid', tone: 'accent' }));
      items.push(T('xl', X(x), 160, 'x = ' + jd(x), { anchor: 'middle', mono: true, bold: true, size: 14, tone: 'accent' }));
      var res = [['ceil', jd(Math.ceil(x))], ['floor', jd(f)], ['rint', jd(rint(x))], ['round', String(Math.round(x))]];
      res.forEach(function (r, i) { if (i < k) items.push(T('r' + i, 40 + i * 130, 50, r[0] + ' ' + r[1], { mono: true, size: 14, bold: i === k - 1, tone: i === k - 1 ? 'accent' : 'ink' })); });
      if (k >= 1) {
        var from = k === 4 ? x + 0.5 : x, to = [0, Math.ceil(x), f, rint(x), Math.floor(x + 0.5)][k];
        if (k === 4) {
          items.push(B('pt2', X(from) - 6, 174, 12, 12, { shape: 'oval', fill: 'solid', tone: 'blue' }));
          items.push(T('x2', X(from), 130, 'x + 0.5', { anchor: 'middle', mono: true, size: 12.5, tone: 'blue', bold: true }));
        }
        if (Math.abs(to - from) > 1e-9) items.push(A('mv', X(from), 240, X(to), 240, { tone: k === 4 ? 'blue' : 'teal', label: res[k - 1][0] }));
        items.push(B('to', X(to) - 8, 172, 16, 16, { shape: 'oval', fill: 'none', tone: 'teal', hi: true }));
      }
      return items;
    }
  };

  /* ---------- 20. max, min and abs (slide 33) ---------- */
  function jnum(x) { return Number.isInteger(x) ? String(x) : jd(x); }
  var minmax = {
    id: 'minmax', slides: [33, 33], title: 'max, min and abs',
    inputs: [{ id: 'a', label: 'a', value: 2, min: -100, max: 100 }, { id: 'b', label: 'b', value: 3, min: -100, max: 100 }],
    presets: [{ label: '2, 3', values: { a: 2, b: 3 } }, { label: '2.5, 3', values: { a: 2.5, b: 3 } }, { label: '2.5, 3.6', values: { a: 2.5, b: 3.6 } }, { label: '-2, -2.1', values: { a: -2, b: -2.1 } }, { label: '-7, 4', values: { a: -7, b: 4 } }],
    code: function (v) { var x = jnum(v.a), y = jnum(v.b); return 'System.out.println(Math.max(' + x + ', ' + y + '));\nSystem.out.println(Math.min(' + x + ', ' + y + '));\nSystem.out.println(Math.abs(' + x + '));\nSystem.out.println(Math.abs(' + y + '));'; },
    steps: function (v) {
      var a = v.a, b = v.b, ints = Number.isInteger(a) && Number.isInteger(b), f = function (x, isInt) { return isInt ? String(x) : jd(x); };
      var mx = f(Math.max(a, b), ints), mn = f(Math.min(a, b), ints), aa = f(Math.abs(a), Number.isInteger(a)), ab = f(Math.abs(b), Number.isInteger(b));
      return [
        { line: 1, cap: '<code>Math.max</code> returns the bigger value (the one more to the right): ' + mx + '.' + (ints ? ' Both are int, so the result is an int.' : ' One of them is a double, so the result is a double' + (Number.isInteger(Math.max(a, b)) ? ': ' + mx + ', not ' + Math.max(a, b) : '') + '.'), out: mx },
        { line: 2, cap: '<code>Math.min</code> returns the smaller value: ' + mn + '.', out: mn },
        { line: 3, cap: '<code>Math.abs</code> is the <b>absolute value</b>: the distance from 0, never negative. abs(' + jnum(a) + ') = ' + aa + '.', out: aa },
        { line: 4, cap: 'abs(' + jnum(b) + ') = ' + ab + '.', out: ab }
      ];
    },
    draw: function (k, s, v) {
      var a = v.a, b = v.b, lo = Math.floor(Math.min(a, b, 0)) - 1, hi = Math.ceil(Math.max(a, b, 0)) + 1, X = function (t) { return 40 + (t - lo) * 480 / (hi - lo); }, items = [];
      items.push(A('line', 30, 180, 530, 180, { head: false, tone: 'muted' }));
      [lo, 0, hi].forEach(function (t, i) { if (t !== 0 && Math.abs(X(t) - X(0)) < 30) return; items.push(A('tk' + i, X(t), 172, X(t), 188, { head: false, tone: 'muted' }), T('tl' + i, X(t), 210, String(t), { anchor: 'middle', mono: true, size: 13 })); });
      var big = a >= b ? 'a' : 'b';
      [['a', a, 130], ['b', b, 100]].forEach(function (p) {
        var on = (k === 0 && p[0] === big) || (k === 1 && p[0] !== big) || (k === 2 && p[0] === 'a') || (k === 3 && p[0] === 'b');
        items.push(A('pk' + p[0], X(p[1]), p[2] + 6, X(p[1]), 170, { head: false, tone: 'muted', dash: true }));
        items.push(B('p' + p[0], X(p[1]) - 7, 173, 14, 14, { shape: 'oval', fill: 'solid', tone: on ? 'accent' : 'blue' }));
        /* close values: each label goes to its own side, so the other dashed line does not run through it */
        var oth = p[0] === 'a' ? b : a, close = Math.abs(X(a) - X(b)) < 90, left = p[1] < oth || (p[1] === oth && p[0] === 'a');
        var tw = (p[0] + ' = ' + jnum(p[1])).length * 8.5;
        if (close && left && X(p[1]) - 8 - tw < 4) left = false; else if (close && !left && X(p[1]) + 8 + tw > 556) left = true;
        items.push(T('pl' + p[0], close ? X(p[1]) + (left ? -8 : 8) : X(p[1]), p[2], p[0] + ' = ' + jnum(p[1]), { anchor: close ? (left ? 'end' : 'start') : 'middle', mono: true, bold: on, size: 14, tone: on ? 'accent' : 'ink' }));
      });
      var val = k === 2 ? a : b;
      if (k >= 2 && val !== 0) items.push(A('dist', X(0), 244, X(val), 244, { tone: 'teal', label: 'distance ' + jnum(Math.abs(val)) }));
      var lines = ['Math.max → ' + (big === 'a' ? jnum(a) : jnum(b)), 'Math.min → ' + (big === 'a' ? jnum(b) : jnum(a)), 'Math.abs(a)', 'Math.abs(b)'];
      items.push(T('res', 280, 300, lines[k], { anchor: 'middle', mono: true, bold: true, size: 15, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 21. Math.random (slide 34) ---------- */
  var random = {
    id: 'random', slides: [34, 34], title: 'From Math.random() to a whole number in a range',
    inputs: [{ id: 'a', label: 'a (start)', value: 50, min: -1000, max: 1000 }, { id: 'b', label: 'b (how many)', value: 50, min: 1, max: 1000 }],
    presets: [{ label: '0 to 9', values: { a: 0, b: 10 } }, { label: '50 to 99', values: { a: 50, b: 50 } }, { label: 'a dice: 1 to 6', values: { a: 1, b: 6 } }],
    code: function (v) { return 'double r = Math.random();\nint n = ' + Math.trunc(v.a) + ' + (int)(r * ' + Math.max(1, Math.trunc(v.b)) + ');\nSystem.out.println(n);'; },
    steps: function (v) {
      var a = Math.trunc(v.a), b = Math.max(1, Math.trunc(v.b)), r = Math.random(), rb = r * b, c = Math.floor(rb), n = a + c, base = { r: r };
      return [
        mix(base, { line: 1, cap: '<code>Math.random()</code> gives a random double from 0.0 up to 1.0, but <b>never 1.0</b> itself. This time r = ' + r.toFixed(4) + '…' }),
        mix(base, { line: 2, cap: '<code>r * ' + b + '</code> stretches it: now it is from 0 up to (not including) ' + b + ': ' + rb.toFixed(4) + '…' }),
        mix(base, { line: 2, cap: '<code>(int)</code> cuts off the decimals: ' + c + '. So the possible values are 0, 1, …, ' + (b - 1) + ': exactly ' + b + ' of them.' }),
        mix(base, { line: '2-3', cap: '<code>' + a + ' + </code> moves the range: n = ' + n + '. The smallest possible n is ' + a + ' (when r is 0.0), and the biggest is ' + (a + b - 1) + ' (when r is just under 1).', out: String(n) }),
        mix(base, { line: 2, cap: 'In general, <code>a + Math.random() * b</code> (with no cast) is a random <b>double</b> from a up to a + b, <b>excluding</b> a + b. Change an input to get new random numbers.' })
      ];
    },
    draw: function (k, s, v) {
      var a = Math.trunc(v.a), b = Math.max(1, Math.trunc(v.b)), r = s.r, rb = r * b, c = Math.floor(rb), X = function (t, m) { return 40 + t / m * 480; }, items = [];
      var side = function (x) { return x < 360 ? { x: x + 10, a: 'start' } : { x: x - 10, a: 'end' }; };
      items.push(A('l1', 40, 60, 520, 60, { head: false, tone: 'muted' }));
      items.push(T('z1', 40, 84, '0.0', { anchor: 'middle', mono: true, size: 12, halo: true }), T('o1', 520, 84, '1.0 (never)', { anchor: 'middle', mono: true, size: 12, halo: true, tone: 'red' }));
      items.push(B('e1', 514, 54, 12, 12, { shape: 'oval', fill: 'none', tone: 'red' }));
      items.push(B('p1', X(r, 1) - 6, 54, 12, 12, { shape: 'oval', fill: 'solid', tone: 'accent' }));
      items.push(T('t1', side(X(r, 1)).x, 46, 'r = ' + r.toFixed(3), { anchor: side(X(r, 1)).a, mono: true, size: 13, bold: k === 0, tone: 'accent' }));
      if (k >= 1) {
        items.push(A('l2', 40, 150, 520, 150, { head: false, tone: 'muted' }));
        items.push(T('z2', 40, 174, '0', { anchor: 'middle', mono: true, size: 12, halo: true }), T('o2', 520, 174, String(b), { anchor: 'middle', mono: true, size: 12, halo: true }));
        items.push(A('d1', X(r, 1), 68, X(rb, b), 142, { dash: true, tone: 'muted', z: 1 }));
        items.push(B('p2', X(rb, b) - 6, 144, 12, 12, { shape: 'oval', fill: 'solid', tone: 'blue' }));
        items.push(T('t2', side(X(rb, b)).x, 140, 'r * ' + b + ' = ' + rb.toFixed(2), { anchor: side(X(rb, b)).a, mono: true, size: 13, bold: k === 1, tone: 'blue' }));
      }
      if (k >= 2) {
        var off = k >= 3 ? a : 0;
        if (b <= 12) {
          for (var i = 0; i < b; i++) items.push(B('c' + i, Math.round(X(i, b)), 226, Math.round(480 / b) - 3, 32, { title: String(off + i), mono: true, size: 12, tone: i === c ? 'accent' : 'muted', hi: i === c, r: 4 }));
          items.push(A('d2', X(rb, b), 158, X(c, b) + 240 / b - 1, 222, { dash: true, tone: 'muted', z: 1 }));
        } else {
          items.push(A('l3', 40, 242, 520, 242, { head: false, tone: 'muted' }));
          items.push(T('z3', 40, 266, String(off), { anchor: 'middle', mono: true, size: 12, halo: true }), T('o3', 520, 266, String(off + b - 1), { anchor: 'middle', mono: true, size: 12, halo: true }));
          items.push(A('d2', X(rb, b), 158, X(c, b), 234, { dash: true, tone: 'muted', z: 1 }));
          items.push(B('p3', X(c, b) - 6, 236, 12, 12, { shape: 'oval', fill: 'solid', tone: 'accent' }));
          items.push(T('t3', side(X(c, b)).x, 232, String(off + c), { anchor: side(X(c, b)).a, mono: true, size: 13, bold: true, tone: 'accent' }));
        }
      }
      if (k >= 3) items.push(T('rg', 280, 300, 'n is from ' + a + ' to ' + (a + b - 1) + ' (' + b + ' values)', { anchor: 'middle', bold: true, size: 14, tone: k === 3 ? 'accent' : 'ink' }));
      if (k === 4) items.push(T('gen', 280, 326, 'a + Math.random() * b  →  a double in [a, a + b)', { anchor: 'middle', mono: true, size: 13, tone: 'teal', bold: true }));
      return items;
    }
  };

  /* ---------- 22. case study: the angles of a triangle (slide 35) ---------- */
  function tri(v) {
    var d = function (x1, y1, x2, y2) { return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)); };
    var a = d(v.x2, v.y2, v.x3, v.y3), b = d(v.x1, v.y1, v.x3, v.y3), c = d(v.x1, v.y1, v.x2, v.y2), deg = function (x) { return x * 180 / Math.PI; };
    var ang = [deg(Math.acos((a * a - b * b - c * c) / (-2 * b * c))), deg(Math.acos((b * b - a * a - c * c) / (-2 * a * c))), deg(Math.acos((c * c - b * b - a * a) / (-2 * a * b)))];
    var r2 = ang.map(function (x) { return jd(jround(x * 100) / 100); });
    return { a: a, b: b, c: c, ang: ang, r2: r2, out: 'The three angles are ' + r2.join(' ') };
  }
  var TRI = 'double a = Math.sqrt((x2 - x3) * (x2 - x3) + (y2 - y3) * (y2 - y3));\ndouble b = Math.sqrt((x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3));\ndouble c = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));\n' +
    'double A = Math.toDegrees(Math.acos((a * a - b * b - c * c) / (-2 * b * c)));\ndouble B = Math.toDegrees(Math.acos((b * b - a * a - c * c) / (-2 * a * c)));\ndouble C = Math.toDegrees(Math.acos((c * c - b * b - a * a) / (-2 * a * b)));\n' +
    'System.out.println("The three angles are " + Math.round(A * 100) / 100.0 + " "\n  + Math.round(B * 100) / 100.0 + " " + Math.round(C * 100) / 100.0);';
  var triangle = {
    id: 'triangle', slides: [35, 35], title: 'Three corners in, three angles out', code: TRI,
    inputs: [{ id: 'x1', label: 'x1', value: 1, min: -50, max: 50 }, { id: 'y1', label: 'y1', value: 1, min: -50, max: 50 }, { id: 'x2', label: 'x2', value: 6.5, min: -50, max: 50 }, { id: 'y2', label: 'y2', value: 1, min: -50, max: 50 }, { id: 'x3', label: 'x3', value: 6.5, min: -50, max: 50 }, { id: 'y3', label: 'y3', value: 2.5, min: -50, max: 50 }],
    presets: [{ label: '(1,1) (6.5,1) (6.5,2.5)', values: { x1: 1, y1: 1, x2: 6.5, y2: 1, x3: 6.5, y3: 2.5 } }, { label: '3-4-5 right triangle', values: { x1: 0, y1: 0, x2: 4, y2: 0, x3: 0, y3: 3 } }, { label: 'all sides 2', values: { x1: 0, y1: 0, x2: 2, y2: 0, x3: 1, y3: 1.7320508 } }, { label: 'points on one line', values: { x1: 0, y1: 0, x2: 1, y2: 1, x3: 3, y3: 3 } }],
    steps: function (v) {
      var t = tri(v), ok = t.ang.every(function (x) { return !isNaN(x); });
      return [
        { line: '1-3', cap: 'The user gives three corners: (' + v.x1 + ', ' + v.y1 + '), (' + v.x2 + ', ' + v.y2 + ') and (' + v.x3 + ', ' + v.y3 + '). Side <b>a</b> is opposite corner A, side b opposite B, side c opposite C.' },
        { line: '1-3', cap: 'Each side is the distance between two corners: the square root of (Δx² + Δy²). a ≈ ' + jfix(t.a, 2) + ', b ≈ ' + jfix(t.b, 2) + ', c ≈ ' + jfix(t.c, 2) + '.' },
        { line: 4, cap: 'The formula of the slide gives the cosine of A; <code>Math.acos</code> turns it into an angle in radians, and <code>Math.toDegrees</code> into degrees: A ≈ ' + jfix(t.ang[0], 2) + '°.' },
        { line: 5, cap: 'The same for B: ≈ ' + jfix(t.ang[1], 2) + '°.' },
        { line: 6, cap: 'And for C: ≈ ' + jfix(t.ang[2], 2) + '°.' + (ok ? ' Check: A + B + C ≈ ' + jfix(t.ang[0] + t.ang[1] + t.ang[2], 2) + '°.' : ' A NaN appears because a side is 0 (two corners are the same point).') },
        { line: '7-8', cap: '<code>Math.round(A * 100) / 100.0</code> keeps 2 digits after the point: multiply by 100, round, then divide by 100.0 (a double, so the result is a double).' + (Math.abs(t.ang[1] - 180) < 1e-6 || t.ang.some(function (x) { return Math.abs(x) < 1e-6; }) ? ' The corners are on one line, so it is not a real triangle: the angles are 0 and 180.' : ''), out: t.out }
      ];
    },
    draw: function (k, s, v) {
      var t = tri(v), xs = [v.x1, v.x2, v.x3], ys = [v.y1, v.y2, v.y3], items = [];
      var mnx = Math.min.apply(null, xs), mxx = Math.max.apply(null, xs), mny = Math.min.apply(null, ys), mxy = Math.max.apply(null, ys);
      var sc = Math.min(240 / ((mxx - mnx) || 1), 230 / ((mxy - mny) || 1));
      var PX = function (i) { return 40 + (xs[i] - mnx) * sc + (240 - (mxx - mnx) * sc) / 2; }, PY = function (i) { return 290 - (ys[i] - mny) * sc - (230 - (mxy - mny) * sc) / 2; };
      var gx = (PX(0) + PX(1) + PX(2)) / 3, gy = (PY(0) + PY(1) + PY(2)) / 3;
      /* corners on one line: side names go above the line, corner names below it */
      var flat = Math.abs((PX(1) - PX(0)) * (PY(2) - PY(0)) - (PX(2) - PX(0)) * (PY(1) - PY(0))) < 400;
      [[1, 2, 'a'], [0, 2, 'b'], [0, 1, 'c']].forEach(function (sd, i) {
        var on = k === 1;
        items.push(A('s' + sd[2], PX(sd[0]), PY(sd[0]), PX(sd[1]), PY(sd[1]), { head: false, tone: on ? 'accent' : 'ink' }));
        var mx = (PX(sd[0]) + PX(sd[1])) / 2, my = (PY(sd[0]) + PY(sd[1])) / 2, sl = Math.hypot(PX(sd[0]) - PX(sd[1]), PY(sd[0]) - PY(sd[1]));
        if (sl < 30) return;
        /* move the name straight away from the side (not along it), on the outside of the triangle */
        var dx = -(PY(sd[1]) - PY(sd[0])) / sl, dy = (PX(sd[1]) - PX(sd[0])) / sl, L = 1;
        if (flat ? dy > 0 : dx * (mx - gx) + dy * (my - gy) < 0) { dx = -dx; dy = -dy; }
        items.push(T('sl' + i, mx + dx / L * 14, my + dy / L * 14 + 4, sd[2], { anchor: 'middle', italic: true, size: 14, tone: on ? 'accent' : 'muted', bold: on }));
      });
      for (var i = 0; i < 3; i++) {
        var on = k === i + 2, dx = PX(i) - gx, dy = PY(i) - gy, L = Math.hypot(dx, dy);
        if (L < 8) { dx = [-1, 0, 1][i]; dy = [0.6, -1, 0.6][i]; L = Math.hypot(dx, dy); }
        if (flat && L >= 8) { var sg = [[0, 1], [0, 2], [1, 2]].sort(function (p, q) { return Math.hypot(PX(q[1]) - PX(q[0]), PY(q[1]) - PY(q[0])) - Math.hypot(PX(p[1]) - PX(p[0]), PY(p[1]) - PY(p[0])); })[0], ex = PX(sg[1]) - PX(sg[0]), ey = PY(sg[1]) - PY(sg[0]), el = Math.hypot(ex, ey) || 1; dx = -ey / el; dy = ex / el; if (dy < 0) { dx = -dx; dy = -dy; } L = 1; }
        items.push(B('pt' + i, PX(i) - 5, PY(i) - 5, 10, 10, { shape: 'oval', fill: 'solid', tone: on ? 'accent' : 'blue' }));
        items.push(T('cl' + i, PX(i) + dx / L * 16, PY(i) + dy / L * 16 + 5, 'ABC'[i], { anchor: 'middle', bold: true, size: 15, tone: on ? 'accent' : 'ink' }));
      }
      var rows = [['a ≈ ' + jfix(t.a, 2), 1], ['b ≈ ' + jfix(t.b, 2), 1], ['c ≈ ' + jfix(t.c, 2), 1], ['A ≈ ' + jfix(t.ang[0], 2) + '°', 2], ['B ≈ ' + jfix(t.ang[1], 2) + '°', 3], ['C ≈ ' + jfix(t.ang[2], 2) + '°', 4]];
      rows.forEach(function (r, j) { if (k >= r[1]) items.push(T('v' + j, 330, 60 + j * 38, r[0], { mono: true, size: 15, bold: k === r[1], tone: k === r[1] ? 'accent' : 'ink' })); });
      if (k >= 5) items.push(T('sum', 330, 300, 'printed: ' + t.r2.join('  '), { mono: true, size: 13, bold: true, tone: 'teal' }));
      return items;
    }
  };

  /* ---------- 23. printf and the specifiers (slides 36-37) ---------- */
  var printf = {
    id: 'printf', slides: [36, 37], title: 'printf: each specifier takes the next item',
    inputs: [{ id: 'n', label: 'count', value: 5, min: -9999, max: 99999 }, { id: 'x', label: 'amount', value: 45.56, min: -99999, max: 99999 }],
    presets: [{ label: 'Slide: 5, 45.56', values: { n: 5, x: 45.56 } }, { label: '12, 0.1', values: { n: 12, x: 0.1 } }, { label: '0, 1234.5678', values: { n: 0, x: 1234.5678 } }, { label: '-3, 2.0', values: { n: -3, x: 2 } }],
    code: function (v) { return 'int count = ' + Math.trunc(v.n) + ';\ndouble amount = ' + jd(v.x) + ';\nSystem.out.printf("count is %d and amount is %f", count, amount);'; },
    steps: function (v) {
      var n = Math.trunc(v.n), x = v.x, f = jfix(x, 6);
      return [
        { line: 3, slide: 36, cap: '<code>printf(format, items)</code>. The <b>format</b> is a string with normal text and <b>specifiers</b>. Each specifier begins with <code>%</code> and says how one item is shown.' },
        { line: 3, slide: 37, cap: 'The first specifier, <code>%d</code> (a decimal integer), takes the first item, count: ' + n + '.' },
        { line: 3, slide: 37, cap: 'The second specifier, <code>%f</code> (a floating-point number), takes the second item, amount. %f shows <b>6 digits</b> after the point: ' + f + '.' },
        { line: 3, slide: 37, cap: 'The result. printf does not move to a new line by itself.', out: 'count is ' + n + ' and amount is ' + f },
        { line: 3, slide: 37, cap: 'The common specifiers, shown with your values where they fit. <code>%e</code> is scientific notation: ' + jexp(x, 6) + ' means ' + jexp(x, 6).split('e')[0] + ' × 10<sup>' + Number(jexp(x, 6).split('e')[1]) + '</sup>.' },
        { line: 3, slide: 37, cap: 'The items must match the specifiers, in order and in type. <code>printf("%d", amount)</code> stops the program with an error, because %d cannot show a double.', out: 'Exception in thread "main" java.util.IllegalFormatConversionException: d != java.lang.Double' }
      ];
    },
    draw: function (k, s, v) {
      var n = Math.trunc(v.n), x = v.x, f = jfix(x, 6), items = [];
      if (k === 4) {
        [['%b', 'a boolean value', 'true'], ['%c', 'a character', "'a'"], ['%d', 'a decimal integer', String(n)], ['%f', 'a floating-point number', f], ['%e', 'scientific notation', jexp(x, 6)], ['%s', 'a string', '"Java is cool"']].forEach(function (r, i) {
          var y = 18 + i * 52, mine = i === 2 || i === 3 || i === 4;
          items.push(B('sp' + i, 20, y, 60, 42, { title: r[0], mono: true, size: 17, tone: 'accent', hi: mine }));
          items.push(T('sm' + i, 96, y + 26, r[1], { size: 14 }));
          items.push(T('se' + i, 540, y + 26, r[2], { anchor: 'end', mono: true, size: 14, bold: mine, tone: mine ? 'teal' : 'ink' }));
        });
        return items;
      }
      if (k === 5) return [
        T('bad', 280, 90, 'printf("%d", amount);', { anchor: 'middle', mono: true, size: 20, bold: true, tone: 'red' }),
        B('bd', 150, 140, 80, 46, { title: '%d', mono: true, size: 18, tone: 'accent', tag: 'wants an int' }),
        T('x', 280, 170, '✗', { anchor: 'middle', size: 26, bold: true, tone: 'red' }),
        B('ba', 330, 140, 110, 46, { title: jd(x), mono: true, size: 16, tone: 'red', tag: 'a double' }),
        T('fix', 280, 270, 'use %f for a double', { anchor: 'middle', size: 15, bold: true, tone: 'teal' })
      ];
      var segs = [['count is ', 0], ['%d', 1], [' and amount is ', 0], ['%f', 2]], ws = segs.map(function (g) { return Math.max(44, 14 + g[0].length * 9.4); });
      var total = ws.reduce(function (p, q) { return p + q; }, 0) + 24, xx = 280 - total / 2, cx = [];
      segs.forEach(function (g, i) {
        var on = g[1] && g[1] === k;
        items.push(B('f' + i, Math.round(xx), 50, Math.round(ws[i]), 44, { title: g[0], mono: true, size: 15, tone: g[1] ? 'accent' : 'muted', hi: on, tag: i === 0 ? 'format' : undefined }));
        cx.push(xx + ws[i] / 2); xx += ws[i] + 8;
      });
      items.push(B('ic', 110, 180, 150, 50, { tag: 'int count', title: String(n), mono: true, size: 18, tone: k === 1 ? 'accent' : 'teal', hi: k === 1 }));
      items.push(B('ia', 300, 180, 170, 50, { tag: 'double amount', title: jd(x), mono: true, size: 18, tone: k === 2 ? 'accent' : 'teal', hi: k === 2 }));
      if (k >= 1) items.push(A('a1', 185, 160, cx[1], 100, { tone: 'accent', label: '1st item' }));
      if (k >= 2) items.push(A('a2', 385, 160, cx[3], 100, { tone: 'accent', label: '2nd item' }));
      if (k >= 1) items.push(T('res', 280, 290, 'count is ' + n + ' and amount is ' + (k >= 2 ? f : '%f'), { anchor: 'middle', mono: true, size: 15, bold: k === 3, tone: k === 3 ? 'teal' : 'ink' }));
      return items;
    }
  };

  /* ---------- 24. width and precision (slide 38) ---------- */
  function pad10(t) { return t.length >= 10 ? t : t + new Array(11 - t.length).join(' '); }
  var printfex = {
    id: 'printfex', slides: [38, 38], title: 'Width and precision: %-10d and %-10.4f',
    inputs: [{ id: 'd', label: 'degrees', value: 60, min: -360, max: 360 }],
    presets: [{ label: '60 (slide)', values: { d: 60 } }, { label: '30', values: { d: 30 } }, { label: '0', values: { d: 0 } }, { label: '90', values: { d: 90 } }, { label: '-45', values: { d: -45 } }],
    code: function (v) { var d = Math.trunc(v.d); return '// Display values for ' + d + ' degrees\ndegrees = ' + d + ';\nradians = Math.toRadians(degrees);\nSystem.out.printf("%-10d%-10.4f%-10.4f%-10.4f%-10.4f\\n", degrees,\n    radians, Math.sin(radians), Math.cos(radians),\n    Math.tan(radians));'; },
    steps: function (v) {
      var d = Math.trunc(v.d), r = d * Math.PI / 180, cols = [String(d), jfix(r, 4), jfix(Math.sin(r), 4), jfix(Math.cos(r), 4), jfix(Math.tan(r), 4)];
      var wide = cols[4].length > 10;
      return [
        { line: '2-3', cap: '<code>Math.toRadians</code> turns degrees into radians: ' + d + '° ≈ ' + fmt4(r) + ' radians.' },
        { line: 4, cap: '<code>%-10d</code>: d is an integer, <b>10</b> is the <b>width</b> (at least 10 places), and <b>-</b> means <b>left-justified</b>: the value first, then spaces. ' + h(jstr(cols[0])) + ' becomes ' + h(jstr(pad10(cols[0]))) + '.' },
        { line: '4-5', cap: '<code>%-10.4f</code>: the same width and side, and <b>.4</b> means <b>4 digits</b> after the point (rounded): radians → ' + cols[1] + '.' },
        { line: 5, cap: 'sin → ' + cols[2] + ' and cos → ' + cols[3] + '. Each value fills its 10 places, so the columns line up.' },
        { line: 6, cap: 'tan → ' + cols[4] + '.' + (wide ? ' This value needs more than 10 places. The width is only the <b>minimum</b>, so nothing is cut: the column just gets wider.' : '') },
        { line: 4, cap: 'The whole line. <code>\\n</code> at the end of the format moves to a new line.', out: cols.map(pad10).join('') }
      ];
    },
    draw: function (k, s, v) {
      var d = Math.trunc(v.d), r = d * Math.PI / 180, cols = [String(d), jfix(r, 4), jfix(Math.sin(r), 4), jfix(Math.cos(r), 4), jfix(Math.tan(r), 4)], names = ['degrees', 'radians', 'sin', 'cos', 'tan'], items = [];
      var on = [[], [0], [1], [2, 3], [4], [0, 1, 2, 3, 4]][k];
      cols.forEach(function (c, i) {
        if (k === 0 && i > 1) return;
        var hit = on.indexOf(i) >= 0, t = pad10(c).replace(/ /g, '·');
        items.push(T('sp' + i, 30 + i * 102 + 50, 100, i ? '%-10.4f' : '%-10d', { anchor: 'middle', mono: true, size: 12, tone: hit ? 'accent' : 'muted', bold: hit }));
        items.push(B('col' + i, 30 + i * 102, 112, 100, 50, { title: k === 0 && i === 1 ? '≈ ' + fmt4(r) : t, mono: true, size: t.length > 10 ? Math.min(13, Math.floor(86 / (0.62 * t.length) * 10) / 10) : 13, align: 'left', tone: hit ? (k === 5 ? 'teal' : 'accent') : 'muted', hi: hit }));
        items.push(T('nm' + i, 30 + i * 102 + 50, 190, names[i], { anchor: 'middle', mono: true, size: 12.5, tone: hit ? 'accent' : 'muted' }));
      });
      if (k === 1) items.push(A('w', 30, 214, 130, 214, { tone: 'accent', label: '10 places', head: false }));
      items.push(T('key', 280, 280, '· = a space added to fill the width', { anchor: 'middle', size: 12.5, tone: 'muted' }));
      return items;
    }
  };

  var ALL = [chars, escape, charcast, charcmp, charmeth, strref, strlen, strconv, concat, readwords, readch, compare, substr, findsub, parse, mathcls, trig, expo, rounding, minmax, random, triangle, printf, printfex];

  var para = function (t) { return { type: 'paragraph', text: t }; }, bul = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; },
    code = function (t, lang) { return lang ? { type: 'code', text: t, lang: lang } : { type: 'code', text: t }; }, note = function (t) { return { type: 'note', text: t }; };
  function tblH(head, rows) {
    return { type: 'html', html: '<div class="tblwrap"><table><tr>' + head.map(function (x) { return '<th>' + x + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table></div>' };
  }
  function braces(c) { var o = (c.match(/\{/g) || []).length, z = (c.match(/\}/g) || []).length; return o >= 2 && o === z; }
  function c_(t) { return '<code>' + t + '</code>'; }
  function section(t, ex) { return { cover: true, image: false, title: t, blocks: [para(t)], explain: ex }; }

  addUnit({
    course: 'cs1', lesson: '05-mathematical-functions-characters-and-strings',
    blurb: 'Work with single characters and with text: char and Unicode, the Character class, String methods, reading text, comparing and cutting strings, then the Math class and printf.',
    parts: [
      {
        title: 'Characters', from: 1, to: 10,
        quiz: [
          { q: 'What is the code of \'A\'?', options: ['48', '65', '97'], answer: 1, why: "'A' to 'Z' are 65 to 90 (slide 3). 97 is 'a', 48 is '0'." },
          { type: 'output', q: 'What does this print?', code: "char ch = 'a';\nSystem.out.println(++ch);", answer: 'b', why: '++ adds 1 to the code: 97 + 1 = 98, which is \'b\' (slide 8).' },
          { type: 'output', q: 'And this? Think about the type of the result.', code: "System.out.println('A' + 1);", answer: '66', why: "char + int is an int: 65 + 1 = 66. Only ++ch keeps the char type." },
          { type: 'tf', q: "'\\u0041' and 'A' are the same character.", answer: true, why: '41 in hexadecimal is 65, the code of \'A\' (slide 5).' },
          { type: 'fill', q: 'Fill in the escape sequence so that “one” and “two” are printed on two lines.', code: 'System.out.println("one___two");', answer: ['\\n'], why: '\\n is the linefeed character (slide 7).' },
          { type: 'output', q: 'What does this print?', code: "char ch = '7';\nif (ch >= 'A' && ch <= 'Z')\n  System.out.println(ch + \" is an uppercase letter\");\nelse if (ch >= '0' && ch <= '9')\n  System.out.println(ch + \" is a numeric character\");", answer: '7 is a numeric character', why: "'7' has code 55. It is not between 65 and 90, but it is between 48 and 57." },
          { q: 'What does <code>Character.toUpperCase(\'q\')</code> return?', options: ["'Q'", "'q'", 'true'], answer: 0, why: 'It returns the uppercase form of the character (slide 10).' }
        ]
      },
      {
        title: 'Strings and their methods', from: 11, to: 18,
        quiz: [
          { type: 'output', q: 'What does this print?', code: 'String message = "Welcome to Java";\nSystem.out.println(message.length());', answer: '15', why: 'The two spaces count too: 7 + 1 + 2 + 1 + 4 = 15.' },
          { type: 'output', q: 'And this?', code: 'System.out.println("Java".charAt(2));', answer: 'v', why: 'The indexes are J 0, a 1, v 2, a 3.' },
          { type: 'tf', q: 'After <code>s.toUpperCase();</code> the string s is in capital letters.', answer: false, why: 'toUpperCase returns a <b>new</b> string; s does not change. You need <code>s = s.toUpperCase();</code>.' },
          { type: 'output', q: 'What does this print?', code: 'String s = "  Hi  ";\nSystem.out.println("[" + s.trim() + "]");', answer: '[Hi]', why: 'trim removes the whitespace on both sides (slide 17).' },
          { type: 'output', q: 'What does this print?', code: 'System.out.println("Chapter" + 1 + 2);', answer: 'Chapter12', why: '+ goes left to right. "Chapter" + 1 is already a string, so 2 is joined too.' },
          { type: 'output', q: 'And this?', code: 'System.out.println(1 + 2 + "Chapter");', answer: '3Chapter', why: 'The first + has two numbers, so it adds: 3. Then "Chapter" is joined.' },
          { q: 'Which call is a <b>static</b> method?', options: ['Math.sqrt(4)', 'message.length()', 'message.charAt(0)'], answer: 0, why: 'A static method is called with the class name, without an object (slide 14).' }
        ]
      },
      {
        title: 'Reading, comparing and cutting strings', from: 19, to: 25,
        quiz: [
          { q: 'The user types <code>Java is fun</code>. What does <code>input.next()</code> return?', options: ['"Java is fun"', '"Java"', '"J"'], answer: 1, why: 'next() reads one word: it stops at a space (slide 19).' },
          { q: 'Which method reads the whole line, spaces included?', options: ['nextInt()', 'next()', 'nextLine()'], answer: 2, why: 'Slide 20 uses nextLine() and then charAt(0).' },
          { type: 'output', q: 'What does this print?', code: 'System.out.println("Java".equals("java"));\nSystem.out.println("Java".equalsIgnoreCase("java"));', answer: 'false\ntrue', why: 'equals is case sensitive; equalsIgnoreCase is not.' },
          { type: 'output', q: 'What does this print?', code: 'System.out.println("abc".compareTo("abd"));', answer: '-1', why: "The first difference is 'c' (99) and 'd' (100): 99 − 100 = -1. Negative means \"abc\" comes first." },
          { type: 'output', q: 'What does this print?', code: 'String m = "Welcome to Java";\nSystem.out.println(m.substring(3, 7));', answer: 'come', why: 'Indexes 3, 4, 5, 6. The end index 7 is not included.' },
          { type: 'output', q: 'And this?', code: 'System.out.println("banana".lastIndexOf(\'a\'));', answer: '5', why: 'b0 a1 n2 a3 n4 a5: the last a is at index 5.' },
          { type: 'fill', q: 'Turn the text "25" into an int.', code: 'int n = Integer.___("25");', answer: ['parseInt'], why: 'Slide 25: Integer.parseInt.' },
          { type: 'output', q: 'What does this print?', code: 'String s = 7 + "";\nSystem.out.println(s + 1);', answer: '71', why: 's is the text "7", so + joins: "71".' }
        ]
      },
      {
        title: 'The Math class', from: 26, to: 34,
        quiz: [
          { type: 'output', q: 'What does this print?', code: 'System.out.println(Math.pow(2, 3));', answer: '8.0', why: 'pow returns a double (slide 30).' },
          { type: 'tf', q: 'Math.sin(30) gives the sine of 30 degrees.', answer: false, why: 'The parameter is in <b>radians</b> (slide 29). Use Math.sin(30 * Math.PI / 180).' },
          { type: 'output', q: 'What does this print?', code: 'System.out.println(Math.ceil(-2.1));\nSystem.out.println(Math.floor(-2.1));', answer: '-2.0\n-3.0', why: 'ceil goes up (closer to 0 for a negative number); floor goes down (slide 32).' },
          { type: 'output', q: 'What does this print?', code: 'System.out.println(Math.round(2.5));\nSystem.out.println(Math.rint(2.5));', answer: '3\n2.0', why: 'round is floor(x + 0.5) and returns a long. rint picks the even integer when x is in the middle, and returns a double.' },
          { type: 'output', q: 'What does this print?', code: 'System.out.println(Math.max(2.5, 3));', answer: '3.0', why: 'One parameter is a double, so the result is a double (slide 33).' },
          { q: 'What values can <code>(int)(Math.random() * 6)</code> have?', options: ['0 to 6', '1 to 6', '0 to 5'], answer: 2, why: 'random() is from 0.0 up to (not including) 1.0, so the product is under 6, and the cast cuts it to 0…5.' },
          { type: 'fill', q: 'A dice: a random integer from 1 to 6.', code: 'int dice = 1 + (int)(Math.random() * ___);', answer: ['6'], why: '(int)(Math.random() * 6) is 0 to 5; adding 1 gives 1 to 6 (slide 34).' }
        ]
      },
      {
        title: 'Case study and printf', from: 35, to: 38,
        quiz: [
          { type: 'output', q: 'What does this print?', code: 'System.out.println(Math.round(15.2639 * 100) / 100.0);', answer: '15.26', why: '1526.39 rounds to 1526; 1526 / 100.0 is 15.26. This keeps two digits after the point.' },
          { type: 'output', q: 'What does this print?', code: 'System.out.printf("%d and %f", 5, 1.5);', answer: '5 and 1.500000', why: '%d takes the integer 5. %f shows 6 digits after the point (slide 37).' },
          { q: 'Which specifier shows a string?', options: ['%s', '%c', '%d'], answer: 0, why: '%c is one character, %d an integer (slide 37).' },
          { type: 'output', q: 'What does this print?', code: 'System.out.printf("[%-5d]", 42);', answer: '[42   ]', why: 'Width 5, left-justified: 42 and then 3 spaces (slide 38).' },
          { type: 'output', q: 'And this?', code: 'System.out.printf("%.2f", 3.14159);', answer: '3.14', why: '.2 means 2 digits after the point, rounded.' },
          { type: 'tf', q: 'With <code>%-10.4f</code>, a value that needs 12 places is cut to 10.', answer: false, why: 'The width is only the minimum. A longer value is printed in full.' }
        ]
      }
    ],
    slides: {
      1: { cover: true, image: false, title: '', blocks: [para('Chapter 4'), para('Mathematical Methods, Characters, and Strings'), note('An adapted version of the lecture notes associated with the textbook')],
        explain: '<p>So far we worked with numbers. This unit is about <b>text</b>: single characters (char) and strings (String). At the end come the ready-made <b>Math</b> methods and printf, to show numbers neatly.</p>' },
      2: section('Characters', '<p>First part: the <b>char</b> type, which holds one character.</p>'),
      3: { image: false, blocks: [code("char letter = 'A'; (ASCII)\nchar numChar = '4'; (ASCII)", 'none'), tblH(['Characters', 'Code Value in Decimal'], [[c_("'0'") + ' to ' + c_("'9'"), '48 to 57'], [c_("'A'") + ' to ' + c_("'Z'"), '65 to 90'], [c_("'a'") + ' to ' + c_("'z'"), '97 to 122']])],
        explain: '<p>A <b>char</b> holds one character, between single quotes. The computer does not keep the shape of the letter; it keeps a number, the character’s <b>{{code|رمز رقمي}}</b>. The digits, the capital letters and the small letters each have a block of codes in order, so \'B\' is 66 and \'C\' is 67. Note that \'4\' (code 52) is not the number 4.</p>' },
      4: { image: false, blocks: [bul('Java characters use Unicode, a 16-bit encoding scheme to support the interchange, processing, and display of written texts in the world’s diverse languages.'), bul("Unicode takes two bytes, preceded by \\u, expressed in four hexadecimal numbers that run from '\\u0000' to '\\uFFFF'. So, Unicode can represent 65535 + 1 characters."), note('Unicode \\u03b1 \\u03b2 \\u03b3 for three Greek letters: α β γ')],
        explain: '<p><b>{{Unicode|يونيكود: نظام يعطي كل حرف في كل اللغات رقماً}}</b> gives a code to the letters of many languages, Arabic too. Each Java char uses 16 bits. We write the code with \\u and four <b>{{hexadecimal|ست عشري (الأساس 16)}}</b> digits (0-9 and A-F).</p>' },
      5: { image: false, blocks: [para('Four hexadecimal digits.'), code("char letter = '\\u0041'; (Unicode)\nchar numChar = '\\u0034'; (Unicode)", 'none')],
        explain: '<p>The same characters as slide 3, written with their Unicode codes: hexadecimal 41 is 65 (\'A\'), and 34 is 52 (\'4\').</p>' },
      6: { image: false, title: 'ASCII Code for Commonly Used Characters', blocks: [tblH(['Characters', 'Code Value in Decimal', 'Unicode Value'], [[c_("'0'") + ' to ' + c_("'9'"), '48 to 57', c_('\\u0030') + ' to ' + c_('\\u0039')], [c_("'A'") + ' to ' + c_("'Z'"), '65 to 90', c_('\\u0041') + ' to ' + c_('\\u005A')], [c_("'a'") + ' to ' + c_("'z'"), '97 to 122', c_('\\u0061') + ' to ' + c_('\\u007A')]])],
        explain: '<p><b>{{ASCII|آسكي: نظام ترميز قديم للحروف الإنجليزية}}</b> is an older code for English letters. The first 128 Unicode codes are the same as ASCII, so both columns describe the same characters.</p>' },
      7: { image: false, blocks: [tblH(['Escape Sequence', 'Name', 'Unicode Code', 'Decimal Value'], [[c_('\\b'), 'Backspace', c_('\\u0008'), '8'], [c_('\\t'), 'Tab', c_('\\u0009'), '9'], [c_('\\n'), 'Linefeed', c_('\\u000A'), '10'], [c_('\\f'), 'Formfeed', c_('\\u000C'), '12'], [c_('\\r'), 'Carriage Return', c_('\\u000D'), '13'], [c_('\\\\'), 'Backslash', c_('\\u005C'), '92'], [c_('\\"'), 'Double Quote', c_('\\u0022'), '34']])],
        explain: '<p>Some characters cannot be typed directly inside a string. An <b>{{escape sequence|تسلسل هروب: شرطة مائلة عكسية + رمز}}</b> writes them with a backslash: \\n for a new line, \\t for a tab, \\" for a quote inside a string, and \\\\ for the backslash itself.</p>' },
      8: { image: false, title: 'Casting between char and Numeric Types', blocks: [code("int i = 'a'; // Same as int i = (int)'a';\nchar c = 97; // Same as char c = (char)97;"), para('NOTE: The increment and decrement operators can also be used on char variables to get the next or preceding Unicode character. For example, the following statements display character b.'), code("char ch = 'a';\nSystem.out.println(++ch);")],
        explain: '<p>Because a char is a number inside, Java can <b>{{cast|يحوّل النوع}}</b> it: a char into an int gives its code, and a number into a char gives the character with that code. <code>++ch</code> moves to the <b>next</b> character, <code>--ch</code> to the <b>{{preceding|السابق}}</b> one.</p>' },
      9: { image: false, blocks: [code(CMP_CODE)],
        explain: '<p>The comparison operators work on chars by comparing their <b>codes</b>. Because the capital letters are in order (65 to 90), <code>ch >= \'A\' && ch <= \'Z\'</code> is true exactly for a capital letter.</p>' },
      10: { image: false, title: 'Methods in the Character Class', blocks: [tblH(['Method', 'Description'], [[c_('isDigit(ch)'), 'Returns true if the specified character is a digit.'], [c_('isLetter(ch)'), 'Returns true if the specified character is a letter.'], [c_('isLetterOfDigit(ch)'), 'Returns true if the specified character is a letter or digit.'], [c_('isLowerCase(ch)'), 'Returns true if the specified character is a lowercase letter.'], [c_('isUpperCase(ch)'), 'Returns true if the specified character is an uppercase letter.'], [c_('toLowerCase(ch)'), 'Returns the lowercase of the specified character.'], [c_('toUpperCase(ch)'), 'Returns the uppercase of the specified character.']])],
        explain: '<p>The <b>Character</b> class has ready-made tests, called like <code>Character.isDigit(ch)</code>. They also work for letters of other languages, which a range test like slide 9 misses. Careful: the slide writes <code>isLetterOfDigit</code>, but the real name in Java is <code>isLetterOrDigit</code>.</p>' },
      11: section('Strings', '<p>Second part: <b>String</b>, a row of characters.</p>'),
      12: { image: false, title: 'The String Type', blocks: [bul('The char type only represents one character. To represent a string of characters, use the data type called String. For example:'), code('String message = "Welcome to Java";'), bul('String is actually a predefined class in the Java library just like the System class and Scanner class.'), bul('The String type is not a primitive type. It is known as a reference type. (will be thoroughly discussed in Chapter 9).'), bul('For now, you just need to know how to declare a String variable, how to assign a string to the variable, how to concatenate strings, and to perform simple operations for strings.')],
        explain: '<p>A string is written in <b>double</b> quotes: "Java". A char uses single quotes: \'J\'. String is a <b>{{reference type|نوع مرجعي: المتغير يشير إلى الكائن}}</b>: the variable does not hold the text itself, it refers to a String object that holds it.</p>' },
      13: { image: false, title: 'Simple Methods for String Objects', blocks: [tblH(['Method', 'Description'], [[c_('length()'), 'Returns the number of characters in this string.'], [c_('charAt(index)'), 'Returns the character at the specified index from this string.'], [c_('concat(s1)'), 'Returns a new string that concatenates this string with string s1.'], [c_('toUpperCase()'), 'Returns a new string with all letters in uppercase.'], [c_('toLowerCase()'), 'Returns a new string with all letters in lowercase.'], [c_('trim()'), 'Returns a new string with whitespace characters trimmed on both sides.']]), para('Strings are objects in Java. The shown methods can only be invoked from a specific string instance. For this reason, these methods are called instance methods.')],
        explain: '<p>These methods are called on one string with a dot: <code>message.length()</code>. They belong to that <b>{{instance|نسخة: كائن معيّن}}</b>, so they are <b>instance methods</b>. Look at the word “new” in the table: no method changes the old string.</p>' },
      14: { image: false, title: 'Simple Methods for String Objects', blocks: [para('A non-instance method is called a static method. A static method can be invoked without using an object. All the methods defined in the Math class are static methods. We will discuss this later.')],
        explain: '<p>Compare: <code>message.length()</code> needs a string object, but <code>Math.sqrt(4)</code> uses only the class name. That is a <b>{{static|ثابت: تابع للكلاس نفسه لا لكائن}}</b> method.</p>' },
      15: { image: false, blocks: [code('String message = "Welcome to Java";\nSystem.out.println("The length of " + message + " is "\n  + message.length());')],
        explain: '<p><code>length()</code> counts every character, spaces too. Try different strings in the drawing, even the empty string "".</p>' },
      16: { image: false, blocks: [code('String message = "Welcome to Java";\nSystem.out.println("The first character in message is "\n  + message.charAt(0));')],
        explain: '<p>The <b>{{index|الفهرس: رقم المكان}}</b> of the first character is <b>0</b>, so the last one is at <code>length() - 1</code>. An index outside this range stops the program with an error.</p>' },
      17: { image: false, blocks: [code('"Welcome".toLowerCase() // returns welcome.\n"Welcome".toUpperCase() // returns WELCOME.\n"  Welcome  ".trim() returns a new string, Welcome.', 'none')],
        explain: '<p>Three methods that each return a <b>new</b> string. <code>trim()</code> removes the spaces (and tabs, new lines) only at the two <b>ends</b>; spaces in the middle stay.</p>' },
      18: { image: false, blocks: [para('Examples:'), code('String s3 = s1.concat(s2);\nString s3 = s1 + s2;\nString message = "Welcome " + "to " + "Java";\nString s = "Chapter" + 2; // s becomes Chapter2'), code('// String Supplement is concatenated with character B\nString s1 = "Supplement" + \'B\';\n// s1 becomes SupplementB')],
        explain: '<p>To <b>{{concatenate|يدمج / يربط}}</b> means to join. <code>concat</code> and <code>+</code> do the same. If one side of + is a string, the other side (a number or a char) is turned into text and joined. Watch the order: + works from left to right.</p>' },
      19: { image: false, blocks: [code(READW)],
        explain: '<p><code>next()</code> reads one <b>word</b>: it skips spaces, then stops at the next space. Three calls read three words from the same line.</p>' },
      20: { image: false, title: 'Reading a Character from the Console', blocks: [code(READC)],
        explain: '<p>To read one character, read the line with <code>nextLine()</code> and take its first character with <code>charAt(0)</code>.</p>' },
      21: { image: false, blocks: [tblH(['Method', 'Description'], [[c_('equals(s1)'), 'Returns true if this string is equal to string s1.'], [c_('equalsIgnoreCase(s1)'), 'Returns true if this string is equal to string s1; it is case insensitive.'], [c_('compareTo(s1)'), 'Returns an integer greater than 0, equal to 0, or less than 0 to indicate whether this string is greater than, equal to, or less than s1.'], [c_('compareToIgnoreCase(s1)'), 'Same as compareTo except that the comparison is case insensitive.'], [c_('startsWith(prefix)'), 'Returns true if this string starts with the specified prefix.'], [c_('endsWith(suffix)'), 'Returns true if this string ends with the specified suffix.']]), note('Example program: OrderTwoCities')],
        explain: '<p><b>{{case insensitive|لا يفرّق بين الحرف الكبير والصغير}}</b> means \'A\' and \'a\' count as the same. <code>compareTo</code> compares character by character, by code; its sign tells the order. The example program OrderTwoCities uses it to print two city names in alphabetical order.</p>' },
      22: { image: false, blocks: [tblH(['Method', 'Description'], [[c_('substring(beginIndex)'), 'Returns this string’s substring that begins with the character at the specified beginIndex and extends to the end of the string, as shown in Figure 4.2.'], [c_('substring(beginIndex, endIndex)'), 'Returns this string’s substring that begins at the specified beginIndex and extends to the character at index endIndex – 1, as shown in Figure 9.6. Note that the character at endIndex is not part of the substring.']])],
        explain: '<p>A <b>{{substring|جزء من النص}}</b> is a piece of a string. Remember: the begin index is <b>included</b>, the end index is <b>not</b>. So <code>substring(0, 11)</code> has 11 − 0 = 11 characters.</p>' },
      23: { image: false, title: 'Finding a Character or a Substring in a String', blocks: [tblH(['Method', 'Description'], [[c_('indexOf(ch)'), 'Returns the index of the first occurrence of ch in the string. Returns -1 if not matched.'], [c_('indexOf(ch, fromIndex)'), 'Returns the index of the first occurrence of ch after fromIndex in the string. Returns -1 if not matched.'], [c_('indexOf(s)'), 'Returns the index of the first occurrence of string s in this string. Returns -1 if not matched.'], [c_('indexOf(s, fromIndex)'), 'Returns the index of the first occurrence of string s in this string after fromIndex. Returns -1 if not matched.'], [c_('lastIndexOf(ch)'), 'Returns the index of the last occurrence of ch in the string. Returns -1 if not matched.'], [c_('lastIndexOf(ch, fromIndex)'), 'Returns the index of the last occurrence of ch before fromIndex in this string. Returns -1 if not matched.'], [c_('lastIndexOf(s)'), 'Returns the index of the last occurrence of string s. Returns -1 if not matched.'], [c_('lastIndexOf(s, fromIndex)'), 'Returns the index of the last occurrence of string s before fromIndex. Returns -1 if not matched.']])],
        explain: '<p><code>indexOf</code> searches from the start, <code>lastIndexOf</code> from the end. Both return an index, or <b>-1</b> when there is no <b>{{occurrence|ظهور / تكرار}}</b>. -1 is a safe answer, because no real index is negative.</p>' },
      24: { image: false, title: 'Finding a Character or a Substring in a String', blocks: [code("int k = s.indexOf(' ');\nString firstName = s.substring(0, k);\nString lastName = s.substring(k + 1);")],
        explain: '<p>A useful mix: find the space with indexOf, then cut before it and after it with substring. <code>k + 1</code> skips the space itself.</p>' },
      25: { image: false, title: 'Conversion between Strings and Numbers', blocks: [code('int intValue = Integer.parseInt(intString);\ndouble doubleValue = Double.parseDouble(doubleString);'), code('String s = number + "";')],
        explain: '<p>To <b>{{parse|يحلّل: يقرأ النص ويحوّله إلى رقم}}</b> is to read text and turn it into a number. The text must really be a number, or the program stops with an error. The other way is easy: join the number with the empty string "".</p>' },
      26: section('Mathematical Functions', '<p>Third part: the <b>Math</b> class and its ready-made methods.</p>'),
      27: { image: false, blocks: [para('Java provides many useful methods in the Math class for performing common mathematical functions.')],
        explain: '<p>You do not need to write a square root or a power yourself: the Math class already has them.</p>' },
      28: { image: false, title: 'The Math Class', blocks: [para('Class constants:'), bul('PI'), bul('E (the base of natural logarithms)'), para('Class methods:'), bul('Trigonometric Methods'), bul('Exponent Methods'), bul('Rounding Methods'), bul('min, max, abs, and random Methods')],
        explain: '<p>A <b>{{constant|ثابت: قيمة لا تتغير}}</b> is a value that never changes, like <code>Math.PI</code>. The methods are in four groups; the next slides show each group.</p>' },
      29: { image: false, blocks: [code('sin(double a)\ncos(double a)\ntan(double a)\nacos(double a)\nasin(double a)\natan(double a)', 'none'), note('The parameter for sin, cos, and tan is an angle in radians. One degree is equal to π/180 in radians'), para('Examples:'), code('Math.sin(0) returns 0.0\nMath.sin(Math.PI / 6) returns 0.5\nMath.sin(Math.PI / 2) returns 1.0\nMath.cos(0) returns 1.0\nMath.cos(Math.PI / 6) returns 0.866\nMath.cos(Math.PI / 2) returns 0', 'none')],
        explain: '<p><b>{{Trigonometric|مثلثية}}</b> methods work with angles in <b>{{radians|راديان}}</b>. 180° is π radians, so multiply degrees by π/180 first. (On the slide the symbol π appears as “p”.)</p>' },
      30: { image: false, blocks: [tblH(['Method', 'Description'], [[c_('exp(double a)'), 'Returns e raised to the power of a.'], [c_('log(double a)'), 'Returns the natural logarithm of a.'], [c_('log10(double a)'), 'Returns the 10-based logarithm of a.'], [c_('pow(double a, double b)'), 'Returns a raised to the power of b.'], [c_('sqrt(double a)'), 'Returns the square root of a.']]), para('Examples:'), code('Math.exp(1) returns 2.71\nMath.log(2.71) returns 1.0\nMath.pow(2, 3) returns 8.0\nMath.pow(3, 2) returns 9.0\nMath.pow(3.5, 2.5) returns 22.91765\nMath.sqrt(4) returns 2.0\nMath.sqrt(10.5) returns 3.24', 'none')],
        explain: '<p><b>{{Exponent|الأس / القوة}}</b> methods. <code>pow(a, b)</code> is a<sup>b</sup>. A <b>{{logarithm|لوغاريتم}}</b> is the opposite of a power. All these methods return a double, so even <code>Math.pow(2, 3)</code> prints 8.0.</p>' },
      31: { image: false, blocks: [tblH(['Method', 'Description'], [[c_('double ceil(double x)'), 'x rounded <b>up</b> to its nearest integer. This integer is returned as a double value.'], [c_('double floor(double x)'), 'x is rounded <b>down</b> to its nearest integer. This integer is returned as a double value.'], [c_('double rint(double x)'), 'x is rounded to its nearest integer. If x is equally close to two integers, the even one is returned as a double.'], [c_('int round(float x)'), 'Return (int)Math.floor(x+0.5).'], [c_('long round(double x)'), 'Return (long)Math.floor(x+0.5).']])],
        explain: '<p>Four ways to <b>{{round|يقرّب}}</b>: ceil always up, floor always down, rint to the nearest (the even one in a tie), and round to the nearest (up in a tie). ceil, floor and rint give a double; round gives a whole-number type.</p>' },
      32: { image: false, blocks: [code('Math.ceil(2.1) returns 3.0\nMath.ceil(2.0) returns 2.0\nMath.ceil(-2.0) returns -2.0\nMath.ceil(-2.1) returns -2.0\nMath.floor(2.1) returns 2.0\nMath.floor(2.0) returns 2.0\nMath.floor(-2.0) returns -2.0\nMath.floor(-2.1) returns -3.0\nMath.rint(2.1) returns 2.0\nMath.rint(2.0) returns 2.0\nMath.rint(-2.0) returns -2.0\nMath.rint(-2.1) returns -2.0\nMath.rint(2.5) returns 2.0\nMath.rint(-2.5) returns -2.0\nMath.round(2.6f) returns 3\nMath.round(2.0) returns 2\nMath.round(-2.0f) returns -2\nMath.round(-2.6) returns -3', 'none')],
        explain: '<p>Look at the negative numbers: “up” for -2.1 is -2.0 (closer to 0), and “down” is -3.0. In the drawing, put each example on the number line to see it.</p>' },
      33: { image: false, title: 'min, max, and abs', blocks: [tblH(['Method', 'Description'], [[c_('max(a, b)') + ' and ' + c_('min(a, b)'), 'Returns the maximum or minimum of two parameters.'], [c_('abs(a)'), 'Returns the absolute value of the parameter.'], [c_('random()'), 'Returns a random double value in the range [0.0, 1.0).']]), para('Examples:'), code('Math.max(2, 3) returns 3\nMath.max(2.5, 3) returns 3.0\nMath.min(2.5, 3.6) returns 2.5\nMath.abs(-2) returns 2\nMath.abs(-2.1) returns 2.1', 'none')],
        explain: '<p>The <b>{{absolute value|القيمة المطلقة}}</b> is the distance from 0, so it is never negative. The type follows the parameters: two ints give an int, a double gives a double. <code>[0.0, 1.0)</code> means 0.0 is possible but 1.0 is not.</p>' },
      34: { image: false, title: 'The random Method', blocks: [para('Generates a random double value greater than or equal to 0.0 and less than 1.0 (0 <= Math.random() < 1.0).'), para('Examples:'), tblH(['Expression', 'Returns'], [[c_('(int)(Math.random() * 10)'), 'a random integer between 0 and 9.'], [c_('50 + (int)(Math.random() * 50)'), 'a random integer between 50 and 99.']]), para('In general,'), tblH(['Expression', 'Returns'], [[c_('a + Math.random() * b'), 'a random number between a and a + b, excluding a + b.']])],
        explain: '<p>The recipe for a <b>{{random|عشوائي}}</b> whole number: multiply by how many values you want, cut with (int), then add the first value. The drawing shows the three steps on number lines.</p>' },
      35: { image: false, title: 'Case Study: Computing Angles of a Triangle', blocks: [code('A = acos((a * a - b * b - c * c) / (-2 * b * c))\nB = acos((b * b - a * a - c * c) / (-2 * a * c))\nC = acos((c * c - b * b - a * a) / (-2 * a * b))', 'none'), para('Write a program that prompts the user to enter the x- and y-coordinates of the three corner points in a triangle and then displays the triangle’s angles.')],
        explain: '<p>A small project that uses Math: <code>sqrt</code> for the length of each side (the distance between two corners), then <code>acos</code> for each angle. The program in the drawing is one way to write it. Change the corners and see the angles change; they always add up to 180°.</p>' },
      36: { image: false, title: 'Formatting Output', blocks: [para('Use the printf statement.'), code('System.out.printf(format, items);'), para('Where format is a string that may consist of substrings and format specifiers. A format specifier specifies how an item should be displayed. An item may be a numeric value, character, boolean value, or a string. Each specifier begins with a percent sign.')],
        explain: '<p><code>printf</code> prints with a <b>{{format|تنسيق / قالب}}</b>: you write the text once and put a <b>{{specifier|محدِّد}}</b> (like %d) where each value should go.</p>' },
      37: { image: false, blocks: [tblH(['Specifier', 'Output', 'Example'], [[c_('%b'), 'a boolean value', 'true or false'], [c_('%c'), 'a character', "'a'"], [c_('%d'), 'a decimal integer', '200'], [c_('%f'), 'a floating-point number', '45.460000'], [c_('%e'), 'a number in standard scientific notation', '4.556000e+01'], [c_('%s'), 'a string', '"Java is cool"']]), code('int count = 5;\ndouble amount = 45.56;\nSystem.out.printf("count is %d and amount is %f", count, amount);'), note('display: count is 5 and amount is 45.560000')],
        explain: '<p>The specifiers are matched with the items <b>in order</b>: the 1st specifier takes the 1st item, and so on. The type must fit too: %d for an integer, %f for a double.</p>' },
      38: { image: false, blocks: [code('// Display values for 60 degrees\ndegrees = 60;\nradians = Math.toRadians(degrees);\nSystem.out.printf("%-10d%-10.4f%-10.4f%-10.4f%-10.4f\\n", degrees,\n    radians, Math.sin(radians), Math.cos(radians),\n    Math.tan(radians));')],
        explain: '<p>Between % and the letter you can add a <b>{{width|عرض: عدد الخانات}}</b> (10), a <b>{{precision|دقّة: عدد الأرقام بعد الفاصلة}}</b> (.4), and <b>-</b> to put the value on the left. With the same width in every row, the numbers line up in columns, like a table.</p>' }
    },
    visuals: ALL,
    exam: {
      questions: [
        { type: 'output', q: 'What does this print?', code: "char c = 'B';\nSystem.out.println((int) c);", answer: '66', review: 8, why: "'A' is 65, so 'B' is 66." },
        { type: 'output', q: 'What does this print?', code: "char c = 'x';\nc++;\nSystem.out.println(c);", answer: 'y', review: 8, why: '++ gives the next character.' },
        { q: 'What is <code>\\t</code> inside a string?', options: ['The letter t', 'A tab', 'A new line'], answer: 1, review: 7, why: 'Slide 7: \\t is Tab, code 9.' },
        { type: 'output', q: 'What does this print?', code: 'System.out.println("C:\\\\docs");', answer: 'C:\\docs', review: 7, why: '\\\\ in the code is one backslash in the string.' },
        { type: 'output', q: 'What does this print?', code: "System.out.println(Character.isDigit('5'));\nSystem.out.println(Character.isLetter('5'));", answer: 'true\nfalse', review: 10, why: "'5' is a digit, not a letter." },
        { type: 'output', q: 'What does this print?', code: 'String s = "Hello";\nSystem.out.println(s.length() + " " + s.charAt(1));', answer: '5 e', review: 16, why: 'Five characters; index 1 is the second one, e.' },
        { type: 'output', q: 'What does this print?', code: 'String s = "java";\ns.toUpperCase();\nSystem.out.println(s);', answer: 'java', review: 17, why: 'The new string was not saved, and s itself never changes.' },
        { type: 'output', q: 'What does this print?', code: 'System.out.println("Sum: " + 2 + 3);', answer: 'Sum: 23', review: 18, why: 'Left to right: "Sum: 2", then "Sum: 23".' },
        { type: 'output', q: 'And this?', code: 'System.out.println("Sum: " + (2 + 3));', answer: 'Sum: 5', review: 18, why: 'The parentheses are done first, as numbers.' },
        { type: 'output', q: 'What does this print?', code: 'System.out.println("apple".compareTo("banana"));', answer: '-1', review: 21, why: "'a' (97) − 'b' (98) = -1: apple comes first." },
        { type: 'output', q: 'What does this print?', code: 'System.out.println("Welcome".substring(3));', answer: 'come', review: 22, why: 'From index 3 to the end.' },
        { type: 'output', q: 'What does this print?', code: 'System.out.println("Hello World".indexOf(\'o\'));', answer: '4', review: 23, why: 'H0 e1 l2 l3 o4: the first o.' },
        { type: 'output', q: 'What does this print?', code: 'System.out.println(Integer.parseInt("12") + 3);', answer: '15', review: 25, why: 'parseInt gives the int 12, so + adds.' },
        { type: 'output', q: 'What does this print?', code: 'System.out.println(Math.floor(3.7));', answer: '3.0', review: 32, why: 'floor rounds down and returns a double.' },
        { type: 'output', q: 'What does this print?', code: 'System.out.println(Math.round(-2.5));', answer: '-2', review: 31, why: 'round is floor(-2.5 + 0.5) = floor(-2.0) = -2.' },
        { type: 'output', q: 'What does this print?', code: 'System.out.println(Math.min(4, 2.5));', answer: '2.5', review: 33, why: 'The smaller value; one parameter is a double, so it is a double.' },
        { q: 'What values can <code>50 + (int)(Math.random() * 50)</code> have?', options: ['50 to 99', '50 to 100', '0 to 50'], answer: 0, review: 34, why: 'The cast part is 0 to 49; adding 50 gives 50 to 99.' },
        { type: 'output', q: 'What does this print?', code: 'System.out.printf("%d items cost %.2f", 3, 9.5);', answer: '3 items cost 9.50', review: 37, why: '%d takes 3; %.2f shows 9.5 with 2 digits after the point.' },
        { type: 'write', q: 's is a String with at least 3 characters. Store its first three characters in a new String named start.', checks: [{ re: /String\s+start\s*=\s*s\s*\.\s*substring\s*\(\s*0\s*,\s*3\s*\)\s*;/, label: 'String start = s.substring(0, 3);' }], solution: 'String start = s.substring(0, 3);', review: 22, why: 'The begin index 0 is included; the end index 3 is not: characters 0, 1 and 2.' },
        { type: 'write', q: 'Store in a new int pos the index of the first space in the String line.', checks: [{ re: /int\s+pos\s*=\s*line\s*\.\s*indexOf\s*\(\s*(' '|" ")\s*\)\s*;/, label: "int pos = line.indexOf(' ');" }], solution: "int pos = line.indexOf(' ');", review: 23, why: 'indexOf returns the first index of the character, or -1 if it is not there.' },
        { type: 'trace', q: 'What does each call return?', cols: ['call', 'returns'], rows: [['"apple".equals("Apple")', '?false'], ['"apple".equalsIgnoreCase("Apple")', '?true'], ['"Java".startsWith("J")', '?true'], ['"b".compareTo("a")', '?1']], review: 21, why: 'equals is case sensitive; equalsIgnoreCase is not. compareTo gives the difference of the codes: 98 − 97 = 1.' },
        { type: 'bug', q: 'One line does not compile. Tap it.', code: 'String name = "Ali";\nint n = name.length;\nSystem.out.println(n);', answer: 2, review: 13, why: 'length() is a method of String: it needs parentheses, name.length().' },
        { type: 'match', q: 'Match each call with what it returns.', pairs: [['Math.max(3, 8)', '8'], ['Math.abs(-6)', '6'], ['Math.pow(2, 3)', '8.0']], review: 33, why: 'max and abs keep the int type; pow always returns a double.' },
        { type: 'fill', q: 'Make a random int from 1 to 6, like a dice.', code: 'int dice = (int)(Math.random() * ___) + ___;', answer: ['6', '1'], review: 34, why: '(int)(Math.random() * 6) is 0 to 5; adding 1 gives 1 to 6.' }
      ],
      tasks: [
        {
          title: 'Word info',
          task: '<p>Read <b>one word</b> with <code>input.next()</code>. Print its length, its first character in <b>uppercase</b> (use <code>Character.toUpperCase</code>), and its <b>last</b> character.</p>',
          starter: 'import java.util.Scanner;\n\npublic class WordInfo {\n  public static void main(String[] args) {\n    Scanner input = new Scanner(System.in);\n    System.out.print("Enter a word: ");\n    \n  }\n}',
          output: 'Enter a word: java\nLength: 4\nFirst: J\nLast: a',
          checks: [
            { re: /String\s+\w+\s*=\s*input\.next\s*\(\s*\)\s*;/, label: 'Reads the word with <code>input.next()</code>', review: 19 },
            { re: /\.length\s*\(\s*\)/, label: 'Uses <code>length()</code>', review: 15 },
            { fn: function (c) { return /Character\.toUpperCase\s*\(/.test(c) && /\.charAt\s*\(\s*0\s*\)/.test(c); }, label: 'Takes <code>charAt(0)</code> and uses <code>Character.toUpperCase</code>', review: 10 },
            { re: /\.charAt\s*\(\s*\w+\.length\s*\(\s*\)\s*-\s*1\s*\)/, label: 'Last character: <code>charAt(word.length() - 1)</code>', review: 16 },
            { fn: braces, label: 'Braces match', review: 15 }
          ],
          solution: 'import java.util.Scanner;\n\npublic class WordInfo {\n  public static void main(String[] args) {\n    Scanner input = new Scanner(System.in);\n    System.out.print("Enter a word: ");\n    String word = input.next();\n    System.out.println("Length: " + word.length());\n    System.out.println("First: " + Character.toUpperCase(word.charAt(0)));\n    System.out.println("Last: " + word.charAt(word.length() - 1));\n  }\n}'
        },
        {
          title: 'First name and last name',
          task: '<p>Read a full name (like <code>Kim Jones</code>) with <code>input.nextLine()</code>. Find the space with <code>indexOf</code>, then print the part before it and the part after it, as in slide 24.</p>',
          starter: 'import java.util.Scanner;\n\npublic class SplitName {\n  public static void main(String[] args) {\n    Scanner input = new Scanner(System.in);\n    System.out.print("Enter your full name: ");\n    \n  }\n}',
          output: 'Enter your full name: Kim Jones\nFirst name: Kim\nLast name: Jones',
          checks: [
            { re: /String\s+\w+\s*=\s*input\.nextLine\s*\(\s*\)\s*;/, label: 'Reads the line with <code>input.nextLine()</code>', review: 20 },
            { re: /int\s+\w+\s*=\s*\w+\.indexOf\s*\(\s*(' '|" ")\s*\)\s*;/, label: 'Finds the space: <code>int k = s.indexOf(\' \');</code>', review: 24 },
            { re: /\.substring\s*\(\s*0\s*,\s*\w+\s*\)/, label: 'Before the space: <code>substring(0, k)</code>', review: 22 },
            { re: /\.substring\s*\(\s*\w+\s*\+\s*1\s*\)/, label: 'After the space: <code>substring(k + 1)</code>', review: 24 },
            { re: /"First name: "[\s\S]*"Last name: "/, label: 'Prints <code>First name: </code> and <code>Last name: </code>', review: 18 }
          ],
          solution: 'import java.util.Scanner;\n\npublic class SplitName {\n  public static void main(String[] args) {\n    Scanner input = new Scanner(System.in);\n    System.out.print("Enter your full name: ");\n    String s = input.nextLine();\n    int k = s.indexOf(\' \');\n    String firstName = s.substring(0, k);\n    String lastName = s.substring(k + 1);\n    System.out.println("First name: " + firstName);\n    System.out.println("Last name: " + lastName);\n  }\n}'
        },
        {
          title: 'Distance between two points',
          task: '<p>The points (x1, y1) and (x2, y2) are given. Compute the distance with <code>Math.sqrt</code> and <code>Math.pow</code>: the square root of (x2 − x1)² + (y2 − y1)². Print it with <code>printf</code> and 2 digits after the point.</p>',
          starter: 'public class Distance {\n  public static void main(String[] args) {\n    double x1 = 1, y1 = 2, x2 = 4, y2 = 6;\n    \n  }\n}',
          output: 'The distance is 5.00',
          checks: [
            { re: /Math\.sqrt\s*\(/, label: 'Uses <code>Math.sqrt</code>', review: 30 },
            { re: /Math\.pow\s*\(\s*\(?\s*x2\s*-\s*x1\s*\)?\s*,\s*2\s*\)/, label: 'Has <code>Math.pow(x2 - x1, 2)</code>', review: 30 },
            { re: /Math\.pow\s*\(\s*\(?\s*y2\s*-\s*y1\s*\)?\s*,\s*2\s*\)/, label: 'Has <code>Math.pow(y2 - y1, 2)</code>', review: 30 },
            { re: /printf\s*\(\s*"[^"]*%\.2f/, label: 'Prints with <code>printf</code> and <code>%.2f</code>', review: 38 },
            { re: /The distance is/, label: 'Prints <code>The distance is</code>', review: 36 }
          ],
          solution: 'public class Distance {\n  public static void main(String[] args) {\n    double x1 = 1, y1 = 2, x2 = 4, y2 = 6;\n    double distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));\n    System.out.printf("The distance is %.2f", distance);\n  }\n}'
        }
      ]
    }
  });
})();
