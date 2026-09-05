import { test } from "uvu";
import { equal, ok, throws } from "uvu/assert";

import {
  createMatcher,
  defaults,
  matchTypos,
  version,
} from "../dist/string-typo-match.esm.js";
import { semantic } from "../test-util/oracle.js";

test("01 - exports and frozen initial defaults", () => {
  equal(
    [typeof matchTypos, typeof createMatcher, typeof version],
    ["function", "function", "string"],
    "01.01",
  );
  ok(/^\d+\.\d+\.\d+/.test(version), "01.02");
  equal(
    defaults,
    {
      maxEvents: 1,
      maxCost: 200,
      minCostGap: 25,
      minInputLength: 3,
      maxOmissionLength: 4,
      maxOmissionRatio: 0.5,
      keyboard: null,
      costs: {
        missingCharacter: 100,
        omissionOpen: 100,
        omissionExtend: 20,
        extraCharacter: 100,
        repeatedCharacter: 75,
        adjacentSwap: 100,
        keyboardSubstitution: 75,
        substitution: 150,
      },
    },
    "01.03",
  );
  ok(Object.isFrozen(defaults) && Object.isFrozen(defaults.costs), "01.04");
  throws(
    () => {
      defaults.maxCost = 0;
    },
    TypeError,
    "01.05",
  );
  throws(
    () => {
      defaults.costs.substitution = 1;
    },
    TypeError,
    "01.06",
  );
  equal(matchTypos("rest", ["test"]).matches[0].cost, 150, "01.07");
});

test("02 - partial nested costs preserve all other weights", () => {
  equal(
    matchTypos("rest", ["test"], {
      costs: { repeatedCharacter: 60 },
    }).matches[0].cost,
    150,
    "02.01",
  );
  equal(
    matchTypos("nbssp", ["nbsp"], {
      costs: { repeatedCharacter: 60 },
    }).matches[0].cost,
    60,
    "02.02",
  );
});

test("03 - candidate arrays and scoring configuration are snapshotted", () => {
  const candidates = ["test", "toast", "test"];
  const options = {
    keyboard: { t: ["r"] },
    costs: { keyboardSubstitution: 60 },
  };
  const matcher = createMatcher(candidates, options);
  const before = semantic(matcher.match("rest"));
  candidates[0] = "rest";
  candidates.push("reset");
  options.keyboard.t[0] = "x";
  options.keyboard.t.push("z");
  options.costs.keyboardSubstitution = 190;
  options.maxCost = 0;
  equal(semantic(matcher.match("rest")), before, "03.01");
  equal(
    [matcher.log.candidateCount, matcher.log.uniqueCandidateCount],
    [3, 2],
    "03.02",
  );
});

test("04 - preparing never mutates frozen caller inputs", () => {
  const candidates = Object.freeze(["test", "toast", "test"]);
  const options = Object.freeze({
    keyboard: Object.freeze({ t: Object.freeze(["r"]) }),
    costs: Object.freeze({ keyboardSubstitution: 60 }),
  });
  equal(matchTypos("rest", candidates, options).bestMatch, "test", "04.01");
});

test("05 - one-shot and prepared operations have equivalent semantic results", () => {
  const candidates = [
    "nbsp",
    "ensp",
    "nsup",
    "rsqb",
    "rsquo",
    "Levenstein",
    "nbsp",
  ];
  const options = { maxEvents: 2, keyboard: { q: ["w"] } };
  const matcher = createMatcher(candidates, options);
  for (const input of [
    "nsp",
    "rsqo",
    "Lenstein",
    "nbsp",
    "q",
    "zzzzzzzzz",
    "",
  ]) {
    equal(
      semantic(matcher.match(input)),
      semantic(matchTypos(input, candidates, options)),
      `05.01 - ${JSON.stringify(input)}`,
    );
  }
});

test("06 - result mutations do not affect later prepared lookups", () => {
  const matcher = createMatcher(["nbsp", "ensp"]);
  const before = semantic(matcher.match("nsp"));
  const changed = matcher.match("nsp");
  changed.matches[0].candidate = "changed";
  changed.matches[0].operations[0].cost = 0;
  changed.matches.push({ candidate: "injected" });
  changed.log.uniqueCandidateCount = 0;
  equal(semantic(matcher.match("nsp")), before, "06.01");
});

