'use strict'
/* eslint padded-blocks: 0 */

const objectAssign = require('object-assign')
const type = require('type-detect')
const clone = require('lodash.clonedeep')
const search = require('str-indexes-of-plus')
const isArr = Array.isArray
const util = require('./util')
const includes = require('lodash.includes')
const matcher = require('matcher')

function existy (x) { return x != null }
function isStr (something) { return type(something) === 'string' }
function isObj (something) { return type(something) === 'Object' }
// function isBool (something) { return typeof something === 'boolean' }

function outer (originalInput, originalReference, opts) {
  if (arguments.length === 0) {
    throw new Error('object-flatten-referencing/ofr(): [THROW_ID_01] all inputs missing!')
  }
  if (arguments.length === 1) {
    throw new Error('object-flatten-referencing/ofr(): [THROW_ID_02] reference object missing!')
  }
  if ((typeof opts !== 'undefined') && !isObj(opts)) {
    throw new Error('object-flatten-referencing/ofr(): [THROW_ID_03] third input, options object must be a plain object. Currently it\'s: ' + typeof opts)
  }

  function ofr (originalInput, originalReference, opts, wrap) {
    var input = clone(originalInput)
    var reference = clone(originalReference)

    if (wrap === undefined) {
      wrap = true
    }

    var defaults = {
      wrapHeadsWith: '%%_',
      wrapTailsWith: '_%%',
      dontWrapKeys: [],
      xhtml: true, // when flattening arrays, put <br /> (XHTML) or <br> (HTML)
      preventDoubleWrapping: true,
      objectKeyAndValueJoinChar: '.',
      wrapGlobalFlipSwitch: true, // Allow disabling the wrapping feature. Used on deeper branches.
      ignore: [], // Ignore these keys, don't flatten their values.
      whatToDoWhenReferenceIsMissing: 0 // 0 = leave that key's value as it is, 1 = throw, 2 = flatten to string & wrap if wrapping feature is enabled
    }
    opts = objectAssign(clone(defaults), opts)
    opts.dontWrapKeys = util.arrayiffyString(opts.dontWrapKeys)
    opts.ignore = util.arrayiffyString(opts.ignore)
    opts.whatToDoWhenReferenceIsMissing = util.reclaimIntegerString(opts.whatToDoWhenReferenceIsMissing)

    util.checkTypes(opts, defaults, 'object-flatten-referencing/ofr(): [THROW_ID_05*] ', 'opts')
    if (!opts.wrapGlobalFlipSwitch) {
      wrap = false
    }

    if (isObj(input)) {
      Object.keys(input).forEach(function (key) {
        if ((opts.ignore.length === 0) || !includes(opts.ignore, key)) {

          if (opts.wrapGlobalFlipSwitch) {
            wrap = true // reset it for the new key.
          }
          if (opts.wrapGlobalFlipSwitch && opts.dontWrapKeys.length > 0) {
            wrap = wrap && !opts.dontWrapKeys.some(function (elem) {
              return matcher.isMatch(key, elem)
            })
          }

          if (
            existy(reference[key]) ||
            (!existy(reference[key]) && (opts.whatToDoWhenReferenceIsMissing === 2))
          ) {
            if (isArr(input[key])) {
              if ((opts.whatToDoWhenReferenceIsMissing === 2) || isStr(reference[key])) {
                input[key] = util.flattenArr(input[key], opts, wrap)
              } else {
                input[key] = ofr(input[key], reference[key], opts, wrap)
              }
            } else if (isObj(input[key])) {
              if ((opts.whatToDoWhenReferenceIsMissing === 2) || isStr(reference[key])) {
                input[key] = util.flattenArr(util.flattenObject(input[key], opts), opts, wrap)
              } else {
                // when calling recursively, the parent key might get identified (wrap=true) to be wrapped.
                // however, that flag might get lost as its children will calculate the new "wrap" on its own keys, often turning off the wrap function.
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
          } else {
            if (type(input[key]) !== type(reference[key])) {
              if (opts.whatToDoWhenReferenceIsMissing === 1) {
                throw new Error('object-flatten-referencing/ofr(): [THROW_ID_06] reference object does not have the key ' + key + ' and we need it. TIP: Turn off throwing via opts.whatToDoWhenReferenceIsMissing.')
              }
              // when opts.whatToDoWhenReferenceIsMissing === 2, library does nothing, so we simply let it slip through.
            }
          }

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
      if (input.length > 0 && (opts.wrapHeadsWith || opts.wrapTailsWith)) {
        if (
        !opts.preventDoubleWrapping ||
        (
          (opts.wrapHeadsWith === '' || !search(input, opts.wrapHeadsWith.trim()).length) &&
          (opts.wrapTailsWith === '' || !search(input, opts.wrapTailsWith.trim()).length)
        )
      ) {
          input = (wrap ? opts.wrapHeadsWith : '') + input + (wrap ? opts.wrapTailsWith : '')
        }
      }
    }

    return input

  }

  return ofr(originalInput, originalReference, opts)

}

module.exports = outer
