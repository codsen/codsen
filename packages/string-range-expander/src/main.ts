import { isStr, isInt, isPlainObject as isObj } from "codsen-utils";

import type { Range } from "../../../ops/typedefs/common";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

export interface Opts {
  str: string;
  from: number;
  to: number;
  ifLeftSideIncludesThisThenCropTightly: string;
  ifLeftSideIncludesThisCropItToo: string;
  ifRightSideIncludesThisThenCropTightly: string;
  ifRightSideIncludesThisCropItToo: string;
  extendToOneSide: false | "left" | "right";
  wipeAllWhitespaceOnLeft: boolean;
  wipeAllWhitespaceOnRight: boolean;
  addSingleSpaceToPreventAccidentalConcatenation: boolean;
}

const defaults: Opts = {
  str: "",
  from: 0,
  to: 0,
  ifLeftSideIncludesThisThenCropTightly: "",
  ifLeftSideIncludesThisCropItToo: "",
  ifRightSideIncludesThisThenCropTightly: "",
  ifRightSideIncludesThisCropItToo: "",
  extendToOneSide: false,
  wipeAllWhitespaceOnLeft: false,
  wipeAllWhitespaceOnRight: false,
  addSingleSpaceToPreventAccidentalConcatenation: false,
};

function expander(opts: Partial<Opts>): Range {
  let letterOrDigit = /^[0-9a-zA-Z]+$/;

  // Internal functions
  // ---------------------------------------------------------------------------

  function isWhitespace(char: any): boolean {
    return isStr(char) && !char.trim();
  }

  // Sanitise the inputs
  // ---------------------------------------------------------------------------

  if (!isObj(opts)) {
    let supplementalString;
    if (opts === undefined) {
      supplementalString = "but it is missing completely.";
    } else if (opts === null) {
      supplementalString = "but it was given as null.";
    } else {
      supplementalString = `but it was given as ${typeof opts}, equal to:\n${JSON.stringify(
        opts,
        null,
        4,
      )}.`;
    }
    throw new Error(
      `string-range-expander: [THROW_ID_01] Input must be a plain object ${supplementalString}`,
    );
  } else if (!Object.keys(opts).length) {
    throw new Error(
      `string-range-expander: [THROW_ID_02] Input must be a plain object but it's been given as a plain object without any keys. However, "from" and "to" settings are obligatory!`,
    );
  }
  if (!isInt(opts.from)) {
    throw new Error(
      `string-range-expander: [THROW_ID_03] The input's "from" value resolvedOpts.from, is not a number! It's been given as ${typeof opts.from}, equal to ${JSON.stringify(
        opts.from,
        null,
        0,
      )}`,
    );
  }
  if (!isInt(opts.to)) {
    throw new Error(
      `string-range-expander: [THROW_ID_04] The input's "to" value resolvedOpts.to, is not a number! It's been given as ${typeof opts.to}, equal to ${JSON.stringify(
        opts.to,
        null,
        0,
      )}`,
    );
  }
  if (opts?.str && !opts.str[opts.from] && opts.from !== opts.to) {
    throw new Error(
      `string-range-expander: [THROW_ID_05] The given input string resolvedOpts.str ("${opts.str}") must contain the character at index "from" ("${opts.from}")`,
    );
  }
  if (opts?.str && !opts.str[opts.to - 1]) {
    throw new Error(
      `string-range-expander: [THROW_ID_06] The given input string, resolvedOpts.str ("${
        opts.str
      }") must contain the character at index before "to" ("${opts.to - 1}")`,
    );
  }
  if (opts.from > opts.to) {
    throw new Error(
      `string-range-expander: [THROW_ID_07] The given "from" index, "${opts.from}" is greater than "to" index, "${opts.to}". That's wrong!`,
    );
  }
  if (
    opts.extendToOneSide === null ||
    (isStr(opts.extendToOneSide) &&
      opts.extendToOneSide !== "left" &&
      opts.extendToOneSide !== "right") ||
    (!isStr(opts.extendToOneSide) &&
      opts.extendToOneSide !== undefined &&
      opts.extendToOneSide)
  ) {
    throw new Error(
      `string-range-expander: [THROW_ID_08] The options value "extendToOneSide" is not recognisable! It's set to: "${
        opts.extendToOneSide
      }" (${typeof opts.extendToOneSide}). It has to be either Boolean "false" or one of strings: "left" or "right"`,
    );
  }
  if (
    opts?.ifLeftSideIncludesThisThenCropTightly &&
    !isStr(opts.ifLeftSideIncludesThisThenCropTightly)
  ) {
    throw new Error(
      `string-range-expander: [THROW_ID_09] The option "ifLeftSideIncludesThisThenCropTightly", is not a string! It's been given as ${typeof opts.ifLeftSideIncludesThisThenCropTightly}, equal to ${JSON.stringify(
        opts.ifLeftSideIncludesThisThenCropTightly,
        null,
        0,
      )}`,
    );
  }
  if (
    opts?.ifLeftSideIncludesThisCropItToo &&
    !isStr(opts.ifLeftSideIncludesThisCropItToo)
  ) {
    throw new Error(
      `string-range-expander: [THROW_ID_10] The option "ifLeftSideIncludesThisCropItToo", is not a string! It's been given as ${typeof opts.ifLeftSideIncludesThisCropItToo}, equal to ${JSON.stringify(
        opts.ifLeftSideIncludesThisCropItToo,
        null,
        0,
      )}`,
    );
  }
  if (
    opts?.ifRightSideIncludesThisThenCropTightly &&
    !isStr(opts.ifRightSideIncludesThisThenCropTightly)
  ) {
    throw new Error(
      `string-range-expander: [THROW_ID_11] The option "ifRightSideIncludesThisThenCropTightly", is not a string! It's been given as ${typeof opts.ifRightSideIncludesThisThenCropTightly}, equal to ${JSON.stringify(
        opts.ifRightSideIncludesThisThenCropTightly,
        null,
        0,
      )}`,
    );
  }
  if (
    opts?.ifRightSideIncludesThisCropItToo &&
    !isStr(opts.ifRightSideIncludesThisCropItToo)
  ) {
    throw new Error(
      `string-range-expander: [THROW_ID_12] The option "ifRightSideIncludesThisCropItToo", is not a string! It's been given as ${typeof opts.ifRightSideIncludesThisCropItToo}, equal to ${JSON.stringify(
        opts.ifRightSideIncludesThisCropItToo,
        null,
        0,
      )}`,
    );
  }

  // Prepare the resolvedOpts
  // ---------------------------------------------------------------------------

  let resolvedOpts: Opts = { ...defaults, ...opts };

  // Action
  // ---------------------------------------------------------------------------

  let str = resolvedOpts.str; // convenience
  let from = resolvedOpts.from;
  let to = resolvedOpts.to;

  DEV &&
    console.log(
      `186 START ${`\u001b[${33}m${`from`}\u001b[${39}m`} = ${from}; ${`\u001b[${33}m${`to`}\u001b[${39}m`} = ${to}`,
    );

  // 1. expand the given range outwards and leave a single space or
  // {single-of-whatever-there-was} (like line break, tab etc) on each side
  if (
    resolvedOpts.extendToOneSide !== "right" &&
    ((isWhitespace(str[from - 1]) &&
      (isWhitespace(str[from - 2]) ||
        resolvedOpts.ifLeftSideIncludesThisCropItToo.includes(
          str[from - 2],
        ))) ||
      (str[from - 1] &&
        resolvedOpts.ifLeftSideIncludesThisCropItToo.includes(str[from - 1])) ||
      (resolvedOpts.wipeAllWhitespaceOnLeft && isWhitespace(str[from - 1])))
  ) {
    // loop backwards
    DEV &&
      console.log(`204 ${`\u001b[${36}m${`LOOP BACKWARDS`}\u001b[${39}m`}`);
    for (let i = from; i--; ) {
      DEV &&
        console.log(`\u001b[${36}m${`---- str[${i}]=${str[i]}`}\u001b[${39}m`);
      if (!resolvedOpts.ifLeftSideIncludesThisCropItToo.includes(str[i])) {
        if (str[i].trim()) {
          if (
            resolvedOpts.wipeAllWhitespaceOnLeft ||
            resolvedOpts.ifLeftSideIncludesThisCropItToo.includes(str[i + 1])
          ) {
            from = i + 1;
          } else {
            from = i + 2;
          }
          DEV &&
            console.log(
              `220 SET ${`\u001b[${33}m${`from`}\u001b[${39}m`} = ${from}, BREAK`,
            );
          break;
        } else if (i === 0) {
          if (resolvedOpts.wipeAllWhitespaceOnLeft) {
            from = 0;
          } else {
            from = 1;
          }
          DEV &&
            console.log(
              `231 SET ${`\u001b[${33}m${`from`}\u001b[${39}m`} = ${from}`,
            );
          break;
        }
      }
    }
  }

  // 2. expand forward
  if (
    resolvedOpts.extendToOneSide !== "left" &&
    ((isWhitespace(str[to]) &&
      (resolvedOpts.wipeAllWhitespaceOnRight || isWhitespace(str[to + 1]))) ||
      resolvedOpts.ifRightSideIncludesThisCropItToo.includes(str[to]))
  ) {
    // loop forward
    DEV && console.log(`247 ${`\u001b[${36}m${`LOOP FORWARD`}\u001b[${39}m`}`);
    for (let i = to, len = str.length; i < len; i++) {
      DEV &&
        console.log(`\u001b[${36}m${`---- str[${i}]=${str[i]}`}\u001b[${39}m`);
      if (!resolvedOpts.ifRightSideIncludesThisCropItToo.includes(str[i])) {
        if (str[i].trim()) {
          if (
            resolvedOpts.wipeAllWhitespaceOnRight ||
            resolvedOpts.ifRightSideIncludesThisCropItToo.includes(str[i - 1])
          ) {
            to = i;
            DEV && console.log(`258`);
          } else {
            to = i - 1;
            DEV && console.log(`261`);
          }
          DEV &&
            console.log(
              `265 SET ${`\u001b[${33}m${`to`}\u001b[${39}m`} = ${to}, BREAK`,
            );
          break;
        } else if (i === str.length - 1) {
          if (resolvedOpts.wipeAllWhitespaceOnRight) {
            to = str.length;
            DEV && console.log(`271`);
          } else {
            to = str.length - 1;
            DEV && console.log(`274`);
          }
          DEV &&
            console.log(
              `278 SET ${`\u001b[${33}m${`to`}\u001b[${39}m`} = ${to}`,
            );
          break;
        }
      }
    }
  }

  // 3. tight crop adjustments
  if (
    (resolvedOpts.extendToOneSide !== "right" &&
      isStr(resolvedOpts.ifLeftSideIncludesThisThenCropTightly) &&
      resolvedOpts.ifLeftSideIncludesThisThenCropTightly &&
      ((str[from - 2] &&
        resolvedOpts.ifLeftSideIncludesThisThenCropTightly.includes(
          str[from - 2],
        )) ||
        (str[from - 1] &&
          resolvedOpts.ifLeftSideIncludesThisThenCropTightly.includes(
            str[from - 1],
          )))) ||
    (resolvedOpts.extendToOneSide !== "left" &&
      isStr(resolvedOpts.ifRightSideIncludesThisThenCropTightly) &&
      resolvedOpts.ifRightSideIncludesThisThenCropTightly &&
      ((str[to + 1] &&
        resolvedOpts.ifRightSideIncludesThisThenCropTightly.includes(
          str[to + 1],
        )) ||
        (str[to] &&
          resolvedOpts.ifRightSideIncludesThisThenCropTightly.includes(
            str[to],
          ))))
  ) {
    DEV && console.log("311");
    if (
      resolvedOpts.extendToOneSide !== "right" &&
      isWhitespace(str[from - 1]) &&
      !resolvedOpts.wipeAllWhitespaceOnLeft
    ) {
      from -= 1;
      DEV &&
        console.log(`SET ${`\u001b[${33}m${`from`}\u001b[${39}m`} = ${from}`);
    }
    if (
      resolvedOpts.extendToOneSide !== "left" &&
      isWhitespace(str[to]) &&
      !resolvedOpts.wipeAllWhitespaceOnRight
    ) {
      to += 1;
      DEV && console.log(`SET ${`\u001b[${33}m${`to`}\u001b[${39}m`} = ${to}`);
    }
  }

  if (
    resolvedOpts.addSingleSpaceToPreventAccidentalConcatenation &&
    str[from - 1]?.trim() &&
    str[to]?.trim() &&
    ((!resolvedOpts.ifLeftSideIncludesThisThenCropTightly &&
      !resolvedOpts.ifRightSideIncludesThisThenCropTightly) ||
      !(
        (!resolvedOpts.ifLeftSideIncludesThisThenCropTightly ||
          resolvedOpts.ifLeftSideIncludesThisThenCropTightly.includes(
            str[from - 1],
          )) &&
        (!resolvedOpts.ifRightSideIncludesThisThenCropTightly ||
          (str[to] &&
            resolvedOpts.ifRightSideIncludesThisThenCropTightly.includes(
              str[to],
            )))
      )) &&
    (letterOrDigit.test(str[from - 1]) || letterOrDigit.test(str[to]))
  ) {
    DEV && console.log(`350 RETURN: [${from}, ${to}, " "]`);
    return [from, to, " "];
  }
  DEV && console.log(`353 RETURN: [${from}, ${to}]`);
  return [from, to];
}

export { expander, defaults, version, Range };
