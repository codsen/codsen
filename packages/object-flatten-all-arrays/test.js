'use strict'
var flattenAllArrays = require('./index.js')
import test from 'ava'

// ==============================
// Normal use
// ==============================

test('01.01 - simple plain object, one array', t => {
  t.deepEqual(
    flattenAllArrays(
      {
        d: 'd',
        b: 'b',
        a: 'a',
        c: [
          {
            b: 'b',
            a: 'a'
          },
          {
            d: 'd',
            c: 'c'
          }
        ]
      }
    ),
    {
      a: 'a',
      b: 'b',
      c: [
        {
          a: 'a',
          b: 'b',
          c: 'c',
          d: 'd'
        }
      ],
      d: 'd'
    },
    '01.01')
})

test('01.02 - simple plain object, two arrays', t => {
  t.deepEqual(
    flattenAllArrays(
      {
        d: 'd',
        b: [
          {
            b: 'b'
          },
          {
            a: 'a'
          },
          {
            c: 'c'
          }
        ],
        a: 'a',
        c: [
          {
            d: 'd',
            c: 'c'
          },
          {
            b: 'b',
            a: 'a'
          }
        ]
      }
    ),
    {
      d: 'd',
      b: [
        {
          a: 'a',
          b: 'b',
          c: 'c'
        }
      ],
      a: 'a',
      c: [
        {
          a: 'a',
          b: 'b',
          c: 'c',
          d: 'd'
        }
      ]
    },
    '01.02')
})

test('01.03 - nested simple plain object, one array', t => {
  t.deepEqual(
    flattenAllArrays(
      [{
        d: 'd',
        b: 'b',
        a: 'a',
        c: [
          {
            b: 'b',
            a: 'a'
          },
          {
            d: 'd',
            c: 'c'
          }
        ]
      }]
    ),
    [{
      a: 'a',
      b: 'b',
      c: [
        {
          a: 'a',
          b: 'b',
          c: 'c',
          d: 'd'
        }
      ],
      d: 'd'
    }],
    '01.03')
})

test('01.04 - nested objects', t => {
  t.deepEqual(
    flattenAllArrays(
      [
        'z',
        {
          b: 'b',
          a: 'a'
        },
        {
          d: 'd',
          c: 'c'
        },
        'z'
      ]
    ),
    [
      'z',
      {
        a: 'a',
        b: 'b'
      },
      {
        c: 'c',
        d: 'd'
      },
      'z'
    ],
    '01.04')
})

test('01.05 - multiple nested arrays', t => {
  t.deepEqual(
    flattenAllArrays(
      [[[[[[[[{
        d: 'd',
        b: 'b',
        a: 'a',
        c: [
          {
            b: 'b',
            a: 'a'
          },
          {
            d: 'd',
            c: 'c'
          }
        ]
      }]]]]]]]]
    ),
    [[[[[[[[{
      a: 'a',
      b: 'b',
      c: [
        {
          a: 'a',
          b: 'b',
          c: 'c',
          d: 'd'
        }
      ],
      d: 'd'
    }]]]]]]]],
    '01.05')
})

test('01.06 - array contents are not of the same type', t => {
  t.deepEqual(
    flattenAllArrays(
      {
        d: 'd',
        b: 'b',
        a: 'a',
        c: [
          {
            b: 'b',
            a: 'a'
          },
          {
            d: 'd',
            c: 'c'
          },
          'z'
        ]
      }
    ),
    {
      d: 'd',
      b: 'b',
      a: 'a',
      c: [
        {
          a: 'a',
          b: 'b',
          c: 'c',
          d: 'd'
        },
        'z'
      ]
    },
    '01.06')
})

test('01.07 - multiple types in an array', t => {
  t.deepEqual(
    flattenAllArrays(
      {
        d: 'd',
        b: 'b',
        a: 'a',
        c: [
          ['y', {z: 'z'}],
          {
            b: 'b',
            a: 'a'
          },
          {
            d: 'd',
            c: 'c'
          },
          'z'
        ]
      }
    ),
    {
      a: 'a',
      b: 'b',
      c: [
        {
          a: 'a',
          b: 'b',
          c: 'c',
          d: 'd'
        },
        ['y', {z: 'z'}],
        'z'
      ],
      d: 'd'
    },
    '01.07')
})

// ==============================
// Edge cases
// ==============================

test('02.01 - empty object as input', t => {
  t.deepEqual(
    flattenAllArrays(
      {}
    ),
    {},
    '02.01')
})

test('02.02 - empty array as input', t => {
  t.deepEqual(
    flattenAllArrays(
      []
    ),
    [],
    '02.02')
})

test('02.03 - empty string as input', t => {
  t.deepEqual(
    flattenAllArrays(
      ''
    ),
    '',
    '02.03')
})

test('02.04 - null as input', t => {
  t.deepEqual(
    flattenAllArrays(
      null
    ),
    null,
    '02.04')
})

test('02.05 - undefined as input', t => {
  t.deepEqual(
    flattenAllArrays(
      undefined
    ),
    undefined,
    '02.05')
})

test('02.06 - nothing in the input', t => {
  t.deepEqual(
    flattenAllArrays(),
    undefined,
    '02.06')
})

// ==============================
// Does not mutate input args
// ==============================

var obj = {
  d: 'd',
  b: 'b',
  a: 'a',
  c: [
    {
      b: 'b',
      a: 'a'
    },
    {
      d: 'd',
      c: 'c'
    }
  ]
}
var unneededResult = flattenAllArrays(obj)

test('03.01 - does not mutate input args', t => {
  t.pass(unneededResult)
  t.deepEqual(
    obj,
    {
      d: 'd',
      b: 'b',
      a: 'a',
      c: [
        {
          b: 'b',
          a: 'a'
        },
        {
          d: 'd',
          c: 'c'
        }
      ]
    },
    '03.01')
})
