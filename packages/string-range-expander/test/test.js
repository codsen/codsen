const t = require("tap");
const e = require("../dist/string-range-expander.cjs");

// 00. THROWS.
// -----------------------------------------------------------------------------

t.test("00.01 - throws on Boolean input", t => {
  const err = t.throws(() => {
    e(true);
  });
  t.ok(err.message.includes("THROW_ID_01"));
  t.ok(err.message.includes("boolean"));
  t.end();
});

t.test("00.02 - throws on missing input", t => {
  const err = t.throws(() => {
    e();
  });
  t.ok(err.message.includes("THROW_ID_01"));
  t.ok(err.message.includes("missing completely"));
  t.end();
});

t.test("00.03 - throws on null input", t => {
  const err = t.throws(() => {
    e(null);
  });
  t.ok(err.message.includes("THROW_ID_01"));
  t.ok(err.message.includes("null"));
  t.end();
});

t.test("00.03 - throws on string input", t => {
  const err = t.throws(() => {
    e("zzz");
  });
  t.ok(err.message.includes("THROW_ID_01"));
  t.ok(err.message.includes("string"));
  t.end();
});

t.test("00.04 - throws on empty plain object", t => {
  const err = t.throws(() => {
    e({});
  });
  t.ok(err.message.includes("THROW_ID_02"));
  t.ok(err.message.includes("without any keys"));
  t.end();
});

t.test('00.05 - throws when "from" is not a number', t => {
  const err = t.throws(() => {
    e({
      str: "aaa",
      from: "0",
      to: 0
    });
  });
  t.ok(err.message.includes("THROW_ID_03"));
  t.end();
});

t.test('00.06 - throws when "to" is not a number', t => {
  const err = t.throws(() => {
    e({
      str: "aaa",
      from: 0,
      to: "0"
    });
  });
  t.ok(err.message.includes("THROW_ID_04"));
  t.end();
});

t.test('00.07 - throws when "from" is outside the str boundaries', t => {
  const err = t.throws(() => {
    e({
      str: "aaa",
      from: 10,
      to: 20
    });
  });
  t.ok(err.message.includes("THROW_ID_05"));
  t.end();
});

t.test('00.08 - throws when "to" is way outside the str boundaries', t => {
  const err = t.throws(() => {
    e({
      str: "aaa",
      from: 0,
      to: 4
    });
  });
  t.ok(err.message.includes("THROW_ID_06"));

  // but 3 (= str.length) is OK:
  t.doesNotThrow(() => {
    e({
      str: "aaa",
      from: 0,
      to: 3
    });
  });
  t.end();
});

t.test("00.09 - throws when opts.extendToOneSide is unrecognised", t => {
  const err1 = t.throws(() => {
    e({
      str: "aaa",
      from: 1,
      to: 2,
      extendToOneSide: "zzz"
    });
  });
  t.ok(err1.message.includes("THROW_ID_08"));

  const err2 = t.throws(() => {
    e({
      str: "aaa",
      from: 1,
      to: 2,
      extendToOneSide: null
    });
  });
  t.ok(err2.message.includes("THROW_ID_08"));
  t.end();
});

// 01. BAU.
// -----------------------------------------------------------------------------

