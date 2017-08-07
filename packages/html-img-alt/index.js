'use strict'
const unfancy = require('string-unfancy')
const repl = require('string-replace-slices-array')
const Slices = require('string-slices-array-push')
const checkTypes = require('check-types-mini')
const isObj = require('lodash.isplainobject')

function alts (str, opts) {
  function existy (x) { return x != null }

  // validate
  // ================
  if (typeof str !== 'string') {
    throw new TypeError('html-img-alt/alts(): [THROW_ID_01] Input must be string! Currently its type is: ' + typeof str + ', equal to: ' + JSON.stringify(str, null, 4))
  }
  if (existy(opts) && !isObj(opts)) {
    throw new TypeError('html-img-alt/alts(): [THROW_ID_02] Options object must be a plain object! Currently its type is: ' + typeof opts + ', equal to: ' + JSON.stringify(opts, null, 4))
  }

  // vars
  // ================
  var DEBUG = 0
  var finalSpaceNeeded
  var withinImageTag = false
  var withinQuotes = false
  var imageTagStartedAt = 0
  var whitespaceStarted = 0
  var slashStartedAt = 0
  var altContentsStart = 0
  var withinAlt = false // marker to catch the beginning of the ALT attribute's value

  var thereShouldBeEqualCharacterHere = 0
  var thereShouldBeTheFirstDoubleQuoteHere = 0
  var thereShouldBeTheSecondDoubleQuoteHere = 0
  var addSpaceInTheFutureBeforeSlashOrBracket = false

  var altBegins = null
  var rangesArr = new Slices()

  // plausibleWithinQuotesRanges - some ranges should be included only if they are
  // not within double quotes. However, there can be cases when double quotes are
  // not closed - there's single double quote and after some whitespace there's
  // closing bracket. In this case, the condition "within double quotes" is false
  // regarding characters that follow that first unclosed double quote.
  // This is the temporary array which houses such "plausible" ranges.
  var plausibleWithinQuotesRanges = new Slices()

  // opts
  // ================
  var defaults = {
    unfancyTheAltContents: true
  }
  opts = Object.assign(Object.assign({}, defaults), opts)
  checkTypes(opts, defaults, {msg: 'html-img-alt/alts(): [THROW_ID_03]'})

  // traverse the string
  // ================
  for (let i = 0, len = str.length; i < len; i++) {
    if (DEBUG) { console.log(`------------------------------------------------------------------\n\nstr[${i}]= ${str[i].trim() === '' ? 'space' : str[i]}\n`) }

    // catch the beginning of the IMG tag:
    // ================
    if (`${str[i]}${str[i + 1]}${str[i + 2]}${str[i + 3]}` === '<img') {
      if (!withinImageTag) {
        withinImageTag = true
        imageTagStartedAt = i
      } else {
        throw new TypeError('html-img-alt/alts(): [THROW_ID_02] Something is wrong with the code - there\'s an image tag within an image tag. First image tag was: ' + str.slice(imageTagStartedAt - 20, imageTagStartedAt + 20) + ', then before it was closed, we\'ve got this: ' + str.slice(i - 20, i + 20))
      }

      // console.log('!!! 91 SETTING finalSpaceNeeded = true')
      // finalSpaceNeeded = true
    }

    // catch closing slash
    // ================
    if (withinImageTag && (str[i] === '/')) {
      if (DEBUG) { console.log('!!! setting slashStartedAt = ' + i) }
      slashStartedAt = i
    }

    // catch the ALT attributes within IMG tags:
    // ================
    if (
      withinImageTag &&
      !withinQuotes
    ) {
      if (`${str[i]}${str[i + 1]}${str[i + 2]}` === 'alt') {
        altBegins = i
        if (DEBUG) { console.log('\n\n!!! setting altBegins = ' + altBegins) }
      } else if (`${str[i - 3]}${str[i - 2]}${str[i - 1]}` === 'alt') {
        withinAlt = true // this flag is necessary only until we catch the first
        // double quote of the alt attribute
      }
    }

    // turn off the withinAlt flag
    // this flag lets through whitespace, "=" and double quotes.
    // This paves the way for the future, when within double quote detection
    // we'll see this withinAlt flag, we'll know it's alt attribute contents starting.
    // ================
    if (
      withinAlt &&
      (
        (str[i].trim() !== '') && (str[i] !== '=') && (str[i] !== '"')
      )
    ) {
      withinAlt = false
    }

    // catch missing equal after ALT attr:
    // ================
    if (altBegins && (i === (altBegins + 3))) {
      // altContentsStart = i
      thereShouldBeEqualCharacterHere = i
    }

    // catch equal character after alt:
    // ================
    if (str[i] === '=') {
      if (altBegins) {
        // turn off the equal character search flag
        thereShouldBeEqualCharacterHere = 0
        thereShouldBeTheFirstDoubleQuoteHere = i + 1
      }

      // equal sign wipes and plausible ranges. Plausibles are possible when
      // first double quote is inclosed, and closing bracket follows.
      // If there's equal character, this means another attribute is mingling,
      // which negates the case.
      if (plausibleWithinQuotesRanges.current() && plausibleWithinQuotesRanges.current().length) {
        if (DEBUG) { console.log('!!! wiping plausibleWithinQuotesRanges') }
        plausibleWithinQuotesRanges.wipe()
      }

      // if double quote follows this equal sign, and we are "withinQuotes",
      // turn off withinQuotes.
      // This is a precaution against broken code, like unit test 06.01:
      // `zzz<img alt="  class="" />zzz`
      //
      if (withinQuotes && (str[i + 1] === '"')) {
        withinQuotes = false
        altContentsStart = 0
      }
    }

    // whitespace ends - this section must be above "catch the closing IMG tag" section.
    // it's dependent upon (still) existing `slashStartedAt` which latter section deletes
    // ================
    if (whitespaceStarted && (str[i].trim() !== '')) {
      if (DEBUG) { console.log('!!! whitespace ends') }
      // put up excessive whitespace for deletion

      if (DEBUG) { console.log('!!! withinQuotes = ' + JSON.stringify(withinQuotes, null, 4)) }
      if (whitespaceStarted < (i - 1 + (((str[i] === '>') || (str[i] === '\'') || slashStartedAt || thereShouldBeEqualCharacterHere || thereShouldBeTheFirstDoubleQuoteHere || thereShouldBeTheSecondDoubleQuoteHere) ? 1 : 0))) {
        if (!withinQuotes) {
          if (DEBUG) { console.log(`!!! add no.1.1 - adding whitespace to rangesArr: [${whitespaceStarted}, ${i - 1 + (((str[i] === '>') || (str[i] === '\'') || slashStartedAt || thereShouldBeEqualCharacterHere || thereShouldBeTheFirstDoubleQuoteHere || thereShouldBeTheSecondDoubleQuoteHere) ? 1 : 0)}]`) }

          rangesArr.add(whitespaceStarted, i - 1 + (((str[i] === '>') || (str[i] === '\'') || slashStartedAt || thereShouldBeEqualCharacterHere || thereShouldBeTheFirstDoubleQuoteHere || thereShouldBeTheSecondDoubleQuoteHere) ? 1 : 0))
        } else {
          if (DEBUG) { console.log(`!!! add no.1.2 - adding whitespace to plausibleWithinQuotesRanges: [${whitespaceStarted}, ${i - 1 + (((str[i] === '>') || (str[i] === '\'') || slashStartedAt || thereShouldBeEqualCharacterHere || thereShouldBeTheFirstDoubleQuoteHere || thereShouldBeTheSecondDoubleQuoteHere) ? 1 : 0)}]`) }

          plausibleWithinQuotesRanges.add(whitespaceStarted, i - 1 + (((str[i] === '>') || (str[i] === '\'') || slashStartedAt || thereShouldBeEqualCharacterHere || thereShouldBeTheFirstDoubleQuoteHere || thereShouldBeTheSecondDoubleQuoteHere) ? 1 : 0))
        }

        if ((str[i] === '>') || (str[i] === '/')) {
          // missingTrailingSpace = ' '
          if (DEBUG) { console.log('!!! 92 SETTING finalSpaceNeeded = true') }
          addSpaceInTheFutureBeforeSlashOrBracket = true
        }

        if (
          (thereShouldBeEqualCharacterHere && (str[i] !== '=') && (i >= thereShouldBeEqualCharacterHere)) ||
          (thereShouldBeTheFirstDoubleQuoteHere && (str[i] !== '"') && (i >= thereShouldBeTheFirstDoubleQuoteHere))
        ) {
          let missingTrailingSpace = ''
          let location = thereShouldBeEqualCharacterHere || thereShouldBeTheFirstDoubleQuoteHere

          let thingToAdd = ''
          if (thereShouldBeEqualCharacterHere) {
            thingToAdd += '='
          }
          if (DEBUG) { console.log('!!! add no.2 - adding ="" at location:' + location) }
          if (!withinQuotes) {
            rangesArr.add(location, location, thingToAdd + '""' + missingTrailingSpace)
          } // else {
            // it might be that first double quote in alt=" is unclosed, and closing bracket follows.
            // that's why we add such range into a separate "plausibles" ranges list,
            // which would get merged into regular rangesArr in case second double quote is
            // never found.
            // plausibleWithinQuotesRanges.add(location, location, thingToAdd + '""' + missingTrailingSpace)
          // }
          thereShouldBeEqualCharacterHere = 0
          thereShouldBeTheFirstDoubleQuoteHere = 0
        }
      }

      whitespaceStarted = 0
    }

    // catch the state of being inside double quotes:
    // ================

    if (str[i] === '"') {
      withinQuotes = !withinQuotes
      if (i === thereShouldBeTheFirstDoubleQuoteHere) {
        thereShouldBeTheSecondDoubleQuoteHere = i + 1
      }
    }

    // calculate the logic regarding missing double quotes recognition
    // ================
    if (str[i] === '"') {
      if (thereShouldBeTheFirstDoubleQuoteHere && (i >= thereShouldBeTheFirstDoubleQuoteHere)) {
        if (DEBUG) { console.log('!!! TRUE for: i >= thereShouldBeTheFirstDoubleQuoteHere') }
        thereShouldBeTheSecondDoubleQuoteHere = thereShouldBeTheFirstDoubleQuoteHere
        thereShouldBeTheFirstDoubleQuoteHere = 0

        // set the marker altContentsStart
        if (withinAlt) {
          altContentsStart = i + 1
          withinAlt = false
        }

        // also, if the character after first double quote is closing slash (XHTML)
        // or closing bracket (HTML), add a missing space in front of it:
        if ((str[i + 1].trim() === '/') || (str[i + 1].trim() === '>')) {
          if (DEBUG) { console.log('!!! Adding empty space on i + 1 = ' + (i + 1)) }
          addSpaceInTheFutureBeforeSlashOrBracket = true
          if (DEBUG) { console.log('!!! 93 SETTING finalSpaceNeeded = false') }
          finalSpaceNeeded = false
        }
      } else if (thereShouldBeTheSecondDoubleQuoteHere && (i >= thereShouldBeTheSecondDoubleQuoteHere)) {
        if (DEBUG) { console.log('!!! TRUE for: i >= thereShouldBeTheSecondDoubleQuoteHere') }
        // If double quotes are closed properly, wipe the plausibles
        // that practically means we don't delete the whitespace within double quotes.
        // however, rogue unclosed double quote might throw us off track, hence
        // this contraption with plausible ranges.
        // We catch plausible ranges and keep until double quote is closed.
        // If it is never closed, all those ranges are merged into rangesArr for deletion.
        if (DEBUG) { console.log('!!! wiping plausibleWithinQuotesRanges') }
        plausibleWithinQuotesRanges.wipe()
        thereShouldBeTheSecondDoubleQuoteHere = 0

        // if the following character is closing slash (XHTML) or closing bracket (HTML),
        // add space in front of it
        if ((str[i + 1] === '>') || (str[i + 1] === '/')) {
          addSpaceInTheFutureBeforeSlashOrBracket = true
          if (DEBUG) { console.log('!!! 94 SETTING finalSpaceNeeded = false') }
          finalSpaceNeeded = false
        }

        // reset altContentsStart
        if (DEBUG) { console.log('!!! ALT TAG CONTENTS: >>>' + str.slice(altContentsStart, i) + `<<< (${str.slice(altContentsStart, i).length})`) }

        if (altContentsStart && opts.unfancyTheAltContents) {
          let altContents = str.slice(altContentsStart, i)
          if (unfancy(altContents).trim() !== altContents) {
            rangesArr.add(altContentsStart, i, unfancy(altContents).trim())
          }
        }
        altContentsStart = 0
      }
    }

    // catch single quotes
    // ================
    if (withinImageTag && !withinQuotes && (str[i] === '\'')) {
      if (DEBUG) { console.log('!!! putting up a rogue single quote for deletion') }
      rangesArr.add(i, i + 1)
      if ((str[i + 1] === '/') || (str[i + 1] === '>')) {
        addSpaceInTheFutureBeforeSlashOrBracket = true
      }
    }

    // catch the closing IMG tag and perform all the tasks
    // ================
    if (withinImageTag && (str[i] === '>')) {
      if (DEBUG) { console.log('!!! complete img tag: ' + str.slice(imageTagStartedAt, i + 1)) }
      if (DEBUG) { console.log('!!! thereShouldBeTheFirstDoubleQuoteHere = ' + JSON.stringify(thereShouldBeTheFirstDoubleQuoteHere, null, 4)) }
      if (DEBUG) { console.log('!!! thereShouldBeTheSecondDoubleQuoteHere = ' + JSON.stringify(thereShouldBeTheSecondDoubleQuoteHere, null, 4)) }

      imageTagStartedAt = 0
      withinQuotes = false

      // add ALT attr if missing:
      if (altBegins === null) {
        if (DEBUG) { console.log('NO ALT ATTR!') }
        if (DEBUG) { console.log('slashStartedAt = ' + JSON.stringify(slashStartedAt, null, 4)) }
        if (slashStartedAt) {
          // XHTML.
          if (DEBUG) { console.log('!!! add no.3 - adding >>>alt="" <<< at slashStartedAt=' + slashStartedAt) }
          rangesArr.add(slashStartedAt, slashStartedAt, ' alt="" ')
        } else {
          // HTML.
          if (DEBUG) { console.log('!!! add no.4 - adding >>> alt="" <<< at i=' + i) }
          rangesArr.add(i, i, ' alt="" ')
        }
        if (DEBUG) { console.log('!!! 95 SETTING finalSpaceNeeded = false') }
        finalSpaceNeeded = false
        addSpaceInTheFutureBeforeSlashOrBracket = false
      }

      if (!slashStartedAt && (thereShouldBeEqualCharacterHere === i)) {
        // if ALT has no equal and is right before closing bracket
        // HTML
        if (DEBUG) { console.log('!!! add no.5 - adding >>>="" <<< at i=' + i) }
        rangesArr.add(i, i, '="" ')
        if (DEBUG) { console.log('!!! 96 SETTING finalSpaceNeeded = false') }
        finalSpaceNeeded = false
      } else if (slashStartedAt && (thereShouldBeEqualCharacterHere === (i - 1))) {
        // if ALT has no equal and is right before closing bracket
        // XHTML
        if (DEBUG) { console.log('!!! add no.6 - adding >>>="" <<< at i-1=' + i - 1) }
        rangesArr.add(i - 1, i - 1, '="" ')
        if (DEBUG) { console.log('!!! 97 SETTING finalSpaceNeeded = false') }
        finalSpaceNeeded = false
      }

      if (!slashStartedAt && thereShouldBeTheFirstDoubleQuoteHere && (thereShouldBeTheFirstDoubleQuoteHere <= i)) {
        // HTML
        if (DEBUG) { console.log('!!! add no.7 - adding >>>="" <<< at i=' + i) }
        rangesArr.add(i, i, '"" ')
        addSpaceInTheFutureBeforeSlashOrBracket = false
      } else if (slashStartedAt && thereShouldBeTheFirstDoubleQuoteHere && (thereShouldBeTheFirstDoubleQuoteHere <= i)) {
        // XHTML
        if (DEBUG) { console.log('!!! add no.8 - adding >>>="" <<< at i-1=' + i - 1) }
        rangesArr.add(i - 1, i - 1, '"" ')
        addSpaceInTheFutureBeforeSlashOrBracket = false
      } else if (!slashStartedAt && thereShouldBeTheSecondDoubleQuoteHere && (thereShouldBeTheSecondDoubleQuoteHere <= i)) {
        if (DEBUG) { console.log('!!! add no.9 - adding the missing double quote before HTML closing bracket') }
        // HTML
        rangesArr.add(i, i, '"')
        if (DEBUG) { console.log('* rangesArr.current() = ' + JSON.stringify(rangesArr.current(), null, 4)) }
        addSpaceInTheFutureBeforeSlashOrBracket = true
        // so if the second double quote is missing, merge in the plausible ranges, if any
        if (DEBUG) { console.log('!!! merging in plausibleWithinQuotesRanges') }

        // and now the actual merging of plausible ranges:
        if (plausibleWithinQuotesRanges.current()) {
          plausibleWithinQuotesRanges.current().forEach(key => {
            rangesArr.add(key[0], key[1], key[2])
          })
        }

        // after merging in, clean up the ranges
        rangesArr.current()
        // .current will mutate the ranges in the memory, cleaning, merging,
        // normalising them.

        plausibleWithinQuotesRanges.wipe()
      } else if (slashStartedAt && thereShouldBeTheSecondDoubleQuoteHere && (thereShouldBeTheSecondDoubleQuoteHere <= i)) {
        if (DEBUG) { console.log('!!! add no.10 - adding the missing double quote before XHTML closing slash') }
        // XHTML

        // if (DEBUG) { console.log('\n!!! str[thereShouldBeTheSecondDoubleQuoteHere] = ' + JSON.stringify(str[thereShouldBeTheSecondDoubleQuoteHere], null, 4)) }
        // if (DEBUG) { console.log('str[thereShouldBeTheSecondDoubleQuoteHere + 1] = ' + JSON.stringify(str[thereShouldBeTheSecondDoubleQuoteHere + 1], null, 4)) }
        rangesArr.add(thereShouldBeTheSecondDoubleQuoteHere + 1, thereShouldBeTheSecondDoubleQuoteHere + 1, '"')
        if (DEBUG) { console.log('UPDATED rangesArr.current(): ' + JSON.stringify(rangesArr.current(), null, 4)) }

        // so if the second double quote is missing, merge in the plausible ranges, if any
        if (plausibleWithinQuotesRanges.current()) {
          plausibleWithinQuotesRanges.current().forEach(key => {
            rangesArr.add(key[0], key[1], key[2])
          })
        }
        plausibleWithinQuotesRanges.wipe()

        // after merging in, clean up the ranges
        rangesArr.current()
        // .current will mutate the ranges in the memory, cleaning, merging,
        // normalising them.
      } // else if ((str[i - 1].trim() !== '') && (str[i - 1] !== '/')) {
      //   if (DEBUG) { console.log('!!! add no.11 - adding the missing space before HTML closing bracket') }
      //   if (finalSpaceNeeded) {
      //     rangesArr.add(i, i, ' ')
      //   }
      //   if (DEBUG) { console.log('!!! 98 SETTING finalSpaceNeeded = false') }
      //   finalSpaceNeeded = false
      // }

      if (finalSpaceNeeded || addSpaceInTheFutureBeforeSlashOrBracket) {
        if (slashStartedAt) {
          if (DEBUG) { console.log('!!! add no.12.1 - FINAL - adding missing space at slashStartedAt (XHTML)') }
          rangesArr.add(slashStartedAt, slashStartedAt, ' ')
        } else {
          if (DEBUG) { console.log('!!! add no.12.2 - FINAL - adding missing space at i (HTML)') }
          rangesArr.add(i, i, ' ')
        }
        if (DEBUG) { console.log('new rangesArr: ' + JSON.stringify(rangesArr.current(), null, 4)) }
      }

      withinImageTag = false
      altBegins = null
      thereShouldBeTheFirstDoubleQuoteHere = 0
      thereShouldBeTheSecondDoubleQuoteHere = 0
      finalSpaceNeeded = false
    }

    // any non-empty space character ends the closing slash flag.
    // we don't want anything deleted after slash if it's not closing-slash but content

    // REVIEW slashStartedAt, probably needs more rules to make the case more precise
    if (slashStartedAt && (str[i] !== '/') && (str[i].trim() !== '')) {
      if (DEBUG) { console.log('\n!!! setting slashStartedAt,\naltContentsStart,\nthereShouldBeEqualCharacterHere,\nthereShouldBeTheFirstDoubleQuoteHere,\nthereShouldBeTheSecondDoubleQuoteHere\nall to zero\n') }
      slashStartedAt = 0
      // altContentsStart = 0
      thereShouldBeEqualCharacterHere = 0
      thereShouldBeTheFirstDoubleQuoteHere = 0
      thereShouldBeTheSecondDoubleQuoteHere = 0
    }

    // whitespace starts
    // ================
    if (withinImageTag && (str[i].trim() === '') && !whitespaceStarted) {
      whitespaceStarted = i
    }

    // delete the slash marker if something different from whitespace or
    // closing bracket follows it.
    // if (slashStartedAt && (slashStartedAt < i) && (str[i].trim() !== '') && (str[i] !== '>')) {
    //   if (DEBUG) { console.log('\n!!! resetting slashStartedAt to zero because something else than whitespace or closing bracket was detected: ' + str[i]) }
    //   slashStartedAt = 0
    // }

    // ================================================================
    // ================================================================

    if (DEBUG) { console.log('') }
    if (whitespaceStarted) {
      if (DEBUG) { console.log('!!! whitespaceStarted = ' + JSON.stringify(whitespaceStarted, null, 4)) }
    }
    if (DEBUG) { console.log('* withinImageTag = ' + withinImageTag) }
    if (DEBUG) { console.log('* altBegins = ' + JSON.stringify(altBegins, null, 4)) }
    if (DEBUG) { console.log('* slashStartedAt = ' + JSON.stringify(slashStartedAt, null, 4)) }
    if (DEBUG) { console.log('* thereShouldBeEqualCharacterHere = ' + JSON.stringify(thereShouldBeEqualCharacterHere, null, 4)) }
    if (DEBUG) { console.log('* thereShouldBeTheFirstDoubleQuoteHere = ' + JSON.stringify(thereShouldBeTheFirstDoubleQuoteHere, null, 4)) }
    if (DEBUG) { console.log('* thereShouldBeTheSecondDoubleQuoteHere = ' + JSON.stringify(thereShouldBeTheSecondDoubleQuoteHere, null, 4)) }
    if (DEBUG) { console.log('* withinQuotes = ' + JSON.stringify(withinQuotes, null, 4)) }
    if (DEBUG) { console.log('* addSpaceInTheFutureBeforeSlashOrBracket = ' + JSON.stringify(addSpaceInTheFutureBeforeSlashOrBracket, null, 4)) }
    if (DEBUG) { console.log('* finalSpaceNeeded = ' + JSON.stringify(finalSpaceNeeded, null, 4)) }
    if (DEBUG) { console.log('* withinAlt = ' + JSON.stringify(withinAlt, null, 4)) }
    if (DEBUG) { console.log('* altContentsStart = ' + JSON.stringify(altContentsStart, null, 4)) }

    if (DEBUG) { console.log('\n* rangesArr.current() = ' + JSON.stringify(rangesArr.current(), null, 4)) }
    if (DEBUG) { console.log('* plausibleWithinQuotesRanges.current() = ' + JSON.stringify(plausibleWithinQuotesRanges.current(), null, 4)) }
  }

  // crunch all the slices from rangesArr:
  // ================
  if (DEBUG) { console.log('\n\n\n=============\n\nFINAL rangesArr.current() = ' + JSON.stringify(rangesArr.current(), null, 4) + '\n\n\n\n\n\n') }
  if (existy(rangesArr.current()) && rangesArr.current().length > 0) {
    str = repl(str, rangesArr.current())
  }

  // TODO unfancy the ALT tag contents:
  // ================
  // TODO - port this to inline traversal and put only what's necessary onto rangesArr
  // str = str.replace(/alt="[^"]*"/g, el => unfancy(el))

  return str
}

module.exports = alts
