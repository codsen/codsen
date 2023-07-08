/* eslint no-template-curly-in-string: 0 */

import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { jVar } from "../dist/json-variables.esm.js";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test("01 - basic throws related to wrong input", () => {
  throws(
    () => {
      jVar();
    },
    /THROW_ID_01/,
    "01.01",
  );

  throws(
    () => {
      jVar("zzzz");
    },
    /THROW_ID_02/,
    "01.02",
  );

  throws(
    () => {
      jVar("{}"); // string curlies...
    },
    /THROW_ID_02/,
    "01.03",
  );

  // empty plain object does not throw
  equal(jVar({}), {}, "empty plain object");

  throws(
    () => {
      jVar([]); // empty array
    },
    /THROW_ID_02/,
    "01.05",
  );
});

test("02 - throws when options heads and/or tails are empty", () => {
  throws(
    () => {
      jVar(
        {
          a: "a",
        },
        { heads: "" },
      );
    },
    /THROW_ID_06/,
    "02.01",
  );

  throws(
    () => {
      jVar(
        {
          a: "a",
        },
        { tails: "" },
      );
    },
    /THROW_ID_07/,
    "02.02",
  );

  throws(
    () => {
      jVar(
        {
          a: "a",
        },
        { heads: "", tails: "" },
      );
    },
    /THROW_ID_06/,
    "02.03",
  );
});

test("03 - throws when data container key lookup is enabled and container tails are given blank", () => {
  throws(
    () => {
      jVar(
        {
          a: "a",
        },
        { lookForDataContainers: true, dataContainerIdentifierTails: "" },
      );
    },
    /THROW_ID_08/,
    "03.01",
  );

  equal(
    jVar(
      {
        a: "a",
      },
      { lookForDataContainers: false, dataContainerIdentifierTails: "" },
    ),
    {
      a: "a",
    },
    "data store is off, so empty opts.dataContainerIdentifierTails is fine",
  );

  throws(
    () => {
      jVar(
        {
          a: "a",
        },
        { dataContainerIdentifierTails: "" },
      );
    },
    /THROW_ID_08/,
    "03.03",
  );
});

test("04 - throws when heads and tails are equal", () => {
  throws(
    () => {
      jVar(
        {
          a: "a",
        },
        { heads: "%%", tails: "%%" },
      );
    },
    /THROW_ID_09/,
    "04.01",
  );
});

test("05 - throws when input is not a plain object", () => {
  throws(
    () => {
      jVar(["zzz"], { heads: "%%", tails: "%%" });
    },
    /THROW_ID_02/,
    "05.01",
  );
});

test("06 - throws when keys contain variables", () => {
  throws(
    () => {
      jVar({
        a: "some text %%_var1_%% more text",
        "%%_var2_%%": "something",
        var1: "value1",
        var2: "value2",
      });
    },
    /THROW_ID_15/,
    "06.01",
  );

  throws(
    () => {
      jVar(
        {
          a: "some text zzvar1yy more text",
          zzvar2yy: "something",
          var1: "value1",
          var2: "value2",
        },
        { heads: "zz", tails: "yy" },
      ); // custom heads and tails
    },
    /THROW_ID_15/,
    "06.02",
  );
});

test("07 - throws when there are unequal number of marker heads and tails", () => {
  equal(
    jVar({
      a: "some text %%_var1_%% more %%_text",
      b: "something",
      var1: "value1",
      var2: "value2",
    }),
    {
      a: "some text value1 more %%_text",
      b: "something",
      var1: "value1",
      var2: "value2",
    },
    "07.01",
  );

  equal(
    jVar({
      a: "some text %%_var1_%% more text_%%",
      b: "%%_something",
      var1: "value1",
      var2: "value2",
    }),
    {
      a: "some text value1 more text_%%",
      b: "%%_something",
      var1: "value1",
      var2: "value2",
    },
    "07.02",
  );
});

