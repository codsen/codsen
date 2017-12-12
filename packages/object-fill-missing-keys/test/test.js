/* eslint ava/no-only-test:0 */

import test from 'ava'
import fillMissingKeys from '../dist/object-fill-missing-keys.cjs'

// ==============================
// 1. Adds missing keys
// ==============================

test('01.01 - filling in missing keys, simple plain object', (t) => {
  t.deepEqual(
    fillMissingKeys(
      {
        a: 'a',
      },
      {
        a: false,
        b: false,
        c: false,
      },
    ),
    {
      a: 'a',
      b: false,
      c: false,
    },
    '01.01',
  )
})

test('01.02 - filling in missing keys, nested, with arrays', (t) => {
  t.deepEqual(
    fillMissingKeys(
      {
        a: 'a',
      },
      {
        a: false,
        b: [
          {
            x: 'x',
          },
        ],
        c: {
          y: 'y',
        },
      },
    ),
    {
      a: 'a',
      b: [
        {
          x: 'x',
        },
      ],
      c: {
        y: 'y',
      },
    },
    '01.02.01',
  )
  t.deepEqual(
    fillMissingKeys(
      {
        a: 'a',
      },
      {
        a: 'z',
        b: [
          {
            x: 'x',
          },
        ],
        c: {
          y: 'y',
        },
      },
    ),
    {
      a: 'a',
      b: [
        {
          x: 'x',
        },
      ],
      c: {
        y: 'y',
      },
    },
    '01.02.02',
  )
})

test('01.03 - multiple values, sorting as well', (t) => {
  t.deepEqual(
    fillMissingKeys(
      {
        b: 'b',
        a: 'a',
      },
      {
        a: false,
        b: false,
        c: false,
      },
    ),
    {
      a: 'a',
      b: 'b',
      c: false,
    },
    '01.03',
  )
})

test('01.04 - nested arrays as values (array in schema overwrites Boolean)', (t) => {
  t.deepEqual(
    fillMissingKeys(
      {
        a: false,
      },
      {
        a: [
          {
            b: false,
          },
        ],
      },
    ),
    {
      a: [
        {
          b: false,
        },
      ],
    },
    '01.04',
  )
})

test('01.05 - more complex nested arrays', (t) => {
  t.deepEqual(
    fillMissingKeys(
      {
        c: 'c',
      },
      {
        a: false,
        b: [
          {
            x: false,
            y: false,
          },
        ],
        c: false,
      },
    ),
    {
      a: false,
      b: [
        {
          x: false,
          y: false,
        },
      ],
      c: 'c',
    },
    '01.05',
  )
})

