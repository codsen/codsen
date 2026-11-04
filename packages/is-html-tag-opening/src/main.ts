import { formatDiagnosticValue } from "codsen-utils";
import { left } from "string-left-right";
import { matchRight, matchRightIncl } from "string-match-left-right";
import { version as v } from "../package.json";
import { extraRequirements } from "./extraRequirements";
import { isNotLetter } from "./isNotLetter";
import { BACKSLASH, defaultOpts as defaults, knownHtmlTags } from "./util";

const version: string = v;

declare let DEV: boolean;

// Each run consumes one character, one-or-more when repeated, or zero-or-more
// when also optional. The matcher carries every possible position concurrently;
// overlapping Unicode name/whitespace classes never trigger backtracking.
type CharacterRun = readonly [
  characters: RegExp,
  repeat?: boolean,
  optional?: boolean,
];

function matchesRuns(str: string, runs: readonly CharacterRun[]): boolean {
  const closeOptionalRuns = (value: number): number => {
    for (let i = 0; i < runs.length; i++) {
      if (value & (1 << i) && runs[i][2]) value |= 1 << (i + 1);
    }
    return value;
  };
  let states = closeOptionalRuns(1);
  for (let cursor = 0; cursor < str.length && states; cursor++) {
    let next = 0;
    for (let i = 0; i < runs.length; i++) {
      if (states & (1 << i) && runs[i][0].test(str[cursor])) {
        next |= 1 << (i + 1);
        if (runs[i][1]) next |= 1 << i;
      }
    }
    states = closeOptionalRuns(next);
    if (states & (1 << runs.length)) return true;
  }
  return false;
}

export interface Opts {
  allowCustomTagNames: boolean;
  skipOpeningBracket: boolean;
}

