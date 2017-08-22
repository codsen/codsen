'use strict'

import { findtype } from '../util'
import test from 'ava'

// 01. findtype()
// ==========================

test('00.01. findtype() BAU', (t) => {
  t.deepEqual(
    findtype('999.88'),
    'numeric',
    '00.01.01'
  )
  t.deepEqual(
    findtype('£999.88'),
    'numeric',
    '00.01.02'
  )
  t.deepEqual(
    findtype('$999.88'),
    'numeric',
    '00.01.03'
  )
  t.deepEqual(
    findtype('€10,000.88'),
    'numeric',
    '00.01.04'
  )
  t.deepEqual(
    findtype('10,000.88€'),
    'numeric',
    '00.01.05'
  )
  t.deepEqual(
    findtype('value is 10,000.88€'),
    'text',
    '00.01.06'
  )
  t.deepEqual(
    findtype(''),
    'empty',
    '00.01.07'
  )
})

test('00.02. findtype() throws', (t) => {
  t.throws(function () {
    findtype(true)
  })
  t.throws(function () {
    findtype(null)
  })
  t.throws(function () {
    findtype(1)
  })
  t.throws(function () {
    findtype(undefined)
  })
  t.throws(function () {
    findtype([])
  })
  t.throws(function () {
    findtype({})
  })
})
