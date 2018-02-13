import test from 'ava'
import rem from '../dist/string-remove-duplicate-heads-tails.cjs'

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test('01.01 - wrong/missing input = throw', (t) => {
  t.throws(() => {
    rem()
  })
  t.throws(() => {
    rem(1)
  })
})

test('01.02 - wrong opts', (t) => {
  t.throws(() => {
    rem('a', 'a')
  })
  t.throws(() => {
    rem('a', 1)
  })
  t.throws(() => {
    rem('a {{}} b', {
      heads: ['{{', 1],
      tails: ['}}'],
    })
  })
  t.throws(() => {
    rem('a {{}} b', {
      heads: ['{{'],
      tails: ['}}', 1],
    })
  })
  t.throws(() => {
    rem('a', {
      heads: '{{',
      tails: '}}',
      zzz: 'a',
    })
  })
})

test('01.03 - empty input string', (t) => {
  t.deepEqual(
    rem(
      '',
      {
        heads: '{{',
        tails: '}}',
      },
    ),
    '',
    '01.03.01',
  )
  t.deepEqual(
    rem(''),
    '',
    '01.03.02',
  )
})

test('01.04 - none of heads or tails found', (t) => {
  t.deepEqual(
    rem(
      'aaa {{',
      {
        heads: '%%',
        tails: '__',
      },
    ),
    'aaa {{',
    '01.04.01',
  )
})

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

test('02.01 - trims wrapped heads and tails', (t) => {
  t.deepEqual(
    rem(
      '{{ hi {{ name }}! }}',
      {
        heads: '{{',
        tails: '}}',
      },
    ),
    'hi {{ name }}!',
    '02.01.01',
  )
  t.deepEqual(
    rem(
      '{{ hi }} name {{! }}',
      {
        heads: '{{',
        tails: '}}',
      },
    ),
    '{{ hi }} name {{! }}',
    '02.01.02',
  )
})

test('02.02 - trims wrapped heads and tails, with space inside heads/tails', (t) => {
  t.deepEqual(
    rem(
      '{{ Hi {{ first_name }}! }}',
      {
        heads: '{{ ',
        tails: ' }}',
      },
    ),
    'Hi {{ first_name }}!',
    '02.02 - heads and tails with spaces',
  )
})

test('02.03 - trimmed heads and tails in the source still get caught', (t) => {
  t.deepEqual(
    rem(
      '{{Hi {{ first_name }}!}}',
      {
        heads: '{{ ',
        tails: ' }}',
      },
    ),
    'Hi {{ first_name }}!',
    '02.03 - with spaces, and those spaces are not on str',
  )
})

test('02.04 - excessive whitespace in opts heads/tails doesn\'t matter', (t) => {
  t.deepEqual(
    rem(
      '{{ Hi {{ first_name }}! }}',
      {
        heads: '   {{     ',
        tails: '    }}       ',
      },
    ),
    'Hi {{ first_name }}!',
    '02.04 - excessive spaces',
  )
})

test('02.05 - single curly brace heads/tails', (t) => {
  t.deepEqual(
    rem(
      '{ Hi { first_name }! }',
      {
        heads: '{',
        tails: '}',
      },
    ),
    'Hi { first_name }!',
    '02.05',
  )
})

test('02.06 - custom heads and tails, whitespace both sides', (t) => {
  t.deepEqual(
    rem(
      '{Hi { first_name }!}',
      {
        heads: ' { ',
        tails: ' } ',
      },
    ),
    'Hi { first_name }!',
    '02.06',
  )
})

test('02.07 - ends with tails, doesn\'t start with heads', (t) => {
  t.deepEqual(
    rem(
      'Hi {{ first_name }}',
      {
        heads: ['%%-', '{{'],
        tails: ['-%%', '}}'],
      },
    ),
    'Hi {{ first_name }}',
    '02.07',
  )
})

test('02.08 - starts with heads, doesn\'t end with tails', (t) => {
  t.deepEqual(
    rem(
      '  {{ first_name }}!  ',
      {
        heads: ['%%-', '{{'],
        tails: ['-%%', '}}'],
      },
    ),
    '{{ first_name }}!',
    '02.08',
  )
})

test('02.09 - properly wrapped, heads/tails in array, matched', (t) => {
  t.deepEqual(
    rem(
      '  {{ first_name }}  ',
      {
        heads: ['%%-', '{{'],
        tails: ['-%%', '}}'],
      },
    ),
    'first_name',
    '02.09',
  )
})

test('02.10 - starts with heads, doesn\'t end with tails', (t) => {
  t.deepEqual(
    rem(
      '   {{ a }}{{ b }}   ',
      {
        heads: ['%%-', '{{'],
        tails: ['-%%', '}}'],
      },
    ),
    '{{ a }}{{ b }}',
    '02.10',
  )
})

