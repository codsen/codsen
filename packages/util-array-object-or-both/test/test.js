import test from 'ava'
import aoob from '../dist/util-array-object-or-both.cjs'

// ===========
// precautions
// ===========

test('1.1 - wrong/missing inputs - throws', (t) => {
  t.throws(() => {
    aoob()
  })
  t.throws(() => {
    aoob(1)
  })
  t.throws(() => {
    aoob(['a'])
  })
  t.notThrows(() => {
    aoob('any')
  })
  t.throws(() => {
    aoob('any', 1)
  })
  t.notThrows(() => {
    aoob('any', null)
  })
})

test('1.2 - wrongly set up options object - throws', (t) => {
  t.throws(() => {
    aoob('any', { msg: 1 })
  })
  t.throws(() => {
    aoob('any', { optsVarName: 1 })
  })
  t.notThrows(() => {
    aoob('any', { msg: null })
  })
  t.notThrows(() => {
    aoob('any', { optsVarName: null })
  })
})

// ===
// BAU
// ===

test('2.1 - arrays', (t) => {
  t.deepEqual(
    aoob('array'),
    'array',
    '2.1.1',
  )
  t.deepEqual(
    aoob('Array'),
    'array',
    '2.1.2',
  )
  t.deepEqual(
    aoob('\n\nArray\t \t'),
    'array',
    '2.1.3',
  )
  t.deepEqual(
    aoob('\n\n   a \t'),
    'array',
    '2.1.4',
  )
  t.deepEqual(
    aoob('\n\n   arr \t'),
    'array',
    '2.1.5',
  )
  t.deepEqual(
    aoob('\n\n   ARR \t'),
    'array',
    '2.1.6',
  )
})

test('2.2 - objects', (t) => {
  t.deepEqual(
    aoob('object'),
    'object',
    '2.2.1',
  )
  t.deepEqual(
    aoob('Object'),
    'object',
    '2.2.2',
  )
  t.deepEqual(
    aoob('obj'),
    'object',
    '2.2.3',
  )
  t.deepEqual(
    aoob('o'),
    'object',
    '2.2.4',
  )
  t.deepEqual(
    aoob('  object'),
    'object',
    '2.2.5',
  )
  t.deepEqual(
    aoob('Object   '),
    'object',
    '2.2.6',
  )
  t.deepEqual(
    aoob('\nobj'),
    'object',
    '2.2.7',
  )
  t.deepEqual(
    aoob('o\n\n '),
    'object',
    '2.2.8',
  )
  t.deepEqual(
    aoob(' OBJ'),
    'object',
    '2.2.9',
  )
})

test('2.3 - any', (t) => {
  t.deepEqual(
    aoob('any'),
    'any',
    '2.3.1',
  )
  t.deepEqual(
    aoob('all'),
    'any',
    '2.3.2',
  )
  t.deepEqual(
    aoob('Everything'),
    'any',
    '2.3.3',
  )
  t.deepEqual(
    aoob('e'),
    'any',
    '2.3.4',
  )
  t.deepEqual(
    aoob('ANY'),
    'any',
    '2.3.5',
  )
  t.deepEqual(
    aoob('\n\n all'),
    'any',
    '2.3.6',
  )
})

// ====
// opts
// ====

test('3.1 - opts.msg', (t) => {
  t.deepEqual(
    aoob(
      'object',
      {
        msg: 'z',
      },
    ),
    'object',
    '2.2.1',
  )
  t.throws(
    () => {
      aoob(
        'aaa',
        {
          msg: 'z',
        },
      )
    },
    'z The given variable was customised to an unrecognised value: aaa. Please check it against the API documentation.',
  )
  t.throws(
    () => {
      aoob(
        'aaa',
        {
          msg: 'some-library/some-function(): [THROW_ID_99]',
        },
      )
    },
    'some-library/some-function(): [THROW_ID_99] The given variable was customised to an unrecognised value: aaa. Please check it against the API documentation.',
  )
  t.throws(
    () => {
      aoob(
        'bbb',
        {
          msg: 'some-library/some-function(): [THROW_ID_99]',
          optsVarName: 'only',
        },
      )
    },
    'some-library/some-function(): [THROW_ID_99] The variable "only" was customised to an unrecognised value: bbb. Please check it against the API documentation.',
  )
})
