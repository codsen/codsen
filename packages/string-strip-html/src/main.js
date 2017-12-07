/* eslint prefer-destructuring:0, no-loop-func:0, max-len:0, no-continue:0 */

import replaceSlicesArr from 'string-replace-slices-array'
import Slices from 'string-slices-array-push'
import isObj from 'lodash.isplainobject'
import checkTypes from 'check-types-mini'
import trimChars from 'lodash.trim'
import { matchRight, matchRightIncl } from 'string-match-left-right'

function stripHtml(str, originalOpts) {
  function existy(x) { return x != null }
  const isArr = Array.isArray
  function isStr(something) { return typeof something === 'string' }
  function isNum(something) { return typeof something === 'number' }
  function tagName(char) {
    return char === '>' || char.trim() === ''
  }

  // vars
  const definitelyTagNames = [
    'abbr', 'address', 'area', 'article', 'aside', 'audio', 'base', 'bdi', 'bdo',
    'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col',
    'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div',
    'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html',
    'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link',
    'main', 'map', 'mark', 'math', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript',
    'object', 'ol', 'optgroup', 'option', 'output', 'param', 'picture', 'pre', 'progress',
    'rb', 'rp', 'rt', 'rtc', 'ruby', 'samp', 'script', 'section', 'select', 'slot',
    'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'svg',
    'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time',
    'title', 'tr', 'track', 'ul', 'var', 'video', 'wbr',
  ]
  const singleLetterTags = ['a', 'b', 'i', 'p', 'q', 's', 'u']
  const suspiciousList = ['=']
  const punctuation = ['.', ',', '!', '?', ';', ')', '\u2026', '"'] // \u2026 is &hellip - ellipsis
  const stripTogetherWithTheirContentsDefaults = ['script', 'style', 'xml']
  // ! also see opts.stripTogetherWithTheirContents array

  // validation
  if (typeof str !== 'string') {
    throw new TypeError(`string-strip-html/stripHtml(): [THROW_ID_01] Input must be string! Currently it's: ${typeof str}, equal to:\n${JSON.stringify(str, null, 4)}`)
  }
  if ((originalOpts !== undefined) && (originalOpts !== null) && !isObj(originalOpts)) {
    throw new TypeError(`string-strip-html/stripHtml(): [THROW_ID_02] Optional Options Object must be a plain object! Currently it's: ${typeof originalOpts}, equal to:\n${JSON.stringify(originalOpts, null, 4)}`)
  }

  // prep opts
  const defaults = {
    ignoreTags: [],
    stripTogetherWithTheirContents: stripTogetherWithTheirContentsDefaults,
  }
  const opts = Object.assign({}, defaults, originalOpts)
  checkTypes(opts, defaults, { msg: 'string-strip-html/stripHtml(): [THROW_ID_03*]' })
  if (
    !isArr(opts.stripTogetherWithTheirContents) ||
    opts.stripTogetherWithTheirContents.length === 0
  ) {
    opts.stripTogetherWithTheirContents = false
  }

  let somethingCaught
  if (
    opts.stripTogetherWithTheirContents &&
    isArr(opts.stripTogetherWithTheirContents) &&
    opts.stripTogetherWithTheirContents.length > 0 &&
    !opts.stripTogetherWithTheirContents.every((el, i) => {
      if (!isStr(el)) {
        somethingCaught.el = el
        somethingCaught.i = i
        return false
      }
      return true
    })
  ) {
    throw new TypeError(`string-strip-html/stripHtml(): [THROW_ID_04] Optional Options Object's key stripTogetherWithTheirContents was set to contain not just string elements! For example, element at index ${somethingCaught.i} has a value ${somethingCaught.el}.`)
  }

  // ---------------------------------------------------------------------------
  // step 0.
  // End sooner if it's an empty or empty-ish string:

  if ((str === '') || (str.trim() === '')) {
    // console.log('ENDING EARLY, empty input')
    return str
  }

  // ---------------------------------------------------------------------------
  // step 1.
  //
  // Thinking about the JS perf.
  //
  // We are not going to check each character, slicing and comparing against
  // opts.stripTogetherWithTheirContents contents.
  //
  // We are going to extract first letters' lower and upper index charAt() ranges
  // from opts.stripTogetherWithTheirContents
  //
  // it's so that we would be able to traverse the input character-by-character,
  // then quickly query current character's charAt() index, and compare, is it
  // within the range of whole tag first letter indexes.
  //
  // We do this to save calculation rounds slicing whole string and comparing.
  // For example, "whole" tags to be removed are "style" and "script".
  // Letter 'S'.charCodeAt(0) is 115.
  // This means, we can quickly test upon input traversal, is current character's
  // index equal to 115. If so, perform test slicing is next substring "cript" or "tyle"
  // (next letters after "script" and "style").
  //
  // This is opposed to gung-ho slicing and checking each single character of the
  // input, is it equal in whole to each of the elements in
  // opts.stripTogetherWithTheirContents
  //
  // Hardcoding the single index of defaults', "style" and "script",
  // the common first character, "s".

  let stripTogetherWithTheirContentsRange

  if (opts.stripTogetherWithTheirContents.join('') === stripTogetherWithTheirContentsDefaults.join('')) {
    stripTogetherWithTheirContentsRange = [115, 120] // letter "s".charCodeAt(0)
  } else {
    stripTogetherWithTheirContentsRange = opts.stripTogetherWithTheirContents
      .map(value => value.charAt(0)) // get first letters
      .reduce((res, val) => {
        if (val.charCodeAt(0) > res[1]) {
          return [res[0], val.charCodeAt(0)] // find the char index of the max char index out of all
        }
        if (val.charCodeAt(0) < res[0]) {
          return [val.charCodeAt(0), res[1]] // find the char index of the min char index out of all
        }
        return res
      }, [
        opts.stripTogetherWithTheirContents[0].charCodeAt(0), // base is the 1st char of 1st el.
        opts.stripTogetherWithTheirContents[0].charCodeAt(0),
      ])
    if (stripTogetherWithTheirContentsRange[0] === stripTogetherWithTheirContentsRange[1]) {
      stripTogetherWithTheirContentsRange = stripTogetherWithTheirContentsRange[0]
    }
  }
  // console.log(`stripTogetherWithTheirContentsRange = ${JSON.stringify(stripTogetherWithTheirContentsRange, null, 4)}\n\n\n`)

  // At this moment, stripTogetherWithTheirContentsRange is found and it's an
  // array or a natural number.

  // We'll use it to perform checks in step 2.

  // ---------------------------------------------------------------------------
  // step 2.

  // we'll manage the TO-DELETE string slice ranges using this class:
  const rangesToDelete = new Slices()
  // it comes from string-slices-array-push, see its API on GitHub or npm

  let state = 'normal'
  // state can be of a one of three kinds: 1) 'normal'; 2) 'sensitive'; 3) 'delete'

  // When normal is active, we don't think we currently traversing potentially
  // to-be-deleted characters.

  // When sensitive is active, there is probability that we might need to deleted
  // everything from last opening bracket to next closing bracket. Sensitive stage
  // is never reduced to "normal". "Sensitive" stage becomes "Delete" stage if
  // certain "freak out" rules are satisfied.

  // When delete flag is active, we definitely want to delete everything form last
  // opening bracket to the next closing bracket. "Delete" state is reset after
  // deletion is performed and becomes "normal".

  let deleteFromIndex = null
  let tagMightHaveStarted = false
  let matchedRangeTag = {}
  let i
  let len

  // traverse the string indexes
  for (i = 0, len = str.length; i < len; i++) {
    // console.log(`-------------------------------------------------------  ${str[i].trim().length > 0 ? str[i] : 'space'}  ----------------  ${i}`)

    // -----------------------------------------------------
    // catch the opening bracket, "<"
    if (str[i] === '<') {
      // * * *
      // * * *
      // * * *
      // * * *
      // the main flipping of a state
      if (
        (
          (opts.ignoreTags.length === 0) ||
          !matchRight(str, i, opts.ignoreTags, { cbRight: tagName, trimCharsBeforeMatching: ' \n\t\r/<', i: true })
        ) &&
        (
          matchedRangeTag.name ||
          (!matchedRangeTag.name && !tagMightHaveStarted)
        )
      ) {
        if (existy(str[i + 1]) && (str[i + 1].trim() === '')) {
          state = 'sensitive'
        } else {
          state = 'delete'
        }
        deleteFromIndex = i
      }

      // * * *
      // * * *
      // * * *
      // * * *
      // we need to track tag's outermost boundaries separately
      // from "state" because there might be consecutive brackets.
      if (!tagMightHaveStarted) {
        tagMightHaveStarted = true
      }
    } else

    // -----------------------------------------------------
    // catch the closing bracket, ">"
    if (str[i] === '>') {
      // reset the tagMightHaveStarted

      // we need to take care not to reset the tagMightHaveStarted when the
      // matchedRangeTag.name is set, meaning we are traversing in between
      // tags which should be deleted together with their content between the
      // tags.
      if (
        !matchedRangeTag.name &&
        tagMightHaveStarted &&
        !matchRight(str, i, '>', { trimCharsBeforeMatching: ' \n\t\r/' })
      ) {
        tagMightHaveStarted = false
      }

      // PS. to see the slice visually, use string.slice() method:
      // to see content with brackets: str.slice(deleteFromIndex, i + 1)
      // to see it without brackets: str.slice(deleteFromIndex + 1, i)
      if (
        (state === 'delete') &&
        (deleteFromIndex < i) &&
        !matchRight(str, i, '>', { trimCharsBeforeMatching: ' \n\t\r/' })
      ) {
        let deleteUpToIndex = i + 1
        let insertThisInPlace = ''

        // in case another HTML tag follows this, we need to include all the
        // white space leading to it as well.
        // Let's traverse the string to the right of the current index and check,
        // is there an opening bracket.
        for (let z = i + 1; z < len; z++) {
          if ((str[z].trim() !== '') && !matchedRangeTag.name) {
            if (str[z] === '<') {
              deleteUpToIndex = z
            } else if (
              (z === i + 1) &&
              !punctuation.includes(str[z]) &&
              (existy(str[deleteFromIndex - 1]) && (str[deleteFromIndex - 1].trim() !== ''))
            ) {
              insertThisInPlace = ' '
            }
            break
          }
        }

        rangesToDelete.add(deleteFromIndex, deleteUpToIndex, insertThisInPlace)
        // console.log(`! 258: added range for deletion: [${deleteFromIndex}, ${deleteUpToIndex}, '${insertThisInPlace}']`)
        // reset everything:
        state = 'normal'
      } else if (state === 'sensitive') {
        if (
          (deleteFromIndex + 1 < i) &&
          definitelyTagNames
            .concat(singleLetterTags)
            .includes(trimChars(str.slice(deleteFromIndex + 1, i).trim().toLowerCase(), ' /'))
        ) {
          // console.log(`* adding range: ${str.slice(deleteFromIndex, i + 1)}`)
          // console.log(`! str[deleteFromIndex] = ${JSON.stringify(str[deleteFromIndex], null, 4)}`)
          // console.log(`! str[i + 1] = ${JSON.stringify(str[i + 1], null, 4)}`)
          if (
            existy(str[deleteFromIndex - 1]) &&
            (str[deleteFromIndex - 1].trim() !== '') &&
            existy(str[i + 1]) &&
            (str[i + 1].trim() !== '') &&
            !punctuation.includes(str[i + 1])
          ) {
            // console.log('3')
            rangesToDelete.add(deleteFromIndex, i + 1, ' ')
            // console.log(`! 279: added range for deletion: [${deleteFromIndex}, ${i + 1}, ' ']`)
            state = 'normal'
          } else {
            // console.log('4')
            rangesToDelete.add(deleteFromIndex, i + 1)
            // console.log(`! 279: added range for deletion: [${deleteFromIndex}, ${i + 1}]`)
            state = 'normal'
          }
          state = 'normal'
        }
      }
    }

    // -----------------------------------------------------
    if (
      opts.stripTogetherWithTheirContents
    ) {
      //
      // case 1.
      // if the tag in question is among to be removed together with its contents,
      // and we already have matched and recorded the whereabouts of the opening
      // tag and we suspect this is its closing counterpart, check that and
      // delete the whole range if positive.

      if (
        matchedRangeTag.name
      ) {
        // console.log('1 = true')
      } else {
        // console.log('1 = false')
      }

      if (
        matchRightIncl(str, i, '<', { trimCharsBeforeMatching: ' \n\t\r' })
      ) {
        // console.log('2 = true')
      } else {
        // console.log('2 = false')
      }

      if (
        matchedRangeTag.name &&
        matchRight(str, i, matchedRangeTag.name, { cbRight: tagName, trimCharsBeforeMatching: ' \n\t\r/<' })
      ) {
        // console.log('3 = true')
      } else {
        // console.log('3 = false')
      }


      if (
        matchedRangeTag.name &&
        matchRightIncl(str, i, '<', { trimCharsBeforeMatching: ' \n\t\r' }) &&
        matchRight(str, i, matchedRangeTag.name, { cbRight: tagName, trimCharsBeforeMatching: ' \n\t\r/<' })
      ) {
        // console.log('* case #1')
        // console.log(`i = ${JSON.stringify(i, null, 4)}`)
        // first, traverse forward and add everything from matchedRangeTag.i upto closing
        // bracket for deletion
        for (let y = i; y < len; y++) {
          if (str[y] === '>') {
            // if there are spaces in right before and right after the to-be-deleted
            // range, we expand the range by one char to compensate for that
            // excessive whitespace that would otherwise result after deletion
            if (
              existy(str[matchedRangeTag.i - 2]) &&
              (str[matchedRangeTag.i - 2].trim() === '') &&
              existy(str[y + 1]) &&
              (str[y + 1].trim() === '')
            ) {
              rangesToDelete.add(matchedRangeTag.i - 2, y + 1) // expand to include space before
              // console.log(`! 350: added range for deletion: [${matchedRangeTag.i - 2}, ${y + 1}]`)
            } else if (
              // if it's too tight and there are no spaces surrounding the range:
              existy(str[matchedRangeTag.i - 2]) &&
              (str[matchedRangeTag.i - 2].trim() !== '') &&
              existy(str[y + 1]) &&
              (str[y + 1].trim() !== '') &&
              !matchRight(str, y, '<', { trimCharsBeforeMatching: ' \n\t\r/' })
            ) {
              rangesToDelete.add(matchedRangeTag.i - 1, y + 1, ' ') // add a space
              // console.log(`! 360: added range for deletion: [${matchedRangeTag.i - 1}, ${y + 1}, ' ']`)
              // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> row_322: ADDING A SPACE')
              // console.log(`str[matchedRangeTag.i - 2] = ${JSON.stringify(str[matchedRangeTag.i - 2], null, 4)}`)
              // console.log(`str[y + 1] = ${JSON.stringify(str[y + 1], null, 4)}`)
              // console.log(`str[y + 2] = ${JSON.stringify(str[y + 2], null, 4)}`)
            } else if (existy(matchedRangeTag.i)) {
              // We might need to trim even tighter if punctuation follows right immediately and there's whitespace in front. In such case we'd collapse all the whitespace in front if it's lowercase letter preceding that whitespace. For example, "This is text <div>remove me</div>." => "This is text." Not "This is text ."
              if (punctuation.includes(str[y + 1]) && str[matchedRangeTag.i - 2].trim() === '') {
                // console.log('***')
                for (let zzz = matchedRangeTag.i - 2; zzz--;) {
                  if (existy(str[zzz]) && str[zzz].trim() !== '') {
                    if (
                      (str[zzz].toLowerCase() !== str[zzz].toUpperCase()) && // is letter
                      str[zzz] === str[zzz].toLowerCase() // turning to lowercase result is the same thing
                    ) {
                      // delete whitespace in front
                      rangesToDelete.add(zzz + 1, y + 1)
                    } else {
                      // normal deletion range - bail, don't include the whitespace
                      rangesToDelete.add(matchedRangeTag.i - 1, y + 1) // just delete the range
                    }
                  } else {
                    // still delete but without whitespace
                    rangesToDelete.add(matchedRangeTag.i - 1, y + 1) // just delete the range
                  }
                  break
                }
              } else {
                rangesToDelete.add(matchedRangeTag.i - 1, y + 1) // just delete the range
                // console.log(`! 376: added range for deletion: [${matchedRangeTag.i - 1}, ${y + 1}]`)
              }
              // console.log(`str[y + 1]=${str[y + 1]}`)
              // console.log(`str[matchedRangeTag.i - 2]=>>>>${str[matchedRangeTag.i - 2]}<<<<`)
            }
            i = y - 1 // + 1
            // console.log(`i = ${JSON.stringify(i, null, 4)}`)
            matchedRangeTag = {}
            // console.log(`matchedRangeTag = ${JSON.stringify(matchedRangeTag, null, 4)}`)
            state = 'normal'
            deleteFromIndex = null
            // console.log(`state = ${JSON.stringify(state, null, 4)}`)
            break
          }
        }
        continue
      } else if (
        !matchedRangeTag.name && (
        //
        // case 2.
        // if no opening tags from the "whole-tag-pair-with-their-contents-to-delete"
        // list were detected yet, perform some checks based on efficient current
        // character's index comparison to save CPU rounds and make it run faster.
          (
            isArr(stripTogetherWithTheirContentsRange) &&
          (str[i].charCodeAt(0) >= stripTogetherWithTheirContentsRange[0]) &&
          (str[i].charCodeAt(0) <= stripTogetherWithTheirContentsRange[1])
          ) || (
            isNum(stripTogetherWithTheirContentsRange) &&
          (str[i].charCodeAt(0) === stripTogetherWithTheirContentsRange)
          )
        )) {
        // console.log('* case #2')
        if (opts.stripTogetherWithTheirContents.some((tag) => {
          // console.log(`checking tag: ${tag}`)
          if (matchRightIncl(str, i, tag, { cbRight: tagName, trimCharsBeforeMatching: ' \n\t\r/' })) {
            matchedRangeTag.name = tag
            matchedRangeTag.i = i
            // console.log(`\n\n\n\n\n!!!\n\nmatchedRangeTag = ${JSON.stringify(matchedRangeTag, null, 4)}`)
            // i += tag.length
            return true
          }
          return false
        })) {
          // console.log(`\n\n\n${matchedRangeTag.name} MATCHED! index = ${i}\n\n\n`)
        }
      }
    }

    // -----------------------------------------------------
    // catch characters that are red flags what means now, more than likely, it's
    // an HTML now. Normal text does not contain "suspicious characters" (such
    // as equals sign).
    if (suspiciousList.includes(str[i]) && (state === 'sensitive')) {
      state = 'delete'
    }

    // console.log(`\n\n* ended with state: ${state}`)
    // console.log(`* matchedRangeTag = ${JSON.stringify(matchedRangeTag, null, 4)}`)
    // console.log(`* ended with deleteFromIndex = ${deleteFromIndex}`)
    // console.log(`* ended with state = ${state}`)
  }

  // console.log(`FINAL rangesToDelete = ${JSON.stringify(rangesToDelete, null, 4)}`)
  if (rangesToDelete.current()) {
    return replaceSlicesArr(str, rangesToDelete.current()).trim()
  }
  return str
}

export { stripHtml as default }
