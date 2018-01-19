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

test('01.04 - non of heads or tails found', (t) => {
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
      '{{ Hi {{ first_name }}! }}',
      {
        heads: '{{',
        tails: '}}',
      },
    ),
    'Hi {{ first_name }}!',
    '02.01.01',
  )
  t.deepEqual(
    rem(
      '{{ Hi {{ first_name }}! }}',
      {
        heads: '{{ ',
        tails: ' }}',
      },
    ),
    'Hi {{ first_name }}!',
    '02.01.02 - heads and tails with spaces',
  )
  t.deepEqual(
    rem(
      '{{Hi {{ first_name }}!}}',
      {
        heads: '{{ ',
        tails: ' }}',
      },
    ),
    'Hi {{ first_name }}!',
    '02.01.03 - with spaces, and those spaces are not on str',
  )
  t.deepEqual(
    rem(
      '{{ Hi {{ first_name }}! }}',
      {
        heads: '   {{     ',
        tails: '    }}       ',
      },
    ),
    'Hi {{ first_name }}!',
    '02.01.04 - excessive spaces',
  )
})

test('02.02 - arrys of heads and tails', (t) => {
  t.deepEqual(
    rem(
      '{ Hi { first_name }! }',
      {
        heads: '{',
        tails: '}',
      },
    ),
    'Hi { first_name }!',
    '02.02.01',
  )
  t.deepEqual(
    rem(
      '{Hi { first_name }!}',
      {
        heads: ' { ',
        tails: ' } ',
      },
    ),
    'Hi { first_name }!',
    '02.02.02',
  )
})

test('02.03 - false positives', (t) => {
  t.deepEqual(
    rem(
      'Hi {{ first_name }}',
      {
        heads: ['%%-', '{{'],
        tails: ['-%%', '}}'],
      },
    ),
    'Hi {{ first_name }}',
    '02.03.01',
  )
  t.deepEqual(
    rem(
      '{{ first_name }}!',
      {
        heads: ['%%-', '{{'],
        tails: ['-%%', '}}'],
      },
    ),
    '{{ first_name }}!',
    '02.03.02',
  )
  t.deepEqual(
    rem(
      '{{ first_name }}',
      {
        heads: ['%%-', '{{'],
        tails: ['-%%', '}}'],
      },
    ),
    '{{ first_name }}',
    '02.03.03',
  )
  t.deepEqual(
    rem(
      '{{ first_name }}{{ second_name }}',
      {
        heads: ['%%-', '{{'],
        tails: ['-%%', '}}'],
      },
    ),
    '{{ first_name }}{{ second_name }}',
    '02.03.04',
  )
  t.deepEqual(
    rem(
      'zzz {{',
      {
        heads: ['%%-', '{{'],
        tails: ['-%%', '}}'],
      },
    ),
    'zzz {{',
    '02.03.05',
  )
  t.deepEqual(
    rem(
      'zzz {{}}',
      {
        heads: ['%%-', '{{'],
        tails: ['-%%', '}}'],
      },
    ),
    'zzz {{}}',
    '02.03.06',
  )
  t.deepEqual(
    rem(
      'zzz {{}} yyy',
      {
        heads: ['%%-', '{{'],
        tails: ['-%%', '}}'],
      },
    ),
    'zzz {{}} yyy',
    '02.03.07',
  )
  t.deepEqual(
    rem(
      'zzz }}{{ yyy',
      {
        heads: ['%%-', '{{'],
        tails: ['-%%', '}}'],
      },
    ),
    'zzz }}{{ yyy',
    '02.03.08',
  )
  t.deepEqual(
    rem(
      'zzz }} yyy',
      {
        heads: ['%%-', '{{'],
        tails: ['-%%', '}}'],
      },
    ),
    'zzz }} yyy',
    '02.03.09',
  )
  t.deepEqual(
    rem(
      'zzz {{ yyy',
      {
        heads: ['%%-', '{{'],
        tails: ['-%%', '}}'],
      },
    ),
    'zzz {{ yyy',
    '02.03.10',
  )
  t.deepEqual(
    rem(
      '{{{{ first_name }}!',
      {
        heads: ['%%-', '{{'],
        tails: ['-%%', '}}'],
      },
    ),
    '{{{{ first_name }}!',
    '02.03.11',
  )
})
