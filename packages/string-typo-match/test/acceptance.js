import { test } from "uvu";
import { equal, ok } from "uvu/assert";

import { matchTypos } from "../dist/string-typo-match.esm.js";

function summary(input, candidates, options) {
  const result = matchTypos(input, candidates, options);
  return {
    status: result.status,
    bestMatch: result.bestMatch,
    matches: result.matches.map(({ candidate, cost, operations }) => ({
      candidate,
      cost,
      kinds: operations.map(({ kind }) => kind),
    })),
  };
}

test("01 - a contiguous omitted block is one canonical leftmost event", () => {
  // Both "ev" and "ve" omissions produce Lenstein; canonical tuple order
  // picks the earlier "ev" span rather than presuming which keypress was lost.
  equal(
    matchTypos("Lenstein", ["Levenstein"]).matches,
    [
      {
        candidate: "Levenstein",
        candidateIndex: 0,
        cost: 120,
        eventCount: 1,
        operations: [
          {
            kind: "omitted-block",
            candidateFrom: 1,
            candidateTo: 3,
            inputFrom: 1,
            inputTo: 1,
            cost: 120,
          },
        ],
      },
    ],
    "01.01",
  );
});

test("02 - basic omission insertion repetition and swap families", () => {
  equal(
    ["nsp", "nbxsp", "nbssp", "nbps"].map(
      (input) => summary(input, ["nbsp"]).matches[0],
    ),
    [
      { candidate: "nbsp", cost: 100, kinds: ["missing-character"] },
      { candidate: "nbsp", cost: 100, kinds: ["extra-character"] },
      { candidate: "nbsp", cost: 75, kinds: ["repeated-character"] },
      { candidate: "nbsp", cost: 100, kinds: ["adjacent-swap"] },
    ],
    "02.01",
  );
});

test("03 - swapped characters do not qualify as retained neighbors", () => {
  equal(
    summary("baa", ["ab"], { maxEvents: 2 }).matches,
    [
      {
        candidate: "ab",
        cost: 200,
        kinds: ["adjacent-swap", "extra-character"],
      },
    ],
    "03.01",
  );
});

test("04 - keyboard maps are explicit directional and optional", () => {
  equal(
    [
      summary("rest", ["test"]),
      summary("rest", ["test"], { keyboard: { t: ["r"] } }),
      summary("test", ["rest"], { keyboard: { t: ["r"] } }),
    ].map((result) => result.matches[0]),
    [
      { candidate: "test", cost: 150, kinds: ["substitution"] },
      { candidate: "test", cost: 75, kinds: ["keyboard-substitution"] },
      { candidate: "rest", cost: 150, kinds: ["substitution"] },
    ],
    "04.01",
  );
});

test("05 - binary keyboard weighting preserves the pwned ambiguity", () => {
  const candidates = ["owned", "awned", "paned", "pined"];
  const ordinary = matchTypos("pwned", candidates);
  const keyboard = matchTypos("pwned", candidates, {
    keyboard: { o: ["p"], a: ["w"] },
  });
  equal(
    [ordinary.status, ordinary.bestMatch, ordinary.matches.map((x) => x.cost)],
    ["ambiguous", null, [150, 150, 150, 150]],
    "05.01",
  );
  equal(
    [
      keyboard.status,
      keyboard.bestMatch,
      keyboard.matches.map(({ candidate, cost }) => [candidate, cost]),
    ],
    [
      "ambiguous",
      null,
      [
        ["owned", 75],
        ["paned", 75],
        ["awned", 150],
        ["pined", 150],
      ],
    ],
    "05.02",
  );
  equal(
    summary("pwned", ["pwned", ...candidates], { keyboard: "qwerty" }),
    {
      status: "exact",
      bestMatch: "pwned",
      matches: [{ candidate: "pwned", cost: 0, kinds: [] }],
    },
    "05.03",
  );
});

