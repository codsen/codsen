/* eslint-disable no-template-curly-in-string */
import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { flattenReferencing as ofr } from "../dist/object-flatten-referencing.esm.js";

// -----------------------------------------------------------------------------
// 01. various throws
// -----------------------------------------------------------------------------

test("01 - throws when inputs are missing/wrong", () => {
  throws(
    () => {
      ofr();
    },
    /THROW_ID_01/g,
    "01.01"
  );
  throws(
    () => {
      ofr({ a: "a" });
    },
    /THROW_ID_02/g,
    "01.02"
  );
  throws(
    () => {
      ofr({ a: "a" }, { a: "a" }, 1);
    },
    /THROW_ID_03/g,
    "01.03"
  );
});

// -----------------------------------------------------------------------------
// 02. B.A.U.
// -----------------------------------------------------------------------------

test("02 - defaults - objects, one level", () => {
  equal(
    ofr(
      {
        key1: "val11.val12",
        key2: "val21.val22",
      },
      {
        key1: "Contact us",
        key2: "Tel. 0123456789",
      }
    ),
    {
      key1: "%%_val11.val12_%%",
      key2: "%%_val21.val22_%%",
    },
    "02.01"
  );
  equal(
    ofr(
      {
        key1: "val11.val12",
        key2: "val21.val22",
      },
      {
        key1: "Contact us",
        key2: "Tel. 0123456789",
      },
      {
        wrapHeadsWith: "",
        wrapTailsWith: "",
      }
    ),
    {
      key1: "val11.val12",
      key2: "val21.val22",
    },
    "02.02"
  );
  equal(
    ofr(
      {
        key1: "val11.val12",
        key2: "val21.val22",
      },
      {
        key1: "Contact us",
        key2: "Tel. 0123456789",
      },
      {
        wrapHeadsWith: "{",
        wrapTailsWith: "",
      }
    ),
    {
      key1: "{val11.val12",
      key2: "{val21.val22",
    },
    "02.03"
  );
  equal(
    ofr(
      {
        key1: "val11.val12",
        key2: "val21.val22",
      },
      {
        key1: "Contact us",
        key2: "Tel. 0123456789",
      },
      {
        wrapHeadsWith: "",
        wrapTailsWith: "}",
      }
    ),
    {
      key1: "val11.val12}",
      key2: "val21.val22}",
    },
    "02.04"
  );
  equal(
    ofr(
      {
        key1: "val11.val12",
        key2: "val21.val22",
      },
      {
        key1: "Contact us",
        key2: "Tel. 0123456789",
      },
      {
        dontWrapKeys: "key*",
      }
    ),
    {
      key1: "val11.val12",
      key2: "val21.val22",
    },
    "02.05"
  );
  equal(
    ofr(
      {
        key1: "val11.val12",
        key2: "val21.val22",
      },
      {
        key1: "Contact us",
        key2: "Tel. 0123456789",
      },
      {
        dontWrapKeys: ["key*"],
      }
    ),
    {
      key1: "val11.val12",
      key2: "val21.val22",
    },
    "02.06"
  );
  equal(
    ofr(
      {
        key1: "val11.val12",
        key2: "val21.val22",
      },
      {
        key1: "Contact us",
        key2: "Tel. 0123456789",
      },
      {
        dontWrapKeys: ["*1", "*2", "*3"],
      }
    ),
    {
      key1: "val11.val12",
      key2: "val21.val22",
    },
    "02.07"
  );
  equal(
    ofr(
      {
        thekey1: "val11.val12",
        akey2: "val21.val22",
      },
      {
        thekey1: "Contact us",
        akey2: "Tel. 0123456789",
      },
      {
        dontWrapKeys: ["a*", "*1", "*3"],
      }
    ),
    {
      thekey1: "val11.val12",
      akey2: "val21.val22",
    },
    "02.08"
  );
  equal(
    ofr(
      {
        thekey1: { val11: "val12" },
        akey2: { val21: "val22" },
      },
      {
        thekey1: "Contact us",
        akey2: "Tel. 0123456789",
      },
      {
        dontWrapKeys: ["a*", "*1", "*3"],
      }
    ),
    {
      thekey1: "val11.val12",
      akey2: "val21.val22",
    },
    "02.09"
  );
  equal(
    ofr(
      {
        KEY1: "val11.val12",
        KEY2: "val21.val22",
      },
      {
        key1: "Contact us",
        key2: "Tel. 0123456789",
      },
      {
        dontWrapKeys: "key*",
      }
    ),
    {
      KEY1: "val11.val12",
      KEY2: "val21.val22",
    },
    "02.10"
  );
});

