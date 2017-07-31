'use strict'

import { sortRanges, mergeRanges } from './util'
import test from 'ava'

// sortRanges()
// ==========================

test('//   01.01  -  sortRanges() - sorts non overlapping ranges', (t) => {
  t.deepEqual(
    sortRanges([
      [3, 4],
      [1, 2]
    ]),
    [
      [1, 2],
      [3, 4]
    ],
    '01.01.01 - two args'
  )
  t.deepEqual(
    sortRanges([
      [3, 4, 'zzzz'],
      [1, 2, 'aaaa']
    ]),
    [
      [1, 2, 'aaaa'],
      [3, 4, 'zzzz']
    ],
    '01.01.02 - three args'
  )
})

test('//   01.02  -  sortRanges() - sorts by second element', (t) => {
  t.deepEqual(
    sortRanges([
      [1, 4],
      [1, 2],
      [1, 5]
    ]),
    [
      [1, 2],
      [1, 4],
      [1, 5]
    ],
    '01.02.01 - two args'
  )
  t.deepEqual(
    sortRanges([
      [1, 4, 'aaaa'],
      [1, 2, 'bbbb'],
      [1, 5, 'cccc']
    ]),
    [
      [1, 2, 'bbbb'],
      [1, 4, 'aaaa'],
      [1, 5, 'cccc']
    ],
    '01.02.02 - three args'
  )
})

test('//   01.03  -  sortRanges() - sorts overlapping ranges', (t) => {
  t.deepEqual(
    sortRanges([
      [6, 10],
      [1, 5],
      [2, 9]
    ]),
    [
      [1, 5],
      [2, 9],
      [6, 10]
    ],
    '01.03.01 - two args'
  )
  t.deepEqual(
    sortRanges([
      [6, 10, 'kkkk'],
      [1, 5, 'llll'],
      [2, 9, 'mmmmm']
    ]),
    [
      [1, 5, 'llll'],
      [2, 9, 'mmmmm'],
      [6, 10, 'kkkk']
    ],
    '01.03.02 - three args'
  )
})

test('//   01.04  -  sortRanges() - sorts with duplicates ranges', (t) => {
  t.deepEqual(
    sortRanges([
      [1, 4],
      [1, 2],
      [1, 2],
      [0, 10]
    ]),
    [
      [0, 10],
      [1, 2],
      [1, 2],
      [1, 4]
    ],
    '01.04.01 - two args'
  )
  t.deepEqual(
    sortRanges([
      [1, 4, 'yyyyy'],
      [1, 2, 'zzzz'],
      [1, 2, 'zzzz'],
      [0, 10, 'xxxxx']
    ]),
    [
      [0, 10, 'xxxxx'],
      [1, 2, 'zzzz'],
      [1, 2, 'zzzz'],
      [1, 4, 'yyyyy']
    ],
    '01.04.02 - three args'
  )
})

test('//   01.05  -  sortRanges() - empty input', (t) => {
  t.deepEqual(
    sortRanges(null),
    null,
    '01.05.01 - null input'
  )
  t.deepEqual(
    sortRanges([]),
    [],
    '01.05.02 - empty array input'
  )
})

// sortRanges()
// ==========================

test('//   02.01  -  mergeRanges() - simples: merges three overlapping ranges', (t) => {
  t.deepEqual(
    mergeRanges([
      [3, 8],
      [1, 4],
      [2, 5]
    ]),
    [
      [1, 8]
    ],
    '02.01.01 - two args'
  )
  t.deepEqual(
    mergeRanges([
      [3, 8, 'aaa'],
      [1, 4, 'bbb'],
      [2, 5, 'ccc']
    ]),
    [
      [1, 8, 'bbbcccaaa']
    ],
    '02.01.02 - three args'
  )
})

test('//   02.02  -  mergeRanges() - nothing to merge', (t) => {
  t.deepEqual(
    mergeRanges([
      [3, 8],
      [1, 2]
    ]),
    [
      [1, 2],
      [3, 8]
    ],
    '02.02.01 - just sorted'
  )
})

test('//   02.03  -  mergeRanges() - empty input', (t) => {
  t.deepEqual(
    mergeRanges([]),
    [],
    '02.03.01 - empty array'
  )
  t.deepEqual(
    mergeRanges(null),
    null,
    '02.03.02 - null'
  )
})

test('//   02.04  -  mergeRanges() - more complex case', (t) => {
  t.deepEqual(
    mergeRanges([
      [
        1,
        5
      ],
      [
        11,
        15
      ],
      [
        6,
        10
      ],
      [
        16,
        20
      ],
      [
        10,
        30
      ]
    ]),
    [
      [
        1,
        5
      ],
      [
        6,
        30
      ]
    ],
    '02.04.01 - empty array'
  )
})
