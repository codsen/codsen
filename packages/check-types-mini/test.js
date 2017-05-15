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

test('01.03 - third argument and fourth arguments are missing', t => {
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

test('01.03 - third argument and fourth arguments are missing', t => {
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
      1,
      1
    )
  }, 'option2 was customised to "false" which is not boolean but string')
})

test('01.03 - fourth argument is missing', t => {
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
      'newLibrary/index.js: [THROW_ID_01]' // << no trailing space
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
      'newLibrary/index.js: [THROW_ID_01] ' // << trailing space
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
      'newLibrary/index.js: [THROW_ID_01] ',
      null,
      { ignoreKeys: ['option2'] }
    )
  })
})

test('01.04 - throws when opts are set wrong', t => {
  t.throws(function () {
    checkTypes({a: 'a'}, {a: 'b'}, 'aa', 'bbb', { ignoreKeys: false })
  }, 'check-types-mini/checkTypes(): [THROW_ID_03] opts.ignoreKeys should be an array, currently it\'s: boolean')
})
