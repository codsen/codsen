import { test } from "uvu";
import { equal } from "uvu/assert";

import { m } from "./util/util.js";

test("01 - preserves the hex terminator and the following descendant separator", () => {
  const source = String.raw`<style>.\31  a{color:red}</style>`;

  equal(m(equal, source).result, source, "01.01");
});

test("02 - preserves whitespace after a six-digit hex escape", () => {
  const source = String.raw`<style>.\000031  a{color:red}</style>`;

  equal(m(equal, source).result, source, "02.01");
});

test("03 - protects terminators after one through six hex digits", () => {
  const escapes = ["3", "31", "031", "0031", "00031", "000031"];
  const results = escapes.map((digits) => {
    const source = `<style>.\\${digits}  a{color:red}</style>`;
    return m(equal, source).result === source;
  });

  equal(
    results,
    escapes.map(() => true),
    "03.01",
  );
});

test("04 - preserves every CSS whitespace terminator before a separator", () => {
  const terminators = [" ", "\t", "\n", "\f", "\r", "\r\n"];
  const results = terminators.map((terminator) => {
    const source = `<style>.\\31${terminator} a{color:red}</style>`;
    return m(equal, source).result === source;
  });

  equal(
    results,
    terminators.map(() => true),
    "04.01",
  );
});

test("05 - preserves escaped selectors in each indentation and line-break mode", () => {
  const selectors = [String.raw`.\31  a`, String.raw`.\000031  a`];
  const results = [];
  for (const removeIndentations of [false, true]) {
    for (const removeLineBreaks of [false, true]) {
      for (const selector of selectors) {
        const source = `<style>${selector}{color:red}</style>`;
        results.push(
          m(equal, source, {
            removeIndentations,
            removeLineBreaks,
            lineLengthLimit: 0,
            breakToTheLeftOf: [],
          }).result === source,
        );
      }
    }
  }

  equal(results, Array(8).fill(true), "05.01");
});

test("06 - preserves LF and CRLF terminators when removing line breaks", () => {
  const results = [];
  for (const newline of ["\n", "\r\n"]) {
    for (const digits of ["31", "000031"]) {
      const selector = `.\\${digits}${newline} a`;
      const source = `<style>${selector}{color:red}</style>`;
      results.push(
        m(equal, source, {
          removeIndentations: true,
          removeLineBreaks: true,
          lineLengthLimit: 0,
        }).result.includes(selector),
      );
    }
  }

  equal(results, Array(4).fill(true), "06.01");
});

test("07 - does not absorb following hex characters into a shortened escape", () => {
  const selectors = [
    String.raw`.\3 a`,
    String.raw`.\31 a`,
    String.raw`.\031 a`,
    String.raw`.\0031 a`,
    String.raw`.\00031 a`,
    String.raw`.\000031 a`,
    String.raw`.\000031a b`,
  ];
  const results = selectors.map((selector) => {
    const source = `<style>${selector}{color:red}</style>`;
    return (
      m(equal, source, {
        removeLineBreaks: true,
        lineLengthLimit: 0,
        breakToTheLeftOf: [],
      }).result === source
    );
  });

  equal(
    results,
    selectors.map(() => true),
    "07.01",
  );
});

test("08 - preserves descendant whitespace after escaped punctuation", () => {
  const selectors = [
    String.raw`.foo\: bar`,
    String.raw`.foo\> bar`,
    String.raw`.foo\+ bar`,
    String.raw`.foo\~ bar`,
    String.raw`.foo\, bar`,
  ];
  const results = selectors.map((selector) => {
    const source = `<style>${selector}{color:red}</style>`;
    return (
      m(equal, source, {
        removeLineBreaks: true,
        lineLengthLimit: 0,
        breakToTheLeftOf: [],
      }).result === source
    );
  });

  equal(
    results,
    selectors.map(() => true),
    "08.01",
  );
});

test("09 - preserves whitespace after odd and even backslash runs", () => {
  const results = [];
  for (const count of [1, 2, 3, 4]) {
    const slashes = "\\".repeat(count);
    const source = `<style>.${slashes}31  a{color:red}</style>`;
    results.push(m(equal, source).result === source);
  }

  equal(results, Array(4).fill(true), "09.01");
});

