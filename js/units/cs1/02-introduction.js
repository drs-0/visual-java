/* CS1 · Unit 2 · Introduction (73 slides): computers, binary, programs, Java, the first program, style, errors */
(function () {
  function mix(a, b) { var o = {}, k; for (k in a) o[k] = a[k]; for (k in b) o[k] = b[k]; return o; }
  function on(cond, a, b) { return cond ? a : b; }
  function bits(n, w) { var s = Math.max(0, Math.floor(n)).toString(2); while (s.length < (w || 8)) s = '0' + s; return s; }
  function cell(id, x, y, w, h, text, tone, o) { return B(id, x, y, w, h, mix({ title: String(text), mono: true, size: 15, tone: tone || 'muted', r: 4 }, o || {})); }

  /* ---------- 1. the parts of a computer (slides 3-5) ---------- */
  var PARTS = [
    { id: 'st', name: 'Storage\nDevices', ex: 'Disk, CD,\nand Tape' },
    { id: 'me', name: 'Memory', ex: '' },
    { id: 'cpu', name: 'CPU', ex: '' },
    { id: 'co', name: 'Communication\nDevices', ex: 'Modem,\nand NIC' },
    { id: 'in', name: 'Input\nDevices', ex: 'Keyboard,\nMouse' },
    { id: 'out', name: 'Output\nDevices', ex: 'Monitor,\nPrinter' }
  ];
  function busScene(hot, showEx) {
    var items = [A('bus', 15, 40, 545, 40, { head: false, tone: 'ink' }), T('bus-t', 280, 30, 'Bus', { anchor: 'middle', bold: true })];
    PARTS.forEach(function (p, i) {
      var x = 10 + i * 91, h = hot.indexOf(p.id) >= 0;
      items.push(A('l' + i, x + 43, 42, x + 43, 70, { tone: h ? 'accent' : 'muted', head: true }));
      items.push(B(p.id, x, 72, 86, 50, { title: p.name, size: 10, tone: h ? 'accent' : 'blue', hi: h, fill: h ? 'solid' : 'soft' }));
      if (showEx && p.ex) items.push(T('ex' + i, x + 43, 142, 'e.g., ' + p.ex, { anchor: 'middle', size: 11.5, tone: 'muted' }));
    });
    return items;
  }
  var computer = {
    id: 'computer', slides: [3, 5], title: 'The parts of a computer',
    steps: [
      { slide: 3, cap: 'A computer has six main parts. They all connect to the <b>bus</b>: the road that carries data between them.' },
      { slide: 3, cap: 'Examples: storage (disk, CD), communication (modem, NIC), input (keyboard, mouse) and output (monitor, printer).' },
      { slide: 4, cap: 'The <b>CPU</b> is the brain. It takes (retrieves) an instruction from memory, then does it (executes it).' },
      { slide: 4, cap: 'CPU speed: 1 megahertz (MHz) = 1 million pulses per second. 1 gigahertz (GHz) = 1000 MHz.' },
      { slide: 5, cap: '<b>Memory</b> is a row of bytes. Each byte has 8 bits. A program and its data must be in memory before the CPU can run them.' },
      { slide: 5, cap: 'Put new information in a byte, and its old content is <b>lost</b>. A byte is never empty: it always holds something.' }
    ],
    draw: function (k) {
      var hot = k === 0 ? PARTS.map(function (p) { return p.id; }) : k <= 1 ? [] : k <= 3 ? ['cpu', 'me'] : ['me'];
      var items = busScene(hot, k >= 1 && k <= 1);
      if (k === 2) {
        items.push(B('ins', 120, 210, 150, 40, { title: 'instruction', tone: 'accent', mono: true, size: 13, from: [101, 130] }));
        items.push(A('get', 150, 128, 270, 128, { tone: 'accent', label: 'retrieve', bend: -20, ly: 40 }));
        items.push(T('do', 330, 236, '→ CPU executes it', { tone: 'teal', bold: true }));
      }
      if (k === 3) {
        items.push(B('mhz', 40, 190, 220, 60, { title: '1 MHz', lines: ['= 1,000,000 pulses / second'], tone: 'blue', size: 15 }));
        items.push(B('ghz', 300, 190, 220, 60, { title: '1 GHz', lines: ['= 1000 MHz'], tone: 'teal', size: 15 }));
        items.push(T('i9', 280, 290, 'example: Intel Core i9 at 6 GHz', { anchor: 'middle', tone: 'muted' }));
      }
      if (k >= 4) {
        var vals = k === 4 ? ['01001010', '01100001', '01110110', '01100001'] : ['01001010', '00000111', '01110110', '01100001'];
        vals.forEach(function (v, i) {
          items.push(cell('b' + i, 60 + i * 115, 215, 105, 44, v, i === 1 && k === 5 ? 'accent' : 'teal', { size: 13.5, tag: 'byte ' + i, hi: i === 1 && k === 5 }));
        });
        if (k === 5) {
          items.push(T('old', 232, 290, 'old: 01100001 (lost)', { anchor: 'middle', tone: 'red', size: 12.5 }));
          items.push(T('new', 232, 310, 'new: 00000111', { anchor: 'middle', tone: 'accent', bold: true, size: 12.5 }));
        } else items.push(T('one', 280, 300, 'each byte = 8 bits', { anchor: 'middle', tone: 'muted' }));
      }
      return items;
    }
  };

  /* ---------- 2. how data is stored (slide 6) ---------- */
  var ROWS = [['2000', '01001010', 'character ‘J’'], ['2001', '01100001', 'character ‘a’'], ['2002', '01110110', 'character ‘v’'], ['2003', '01100001', 'character ‘a’'], ['2004', '00000011', 'number 3']];
  var stored = {
    id: 'stored', slides: [6, 6], title: 'Memory: addresses and bytes',
    steps: [
      { cap: 'Memory is a list of bytes. Every byte has an <b>address</b> (a number), like a house number.' },
      { cap: 'Address 2000 holds <b>01001010</b>: the encoding for the character ‘J’.' },
      { cap: 'Address 2001 holds 01100001: ‘a’.' },
      { cap: 'Address 2002 holds 01110110: ‘v’.' },
      { cap: 'Address 2003 holds 01100001: ‘a’ again. Same character, same bits.' },
      { cap: 'Address 2004 holds 00000011: the small number 3 fits in one byte.' },
      { cap: 'A big number that does not fit in one byte uses <b>several bytes next to each other</b>. A byte is the smallest storage unit.' }
    ],
    draw: function (k) {
      var items = [T('ha', 95, 30, 'address', { anchor: 'middle', bold: true, tone: 'muted' }), T('hc', 230, 30, 'content (8 bits)', { anchor: 'middle', bold: true, tone: 'muted' }), T('hm', 420, 30, 'meaning', { anchor: 'middle', bold: true, tone: 'muted' })];
      ROWS.forEach(function (r, i) {
        var y = 45 + i * 48, shown = k > i, cur = k === i + 1;
        items.push(T('a' + i, 95, y + 27, r[0], { anchor: 'middle', mono: true, bold: cur, tone: cur ? 'accent' : 'ink' }));
        items.push(cell('c' + i, 160, y, 140, 40, shown ? r[1] : '', cur ? 'accent' : shown ? 'teal' : 'muted', { hi: cur, dash: !shown }));
        if (shown) items.push(T('m' + i, 330, y + 26, r[2], { tone: cur ? 'accent' : 'ink', bold: cur }));
      });
      if (k === 6) {
        items.push(B('big', 160, 290, 140, 40, { title: 'big number', tone: 'blue', size: 13, dash: true }));
        items.push(T('bigt', 330, 315, 'uses several bytes', { tone: 'blue', bold: true }));
      }
      return items;
    }
  };

  /* ---------- 3. storage, monitor, communication (slides 7-10) ---------- */
  var SPEEDS = [['modem', 'regular modem', 56000, '56,000 bps'], ['dsl', 'DSL', 1120000, '20 x modem'], ['cab', 'cable modem', 1120000, 'as fast as DSL'], ['nic', 'NIC (10BaseT)', 10000000, '10 mbps']];
  var devices = {
    id: 'devices', slides: [7, 10], title: 'Storage, monitor and communication',
    steps: [
      { slide: 7, cap: 'Power is <b>on</b>. The program is in memory (so the CPU can use it) and also saved on the disk.' },
      { slide: 7, cap: 'Power is <b>off</b>. Memory is <b>volatile</b>: everything in it is lost. The disk keeps its data permanently.' },
      { slide: 7, cap: 'Power on again: the program is moved from the disk into memory when the computer uses it.' },
      { slide: 8, cap: 'The <b>monitor</b> displays text and graphics. Its quality depends on the resolution and the dot pitch.' },
      { slide: 9, cap: 'Low <b>resolution</b>: few pixels (tiny dots), so the picture looks rough.' },
      { slide: 9, cap: 'Higher resolution: more pixels across and down, so the same picture is sharper and clearer.' },
      { slide: 9, cap: '<b>Dot pitch</b>: the space between pixels. A smaller dot pitch gives a sharper display.' },
      { slide: 10, cap: 'Communication devices: a regular modem, DSL (20 times faster), a cable modem (as fast as DSL) and a NIC for a local network (LAN).' }
    ],
    draw: function (k) {
      var items = [];
      if (k <= 2) {
        var power = k !== 1;
        items.push(B('pw', 20, 20, 120, 44, { title: power ? 'power ON' : 'power OFF', tone: power ? 'teal' : 'red', fill: 'solid', size: 15 }));
        items.push(B('mem', 60, 120, 190, 120, { tag: 'memory (volatile)', title: power ? 'program\n+ data' : '(empty)', tone: power ? 'blue' : 'muted', dash: !power, size: 15 }));
        items.push(B('disk', 320, 120, 190, 120, { tag: 'storage device (disk)', title: 'program\n+ data', tone: 'teal', size: 15, r: 30 }));
        if (k === 2) items.push(A('load', 318, 180, 252, 180, { tone: 'accent', label: 'moved to memory' }));
        if (k === 1) items.push(T('lost', 155, 270, 'lost!', { anchor: 'middle', tone: 'red', bold: true, size: 18 }));
        items.push(T('kept', 415, 270, 'kept', { anchor: 'middle', tone: 'teal', bold: true, size: 18 }));
        return items;
      }
      if (k === 3) {
        items.push(B('scr', 150, 30, 260, 180, { tone: 'blue', r: 10 }));
        items.push(T('txt', 175, 70, 'Hello!', { mono: true, bold: true, size: 20, tone: 'ink' }));
        [40, 70, 55, 95].forEach(function (h, i) { items.push(B('bar' + i, 290 + i * 26, 190 - h, 18, h, { tone: 'teal', fill: 'solid', r: 2 })); });
        items.push(B('stand', 255, 212, 50, 30, { tone: 'muted', r: 2 }));
        items.push(T('tg', 280, 280, 'text and graphics', { anchor: 'middle', tone: 'muted', bold: true }));
        return items;
      }
      if (k === 4 || k === 5) {
        var n = k === 4 ? 8 : 16, sz = 160 / n;
        for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
          var cx = (c + 0.5) / n - 0.5, cy = (r + 0.5) / n - 0.5, d = Math.sqrt(cx * cx + cy * cy);
          if (d > 0.28 && d < 0.46) items.push(B('px' + k + '-' + r + '-' + c, 200 + c * sz, 40 + r * sz, sz - 1, sz - 1, { tone: 'accent', fill: 'solid', r: 0 }));
        }
        items.push(B('frame', 196, 36, 168, 168, { tone: 'muted', fill: 'clear', r: 4 }));
        items.push(T('res', 280, 240, n + ' x ' + n + ' pixels', { anchor: 'middle', bold: true, tone: k === 4 ? 'red' : 'teal', size: 16 }));
        items.push(T('res2', 280, 266, k === 4 ? 'rough picture' : 'sharper picture', { anchor: 'middle', tone: 'muted' }));
        return items;
      }
      if (k === 6) {
        [0, 1].forEach(function (row) {
          var gap = row === 0 ? 14 : 4, y = 70 + row * 110;
          for (var i = 0; i < 8; i++) items.push(B('dp' + row + i, 60 + i * (24 + gap), y, 24, 24, { tone: row ? 'teal' : 'muted', fill: 'solid', r: 12 }));
          items.push(T('dpt' + row, 60, y + 55, row ? 'small dot pitch: sharper' : 'large dot pitch', { tone: row ? 'teal' : 'muted', bold: true }));
        });
        return items;
      }
      SPEEDS.forEach(function (s, i) {
        var w = Math.max(4, Math.round(s[2] / 10000000 * 300)), y = 40 + i * 66;
        items.push(T('sn' + i, 20, y + 22, s[1], { bold: true }));
        items.push(B('sb' + i, 150, y + 4, w, 26, { tone: i === 3 ? 'teal' : 'blue', fill: 'solid', r: 3 }));
        items.push(T('sv' + i, 160 + w, y + 22, s[3], { tone: 'muted', mono: true, size: 12.5 }));
      });
      items.push(T('lan', 20, 320, 'NIC = network interface card: connects a computer to a LAN', { tone: 'muted', size: 12.5 }));
      return items;
    }
  };

  /* ---------- 4. inside the CPU (slide 11) ---------- */
  var cpu = {
    id: 'cpu', slides: [11, 11], title: 'Inside a digital computer',
    steps: [
      { cap: 'The CPU has a <b>control unit</b>, an <b>arithmetic logic unit (ALU)</b> and <b>registers</b> (R1, R2 ... Rn). The bus connects it to memory, the disk and the I/O devices.' },
      { cap: 'Example: you type 5 and 3 on the keyboard. The numbers travel on the bus into main memory.' },
      { cap: 'The control unit directs the work: it copies the numbers into registers. R1 = 5, R2 = 3.' },
      { cap: 'The ALU does the arithmetic: 5 + 3 = 8. The result goes into a register.' },
      { cap: 'The result travels on the bus to an output device: the printer prints 8.' }
    ],
    draw: function (k) {
      var items = [
        B('cpu', 15, 10, 530, 150, { tag: '', title: 'CENTRAL PROCESSING UNIT', band: true, tone: 'ink', size: 13 }),
        B('cu', 30, 50, 150, 95, { title: 'Control Unit', tone: k === 2 ? 'accent' : 'blue', hi: k === 2, size: 13 }),
        B('alu', 200, 50, 150, 95, { title: 'Arithmetic\nLogic Unit\n(ALU)', tone: k === 3 ? 'accent' : 'blue', hi: k === 3, size: 13 }),
        B('reg', 370, 50, 160, 95, { title: 'Registers', band: true, tone: k === 2 || k === 3 ? 'accent' : 'blue', size: 13 }),
        cell('r1', 385, 88, 60, 22, k >= 2 ? 'R1=5' : 'R1', 'blue', { size: 11.5 }),
        cell('r2', 455, 88, 60, 22, k >= 2 ? 'R2=3' : 'R2', 'blue', { size: 11.5 }),
        cell('rn', 420, 116, 60, 22, k >= 3 ? 'Rn=8' : 'Rn', k >= 3 ? 'accent' : 'blue', { size: 11.5 }),
        A('down', 280, 162, 280, 200, { head: false, tone: 'ink' }),
        A('bus', 15, 200, 545, 200, { head: false, tone: 'ink' }), T('bt', 520, 192, 'Bus', { anchor: 'end', bold: true }),
        B('mm', 15, 240, 120, 60, { title: 'Main\nMemory', tone: k === 1 ? 'accent' : 'teal', size: 13, lines: k >= 1 ? [] : [] }),
        B('dk', 155, 240, 110, 60, { title: 'Disk', tone: 'teal', size: 13 }),
        B('kb', 285, 240, 120, 60, { title: 'Keyboard', tone: k === 1 ? 'accent' : 'teal', hi: k === 1, size: 13 }),
        B('pr', 425, 240, 120, 60, { title: 'Printer', tone: k === 4 ? 'accent' : 'teal', hi: k === 4, size: 13 }),
        T('io', 415, 325, 'I/O devices', { anchor: 'middle', tone: 'muted', size: 12.5 })
      ];
      ['mm', 'dk', 'kb', 'pr'].forEach(function (id, i) { var x = [75, 210, 345, 485][i]; items.push(A('c' + id, x, 202, x, 238, { head: false, tone: 'muted' })); });
      if (k === 1) items.push(T('typed', 75, 334, '5, 3', { anchor: 'middle', mono: true, bold: true, tone: 'accent' }));
      if (k === 4) items.push(T('paper', 485, 334, '8', { anchor: 'middle', mono: true, bold: true, size: 18, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 5. bits and bytes (slides 12-17) ---------- */
  var bitsViz = {
    id: 'bits', slides: [12, 17], title: 'Bits and bytes',
    inputs: [{ id: 'n', label: 'number', value: 74, min: 0, max: 255 }], inputsLabel: 'A number for one byte (0 to 255):',
    presets: [{ label: '‘J’ (74)', values: { n: 74 } }, { label: '3', values: { n: 3 } }, { label: 'all off (0)', values: { n: 0 } }, { label: 'all on (255)', values: { n: 255 } }],
    steps: function (v) {
      return [
        { slide: 12, cap: 'A digital computer knows only <b>two states</b>: on or off. It uses a binary system with two digits: <b>0</b> and <b>1</b>.' },
        { slide: 13, cap: 'One on/off, true/false, 1/0 is called a <b>bit</b>. Think of a toggle switch: up = 1, down = 0.' },
        { slide: 14, cap: 'Memory is organized in groups of <b>8 bits</b>. Each group is a <b>byte</b>. These 8 switches show ' + v.n + ' = ' + bits(v.n) + '.' },
        { slide: 14, cap: 'Each switch has a value: 128, 64, 32, 16, 8, 4, 2, 1. Add the values of the switches that are on: ' + placeSum(v.n) + '.' },
        { slide: 16, cap: 'Names for groups: a <b>nybble</b> = 4 bits, a byte = 8 bits, a short word = 2 bytes (16 bits), a double word = 4 bytes, a long word = 8 bytes.' },
        { slide: 17, cap: 'Inside the wires, a bit is a voltage. Below the <b>threshold</b> = off (0). Above the threshold = on (1). This signal carries ' + bits(v.n) + '.' }
      ];
    },
    draw: function (k, s, v) {
      var b = bits(v.n), items = [];
      if (k === 0) {
        items.push(B('l0', 90, 80, 140, 140, { title: 'OFF', tone: 'muted', r: 70, size: 22 }));
        items.push(B('l1', 330, 80, 140, 140, { title: 'ON', tone: 'accent', fill: 'solid', r: 70, size: 22 }));
        items.push(T('t0', 160, 260, '0', { anchor: 'middle', mono: true, size: 30, bold: true, tone: 'muted' }));
        items.push(T('t1', 400, 260, '1', { anchor: 'middle', mono: true, size: 30, bold: true, tone: 'accent' }));
        return items;
      }
      if (k === 1) {
        var up = b[7] === '1';
        items.push(B('sw', 230, 60, 100, 180, { tone: 'muted', r: 14 }));
        items.push(B('knob', 245, up ? 72 : 166, 70, 62, { tone: up ? 'accent' : 'muted', fill: 'solid', r: 10 }));
        items.push(T('st', 280, 280, up ? 'up = 1 (on)' : 'down = 0 (off)', { anchor: 'middle', bold: true, size: 18, tone: up ? 'accent' : 'muted' }));
        items.push(T('one', 280, 310, 'one switch = one bit', { anchor: 'middle', tone: 'muted' }));
        return items;
      }
      if (k <= 3) {
        for (var i = 0; i < 8; i++) {
          var onBit = b[i] === '1', x = 30 + i * 64;
          items.push(B('s' + i, x, 60, 56, 110, { tone: 'muted', r: 10 }));
          items.push(B('k' + i, x + 8, onBit ? 68 : 118, 40, 44, { tone: onBit ? 'accent' : 'muted', fill: 'solid', r: 8 }));
          items.push(T('d' + i, x + 28, 200, b[i], { anchor: 'middle', mono: true, bold: true, size: 22, tone: onBit ? 'accent' : 'muted' }));
          if (k === 3) items.push(T('p' + i, x + 28, 228, String(Math.pow(2, 7 - i)), { anchor: 'middle', mono: true, size: 12.5, tone: onBit ? 'teal' : 'muted', bold: onBit }));
        }
        items.push(T('byte', 280, 40, '1 byte = 8 bits', { anchor: 'middle', bold: true, tone: 'blue' }));
        items.push(T('val', 280, 280, k === 3 ? placeSum(v.n) : bits(v.n) + '  =  ' + v.n, { anchor: 'middle', mono: true, bold: true, size: k === 3 ? 13 : 16, tone: 'teal' }));
        return items;
      }
      if (k === 4) {
        var rows = [['nybble', 0.5], ['byte', 1], ['short word', 2], ['double word', 4], ['long word', 8]];
        rows.forEach(function (r, i) {
          var y = 25 + i * 60;
          items.push(T('rn' + i, 20, y + 26, r[0], { bold: true }));
          for (var j = 0; j < Math.ceil(r[1]); j++) items.push(B('rb' + i + '-' + j, 140 + j * 42, y, r[1] < 1 ? 19 : 38, 36, { title: r[1] < 1 ? '' : 'B', tone: i === 1 ? 'accent' : 'blue', size: 12, r: 3 }));
          items.push(T('rv' + i, 550, y + 26, r[1] < 1 ? '4 bits' : (r[1] * 8) + ' bits', { anchor: 'end', mono: true, tone: 'muted', size: 12.5 }));
        });
        return items;
      }
      /* k === 5: the voltage signal */
      var top = 70, low = 210, thr = 140;
      items.push(A('thr', 20, thr, 545, thr, { dash: true, head: false, tone: 'red' }));
      items.push(T('thrt', 545, thr - 8, 'threshold', { anchor: 'end', tone: 'red', size: 12.5, bold: true }));
      for (var j2 = 0; j2 < 8; j2++) {
        var hi = b[j2] === '1', x0 = 40 + j2 * 62;
        items.push(A('sig' + j2, x0, hi ? top : low, x0 + 62, hi ? top : low, { head: false, tone: hi ? 'accent' : 'muted' }));
        if (j2 < 7 && b[j2] !== b[j2 + 1]) items.push(A('edge' + j2, x0 + 62, hi ? top : low, x0 + 62, hi ? low : top, { head: false, tone: 'muted' }));
        items.push(T('sb' + j2, x0 + 31, 285, b[j2], { anchor: 'middle', mono: true, bold: true, size: 18, tone: hi ? 'accent' : 'muted' }));
      }
      items.push(T('on', 545, top - 10, 'above: on', { anchor: 'end', tone: 'accent', size: 12.5, bold: true }));
      items.push(T('off', 545, low + 24, 'below: off', { anchor: 'end', tone: 'muted', size: 12.5, bold: true }));
      return items;
    }
  };
  function placeSum(n) {
    var b = bits(n), parts = [];
    for (var i = 0; i < 8; i++) if (b[i] === '1') parts.push(Math.pow(2, 7 - i));
    return parts.length ? parts.join(' + ') + ' = ' + n : 'no switch is on, so 0';
  }

  /* ---------- 6. number systems (slide 18) ---------- */
  function digitsIn(n, base) { return n.toString(base).toUpperCase().split(''); }
  var radix = {
    id: 'radix', slides: [18, 18], title: 'The same number in base 2, 8 and 16',
    inputs: [{ id: 'd', label: 'decimal', value: 45, min: 0, max: 4095 }], inputsLabel: 'A decimal number:',
    presets: [{ label: '45', values: { d: 45 } }, { label: '255', values: { d: 255 } }, { label: '1492', values: { d: 1492 } }, { label: '8', values: { d: 8 } }],
    steps: function (v) {
      return [
        { cap: 'Base 10 (decimal) uses the digits 0 to 9. Each place is worth 10 times the place on its right.' },
        { cap: '<b>Base 2</b> (binary) uses only 0 and 1. Places are worth 1, 2, 4, 8, 16 ... ' + v.d + ' = <b>' + v.d.toString(2) + '</b> in binary.' },
        { cap: '<b>Base 8</b> (octal) uses 0 to 7. Places are worth 1, 8, 64 ... ' + v.d + ' = <b>' + v.d.toString(8) + '</b> in octal.' },
        { cap: '<b>Base 16</b> (hexadecimal) uses 0 to 9 and A to F (A = 10 ... F = 15). ' + v.d + ' = <b>' + v.d.toString(16).toUpperCase() + '</b> in hexadecimal.' }
      ];
    },
    draw: function (k, s, v) {
      var base = [10, 2, 8, 16][k], ds = digitsIn(v.d, base), n = ds.length;
      var w = Math.min(56, Math.floor(500 / n)), x0 = 280 - n * w / 2, items = [];
      items.push(T('bt', 280, 40, 'base ' + base + ' digits: ' + ['0 to 9', '0 1', '0 to 7', '0 to 9, A to F'][k], { anchor: 'middle', bold: true, tone: 'blue', size: 15 }));
      ds.forEach(function (d, i) {
        var place = Math.pow(base, n - 1 - i);
        items.push(cell('d' + i, x0 + i * w, 110, w - 4, 56, d, 'accent', { size: w > 40 ? 22 : 16, fill: d === '0' ? 'soft' : 'solid' }));
        if (w >= 40 || place < 1000) items.push(T('p' + i, x0 + i * w + (w - 4) / 2, 190, String(place), { anchor: 'middle', mono: true, size: w > 40 ? 12.5 : 10, tone: 'muted' }));
      });
      items.push(T('pl', 280, 220, 'place values', { anchor: 'middle', tone: 'muted', size: 12.5 }));
      items.push(T('eq', 280, 290, v.d + ' (base 10) = ' + v.d.toString(base).toUpperCase() + ' (base ' + base + ')', { anchor: 'middle', mono: true, bold: true, tone: 'teal', size: 15 }));
      return items;
    }
  };

  /* ---------- 7. binary addition and subtraction (slide 19) ---------- */
  var binops = {
    id: 'binops', slides: [19, 19], title: 'Adding and subtracting in binary',
    inputs: [{ id: 'a', label: 'A', value: 203, min: 0, max: 255 }, { id: 'b', label: 'B', value: 157, min: 0, max: 255 }], inputsLabel: 'Decimal values:', defaults: { op: 1 },
    presets: [{ label: 'Slide: 11001011 + 10011101', values: { a: 203, b: 157, op: 1 } }, { label: 'Slide: 11001011 − 10011101', values: { a: 203, b: 157, op: 0 } }, { label: '5 + 3', values: { a: 5, b: 3, op: 1 } }, { label: '12 − 5', values: { a: 12, b: 5, op: 0 } }],
    steps: function (v) {
      var plus = v.op !== 0 || v.a < v.b, steps = [{ cap: (plus ? 'Add' : 'Subtract') + ' column by column, from the right, <b>the same as for decimal numbers</b>. The only digits are 0 and 1.' }];
      var A = bits(v.a), Bb = bits(v.b), carry = 0, borrow = 0;
      for (var i = 7; i >= 0; i--) {
        var x = +A[i], y = +Bb[i], cap;
        if (plus) {
          var t = x + y + carry;
          cap = 'Column ' + (8 - i) + ': ' + x + ' + ' + y + (carry ? ' + 1 (carry)' : '') + ' = ' + t + (t >= 2 ? ' → write ' + (t % 2) + ', carry 1' : ' → write ' + t);
          carry = t >= 2 ? 1 : 0;
        } else {
          var u = x - y - borrow;
          cap = 'Column ' + (8 - i) + ': ' + x + ' − ' + y + (borrow ? ' − 1 (borrow)' : '') + (u < 0 ? ' is below 0 → borrow 2: ' + (u + 2) : ' = ' + u);
          borrow = u < 0 ? 1 : 0;
        }
        steps.push({ cap: cap + '.' });
      }
      var r = plus ? v.a + v.b : v.a - v.b;
      steps.push({ cap: 'Result: ' + (plus ? bits(r, 9) : bits(r)) + '. Check in decimal: ' + v.a + (plus ? ' + ' : ' − ') + v.b + ' = ' + r + '.' });
      return steps;
    },
    draw: function (k, s, v) {
      var plus = v.op !== 0 || v.a < v.b, Ab = bits(v.a), Bb = bits(v.b), items = [];
      var r = plus ? v.a + v.b : v.a - v.b, R = plus ? bits(r, 9) : " " + bits(r);
      var inMark = [], c = 0;
      for (var i = 7; i >= 0; i--) {
        var x = +Ab[i], y = +Bb[i];
        inMark[i] = c;
        if (plus) c = x + y + c >= 2 ? 1 : 0; else c = x - y - c < 0 ? 1 : 0;
      }
      var cw = 44, x0 = 70;
      items.push(T("op", x0 - 4, 178, plus ? "+" : "−", { anchor: "end", mono: true, bold: true, size: 24, tone: "ink" }));
      for (var j = 0; j < 9; j++) {
        var bi = j - 1, x1 = x0 + j * cw, cur = bi >= 0 && bi === 8 - k;
        var shown = k >= 9 || (bi >= 0 && bi >= 8 - k && k >= 1);
        if (bi >= 0) {
          items.push(cell("a" + j, x1, 100, cw - 4, 40, Ab[bi], cur ? "accent" : "blue", { size: 18, hi: cur }));
          items.push(cell("b" + j, x1, 150, cw - 4, 40, Bb[bi], cur ? "accent" : "blue", { size: 18, hi: cur }));
          if (inMark[bi] && shown) items.push(T("m" + j, x1 + 20, 90, plus ? "1" : "−1", { anchor: "middle", mono: true, size: 12.5, bold: true, tone: "red" }));
        }
        var rd = R[j].trim();
        items.push(cell("r" + j, x1, 220, cw - 4, 44, shown && rd ? rd : "", shown && rd ? (cur ? "accent" : "teal") : "muted", { size: 18, dash: !(shown && rd), fill: cur ? "solid" : "soft" }));
      }
      items.push(A("line", x0 - 10, 205, x0 + 9 * cw, 205, { head: false, tone: "ink" }));
      items.push(T("carry", x0 + 9 * cw - 2, 66, plus ? "carry" : "borrow", { anchor: "end", size: 12, tone: "red", bold: true }));
      items.push(T("dec", 280, 310, v.a + (plus ? " + " : " − ") + v.b + " = " + r + " (decimal)", { anchor: "middle", mono: true, tone: k >= 9 ? "teal" : "muted", bold: k >= 9 }));
      return items;
    }
  };

  /* ---------- 8. decimal to binary (slide 20) ---------- */
  var tobin = {
    id: 'tobin', slides: [20, 20], title: 'From decimal to binary',
    inputs: [{ id: 'n', label: 'decimal', value: 13, min: 1, max: 4095 }], inputsLabel: 'Number:',
    presets: [{ label: '13', values: { n: 13 } }, { label: 'Slide: 1492', values: { n: 1492 } }, { label: '255', values: { n: 255 } }, { label: '64', values: { n: 64 } }],
    steps: function (v) {
      var q = v.n, st = [{ cap: 'Divide the number by 2 again and again. Write down each <b>remainder</b> (0 or 1). Stop when the quotient is 0.' }];
      while (q > 0) { st.push({ cap: q + ' ÷ 2 = ' + Math.floor(q / 2) + ', remainder <b>' + (q % 2) + '</b>.' }); q = Math.floor(q / 2); }
      st.push({ cap: 'Now read the remainders from the <b>bottom up</b>: ' + v.n + ' = <b>' + v.n.toString(2) + '</b> in binary.' });
      return st;
    },
    draw: function (k, s, v) {
      var rows = [], q = v.n;
      while (q > 0) { rows.push([q, q % 2]); q = Math.floor(q / 2); }
      var n = rows.length, rh = Math.min(26, Math.floor(250 / (n + 1))), items = [];
      items.push(T('hq', 110, 24, 'quotients', { anchor: 'middle', bold: true, tone: 'muted' }));
      items.push(T('hr', 220, 24, 'remainders', { anchor: 'middle', bold: true, tone: 'muted' }));
      for (var i = 0; i <= n; i++) {
        var shown = i <= k, y = 46 + i * rh;
        if (!shown) continue;
        var val = i < n ? rows[i][0] : 0;
        items.push(T('q' + i, 110, y + rh * 0.7, String(val), { anchor: 'middle', mono: true, size: Math.min(15, rh * 0.62), tone: i === k ? 'accent' : 'ink', bold: i === k }));
        if (i < n && k > i) items.push(T('r' + i, 220, y + rh * 0.7 + rh, String(rows[i][1]), { anchor: 'middle', mono: true, size: Math.min(15, rh * 0.62), bold: true, tone: rows[i][1] ? 'accent' : 'blue' }));
      }
      if (k === n + 1) {
        var bin = v.n.toString(2), w = Math.min(28, Math.floor(260 / bin.length));
        bin.split('').forEach(function (d, j) { items.push(cell('o' + j, 280 + j * w, 150, w - 2, 34, d, 'teal', { size: w > 22 ? 16 : 12, fill: 'solid' })); });
        items.push(A('up', 250, 46 + n * rh + rh, 250, 60, { tone: 'accent' }));
        items.push(T('upt', 256, 56, 'read up', { tone: 'accent', bold: true, size: 12.5 }));
        items.push(T('res', 280 + bin.length * w / 2, 215, v.n + ' = ' + bin, { anchor: 'middle', mono: true, bold: true, tone: 'teal', size: 13 }));
      }
      return items;
    }
  };

  /* ---------- 9. a letter to binary and back (slide 21) ---------- */
  var letter = {
    id: 'letter', slides: [21, 21], title: 'A letter becomes binary and back', defaults: { c: 68 },
    presets: [{ label: 'D', values: { c: 68 } }, { label: 'J', values: { c: 74 } }, { label: 'A', values: { c: 65 } }, { label: 'Z', values: { c: 90 } }],
    steps: function (v) {
      var L = String.fromCharCode(v.c);
      return [
        { cap: 'Step 1. The user presses the capital letter <b>' + L + '</b> (shift + ' + L + ') on the keyboard.' },
        { cap: 'Step 2. An electronic signal for ' + L + ' is sent to the system unit.' },
        { cap: 'Step 3. The signal is converted to its ASCII binary code, <b>' + bits(v.c) + '</b>, and stored in memory.' },
        { cap: 'Step 4. After processing, the binary code is converted to an image and displayed on the screen.' }
      ];
    },
    draw: function (k, s, v) {
      var L = String.fromCharCode(v.c);
      return [
        B('key', 20, 40, 120, 90, { tag: 'keyboard', title: L, size: 34, tone: k === 0 ? 'accent' : 'blue', hi: k === 0, r: 12 }),
        A('s1', 142, 85, 208, 85, { tone: k >= 1 ? 'accent' : 'muted', label: 'signal', dash: k < 1 }),
        B('unit', 210, 40, 150, 90, { tag: 'system unit', title: k >= 2 ? bits(v.c) : '…', mono: true, size: k >= 2 ? 16 : 20, tone: k === 1 || k === 2 ? 'accent' : 'blue', hi: k === 2 }),
        T('ascii', 285, 150, k >= 2 ? 'ASCII code ' + v.c : '', { anchor: 'middle', tone: 'muted', size: 12.5 }),
        B('mem', 210, 190, 150, 50, { tag: 'memory', title: k >= 2 ? bits(v.c) : '', mono: true, size: 15, tone: k >= 2 ? 'teal' : 'muted', dash: k < 2 }),
        A('s3', 362, 85, 418, 85, { tone: k >= 3 ? 'accent' : 'muted', label: 'image', dash: k < 3 }),
        B('scr', 420, 30, 120, 110, { tag: 'monitor', title: k >= 3 ? L : '', size: 48, tone: k === 3 ? 'accent' : 'blue', hi: k === 3, r: 6 }),
        T('cycle', 280, 300, ['key → signal', 'signal → system unit', 'binary in memory', 'binary → image'][k], { anchor: 'middle', bold: true, tone: 'accent' })
      ];
    }
  };

  /* ---------- 10. three kinds of languages (slides 23-25) ---------- */
  var langs = {
    id: 'langs', slides: [23, 25], title: 'Machine, assembly and high-level languages',
    steps: [
      { slide: 23, cap: '<b>Machine language</b>: the computer’s own instructions, in binary. Hard to write, read and change.' },
      { slide: 24, cap: '<b>Assembly language</b>: short words instead of binary. An <b>assembler</b> converts it into machine code.' },
      { slide: 25, cap: '<b>High-level language</b>: English-like and easy to learn. This line computes the area of a circle with radius 5.' }
    ],
    draw: function (k) {
      var cols = [
        ['ml', 'Machine', '1101101010011010', 'add two numbers'],
        ['as', 'Assembly', 'ADDF3 R1, R2, R3', 'add two numbers'],
        ['hl', 'High-level', 'area = 5 * 5 * 3.1415;', 'area of a circle']
      ];
      var items = [];
      cols.forEach(function (c, i) {
        var y = 20 + i * 100, cur = i === k, shown = i <= k;
        items.push(B(c[0], 20, y, 520, 80, { tag: c[1] + ' language', title: shown ? c[2] : '', mono: true, size: 17, tone: cur ? 'accent' : shown ? 'teal' : 'muted', hi: cur, dash: !shown }));
        if (shown) items.push(T(c[0] + 't', 530, y + 72, c[3], { anchor: 'end', tone: 'muted', size: 12 }));
      });
      if (k >= 1) items.push(A('asm', 280, 118, 280, 102, { tone: 'accent', label: 'assembler', la: 'start', lx: 8, ly: 8 }));
      items.push(T('easy', 280, 335, k === 0 ? 'hard for people' : k === 1 ? 'a little easier' : 'easy to read and write', { anchor: 'middle', bold: true, tone: ['red', 'blue', 'teal'][k] }));
      return items;
    }
  };

  /* ---------- 11. interpreter and compiler (slides 27-29) ---------- */
  var SRC = ['area = 5 * 5 * 3.1415;', 'print area', 'stop'];
  var translate = {
    id: 'translate', slides: [27, 29], title: 'Interpreter or compiler?',
    steps: [
      { slide: 27, cap: 'A program in a high-level language is <b>source code</b>. The computer cannot run it directly: it must be translated into machine code.' },
      { slide: 28, cap: '<b>Interpreter</b>: it reads <b>one</b> statement, translates it, and executes it right away.' },
      { slide: 28, cap: 'Then the next statement: translate, execute. One statement can become several machine instructions.' },
      { slide: 28, cap: 'And the last one. The interpreter works one statement at a time until the end.' },
      { slide: 29, cap: '<b>Compiler</b>: it translates the <b>entire</b> source code first, into a machine-code file.' },
      { slide: 29, cap: 'Then the machine-code file is executed, and you see the output.' }
    ],
    draw: function (k) {
      var items = [];
      var comp = k >= 4;
      items.push(B('src', 15, 40, 190, 130, { tag: 'high-level source file', tone: 'blue', r: 14 }));
      SRC.forEach(function (l, i) {
        var hot = !comp && k - 1 === i;
        items.push(T('l' + i, 25, 80 + i * 30, l, { mono: true, size: 12, tone: hot ? 'accent' : 'ink', bold: hot }));
      });
      if (k === 0) {
        items.push(A('t0', 207, 105, 333, 105, { tone: 'accent', label: 'must be translated' }));
        items.push(B('mc', 335, 60, 200, 90, { tag: 'machine code', title: '0101100011…', mono: true, tone: 'teal', size: 14 }));
        return items;
      }
      if (!comp) {
        var i2 = k - 1;
        items.push(A('in1', 207, 82 + i2 * 30, 263, 105, { tone: 'accent' }));
        items.push(B('int', 265, 80, 110, 50, { title: 'Interpreter', tone: 'accent', hi: true, size: 13 }));
        items.push(A('in2', 377, 105, 413, 105, { tone: 'accent', label: 'execute' }));
        items.push(B('out', 415, 60, 125, 100, { tag: 'output', title: ['area = 78.5375', 'prints it', 'done'][i2], tone: 'teal', size: 12.5, mono: true }));
        items.push(T('one', 280, 260, 'statement ' + (i2 + 1) + ' of 3: translate, then run at once', { anchor: 'middle', bold: true, tone: 'accent' }));
        return items;
      }
      items.push(A('c1', 207, 105, 233, 105, { tone: 'accent' }));
      items.push(B('cmp', 235, 80, 90, 50, { title: 'Compiler', tone: 'accent', hi: k === 4, size: 13 }));
      items.push(A('c2', 327, 105, 353, 105, { tone: 'accent' }));
      items.push(B('mcf', 355, 40, 185, 130, { tag: 'machine-code file', title: '0101100011011100\n1111100011000100', mono: true, size: 11.5, tone: 'teal', r: 14 }));
      if (k === 5) {
        items.push(A('c3', 447, 172, 447, 208, { tone: 'accent' }));
        items.push(B('exe', 382, 210, 130, 40, { title: 'Executor', tone: 'accent', hi: true, size: 13 }));
        items.push(A('c4', 447, 252, 447, 278, { tone: 'accent' }));
        items.push(B('out2', 372, 280, 150, 44, { tag: '', title: 'Output', tone: 'teal', size: 14 }));
      }
      items.push(T('all', 120, 230, k === 4 ? 'the whole file at once' : 'then run the file', { anchor: 'middle', bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 12. operating system layers (slide 30) ---------- */
  var os = {
    id: 'os', slides: [30, 30], title: 'Where the operating system sits',
    steps: [
      { cap: 'Four layers. The <b>user</b> works with <b>application programs</b>, like a Web browser or a word processor.' },
      { cap: 'Application programs do not touch the hardware. They ask the <b>operating system</b> (OS).' },
      { cap: 'The OS manages and controls the computer’s activities: it talks to the <b>hardware</b>.' },
      { cap: 'Without an OS installed and running, application programs <b>cannot run</b>. Popular OS: Windows, Mac OS, Linux.' }
    ],
    draw: function (k) {
      var L = [['u', 'User', 0], ['ap', 'Application Programs', 1], ['osb', 'Operating System', 2], ['hw', 'Hardware', 3]];
      var items = [];
      L.forEach(function (l, i) {
        var y = 20 + i * 78, hot = (k === 0 && i <= 1) || (k === 1 && (i === 1 || i === 2)) || (k === 2 && i >= 2) || (k === 3 && i === 2);
        items.push(B(l[0], 120, y, 280, 54, { title: l[1], tone: hot ? 'accent' : 'blue', hi: hot, size: 15 }));
        if (i < 3) items.push(A('ar' + i, 260, y + 56, 260, y + 76, { tone: 'muted' }));
      });
      items.push(A('side', 402, 47, 402, 254, { tone: 'muted', via: [[460, 47], [460, 254]], head: true }));
      if (k === 3) {
        items.push(T('x', 470, 140, 'no OS =', { tone: 'red', bold: true }));
        items.push(T('x2', 470, 160, 'no apps', { tone: 'red', bold: true }));
      }
      return items;
    }
  };

  /* ---------- 13. characteristics of Java (slides 34-45) ---------- */
  var TRAITS = ['Simple', 'Object-Oriented', 'Distributed', 'Interpreted', 'Robust', 'Secure', 'Architecture-Neutral', 'Portable', 'Performance', 'Multithreaded', 'Dynamic'];
  var traits = {
    id: 'traits', slides: [34, 45], title: 'Characteristics of Java',
    steps: [
      { slide: 34, cap: 'Eleven characteristics of Java. The next slides explain them one by one.' },
      { slide: 35, cap: '<b>Simple</b>: Java is partly modeled on C++, but simpler and better. Some call it “C++--”.' },
      { slide: 36, cap: '<b>Object-oriented</b>: Java was designed for OOP from the start. OOP helps you <b>reuse</b> code.' },
      { slide: 37, cap: '<b>Distributed</b>: several computers work together on a network. Networking is built into Java.' },
      { slide: 38, cap: '<b>Interpreted</b>: Java code is compiled to <b>bytecode</b>, and the JVM interprets the bytecode on any machine.' },
      { slide: 39, cap: '<b>Robust</b>: the compiler finds many problems early, and Java has runtime exception handling.' },
      { slide: 40, cap: '<b>Secure</b>: Java has security mechanisms that protect your system from harmful programs.' },
      { slide: 41, cap: '<b>Architecture-neutral</b>: “write once, run anywhere”. With a JVM, one program runs on any platform.' },
      { slide: 42, cap: '<b>Portable</b>: Java programs run on any platform without being recompiled.' },
      { slide: 43, cap: '<b>Performance</b>: the slide gives the same reason as portability: architecture-neutral programs run on any platform without recompiling.' },
      { slide: 44, cap: '<b>Multithreaded</b>: a program can do several tasks at the same time, and this is built into Java.' },
      { slide: 45, cap: '<b>Dynamic</b>: new code can be loaded while the program runs, with no recompiling and no big new versions.' }
    ],
    draw: function (k) {
      var items = [], cur = k - 1;
      TRAITS.forEach(function (t, i) {
        items.push(T('t' + i, 20, 30 + i * 28, (i === cur ? '▶ ' : '   ') + (i === 8 ? "Java's " : 'Java Is ') + t, { size: 13.5, bold: i === cur, tone: i === cur ? 'accent' : i < cur ? 'teal' : 'ink' }));
      });
      var X = 300, items2 = [];
      if (cur === 0) { items2.push(B('cpp', X, 70, 110, 60, { title: 'C++', tone: 'muted', size: 18 })); items2.push(A('arr', X + 112, 100, X + 138, 100, { tone: 'accent' })); items2.push(B('java', X + 140, 60, 110, 80, { title: 'Java', tone: 'accent', size: 20, hi: true })); items2.push(T('c', X + 125, 180, 'simpler, fewer problems', { anchor: 'middle', tone: 'teal', bold: true })); }
      if (cur === 1) { items2.push(B('o1', X, 50, 110, 60, { title: 'object', tone: 'teal', r: 16 })); items2.push(B('o2', X + 130, 50, 110, 60, { title: 'object', tone: 'teal', r: 16 })); items2.push(B('o3', X + 65, 140, 110, 60, { title: 'reuse', tone: 'accent', r: 16 })); items2.push(T('c', X + 120, 240, 'built from objects', { anchor: 'middle', tone: 'teal', bold: true })); }
      if (cur === 2) { [[X, 50], [X + 160, 50], [X, 170], [X + 160, 170]].forEach(function (p, i) { items2.push(B('pc' + i, p[0], p[1], 90, 50, { title: 'computer', tone: 'blue', size: 12 })); }); items2.push(A('n1', X + 92, 75, X + 158, 75, { tone: 'accent', head: false })); items2.push(A('n2', X + 45, 102, X + 45, 168, { tone: 'accent', head: false })); items2.push(A('n3', X + 205, 102, X + 205, 168, { tone: 'accent', head: false })); items2.push(T('c', X + 125, 260, 'work together on a network', { anchor: 'middle', tone: 'teal', bold: true })); }
      if (cur === 3 || cur === 6 || cur === 7 || cur === 8) {
        items2.push(B('bc', X + 60, 30, 130, 44, { title: 'bytecode', mono: true, tone: 'accent', size: 14, hi: cur === 3 }));
        ['Windows', 'Mac', 'Linux'].forEach(function (p, i) { items2.push(A('bj' + i, X + 125, 76, X + 5 + i * 82 + 38, 124, { tone: 'muted' })); items2.push(B('jvm' + i, X + 5 + i * 82, 126, 76, 40, { title: 'JVM', tone: 'teal', size: 12.5 })); items2.push(T('os' + i, X + 43 + i * 82, 190, p, { anchor: 'middle', size: 12.5, tone: 'muted' })); });
        items2.push(T('c', X + 125, 240, ['', '', '', 'the JVM interprets bytecode', '', '', 'write once, run anywhere', 'no recompiling', 'runs on any platform'][cur], { anchor: 'middle', tone: 'teal', bold: true }));
      }
      if (cur === 4) { items2.push(B('cmp', X, 60, 120, 50, { title: 'compiler', tone: 'blue', size: 14 })); items2.push(T('e1', X + 60, 132, 'finds errors early', { anchor: 'middle', tone: 'teal', bold: true })); items2.push(B('rt', X, 150, 120, 50, { title: 'runtime', tone: 'blue', size: 14 })); items2.push(T('e2', X + 60, 222, 'handles exceptions', { anchor: 'middle', tone: 'teal', bold: true })); }
      if (cur === 5) { items2.push(B('sh', X + 70, 50, 120, 140, { title: 'secure', tone: 'teal', r: 50, size: 16, hi: true })); items2.push(T('c', X + 130, 240, 'protects against stray programs', { anchor: 'middle', tone: 'teal', bold: true })); }
      if (cur === 9) { ['task 1', 'task 2', 'task 3'].forEach(function (t, i) { items2.push(A('th' + i, X, 70 + i * 50, X + 230, 70 + i * 50, { tone: ['accent', 'teal', 'blue'][i], label: t, la: 'start', lx: -110 })); }); items2.push(T('c', X + 115, 250, 'at the same time', { anchor: 'middle', tone: 'teal', bold: true })); }
      if (cur === 10) { items2.push(B('app', X, 70, 120, 90, { title: 'running\nprogram', tone: 'blue', size: 13 })); items2.push(B('new', X + 150, 90, 100, 50, { title: 'new code', tone: 'accent', size: 13, from: [X + 250, 90] })); items2.push(A('ld', X + 148, 115, X + 122, 115, { tone: 'accent' })); items2.push(T('c', X + 125, 220, 'loaded on the fly', { anchor: 'middle', tone: 'teal', bold: true })); }
      return items.concat(items2);
    }
  };

  /* ---------- 14. anatomy of a Java program (slides 49-62) ---------- */
  var WELCOME = '// This program prints Welcome to Java!\npublic class Welcome {\n  public static void main(String[] args) {\n     System.out.println("Welcome to Java!");\n  }\n}';
  var anatomy = {
    id: 'anatomy', slides: [49, 62], title: 'Anatomy of a Java program', code: WELCOME,
    steps: [
      { slide: 49, line: '1-6', cap: 'Listing 1.1: a whole Java program. When you run it, it prints one line.', out: 'Welcome to Java!' },
      { slide: 50, line: '1-6', clear: true, cap: 'A Java program has these parts: class name, main method, statements, statement terminator, reserved words, comments and blocks.' },
      { slide: 51, line: 2, cap: 'The <b>class name</b> is <b>Welcome</b>. Every program has at least one class. Class names start with an uppercase letter.' },
      { slide: 52, line: 3, cap: 'The <b>main method</b>. To run a class, it must have a method named main. The program starts here.' },
      { slide: 53, line: 4, cap: 'A <b>statement</b> is an action. This one displays the greeting “Welcome to Java!”.' },
      { slide: 54, line: 4, cap: 'The <b>semicolon</b> ; ends the statement. Every statement in Java ends with ;' },
      { slide: 55, line: '2-3', cap: '<b>Reserved words</b> (keywords) have a fixed meaning for the compiler: public, class, static, void. After class comes the class name.' },
      { slide: 56, line: '2-6', cap: 'Each pair of braces { } makes a <b>block</b>. The class block holds the method block.' },
      { slide: 57, line: '1-6', cap: 'Special symbols: { } braces, ( ) parentheses, [ ] brackets, // double slashes, " " quotation marks and ; semicolon.' },
      { slide: 58, line: [2, 3, 5, 6], cap: '<b>{ … }</b> braces: they open and close a block of statements.' },
      { slide: 59, line: [3, 4], cap: '<b>( … )</b> parentheses: used with methods, like main(...) and println(...).' },
      { slide: 60, line: 4, cap: '<b>;</b> semicolon: marks the end of a statement.' },
      { slide: 61, line: 1, cap: '<b>// …</b> double slashes: a comment line. Java ignores it. It is a note for people.' },
      { slide: 62, line: 4, cap: '<b>" … "</b> quotation marks: they enclose a string, a sequence of characters.' }
    ],
    draw: function (k) {
      var hl = function (keys) { return keys.indexOf(k) >= 0; };
      var items = [
        B('cm', 20, 10, 520, 30, { title: '// This program prints Welcome to Java!', mono: true, size: 12, tone: hl([12]) ? 'accent' : 'muted', hi: hl([12]), align: 'left' }),
        B('cls', 20, 52, 520, 260, { tag: '', title: 'public class Welcome {', band: true, align: 'left', mono: true, size: 13, tone: hl([2, 6, 7, 9]) ? 'accent' : 'blue', hi: hl([2, 7]) }),
        B('mth', 45, 100, 470, 170, { title: 'public static void main(String[] args) {', band: true, align: 'left', mono: true, size: 12, tone: hl([3, 6, 7, 9, 10]) ? 'accent' : 'teal', hi: hl([3, 7]) }),
        B('stm', 70, 150, 420, 50, { title: 'System.out.println("Welcome to Java!");', mono: true, size: 12.5, tone: hl([4, 5, 10, 11, 13]) ? 'accent' : 'ink', hi: hl([4]) })
      ];
      if (k === 0 || k === 1) items.push(T('lab', 280, 300, k === 0 ? 'class ⊃ main method ⊃ statement' : 'seven parts', { anchor: 'middle', bold: true, tone: 'muted' }));
      if (k === 2) items.push(T('n', 330, 76, '← class name: Welcome', { bold: true, tone: 'accent' }));
      if (k === 3) items.push(T('n', 280, 225, 'the program starts in main', { anchor: 'middle', bold: true, tone: 'accent' }));
      if (k === 4) items.push(T('n', 280, 225, 'an action: display a line', { anchor: 'middle', bold: true, tone: 'accent' }));
      if (k === 5 || k === 11) items.push(T('n', 470, 225, '↑ ;', { anchor: 'middle', bold: true, size: 20, tone: 'accent' }));
      if (k === 6) items.push(T('n', 280, 300, 'keywords: public  class  static  void', { anchor: 'middle', bold: true, tone: 'accent', mono: true, size: 12.5 }));
      if (k === 7) { items.push(T('n1', 530, 300, 'class block', { anchor: 'end', bold: true, tone: 'accent', size: 12.5 })); items.push(T('n2', 505, 260, 'method block', { anchor: 'end', bold: true, tone: 'accent', size: 12.5 })); }
      if (k === 8) items.push(T('n', 280, 300, '{ }   ( )   [ ]   //   " "   ;', { anchor: 'middle', bold: true, tone: 'accent', mono: true, size: 16 }));
      if (k === 9) items.push(T('n', 280, 300, '{ opens a block    } closes it', { anchor: 'middle', bold: true, tone: 'accent', mono: true, size: 13 }));
      if (k === 10) items.push(T('n', 280, 300, 'main( )   println( )', { anchor: 'middle', bold: true, tone: 'accent', mono: true, size: 14 }));
      if (k === 12) items.push(T('n', 280, 300, 'a comment: Java ignores it', { anchor: 'middle', bold: true, tone: 'accent' }));
      if (k === 13) items.push(T('n', 280, 225, '"Welcome to Java!" is a string', { anchor: 'middle', bold: true, tone: 'accent' }));
      return items;
    }
  };

  /* ---------- 15. programming style (slides 63-67) ---------- */
  var style = {
    id: 'style', slides: [63, 67], title: 'Good programming style',
    steps: [
      { slide: 63, cap: 'Four habits make code easy to read: comments, naming conventions, indentation and spacing, and block styles.' },
      { slide: 64, cap: 'At the <b>top</b> of the program, write a summary comment: what the program does, your name, class section, instructor and date.' },
      { slide: 65, cap: 'Choose meaningful names. For a <b>class</b>, capitalize the first letter of each word: <b>ComputeExpression</b>.' },
      { slide: 66, cap: '<b>Indent two spaces</b> inside each block, and use blank lines to separate parts of the code.' },
      { slide: 67, cap: 'Two block styles. The slide says: use the <b>end-of-line</b> style, with { at the end of the line.' }
    ],
    draw: function (k) {
      var items = [];
      if (k === 0) { ['Comments', 'Naming', 'Indentation', 'Block styles'].forEach(function (t, i) { items.push(B('h' + i, 20 + (i % 2) * 270, 40 + Math.floor(i / 2) * 120, 250, 90, { title: t, tone: 'blue', size: 17 })); }); return items; }
      if (k === 1) { items.push(B('hd', 20, 20, 520, boxH(5), { title: 'summary comment at the top', lines: ['// Program: ComputeArea', '// Computes the area of a circle', '// Name: ...   Section: ...', '// Instructor: ...   Date: ...', 'public class ComputeArea {'], tone: 'teal', mono: true })); return items; }
      if (k === 2) {
        [['computeexpression', false], ['Computeexpression', false], ['ComputeExpression', true]].forEach(function (n, i) {
          items.push(B('n' + i, 80, 40 + i * 85, 300, 60, { title: n[0], mono: true, size: 17, tone: n[1] ? 'teal' : 'red', fill: n[1] ? 'solid' : 'soft' }));
          items.push(T('m' + i, 400, 77 + i * 85, n[1] ? '✓ good' : '✗', { bold: true, size: 18, tone: n[1] ? 'teal' : 'red' }));
        });
        return items;
      }
      if (k === 3) {
        var lines = ['public class Test {', '··public static void main(String[] args) {', '····System.out.println("one");', '', '····System.out.println("two");', '··}', '}'];
        lines.forEach(function (l, i) { items.push(T('l' + i, 40, 50 + i * 30, l, { mono: true, size: 14, tone: l.indexOf('··') === 0 ? 'ink' : 'blue' })); });
        items.push(T('g', 40, 300, '·· = two spaces of indentation      empty line = spacing', { mono: true, size: 12, tone: 'accent', bold: true }));
        return items;
      }
      items.push(B('nl', 15, 20, 260, boxH(7), { tag: 'next-line style', lines: ['public class Test', '{', '  public static void', '    main(String[] args)', '  {', '    ...', '  }'], mono: true, tone: 'muted', lsize: 12 }));
      items.push(B('eol', 290, 20, 255, boxH(5), { tag: 'end-of-line style ✓', lines: ['public class Test {', '  public static void', '    main(String[] args) {', '    ...', '  }'], mono: true, tone: 'teal', lsize: 12, hi: true }));
      items.push(T('use', 417, 200, 'use this one', { anchor: 'middle', bold: true, tone: 'teal' }));
      return items;
    }
  };

  /* ---------- 16. programming errors (slides 68-71) ---------- */
  var errors = {
    id: 'errors', slides: [68, 71], title: 'Three kinds of errors',
    steps: [
      { slide: 68, cap: '<b>Syntax errors</b> are found by the compiler. <b>Runtime errors</b> stop (abort) the program. <b>Logic errors</b> give a wrong result.' },
      { slide: 69, cap: 'Syntax errors: <b>void</b> is missing in the main line, and the string has no closing quote. The compiler finds them, and the program does not run.' },
      { slide: 70, cap: 'Runtime error: the code compiles, but 1 / 0 (divide by zero) cannot be done. The program aborts while it runs.' },
      { slide: 71, cap: 'Logic error: the program runs and prints 67, but 35 °C is really 95 °F. In Java, 9 / 5 with whole numbers gives 1, not 1.8.', out: ['Celsius 35 is Fahrenheit degree ', '67'] }
    ],
    draw: function (k) {
      var items = [];
      var lanes = [['syn', 'Syntax error', 'compiler says no', 'red'], ['run', 'Runtime error', 'program aborts', 'accent'], ['log', 'Logic error', 'wrong result', 'blue']];
      if (k === 0) {
        lanes.forEach(function (l, i) { items.push(B(l[0], 20, 30 + i * 100, 520, 76, { title: l[1], lines: [l[2]], tone: l[3], size: 16 })); });
        return items;
      }
      if (k === 1) {
        items.push(T('c1', 20, 50, 'public class ShowSyntaxErrors {', { mono: true, size: 13 }));
        items.push(T('c2', 20, 80, '  public static ___ main(String[] args) {', { mono: true, size: 13 }));
        items.push(T('c3', 20, 110, '    System.out.println("Welcome to Java);', { mono: true, size: 13 }));
        items.push(T('c4', 20, 140, '  }', { mono: true, size: 13 })); items.push(T('c5', 20, 170, '}', { mono: true, size: 13 }));
        items.push(T('e1', 350, 84, '← void is missing', { tone: 'red', bold: true, size: 12.5 }));
        items.push(T('e2', 350, 114, '← no closing "', { tone: 'red', bold: true, size: 12.5 }));
        items.push(B('cc', 20, 220, 520, 60, { title: 'compiler: errors found, no program is made', tone: 'red', size: 14 }));
        return items;
      }
      if (k === 2) {
        items.push(T('c3', 20, 60, 'System.out.println(1 / 0);', { mono: true, size: 15, bold: true }));
        items.push(B('ok', 20, 100, 160, 50, { title: 'compiles ✓', tone: 'teal', size: 14 }));
        items.push(A('r1', 182, 125, 238, 125, { tone: 'accent' }));
        items.push(B('rn', 240, 100, 140, 50, { title: 'runs…', tone: 'blue', size: 14 }));
        items.push(A('r2', 382, 125, 418, 125, { tone: 'red' }));
        items.push(B('ab', 420, 90, 125, 70, { title: 'ABORT\n1 / 0', tone: 'red', fill: 'solid', size: 14 }));
        items.push(T('n', 280, 220, 'dividing by zero is not possible', { anchor: 'middle', tone: 'red', bold: true }));
        return items;
      }
      items.push(T('c4', 20, 50, '(9 / 5) * 35 + 32', { mono: true, size: 17, bold: true }));
      items.push(B('w1', 20, 80, 160, 50, { tag: 'Java computes', title: '9 / 5 = 1', mono: true, tone: 'red', size: 15 }));
      items.push(B('w2', 200, 80, 160, 50, { tag: '', title: '1 * 35 + 32', mono: true, tone: 'red', size: 15 }));
      items.push(B('w3', 380, 80, 160, 50, { tag: 'prints', title: '67', mono: true, tone: 'red', fill: 'solid', size: 18 }));
      items.push(B('r1', 20, 190, 160, 50, { tag: 'should be', title: '9 / 5 = 1.8', mono: true, tone: 'teal', size: 15 }));
      items.push(B('r2', 200, 190, 160, 50, { tag: '', title: '1.8 * 35 + 32', mono: true, tone: 'teal', size: 15 }));
      items.push(B('r3', 380, 190, 160, 50, { tag: 'correct', title: '95', mono: true, tone: 'teal', fill: 'solid', size: 18 }));
      items.push(T('n', 280, 300, 'it runs, but the answer is wrong', { anchor: 'middle', tone: 'blue', bold: true }));
      return items;
    }
  };

  /* ---------- 17. creating, compiling and running (slides 72-73) ---------- */
  var run = {
    id: 'run', slides: [72, 73], title: 'From source code to output', vb: [560, 360],
    steps: [
      { slide: 72, cap: '1. You <b>create</b> (or modify) the source code in an editor.' },
      { slide: 72, cap: '2. It is saved on the disk as <b>Welcome.java</b>: the source code file.' },
      { slide: 72, cap: '3. You <b>compile</b> it: <b>javac Welcome.java</b>.' },
      { slide: 72, cap: 'If compile errors occur, go back, fix the source code, and compile again.' },
      { slide: 72, cap: '4. No errors: the compiler makes <b>bytecode</b>, saved as <b>Welcome.class</b>.' },
      { slide: 72, cap: '5. You <b>run</b> the bytecode: <b>java Welcome</b>.' },
      { slide: 72, cap: '6. The result: “Welcome to Java!” is displayed on the console.', out: 'Welcome to Java!' },
      { slide: 72, cap: 'If there are runtime errors or an incorrect result, go back to the source code again.' },
      { slide: 73, clear: true, cap: 'Welcome.class and library code go to the <b>JVM</b> (Java Virtual Machine): the software that interprets bytecode.' },
      { slide: 73, cap: 'Bytecode runs on <b>any computer</b> that has a JVM. You write the program once. You do not recompile it for each machine.' }
    ],
    draw: function (k) {
      var items = [];
      if (k <= 7) {
        var box = function (id, y, t, at) { return B(id, 170, y, 220, 40, { title: t, mono: /\.|javac|java /.test(t), size: 13, tone: k === at ? 'accent' : k > at ? 'teal' : 'muted', hi: k === at, r: id === 'res' ? 20 : 6 }); };
        items.push(box('edit', 10, 'Create/Modify Source Code', 0));
        items.push(A('e1', 280, 52, 280, 68, { tone: k >= 1 ? 'accent' : 'muted' }));
        items.push(box('src', 70, 'Welcome.java', 1));
        items.push(A('e2', 280, 112, 280, 128, { tone: k >= 2 ? 'accent' : 'muted' }));
        items.push(box('cmp', 130, 'javac Welcome.java', 2));
        items.push(A('e3', 280, 172, 280, 188, { tone: k >= 4 ? 'accent' : 'muted' }));
        items.push(box('bc', 190, 'Welcome.class', 4));
        items.push(A('e4', 280, 232, 280, 248, { tone: k >= 5 ? 'accent' : 'muted' }));
        items.push(box('jr', 250, 'java Welcome', 5));
        items.push(A('e5', 280, 292, 280, 308, { tone: k >= 6 ? 'accent' : 'muted' }));
        items.push(box('res', 310, 'Welcome to Java!', 6));
        items.push(A('back1', 392, 150, 392, 30, { tone: k === 3 ? 'red' : 'muted', via: [[450, 150], [450, 30]], dash: k !== 3, label: '', head: true }));
        items.push(T('b1', 458, 95, 'compile\nerrors', { tone: k === 3 ? 'red' : 'muted', size: 12, bold: k === 3 }));
        items.push(A('back2', 392, 330, 392, 30, { tone: k === 7 ? 'red' : 'muted', via: [[520, 330], [520, 30]], dash: k !== 7, head: true }));
        items.push(T('b2', 545, 250, 'runtime\nerrors', { anchor: 'end', tone: k === 7 ? 'red' : 'muted', size: 12, bold: k === 7 }));
        items.push(T('l1', 20, 95, 'saved on disk', { tone: 'muted', size: 12 }));
        items.push(T('l2', 20, 215, 'bytecode on disk', { tone: 'muted', size: 12 }));
        return items;
      }
      items.push(B('jf', 10, 40, 120, 56, { title: 'Welcome.java', mono: true, size: 12, tone: 'muted' }));
      items.push(A('a1', 132, 68, 158, 68, { tone: 'accent', label: 'compiled by', ly: -8 }));
      items.push(B('jc', 160, 40, 100, 56, { title: 'Java\nCompiler', size: 12.5, tone: 'blue' }));
      items.push(A('a2', 262, 68, 288, 68, { tone: 'accent' }));
      items.push(B('cf', 290, 40, 130, 56, { title: 'Welcome.class', mono: true, size: 12, tone: 'teal' }));
      items.push(B('lib', 290, 110, 130, 36, { title: 'Library Code', size: 12, tone: 'teal' }));
      items.push(A('a3', 422, 68, 458, 68, { tone: 'accent' }));
      items.push(A('a4', 422, 128, 458, 80, { tone: 'accent', via: [[440, 128], [440, 80]] }));
      items.push(B('jvm', 460, 48, 85, 44, { title: 'JVM', tone: 'accent', hi: true, size: 15 }));
      if (k === 9) {
        items.push(B('ring1', 160, 170, 240, 170, { tone: 'muted', r: 85, fill: 'none' }));
        items.push(B('ring2', 195, 205, 170, 120, { tone: 'teal', r: 60 }));
        items.push(B('ring3', 230, 235, 100, 60, { title: 'Any\nComputer', tone: 'blue', r: 30, size: 12 }));
        items.push(T('rt1', 280, 190, 'Java Bytecode', { anchor: 'middle', size: 12.5, tone: 'muted', bold: true }));
        items.push(T('rt2', 280, 226, 'Java Virtual Machine', { anchor: 'middle', size: 12, tone: 'teal', bold: true }));
      }
      return items;
    }
  };


  function tbl(head, rows) {
    return '<div class="tblwrap"><table><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table></div>';
  }
  function trait(name, text, explain) {
    return { title: 'Characteristics of Java', image: false, explain: explain, blocks: [{ type: 'h', html: '<b>Java Is ' + name + '</b>' }].concat(text.map(function (t) { return { type: 'paragraph', text: t }; })) };
  }
  function bothBraceClass(code) { var o = (code.match(/\{/g) || []).length, c = (code.match(/\}/g) || []).length; return o >= 2 && o === c; }
  var P = function (t) { return { type: 'paragraph', text: t }; }, Bu = function (t, l) { return { type: 'bullet', text: t, level: l || 0 }; }, H = function (h) { return { type: 'h', html: h }; };
  var WELCOME_NL = '// This program prints Welcome to Java!\npublic class Welcome\n{\n  public static void main(String[] args)\n  {\n     System.out.println("Welcome to Java!");\n  }\n}';

  addUnit({
    course: 'cs1', lesson: '02-introduction',
    blurb: 'How a computer works, bits and binary numbers, programming languages, why Java, your first Java program, good style and the three kinds of errors.',
    parts: [
      {
        title: 'Computer basics', from: 1, to: 10,
        quiz: [
          { q: 'Which part is called the “brain” of the computer?', options: ['Memory', 'Monitor', 'Bus', 'CPU'], answer: 3, why: 'Slide 4: the CPU retrieves instructions from memory and executes them.' },
          { type: 'tf', q: 'Memory keeps its data when the power is turned off.', answer: false, why: 'Memory is <b>volatile</b>: the information is lost when the power is off. Storage devices keep it.' },
          { q: 'Slide 5 says: “A memory byte is never empty”. What does it mean?', options: ['It can never be changed once a value is stored in it', 'It always holds 00000000 until the program writes to it', 'It always holds some bits, even if they mean nothing to your program'], answer: 2, why: 'A byte always has 8 bits in it. The old content may just be meaningless to your program.' },
          { q: 'How much is 1 gigahertz (GHz)?', options: ['1000 megahertz', '1 million megahertz', '1024 bits'], answer: 0, why: 'Slide 4: 1 gigahertz is 1000 megahertz, and 1 megahertz is 1 million pulses per second.' },
          { q: 'What happens when the screen resolution is higher?', options: ['The screen gets slower', 'The pixels get bigger', 'The image is sharper and clearer'], answer: 2, why: 'Slide 9: the higher the resolution, the sharper and clearer the image.' },
          { q: 'Which device connects a computer to a local area network (LAN)?', options: ['A printer', 'A NIC', 'A CD drive'], answer: 1, why: 'Slide 10: a network interface card (NIC) connects a computer to a LAN.' }
        ]
      },
      {
        title: 'Bits, bytes and binary numbers', from: 11, to: 21,
        quiz: [
          { q: 'How many bits are in one byte?', options: ['4', '8', '16', '1024'], answer: 1, why: 'Slide 14: each group of eight bits is called a byte.' },
          { q: 'What is the smallest unit of data a computer can process?', options: ['A byte', 'A bit', 'A word'], answer: 1, why: 'Slide 12: a bit (binary digit) is the smallest unit of data.' },
          { type: 'fill', lang: 'none', q: 'Convert from binary to decimal.', code: '1011 (base 2) = ___ (base 10)', answer: ['11'], why: '8 + 0 + 2 + 1 = 11.' },
          { type: 'fill', lang: 'none', q: 'Convert from decimal to binary (divide by 2, read the remainders from the bottom up).', code: '13 (base 10) = ___ (base 2)', answer: ['1101'], why: '13 ÷ 2 = 6 r 1, 6 ÷ 2 = 3 r 0, 3 ÷ 2 = 1 r 1, 1 ÷ 2 = 0 r 1. Read up: 1101.' },
          { q: 'Which digits does base 16 (hexadecimal) use?', options: ['0 to 9 and A to F', '0 to 7', '0 and 1'], answer: 0, why: 'Slide 18. A = 10, B = 11 ... F = 15.' },
          { type: 'tf', q: 'A voltage above the threshold means “on”.', answer: true, why: 'Slide 17: below the threshold is off, above it is on.' },
          { type: 'fill', lang: 'none', q: 'Add these binary numbers.', code: '  0101\n+ 0011\n------\n  ___', answer: ['1000|01000'], why: '5 + 3 = 8, and 8 in binary is 1000. Column by column: 1+1 = 10 (write 0, carry 1), and so on.' }
        ]
      },
      {
        title: 'Programs and languages', from: 22, to: 30,
        quiz: [
          { q: 'What converts an assembly language program into machine code?', options: ['An assembler', 'An operating system', 'A monitor'], answer: 0, why: 'Slide 24: a program called an assembler converts assembly into machine code.' },
          { q: 'What does an <b>interpreter</b> do?', options: ['Translates the whole program into a file first', 'Reads one statement, translates it and executes it right away', 'Stores the program on the disk'], answer: 1, why: 'Slide 28. A compiler is the one that translates the entire source code first.' },
          { type: 'tf', q: 'A compiler translates the entire source code into a machine-code file, and then the file is executed.', answer: true, why: 'Slide 29.' },
          { q: 'A program written in a high-level language is called …', options: ['source code', 'machine code', 'an operating system'], answer: 0, why: 'Slide 27: a source program, or source code.' },
          { q: 'Which one is <b>not</b> an operating system?', options: ['Microsoft Windows', 'Linux', 'A Web browser', 'Mac OS'], answer: 2, why: 'A Web browser is an application program. It needs an operating system to run (slide 30).' },
          { q: 'Why is machine language hard to use?', options: ['It is too similar to English, so the computer misreads it', 'It is binary code, so it is tedious and hard to read and change', 'Computers cannot run it without translating it first'], answer: 1, why: 'Slide 23. Machine language is the one the computer runs directly.' }
        ]
      },
      {
        title: 'Why Java?', from: 31, to: 48,
        quiz: [
          { q: '“Write once, run anywhere” describes which characteristic?', options: ['Secure', 'Multithreaded', 'Architecture-neutral'], answer: 2, why: 'Slide 41: with a JVM, one program runs on any platform.' },
          { q: 'Java programs are compiled into …', options: ['assembly language', 'bytecode', 'HTML'], answer: 1, why: 'Slide 38: the programs are compiled into Java Virtual Machine code called bytecode.' },
          { type: 'tf', q: 'Java was designed to be object-oriented from the start.', answer: true, why: 'Slide 36: Java was designed from the start to be object-oriented.' },
          { q: 'Slide 39 says Java is <b>robust</b>. What does that mean here?', options: ['The compiler finds many problems early, and Java has runtime exception handling', 'Java programs are very short, so they have fewer places for errors', 'Java runs only on one kind of machine, so it is well tested there'], answer: 0, why: 'Robust = strong and reliable. Slide 39 gives these reasons.' },
          { q: 'Which JDK edition is for mobile devices like cell phones?', options: ['J2SE', 'J2ME', 'J2EE'], answer: 1, why: 'Slide 47: Java Micro Edition (J2ME).' },
          { q: 'Which one is a Java IDE?', options: ['NetBeans', 'Linux', 'The JVM'], answer: 0, why: 'Slide 48: NetBeans, Eclipse and IntelliJ IDEA.' }
        ]
      },
      {
        title: 'A simple Java program', from: 49, to: 62,
        quiz: [
          { type: 'output', q: 'What does this program print?', code: WELCOME, answer: 'Welcome to Java!', why: 'The statement in main prints the text between the quotation marks. The comment is not printed.' },
          { type: 'fill', q: 'One reserved word is missing.', code: 'public ___ Welcome {', answer: ['class'], why: 'After the word <code>class</code> comes the name of the class.' },
          { type: 'fill', q: 'Every statement must end with something. What is missing?', code: 'System.out.println("Hi")___', answer: [';'], why: 'Slide 54: every statement in Java ends with a semicolon.' },
          { q: 'Where does a Java program start running?', options: ['At the comment', 'In the main method', 'At the last line'], answer: 1, why: 'Slide 52: the program is executed from the main method.' },
          { q: 'Which symbol starts a comment line?', options: ['" "', '{ }', '//', ';'], answer: 2, why: 'Slide 57: double slashes precede a comment line.' },
          { type: 'order', q: 'Put the lines of the program in the right order.', lines: ['public class Welcome {', '  public static void main(String[] args) {', '     System.out.println("Welcome to Java!");', '  }', '}'], why: 'The class block holds the method block, and the method block holds the statement.' }
        ]
      },
      {
        title: 'Programming style', from: 63, to: 67,
        quiz: [
          { q: 'Which class name follows the naming convention?', options: ['computeexpression', 'ComputeExpression', 'Computeexpression'], answer: 1, why: 'Slide 65: capitalize the first letter of each word.' },
          { q: 'How many spaces does slide 66 say to indent?', options: ['None', 'Eight', 'Two'], answer: 2, why: '“Indent two spaces.”' },
          { type: 'tf', q: 'The slides say to use the next-line style for braces.', answer: false, why: 'Slide 67: use the <b>end-of-line</b> style.' },
          { q: 'Where should you put the summary comment about the program?', options: ['At the beginning of the program', 'At the end of the main method', 'Inside every statement'], answer: 0, why: 'Slide 64: include a summary at the beginning of the program.' },
          { q: 'Which block style is this?', code: 'public class Test\n{\n  public static void main(String[] args)\n  {\n    System.out.println("Block Styles");\n  }\n}', options: ['Next-line style', 'End-of-line style'], answer: 0, why: 'Each { is on the next line, by itself.' }
        ]
      },
      {
        title: 'Programming errors', from: 68, to: 71,
        quiz: [
          { q: 'Which kind of error is detected by the compiler?', options: ['Syntax error', 'Runtime error', 'Logic error'], answer: 0, why: 'Slide 68: syntax errors are detected by the compiler.' },
          { q: 'What kind of error is in this line?', code: 'System.out.println(1 / 0);', options: ['Syntax error', 'Logic error', 'Runtime error'], answer: 2, why: 'It compiles, but dividing by zero makes the program abort while it runs (slide 70).' },
          { type: 'output', q: 'What does this line print?', code: 'System.out.println((9 / 5) * 35 + 32);', answer: '67', why: 'With whole numbers, 9 / 5 is 1. Then 1 * 35 + 32 = 67. That is the logic error of slide 71.' },
          { q: 'A program runs, but it prints a wrong answer. This is a …', options: ['syntax error', 'logic error', 'runtime error'], answer: 1, why: 'Slide 68: logic errors produce incorrect results.' },
          { type: 'fill', q: 'Fix the first syntax error of slide 69: one word is missing.', code: 'public static ___ main(String[] args) {', answer: ['void'], why: 'The main method line is <code>public static void main(String[] args)</code>.' }
        ]
      },
      {
        title: 'Compiling and running', from: 72, to: 73,
        quiz: [
          { q: 'Which command compiles Welcome.java?', options: ['java Welcome', 'javac Welcome.java', 'run Welcome'], answer: 1, why: 'javac is the Java compiler. java runs the bytecode.' },
          { q: 'What does the compiler make from Welcome.java?', options: ['A new Welcome.java', 'Welcome.exe', 'Welcome.class (bytecode)'], answer: 2, why: 'Slide 73: Welcome.class is the Java bytecode file.' },
          { type: 'order', lang: 'text', q: 'Put the steps in order.', lines: ['Create the source code', 'Compile it with javac', 'Run the bytecode with java', 'See the result'], why: 'Slide 72. If there are errors, you go back to the source code.' },
          { type: 'tf', q: 'Java bytecode must be recompiled for each kind of computer.', answer: false, why: 'Slide 73: the bytecode runs on any computer with a JVM.' },
          { q: 'What is the JVM?', options: ['Software that interprets Java bytecode', 'A kind of keyboard', 'A file that holds source code'], answer: 0, why: 'Slide 73: the Java Virtual Machine is a software that interprets Java bytecode.' }
        ]
      }
    ],
    slides: {
      1: { cover: true, image: false, title: '', blocks: [P('Chapter 1 Introduction to Computers, Programs, and Java'), { type: 'note', text: 'An adapted version of the lecture notes associated with the textbook' }],
        explain: '<p>This unit is the start of Java. First you learn how a computer works and how it stores data. Then you meet programming languages and Java, and you write your <b>first Java program</b>.</p>' },
      2: { image: false, explain: '<p>The goals of the chapter. Do not worry about the long list: this unit covers each idea step by step. (The § signs are section numbers in the textbook.)</p>' },
      3: { blocks: [P('A computer consists of a CPU, memory, hard disk, floppy disk, monitor, printer, and communication devices.')],
        explain: '<p>A computer is many parts that work together. They all connect to the <b>bus</b>, a set of wires that carries data between the parts.</p><ul><li><b>Input devices</b> bring data in (keyboard, mouse).</li><li><b>Output devices</b> show results (monitor, printer).</li><li><b>Storage devices</b> keep data for a long time (disk).</li></ul>' },
      4: { image: false, blocks: [P('The central processing unit (CPU) is the brain of a computer. It retrieves instructions from memory and executes them. The CPU speed is measured in megahertz (MHz), with 1 megahertz equaling 1 million pulses per second. The speed of the CPU has been improved continuously. If you buy a PC now, you can get an Intel® Core™ i9 Processors at 6 gigahertz (1 gigahertz is 1000 megahertz).')],
        explain: '<p>The <b>CPU</b> does the real work. Again and again, it takes ({{retrieves|يجلب}}) the next instruction from memory and does it ({{executes|ينفّذ}} it).</p><p>Its speed is counted in pulses per second: <b>MHz</b> (millions) and <b>GHz</b> (1000 MHz). More pulses per second = a faster CPU.</p>' },
      5: { image: false, blocks: [P('Memory is to store data and program instructions for CPU to execute. A memory unit is an ordered sequence of bytes, each holds eight bits. A program and its data must be brought to memory before they can be executed. A memory byte is never empty, but its initial content may be meaningless to your program. The current content of a memory byte is lost whenever new information is placed in it.')],
        explain: '<p><b>Memory</b> is where the CPU finds its work: the program and its data. It is a long row of bytes, and each byte holds 8 bits.</p><p>Two facts to remember: a byte is never empty (it always holds some bits), and when you write new data into a byte, the old data is gone.</p>' },
      6: { blocks: [P('Data of various kinds, such as numbers, characters, and strings, are encoded as a series of bits (zeros and ones). Computers use zeros and ones because digital devices have two stable states, which are referred to as zero and one by convention. The programmers need not to be concerned about the encoding and decoding of data, which is performed automatically by the system based on the encoding scheme. The encoding scheme varies. For example, character ‘J’ is represented by 01001010 in one byte. A small number such as three can be stored in a single byte. If computer needs to store a large number that cannot fit into a single byte, it uses a number of adjacent bytes. No two data can share or split a same byte. A byte is the minimum storage unit.')],
        explain: '<p>Everything in memory is bits: numbers, letters, words. Each kind of data has a code ({{encoding scheme|نظام ترميز}}). For example, ‘J’ is 01001010.</p><p>Each byte has an <b>address</b>. A small number fits in one byte. A big number uses several {{adjacent|متجاورة}} bytes. Two pieces of data never share one byte.</p><p>Good news: the system does the encoding and decoding for you.</p>' },
      7: { image: false, blocks: [P('Memory is volatile, because information is lost when the power is off. Programs and data are permanently stored on storage devices and are moved to memory when the computer actually uses them. There are three main types of storage devices: Disk drives (hard disks and floppy disks), CD drives (CD-R and CD-RW), and Tape drives.')],
        explain: '<p><b>{{Volatile|متطاير / يُمسح}}</b> means: when the power goes off, memory forgets everything. So programs and data are kept {{permanently|بشكل دائم}} on storage devices (disks, CDs, tapes). When you use a program, it is copied from the disk into memory.</p>' },
      8: { image: false, blocks: [P('The monitor displays information (text and graphics). The resolution and dot pitch determine the quality of the display.')],
        explain: '<p>The <b>monitor</b> is an output device: it shows text and pictures. Two things decide how good the picture looks: the <b>resolution</b> and the <b>dot pitch</b> (next slide).</p>' },
      9: { image: false, blocks: [{ type: 'paragraph', html: '<i>resolution</i>: The <i>screen resolution</i> specifies the number of pixels in horizontal and vertical dimensions of the display device. <i>Pixels</i> (short for “picture elements”) are tiny dots that form an image on the screen. A common resolution for a 17-inch screen, for example, is 1,024 pixels wide and 768 pixels high. The resolution can be set manually. The higher the resolution, the sharper and clearer the image is.' }, { type: 'paragraph', html: '<i>dot pitch</i>: The <i>dot pitch</i> is the amount of space between pixels, measured in millimeters. The smaller the dot pitch, the sharper the display.' }],
        explain: '<p>A screen picture is made of tiny dots called <b>pixels</b>.</p><ul><li><b>Resolution</b> = how many pixels across and down, like 1,024 x 768. More pixels = sharper.</li><li><b>Dot pitch</b> = the space between pixels. Smaller space = sharper.</li></ul><p>Use the drawing to compare a low and a high resolution.</p>' },
      10: { image: false, blocks: [P('A regular modem uses a phone line and can transfer data in a speed up to 56,000 bps (bits per second). A DSL (digital subscriber line) also uses a phone line and can transfer data in a speed 20 times faster than a regular modem. A cable modem uses the TV cable line maintained by the cable company. A cable modem is as fast as a DSL. Network interface card (NIC) is a device to connect a computer to a local area network (LAN). The LAN is commonly used in business, universities, and government organizations. A typical type of NIC, called 10BaseT, can transfer data at 10 mbps (million bits per second).')],
        explain: '<p><b>Communication devices</b> connect a computer to other computers. Speed is measured in <b>bps</b> (bits per second).</p><ul><li>Regular modem: up to 56,000 bps, on a phone line.</li><li>DSL: 20 times faster, also on a phone line. A cable modem is as fast as DSL.</li><li>NIC: connects to a local network (LAN), for example 10 mbps.</li></ul>' },
      11: { text: false, explain: '<p>A closer look at the computer. The <b>CPU</b> has three parts:</p><ul><li>the <b>control unit</b>: it directs the work of the other parts,</li><li>the <b>ALU</b> (arithmetic logic unit): it does the calculations,</li><li><b>registers</b> (R1 … Rn): very small, very fast places to hold values.</li></ul><p>The bus connects the CPU to main memory, the disk and the I/O (input/output) devices. Press <b>Next step</b> to follow a small addition.</p>' },
      12: { image: false, blocks: [Bu('How do computers represent data?'), Bu('Most computers are digital', 1), Bu('Recognize only two discrete states: on or off', 2), { type: 'bullet', level: 2, html: 'Use <b>a binary system</b> to recognize two states' }, { type: 'bullet', level: 2, html: 'Use number system with two unique digits: 0 and 1, called <b>bits</b> (short for <b>binary digits</b>)' }, Bu('Smallest unit of data computer can process', 2)],
        explain: '<p>A <b>digital</b> computer knows only two states: on and off. So it uses the <b>binary</b> system: only two digits, 0 and 1. Each 0 or 1 is a <b>bit</b> (<b>bi</b>nary digi<b>t</b>), the smallest piece of data.</p>' },
      13: { image: false, blocks: [Bu('It means two-states'), Bu('1 and 0', 1), Bu('true and false', 1), Bu('on and off', 1), { type: 'bullet', html: 'A single “on/off”, “true/false”, “1/0” is called a <i>bit</i>' }, Bu('Example: Toggle switch')],
        explain: '<p>“Binary” means <b>two states</b>. We can name them 1 and 0, true and false, or on and off: it is the same idea. A light switch ({{toggle switch|مفتاح تبديل}}) is a good picture of one bit.</p>' },
      14: { image: false, blocks: [Bu('Computer memory is organized into groups of eight bits'), { type: 'bullet', html: 'Each eight bit group is called a <i>byte</i>' }, { type: 'html', html: tbl(['Name', 'Number of Bytes', 'power of 2'], [['byte', '1', '2<sup>0</sup>'], ['kilobyte', '1024', '2<sup>10</sup>'], ['megabyte', '1,048,576', '2<sup>20</sup>'], ['gigabyte', '1,073,741,824', '2<sup>30</sup>'], ['terabyte', '1,099,511,627,776', '2<sup>40</sup>']]) }],
        explain: '<p>8 bits = 1 <b>byte</b>. Bigger units grow by 1024 (2<sup>10</sup>) each time: a kilobyte is 1024 bytes, a megabyte is 1024 kilobytes, and so on.</p><p>In the drawing, the 8 switches are one byte. Each switch has a value (128, 64 … 1). Try the buttons above the drawing.</p>' },
      15: { title: '', image: false, blocks: [{ type: 'html', html: tbl(['Name', 'Abbr.', 'Size'], [['Kilo', 'K', '2^10 = 1,024'], ['Mega', 'M', '2^20 = 1,048,576'], ['Giga', 'G', '2^30 = 1,073,741,824'], ['Tera', 'T', '2^40 = 1,099,511,627,776'], ['Peta', 'P', '2^50 = 1,125,899,906,842,624'], ['Exa', 'E', '2^60 = 1,152,921,504,606,846,976'], ['Zetta', 'Z', '2^70 = 1,180,591,620,717,411,303,424'], ['Yotta', 'Y', '2^80 = 1,208,925,819,614,629,174,706,176']]) }],
        explain: '<p>The names of big sizes, from Kilo (K) to Yotta (Y). Each step is <b>2<sup>10</sup> = 1,024</b> times bigger than the one before. You do not need to remember the long numbers; remember the order: K, M, G, T, P, E, Z, Y.</p>' },
      16: { image: false, blocks: [Bu('nybble = 4 bits'), Bu('byte = 8 bits'), Bu('(short) word = 2 bytes = 16 bits'), Bu('(double) word = 4 bytes = 32 bits'), Bu('(long) word = 8 bytes = 64 bits'), Bu('1K (kilo or “kibi”) = 1,024'), Bu('1M (mega or “mebi”) = (1K)*(1K) = 1,048,576'), Bu('1G (giga or “gibi”) = (1K)*(1M) = 1,073,741,824')],
        explain: '<p>More names for groups of bits: half a byte is a <b>nybble</b> (4 bits). A <b>word</b> is 2, 4 or 8 bytes. Note that 1M = 1K x 1K and 1G = 1K x 1M.</p>' },
      17: { image: false, blocks: [{ type: 'bullet', html: 'A voltage below the <i>threshold</i>' }, Bu('off', 1), { type: 'bullet', html: 'A voltage above the <i>threshold</i>' }, Bu('on', 1)],
        explain: '<p>How does a wire carry a bit? With voltage (electric power). There is a {{threshold|حد فاصل}} level. Below it means off (0). Above it means on (1).</p>' },
      18: { image: false, blocks: [P('Base – 2 (binary numbers)'), Bu('0 1', 1), P('Base – 8 (octal numbers)'), Bu('0 1 2 3 4 5 6 7', 1), P('Base – 16 (hexadecimal numbers)'), Bu('0 1 2 3 4 5 6 7 8 9 A B C D E F', 1)],
        explain: '<p>A <b>radix</b> (base) tells you how many digits a number system has. We usually use base 10. Computers use base 2. Programmers also use base 8 and base 16 because they are short ways to write binary.</p><p>In base 16, the letters A to F are the digits 10 to 15. Type a number in the drawing and see it in each base.</p>' },
      19: { image: false, blocks: [Bu('The same as for decimal numbers'), { type: 'code', lang: 'none', text: '  11001011        11001011\n+ 10011101      - 10011101\n ---------       ---------\n 101101000        00101110' }],
        explain: '<p>You add and subtract binary numbers <b>the same way</b> as decimal numbers: column by column, from the right.</p><ul><li>Addition: 1 + 1 = 10 in binary, so write 0 and <b>carry</b> 1.</li><li>Subtraction: 0 − 1 is not possible, so <b>borrow</b> from the next column.</li></ul><p>The drawing does it one column at a time. Check: 203 + 157 = 360 and 203 − 157 = 46.</p>' },
      20: { title: 'Conversion From one radix to another', blocks: [Bu('From decimal to binary')],
        explain: '<p>To change a decimal number into binary:</p><ol><li>Divide by 2. Write the remainder (0 or 1).</li><li>Divide the quotient by 2 again. Repeat until the quotient is 0.</li><li>Read the remainders from the <b>bottom to the top</b>.</li></ol><p>The slide does it for 1492 = 10111010100. Try a small number like 13 first.</p>' },
      21: { blocks: [Bu('How is a letter converted to binary form and back?'), P('Step 1. The user presses the capital letter D (shift+D key) on the keyboard.'), P('Step 2. An electronic signal for the capital letter D is sent to the system unit.'), P('Step 3. The signal for the capital letter D is converted to its ASCII binary code (01000100) and is stored in memory for processing.'), P('Step 4. After processing, the binary code for the capital letter D is converted to an image, and displayed on the output device.')],
        explain: '<p>Four steps for one key press. The letter travels as a signal, becomes a binary code (<b>ASCII</b> is a list of codes for characters), is stored in memory, and at the end it is turned into a picture of the letter on the screen.</p>' },
      22: { image: false, explain: '<p><b>Software</b> = programs = instructions for the computer. Without programs, a computer is an empty machine. Computers do not understand human languages, so we write programs in <b>programming languages</b>.</p>' },
      23: { image: false, blocks: [H('Machine Language &nbsp;·&nbsp; Assembly Language &nbsp;·&nbsp; High-Level Language'), P('Machine language is a set of primitive instructions built into every computer. The instructions are in the form of binary code, so you have to enter binary codes for various instructions. Program with native machine language is a tedious process. Moreover the programs are highly difficult to read and modify. For example, to add two numbers, you might write an instruction in binary like this:'), { type: 'code', lang: 'none', text: '1101101010011010' }],
        explain: '<p><b>Machine language</b> is the only language the CPU understands directly. It is pure binary. Writing it is {{tedious|ممل ومتعب}}, and reading or changing it is very hard.</p>' },
      24: { image: false, blocks: [H('Machine Language &nbsp;·&nbsp; Assembly Language &nbsp;·&nbsp; High-Level Language'), P('Assembly languages were developed to make programming easy. Since the computer cannot understand assembly language, however, a program called assembler is used to convert assembly language programs into machine code. For example, to add two numbers, you might write an instruction in assembly code like this:'), { type: 'code', lang: 'none', text: 'ADDF3 R1, R2, R3' }],
        explain: '<p><b>Assembly language</b> uses short words (like ADDF3) instead of binary. It is easier, but the computer still cannot run it. An <b>assembler</b> converts it into machine code.</p>' },
      25: { image: false, blocks: [H('Machine Language &nbsp;·&nbsp; Assembly Language &nbsp;·&nbsp; High-Level Language'), P('The high-level languages are English-like and easy to learn and program. For example, the following is a high-level language statement that computes the area of a circle with radius 5:'), { type: 'code', text: 'area = 5 * 5 * 3.1415;' }],
        explain: '<p><b>High-level languages</b> look like English and math, so they are easy to learn. Java is one of them. This one line does a job that needs many machine instructions.</p>' },
      26: { image: false, blocks: [{ type: 'html', html: tbl(['Language', 'Description'], [['Ada', 'Named for Ada Lovelace, who worked on mechanical general-purpose computers. The Ada language was developed for the Department of Defense and is used mainly in defense projects.'], ['BASIC', 'Beginner’s All-purpose Symbolic Instruction Code. It was designed to be learned and used easily by beginners.'], ['C', 'Developed at Bell Laboratories. C combines the power of an assembly language with the ease of use and portability of a high-level language.'], ['C++', 'C++ is an object-oriented language, based on C.'], ['C#', 'Pronounced “C Sharp.” It is a hybrid of Java and C++ and was developed by Microsoft.'], ['COBOL', 'COmmon Business Oriented Language. Used for business applications.'], ['FORTRAN', 'FORmula TRANslation. Popular for scientific and mathematical applications.'], ['Java', 'Developed by Sun Microsystems, now part of Oracle. It is widely used for developing platform-independent Internet applications.'], ['Pascal', 'Named for Blaise Pascal, who pioneered calculating machines in the seventeenth century. It is a simple, structured, general-purpose language primarily for teaching programming.'], ['Python', 'A simple general-purpose scripting language good for writing short programs.'], ['Visual Basic', 'Visual Basic was developed by Microsoft and it enables the programmers to rapidly develop graphical user interfaces.']]) }],
        explain: '<p>Many high-level languages exist. Each was made for a kind of job: business (COBOL), science (FORTRAN), beginners (BASIC), and so on. <b>Java</b> is used for programs that run on many platforms ({{platform-independent|لا يعتمد على نوع الجهاز}}), especially on the Internet.</p>' },
      27: { image: false, explain: '<p>A program in a high-level language is called <b>source code</b>. The computer cannot run source code, so it must be translated into machine code first. Two kinds of tools can do it: an <b>interpreter</b> or a <b>compiler</b>.</p>' },
      28: { explain: '<p>An <b>interpreter</b> works like a live translator: it reads one statement, translates it, runs it at once, then goes to the next statement. One statement may become several machine instructions.</p>' },
      29: { explain: '<p>A <b>compiler</b> works like a book translator: it translates the <b>whole</b> program first and saves the result in a machine-code file. Then that file is run.</p>' },
      30: { explain: '<p>The <b>operating system (OS)</b> is the program that manages the whole computer. Application programs (a Web browser, a word processor) work on top of it and need it: without an OS, they cannot run.</p>' },
      31: { image: false, explain: '<p>Why learn Java? It is a <b>general purpose</b> language (good for many kinds of programs) and the language of the Internet: you can use it for servers, desktop computers and small hand-held devices.</p>' },
      32: { image: false, explain: '<p>Four places where Java programs run: on their own (standalone), from a browser, on hand-held devices, and on Web servers.</p>' },
      33: { image: false, blocks: [Bu('James Gosling and Sun Microsystems'), Bu('Oak'), Bu('Java, May 20, 1995, Sun World'), Bu('HotJava'), Bu('The first Java-enabled Web browser', 1), Bu('Early History Website:'), P('http://www.java.com/en/javahistory/index.jsp')],
        explain: '<p>Java was made by <b>James Gosling</b> at Sun Microsystems. Its first name was <b>Oak</b>. It was renamed Java and shown on May 20, 1995. <b>HotJava</b> was the first Web browser that could run Java.</p>' },
      34: { image: false, blocks: [Bu('Java Is Simple'), Bu('Java Is Object-Oriented'), Bu('Java Is Distributed'), Bu('Java Is Interpreted'), Bu('Java Is Robust'), Bu('Java Is Secure'), Bu('Java Is Architecture-Neutral'), Bu('Java Is Portable'), Bu('Java\'s Performance'), Bu('Java Is Multithreaded'), Bu('Java Is Dynamic'), P('www.cs.armstrong.edu/liang/JavaCharacteristics.pdf')],
        explain: '<p>Eleven characteristics ({{characteristics|خصائص}}) of Java. The next eleven slides explain them one at a time. The drawing follows along.</p>' },
      35: trait('Simple', ['Java is partially modeled on C++, but greatly simplified and improved. Some people refer to Java as "C++--" because it is like C++ but with more functionality and fewer negative aspects.'], '<p>Java took good ideas from C++ and removed many hard parts. That is the joke in the name “C++--”.</p>'),
      36: trait('Object-Oriented', ['Java is inherently object-oriented. Although many object-oriented languages began strictly as procedural languages, Java was designed from the start to be object-oriented. Object-oriented programming (OOP) is a popular programming approach that is replacing traditional procedural programming techniques.', 'One of the central issues in software development is how to reuse code. Object-oriented programming provides great flexibility, modularity, clarity, and reusability through encapsulation, inheritance, and polymorphism.'], '<p><b>Object-oriented programming (OOP)</b> builds programs from objects. Its big gift is <b>reuse</b>: you can use the same code again. You will study OOP in CS2; for now, just remember the name.</p>'),
      37: trait('Distributed', ['Distributed computing involves several computers working together on a network. Java is designed to make distributed computing easy. Since networking capability is inherently integrated into Java, writing network programs is like sending and receiving data to and from a file.'], '<p><b>Distributed</b> = many computers work together over a network. Java has networking built in, so sending data over a network is as easy as writing to a file.</p>'),
      38: trait('Interpreted', ['You need an interpreter to run Java programs. The programs are compiled into the Java Virtual Machine code called bytecode. The bytecode is machine-independent and can run on any machine that has a Java interpreter, which is part of the Java Virtual Machine (JVM).'], '<p>Java uses <b>both</b> tools: a compiler turns your code into <b>bytecode</b>, and then the <b>JVM</b> (Java Virtual Machine) interprets the bytecode. Bytecode is not tied to one kind of machine.</p>'),
      39: trait('Robust', ['Java compilers can detect many problems that would first show up at execution time in other languages.', 'Java has eliminated certain types of error-prone programming constructs found in other languages.', 'Java has a runtime exception-handling feature to provide programming support for robustness.'], '<p><b>{{Robust|متين وموثوق}}</b> = strong and reliable. The compiler catches many mistakes before the program runs, risky features were removed, and Java can handle errors (exceptions) while the program runs.</p>'),
      40: trait('Secure', ['Java implements several security mechanisms to protect your system against harm caused by stray programs.'], '<p><b>Secure</b>: Java has protections so that a bad or wrong ({{stray|شارد / غير موثوق}}) program cannot harm your computer.</p>'),
      41: trait('Architecture-Neutral', ['Write once, run anywhere', 'With a Java Virtual Machine (JVM), you can write one program that will run on any platform.'], '<p><b>Architecture-neutral</b> = not tied to one kind of computer. Write the program <b>once</b>; it runs on any platform that has a JVM: Windows, Mac, Linux …</p>'),
      42: trait('Portable', ['Because Java is architecture neutral, Java programs are portable. They can be run on any platform without being recompiled.'], '<p><b>{{Portable|قابل للنقل}}</b>: you can move a Java program to another platform and run it, without compiling it again.</p>'),
      43: { title: 'Characteristics of Java', image: false, blocks: [H('<b>Java\'s Performance</b>'), P('Java’s performance Because Java is architecture neutral, Java programs are portable. They can be run on any platform without being recompiled.')],
        explain: '<p>This slide repeats the portability sentence for “performance”. The point to keep: architecture-neutral bytecode runs on any platform without recompiling.</p>' },
      44: trait('Multithreaded', ['Multithread programming is smoothly integrated in Java, whereas in other languages you have to call procedures specific to the operating system to enable multithreading.'], '<p><b>Multithreaded</b>: a program can do several tasks at the same time (each task is a thread). In Java this is built in; in other languages you need special help from the operating system.</p>'),
      45: trait('Dynamic', ['Java was designed to adapt to an evolving environment. New code can be loaded on the fly without recompilation. There is no need for developers to create, and for users to install, major new software versions. New features can be incorporated transparently as needed.'], '<p><b>Dynamic</b>: Java can load new code while the program is running ({{on the fly|أثناء التشغيل}}). So new features can be added without a big new version of the software.</p>'),
      46: { image: false, explain: '<p>The versions of the <b>JDK</b> (Java Development Kit: the tools to build Java programs). JDK 1.5 and later are also called Java 5, Java 6, Java 7, Java 8.</p>' },
      47: { image: false, blocks: [Bu('Java Standard Edition (J2SE)'), Bu('J2SE can be used to develop client-side standalone applications or applets.', 1), Bu('Java Enterprise Edition (J2EE)'), Bu('J2EE can be used to develop server-side applications such as Java servlets, Java ServerPages, and Java ServerFaces.', 1), Bu('Java Micro Edition (J2ME).'), Bu('J2ME can be used to develop applications for mobile devices such as cell phones.', 1), P('This book uses J2SE to introduce Java programming.')],
        explain: '<p>Three editions for three kinds of programs: <b>J2SE</b> (standard, for normal applications), <b>J2EE</b> (enterprise, for servers) and <b>J2ME</b> (micro, for mobile devices). This course uses J2SE.</p>' },
      48: { image: false, explain: '<p>An <b>IDE</b> (integrated development environment) is a program where you write, compile and run your code in one place. NetBeans, Eclipse and IntelliJ IDEA are popular for Java.</p>' },
      49: { image: false, blocks: [P('Listing 1.1'), { type: 'code', text: WELCOME_NL }],
        explain: '<p>Your first full Java program. It prints one line: <b>Welcome to Java!</b></p><p>Do not try to understand every word yet. The next slides explain each part. In the drawing, the boxes show how the parts sit inside each other.</p>' },
      50: { image: false, explain: '<p>Seven parts of a Java program. You will see each one highlighted in the drawing on the next slides.</p>' },
      51: { image: false, explain: '<p>Every Java program has at least one <b>class</b>. The class has a name. Here it is <b>Welcome</b>. By convention, a class name starts with an uppercase letter.</p>' },
      52: { image: false, explain: '<p>The <b>main method</b> is the starting point. When you run a class, Java looks for <code>main</code> and runs what is inside it. (Line 2 here means the line after the comment.)</p>' },
      53: { image: false, explain: '<p>A <b>statement</b> is one action. <code>System.out.println("Welcome to Java!")</code> shows the text on the screen and then moves to a new line.</p>' },
      54: { image: false, blocks: [P('Every statement in Java ends with a semicolon (;).'), { type: 'code', text: WELCOME }],
        explain: '<p>The <b>semicolon</b> <code>;</code> is like the full stop at the end of an English sentence. Forget it, and the compiler gives an error.</p>' },
      55: { image: false, explain: '<p><b>Reserved words</b> (keywords) belong to Java. They have a fixed meaning, so you cannot use them as names. In this program: <code>public</code>, <code>class</code>, <code>static</code>, <code>void</code>.</p>' },
      56: { blocks: [P('A pair of braces in a program forms a block that groups components of a program.')], explain: '<p>A pair of braces <code>{ }</code> makes a <b>block</b>. The <b>class block</b> holds everything in the class. Inside it, the <b>method block</b> holds the statements of main. Each { needs its own }.</p>' },
      57: { image: false, blocks: [{ type: 'html', html: tbl(['Character', 'Name', 'Description'], [['<code>{}</code>', 'Opening and closing braces', 'Denotes a block to enclose statements.'], ['<code>()</code>', 'Opening and closing parentheses', 'Used with methods.'], ['<code>[]</code>', 'Opening and closing brackets', 'Denotes an array.'], ['<code>//</code>', 'Double slashes', 'Precedes a comment line.'], ['<code>" "</code>', 'Opening and closing quotation marks', 'Enclosing a string (i.e., sequence of characters).'], ['<code>;</code>', 'Semicolon', 'Marks the end of a statement.']]) }],
        explain: '<p>Six special symbols and their jobs. Learn their names: braces, parentheses, brackets, double slashes, quotation marks and semicolon. The next five slides point at each one in the program.</p>' },
      58: { title: '{ … }', image: false, blocks: [{ type: 'code', text: WELCOME }], explain: '<p>Find the braces: <code>{</code> opens a block and <code>}</code> closes it. This program has two blocks, so it has two pairs.</p>' },
      59: { title: '( … )', image: false, blocks: [{ type: 'code', text: WELCOME }], explain: '<p>Parentheses come with methods: <code>main(String[] args)</code> and <code>println("…")</code>. The brackets <code>[]</code> in <code>String[]</code> mean an array (a later unit).</p>' },
      60: { title: ';', image: false, blocks: [{ type: 'code', text: WELCOME }], explain: '<p>The semicolon at the end of the println line ends that statement.</p>' },
      61: { title: '// …', image: false, blocks: [{ type: 'code', text: WELCOME }], explain: '<p>The first line starts with <code>//</code>, so it is a <b>comment</b>. Java ignores it. It is a note for people who read the code.</p>' },
      62: { title: '" … "', image: false, blocks: [{ type: 'code', text: WELCOME }], explain: '<p>The quotation marks hold a <b>string</b>: a sequence of characters. Everything between them is printed exactly as it is.</p>' },
      63: { title: 'Programming Style and Documentation', image: false, blocks: [Bu('Appropriate Comments'), Bu('Naming Conventions'), Bu('Proper Indentation and Spacing Lines'), Bu('Block Styles')],
        explain: '<p>Code is read by people too, not only by the computer. Good <b>style</b> and documentation make code easy to read and to fix. Four habits follow.</p>' },
      64: { image: false, explain: '<p>Start every program with a comment that explains what it does. Also write your name, class section, instructor, the date and a short description.</p>' },
      65: { image: false, blocks: [Bu('Choose meaningful and descriptive names.'), Bu('Class names:'), { type: 'bullet', level: 1, html: 'Capitalize the first letter of each word in the name. For example, the class name <code>ComputeExpression</code>.' }],
        explain: '<p>Names should tell what something is. For class names, write each word with a capital first letter and no spaces: <code>ComputeExpression</code>, <code>Welcome</code>, <code>ShowLogicErrors</code>.</p>' },
      66: { image: false, explain: '<p><b>{{Indentation|إزاحة السطر للداخل}}</b>: push the lines inside a block two spaces to the right, so you can see which lines belong together. Use empty lines to separate groups of code.</p>' },
      67: { explain: '<p>Where do you put <code>{</code>? <b>Next-line style</b> puts it alone on the next line. <b>End-of-line style</b> puts it at the end of the line. Both work, but the slide says: use the end-of-line style.</p>' },
      68: { image: false, explain: '<p>Three kinds of errors:</p><ul><li><b>Syntax errors</b>: the code breaks the rules of Java. The compiler finds them.</li><li><b>Runtime errors</b>: the program stops ({{aborts|يتوقف فجأة}}) while it runs.</li><li><b>Logic errors</b>: the program runs, but the result is wrong.</li></ul>' },
      69: { image: false, explain: '<p>Two syntax errors: <code>void</code> is missing before <code>main</code>, and the string <code>"Welcome to Java</code> has no closing quotation mark. The compiler shows these errors, and no program is made until you fix them.</p>' },
      70: { image: false, explain: '<p>This program compiles. But when it runs, it tries <code>1 / 0</code>: dividing by zero is not possible, so the program aborts.</p>' },
      71: { image: false, explain: '<p>This program runs without any error message, but the answer is wrong: it prints 67, but 35 °C is 95 °F. The reason: <code>9 / 5</code> with whole numbers gives 1, not 1.8 (you will learn this rule in the next unit). The computer did exactly what we wrote; our logic was wrong.</p>' },
      72: { text: false, explain: '<p>The full cycle of a Java program:</p><ol><li>Write the source code and save it (Welcome.java).</li><li>Compile it: <code>javac Welcome.java</code>. If there are compile errors, fix them and compile again.</li><li>The compiler saves the bytecode (Welcome.class).</li><li>Run it: <code>java Welcome</code>. If the result is wrong, go back to step 1.</li></ol>' },
      73: { title: 'Compiling Java Source Code', blocks: [{ type: 'paragraph', html: 'You can port a source program to any machine with appropriate compilers. The source program must be recompiled, however, because the object program can only run on a specific machine. Nowadays computers are networked to work together. Java was designed to run object programs on any platform. With Java, you write the program once, and compile the source program into a special type of object code, known as <i>bytecode</i>. The bytecode can then run on any computer with a Java Virtual Machine, as shown below. Java Virtual Machine is a software that interprets Java bytecode.' }],
        explain: '<p>With most languages, the compiled program runs only on one kind of machine, so you must recompile for each machine. Java is different: it compiles to <b>bytecode</b>, and the bytecode runs on <b>any</b> computer with a <b>JVM</b>. Write once, run anywhere.</p>' }
    },
    visuals: [computer, stored, devices, cpu, bitsViz, radix, binops, tobin, letter, langs, translate, os, traits, anatomy, style, errors, run],
    exam: {
      questions: [
        { q: 'Where does the CPU take its instructions from?', options: ['The printer', 'The monitor', 'Memory'], answer: 2, review: 4, why: 'The CPU retrieves instructions from memory and executes them.' },
        { type: 'tf', q: 'Programs and data are stored permanently in memory.', answer: false, review: 7, why: 'Memory is volatile. Programs and data are stored permanently on storage devices.' },
        { type: 'fill', lang: 'none', q: 'Convert from binary to decimal.', code: '101 (base 2) = ___ (base 10)', answer: ['5'], review: 18, why: '4 + 0 + 1 = 5.' },
        { type: 'fill', lang: 'none', q: 'Convert from decimal to binary.', code: '6 (base 10) = ___ (base 2)', answer: ['110'], review: 20, why: '6 ÷ 2 = 3 r 0, 3 ÷ 2 = 1 r 1, 1 ÷ 2 = 0 r 1. Read up: 110.' },
        { q: 'How many bytes are in a (double) word?', options: ['2', '4', '8'], answer: 1, review: 16, why: 'Slide 16: (double) word = 4 bytes = 32 bits.' },
        { q: 'What is stored in memory when you press the capital letter D?', options: ['Nothing', 'A picture of the letter D', 'Its ASCII binary code, 01000100'], answer: 2, review: 21, why: 'Step 3 of slide 21.' },
        { q: 'Which kind of language is English-like and easy to learn?', options: ['High-level language', 'Assembly language', 'Machine language'], answer: 0, review: 25, why: 'Slide 25.' },
        { q: 'Which tool translates the <b>entire</b> source code before it runs?', options: ['An interpreter', 'A compiler'], answer: 1, review: 29, why: 'An interpreter works one statement at a time (slide 28).' },
        { q: 'Java bytecode can run on any computer that has …', options: ['the source code of the program', 'the same operating system as the programmer', 'a Java Virtual Machine (JVM)'], answer: 2, review: 73, why: 'Slide 73.' },
        { q: '“Java is dynamic” means …', options: ['new code can be loaded on the fly, without recompiling', 'Java programs never change', 'Java needs a new version every day'], answer: 0, review: 45, why: 'Slide 45.' },
        { type: 'output', q: 'What does this statement print?', code: 'System.out.println("Java is fun");', answer: 'Java is fun', review: 53, why: 'println prints the string between the quotation marks.' },
        { type: 'fill', q: 'Complete the line that starts every Java program.', code: 'public static void ___(String[] args) {', answer: ['main'], review: 52, why: 'The program is executed from the main method.' },
        { q: 'Which group has only <b>reserved words</b>?', options: ['Welcome, main, args', 'public, class, static, void', 'System, out, println'], answer: 1, review: 55, why: 'Reserved words have a specific meaning to the compiler.' },
        { q: 'What kind of error is in this line?', code: 'System.out.println("Hello);', options: ['Logic error', 'Runtime error', 'Syntax error'], answer: 2, review: 69, why: 'The string has no closing quotation mark: the compiler finds it.' },
        { q: 'Which block style do the slides tell you to use?', options: ['End-of-line style', 'Next-line style'], answer: 0, review: 67, why: 'Slide 67.' },
        { type: 'order', lang: 'text', q: 'Put these in the right order.', lines: ['Write Welcome.java', 'javac Welcome.java', 'Welcome.class is made', 'java Welcome', 'Welcome to Java! is displayed'], review: 72, why: 'Source code → compile → bytecode → run → result.' },
        { type: 'write', q: 'Write two statements that print Hello on one line and World on the next line.', rows: 2, checks: [{ re: /System\s*\.\s*out\s*\.\s*println\s*\(\s*"Hello"\s*\)\s*;/, label: 'System.out.println("Hello");' }, { re: /System\s*\.\s*out\s*\.\s*println\s*\(\s*"World"\s*\)\s*;/, label: 'System.out.println("World");' }], solution: 'System.out.println("Hello");\nSystem.out.println("World");', review: 53, why: 'println ends the line, so the next print starts on a new line.' },
        { type: 'trace', lang: 'none', q: 'Change each decimal number into binary.', cols: ['decimal', 'binary'], rows: [['13', '?1101'], ['6', '?110'], ['32', '?100000']], review: 20, why: '13 = 8 + 4 + 1, 6 = 4 + 2, 32 = 2 to the power 5.' },
        { type: 'bug', q: 'This program does not compile. Tap the wrong line.', code: 'public class Test {\n  public static void main(String[] args) {\n    system.out.println("Hi");\n  }\n}', answer: 3, review: 69, why: 'Java is case-sensitive: it must be System with a capital S.' },
        { type: 'match', q: 'Match each command with what it does.', pairs: [['javac Welcome.java', 'Compiles the source code into bytecode'], ['java Welcome', 'Runs the bytecode on the JVM']], review: 72, why: 'First compile, then run.' },
        { type: 'fill', q: 'Two special symbols are missing. Complete the program.', code: 'public class Test ___\n  public static void main(String[] args) {\n    System.out.println("Hi")___\n  }\n}', answer: ['{', ';'], review: 57, why: 'A class block starts with {; every statement ends with ;.' },
        { type: 'order', q: 'Put the lines of the program in order.', lines: ['public class Welcome {', '  public static void main(String[] args) {', '    System.out.println("Welcome!");', '  }', '}'], review: 50, why: 'The class block holds the main method block, which holds the statement.' }
      ],
      tasks: [
        {
          title: 'Your own first program',
          task: '<p>Write a complete Java program like Listing 1.1 (slide 49):</p><ul><li>Start with a comment that says what the program does.</li><li>The class is named <b>Hello</b>.</li><li>It prints <code>Hello, Java!</code></li></ul><p>Use the end-of-line block style.</p>',
          starter: '// \n',
          output: 'Hello, Java!',
          checks: [
            { re: /^\s*\/\/\s*\S+/m, raw: true, label: 'Starts with a comment that explains the program', review: 64 },
            { re: /public\s+class\s+Hello\b/, label: 'Has a class named <code>Hello</code>', review: 51 },
            { re: /public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]\s*\w+\s*\)/, label: 'Has the main method: <code>public static void main(String[] args)</code>', review: 52 },
            { re: /System\.out\.println\s*\(\s*"Hello, Java!"\s*\)/, label: 'Prints <code>"Hello, Java!"</code> with System.out.println', review: 53 },
            { re: /System\.out\.println\s*\([^;]*\)\s*;/, label: 'The statement ends with a semicolon', review: 54 },
            { fn: bothBraceClass, label: 'Every { has a matching } (a class block and a method block)', review: 56 }
          ],
          solution: '// This program prints Hello, Java!\npublic class Hello {\n  public static void main(String[] args) {\n    System.out.println("Hello, Java!");\n  }\n}'
        },
        {
          title: 'Fix the syntax errors',
          task: '<p>This is the program from slide 69. It has <b>two syntax errors</b>, so it does not compile. Fix them. Do not change anything else.</p>',
          starter: 'public class ShowSyntaxErrors {\n  public static main(String[] args) {\n    System.out.println("Welcome to Java);\n  }\n}',
          output: 'Welcome to Java',
          checks: [
            { re: /public\s+class\s+ShowSyntaxErrors\s*\{/, label: 'The class is still <code>ShowSyntaxErrors</code>', review: 51 },
            { re: /public\s+static\s+void\s+main\s*\(/, label: 'The main method has <code>void</code>', review: 69 },
            { re: /println\s*\(\s*"Welcome to Java"\s*\)\s*;/, label: 'The string has its closing quotation mark: <code>"Welcome to Java"</code>', review: 62 },
            { fn: bothBraceClass, label: 'The braces still match', review: 58 }
          ],
          solution: 'public class ShowSyntaxErrors {\n  public static void main(String[] args) {\n    System.out.println("Welcome to Java");\n  }\n}'
        },
        {
          title: 'Change the block style',
          task: '<p>This program uses the <b>next-line</b> style. Rewrite it in the <b>end-of-line</b> style (slide 67): put each <code>{</code> at the end of the line before it. Keep the indentation of two spaces.</p>',
          starter: 'public class Test\n{\n  public static void main(String[] args)\n  {\n    System.out.println("Block Styles");\n  }\n}',
          output: 'Block Styles',
          checks: [
            { re: /public\s+class\s+Test[ \t]*\{/, label: '<code>{</code> is at the end of the class line', review: 67 },
            { re: /main\s*\(\s*String\s*\[\s*\]\s*args\s*\)[ \t]*\{/, label: '<code>{</code> is at the end of the main line', review: 67 },
            { fn: function (c) { return !/^\s*\{\s*$/m.test(c); }, label: 'No line has only a <code>{</code> on it', review: 67 },
            { re: /System\.out\.println\s*\(\s*"Block Styles"\s*\)\s*;/, label: 'The statement is the same', review: 53 },
            { fn: function (c) { return /\n  [^ \n]/.test(c) && /\n    System/.test(c); }, raw: true, label: 'The lines are indented two spaces per block', review: 66 }
          ],
          solution: 'public class Test {\n  public static void main(String[] args) {\n    System.out.println("Block Styles");\n  }\n}'
        }
      ]
    }
  });
})();
