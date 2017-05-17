'use strict'

import test from 'ava'
var pull = require('./index.js')

// =======
// no glob
// =======

test('1.1 - no glob', t => {
  t.deepEqual(
    pull(
      ['one', 'two', 'three'],
      ['one', 'three']
    ),
    ['two'],
    '1.1')
})

test('1.2 - won\'t find', t => {
  t.deepEqual(
    pull(
      ['one', 'two', 'three'],
      ['something']
    ),
    ['one', 'two', 'three'],
    '1.2')
})

test('1.3 - empty source array', t => {
  t.deepEqual(
    pull(
      [],
      ['one', 'three']
    ),
    [],
    '1.3')
})

test('1.4 - empty source array', t => {
  t.deepEqual(
    pull(
      [],
      []
    ),
    [],
    '1.4')
})

test('1.5 - no glob, deletes last remaining thing', t => {
  t.deepEqual(
    pull(
      ['one'],
      ['one']
    ),
    [],
    '1.5')
})

// ====
// glob
// ====

test('2.1 - glob, normal use', t => {
  t.deepEqual(
    pull(
      ['module-1', 'only this left', 'module-2', 'module-3', 'elements', 'elemental'],
      ['module-*', 'something else', 'element*']
    ),
    ['only this left'],
    '2.1')
})

test('2.2 - asterisk the only input - pulls everything', t => {
  t.deepEqual(
    pull(
      ['module-1', 'only this left', 'module-2', 'module-3', 'elements', 'elemental'],
      ['*']
    ),
    [],
    '2.2')
})

test('2.3 - asterisk in the source array', t => {
  t.deepEqual(
    pull(
      ['module-*', 'module-**', 'something-*', 'something-**'],
      ['module-*']
    ),
    ['something-*', 'something-**'],
    '2.3')
})

// ==========
// edge cases
// ==========

test('3.1 - missing one input', t => {
  t.deepEqual(
    pull(
      ['module-*', 'module-**', 'something-*', 'something-**']
    ),
    ['module-*', 'module-**', 'something-*', 'something-**'],
    '3.1')
})

test('3.2 - missing both inputs - throws', t => {
  t.throws(function () {
    pull()
  })
})

test('3.3 - against asterisk', t => {
  t.deepEqual(
    pull(
      ['a*', 'a**', '*******', null, '*'],
      ['*']
    ),
    [],
    '3.3')
})

test('3.4 - against emoji and asterisk', t => {
  t.deepEqual(
    pull(
      ['🦄', '🦄*', '🦄**', '*🦄', '*******', undefined, '*'],
      ['🦄*']
    ),
    ['*🦄', '*******', '*'],
    '3.4')
})

// ========================================
// checks for accidental input arg mutation
// ========================================

var arr1 = ['a', 'b', 'c']
var arr2 = ['c']
var unneededResult = pull(arr1, arr2)

test('4.1 - does not mutate the input args', t => {
  t.pass(unneededResult) // filler to shut up the JS Standard complaining
  t.deepEqual(
    arr1,
    ['a', 'b', 'c'],
    '4.1.1')
  t.deepEqual(
    arr2,
    ['c'],
    '4.1.2')
})
