/**
 * ast-get-object
 * Getter/setter for nested parsed HTML AST's, querying objects by key/value pairs
 * Version: 2.0.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-get-object/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var clone = require('lodash.clonedeep');
var isObj = require('lodash.isplainobject');
var astCompare = require('ast-compare');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var clone__default = /*#__PURE__*/_interopDefaultLegacy(clone);
var isObj__default = /*#__PURE__*/_interopDefaultLegacy(isObj);

var version$1 = "2.0.12";

var version = version$1;
function existy(x) {
  return x != null;
}
function truthy(x) {
  return x !== false && existy(x);
}
function internalApi(originalAst, keyValPair, replacementContentsArr, result) {
  if (result === void 0) {
    result = [];
  }
  if (!existy(originalAst)) {
    throw new Error("ast-get-object: [THROW_ID_01] First argument is missing!");
  }
  if (!existy(keyValPair)) {
    throw new Error("ast-get-object: [THROW_ID_02] Second argument is missing!");
  }
  var set = false;
  if (existy(replacementContentsArr) && Array.isArray(replacementContentsArr)) {
    set = true;
  }
  var ast = clone__default['default'](originalAst);
  /* istanbul ignore else */
  if (isObj__default['default'](ast)) {
    if (astCompare.compare(ast, keyValPair)) {
      if (set) {
        /* istanbul ignore else */
        if (replacementContentsArr.length > 0) {
          ast = replacementContentsArr[0];
          replacementContentsArr.shift();
        }
      } else {
        result.push(ast);
      }
    } else {
      Object.keys(ast).forEach(function (key) {
        if (Array.isArray(ast[key]) || isObj__default['default'](ast[key])) {
          if (set) {
            ast[key] = internalApi(ast[key], keyValPair, replacementContentsArr, result);
          } else {
            internalApi(ast[key], keyValPair, replacementContentsArr, result);
          }
        }
      });
    }
  } else if (Array.isArray(ast)) {
    ast.forEach(function (_el, i) {
      /* istanbul ignore else */
      if (isObj__default['default'](ast[i]) || Array.isArray(ast[i])) {
        if (set) {
          ast[i] = internalApi(ast[i], keyValPair, replacementContentsArr, result);
        } else {
          internalApi(ast[i], keyValPair, replacementContentsArr, result);
        }
      }
    });
  }
  if (truthy(replacementContentsArr)) {
    return ast;
  }
  return result;
}
function getObj(originalAst, keyValPair, replacementContentsArr) {
  return internalApi(originalAst, keyValPair, replacementContentsArr);
}

exports.getObj = getObj;
exports.version = version;
