/* Visual Java Intermediate - lesson engine.
   Lesson files call addModule({...}). Each lesson has: body (HTML, ~~~ fences for code,
   {{word|عربي}} for Arabic hints), code, steps [{cap, line, out}], draw(k) -> scene items, quiz. */
(function () {
  'use strict';
  var C = window.COURSE;
  var NS = 'http://www.w3.org/2000/svg';
  var TONES = ['ink', 'accent', 'blue', 'teal', 'red', 'muted'];
  var LH = 18;
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- scene primitives used by lesson files ---------------- */
  function assign(a, b) { for (var k in b) if (b[k] !== undefined) a[k] = b[k]; return a; }
  window.B = function (id, x, y, w, h, o) { return assign({ k: 'box', id: id, x: x, y: y, w: w, h: h }, o || {}); };
  window.T = function (id, x, y, text, o) { return assign({ k: 'text', id: id, x: x, y: y, text: text }, o || {}); };
  window.A = function (id, x1, y1, x2, y2, o) { return assign({ k: 'arrow', id: id, x: 0, y: 0, x1: x1, y1: y1, x2: x2, y2: y2 }, o || {}); };
  window.P = function (id, x, y, label, o) { return assign({ k: 'ptr', id: id, x: x, y: y, label: label }, o || {}); };
  window.boxH = function (n) { return n ? 30 + n * LH + 10 : 40; };
  /* UML-style class box */
  window.CLS = function (id, x, y, w, o) {
    o = o || {};
    var lines = (o.fields || []).slice();
    if (o.methods && o.methods.length) { if (lines.length) lines.push('---'); lines = lines.concat(o.methods); }
    var rest = assign({}, o); delete rest.name; delete rest.fields; delete rest.methods;
    return B(id, x, y, w, lines.length ? 30 + lines.length * LH + 10 : 40,
      assign({ title: o.name, lines: lines, tone: 'blue', mono: true, band: true }, rest));
  };
  /* object card */
  window.OBJ = function (id, x, y, w, o) {
    o = o || {};
    var lines = o.fields || [];
    var rest = assign({}, o); delete rest.name; delete rest.fields;
    return B(id, x, y, w, lines.length ? 30 + lines.length * LH + 10 : 40,
      assign({ title: o.name, lines: lines, tone: 'teal', mono: true, r: 16, band: true }, rest));
  };
  /* array / list cells. o: cw, ch, dir:'v', name, hl, done, keys, drop (key that falls in), idx */
  window.ARR = function (p, x, y, vals, o) {
    o = o || {};
    var cw = o.cw || 56, ch = o.ch || 44, v = o.dir === 'v', out = [];
    var hl = [].concat(o.hl == null ? [] : o.hl), done = [].concat(o.done == null ? [] : o.done);
    if (o.name) out.push(T(p + 'n', v ? x + cw / 2 : x - 12, v ? y - 12 : y + ch / 2 + 5, o.name, { anchor: v ? 'middle' : 'end', mono: true, bold: true }));
    vals.forEach(function (val, i) {
      var cx = v ? x : x + i * cw, cy = v ? y + i * ch : y;
      var key = o.keys ? o.keys[i] : i;
      var isH = hl.indexOf(i) >= 0, isD = done.indexOf(i) >= 0;
      out.push(B(p + 'c' + key, cx, cy, cw, ch, {
        title: val == null ? '' : String(val), mono: true, r: 4, size: o.size,
        tone: isH ? 'accent' : isD ? 'teal' : (o.tone || 'muted'), fill: isH ? 'solid' : 'soft',
        from: o.drop === key ? [cx, cy - 70] : undefined
      }));
      if (o.idx !== false) out.push(T(p + 'i' + i, v ? x + cw + 10 : cx + cw / 2, v ? cy + ch / 2 + 5 : cy + ch + 18,
        '[' + i + ']', { anchor: v ? 'start' : 'middle', mono: true, size: 12.5, tone: isH ? 'accent' : 'muted', bold: isH }));
    });
    return out;
  };

  /* ---------------- SVG stage ---------------- */
  function sv(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null && attrs[k] !== false) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function stext(parent, x, y, str, cls, anchor, size) {
    var t = sv('text', { x: x, y: y, 'class': cls, 'text-anchor': anchor || 'start' }, parent);
    if (size) t.style.fontSize = size + 'px';
    var parts = String(str).split('\n');
    if (parts.length === 1) t.textContent = parts[0];
    else parts.forEach(function (p, i) { var s = sv('tspan', { x: x, dy: i ? '1.3em' : 0 }, t); s.textContent = p; });
    return t;
  }
  function drawBox(g, it) {
    var lines = it.lines || [];
    sv('rect', { x: 0, y: 0, width: it.w, height: it.h, rx: it.r != null ? it.r : 8, 'class': 'bx f-' + (it.fill || 'soft') + (it.dash ? ' dash' : '') }, g);
    if (it.tag) stext(g, 0, -7, it.tag, 'tag');
    var hasTitle = it.title != null && it.title !== '';
    var banded = lines.length > 0 || it.band;
    if (hasTitle) {
      var left = it.align === 'left';
      var ty = banded ? 20 : it.h / 2 + 5;
      stext(g, left ? 10 : it.w / 2, ty, it.title, 'bt' + (it.mono ? ' mono' : '') + (it.italic ? ' it' : ''), left ? 'start' : 'middle', it.size);
      if (banded) sv('line', { x1: 0, x2: it.w, y1: 30, y2: 30, 'class': 'sep' }, g);
    }
    var by = hasTitle ? 47 : 19;
    lines.forEach(function (ln) {
      var L = typeof ln === 'string' ? { t: ln } : ln;
      if (L.t === '---') sv('line', { x1: 0, x2: it.w, y1: by - 5, y2: by - 5, 'class': 'sep' }, g);
      else stext(g, 10, by, L.t, 'bl' + (it.prose ? ' prose' : '') + (L.tone ? ' lt-' + L.tone : '') + (L.b ? ' lt-b' : '') + (L.strike ? ' strike' : ''), 'start', it.lsize);
      by += LH;
    });
  }
  function drawArrow(g, it, tone) {
    var x1 = it.x1, y1 = it.y1, x2 = it.x2, y2 = it.y2, d, lx, ly;
    var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    if (it.bend) {
      var dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
      var cx = mx - dy / L * it.bend, cy = my + dx / L * it.bend;
      d = 'M' + x1 + ',' + y1 + ' Q' + cx + ',' + cy + ' ' + x2 + ',' + y2;
      lx = (x1 + 2 * cx + x2) / 4; ly = (y1 + 2 * cy + y2) / 4;
    } else { d = 'M' + x1 + ',' + y1 + ' L' + x2 + ',' + y2; lx = mx; ly = my; }
    sv('path', { d: d, pathLength: it.dash ? null : 1, 'class': 'ar' + (it.dash ? ' dash' : ' draw'), 'marker-end': it.head === false ? null : 'url(#ah-' + tone + ')' }, g);
    if (it.label) stext(g, lx + (it.lx || 0), ly - 7 + (it.ly || 0), it.label, 'al', it.la || 'middle');
  }
  function drawPtr(g, it, tone) {
    var L = it.len || 28, dir = it.dir || 'down', p, lx, ly, an;
    if (dir === 'down') { p = 'M0,' + (-L) + ' L0,-2'; lx = 0; ly = -L - 6; an = 'middle'; }
    else if (dir === 'up') { p = 'M0,' + L + ' L0,2'; lx = 0; ly = L + 15; an = 'middle'; }
    else if (dir === 'left') { p = 'M' + L + ',0 L2,0'; lx = L + 6; ly = 4.5; an = 'start'; }
    else { p = 'M' + (-L) + ',0 L-2,0'; lx = -L - 6; ly = 4.5; an = 'end'; }
    sv('path', { d: p, 'class': 'ar', 'marker-end': 'url(#ah-' + tone + ')' }, g);
    if (it.label != null && it.label !== '') stext(g, lx, ly, it.label, 'pl mono', an);
  }
  function sigOf(it) {
    var o = {};
    for (var k in it) if (k !== 'o' && k !== 'from' && (it.k === 'arrow' || (k !== 'x' && k !== 'y'))) o[k] = it[k];
    return JSON.stringify(o);
  }
  function Stage(svg, vb) {
    this.svg = svg; this.nodes = new Map();
    svg.setAttribute('viewBox', '0 0 ' + vb[0] + ' ' + vb[1]);
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var defs = sv('defs', null, svg);
    var pat = sv('pattern', { id: 'dots', width: 20, height: 20, patternUnits: 'userSpaceOnUse' }, defs);
    sv('circle', { cx: 1.5, cy: 1.5, r: 1.1, 'class': 'dotp' }, pat);
    TONES.forEach(function (t) {
      var m = sv('marker', { id: 'ah-' + t, viewBox: '0 0 10 10', refX: 8.5, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' }, defs);
      sv('path', { d: 'M0,0 L10,5 L0,10 z', 'class': 'mk t-' + t }, m);
    });
    sv('rect', { x: 0, y: 0, width: vb[0], height: vb[1], fill: 'url(#dots)' }, svg);
    this.layers = [0, 1, 2].map(function () { return sv('g', null, svg); });
  }
  function setT(g, x, y) { g.style.transform = 'translate(' + x + 'px,' + y + 'px)'; }
  function pulse(g) { g.classList.remove('pulse'); void g.getBoundingClientRect(); g.classList.add('pulse'); }
  Stage.prototype.render = function (list) {
    var self = this, seen = new Set(), entering = [];
    var items = [].concat(list).flat(Infinity).filter(Boolean);
    items.forEach(function (it) {
      seen.add(it.id);
      var z = it.z != null ? it.z : (it.k === 'box' ? 1 : 2);
      var n = self.nodes.get(it.id), fresh = !n;
      if (fresh) {
        n = { g: sv('g', null, self.layers[z]), sig: null, z: z };
        self.nodes.set(it.id, n);
        n.g.style.opacity = '0';
        if (it.from) setT(n.g, it.from[0], it.from[1]); else setT(n.g, it.x, it.y);
      } else if (n.leave) { clearTimeout(n.leave); n.leave = null; }
      if (n.z !== z) { self.layers[z].appendChild(n.g); n.z = z; }
      var sig = sigOf(it);
      if (sig !== n.sig) {
        while (n.g.firstChild) n.g.removeChild(n.g.firstChild);
        var tone = it.tone || (it.k === 'ptr' ? 'accent' : 'ink');
        n.g.setAttribute('class', 'vz t-' + tone + (it.hi ? ' hi' : ''));
        var inner = sv('g', { 'class': 'in' }, n.g);
        if (it.k === 'box') drawBox(inner, it);
        else if (it.k === 'text') stext(inner, 0, 0, it.text, 'tt' + (it.mono ? ' mono' : '') + (it.bold ? ' b' : '') + (it.italic ? ' it' : ''), it.anchor, it.size);
        else if (it.k === 'arrow') drawArrow(inner, it, tone);
        else if (it.k === 'ptr') drawPtr(inner, it, tone);
        if (n.sig !== null && it.k !== 'arrow' && it.k !== 'ptr' && !reduced) pulse(inner);
        n.sig = sig;
      }
      var op = it.o != null ? it.o : 1;
      if (fresh) entering.push([n.g, op, it.x, it.y]);
      else { n.g.style.opacity = op; setT(n.g, it.x, it.y); }
    });
    /* one forced style flush, then set final values: transitions run, and the end state
       is correct even when the page is hidden and animation frames are paused */
    if (entering.length) {
      void this.svg.getBoundingClientRect();
      entering.forEach(function (e) { e[0].style.opacity = e[1]; setT(e[0], e[2], e[3]); });
    }
    this.nodes.forEach(function (n, id) {
      if (!seen.has(id) && !n.leave) {
        n.g.style.opacity = '0';
        n.leave = setTimeout(function () { n.g.remove(); self.nodes.delete(id); }, 400);
      }
    });
  };

  /* ---------------- text helpers ---------------- */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function gl(s) {
    return String(s == null ? '' : s).replace(/\{\{([^|}]+)\|([^}]+)\}\}/g, function (m, w, a) {
      return '<span class="gl" tabindex="0" data-ar="' + esc(a) + '">' + w + '</span>';
    });
  }
  function inl(s) { return gl(esc(s).replace(/`([^`]+)`/g, '<code>$1</code>')); }
  var KW = {};
  ('abstract boolean break byte case catch char class continue default do double else enum extends final finally float for if implements import instanceof int interface long new null package private protected public return short static super switch this throw throws try void while true false var').split(' ').forEach(function (k) { KW[k] = 1; });
  function hlJava(src) {
    var re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])+')|(@[A-Za-z]+)|\b(\d+(?:\.\d+)?[fFdDlL]?)\b|([A-Za-z_$][\w$]*)/g;
    var out = '', last = 0, m;
    function wrap(cls, t) { return t.split('\n').map(function (x) { return x ? '<span class="' + cls + '">' + esc(x) + '</span>' : ''; }).join('\n'); }
    while ((m = re.exec(src))) {
      out += esc(src.slice(last, m.index)); last = re.lastIndex;
      if (m[1]) out += wrap('c-com', m[0]);
      else if (m[2]) out += wrap('c-str', m[0]);
      else if (m[3]) out += wrap('c-ann', m[0]);
      else if (m[4]) out += wrap('c-num', m[0]);
      else {
        var id = m[5];
        if (KW[id]) out += wrap('c-kw', id);
        else if (/^[A-Z]/.test(id)) out += wrap('c-type', id);
        else if (/^\s*\(/.test(src.slice(last))) out += wrap('c-fn', id);
        else out += esc(id);
      }
    }
    out += esc(src.slice(last));
    return out.split('\n');
  }
  function codeBlock(src) {
    return '<pre class="code block">' + hlJava(src.replace(/^\n/, '').replace(/\s+$/, '')).map(function (l) { return '<span class="ln">' + (l || ' ') + '</span>'; }).join('') + '</pre>';
  }
  function rich(html) {
    return String(html).split('~~~').map(function (part, i) { return i % 2 ? codeBlock(part) : gl(part); }).join('');
  }
  function lineSet(spec) {
    var s = new Set();
    [].concat(spec == null ? [] : spec).forEach(function (x) {
      if (typeof x === 'string' && x.indexOf('-') > 0) { var ab = x.split('-').map(Number); for (var i = ab[0]; i <= ab[1]; i++) s.add(i); }
      else s.add(Number(x));
    });
    return s;
  }

  /* ---------------- course index + progress ---------------- */
  var flat = [], byId = {};
  C.modules.forEach(function (m, mi) {
    m.n = mi + 1;
    m.lessons.forEach(function (l, li) { l.m = m; l.n = li + 1; l.kind = 'lesson'; flat.push(l); });
    if (m.challenge) { var ch = m.challenge; ch.id = m.id + '-ch'; ch.m = m; ch.kind = 'challenge'; flat.push(ch); }
  });
  flat.forEach(function (x, i) { x.i = i; byId[x.id] = x; });

  var KEY = 'vji-progress-v1';
  var S = { done: {}, last: null, hints: true, drafts: {} };
  try { var raw = localStorage.getItem(KEY); if (raw) S = assign(S, JSON.parse(raw)); } catch (e) { }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
  function countDone(list) { return list.filter(function (x) { return S.done[x.id]; }).length; }
  function itemsOf(m) { return m.lessons.concat(m.challenge ? [m.challenge] : []); }

  var main = document.getElementById('main');
  var side = document.getElementById('side');
  var curViz = null, curId = null;

  /* ---------------- sidebar ---------------- */
  function renderSide() {
    var d = countDone(flat);
    side.innerHTML =
      '<a class="brand" href="#home"><small>Java · Intermediate</small><b>Visual Java</b></a>' +
      '<div class="prog"><div class="bar"><i style="width:' + Math.round(d / flat.length * 100) + '%"></i></div><span>' + d + ' of ' + flat.length + ' done</span></div>' +
      '<nav class="mods-nav">' + C.modules.map(function (m) {
        return '<div class="mnav"><h3>Module ' + m.n + ' <em>·</em> ' + esc(m.title) + '</h3>' +
          itemsOf(m).map(function (x) {
            var cls = (x.id === curId ? ' on' : '') + (S.done[x.id] ? ' done' : '') + (x.kind === 'challenge' ? ' ch' : '');
            return '<a href="#' + x.id + '" class="' + cls + '"' + (x.id === curId ? ' aria-current="page"' : '') + '><span class="st"></span>' +
              (x.kind === 'challenge' ? 'Code challenge' : esc(x.title)) + '</a>';
          }).join('') + '</div>';
      }).join('') + '</nav>' +
      '<div class="sidefoot"><button class="toggle" id="hintsBtn" aria-pressed="' + (S.hints ? 'true' : 'false') + '"><span>Arabic hints <span class="ar">ترجمة الكلمات</span></span><span class="sw"></span></button></div>';
    document.getElementById('hintsBtn').onclick = function () {
      S.hints = !S.hints; save(); applyHints(); this.setAttribute('aria-pressed', S.hints ? 'true' : 'false');
    };
    var on = side.querySelector('a.on');
    if (on && on.scrollIntoView) { var r = on.getBoundingClientRect(); if (r.top < 0 || r.bottom > innerHeight) on.scrollIntoView({ block: 'center' }); }
  }
  function applyHints() { document.body.classList.toggle('no-hints', !S.hints); }

  /* ---------------- viz controller ---------------- */
  function setupViz(root, l, opts) {
    opts = opts || {};
    var q = function (s) { return root.querySelector(s); };
    var stage = new Stage(q('.stage'), l.vb || [560, 340]);
    var steps = l.steps, k = 0, timer = null;
    var cap = q('.cap'), stepno = q('.stepno'), dots = q('.dots'), prev = q('.prev'), next = q('.next'), play = q('.play');
    var codep = q('.code.panel'), cons = q('.console'), out = cons && cons.querySelector('pre');
    var hasOut = steps.some(function (s) { return s.out != null; });
    if (cons) cons.hidden = !hasOut;
    dots.innerHTML = steps.map(function (s, i) { return '<button class="dot" data-i="' + i + '" aria-label="Go to step ' + (i + 1) + '"></button>'; }).join('');
    function go(i) {
      k = Math.max(0, Math.min(steps.length - 1, i));
      var s = steps[k];
      try { stage.render(l.draw(k, s)); } catch (e) { console.error(l.id, e); }
      cap.innerHTML = gl(s.cap);
      if (stepno) stepno.textContent = 'Step ' + (k + 1) + ' of ' + steps.length;
      if (codep) {
        var on = lineSet(s.line), first = null;
        codep.querySelectorAll('.ln').forEach(function (ln, idx) {
          var hit = on.has(idx + 1); ln.classList.toggle('on', hit); if (hit && !first) first = ln;
        });
        if (first) {
          var top = first.offsetTop - codep.clientHeight / 3;
          codep.scrollTo({ top: Math.max(0, top), behavior: reduced ? 'auto' : 'smooth' });
        }
      }
      if (out) {
        var lines = [], newFrom = 0;
        for (var j = 0; j <= k; j++) {
          if (steps[j].clear) lines = [];
          if (j === k) newFrom = lines.length;
          if (steps[j].out != null) lines = lines.concat(steps[j].out);
        }
        out.innerHTML = lines.map(function (t, idx) { return idx >= newFrom ? '<span class="new">' + esc(t) + '</span>' : esc(t); }).join('\n') || '<span style="opacity:.4">(nothing printed yet)</span>';
      }
      prev.disabled = k === 0;
      next.innerHTML = k === steps.length - 1 ? 'Replay ↺' : 'Next ▶';
      dots.querySelectorAll('.dot').forEach(function (d, idx) { d.classList.toggle('on', idx === k); d.classList.toggle('past', idx < k); });
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } if (play) play.textContent = 'Play'; }
    function startPlay(loop) {
      if (k === steps.length - 1) go(0);
      timer = setInterval(function () {
        if (k >= steps.length - 1) { if (loop) go(0); else stop(); return; }
        go(k + 1);
      }, opts.interval || 2800);
      if (play) play.textContent = 'Pause';
    }
    next.onclick = function () { stop(); go(k === steps.length - 1 ? 0 : k + 1); };
    prev.onclick = function () { stop(); go(k - 1); };
    if (play) play.onclick = function () { if (timer) stop(); else startPlay(false); };
    dots.onclick = function (e) { var d = e.target.closest('.dot'); if (d) { stop(); go(+d.dataset.i); } };
    go(0);
    if (opts.autoplay && !reduced) startPlay(true);
    return { stop: stop, step: function (d) { stop(); go(k + d); } };
  }
  function vizHTML(l, label) {
    return '<div class="vizhead"><span class="vlabel">' + (label || 'See it') + '</span><span class="stepno"></span></div>' +
      '<div class="stagewrap"><svg class="stage" role="img" aria-label="Step by step drawing for: ' + esc(l.title) + '"></svg></div>' +
      '<p class="cap" aria-live="polite"></p>' +
      '<div class="ctrl"><button class="btn prev">◀ Back</button><div class="dots"></div><button class="btn play">Play</button><button class="btn primary next">Next ▶</button></div>' +
      (l.code ? '<pre class="code panel">' + hlJava(l.code).map(function (t, i) { return '<span class="ln" data-n="' + (i + 1) + '">' + (t || ' ') + '</span>'; }).join('') + '</pre>' : '') +
      '<div class="console"><div class="clabel">Output</div><pre></pre></div>';
  }

  /* ---------------- quiz ---------------- */
  function blanksHTML(code, qid, answers) {
    var b = 0;
    return '<pre class="code block">' + hlJava(code).map(function (line) {
      line = line.replace(/___/g, function () {
        var w = Math.max(4, String(answers[b] || '').split('|')[0].length + 1);
        var h = '<input class="blank" id="' + qid + '-b' + b + '" data-b="' + b + '" aria-label="Blank ' + (b + 1) + '" autocomplete="off" autocapitalize="off" spellcheck="false" style="width:' + w + 'ch">';
        b++; return h;
      });
      return '<span class="ln">' + (line || ' ') + '</span>';
    }).join('') + '</pre>';
  }
  function quizHTML(l) {
    if (!l.quiz || !l.quiz.length) return '';
    return '<section class="quiz" aria-labelledby="qh"><h2 id="qh">Check yourself</h2>' +
      '<p class="qintro">Answer all ' + l.quiz.length + ' questions to finish this lesson.</p>' +
      l.quiz.map(function (q, i) {
        var qid = 'q-' + l.id + '-' + i;
        var head = '<div class="qq"><span class="qn">Q' + (i + 1) + '</span><div>' + gl(q.q) + '</div></div>';
        if (q.type === 'fill') {
          return '<div class="q" data-i="' + i + '">' + head + blanksHTML(q.code, qid, q.answer) +
            '<div class="qrow"><button class="btn primary qcheck">Check</button><button class="btn qshow" hidden>Show answer</button></div><div class="why" hidden></div></div>';
        }
        return '<div class="q" data-i="' + i + '">' + head + (q.code ? codeBlock(q.code) : '') +
          '<div class="opts">' + q.options.map(function (o, j) { return '<button class="opt" data-j="' + j + '">' + inl(o) + '</button>'; }).join('') + '</div><div class="why" hidden></div></div>';
      }).join('') +
      '<div class="qdone" hidden>Lesson complete. Great work!</div>' +
      (S.done[l.id] ? '' : '<button class="skip">Skip the questions and mark this lesson as done</button>') +
      '</section>';
  }
  function markDone(id) {
    if (!S.done[id]) { S.done[id] = true; save(); renderSide(); }
  }
  function setupQuiz(l) {
    var sec = main.querySelector('.quiz'); if (!sec) return;
    var solved = new Set();
    var doneBox = sec.querySelector('.qdone');
    function solve(i) {
      solved.add(i);
      sec.querySelector('.q[data-i="' + i + '"]').classList.add('solved');
      if (solved.size === l.quiz.length) { doneBox.hidden = false; markDone(l.id); var sk = sec.querySelector('.skip'); if (sk) sk.remove(); }
    }
    var skip = sec.querySelector('.skip');
    if (skip) skip.onclick = function () { markDone(l.id); skip.remove(); };
    sec.querySelectorAll('.q').forEach(function (box) {
      var i = +box.dataset.i, q = l.quiz[i], why = box.querySelector('.why');
      if (q.type === 'fill') {
        var tries = 0, inputs = box.querySelectorAll('.blank'), show = box.querySelector('.qshow');
        var norm = function (s) { return String(s).replace(/\s+/g, ''); };
        var ok = function (inp) {
          return String(q.answer[+inp.dataset.b]).split('|').some(function (a) { return norm(a) === norm(inp.value); });
        };
        var check = function () {
          var all = true;
          inputs.forEach(function (inp) { var g = ok(inp); inp.classList.toggle('ok', g); inp.classList.toggle('bad', !g); all = all && g; });
          why.hidden = false;
          if (all) { why.className = 'why ok'; why.innerHTML = '<b>Correct!</b> ' + gl(q.why || ''); solve(i); show.hidden = true; }
          else { tries++; why.className = 'why bad'; why.innerHTML = '<b>Not yet.</b> Look at the red blanks and try again.' + (q.hint ? ' Hint: ' + gl(q.hint) : ''); if (tries >= 2) show.hidden = false; }
        };
        box.querySelector('.qcheck').onclick = check;
        inputs.forEach(function (inp) { inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); }); });
        show.onclick = function () {
          inputs.forEach(function (inp) { inp.value = String(q.answer[+inp.dataset.b]).split('|')[0]; });
          check();
        };
      } else {
        box.querySelectorAll('.opt').forEach(function (b) {
          b.onclick = function () {
            var j = +b.dataset.j;
            why.hidden = false;
            if (j === q.answer) {
              b.classList.add('ok');
              box.querySelectorAll('.opt').forEach(function (x) { x.disabled = true; });
              why.className = 'why ok'; why.innerHTML = '<b>Correct!</b> ' + gl(q.why || '');
              solve(i);
            } else {
              b.classList.add('bad'); b.disabled = true;
              why.className = 'why bad'; why.innerHTML = '<b>Not this one.</b> Try another answer.';
            }
          };
        });
      }
    });
  }

  function navHTML(x) {
    var p = flat[x.i - 1], n = flat[x.i + 1];
    var name = function (y) { return y.kind === 'challenge' ? 'Code challenge: ' + y.title : y.title; };
    return '<nav class="lnav" aria-label="Lesson navigation">' +
      (p ? '<a href="#' + p.id + '"><small>◀ Previous</small>' + esc(name(p)) + '</a>' : '<span></span>') +
      (n ? '<a class="nx" href="#' + n.id + '"><small>Next ▶</small>' + esc(name(n)) + '</a>' : '<a class="nx" href="#home"><small>Finished</small>Back to the course home</a>') +
      '</nav>';
  }

  /* ---------------- pages ---------------- */
  function renderLesson(l) {
    var m = l.m;
    main.innerHTML = '<div class="wrap">' +
      '<header class="lhead"><div class="eyebrow">Module ' + m.n + ' · ' + esc(m.title) + '</div><h1>' + esc(l.title) + '</h1>' +
      '<div class="meta">Lesson ' + l.n + ' of ' + m.lessons.length + (S.done[l.id] ? ' · <span class="donepill">Done</span>' : '') + '</div></header>' +
      '<div class="lgrid"><article class="read">' + rich(l.body) + '</article>' +
      '<section class="viz" aria-label="Step by step drawing">' + vizHTML(l) + '</section></div>' +
      quizHTML(l) + navHTML(l) + '</div>';
    curViz = setupViz(main.querySelector('.viz'), l);
    setupQuiz(l);
  }

  function stripComments(s) { return s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, ''); }
  function renderChallenge(ch) {
    var m = ch.m, draft = S.drafts && S.drafts[ch.id];
    main.innerHTML = '<div class="wrap">' +
      '<header class="lhead"><div class="eyebrow">Module ' + m.n + ' · ' + esc(m.title) + ' · Code challenge</div><h1>' + esc(ch.title) + '</h1>' +
      '<div class="meta">Write the code yourself' + (S.done[ch.id] ? ' · <span class="donepill">Done</span>' : '') + '</div></header>' +
      '<div class="chgrid"><article class="read">' + rich(ch.task) +
      '<div class="expect"><div class="clabel">Expected output</div><pre>' + esc(ch.output) + '</pre></div>' +
      '<p class="small">The checker looks for the important parts of your code. It does not run Java. To run your code for real, paste it into an online Java compiler such as <a href="https://www.jdoodle.com/online-java-compiler" target="_blank" rel="noopener">JDoodle</a>.</p></article>' +
      '<section class="edbox" aria-label="Code editor"><label class="clabel" for="ed-' + ch.id + '" style="color:var(--ink-2)">Your code</label>' +
      '<textarea class="editor" id="ed-' + ch.id + '" spellcheck="false" autocapitalize="off" autocomplete="off">' + esc(draft || ch.starter) + '</textarea>' +
      '<div class="qrow"><button class="btn primary" id="chk">Check my code</button><button class="btn" id="rst">Start again</button><button class="btn" id="sol">Show solution</button></div>' +
      '<div class="result" id="res" hidden></div><ul class="checks" id="checks">' +
      ch.checks.map(function (c) { return '<li class="wait"><b>•</b><span>' + gl(c.label) + '</span></li>'; }).join('') + '</ul>' +
      '<div id="solbox" hidden><div class="clabel" style="color:var(--ink-2);margin-bottom:6px">One possible solution</div>' + codeBlock(ch.solution) + '</div>' +
      '</section></div>' + navHTML(ch) + '</div>';
    var ed = document.getElementById('ed-' + ch.id), res = document.getElementById('res');
    var t = null;
    ed.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { S.drafts = S.drafts || {}; S.drafts[ch.id] = ed.value; save(); }, 400); });
    ed.addEventListener('keydown', function (e) {
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        var a = ed.selectionStart, b = ed.selectionEnd;
        ed.value = ed.value.slice(0, a) + '    ' + ed.value.slice(b);
        ed.selectionStart = ed.selectionEnd = a + 4;
      }
    });
    document.getElementById('chk').onclick = function () {
      var code = stripComments(ed.value), pass = 0;
      var lis = document.querySelectorAll('#checks li');
      ch.checks.forEach(function (c, i) {
        var ok = c.re.test(code); if (ok) pass++;
        lis[i].className = ok ? 'ok' : 'bad'; lis[i].querySelector('b').textContent = ok ? '✓' : '✗';
      });
      res.hidden = false;
      if (pass === ch.checks.length) { res.className = 'result ok'; res.textContent = 'All checks passed. Challenge complete!'; markDone(ch.id); }
      else { res.className = 'result bad'; res.textContent = pass + ' of ' + ch.checks.length + ' checks passed. Fix the red items and check again.'; }
    };
    document.getElementById('rst').onclick = function () { ed.value = ch.starter; if (S.drafts) { delete S.drafts[ch.id]; save(); } };
    document.getElementById('sol').onclick = function () {
      var sb = document.getElementById('solbox'); sb.hidden = !sb.hidden; this.textContent = sb.hidden ? 'Show solution' : 'Hide solution';
    };
  }

  function renderHome() {
    var d = countDone(flat);
    var cont = S.last && byId[S.last] ? S.last : flat[0].id;
    var demo = byId['m4-1'];
    main.innerHTML = '<div class="wrap">' +
      '<section class="hero"><div><div class="eyebrow">Java · Intermediate level</div>' +
      '<h1>Java Intermediate, <span>drawn step by step</span></h1>' +
      '<p class="lead">Short lessons in simple English. Every lesson has a drawing that moves one step at a time, together with the code. You can <b>see</b> what Java does.</p>' +
      '<div class="heroact"><a class="btn primary big" href="#' + cont + '">' + (S.last ? 'Continue learning' : 'Start the course') + '</a><span>' + d + ' of ' + flat.length + ' lessons and challenges done</span></div></div>' +
      (demo ? '<div class="demo" aria-label="Example drawing">' + vizHTML(demo, 'Example: a loop over an array') + '</div>' : '') + '</section>' +
      '<section class="how"><h2>How each lesson works</h2><div class="howgrid">' +
      '<div><b>Read</b><p>Short, simple text. Java words stay in English, like <code>class</code> and <code>extends</code>.</p></div>' +
      '<div><b>Watch</b><p>Press <b>Next</b>. The drawing, the code line and the output move together.</p></div>' +
      '<div><b>Practice</b><p>Quick questions after each lesson. A code challenge at the end of each module.</p></div>' +
      '<div><b>Arabic help</b><p>Hard words have a {{dotted line|خط منقّط}}. Point at them (or tap them) to see the Arabic.</p></div>' +
      '</div></section>' +
      '<section class="modsec"><h2>Modules</h2><div class="modgrid">' + C.modules.map(function (m) {
        var its = itemsOf(m), dn = countDone(its);
        return '<a class="mcard" href="#' + its[0].id + '"><small>Module ' + m.n + '</small><h3>' + esc(m.title) + '</h3><p>' + gl(m.blurb) + '</p>' +
          '<div class="bar"><i style="width:' + Math.round(dn / its.length * 100) + '%"></i></div>' +
          '<div class="meta"><span>' + m.lessons.length + ' lessons + challenge</span><span>' + dn + '/' + its.length + '</span></div></a>';
      }).join('') + '</div></section>' +
      '<footer class="foot">The topics follow the outline of the Sololearn "Java Intermediate" course. The lessons, drawings and questions on this page are written new, in simple English, for learners whose English is at a middle level.</footer>' +
      '</div>';
    main.querySelector('.foot').innerHTML = gl(main.querySelector('.foot').innerHTML);
    main.querySelector('.howgrid').innerHTML = gl(main.querySelector('.howgrid').innerHTML);
    if (demo) curViz = setupViz(main.querySelector('.demo'), demo, { autoplay: true, interval: 2400 });
  }

  /* ---------------- router ---------------- */
  function route() {
    if (curViz) curViz.stop();
    curViz = null;
    closeNav();
    var id = (location.hash || '').slice(1);
    var it = byId[id];
    curId = it ? id : null;
    if (it) { S.last = id; save(); if (it.kind === 'lesson') renderLesson(it); else renderChallenge(it); document.title = (it.kind === 'challenge' ? 'Challenge: ' + it.title : it.title) + ' · Visual Java Intermediate'; }
    else { renderHome(); document.title = 'Visual Java Intermediate'; }
    renderSide();
    window.scrollTo(0, 0);
  }

  /* ---------------- glossary tooltip ---------------- */
  var tip = document.getElementById('tip'), tipFor = null;
  function showTip(el) {
    if (!S.hints) return;
    tipFor = el; tip.textContent = el.getAttribute('data-ar'); tip.hidden = false;
    var r = el.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight;
    var x = Math.max(8, Math.min(innerWidth - tw - 8, r.left + r.width / 2 - tw / 2));
    var y = r.top - th - 8; if (y < 8) y = r.bottom + 8;
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  }
  function hideTip() { tip.hidden = true; tipFor = null; }
  document.addEventListener('pointerover', function (e) { var g = e.target.closest && e.target.closest('.gl'); if (g && e.pointerType !== 'touch') showTip(g); });
  document.addEventListener('pointerout', function (e) { var g = e.target.closest && e.target.closest('.gl'); if (g && e.pointerType !== 'touch') hideTip(); });
  document.addEventListener('focusin', function (e) { if (e.target.classList && e.target.classList.contains('gl')) showTip(e.target); });
  document.addEventListener('focusout', function (e) { if (e.target.classList && e.target.classList.contains('gl')) hideTip(); });
  document.addEventListener('click', function (e) {
    var g = e.target.closest && e.target.closest('.gl');
    if (g) { if (tipFor === g) hideTip(); else showTip(g); } else if (tipFor) hideTip();
  });
  addEventListener('scroll', function () { if (tipFor) hideTip(); }, { passive: true });

  /* ---------------- mobile nav + keys ---------------- */
  var scrim = document.getElementById('scrim');
  function closeNav() { document.body.classList.remove('nav-open'); scrim.hidden = true; }
  document.getElementById('menu').onclick = function () { document.body.classList.add('nav-open'); scrim.hidden = false; };
  scrim.onclick = closeNav;
  document.addEventListener('keydown', function (e) {
    var tg = e.target.tagName;
    if (tg === 'INPUT' || tg === 'TEXTAREA' || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'Escape') { closeNav(); hideTip(); }
    if (!curViz) return;
    if (e.key === 'ArrowRight') { curViz.step(1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { curViz.step(-1); e.preventDefault(); }
  });

  applyHints();
  addEventListener('hashchange', route);
  route();
})();
