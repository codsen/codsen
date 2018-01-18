import test from 'ava'
import c from '../dist/string-collapse-leading-whitespace.cjs'

// -----------------------------------------------------------------------------
// 01. normal use
// -----------------------------------------------------------------------------

test('01.01 - does nothing to trimmed strings', (t) => {
  t.deepEqual(
    c('zzz'),
    'zzz',
    '01.01',
  )
})

test('01.02 - whitespace in front', (t) => {
  t.deepEqual(
    c(' zzz'),
    ' zzz',
    '01.02.01',
  )
  t.deepEqual(
    c('  zzz'),
    ' zzz',
    '01.02.02',
  )
  t.deepEqual(
    c('\tzzz'),
    ' zzz',
    '01.02.03',
  )
})

test('01.03 - whitespace in the end', (t) => {
  t.deepEqual(
    c('zzz '),
    'zzz ',
    '01.03.01',
  )
  t.deepEqual(
    c('zzz  '),
    'zzz ',
    '01.03.02',
  )
  t.deepEqual(
    c('z  zz  '),
    'z  zz ',
    '01.03.03',
  )
  t.deepEqual(
    c('zzz  \t'),
    'zzz ',
    '01.03.04',
  )
  t.deepEqual(
    c('z zz\t'),
    'z zz ',
    '01.03.05',
  )
})

test('01.04 - whitespace on both ends', (t) => {
  t.deepEqual(
    c(' zzz '),
    ' zzz ',
    '01.04.01',
  )
  t.deepEqual(
    c('  zzz  '),
    ' zzz ',
    '01.04.02',
  )
  t.deepEqual(
    c('  zzz zzz  '),
    ' zzz zzz ',
    '01.04.03',
  )
  t.deepEqual(
    c('\tzzz zzz  '),
    ' zzz zzz ',
    '01.04.04',
  )
  t.deepEqual(
    c('\tzzz zzz\t'),
    ' zzz zzz ',
    '01.04.05',
  )
  t.deepEqual(
    c('\t\t\t\t\t     zzz zzz\t      \t\t\t\t'),
    ' zzz zzz ',
    '01.04.06',
  )
})

test('01.05 - whitespace with line breaks in front', (t) => {
  t.deepEqual(
    c('\nzzz'),
    '\nzzz',
    '01.05.01',
  )
  t.deepEqual(
    c(' \n zzz'),
    '\nzzz',
    '01.05.02',
  )
  t.deepEqual(
    c('\t\nzzz'),
    '\nzzz',
    '01.05.03',
  )
})

test('01.06 - whitespace with line breaks in the end', (t) => {
  t.deepEqual(
    c('zzz\n'),
    'zzz\n',
    '01.06.01',
  )
  t.deepEqual(
    c('zzz \n '),
    'zzz\n',
    '01.06.02',
  )
  t.deepEqual(
    c('zzz\t\n'),
    'zzz\n',
    '01.06.03',
  )
})

// -----------------------------------------------------------------------------
// 02. quick ends
// -----------------------------------------------------------------------------

test('02.01 - empty input', (t) => {
  t.deepEqual(
    c(''),
    '',
    '02.01.01',
  )
})

test('02.02 - all whitespace', (t) => {
  t.deepEqual(
    c('    '),
    ' ',
    '02.02.01',
  )
  t.deepEqual(
    c('\t'),
    ' ',
    '02.02.02',
  )
  t.deepEqual(
    c('  \n\n  '),
    '\n',
    '02.02.03',
  )
  t.deepEqual(
    c('\n'),
    '\n',
    '02.02.04',
  )
})

test('02.03 - not a string input', (t) => {
  t.deepEqual(
    c(1),
    1,
    '02.03',
  )
})
