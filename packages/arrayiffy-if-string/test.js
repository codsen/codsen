'use strict'

import a from './index'
import test from 'ava'

// -----------------------------------------------------------------------------
// 02. BAU
// -----------------------------------------------------------------------------

test('01.01 - string input', function (t) {
  t.deepEqual(
    a(
      'aaa'
    ),
    ['aaa'],
    '01.01.01'
  )
  t.deepEqual(
    a(
      ''
    ),
    [],
    '01.01.02'
  )
})

test('01.02 - string input', function (t) {
  t.deepEqual(
    a(
      1
    ),
    1,
    '01.02.01'
  )
  t.deepEqual(
    a(
      null
    ),
    null,
    '01.02.02'
  )
  t.deepEqual(
    a(
      undefined
    ),
    undefined,
    '01.02.03'
  )
  t.deepEqual(
    a(),
    undefined,
    '01.02.04'
  )
  t.deepEqual(
    a(
      true
    ),
    true,
    '01.02.05'
  )
})