t.test("01.01 - nothing to expand", t => {
  // reference
  t.same(
    e({
      str: "a     b",
      from: 2,
      to: 5
    }),
    [2, 5],
    "01.01.01"
  );
  t.same(
    e({
      str: "a     b",
      from: 2,
      to: 5,
      addSingleSpaceToPreventAccidentalConcatenation: false
    }),
    [2, 5],
    "01.01.02"
  );
  t.same(
    e({
      str: "a     b",
      from: 2,
      to: 5,
      addSingleSpaceToPreventAccidentalConcatenation: true
    }),
    [2, 5],
    "01.01.03"
  );

  //
  // middle
  // --------------
  t.same(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 5
    }),
    [2, 5],
    "01.01.04 - addSingleSpaceToPreventAccidentalConcatenation default"
  );
  t.same(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 5,
      addSingleSpaceToPreventAccidentalConcatenation: false
    }),
    [2, 5],
    "01.01.05 - addSingleSpaceToPreventAccidentalConcatenation hardcoded default"
  );
  t.same(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 5,
      addSingleSpaceToPreventAccidentalConcatenation: true
    }),
    [2, 5, " "],
    "01.01.06"
  );

  //
  // touches start EOL
  // --------------
  t.same(
    e({
      str: "aaaaaaaaaaaa",
      from: 0,
      to: 5
    }),
    [0, 5],
    "01.01.07"
  );
  t.same(
    e({
      str: "aaaaaaaaaaaa",
      from: 0,
      to: 5,
      addSingleSpaceToPreventAccidentalConcatenation: false
    }),
    [0, 5],
    "01.01.08"
  );
  t.same(
    e({
      str: "aaaaaaaaaaaa",
      from: 0,
      to: 5,
      addSingleSpaceToPreventAccidentalConcatenation: true
    }),
    [0, 5],
    "01.01.09 - does not add space if touching EOL"
  );

  //
  // touches end EOL
  // --------------
  t.same(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 12
    }),
    [2, 12],
    "01.01.10"
  );
  t.same(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 12,
      addSingleSpaceToPreventAccidentalConcatenation: false
    }),
    [2, 12],
    "01.01.11"
  );
  t.same(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 12,
      addSingleSpaceToPreventAccidentalConcatenation: true
    }),
    [2, 12],
    "01.01.12"
  );

  //
  // touches both EOLS's
  // --------------
  t.same(
    e({
      str: "aaaaaaaaaaaa",
      from: 12,
      to: 12
    }),
    [12, 12],
    "01.01.13"
  );
  t.same(
    e({
      str: "aaaaaaaaaaaa",
      from: 12,
      to: 12,
      addSingleSpaceToPreventAccidentalConcatenation: false
    }),
    [12, 12],
    "01.01.14"
  );
  t.same(
    e({
      str: "aaaaaaaaaaaa",
      from: 12,
      to: 12,
      addSingleSpaceToPreventAccidentalConcatenation: true
    }),
    [12, 12],
    "01.01.15"
  );

  //
  // combo with wipe
  // --------------
  t.same(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 5,
      wipeAllWhitespaceOnLeft: true
    }),
    [2, 5],
    "01.01.16"
  );
  t.same(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 5,
      wipeAllWhitespaceOnLeft: true,
      addSingleSpaceToPreventAccidentalConcatenation: false
    }),
    [2, 5],
    "01.01.17 - hardcoded addSingleSpaceToPreventAccidentalConcatenation default"
  );
  t.same(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 5,
      wipeAllWhitespaceOnLeft: true,
      addSingleSpaceToPreventAccidentalConcatenation: true
    }),
    [2, 5, " "],
    "01.01.18 - combo, no whitespace"
  );
  t.end();
});

t.test("01.02 - expanding from the middle of a gap", t => {
  t.same(
    e({
      str: "a     b",
      from: 3,
      to: 3
    }),
    [2, 5],
    "01.02.01"
  );
  t.same(
    e({
      str: "a     b",
      from: 2,
      to: 3
    }),
    [2, 5],
    "01.02.02"
  );
  t.same(
    e({
      str: "a     b",
      from: 3,
      to: 5
    }),
    [2, 5],
    "01.02.03"
  );
  t.same(
    e({
      str: "a     b",
      from: 1,
      to: 3
    }),
    [1, 5],
    "01.02.04"
  );
  t.same(
    e({
      str: "a     b",
      from: 3,
      to: 6
    }),
    [2, 6],
    "01.02.05"
  );
  t.same(
    e({
      str: "a     b",
      from: 3,
      to: 6,
      wipeAllWhitespaceOnLeft: false
    }),
    [2, 6],
    "01.02.06"
  );
  t.same(
    e({
      str: "a     b",
      from: 3,
      to: 4,
      wipeAllWhitespaceOnLeft: true
    }),
    [1, 5],
    "01.02.07"
  );
  t.same(
    e({
      str: "a     b",
      from: 3,
      to: 6,
      wipeAllWhitespaceOnLeft: true
    }),
    [1, 6],
    "01.02.08"
  );
  t.same(
    e({
      str: "a     b",
      from: 3,
      to: 4,
      wipeAllWhitespaceOnRight: true
    }),
    [2, 6],
    "01.02.09"
  );
  t.same(
    e({
      str: "a     b",
      from: 3,
      to: 6,
      wipeAllWhitespaceOnRight: true
    }),
    [2, 6],
    "01.02.10"
  );
  t.same(
    e({
      str: "a     b",
      from: 3,
      to: 6,
      wipeAllWhitespaceOnLeft: true,
      wipeAllWhitespaceOnRight: true
    }),
    [1, 6],
    "01.02.11"
  );
  t.same(
    e({
      str: "a     b",
      from: 1,
      to: 6,
      wipeAllWhitespaceOnLeft: true,
      wipeAllWhitespaceOnRight: true
    }),
    [1, 6],
    "01.02.12"
  );
  t.same(
    e({
      str: "a     b",
      from: 1,
      to: 6,
      wipeAllWhitespaceOnLeft: false,
      wipeAllWhitespaceOnRight: false
    }),
    [1, 6],
    "01.02.13"
  );
  t.end();
});

