'use strict'

import indx from './index'
import test from 'ava'

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test('01.01 - throws when there\'s no input', t => {
  t.throws(function () {
    indx()
  })
})

test('01.02 - throws when the first argument is not string', t => {
  t.throws(function () {
    indx(1)
  })
})

test('01.03 - throws when the second argument is not string', t => {
  t.throws(function () {
    indx('a', 1)
  })
})

test('01.04 - throws when the third argument is not natural number', t => {
  t.throws(function () {
    indx('a', 'a', 'a')
  })
  t.notThrows(function () {
    indx('a', 'a', '1')
  })
  t.notThrows(function () {
    indx('a', 'a', 1)
  })
})

// -----------------------------------------------------------------------------
// 02. normal use, no third arg in the input
// -----------------------------------------------------------------------------

test('02.01 - finds one char', function (t) {
  t.deepEqual(indx('a', 'a'),
    [0],
    '02.01.01'
  )
  t.deepEqual(indx('ab', 'a'),
    [0],
    '02.01.02'
  )
  t.deepEqual(indx('ab', 'b'),
    [1],
    '02.01.03'
  )
  t.deepEqual(indx('abc', 'a'),
    [0],
    '02.01.04'
  )
  t.deepEqual(indx('abc', 'b'),
    [1],
    '02.01.05'
  )
  t.deepEqual(indx('abc', 'c'),
    [2],
    '02.01.06'
  )
  t.deepEqual(indx('aaa', 'a'),
    [0, 1, 2],
    '02.01.07'
  )
  t.deepEqual(indx('a\u0000a', 'a'),
    [0, 2],
    '02.01.08'
  )
})

test('02.02 - finds one emoji', function (t) {
  t.deepEqual(indx('🦄', '🦄'),
    [0],
    '02.02.01'
  )
  t.deepEqual(indx('🦄b', '🦄'),
    [0],
    '02.02.02'
  )
  t.deepEqual(indx('a🦄', '🦄'),
    [1],
    '02.02.03'
  )
  t.deepEqual(indx('🦄bc', '🦄'),
    [0],
    '02.02.04'
  )
  t.deepEqual(indx('a🦄c', '🦄'),
    [1],
    '02.02.05'
  )
  t.deepEqual(indx('ab🦄', '🦄'),
    [2],
    '02.02.06'
  )
})

test('02.03 - does not find a char or emoji', function (t) {
  t.deepEqual(indx('a', 'z'),
    [],
    '02.03.01'
  )
  t.deepEqual(indx('abcdef', 'z'),
    [],
    '02.03.02'
  )
  t.deepEqual(indx('🦄', 'z'),
    [],
    '02.03.03'
  )
  t.deepEqual(indx('a', '🦄'),
    [],
    '02.03.04'
  )
  t.deepEqual(indx('abcd🦄f', 'z'),
    [],
    '02.03.05'
  )
})

test('02.04 - finds multiple consecutive', function (t) {
  t.deepEqual(indx('abcabc', 'abc'),
    [0, 3],
    '02.04.01'
  )
  t.deepEqual(indx('🦄🐴🐎🦄🐴🐎', '🦄🐴🐎'),
    [0, 3],
    '02.04.02'
  )
})

test('02.05 - finds multiple with space in between, first char hit', function (t) {
  t.deepEqual(indx('abczabc', 'abc'),
    [0, 4],
    '02.05.01'
  )
  t.deepEqual(indx('🦄🐴🐎z🦄🐴🐎', '🦄🐴🐎'),
    [0, 4],
    '02.05.02'
  )
})

test('02.06 - finds multiple with space in between, first char is not hit', function (t) {
  t.deepEqual(indx('zabczabc', 'abc'),
    [1, 5],
    '02.06.01'
  )
  t.deepEqual(indx('zabczabcyyyyy', 'abc'),
    [1, 5],
    '02.06.02'
  )
  t.deepEqual(indx('z🦄🐴🐎z🦄🐴🐎', '🦄🐴🐎'),
    [1, 5],
    '02.06.03'
  )
  t.deepEqual(indx('z🦄🐴🐎z🦄🐴🐎yyyyy', '🦄🐴🐎'),
    [1, 5],
    '02.06.04'
  )
})

// -----------------------------------------------------------------------------
// 03. padding offset
// -----------------------------------------------------------------------------

