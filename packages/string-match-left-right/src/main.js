/* eslint default-case:0, consistent-return:0, max-len:0, no-mixed-operators:0, no-continue:0 */

import isNaturalNumber from 'is-natural-number'
import checkTypes from 'check-types-mini'
import isObj from 'lodash.isplainobject'
import arrayiffy from 'arrayiffy-if-string'

// const DEBUG = 0

function isStr(something) { return typeof something === 'string' }

// Uses 1xx range error codes.
// Returns the index number of the first character of "strToMatch". That's location
// within the input string, "str".
function marchForward(str, fromIndexInclusive, strToMatch, opts) {
  if (fromIndexInclusive <= str.length) {
    let charsToCheckCount = strToMatch.length
    // if (DEBUG) { console.log(`starting charsToCheckCount = ${JSON.stringify(charsToCheckCount, null, 4)}`) }
    for (let i = fromIndexInclusive, len = str.length; i < len; i++) {
      // if (DEBUG) { console.log(`${i}: >>${str[i]}<<`) }
      if (opts.trimBeforeMatching && str[i].trim() === '') {
        // if (DEBUG) { console.log('trimmed') }
        continue
      }
      if (
        (!opts.i && opts.trimCharsBeforeMatching.includes(str[i])) ||
        (
          opts.i && opts.trimCharsBeforeMatching
            .map(val => val.toLowerCase())
            .includes(str[i].toLowerCase())
        )
      ) {
        // if (DEBUG) { console.log('char in the skip list') }
        continue
      }
      if (
        (!opts.i && (str[i] === strToMatch[strToMatch.length - charsToCheckCount])) ||
        (opts.i && str[i].toLowerCase() === strToMatch[strToMatch.length - charsToCheckCount].toLowerCase())
      ) {
        charsToCheckCount -= 1
        if (charsToCheckCount === 0) {
          // if (DEBUG) { console.log(`THIS WAS THE LAST SYMBOL TO CHECK, ${strToMatch[strToMatch.length - 1]}`) }
          // if (DEBUG) { console.log(`i - strToMatch.length + 1 = ${JSON.stringify(i - strToMatch.length + 1, null, 4)}`) }
          return i - strToMatch.length + 1
        }

        // if (DEBUG) { console.log(`OK. Reduced charsToCheckCount to ${charsToCheckCount}`) }
      } else {
        // if (DEBUG) { console.log(`str[i = ${i}] = ${JSON.stringify(str[i], null, 4)}`) }
        // if (DEBUG) { console.log(`strToMatch[strToMatch.length - charsToCheckCount = ${strToMatch.length - charsToCheckCount}] = ${JSON.stringify(strToMatch[strToMatch.length - charsToCheckCount], null, 4)}`) }
        // if (DEBUG) { console.log('THEREFORE, returning false.') }
        return false
      }
      // if (DEBUG) { console.log(`* charsToCheckCount = ${JSON.stringify(charsToCheckCount, null, 4)}`) }
    }
    if (charsToCheckCount > 0) {
      // if (DEBUG) { console.log(`charsToCheckCount = ${JSON.stringify(charsToCheckCount, null, 4)}`) }
      // if (DEBUG) { console.log('THEREFORE, returning false.') }
      return false
    }
  } else if (opts.strictApi) {
    throw new Error(`string-match-left-right/marchForward(): [THROW_ID_102] second argument, fromIndexInclusive is ${fromIndexInclusive} beyond the input string length, ${str.length}.`)
  } else {
    return false
  }
}

