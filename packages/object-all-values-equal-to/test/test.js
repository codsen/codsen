/* eslint ava/no-only-test:0 */

import test from 'ava'
import allValuesEqualTo from '../dist/object-all-values-equal-to.cjs'

// 01. B.A.U.
// -----------------------------------------------------------------------------

test('01.01 - nested objects', (t) => {
  t.deepEqual(
    allValuesEqualTo({
      a: false,
      b: [
        {
          c: false,
        },
        {
          d: false,
        },
      ],
    }, false),
    true,
    '01.01.01',
  )
  t.deepEqual(
    allValuesEqualTo({
      a: false,
      b: [
        {
          c: '', // <--- because of this
        },
        {
          d: false,
        },
      ],
    }, false),
    false,
    '01.01.02',
  )
})

test('01.02 - nested array', (t) => {
  t.deepEqual(
    allValuesEqualTo([
      {
        a: false,
      },
      {
        b: false,
      },
    ], false),
    true,
    '01.02.01',
  )
  t.deepEqual(
    allValuesEqualTo([
      {
        a: false,
      },
      {
        b: false,
      },
      1,
    ], false),
    false,
    '01.02.02',
  )
  t.deepEqual(
    allValuesEqualTo(['a'], false),
    false,
    '01.02.03',
  )
  t.deepEqual(
    allValuesEqualTo([[]], false),
    true,
    '01.02.04',
  )
})

test('01.03 - nulls', (t) => {
  t.deepEqual(
    allValuesEqualTo([null], null),
    false,
    '01.03.01',
  )
  t.deepEqual(
    allValuesEqualTo([null], null, { arraysMustNotContainPlaceholders: false }),
    true,
    '01.03.02',
  )
})

test('01.04 - empty obj/arr', (t) => {
  t.deepEqual(
    allValuesEqualTo([], false),
    true,
    '01.04.01',
  )
  t.deepEqual(
    allValuesEqualTo({}, false),
    true,
    '01.04.02',
  )
  t.deepEqual(
    allValuesEqualTo(null, false),
    false,
    '01.04.03 - only valid for empty container-like types, array and plain object',
  )
})

// 02. Throws
// -----------------------------------------------------------------------------

test('02.01 - various throws', (t) => {
  t.throws(() => {
    allValuesEqualTo()
  }) // first arg missing - will throw

  t.throws(() => {
    allValuesEqualTo(1)
  }) // second arg missing

  t.throws(() => {
    allValuesEqualTo(['a'], false, 'zzz')
  }) // third arg is not a plain obj
})