test("03 - opts.preventDoubleWrapping", () => {
  equal(
    ofr(
      {
        key1: "%%_val11.val12_%%",
        key2: "val21.val22",
      },
      {
        key1: "Contact us",
        key2: "Tel. 0123456789",
      }
    ),
    {
      key1: "%%_val11.val12_%%",
      key2: "%%_val21.val22_%%",
    },
    "03.01"
  );
  equal(
    ofr(
      {
        key1: "%%_val11.val12_%%",
        key2: "val21.val22",
      },
      {
        key1: "Contact us",
        key2: "Tel. 0123456789",
      },
      {
        preventDoubleWrapping: false,
      }
    ),
    {
      key1: "%%_%%_val11.val12_%%_%%",
      key2: "%%_val21.val22_%%",
    },
    "03.02"
  );
  equal(
    ofr(
      {
        key1: "{val11.val12}",
        key2: "val21.val22",
      },
      {
        key1: "Contact us",
        key2: "Tel. 0123456789",
      },
      {
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
      }
    ),
    {
      key1: "{val11.val12}",
      key2: "{val21.val22}",
    },
    "03.03"
  );
  equal(
    ofr(
      {
        key1: "aaa %%val11.val12%% bbb",
        key2: "val21.val22",
      },
      {
        key1: "Contact us",
        key2: "Tel. 0123456789",
      },
      {
        wrapHeadsWith: "%%",
        wrapTailsWith: "%%",
      }
    ),
    {
      key1: "aaa %%val11.val12%% bbb",
      key2: "%%val21.val22%%",
    },
    "03.04"
  );
});

test("04 - flattens an array value but doesn't touch other one", () => {
  equal(
    ofr(
      {
        key1: {
          key2: ["val1", "val2", "val3"],
        },
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        key1: "Contact us",
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      }
    ),
    {
      key1: "%%_key2.val1_%%<br />%%_key2.val2_%%<br />%%_key2.val3_%%",
      key3: {
        key4: ["%%_val4_%%", "%%_val5_%%", "%%_val6_%%"],
      },
    },
    "04.01"
  );
  equal(
    ofr(
      {
        key1: {
          key2: ["val1", "val2", "val3"],
        },
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        key1: "Contact us",
        key3: {
          key4: ["%%_val4_%%", "%%_val5_%%", "%%_val6_%%"],
        },
      },
      {
        xhtml: false,
      }
    ),
    {
      key1: "%%_key2.val1_%%<br>%%_key2.val2_%%<br>%%_key2.val3_%%",
      key3: {
        key4: ["%%_val4_%%", "%%_val5_%%", "%%_val6_%%"],
      },
    },
    "04.02"
  );
  equal(
    ofr(
      {
        key1: {
          key2: ["val1", "val2", "val3"],
        },
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        key1: "Contact us",
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        wrapHeadsWith: "%%_",
        wrapTailsWith: "_%%",
      }
    ),
    {
      key1: "%%_key2.val1_%%<br />%%_key2.val2_%%<br />%%_key2.val3_%%",
      key3: {
        key4: ["%%_val4_%%", "%%_val5_%%", "%%_val6_%%"],
      },
    },
    "04.03"
  );
  equal(
    ofr(
      {
        key1: {
          key2: ["val1", "val2", "val3"],
        },
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        key1: "Contact us",
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        wrapHeadsWith: "%%_",
        wrapTailsWith: "_%%",
        xhtml: false,
      }
    ),
    {
      key1: "%%_key2.val1_%%<br>%%_key2.val2_%%<br>%%_key2.val3_%%",
      key3: {
        key4: ["%%_val4_%%", "%%_val5_%%", "%%_val6_%%"],
      },
    },
    "04.04"
  );
  equal(
    ofr(
      {
        key1: {
          key2: ["val1", "val2", "val3"],
        },
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        key1: "Contact us",
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        mergeArraysWithLineBreaks: false,
      }
    ),
    {
      key1: "%%_key2.val1_%%%%_key2.val2_%%%%_key2.val3_%%",
      key3: {
        key4: ["%%_val4_%%", "%%_val5_%%", "%%_val6_%%"],
      },
    },
    "04.05"
  );
});

