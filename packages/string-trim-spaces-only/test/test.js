import test from 'ava'
import trim from '../dist/string-trim-spaces-only.cjs'

test('1 - empty string', (t) => {
  t.is(
    trim(''),
    '',
    '1',
  )
})

test('2 - single space', (t) => {
  t.is(
    trim(' '),
    '',
    '2',
  )
})

test('3 - single letter', (t) => {
  t.is(
    trim('a'),
    'a',
    '3',
  )
})

test('4 - leading space', (t) => {
  t.is(
    trim(' a a'),
    'a a',
    '4',
  )
})

test('5 - trailing space', (t) => {
  t.is(
    trim('a a '),
    'a a',
    '5',
  )
})

test('6 - space on both sides', (t) => {
  t.is(
    trim('   a a     '),
    'a a',
    '6.1',
  )
  t.is(
    trim('   👍     '),
    '👍',
    '6.2 - copes with emoji',
  )
})

test('7 - trimming hits the newline and stops', (t) => {
  t.is(
    trim('   \n  a a  \n   '),
    '\n  a a  \n',
    '7.1',
  )
  t.is(
    trim('   \t  a a  \t   '),
    '\t  a a  \t',
    '7.2',
  )
})

test('8 - non-string input', (t) => {
  t.is(
    trim(true),
    true,
    '8.1',
  )
  t.is(
    trim(undefined),
    undefined,
    '8.2',
  )
  t.is(
    trim(9),
    9,
    '8.3',
  )
  const input = { a: 'zzz' }
  t.is(
    trim(input),
    input,
    '8.4',
  )
})
