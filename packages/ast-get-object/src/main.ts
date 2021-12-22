/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import clone from "lodash.clonedeep";
import isObj from "lodash.isplainobject";
import { compare } from "ast-compare";

import { version as v } from "../package.json";

const version: string = v;

interface UnknownValueObj {
  [key: string]: any;
}

// ===================================
// F U N C T I O N S

function existy(x: any): boolean {
  return x != null;
}
function truthy(x: any): boolean {
  return x !== false && existy(x);
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
  if (!existy(originalAst)) {
    throw new Error("ast-get-object: [THROW_ID_01] First argument is missing!");
  }
  if (!existy(keyValPair)) {
    throw new Error(
      "ast-get-object: [THROW_ID_02] Second argument is missing!"
    );
  }
  // is it set mode or not:
  let set = false;
  if (existy(replacementContentsArr) && Array.isArray(replacementContentsArr)) {
    set = true;
  }
  let ast = clone(originalAst);
  // if object is passed, crawl it, checking for keyValPair:
  /* istanbul ignore else */
  if (isObj(ast)) {
    // console.log('\nwill compare:')
    // console.log('ast = ' + JSON.stringify(ast, null, 4))
    // console.log('keyValPair = ' + JSON.stringify(keyValPair, null, 4))
    if (compare(ast, keyValPair)) {
      if (set) {
        /* istanbul ignore else */
        if ((replacementContentsArr as UnknownValueObj[]).length > 0) {
          ast = (replacementContentsArr as UnknownValueObj[])[0];
          (replacementContentsArr as UnknownValueObj[]).shift();
        }
      } else {
        result.push(ast);
      }
    } else {
      Object.keys(ast).forEach((key) => {
        if (Array.isArray(ast[key]) || isObj(ast[key])) {
          // console.log('ast[key] = ' + JSON.stringify(ast[key], null, 4))
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
      // console.log('array el[' + i + ']=' + JSON.stringify(el, null, 4))
      /* istanbul ignore else */
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

  if (truthy(replacementContentsArr)) {
    // console.log('ast = ' + JSON.stringify(ast, null, 4))
    return ast;
  }
  // console.log('result = ' + JSON.stringify(result, null, 4))
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
