/**
 * ast-monkey-traverse-with-lookahead
 * Utility library to traverse AST, reports upcoming values
 * Version: 2.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-monkey-traverse-with-lookahead/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var clone = require('lodash.clonedeep');
var isObj = require('lodash.isplainobject');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);
var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);

var version$1 = "2.0.11";

var version = version$1;
function traverse(tree1, cb1, lookahead) {
  if (lookahead === void 0) {
    lookahead = 0;
  }
  function trimFirstDot(str) {
    if (typeof str === "string" && str[0] === ".") {
      return str.slice(1);
    }
    return str;
  }
  var stop1 = {
    now: false
  };
  var stash = [];
  function traverseInner(tree, callback, innerObj, stop) {
    innerObj = _objectSpread__default['default']({}, innerObj);
    innerObj.depth += 1;
    if (Array.isArray(tree)) {
      for (var i = 0, len = tree.length; i < len; i++) {
        if (stop.now) {
          break;
        }
        var path = innerObj.path + "." + i;
        innerObj.parent = clone__default['default'](tree);
        innerObj.parentType = "array";
        callback(tree[i], undefined, _objectSpread__default['default'](_objectSpread__default['default']({}, innerObj), {}, {
          path: trimFirstDot(path)
        }), stop);
        traverseInner(tree[i], callback, _objectSpread__default['default'](_objectSpread__default['default']({}, innerObj), {}, {
          path: trimFirstDot(path)
        }), stop);
      }
    } else if (isObj__default['default'](tree)) {
      for (var key in tree) {
        if (stop.now && key != null) {
          break;
        }
        var _path = innerObj.path + "." + key;
        if (innerObj.depth === 0 && key != null) {
          innerObj.topmostKey = key;
        }
        innerObj.parent = clone__default['default'](tree);
        innerObj.parentType = "object";
        callback(key, tree[key], _objectSpread__default['default'](_objectSpread__default['default']({}, innerObj), {}, {
          path: trimFirstDot(_path)
        }), stop);
        traverseInner(tree[key], callback, _objectSpread__default['default'](_objectSpread__default['default']({}, innerObj), {}, {
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
        currentElem[2].next.push(clone__default['default']([stash[i][0], stash[i][1], stash[i][2]]));
      } else {
        break;
      }
    }
    cb1.apply(void 0, currentElem);
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
  traverseInner(tree1, intermediary, {
    depth: -1,
    path: ""
  }, stop1);
  if (stash.length) {
    for (var i = 0, len = stash.length; i < len; i++) {
      reportFirstFromStash();
    }
  }
}

exports.traverse = traverse;
exports.version = version;
