/**
 * codsen-parser
 * Parser aiming at broken code, especially HTML & CSS
 * Version: 0.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-parser
 */

import tokenizer from 'codsen-tokenizer';
import op from 'object-path';

function incrementStringNumber(str) {
  if (/^\d*$/.test(str)) {
    return Number.parseInt(str, 10) + 1;
  }
  return str;
}
function pathNext(str) {
  if (typeof str !== "string" || !str.length) {
    return str;
  }
  if (str.includes(".") && /^\d*$/.test(str.slice(str.lastIndexOf(".") + 1))) {
    return `${str.slice(0, str.lastIndexOf(".") + 1)}${incrementStringNumber(
      str.slice(str.lastIndexOf(".") + 1)
    )}`;
  } else if (/^\d*$/.test(str)) {
    return `${incrementStringNumber(str)}`;
  }
  return str;
}

function pathUp(str) {
  if (typeof str === "string") {
    if (!str.includes(".") || !str.slice(str.indexOf(".") + 1).includes(".")) {
      return "0";
    }
    let dotsCount = 0;
    for (let i = str.length; i--; ) {
      if (str[i] === ".") {
        dotsCount++;
      }
      if (dotsCount === 2) {
        return str.slice(0, i);
      }
    }
  }
  return str;
}

const tagsThatNest = [
  "a",
  "b",
  "div",
  "em",
  "i",
  "span",
  "strong",
  "table",
  "td",
  "tr"
];
function isObj(something) {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}
function cparser(str, originalOpts) {
  if (typeof str !== "string") {
    if (str === undefined) {
      throw new Error(
        "codsen-tokenizer: [THROW_ID_01] the first input argument is completely missing! It should be given as string."
      );
    } else {
      throw new Error(
        `codsen-tokenizer: [THROW_ID_02] the first input argument must be string! It was given as "${typeof str}", equal to:\n${JSON.stringify(
          str,
          null,
          4
        )}`
      );
    }
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_03] the second input argument, an options object, should be a plain object but it was given as type ${typeof originalOpts}, equal to ${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }
  if (
    isObj(originalOpts) &&
    originalOpts.tagCb &&
    typeof originalOpts.tagCb !== "function"
  ) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_04] the opts.tagCb, callback function, should be a function but it was given as type ${typeof originalOpts.tagCb}, equal to ${JSON.stringify(
        originalOpts.tagCb,
        null,
        4
      )}`
    );
  }
  if (
    isObj(originalOpts) &&
    originalOpts.charCb &&
    typeof originalOpts.charCb !== "function"
  ) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_05] the opts.charCb, callback function, should be a function but it was given as type ${typeof originalOpts.charCb}, equal to ${JSON.stringify(
        originalOpts.charCb,
        null,
        4
      )}`
    );
  }
  if (
    isObj(originalOpts) &&
    originalOpts.reportProgressFunc &&
    typeof originalOpts.reportProgressFunc !== "function"
  ) {
    throw new Error(
      `codsen-tokenizer: [THROW_ID_06] the opts.reportProgressFunc, callback function, should be a function but it was given as type ${typeof originalOpts.reportProgressFunc}, equal to ${JSON.stringify(
        originalOpts.reportProgressFunc,
        null,
        4
      )}`
    );
  }
  const defaults = {
    reportProgressFunc: null,
    reportProgressFuncFrom: 0,
    reportProgressFuncTo: 100,
    tagCb: null,
    charCb: null
  };
  const opts = Object.assign({}, defaults, originalOpts);
  const res = [];
  let path;
  let nestNext = false;
  tokenizer(str, {
    reportProgressFunc: opts.reportProgressFunc,
    reportProgressFuncFrom: opts.reportProgressFuncFrom,
    reportProgressFuncTo: opts.reportProgressFuncTo,
    tagCb: tokenObj => {
      if (typeof opts.tagCb === "function") {
        opts.tagCb(tokenObj);
      }
      if (nestNext) {
        nestNext = false;
        path = `${path}.children.0`;
      } else if (
        tokenObj.type === "html" &&
        tokenObj.closing &&
        path.includes(".")
      ) {
        path = pathNext(pathUp(path));
      } else if (!path) {
        path = "0";
      } else {
        path = pathNext(path);
      }
      if (
        tokenObj.type === "html" &&
        tagsThatNest.includes(tokenObj.tagName) &&
        !tokenObj.closing
      ) {
        nestNext = true;
      }
      op.set(res, path, Object.assign({ children: [] }, tokenObj));
    },
    charCb: opts.charCb
  });
  return res;
}

export default cparser;
