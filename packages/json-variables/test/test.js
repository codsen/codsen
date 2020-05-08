/* eslint no-template-curly-in-string: 0 */

import tap from "tap";
import jv from "../dist/json-variables.esm";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

tap.test("01 - basic throws related to wrong input", (t) => {
  t.throws(() => {
    jv();
  }, /THROW_ID_01/);

  t.throws(() => {
    jv("zzzz");
  }, /THROW_ID_02/);

  t.throws(() => {
    jv("{}"); // string curlies...
  }, /THROW_ID_02/);

  // empty plain object does not throw
  t.same(jv({}), {}, "empty plain object");

  t.throws(() => {
    jv([]); // empty array
  }, /THROW_ID_02/);

  t.end();
});

tap.test("02 - throws when options heads and/or tails are empty", (t) => {
  t.throws(() => {
    jv(
      {
        a: "a",
      },
      { heads: "" }
    );
  }, /THROW_ID_06/);

  t.throws(() => {
    jv(
      {
        a: "a",
      },
      { tails: "" }
    );
  }, /THROW_ID_07/);

  t.throws(() => {
    jv(
      {
        a: "a",
      },
      { heads: "", tails: "" }
    );
  }, /THROW_ID_06/);

  t.end();
});

tap.test(
  "03 - throws when data container key lookup is enabled and container tails are given blank",
  (t) => {
    t.throws(() => {
      jv(
        {
          a: "a",
        },
        { lookForDataContainers: true, dataContainerIdentifierTails: "" }
      );
    }, /THROW_ID_08/);

    t.same(
      jv(
        {
          a: "a",
        },
        { lookForDataContainers: false, dataContainerIdentifierTails: "" }
      ),
      {
        a: "a",
      },
      "data store is off, so empty opts.dataContainerIdentifierTails is fine"
    );

    t.throws(() => {
      jv(
        {
          a: "a",
        },
        { dataContainerIdentifierTails: "" }
      );
    }, /THROW_ID_08/);

    t.end();
  }
);

tap.test("04 - throws when heads and tails are equal", (t) => {
  t.throws(() => {
    jv(
      {
        a: "a",
      },
      { heads: "%%", tails: "%%" }
    );
  }, /THROW_ID_09/);

  t.end();
});

tap.test("05 - throws when input is not a plain object", (t) => {
  t.throws(() => {
    jv(["zzz"], { heads: "%%", tails: "%%" });
  }, /THROW_ID_02/);

  t.end();
});

tap.test("06 - throws when keys contain variables", (t) => {
  const err1 = t.throws(() => {
    jv({
      a: "some text %%_var1_%% more text",
      "%%_var2_%%": "something",
      var1: "value1",
      var2: "value2",
    });
  });
  t.match(err1.message, /THROW_ID_15/, "06.01");

  const err2 = t.throws(() => {
    jv(
      {
        a: "some text zzvar1yy more text",
        zzvar2yy: "something",
        var1: "value1",
        var2: "value2",
      },
      { heads: "zz", tails: "yy" }
    ); // custom heads and tails
  });
  t.match(err2.message, /THROW_ID_15/, "06.02");
  t.end();
});

