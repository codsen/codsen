import test from 'ava'
import er from './er.js'

// ==============================
// only the string to search for
// ==============================

test('test 1.1 - replace letter with letter', function (t) {
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
    'test 1.1'
  )
})
test('test 1.2 - replace 1 emoji with 1 emoji', function (t) {
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
    'test 1.2'
  )
})
test('test 1.3 - replace 3 consecutive emoji with emoji', function (t) {
  t.is(er(
    'a 🦄🦄🦄 a',
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
    'a 💖💖💖 a',
    'test 1.3'
  )
})
test('test 1.4 - gorilla emoji - in escaped JS', function (t) {
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
    'test 1.4 - http://unicode-table.com/en/1F98D/'
  )
})
test('test 1.5 - gorilla emoji - in raw', function (t) {
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
    'test 1.5 - http://unicode-table.com/en/1F98D/'
  )
})
test('test 1.6 - won\'t find a letter', function (t) {
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
    'test 1.6'
  )
})
test('test 1.7 - won\'t find emoji, with new lines', function (t) {
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
    'test 1.7'
  )
})
test('test 1.8 - replacement with new lines', function (t) {
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
    'test 1.8'
  )
})
test('test 1.9 - multiple letter findings', function (t) {
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
    'test 1.9'
  )
})
test('test 1.10 - single digit of string type replaced', function (t) {
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
    'test 1.10'
  )
})
test('test 1.11 - single digit of integer type replaced', function (t) {
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
    'test 1.11'
  )
})
test('test 1.12 - source and replacement are of integer type', function (t) {
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
    'test 1.12'
  )
})
test('test 1.13 - all raw integers: source, replacement and searchFor', function (t) {
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
    'test 1.13'
  )
})
test('test 1.14 - multiple consecutive letter replacements', function (t) {
  t.is(er(
    'aaavvvvccccc',
    {
      leftOutsideNot: '',
      leftOutside: '',
      leftMaybe: '',
      searchFor: 'v',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    'b'
    ),
    'aaabbbbccccc',
    'test 1.14'
  )
})

// ==============================
// searchFor + left
// ==============================

test('test 2.1 - left maybe found', function (t) {
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
    'test 2.1'
  )
})
test('test 2.2 - two replacements with one leftmaybe, nearby', function (t) {
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
    'test 2.2'
  )
})
test('test 2.3 - two consecutive maybes found/replaced', function (t) {
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
    'test 2.3'
  )
})
test('test 2.4 - futile left maybe', function (t) {
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
    'test 2.4'
  )
})
test('test 2.5 - line break as search string', function (t) {
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
    'test 2.5'
  )
})
test('test 2.6 - line break as both searchFor and maybe replaced', function (t) {
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
    'test 2.6'
  )
})
test('test 2.7 - operations on line breaks only', function (t) {
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
    'test 2.7'
  )
})

// ==============================
// searchFor + right
// ==============================

test('test 3.1 - right maybe found', function (t) {
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
    'test 3.1'
  )
})
test('test 3.2 - two replacements with one rightmaybe, nearby', function (t) {
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
    'test 3.2'
  )
})
test('test 3.3 - two consecutive right maybes', function (t) {
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
    'test 3.3'
  )
})
test('test 3.4 - futile right maybe', function (t) {
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
    'test 3.4'
  )
})
test('test 3.5 - \\n as search string plus right maybe', function (t) {
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
    'test 3.5'
  )
})
test('test 3.6 - \\n as both searchFor and right maybe, replaced', function (t) {
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
    'test 3.6'
  )
})
test('test 3.7 - rightMaybe with line breaks', function (t) {
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
    'test 3.7'
  )
})
test('test 3.8 - specific case of semi infinite loop with maybe', function (t) {
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
    'test 3.8'
  )
})

// ==============================
// searchFor + both left and right
// ==============================

test('test 4.1 - left and right maybes as emoji', function (t) {
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
    'test 4.1'
  )
})
test('test 4.2 - left and right maybes as text', function (t) {
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
    'test 4.2'
  )
})
test('test 4.3 - left+right maybes, middle & end of word #1', function (t) {
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
    'test 4.3'
  )
})
test('test 4.4 - left+right maybes, middle & end of word #2', function (t) {
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
    'test 4.4'
  )
})

