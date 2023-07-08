/* eslint-disable prefer-regex-literals */
import { matchRight, matchRightIncl } from "string-match-left-right";
import { left } from "string-left-right";

import { BACKSLASH, knownHtmlTags, defaultOpts as defaults } from "./util";
import { isNotLetter } from "./isNotLetter";
import { extraRequirements } from "./extraRequirements";
import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

export interface Opts {
  allowCustomTagNames: boolean;
  skipOpeningBracket: boolean;
}

function isOpening(str: string, idx = 0, opts?: Partial<Opts>): boolean {
  // -----------------------------------------------------------------------------

  if (typeof str !== "string") {
    throw new Error(
      `is-html-tag-opening: [THROW_ID_01] the first input argument should have been a string but it was given as "${typeof str}", value being ${JSON.stringify(
        str,
        null,
        4,
      )}`,
    );
  }
  if (!Number.isInteger(idx) || idx < 0) {
    throw new Error(
      `is-html-tag-opening: [THROW_ID_02] the second input argument should have been a natural number string index but it was given as "${typeof idx}", value being ${JSON.stringify(
        idx,
        null,
        4,
      )}`,
    );
  }

  let resolvedOpts: Opts = { ...defaults, ...opts };

  // -----------------------------------------------------------------------------

  let whitespaceChunk = `[\\\\ \\t\\r\\n/]*`;

  // generalChar does not include the dash, -
  let generalChar = `._a-z0-9\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\uFFFF`;

  // =======
  // r1. tag without attributes
  // for example <br>, <br/>
  let r1 = new RegExp(
    `^<${
      resolvedOpts.skipOpeningBracket ? "?" : ""
    }${whitespaceChunk}\\w+${whitespaceChunk}\\/?${whitespaceChunk}>`,
    "g",
  );
  // its custom-html tag version:
  let r5 = new RegExp(
    `^<${
      resolvedOpts.skipOpeningBracket ? "?" : ""
    }${whitespaceChunk}[${generalChar}]+[-${generalChar}]*${whitespaceChunk}>`,
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
  let r6 = new RegExp(
    `^<${
      resolvedOpts.skipOpeningBracket ? "?" : ""
    }\\s*\\w+\\s+[${generalChar}]+[-${generalChar}]*(?:-\\w+)?\\s*=\\s*['"\\w]`,
  );

  // =======
  // r3. closing/self-closing tags
  let r3 = new RegExp(
    `^<${
      resolvedOpts.skipOpeningBracket ? "?" : ""
    }\\s*\\/?\\s*\\w+\\s*\\/?\\s*>`,
    "g",
  );
  // its custom-html tag version:
  let r7 = new RegExp(
    `^<${
      resolvedOpts.skipOpeningBracket ? "?" : ""
    }\\s*\\/?\\s*[${generalChar}]+[-${generalChar}]*\\s*\\/?\\s*>`,
    "g",
  );

  // =======
  // r4. opening tag with attributes,
  let r4 = new RegExp(
    `^<${
      resolvedOpts.skipOpeningBracket ? "?" : ""
    }${whitespaceChunk}\\w+(?:\\s*\\w+)?\\s*\\w+=['"]`,
    "g",
  );
  // its custom-html tag version:
  let r8 = new RegExp(
    `^<${
      resolvedOpts.skipOpeningBracket ? "?" : ""
    }${whitespaceChunk}[${generalChar}]+[-${generalChar}]*\\s+(?:\\s*\\w+)?\\s*\\w+=['"]`,
    "g",
  );

  // =======
  // lesser requirements when opening bracket precedes index "idx"
  let r9 = new RegExp(
    `^<${
      resolvedOpts.skipOpeningBracket ? `?\\/?` : ""
    }(${whitespaceChunk}[${generalChar}]+)+${whitespaceChunk}[\\\\/=>]`,
    "",
  );
  // =======
  // r10. closing tag with slash present but opening bracket missing
  let r10 = new RegExp(`^\\/\\s*\\w+s*>`);

  // =======

  let whatToTest = idx ? str.slice(idx) : str;
  let leftSideIdx = left(str, idx) as number;

  let qualified = false;
  let passed = false;
  // if the result is still falsey, we match against the known HTML tag names list
  let matchingOptions = {
    cb: isNotLetter,
    i: true,
    trimCharsBeforeMatching: ["/", BACKSLASH, "!", " ", "\t", "\n", "\r"],
  };

  DEV &&
    console.log(
      `148 ██ ${`\u001b[${33}m${`whatToTest`}\u001b[${39}m`} = "${whatToTest}"`,
    );

  // -----------------------------------------------------------------------------

  if (resolvedOpts.allowCustomTagNames) {
    DEV && console.log(`154 entering the custom tag name clauses`);
    if (
      ((resolvedOpts.skipOpeningBracket &&
        (str[idx - 1] === "<" ||
          (str[idx - 1] === "/" &&
            str[left(str, leftSideIdx) as number] === "<"))) ||
        (whatToTest[0] === "<" && whatToTest[1] && whatToTest[1].trim())) &&
      (r9.test(whatToTest) || /^<\w+$/.test(whatToTest))
    ) {
      DEV && console.log(`163 ${`\u001b[${31}m${`R9`}\u001b[${39}m`} passed`);
      passed = true;
    } else if (r5.test(whatToTest) && extraRequirements(str, idx)) {
      DEV && console.log(`166 ${`\u001b[${31}m${`R5`}\u001b[${39}m`} passed`);
      passed = true;
    } else if (r6.test(whatToTest)) {
      DEV && console.log(`169 ${`\u001b[${31}m${`R6`}\u001b[${39}m`} passed`);
      passed = true;
    } else if (r7.test(whatToTest) && extraRequirements(str, idx)) {
      DEV && console.log(`172 ${`\u001b[${31}m${`R7`}\u001b[${39}m`} passed`);
      passed = true;
    } else if (r8.test(whatToTest)) {
      DEV && console.log(`175 ${`\u001b[${31}m${`R8`}\u001b[${39}m`} passed`);
      passed = true;
    } else if (
      str[idx] === "/" &&
      str[leftSideIdx] !== "<" &&
      r10.test(whatToTest)
    ) {
      DEV && console.log(`182 ${`\u001b[${31}m${`R10`}\u001b[${39}m`} passed`);
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
          whatToTest[1] &&
          whatToTest[1].trim())) &&
      r9.test(whatToTest)
    ) {
      DEV &&
        console.log(`201 ${`\u001b[${31}m${`R9`}\u001b[${39}m`} qualified`);
      qualified = true;
    } else if (r1.test(whatToTest) && extraRequirements(str, idx)) {
      DEV &&
        console.log(`205 ${`\u001b[${31}m${`R1`}\u001b[${39}m`} qualified`);
      qualified = true;
    } else if (r2.test(whatToTest)) {
      DEV &&
        console.log(`209 ${`\u001b[${31}m${`R2`}\u001b[${39}m`} qualified`);
      qualified = true;
    } else if (r3.test(whatToTest) && extraRequirements(str, idx)) {
      DEV &&
        console.log(`213 ${`\u001b[${31}m${`R3`}\u001b[${39}m`} qualified`);
      qualified = true;
    } else if (r4.test(whatToTest)) {
      DEV &&
        console.log(`217 ${`\u001b[${31}m${`R4`}\u001b[${39}m`} qualified`);
      qualified = true;
    }

    DEV &&
      console.log(
        `223 FIY ${`\u001b[${33}m${`qualified`}\u001b[${39}m`} = ${JSON.stringify(
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
            DEV && console.log(`235`);
            if (
              (str[idx] === "<" && str[idx + 1] && str[idx + 1].trim()) ||
              str[idx - 1] === "<"
            ) {
              passed = true;
              DEV &&
                console.log(
                  `243 ${`\u001b[${31}m${`EOL after tag name`}\u001b[${39}m`}`,
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
      DEV && console.log(`267 SET passed = true`);
      passed = true;
    }
  }

  DEV &&
    console.log(
      `274 ${`\u001b[${33}m${`passed`}\u001b[${39}m`} = ${JSON.stringify(
        passed,
        null,
        4,
      )}`,
    );

  if (
    !passed &&
    str[idx] === "<" &&
    str[idx + 1] &&
    str[idx + 1].trim() &&
    matchRight(str, idx, knownHtmlTags, matchingOptions)
  ) {
    passed = true;
    DEV && console.log(`289 SET passed = true`);
  }

  DEV &&
    console.log(
      `294 ${`\u001b[${33}m${`passed`}\u001b[${39}m`} = ${JSON.stringify(
        passed,
        null,
        4,
      )}`,
    );

  //
  DEV &&
    console.log(
      `304 ${`\u001b[${33}m${`isNotLetter(str[${
        idx + 1
      }])`}\u001b[${39}m`} = ${JSON.stringify(
        isNotLetter(str[idx + 1]),
        null,
        4,
      )}`,
    );
  let res = typeof str === "string" && idx < str.length && passed;
  DEV && console.log(`313 return ${`\u001b[${36}m${res}\u001b[${39}m`}`);
  return res;
}

export { isOpening, defaults, version };
