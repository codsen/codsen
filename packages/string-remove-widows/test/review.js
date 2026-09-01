import { test } from "uvu";
import { equal, ok, throws } from "uvu/assert";

import { defaults, removeWidows } from "../dist/string-remove-widows.esm.js";

const htmlNbsp = "&nbsp;";
const cssNbsp = "\\0000A0";
const jsNbsp = "\\u00A0";
const rawNbsp = "\u00A0";

test("01 - whitespace candidates remain atomic", () => {
  const source = "zero one two three<br />four";
  const result = removeWidows(source, {
    minWordCount: 0,
    minCharCount: 0,
  });
  equal(result.res, "zero one two&nbsp;three<br />four", "01.01");
  equal(result.ranges, [[12, 13, htmlNbsp]], "01.02");
  ok(
    result.ranges.every(([from, to]) => !source.slice(from, to).trim()),
    "01.03",
  );

  const ignored = "one two three {% x %} five";
  equal(
    removeWidows(ignored, {
      ignore: "jinja",
      minWordCount: 0,
      minCharCount: 0,
    }).res,
    "one two three {% x %}&nbsp;five",
    "01.04",
  );
  const customIgnored = "HEAD payload TAIL SW1A 1AA STOP rest";
  equal(
    removeWidows(customIgnored, {
      ignore: [{ heads: "HEAD", tails: "TAIL SW1A 1AA STOP" }],
      UKPostcodes: true,
      minWordCount: 99,
      minCharCount: 99,
    }).res,
    customIgnored,
    "01.05",
  );
  ["END ", ["END "]].forEach((tails) => {
    equal(
      removeWidows("HEADpayloadEND four five six seven", {
        ignore: [{ heads: "HEAD", tails }],
        minWordCount: 5,
        minCharCount: 0,
      }).res,
      "HEADpayloadEND four five six&nbsp;seven",
      `01.06 - ${Array.isArray(tails) ? "array" : "scalar"} tail`,
    );
  });
  [rawNbsp, htmlNbsp, jsNbsp, cssNbsp].forEach((measure) => {
    equal(
      removeWidows(`{% x %}${measure}a b c`, {
        ignore: "all",
        convertEntities: false,
        minWordCount: 5,
        minCharCount: 0,
      }).res,
      `{% x %}${rawNbsp}a b c`,
      `01.07 - ${JSON.stringify(measure)}`,
    );
  });
  [
    [rawNbsp, " "],
    [htmlNbsp, " "],
    [jsNbsp, " "],
    [cssNbsp, "  "],
  ].forEach(([measure, followingWhitespace]) => {
    equal(
      removeWidows(`a b${measure}${followingWhitespace}c`, {
        minWordCount: 0,
        minCharCount: 0,
      }).res,
      `a b${htmlNbsp}${htmlNbsp}c`,
      `01.08 - ${JSON.stringify(measure)}`,
    );
  });
});

test("02 - progress is finite, bounded and monotonic", () => {
  const progress = [];
  removeWidows("", {
    reportProgressFunc: (value) => progress.push(value),
    reportProgressFuncFrom: 21,
    reportProgressFuncTo: 86,
  });
  equal(progress[0], 21, "02.01");
  equal(progress[progress.length - 1], 86, "02.02");
  ok(
    progress.every(
      (value, index) =>
        Number.isFinite(value) &&
        Number.isInteger(value) &&
        value >= 21 &&
        value <= 86 &&
        (index === 0 || value > progress[index - 1]),
    ),
    "02.03",
  );
});