test('02.11 - unclosed heads', (t) => {
  t.deepEqual(
    rem(
      'zzz {{',
      {
        heads: ['%%-', '{{'],
        tails: ['-%%', '}}'],
      },
    ),
    'zzz {{',
    '02.11',
  )
})

test('02.12 - unclosed tails', (t) => {
  t.deepEqual(
    rem(
      'zzz }}',
      {
        heads: ['%%-', '{{'],
        tails: ['-%%', '}}'],
      },
    ),
    'zzz }}',
    '02.12',
  )
})

test('02.13 - ends with empty variable', (t) => {
  t.deepEqual(
    rem(
      'zzz {{}}',
      {
        heads: ['%%-', '{{'],
        tails: ['-%%', '}}'],
      },
    ),
    'zzz',
    '02.13',
  )
})

test('02.14 - empty variable with text both sides', (t) => {
  t.deepEqual(
    rem(
      'zzz {{}} yyy',
      {
        heads: ['%%-', '{{'],
        tails: ['-%%', '}}'],
      },
    ),
    'zzz {{}} yyy',
    '02.14',
  )
})

test('02.15 - heads/tails in opposite order', (t) => {
  t.deepEqual(
    rem(
      ' zzz }}{{ yyy',
      {
        heads: ['%%-', '{{'],
        tails: ['-%%', '}}'],
      },
    ),
    'zzz }}{{ yyy',
    '02.15',
  )
})

test('02.16 - tails with text on both sides', (t) => {
  t.deepEqual(
    rem(
      'zzz }} yyy',
      {
        heads: ['%%-', '{{'],
        tails: ['-%%', '}}'],
      },
    ),
    'zzz }} yyy',
    '02.16',
  )
})

test('02.17 - heads with text on both sides', (t) => {
  t.deepEqual(
    rem(
      'zzz {{ yyy',
      {
        heads: ['%%-', '{{'],
        tails: ['-%%', '}}'],
      },
    ),
    'zzz {{ yyy',
    '02.17',
  )
})

test('02.18 - multiple heads, single tails', (t) => {
  t.deepEqual(
    rem(
      '{{{{ first_name }}!',
      {
        heads: ['%%-', '{{'],
        tails: ['-%%', '}}'],
      },
    ),
    '{{{{ first_name }}!',
    '02.18',
  )
})

test('02.19 - one set of custom heads and tails, single char string', (t) => {
  t.deepEqual(
    rem(
      '??z!!',
      {
        heads: '??',
        tails: '!!',
      },
    ),
    'z',
    '02.19',
  )
})

test('02.20 - two sets of custom heads and tails, single char string', (t) => {
  // recursively:
  t.deepEqual(
    rem(
      '????z!!!!',
      {
        heads: '??',
        tails: '!!',
      },
    ),
    'z',
    '02.20',
  )
})

test('02.21 - words with space, single set of custom heads and tails', (t) => {
  t.deepEqual(
    rem(
      '??tralalala lalala!!',
      {
        heads: '??',
        tails: '!!',
      },
    ),
    'tralalala lalala',
    '02.21',
  )
})

test('02.22 - double wrapped with custom heads and tails, with whitespace', (t) => {
  // recursively with spaces
  t.deepEqual(
    rem(
      '?? ?? x y !! !!',
      {
        heads: '??',
        tails: '!!',
      },
    ),
    'x y',
    '02.22',
  )
})

test('02.23 - mixed sets of heads and tails #1', (t) => {
  // peels off two outer layers but doesn't touch separate var wrappers
  t.deepEqual(
    rem(
      '?? ((( ?? x !! ?? y !! ))) !!',
      {
        heads: ['??', '((('],
        tails: ['!!', ')))'],
      },
    ),
    '?? x !! ?? y !!',
    '02.23.01 - input with spaces',
  )
  t.deepEqual(
    rem(
      '?? ((( ?? x !! ?? y !! ))) !!',
      {
        heads: ['?? ', '((( '],
        tails: [' !!', ' )))'],
      },
    ),
    '?? x !! ?? y !!',
    '02.23.02 - both input and head/tail references with spaces',
  )
  t.deepEqual(
    rem(
      '??(((??x!!??y!!)))!!',
      {
        heads: ['?? ', '((( '],
        tails: [' !!', ' )))'],
      },
    ),
    '??x!!??y!!',
    '02.23.03 - both input and head/tail references with spaces',
  )
})

