/* eslint ava/no-only-test:0 */

import test from 'ava'
import Slices from '../dist/string-slices-array-push.cjs'

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test('01.01  -  ADD() - wrong inputs', (t) => {
  // missing
  t.throws(() => {
    const slices = new Slices()
    slices.add()
  })
  t.throws(() => {
    const slices = new Slices()
    slices.add('a')
  })
  // wrong types
  t.throws(() => {
    const slices = new Slices()
    slices.add('a', 'a')
  })
  t.throws(() => {
    const slices = new Slices()
    slices.add(1, 'a')
  })
  t.throws(() => {
    const slices = new Slices()
    slices.add('a', 1)
  })
  t.notThrows(() => {
    const slices = new Slices()
    slices.add(1, 1)
  })
  // hardcoded undefined
  t.throws(() => {
    const slices = new Slices()
    slices.add(undefined, 1)
  })
  // numbers but not natural integers
  t.throws(() => {
    const slices = new Slices()
    slices.add(1.2, 1)
  })
  t.throws(() => {
    const slices = new Slices()
    slices.add(1, 1.3)
  })
})

test('01.02  -  ADD() - third input arg is not string', (t) => {
  t.throws(() => {
    const slices = new Slices()
    slices.add(1, 2, 3)
  })
})

test('01.03  -  ADD() - overloading', (t) => {
  t.throws(() => {
    const slices = new Slices()
    slices.add(1, 2, 'aaa', 1)
  }, 'string-slices-array-push/Slices/add(): [THROW_ID_05] Please don\'t overload the add() method. From the 4th input argument onwards we see these redundant arguments: [\n    1\n]')
})

test('01.04  -  PUSH() - wrong inputs', (t) => {
  // missing
  t.throws(() => {
    const slices = new Slices()
    slices.push()
  })
  t.throws(() => {
    const slices = new Slices()
    slices.push('a')
  })
  // wrong types
  t.throws(() => {
    const slices = new Slices()
    slices.push('a', 'a')
  })
  t.throws(() => {
    const slices = new Slices()
    slices.push(1, 'a')
  })
  t.throws(() => {
    const slices = new Slices()
    slices.push('a', 1)
  })
  t.notThrows(() => {
    const slices = new Slices()
    slices.push(1, 1)
  })
  // hardcoded undefined
  t.throws(() => {
    const slices = new Slices()
    slices.push(undefined, 1)
  })
  // numbers but not natural integers
  t.throws(() => {
    const slices = new Slices()
    slices.push(1.2, 1)
  })
  t.throws(() => {
    const slices = new Slices()
    slices.push(1, 1.3)
  })
})

test('01.05  -  PUSH() - third input arg is not string', (t) => {
  t.throws(() => {
    const slices = new Slices()
    slices.push(1, 2, 3)
  })
})

test('01.06  -  PUSH() - overloading', (t) => {
  t.throws(() => {
    const slices = new Slices()
    slices.push(1, 2, 'aaa', 1)
  })
})

// -----------------------------------------------------------------------------
// 02. BAU - no adding string, only ranges for deletion
// -----------------------------------------------------------------------------

test('02.01  -  ADD() - adds two non-overlapping ranges', (t) => {
  const slices = new Slices()
  slices.add(1, 2)
  slices.add(3, 4)
  t.deepEqual(
    slices.current(),
    [
      [1, 2],
      [3, 4],
    ],
    '02.01',
  )
})

test('02.02  -  ADD() - adds two overlapping ranges', (t) => {
  const slices = new Slices()
  slices.add(0, 5)
  slices.add(3, 9)
  t.deepEqual(
    slices.current(),
    [
      [0, 9],
    ],
    '02.02',
  )
})

test('02.03  -  ADD() - extends range', (t) => {
  const slices = new Slices()
  slices.add(1, 5)
  slices.add(5, 9)
  t.deepEqual(
    slices.current(),
    [
      [1, 9],
    ],
    '02.03',
  )
})

