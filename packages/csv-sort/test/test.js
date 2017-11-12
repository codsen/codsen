import { readFileSync as read } from 'fs'
import test from 'ava'
import path from 'path'
import split from 'csv-split-easy'
import csvSort from '../dist/csv-sort.cjs'

const fixtures = path.join(__dirname, 'fixtures')

// -----------------------------------------------------------------------------

function compare(t, name, throws) {
  if (throws) {
    return t.throws(() => {
      csvSort(read(path.join(fixtures, `${name}.csv`), 'utf8'))
    })
  }
  const actual = csvSort(read(path.join(fixtures, `${name}.csv`), 'utf8')).res
  const expected = read(path.join(fixtures, `${name}.expected.csv`), 'utf8')
  return t.deepEqual(actual, split(expected))
}

// GROUP 01. Simple file, concentrate on row sorting, Balance, Credit & Debit col detection

test('01.01. sorts a basic file, empty extra column in header', t => compare(t, 'simples'))

test('01.02. sorts a basic file, no headers', t => compare(t, 'simples-no-header'))

test('01.03. sorts a basic file with opposite order of the CSV entries', t => compare(t, 'simples-backwards'))

// GROUP 02. Blank row cases

test('02.01. blank row above header', t => compare(t, 'simples-blank-row-aboveheader'))

test('02.02. blank row above content, header row above it', t => compare(t, 'simples-blank-row-top'))

test('02.03. blank row in the middle', t => compare(t, 'simples-blank-row-middle'))

test('02.04. blank row at the bottom', t => compare(t, 'simples-blank-row-bottom'))

test('02.05. one messed up field CSV will result in missing rows on that row and higher', t => compare(t, 'simples-messed-up'))

test('02.06. one data row has extra column with data there', t => compare(t, 'simples-one-row-has-extra-cols'))

test('02.07. extra column with data there, then an extra empty column everywhere (will trim it)', t => compare(t, 'simples-one-row-has-extra-cols-v2'))

test('02.08. extra column with data there, then an extra empty column everywhere (will trim it)', (t) => {
  t.deepEqual(
    csvSort(''), [['']],
    '02.08',
  )
})

// GROUP 03. Throwing

test('03.01. throws when it can\'t detect Balance column (one field is empty in this case)', t => compare(t, 'throws-no-balance', 1))

test('03.02. throws when all exclusively-numeric columns contain same values per-column', t => compare(t, 'throws-identical-numeric-cols', 1))

test('03.03. offset columns - will throw', t => compare(t, 'offset-column', 1))

test('03.04. throws because there are no numeric-only columns', t => compare(t, 'throws-when-no-numeric-columns', 1))

test('03.05. throws when input types are wrong', (t) => {
  t.throws(() => {
    csvSort(true)
  })
  t.throws(() => {
    csvSort(null)
  })
  t.throws(() => {
    csvSort(1)
  })
  t.throws(() => {
    csvSort(undefined)
  })
  t.throws(() => {
    csvSort({ a: 'b' })
  })
  t.throws(() => {
    csvSort(['c', 'd'])
  })
})

// GROUP 04. 2D Trim

test('04.01. trims right side cols and bottom rows', t => compare(t, 'simples-2d-trim'))

test('04.02. trims all around, including left-side empty columns', t => compare(t, 'all-round-simples-trim'))
