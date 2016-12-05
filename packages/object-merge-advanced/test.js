'use strict'
var mergeAdvanced = require('./index.js')
import test from 'ava'

// !!! There should be two (or more) tests in each, with input args swapped, in order to
// guarantee that there are no sneaky things happening when argument order is backwards

// ==============================
// Normal assignments with default value, false
// ==============================

test('01.01 - simple objects, no key clash', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        a: 'a'
      },
      {
        b: 'b'
      }
    ),
    {
      a: 'a',
      b: 'b'
    },
    '01.01.01')
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b'
      },
      {
        a: 'a'
      }
    ),
    {
      a: 'a',
      b: 'b'
    },
    '01.01.02')
})

test('01.02 - different types, no key clash', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        b: ['b1', 'b2', 'b3'],
        a: 'a'
      },
      {
        d: null,
        c: {c: 'c'}
      }
    ),
    {
      a: 'a',
      b: ['b1', 'b2', 'b3'],
      c: {c: 'c'},
      d: null
    },
    '01.02.01')
  t.deepEqual(
    mergeAdvanced(
      {
        d: null,
        c: {c: 'c'}
      },
      {
        b: ['b1', 'b2', 'b3'],
        a: 'a'
      }
    ),
    {
      a: 'a',
      b: ['b1', 'b2', 'b3'],
      c: {c: 'c'},
      d: null
    },
    '01.02.02')
})

test('01.03 - string vs string value clash', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: 'a'
      },
      {
        a: 'c'
      }
    ),
    {
      a: 'c',
      b: 'b'
    },
    '01.03.01')
  t.deepEqual(
    mergeAdvanced(
      {
        a: 'c'
      },
      {
        b: 'b',
        a: 'a'
      }
    ),
    {
      a: 'a',
      b: 'b'
    },
    '01.03.02')
})

test('01.04 - array vs array value clash', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: ['a']
      },
      {
        a: ['c']
      }
    ),
    {
      a: ['a', 'c'],
      b: 'b'
    },
    '01.04.01')
  t.deepEqual(
    mergeAdvanced(
      {
        a: ['c']
      },
      {
        b: 'b',
        a: ['a']
      }
    ),
    {
      a: ['c', 'a'],
      b: 'b'
    },
    '01.04.02')
})

test('01.05 - object vs object value clash', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        a: {c: 'c'}
      },
      {
        b: 'b',
        a: {a: 'a'}
      }
    ),
    {
      a: {
        c: 'c',
        a: 'a'
      },
      b: 'b'
    },
    '01.05')
})

test('01.06 - array vs empty array', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: ['a1', 'a2']
      },
      {
        a: []
      }
    ),
    {
      a: ['a1', 'a2'],
      b: 'b'
    },
    '01.06.01')
  t.deepEqual(
    mergeAdvanced(
      {
        a: []
      },
      {
        b: 'b',
        a: ['a1', 'a2']
      }
    ),
    {
      a: ['a1', 'a2'],
      b: 'b'
    },
    '01.06.02')
})

test('01.07 - object vs empty array - object wins', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: {x: 'y'}
      },
      {
        a: []
      }
    ),
    {
      a: {x: 'y'},
      b: 'b'
    },
    '01.07.01')
  t.deepEqual(
    mergeAdvanced(
      {
        a: []
      },
      {
        b: 'b',
        a: {x: 'y'}
      }
    ),
    {
      a: {x: 'y'},
      b: 'b'
    },
    '01.07.02')
})

test('01.08 - string vs empty array - string wins', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: 'a'
      },
      {
        a: []
      }
    ),
    {
      a: 'a',
      b: 'b'
    },
    '01.08.01')
  t.deepEqual(
    mergeAdvanced(
      {
        a: []
      },
      {
        b: 'b',
        a: 'a'
      }
    ),
    {
      a: 'a',
      b: 'b'
    },
    '01.08.02')
})

test('01.09 - empty array vs empty array', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: []
      },
      {
        a: []
      }
    ),
    {
      a: [],
      b: 'b'
    },
    '01.09.01')
  t.deepEqual(
    mergeAdvanced(
      {
        a: []
      },
      {
        b: 'b',
        a: []
      }
    ),
    {
      a: [],
      b: 'b'
    },
    '01.09.02')
})

test('01.10 - string vs array', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: ['a']
      },
      {
        a: 'a'
      }
    ),
    {
      a: ['a'],
      b: 'b'
    },
    '01.10.01')
  t.deepEqual(
    mergeAdvanced(
      {
        a: 'a'
      },
      {
        b: 'b',
        a: ['a']
      }
    ),
    {
      a: ['a'],
      b: 'b'
    },
    '01.10.02')
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: 'a'
      },
      {
        a: ['a']
      }
    ),
    {
      a: ['a'],
      b: 'b'
    },
    '01.10.03')
  t.deepEqual(
    mergeAdvanced(
      {
        a: ['a']
      },
      {
        b: 'b',
        a: 'a'
      }
    ),
    {
      a: ['a'],
      b: 'b'
    },
    '01.10.04')
})

test('01.11 - string vs object', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: 'a'
      },
      {
        a: {c: 'c'}
      }
    ),
    {
      a: {c: 'c'},
      b: 'b'
    },
    '01.11.01')
  t.deepEqual(
    mergeAdvanced(
      {
        a: {c: 'c'}
      },
      {
        b: 'b',
        a: 'a'
      }
    ),
    {
      a: {c: 'c'},
      b: 'b'
    },
    '01.11.02')
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: {c: 'c'}
      },
      {
        a: 'a'
      }
    ),
    {
      a: {c: 'c'},
      b: 'b'
    },
    '01.11.03')
  t.deepEqual(
    mergeAdvanced(
      {
        a: 'a'
      },
      {
        b: 'b',
        a: {c: 'c'}
      }
    ),
    {
      a: {c: 'c'},
      b: 'b'
    },
    '01.11.04')
})

