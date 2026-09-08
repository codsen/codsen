import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import { readCssToken } from "../dist/string-extract-class-names.esm.js";

function tokens(str) {
  const result = [];
  for (let i = 0; i < str.length; ) {
    const token = readCssToken(str, i);
    result.push(token);
    i = token.range[1];
  }
  return result;
}

test("01 - validates input and returns null outside the region", () => {
  throws(() => readCssToken(null, 0), /readCssToken\(\): \[THROW_ID_06\]/);
  for (const start of [undefined, null, "0", 0.5, NaN, Infinity]) {
    throws(() => readCssToken("a", start), /readCssToken\(\): \[THROW_ID_07\]/);
  }
  for (const [str, start] of [
    ["", 0],
    ["a", -1],
    ["a", 1],
    ["a", 100],
  ]) {
    equal(readCssToken(str, start), null, "01.01");
  }
});

test("02 - punctuation and numeric grammar use individual delimiters", () => {
  const str = ".#{}[](),:;~+*/!%012-@\\\n";
  equal(
    tokens(str).map(({ kind, value }) => [kind, value]),
    [...str].map((value) => [
      value === "\n" ? "whitespace" : "delimiter",
      value,
    ]),
    "02.01",
  );
  equal(
    readCssToken("@1", 0),
    {
      kind: "delimiter",
      value: "@",
      raw: "@",
      range: [0, 1],
    },
    "02.02",
  );
  equal(readCssToken("@-", 0).kind, "delimiter", "02.03");
});

test("03 - whitespace retains its complete raw spelling", () => {
  equal(
    readCssToken("x \t\r\n\f y", 1),
    {
      kind: "whitespace",
      value: " \t\r\n\f ",
      raw: " \t\r\n\f ",
      range: [1, 7],
    },
    "03.01",
  );
  equal(readCssToken("\u00a0", 0).kind, "identifier", "03.02");
});

test("04 - escaped punctuation belongs to one identifier", () => {
  const raw = String.raw`a\,b\{c\}d\@e\"f\:g\ h`;
  equal(
    readCssToken(`.${raw}{`, 1),
    {
      kind: "identifier",
      value: 'a,b{c}d@e"f:g h',
      raw,
      range: [1, raw.length + 1],
    },
    "04.01",
  );
  equal(
    readCssToken(String.raw`a\\"b`, 0),
    {
      kind: "identifier",
      value: "a\\",
      raw: "a\\\\",
      range: [0, 3],
    },
    "04.02",
  );
  equal(readCssToken("\\", 0).value, "\uFFFD", "04.03");
  equal(readCssToken("--x", 0).value, "--x", "04.04");
  equal(readCssToken("-x", 0).value, "-x", "04.05");
});

test("05 - hex escapes consume their terminator but preserve separation", () => {
  for (let digits = 1; digits <= 6; digits++) {
    for (const whitespace of [" ", "\t", "\r", "\n", "\r\n", "\f"]) {
      const raw = `\\${"0".repeat(digits - 1)}a${whitespace}`;
      equal(
        tokens(`${raw} a`).map(({ kind, value, range }) => [
          kind,
          value,
          range,
        ]),
        [
          ["identifier", "\n", [0, raw.length]],
          ["whitespace", " ", [raw.length, raw.length + 1]],
          ["identifier", "a", [raw.length + 1, raw.length + 2]],
        ],
        "05.01",
      );
    }
  }
  equal(readCssToken(String.raw`\000031a`, 0).value, "1a", "05.02");
  equal(readCssToken(String.raw`\31a`, 0).value, "\u031a", "05.03");
});

test("06 - names and ranges preserve Unicode preprocessing", () => {
  const raw = "🦄a\u0000\ud800\udc00\udfff\\🦊";
  equal(
    readCssToken(`!${raw}`, 1),
    {
      kind: "identifier",
      value: "🦄a\uFFFD𐀀\uFFFD🦊",
      raw,
      range: [1, raw.length + 1],
    },
    "06.01",
  );
  equal(
    readCssToken(String.raw`\0\d800\110000`, 0).value,
    "\uFFFD\uFFFD\uFFFD",
    "06.02",
  );
});

test("07 - at-keywords and functions expose decoded names", () => {
  equal(
    readCssToken(String.raw`@m\65 dia all`, 0),
    {
      kind: "at-keyword",
      value: "media",
      raw: String.raw`@m\65 dia`,
      range: [0, 9],
    },
    "07.01",
  );
  equal(
    readCssToken("@url(foo)", 0),
    {
      kind: "at-keyword",
      value: "url",
      raw: "@url",
      range: [0, 4],
    },
    "07.02",
  );
  equal(
    readCssToken(String.raw`f\6f o(x)`, 0),
    {
      kind: "function",
      value: "foo",
      raw: String.raw`f\6f o(`,
      range: [0, 7],
    },
    "07.03",
  );
  equal(
    tokens("url (x)").map(({ kind }) => kind),
    ["identifier", "whitespace", "delimiter", "identifier", "delimiter"],
    "07.04",
  );
});