t.test(
  "01.03 - starting point is touching the edge (non-whitespace) even though tight cropping is not enabled",
  t => {
    t.same(
      e({
        str: "a     b",
        from: 1,
        to: 3
      }),
      [1, 5],
      "01.03.01"
    );
    t.same(
      e({
        str: "a     b",
        from: 3,
        to: 6
      }),
      [2, 6],
      "01.03.02"
    );
    t.same(
      e({
        str: "a     b",
        from: 2,
        to: 6
      }),
      [2, 6],
      "01.03.03"
    );
    t.same(
      e({
        str: "a     b",
        from: 1,
        to: 6
      }),
      [1, 6],
      "01.03.04"
    );
    t.end();
  }
);

t.test("01.04 - both ends are equal", t => {
  t.same(
    e({
      str: "ab",
      from: 1,
      to: 1
    }),
    [1, 1],
    "01.04.01"
  );
  t.same(
    e({
      str: "ab",
      from: 2,
      to: 2
    }),
    [2, 2],
    "01.04.02"
  );
  t.end();
});

t.test("01.05 - addSingleSpaceToPreventAccidentalConcatenation", t => {
  t.same(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6
    }),
    [5, 6],
    "01.05.01"
  );

  // wipeAllWhitespaceOnLeft
  t.same(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
      wipeAllWhitespaceOnLeft: false
    }),
    [5, 6],
    "01.05.02 - wipeAllWhitespaceOnLeft hardcoded default"
  );
  t.same(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
      wipeAllWhitespaceOnLeft: true
    }),
    [5, 6],
    "01.05.03 - wipeAllWhitespaceOnLeft on"
  );

  // addSingleSpaceToPreventAccidentalConcatenation
  t.same(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
      addSingleSpaceToPreventAccidentalConcatenation: false
    }),
    [5, 6],
    "01.05.04"
  );
  t.same(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
      addSingleSpaceToPreventAccidentalConcatenation: true
    }),
    [5, 6, " "],
    "01.05.05 - combo, no whitespace"
  );

  // combo
  t.same(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
      wipeAllWhitespaceOnLeft: true,
      addSingleSpaceToPreventAccidentalConcatenation: true
    }),
    [5, 6, " "],
    "01.05.06 - true-true"
  );
  t.same(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
      wipeAllWhitespaceOnLeft: true,
      addSingleSpaceToPreventAccidentalConcatenation: false
    }),
    [5, 6],
    "01.05.07 - true-false"
  );
  t.same(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
      wipeAllWhitespaceOnLeft: false,
      addSingleSpaceToPreventAccidentalConcatenation: true
    }),
    [5, 6, " "],
    "01.05.08 - false-true"
  );
  t.same(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
      wipeAllWhitespaceOnLeft: false,
      addSingleSpaceToPreventAccidentalConcatenation: false
    }),
    [5, 6],
    "01.05.09 - false-false"
  );
  t.end();
});

