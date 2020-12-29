import tap from "tap";
import { expander as e } from "../dist/string-range-expander.esm";

// 00. THROWS.
// -----------------------------------------------------------------------------

tap.test("01 - throws on Boolean input", (t) => {
  t.throws(() => {
    e(true);
  }, /THROW_ID_01/);
  t.end();
});

tap.test("02 - throws on missing input", (t) => {
  t.throws(() => {
    e();
  }, /missing completely/);
  t.end();
});

tap.test("03 - throws on null input", (t) => {
  t.throws(() => {
    e(null);
  }, /THROW_ID_01/);
  t.end();
});

tap.test("04 - throws on string input", (t) => {
  t.throws(() => {
    e("zzz");
  }, /THROW_ID_01/);
  t.end();
});

tap.test("05 - throws on empty plain object", (t) => {
  t.throws(() => {
    e({});
  }, /THROW_ID_02/);
  t.end();
});

tap.test('06 - throws when "from" is not a number', (t) => {
  t.throws(() => {
    e({
      str: "aaa",
      from: "0",
      to: 0,
    });
  }, /THROW_ID_03/);
  t.end();
});

tap.test('07 - throws when "to" is not a number', (t) => {
  t.throws(() => {
    e({
      str: "aaa",
      from: 0,
      to: "0",
    });
  }, /THROW_ID_04/);
  t.end();
});

tap.test('08 - throws when "from" is outside the str boundaries', (t) => {
  t.throws(() => {
    e({
      str: "aaa",
      from: 10,
      to: 20,
    });
  }, /THROW_ID_05/);
  t.end();
});

tap.test('09 - throws when "to" is way outside the str boundaries', (t) => {
  t.throws(() => {
    e({
      str: "aaa",
      from: 0,
      to: 4,
    });
  }, /THROW_ID_06/);

  // but 3 (= str.length) is OK:
  t.doesNotThrow(() => {
    e({
      str: "aaa",
      from: 0,
      to: 3,
    });
  }, "09.02");
  t.end();
});

tap.test("10 - throws when opts.extendToOneSide is unrecognised", (t) => {
  t.throws(() => {
    e({
      str: "aaa",
      from: 1,
      to: 2,
      extendToOneSide: "zzz",
    });
  }, /THROW_ID_08/);

  t.throws(() => {
    e({
      str: "aaa",
      from: 1,
      to: 2,
      extendToOneSide: null,
    });
  }, /THROW_ID_08/);

  t.end();
});

// 01. BAU.
// -----------------------------------------------------------------------------

