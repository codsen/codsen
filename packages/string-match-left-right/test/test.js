/* eslint ava/no-only-test:0 */

import test from 'ava'
import { matchLeftIncl, matchRightIncl, matchLeft, matchRight } from '../dist/string-match-left-right.cjs'

// 1. Input arg validation
// -----------------------------------------------------------------------------

test('01.01 - throws', (t) => {
  // no third arg
  t.throws(() => {
    matchLeftIncl('zzz', 1)
  })
  t.throws(() => {
    matchLeftIncl('', 1)
  })
  t.throws(() => {
    matchRightIncl('zzz', 1)
  })
  // third arg wrong
  t.throws(() => {
    matchRightIncl('zzz', 1, 1)
  })
  t.throws(() => {
    matchRightIncl('zzz', 'aaa', 1)
  })
  t.throws(() => {
    matchRightIncl('zzz', 'aaa', '')
  })
  t.throws(() => {
    matchRightIncl('zzz', 'aaa', [''])
  })
  t.throws(() => {
    matchRightIncl('zzz', 'aaa', ['', ''])
  })
  // no second arg
  t.throws(() => {
    matchLeftIncl('zzz', null, ['aaa'])
  })
  t.throws(() => {
    matchRightIncl('zzz', null, ['aaa'])
  })
  t.throws(() => {
    matchRightIncl('zzz', null, [])
  })
  t.throws(() => {
    matchRightIncl('zzz', null, '')
  })
  // second arg completely missing onwards
  t.throws(() => {
    matchLeftIncl('zzz')
  })
  t.throws(() => {
    matchRightIncl('zzz')
  })
  // first arg not string
  t.throws(() => {
    matchLeftIncl(1)
  })
  t.throws(() => {
    matchRightIncl(1)
  })
  t.throws(() => {
    matchLeftIncl([1])
  })
  t.throws(() => {
    matchRightIncl([1])
  })
  t.throws(() => {
    matchLeftIncl(null)
  })
  t.throws(() => {
    matchRightIncl(null)
  })
  t.throws(() => {
    matchLeftIncl()
  })
  t.throws(() => {
    matchRightIncl()
  })
  t.throws(() => {
    matchLeftIncl(-1)
  })
  // fourth arg not a plain object
  t.throws(() => {
    matchRightIncl('zzz', 1, ['aaa'], true)
  })
})

// 2. matchLeftIncl()
// -----------------------------------------------------------------------------

test('02.01 - matchLeftIncl()      on a simple string', (t) => {
  t.is(
    matchLeftIncl('abc', 2, 'c'),
    'c',
    '02.01.01 - pointless, but still',
  )
  t.is(
    matchLeftIncl('abcdefghi', 3, ['bcd']),
    'bcd',
    '02.01.02 - one elem to match',
  )
  t.is(
    matchLeftIncl('abcdefghi', 3, ['cd', 'bcd']),
    'cd', // first match
    '02.01.03 - multiple to match',
  )
  t.is(
    matchLeftIncl('abcdefghi', 3, ['aaa', 'bcd']),
    'bcd',
    '02.01.04',
  )
  t.is(
    matchLeftIncl('abcdefghi', 3, ['aaa', 'zzz']),
    false,
    '02.01.05',
  )
  t.is(
    matchLeftIncl('abcdefghi', 99, ['aaa', 'zzz']),
    false,
    '02.01.06',
  )
})

test('02.02 - matchLeftIncl()      case insensitive', (t) => {
  t.is(
    matchLeftIncl('abc', 2, 'C'),
    false,
    '02.02.01 - control',
  )
  t.is(
    matchLeftIncl('abc', 2, 'C', { i: true }),
    'C',
    '02.02.02 - opts.i',
  )
  t.is(
    matchLeftIncl('abc', 2, 'BC', { i: true }),
    'BC',
    '02.02.03',
  )
  t.is(
    matchLeftIncl('abC', 2, 'c', { i: true }),
    'c',
    '02.02.04 - source is uppercase, needle is lowercase',
  )
})