test('02.04  -  ADD() - new range bypasses the last range completely', (t) => {
  const slices = new Slices()
  slices.add(1, 5)
  slices.add(11, 15)
  slices.add(6, 10)
  slices.add(16, 20)
  slices.add(10, 30)
  t.deepEqual(
    slices.current(),
    [
      [1, 5],
      [6, 30],
    ],
    '02.04',
  )
})

test('02.05  -  ADD() - head and tail markers in new are smaller than last one\'s', (t) => {
  const slices = new Slices()
  slices.add(10, 20)
  slices.add(1, 5)
  t.deepEqual(
    slices.current(),
    [
      [1, 5],
      [10, 20],
    ],
    '02.05',
  )
})

test('02.06  -  ADD() - same value in heads and tails', (t) => {
  const slices = new Slices()
  slices.add(1, 1)
  t.deepEqual(
    slices.current(),
    [
      [1, 1],
    ],
    '02.06',
  )
})

test('02.07  -  ADD() - same range again and again', (t) => {
  const slices = new Slices()
  slices.add(1, 10)
  slices.add(1, 10)
  slices.add(1, 10)
  slices.add(1, 10)
  slices.add(1, 10)
  slices.add(1, 10)
  t.deepEqual(
    slices.current(),
    [
      [1, 10],
    ],
    '02.07',
  )
})

test('02.08  -  ADD() - same range again and again, one had third arg', (t) => {
  const slices = new Slices()
  slices.add(1, 10)
  slices.add(1, 10)
  slices.add(1, 10)
  slices.add(1, 10, 'zzz')
  slices.add(1, 10)
  slices.add(1, 10)
  t.deepEqual(
    slices.current(),
    [
      [1, 10, 'zzz'],
    ],
    '02.08',
  )
})

test('02.09  -  ADD() - inputs as numeric strings - all OK', (t) => {
  const slices = new Slices()
  slices.add('1', '2')
  slices.add('3', '4')
  t.deepEqual(
    slices.current(),
    [
      [1, 2],
      [3, 4],
    ],
    '02.09',
  )
})

test('02.10  -  ADD() - wrong order is fine', (t) => {
  const slices = new Slices()
  slices.add('3', '4')
  slices.add('1', '2')
  t.deepEqual(
    slices.current(),
    [
      [1, 2],
      [3, 4],
    ],
    '02.10',
  )
})

test('02.11  -  PUSH() - adds two non-overlapping ranges', (t) => {
  const slices = new Slices()
  slices.push(1, 2)
  slices.push(3, 4)
  t.deepEqual(
    slices.current(),
    [
      [1, 2],
      [3, 4],
    ],
    '02.11',
  )
})

test('02.12  -  PUSH() - adds two overlapping ranges', (t) => {
  const slices = new Slices()
  slices.push(0, 5)
  slices.push(3, 9)
  t.deepEqual(
    slices.current(),
    [
      [0, 9],
    ],
    '02.12',
  )
})

// -----------------------------------------------------------------------------
// 03. adding with third argument, various cases
// -----------------------------------------------------------------------------

test('03.01  -  ADD() - adds third argument, blank start', (t) => {
  const slices = new Slices()
  slices.add(1, 1, 'zzz')
  t.deepEqual(
    slices.current(),
    [
      [1, 1, 'zzz'],
    ],
    '03.01',
  )
})

test('03.02  -  ADD() - adds third argument onto existing and stops', (t) => {
  const slices = new Slices()
  slices.add(1, 2)
  slices.add(3, 4, 'zzz')
  t.deepEqual(
    slices.current(),
    [
      [1, 2],
      [3, 4, 'zzz'],
    ],
    '03.02',
  )
})