tap.test("11 - nothing to expand", (t) => {
  // reference
  t.strictSame(
    e({
      str: "a     b",
      from: 2,
      to: 5,
    }),
    [2, 5],
    "11.01"
  );
  t.strictSame(
    e({
      str: "a     b",
      from: 2,
      to: 5,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [2, 5],
    "11.02"
  );
  t.strictSame(
    e({
      str: "a     b",
      from: 2,
      to: 5,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [2, 5],
    "11.03"
  );

  //
  // middle
  // --------------
  t.strictSame(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 5,
    }),
    [2, 5],
    "11.04 - addSingleSpaceToPreventAccidentalConcatenation default"
  );
  t.strictSame(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 5,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [2, 5],
    "11.05 - addSingleSpaceToPreventAccidentalConcatenation hardcoded default"
  );
  t.strictSame(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 5,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [2, 5, " "],
    "11.06"
  );

  //
  // touches start EOL
  // --------------
  t.strictSame(
    e({
      str: "aaaaaaaaaaaa",
      from: 0,
      to: 5,
    }),
    [0, 5],
    "11.07"
  );
  t.strictSame(
    e({
      str: "aaaaaaaaaaaa",
      from: 0,
      to: 5,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [0, 5],
    "11.08"
  );
  t.strictSame(
    e({
      str: "aaaaaaaaaaaa",
      from: 0,
      to: 5,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [0, 5],
    "11.09 - does not add space if touching EOL"
  );

  //
  // touches end EOL
  // --------------
  t.strictSame(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 12,
    }),
    [2, 12],
    "11.10"
  );
  t.strictSame(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 12,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [2, 12],
    "11.11"
  );
  t.strictSame(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 12,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [2, 12],
    "11.12"
  );

  //
  // touches both EOLS's
  // --------------
  t.strictSame(
    e({
      str: "aaaaaaaaaaaa",
      from: 12,
      to: 12,
    }),
    [12, 12],
    "11.13"
  );
  t.strictSame(
    e({
      str: "aaaaaaaaaaaa",
      from: 12,
      to: 12,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [12, 12],
    "11.14"
  );
  t.strictSame(
    e({
      str: "aaaaaaaaaaaa",
      from: 12,
      to: 12,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [12, 12],
    "11.15"
  );

  //
  // combo with wipe
  // --------------
  t.strictSame(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 5,
      wipeAllWhitespaceOnLeft: true,
    }),
    [2, 5],
    "11.16"
  );
  t.strictSame(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 5,
      wipeAllWhitespaceOnLeft: true,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [2, 5],
    "11.17 - hardcoded addSingleSpaceToPreventAccidentalConcatenation default"
  );
  t.strictSame(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 5,
      wipeAllWhitespaceOnLeft: true,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [2, 5, " "],
    "11.18 - combo, no whitespace"
  );
  t.end();
});

tap.test("12 - expanding from the middle of a gap", (t) => {
  t.strictSame(
    e({
      str: "a     b",
      from: 3,
      to: 3,
    }),
    [2, 5],
    "12.01"
  );
  t.strictSame(
    e({
      str: "a     b",
      from: 2,
      to: 3,
    }),
    [2, 5],
    "12.02"
  );
  t.strictSame(
    e({
      str: "a     b",
      from: 3,
      to: 5,
    }),
    [2, 5],
    "12.03"
  );
  t.strictSame(
    e({
      str: "a     b",
      from: 1,
      to: 3,
    }),
    [1, 5],
    "12.04"
  );
  t.strictSame(
    e({
      str: "a     b",
      from: 3,
      to: 6,
    }),
    [2, 6],
    "12.05"
  );
  t.strictSame(
    e({
      str: "a     b",
      from: 3,
      to: 6,
      wipeAllWhitespaceOnLeft: false,
    }),
    [2, 6],
    "12.06"
  );
  t.strictSame(
    e({
      str: "a     b",
      from: 3,
      to: 4,
      wipeAllWhitespaceOnLeft: true,
    }),
    [1, 5],
    "12.07"
  );
  t.strictSame(
    e({
      str: "a     b",
      from: 3,
      to: 6,
      wipeAllWhitespaceOnLeft: true,
    }),
    [1, 6],
    "12.08"
  );
  t.strictSame(
    e({
      str: "a     b",
      from: 3,
      to: 4,
      wipeAllWhitespaceOnRight: true,
    }),
    [2, 6],
    "12.09"
  );
  t.strictSame(
    e({
      str: "a     b",
      from: 3,
      to: 6,
      wipeAllWhitespaceOnRight: true,
    }),
    [2, 6],
    "12.10"
  );
  t.strictSame(
    e({
      str: "a     b",
      from: 3,
      to: 6,
      wipeAllWhitespaceOnLeft: true,
      wipeAllWhitespaceOnRight: true,
    }),
    [1, 6],
    "12.11"
  );
  t.strictSame(
    e({
      str: "a     b",
      from: 1,
      to: 6,
      wipeAllWhitespaceOnLeft: true,
      wipeAllWhitespaceOnRight: true,
    }),
    [1, 6],
    "12.12"
  );
  t.strictSame(
    e({
      str: "a     b",
      from: 1,
      to: 6,
      wipeAllWhitespaceOnLeft: false,
      wipeAllWhitespaceOnRight: false,
    }),
    [1, 6],
    "12.13"
  );
  t.end();
});

tap.test(
  "13 - starting point is touching the edge (non-whitespace) even though tight cropping is not enabled",
  (t) => {
    t.strictSame(
      e({
        str: "a     b",
        from: 1,
        to: 3,
      }),
      [1, 5],
      "13.01"
    );
    t.strictSame(
      e({
        str: "a     b",
        from: 3,
        to: 6,
      }),
      [2, 6],
      "13.02"
    );
    t.strictSame(
      e({
        str: "a     b",
        from: 2,
        to: 6,
      }),
      [2, 6],
      "13.03"
    );
    t.strictSame(
      e({
        str: "a     b",
        from: 1,
        to: 6,
      }),
      [1, 6],
      "13.04"
    );
    t.end();
  }
);

tap.test("14 - both ends are equal", (t) => {
  t.strictSame(
    e({
      str: "ab",
      from: 1,
      to: 1,
    }),
    [1, 1],
    "14.01"
  );
  t.strictSame(
    e({
      str: "ab",
      from: 2,
      to: 2,
    }),
    [2, 2],
    "14.02"
  );
  t.end();
});

tap.test("15 - addSingleSpaceToPreventAccidentalConcatenation", (t) => {
  t.strictSame(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
    }),
    [5, 6],
    "15.01"
  );

  // wipeAllWhitespaceOnLeft
  t.strictSame(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
      wipeAllWhitespaceOnLeft: false,
    }),
    [5, 6],
    "15.02 - wipeAllWhitespaceOnLeft hardcoded default"
  );
  t.strictSame(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
      wipeAllWhitespaceOnLeft: true,
    }),
    [5, 6],
    "15.03 - wipeAllWhitespaceOnLeft on"
  );

  // addSingleSpaceToPreventAccidentalConcatenation
  t.strictSame(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [5, 6],
    "15.04"
  );
  t.strictSame(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [5, 6, " "],
    "15.05 - combo, no whitespace"
  );

  // combo
  t.strictSame(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
      wipeAllWhitespaceOnLeft: true,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [5, 6, " "],
    "15.06 - true-true"
  );
  t.strictSame(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
      wipeAllWhitespaceOnLeft: true,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [5, 6],
    "15.07 - true-false"
  );
  t.strictSame(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
      wipeAllWhitespaceOnLeft: false,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [5, 6, " "],
    "15.08 - false-true"
  );
  t.strictSame(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
      wipeAllWhitespaceOnLeft: false,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [5, 6],
    "15.09 - false-false"
  );
  t.end();
});