test("03 - tag ranges are opaque and normalized without mutation", () => {
  const protectedEntity = removeWidows("&nbsp; x y z", {
    tagRanges: [[0, 6]],
    convertEntities: false,
    minWordCount: 0,
    minCharCount: 0,
  });
  equal(protectedEntity.res.slice(0, 6), "&nbsp;", "03.01");
  ok(
    protectedEntity.ranges.every(([from, to]) => from >= 6 && to > 6),
    "03.02",
  );

  const tagRanges = [
    [6, 9],
    [0, 3],
    [2, 6],
  ];
  const snapshot = JSON.stringify(tagRanges);
  removeWidows("abc def ghi", { tagRanges });
  equal(JSON.stringify(tagRanges), snapshot, "03.03");
  equal(
    removeWidows("a a a a<tag>", { tagRanges: [[7, 99]] }).res,
    "a a a a<tag>",
    "03.04",
  );
  equal(
    removeWidows("&nbsp;", {
      convertEntities: false,
      minWordCount: 99,
      minCharCount: 99,
      tagRanges: [[1, 2]],
    }).res,
    "&nbsp;",
    "03.05",
  );
  equal(
    removeWidows("before &ndash; after", {
      minWordCount: 99,
      minCharCount: 99,
      tagRanges: [[9, 10]],
    }).res,
    "before &ndash; after",
    "03.06",
  );
  equal(
    removeWidows("SW1A  1AA", {
      UKPostcodes: true,
      minWordCount: 99,
      minCharCount: 99,
      tagRanges: [[5, 6]],
    }).res,
    "SW1A  1AA",
    "03.07",
  );
  equal(
    removeWidows("x\\0000A0y", {
      convertEntities: false,
      minWordCount: 99,
      minCharCount: 99,
      tagRanges: [[2, 3]],
    }).res,
    "x\\0000A0y",
    "03.08",
  );
  equal(
    removeWidows("{% if x %}one two three{% endif %}four five", {
      ignore: "jinja",
      minWordCount: 0,
      minCharCount: 0,
      tagRanges: [[32, 34]],
    }).res,
    "{% if x %}one two three{% endif %}four five",
    "03.09",
  );
  equal(
    removeWidows("<b>one two three four", {
      minWordCount: 4,
      minCharCount: 0,
      tagRanges: [[0, 3]],
    }).res,
    "<b>one two three&nbsp;four",
    "03.10",
  );
  [rawNbsp, htmlNbsp, jsNbsp, cssNbsp].forEach((measure) => {
    const source = `${measure}<b>one two three four`;
    equal(
      removeWidows(source, {
        convertEntities: false,
        minWordCount: 4,
        minCharCount: 0,
        tagRanges: [[measure.length, measure.length + 3]],
      }).res,
      `${rawNbsp}<b>one two three${rawNbsp}four`,
      `03.11 - ${JSON.stringify(measure)}`,
    );
  });
  ["-", "–", "&ndash;", "\\u2013"].forEach((dash) => {
    equal(
      removeWidows(`<b>${dash} a b c`, {
        minWordCount: 4,
        minCharCount: 0,
        tagRanges: [[0, 3]],
      }).res,
      `<b>${dash} a b${htmlNbsp}c`,
      `03.12 - ${dash}`,
    );
  });
  equal(
    removeWidows("one two three four five <tag>", {
      tagRanges: [[24, 29]],
    }).res,
    "one two three four&nbsp;five <tag>",
    "03.13",
  );
  equal(
    removeWidows("\\002013 <b>a b c", {
      minWordCount: 4,
      minCharCount: 0,
      tagRanges: [[8, 11]],
    }).res,
    "\\002013 <b>a b c",
    "03.14",
  );
});

test("04 - tag range access grows with ranges, not input times ranges", () => {
  let reads = 0;
  const source = "a".repeat(400);
  const tagRanges = Array.from({ length: 50 }, (_, index) => {
    const range = [];
    Object.defineProperty(range, "0", {
      enumerable: true,
      get() {
        reads += 1;
        return index * 4;
      },
    });
    Object.defineProperty(range, "1", {
      enumerable: true,
      get() {
        reads += 1;
        return index * 4 + 1;
      },
    });
    range.length = 2;
    return range;
  });
  removeWidows(source, { tagRanges });
  ok(reads < 1_000, `04.01 - observed ${reads} indexed reads`);
});