test("08 - strings consume escapes and newline continuations", () => {
  for (const quote of ['"', "'"]) {
    for (const newline of ["\n", "\r", "\r\n", "\f"]) {
      const raw = `${quote}a\\${quote}/*data*/\\${newline}b\\31 c${quote}`;
      equal(
        readCssToken(raw, 0),
        {
          kind: "string",
          value: `a${quote}/*data*/b1c`,
          raw,
          range: [0, raw.length],
        },
        "08.01",
      );
    }
  }
  equal(
    readCssToken('"a\\\\"b', 0),
    {
      kind: "string",
      value: "a\\",
      raw: '"a\\\\"',
      range: [0, 5],
    },
    "08.02",
  );
  equal(readCssToken('"🦊\u0000\ud800"', 0).value, "🦊\uFFFD\uFFFD", "08.03");
});

test("09 - bad strings leave newlines available and EOF closes strings", () => {
  for (const newline of ["\n", "\r", "\r\n", "\f"]) {
    equal(
      readCssToken(`"a${newline}b`, 0),
      {
        kind: "bad-string",
        value: "a",
        raw: '"a',
        range: [0, 2],
      },
      "09.01",
    );
    equal(readCssToken(`"a${newline}b`, 2).kind, "whitespace", "09.02");
  }
  for (const raw of ['"', '"a', '"a\\']) {
    equal(
      readCssToken(raw, 0),
      {
        kind: "string",
        value: raw === '"' ? "" : "a",
        raw,
        range: [0, raw.length],
      },
      "09.03",
    );
  }
});

test("10 - quoted URL arguments remain separate function and string tokens", () => {
  for (const quote of ['"', "'"]) {
    const str = `u\\72 l( \t${quote}a/*data*/b${quote})`;
    equal(
      tokens(str).map(({ kind, value }) => [kind, value]),
      [
        ["function", "url"],
        ["whitespace", " \t"],
        ["string", "a/*data*/b"],
        ["delimiter", ")"],
      ],
      "10.01",
    );
    equal(readCssToken(`URL(${quote}x${quote})`, 0).raw, "URL(", "10.02");
  }
});

test("11 - unquoted URLs retain apparent comments and escaped delimiters", () => {
  for (const name of ["url", "UrL", String.raw`u\72 l`]) {
    const raw = `${name}(  foo\\/*bar*/baz\\)\\20 x  )`;
    equal(
      readCssToken(`!${raw};`, 1),
      {
        kind: "url",
        value: "foo/*bar*/baz) x",
        raw,
        range: [1, raw.length + 1],
      },
      "11.01",
    );
  }
  equal(readCssToken("url(foo/**/bar)", 0).value, "foo/**/bar", "11.02");
  equal(
    readCssToken("url(🦊\u0000\ud800)", 0).value,
    "🦊\uFFFD\uFFFD",
    "11.03",
  );
  for (const raw of ["url(", "url(  ", "url()", "url(  )"]) {
    equal(
      readCssToken(raw, 0),
      {
        kind: "url",
        value: "",
        raw,
        range: [0, raw.length],
      },
      "11.04",
    );
  }
  equal(readCssToken("url(a ", 0).value, "a", "11.05");
  equal(readCssToken("url(a", 0).value, "a", "11.06");
  equal(readCssToken("url(a\\", 0).value, "a\uFFFD", "11.07");
});

test("12 - bad URL recovery consumes escaped closers and ignores comments", () => {
  for (const invalid of [
    '"',
    "'",
    "(",
    "\u0001",
    "\u000b",
    "\u001f",
    "\u007f",
    " x",
    "\\\n",
  ]) {
    const raw = `url(a${invalid}b\\)c\\29 d/*)*/`;
    const end = raw.indexOf("/*") + 3;
    equal(
      readCssToken(raw, 0),
      {
        kind: "bad-url",
        value: "",
        raw: raw.slice(0, end),
        range: [0, end],
      },
      "12.01",
    );
  }
  for (const raw of ["url(a b", "url(a b\\", "url(a\\\n", "url(a b\\29 "]) {
    equal(
      readCssToken(raw, 0),
      {
        kind: "bad-url",
        value: "",
        raw,
        range: [0, raw.length],
      },
      "12.02",
    );
  }
});

test("13 - comments end at the first closing marker or region end", () => {
  equal(
    tokens("/**//*x*/").map(({ kind, value, range }) => [kind, value, range]),
    [
      ["comment", "", [0, 4]],
      ["comment", "x", [4, 9]],
    ],
    "13.01",
  );
  for (const raw of ["/*", "/*/", "/*'\\\n🦊"]) {
    equal(
      readCssToken(raw, 0),
      {
        kind: "comment",
        value: raw.slice(2),
        raw,
        range: [0, raw.length],
      },
      "13.02",
    );
  }
  equal(readCssToken("/*x/*y*/z", 0).raw, "/*x/*y*/", "13.03");
});

test("14 - sequential reading keeps structural punctuation outside data", () => {
  const str = String.raw`@m\65 dia all{.a\,b{--x:a\}b;content:"a\"}b";background:url(foo\/*x*/)}}`;
  const result = tokens(str);
  equal(
    result
      .filter(({ kind }) => kind === "delimiter")
      .map(({ value }) => value)
      .join(""),
    "{.{:;:;:}}",
    "14.01",
  );
  equal(result.map(({ raw }) => raw).join(""), str, "14.02");
  equal(
    result.map(({ range }) => str.slice(...range)),
    result.map(({ raw }) => raw),
    "14.03",
  );
});

test.run();
