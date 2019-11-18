/**
 * ast-get-object
 * Getter/setter for nested parsed HTML AST's, querying objects by key/value pairs
 * Version: 1.8.51
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-get-object
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var compare = _interopDefault(require('ast-compare'));
var isObj = _interopDefault(require('lodash.isplainobject'));
var clone = _interopDefault(require('lodash.clonedeep'));

function existy(x) {
  return x != null;
}
function truthy(x) {
  return x !== false && existy(x);
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
  var ast = clone(originalAst);
  if (isObj(ast)) {
    if (compare(ast, keyValPair)) {
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

module.exports = getObj;
