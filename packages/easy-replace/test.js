import test from 'ava'
import er from './er.js'

// ==============================
// only the string to search for
// ==============================

test('test 1.1', function (t) {
  t.is(er(
    'a b c',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: 'b',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'd'
    ),
    'a d c',
    'test 1.1 - simple replace with letter'
  )
})
test('test 1.2', function (t) {
  t.is(er(
    '🐴 🦄 🐴',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '🦄',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    '💖'
    ),
    '🐴 💖 🐴',
    'test 1.2 - simple replace with emoji'
  )
})
test('test 1.3', function (t) {
  t.is(er(
    '🐴 🦄 🐴',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '🦄',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    '💖'
    ),
    '🐴 💖 🐴',
    'test 1.3 - simple replace, more emoji'
  )
})
test('test 1.4', function (t) {
  t.is(er(
    'ljghdfjkgzh\ud83e\udd8dlkgljd',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '\ud83e\udd8d',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    ' Gorilla '
    ),
    'ljghdfjkgzh Gorilla lkgljd',
    'test 1.4 - newest baddest emoji - gorilla - http://unicode-table.com/en/1F98D/'
  )
})
test('test 1.5', function (t) {
  t.is(er(
    'ljghdfjkgzh🦍lkgljd',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '🦍',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'gorilla'
    ),
    'ljghdfjkgzhgorillalkgljd',
    'test 1.5 - raw gorilla char pasted in utf8 - http://unicode-table.com/en/1F98D/'
  )
})
test('test 1.6', function (t) {
  t.is(er(
    'a b c',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: 'z',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'd'
    ),
    'a b c',
    'test 1.6 - won\'t find, simle letter'
  )
})
test('test 1.7', function (t) {
  t.is(er(
    'a\nb\nc',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '🦄',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'd'
    ),
    'a\nb\nc',
    'test 1.7 - won\'t find, emoji, new lines'
  )
})
test('test 1.8', function (t) {
  t.is(er(
    'a\nb',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: 'a\nb',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'c\nd'
    ),
    'c\nd',
    'test 1.8 - replacement with new lines'
  )
})
test('test 1.9', function (t) {
  t.is(er(
    'a a a a a b',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: 'a',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'c'
    ),
    'c c c c c b',
    'test 1.9 - multiple findings'
  )
})
test('test 1.10', function (t) {
  t.is(er(
    '0',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '0',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    '1'
    ),
    '1',
    'case #10 - single digit in string format'
  )
})
test('test 1.11', function (t) {
  t.is(er(
    0,
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '0',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    1
    ),
    '1',
    'case #11 - real digits passed as source and replacement'
  )
})
test('test 1.12', function (t) {
  t.is(er(
    0,
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: 0,
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    1
    ),
    '1',
    'test 1.12 - real digits passed as source and replacement'
  )
})
test('test 1.13', function (t) {
  t.is(er(
    0,
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: 0,
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    1
    ),
    '1',
    'case #13 - real digits passed everywhere'
  )
})

// ==============================
// searchFor + left
// ==============================

test('test 2.1', function (t) {
  t.is(er(
    'a🦄🐴🦄c',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '🦄',
      searchFor: '🐴',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'b'
    ),
    'ab🦄c',
    'test 2.1 - left maybe found'
  )
})
test('test 2.2', function (t) {
  t.is(er(
    'ab🐴🦄🐴c',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '🦄',
      searchFor: '🐴',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'd'
    ),
    'abddc',
    'test 2.2 - two replacements with one leftmaybe, nearby'
  )
})
test('test 2.3', function (t) {
  t.is(er(
    'ab🦄🐴🦄🐴c',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '🦄',
      searchFor: '🐴',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'd'
    ),
    'abddc',
    'test 2.3 - two maybes together'
  )
})
test('test 2.4', function (t) {
  t.is(er(
    '\'🐴',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '🦄',
      searchFor: '🐴',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'd'
    ),
    '\'d',
    'test 2.4 - futile left maybe'
  )
})
test('test 2.5', function (t) {
  t.is(er(
    '\n\n\n',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '\n',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'a'
    ),
    'aaa',
    'test 2.5 - line break as search string'
  )
})
test('test 2.6', function (t) {
  t.is(er(
    '\n\n\n',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '\n',
      searchFor: '\n',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'a'
    ),
    'aaa',
    'test 2.6 - line break as search string'
  )
})
test('test 2.7', function (t) {
  t.is(er(
    '\n\n',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '\n\n',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    '\n'
    ),
    '\n',
    'test 2.7 - operations on line breaks only'
  )
})

