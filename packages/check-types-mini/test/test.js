import test from 'ava'
import checkTypes from '../dist/check-types-mini.cjs'

test('01.01 - throws when all/first args are missing', (t) => {
  t.throws(() => {
    checkTypes()
  }, 'check-types-mini: [THROW_ID_01] Missing all arguments!')
})

test('01.02 - throws when second arg is missing', (t) => {
  t.throws(() => {
    checkTypes('zzzz')
  }, 'check-types-mini: [THROW_ID_02] Missing second argument!')
})

test('01.03 - throws when one of the arguments is of a wrong type', (t) => {
  t.throws(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: 'false',
        option3: false,
      },
      {
        option1: 'setting1',
        option2: false,
        option3: false,
      },
    )
  }, 'check-types-mini: opts.option2 was customised to "false" which is not boolean but string')
})

test('01.04 - opts.msg or opts.optsVarName args are wrong-type', (t) => {
  t.throws(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: 'setting2',
        option3: false,
      },
      {
        option1: 'setting1',
        option2: 'setting2',
        option3: false,
      },
      {
        msg: 'zzz',
        optsVarName: 1,
      },
    )
  })
  t.throws(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: 'setting2',
        option3: false,
      },
      {
        option1: 'setting1',
        option2: 'setting2',
        option3: false,
      },
      {
        msg: 1,
        optsVarName: 'zzz',
      },
    )
  })
})

test('01.05 - throws if fourth argument is missing', (t) => {
  t.throws(
    () => {
      checkTypes(
        {
          option1: 'setting1',
          option2: 'false',
          option3: false,
        },
        {
          option1: 'setting1',
          option2: false,
          option3: false,
        },
        {
          msg: 'newLibrary/index.js [THROW_ID_01]', // << no trailing space
        },
      )
    },
    'newLibrary/index.js [THROW_ID_01]: opts.option2 was customised to "false" which is not boolean but string',
  )
  t.throws(
    () => {
      checkTypes(
        {
          option1: 'setting1',
          option2: 'false',
          option3: false,
        },
        {
          option1: 'setting1',
          option2: false,
          option3: false,
        },
        {
          msg: 'newLibrary/index.js [THROW_ID_01]:        ', // << trailing space
        },
      )
    },
    'newLibrary/index.js [THROW_ID_01]: opts.option2 was customised to "false" which is not boolean but string',
  )
  t.notThrows(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: 'false',
        option3: false,
      },
      {
        option1: 'setting1',
        option2: false,
        option3: false,
      },
      {
        msg: 'newLibrary/index.js [THROW_ID_01]: ',
        ignoreKeys: ['option2'],
      },
    )
  })
})

test('01.06 - throws when opts are set wrong', (t) => {
  t.throws(
    () => {
      checkTypes(
        { somekey: 'a' },
        { somekey: 'b' },
        {
          msg: 'aa',
          optsVarName: 'bbb',
          ignoreKeys: false,
        },
      )
    },
    'check-types-mini: [THROW_ID_05] opts.ignoreKeys should be an array, currently it\'s: boolean',
  )
  t.throws(
    () => {
      checkTypes(
        { somekey: 'a' },
        { somekey: 'b' },
        {
          msg: 1,
          optsVarName: 'bbb',
          ignoreKeys: false,
        },
      )
    },
    'check-types-mini: [THROW_ID_03] opts.msg must be string! Currently it\'s: number, equal to 1',
  )
  t.notThrows(() => {
    checkTypes(
      { somekey: 'a' }, { somekey: 'b' },
      {
        msg: 'aa',
        optsVarName: 'bbb',
        ignoreKeys: 'a',
      },
    )
  })
  t.notThrows(() => {
    checkTypes(
      { somekey: 'a' }, { somekey: 'b' },
      {
        msg: 'aa',
        optsVarName: 'bbb',
        ignoreKeys: '',
      },
    )
  })
})

// ======================
// 02. Arrays
// ======================

test('02.01 - opts.acceptArrays, strings+arrays', (t) => {
  t.throws(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: ['setting3', 'setting4'],
        option3: false,
      },
      {
        option1: 'setting1',
        option2: 'setting2',
        option3: false,
      },
    )
  })
  t.notThrows(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: ['setting3', 'setting4'],
        option3: false,
      },
      {
        option1: 'setting1',
        option2: 'setting2',
        option3: false,
      },
      {
        msg: 'message',
        optsVarName: 'varname',
        acceptArrays: true,
      },
    )
  })
  t.throws(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: ['setting3', true, 'setting4'],
        option3: false,
      },
      {
        option1: 'setting1',
        option2: 'setting2',
        option3: false,
      },
      {
        msg: 'message',
        optsVarName: 'varname',
        acceptArrays: true,
      },
    )
  })
})

