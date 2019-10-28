/**
 * codsen-tokenizer
 * Tokenizer for mixed inputs aiming at broken code, especially HTML & CSS
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/codsen-tokenizer
 */

import isObj from 'lodash.isplainobject';
import 'string-left-right';
import 'string-match-left-right';

function isStr(something) {
  return typeof something === "string";
}
const defaults = {
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100
};
function tokenizer(str, cb, originalOpts) {
  if (!isStr(str)) {
    if (str === undefined) {
      throw new Error(
        "html-crush: [THROW_ID_01] the first input argument is completely missing! It should be given as string."
      );
    } else {
      throw new Error(
        `html-crush: [THROW_ID_02] the first input argument must be string! It was given as "${typeof str}", equal to:\n${JSON.stringify(
          str,
          null,
          4
        )}`
      );
    }
  }
  if (typeof cb !== "function") {
    throw new Error(
      `html-crush: [THROW_ID_03] the second input argument, callback function, should be a function but it was given as type ${typeof cb}, equal to ${JSON.stringify(
        cb,
        null,
        4
      )}`
    );
  }
  if (originalOpts && !isObj(originalOpts)) {
    throw new Error(
      `html-crush: [THROW_ID_04] the third input argument, options object, should be a plain object but it was given as type ${typeof originalOpts}, equal to ${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }
  const opts = Object.assign({}, defaults, originalOpts);
  let currentPercentageDone;
  let lastPercentage = 0;
  const len = str.length;
  const midLen = Math.floor(len / 2);
  let token = {};
  const tokenDefault = {
    type: null,
    start: null,
    end: null
  };
  function tokenReset() {
    token = Object.assign({}, tokenDefault);
  }
  tokenReset();
  const layers = [];
  function pingcb(incomingToken) {
    cb(incomingToken);
    tokenReset();
  }
  for (let i = 0; i < len; i++) {
    if (opts.reportProgressFunc) {
      if (len > 1000 && len < 2000) {
        if (i === midLen) {
          opts.reportProgressFunc(
            Math.floor(
              (opts.reportProgressFuncTo - opts.reportProgressFuncFrom) / 2
            )
          );
        }
      } else if (len >= 2000) {
        currentPercentageDone =
          opts.reportProgressFuncFrom + Math.floor(i / len);
        if (currentPercentageDone !== lastPercentage) {
          lastPercentage = currentPercentageDone;
          opts.reportProgressFunc(currentPercentageDone);
        }
      }
    }
    if (token.type === "html" && str[i] === `"`) {
      if (layers.length && layers[layers.length - 1] === `"`) {
        layers.pop();
      } else {
        layers.push(`"`);
      }
    }
    if (str[i] === "<") {
      if (token.start !== null) {
        token.end = i;
        pingcb(token);
      }
      token.start = i;
      token.type = "html";
    } else if (token.start === null || token.end === i) {
      if (token.end) {
        pingcb(token);
      }
      token.start = i;
      token.type = "text";
    }
    if (token.type === "html" && !layers.length && str[i] === ">") {
      token.end = i + 1;
    }
    if (!str[i + 1] && token.start !== null) {
      token.end = i + 1;
      pingcb(token);
    }
  }
}

export default tokenizer;
