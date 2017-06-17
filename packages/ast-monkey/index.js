'use strict'
const isArr = Array.isArray
const clone = require('lodash.clonedeep')
const isObj = require('lodash.isplainobject')
const isEqual = require('lodash.isequal')
const objectAssign = require('object-assign')
// const validateIsItArrayObjectOrBoth = require('util-array-object-or-both')
const checkTypes = require('check-types-mini')
const isNaturalNumber = require('is-natural-number')
const DEBUG = false

// -----------------------------------------------------------------------------

function existy (x) { return x != null }

function traverse (treeOriginal, callback) {
  //
  // traverseInner() needs a wrapper to shield the internal last argument and simplify external API.
  //
  function traverseInner (treeOriginal, callback, innerObj) {
    var tree = clone(treeOriginal)

    var i, len, res, allKeys, key
    innerObj = objectAssign({depth: -1}, innerObj)
    innerObj.depth++
    if (isArr(tree)) {
      for (i = 0, len = tree.length; i < len; i++) {
        if (tree[i] !== undefined) {
          innerObj.parent = clone(tree)
          res = traverseInner(callback(tree[i], undefined, innerObj), callback, innerObj)
          if ((Number.isNaN(res)) && (i < tree.length)) {
            tree.splice(i, 1)
            i--
          } else {
            tree[i] = res
          }
        } else {
          tree.splice(i, 1)
        }
      }
    } else if (isObj(tree)) {
      allKeys = Object.keys(tree)
      for (i = 0, len = allKeys.length; i < len; i++) {
        key = allKeys[i]
        if (innerObj.depth === 0 && existy(key)) {
          innerObj.topmostKey = key
        }
        innerObj.parent = clone(tree)
        res = traverseInner(callback(key, tree[key], innerObj), callback, innerObj)
        if (Number.isNaN(res)) {
          delete tree[key]
        } else {
          tree[key] = res
        }
      }
    }
    return tree
  }
  return traverseInner(treeOriginal, callback, {})
}

// -----------------------------------------------------------------------------

function monkey (inputOriginal, opts) {
  // -----------------------------------
  // precautions
  if (!existy(inputOriginal)) {
    throw new Error('ast-monkey/index.js/monkey(): Please provide an input')
  }
  var input = clone(inputOriginal)
  opts = objectAssign({
    key: null,
    val: null
  }, opts)
  // ---------------------------------------------------------------------------
  // action

  if (DEBUG || opts.mode === 'info') { console.log('mode: ' + opts.mode) }
  var data = { count: 0, gatherPath: [], finding: null }
  var findings = []

  var ko = false // key only
  var vo = false // value only
  if (existy(opts.key) && !existy(opts.val)) {
    ko = true
  }
  if (!existy(opts.key) && existy(opts.val)) {
    vo = true
  }

  if (DEBUG || opts.mode === 'info') { console.log('ORIGINAL INPUT:\ninput = ' + JSON.stringify(input, null, 4) + '\n========================') }
  if (DEBUG || opts.mode === 'info') { console.log('-----------') }

  if (opts.mode === 'arrayFirstOnly' && Array.isArray(input) && input.length > 0) {
    input = [input[0]]
  }

  //
  //
  //

  input = traverse(input, function (key, val, innerObj) {
    var temp
    data.count++
    if (DEBUG || opts.mode === 'info') { console.log('    #' + data.count + '\n') }
    if (DEBUG || opts.mode === 'info') { console.log('key = ' + JSON.stringify(key, null, 4)) }
    if (existy(val)) {
      if (DEBUG || opts.mode === 'info') { console.log('val = ' + JSON.stringify(val, null, 4)) }
    }
    data.gatherPath.length = innerObj.depth
    data.gatherPath.push(data.count)
    if (DEBUG || opts.mode === 'info') { console.log('data.gatherPath = ' + JSON.stringify(data.gatherPath, null, 4)) }
    if (opts.mode === 'get') {
      if (
        (opts.mode === 'get' && (data.count === opts.index))
      ) {
        if (existy(val)) {
          data.finding = {}
          data.finding[key] = val
        } else {
          data.finding = key
        }
      }
    } else if (opts.mode === 'find' || opts.mode === 'del') {
      if ((ko && (key === opts.key)) || (vo && (isEqual(val, opts.val))) || (!ko && !vo && (key === opts.key) && (isEqual(val, opts.val)))) {
        temp = {}
        temp.index = data.count
        temp.key = key
        if (existy(val)) {
          temp.val = val
        } else {
          temp.val = null
        }
        temp.path = clone(data.gatherPath)
        findings.push(temp)
      }
    }

    if (DEBUG || opts.mode === 'info') { console.log('-----------') }
    if (opts.mode === 'set' && data.count === opts.index) {
      return opts.val
    } else if (opts.mode === 'drop' && data.count === opts.index) {
      return NaN
    } else if (opts.mode === 'del' && ((ko && (key === opts.key)) || (vo && (isEqual(val, opts.val))) || (key === opts.key && isEqual(val, opts.val)))) {
      return NaN
    } else if (opts.mode === 'arrayFirstOnly') {
      if (existy(val) && Array.isArray(val)) {
        return [val[0]]
      } else if (existy(key) && Array.isArray(key)) {
        return [key[0]]
      } else {
        return existy(val) ? val : key
      }
    } else {
      return existy(val) ? val : key
    }
  })

  // returns
  if (opts.mode === 'get') {
    return data.finding
  } else if (opts.mode === 'find') {
    return findings.length > 0 ? findings : null
  } else {
    return input
  }
}