// A helper. Uses 2xx range error codes.
function marchBackward(str, fromIndexInclusive, strToMatch, opts) {
  if (fromIndexInclusive >= str.length) {
    if (opts.strictApi) {
      throw new Error(`string-match-left-right/marchBackward(): [THROW_ID_203] second argument, starting index, should not be beyond the last character of the input string! Currently the first argument's last character's index is ${str.length} but the second argument is beyond it:\n${JSON.stringify(fromIndexInclusive, null, 4)}`)
    } else {
      return false
    }
  }
  let charsToCheckCount = strToMatch.length
  // if (DEBUG) { console.log(`starting charsToCheckCount = ${JSON.stringify(charsToCheckCount, null, 4)}`) }
  for (let i = fromIndexInclusive + 1; i--;) {
    // if (DEBUG) { console.log(`${i}: >>${str[i]}<<`) }
    if (opts.trimBeforeMatching && str[i].trim() === '') {
      // if (DEBUG) { console.log('trimmed') }
      continue
    }
    if (
      (!opts.i && opts.trimCharsBeforeMatching.includes(str[i])) ||
      (
        opts.i &&
        opts.trimCharsBeforeMatching
          .map(val => val.toLowerCase())
          .includes(str[i].toLowerCase())
      )
    ) {
      // if (DEBUG) { console.log('char in the skip list') }
      continue
    }
    if (
      (!opts.i && (str[i] === strToMatch[charsToCheckCount - 1])) ||
      (opts.i && (str[i].toLowerCase() === strToMatch[charsToCheckCount - 1].toLowerCase()))
    ) {
      charsToCheckCount -= 1
      if (charsToCheckCount === 0) {
        // if (DEBUG) { console.log('\nall chars matched so returning true\n') }
        return i
      }

      // if (DEBUG) { console.log(`OK. Reduced charsToCheckCount to ${charsToCheckCount}`) }
    } else {
      // if (DEBUG) { console.log(`str[i = ${i}] = ${JSON.stringify(str[i], null, 4)}`) }
      // if (DEBUG) { console.log(`strToMatch[strToMatch.length - charsToCheckCount = ${strToMatch.length - charsToCheckCount}] = ${JSON.stringify(strToMatch[strToMatch.length - charsToCheckCount], null, 4)}`) }
      // if (DEBUG) { console.log('THEREFORE, returning false.') }
      return false
    }
    // if (DEBUG) { console.log(`* charsToCheckCount = ${JSON.stringify(charsToCheckCount, null, 4)}`) }
  }
  if (charsToCheckCount > 0) {
    // if (DEBUG) { console.log(`charsToCheckCount = ${JSON.stringify(charsToCheckCount, null, 4)}`) }
    // if (DEBUG) { console.log('THEREFORE, returning false.') }
    return false
  }
}

// Real deal
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
    whatToMatch = originalWhatToMatch
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
    strictApi: true,
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

  let culpritsIndex
  let culpritsVal
  if (opts.trimCharsBeforeMatching.some((el, i) => {
    if (el.length > 1) {
      culpritsIndex = i
      culpritsVal = el
      return true
    }
    return false
  })) {
    throw new Error(`string-match-left-right/${mode}(): [THROW_ID_07] the fourth argument, options object contains trimCharsBeforeMatching. It was meant to list the single characters but one of the entries at index ${culpritsIndex} is longer than 1 character, ${culpritsVal.length} (equals to ${culpritsVal}). Please split it into separate characters and put into array as separate elements.`)
  }

  // action

  if (whatToMatch[0].length === 0) {
    if (opts.cb) {
      if (mode === 'matchLeft') {
        return opts.cb(
          str[position - 1],
          str.slice(0, position - 1),
          position - 1,
        )
      } else if (mode === 'matchLeftIncl') {
        return opts.cb(
          str[position],
          str.slice(0, position),
          position,
        )
      } else if (mode === 'matchRight') {
        return opts.cb(
          str[position + 1],
          str.slice(position + 1),
          position + 1,
        )
      } else if (mode === 'matchRightIncl') {
        return opts.cb(
          str[position],
          str.slice(position),
          position,
        )
      }
    }
    throw new Error(`string-match-left-right/${mode}(): [THROW_ID_08] the third argument, "whatToMatch", was given as an empty string. This means, you intend to match purely by a callback. The callback was not set though, the opts key "cb" is not set!`)
  }
  if (mode.startsWith('matchLeft')) {
    for (let i = 0, len = whatToMatch.length; i < len; i++) {
      const found = marchBackward(str, position - (mode === 'matchLeft' ? 1 : 0), whatToMatch[i], opts)
      if ((found !== false) && (opts.cb ? opts.cb(
        str[found - 1],
        str.slice(0, found),
        found - 1,
      ) : true)) {
        return whatToMatch[i]
      }
    }
    return false
  }
  // matchRight & matchRightIncl
  for (let i = 0, len = whatToMatch.length; i < len; i++) {
    const found = marchForward(str, position + (mode === 'matchRight' ? 1 : 0), whatToMatch[i], opts)
    if ((found !== false) && (opts.cb ? opts.cb(
      str[found + whatToMatch[i].length],
      str.slice(found + whatToMatch[i].length),
      found + whatToMatch[i].length,
    ) : true)) {
      return whatToMatch[i]
    }
  }
  return false
}

// External API functions

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

export { matchLeftIncl, matchRightIncl, matchLeft, matchRight }
