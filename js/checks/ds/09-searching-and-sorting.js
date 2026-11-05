/* Data Structures · Unit 9 Searching and Sorting: questions under the slides and the part quizzes.
   Every question has lessons, skills, available_after and level (1 easy, 2 middle, 3 hard). The instructor's
   assignments have no questions for this unit, so all questions are written in his style (tracing exact state,
   implementation reasoning, edge cases, bugs, combined structures). Every search and sort trace was run with the slide
   code in Java. No checks on the cover and the outline slides (1, 2, 13, 25, 38). Arrays differ from the drawing presets. */
addChecks({
  course: 'ds', lesson: '09-searching-and-sorting',
  slides: {
    3: [
      { type: 'tf', q: 'Binary search works on any array, sorted or not.', answer: false,
        why: 'Slide 3: binary search is more efficient than linear search, but the elements must be sorted first. Linear search works on any array.',
        lessons: ['09-searching-and-sorting'], skills: ['concept'], available_after: '09-searching-and-sorting', level: 1 }
    ],
    4: [
      { q: 'Why can a static method not use instance variables?',
        options: ['Because static methods are always private, so they cannot see other members', 'Because static methods cannot have parameters, so they cannot get an object', 'Because instance variables are final, and static methods cannot read final variables', 'Because a static method is called through the class and does not work on a particular object, so there is no object whose variables it could use'], answer: 3,
        why: 'Slide 4: a static (class) method is invoked through the class name, like Math.sqrt(x). Instance variables belong to an object, and a static method has none.',
        lessons: ['09-searching-and-sorting'], skills: ['concept'], available_after: '09-searching-and-sorting', level: 1 }
    ],
    5: [
      { q: 'In `public static <T> int linearSearch(T[] array, T target)`, what does `<T>` before int do?',
        options: ['It is the return type, so the method returns a T', 'It declares the type parameter T for this one method, so the method is generic', 'It makes the method private to the class Searching', 'It limits T to number types such as Integer and Double'], answer: 1,
        why: 'A generic method declares its own type parameter before the return type. The return type is still int (an index). The same method can then search a String[], an Integer[], a Course[]…',
        lessons: ['09-searching-and-sorting'], skills: ['concept'], available_after: '09-searching-and-sorting', level: 1 },
      { type: 'tf', q: 'To call the static linearSearch, a program must first create an object with `new Search()`.', answer: false,
        why: 'A static method is called through the class name: <code>Search.linearSearch(names, "Ali")</code>. No object is needed.',
        lessons: ['09-searching-and-sorting'], skills: ['concept'], available_after: '09-searching-and-sorting', level: 1 }
    ],
    6: [
      { type: 'output', q: 'linearSearch is the method of slide 6. What does this print?',
        code: 'Integer[] a = {8, 3, 5, 3};\nSystem.out.println(Search.linearSearch(a, 3) + " " + Search.linearSearch(a, 9));',
        answer: '1 -1',
        why: 'linearSearch returns the index of the <b>first</b> occurrence: the first 3 is at index 1. 9 is not in the array, so the loop ends and it returns −1.',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 1 },
      { q: 'An array has 50 elements, and the target is not in it. How many elements does linearSearch compare with the target?',
        options: ['1', '25', '49', '50'], answer: 3,
        why: 'To be sure the target is missing, every element must be checked: n = 50 comparisons. That is the worst case, O(n).',
        lessons: ['09-searching-and-sorting'], skills: ['complexity'], available_after: '09-searching-and-sorting', level: 1 }
    ],
    7: [
      { q: 'Where does binary search look first?',
        options: ['At index 0', 'At the last element', 'At the middle element', 'At a random element'], answer: 2,
        why: 'Slide 7: binary search begins in the middle. If the target is not there, it knows which half it must be in, and jumps to the middle of that half.',
        lessons: ['09-searching-and-sorting'], skills: ['concept'], available_after: '09-searching-and-sorting', level: 1 }
    ],
    8: [
      { type: 'trace', q: 'Binary search looks for 31 in the sorted array 3, 8, 11, 15, 20, 26, 31, 40, 52 (indexes 0 to 8). Fill in each step.',
        cols: ['left', 'right', 'mid', 'array[mid]', '31 is (>, < or =)'],
        rows: [['?0', '?8', '?4', '?20', '?>'], ['?5', '?8', '?6', '?31', '?=']],
        why: 'mid = (0 + 8) / 2 = 4, and 31 &gt; 20, so the search goes to the right half: left = 5. mid = (5 + 8) / 2 = 6 (integer division), and array[6] = 31: found after 2 comparisons.',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 2 }
    ],
    9: [
      { q: 'A sorted array has 64 elements. After 3 comparisons that did not find the target, about how many elements are still possible?',
        options: ['3', '8', '32', '61'], answer: 1,
        why: 'Each comparison removes half of the elements that remain (slide 9): 64 → 32 → 16 → 8. Linear search would still have 61 left.',
        lessons: ['09-searching-and-sorting'], skills: ['complexity'], available_after: '09-searching-and-sorting', level: 2 }
    ],
    10: [
      { q: 'What does `"apple".compareTo("banana")` return?',
        options: ['A number less than 0', '0', 'A number greater than 0', 'false'], answer: 0,
        why: 'x.compareTo(y) is &lt; 0 when x comes before y. "apple" comes before "banana" (a before b), so the result is negative. compareTo returns an int, not a boolean.',
        lessons: ['09-searching-and-sorting'], skills: ['concept'], available_after: '09-searching-and-sorting', level: 1 },
      { type: 'tf', q: 'compareTo always returns exactly −1, 0 or 1.', answer: false,
        why: 'The rule only says &lt; 0, 0 or &gt; 0 (slide 10). For example, "a".compareTo("d") returns −3. Code must test <code>c &lt; 0</code>, never <code>c == -1</code>.',
        lessons: ['09-searching-and-sorting'], skills: ['concept', 'edge_case'], available_after: '09-searching-and-sorting', level: 2 }
    ],
    11: [
      { type: 'trace', q: 'binarySearch (slide 11) looks for 10 in 2, 5, 9, 14, 21, 30, 38 (indexes 0 to 6). Fill in left, right and mid for each turn of the loop, and left and right when the loop ends.',
        cols: ['turn', 'left', 'right', 'mid', 'array[mid]'],
        rows: [['1', '?0', '?6', '?3', '?14'], ['2', '?0', '?2', '?1', '?5'], ['3', '?2', '?2', '?2', '?9'], ['after the loop', '?3', '?2', '-', '-']],
        why: '10 &lt; 14 → right = 2. 10 &gt; 5 → left = 2. 10 &gt; 9 → left = 3. Now left &gt; right, so the loop ends and the method returns −1: 10 is not in the array.',
        lessons: ['09-searching-and-sorting'], skills: ['trace', 'edge_case'], available_after: '09-searching-and-sorting', level: 2 }
    ],
    12: [
      { q: 'About how many comparisons does binary search need in the worst case for 1,000,000 sorted elements?',
        options: ['About 500,000', 'About 1,000', 'About 20', 'About 1,000,000'], answer: 2,
        why: 'The worst case is log₂ n comparisons (slide 12), and 2²⁰ is about 1,000,000. Linear search could need all 1,000,000.',
        lessons: ['09-searching-and-sorting'], skills: ['complexity'], available_after: '09-searching-and-sorting', level: 2 },
      { type: 'tf', q: 'On average linear search looks at n/2 elements, so its average complexity is O(n/2), which is better than O(n).', answer: false,
        why: 'Big-O drops constant factors: O(n/2) is the same as O(n). Slide 12 says the average case of linear search is O(n).',
        lessons: ['09-searching-and-sorting', '02-analysis-of-algorithms'], skills: ['complexity'], available_after: '09-searching-and-sorting', level: 2 }
    ],
    14: [
      { q: 'n = 1024. About how many comparisons does a sequential sort (n²) need, and about how many does a logarithmic sort (n log₂ n) need?',
        options: ['About 1,000,000 and about 10,000', 'About 10,000 and about 1,000,000', 'About 2,048 and about 1,024', 'Both about 1,000,000'], answer: 0,
        why: 'n² = 1024 × 1024 ≈ 1,000,000. log₂ 1024 = 10, so n log₂ n = 1024 × 10 ≈ 10,000: about a hundred times fewer.',
        lessons: ['09-searching-and-sorting', '02-analysis-of-algorithms'], skills: ['complexity'], available_after: '09-searching-and-sorting', level: 2 }
    ],
    15: [
      { q: 'Selection sort runs its first pass on 7, 4, 9, 2, 5. What is the array after that pass?',
        options: ['4, 7, 9, 2, 5', '2, 4, 9, 7, 5', '2, 7, 4, 9, 5', '4, 7, 2, 5, 9'], answer: 1,
        why: 'The first pass finds the smallest element, 2, and switches it with the element in the first position, 7. Nothing else moves. "4, 7, 2, 5, 9" is a bubble sort pass.',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 1 }
    ],
    16: [
      { type: 'trace', q: 'Selection sort sorts 6, 2, 8, 1, 4. Fill in the array after each pass.',
        cols: ['after pass', '[0]', '[1]', '[2]', '[3]', '[4]'],
        rows: [['1', '?1', '?2', '?8', '?6', '?4'], ['2', '?1', '?2', '?8', '?6', '?4'], ['3', '?1', '?2', '?4', '?6', '?8'], ['4', '?1', '?2', '?4', '?6', '?8']],
        why: 'Pass 1: the minimum 1 swaps with 6. Pass 2: the minimum of the rest is 2, already in place (it swaps with itself). Pass 3: 4 swaps with 8. Pass 4: 6 is already in place.',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 2 }
    ],
    17: [
      { q: 'Why does the outer loop of selectionSort stop at `index < array.length-1` (one pass less than the number of elements)?',
        options: ['To save memory, because the last pass would need one more variable', 'It is a mistake in the slides: the last element is never sorted', 'Because the last element is never compared with the others in any pass', 'Because after the other n − 1 elements are in place, the last element must already be the largest, in its final position'], answer: 3,
        why: 'Each pass puts one element in its final place. When n − 1 are placed, the one that is left is the largest, and it is already at the end.',
        lessons: ['09-searching-and-sorting'], skills: ['design'], available_after: '09-searching-and-sorting', level: 2 },
      { q: 'How many swaps does the selectionSort of slide 17 do on an array of 8 elements that is <b>already sorted</b>?',
        options: ['0', '1', '7', '28'], answer: 2,
        why: 'The swap lines run once in every pass, even when indexMin == index (the element swaps with itself). There are n − 1 = 7 passes, so 7 swaps.',
        lessons: ['09-searching-and-sorting'], skills: ['trace', 'edge_case'], available_after: '09-searching-and-sorting', level: 2 }
    ],
    18: [
      { type: 'tf', q: 'After the 2nd pass of insertion sort, the first three elements are in their final sorted positions.', answer: false,
        why: 'They are sorted <b>among themselves</b>, but a later, smaller element can still be inserted before them and push them right. Selection sort is the one that fixes final positions pass by pass.',
        lessons: ['09-searching-and-sorting'], skills: ['concept'], available_after: '09-searching-and-sorting', level: 2 }
    ],
    19: [
      { q: 'Insertion sort sorts 5, 1, 4, 2, 8. How many times in total does the while loop shift an element to the right?',
        options: ['3', '4', '5', '6'], answer: 1,
        why: '1 shifts 5 (1 shift): 1, 5, 4, 2, 8. 4 shifts 5 (1): 1, 4, 5, 2, 8. 2 shifts 5 and 4 (2): 1, 2, 4, 5, 8. 8 shifts nothing. Total 4.',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 2 }
    ],
    20: [
      { type: 'fill', q: 'Complete insertionSort (slide 20).',
        code: 'T element = array[index];\nint i = index;\nwhile (i > 0 && array[i-1].compareTo(element) ___ 0) {\n  array[i] = array[i-1];\n  i--;\n}\narray[___] = element;',
        answer: ['>', 'i'],
        why: 'Larger values on the left move one place right while they are bigger than element. When the loop stops, i is the free place, so element goes into array[i].',
        lessons: ['09-searching-and-sorting'], skills: ['design'], available_after: '09-searching-and-sorting', level: 2 },
      { q: 'insertionSort runs on an array that is <b>already sorted</b>. What does it cost?',
        options: ['O(n): the while loop stops at once in every pass', 'O(1): nothing has to be done at all', 'O(n log n): each pass still halves the array', 'O(n²): every pass still compares all elements'], answer: 0,
        why: 'Each pass compares the new element with its left neighbour once, finds it is not bigger, and stops. n − 1 passes × 1 comparison = O(n).',
        lessons: ['09-searching-and-sorting', '02-analysis-of-algorithms'], skills: ['complexity', 'edge_case'], available_after: '09-searching-and-sorting', level: 2 }
    ],
    21: [
      { q: 'Bubble sort runs its first pass on 4, 9, 2, 7. What is the array after that pass?',
        options: ['2, 4, 7, 9', '2, 9, 4, 7', '4, 2, 9, 7', '4, 2, 7, 9'], answer: 3,
        why: '4 and 9 are in order. 9 &gt; 2: swap → 4, 2, 9, 7. 9 &gt; 7: swap → 4, 2, 7, 9. The largest value has "bubbled" to the end, but the array is not sorted yet.',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 1 }
    ],
    22: [
      { q: 'Bubble sort sorts 5, 3, 8, 1, 6. What is the array after the <b>second</b> pass?',
        options: ['3, 5, 1, 6, 8', '3, 1, 5, 6, 8', '1, 3, 5, 6, 8', '3, 1, 6, 5, 8'], answer: 1,
        why: 'Pass 1: 3, 5, 1, 6, 8 (8 bubbles to the end). Pass 2 stops before the last element: 3 and 5 stay, 5 &gt; 1 swaps → 3, 1, 5, 6, 8; 5 and 6 stay. Pass 3 would finish the job.',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 2 }
    ],
    23: [
      { q: 'How many comparisons does the bubbleSort of slide 23 make on an array of 6 elements?',
        options: ['6', '15', '25', '36'], answer: 1,
        why: 'Pass 1 compares 5 pairs, pass 2 compares 4, then 3, 2, 1: 15 = n(n − 1)/2. It always makes all of them, even if the array is sorted, which is O(n²).',
        lessons: ['09-searching-and-sorting'], skills: ['trace', 'complexity'], available_after: '09-searching-and-sorting', level: 2 }
    ],
    24: [
      { q: 'The improved bubbleSort (slide 24) runs on 1, 2, 4, 3, 5. How many passes does it make?',
        options: ['1', '2', '4', '5'], answer: 1,
        why: 'Pass 1 swaps 4 and 3, so sorted becomes false. Pass 2 makes no swap, so sorted stays true and the loop breaks. Without the flag it would make all 4 passes.',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 2 }
    ],
    26: [
      { q: 'In the slides\' quick sort, after partitioning, where are the elements equal to the pivot value (other than the pivot itself)?',
        options: ['On the right side, with the greater elements', 'On the left side', 'They are removed', 'Next to the pivot, on both sides'], answer: 0,
        why: 'Slide 26: elements <b>less than</b> the pivot go left, and elements greater than <b>or equal</b> go right.',
        lessons: ['09-searching-and-sorting'], skills: ['concept'], available_after: '09-searching-and-sorting', level: 1 }
    ],
    27: [
      { q: 'The first partition of 9, 4, 7, 1, 6 uses the rightmost element, 6, as the pivot. Which is true afterwards?',
        options: ['The array is sorted: 1, 4, 6, 7, 9', 'Only the smallest element, 1, has moved to the front', 'The pivot is still at index 4, and the others are sorted', 'The pivot 6 is at index 2, with 4 and 1 on its left and 9 and 7 on its right'], answer: 3,
        why: 'The slide code gives 4, 1, 6, 9, 7: the elements smaller than 6 are on the left and the rest on the right. The two sides are not sorted yet; quick sort sorts each side recursively.',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 2 }
    ],
    28: [
      { type: 'tf', q: 'The recursive calls `quickSort(array, low, pivotIndex - 1)` and `quickSort(array, pivotIndex + 1, high)` leave out pivotIndex because the pivot is already in its final place.', answer: true,
        why: 'After partition, everything on the left is smaller and everything on the right is greater or equal, so the pivot never has to move again.',
        lessons: ['09-searching-and-sorting'], skills: ['concept'], available_after: '09-searching-and-sorting', level: 2 },
      { q: 'When does the recursive quickSort(array, low, high) stop calling itself?',
        options: ['When the subarray has 0 or 1 element (low >= high)', 'When low < high, because then the subarray is sorted', 'When the pivot is 0, the smallest possible value', 'After log n calls, when the array is halved enough'], answer: 0,
        why: '<code>if (low &lt; high)</code> is the only work; otherwise the method does nothing. A subarray with 0 or 1 element is already sorted: that is the base case.',
        lessons: ['08-recursion', '09-searching-and-sorting'], skills: ['concept'], available_after: '09-searching-and-sorting', level: 2 }
    ],
    29: [
      { type: 'trace', q: 'partition (slide 29) runs on 3, 8, 2, 5, 1, 4 with low = 0 and high = 5. Fill in the array after it and the index it returns.',
        cols: ['[0]', '[1]', '[2]', '[3]', '[4]', '[5]', 'returns'],
        rows: [['?3', '?2', '?1', '?4', '?8', '?5', '?3']],
        why: 'pivot = 4. The while loop skips 3 (smaller), so i = 1 (8). j = 2: 2 &lt; 4 → swap with i → 3, 2, 8, 5, 1, 4 and i = 2. j = 3: 5 stays. j = 4: 1 &lt; 4 → swap → 3, 2, 1, 5, 8, 4 and i = 3. Finally the pivot swaps with index 3: 3, 2, 1, 4, 8, 5, and 3 is returned.',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 3 }
    ],
    30: [
      { q: 'During partition, what does the index i mark?',
        options: ['The pivot, which stays at index i during the loop', 'The smallest element found so far in the subarray', 'The first element that is not smaller than the pivot: the place for the next small element', 'The last element of the subarray, at index high'], answer: 2,
        why: 'Everything before i is smaller than the pivot. When j finds a smaller element, it is swapped into place i and i moves on. At the end the pivot is swapped into i, between the two groups.',
        lessons: ['09-searching-and-sorting'], skills: ['concept'], available_after: '09-searching-and-sorting', level: 2 }
    ],
    31: [
      { type: 'order', q: 'Put the steps of merge sort in order (slide 31).',
        lines: ['Divide the array into two roughly equal subarrays', 'Keep dividing until each subarray has only one element', 'Merge two sorted subarrays into one sorted subarray', 'Keep merging until the whole array is sorted'],
        why: 'First the decomposition (slide 32), down to single elements, which are sorted by themselves. Then the merging (slide 33) builds bigger and bigger sorted subarrays.',
        lessons: ['09-searching-and-sorting'], skills: ['concept'], available_after: '09-searching-and-sorting', level: 1 }
    ],
    32: [
      { q: 'An array has 8 elements. How many levels of halving does merge sort need until every subarray has one element?',
        options: ['2', '3', '4', '8'], answer: 1,
        why: '8 → 4 → 2 → 1: three levels, which is log₂ 8.',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 2 }
    ],
    33: [
      { q: 'The sorted subarrays 2, 7, 9 and 3, 4, 10 are merged. How many comparisons does the merge make?',
        options: ['3', '5', '6', '9'], answer: 1,
        why: '2/3 → 2; 7/3 → 3; 7/4 → 4; 7/10 → 7; 9/10 → 9. Now the first subarray is used up, and 10 is copied without a comparison: 5 comparisons, result 2, 3, 4, 7, 9, 10.',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 2 }
    ],
    34: [
      { q: '`mergeSort(array, 0, 6)` is called. Which two halves does it sort?',
        options: ['0 to 2 and 3 to 6', '0 to 6 and 0 to 6', '0 to 3 and 3 to 6', '0 to 3 and 4 to 6'], answer: 3,
        why: 'mid = (0 + 6) / 2 = 3, so the halves are low..mid = 0 to 3 and mid+1..high = 4 to 6. Then merge joins them.',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 1 }
    ],
    35: [
      { type: 'fill', q: 'Complete the main loop of merge (slide 35).',
        code: 'while (i <= mid && j <= high)\n  if (array[i].compareTo(array[j]) < 0) temp[k++] = array[___];\n  else temp[k++] = array[___];',
        answer: ['i++', 'j++'],
        why: 'The smaller of the two front elements is copied, and only that subarray\'s index moves on. k moves on every time.',
        lessons: ['09-searching-and-sorting'], skills: ['design'], available_after: '09-searching-and-sorting', level: 2 },
      { q: 'Why does merge have two more while loops after the main one?',
        options: ['Because one subarray is used up first; the elements left in the other one are copied as they are', 'To sort the array again, in case the main loop missed an element', 'To check the result, and to throw an exception if it is not sorted', 'To copy temp back into the original array at the end'], answer: 0,
        why: 'The main loop stops as soon as one side is empty. The rest of the other side is already sorted and bigger than everything copied, so it is simply copied. Only one of the two loops actually does anything.',
        lessons: ['09-searching-and-sorting'], skills: ['design'], available_after: '09-searching-and-sorting', level: 1 }
    ],
    36: [
      { type: 'match', q: 'Match each algorithm with its time complexity (worst case).',
        pairs: [['Linear search', 'O(n)'], ['Binary search', 'O(log n)'], ['Selection sort', 'O(n²)'], ['Merge sort', 'O(n log n)']],
        why: 'Slides 12 and 36: linear search may look at all n elements; binary search halves the pool each time; the simple sorts use two nested loops; merge sort has log₂ n levels with O(n) work per level.',
        lessons: ['09-searching-and-sorting'], skills: ['complexity'], available_after: '09-searching-and-sorting', level: 1 }
    ],
    37: [
      { q: 'Quick sort (pivot = rightmost element) runs on an array that is <b>already sorted</b>. What happens?',
        options: ['O(n): nothing is moved, because the array is already sorted', 'O(n log n), as always, because the array is split each time', 'Each partition leaves all other elements on one side, so there are about n levels: O(n²)', 'It throws an exception, because the right part is empty'], answer: 2,
        why: 'The pivot is always the largest element, so the left part gets n − 1 elements and the right part none. The partitioning is unbalanced, the depth is O(n) instead of O(log n), and the total is O(n²) (slide 37).',
        lessons: ['09-searching-and-sorting'], skills: ['complexity', 'edge_case'], available_after: '09-searching-and-sorting', level: 3 }
    ],
    39: [
      { q: 'Radix sort is used to sort people by last name, letter by letter. What is the radix?',
        options: ['10', '26', '2', 'The number of people'], answer: 1,
        why: 'The radix is the number of possible values of one "digit": 10 for decimal digits, 26 for the letters of the alphabet (slide 39).',
        lessons: ['09-searching-and-sorting'], skills: ['concept'], available_after: '09-searching-and-sorting', level: 1 }
    ],
    40: [
      { q: 'How many passes does radix sort need for 75, 4, 312, 90?',
        options: ['1', '2', '3', '4'], answer: 2,
        why: 'One pass per digit position. The longest number, 312, has 3 digits: 1s, 10s and 100s.',
        lessons: ['09-searching-and-sorting'], skills: ['concept'], available_after: '09-searching-and-sorting', level: 1 }
    ],
    41: [
      { q: 'The first pass of radix sort (1s digit) runs on 31, 25, 42, 13, 50. What is the array after it?',
        options: ['13, 25, 31, 42, 50', '50, 31, 42, 13, 25', '31, 42, 13, 25, 50', '50, 42, 31, 25, 13'], answer: 1,
        why: 'The elements are ordered by their last digit: 50 (0), 31 (1), 42 (2), 13 (3), 25 (5). The second pass (10s digit) would then sort the array.',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 1 }
    ],
    42: [
      { q: 'With `digit = (element/pos) % 10`, what is the digit of 4728 at pos = 100?',
        options: ['2', '4', '7', '8'], answer: 2,
        why: '4728 / 100 = 47 (integer division drops the last two digits), and 47 % 10 = 7: the hundreds digit.',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 1 }
    ],
    43: [
      { type: 'trace', q: 'For 12, 30, 41, 22, 5, 70 and pos = 1, fill in the first six counters and the first six indexes.',
        cols: ['array', '[0]', '[1]', '[2]', '[3]', '[4]', '[5]'],
        rows: [['count', '?2', '?1', '?2', '?0', '?0', '?1'], ['index', '?0', '?2', '?3', '?5', '?5', '?5']],
        why: 'The last digits are 2, 0, 1, 2, 5, 0: two 0s, one 1, two 2s, one 5. index[d] is where the first element with digit d goes: index[i+1] = index[i] + count[i], so 0, 2, 3, 5, 5, 5 (index[6] would be 6).',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 2 }
    ],
    44: [
      { q: 'For 12, 30, 41, 22, 5, 70 and pos = 1, the index array starts as 0, 2, 3, 5, 5, 5, 6, … The mapping loop of slide 44 then places the elements. What is sortarray after the loop?',
        options: ['30, 70, 41, 12, 22, 5', '5, 12, 22, 30, 41, 70', '70, 30, 41, 22, 12, 5', '30, 41, 12, 22, 5, 70'], answer: 0,
        why: '12 → index[2] = 3 (index[2] becomes 4); 30 → 0; 41 → 2; 22 → 4; 5 → 5; 70 → 1. So 30, 70, 41, 12, 22, 5: grouped by the last digit, and inside a group the old order is kept (30 before 70, 12 before 22).',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 2 }
    ],
    45: [
      { q: 'What does `radixSort(a, 2)` leave in a = {305, 92, 18}?',
        options: ['18, 92, 305', '18, 305, 92', '92, 305, 18', '305, 18, 92'], answer: 3,
        why: 'Pass 1 (1s): 92, 305, 18. Pass 2 (10s: 9, 0, 1): 305, 18, 92. The 100s pass never runs, because maxdigits is 2, so the array is not sorted. maxdigits must be the number of digits of the longest number.',
        lessons: ['09-searching-and-sorting'], skills: ['trace', 'bug'], available_after: '09-searching-and-sorting', level: 2 }
    ],
    46: [
      { type: 'tf', q: 'The radixSort of slide 45 can sort an array of any Comparable type, like the other sorts of this unit.', answer: false,
        why: 'Radix sort is non-comparative and not generic (slide 46): it works on the digits of int keys, and its parameter is an int[].',
        lessons: ['09-searching-and-sorting'], skills: ['concept'], available_after: '09-searching-and-sorting', level: 1 },
      { q: 'What is the time complexity of radix sort, with d digits and n elements?',
        options: ['O(d × n), which is O(n) when d is a constant', 'O(n log n), like merge sort, because it works digit by digit', 'O(n²), because each element is compared with all others', 'O(log n), because each pass halves the number of elements'], answer: 0,
        why: 'Each of the d passes goes through the n elements a few times (count, map, copy), so O(d × n). With a fixed number of digits and a large n, that is O(n).',
        lessons: ['09-searching-and-sorting', '02-analysis-of-algorithms'], skills: ['complexity'], available_after: '09-searching-and-sorting', level: 2 }
    ]
  },
  parts: {
    0: [
      { type: 'tf', q: 'Linear search also works when the array is not sorted.', answer: true,
        why: 'It checks the elements one by one from index 0, so the order does not matter. Only binary search needs a sorted array.',
        lessons: ['09-searching-and-sorting'], skills: ['concept'], available_after: '09-searching-and-sorting', level: 1 },
      { q: 'When does linear search make the most comparisons?',
        options: ['When the target is the last element or not in the array', 'When the target is in the middle', 'When the target is the first element', 'When the array is sorted'], answer: 0,
        why: 'Slide 12: the worst case is the target not found or at the end: all n elements are compared.',
        lessons: ['09-searching-and-sorting'], skills: ['complexity'], available_after: '09-searching-and-sorting', level: 1 },
      { type: 'output', q: 'What does this print?',
        code: 'System.out.println("pear".compareTo("plum") < 0);\nSystem.out.println("kiwi".compareTo("kiwi"));',
        answer: 'true\n0',
        why: '"pear" and "plum" first differ at the 2nd letter: e comes before l, so "pear" is smaller and the result is negative. Equal strings give 0.',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 1 },
      { q: 'binarySearch looks for 4 in 4, 9, 13, 18, 25, 31, 47. How many times is the target compared with an element?',
        options: ['1', '2', '3', '7'], answer: 2,
        why: 'mid = 3 (18): 4 is smaller, right = 2. mid = 1 (9): smaller, right = 0. mid = 0 (4): found. The first element is the best case for linear search, but for binary search it takes 3 comparisons.',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 2 },
      { type: 'bug', q: 'This binary search returns −1 for `binarySearch({5}, 5)` although 5 is in the array. Tap the line with the mistake.',
        code: 'int left = 0;\nint right = array.length - 1;\nwhile (left < right) {\n  int mid = (left + right) / 2;\n  int c = target.compareTo(array[mid]);\n  if (c == 0) return mid;\n  else if (c < 0) right = mid - 1;\n  else left = mid + 1;\n}\nreturn -1;',
        answer: 3,
        why: 'With one element, left = right = 0, so <code>left &lt; right</code> is false and the loop never looks at it. When left == right one element is still possible, so the slide writes <code>left &lt;= right</code>.',
        lessons: ['09-searching-and-sorting'], skills: ['bug', 'edge_case'], available_after: '09-searching-and-sorting', level: 2 },
      { q: 'By mistake, binarySearch is called on the <b>unsorted</b> array 9, 2, 7, 4, 5 with the target 2. What does it return?',
        options: ['1', 'It throws an exception', '0', '−1'], answer: 3,
        why: 'mid = 2 (7): 2 &lt; 7, so it searches the left half, right = 1. mid = 0 (9): 2 &lt; 9, right = −1. The loop ends and returns −1, although 2 is at index 1. Binary search decides which half to throw away using the order, so a wrong order gives wrong answers.',
        lessons: ['09-searching-and-sorting'], skills: ['trace', 'edge_case'], available_after: '09-searching-and-sorting', level: 3 }
    ],
    1: [
      { type: 'tf', q: 'After k passes of selection sort, the first k positions hold the k smallest elements in their final order.', answer: true,
        why: 'Each pass selects the smallest of the remaining elements and puts it in the next position, so those positions never change again.',
        lessons: ['09-searching-and-sorting'], skills: ['concept'], available_after: '09-searching-and-sorting', level: 1 },
      { q: 'Which sort compares neighbouring elements and swaps them when they are out of order?',
        options: ['Bubble sort', 'Insertion sort', 'Selection sort', 'Radix sort'], answer: 0,
        why: 'Slide 21: bubble sort compares neighbours and swaps; after each pass the largest remaining value is at the end.',
        lessons: ['09-searching-and-sorting'], skills: ['concept'], available_after: '09-searching-and-sorting', level: 1 },
      { q: 'After <b>one</b> pass on 3, 4, 1, 2 the array is 3, 1, 2, 4. Which sort was used?',
        options: ['Selection sort', 'Insertion sort', 'Bubble sort', 'None of them'], answer: 2,
        why: 'Bubble sort swaps 4 with 1 and then with 2, so 4 reaches the end: 3, 1, 2, 4. One pass of selection sort gives 1, 4, 3, 2; one pass of insertion sort leaves 3, 4, 1, 2 (4 is already after 3).',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 2 },
      { type: 'trace', q: 'Insertion sort sorts 7, 3, 5, 1. Fill in the array after each pass.',
        cols: ['after pass', '[0]', '[1]', '[2]', '[3]'],
        rows: [['1', '?3', '?7', '?5', '?1'], ['2', '?3', '?5', '?7', '?1'], ['3', '?1', '?3', '?5', '?7']],
        why: 'Pass 1 inserts 3 before 7. Pass 2 inserts 5 between 3 and 7. Pass 3 inserts 1 at the front, shifting 3, 5 and 7 right.',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 2 },
      { q: 'Which of these sorts is fastest on an array that is <b>already sorted</b>?',
        options: ['Selection sort', 'All three are O(n²) on it', 'Bubble sort of slide 23 (not improved)', 'Insertion sort'], answer: 3,
        why: 'Insertion sort makes one comparison per pass on sorted data: O(n). Selection sort still searches for every minimum, and the plain bubble sort still makes every comparison: both O(n²).',
        lessons: ['09-searching-and-sorting', '02-analysis-of-algorithms'], skills: ['complexity'], available_after: '09-searching-and-sorting', level: 2 },
      { type: 'bug', q: 'This bubble sort throws an ArrayIndexOutOfBoundsException. Tap the line with the mistake.',
        code: 'for (int pass = 1; pass < array.length; pass++) {\n  for (int i = 0; i < array.length - pass + 1; i++)\n    if (array[i].compareTo(array[i+1]) > 0) {\n      T temp = array[i];\n      array[i] = array[i+1];\n      array[i+1] = temp;\n    }\n}',
        answer: 2,
        why: 'In pass 1, i goes up to array.length − 1, and then array[i+1] is array[array.length]: outside the array. The slide stops at <code>i &lt; array.length - pass</code>, so i + 1 is at most the last index.',
        lessons: ['09-searching-and-sorting'], skills: ['bug', 'edge_case'], available_after: '09-searching-and-sorting', level: 3 },
      { q: 'Insertion sort runs on 5, 4, 3, 2, 1 (reverse order). How many shifts does it make in total?',
        options: ['4', '5', '10', '25'], answer: 2,
        why: 'Each new element is smaller than all the ones before it, so it shifts all of them: 1 + 2 + 3 + 4 = 10 = n(n − 1)/2. Reverse order is the worst case: O(n²).',
        lessons: ['09-searching-and-sorting'], skills: ['trace', 'complexity'], available_after: '09-searching-and-sorting', level: 3 }
    ],
    2: [
      { type: 'tf', q: 'Merge sort keeps dividing until each subarray has only one element.', answer: true,
        why: 'A subarray of one element is sorted by itself; merging then builds the sorted array (slide 31). In the code, low &lt; high is false for one element.',
        lessons: ['09-searching-and-sorting'], skills: ['concept'], available_after: '09-searching-and-sorting', level: 1 },
      { q: 'Which element does the slides\' partition use as the pivot?',
        options: ['The rightmost element, array[high]', 'The middle element, array[(low + high) / 2]', 'The first element, array[low]', 'The smallest element of the subarray'], answer: 0,
        why: '<code>T pivot = array[high];</code> (slide 29). Slide 26 says the choice is arbitrary; the algorithm works with any pivot.',
        lessons: ['09-searching-and-sorting'], skills: ['concept'], available_after: '09-searching-and-sorting', level: 1 },
      { q: 'partition runs on 5, 2, 9, 3, 7 (low = 0, high = 4). Which index does it return?',
        options: ['0', '2', '3', '4'], answer: 2,
        why: 'pivot = 7. The while loop skips 5 and 2, so i = 2 (9). j = 3: 3 &lt; 7 → swap → 5, 2, 3, 9, 7 and i = 3. The pivot swaps with index 3: 5, 2, 3, 7, 9. Three elements are smaller than 7, so it lands at index 3.',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 2 },
      { type: 'fill', q: 'Complete the recursive quickSort (slide 28).',
        code: 'if (low < high) {\n  int pivotIndex = partition(array, low, high);\n  quickSort(array, low, ___);\n  quickSort(array, ___, high);\n}',
        answer: ['pivotIndex-1|pivotIndex - 1', 'pivotIndex+1|pivotIndex + 1'],
        why: 'The pivot is in its final place, so the two calls sort the parts on each side of it, without the pivot.',
        lessons: ['09-searching-and-sorting'], skills: ['design'], available_after: '09-searching-and-sorting', level: 2 },
      { q: 'mergeSort runs on 8, 3, 5, 1, 9, 2. Which two subarrays are merged <b>first</b>?',
        options: ['8, 3, 5 and 1, 9, 2', '3, 8 and 5', '1 and 9', '8 and 3'], answer: 3,
        why: 'mergeSort(0, 5) first calls mergeSort(0, 2), which first calls mergeSort(0, 1), which calls mergeSort(0, 0) and mergeSort(1, 1) (both do nothing) and then merges [8] with [3]. The recursion goes all the way down on the left before anything else is merged.',
        lessons: ['08-recursion', '09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 2 },
      { q: 'Why is merge sort O(n log n)?',
        options: ['Because it compares every pair of elements once', 'Because it uses recursion, and recursion is always O(n log n)', 'Because there are about log₂ n levels of halving, and merging all the subarrays of one level costs O(n)', 'Because the pivot divides the array into two halves each time'], answer: 2,
        why: 'Slide 36: log₂ n levels × O(n) per level. Recursion alone says nothing about the cost, and merge sort has no pivot.',
        lessons: ['09-searching-and-sorting', '02-analysis-of-algorithms'], skills: ['complexity'], available_after: '09-searching-and-sorting', level: 2 },
      { q: 'Quick sort (slide code) runs on 2, 2, 2, 2, 2 (all equal). What does it cost?',
        options: ['O(n²): every partition puts the pivot at the low end and all other elements on its right', 'O(n log n), because the pivot always lands in the middle', 'O(n): all equal means sorted, so no element is moved', 'It never ends, because no element is smaller than the pivot'], answer: 0,
        why: 'Equal elements are not smaller than the pivot, so they all stay on the right side. Each partition returns low, and the right part has only one element less: about n levels, O(n²) like the sorted case.',
        lessons: ['09-searching-and-sorting'], skills: ['complexity', 'edge_case'], available_after: '09-searching-and-sorting', level: 3 },
      { q: 'In merge, the test is `array[i].compareTo(array[j]) < 0`. When the two front elements are <b>equal</b>, which one is copied first?',
        options: ['The one from the first subarray (index i)', 'Neither; the merge stops', 'Both at once', 'The one from the second subarray (index j)'], answer: 3,
        why: 'For equal elements compareTo returns 0, and 0 &lt; 0 is false, so the else branch copies array[j]. The result is still sorted; only the order of the equal elements changes.',
        lessons: ['09-searching-and-sorting'], skills: ['trace', 'edge_case'], available_after: '09-searching-and-sorting', level: 3 }
    ],
    3: [
      { type: 'tf', q: 'Radix sort sorts without comparing the elements with each other.', answer: true,
        why: 'It groups the numbers by their digits (slides 39-40). All the other sorts of this unit use compareTo.',
        lessons: ['09-searching-and-sorting'], skills: ['concept'], available_after: '09-searching-and-sorting', level: 1 },
      { q: 'What is the digit of 3095 at pos = 10?',
        options: ['0', '3', '5', '9'], answer: 3,
        why: '3095 / 10 = 309 and 309 % 10 = 9: the tens digit.',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 1 },
      { type: 'trace', q: 'radixSort(a, 3) runs on 53, 7, 128, 41, 36. Fill in the array after each pass.',
        cols: ['after pass', '[0]', '[1]', '[2]', '[3]', '[4]'],
        rows: [['1 (1s)', '?41', '?53', '?36', '?7', '?128'], ['2 (10s)', '?7', '?128', '?36', '?41', '?53'], ['3 (100s)', '?7', '?36', '?41', '?53', '?128']],
        why: 'Pass 1 orders by the last digit: 41 (1), 53 (3), 36 (6), 7 (7), 128 (8). Pass 2 by the tens digit: 7 (0), 128 (2), 36 (3), 41 (4), 53 (5). Pass 3 by the hundreds: 128 is the only one with 1, the rest have 0 and keep their order.',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 2 },
      { q: 'For 19, 9, 29, 4 and pos = 1, the index array is 0, 0, 0, 0, 0, 1, 1, 1, 1, 1. Where does the first element, 19, go in sortarray?',
        options: ['Index 0', 'Index 1', 'Index 3', 'Index 9'], answer: 1,
        why: 'Its digit is 9 and index[9] = 1 (only the 4 comes before the 9s). Then index[9] becomes 2, so 9 goes to 2 and 29 to 3. 4 goes to index[4] = 0. Result: 4, 19, 9, 29.',
        lessons: ['09-searching-and-sorting'], skills: ['trace'], available_after: '09-searching-and-sorting', level: 2 },
      { q: 'Why must the mapping loop place the elements in their <b>current</b> order (from left to right)?',
        options: ['Because a loop from left to right is faster than one from right to left', 'Because index cannot go backwards in the mapping loop', 'So that elements with the same digit keep the order of the previous passes; otherwise the work of the earlier digits is lost', 'It does not matter: the last pass sorts the whole array again anyway'], answer: 2,
        why: 'After the 1s pass, 41 is before 43. In the 10s pass both have digit 4; they must stay in that order, or the final array could have 43 before 41. Keeping the order of equal keys is what makes the passes add up.',
        lessons: ['09-searching-and-sorting'], skills: ['design'], available_after: '09-searching-and-sorting', level: 3 },
      { q: 'You must sort 1,000,000 ints that all have at most 6 digits. About how many basic steps do radix sort and merge sort need?',
        options: ['Both about 1,000,000', 'Radix: about 6 × 1,000,000; merge: about 20 × 1,000,000', 'Radix: about 1,000,000²; merge: about 1,000,000', 'Radix: about 20 × 1,000,000; merge: about 6 × 1,000,000'], answer: 1,
        why: 'Radix sort is O(d × n) with d = 6 passes. Merge sort is O(n log n) and log₂ 1,000,000 ≈ 20. For large n with few digits radix sort wins (slide 46); for small n it is less efficient.',
        lessons: ['09-searching-and-sorting', '02-analysis-of-algorithms'], skills: ['complexity'], available_after: '09-searching-and-sorting', level: 3 }
    ]
  }
});
