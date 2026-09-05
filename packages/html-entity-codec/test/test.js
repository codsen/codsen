import { readFileSync } from "node:fs";
import { test } from "uvu";
import { equal, ok, throws } from "uvu/assert";
import { allNamedEntities } from "../../all-named-html-entities/dist/all-named-html-entities.esm.js";
import {
  decode,
  encode,
  encodeNumeric,
  escapeAttribute,
  escapeText,
  scanReference,
  version,
} from "../dist/html-entity-codec.esm.js";

const snapshot = JSON.parse(
  readFileSync(
    new URL(
      "../../all-named-html-entities/upstream/entities.json",
      import.meta.url,
    ),
    "utf8",
  ),
);

test("01 - every official spelling and value in text and attribute contexts", () => {
  const mismatches = [];
  for (const [name, { characters }] of Object.entries(snapshot)) {
    for (const context of ["text", "attribute"]) {
      if (decode(name, { context }) !== characters)
        mismatches.push([name, context]);
      if (decode(`${name}!`, { context }) !== `${characters}!`)
        mismatches.push([name, context, "suffix"]);
    }
  }
  equal(mismatches, [], "01.01");
  equal(Object.keys(snapshot).length, 2231, "01.02");
});

test("02 - legacy lookahead and longest named matches", () => {
  equal(
    decode("&notin; &notit; &copy=1 &copy123 &ampbar &AMP;"),
    "∉ ¬it; ©=1 ©123 &bar &",
    "02.01",
  );
  equal(
    decode("&notin; &notit; &copy=1 &copy123 &ampbar &AMP;", {
      context: "attribute",
    }),
    "∉ &notit; &copy=1 &copy123 &ampbar &",
    "02.02",
  );
  equal(
    decode("&copyé &copy_ &copy-", { context: "attribute" }),
    "©é ©_ ©-",
    "02.03",
  );
  equal(
    decode("&notin &apos &aMp; &madeup; &constructor; &toString;"),
    "¬in &apos &aMp; &madeup; &constructor; &toString;",
    "02.04",
  );
});

test("03 - one-pass decoding and explicit semicolon policy", () => {
  equal(decode("&amp;lt; &amp;amp; &#38;#65;"), "&lt; &amp; &#65;", "03.01");
  equal(
    decode("&copy &notit; &#65 &#x41 &copy; &#65;", { requireSemicolon: true }),
    "&copy &notit; &#65 &#x41 © A",
    "03.02",
  );
  equal(
    decode("plain text without references"),
    "plain text without references",
    "03.03",
  );
  equal(decode(""), "", "03.04");
  equal(
    decode("& &; &#; &#x; &#Xq; &#-1; &#+1;"),
    "& &; &#; &#x; &#Xq; &#-1; &#+1;",
    "03.05",
  );
});

test("04 - numeric references and HTML replacement behavior", () => {
  equal(decode("&#65; &#x41; &#X000041; &#119558;"), "A A A 𝌆", "04.01");
  equal(decode("&#0; &#xD800; &#xDFFF; &#1114112;"), "� � � �", "04.02");
  equal(
    decode("&#x10FFFF; &#xFDD0; &#xFFFF;"),
    "\u{10ffff} \ufdd0 \uffff",
    "04.03",
  );
  equal(
    decode("&#x7F; &#x81; &#x8D; &#xD; &#1;"),
    "\x7f \x81 \x8d \r \x01",
    "04.04",
  );
  equal(decode("&#65x &#x41g", { context: "attribute" }), "Ax Ag", "04.05");
  const recovered = Array.from({ length: 32 }, (_, i) =>
    decode(`&#${i + 128};`),
  ).join("");
  equal(recovered, "€\x81‚ƒ„…†‡ˆ‰Š‹Œ\x8dŽ\x8f\x90‘’“”•–—˜™š›œ\x9džŸ", "04.06");
});

test("05 - huge numeric runs consume every digit without numeric overflow", () => {
  equal(decode(`a&#${"9".repeat(100000)};b`), "a�b", "05.01");
  equal(decode(`a&#x${"F".repeat(100000)};b`), "a�b", "05.02");
  equal(decode(`&#${"0".repeat(100000)}65;`), "A", "05.03");
  equal(decode(`&#x${"0".repeat(100000)}41;`), "A", "05.04");
  equal(decode(`&${"q".repeat(100000)};`), `&${"q".repeat(100000)};`, "05.05");
});

