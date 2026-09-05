import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { test } from "uvu";
import { equal, not, throws } from "uvu/assert";

import {
  CheckTypesMiniError,
  checkTypesMini,
} from "../dist/check-types-mini.esm.js";

function diagnostic(value) {
  try {
    checkTypesMini({ value }, null, { schema: { value: "unmatched-type" } });
  } catch (error) {
    if (error instanceof CheckTypesMiniError) return error.toJSON();
    throw error;
  }
  throw new Error("Expected a type mismatch");
}

test("01 - primitive labels include null, symbols, bigint and every function kind", () => {
  const values = [
    undefined,
    null,
    false,
    true,
    0,
    Number.NaN,
    Infinity,
    "",
    Symbol("value"),
    1n,
    () => {},
    async () => {},
    function* () {},
    async function* () {},
    class Value {},
  ];
  equal(
    values.map((value) => diagnostic(value).actualType),
    [
      "undefined",
      "null",
      "boolean",
      "boolean",
      "number",
      "number",
      "number",
      "string",
      "symbol",
      "bigint",
      "function",
      "function",
      "function",
      "function",
      "function",
    ],
    "01.01",
  );
});

test("02 - native objects retain distinct schema and diagnostic labels", () => {
  const values = [
    [[], "array"],
    [{}, "object"],
    [Object.create(null), "object"],
    [new Date(0), "date"],
    [new Date(Number.NaN), "date"],
    [/x/, "regexp"],
    [new Map(), "map"],
    [new Set(), "set"],
    [new WeakMap(), "weakmap"],
    [new WeakSet(), "weakset"],
    [Promise.resolve(), "promise"],
    [new Error("value"), "error"],
    [new TypeError("value"), "error"],
    [new ArrayBuffer(4), "arraybuffer"],
    [new DataView(new ArrayBuffer(4)), "dataview"],
    [new Uint8Array(4), "uint8array"],
    [new Uint16Array(4), "uint16array"],
    [new Float64Array(4), "float64array"],
    [Buffer.from("value"), "uint8array"],
    [Object("value"), "string"],
    [Object(1), "number"],
    [Object(false), "boolean"],
    [Object(Symbol("value")), "symbol"],
    [Object(1n), "bigint"],
    [
      (function () {
        // biome-ignore lint/complexity/noArguments: Exercise an arguments object, not a rest array.
        return arguments;
      })(),
      "arguments",
    ],
    [[][Symbol.iterator](), "array iterator"],
    [""[Symbol.iterator](), "string iterator"],
    [new Map().entries(), "map iterator"],
    [new Set().entries(), "set iterator"],
  ];
  equal(
    values.map(([value]) => diagnostic(value).actualType),
    values.map(([, label]) => label),
    "02.01",
  );
  not.throws(() => {
    for (const [value, label] of values) {
      checkTypesMini({ value }, null, {
        schema: { value: label.toUpperCase() },
      });
    }
  }, "02.02");
});

test("03 - reference checks distinguish boxed primitives from primitives", () => {
  for (const value of ["text", 1, false, Symbol("value"), 1n]) {
    throws(
      () => checkTypesMini({ value: Object(value) }, { value }),
      /THROW_ID_21/,
      "03.01",
    );
    not.throws(
      () => checkTypesMini({ value: Object(value) }, { value: Object(value) }),
      "03.02",
    );
  }
});

test("04 - custom string tags retain case in reference comparisons", () => {
  class Tagged {
    constructor(tag) {
      this[Symbol.toStringTag] = tag;
    }
  }
  const value = new Tagged("CustomValue");
  equal(diagnostic(value).actualType, "customvalue", "04.01");
  not.throws(
    () => checkTypesMini({ value }, null, { schema: { value: "CUSTOMVALUE" } }),
    "04.02",
  );
  not.throws(
    () => checkTypesMini({ value }, { value: new Tagged("CustomValue") }),
    "04.03",
  );
  throws(
    () => checkTypesMini({ value }, { value: new Tagged("customvalue") }),
    /THROW_ID_21/,
    "04.04",
  );
  equal(diagnostic(new Tagged(123)).actualType, "object", "04.05");
  equal(diagnostic(new Tagged("")).actualType, "", "04.06");
});

test("05 - array tags take precedence and non-string tags are ignored", () => {
  const tagged = [];
  tagged[Symbol.toStringTag] = "CustomArray";
  equal(diagnostic(tagged).actualType, "customarray", "05.01");
  tagged[Symbol.toStringTag] = false;
  equal(diagnostic(tagged).actualType, "array", "05.02");
  const inherited = Object.create({ [Symbol.toStringTag]: "Inherited" });
  equal(diagnostic(inherited).actualType, "inherited", "05.03");
});

