import { allHtmlAttribs } from "html-all-known-attributes";
import charSuitableForHTMLAttrName from "is-char-suitable-for-html-attr-name";
import { right } from "string-left-right";
import { matchRight } from "string-match-left-right";

function isAttrClosing(str, idxOfAttrOpening, isThisClosingIdx) {
  if (
    typeof str !== "string" ||
    !str.trim().length ||
    !Number.isInteger(idxOfAttrOpening) ||
    !Number.isInteger(isThisClosingIdx) ||
    !str[idxOfAttrOpening] ||
    !str[isThisClosingIdx] ||
    idxOfAttrOpening >= isThisClosingIdx
  ) {
    console.log(
      `017 ${`\u001b[${31}m${`WRONG INPUTS, RETURN FALSE`}\u001b[${39}m`}`
    );
    return false;
  }

  const openingQuote = `'"`.includes(str[idxOfAttrOpening])
    ? str[idxOfAttrOpening]
    : null;
  let oppositeToOpeningQuote = null;
  if (openingQuote) {
    oppositeToOpeningQuote = openingQuote === `"` ? `'` : `"`;
  }
  console.log(
    `030 ${`\u001b[${33}m${`openingQuote`}\u001b[${39}m`}: ${`\u001b[${35}m${openingQuote}\u001b[${39}m`}   ${`\u001b[${33}m${`oppositeToOpeningQuote`}\u001b[${39}m`}: ${`\u001b[${35}m${oppositeToOpeningQuote}\u001b[${39}m`}`
  );

  let chunkStartsAt;
  const quotesCount = new Map().set(`'`, 0).set(`"`, 0);

  // when suspected attribute name chunks end, we wipe them, but here
  // we store the last extracted chunk - then later, for example, when we
  // traverse further and meet opening quote (even with equal missing),
  // we can evaluate that chunk, was it a known attribute name (idea being,
  // known attribute name followed by quote is probably legit attribute starting)
  let lastCapturedChunk;

  // this boolean flag signifies, was the last chunk captured after passing
  // "isThisClosingIdx":
  // idea being, if you pass suspected quotes, then encounter new-ones and
  // in-between does not resemble an attribute name, it's falsey result:
  // <img alt="so-called "artists"!' class='yo'/>
  //          ^                  ^
  //        start             suspected
  //
  // that exclamation mark above doesn't resemble an attribute name,
  // so single quote that follows it is not a starting of its value
  let lastChunkWasCapturedAfterSuspectedClosing = false;

  // let's traverse from opening to the end of the string, then in happy
  // path scenarios, let's exit way earlier, upon closing quote
  for (let i = idxOfAttrOpening, len = str.length; i < len; i++) {
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //                                THE TOP
    //                                ███████
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    //
    // Logging:
    // -------------------------------------------------------------------------
    console.log(
      `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
        str[i] && str[i].trim().length
          ? str[i]
          : JSON.stringify(str[i], null, 4)
      }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`
    );

    console.log(
      i === isThisClosingIdx
        ? `                 ██ isThisClosingIdx met at ${i} ██`
        : ""
    );

    // catch quotes
    if (`'"`.includes(str[i])) {
      quotesCount.set(str[i], quotesCount.get(str[i]) + 1);
    }

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //                               MIDDLE
    //                               ██████
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    // before and after the suspected index, all the way while traversing the
    // string from known, starting quotes (or in their absence, starting of
    // the attribute's value, the second input argument "idxOfAttrOpening")
    // all the way until the end, we catch the first character past the
    // questioned attribute closing.

    // imagine
    // <img alt="so-called "artists"!' class='yo'/>
    //          ^                  ^
    //        opening          suspected closing

    if (str[i].trim().length && !chunkStartsAt) {
      console.log(`140 inside the attr name START catching clauses`);
      // <img alt="so-called "artists"!' class='yo'/>
      //                              ^
      //                         we land here, on excl. mark
      if (charSuitableForHTMLAttrName(str[i])) {
        console.log(
          `146 ${`\u001b[${32}m${`██ new attribute name starts`}\u001b[${39}m`}`
        );
        chunkStartsAt = i;
        console.log(
          `150 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`chunkStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
            chunkStartsAt,
            null,
            4
          )}`
        );
      }
    } else if (chunkStartsAt && !charSuitableForHTMLAttrName(str[i])) {
      console.log(`158 inside the attr name END catching clauses`);

      // ending of an attr name chunk
      console.log(
        `162 ${`\u001b[${32}m${`EXTRACTED`}\u001b[${39}m`}: "${str.slice(
          chunkStartsAt,
          i
        )}"`
      );
      lastCapturedChunk = str.slice(chunkStartsAt, i);
      lastChunkWasCapturedAfterSuspectedClosing =
        chunkStartsAt >= isThisClosingIdx;

      console.log(
        `172 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`chunkStartsAt`}\u001b[${39}m`}`
      );
      chunkStartsAt = null;
    }

    // catching new attributes that follow after suspected quote.
    // Imagine
    // <a class "c" id 'e' href "www">
    //                 ^            ^
    //        known start at 16     suspected ending at 29
    if (
      // if we're currently on some quote:
      `'"`.includes(str[i]) &&
      // and if either quote count is an even number (the "!" checking is it zero)
      (!(quotesCount.get(`"`) % 2) || !(quotesCount.get(`'`) % 2)) &&
      // and sum of quotes is odd, for example,
      // <a class "c" id 'e' href "www">
      //                          ^
      //                   reusing example above, let's say we're here
      //
      // in this situation, both single quotes around "e" add up to 2, then
      // current opening quote of "www" adds up to 3.
      //
      // In human language, this means, we check, was there a complete
      // set of quotes recorded by now, plus is current chunk a known
      // attribute name - this allows us to catch an attribute with equal missing
      (quotesCount.get(`"`) + quotesCount.get(`'`)) % 2 &&
      // last chunk is not falsey (thus a string)
      lastCapturedChunk &&
      // and finally, perf resource-taxing evaluation, is it recognised:
      allHtmlAttribs.has(lastCapturedChunk)
    ) {
      console.log(`204 RETURN ${i > isThisClosingIdx}`);
      return i > isThisClosingIdx;
    } else if (
      // imagine
      // <a href=www" class=e'>
      //         ^  ^
      //     start  suspected

      // if it's equal following attribute name
      (str[i] === "=" ||
        // OR
        // it's whitespace
        (!str[i].length &&
          // and next non-whitespace character is "equal" character
          str[right(str, i)] === "=")) &&
      // last chunk is not falsey (thus a string)
      lastCapturedChunk &&
      // and finally, perf resource-taxing evaluation, is it recognised:
      allHtmlAttribs.has(lastCapturedChunk)
    ) {
      // definitely that's new attribute starting
      console.log(`225 new attr starting RETURN ${i > isThisClosingIdx}`);
      return i > isThisClosingIdx;
    }

    // when index "isThisClosingIdx" has been passed...
    if (i > isThisClosingIdx) {
      console.log(`231 i > isThisClosingIdx`);

      // if suspected closing quote's index is reached
      if (openingQuote && str[idxOfAttrOpening] === str[i]) {
        console.log(
          `236 happy path, opening quote matched - ${`\u001b[${31}m${`RETURN FALSE`}\u001b[${39}m`}`
        );
        return false;
      }

      // if we have passed the suspected closing quote
      // and we meet another quote of the same kind,
      // it's false result. Imagine code:
      // <img alt='so-called "artists"!" class='yo'/>
      //                     ^       ^
      //               questioned    |
      //                 index     we're here
      //                           so it's false
      if (
        // if attribute starts with a quote
        openingQuote &&
        // and we're suspecting a mismatching pair:
        str[isThisClosingIdx] === oppositeToOpeningQuote &&
        // we're questioning, maybe current
        // suspected closing quote is of the
        // opposite kind (single-double, double-single)
        str[i] === oppositeToOpeningQuote
      ) {
        console.log(
          `260 another quote same as suspected was met - ${`\u001b[${31}m${`RETURN FALSE`}\u001b[${39}m`}`
        );
        return false;
      } // if the tag closing was met, that's fine, imagine:
      // <div class='c">.</div>
      //              ^
      //        we went past this suspected closing quote
      //        and reached the tag ending...
      else if (str[i] === "/" || str[i] === ">" || str[i] === "<") {
        console.log(
          `270 closing bracket caught first - ${`\u001b[${32}m${`RETURN TRUE`}\u001b[${39}m`}`
        );
        return true;
      }

      // if the true attribute ending was met passing
      // past the suspected one, this means that
      // suspected one was a false guess. Correct ending
      // is at this index "i"

      if (
        str[i] === "=" &&
        matchRight(str, i, [`'`, `"`], {
          trimBeforeMatching: true,
          trimCharsBeforeMatching: ["="],
        })
      ) {
        console.log(
          `288 new attribute starts - ${`\u001b[${32}m${`RETURN TRUE`}\u001b[${39}m`}`
        );
        return true;
      }
    } else {
      console.log(`293 i <= isThisClosingIdx`);
      // this clause is meant to catch the suspected quotes
      // which don't belong to the tag, it's where quotes
      // in question are way beyond the actual attribute's ending.
      // For example, consider
      // <div class="c' id="x'>.</div>
      //            ^        ^
      //            |        |
      //         known      suspected
      //         opening    closing
      //
      // That equal-quote after "id" would trigger the alarm,
      // that is the clause below..

      // BUT mind the false positive:
      // <img src="xyz" alt="="/>
      //                    ^ ^
      //                    | |
      //      known opening/  \suspected closing
      //

      // by the way we use right() to jump over whitespace
      // for example, this will also catch:
      // <img src="xyz" alt="=   "/>
      //
      console.log(`318 *`);
      let firstNonWhitespaceCharOnTheLeft;
      if (str[i - 1] && str[i - 1].trim().length && str[i - 1] !== "=") {
        // happy path
        firstNonWhitespaceCharOnTheLeft = i - 1;
      } else {
        console.log(`324 traverse backwards`);
        for (let y = i; y--; ) {
          console.log(
            `327 ${`\u001b[${33}m${`str[${y}]`}\u001b[${39}m`} = ${JSON.stringify(
              str[y],
              null,
              4
            )}`
          );
          if (str[y].trim().length && str[y] !== "=") {
            firstNonWhitespaceCharOnTheLeft = y;
            console.log(
              `336 SET ${`\u001b[${33}m${`firstNonWhitespaceCharOnTheLeft`}\u001b[${39}m`} = ${JSON.stringify(
                firstNonWhitespaceCharOnTheLeft,
                null,
                4
              )}; BREAK`
            );
            break;
          }
        }
      }
      console.log(
        `347 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`firstNonWhitespaceCharOnTheLeft`}\u001b[${39}m`} = ${JSON.stringify(
          firstNonWhitespaceCharOnTheLeft,
          null,
          4
        )}`
      );

      if (
        str[i] === "=" &&
        matchRight(str, i, [`'`, `"`], {
          // ensure it's not tag ending on the right
          // before freaking out:
          cb: (char) => !`/>`.includes(char),
          trimBeforeMatching: true,
          trimCharsBeforeMatching: ["="],
        }) &&
        // ensure it's a character suitable for attribute
        // name on the left of equal (if it's a real
        // attribute name its name characters must pass
        // the charSuitableForHTMLAttrName()...)
        charSuitableForHTMLAttrName(str[firstNonWhitespaceCharOnTheLeft])
      ) {
        console.log(
          `370 new attribute starts - ${`\u001b[${31}m${`RETURN FALSE`}\u001b[${39}m`}`
        );
        return false;
      }
    }

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //                               BOTTOM
    //                               ██████
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    // catch quotes again - these clauses are specifically at the bottom
    // because they're depdendent on "lastCapturedChunk" which is calculated
    // after quote catching at the top
    if (
      `'"`.includes(str[i]) &&
      // if these quotes are after "isThisClosingIdx", a suspected closing
      i > isThisClosingIdx
    ) {
      // if these quotes are after "isThisClosingIdx", if there
      // was no chunk recorded after it until now,
      // ("lastChunkWasCapturedAfterSuspectedClosing" flag)
      // or there was but it's not recognised, that's falsey result
      console.log(
        `411 FIY, ${`\u001b[${33}m${`lastCapturedChunk`}\u001b[${39}m`} = ${JSON.stringify(
          lastCapturedChunk,
          null,
          4
        )}; lastChunkWasCapturedAfterSuspectedClosing=${lastChunkWasCapturedAfterSuspectedClosing}`
      );

      if (
        // if there was no chunk recorded after it until now
        !lastChunkWasCapturedAfterSuspectedClosing ||
        !lastCapturedChunk ||
        // or there was but lastCapturedChunk is not recognised
        !allHtmlAttribs.has(lastCapturedChunk)
      ) {
        console.log(
          `426 the slice "${str.slice(
            isThisClosingIdx,
            i
          )}" does not contain a new attribute name, ${`\u001b[${31}m${`RETURN FALSE`}\u001b[${39}m`}`
        );
        return false;
      }
      // ELSE - it does match, so it seems legit
      console.log(`434 ${`\u001b[${32}m${`RETURN TRUE`}\u001b[${39}m`}`);
      return true;
    }

    // logging
    // -----------------------------------------------------------------------------
    console.log(
      `${`\u001b[${90}m${`██ chunkStartsAt: ${chunkStartsAt}`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`██ lastCapturedChunk: ${lastCapturedChunk}`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`██ lastChunkWasCapturedAfterSuspectedClosing: ${lastChunkWasCapturedAfterSuspectedClosing}`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`██ quotesCount: ' - ${quotesCount.get(
        `'`
      )}; " - ${quotesCount.get(`"`)}`}\u001b[${39}m`}`
    );
  }

  // if this point was reached and loop didn't exit...
  // default is false
  console.log(`458 ${`\u001b[${31}m${`RETURN DEFAULT FALSE`}\u001b[${39}m`}`);
  return false;
}

export default isAttrClosing;
