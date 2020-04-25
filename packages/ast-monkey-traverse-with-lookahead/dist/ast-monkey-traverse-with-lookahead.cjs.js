/**
 * ast-monkey-traverse-with-lookahead
 * Utility library to traverse parsed HTML (AST's) or anything nested (plain objects within arrays within plain objects)
 * Version: 1.1.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-monkey-traverse-with-lookahead
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var clone = _interopDefault(require('lodash.clonedeep'));

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

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
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

function trimFirstDot(str) {
  if (typeof str === "string" && str[0] === ".") {
    return str.slice(1);
  }
  return str;
}
function isObj(something) {
  return something && _typeof(something) === "object" && !Array.isArray(something);
}
function astMonkeyTraverseWithLookahead(tree1, cb1) {
  var lookahead = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var stop1 = {
    now: false
  };
  var stash = [];
  function traverseInner(tree, callback, innerObj, stop) {
    innerObj = _objectSpread2({
      depth: -1,
      path: ""
    }, innerObj);
    innerObj.depth += 1;
    if (Array.isArray(tree)) {
      for (var i = 0, len = tree.length; i < len; i++) {
        if (stop.now) {
          break;
        }
        var path = "".concat(innerObj.path, ".").concat(i);
        innerObj.parent = clone(tree);
        innerObj.parentType = "array";
        callback(tree[i], undefined, _objectSpread2({}, innerObj, {
          path: trimFirstDot(path)
        }), stop);
        traverseInner(tree[i], callback, _objectSpread2({}, innerObj, {
          path: trimFirstDot(path)
        }), stop);
      }
    } else if (isObj(tree)) {
      for (var key in tree) {
        if (stop.now && key != null) {
          break;
        }
        var _path = "".concat(innerObj.path, ".").concat(key);
        if (innerObj.depth === 0 && key != null) {
          innerObj.topmostKey = key;
        }
        innerObj.parent = clone(tree);
        innerObj.parentType = "object";
        callback(key, tree[key], _objectSpread2({}, innerObj, {
          path: trimFirstDot(_path)
        }), stop);
        traverseInner(tree[key], callback, _objectSpread2({}, innerObj, {
          path: trimFirstDot(_path)
        }), stop);
      }
    }
    return tree;
  }
  function reportFirstFromStash() {
    var currentElem = stash.shift();
    currentElem[2].next = [];
    for (var i = 0; i < lookahead; i++) {
      if (stash[i]) {
        currentElem[2].next.push(clone([stash[i][0], stash[i][1], stash[i][2]]));
      } else {
        break;
      }
    }
    cb1.apply(void 0, _toConsumableArray(currentElem));
  }
  function intermediary() {
    for (var _len = arguments.length, incoming = new Array(_len), _key = 0; _key < _len; _key++) {
      incoming[_key] = arguments[_key];
    }
    stash.push([].concat(incoming));
    if (stash.length > lookahead) {
      reportFirstFromStash();
    }
  }
  traverseInner(tree1, intermediary, {}, stop1);
  if (stash.length) {
    for (var i = 0, len = stash.length; i < len; i++) {
      reportFirstFromStash();
    }
  }
}

module.exports = astMonkeyTraverseWithLookahead;