test("05 - wildcards in opts.dontWrapKeys", () => {
  equal(
    ofr(
      {
        key1: {
          key2: ["val1", "val2", "val3"],
        },
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        key1: "Contact us",
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        dontWrapKeys: "*1",
      }
    ),
    {
      key1: "key2.val1<br />key2.val2<br />key2.val3",
      key3: {
        key4: ["%%_val4_%%", "%%_val5_%%", "%%_val6_%%"],
      },
    },
    "05.01"
  );
  equal(
    ofr(
      {
        key3: {
          key4: ["val4", "val5", "val6"],
        },
        key1: {
          key2: ["val1", "val2", "val3"],
        },
      },
      {
        key1: "Contact us",
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        dontWrapKeys: "*1",
      }
    ),
    {
      key1: "key2.val1<br />key2.val2<br />key2.val3",
      key3: {
        key4: ["%%_val4_%%", "%%_val5_%%", "%%_val6_%%"],
      },
    },
    "05.02"
  );
  equal(
    ofr(
      {
        key1: {
          key2: ["val1", "val2", "val3"],
        },
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        key1: "Contact us",
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        xhtml: false,
        dontWrapKeys: "*3",
      }
    ),
    {
      key1: "%%_key2.val1_%%<br>%%_key2.val2_%%<br>%%_key2.val3_%%",
      key3: {
        key4: ["val4", "val5", "val6"],
      },
    },
    "05.03"
  );
  equal(
    ofr(
      {
        key1: {
          key2: ["val1", "val2", "val3"],
        },
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        key1: "Contact us",
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        wrapHeadsWith: "%%_",
        wrapTailsWith: "_%%",
        dontWrapKeys: "key3*",
      }
    ),
    {
      key1: "%%_key2.val1_%%<br />%%_key2.val2_%%<br />%%_key2.val3_%%",
      key3: {
        key4: ["val4", "val5", "val6"],
      },
    },
    "05.04"
  );
  equal(
    ofr(
      {
        key1: {
          key2: ["val1", "val2", "val3"],
        },
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        key1: "Contact us",
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        wrapHeadsWith: "%%_",
        wrapTailsWith: "_%%",
        xhtml: false,
        dontWrapKeys: "key4*",
      }
    ),
    {
      key1: "%%_key2.val1_%%<br>%%_key2.val2_%%<br>%%_key2.val3_%%",
      key3: {
        key4: ["val4", "val5", "val6"],
      },
    },
    "05.05"
  );
});

test("06 - array of input vs string of reference", () => {
  equal(
    ofr(
      {
        key1: ["val1", "val2", "val3"],
        key3: {
          key4: ["val4", "val5"],
        },
      },
      {
        key1: "Contact us",
        key3: {
          key4: ["aaa", "zzz"],
        },
      }
    ),
    {
      key1: "%%_val1_%%<br />%%_val2_%%<br />%%_val3_%%",
      key3: {
        key4: ["%%_val4_%%", "%%_val5_%%"],
      },
    },
    "06.01"
  );
});

test("07 - action within an array's contents", () => {
  equal(
    ofr(
      {
        key1: [
          {
            a: "a",
            b: [
              {
                x: "xx",
                z: "zz",
              },
            ],
            c: {
              d: ["e", "f", "g", "h"],
            },
          },
        ],
      },
      {
        key1: [
          {
            a: "a",
            b: [
              {
                x: "xx",
                z: "zz",
              },
            ],
            c: "cc",
          },
        ],
      }
    ),
    {
      key1: [
        {
          a: "%%_a_%%",
          b: [
            {
              x: "%%_xx_%%",
              z: "%%_zz_%%",
            },
          ],
          c: "%%_d.e_%%<br />%%_d.f_%%<br />%%_d.g_%%<br />%%_d.h_%%",
        },
      ],
    },
    "07.01"
  );
});

