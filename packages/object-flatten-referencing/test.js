'use strict'
/* eslint no-template-curly-in-string: 0 */

import ofr from './index'
import test from 'ava'
import { checkTypes, flattenObject, flattenArr, arrayiffyString, reclaimIntegerString } from './util'

// -----------------------------------------------------------------------------
// 01. various throws
// -----------------------------------------------------------------------------

test('01.01 - throws when inputs are missing/wrong', t => {
  t.throws(function () {
    ofr()
  })
  t.throws(function () {
    ofr({a: 'a'})
  })
  t.throws(function () {
    ofr({a: 'a'}, {a: 'a'}, 1)
  })
})

test('01.02 - throws when opts object has wrong opts.wrapHeads', t => {
  t.throws(function () {
    ofr({a: 'a'}, {b: 'b'}, {wrapHeads: 1})
  })
  t.throws(function () {
    ofr({a: 'a'}, {b: 'b'}, {wrapHeads: false})
  })
})

test('01.03 - throws when opts object has wrong opts.wrapTails', t => {
  t.throws(function () {
    ofr({a: 'a'}, {b: 'b'}, {wrapTails: 1})
  })
  t.throws(function () {
    ofr({a: 'a'}, {b: 'b'}, {wrapTails: false})
  })
})

test('01.04 - throws when opts object has wrong opts.dontWrapKeysEndingWith', t => {
  t.throws(function () {
    ofr({a: 'a'}, {b: 'b'}, {dontWrapKeysEndingWith: 1})
  })
  t.throws(function () {
    ofr({a: 'a'}, {b: 'b'}, {dontWrapKeysEndingWith: false})
  })
})

test('01.05 - throws when opts object has wrong opts.xhtml', t => {
  t.throws(function () {
    ofr({a: 'a'}, {b: 'b'}, {xhtml: 1})
  })
  t.throws(function () {
    ofr({a: 'a'}, {b: 'b'}, {xhtml: 'false'})
  })
})

test('01.06 - throws when opts object has wrong opts.preventDoubleWrapping', t => {
  t.throws(function () {
    ofr({a: 'a'}, {b: 'b'}, {preventDoubleWrapping: 1})
  })
  t.throws(function () {
    ofr({a: 'a'}, {b: 'b'}, {preventDoubleWrapping: 'false'})
  })
})

test('01.07 - throws when opts object has wrong opts.objectKeyAndValueJoinChar', t => {
  t.throws(function () {
    ofr({a: 'a'}, {b: 'b'}, {objectKeyAndValueJoinChar: 1})
  })
  t.throws(function () {
    ofr({a: 'a'}, {b: 'b'}, {objectKeyAndValueJoinChar: false})
  })
})

// -----------------------------------------------------------------------------
// 02. B.A.U.
// -----------------------------------------------------------------------------

