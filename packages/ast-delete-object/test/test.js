import test from 'ava'
import clone from 'lodash.clonedeep'
import deleteObj from '../dist/ast-delete-object.cjs'

// (input, objToDelete, strictOrNot)

// ==============================
// Object within an array(s), not strict
// ==============================

test('01.01 - delete one object within an array', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: 'val2',
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: 'val2',
        key3: 'val3',
      },
      { matchKeysStrictly: false, hungryForWhitespace: false },
    ),
    [
      'elem1',
      'elem4',
    ],
    '01.01.01 - defaults',
  )
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: 'val2',
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: 'val2',
        key3: 'val3',
      },
      { matchKeysStrictly: true, hungryForWhitespace: false },
    ),
    [
      'elem1',
      {
        key2: 'val2',
        key3: 'val3',
        key4: 'val4',
      },
      'elem4',
    ],
    '01.01.02 - strict matching',
  )
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: 'val2',
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: 'val2',
        key3: 'val3',
      },
      { matchKeysStrictly: false, hungryForWhitespace: true },
    ),
    [
      'elem1',
      'elem4',
    ],
    '01.01.03 - hungry for whitespace',
  )
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: 'val2',
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: 'val2',
        key3: 'val3',
      },
      { matchKeysStrictly: true, hungryForWhitespace: true },
    ),
    [
      'elem1',
      {
        key2: 'val2',
        key3: 'val3',
        key4: 'val4',
      },
      'elem4',
    ],
    '01.01.04 - hungry for whitespace, strict match',
  )
})

test('01.02 - delete one object, involves white space', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: 'val2',
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: 'val2',
        key3: '   ',
      },
      { matchKeysStrictly: false, hungryForWhitespace: false },
    ),
    [
      'elem1',
      {
        key2: 'val2',
        key3: 'val3',
        key4: 'val4',
      },
      'elem4',
    ],
    '01.02.01 - won\'t delete because of white space mismatching strictly',
  )
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: 'val2',
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: 'val2',
        key3: 'val3',
      },
      { matchKeysStrictly: true, hungryForWhitespace: false },
    ),
    [
      'elem1',
      {
        key2: 'val2',
        key3: 'val3',
        key4: 'val4',
      },
      'elem4',
    ],
    '01.02.02 - won\'t delete because of strict match is on',
  )
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: 'val2',
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: 'val2',
        key3: 'val3',
      },
      { matchKeysStrictly: false, hungryForWhitespace: true },
    ),
    [
      'elem1',
      'elem4',
    ],
    '01.02.03 - will delete because match is not strict and hungry is on',
  )
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: 'val2',
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: 'val2',
        key3: 'val3',
      },
      { matchKeysStrictly: true, hungryForWhitespace: true },
    ),
    [
      'elem1',
      {
        key2: 'val2',
        key3: 'val3',
        key4: 'val4',
      },
      'elem4',
    ],
    '01.02.04 - won\'t delete because of strict match, hungry does not matter',
  )
})

test('01.03 - multiple findings, object within array', (t) => {
  t.deepEqual(
    deleteObj([
      {
        key2: 'val2',
        key3: 'val3',
        yo: 'yo',
        this: 'will be deleted too',
      },
      'elem1',
      {
        key2: 'val2',
        key3: 'val3',
        del: 'as well',
        array: ['a', 'b', 'c', {
          obj: 'obj1',
        }],
      },
      'elem4', {
        key2: 'val2',
        key3: 'val3',
        and: 'this',
        deleted: {
          key2: 'val2',
          key3: 'val3',
        },
      },
    ], {
      key2: 'val2',
      key3: 'val3',
    }), [
      'elem1',
      'elem4',
    ],
    '01.03.01',
  )
  t.deepEqual(
    deleteObj(
      [
        {
          key2: 'val2',
          key3: 'val3',
          yo: 'yo',
          this: 'will be deleted too',
        },
        'elem1',
        {
          key2: 'val2',
          key3: 'val3',
          del: 'as well',
          array: ['a', 'b', 'c', {
            obj: 'obj1',
          }],
        },
        'elem4', {
          key2: 'val2',
          key3: 'val3',
          and: 'this',
          deleted: {
            key2: 'val2',
            key3: 'val3',
          },
        },
      ], {
        key2: 'val2',
        key3: 'val3',
      },
      { matchKeysStrictly: true },
    ),
    [
      {
        key2: 'val2',
        key3: 'val3',
        yo: 'yo',
        this: 'will be deleted too',
      },
      'elem1',
      {
        key2: 'val2',
        key3: 'val3',
        del: 'as well',
        array: ['a', 'b', 'c', {
          obj: 'obj1',
        }],
      },
      'elem4', {
        key2: 'val2',
        key3: 'val3',
        and: 'this',
      },
    ],
    '01.03.02 - some not deleted because of strict match',
  )
  t.deepEqual(
    deleteObj(
      [
        {
          key2: 'val2',
          key3: 'val3',
          yo: 'yo',
          this: 'will be deleted too',
        },
        'elem1',
        {
          key2: 'val2',
          key3: 'val3',
          del: 'as well',
          array: ['a', 'b', 'c', {
            obj: 'obj1',
          }],
        },
        'elem4', {
          key2: 'val2',
          key3: 'val3',
          and: 'this',
          deleted: {
            key2: 'val2',
            key3: 'val3',
          },
        },
      ], {
        key2: 'val2',
        key3: 'val3',
      },
      { hungryForWhitespace: true },
    ), [
      'elem1',
      'elem4',
    ],
    '01.03.03',
  )
  t.deepEqual(
    deleteObj(
      [
        {
          key2: 'val2',
          key3: 'val3',
          yo: 'yo',
          this: 'will be deleted too',
        },
        'elem1',
        {
          key2: 'val2',
          key3: 'val3',
          del: 'as well',
          array: ['a', 'b', 'c', {
            obj: 'obj1',
          }],
        },
        'elem4', {
          key2: 'val2',
          key3: 'val3',
          and: 'this',
          deleted: {
            key2: 'val2',
            key3: 'val3',
          },
        },
      ], {
        key2: 'val2',
        key3: 'val3',
      },
      { matchKeysStrictly: true, hungryForWhitespace: true },
    ),
    [
      {
        key2: 'val2',
        key3: 'val3',
        yo: 'yo',
        this: 'will be deleted too',
      },
      'elem1',
      {
        key2: 'val2',
        key3: 'val3',
        del: 'as well',
        array: ['a', 'b', 'c', {
          obj: 'obj1',
        }],
      },
      'elem4', {
        key2: 'val2',
        key3: 'val3',
        and: 'this',
      },
    ],
    '01.03.04 - some not deleted because of strict match',
  )
})