tap.test(
  "07 - throws when there are unequal number of marker heads and tails",
  (t) => {
    t.same(
      jv({
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
      "07.01"
    );

    t.same(
      jv({
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
      "07.02"
    );

    t.end();
  }
);

tap.test("08 - throws when data is missing", (t) => {
  const err1 = t.throws(() => {
    jv({
      a: "some text %%_var1_%% more text",
      b: "something",
    });
  });
  t.match(err1.message, /THROW_ID_18/, "08.01");
  const err2 = t.throws(() => {
    jv({
      a: "some text %%_var1_%% more text",
      b: "something",
      a_data: "zzz",
    });
  });
  t.match(err2.message, /THROW_ID_18/, "08.02");

  // however, it does not throw when opts.allowUnresolved is on
  t.same(
    jv(
      {
        a: "some text %%_var1_%% more text",
        b: "something",
        a_data: "zzz",
      },
      {
        allowUnresolved: true,
      }
    ),
    {
      a: "some text  more text",
      b: "something",
      a_data: "zzz",
    },
    "08.03"
  );

  // when opts.allowUnresolved is string, that is used
  t.same(
    jv(
      {
        a: "some text %%_var1_%% more text",
        b: "something",
        a_data: "zzz",
      },
      {
        allowUnresolved: "tralala",
      }
    ),
    {
      a: "some text tralala more text",
      b: "something",
      a_data: "zzz",
    },
    "08.04"
  );

  // when opts.allowUnresolved is empty string, that is used
  t.same(
    jv(
      {
        a: "some text %%_var1_%% more text",
        b: "something",
        a_data: "zzz",
      },
      {
        allowUnresolved: "",
      }
    ),
    {
      a: "some text  more text",
      b: "something",
      a_data: "zzz",
    },
    "08.05"
  );

  // also, consider the cases when only some variables can't be resolved
  t.same(
    jv(
      {
        a: "some text %%_var1_%% more text%%_var2_%%",
        b: "something",
        a_data: {
          var2: "zzz",
        },
      },
      {
        allowUnresolved: true,
      }
    ),
    {
      a: "some text  more textzzz",
      b: "something",
      a_data: {
        var2: "zzz",
      },
    },
    "08.06"
  );

  t.end();
});

tap.test(
  "09 - throws when data container lookup is turned off and var is missing",
  (t) => {
    const err1 = t.throws(() => {
      jv(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        { lookForDataContainers: false }
      );
    });
    t.match(err1.message, /THROW_ID_18/, "09.01");

    // since v.7 the value will be found if such key exists anywhere
    const input1 = {
      a: "some text %%_var1_%% more text",
      a_data: {
        var1: "something",
      },
    };
    t.same(
      jv(input1, { lookForDataContainers: false }),
      {
        a: "some text something more text",
        a_data: {
          var1: "something",
        },
      },
      "data store is off, so empty opts.dataContainerIdentifierTails is fine"
    );
    // check against input argument mutation:
    t.same(
      input1,
      {
        a: "some text %%_var1_%% more text",
        a_data: {
          var1: "something",
        },
      },
      "09.03"
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
    const input2 = {
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
    t.same(
      jv(input2, { lookForDataContainers: false }),
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
      "resolves to topmost root level key because data store is off"
    );
    // mutation check:
    t.same(
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
      "09.05"
    );

    // now if we enable data stores, "c" will resolve to "111" because data store
    // path will be checked when bubbling up to root level, where var1: '222' is.
    const input3 = {
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
    t.same(
      jv(input3, { lookForDataContainers: true }),
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
      "resolves to datastore, not using value at the root"
    );
    // mutation check:
    t.same(
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
      "09.07"
    );
    t.end();
  }
);

tap.test(
  "10 - not throws when data container name append is given empty, but data container lookup is turned off",
  (t) => {
    t.doesNotThrow(() => {
      jv(
        {
          a: "some text, more text",
          b: "something",
        },
        { lookForDataContainers: false, dataContainerIdentifierTails: "" }
      );
    }, "10");
    t.end();
  }
);

tap.test("11 - throws when data container name append is given empty", (t) => {
  const err1 = t.throws(() => {
    jv(
      {
        a: "some text %%_var1_%% more text",
        b: "something",
      },
      { lookForDataContainers: true, dataContainerIdentifierTails: "" }
    );
  });
  t.match(err1.message, /THROW_ID_08/, "11.01");
  const err2 = t.throws(() => {
    jv(
      {
        a: "some text, more text",
        b: "something",
      },
      { lookForDataContainers: true, dataContainerIdentifierTails: "" }
    );
  });
  t.match(err2.message, /THROW_ID_08/, "11.02");
  t.end();
});

tap.test(
  "12 - throws when opts.wrapHeadsWith is customised to anything other than string",
  (t) => {
    const err1 = t.throws(() => {
      jv(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        { wrapHeadsWith: false }
      );
    });
    t.match(err1.message, /THROW_ID_18/, "12"); // thx to check-types-mini
    t.end();
  }
);

tap.test("13 - opts.wrapHeadsWith does not affect failing resolving", (t) => {
  const err1 = t.throws(() => {
    jv(
      {
        a: "some text %%_var1_%% more text",
        b: "something",
      },
      { wrapHeadsWith: "" }
    );
  });
  t.match(err1.message, /THROW_ID_18/, "13");
  t.end();
});

tap.test(
  "14 - throws when opts.wrapTailsWith is customised to anything other than string",
  (t) => {
    const err1 = t.throws(() => {
      jv(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        { wrapTailsWith: false }
      );
    });
    t.match(err1.message, /THROW_ID_18/, "14");
    t.end();
  }
);

tap.test(
  "15 - not throws when opts.wrapTailsWith is customised to an empty string",
  (t) => {
    t.doesNotThrow(() => {
      jv(
        {
          a: "some text %%_var1_%% more text",
          var1: "something",
        },
        { wrapTailsWith: "" }
      );
    }, "15");
    t.end();
  }
);

tap.test("16 - throws when opts.heads is not string", (t) => {
  const err1 = t.throws(() => {
    jv(
      {
        a: "some text %%_var1_%% more text",
        b: "something",
      },
      { heads: 1 }
    );
  });
  t.match(err1.message, /THROW_ID_04*/, "16");
  t.end();
});

tap.test("17 - throws when opts.tails is not string", (t) => {
  const err1 = t.throws(() => {
    jv(
      {
        a: "some text %%_var1_%% more text",
        b: "something",
      },
      { tails: 1 }
    );
  });
  t.match(err1.message, /THROW_ID_04*/, "17");
  t.end();
});

tap.test("18 - throws when all args are missing", (t) => {
  const err1 = t.throws(() => {
    jv();
  });
  t.match(err1.message, /THROW_ID_01/, "18");
  t.end();
});

tap.test("19 - throws when key references itself", (t) => {
  const err1 = t.throws(() => {
    jv({
      a: "%%_a_%%",
    });
  });
  t.match(err1.message, /THROW_ID_19/, "19.01");

  const err2 = t.throws(() => {
    jv({
      a: "something %%_a_%% aaaa %%_a_%%",
    });
  });
  t.match(err2.message, /THROW_ID_19/, "19.02");
  t.end();
});

tap.test("20 - throws when key references itself", (t) => {
  const err1 = t.throws(() => {
    jv({
      a: "a",
      b: "%%_a_%%",
      c: "%%_c_%%",
    });
  });
  t.match(err1.message, /THROW_ID_19/, "20");
  t.end();
});

tap.test("21 - throws when key references key which references itself", (t) => {
  const err1 = t.throws(() => {
    jv({
      b: "%%_a_%%",
      a: "%%_a_%%",
    });
  });
  t.match(err1.message, /THROW_ID_19/, "21");
  t.end();
});

tap.test("22 - throws when there's recursion (with distraction)", (t) => {
  const err1 = t.throws(() => {
    jv({
      b: "%%_a_%%",
      a: "%%_b_%%",
    });
  });
  t.match(err1.message, /THROW_ID_19/, "22.01");

  const err2 = t.throws(() => {
    jv({
      longerKeyName: "%%_shorterKeyN_%%",
      shorterKeyN: "%%_longerKeyName_%%",
    });
  });
  t.match(err2.message, /THROW_ID_19/, "22.02");

  const err3 = t.throws(() => {
    jv({
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
  });
  t.match(err3.message, /THROW_ID_19/, "22.03");

  const err4 = t.throws(() => {
    jv({
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
  });
  t.match(err4.message, /THROW_ID_19/, "22.04");
  t.end();
});

tap.test("23 - throws when there's a longer recursion", (t) => {
  const err1 = t.throws(() => {
    jv({
      a: "%%_b_%%",
      b: "%%_c_%%",
      c: "%%_d_%%",
      d: "%%_e_%%",
      e: "%%_b_%%",
    });
  });
  t.match(err1.message, /THROW_ID_19/, "23");
  t.end();
});

tap.test(
  "24 - throws when opts.heads and opts.headsNoWrap are customised to be equal",
  (t) => {
    const err1 = t.throws(() => {
      jv(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        {
          heads: "%%_",
          headsNoWrap: "%%_",
        }
      );
    });
    t.match(err1.message, /THROW_ID_10/, "24.01");

    const err2 = t.throws(() => {
      jv(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        {
          heads: "zzzz",
          headsNoWrap: "zzzz",
        }
      );
    });
    t.match(err2.message, /THROW_ID_10/, "24.02");

    const err3 = t.throws(() => {
      jv(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        {
          headsNoWrap: "%%_", // aiming at the default heads, "%%_"
        }
      );
    });
    t.match(err3.message, /THROW_ID_10/, "24.03");

    t.end();
  }
);

tap.test(
  "25 - throws when opts.tails and opts.tailsNoWrap are customised to be equal",
  (t) => {
    const err1 = t.throws(() => {
      jv(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        {
          tails: "_%%",
          tailsNoWrap: "_%%",
        }
      );
    });
    t.match(err1.message, /THROW_ID_11/, "25.01");

    const err2 = t.throws(() => {
      jv(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        {
          tails: "zzzz",
          tailsNoWrap: "zzzz",
        }
      );
    });
    t.match(err2.message, /THROW_ID_11/, "25.02");

    const err3 = t.throws(() => {
      jv(
        {
          a: "some text %%_var1_%% more text",
          b: "something",
        },
        {
          tailsNoWrap: "_%%", // default tails is the same "_%%"
        }
      );
    });
    t.match(err3.message, /THROW_ID_11/, "25.03");

    t.end();
  }
);

tap.test("26 - empty nowraps", (t) => {
  const err1 = t.throws(() => {
    jv(
      {
        a: "some text %%_var1_%% more text",
        b: "something",
      },
      {
        heads: "%%_",
        headsNoWrap: "",
      }
    );
  });
  t.match(err1.message, /THROW_ID_12/, "26.01");

  const err2 = t.throws(() => {
    jv(
      {
        a: "some text %%_var1_%% more text",
        b: "something",
      },
      {
        tails: "_%%",
        tailsNoWrap: "",
      }
    );
  });
  t.match(err2.message, /THROW_ID_13/, "26.02");

  const err3 = t.throws(() => {
    jv(
      {
        a: "some text %%_var1_%% more text",
        b: "something",
      },
      {
        headsNoWrap: "",
      }
    );
  });
  t.match(err3.message, /THROW_ID_12/, "26.03");

  const err4 = t.throws(() => {
    jv(
      {
        a: "some text %%_var1_%% more text",
        b: "something",
      },
      {
        tailsNoWrap: "",
      }
    );
  });
  t.match(err4.message, /THROW_ID_13/, "26.04");
  t.end();
});

tap.test("27 - equal nowraps", (t) => {
  const err1 = t.throws(() => {
    jv(
      {
        a: "some text %%_var1_%% more text",
        b: "something",
      },
      {
        tailsNoWrap: "aaa",
        headsNoWrap: "aaa",
      }
    );
  });
  t.match(err1.message, /THROW_ID_14/, "27.01");

  const err2 = t.throws(() => {
    jv(
      {
        a: "some text %%_var1_%% more text",
        b: "something",
      },
      {
        tailsNoWrap: "%%-",
        headsNoWrap: "%%-",
      }
    );
  });
  t.match(err2.message, /THROW_ID_14/, "27.02");

  const err3 = t.throws(() => {
    jv(
      {
        a: "some text %%_var1_%% more text",
        b: "something",
      },
      {
        headsNoWrap: "-%%", // same as default tailsNoWrap
      }
    );
  });
  t.match(err3.message, /THROW_ID_14/, "27.03");
  t.end();
});

tap.test("28 - throws there's simple recursion loop in array", (t) => {
  const err1 = t.throws(() => {
    jv({
      a: "%%_a_%%",
    });
  });
  t.match(err1.message, /THROW_ID_19/, "28.01");

  const err2 = t.throws(() => {
    jv({
      a: { b: "%%_a_%%" },
    });
  });
  t.match(err2.message, /THROW_ID_20/, "28.02");

  const err3 = t.throws(() => {
    jv({
      a: ["%%_a_%%"],
    });
  });
  t.match(err3.message, /THROW_ID_20/, "28.03");

  const err4 = t.throws(() => {
    jv({
      a: ["%%_b_%%"],
      b: ["%%_a_%%"],
    });
  });
  t.match(err4.message, /THROW_ID_20/, "28.04");

  const err5 = t.throws(() => {
    jv({
      a: ["%%_b_%%", "%%_b_%%"],
    });
  });
  t.match(err5.message, /THROW_ID_18/, "28.05");

  const err6 = t.throws(() => {
    jv({ z: ["%%_a_%%"] });
  });
  t.match(err6.message, /THROW_ID_18/, "28.06");
  t.end();
});

tap.test("29 - throws referencing what does not exist", (t) => {
  const err1 = t.throws(() => {
    jv({
      a: "%%_b_%%",
    });
  });
  t.match(err1.message, /THROW_ID_18/, "29.01");
  const err2 = t.throws(() => {
    jv({
      a: ["%%_b_%%"],
    });
  });
  t.match(err2.message, /THROW_ID_18/, "29.02");
  t.end();
});

tap.test(
  "30 - throws when referencing the multi-level object keys that don't exist",
  (t) => {
    const err1 = t.throws(() => {
      jv({
        a: "some text %%_var1.key99_%% more text %%_var2.key99_%%",
        b: "something",
        var1: { key1: "value1" },
        var2: { key2: "value2" },
      });
    });
    t.match(err1.message, /THROW_ID_18/, "30.01");

    const err2 = t.throws(() => {
      jv({
        a: "some text %%_var1.key99_%% more text %%_var2.key99_%%",
        b: "something",
        var1: { key1: "value1", key2: "value2", key3: "value3" },
        var2: { key4: "value4", key5: "value5", key6: "value6" },
      });
    });
    t.match(err2.message, /THROW_ID_18/, "30.02");

    const err3 = t.throws(() => {
      jv(
        {
          a: "some text %%_var1.key99_%% more text %%_var2.key99_%%",
          b: "something",
          var1: { key1: "value1" },
          var2: { key2: "value2" },
        },
        {
          wrapHeadsWith: "${",
          wrapTailsWith: "}",
        }
      );
    });
    t.match(err3.message, /THROW_ID_18/, "30.03");
    t.end();
  }
);

tap.test(
  "31 - throws when opts are given truthy but not a plain object",
  (t) => {
    const err1 = t.throws(() => {
      jv(
        {
          a: "aaa",
          b: "bbb",
        },
        "zzz"
      );
    });
    t.match(err1.message, /THROW_ID_03/, "31");
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 02. B.A.U.
// -----------------------------------------------------------------------------

tap.test("32 - two variables in an object's key", (t) => {
  t.same(
    jv({
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
    "32"
  );
  t.end();
});

tap.test("33 - two variables with paths in an object's key", (t) => {
  t.same(
    jv({
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
    "33 - defaults + querying object contents"
  );
  t.end();
});

tap.test("34 - two variables, with wrapping", (t) => {
  t.same(
    jv(
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
    "34 - custom wrappers"
  );
  t.end();
});

tap.test("35 - variables with paths being wrapped", (t) => {
  t.same(
    jv(
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
    "35 - custom wrappers + multi-level"
  );
  t.end();
});

tap.test("36 - custom heads and tails", (t) => {
  t.same(
    jv(
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
    "36 - custom heads/tails"
  );
  t.end();
});

tap.test("37 - custom heads and tails being wrapped", (t) => {
  t.same(
    jv(
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
    "37 - custom heads/tails + multi-level"
  );
  t.end();
});

tap.test("38 - whitespace within custom heads and tails", (t) => {
  t.same(
    jv(
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
    "38 - custom heads/tails, some whitespace inside of them"
  );
  t.end();
});

tap.test(
  "39 - whitespace within variables containing paths and custom heads/tails",
  (t) => {
    t.same(
      jv(
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
      "39 - custom heads/tails, some whitespace inside of them + multi-level"
    );
    t.end();
  }
);

tap.test("40 - some values are equal to heads or tails", (t) => {
  t.same(
    jv({
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
    "40 - some keys have heads/tails exactly - defaults"
  );
  t.end();
});

tap.test("41 - opts.noSingleMarkers - off", (t) => {
  t.same(
    jv(
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
    "41 - some keys have heads/tails exactly - hardcoded defaults"
  );
  t.end();
});

tap.test("42 - opts.noSingleMarkers - on", (t) => {
  const err1 = t.throws(() => {
    jv(
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
  });
  t.match(err1.message, /THROW_ID_16/, "42");
  t.end();
});

tap.test("43 - opts.noSingleMarkers - off - more throw tests", (t) => {
  const err1 = t.throws(() => {
    jv(
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
  });
  t.match(err1.message, /THROW_ID_16/, "43");
  t.end();
});

tap.test(
  "44 - custom heads/tails, values equal to them are present in data",
  (t) => {
    t.same(
      jv(
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
      "44 - some keys have heads/tails only - custom heads/tails, defaults"
    );
    t.end();
  }
);

tap.test("45 - custom heads/tails - noSingleMarkers = false", (t) => {
  t.same(
    jv(
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
    "45 - some keys have heads/tails only - custom heads/tails, hardcoded defaults"
  );
  t.end();
});

tap.test("46 - value in an array", (t) => {
  t.same(
    jv({
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
    "46"
  );
  t.end();
});

tap.test("47 - data stores #1", (t) => {
  t.same(
    jv({
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
    "47.01"
  );
  t.same(
    jv(
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
    "47.02"
  );
  t.same(
    jv({
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
    "47.03 - data stash and multi-level, all default"
  );
  t.same(
    jv(
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
    "47.04 - data stash and multi-level, default markers, custom wrap"
  );
  t.end();
});

tap.test("48 - top-level key and data stash clash", (t) => {
  t.same(
    jv({
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
    "48.01 - default, no wrap"
  );
  t.same(
    jv(
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
    "48.02 - wrap"
  );
  t.same(
    jv({
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
    "48.03 - root key would take precedence, but it's of a wrong format and therefore algorithm chooses data storage instead (which is correct type)"
  );
  t.same(
    jv({
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
    "48.04 - mix, one var resolved from root, another from data store"
  );
  t.end();
});

tap.test("49 - emoji in values", (t) => {
  t.same(
    jv({
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
    "49"
  );
  t.end();
});

tap.test("50 - emoji in keys", (t) => {
  t.same(
    jv({
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
    "50"
  );
  t.end();
});

tap.test("51 - emoji in variable keys", (t) => {
  t.same(
    jv({
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
    "51"
  );
  t.end();
});

tap.test("52 - empty strings in the input AST", (t) => {
  t.same(
    jv({
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
    "52 - defaults"
  );
  t.end();
});

tap.test("53 - fetching variables from parent node's level", (t) => {
  t.same(
    jv({
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
    "53 - defaults"
  );
  t.end();
});

tap.test("54 - fetching variables from two levels above", (t) => {
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
  t.same(
    jv(input),
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
    "54.01 - defaults"
  );
  // mutation didn't happen:
  t.same(
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
    "54.02"
  );
  t.end();
});

tap.test("55 - fetching variables from root, three levels above", (t) => {
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
  t.same(
    jv(input),
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
    "55.01 - defaults"
  );
  // input argument was not mutated:
  t.same(
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
    "55.02"
  );
  t.end();
});

tap.test("56 - fetching variables from parent node's level data store", (t) => {
  t.same(
    jv({
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
    "56 - defaults"
  );
  t.end();
});

tap.test("57 - fetching variables from data store two levels above", (t) => {
  t.same(
    jv({
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
    "57 - defaults"
  );
  t.end();
});

tap.test("58 - fetching variables from data store as high as the root", (t) => {
  t.same(
    jv({
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
    "58 - defaults"
  );
  t.end();
});

// in the unit test below, there are two "eee"s to check can we really use
// parent keys in the path to make keys unique
tap.test("59 - three level references", (t) => {
  t.same(
    jv({
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
    "59"
  );
  t.end();
});

tap.test("60 - resolves to a string", (t) => {
  t.same(
    jv({
      a: "%%_b_%%",
      b: 1,
    }),
    {
      a: "1",
      b: 1,
    },
    "60.01"
  );

  t.same(
    jv({
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
    "60.02"
  );
  t.end();
});

// -----------------------------------------------------------------------------
// group 03. sneaky-ones, like recursion
// -----------------------------------------------------------------------------

tap.test("61 - two-level variables resolved", (t) => {
  t.same(
    jv({
      a: "%%_b_%%",
      b: "%%_c_%%",
      c: "val",
    }),
    {
      a: "val",
      b: "val",
      c: "val",
    },
    "61.01 - two redirects, querying strings"
  );
  t.same(
    jv({
      a: "%%_b.c_key_%%",
      b: { c_key: "%%_c_%%" },
      c: "val",
    }),
    {
      a: "val",
      b: { c_key: "val" },
      c: "val",
    },
    "61.02 - two redirects, querying multi-level"
  );
  t.end();
});

tap.test("62 - two-level redirects, backwards order", (t) => {
  t.same(
    jv({
      x: "val",
      y: "%%_x_%%",
      z: "%%_y_%%",
    }),
    {
      x: "val",
      y: "val",
      z: "val",
    },
    "62.01"
  );
  t.same(
    jv({
      x: { key1: "val" },
      y: { key2: "%%_x.key1_%%" },
      z: "%%_y.key2_%%",
    }),
    {
      x: { key1: "val" },
      y: { key2: "val" },
      z: "val",
    },
    "62.02"
  );
  t.end();
});

tap.test("63 - two-level variables resolved, mixed", (t) => {
  t.same(
    jv({
      a: "Some text %%_b_%% some more text %%_c_%%",
      b: "Some text %%_c_%%, some more text %%_d_%%",
      c: "val1",
      d: "val2",
    }),
    {
      a: "Some text Some text val1, some more text val2 some more text val1",
      b: "Some text val1, some more text val2",
      c: "val1",
      d: "val2",
    },
    "63.01"
  );
  t.same(
    jv({
      a: "Some text %%_b_%% some more text %%_c.key1_%%",
      b: "Some text %%_c.key1_%%, some more text %%_d.key2_%%",
      c: { key1: "val1" },
      d: { key2: "val2" },
    }),
    {
      a: "Some text Some text val1, some more text val2 some more text val1",
      b: "Some text val1, some more text val2",
      c: { key1: "val1" },
      d: { key2: "val2" },
    },
    "63.02"
  );
  t.end();
});

tap.test("64 - three-level variables resolved", (t) => {
  t.same(
    jv({
      a: "%%_b_%% %%_d_%%",
      b: "%%_c_%% %%_d_%%",
      c: "%%_d_%%",
      d: "val",
    }),
    {
      a: "val val val",
      b: "val val",
      c: "val",
      d: "val",
    },
    "64.01"
  );
  t.same(
    jv({
      a: "%%_b_%% %%_h_%%",
      b: "%%_c.e.f.g_%% %%_h_%%",
      c: { e: { f: { g: "%%_h_%%" } } },
      h: "val",
    }),
    {
      a: "val val val",
      b: "val val",
      c: { e: { f: { g: "val" } } },
      h: "val",
    },
    "64.02"
  );
  t.end();
});

tap.test("65 - another three-level var resolving", (t) => {
  t.same(
    jv({
      a: "%%_b_%% %%_c_%%",
      b: "%%_c_%% %%_d_%%",
      c: "%%_d_%%",
      d: "val",
    }),
    {
      a: "val val val",
      b: "val val",
      c: "val",
      d: "val",
    },
    "65"
  );
  t.end();
});

tap.test("66 - multiple variables resolved", (t) => {
  t.same(
    jv({
      a: "%%_e_%% %%_d_%%",
      b: "%%_a_%%",
      c: "c",
      d: "%%_c_%%",
      e: "%%_c_%%",
      f: "%%_b_%%",
    }),
    {
      a: "c c",
      b: "c c",
      c: "c",
      d: "c",
      e: "c",
      f: "c c",
    },
    "66.01"
  );
  const err1 = t.throws(() => {
    jv({
      a: "%%_e_%% %%_d_%%",
      b: "%%_a_%%",
      c: "c",
      d: "%%_c_%%",
      e: "%%_b_%%",
      f: "%%_b_%%",
    });
  });
  t.match(err1.message, /THROW_ID_19/, "66.02");

  const err2 = t.throws(() => {
    jv({
      a: "%%_e_%% %%_d_%%",
      b: "%%_a_%%",
      c: "c",
      d: "%%_f_%%",
      e: "%%_c_%%",
      f: "%%_b_%%",
    });
  });
  t.match(err2.message, /THROW_ID_19/, "66.03");
  t.end();
});

tap.test("67 - preventDoubleWrapping: on & off", (t) => {
  t.same(
    jv(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", preventDoubleWrapping: false }
    ),
    {
      a: "{{val}}",
      b: "{val}",
      c: "val",
    },
    "67.01"
  );
  t.same(
    jv(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", preventDoubleWrapping: true }
    ),
    {
      a: "{val}",
      b: "{val}",
      c: "val",
    },
    "67.02"
  );

  // here values come already wrapped:

  t.same(
    jv(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "{val}",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", preventDoubleWrapping: false }
    ),
    {
      a: "{{{val}}}",
      b: "{{val}}",
      c: "{val}",
    },
    "67.03"
  );
  t.same(
    jv(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "{val}",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", preventDoubleWrapping: true }
    ),
    {
      a: "{val}",
      b: "{val}",
      c: "{val}",
    },
    "67.04"
  );

  t.same(
    jv(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "Some text {val} and another {val}",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", preventDoubleWrapping: false }
    ),
    {
      a: "{{Some text {val} and another {val}}}",
      b: "{Some text {val} and another {val}}",
      c: "Some text {val} and another {val}",
    },
    "67.05 - more real-life case"
  );
  t.same(
    jv(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "Some text {val} and another {val}",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", preventDoubleWrapping: true }
    ),
    {
      a: "Some text {val} and another {val}",
      b: "Some text {val} and another {val}",
      c: "Some text {val} and another {val}",
    },
    "67.06 - more real-life case"
  );

  t.same(
    jv(
      {
        a: "%%_b_%%",
        b: "%%_c.d_%%",
        c: { d: "val" },
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", preventDoubleWrapping: true }
    ),
    {
      a: "{val}",
      b: "{val}",
      c: { d: "val" },
    },
    "67.07 - object multi-level values"
  );
  t.end();
});

tap.test("68 - empty variable", (t) => {
  t.same(
    jv({
      a: "%%__%%",
      b: "bbb",
    }),
    {
      a: "",
      b: "bbb",
    },
    "68 - no value is needed if variable is empty - it's resolved to empty str"
  );
  t.end();
});

// -----------------------------------------------------------------------------
// 04. variable whitelisting
// -----------------------------------------------------------------------------

tap.test("69 - wrap flipswitch works", (t) => {
  t.same(
    jv(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", wrapGlobalFlipSwitch: true }
    ),
    {
      a: "{val}",
      b: "{val}",
      c: "val",
    },
    "69.01"
  );
  t.same(
    jv(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", wrapGlobalFlipSwitch: false }
    ),
    {
      a: "val",
      b: "val",
      c: "val",
    },
    "69.02"
  );
  t.end();
});

tap.test("70 - global wrap flipswitch and dontWrapVars combo", (t) => {
  t.same(
    jv(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      {
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        wrapGlobalFlipSwitch: true,
        dontWrapVars: "c*",
      }
    ),
    {
      a: "{val}",
      b: "val",
      c: "val",
    },
    "70.01"
  );
  t.same(
    jv(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      {
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        wrapGlobalFlipSwitch: true,
        dontWrapVars: "b*",
      }
    ),
    {
      a: "{val}", // variable already came pre-wrapped (on "c") by the time it reached a: "%%_b_%%"
      b: "{val}",
      c: "val",
    },
    "70.02"
  );
  t.same(
    jv(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      {
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        wrapGlobalFlipSwitch: true,
        dontWrapVars: "a*",
      }
    ),
    {
      a: "{val}", // there's no such variable "a"
      b: "{val}",
      c: "val",
    },
    "70.03"
  );
  t.same(
    jv(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      {
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        wrapGlobalFlipSwitch: true,
        dontWrapVars: ["b*", "c*"],
      }
    ),
    {
      a: "val",
      b: "val",
      c: "val",
    },
    "70.04"
  );
  t.end();
});

tap.test("71 - opts.dontWrapVars", (t) => {
  t.same(
    jv(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", dontWrapVars: ["zzzz*"] }
    ),
    {
      a: "{val}",
      b: "{val}",
      c: "val",
    },
    "71.01"
  );
  t.same(
    jv(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", dontWrapVars: "" }
    ),
    {
      a: "{val}",
      b: "{val}",
      c: "val",
    },
    "71.02"
  );
  t.same(
    jv(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", dontWrapVars: [] }
    ),
    {
      a: "{val}",
      b: "{val}",
      c: "val",
    },
    "71.03"
  );
  t.same(
    jv(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", dontWrapVars: "zzzz*" }
    ),
    {
      a: "{val}",
      b: "{val}",
      c: "val",
    },
    "71.04"
  );
  t.throws(() => {
    jv(
      {
        a: "%%_b_%%",
        b: "%%_c_%%",
        c: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", dontWrapVars: [1, 2, 3] }
    );
  }, "71.05");
  t.end();
});

tap.test("72 - opts.dontWrapVars, real key names", (t) => {
  t.same(
    jv(
      {
        title_front: "Some text %%_title_sub_%% and more text.",
        title_sub: "%%_subtitle_%%",
        subtitle: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", dontWrapVars: ["sub*"] }
    ),
    {
      title_front: "Some text {val} and more text.",
      title_sub: "val",
      subtitle: "val",
    },
    "72.01"
  );
  t.same(
    jv(
      {
        title_front: "Some text %%_title_sub_%% and more text.",
        title_sub: "%%_subtitle_%%",
        subtitle: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", dontWrapVars: "sub*" }
    ),
    {
      title_front: "Some text {val} and more text.",
      title_sub: "val",
      subtitle: "val",
    },
    "72.02"
  );
  t.same(
    jv(
      {
        title_front: "Some text %%_title_sub_%% and more text.",
        title_sub: "%%_subtitle_%%",
        subtitle: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", dontWrapVars: "" }
    ),
    {
      title_front: "Some text {val} and more text.",
      title_sub: "{val}",
      subtitle: "val",
    },
    "72.03"
  );
  t.end();
});

tap.test("73 - multiple dontWrapVars values", (t) => {
  t.same(
    jv(
      {
        front_title: "%%_lower_title_%%",
        lower_title: "%%_subtitle_%%",
        subtitle: "val",
      },
      {
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: ["zzz*", "title*", "lower*"],
      }
    ),
    {
      front_title: "{val}",
      lower_title: "{val}",
      subtitle: "val",
    },
    '73 - still wraps because child variable call ("subtitle") is not excluded'
  );
  t.end();
});

tap.test("74 - one level var querying and whitelisting", (t) => {
  t.same(
    jv(
      {
        key: "Some text %%_otherkey_%%",
        otherkey: "variable",
      },
      {
        wrapHeadsWith: "{{",
        wrapTailsWith: "}}",
        wrapGlobalFlipSwitch: true,
        dontWrapVars: "*c",
      }
    ),
    {
      key: "Some text {{variable}}",
      otherkey: "variable",
    },
    "74.01"
  );
  t.same(
    jv(
      {
        key: "Some text %%_otherkey_%%",
        otherkey: "variable",
      },
      {
        wrapHeadsWith: "{{",
        wrapTailsWith: "}}",
        wrapGlobalFlipSwitch: false,
        dontWrapVars: "*c",
      }
    ),
    {
      key: "Some text variable",
      otherkey: "variable",
    },
    "74.02"
  );
  t.end();
});

tap.test("75 - opts.dontWrapVars, real key names", (t) => {
  t.same(
    jv(
      {
        title_front: "Some text %%_title_sub_%% and more text.",
        title_sub: "%%_subtitle_%%",
        subtitle: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", dontWrapVars: ["*le"] }
    ),
    {
      title_front: "Some text {val} and more text.",
      title_sub: "val",
      subtitle: "val",
    },
    "75.01"
  );
  t.same(
    jv(
      {
        title_front: "Some text %%_title_sub_%% and more text.",
        title_sub: "%%_subtitle_%%",
        subtitle: "val",
      },
      {
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: ["*le", "title_s*"],
      }
    ),
    {
      title_front: "Some text val and more text.",
      title_sub: "val",
      subtitle: "val",
    },
    "75.02"
  );
  t.same(
    jv(
      {
        title_front: "Some text %%_title_sub_%% and more text.",
        title_sub: "%%_subtitle_%%",
        subtitle: "val",
      },
      { wrapHeadsWith: "{", wrapTailsWith: "}", dontWrapVars: "" }
    ),
    {
      title_front: "Some text {val} and more text.",
      title_sub: "{val}",
      subtitle: "val",
    },
    "75.03"
  );
  t.end();
});

// -----------------------------------------------------------------------------
// 05. involving arrays
// -----------------------------------------------------------------------------

tap.test("76 - arrays referencing values which are strings", (t) => {
  t.same(
    jv({
      a: ["Some text %%_d_%% some more text %%_c_%%"],
      b: ["Some text %%_c_%%, some more text %%_d_%%"],
      c: "cval",
      d: "dval",
    }),
    {
      a: ["Some text dval some more text cval"],
      b: ["Some text cval, some more text dval"],
      c: "cval",
      d: "dval",
    },
    "76"
  );
  t.end();
});

tap.test("77 - arrays referencing values which are arrays", (t) => {
  t.same(
    jv({
      a: ["Some text %%_b_%% some more text %%_c_%%", "%%_c_%%", "%%_d_%%"],
      b: ["zzz", "Some text %%_c_%%, some more text %%_d_%%"],
      c: ["c1", "c2"],
      d: "dval",
    }),
    {
      a: [
        "Some text zzzSome text c1c2, some more text dval some more text c1c2",
        "c1c2",
        "dval",
      ],
      b: ["zzz", "Some text c1c2, some more text dval"],
      c: ["c1", "c2"],
      d: "dval",
    },
    "77"
  );
  t.end();
});

tap.test("78 - arrays, whitelisting as string", (t) => {
  t.same(
    jv(
      {
        title: [
          "something",
          "Some text %%_subtitle_%%",
          "%%_submarine_%%",
          "anything",
        ],
        subtitle: "text",
        submarine: "ship",
      },
      {
        heads: "%%_",
        tails: "_%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: [],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      }
    ),
    {
      title: ["something", "Some text {text}", "{ship}", "anything"],
      subtitle: "text",
      submarine: "ship",
    },
    "78.01 - base - no ignores"
  );
  t.same(
    jv(
      {
        title: [
          "something",
          "Some text %%_subtitle_%%",
          "%%_submarine_%%",
          "anything",
        ],
        subtitle: "text",
        submarine: "ship",
      },
      {
        heads: "%%_",
        tails: "_%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: "sub*",
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      }
    ),
    {
      title: ["something", "Some text text", "ship", "anything"],
      subtitle: "text",
      submarine: "ship",
    },
    "78.02 - string whitelist startsWith"
  );
  t.end();
});

tap.test("79 - arrays, whitelisting as array #1", (t) => {
  t.same(
    jv(
      {
        title: [
          "something",
          "Some text %%_subtitle_%%",
          "%%_submarine_%%",
          "anything",
        ],
        subtitle: "text",
        submarine: "ship",
      },
      {
        heads: "%%_",
        tails: "_%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: ["subt*"],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      }
    ),
    {
      title: ["something", "Some text text", "{ship}", "anything"],
      subtitle: "text",
      submarine: "ship",
    },
    "79.01"
  );
  t.same(
    jv(
      {
        title: [
          "something",
          "Some text %%_subtitle_%%",
          "%%_submarine_%%",
          "anything",
        ],
        subtitle: "text",
        submarine: "ship",
      },
      {
        heads: "%%_",
        tails: "_%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: ["zzz*", "subt*", "subm*"],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      }
    ),
    {
      title: ["something", "Some text text", "ship", "anything"],
      subtitle: "text",
      submarine: "ship",
    },
    "79.02 - two ignores in an array"
  );
  t.same(
    jv(
      {
        title: [
          "something",
          "Some text %%_subtitle_%%",
          "%%_submarine_%%",
          "anything",
        ],
        subtitle: "text",
        submarine: "ship",
      },
      {
        heads: "%%_",
        tails: "_%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: ["*zzz", "*le", "*ne"],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      }
    ),
    {
      title: ["something", "Some text text", "ship", "anything"],
      subtitle: "text",
      submarine: "ship",
    },
    "79.03 - two ignores in an array startsWith"
  );
  t.same(
    jv(
      {
        title: [
          "something",
          "Some text %%_subtitle_%%",
          "%%_submarine_%%",
          "anything",
        ],
        subtitle: "text",
        submarine: "ship",
      },
      {
        heads: "%%_",
        tails: "_%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: ["*zzz", "*le", "*yyy"],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      }
    ),
    {
      title: ["something", "Some text text", "{ship}", "anything"],
      subtitle: "text",
      submarine: "ship",
    },
    "79.04 - two ignores in an array, endsWith"
  );
  t.end();
});

tap.test("80 - arrays, whitelisting as array #2", (t) => {
  t.same(
    jv(
      {
        title: [
          "something",
          "Some text %%_subtitle_%%",
          "%%_submarine_%%",
          "anything",
        ],
        title_data: {
          subtitle: "text",
          submarine: "ship",
        },
      },
      {
        heads: "%%_",
        tails: "_%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: ["*zzz", "*le", "*yyy"],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      }
    ),
    {
      title: ["something", "Some text text", "{ship}", "anything"],
      title_data: {
        subtitle: "text",
        submarine: "ship",
      },
    },
    "80.01 - two ignores in an array, data store"
  );
  t.same(
    jv(
      {
        a: {
          title: "%%_whatnot_%%",
          title_data: {
            subtitle: "SUB",
          },
          whatnot: "%%_submarine_%%",
          whatnot_data: {
            submarine: "ship",
          },
        },
      },
      {
        heads: "%%_",
        tails: "_%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: ["*zzz", "*le", "*yyy"],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      }
    ),
    {
      a: {
        title: "{ship}",
        title_data: {
          subtitle: "SUB",
        },
        whatnot: "{ship}",
        whatnot_data: {
          submarine: "ship",
        },
      },
    },
    "80.02 - does not wrap SUB"
  );
  t.same(
    jv(
      {
        a: {
          title: [
            "something",
            "Some text %%_subtitle_%%",
            "%%_whatnot_%%",
            "anything",
          ],
          title_data: {
            subtitle: "SUB",
          },
          whatnot: "%%_submarine_%%",
          whatnot_data: {
            submarine: "ship",
          },
        },
      },
      {
        heads: "%%_",
        tails: "_%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: ["*zzz", "*le", "*yyy"],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      }
    ),
    {
      a: {
        title: ["something", "Some text SUB", "{ship}", "anything"],
        title_data: {
          subtitle: "SUB",
        },
        whatnot: "{ship}",
        whatnot_data: {
          submarine: "ship",
        },
      },
    },
    "80.03 - does not wrap SUB"
  );
  t.same(
    jv(
      {
        title: [
          "something",
          "Some text %%_subtitle_%%",
          "%%_whatnot_%%",
          "anything",
        ],
        title_data: {
          subtitle: "SUB",
        },
        whatnot: "%%_submarine_%%",
        whatnot_data: {
          submarine: "ship",
        },
      },
      {
        heads: "%%_",
        tails: "_%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: ["*zzz", "*yyy"],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      }
    ),
    {
      title: ["something", "Some text {SUB}", "{ship}", "anything"],
      title_data: {
        subtitle: "SUB",
      },
      whatnot: "{ship}",
      whatnot_data: {
        submarine: "ship",
      },
    },
    "80.04 - wraps SUB"
  );

  const err1 = t.throws(() => {
    jv(
      {
        title: [
          "something",
          "Some text %%_subtitle_%%",
          "%%_whatnot_%%",
          "anything",
        ],
        title_data: {
          subtitle: "SUB",
        },
        whatnot: "%%_submarine_%%",
        whatnot_data: {
          zzz: "yyy",
        },
      },
      {
        heads: "%%_",
        tails: "_%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: ["*zzz", "*yyy"],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      }
    );
  });
  t.match(err1.message, /THROW_ID_18/, "80.05");
  t.end();
});

// -----------------------------------------------------------------------------
// 06. opts.noSingleMarkers
// -----------------------------------------------------------------------------

tap.test("81 - UTIL > single markers in the values", (t) => {
  t.doesNotThrow(() => {
    jv({
      a: "z",
      b: "%%_",
    });
  }, "81.01");
  t.doesNotThrow(() => {
    jv(
      {
        a: "z",
        b: "%%_",
      },
      {
        noSingleMarkers: false,
      }
    );
  }, "81.02");

  const err1 = t.throws(() => {
    jv(
      {
        a: "z",
        b: "%%_",
      },
      {
        noSingleMarkers: true,
      }
    );
  });
  t.match(err1.message, /THROW_ID_16/, "81.03");

  t.doesNotThrow(() => {
    jv({
      a: "z",
      b: "%%-",
    });
  }, "81.04");
  t.doesNotThrow(() => {
    jv(
      {
        a: "z",
        b: "%%-",
      },
      {
        noSingleMarkers: false,
      }
    );
  }, "81.05");

  const err2 = t.throws(() => {
    jv(
      {
        a: "z",
        b: "%%-",
      },
      {
        noSingleMarkers: true,
      }
    );
  });
  t.match(err2.message, /THROW_ID_16/, "81.06");
  t.end();
});

// -----------------------------------------------------------------------------
// 07. opts.headsNoWrap & opts.tailsNoWrap
// -----------------------------------------------------------------------------

tap.test(
  "82 - opts.headsNoWrap & opts.tailsNoWrap work on single level vars",
  (t) => {
    t.same(
      jv(
        {
          a: "some text %%-var1-%% more text %%_var2_%%",
          b: "something",
          var1: "value1",
          var2: "value2",
        },
        {
          wrapHeadsWith: "{{ ",
          wrapTailsWith: " }}",
        }
      ),
      {
        a: "some text value1 more text {{ value2 }}",
        b: "something",
        var1: "value1",
        var2: "value2",
      },
      "82.01 - defaults"
    );
    t.same(
      jv(
        {
          a: "some text (( var1 )) more text %%_var2_%%",
          b: "something",
          var1: "value1",
          var2: "value2",
        },
        {
          wrapHeadsWith: "{{ ",
          wrapTailsWith: " }}",
          headsNoWrap: "(( ",
          tailsNoWrap: " ))",
        }
      ),
      {
        a: "some text value1 more text {{ value2 }}",
        b: "something",
        var1: "value1",
        var2: "value2",
      },
      "82.02 - custom opts.headsNoWrap & opts.tailsNoWrap"
    );
    t.same(
      jv(
        {
          a: "some text (( var1 )) more text %%_var2_%%",
          b: "something",
          var1: "value1",
          var2: "value2",
        },
        {
          wrapHeadsWith: "{{ ",
          wrapTailsWith: " }}",
          headsNoWrap: "(( ",
          tailsNoWrap: " ))",
        }
      ),
      {
        a: "some text value1 more text {{ value2 }}",
        b: "something",
        var1: "value1",
        var2: "value2",
      },
      "82.03 - left side wrapped only, custom opts.headsNoWrap & opts.tailsNoWrap"
    );
    t.same(
      jv(
        {
          a: "some text (( var1 )) more text %%_var2_%%",
          b: "something",
          var1: "value1",
          var2: "value2",
        },
        {
          wrapHeadsWith: "{{ ",
          wrapTailsWith: " }}",
          headsNoWrap: "(( ",
          tailsNoWrap: " ))",
        }
      ),
      {
        a: "some text value1 more text {{ value2 }}",
        b: "something",
        var1: "value1",
        var2: "value2",
      },
      "82.04 - right side wrapped only, custom opts.headsNoWrap & opts.tailsNoWrap"
    );
    t.end();
  }
);

tap.test(
  "83 - opts.headsNoWrap & opts.tailsNoWrap work on multi-level vars",
  (t) => {
    t.same(
      jv(
        {
          a:
            "text %%-b-%% more text %%_c_%% and more %%-b-%% text %%_b_%% more text %%-c-%%",
          b: "%%_c_%%",
          c: "z",
        },
        {
          wrapHeadsWith: "??",
          wrapTailsWith: "!!",
        }
      ),
      {
        a: "text z more text ??z!! and more z text ??z!! more text z",
        b: "??z!!",
        c: "z",
      },
      "83.01 - two level redirects, default opts.headsNoWrap & opts.tailsNoWrap, matching var key lengths"
    );
    t.same(
      jv(
        {
          a: "text %%-bbb-%% more text %%_c_%% and more %%-bbb-%% text",
          bbb: "%%_c_%%",
          c: "z",
        },
        {
          wrapHeadsWith: "??",
          wrapTailsWith: "!!",
        }
      ),
      {
        a: "text z more text ??z!! and more z text",
        bbb: "??z!!",
        c: "z",
      },
      "83.02 - two level redirects, default opts.headsNoWrap & opts.tailsNoWrap, mismatching var key lengths"
    );
    t.same(
      jv(
        {
          a:
            "text -yyy-bbb-zzz- more text -www-c-xxx- and more -yyy-bbb-zzz- text",
          bbb: "-www-c-xxx-",
          c: "z",
        },
        {
          heads: "-www-",
          tails: "-xxx-",
          headsNoWrap: "-yyy-",
          tailsNoWrap: "-zzz-",
          wrapHeadsWith: "??",
          wrapTailsWith: "!!",
        }
      ),
      {
        a: "text z more text ??z!! and more z text",
        bbb: "??z!!",
        c: "z",
      },
      "83.03 - two level redirects, custom everything"
    );
    t.end();
  }
);

tap.test(
  "84 - triple linking with resolving arrays and trailing new lines",
  (t) => {
    t.same(
      jv(
        {
          aaa: "%%-bbb-%%",
          bbb: "ccc\n",
        },
        {
          wrapHeadsWith: "{{ ",
          wrapTailsWith: " }}",
        }
      ),
      {
        aaa: "ccc\n",
        bbb: "ccc\n",
      },
      "84.01 - basic, checking are trailing line breaks retained"
    );

    t.same(
      jv(
        {
          aaa: "%%-bbb-%%",
          bbb: ["%%-kkk-%%", "%%-lll-%%"],
          bbb_data: {
            kkk: "zzz\n",
            lll: "yyy\n",
          },
        },
        {
          wrapHeadsWith: "{{ ",
          wrapTailsWith: " }}",
        }
      ),
      {
        aaa: "zzz\nyyy\n",
        bbb: ["zzz\n", "yyy\n"],
        bbb_data: {
          kkk: "zzz\n",
          lll: "yyy\n",
        },
      },
      "84.02 - line breaks on the values coming into array"
    );

    t.same(
      jv(
        {
          aaa: "%%-bbb-%%",
          bbb: ["%%-kkk-%%\n", "%%-lll-%%\n"],
          bbb_data: {
            kkk: "zzz",
            lll: "yyy",
          },
        },
        {
          wrapHeadsWith: "{{ ",
          wrapTailsWith: " }}",
        }
      ),
      {
        aaa: "zzz\nyyy\n",
        bbb: ["zzz\n", "yyy\n"],
        bbb_data: {
          kkk: "zzz",
          lll: "yyy",
        },
      },
      "84.03 - line breaks at array-level"
    );

    t.same(
      jv(
        {
          aaa: "%%_bbb_%%", // <----- regular heads/tails
          bbb: ["%%_kkk_%%", "%%_lll_%%"],
          bbb_data: {
            kkk: "zzz",
            lll: "yyy",
          },
        },
        {
          wrapHeadsWith: "{{ ",
          wrapTailsWith: " }}",
        }
      ),
      {
        aaa: "{{ zzz }}{{ yyy }}",
        bbb: ["{{ zzz }}", "{{ yyy }}"],
        bbb_data: {
          kkk: "zzz",
          lll: "yyy",
        },
      },
      "84.04 - like #02 but with wrapping"
    );

    t.same(
      jv(
        {
          aaa: "%%-bbb-%%", // <-----  notice no-wrap heads/tails
          bbb: ["%%_kkk_%%", "%%_lll_%%"],
          bbb_data: {
            kkk: "zzz",
            lll: "yyy",
          },
        },
        {
          wrapHeadsWith: "{{ ",
          wrapTailsWith: " }}",
        }
      ),
      {
        aaa: "{{ zzz }}{{ yyy }}",
        bbb: ["{{ zzz }}", "{{ yyy }}"],
        bbb_data: {
          kkk: "zzz",
          lll: "yyy",
        },
      },
      "84.05"
    );

    t.same(
      jv(
        {
          aaa: "%%-bbb-%%",
          bbb: ["%%-kkk-%%", "%%-lll-%%"],
          bbb_data: {
            kkk: "{%- if %%-zzz-%% -%}%%_zzz_%%<br />{%- endif -%}\n",
            zzz: "zzz_val",
            lll: "{%- if %%-yyy-%% -%}%%_yyy_%%<br />{%- endif -%}\n",
            yyy: "yyy_val",
          },
        },
        {
          wrapHeadsWith: "{{ ",
          wrapTailsWith: " }}",
        }
      ),
      {
        aaa:
          "{%- if zzz_val -%}{{ zzz_val }}<br />{%- endif -%}\n{%- if yyy_val -%}{{ yyy_val }}<br />{%- endif -%}\n",
        bbb: [
          "{%- if zzz_val -%}{{ zzz_val }}<br />{%- endif -%}\n",
          "{%- if yyy_val -%}{{ yyy_val }}<br />{%- endif -%}\n",
        ],
        bbb_data: {
          kkk: "{%- if zzz_val -%}{{ zzz_val }}<br />{%- endif -%}\n",
          zzz: "zzz_val",
          lll: "{%- if yyy_val -%}{{ yyy_val }}<br />{%- endif -%}\n",
          yyy: "yyy_val",
        },
      },
      "84.06 - simple version"
    );

    t.same(
      jv(
        {
          shop_info_text: "%%-shop_info_global-%%",
          shop_info_global: [
            "%%-row0_line-%%",
            "%%_row1_line_%%",
            "%%_row2_line_%%",
            "%%_row3_line_%%",
            "%%_row4_line_%%",
            "%%_row5_line_%%",
            "%%_row6_line_%%",
            "%%_row7_line_%%",
            "%%_row8_line_%%",
          ],
          shop_info_global_data: {
            row0_line:
              "{%- if %%-row0_var-%% -%}%%_row0_var_%%<br />{%- endif -%}\n",
            row0_var: "order.shopInfo.name",
            row1_line:
              "{%- if %%-row1_var-%% -%}%%_row1_var_%%<br />{%- endif -%}\n",
            row1_var: "order.shopInfo.addressLine1",
            row2_line:
              "{%- if %%-row2_var-%% -%}%%_row2_var_%%<br />{%- endif -%}\n",
            row2_var: "order.shopInfo.addressLine2",
            row3_line:
              "{%- if %%-row3_var-%% -%}%%_row3_var_%%<br />{%- endif -%}\n",
            row3_var: "order.shopInfo.addressLine3",
            row4_line:
              "{%- if %%-row4_var-%% -%}%%_row4_var_%%<br />{%- endif -%}\n",
            row4_var: "order.shopInfo.addressLine4",
            row5_line:
              "{%- if %%-row5_var-%% -%}%%_row5_var_%%<br />{%- endif -%}\n",
            row5_var: "order.shopInfo.addressLine5",
            row6_line:
              "{%- if %%-row6_var-%% -%}%%_row6_var_%%<br />{%- endif -%}\n",
            row6_var: "order.shopInfo.addressLine6",
            row7_line:
              "{%- if %%-row7_var-%% -%}%%_row7_var_%%<br />{%- endif -%}\n",
            row7_var: "order.shopInfo.city",
            row8_line: "{%- if %%-row8_var-%% -%}%%_row8_var_%%{%- endif -%}",
            row8_var: "order.shopInfo.zipCode",
          },
        },
        {
          wrapHeadsWith: "{{ ",
          wrapTailsWith: " }}",
        }
      ),
      {
        shop_info_text:
          "{%- if order.shopInfo.name -%}{{ order.shopInfo.name }}<br />{%- endif -%}\n{%- if order.shopInfo.addressLine1 -%}{{ order.shopInfo.addressLine1 }}<br />{%- endif -%}\n{%- if order.shopInfo.addressLine2 -%}{{ order.shopInfo.addressLine2 }}<br />{%- endif -%}\n{%- if order.shopInfo.addressLine3 -%}{{ order.shopInfo.addressLine3 }}<br />{%- endif -%}\n{%- if order.shopInfo.addressLine4 -%}{{ order.shopInfo.addressLine4 }}<br />{%- endif -%}\n{%- if order.shopInfo.addressLine5 -%}{{ order.shopInfo.addressLine5 }}<br />{%- endif -%}\n{%- if order.shopInfo.addressLine6 -%}{{ order.shopInfo.addressLine6 }}<br />{%- endif -%}\n{%- if order.shopInfo.city -%}{{ order.shopInfo.city }}<br />{%- endif -%}\n{%- if order.shopInfo.zipCode -%}{{ order.shopInfo.zipCode }}{%- endif -%}",
        shop_info_global: [
          "{%- if order.shopInfo.name -%}{{ order.shopInfo.name }}<br />{%- endif -%}\n",
          "{%- if order.shopInfo.addressLine1 -%}{{ order.shopInfo.addressLine1 }}<br />{%- endif -%}\n",
          "{%- if order.shopInfo.addressLine2 -%}{{ order.shopInfo.addressLine2 }}<br />{%- endif -%}\n",
          "{%- if order.shopInfo.addressLine3 -%}{{ order.shopInfo.addressLine3 }}<br />{%- endif -%}\n",
          "{%- if order.shopInfo.addressLine4 -%}{{ order.shopInfo.addressLine4 }}<br />{%- endif -%}\n",
          "{%- if order.shopInfo.addressLine5 -%}{{ order.shopInfo.addressLine5 }}<br />{%- endif -%}\n",
          "{%- if order.shopInfo.addressLine6 -%}{{ order.shopInfo.addressLine6 }}<br />{%- endif -%}\n",
          "{%- if order.shopInfo.city -%}{{ order.shopInfo.city }}<br />{%- endif -%}\n",
          "{%- if order.shopInfo.zipCode -%}{{ order.shopInfo.zipCode }}{%- endif -%}",
        ],
        shop_info_global_data: {
          row0_line:
            "{%- if order.shopInfo.name -%}{{ order.shopInfo.name }}<br />{%- endif -%}\n",
          row0_var: "order.shopInfo.name",
          row1_line:
            "{%- if order.shopInfo.addressLine1 -%}{{ order.shopInfo.addressLine1 }}<br />{%- endif -%}\n",
          row1_var: "order.shopInfo.addressLine1",
          row2_line:
            "{%- if order.shopInfo.addressLine2 -%}{{ order.shopInfo.addressLine2 }}<br />{%- endif -%}\n",
          row2_var: "order.shopInfo.addressLine2",
          row3_line:
            "{%- if order.shopInfo.addressLine3 -%}{{ order.shopInfo.addressLine3 }}<br />{%- endif -%}\n",
          row3_var: "order.shopInfo.addressLine3",
          row4_line:
            "{%- if order.shopInfo.addressLine4 -%}{{ order.shopInfo.addressLine4 }}<br />{%- endif -%}\n",
          row4_var: "order.shopInfo.addressLine4",
          row5_line:
            "{%- if order.shopInfo.addressLine5 -%}{{ order.shopInfo.addressLine5 }}<br />{%- endif -%}\n",
          row5_var: "order.shopInfo.addressLine5",
          row6_line:
            "{%- if order.shopInfo.addressLine6 -%}{{ order.shopInfo.addressLine6 }}<br />{%- endif -%}\n",
          row6_var: "order.shopInfo.addressLine6",
          row7_line:
            "{%- if order.shopInfo.city -%}{{ order.shopInfo.city }}<br />{%- endif -%}\n",
          row7_var: "order.shopInfo.city",
          row8_line:
            "{%- if order.shopInfo.zipCode -%}{{ order.shopInfo.zipCode }}{%- endif -%}",
          row8_var: "order.shopInfo.zipCode",
        },
      },
      "84.07 - real-life version"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 08. non-string values - still valid JSON
// -----------------------------------------------------------------------------

tap.test("85 - Boolean values inserted into a middle of a string", (t) => {
  t.same(
    jv({
      a: "%%_b_%% %%_c_%% %%_d_%% %%_e_%%",
      b: "stringB",
      c: true,
      d: "stringD",
      e: false,
    }),
    {
      a: false, // <------ first Boolean value is put here. "b" was string, so "c = true" goes here.
      b: "stringB",
      c: true,
      d: "stringD",
      e: false,
    },
    "85.01 - mix of Bools and strings resolve to the value of the first encountered Bool"
  );
  t.same(
    jv(
      {
        a: "%%_b_%% %%_c_%% %%_d_%% %%_e_%%",
        b: "stringB",
        c: true,
        d: "stringD",
        e: false,
      },
      {
        resolveToBoolIfAnyValuesContainBool: false,
      }
    ),
    {
      a: "stringB  stringD ",
      b: "stringB",
      c: true,
      d: "stringD",
      e: false,
    },
    "85.02"
  );
  t.same(
    jv(
      {
        a: "%%_b_%% %%_c_%% %%_d_%% %%_e_%%",
        b: "stringB",
        c: true,
        d: "stringD",
        e: false,
      },
      { resolveToFalseIfAnyValuesContainBool: false }
    ),
    {
      a: true, // <------ first Boolean value is put here. "b" was string, so "c = true" goes here.
      b: "stringB",
      c: true,
      d: "stringD",
      e: false,
    },
    "85.03"
  );
  t.same(
    jv(
      {
        a: "%%_b_%% %%_c_%% %%_d_%% %%_e_%%",
        b: "stringB",
        c: true,
        d: "stringD",
        e: false,
      },
      {
        resolveToBoolIfAnyValuesContainBool: false,
        resolveToFalseIfAnyValuesContainBool: false,
      }
    ),
    {
      a: "stringB  stringD ",
      b: "stringB",
      c: true,
      d: "stringD",
      e: false,
    },
    "85.04"
  );
  t.end();
});

tap.test(
  "86 - Boolean values inserted instead of other values, in whole",
  (t) => {
    t.same(
      jv({
        a: "%%_b_%%",
        b: true,
      }),
      {
        a: false,
        b: true,
      },
      "86.01"
    );
    t.same(
      jv(
        {
          a: "%%_b_%%",
          b: true,
        },
        { resolveToFalseIfAnyValuesContainBool: true }
      ),
      {
        a: false,
        b: true,
      },
      "86.02"
    );
    t.same(
      jv(
        {
          a: "%%_b_%%",
          b: true,
        },
        { resolveToFalseIfAnyValuesContainBool: false }
      ),
      {
        a: true,
        b: true,
      },
      "86.03"
    );
    t.end();
  }
);

tap.test("87 - null values inserted into a middle of a string", (t) => {
  t.same(
    jv({
      a: "%%_b_%% %%_c_%% %%_d_%% %%_e_%%",
      b: "stringB",
      c: null,
      d: "stringD",
      e: null,
    }),
    {
      a: "stringB  stringD ",
      b: "stringB",
      c: null,
      d: "stringD",
      e: null,
    },
    "87"
  );
  t.end();
});

tap.test("88 - null values inserted instead of other values, in whole", (t) => {
  t.same(
    jv({
      a: "%%_b_%%",
      b: null,
    }),
    {
      a: null,
      b: null,
    },
    "88.01"
  );
  t.same(
    jv({
      a: "  %%_b_%%  ", // <---- will "whole value is var" detection cope with whitespaces?
      b: null,
    }),
    {
      a: null,
      b: null,
    },
    "88.02 - spaces around a value which would resolve to null"
  );
  t.same(
    jv({
      a: "%%-b-%%",
      b: null,
    }),
    {
      a: null,
      b: null,
    },
    "88.03 - using non-wrapping heads/tails"
  );
  t.same(
    jv({
      a: "  %%-b-%%  ",
      b: null,
    }),
    {
      a: null,
      b: null,
    },
    "88.04 - like #3 but with extra whitespace"
  );
  t.same(
    jv(
      {
        a: "%%_b_%%",
        b: null,
      },
      {
        wrapHeadsWith: "{{",
        wrapTailsWith: "}}",
      }
    ),
    {
      a: null,
      b: null,
    },
    "88.05 - doesn't wrap null"
  );
  t.same(
    jv(
      {
        a: "%%-b-%%", // <---- it was no-wrap markers anyway
        b: null,
      },
      {
        wrapHeadsWith: "{{",
        wrapTailsWith: "}}",
      }
    ),
    {
      a: null,
      b: null,
    },
    "88.06 - doesn't wrap null"
  );
  t.end();
});

// -----------------------------------------------------------------------------
// 09. opts.resolveToBoolIfAnyValuesContainBool
// -----------------------------------------------------------------------------

tap.test(
  "89 - opts.resolveToBoolIfAnyValuesContainBool, Bools and Strings mix",
  (t) => {
    // False

    t.same(
      jv({
        a: "zzz %%_b_%% zzz",
        b: false,
      }),
      {
        a: false,
        b: false,
      },
      "89.01 - false - default (opts on)"
    );
    t.same(
      jv(
        {
          a: "zzz %%_b_%% zzz",
          b: false,
        },
        {
          resolveToBoolIfAnyValuesContainBool: true,
        }
      ),
      {
        a: false,
        b: false,
      },
      "89.02 - false - hardcoded (opts on)"
    );
    t.same(
      jv(
        {
          a: "zzz %%_b_%% zzz",
          b: false,
        },
        {
          resolveToBoolIfAnyValuesContainBool: false,
        }
      ),
      {
        a: "zzz  zzz",
        b: false,
      },
      "89.03 - false - opts off"
    );

    // True

    t.same(
      jv(
        {
          a: "zzz %%_b_%% zzz %%_c_%%",
          b: true,
          c: false,
        },
        {
          resolveToFalseIfAnyValuesContainBool: false,
        }
      ),
      {
        a: true, // because first encountered value to be resolved was Boolean True
        b: true,
        c: false,
      },
      "89.04 - relying on default, opts.resolveToFalseIfAnyValuesContainBool does not matter"
    );
    t.same(
      jv(
        {
          a: "zzz %%_b_%% zzz %%_c_%%",
          b: true,
          c: false,
        },
        {
          resolveToBoolIfAnyValuesContainBool: true,
          resolveToFalseIfAnyValuesContainBool: false,
        }
      ),
      {
        a: true,
        b: true,
        c: false,
      },
      "89.05 - Bools hardcoded default, not forcing false"
    );
    t.same(
      jv(
        {
          a: "zzz %%_b_%% zzz %%_c_%%",
          b: true,
          c: false,
        },
        {
          resolveToBoolIfAnyValuesContainBool: true,
          resolveToFalseIfAnyValuesContainBool: true,
        }
      ),
      {
        a: false,
        b: true,
        c: false,
      },
      "89.06 - Bools hardcoded default, forcing false"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 10. variable resolving on a deeper levels, other than root
// -----------------------------------------------------------------------------

tap.test("90 - variables resolve being in deeper levels", (t) => {
  t.same(
    jv({
      a: [
        {
          b: "zzz %%_c_%% yyy",
          c: "d1",
        },
      ],
      c: "d2",
    }),
    {
      a: [
        {
          b: "zzz d1 yyy",
          c: "d1",
        },
      ],
      c: "d2",
    },
    "90 - defaults"
  );
  t.end();
});

tap.test(
  "91 - deeper level variables not found, bubble up and are found",
  (t) => {
    t.same(
      jv({
        a: [
          {
            b: "zzz %%_c_%% yyy",
            z: "d1",
          },
        ],
        c: "d2",
      }),
      {
        a: [
          {
            b: "zzz d2 yyy",
            z: "d1",
          },
        ],
        c: "d2",
      },
      "91 - defaults"
    );
    t.end();
  }
);

tap.test("92 - third level resolves at its level", (t) => {
  t.same(
    jv({
      a: [
        {
          b: [
            {
              c: "zzz %%_d_%% yyy",
              d: "e1",
            },
          ],
        },
      ],
      d: "e2",
    }),
    {
      a: [
        {
          b: [
            {
              c: "zzz e1 yyy",
              d: "e1",
            },
          ],
        },
      ],
      d: "e2",
    },
    "92 - defaults"
  );
  t.end();
});

tap.test("93 - third level falls back to root", (t) => {
  t.same(
    jv({
      a: [
        {
          b: [
            {
              c: "zzz %%_d_%% yyy",
              z: "e1",
            },
          ],
        },
      ],
      d: "e2",
    }),
    {
      a: [
        {
          b: [
            {
              c: "zzz e2 yyy",
              z: "e1",
            },
          ],
        },
      ],
      d: "e2",
    },
    "93 - defaults"
  );
  t.end();
});

tap.test("94 - third level uses data container key", (t) => {
  t.same(
    jv({
      a: [
        {
          b: [
            {
              c: "zzz %%_d_%% yyy",
              c_data: {
                x: "x1",
                y: "y1",
                d: "e1",
              },
            },
          ],
        },
      ],
      d: "e2",
    }),
    {
      a: [
        {
          b: [
            {
              c: "zzz e1 yyy",
              c_data: {
                x: "x1",
                y: "y1",
                d: "e1",
              },
            },
          ],
        },
      ],
      d: "e2",
    },
    "94 - defaults"
  );
  t.end();
});

tap.test(
  "95 - third level uses data container key, but there's nothing there so falls back to root (successfully)",
  (t) => {
    t.same(
      jv({
        a: [
          {
            b: [
              {
                c: "zzz %%_d_%% yyy",
                c_data: {
                  x: "x1",
                  y: "y1",
                },
              },
            ],
          },
        ],
        d: "e2",
      }),
      {
        a: [
          {
            b: [
              {
                c: "zzz e2 yyy",
                c_data: {
                  x: "x1",
                  y: "y1",
                },
              },
            ],
          },
        ],
        d: "e2",
      },
      "95 - defaults"
    );
    t.end();
  }
);

tap.test(
  "96 - third level uses data container key, but there's nothing there so falls back to root data container (successfully)",
  (t) => {
    t.same(
      jv({
        a: [
          {
            b: [
              {
                c: "zzz %%_d_%% yyy",
                c_data: {
                  x: "x1",
                  y: "y1",
                },
              },
            ],
          },
        ],
        a_data: {
          d: "e2",
        },
      }),
      {
        a: [
          {
            b: [
              {
                c: "zzz e2 yyy",
                c_data: {
                  x: "x1",
                  y: "y1",
                },
              },
            ],
          },
        ],
        a_data: {
          d: "e2",
        },
      },
      "96.01 - defaults - root has normal container, a_data, named by topmost parent key"
    );
    t.same(
      jv({
        a: [
          {
            b: [
              {
                c: "zzz %%_d_%% yyy",
                c_data: {
                  x: "x1",
                  y: "y1",
                },
              },
            ],
          },
        ],
        c_data: {
          d: "e2",
        },
      }),
      {
        a: [
          {
            b: [
              {
                c: "zzz e2 yyy",
                c_data: {
                  x: "x1",
                  y: "y1",
                },
              },
            ],
          },
        ],
        c_data: {
          d: "e2",
        },
      },
      "96.02 - root has container, named how deepest data contaienr should be named"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 11. two-level querying
// -----------------------------------------------------------------------------

tap.test("97 - two-level querying, normal keys in the root", (t) => {
  t.same(
    jv({
      a: "some text %%_var1.key3_%% more text %%_var2.key6_%%",
      b: "something",
      var1: {
        key1: "value1",
        key2: "value2",
        key3: "value3",
        key4: "value4",
      },
      var2: {
        key5: "value5",
        key6: "value6",
        key7: "value7",
        key8: "value8",
      },
    }),
    {
      a: "some text value3 more text value6",
      b: "something",
      var1: {
        key1: "value1",
        key2: "value2",
        key3: "value3",
        key4: "value4",
      },
      var2: {
        key5: "value5",
        key6: "value6",
        key7: "value7",
        key8: "value8",
      },
    },
    "97 - running on default notation"
  );
  t.end();
});

tap.test(
  "98 - two-level querying, normal keys in the root + wrapping & opts",
  (t) => {
    t.same(
      jv(
        {
          a: "some text %%_var1.key3_%% more text %%_var2.key6_%%",
          b: "something",
          var1: {
            key1: "value1",
            key2: "value2",
            key3: "value3",
            key4: "value4",
          },
          var2: {
            key5: "value5",
            key6: "value6",
            key7: "value7",
            key8: "value8",
          },
        },
        {
          lookForDataContainers: true,
          dataContainerIdentifierTails: "_data",
          wrapHeadsWith: "{",
          wrapTailsWith: "}",
          dontWrapVars: ["*zzz", "var1.*", "*key6"],
          preventDoubleWrapping: true,
          wrapGlobalFlipSwitch: true,
        }
      ),
      {
        a: "some text value3 more text value6",
        b: "something",
        var1: {
          key1: "value1",
          key2: "value2",
          key3: "value3",
          key4: "value4",
        },
        var2: {
          key5: "value5",
          key6: "value6",
          key7: "value7",
          key8: "value8",
        },
      },
      "98.01 - didn't wrap either, first level caught"
    );

    t.same(
      jv(
        {
          a: "some text %%_var1.key3_%% more text %%_var2.key6_%%",
          b: "something",
          var1: {
            key1: "value1",
            key2: "value2",
            key3: "value3",
            key4: "value4",
          },
          var2: {
            key5: "value5",
            key6: "value6",
            key7: "value7",
            key8: "value8",
          },
        },
        {
          lookForDataContainers: true,
          dataContainerIdentifierTails: "_data",
          wrapHeadsWith: "{",
          wrapTailsWith: "}",
          dontWrapVars: ["*zzz", "*3", "*9"],
          preventDoubleWrapping: true,
          wrapGlobalFlipSwitch: true,
        }
      ),
      {
        a: "some text value3 more text {value6}",
        b: "something",
        var1: {
          key1: "value1",
          key2: "value2",
          key3: "value3",
          key4: "value4",
        },
        var2: {
          key5: "value5",
          key6: "value6",
          key7: "value7",
          key8: "value8",
        },
      },
      "98.02 - didn't wrap one, second level caught"
    );

    t.same(
      jv(
        {
          a: "some text %%_var1.key3_%% more text %%_var2.key6_%%",
          b: "something",
          var1: {
            key1: "value1",
            key2: "value2",
            key3: "value3",
            key4: "value4",
          },
          var2: {
            key5: "value5",
            key6: "value6",
            key7: "value7",
            key8: "value8",
          },
        },
        {
          lookForDataContainers: true,
          dataContainerIdentifierTails: "_data",
          dontWrapVars: ["*zzz", "key3", "key6"],
          preventDoubleWrapping: true,
          wrapGlobalFlipSwitch: true,
        }
      ),
      {
        a: "some text value3 more text value6",
        b: "something",
        var1: {
          key1: "value1",
          key2: "value2",
          key3: "value3",
          key4: "value4",
        },
        var2: {
          key5: "value5",
          key6: "value6",
          key7: "value7",
          key8: "value8",
        },
      },
      "98.03 - didn't wrap either, second levels caught"
    );

    t.same(
      jv(
        {
          a: "some text %%-var1.key3-%% more text %%-var2.key6-%%",
          b: "something",
          var1: {
            key1: "value1",
            key2: "value2",
            key3: "value3",
            key4: "value4",
          },
          var2: {
            key5: "value5",
            key6: "value6",
            key7: "value7",
            key8: "value8",
          },
        },
        {
          lookForDataContainers: true,
          dataContainerIdentifierTails: "_data",
          wrapHeadsWith: "whatever,",
          wrapTailsWith: "it won't be used anyway",
          dontWrapVars: ["*zzz", "*3", "*9"],
          preventDoubleWrapping: true,
          wrapGlobalFlipSwitch: true,
        }
      ),
      {
        a: "some text value3 more text value6",
        b: "something",
        var1: {
          key1: "value1",
          key2: "value2",
          key3: "value3",
          key4: "value4",
        },
        var2: {
          key5: "value5",
          key6: "value6",
          key7: "value7",
          key8: "value8",
        },
      },
      "98.04 - didn't wrap either because of %%- the non-wrapping notation."
    );

    t.same(
      jv(
        {
          a: "some text %%-var1.key3-%% more text %%-var2.key6-%%",
          b: "something",
          var1: {
            key1: "value1",
            key2: "value2",
            key3: "value3",
            key4: "value4",
          },
          var2: {
            key5: "value5",
            key6: "value6",
            key7: "value7",
            key8: "value8",
          },
        },
        {
          lookForDataContainers: true,
          dataContainerIdentifierTails: "_data",
          wrapHeadsWith: "whatever,",
          wrapTailsWith: "it won't be used anyway",
          dontWrapVars: [],
          preventDoubleWrapping: true,
          wrapGlobalFlipSwitch: true,
        }
      ),
      {
        a: "some text value3 more text value6",
        b: "something",
        var1: {
          key1: "value1",
          key2: "value2",
          key3: "value3",
          key4: "value4",
        },
        var2: {
          key5: "value5",
          key6: "value6",
          key7: "value7",
          key8: "value8",
        },
      },
      "98.05"
    );
    t.end();
  }
);

tap.test("99 - opts.throwWhenNonStringInsertedInString", (t) => {
  const err1 = t.throws(() => {
    jv(
      {
        a: "some text %%_var1_%% more text %%_var2_%%",
        b: "something",
        var1: { key1: "value1", key2: "value2" },
        var2: { key3: "value3", key4: "value4" },
      },
      {
        throwWhenNonStringInsertedInString: true,
      }
    );
  });
  t.match(err1.message, /THROW_ID_23/, "99.01");

  t.doesNotThrow(() => {
    jv({
      a: "some text %%_var1_%% more text %%_var2_%%",
      b: "something",
      var1: { key1: "value1", key2: "value2" },
      var2: { key3: "value3", key4: "value4" },
    });
  }, "99.02");

  // then, also, pin the whole-value-variables

  t.same(
    jv({
      a: "%%-var1-%%",
      var1: null,
      b: "%%-var2-%%",
      var2: false,
    }),
    {
      a: null,
      var1: null,
      b: false,
      var2: false,
    },
    "99.03 - no path, values are variables in whole"
  );

  t.same(
    jv({
      a: "%%_var1.key1_%%",
      var1: { key1: null },
      b: "%%_var2.key2_%%",
      var2: { key2: false },
    }),
    {
      a: null,
      var1: { key1: null },
      b: false,
      var2: { key2: false },
    },
    "99.04 - control"
  );

  t.same(
    jv(
      {
        a: "%%_var1.key1_%%",
        var1: { key1: null },
        b: "%%_var2.key2_%%",
        var2: { key2: false },
      },
      { throwWhenNonStringInsertedInString: true }
    ),
    {
      a: null,
      var1: { key1: null },
      b: false,
      var2: { key2: false },
    },
    "99.05 - opts"
  );
  t.end();
});

tap.test("100 - multi-level + from array + root data store + ignores", (t) => {
  t.same(
    jv(
      {
        title: [
          "something",
          "Some text %%_subtitle.aaa_%%",
          "%%_submarine.bbb_%%",
          "anything",
        ],
        title_data: {
          subtitle: { aaa: "text" },
          submarine: { bbb: "ship" },
        },
      },
      {
        heads: "%%_",
        tails: "_%%",
        lookForDataContainers: true,
        dataContainerIdentifierTails: "_data",
        wrapHeadsWith: "{",
        wrapTailsWith: "}",
        dontWrapVars: ["*zzz", "*.aaa", "*yyy"],
        preventDoubleWrapping: true,
        wrapGlobalFlipSwitch: true,
      }
    ),
    {
      title: ["something", "Some text text", "{ship}", "anything"],
      title_data: {
        subtitle: { aaa: "text" },
        submarine: { bbb: "ship" },
      },
    },
    "100 - two ignores in an array, data store, multi-level"
  );
  t.end();
});

// -----------------------------------------------------------------------------
// 12. Potentially clashing combos of characters
// -----------------------------------------------------------------------------

tap.test(
  "101 - surrounding underscores - sneaky similarity with wrong side brackets #1",
  (t) => {
    t.same(
      jv({
        a: "joined with an underscores: %%_var1_%%_%%_var2_%%",
        b: "something",
        var1: "value1",
        var2: "value2",
      }),
      {
        a: "joined with an underscores: value1_value2",
        b: "something",
        var1: "value1",
        var2: "value2",
      },
      "101"
    );
    t.end();
  }
);

tap.test(
  "102 - surrounding underscores - sneaky similarity with wrong side brackets #2",
  (t) => {
    t.same(
      jv({
        a: "joined with an dashes: %%-var1-%%-%%-var2-%%",
        b: "something",
        var1: "value1",
        var2: "value2",
      }),
      {
        a: "joined with an dashes: value1-value2",
        b: "something",
        var1: "value1",
        var2: "value2",
      },
      "102"
    );
    t.end();
  }
);

tap.test(
  "103 - surrounding underscores - sneaky similarity with wrong side brackets #3",
  (t) => {
    t.same(
      jv({
        a: "zzz_%%-var1-%%_%%-var2-%%_yyy",
        b: "something",
        var1: "value1",
        var2: "value2",
      }),
      {
        a: "zzz_value1_value2_yyy",
        b: "something",
        var1: "value1",
        var2: "value2",
      },
      "103"
    );
    t.end();
  }
);

tap.test(
  "104 - surrounding underscores - sneaky similarity with wrong side brackets #4",
  (t) => {
    t.same(
      jv({
        a: "zzz_%%-var1-%%_%%-var2-%%",
        b: "something",
        var1: "value1",
        var2: "value2",
      }),
      {
        a: "zzz_value1_value2",
        b: "something",
        var1: "value1",
        var2: "value2",
      },
      "104"
    );
    t.end();
  }
);

tap.test(
  "105 - surrounding dashes - sneaky similarity with wrong side brackets #1",
  (t) => {
    t.same(
      jv({
        a: "zzz-%%_var1_%%-%%_var2_%%-yyy",
        b: "something",
        var1: "value1",
        var2: "value2",
      }),
      {
        a: "zzz-value1-value2-yyy",
        b: "something",
        var1: "value1",
        var2: "value2",
      },
      "105"
    );
    t.end();
  }
);

tap.test(
  "106 - surrounding dashes - sneaky similarity with wrong side brackets #2",
  (t) => {
    t.same(
      jv({
        a: "zzz-%%_var1_%%-%%_var2_%%",
        b: "something",
        var1: "value1",
        var2: "value2",
      }),
      {
        a: "zzz-value1-value2",
        b: "something",
        var1: "value1",
        var2: "value2",
      },
      "106"
    );
    t.end();
  }
);
