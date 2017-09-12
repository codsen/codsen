import test from 'ava'
import { mergeRanges } from './util'

// mergeRanges()
// ==========================

test('//   02.01  -  mergeRanges() - simples: merges three overlapping ranges', (t) => {
  t.deepEqual(
    mergeRanges([
      [3, 8],
      [1, 4],
      [2, 5],
    ]),
    [
      [1, 8],
    ],
    '02.01.01 - two args',
  )
})

test('//   02.02  -  mergeRanges() - nothing to merge', (t) => {
  t.deepEqual(
    mergeRanges([
      [3, 8],
      [1, 2],
    ]),
    [
      [1, 2],
      [3, 8],
    ],
    '02.02.01 - just sorted',
  )
})

test('//   02.03  -  mergeRanges() - empty input', (t) => {
  t.deepEqual(
    mergeRanges([]),
    [],
    '02.03.01 - empty array',
  )
  t.deepEqual(
    mergeRanges(null),
    null,
    '02.03.02 - null',
  )
})

test('//   02.04  -  mergeRanges() - more complex case', (t) => {
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
    '02.04.01 - empty array',
  )
})
