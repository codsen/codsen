'use strict'
var mergeAdvanced = require('./index')
// var existy = require('./util').existy
// var isBool = require('./util').isBool
// var sortObject = require('./util').sortObject
// var nonEmpty = require('./util').nonEmpty
var equalOrSubsetKeys = require('./util').equalOrSubsetKeys
var clone = require('lodash.clonedeep')

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

test('01.17 - merging booleans', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        a: [
          {
            b: false
          }
        ]
      },
      {
        a: false
      }
    ),
    {
      a: [
        {
          b: false
        }
      ]
    },
    '01.17.01')
  t.deepEqual(
    mergeAdvanced(
      {
        a: false
      },
      {
        a: [
          {
            b: false
          }
        ]
      }
    ),
    {
      a: [
        {
          b: false
        }
      ]
    },
    '01.17.02')
})

test('01.18 - merging undefined', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        a: undefined
      },
      {
        a: 'a'
      }
    ),
    {
      a: 'a'
    },
    '01.18.01')
  t.deepEqual(
    mergeAdvanced(
      {
        a: 'a'
      },
      {
        a: undefined
      }
    ),
    {
      a: 'a'
    },
    '01.18.02')
})

test('01.19 - merging null', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        a: null
      },
      {
        a: 'a'
      }
    ),
    {
      a: 'a'
    },
    '01.19.01')
  t.deepEqual(
    mergeAdvanced(
      {
        a: 'a'
      },
      {
        a: null
      }
    ),
    {
      a: 'a'
    },
    '01.19.02')
})

test('01.20 - boolean vs boolean merge (#61)', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: true
      },
      {
        a: false
      }
    ),
    {
      a: true,
      b: 'b'
    },
    '01.20.01')
  t.deepEqual(
    mergeAdvanced(
      {
        a: false
      },
      {
        b: 'b',
        a: true
      }
    ),
    {
      a: true,
      b: 'b'
    },
    '01.20.02')
})

test('01.21 - boolean vs undefined merge (#62)', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: true
      },
      {
        a: undefined
      }
    ),
    {
      a: true,
      b: 'b'
    },
    '01.21.01')
  t.deepEqual(
    mergeAdvanced(
      {
        a: undefined
      },
      {
        b: 'b',
        a: true
      }
    ),
    {
      a: true,
      b: 'b'
    },
    '01.21.02')
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: false
      },
      {
        a: undefined
      }
    ),
    {
      a: false,
      b: 'b'
    },
    '01.21.03')
  t.deepEqual(
    mergeAdvanced(
      {
        a: undefined
      },
      {
        b: 'b',
        a: false
      }
    ),
    {
      a: false,
      b: 'b'
    },
    '01.21.04')
})

test('01.22 - null vs empty object merge (#74)', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: {}
      },
      {
        a: null
      }
    ),
    {
      a: {},
      b: 'b'
    },
    '01.22.01')
  t.deepEqual(
    mergeAdvanced(
      {
        a: null
      },
      {
        b: 'b',
        a: {}
      }
    ),
    {
      a: {},
      b: 'b'
    },
    '01.22.02')
})

test('01.23 - null vs. undefined (#80)', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: null
      },
      {
        a: undefined
      }
    ),
    {
      a: null,
      b: 'b'
    },
    '01.23.01')
  t.deepEqual(
    mergeAdvanced(
      {
        a: undefined
      },
      {
        b: 'b',
        a: null
      }
    ),
    {
      a: null,
      b: 'b'
    },
    '01.23.02')
})

var f = function () {
  return null
}
test('01.24 - no clash, just filling missing values', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b'
      },
      {
        a: f
      }
    ),
    {
      a: f,
      b: 'b'
    },
    '01.24.01')
  t.deepEqual(
    mergeAdvanced(
      {
        a: f
      },
      {
        b: 'b'
      }
    ),
    {
      a: f,
      b: 'b'
    },
    '01.24.02')
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
    {
      a: 'a'
    },
    '02.01')
})