t.test(
  "01.06 - wipeAllWhitespaceOnLeft + addSingleSpaceToPreventAccidentalConcatenation",
  t => {
    t.same(
      e({
        str: "aaaaa  bbbbb",
        from: 6,
        to: 7,
        wipeAllWhitespaceOnLeft: false,
        addSingleSpaceToPreventAccidentalConcatenation: false
      }),
      [6, 7],
      "01.06.01"
    );
    t.same(
      e({
        str: "aaaaa  bbbbb",
        from: 6,
        to: 7,
        wipeAllWhitespaceOnLeft: false,
        addSingleSpaceToPreventAccidentalConcatenation: true
      }),
      [6, 7],
      "01.06.02"
    );
    t.same(
      e({
        str: "aaaaa  bbbbb",
        from: 6,
        to: 7,
        wipeAllWhitespaceOnLeft: true,
        addSingleSpaceToPreventAccidentalConcatenation: false
      }),
      [5, 7],
      "01.06.03"
    );
    t.same(
      e({
        str: "aaaaa  bbbbb",
        from: 6,
        to: 7,
        wipeAllWhitespaceOnLeft: true,
        addSingleSpaceToPreventAccidentalConcatenation: true
      }),
      [5, 7, " "],
      "01.06.04"
    );
    t.end();
  }
);

t.test(
  "01.07 - wipeAllWhitespaceOnRight + addSingleSpaceToPreventAccidentalConcatenation",
  t => {
    t.same(
      e({
        str: "aaaaa  bbbbb",
        from: 5,
        to: 6,
        wipeAllWhitespaceOnRight: false,
        addSingleSpaceToPreventAccidentalConcatenation: false
      }),
      [5, 6],
      "01.07.01"
    );
    t.same(
      e({
        str: "aaaaa  bbbbb",
        from: 5,
        to: 6,
        wipeAllWhitespaceOnRight: false,
        addSingleSpaceToPreventAccidentalConcatenation: true
      }),
      [5, 6],
      "01.07.02"
    );
    t.same(
      e({
        str: "aaaaa  bbbbb",
        from: 5,
        to: 6,
        wipeAllWhitespaceOnRight: true,
        addSingleSpaceToPreventAccidentalConcatenation: false
      }),
      [5, 7],
      "01.07.03"
    );
    t.same(
      e({
        str: "aaaaa  bbbbb",
        from: 5,
        to: 6,
        wipeAllWhitespaceOnRight: true,
        addSingleSpaceToPreventAccidentalConcatenation: true
      }),
      [5, 7, " "],
      "01.07.04"
    );
    t.end();
  }
);

t.test(
  "01.08 - wipeAllWhitespaceOnLeft + wipeAllWhitespaceOnRight + addSingleSpaceToPreventAccidentalConcatenation",
  t => {
    t.same(
      e({
        str: "aaaaa   bbbbb",
        from: 6,
        to: 7,
        wipeAllWhitespaceOnRight: false,
        addSingleSpaceToPreventAccidentalConcatenation: false
      }),
      [6, 7],
      "01.08.01"
    );
    t.same(
      e({
        str: "aaaaa   bbbbb",
        from: 6,
        to: 7,
        wipeAllWhitespaceOnLeft: true,
        addSingleSpaceToPreventAccidentalConcatenation: false
      }),
      [5, 7],
      "01.08.02"
    );
    t.same(
      e({
        str: "aaaaa   bbbbb",
        from: 6,
        to: 7,
        wipeAllWhitespaceOnRight: true,
        addSingleSpaceToPreventAccidentalConcatenation: false
      }),
      [6, 8],
      "01.08.03"
    );

    // both on result in tight crop:
    t.same(
      e({
        str: "aaaaa   bbbbb",
        from: 6,
        to: 7,
        wipeAllWhitespaceOnLeft: true,
        wipeAllWhitespaceOnRight: true,
        addSingleSpaceToPreventAccidentalConcatenation: false
      }),
      [5, 8],
      "01.08.04"
    );

    t.same(
      e({
        str: "aaaaa   bbbbb",
        from: 6,
        to: 7,
        wipeAllWhitespaceOnLeft: true,
        wipeAllWhitespaceOnRight: true,
        addSingleSpaceToPreventAccidentalConcatenation: true
      }),
      [5, 8, " "],
      "01.08.05"
    );
    t.end();
  }
);