test("06 - lower omission cost wins over ordinary substitution", () => {
  equal(
    summary("rsqo", ["rsqb", "rsquo"]),
    {
      status: "matched",
      bestMatch: "rsquo",
      matches: [
        { candidate: "rsquo", cost: 100, kinds: ["missing-character"] },
        { candidate: "rsqb", cost: 150, kinds: ["substitution"] },
      ],
    },
    "06.01",
  );
});

test("07 - equally plausible entity names remain ambiguous", () => {
  equal(
    summary("nsp", ["ensp", "nbsp", "nsup"]),
    {
      status: "ambiguous",
      bestMatch: null,
      matches: [
        { candidate: "ensp", cost: 100, kinds: ["missing-character"] },
        { candidate: "nbsp", cost: 100, kinds: ["missing-character"] },
        { candidate: "nsup", cost: 100, kinds: ["missing-character"] },
      ],
    },
    "07.01",
  );
});

test("08 - exact collisions bypass approximate inference", () => {
  equal(
    summary("not", ["notin", "not", "not"]),
    {
      status: "exact",
      bestMatch: "not",
      matches: [{ candidate: "not", cost: 0, kinds: [] }],
    },
    "08.01",
  );
  equal(
    matchTypos("not", ["notin", "not", "not"]).matches[0].candidateIndex,
    1,
    "08.02",
  );
});

test("09 - repeated letters choose the leftmost canonical omission", () => {
  const result = matchTypos("bok", ["book"]);
  equal(result.status, "matched", "09.01");
  equal(
    result.matches[0].operations,
    [
      {
        kind: "missing-character",
        candidateFrom: 1,
        candidateTo: 2,
        inputFrom: 1,
        inputTo: 1,
        cost: 100,
      },
    ],
    "09.02",
  );
});

test("10 - retained characters separate omission events", () => {
  equal(summary("acef", ["abcdef"]).status, "no-match", "10.01");
  equal(
    summary("acef", ["abcdef"], { maxEvents: 2 }).matches,
    [
      {
        candidate: "abcdef",
        cost: 200,
        kinds: ["missing-character", "missing-character"],
      },
    ],
    "10.02",
  );
});

test("11 - omission direction differs from insertion direction", () => {
  equal(
    summary("ad", ["abcd"], { minInputLength: 1 }).matches,
    [{ candidate: "abcd", cost: 120, kinds: ["omitted-block"] }],
    "11.01",
  );
  equal(summary("abcd", ["ad"]).status, "no-match", "11.02");
  equal(
    summary("abcd", ["ad"], { maxEvents: 2 }).matches,
    [
      {
        candidate: "ad",
        cost: 200,
        kinds: ["extra-character", "extra-character"],
      },
    ],
    "11.03",
  );
});

test("12 - astral matching uses code points with UTF-16 offsets", () => {
  equal(
    matchTypos("ab", ["a😀b"], { minInputLength: 1 }).matches[0].operations,
    [
      {
        kind: "missing-character",
        candidateFrom: 1,
        candidateTo: 3,
        inputFrom: 1,
        inputTo: 1,
        cost: 100,
      },
    ],
    "12.01",
  );
  equal(
    matchTypos("a😀😀b", ["a😀b"]).matches[0].operations,
    [
      {
        kind: "repeated-character",
        candidateFrom: 1,
        candidateTo: 1,
        inputFrom: 1,
        inputTo: 3,
        cost: 75,
      },
    ],
    "12.02",
  );
});

test("13 - normalization whitespace punctuation and case remain literal", () => {
  equal(matchTypos("e\u0301", ["é"]).status, "no-match", "13.01");
  equal(
    ["a b", "&nbsp;", "constructor", "\ud800", "😀", "a", "ab"].map(
      (input) => matchTypos(input, [input]).status,
    ),
    ["exact", "exact", "exact", "exact", "exact", "exact", "exact"],
    "13.02",
  );
  equal(
    ["gt", "Gt", "GT"].map(
      (input) => matchTypos(input, ["gt", "Gt", "GT"]).bestMatch,
    ),
    ["gt", "Gt", "GT"],
    "13.03",
  );
  equal(
    matchTypos("ab", ["a b"], { minInputLength: 1 }).matches[0].cost,
    100,
    "13.04",
  );
});