test('01.06 - ridiculously deep nesting', (t) => {
  t.deepEqual(
    fillMissingKeys(
      {
        a: false,
      },
      {
        a: [
          {
            b: [
              {
                c: [
                  {
                    d: [
                      {
                        e: [
                          {
                            f: [
                              {
                                g: [
                                  {
                                    h: [
                                      {
                                        i: [
                                          {
                                            j: [
                                              {
                                                k: false,
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ),
    {
      a: [
        {
          b: [
            {
              c: [
                {
                  d: [
                    {
                      e: [
                        {
                          f: [
                            {
                              g: [
                                {
                                  h: [
                                    {
                                      i: [
                                        {
                                          j: [
                                            {
                                              k: false,
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    '01.06',
  )
})

test('01.07 - cheeky case, custom placeholder on schema has value null', (t) => {
  t.deepEqual(
    fillMissingKeys(
      {
        d: null,
      },
      {
        a: null,
        b: null,
        c: null,
      },
    ),
    {
      a: null,
      b: null,
      c: null,
      d: null,
    },
    '01.07',
  )
})

// ==============================
// 2. Normalises array contents
// ==============================

test('02.01 - one level-deep array', (t) => {
  t.deepEqual(
    fillMissingKeys(
      {
        a: [
          {
            b: 'b',
          },
          {
            c: 'c',
          },
          {
            d: 'd',
          },
          {
            e: 'e',
          },
        ],
      },
      {
        a: [
          {
            b: false,
            c: false,
            d: false,
            e: false,
          },
        ],
      },
    ),
    {
      a: [
        {
          b: 'b',
          c: false,
          d: false,
          e: false,
        },
        {
          b: false,
          c: 'c',
          d: false,
          e: false,
        },
        {
          b: false,
          c: false,
          d: 'd',
          e: false,
        },
        {
          b: false,
          c: false,
          d: false,
          e: 'e',
        },
      ],
    },
    '02.01',
  )
})

test('02.02 - multiple levels of nested arrays)', (t) => {
  t.deepEqual(
    fillMissingKeys(
      {
        c: 'c',
      },
      {
        a: false,
        b: [
          {
            key4: false,
            key5: false,
            key6: [
              {
                key7: false,
                key8: false,
              },
            ],
          },
        ],
        c: false,
      },
    ),
    {
      a: false,
      b: [
        {
          key4: false,
          key5: false,
          key6: [
            {
              key7: false,
              key8: false,
            },
          ],
        },
      ],
      c: 'c',
    },
    '02.02',
  )
})

// ==============================
// 3. String vs array clashes
// ==============================

test('03.01 - string vs array clash', (t) => {
  t.deepEqual(
    fillMissingKeys(
      {
        a: 'a',
      },
      {
        a: [
          {
            b: false,
          },
        ],
      },
    ),
    {
      a: [
        {
          b: false,
        },
      ],
    },
    '03.01',
  )
})

test('03.02 - string vs object clash', (t) => {
  t.deepEqual(
    fillMissingKeys(
      {
        a: 'a',
      },
      {
        a: {
          b: false,
        },
      },
    ),
    {
      a: {
        b: false,
      },
    },
    '03.02',
  )
})

test('03.03 - object vs array clash', (t) => {
  t.deepEqual(
    fillMissingKeys(
      {
        a: {
          c: 'ccc',
        },
      },
      {
        a: [
          {
            b: false,
          },
        ],
      },
    ),
    {
      a: [
        {
          b: false,
        },
      ],
    },
    '03.03',
  )
})

test('03.04 - array vs empty array', (t) => {
  t.deepEqual(
    fillMissingKeys(
      {
        a: [],
        b: 'b',
      },
      {
        a: [
          {
            d: false,
            e: false,
          },
        ],
        b: false,
        c: false,
      },
    ),
    {
      a: [
        {
          d: false,
          e: false,
        },
      ],
      b: 'b',
      c: false,
    },
    '03.04',
  )
})

test('03.05 - array vs string', (t) => {
  t.deepEqual(
    fillMissingKeys(
      {
        a: 'a',
        b: 'b',
      },
      {
        a: [
          {
            d: false,
            e: false,
          },
        ],
        b: false,
        c: false,
      },
    ),
    {
      a: [
        {
          d: false,
          e: false,
        },
      ],
      b: 'b',
      c: false,
    },
    '03.05',
  )
})

test('03.06 - array vs bool', (t) => {
  t.deepEqual(
    fillMissingKeys(
      {
        a: true,
        b: 'b',
      },
      {
        a: [
          {
            d: false,
            e: false,
          },
        ],
        b: false,
        c: false,
      },
    ),
    {
      a: [
        {
          d: false,
          e: false,
        },
      ],
      b: 'b',
      c: false,
    },
    '03.06',
  )
})

test('03.06 - multiple levels of nested arrays #1', (t) => {
  t.deepEqual(
    fillMissingKeys(
      {
        a: false,
        c: 'c',
      },
      {
        a: false,
        b: [
          {
            b1: false,
            b2: false,
            b3: [
              {
                b4: false,
                b5: false,
              },
            ],
          },
        ],
        c: false,
      },
    ),
    {
      a: false,
      b: [
        {
          b1: false,
          b2: false,
          b3: [
            {
              b4: false,
              b5: false,
            },
          ],
        },
      ],
      c: 'c',
    },
    '03.06',
  )
})

test('03.07 - multiple levels of nested arrays #2', (t) => {
  t.deepEqual(
    fillMissingKeys(
      {
        b: [
          {
            b1: 'val1',
            b2: 'val2',
            b3: [
              {
                b4: 'val4',
              },
              {
                b5: 'val5',
              },
            ],
          },
        ],
      },
      {
        a: false,
        b: [
          {
            b1: false,
            b2: false,
            b3: [
              {
                b4: false,
                b5: false,
              },
            ],
          },
        ],
        c: false,
      },
    ),
    {
      a: false,
      b: [
        {
          b1: 'val1',
          b2: 'val2',
          b3: [
            {
              b4: 'val4',
              b5: false,
            },
            {
              b4: false,
              b5: 'val5',
            },
          ],
        },
      ],
      c: false,
    },
    '03.07',
  )
})

// ==============================
// 4. Contingencies
// ==============================

test('04.01 - number as input', (t) => {
  t.throws(() => {
    fillMissingKeys(
      1,
      {
        a: {
          b: false,
        },
      },
    )
  })
})

test('04.02 - boolean as input', (t) => {
  t.throws(() => {
    fillMissingKeys(
      true,
      {
        a: {
          b: false,
        },
      },
    )
  })
})

test('04.03 - null as input', (t) => {
  t.throws(() => {
    fillMissingKeys(
      null,
      {
        a: {
          b: false,
        },
      },
    )
  })
})

test('04.04 - both args missing (as in hardcoded undefined)', (t) => {
  t.throws(() => {
    fillMissingKeys(
      undefined,
      undefined,
    )
  })
})

test('04.05 - both args completely missing', (t) => {
  t.throws(() => {
    fillMissingKeys()
  })
})

test('04.06 - second arg is not a plain object', (t) => {
  t.throws(() => {
    fillMissingKeys({ a: 'b' }, 1)
  })
})

test('04.07 - opts is not a plain object', (t) => {
  t.throws(() => {
    fillMissingKeys({ a: 'c' }, { a: 'b' }, 1)
  })
  t.notThrows(() => {
    fillMissingKeys({ a: 'c' }, { a: 'b' }, null)
  })
})

// ================================
// 5. Input arg mutation prevention
// ================================

test('05.01 - does not mutate the input args', (t) => {
  const testObj = {
    a: 'a',
  }
  const tempRes = fillMissingKeys(
    testObj,
    {
      a: false,
      b: false,
      c: false,
    },
  )
  t.pass(tempRes) // dummy
  t.deepEqual(
    testObj,
    {
      a: 'a',
    },
    '05.01',
  ) // real deal
})

// ========================================================
// 6. opts.doNotFillTheseKeysIfAllTheirValuesArePlaceholder
// ========================================================

test.only('06.01 - some keys filled, some ignored because they have placeholders-only', (t) => {
  // baseline behaviour

  // t.deepEqual(
  //   fillMissingKeys(
  //     {
  //       a: {
  //         b: false,
  //         x: 'x',
  //       },
  //       z: 'z',
  //     },
  //     {
  //       a: {
  //         b: {
  //           c: false,
  //           d: false,
  //         },
  //         x: false,
  //       },
  //       z: false,
  //     },
  //   ),
  //   {
  //     a: {
  //       b: {
  //         c: false,
  //         d: false,
  //       },
  //       x: 'x',
  //     },
  //     z: 'z',
  //   },
  //   '06.01.01 - default behaviour - keys are added',
  // )

  t.deepEqual(
    fillMissingKeys(
      {
        a: {
          b: false,
          x: 'x',
        },
        z: 'z',
      },
      {
        a: {
          b: {
            c: false,
            d: false,
          },
          x: false,
        },
        z: false,
      },
      {
        doNotFillTheseKeysIfAllTheirValuesArePlaceholder: ['a.b'],
      },
    ),
    {
      a: {
        b: false, // <---------------- observe, the keys were not added because it had a placeholder
        x: 'x',
      },
      z: 'z',
    },
    '06.01.02 - opts.doNotFillTheseKeysIfAllTheirValuesArePlaceholder',
  )
})

// TODO: test array notation, like a[0].b[0][0].c
