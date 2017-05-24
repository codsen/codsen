'use strict'

import test from 'ava'
var objectBooleanCombinations = require('./index')

// ==============================
// Basic, no overrides
// ==============================

test('01.01 - one property - true, no override', function (t) {
  t.deepEqual(objectBooleanCombinations(
    {
      a: true
    }),
    [
      {a: false},
      {a: true}
    ],
  '01.01')
})

test('01.02 - one property - false, no override', function (t) {
  t.deepEqual(objectBooleanCombinations(
    {
      a: false
    }),
    [
      {a: false},
      {a: true}
    ],
  '01.02')
})

test('01.03 - three properties, no override', function (t) {
  t.deepEqual(objectBooleanCombinations(
    {
      a: true,
      b: true,
      c: true
    }),
    [
      {a: false, b: false, c: false},
      {a: true, b: false, c: false},
      {a: false, b: true, c: false},
      {a: true, b: true, c: false},
      {a: false, b: false, c: true},
      {a: true, b: false, c: true},
      {a: false, b: true, c: true},
      {a: true, b: true, c: true}
    ],
  '01.03')
})

// ==============================
// Overrides or slicing
// ==============================

test('02.04 - three properties 2 overrides', function (t) {
  t.deepEqual(objectBooleanCombinations(
    {a: false, b: false, c: false},
    {a: true, b: true}
  ),
    [ {a: true, b: true, c: false},
      {a: true, b: true, c: true}
    ],
  '02.04')
})

test('02.05 - four properties three overrides', function (t) {
  t.deepEqual(objectBooleanCombinations(
    {a: true, b: false, c: false, d: false},
    {a: true, b: true, c: true}
  ),
    [
      {d: false, a: true, b: true, c: true},
      {d: true, a: true, b: true, c: true}
    ],
  '02.05')
})

// edge cases:

test('02.06 - empty override object', function (t) {
  t.deepEqual(objectBooleanCombinations(
    {a: true, b: false, c: false},
    {}
  ),
    [ {a: false, b: false, c: false},
    {a: true, b: false, c: false},
    {a: false, b: true, c: false},
    {a: true, b: true, c: false},
    {a: false, b: false, c: true},
    {a: true, b: false, c: true},
    {a: false, b: true, c: true},
    {a: true, b: true, c: true} ],
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
      {a: true, b: false, c: false, d: false},
      {a: 'true', b: 'true', c: 'true'}
    )
  })
})
