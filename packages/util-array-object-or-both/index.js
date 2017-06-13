'use strict'

const includes = require('lodash.includes')
const objectAssign = require('object-assign')
const checkTypes = require('check-types-mini')
const clone = require('lodash.clonedeep')
const isObj = require('lodash.isplainobject')

function validate (str, opts) {
  function existy (x) { return x != null }
  if (!existy(str)) {
    throw new Error(`util-array-object-or-both/validate(): [THROW_ID_01] Please provide a string to work on. Currently it's equal to ${JSON.stringify(str, null, 4)}`)
  }
  if (typeof str !== 'string') {
    throw new Error(`util-array-object-or-both/validate(): [THROW_ID_02] Input must be string! Currently it's ${typeof str}, equal to: ${JSON.stringify(str, null, 4)}`)
  }
  if (existy(opts) && !isObj(opts)) {
    throw new Error(`util-array-object-or-both/validate(): [THROW_ID_03] Second argument, options object, must be, well, object! Currenlty it's: ${typeof opts}, equal to: ${JSON.stringify(opts, null, 4)}`)
  }

  const onlyObjectValues = ['object', 'objects', 'obj', 'ob', 'o']
  const onlyArrayValues = ['array', 'arrays', 'arr', 'aray', 'arr', 'a']
  const onlyAnyValues = ['any', 'all', 'everything', 'both', 'either', 'each', 'whatever', 'whatevs', 'e']

  var defaults = {
    msg: '',
    optsVarName: 'given variable'
  }
  opts = objectAssign(clone(defaults), opts)
  checkTypes(
    opts,
    defaults,
    {
      msg: 'util-array-object-or-both/validate(): [THROW_ID_03]',
      optsVarName: 'opts',
      schema: {
        msg: ['string', null],
        optsVarName: ['string', null]
      }
    }
  )
  if (existy(opts.msg) && opts.msg.length > 0) {
    opts.msg = opts.msg.trim() + ' '
  }
  if (opts.optsVarName !== 'given variable') {
    opts.optsVarName = 'variable "' + opts.optsVarName + '"'
  }

  if (includes(onlyObjectValues, str.toLowerCase().trim())) {
    return 'object'
  } else if (includes(onlyArrayValues, str.toLowerCase().trim())) {
    return 'array'
  } else if (includes(onlyAnyValues, str.toLowerCase().trim())) {
    return 'any'
  } else {
    throw new TypeError(`${opts.msg}The ${opts.optsVarName} was customised to an unrecognised value: ${str}. Please check it against the API documentation.`)
  }
}

module.exports = validate