tap.test(
  "16 - wipeAllWhitespaceOnLeft + addSingleSpaceToPreventAccidentalConcatenation",
  (t) => {
    t.strictSame(
      e({
        str: "aaaaa  bbbbb",
        from: 6,
        to: 7,
        wipeAllWhitespaceOnLeft: false,
        addSingleSpaceToPreventAccidentalConcatenation: false,
      }),
      [6, 7],
      "16.01"
    );
    t.strictSame(
      e({
        str: "aaaaa  bbbbb",
        from: 6,
        to: 7,
        wipeAllWhitespaceOnLeft: false,
        addSingleSpaceToPreventAccidentalConcatenation: true,
      }),
      [6, 7],
      "16.02"
    );
    t.strictSame(
      e({
        str: "aaaaa  bbbbb",
        from: 6,
        to: 7,
        wipeAllWhitespaceOnLeft: true,
        addSingleSpaceToPreventAccidentalConcatenation: false,
      }),
      [5, 7],
      "16.03"
    );
    t.strictSame(
      e({
        str: "aaaaa  bbbbb",
        from: 6,
        to: 7,
        wipeAllWhitespaceOnLeft: true,
        addSingleSpaceToPreventAccidentalConcatenation: true,
      }),
      [5, 7, " "],
      "16.04"
    );
    t.end();
  }
);

