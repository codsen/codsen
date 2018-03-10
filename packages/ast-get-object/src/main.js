/* eslint prefer-destructuring:0 */

// ===================================
// R E Q U I R E' S

import compare from 'posthtml-ast-compare'
import isObj from 'lodash.isplainobject'
import clone from 'lodash.clonedeep'

// ===================================
// F U N C T I O N S

function existy(x) { return x != null }
function truthy(x) { return (x !== false) && existy(x) }

/**
 * getObj - This is a walker-function for querying/writing PostHTML-parsed AST.
 * Pass something (array or object, possibly nested) and a plain object with
 * key-value pair (or pairs) you want to search.
 * This library will traverse the nested object and array tree (AST) and look
 * for that key-value pair in any object. If such key-value pair is found,
 * the parent plain object will be put into an array and returned.
 *
 * If the third argument is provided, it's WRITE mode.
 * Instead of returning results array, a copy of the first argument with
 * replaced findings will be returned.
 *
 * @param  {Whatever} ast               pass in the PostHTML AST (normally an array).
 * @param  {Object} keyValPair          object - key-value pair to look for.
 * @param  {Array} replacementContentsArr  OPTIONAL array of values to replace the findings with -
 * can be a array of anything - normally amended result of a previous search.
 * @return {Whatever}                   * in READ mode (3 args given), array of objects
 *                                      * in WRITE mode (4 args given),
 * mutated ast (first parameter)
 */
function getObj(originalAst, keyValPair, replacementContentsArr, result = []) {
  if (!existy(originalAst)) {
    throw new Error('ast-get-object: [THROW_ID_01] First argument is missing!')
  }
  if (!existy(keyValPair)) {
    throw new Error('ast-get-object: [THROW_ID_02] Second argument is missing!')
  }
  // is it set mode or not:
  let set = false
  if (existy(replacementContentsArr) && Array.isArray(replacementContentsArr)) {
    set = true
  }
  let ast = clone(originalAst)
  // if object is passed, crawl it, checking for keyValPair:
  if (isObj(ast)) {
    // console.log('\nwill compare:')
    // console.log('ast = ' + JSON.stringify(ast, null, 4))
    // console.log('keyValPair = ' + JSON.stringify(keyValPair, null, 4))
    if (compare(ast, keyValPair)) {
      if (set) {
        if (replacementContentsArr.length > 0) {
          ast = replacementContentsArr[0]
          replacementContentsArr.shift()
        }
      } else {
        result.push(ast)
      }
    } else {
      Object.keys(ast).forEach((key) => {
        if (Array.isArray(ast[key]) || isObj(ast[key])) {
          // console.log('ast[key] = ' + JSON.stringify(ast[key], null, 4))
          if (set) {
            ast[key] = getObj(ast[key], keyValPair, replacementContentsArr, result)
          } else {
            getObj(ast[key], keyValPair, replacementContentsArr, result)
          }
        }
      })
    }
  } else if (Array.isArray(ast)) {
    // else, it's an array. Iterate each key, if it's an obj, call findTag()
    ast.forEach((el, i) => {
      // console.log('array el[' + i + ']=' + JSON.stringify(el, null, 4))
      if (isObj(ast[i]) || Array.isArray(ast[i])) {
        if (set) {
          ast[i] = getObj(ast[i], keyValPair, replacementContentsArr, result)
        } else {
          getObj(ast[i], keyValPair, replacementContentsArr, result)
        }
      }
    })
  }

  if (truthy(replacementContentsArr)) {
    // console.log('ast = ' + JSON.stringify(ast, null, 4))
    return ast
  }
  // console.log('result = ' + JSON.stringify(result, null, 4))
  return result
}

export default getObj