test("05 - CSS NBSP output is unambiguous", () => {
  ["0", "9", "a", "f", "A", "F", "g", "!"].forEach((follower) => {
    equal(
      removeWidows(`aaa bbb ccc ${follower}tail`, {
        targetLanguage: "css",
        minWordCount: 0,
        minCharCount: 0,
      }).res,
      `aaa bbb ccc${cssNbsp}${follower}tail`,
      `05.01 - follower ${follower}`,
    );
  });
  equal(
    removeWidows("x\\00A0c", {
      convertEntities: false,
      minWordCount: 99,
      minCharCount: 99,
    }).res,
    "x\\00A0c",
    "05.02",
  );
  equal(
    removeWidows("x\\0000A0 y", {
      convertEntities: false,
      minWordCount: 99,
      minCharCount: 99,
    }).res,
    `x${rawNbsp}y`,
    "05.03",
  );
  equal(
    removeWidows("x\\0000A0\r\ny", {
      convertEntities: false,
      minWordCount: 99,
      minCharCount: 99,
    }).res,
    `x${rawNbsp}y`,
    "05.04",
  );
  equal(
    removeWidows(`x${rawNbsp} y`, {
      targetLanguage: "css",
      minWordCount: 99,
      minCharCount: 99,
    }).res,
    "x\\0000A0  y",
    "05.05",
  );
});

test("06 - encoded dashes use their complete token boundary", () => {
  ["–", "&ndash;", "\\2013 ", "\\u2013"].forEach((dash) => {
    equal(
      removeWidows(`before ${dash} after`, {
        minWordCount: 99,
        minCharCount: 99,
      }).res,
      `before${htmlNbsp}${dash} after`,
      `06.01 - ${dash}`,
    );
    equal(
      removeWidows(`Discount: ${dash}&pound;10.00`, {
        minWordCount: 99,
        minCharCount: 99,
      }).res,
      `Discount: ${dash}&pound;10.00`,
      `06.02 - ${dash}`,
    );
  });
  equal(
    removeWidows("before \\2013 after", {
      minWordCount: 99,
      minCharCount: 99,
    }).res,
    "before \\2013 after",
    "06.03",
  );
  equal(
    removeWidows("a\\0000A0 - b", {
      convertEntities: true,
      targetLanguage: "html",
      minWordCount: 4,
      minCharCount: 0,
    }).res,
    "a&nbsp;- b",
    "06.04",
  );
  equal(
    removeWidows("a\\0000A0 - b", {
      convertEntities: false,
      minWordCount: 4,
      minCharCount: 0,
    }).res,
    `a${rawNbsp}- b`,
    "06.05",
  );
  equal(
    removeWidows("a b \\002013  c", {
      minWordCount: 0,
      minCharCount: 0,
    }).res,
    "a b&nbsp;\\002013 &nbsp;c",
    "06.06",
  );
  [rawNbsp, htmlNbsp, "&#160;", jsNbsp, cssNbsp].forEach((measure) => {
    equal(
      removeWidows(`a${measure}- b`, {
        removeWidowPreventionMeasures: true,
        minWordCount: 99,
        minCharCount: 99,
      }).res,
      "a - b",
      `06.07 - ${JSON.stringify(measure)}`,
    );
  });
  equal(
    removeWidows("a \\2013 b c", {
      minWordCount: 4,
      minCharCount: 0,
    }).res,
    "a \\2013 b c",
    "06.08",
  );
});

test("07 - every line ending remains structural", () => {
  ["\n", "\r", "\r\n"].forEach((eol) => {
    equal(
      removeWidows(`first${eol}second`, {
        minWordCount: 1,
        minCharCount: 5,
      }).res,
      `first${eol}second`,
      `07.01 - ${JSON.stringify(eol)}`,
    );
    equal(
      removeWidows(`  !&ndash;  a${eol}-${rawNbsp}1AA`, {
        convertEntities: true,
        targetLanguage: "html",
        removeWidowPreventionMeasures: false,
        hyphens: true,
        UKPostcodes: false,
        minWordCount: 6,
        minCharCount: 9,
      }).res,
      `  !&ndash;  a${eol}-${htmlNbsp}1AA`,
      `07.02 - ${JSON.stringify(eol)}`,
    );
  });
});