// ==============================
// searchFor + right
// ==============================

test('test 3.1', function (t) {
  t.is(er(
    'a🦄🐴🦄c',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '🐴',
      rightMaybe: '🦄',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'b'
    ),
    'a🦄bc',
    'test 3.1 - right maybe found'
  )
})
test('test 3.2', function (t) {
  t.is(er(
    'ab🐴🦄🐴c',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '🐴',
      rightMaybe: '🦄',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'd'
    ),
    'abddc',
    'test 3.2 - two replacements with one rightmaybe, nearby'
  )
})
test('test 3.3', function (t) {
  t.is(er(
    'ab🦄🐴🦄🐴c',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '🦄',
      rightMaybe: '🐴',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'd'
    ),
    'abddc',
    'test 3.3 - two maybes together'
  )
})
test('test 3.4', function (t) {
  t.is(er(
    '\'🐴',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '🐴',
      rightMaybe: '🦄',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'd'
    ),
    '\'d',
    'test 3.4 - futile right maybe'
  )
})
test('test 3.5', function (t) {
  t.is(er(
    '\na\n\n',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '\n',
      rightMaybe: 'a',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'a'
    ),
    'aaa',
    'test 3.5 - line break as search string'
  )
})
test('test 3.6', function (t) {
  t.is(er(
    '\n\n\n',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '\n',
      rightMaybe: '\n',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'a'
    ),
    'aa',
    'test 3.6 - line break as search string'
  )
})
test('test 3.7', function (t) {
  t.is(er(
    'a\n\na',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: 'a',
      rightMaybe: '\n\na',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'b'
    ),
    'b',
    'test 3.7 - rightMaybe wiht line breaks'
  )
})
test('test 3.8', function (t) {
  t.is(er(
    'aaaaab',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: 'a',
      rightMaybe: 'b',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'a'
    ),
    'aaaaa',
    'test 3.8 - specific case of semi infinite loop with maybe'
  )
})

// ==============================
// searchFor + both left and right
// ==============================

test('test 4.1', function (t) {
  t.is(er(
    'a🦄🐴🦄a',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '🦄',
      searchFor: '🐴',
      rightMaybe: '🦄',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'z'
    ),
    'aza',
    'test 4.1 - left and right maybes emoji'
  )
})
test('test 4.2', function (t) {
  t.is(er(
    'abc abc abc',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: 'a',
      searchFor: 'b',
      rightMaybe: 'c',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'z'
    ),
    'z z z',
    'test 4.2 - left and right text maybes'
  )
})
test('test 4.3', function (t) {
  t.is(er(
    'zzzabc zzzzabczzz abczzzz',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: 'a',
      searchFor: 'b',
      rightMaybe: 'c',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'z'
    ),
    'zzzz zzzzzzzz zzzzz',
    'test 4.3 - left and right at beginning, middle and end of word, letters only'
  )
})
test('test 4.4', function (t) {
  t.is(er(
    'zzz🦄🐴🦄 zzzz🦄🐴🦄zzz 🦄🐴🦄zzzz',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '🦄',
      searchFor: '🐴',
      rightMaybe: '🦄',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'z'
    ),
    'zzzz zzzzzzzz zzzzz',
    'test 4.4 - left and right at beginning, middle and end of word, with emoji'
  )
})

// ==============================
// searchFor + only outsides
// ==============================

