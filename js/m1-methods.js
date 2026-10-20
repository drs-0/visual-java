addModule({
  id: 'm1',
  title: 'Methods',
  blurb: 'Write code one time and use it many times. Send values in, get values back.',
  lessons: [
    /* ------------------------------------------------------------ */
    {
      id: 'm1-1',
      title: 'What is a method?',
      body: `
<p>A <b>method</b> is a group of code lines that has a name. You write the code one time. After that, you can <b>call</b> it (run it) as many times as you want. You just write its name.</p>
<p>Think about a coffee machine. You press the "Espresso" button, and the machine does all the steps for you. You don't do the steps again by hand. A method is like that button.</p>
~~~
static void sayHello() {
    System.out.println("Hello!");
}
~~~
<ul>
<li><code>static</code> lets <code>main</code> call this method directly. You will learn more about it in Module 2.</li>
<li><code>void</code> means the method does not {{return|يرجّع}} (give back) any value.</li>
<li><code>sayHello</code> is the name of the method.</li>
<li><code>( )</code> is the place for parameters. Here it is empty.</li>
</ul>
<p>To call the method, write its name and <code>()</code>:</p>
~~~
sayHello();
~~~
<div class="tip"><b>Why use methods?</b> Less {{repeated|مكرر}} code. Code that is easier to read. And easier to fix: you change the method in one place, and every call gets the change.</div>
<p>You already know one method: <code>main</code>. Java always starts the program from <code>main</code>.</p>`,
      code: `public class Main {
    static void sayHello() {
        System.out.println("Hello!");
    }

    public static void main(String[] args) {
        sayHello();
        sayHello();
    }
}`,
      steps: [
        { cap: 'Every Java program starts in <b>main()</b>.', line: 6 },
        { cap: 'First call: <code>sayHello();</code> Java {{jumps|يقفز}} to the method.', line: 7 },
        { cap: 'The method runs its code. It prints <b>Hello!</b>', line: 3, out: 'Hello!' },
        { cap: 'The method is finished. Java goes back to <b>main</b> and moves to the next line.', line: 4 },
        { cap: 'Second call: the same code runs again. We wrote it only <b>one</b> time!', line: [8, 3], out: 'Hello!' }
      ],
      draw: function (k) {
        var calls = k < 1 ? 0 : k < 4 ? 1 : 2;
        return [
          B('main', 30, 80, 210, boxH(2), { title: 'main()', lines: ['sayHello();', 'sayHello();'], tone: 'blue', hi: k === 0 || k === 3 }),
          B('m', 320, 80, 210, boxH(1), { title: 'sayHello()', lines: ['println("Hello!");'], tone: 'teal', hi: k === 2 || k === 4 }),
          k >= 1 && T('cur', 14, k === 4 ? 145 : 127, '▶', { tone: 'accent', size: 13 }),
          (k === 1 || k === 2) && A('call1', 240, 120, 318, 110, { tone: 'accent', label: 'call', bend: -22 }),
          k === 3 && A('back', 320, 145, 242, 135, { tone: 'teal', label: 'go back', bend: -22 }),
          k === 4 && A('call2', 240, 140, 318, 110, { tone: 'accent', label: 'call again', bend: -22 }),
          T('cnt', 280, 270, 'sayHello() was called ' + calls + (calls === 1 ? ' time' : ' times'), { anchor: 'middle', size: 16, bold: true, tone: calls ? 'accent' : 'muted' })
        ];
      },
      quiz: [
        { q: 'What does <code>void</code> mean?', options: ['The method has no name', 'The method gives back no value', 'The method runs two times'], answer: 1, why: '<code>void</code> means there is no {{return value|قيمة راجعة}}.' },
        { type: 'fill', q: 'Fill in the blank to call the method <code>printLine</code>.', code: 'static void printLine() {\n    System.out.println("------");\n}\n\npublic static void main(String[] args) {\n    ___();\n}', answer: ['printLine'], why: 'To call a method, write its name and <code>()</code>.' },
        { q: 'How many times can you call one method?', options: ['Only one time', 'Two times', 'As many times as you want'], answer: 2, why: 'This is the big {{benefit|فائدة}} of methods.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm1-2',
      title: 'Method parameters',
      body: `
<p>A method can take <b>input</b>. The input goes inside the <code>( )</code>. We call it a <b>parameter</b>.</p>
~~~
static void greet(String name) {
    System.out.println("Hi " + name);
}
~~~
<p>Here, <code>name</code> is a parameter of type <code>String</code>. It is like an empty box. It gets a value when you call the method.</p>
<p>When you call <code>greet("Sara")</code>, the value <code>"Sara"</code> goes into the box <code>name</code>. The value you send is called an <b>argument</b>.</p>
<div class="tip"><b>Easy way to remember:</b> the <b>parameter</b> is the empty box in the method. The <b>argument</b> is the real value you put in the box.</div>
<h3>More than one parameter</h3>
<p>Use a {{comma|فاصلة}} between parameters. Each one needs its own type.</p>
~~~
static void add(int a, int b) {
    System.out.println(a + b);
}

add(4, 6);   // prints 10
~~~
<p>The {{order|الترتيب}} is important: the first argument goes to the first parameter, the second argument goes to the second parameter.</p>`,
      code: `static void greet(String name) {
    System.out.println("Hi " + name);
}

public static void main(String[] args) {
    greet("Sara");
    greet("Omar");
}`,
      steps: [
        { cap: 'The method <b>greet</b> has one parameter: <code>name</code>. Right now it is an empty box.', line: 1 },
        { cap: 'We call <code>greet("Sara")</code>. The value "Sara" is the {{argument|القيمة المُرسَلة}}.', line: 6 },
        { cap: 'The argument goes into the parameter. Now <code>name = "Sara"</code>.', line: 1 },
        { cap: 'The method uses <code>name</code> and prints <b>Hi Sara</b>.', line: 2, out: 'Hi Sara' },
        { cap: 'Second call with a new argument: <code>"Omar"</code>.', line: 7 },
        { cap: 'Same method, new value, new result: <b>Hi Omar</b>.', line: [1, 2], out: 'Hi Omar' }
      ],
      draw: function (k) {
        var callTxt = k < 4 ? 'greet("Sara");' : 'greet("Omar");';
        var IN = [345, 103], OUT = [55, 103];
        return [
          B('meth', 300, 40, 240, 200, { title: 'greet(String name)', band: true, tone: 'teal', mono: true }),
          B('slot', 325, 95, 190, 56, { tone: 'muted', fill: 'none', dash: true, tag: 'parameter: name', title: (k === 0 || k === 4) ? 'empty' : '', size: 12 }),
          T('body', 320, 205, 'println("Hi " + name);', { mono: true, size: 12.5, tone: (k === 3 || k === 5) ? 'accent' : 'ink', bold: k === 3 || k === 5 }),
          k >= 1 && B('call', 30, 200, 210, 44, { title: callTxt, mono: true, tone: 'blue', hi: k === 1 || k === 4 }),
          k >= 1 && k <= 3 && B('chipS', (k === 1 ? OUT : IN)[0], (k === 1 ? OUT : IN)[1], 150, 40, { title: '"Sara"', mono: true, tone: 'accent', fill: 'solid', tag: k === 1 ? 'argument' : undefined }),
          k >= 4 && B('chipO', (k === 4 ? OUT : IN)[0], (k === 4 ? OUT : IN)[1], 150, 40, { title: '"Omar"', mono: true, tone: 'accent', fill: 'solid', tag: k === 4 ? 'argument' : undefined }),
          (k === 1 || k === 4) && A('flow', 212, 123, 320, 123, { tone: 'accent', dash: true })
        ];
      },
      quiz: [
        { q: 'In <code>greet("Sara")</code>, what is <code>"Sara"</code>?', options: ['A parameter', 'An argument', 'A return type'], answer: 1, why: 'The real value you send is the argument. The empty box inside the method is the parameter.' },
        { type: 'fill', q: 'Complete the method so it takes two <code>int</code> parameters.', code: 'static void add(___ a, int ___) {\n    System.out.println(a + b);\n}', answer: ['int', 'b'], why: 'Each parameter needs a type and a name.' },
        { q: 'What does this print?', code: 'static void show(int x) {\n    System.out.println(x * 2);\n}\n\nshow(5);', options: ['5', '10', 'x * 2'], answer: 1, why: 'x gets the value 5, and 5 * 2 = 10.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm1-3',
      title: 'Return values',
      body: `
<p>Sometimes you want a method to <b>give back</b> a result. For this, use the keyword <code>return</code>.</p>
~~~
static int sum(int a, int b) {
    return a + b;
}
~~~
<p>Look at the start: <code>int</code> is written where we used to write <code>void</code>. This is the <b>return type</b>. It tells Java: "this method gives back an <code>int</code>."</p>
<p>Now you can save the result in a variable:</p>
~~~
int x = sum(2, 3);   // x is 5
~~~
<p>Or use it directly:</p>
~~~
System.out.println(sum(10, 20));   // 30
~~~
<div class="warn"><b>Important:</b> when Java reaches <code>return</code>, the method stops {{immediately|فوراً}}. Code after <code>return</code> does not run.</div>
<p>The value you return must {{match|يطابق}} the return type. A method with <code>int</code> must return an <code>int</code>. A method with <code>String</code> must return a <code>String</code>.</p>`,
      code: `static int sum(int a, int b) {
    return a + b;
}

public static void main(String[] args) {
    int x = sum(2, 3);
    System.out.println(x);
}`,
      steps: [
        { cap: '<b>main</b> needs a value for <code>x</code>. It calls <code>sum(2, 3)</code>.', line: 6 },
        { cap: 'The arguments go into the parameters: <code>a = 2</code>, <code>b = 3</code>.', line: 1 },
        { cap: '<code>return a + b;</code> calculates 2 + 3 = <b>5</b>.', line: 2 },
        { cap: '<code>return</code> sends 5 back to the place that called the method. Now <code>x = 5</code>.', line: 6 },
        { cap: 'We print x. The return type was <code>int</code>, and 5 is an int. Everything matches.', line: 7, out: '5' }
      ],
      draw: function (k) {
        var A1 = k === 0 ? [40, 80] : [295, 100], B1 = k === 0 ? [115, 80] : [410, 100];
        return [
          T('calltxt', 40, 52, 'int x = sum(2, 3);', { mono: true, bold: true, tone: k === 0 || k === 3 ? 'accent' : 'ink' }),
          B('meth', 250, 40, 270, 190, { title: 'sum(int a, int b)', band: true, tone: 'teal', mono: true, tag: 'return type: int' }),
          B('sa', 275, 95, 100, 48, { tone: 'muted', fill: 'none', dash: true, tag: 'a' }),
          B('sb', 390, 95, 100, 48, { tone: 'muted', fill: 'none', dash: true, tag: 'b' }),
          T('ret', 272, 190, 'return a + b;', { mono: true, size: 13, tone: k === 2 ? 'accent' : 'ink', bold: k === 2 }),
          B('c2', A1[0], A1[1] + 2, 60, 40, { title: '2', mono: true, tone: 'blue', fill: 'solid' }),
          B('c3', B1[0], B1[1] + 2, 60, 40, { title: '3', mono: true, tone: 'blue', fill: 'solid' }),
          B('x', 40, 255, 150, 54, { tag: 'int x', title: k >= 3 ? '' : '?', mono: true, tone: k >= 3 ? 'accent' : 'muted', fill: 'none' }),
          k >= 2 && B('r5', k === 2 ? 420 : 80, k === 2 ? 168 : 262, 70, 40, { title: '5', mono: true, tone: 'accent', fill: 'solid', size: 16 }),
          k === 3 && A('retA', 418, 205, 195, 270, { tone: 'accent', label: 'return 5', bend: -30 })
        ];
      },
      quiz: [
        { q: 'What is the return type here?', code: 'static double half(double n) {\n    return n / 2;\n}', options: ['`static`', '`double`', '`half`'], answer: 1, why: 'The type before the method name is the return type.' },
        { type: 'fill', q: 'Complete the method so it gives back the bigger number.', code: 'static ___ bigger(int a, int b) {\n    if (a > b) {\n        ___ a;\n    }\n    return b;\n}', answer: ['int', 'return'], why: 'The method returns an <code>int</code>, and we use <code>return</code> to give it back.' },
        { q: 'What happens to code after <code>return</code> in the same block?', options: ['It runs after the return', 'It does not run', 'It runs two times'], answer: 1, why: '<code>return</code> stops the method immediately.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm1-4',
      title: 'Method overloading',
      body: `
<p><b>Overloading</b> means: two or more methods have the <b>same name</b>, but <b>different parameters</b>.</p>
~~~
static int max(int a, int b) { ... }
static double max(double a, double b) { ... }
~~~
<p>Both methods are called <code>max</code>. How does Java know which one to use? It looks at the <b>arguments</b> you send:</p>
<ul>
<li><code>max(3, 7)</code> sends two <code>int</code> values, so Java uses the first method.</li>
<li><code>max(2.5, 1.5)</code> sends two <code>double</code> values, so Java uses the second one.</li>
</ul>
<p>The parameters must be different in at least one way:</p>
<ul>
<li>a different <b>number</b> of parameters, like <code>print(int a)</code> and <code>print(int a, int b)</code></li>
<li>or different <b>types</b>, like <code>print(int a)</code> and <code>print(String a)</code></li>
</ul>
<div class="warn">A different return type <b>alone</b> is not enough. Java chooses the method from the arguments, not from the return type.</div>
<p>You use overloading all the time: <code>System.out.println()</code> has many versions, one for <code>int</code>, one for <code>String</code>, one for <code>double</code>, and more.</p>`,
      code: `static int max(int a, int b) {
    return a > b ? a : b;
}
static double max(double a, double b) {
    return a > b ? a : b;
}

public static void main(String[] args) {
    System.out.println(max(3, 7));
    System.out.println(max(2.5, 1.5));
}`,
      steps: [
        { cap: 'Two methods with the same name: <code>max</code>. Their parameters are different.', line: [1, 4] },
        { cap: '<code>max(3, 7)</code>: the arguments are <b>int, int</b>. Java picks the int version.', line: [9, 1], out: '7' },
        { cap: '<code>max(2.5, 1.5)</code>: the arguments are <b>double, double</b>. Java picks the double version.', line: [10, 4], out: '2.5' },
        { cap: 'Not allowed: same name <b>and</b> same parameters. Java cannot choose, so it gives an error.' }
      ],
      draw: function (k) {
        var callT = k === 2 ? 'max(2.5, 1.5)' : 'max(3, 7)';
        var tag = k === 2 ? 'arguments: double, double' : 'arguments: int, int';
        return [
          B('mi', 290, 40, 250, boxH(1), { title: 'int max(int a, int b)', lines: ['for two int values'], tone: 'blue', mono: true, size: 12.5, hi: k === 1, o: k === 2 ? 0.45 : 1 }),
          B('md', 290, 175, 250, boxH(1), { title: 'double max(double a, double b)', lines: ['for two double values'], tone: 'blue', mono: true, size: 12, hi: k === 2, o: k === 1 ? 0.45 : 1 }),
          (k === 1 || k === 2) && B('call', 30, 125, 200, 48, { title: callT, mono: true, tone: 'accent', fill: 'solid', tag: tag }),
          k === 1 && A('to1', 232, 140, 288, 75, { tone: 'accent', label: 'match', bend: -10 }),
          k === 2 && A('to2', 232, 160, 288, 205, { tone: 'accent', label: 'match', bend: 10 }),
          k === 3 && B('bad', 30, 260, 250, boxH(1), { title: 'int max(int a, int b)', lines: [{ t: 'same name + same parameters', tone: 'red' }], tone: 'red', dash: true, mono: true, size: 12.5, tag: 'error: duplicate' }),
          k === 3 && A('clash', 282, 280, 330, 100, { tone: 'red', dash: true, label: 'already exists', bend: -20 })
        ];
      },
      quiz: [
        { q: 'Which pair is valid overloading?', options: ['`void a(int x)` and `void a(int y)`', '`void a(int x)` and `void a(String x)`', '`int a(int x)` and `double a(int x)`'], answer: 1, why: 'The parameter types are different (int and String). The names of the parameters do not count, and the return type alone does not count.' },
        { q: 'Java has <code>print(int n)</code> and <code>print(double n)</code>. Which one runs for <code>print(4.0)</code>?', options: ['`print(int n)`', '`print(double n)`', 'Both of them'], answer: 1, why: '4.0 is a double value.' }
      ]
    },
    /* ------------------------------------------------------------ */
    {
      id: 'm1-5',
      title: 'Recursion',
      body: `
<p><b>Recursion</b> is when a method <b>calls itself</b>.</p>
<p>A classic example is the {{factorial|المضروب}} of a number. The factorial of 4 (written 4!) is <code>4 * 3 * 2 * 1 = 24</code>.</p>
<p>Look closely: <code>4! = 4 * 3!</code> and <code>3! = 3 * 2!</code>, and so on. Each problem uses a smaller version of the same problem. This is perfect for recursion.</p>
~~~
static int fact(int n) {
    if (n == 1) {
        return 1;
    }
    return n * fact(n - 1);
}
~~~
<p>Every recursive method needs two parts:</p>
<ul>
<li><b>Base case:</b> the moment it stops. Here: when <code>n == 1</code>, return 1.</li>
<li><b>Recursive step:</b> the method calls itself with a smaller value: <code>fact(n - 1)</code>.</li>
</ul>
<div class="warn">Without a base case, the method calls itself forever. The program crashes with a <code>StackOverflowError</code>.</div>
<p>Each call waits for the next one to finish. Java keeps the waiting calls in a list called the <b>call stack</b>. Watch the drawing: the stack grows, then the answers come back from the top down.</p>`,
      code: `static int fact(int n) {
    if (n == 1) {
        return 1;
    }
    return n * fact(n - 1);
}

public static void main(String[] args) {
    System.out.println(fact(4));
}`,
      steps: [
        { cap: 'main calls <code>fact(4)</code>. To finish, it needs <code>4 * fact(3)</code>. So it waits.', line: [9, 5] },
        { cap: '<code>fact(3)</code> needs <code>3 * fact(2)</code>. Another waiting call on the stack.', line: 5 },
        { cap: '<code>fact(2)</code> needs <code>2 * fact(1)</code>. The stack keeps growing.', line: 5 },
        { cap: '<code>n == 1</code> is the {{base case|حالة التوقف}}. fact(1) returns 1 and stops calling.', line: [2, 3] },
        { cap: 'Now the answers come back. fact(2) = 2 * 1 = <b>2</b>.', line: 5 },
        { cap: 'fact(3) = 3 * 2 = <b>6</b>.', line: 5 },
        { cap: 'fact(4) = 4 * 6 = <b>24</b>. The stack is empty again.', line: 9, out: '24' }
      ],
      draw: function (k) {
        var ys = { 4: 270, 3: 210, 2: 150, 1: 90 };
        var res = { 1: 1, 2: 2, 3: 6, 4: 24 };
        var items = [T('lab', 280, 40, 'call stack (newest call on top)', { anchor: 'middle', tone: 'muted', bold: true, size: 13 })];
        var top = 4;
        [4, 3, 2, 1].forEach(function (n) {
          var added = 4 - n <= k;            // fact(4) at k0, fact(3) at k1 ...
          var returnedAt = { 1: 4, 2: 4, 3: 5, 4: 6 }[n];
          var gone = (n === 1 && k >= 4) || (n === 2 && k >= 5) || (n === 3 && k >= 6);
          if (!added || gone) return;
          top = n;
          var done = k >= returnedAt || (n === 1 && k === 3);
          var title = done ? 'fact(' + n + ') = ' + (n === 1 ? '1' : n + ' * ' + res[n - 1] + ' = ' + res[n])
            : 'fact(' + n + ') waits for ' + n + ' * fact(' + (n - 1) + ')';
          items.push(B('f' + n, 110, ys[n], 330, 46, { title: title, mono: true, size: 13, tone: done ? 'teal' : 'blue', fill: done && n === 4 && k === 6 ? 'solid' : 'soft', hi: (n === 1 && k === 3) }));
        });
        if (k < 6) items.push(P('topP', 445, ys[top] + 23, 'running', { dir: 'left', len: 26 }));
        return items;
      },
      quiz: [
        { q: 'What is the job of the base case?', options: ['To make the method faster', 'To stop the recursion', 'To call the method again'], answer: 1, why: 'Without a base case, the calls never stop.' },
        { type: 'fill', q: 'Complete the recursive method. It counts down from n to 1.', code: 'static void down(int n) {\n    if (n == 0) {\n        ___;\n    }\n    System.out.println(n);\n    ___(n - 1);\n}', answer: ['return', 'down'], why: 'The base case uses <code>return</code> to stop. The method calls itself with <code>down(n - 1)</code>.' },
        { q: 'What is <code>fact(3)</code> with the method from this lesson?', options: ['3', '6', '9'], answer: 1, why: '3 * 2 * 1 = 6.' }
      ]
    }
  ],
  challenge: {
    title: 'Square a number',
    task: `
<p>Write a method named <code>square</code>.</p>
<ul>
<li>It takes one <code>int</code> parameter.</li>
<li>It returns the number times itself (for example 6 * 6).</li>
</ul>
<p>Then, in <code>main</code>, print the result of <code>square(6)</code>.</p>
<div class="tip">Remember the parts: <code>static</code>, a return type, a name, and a parameter with its type.</div>`,
    starter: `public class Main {
    // write your method here

    public static void main(String[] args) {
        // call it and print the result here
    }
}`,
    checks: [
      { re: /static\s+int\s+square\s*\(\s*int\s+\w+\s*\)/, label: 'A method <code>static int square(int ...)</code>' },
      { re: /return\s+(\w+)\s*\*\s*\1\s*;/, label: 'It returns the number times itself' },
      { re: /System\.out\.println\s*\(\s*square\s*\(\s*6\s*\)\s*\)/, label: '<code>main</code> prints <code>square(6)</code>' }
    ],
    solution: `public class Main {
    static int square(int n) {
        return n * n;
    }

    public static void main(String[] args) {
        System.out.println(square(6));
    }
}`,
    output: '36'
  }
});