test('02.02 - opts.acceptArrays, Booleans+arrays', (t) => {
  t.throws(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: [true, true],
        option3: false,
      },
      {
        option1: 'setting1',
        option2: false,
        option3: false,
      },
    )
  })
  t.notThrows(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: [true, true],
        option3: false,
      },
      {
        option1: 'setting1',
        option2: false,
        option3: false,
      },
      {
        msg: 'message',
        optsVarName: 'varname',
        acceptArrays: true,
      },
    )
  })
  t.throws(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: [true, true, 1],
        option3: false,
      },
      {
        option1: 'setting1',
        option2: false,
        option3: false,
      },
      {
        msg: 'message',
        optsVarName: 'varname',
        acceptArrays: true,
      },
    )
  })
  t.throws(() => {
    checkTypes(
      {
        option1: [1, 0, 1, 0],
        option2: [true, true],
        option3: false,
      },
      {
        option1: 0,
        option2: false,
        option3: false,
      },
      {
        msg: 'test: [THROW_ID_01]',
        optsVarName: 'opts',
        acceptArrays: 'this string will cause the throw',
        acceptArraysIgnore: [],
      },
    )
  })
})

test('02.03 - opts.acceptArraysIgnore', (t) => {
  t.notThrows(() => {
    checkTypes(
      {
        option1: [1, 0, 1, 0],
        option2: [true, true],
        option3: false,
      },
      {
        option1: 0,
        option2: false,
        option3: false,
      },
      {
        msg: 'test: [THROW_ID_01]',
        optsVarName: 'opts',
        acceptArrays: true,
        acceptArraysIgnore: [],
      },
    )
  })
  t.throws(() => {
    checkTypes(
      {
        option1: [1, 0, 1, 0],
        option2: [true, true],
        option3: false,
      },
      {
        option1: 0,
        option2: false,
        option3: false,
      },
      {
        msg: 'test: [THROW_ID_01]',
        optsVarName: 'opts',
        acceptArrays: true,
        acceptArraysIgnore: ['zzz', 'option1'],
      },
    )
  })
  t.throws(() => {
    checkTypes(
      {
        option1: [1, 0, 1, 0],
        option2: [true, true],
        option3: false,
      },
      {
        option1: 0,
        option2: false,
        option3: false,
      },
      {
        msg: 'test: [THROW_ID_01]',
        optsVarName: 'opts',
        acceptArrays: false,
        acceptArraysIgnore: ['zzz', 'option1'],
      },
    )
  })
  t.throws(() => {
    checkTypes(
      {
        option1: [1, 0, 1, 0],
        option2: [true, true],
        option3: false,
      },
      {
        option1: 0,
        option2: false,
        option3: false,
      },
      {
        msg: 'test: [THROW_ID_01]',
        optsVarName: 'opts',
        acceptArrays: true,
        acceptArraysIgnore: true,
      },
    )
  })
})

test('02.05 - involving null values', (t) => {
  t.throws(() => {
    checkTypes(
      {
        key: 1,
        val: null,
        cleanup: true,
      },
      {
        key: null,
        val: null,
        cleanup: true,
      },
    )
  })
})

test('02.06 - throws/notThrows when keysets mismatch', (t) => {
  t.throws(() => {
    checkTypes(
      {
        key: null,
        val: null,
        cleanup: true,
      },
      {
        key: null,
        val: null,
      },
    )
  })
  t.throws(() => {
    checkTypes(
      {
        key: null,
        val: null,
      },
      {
        key: null,
        val: null,
        cleanup: true,
      },
    )
  })
  t.notThrows(() => {
    checkTypes(
      {
        key: null,
        val: null,
        cleanup: true,
      },
      {
        key: null,
        val: null,
      },
      {
        enforceStrictKeyset: false,
      },
    )
  })
  t.notThrows(() => {
    checkTypes(
      {
        key: null,
        val: null,
      },
      {
        key: null,
        val: null,
        cleanup: true,
      },
      {
        enforceStrictKeyset: false,
      },
    )
  })
})

test('02.07 - opts.enforceStrictKeyset set to a wrong thing', (t) => {
  t.throws(() => {
    checkTypes(
      {
        key: 1,
        val: null,
        cleanup: true,
      },
      {
        key: null,
        val: null,
        cleanup: true,
      },
      {
        enforceStrictKeyset: 1,
      },
    )
  })
})

test('02.08 - throws when reference and schema are both missing', (t) => {
  t.throws(() => {
    checkTypes(
      {
        key: 1,
        val: null,
        cleanup: true,
      },
      {},
    )
  })
})