test('test 5.1', function (t) {
  t.is(er(
    '🦄 🐴 🦄',
    {
      leftOutsideNot: '',
      leftOutside: '🦄 ',
      leftMaybe: '',
      searchFor: '🐴',
      rightMaybe: '',
      rightOutside: ' 🦄',
      rightOutsideNot: ''
    },
    'z'
    ),
    '🦄 z 🦄',
    'test 5.1 - both outsides, emoji, found'
  )
})
test('test 5.2', function (t) {
  t.is(er(
    'a 🐴 a',
    {
      leftOutsideNot: '',
      leftOutside: '🦄',
      leftMaybe: '',
      searchFor: '🐴',
      rightMaybe: '',
      rightOutside: '🦄',
      rightOutsideNot: ''
    },
    'z'
    ),
    'a 🐴 a',
    'test 5.2 - both outsides, emoji, not found'
  )
})
test('test 5.3', function (t) {
  t.is(er(
    '🦄a 🐴 a',
    {
      leftOutsideNot: '',
      leftOutside: '🦄',
      leftMaybe: '',
      searchFor: '🐴',
      rightMaybe: '',
      rightOutside: '🦄',
      rightOutsideNot: ''
    },
    'z'
    ),
    '🦄a 🐴 a',
    'test 5.3 - both outsides, emoji, not found'
  )
})
test('test 5.4', function (t) {
  t.is(er(
    'a 🐴 a🦄',
    {
      leftOutsideNot: '',
      leftOutside: '🦄',
      leftMaybe: '',
      searchFor: '🐴',
      rightMaybe: '',
      rightOutside: '🦄',
      rightOutsideNot: ''
    },
    'z'
    ),
    'a 🐴 a🦄',
    'test 5.4 - both outsides, emoji, not found'
  )
})
test('test 5.5', function (t) {
  t.is(er(
    'kgldfj lkfjkl jfk \ng \t;lgkh a 🐴 a🦄 slkgj fhjf jkghljk',
    {
      leftOutsideNot: '',
      leftOutside: '🦄',
      leftMaybe: '',
      searchFor: '🐴',
      rightMaybe: '',
      rightOutside: '🦄',
      rightOutsideNot: ''
    },
    'z'
    ),
    'kgldfj lkfjkl jfk \ng \t;lgkh a 🐴 a🦄 slkgj fhjf jkghljk',
    'test 5.5 - both outsides, emoji, not found'
  )
})
test('test 5.6', function (t) {
  t.is(er(
    'aaab\n',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: 'b',
      rightMaybe: '',
      rightOutside: '\n',
      rightOutsideNot: ''
    },
    'c'
    ),
    'aaac\n',
    'test 5.6 - line break as rightOutside'
  )
})
test('test 5.7', function (t) {
  t.is(er(
    'aaa\nb\n',
    {
      leftOutsideNot: '',
      leftOutside: '\n',
      leftMaybe: '',
      searchFor: 'b',
      rightMaybe: '',
      rightOutside: '\n',
      rightOutsideNot: ''
    },
    'c'
    ),
    'aaa\nc\n',
    'test 5.7 - line breaks as both outsides'
  )
})
test('test 5.8', function (t) {
  t.is(er(
    'aaa\nb\n',
    {
      leftOutsideNot: '',
      leftOutside: '\n',
      leftMaybe: '',
      searchFor: 'b',
      rightMaybe: '',
      rightOutside: '\n',
      rightOutsideNot: ''
    },
    undefined
    ),
    'aaa\n\n',
    'test 5.8 - line breaks as outsides, replacement = undefined'
  )
})
test('test 5.9', function (t) {
  t.is(er(
    'aaa\nb\n',
    {
      leftOutsideNot: '',
      leftOutside: '\n',
      leftMaybe: '',
      searchFor: 'b',
      rightMaybe: '',
      rightOutside: '\n',
      rightOutsideNot: ''
    },
    true
    ),
    'aaa\n\n',
    'test 5.9 - line breaks as outsides, replacement = boolean'
  )
})
test('test 5.10', function (t) {
  t.is(er(
    'aaa\nb\n',
    {
      leftOutsideNot: '',
      leftOutside: '\n',
      leftMaybe: '',
      searchFor: 'b',
      rightMaybe: '',
      rightOutside: '\n',
      rightOutsideNot: ''
    },
    null
    ),
    'aaa\n\n',
    'test 5.10 - line breaks as outsides, replacement = null'
  )
})

