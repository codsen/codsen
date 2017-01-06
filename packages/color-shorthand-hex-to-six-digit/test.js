'use strict'
var c = require('./index.js')
import test from 'ava'

// ==============================
// 01. String inputs
// ==============================

test('01.01 - string input - doesn\'t touch full hex codes', t => {
  t.deepEqual(
    c('aaaa #cccccc zzzz\n\t\t\t#000000.'),
    'aaaa #cccccc zzzz\n\t\t\t#000000.',
    '01.01')
})

test('01.02 - string input - changes one shorthand, lowercase', t => {
  t.deepEqual(
    c('aaaa #f0c zzzz\n\t\t\t#ffcc00'),
    'aaaa #ff00cc zzzz\n\t\t\t#ffcc00',
    '01.02.01')
  t.deepEqual(
    c('aaaa #ff00cc zzzz\n\t\t\t#fc0'),
    'aaaa #ff00cc zzzz\n\t\t\t#ffcc00',
    '01.02.02')
  t.deepEqual(
    c('aaaa #f0c zzzz\n\t\t\t#fc0'),
    'aaaa #ff00cc zzzz\n\t\t\t#ffcc00',
    '01.02.03')
})

test('01.02 - string input - changes one shorthand, uppercase', t => {
  t.deepEqual(
    c('aaaa #f0c zzzz\n\t\t\t#ffcc00'),
    'aaaa #ff00cc zzzz\n\t\t\t#ffcc00',
    '01.02.01')
  t.deepEqual(
    c('aaaa #ff00cc zzzz\n\t\t\t#fc0'),
    'aaaa #ff00cc zzzz\n\t\t\t#ffcc00',
    '01.02.02')
  t.deepEqual(
    c('aaaa #f0c zzzz\n\t\t\t#fc0'),
    'aaaa #ff00cc zzzz\n\t\t\t#ffcc00',
    '01.02.03')
})

// ==============================
// 02. Plain object inputs
// ==============================

test('02.01 - plain object input - simple one level object', t => {
  t.deepEqual(
    c(
      {
        a: '#ffcc00',
        b: '#f0c',
        c: 'text'
      }
    ),
    {
      a: '#ffcc00',
      b: '#ff00cc',
      c: 'text'
    },
    '02.01.01')
  t.deepEqual(
    c(
      {
        a: '#fc0',
        b: '#f0c',
        c: 'text'
      }
    ),
    {
      a: '#ffcc00',
      b: '#ff00cc',
      c: 'text'
    },
    '02.01.02')
})

test('02.02 - plain object input - nested', t => {
  t.deepEqual(
    c(
      {
        a: ['#fc0'],
        b: [[['#fc0', {x: ['#f0c']}]]],
        c: 'text',
        d: null
      }
    ),
    {
      a: ['#ffcc00'],
      b: [[['#ffcc00', {x: ['#ff00cc']}]]],
      c: 'text',
      d: null
    },
    '02.02')
})

// ==============================
// 03. Array inputs
// ==============================

test('03.01 - array input - one level, strings inside', t => {
  t.deepEqual(
    c(
      [
        '#fc0', '#f0c', 'text', ''
      ]
    ),
    [
      '#ffcc00', '#ff00cc', 'text', ''
    ],
    '03.01')
})

test('03.02 - array input - nested objects & arrays', t => {
  t.deepEqual(
    c(
      [
        [[[[[{x: ['#fc0']}]]]]], {z: '#f0c'}, ['text'], {y: ''}
      ]
    ),
    [
      [[[[[{x: ['#ffcc00']}]]]]], {z: '#ff00cc'}, ['text'], {y: ''}
    ],
    '03.02')
})

// ==================================
// 04. Unaccepted inputs are returned
// ==================================

var dummy = function () {
  return null
}
test('04.01 - function as input - returned', t => {
  t.deepEqual(
    c(dummy),
    dummy,
    '04.01')
})

test('04.02 - null input - returned', t => {
  t.deepEqual(
    c(null),
    null,
    '04.02')
})

test('04.03 - undefined input - returned', t => {
  t.deepEqual(
    c(undefined),
    undefined,
    '04.03')
})

test('04.04 - NaN input - returned', t => {
  t.deepEqual(
    c(NaN),
    NaN,
    '04.04')
})

test('04.05 - no input - returned undefined', t => {
  t.deepEqual(
    c(),
    undefined,
    '04.05')
})
