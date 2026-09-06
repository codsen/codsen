import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { rApply } from "ranges-apply";
import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import { convertAll, convertOne } from "../dist/string-apostrophes.esm.js";

const entities = {
  "‘": "&lsquo;",
  "’": "&rsquo;",
  "“": "&ldquo;",
  "”": "&rdquo;",
  "′": "&prime;",
  "″": "&Prime;",
};
const encode = (str) => str.replace(/[‘’“”′″]/g, (char) => entities[char]);

// A tokenizer advances across its first supplied span independently of offsetBy.
function convertTokens(input, tokens, opts) {
  const ranges = [];
  const visited = [];
  const offsets = [];
  for (let i = 0; i < input.length; i++) {
    const token = tokens.find(([source]) => input.startsWith(source, i));
    if (!token) {
      continue;
    }
    const from = i;
    const to = from + token[0].length;
    visited.push(from);
    ranges.push(
      ...convertOne(input, {
        ...opts,
        from,
        to,
        value: token[1],
        offsetBy(amount) {
          offsets.push(amount);
          i += amount;
        },
      }),
    );
    i += to - from - 1;
  }
  return { result: rApply(input, ranges), ranges, visited, offsets };
}

test("01 - paired supplied apostrophes consume the complete second span", () => {
  for (const token of ["&apos;", "&#39;", "@@", "'"]) {
    for (const convertEntities of [false, true]) {
      for (const convertApostrophes of [false, true]) {
        const input = `rock ${token}n${token} roll`;
        const replacement = convertApostrophes
          ? convertEntities
            ? "&rsquo;n&rsquo;"
            : "’n’"
          : "'n'";
        const offsets = [];
        const ranges = convertOne(input, {
          from: 5,
          to: 5 + token.length,
          value: "'",
          convertEntities,
          convertApostrophes,
          offsetBy: (amount) => offsets.push(amount),
        });
        equal(
          ranges,
          token === "'" && !convertApostrophes
            ? []
            : [[5, 6 + 2 * token.length, replacement]],
          "01.01",
        );
        equal(rApply(input, ranges), `rock ${replacement} roll`, "01.02");
        equal(
          offsets,
          token === "'" && !convertApostrophes ? [] : [token.length + 1],
          "01.03",
        );
      }
    }
  }
});

test("02 - paired span offsets compose with a caller's tokenizer", () => {
  const input = 'rock &apos;n&apos;"next"';
  const converted = convertTokens(
    input,
    [
      ["&apos;", "'"],
      ['"', '"'],
    ],
    {},
  );
  equal(converted.result, "rock ’n’“next”", "02.01");
  equal(converted.visited, [5, 18, 23], "02.02");
  equal(converted.offsets, [7], "02.03");
});

test("03 - Hawaiian exceptions retain their semantic case on repeated runs", () => {
  for (const [prefix, suffix] of [
    ["Hawai", "i"],
    ["O", "ahu"],
  ]) {
    for (const quote of ["'", "‘", "’"]) {
      const input = `${prefix}${quote}${suffix}`;
      const expected = `${prefix}‘${suffix}`;
      equal(convertAll(input).result, expected, "03.01");
      equal(convertAll(expected), { result: expected, ranges: [] }, "03.02");
      equal(
        convertAll(input, { convertEntities: true }).result,
        encode(expected),
        "03.03",
      );
      for (const convertEntities of [false, true]) {
        const supplied = `${prefix}&apos;${suffix}`;
        const ranges = convertOne(supplied, {
          from: prefix.length,
          to: prefix.length + 6,
          value: quote,
          convertEntities,
        });
        // Already-correct logical values need no raw replacement unless encoding changes.
        equal(
          ranges,
          quote === "‘" && !convertEntities
            ? []
            : [
                [
                  prefix.length,
                  prefix.length + 6,
                  convertEntities ? "&lsquo;" : "‘",
                ],
              ],
          "03.04",
        );
      }
    }
  }
});

test("04 - measurement marks work at EOF and with trailing text", () => {
  for (const [input, expected] of [
    ["6'", "6′"],
    ['12"', "12″"],
    ["6′", "6′"],
    ["12″", "12″"],
    ["He is 6'2\"", "He is 6′2″"],
    ["6'2\" and 5'10\"", "6′2″ and 5′10″"],
  ]) {
    for (const suffix of ["", " ", "."]) {
      for (const convertEntities of [false, true]) {
        const result = convertAll(input + suffix, { convertEntities });
        equal(
          result.result,
          (convertEntities ? encode(expected) : expected) + suffix,
          "04.01",
        );
      }
      equal(
        convertAll(convertAll(input + suffix).result).result,
        expected + suffix,
        "04.02",
      );
    }
  }
});

