const t = require("tap");
const strFindHeadsTails = require("../dist/string-find-heads-tails.cjs");

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

t.test(
  "01.01 - throws when the first argument, source string, is not a string",
  t => {
    t.throws(() => {
      strFindHeadsTails(1);
    }, /THROW_ID_02/);
    t.throws(() => {
      strFindHeadsTails(1, "a", "b");
    }, /THROW_ID_02/);
    t.end();
  }
);

t.test("01.02 - throws when there's no input", t => {
  t.throws(() => {
    strFindHeadsTails();
  }, /THROW_ID_02/);
  t.end();
});

t.test("01.03 - throws when the second argument, heads, is not a string", t => {
  t.throws(() => {
    strFindHeadsTails("a", 1, "a");
  }, /THROW_ID_03/);

  t.throws(() => {
    strFindHeadsTails("a", 1, "z");
  }, /THROW_ID_03/);

  t.throws(() => {
    strFindHeadsTails("a", 1, "a");
  }, /THROW_ID_03/);

  t.throws(() => {
    strFindHeadsTails("a", "", "z");
  }, /THROW_ID_04/);

  t.throws(() => {
    strFindHeadsTails("a", [], "z");
  }, /THROW_ID_05/);

  t.throws(() => {
    strFindHeadsTails("a", ["z", 1, null], ["z"]);
  }, /THROW_ID_06/);

  t.throws(() => {
    strFindHeadsTails("a", ["z", 1, undefined], "z");
  }, /THROW_ID_06/);

  t.throws(() => {
    strFindHeadsTails("a", ["z", true], "z");
  }, /THROW_ID_06/);

  t.throws(() => {
    strFindHeadsTails("a", ["b", ""], "c");
  }, /THROW_ID_07/);

  t.end();
});

t.test("01.04 - throws when the third argument, tails, is not a string", t => {
  t.throws(() => {
    strFindHeadsTails("a", "a");
  }, /THROW_ID_08/);

  t.throws(() => {
    strFindHeadsTails("a", "a", null);
  }, /THROW_ID_08/);

  t.throws(() => {
    strFindHeadsTails("a", "a", 1);
  }, /THROW_ID_08/);

  t.throws(() => {
    strFindHeadsTails("a", "a", "");
  }, /THROW_ID_09/);

  t.throws(() => {
    strFindHeadsTails("a", "a", []);
  }, /THROW_ID_10/);

  t.throws(() => {
    strFindHeadsTails("a", "a", ["z", 1]);
  }, /THROW_ID_11/);

  t.throws(() => {
    strFindHeadsTails("a", "a", [null]);
  }, /THROW_ID_11/);

  t.throws(() => {
    strFindHeadsTails("a", "a", [true]);
  }, /THROW_ID_11/);

  t.throws(() => {
    strFindHeadsTails("a", "a", ["z", ""]);
  }, /THROW_ID_12/);

  t.end();
});

t.test(
  "01.05 - throws when the fourth argument, opts, is of a wrong type",
  t => {
    t.throws(() => {
      strFindHeadsTails("a", "a", "a", "a");
    }, /THROW_ID_01/);

    t.doesNotThrow(() => {
      strFindHeadsTails("a", "a", "a", null); // falsey is OK
    });
    t.doesNotThrow(() => {
      strFindHeadsTails("a", "a", "a", undefined); // falsey is OK
    });
    t.doesNotThrow(() => {
      strFindHeadsTails("a", "a", "a", { fromIndex: "1" }); // OK, will be parsed
    });
    t.doesNotThrow(() => {
      strFindHeadsTails("a", "a", "a", { fromIndex: 1 }); // canonical
    });
    t.end();
  }
);

t.test("01.06 - opts.fromIndex is not a natural number", t => {
  // not a natural number
  t.throws(() => {
    strFindHeadsTails("a", "a", "a", { fromIndex: 1.5 });
  }, /THROW_ID_18/);
  t.end();
});

t.test("01.07 - opts.fromIndex is not a natural number", t => {
  // not a natural number
  t.throws(() => {
    strFindHeadsTails("a", "a", "a", { fromIndex: 1.5, source: "TEST 1.8:" });
  }, /THROW_ID_18/);
  t.end();
});

