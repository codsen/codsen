/**
 * ast-get-object
 * Getter/setter for nested parsed HTML AST's, querying objects by key/value pairs
 * Version: 1.9.16
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-get-object/
 */

'use strict';

var compare = require('ast-compare');
var clone = require('lodash.clonedeep');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var compare__default = /*#__PURE__*/_interopDefaultLegacy(compare);
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

function existy(x) {
  return x != null;
}
function truthy(x) {
  return x !== false && existy(x);
}
function isObj(something) {
  return something && _typeof(something) === "object" && !Array.isArray(something);
}
function getObj(originalAst, keyValPair, replacementContentsArr) {
  var result = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : [];
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
  if (isObj(ast)) {
    if (compare__default['default'](ast, keyValPair)) {
      if (set) {
        if (replacementContentsArr.length > 0) {
          ast = replacementContentsArr[0];
          replacementContentsArr.shift();
        }
      } else {
        result.push(ast);
      }
    } else {
      Object.keys(ast).forEach(function (key) {
        if (Array.isArray(ast[key]) || isObj(ast[key])) {
          if (set) {
            ast[key] = getObj(ast[key], keyValPair, replacementContentsArr, result);
          } else {
            getObj(ast[key], keyValPair, replacementContentsArr, result);
          }
        }
      });
    }
  } else if (Array.isArray(ast)) {
    ast.forEach(function (el, i) {
      if (isObj(ast[i]) || Array.isArray(ast[i])) {
        if (set) {
          ast[i] = getObj(ast[i], keyValPair, replacementContentsArr, result);
        } else {
          getObj(ast[i], keyValPair, replacementContentsArr, result);
        }
      }
    });
  }
  if (truthy(replacementContentsArr)) {
    return ast;
  }
  return result;
}
function externalApi(originalAst, keyValPair, replacementContentsArr) {
  return getObj(originalAst, keyValPair, replacementContentsArr);
}

module.exports = externalApi;
