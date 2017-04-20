'use strict'
/* eslint padded-blocks: 0 */

// const objectAssign = require('object-assign')
const type = require('type-detect')
const clone = require('lodash.clonedeep')
const isStringInt = require('is-string-int')
const isArr = Array.isArray
function isStr (something) { return type(something) === 'string' }
function isObj (something) { return type(something) === 'Object' }
function existy (x) { return x != null }

function checkTypes (obj, ref, msg, variable) {
  if (arguments.length === 0) {
    throw new Error('object-flatten-referencing/util.js/checkTypes(): missing inputs!')
  }
  Object.keys(obj).forEach(function (key) {
    if (existy(ref[key]) && type(obj[key]) !== type(ref[key])) {
      throw new TypeError(msg + ' ' + variable + '.' + key + ' was customised to ' + JSON.stringify(obj[key], null, 4) + ' which is not ' + type(ref[key]) + ' but ' + type(obj[key]))
    }
  })
}

function flattenObject (objOrig, opts) {
  if (arguments.length === 0 || Object.keys(objOrig).length === 0) {
    return []
  }
  var obj = clone(objOrig)
  var res = []
  if (isObj(obj)) {
    Object.keys(obj).forEach(function (key) {
      if (isObj(obj[key])) {
        obj[key] = flattenObject(obj[key], opts)
      }
      if (isArr(obj[key])) {
        res = res.concat(obj[key].map(function (el) {
          return key + opts.objectKeyAndValueJoinChar + el
        }))
      }
      if (isStr(obj[key])) {
        res.push(key + opts.objectKeyAndValueJoinChar + obj[key])
      }
    })
  }
  return res
}

function flattenArr (arrOrig, opts, wrap) {
  if (arguments.length === 0 || arrOrig.length === 0) {
    return ''
  }
  var arr = clone(arrOrig)

  var res = (wrap ? opts.wrapHeads : '') + arr[0] + (wrap ? opts.wrapTails : '')

  if (arr.length > 1) {
    for (var i = 1, len = arr.length; i < len; i++) {
      res += '<br' + (opts.xhtml ? ' /' : '') + '>' + (wrap ? opts.wrapHeads : '') + arr[i] + (wrap ? opts.wrapTails : '')
    }
  }
  return res
}

function arrayiffyString (something) {
  if (isStr(something)) {
    if (something.length > 0) {
      return [something]
    } else {
      return []
    }
  }
  return something
}

function reclaimIntegerString (something) {
  if (isStr(something) && isStringInt(something)) {
    return parseInt(something, 10)
  }
  return something
}

module.exports = {
  checkTypes: checkTypes,
  flattenObject: flattenObject,
  flattenArr: flattenArr,
  arrayiffyString: arrayiffyString,
  reclaimIntegerString: reclaimIntegerString
}