tap.test(
  "17 - wipeAllWhitespaceOnRight + addSingleSpaceToPreventAccidentalConcatenation",
  (t) => {
    t.strictSame(
      e({
        str: "aaaaa  bbbbb",
        from: 5,
        to: 6,
        wipeAllWhitespaceOnRight: false,
        addSingleSpaceToPreventAccidentalConcatenation: false,
      }),
      [5, 6],
      "17.01"
    );
    t.strictSame(
      e({
        str: "aaaaa  bbbbb",
        from: 5,
        to: 6,
        wipeAllWhitespaceOnRight: false,
        addSingleSpaceToPreventAccidentalConcatenation: true,
      }),
      [5, 6],
      "17.02"
    );
    t.strictSame(
      e({
        str: "aaaaa  bbbbb",
        from: 5,
        to: 6,
        wipeAllWhitespaceOnRight: true,
        addSingleSpaceToPreventAccidentalConcatenation: false,
      }),
      [5, 7],
      "17.03"
    );
    t.strictSame(
      e({
        str: "aaaaa  bbbbb",
        from: 5,
        to: 6,
        wipeAllWhitespaceOnRight: true,
        addSingleSpaceToPreventAccidentalConcatenation: true,
      }),
      [5, 7, " "],
      "17.04"
    );
    t.end();
  }
);

tap.test(
  "18 - wipeAllWhitespaceOnLeft + wipeAllWhitespaceOnRight + addSingleSpaceToPreventAccidentalConcatenation",
  (t) => {
    t.strictSame(
      e({
        str: "aaaaa   bbbbb",
        from: 6,
        to: 7,
        wipeAllWhitespaceOnRight: false,
        addSingleSpaceToPreventAccidentalConcatenation: false,
      }),
      [6, 7],
      "18.01"
    );
    t.strictSame(
      e({
        str: "aaaaa   bbbbb",
        from: 6,
        to: 7,
        wipeAllWhitespaceOnLeft: true,
        addSingleSpaceToPreventAccidentalConcatenation: false,
      }),
      [5, 7],
      "18.02"
    );
    t.strictSame(
      e({
        str: "aaaaa   bbbbb",
        from: 6,
        to: 7,
        wipeAllWhitespaceOnRight: true,
        addSingleSpaceToPreventAccidentalConcatenation: false,
      }),
      [6, 8],
      "18.03"
    );

    // both on result in tight crop:
    t.strictSame(
      e({
        str: "aaaaa   bbbbb",
        from: 6,
        to: 7,
        wipeAllWhitespaceOnLeft: true,
        wipeAllWhitespaceOnRight: true,
        addSingleSpaceToPreventAccidentalConcatenation: false,
      }),
      [5, 8],
      "18.04"
    );

    t.strictSame(
      e({
        str: "aaaaa   bbbbb",
        from: 6,
        to: 7,
        wipeAllWhitespaceOnLeft: true,
        wipeAllWhitespaceOnRight: true,
        addSingleSpaceToPreventAccidentalConcatenation: true,
      }),
      [5, 8, " "],
      "18.05"
    );
    t.end();
  }
);

