/**
 * ast-monkey
 * Utility library for ops on parsed HTML (AST's) or anything nested (plain objects within arrays within plain objects)
 * Version: 7.10.56
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var clone = _interopDefault(require('lodash.clonedeep'));
var arrayObjectOrBoth = _interopDefault(require('util-array-object-or-both'));
var checkTypes = _interopDefault(require('check-types-mini'));
var types = _interopDefault(require('type-detect'));
var astCompare = _interopDefault(require('ast-compare'));
var traverse = _interopDefault(require('ast-monkey-traverse'));

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

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
  return astCompare(a, b, {
    matchStrictly: true,
    useWildcards: true
  });
}
function isObj(something) {
  return _typeof(something) === "object" && something !== null;
}
function monkey(inputOriginal, opts) {
  if (!existy(inputOriginal)) {
    throw new Error("ast-monkey/main.js/monkey(): [THROW_ID_01] Please provide an input");
  }
  var input = clone(inputOriginal);
  opts = Object.assign({
    key: null,
    val: undefined
  }, opts);
  if ( opts.mode === "info") ;
  var data = {
    count: 0,
    gatherPath: [],
    finding: null
  };
  var findings = [];
  var ko = false;
  var vo = false;
  if (existy(opts.key) && !notUndef(opts.val)) {
    ko = true;
  }
  if (!existy(opts.key) && notUndef(opts.val)) {
    vo = true;
  }
  if ( opts.mode === "info") ;
  if ( opts.mode === "info") ;
  if (opts.mode === "arrayFirstOnly" && Array.isArray(input) && input.length > 0) {
    input = [input[0]];
  }
  input = traverse(input, function (key, val, innerObj) {
    var temp;
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
      (opts.only === "any" || opts.only === "array" && val === undefined || opts.only === "object" && val !== undefined) && (
      ko && compareIsEqual(key, opts.key) || vo && compareIsEqual(val, opts.val) || !ko && !vo && compareIsEqual(key, opts.key) && compareIsEqual(val, opts.val))) {
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
  if (!existy(input)) {
    throw new Error("ast-monkey/main.js/find(): [THROW_ID_02] Please provide the input");
  }
  if (!isObj(opts) || opts.key === undefined && opts.val === undefined) {
    throw new Error("ast-monkey/main.js/find(): [THROW_ID_03] Please provide opts.key or opts.val");
  }
  checkTypes(opts, null, {
    schema: {
      key: ["null", "string"],
      val: "any",
      only: ["undefined", "null", "string"]
    },
    msg: "ast-monkey/get(): [THROW_ID_04*]"
  });
  if (typeof opts.only === "string" && opts.only.length > 0) {
    opts.only = arrayObjectOrBoth(opts.only, {
      optsVarName: "opts.only",
      msg: "ast-monkey/find(): [THROW_ID_05*]"
    });
  } else {
    opts.only = "any";
  }
  return monkey(input, Object.assign({}, opts, {
    mode: "find"
  }));
}
function get(input, opts) {
  if (!existy(input)) {
    throw new Error("ast-monkey/main.js/get(): [THROW_ID_06] Please provide the input");
  }
  if (!isObj(opts)) {
    throw new Error("ast-monkey/main.js/get(): [THROW_ID_07] Please provide the opts");
  }
  if (!existy(opts.index)) {
    throw new Error("ast-monkey/main.js/get(): [THROW_ID_08] Please provide opts.index");
  }
  if (typeof opts.index === "string") {
    if (Number.isInteger(parseFloat(opts.index, 10), {
      includeZero: true
    })) {
      opts.index = parseInt(opts.index, 10);
    } else {
      throw new Error("ast-monkey/main.js/get(): [THROW_ID_09] opts.index must be a natural number. It was given as: ".concat(opts.index));
    }
  }
  checkTypes(opts, null, {
    schema: {
      index: "number"
    },
    msg: "ast-monkey/get(): [THROW_ID_10*]"
  });
  if (!Number.isInteger(opts.index, {
    includeZero: true
  })) {
    throw new Error("ast-monkey/main.js/get(): [THROW_ID_11] opts.index must be a natural number. It was given as: ".concat(opts.index));
  }
  return monkey(input, Object.assign({}, opts, {
    mode: "get"
  }));
}
function set(input, opts) {
  if (!existy(input)) {
    throw new Error("ast-monkey/main.js/set(): [THROW_ID_12] Please provide the input");
  }
  if (!isObj(opts)) {
    throw new Error("ast-monkey/main.js/set(): [THROW_ID_13] Please provide the input");
  }
  if (!existy(opts.key) && !notUndef(opts.val)) {
    throw new Error("ast-monkey/main.js/set(): [THROW_ID_14] Please provide opts.val");
  }
  if (!existy(opts.index)) {
    throw new Error("ast-monkey/main.js/set(): [THROW_ID_15] Please provide opts.index");
  }
  if (typeof opts.index === "string") {
    if (Number.isInteger(parseFloat(opts.index, 10), {
      includeZero: true
    })) {
      opts.index = parseInt(opts.index, 10);
    } else {
      throw new Error("ast-monkey/main.js/set(): [THROW_ID_16] opts.index must be a natural number. It was given as: ".concat(opts.index));
    }
  } else if (!Number.isInteger(opts.index, {
    includeZero: true
  })) {
    throw new Error("ast-monkey/main.js/set(): [THROW_ID_17] opts.index must be a natural number. It was given as: ".concat(opts.index));
  }
  if (existy(opts.key) && !notUndef(opts.val)) {
    opts.val = opts.key;
  }
  checkTypes(opts, null, {
    schema: {
      key: [null, "string"],
      val: "any",
      index: "number"
    },
    msg: "ast-monkey/set(): [THROW_ID_18*]"
  });
  return monkey(input, Object.assign({}, opts, {
    mode: "set"
  }));
}
function drop(input, opts) {
  if (!existy(input)) {
    throw new Error("ast-monkey/main.js/drop(): [THROW_ID_19] Please provide the input");
  }
  if (!isObj(opts)) {
    throw new Error("ast-monkey/main.js/drop(): [THROW_ID_20] Please provide the input");
  }
  if (!existy(opts.index)) {
    throw new Error("ast-monkey/main.js/drop(): [THROW_ID_21] Please provide opts.index");
  }
  if (typeof opts.index === "string") {
    if (Number.isInteger(parseFloat(opts.index, 10), {
      includeZero: true
    })) {
      opts.index = parseInt(opts.index, 10);
    } else {
      throw new Error("ast-monkey/main.js/drop(): [THROW_ID_22] opts.index must be a natural number. It was given as: ".concat(opts.index));
    }
  }
  if (!Number.isInteger(opts.index, {
    includeZero: true
  })) {
    throw new Error("ast-monkey/main.js/drop(): [THROW_ID_23] opts.index must be a natural number. It was given as: ".concat(opts.index));
  }
  checkTypes(opts, null, {
    schema: {
      index: "number"
    },
    msg: "ast-monkey/drop(): [THROW_ID_24*]"
  });
  return monkey(input, Object.assign({}, opts, {
    mode: "drop"
  }));
}
function info(input) {
  if (!existy(input)) {
    throw new Error("ast-monkey/main.js/info(): [THROW_ID_25] Please provide the input");
  }
  return monkey(input, {
    mode: "info"
  });
}
function del(input, opts) {
  if (!existy(input)) {
    throw new Error("ast-monkey/main.js/del(): [THROW_ID_26] Please provide the input");
  }
  if (!isObj(opts)) {
    throw new Error("ast-monkey/main.js/del(): [THROW_ID_27] Please provide the opts object");
  }
  if (!existy(opts.key) && !notUndef(opts.val)) {
    throw new Error("ast-monkey/main.js/del(): [THROW_ID_28] Please provide opts.key or opts.val");
  }
  checkTypes(opts, null, {
    schema: {
      key: [null, "string"],
      val: "any",
      only: ["undefined", "null", "string"]
    },
    msg: "ast-monkey/drop(): [THROW_ID_29*]"
  });
  if (typeof opts.only === "string" && opts.only.length > 0) {
    opts.only = arrayObjectOrBoth(opts.only, {
      msg: "ast-monkey/del(): [THROW_ID_30*]",
      optsVarName: "opts.only"
    });
  } else {
    opts.only = "any";
  }
  return monkey(input, Object.assign({}, opts, {
    mode: "del"
  }));
}
function arrayFirstOnly(input) {
  if (!existy(input)) {
    throw new Error("ast-monkey/main.js/arrayFirstOnly(): [THROW_ID_31] Please provide the input");
  }
  return monkey(input, {
    mode: "arrayFirstOnly"
  });
}

exports.traverse = traverse;
exports.arrayFirstOnly = arrayFirstOnly;
exports.del = del;
exports.drop = drop;
exports.find = find;
exports.get = get;
exports.info = info;
exports.set = set;
