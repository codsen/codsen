/* eslint no-template-curly-in-string: 0 */

import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { jVar } from "../dist/json-variables.esm.js";

test("01 - two variables in an object's key", () => {
  equal(
    jVar({
      a: "some text %%_var1_%% more text %%_var2_%%",
      b: "something",
      var1: "value1",
      var2: "value2",
    }),
    {
      a: "some text value1 more text value2",
      b: "something",
      var1: "value1",
      var2: "value2",
    },
    "01.01"
  );
});

test("02 - two variables with paths in an object's key", () => {
  equal(
    jVar({
      a: "some text %%_var1.key1.0_%% more text %%_var2.key2.key3.1_%%",
      b: "something",
      var1: { key1: ["value1"] },
      var2: { key2: { key3: ["", "value2"] } },
    }),
    {
      a: "some text value1 more text value2",
      b: "something",
      var1: { key1: ["value1"] },
      var2: { key2: { key3: ["", "value2"] } },
    },
    "02.01"
  );
});

test("03 - two variables, with wrapping", () => {
  equal(
    jVar(
      {
        a: "some text %%_var1_%% more text %%_var2_%%",
        b: "something",
        var1: "value1",
        var2: "value2",
      },
      {
        wrapHeadsWith: "${",
        wrapTailsWith: "}",
      }
    ),
    {
      a: "some text ${value1} more text ${value2}",
      b: "something",
      var1: "value1",
      var2: "value2",
    },
    "03.01"
  );
});

test("04 - variables with paths being wrapped", () => {
  equal(
    jVar(
      {
        a: "some text %%_var1.key1_%% more text %%_var2.key2_%%",
        b: "something",
        var1: { key1: "value1" },
        var2: { key2: "value2" },
      },
      {
        wrapHeadsWith: "${",
        wrapTailsWith: "}",
      }
    ),
    {
      a: "some text ${value1} more text ${value2}",
      b: "something",
      var1: { key1: "value1" },
      var2: { key2: "value2" },
    },
    "04.01"
  );
});

test("05 - custom heads and tails", () => {
  equal(
    jVar(
      {
        a: "some text {var1} more text {var2}",
        b: "something",
        var1: "value1",
        var2: "value2",
      },
      {
        heads: "{",
        tails: "}",
      }
    ),
    {
      a: "some text value1 more text value2",
      b: "something",
      var1: "value1",
      var2: "value2",
    },
    "05.01"
  );
});

test("06 - custom heads and tails being wrapped", () => {
  equal(
    jVar(
      {
        a: "some text {var1.key1} more text {var2.key2}",
        b: "something",
        var1: { key1: "value1" },
        var2: { key2: "value2" },
      },
      {
        heads: "{",
        tails: "}",
      }
    ),
    {
      a: "some text value1 more text value2",
      b: "something",
      var1: { key1: "value1" },
      var2: { key2: "value2" },
    },
    "06.01"
  );
});

test("07 - whitespace within custom heads and tails", () => {
  equal(
    jVar(
      {
        a: "some text {  var1  } more text {  var2  }",
        b: "something",
        var1: "value1",
        var2: "value2",
      },
      {
        heads: "{",
        tails: "}",
      }
    ),
    {
      a: "some text value1 more text value2",
      b: "something",
      var1: "value1",
      var2: "value2",
    },
    "07.01"
  );
});

test("08 - whitespace within variables containing paths and custom heads/tails", () => {
  equal(
    jVar(
      {
        a: "some text {  var1.key1  } more text {  var2.key2  }",
        b: "something",
        var1: { key1: "value1" },
        var2: { key2: "value2" },
      },
      {
        heads: "{",
        tails: "}",
      }
    ),
    {
      a: "some text value1 more text value2",
      b: "something",
      var1: { key1: "value1" },
      var2: { key2: "value2" },
    },
    "08.01"
  );
});

test("09 - some values are equal to heads or tails", () => {
  equal(
    jVar({
      a: "some text %%_var1_%% more text %%_var2_%%",
      b: "something",
      var1: "value1",
      var2: "value2",
      c: "%%_",
      d: "_%%",
      e: "_%%",
    }),
    {
      a: "some text value1 more text value2",
      b: "something",
      var1: "value1",
      var2: "value2",
      c: "%%_",
      d: "_%%",
      e: "_%%",
    },
    "09.01"
  );
});