test('01.04 - delete object within an arrays', (t) => {
  t.deepEqual(
    deleteObj([
      'elem1', [
        'elem2', {
          key3: 'val3',
          key4: 'val4',
          del: 'as well',
          whatnot: 'this doesn\'t matter',
        },
      ],
      'elem5',
    ], {
      key3: 'val3',
      key4: 'val4',
    }), [
      'elem1', [
        'elem2',
      ],
      'elem5',
    ],
    '01.04.01',
  )
  t.deepEqual(
    deleteObj(
      [
        'elem1', [
          'elem2', {
            key3: 'val3',
            key4: 'val4',
            del: 'as well',
            whatnot: 'this doesn\'t matter',
          },
        ],
        'elem5',
      ],
      {
        key3: 'val3',
        key4: 'val4',
      },
      { matchKeysStrictly: true },
    ),
    [
      'elem1', [
        'elem2', {
          key3: 'val3',
          key4: 'val4',
          del: 'as well',
          whatnot: 'this doesn\'t matter',
        },
      ],
      'elem5',
    ],
    '01.04.02',
  )
  t.deepEqual(
    deleteObj(
      [
        'elem1', [
          'elem2', {
            key3: 'val3',
            key4: 'val4',
            del: 'as well',
            whatnot: 'this doesn\'t matter',
          },
        ],
        'elem5',
      ], {
        key3: 'val3',
        key4: 'val4',
      },
      { hungryForWhitespace: true },
    ), [
      'elem1', [
        'elem2',
      ],
      'elem5',
    ],
    '01.04.03',
  )
  t.deepEqual(
    deleteObj(
      [
        'elem1', [
          'elem2', {
            key3: 'val3',
            key4: 'val4',
            del: 'as well',
            whatnot: 'this doesn\'t matter',
          },
        ],
        'elem5',
      ],
      {
        key3: 'val3',
        key4: 'val4',
      },
      { matchKeysStrictly: true, hungryForWhitespace: true },
    ),
    [
      'elem1', [
        'elem2', {
          key3: 'val3',
          key4: 'val4',
          del: 'as well',
          whatnot: 'this doesn\'t matter',
        },
      ],
      'elem5',
    ],
    '01.04.04',
  )
})

test('01.05 - delete object within an array, wrong order of keys, pt.1', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: 'val2',
          key4: 'val4',
          key3: 'val3',
        },
        {
          key3: 'val3',
          key4: 'val4',
          key2: 'val2',
        },
        'elem4',
      ],
      {
        key2: 'val2',
        key3: 'val3',
      },
      { matchKeysStrictly: false, hungryForWhitespace: false },
    ),
    [
      'elem1',
      'elem4',
    ],
    '01.05.01 - defaults (not strict match, not white space hungry)',
  )
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: 'val2',
          key4: 'val4',
          key3: 'val3',
        },
        {
          key3: 'val3',
          key4: 'val4',
          key2: 'val2',
        },
        'elem4',
      ],
      {
        key2: 'val2',
        key3: 'val3',
      },
      { matchKeysStrictly: true, hungryForWhitespace: false },
    ),
    [
      'elem1',
      {
        key2: 'val2',
        key4: 'val4',
        key3: 'val3',
      },
      {
        key3: 'val3',
        key4: 'val4',
        key2: 'val2',
      },
      'elem4',
    ],
    '01.05.02 - strict match',
  )
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: 'val2',
          key4: 'val4',
          key3: 'val3',
        },
        {
          key3: 'val3',
          key4: 'val4',
          key2: 'val2',
        },
        'elem4',
      ],
      {
        key2: 'val2',
        key3: 'val3',
      },
      { matchKeysStrictly: false, hungryForWhitespace: true },
    ),
    [
      'elem1',
      'elem4',
    ],
    '01.05.03 - whitespace hungry',
  )
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: 'val2',
          key4: 'val4',
          key3: 'val3',
        },
        {
          key3: 'val3',
          key4: 'val4',
          key2: 'val2',
        },
        'elem4',
      ],
      {
        key2: 'val2',
        key3: 'val3',
      },
      { matchKeysStrictly: true, hungryForWhitespace: true },
    ),
    [
      'elem1',
      {
        key2: 'val2',
        key4: 'val4',
        key3: 'val3',
      },
      {
        key3: 'val3',
        key4: 'val4',
        key2: 'val2',
      },
      'elem4',
    ],
    '01.05.04 - white space hungry with strict match',
  )
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key3: 'val3',
          key2: 'val2',
        },
        {
          key3: 'val3',
          key4: 'val4',
          key2: 'val2',
        },
        'elem4',
      ],
      {
        key2: 'val2',
        key3: 'val3',
      },
      { matchKeysStrictly: true, hungryForWhitespace: true },
    ),
    [
      'elem1',
      {
        key3: 'val3',
        key4: 'val4',
        key2: 'val2',
      },
      'elem4',
    ],
    '01.05.05 - strict match, different input',
  )
})

test('01.06 - delete object within an array, wrong order of keys, pt.2', (t) => {
  t.deepEqual(
    deleteObj([{
      tag: 'a',
      attrs: {
        class: 'animals',
        href: '#',
      },
      content: [
        '\n    ', {
          tag: 'span',
          attrs: {
            class: 'animals__cat',
            style: 'background: url(cat.png)',
          },
          content: ['Cat'],
        },
        '\n',
      ],
    }], {
      class: 'animals',
    }), [{
      tag: 'a',
      content: [
        '\n    ', {
          tag: 'span',
          attrs: {
            class: 'animals__cat',
            style: 'background: url(cat.png)',
          },
          content: ['Cat'],
        },
        '\n',
      ],
    }],
    '01.06',
  )
})

test('01.07 - special case, not strict', (t) => {
  t.deepEqual(
    deleteObj(
      {
        key: ['a'],
      },
      {
        key: [],
      },
    ),
    {
      key: ['a'],
    },
    '01.07',
  )
})

test('01.08 - special case, strict', (t) => {
  t.deepEqual(
    deleteObj(
      {
        key: ['a'],
      },
      {
        key: [],
      },
      { matchKeysStrictly: true },
    ),
    {
      key: ['a'],
    },
    '01.08',
  )
})

