/* eslint default-case:0, consistent-return:0, max-len:0, no-mixed-operators:0, no-continue:0 */

import isNaturalNumber from 'is-natural-number'
import checkTypes from 'check-types-mini'
import isObj from 'lodash.isplainobject'
import arrayiffy from 'arrayiffy-if-string'
import { isHighSurrogate, isLowSurrogate } from 'string-character-is-astral-surrogate'

const DEBUG = 0

function existy(x) { return x != null }
function isStr(something) { return typeof something === 'string' }

function isAstral(char) {
  if (typeof char !== 'string') { return false }
  return (char.charCodeAt(0) >= 55296) && (char.charCodeAt(0) <= 57343)
}

// A helper f(). Uses 1xx range error codes.
// Returns the index number of the first character of "strToMatch". That's location
// within the input string, "str".
function marchForward(str, fromIndexInclusive, strToMatch, opts) {
  if (DEBUG) { console.log(`20 marchForward: ${`\u001b[${33}m${'fromIndexInclusive'}\u001b[${39}m`} = ${JSON.stringify(fromIndexInclusive, null, 4)}`) }

  if (fromIndexInclusive <= str.length) {
    let charsToCheckCount = strToMatch.length
    if (DEBUG) { console.log(`27 starting ${`\u001b[${33}m${'charsToCheckCount'}\u001b[${39}m`} = ${JSON.stringify(charsToCheckCount, null, 4)}`) }
    for (let i = fromIndexInclusive, len = str.length; i < len; i++) {
      if (DEBUG) { console.log(`\u001b[${36}m${`================================== str[${i}] = ${str[i]}`}\u001b[${39}m`) }
      let current = str[i]

      // FIY, high surrogate goes first, low goes second
      // if it's first part of the emoji, glue the second part onto this:
      if (isHighSurrogate(str[i]) && isLowSurrogate(str[i + 1])) {
        // and if it is, glue second onto first-one
        if (DEBUG) { console.log(`36 \u001b[${33}m${'low surrogate on the right added'}\u001b[${39}m`) }
        current = str[i] + str[i + 1]
      }
      // alternatively, if somehow the starting index was given in the middle,
      // between heads and tails surrogates of this emoji, and we're on the tails
      // already, check for presence of heads in front and glue that if present:
      if (isLowSurrogate(str[i]) && isHighSurrogate(str[i - 1])) {
        // and if it is, glue second onto first-one
        if (DEBUG) { console.log(`44 \u001b[${33}m${'high surrogate on the left added'}\u001b[${39}m`) }
        current = str[i - 1] + str[i]
      }

      if (DEBUG) { console.log(`48 ${`\u001b[${33}m${'current'}\u001b[${39}m`} = ${JSON.stringify(current, null, 4)}`) }
      if (opts.trimBeforeMatching && str[i].trim() === '') {
        if (DEBUG) { console.log(`50 \u001b[${31}m${'trimmed'}\u001b[${39}m`) }
        continue
      }
      if (
        (!opts.i && opts.trimCharsBeforeMatching.includes(current)) ||
        (
          opts.i && opts.trimCharsBeforeMatching
            .map(val => val.toLowerCase())
            .includes(current.toLowerCase())
        )
      ) {
        if (DEBUG) { console.log('61 char in the skip list') }
        if (current.length === 2) {
          // if it was emoji, offset by two
          i += 1
        }
        continue
      }

      let whatToCompareTo = strToMatch[strToMatch.length - charsToCheckCount]
      if (
        isHighSurrogate(whatToCompareTo) &&
        existy(strToMatch[strToMatch.length - charsToCheckCount + 1]) &&
        isLowSurrogate(strToMatch[strToMatch.length - charsToCheckCount + 1])
      ) {
        whatToCompareTo = strToMatch[strToMatch.length - charsToCheckCount] + strToMatch[strToMatch.length - charsToCheckCount + 1]
      }

      if (DEBUG) { console.log(`78 ${`\u001b[${33}m${'whatToCompareTo'}\u001b[${39}m`} = ${JSON.stringify(whatToCompareTo, null, 4)}`) }
      if (
        (!opts.i && (current === whatToCompareTo)) ||
        (opts.i && current.toLowerCase() === whatToCompareTo.toLowerCase())
      ) {
        charsToCheckCount -= current.length // normally 1, but
        // if it's emoji, it can be 2

        if (charsToCheckCount < 1) {
          if (DEBUG) { console.log(`87 THIS WAS THE LAST SYMBOL TO CHECK, ${current}`) }
          // if (DEBUG) { console.log(`88 i - strToMatch.length + 1 = ${JSON.stringify(i - strToMatch.length + 1, null, 4)}`) }
          if (DEBUG) { console.log(`89 ${`\u001b[${33}m${'i'}\u001b[${39}m`} = ${JSON.stringify(i, null, 4)}`) }
          if (DEBUG) { console.log(`90 ${`\u001b[${33}m${'strToMatch.length'}\u001b[${39}m`} = ${JSON.stringify(strToMatch.length, null, 4)}`) }

          let aboutToReturn = i - strToMatch.length + current.length

          if (DEBUG) { console.log(`94 ${`\u001b[${33}m${'aboutToReturn'}\u001b[${39}m`} = ${JSON.stringify(aboutToReturn, null, 4)}`) }
          // Now, before returning result index, we need to take care of one specific
          // case.
          // If somehow the starting index was given in the middle of astral character,
          // algorithm would treat that as index at the beginning of the character.
          // However, at this point, result is that index in the middle.
          // We need to check and offset the index to be also at the beginning here.
          if (
            (aboutToReturn >= 0) &&
            isLowSurrogate(str[aboutToReturn]) &&
            existy(str[aboutToReturn - 1]) &&
            isHighSurrogate(str[aboutToReturn - 1])
          ) {
            if (DEBUG) { console.log(`107 ${`\u001b[${33}m${'aboutToReturn --1, now = '}\u001b[${39}m`} = ${JSON.stringify(aboutToReturn, null, 4)}`) }
            aboutToReturn -= 1
          }

          return aboutToReturn >= 0 ? aboutToReturn : 0
        }

        if (DEBUG) { console.log(`98 OK. Reduced charsToCheckCount to ${charsToCheckCount}`) }
        if (
          (current.length === 2) &&
          isHighSurrogate(str[i])
        ) {
          // if it was emoji, offset by two
          i += 1
        }
      } else {
        if (DEBUG) { console.log(`104 str[i = ${i}] = ${JSON.stringify(str[i], null, 4)}`) }
        if (DEBUG) { console.log(`105 strToMatch[strToMatch.length - charsToCheckCount = ${strToMatch.length - charsToCheckCount}] = ${JSON.stringify(strToMatch[strToMatch.length - charsToCheckCount], null, 4)}`) }
        if (DEBUG) { console.log('106 THEREFORE, returning false.') }
        return false
      }
      if (DEBUG) { console.log(`109 * charsToCheckCount = ${JSON.stringify(charsToCheckCount, null, 4)}`) }
    }
    if (charsToCheckCount > 0) {
      if (DEBUG) { console.log(`112 charsToCheckCount = ${JSON.stringify(charsToCheckCount, null, 4)}`) }
      if (DEBUG) { console.log('113 THEREFORE, returning false.') }
      return false
    }
  } else if (opts.strictApi) {
    throw new Error(`string-match-left-right/marchForward(): [THROW_ID_102] second argument, fromIndexInclusive is ${fromIndexInclusive} beyond the input string length, ${str.length}.`)
  } else {
    return false
  }
}

// A helper f(). Uses 2xx range error codes.
function marchBackward(str, fromIndexInclusive, strToMatch, opts) {
  if (DEBUG) { console.log(`\n115 \u001b[${35}m${'CALLED marchBackward()'}\u001b[${39}m`) }
  if (DEBUG) { console.log(`116 ${`\u001b[${33}m${'fromIndexInclusive'}\u001b[${39}m`} = ${JSON.stringify(fromIndexInclusive, null, 4)}`) }
  if (DEBUG) { console.log(`117 ${`\u001b[${33}m${'strToMatch'}\u001b[${39}m`} = ${JSON.stringify(strToMatch, null, 4)}`) }
  if (fromIndexInclusive >= str.length) {
    if (opts.strictApi) {
      throw new Error(`string-match-left-right/marchBackward(): [THROW_ID_203] second argument, starting index, should not be beyond the last character of the input string! Currently the first argument's last character's index is ${str.length} but the second argument is beyond it:\n${JSON.stringify(fromIndexInclusive, null, 4)}`)
    } else {
      if (DEBUG) { console.log('122 Instead of throw THROW_ID_203, returning false, because index is out of range and opts.strictApi is off') }
      return false
    }
  }
  let charsToCheckCount = strToMatch.length
  if (DEBUG) { console.log(`127 starting charsToCheckCount = ${JSON.stringify(charsToCheckCount, null, 4)}`) }

  for (let i = fromIndexInclusive + 1; i--;) {
    if (DEBUG) { console.log(`130 ${`\u001b[${36}m${'=================================='}\u001b[${39}m`} ${i}: >>${str[i]}<< [${str[i].charCodeAt(0)}]`) }
    if (DEBUG && str[i - 1]) { console.log(`107 ${i - 1}: >>${str[i - 1]}<< [${str[i - 1].charCodeAt(0)}]`) }
    if (opts.trimBeforeMatching && str[i].trim() === '') {
      if (DEBUG) { console.log('133 trimmed') }
      continue
    }
    let currentCharacter = str[i]
    if (isLowSurrogate(str[i]) && isHighSurrogate(str[i - 1])) {
      currentCharacter = str[i - 1] + str[i]
      if (DEBUG) { console.log(`139 ${`\u001b[${33}m${'currentCharacter'}\u001b[${39}m`} = ${JSON.stringify(currentCharacter, null, 4)}`) }
    } else if (isHighSurrogate(str[i]) && isLowSurrogate(str[i + 1])) {
      currentCharacter = str[i] + str[i + 1]
    }
    if (DEBUG) { console.log(`143 \u001b[${32}m${'currentCharacter'}\u001b[${39}m = ${currentCharacter}`) }
    if (DEBUG) { console.log(`144 ${`\u001b[${33}m${'opts.trimCharsBeforeMatching'}\u001b[${39}m`} = ${JSON.stringify(opts.trimCharsBeforeMatching, null, 4)}`) }
    if (DEBUG) { console.log(`145 ${`\u001b[${33}m${'opts.trimCharsBeforeMatching.includes(currentCharacter)'}\u001b[${39}m`} = ${JSON.stringify(opts.trimCharsBeforeMatching.includes(currentCharacter), null, 4)}`) }
    if (
      (!opts.i && opts.trimCharsBeforeMatching.includes(currentCharacter)) ||
      (
        opts.i &&
        opts.trimCharsBeforeMatching
          .map(val => val.toLowerCase())
          .includes(currentCharacter.toLowerCase())
      )
    ) {
      if (DEBUG) { console.log('155 char is in the skip list') }
      if (currentCharacter.length === 2) {
        // if it was emoji, offset by two
        i -= 1
      }
      continue
    }
    if (DEBUG) { console.log(`162 ${`\u001b[${33}m${'charsToCheckCount'}\u001b[${39}m`} = ${JSON.stringify(charsToCheckCount, null, 4)}`) }
    if (DEBUG) { console.log(`163 ${strToMatch[charsToCheckCount - 1]}`) }
    if (DEBUG) { console.log(`164 ${strToMatch[charsToCheckCount - 2]}${strToMatch[charsToCheckCount - 1]}`) }

    let charToCompareAgainst = strToMatch[charsToCheckCount - 1]
    if (isLowSurrogate(charToCompareAgainst)) {
      // this means current strToMatch ends with emoji
      charToCompareAgainst = `${strToMatch[charsToCheckCount - 2]}${strToMatch[charsToCheckCount - 1]}`
      if (DEBUG) { console.log(`170 ${`\u001b[${33}m${'charToCompareAgainst'}\u001b[${39}m`} = ${JSON.stringify(charToCompareAgainst, null, 4)}`) }
      charsToCheckCount -= 1
      i -= 1
    }

    if (DEBUG) { console.log(`\n* 175 \u001b[${31}m${'currentCharacter'}\u001b[${39}m = ${currentCharacter}`) }
    if (DEBUG) { console.log(`* 176 \u001b[${31}m${'charToCompareAgainst'}\u001b[${39}m = ${charToCompareAgainst}`) }
    if (
      (!opts.i && (currentCharacter === charToCompareAgainst)) ||
      (opts.i && (currentCharacter.toLowerCase() === charToCompareAgainst.toLowerCase()))
    ) {
      charsToCheckCount -= 1
      if (charsToCheckCount < 1) {
        if (DEBUG) { console.log(`183 all chars matched so returning i = ${i}; charsToCheckCount = ${charsToCheckCount}`) }
        return i >= 0 ? i : 0
      }

      if (DEBUG) { console.log(`187 ${`\u001b[${32}m${`OK. Reduced charsToCheckCount to ${charsToCheckCount}`}\u001b[${39}m`}`) }
    } else {
      if (DEBUG) { console.log(`189 str[i = ${i}] = ${JSON.stringify(str[i], null, 4)}`) }
      if (DEBUG) { console.log(`190 strToMatch[strToMatch.length - charsToCheckCount = ${strToMatch.length - charsToCheckCount}] = ${JSON.stringify(strToMatch[strToMatch.length - charsToCheckCount], null, 4)}`) }
      if (DEBUG) { console.log('191 THEREFORE, returning false.') }
      return false
    }
    if (DEBUG) { console.log(`194 * charsToCheckCount = ${JSON.stringify(charsToCheckCount, null, 4)}`) }
  }
  if (charsToCheckCount > 0) {
    if (DEBUG) { console.log(`197 charsToCheckCount = ${JSON.stringify(charsToCheckCount, null, 4)}`) }
    if (DEBUG) { console.log('198 THEREFORE, returning false.') }
    return false
  }
}

// Real deal
function main(mode, str, position, originalWhatToMatch, originalOpts) {
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

  if (isStr(originalWhatToMatch)) {
    whatToMatch = [originalWhatToMatch]
  } else if (isArr(originalWhatToMatch)) {
    whatToMatch = originalWhatToMatch
  } else if (!existy(originalWhatToMatch)) {
    whatToMatch = ['']
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
    if ((el.length > 1) && !isAstral(el)) {
      culpritsIndex = i
      culpritsVal = el
      return true
    }
    return false
  })) {
    throw new Error(`string-match-left-right/${mode}(): [THROW_ID_07] the fourth argument, options object contains trimCharsBeforeMatching. It was meant to list the single characters but one of the entries at index ${culpritsIndex} is longer than 1 character, ${culpritsVal.length} (equals to ${culpritsVal}). Please split it into separate characters and put into array as separate elements.`)
  }

  // action

  // CASE 1. If it's driven by callback-only, the 3rd input argument, what to look
  // for - is falsey - empty string within array (or not), OR given null

  if (!existy(whatToMatch) || (isArr(whatToMatch) && existy(whatToMatch[0]) && (whatToMatch[0].length === 0))) {
    if (opts.cb) {
      let firstCharOutsideIndex
      if (mode === 'matchLeft') {
        for (let y = position; y--;) {
          if (
            (
              !opts.trimBeforeMatching ||
              (
                opts.trimBeforeMatching &&
                str[y] !== undefined &&
                str[y].trim() !== ''
              )
            ) && (
              (opts.trimCharsBeforeMatching.length === 0) ||
              (
                str[y] !== undefined &&
                !opts.trimCharsBeforeMatching.includes(str[y])
              )
            )
          ) {
            firstCharOutsideIndex = y
            break
          }
        }
      } else if (mode === 'matchLeftIncl') {
        for (let y = position + 1; y--;) {
          if (
            opts.trimBeforeMatching &&
            str[y].trim() === ''
          ) {
            continue
          }
          if (opts.trimCharsBeforeMatching.includes(str[y])) {
            continue
          }
          firstCharOutsideIndex = y
          break
        }
      } else if (mode === 'matchRight') {
        for (let y = position + 1; y < str.length; y++) {
          if (
            (
              !opts.trimBeforeMatching ||
              (
                opts.trimBeforeMatching &&
                str[y].trim() !== ''
              )
            ) && (
              (opts.trimCharsBeforeMatching.length === 0) ||
              !opts.trimCharsBeforeMatching.includes(str[y])
            )
          ) {
            firstCharOutsideIndex = y
            break
          }
        }
      } else if (mode === 'matchRightIncl') {
        for (let y = position; y < str.length; y++) {
          if (
            (
              !opts.trimBeforeMatching ||
              (
                opts.trimBeforeMatching &&
                str[y].trim() !== ''
              )
            ) && (
              (opts.trimCharsBeforeMatching.length === 0) ||
              !opts.trimCharsBeforeMatching.includes(str[y])
            )
          ) {
            firstCharOutsideIndex = y
            break
          }
        }
      }
      if (firstCharOutsideIndex === undefined) {
        return false
      }

      if (mode.startsWith('matchLeft')) {
        return opts.cb(
          str[firstCharOutsideIndex],
          str.slice(0, firstCharOutsideIndex + 1),
          firstCharOutsideIndex,
        )
      }
      // ELSE matchRight & matchRightIncl
      return opts.cb(
        str[firstCharOutsideIndex],
        str.slice(firstCharOutsideIndex),
        firstCharOutsideIndex,
      )
    }
    let extraNote = ''
    if (!existy(originalOpts)) {
      extraNote = ' More so, the whole options object, the fourth input argument, is missing!'
    }
    throw new Error(`string-match-left-right/${mode}(): [THROW_ID_08] the third argument, "whatToMatch", was given as an empty string. This means, you intend to match purely by a callback. The callback was not set though, the opts key "cb" is not set!${extraNote}`)
  }

  // Case 2. Normal operation where callback may or may not be present, but it is
  // only accompanying the matching of what was given in 3rd input argument.
  // Then if 3rd arg's contents were matched, callback is checked and its Boolean
  // result is merged using logical "AND" - meaning both have to be true to yield
  // final result "true".

  if (mode.startsWith('matchLeft')) {
    for (let i = 0, len = whatToMatch.length; i < len; i++) {
      if (DEBUG) { console.log('\n\n\n🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥') }
      if (DEBUG) { console.log(`whatToMatch no. ${i} = ${whatToMatch[i]}`) }
      if (DEBUG) { console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥') }
      let startingPosition = position
      if (mode === 'matchLeft') {
        // Depends if the current character is surrogate.
        // Imagine, you've got blue hat emoji: \uD83E\uDDE2 to the left of your
        // current character at current index. In order to "jump left by one character"
        // you have to subtract the index by two, not by one.
        //
        if ( // if preceding two characters exist and make a surrogate pair
          isAstral(str[i - 1]) &&
          isAstral(str[i - 2])
        ) {
          startingPosition -= 2
        } else {
          startingPosition -= 1
        }
      }
      if (DEBUG) { console.log(`371 \u001b[${33}m${'marchBackward() called with:'}\u001b[${39}m\n* startingPosition = ${JSON.stringify(startingPosition, null, 4)}\n* whatToMatch[${i}] = ${JSON.stringify(whatToMatch[i], null, 4)}\n`) }
      const found = marchBackward(str, startingPosition, whatToMatch[i], opts)
      if (DEBUG) { console.log(`373 \u001b[${33}m${'found'}\u001b[${39}m = ${JSON.stringify(found, null, 4)}`) }
      // now, the "found" is the index of the first character of what was found.
      // we need to calculate the character to the left of it, which might be emoji
      // so its first character might be either "minus one index" (normal character)
      // or "minus two indexes" (emoji). Let's calculate that:

      let indexOfTheCharacterInFront
      let fullCharacterInFront
      let restOfStringInFront = ''
      if (existy(found) && found > 0) {
        indexOfTheCharacterInFront = found - 1
        fullCharacterInFront = str[indexOfTheCharacterInFront]
        restOfStringInFront = str.slice(0, found)
      }

      if (
        isLowSurrogate(str[indexOfTheCharacterInFront]) &&
        existy(str[indexOfTheCharacterInFront - 1]) &&
        isHighSurrogate(str[indexOfTheCharacterInFront - 1])
      ) {
        if (DEBUG) { console.log('391 the character in front is low surrogate') }
        indexOfTheCharacterInFront -= 1
        fullCharacterInFront = str[indexOfTheCharacterInFront - 1] + str[indexOfTheCharacterInFront]
        if (DEBUG) { console.log(`${`\u001b[${33}m${'fullCharacterInFront'}\u001b[${39}m`} = ${JSON.stringify(fullCharacterInFront, null, 4)}`) }
      }
      if (
        isHighSurrogate(str[indexOfTheCharacterInFront]) &&
        existy(str[indexOfTheCharacterInFront + 1]) &&
        isLowSurrogate(str[indexOfTheCharacterInFront + 1])
      ) {
        if (DEBUG) { console.log('400 adding low surrogate to str[indexOfTheCharacterInFront]') }
        fullCharacterInFront = str[indexOfTheCharacterInFront] + str[indexOfTheCharacterInFront + 1]
        if (DEBUG) { console.log(`${`\u001b[${33}m${'fullCharacterInFront'}\u001b[${39}m`} = ${JSON.stringify(fullCharacterInFront, null, 4)}`) }
        restOfStringInFront = str.slice(0, indexOfTheCharacterInFront + 2)
      }

      if (indexOfTheCharacterInFront < 0) {
        indexOfTheCharacterInFront = undefined
      }

      if ((found !== false) && (opts.cb ? opts.cb(
        fullCharacterInFront,
        restOfStringInFront,
        indexOfTheCharacterInFront,
      ) : true)) {
        return whatToMatch[i]
      }
    }
    return false
  }
  // ELSE - matchRight & matchRightIncl
  for (let i = 0, len = whatToMatch.length; i < len; i++) {
    if (DEBUG) { console.log('\n\n\n🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥') }
    if (DEBUG) { console.log(`whatToMatch no. ${i} = ${whatToMatch[i]}`) }
    if (DEBUG) { console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥') }

    let startingPosition = position + (mode === 'matchRight' ? 1 : 0)
    // compensate for emoji, since if currently we've sat upon emoji,
    // we need to add not one but two to reference the "character on the right"
    if (DEBUG) { console.log(`345 \u001b[${32}m${'startingPosition'}\u001b[${39}m = ${startingPosition}`) }
    if (
      (mode === 'matchRight') &&
        (
          isHighSurrogate(str[startingPosition - 1]) &&
          isLowSurrogate(str[startingPosition])
        )
    ) {
      startingPosition += 1
      if (DEBUG) { console.log(`354 +1: \u001b[${32}m${'startingPosition'}\u001b[${39}m = ${startingPosition}`) }
    }

    const found = marchForward(str, startingPosition, whatToMatch[i], opts)
    if (DEBUG) { console.log(`469 ${`\u001b[${33}m${'found'}\u001b[${39}m`} = ${JSON.stringify(found, null, 4)}`) }

    let indexOfTheCharacterAfter
    let fullCharacterAfter
    if (
      existy(found) &&
      existy(str[found + whatToMatch[i].length])
    ) {
      indexOfTheCharacterAfter = found + whatToMatch[i].length
      fullCharacterAfter = str[indexOfTheCharacterAfter]

      // fixes for emoji:
      // if the next character is high surrogate, add its counterpart
      if (
        isHighSurrogate(str[indexOfTheCharacterAfter]) &&
        isLowSurrogate(str[indexOfTheCharacterAfter + 1])
      ) {
        fullCharacterAfter = str[indexOfTheCharacterAfter] + str[indexOfTheCharacterAfter + 1]
      }
    }

    if (DEBUG) { console.log(`\n474 ${`\u001b[${33}m${'fullCharacterAfter'}\u001b[${39}m`} = ${JSON.stringify(fullCharacterAfter, null, 4)}`) }
    if (DEBUG) { console.log(`475 ${`\u001b[${33}m${'indexOfTheCharacterAfter'}\u001b[${39}m`} = ${JSON.stringify(indexOfTheCharacterAfter, null, 4)}\n`) }

    if ((found !== false) && (opts.cb ? opts.cb(
      fullCharacterAfter,
      existy(indexOfTheCharacterAfter) ? str.slice(indexOfTheCharacterAfter) : '',
      indexOfTheCharacterAfter,
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