test('02.03 - matchLeftIncl()      left substring to check is longer than what\'s on the left', (t) => {
  t.is(
    matchLeftIncl('abc', 2, ['cjsldfdjshfjkdfhgkdkgfhkd']),
    false,
    '02.03.01',
  )
  t.is(
    matchLeftIncl('abc', 2, ['cjsldfdjshfjkdfhgkdkgfhkd'], { i: true }),
    false,
    '02.03.02 - opts should not affect anything here',
  )
})

// 3. matchLeft()
// -----------------------------------------------------------------------------

test('03.01 - matchLeft()          on a simple string', (t) => {
  t.is(
    matchLeft('abc', 2, 'b'),
    'b',
    '03.01.01',
  )
  t.is(
    matchLeft('abcdefghi', 3, ['abc']),
    'abc',
    '03.01.02 - one elem to match',
  )
  t.is(
    matchLeft('abcdefghi', 3, ['c', 'bc']),
    'c', // first one matched returned, although both did match
    '03.01.03 - multiple to match',
  )
  t.is(
    matchLeft('abcdefghi', 3, ['aaa', 'bc']),
    'bc',
    '03.01.04',
  )
  t.is(
    matchLeft('abcdefghi', 3, ['aaa', 'zzz']),
    false,
    '03.01.05',
  )
  t.is(
    matchLeft('abcdefghi', 99, ['aaa', 'zzz']),
    false,
    '03.01.06',
  )
})

test('03.02 - matchLeft()          case insensitive', (t) => {
  t.is(
    matchLeft('abc', 2, 'B'),
    false,
    '03.02.01 - control',
  )
  t.is(
    matchLeft('abc', 2, 'B', { i: true }),
    'B',
    '03.02.02 - opts.i',
  )
})

// 4. matchRightIncl()
// -----------------------------------------------------------------------------

test('04.01 - matchRightIncl()     on a simple string, non zero arg', (t) => {
  t.is(
    matchRightIncl('abcdef', 2, 'c'),
    'c',
    '04.01.01',
  )
  t.is(
    matchRightIncl('abcdef', 2, 'cde'),
    'cde',
    '04.01.02',
  )
  t.is(
    matchRightIncl('abcdef', 2, ['cde']),
    'cde',
    '04.01.03',
  )
  t.is(
    matchRightIncl('abcdef', 2, ['gjd', 'cde']),
    'cde',
    '04.01.04',
  )
  t.is(
    matchRightIncl('abcdef', 99, ['cde']),
    false,
    '04.01.05',
  )
})

test('04.02 - matchRightIncl()     on a simple string, index zero', (t) => {
  t.is(
    matchRightIncl('abcdef', 0, 'a'),
    'a',
    '04.02.01',
  )
  t.is(
    matchRightIncl('abcdef', 0, 'abc'),
    'abc',
    '04.02.02',
  )
  t.is(
    matchRightIncl('abcdef', 0, ['abc']),
    'abc',
    '04.02.03',
  )
  t.is(
    matchRightIncl('abcdef', 0, ['fiuhjd', 'gfds', 'abc']),
    'abc',
    '04.02.04',
  )
})


test('04.03 - matchRightIncl()     on a simple string, case insensitive', (t) => {
  t.is(
    matchRightIncl('abcdef', 2, 'C'),
    false,
    '04.03.01',
  )
  t.is(
    matchRightIncl('abcdef', 2, 'C', { i: true }),
    'C',
    '04.03.02',
  )
  t.is(
    matchRightIncl('abcdef', 2, ['C'], { i: true }),
    'C',
    '04.03.03',
  )
  t.is(
    matchRightIncl('abcdef', 2, ['JFHG', 'URR', 'C'], { i: true }),
    'C',
    '04.03.04',
  )
})

// 5. matchRight()
// -----------------------------------------------------------------------------

test('05.01 - matchRight()         on a simple string, non zero arg', (t) => {
  t.is(
    matchRight('abcdef', 2, 'd'),
    'd',
    '05.01.01',
  )
  t.is(
    matchRight('abcdef', 2, ['d']),
    'd',
    '05.01.02',
  )
  t.is(
    matchRight('abcdef', 2, 'def'),
    'def',
    '05.01.03',
  )
  t.is(
    matchRight('abcdef', 2, ['def']),
    'def',
    '05.01.04',
  )
  t.is(
    matchRight('abcdef', 2, ['defg']),
    false,
    '05.01.05',
  )
  t.is(
    matchRight('abcdef', 99, ['defg']),
    false,
    '05.01.06',
  )
})

