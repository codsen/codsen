'use strict'

import checkTypes from './index'
import test from 'ava'

test('01.01 - throws when all/first arg\'s missing', t => {
  t.throws(function () {
    checkTypes()
  }, 'check-types-mini/checkTypes(): [THROW_ID_01] missing first two arguments!')
})

test('01.02 - throws when second arg\'s missing', t => {
  t.throws(function () {
    checkTypes('zzzz')
  }, 'check-types-mini/checkTypes(): [THROW_ID_02] missing second argument!')
})

test('01.03 - throws when one of the arguments is of a wrong type', t => {
  t.throws(function () {
    checkTypes(
      {
        option1: 'setting1',
        option2: 'false',
        option3: false
      },
      {
        option1: 'setting1',
        option2: false,
        option3: false
      }
    )
  }, 'opts.option2 was customised to "false" which is not boolean but string')
})

test('01.04 - opts.msg or opts.optsVarName args are wrong-type', t => {
  t.throws(function () {
    checkTypes(
      {
        option1: 'setting1',
        option2: 'setting2',
        option3: false
      },
      {
        option1: 'setting1',
        option2: 'setting2',
        option3: false
      },
      {
        msg: 'zzz',
        optsVarName: 1
      }
    )
  })
  t.throws(function () {
    checkTypes(
      {
        option1: 'setting1',
        option2: 'setting2',
        option3: false
      },
      {
        option1: 'setting1',
        option2: 'setting2',
        option3: false
      },
      {
        msg: 1,
        optsVarName: 'zzz'
      }
    )
  })
})

test('01.05 - throws if fourth argument is missing', t => {
  t.throws(function () {
    checkTypes(
      {
        option1: 'setting1',
        option2: 'false',
        option3: false
      },
      {
        option1: 'setting1',
        option2: false,
        option3: false
      },
      {
        msg: 'newLibrary/index.js: [THROW_ID_01]' // << no trailing space
      }
    )
  },
    'newLibrary/index.js: [THROW_ID_01] opts.option2 was customised to "false" which is not boolean but string'
  )
  t.throws(function () {
    checkTypes(
      {
        option1: 'setting1',
        option2: 'false',
        option3: false
      },
      {
        option1: 'setting1',
        option2: false,
        option3: false
      },
      {
        msg: 'newLibrary/index.js: [THROW_ID_01] ' // << trailing space
      }
    )
  },
    'newLibrary/index.js: [THROW_ID_01] opts.option2 was customised to "false" which is not boolean but string'
  )
  t.notThrows(function () {
    checkTypes(
      {
        option1: 'setting1',
        option2: 'false',
        option3: false
      },
      {
        option1: 'setting1',
        option2: false,
        option3: false
      },
      {
        msg: 'newLibrary/index.js: [THROW_ID_01] ',
        ignoreKeys: ['option2']
      }
    )
  })
})

test('01.06 - throws when opts are set wrong', t => {
  t.throws(function () {
    checkTypes(
      {a: 'a'},
      {a: 'b'},
      {
        msg: 'aa',
        optsVarName: 'bbb',
        ignoreKeys: false
      }
    )
  },
  'check-types-mini/checkTypes(): [THROW_ID_03] opts.ignoreKeys should be an array, currently it\'s: boolean')
  t.notThrows(function () {
    checkTypes({a: 'a'}, {a: 'b'},
      {
        msg: 'aa',
        optsVarName: 'bbb',
        ignoreKeys: 'a'
      }
    )
  })
  t.notThrows(function () {
    checkTypes({a: 'a'}, {a: 'b'},
      {
        msg: 'aa',
        optsVarName: 'bbb',
        ignoreKeys: ''
      }
    )
  })
})

// ======================
// 02. Arrays
// ======================

test('02.01 - opts.acceptArrays, strings+arrays', t => {
  t.throws(function () {
    checkTypes(
      {
        option1: 'setting1',
        option2: ['setting3', 'setting4'],
        option3: false
      },
      {
        option1: 'setting1',
        option2: 'setting2',
        option3: false
      }
    )
  })
  t.notThrows(function () {
    checkTypes(
      {
        option1: 'setting1',
        option2: ['setting3', 'setting4'],
        option3: false
      },
      {
        option1: 'setting1',
        option2: 'setting2',
        option3: false
      },
      {
        msg: 'message',
        optsVarName: 'varname',
        acceptArrays: true
      }
    )
  })
  t.throws(function () {
    checkTypes(
      {
        option1: 'setting1',
        option2: ['setting3', true, 'setting4'],
        option3: false
      },
      {
        option1: 'setting1',
        option2: 'setting2',
        option3: false
      },
      {
        msg: 'message',
        optsVarName: 'varname',
        acceptArrays: true
      }
    )
  })
})