// ======================
// 03. opts.enforceStrictKeyset
// ======================

test('03.01 - opts.acceptArrays, strings+arrays', (t) => {
  t.throws(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: 'setting2',
        rogueKey: false,
      },
      {
        option1: 'zz',
        option2: 'yy',
      },
    )
  })
  t.notThrows(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: 'setting2',
        rogueKey: false,
      },
      {
        option1: 'zz',
        option2: 'yy',
      },
      {
        enforceStrictKeyset: false,
      },
    )
  })
})

// ======================
// 04. opts.schema
// ======================

test('04.01 - opts.schema only', (t) => {
  t.throws(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: null,
      },
      {
        option1: 'zz',
        option2: 'yy',
      },
    )
  })
  t.notThrows(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: null,
      },
      {
        option1: 'zz',
        option2: 'yy',
      },
      {
        schema: {
          option2: ['stRing', null],
        },
      },
    )
  })
  t.throws(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: null,
      },
      {
        option1: 'zz',
        option2: 'yy',
      },
      {
        schema: {
          option2: ['string', 'boolean'],
        },
      },
    )
  })
  t.notThrows(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: null,
      },
      null, // << reference object is completely omitted!!!
      {
        schema: {
          option1: 'String',
          option2: ['stRing', null],
        },
      },
    )
  })
  t.throws(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: null,
      },
      null,
      {
        schema: { // <<< notice how option1 is missing AND also missing in reference obj
          option2: ['stRing', null],
        },
      },
    )
  })

  // true not allowed, - only false or null or string
  t.throws(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: true,
      },
      {
        option1: 'zz',
        option2: null,
      },
      {
        schema: {
          option2: ['null', 'false', 'string'],
        },
      },
    )
  })
  t.notThrows(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: false,
      },
      {
        option1: 'zz',
        option2: null,
      },
      {
        schema: {
          option2: ['null', 'false', 'string'],
        },
      },
    )
  })
  t.notThrows(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: null,
      },
      {
        option1: 'zz',
        option2: false,
      },
      {
        schema: {
          option2: ['null', 'false', 'string'],
        },
      },
    )
  })
  t.notThrows(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: 'zzz',
      },
      {
        option1: 'zz',
        option2: null,
      },
      {
        schema: {
          option2: ['null', 'false', 'string'],
        },
      },
    )
  })

  // second bunch

  // true or string
  t.throws(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: false,
      },
      {
        option1: 'zz',
        option2: true,
      },
      {
        schema: {
          option2: ['true', 'string'],
        },
      },
    )
  })
  t.throws(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: null,
      },
      {
        option1: 'zz',
        option2: true,
      },
      {
        schema: {
          option2: ['true', 'string'],
        },
      },
    )
  })
  t.throws(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: 0,
      },
      {
        option1: 'zz',
        option2: true,
      },
      {
        schema: {
          option2: ['true', 'string'],
        },
      },
    )
  })
  t.notThrows(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: 'zzz',
      },
      {
        option1: 'zz',
        option2: true,
      },
      {
        schema: {
          option2: ['true', 'string'],
        },
      },
    )
  })
  t.throws(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: 'zzz',
      },
      {
        option1: 'zz',
        option2: true,
      },
      {
        schema: {
          option2: ['true'],
        },
      },
    )
  })
  t.notThrows(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: true,
      },
      {
        option1: 'zz',
        option2: true,
      },
      {
        schema: {
          option2: ['true'],
        },
      },
    )
  })
  t.notThrows(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: true,
      },
      {
        option1: 'zz',
        option2: true,
      },
      {
        schema: {
          option2: ['boolean'],
        },
      },
    )
  })
  t.notThrows(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: false,
      },
      {
        option1: 'zz',
        option2: false,
      },
      {
        schema: {
          option2: ['false'],
        },
      },
    )
  })
  t.notThrows(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: false,
      },
      {
        option1: 'zz',
        option2: false,
      },
      {
        schema: {
          option2: ['boolean'],
        },
      },
    )
  })
  t.notThrows(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: true,
      },
      {
        option1: 'zz',
        option2: false,
      },
      {
        schema: {
          option2: ['boolean'],
        },
      },
    )
  })
  t.throws(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: 'true', // <-- because it's string
      },
      {
        option1: 'zz',
        option2: false,
      },
      {
        schema: {
          option2: ['boolean'],
        },
      },
    )
  })
})

