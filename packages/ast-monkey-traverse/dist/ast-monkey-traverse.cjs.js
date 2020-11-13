/**
 * ast-monkey-traverse
 * Utility library to traverse AST
 * Version: 1.12.21
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-monkey-traverse/
 */

'use strict';

var clone = require('lodash.clonedeep');
var astMonkeyUtil = require('ast-monkey-util');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);

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

function isObj(something) {
  return something && _typeof(something) === "object" && !Array.isArray(something);
}
function astMonkeyTraverse(tree1, cb1) {
  var stop2 = {
    now: false
  };
  function traverseInner(treeOriginal, callback, originalInnerObj, stop) {
    var tree = clone__default['default'](treeOriginal);
    var i;
    var len;
    var res;
    var innerObj = _objectSpread2({
      depth: -1,
      path: ""
    }, originalInnerObj);
    innerObj.depth += 1;
    if (Array.isArray(tree)) {
      for (i = 0, len = tree.length; i < len; i++) {
        if (stop.now) {
          break;
        }
        var path = innerObj.path ? "".concat(innerObj.path, ".").concat(i) : "".concat(i);
        if (tree[i] !== undefined) {
          innerObj.parent = clone__default['default'](tree);
          innerObj.parentType = "array";
          innerObj.parentKey = astMonkeyUtil.parent(path);
          res = traverseInner(callback(tree[i], undefined, _objectSpread2(_objectSpread2({}, innerObj), {}, {
            path: path
          }), stop), callback, _objectSpread2(_objectSpread2({}, innerObj), {}, {
            path: path
          }), stop);
          if (Number.isNaN(res) && i < tree.length) {
            tree.splice(i, 1);
            i -= 1;
          } else {
            tree[i] = res;
          }
        } else {
          tree.splice(i, 1);
        }
      }
    } else if (isObj(tree)) {
      for (var key in tree) {
        if (stop.now && key != null) {
          break;
        }
        var _path = innerObj.path ? "".concat(innerObj.path, ".").concat(key) : key;
        if (innerObj.depth === 0 && key != null) {
          innerObj.topmostKey = key;
        }
        innerObj.parent = clone__default['default'](tree);
        innerObj.parentType = "object";
        innerObj.parentKey = astMonkeyUtil.parent(_path);
        res = traverseInner(callback(key, tree[key], _objectSpread2(_objectSpread2({}, innerObj), {}, {
          path: _path
        }), stop), callback, _objectSpread2(_objectSpread2({}, innerObj), {}, {
          path: _path
        }), stop);
        if (Number.isNaN(res)) {
          delete tree[key];
        } else {
          tree[key] = res;
        }
      }
    }
    return tree;
  }
  return traverseInner(tree1, cb1, {}, stop2);
}

module.exports = astMonkeyTraverse;
