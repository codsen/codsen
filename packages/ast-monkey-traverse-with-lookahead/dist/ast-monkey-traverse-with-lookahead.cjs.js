/**
 * ast-monkey-traverse-with-lookahead
 * Utility library to traverse parsed HTML (AST's) or anything nested (plain objects within arrays within plain objects)
 * Version: 1.0.0
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

function trimFirstDot(str) {
  if (typeof str === "string" && str.length && str[0] === ".") {
    return str.slice(1);
  }
  return str;
}
function isObj(something) {
  return something && _typeof(something) === "object" && !Array.isArray(something);
}
function astMonkeyTraverse(tree1, cb1) {
  var stop = {
    now: false
  };
  function traverseInner(tree, callback, innerObj, stop) {
    var i;
    var len;
    innerObj = Object.assign({
      depth: -1,
      path: ""
    }, innerObj);
    innerObj.depth += 1;
    if (Array.isArray(tree)) {
      for (i = 0, len = tree.length; i < len; i++) {
        if (stop.now) {
          break;
        }
        var path = "".concat(innerObj.path, ".").concat(i);
        innerObj.parent = clone(tree);
        innerObj.parentType = "array";
        callback(tree[i], undefined, Object.assign({}, innerObj, {
          path: trimFirstDot(path)
        }), stop);
        traverseInner(tree[i], callback, Object.assign({}, innerObj, {
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
        callback(key, tree[key], Object.assign({}, innerObj, {
          path: trimFirstDot(_path)
        }), stop);
        traverseInner(tree[key], callback, Object.assign({}, innerObj, {
          path: trimFirstDot(_path)
        }), stop);
      }
    }
    return tree;
  }
  return traverseInner(tree1, cb1, {}, stop);
}

module.exports = astMonkeyTraverse;