test("08 - throws when data is missing", () => {
  throws(
    () => {
      jVar({
        a: "some text %%_var1_%% more text",
        b: "something",
      });
    },
    /THROW_ID_18/,
    "08.01",
  );
  throws(
    () => {
      jVar({
        a: "some text %%_var1_%% more text",
        b: "something",
        a_data: "zzz",
      });
    },
    /THROW_ID_18/,
    "08.02",
  );

  // however, it does not throw when opts.allowUnresolved is on
  equal(
    jVar(
      {
        a: "some text %%_var1_%% more text",
        b: "something",
        a_data: "zzz",
      },
      {
        allowUnresolved: true,
      },
    ),
    {
      a: "some text  more text",
      b: "something",
      a_data: "zzz",
    },
    "08.03",
  );

  // when opts.allowUnresolved is string, that is used
  equal(
    jVar(
      {
        a: "some text %%_var1_%% more text",
        b: "something",
        a_data: "zzz",
      },
      {
        allowUnresolved: "tralala",
      },
    ),
    {
      a: "some text tralala more text",
      b: "something",
      a_data: "zzz",
    },
    "08.04",
  );

  // when opts.allowUnresolved is empty string, that is used
  equal(
    jVar(
      {
        a: "some text %%_var1_%% more text",
        b: "something",
        a_data: "zzz",
      },
      {
        allowUnresolved: "",
      },
    ),
    {
      a: "some text  more text",
      b: "something",
      a_data: "zzz",
    },
    "08.05",
  );

  // also, consider the cases when only some variables can't be resolved
  equal(
    jVar(
      {
        a: "some text %%_var1_%% more text%%_var2_%%",
        b: "something",
        a_data: {
          var2: "zzz",
        },
      },
      {
        allowUnresolved: true,
      },
    ),
    {
      a: "some text  more textzzz",
      b: "something",
      a_data: {
        var2: "zzz",
      },
    },
    "08.06",
  );
});

test("09 - throws when data container lookup is turned off and var is missing", () => {
  throws(
    () => {
      jVar(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        { lookForDataContainers: false },
      );
    },
    /THROW_ID_18/,
    "09.01",
  );

  // since v.7 the value will be found if such key exists anywhere
  let input1 = {
    a: "some text %%_var1_%% more text",
    a_data: {
      var1: "something",
    },
  };
  equal(
    jVar(input1, { lookForDataContainers: false }),
    {
      a: "some text something more text",
      a_data: {
        var1: "something",
      },
    },
    "data store is off, so empty opts.dataContainerIdentifierTails is fine",
  );
  // check against input argument mutation:
  equal(
    input1,
    {
      a: "some text %%_var1_%% more text",
      a_data: {
        var1: "something",
      },
    },
    "09.03",
  );

  // now, the data stores (keys with _data) are used only to give preference
  // when the value is resolved - they will be checked first, before doing global
  // key search, which would come last. Observe:

  // "b" has a datastore, "b_data", but datastores are turned off.
  // This means, when resolving and going upwards the AST, the values-as-keys,
  // in our case, keys named "var1" will be searched for, all the way, from "c"
  // level to the root level.

  // Now, "b_data.var1" key "var1" is not at the same level as "b", it's deeper
  // in other child's path, so it will not get checked during the first checking
  // route, when algorithm will go from "c" up to root.

  // At root level, it will find "var1" and therefore will resolve "c" to "222".
  let input2 = {
    a: {
      b: {
        c: "some text %%_var1_%% more text",
      },
      b_data: {
        var1: "111",
      },
    },
    var1: "222",
  };
  equal(
    jVar(input2, { lookForDataContainers: false }),
    {
      a: {
        b: {
          c: "some text 222 more text",
        },
        b_data: {
          var1: "111",
        },
      },
      var1: "222",
    },
    "resolves to topmost root level key because data store is off",
  );
  // mutation check:
  equal(
    input2,
    {
      a: {
        b: {
          c: "some text %%_var1_%% more text",
        },
        b_data: {
          var1: "111",
        },
      },
      var1: "222",
    },
    "09.05",
  );

  // now if we enable data stores, "c" will resolve to "111" because data store
  // path will be checked when bubbling up to root level, where var1: '222' is.
  let input3 = {
    a: {
      b: {
        c: "some text %%_var1_%% more text",
      },
      b_data: {
        var1: "111",
      },
    },
    var1: "222",
  };
  equal(
    jVar(input3, { lookForDataContainers: true }),
    {
      a: {
        b: {
          c: "some text 111 more text",
        },
        b_data: {
          var1: "111",
        },
      },
      var1: "222",
    },
    "resolves to datastore, not using value at the root",
  );
  // mutation check:
  equal(
    input3,
    {
      a: {
        b: {
          c: "some text %%_var1_%% more text",
        },
        b_data: {
          var1: "111",
        },
      },
      var1: "222",
    },
    "09.07",
  );
});

test("10 - not throws when data container name append is given empty, but data container lookup is turned off", () => {
  not.throws(() => {
    jVar(
      {
        a: "some text, more text",
        b: "something",
      },
      { lookForDataContainers: false, dataContainerIdentifierTails: "" },
    );
  }, "10.01");
});

test("11 - throws when data container name append is given empty", () => {
  throws(
    () => {
      jVar(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        { lookForDataContainers: true, dataContainerIdentifierTails: "" },
      );
    },
    /THROW_ID_08/,
    "11.01",
  );
  throws(
    () => {
      jVar(
        {
          a: "some text, more text",
          b: "something",
        },
        { lookForDataContainers: true, dataContainerIdentifierTails: "" },
      );
    },
    /THROW_ID_08/,
    "11.02",
  );
});