test('03.03  -  ADD() - adds third argument onto existing and adds more', (t) => {
  const slices = new Slices()
  slices.add(1, 2)
  slices.add(3, 4, 'zzz')
  slices.add(5, 6)
  t.deepEqual(
    slices.current(),
    [
      [1, 2],
      [3, 4, 'zzz'],
      [5, 6],
    ],
    '03.03',
  )
})

test('03.04  -  ADD() - existing "add" values get concatenated with incoming-ones', (t) => {
  const slices = new Slices()
  slices.add(1, 2, 'aaa')
  slices.add(2, 4, 'zzz')
  slices.add(5, 6)
  t.deepEqual(
    slices.current(),
    [
      [1, 4, 'aaazzz'],
      [5, 6],
    ],
    '03.04',
  )
})

test('03.05  -  ADD() - jumped over values have third args and they get concatenated', (t) => {
  const slices = new Slices()
  slices.add(6, 10)
  slices.add(16, 20, 'bbb')
  slices.add(11, 15, 'aaa')
  slices.add(10, 30) // this superset range will wipe the `aaa` and `bbb` above
  slices.add(1, 5)
  t.deepEqual(
    slices.current(),
    [
      [1, 5],
      [6, 30],
    ],
    '03.05',
  )
})

test('03.06  -  ADD() - combo of third arg and jumping behind previous range', (t) => {
  const slices = new Slices()
  slices.add(10, 11, 'aaa')
  slices.add(3, 4, 'zzz')
  t.deepEqual(
    slices.current(),
    [
      [3, 4, 'zzz'],
      [10, 11, 'aaa'],
    ],
    '03.06',
  )
})

test('03.07  -  ADD() - combo of third arg merging and extending previous range (default)', (t) => {
  const slices = new Slices()
  slices.add(1, 2)
  slices.add(2, 4, 'zzz')
  t.deepEqual(
    slices.current(),
    [
      [1, 4, 'zzz'],
    ],
    '03.07',
  )
})

test('03.08  -  ADD() - v1.1.0 - do not merge add-only entries with deletion entries case #1', (t) => {
  const slices = new Slices()
  slices.add(1, 3)
  slices.add(4, 10)
  slices.add(3, 3, 'zzz')
  t.deepEqual(
    slices.current(),
    [
      [1, 3, 'zzz'],
      [4, 10],
    ],
    '03.08',
  )
})

test('03.09  -  ADD() - v2.1.0 - overlapping ranges discard their inner range to-add values', (t) => {
  const slices = new Slices()
  slices.add(5, 6, ' ')
  slices.add(1, 10)
  t.deepEqual(
    slices.current(),
    [
      [1, 10],
    ],
    '03.09',
  )
})

test('03.10  -  ADD() - adds third argument with null', (t) => {
  const slices = new Slices()
  slices.add(1, 2)
  slices.add(3, 4, null)
  slices.add(5, 6)
  t.deepEqual(
    slices.current(),
    [
      [1, 2],
      [3, 4, null],
      [5, 6],
    ],
    '03.10',
  )
})

// -----------------------------------------------------------------------------
// 04. current()
// -----------------------------------------------------------------------------

test('04.01  -  CURRENT() - calling on blank yields null', (t) => {
  const slices = new Slices()
  t.deepEqual(
    slices.current(),
    null,
    '04.01',
  )
})

test('04.02  -  CURRENT() - multiple calls on the same should yield the same', (t) => {
  const slices = new Slices()
  slices.add(7, 14)
  slices.add(24, 28, ' ')
  slices.current()
  slices.add(29, 31)
  slices.current()
  slices.current()
  slices.current()
  slices.current()
  t.deepEqual(
    slices.current(),
    [
      [
        7,
        14,
      ],
      [
        24,
        28,
        ' ',
      ],
      [
        29,
        31,
      ],
    ],
    '04.02',
  )
})

// -----------------------------------------------------------------------------
// 05. wipe()
// -----------------------------------------------------------------------------