test('02.02 - missing first arg', t => {
  t.deepEqual(
    mergeAdvanced(
      undefined,
      {
        a: 'a'
      }
    ),
    {
      a: 'a'
    },
    '02.02.01')
  t.deepEqual(
    mergeAdvanced(
      null,
      {
        a: 'a'
      }
    ),
    {
      a: 'a'
    },
    '02.02.02')
})

test('02.03 - both args missing', t => {
  t.deepEqual(
    mergeAdvanced(),
    undefined,
    '02.03')
})

test('02.04 - wrong type args - returns undefined', t => {
  t.deepEqual(
    mergeAdvanced(
      null, null
    ),
    undefined,
    '02.04.01')
  t.deepEqual(
    mergeAdvanced(
      undefined, undefined
    ),
    undefined,
    '02.04.02')
  t.deepEqual(
    mergeAdvanced(
      true, false
    ),
    undefined,
    '02.04.03')
  t.deepEqual(
    mergeAdvanced(
      ['a'], ['b']
    ),
    undefined,
    '02.04.04')
  t.deepEqual(
    mergeAdvanced(
      [], []
    ),
    undefined,
    '02.04.05')
})

test('02.05 - third arg is not a plain object - throws', t => {
  t.throws(function () {
    mergeAdvanced(
      {a: 'a'},
      {b: 'b'},
      'c'
    )
  })
})

// ==============================
// Input argument mutation
// ==============================

var obj1 = {
  a: 'a',
  b: 'b'
}

var originalObj1 = clone(obj1)

var obj2 = {
  c: 'c',
  d: 'd'
}

mergeAdvanced(obj1, obj2)

test('03.01 - testing for mutation of the input args', t => {
  t.deepEqual(obj1, originalObj1)
})

// ================================================
// does not introduce non-unique values into arrays
// ================================================

test('04.01 - arrays, checking against dupes being added', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        b: 'b',
        a: [
          {
            x1: 'x1',
            x2: 'x2',
            x3: 'x3'
          },
          {
            y1: 'y1',
            y2: 'y2'
          }
        ]
      },
      {
        a: [
          {
            x1: 'x1'
          },
          {
            y1: 'y1',
            y2: 'y2'
          }
        ]
      }
    ),
    {
      a: [
        {
          x1: 'x1',
          x2: 'x2',
          x3: 'x3'
        },
        {
          y1: 'y1',
          y2: 'y2'
        }
      ],
      b: 'b'
    },
    '04.01.01')
  t.deepEqual(
    mergeAdvanced(
      {
        a: [
          {
            x1: 'x1',
            x2: 'x2',
            x3: 'x3'
          },
          {
            y1: 'y1',
            y2: 'y2'
          }
        ],
        b: 'b'
      },
      {
        a: [
          {
            x1: 'x1'
          },
          {
            y1: 'y1',
            y2: 'y2'
          }
        ]
      }
    ),
    {
      a: [
        {
          x1: 'x1',
          x2: 'x2',
          x3: 'x3'
        },
        {
          y1: 'y1',
          y2: 'y2'
        }
      ],
      b: 'b'
    },
    '04.01.02')
})

// ================================================
// does not introduce non-unique values into arrays
// ================================================

test('05.01 - merges objects within arrays if keyset and position within array matches', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        a: [
          {
            b: 'b1',
            c: 'c1'
          },
          {
            x: 'x1',
            y: 'y1'
          }
        ]
      },
      {
        a: [
          {
            b: 'b2',
            c: 'c2'
          },
          {
            x: 'x2',
            y: 'y2'
          }
        ]
      }
    ),
    {
      a: [
        {
          b: 'b2',
          c: 'c2'
        },
        {
          x: 'x2',
          y: 'y2'
        }
      ]
    },
    '05.01.01')
})