test("06 - strict rejects parse errors independently from semicolon acceptance", () => {
  for (const str of [
    "&copy",
    "&notit;",
    "&madeup;",
    "&#;",
    "&#x;",
    "&#65",
    "&#0;",
    "&#xD800;",
    "&#1114112;",
    "&#xFFFF;",
    "&#xFDD0;",
    "&#x10FFFF;",
    "&#13;",
    "&#1;",
    "&#127;",
    "&#128;",
    "&#x8D;",
  ]) {
    throws(() => decode(str, { strict: true }), /Parse error/, str);
  }
  equal(
    decode("&#9; &#10; &#12; &#x2FFFD; &notin;", { strict: true }),
    "\t \n \f \u{2fffd} ∉",
    "06.01",
  );
  equal(
    decode("&copy=1 &copyx &notit;", { context: "attribute", strict: true }),
    "&copy=1 &copyx &notit;",
    "06.02",
  );
  equal(decode("&madeup & &;", { strict: true }), "&madeup & &;", "06.03");
  throws(
    () => decode("&#65", { strict: true, requireSemicolon: true }),
    /Parse error/,
    "06.04",
  );
  throws(
    () => decode(`&${"q".repeat(100000)};`, { strict: true }),
    /Parse error/,
    "06.05",
  );
});

test("07 - scanner returns original UTF-16 offsets", () => {
  equal(
    scanReference("𝌆x&NotEqualTilde;tail", 3),
    { end: 18, value: "≂̸" },
    "07.01",
  );
  equal(scanReference("a&notit;b", 1), { end: 5, value: "¬" }, "07.02");
  equal(scanReference("a&#x1D306;b", 1), { end: 10, value: "𝌆" }, "07.03");
  equal(scanReference("abc", 0), null, "07.04");
  equal(scanReference("&copy=1", 0, { context: "attribute" }), null, "07.05");
  equal(scanReference("&copy", 0, { requireSemicolon: true }), null, "07.06");
});

test("08 - exact named serialization policy", () => {
  equal(
    encode("≈ ` 𝌆 Å ≔ ¨ ∋ ∥", { useNamedReferences: true }),
    "&ap; &grave; &#x1D306; &angst; &colone; &die; &ni; &par;",
    "08.01",
  );
  equal(
    encode("< > & \" '", { useNamedReferences: true }),
    "&lt; &gt; &amp; &quot; &apos;",
    "08.02",
  );
  equal(
    encode("≂̸ =⃥ <⃒ >⃒ fj", { useNamedReferences: true }),
    "&nesim; &bne; &nvlt; &nvgt; fj",
    "08.03",
  );
  equal(
    encode("© 😀\ud800", { useNamedReferences: true }),
    "&copy; &#x1F600;&#xD800;",
    "08.04",
  );
  equal(
    encode("\0\t\n\r\x80\x81", { useNamedReferences: true }),
    "\0&#x9;\n\r\x80&#x81;",
    "08.05",
  );
  equal(
    encode("plain ASCII () [] {} / + ="),
    "plain ASCII () [] {} / + =",
    "08.06",
  );
});

test("09 - numeric-only encoding and round trips on valid text", () => {
  equal(
    encode("< > & \" ' ` © 𝌆"),
    "&#x3C; &#x3E; &#x26; &#x22; &#x27; &#x60; &#xA9; &#x1D306;",
    "09.01",
  );
  const text = "Αλφάβητο 中文 عربى 🍪 ≂̸ fj <tag> 'quotes' & \n";
  equal(decode(encode(text)), text, "09.02");
  equal(decode(encode(text, { useNamedReferences: true })), text, "09.03");
  equal(encode(""), "", "09.04");
});

test("10 - contextual escaping preserves quoted attributes and text", () => {
  equal(escapeAttribute("<&\"' >"), "<&amp;&quot;'&nbsp;>", "10.01");
  equal(
    escapeAttribute("<&\"' >", { quote: "single" }),
    '<&amp;"&#39;&nbsp;>',
    "10.02",
  );
  equal(
    escapeAttribute("<&\"' >", { quote: "both" }),
    "<&amp;&quot;&#39;&nbsp;>",
    "10.03",
  );
  equal(escapeText("<&\"' >"), "&lt;&amp;\"'&nbsp;&gt;", "10.04");
  equal(escapeAttribute("&amp;"), "&amp;amp;", "10.05");
  equal(escapeText(""), "", "10.06");
});

test("11 - public table mutation cannot change codec results", () => {
  const original = allNamedEntities.amp;
  try {
    allNamedEntities.amp = "changed";
    equal(decode("&amp;"), "&", "11.01");
    equal(encode("&", { useNamedReferences: true }), "&amp;", "11.02");
  } finally {
    allNamedEntities.amp = original;
  }
});

test("12 - optional progress and completion statistics remain separate", () => {
  const realNow = Date.now;
  const progress = [];
  let completion;
  let ticks = 0;
  Date.now = () => 100 + ticks++ * 5;
  try {
    const result = decode("&amp;".repeat(40000), {
      reportProgressFunc: (value) => progress.push(value),
      reportCompletionFunc: (value) => {
        completion = value;
      },
    });
    equal(result, "&".repeat(40000), "12.01");
    equal(
      completion,
      {
        inputLength: 200000,
        outputLength: 40000,
        replacements: 40000,
        timeTakenInMilliseconds: 5,
      },
      "12.02",
    );
  } finally {
    Date.now = realNow;
  }
  equal([progress[0], progress[progress.length - 1]], [0, 100], "12.03");
  ok(
    progress.length > 2 &&
      progress.every((value, index) => !index || value > progress[index - 1]),
    "12.04",
  );
  for (const operation of [encode, escapeText, escapeAttribute]) {
    const updates = [];
    let report;
    operation("&".repeat(40000), {
      reportProgressFunc: (value) => updates.push(value),
      reportCompletionFunc: (value) => {
        report = value;
      },
    });
    ok(
      updates.length > 2 &&
        updates[0] === 0 &&
        updates[updates.length - 1] === 100,
      "12.05",
    );
    ok(report.inputLength === 40000 && report.replacements === 40000, "12.06");
  }
});

