'use strict'

const type = require('type-detect')
const objectAssign = require('object-assign')
const clone = require('lodash.clonedeep')

function objectNoNewKeys (input, reference, opts) {
  function isObj (something) { return type(something) === 'Object' }
  const isArr = Array.isArray
  var defaults = {
    mode: 2
  }
  opts = objectAssign(clone(defaults), opts)
  if (typeof opts.mode === 'string') {
    opts.mode = parseInt(opts.mode, 10)
  }
  if ((opts.mode !== 1) && (opts.mode !== 2)) {
    throw new TypeError('object-no-new-keys/objectNoNewKeys(): [THROW_ID_01] opts.mode was customised to be a wrong thing, "' + opts.mode + '" while it should be either natural number 1 or 2.')
  }

  function objectNoNewKeysInternal (input, reference, opts, innerVar) {
    var temp
    if (innerVar === undefined) {
      innerVar = {path: '', res: []}
    }
    if (isObj(input)) {
      if (isObj(reference)) {
        // input and reference both are objects.
        // match the keys and record any unique-ones.
        // then traverse recursively.
        Object.keys(input).forEach(function (key) {
          if (!reference.hasOwnProperty(key)) {
            temp = (innerVar.path.length > 0) ? (innerVar.path + '.' + key) : key
            innerVar.res.push(temp)
          } else if (isObj(input[key]) || isArr(input[key])) {
            temp = {
              path: innerVar.path.length > 0 ? (innerVar.path + '.' + key) : key,
              res: innerVar.res
            }
            innerVar.res = objectNoNewKeysInternal(input[key], reference[key], opts, temp).res
          }
        })
      } else {
        // input is object, but reference is not.
        // record all the keys of the input, but don't traverse deeper
        innerVar.res = innerVar.res.concat(Object.keys(input).map(function (key) {
          return innerVar.path.length > 0 ? (innerVar.path + '.' + key) : key
        }))
      }
    } else if (isArr(input)) {
      if (isArr(reference)) {
        // both input and reference are arrays.
        // traverse each
        for (var i = 0, len = input.length; i < len; i++) {
          temp = {
            path: (innerVar.path.length > 0 ? (innerVar.path) : '') + '[' + i + ']',
            res: innerVar.res
          }
          if (opts.mode === 2) {
            innerVar.res = objectNoNewKeysInternal(input[i], reference[0], opts, temp).res
          } else {
            innerVar.res = objectNoNewKeysInternal(input[i], reference[i], opts, temp).res
          }
        }
      } else {
        // mismatch
        // traverse all elements of the input and put their locations to innerVar.res
        innerVar.res = innerVar.res.concat(input.map(function (el, i) {
          return (innerVar.path.length > 0 ? (innerVar.path) : '') + '[' + i + ']'
        }))
      }
    }
    return innerVar
  }
  return objectNoNewKeysInternal(input, reference, opts).res
}

module.exports = objectNoNewKeys