test("07 - candidate and input types are validated without coercion", () => {
  for (const input of [undefined, null, false, 1, {}, [], new String("test")]) {
    throws(
      () => matchTypos(input, ["test"]),
      /^string-typo-match\/matchTypos\(\): \[THROW_ID_01\]/,
      "07.01",
    );
  }
  for (const candidates of [
    undefined,
    null,
    "test",
    false,
    {},
    new Set(["test"]),
  ]) {
    throws(
      () => createMatcher(candidates),
      /^string-typo-match\/createMatcher\(\): \[THROW_ID_02\]/,
      "07.02",
    );
  }
  for (const candidates of [[""], [null], [1], [[]], new Array(2)]) {
    throws(
      () => createMatcher(candidates),
      /^string-typo-match\/createMatcher\(\): \[THROW_ID_03\]/,
      "07.03",
    );
  }
});

test("08 - options reject invalid containers unknown fields and callback types", () => {
  for (const options of [null, false, 1, "qwerty", [], new Date()]) {
    throws(() => matchTypos("rest", ["test"], options), /THROW_ID_04/, "08.01");
  }
  throws(
    () => createMatcher(["test"], { maxDistance: 1 }),
    /THROW_ID_05/,
    "08.02",
  );
  throws(
    () => matchTypos("rest", ["test"], { progressFn: 1 }),
    /THROW_ID_06/,
    "08.03",
  );
  const matcher = createMatcher(["test"]);
  throws(() => matcher.match("rest", { maxCost: 1 }), /THROW_ID_05/, "08.04");
  throws(
    () => matcher.match("rest", { progressFn: false }),
    /THROW_ID_06/,
    "08.05",
  );
  throws(
    () => matcher.match(null),
    /^string-typo-match\/match\(\): \[THROW_ID_01\]/,
    "08.06",
  );
});

test("09 - numeric domains reject invalid event limits and integer policy fields", () => {
  for (const maxEvents of [0, 3, 1.5, NaN, Infinity, "1", true]) {
    throws(() => createMatcher([], { maxEvents }), /THROW_ID_07/, "09.01");
  }
  for (const key of [
    "maxCost",
    "minCostGap",
    "minInputLength",
    "maxOmissionLength",
  ]) {
    for (const value of [
      -1,
      0.5,
      NaN,
      Infinity,
      Number.MAX_SAFE_INTEGER + 1,
      "1",
      null,
    ]) {
      throws(
        () => createMatcher([], { [key]: value }),
        /THROW_ID_08/,
        `09.02 - ${key} ${value}`,
      );
    }
  }
  for (const key of ["minInputLength", "maxOmissionLength"]) {
    throws(() => createMatcher([], { [key]: 0 }), /THROW_ID_08/, "09.03");
  }
  equal(
    matchTypos("test", ["test"], { maxCost: 0, minCostGap: 0 }).status,
    "exact",
    "09.04",
  );
  equal(
    matchTypos("rest", ["test"], { maxCost: 0 }).status,
    "no-match",
    "09.05",
  );
});

test("10 - omission ratios and cost objects are validated", () => {
  for (const maxOmissionRatio of [-0.1, 1.1, Infinity, NaN, "0.5", null]) {
    throws(
      () => createMatcher([], { maxOmissionRatio }),
      /THROW_ID_09/,
      "10.01",
    );
  }
  for (const costs of [null, [], false, 1, "100"]) {
    throws(() => createMatcher([], { costs }), /THROW_ID_10/, "10.02");
  }
  throws(
    () => createMatcher([], { costs: { insertion: 10 } }),
    /THROW_ID_11/,
    "10.03",
  );
  for (const key of Object.keys(defaults.costs)) {
    for (const value of [
      -1,
      0.5,
      Infinity,
      NaN,
      Number.MAX_SAFE_INTEGER + 1,
      "100",
      null,
    ]) {
      throws(
        () => createMatcher([], { costs: { [key]: value } }),
        /THROW_ID_12/,
        `10.04 - ${key} ${value}`,
      );
    }
    if (key !== "omissionExtend") {
      throws(
        () => createMatcher([], { costs: { [key]: 0 } }),
        /THROW_ID_12/,
        "10.05",
      );
    }
  }
  equal(
    matchTypos("Lenstein", ["Levenstein"], { costs: { omissionExtend: 0 } })
      .matches[0].cost,
    100,
    "10.06",
  );
});