test("14 - long omissions obey the configured run length", () => {
  const candidate = "CounterClockwiseContourIntegral";
  equal(
    matchTypos("CounterContourIntegral", [candidate]).status,
    "no-match",
    "14.01",
  );
  equal(
    summary("CounterContourIntegral", [candidate], {
      maxOmissionLength: 9,
      maxCost: 300,
    }).matches,
    [{ candidate, cost: 260, kinds: ["omitted-block"] }],
    "14.02",
  );
});

test("15 - empty input and empty dictionaries have no fuzzy matches", () => {
  equal(
    summary("", ["a", "abc"], { maxOmissionRatio: 1, minInputLength: 1 }),
    { status: "no-match", bestMatch: null, matches: [] },
    "15.01",
  );
  equal(
    summary("abc", []),
    { status: "no-match", bestMatch: null, matches: [] },
    "15.02",
  );
});

test("16 - the local event model excludes unrestricted Damerau edits", () => {
  equal(
    summary("ABC", ["CA"], {
      maxEvents: 2,
      maxCost: 1000,
      minInputLength: 1,
      maxOmissionRatio: 1,
    }).status,
    "no-match",
    "16.01",
  );
});

test("17 - omission ratio counts every missing candidate code point", () => {
  equal(
    [0, 0.49, 0.5, 1].map(
      (maxOmissionRatio) =>
        matchTypos("ad", ["abcd"], { minInputLength: 1, maxOmissionRatio })
          .status,
    ),
    ["no-match", "no-match", "matched", "matched"],
    "17.01",
  );
  equal(
    [0.32, 1 / 3].map(
      (maxOmissionRatio) =>
        matchTypos("acef", ["abcdef"], { maxEvents: 2, maxOmissionRatio })
          .status,
    ),
    ["no-match", "matched"],
    "17.02",
  );
});

test("18 - adjacent omissions cannot evade the length or extension cost", () => {
  equal(
    matchTypos("af", ["abcdef"], {
      minInputLength: 1,
      maxEvents: 2,
      maxOmissionLength: 2,
      maxOmissionRatio: 1,
    }).status,
    "no-match",
    "18.01",
  );
  equal(
    matchTypos("abef", ["abcdef"], {
      maxEvents: 2,
      costs: { omissionOpen: 100, omissionExtend: 150 },
    }).status,
    "no-match",
    "18.02",
  );
});

test("19 - specialized events lose when the general event is cheaper", () => {
  equal(
    summary("nbssp", ["nbsp"], {
      costs: { repeatedCharacter: 150 },
    }).matches,
    [{ candidate: "nbsp", cost: 100, kinds: ["extra-character"] }],
    "19.01",
  );
  equal(
    summary("rest", ["test"], {
      keyboard: { t: ["r"] },
      costs: { keyboardSubstitution: 175 },
    }).matches,
    [{ candidate: "test", cost: 150, kinds: ["substitution"] }],
    "19.02",
  );
  equal(
    summary("rest", ["test"], {
      keyboard: { t: ["r"] },
      costs: { keyboardSubstitution: 150 },
    }).matches,
    [{ candidate: "test", cost: 150, kinds: ["keyboard-substitution"] }],
    "19.03",
  );
});

test("20 - cost ties are ambiguous even with a zero minimum gap", () => {
  equal(
    matchTypos("nsp", ["nbsp", "ensp"], { minCostGap: 0 }).status,
    "ambiguous",
    "20.01",
  );
  equal(
    [49, 50, 51].map(
      (minCostGap) =>
        matchTypos("rsqo", ["rsqb", "rsquo"], { minCostGap }).status,
    ),
    ["matched", "matched", "ambiguous"],
    "20.02",
  );
  equal(
    [99, 100].map((maxCost) => matchTypos("nsp", ["nbsp"], { maxCost }).status),
    ["no-match", "matched"],
    "20.03",
  );
});

