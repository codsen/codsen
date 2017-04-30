'use strict'
const isArr = Array.isArray
const clone = require('lodash.clonedeep')
const isObj = require('lodash.isplainobject')
const isEqual = require('lodash.isequal')
const objectAssign = require('object-assign')
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
          res = traverseInner(callback(tree[i], null, innerObj), callback, innerObj)
          if ((res === undefined) && (i < tree.length)) {
            tree.splice(i, 1)
            i--
          } else {
            tree[i] = res
          }
        }
      }
    } else if (isObj(tree)) {
      allKeys = Object.keys(tree)
      for (i = 0, len = allKeys.length; i < len; i++) {
        key = allKeys[i]
        if (innerObj.depth === 0 && existy(key)) {
          innerObj.topmostKey = key
        }
        res = traverseInner(callback(key, tree[key], innerObj), callback, innerObj)
        if (res === undefined) {
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

function monkey (inputOriginal, optsOriginal) {
  // since incoming argument is object, it's very important not to mutate it:
  var input = clone(inputOriginal)
  var opts = clone(optsOriginal)
  // -----------------------------------
  // precautions
  if (!existy(input)) {
    throw new Error('ast-monkey/index.js/monkey(): [THOW_ID_03] Please provide an input')
  }
  if ((opts.mode === 'get' || opts.mode === 'set' || opts.mode === 'drop') && !existy(opts.index)) {
    throw new Error('ast-monkey/index.js/monkey(): [THOW_ID_04] Please provide opts.index')
  }
  if ((opts.mode === 'set') && !existy(opts.key) && !existy(opts.val)) {
    throw new Error('ast-monkey/index.js/monkey(): [THOW_ID_05] Please provide opts.val')
  }
  if (opts.mode === 'set' && existy(opts.key) && !existy(opts.val)) {
    opts.val = opts.key
  }
  if ((opts.mode === 'find' || opts.mode === 'del') && !existy(opts.key) && !existy(opts.val)) {
    throw new Error('ast-monkey/index.js/monkey(): [THOW_ID_06] Please provide opts.key or opts.val')
  }
  if (existy(opts.index) && (opts.index !== parseInt(opts.index, 10))) {
    opts.index = parseInt(opts.index, 10)
  }
  // ---------------------------------------------------------------------------
  // action

  if (DEBUG || opts.mode === 'info') { console.log('mode: ' + opts.mode) }
  var data = { count: 0, gatherPath: [], finding: null }
  var findings = []

  opts.key = existy(opts.key) ? opts.key : null
  opts.val = existy(opts.val) ? opts.val : null
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
      return undefined
    } else if (opts.mode === 'del' && ((ko && (key === opts.key)) || (vo && (isEqual(val, opts.val))) || (key === opts.key && isEqual(val, opts.val)))) {
      return undefined
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

function prep (obj) {
  if (!existy(obj) || !isObj(obj)) {
    return {}
  } else {
    return obj
  }
}

// -----------------------------------------------------------------------------
// Methods lead to the same main function monkey(), only mode changes

function find (input, opts) {
  return monkey(input, objectAssign(prep(opts), { mode: 'find' }))
}
function get (input, opts) {
  return monkey(input, objectAssign(prep(opts), { mode: 'get' }))
}
function set (input, opts) {
  return monkey(input, objectAssign(prep(opts), { mode: 'set' }))
}
function drop (input, opts) {
  return monkey(input, objectAssign(prep(opts), { mode: 'drop' }))
}
function info (input, opts) {
  return monkey(input, objectAssign(prep(opts), { mode: 'info' }))
}
function del (input, opts) {
  return monkey(input, objectAssign(prep(opts), { mode: 'del' }))
}
function arrayFirstOnly (input, opts) {
  return monkey(input, objectAssign(prep(opts), { mode: 'arrayFirstOnly' }))
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
