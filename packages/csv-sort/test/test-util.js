import test from 'ava'
import findtype from '../dist/util.cjs'

// 01. findtype()
// ==========================

test('00.01. findtype() BAU', (t) => {
  t.deepEqual(
    findtype('999.88'),
    'numeric',
    '00.01.01',
  )
  t.deepEqual(
    findtype('£999.88'),
    'numeric',
    '00.01.02',
  )
  t.deepEqual(
    findtype('$999.88'),
    'numeric',
    '00.01.03',
  )
  t.deepEqual(
    findtype('€10,000.88'),
    'numeric',
    '00.01.04',
  )
  t.deepEqual(
    findtype('10,000.88€'),
    'numeric',
    '00.01.05',
  )
  t.deepEqual(
    findtype('value is 10,000.88€'),
    'text',
    '00.01.06',
  )
  t.deepEqual(
    findtype(''),
    'empty',
    '00.01.07',
  )
})

test('00.02. findtype() throws', (t) => {
  t.throws(() => {
    findtype(true)
  })
  t.throws(() => {
    findtype(null)
  })
  t.throws(() => {
    findtype(1)
  })
  t.throws(() => {
    findtype(undefined)
  })
  t.throws(() => {
    findtype([])
  })
  t.throws(() => {
    findtype({})
  })
})