test("13 - callback option mutation cannot alter transformation policy", () => {
  const decoding = {
    context: "text",
    reportProgressFunc: () => {
      decoding.context = "attribute";
    },
  };
  equal(decode("&copy=1", decoding), "©=1", "13.01");
  const encoding = {
    useNamedReferences: true,
    reportProgressFunc: () => {
      encoding.useNamedReferences = false;
    },
  };
  equal(encode("&", encoding), "&amp;", "13.02");
  const escaping = {
    quote: "single",
    reportProgressFunc: () => {
      escaping.quote = "double";
    },
  };
  equal(escapeAttribute("'", escaping), "&#39;", "13.03");
});

test("14 - public validation and version", () => {
  for (const operation of [
    decode,
    encode,
    encodeNumeric,
    escapeAttribute,
    escapeText,
  ]) {
    throws(
      () => operation(null),
      /html-entity-codec\/.*\[THROW_ID_01\]/,
      "14.01",
    );
  }
  throws(
    () => scanReference(null, 0),
    /scanReference\(\): \[THROW_ID_01\]/,
    "14.02",
  );
  throws(
    () => scanReference("&amp;", -1),
    /scanReference\(\): \[THROW_ID_02\]/,
    "14.03",
  );
  ok(/^\d+\.\d+\.\d+$/.test(version), "14.04");
});

test("15 - numeric-only entry uses the same spelling without named data", () => {
  equal(encodeNumeric("< © 𝌆"), "&#x3C; &#xA9; &#x1D306;", "15.01");
  equal(encodeNumeric("≂̸"), "&#x2242;&#x338;", "15.02");
});

test("16 - long numeric runs preserve native and observed scanner semantics", () => {
  const zeros = "0".repeat(100000);
  const inputs = [
    [`&#${zeros}65;`, "A"],
    [`&#x${zeros}1F600;`, "😀"],
    [`&#${"9".repeat(100000)};`, "�"],
    [`&#X${"F".repeat(100000)};`, "�"],
    [`&#x${zeros}D800;`, "�"],
    [`&#${zeros};`, "�"],
    [`&#${zeros}65z`, "Az"],
  ];
  equal(
    inputs.map(([input]) => decode(input)),
    inputs.map(([, expected]) => expected),
    "16.01",
  );
  equal(
    inputs.map(([input]) => decode(input, { reportProgressFunc() {} })),
    inputs.map(([, expected]) => expected),
    "16.02",
  );
  equal(
    scanReference(`x&#${zeros}65;y`, 1),
    { end: zeros.length + 6, value: "A" },
    "16.03",
  );
  equal(
    decode(`&#${zeros}65`, { requireSemicolon: true }),
    `&#${zeros}65`,
    "16.04",
  );
  equal(decode(`&#x${zeros}41;`, { strict: true }), "A", "16.05");
  throws(
    () => decode(`&#${zeros}65`, { strict: true }),
    /Parse error/,
    "16.06",
  );
  throws(
    () => decode(`&#x${zeros}D800;`, { strict: true }),
    /Parse error/,
    "16.07",
  );
  throws(
    () => decode(`&#${"9".repeat(100000)};`, { strict: true }),
    /Parse error/,
    "16.08",
  );
  equal(
    decode(
      `&#${"0".repeat(31)}65;&#${"0".repeat(32)}66;&#${"0".repeat(33)}67;`,
    ),
    "ABC",
    "16.09",
  );
});

test("17 - huge-reference progress survives option mutation and reports completion", () => {
  const input = `&#${"0".repeat(100000)}65`;
  const progress = [];
  let report;
  const options = {
    strict: false,
    requireSemicolon: false,
    reportProgressFunc(value) {
      progress.push(value);
      options.strict = true;
      options.requireSemicolon = true;
    },
    reportCompletionFunc(value) {
      report = value;
    },
  };
  equal(decode(input, options), "A", "17.01");
  equal([progress[0], progress[progress.length - 1]], [0, 100], "17.02");
  ok(
    progress.length > 2 &&
      progress.every((value, index) => !index || value > progress[index - 1]),
    "17.03",
  );
  equal(
    [report.inputLength, report.outputLength, report.replacements],
    [input.length, 1, 1],
    "17.04",
  );
});

test.run();
