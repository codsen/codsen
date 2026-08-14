import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import {
  findUnsupportedIifeApis,
  IIFE_API_SMOKES,
  IIFE_BROWSER_POLICY,
  iifeGlobalName,
} from "../browserCompatibility.js";

test("01 - declares one exact browser floor", () => {
  equal(
    IIFE_BROWSER_POLICY,
    {
      family: "Chromium",
      minimumMajor: 58,
      esbuildTarget: "chrome58",
      snapshotRevision: "454475",
      snapshotVersion: "58.0.3029.0",
      snapshotArchiveSha256:
        "c43892cbcf8d9d5402c3168aa6d14877f13597a6ed966b74f7837ac4031cadf4",
      snapshotArchiveUrl:
        "https://storage.googleapis.com/chromium-browser-snapshots/Linux_x64/454475/chrome-linux.zip",
    },
    "01.01",
  );
  equal(Object.isFrozen(IIFE_BROWSER_POLICY), true, "01.02");
});

test("02 - derives stable IIFE globals from package directories", () => {
  equal(iifeGlobalName("codsen-utils"), "codsenUtils", "02.01");
  equal(
    iifeGlobalName("array-group-str-omit-num-char"),
    "arrayGroupStrOmitNumChar",
    "02.02",
  );
  equal(iifeGlobalName("detergent"), "detergent", "02.03");
  equal(iifeGlobalName("Release-Tool"), "releaseTool", "02.04");
});

test("03 - rejects directory names outside the browser contract", () => {
  throws(() => iifeGlobalName("@scope/pkg"), /Invalid IIFE/, "03.01");
  throws(() => iifeGlobalName("snake_case"), /Invalid IIFE/, "03.02");
  throws(() => iifeGlobalName("two--hyphens"), /Invalid IIFE/, "03.03");
  throws(() => iifeGlobalName(), /Invalid IIFE/, "03.04");
  throws(() => iifeGlobalName("1-package"), /Invalid IIFE/, "03.05");
});

test("04 - reports APIs newer than the declared floor", () => {
  equal(
    findUnsupportedIifeApis(
      "Object.hasOwn(value, key); list.flatMap(fn); text.trimEnd();",
    ),
    ["Array.prototype.flatMap", "Object.hasOwn", "String.prototype.trimEnd"],
    "04.01",
  );
  equal(
    findUnsupportedIifeApis(
      "Object.prototype.hasOwnProperty.call(value, key); text.replace(/\\s+$/u, '');",
    ),
    [],
    "04.02",
  );
  equal(
    findUnsupportedIifeApis(
      'Promise.resolve().finally(done); new AbortController(); new AggregateError([]); BigInt(1); globalThis.value; new Intl.PluralRules(); Object[ "hasOwn" ](value, key);',
    ),
    [
      "AbortController",
      "AggregateError",
      "BigInt",
      "Object.hasOwn",
      "Promise.prototype.finally",
      "newer Intl constructors",
      "globalThis",
    ],
    "04.03",
  );
  equal(
    findUnsupportedIifeApis(
      'var root = typeof globalThis !== "undefined" ? globalThis : self; if (typeof globalThis === "object") return globalThis;',
    ),
    [],
    "04.04",
  );
  throws(() => findUnsupportedIifeApis(null), /must be a string/, "04.05");
});

test("05 - keeps browser smoke functions self-contained and serializable", () => {
  equal(
    Object.keys(IIFE_API_SMOKES),
    [
      "array-group-str-omit-num-char",
      "ast-deep-contains",
      "codsen-utils",
      "detergent",
      "email-comb",
      "generate-atomic-css",
      "is-language-code",
      "string-convert-indexes",
      "string-strip-html",
      "test-mixer",
    ],
    "05.01",
  );
  equal(
    Object.values(IIFE_API_SMOKES).every(
      (smoke) =>
        typeof Function(`return (${smoke.toString()});`)() === "function",
    ),
    true,
    "05.02",
  );
  equal(Object.isFrozen(IIFE_API_SMOKES), true, "05.03");
});

test.run();