test("12 - throws when opts.wrapHeadsWith is customised to anything other than string", () => {
  throws(
    () => {
      jVar(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        { wrapHeadsWith: false },
      );
    },
    /THROW_ID_18/,
    "12.01",
  );
});

test("13 - opts.wrapHeadsWith does not affect failing resolving", () => {
  throws(
    () => {
      jVar(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        { wrapHeadsWith: "" },
      );
    },
    /THROW_ID_18/,
    "13.01",
  );
});

test("14 - throws when opts.wrapTailsWith is customised to anything other than string", () => {
  throws(
    () => {
      jVar(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        { wrapTailsWith: false },
      );
    },
    /THROW_ID_18/,
    "14.01",
  );
});

test("15 - not throws when opts.wrapTailsWith is customised to an empty string", () => {
  not.throws(() => {
    jVar(
      {
        a: "some text %%_var1_%% more text",
        var1: "something",
      },
      { wrapTailsWith: "" },
    );
  }, "15.01");
});

test("16 - throws when opts.heads is not string", () => {
  throws(
    () => {
      jVar(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        { heads: 1 },
      );
    },
    /THROW_ID_17/,
    "16.01",
  );
});

test("17 - throws when opts.tails is not string", () => {
  throws(
    () => {
      jVar(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        { tails: 1 },
      );
    },
    /THROW_ID_17/,
    "17.01",
  );
});

test("18 - throws when all args are missing", () => {
  throws(
    () => {
      jVar();
    },
    /THROW_ID_01/,
    "18.01",
  );
});

test("19 - throws when key references itself", () => {
  throws(
    () => {
      jVar({
        a: "%%_a_%%",
      });
    },
    /THROW_ID_19/,
    "19.01",
  );

  throws(
    () => {
      jVar({
        a: "something %%_a_%% aaaa %%_a_%%",
      });
    },
    /THROW_ID_19/,
    "19.02",
  );
});

test("20 - throws when key references itself", () => {
  throws(
    () => {
      jVar({
        a: "a",
        b: "%%_a_%%",
        c: "%%_c_%%",
      });
    },
    /THROW_ID_19/,
    "20.01",
  );
});

test("21 - throws when key references key which references itself", () => {
  throws(
    () => {
      jVar({
        b: "%%_a_%%",
        a: "%%_a_%%",
      });
    },
    /THROW_ID_19/,
    "21.01",
  );
});

test("22 - throws when there's recursion (with distraction)", () => {
  throws(
    () => {
      jVar({
        b: "%%_a_%%",
        a: "%%_b_%%",
      });
    },
    /THROW_ID_19/,
    "22.01",
  );

  throws(
    () => {
      jVar({
        longerKeyName: "%%_shorterKeyN_%%",
        shorterKeyN: "%%_longerKeyName_%%",
      });
    },
    /THROW_ID_19/,
    "22.02",
  );

  throws(
    () => {
      jVar({
        k: {
          l: {
            m: {
              n: {
                a: "%%_c_%% %%_b_%%",
                b: "%%_a_%%",
                c: "ccc",
              },
            },
          },
        },
      });
    },
    /THROW_ID_19/,
    "22.03",
  );

  throws(
    () => {
      jVar({
        k: {
          l: {
            m: {
              n: {
                a: "%%_c_%% %%_b_%%",
                a_data: {
                  // with data-store
                  b: "%%_a_%%",
                },
                c: "ccc",
              },
            },
          },
        },
      });
    },
    /THROW_ID_19/,
    "22.04",
  );
});

test("23 - throws when there's a longer recursion", () => {
  throws(
    () => {
      jVar({
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "%%_d_%%",
        d: "%%_e_%%",
        e: "%%_b_%%",
      });
    },
    /THROW_ID_19/,
    "23.01",
  );
});

test("24 - throws when opts.heads and opts.headsNoWrap are customised to be equal", () => {
  throws(
    () => {
      jVar(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        {
          heads: "%%_",
          headsNoWrap: "%%_",
        },
      );
    },
    /THROW_ID_10/,
    "24.01",
  );

  throws(
    () => {
      jVar(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        {
          heads: "zzzz",
          headsNoWrap: "zzzz",
        },
      );
    },
    /THROW_ID_10/,
    "24.02",
  );

  throws(
    () => {
      jVar(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        {
          headsNoWrap: "%%_", // aiming at the default heads, "%%_"
        },
      );
    },
    /THROW_ID_10/,
    "24.03",
  );
});