function isOpening(str: string, idx = 0, opts?: Partial<Opts>): boolean {
  // -----------------------------------------------------------------------------

  if (typeof str !== "string") {
    throw new Error(
      `is-html-tag-opening/isOpening(): [THROW_ID_01] the first input argument should have been a string but it was given as "${typeof str}", value being ${formatDiagnosticValue(str, 4)}`,
    );
  }
  if (!Number.isInteger(idx) || idx < 0) {
    throw new Error(
      `is-html-tag-opening/isOpening(): [THROW_ID_02] the second input argument should have been a natural number string index but it was given as "${typeof idx}", value being ${formatDiagnosticValue(idx, 4)}`,
    );
  }

  let resolvedOpts: Opts = { ...defaults, ...opts };

  // -----------------------------------------------------------------------------

  let whitespaceCharacters = `\\\\ \\t\\r\\n/`;
  let whitespaceChunk = `[${whitespaceCharacters}]*`;

  // generalChar does not include the dash, -
  let generalChar = `._a-z0-9\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\uFFFF`;

  // =======
  // r1. tag without attributes
  // for example <br>, <br/>
  let r1 = new RegExp(
    `^<${
      resolvedOpts.skipOpeningBracket ? "?" : ""
    }${whitespaceChunk}\\w+${whitespaceChunk}>`,
    "g",
  );
  // its custom-html tag version. Require the first name character once;
  // splitting the same name between adjacent repetitions costs quadratic time.
  let r5 = new RegExp(
    `^<${
      resolvedOpts.skipOpeningBracket ? "?" : ""
    }${whitespaceChunk}[${generalChar}][-${generalChar}]*${whitespaceChunk}>`,
    "g",
  );
  // to anybody who wonders, the \u2070-\uFFFF covers all the surrogates
  // of which emoji can be assembled. This is a very rough match, aiming to
  // catch as much as possible, not the validation-level match.
  // If you put bunch of opening surrogates in a sequence, for example,
  // this program would still match them positively. It's to catch all emoji,
  // including future, new-fangled emoji.

  // =======
  // r2. tag with one healthy attribute (no closing slash or whatever follow afterwards is matched)
  let r2 = new RegExp(
    `^<${
      resolvedOpts.skipOpeningBracket ? "?" : ""
    }\\s*\\w+\\s+\\w+(?:-\\w+)?\\s*=\\s*['"\\w]`,
    "g",
  );
  // its custom-html tag version:
  const generalNameChar = new RegExp(`[${generalChar}]`);
  const generalNameTail = new RegExp(`[-${generalChar}]`);
  const prefixWhitespaceChar = new RegExp(`[${whitespaceCharacters}]`);
  const bracket: CharacterRun = [/</, false, resolvedOpts.skipOpeningBracket];
  let r6 = (value: string): boolean => {
    const prefix: CharacterRun[] = [
      bracket,
      [/\s/, true, true],
      [/\w/, true],
      [/\s/, true],
      [generalNameChar],
      [generalNameTail, true, true],
    ];
    const suffix: CharacterRun[] = [
      [/\s/, true, true],
      [/=/],
      [/\s/, true, true],
      [/['"\w]/],
    ];
    return (
      matchesRuns(value, [...prefix, ...suffix]) ||
      matchesRuns(value, [...prefix, [/-/], [/\w/, true], ...suffix])
    );
  };

  // =======
  // r3. closing/self-closing tags
  let r3 = new RegExp(
    `^<${
      resolvedOpts.skipOpeningBracket ? "?" : ""
    }\\s*(?:/\\s*)?\\w+\\s*(?:/\\s*)?>`,
    "g",
  );
  // its custom-html tag version:
  let r7 = (value: string): boolean =>
    matchesRuns(value, [
      bracket,
      [/\s/, true, true],
      [/\//, false, true],
      [/\s/, true, true],
      [generalNameChar],
      [generalNameTail, true, true],
      [/\s/, true, true],
      [/\//, false, true],
      [/\s/, true, true],
      [/>/],
    ]);

  // =======
  // r4. opening tag with attributes,
  // The optional group allowed one combined word of at least two characters,
  // or two/three whitespace-separated words. Spell out those alternatives so
  // a failing match cannot repartition the same word among three repetitions.
  let r4 = new RegExp(
    `^<${
      resolvedOpts.skipOpeningBracket ? "?" : ""
    }${whitespaceChunk}(?:\\w{2,}|\\w+(?:\\s+\\w+){1,2})=['"]`,
    "g",
  );
  // its custom-html tag version:
  let r8 = (value: string): boolean => {
    const prefix: CharacterRun[] = [
      bracket,
      [prefixWhitespaceChar, true, true],
      [generalNameChar],
      [generalNameTail, true, true],
      [/\s/, true],
      [/\w/, true],
    ];
    const suffix: CharacterRun[] = [[/=/], [/['"]/]];
    return (
      matchesRuns(value, [...prefix, ...suffix]) ||
      matchesRuns(value, [...prefix, [/\s/, true], [/\w/, true], ...suffix])
    );
  };

  // =======
  // lesser requirements when opening bracket precedes index "idx"
  // Flatten (whitespace* name+)+: nested repetitions can split a name at
  // every character, causing exponential backtracking on malformed input.
  // After the first name character, any name/whitespace sequence is equivalent.
  let r9 = new RegExp(
    `^<${
      resolvedOpts.skipOpeningBracket ? `?\\/?` : ""
    }${whitespaceChunk}[${generalChar}][${generalChar}${whitespaceCharacters}]*[\\\\/=>]`,
    "",
  );
  // =======
  // r10. closing tag with slash present but opening bracket missing
  // A trailing s* is redundant after w+ and creates another overlapping run.
  let r10 = /^\/\s*\w+>/;

  // =======

  let whatToTest = idx ? str.slice(idx) : str;
  let leftSideIdx = left(str, idx) as number;

  let qualified = false;
  let passed = false;
  // if the result is still falsy, we match against the known HTML tag names list
  let matchingOptions = {
    cb: isNotLetter,
    i: true,
    trimCharsBeforeMatching: ["/", BACKSLASH, "!", " ", "\t", "\n", "\r"],
  };

  DEV &&
    console.log(
      `██ ${`\u001b[${33}m${`whatToTest`}\u001b[${39}m`} = "${whatToTest}"`,
    );

  // -----------------------------------------------------------------------------

  if (resolvedOpts.allowCustomTagNames) {
    DEV && console.log(`entering the custom tag name clauses`);
    if (
      ((resolvedOpts.skipOpeningBracket &&
        (str[idx - 1] === "<" ||
          (str[idx - 1] === "/" &&
            str[left(str, leftSideIdx) as number] === "<"))) ||
        (whatToTest[0] === "<" && whatToTest[1]?.trim())) &&
      (r9.test(whatToTest) || /^<\w+$/.test(whatToTest))
    ) {
      DEV && console.log(`${`\u001b[${31}m${`R9`}\u001b[${39}m`} passed`);
      passed = true;
    } else if (r5.test(whatToTest) && extraRequirements(str, idx)) {
      DEV && console.log(`${`\u001b[${31}m${`R5`}\u001b[${39}m`} passed`);
      passed = true;
    } else if (r6(whatToTest)) {
      DEV && console.log(`${`\u001b[${31}m${`R6`}\u001b[${39}m`} passed`);
      passed = true;
    } else if (r7(whatToTest) && extraRequirements(str, idx)) {
      DEV && console.log(`${`\u001b[${31}m${`R7`}\u001b[${39}m`} passed`);
      passed = true;
    } else if (r8(whatToTest)) {
      DEV && console.log(`${`\u001b[${31}m${`R8`}\u001b[${39}m`} passed`);
      passed = true;
    } else if (
      str[idx] === "/" &&
      str[leftSideIdx] !== "<" &&
      r10.test(whatToTest)
    ) {
      DEV && console.log(`${`\u001b[${31}m${`R10`}\u001b[${39}m`} passed`);
      passed = true;
    }
  } else {
    if (
      ((resolvedOpts.skipOpeningBracket &&
        // either opening bracket is straight on the left
        (str[idx - 1] === "<" ||
          // or there's a slash to the left and opening bracket to further left
          (str[idx - 1] === "/" &&
            str[left(str, leftSideIdx) as number] === "<"))) ||
        ((whatToTest[0] === "<" ||
          (whatToTest[0] === "/" &&
            (!str[leftSideIdx] || str[leftSideIdx] !== "<"))) &&
          whatToTest[1]?.trim())) &&
      r9.test(whatToTest)
    ) {
      DEV && console.log(`${`\u001b[${31}m${`R9`}\u001b[${39}m`} qualified`);
      qualified = true;
    } else if (r1.test(whatToTest) && extraRequirements(str, idx)) {
      DEV && console.log(`${`\u001b[${31}m${`R1`}\u001b[${39}m`} qualified`);
      qualified = true;
    } else if (r2.test(whatToTest)) {
      DEV && console.log(`${`\u001b[${31}m${`R2`}\u001b[${39}m`} qualified`);
      qualified = true;
    } else if (r3.test(whatToTest) && extraRequirements(str, idx)) {
      DEV && console.log(`${`\u001b[${31}m${`R3`}\u001b[${39}m`} qualified`);
      qualified = true;
    } else if (r4.test(whatToTest)) {
      DEV && console.log(`${`\u001b[${31}m${`R4`}\u001b[${39}m`} qualified`);
      qualified = true;
    }

    DEV &&
      console.log(
        `FIY ${`\u001b[${33}m${`qualified`}\u001b[${39}m`} = ${JSON.stringify(
          qualified,
          null,
          4,
        )}`,
      );

    if (
      qualified &&
      matchRightIncl(str, idx, knownHtmlTags, {
        cb: (char) => {
          if (char === undefined) {
            DEV && console.log();
            if (
              (str[idx] === "<" && str[idx + 1]?.trim()) ||
              str[idx - 1] === "<"
            ) {
              passed = true;
              DEV &&
                console.log(
                  `${`\u001b[${31}m${`EOL after tag name`}\u001b[${39}m`}`,
                );
            }
            return true;
          }
          return (
            char.toUpperCase() === char.toLowerCase() &&
            !/\d/.test(char) &&
            char !== "="
          );
        },
        i: true,
        trimCharsBeforeMatching: [
          "<",
          "/",
          BACKSLASH,
          "!",
          " ",
          "\t",
          "\n",
          "\r",
        ],
      })
    ) {
      DEV && console.log(`SET passed = true`);
      passed = true;
    }
  }

  DEV &&
    console.log(
      `${`\u001b[${33}m${`passed`}\u001b[${39}m`} = ${JSON.stringify(
        passed,
        null,
        4,
      )}`,
    );

  if (
    !passed &&
    str[idx] === "<" &&
    str[idx + 1]?.trim() &&
    matchRight(str, idx, knownHtmlTags, matchingOptions)
  ) {
    passed = true;
    DEV && console.log(`SET passed = true`);
  }

  DEV &&
    console.log(
      `${`\u001b[${33}m${`passed`}\u001b[${39}m`} = ${JSON.stringify(
        passed,
        null,
        4,
      )}`,
    );

  //
  DEV &&
    console.log(
      `${`\u001b[${33}m${`isNotLetter(str[${
        idx + 1
      }])`}\u001b[${39}m`} = ${JSON.stringify(
        isNotLetter(str[idx + 1]),
        null,
        4,
      )}`,
    );
  let res = typeof str === "string" && idx < str.length && passed;
  DEV && console.log(`return ${`\u001b[${36}m${res}\u001b[${39}m`}`);
  return res;
}

export { defaults, isOpening, version };