test('01.09 - real-life situation #1', (t) => {
  t.deepEqual(
    deleteObj({
      stylesheet: {
        rules: [
          {
            rules: {
              type: 'rule',
              selectors: [],
            },
          },
          {
            rules: {
              type: 'rule',
              selectors: ['.w2'],
            },
          }],
      },
    }, {
      type: 'rule',
      selectors: [],
    }), {
      stylesheet: {
        rules: [
          {},
          {
            rules: {
              type: 'rule',
              selectors: ['.w2'],
            },
          }],
      },
    },
    '01.09',
  )
})

test('01.10 - real-life situation #2', (t) => {
  t.deepEqual(
    deleteObj({
      type: 'stylesheet',
      stylesheet: {
        rules: [{
          type: 'media',
          media: 'only screen and (max-width: 660px)',
          rules: [{
            type: 'rule',
            selectors: [],
            declarations: [{
              type: 'declaration',
              property: 'width',
              value: '1px !important',
              position: {
                start: {
                  line: 3,
                  column: 12,
                },
                end: {
                  line: 3,
                  column: 32,
                },
              },
            }],
            position: {
              start: {
                line: 3,
                column: 7,
              },
              end: {
                line: 3,
                column: 34,
              },
            },
          }],
          position: {
            start: {
              line: 2,
              column: 5,
            },
            end: {
              line: 4,
              column: 6,
            },
          },
        }, {
          type: 'media',
          media: 'only screen and (max-width: 660px)',
          rules: [{
            type: 'rule',
            selectors: [
              '.w2',
            ],
            declarations: [{
              type: 'declaration',
              property: 'width',
              value: '1px !important',
              position: {
                start: {
                  line: 6,
                  column: 12,
                },
                end: {
                  line: 6,
                  column: 32,
                },
              },
            }],
            position: {
              start: {
                line: 6,
                column: 7,
              },
              end: {
                line: 6,
                column: 34,
              },
            },
          }],
          position: {
            start: {
              line: 5,
              column: 5,
            },
            end: {
              line: 7,
              column: 6,
            },
          },
        }],
        parsingErrors: [],
      },
    }, {
      type: 'rule',
      selectors: [],
    }), {
      type: 'stylesheet',
      stylesheet: {
        rules: [{
          type: 'media',
          media: 'only screen and (max-width: 660px)',
          rules: [],
          position: {
            start: {
              line: 2,
              column: 5,
            },
            end: {
              line: 4,
              column: 6,
            },
          },
        }, {
          type: 'media',
          media: 'only screen and (max-width: 660px)',
          rules: [{
            type: 'rule',
            selectors: [
              '.w2',
            ],
            declarations: [{
              type: 'declaration',
              property: 'width',
              value: '1px !important',
              position: {
                start: {
                  line: 6,
                  column: 12,
                },
                end: {
                  line: 6,
                  column: 32,
                },
              },
            }],
            position: {
              start: {
                line: 6,
                column: 7,
              },
              end: {
                line: 6,
                column: 34,
              },
            },
          }],
          position: {
            start: {
              line: 5,
              column: 5,
            },
            end: {
              line: 7,
              column: 6,
            },
          },
        }],
        parsingErrors: [],
      },
    },
    '01.10',
  )
})

test('01.11 - multiple empty values blank arrays #1', (t) => {
  t.deepEqual(
    deleteObj(
      deleteObj(
        {
          rules: [
            {
              type: 'rule',
              selectors: [],
              zzz: 'zzzzzz',
            },
            {
              type: 'rule',
              selectors: '',
              zzz: 'zzzzzz',
            },
          ],
        },
        {
          selectors: '',
        },
      ),
      {
        selectors: [],
      },
    )
    ,
    {
      rules: [],
    },
    '01.11',
  )
})

test('01.12 - multiple empty values blank arrays #2', (t) => {
  t.deepEqual(
    deleteObj(
      deleteObj(
        {
          rules: [
            {
              type: 'rule',
              selectors: [],
              zzz: 'zzzzzz',
            },
            {
              type: 'rule',
              selectors: '',
              zzz: 'zzzzzz',
            },
          ],
        },
        {
          selectors: [],
        },
      ),
      {
        selectors: '',
      },
    )
    ,
    {
      rules: [],
    },
    '01.12',
  )
})

test('01.13 - object\'s value is a blank array, looking in an array', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1', {
          key2: [],
          key4: 'val4',
          key3: 'val3',
        },
        'elem4',
      ],
      {
        key2: [],
      },
    ), [
      'elem1',
      'elem4',
    ],
    '01.13',
  )
})

test('01.14 - object\'s value is a blank array, looking in an object', (t) => {
  t.deepEqual(
    deleteObj(
      {
        elem1: {
          key2: [],
          key3: 'val3',
        },
        elem4: 'zz',
      },
      {
        key2: [],
      },
    ),
    {
      elem4: 'zz',
    },
    '01.14',
  )
})

// ==============================
// Object within object, not strict
// ==============================

test('02.01 - delete object within object - simple #1', (t) => {
  t.deepEqual(
    deleteObj([{
      key1: 'val1',
      key2: {
        key3: 'val3',
        key4: 'val4',
        del: 'as well',
      },
    }], {
      key3: 'val3',
      key4: 'val4',
    }), [{
      key1: 'val1',
    }],
    '02.01',
  )
})

test('02.02 - multiple objects to find - simple #1', (t) => {
  t.deepEqual(
    deleteObj([{
      key1: {
        key3: 'val3',
        key4: 'val4',
        del: 'as well',
      },
      key2: 'val2',
      key3: {
        key3: 'val3',
        key4: 'val4',
        del: 'as well',
      },
    }], {
      key3: 'val3',
      key4: 'val4',
    }), [{
      key2: 'val2',
    }],
    '02.02',
  )
})

test('02.03 - multiple objects to find within objects', (t) => {
  t.deepEqual(
    deleteObj([{
      key1: {
        key2: {
          key3: {
            key4: {
              del1: 'del1',
              del2: 'del2',
              del: 'as well',
            },
          },
        },
      },
    }], {
      del1: 'del1',
      del2: 'del2',
    }), [{
      key1: {
        key2: {
          key3: {},
        },
      },
    }],
    '02.03',
  )
})

