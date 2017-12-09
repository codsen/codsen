import test from 'ava'
import er from '../dist/easy-replace.cjs'

// ==============================
// only the string to search for
// ==============================

test('1.1 - replace letter with letter', (t) => {
  t.is(
    er(
      'a b c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'b',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'd',
    ),
    'a d c',
    'test 1.1',
  )
  t.is(
    er(
      'a b c',
      {
        searchFor: 'b',
      },
      'd',
    ),
    'a d c',
    'test 1.1',
  )
})

test('1.2 - replace 1 emoji with 1 emoji', (t) => {
  t.is(
    er(
      '🐴 🦄 🐴',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🦄',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      '💖',
    ),
    '🐴 💖 🐴',
    'test 1.2',
  )
})

test('1.3 - replace 3 consecutive emoji with emoji', (t) => {
  t.is(
    er(
      'a 🦄🦄🦄 a',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🦄',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      '💖',
    ),
    'a 💖💖💖 a',
    'test 1.3',
  )
})

test('1.4 - gorilla emoji - in escaped JS', (t) => {
  t.is(
    er(
      'ljghdfjkgzh\ud83e\udd8dlkgljd',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '\ud83e\udd8d',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      ' Gorilla ',
    ),
    'ljghdfjkgzh Gorilla lkgljd',
    'test 1.4 - http://unicode-table.com/en/1F98D/',
  )
})

test('1.5 - gorilla emoji - in raw', (t) => {
  t.is(
    er(
      'ljghdfjkgzh🦍lkgljd',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🦍',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'gorilla',
    ),
    'ljghdfjkgzhgorillalkgljd',
    'test 1.5 - http://unicode-table.com/en/1F98D/',
  )
})

test('1.6 - won\'t find a letter', (t) => {
  t.is(
    er(
      'a b c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'z',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'd',
    ),
    'a b c',
    'test 1.6',
  )
})

test('1.7 - won\'t find emoji, with new lines', (t) => {
  t.is(
    er(
      'a\nb\nc',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🦄',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'd',
    ),
    'a\nb\nc',
    'test 1.7',
  )
})

test('1.8 - replacement with new lines', (t) => {
  t.is(
    er(
      'a\nb',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'a\nb',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'c\nd',
    ),
    'c\nd',
    'test 1.8',
  )
})

test('1.9 - multiple letter findings', (t) => {
  t.is(
    er(
      'a a a a a b',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'a',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'c',
    ),
    'c c c c c b',
    'test 1.9',
  )
})

test('1.10 - single digit of string type replaced', (t) => {
  t.is(
    er(
      '0',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '0',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      '1',
    ),
    '1',
    'test 1.10',
  )
})

test('1.11 - single digit of integer type replaced', (t) => {
  t.is(
    er(
      0,
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '0',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      1,
    ),
    '1',
    'test 1.11',
  )
})

test('1.12 - source and replacement are of integer type', (t) => {
  t.is(
    er(
      0,
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 0,
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      1,
    ),
    '1',
    'test 1.12',
  )
})

test('1.13 - all raw integers: source, replacement and searchFor', (t) => {
  t.is(
    er(
      0,
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 0,
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      1,
    ),
    '1',
    'test 1.13',
  )
})

