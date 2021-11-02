/**
 * @name string-collapse-white-space
 * @fileoverview Replace chunks of whitespace with a single spaces
 * @version 10.0.3
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/string-collapse-white-space/}
 */

import { rApply } from 'ranges-apply';
import { Ranges } from 'ranges-push';
import { right } from 'string-left-right';

var version$1 = "10.0.3";

const version = version$1;
const defaults = {
  trimStart: true,
  trimEnd: true,
  trimLines: false,
  trimnbsp: false,
  removeEmptyLines: false,
  limitConsecutiveEmptyLinesTo: 0,
  enforceSpacesOnly: false,
  cb: ({
    suggested
  }) => {
    return suggested;
  }
};
const cbSchema = ["suggested", "whiteSpaceStartsAt", "whiteSpaceEndsAt", "str"];
function collapse(str, originalOpts) {
  if (typeof str !== "string") {
    throw new Error(`string-collapse-white-space/collapse(): [THROW_ID_01] The input is not string but ${typeof str}, equal to: ${JSON.stringify(str, null, 4)}`);
  }
  if (originalOpts && typeof originalOpts !== "object") {
    throw new Error(`string-collapse-white-space/collapse(): [THROW_ID_02] The opts is not a plain object but ${typeof originalOpts}, equal to:\n${JSON.stringify(originalOpts, null, 4)}`);
  }
  if (!str.length) {
    return {
      result: "",
      ranges: null
    };
  }
  const finalIndexesToDelete = new Ranges();
  const NBSP = `\xa0`;
  const opts = { ...defaults,
    ...originalOpts
  };
  function push(something, extras) {
    if (typeof opts.cb === "function") {
      const final = opts.cb({
        suggested: something,
        ...extras
      });
      if (Array.isArray(final)) {
        finalIndexesToDelete.push(...final);
      }
    } else if (something) {
      finalIndexesToDelete.push(...something);
    }
  }
  let spacesStartAt = null;
  let whiteSpaceStartsAt = null;
  let lineWhiteSpaceStartsAt = null;
  let linebreaksStartAt = null;
  let linebreaksEndAt = null;
  let nbspPresent = false;
  const staging = [];
  let consecutiveLineBreakCount = 0;
  for (let i = 0, len = str.length; i <= len; i++) {
    if (str[i] === "\r" || str[i] === "\n" && str[i - 1] !== "\r") {
      consecutiveLineBreakCount += 1;
      if (linebreaksStartAt === null) {
        linebreaksStartAt = i;
      }
      linebreaksEndAt = str[i] === "\r" && str[i + 1] === "\n" ? i + 2 : i + 1;
    }
    if (!opts.trimnbsp && str[i] === NBSP && !nbspPresent) {
      nbspPresent = true;
    }
    if (
    spacesStartAt !== null &&
    str[i] !== " ") {
      const a1 =
      spacesStartAt && whiteSpaceStartsAt ||
      !whiteSpaceStartsAt && (!opts.trimStart || !opts.trimnbsp && (
      str[i] === NBSP || str[spacesStartAt - 1] === NBSP));
      const a2 =
      str[i] || !opts.trimEnd || !opts.trimnbsp && (
      str[i] === NBSP || str[spacesStartAt - 1] === NBSP);
      const a3 =
      !opts.enforceSpacesOnly ||
      (!str[spacesStartAt - 1] ||
      str[spacesStartAt - 1].trim()) && (
      !str[i] ||
      str[i].trim());
      if (
      spacesStartAt < i - 1 && a1 && a2 && a3) {
        const startIdx = spacesStartAt;
        let endIdx = i;
        let whatToAdd = " ";
        if (opts.trimLines && (
        !spacesStartAt ||
        !str[i] ||
        str[spacesStartAt - 1] && `\r\n`.includes(str[spacesStartAt - 1]) ||
        str[i] && `\r\n`.includes(str[i]))) {
          whatToAdd = null;
        }
        if (whatToAdd && str[spacesStartAt] === " ") {
          endIdx -= 1;
          whatToAdd = null;
        }
        if (!spacesStartAt && opts.trimStart) {
          endIdx = i;
        } else if (!str[i] && opts.trimEnd) {
          endIdx = i;
        }
        staging.push([
        /* istanbul ignore next */
        whatToAdd ? [startIdx, endIdx, whatToAdd] : [startIdx, endIdx], {
          whiteSpaceStartsAt,
          whiteSpaceEndsAt: right(str, i - 1) || i,
          str
        }]);
      }
    }
    if (
    spacesStartAt === null &&
    str[i] === " ") {
      spacesStartAt = i;
    }
    if (
    whiteSpaceStartsAt === null &&
    str[i] && !str[i].trim()) {
      whiteSpaceStartsAt = i;
    }
    if (
    lineWhiteSpaceStartsAt !== null && (
    `\n\r`.includes(str[i]) ||
    !str[i] || str[i].trim() ||
    !(opts.trimnbsp || opts.enforceSpacesOnly) &&
    str[i] === NBSP) && (
    lineWhiteSpaceStartsAt || !opts.trimStart || opts.enforceSpacesOnly && nbspPresent) && (
    str[i] || !opts.trimEnd || opts.enforceSpacesOnly && nbspPresent)) {
      if (
      opts.enforceSpacesOnly && (
      i > lineWhiteSpaceStartsAt + 1 ||
      str[lineWhiteSpaceStartsAt] !== " ")) {
        let startIdx = lineWhiteSpaceStartsAt;
        let endIdx = i;
        let whatToAdd = " ";
        if (str[endIdx - 1] === " ") {
          endIdx -= 1;
          whatToAdd = null;
        } else if (str[lineWhiteSpaceStartsAt] === " ") {
          startIdx += 1;
          whatToAdd = null;
        }
        if ((opts.trimStart || opts.trimLines) && !lineWhiteSpaceStartsAt || (opts.trimEnd || opts.trimLines) && !str[i]) {
          whatToAdd = null;
        }
        push(whatToAdd ? [startIdx, endIdx, whatToAdd] : [startIdx, endIdx], {
          whiteSpaceStartsAt: whiteSpaceStartsAt,
          whiteSpaceEndsAt: i,
          str
        });
      }
      if (
      opts.trimLines && (
      !lineWhiteSpaceStartsAt || `\r\n`.includes(str[lineWhiteSpaceStartsAt - 1]) || !str[i] || `\r\n`.includes(str[i])) && (
      opts.trimnbsp ||
      !nbspPresent)) {
        push([lineWhiteSpaceStartsAt, i], {
          whiteSpaceStartsAt: whiteSpaceStartsAt,
          whiteSpaceEndsAt: right(str, i - 1) || i,
          str
        });
      }
      lineWhiteSpaceStartsAt = null;
    }
    if (
    lineWhiteSpaceStartsAt === null &&
    !`\r\n`.includes(str[i]) &&
    str[i] && !str[i].trim() && (
    opts.trimnbsp || str[i] !== NBSP || opts.enforceSpacesOnly)) {
      lineWhiteSpaceStartsAt = i;
    }
    if (
    whiteSpaceStartsAt !== null && (
    !str[i] ||
    str[i].trim())) {
      if (
      (!whiteSpaceStartsAt && (
      opts.trimStart ||
      opts.trimLines &&
      linebreaksStartAt === null) ||
      !str[i] && (
      opts.trimEnd ||
      opts.trimLines &&
      linebreaksStartAt === null)) && (
      opts.trimnbsp ||
      !nbspPresent ||
      opts.enforceSpacesOnly)) {
        push([whiteSpaceStartsAt, i], {
          whiteSpaceStartsAt,
          whiteSpaceEndsAt: i,
          str
        });
      } else {
        let somethingPushed = false;
        if (opts.removeEmptyLines &&
        linebreaksStartAt !== null &&
        consecutiveLineBreakCount > (opts.limitConsecutiveEmptyLinesTo || 0) + 1) {
          somethingPushed = true;
          let startIdx = linebreaksStartAt;
          let endIdx = linebreaksEndAt || str.length;
          let whatToAdd = `${str[linebreaksStartAt] === "\r" && str[linebreaksStartAt + 1] === "\n" ? "\r\n" : str[linebreaksStartAt]}`.repeat((opts.limitConsecutiveEmptyLinesTo || 0) + 1);
          /* istanbul ignore else */
          if (str.endsWith(whatToAdd, linebreaksEndAt)) {
            endIdx -= whatToAdd.length || 0;
            whatToAdd = null;
          } else if (str.startsWith(whatToAdd, linebreaksStartAt)) {
            startIdx += whatToAdd.length;
            whatToAdd = null;
          }
          /* istanbul ignore next */
          push(whatToAdd ? [startIdx, endIdx, whatToAdd] : [startIdx, endIdx], {
            whiteSpaceStartsAt,
            whiteSpaceEndsAt: i,
            str
          });
        }
        if (staging.length) {
          while (staging.length) {
            push(...staging.shift());
          }
          somethingPushed = true;
        }
        if (!somethingPushed) {
          push(null, {
            whiteSpaceStartsAt,
            whiteSpaceEndsAt: i,
            str
          });
        }
      }
      whiteSpaceStartsAt = null;
      lineWhiteSpaceStartsAt = null;
      nbspPresent = false;
      if (consecutiveLineBreakCount) {
        consecutiveLineBreakCount = 0;
        linebreaksStartAt = null;
        linebreaksEndAt = null;
      }
    }
    if (spacesStartAt !== null && str[i] !== " ") {
      spacesStartAt = null;
    }
  }
  return {
    result: rApply(str, finalIndexesToDelete.current()),
    ranges: finalIndexesToDelete.current()
  };
}

export { cbSchema, collapse, defaults, version };
