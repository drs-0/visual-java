/* CS2 · Interfaces: quick checks under the slides (1-2 per slide) and more part-quiz questions. */
addChecks({
  course: 'cs2', lesson: '08-interfaces',
  slides: {
    1: [
      { type: 'tf', q: 'An interface describes what objects can do.', answer: true, why: 'It specifies common behavior, like being edible or comparable.' }
    ],
    3: [
      { q: 'Which name is most likely the name of an interface?', options: ['Printable', 'Student', 'Circle'], answer: 0, why: 'Interface names often end in -able, because they describe a behavior.' }
    ],
    4: [
      { type: 'write', q: 'Write an interface named Drawable with one method draw that returns nothing.', rows: 3, checks: [{ re: /interface\s+Drawable\s*\{/, label: 'public interface Drawable {' }, { re: /void\s+draw\s*\(\s*\)\s*;/, label: 'void draw();' }], solution: 'public interface Drawable {\n  void draw();\n}', why: 'The method has no body and ends with a semicolon.' }
    ],
    5: [
      { type: 'bug', q: 'One line does not compile. Tap it.', code: 'Edible a = new Apple();\nEdible b = new Chicken();\nEdible c = new Edible();', answer: 3, why: 'An interface can be the type of a variable, but you cannot create an instance of it with new.' }
    ],
    6: [
      { type: 'tf', q: 'In the UML diagram, a dashed line with a hollow triangle means implements.', answer: true, why: 'A solid line means extends.' }
    ],
    7: [
      { type: 'output', q: 'With the classes of slide 7, what does this print?', code: 'Edible e = new Chicken();\nSystem.out.println(e.howToEat());', answer: 'Chicken: Fry it', why: 'The object is a Chicken, so Chicken’s howToEat runs.' }
    ],
    8: [
      { type: 'match', q: 'Inside an interface, match each short line with its full meaning.', pairs: [['int K = 1;', 'public static final int K = 1;'], ['void p();', 'public abstract void p();']], why: 'These modifiers can be omitted in an interface.' }
    ],
    10: [
      { q: 'In Comparable<T>, what is T?', options: ['The type of the objects being compared', 'The number returned by compareTo', 'The name of the package'], answer: 0, why: 'It is a generic type, like E in ArrayList<E>.' }
    ],
    11: [
      { type: 'trace', q: 'Is each result negative, zero or positive? Write the word.', cols: ['call', 'result'], rows: [['"cat".compareTo("dog")', '?negative'], ['"dog".compareTo("cat")', '?positive'], ['"dog".compareTo("dog")', '?zero']], why: 'c comes before d, so "cat" is less than "dog".' }
    ],
    12: [
      { type: 'write', q: 'Write the header of a class Student that implements Comparable for Students.', checks: [{ re: /class\s+Student\s+implements\s+Comparable\s*<\s*Student\s*>/, label: 'public class Student implements Comparable<Student>' }], solution: 'public class Student implements Comparable<Student> {', why: 'Then the class must have public int compareTo(Student obj).' }
    ],
    13: [
      { q: 'Why can Arrays.sort not sort plain Rectangle objects?', options: ['Rectangle does not implement Comparable', 'Rectangle has no area', 'Rectangle is abstract'], answer: 0, why: 'ComparableRectangle adds the compareTo method.' }
    ],
    14: [
      { type: 'output', q: 'With ComparableRectangle, what does this print?', code: 'ComparableRectangle a = new ComparableRectangle(2, 6);\nComparableRectangle b = new ComparableRectangle(3, 4);\nSystem.out.println(a.compareTo(b));', answer: '0', why: 'Both areas are 12.0, so they are equal by area.' },
      { type: 'output', q: 'And this?', code: 'System.out.println(new ComparableRectangle(2, 3));', answer: 'Width: 2.0 Height: 3.0 Area: 6.0', why: 'println calls the toString of slide 14.' }
    ],
    15: [
      { type: 'tf', q: 'Arrays.sort must know that the objects are rectangles to sort them.', answer: false, why: 'It only calls compareTo, so it works for any Comparable class.' }
    ],
    16: [
      { type: 'output', q: 'What does this print?', code: 'String[] fruits = {"mango", "kiwi", "banana", "apple"};\njava.util.Arrays.sort(fruits);\nSystem.out.println(fruits[0] + " " + fruits[1] + " " + fruits[3]);', answer: 'apple banana mango', why: 'Strings are sorted with compareTo, in alphabetical order.' }
    ],
    17: [
      { type: 'trace', q: 'After the sort, what is the area of each element?', code: 'ComparableRectangle[] r = {\n  new ComparableRectangle(2, 10),\n  new ComparableRectangle(3, 3),\n  new ComparableRectangle(5, 5)\n};\njava.util.Arrays.sort(r);', cols: ['element', 'area'], rows: [['r[0]', '?9.0|9'], ['r[1]', '?20.0|20'], ['r[2]', '?25.0|25']], why: 'The rectangles are sorted by area, from small to big.' }
    ],
    19: [
      { type: 'match', q: 'Match each one with what it can have.', pairs: [['Interface', 'Only constants and method signatures, no constructors'], ['Abstract class', 'Any data, constructors, and methods with bodies']], why: 'The table of slide 19.' }
    ],
    20: [
      { type: 'bug', q: 'One line does not compile. Tap it.', code: 'class B { }\nclass C { }\nclass A extends B, C { }', answer: 3, why: 'A class can extend only one class. It can implement many interfaces.' },
      { type: 'write', q: 'Write the header of a class Robot that extends Machine and implements Movable and Chargeable.', checks: [{ re: /class\s+Robot\s+extends\s+Machine\s+implements\s+(Movable\s*,\s*Chargeable|Chargeable\s*,\s*Movable)/, label: 'public class Robot extends Machine implements Movable, Chargeable' }], solution: 'public class Robot extends Machine implements Movable, Chargeable {', why: 'extends comes first, then implements with the interfaces separated by commas.' }
    ],
    21: [
      { type: 'output', q: 'With the classes of slide 7, what does this print?', code: 'Edible e = new Chicken();\nChicken c = (Chicken) e;\nSystem.out.println(c.sound());', answer: 'Chicken sound', why: 'sound is not in Edible, so the variable is cast to Chicken first.' }
    ],
    22: [
      { q: 'This time c is an instance of Class1 (not Class2). Which one is false?', options: ['c instanceof Interface2_1', 'c instanceof Interface1_2', 'c instanceof Object'], answer: 0, why: 'Only Class2 implements Interface2_1. Class1 gets Interface1_2 through Interface1.' }
    ],
    23: [
      { type: 'match', q: 'Match each relationship with the best way to model it.', pairs: [['A GregorianCalendar is a Calendar', 'A class (extends)'], ['All strings can be compared', 'An interface (implements)']], why: 'A strong is-a uses a class; a weak is-a (is-kind-of) uses an interface.' }
    ],
    24: [
      { type: 'tf', q: 'Two interfaces with conflicting constants are only found when the program runs.', answer: false, why: 'The compiler finds the conflict.' }
    ],
    26: [
      { q: 'Which one cannot be a rational number?', options: ['5/0', '0/5', '-3/4'], answer: 0, why: 'A rational number cannot have a denominator of 0.' }
    ],
    27: [
      { q: 'In the UML of Rational, gcd is underlined. What does that mean?', options: ['It is static', 'It is public', 'It is abstract'], answer: 0, why: 'Underlined means static; the minus sign means private.' }
    ],
    28: [
      { type: 'trace', q: 'What does each object store?', cols: ['object', 'numerator', 'denominator'], rows: [['new Rational(10, -4)', '?-5', '?2'], ['new Rational(3, 9)', '?1', '?3'], ['new Rational()', '?0', '?1']], why: 'The fraction is reduced, and the sign moves to the numerator.' }
    ],
    29: [
      { type: 'trace', q: 'Follow gcd(48, 18). What are n1 and n2 after each loop?', cols: ['when', 'n1', 'n2'], rows: [['start', '48', '18'], ['after loop 1', '?18', '?12'], ['after loop 2', '?12', '?6'], ['after loop 3', '?6', '?0']], why: 'n2 is 0, so the loop stops and gcd returns 6.' },
      { type: 'output', q: 'What does this print?', code: 'System.out.println(new Rational(1, 4).doubleValue());', answer: '0.25', why: '1 * 1.0 / 4 = 0.25.' }
    ],
    30: [
      { type: 'output', q: 'What does this print?', code: 'System.out.println(new Rational(3, 4).subtract(new Rational(1, 4)));', answer: '1/2', why: 'n = 3*4 - 4*1 = 8, d = 16, and 8/16 is reduced to 1/2.' },
      { type: 'output', q: 'And this?', code: 'Rational a = new Rational(1, 2);\na.add(new Rational(1, 2));\nSystem.out.println(a);', answer: '1/2', why: 'add returns a new Rational; a itself does not change. The result was not saved.' }
    ],
    31: [
      { type: 'write', q: 'Inside Rational, write a method reciprocal() that returns the fraction turned upside down (2/3 becomes 3/2).', rows: 3, checks: [{ re: /public\s+Rational\s+reciprocal\s*\(\s*\)/, label: 'public Rational reciprocal()' }, { re: /return\s+new\s+Rational\s*\(\s*denominator\s*,\s*numerator\s*\)\s*;/, label: 'return new Rational(denominator, numerator);' }], solution: 'public Rational reciprocal() {\n  return new Rational(denominator, numerator);\n}', why: 'Swap the two parts. The constructor fixes the sign.' }
    ],
    32: [
      { type: 'output', q: 'What does this print?', code: 'System.out.println(new Rational(3, 4).compareTo(new Rational(2, 3)));', answer: '1', why: '3/4 - 2/3 = 1/12, and its numerator is positive.' },
      { type: 'output', q: 'And this?', code: 'System.out.println(new Rational(2, 4).equals(new Rational(1, 2)));', answer: 'true', why: 'The difference is 0, so they are equal.' }
    ],
    33: [
      { type: 'output', q: 'What does this print?', code: 'Rational r1 = new Rational(1, 2);\nRational r2 = new Rational(1, 6);\nSystem.out.println(r1 + " + " + r2 + " = " + r1.add(r2));\nSystem.out.println(r1 + " - " + r2 + " = " + r1.subtract(r2));', answer: '1/2 + 1/6 = 2/3\n1/2 - 1/6 = 1/3', why: '8/12 is 2/3 and 4/12 is 1/3.' }
    ]
  },
  parts: {
    0: [
      { type: 'write', q: 'Write a class Orange that extends Fruit. Its howToEat returns "Orange: Juice it".', rows: 4, checks: [{ re: /class\s+Orange\s+extends\s+Fruit/, label: 'class Orange extends Fruit' }, { re: /public\s+String\s+howToEat\s*\(\s*\)\s*\{\s*return\s+"Orange: Juice it"\s*;\s*\}/, label: 'public String howToEat() { return "Orange: Juice it"; }' }], solution: 'class Orange extends Fruit {\n  public String howToEat() { return "Orange: Juice it"; }\n}', why: 'Fruit implements Edible, so Orange must write the body of howToEat.' },
      { type: 'bug', q: 'This class does not compile. Tap the wrong line.', code: 'class Banana extends Fruit {\n  String howToEat() { return "Banana: Peel it"; }\n}', answer: 2, why: 'howToEat is public in Edible, so it must be public here too.' },
      { type: 'output', q: 'With the interface T of slide 8, what does this print?', code: 'System.out.println(T.K + 1);', answer: '2', why: 'T.K is the constant 1.' }
    ],
    1: [
      { type: 'write', q: 'Fill in compareTo of ComparableCircle. Compare by radius: return 1, -1 or 0.', rows: 5, starter: 'public int compareTo(ComparableCircle obj) {\n  \n}', checks: [{ re: /getRadius\s*\(\s*\)\s*>\s*obj\s*\.\s*getRadius\s*\(\s*\)\s*\)\s*return\s+1\s*;/, label: 'if (getRadius() > obj.getRadius()) return 1;' }, { re: /getRadius\s*\(\s*\)\s*<\s*obj\s*\.\s*getRadius\s*\(\s*\)\s*\)\s*return\s+-\s*1\s*;/, label: 'else if (getRadius() < obj.getRadius()) return -1;' }, { re: /return\s+0\s*;/, label: 'else return 0;' }], solution: 'public int compareTo(ComparableCircle obj) {\n  if (getRadius() > obj.getRadius()) return 1;\n  else if (getRadius() < obj.getRadius()) return -1;\n  else return 0;\n}', why: 'The same shape as ComparableRectangle, with the radius instead of the area.' },
      { type: 'output', q: 'What does this print?', code: 'Integer[] a = {40, 7, 19};\njava.util.Arrays.sort(a);\nSystem.out.println(a[0] + " " + a[2]);', answer: '7 40', why: 'Integer implements Comparable, so Arrays.sort can sort it.' },
      { type: 'tf', q: 'A ComparableRectangle can be used where a Rectangle is expected.', answer: true, why: 'ComparableRectangle extends Rectangle.' }
    ],
    2: [
      { type: 'write', q: 'Write the header of an interface SmartPhone that extends the interfaces Camera and Phone.', checks: [{ re: /interface\s+SmartPhone\s+extends\s+(Camera\s*,\s*Phone|Phone\s*,\s*Camera)/, label: 'public interface SmartPhone extends Camera, Phone' }], solution: 'public interface SmartPhone extends Camera, Phone {', why: 'An interface can extend many interfaces.' },
      { type: 'bug', q: 'One line does not compile. Tap it.', code: 'interface Movable { void move(); }\ninterface Fast extends Movable { }\ninterface Toy extends Object { }', answer: 3, why: 'An interface can extend other interfaces, but not classes.' },
      { type: 'tf', q: 'Every interface extends Object, just like every class.', answer: false, why: 'There is no root for interfaces.' }
    ],
    3: [
      { type: 'output', q: 'What does this print?', code: 'System.out.println(new Rational(5, 10).add(new Rational(1, 2)));', answer: '1', why: '5/10 is stored as 1/2, and 1/2 + 1/2 = 1/1, which prints as 1.' },
      { type: 'trace', q: 'Follow new Rational(2, 5).add(new Rational(1, 10)).', cols: ['value', 'is'], rows: [['n', '?25'], ['d', '?50'], ['the result', '?1/2']], why: 'n = 2*10 + 5*1 = 25, d = 5*10 = 50, and 25/50 is reduced to 1/2.' },
      { type: 'output', q: 'What does this print?', code: 'System.out.println(new Rational(2, 3).multiply(new Rational(3, 4)));', answer: '1/2', why: '6/12 is reduced to 1/2.' }
    ]
  }
});
