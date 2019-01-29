/**
 * emlint
 * Detects errors in HTML/CSS, proposes fixes, email-template friendly
 * Version: 0.4.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://bitbucket.org/codsen/codsen/src/master/packages/emlint
 */

import checkTypes from 'check-types-mini';
import isObj from 'lodash.isplainobject';
import clone from 'lodash.clonedeep';
import merge from 'ranges-merge';

var version = "0.4.0";

const lowAsciiCharacterNames = [
  "null",
  "start-of-heading",
  "start-of-text",
  "end-of-text",
  "end-of-transmission",
  "enquiry",
  "acknowledge",
  "bell",
  "backspace",
  "character-tabulation",
  "line-feed",
  "line-tabulation",
  "form-feed",
  "carriage-return",
  "shift-out",
  "shift-in",
  "data-link-escape",
  "device-control-one",
  "device-control-two",
  "device-control-three",
  "device-control-four",
  "negative-acknowledge",
  "synchronous-idle",
  "end-of-transmission-block",
  "cancel",
  "end-of-medium",
  "substitute",
  "escape",
  "information-separator-four",
  "information-separator-three",
  "information-separator-two",
  "information-separator-one",
  "space",
  "exclamation-mark"
];
function isUppercaseLetter(char) {
  return (
    isStr(char) &&
    char.length === 1 &&
    char.charCodeAt(0) > 64 &&
    char.charCodeAt(0) < 91
  );
}
function isStr(something) {
  return typeof something === "string";
}
function isLatinLetter(char) {
  return (
    isStr(char) &&
    char.length === 1 &&
    ((char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) ||
      (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123))
  );
}

const errors = "./errors.json";
const isArr = Array.isArray;
function emlint(str, originalOpts) {
  if (!isStr(str)) {
    throw new Error(
      `emlint: [THROW_ID_01] the first input argument must be a string. It was given as:\n${JSON.stringify(
        str,
        null,
        4
      )} (type ${typeof str})`
    );
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error(
      `emlint: [THROW_ID_02] the second input argument must be a plain object. It was given as:\n${JSON.stringify(
        originalOpts,
        null,
        4
      )} (type ${typeof originalOpts})`
    );
  }
  const defaults = {
    rules: "recommended"
  };
  const opts = Object.assign({}, defaults, originalOpts);
  checkTypes(opts, defaults, {
    msg: "emlint: [THROW_ID_03*]",
    schema: {
      rules: ["string", "object", "false", "null", "undefined"]
    }
  });
  let logTag;
  const defaultLogTag = {
    tagStartAt: null,
    tagNameStartAt: null,
    tagNameEndAt: null,
    tagName: null,
    attributes: []
  };
  function resetLogTag() {
    logTag = clone(defaultLogTag);
  }
  resetLogTag();
  let logWhitespace;
  const defaultLogWhitespace = {
    startAt: null,
    includesLinebreaks: false,
    lastLinebreakAt: null
  };
  function resetLogWhitespace() {
    logWhitespace = clone(defaultLogWhitespace);
  }
  resetLogWhitespace();
  const retObj = {
    issues: []
  };
  for (let i = 0, len = str.length; i < len; i++) {
    const charcode = str[i].charCodeAt(0);
    if (charcode < 32) {
      const name$$1 = `bad-character-${lowAsciiCharacterNames[charcode]}`;
      if (charcode === 9) {
        retObj.issues.push({
          name: name$$1,
          position: [[i, i + 1, "  "]]
        });
      } else if (charcode === 10 || charcode === 13) ; else {
        retObj.issues.push({
          name: name$$1,
          position: [[i, i + 1]]
        });
      }
    }
    if (logWhitespace.startAt !== null && str[i].trim().length) {
      resetLogWhitespace();
    }
    if (!str[i].trim().length && logWhitespace.startAt === null) {
      logWhitespace.startAt = i;
    }
    if (str[i] === "\n" || str[i] === "\r") {
      if (logWhitespace.startAt !== null && !logWhitespace.includesLinebreaks) {
        logWhitespace.includesLinebreaks = true;
      }
      logWhitespace.lastLinebreakAt = i;
    }
    if (logTag.tagNameStartAt !== null && !isLatinLetter(str[i])) {
      logTag.tagNameEndAt = i;
      logTag.tagName = str.slice(logTag.tagNameStartAt, i);
    }
    if (
      logTag.tagStartAt !== null &&
      logTag.tagNameStartAt === null &&
      isLatinLetter(str[i]) &&
      logTag.tagStartAt < i
    ) {
      logTag.tagNameStartAt = i;
      if (logTag.tagStartAt < i - 1) {
        retObj.issues.push({
          name: "space-after-opening-bracket",
          position: [[logTag.tagStartAt + 1, i]]
        });
      }
    }
    if (
      logTag.tagNameStartAt !== null &&
      logTag.tagNameEndAt === null &&
      isUppercaseLetter(str[i])
    ) {
      retObj.issues.push({
        name: "tagname-lowercase",
        position: [[i, i + 1, str[i].toLowerCase()]]
      });
    }
    if (str[i] === "<" && logTag.tagStartAt === null) {
      logTag.tagStartAt = i;
    }
    if (str[i] === ">" && logTag.tagStartAt !== null) {
      resetLogTag();
    }
  }
  retObj.fix =
    isArr(retObj.issues) && retObj.issues.length
      ? merge(
          retObj.issues.reduce((acc, obj) => {
            return acc.concat(obj.position);
          }, [])
        )
      : null;
  return retObj;
}

export { emlint, version, errors };
