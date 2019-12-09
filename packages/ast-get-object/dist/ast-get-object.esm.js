/**
 * ast-get-object
 * Getter/setter for nested parsed HTML AST's, querying objects by key/value pairs
 * Version: 1.8.54
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-get-object
 */

import compare from 'ast-compare';
import isObj from 'lodash.isplainobject';
import clone from 'lodash.clonedeep';

function existy(x) {
  return x != null;
}
function truthy(x) {
  return x !== false && existy(x);
}
function getObj(originalAst, keyValPair, replacementContentsArr, result = []) {
  if (!existy(originalAst)) {
    throw new Error("ast-get-object: [THROW_ID_01] First argument is missing!");
  }
  if (!existy(keyValPair)) {
    throw new Error(
      "ast-get-object: [THROW_ID_02] Second argument is missing!"
    );
  }
  let set = false;
  if (existy(replacementContentsArr) && Array.isArray(replacementContentsArr)) {
    set = true;
  }
  let ast = clone(originalAst);
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
      Object.keys(ast).forEach(key => {
        if (Array.isArray(ast[key]) || isObj(ast[key])) {
          if (set) {
            ast[key] = getObj(
              ast[key],
              keyValPair,
              replacementContentsArr,
              result
            );
          } else {
            getObj(ast[key], keyValPair, replacementContentsArr, result);
          }
        }
      });
    }
  } else if (Array.isArray(ast)) {
    ast.forEach((el, i) => {
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

export default getObj;