test('02.04 - real-life scenario', (t) => {
  t.deepEqual(
    deleteObj([{
      rules: [
        {
          type: 'rule',
          selectors: [
            '.hide',
          ],
          declarations: [
            {
              type: 'declaration',
              property: 'display',
              value: 'none !important',
              position: {
                start: {
                  line: 3,
                  column: 13,
                },
                end: {
                  line: 3,
                  column: 36,
                },
              },
            },
          ],
          position: {
            start: {
              line: 3,
              column: 5,
            },
            end: {
              line: 3,
              column: 38,
            },
          },
        },
        {
          type: 'rule',
          selectors: [],
          declarations: [
            {
              type: 'declaration',
              property: 'border-bottom',
              value: '1px solid #cccccc !important',
              position: {
                start: {
                  line: 7,
                  column: 23,
                },
                end: {
                  line: 7,
                  column: 65,
                },
              },
            },
          ],
          position: {
            start: {
              line: 7,
              column: 5,
            },
            end: {
              line: 7,
              column: 67,
            },
          },
        },
      ],
    }], {
      type: 'rule',
      selectors: [],
    }),
    [{
      rules: [
        {
          type: 'rule',
          selectors: [
            '.hide',
          ],
          declarations: [
            {
              type: 'declaration',
              property: 'display',
              value: 'none !important',
              position: {
                start: {
                  line: 3,
                  column: 13,
                },
                end: {
                  line: 3,
                  column: 36,
                },
              },
            },
          ],
          position: {
            start: {
              line: 3,
              column: 5,
            },
            end: {
              line: 3,
              column: 38,
            },
          },
        },
      ],
    }],
    '02.04',
  )
})

test('02.05 - delete object within object - simple #1', (t) => {
  t.deepEqual(
    deleteObj(
      {
        key1: 'val1',
        key2: {
          key3: 'val3',
          key4: 'val4',
          del: 'as well',
        },
      },
      {
        key3: 'val3',
        key4: 'val4',
      },
    ),
    {
      key1: 'val1',
    },
    '02.05',
  )
})

// ==============================
// Edge cases
// ==============================

test('03.01 - the input is the finding', (t) => {
  t.deepEqual(
    deleteObj(
      {
        key3: 'val3',
        key4: 'val4',
        del: 'as well',
      },
      {
        key3: 'val3',
        key4: 'val4',
      },
    ),
    {},
    '03.01.01',
  )
})

test('03.02 - the input is boolean', (t) => {
  t.deepEqual(
    deleteObj(true, {
      key3: 'val3',
      key4: 'val4',
    }),
    true,
    '03.02',
  )
})

test('03.03 - the input is string', (t) => {
  t.deepEqual(
    deleteObj('yo', {
      key3: 'val3',
      key4: 'val4',
    }),
    'yo',
    '03.03',
  )
})

test('03.04 - no input - throws', (t) => {
  t.throws(() => {
    deleteObj()
  })
  t.throws(() => {
    deleteObj(undefined, {
      key3: 'val3',
      key4: 'val4',
    })
  })
  // wrong third argument throws:
  t.throws(() => {
    deleteObj({ a: 'z' }, { b: 'y' }, 1)
  })
})

test('03.05 - the input is the finding (right within array)', (t) => {
  t.deepEqual(
    deleteObj([{
      key3: 'val3',
      key4: 'val4',
    }], {
      key3: 'val3',
      key4: 'val4',
    }), [],
    '03.05',
  )
})

test('03.06 - pt1. empty object to find', (t) => {
  t.deepEqual(
    deleteObj(
      [{
        key3: 'val3',
        key4: 'val4',
      }],
      {},
      { matchKeysStrictly: false, hungryForWhitespace: false },
    ),
    [{
      key3: 'val3',
      key4: 'val4',
    }],
    '03.06.01',
  )
  t.deepEqual(
    deleteObj(
      [{
        key3: 'val3',
        key4: 'val4',
      }],
      {},
      { matchKeysStrictly: false, hungryForWhitespace: true },
    ),
    [{
      key3: 'val3',
      key4: 'val4',
    }],
    '03.06.02',
  )
  t.deepEqual(
    deleteObj(
      [{
        key3: 'val3',
        key4: 'val4',
      }],
      {},
      { matchKeysStrictly: true, hungryForWhitespace: false },
    ),
    [{
      key3: 'val3',
      key4: 'val4',
    }],
    '03.06.03',
  )
  t.deepEqual(
    deleteObj(
      [{
        key3: 'val3',
        key4: 'val4',
      }],
      {},
      { matchKeysStrictly: true, hungryForWhitespace: true },
    ),
    [{
      key3: 'val3',
      key4: 'val4',
    }],
    '03.06.04',
  )
})

// searching for an empty plain object, source contains various empty plain objects
// -----------------------------------------------------------------------------

test('03.06 - pt2. empty object to find', (t) => {
  t.deepEqual(
    deleteObj(
      [{}, {
        key3: 'val3',
        key4: 'val4',
      }, {}, {}],
      {},
      { matchKeysStrictly: false, hungryForWhitespace: false },
    ),
    [{
      key3: 'val3',
      key4: 'val4',
    }],
    '03.06.05',
  )
  t.deepEqual(
    deleteObj(
      [{}, {
        key3: 'val3',
        key4: 'val4',
      }, {}, {}],
      {},
      { matchKeysStrictly: false, hungryForWhitespace: true },
    ),
    [{
      key3: 'val3',
      key4: 'val4',
    }],
    '03.06.06 - rare case - both opts on, matching against blank object - will yield positive against other blank objects, disregarding the STRICTLY flag',
  )
  t.deepEqual(
    deleteObj(
      [{}, {
        key3: 'val3',
        key4: 'val4',
      }, {}, {}],
      {},
      { matchKeysStrictly: true, hungryForWhitespace: false },
    ),
    [{
      key3: 'val3',
      key4: 'val4',
    }],
    '03.06.07',
  )
  t.deepEqual(
    deleteObj(
      [{}, {
        key3: 'val3',
        key4: 'val4',
      }, {}, {}],
      {},
      { matchKeysStrictly: true, hungryForWhitespace: true },
    ),
    [{
      key3: 'val3',
      key4: 'val4',
    }],
    '03.06.08',
  )
})

// searching for an empty array, source includes various empty plain objects
// -----------------------------------------------------------------------------