t.test("01.08 - unmatched heads and tails", t => {
  t.throws(() => {
    strFindHeadsTails("abc%%_def_%ghi", "%%_", "_%%");
  }, /THROW_ID_22/); // sneaky - tails' second percentage char is missing, hence unrecognised and throws

  t.throws(() => {
    strFindHeadsTails("abcdef", "x", "e"); // heads not found
  }, /THROW_ID_21/);

  t.throws(() => {
    strFindHeadsTails("abcdef", "x", ["e", "$"]); // heads not found
  }, /THROW_ID_21/);

  t.throws(() => {
    strFindHeadsTails("abcdef", ["_", "x"], ["e", "$"]); // heads not found
  }, /THROW_ID_21/);

  t.throws(() => {
    strFindHeadsTails("abcdef", ["_", "x"], ["e", "$"], {
      source: "TEST 4.2:"
    }); // heads not found
  }, /TEST 4\.2/);

  t.throws(() => {
    strFindHeadsTails("abcdef", "b", "x"); // tails not found
  }, /THROW_ID_22/);

  t.throws(() => {
    strFindHeadsTails("abcdef", "b", "x", { source: "TEST 5.2:" }); // tails not found
  }, /TEST 5\.2/);

  t.throws(() => {
    strFindHeadsTails("abcdef", ["&", "b"], "x"); // tails not found
  }, /THROW_ID_22/);

  t.doesNotThrow(() => {
    strFindHeadsTails("abcdef", "x", "z"); // both heads and tails not found - OK
  });

  t.end();
});

t.test("01.09 - both heads and tails found but wrong order", t => {
  t.throws(() => {
    strFindHeadsTails("abc___def---ghi", "---", "___"); // opposite order
  }, /THROW_ID_22/);

  t.throws(() => {
    strFindHeadsTails("abc___def---ghi", ["***", "---"], "___"); // opposite order
  }, /THROW_ID_22/);

  t.throws(() => {
    strFindHeadsTails("abc___def---ghi", ["***", "---"], ["^^^", "___"]); // opposite order
  }, /THROW_ID_22/);

  t.throws(() => {
    strFindHeadsTails("--a__bcdef**", ["--", "__"], ["**", "^^"]); // two consecutive heads
  }, /THROW_ID_19/);

  t.throws(() => {
    strFindHeadsTails("--a__bcdef**", ["--", "__"], ["**", "^^"], {
      source: "TEST 4.3:"
    }); // two consecutive heads
  }, /TEST 4\.3/);

  t.throws(() => {
    strFindHeadsTails("--a**bcdefghij^^", ["--", "__"], ["**", "^^"]); // two consecutive tails
  }, /THROW_ID_21/);

  t.throws(() => {
    strFindHeadsTails("--a^^bc__defghij", ["--", "__"], ["**", "^^"]); // second heads unmatched
  }, /THROW_ID_22/);

  t.end();
});

t.test("01.10 - heads of one type, tails of another", t => {
  t.same(
    strFindHeadsTails(
      "some text %%_var1-%% more text %%_var2_%%",
      ["%%_", "%%-"],
      ["-%%", "_%%"]
    ),
    [
      {
        headsStartAt: 10,
        headsEndAt: 13,
        tailsStartAt: 17,
        tailsEndAt: 20
      },
      {
        headsStartAt: 31,
        headsEndAt: 34,
        tailsStartAt: 38,
        tailsEndAt: 41
      }
    ],
    "01.08 - default behaviour - not strict pair matching"
  );
  t.end();
});

t.test("01.11 - heads of one type, tails of another", t => {
  t.throws(() => {
    strFindHeadsTails(
      "some text %%_var1-%% more text %%_var2_%%",
      ["%%_", "%%-"],
      ["_%%", "-%%"],
      {
        matchHeadsAndTailsStrictlyInPairsByTheirOrder: true
      }
    );
  }, /THROW_ID_20/);
  t.end();
});

t.test("01.12 - heads of one type, tails of another", t => {
  t.throws(() => {
    strFindHeadsTails(
      "some text %%_var1-%% more text %%_var2_%%",
      ["%%_", "%%-"],
      ["_%%", "-%%"],
      {
        matchHeadsAndTailsStrictlyInPairsByTheirOrder: true,
        source: "TEST 1.08:"
      }
    );
  }, /TEST 1\.08/);
  t.end();
});

t.test("01.13 - heads of one type, tails of another", t => {
  // let's just prove that it error message is not about empty opts.source but
  // still about the same index mismatch as the tests above
  t.throws(() => {
    strFindHeadsTails(
      "some text %%_var1-%% more text %%_var2_%%",
      ["%%_", "%%-"],
      ["_%%", "-%%"],
      {
        matchHeadsAndTailsStrictlyInPairsByTheirOrder: true,
        source: "" // <------ EMPTY
      }
    );
  }, /the tails the followed it were not of the same index/);
  t.end();
});