test('04.02 - opts.schema values as strings + "whatever" keys', (t) => {
  t.throws(() => {
    checkTypes(
      {
        option1: { somekey: 'setting1' },
        option2: null,
      },
      {
        option1: 'zz',
        option2: 'yy',
      },
    )
  })
  t.notThrows(() => {
    checkTypes(
      {
        option1: { somekey: 'setting1' },
        option2: null,
      },
      {
        option1: 'zz',
        option2: 'yy',
      },
      {
        schema: {
          option1: ['object', 'string'],
          option2: ['whatever'],
        },
      },
    )
  })
  t.notThrows(() => {
    checkTypes(
      {
        option1: { somekey: 'setting1' },
        option2: null,
      },
      {
        option1: 'zz',
        option2: 'yy',
      },
      {
        schema: {
          option1: 'object', // << observe it's a string, not an array
          option2: ['whatever'],
        },
      },
    )
  })
  t.throws(() => {
    checkTypes(
      {
        option1: { somekey: 'setting1' },
        option2: null,
      },
      {
        option1: 'zz',
        option2: 'yy',
      },
      {
        schema: {
          option1: 'string', // << will throw because this type is not followed
          option2: ['whatever'],
        },
      },
    )
  })
  t.notThrows(() => {
    checkTypes(
      {
        option1: { somekey: 'setting1' },
        option2: null,
      },
      {
        option1: 'zz',
        option2: 'yy',
      },
      {
        schema: {
          option1: ['string', 'any'], // <<< observe how "any" is among other types
          option2: 'whatever', // also observe that it's not an array. Should work anyway!
        },
      },
    )
  })
})

test('04.03 - opts.schema falling back to reference object', (t) => {
  // with throwing consequences:
  t.throws(() => {
    checkTypes(
      {
        option1: { somekey: 'setting1' },
        option2: null,
      },
      {
        option1: 'zz',
        option2: 'yy',
      },
      {
        schema: {
          option1: 'number',
        },
      },
    )
  })
  // without throwing consequences:
  t.notThrows(() => {
    checkTypes(
      {
        option1: { somekey: 'setting1' },
        option2: 'zz',
      },
      {
        option1: { ww: 'zz' },
        option2: 'yy',
      },
      {
        schema: {
          option99: 'number', // << that's useless, so falls back to reference object
        },
      },
    )
  })
})

test('04.04 - opts.schema is set to a wrong thing - throws', (t) => {
  t.throws(() => {
    checkTypes(
      {
        option1: { somekey: 'setting1' },
        option2: null,
      },
      {
        option1: 'zz',
        option2: 'yy',
      },
      {
        schema: 'zzz',
      },
    )
  })
  t.throws(() => {
    checkTypes(
      {
        option1: { somekey: 'setting1' },
        option2: null,
      },
      {
        option1: 'zz',
        option2: 'yy',
      },
      {
        schema: null,
      },
    )
  })
})

test('04.05 - opts.schema understands opts.acceptArrays', (t) => {
  t.throws(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: ['setting2'],
      },
      {
        option1: 'zz',
        option2: 'yy',
      },
    )
  }) // throws because reference's type mismatches.
  t.notThrows(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: ['setting2'],
      },
      {
        option1: 'zz',
        option2: 'yy',
      },
      {
        acceptArrays: true,
      },
    )
  }) // does not throw because of opts.acceptArrays is matching against reference
  t.notThrows(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: ['setting2'],
      },
      {
        option1: 'zz',
      },
      {
        acceptArrays: true,
        schema: {
          option2: 'string',
        },
      },
    )
  }) // does not throw because of opts.acceptArrays is matching against schema's keys
  t.throws(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: ['setting2', 999],
      },
      {
        option1: 'zz',
      },
      {
        acceptArrays: true,
        schema: {
          option2: 'string',
        },
      },
    )
  }) // throws because schema and opts.acceptArrays detects wrong type within input's array
  t.notThrows(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: ['setting2', 999],
      },
      {
        option1: 'zz',
      },
      {
        acceptArrays: true,
        schema: {
          option2: ['string', 'number'],
        },
      },
    )
  }) // number is allowed now
  t.throws(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: ['setting2', 999],
      },
      {
        option1: 'zz',
      },
      {
        acceptArrays: false,
        schema: {
          option2: ['string', 'number'],
        },
      },
    )
  }) // number is allowed in schema, but not in an array, and opts.acceptArrays is off, so throws
  t.notThrows(() => {
    checkTypes(
      {
        option1: 'setting1',
        option2: ['setting2', 999],
      },
      {
        option1: 'zz',
      },
      {
        acceptArrays: false,
        schema: {
          option2: ['string', 'number', 'array'],
        },
      },
    )
  }) // does not throw because blanked permission for array's is on.
  // it might be array of rubbish though, so that's a faulty, short-sighted type check.
})