test('05.02 - matchRight()         on a simple string, non zero arg', (t) => {
  t.is(
    matchRight('abcdef', 0, 'b'),
    'b',
    '05.02.01',
  )
  t.is(
    matchRight('abcdef', 0, ['b']),
    'b',
    '05.02.02',
  )
  t.is(
    matchRight('abcdef', 0, ['bc']),
    'bc',
    '05.02.03',
  )
  t.is(
    matchRight('abcdef', 0, ['hfd', 'ghja', 'bc']),
    'bc',
    '05.02.04',
  )
})

test('05.03 - matchRight()         on a simple string, case insensitive', (t) => {
  t.is(
    matchRight('abcdef', 2, 'D'),
    false,
    '05.03.01',
  )
  t.is(
    matchRight('abcdef', 2, 'D', { i: true }),
    'D',
    '05.03.02',
  )
  t.is(
    matchRight('abcdef', 2, ['D'], { i: true }),
    'D',
    '05.03.03',
  )
  t.is(
    matchRight('abcdef', 2, ['gDSS', 'D'], { i: true }),
    'D',
    '05.03.04',
  )
})

test('05.04 - matchRight()         adhoc test #1', (t) => {
  t.is(
    matchRight('aaaa<<<<<<div>>>>something</div>bbbbb', 13, '>'),
    '>',
    '05.04.01',
  )
  t.is(
    matchRight('aaaa<<<<<<div>>>>something</div>bbbbb', 10, '>'),
    false,
    '05.04.02',
  )
})

// 6. opts.cb callbacks
// -----------------------------------------------------------------------------

test('06.01 - opts.cb()        callback is called back. haha!', (t) => {
  function isSpace(char) {
    return (typeof char === 'string') && (char.trim() === '')
  }
  t.is(
    matchLeft('<a class="something">', 8, 'class', { cb: isSpace }),
    'class',
    '06.01.01',
  )
  t.is(
    matchLeft('<a superclass="something">', 13, 'class', { cb: isSpace }),
    false,
    '06.01.02',
  )
  t.is(
    matchLeftIncl('<a class="something">', 8, 'class=', { cb: isSpace }),
    'class=',
    '06.01.03',
  )
  t.is(
    matchLeftIncl('<a superclass="something">', 13, 'class=', { cb: isSpace }),
    false,
    '06.01.04',
  )
  t.is(
    matchLeftIncl('a', 13, 'class=', { cb: isSpace }),
    false,
    '06.01.05 - result will fail because substring is not matched',
  )

  // PART 1. CONTROL.
  // the first part (string matching) is true, "b" is to the left of the character at index #2.
  // the second part of result calculation (callback against outside character) is true too.
  t.is(
    matchLeft(' bc', 2, 'b', { cb: isSpace }),
    'b',
    '06.01.06',
  )

  // PART 2. LET'S MAKE VERSION OF '06.01.06' FAIL BECAUSE OF THE CALLBACK.
  t.is(
    matchLeft('abc', 2, 'b', { cb: isSpace }),
    false,
    '06.01.07',
  )
  // observe that "a" does not satisfy the callback's requirement to be a space thus the
  // main result is false.
  // Now, let's test trimming:

  // PART 3.
  // character at index #5 is "c".
  // We're checking is "b" to the left of it, plus, is there a space to the left of "b".
  // Answer is no, because there are bunch of line breaks to the left of "c".
  t.is(
    matchLeft(' b\n\n\nc', 5, 'b', { cb: isSpace }),
    false,
    '06.01.08',
  )

  // PART 4.
  // Now let's enable the opts.trimBeforeMatching:
  t.is(
    matchLeft(' b\n\n\nc', 5, 'b', { cb: isSpace, trimBeforeMatching: true }),
    'b',
    '06.01.09',
  )
  // Answer is now true, because character at index #5 is "c", we look to the left of it, skip
  // all trimmable characters and encounter "b". And then, there's a space to the left of it to
  // satisfy the callback.

  // PART 5.
  // Now let's prove callback is still working.
  // Let's make it fail because of a callback.
  // Replacing space to the left of "b" with "a".
  t.is(
    matchLeft('ab\n\n\nc', 5, 'b', { cb: isSpace, trimBeforeMatching: true }),
    false,
    '06.01.10',
  )
})

