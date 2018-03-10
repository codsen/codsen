/* eslint no-param-reassign:0 */

import trim from 'lodash.trim'
import isObj from 'lodash.isplainobject'
import traverse from 'ast-monkey-traverse'

function containsOnlyEmptySpace(input) {
  function isStr(something) { return typeof something === 'string' }
  const isArr = Array.isArray
  let found = true

  if (!isArr(input) && !isObj(input) && !isStr(input)) {
    return false
  } else if (isStr(input)) {
    return trim(input).length === 0
  }
  input = traverse(input, (key, val) => {
    const current = (val !== undefined) ? val : key
    if (isStr(current) && (trim(current) !== '')) {
      found = false
    }
    return current
  })

  return found
}

export default containsOnlyEmptySpace
