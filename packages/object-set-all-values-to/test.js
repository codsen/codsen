'use strict'
var setAllValuesTo = require('./index.js')
import test from 'ava'

// ==============================
// Normal assignments with default value, false
// ==============================

test('01.01 - input simple plain object, default', t => {
  t.deepEqual(
    setAllValuesTo(
      {
        a: 'a',
        b: 'b',
        c: 'c',
        d: 'd'
      }
    ),
    {
      a: false,
      b: false,
      c: false,
      d: false
    },
    '01.01')
})

test('01.02 - two level nested plain object, default', t => {
  t.deepEqual(
    setAllValuesTo(
      {
        a: 'a',
        b: 'b',
        c: 'c',
        d: [
          {
            e: 'e',
            f: 'f'
          }
        ]
      }
    ),
    {
      a: false,
      b: false,
      c: false,
      d: [
        {
          e: false,
          f: false
        }
      ]
    },
    '01.02')
})

test('01.03 - topmost level input is array, default', t => {
  t.deepEqual(
    setAllValuesTo(
      [{
        a: 'a',
        b: 'b',
        c: 'c',
        d: [
          {
            e: 'e',
            f: 'f'
          }
        ]
      }]
    ),
    [{
      a: false,
      b: false,
      c: false,
      d: [
        {
          e: false,
          f: false
        }
      ]
    }],
    '01.03')
})

test('01.04 - many levels of nested arrays, default', t => {
  t.deepEqual(
    setAllValuesTo(
      [[[[[[[[[[[[[[[[[[[[[[{
        a: 'a',
        b: 'b',
        c: 'c',
        d: [
          {
            e: 'e',
            f: 'f'
          }
        ]
      }]]]]]]]]]]]]]]]]]]]]]]
    ),
    [[[[[[[[[[[[[[[[[[[[[[{
      a: false,
      b: false,
      c: false,
      d: [
        {
          e: false,
          f: false
        }
      ]
    }]]]]]]]]]]]]]]]]]]]]]],
    '01.04')
})

test('01.05 - array-object-array-object, default', t => {
  t.deepEqual(
    setAllValuesTo(
      [{
        a: [
          {
            b: 'b'
          }
        ]
      }]
    ),
    [{
      a: [
        {
          b: false
        }
      ]
    }],
    '01.05')
})

test('01.06 - array has array which has object, default', t => {
  t.deepEqual(
    setAllValuesTo(
      [
        [
          {
            a: 'a'
          },
          {
            b: 'b'
          }
        ],
        {
          c: 'c',
          d: [
            { e: 'e' }
          ]
        }
      ]
    ),
    [
      [
        {
          a: false
        },
        {
          b: false
        }
      ],
      {
        c: false,
        d: [
          { e: false }
        ]
      }
    ],
    '01.06')
})

test('01.07 - object has object value, default', t => {
  t.deepEqual(
    setAllValuesTo(
      {
        a: {
          b: {
            c: {
              d: [
                {
                  e: 'e'
                }
              ]
            }
          }
        }
      }
    ),
    {
      a: {
        b: {
          c: {
            d: [
              {
                e: false
              }
            ]
          }
        }
      }
    },
    '01.07')
})

test('01.08 - input is object with only values — arrays, default', t => {
  t.deepEqual(
    setAllValuesTo(
      {
        a: ['a'],
        b: ['b'],
        c: ['c'],
        d: ['d']
      }
    ),
    {
      a: ['a'],
      b: ['b'],
      c: ['c'],
      d: ['d']
    },
    '01.08')
})

test('01.09 - ops within an array, default', t => {
  t.deepEqual(
    setAllValuesTo(
      [
        ['a', { b: 'b' }, 'c']
      ]
    ),
    [
      ['a', { b: false }, 'c']
    ],
    '01.09')
})

test('01.10 - lots of empty things, default', t => {
  t.deepEqual(
    setAllValuesTo(
      [
        {},
        {},
        {},
        {a: 'a'},
        {}
      ]
    ),
    [
      {},
      {},
      {},
      {a: false},
      {}
    ],
    '01.10')
})

// ==============================
// Custom value assignments
// ==============================

test('02.01 - input simple plain object, assigning a string', t => {
  t.deepEqual(
    setAllValuesTo(
      {
        a: 'a',
        b: 'b',
        c: 'c',
        d: 'd'
      },
      'x'
    ),
    {
      a: 'x',
      b: 'x',
      c: 'x',
      d: 'x'
    },
    '02.01')
})

test('02.02 - input simple plain object, assigning a plain object', t => {
  t.deepEqual(
    setAllValuesTo(
      {
        a: 'a',
        b: 'b',
        c: 'c',
        d: 'd'
      },
      { x: 'x' }
    ),
    {
      a: { x: 'x' },
      b: { x: 'x' },
      c: { x: 'x' },
      d: { x: 'x' }
    },
    '02.02')
})

test('02.03 - input simple plain object, assigning an array', t => {
  t.deepEqual(
    setAllValuesTo(
      {
        a: 'a',
        b: 'b',
        c: 'c',
        d: 'd'
      },
      ['z', 'y']
    ),
    {
      a: ['z', 'y'],
      b: ['z', 'y'],
      c: ['z', 'y'],
      d: ['z', 'y']
    },
    '02.03')
})

test('02.04 - input simple plain object, assigning a null', t => {
  t.deepEqual(
    setAllValuesTo(
      {
        a: 'a',
        b: 'b',
        c: 'c',
        d: 'd'
      },
      null
    ),
    {
      a: null,
      b: null,
      c: null,
      d: null
    },
    '02.04')
})

test('02.05 - input simple plain object, assigning a Boolean true', t => {
  t.deepEqual(
    setAllValuesTo(
      {
        a: 'a',
        b: 'b',
        c: 'c',
        d: 'd'
      },
      true
    ),
    {
      a: true,
      b: true,
      c: true,
      d: true
    },
    '02.05')
})

test('02.06 - input simple plain object, assigning a function', t => {
  var f = function () {
    console.log('works')
  }
  t.deepEqual(
    setAllValuesTo(
      [[{
        a: 'a',
        b: 'b',
        c: 'c',
        d: 'd'
      }],
        { x: 'x' }
      ],
      f
    ),
    [[{
      a: f,
      b: f,
      c: f,
      d: f
    }],
      { x: f }
    ],
    '02.06')
})

// ==============================
// Edge cases
// ==============================

test('03.01 - input is string, default value', t => {
  t.deepEqual(
    setAllValuesTo(
      'nothing'
    ),
    'nothing',
    '03.01')
})

test('03.02 - input is string, value provided', t => {
  t.deepEqual(
    setAllValuesTo(
      'nothing',
      'something'
    ),
    'nothing',
    '03.02')
})

test('03.03 - input is missing', t => {
  t.deepEqual(
    setAllValuesTo(),
    undefined,
    '03.03')
})

test('03.04 - input is missing but value provided', t => {
  t.deepEqual(
    setAllValuesTo(undefined, 'a'),
    undefined,
    '03.04')
})