test('06.02 - opts.matchLeft()     various combos', (t) => {
  function isSpace(char) {
    return (typeof char === 'string') && (char.trim() === '')
  }
  t.is(
    matchLeft('ab\n\n\nc', 5, 'b', { cb: isSpace, trimBeforeMatching: true }),
    false,
    '06.02.01',
  )
  t.is(
    matchLeft(' b\n\n\nc', 5, 'b', { cb: isSpace, trimBeforeMatching: true }),
    'b',
    '06.02.02',
  )
  t.is(
    matchLeft(' b\n\n\nc', 5, 'b', { cb: isSpace }),
    false,
    '06.02.03',
  )
  t.is(
    matchLeft('ab\n\n\nc', 5, 'B', { cb: isSpace, trimBeforeMatching: true, i: true }),
    false,
    '06.02.04',
  )
  t.is(
    matchLeft(' b\n\n\nc', 5, 'B', { cb: isSpace, trimBeforeMatching: true, i: true }),
    'B',
    '06.02.05',
  )
  t.is(
    matchLeft(' b\n\n\nc', 5, 'B', { cb: isSpace, i: true }),
    false,
    '06.02.06',
  )
})

test('06.02 - opts.matchLeftIncl() callback and trimming', (t) => {
  function isSpace(char) {
    return (typeof char === 'string') && (char.trim() === '')
  }
  function isA(char) {
    return char === 'a'
  }
  t.is(
    matchLeftIncl(' bc\n\n\n', 5, 'bc', { cb: isSpace }),
    false,
    '06.02.01',
  )
  t.is(
    matchLeftIncl(' bc\n\n\n', 5, 'bc', { cb: isSpace, trimBeforeMatching: true }),
    'bc',
    '06.02.02',
  )
  t.is(
    matchLeftIncl('abc\n\n\n', 5, 'bc', { cb: isSpace, trimBeforeMatching: true }),
    false,
    '06.02.03',
  )
  t.is(
    matchLeftIncl('abc\n\n\n', 5, 'bc', { cb: isA, trimBeforeMatching: true }),
    'bc',
    '06.02.04',
  )
  t.is(
    matchLeftIncl('abc\n\n\n', 5, 'bc', { trimBeforeMatching: true }),
    'bc',
    '06.02.05',
  )

  // opts.i
  t.is(
    matchLeftIncl(' bc\n\n\n', 5, 'BC', { cb: isSpace, i: true }),
    false,
    '06.02.05',
  )
  t.is(
    matchLeftIncl(' bc\n\n\n', 5, 'BC', { cb: isSpace, trimBeforeMatching: true, i: true }),
    'BC',
    '06.02.06',
  )
  t.is(
    matchLeftIncl(' bc\n\n\n', 5, ['BC'], { cb: isSpace, trimBeforeMatching: true, i: true }),
    'BC',
    '06.02.07',
  )
  t.is(
    matchLeftIncl(' bc\n\n\n', 5, ['AAA', 'BC'], { cb: isSpace, trimBeforeMatching: true, i: true }),
    'BC',
    '06.02.08',
  )
  t.is(
    matchLeftIncl('abc\n\n\n', 5, 'BC', { cb: isSpace, trimBeforeMatching: true, i: true }),
    false,
    '06.02.09',
  )
  t.is(
    matchLeftIncl('abc\n\n\n', 5, 'BC', { trimBeforeMatching: true, i: true }),
    'BC',
    '06.02.10',
  )
})