test('03.06 - pt3. empty object to find', (t) => {
  t.deepEqual(
    deleteObj(
      [{ a: '\n' }, {
        key3: 'val3',
        key4: 'val4',
      }, { b: '   ' }, { c: '' }],
      {},
      { matchKeysStrictly: false, hungryForWhitespace: false },
    ),
    [{ a: '\n' }, {
      key3: 'val3',
      key4: 'val4',
    }, { b: '   ' }, { c: '' }],
    '03.06.09',
  )
  t.deepEqual(
    deleteObj(
      [{ a: '\n' }, {
        key3: 'val3',
        key4: 'val4',
      }, { b: '   ' }, { c: '' }],
      {},
      { matchKeysStrictly: false, hungryForWhitespace: true },
    ),
    [{
      key3: 'val3',
      key4: 'val4',
    }],
    '03.06.10',
  )
  t.deepEqual(
    deleteObj(
      [{ a: '\n' }, {
        key3: 'val3',
        key4: 'val4',
      }, { b: '   ' }, { c: '' }],
      {},
      { matchKeysStrictly: true, hungryForWhitespace: false },
    ),
    [{ a: '\n' }, {
      key3: 'val3',
      key4: 'val4',
    }, { b: '   ' }, { c: '' }],
    '03.06.11',
  )
  t.deepEqual(
    deleteObj(
      [{ a: '\n' }, {
        key3: 'val3',
        key4: 'val4',
      }, { b: '   ' }, { c: '' }],
      {},
      { matchKeysStrictly: true, hungryForWhitespace: true },
    ),
    [{
      key3: 'val3',
      key4: 'val4',
    }],
    '03.06.12',
  )
})

test('03.07 - to find is undefined - throws', (t) => {
  t.throws(() => {
    deleteObj(
      [{
        key3: 'val3',
        key4: 'val4',
      }],
      undefined,
    )
  })
})

test('03.08 - to find is null - throws', (t) => {
  t.throws(() => {
    deleteObj(
      [{
        key3: 'val3',
        key4: 'val4',
      }],
      null,
    )
  })
})

test('03.09 - to find is string - returns input', (t) => {
  t.deepEqual(
    deleteObj(
      [{
        key3: 'val3',
        key4: 'val4',
      }],
      'yo',
    ), [{
      key3: 'val3',
      key4: 'val4',
    }],
    '03.09',
  )
})

// ==============================
// Object within an array(s), strict
// ==============================

test('04.01 - won\'t delete object within an array because of strict mode', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1', {
          key2: 'val2',
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ], {
        key2: 'val2',
        key3: 'val3',
      },
      {
        matchKeysStrictly: true,
      },
    ), [
      'elem1', {
        key2: 'val2',
        key3: 'val3',
        key4: 'val4',
      },
      'elem4',
    ],
    '04.01',
  )
})

test('04.02 - won\'t find multiple findings because of strict mode', (t) => {
  t.deepEqual(
    deleteObj(
      [{
        key2: 'val2',
        deleted: {
          key2: 'val2',
          key3: 'val3',
          key4: 'val4',
        },
      }], {
        key2: 'val2',
        key3: 'val3',
      },
      {
        matchKeysStrictly: true,
      },
    ), [{
      key2: 'val2',
      deleted: {
        key2: 'val2',
        key3: 'val3',
        key4: 'val4',
      },
    }],
    '04.02',
  )
})

test('04.03 - strict mode: deletes some and skips some because of strict mode', (t) => {
  t.deepEqual(
    deleteObj(
      [{
        key2: 'val2',
        key3: 'val3',
        yo: 'yo',
        this: 'will be deleted too',
      },
      'elem1', {
        key2: 'val2',
        key3: 'val3',
        del: 'as well',
        array: ['a', 'b', 'c', {
          obj: 'obj1',
        }],
      },
      'elem4', {
        key2: 'val2',
        key3: 'val3',
        and: 'this',
        deleted: {
          key2: 'val2',
          key3: 'val3',
        },
      },
      ], {
        key2: 'val2',
        key3: 'val3',
      },
      {
        matchKeysStrictly: true,
      },
    ), [{
      key2: 'val2',
      key3: 'val3',
      yo: 'yo',
      this: 'will be deleted too',
    },
    'elem1', {
      key2: 'val2',
      key3: 'val3',
      del: 'as well',
      array: ['a', 'b', 'c', {
        obj: 'obj1',
      }],
    },
    'elem4', {
      key2: 'val2',
      key3: 'val3',
      and: 'this',
    },
    ],
    '04.03',
  )
})

test('04.04 - won\'t delete object within an arrays because of strict mode', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1', [
          'elem2', {
            key3: 'val3',
            key4: 'val4',
            del: 'as well',
            whatnot: 'this doesn\'t matter',
          },
        ],
        'elem5',
      ], {
        key3: 'val3',
        key4: 'val4',
      },
      {
        matchKeysStrictly: true,
      },
    ), [
      'elem1', [
        'elem2', {
          key3: 'val3',
          key4: 'val4',
          del: 'as well',
          whatnot: 'this doesn\'t matter',
        },
      ],
      'elem5',
    ],
    '04.04',
  )
})

// ==============================
// Non-strict recognising empty space
// ==============================

test('05.01 - recognises array containing only empty space - default', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: ['\n\n \t \n \n    '],
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: [],
      },
      {
        hungryForWhitespace: true,
      },
    ),
    [
      'elem1',
      'elem4',
    ],
    '05.01.01',
  )
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: ['\n\n \t \n \n    '],
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: [],
      },
      {
        hungryForWhitespace: false,
      },
    ),
    [
      'elem1',
      {
        key2: ['\n\n \t \n \n    '],
        key3: 'val3',
        key4: 'val4',
      },
      'elem4',
    ],
    '05.01.02',
  )
})

test('05.02 - recognises array containing only empty space - strict', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: ['\n\n \t \n \n    '],
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: [],
      },
      {
        matchKeysStrictly: true,
      },
    ),
    [
      'elem1',
      {
        key2: ['\n\n \t \n \n    '],
        key3: 'val3',
        key4: 'val4',
      },
      'elem4',
    ],
    '05.02.01',
  )
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: ['\n\n \t \n \n    '],
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: [],
      },
      {
        matchKeysStrictly: false,
      },
    ),
    [
      'elem1',
      {
        key2: ['\n\n \t \n \n    '],
        key3: 'val3',
        key4: 'val4',
      },
      'elem4',
    ],
    '05.02.02',
  )
})

test('05.03 - recognises array containing only empty space - not found', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: ['\n\n \t \n \n  .  '],
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: [],
      },
    ),
    [
      'elem1',
      {
        key2: ['\n\n \t \n \n  .  '],
        key3: 'val3',
        key4: 'val4',
      },
      'elem4',
    ],
    '05.03',
  )
})