test('02.02 - opts.acceptArrays, Booleans+arrays', t => {
  t.throws(function () {
    checkTypes(
      {
        option1: 'setting1',
        option2: [true, true],
        option3: false
      },
      {
        option1: 'setting1',
        option2: false,
        option3: false
      }
    )
  })
  t.notThrows(function () {
    checkTypes(
      {
        option1: 'setting1',
        option2: [true, true],
        option3: false
      },
      {
        option1: 'setting1',
        option2: false,
        option3: false
      },
      {
        msg: 'message',
        optsVarName: 'varname',
        acceptArrays: true
      }
    )
  })
  t.throws(function () {
    checkTypes(
      {
        option1: 'setting1',
        option2: [true, true, 1],
        option3: false
      },
      {
        option1: 'setting1',
        option2: false,
        option3: false
      },
      {
        msg: 'message',
        optsVarName: 'varname',
        acceptArrays: true
      }
    )
  })
  t.throws(function () {
    checkTypes(
      {
        option1: [1, 0, 1, 0],
        option2: [true, true],
        option3: false
      },
      {
        option1: 0,
        option2: false,
        option3: false
      },
      {
        msg: 'test: [THROW_ID_01]',
        optsVarName: 'opts',
        acceptArrays: 'this string will cause the throw',
        acceptArraysIgnore: []
      }
    )
  })
})

test('02.03 - opts.acceptArraysIgnore', t => {
  t.notThrows(function () {
    checkTypes(
      {
        option1: [1, 0, 1, 0],
        option2: [true, true],
        option3: false
      },
      {
        option1: 0,
        option2: false,
        option3: false
      },
      {
        msg: 'test: [THROW_ID_01]',
        optsVarName: 'opts',
        acceptArrays: true,
        acceptArraysIgnore: []
      }
    )
  })
  t.throws(function () {
    checkTypes(
      {
        option1: [1, 0, 1, 0],
        option2: [true, true],
        option3: false
      },
      {
        option1: 0,
        option2: false,
        option3: false
      },
      {
        msg: 'test: [THROW_ID_01]',
        optsVarName: 'opts',
        acceptArrays: true,
        acceptArraysIgnore: ['zzz', 'option1']
      }
    )
  })
  t.throws(function () {
    checkTypes(
      {
        option1: [1, 0, 1, 0],
        option2: [true, true],
        option3: false
      },
      {
        option1: 0,
        option2: false,
        option3: false
      },
      {
        msg: 'test: [THROW_ID_01]',
        optsVarName: 'opts',
        acceptArrays: false,
        acceptArraysIgnore: ['zzz', 'option1']
      }
    )
  })
  t.throws(function () {
    checkTypes(
      {
        option1: [1, 0, 1, 0],
        option2: [true, true],
        option3: false
      },
      {
        option1: 0,
        option2: false,
        option3: false
      },
      {
        msg: 'test: [THROW_ID_01]',
        optsVarName: 'opts',
        acceptArrays: true,
        acceptArraysIgnore: true
      }
    )
  })
})

test('02.05 - involving null values', t => {
  t.throws(function () {
    checkTypes(
      {
        'key': 1,
        'val': null,
        'cleanup': true
      },
      {
        'key': null,
        'val': null,
        'cleanup': true
      }
    )
  })
})

test('02.06 - throws/notThrows when keysets mismatch', t => {
  t.throws(function () {
    checkTypes(
      {
        'key': null,
        'val': null,
        'cleanup': true
      },
      {
        'key': null,
        'val': null
      }
    )
  })
  t.throws(function () {
    checkTypes(
      {
        'key': null,
        'val': null
      },
      {
        'key': null,
        'val': null,
        'cleanup': true
      }
    )
  })
  t.notThrows(function () {
    checkTypes(
      {
        'key': null,
        'val': null,
        'cleanup': true
      },
      {
        'key': null,
        'val': null
      },
      {
        enforceStrictKeyset: false
      }
    )
  })
  t.notThrows(function () {
    checkTypes(
      {
        'key': null,
        'val': null
      },
      {
        'key': null,
        'val': null,
        'cleanup': true
      },
      {
        enforceStrictKeyset: false
      }
    )
  })
})

test('02.07 - opts.enforceStrictKeyset set to a wrong thing', t => {
  t.throws(function () {
    checkTypes(
      {
        'key': 1,
        'val': null,
        'cleanup': true
      },
      {
        'key': null,
        'val': null,
        'cleanup': true
      },
      {
        enforceStrictKeyset: 1
      }
    )
  })
})

test('02.08 - throws when reference and schema are both missing', t => {
  t.throws(function () {
    checkTypes(
      {
        'key': 1,
        'val': null,
        'cleanup': true
      },
      {}
    )
  })
})