t.test("01.09 - addSingleSpaceToPreventAccidentalConcatenation ignored", t => {
  t.same(
    e({
      str: "<strong><!-- --></strong>",
      from: 8,
      to: 16,
      addSingleSpaceToPreventAccidentalConcatenation: false
    }),
    [8, 16],
    "01.09.01 - baseline"
  );
  t.same(
    e({
      str: "<strong><!-- --></strong>",
      from: 8,
      to: 16,
      addSingleSpaceToPreventAccidentalConcatenation: true
    }),
    [8, 16],
    "01.09.02.01 - non digits and non letters"
  );
  t.same(
    e({
      str: "a<!-- -->b",
      from: 1,
      to: 9,
      addSingleSpaceToPreventAccidentalConcatenation: true
    }),
    [1, 9, " "],
    "01.09.02.02 - letters"
  );
  t.same(
    e({
      str: "<zzz><!-- -->b",
      from: 5,
      to: 13,
      addSingleSpaceToPreventAccidentalConcatenation: true
    }),
    [5, 13, " "],
    "01.09.02.03 - letter on one side"
  );
  t.same(
    e({
      str: "<strong><!-- --></strong>",
      from: 8,
      to: 16,
      addSingleSpaceToPreventAccidentalConcatenation: true,
      ifLeftSideIncludesThisThenCropTightly: ">",
      ifRightSideIncludesThisThenCropTightly: "<"
    }),
    [8, 16],
    "01.09.03"
  );
  t.same(
    e({
      str: "<strong><!-- -->a</strong>",
      from: 8,
      to: 16,
      addSingleSpaceToPreventAccidentalConcatenation: true,
      ifLeftSideIncludesThisThenCropTightly: ">",
      ifRightSideIncludesThisThenCropTightly: "<"
    }),
    [8, 16, " "],
    "01.09.04"
  );
  t.same(
    e({
      str: "<strong>a<!-- --></strong>",
      from: 9,
      to: 17,
      addSingleSpaceToPreventAccidentalConcatenation: true,
      ifLeftSideIncludesThisThenCropTightly: ">",
      ifRightSideIncludesThisThenCropTightly: "<"
    }),
    [9, 17, " "],
    "01.09.05"
  );
  t.same(
    e({
      str: "<strong>a<!-- -->a</strong>",
      from: 9,
      to: 17,
      addSingleSpaceToPreventAccidentalConcatenation: true,
      ifLeftSideIncludesThisThenCropTightly: ">",
      ifRightSideIncludesThisThenCropTightly: "<"
    }),
    [9, 17, " "],
    "01.09.06"
  );

  // AND...

  t.same(
    e({
      str: "<strong>  <!-- -->  </strong>",
      from: 10,
      to: 18,
      addSingleSpaceToPreventAccidentalConcatenation: true,
      ifLeftSideIncludesThisThenCropTightly: ">",
      ifRightSideIncludesThisThenCropTightly: "<"
    }),
    [8, 20],
    "01.09.07"
  );
  t.same(
    e({
      str: "<strong>  <!-- --></strong>",
      from: 10,
      to: 18,
      addSingleSpaceToPreventAccidentalConcatenation: true,
      ifLeftSideIncludesThisThenCropTightly: ">",
      ifRightSideIncludesThisThenCropTightly: "<"
    }),
    [8, 18],
    "01.09.08"
  );
  t.same(
    e({
      str: "<strong><!-- -->  </strong>",
      from: 8,
      to: 16,
      addSingleSpaceToPreventAccidentalConcatenation: true,
      ifLeftSideIncludesThisThenCropTightly: ">",
      ifRightSideIncludesThisThenCropTightly: "<"
    }),
    [8, 18],
    "01.09.09"
  );
  t.end();
});