test('05.04 - two keys in objToDelete - default', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: ['\n\n \t \n \n    '],
          key3: [' ', '\n'],
          key4: 'val4',
        },
        'elem4',
      ], {
        key2: [],
        key3: [''],
      },
      {
        hungryForWhitespace: true,
      },
    ),
    [
      'elem1',
      'elem4',
    ],
    '05.04.01',
  )
  t.throws(() => {
    deleteObj(
      [
        'elem1',
        {
          key2: ['\n\n \t \n \n    '],
          key3: [' ', '\n'],
          key4: 'val4',
        },
        'elem4',
      ], {
        key2: [],
        key3: [''],
      },
      {
        hungryForWhitespace: 'tralala',
      },
    )
  })
})

test('05.05 - two keys in objToDelete - strict, not found', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: ['\n\n \t \n \n   . '],
          key3: [' ', '\n'],
          key4: 'val4',
        },
        'elem4',
      ], {
        key2: [],
        key3: [''],
      },
      {
        matchKeysStrictly: true,
      },
    ),
    [
      'elem1',
      {
        key2: ['\n\n \t \n \n   . '],
        key3: [' ', '\n'],
        key4: 'val4',
      },
      'elem4',
    ],
    '05.05.01',
  )
  t.deepEqual(
    deleteObj([
      'elem1',
      {
        key2: ['\n\n \t \n \n   . '],
        key3: [' ', '\n'],
        key4: 'val4',
      },
      'elem4',
    ], {
      key2: [],
      key3: [''],
    }),
    [
      'elem1',
      {
        key2: ['\n\n \t \n \n   . '],
        key3: [' ', '\n'],
        key4: 'val4',
      },
      'elem4',
    ],
    '05.05.02',
  )
})

test('05.06 - two keys in objToDelete - strict', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: ['\n\n \t \n \n    '],
          key3: [' ', '\n'],
          key4: 'val4',
        },
        'elem4',
      ], {
        key2: [],
        key3: [''],
      },
      { matchKeysStrictly: true },
    ),
    [
      'elem1',
      {
        key2: ['\n\n \t \n \n    '],
        key3: [' ', '\n'],
        key4: 'val4',
      },
      'elem4',
    ],
    '05.06',
  )
})

test('05.07 - array with strings containing emptiness - default', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: ['\n\n \t \n \n    ', '\n', '\t', '   '],
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: [],
      },
    ),
    [
      'elem1',
      {
        key2: ['\n\n \t \n \n    ', '\n', '\t', '   '],
        key3: 'val3',
        key4: 'val4',
      },
      'elem4',
    ],
    '05.07.01',
  )
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: ['\n\n \t \n \n    ', '\n', '\t', '   '],
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: [],
      },
      {
        hungryForWhitespace: true,
      },
    ),
    [
      'elem1',
      'elem4',
    ],
    '05.07.02',
  )
})

test('05.08 - array with strings containing emptiness - strict', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: ['\n\n \t \n \n    ', '\n', '\t', '   '],
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ], {
        key2: [],
      },
      {
        matchKeysStrictly: true,
      },
    ),
    [
      'elem1',
      {
        key2: ['\n\n \t \n \n    ', '\n', '\t', '   '],
        key3: 'val3',
        key4: 'val4',
      },
      'elem4',
    ],
    '05.08',
  )
})

test('05.09 - array with strings containing emptiness - strict found', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: ['\n\n \t \n \n    ', '\n', '\t', '   '],
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: ['\n\n \t \n \n    ', '\n', '\t', '   '],
      },
      {
        matchKeysStrictly: true,
      },
    ),
    [
      'elem1',
      {
        key2: ['\n\n \t \n \n    ', '\n', '\t', '   '],
        key3: 'val3',
        key4: 'val4',
      },
      'elem4',
    ],
    '05.09.01',
  )
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: ['\n\n \t \n \n    ', '\n', '\t', '   '],
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: ['\n\n \t \n \n    ', '\n', '\t', '   '],
      },
      {
        matchKeysStrictly: false,
      },
    ),
    [
      'elem1',
      'elem4',
    ],
    '05.09.02',
  )
})

test('05.10 - recognises string containing only empty space (queried array)', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: '\n\n \t \n \n    ',
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: [],
      },
      {
        hungryForWhitespace: true,
      },
    ),
    [
      'elem1',
      'elem4',
    ],
    '05.10.01',
  )
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: '\n\n \t \n \n    ',
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: [],
      },
      {
        hungryForWhitespace: false,
      },
    ),
    [
      'elem1',
      {
        key2: '\n\n \t \n \n    ',
        key3: 'val3',
        key4: 'val4',
      },
      'elem4',
    ],
    '05.10.02',
  )
})

test('05.11 - recognises string containing only empty space - strict', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: '\n\n \t \n \n    ',
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: [],
      },
      {
        matchKeysStrictly: true,
      },
    ),
    [
      'elem1',
      {
        key2: '\n\n \t \n \n    ',
        key3: 'val3',
        key4: 'val4',
      },
      'elem4',
    ],
    '05.11',
  )
})

test('05.12 - recognises string containing only empty space - won\'t find', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: '\n\n \t \n \n  .  ',
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        a: [],
      },
    ),
    [
      'elem1',
      {
        key2: '\n\n \t \n \n  .  ',
        key3: 'val3',
        key4: 'val4',
      },
      'elem4',
    ],
    '05.12',
  )
})

test('05.13 - recognises string containing only empty space - won\'t find', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: '\n\n \t \n \n    ',
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: [],
        key3: [],
      },
    ),
    [
      'elem1',
      {
        key2: '\n\n \t \n \n    ',
        key3: 'val3',
        key4: 'val4',
      },
      'elem4',
    ],
    '05.13.01',
  )
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: '\n\n \t \n \n    ',
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: [],
        key3: [],
      },
      {
        hungryForWhitespace: true,
      },
    ),
    [
      'elem1',
      {
        key2: '\n\n \t \n \n    ',
        key3: 'val3',
        key4: 'val4',
      },
      'elem4',
    ],
    '05.13.02',
  )
})

test('05.14 - recognises a string containing only empty space (queried array with empty string)', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: '\n\n \t \n \n    ',
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: [''],
      },
      {
        hungryForWhitespace: true,
      },
    ),
    [
      'elem1',
      'elem4',
    ],
    '05.14',
  )
})

test('05.15 - a string containing only empty space (queried array) - strict', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: '\n\n \t \n \n    ',
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: [''],
      },
      {
        matchKeysStrictly: true,
      },
    ),
    [
      'elem1',
      {
        key2: '\n\n \t \n \n    ',
        key3: 'val3',
        key4: 'val4',
      },
      'elem4',
    ],
    '05.15',
  )
})