test('05.01  -  WIPE() - wipes correctly', (t) => {
  const slices = new Slices()
  slices.add(10, 10, 'aaa')
  slices.wipe()
  slices.add(1, 2, 'bbb')
  t.deepEqual(
    slices.current(),
    [
      [1, 2, 'bbb'],
    ],
    '05.01',
  )
})

// -----------------------------------------------------------------------------
// 06. last()
// -----------------------------------------------------------------------------

test('06.01  -  LAST() - fetches the last range from empty', (t) => {
  const slices = new Slices()
  t.deepEqual(
    slices.last(),
    null,
    '06.01',
  )
})

test('06.02  -  LAST() - fetches the last range from non-empty', (t) => {
  const slices = new Slices()
  slices.add(1, 2, 'bbb')
  t.deepEqual(
    slices.last(),
    [1, 2, 'bbb'],
    '06.02',
  )
})

// -----------------------------------------------------------------------------
// 07. limitToBeAddedWhitespace()
// -----------------------------------------------------------------------------

test('07.01  -  opts.limitToBeAddedWhitespace - spaces grouped - #1', (t) => {
  const slices = new Slices({ limitToBeAddedWhitespace: true })
  slices.add(1, 2, ' ')
  slices.add(2, 4, '   ')
  t.deepEqual(
    slices.current(),
    [
      [1, 4, ' '],
    ],
    '07.01 - both with spaces only',
  )
})

test('07.02  -  opts.limitToBeAddedWhitespace - spaces grouped - #2', (t) => {
  const slices = new Slices({ limitToBeAddedWhitespace: true })
  slices.add(1, 2, ' \t\t\t        ')
  slices.add(2, 4, '   ')
  t.deepEqual(
    slices.current(),
    [
      [1, 4, ' '],
    ],
    '07.02 - with tabs',
  )
})

test('07.03  -  opts.limitToBeAddedWhitespace - spaces grouped - #3', (t) => {
  const slices = new Slices({ limitToBeAddedWhitespace: true })
  slices.add(1, 2)
  slices.add(2, 4, '   ')
  t.deepEqual(
    slices.current(),
    [
      [1, 4, ' '],
    ],
    '07.03 - first slice has none',
  )
})

test('07.04  -  opts.limitToBeAddedWhitespace - spaces grouped - #4', (t) => {
  const slices = new Slices({ limitToBeAddedWhitespace: true })
  slices.add(1, 2, '')
  slices.add(2, 4, '   ')
  t.deepEqual(
    slices.current(),
    [
      [1, 4, ' '],
    ],
    '07.04 - first slice has empty str',
  )
})

test('07.05  -  opts.limitToBeAddedWhitespace - spaces grouped - #5', (t) => {
  const slices = new Slices({ limitToBeAddedWhitespace: true })
  slices.add(1, 2, '')
  slices.add(2, 4, ' \t\t\t        ')
  t.deepEqual(
    slices.current(),
    [
      [1, 4, ' '],
    ],
    '07.05 - first empty second with tabs',
  )
})

test('07.06  -  opts.limitToBeAddedWhitespace - spaces grouped - #6', (t) => {
  const slices = new Slices({ limitToBeAddedWhitespace: true })
  slices.add(1, 2, '   ')
  slices.add(2, 4)
  t.deepEqual(
    slices.current(),
    [
      [1, 4, ' '],
    ],
    '07.06 - second slice has none',
  )
})

test('07.07  -  opts.limitToBeAddedWhitespace - spaces grouped - #7', (t) => {
  const slices = new Slices({ limitToBeAddedWhitespace: true })
  slices.add(1, 2, '   ')
  slices.add(2, 4, '')
  t.deepEqual(
    slices.current(),
    [
      [1, 4, ' '],
    ],
    '07.07 - first slice has empty str',
  )
})

