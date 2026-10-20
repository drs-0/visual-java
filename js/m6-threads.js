addModule({
  id: 'm6',
  title: 'Threads',
  blurb: 'Do more than one thing at the same time with threads.',
  lessons: [
    /* ------------------------------------------------------------ */
    {
      id: 'm6-1',
      title: 'What is a thread?',
      body: `
<p>A <b>thread</b> is a path of {{execution|تنفيذ}}: a line of work that the program follows, step by step.</p>
<p>Every Java program starts with one thread: the <b>main thread</b>. But a program can have many threads that run <b>at the same time</b>. This is called {{multitasking|تعدد المهام}}.</p>
<p>Example: a game can play music in one thread, move the characters in another thread, and read the keyboard in a third one.</p>
<h3>Way 1: extend the Thread class</h3>
<ol>
<li>Make a class that <code>extends Thread</code>.</li>
<li>Override the method <code>run()</code>. Put the work of the thread inside it.</li>
<li>Create an object and call <code>start()</code>.</li>
</ol>
~~~
class Loader extends Thread {
    public void run() {
        System.out.println("Loading...");
    }
}

Loader t = new Loader();
t.start();
~~~
<div class="warn">Call <code>start()</code>, not <code>run()</code>! <code>start()</code> creates a new thread, and that thread calls <code>run()</code>. If you call <code>run()</code> directly, it is a normal method call in the main thread. No new thread.</div>
<div class="tip">When two threads run at the same time, the <b>order of the output can change</b> from one run to the next. The computer decides when each thread gets time.</div>`,
      code: `class Loader extends Thread {
    public void run() {
        System.out.println("Loading...");
    }
}
// in main:
Loader t = new Loader();
t.start();
System.out.println("Main keeps going");`,
      steps: [
        { cap: 'Every program starts with one thread: the <b>main thread</b>. It creates a Loader object.', line: 7 },
        { cap: '<code>t.start()</code> creates a <b>new thread</b>. Now there are two paths.', line: 8 },
        { cap: 'Both threads work at the same time. Main prints its line; the Loader thread runs <code>run()</code>.', line: [9, 3], out: ['Main keeps going', 'Loading...'] },
        { cap: 'The order of the two lines can change each time you run the program!', line: [3, 9] },
        { cap: 'Don\'t call <code>t.run()</code> yourself: it runs in the main thread, and no new thread is made.' }
      ],
      draw: function (k) {
        return [
          T('ml', 20, 95, 'main thread', { bold: true, size: 13 }),
          A('mlane', 120, 90, 548, 90, { tone: 'muted', z: 0 }),
          B('b1', 130, 72, 110, 36, { title: 'new Loader()', mono: true, size: 12, tone: 'blue', hi: k === 0 }),
          k >= 1 && B('b2', 255, 72, 95, 36, { title: 't.start()', mono: true, size: 12, tone: 'accent', fill: 'solid' }),
          k >= 2 && B('b3', 365, 72, 175, 36, { title: 'print "Main keeps going"', mono: true, size: 11, tone: 'blue', hi: k === 2 || k === 3 }),
          k >= 1 && T('ll', 20, 215, 'Loader thread', { bold: true, size: 13, tone: 'teal' }),
          k >= 1 && A('llane', 300, 210, 548, 210, { tone: 'teal', z: 0 }),
          k >= 1 && A('branch', 302, 110, 312, 205, { tone: 'accent', bend: 30, label: 'new thread', la: 'end', lx: -14 }),
          k >= 2 && B('b4', 335, 192, 190, 36, { title: 'run(): print "Loading..."', mono: true, size: 11, tone: 'teal', hi: k === 2 || k === 3 }),
          k === 3 && A('sw', 452, 112, 430, 188, { tone: 'accent', dash: true, head: false, label: 'which first? it can change', la: 'start', lx: 12 }),
          T('time', 548, 320, 'time  →', { anchor: 'end', tone: 'muted', size: 12 }),
          k === 4 && B('warn', 30, 255, 330, 50, { title: 't.run()  →  no new thread!', mono: true, tone: 'red', dash: true, size: 13 })
        ];
      },
      quiz: [
        { q: 'Which method starts a new thread?', options: ['`run()`', '`start()`', '`main()`'], answer: 1, why: '<code>start()</code> makes the new thread, which then calls <code>run()</code>.' },
        { type: 'fill', q: 'Complete the thread class.', code: 'class Music ___ Thread {\n    public void ___() {\n        System.out.println("Playing");\n    }\n}', answer: ['extends', 'run'], why: 'Extend <code>Thread</code> and override <code>run()</code>.' },
        { q: 'Two threads print one line each. Is the order always the same?', options: ['Yes, always', 'No, it can change'], answer: 1, why: 'The computer decides when each thread runs.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm6-2',
      title: 'The Runnable interface',
      body: `
<p>There is a second way to make a thread, and it is often the better one.</p>
<h3>Way 2: implement Runnable</h3>
<ol>
<li>Make a class that <code>implements Runnable</code>.</li>
<li>Write the method <code>run()</code>.</li>
<li>Give an object of your class to a new <code>Thread</code>, then call <code>start()</code>.</li>
</ol>
~~~
class Task implements Runnable {
    public void run() {
        System.out.println("Task is running");
    }
}

Thread t = new Thread(new Task());
t.start();
~~~
<p>Think of it like this: the <code>Task</code> is a job card. The <code>Thread</code> is a worker. You give the job card to the worker, and say "start".</p>
<h3>Why is Runnable often better?</h3>
<p>A class can extend only <b>one</b> class. If your class extends <code>Thread</code>, it cannot extend anything else. With <code>Runnable</code> (an interface), your class is still free to extend another class.</p>
<div class="tip">You can also write the job very short with a <b>lambda</b>: <code>new Thread(() -&gt; System.out.println("Hi")).start();</code></div>`,
      code: `class Task implements Runnable {
    public void run() {
        System.out.println("Task is running");
    }
}
// in main:
Thread t = new Thread(new Task());
t.start();`,
      steps: [
        { cap: '<code>Task</code> implements Runnable. It is a job card with a <code>run()</code> method.', line: '1-5' },
        { cap: '<code>new Thread(new Task())</code>: we give the job to a new worker (a Thread object).', line: 7 },
        { cap: '<code>t.start()</code>: the worker starts and runs the job in its own thread.', line: [8, 3], out: 'Task is running' },
        { cap: 'Runnable keeps your class free to extend another class. <code>extends Thread</code> does not.' }
      ],
      draw: function (k) {
        var inside = k >= 1;
        return [
          B('thr', 300, 60, 235, 200, { title: 'Thread t', band: true, tone: 'blue', r: 14, z: 0, tag: 'the worker', hi: k === 2, fill: k === 2 ? 'soft' : 'none' }),
          B('task', inside ? 332 : 40, inside ? 135 : 110, 170, boxH(1), { title: 'Task', lines: ['run() { ... }'], tone: 'teal', mono: true, tag: 'implements Runnable', hi: k === 0 }),
          !inside && T('job', 125, 205, 'the job card', { anchor: 'middle', tone: 'muted', size: 12, italic: true }),
          k === 1 && A('give', 212, 140, 328, 160, { tone: 'accent', label: 'new Thread(...)', bend: -10 }),
          k === 2 && T('run', 417, 236, 'running in its own thread', { anchor: 'middle', tone: 'accent', bold: true, size: 12.5 }),
          k === 2 && B('go', 30, 140, 140, 44, { title: 't.start()', mono: true, tone: 'accent', fill: 'solid' }),
          k === 2 && A('goA', 172, 162, 296, 162, { tone: 'accent' }),
          k === 3 && T('w1', 30, 285, 'extends Thread  →  no other parent class', { mono: true, size: 12, tone: 'red', bold: true }),
          k === 3 && T('w2', 30, 315, 'implements Runnable  →  can still extend a class', { mono: true, size: 12, tone: 'teal', bold: true })
        ];
      },
      quiz: [
        { q: 'What do you pass to the <code>Thread</code> constructor?', options: ['A String', 'An object that implements Runnable', 'A number of seconds'], answer: 1, why: 'The Thread runs the <code>run()</code> method of that object.' },
        { type: 'fill', q: 'Start the job in a new thread.', code: 'Thread t = new ___(new Job());\nt.___();', answer: ['Thread', 'start'], why: 'Create a Thread with the job, then call <code>start()</code>.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm6-3',
      title: 'sleep() and join()',
      body: `
<h3>Thread.sleep()</h3>
<p><code>Thread.sleep(ms)</code> {{pauses|يوقّف مؤقتاً}} the current thread for some milliseconds. 1000 milliseconds = 1 second.</p>
~~~
Thread.sleep(1000);   // wait 1 second
~~~
<p><code>sleep()</code> can throw an <code>InterruptedException</code>. It is a <b>checked</b> exception, so you must put it in try/catch (or use <code>throws</code>).</p>
~~~
try {
    Thread.sleep(1000);
} catch (InterruptedException e) { }
~~~
<h3>join()</h3>
<p>Sometimes the main thread must <b>wait</b> until another thread is finished. Use <code>join()</code>:</p>
~~~
Counter c = new Counter();
c.start();
c.join();     // main waits here until c is done
System.out.println("Counter finished");
~~~
<div class="tip">Threads also have a {{priority|أولوية}} from 1 to 10: <code>t.setPriority(Thread.MAX_PRIORITY);</code>. It is only a hint for the computer, not a promise.</div>`,
      code: `class Counter extends Thread {
    public void run() {
        for (int i = 1; i <= 3; i++) {
            System.out.println(i);
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) { }
        }
    }
}`,
      steps: [
        { cap: '<code>i = 1</code>: the thread prints 1.', line: [3, 4], out: '1' },
        { cap: '<code>Thread.sleep(1000)</code>: the thread sleeps for 1 second. It does nothing.', line: 6 },
        { cap: 'It wakes up. <code>i = 2</code>: prints 2.', line: [3, 4], out: '2' },
        { cap: 'Sleep again for 1 second.', line: 6 },
        { cap: '<code>i = 3</code>: prints 3.', line: [3, 4], out: '3' },
        { cap: 'The last sleep. <code>sleep()</code> can throw <code>InterruptedException</code>, so it is inside try/catch.', line: '5-7' }
      ],
      draw: function (k) {
        var X = function (s) { return 60 + s * 140; };
        var now = [110, 200, 250, 340, 390, 480][k];
        var items = [
          T('tl', 60, 100, 'Counter thread', { bold: true, size: 13, tone: 'teal' }),
          A('axis', 50, 270, 530, 270, { tone: 'muted' }),
          T('tm', 530, 300, 'seconds', { anchor: 'end', tone: 'muted', size: 12 })
        ];
        for (var s = 0; s <= 3; s++) {
          items.push(A('tk' + s, X(s), 264, X(s), 276, { head: false, tone: 'muted' }));
          items.push(T('tt' + s, X(s), 294, s + 's', { anchor: 'middle', mono: true, size: 12, tone: 'muted' }));
        }
        for (var i = 1; i <= 3; i++) {
          var x = X(i - 1);
          if (k >= (i - 1) * 2) items.push(B('p' + i, x, 130, 50, 40, { title: String(i), mono: true, size: 16, tone: 'accent', fill: 'solid', tag: i === 1 ? 'print' : undefined }));
          if (k >= (i - 1) * 2 + 1) items.push(B('s' + i, x + 54, 130, 82, 40, { title: 'sleep 1s', mono: true, size: 12, tone: 'muted', dash: true, fill: 'none', hi: k === (i - 1) * 2 + 1 }));
        }
        items.push(P('now', now, 262, 'now', { dir: 'down', len: 22 }));
        return items;
      },
      quiz: [
        { q: 'How long does <code>Thread.sleep(500)</code> wait?', options: ['500 seconds', 'Half a second', '5 seconds'], answer: 1, why: '500 milliseconds = 0.5 seconds.' },
        { q: 'Which method makes the main thread wait until another thread is done?', options: ['`sleep()`', '`join()`', '`stop()`'], answer: 1, why: '<code>join()</code> waits for the thread to finish.' }
      ]
    }
  ],
  challenge: {
    title: 'Hello from a thread',
    task: `
<p>Create a thread with the <code>Runnable</code> interface.</p>
<ol>
<li>Write a class <code>Hello</code> that <code>implements Runnable</code>.</li>
<li>Its <code>run()</code> method prints <code>Hello from thread</code>.</li>
<li>In <code>main</code>, create a <code>Thread</code> with a <code>Hello</code> object and start it.</li>
</ol>`,
    starter: `// class Hello here


public class Main {
    public static void main(String[] args) {
        // create and start the thread
    }
}`,
    checks: [
      { re: /class\s+Hello\s+implements\s+Runnable/, label: '<code>class Hello implements Runnable</code>' },
      { re: /public\s+void\s+run\s*\(\s*\)/, label: 'A method <code>public void run()</code>' },
      { re: /System\.out\.println\s*\(\s*"Hello from thread"\s*\)/, label: 'It prints <code>"Hello from thread"</code>' },
      { re: /new\s+Thread\s*\(\s*(new\s+Hello\s*\(\s*\)|\w+)\s*\)/, label: 'Create <code>new Thread(...)</code> with a Hello object' },
      { re: /\.start\s*\(\s*\)/, label: 'Call <code>start()</code>' }
    ],
    solution: `class Hello implements Runnable {
    public void run() {
        System.out.println("Hello from thread");
    }
}

public class Main {
    public static void main(String[] args) {
        Thread t = new Thread(new Hello());
        t.start();
    }
}`,
    output: 'Hello from thread'
  }
});