test('02.01 - defaults - objects, one level', function (t) {
  t.deepEqual(
    ofr(
      {
        key1: 'val11.val12',
        key2: 'val21.val22'
      },
      {
        key1: 'Contact us',
        key2: 'Tel. 0123456789'
      }
    ),
    {
      key1: '%%_val11.val12_%%',
      key2: '%%_val21.val22_%%'
    },
    '02.01.01 - defaults wrapping strings'
  )
  t.deepEqual(
    ofr(
      {
        key1: 'val11.val12',
        key2: 'val21.val22'
      },
      {
        key1: 'Contact us',
        key2: 'Tel. 0123456789'
      },
      {
        wrapHeads: '',
        wrapTails: ''
      }
    ),
    {
      key1: 'val11.val12',
      key2: 'val21.val22'
    },
    '02.01.02 - heads/tails override, wrapping with empty strings'
  )
  t.deepEqual(
    ofr(
      {
        key1: 'val11.val12',
        key2: 'val21.val22'
      },
      {
        key1: 'Contact us',
        key2: 'Tel. 0123456789'
      },
      {
        wrapHeads: '{',
        wrapTails: ''
      }
    ),
    {
      key1: '{val11.val12',
      key2: '{val21.val22'
    },
    '02.01.03 - wrapping only with heads; tails empty'
  )
  t.deepEqual(
    ofr(
      {
        key1: 'val11.val12',
        key2: 'val21.val22'
      },
      {
        key1: 'Contact us',
        key2: 'Tel. 0123456789'
      },
      {
        wrapHeads: '',
        wrapTails: '}'
      }
    ),
    {
      key1: 'val11.val12}',
      key2: 'val21.val22}'
    },
    '02.01.04 - wrapping only with heads; tails empty'
  )
  t.deepEqual(
    ofr(
      {
        key1: 'val11.val12',
        key2: 'val21.val22'
      },
      {
        key1: 'Contact us',
        key2: 'Tel. 0123456789'
      },
      { dontWrapKeysEndingWith: '', dontWrapKeysStartingWith: 'key' }
    ),
    {
      key1: 'val11.val12',
      key2: 'val21.val22'
    },
    '02.01.05 - does not wrap because starts with "key", string opt'
  )
  t.deepEqual(
    ofr(
      {
        key1: 'val11.val12',
        key2: 'val21.val22'
      },
      {
        key1: 'Contact us',
        key2: 'Tel. 0123456789'
      },
      { dontWrapKeysEndingWith: '', dontWrapKeysStartingWith: ['key'] }
    ),
    {
      key1: 'val11.val12',
      key2: 'val21.val22'
    },
    '02.01.06 - does not wrap because starts with "key", array opt'
  )
  t.deepEqual(
    ofr(
      {
        key1: 'val11.val12',
        key2: 'val21.val22'
      },
      {
        key1: 'Contact us',
        key2: 'Tel. 0123456789'
      },
      { dontWrapKeysEndingWith: ['1', '2', '3'], dontWrapKeysStartingWith: [] }
    ),
    {
      key1: 'val11.val12',
      key2: 'val21.val22'
    },
    '02.01.07 - does not wrap because ends with 1 or 2'
  )
})

test('02.02 - opts.preventDoubleWrapping', function (t) {
  t.deepEqual(
    ofr(
      {
        key1: '%%_val11.val12_%%',
        key2: 'val21.val22'
      },
      {
        key1: 'Contact us',
        key2: 'Tel. 0123456789'
      }
    ),
    {
      key1: '%%_val11.val12_%%',
      key2: '%%_val21.val22_%%'
    },
    '02.02.01 - preventDoubleWrapping reading default heads/tails'
  )
  t.deepEqual(
    ofr(
      {
        key1: '{val11.val12}',
        key2: 'val21.val22'
      },
      {
        key1: 'Contact us',
        key2: 'Tel. 0123456789'
      },
      {
        wrapHeads: '{',
        wrapTails: '}'
      }
    ),
    {
      key1: '{val11.val12}',
      key2: '{val21.val22}'
    },
    '02.02.02 - preventDoubleWrapping reading default heads/tails'
  )
  t.deepEqual(
    ofr(
      {
        key1: 'aaa %%val11.val12%% bbb',
        key2: 'val21.val22'
      },
      {
        key1: 'Contact us',
        key2: 'Tel. 0123456789'
      },
      {
        wrapHeads: '%%',
        wrapTails: '%%'
      }
    ),
    {
      key1: 'aaa %%val11.val12%% bbb',
      key2: '%%val21.val22%%'
    },
    '02.02.03 - preventDoubleWrapping reading default heads/tails'
  )
})

