/**
 * @name ast-get-object
 * @fileoverview Getter/setter for nested parsed HTML AST's, querying objects by key/value pairs
 * @version 3.0.5
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ast-get-object/}
 */

import clone from 'lodash.clonedeep';
import isObj from 'lodash.isplainobject';
import { compare } from 'ast-compare';

var version$1 = "3.0.5";

const version = version$1;
function existy(x) {
  return x != null;
}
function truthy(x) {
  return x !== false && existy(x);
}
function internalApi(originalAst, keyValPair, replacementContentsArr, result = []) {
  if (!existy(originalAst)) {
    throw new Error("ast-get-object: [THROW_ID_01] First argument is missing!");
  }
  if (!existy(keyValPair)) {
    throw new Error("ast-get-object: [THROW_ID_02] Second argument is missing!");
  }
  let set = false;
  if (existy(replacementContentsArr) && Array.isArray(replacementContentsArr)) {
    set = true;
  }
  let ast = clone(originalAst);
  /* istanbul ignore else */
  if (isObj(ast)) {
    if (compare(ast, keyValPair)) {
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
      Object.keys(ast).forEach(key => {
        if (Array.isArray(ast[key]) || isObj(ast[key])) {
          if (set) {
            ast[key] = internalApi(ast[key], keyValPair, replacementContentsArr, result);
          } else {
            internalApi(ast[key], keyValPair, replacementContentsArr, result);
          }
        }
      });
    }
  } else if (Array.isArray(ast)) {
    ast.forEach((_el, i) => {
      /* istanbul ignore else */
      if (isObj(ast[i]) || Array.isArray(ast[i])) {
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

export { getObj, version };