test("08 - NBSP spellings have equivalent threshold meaning", () => {
  [rawNbsp, htmlNbsp, cssNbsp, jsNbsp].forEach((nbsp) => {
    equal(
      removeWidows(`a${nbsp}b c`, {
        convertEntities: false,
        minWordCount: 0,
        minCharCount: 5,
      }).res,
      `a${rawNbsp}b c`,
      `08.01 - ${JSON.stringify(nbsp)}`,
    );
  });
  equal(
    removeWidows("a\\0000A0 b c", {
      convertEntities: false,
      minWordCount: 4,
      minCharCount: 0,
    }).res,
    `a${rawNbsp}b c`,
    "08.02",
  );
  [rawNbsp, htmlNbsp, jsNbsp, cssNbsp].forEach((measure) => {
    equal(
      removeWidows(`one two three${measure}`, {
        convertEntities: false,
        minWordCount: 0,
        minCharCount: 0,
      }).res,
      `one two${rawNbsp}three${rawNbsp}`,
      `08.03 - ${JSON.stringify(measure)}`,
    );
  });
});

test("09 - actual work and applicability are separate", () => {
  const converted = removeWidows("x\\u00A0x", {
    convertEntities: true,
    targetLanguage: "html",
    minWordCount: 99,
    minCharCount: 99,
  });
  equal(converted.whatWasDone.convertEntities, true, "09.01");

  const noOp = removeWidows("aaa bbb ccc&nbsp;ddd", {
    minWordCount: 0,
    minCharCount: 0,
  });
  equal(noOp.ranges, null, "09.02");
  equal(
    noOp.whatWasDone,
    { removeWidows: false, convertEntities: false },
    "09.03",
  );
  equal(
    noOp.applicableOpts,
    { removeWidows: true, convertEntities: true },
    "09.04",
  );
  equal(
    JSON.parse(JSON.stringify(noOp)).applicableOpts,
    noOp.applicableOpts,
    "09.05",
  );

  [
    [htmlNbsp, { convertEntities: false }, rawNbsp],
    [rawNbsp, { convertEntities: true, targetLanguage: "html" }, htmlNbsp],
    [jsNbsp, { convertEntities: true, targetLanguage: "html" }, htmlNbsp],
  ].forEach(([sourceNbsp, opts, targetNbsp]) => {
    const result = removeWidows(`aaa bbb ccc${sourceNbsp}ddd`, {
      ...opts,
      minWordCount: 0,
      minCharCount: 0,
    });
    equal(
      {
        res: result.res,
        whatWasDone: result.whatWasDone,
        applicableOpts: result.applicableOpts,
      },
      {
        res: `aaa bbb ccc${targetNbsp}ddd`,
        whatWasDone: { removeWidows: false, convertEntities: true },
        applicableOpts: { removeWidows: true, convertEntities: true },
      },
      `09.06 - ${JSON.stringify(sourceNbsp)}`,
    );
  });

  [htmlNbsp, rawNbsp, jsNbsp].forEach((sourceNbsp) => {
    [true, false].forEach((convertEntities) => {
      const result = removeWidows(`aaa bbb ccc${sourceNbsp}ddd`, {
        removeWidowPreventionMeasures: true,
        convertEntities,
        minWordCount: 0,
        minCharCount: 0,
      });
      equal(
        {
          res: result.res,
          whatWasDone: result.whatWasDone,
          applicableOpts: result.applicableOpts,
        },
        {
          res: "aaa bbb ccc ddd",
          whatWasDone: { removeWidows: true, convertEntities: false },
          applicableOpts: { removeWidows: true, convertEntities: false },
        },
        `09.07 - ${JSON.stringify(sourceNbsp)}; convert ${convertEntities}`,
      );
    });
  });
  const plainSpace = removeWidows("aaa bbb ccc ddd", {
    minWordCount: 0,
    minCharCount: 0,
  });
  equal(plainSpace.applicableOpts.convertEntities, true, "09.08");
  equal(
    removeWidows("aaa bbb ccc ddd", {
      convertEntities: false,
      minWordCount: 0,
      minCharCount: 0,
    }).res,
    `aaa bbb ccc${rawNbsp}ddd`,
    "09.09",
  );
});

