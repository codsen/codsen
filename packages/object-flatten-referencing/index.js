'use strict'
/* eslint padded-blocks: 0 */

const objectAssign = require('object-assign')
const type = require('type-detect')
const clone = require('lodash.clonedeep')
const search = require('str-indexes-of-plus')
const isArr = Array.isArray
const util = require('./util')

function existy (x) { return x != null }
function isStr (something) { return type(something) === 'string' }
function isObj (something) { return type(something) === 'Object' }
// function isBool (something) { return typeof something === 'boolean' }

function outer (originalInput, originalReference, opts) {
  if (arguments.length === 0) {
    throw new Error('object-flatten-referencing/ofr(): all inputs missing!')
  }
  if (arguments.length === 1) {
    throw new Error('object-flatten-referencing/ofr(): reference object missing!')
  }
  if ((typeof opts !== 'undefined') && !isObj(opts)) {
    throw new Error('object-flatten-referencing/ofr(): third input, options object must be a plain object. Currently it\'s: ' + typeof opts)
  }

  function ofr (originalInput, originalReference, opts, wrap) {
    var input = clone(originalInput)
    var reference = clone(originalReference)

    if (wrap === undefined) {
      wrap = true
    }

    var defaults = {
      wrapHeads: '%%_',
      wrapTails: '_%%',
      dontWrapKeysStartingWith: [],
      dontWrapKeysEndingWith: [],
      xhtml: true,
      preventDoubleWrapping: true,
      objectKeyAndValueJoinChar: '.',
      wrapGlobalFlipSwitch: true // allow disabling the wrapping feature. used on deeper branches.
    }
    opts = objectAssign(clone(defaults), opts)
    if (isStr(opts.dontWrapKeysEndingWith)) {
      if (opts.dontWrapKeysEndingWith.length > 0) {
        opts.dontWrapKeysEndingWith = [opts.dontWrapKeysEndingWith]
      } else {
        opts.dontWrapKeysEndingWith = []
      }
    }
    if (isStr(opts.dontWrapKeysStartingWith)) {
      if (opts.dontWrapKeysStartingWith.length > 0) {
        opts.dontWrapKeysStartingWith = [opts.dontWrapKeysStartingWith]
      } else {
        opts.dontWrapKeysStartingWith = []
      }
    }
    util.checkTypes(opts, defaults, 'object-flatten-referencing/ofr():', 'opts')
    if (!opts.wrapGlobalFlipSwitch) {
      wrap = false
    }

    if (isObj(input)) {
      Object.keys(input).forEach(function (key) {
        if (opts.wrapGlobalFlipSwitch) {
          wrap = true // reset it for the new key.
        }
        if (opts.wrapGlobalFlipSwitch && opts.dontWrapKeysEndingWith.length > 0) {
          wrap = wrap && !opts.dontWrapKeysEndingWith.some(function (elem) {
            return key.endsWith(elem)
          })
        }
        if (opts.wrapGlobalFlipSwitch && opts.dontWrapKeysStartingWith.length > 0) {
          wrap = wrap && !opts.dontWrapKeysStartingWith.some(function (elem) {
            return key.startsWith(elem)
          })
        }
        if (isArr(input[key])) {
          if (isStr(reference[key])) {
            input[key] = util.flattenArr(input[key], opts, wrap)
          } else {
            input[key] = ofr(input[key], reference[key], opts, wrap)
          }
        } else if (isObj(input[key])) {
          if (isStr(reference[key])) {
            input[key] = util.flattenArr(util.flattenObject(input[key], opts), opts, wrap)
          } else {
            // when calling recursively, the parent key might get identified (wrap=false) to be not wrapped.
            // however, that flag might get lost as its children will calculate the new "wrap" on its own keys.
            // to prevent that, we flip the switch on the global wrap setting for all deeper child nodes.
            // we also clone the options object so as not to mutate it.
            if (!wrap) {
              input[key] = ofr(
                input[key],
                reference[key],
                objectAssign(clone(opts), {wrapGlobalFlipSwitch: false}),
                wrap
              )
            } else {
              input[key] = ofr(input[key], reference[key], opts, wrap)
            }
          }
        } else if (isStr(input[key])) {

          input[key] = ofr(input[key], reference[key], opts, wrap)
        }
      })
    } else if (isArr(input)) {
      if (isArr(reference)) {
        input.forEach(function (el, i) {
          if (existy(input[i]) && existy(reference[i])) {
            input[i] = ofr(input[i], reference[i], opts, wrap)
          } else {
            input[i] = ofr(input[i], reference[0], opts, wrap)
          }
        })
      }
    } else if (isStr(input)) {
      if (input.length > 0 && (opts.wrapHeads || opts.wrapTails)) {
        if (
        !opts.preventDoubleWrapping ||
        (
          (opts.wrapHeads === '' || !search(input, opts.wrapHeads).length) &&
          (opts.wrapTails === '' || !search(input, opts.wrapTails).length)
        )
      ) {
          input = (wrap ? opts.wrapHeads : '') + input + (wrap ? opts.wrapTails : '')
        }
      }
    }

    return input

  }

  return ofr(originalInput, originalReference, opts)

}

module.exports = outer