test("05 - supplied primes preserve measurement semantics and reverse conversion", () => {
  for (const [token, value, raw, encoded, straight] of [
    ["&prime;", "′", "6′", "6&prime;", "6'"],
    ["&Prime;", "″", "6″", "6&Prime;", '6"'],
  ]) {
    const input = `6${token}`;
    equal(
      rApply(input, convertOne(input, { from: 1, to: input.length, value })),
      input,
      "05.01",
    );
    equal(
      rApply(
        input,
        convertOne(input, {
          from: 1,
          to: input.length,
          value,
          convertEntities: true,
        }),
      ),
      encoded,
      "05.02",
    );
    equal(
      rApply(
        input,
        convertOne(input, {
          from: 1,
          to: input.length,
          value,
          convertApostrophes: false,
        }),
      ),
      straight,
      "05.03",
    );
    equal(
      convertAll(raw, { convertApostrophes: false }).result,
      straight,
      "05.04",
    );
  }
});

test("06 - numeric-ending quotations stay quotations across suffixes", () => {
  for (const [input, expected] of [
    ['Model "T2000"', "Model “T2000”"],
    ['"123"', "“123”"],
    ['"version 123"', "“version 123”"],
    ["Model 'T2000'", "Model ‘T2000’"],
    ["Model “T2000”", "Model “T2000”"],
  ]) {
    for (const suffix of ["", ".", ",", " is ready."]) {
      for (const convertEntities of [false, true]) {
        equal(
          convertAll(input + suffix, { convertEntities }).result,
          (convertEntities ? encode(expected) : expected) + suffix,
          "06.01",
        );
        const from = input.length - 1;
        const ranges = convertOne(input + suffix, { from, convertEntities });
        equal(
          rApply(input + suffix, ranges),
          input.slice(0, -1) +
            (convertEntities
              ? encode(expected.slice(-1))
              : expected.slice(-1)) +
            suffix,
          "06.02",
        );
      }
    }
  }
});

test("07 - elision prefixes do not misclassify whole quoted words", () => {
  for (const word of [
    "time",
    "tiny",
    "empty",
    "ember",
    "two",
    "twain",
    "twelve",
    "twilight",
    "causeway",
    "tisane",
    "twillow",
  ]) {
    for (const text of [word, word.toUpperCase()]) {
      for (const convertEntities of [false, true]) {
        const expected = `‘${text}’`;
        equal(
          convertAll(`'${text}'`, { convertEntities }).result,
          convertEntities ? encode(expected) : expected,
          "07.01",
        );
      }
    }
  }
});

test("08 - complete elisions and their negative contractions retain apostrophes", () => {
  for (const word of [
    "t",
    "tis",
    "twas",
    "twere",
    "twill",
    "twould",
    "em",
    "cause",
    "tisn't",
    "twasn't",
    "tweren't",
    "twon't",
    "twon’t",
  ]) {
    for (const text of [word, word.toUpperCase()]) {
      for (const suffix of ["", " ", ","]) {
        for (const convertEntities of [false, true]) {
          const expected = `’${text.replace(/'/g, "’")}${suffix}`;
          equal(
            convertAll(`'${text}${suffix}`, { convertEntities }).result,
            convertEntities ? encode(expected) : expected,
            "08.01",
          );
        }
      }
    }
  }
});

test("09 - nested closing pairs work at EOF and punctuation boundaries", () => {
  for (const [input, expected] of [
    [`"He said, 'Hi!'"`, "“He said, ‘Hi!’”"],
    [`'He said, "Hi!"'`, "‘He said, “Hi!”’"],
    [`“He said, ‘Hi!'”`, "“He said, ‘Hi!’”"],
    [`‘He said, “Hi!"’`, "‘He said, “Hi!”’"],
  ]) {
    for (const suffix of ["", " ", ", she said.", "."]) {
      for (const convertEntities of [false, true]) {
        const result = convertAll(input + suffix, { convertEntities }).result;
        equal(
          result,
          (convertEntities ? encode(expected) : expected) + suffix,
          "09.01",
        );
      }
      equal(convertAll(expected + suffix).result, expected + suffix, "09.02");
    }
  }
});