test('02.03 - flattens an array value but doesn\'t touch other one', function (t) {
  t.deepEqual(
    ofr(
      {
        key1: {
          key2: [
            'val1',
            'val2',
            'val3'
          ]
        },
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      {
        key1: 'Contact us',
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      }
    ),
    {
      key1: '%%_key2.val1_%%<br />%%_key2.val2_%%<br />%%_key2.val3_%%',
      key3: {
        key4: [
          '%%_val4_%%',
          '%%_val5_%%',
          '%%_val6_%%'
        ]
      }
    },
    '02.03.01'
  )
  t.deepEqual(
    ofr(
      {
        key1: {
          key2: [
            'val1',
            'val2',
            'val3'
          ]
        },
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      {
        key1: 'Contact us',
        key3: {
          key4: [
            '%%_val4_%%',
            '%%_val5_%%',
            '%%_val6_%%'
          ]
        }
      },
      {
        xhtml: false
      }
    ),
    {
      key1: '%%_key2.val1_%%<br>%%_key2.val2_%%<br>%%_key2.val3_%%',
      key3: {
        key4: [
          '%%_val4_%%',
          '%%_val5_%%',
          '%%_val6_%%'
        ]
      }
    },
    '02.03.02'
  )
  t.deepEqual(
    ofr(
      {
        key1: {
          key2: [
            'val1',
            'val2',
            'val3'
          ]
        },
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      {
        key1: 'Contact us',
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      {
        wrapHeads: '%%_',
        wrapTails: '_%%'
      }
    ),
    {
      key1: '%%_key2.val1_%%<br />%%_key2.val2_%%<br />%%_key2.val3_%%',
      key3: {
        key4: [
          '%%_val4_%%',
          '%%_val5_%%',
          '%%_val6_%%'
        ]
      }
    },
    '02.03.03'
  )
  t.deepEqual(
    ofr(
      {
        key1: {
          key2: [
            'val1',
            'val2',
            'val3'
          ]
        },
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      {
        key1: 'Contact us',
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      {
        wrapHeads: '%%_',
        wrapTails: '_%%',
        xhtml: false
      }
    ),
    {
      key1: '%%_key2.val1_%%<br>%%_key2.val2_%%<br>%%_key2.val3_%%',
      key3: {
        key4: [
          '%%_val4_%%',
          '%%_val5_%%',
          '%%_val6_%%'
        ]
      }
    },
    '02.03.04'
  )
})

test('02.04 - opts.dontWrapKeysEndingWith and opts.dontWrapKeysStartingWith', function (t) {
  t.deepEqual(
    ofr(
      {
        key1: {
          key2: [
            'val1',
            'val2',
            'val3'
          ]
        },
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      {
        key1: 'Contact us',
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      { dontWrapKeysEndingWith: '1', dontWrapKeysStartingWith: '' }
    ),
    {
      key1: 'key2.val1<br />key2.val2<br />key2.val3',
      key3: {
        key4: [
          '%%_val4_%%',
          '%%_val5_%%',
          '%%_val6_%%'
        ]
      }
    },
    '02.04.01 - does not wrap the key1 contents'
  )
  t.deepEqual(
    ofr(
      {
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        },
        key1: {
          key2: [
            'val1',
            'val2',
            'val3'
          ]
        }
      },
      {
        key1: 'Contact us',
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      { dontWrapKeysEndingWith: '1', dontWrapKeysStartingWith: '' }
    ),
    {
      key1: 'key2.val1<br />key2.val2<br />key2.val3',
      key3: {
        key4: [
          '%%_val4_%%',
          '%%_val5_%%',
          '%%_val6_%%'
        ]
      }
    },
    '02.04.02 - opposite key order'
  )
  t.deepEqual(
    ofr(
      {
        key1: {
          key2: [
            'val1',
            'val2',
            'val3'
          ]
        },
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      {
        key1: 'Contact us',
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      {
        xhtml: false,
        dontWrapKeysEndingWith: '3'
      }
    ),
    {
      key1: '%%_key2.val1_%%<br>%%_key2.val2_%%<br>%%_key2.val3_%%',
      key3: {
        key4: [
          'val4',
          'val5',
          'val6'
        ]
      }
    },
    '02.04.03 - does not touch key3 children'
  )
  t.deepEqual(
    ofr(
      {
        key1: {
          key2: [
            'val1',
            'val2',
            'val3'
          ]
        },
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      {
        key1: 'Contact us',
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      {
        wrapHeads: '%%_',
        wrapTails: '_%%',
        dontWrapKeysStartingWith: 'key3'
      }
    ),
    {
      key1: '%%_key2.val1_%%<br />%%_key2.val2_%%<br />%%_key2.val3_%%',
      key3: {
        key4: [
          'val4',
          'val5',
          'val6'
        ]
      }
    },
    '02.04.04 - does not wrap the key3 children'
  )
  t.deepEqual(
    ofr(
      {
        key1: {
          key2: [
            'val1',
            'val2',
            'val3'
          ]
        },
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      {
        key1: 'Contact us',
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      {
        wrapHeads: '%%_',
        wrapTails: '_%%',
        xhtml: false,
        dontWrapKeysStartingWith: 'key4'
      }
    ),
    {
      key1: '%%_key2.val1_%%<br>%%_key2.val2_%%<br>%%_key2.val3_%%',
      key3: {
        key4: [
          'val4',
          'val5',
          'val6'
        ]
      }
    },
    '02.04.05 - nothing, because key4 is not top-level'
  )
})

test('02.05 - array of input vs string of reference', function (t) {
  t.deepEqual(
    ofr(
      {
        key1: ['val1', 'val2', 'val3'],
        key3: {
          key4: [
            'val4',
            'val5'
          ]
        }
      },
      {
        key1: 'Contact us',
        key3: {
          key4: [
            'aaa',
            'zzz'
          ]
        }
      }
    ),
    {
      key1: '%%_val1_%%<br />%%_val2_%%<br />%%_val3_%%',
      key3: {
        key4: [
          '%%_val4_%%',
          '%%_val5_%%'
        ]
      }
    },
    '02.05'
  )
})

test('02.06 - action within an array\'s contents', function (t) {
  t.deepEqual(
    ofr(
      {
        key1: [
          {
            a: 'a',
            b: [
              {
                x: 'xx',
                z: 'zz'
              }
            ],
            c: {
              d: ['e', 'f', 'g', 'h']
            }
          }
        ]
      },
      {
        key1: [
          {
            a: 'a',
            b: [
              {
                x: 'xx',
                z: 'zz'
              }
            ],
            c: 'cc'
          }
        ]
      }
    ),
    {
      key1: [
        {
          a: '%%_a_%%',
          b: [
            {
              x: '%%_xx_%%',
              z: '%%_zz_%%'
            }
          ],
          c: '%%_d.e_%%<br />%%_d.f_%%<br />%%_d.g_%%<br />%%_d.h_%%'
        }
      ]
    },
    '02.06.01'
  )
})

test('02.07 - doesn\'t wrap empty string values', function (t) {
  t.deepEqual(
    ofr(
      {
        key1: ['val1', 'val2', 'val3'],
        key3: {
          key4: [
            'val4',
            ''
          ]
        }
      },
      {
        key1: 'Contact us',
        key3: {
          key4: [
            'aaa',
            'zzz'
          ]
        }
      }
    ),
    {
      key1: '%%_val1_%%<br />%%_val2_%%<br />%%_val3_%%',
      key3: {
        key4: [
          '%%_val4_%%',
          ''
        ]
      }
    },
    '02.07'
  )
})

test('02.08 - reference array as value is shorter than input\'s', function (t) {
  t.deepEqual(
    ofr(
      {
        key1: ['val1', 'val2', 'val3'],
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      {
        key1: 'Contact us',
        key3: {
          key4: [
            'aaa'
          ]
        }
      }
    ),
    {
      key1: '%%_val1_%%<br />%%_val2_%%<br />%%_val3_%%',
      key3: {
        key4: [
          '%%_val4_%%',
          '%%_val5_%%',
          '%%_val6_%%'
        ]
      }
    },
    '02.08'
  )
})

test('02.09 - one ignore works on multiple keys', function (t) {
  t.deepEqual(
    ofr(
      {
        key_aaaa: 'something',
        key_bbbb: 'anything',
        wrapme: 'oh yes'
      },
      {
        key_aaaa: 'Title',
        key_bbbb: 'Subtitle'
      },
      {
        dontWrapKeysStartingWith: ['key'],
        wrapHeads: '${',
        wrapTails: '}'
      }
    ),
    {
      key_aaaa: 'something',
      key_bbbb: 'anything',
      wrapme: 'oh yes'
    },
    '02.09.01 - defaults on opts.whatToDoWhenReferenceIsMissing'
  )
  t.deepEqual(
    ofr(
      {
        key_aaaa: 'something',
        key_bbbb: 'anything',
        wrapme: 'oh yes'
      },
      {
        key_aaaa: 'Title',
        key_bbbb: 'Subtitle'
      },
      {
        dontWrapKeysStartingWith: ['key'],
        wrapHeads: '${',
        wrapTails: '}',
        whatToDoWhenReferenceIsMissing: 0
      }
    ),
    {
      key_aaaa: 'something',
      key_bbbb: 'anything',
      wrapme: 'oh yes'
    },
    '02.09.02 - hardcoded defaults on opts.whatToDoWhenReferenceIsMissing'
  )
  t.deepEqual(
    ofr(
      {
        key_aaaa: 'something',
        key_bbbb: 'anything',
        wrapme: 'oh yes'
      },
      {
        key_aaaa: 'Title',
        key_bbbb: 'Subtitle'
      },
      {
        dontWrapKeysStartingWith: ['key'],
        wrapHeads: '${',
        wrapTails: '}',
        whatToDoWhenReferenceIsMissing: 2
      }
    ),
    {
      key_aaaa: 'something',
      key_bbbb: 'anything',
      wrapme: '${oh yes}'
    },
    '02.09.03 - defaults on opts.whatToDoWhenReferenceIsMissing'
  )
  t.deepEqual(
    ofr(
      {
        key_aaaa: 'something',
        key_bbbb: 'anything',
        wrapme: 'oh yes'
      },
      {
        key_aaaa: 'Title',
        key_bbbb: 'Subtitle',
        wrapme: 'z'
      },
      {
        dontWrapKeysStartingWith: ['key'],
        wrapHeads: '${',
        wrapTails: '}'
      }
    ),
    {
      key_aaaa: 'something',
      key_bbbb: 'anything',
      wrapme: '${oh yes}'
    },
    '02.09.04 - normal case, where reference is provided for key "wrapme"'
  )
  t.deepEqual(
    ofr(
      {
        key_aaaa: {a: 'a'},
        key_bbbb: {b: 'b'},
        wrapme: {c: 'c'}
      },
      {
        key_aaaa: 'a',
        key_bbbb: 'b',
        wrapme: 'c'
      },
      {
        dontWrapKeysStartingWith: ['key'],
        wrapHeads: '${',
        wrapTails: '}'
      }
    ),
    {
      key_aaaa: 'a.a',
      key_bbbb: 'b.b',
      wrapme: '${c.c}'
    },
    '02.09.05 - same as #04 but with objects'
  )
})

// -----------------------------------------------------------------------------
// 03. opts.ignore
// -----------------------------------------------------------------------------

test('03.01 - opts.ignore & wrapping function', function (t) {
  t.deepEqual(
    ofr(
      {
        key1: 'val11.val12',
        key2: 'val21.val22'
      },
      {
        key1: 'Contact us',
        key2: 'Tel. 0123456789'
      }
    ),
    {
      key1: '%%_val11.val12_%%',
      key2: '%%_val21.val22_%%'
    },
    '03.01.01 - default behaviour'
  )
  t.deepEqual(
    ofr(
      {
        key1: 'val11.val12',
        key2: 'val21.val22'
      },
      {
        key1: 'Contact us',
        key2: 'Tel. 0123456789'
      },
      {
        ignore: 'key1'
      }
    ),
    {
      key1: 'val11.val12',
      key2: '%%_val21.val22_%%'
    },
    '03.01.02 - does not wrap ignored string'
  )
  t.deepEqual(
    ofr(
      {
        key1: 'val11.val12',
        key2: 'val21.val22'
      },
      {
        key1: 'Contact us',
        key2: 'Tel. 0123456789'
      },
      {
        ignore: ['z', 'key1']
      }
    ),
    {
      key1: 'val11.val12',
      key2: '%%_val21.val22_%%'
    },
    '03.01.03 - does not wrap ignored array'
  )
})

test('03.02 - flattens an array value but doesn\'t touch other one', function (t) {
  t.deepEqual(
    ofr(
      {
        key1: {
          key2: [
            'val1',
            'val2',
            'val3'
          ]
        },
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      {
        key1: 'Contact us',
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      }
    ),
    {
      key1: '%%_key2.val1_%%<br />%%_key2.val2_%%<br />%%_key2.val3_%%',
      key3: {
        key4: [
          '%%_val4_%%',
          '%%_val5_%%',
          '%%_val6_%%'
        ]
      }
    },
    '03.02.01'
  )
  t.deepEqual(
    ofr(
      {
        key1: {
          key2: [
            'val1',
            'val2',
            'val3'
          ]
        },
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      {
        key1: 'Contact us',
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      {
        wrapHeads: '%%_',
        wrapTails: '_%%'
      }
    ),
    {
      key1: '%%_key2.val1_%%<br />%%_key2.val2_%%<br />%%_key2.val3_%%',
      key3: {
        key4: [
          '%%_val4_%%',
          '%%_val5_%%',
          '%%_val6_%%'
        ]
      }
    },
    '03.02.02'
  )
  t.deepEqual(
    ofr(
      {
        key1: {
          key2: [
            'val1',
            'val2',
            'val3'
          ]
        },
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      {
        key1: 'Contact us',
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      {
        ignore: 'key1'
      }
    ),
    {
      key1: {
        key2: [
          'val1',
          'val2',
          'val3'
        ]
      },
      key3: {
        key4: [
          '%%_val4_%%',
          '%%_val5_%%',
          '%%_val6_%%'
        ]
      }
    },
    '03.02.03 - ignore affects key1, default wrapping'
  )
  t.deepEqual(
    ofr(
      {
        key1: {
          key2: [
            'val1',
            'val2',
            'val3'
          ]
        },
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      {
        key1: 'Contact us',
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      {
        wrapHeads: '%%_',
        wrapTails: '_%%',
        ignore: 'key1'
      }
    ),
    {
      key1: {
        key2: [
          'val1',
          'val2',
          'val3'
        ]
      },
      key3: {
        key4: [
          '%%_val4_%%',
          '%%_val5_%%',
          '%%_val6_%%'
        ]
      }
    },
    '03.02.04 - ignore affects key1, custom wrapping'
  )
  t.deepEqual(
    ofr(
      {
        key0: {
          key2: [
            'val1',
            'val2',
            'val3'
          ]
        },
        key1: {
          key2: [
            'val1',
            'val2',
            'val3'
          ]
        },
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      {
        key1: 'Contact us',
        key0: 'Text',
        key3: {
          key4: [
            'val4',
            'val5',
            'val6'
          ]
        }
      },
      {
        wrapHeads: '%%_',
        wrapTails: '_%%',
        ignore: 'key0'
      }
    ),
    {
      key0: {
        key2: [
          'val1',
          'val2',
          'val3'
        ]
      },
      key1: '%%_key2.val1_%%<br />%%_key2.val2_%%<br />%%_key2.val3_%%',
      key3: {
        key4: [
          '%%_val4_%%',
          '%%_val5_%%',
          '%%_val6_%%'
        ]
      }
    },
    '03.02.05 - some ignored, some flattened'
  )
})

// -----------------------------------------------------------------------------
// 04. opts.whatToDoWhenReferenceIsMissing
// -----------------------------------------------------------------------------

test('04.01 - opts.whatToDoWhenReferenceIsMissing', function (t) {
  t.deepEqual(
    ofr(
      {
        a: {
          c: 'd'
        },
        b: {
          e: 'f'
        }
      },
      {
        a: 'a'
      }
    ),
    {
      a: '%%_c.d_%%',
      b: {
        e: 'f'
      }
    },
    '04.01.01 - no opts - opt. 0 - skips'
  )
  t.deepEqual(
    ofr(
      {
        a: {
          c: 'd'
        },
        b: {
          e: 'f'
        }
      },
      {
        a: 'a'
      }
    ),
    {
      a: '%%_c.d_%%',
      b: {
        e: 'f'
      }
    },
    '04.01.02 - opts - opt. 0 hardcoded - skips (same as #01)'
  )
  t.throws(function () {
    ofr(
      {
        a: {
          c: 'd'
        },
        b: {
          e: 'f'
        }
      },
      {
        a: 'a'
      },
      {
        whatToDoWhenReferenceIsMissing: 1
      }
    )
  })
  t.deepEqual(
    ofr(
      {
        a: {
          c: 'd'
        },
        b: {
          e: 'f'
        }
      },
      {
        a: 'a'
      },
      {
        whatToDoWhenReferenceIsMissing: 2
      }
    ),
    {
      a: '%%_c.d_%%',
      b: '%%_e.f_%%'
    },
    '04.01.04 - opts - opt. 2 - flattens to string anyway + wraps if permitted'
  )
})

// -----------------------------------------------------------------------------
// 05. Other cases
// -----------------------------------------------------------------------------

test('05.01 - double-wrapping prevention when markers have white space', function (t) {
  t.deepEqual(
    ofr(
      {
        key1: '%%_val11.val12_%%',
        key2: 'val21.val22'
      },
      {
        key1: 'Contact us',
        key2: 'Tel. 0123456789'
      }
    ),
    {
      key1: '%%_val11.val12_%%',
      key2: '%%_val21.val22_%%'
    },
    '05.01.01 - base'
  )
  t.deepEqual(
    ofr(
      {
        key1: '%%_val11.val12_%%', // << notice missing white space around markers
        key2: 'val21.val22'
      },
      {
        key1: 'Contact us',
        key2: 'Tel. 0123456789'
      },
      {
        wrapHeads: '%%_ ', // << notice the white space around markers
        wrapTails: ' _%%'
      }
    ),
    {
      key1: '%%_val11.val12_%%',
      key2: '%%_ val21.val22 _%%'
    },
    '05.01.02 - whitespace on default heads and tails, checking double wrapping prevention'
  )
  t.deepEqual(
    ofr(
      {
        key1: '{val11.val12}', // << notice missing white space around markers
        key2: 'val21.val22'
      },
      {
        key1: 'Contact us',
        key2: 'Tel. 0123456789'
      },
      {
        wrapHeads: '{ ', // << notice the white space around markers
        wrapTails: ' }'
      }
    ),
    {
      key1: '{val11.val12}', // << not { {val11.val12} }
      key2: '{ val21.val22 }'
    },
    '05.01.03 - whitespace on custom heads and tails, checking double wrapping prevention'
  )
})

// -----------------------------------------------------------------------------
// 95. util.reclaimIntegerString
// -----------------------------------------------------------------------------

test('95.01 - util.reclaimIntegerString - does what it says on strings', function (t) {
  t.deepEqual(
    reclaimIntegerString('1'),
    1,
    '95.01.03'
  )
})

test('95.02 - util.reclaimIntegerString - doesn\'t parse non-integer strings', function (t) {
  t.deepEqual(
    reclaimIntegerString('1.1'),
    '1.1',
    '95.02'
  )
})

test('95.03 - util.reclaimIntegerString - doesn\'t parse non-number strings either', function (t) {
  t.deepEqual(
    reclaimIntegerString('zz'),
    'zz',
    '95.03'
  )
})

test('95.04 - util.reclaimIntegerString - doesn\'t parse booleans', function (t) {
  t.deepEqual(
    reclaimIntegerString(true),
    true,
    '95.04'
  )
})

// -----------------------------------------------------------------------------
// 96. util.arrayiffyString
// -----------------------------------------------------------------------------

test('96.01 - util.arrayiffyString - turns string into an array', function (t) {
  t.deepEqual(
    arrayiffyString('zzz'),
    ['zzz'],
    '96.01'
  )
})

test('96.02 - util.arrayiffyString - turns empty string into an empty array', function (t) {
  t.deepEqual(
    arrayiffyString(''),
    [],
    '96.02'
  )
})

test('96.03 - util.arrayiffyString - doesn\'t touch any other input types', function (t) {
  t.deepEqual(
    arrayiffyString(['a']),
    ['a'],
    '96.03.01'
  )
  t.deepEqual(
    arrayiffyString([]),
    [],
    '96.03.02'
  )
  t.deepEqual(
    arrayiffyString(1),
    1,
    '96.03.03'
  )
  t.deepEqual(
    arrayiffyString(null),
    null,
    '96.03.04'
  )
})

// -----------------------------------------------------------------------------
// 97. util.checkTypes
// -----------------------------------------------------------------------------

test('97.01 - util.checkTypes > missing both inputs - throws', t => {
  t.throws(function () {
    checkTypes()
  })
})

test('97.02 - util.checkTypes > key of wrong type', t => {
  t.throws(function () {
    checkTypes({a: 'a'}, {a: false}, 'Error!', 'a')
  })
})

test('97.03 - util.checkTypes > key of wrong type', t => {
  t.throws(function () {
    checkTypes({a: 'a', b: false}, {a: 'a', b: 'something'}, 'Error!', 'b')
  })
})

// -----------------------------------------------------------------------------
// 98. util.flattenObject
// -----------------------------------------------------------------------------

test('98.01 - util.flattenObject > empty input', function (t) {
  t.deepEqual(
    flattenObject(),
    [],
    '98.01.01'
  )
  t.deepEqual(
    flattenObject({}),
    [],
    '98.01.02'
  )
})

test('98.02 - util.flattenObject > simple object', function (t) {
  t.deepEqual(
    flattenObject(
      {
        a: 'b',
        c: 'd'
      },
      {
        wrapHeads: '%%_',
        wrapTails: '_%%',
        dontWrapKeysEndingWith: [],
        dontWrapKeysStartingWith: [],
        xhtml: true,
        preventDoubleWrapping: true,
        objectKeyAndValueJoinChar: '.'
      }
    ),
    ['a.b', 'c.d'],
    '98.02'
  )
})

test('98.03 - util.flattenObject > nested objects', function (t) {
  t.deepEqual(
    flattenObject(
      {
        a: {b: 'c', d: 'e'},
        f: {g: 'h', e: 'j'}
      },
      {
        wrapHeads: '%%_',
        wrapTails: '_%%',
        dontWrapKeysEndingWith: [],
        dontWrapKeysStartingWith: [],
        xhtml: true,
        preventDoubleWrapping: true,
        objectKeyAndValueJoinChar: '.'
      }
    ),
    ['a.b.c', 'a.d.e', 'f.g.h', 'f.e.j'],
    '98.03'
  )
})

// -----------------------------------------------------------------------------
// 99. util.flattenArr
// -----------------------------------------------------------------------------

test('99.01 - util.flattenArr > empty input', function (t) {
  t.deepEqual(
    flattenArr(),
    '',
    '99.01'
  )
})

test('99.02 - util.flattenArr > simple array', function (t) {
  t.deepEqual(
    flattenArr(
      ['a', 'b', 'c'],
      {
        wrapHeads: '%%_',
        wrapTails: '_%%',
        dontWrapKeysEndingWith: [],
        dontWrapKeysStartingWith: [],
        xhtml: true,
        preventDoubleWrapping: true,
        objectKeyAndValueJoinChar: '.'
      },
      true
    ),
    '%%_a_%%<br />%%_b_%%<br />%%_c_%%',
    '99.02.01'
  )
  t.deepEqual(
    flattenArr(
      ['a', 'b', 'c'],
      {
        wrapHeads: '%%_',
        wrapTails: '_%%',
        dontWrapKeysEndingWith: [],
        dontWrapKeysStartingWith: [],
        xhtml: true,
        preventDoubleWrapping: true,
        objectKeyAndValueJoinChar: '.'
      },
      false
    ),
    'a<br />b<br />c',
    '99.02.02'
  )
})
