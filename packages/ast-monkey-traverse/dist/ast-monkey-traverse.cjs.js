/**
 * ast-monkey-traverse
 * Utility library to traverse AST
 * Version: 2.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-monkey-traverse/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var clone = require('lodash.clonedeep');
var isObj = require('lodash.isplainobject');
var astMonkeyUtil = require('ast-monkey-util');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _objectSpread__default = /*#__PURE__*/_interopDefaultLegacy(_objectSpread);
var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);
var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);

var version$1 = "2.0.11";

var version = version$1;
function traverse(tree1, cb1) {
  var stop2 = {
    now: false
  };
  function traverseInner(treeOriginal, callback, originalInnerObj, stop) {
    var tree = clone__default['default'](treeOriginal);
    var res;
    var innerObj = _objectSpread__default['default']({
      depth: -1,
      path: ""
    }, originalInnerObj);
    innerObj.depth += 1;
    if (Array.isArray(tree)) {
      for (var i = 0, len = tree.length; i < len; i++) {
        if (stop.now) {
          break;
        }
        var path = innerObj.path ? innerObj.path + "." + i : "" + i;
        if (tree[i] !== undefined) {
          innerObj.parent = clone__default['default'](tree);
          innerObj.parentType = "array";
          innerObj.parentKey = astMonkeyUtil.parent(path);
          res = traverseInner(callback(tree[i], undefined, _objectSpread__default['default'](_objectSpread__default['default']({}, innerObj), {}, {
            path: path
          }), stop), callback, _objectSpread__default['default'](_objectSpread__default['default']({}, innerObj), {}, {
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
    } else if (isObj__default['default'](tree)) {
      for (var key in tree) {
        if (stop.now && key != null) {
          break;
        }
        var _path = innerObj.path ? innerObj.path + "." + key : key;
        if (innerObj.depth === 0 && key != null) {
          innerObj.topmostKey = key;
        }
        innerObj.parent = clone__default['default'](tree);
        innerObj.parentType = "object";
        innerObj.parentKey = astMonkeyUtil.parent(_path);
        res = traverseInner(callback(key, tree[key], _objectSpread__default['default'](_objectSpread__default['default']({}, innerObj), {}, {
          path: _path
        }), stop), callback, _objectSpread__default['default'](_objectSpread__default['default']({}, innerObj), {}, {
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

exports.traverse = traverse;
exports.version = version;