// ==============================
// searchFor + maybes + outsides
// ==============================

test('test 6.1', function (t) {
  t.is(er(
    'a🦄🐴💘b',
    {
      leftOutsideNot: '',
      leftOutside: 'a',
      leftMaybe: '🦄',
      searchFor: '🐴',
      rightMaybe: '💘',
      rightOutside: 'b',
      rightOutsideNot: ''
    },
    '🌟'
    ),
    'a🌟b',
    'test 6.1 - maybes and outsides, emoji - full set'
  )
})
test('test 6.2', function (t) {
  t.is(er(
    'a🦄🐴b',
    {
      leftOutsideNot: '',
      leftOutside: 'a',
      leftMaybe: '🦄',
      searchFor: '🐴',
      rightMaybe: '💘',
      rightOutside: 'b',
      rightOutsideNot: ''
    },
    '🌟'
    ),
    'a🌟b',
    'test 6.2 - maybes and outsides, emoji - no 1 of maybes'
  )
})
test('test 6.3', function (t) {
  t.is(er(
    'a🐴💘b',
    {
      leftOutsideNot: '',
      leftOutside: 'a',
      leftMaybe: '🦄',
      searchFor: '🐴',
      rightMaybe: '💘',
      rightOutside: 'b',
      rightOutsideNot: ''
    },
    '🌟'
    ),
    'a🌟b',
    'test 6.3 - maybes and outsides, emoji - no 1 of maybes'
  )
})
test('test 6.4', function (t) {
  t.is(er(
    'a🐴b',
    {
      leftOutsideNot: '',
      leftOutside: 'a',
      leftMaybe: '🦄',
      searchFor: '🐴',
      rightMaybe: '💘',
      rightOutside: 'b',
      rightOutsideNot: ''
    },
    '🌟'
    ),
    'a🌟b',
    'test 6.4 - maybes and outsides, emoji - neither of maybes'
  )
})
test('test 6.5', function (t) {
  t.is(er(
    'a🦄🐴💘b a🦄🐴💘b a🦄🐴💘b',
    {
      leftOutsideNot: '',
      leftOutside: 'a',
      leftMaybe: '🦄',
      searchFor: '🐴',
      rightMaybe: '💘',
      rightOutside: 'b',
      rightOutsideNot: ''
    },
    '🌟'
    ),
    'a🌟b a🌟b a🌟b',
    'test 6.5 - multiple findings with maybes and outsides'
  )
})
test('test 6.6', function (t) {
  t.is(er(
    'z🦄🐴💘b a🦄🐴💘z a🦄🐴💘b z🦄🐴💘z',
    {
      leftOutsideNot: 'a',
      leftOutside: '',
      leftMaybe: '🦄',
      searchFor: '🐴',
      rightMaybe: '💘',
      rightOutside: '',
      rightOutsideNot: 'b'
    },
    '🌟'
    ),
    'z🦄🐴💘b a🦄🐴💘z a🦄🐴💘b z🌟z',
    'test 6.6 - multiple findings with maybes and not-outsides'
  )
})

// ==============================
// no searchFor + no maybes + outsides
// ==============================