test("10 - preserves escaped spaces in declaration values under line wrapping", () => {
  const source = String.raw`<style>a{font-family:a\ b;color:red}</style>`;
  const results = [];
  for (const removeIndentations of [false, true]) {
    for (const removeLineBreaks of [false, true]) {
      for (const lineLengthLimit of [0, 10]) {
        const actual = m(equal, source, {
          removeIndentations,
          removeLineBreaks,
          lineLengthLimit,
        });
        results.push(actual.result.includes(String.raw`a\ b`));
      }
    }
  }

  equal(results, Array(8).fill(true), "10.01");
});

test("11 - preserves escaped selectors when a wrap would fall inside an escape", () => {
  const selectors = [
    String.raw`.\31  a`,
    String.raw`.\000031  a`,
    String.raw`.foo\: bar`,
    String.raw`.foo\ bar`,
  ];
  const results = selectors.map((selector) =>
    m(equal, `<style>${selector}{color:red}</style>`, {
      removeIndentations: true,
      removeLineBreaks: true,
      lineLengthLimit: 10,
    }).result.includes(selector),
  );

  equal(
    results,
    selectors.map(() => true),
    "11.01",
  );
});

test("12 - preserves escape-sensitive whitespace in unencoded inline CSS", () => {
  const values = [
    String.raw`font-family:\31  a`,
    String.raw`font-family:\000031  a`,
    String.raw`font-family:a\ b`,
  ];
  const results = [];
  for (const value of values) {
    for (const removeLineBreaks of [false, true]) {
      for (const quote of ['"', "'"]) {
        const source = `<div style=${quote}${value}${quote}>x</div>`;
        results.push(
          m(equal, source, {
            removeLineBreaks,
            lineLengthLimit: 10,
          }).result.includes(value.slice("font-family:".length)),
        );
      }
    }
  }

  equal(results, Array(12).fill(true), "12.01");
});

test("13 - keeps escaped trailing spaces at an unfinished style's EOF", () => {
  const sources = [
    String.raw`<style>.foo\ `,
    String.raw`<style>a{font-family:a\ `,
    `<style>a{font-family:a${"\\".repeat(3)} `,
  ];
  const results = [];
  for (const source of sources) {
    for (const removeLineBreaks of [false, true]) {
      results.push(
        m(equal, source, {
          removeLineBreaks,
          lineLengthLimit: 0,
        }).result === source,
      );
    }
  }

  equal(results, Array(6).fill(true), "13.01");
});

test("14 - keeps an escaped trailing space before an inline attribute closes", () => {
  const source = String.raw`<div style="font-family:a\ ">x</div>`;

  equal(m(equal, source).result, source, "14.01");
  equal(
    m(equal, source, {
      removeLineBreaks: true,
      lineLengthLimit: 0,
    }).result,
    source,
    "14.02",
  );
});

test("15 - leaves standalone complete escapes and ordinary compact CSS unchanged", () => {
  const sources = [
    String.raw`<style>.\31{color:red}</style>`,
    String.raw`<style>.\000031{color:red}</style>`,
    "<style>.foo{color:red}</style>",
    '<div style="color:red">x</div>',
  ];
  const results = sources.map((source) => {
    const actual = m(equal, source);
    return [actual.result === source, actual.ranges];
  });

  equal(
    results,
    sources.map(() => [true, null]),
    "15.01",
  );
});

test("16 - still minifies ordinary whitespace around CSS punctuation", () => {
  equal(
    m(equal, "<style>  .foo > .bar { color: red; margin: 0; }  </style>", {
      removeLineBreaks: true,
      lineLengthLimit: 0,
      breakToTheLeftOf: [],
    }).result,
    "<style>.foo>.bar{color:red;margin:0;}</style>",
    "16.01",
  );
});

test("17 - keeps invalid newline escapes and dangling backslashes unchanged", () => {
  const sources = [
    ...["\n", "\r", "\r\n", "\f"].map(
      (newline) => `<style>.a\\${newline} b{color:red}</style>`,
    ),
    "<style>.a\\",
  ];
  const results = sources.map(
    (source) =>
      m(equal, source, {
        removeLineBreaks: true,
        lineLengthLimit: 0,
        breakToTheLeftOf: [],
      }).result === source,
  );

  equal(
    results,
    sources.map(() => true),
    "17.01",
  );
});

test.run();
