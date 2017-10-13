/* eslint no-prototype-builtins:0 */

// ===================================
// V A R S

const clone = require('lodash.clonedeep')
const type = require('type-detect')
const merge = require('object-merge-advanced')

// ===================================
// F U N C T I O N S

function isObj(something) { return type(something) === 'Object' }
function isArr(something) { return Array.isArray(something) }
function isStr(something) { return type(something) === 'string' }

function fillMissingKeys(originalIncomplete, originalSchema) {
  if (arguments.length === 0) {
    throw new Error('object-fill-missing-keys: [THROW_ID_01] All arguments are missing!')
  }
  if (type(originalIncomplete) !== type(originalSchema)) {
    throw new Error('object-fill-missing-keys: [THROW_ID_02] The types of input object and schema reference are different!')
  }
  const incomplete = clone(originalIncomplete)
  const schema = clone(originalSchema)

  if (isObj(incomplete) && isObj(schema)) {
    // both are objects
    Object.keys(schema).forEach((key) => {
      if (!incomplete.hasOwnProperty(key)) {
        // if key is missing, simply add it:
        incomplete[key] = schema[key]
      } else
      // obj key clash
      // console.log('\n=======\n')
      // console.log('incomplete[key] = ' + JSON.stringify(incomplete[key], null, 4))
      // console.log('schema[key] = ' + JSON.stringify(schema[key], null, 4))
      if (!isStr(incomplete[key]) || !isStr(schema[key])) {
        if (!isArr(incomplete[key]) || (isArr(incomplete[key]) && incomplete[key].length === 0)) {
          incomplete[key] = merge(incomplete[key], schema[key])
        } else {
          incomplete[key] = fillMissingKeys(incomplete[key], schema[key])
        }
      }
    })
  } else if (isArr(incomplete) && isArr(schema)) {
    // both are arrays
    incomplete.forEach((el, i) => {
      incomplete[i] = fillMissingKeys(incomplete[i], schema[0])
    })
  }

  return incomplete
}

module.exports = fillMissingKeys