test("10 - opts.noSingleMarkers - off", () => {
  equal(
    jVar(
      {
        a: "some text %%_var1_%% more text %%_var2_%%",
        b: "something",
        var1: "value1",
        var2: "value2",
        c: "%%_",
        d: "_%%",
        e: "_%%",
      },
      {
        noSingleMarkers: false,
      }
    ),
    {
      a: "some text value1 more text value2",
      b: "something",
      var1: "value1",
      var2: "value2",
      c: "%%_",
      d: "_%%",
      e: "_%%",
    },
    "10.01"
  );
});

test("11 - opts.noSingleMarkers - on", () => {
  throws(
    () => {
      jVar(
        {
          a: "some text %%_var1_%% more text %%_var2_%%",
          b: "something",
          var1: "value1",
          var2: "value2",
          c: "%%_",
          d: "_%%",
          e: "_%%",
        },
        {
          noSingleMarkers: true,
        }
      );
    },
    /THROW_ID_16/,
    "11.01"
  );
});

test("12 - opts.noSingleMarkers - off - more throw tests", () => {
  throws(
    () => {
      jVar(
        {
          a: "some text %%_var1_%% more text %%_var2_%%",
          b: "something",
          var1: "value1",
          var2: "value2",
          c: "%%_",
        },
        {
          noSingleMarkers: true,
        }
      );
    },
    /THROW_ID_16/,
    "12.01"
  );
});

test("13 - custom heads/tails, values equal to them are present in data", () => {
  equal(
    jVar(
      {
        a: "some text {var1} more text {var2}",
        b: "something",
        var1: "value1",
        var2: "value2",
        c: "{",
        d: "}",
        e: "}",
      },
      {
        heads: "{",
        tails: "}",
      }
    ),
    {
      a: "some text value1 more text value2",
      b: "something",
      var1: "value1",
      var2: "value2",
      c: "{",
      d: "}",
      e: "}",
    },
    "13.01"
  );
});

test("14 - custom heads/tails - noSingleMarkers = false", () => {
  equal(
    jVar(
      {
        a: "some text {var1} more text {var2}",
        b: "something",
        var1: "value1",
        var2: "value2",
        c: "{",
        d: "}",
        e: "}",
      },
      {
        noSingleMarkers: false,
        heads: "{",
        tails: "}",
      }
    ),
    {
      a: "some text value1 more text value2",
      b: "something",
      var1: "value1",
      var2: "value2",
      c: "{",
      d: "}",
      e: "}",
    },
    "14.01"
  );
});

test("15 - value in an array", () => {
  equal(
    jVar({
      z: {
        a: ["some text %%_var1_%% more text %%_var2_%%"],
        b: "something",
        var1: "value1",
        var2: "value2",
      },
    }),
    {
      z: {
        a: ["some text value1 more text value2"],
        b: "something",
        var1: "value1",
        var2: "value2",
      },
    },
    "15.01"
  );
});

test("16 - data stores #1", () => {
  equal(
    jVar({
      a: "some text %%_var1_%% more text %%_var3_%%.",
      b: "something",
      a_data: {
        var1: "value1",
        var3: "333333",
      },
    }),
    {
      a: "some text value1 more text 333333.",
      b: "something",
      a_data: {
        var1: "value1",
        var3: "333333",
      },
    },
    "16.01"
  );
  equal(
    jVar(
      {
        a: "some text %%_var1_%% more text %%_var3_%%.",
        b: "something",
        a_data: {
          var1: "value1",
          var3: "333333",
        },
      },
      { wrapHeadsWith: "${", wrapTailsWith: "}" }
    ),
    {
      a: "some text ${value1} more text ${333333}.",
      b: "something",
      a_data: {
        var1: "value1",
        var3: "333333",
      },
    },
    "16.02"
  );
  equal(
    jVar({
      a: "some text %%_var1.key1_%% more text %%_var3.key3_%%.",
      b: "something",
      a_data: {
        var1: { key1: "value1" },
        var3: { key3: "333333" },
      },
    }),
    {
      a: "some text value1 more text 333333.",
      b: "something",
      a_data: {
        var1: { key1: "value1" },
        var3: { key3: "333333" },
      },
    },
    "16.03"
  );
  equal(
    jVar(
      {
        a: "some text %%_var1.key1_%% more text %%_var3.key3_%%.",
        b: "something",
        a_data: {
          var1: { key1: "value1" },
          var3: { key3: "333333" },
        },
      },
      { wrapHeadsWith: "${", wrapTailsWith: "}" }
    ),
    {
      a: "some text ${value1} more text ${333333}.",
      b: "something",
      a_data: {
        var1: { key1: "value1" },
        var3: { key3: "333333" },
      },
    },
    "16.04"
  );
});