tap.test("19 - addSingleSpaceToPreventAccidentalConcatenation ignored", (t) => {
  t.strictSame(
    e({
      str: "<strong><!-- --></strong>",
      from: 8,
      to: 16,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [8, 16],
    "19.01 - baseline"
  );
  t.strictSame(
    e({
      str: "<strong><!-- --></strong>",
      from: 8,
      to: 16,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [8, 16],
    "19.02 - non digits and non letters"
  );
  t.strictSame(
    e({
      str: "a<!-- -->b",
      from: 1,
      to: 9,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [1, 9, " "],
    "19.03 - letters"
  );
  t.strictSame(
    e({
      str: "<zzz><!-- -->b",
      from: 5,
      to: 13,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [5, 13, " "],
    "19.04 - letter on one side"
  );
  t.strictSame(
    e({
      str: "<strong><!-- --></strong>",
      from: 8,
      to: 16,
      addSingleSpaceToPreventAccidentalConcatenation: true,
      ifLeftSideIncludesThisThenCropTightly: ">",
      ifRightSideIncludesThisThenCropTightly: "<",
    }),
    [8, 16],
    "19.05"
  );
  t.strictSame(
    e({
      str: "<strong><!-- -->a</strong>",
      from: 8,
      to: 16,
      addSingleSpaceToPreventAccidentalConcatenation: true,
      ifLeftSideIncludesThisThenCropTightly: ">",
      ifRightSideIncludesThisThenCropTightly: "<",
    }),
    [8, 16, " "],
    "19.06"
  );
  t.strictSame(
    e({
      str: "<strong>a<!-- --></strong>",
      from: 9,
      to: 17,
      addSingleSpaceToPreventAccidentalConcatenation: true,
      ifLeftSideIncludesThisThenCropTightly: ">",
      ifRightSideIncludesThisThenCropTightly: "<",
    }),
    [9, 17, " "],
    "19.07"
  );
  t.strictSame(
    e({
      str: "<strong>a<!-- -->a</strong>",
      from: 9,
      to: 17,
      addSingleSpaceToPreventAccidentalConcatenation: true,
      ifLeftSideIncludesThisThenCropTightly: ">",
      ifRightSideIncludesThisThenCropTightly: "<",
    }),
    [9, 17, " "],
    "19.08"
  );

  // AND...

  t.strictSame(
    e({
      str: "<strong>  <!-- -->  </strong>",
      from: 10,
      to: 18,
      addSingleSpaceToPreventAccidentalConcatenation: true,
      ifLeftSideIncludesThisThenCropTightly: ">",
      ifRightSideIncludesThisThenCropTightly: "<",
    }),
    [8, 20],
    "19.09"
  );
  t.strictSame(
    e({
      str: "<strong>  <!-- --></strong>",
      from: 10,
      to: 18,
      addSingleSpaceToPreventAccidentalConcatenation: true,
      ifLeftSideIncludesThisThenCropTightly: ">",
      ifRightSideIncludesThisThenCropTightly: "<",
    }),
    [8, 18],
    "19.10"
  );
  t.strictSame(
    e({
      str: "<strong><!-- -->  </strong>",
      from: 8,
      to: 16,
      addSingleSpaceToPreventAccidentalConcatenation: true,
      ifLeftSideIncludesThisThenCropTightly: ">",
      ifRightSideIncludesThisThenCropTightly: "<",
    }),
    [8, 18],
    "19.11"
  );
  t.end();
});

// 02. opts.ifLeftSideIncludesThisThenCropTightly
// -----------------------------------------------------------------------------

tap.test(
  `20 - ${`\u001b[${33}m${`opts.ifLeftSideIncludesThisThenCropTightly`}\u001b[${39}m`} - normal use, both sides extended`,
  (t) => {
    t.strictSame(
      e({
        str: "a>     <b",
        from: 3,
        to: 6,
        ifLeftSideIncludesThisThenCropTightly: ">",
      }),
      [2, 7],
      "20.01"
    );
    t.strictSame(
      e({
        str: "a>     <b",
        from: 2,
        to: 6,
        ifLeftSideIncludesThisThenCropTightly: ">",
      }),
      [2, 7],
      "20.02"
    );
    t.strictSame(
      e({
        str: "a>     <b",
        from: 3,
        to: 7,
        ifLeftSideIncludesThisThenCropTightly: ">",
      }),
      [2, 7],
      "20.03"
    );
    t.strictSame(
      e({
        str: "a>     <b",
        from: 2,
        to: 7,
        ifLeftSideIncludesThisThenCropTightly: ">",
      }),
      [2, 7],
      "20.04"
    );
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${33}m${`opts.ifLeftSideIncludesThisThenCropTightly`}\u001b[${39}m`} - normal use, mismatching value`,
  (t) => {
    t.strictSame(
      e({
        str: "a>     <b",
        from: 5,
        to: 5,
        ifLeftSideIncludesThisThenCropTightly: "z",
      }),
      [3, 6],
      "21.01"
    );
    t.strictSame(
      e({
        str: "a>     <b",
        from: 4,
        to: 5,
        ifLeftSideIncludesThisThenCropTightly: "z",
      }),
      [3, 6],
      "21.02"
    );
    t.strictSame(
      e({
        str: "a>     <b",
        from: 3,
        to: 6,
        ifLeftSideIncludesThisThenCropTightly: "z",
      }),
      [3, 6],
      "21.03"
    );
    t.strictSame(
      e({
        str: "a>     <b",
        from: 2,
        to: 6,
        ifLeftSideIncludesThisThenCropTightly: "z",
      }),
      [2, 6],
      "21.04"
    );
    t.strictSame(
      e({
        str: "a>     <b",
        from: 3,
        to: 7,
        ifLeftSideIncludesThisThenCropTightly: "z",
      }),
      [3, 7],
      "21.05"
    );
    t.strictSame(
      e({
        str: "a>     <b",
        from: 2,
        to: 7,
        ifLeftSideIncludesThisThenCropTightly: "z",
      }),
      [2, 7],
      "21.06"
    );
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${33}m${`opts.ifLeftSideIncludesThisThenCropTightly`}\u001b[${39}m`} - range within characters, no whitespace`,
  (t) => {
    t.strictSame(
      e({
        str: "aaaaaaaaaaaaa",
        from: 5,
        to: 5,
        ifLeftSideIncludesThisThenCropTightly: "z",
      }),
      [5, 5],
      "22.01"
    );
    t.strictSame(
      e({
        str: "aaaaaaaaaaaaa",
        from: 5,
        to: 5,
        ifLeftSideIncludesThisThenCropTightly: "a",
      }),
      [5, 5],
      "22.02"
    );
    t.strictSame(
      e({
        str: "-aaaaaaaaaaaaa-",
        from: 5,
        to: 5,
        ifLeftSideIncludesThisThenCropTightly: "a",
      }),
      [5, 5],
      "22.03"
    );
    t.end();
  }
);

// 03. opts.ifRightSideIncludesThisThenCropTightly
// -----------------------------------------------------------------------------

tap.test(
  `23 - ${`\u001b[${33}m${`opts.ifRightSideIncludesThisThenCropTightly`}\u001b[${39}m`} - normal use, both sides extended`,
  (t) => {
    t.strictSame(
      e({
        str: "a>     <b",
        from: 3,
        to: 6,
        ifRightSideIncludesThisThenCropTightly: "<",
      }),
      [2, 7],
      "23.01"
    );
    t.strictSame(
      e({
        str: "a>     <b",
        from: 2,
        to: 6,
        ifRightSideIncludesThisThenCropTightly: "<",
      }),
      [2, 7],
      "23.02"
    );
    t.strictSame(
      e({
        str: "a>     <b",
        from: 3,
        to: 7,
        ifRightSideIncludesThisThenCropTightly: "<",
      }),
      [2, 7],
      "23.03"
    );
    t.strictSame(
      e({
        str: "a>     <b",
        from: 2,
        to: 7,
        ifRightSideIncludesThisThenCropTightly: "<",
      }),
      [2, 7],
      "23.04"
    );
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${33}m${`opts.ifRightSideIncludesThisThenCropTightly`}\u001b[${39}m`} - normal use, mismatching value`,
  (t) => {
    t.strictSame(
      e({
        str: "a>     <b",
        from: 5,
        to: 5,
        ifRightSideIncludesThisThenCropTightly: "z",
      }),
      [3, 6],
      "24.01"
    );
    t.strictSame(
      e({
        str: "a>     <b",
        from: 4,
        to: 5,
        ifRightSideIncludesThisThenCropTightly: "z",
      }),
      [3, 6],
      "24.02"
    );
    t.strictSame(
      e({
        str: "a>     <b",
        from: 3,
        to: 6,
        ifRightSideIncludesThisThenCropTightly: "z",
      }),
      [3, 6],
      "24.03"
    );
    t.strictSame(
      e({
        str: "a>     <b",
        from: 2,
        to: 6,
        ifRightSideIncludesThisThenCropTightly: "z",
      }),
      [2, 6],
      "24.04"
    );
    t.strictSame(
      e({
        str: "a>     <b",
        from: 3,
        to: 7,
        ifRightSideIncludesThisThenCropTightly: "z",
      }),
      [3, 7],
      "24.05"
    );
    t.strictSame(
      e({
        str: "a>     <b",
        from: 2,
        to: 7,
        ifRightSideIncludesThisThenCropTightly: "z",
      }),
      [2, 7],
      "24.06"
    );
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${33}m${`opts.ifRightSideIncludesThisThenCropTightly`}\u001b[${39}m`} - range within characters, no whitespace`,
  (t) => {
    t.strictSame(
      e({
        str: "aaaaaaaaaaaaa",
        from: 5,
        to: 5,
        ifRightSideIncludesThisThenCropTightly: "z",
      }),
      [5, 5],
      "25.01"
    );
    t.strictSame(
      e({
        str: "aaaaaaaaaaaaa",
        from: 5,
        to: 5,
        ifRightSideIncludesThisThenCropTightly: "a",
      }),
      [5, 5],
      "25.02"
    );
    t.strictSame(
      e({
        str: "-aaaaaaaaaaaaa-",
        from: 5,
        to: 5,
        ifRightSideIncludesThisThenCropTightly: "a",
      }),
      [5, 5],
      "25.03"
    );
    t.end();
  }
);

// 04. combos with opts.if***SideIncludesThisCropItToo
// -----------------------------------------------------------------------------

tap.test(
  `26 - ${`\u001b[${33}m${`opts.ifLeftSideIncludesThisCropItToo`}\u001b[${39}m`} - combo with tight crop`,
  (t) => {
    t.strictSame(
      e({
        str: "something>\n\t    zzzz <here",
        from: 16,
        to: 20,
        ifRightSideIncludesThisThenCropTightly: "<",
      }),
      [10, 21],
      "26.01 - control #1"
    );
    t.strictSame(
      e({
        str: "something>\n\t    zzzz <here",
        from: 16,
        to: 20,
        ifLeftSideIncludesThisCropItToo: "\n\t",
      }),
      [10, 20],
      "26.02 - control #2"
    );
    t.strictSame(
      e({
        str: "something>\n\t    zzzz <here",
        from: 16,
        to: 20,
        ifLeftSideIncludesThisCropItToo: "\n\t",
        ifRightSideIncludesThisThenCropTightly: "<",
      }),
      [10, 21],
      "26.03"
    );
    t.strictSame(
      e({
        str: "something> a    zzzz <here",
        from: 16,
        to: 20,
        ifRightSideIncludesThisThenCropTightly: "<",
        ifLeftSideIncludesThisThenCropTightly: ">",
      }),
      [12, 21],
      "26.04"
    );
    t.strictSame(
      e({
        str: "something> a    zzzz <here",
        from: 16,
        to: 20,
        ifRightSideIncludesThisThenCropTightly: "<",
        ifLeftSideIncludesThisCropItToo: "a",
        ifLeftSideIncludesThisThenCropTightly: ">",
      }),
      [10, 21],
      "26.05"
    );
    t.strictSame(
      e({
        str: "something> a    zzzz <here",
        from: 16,
        to: 20,
        ifLeftSideIncludesThisCropItToo: "a",
        ifLeftSideIncludesThisThenCropTightly: ">",
      }),
      [10, 21],
      "26.06"
    );
    t.end();
  }
);

// 05. extendToOneSide
// -----------------------------------------------------------------------------

tap.test(
  `27 - ${`\u001b[${33}m${`opts.extendToOneSide`}\u001b[${39}m`} - one side only`,
  (t) => {
    t.strictSame(
      e({
        str: "a>     <b",
        from: 4,
        to: 5,
      }),
      [3, 6],
      "27.01 - default, a control"
    );
    t.strictSame(
      e({
        str: "a>     <b",
        from: 4,
        to: 5,
        extendToOneSide: false,
      }),
      [3, 6],
      "27.02 - hardcoded default"
    );
    t.strictSame(
      e({
        str: "a>     <b",
        from: 4,
        to: 5,
        extendToOneSide: "right",
      }),
      [4, 6],
      "27.03 - right only"
    );
    t.strictSame(
      e({
        str: "a>     <b",
        from: 4,
        to: 5,
        extendToOneSide: "left",
      }),
      [3, 5],
      "27.04 - left only"
    );
    t.end();
  }
);

// 06. opts.wipeAllWhitespaceOnLeft & opts.wipeAllWhitespaceOnRight
// -----------------------------------------------------------------------------

tap.test(
  `28 - ${`\u001b[${33}m${`opts.wipeAllWhitespaceOnLeft`}\u001b[${39}m`} - extends to both sides`,
  (t) => {
    t.strictSame(
      e({
        str: "a>     <b",
        from: 4,
        to: 5,
      }),
      [3, 6],
      "28.01 - a control"
    );
    t.strictSame(
      e({
        str: "a>     <b",
        from: 4,
        to: 5,
        wipeAllWhitespaceOnLeft: true,
      }),
      [2, 6],
      "28.02 - left"
    );
    t.strictSame(
      e({
        str: "a>     <b",
        from: 4,
        to: 5,
        wipeAllWhitespaceOnRight: true,
      }),
      [3, 7],
      "28.03 - right"
    );
    t.strictSame(
      e({
        str: "a>     <b",
        from: 4,
        to: 5,
        wipeAllWhitespaceOnLeft: true,
        wipeAllWhitespaceOnRight: true,
      }),
      [2, 7],
      "28.04 - both"
    );
    t.end();
  }
);

// 07. Various
// -----------------------------------------------------------------------------

tap.test(`29 - ${`\u001b[${36}m${`various`}\u001b[${39}m`} - adhoc #1`, (t) => {
  const str = `<head>
<style type="text/css">
  aa, .unused[z], bb {z:2;}
</style>
</head>
<body id   =   ""  ><a class  =  "" >z</a>
</body>`;

  t.strictSame(
    e({
      str,
      from: 82,
      to: 93,
      ifRightSideIncludesThisThenCropTightly: "/>",
      wipeAllWhitespaceOnLeft: true,
    }),
    [81, 95],
    "29"
  );
  t.end();
});

tap.test(`30 - ${`\u001b[${36}m${`various`}\u001b[${39}m`} - adhoc #2`, (t) => {
  const str = `<head>
<style>
  @media screen {.col-1,.col-2 {z: y;}}
</style>
</head>
<body>z
</body>`;

  t.strictSame(
    e({
      str,
      from: 32,
      to: 38,
      ifRightSideIncludesThisCropItToo: ",",
      ifRightSideIncludesThisThenCropTightly: ".#",
      extendToOneSide: "right",
    }),
    [32, 39],
    "30"
  );
  t.end();
});

tap.test(`31 - ${`\u001b[${36}m${`various`}\u001b[${39}m`} - adhoc #3`, (t) => {
  const str = `<head>
<style>
  @media screen {.col-1,.col-2 {z: y;}}
</style>
</head>
<body>z
</body>`;

  t.strictSame(
    e({
      str,
      from: 39,
      to: 45,
      ifLeftSideIncludesThisCropItToo: ",",
      ifLeftSideIncludesThisThenCropTightly: ".#",
      extendToOneSide: "left",
    }),
    [38, 45],
    "31"
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