test("06 - native subclasses and cross-realm values keep their native labels", () => {
  class CustomDate extends Date {}
  class CustomMap extends Map {}
  class CustomObject {}
  equal(
    [new CustomDate(0), new CustomMap(), new CustomObject()].map(
      (value) => diagnostic(value).actualType,
    ),
    ["date", "map", "object"],
    "06.01",
  );
  const values = runInNewContext(
    "[[], {}, Object.create(null), new Date(0), /x/, new Map(), new Set(), new Uint8Array(1), Promise.resolve(), Object(1)]",
  );
  equal(
    Array.from(values, (value) => diagnostic(value).actualType),
    [
      "array",
      "object",
      "object",
      "date",
      "regexp",
      "map",
      "set",
      "uint8array",
      "promise",
      "number",
    ],
    "06.02",
  );
});

test("07 - acceptArrays uses the same labels for schema and reference checks", () => {
  not.throws(
    () =>
      checkTypesMini(
        { value: [new Date(0), new Date(1)] },
        { value: new Date(2) },
        { acceptArrays: true },
      ),
    "07.01",
  );
  not.throws(
    () =>
      checkTypesMini({ value: [new Map(), new Set()] }, null, {
        acceptArrays: true,
        schema: { value: ["map", "set"] },
      }),
    "07.02",
  );
  let caught;
  try {
    checkTypesMini(
      { value: [new Map(), new Set()] },
      { value: new Map() },
      { acceptArrays: true },
    );
  } catch (error) {
    caught = error;
  }
  equal(
    [
      caught.validatorCode,
      caught.actualType,
      caught.expectedTypes,
      caught.path,
    ],
    ["THROW_ID_20", "set", ["map"], ["value", "1"]],
    "07.03",
  );
});

test("08 - the local global object retains its label", () => {
  equal(diagnostic(globalThis).actualType, "global", "08.01");
});

test("09 - the browser bundle supports globals without globalThis", () => {
  const source = readFileSync(
    new URL("../dist/check-types-mini.umd.js", import.meta.url),
    "utf8",
  );
  const result = runInNewContext(`
    self = this;
    globalThis = undefined;
    ${source}
    [self, new Date(0), /x/, new Map(), new Uint8Array(1), { [Symbol.toStringTag]: "Custom" }].map(value => {
      try {
        checkTypesMini.checkTypesMini({ value }, null, { schema: { value: "unmatched-type" } });
      } catch (error) {
        return error.actualType;
      }
    });
  `);
  equal(
    Array.from(result),
    ["global", "date", "regexp", "map", "uint8array", "custom"],
    "09.01",
  );
});

test("10 - native prototype labels survive non-string tag overrides", () => {
  const values = [
    [Object.create(Date.prototype), "date"],
    [Object.create(RegExp.prototype), "regexp"],
    [new Map(), "map"],
    [new Set(), "set"],
    [new WeakMap(), "weakmap"],
    [new WeakSet(), "weakset"],
    [Promise.resolve(), "promise"],
    [new DataView(new ArrayBuffer(1)), "dataview"],
    [new Map().entries(), "map iterator"],
    [new Set().entries(), "set iterator"],
    [[][Symbol.iterator](), "array iterator"],
    [""[Symbol.iterator](), "string iterator"],
  ];
  for (const [value] of values)
    Object.defineProperty(value, Symbol.toStringTag, { value: null });
  equal(
    values.map(([value]) => diagnostic(value).actualType),
    values.map(([, label]) => label),
    "10.01",
  );
});

test("11 - browser host aliases remain compatible without globalThis", () => {
  const source = readFileSync(
    new URL("../dist/check-types-mini.umd.js", import.meta.url),
    "utf8",
  );
  const result = runInNewContext(`
    self = window = this;
    globalThis = undefined;
    location = {};
    document = {};
    navigator = { mimeTypes: {}, plugins: {} };
    HTMLElement = class {
      constructor(tagName) { this.tagName = tagName; }
    };
    ${source}
    [location, document, navigator.mimeTypes, navigator.plugins,
      new HTMLElement("BLOCKQUOTE"), new HTMLElement("TD"), new HTMLElement("TH"),
      new HTMLElement("DIV"), new Date(0)].map(value => {
      try {
        checkTypesMini.checkTypesMini({ value }, null, { schema: { value: "unmatched-type" } });
      } catch (error) {
        return error.actualType;
      }
    });
  `);
  equal(
    Array.from(result),
    [
      "location",
      "document",
      "mimetypearray",
      "pluginarray",
      "htmlquoteelement",
      "htmltabledatacellelement",
      "htmltableheadercellelement",
      "object",
      "date",
    ],
    "11.01",
  );
});

test.run();