t.test(
  "01.14 - sequences are treated correctly by opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder",
  t => {
    t.same(
      strFindHeadsTails(
        "some text -%%-var1-%%- more text _%%_var2_%%_ and even more -%%-var3-%%-.",
        ["%%_", "%%-"],
        ["_%%", "-%%"],
        { matchHeadsAndTailsStrictlyInPairsByTheirOrder: false }
      ),
      [
        {
          headsStartAt: 11,
          headsEndAt: 14,
          tailsStartAt: 18,
          tailsEndAt: 21
        },
        {
          headsStartAt: 34,
          headsEndAt: 37,
          tailsStartAt: 41,
          tailsEndAt: 44
        },
        {
          headsStartAt: 61,
          headsEndAt: 64,
          tailsStartAt: 68,
          tailsEndAt: 71
        }
      ],
      "01.09.01 - default behaviour - no strict pair matching"
    );
    t.same(
      strFindHeadsTails(
        "some text -%%-var1-%%- more text _%%_var2_%%_ and even more -%%-var3-%%-.",
        ["%%_", "%%-"],
        ["_%%", "-%%"],
        { matchHeadsAndTailsStrictlyInPairsByTheirOrder: true }
      ),
      [
        {
          headsStartAt: 11,
          headsEndAt: 14,
          tailsStartAt: 18,
          tailsEndAt: 21
        },
        {
          headsStartAt: 34,
          headsEndAt: 37,
          tailsStartAt: 41,
          tailsEndAt: 44
        },
        {
          headsStartAt: 61,
          headsEndAt: 64,
          tailsStartAt: 68,
          tailsEndAt: 71
        }
      ],
      "01.09.02 - strict pair matching"
    );
    t.same(
      strFindHeadsTails(
        "some text _%-var1-%_ more text _%_var2_%_ and even more -%-var3-%- and -%_var4_%-.",
        ["%_", "%-"],
        ["_%", "-%"],
        { matchHeadsAndTailsStrictlyInPairsByTheirOrder: true }
      ),
      [
        {
          headsStartAt: 11,
          headsEndAt: 13,
          tailsStartAt: 17,
          tailsEndAt: 19
        },
        {
          headsStartAt: 32,
          headsEndAt: 34,
          tailsStartAt: 38,
          tailsEndAt: 40
        },
        {
          headsStartAt: 57,
          headsEndAt: 59,
          tailsStartAt: 63,
          tailsEndAt: 65
        },
        {
          headsStartAt: 72,
          headsEndAt: 74,
          tailsStartAt: 78,
          tailsEndAt: 80
        }
      ],
      "01.09.03 - strict pair matching"
    );

    t.end();
  }
);

// -----------------------------------------------------------------------------
// 02. normal use, no third arg in the input
// -----------------------------------------------------------------------------

t.test("02.01 - single char markers", t => {
  t.same(
    strFindHeadsTails("abcdef", "b", "e"),
    [
      {
        headsStartAt: 1,
        headsEndAt: 2,
        tailsStartAt: 4,
        tailsEndAt: 5
      }
    ],
    "02.01.01 - easies"
  );
  t.same(
    strFindHeadsTails("ab", "a", "b"),
    [
      {
        headsStartAt: 0,
        headsEndAt: 1,
        tailsStartAt: 1,
        tailsEndAt: 2
      }
    ],
    "02.01.02 - tight"
  );
  t.end();
});

t.test("02.02 - multi-char markers", t => {
  t.same(
    strFindHeadsTails("abc%%_def_%%ghi", "%%_", "_%%"),
    [
      {
        headsStartAt: 3,
        headsEndAt: 6,
        tailsStartAt: 9,
        tailsEndAt: 12
      }
    ],
    "02.02.01"
  );
  const err1 = t.throws(() => {
    strFindHeadsTails("abc%%_def_%%ghi", "%%_", "_%%", { fromIndex: 4 });
  }); // fromIndex prevented heads from being caught. Tails were caught, but
  // since opts.throwWhenSomethingWrongIsDetected is on, error is thrown.
  t.ok(err1.message.includes("THROW_ID_21"));

  t.same(
    strFindHeadsTails("abc%%_def_%%ghi", "%%_", "_%%", {
      fromIndex: 4,
      throwWhenSomethingWrongIsDetected: false
    }),
    [],
    "02.02.02 - offset meant we started beyond first heads, so no tails were accepted"
  );
  t.same(
    strFindHeadsTails("abczz-def--aghi", "zz-", "--a"),
    [
      {
        headsStartAt: 3,
        headsEndAt: 6,
        tailsStartAt: 9,
        tailsEndAt: 12
      }
    ],
    "02.02.03"
  );
  t.same(
    strFindHeadsTails(
      "abc%%_def_%%ghi%%-jkl-%%",
      ["%%_", "%%-"],
      ["_%%", "-%%"]
    ),
    [
      {
        headsStartAt: 3,
        headsEndAt: 6,
        tailsStartAt: 9,
        tailsEndAt: 12
      },
      {
        headsStartAt: 15,
        headsEndAt: 18,
        tailsStartAt: 21,
        tailsEndAt: 24
      }
    ],
    "02.02.04"
  );
  t.end();
});