test("10 - nested closing-pair offsets preserve the following quote", () => {
  for (const [input, from, expected] of [
    [`"He said, 'Hi!'", "Next"`, 15, "“He said, ‘Hi!’”, “Next”"],
    [`'He said, "Hi!"', 'Next'`, 15, "‘He said, “Hi!”’, ‘Next’"],
  ]) {
    const result = convertTokens(
      input,
      [
        ["'", "'"],
        ['"', '"'],
      ],
      {},
    );
    equal(result.result, expected, "10.01");
    equal(result.visited.includes(from), false, "10.02");
    equal(result.offsets, [1], "10.03");
  }
});

test("11 - undefined optional conversion flags use defaults in both APIs", () => {
  for (const input of ["It's", "It’s"]) {
    for (const convertApostrophes of [undefined, true]) {
      equal(
        convertAll(input, { convertApostrophes, convertEntities: undefined }),
        convertAll(input),
        "11.01",
      );
      equal(
        convertOne(input, {
          from: 2,
          convertApostrophes,
          convertEntities: undefined,
        }),
        convertOne(input, { from: 2 }),
        "11.02",
      );
    }
    equal(
      convertAll(input, { convertApostrophes: false }).result,
      "It's",
      "11.03",
    );
    equal(
      rApply(input, convertOne(input, { from: 2, convertApostrophes: false })),
      "It's",
      "11.04",
    );
  }
});

test("12 - invalid integer endpoints receive the package span diagnostic", () => {
  for (const to of [-1, 0, 3, 10]) {
    throws(
      () => convertOne("ab", { from: 1, to, value: "'" }),
      /string-apostrophes\/convertOne\(\): \[THROW_ID_05\]/,
      "12.01",
    );
  }
  equal(
    convertOne("ab", { from: 1, to: 1, value: "'" }),
    [[1, 1, "’"]],
    "12.02",
  );
  equal(convertOne("a'b", { from: 1 }), [[1, 2, "’"]], "12.03");
  equal(
    convertOne("a&apos;b", { from: 1, to: 7, value: "'" }),
    [[1, 7, "’"]],
    "12.04",
  );
  equal(
    convertOne("and", { from: 1, to: 1, value: "'" }),
    [[1, 1, "’"]],
    "12.05",
  );
});

test("13 - null options receive the required-object diagnostic", () => {
  for (const opts of [null, undefined, true, 1, "x", []]) {
    throws(
      () => convertOne("It's", opts),
      /string-apostrophes\/convertOne\(\): \[THROW_ID_02\]/,
      "13.01",
    );
  }
  equal(convertAll("It's", null), convertAll("It's"), "13.02");
});

test("14 - the browser bundle agrees with ESM for every corrected rule", () => {
  const context = {};
  runInNewContext(
    readFileSync(
      new URL("../dist/string-apostrophes.umd.js", import.meta.url),
      "utf8",
    ),
    context,
  );
  const browser = context.stringApostrophes;
  for (const input of [
    "rock 'n' roll",
    "Hawai‘i",
    "O‘ahu",
    "6′",
    "6'2\"",
    'Model "T2000".',
    "'time'",
    `'He said, "Hi!"'`,
    `"He said, 'Hi!'"`,
  ]) {
    for (const convertEntities of [false, true]) {
      equal(
        JSON.parse(
          JSON.stringify(browser.convertAll(input, { convertEntities })),
        ),
        convertAll(input, { convertEntities }),
        "14.01",
      );
    }
  }
  const opts = { from: 5, to: 11, value: "'" };
  equal(
    JSON.parse(
      JSON.stringify(browser.convertOne("rock &apos;n&apos; roll", opts)),
    ),
    convertOne("rock &apos;n&apos; roll", opts),
    "14.02",
  );
  equal(
    JSON.parse(
      JSON.stringify(
        browser.convertAll("It’s", { convertApostrophes: undefined }),
      ),
    ),
    convertAll("It’s"),
    "14.03",
  );
  throws(
    () => browser.convertOne("ab", { from: 1, to: 0, value: "'" }),
    /THROW_ID_05/,
    "14.04",
  );
  throws(() => browser.convertOne("It's", null), /THROW_ID_02/, "14.05");
});

test.run();