// -----------------------------------------------------------------------------
// Validate and prep all the options right here

function find (input, opts) {
  if (!existy(opts.key) && !existy(opts.val)) {
    throw new Error('ast-monkey/index.js/find(): Please provide opts.key or opts.val')
  }
  checkTypes(opts, null, {schema: {
    key: [null, 'string'],
    val: 'any'
  }})
  return monkey(input, objectAssign(clone(opts), { mode: 'find' }))
}

function get (input, opts) {
  if (!existy(opts.index)) {
    throw new Error('ast-monkey/index.js/get(): Please provide opts.index')
  }
  if (typeof opts.index === 'string') {
    if (isNaturalNumber(parseFloat(opts.index, 10), {includeZero: true})) {
      opts.index = parseInt(opts.index, 10)
    } else {
      console.log('*')
      throw new Error('ast-monkey/index.js/get(): opts.index must be a natural number. It was given as: ' + opts.index)
    }
  }
  checkTypes(opts, null, {schema: {
    index: 'number'
  }})
  return monkey(input, objectAssign(clone(opts), { mode: 'get' }))
}

function set (input, opts) {
  if (!existy(opts.key) && !existy(opts.val)) {
    throw new Error('ast-monkey/index.js/set(): Please provide opts.val')
  }
  if (!existy(opts.index)) {
    throw new Error('ast-monkey/index.js/set(): Please provide opts.index')
  }
  if (Number.isFinite(opts.index) && !isNaturalNumber(opts.index, {includeZero: true})) {
    throw new Error('ast-monkey/index.js/set(): opts.index is a wrong number, it must be a natural number. It was given as: ' + opts.index)
  }
  if (typeof opts.index === 'string') {
    if (isNaturalNumber(parseFloat(opts.index, 10), {includeZero: true})) {
      opts.index = parseInt(opts.index, 10)
    } else {
      throw new Error('ast-monkey/index.js/set(): opts.index must be a natural number. It was given as: ' + opts.index)
    }
  }
  if (existy(opts.key) && !existy(opts.val)) {
    opts.val = opts.key
  }
  checkTypes(opts, null, {schema: {
    key: [null, 'string'],
    val: 'any',
    index: 'number'
  }})
  return monkey(input, objectAssign(clone(opts), { mode: 'set' }))
}

function drop (input, opts) {
  if (!existy(opts.index)) {
    throw new Error('ast-monkey/index.js/drop(): Please provide opts.index')
  }
  if (typeof opts.index === 'string') {
    if (isNaturalNumber(parseFloat(opts.index, 10), {includeZero: true})) {
      opts.index = parseInt(opts.index, 10)
    } else {
      throw new Error('ast-monkey/index.js/drop(): opts.index must be a natural number. It was given as: ' + opts.index)
    }
  }
  return monkey(input, objectAssign(clone(opts), { mode: 'drop' }))
}

function info (input) {
  return monkey(input, { mode: 'info' })
}

function del (input, opts) {
  if (!existy(opts.key) && !existy(opts.val)) {
    throw new Error('ast-monkey/index.js/del(): Please provide opts.key or opts.val')
  }
  checkTypes(opts, null, {schema: {
    key: [null, 'string'],
    val: 'any'
  }})
  return monkey(input, objectAssign(clone(opts), { mode: 'del' }))
}

function arrayFirstOnly (input) {
  return monkey(input, { mode: 'arrayFirstOnly' })
}

// -----------------------------------------------------------------------------

module.exports = {
  find: find,
  get: get,
  set: set,
  drop: drop,
  info: info,
  del: del,
  arrayFirstOnly: arrayFirstOnly,
  traverse: traverse,
  existy: existy
}