test('05.16 - a string containing only empty space (queried array) - not found', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: '\n\n \t \n \n    ',
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: [''],
        a: [],
      },
    ),
    [
      'elem1',
      {
        key2: '\n\n \t \n \n    ',
        key3: 'val3',
        key4: 'val4',
      },
      'elem4',
    ],
    '05.16',
  )
})

test('05.17 - recognises string containing only empty space string (queried empty string)', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: '\n\n \t \n \n    ',
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: '',
      },
      {
        hungryForWhitespace: true,
      },
    ),
    [
      'elem1',
      'elem4',
    ],
    '05.17',
  )
})

test('05.18 - multiple string values in objToDelete', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: '\n\n \t \n \n    ',
          key3: '  ',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: '',
        key3: '',
      },
      {
        hungryForWhitespace: true,
      },
    ),
    [
      'elem1',
      'elem4',
    ],
    '05.18',
  )
})

test('05.19 - multiple string values in objToDelete - not found', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: '\n\n \t \n \n  .  ',
          key3: '  ',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: '',
        key3: '',
      },
    ),
    [
      'elem1',
      {
        key2: '\n\n \t \n \n  .  ',
        key3: '  ',
        key4: 'val4',
      },
      'elem4',
    ],
    '05.19',
  )
})

test('05.20 - multiple string values in objToDelete - strict', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: '\n\n \t \n \n    ',
          key3: '  ',
          key4: 'val4',
        },
        {
          key2: '\n\n \t \n \n    ',
          key3: '  ',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: '',
        key3: '',
      },
      { matchKeysStrictly: true },
    ),
    [
      'elem1',
      {
        key2: '\n\n \t \n \n    ',
        key3: '  ',
        key4: 'val4',
      },
      {
        key2: '\n\n \t \n \n    ',
        key3: '  ',
        key4: 'val4',
      },
      'elem4',
    ],
    '05.20',
  )
})

test('05.21 - won\'t find, queried object with empty string value', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: ['\n\n \t \n \n    '],
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        a: '',
      },
    ),
    [
      'elem1',
      {
        key2: ['\n\n \t \n \n    '],
        key3: 'val3',
        key4: 'val4',
      },
      'elem4',
    ],
    '05.21',
  )
})

test('05.22 - recognises array of strings each containing only empty space (queried empty string)', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: ['\n\n \t \n \n    ', '\n\n \n'],
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: '',
      },
      {
        hungryForWhitespace: true,
      },
    ),
    [
      'elem1',
      'elem4',
    ],
    '05.22',
  )
})

test('05.23 - recognises array with multiple strings containing emptiness', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: ['\n\n \t \n \n    ', '\n', '\t', '   '],
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: [''],
      },
      {
        hungryForWhitespace: true,
      },
    ),
    [
      'elem1',
      'elem4',
    ],
    '05.23',
  )
})

test('05.24 - empty array finding empty string', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: '',
          key3: 'val3',
          key4: 'val4',
        },
        {
          key2: '',
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: [],
      },
      {
        hungryForWhitespace: true,
      },
    ),
    [
      'elem1',
      'elem4',
    ],
    '05.24',
  )
})

test('05.25 - empty string finding empty array', (t) => {
  t.deepEqual(
    deleteObj(
      [
        'elem1',
        {
          key2: [],
          key3: 'val3',
          key4: 'val4',
        },
        'elem4',
      ],
      {
        key2: '',
      },
      {
        hungryForWhitespace: true,
      },
    ),
    [
      'elem1',
      'elem4',
    ],
    '05.25',
  )
})

test('05.26 - object deleted from an array, strict mode', (t) => {
  t.deepEqual(
    deleteObj(
      [
        { a: 'a' },
      ],
      {
        a: 'a',
      },
      { matchKeysStrictly: true },
    ),
    [],
    '05.26',
  )
})

// ==============================
// Other and random tests
// ==============================

test('06.01 - real life situation #1', (t) => {
  t.deepEqual(
    deleteObj(
      {
        stylesheet: {
          rules: [
            {
              type: 'rule',
              selectors: '',
            },
            {
              type: 'rule',
              selectors: '',
            },
          ],
        },
      },
      {
        selectors: '',
      },
    ),
    {
      stylesheet: {
        rules: [],
      },
    },
    '06.01',
  )
})

test('06.02 - real life situation #2', (t) => {
  t.deepEqual(
    deleteObj(
      {
        stylesheet: {
          rules: [
            {
              type: 'rule',
              selectors: [],
            },
            {
              type: 'rule',
              selectors: [],
            },
          ],
        },
      },
      {
        selectors: [],
      },
    ),
    {
      stylesheet: {
        rules: [],
      },
    },
    '06.02',
  )
})