t.test(
  '02.03 - sneaky "casual" underscores try to blend in with legit heads/tails',
  t => {
    t.same(
      strFindHeadsTails("aaa_%%_bbb_%%_ccc", "%%_", "_%%"),
      [
        {
          headsStartAt: 4,
          headsEndAt: 7,
          tailsStartAt: 10,
          tailsEndAt: 13
        }
      ],
      "02.03"
    );
    t.end();
  }
);

t.test("02.04 - sneaky tails precede heads", t => {
  const err = t.throws(() => {
    strFindHeadsTails("aaa_%%bbb%%_ccc", "%%_", "_%%");
  });
  t.ok(err.message.includes("THROW_ID_22"));

  t.same(
    strFindHeadsTails("aaa_%%bbb%%_ccc", "%%_", "_%%", {
      throwWhenSomethingWrongIsDetected: false
    }),
    [],
    "02.04.02"
  );
  t.end();
});

t.test("02.05 - arrays of heads and tails", t => {
  t.same(
    strFindHeadsTails(
      "zzz_%%-zz_cmp_id-%%_%%-lnk_id-%%",
      ["%%_", "%%-"],
      ["_%%", "-%%"]
    ),
    [
      {
        headsStartAt: 4,
        headsEndAt: 7,
        tailsStartAt: 16,
        tailsEndAt: 19
      },
      {
        headsStartAt: 20,
        headsEndAt: 23,
        tailsStartAt: 29,
        tailsEndAt: 32
      }
    ],
    "02.05"
  );
  t.end();
});

t.test("02.06 - input is equal to heads or tails", t => {
  t.same(
    strFindHeadsTails("%%_", "%%_", "_%%", {
      throwWhenSomethingWrongIsDetected: false
    }),
    [],
    "02.06.01"
  );
  t.same(
    strFindHeadsTails("%%_", "%%_", "_%%", {
      throwWhenSomethingWrongIsDetected: true
    }),
    [],
    "02.06.02"
  );
  t.same(
    strFindHeadsTails("%%_", "%%_", "_%%", {
      throwWhenSomethingWrongIsDetected: true,
      allowWholeValueToBeOnlyHeadsOrTails: true
    }),
    [],
    "02.06.03"
  );
  t.same(
    strFindHeadsTails("%%_", "%%_", "_%%", {
      throwWhenSomethingWrongIsDetected: false,
      allowWholeValueToBeOnlyHeadsOrTails: true
    }),
    [],
    "02.06.04"
  );
  // only this settings combo will cause a throw:
  const err1 = t.throws(() => {
    strFindHeadsTails("%%_", "%%_", "_%%", {
      throwWhenSomethingWrongIsDetected: true,
      allowWholeValueToBeOnlyHeadsOrTails: false
    });
  }); // equal to heads
  t.ok(err1.message.includes("THROW_ID_16"));
  const err12 = t.throws(() => {
    strFindHeadsTails("%%_", "%%_", "_%%", {
      throwWhenSomethingWrongIsDetected: true,
      allowWholeValueToBeOnlyHeadsOrTails: false,
      source: "TEST 1.6"
    });
  }); // equal to heads
  t.notOk(err12.message.includes("THROW_ID_16"));
  t.ok(err12.message.includes("TEST 1.6"));

  const err2 = t.throws(() => {
    strFindHeadsTails("%%_", "%%_", "_%%", {
      throwWhenSomethingWrongIsDetected: true,
      allowWholeValueToBeOnlyHeadsOrTails: false,
      source: "someLib [CUSTOM_THROW_99]:"
    });
  }); // equal to heads
  t.ok(err2.message.includes("CUSTOM"));

  const err3 = t.throws(() => {
    strFindHeadsTails("_%%", "%%_", "_%%", {
      throwWhenSomethingWrongIsDetected: true,
      allowWholeValueToBeOnlyHeadsOrTails: false
    });
  }); // equal to tails
  t.ok(err3.message.includes("THROW_ID_17"));
  const err32 = t.throws(() => {
    strFindHeadsTails("_%%", "%%_", "_%%", {
      throwWhenSomethingWrongIsDetected: true,
      allowWholeValueToBeOnlyHeadsOrTails: false,
      source: "TEST 3.2"
    });
  }); // equal to tails
  t.notOk(err32.message.includes("THROW_ID_17"));
  t.ok(err32.message.includes("TEST 3.2"));
  t.end();
});

