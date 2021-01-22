/**
 * ast-get-object
 * Getter/setter for nested parsed HTML AST's, querying objects by key/value pairs
 * Version: 1.10.1
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

var version = "1.10.1";

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
var version$1 = version; // ===================================
// F U N C T I O N S

function existy(x) {
  return x != null;
}

function truthy(x) {
  return x !== false && existy(x);
}
/**
 * Getter/setter for nested parsed HTML AST's
 */


function internalApi(originalAst, keyValPair, replacementContentsArr, result) {
  if (result === void 0) {
    result = [];
  }

  if (!existy(originalAst)) {
    throw new Error("ast-get-object: [THROW_ID_01] First argument is missing!");
  }

  if (!existy(keyValPair)) {
    throw new Error("ast-get-object: [THROW_ID_02] Second argument is missing!");
  } // is it set mode or not:


  var set = false;

  if (existy(replacementContentsArr) && Array.isArray(replacementContentsArr)) {
    set = true;
  }

  var ast = clone__default['default'](originalAst); // if object is passed, crawl it, checking for keyValPair:

  /* istanbul ignore else */

  if (isObj__default['default'](ast)) {
    // console.log('\nwill compare:')
    // console.log('ast = ' + JSON.stringify(ast, null, 4))
    // console.log('keyValPair = ' + JSON.stringify(keyValPair, null, 4))
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
          // console.log('ast[key] = ' + JSON.stringify(ast[key], null, 4))
          if (set) {
            ast[key] = internalApi(ast[key], keyValPair, replacementContentsArr, result);
          } else {
            internalApi(ast[key], keyValPair, replacementContentsArr, result);
          }
        }
      });
    }
  } else if (Array.isArray(ast)) {
    // else, it's an array. Iterate each key, if it's an obj, call findTag()
    ast.forEach(function (_el, i) {
      // console.log('array el[' + i + ']=' + JSON.stringify(el, null, 4))

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
    // console.log('ast = ' + JSON.stringify(ast, null, 4))
    return ast;
  } // console.log('result = ' + JSON.stringify(result, null, 4))


  return result;
} // second function is necessary to shielf the 4th input argument which is
// for internal use only.


function getObj(originalAst, keyValPair, replacementContentsArr) {
  return internalApi(originalAst, keyValPair, replacementContentsArr);
}

exports.getObj = getObj;
exports.version = version$1;
