/**
 * ast-monkey-util
 * Utility library of AST helper functions
 * Version: 1.3.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-monkey-util/
 */

function pathNext(str) {
  if (str.includes(".") && /^\d*$/.test(str.slice(str.lastIndexOf(".") + 1))) {
    return `${str.slice(0, str.lastIndexOf(".") + 1)}${+str.slice(str.lastIndexOf(".") + 1) + 1}`;
  }
  if (/^\d*$/.test(str)) {
    return `${+str + 1}`;
  }
  return str;
}

function pathPrev(str) {
  if (!str) {
    return null;
  }
  const extractedValue = str.slice(str.lastIndexOf(".") + 1);
  if (extractedValue === "0") {
    return null;
  }
  if (str.includes(".") && /^\d*$/.test(extractedValue)) {
    return `${str.slice(0, str.lastIndexOf(".") + 1)}${+str.slice(str.lastIndexOf(".") + 1) - 1}`;
  }
  if (/^\d*$/.test(str)) {
    return `${+str - 1}`;
  }
  return null;
}

function pathUp(str) {
  if (str.includes(".") && str.slice(str.indexOf(".") + 1).includes(".")) {
    let dotsCount = 0;
    for (let i = str.length; i--;) {
      if (str[i] === ".") {
        dotsCount += 1;
      }
      if (dotsCount === 2) {
        return str.slice(0, i);
      }
    }
  }
  return "0";
}

function parent(str) {
  if (str.includes(".")) {
    const lastDotAt = str.lastIndexOf(".");
    if (!str.slice(0, lastDotAt).includes(".")) {
      return str.slice(0, lastDotAt);
    }
    for (let i = lastDotAt - 1; i--;) {
      if (str[i] === ".") {
        return str.slice(i + 1, lastDotAt);
      }
    }
  }
  return null;
}

var version$1 = "1.3.11";

const version = version$1;

export { parent, pathNext, pathPrev, pathUp, version };