// ======================
// 03. opts.enforceStrictKeyset
// ======================

test('03.01 - opts.acceptArrays, strings+arrays', t => {
  t.throws(function () {
    checkTypes(
      {
        option1: 'setting1',
        option2: 'setting2',
        rogueKey: false
      },
      {
        option1: 'zz',
        option2: 'yy'
      }
    )
  })
  t.notThrows(function () {
    checkTypes(
      {
        option1: 'setting1',
        option2: 'setting2',
        rogueKey: false
      },
      {
        option1: 'zz',
        option2: 'yy'
      },
      {
        enforceStrictKeyset: false
      }
    )
  })
})

// ======================
// 04. opts.schema
// ======================

test('04.01 - opts.schema only', t => {
  t.throws(function () {
    checkTypes(
      {
        option1: 'setting1',
        option2: null
      },
      {
        option1: 'zz',
        option2: 'yy'
      }
    )
  })
  t.notThrows(function () {
    checkTypes(
      {
        option1: 'setting1',
        option2: null
      },
      {
        option1: 'zz',
        option2: 'yy'
      },
      {
        schema: {
          option2: ['stRing', null]
        }
      }
    )
  })
  t.throws(function () {
    checkTypes(
      {
        option1: 'setting1',
        option2: null
      },
      {
        option1: 'zz',
        option2: 'yy'
      },
      {
        schema: {
          option2: ['string', 'boolean']
        }
      }
    )
  })
  t.notThrows(function () {
    checkTypes(
      {
        option1: 'setting1',
        option2: null
      },
      null, // << reference object is completely omitted!!!
      {
        schema: {
          option1: 'String',
          option2: ['stRing', null]
        }
      }
    )
  })
  t.throws(function () {
    checkTypes(
      {
        option1: 'setting1',
        option2: null
      },
      null,
      {
        schema: { // <<< notice how option1 is missing AND also missing in reference obj
          option2: ['stRing', null]
        }
      }
    )
  })
})

test('04.02 - opts.schema values as strings + "whatever" keys', t => {
  t.throws(function () {
    checkTypes(
      {
        option1: {a: 'setting1'},
        option2: null
      },
      {
        option1: 'zz',
        option2: 'yy'
      }
    )
  })
  t.notThrows(function () {
    checkTypes(
      {
        option1: {a: 'setting1'},
        option2: null
      },
      {
        option1: 'zz',
        option2: 'yy'
      },
      {
        schema: {
          option1: ['object', 'string'],
          option2: ['whatever']
        }
      }
    )
  })
  t.notThrows(function () {
    checkTypes(
      {
        option1: {a: 'setting1'},
        option2: null
      },
      {
        option1: 'zz',
        option2: 'yy'
      },
      {
        schema: {
          option1: 'object', // << observe it's a string, not an array
          option2: ['whatever']
        }
      }
    )
  })
  t.throws(function () {
    checkTypes(
      {
        option1: {a: 'setting1'},
        option2: null
      },
      {
        option1: 'zz',
        option2: 'yy'
      },
      {
        schema: {
          option1: 'string', // << will throw because this type is not followed
          option2: ['whatever']
        }
      }
    )
  })
  t.notThrows(function () {
    checkTypes(
      {
        option1: {a: 'setting1'},
        option2: null
      },
      {
        option1: 'zz',
        option2: 'yy'
      },
      {
        schema: {
          option1: ['string', 'any'], // <<< observe how "any" is among other types
          option2: 'whatever' // also observe that it's not an array. Should work anyway!
        }
      }
    )
  })
})

test('04.03 - opts.schema falling back to reference object', t => {
  // with throwing consequences:
  t.throws(function () {
    checkTypes(
      {
        option1: {a: 'setting1'},
        option2: null
      },
      {
        option1: 'zz',
        option2: 'yy'
      },
      {
        schema: {
          option1: 'number'
        }
      }
    )
  })
  // without throwing consequences:
  t.notThrows(function () {
    checkTypes(
      {
        option1: {a: 'setting1'},
        option2: 'zz'
      },
      {
        option1: {ww: 'zz'},
        option2: 'yy'
      },
      {
        schema: {
          option99: 'number' // << that's useless, so falls back to reference object
        }
      }
    )
  })
})

test('04.04 - opts.schema is set to a wrong thing - throws', t => {
  t.throws(function () {
    checkTypes(
      {
        option1: {a: 'setting1'},
        option2: null
      },
      {
        option1: 'zz',
        option2: 'yy'
      },
      {
        schema: 'zzz'
      }
    )
  })
  t.throws(function () {
    checkTypes(
      {
        option1: {a: 'setting1'},
        option2: null
      },
      {
        option1: 'zz',
        option2: 'yy'
      },
      {
        schema: null
      }
    )
  })
})
