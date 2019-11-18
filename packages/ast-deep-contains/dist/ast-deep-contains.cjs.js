/**
 * ast-deep-contains
 * the t.deepEqual alternative for AVA
 * Version: 1.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-deep-contains
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var typeDetect = _interopDefault(require('type-detect'));
var objectPath = _interopDefault(require('object-path'));
var traverse = _interopDefault(require('ast-monkey-traverse'));

var isArr = Array.isArray;
function isObj(something) {
  return typeDetect(something) === "Object";
}
function deepContains(tree1, tree2, cb, errCb, originalOpts) {
  var defaults = {
    skipContainers: true
  };
  var opts = Object.assign({}, defaults, originalOpts);
  if (typeDetect(tree1) !== typeDetect(tree2)) {
    errCb("1st input arg is of a type ".concat(typeDetect(tree1).toLowerCase(), " but second is ").concat(typeDetect(tree2).toLowerCase()));
  } else {
    traverse(tree2, function (key, val, innerObj) {
      var current = val !== undefined ? val : key;
      var path = innerObj.path;
      if (objectPath.has(tree1, path)) {
        var retrieved = objectPath.get(tree1, path);
        if (!isObj(retrieved) && !isArr(retrieved) || !opts.skipContainers) {
          cb(objectPath.get(tree1, path), current, path);
        }
      } else {
        errCb("first input does not have the path \"".concat(path, "\""));
      }
      return current;
    });
  }
}

module.exports = deepContains;
