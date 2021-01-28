/**
 * string-remove-duplicate-heads-tails
 * Detect and (recursively) remove head and tail wrappings around the input string
 * Version: 5.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-remove-duplicate-heads-tails/
 */

import isObj from 'lodash.isplainobject';
import { arrayiffy } from 'arrayiffy-if-string';
import { matchRightIncl, matchLeftIncl } from 'string-match-left-right';
import { Ranges } from 'ranges-push';
import { rApply } from 'ranges-apply';
import { trimSpaces } from 'string-trim-spaces-only';

var version = "5.0.1";

const version$1 = version;
const defaults = {
  heads: ["{{"],
  tails: ["}}"]
};

function remDup(str, originalOpts) {
  //
  const has = Object.prototype.hasOwnProperty; // ===================== insurance =====================

  if (str === undefined) {
    throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_01] The input is missing!");
  }

  if (typeof str !== "string") {
    return str;
  }

  if (originalOpts && !isObj(originalOpts)) {
    throw new Error(`string-remove-duplicate-heads-tails: [THROW_ID_03] The given options are not a plain object but ${typeof originalOpts}!`);
  } // at this point, we can clone the originalOpts


  const clonedOriginalOpts = { ...originalOpts
  };

  if (clonedOriginalOpts && has.call(clonedOriginalOpts, "heads")) {
    if (!arrayiffy(clonedOriginalOpts.heads).every(val => typeof val === "string" || Array.isArray(val))) {
      throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_04] The opts.heads contains elements which are not string-type!");
    } else if (typeof clonedOriginalOpts.heads === "string") {
      clonedOriginalOpts.heads = arrayiffy(clonedOriginalOpts.heads);
    }
  }

  if (clonedOriginalOpts && has.call(clonedOriginalOpts, "tails")) {
    if (!arrayiffy(clonedOriginalOpts.tails).every(val => typeof val === "string" || Array.isArray(val))) {
      throw new Error("string-remove-duplicate-heads-tails: [THROW_ID_05] The opts.tails contains elements which are not string-type!");
    } else if (typeof clonedOriginalOpts.tails === "string") {
      clonedOriginalOpts.tails = arrayiffy(clonedOriginalOpts.tails);
    }
  } // trim but only if it's not trimmable to zero length (in that case return intact)


  const temp = trimSpaces(str).res;

  if (temp.length === 0) {
    return str;
  }

  str = temp;
  const defaults = {
    heads: ["{{"],
    tails: ["}}"]
  };
  const opts = { ...defaults,
    ...clonedOriginalOpts
  }; // first, let's trim heads and tails' array elements:

  opts.heads = opts.heads.map(el => el.trim());
  opts.tails = opts.tails.map(el => el.trim()); //                        P R E P A R A T I O N S
  // this flag is on after the first non-heads/tails chunk

  let firstNonMarkerChunkFound = false; // When second non-heads/tails chunk is met, this flag is turned on.
  // It wipes all conditional ranges and after that, only second heads/tails-onwards
  // that leads to string-end or whitespace and string-end will be moved to real slices
  // ranges array.

  let secondNonMarkerChunkFound = false; // Real ranges array is the array that we'll process in the end, cropping pieces
  // out of the string:

  const realRanges = new Ranges({
    limitToBeAddedWhitespace: true
  }); // Conditional ranges array depends of the conditions what follows them. If the
  // condition is satisfied, range is merged into realRanges[]; if not, it's deleted.
  // For example, for leading head chunks, condition would be other heads/tails following
  // precisely after (not counting whitespace). For another example, for trailing
  // chunks, condition would be end of the string or other heads/tails that leads to
  // the end of the string:

  const conditionalRanges = new Ranges({
    limitToBeAddedWhitespace: true
  }); // this flag is requirement for cases where there are at least two chunks
  // wrapped with heads/tails, and we can't "peel off" the first tail that follows
  // the last chunk - each chunk has its wrapping:
  // {{ {{ chunk1}} {{chunk2}} }}
  //                        ^^ That's these tails we're talking about.
  //                           We don't want these deleted!

  let itsFirstTail = true; // This is a flag to mark the first letter in a non-head/tail/whitespace chunk.
  // Otherwise, second letter would trigger "secondNonMarkerChunkFound = true" and
  // we don't want that.

  let itsFirstLetter = true; // = heads or tails:

  let lastMatched = ""; //                              P A R T   I
  // delete leading empty head-tail clumps as in "((()))((())) a"

  function delLeadingEmptyHeadTailChunks(str1, opts1) {
    let noteDownTheIndex; // do heads, from beginning of the input string:
    const resultOfAttemptToMatchHeads = matchRightIncl(str1, 0, opts1.heads, {
      trimBeforeMatching: true,
      cb: (_char, _theRemainderOfTheString, index) => {
        noteDownTheIndex = index;
        return true;
      }
    });

    if (!resultOfAttemptToMatchHeads) {
      // if heads were not matched, bail - there's no point matching trailing tails
      return str1;
    } // do tails now:
    const resultOfAttemptToMatchTails = matchRightIncl(str1, noteDownTheIndex, opts1.tails, {
      trimBeforeMatching: true,
      cb: (_char, _theRemainderOfTheString, index) => {
        // reassign noteDownTheIndex to new value, this time shifted right by
        // the width of matched tails
        noteDownTheIndex = index;
        return true;
      }
    });

    if (resultOfAttemptToMatchTails) {
      return str1.slice(noteDownTheIndex);
    }

    return str1;
  } // action


  while (str !== delLeadingEmptyHeadTailChunks(str, opts)) {
    str = trimSpaces(delLeadingEmptyHeadTailChunks(str, opts)).res;
  } // delete trailing empty head-tail clumps as in "a ((()))((()))"


  function delTrailingEmptyHeadTailChunks(str1, opts1) {
    let noteDownTheIndex; // do tails now - match from the end of a string, trimming along:
    const resultOfAttemptToMatchTails = matchLeftIncl(str1, str1.length - 1, opts1.tails, {
      trimBeforeMatching: true,
      cb: (_char, _theRemainderOfTheString, index) => {
        noteDownTheIndex = index;
        return true;
      }
    });

    if (!resultOfAttemptToMatchTails || !noteDownTheIndex) {
      // if tails were not matched, bail - there's no point checking preceding heads
      return str1;
    } // do heads that precede those tails:
    const resultOfAttemptToMatchHeads = matchLeftIncl(str1, noteDownTheIndex, opts1.heads, {
      trimBeforeMatching: true,
      cb: (_char, _theRemainderOfTheString, index) => {
        // reassign noteDownTheIndex to new value, this time shifted left by
        // the width of matched heads
        noteDownTheIndex = index;
        return true;
      }
    });

    if (resultOfAttemptToMatchHeads) {
      return str1.slice(0, noteDownTheIndex + 1);
    }

    return str1;
  } // action


  while (str !== delTrailingEmptyHeadTailChunks(str, opts)) {
    str = trimSpaces(delTrailingEmptyHeadTailChunks(str, opts)).res;
  } //                      E A R L Y    E N D I N G

  if (!opts.heads.length || !matchRightIncl(str, 0, opts.heads, {
    trimBeforeMatching: true
  }) || !opts.tails.length || !matchLeftIncl(str, str.length - 1, opts.tails, {
    trimBeforeMatching: true
  })) {
    return trimSpaces(str).res;
  } //                             P A R T   II
  // iterate the input string


  for (let i = 0, len = str.length; i < len; i++) {
    //
    // console log bits for development // catch whitespace

    if (str[i].trim() === "") ; else {
      // so it's not a whitespace character.
      // "beginning" is a special state which lasts until first non-head/tail
      // character is met.
      // For example: {{{  }}} {{{ {{{ something }}} }}}
      // ------------>             <----------------
      //                 ^^^ indexes where "beginning" is "true"
      // match heads
      let noteDownTheIndex;
      const resultOfAttemptToMatchHeads = matchRightIncl(str, i, opts.heads, {
        trimBeforeMatching: true,
        cb: (_char, _theRemainderOfTheString, index) => {
          noteDownTheIndex = index;
          return true;
        }
      });

      if (resultOfAttemptToMatchHeads && noteDownTheIndex) {
        // reset marker
        itsFirstLetter = true; // reset firstTails

        if (itsFirstTail) {
          itsFirstTail = true;
        } // 0. Just in case, check maybe there are tails following right away,
        // in that case definitely remove both

        let tempIndexUpTo;
        const resultOfAttemptToMatchTails = matchRightIncl(str, noteDownTheIndex, opts.tails, {
          trimBeforeMatching: true,
          cb: (_char, _theRemainderOfTheString, index) => {
            tempIndexUpTo = index;
            return true;
          }
        });

        if (resultOfAttemptToMatchTails) {
          realRanges.push(i, tempIndexUpTo);
        } // 1. At this moment, in case {{ hi {{ name }}! }}
        // when we reach the second "{{", first "{{" are still in conditional
        // holding array. We'll evaluate the situation by "lastMatched" variable.


        if (conditionalRanges.current() && firstNonMarkerChunkFound && lastMatched !== "tails") {
          realRanges.push(conditionalRanges.current());
        } // 2. let's evaluate the situation and possibly submit this range of indexes
        // to conditional ranges array.
        // if it's the beginning of a file, where no non-head/tail character was
        // met yet, add it to conditionals array:


        if (!firstNonMarkerChunkFound) {
          // deal with any existing content in the conditionals:
          if (conditionalRanges.current()) {
            // first, if there are any conditional ranges, they become real-ones:
            realRanges.push(conditionalRanges.current()); // then, wipe conditionals:
            conditionalRanges.wipe();
          } // then, add this new range:

          conditionalRanges.push(i, noteDownTheIndex);
        } else {
          // Every heads or tails go to conditional array. First encountered
          // non-head/tail wipes all.
          conditionalRanges.push(i, noteDownTheIndex);
        } // 3. set the new lastMatched


        lastMatched = "heads"; // 4. offset the index
        i = noteDownTheIndex - 1;
        continue;
      } // match tails
      const resultOfAttemptToMatchTails = matchRightIncl(str, i, opts.tails, {
        trimBeforeMatching: true,
        cb: (_char, _theRemainderOfTheString, index) => {
          noteDownTheIndex = Number.isInteger(index) ? index : str.length;
          return true;
        }
      });

      if (resultOfAttemptToMatchTails && noteDownTheIndex) {
        // reset marker
        itsFirstLetter = true;

        if (!itsFirstTail) {
          // if that's a second chunk, this means each chunk will be wrapped
          // and we can't peel of those wrappings, hence only the second tail
          // can be added to conditionals' array.
          conditionalRanges.push(i, noteDownTheIndex);
        } else {
          // 1.

          if (lastMatched === "heads") {
            conditionalRanges.wipe();
          } // 2. if it's just the first tail, do nothing, but turn off the flag
          itsFirstTail = false;
        } // set lastMatched


        lastMatched = "tails"; // 2. offset the index
        i = noteDownTheIndex - 1;
        continue;
      } // if we reached this point, this means, it's neither head nor tail, also
      // not a whitespace


      if (itsFirstTail) {
        itsFirstTail = true;
      }

      if (itsFirstLetter && !firstNonMarkerChunkFound) { // wipe the conditionals:
        // conditionalRanges.wipe()
        // set the flags:

        firstNonMarkerChunkFound = true;
        itsFirstLetter = false;
      } else if (itsFirstLetter && !secondNonMarkerChunkFound) {
        secondNonMarkerChunkFound = true;
        itsFirstTail = true;
        itsFirstLetter = false; // wipe the conditionals.
        // That's for example where we reached "n" in "{{ hi {{ name }}! }}"

        if (lastMatched === "heads") {
          conditionalRanges.wipe();
        }
      } else if (itsFirstLetter && secondNonMarkerChunkFound) {
        // in this case we reached "!" in "{{ hi }} name {{! }}", for example.
        // Let's wipe the conditionals
        conditionalRanges.wipe();
      }
    } //
  }

  if (conditionalRanges.current()) {
    realRanges.push(conditionalRanges.current());
  }

  if (realRanges.current()) {
    return rApply(str, realRanges.current()).trim();
  }

  return str.trim();
}

export { defaults, remDup, version$1 as version };
