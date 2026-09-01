import { test } from "uvu";
import { equal, match, throws } from "uvu/assert";
import { decodeJson, formatJson } from "../json-formatter.js";

test("01 - preserves every JSON number token and special object name", () => {
  const source =
    '{"z":9007199254740993,"a":1e400,"fraction":0.12345678901234567890,"negative":-0,"__proto__":{"z":1}}';

  equal(
    formatJson(source).output,
    `{
  "__proto__": {
    "z": 1
  },
  "a": 1e400,
  "fraction": 0.12345678901234567890,
  "negative": -0,
  "z": 9007199254740993
}\n`,
    "01.01",
  );
});

test("02 - rejects duplicate decoded member names", () => {
  throws(
    () => formatJson('{"a":1,"\\u0061":2}'),
    /Duplicate object member "a"/,
    "02.01",
  );
});

test("03 - rejects malformed UTF-8 before parsing", () => {
  throws(
    () =>
      decodeJson(
        Buffer.from([0x7b, 0x22, 0x61, 0x22, 0x3a, 0x22, 0x80, 0x22, 0x7d]),
      ),
    /Input is not valid UTF-8/,
    "03.01",
  );
});

test("04 - uses locale-independent code-unit array order", () => {
  equal(
    formatJson('["å","z","A","ä","a"]', { arrays: true }).output,
    '[\n  "A",\n  "a",\n  "z",\n  "ä",\n  "å"\n]\n',
    "04.01",
  );
});

test("05 - compares and returns the exact canonical byte sequence", () => {
  const canonical = '{\r\n  "a": 1\r\n}\r\n';
  equal(formatJson(canonical).changed, false, "05.01");
  equal(formatJson(canonical.slice(0, -2)).changed, true, "05.02");
  equal(formatJson(canonical.slice(0, -2)).output, canonical, "05.03");
});

test("06 - indentation zero produces valid minified output", () => {
  equal(
    formatJson('{"z":1,"a":{"d":4,"b":2}}', {
      indentationCount: 0,
    }).output,
    '{"a":{"b":2,"d":4},"z":1}\n',
    "06.01",
  );
});

test("07 - parses, sorts and serializes deeply nested JSON iteratively", () => {
  const depth = 10_000;
  const source = `${"[".repeat(depth)}0${"]".repeat(depth)}`;

  equal(
    formatJson(source, { indentationCount: 0 }).output,
    `${source}\n`,
    "07.01",
  );
});

test("08 - applies package order only to an exact package.json basename", () => {
  const source = '{"dependencies":{},"name":"fixture","lect":{},"tap":{}}';
  equal(
    formatJson(source, { filePath: "/tmp/package.json" }).output,
    '{\n  "name": "fixture",\n  "tap": {},\n  "lect": {},\n  "dependencies": {}\n}\n',
    "08.01",
  );
  equal(
    formatJson(source, { filePath: "/tmp/my-package.json" }).output,
    '{\n  "dependencies": {},\n  "lect": {},\n  "name": "fixture",\n  "tap": {}\n}\n',
    "08.02",
  );
});

test("09 - accepts one leading BOM and valid supplementary Unicode", () => {
  const formatted = formatJson(Buffer.from('\uFEFF{"z":"😀","a":"é"}'));
  equal(formatted.output, '{\n  "a": "é",\n  "z": "😀"\n}\n', "09.01");
  equal(formatted.changed, true, "09.02");
});

test("10 - validates formatting options before transformation", () => {
  throws(
    () => formatJson("{}", { indentationCount: 11 }),
    /indentationCount must be an integer from 0 to 10/,
    "10.01",
  );
  throws(
    () => formatJson("{}", { lineEnding: "bogus" }),
    /lineEnding must be "cr", "crlf" or "lf"/,
    "10.02",
  );
});

test("11 - reports malformed syntax with a stable package error", () => {
  throws(
    () => formatJson('{"a":}'),
    /json-sort-cli\/parseJson\(\): \[THROW_ID_01\]/,
    "11.01",
  );
  throws(() => formatJson("[1,]"), /Expected a JSON value/, "11.02");
});

test("12 - keeps valid non-ASCII strings intact", () => {
  const output = formatJson('{"東京":"東京","é":"é"}').output;
  match(output, /"東京": "東京"/, "12.01");
  match(output, /"é": "é"/, "12.02");
});

test("13 - classifies malformed JSON grammar", () => {
  const fixtures = [
    '"line\nfeed"',
    '"\\u12xz"',
    '"\\x"',
    '"unterminated',
    "",
    "1 2",
    "[,]",
    '{"a" 1}',
    '{"a":1 "b":2}',
    "[1 2]",
    "{]",
  ];

  equal(
    fixtures.map((fixture) => {
      try {
        formatJson(fixture);
        return false;
      } catch (error) {
        return error.message.startsWith(
          "json-sort-cli/parseJson(): [THROW_ID_01]",
        );
      }
    }),
    fixtures.map(() => true),
    "13.01",
  );
});

test("14 - supports every scalar and empty container", () => {
  equal(formatJson("true").output, "true\n", "14.01");
  equal(formatJson("false").output, "false\n", "14.02");
  equal(formatJson("null").output, "null\n", "14.03");
  equal(formatJson('"text"').output, '"text"\n', "14.04");
  equal(formatJson("{}").output, "{}\n", "14.05");
  equal(formatJson("[]").output, "[]\n", "14.06");
  throws(() => decodeJson({}), /Input must be a string or Uint8Array/, "14.07");
});

test("15 - puts unknown private package keys after public keys", () => {
  equal(
    formatJson('{"_private":1,"zzz":2,"name":"fixture","aaa":3}', {
      filePath: "C:\\tmp\\package.json",
    }).output,
    '{\n  "name": "fixture",\n  "aaa": 3,\n  "zzz": 2,\n  "_private": 1\n}\n',
    "15.01",
  );
});

test("16 - decodes valid short string escapes", () => {
  equal(
    formatJson(String.raw`{"quote":"\"","line":"a\nb"}`).output,
    `${String.raw`{
  "line": "a\nb",
  "quote": "\""
}`}
`,
    "16.01",
  );
});

test("17 - rejects more than one leading BOM", () => {
  throws(
    () => formatJson(Buffer.from("\uFEFF\uFEFF{}")),
    /Unexpected token/,
    "17.01",
  );
});

test.run();
