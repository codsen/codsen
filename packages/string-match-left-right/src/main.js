/* eslint default-case:0, consistent-return:0, max-len:0, no-mixed-operators:0 */

import isNaturalNumber from 'is-natural-number'
import checkTypes from 'check-types-mini'
import isObj from 'lodash.isplainobject'
import trimStart from 'lodash.trimstart'
import trimEnd from 'lodash.trimend'
import arrayiffy from 'arrayiffy-if-string'
import clone from 'lodash.clonedeep'

function isStr(something) { return typeof something === 'string' }

function main(mode, str, position, originalWhatToMatch, originalOpts) {
  function existy(x) { return x != null }
  const isArr = Array.isArray
  if (!isStr(str)) {
    throw new Error(`string-match-left-right/${mode}(): [THROW_ID_01] the first argument should be a string. Currently it's of a type: ${typeof str}, equal to:\n${JSON.stringify(str, null, 4)}`)
  } else if (str.length === 0) {
    throw new Error(`string-match-left-right/${mode}(): [THROW_ID_02] the first argument should be a non-empty string. Currently it's empty!`)
  }

  if (!isNaturalNumber(position, { includeZero: true })) {
    throw new Error(`string-match-left-right/${mode}(): [THROW_ID_03] the second argument should be a natural number. Currently it's of a type: ${typeof position}, equal to:\n${JSON.stringify(position, null, 4)}`)
  }
  let whatToMatch

  if (!existy(originalWhatToMatch)) {
    throw new Error(`string-match-left-right/${mode}(): [THROW_ID_04] Third argument, whatToMatch, is missing!`)
  }
  if (isStr(originalWhatToMatch)) {
    whatToMatch = [originalWhatToMatch]
  } else if (isArr(originalWhatToMatch)) {
    whatToMatch = clone(originalWhatToMatch)
  } else {
    throw new Error(`string-match-left-right/${mode}(): [THROW_ID_05] the third argument, whatToMatch, is neither string nor array of strings! It's ${typeof originalWhatToMatch}, equal to:\n${JSON.stringify(originalWhatToMatch, null, 4)}`)
  }

  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new Error(`string-match-left-right/${mode}(): [THROW_ID_06] the fourth argument, options object, should be a plain object. Currently it's of a type "${typeof originalOpts}", and equal to:\n${JSON.stringify(originalOpts, null, 4)}`)
  }
  const defaults = {
    i: false,
    trimBeforeMatching: false,
    trimCharsBeforeMatching: [],
  }
  const opts = Object.assign({}, defaults, originalOpts)
  opts.trimCharsBeforeMatching = arrayiffy(opts.trimCharsBeforeMatching)
  checkTypes(opts, defaults, {
    msg: 'string-match-left-right: [THROW_ID_07*]',
    schema: {
      cb: ['null', 'undefined', 'function'],
    },
  })
  opts.trimCharsBeforeMatching = opts
    .trimCharsBeforeMatching
    .map(el => (isStr(el) ? el : String(el)))

  let matchedElem
  switch (mode) {
    case 'matchLeftIncl':
      return whatToMatch.some((el) => {
        let temp
        if (opts.trimCharsBeforeMatching.length || opts.trimBeforeMatching) {
          temp = trimEnd(str.slice(0, position), opts.trimCharsBeforeMatching.length ? opts.trimCharsBeforeMatching.join('') : ' \n\t\r') + str[position]
        } else {
          temp = str.slice(0, position + 1)
        }
        if (opts.i) {
          if (
            temp.toLowerCase().endsWith(el.toLowerCase()) &&
            (opts.cb ? opts.cb(temp[temp.length - 1 - el.length], temp.slice(0, position - el.length + 1)) : true)
          ) {
            matchedElem = el
            return true
          }
          return false
        }
        if (
          temp.endsWith(el) &&
          (opts.cb ? opts.cb(temp[temp.length - 1 - el.length], temp.slice(0, position - el.length + 1)) : true)
        ) {
          matchedElem = el
          return true
        }
        return false
      }) ? matchedElem : false

    case 'matchLeft':
      return (whatToMatch.some((el) => {
        let temp
        if (opts.trimCharsBeforeMatching.length || opts.trimBeforeMatching) {
          temp = trimEnd(str.slice(0, position), opts.trimCharsBeforeMatching.length ? opts.trimCharsBeforeMatching.join('') : ' \n\t\r')
        } else {
          temp = str.slice(0, position)
        }
        if (opts.i) {
          if (
            temp.toLowerCase().endsWith(el.toLowerCase()) &&
            (opts.cb ? opts.cb(temp[temp.length - 1 - el.length], str.slice(0, position - el.length)) : true)
          ) {
            matchedElem = el
            return true
          }
          return false
        }
        if (
          (temp.endsWith(el)) &&
          (opts.cb ? opts.cb(temp[temp.length - 1 - el.length], str.slice(0, position - el.length)) : true)
        ) {
          matchedElem = el
          return true
        }
        return false
      })) ? matchedElem : false
    case 'matchRightIncl':
      return (whatToMatch.some((el) => {
        let temp
        if (opts.trimCharsBeforeMatching.length || opts.trimBeforeMatching) {
          temp = trimStart(
            str.slice(position),
            opts.trimCharsBeforeMatching.length ? opts.trimCharsBeforeMatching.join('') : ' \n\t\r',
          )
        } else {
          temp = str.slice(position)
        }
        if (opts.i) {
          if (
            (temp.toLowerCase().startsWith(el.toLowerCase())) &&
            (opts.cb ? opts.cb(temp[el.length], temp.slice(el.length)) : true)
          ) {
            matchedElem = el
            return true
          }
          return false
        }
        if (
          (temp.startsWith(el)) &&
          (opts.cb ? opts.cb(temp[el.length], temp.slice(el.length)) : true)
        ) {
          matchedElem = el
          return true
        }
        return false
      })) ? matchedElem : false
    case 'matchRight':
      return (whatToMatch.some((el) => {
        let temp
        if (opts.trimCharsBeforeMatching.length || opts.trimBeforeMatching) {
          temp = trimStart(str.slice(position + 1), opts.trimCharsBeforeMatching.length ? opts.trimCharsBeforeMatching.join('') : ' \n\t\r')
        } else {
          temp = str.slice(position + 1)
        }
        if (opts.i) {
          if (
            (temp.toLowerCase().startsWith(el.toLowerCase())) &&
            (opts.cb ? opts.cb(temp[el.length], temp.slice(el.length)) : true)
          ) {
            matchedElem = el
            return true
          }
          return false
        }
        if (
          (temp.startsWith(el)) &&
          (opts.cb ? opts.cb(temp[el.length], temp.slice(el.length)) : true)
        ) {
          matchedElem = el
          return true
        }
        return false
      })) ? matchedElem : false
  }
}

function matchLeftIncl(str, position, whatToMatch, opts) {
  return main('matchLeftIncl', str, position, whatToMatch, opts)
}

function matchLeft(str, position, whatToMatch, opts) {
  return main('matchLeft', str, position, whatToMatch, opts)
}

function matchRightIncl(str, position, whatToMatch, opts) {
  return main('matchRightIncl', str, position, whatToMatch, opts)
}

function matchRight(str, position, whatToMatch, opts) {
  return main('matchRight', str, position, whatToMatch, opts)
}

export {
  matchLeftIncl, matchRightIncl, matchLeft, matchRight,
}