test("10 - malformed options fail with stable package errors", () => {
  const inheritedOption = Object.create({ convertEntities: false });
  const invalidCalls = [
    [() => removeWidows("x", false), "03"],
    [() => removeWidows("x", { mystery: true }), "04"],
    [() => removeWidows("x", { "": true }), "04"],
    [() => removeWidows("x", inheritedOption), "03"],
    [() => removeWidows("x", { convertEntities: "false" }), "05"],
    [() => removeWidows("x", { targetLanguage: "xml" }), "06"],
    [() => removeWidows("x", { minWordCount: Number.NaN }), "07"],
    [() => removeWidows("x", { ignore: [null] }), "08"],
    [() => removeWidows("x", { ignore: new Array(1) }), "08"],
    [
      () =>
        removeWidows("x", {
          ignore: [{ heads: new Array(1), tails: "x" }],
        }),
      "08",
    ],
    [() => removeWidows("x", { ignore: "unknown" }), "09"],
    [() => removeWidows("x", { reportProgressFunc: true }), "10"],
    [() => removeWidows("x", { reportProgressFuncFrom: -1 }), "11"],
    [
      () =>
        removeWidows("x", {
          reportProgressFuncFrom: 80,
          reportProgressFuncTo: 20,
        }),
      "12",
    ],
    [() => removeWidows("x", { tagRanges: true }), "13"],
    [() => removeWidows("x", { tagRanges: new Array(1) }), "14"],
    [() => removeWidows("x", { tagRanges: [[1, 1]] }), "14"],
  ];
  invalidCalls.forEach(([fn, id]) => {
    throws(fn, new RegExp(`THROW_ID_${id}`), `10.01 - THROW_ID_${id}`);
  });

  let getterReads = 0;
  const getterOpts = {};
  Object.defineProperty(getterOpts, "convertEntities", {
    enumerable: true,
    get() {
      getterReads += 1;
      return getterReads === 1 ? false : "invalid";
    },
  });
  removeWidows("x", getterOpts);
  equal(getterReads, 1, "10.02");
});

test("11 - postcode matches require complete token boundaries", () => {
  const opts = {
    UKPostcodes: true,
    minWordCount: 99,
    minCharCount: 99,
  };
  equal(
    removeWidows("prefix fooSW1A 1AA suffix", opts).res,
    "prefix fooSW1A 1AA suffix",
    "11.01",
  );
  equal(
    removeWidows("prefix SW1A 1AAX suffix", opts).res,
    "prefix SW1A 1AAX suffix",
    "11.02",
  );
  equal(
    removeWidows("prefix SW1A 1AA suffix", opts).res,
    "prefix SW1A&nbsp;1AA suffix",
    "11.03",
  );
  equal(
    removeWidows("{% SW1A 1AA %}", { ...opts, ignore: "all" }).res,
    "{% SW1A 1AA %}",
    "11.04",
  );
  ["éSW1A 1AA", "SW1A 1AAЖ", "١SW1A 1AA", "SW1A 1AA१"].forEach(
    (source) => {
      equal(removeWidows(source, opts).res, source, `11.05 - ${source}`);
    },
  );
});

test("12 - exported defaults cannot alter later calls", () => {
  equal(
    [
      Object.isFrozen(defaults),
      Object.isFrozen(defaults.ignore),
      Object.isFrozen(defaults.tagRanges),
    ],
    [true, true, true],
    "12.01",
  );
  throws(
    () => {
      defaults.minWordCount = 0;
    },
    /read only|readonly|Cannot assign/u,
    "12.02",
  );
  throws(() => defaults.ignore.push("jinja"), /extensible|read only/u, "12.03");
  equal(removeWidows("aaa bbb ccc").res, "aaa bbb ccc", "12.04");
});

test("13 - plain-text fast path preserves default semantics", () => {
  [
    "",
    "one two three",
    "one two three four",
    "  one  two\tthree four  ",
    "fiber rest of the plain text",
    "honor remains ordinary plain text",
    "Unicode café has four words",
  ].forEach((source) => {
    const fast = removeWidows(source);
    const regular = removeWidows(source, {});
    equal(
      {
        ...fast,
        log: undefined,
      },
      {
        ...regular,
        log: undefined,
      },
      `13.01 - ${JSON.stringify(source)}`,
    );
  });
});

test.run();
