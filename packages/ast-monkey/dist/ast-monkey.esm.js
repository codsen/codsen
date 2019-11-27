/**
 * ast-monkey
 * Utility library for ops on parsed HTML (AST's) or anything nested (plain objects within arrays within plain objects)
 * Version: 7.10.53
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey
 */

import clone from 'lodash.clonedeep';
import arrayObjectOrBoth from 'util-array-object-or-both';
import checkTypes from 'check-types-mini';
import types from 'type-detect';
import isNaturalNumber from 'is-natural-number';
import astCompare from 'ast-compare';
import traverse from 'ast-monkey-traverse';
export { default as traverse } from 'ast-monkey-traverse';

function existy(x) {
  return x != null;
}
function notUndef(x) {
  return x !== undefined;
}
function compareIsEqual(a, b) {
  if (types(a) !== types(b)) {
    return false;
  }
  return astCompare(a, b, { matchStrictly: true, useWildcards: true });
}
function monkey(inputOriginal, opts) {
  if (!existy(inputOriginal)) {
    throw new Error("ast-monkey/main.js/monkey(): Please provide an input");
  }
  let input = clone(inputOriginal);
  opts = Object.assign(
    {
      key: null,
      val: undefined
    },
    opts
  );
  if ( opts.mode === "info") ;
  const data = { count: 0, gatherPath: [], finding: null };
  const findings = [];
  let ko = false;
  let vo = false;
  if (existy(opts.key) && !notUndef(opts.val)) {
    ko = true;
  }
  if (!existy(opts.key) && notUndef(opts.val)) {
    vo = true;
  }
  if ( opts.mode === "info") ;
  if ( opts.mode === "info") ;
  if (
    opts.mode === "arrayFirstOnly" &&
    Array.isArray(input) &&
    input.length > 0
  ) {
    input = [input[0]];
  }
  input = traverse(input, (key, val, innerObj) => {
    let temp;
    data.count += 1;
    if ( opts.mode === "info") ;
    if ( opts.mode === "info") ;
    if ( opts.mode === "info") ;
    data.gatherPath.length = innerObj.depth;
    data.gatherPath.push(data.count);
    if ( opts.mode === "info") ;
    if (opts.mode === "get") {
      if (data.count === opts.index) {
        if (notUndef(val)) {
          data.finding = {};
          data.finding[key] = val;
        } else {
          data.finding = key;
        }
      }
    } else if (opts.mode === "find" || opts.mode === "del") {
      if (
        (opts.only === "any" ||
          (opts.only === "array" && val === undefined) ||
          (opts.only === "object" && val !== undefined)) &&
        ((ko && compareIsEqual(key, opts.key)) ||
          (vo && compareIsEqual(val, opts.val)) ||
          (!ko &&
            !vo &&
            compareIsEqual(key, opts.key) &&
            compareIsEqual(val, opts.val)))
      ) {
        if (opts.mode === "find") {
          temp = {};
          temp.index = data.count;
          temp.key = key;
          temp.val = val;
          temp.path = clone(data.gatherPath);
          findings.push(temp);
        } else {
          return NaN;
        }
      } else {
        return val !== undefined ? val : key;
      }
    }
    if ( opts.mode === "info") ;
    if (opts.mode === "set" && data.count === opts.index) {
      return opts.val;
    } else if (opts.mode === "drop" && data.count === opts.index) {
      return NaN;
    } else if (opts.mode === "arrayFirstOnly") {
      if (notUndef(val) && Array.isArray(val)) {
        return [val[0]];
      } else if (existy(key) && Array.isArray(key)) {
        return [key[0]];
      }
      return val !== undefined ? val : key;
    }
    return val !== undefined ? val : key;
  });
  if (opts.mode === "get") {
    return data.finding;
  } else if (opts.mode === "find") {
    return findings.length > 0 ? findings : null;
  }
  return input;
}
function find(input, opts) {
  if (!notUndef(opts.key) && !notUndef(opts.val)) {
    throw new Error(
      "ast-monkey/main.js/find(): Please provide opts.key or opts.val"
    );
  }
  checkTypes(opts, null, {
    schema: {
      key: ["null", "string"],
      val: "any",
      only: ["undefined", "null", "string"]
    }
  });
  if (typeof opts.only === "string" && opts.only.length > 0) {
    opts.only = arrayObjectOrBoth(opts.only, {
      msg: "ast-monkey/find():",
      optsVarName: "opts.only"
    });
  } else {
    opts.only = "any";
  }
  return monkey(input, Object.assign({}, opts, { mode: "find" }));
}
function get(input, opts) {
  if (!existy(opts.index)) {
    throw new Error("ast-monkey/main.js/get(): Please provide opts.index");
  }
  if (typeof opts.index === "string") {
    if (isNaturalNumber(parseFloat(opts.index, 10), { includeZero: true })) {
      opts.index = parseInt(opts.index, 10);
    } else {
      throw new Error(
        `ast-monkey/main.js/get(): opts.index must be a natural number. It was given as: ${opts.index}`
      );
    }
  }
  checkTypes(opts, null, {
    schema: {
      index: "number"
    }
  });
  if (!isNaturalNumber(opts.index, { includeZero: true })) {
    throw new Error(
      `ast-monkey/main.js/get(): opts.index must be a natural number. It was given as: ${opts.index}`
    );
  }
  return monkey(input, Object.assign({}, opts, { mode: "get" }));
}
function set(input, opts) {
  if (!existy(opts.key) && !notUndef(opts.val)) {
    throw new Error("ast-monkey/main.js/set(): Please provide opts.val");
  }
  if (!existy(opts.index)) {
    throw new Error("ast-monkey/main.js/set(): Please provide opts.index");
  }
  if (typeof opts.index === "string") {
    if (isNaturalNumber(parseFloat(opts.index, 10), { includeZero: true })) {
      opts.index = parseInt(opts.index, 10);
    } else {
      throw new Error(
        `ast-monkey/main.js/set(): opts.index must be a natural number. It was given as: ${opts.index}`
      );
    }
  } else if (!isNaturalNumber(opts.index, { includeZero: true })) {
    throw new Error(
      `ast-monkey/main.js/get(): opts.index must be a natural number. It was given as: ${opts.index}`
    );
  }
  if (existy(opts.key) && !notUndef(opts.val)) {
    opts.val = opts.key;
  }
  checkTypes(opts, null, {
    schema: {
      key: [null, "string"],
      val: "any",
      index: "number"
    }
  });
  return monkey(input, Object.assign({}, opts, { mode: "set" }));
}
function drop(input, opts) {
  if (!existy(opts.index)) {
    throw new Error("ast-monkey/main.js/drop(): Please provide opts.index");
  }
  if (typeof opts.index === "string") {
    if (isNaturalNumber(parseFloat(opts.index, 10), { includeZero: true })) {
      opts.index = parseInt(opts.index, 10);
    } else {
      throw new Error(
        `ast-monkey/main.js/drop(): opts.index must be a natural number. It was given as: ${opts.index}`
      );
    }
  }
  if (!isNaturalNumber(opts.index, { includeZero: true })) {
    throw new Error(
      `ast-monkey/main.js/get(): opts.index must be a natural number. It was given as: ${opts.index}`
    );
  }
  checkTypes(opts, null, {
    schema: {
      index: "number"
    }
  });
  return monkey(input, Object.assign({}, opts, { mode: "drop" }));
}
function info(input) {
  return monkey(input, { mode: "info" });
}
function del(input, opts) {
  if (!existy(opts.key) && !notUndef(opts.val)) {
    throw new Error(
      "ast-monkey/main.js/del(): Please provide opts.key or opts.val"
    );
  }
  checkTypes(opts, null, {
    schema: {
      key: [null, "string"],
      val: "any",
      only: ["undefined", "null", "string"]
    }
  });
  if (typeof opts.only === "string" && opts.only.length > 0) {
    opts.only = arrayObjectOrBoth(opts.only, {
      msg: "ast-monkey/del():",
      optsVarName: "opts.only"
    });
  } else {
    opts.only = "any";
  }
  return monkey(input, Object.assign({}, opts, { mode: "del" }));
}
function arrayFirstOnly(input) {
  return monkey(input, { mode: "arrayFirstOnly" });
}

export { arrayFirstOnly, del, drop, find, get, info, set };