t.test("02.07 - more clashing with outside characters", t => {
  t.same(
    strFindHeadsTails(
      "aaa_%%-bbb-%%_%%-ccc-%%",
      ["%%_", "%%-"],
      ["_%%", "-%%"]
    ),
    [
      {
        headsStartAt: 4,
        headsEndAt: 7,
        tailsStartAt: 10,
        tailsEndAt: 13
      },
      {
        headsStartAt: 14,
        headsEndAt: 17,
        tailsStartAt: 20,
        tailsEndAt: 23
      }
    ],
    "02.07.01"
  );
  t.same(
    strFindHeadsTails(
      "aaa_%%-bbb-%%_%%-ccc-%%",
      ["%%_", "%%-"],
      ["_%%", "-%%"],
      {
        relaxedAPI: true
      }
    ),
    [
      {
        headsStartAt: 4,
        headsEndAt: 7,
        tailsStartAt: 10,
        tailsEndAt: 13
      },
      {
        headsStartAt: 14,
        headsEndAt: 17,
        tailsStartAt: 20,
        tailsEndAt: 23
      }
    ],
    "02.07.02"
  );
  t.end();
});

// -----------------------------------------------------------------------------
// 03. opts.relaxedAPI
// -----------------------------------------------------------------------------

t.test("03.01 - opts.relaxedAPI - input string", t => {
  t.same(
    strFindHeadsTails(undefined, "%%_", "_%%", { relaxedAPI: true }),
    [],
    "03.01.01"
  );
  t.same(
    strFindHeadsTails("", "%%_", "_%%", { relaxedAPI: true }),
    [],
    "03.01.02"
  );
  t.same(
    strFindHeadsTails(null, "%%_", "_%%", { relaxedAPI: true }),
    [],
    "03.01.03"
  );
  t.end();
});

t.test("03.02 - opts.relaxedAPI - heads", t => {
  t.same(
    strFindHeadsTails("aaa", undefined, "_%%", { relaxedAPI: true }),
    [],
    "03.02.01"
  );
  t.same(
    strFindHeadsTails("aaa", "", "_%%", { relaxedAPI: true }),
    [],
    "03.02.02"
  );
  t.same(
    strFindHeadsTails("aaa", [], "_%%", { relaxedAPI: true }),
    [],
    "03.02.03"
  );
  t.same(
    strFindHeadsTails("aaa", [""], "_%%", { relaxedAPI: true }),
    [],
    "03.02.04"
  );
  t.same(
    strFindHeadsTails("aaa", null, "_%%", { relaxedAPI: true }),
    [],
    "03.02.05"
  );
  t.same(
    strFindHeadsTails("aaa", [null], "_%%", { relaxedAPI: true }),
    [],
    "03.02.06"
  );
  t.same(
    strFindHeadsTails(
      "aaa %%_test_%% bbb",
      ["", "%%_", undefined, 1],
      ["_%%", "", null],
      { relaxedAPI: true }
    ),
    [
      {
        headsStartAt: 4,
        headsEndAt: 7,
        tailsStartAt: 11,
        tailsEndAt: 14
      }
    ],
    "03.02.07"
  );
  t.end();
});

t.test("03.03 - opts.relaxedAPI - tails", t => {
  t.same(
    strFindHeadsTails("aaa", "%%_", undefined, { relaxedAPI: true }),
    [],
    "03.03.01"
  );
  t.same(
    strFindHeadsTails("aaa", "%%_", "", { relaxedAPI: true }),
    [],
    "03.03.02"
  );
  t.same(
    strFindHeadsTails("aaa", "%%_", [], { relaxedAPI: true }),
    [],
    "03.03.03"
  );
  t.same(
    strFindHeadsTails("aaa", "%%_", [""], { relaxedAPI: true }),
    [],
    "03.03.04"
  );
  t.same(
    strFindHeadsTails("aaa", "%%_", null, { relaxedAPI: true }),
    [],
    "03.03.05"
  );
  t.same(
    strFindHeadsTails("aaa", "%%_", [null, 1], { relaxedAPI: true }),
    [],
    "03.03.06"
  );
  t.end();
});