test('test 7.1', function (t) {
  t.is(er(
    'aaaa bbbb cccc',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '',
      rightMaybe: '',
      rightOutside: '🦄',
      rightOutsideNot: ''
    },
    '🌟'
    ),
    'aaaa bbbb cccc',
    'test 7.1 - one rightOutside, not found'
  )
})
test('test 7.2', function (t) {
  t.is(er(
    'aaaa bbbb cccc',
    {
      leftOutsideNot: '',
      leftOutside: '🦄',
      leftMaybe: '',
      searchFor: '',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    '🌟'
    ),
    'aaaa bbbb cccc',
    'test 7.2 - one leftOutside, not found'
  )
})
test('test 7.3', function (t) {
  t.is(er(
    'aaaa bbbb cccc',
    {
      leftOutsideNot: '',
      leftOutside: '🦄',
      leftMaybe: '',
      searchFor: '',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    null
    ),
    'aaaa bbbb cccc',
    'test 7.3 - one leftOutside, not found + null replacement'
  )
})
test('test 7.4', function (t) {
  t.is(er(
    'aaaa bbbb cccc',
    {
      leftOutsideNot: '',
      leftOutside: null,
      leftMaybe: '',
      searchFor: '',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    null
    ),
    'aaaa bbbb cccc',
    'test 7.4 - leftOutside is null'
  )
})
test('test 7.5', function (t) {
  t.is(er(
    'aaaa bbbb cccc',
    {
      leftOutsideNot: '',
      leftOutside: undefined,
      leftMaybe: '',
      searchFor: '',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    undefined
    ),
    'aaaa bbbb cccc',
    'test 7.5 - left outside is undefined'
  )
})

// ==============================
// infinite loop cases
// ==============================

test('test 8.1', function (t) {
  t.is(er(
    '🐴🦄🐴🦄🐴',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '🐴',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    '🐴'
    ),
    '🐴🦄🐴🦄🐴',
    'test 8.1 - infinite loop protection, no maybes, emoji'
  )
})
test('test 8.2', function (t) {
  t.is(er(
    '🐴🦄🐴🦄🐴',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '🐴',
      rightMaybe: '🦄',
      rightOutside: '',
      rightOutsideNot: ''
    },
    '🐴'
    ),
    '🐴🐴🐴',
    'test 8.2 - infinite loop protection, maybes, multiple findings, emoji'
  )
})
test('test 8.3', function (t) {
  t.is(er(
    '🐴',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '🐴',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    '🐴'
    ),
    '🐴',
    'test 8.3 - infinite loop protection, one emoji replaced with itself'
  )
})
test('test 8.4', function (t) {
  t.is(er(
    '🐴🦄🐴🦄🐴',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '🐴',
      rightMaybe: '',
      rightOutside: '🦄',
      rightOutsideNot: ''
    },
    '🐴'
    ),
    '🐴🦄🐴🦄🐴',
    'test 8.4 - infinite loop protection, right outside'
  )
})
test('test 8.5', function (t) {
  t.is(er(
    '🦄🦄🦄🦄zaaaaaaaaa🦄🦄🦄🦄🦄🦄',
    {
      leftOutsideNot: 'a',
      leftOutside: '🦄🦄🦄',
      leftMaybe: '',
      searchFor: '🦄',
      rightMaybe: '🦄',
      rightOutside: '🦄',
      rightOutsideNot: ''
    },
    '🌟'
    ),
    '🦄🦄🦄🦄zaaaaaaaaa🦄🦄🦄🌟🦄',
    'test 8.5 - infinite loop protection, multiples'
  )
})
test('test 8.6', function (t) {
  t.is(er(
    'a',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: 'a',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'a'
    ),
    'a',
    'test 8.6 - simple infinite loop case'
  )
})

// ==============================
// missing searchFor value
// ==============================

test('test 9.1', function (t) {
  t.is(er(
    'aaa',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    ''
    ),
    'aaa',
    'test 9.1 - source present, missing searchFor'
  )
})
test('test 9.2', function (t) {
  t.is(er(
    '',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    ''
    ),
    '',
    'test 9.2 - everything is missing'
  )
})
test('test 9.3', function (t) {
  t.is(er('', {}, ''),
    '',
    'test 9.3 - everything is seriously missing'
  )
})
test('test 9.4', function (t) {
  t.is(er('', {}),
    '',
    'test 9.4 - everything is extremely seriously missing'
  )
})
test('test 9.5', function (t) {
  t.is(er(''),
    '',
    'test 9.5 - everything is truly extremely seriously missing'
  )
})
test('test 9.6', function (t) {
  t.is(er(),
    '',
    'test 9.6 - everything is truly extremely seriously missing'
  )
})

// ==============================
// missing replacement value = asking for delete mode
// ==============================

test('test 10.1', function (t) {
  t.is(er(
    'a🦄🐴🦄a',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '🦄',
      searchFor: '🐴',
      rightMaybe: '🦄',
      rightOutside: '',
      rightOutsideNot: ''
    },
    ''
    ),
    'aa',
    'test 10.1 - empty string as replacement = deletion mode. With emoji.'
  )
})
test('test 10.2', function (t) {
  t.is(er(
    'a🦄🐴🦄a',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '🦄',
      searchFor: '🐴',
      rightMaybe: '🦄',
      rightOutside: '',
      rightOutsideNot: ''
    },
    null
    ),
    'aa',
    'test 10.2 - null as replacement = deletion mode. With emoji.'
  )
})
test('test 10.3', function (t) {
  t.is(er(
    '🐴',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '🦄',
      searchFor: '🐴',
      rightMaybe: '🦄',
      rightOutside: '',
      rightOutsideNot: ''
    },
    true
    ),
    '',
    'test 10.3 - replacement bool. Nothing left. Emoji.'
  )
})
test('test 10.4', function (t) {
  t.is(er(
    '2',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: 2,
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    false
    ),
    '',
    'test 10.4 - replacement false. Nothing left. searchFor raw integer.'
  )
})
test('test 10.5', function (t) {
  t.is(er(
    'fljlh fdlg ldfhgl abc aldjsdlflkjd ljfl fgklh fl',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: 'fljlh fdlg ldfhgl abc aldjsdlflkjd ljfl fgklh fl',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    undefined
    ),
    '',
    'test 10.5 - nothing left, replacement undefined. bunch of text.'
  )
})
test('test 10.6', function (t) {
  t.is(er(
    'zzz',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: 'zzz',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    void 'blablabla'
    ),
    '',
    'test 10.6 - nothing left - more undefined.'
  )
})
test('test 10.7', function (t) {
  t.is(er(
    'a🦄🐴🦄a',
    {
      leftOutsideNot: '',
      leftOutside: '🦄',
      leftMaybe: '',
      searchFor: '🐴',
      rightMaybe: '',
      rightOutside: '🦄',
      rightOutsideNot: ''
    },
    null
    ),
    'a🦄🦄a',
    'test 10.7 - emoji, null replacement, both outsides found'
  )
})
test('test 10.8', function (t) {
  t.is(er(
    6,
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: 6,
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    9
    ),
    '9',
    'test 10.8 - raw integers everywhere'
  )
})