test('06.03 - opts.cb()       callback is called back, pt.1', (t) => {
  function isSpace(char) {
    return (typeof char === 'string') && (char.trim() === '')
  }
  t.is(
    // we will catch closing double quote, index #19 and check does closing bracket follow
    // if and also does the space follow after it
    matchRight('<a class="something"> text', 19, '>', { cb: isSpace }),
    '>',
    '06.03.01',
  )
  t.is(
    matchRight('<a class="something">text', 19, '>', { cb: isSpace }),
    false,
    '06.03.02',
  )
  t.is(
    matchRightIncl('<a class="something"> text', 19, '">', { cb: isSpace }),
    '">',
    '06.03.03',
  )
  t.is(
    matchRightIncl('<a class="something">text', 19, '">', { cb: isSpace }),
    false,
    '06.03.04',
  )
})

test('06.04 - opts.cb()       callback is called, pt.2', (t) => {
  function isSpace(char) {
    return (typeof char === 'string') && (char.trim() === '')
  }
  // control
  t.is(
    matchRight('b\n\n\nc z', 0, 'c', { cb: isSpace }),
    false,
    '06.04.01',
  )
  t.is(
    matchRight('b\n\n\nc z', 0, 'c', { cb: isSpace, trimBeforeMatching: true }),
    'c',
    '06.04.02',
  )
  t.is(
    matchRight('b\n\n\ncz', 0, 'c', { cb: isSpace, trimBeforeMatching: true }),
    false,
    '06.04.03',
  )
  t.is(
    matchRight('b\n\n\nc z', 0, 'C', { cb: isSpace, i: true }),
    false,
    '06.04.04',
  )
  t.is(
    matchRight('b\n\n\nc z', 0, 'C', { cb: isSpace, trimBeforeMatching: true, i: true }),
    'C',
    '06.04.05',
  )
  t.is(
    matchRight('b\n\n\ncz', 0, 'C', { cb: isSpace, trimBeforeMatching: true, i: true }),
    false,
    '06.04.06',
  )

  // control
  t.is(
    matchRightIncl('\n\n\nbc z', 0, ['aa', 'bc'], { cb: isSpace }),
    false,
    '06.04.03',
  )
  t.is(
    matchRightIncl('\n\n\nbc z', 0, ['aa', 'bc'], { cb: isSpace, trimBeforeMatching: true }),
    'bc',
    '06.04.04',
  )
  t.is(
    matchRightIncl('\n\n\nbcz', 0, ['aa', 'bc'], { cb: isSpace, trimBeforeMatching: true }),
    false,
    '06.04.05',
  )
  t.is(
    matchRightIncl('\n\n\nbcz', 0, ['aa', 'bc'], { trimBeforeMatching: true }),
    'bc',
    '06.04.06',
  )

  // opts.i
  t.is(
    matchRightIncl('\n\n\nbc z', 0, ['ZZ', 'BC'], { cb: isSpace, i: true }),
    false,
    '06.04.07',
  )
  t.is(
    matchRightIncl('\n\n\nbc z', 0, ['ZZ', 'BC'], { cb: isSpace, trimBeforeMatching: true, i: true }),
    'BC',
    '06.04.08',
  )
  t.is(
    matchRightIncl('\n\n\nbc z', 0, ['KJG', 'BC'], { cb: isSpace, trimBeforeMatching: true, i: true }),
    'BC',
    '06.04.09',
  )
  t.is(
    matchRightIncl('\n\n\nbcz', 0, ['ZZ', 'BC'], { cb: isSpace, trimBeforeMatching: true, i: true }),
    false,
    '06.04.10',
  )
  t.is(
    matchRightIncl('\n\n\nbcz', 0, ['ZZ', 'BC'], { trimBeforeMatching: true, i: true }),
    'BC',
    '06.04.11',
  )
  t.is(
    matchRightIncl('\n\n\nbcz', 0, ['ZZ', 'BC'], { i: true }),
    false,
    '06.04.12',
  )
})

// 7. opts.trimCharsBeforeMatching
// -----------------------------------------------------------------------------