test("08 - doesn't wrap empty string values", () => {
  equal(
    ofr(
      {
        key1: ["val1", "val2", "val3"],
        key3: {
          key4: ["val4", ""],
        },
      },
      {
        key1: "Contact us",
        key3: {
          key4: ["aaa", "zzz"],
        },
      }
    ),
    {
      key1: "%%_val1_%%<br />%%_val2_%%<br />%%_val3_%%",
      key3: {
        key4: ["%%_val4_%%", ""],
      },
    },
    "08.01"
  );
});

test("09 - reference array as value is shorter than input's", () => {
  equal(
    ofr(
      {
        key1: ["val1", "val2", "val3"],
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        key1: "Contact us",
        key3: {
          key4: ["aaa"],
        },
      }
    ),
    {
      key1: "%%_val1_%%<br />%%_val2_%%<br />%%_val3_%%",
      key3: {
        key4: ["%%_val4_%%", "%%_val5_%%", "%%_val6_%%"],
      },
    },
    "09.01"
  );
});

test("10 - one ignore works on multiple keys", () => {
  equal(
    ofr(
      {
        key_aaaa: "something",
        key_bbbb: "anything",
        wrapme: "oh yes",
      },
      {
        key_aaaa: "Title",
        key_bbbb: "Subtitle",
      },
      {
        dontWrapKeys: ["key*"],
        wrapHeadsWith: "${",
        wrapTailsWith: "}",
      }
    ),
    {
      key_aaaa: "something",
      key_bbbb: "anything",
      wrapme: "oh yes",
    },
    "10.01"
  );
  equal(
    ofr(
      {
        key_aaaa: "something",
        key_bbbb: "anything",
        wrapme: "oh yes",
      },
      {
        key_aaaa: "Title",
        key_bbbb: "Subtitle",
      },
      {
        dontWrapKeys: ["key*"],
        wrapHeadsWith: "${",
        wrapTailsWith: "}",
        whatToDoWhenReferenceIsMissing: 0,
      }
    ),
    {
      key_aaaa: "something",
      key_bbbb: "anything",
      wrapme: "oh yes",
    },
    "10.02"
  );
  equal(
    ofr(
      {
        key_aaaa: "something",
        key_bbbb: "anything",
        wrapme: "oh yes",
      },
      {
        key_aaaa: "Title",
        key_bbbb: "Subtitle",
      },
      {
        dontWrapKeys: ["key*"],
        wrapHeadsWith: "${",
        wrapTailsWith: "}",
        whatToDoWhenReferenceIsMissing: 2,
      }
    ),
    {
      key_aaaa: "something",
      key_bbbb: "anything",
      wrapme: "${oh yes}",
    },
    "10.03"
  );
  equal(
    ofr(
      {
        key_aaaa: "something",
        key_bbbb: "anything",
        wrapme: "oh yes",
      },
      {
        key_aaaa: "Title",
        key_bbbb: "Subtitle",
        wrapme: "z",
      },
      {
        dontWrapKeys: ["key*"],
        wrapHeadsWith: "${",
        wrapTailsWith: "}",
      }
    ),
    {
      key_aaaa: "something",
      key_bbbb: "anything",
      wrapme: "${oh yes}",
    },
    "10.04"
  );
  equal(
    ofr(
      {
        key_aaaa: { a: "a" },
        key_bbbb: { b: "b" },
        wrapme: { c: "c" },
      },
      {
        key_aaaa: "a",
        key_bbbb: "b",
        wrapme: "c",
      },
      {
        dontWrapKeys: ["key*"],
        wrapHeadsWith: "${",
        wrapTailsWith: "}",
      }
    ),
    {
      key_aaaa: "a.a",
      key_bbbb: "b.b",
      wrapme: "${c.c}",
    },
    "10.05"
  );
});

