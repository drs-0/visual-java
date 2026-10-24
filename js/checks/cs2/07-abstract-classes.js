/* CS2 · Abstract Classes: quick checks under the slides (1-2 per slide) and more part-quiz questions. */
addChecks({
  course: 'cs2', lesson: '07-abstract-classes',
  slides: {
    1: [
      { q: 'Why can you not create an object of an abstract class?', options: ['Its abstract methods are not implemented', 'It has no constructor', 'It is always private'], answer: 0, why: 'The concrete subclasses implement them.' }
    ],
    2: [
      { type: 'tf', q: 'This unit has a case study about the Calendar class.', answer: true, why: 'And one about the Number class.' }
    ],
    3: [
      { q: 'Going up from a subclass to its superclass, the class becomes…', options: ['more general and less specific', 'more specific', 'private'], answer: 0, why: 'A superclass holds the common features of its subclasses.' }
    ],
    4: [
      { type: 'tf', q: 'getArea can be implemented in GeometricObject, because every shape has an area.', answer: false, why: 'Every shape has an area, but GeometricObject does not know the formula, so getArea is abstract there.' }
    ],
    5: [
      { type: 'match', q: 'Match each UML mark with its meaning.', pairs: [['Italic name', 'Abstract'], ['#', 'protected'], ['+', 'public'], ['-', 'private']], why: 'Slide 5 and unit 2.' }
    ],
    6: [
      { q: 'Why are the constructors of the abstract GeometricObject protected?', options: ['Only subclasses should call them', 'So that anyone can create a GeometricObject', 'Because constructors must be protected'], answer: 0, why: 'Nobody can create a GeometricObject directly anyway.' }
    ],
    7: [
      { type: 'write', q: 'Declare an abstract method getVolume that returns a double.', checks: [{ re: /public\s+abstract\s+double\s+getVolume\s*\(\s*\)\s*;/, label: 'public abstract double getVolume();' }], solution: 'public abstract double getVolume();', why: 'A header with no body, ending with a semicolon.' }
    ],
    8: [
      { type: 'output', q: 'With the Circle of slide 8, what does this print?', code: 'GeometricObject g = new Circle(2.5);\nSystem.out.println(((Circle) g).getDiameter());', answer: '5.0', why: 'getDiameter is only in Circle, so a cast is needed.' }
    ],
    9: [
      { type: 'output', q: 'With the Rectangle of slide 9, what does this print?', code: 'GeometricObject g = new Rectangle(6, 2.5);\nSystem.out.println(g.getArea() + " " + g.getPerimeter());', answer: '15.0 17.0', why: '6 x 2.5 = 15 and 2 x (6 + 2.5) = 17.' }
    ],
    10: [
      { type: 'output', q: 'What does displayGeometricObject print for new Rectangle(5, 3)?', code: 'System.out.println("\\nThe area is " + object.getArea());\nSystem.out.println("The perimeter is " + object.getPerimeter());', answer: 'The area is 15.0\nThe perimeter is 16.0', why: '5 x 3 = 15 and 2 x (5 + 3) = 16. (The \\n prints an empty line first.)' },
      { q: 'What does equalArea(new Circle(5), new Rectangle(5, 3)) return?', options: ['false', 'true'], answer: 0, why: 'About 78.54 is not 15.0.' }
    ],
    11: [
      { type: 'match', q: 'A subclass of an abstract class. Match each case with what it must be.', pairs: [['It implements all the abstract methods', 'It can be concrete'], ['It leaves one abstract method unimplemented', 'It must be declared abstract']], why: 'Slide 11.' }
    ],
    12: [
      { type: 'bug', q: 'One line does not compile. Tap it.', code: 'GeometricObject a = new Circle(1);\nGeometricObject b = new GeometricObject();\nGeometricObject c = new Rectangle(2, 3);', answer: 2, why: 'GeometricObject is abstract: it cannot be instantiated with new.' }
    ],
    13: [
      { type: 'output', q: 'What does this print?', code: 'GeometricObject[] array = new GeometricObject[3];\narray[0] = new Circle(1.0);\narray[1] = new Rectangle(2, 2);\nSystem.out.println(array[1].getArea() + " " + array[2]);', answer: '4.0 null', why: 'An abstract class can be the type of an array. array[2] was never set.' }
    ],
    14: [
      { q: 'What comes next in the outline?', options: ['Case studies: the abstract Number and Calendar classes', 'The Circle class', 'Interfaces'], answer: 0, why: 'Two abstract classes from the Java library.' }
    ],
    15: [
      { type: 'output', q: 'What does this print?', code: 'Number n = 300;\nSystem.out.println(n.intValue() + " " + n.byteValue());', answer: '300 44', why: 'byteValue is (byte) intValue(); 300 does not fit in a byte, so it wraps: 300 − 256 = 44.' },
      { type: 'tf', q: 'intValue is abstract in Number.', answer: true, why: 'intValue, longValue, floatValue and doubleValue are abstract.' }
    ],
    16: [
      { type: 'output', q: 'With getLargestNumber of slide 16, what does this print?', code: 'ArrayList<Number> list = new ArrayList<>();\nlist.add(12);\nlist.add(7.5);\nlist.add(30);\nSystem.out.println(getLargestNumber(list));', answer: '30', why: 'The values are compared with doubleValue(); the largest is the Integer 30.' }
    ],
    17: [
      { type: 'match', q: 'Match each class with its kind.', pairs: [['java.util.Calendar', 'Abstract'], ['java.util.GregorianCalendar', 'Concrete subclass']], why: 'Slide 17.' }
    ],
    18: [
      { type: 'tf', q: 'You can write Calendar c = new GregorianCalendar();', answer: true, why: 'The variable type is the abstract Calendar; the object is concrete.' }
    ],
    19: [
      { type: 'trace', q: 'Which month does each object hold? Write the month’s name in English.', cols: ['object', 'month'], rows: [['new GregorianCalendar(2024, 0, 15)', '?January'], ['new GregorianCalendar(2025, 11, 31)', '?December'], ['new GregorianCalendar(2024, 1, 1)', '?February']], why: 'The month is 0-based: 0 is January and 11 is December.' }
    ],
    20: [
      { type: 'match', q: 'Match each field with what get returns.', pairs: [['Calendar.HOUR', 'The hour, 12-hour clock'], ['Calendar.HOUR_OF_DAY', 'The hour, 24-hour clock'], ['Calendar.DAY_OF_WEEK', 'The day of the week, 1 is Sunday'], ['Calendar.MONTH', 'The month, 0 is January']], why: 'Slide 20.' }
    ],
    21: [
      { type: 'output', q: 'What does this print?', code: 'Calendar c = new GregorianCalendar(2023, 6, 4);\nSystem.out.println(c.get(Calendar.YEAR) + " " + c.get(Calendar.MONTH) + " " + c.get(Calendar.DATE));', answer: '2023 6 4', why: 'get returns the same numbers that were given (month 6 is July).' }
    ],
    22: [
      { type: 'output', q: 'January 1, 2024 is a Monday. What does this print?', code: 'calendar.set(2024, Calendar.JANUARY, 1);\nSystem.out.println(calendar.get(Calendar.DAY_OF_WEEK));', answer: '2', why: 'DAY_OF_WEEK is 1 for Sunday, so Monday is 2. The slide subtracts 1 to use it as an array index.' }
    ]
  },
  parts: {
    0: [
      { type: 'write', q: 'Write a concrete class Square extends GeometricObject with a double side and getArea and getPerimeter.', rows: 6, checks: [{ re: /class\s+Square\s+extends\s+GeometricObject/, label: 'class Square extends GeometricObject' }, { re: /public\s+double\s+getArea\s*\(\s*\)\s*\{\s*return\s+side\s*\*\s*side\s*;/, label: 'getArea returns side * side' }, { re: /public\s+double\s+getPerimeter\s*\(\s*\)\s*\{\s*return\s+(4\s*\*\s*side|side\s*\*\s*4)\s*;/, label: 'getPerimeter returns 4 * side' }], solution: 'public class Square extends GeometricObject {\n  private double side;\n  public double getArea() { return side * side; }\n  public double getPerimeter() { return 4 * side; }\n}', why: 'It must implement both abstract methods to be concrete.' },
      { type: 'bug', q: 'This class does not compile. Tap the wrong line.', code: 'public class Shape {\n  public abstract double getArea();\n}', answer: 1, why: 'A class with an abstract method must itself be abstract: public abstract class Shape.' },
      { type: 'tf', q: 'An abstract class must have at least one abstract method.', answer: false, why: 'It may have none; it is then only used as a base for subclasses.' }
    ],
    1: [
      { type: 'trace', q: 'What does each call return?', cols: ['call', 'returns'], rows: [['Integer.valueOf(9).doubleValue()', '?9.0'], ['Double.valueOf(9.8).intValue()', '?9'], ['Double.valueOf(9.8).longValue()', '?9']], why: 'Number’s conversion methods; to an integer type the fraction is cut off.' },
      { type: 'output', q: 'What does this print?', code: 'Calendar c = new GregorianCalendar(2024, 1, 10);\nSystem.out.println(c.get(Calendar.MONTH) + 1);', answer: '2', why: 'Month 1 is February; adding 1 gives the usual month number, 2.' },
      { q: 'Why can a list of type ArrayList<Number> hold an Integer and a BigDecimal?', options: ['Both are subclasses of Number', 'Both are Strings', 'Java converts them to double'], answer: 0, why: 'A Number variable can refer to any subclass object.' }
    ]
  }
});