// 02. opts.ifLeftSideIncludesThisThenCropTightly
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${33}m${`opts.ifLeftSideIncludesThisThenCropTightly`}\u001b[${39}m`} - normal use, both sides extended`,
  t => {
    t.same(
      e({
        str: "a>     <b",
        from: 3,
        to: 6,
        ifLeftSideIncludesThisThenCropTightly: ">"
      }),
      [2, 7],
      "02.01.01"
    );
    t.same(
      e({
        str: "a>     <b",
        from: 2,
        to: 6,
        ifLeftSideIncludesThisThenCropTightly: ">"
      }),
      [2, 7],
      "02.01.02"
    );
    t.same(
      e({
        str: "a>     <b",
        from: 3,
        to: 7,
        ifLeftSideIncludesThisThenCropTightly: ">"
      }),
      [2, 7],
      "02.01.03"
    );
    t.same(
      e({
        str: "a>     <b",
        from: 2,
        to: 7,
        ifLeftSideIncludesThisThenCropTightly: ">"
      }),
      [2, 7],
      "02.01.04"
    );
    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${33}m${`opts.ifLeftSideIncludesThisThenCropTightly`}\u001b[${39}m`} - normal use, mismatching value`,
  t => {
    t.same(
      e({
        str: "a>     <b",
        from: 5,
        to: 5,
        ifLeftSideIncludesThisThenCropTightly: "z"
      }),
      [3, 6],
      "02.02.01"
    );
    t.same(
      e({
        str: "a>     <b",
        from: 4,
        to: 5,
        ifLeftSideIncludesThisThenCropTightly: "z"
      }),
      [3, 6],
      "02.02.02"
    );
    t.same(
      e({
        str: "a>     <b",
        from: 3,
        to: 6,
        ifLeftSideIncludesThisThenCropTightly: "z"
      }),
      [3, 6],
      "02.02.03"
    );
    t.same(
      e({
        str: "a>     <b",
        from: 2,
        to: 6,
        ifLeftSideIncludesThisThenCropTightly: "z"
      }),
      [2, 6],
      "02.02.04"
    );
    t.same(
      e({
        str: "a>     <b",
        from: 3,
        to: 7,
        ifLeftSideIncludesThisThenCropTightly: "z"
      }),
      [3, 7],
      "02.02.05"
    );
    t.same(
      e({
        str: "a>     <b",
        from: 2,
        to: 7,
        ifLeftSideIncludesThisThenCropTightly: "z"
      }),
      [2, 7],
      "02.02.06"
    );
    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${33}m${`opts.ifLeftSideIncludesThisThenCropTightly`}\u001b[${39}m`} - range within characters, no whitespace`,
  t => {
    t.same(
      e({
        str: "aaaaaaaaaaaaa",
        from: 5,
        to: 5,
        ifLeftSideIncludesThisThenCropTightly: "z"
      }),
      [5, 5],
      "02.03.01"
    );
    t.same(
      e({
        str: "aaaaaaaaaaaaa",
        from: 5,
        to: 5,
        ifLeftSideIncludesThisThenCropTightly: "a"
      }),
      [5, 5],
      "02.03.02"
    );
    t.same(
      e({
        str: "-aaaaaaaaaaaaa-",
        from: 5,
        to: 5,
        ifLeftSideIncludesThisThenCropTightly: "a"
      }),
      [5, 5],
      "02.03.03"
    );
    t.end();
  }
);

// 03. opts.ifRightSideIncludesThisThenCropTightly
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${33}m${`opts.ifRightSideIncludesThisThenCropTightly`}\u001b[${39}m`} - normal use, both sides extended`,
  t => {
    t.same(
      e({
        str: "a>     <b",
        from: 3,
        to: 6,
        ifRightSideIncludesThisThenCropTightly: "<"
      }),
      [2, 7],
      "03.01.01"
    );
    t.same(
      e({
        str: "a>     <b",
        from: 2,
        to: 6,
        ifRightSideIncludesThisThenCropTightly: "<"
      }),
      [2, 7],
      "03.01.02"
    );
    t.same(
      e({
        str: "a>     <b",
        from: 3,
        to: 7,
        ifRightSideIncludesThisThenCropTightly: "<"
      }),
      [2, 7],
      "03.01.03"
    );
    t.same(
      e({
        str: "a>     <b",
        from: 2,
        to: 7,
        ifRightSideIncludesThisThenCropTightly: "<"
      }),
      [2, 7],
      "03.01.04"
    );
    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${33}m${`opts.ifRightSideIncludesThisThenCropTightly`}\u001b[${39}m`} - normal use, mismatching value`,
  t => {
    t.same(
      e({
        str: "a>     <b",
        from: 5,
        to: 5,
        ifRightSideIncludesThisThenCropTightly: "z"
      }),
      [3, 6],
      "03.02.01"
    );
    t.same(
      e({
        str: "a>     <b",
        from: 4,
        to: 5,
        ifRightSideIncludesThisThenCropTightly: "z"
      }),
      [3, 6],
      "03.02.02"
    );
    t.same(
      e({
        str: "a>     <b",
        from: 3,
        to: 6,
        ifRightSideIncludesThisThenCropTightly: "z"
      }),
      [3, 6],
      "03.02.03"
    );
    t.same(
      e({
        str: "a>     <b",
        from: 2,
        to: 6,
        ifRightSideIncludesThisThenCropTightly: "z"
      }),
      [2, 6],
      "03.02.04"
    );
    t.same(
      e({
        str: "a>     <b",
        from: 3,
        to: 7,
        ifRightSideIncludesThisThenCropTightly: "z"
      }),
      [3, 7],
      "03.02.05"
    );
    t.same(
      e({
        str: "a>     <b",
        from: 2,
        to: 7,
        ifRightSideIncludesThisThenCropTightly: "z"
      }),
      [2, 7],
      "03.02.06"
    );
    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${33}m${`opts.ifRightSideIncludesThisThenCropTightly`}\u001b[${39}m`} - range within characters, no whitespace`,
  t => {
    t.same(
      e({
        str: "aaaaaaaaaaaaa",
        from: 5,
        to: 5,
        ifRightSideIncludesThisThenCropTightly: "z"
      }),
      [5, 5],
      "03.03.01"
    );
    t.same(
      e({
        str: "aaaaaaaaaaaaa",
        from: 5,
        to: 5,
        ifRightSideIncludesThisThenCropTightly: "a"
      }),
      [5, 5],
      "03.03.02"
    );
    t.same(
      e({
        str: "-aaaaaaaaaaaaa-",
        from: 5,
        to: 5,
        ifRightSideIncludesThisThenCropTightly: "a"
      }),
      [5, 5],
      "03.03.03"
    );
    t.end();
  }
);

// 04. combos with opts.if***SideIncludesThisCropItToo
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${33}m${`opts.ifLeftSideIncludesThisCropItToo`}\u001b[${39}m`} - combo with tight crop`,
  t => {
    t.same(
      e({
        str: "something>\n\t    zzzz <here",
        from: 16,
        to: 20,
        ifRightSideIncludesThisThenCropTightly: "<"
      }),
      [10, 21],
      "04.01.01 - control #1"
    );
    t.same(
      e({
        str: "something>\n\t    zzzz <here",
        from: 16,
        to: 20,
        ifLeftSideIncludesThisCropItToo: "\n\t"
      }),
      [10, 20],
      "04.01.02 - control #2"
    );
    t.same(
      e({
        str: "something>\n\t    zzzz <here",
        from: 16,
        to: 20,
        ifLeftSideIncludesThisCropItToo: "\n\t",
        ifRightSideIncludesThisThenCropTightly: "<"
      }),
      [10, 21],
      "04.01.03"
    );
    t.same(
      e({
        str: "something> a    zzzz <here",
        from: 16,
        to: 20,
        ifRightSideIncludesThisThenCropTightly: "<",
        ifLeftSideIncludesThisThenCropTightly: ">"
      }),
      [12, 21],
      "04.01.04"
    );
    t.same(
      e({
        str: "something> a    zzzz <here",
        from: 16,
        to: 20,
        ifRightSideIncludesThisThenCropTightly: "<",
        ifLeftSideIncludesThisCropItToo: "a",
        ifLeftSideIncludesThisThenCropTightly: ">"
      }),
      [10, 21],
      "04.01.05"
    );
    t.same(
      e({
        str: "something> a    zzzz <here",
        from: 16,
        to: 20,
        ifLeftSideIncludesThisCropItToo: "a",
        ifLeftSideIncludesThisThenCropTightly: ">"
      }),
      [10, 21],
      "04.01.06"
    );
    t.end();
  }
);

// 05. extendToOneSide
// -----------------------------------------------------------------------------

t.test(
  `05.01 - ${`\u001b[${33}m${`opts.extendToOneSide`}\u001b[${39}m`} - one side only`,
  t => {
    t.same(
      e({
        str: "a>     <b",
        from: 4,
        to: 5
      }),
      [3, 6],
      "05.01.01 - default, a control"
    );
    t.same(
      e({
        str: "a>     <b",
        from: 4,
        to: 5,
        extendToOneSide: false
      }),
      [3, 6],
      "05.01.02 - hardcoded default"
    );
    t.same(
      e({
        str: "a>     <b",
        from: 4,
        to: 5,
        extendToOneSide: "right"
      }),
      [4, 6],
      "05.01.03 - right only"
    );
    t.same(
      e({
        str: "a>     <b",
        from: 4,
        to: 5,
        extendToOneSide: "left"
      }),
      [3, 5],
      "05.01.04 - left only"
    );
    t.end();
  }
);

// 06. opts.wipeAllWhitespaceOnLeft & opts.wipeAllWhitespaceOnRight
// -----------------------------------------------------------------------------

t.test(
  `06.01 - ${`\u001b[${33}m${`opts.wipeAllWhitespaceOnLeft`}\u001b[${39}m`} - extends to both sides`,
  t => {
    t.same(
      e({
        str: "a>     <b",
        from: 4,
        to: 5
      }),
      [3, 6],
      "06.01.01 - a control"
    );
    t.same(
      e({
        str: "a>     <b",
        from: 4,
        to: 5,
        wipeAllWhitespaceOnLeft: true
      }),
      [2, 6],
      "06.01.02 - left"
    );
    t.same(
      e({
        str: "a>     <b",
        from: 4,
        to: 5,
        wipeAllWhitespaceOnRight: true
      }),
      [3, 7],
      "06.01.03 - right"
    );
    t.same(
      e({
        str: "a>     <b",
        from: 4,
        to: 5,
        wipeAllWhitespaceOnLeft: true,
        wipeAllWhitespaceOnRight: true
      }),
      [2, 7],
      "06.01.04 - both"
    );
    t.end();
  }
);

// 07. Various
// -----------------------------------------------------------------------------

t.test(`07.01 - ${`\u001b[${36}m${`various`}\u001b[${39}m`} - adhoc #1`, t => {
  const str = `<head>
<style type="text/css">
  aa, .unused[z], bb {z:2;}
</style>
</head>
<body id   =   ""  ><a class  =  "" >z</a>
</body>`;

  t.same(
    e({
      str,
      from: 82,
      to: 93,
      ifRightSideIncludesThisThenCropTightly: "/>",
      wipeAllWhitespaceOnLeft: true
    }),
    [81, 95],
    "07.01"
  );
  t.end();
});

t.test(`07.02 - ${`\u001b[${36}m${`various`}\u001b[${39}m`} - adhoc #2`, t => {
  const str = `<head>
<style>
  @media screen {.col-1,.col-2 {z: y;}}
</style>
</head>
<body>z
</body>`;

  t.same(
    e({
      str,
      from: 32,
      to: 38,
      ifRightSideIncludesThisCropItToo: ",",
      ifRightSideIncludesThisThenCropTightly: ".#",
      extendToOneSide: "right"
    }),
    [32, 39],
    "07.02"
  );
  t.end();
});

t.test(`07.03 - ${`\u001b[${36}m${`various`}\u001b[${39}m`} - adhoc #3`, t => {
  const str = `<head>
<style>
  @media screen {.col-1,.col-2 {z: y;}}
</style>
</head>
<body>z
</body>`;

  t.same(
    e({
      str,
      from: 39,
      to: 45,
      ifLeftSideIncludesThisCropItToo: ",",
      ifLeftSideIncludesThisThenCropTightly: ".#",
      extendToOneSide: "left"
    }),
    [38, 45],
    "07.03"
  );
  t.end();
});

// -----------------------------------------------------------------------------

//             ▄▄ ▄████▄▐▄▄▄▌
//            ▐  ████▀███▄█▄▌
//          ▐ ▌  █▀▌  ▐▀▌▀█▀
//           ▀   ▌ ▌  ▐ ▌
//               ▌ ▌  ▐ ▌
//               █ █  ▐▌█ me eatz bugz
