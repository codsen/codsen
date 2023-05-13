/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import rfdc from "rfdc";
import { isPlainObject as isObj } from "codsen-utils";
import { compare } from "ast-compare";

import { version as v } from "../package.json";

const clone = rfdc();
const version: string = v;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

export interface UnknownValueObj {
  [key: string]: any;
}

/**
 * Getter/setter for nested parsed HTML AST's
 */
function internalApi(
  originalAst: any,
  keyValPair: UnknownValueObj,
  replacementContentsArr?: UnknownValueObj[],
  result: any[] = []
): any {
  if (!originalAst) {
    throw new Error("ast-get-object: [THROW_ID_01] First argument is missing!");
  }
  if (!keyValPair) {
    throw new Error(
      "ast-get-object: [THROW_ID_02] Second argument is missing!"
    );
  }
  // is it set mode or not:
  let set = false;
  if (Array.isArray(replacementContentsArr)) {
    set = true;
  }
  let ast = clone(originalAst);
  // if object is passed, crawl it, checking for keyValPair:
  /* c8 ignore next */
  if (isObj(ast)) {
    // DEV && console.log('\nwill compare:')
    // DEV && console.log('ast = ' + JSON.stringify(ast, null, 4))
    // DEV && console.log('keyValPair = ' + JSON.stringify(keyValPair, null, 4))
    if (compare(ast, keyValPair)) {
      if (set) {
        /* c8 ignore next */
        if ((replacementContentsArr as UnknownValueObj[]).length) {
          ast = (replacementContentsArr as UnknownValueObj[])[0];
          (replacementContentsArr as UnknownValueObj[]).shift();
        }
      } else {
        result.push(ast);
      }
    } else {
      Object.keys(ast).forEach((key) => {
        if (Array.isArray(ast[key]) || isObj(ast[key])) {
          // DEV && console.log('ast[key] = ' + JSON.stringify(ast[key], null, 4))
          if (set) {
            ast[key] = internalApi(
              ast[key],
              keyValPair,
              replacementContentsArr,
              result
            );
          } else {
            internalApi(ast[key], keyValPair, replacementContentsArr, result);
          }
        }
      });
    }
  } else if (Array.isArray(ast)) {
    // else, it's an array. Iterate each key, if it's an obj, call findTag()
    ast.forEach((_el, i) => {
      // DEV && console.log('array el[' + i + ']=' + JSON.stringify(el, null, 4))
      /* c8 ignore next */
      if (isObj(ast[i]) || Array.isArray(ast[i])) {
        if (set) {
          ast[i] = internalApi(
            ast[i],
            keyValPair,
            replacementContentsArr,
            result
          );
        } else {
          internalApi(ast[i], keyValPair, replacementContentsArr, result);
        }
      }
    });
  }

  if (replacementContentsArr) {
    // DEV && console.log('ast = ' + JSON.stringify(ast, null, 4))
    return ast;
  }
  // DEV && console.log('result = ' + JSON.stringify(result, null, 4))
  return result;
}

// second function is necessary to shielf the 4th input argument which is
// for internal use only.
function getObj(
  originalAst: any,
  keyValPair: UnknownValueObj,
  replacementContentsArr?: UnknownValueObj[]
): any {
  return internalApi(originalAst, keyValPair, replacementContentsArr);
}

export { getObj, version };
