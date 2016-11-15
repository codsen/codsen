'use strict'

var test = require('tape')
var objectBooleanCombinations = require('./index.js')

test('one property - true, no override', function (t) {
  t.deepEqual(objectBooleanCombinations(
    {
      a: true
    }),
    [
      {a: false},
      {a: true}
    ]
  )
  t.end()
})

test('one property - false, no override', function (t) {
  t.deepEqual(objectBooleanCombinations(
    {
      a: false
    }),
    [
      {a: false},
      {a: true}
    ]
  )
  t.end()
})

test('three properties, no override', function (t) {
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
    ]
  )
  t.end()
})

// now let's test overrides:

test('three properties 2 overrides', function (t) {
  t.deepEqual(objectBooleanCombinations(
    {a: false, b: false, c: false},
    {a: true, b: true}
  ),
    [ {a: true, b: true, c: false},
      {a: true, b: true, c: true}
     ]
  )
  t.end()
})

test('four properties three overrides', function (t) {
  t.deepEqual(objectBooleanCombinations(
    {a: true, b: false, c: false, d: false},
    {a: true, b: true, c: true}
  ),
    [
      {d: false, a: true, b: true, c: true},
      {d: true, a: true, b: true, c: true}
    ]
  )
  t.end()
})

// edge cases:

test('empty override object', function (t) {
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
    {a: true, b: true, c: true} ]
  )
  t.end()
})

test('both input and override objects empty', function (t) {
  t.deepEqual(objectBooleanCombinations(
    {},
    {}
  ),
  [ {} ]
  )
  t.end()
})