// ==============================
// searchFor + only outsides
// ==============================

test('test 5.1 - both outsides only, emoji, found', function (t) {
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
    'test 5.1'
  )
})
test('test 5.2 - both outsides only, emoji, not found', function (t) {
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
    'test 5.2'
  )
})
test('test 5.3 - both outsides, emoji, not found', function (t) {
  t.is(er(
    '🦄 🐴 a',
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
    '🦄 🐴 a',
    'test 5.3'
  )
})
test('test 5.4 - both outsides, emoji, not found #1', function (t) {
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
    'test 5.4'
  )
})
test('test 5.5 - both outsides, emoji, not found #2', function (t) {
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
    'test 5.5'
  )
})
test('test 5.6 - line break as rightOutside, found', function (t) {
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
    'test 5.6'
  )
})
test('test 5.7 - line breaks as both outsides', function (t) {
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
    'test 5.7'
  )
})
test('test 5.8 - \\n as outsides, replacement = undefined', function (t) {
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
    'test 5.8'
  )
})
test('test 5.9 - line breaks as outsides, replacement = Bool', function (t) {
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
    'test 5.9'
  )
})
test('test 5.10 - line breaks as outsides, replacement = null', function (t) {
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
    'test 5.10'
  )
})

// ==============================
// searchFor + maybes + outsides
// ==============================

test('test 6.1 - maybes and outsides, emoji - full set', function (t) {
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
    'test 6.1'
  )
})
test('test 6.2 - maybes + outsides - 1 of maybes not found #1', function (t) {
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
    'test 6.2'
  )
})
test('test 6.3 - maybes + outsides - 1 of maybes not found #2', function (t) {
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
    'test 6.3'
  )
})
test('test 6.4 - maybes and outsides, emoji - neither of maybes', function (t) {
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
    'test 6.4'
  )
})
test('test 6.5 - multiple findings with maybes and outsides', function (t) {
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
    'test 6.5'
  )
})
test('test 6.6 - multiple findings with maybes and not-outsides', function (t) {
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
    'test 6.6'
  )
})

// ==============================
// no searchFor + no maybes + outsides
// ==============================

test('test 7.1 - one rightOutside, not found', function (t) {
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
    'test 7.1'
  )
})
test('test 7.2 - one leftOutside, not found', function (t) {
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
    'test 7.2'
  )
})
test('test 7.3 - one leftOutside, not found + null replacement', function (t) {
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
    'test 7.3'
  )
})
test('test 7.4 - leftOutside and replacement are null', function (t) {
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
    'test 7.4'
  )
})
test('test 7.5 - left outside and replacement are undefined', function (t) {
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
    'test 7.5'
  )
})

// ==============================
// infinite loop cases
// ==============================

test('test 8.1 - infinite loop, no maybes, emoji', function (t) {
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
    'test 8.1'
  )
})
test('test 8.2 - infinite loop, maybes, multiple findings, emoji', function (t) {
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
    'test 8.2'
  )
})
test('test 8.3 - infinite loop protection, emoji replaced with itself', function (t) {
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
    'test 8.3'
  )
})
test('test 8.4 - infinite loop protection, right outside', function (t) {
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
    'test 8.4'
  )
})
test('test 8.5 - infinite loop protection, multiples', function (t) {
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
    'test 8.5'
  )
})
test('test 8.6 - simple infinite loop case', function (t) {
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
    'test 8.6'
  )
})
test('test 8.7 - infinite loop, not found', function (t) {
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
    'a'
    ),
    '',
    'test 8.7'
  )
})

// ==============================
// missing searchFor value
// ==============================

