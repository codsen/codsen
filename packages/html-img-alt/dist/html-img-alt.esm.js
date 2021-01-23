/**
 * html-img-alt
 * Adds missing alt attributes to img tags. Non-parsing.
 * Version: 2.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/html-img-alt/
 */

import { unfancy } from 'string-unfancy';
import { rApply } from 'ranges-apply';
import { Ranges } from 'ranges-push';
import { checkTypesMini } from 'check-types-mini';

var version = "2.0.0";

const version$1 = version;

function isObj(something) {
  return something && typeof something === "object" && !Array.isArray(something);
}

function alts(str, originalOpts) {
  // validate
  // ================
  if (typeof str !== "string") {
    throw new TypeError(`html-img-alt/alts(): [THROW_ID_01] Input must be string! Currently its type is: ${typeof str}, equal to: ${JSON.stringify(str, null, 4)}`);
  }

  if (originalOpts && !isObj(originalOpts)) {
    throw new TypeError(`html-img-alt/alts(): [THROW_ID_02] Options object must be a plain object! Currently its type is: ${typeof originalOpts}, equal to: ${JSON.stringify(originalOpts, null, 4)}`);
  } // vars
  // ================


  let finalSpaceNeeded;
  let withinImageTag = false;
  let withinQuotes = false;
  let imageTagStartedAt = 0;
  let whitespaceStarted = 0;
  let slashStartedAt = 0;
  let altContentsStart = 0;
  let withinAlt = false; // marker to catch the beginning of the ALT attribute's value

  let thereShouldBeEqualCharacterHere = 0;
  let thereShouldBeTheFirstDoubleQuoteHere = 0;
  let thereShouldBeTheSecondDoubleQuoteHere = 0;
  let addSpaceInTheFutureBeforeSlashOrBracket = false;
  let altBegins = null;
  const rangesArr = new Ranges(); // plausibleWithinQuotesRanges - some ranges should be included only if they are
  // not within double quotes. However, there can be cases when double quotes are
  // not closed - there's single double quote and after some whitespace there's
  // closing bracket. In this case, the condition "within double quotes" is false
  // regarding characters that follow that first unclosed double quote.
  // This is the temporary array which houses such "plausible" ranges.

  const plausibleWithinQuotesRanges = new Ranges(); // opts
  // ================

  const defaults = {
    unfancyTheAltContents: true
  };
  const opts = { ...defaults,
    ...originalOpts
  };
  checkTypesMini(opts, defaults, {
    msg: "html-img-alt/alts(): [THROW_ID_03]"
  }); // traverse the string
  // ================

  for (let i = 0, len = str.length; i < len; i++) {
    str[i].charCodeAt(0); // catch the beginning of the IMG tag:
    // ================

    if (`${str[i]}${str[i + 1]}${str[i + 2]}${str[i + 3]}` === "<img") {
      if (!withinImageTag) {
        withinImageTag = true;
        imageTagStartedAt = i;
      } else {
        throw new TypeError(`html-img-alt/alts(): [THROW_ID_02] Something is wrong with the code - there's an image tag within an image tag. First image tag was: ${str.slice(imageTagStartedAt - 20, imageTagStartedAt + 20)}, then before it was closed, we've got this: ${str.slice(i - 20, i + 20)}`);
      } // console.log('!!! 096 SETTING finalSpaceNeeded = true')
      // finalSpaceNeeded = true

    } // catch closing slash
    // ================


    if (withinImageTag && str[i] === "/") {
      slashStartedAt = i;
    } // catch the ALT attributes within IMG tags:
    // ================


    if (withinImageTag && !withinQuotes) {
      if (`${str[i]}${str[i + 1]}${str[i + 2]}` === "alt") {
        altBegins = i;
      } else if (`${str[i - 3]}${str[i - 2]}${str[i - 1]}` === "alt") {
        withinAlt = true; // this flag is necessary only until we catch the first
        // double quote of the alt attribute
      }
    } // turn off the withinAlt flag
    // this flag lets through whitespace, "=" and double quotes.
    // This paves the way for the future, when within double quote detection
    // we'll see this withinAlt flag, we'll know it's alt attribute contents starting.
    // ================


    if (withinAlt && str[i].trim() !== "" && str[i] !== "=" && str[i] !== '"') {
      withinAlt = false;
    } // catch missing equal after ALT attr:
    // ================


    if (altBegins && i === altBegins + 3) {
      // altContentsStart = i
      thereShouldBeEqualCharacterHere = i;
    } // catch equal character after alt:
    // ================


    if (str[i] === "=") {
      if (altBegins) {
        // turn off the equal character search flag
        thereShouldBeEqualCharacterHere = 0;
        thereShouldBeTheFirstDoubleQuoteHere = i + 1;
      } // equal sign wipes and plausible ranges. Plausibles are possible when
      // first double quote is inclosed, and closing bracket follows.
      // If there's equal character, this means another attribute is mingling,
      // which negates the case.


      if (plausibleWithinQuotesRanges.current() && plausibleWithinQuotesRanges.current().length) {
        plausibleWithinQuotesRanges.wipe();
      } // if double quote follows this equal sign, and we are "withinQuotes",
      // turn off withinQuotes.
      // This is a precaution against broken code, like unit test 06.01:
      // `zzz<img alt="  class="" />zzz`
      //


      if (withinQuotes && str[i + 1] === '"') {
        withinQuotes = false;
        altContentsStart = 0;
      }
    } // whitespace ends - this section must be above "catch the closing IMG tag" section.
    // it's dependent upon (still) existing `slashStartedAt` which latter section deletes
    // ================


    if (whitespaceStarted && str[i].trim() !== "") { // put up excessive whitespace for deletion

      if (whitespaceStarted < i - 1 + (str[i] === ">" || str[i] === "'" || slashStartedAt || thereShouldBeEqualCharacterHere || thereShouldBeTheFirstDoubleQuoteHere || thereShouldBeTheSecondDoubleQuoteHere ? 1 : 0)) {
        if (!withinQuotes) {
          rangesArr.add(whitespaceStarted, i - 1 + (str[i] === ">" || str[i] === "'" || slashStartedAt || thereShouldBeEqualCharacterHere || thereShouldBeTheFirstDoubleQuoteHere || thereShouldBeTheSecondDoubleQuoteHere ? 1 : 0));
        } else {
          plausibleWithinQuotesRanges.add(whitespaceStarted, i - 1 + (str[i] === ">" || str[i] === "'" || slashStartedAt || thereShouldBeEqualCharacterHere || thereShouldBeTheFirstDoubleQuoteHere || thereShouldBeTheSecondDoubleQuoteHere ? 1 : 0));
        }

        if (str[i] === ">" || str[i] === "/") {
          // missingTrailingSpace = ' '
          addSpaceInTheFutureBeforeSlashOrBracket = true;
        }

        if (thereShouldBeEqualCharacterHere && str[i] !== "=" && i >= thereShouldBeEqualCharacterHere || thereShouldBeTheFirstDoubleQuoteHere && str[i] !== '"' && i >= thereShouldBeTheFirstDoubleQuoteHere) {
          const missingTrailingSpace = "";
          const location = thereShouldBeEqualCharacterHere || thereShouldBeTheFirstDoubleQuoteHere;
          let thingToAdd = "";

          if (thereShouldBeEqualCharacterHere) {
            thingToAdd += "=";
          }

          if (!withinQuotes) {
            rangesArr.add(location, location, `${thingToAdd}""${missingTrailingSpace}`);
          } // else {
          // it might be that first double quote in alt=" is unclosed, and closing bracket follows.
          // that's why we add such range into a separate "plausibles" ranges list,
          // which would get merged into regular rangesArr in case second double quote is
          // never found.
          // plausibleWithinQuotesRanges.add(
          //   location, location, thingToAdd + '""' + missingTrailingSpace
          // )
          // }


          thereShouldBeEqualCharacterHere = 0;
          thereShouldBeTheFirstDoubleQuoteHere = 0;
        }
      }

      whitespaceStarted = 0;
    } // catch the state of being inside double quotes:
    // ================


    if (str[i] === '"') {
      withinQuotes = !withinQuotes;

      if (i === thereShouldBeTheFirstDoubleQuoteHere) {
        thereShouldBeTheSecondDoubleQuoteHere = i + 1;
      }
    } // calculate the logic regarding missing double quotes recognition
    // ================


    if (str[i] === '"') {
      if (thereShouldBeTheFirstDoubleQuoteHere && i >= thereShouldBeTheFirstDoubleQuoteHere) {
        thereShouldBeTheSecondDoubleQuoteHere = thereShouldBeTheFirstDoubleQuoteHere;
        thereShouldBeTheFirstDoubleQuoteHere = 0; // set the marker altContentsStart

        if (withinAlt) {
          altContentsStart = i + 1;
          withinAlt = false;
        } // also, if the character after first double quote is closing slash (XHTML)
        // or closing bracket (HTML), add a missing space in front of it:


        if (str[i + 1].trim() === "/" || str[i + 1].trim() === ">") {
          addSpaceInTheFutureBeforeSlashOrBracket = true;
          finalSpaceNeeded = false;
        }
      } else if (thereShouldBeTheSecondDoubleQuoteHere && i >= thereShouldBeTheSecondDoubleQuoteHere) { // If double quotes are closed properly, wipe the plausibles
        // that practically means we don't delete the whitespace within double quotes.
        // however, rogue unclosed double quote might throw us off track, hence
        // this contraption with plausible ranges.
        // We catch plausible ranges and keep until double quote is closed.
        // If it is never closed, all those ranges are merged into rangesArr for deletion.
        plausibleWithinQuotesRanges.wipe();
        thereShouldBeTheSecondDoubleQuoteHere = 0; // if the following character is closing slash (XHTML) or closing bracket (HTML),
        // add space in front of it

        if (str[i + 1] === ">" || str[i + 1] === "/") {
          addSpaceInTheFutureBeforeSlashOrBracket = true;
          finalSpaceNeeded = false;
        } // reset altContentsStart

        if (altContentsStart && opts.unfancyTheAltContents) {
          const altContents = str.slice(altContentsStart, i);

          if (unfancy(altContents).trim() !== altContents) {
            rangesArr.add(altContentsStart, i, unfancy(altContents).trim());
          }
        }

        altContentsStart = 0;
      }
    } // catch single quotes
    // ================


    if (withinImageTag && !withinQuotes && str[i] === "'") {
      rangesArr.add(i, i + 1);

      if (str[i + 1] === "/" || str[i + 1] === ">") {
        addSpaceInTheFutureBeforeSlashOrBracket = true;
      }
    } // catch the closing IMG tag and perform all the tasks
    // ================


    if (withinImageTag && str[i] === ">") {
      imageTagStartedAt = 0;
      withinQuotes = false; // add ALT attr if missing:

      if (altBegins === null) {

        if (slashStartedAt) {
          // XHTML.
          rangesArr.add(slashStartedAt, slashStartedAt, ' alt="" ');
        } else {
          // HTML.
          rangesArr.add(i, i, ' alt="" ');
        }
        finalSpaceNeeded = false;
        addSpaceInTheFutureBeforeSlashOrBracket = false;
      }

      if (!slashStartedAt && thereShouldBeEqualCharacterHere === i) {
        // if ALT has no equal and is right before closing bracket
        // HTML
        rangesArr.add(i, i, '="" ');
        finalSpaceNeeded = false;
      } else if (slashStartedAt && thereShouldBeEqualCharacterHere === i - 1) {
        // if ALT has no equal and is right before closing bracket
        // XHTML
        rangesArr.add(i - 1, i - 1, '="" ');
        finalSpaceNeeded = false;
      }

      if (!slashStartedAt && thereShouldBeTheFirstDoubleQuoteHere && thereShouldBeTheFirstDoubleQuoteHere <= i) {
        // HTML
        rangesArr.add(i, i, '"" ');
        addSpaceInTheFutureBeforeSlashOrBracket = false;
      } else if (slashStartedAt && thereShouldBeTheFirstDoubleQuoteHere && thereShouldBeTheFirstDoubleQuoteHere <= i) {
        // XHTML
        rangesArr.add(i - 1, i - 1, '"" ');
        addSpaceInTheFutureBeforeSlashOrBracket = false;
      } else if (!slashStartedAt && thereShouldBeTheSecondDoubleQuoteHere && thereShouldBeTheSecondDoubleQuoteHere <= i) { // HTML

        rangesArr.add(i, i, '"');
        addSpaceInTheFutureBeforeSlashOrBracket = true; // so if the second double quote is missing, merge in the plausible ranges, if any // and now the actual merging of plausible ranges:

        if (plausibleWithinQuotesRanges.current()) {
          plausibleWithinQuotesRanges.current().forEach(key => {
            rangesArr.add(key[0], key[1], key[2]);
          });
        } // after merging in, clean up the ranges


        rangesArr.current(); // .current will mutate the ranges in the memory, cleaning, merging,
        // normalising them.

        plausibleWithinQuotesRanges.wipe();
      } else if (slashStartedAt && thereShouldBeTheSecondDoubleQuoteHere && thereShouldBeTheSecondDoubleQuoteHere <= i) { // XHTML

        rangesArr.add(thereShouldBeTheSecondDoubleQuoteHere + 1, thereShouldBeTheSecondDoubleQuoteHere + 1, '"'); // so if the second double quote is missing, merge in the plausible ranges, if any

        if (plausibleWithinQuotesRanges.current()) {
          plausibleWithinQuotesRanges.current().forEach(key => {
            rangesArr.add(key[0], key[1], key[2]);
          });
        }

        plausibleWithinQuotesRanges.wipe(); // after merging in, clean up the ranges

        rangesArr.current(); // .current will mutate the ranges in the memory, cleaning, merging,
        // normalising them.
      }

      if (finalSpaceNeeded || addSpaceInTheFutureBeforeSlashOrBracket) {
        if (slashStartedAt) {
          rangesArr.add(slashStartedAt, slashStartedAt, " ");
        } else {
          rangesArr.add(i, i, " ");
        }
      }

      withinImageTag = false;
      altBegins = null;
      thereShouldBeTheFirstDoubleQuoteHere = 0;
      thereShouldBeTheSecondDoubleQuoteHere = 0;
      finalSpaceNeeded = false;
    } // any non-empty space character ends the closing slash flag.
    // we don't want anything deleted after slash if it's not closing-slash but content
    // REVIEW slashStartedAt, probably needs more rules to make the case more precise


    if (slashStartedAt && str[i] !== "/" && str[i].trim() !== "") {
      slashStartedAt = 0; // altContentsStart = 0

      thereShouldBeEqualCharacterHere = 0;
      thereShouldBeTheFirstDoubleQuoteHere = 0;
      thereShouldBeTheSecondDoubleQuoteHere = 0;
    } // whitespace starts
    // ================


    if (withinImageTag && str[i].trim() === "" && !whitespaceStarted) {
      whitespaceStarted = i;
    } // ================================================================
    // ================================================================
  } // crunch all the slices from rangesArr:
  // ================

  if (rangesArr.current() && rangesArr.current().length > 0) {
    return rApply(str, rangesArr.current());
  }

  return str;
}

export { alts, version$1 as version };
