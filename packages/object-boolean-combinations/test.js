'use strict'

import test from 'ava'
var objectBooleanCombinations = require('./index')

// ==============================
// Basic, no overrides
// ==============================

test('01.01 - one property - 1, no override', function (t) {
  t.deepEqual(objectBooleanCombinations(
    {
      a: 1
    }),
    [
      {a: 0},
      {a: 1}
    ],
  '01.01')
})

test('01.02 - one property - 0, no override', function (t) {
  t.deepEqual(objectBooleanCombinations(
    {
      a: 0
    }),
    [
      {a: 0},
      {a: 1}
    ],
  '01.02')
})

test('01.03 - three properties, no override', function (t) {
  t.deepEqual(objectBooleanCombinations(
    {
      a: 1,
      b: 1,
      c: 1
    }),
    [
      {a: 0, b: 0, c: 0},
      {a: 1, b: 0, c: 0},
      {a: 0, b: 1, c: 0},
      {a: 1, b: 1, c: 0},
      {a: 0, b: 0, c: 1},
      {a: 1, b: 0, c: 1},
      {a: 0, b: 1, c: 1},
      {a: 1, b: 1, c: 1}
    ],
  '01.03')
})

// ==============================
// Overrides or slicing
// ==============================

test('02.04 - three properties 2 overrides', function (t) {
  t.deepEqual(objectBooleanCombinations(
    {a: 0, b: 0, c: 0},
    {a: 1, b: 1}
  ),
    [ {a: 1, b: 1, c: 0},
      {a: 1, b: 1, c: 1}
    ],
  '02.04')
})

test('02.05 - four properties three overrides', function (t) {
  t.deepEqual(objectBooleanCombinations(
    {a: 1, b: 0, c: 0, d: 0},
    {a: 1, b: 1, c: 1}
  ),
    [
      {d: 0, a: 1, b: 1, c: 1},
      {d: 1, a: 1, b: 1, c: 1}
    ],
  '02.05')
})

// edge cases:

test('02.06 - empty override object', function (t) {
  t.deepEqual(objectBooleanCombinations(
    {a: 1, b: 0, c: 0},
    {}
  ),
    [ {a: 0, b: 0, c: 0},
    {a: 1, b: 0, c: 0},
    {a: 0, b: 1, c: 0},
    {a: 1, b: 1, c: 0},
    {a: 0, b: 0, c: 1},
    {a: 1, b: 0, c: 1},
    {a: 0, b: 1, c: 1},
    {a: 1, b: 1, c: 1} ],
  '02.06')
})

test('02.07 - both input and override objects empty', function (t) {
  t.deepEqual(objectBooleanCombinations(
    {},
    {}
  ),
  [ {} ],
  '02.07')
})

// ==============================
// Edge cases
// ==============================

test('03.01 - both inputs missing - throws', t => {
  t.throws(function () {
    objectBooleanCombinations()
  })
})

test('03.02 - first input is not an object - throws', t => {
  t.throws(function () {
    objectBooleanCombinations('a')
  })
})

test('03.03 - second input is not an object - throws', t => {
  t.throws(function () {
    objectBooleanCombinations('a', 'a')
  })
  t.throws(function () {
    objectBooleanCombinations({a: 'a'}, 'a')
  })
})

test('03.04 - non-boolean object overrides - throws', t => {
  t.throws(function () {
    objectBooleanCombinations(
      {a: 1, b: 0, c: 0, d: 0},
      {a: '1', b: '1', c: '1'}
    )
  })
})