test('01.12 - object vs array', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: {
          c: 'c'
        }
      },
      {
        a: ['c']
      }
    ),
    {
      a: ['c'],
      b: 'b'
    },
    '01.12.01')
  t.deepEqual(
    mergeAdvanced(
      {
        a: ['c']
      },
      {
        b: 'b',
        a: {
          c: 'c'
        }
      }
    ),
    {
      a: ['c'],
      b: 'b'
    },
    '01.12.02')
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: ['c']
      },
      {
        a: {
          c: 'c'
        }
      }
    ),
    {
      a: ['c'],
      b: 'b'
    },
    '01.12.03')
  t.deepEqual(
    mergeAdvanced(
      {
        a: {
          c: 'c'
        }
      },
      {
        b: 'b',
        a: ['c']
      }
    ),
    {
      a: ['c'],
      b: 'b'
    },
    '01.12.04')
})

test('01.13 - empty object vs empty array', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: []
      },
      {
        a: {}
      }
    ),
    {
      a: [],
      b: 'b'
    },
    '01.13.01')
  t.deepEqual(
    mergeAdvanced(
      {
        a: {}
      },
      {
        b: 'b',
        a: []
      }
    ),
    {
      a: [],
      b: 'b'
    },
    '01.13.02')
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: {}
      },
      {
        a: []
      }
    ),
    {
      a: [],
      b: 'b'
    },
    '01.13.03')
  t.deepEqual(
    mergeAdvanced(
      {
        a: []
      },
      {
        b: 'b',
        a: {}
      }
    ),
    {
      a: [],
      b: 'b'
    },
    '01.13.04')
})

test('01.14 - empty string vs object', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: ''
      },
      {
        a: {
          c: 'c'
        }
      }
    ),
    {
      a: {
        c: 'c'
      },
      b: 'b'
    },
    '01.14.01')
  t.deepEqual(
    mergeAdvanced(
      {
        a: {
          c: 'c'
        }
      },
      {
        b: 'b',
        a: ''
      }
    ),
    {
      a: {
        c: 'c'
      },
      b: 'b'
    },
    '01.14.02')
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: {
          c: 'c'
        }
      },
      {
        a: ''
      }
    ),
    {
      a: {
        c: 'c'
      },
      b: 'b'
    },
    '01.14.03')
  t.deepEqual(
    mergeAdvanced(
      {
        a: ''
      },
      {
        b: 'b',
        a: {
          c: 'c'
        }
      }
    ),
    {
      a: {
        c: 'c'
      },
      b: 'b'
    },
    '01.14.04')
})

test('01.15 - object values are arrays and get merged', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: [
          {
            c: ['c']
          },
          {
            d: 'd'
          }
        ]
      },
      {
        a: [
          {
            c: 'c'
          },
          {
            d: ['d']
          }
        ]
      }
    ),
    {
      a: [
        {
          c: ['c']
        },
        {
          d: 'd'
        },
        {
          c: 'c'
        },
        {
          d: ['d']
        }
      ],
      b: 'b'
    },
    '01.15.01')
})

test('01.16 - object values are objects and get merged', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: {
          c: 'c',
          d: ['d', 'e', 'f']
        }
      },
      {
        a: {
          c: ['c', 'd', 'e'],
          d: 'd'
        }
      }
    ),
    {
      a: {
        c: ['c', 'd', 'e'],
        d: ['d', 'e', 'f']
      },
      b: 'b'
    },
    '01.16.01')
  t.deepEqual(
    mergeAdvanced(
      {
        a: {
          c: ['c', 'd', 'e'],
          d: 'd'
        }
      },
      {
        b: 'b',
        a: {
          c: 'c',
          d: ['d', 'e', 'f']
        }
      }
    ),
    {
      a: {
        c: ['c', 'd', 'e'],
        d: ['d', 'e', 'f']
      },
      b: 'b'
    },
    '01.16.02')
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: {
          d: 'd',
          c: ['c', 'd', 'e']
        }
      },
      {
        a: {
          d: ['d', 'e', 'f'],
          c: 'c'
        }
      }
    ),
    {
      a: {
        c: ['c', 'd', 'e'],
        d: ['d', 'e', 'f']
      },
      b: 'b'
    },
    '01.16.03')
  t.deepEqual(
    mergeAdvanced(
      {
        a: {
          d: ['d', 'e', 'f'],
          c: 'c'
        }
      },
      {
        b: 'b',
        a: {
          d: 'd',
          c: ['c', 'd', 'e']
        }
      }
    ),
    {
      a: {
        c: ['c', 'd', 'e'],
        d: ['d', 'e', 'f']
      },
      b: 'b'
    },
    '01.16.04')
})

// ==============================
// Edge cases
// ==============================

test('02.01 - missing second arg', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        a: 'a'
      }
    ),
    undefined,
    '02.01')
})

test('02.02 - both args missing', t => {
  t.deepEqual(
    mergeAdvanced(),
    undefined,
    '02.02')
})

test('02.03 - wrong type args - returns undefined', t => {
  t.deepEqual(
    mergeAdvanced(
      null, null
    ),
    undefined,
    '02.03.01')
  t.deepEqual(
    mergeAdvanced(
      undefined, undefined
    ),
    undefined,
    '02.03.02')
  t.deepEqual(
    mergeAdvanced(
      true, false
    ),
    undefined,
    '02.03.03')
  t.deepEqual(
    mergeAdvanced(
      ['a'], ['b']
    ),
    undefined,
    '02.03.04')
  t.deepEqual(
    mergeAdvanced(
      [], []
    ),
    undefined,
    '02.03.05')
})
