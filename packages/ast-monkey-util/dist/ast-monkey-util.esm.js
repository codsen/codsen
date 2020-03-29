/**
 * ast-monkey-util
 * Utility library of AST helper functions
 * Version: 1.1.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey-util
 */

function pathNext(str) {
  if (typeof str !== "string" || !str.length) {
    return str;
  }
  if (str.includes(".") && /^\d*$/.test(str.slice(str.lastIndexOf(".") + 1))) {
    return `${str.slice(0, str.lastIndexOf(".") + 1)}${
      +str.slice(str.lastIndexOf(".") + 1) + 1
    }`;
  } else if (/^\d*$/.test(str)) {
    return `${+str + 1}`;
  }
  return str;
}

function pathPrev(str) {
  if (typeof str !== "string" || !str.length) {
    return null;
  }
  const extractedValue = str.slice(str.lastIndexOf(".") + 1);
  if (extractedValue === "0") {
    return null;
  } else if (str.includes(".") && /^\d*$/.test(extractedValue)) {
    return `${str.slice(0, str.lastIndexOf(".") + 1)}${
      +str.slice(str.lastIndexOf(".") + 1) - 1
    }`;
  } else if (/^\d*$/.test(str)) {
    return `${+str - 1}`;
  }
  return null;
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

export { pathNext, pathPrev, pathUp };