test('07.08  -  opts.limitToBeAddedWhitespace - spaces grouped - #8', (t) => {
  const slices = new Slices({ limitToBeAddedWhitespace: true })
  slices.add(1, 2, ' \t\t\t        ')
  slices.add(2, 4, '')
  t.deepEqual(
    slices.current(),
    [
      [1, 4, ' '],
    ],
    '07.08 - first empty second with tabs',
  )
})

test('07.09  -  opts.limitToBeAddedWhitespace - linebreaks - #1', (t) => {
  const slices = new Slices({ limitToBeAddedWhitespace: true })
  slices.add(1, 2, ' \t\t\t     \n   ')
  slices.add(2, 4, '    ')
  t.deepEqual(
    slices.current(),
    [
      [1, 4, '\n'],
    ],
    '07.09 - only 1st-one has line break',
  )
})

test('07.10  -  opts.limitToBeAddedWhitespace - linebreaks - #2', (t) => {
  const slices = new Slices({ limitToBeAddedWhitespace: true })
  slices.add(1, 2, ' \t\t\t     \n   ')
  slices.add(2, 4, '  \n  ')
  t.deepEqual(
    slices.current(),
    [
      [1, 4, '\n'],
    ],
    '07.10 - both have \\n',
  )
})

test('07.11  -  opts.limitToBeAddedWhitespace - linebreaks - #3', (t) => {
  const slices = new Slices({ limitToBeAddedWhitespace: true })
  slices.add(1, 2, ' \t\t\t        ')
  slices.add(2, 4, '  \n  ')
  t.deepEqual(
    slices.current(),
    [
      [1, 4, '\n'],
    ],
    '07.11',
  )
})

test('07.12  -  opts.limitToBeAddedWhitespace - linebreaks - #4', (t) => {
  const slices = new Slices({ limitToBeAddedWhitespace: true })
  slices.add(1, 2, '')
  slices.add(2, 4, '')
  t.deepEqual(
    slices.current(),
    [
      [1, 4, ''],
    ],
    '07.12',
  )
})

test('07.13  -  opts.limitToBeAddedWhitespace - null negates 3rd arg #1', (t) => {
  const slices = new Slices({ limitToBeAddedWhitespace: true })
  slices.add(1, 2, null)
  slices.add(2, 4, ' z  ')
  t.deepEqual(
    slices.current(),
    [
      [1, 4, null],
    ],
    '07.13',
  )
})

test('07.14  -  opts.limitToBeAddedWhitespace - null negates 3rd arg #2', (t) => {
  const slices = new Slices({ limitToBeAddedWhitespace: true })
  slices.add(1, 2, '   ')
  slices.add(2, 3, 'z')
  slices.add(2, 4, null)
  t.deepEqual(
    slices.current(),
    [
      [1, 4, null],
    ],
    '07.14',
  )
})

test('07.15  -  opts.limitToBeAddedWhitespace - null negates 3rd arg #1', (t) => {
  const slices = new Slices() // <---- no opts
  slices.add(1, 2, null)
  slices.add(2, 4, ' z  ')
  slices.add(10, 20, ' x  ')
  t.deepEqual(
    slices.current(),
    [
      [1, 4, null],
      [10, 20, ' x  '],
    ],
    '07.15 - no opts',
  )
})

test('07.16  -  opts.limitToBeAddedWhitespace - null negates 3rd arg #2', (t) => {
  const slices = new Slices() // <---- no opts
  slices.add(1, 2, '   ')
  slices.add(2, 3, 'z')
  slices.add(2, 4, null)
  t.deepEqual(
    slices.current(),
    [
      [1, 4, null],
    ],
    '07.16 - no opts',
  )
})

test('03.17  -  ADD() - null wipes third arg values', (t) => {
  const slices = new Slices()
  slices.add(1, 2, 'aaa')
  slices.add(2, 4, 'zzz')
  slices.add(1, 6, null)
  t.deepEqual(
    slices.current(),
    [
      [1, 6, null],
    ],
    '03.17',
  )
})