test("11 - deeper level - array VS. string", () => {
  equal(
    ofr(
      {
        a_key: [
          {
            k_key: "k_val",
            l_key: "l_val",
            m_key: ["xxxx", ["1111", "2222", "3333"], "yyyy", "zzzz"],
          },
        ],
        b_key: "b_val",
      },
      {
        a_key: [
          {
            k_key: "k_val",
            l_key: "l_val",
            m_key: ["xxxx", "wwww", "yyyy", "zzzz"],
          },
        ],
        b_key: "b_val",
      }
    ),
    {
      a_key: [
        {
          k_key: "%%_k_val_%%",
          l_key: "%%_l_val_%%",
          m_key: [
            "%%_xxxx_%%",
            "%%_1111_%% %%_2222_%% %%_3333_%%",
            "%%_yyyy_%%",
            "%%_zzzz_%%",
          ],
        },
      ],
      b_key: "%%_b_val_%%",
    },
    "11.01"
  );
});

test("12 - deeper level - array within array VS. string", () => {
  equal(
    ofr(
      {
        a_key: ["xxxx", ["1111", "2222", "3333"], "yyyy", "zzzz"],
        b_key: "b_val",
      },
      {
        a_key: "a_val",
        b_key: "b_val",
      }
    ),
    {
      a_key:
        "%%_xxxx_%%<br />%%_1111_%% %%_2222_%% %%_3333_%%<br />%%_yyyy_%%<br />%%_zzzz_%%",
      b_key: "%%_b_val_%%",
    },
    "12.01"
  );
});

test("13 - deeper level - array within array VS. string #2", () => {
  equal(
    ofr(
      {
        a: [
          {
            k_key: "k_val",
            l_key: [["xxxx", "yyyy", "zzzz"], "222", "333", "444", "555"],
            m_key: "m_val",
          },
        ],
      },
      {
        a: [
          {
            k_key: "k_val",
            l_key: "l_val",
            m_key: "m_val",
          },
        ],
      }
    ),
    {
      a: [
        {
          k_key: "%%_k_val_%%",
          l_key:
            "%%_xxxx_%% %%_yyyy_%% %%_zzzz_%%<br />%%_222_%%<br />%%_333_%%<br />%%_444_%%<br />%%_555_%%",
          m_key: "%%_m_val_%%",
        },
      ],
    },
    "13.01"
  );
  equal(
    ofr(
      {
        a: [
          {
            k_key: "k_val",
            l_key: ["111", ["xxxx", "yyyy", "zzzz"], "222", "333", "444"],
            m_key: "m_val",
          },
        ],
      },
      {
        a: [
          {
            k_key: "k_val",
            l_key: "l_val",
            m_key: "m_val",
          },
        ],
      }
    ),
    {
      a: [
        {
          k_key: "%%_k_val_%%",
          l_key:
            "%%_111_%%<br />%%_xxxx_%% %%_yyyy_%% %%_zzzz_%%<br />%%_222_%%<br />%%_333_%%<br />%%_444_%%",
          m_key: "%%_m_val_%%",
        },
      ],
    },
    "13.02"
  );
});

test("14 - one ignore works on multiple keys", () => {
  equal(
    ofr(
      {
        modules: [
          {
            part1: [
              {
                ccc: [
                  {
                    kkk: ["m", "n", "o", "p"],
                  },
                ],
                ddd: "ddd_val1",
              },
            ],
            part2: [
              {
                ccc: [
                  {
                    kkk: ["r", "s", "t", "u"],
                  },
                ],
                ddd: "ddd_val2",
              },
            ],
          },
        ],
      },
      {
        modules: [
          {
            part1: [
              {
                ccc: [
                  {
                    kkk: "kkk_ref1",
                  },
                ],
                ddd: "ddd_ref1",
              },
            ],
            part2: [
              {
                ccc: [
                  {
                    kkk: "kkk_ref2",
                  },
                ],
                ddd: "ddd_ref2",
              },
            ],
          },
        ],
      },
      {
        dontWrapPaths: ["modules[0].part2[0].ccc[0].kkk"],
        wrapHeadsWith: "{{ ",
        wrapTailsWith: " }}",
        xhtml: true,
      }
    ),
    {
      modules: [
        {
          part1: [
            {
              ccc: [
                {
                  kkk: "{{ m }}<br />{{ n }}<br />{{ o }}<br />{{ p }}",
                },
              ],
              ddd: "{{ ddd_val1 }}",
            },
          ],
          part2: [
            {
              ccc: [
                {
                  kkk: "r<br />s<br />t<br />u",
                },
              ],
              ddd: "{{ ddd_val2 }}",
            },
          ],
        },
      ],
    },
    "14.01"
  );
});