test('05.02 - concats instead if objects within arrays are in a wrong order', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        a: [
          {
            x: 'x1',
            y: 'y1'
          },
          {
            b: 'b1',
            c: 'c1'
          }
        ]
      },
      {
        a: [
          {
            b: 'b2',
            c: 'c2'
          },
          {
            x: 'x2',
            y: 'y2'
          }
        ]
      }
    ),
    {
      a: [
        {
          x: 'x1',
          y: 'y1'
        },
        {
          b: 'b2',
          c: 'c2'
        },
        {
          b: 'b1',
          c: 'c1'
        },
        {
          x: 'x2',
          y: 'y2'
        }
      ]
    },
    '05.02')
})

test('05.03 - concats instead if objects within arrays are in a wrong order', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        a: [
          {
            b: 'b1',
            c: 'c1'
          },
          {
            n: 'n1',
            m: 'm1'
          },
          {
            x: 'x1',
            y: 'y1'
          }
        ]
      },
      {
        a: [
          {
            b: 'b2',
            c: 'c2'
          },
          {
            x: 'x2',
            y: 'y2'
          }
        ]
      }
    ),
    {
      a: [
        {
          b: 'b2',
          c: 'c2'
        },
        {
          n: 'n1',
          m: 'm1'
        },
        {
          x: 'x2',
          y: 'y2'
        },
        {
          x: 'x1',
          y: 'y1'
        }
      ]
    },
    '05.03')
})

test('05.04 - merges objects within arrays, key sets are a subset of one another', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        a: [
          {
            b: 'b1'
          },
          {
            x: 'x1',
            y: 'y1'
          }
        ]
      },
      {
        a: [
          {
            b: 'b2',
            c: 'c2'
          },
          {
            x: 'x2'
          }
        ]
      }
    ),
    {
      a: [
        {
          b: 'b2',
          c: 'c2'
        },
        {
          x: 'x2',
          y: 'y1'
        }
      ]
    },
    '05.04')
})

test('05.05 - merges objects within arrays, subset and no match, mixed case', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        a: [
          {
            c: 'c1'
          },
          {
            x: 'x1',
            y: 'y1'
          }
        ]
      },
      {
        a: [
          {
            b: 'b2',
            c: 'c2'
          },
          {
            m: 'm3',
            n: 'n3'
          }
        ]
      }
    ),
    {
      a: [
        {
          b: 'b2',
          c: 'c2'
        },
        {
          x: 'x1',
          y: 'y1'
        },
        {
          m: 'm3',
          n: 'n3'
        }
      ]
    },
    '05.05')
})

test('05.06 - opts.mergeObjectsOnlyWhenKeysetMatches', t => {
  t.deepEqual(
    mergeAdvanced(
      {
        a: [
          {
            a: 'a',
            b: 'b'
          },
          {
            c: 'c',
            d: 'd'
          }
        ]
      },
      {
        a: [
          {
            k: 'k',
            l: 'l'
          },
          {
            m: 'm',
            n: 'n'
          }
        ]
      }
    ),
    {
      a: [
        {
          a: 'a',
          b: 'b'
        },
        {
          k: 'k',
          l: 'l'
        },
        {
          c: 'c',
          d: 'd'
        },
        {
          m: 'm',
          n: 'n'
        }
      ]
    },
    '05.06.01 - mergeObjectsOnlyWhenKeysetMatches = default')
  t.deepEqual(
    mergeAdvanced(
      {
        a: [
          {
            a: 'a',
            b: 'b'
          },
          {
            c: 'c',
            d: 'd'
          }
        ]
      },
      {
        a: [
          {
            k: 'k',
            l: 'l'
          },
          {
            m: 'm',
            n: 'n'
          }
        ]
      },
      {
        mergeObjectsOnlyWhenKeysetMatches: true
      }
    ),
    {
      a: [
        {
          a: 'a',
          b: 'b'
        },
        {
          k: 'k',
          l: 'l'
        },
        {
          c: 'c',
          d: 'd'
        },
        {
          m: 'm',
          n: 'n'
        }
      ]
    },
    '05.06.02 - mergeObjectsOnlyWhenKeysetMatches = true')
  t.deepEqual(
    mergeAdvanced(
      {
        a: [
          {
            a: 'a',
            b: 'b'
          },
          {
            c: 'c',
            d: 'd'
          }
        ]
      },
      {
        a: [
          {
            k: 'k',
            l: 'l'
          },
          {
            m: 'm',
            n: 'n'
          }
        ]
      },
      {
        mergeObjectsOnlyWhenKeysetMatches: false
      }
    ),
    {
      a: [
        {
          a: 'a',
          b: 'b',
          k: 'k',
          l: 'l'
        },
        {
          c: 'c',
          d: 'd',
          m: 'm',
          n: 'n'
        }
      ]
    },
    '05.06.03 - mergeObjectsOnlyWhenKeysetMatches = false')
})

