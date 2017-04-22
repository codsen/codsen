'use strict'

import test from 'ava'
var i = require('./index.js')

// ==============
// various throws
// ==============

test('0.1 - throws when inputs are missing', t => {
  t.throws(function () {
    i()
  })
})

test('0.2 - throws when second arg is missing', t => {
  t.throws(function () {
    i(['zzz'])
  })
})

test('0.3 - first input arg is not array', t => {
  t.throws(function () {
    i({a: 'a'}, 'a')
  })
  t.throws(function () {
    i(1, 'a')
  })
  t.throws(function () {
    i({a: 'a'})
  })
  t.throws(function () {
    i(1)
  })
})

test('0.4 - throws when second arg is not string', t => {
  t.throws(function () {
    i(['zzz'], 1)
  })
  t.throws(function () {
    i(['zzz'], false)
  })
})

test('0.5 - not throws when overloaded', t => {
  t.notThrows(function () {
    i(['zzz'], '1', true)
  })
})

test('0.6 - empty array always yields false', t => {
  t.notThrows(function () {
    i([], 'zzz', false)
  })
})

test('0.7 - non-empty array turned empty because of cleaning yields false too', t => {
  t.notThrows(function () {
    i([null, null], 'zzz', false)
  })
})

// ===
// BAU
// ===

test('1.1 - no wildcard, fails', t => {
  t.is(
    i(
      ['something', 'anything', 'everything'],
      'thing'
    ),
    false,
    '1.1')
})

test('1.2 - no wildcard, succeeds', t => {
  t.is(
    i(
      ['something', 'anything', 'everything'],
      'something'
    ),
    true,
    '1.2')
})

test('1.3 - wildcard, succeeds', t => {
  t.is(
    i(
      ['something', 'anything', 'everything'],
      '*thing'
    ),
    true,
    '1.3')
})

test('1.4 - wildcard, fails', t => {
  t.is(
    i(
      ['something', 'anything', 'everything'],
      'zzz'
    ),
    false,
    '1.4')
})

test('1.5 - emoji everywhere', t => {
  t.is(
    i(
      ['xxxaxxx', 'zxxxzzzzxz', 'xxz'],
      '*a*'
    ),
    true,
    '1.5.1')
  t.is(
    i(
      ['🦄🦄🦄a🦄🦄🦄', 'z🦄🦄🦄zzzz🦄z', '🦄🦄z'],
      '*a*'
    ),
    true,
    '1.5.2')
  t.is(
    i(
      ['🦄🦄🦄a🦄🦄🦄', 'z🦄🦄🦄zzzz🦄z', '🦄🦄z'],
      '*🦄z'
    ),
    true,
    '1.5.3')
  t.is(
    i(
      ['🦄🦄🦄a🦄🦄🦄', 'z🦄🦄🦄zzzz🦄z', '🦄🦄z'],
      '%%%'
    ),
    false,
    '1.5.4')
})

test('1.6 - second arg is empty string', t => {
  t.is(
    i(
      ['something', 'anything', 'everything'],
      ''
    ),
    false,
    '1.6')
})

// 👍