test("17 - top-level key and data stash clash", () => {
  equal(
    jVar({
      a: "some text %%_var1_%% more text %%_var3_%%.",
      b: "something",
      var1: "value2",
      a_data: {
        var1: "value1",
        var3: "333333",
      },
    }),
    {
      a: "some text value2 more text 333333.",
      b: "something",
      var1: "value2",
      a_data: {
        var1: "value1",
        var3: "333333",
      },
    },
    "17.01"
  );
  equal(
    jVar(
      {
        a: "some text %%_var1_%% more text %%_var3_%%.",
        b: "something",
        var1: "value2",
        a_data: {
          var1: "value1",
          var3: "333333",
        },
      },
      { wrapHeadsWith: "${", wrapTailsWith: "}" }
    ),
    {
      a: "some text ${value2} more text ${333333}.",
      b: "something",
      var1: "value2",
      a_data: {
        var1: "value1",
        var3: "333333",
      },
    },
    "17.02"
  );
  equal(
    jVar({
      a: "some text %%_var1.key1_%% more text %%_var3.key3_%%.",
      b: "something",
      var1: "value2",
      a_data: {
        var1: { key1: "value1" },
        var3: { key3: "333333" },
      },
    }),
    {
      a: "some text value1 more text 333333.",
      b: "something",
      var1: "value2",
      a_data: {
        var1: { key1: "value1" },
        var3: { key3: "333333" },
      },
    },
    "17.03"
  );
  equal(
    jVar({
      a: "some text %%_var1_%% more text %%_var3.key3_%%.",
      b: "something",
      var1: "value2",
      a_data: {
        var1: { key1: "value1" },
        var3: { key3: "333333" },
      },
    }),
    {
      a: "some text value2 more text 333333.",
      b: "something",
      var1: "value2",
      a_data: {
        var1: { key1: "value1" },
        var3: { key3: "333333" },
      },
    },
    "17.04"
  );
});

test("18 - emoji in values", () => {
  equal(
    jVar({
      a: "some🦄 text %%_var1_%% more text %%_var2_%%.",
      b: "something",
      var1: "value1",
      a_data: {
        var2: "value2",
      },
    }),
    {
      a: "some🦄 text value1 more text value2.",
      b: "something",
      var1: "value1",
      a_data: {
        var2: "value2",
      },
    },
    "18.01"
  );
});

test("19 - emoji in keys", () => {
  equal(
    jVar({
      a: "some🦄 text %%_var🐴_%% more text %%_var2_%%.",
      b: "something",
      "var🐴": "value1",
      a_data: {
        var2: "value2",
      },
    }),
    {
      a: "some🦄 text value1 more text value2.",
      b: "something",
      "var🐴": "value1",
      a_data: {
        var2: "value2",
      },
    },
    "19.01"
  );
});

test("20 - emoji in variable keys", () => {
  equal(
    jVar({
      a: "some🦄 text %%_var🐴_%% more text %%_var2_%%.",
      b: "something",
      "var🐴": "value1💘",
      a_data: {
        var2: "value2💛",
      },
    }),
    {
      a: "some🦄 text value1💘 more text value2💛.",
      b: "something",
      "var🐴": "value1💘",
      a_data: {
        var2: "value2💛",
      },
    },
    "20.01"
  );
});

test("21 - empty strings in the input AST", () => {
  equal(
    jVar({
      a: "some text %%_var1_%% more text %%_var2_%%",
      b: "something",
      c: "",
      var1: "value1",
      var2: "value2",
    }),
    {
      a: "some text value1 more text value2",
      b: "something",
      c: "",
      var1: "value1",
      var2: "value2",
    },
    "21.01"
  );
});

test("22 - fetching variables from parent node's level", () => {
  equal(
    jVar({
      a: {
        b: {
          c: {
            d: "text %%_var1_%% text %%-var2-%% text",
          },
          var1: "zzz",
          var2: "yyy",
        },
      },
    }),
    {
      a: {
        b: {
          c: {
            d: "text zzz text yyy text",
          },
          var1: "zzz",
          var2: "yyy",
        },
      },
    },
    "22.01"
  );
});