test("11 - blocks cannot undercut missing characters or overflow", () => {
  throws(
    () =>
      createMatcher([], {
        costs: { omissionOpen: 1, omissionExtend: 1 },
      }),
    /THROW_ID_13/,
    "11.01",
  );
  throws(
    () =>
      createMatcher([], {
        costs: { omissionOpen: Number.MAX_SAFE_INTEGER },
      }),
    /THROW_ID_13/,
    "11.02",
  );
  const result = matchTypos("xy", ["ab"], {
    maxCost: Number.MAX_SAFE_INTEGER,
    maxEvents: 2,
    minInputLength: 1,
    maxOmissionRatio: 0,
    costs: { substitution: Number.MAX_SAFE_INTEGER },
  });
  equal(result.status, "no-match", "11.03");
});

test("12 - keyboard entries contain exactly one literal code point", () => {
  for (const keyboard of ["dvorak", [], 1, false, new Date()]) {
    throws(() => createMatcher([], { keyboard }), /THROW_ID_14/, "12.01");
  }
  for (const key of ["", "ab", "😀a", "e\u0301"]) {
    throws(
      () => createMatcher([], { keyboard: { [key]: ["a"] } }),
      /THROW_ID_15/,
      "12.02",
    );
  }
  for (const neighbours of [null, false, "a", {}, new Set(["a"])]) {
    throws(
      () => createMatcher([], { keyboard: { a: neighbours } }),
      /THROW_ID_16/,
      "12.03",
    );
  }
  for (const neighbour of ["", "ab", "😀a", "e\u0301", null, 1]) {
    throws(
      () => createMatcher([], { keyboard: { a: [neighbour] } }),
      /THROW_ID_17/,
      "12.04",
    );
  }
  equal(
    matchTypos("a😀b", ["a\ud800b"], {
      keyboard: { "\ud800": ["😀"] },
    }).matches[0].cost,
    75,
    "12.05",
  );
});

test("13 - prototype-like candidate names and null-prototype maps are literal", () => {
  const keyboard = Object.create(null);
  keyboard.t = ["r"];
  equal(
    matchTypos("rest", ["test"], { keyboard }).matches[0].cost,
    75,
    "13.01",
  );
  equal(
    ["constructor", "__proto__", "toString", "hasOwnProperty"].map(
      (input) => matchTypos(input, [input, input]).matches.length,
    ),
    [1, 1, 1, 1],
    "13.02",
  );
});

test("14 - results and logs survive JSON and structured cloning", () => {
  const matcher = createMatcher(["nbsp", "ensp", "nbsp"]);
  const result = matcher.match("nsp");
  equal(JSON.parse(JSON.stringify(result)), result, "14.01");
  equal(structuredClone(result), result, "14.02");
  equal(JSON.parse(JSON.stringify(matcher.log)), matcher.log, "14.03");
  for (const log of [matcher.log, result.log]) {
    for (const value of Object.values(log)) {
      ok(
        typeof value === "number" && Number.isFinite(value) && value >= 0,
        "14.04",
      );
    }
  }
});

test("15 - safe-integer costs retain their exact inclusive budget", () => {
  const substitution = Math.floor(Number.MAX_SAFE_INTEGER / 2);
  const options = {
    maxEvents: 2,
    minInputLength: 1,
    maxCost: substitution * 2,
    costs: { substitution },
  };
  equal(
    matchTypos("xy", ["ab"], options).matches[0].cost,
    substitution * 2,
    "15.01",
  );
  equal(
    matchTypos("xy", ["ab"], { ...options, maxCost: substitution * 2 - 1 })
      .status,
    "no-match",
    "15.02",
  );
  equal(
    matchTypos("ad", ["abcd"], {
      minInputLength: 1,
      maxCost: Number.MAX_SAFE_INTEGER,
      costs: { omissionOpen: Number.MAX_SAFE_INTEGER, omissionExtend: 0 },
    }).matches[0].cost,
    Number.MAX_SAFE_INTEGER,
    "15.03",
  );
});

test.run();