test("15 - opts.mergeWithoutTrailingBrIfLineContainsBr", () => {
  equal(
    ofr(
      {
        key1: [
          "{% if val1 %}{{ val1 }}<br />{% endif %}",
          "{% if val2 %}{{ val2 }}<br />{% endif %}",
          "{% if val3 %}{{ val3 }}{% endif %}",
        ],
      },
      {
        key1: "Contact us",
      },
      {
        wrapGlobalFlipSwitch: false,
      }
    ),
    {
      key1: "{% if val1 %}{{ val1 }}<br />{% endif %}{% if val2 %}{{ val2 }}<br />{% endif %}{% if val3 %}{{ val3 }}{% endif %}",
    },
    "15.01"
  );
  equal(
    ofr(
      {
        key1: [
          "{% if val1 %}{{ val1 }}<br />{% endif %}",
          "{% if val2 %}{{ val2 }}<br />{% endif %}",
          "{% if val3 %}{{ val3 }}{% endif %}",
        ],
      },
      {
        key1: "Contact us",
      },
      {
        wrapGlobalFlipSwitch: false,
        mergeWithoutTrailingBrIfLineContainsBr: true,
      }
    ),
    {
      key1: "{% if val1 %}{{ val1 }}<br />{% endif %}{% if val2 %}{{ val2 }}<br />{% endif %}{% if val3 %}{{ val3 }}{% endif %}",
    },
    "15.02"
  );
  equal(
    ofr(
      {
        key1: [
          "{% if val1 %}{{ val1 }}<br />{% endif %}",
          "{% if val2 %}{{ val2 }}<br />{% endif %}",
          "{% if val3 %}{{ val3 }}{% endif %}",
        ],
      },
      {
        key1: "Contact us",
      },
      {
        wrapGlobalFlipSwitch: false,
        mergeWithoutTrailingBrIfLineContainsBr: false,
      }
    ),
    {
      key1: "{% if val1 %}{{ val1 }}<br />{% endif %}<br />{% if val2 %}{{ val2 }}<br />{% endif %}<br />{% if val3 %}{{ val3 }}{% endif %}",
    },
    "15.03"
  );

  // NOW COMBOS:

  equal(
    ofr(
      {
        key1: [
          "{% if val1 %}{{ val1 }}<br />{% endif %}",
          "{% if val2 %}{{ val2 }}<br />{% endif %}",
          "{% if val3 %}{{ val3 }}{% endif %}",
        ],
      },
      {
        key1: "Contact us",
      },
      {
        wrapGlobalFlipSwitch: false,
        xhtml: false,
        mergeWithoutTrailingBrIfLineContainsBr: false,
      }
    ),
    {
      key1: "{% if val1 %}{{ val1 }}<br />{% endif %}<br>{% if val2 %}{{ val2 }}<br />{% endif %}<br>{% if val3 %}{{ val3 }}{% endif %}",
    },
    "15.04"
  );
});

// -----------------------------------------------------------------------------
// 03. opts.ignore
// -----------------------------------------------------------------------------

test("16 - opts.ignore & wrapping function", () => {
  equal(
    ofr(
      {
        key1: "val11.val12",
        key2: "val21.val22",
      },
      {
        key1: "Contact us",
        key2: "Tel. 0123456789",
      }
    ),
    {
      key1: "%%_val11.val12_%%",
      key2: "%%_val21.val22_%%",
    },
    "16.01"
  );
  equal(
    ofr(
      {
        key1: "val11.val12",
        key2: "val21.val22",
      },
      {
        key1: "Contact us",
        key2: "Tel. 0123456789",
      },
      {
        ignore: "key1",
      }
    ),
    {
      key1: "val11.val12",
      key2: "%%_val21.val22_%%",
    },
    "16.02"
  );
  equal(
    ofr(
      {
        key1: "val11.val12",
        key2: "val21.val22",
      },
      {
        key1: "Contact us",
        key2: "Tel. 0123456789",
      },
      {
        ignore: ["z", "key1"],
      }
    ),
    {
      key1: "val11.val12",
      key2: "%%_val21.val22_%%",
    },
    "16.03"
  );
});