test("23 - fetching variables from two levels above", () => {
  let input = {
    a: {
      b: {
        c: {
          d: "text %%_var1_%% text %%-var2-%% text",
        },
      },
      var1: "zzz",
      var2: "yyy",
    },
  };
  equal(
    jVar(input),
    {
      a: {
        b: {
          c: {
            d: "text zzz text yyy text",
          },
        },
        var1: "zzz",
        var2: "yyy",
      },
    },
    "23.01"
  );
  // mutation didn't happen:
  equal(
    input,
    {
      a: {
        b: {
          c: {
            d: "text %%_var1_%% text %%-var2-%% text",
          },
        },
        var1: "zzz",
        var2: "yyy",
      },
    },
    "23.02"
  );
});

test("24 - fetching variables from root, three levels above", () => {
  let input = {
    a: {
      b: {
        c: {
          d: "text %%_var1.z_%% text %%-var2-%% text",
        },
      },
    },
    var1: { z: "zzz" },
    var2: "yyy",
  };
  equal(
    jVar(input),
    {
      a: {
        b: {
          c: {
            d: "text zzz text yyy text",
          },
        },
      },
      var1: { z: "zzz" },
      var2: "yyy",
    },
    "24.01"
  );
  // input argument was not mutated:
  equal(
    input,
    {
      a: {
        b: {
          c: {
            d: "text %%_var1.z_%% text %%-var2-%% text",
          },
        },
      },
      var1: { z: "zzz" },
      var2: "yyy",
    },
    "24.02"
  );
});

test("25 - fetching variables from parent node's level data store", () => {
  equal(
    jVar({
      a: {
        b: {
          c: {
            d: "text %%_var1.z_%% text %%-var2-%% text",
          },
          c_data: {
            var1: { z: "zzz" },
            var2: "yyy",
          },
        },
      },
    }),
    {
      a: {
        b: {
          c: {
            d: "text zzz text yyy text",
          },
          c_data: {
            var1: { z: "zzz" },
            var2: "yyy",
          },
        },
      },
    },
    "25.01"
  );
});

test("26 - fetching variables from data store two levels above", () => {
  equal(
    jVar({
      a: {
        b: {
          c: {
            d: "text %%_var1_%% text %%-var2-%% text",
          },
        },
        b_data: {
          var1: "zzz",
          var2: "yyy",
        },
      },
    }),
    {
      a: {
        b: {
          c: {
            d: "text zzz text yyy text",
          },
        },
        b_data: {
          var1: "zzz",
          var2: "yyy",
        },
      },
    },
    "26.01"
  );
});

test("27 - fetching variables from data store as high as the root", () => {
  equal(
    jVar({
      a: {
        b: {
          c: {
            d: "text %%_var1_%% text %%-var2-%% text",
          },
        },
      },
      a_data: {
        var1: "zzz",
        var2: "yyy",
      },
    }),
    {
      a: {
        b: {
          c: {
            d: "text zzz text yyy text",
          },
        },
      },
      a_data: {
        var1: "zzz",
        var2: "yyy",
      },
    },
    "27.01"
  );
});

// in the unit test below, there are two "eee"s to check can we really use
// parent keys in the path to make keys unique
test("28 - three level references", () => {
  equal(
    jVar({
      aaa: {
        bbb: {
          ccc: "some text %%_ddd_%%",
          ggg: { zzz: "%%_hhh_%%" },
          eee: "jjj",
          fff: "kkk",
        },
        bbb_data: {
          ddd: "%%_eee.fff_%%",
          eee: {
            fff: "%%_ggg.zzz_%%",
          },
        },
      },
      hhh: "iii",
    }),
    {
      aaa: {
        bbb: {
          ccc: "some text iii",
          ggg: { zzz: "iii" },
          eee: "jjj",
          fff: "kkk",
        },
        bbb_data: {
          ddd: "iii",
          eee: {
            fff: "iii",
          },
        },
      },
      hhh: "iii",
    },
    "28.01"
  );
});

test("29 - resolves to a string", () => {
  equal(
    jVar({
      a: "%%_b_%%",
      b: 1,
    }),
    {
      a: "1",
      b: 1,
    },
    "29.01"
  );

  equal(
    jVar({
      a: "%%_b_%%",
      a_data: {
        b: 1,
      },
    }),
    {
      a: "1",
      a_data: {
        b: 1,
      },
    },
    "29.02"
  );
});

test.run();
