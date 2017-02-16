'use strict'
const isArr = Array.isArray
const isObj = require('lodash.isplainobject')
const isEqual = require('lodash.isequal')
const objectAssign = require('object-assign')
const DEBUG = false

// -----------------------------------------------------------------------------

function existy (x) { return x != null }

function traverse (innerObj, tree, callback) {
  var i, len, res, allKeys, key
  innerObj = objectAssign({depth: -1}, innerObj)
  innerObj.depth++
  if (isArr(tree)) {
    for (i = 0, len = tree.length; i < len; i++) {
      res = traverse(innerObj, callback(innerObj, tree[i]), callback)
      if (!existy(res)) {
        tree.splice(i, 1)
      } else {
        tree[i] = res
      }
    }
  } else if (isObj(tree)) {
    allKeys = Object.keys(tree)
    for (i = 0, len = allKeys.length; i < len; i++) {
      key = allKeys[i]
      res = traverse(innerObj, callback(innerObj, key, tree[key]), callback)
      if (!existy(res)) {
        delete tree[key]
      } else {
        tree[key] = res
      }
    }
  }
  return tree
}

// -----------------------------------------------------------------------------

function monkey (input, opts) {
  // precautions
  if (!existy(input)) {
    throw new Error('ast-monkey/index.js/monkey(): Please provide an input')
  }
  if ((opts.mode === 'get' || opts.mode === 'set') && !existy(opts.index)) {
    throw new Error('ast-monkey/index.js/monkey(): Please provide opts.index')
  }
  if (opts.mode === 'set' && !existy(opts.key) && !existy(opts.val)) {
    throw new Error('ast-monkey/index.js/monkey(): Please provide opts.val')
  }
  if (opts.mode === 'set' && existy(opts.key) && !existy(opts.val)) {
    opts.val = opts.key
  }
  if (opts.mode === 'find' && !existy(opts.key) && !existy(opts.val)) {
    throw new Error('ast-monkey/index.js/monkey(): Please provide opts.key or opts.val')
  }
  if (existy(opts.index) && (opts.index !== parseInt(opts.index, 10))) {
    opts.index = parseInt(opts.index, 10)
  }
  // ---------------------------------------------------------------------------
  // action

  if (DEBUG) { console.log('\n\n\n\n\n\n\n\n\n\nmode: ' + opts.mode) }
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

  if (DEBUG) { console.log('ORIGINAL INPUT:\ninput = ' + JSON.stringify(input, null, 4) + '\n========================') }
  if (DEBUG || opts.mode === 'info') { console.log('-----------') }
  input = traverse({}, input, function (innerObj, key, val) {
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
    } else if (opts.mode === 'find') {
      if ((ko && (key === opts.key)) || (vo && (isEqual(val, opts.val))) || (!ko && !vo && (key === opts.key) && (isEqual(val, opts.val)))) {
        if (DEBUG || opts.mode === 'info') { console.log('\n\nfound: ' + key + ' = ' + JSON.stringify(val, null, 4)) }
        temp = {}
        temp.key = key
        if (existy(val)) {
          temp.val = val
        } else {
          temp.val = null
        }
        temp.path = [...data.gatherPath]
        findings.push(temp)
      }
    }

    if (DEBUG || opts.mode === 'info') { console.log('-----------') }
    if (opts.mode === 'set' && data.count === opts.index) {
      return opts.val
    } else if (opts.mode === 'drop' && data.count === opts.index) {
      return null
    } else {
      return existy(val) ? val : key
    }
  })

  // returns
  if (opts.mode === 'info') {
    return
  } else if (opts.mode === 'get') {
    return data.finding
  } else if (opts.mode === 'set' || opts.mode === 'drop') {
    return input
  } else if (opts.mode === 'find') {
    return findings.length > 0 ? findings : null
  }
}

// -----------------------------------------------------------------------------

function prep (obj) {
  if (!existy(obj) || !isObj(obj)) {
    if (DEBUG) { console.log('prep() sets an empty object') }
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

// -----------------------------------------------------------------------------

module.exports = {
  find: find,
  get: get,
  set: set,
  drop: drop,
  info: info
}