test('07.01 - opts.trimCharsBeforeMatching       pt.1', (t) => {
  function isSpace(char) {
    return (typeof char === 'string') && (char.trim() === '')
  }
  // control
  t.is(
    matchRight('</div>', 0, ['div']),
    false,
    '07.01.01',
  )
  t.is(
    matchRight('</div>', 0, ['div'], { trimCharsBeforeMatching: ['/ '] }),
    'div',
    '07.01.02',
  )
  t.is(
    matchRight('< / div>', 0, ['div'], { trimCharsBeforeMatching: ['/ '] }),
    'div',
    '07.01.03',
  )
  t.is(
    matchRight('< / div>', 0, ['hgfdf', 'hkjh', 'div', '00'], { trimCharsBeforeMatching: ['/ '] }),
    'div',
    '07.01.04',
  )
  t.is(
    matchRight('< / div>', 0, ['div'], { trimCharsBeforeMatching: ['/'] }),
    false,
    '07.01.05',
  )

  // opts.cb
  t.is(
    matchRight('</div>', 0, ['div'], { cb: isSpace, trimCharsBeforeMatching: ['/ '] }),
    false,
    '07.01.06',
  )
  t.is(
    matchRight('< / div>', 0, ['zzzz', 'div'], { cb: isSpace, trimCharsBeforeMatching: ['/ '] }),
    false,
    '07.01.07',
  )
  t.is(
    matchRight('< / div>', 0, ['div'], { cb: isSpace, trimCharsBeforeMatching: ['/ '] }),
    false,
    '07.01.08',
  )
  t.is(
    matchRight('< / div>', 0, ['div'], { cb: isSpace, trimCharsBeforeMatching: ['/'] }),
    false,
    '07.01.09',
  )
})

// 8. opts.cb and opts.cb callbacks
// -----------------------------------------------------------------------------

test('08.01 - new in v1.5.0 - second arg in callback - matchRight()', (t) => {
  function hasEmptyClassRightAfterTheTagName(firstCharacter, wholeSubstring) {
    // console.log(`firstCharacter = ${JSON.stringify(firstCharacter, null, 4)}`)
    // console.log(`wholeSubstring = ${JSON.stringify(wholeSubstring, null, 4)}`)
    return wholeSubstring.trim().startsWith('class=""')
  }

  t.is(
    matchRight('</div class="">', 0, ['div'], { cb: hasEmptyClassRightAfterTheTagName }),
    false, // because slash hasn't been accounted for, it's to the right of index 0 character, "<".
    '08.01.01',
  )
  t.is(
    matchRight('</div class="">', 0, ['div'], { cb: hasEmptyClassRightAfterTheTagName, trimCharsBeforeMatching: ['/ '] }),
    'div', // trims slash, finds div, calls the callback with args, they trim and check for "class".
    '08.01.02',
  )
  t.is(
    matchRight('</div class="">', 0, ['ghjs', 'div'], { cb: hasEmptyClassRightAfterTheTagName, trimCharsBeforeMatching: ['/ '] }),
    'div', // trims slash, finds div, calls the callback with args, they trim and check for "class".
    '08.01.03',
  )
})

test('08.02 - new in v1.5.0 - second arg in callback - matchRightIncl()', (t) => {
  function hasEmptyClassRightAfterTheTagName(firstCharacter, wholeSubstring) {
    // console.log(`firstCharacter = ${JSON.stringify(firstCharacter, null, 4)}`)
    // console.log(`wholeSubstring = ${JSON.stringify(wholeSubstring, null, 4)}`)
    return wholeSubstring.trim().startsWith('class=""')
  }
  function startsWithDiv(firstCharacter, wholeSubstring) {
    // console.log(`firstCharacter = ${JSON.stringify(firstCharacter, null, 4)}`)
    // console.log(`wholeSubstring = ${JSON.stringify(wholeSubstring, null, 4)}`)
    return wholeSubstring.startsWith('div')
  }
  function startsWithDivWithTrim(firstCharacter, wholeSubstring) {
    // console.log(`firstCharacter = ${JSON.stringify(firstCharacter, null, 4)}`)
    // console.log(`wholeSubstring = ${JSON.stringify(wholeSubstring, null, 4)}`)
    return wholeSubstring.trim().startsWith('div')
  }

  t.is(
    matchRightIncl('</div class="">', 0, ['</', 'Khg']),
    '</', // base from where we start
    '08.02.01',
  )
  t.is(
    matchRightIncl('</div class="">', 0, ['</'], { cb: hasEmptyClassRightAfterTheTagName }),
    false, // wrong callback function
    '08.02.02',
  )
  t.is(
    matchRightIncl('</div class="">', 0, ['</', '>'], { cb: startsWithDiv }),
    '</', // fails because space (before "class") is not accounted for
    '08.02.03',
  )
  t.is(
    matchRightIncl('</ div class="">', 0, ['</'], { cb: startsWithDiv }),
    false, // fails because space (before "class") is not accounted for
    '08.02.04',
  )
  t.is(
    matchRightIncl('</div class="">', 0, ['yo', '</'], { cb: startsWithDivWithTrim }),
    '</', // trims slash, finds div, calls the callback with args, they trim and check for "class".
    '08.02.05',
  )
})