test('02.24 - mixed sets of heads and tails #2', (t) => {
  t.deepEqual(
    rem(
      '??(((??tralalala!!(((lalala))))))!!',
      {
        heads: ['??', '((('],
        tails: ['!!', ')))'],
      },
    ),
    '??tralalala!!(((lalala)))',
    '02.24',
  )
})

test('02.25 - blank heads and tails within second level being removed', (t) => {
  t.deepEqual(
    rem(
      '??((())) ((( ?? a !! ((( b ))) )))!!',
      {
        heads: ['??', '((('],
        tails: ['!!', ')))'],
      },
    ),
    '?? a !! ((( b )))',
    '02.25.01',
  )
  t.deepEqual(
    rem(
      '?? (((  \n  )))   \t\t\t ((( ?? a !! ((( b )))\n ))) !!',
      {
        heads: ['??', '((('],
        tails: ['!!', ')))'],
      },
    ),
    '?? a !! ((( b )))',
    '02.25.02',
  )
  t.deepEqual(
    rem(
      '?? (((  \n  )))   \t\t\t ((( ??  !! (((  )))\n ))) !!',
      {
        heads: ['??', '((('],
        tails: ['!!', ')))'],
      },
    ),
    '',
    '02.25.03',
  )
})

test('02.26 - removing empty head/tail chunks from around the text #1', (t) => {
  t.deepEqual(
    rem(
      '((())) a ((()))',
      {
        heads: ['??', '((('],
        tails: ['!!', ')))'],
      },
    ),
    'a',
    '02.26.01',
  )
  t.deepEqual(
    rem(
      '((())) a ((())) b ((()))',
      {
        heads: ['??', '((('],
        tails: ['!!', ')))'],
      },
    ),
    'a ((())) b',
    '02.26.02',
  )
  t.deepEqual(
    rem(
      '((()))((())) a ((()))((()))',
      {
        heads: ['??', '((('],
        tails: ['!!', ')))'],
      },
    ),
    'a',
    '02.26.03',
  )
  t.deepEqual(
    rem(
      'a((()))((()))b((()))((()))((()))',
      {
        heads: ['??', '((('],
        tails: ['!!', ')))'],
      },
    ),
    'a((()))((()))b',
    '02.26.04',
  )
  t.deepEqual(
    rem(
      ' ((( )))     (((    )))     (((  )))    a((()))((()))b     (((   )))  (((  )))     (((     )))  ',
      {
        heads: ['??', '((('],
        tails: ['!!', ')))'],
      },
    ),
    'a((()))((()))b',
    '02.26.05',
  )
  t.deepEqual(
    rem(
      '((()))((()))((()))a((()))((()))b((()))((()))((()))',
      {
        heads: ['??', '((('],
        tails: ['!!', ')))'],
      },
    ),
    'a((()))((()))b',
    '02.26.06',
  )
})

test('02.27 - removing empty head/tail chunks from around the text #2 (touches end)', (t) => {
  t.deepEqual(
    rem(
      '((())) some (((text))) ((()))',
      {
        heads: ['??', '((('],
        tails: ['!!', ')))'],
      },
    ),
    'some (((text)))',
    '02.27',
  )
})

test('02.28 - removing empty head/tail chunks from around the text #3 (touches beginning)', (t) => {
  t.deepEqual(
    rem(
      '((())) (((some))) text ((()))',
      {
        heads: ['??', '((('],
        tails: ['!!', ')))'],
      },
    ),
    '(((some))) text',
    '02.28.01',
  )
  t.deepEqual(
    rem(
      '\t((())) (((some))) text ((()))',
      {
        heads: ['??', '((('],
        tails: ['!!', ')))'],
      },
    ),
    '(((some))) text',
    '02.28.02 - tab would not get trimmed, but since it was standing in the way of empty heads/tails, it was removed',
  )
})

test('02.29 - leading letter ruins the removal from the front', (t) => {
  t.deepEqual(
    rem(
      '\ta ((())) (((some))) text ((()))',
      {
        heads: ['??', '((('],
        tails: ['!!', ')))'],
      },
    ),
    '\ta ((())) (((some))) text',
    '02.29 - because of the "a" the removal is terminated until trailing chunks met',
  )
  t.deepEqual(
    rem(
      ' a ((())) (((some))) text ((()))',
      {
        heads: ['??', '((('],
        tails: ['!!', ')))'],
      },
    ),
    'a ((())) (((some))) text',
    '02.29.02',
  )
})

test('02.30 - leading line break', (t) => {
  t.deepEqual(
    rem(
      'aaa\n',
      {
        heads: ['??', '((('],
        tails: ['!!', ')))'],
      },
    ),
    'aaa\n',
    '02.30',
  )
})
