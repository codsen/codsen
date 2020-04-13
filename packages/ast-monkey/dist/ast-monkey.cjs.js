/**
 * ast-monkey
 * Traverse and edit AST's (like parsed HTML or anything nested)
 * Version: 7.11.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var arrayObjectOrBoth = _interopDefault(require('util-array-object-or-both'));
var checkTypes = _interopDefault(require('check-types-mini'));
var astCompare = _interopDefault(require('ast-compare'));
var traverse = _interopDefault(require('ast-monkey-traverse'));

function _typeof(obj) {
  "@babel/helpers - typeof";

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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function existy(x) {
  return x != null;
}
function notUndef(x) {
  return x !== undefined;
}
function compareIsEqual(a, b) {
  if (_typeof(a) !== _typeof(b)) {
    return false;
  }
  return astCompare(a, b, {
    matchStrictly: true,
    useWildcards: true
  });
}
function isObj(something) {
  return something && _typeof(something) === "object" && !Array.isArray(something);
}
function monkey(input, opts) {
  if (!existy(input)) {
    throw new Error("ast-monkey/main.js/monkey(): [THROW_ID_01] Please provide an input");
  }
  opts = Object.assign({
    key: null,
    val: undefined
  }, opts);
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
  if (opts.mode === "arrayFirstOnly" && Array.isArray(input) && input.length > 0) {
    input = [input[0]];
  }
  input = traverse(input, function (key, val, innerObj) {
    var temp;
    data.count += 1;
    data.gatherPath.length = innerObj.depth;
    data.gatherPath.push(data.count);
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
          temp.path = _toConsumableArray(data.gatherPath);
          findings.push(temp);
        } else {
          return NaN;
        }
      } else {
        return val !== undefined ? val : key;
      }
    }
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
  if (typeof opts.index === "string" && /^\d*$/.test(opts.index)) {
    opts.index = parseInt(opts.index, 10);
  } else if (!Number.isInteger(opts.index)) {
    throw new Error("ast-monkey/main.js/get(): [THROW_ID_11] opts.index must be a natural number. It was given as: ".concat(opts.index, " (type ").concat(_typeof(opts.index), ")"));
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
  if (typeof opts.index === "string" && /^\d*$/.test(opts.index)) {
    opts.index = parseInt(opts.index, 10);
  } else if (!Number.isInteger(opts.index)) {
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
  if (typeof opts.index === "string" && /^\d*$/.test(opts.index)) {
    opts.index = parseInt(opts.index, 10);
  } else if (!Number.isInteger(opts.index)) {
    throw new Error("ast-monkey/main.js/drop(): [THROW_ID_23] opts.index must be a natural number. It was given as: ".concat(opts.index));
  }
  return monkey(input, Object.assign({}, opts, {
    mode: "drop"
  }));
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
exports.set = set;
