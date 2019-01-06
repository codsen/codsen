/**
 * string-trim-spaces-only
 * Like String.trim() but trims only spaces
 * Version: 2.3.6
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://bitbucket.org/codsen/codsen/src/master/packages/string-trim-spaces-only
 */

import checkTypes from 'check-types-mini';

function trimSpaces(s, originalOpts) {
  if (typeof s !== "string") {
    throw new Error(
      `string-trim-spaces-only: [THROW_ID_01] input must be string! It was given as ${typeof s}, equal to:\n${JSON.stringify(
        s,
        null,
        4
      )}`
    );
  }
  const defaults = {
    classicTrim: false
  };
  const opts = Object.assign({}, defaults, originalOpts);
  checkTypes(opts, defaults, {
    msg: "string-trim-spaces-only: [THROW_ID_02*]"
  });
  let newStart;
  let newEnd;
  if (s.length > 0) {
    if (
      (opts.classicTrim && s[0].trim().length === 0) ||
      (!opts.classicTrim && s[0] === " ")
    ) {
      for (let i = 0, len = s.length; i < len; i++) {
        if (
          (opts.classicTrim && s[i].trim().length !== 0) ||
          (!opts.classicTrim && s[i] !== " ")
        ) {
          newStart = i;
          break;
        }
        if (i === s.length - 1) {
          return {
            res: "",
            ranges: [[0, s.length]]
          };
        }
      }
    }
    if (
      (opts.classicTrim && s[s.length - 1].trim().length === 0) ||
      (!opts.classicTrim && s[s.length - 1] === " ")
    ) {
      for (let i = s.length; i--; ) {
        if (
          (opts.classicTrim && s[i].trim().length !== 0) ||
          (!opts.classicTrim && s[i] !== " ")
        ) {
          newEnd = i + 1;
          break;
        }
      }
    }
    if (newStart) {
      if (newEnd) {
        return {
          res: s.slice(newStart, newEnd),
          ranges: [[0, newStart], [newEnd, s.length]]
        };
      }
      return {
        res: s.slice(newStart),
        ranges: [[0, newStart]]
      };
    }
    if (newEnd) {
      return {
        res: s.slice(0, newEnd),
        ranges: [[newEnd, s.length]]
      };
    }
    return {
      res: s,
      ranges: []
    };
  }
  return {
    res: "",
    ranges: []
  };
}

export default trimSpaces;