test('05.07 - README example: opts.mergeObjectsOnlyWhenKeysetMatches', t => {
  var obj1 = {
    a: [
      {
        a: 'a',
        b: 'b',
        yyyy: 'yyyy'
      }
    ]
  }

  var obj2 = {
    a: [
      {
        xxxx: 'xxxx',
        b: 'b',
        c: 'c'
      }
    ]
  }

  t.deepEqual(
    mergeAdvanced(
      obj1, obj2
    ),
    {
      a: [
        {
          a: 'a',
          b: 'b',
          yyyy: 'yyyy'
        },
        {
          xxxx: 'xxxx',
          b: 'b',
          c: 'c'
        }
      ]
    },
    '05.07.01')

  t.deepEqual(
    mergeAdvanced(
      obj1, obj2, { mergeObjectsOnlyWhenKeysetMatches: false }
    ),
    {
      a: [
        {
          a: 'a',
          b: 'b',
          yyyy: 'yyyy',
          xxxx: 'xxxx',
          c: 'c'
        }
      ]
    },
    '05.07.02')
})

// ============================================================
//                   U T I L   T E S T S
// ============================================================

//                           ____
//          massive hammer  |    |
//        O=================|    |
//          upon all bugs   |____|
//
//                         .=O=.

// ==============================
// util/equalOrSubsetKeys()
// ==============================

test('99.01 - equalOrSubsetKeys - two equal plain objects', t => {
  t.truthy(
    equalOrSubsetKeys(
      {
        a: 'ccc',
        b: 'zzz'
      },
      {
        a: 'ddd',
        b: 'yyy'
      }
    ),
    '99.01')
})

test('99.02 - equalOrSubsetKeys - first is a subset of the second', t => {
  t.truthy(
    equalOrSubsetKeys(
      {
        a: 'ccc'
      },
      {
        a: 'ddd',
        b: 'b'
      }
    ),
    '99.02.01')
  t.truthy(
    equalOrSubsetKeys(
      {
        a: ['ccc']
      },
      {
        a: ['ddd'],
        b: ['b']
      }
    ),
    '99.02.02')
})

test('99.03 - equalOrSubsetKeys - second is a subset of the first', t => {
  t.truthy(
    equalOrSubsetKeys(
      {
        a: 'a',
        b: 'ccc'
      },
      {
        b: 'ddd'
      }
    ),
    '99.03')
  t.truthy(
    equalOrSubsetKeys(
      {
        a: ['a'],
        b: ['ccc']
      },
      {
        b: ['ddd']
      }
    ),
    '99.03')
})

test('99.04 - equalOrSubsetKeys - empty object is a subset', t => {
  t.truthy(
    equalOrSubsetKeys(
      {
        a: 'a',
        b: 'ccc'
      },
      {}
    ),
    '99.04.01')
  t.truthy(
    equalOrSubsetKeys(
      {},
      {
        b: ['ddd']
      }
    ),
    '99.04.02')
})

test('99.05 - first input is not an object - throws', t => {
  t.throws(function () {
    equalOrSubsetKeys('z')
  })
})

test('99.06 - first input is missing - throws', t => {
  t.throws(function () {
    equalOrSubsetKeys()
  })
})

test('99.07 - second input is not an object - throws', t => {
  t.throws(function () {
    equalOrSubsetKeys({a: 'a'}, 'z')
  })
})