test('06.03 - real life situation #3', (t) => {
  t.deepEqual(
    deleteObj(
      {
        type: 'stylesheet',
        stylesheet: {
          rules: [
            {
              type: 'rule',
              selectors: [],
              declarations: [
                {
                  type: 'declaration',
                  property: 'display',
                  value: 'block',
                  position: {
                    start: {
                      line: 2,
                      column: 15,
                    },
                    end: {
                      line: 2,
                      column: 29,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 2,
                  column: 3,
                },
                end: {
                  line: 2,
                  column: 30,
                },
              },
            },
            {
              type: 'rule',
              selectors: [],
              declarations: [
                {
                  type: 'declaration',
                  property: 'display',
                  value: 'inline',
                  position: {
                    start: {
                      line: 3,
                      column: 21,
                    },
                    end: {
                      line: 3,
                      column: 36,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 3,
                  column: 3,
                },
                end: {
                  line: 3,
                  column: 37,
                },
              },
            },
            {
              type: 'rule',
              selectors: [],
              declarations: [
                {
                  type: 'declaration',
                  property: 'display',
                  value: 'inline-block',
                  position: {
                    start: {
                      line: 4,
                      column: 23,
                    },
                    end: {
                      line: 4,
                      column: 44,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 4,
                  column: 3,
                },
                end: {
                  line: 4,
                  column: 45,
                },
              },
            },
            {
              type: 'rule',
              selectors: [],
              declarations: [
                {
                  type: 'declaration',
                  property: 'display',
                  value: 'flex',
                  position: {
                    start: {
                      line: 5,
                      column: 15,
                    },
                    end: {
                      line: 5,
                      column: 28,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 5,
                  column: 3,
                },
                end: {
                  line: 5,
                  column: 30,
                },
              },
            },
          ],
          parsingErrors: [],
        },
      },
      {
        selectors: [],
      },
    ),
    {
      type: 'stylesheet',
      stylesheet: {
        rules: [],
        parsingErrors: [],
      },
    },
    '06.03',
  )
})

test('06.04 - real life situation #4', (t) => {
  t.deepEqual(
    deleteObj(
      {
        type: 'stylesheet',
        stylesheet: {
          rules: [
            {
              type: 'rule',
              selectors: [],
              declarations: [
                {
                  type: 'declaration',
                  property: 'display',
                  value: 'block',
                  position: {
                    start: {
                      line: 2,
                      column: 15,
                    },
                    end: {
                      line: 2,
                      column: 29,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 2,
                  column: 3,
                },
                end: {
                  line: 2,
                  column: 30,
                },
              },
            },
            {
              type: 'rule',
              selectors: [],
              declarations: [
                {
                  type: 'declaration',
                  property: 'display',
                  value: 'inline',
                  position: {
                    start: {
                      line: 3,
                      column: 21,
                    },
                    end: {
                      line: 3,
                      column: 36,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 3,
                  column: 3,
                },
                end: {
                  line: 3,
                  column: 37,
                },
              },
            },
            {
              type: 'rule',
              selectors: [],
              declarations: [
                {
                  type: 'declaration',
                  property: 'display',
                  value: 'inline-block',
                  position: {
                    start: {
                      line: 4,
                      column: 23,
                    },
                    end: {
                      line: 4,
                      column: 44,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 4,
                  column: 3,
                },
                end: {
                  line: 4,
                  column: 45,
                },
              },
            },
            {
              type: 'rule',
              selectors: [],
              declarations: [
                {
                  type: 'declaration',
                  property: 'display',
                  value: 'flex',
                  position: {
                    start: {
                      line: 5,
                      column: 15,
                    },
                    end: {
                      line: 5,
                      column: 28,
                    },
                  },
                },
              ],
              position: {
                start: {
                  line: 5,
                  column: 3,
                },
                end: {
                  line: 5,
                  column: 30,
                },
              },
            },
          ],
          parsingErrors: [],
        },
      },
      {
        selectors: [],
      },
    ),
    {
      type: 'stylesheet',
      stylesheet: {
        rules: [],
        parsingErrors: [],
      },
    },
    '06.04',
  )
})

test('06.05 - empty strings within arrays', (t) => {
  t.deepEqual(
    deleteObj([
      '',
      {
        key2: ['\n\n \t \n \n    '],
        key3: [' ', '\n'],
        key4: 'val4',
      },
      '',
    ], {
      key2: [],
      key3: [''],
    }),
    [
      '',
      {
        key2: ['\n\n \t \n \n    '],
        key3: [' ', '\n'],
        key4: 'val4',
      },
      '',
    ],
    '06.05.01 - defaults',
  )
  t.deepEqual(
    deleteObj(
      [
        '',
        {
          key2: ['\n\n \t \n \n    '],
          key3: [' ', '\n'],
          key4: 'val4',
        },
        '',
      ], {
        key2: [],
        key3: [''],
      },
      {
        hungryForWhitespace: true,
      },
    ),
    ['', ''], // <<< result
    '06.05.02 - hungryForWhitespace',
  )
  t.deepEqual(
    deleteObj(
      [
        '',
        {
          key2: ['\n\n \t \n \n    '],
          key3: [' ', '\n'],
          key4: 'val4',
        },
        '',
      ], {
        key2: [],
        key3: [''],
      },
      {
        matchKeysStrictly: true,
      },
    ),
    [
      '',
      {
        key2: ['\n\n \t \n \n    '],
        key3: [' ', '\n'],
        key4: 'val4',
      },
      '',
    ],
    '06.05.03 - matchKeysStrictly',
  )
  t.deepEqual(
    deleteObj(
      [
        '',
        {
          key2: ['\n\n \t \n \n    '],
          key3: [' ', '\n'],
          key4: 'val4',
        },
        '',
      ],
      {
        key2: [],
        key3: [''],
      },
      {
        matchKeysStrictly: true, hungryForWhitespace: true,
      },
    ),
    [
      '',
      {
        key2: ['\n\n \t \n \n    '],
        key3: [' ', '\n'],
        key4: 'val4',
      },
      '',
    ],
    '06.05.04 - matchKeysStrictly + hungryForWhitespace',
  )
})

test('06.06 - strict mode, deletes everything', (t) => {
  t.deepEqual(
    deleteObj(
      {
        a: 'a',
        b: 'b',
      },
      {
        a: 'a',
        b: 'b',
      },
      {
        matchKeysStrictly: true,
      },
    ),
    {},
    '06.06.01',
  )
  t.deepEqual(
    deleteObj(
      {
        a: 'a',
        b: 'b',
      },
      {
        a: 'a',
        b: 'b',
      },
      {
        matchKeysStrictly: false,
      },
    ),
    {},
    '06.06.02',
  )
})

test('06.07 - treats holes in arrays - ast-monkey will fix them', (t) => {
  t.deepEqual(
    deleteObj(
      ['a', undefined, 'b'],
      {
        x: 'y',
      },
    ),
    ['a', 'b'],
    '06.07',
  )
})

// ==============================
// Testing for input arg mutation
// ==============================

test('07.01 - does not mutate input args', (t) => {
  const obj1 = {
    a: 'a',
    b: 'b',
  }
  const obj2 = clone(obj1)
  const unneededResult = deleteObj(obj1, obj2, { matchKeysStrictly: true })
  t.pass(unneededResult) // dummy to please linter
  t.deepEqual(
    obj1,
    {
      a: 'a',
      b: 'b',
    },
    '07.01.01',
  ) // real deal
  t.deepEqual(
    obj2,
    {
      a: 'a',
      b: 'b',
    },
    '07.01.02',
  ) // real deal
})

// ==========
// Edge cases
// ==========

test('08.01 - wrong input args', (t) => {
  t.throws(() => {
    deleteObj({ a: 'a' }, { a: 'a' }, { matchKeysStrictly: 'true' })
  })
  t.throws(() => {
    deleteObj({ a: 'a' }, { a: 'a' }, { matchKeysStrictly: 1 })
  })
  t.throws(() => {
    deleteObj({ a: 'a' }, { a: 'a' }, { hungryForWhitespace: 'true' })
  })
  t.throws(() => {
    deleteObj({ a: 'a' }, { a: 'a' }, { hungryForWhitespace: 1 })
  })
})