test("17 - flattens an array value but doesn't touch other one", () => {
  equal(
    ofr(
      {
        key1: {
          key2: ["val1", "val2", "val3"],
        },
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        key1: "Contact us",
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      }
    ),
    {
      key1: "%%_key2.val1_%%<br />%%_key2.val2_%%<br />%%_key2.val3_%%",
      key3: {
        key4: ["%%_val4_%%", "%%_val5_%%", "%%_val6_%%"],
      },
    },
    "17.01"
  );
  equal(
    ofr(
      {
        key1: {
          key2: ["val1", "val2", "val3"],
        },
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        key1: "Contact us",
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        wrapHeadsWith: "%%_",
        wrapTailsWith: "_%%",
      }
    ),
    {
      key1: "%%_key2.val1_%%<br />%%_key2.val2_%%<br />%%_key2.val3_%%",
      key3: {
        key4: ["%%_val4_%%", "%%_val5_%%", "%%_val6_%%"],
      },
    },
    "17.02"
  );
  equal(
    ofr(
      {
        key1: {
          key2: ["val1", "val2", "val3"],
        },
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        key1: "Contact us",
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        ignore: "key1",
      }
    ),
    {
      key1: {
        key2: ["val1", "val2", "val3"],
      },
      key3: {
        key4: ["%%_val4_%%", "%%_val5_%%", "%%_val6_%%"],
      },
    },
    "17.03"
  );
  equal(
    ofr(
      {
        key1: {
          key2: ["val1", "val2", "val3"],
        },
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        key1: "Contact us",
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        wrapHeadsWith: "%%_",
        wrapTailsWith: "_%%",
        ignore: "key1",
      }
    ),
    {
      key1: {
        key2: ["val1", "val2", "val3"],
      },
      key3: {
        key4: ["%%_val4_%%", "%%_val5_%%", "%%_val6_%%"],
      },
    },
    "17.04"
  );
  equal(
    ofr(
      {
        key0: {
          key2: ["val1", "val2", "val3"],
        },
        key1: {
          key2: ["val1", "val2", "val3"],
        },
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        key1: "Contact us",
        key0: "Text",
        key3: {
          key4: ["val4", "val5", "val6"],
        },
      },
      {
        wrapHeadsWith: "%%_",
        wrapTailsWith: "_%%",
        ignore: "key0",
      }
    ),
    {
      key0: {
        key2: ["val1", "val2", "val3"],
      },
      key1: "%%_key2.val1_%%<br />%%_key2.val2_%%<br />%%_key2.val3_%%",
      key3: {
        key4: ["%%_val4_%%", "%%_val5_%%", "%%_val6_%%"],
      },
    },
    "17.05"
  );
});

// -----------------------------------------------------------------------------
// 04. opts.whatToDoWhenReferenceIsMissing
// -----------------------------------------------------------------------------

test("18 - opts.whatToDoWhenReferenceIsMissing", () => {
  equal(
    ofr(
      {
        a: {
          c: "d",
        },
        b: {
          e: "f",
        },
      },
      {
        a: "a",
      }
    ),
    {
      a: "%%_c.d_%%",
      b: {
        e: "f",
      },
    },
    "18.01"
  );
  equal(
    ofr(
      {
        a: {
          c: "d",
        },
        b: {
          e: "f",
        },
      },
      {
        a: "a",
      }
    ),
    {
      a: "%%_c.d_%%",
      b: {
        e: "f",
      },
    },
    "18.02"
  );
  throws(
    () => {
      ofr(
        {
          a: {
            c: "d",
          },
          b: {
            e: "f",
          },
        },
        {
          a: "a",
        },
        {
          whatToDoWhenReferenceIsMissing: 1,
        }
      );
    },
    "18.03",
    "18.03"
  );
  equal(
    ofr(
      {
        a: {
          c: "d",
        },
        b: {
          e: "f",
        },
      },
      {
        a: "a",
      },
      {
        whatToDoWhenReferenceIsMissing: 2,
      }
    ),
    {
      a: "%%_c.d_%%",
      b: "%%_e.f_%%",
    },
    "18.04"
  );
});

// -----------------------------------------------------------------------------
// 05. Other cases
// -----------------------------------------------------------------------------

