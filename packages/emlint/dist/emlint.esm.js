/**
 * emlint
 * Detects errors in HTML/CSS, proposes fixes, email-template friendly
 * Version: 0.3.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://bitbucket.org/codsen/codsen/src/master/packages/emlint
 */

import clone from 'lodash.clonedeep';
import isObj from 'lodash.isplainobject';

var version = "0.3.0";

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
    console.log(
      `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
        str[i].trim().length ? str[i] : JSON.stringify(str[i], null, 0)
      }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m`
    );
    if (logWhitespace.startAt !== null && str[i].trim().length) {
      resetLogWhitespace();
      console.log(
        `131 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`logWhitespace.startAt`}\u001b[${39}m`} = ${JSON.stringify(
          logWhitespace.startAt,
          null,
          4
        )}`
      );
    }
    if (!str[i].trim().length && logWhitespace.startAt === null) {
      logWhitespace.startAt = i;
      console.log(
        `143 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`logWhitespace.startAt`}\u001b[${39}m`} = ${JSON.stringify(
          logWhitespace.startAt,
          null,
          4
        )}`
      );
    }
    if (str[i] === "\n" || str[i] === "\r") {
      if (logWhitespace.startAt !== null && !logWhitespace.includesLinebreaks) {
        logWhitespace.includesLinebreaks = true;
        console.log(
          `156 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`logWhitespace.includesLinebreaks`}\u001b[${39}m`} = ${JSON.stringify(
            logWhitespace.includesLinebreaks,
            null,
            4
          )}`
        );
      }
      logWhitespace.lastLinebreakAt = i;
    }
    if (logTag.tagNameStartAt !== null && !charSuitableForTagName(str[i])) {
      console.log("168 character not suitable for tag name");
      logTag.tagNameEndAt = i;
      logTag.tagName = str.slice(logTag.tagNameStartAt, i);
      console.log(
        `172 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`logTag.tagNameEndAt`}\u001b[${39}m`} = ${
          logTag.tagNameEndAt
        }; ${`\u001b[${33}m${`logTag.tagName`}\u001b[${39}m`} = ${JSON.stringify(
          logTag.tagName,
          null,
          0
        )}`
      );
    }
    if (
      logTag.tagStartAt !== null &&
      logTag.tagNameStartAt === null &&
      charSuitableForTagName(str[i]) &&
      logTag.tagStartAt < i
    ) {
      logTag.tagNameStartAt = i;
      console.log(
        `191 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`logTag.tagNameStartAt`}\u001b[${39}m`} = ${
          logTag.tagNameStartAt
        }`
      );
      if (logTag.tagStartAt < i - 1) {
        retObj.issues.push({
          name: "space-after-opening-bracket",
          position: [[logTag.tagStartAt + 1, i]]
        });
      }
    }
    if (str[i] === "<" && logTag.tagStartAt === null) {
      logTag.tagStartAt = i;
      console.log(
        `209 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`logTag.tagStartAt`}\u001b[${39}m`} = ${
          logTag.tagStartAt
        }`
      );
    }
    if (str[i] === ">" && logTag.tagStartAt !== null) {
      resetLogTag();
      console.log(
        `219 end of tag - ${`\u001b[${32}m${`RESET`}\u001b[${39}m`} logTag`
      );
    }
    console.log(
      `${`\u001b[${31}m${`█ `}\u001b[${39}m`}${
        logTag.tagStartAt !== null
          ? `${`\u001b[${33}m${`logTag`}\u001b[${39}m`} ${JSON.stringify(
              logTag,
              null,
              0
            )}; `
          : ""
      }${
        logWhitespace.startAt !== null
          ? `${`\u001b[${33}m${`logWhitespace`}\u001b[${39}m`} ${JSON.stringify(
              logWhitespace,
              null,
              0
            )}; `
          : ""
      }`
    );
  }
  return retObj;
}

export { emlint, version };
