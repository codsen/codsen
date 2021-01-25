/* eslint no-template-curly-in-string: 0 */

import tap from "tap";
import { jVar } from "../dist/json-variables.esm";

tap.test("01 - two variables in an object's key", (t) => {
  t.strictSame(
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
    "01"
  );
  t.end();
});

tap.test("02 - two variables with paths in an object's key", (t) => {
  t.strictSame(
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
    "02 - defaults + querying object contents"
  );
  t.end();
});

tap.test("03 - two variables, with wrapping", (t) => {
  t.strictSame(
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
    "03 - custom wrappers"
  );
  t.end();
});

tap.test("04 - variables with paths being wrapped", (t) => {
  t.strictSame(
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
    "04 - custom wrappers + multi-level"
  );
  t.end();
});

tap.test("05 - custom heads and tails", (t) => {
  t.strictSame(
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
    "05 - custom heads/tails"
  );
  t.end();
});

tap.test("06 - custom heads and tails being wrapped", (t) => {
  t.strictSame(
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
    "06 - custom heads/tails + multi-level"
  );
  t.end();
});

tap.test("07 - whitespace within custom heads and tails", (t) => {
  t.strictSame(
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
    "07 - custom heads/tails, some whitespace inside of them"
  );
  t.end();
});

tap.test(
  "08 - whitespace within variables containing paths and custom heads/tails",
  (t) => {
    t.strictSame(
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
      "08 - custom heads/tails, some whitespace inside of them + multi-level"
    );
    t.end();
  }
);

tap.test("09 - some values are equal to heads or tails", (t) => {
  t.strictSame(
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
    "09 - some keys have heads/tails exactly - defaults"
  );
  t.end();
});

tap.test("10 - opts.noSingleMarkers - off", (t) => {
  t.strictSame(
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
    "10 - some keys have heads/tails exactly - hardcoded defaults"
  );
  t.end();
});

tap.test("11 - opts.noSingleMarkers - on", (t) => {
  t.throws(() => {
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
  }, /THROW_ID_16/);
  t.end();
});

tap.test("12 - opts.noSingleMarkers - off - more throw tests", (t) => {
  t.throws(() => {
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
  }, /THROW_ID_16/);
  t.end();
});

tap.test(
  "13 - custom heads/tails, values equal to them are present in data",
  (t) => {
    t.strictSame(
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
      "13 - some keys have heads/tails only - custom heads/tails, defaults"
    );
    t.end();
  }
);

tap.test("14 - custom heads/tails - noSingleMarkers = false", (t) => {
  t.strictSame(
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
    "14 - some keys have heads/tails only - custom heads/tails, hardcoded defaults"
  );
  t.end();
});

tap.test("15 - value in an array", (t) => {
  t.strictSame(
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
    "15"
  );
  t.end();
});

tap.test("16 - data stores #1", (t) => {
  t.strictSame(
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
  t.strictSame(
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
  t.strictSame(
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
    "16.03 - data stash and multi-level, all default"
  );
  t.strictSame(
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
    "16.04 - data stash and multi-level, default markers, custom wrap"
  );
  t.end();
});

tap.test("17 - top-level key and data stash clash", (t) => {
  t.strictSame(
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
    "17.01 - default, no wrap"
  );
  t.strictSame(
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
    "17.02 - wrap"
  );
  t.strictSame(
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
    "17.03 - root key would take precedence, but it's of a wrong format and therefore algorithm chooses data storage instead (which is correct type)"
  );
  t.strictSame(
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
    "17.04 - mix, one var resolved from root, another from data store"
  );
  t.end();
});

tap.test("18 - emoji in values", (t) => {
  t.strictSame(
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
    "18"
  );
  t.end();
});

tap.test("19 - emoji in keys", (t) => {
  t.strictSame(
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
    "19"
  );
  t.end();
});

tap.test("20 - emoji in variable keys", (t) => {
  t.strictSame(
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
    "20"
  );
  t.end();
});

tap.test("21 - empty strings in the input AST", (t) => {
  t.strictSame(
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
    "21 - defaults"
  );
  t.end();
});

tap.test("22 - fetching variables from parent node's level", (t) => {
  t.strictSame(
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
    "22 - defaults"
  );
  t.end();
});

tap.test("23 - fetching variables from two levels above", (t) => {
  const input = {
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
  t.strictSame(
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
    "23.01 - defaults"
  );
  // mutation didn't happen:
  t.strictSame(
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
  t.end();
});

tap.test("24 - fetching variables from root, three levels above", (t) => {
  const input = {
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
  t.strictSame(
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
    "24.01 - defaults"
  );
  // input argument was not mutated:
  t.strictSame(
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
  t.end();
});

tap.test("25 - fetching variables from parent node's level data store", (t) => {
  t.strictSame(
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
    "25 - defaults"
  );
  t.end();
});

tap.test("26 - fetching variables from data store two levels above", (t) => {
  t.strictSame(
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
    "26 - defaults"
  );
  t.end();
});

tap.test("27 - fetching variables from data store as high as the root", (t) => {
  t.strictSame(
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
    "27 - defaults"
  );
  t.end();
});

// in the unit test below, there are two "eee"s to check can we really use
// parent keys in the path to make keys unique
tap.test("28 - three level references", (t) => {
  t.strictSame(
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
    "28"
  );
  t.end();
});

tap.test("29 - resolves to a string", (t) => {
  t.strictSame(
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

  t.strictSame(
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
  t.end();
});
