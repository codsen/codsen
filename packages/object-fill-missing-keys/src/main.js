/* eslint no-prototype-builtins:0, max-len:0, no-param-reassign:0 */

// ===================================
// V A R S

import clone from 'lodash.clonedeep'
import typ from 'type-detect'
import merge from 'object-merge-advanced'
import checkTypes from 'check-types-mini'
import arrayiffyIfString from 'arrayiffy-if-string'

// ===================================
// I N T E R N A L   F U N C T I O N S

function isObj(something) { return typ(something) === 'Object' }
function isArr(something) { return Array.isArray(something) }
function isStr(something) { return typ(something) === 'string' }

// this function does the job, but it is not exposed because its first argument
// requirements are loose - it can be anything since it will be calling itself recursively
// with potentially AST contents (objects containing arrays containing objects etc.)
function fillMissingKeys(originalIncomplete, originalSchema, originalOpts) {
  const defaults = {
    placeholder: false, // value which is being used as a placeholder
    doNotFillTheseKeysIfAllTheirValuesArePlaceholder: [],
  }
  // fill any settings with defaults if missing:
  const opts = Object.assign({}, defaults, originalOpts)

  opts.doNotFillTheseKeysIfAllTheirValuesArePlaceholder = arrayiffyIfString(opts.doNotFillTheseKeysIfAllTheirValuesArePlaceholder)

  // the check:
  checkTypes(opts, defaults, {
    msg: 'object-fill-missing-keys: [THROW_ID_05*]',
    schema: {
      placeholder: ['object', 'array', 'string', 'null', 'boolean', 'number'],
    },
  })

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

// =================================================
// T H E   M A I N   E X P O S E D   F U N C T I O N

function fillMissingKeysWrapper(originalIncompleteWrapper, originalSchemaWrapper, originalOptsWrapper) {
  // first argument must be an object. However, we're going to call recursively,
  // so we have to wrap the main function with another, wrapper-one, and perform
  // object-checks only on that wrapper. This way, only objects can come in,
  // but inside there can be whatever data structures.
  if (arguments.length === 0) {
    throw new Error('object-fill-missing-keys: [THROW_ID_01] All arguments are missing!')
  }
  if (!isObj(originalIncompleteWrapper)) {
    throw new Error(`object-fill-missing-keys: [THROW_ID_02] First argument, input object must be a plain object. Currently it's type is "${typ(originalIncompleteWrapper)}" and it's equal to: ${JSON.stringify(originalIncompleteWrapper, null, 4)}`)
  }
  if (!isObj(originalSchemaWrapper)) {
    throw new Error(`object-fill-missing-keys: [THROW_ID_03] Second argument, scema object, must be a plain object. Currently it's type is "${typ(originalSchemaWrapper)}" and it's equal to: ${JSON.stringify(originalSchemaWrapper, null, 4)}`)
  }
  if ((originalOptsWrapper !== undefined) && (originalOptsWrapper !== null) && !isObj(originalOptsWrapper)) {
    throw new Error(`object-fill-missing-keys: [THROW_ID_04] Third argument, scema object, must be a plain object. Currently it's type is "${typ(originalOptsWrapper)}" and it's equal to: ${JSON.stringify(originalOptsWrapper, null, 4)}`)
  }
  if (originalOptsWrapper === null) {
    originalOptsWrapper = {}
  }
  return fillMissingKeys(originalIncompleteWrapper, originalSchemaWrapper, originalOptsWrapper)
}

export default fillMissingKeysWrapper