test('08.03 - new in v1.5.0 - second arg in callback - matchLeft()', (t) => {
  function startsWithZ(firstCharacter, wholeSubstring) {
    // console.log(`firstCharacter = ${JSON.stringify(firstCharacter, null, 4)}`)
    // console.log(`wholeSubstring = ${JSON.stringify(wholeSubstring, null, 4)}`)
    return wholeSubstring.startsWith('z')
  }

  t.is(
    matchLeft('<div><b>aaa</b></div>', 5, ['<article>', '<div>']),
    '<div>', // 5th index is left bracket of <b>. Yes, <div> is on the left.
    '08.03.01',
  )
  t.is(
    matchLeft('z<div ><b>aaa</b></div>', 7, ['<div>']),
    false, // 7th index is left bracket of <b>. Yes, <div> is on the left.
    '08.03.02',
  )
  t.is(
    matchLeft('z<div ><b>aaa</b></div>', 7, ['<b', '<div'], { trimCharsBeforeMatching: [' >'] }),
    '<div', // 7th index is left bracket of <b>. Yes, <div> is on the left.
    '08.03.03',
  )
  t.is(
    matchLeft('z<div ><b>aaa</b></div>', 7, ['yo yo yo', '<div', 'gkhjg'], { cb: startsWithZ, trimCharsBeforeMatching: [' >'] }),
    '<div', // 7th index is left bracket of <b>. Yes, <div> is on the left.
    '08.03.04',
  )
  t.is(
    matchLeft('<div ><b>aaa</b></div>', 6, ['<div'], { cb: startsWithZ, trimCharsBeforeMatching: [' >'] }),
    false, // cheeky - deliberately making the second arg of cb to be blank and fail startsWithZ
    '08.03.05',
  )
})

test('08.04 - new in v1.5.0 - second arg in callback - matchLeftIncl()', (t) => {
  function startsWithZ(firstCharacter, wholeSubstring) {
    // console.log(`firstCharacter = ${JSON.stringify(firstCharacter, null, 4)}`)
    // console.log(`wholeSubstring = ${JSON.stringify(wholeSubstring, null, 4)}`)
    return wholeSubstring.startsWith('z')
  }

  t.is(
    matchLeftIncl('<div><b>aaa</b></div>', 4, ['<div>', 'and this']),
    '<div>', // 4th index is right bracket of <div>, but it's inclusive so it will get included.
    // not inclusive would give "<div" by the way, that is, given index would not
    // be included in the slice.
    '08.04.01',
  )
  t.is(
    matchLeftIncl('z<div ><b>aaa</b></div>', 6, ['<div>']),
    false,
    '08.04.02',
  )
  t.is(
    matchLeftIncl('z<div ><b>aaa</b></div>', 6, ['111', '<div >']),
    '<div >',
    '08.04.03',
  )
  t.is(
    matchLeftIncl('z<div ><b>aaa</b></div>', 6, ['222', '<div >'], { cb: startsWithZ }),
    '<div >',
    '08.04.04',
  )
  t.is(
    matchLeftIncl('zxy<div ><b>aaa</b></div>', 8, ['krbd', '<div >'], { cb: startsWithZ }),
    '<div >',
    '08.04.05',
  )
  t.is(
    matchLeftIncl('<div ><b>aaa</b></div>', 0, ['krbd', '<div >'], { cb: startsWithZ }),
    false,
    '08.04.06 - cheeky - nothing for callback to hang onto',
  )
})
