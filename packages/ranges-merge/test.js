import test from 'ava'
import mergeRanges from './index'

// mergeRanges()
// ==========================

test('01.01 - simples: merges three overlapping ranges', (t) => {
  t.deepEqual(
    mergeRanges([
      [3, 8],
      [1, 4],
      [2, 5],
    ]),
    [
      [1, 8],
    ],
    '01.01.01 - two args',
  )
})

test('01.02 - nothing to merge', (t) => {
  t.deepEqual(
    mergeRanges([
      [3, 8],
      [1, 2],
    ]),
    [
      [1, 2],
      [3, 8],
    ],
    '01.02.01 - just sorted',
  )
})

test('01.03 - empty input', (t) => {
  t.deepEqual(
    mergeRanges([]),
    [],
    '01.03.01 - empty array',
  )
  t.deepEqual(
    mergeRanges(null),
    null,
    '01.03.02 - null',
  )
})

test('01.04 - more complex case', (t) => {
  t.deepEqual(
    mergeRanges([
      [
        1,
        5,
      ],
      [
        11,
        15,
      ],
      [
        6,
        10,
      ],
      [
        16,
        20,
      ],
      [
        10,
        30,
      ],
    ]),
    [
      [
        1,
        5,
      ],
      [
        6,
        30,
      ],
    ],
    '01.04.01 - empty array',
  )
})

test('01.05 - third arg', (t) => {
  t.deepEqual(
    mergeRanges([
      [3, 8, 'c'],
      [1, 4, 'a'],
      [2, 5, 'b'],
    ]),
    [
      [1, 8, 'abc'],
    ],
    '01.05.01',
  )
  t.deepEqual(
    mergeRanges([
      [3, 8, 'c'],
      [1, 4],
      [2, 5, 'b'],
    ]),
    [
      [1, 8, 'bc'],
    ],
    '01.05.02',
  )
  t.deepEqual(
    mergeRanges([
      [3, 8, 'c'],
      [1, 4, 'a'],
      [2, 5],
    ]),
    [
      [1, 8, 'ac'],
    ],
    '01.05.03',
  )
  t.deepEqual(
    mergeRanges([
      [3, 8],
      [1, 4, 'a'],
      [2, 5, 'b'],
    ]),
    [
      [1, 8, 'ab'],
    ],
    '01.05.04',
  )
})

test('01.06 - more merging examples', (t) => {
  t.deepEqual(
    mergeRanges([
      [7, 14],
      [24, 28, ' '],
      [29, 31],
      [28, 28, ' '],
    ]),
    [
      [7, 14],
      [24, 28, '  '],
      [29, 31],
    ],
    '01.06.01',
  )
})