test("21 - multiple extra copies require multiple insertion events", () => {
  equal(matchTypos("nbsssp", ["nbsp"]).status, "no-match", "21.01");
  equal(
    summary("nbsssp", ["nbsp"], { maxEvents: 2 }).matches,
    [
      {
        candidate: "nbsp",
        cost: 150,
        kinds: ["repeated-character", "repeated-character"],
      },
    ],
    "21.02",
  );
});

test("22 - operation spans reconstruct the observed string", () => {
  const pairs = [
    ["Levenstein", "Lenstein"],
    ["nbsp", "nbxsp"],
    ["nbsp", "nbssp"],
    ["nbsp", "nbps"],
    ["ab", "baa"],
    ["a😀b", "ab"],
    ["a\ud800b", "a\ud801b"],
    ["abcdef", "acef"],
  ];
  for (const [candidate, input] of pairs) {
    const match = matchTypos(input, [candidate], {
      maxEvents: 2,
      minInputLength: 1,
    }).matches[0];
    let cursor = 0;
    let rebuilt = "";
    for (const operation of match.operations) {
      rebuilt += candidate.slice(cursor, operation.candidateFrom);
      rebuilt += input.slice(operation.inputFrom, operation.inputTo);
      cursor = operation.candidateTo;
    }
    rebuilt += candidate.slice(cursor);
    ok(rebuilt === input, `22.01: ${JSON.stringify([candidate, input])}`);
    ok(match.eventCount === match.operations.length, "22.02");
    ok(
      match.cost ===
        match.operations.reduce((sum, operation) => sum + operation.cost, 0),
      "22.03",
    );
  }
});

test("23 - observed astrisk misspelling omits one literal character", () => {
  equal(
    summary("astrisk", ["asterisk"]),
    {
      status: "matched",
      bestMatch: "asterisk",
      matches: [
        { candidate: "asterisk", cost: 100, kinds: ["missing-character"] },
      ],
    },
    "23.01",
  );
});

test("24 - long repetitive alignments retain two-event explanations", () => {
  const candidate = "a".repeat(130);
  const input = `${candidate.slice(0, 60)}bb${candidate.slice(62)}`;
  const result = matchTypos(input, [candidate], { maxEvents: 2, maxCost: 300 });
  equal(
    result.matches[0].operations,
    [
      {
        kind: "substitution",
        candidateFrom: 60,
        candidateTo: 61,
        inputFrom: 60,
        inputTo: 61,
        cost: 150,
      },
      {
        kind: "substitution",
        candidateFrom: 61,
        candidateTo: 62,
        inputFrom: 61,
        inputTo: 62,
        cost: 150,
      },
    ],
    "24.01",
  );
  const astralPrefix = "😀".repeat(128);
  equal(
    matchTypos(`${astralPrefix}axcy`, [`${astralPrefix}abcd`], {
      maxEvents: 2,
      maxCost: 300,
    }).matches[0].operations,
    [
      {
        kind: "substitution",
        candidateFrom: 257,
        candidateTo: 258,
        inputFrom: 257,
        inputTo: 258,
        cost: 150,
      },
      {
        kind: "substitution",
        candidateFrom: 259,
        candidateTo: 260,
        inputFrom: 259,
        inputTo: 260,
        cost: 150,
      },
    ],
    "24.02",
  );
});

test("25 - fuzzy minimum lengths count astral code points", () => {
  equal(matchTypos("😀x", ["😀y"]).status, "no-match", "25.01");
  equal(
    matchTypos("😀x", ["😀y"], { minInputLength: 2 }).status,
    "matched",
    "25.02",
  );
});

test.run();
