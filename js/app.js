/* Visual Java - slide engine.
   The course order and the slides come from content/manifest.json and content/<course>/<lesson>/lesson.json
   (a copy of the instructor's slides, made by tools/sync-content.js). Each lesson can have a teaching file
   js/units/<course>/<lesson>.js that calls addUnit({...}) with parts, explanations, visuals, a quick quiz per part
   and a unit exam (questions + written tasks). A visual can cover several slides in a row; its steps can point at a slide with `slide: n`. */
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var TONES = ['ink', 'accent', 'blue', 'teal', 'red', 'muted'];
  var LH = 18;
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- scene primitives used by unit files ---------------- */
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
    t.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
    if (size) t.style.fontSize = size + 'px';
    var parts = String(str).split('\n');
    if (parts.length === 1) t.textContent = parts[0];
    else parts.forEach(function (p, i) { var s = sv('tspan', { x: x, dy: i ? '1.3em' : 0 }, t); s.textContent = p; });
    return t;
  }
  /* box outlines: rect (default), diamond, para (parallelogram), display (flowchart output), oval */
  function shapeOf(g, it, cls) {
    var w = it.w, h = it.h, s;
    if (it.shape === 'diamond') return sv('polygon', { points: [w / 2 + ',0', w + ',' + h / 2, w / 2 + ',' + h, '0,' + h / 2].join(' '), 'class': cls }, g);
    if (it.shape === 'para') { s = Math.min(h * 0.45, w * 0.18); return sv('polygon', { points: [s + ',0', w + ',0', (w - s) + ',' + h, '0,' + h].join(' '), 'class': cls }, g); }
    if (it.shape === 'display') {
      s = Math.min(h * 0.5, w * 0.2);
      return sv('path', { d: 'M0,' + h / 2 + ' L' + s + ',0 L' + (w - h / 2) + ',0 A' + h / 2 + ',' + h / 2 + ' 0 0 1 ' + (w - h / 2) + ',' + h + ' L' + s + ',' + h + ' Z', 'class': cls }, g);
    }
    return sv('rect', { x: 0, y: 0, width: w, height: h, rx: it.shape === 'oval' ? h / 2 : (it.r != null ? it.r : 8), 'class': cls }, g);
  }
  function drawBox(g, it) {
    var lines = it.lines || [];
    var bcls = 'bx f-' + (it.fill || 'soft') + (it.dash ? ' dash' : '');
    shapeOf(g, it, bcls);
    if (it.tag) stext(g, 0, -7, it.tag, 'tag');
    var hasTitle = it.title != null && it.title !== '';
    var banded = lines.length > 0 || it.band;
    if (hasTitle) {
      var left = it.align === 'left';
      var nl = String(it.title).split('\n').length;
      var ty = banded ? 20 : it.h / 2 + 5 - (nl - 1) * 0.65 * (it.size || 14);
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
    if (it.via && it.via.length) {
      d = 'M' + x1 + ',' + y1 + it.via.map(function (p) { return ' L' + p[0] + ',' + p[1]; }).join('') + ' L' + x2 + ',' + y2;
      lx = (x1 + it.via[0][0]) / 2; ly = (y1 + it.via[0][1]) / 2;
    } else if (it.bend) {
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
  function plainLines(src) { return esc(src).split('\n'); }
  /* lang: java (default, colored) | text (pseudocode, labeled) | none (plain: binary numbers, assembly ...) */
  function isPlain(lang) { return !!lang && lang !== 'java'; }
  function plainCls(lang) { return isPlain(lang) ? ' plain' + (lang === 'text' ? ' pseudo' : '') : ''; }
  function codeBlock(src, lang) {
    var body = src.replace(/^\n/, '').replace(/\s+$/, '');
    var lines = isPlain(lang) ? plainLines(body) : hlJava(body);
    return '<pre class="code block' + plainCls(lang) + '">' + lines.map(function (l) { return '<span class="ln">' + (l || ' ') + '</span>'; }).join('') + '</pre>';
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
  function pad3(n) { return ('00' + n).slice(-3); }

  /* ---------------- course model (built from manifest.json) ---------------- */
  var TRACK_INFO = {
    cs1: { title: 'Java Introduction', blurb: 'Start from zero: algorithms and flowcharts, how computers and Java work, then variables, selections, strings, loops, methods and arrays.' },
    cs2: { title: 'Java Intermediate', blurb: 'The next step: objects and classes, object-oriented thinking, inheritance and polymorphism, exceptions, files, abstract classes, interfaces and recursion.' }
  };
  var UNITS = {};
  window.addUnit = function (u) { UNITS[u.course + '/' + u.lesson] = u; };
  var tracks = [], trackOf = {}, units = [], unitOf = {}, flat = [], itemOf = {};
  var lessonCache = {};

  function buildModel(manifest) {
    manifest.courses.forEach(function (c) {
      var info = TRACK_INFO[c.id] || { title: c.label, blurb: '' };
      var t = { id: c.id, name: c.label, title: info.title, blurb: info.blurb, units: [] };
      tracks.push(t); trackOf[t.id] = t;
      c.lessons.forEach(function (l, i) {
        var u = { key: c.id + '/' + l.id, course: c.id, id: l.id, n: i + 1, title: l.title, path: l.path, count: l.slide_count, t: t };
        t.units.push(u); units.push(u); unitOf[u.key] = u;
      });
    });
  }
  /* attach teaching files: parts (default: one part with every slide), visuals, explanations */
  function finishModel() {
    units.forEach(function (u) {
      var x = UNITS[u.key] || {};
      u.x = x;
      u.blurb = x.blurb || '';
      u.parts = (x.parts && x.parts.length ? x.parts : [{ title: u.title, from: 1, to: u.count }]).map(function (p, i) {
        return assign({ i: i }, p);
      });
      u.visuals = x.visuals || [];
      u.exam = x.exam || null;
      u.slideX = {};
      Object.keys(x.slides || {}).forEach(function (k) {
        var ab = String(k).split('-').map(Number), b = ab[1] || ab[0];
        for (var n = ab[0]; n <= b; n++) u.slideX[n] = assign(assign({}, u.slideX[n] || {}), x.slides[k]);
      });
      for (var n = 1; n <= u.count; n++) {
        var it = { kind: 'slide', u: u, n: n, id: u.key + '/' + n };
        flat.push(it); itemOf[it.id] = it;
      }
      if (u.exam) {
        var ex = { kind: 'exam', u: u, id: u.key + '/exam' };
        flat.push(ex); itemOf[ex.id] = ex;
      }
    });
    flat.forEach(function (x, i) { x.i = i; });
  }
  function partOf(u, n) { for (var i = 0; i < u.parts.length; i++) if (n >= u.parts[i].from && n <= u.parts[i].to) return u.parts[i]; return u.parts[0]; }
  function visualOf(u, n) { for (var i = 0; i < u.visuals.length; i++) { var v = u.visuals[i]; if (n >= v.slides[0] && n <= (v.slides[1] || v.slides[0])) return v; } return null; }
  function loadLesson(u) {
    if (!lessonCache[u.key]) lessonCache[u.key] = fetch('content/' + u.path).then(function (r) {
      if (!r.ok) throw new Error(r.status); return r.json();
    });
    return lessonCache[u.key];
  }
  function loadScript(src) {
    return new Promise(function (res) {
      var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = res; document.head.appendChild(s);
    });
  }

  /* ---------------- progress (one browser; accounts can plug in here later) ---------------- */
  var KEY = 'vj-progress-v2';
  var S = { seen: {}, quiz: {}, done: {}, exam: {}, last: null, hints: true, drafts: {}, track: null, viz: {} };
  var PASS = 0.7; /* the unit exam counts as passed from 70% */
  try { var raw = localStorage.getItem(KEY); if (raw) S = assign(S, JSON.parse(raw)); } catch (e) { }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
  function quizKey(u, p) { return u.key + '#p' + p.i; }
  function taskKey(u, i) { return u.key + '/task' + i; }
  function examPassed(u) { var r = S.exam[u.key]; return !!(r && r.best / r.total >= PASS); }
  function examSummary(u) {
    var q = (u.exam.questions || []).length, t = (u.exam.tasks || []).length;
    return q + ' questions' + (t ? ' + ' + t + ' task' + (t > 1 ? 's' : '') : '');
  }
  function examDone(u) {
    if (!u.exam) return false;
    return (!(u.exam.questions && u.exam.questions.length) || examPassed(u)) && (u.exam.tasks || []).every(function (t, i) { return S.done[taskKey(u, i)]; });
  }
  function partDone(u, p) {
    for (var n = p.from; n <= p.to; n++) if (!S.seen[u.key + '/' + n]) return false;
    return !(p.quiz && p.quiz.length) || !!S.quiz[quizKey(u, p)];
  }
  function unitStats(u) {
    var seen = 0, total = u.count, got = 0;
    for (var n = 1; n <= u.count; n++) if (S.seen[u.key + '/' + n]) seen++;
    got = seen;
    u.parts.forEach(function (p) { if (p.quiz && p.quiz.length) { total++; if (S.quiz[quizKey(u, p)]) got++; } });
    if (u.exam) {
      if (u.exam.questions && u.exam.questions.length) { total++; if (examPassed(u)) got++; }
      (u.exam.tasks || []).forEach(function (t, i) { total++; if (S.done[taskKey(u, i)]) got++; });
    }
    return { seen: seen, got: got, total: total, pct: total ? Math.round(got / total * 100) : 0, full: got === total };
  }
  function trackStats(t) {
    var got = 0, total = 0;
    t.units.forEach(function (u) { var s = unitStats(u); got += s.got; total += s.total; });
    return { got: got, total: total, pct: total ? Math.round(got / total * 100) : 0 };
  }

  var main = document.getElementById('main');
  var side = document.getElementById('side');
  var curViz = null, curItem = null, sideTrack = null;

  /* ---------------- sidebar ---------------- */
  function hrefOf(x) { return '#/' + x.id; }
  function renderSide() {
    var cu = curItem && curItem.u;
    if (!sideTrack) sideTrack = cu ? cu.course : (S.track || tracks[0].id);
    var t = trackOf[sideTrack], ts = trackStats(t);
    side.innerHTML =
      '<a class="brand" href="#/"><small>CS1 + CS2</small><b>Visual Java</b></a>' +
      '<div class="tracks" role="tablist" aria-label="Course">' + tracks.map(function (x) {
        var xs = trackStats(x);
        return '<button role="tab" class="trk' + (x.id === sideTrack ? ' on' : '') + '" data-t="' + x.id + '" aria-selected="' + (x.id === sideTrack) + '">' +
          '<b>' + esc(x.name) + '</b><span>' + esc(x.title) + '</span><em>' + xs.pct + '% done</em></button>';
      }).join('') + '</div>' +
      '<div class="prog"><div class="bar"><i style="width:' + ts.pct + '%"></i></div><span>' + esc(t.name) + ': ' + ts.pct + '% done</span></div>' +
      '<nav class="units-nav" aria-label="' + esc(t.title) + ' units">' + t.units.map(function (u) {
        var st = unitStats(u), open = cu === u;
        var head = '<a class="uhead' + (open ? ' open' : '') + (st.full ? ' done' : '') + '" href="#/' + u.key + '/1"' + (open ? ' aria-current="true"' : '') + '>' +
          '<span class="un">' + u.n + '</span><span class="ut">' + esc(u.title) + '</span><span class="upc">' + st.pct + '%</span></a>';
        if (!open) return '<div class="unav">' + head + '</div>';
        return '<div class="unav">' + head + '<div class="parts">' + u.parts.map(function (p) {
          var on = curItem.kind === 'slide' && curItem.n >= p.from && curItem.n <= p.to;
          return '<a href="#/' + u.key + '/' + p.from + '" class="' + (on ? 'on' : '') + (partDone(u, p) ? ' done' : '') + '"><span class="st"></span><span>' + esc(p.title) +
            '<small>Slides ' + p.from + (p.to > p.from ? '–' + p.to : '') + '</small></span></a>';
        }).join('') +
          (u.exam ? '<a href="#/' + u.key + '/exam" class="ch' + (curItem.kind === 'exam' ? ' on' : '') + (examDone(u) ? ' done' : '') + '"><span class="st"></span><span>Unit exam<small>' + examSummary(u) + '</small></span></a>' : '') +
          '</div></div>';
      }).join('') + '</nav>' +
      '<div class="sidefoot"><button class="toggle" id="hintsBtn" aria-pressed="' + (S.hints ? 'true' : 'false') + '"><span>Arabic hints <span class="ar">ترجمة الكلمات</span></span><span class="sw"></span></button></div>';
    document.getElementById('hintsBtn').onclick = function () {
      S.hints = !S.hints; save(); applyHints(); this.setAttribute('aria-pressed', S.hints ? 'true' : 'false');
    };
    side.querySelectorAll('.trk').forEach(function (b) {
      b.onclick = function () { sideTrack = b.dataset.t; S.track = sideTrack; save(); renderSide(); side.scrollTop = 0; };
    });
    var on = side.querySelector('.parts a.on') || side.querySelector('.uhead.open');
    if (on && on.scrollIntoView) { var r = on.getBoundingClientRect(); if (r.top < 0 || r.bottom > innerHeight) on.scrollIntoView({ block: 'center' }); }
  }
  function applyHints() { document.body.classList.toggle('no-hints', !S.hints); }

  /* ---------------- viz controller ---------------- */
  /* v: { id, title, code, vb, steps (array, or function(values) -> array), draw(k, step, values), inputs: [{id,label,value,min,max}] } */
  function setupViz(root, v, opts) {
    opts = opts || {};
    var q = function (s) { return root.querySelector(s); };
    var stage = new Stage(q('.stage'), v.vb || [560, 340]);
    var vals = assign({}, v.defaults || {}), steps = [], k = 0, timer = null;
    if (opts.values) Object.keys(v.defaults || {}).forEach(function (key) { if (opts.values[key] != null) vals[key] = opts.values[key]; });
    (v.inputs || []).forEach(function (f) { vals[f.id] = opts.values && opts.values[f.id] != null ? opts.values[f.id] : f.value; });
    var cap = q('.cap'), stepno = q('.stepno'), dots = q('.dots'), prev = q('.prev'), next = q('.next'), play = q('.play');
    var codep = q('.code.panel'), cons = q('.console'), out = cons && cons.querySelector('pre');
    function build() {
      steps = typeof v.steps === 'function' ? v.steps(vals) : v.steps;
      if (codep && typeof v.code === 'function') codep.innerHTML = codeSpans(v, vals);
      var hasOut = steps.some(function (s) { return s.out != null; });
      if (cons) cons.hidden = !hasOut;
      dots.innerHTML = steps.map(function (s, i) { return '<button class="dot" data-i="' + i + '" aria-label="Go to step ' + (i + 1) + '"></button>'; }).join('');
    }
    function go(i) {
      k = Math.max(0, Math.min(steps.length - 1, i));
      var s = steps[k];
      try { stage.render(v.draw(k, s, vals)); } catch (e) { console.error(v.id, e); }
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
      next.innerHTML = k === steps.length - 1 ? 'Replay ↺' : 'Next step ▶';
      dots.querySelectorAll('.dot').forEach(function (d, idx) { d.classList.toggle('on', idx === k); d.classList.toggle('past', idx < k); });
      if (opts.onStep) opts.onStep(k, vals);
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
    root.querySelectorAll('.vin input').forEach(function (inp) {
      inp.value = vals[inp.dataset.id];
      inp.addEventListener('change', function () {
        var f = (v.inputs || []).filter(function (x) { return x.id === inp.dataset.id; })[0], val;
        if (f.type === 'text') {
          val = inp.value.slice(0, f.maxlen || 40);
          if (val.length < (f.minlen || 0)) val = f.value;
          inp.value = val; vals[f.id] = val; markPreset(); stop(); build(); go(0); return;
        }
        val = Number(inp.value);
        if (!isFinite(val)) val = f.value;
        if (f.min != null) val = Math.max(f.min, val);
        if (f.max != null) val = Math.min(f.max, val);
        inp.value = val; vals[f.id] = val; markPreset(); stop(); build(); go(0);
      });
    });
    /* ready-made examples: one click fills every input */
    var pbtns = root.querySelectorAll('.preset');
    function markPreset() {
      pbtns.forEach(function (b) {
        var pv = v.presets[+b.dataset.p].values;
        b.classList.toggle('on', Object.keys(pv).every(function (key) { return vals[key] === pv[key]; }));
      });
    }
    pbtns.forEach(function (b) {
      b.onclick = function () {
        var pv = v.presets[+b.dataset.p].values;
        Object.keys(pv).forEach(function (key) { vals[key] = pv[key]; });
        root.querySelectorAll('.vin input').forEach(function (inp) { inp.value = vals[inp.dataset.id]; });
        markPreset(); stop(); build(); go(0);
      };
    });
    markPreset();
    build();
    var start = opts.start || 0;
    if (opts.slide != null) steps.some(function (s, i) { if (s.slide === opts.slide) { start = i; return true; } return false; });
    go(start);
    if (opts.autoplay && !reduced) startPlay(true);
    return { stop: stop, step: function (d) { stop(); go(k + d); } };
  }
  /* code can be a string, or a function of the input values (the code panel then follows the inputs) */
  function startVals(v) { var o = assign({}, v.defaults || {}); (v.inputs || []).forEach(function (f) { o[f.id] = f.value; }); return o; }
  function codeSpans(v, vals) {
    var src = typeof v.code === 'function' ? v.code(vals) : v.code;
    return (isPlain(v.lang) ? plainLines(src) : hlJava(src)).map(function (t, i) { return '<span class="ln" data-n="' + (i + 1) + '">' + (t || ' ') + '</span>'; }).join('');
  }
  function vizHTML(v, label) {
    return '<div class="vizhead"><span class="vlabel">' + esc(label || v.title || 'See it') + '</span><span class="stepno"></span></div>' +
      (v.inputs && v.inputs.length ? '<div class="vin">' + (v.inputsLabel ? '<span>' + gl(v.inputsLabel) + '</span>' : '') + v.inputs.map(function (f) {
        if (f.type === 'text') return '<label>' + esc(f.label || f.id) + ' <input type="text" class="txt" spellcheck="false" autocomplete="off" data-id="' + esc(f.id) + '" value="' + esc(f.value) + '"' + (f.maxlen ? ' maxlength="' + f.maxlen + '" size="' + Math.min(f.maxlen, 18) + '"' : '') + '></label>';
        return '<label>' + esc(f.label || f.id) + ' <input type="number" inputmode="decimal" step="any" data-id="' + esc(f.id) + '" value="' + f.value + '"' +
          (f.min != null ? ' min="' + f.min + '"' : '') + (f.max != null ? ' max="' + f.max + '"' : '') + '></label>';
      }).join('') + '</div>' : '') +
      (v.presets && v.presets.length ? '<div class="presets"><span>Try:</span>' + v.presets.map(function (p, i) {
        return '<button class="btn preset" data-p="' + i + '">' + esc(p.label) + '</button>';
      }).join('') + '</div>' : '') +
      '<div class="stagewrap"><svg class="stage" role="img" aria-label="Step by step drawing: ' + esc(v.title || '') + '"></svg></div>' +
      '<p class="turn">Tip: turn your phone sideways to see the drawing bigger.</p>' +
      '<p class="cap" aria-live="polite"></p>' +
      '<div class="ctrl"><button class="btn prev">◀ Back</button><div class="dots"></div><button class="btn play">Play</button><button class="btn primary next">Next step ▶</button></div>' +
      (v.code ? '<pre class="code panel' + plainCls(v.lang) + '">' + codeSpans(v, startVals(v)) + '</pre>' : '') +
      '<div class="console"><div class="clabel">Output</div><pre></pre></div>';
  }

  /* ---------------- questions (part quizzes and the unit exam) ---------------- */
  /* types: mc (default: options + answer index), tf (answer true/false), fill (code with ___ + answers, alternatives with |),
     output (code + the exact output, alternatives with |), order (lines in the right order; shown mixed).
     q.review: the slide that explains it (the exam links there when the answer is wrong). q.lang: 'text' for pseudocode. */
  var QTYPE = { mc: 'Choose one', tf: 'True or false', fill: 'Fill in the missing word', output: 'What is the output?', order: 'Put the lines in order' };
  function asMC(q) { return q.type === 'tf' ? { q: q.q, code: q.code, lang: q.lang, options: ['True', 'False'], answer: q.answer ? 0 : 1, why: q.why } : q; }
  function linesOf(src, lang) { return isPlain(lang) ? plainLines(src) : hlJava(src); }
  function blanksHTML(code, qid, answers, lang) {
    var b = 0;
    return '<pre class="code block' + plainCls(lang) + '">' + linesOf(code, lang).map(function (line) {
      line = line.replace(/___/g, function () {
        var w = Math.max(4, String(answers[b] || '').split('|')[0].length + 1);
        var h = '<input class="blank" id="' + qid + '-b' + b + '" data-b="' + b + '" aria-label="Blank ' + (b + 1) + '" autocomplete="off" autocapitalize="off" spellcheck="false" style="width:' + w + 'ch">';
        b++; return h;
      });
      return '<span class="ln">' + (line || ' ') + '</span>';
    }).join('') + '</pre>';
  }
  function mixed(n, seed) {
    var o, s = seed || 11, rnd = function () { s = (s * 16807) % 2147483647; return s / 2147483647; };
    do {
      o = []; for (var i = 0; i < n; i++) o.push(i);
      for (var j = n - 1; j > 0; j--) { var r = Math.floor(rnd() * (j + 1)), t = o[j]; o[j] = o[r]; o[r] = t; }
    } while (n > 1 && o.every(function (v, i) { return v === i; }));
    return o;
  }
  function orderHTML(q, i) {
    return '<ol class="olines">' + mixed(q.lines.length, 7 + i).map(function (li) {
      return '<li data-l="' + li + '"><pre class="code' + plainCls(q.lang) + '"><span class="ln">' + linesOf(q.lines[li], q.lang)[0] + '</span></pre>' +
        '<span class="fmove"><button class="btn up" aria-label="Move up">▲</button><button class="btn dn" aria-label="Move down">▼</button></span></li>';
    }).join('') + '</ol>';
  }
  function qHTML(q, i, qid, exam) {
    var type = q.type || 'mc';
    var head = '<div class="qq"><span class="qn">Q' + (i + 1) + '</span><div><span class="qtype">' + QTYPE[type] + '</span>' + gl(q.q) + '</div></div>';
    var row = (exam ? '' : '<div class="qrow"><button class="btn primary qcheck">Check</button><button class="btn qshow" hidden>Show answer</button></div>') + '<div class="why" hidden></div>';
    var body;
    if (type === 'fill') body = blanksHTML(q.code, qid, q.answer, q.lang);
    else if (type === 'output') {
      body = codeBlock(q.code, q.lang) + '<label class="clabel" for="' + qid + '-o" style="color:var(--ink-2)">Type the output</label>' +
        '<textarea class="outin" id="' + qid + '-o" rows="' + Math.max(1, String(q.answer).split('|')[0].split('\n').length) + '" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>';
    } else if (type === 'order') body = orderHTML(q, i);
    else {
      var m = asMC(q);
      body = (m.code ? codeBlock(m.code, m.lang) : '') + '<div class="opts' + (type === 'tf' ? ' tf' : '') + '">' +
        m.options.map(function (o, j) { return '<button class="opt" data-j="' + j + '">' + inl(o) + '</button>'; }).join('') + '</div>';
      if (!exam) row = '<div class="why" hidden></div>';
    }
    return '<div class="q" data-i="' + i + '">' + head + body + row + '</div>';
  }
  function bindOrder(list) {
    if (!list) return;
    var refresh = function () {
      [].forEach.call(list.children, function (li, k) { li.querySelector('.up').disabled = k === 0; li.querySelector('.dn').disabled = k === list.children.length - 1; li.classList.remove('ok', 'bad'); });
    };
    list.addEventListener('click', function (e) {
      var b = e.target.closest('.up,.dn'); if (!b || b.disabled) return;
      var li = b.closest('li');
      if (b.classList.contains('up') && li.previousElementSibling) list.insertBefore(li, li.previousElementSibling);
      if (b.classList.contains('dn') && li.nextElementSibling) list.insertBefore(li.nextElementSibling, li);
      refresh(); b.focus();
    });
    refresh();
  }
  function normOut(s) { return String(s).replace(/\r/g, '').split('\n').map(function (l) { return l.replace(/\s+$/, ''); }).join('\n').replace(/^\n+|\n+$/g, ''); }
  function normWord(s) { return String(s).replace(/\s+/g, ''); }
  /* is the answer in this question box right? */
  function gradeQ(box, q) {
    var type = q.type || 'mc';
    if (type === 'fill') return [].every.call(box.querySelectorAll('.blank'), function (inp) {
      return String(q.answer[+inp.dataset.b]).split('|').some(function (a) { return normWord(a) === normWord(inp.value); });
    });
    if (type === 'output') { var ta = box.querySelector('.outin'); return String(q.answer).split('|').some(function (a) { return normOut(a) === normOut(ta.value); }); }
    if (type === 'order') return [].map.call(box.querySelector('.olines').children, function (li) { return +li.dataset.l; }).every(function (v, k) { return v === k; });
    var sel = box.querySelector('.opt.sel');
    return !!sel && +sel.dataset.j === asMC(q).answer;
  }
  function answered(box, q) {
    var type = q.type || 'mc';
    if (type === 'fill') return [].some.call(box.querySelectorAll('.blank'), function (inp) { return inp.value.trim(); });
    if (type === 'output') return !!box.querySelector('.outin').value.trim();
    if (type === 'order') return true;
    return !!box.querySelector('.opt.sel');
  }
  /* show the right answer in the box (used after the exam, and by "Show answer") */
  function revealQ(box, q) {
    var type = q.type || 'mc';
    if (type === 'fill') box.querySelectorAll('.blank').forEach(function (inp) {
      var a = String(q.answer[+inp.dataset.b]).split('|');
      var g = a.some(function (x) { return normWord(x) === normWord(inp.value); });
      inp.classList.toggle('ok', g); inp.classList.toggle('bad', !g);
      if (!g) inp.value = a[0];
    });
    else if (type === 'output') { var ta = box.querySelector('.outin'); if (!gradeQ(box, q)) ta.value = String(q.answer).split('|')[0]; }
    else if (type === 'order') {
      var list = box.querySelector('.olines');
      [].forEach.call(list.children, function (li, k) { li.classList.toggle('ok', +li.dataset.l === k); li.classList.toggle('bad', +li.dataset.l !== k); });
    } else {
      var m = asMC(q);
      box.querySelectorAll('.opt').forEach(function (b) { if (+b.dataset.j === m.answer) b.classList.add('ok'); else if (b.classList.contains('sel')) b.classList.add('bad'); });
    }
  }

  /* part quiz: instant feedback, one question at a time */
  function quizHTML(u, p) {
    if (!p.quiz || !p.quiz.length) return '';
    var done = !!S.quiz[quizKey(u, p)];
    return '<section class="quiz" aria-labelledby="qh"><h2 id="qh">Quick quiz: ' + esc(p.title) + '</h2>' +
      '<p class="qintro">' + p.quiz.length + ' short questions about slides ' + p.from + (p.to > p.from ? ' to ' + p.to : '') + '. Answer all of them to finish this part.</p>' +
      p.quiz.map(function (q, i) { return qHTML(q, i, 'q-' + p.i + '-' + i, false); }).join('') +
      '<div class="qdone"' + (done ? '' : ' hidden') + '>Part complete. Great work!</div>' +
      (done ? '' : '<button class="skip">Skip the questions and mark this part as done</button>') +
      '</section>';
  }
  function setupQuiz(u, p) {
    var sec = main.querySelector('.quiz'); if (!sec) return;
    var solved = new Set();
    var doneBox = sec.querySelector('.qdone');
    function finish() { S.quiz[quizKey(u, p)] = true; save(); renderSide(); doneBox.hidden = false; var sk = sec.querySelector('.skip'); if (sk) sk.remove(); }
    function solve(i) {
      solved.add(i);
      sec.querySelector('.q[data-i="' + i + '"]').classList.add('solved');
      if (solved.size === p.quiz.length) finish();
    }
    var skip = sec.querySelector('.skip');
    if (skip) skip.onclick = finish;
    sec.querySelectorAll('.q').forEach(function (box) {
      var i = +box.dataset.i, q = p.quiz[i], why = box.querySelector('.why'), type = q.type || 'mc';
      if (type === 'mc' || type === 'tf') {
        var m = asMC(q);
        box.querySelectorAll('.opt').forEach(function (b) {
          b.onclick = function () {
            why.hidden = false;
            if (+b.dataset.j === m.answer) {
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
        return;
      }
      var tries = 0, show = box.querySelector('.qshow');
      bindOrder(box.querySelector('.olines'));
      var check = function () {
        why.hidden = false;
        if (gradeQ(box, q)) {
          revealQ(box, q);
          why.className = 'why ok'; why.innerHTML = '<b>Correct!</b> ' + gl(q.why || ''); solve(i); show.hidden = true;
        } else {
          tries++; why.className = 'why bad';
          if (type === 'order') revealQ(box, q);
          if (type === 'fill') box.querySelectorAll('.blank').forEach(function (inp) {
            var g = String(q.answer[+inp.dataset.b]).split('|').some(function (a) { return normWord(a) === normWord(inp.value); });
            inp.classList.toggle('ok', g); inp.classList.toggle('bad', !g);
          });
          why.innerHTML = '<b>Not yet.</b> ' + (type === 'order' ? 'The red lines are in the wrong place.' : type === 'fill' ? 'Look at the red blanks and try again.' : 'Read the code again, line by line. Spaces at the end do not matter.') + (q.hint ? ' Hint: ' + gl(q.hint) : '');
          if (tries >= 2) show.hidden = false;
        }
      };
      box.querySelector('.qcheck').onclick = check;
      box.querySelectorAll('.blank').forEach(function (inp) { inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') check(); }); });
      show.onclick = function () {
        if (type === 'order') { var list = box.querySelector('.olines'); q.lines.forEach(function (x, k) { list.appendChild(list.querySelector('li[data-l="' + k + '"]')); }); }
        else revealQ(box, q);
        check();
      };
    });
  }

  /* ---------------- slide content ---------------- */
  /* blocks: paragraph | bullet (level 0/1) | code (lang java|text) | note | h (small heading). `html` instead of `text` = trusted markup from a unit file. */
  function blockText(b) { return b.html != null ? gl(b.html) : esc(b.text); }
  function blocksHTML(blocks) {
    var out = '', i = 0;
    while (i < blocks.length) {
      var b = blocks[i];
      if (b.type === 'bullet') {
        /* consecutive bullets form one list; a deeper level nests inside the item before it */
        out += '<ul class="sl">';
        var lv = 0, first = true;
        while (i < blocks.length && blocks[i].type === 'bullet') {
          var c = blocks[i++], L = c.level || 0;
          if (first) { for (; lv < L; lv++) out += '<li><ul>'; first = false; }
          else if (L > lv) { for (; lv < L; lv++) out += '<ul>'; }
          else { out += '</li>'; for (; lv > L; lv--) out += '</ul></li>'; }
          out += '<li>' + blockText(c);
        }
        out += '</li>';
        for (; lv > 0; lv--) out += '</ul></li>';
        out += '</ul>';
        continue;
      }
      if (b.type === 'code') out += codeBlock(b.text, b.lang);
      else if (b.type === 'note') out += '<div class="snote">' + blockText(b) + '</div>';
      else if (b.type === 'h') out += '<p class="sh">' + blockText(b) + '</p>';
      else if (b.type === 'html') out += gl(b.html);
      else out += '<p>' + blockText(b) + '</p>';
      i++;
    }
    return out;
  }
  function slideHTML(u, s, x) {
    var blocks = x.blocks || s.blocks || [];
    var showText = x.text !== false && blocks.length;
    var showImg = x.image != null ? x.image && s.has_visual : s.has_visual;
    var title = x.title != null ? x.title : s.title;
    var img = 'content/' + u.course + '/' + u.id + '/' + s.image;
    return '<article class="slide' + (x.cover ? ' cover' : '') + '" aria-label="Slide ' + s.number + '">' +
      '<div class="shead"><span>Slide ' + s.number + ' of ' + u.count + '</span><span>Course slide</span></div>' +
      (title ? '<h2 class="stitle">' + esc(title) + '</h2>' : '') +
      (showText ? '<div class="sbody">' + blocksHTML(blocks) + '</div>' : '') +
      (showImg ? '<figure class="simg"><button class="zoom" aria-label="Open the slide picture larger"><img src="' + esc(img) + '" alt="Picture of slide ' + s.number + (title ? ': ' + esc(title) : '') + '" loading="lazy" decoding="async"></button>' +
        '<figcaption>' + (showText ? 'The original slide. Use it when the text above is not clear.' : 'The original slide.') + ' Tap to make it bigger.</figcaption></figure>' : '') +
      '</article>';
  }
  function stripHTML(u, n) {
    return '<nav class="strip" aria-label="Slides in this unit">' + u.parts.map(function (p) {
      var dots = '';
      for (var i = p.from; i <= p.to; i++) {
        dots += '<a href="#/' + u.key + '/' + i + '" class="sd' + (i === n ? ' on' : '') + (S.seen[u.key + '/' + i] ? ' seen' : '') + '" title="Slide ' + i + '" aria-label="Slide ' + i + '"' + (i === n ? ' aria-current="page"' : '') + '></a>';
      }
      return '<span class="sgrp" title="' + esc(p.title) + '">' + dots + '</span>';
    }).join('') +
      (u.exam ? '<a href="#/' + u.key + '/exam" class="sd chd' + (examDone(u) ? ' seen' : '') + (n === 'exam' ? ' on' : '') + '" title="Unit exam" aria-label="Unit exam"></a>' : '') + '</nav>';
  }
  function itemName(x) {
    if (x.kind === 'exam') return x.u.title + ' · Unit exam';
    return x.u.title + ' · Slide ' + x.n;
  }
  function navHTML(x) {
    var p = flat[x.i - 1], n = flat[x.i + 1];
    return '<nav class="lnav" aria-label="Slide navigation">' +
      (p ? '<a href="' + hrefOf(p) + '" class="pv"><small>◀ Previous</small>' + esc(itemName(p)) + '</a>' : '<span></span>') +
      (n ? '<a class="nx" href="' + hrefOf(n) + '"><small>Next ▶</small>' + esc(itemName(n)) + '</a>' : '<a class="nx" href="#/"><small>Finished</small>Back to the course home</a>') +
      '</nav>';
  }

  /* ---------------- pages ---------------- */
  function renderSlide(x, data) {
    var u = x.u, s = data.slides[x.n - 1];
    if (!s) { main.innerHTML = '<div class="wrap"><p>This slide is missing.</p></div>'; return; }
    var sx = u.slideX[x.n] || {}, p = partOf(u, x.n), v = visualOf(u, x.n);
    var explain = sx.explain;
    var last = x.n === p.to;
    main.innerHTML = '<div class="wrap">' +
      '<header class="lhead"><div class="eyebrow">' + esc(u.t.name) + ' · Unit ' + u.n + '</div>' +
      '<h1>' + esc(u.title) + '</h1>' +
      '<div class="meta">Part ' + (p.i + 1) + ' of ' + u.parts.length + ': <b>' + esc(p.title) + '</b> · Slide ' + x.n + ' of ' + u.count + '</div></header>' +
      stripHTML(u, x.n) +
      '<div class="lgrid' + (v ? '' : ' novis') + '"><div class="lcol">' + slideHTML(u, s, sx) +
      (explain ? '<section class="explain" aria-label="Explanation"><h3>In simple words</h3>' + rich(explain) + '</section>' : '') +
      '</div>' +
      (v ? '<section class="viz" aria-label="Interactive drawing">' + vizHTML(v) + '</section>' : '') + '</div>' +
      (last ? quizHTML(u, p) : '') + navHTML(x) + '</div>';
    S.seen[x.id] = true; save();
    if (v) {
      var vs = S.viz[u.key + '#' + v.id] || {};
      var keep = vs.slide != null && vs.slide !== x.n && x.n >= v.slides[0] && x.n <= (v.slides[1] || v.slides[0]);
      curViz = setupViz(main.querySelector('.viz'), v, {
        slide: x.n, start: keep ? vs.k : 0, values: vs.vals,
        onStep: function (k, vals) { S.viz[u.key + '#' + v.id] = { k: k, slide: x.n, vals: vals }; save(); }
      });
    }
    if (last) setupQuiz(u, p);
    main.querySelectorAll('.simg .zoom').forEach(function (b) {
      b.onclick = function () { openZoom(b.querySelector('img')); };
    });
  }

  /* ---------------- unit exam ----------------
     exam: { questions: [question...] (each may have review: slide number), tasks: [task...] }
     task (type 'code', default): { title, task (html), starter, checks: [{ re, label, raw, review }], solution, output, lang }
     task (type 'flow'): { title, task, cards: [{ text, shape }] in the right order } */
  function stripComments(s) { return s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, ''); }
  function reviewLink(u, data, n) {
    if (!n) return '';
    var s = data && data.slides[n - 1];
    return ' <a class="rev" href="#/' + u.key + '/' + n + '">Review slide ' + n + (s && s.title ? ': ' + esc(s.title) : '') + ' →</a>';
  }
  function renderExam(x, data) {
    var u = x.u, ex = u.exam, qs = ex.questions || [], tasks = ex.tasks || [], rec = S.exam[u.key];
    main.innerHTML = '<div class="wrap">' +
      '<header class="lhead"><div class="eyebrow">' + esc(u.t.name) + ' · Unit ' + u.n + '</div><h1>Unit exam: ' + esc(u.title) + '</h1>' +
      '<div class="meta">' + examSummary(u) + ' · the whole unit' + (rec ? ' · best mark: <span class="donepill">' + rec.best + ' / ' + rec.total + '</span>' : '') + '</div></header>' +
      stripHTML(u, 'exam') +
      (qs.length ? '<section class="quiz exam" aria-labelledby="eqh"><h2 id="eqh">Part A: Questions</h2>' +
        '<p class="qintro">Answer every question, then press <b>Finish the exam</b>. After that you see your mark and the right answers. A wrong answer has a link to the slide that explains it. You pass with ' + Math.round(PASS * 100) + '%.</p>' +
        qs.map(function (q, i) { return qHTML(q, i, 'e-' + i, true); }).join('') +
        '<div class="result" id="score" hidden></div>' +
        '<div class="qrow"><button class="btn primary big" id="finish">Finish the exam</button><button class="btn big" id="again" hidden>Try the exam again</button></div></section>' : '') +
      (tasks.length ? '<section class="tasks" aria-labelledby="eth"><h2 id="eth">Part ' + (qs.length ? 'B' : 'A') + ': Do it yourself</h2>' +
        tasks.map(function (t, i) { return '<div class="task" data-t="' + i + '"></div>'; }).join('') + '</section>' : '') +
      navHTML(x) + '</div>';
    if (qs.length) setupExam(u, data, qs);
    main.querySelectorAll('.task').forEach(function (el) { var i = +el.dataset.t; (tasks[i].type === 'flow' ? mountFlow : mountCode)(el, u, tasks[i], i, data); });
  }
  function setupExam(u, data, qs) {
    var sec = main.querySelector('.exam'), locked = false, warned = false;
    var boxes = [].slice.call(sec.querySelectorAll('.q'));
    boxes.forEach(function (box) {
      var q = qs[+box.dataset.i];
      box.querySelectorAll('.opt').forEach(function (b) {
        b.onclick = function () {
          if (locked) return;
          box.querySelectorAll('.opt').forEach(function (o) { o.classList.toggle('sel', o === b); o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
        };
      });
      bindOrder(box.querySelector('.olines'));
    });
    var score = document.getElementById('score'), fin = document.getElementById('finish');
    fin.onclick = function () {
      var empty = boxes.filter(function (box) { return !answered(box, qs[+box.dataset.i]); }).length;
      if (empty && !warned) {
        warned = true; score.hidden = false; score.className = 'result bad';
        score.textContent = empty + ' question' + (empty > 1 ? 's are' : ' is') + ' not answered yet. Answer them, or press Finish again to finish anyway.';
        return;
      }
      locked = true;
      var right = 0;
      boxes.forEach(function (box) {
        var q = qs[+box.dataset.i], ok = gradeQ(box, q), why = box.querySelector('.why');
        if (ok) right++;
        revealQ(box, q);
        box.classList.add(ok ? 'right' : 'wrong');
        box.querySelectorAll('input,textarea,button').forEach(function (el) { el.disabled = true; });
        why.hidden = false; why.className = 'why ' + (ok ? 'ok' : 'bad');
        why.innerHTML = (ok ? '<b>Correct.</b> ' : '<b>Wrong.</b> ' + (q.type === 'order' ? 'The right order is: ' + q.lines.map(function (l, k) { return (k + 1) + ') <code>' + esc(l) + '</code>'; }).join(' ') + '. ' : '')) +
          gl(q.why || '') + (ok ? '' : reviewLink(u, data, q.review));
      });
      var total = boxes.length, prevBest = S.exam[u.key] ? S.exam[u.key].best : 0;
      S.exam[u.key] = { last: right, best: Math.max(prevBest, right), total: total }; save(); renderSide();
      var pass = right / total >= PASS;
      score.hidden = false; score.className = 'result ' + (pass ? 'ok' : 'bad');
      score.innerHTML = 'Your mark: <b>' + right + ' of ' + total + '</b> (' + Math.round(right / total * 100) + '%). ' +
        (pass ? 'You passed the exam. Well done!' : 'Not passed yet: you need ' + Math.round(PASS * 100) + '%. Read the red questions, open the slides they link to, then try again.');
      fin.hidden = true; document.getElementById('again').hidden = false;
      score.scrollIntoView({ block: 'center', behavior: reduced ? 'auto' : 'smooth' });
    };
    document.getElementById('again').onclick = function () { renderExam(curItem, data); window.scrollTo(0, 0); };
  }

  /* a written task: the student writes code (or pseudocode) and the checks say what is missing */
  function mountCode(el, u, t, i, data) {
    var did = taskKey(u, i), draft = S.drafts[did], text = t.lang === 'text';
    el.innerHTML = '<h3>Task ' + (i + 1) + ': ' + esc(t.title) + (S.done[did] ? ' <span class="donepill">Done</span>' : '') + '</h3>' +
      '<div class="chgrid"><article class="read">' + rich(t.task) +
      (t.output ? '<div class="expect"><div class="clabel">Expected output</div><pre>' + esc(t.output) + '</pre></div>' : '') +
      '<p class="small">' + (text ? 'Write one step on each line. You can type <code>&lt;-</code> for the arrow ←.' :
        'The checker looks for the important parts of your code. It does not run Java. To run your code for real, paste it into an online Java compiler such as <a href="https://www.jdoodle.com/online-java-compiler" target="_blank" rel="noopener">JDoodle</a>.') + '</p></article>' +
      '<section class="edbox" aria-label="Your answer"><label class="clabel" for="ed' + i + '" style="color:var(--ink-2)">Your ' + (text ? 'algorithm' : 'code') + '</label>' +
      '<textarea class="editor" id="ed' + i + '" spellcheck="false" autocapitalize="off" autocomplete="off">' + esc(draft != null ? draft : t.starter) + '</textarea>' +
      '<div class="qrow"><button class="btn primary chk">Check my ' + (text ? 'algorithm' : 'code') + '</button><button class="btn rst">Start again</button><button class="btn sol">Show solution</button></div>' +
      '<div class="result" hidden></div><ul class="checks">' +
      t.checks.map(function (c) { return '<li class="wait"><b>•</b><span>' + gl(c.label) + '<span class="crev"></span></span></li>'; }).join('') + '</ul>' +
      '<div class="solbox" hidden><div class="clabel" style="color:var(--ink-2);margin-bottom:6px">One possible solution</div>' + codeBlock(t.solution, t.lang) + '</div>' +
      '</section></div>';
    var ed = el.querySelector('.editor'), res = el.querySelector('.result'), tm = null;
    ed.addEventListener('input', function () { clearTimeout(tm); tm = setTimeout(function () { S.drafts[did] = ed.value; save(); }, 400); });
    ed.addEventListener('keydown', function (e) {
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        var a = ed.selectionStart, b = ed.selectionEnd;
        ed.value = ed.value.slice(0, a) + '    ' + ed.value.slice(b);
        ed.selectionStart = ed.selectionEnd = a + 4;
      }
    });
    el.querySelector('.chk').onclick = function () {
      var src = text ? ed.value.replace(/<-/g, '←') : ed.value;
      var code = text ? src : stripComments(src), pass = 0;
      var lis = el.querySelectorAll('.checks li');
      t.checks.forEach(function (c, k) {
        var ok = c.fn ? !!c.fn(c.raw ? src : code) : c.re.test(c.raw ? src : code); if (ok) pass++;
        lis[k].className = ok ? 'ok' : 'bad'; lis[k].querySelector('b').textContent = ok ? '✓' : '✗';
        lis[k].querySelector('.crev').innerHTML = ok ? '' : reviewLink(u, data, c.review);
      });
      res.hidden = false;
      if (pass === t.checks.length) { res.className = 'result ok'; res.textContent = 'All checks passed. Task complete!'; S.done[did] = true; save(); renderSide(); }
      else { res.className = 'result bad'; res.textContent = pass + ' of ' + t.checks.length + ' checks passed. Fix the red items (the links open the slides that explain them) and check again.'; }
    };
    el.querySelector('.rst').onclick = function () { ed.value = t.starter; delete S.drafts[did]; save(); };
    el.querySelector('.sol').onclick = function () {
      var sb = el.querySelector('.solbox'); sb.hidden = !sb.hidden; this.textContent = sb.hidden ? 'Show solution' : 'Hide solution';
    };
  }

  /* a flowchart task: put the cards in order and choose a symbol for each */
  var SHAPES = [['oval', 'Oval (start / end)'], ['para', 'Parallelogram (input)'], ['rect', 'Rectangle (process)'], ['diamond', 'Diamond (decision)'], ['display', 'Hybrid (output)']];
  function mountFlow(el, u, t, i, data) {
    var did = taskKey(u, i), n = t.cards.length, st = S.drafts[did];
    if (!st || !st.order || st.order.length !== n) st = { order: mixed(n, 7), shape: t.cards.map(function () { return ''; }) };
    function persist() { S.drafts[did] = st; save(); }
    el.innerHTML = '<h3>Task ' + (i + 1) + ': ' + esc(t.title) + (S.done[did] ? ' <span class="donepill">Done</span>' : '') + '</h3>' +
      '<div class="chgrid"><article class="read">' + rich(t.task) +
      '<ol class="fcards"></ol>' +
      '<div class="qrow"><button class="btn primary chk">Check my flowchart</button><button class="btn rst">Start again</button><button class="btn sol">Show solution</button></div>' +
      '<div class="result" hidden></div></article>' +
      '<section class="viz" aria-label="Your flowchart"><div class="vizhead"><span class="vlabel">Your flowchart</span><span class="stepno">It updates as you work</span></div>' +
      '<div class="stagewrap"><svg class="stage" role="img" aria-label="Your flowchart"></svg></div></section></div>';
    var vb = [560, Math.max(340, 40 + n * 74)];
    var stage = new Stage(el.querySelector('.stage'), vb);
    var list = el.querySelector('.fcards'), res = el.querySelector('.result');
    function draw(marks) {
      var items = [], w = 260, h = 50, x0 = (vb[0] - w) / 2;
      st.order.forEach(function (ci, k) {
        var y = 20 + k * 74, sh = st.shape[ci] || 'rect';
        var tone = marks ? (marks[k] ? 'teal' : 'red') : st.shape[ci] ? 'blue' : 'muted';
        items.push(B('c' + ci, x0, y, w, h, { title: t.cards[ci].text, shape: sh, tone: tone, dash: !st.shape[ci], size: 13.5 }));
        if (k < n - 1) items.push(A('a' + k, vb[0] / 2, y + h + 2, vb[0] / 2, y + 72, { tone: 'muted' }));
      });
      stage.render(items);
    }
    function paint(marks) {
      list.innerHTML = st.order.map(function (ci, k) {
        return '<li class="fcard' + (marks ? (marks[k] ? ' ok' : ' bad') : '') + '"><span class="fnum">' + (k + 1) + '</span><span class="ftext">' + esc(t.cards[ci].text) + '</span>' +
          '<select aria-label="Symbol for: ' + esc(t.cards[ci].text) + '" data-c="' + ci + '"><option value="">Choose a symbol…</option>' +
          SHAPES.map(function (s) { return '<option value="' + s[0] + '"' + (st.shape[ci] === s[0] ? ' selected' : '') + '>' + s[1] + '</option>'; }).join('') + '</select>' +
          '<span class="fmove"><button class="btn up" data-k="' + k + '" aria-label="Move up"' + (k === 0 ? ' disabled' : '') + '>▲</button><button class="btn dn" data-k="' + k + '" aria-label="Move down"' + (k === n - 1 ? ' disabled' : '') + '>▼</button></span></li>';
      }).join('');
      list.querySelectorAll('select').forEach(function (sel) { sel.onchange = function () { st.shape[+sel.dataset.c] = sel.value; persist(); paint(); }; });
      list.querySelectorAll('.up,.dn').forEach(function (b) {
        b.onclick = function () {
          var k = +b.dataset.k, j = b.classList.contains('up') ? k - 1 : k + 1, tmp = st.order[k];
          st.order[k] = st.order[j]; st.order[j] = tmp; persist(); paint();
          var again = list.querySelectorAll(b.classList.contains('up') ? '.up' : '.dn')[j]; if (again && !again.disabled) again.focus();
        };
      });
      draw(marks);
    }
    el.querySelector('.chk').onclick = function () {
      var marks = st.order.map(function (ci, k) { return ci === k && st.shape[ci] === t.cards[ci].shape; });
      var good = marks.filter(Boolean).length;
      paint(marks);
      res.hidden = false;
      if (good === n) { res.className = 'result ok'; res.textContent = 'Every card is in the right place with the right symbol. Task complete!'; S.done[did] = true; save(); renderSide(); }
      else {
        res.className = 'result bad';
        res.innerHTML = esc(good + ' of ' + n + ' cards are right. A red card is in the wrong place or has the wrong symbol.') + reviewLink(u, data, t.review);
      }
    };
    el.querySelector('.rst').onclick = function () { delete S.drafts[did]; save(); mountFlow(el, u, t, i, data); };
    el.querySelector('.sol').onclick = function () {
      st = { order: t.cards.map(function (c, k) { return k; }), shape: t.cards.map(function (c) { return c.shape; }) };
      persist(); paint(); res.hidden = false; res.className = 'result'; res.textContent = 'This is one correct flowchart. Read it from top to bottom.';
    };
    paint();
  }

  function renderHome() {
    var cont = S.last && itemOf[S.last] ? S.last : flat[0].id;
    var all = tracks.reduce(function (a, t) { var s = trackStats(t); return [a[0] + s.got, a[1] + s.total]; }, [0, 0]);
    var demoU = null, demo = null;
    units.some(function (u) { return u.visuals.some(function (v) { if (v.demo) { demoU = u; demo = v; return true; } return false; }); });
    main.innerHTML = '<div class="wrap">' +
      '<section class="hero"><div><div class="eyebrow">Java · CS1 + CS2</div>' +
      '<h1>Learn Java, <span>drawn step by step</span></h1>' +
      '<p class="lead">Every slide of the <b>CS1</b> and <b>CS2</b> courses, in the same order, with a simple explanation next to it. Many slides have a drawing that moves one step at a time, so you can <b>see</b> what happens.</p>' +
      '<div class="heroact"><a class="btn primary big" href="#/' + cont + '">' + (S.last ? 'Continue where you stopped' : 'Start with CS1') + '</a><span>' + (all[1] ? Math.round(all[0] / all[1] * 100) : 0) + '% of both courses done</span></div></div>' +
      (demo ? '<div class="demo" aria-label="Example drawing">' + vizHTML(demo, 'Example: ' + demo.title) + '</div>' : '') + '</section>' +
      '<section class="trackcards">' + tracks.map(function (t) {
        var s = trackStats(t), slides = t.units.reduce(function (a, u) { return a + u.count; }, 0);
        return '<a class="tcard" href="#/' + t.units[0].key + '/1"><div class="tname">' + esc(t.name) + '</div><div><h2>' + esc(t.title) + '</h2><p>' + esc(t.blurb) + '</p>' +
          '<div class="bar"><i style="width:' + s.pct + '%"></i></div>' +
          '<div class="meta"><span>' + t.units.length + ' units · ' + slides + ' slides</span><span>' + s.pct + '%</span></div></div></a>';
      }).join('') + '</section>' +
      '<section class="how"><h2>How each unit works</h2><div class="howgrid">' +
      '<div><b>Read the slide</b><p>The slide text comes first, exactly as in the course. When a slide has a picture, you can see the original too.</p></div>' +
      '<div><b>Understand it</b><p>Under each slide, a short explanation in simple English. Java words stay in English, like <code>class</code> and <code>extends</code>.</p></div>' +
      '<div><b>Watch</b><p>Press <b>Next step</b>. The drawing, the code line and the output move together.</p></div>' +
      '<div><b>Practice</b><p>A quick quiz after each part, and a full exam at the end of each unit, with tasks where you write it yourself. Hard words have a {{dotted line|خط منقّط}}: tap it to see the Arabic.</p></div>' +
      '</div></section>' +
      tracks.map(function (t) {
        return '<section class="modsec"><h2><span class="tpill">' + esc(t.name) + '</span> ' + esc(t.title) + '</h2><div class="modgrid">' + t.units.map(function (u) {
          var s = unitStats(u);
          return '<a class="mcard" href="#/' + u.key + '/1"><small>' + esc(t.name) + ' · Unit ' + u.n + '</small><h3>' + esc(u.title) + '</h3><p>' + (u.blurb ? gl(u.blurb) : u.count + ' slides.') + '</p>' +
            '<div class="bar"><i style="width:' + s.pct + '%"></i></div>' +
            '<div class="meta"><span>' + u.count + ' slides · ' + u.parts.length + ' part' + (u.parts.length > 1 ? 's' : '') + (u.exam ? ' · exam' : '') + '</span><span>' + s.pct + '%</span></div></a>';
        }).join('') + '</div></section>';
      }).join('') +
      '<footer class="foot">The slides are the CS1 and CS2 course slides, shown in their original order. The explanations, drawings, quizzes and exams are written new, in simple English, for learners whose English is at a middle level.</footer>' +
      '</div>';
    main.querySelector('.howgrid').innerHTML = gl(main.querySelector('.howgrid').innerHTML);
    if (demo) curViz = setupViz(main.querySelector('.demo'), demo, { autoplay: true, interval: 2400 });
  }

  /* ---------------- zoomed slide picture ---------------- */
  var zoomBox = null;
  function openZoom(img) {
    if (!zoomBox) {
      zoomBox = document.createElement('div'); zoomBox.className = 'zoombox'; zoomBox.hidden = true;
      zoomBox.innerHTML = '<button class="btn zclose" aria-label="Close">✕ Close</button><img alt="">';
      document.body.appendChild(zoomBox);
      zoomBox.onclick = closeZoom;
    }
    var z = zoomBox.querySelector('img'); z.src = img.src; z.alt = img.alt;
    zoomBox.hidden = false; zoomBox.querySelector('.zclose').focus();
  }
  function closeZoom() { if (zoomBox) zoomBox.hidden = true; }

  /* ---------------- router ---------------- */
  var routeNo = 0;
  function route() {
    if (curViz) curViz.stop();
    curViz = null;
    closeNav(); closeZoom();
    var id = (location.hash || '').replace(/^#\/?/, '');
    var x = itemOf[id];
    curItem = x || null;
    var my = ++routeNo;
    if (!x) {
      renderHome(); document.title = 'Visual Java'; renderSide(); window.scrollTo(0, 0); return;
    }
    S.last = id; sideTrack = x.u.course; save();
    main.innerHTML = '<div class="wrap"><p class="loading">Loading the slides…</p></div>';
    loadLesson(x.u).then(function (data) {
      if (my !== routeNo) return;
      if (x.kind === 'exam') { renderExam(x, data); document.title = 'Unit exam: ' + x.u.title + ' · Visual Java'; }
      else { renderSlide(x, data); document.title = x.u.title + ' · Slide ' + x.n + ' · Visual Java'; }
      renderSide(); window.scrollTo(0, 0);
    }, function () {
      if (my !== routeNo) return;
      main.innerHTML = '<div class="wrap"><p class="loading">The slides could not be loaded. Check your internet connection and reload the page.</p></div>';
    });
    renderSide();
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
    if (tg === 'INPUT' || tg === 'TEXTAREA' || tg === 'SELECT' || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'Escape') { closeNav(); hideTip(); closeZoom(); }
    /* ← → move between slides; , and . (or the buttons) move the drawing */
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && curItem) {
      var y = flat[curItem.i + (e.key === 'ArrowRight' ? 1 : -1)];
      if (y) { location.hash = hrefOf(y); e.preventDefault(); }
    }
    if (curViz && (e.key === '.' || e.key === ',')) { curViz.step(e.key === '.' ? 1 : -1); e.preventDefault(); }
  });

  /* ---------------- start ---------------- */
  applyHints();
  fetch('content/manifest.json').then(function (r) { return r.json(); }).then(function (m) {
    buildModel(m);
    return Promise.all(units.map(function (u) { return loadScript('js/units/' + u.key + '.js'); }));
  }).then(function () {
    finishModel();
    addEventListener('hashchange', route);
    route();
  }).catch(function (e) {
    console.error(e);
    main.innerHTML = '<div class="wrap"><p class="loading">The course could not be loaded. If you opened the file directly, run a small local web server instead (see README).</p></div>';
  });
})();
