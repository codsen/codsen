/**
 * string-extract-sass-vars
 * Parse SASS variables file into a plain object of CSS key-value pairs
 * Version: 1.1.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-extract-sass-vars
 */

const BACKSLASH = "\u005C";
function extractVars(str, originalOpts) {
  if (typeof str !== "string") {
    return {};
  }
  if (originalOpts && typeof originalOpts !== "object") {
    throw new Error(
      `string-extract-sass-vars: [THROW_ID_01] the second input argument should be a plain object but it was given as ${JSON.stringify(
        originalOpts,
        null,
        4
      )} (type ${typeof originalOpts})`
    );
  }
  const defaults = {
    throwIfEmpty: false,
  };
  const opts = Object.assign({}, defaults, originalOpts);
  const len = str.length;
  let varNameStartsAt = null;
  let varValueStartsAt = null;
  let varName = null;
  let varValue = null;
  let withinQuotes = null;
  let lastNonQuoteCharAt = null;
  let withinComments = false;
  let withinSlashSlashComment = false;
  let withinSlashAsteriskComment = false;
  const res = {};
  for (let i = 0; i < len; i++) {
    if (
      !withinComments &&
      withinQuotes &&
      str[i] === withinQuotes &&
      str[i - 1] !== BACKSLASH
    ) {
      withinQuotes = null;
    }
    else if (
      !withinQuotes &&
      !withinComments &&
      str[i - 1] !== BACKSLASH &&
      `'"`.includes(str[i])
    ) {
      withinQuotes = str[i];
    }
    if (withinSlashSlashComment && `\r\n`.includes(str[i])) {
      withinSlashSlashComment = false;
    }
    if (!withinComments && str[i] === "/" && str[i + 1] === "/") {
      withinSlashSlashComment = true;
    }
    if (
      withinSlashAsteriskComment &&
      str[i - 2] === "*" &&
      str[i - 1] === "/"
    ) {
      withinSlashAsteriskComment = false;
    }
    if (!withinComments && str[i] === "/" && str[i + 1] === "*") {
      withinSlashAsteriskComment = true;
    }
    withinComments = withinSlashSlashComment || withinSlashAsteriskComment;
    if (!withinComments && str[i] === "$" && varNameStartsAt === null) {
      varNameStartsAt = i + 1;
    }
    if (
      !withinComments &&
      varValueStartsAt !== null &&
      !withinQuotes &&
      str[i] === ";"
    ) {
      varValue = str.slice(
        !`"'`.includes(str[varValueStartsAt])
          ? varValueStartsAt
          : varValueStartsAt + 1,
        lastNonQuoteCharAt + 1
      );
      if (/^-?\d*\.?\d*$/.test(varValue)) {
        varValue = +varValue;
      }
      res[varName] = varValue;
      varNameStartsAt = null;
      varValueStartsAt = null;
      varName = null;
      varValue = null;
    }
    if (
      !withinComments &&
      varName !== null &&
      str[i] &&
      str[i].trim().length &&
      varValueStartsAt === null
    ) {
      varValueStartsAt = i;
    }
    if (
      !withinComments &&
      !varName &&
      varNameStartsAt !== null &&
      str[i] === ":" &&
      !withinQuotes
    ) {
      varName = str.slice(varNameStartsAt, i);
    }
    if (!`'"`.includes(str[i])) {
      lastNonQuoteCharAt = i;
    }
  }
  if (!Object.keys(res).length && opts.throwIfEmpty) {
    throw new Error(
      `string-extract-sass-vars: [THROW_ID_02] no keys extracted! (setting opts.originalOpts)`
    );
  }
  return res;
}

export default extractVars;
