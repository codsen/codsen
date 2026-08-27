import {
  formatDiagnosticValue,
  isInt,
  isPlainObject as isObj,
  isStr,
} from "codsen-utils";

import type { Range } from "../../../ops/typedefs/common";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

function markerIncludesCodePointAt(
  markers: string,
  str: string,
  index: number,
): boolean {
  const char = str[index];
  if (!markers || !char || !markers.includes(char)) {
    return false;
  }

  const current = char.charCodeAt(0);
  let highIndex = index;
  let lowIndex = index + 1;

  if (
    current >= 0xd800 &&
    current <= 0xdbff &&
    str.charCodeAt(lowIndex) >= 0xdc00 &&
    str.charCodeAt(lowIndex) <= 0xdfff
  ) {
    // current is the high surrogate of a complete pair
  } else if (
    current >= 0xdc00 &&
    current <= 0xdfff &&
    str.charCodeAt(index - 1) >= 0xd800 &&
    str.charCodeAt(index - 1) <= 0xdbff
  ) {
    highIndex = index - 1;
    lowIndex = index;
  } else {
    // Preserve the fast path for BMP characters and unpaired surrogates.
    return markers.includes(str[index]);
  }

  const high = str.charCodeAt(highIndex);
  const low = str.charCodeAt(lowIndex);
  for (let i = 0; i < markers.length - 1; i++) {
    if (markers.charCodeAt(i) === high && markers.charCodeAt(i + 1) === low) {
      return true;
    }
  }
  return false;
}

export interface Opts {
  str: string;
  from: number;
  to: number;
  ifLeftSideIncludesThisThenCropTightly?: string;
  ifLeftSideIncludesThisCropItToo?: string;
  ifRightSideIncludesThisThenCropTightly?: string;
  ifRightSideIncludesThisCropItToo?: string;
  extendToOneSide?: false | "left" | "right";
  wipeAllWhitespaceOnLeft?: boolean;
  wipeAllWhitespaceOnRight?: boolean;
  addSingleSpaceToPreventAccidentalConcatenation?: boolean;
}

type ResolvedOpts = Required<Opts>;