test('test 9.1 - source present, missing searchFor', function (t) {
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
    'test 9.1'
  )
})
test('test 9.2 - everything is missing', function (t) {
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
    'test 9.2'
  )
})
test('test 9.3 - everything seriously missing', function (t) {
  t.is(er('', {}, ''),
    '',
    'test 9.3'
  )
})
test('test 9.4 - everything extremely seriously missing', function (t) {
  t.is(er('', {}),
    '',
    'test 9.4'
  )
})
test('test 9.5 - everything truly extremely seriously missing', function (t) {
  t.is(er(''),
    '',
    'test 9.5'
  )
})
test('test 9.6 - everything truly extremely seriously missing', function (t) {
  t.is(er(),
    '',
    'test 9.6'
  )
})

// ==============================
// missing replacement value = asking for delete mode
// ==============================

test('test 10.1 - empty string as replacement = deletion mode', function (t) {
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
    'test 10.1'
  )
})
test('test 10.2 - null as replacement = deletion mode', function (t) {
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
    'test 10.2'
  )
})
test('test 10.3 - replacement bool, nothing left', function (t) {
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
    'test 10.3'
  )
})
test('test 10.4 - replacement Bool, nothing left, searchFor Integer', function (t) {
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
    'test 10.4'
  )
})
test('test 10.5 - nothing left, replacement undefined', function (t) {
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
    'test 10.5'
  )
})
test('test 10.6 - nothing left - more undefined', function (t) {
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
    'test 10.6'
  )
})
test('test 10.7 - emoji, null replacement, both outsides found', function (t) {
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
    'test 10.7'
  )
})
test('test 10.8 - raw integers everywhere must work too', function (t) {
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
    'test 10.8'
  )
})

// ==============================
// outsideNot's
// ==============================

test('test 11.1 - rightOutsideNot satisfied thus not replaced', function (t) {
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
    'test 11.1'
  )
})
test('test 11.2 - outsideNot left satisfied thus not replaced', function (t) {
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
    'test 11.2'
  )
})
test('test 11.3 - outsideNot\'s satisfied thus not replaced', function (t) {
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
    'test 11.3'
  )
})
test('test 11.4 - outsideNot\'s not satisfied, with 1 maybe replaced', function (t) {
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
    'test 11.4'
  )
})
test('test 11.5 - leftOutsideNot blocked positive leftMaybe', function (t) {
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
    'test 11.5'
  )
})
test('test 11.6 - rightOutsideNot blocked both L-R maybes', function (t) {
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
    'test 11.6'
  )
})
test('test 11.7 - rightOutsideNot last char goes outside', function (t) {
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
    'test 11.7'
  )
})
test('test 11.8 - right maybe is last char, outsideNot satisfied', function (t) {
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
    'test 11.8'
  )
})
test('test 11.9 - real life scenario, missing semicol on nbsp #1', function (t) {
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
    'test 11.9'
  )
})
test('test 11.10 - real life scenario, missing semicol on nbsp #2', function (t) {
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
    'test 11.10'
  )
})
test('test 11.11 - real life scenario, missing ampersand, text', function (t) {
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
    'test 11.11'
  )
})
test('test 11.12 - as before but with emoji instead', function (t) {
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
    'test 11.12'
  )
})

// ==============================
// double-check the README's corectness
// ==============================

test('test 12.1 - readme example #1', function (t) {
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
    'test 12.1'
  )
})
test('test 12.2 - readme example #2', function (t) {
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
    'test 12.2'
  )
})
test('test 12.3 - readme example #3', function (t) {
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
    'test 12.3'
  )
})
test('test 12.4 - readme example #4', function (t) {
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
    'test 12.4'
  )
})
test('test 12.5 - readme example #5', function (t) {
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
    'test 12.5'
  )
})
test('test 12.6 - readme example #6', function (t) {
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
    'test 12.6'
  )
})

// ==============================
// random tests from the front lines
// ==============================

test('test 13.1 - special case #1', function (t) {
  t.is(er(
    '&fnof;',
    {
      leftOutsideNot: 'e',
      leftOutside: '',
      leftMaybe: '&',
      searchFor: 'nsp;',
      rightMaybe: '',
      rightOutside: '',
      rightOutsideNot: ''
    },
    '&nbsp;'
    ),
    '&fnof;',
    'test 13.1'
  )
})