test('03.01 - finds multiple consecutive, text, offset', function (t) {
  t.deepEqual(indx('abcabc', 'abc', 0),
    [0, 3],
    '03.01.01'
  )
  t.deepEqual(indx('abcabc', 'abc', '0'),
    [0, 3],
    '03.01.02'
  )
  t.deepEqual(indx('abcabc', 'abc', 1),
    [3],
    '03.01.03'
  )
  t.deepEqual(indx('abcabc', 'abc', '1'),
    [3],
    '03.01.04'
  )
  t.deepEqual(indx('abcabc', 'abc', 999),
    [],
    '03.01.05'
  )
  t.deepEqual(indx('abcabc', 'abc', '999'),
    [],
    '03.01.06'
  )
})

test('03.02 - finds multiple consecutive, emoji, offset', function (t) {
  t.deepEqual(indx('🦄🐴🐎🦄🐴🐎', '🦄🐴🐎', 0),
    [0, 3],
    '03.02.01'
  )
  t.deepEqual(indx('🦄🐴🐎🦄🐴🐎', '🦄🐴🐎', '0'),
    [0, 3],
    '03.02.02'
  )
  t.deepEqual(indx('🦄🐴🐎🦄🐴🐎', '🦄🐴🐎', 1),
    [3],
    '03.02.03'
  )
  t.deepEqual(indx('🦄🐴🐎🦄🐴🐎', '🦄🐴🐎', '1'),
    [3],
    '03.02.04'
  )
  t.deepEqual(indx('🦄🐴🐎🦄🐴🐎', '🦄🐴🐎', 999),
    [],
    '03.02.05'
  )
  t.deepEqual(indx('🦄🐴🐎🦄🐴🐎', '🦄🐴🐎', '999'),
    [],
    '03.02.06'
  )
})

test('03.03 - finds multiple with space in between, first char hit, offset', function (t) {
  t.deepEqual(indx('abczabc', 'abc', 0),
    [0, 4],
    '03.03.01'
  )
  t.deepEqual(indx('abczabc', 'abc', 3),
    [4],
    '03.03.02'
  )
  t.deepEqual(indx('abczabc', 'abc', 4),
    [4],
    '03.03.03'
  )
  t.deepEqual(indx('abczabc', 'abc', 5),
    [],
    '03.03.04'
  )
  t.deepEqual(indx('🦄🐴🐎z🦄🐴🐎', '🦄🐴🐎', 0),
    [0, 4],
    '03.03.05'
  )
  t.deepEqual(indx('🦄🐴🐎z🦄🐴🐎', '🦄🐴🐎', 3),
    [4],
    '03.03.06'
  )
  t.deepEqual(indx('🦄🐴🐎z🦄🐴🐎', '🦄🐴🐎', 4),
    [4],
    '03.03.07'
  )
  t.deepEqual(indx('🦄🐴🐎z🦄🐴🐎', '🦄🐴🐎', 5),
    [],
    '03.03.08'
  )
})

test('03.04 - finds multiple with space in between, first char is not hit, offset', function (t) {
  t.deepEqual(indx('zabczabc', 'abc', 0),
    [1, 5],
    '03.04.01'
  )
  t.deepEqual(indx('zabczabc', 'abc', '0'),
    [1, 5],
    '03.04.02'
  )
  t.deepEqual(indx('zabczabc', 'abc', 1),
    [1, 5],
    '03.04.03'
  )
  t.deepEqual(indx('zabczabc', 'abc', '1'),
    [1, 5],
    '03.04.04'
  )
  t.deepEqual(indx('zabczabc', 'abc', 2),
    [5],
    '03.04.05'
  )
  t.deepEqual(indx('zabczabc', 'abc', '2'),
    [5],
    '03.04.06'
  )
  t.deepEqual(indx('babababa', 'ab'),
    [1, 3, 5],
    '03.04.07'
  )
  t.deepEqual(indx('babababa', 'ab', 2),
    [3, 5],
    '03.04.08'
  )
  t.deepEqual(indx('babababa', 'ab', '2'),
    [3, 5],
    '03.04.09'
  )
})

// -----------------------------------------------------------------------------
// 04. real text with linebreaks etc
// -----------------------------------------------------------------------------

test('04.01 - finds in real text, no offset', function (t) {
  var text = 'This is cheeky sentence with a cheeky\nlinebreaks,\ttabs and some <code>HTML</code> tags. Also there\'s a cheeky emoji 🙊 and cheeky Unicode characters: \u0000\u0001. That\'s a very cheeky test sentence.'
  t.deepEqual(indx(text, 'cheeky'),
    [8, 31, 103, 122, 167],
    '04.01'
  )
  t.deepEqual(text.charAt(8), 'c')
  t.deepEqual(text.charAt(31), 'c')
  t.deepEqual(text.charAt(103), 'c')
  // following two are offset by one, because emoji pushed them by one:
  t.deepEqual(text.charAt(123), 'c')
  t.deepEqual(text.charAt(168), 'c')
})