test('1.14 - multiple consecutive letter replacements', (t) => {
  t.is(
    er(
      'aaavvvvccccc',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'v',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    'aaabbbbccccc',
    'test 1.14',
  )
})

// ==============================
// searchFor + leftMaybe
// ==============================


test('2.1 - left maybe found', (t) => {
  t.is(
    er(
      'a🦄🐴🦄c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '🦄',
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    'ab🦄c',
    'test 2.1',
  )
  t.is(
    er(
      'a🦄🐴🦄c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: ['🦄'],
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    'ab🦄c',
    'test 2.1',
  )
})

test('2.2 - two replacements with one leftmaybe, nearby', (t) => {
  t.is(
    er(
      'ab🐴🦄🐴c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '🦄',
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'd',
    ),
    'abddc',
    'test 2.2',
  )
  t.is(
    er(
      'ab🐴🦄🐴c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: ['🦄'],
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'd',
    ),
    'abddc',
    'test 2.2',
  )
})

test('2.3 - two consecutive maybes found/replaced', (t) => {
  t.is(
    er(
      'ab🦄🐴🦄🐴c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '🦄',
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'd',
    ),
    'abddc',
    'test 2.3',
  )
  t.is(
    er(
      'ab🦄🐴🦄🐴c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: ['🦄'],
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'd',
    ),
    'abddc',
    'test 2.3',
  )
})

test('2.4 - futile left maybe', (t) => {
  t.is(
    er(
      '\'🐴',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '🦄',
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'd',
    ),
    '\'d',
    'test 2.4',
  )
  t.is(
    er(
      '\'🐴',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: ['🦄'],
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'd',
    ),
    '\'d',
    'test 2.4',
  )
})

test('2.5 - line break as search string', (t) => {
  t.is(
    er(
      '\n\n\n',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '\n',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'a',
    ),
    'aaa',
    'test 2.5',
  )
})

test('2.6 - line break as both searchFor and maybe replaced', (t) => {
  t.is(
    er(
      '\n\n\n',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '\n',
        searchFor: '\n',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'a',
    ),
    'aaa',
    'test 2.6',
  )
  t.is(
    er(
      '\n\n\n',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: ['\n'],
        searchFor: '\n',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'a',
    ),
    'aaa',
    'test 2.6',
  )
})

test('2.7 - operations on line breaks only', (t) => {
  t.is(
    er(
      '\n\n',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '\n\n',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      '\n',
    ),
    '\n',
    'test 2.7',
  )
})

test('2.8 - three left maybes (found)', (t) => {
  t.is(
    er(
      'a🦄🐴🦄c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: ['🦄', 'a', 'x'],
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    'ab🦄c',
    'test 2.8',
  )
})

test('2.9 - three left maybes (not found)', (t) => {
  t.is(
    er(
      'a🦄🐴🦄c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: ['🦄', '🐴', 'c'],
        searchFor: '🍺',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    'a🦄🐴🦄c',
    'test 2.9',
  )
})

test('2.10 - three left maybes (multiple hungry finds)', (t) => {
  t.is(
    er(
      '🐴 a🍺🦄🐴🦄c a🦄🍺🐴🦄c a🦄🐴🦄c a🍺🐴🦄c 🐴',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: ['🦄', '🍺', 'c'],
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    'b a🍺b🦄c a🦄b🦄c ab🦄c ab🦄c b',
    'test 2.10.1',
  )
  t.is(
    er(
      '🐴 a🍺🦄🐴🦄c a🦄🍺🐴🦄c a🦄🐴🦄c a🍺🐴🦄c 🐴',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: ['c', '🦄', '🍺'],
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    'b a🍺b🦄c a🦄b🦄c ab🦄c ab🦄c b',
    'test 2.10.2',
  )
  t.is(
    er(
      '🐴 a🍺🦄🐴🦄c a🦄🍺🐴🦄c a🦄🐴🦄c a🍺🐴🦄c 🐴',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: ['🍺', 'c', '🦄'],
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    'b a🍺b🦄c a🦄b🦄c ab🦄c ab🦄c b',
    'test 2.10.3',
  )
})
// if leftMaybe is simply merged and not iterated, and is queried to exist
// explicitly as string on the left side of the searchFor, it will not be found
// if the order of array is wrong, yet characters are all the same.

test('2.11 - sneaky array conversion situation', (t) => {
  t.is(
    er(
      'a🦄🐴🦄c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: ['a', '🦄'],
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    'ab🦄c',
    'test 2.11',
  )
})

test('2.12 - sneaky array conversion situation', (t) => {
  t.is(
    er(
      'a🦄🐴🦄c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: ['🦄', 'a'],
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    'ab🦄c',
    'test 2.12',
  )
})

test('2.13 - normal words, few of them, leftMaybe as array', (t) => {
  t.is(
    er(
      'this emotion is really a promotion in motion',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: ['e', 'pro'],
        searchFor: 'motion',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'test',
    ),
    'this test is really a test in test',
    'test 2.13',
  )
})

test('2.14 - normal words, few of them, leftMaybe as array', (t) => {
  t.is(
    er(
      'this emotion is really a promotion in motion',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: ['pro', 'e'],
        searchFor: 'motion',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'test',
    ),
    'this test is really a test in test',
    'test 2.14',
  )
})

test('2.15 - leftMaybe is array, but with only 1 null value', (t) => {
  t.is(
    er(
      'some text',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: [null],
        searchFor: 'look for me',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'replace with me',
    ),
    'some text',
    'test 2.15',
  )
})

test('2.16 - leftMaybe is array, but with only 1 null value', (t) => {
  t.is(
    er(
      'some text',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: [null, null, null],
        searchFor: 'look for me',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'replace with me',
    ),
    'some text',
    'test 2.16',
  )
})

test('2.17 - leftMaybe is couple integers in an array', (t) => {
  t.is(
    er(
      '1234',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: [2, 3],
        searchFor: 4,
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      9,
    ),
    '129',
    'test 2.17',
  )
})

test('2.18 - leftMaybe is couple integers in an array', (t) => {
  t.is(
    er(
      '1234',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: [3, 2],
        searchFor: 4,
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      9,
    ),
    '129',
    'test 2.18',
  )
})

test('2.19 - sneaky case of overlapping leftMaybes', (t) => {
  t.is(
    er(
      'this is a word to be searched for',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: ['be ', 'to be ', 'this not exists'],
        searchFor: 'searched',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'we look',
    ),
    'this is a word we look for',
    'test 2.19.1 - no flag',
  )
  t.is(
    er(
      'this is a word To Be searched for',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: ['be ', 'to be ', 'this not exists'],
        searchFor: 'searched',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
        i: {
          leftMaybe: true,
        },
      },
      'we look',
    ),
    'this is a word we look for',
    'test 2.19.2 - varying case',
  )
  t.is(
    er(
      'this is a word To Be searched for',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: ['this not exists', 'zzz'],
        searchFor: 'searched',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
        i: {
          leftMaybe: true,
        },
      },
      'we look',
    ),
    'this is a word To Be we look for',
    'test 2.19.3',
  )
})

// ==============================
// searchFor + rightMaybe
// ==============================


test('3.1 - right maybe found', (t) => {
  t.is(
    er(
      'a🦄🐴🦄c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: '🦄',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    'a🦄bc',
    'test 3.1.1',
  )
  t.is(
    er(
      'a🦄🐴🦄c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: ['🦄'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    'a🦄bc',
    'test 3.1.2',
  )
})

test('3.2 - two replacements with one rightmaybe, nearby', (t) => {
  t.is(
    er(
      'ab🐴🦄🐴c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: '🦄',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'd',
    ),
    'abddc',
    'test 3.2.1',
  )
  t.is(
    er(
      'ab🐴🦄🐴c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: ['🦄'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'd',
    ),
    'abddc',
    'test 3.2.2',
  )
})

test('3.3 - two consecutive right maybes', (t) => {
  t.is(
    er(
      'ab🦄🐴🦄🐴c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🦄',
        rightMaybe: '🐴',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'd',
    ),
    'abddc',
    'test 3.3.1',
  )
  t.is(
    er(
      'ab🦄🐴🦄🐴c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🦄',
        rightMaybe: ['🐴'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'd',
    ),
    'abddc',
    'test 3.3.2',
  )
})

test('3.4 - futile right maybe', (t) => {
  t.is(
    er(
      '\'🐴',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: '🦄',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'd',
    ),
    '\'d',
    'test 3.4.1',
  )
  t.is(
    er(
      '\'🐴',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: ['🦄'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'd',
    ),
    '\'d',
    'test 3.4.2',
  )
})

test('3.5 - \\n as search string plus right maybe', (t) => {
  t.is(
    er(
      '\na\n\n',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '\n',
        rightMaybe: 'a',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'a',
    ),
    'aaa',
    'test 3.5.1',
  )
  t.is(
    er(
      '\na\n\n',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '\n',
        rightMaybe: ['a'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'a',
    ),
    'aaa',
    'test 3.5.2',
  )
})

test('3.6 - \\n as both searchFor and right maybe, replaced', (t) => {
  t.is(
    er(
      '\n\n\n',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '\n',
        rightMaybe: '\n',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'a',
    ),
    'aa',
    'test 3.6.1',
  )
  t.is(
    er(
      '\n\n\n',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '\n',
        rightMaybe: ['\n'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'a',
    ),
    'aa',
    'test 3.6.2',
  )
})

test('3.7 - rightMaybe with line breaks', (t) => {
  t.is(
    er(
      'a\n\na',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'a',
        rightMaybe: '\n\na',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    'b',
    'test 3.7.1',
  )
  t.is(
    er(
      'a\n\na',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'a',
        rightMaybe: ['\n\na'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    'b',
    'test 3.7.2',
  )
})

test('3.8 - specific case of semi infinite loop with maybe', (t) => {
  t.is(
    er(
      'aaaaab',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'a',
        rightMaybe: 'b',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'a',
    ),
    'aaaaa',
    'test 3.8.1',
  )
  t.is(
    er(
      'aaaaab',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'a',
        rightMaybe: ['b'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'a',
    ),
    'aaaaa',
    'test 3.8.2',
  )
})

test('3.9 - three right maybes (some found)', (t) => {
  t.is(
    er(
      'a🦄🐴🦄c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: ['x', 'c', '🦄'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    'a🦄bc',
    'test 3.9',
  )
})

test('3.10 - three right maybes (searchFor not found)', (t) => {
  t.is(
    er(
      'a🦄🐴🦄c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🍺',
        rightMaybe: ['🦄', '🐴', 'c'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    'a🦄🐴🦄c',
    'test 3.10',
  )
})

test('3.11 - three right maybes (maybes not found)', (t) => {
  t.is(
    er(
      '🍺🦄🐴🦄c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🍺',
        rightMaybe: ['x', 'y', 'z'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      1,
    ),
    '1🦄🐴🦄c',
    'test 3.11',
  )
})

test('3.12.1 - three right maybes (multiple hungry finds)', (t) => {
  t.is(
    er(
      '🐴 ',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: ['🦄', '🍺', 'c'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    'b ',
    'test 3.12.1',
  )
})

test('3.13 - three right maybes (multiple hungry finds)', (t) => {
  t.is(
    er(
      'a🦄🐴🦄🍺c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: ['🦄', '🍺', 'c'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    'a🦄b🍺c',
    'test 3.13',
  )
})

test('3.14 - three right maybes (multiple hungry finds)', (t) => {
  t.is(
    er(
      'a🦄🐴🍺🦄c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: ['🦄', '🍺', 'c'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    'a🦄b🦄c',
    'test 3.14',
  )
})

test('3.15 - three right maybes (multiple hungry finds)', (t) => {
  t.is(
    er(
      'a🦄🐴🦄c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: ['🦄', '🍺', 'c'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    'a🦄bc',
    'test 3.15',
  )
})

test('3.16 - three right maybes (multiple hungry finds)', (t) => {
  t.is(
    er(
      'a🦄🐴🦄🍺c a🦄🐴🍺🦄c a🦄🐴🦄c 🐴',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: ['🦄', '🍺', 'c'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    'a🦄b🍺c a🦄b🦄c a🦄bc b',
    'test 3.16',
  )
})

test('3.17 - three right maybes (multiple hungry finds)', (t) => {
  t.is(
    er(
      '🦄y🦄 🦄y🦄 🦄y🦄 y',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'y',
        rightMaybe: ['🦄'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    '🦄b 🦄b 🦄b b',
    'test 3.17',
  )
})

test('3.18 - three right maybes (multiple hungry finds)', (t) => {
  t.is(
    er(
      '🦄y🦄 🦄y🦄 🦄y🦄 y',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'y',
        rightMaybe: '🦄',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    '🦄b 🦄b 🦄b b',
    'test 3.18',
  )
})
// if leftMaybe is simply merged and not iterated, and is queried to exist
// explicitly as string on the right side of the searchFor, it will not be
// found if the order of array is wrong, yet characters are all the same.

test('3.19 - sneaky array conversion situation', (t) => {
  t.is(
    er(
      'a🦄🐴🦄c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: ['c', '🦄'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    'a🦄bc',
    'test 3.19-1',
  )
  t.is(
    er(
      'a🦄🐴🦄c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: ['🦄', 'c'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    'a🦄bc',
    'test 3.19-2',
  )
})

test('3.20 - normal words, few of them, rightMaybe as array', (t) => {
  t.is(
    er(
      'this protection is promoting the proper propaganda',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'pro',
        rightMaybe: ['tection', 'mot', 'p', 'paganda'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'test',
    ),
    'this test is testing the tester test',
    'test 3.20',
  )
})

test('3.21 - rightMaybe is array, but with only 1 null value', (t) => {
  t.is(
    er(
      'some text',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'look for me',
        rightMaybe: [null],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'replace with me',
    ),
    'some text',
    'test 3.21',
  )
})

test('3.22 - rightMaybe is couple integers in an array', (t) => {
  t.is(
    er(
      '1234',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 2,
        rightMaybe: [3, 4],
        rightOutside: '',
        rightOutsideNot: '',
      },
      9,
    ),
    '194',
    'test 3.22',
  )
})

test('3.23 - sneaky case of overlapping rightMaybes', (t) => {
  t.is(
    er(
      'this is a word to be searched for',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'word',
        rightMaybe: [' to', ' to be', 'word to be'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'x',
    ),
    'this is a x searched for',
    'test 3.23',
  )
})

test('3.24 - case-insensitive flag', (t) => {
  t.is(
    er(
      'aaaC',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'aaa',
        rightMaybe: ['x', 'y', 'z'],
        rightOutside: '',
        rightOutsideNot: '',
        i: {
          rightMaybe: true,
        },
      },
      'x',
    ),
    'xC',
    'test 3.24',
  )
})

// ==============================
// searchFor + both left and right
// ==============================


test('4.1 - left and right maybes as emoji', (t) => {
  t.is(
    er(
      'a🦄🐴🦄a',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '🦄',
        searchFor: '🐴',
        rightMaybe: '🦄',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'z',
    ),
    'aza',
    'test 4.1.1',
  )
  t.is(
    er(
      'a🦄🐴🦄a',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: ['🦄'],
        searchFor: '🐴',
        rightMaybe: ['🦄'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'z',
    ),
    'aza',
    'test 4.1.2',
  )
})

test('4.2 - left and right maybes as text', (t) => {
  t.is(
    er(
      'abc abc abc',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: 'a',
        searchFor: 'b',
        rightMaybe: 'c',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'z',
    ),
    'z z z',
    'test 4.2.1',
  )
  t.is(
    er(
      'abc abc abc',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: ['a', 'c'],
        searchFor: 'b',
        rightMaybe: ['a', 'c'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'z',
    ),
    'z z z',
    'test 4.2.2',
  )
})

test('4.3 - left+right maybes, middle & end of word #1', (t) => {
  t.is(
    er(
      'zzzabc zzzzabczzz abczzzz',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: 'a',
        searchFor: 'b',
        rightMaybe: 'c',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'z',
    ),
    'zzzz zzzzzzzz zzzzz',
    'test 4.3',
  )
})

test('4.4 - left+right maybes, middle & end of word #2', (t) => {
  t.is(
    er(
      'zzz🦄🐴🦄 zzzz🦄🐴🦄zzz 🦄🐴🦄zzzz',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '🦄',
        searchFor: '🐴',
        rightMaybe: '🦄',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'z',
    ),
    'zzzz zzzzzzzz zzzzz',
    'test 4.4',
  )
})

test('4.5 - normal words', (t) => {
  t.is(
    er(
      'aaa some test text testing for somebody',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: ['some '],
        searchFor: 'te',
        rightMaybe: ['st', 'xt', 'sting'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'check',
    ),
    'aaa check check check for somebody',
    'test 4.5',
  )
})

// ==============================
// searchFor + only outsides
// ==============================


test('5.1 - both outsides only, emoji, found', (t) => {
  t.is(
    er(
      '🦄 🐴 🦄',
      {
        leftOutsideNot: '',
        leftOutside: '🦄 ',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: ' 🦄',
        rightOutsideNot: '',
      },
      'z',
    ),
    '🦄 z 🦄',
    'test 5.1.1',
  )
  t.is(
    er(
      '🦄 🐴 🦄',
      {
        leftOutsideNot: '',
        leftOutside: ['🦄 '],
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: [' 🦄'],
        rightOutsideNot: '',
      },
      'z',
    ),
    '🦄 z 🦄',
    'test 5.1.2',
  )
})

test('5.2 - both outsides only, emoji, not found', (t) => {
  t.is(
    er(
      'a 🐴 a',
      {
        leftOutsideNot: '',
        leftOutside: '🦄',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '🦄',
        rightOutsideNot: '',
      },
      'z',
    ),
    'a 🐴 a',
    'test 5.2',
  )
})

test('5.3 - both outsides, emoji, not found', (t) => {
  t.is(
    er(
      '🦄 🐴 a',
      {
        leftOutsideNot: '',
        leftOutside: '🦄',
        leftMaybe: ' ',
        searchFor: '🐴',
        rightMaybe: ' ',
        rightOutside: '🦄',
        rightOutsideNot: '',
      },
      'z',
    ),
    '🦄 🐴 a',
    'test 5.3',
  )
})

test('5.4 - both outsides, emoji, not found #1', (t) => {
  t.is(
    er(
      'a 🐴 a🦄',
      {
        leftOutsideNot: '',
        leftOutside: '🦄',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '🦄',
        rightOutsideNot: '',
      },
      'z',
    ),
    'a 🐴 a🦄',
    'test 5.4',
  )
})

test('5.5 - both outsides, emoji, not found #2', (t) => {
  t.is(
    er(
      'kgldfj lkfjkl jfk \ng \t;lgkh a 🐴 a🦄 slkgj fhjf jkghljk',
      {
        leftOutsideNot: '',
        leftOutside: '🦄',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '🦄',
        rightOutsideNot: '',
      },
      'z',
    ),
    'kgldfj lkfjkl jfk \ng \t;lgkh a 🐴 a🦄 slkgj fhjf jkghljk',
    'test 5.5',
  )
})

test('5.6 - line break as rightOutside, found', (t) => {
  t.is(
    er(
      'aaab\n',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'b',
        rightMaybe: '',
        rightOutside: '\n',
        rightOutsideNot: '',
      },
      'c',
    ),
    'aaac\n',
    'test 5.6',
  )
})

test('5.7 - line breaks as both outsides', (t) => {
  t.is(
    er(
      'aaa\nb\n',
      {
        leftOutsideNot: '',
        leftOutside: '\n',
        leftMaybe: '',
        searchFor: 'b',
        rightMaybe: '',
        rightOutside: '\n',
        rightOutsideNot: '',
      },
      'c',
    ),
    'aaa\nc\n',
    'test 5.7',
  )
})

test('5.8 - \\n as outsides, replacement = undefined', (t) => {
  t.is(
    er(
      'aaa\nb\n',
      {
        leftOutsideNot: '',
        leftOutside: '\n',
        leftMaybe: '',
        searchFor: 'b',
        rightMaybe: '',
        rightOutside: '\n',
        rightOutsideNot: '',
      },
      undefined,
    ),
    'aaa\n\n',
    'test 5.8',
  )
})

test('5.9 - line breaks as outsides, replacement = Bool', (t) => {
  t.is(
    er(
      'aaa\nb\n',
      {
        leftOutsideNot: '',
        leftOutside: '\n',
        leftMaybe: '',
        searchFor: 'b',
        rightMaybe: '',
        rightOutside: '\n',
        rightOutsideNot: '',
      },
      true,
    ),
    'aaa\n\n',
    'test 5.9',
  )
})

test('5.10 - line breaks as outsides, replacement = null', (t) => {
  t.is(
    er(
      'aaa\nb\n',
      {
        leftOutsideNot: '',
        leftOutside: '\n',
        leftMaybe: '',
        searchFor: 'b',
        rightMaybe: '',
        rightOutside: '\n',
        rightOutsideNot: '',
      },
      null,
    ),
    'aaa\n\n',
    'test 5.10',
  )
})

test('5.11 - left outside requirement not satisfied for replacement to happen', (t) => {
  t.is(
    er(
      'aaaBBBccc',
      {
        leftOutsideNot: '',
        leftOutside: 'x',
        leftMaybe: '',
        searchFor: 'bbb',
        rightMaybe: '',
        rightOutside: 'z',
        rightOutsideNot: '',
        i: {
          searchFor: true,
          leftOutside: true,
        },
      },
    ),
    'aaaBBBccc',
    'test 5.11 - did not replace because of o.leftOutside',
  )
})

test('5.12 - right outside requirement not satisfied for replacement to happen', (t) => {
  t.is(
    er(
      'aaaBBBccc',
      {
        leftOutsideNot: '',
        leftOutside: 'x',
        leftMaybe: '',
        searchFor: 'bbb',
        rightMaybe: '',
        rightOutside: 'z',
        rightOutsideNot: '',
        i: {
          searchFor: true,
          rightOutside: true,
        },
      },
    ),
    'aaaBBBccc',
    'test 5.12 - did not replace because of o.rightOutside',
  )
})

// ==============================
// searchFor + maybes + outsides
// ==============================


test('6.1 - maybes and outsides, emoji - full set', (t) => {
  t.is(
    er(
      'a🦄🐴💘b',
      {
        leftOutsideNot: '',
        leftOutside: 'a',
        leftMaybe: '🦄',
        searchFor: '🐴',
        rightMaybe: '💘',
        rightOutside: 'b',
        rightOutsideNot: '',
      },
      '🌟',
    ),
    'a🌟b',
    'test 6.1',
  )
})

test('6.2 - maybes + outsides - 1 of maybes not found #1', (t) => {
  t.is(
    er(
      'a🦄🐴b',
      {
        leftOutsideNot: '',
        leftOutside: 'a',
        leftMaybe: '🦄',
        searchFor: '🐴',
        rightMaybe: '💘',
        rightOutside: 'b',
        rightOutsideNot: '',
      },
      '🌟',
    ),
    'a🌟b',
    'test 6.2',
  )
})

test('6.3 - maybes + outsides - 1 of maybes not found #2', (t) => {
  t.is(
    er(
      'a🐴💘b',
      {
        leftOutsideNot: '',
        leftOutside: 'a',
        leftMaybe: '🦄',
        searchFor: '🐴',
        rightMaybe: '💘',
        rightOutside: 'b',
        rightOutsideNot: '',
      },
      '🌟',
    ),
    'a🌟b',
    'test 6.3',
  )
})

test('6.4 - maybes and outsides, emoji - neither of maybes', (t) => {
  t.is(
    er(
      'a🐴b',
      {
        leftOutsideNot: '',
        leftOutside: 'a',
        leftMaybe: '🦄',
        searchFor: '🐴',
        rightMaybe: '💘',
        rightOutside: 'b',
        rightOutsideNot: '',
      },
      '🌟',
    ),
    'a🌟b',
    'test 6.4',
  )
})

test('6.5 - multiple findings with maybes and outsides', (t) => {
  t.is(
    er(
      'a🦄🐴💘b a🦄🐴💘b a🦄🐴💘b',
      {
        leftOutsideNot: '',
        leftOutside: 'a',
        leftMaybe: '🦄',
        searchFor: '🐴',
        rightMaybe: '💘',
        rightOutside: 'b',
        rightOutsideNot: '',
      },
      '🌟',
    ),
    'a🌟b a🌟b a🌟b',
    'test 6.5',
  )
})

test('6.6 - multiple findings with maybes and not-outsides', (t) => {
  t.is(
    er(
      'z🦄🐴💘b a🦄🐴💘z a🦄🐴💘b z🦄🐴💘z',
      {
        leftOutsideNot: 'a',
        leftOutside: '',
        leftMaybe: '🦄',
        searchFor: '🐴',
        rightMaybe: '💘',
        rightOutside: '',
        rightOutsideNot: 'b',
      },
      '🌟',
    ),
    'z🦄🐴💘b a🦄🐴💘z a🦄🐴💘b z🌟z',
    'test 6.6',
  )
})

test('6.7 - maybes and outsides, arrays', (t) => {
  t.is(
    er(
      'a🦄🐴💘b a💘🐴🦄b a🦄🐴🦄b a💘🐴💘b',
      {
        leftOutsideNot: '',
        leftOutside: 'a',
        leftMaybe: ['🦄', '💘', 'a', 'b'],
        searchFor: '🐴',
        rightMaybe: ['🦄', '💘', 'a', 'b'],
        rightOutside: 'b',
        rightOutsideNot: '',
      },
      '🌟',
    ),
    'a🌟b a🌟b a🌟b a🌟b',
    'test 6.7',
  )
})

// ==============================
// no searchFor + no maybes + outsides
// ==============================


test('7.1 - one rightOutside, not found', (t) => {
  t.is(
    er(
      'aaa🦄a bbbb🦄 cccc🦄',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '',
        rightMaybe: '',
        rightOutside: '🦄',
        rightOutsideNot: '',
      },
      '🌟',
    ),
    'aaa🦄a bbbb🦄 cccc🦄',
    'test 7.1',
  )
})

test('7.2 - one leftOutside, not found', (t) => {
  t.is(
    er(
      '🦄aaaa 🦄bbbb 🦄cccc',
      {
        leftOutsideNot: '',
        leftOutside: '🦄',
        leftMaybe: '',
        searchFor: '',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      '🌟',
    ),
    '🦄aaaa 🦄bbbb 🦄cccc',
    'test 7.2',
  )
})

test('7.3 - one leftOutside, not found + null replacement', (t) => {
  t.is(
    er(
      'aa🦄aa bb🦄bb cc🦄cc',
      {
        leftOutsideNot: '',
        leftOutside: '🦄',
        leftMaybe: '',
        searchFor: '',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      null,
    ),
    'aa🦄aa bb🦄bb cc🦄cc',
    'test 7.3',
  )
})

test('7.4 - leftOutside and replacement are null', (t) => {
  t.is(
    er(
      'aaaa bbbb cccc',
      {
        leftOutside: null,
      },
      null,
    ),
    'aaaa bbbb cccc',
    'test 7.4',
  )
})

test('7.5 - left outside and replacement are undefined', (t) => {
  t.is(
    er(
      'aaaa bbbb cccc',
      {
        leftOutside: undefined,
      },
      undefined,
    ),
    'aaaa bbbb cccc',
    'test 7.5',
  )
})

// ==============================
// infinite loop cases
// ==============================


test('8.1 - infinite loop, no maybes, emoji', (t) => {
  t.is(
    er(
      '🐴🦄🐴🦄🐴',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      '🐴',
    ),
    '🐴🦄🐴🦄🐴',
    'test 8.1',
  )
})

test('8.2 - infinite loop, maybes, multiple findings, emoji', (t) => {
  t.is(
    er(
      '🐴🦄🐴🦄🐴',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: '🦄',
        rightOutside: '',
        rightOutsideNot: '',
      },
      '🐴',
    ),
    '🐴🐴🐴',
    'test 8.2',
  )
})

test('8.3 - infinite loop protection, emoji replaced with itself', (t) => {
  t.is(
    er(
      '🐴',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      '🐴',
    ),
    '🐴',
    'test 8.3',
  )
})

test('8.4 - infinite loop protection, right outside', (t) => {
  t.is(
    er(
      '🐴🦄🐴🦄🐴',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '🦄',
        rightOutsideNot: '',
      },
      '🐴',
    ),
    '🐴🦄🐴🦄🐴',
    'test 8.4',
  )
})

test('8.5 - infinite loop protection, multiples', (t) => {
  t.is(
    er(
      '🦄🦄🦄🦄zaaaaaaaaa🦄🦄🦄🦄🦄🦄',
      {
        leftOutsideNot: 'a',
        leftOutside: '🦄🦄🦄',
        leftMaybe: '',
        searchFor: '🦄',
        rightMaybe: '🦄',
        rightOutside: '🦄',
        rightOutsideNot: '',
      },
      '🌟',
    ),
    '🦄🦄🦄🦄zaaaaaaaaa🦄🦄🦄🌟🦄',
    'test 8.5',
  )
})

test('8.6 - simple infinite loop case', (t) => {
  t.is(
    er(
      'a',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'a',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'a',
    ),
    'a',
    'test 8.6',
  )
})

test('8.7 - infinite loop, not found', (t) => {
  t.is(
    er(
      '',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'a',
    ),
    '',
    'test 8.7',
  )
})

// ==============================
// missing searchFor value
// ==============================


test('9.1 - source present, missing searchFor', (t) => {
  t.is(
    er(
      'aaa',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      '',
    ),
    'aaa',
    'test 9.1',
  )
})

test('9.2 - everything is missing', (t) => {
  t.is(
    er(
      '',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      '',
    ),
    '',
    'test 9.2',
  )
})

test('9.3 - everything seriously missing', (t) => {
  t.is(
    er('', {}, ''),
    '',
    'test 9.3',
  )
})

test('9.4 - everything extremely seriously missing', (t) => {
  t.is(
    er('', {}),
    '',
    'test 9.4',
  )
})

test('9.5 - everything truly extremely seriously missing', (t) => {
  t.is(
    er(''),
    '',
    'test 9.5',
  )
})

test('9.6 - everything really truly extremely seriously missing', (t) => {
  t.is(
    er(),
    '',
    'test 9.6',
  )
})

test('9.7 - leftOutsideNot blocking rightOutsideNot being empty', (t) => {
  t.is(
    er(
      'ab a',
      {
        leftOutsideNot: [''],
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'a',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: 'b',
      },
      'x',
    ),
    'ab x',
    'test 9.7',
  )
})

test('9.8 - leftOutsideNot is blank array', (t) => {
  t.is(
    er(
      'ab a',
      {
        leftOutsideNot: [],
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'a',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: 'b',
      },
      'x',
    ),
    'ab x',
    'test 9.8',
  )
})

test('9.9 - missing key in properties obj', (t) => {
  t.is(
    er(
      'ab a',
      {
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'a',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: 'b',
      },
      'x',
    ),
    'ab x',
    'test 9.9',
  )
})

// ==============================
// missing replacement value = asking for delete mode
// ==============================


test('10.1 - empty string as replacement = deletion mode', (t) => {
  t.is(
    er(
      'a🦄🐴🦄a',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '🦄',
        searchFor: '🐴',
        rightMaybe: '🦄',
        rightOutside: '',
        rightOutsideNot: '',
      },
      '',
    ),
    'aa',
    'test 10.1',
  )
})

test('10.2 - null as replacement = deletion mode', (t) => {
  t.is(
    er(
      'a🦄🐴🦄a',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '🦄',
        searchFor: '🐴',
        rightMaybe: '🦄',
        rightOutside: '',
        rightOutsideNot: '',
      },
      null,
    ),
    'aa',
    'test 10.2',
  )
})

test('10.3 - replacement bool, nothing left', (t) => {
  t.is(
    er(
      '🐴',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '🦄',
        searchFor: '🐴',
        rightMaybe: '🦄',
        rightOutside: '',
        rightOutsideNot: '',
      },
      true,
    ),
    '',
    'test 10.3',
  )
})

test('10.4 - replacement Bool, nothing left, searchFor Integer', (t) => {
  t.is(
    er(
      '2',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 2,
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      false,
    ),
    '',
    'test 10.4',
  )
})

test('10.5 - nothing left, replacement undefined', (t) => {
  t.is(
    er(
      'fljlh fdlg ldfhgl abc aldjsdlflkjd ljfl fgklh fl',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'fljlh fdlg ldfhgl abc aldjsdlflkjd ljfl fgklh fl',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      undefined,
    ),
    '',
    'test 10.5',
  )
})

test('10.6 - nothing left - more undefined', (t) => {
  t.is(
    er(
      'zzz',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'zzz',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      undefined,
    ),
    '',
    'test 10.6',
  )
})

test('10.7 - emoji, null replacement, both outsides found', (t) => {
  t.is(
    er(
      'a🦄🐴🦄a',
      {
        leftOutsideNot: '',
        leftOutside: '🦄',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '🦄',
        rightOutsideNot: '',
      },
      null,
    ),
    'a🦄🦄a',
    'test 10.7',
  )
})

test('10.8 - raw integers everywhere must work too', (t) => {
  t.is(
    er(
      6,
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 6,
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      9,
    ),
    '9',
    'test 10.8',
  )
})

test('10.9 - searchFor is an array of 1 element', (t) => {
  t.is(
    er(
      'a b c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: ['b'],
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'd',
    ),
    'a d c',
    'test 10.9',
  )
})

test('10.10 - searchFor is an array of few elements (no find)', (t) => {
  t.is(
    er(
      'a b c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: ['b', 'x'],
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'd',
    ),
    'a b c',
    'test 10.10',
  )
})

test('10.11 - searchFor is an array of few elements (won\'t work)', (t) => {
  t.is(
    er(
      'a bx c',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: ['b', 'x'],
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'd',
    ),
    'a bx c',
    'test 10.11',
  )
})

// ==============================
// outsides
// ==============================


test('11.1 - left and right outsides as arrays (majority found)', (t) => {
  t.is(
    er(
      '🐴 a🦄🐴💘a a💘🐴🦄a a💘🐴💘a a🦄🐴🦄a 🐴',
      {
        leftOutsideNot: '',
        leftOutside: ['🦄', '💘', 'doesn\'t exist', 'this one too'],
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: ['more stuff here', 'and here', '🦄', '💘'],
        rightOutsideNot: '',
      },
      'c',
    ),
    '🐴 a🦄c💘a a💘c🦄a a💘c💘a a🦄c🦄a 🐴',
    'test 11.1',
  )
})


test('11.2 - left and right outsides as arrays (one found)', (t) => {
  t.is(
    er(
      '🐴 a🦄🐴💘a a💘🐴🦄a a💘🐴💘a a🦄🐴🦄a 🐴',
      {
        leftOutsideNot: '',
        leftOutside: ['🦄', 'doesn\'t exist', 'this one too'],
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: ['more stuff here', 'and here', '💘'],
        rightOutsideNot: '',
      },
      'c',
    ),
    '🐴 a🦄c💘a a💘🐴🦄a a💘🐴💘a a🦄🐴🦄a 🐴',
    'test 11.2',
  )
})


test('11.3 - outsides as arrays, beyond found maybes', (t) => {
  t.is(
    er(
      '🦄🐴 a🦄🐴💘a a💘🐴🦄a a💘🐴💘a a🦄🐴🦄a 🐴🦄',
      {
        leftOutsideNot: '',
        leftOutside: ['a'],
        leftMaybe: ['🦄', '💘'],
        searchFor: '🐴',
        rightMaybe: ['🦄', '💘'],
        rightOutside: ['a'],
        rightOutsideNot: '',
      },
      'c',
    ),
    '🦄🐴 aca aca aca aca 🐴🦄',
    'test 11.3',
  )
})


test('11.4 - outsides as arrays blocking maybes', (t) => {
  t.is(
    er(
      '🦄🐴 a🦄🐴💘a a💘🐴🦄a a💘🐴💘a a🦄🐴🦄a 🐴🦄',
      {
        leftOutsideNot: '',
        leftOutside: ['b'],
        leftMaybe: ['🦄', '💘'],
        searchFor: '🐴',
        rightMaybe: ['🦄', '💘'],
        rightOutside: ['b'],
        rightOutsideNot: '',
      },
      'whatevs',
    ),
    '🦄🐴 a🦄🐴💘a a💘🐴🦄a a💘🐴💘a a🦄🐴🦄a 🐴🦄',
    'test 11.4',
  )
})


test('11.5 - maybes matching outsides, blocking them', (t) => {
  t.is(
    er(
      '🦄🐴 a🦄🐴💘a a💘🐴🦄a a💘🐴💘a a🦄🐴🦄a 🐴🦄',
      {
        leftOutsideNot: '',
        leftOutside: ['🦄', '💘'],
        leftMaybe: ['🦄', '💘'],
        searchFor: '🐴',
        rightMaybe: ['🦄', '💘'],
        rightOutside: ['🦄', '💘'],
        rightOutsideNot: '',
      },
      'whatevs',
    ),
    '🦄🐴 a🦄🐴💘a a💘🐴🦄a a💘🐴💘a a🦄🐴🦄a 🐴🦄',
    'test 11.5',
  )
})


test('11.6 - maybes matching outsides, blocking them', (t) => {
  t.is(
    er(
      '🦄🐴 a🦄🐴💘a a💘🐴🦄a a💘🐴💘a a🦄🐴🦄a 🐴🦄',
      {
        leftOutsideNot: '',
        leftOutside: ['🦄', '💘'],
        leftMaybe: ['🦄', '💘'],
        searchFor: '🐴',
        rightMaybe: ['🦄', '💘'],
        rightOutside: ['🦄', '💘'],
        rightOutsideNot: '',
      },
      'whatevs',
    ),
    '🦄🐴 a🦄🐴💘a a💘🐴🦄a a💘🐴💘a a🦄🐴🦄a 🐴🦄',
    'test 11.6',
  )
})


test('11.6 - maybes matching outsides, found', (t) => {
  t.is(
    er(
      '🦄🐴🦄 a💘🦄🐴💘🦄a a🦄💘🐴🦄💘a a💘💘🐴💘💘a a🦄🦄🐴🦄🦄a 🦄🐴🦄',
      {
        leftOutsideNot: '',
        leftOutside: ['🦄', '💘'],
        leftMaybe: ['🦄', '💘'],
        searchFor: '🐴',
        rightMaybe: ['🦄', '💘'],
        rightOutside: ['🦄', '💘'],
        rightOutsideNot: '',
      },
      'c',
    ),
    '🦄🐴🦄 a💘c🦄a a🦄c💘a a💘c💘a a🦄c🦄a 🦄🐴🦄',
    'test 11.6',
  )
})


test('11.6 - maybes matching outsides, mismatching', (t) => {
  t.is(
    er(
      '🍺🐴🍺 a💘🍺🐴🌟🦄a a🦄🌟🐴🍺💘a a💘🌟🐴🌟💘a a🦄🍺🐴🍺🦄a 🌟🐴🌟',
      {
        leftOutsideNot: '',
        leftOutside: ['🦄', '💘'],
        leftMaybe: ['🍺', '🌟'],
        searchFor: '🐴',
        rightMaybe: ['🍺', '🌟'],
        rightOutside: ['🦄', '💘'],
        rightOutsideNot: '',
      },
      'c',
    ),
    '🍺🐴🍺 a💘c🦄a a🦄c💘a a💘c💘a a🦄c🦄a 🌟🐴🌟',
    'test 11.6',
  )
})


test('11.7 - rightOutside & with case-insensitive flag', (t) => {
  t.is(
    er(
      'aaaBBBccc aaazzzCCC aaaCCC',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'aaa',
        rightMaybe: '',
        rightOutside: 'u',
        rightOutsideNot: '',
      },
      '!',
    ),
    'aaaBBBccc aaazzzCCC aaaCCC',
    'test 11.7.1 - nothing matches, without flag',
  )
  t.is(
    er(
      'aaaBBBccc aaazzzCCC aaaCCC',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'aaa',
        rightMaybe: '',
        rightOutside: 'u',
        rightOutsideNot: '',
        i: {
          rightOutside: true,
        },
      },
      '!',
    ),
    'aaaBBBccc aaazzzCCC aaaCCC',
    'test 11.7.2 - nothing matches, with flag',
  )
  t.is(
    er(
      'aaaBBBccc aaazzzCCC aaaCCC',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'aaa',
        rightMaybe: '',
        rightOutside: 'c',
        rightOutsideNot: '',
        i: {
          rightOutside: true,
        },
      },
      '!',
    ),
    'aaaBBBccc aaazzzCCC !CCC',
    'test 11.7.3 - one match, with flag',
  )
})

// ==============================
// outsideNot's
// ==============================


test('12.1 - rightOutsideNot satisfied thus not replaced', (t) => {
  t.is(
    er(
      '🐴a',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: 'a',
      },
      'c',
    ),
    '🐴a',
    'test 12.1.1',
  )
  t.is(
    er(
      '🐴a',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: ['a'],
      },
      'c',
    ),
    '🐴a',
    'test 12.1.2',
  )
})

test('12.2 - outsideNot left satisfied thus not replaced', (t) => {
  t.is(
    er(
      'a🐴',
      {
        leftOutsideNot: 'a',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'c',
    ),
    'a🐴',
    'test 12.2.1',
  )
  t.is(
    er(
      'a🐴',
      {
        leftOutsideNot: ['a'],
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'c',
    ),
    'a🐴',
    'test 12.2.2',
  )
})

test('12.3 - outsideNot\'s satisfied thus not replaced', (t) => {
  t.is(
    er(
      'a🐴a',
      {
        leftOutsideNot: 'a',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: 'a',
      },
      'c',
    ),
    'a🐴a',
    'test 12.3',
  )
})

test('12.4 - outsideNot\'s not satisfied, with 1 maybe replaced', (t) => {
  t.is(
    er(
      'zb🐴y',
      {
        leftOutsideNot: 'a',
        leftOutside: '',
        leftMaybe: 'b',
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: 'c',
      },
      '🦄',
    ),
    'z🦄y',
    'test 12.4',
  )
})

test('12.5 - leftOutsideNot blocked positive leftMaybe', (t) => {
  t.is(
    er(
      'zb🐴y',
      {
        leftOutsideNot: 'z',
        leftOutside: '',
        leftMaybe: 'b',
        searchFor: '🐴',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'whatevs',
    ),
    'zb🐴y',
    'test 12.5',
  )
})

test('12.6 - rightOutsideNot blocked both L-R maybes', (t) => {
  t.is(
    er(
      'zb🐴cy',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: ['b', 'a'],
        searchFor: '🐴',
        rightMaybe: ['a', 'c'],
        rightOutside: '',
        rightOutsideNot: ['y', 'a'],
      },
      'whatevs',
    ),
    'zb🐴cy',
    'test 12.6',
  )
})

test('12.7 - rightOutsideNot last char goes outside', (t) => {
  t.is(
    er(
      'cccccccca',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'a',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: 'b',
      },
      'b',
    ),
    'ccccccccb',
    'test 12.7',
  )
})

test('12.8 - right maybe is last char, outsideNot satisfied', (t) => {
  t.is(
    er(
      'cccccccca',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'c',
        rightMaybe: 'a',
        rightOutside: '',
        rightOutsideNot: 'c',
      },
      'c',
    ),
    'cccccccc',
    'test 12.8',
  )
})

test('12.9 - real life scenario, missing semicol on nbsp #1', (t) => {
  t.is(
    er(
      '&nbsp; &nbsp &nbsp',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'nbsp',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: ';',
      },
      'nbsp;',
    ),
    '&nbsp; &nbsp; &nbsp;',
    'test 12.9',
  )
})

test('12.10 - real life scenario, missing semicol on nbsp #2', (t) => {
  t.is(
    er(
      '&nbsp;&nbsp&nbsp',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'nbsp',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: ';',
      },
      'nbsp;',
    ),
    '&nbsp;&nbsp;&nbsp;',
    'test 12.10',
  )
})

test('12.11 - real life scenario, missing ampersand, text', (t) => {
  t.is(
    er(
      'tralalalanbsp;nbsp;&nbsp;',
      {
        leftOutsideNot: '&',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'nbsp',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      '&nbsp',
    ),
    'tralalala&nbsp;&nbsp;&nbsp;',
    'test 12.11',
  )
})

test('12.12 - as before but with emoji instead', (t) => {
  t.is(
    er(
      '🍺🍺👌🍺',
      {
        leftOutsideNot: '👌',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🍺',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      '🍻',
    ),
    '🍻🍻👌🍺',
    'test 12.12',
  )
})

test('12.13 - rightOutsideNot with L-R maybes', (t) => {
  t.is(
    er(
      'zb🐴cy',
      {
        leftOutsideNot: ['a'],
        leftOutside: '',
        leftMaybe: ['b', 'a'],
        searchFor: '🐴',
        rightMaybe: ['a', 'c'],
        rightOutside: '',
        rightOutsideNot: ['c', 'a'],
      },
      'x',
    ),
    'zxy',
    'test 12.13',
  )
})

test('12.14 - all of \'em #1', (t) => {
  t.is(
    er(
      'zb🐴cy',
      {
        leftOutsideNot: ['c', 'b'],
        leftOutside: ['z', 'y'],
        leftMaybe: ['a', 'b', 'c'],
        searchFor: '🐴',
        rightMaybe: ['a', 'b', 'c'],
        rightOutside: ['z', 'y'],
        rightOutsideNot: ['c', 'b'],
      },
      'x',
    ),
    'zxy',
    'test 12.14',
  )
})

test('12.14 - all of \'em #2', (t) => {
  t.is(
    er(
      'zb🐴cy',
      {
        leftOutsideNot: ['', '', ''],
        leftOutside: ['z', 'y'],
        leftMaybe: ['a', 'b', 'c'],
        searchFor: '🐴',
        rightMaybe: ['a', 'b', 'c'],
        rightOutside: ['z', 'y'],
        rightOutsideNot: ['', '', ''],
      },
      'x',
    ),
    'zxy',
    'test 12.14',
  )
})

// ==============================
// double-check the README's corectness
// ==============================


test('13.1 - readme example #1', (t) => {
  t.is(
    er(
      'a x c x d',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'x',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      '🦄',
    ),
    'a 🦄 c 🦄 d',
    'test 13.1',
  )
})

test('13.2 - readme example #2', (t) => {
  t.is(
    er(
      '🐴i🦄 🐴i i🦄 i',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: ['🐴', '🦄'],
        searchFor: 'i',
        rightMaybe: ['🐴', '🦄'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'x',
    ),
    'x x x x',
    'test 13.2',
  )
})

test('13.3 - readme example #3', (t) => {
  t.is(
    er(
      'a🦄c x🦄x',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🦄',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: ['c', 'd'],
      },
      '🐴',
    ),
    'a🦄c x🐴x',
    'test 13.3',
  )
})

test('13.4 - readme example #4', (t) => {
  t.is(
    er(
      'zzzzz  zzzzzz zzzzzz',
      {
        leftOutsideNot: '',
        leftOutside: ' ',
        leftMaybe: '',
        searchFor: ' ',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      '',
    ),
    'zzzzz zzzzzz zzzzzz',
    'test 13.4',
  )
})

test('13.5 - readme example #5', (t) => {
  t.is(
    er(
      '<br /><br/><br />',
      {
        leftOutsideNot: ' ',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '/>',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      ' />',
    ),
    '<br /><br /><br />',
    'test 13.5',
  )
})

test('13.6 - readme example #6', (t) => {
  t.is(
    er(
      '&nbsp; nbsp &nbsp nbsp;',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '&',
        searchFor: 'nbsp',
        rightMaybe: ';',
        rightOutside: '',
        rightOutsideNot: '',
      },
      '&nbsp;',
    ),
    '&nbsp; &nbsp; &nbsp; &nbsp;',
    'test 13.6',
  )
})

// ==============================
// random tests from the front lines
// ==============================


test('14.1 - special case #1', (t) => {
  t.is(
    er(
      '&fnof;',
      {
        leftOutsideNot: 'e',
        leftOutside: '',
        leftMaybe: '&',
        searchFor: 'nsp;',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      '&nbsp;',
    ),
    '&fnof;',
    'test 14.1',
  )
})

test('14.2 - special case #2', (t) => {
  t.is(
    er(
      '🐴 a🦄🐴🦄🍺c a🦄🐴🍺🦄c a🦄🐴🦄c a🐴🍺c 🐴',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: '🐴',
        rightMaybe: ['🦄', '🍺', 'c'],
        rightOutside: '',
        rightOutsideNot: '',
      },
      'b',
    ),
    'b a🦄b🍺c a🦄b🦄c a🦄bc abc b',
    'test 14.1',
  )
})

// ==============================
// case-insensitive opts flag
// ==============================


test('15.1 - case-insensitive flag works', (t) => {
  t.is(
    er(
      'zzz abbb zzz',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: 'a',
        searchFor: 'bbb',
        rightMaybe: 'c',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'yyy',
    ),
    'zzz yyy zzz',
    'test 15.1.1 - all ok, flag off',
  )
  t.is(
    er(
      'zzz aBBB zzz',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: 'a',
        searchFor: 'bbb',
        rightMaybe: 'c',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'yyy',
    ),
    'zzz aBBB zzz',
    'test 15.1.2 - case mismatch, nothing replaced because flag\'s off',
  )
  t.is(
    er(
      'zzz aBBB zzz',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: 'a',
        searchFor: 'bbb',
        rightMaybe: 'c',
        rightOutside: '',
        rightOutsideNot: '',
        i: {
          searchFor: true,
        },
      },
      'yyy',
    ),
    'zzz yyy zzz',
    'test 15.1.3 - case mismatch, but flag allows it, so replace happens',
  )
  t.is(
    er(
      'zzz aBBB zzz bbB zzz aBbBc zzz',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: 'a',
        searchFor: 'bbb',
        rightMaybe: 'c',
        rightOutside: '',
        rightOutsideNot: '',
        i: {
          searchFor: true,
        },
      },
      'yyy',
    ),
    'zzz yyy zzz yyy zzz yyy zzz',
    'test 15.1.4 - case-insensitive flag, multiple replacements',
  )
})


test('test 15.2 - case-insensitive leftMaybe', (t) => {
  t.is(
    er(
      'zzz Abbb zzz',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: 'a',
        searchFor: 'bbb',
        rightMaybe: 'c',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'yyy',
    ),
    'zzz Ayyy zzz',
    'test 15.2.1 - flag off - testing leftMaybe only',
  )
  t.is(
    er(
      'zzz Abbb zzz',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: 'a',
        searchFor: 'bbb',
        rightMaybe: 'c',
        rightOutside: '',
        rightOutsideNot: '',
        i: {
          leftMaybe: true,
        },
      },
      'yyy',
    ),
    'zzz yyy zzz',
    'test 15.2.2 - flag on - testing leftMaybe only',
  )
  t.is(
    er(
      'zzz Abbb zzz',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: 'a',
        searchFor: 'bBb',
        rightMaybe: 'c',
        rightOutside: '',
        rightOutsideNot: '',
        i: {
          leftMaybe: true,
        },
      },
      'yyy',
    ),
    'zzz Abbb zzz',
    'test 15.2.3 - flag on - testing searchFor + leftMaybe',
  )
  t.is(
    er(
      'zzz Abbb zzz',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: 'a',
        searchFor: 'bBb',
        rightMaybe: 'c',
        rightOutside: '',
        rightOutsideNot: '',
        i: {
          leftMaybe: true,
          searchFor: true,
        },
      },
      'yyy',
    ),
    'zzz yyy zzz',
    'test 15.2.4 - flag on - testing searchFor + leftMaybe',
  )
})


test('test 15.3 - case-insensitive rightMaybe', (t) => {
  t.is(
    er(
      'zzz bbbC zzz',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: 'a',
        searchFor: 'bbb',
        rightMaybe: 'c',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'yyy',
    ),
    'zzz yyyC zzz',
    'test 15.3.1 - flag off - testing rightMaybe only',
  )
  t.is(
    er(
      'zzz bbbC zzz',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: 'a',
        searchFor: 'bbb',
        rightMaybe: 'c',
        rightOutside: '',
        rightOutsideNot: '',
        i: {
          rightMaybe: true,
        },
      },
      'yyy',
    ),
    'zzz yyy zzz',
    'test 15.3.2 - flag on - testing rightMaybe only',
  )
  t.is(
    er(
      'zzz bbbC zzz',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: 'a',
        searchFor: 'bBb',
        rightMaybe: 'c',
        rightOutside: '',
        rightOutsideNot: '',
        i: {
          rightMaybe: true,
        },
      },
      'yyy',
    ),
    'zzz bbbC zzz',
    'test 15.3.3 - flag on - testing searchFor + rightMaybe',
  )
  t.is(
    er(
      'zzz bbbC zzz',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: 'a',
        searchFor: 'bBb',
        rightMaybe: 'c',
        rightOutside: '',
        rightOutsideNot: '',
        i: {
          rightMaybe: true,
          searchFor: true,
        },
      },
      'yyy',
    ),
    'zzz yyy zzz',
    'test 15.3.4 - flag on - testing searchFor + rightMaybe',
  )
})


test('test 15.4 - case-insensitive leftOutside', (t) => {
  t.is(
    er(
      'zzz Abbb zzz',
      {
        leftOutsideNot: '',
        leftOutside: 'a',
        leftMaybe: '',
        searchFor: 'bbb',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'yyy',
    ),
    'zzz Abbb zzz',
    'test 15.4.1 - flag off - testing leftOutside only',
  )
  t.is(
    er(
      'zzz Abbb zzz',
      {
        leftOutsideNot: '',
        leftOutside: 'a',
        leftMaybe: '',
        searchFor: 'bbb',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
        i: {
          leftOutside: true,
        },
      },
      'yyy',
    ),
    'zzz Ayyy zzz',
    'test 15.4.2 - flag on - testing leftOutside only',
  )
  t.is(
    er(
      'zzz Abbb zzz',
      {
        leftOutsideNot: '',
        leftOutside: 'a',
        leftMaybe: '',
        searchFor: 'bBb',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
        i: {
          leftOutside: true,
        },
      },
      'yyy',
    ),
    'zzz Abbb zzz',
    'test 15.4.3 - flag on - testing searchFor + leftOutside',
  )
  t.is(
    er(
      'zzz Abbb zzz',
      {
        leftOutsideNot: '',
        leftOutside: 'a',
        leftMaybe: '',
        searchFor: 'bBb',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
        i: {
          leftOutside: true,
          searchFor: true,
        },
      },
      'yyy',
    ),
    'zzz Ayyy zzz',
    'test 15.4.4 - flag on - testing searchFor + leftOutside',
  )
})


test('test 15.5 - case-insensitive rightOutside', (t) => {
  t.is(
    er(
      'zzz bbbC zzz',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'bbb',
        rightMaybe: '',
        rightOutside: 'c',
        rightOutsideNot: '',
      },
      'yyy',
    ),
    'zzz bbbC zzz',
    'test 15.5.1 - flag off - testing rightOutside only',
  )
  t.is(
    er(
      'zzz bbbC zzz',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'bbb',
        rightMaybe: '',
        rightOutside: 'c',
        rightOutsideNot: '',
        i: {
          rightOutside: true,
        },
      },
      'yyy',
    ),
    'zzz yyyC zzz',
    'test 15.5.2 - flag on - testing rightOutside only',
  )
  t.is(
    er(
      'zzz bbbC zzz',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'bBb',
        rightMaybe: '',
        rightOutside: 'c',
        rightOutsideNot: '',
        i: {
          rightOutside: true,
        },
      },
      'yyy',
    ),
    'zzz bbbC zzz',
    'test 15.5.3 - flag on - testing searchFor + rightOutside',
  )
  t.is(
    er(
      'zzz bbbC zzz',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'bBb',
        rightMaybe: '',
        rightOutside: 'c',
        rightOutsideNot: '',
        i: {
          rightOutside: true,
          searchFor: true,
        },
      },
      'yyy',
    ),
    'zzz yyyC zzz',
    'test 15.5.4 - flag on - testing searchFor + rightOutside',
  )
})


test('test 15.6 - case-insensitive leftOutsideNot', (t) => {
  t.is(
    er(
      'zzz Abbb zzz',
      {
        leftOutsideNot: 'a',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'bbb',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
      },
      'yyy',
    ),
    'zzz Ayyy zzz',
    'test 15.6.1 - flag off - testing leftOutsideNot only',
  )
  t.is(
    er(
      'zzz Abbb zzz',
      {
        leftOutsideNot: 'a',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'bbb',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
        i: {
          leftOutsideNot: true,
        },
      },
      'yyy',
    ),
    'zzz Abbb zzz',
    'test 15.6.2 - flag on - testing leftOutsideNot only',
  )
  t.is(
    er(
      'zzz Abbb zzz',
      {
        leftOutsideNot: 'a',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'bBb',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
        i: {
          leftOutsideNot: true,
        },
      },
      'yyy',
    ),
    'zzz Abbb zzz',
    'test 15.6.3 - flag on - testing searchFor + leftOutsideNot',
  )
  t.is(
    er(
      'zzz Abbb zzz',
      {
        leftOutsideNot: 'a',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'bBb',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
        i: {
          leftOutsideNot: true,
          searchFor: true,
        },
      },
      'yyy',
    ),
    'zzz Abbb zzz',
    'test 15.6.4 - flag on - testing searchFor + leftOutsideNot',
  )
  t.is(
    er(
      'zzz Abbb zzz',
      {
        leftOutsideNot: 'a',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'bBb',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: '',
        i: {
          leftOutsideNot: false,
          searchFor: true,
        },
      },
      'yyy',
    ),
    'zzz Ayyy zzz',
    'test 15.6.5 - flag on - testing searchFor + leftOutsideNot',
  )
})


test('test 15.7 - case-insensitive rightOutsideNot', (t) => {
  t.is(
    er(
      'zzz bbbC zzz',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'bbb',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: 'c',
      },
      'yyy',
    ),
    'zzz yyyC zzz',
    'test 15.7.1 - flag off - testing rightOutsideNot only',
  )
  t.is(
    er(
      'zzz bbbC zzz',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'bbb',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: 'c',
        i: {
          rightOutsideNot: true,
        },
      },
      'yyy',
    ),
    'zzz bbbC zzz',
    'test 15.7.2 - flag on - testing rightOutsideNot only',
  )
  t.is(
    er(
      'zzz bbbC zzz',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'bBb',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: 'c',
        i: {
          rightOutsideNot: true,
        },
      },
      'yyy',
    ),
    'zzz bbbC zzz',
    'test 15.7.3 - flag on - testing searchFor + rightOutsideNot',
  )
  t.is(
    er(
      'zzz bbbC zzz',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'bBb',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: 'c',
        i: {
          rightOutsideNot: true,
          searchFor: true,
        },
      },
      'yyy',
    ),
    'zzz bbbC zzz',
    'test 15.7.4 - flag on - testing searchFor + rightOutsideNot',
  )
  t.is(
    er(
      'zzz bbbC zzz',
      {
        leftOutsideNot: '',
        leftOutside: '',
        leftMaybe: '',
        searchFor: 'bBb',
        rightMaybe: '',
        rightOutside: '',
        rightOutsideNot: 'c',
        i: {
          rightOutsideNot: false,
          searchFor: true,
        },
      },
      'yyy',
    ),
    'zzz yyyC zzz',
    'test 15.7.5 - flag on - testing searchFor + rightOutsideNot',
  )
})