test("19 - double-wrapping prevention when markers have white space", () => {
  equal(
    ofr(
      {
        key1: "%%_val11.val12_%%",
        key2: "val21.val22",
      },
      {
        key1: "Contact us",
        key2: "Tel. 0123456789",
      }
    ),
    {
      key1: "%%_val11.val12_%%",
      key2: "%%_val21.val22_%%",
    },
    "19.01"
  );
  equal(
    ofr(
      {
        key1: "%%_val11.val12_%%", // << notice missing white space around markers
        key2: "val21.val22",
      },
      {
        key1: "Contact us",
        key2: "Tel. 0123456789",
      },
      {
        wrapHeadsWith: "%%_ ", // << notice the white space around markers
        wrapTailsWith: " _%%",
      }
    ),
    {
      key1: "%%_val11.val12_%%",
      key2: "%%_ val21.val22 _%%",
    },
    "19.02"
  );
  equal(
    ofr(
      {
        key1: "{val11.val12}", // << notice missing white space around markers
        key2: "val21.val22",
      },
      {
        key1: "Contact us",
        key2: "Tel. 0123456789",
      },
      {
        wrapHeadsWith: "{ ", // << notice the white space around markers
        wrapTailsWith: " }",
      }
    ),
    {
      key1: "{val11.val12}", // << not { {val11.val12} }
      key2: "{ val21.val22 }",
    },
    "19.03"
  );
});

test("20 - double-wrapping prevention from setting opts.preventWrappingIfContains", () => {
  equal(
    ofr(
      {
        key1: "{% if some_module.some_special_value %}some text{% endif %}",
        key2: "val21.val22",
      },
      {
        key1: "Contact us",
        key2: "Tel. 0123456789",
      },
      {
        wrapHeadsWith: "{{ ",
        wrapTailsWith: " }}",
      }
    ),
    {
      key1: "{{ {% if some_module.some_special_value %}some text{% endif %} }}",
      key2: "{{ val21.val22 }}",
    },
    "20.01"
  );
  equal(
    ofr(
      {
        key1: "{% if some_module.some_special_value %}some text{% endif %}",
        key2: "val21.val22",
      },
      {
        key1: "Contact us",
        key2: "Tel. 0123456789",
      },
      {
        wrapHeadsWith: "{{ ",
        wrapTailsWith: " }}",
        preventWrappingIfContains: "{%",
      }
    ),
    {
      key1: "{% if some_module.some_special_value %}some text{% endif %}",
      key2: "{{ val21.val22 }}",
    },
    "20.02"
  );
  equal(
    ofr(
      {
        key1: "{% if some_module.some_special_value %}some text{% endif %}",
        key2: "val21.val22",
      },
      {
        key1: "Contact us",
        key2: "Tel. 0123456789",
      },
      {
        wrapHeadsWith: "{{ ",
        wrapTailsWith: " }}",
        preventWrappingIfContains: ["zzz", "{%"],
      }
    ),
    {
      key1: "{% if some_module.some_special_value %}some text{% endif %}",
      key2: "{{ val21.val22 }}",
    },
    "20.03"
  );
  equal(
    ofr(
      {
        key1: "{% if some_module.some_special_value %}some text{% endif %}",
        key2: "val21.val22",
      },
      {
        key1: "Contact us",
        key2: "Tel. 0123456789",
      },
      {
        wrapHeadsWith: "{{ ",
        wrapTailsWith: " }}",
        preventWrappingIfContains: ["yyy", "zzz"],
      }
    ),
    {
      key1: "{{ {% if some_module.some_special_value %}some text{% endif %} }}",
      key2: "{{ val21.val22 }}",
    },
    "20.04"
  );
  equal(
    ofr(
      {
        key1: "{% if some_module.some_special_value %}some text{% endif %}",
        key2: "val21.val22",
      },
      {
        key1: "Contact us",
        key2: "Tel. 0123456789",
      },
      {
        wrapHeadsWith: "{{ ",
        wrapTailsWith: " }}",
        preventWrappingIfContains: ["yyy", "zzz"],
        wrapGlobalFlipSwitch: false,
      }
    ),
    {
      key1: "{% if some_module.some_special_value %}some text{% endif %}",
      key2: "val21.val22",
    },
    "20.05"
  );
});

test.run();
