/**
 * emlint
 * Detects errors in HTML/CSS, proposes fixes, email-template friendly
 * Version: 0.1.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://bitbucket.org/codsen/codsen/src/master/packages/emlint
 */

import clone from 'lodash.clonedeep';
import isObj from 'lodash.isplainobject';

var version = "0.1.0";

function isLowerCaseLetter(char) {
  return (
    isStr(char) &&
    char.length === 1 &&
    char.charCodeAt(0) > 96 &&
    char.charCodeAt(0) < 123
  );
}
function isStr(something) {
  return typeof something === "string";
}
function charSuitableForTagName(char) {
  return isLowerCaseLetter(char);
}

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
    if (logTag.tagNameStartAt !== null && !charSuitableForTagName(str[i])) {
      logTag.tagNameEndAt = i;
      logTag.tagName = str.slice(logTag.tagNameStartAt, i);
    }
    if (
      logTag.tagStartAt !== null &&
      logTag.tagNameStartAt === null &&
      charSuitableForTagName(str[i]) &&
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
    if (str[i] === "<" && logTag.tagStartAt === null) {
      logTag.tagStartAt = i;
    }
    if (str[i] === ">" && logTag.tagStartAt !== null) {
      resetLogTag();
    }
  }
  return retObj;
}

export { emlint, version };