const defaults: ResolvedOpts = {
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

function expander(opts: Opts): Range {
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
      supplementalString = `but it was given as ${typeof opts}, equal to:\n${formatDiagnosticValue(opts, 4)}.`;
    }
    throw new Error(
      `string-range-expander/expander(): [THROW_ID_01] Input must be a plain object ${supplementalString}`,
    );
  } else if (!Object.keys(opts).length) {
    throw new Error(
      `string-range-expander/expander(): [THROW_ID_02] Input must be a plain object with the required "str", "from", and "to" keys, but it was given without any keys.`,
    );
  }
  if (!isStr(opts.str)) {
    throw new Error(
      `string-range-expander/expander(): [THROW_ID_03] The input's "str" value must be a string! It was given as ${typeof opts.str}, equal to ${formatDiagnosticValue(opts.str)}`,
    );
  }
  if (!isInt(opts.from) || opts.from < 0) {
    throw new Error(
      `string-range-expander/expander(): [THROW_ID_04] The input's "from" value must be a non-negative integer! It was given as ${typeof opts.from}, equal to ${formatDiagnosticValue(opts.from)}`,
    );
  }
  if (!isInt(opts.to) || opts.to < 0) {
    throw new Error(
      `string-range-expander/expander(): [THROW_ID_05] The input's "to" value must be a non-negative integer! It was given as ${typeof opts.to}, equal to ${formatDiagnosticValue(opts.to)}`,
    );
  }
  if (opts.from > opts.str.length) {
    throw new Error(
      `string-range-expander/expander(): [THROW_ID_06] The input's "from" value (${opts.from}) must not exceed the string length (${opts.str.length}).`,
    );
  }
  if (opts.to > opts.str.length) {
    throw new Error(
      `string-range-expander/expander(): [THROW_ID_07] The input's "to" value (${opts.to}) must not exceed the string length (${opts.str.length}).`,
    );
  }
  if (opts.from > opts.to) {
    throw new Error(
      `string-range-expander/expander(): [THROW_ID_08] The input's "from" value (${opts.from}) must not exceed its "to" value (${opts.to}).`,
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
      `string-range-expander/expander(): [THROW_ID_09] The options value "extendToOneSide" is not recognisable! It's set to: "${
        opts.extendToOneSide
      }" (${typeof opts.extendToOneSide}). It has to be either Boolean "false" or one of strings: "left" or "right"`,
    );
  }
  if (
    opts?.ifLeftSideIncludesThisThenCropTightly &&
    !isStr(opts.ifLeftSideIncludesThisThenCropTightly)
  ) {
    throw new Error(
      `string-range-expander/expander(): [THROW_ID_10] The option "ifLeftSideIncludesThisThenCropTightly", is not a string! It's been given as ${typeof opts.ifLeftSideIncludesThisThenCropTightly}, equal to ${formatDiagnosticValue(opts.ifLeftSideIncludesThisThenCropTightly)}`,
    );
  }
  if (
    opts?.ifLeftSideIncludesThisCropItToo &&
    !isStr(opts.ifLeftSideIncludesThisCropItToo)
  ) {
    throw new Error(
      `string-range-expander/expander(): [THROW_ID_11] The option "ifLeftSideIncludesThisCropItToo", is not a string! It's been given as ${typeof opts.ifLeftSideIncludesThisCropItToo}, equal to ${formatDiagnosticValue(opts.ifLeftSideIncludesThisCropItToo)}`,
    );
  }
  if (
    opts?.ifRightSideIncludesThisThenCropTightly &&
    !isStr(opts.ifRightSideIncludesThisThenCropTightly)
  ) {
    throw new Error(
      `string-range-expander/expander(): [THROW_ID_12] The option "ifRightSideIncludesThisThenCropTightly", is not a string! It's been given as ${typeof opts.ifRightSideIncludesThisThenCropTightly}, equal to ${formatDiagnosticValue(opts.ifRightSideIncludesThisThenCropTightly)}`,
    );
  }
  if (
    opts?.ifRightSideIncludesThisCropItToo &&
    !isStr(opts.ifRightSideIncludesThisCropItToo)
  ) {
    throw new Error(
      `string-range-expander/expander(): [THROW_ID_13] The option "ifRightSideIncludesThisCropItToo", is not a string! It's been given as ${typeof opts.ifRightSideIncludesThisCropItToo}, equal to ${formatDiagnosticValue(opts.ifRightSideIncludesThisCropItToo)}`,
    );
  }

  // Prepare the resolvedOpts
  // ---------------------------------------------------------------------------

  let resolvedOpts: ResolvedOpts = { ...defaults, ...opts };

  // Action
  // ---------------------------------------------------------------------------

  let str = resolvedOpts.str; // convenience
  let from = resolvedOpts.from;
  let to = resolvedOpts.to;

  DEV &&
    console.log(
      `START ${`\u001b[${33}m${`from`}\u001b[${39}m`} = ${from}; ${`\u001b[${33}m${`to`}\u001b[${39}m`} = ${to}`,
    );

  // 1. expand the given range outwards and leave a single space or
  // {single-of-whatever-there-was} (like line break, tab etc) on each side
  if (
    resolvedOpts.extendToOneSide !== "right" &&
    ((isWhitespace(str[from - 1]) &&
      (isWhitespace(str[from - 2]) ||
        markerIncludesCodePointAt(
          resolvedOpts.ifLeftSideIncludesThisCropItToo,
          str,
          from - 2,
        ))) ||
      (str[from - 1] &&
        markerIncludesCodePointAt(
          resolvedOpts.ifLeftSideIncludesThisCropItToo,
          str,
          from - 1,
        )) ||
      (resolvedOpts.wipeAllWhitespaceOnLeft && isWhitespace(str[from - 1])))
  ) {
    // loop backwards
    DEV && console.log(`${`\u001b[${36}m${`LOOP BACKWARDS`}\u001b[${39}m`}`);
    for (let i = from; i--; ) {
      DEV &&
        console.log(`\u001b[${36}m${`---- str[${i}]=${str[i]}`}\u001b[${39}m`);
      if (
        !markerIncludesCodePointAt(
          resolvedOpts.ifLeftSideIncludesThisCropItToo,
          str,
          i,
        )
      ) {
        if (str[i].trim()) {
          if (
            resolvedOpts.wipeAllWhitespaceOnLeft ||
            markerIncludesCodePointAt(
              resolvedOpts.ifLeftSideIncludesThisCropItToo,
              str,
              i + 1,
            )
          ) {
            from = i + 1;
          } else {
            from = i + 2;
          }
          DEV &&
            console.log(
              `SET ${`\u001b[${33}m${`from`}\u001b[${39}m`} = ${from}, BREAK`,
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
              `SET ${`\u001b[${33}m${`from`}\u001b[${39}m`} = ${from}`,
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
      (resolvedOpts.wipeAllWhitespaceOnRight ||
        isWhitespace(str[to + 1]) ||
        markerIncludesCodePointAt(
          resolvedOpts.ifRightSideIncludesThisCropItToo,
          str,
          to + 1,
        ))) ||
      markerIncludesCodePointAt(
        resolvedOpts.ifRightSideIncludesThisCropItToo,
        str,
        to,
      ))
  ) {
    // loop forward
    DEV && console.log(`${`\u001b[${36}m${`LOOP FORWARD`}\u001b[${39}m`}`);
    for (let i = to, len = str.length; i < len; i++) {
      DEV &&
        console.log(`\u001b[${36}m${`---- str[${i}]=${str[i]}`}\u001b[${39}m`);
      if (
        !markerIncludesCodePointAt(
          resolvedOpts.ifRightSideIncludesThisCropItToo,
          str,
          i,
        )
      ) {
        if (str[i].trim()) {
          if (
            resolvedOpts.wipeAllWhitespaceOnRight ||
            markerIncludesCodePointAt(
              resolvedOpts.ifRightSideIncludesThisCropItToo,
              str,
              i - 1,
            )
          ) {
            to = i;
            DEV && console.log();
          } else {
            to = i - 1;
            DEV && console.log();
          }
          DEV &&
            console.log(
              `SET ${`\u001b[${33}m${`to`}\u001b[${39}m`} = ${to}, BREAK`,
            );
          break;
        } else if (i === str.length - 1) {
          if (resolvedOpts.wipeAllWhitespaceOnRight) {
            to = str.length;
            DEV && console.log();
          } else {
            to = str.length - 1;
            DEV && console.log();
          }
          DEV &&
            console.log(`SET ${`\u001b[${33}m${`to`}\u001b[${39}m`} = ${to}`);
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
        markerIncludesCodePointAt(
          resolvedOpts.ifLeftSideIncludesThisThenCropTightly,
          str,
          from - 2,
        )) ||
        (str[from - 1] &&
          markerIncludesCodePointAt(
            resolvedOpts.ifLeftSideIncludesThisThenCropTightly,
            str,
            from - 1,
          )))) ||
    (resolvedOpts.extendToOneSide !== "left" &&
      isStr(resolvedOpts.ifRightSideIncludesThisThenCropTightly) &&
      resolvedOpts.ifRightSideIncludesThisThenCropTightly &&
      ((str[to + 1] &&
        markerIncludesCodePointAt(
          resolvedOpts.ifRightSideIncludesThisThenCropTightly,
          str,
          to + 1,
        )) ||
        (str[to] &&
          markerIncludesCodePointAt(
            resolvedOpts.ifRightSideIncludesThisThenCropTightly,
            str,
            to,
          ))))
  ) {
    DEV && console.log();
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
          markerIncludesCodePointAt(
            resolvedOpts.ifLeftSideIncludesThisThenCropTightly,
            str,
            from - 1,
          )) &&
        (!resolvedOpts.ifRightSideIncludesThisThenCropTightly ||
          (str[to] &&
            markerIncludesCodePointAt(
              resolvedOpts.ifRightSideIncludesThisThenCropTightly,
              str,
              to,
            )))
      )) &&
    (letterOrDigit.test(str[from - 1]) || letterOrDigit.test(str[to]))
  ) {
    DEV && console.log(`RETURN: [${from}, ${to}, " "]`);
    return [from, to, " "];
  }
  DEV && console.log(`RETURN: [${from}, ${to}]`);
  return [from, to];
}

export { defaults, expander, type Range, version };