// ==============================
// outsideNot's
// ==============================

test('test 11.1', function (t) {
  t.is(er(
    '🐴a',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '🐴',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: 'a'
    },
    'c'
    ),
    '🐴a',
    'test 11.1 - rightOutsideNot satisfied thus not replaced'
  )
})
test('test 11.2', function (t) {
  t.is(er(
    'a🐴',
    {
      leftOutsideNot: 'a',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '🐴',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'c'
    ),
    'a🐴',
    'test 11.2 - left satisfied thus not replaced'
  )
})
test('test 11.3', function (t) {
  t.is(er(
    'a🐴a',
    {
      leftOutsideNot: 'a',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '🐴',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: 'a'
    },
    'c'
    ),
    'a🐴a',
    'test 11.3 - both outsideNot\'s satisfied thus not replaced'
  )
})
test('test 11.4', function (t) {
  t.is(er(
    'zb🐴y',
    {
      leftOutsideNot: 'a',
      leftOutside: '',
      leftMaybe: 'b',
      searchFor: '🐴',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: 'c'
    },
    '🦄'
    ),
    'z🦄y',
    'test 11.4 - both outsideNot\'s not satisfied, with one maybe, replaced'
  )
})
test('test 11.5', function (t) {
  t.is(er(
    'zb🐴y',
    {
      leftOutsideNot: 'z',
      leftOutside: '',
      leftMaybe: 'b',
      searchFor: '🐴',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'whatevs'
    ),
    'zb🐴y',
    'test 11.5 - leftOutsideNot blocked positive leftMaybe'
  )
})
test('test 11.6', function (t) {
  t.is(er(
    'zb🐴cy',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: 'b',
      searchFor: '🐴',
      rightMaybe: 'c',
      rightOutside: '',
      rightOutsideNot: 'y'
    },
    'whatevs'
    ),
    'zb🐴cy',
    'test 11.6 - rightOutsideNot blocked both positive (left-right) maybes'
  )
})
test('test 11.7', function (t) {
  t.is(er(
    'cccccccca',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: 'a',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: 'b'
    },
    'b'
    ),
    'ccccccccb',
    'test 11.7 - rightOutsideNot on the last char in the string (goes outside of the string)'
  )
})
test('test 11.8', function (t) {
  t.is(er(
    'cccccccca',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: 'c',
      rightMaybe: 'a',
      rightOutside: '',
      rightOutsideNot: 'c'
    },
    'c'
    ),
    'cccccccc',
    'test 11.8 - positive right maybe is last char, outsideNot satisfied'
  )
})
test('test 11.9', function (t) {
  t.is(er(
    '&nbsp; &nbsp &nbsp',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: 'nbsp',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ';'
    },
    'nbsp;'
    ),
    '&nbsp; &nbsp; &nbsp;',
    'test 11.9 - real life scenario, missing semicol on nbsp in the middle of the string - spaces'
  )
})
test('test 11.10', function (t) {
  t.is(er(
    '&nbsp;&nbsp&nbsp',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: 'nbsp',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ';'
    },
    'nbsp;'
    ),
    '&nbsp;&nbsp;&nbsp;',
    'test 11.10 - real life scenario, missing semicol on nbsp in the middle of the string - no spaces'
  )
})
test('test 11.11', function (t) {
  t.is(er(
    'tralalalanbsp;nbsp;&nbsp;',
    {
      leftOutsideNot: '&',
      leftOutside: '',
      leftMaybe: '',
      searchFor: 'nbsp',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    '&nbsp'
    ),
    'tralalala&nbsp;&nbsp;&nbsp;',
    'test 11.11 - real life scenario, missing ampersand, text'
  )
})
test('test 11.12', function (t) {
  t.is(er(
    '🍺🍺👌🍺',
    {
      leftOutsideNot: '👌',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '🍺',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    '🍻'
    ),
    '🍻🍻👌🍺',
    'test 11.12 - real life scenario but with emoji instead'
  )
})

// ==============================
// double-check the README's corectness
// ==============================

test('test 12.1', function (t) {
  t.is(er(
    'a x c x d',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: 'x',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    '🦄'
    ),
    'a 🦄 c 🦄 d',
    'test 12.1 - readme example #1'
  )
})
test('test 12.2', function (t) {
  t.is(er(
    '🐴i🦄 🐴i i🦄 i',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '🐴',
      searchFor: 'i',
      rightMaybe: '🦄',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'x'
    ),
    'x x x x',
    'test 12.2 - readme example #2'
  )
})
test('test 12.3', function (t) {
  t.is(er(
    'a🦄c x🦄x',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '🦄',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: 'c'
    },
    '🐴'
    ),
    'a🦄c x🐴x',
    'test 12.3 - readme example #3'
  )
})
test('test 12.4', function (t) {
  t.is(er(
    'zzzzz  zzzzzz zzzzzz',
    {
      leftOutsideNot: '',
      leftOutside: ' ',
      leftMaybe: '',
      searchFor: ' ',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    ''
    ),
    'zzzzz zzzzzz zzzzzz',
    'test 12.4 - readme example #4'
  )
})
test('test 12.5', function (t) {
  t.is(er(
    '<br /><br/><br />',
    {
      leftOutsideNot: ' ',
      leftOutside: '',
      leftMaybe: '',
      searchFor: '/>',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    ' />'
    ),
    '<br /><br /><br />',
    'test 12.5 - readme example #5'
  )
})
test('test 12.6', function (t) {
  t.is(er(
    '&nbsp; nbsp &nbsp nbsp;',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '&',
      searchFor: 'nbsp',
      rightMaybe: ';',
      rightOutside: '',
      rightOutsideNot: ''
    },
    '&nbsp;'
    ),
    '&nbsp; &nbsp; &nbsp; &nbsp;',
    'test 12.6 - readme example #6'
  )
})