test("25 - throws when opts.tails and opts.tailsNoWrap are customised to be equal", () => {
  throws(
    () => {
      jVar(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        {
          tails: "_%%",
          tailsNoWrap: "_%%",
        },
      );
    },
    /THROW_ID_11/,
    "25.01",
  );

  throws(
    () => {
      jVar(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        {
          tails: "zzzz",
          tailsNoWrap: "zzzz",
        },
      );
    },
    /THROW_ID_11/,
    "25.02",
  );

  throws(
    () => {
      jVar(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        {
          tailsNoWrap: "_%%", // default tails is the same "_%%"
        },
      );
    },
    /THROW_ID_11/,
    "25.03",
  );
});

test("26 - empty nowraps", () => {
  throws(
    () => {
      jVar(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        {
          heads: "%%_",
          headsNoWrap: "",
        },
      );
    },
    /THROW_ID_12/,
    "26.01",
  );

  throws(
    () => {
      jVar(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        {
          tails: "_%%",
          tailsNoWrap: "",
        },
      );
    },
    /THROW_ID_13/,
    "26.02",
  );

  throws(
    () => {
      jVar(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        {
          headsNoWrap: "",
        },
      );
    },
    /THROW_ID_12/,
    "26.03",
  );

  throws(
    () => {
      jVar(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        {
          tailsNoWrap: "",
        },
      );
    },
    /THROW_ID_13/,
    "26.04",
  );
});

test("27 - equal nowraps", () => {
  throws(
    () => {
      jVar(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        {
          tailsNoWrap: "aaa",
          headsNoWrap: "aaa",
        },
      );
    },
    /THROW_ID_14/,
    "27.01",
  );

  throws(
    () => {
      jVar(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        {
          tailsNoWrap: "%%-",
          headsNoWrap: "%%-",
        },
      );
    },
    /THROW_ID_14/,
    "27.02",
  );

  throws(
    () => {
      jVar(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        {
          headsNoWrap: "-%%", // same as default tailsNoWrap
        },
      );
    },
    /THROW_ID_14/,
    "27.03",
  );
});

test("28 - throws there's simple recursion loop in array", () => {
  throws(
    () => {
      jVar({
        a: "%%_a_%%",
      });
    },
    /THROW_ID_19/,
    "28.01",
  );

  throws(
    () => {
      jVar({
        a: { b: "%%_a_%%" },
      });
    },
    /THROW_ID_20/,
    "28.02",
  );

  throws(
    () => {
      jVar({
        a: ["%%_a_%%"],
      });
    },
    /THROW_ID_20/,
    "28.03",
  );

  throws(
    () => {
      jVar({
        a: ["%%_b_%%"],
        b: ["%%_a_%%"],
      });
    },
    /THROW_ID_20/,
    "28.04",
  );

  throws(
    () => {
      jVar({
        a: ["%%_b_%%", "%%_b_%%"],
      });
    },
    /THROW_ID_18/,
    "28.05",
  );

  throws(
    () => {
      jVar({ z: ["%%_a_%%"] });
    },
    /THROW_ID_18/,
    "28.06",
  );
});

test("29 - throws referencing what does not exist", () => {
  throws(
    () => {
      jVar({
        a: "%%_b_%%",
      });
    },
    /THROW_ID_18/,
    "29.01",
  );
  throws(
    () => {
      jVar({
        a: ["%%_b_%%"],
      });
    },
    /THROW_ID_18/,
    "29.02",
  );
});

test("30 - throws when referencing the multi-level object keys that don't exist", () => {
  throws(
    () => {
      jVar({
        a: "some text %%_var1.key99_%% more text %%_var2.key99_%%",
        b: "something",
        var1: { key1: "value1" },
        var2: { key2: "value2" },
      });
    },
    /THROW_ID_18/,
    "30.01",
  );

  throws(
    () => {
      jVar({
        a: "some text %%_var1.key99_%% more text %%_var2.key99_%%",
        b: "something",
        var1: { key1: "value1", key2: "value2", key3: "value3" },
        var2: { key4: "value4", key5: "value5", key6: "value6" },
      });
    },
    /THROW_ID_18/,
    "30.02",
  );

  throws(
    () => {
      jVar(
        {
          a: "some text %%_var1.key99_%% more text %%_var2.key99_%%",
          b: "something",
          var1: { key1: "value1" },
          var2: { key2: "value2" },
        },
        {
          wrapHeadsWith: "${",
          wrapTailsWith: "}",
        },
      );
    },
    /THROW_ID_18/,
    "30.03",
  );
});

test("31 - throws when opts are given truthy but not a plain object", () => {
  throws(
    () => {
      jVar(
        {
          a: "aaa",
          b: "bbb",
        },
        "zzz",
      );
    },
    /THROW_ID_03/,
    "31.01",
  );
});

test.run();
