'use strict'

import csvSort from '..'
import test from 'ava'
import { readFileSync as read } from 'fs'
import path from 'path'
import split from 'csv-split-easy'
const fixtures = path.join(__dirname, 'fixtures')

// -----------------------------------------------------------------------------

function compare (t, name, throws) {
  if (throws) {
    return t.throws(function () {
      csvSort(read(path.join(fixtures, `${name}.csv`), 'utf8'))
    })
  } else {
    let actual = csvSort(read(path.join(fixtures, `${name}.csv`), 'utf8')).res
    let expected = read(path.join(fixtures, `${name}.expected.csv`), 'utf8')
    return t.deepEqual(actual, split(expected))
  }
}

// GROUP 01. Simple file, concentrate on row sorting, Balance, Credit & Debit col detection

test('01.01. sorts a basic file, empty extra column in header', (t) => {
  return compare(t, 'simples')
})

test('01.02. sorts a basic file, no headers', (t) => {
  return compare(t, 'simples-no-header')
})

test('01.03. sorts a basic file with opposite order of the CSV entries', (t) => {
  return compare(t, 'simples-backwards')
})

// GROUP 02. Blank row cases

test('02.01. blank row above header', (t) => {
  return compare(t, 'simples-blank-row-aboveheader')
})

test('02.02. blank row above content, header row above it', (t) => {
  return compare(t, 'simples-blank-row-top')
})

test('02.03. blank row in the middle', (t) => {
  return compare(t, 'simples-blank-row-middle')
})

test('02.04. blank row at the bottom', (t) => {
  return compare(t, 'simples-blank-row-bottom')
})

test('02.05. one messed up field CSV will result in missing rows on that row and higher', (t) => {
  return compare(t, 'simples-messed-up')
})

test('02.06. one data row has extra column with data there', (t) => {
  return compare(t, 'simples-one-row-has-extra-cols')
})

test('02.07. extra column with data there, then an extra empty column everywhere (will trim it)', (t) => {
  return compare(t, 'simples-one-row-has-extra-cols-v2')
})

test('02.08. extra column with data there, then an extra empty column everywhere (will trim it)', (t) => {
  t.deepEqual(
    csvSort(''), [['']],
    '02.08'
  )
})

// GROUP 03. Throwing

test('03.01. throws when it can\'t detect Balance column (one field is empty in this case)', (t) => {
  return compare(t, 'throws-no-balance', 1)
})

test('03.02. throws when all exclusively-numeric columns contain same values per-column', (t) => {
  return compare(t, 'throws-identical-numeric-cols', 1)
})

test('03.03. offset columns - will throw', (t) => {
  return compare(t, 'offset-column', 1)
})

test('03.04. throws because there are no numeric-only columns', (t) => {
  return compare(t, 'throws-when-no-numeric-columns', 1)
})

test('03.05. throws when input types are wrong', (t) => {
  t.throws(function () {
    csvSort(true)
  })
  t.throws(function () {
    csvSort(null)
  })
  t.throws(function () {
    csvSort(1)
  })
  t.throws(function () {
    csvSort(undefined)
  })
  t.throws(function () {
    csvSort({a: 'b'})
  })
  t.throws(function () {
    csvSort(['c', 'd'])
  })
})

// GROUP 04. 2D Trim

test('04.01. trims right side cols and bottom rows', (t) => {
  return compare(t, 'simples-2d-trim')
})

test('04.02. trims all around, including left-side empty columns', (t) => {
  return compare(t, 'all-round-simples-trim')
})
