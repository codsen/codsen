/**
 * is-html-attribute-closing
 * Is a character on a given index a closing of an HTML attribute?
 * Version: 2.1.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/is-html-attribute-closing/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var htmlAllKnownAttributes = require('html-all-known-attributes');
var isCharSuitableForHtmlAttrName = require('is-char-suitable-for-html-attr-name');
var stringLeftRight = require('string-left-right');
var stringMatchLeftRight = require('string-match-left-right');

function makeTheQuoteOpposite(quoteChar) {
  return quoteChar === "'" ? "\"" : "'";
}

function ensureXIsNotPresentBeforeOneOfY(str, startingIdx, x, y) {
  if (y === void 0) {
    y = [];
  }

  var _loop = function _loop(i, len) {

    if (y.some(function (oneOfStr) {
      return str.startsWith(oneOfStr, i);
    })) {
      // it's escape clause, bracket or whatever was reached and yet,
      // "x" hasn't been encountered yet
      return {
        v: true
      };
    }

    if (str[i] === x) {
      // if "x" was found, that's it - falsey result
      return {
        v: false
      };
    }
  };

  for (var i = startingIdx, len = str.length; i < len; i++) {
    var _ret = _loop(i);

    if (typeof _ret === "object") return _ret.v;
  } // default result
  return true;
} // Tells, if substring x goes before substring y on the right
// side of "str", starting at index "startingIdx".
// Used to troubleshoot dirty broken code.


function xBeforeYOnTheRight(str, startingIdx, x, y) {
  for (var i = startingIdx, len = str.length; i < len; i++) {
    if (str.startsWith(x, i)) {
      // if x was first, Bob's your uncle, that's truthy result
      return true;
    }

    if (str.startsWith(y, i)) {
      // since we're in this clause, x failed, so if y matched,
      // this means y precedes x
      return false;
    }
  } // default result


  return false;
} // Tells, is this a clean plausible attribute starting at given index
// <img alt="so-called "artists"class='yo'/>
//                              ^
//                            start


function plausibleAttrStartsAtX(str, start) {

  if (!isCharSuitableForHtmlAttrName.isAttrNameChar(str[start]) || !start) {
    return false;
  } // const regex = /^[a-zA-Z0-9:-]*[=]?((?:'[^']*')|(?:"[^"]*"))/;


  var regex = /^[a-zA-Z0-9:-]*(\s*[=]?\s*((?:'[^']*')|(?:"[^"]*")))|( [^/>'"=]*['"])/;
  return regex.test(str.slice(start));
} // difference is equal is required


function guaranteedAttrStartsAtX(str, start) {

  if (!start || !isCharSuitableForHtmlAttrName.isAttrNameChar(str[start])) {
    return false;
  } // either quotes match or does not match but tag closing follows
  // const regex = /^[a-zA-Z0-9:-]*[=]?(((?:'[^']*')|(?:"[^"]*"))|((?:['"][^'"]*['"]\s*\/?>)))/;


  var regex = /^[a-zA-Z0-9:-]*=(((?:'[^']*')|(?:"[^"]*"))|((?:['"][^'"]*['"]\s*\/?>)))/;
  return regex.test(str.slice(start));
}

function findAttrNameCharsChunkOnTheLeft(str, i) {
  if (!isCharSuitableForHtmlAttrName.isAttrNameChar(str[stringLeftRight.left(str, i)])) {
    return;
  }

  for (var y = i; y--;) {

    if (str[y].trim().length && !isCharSuitableForHtmlAttrName.isAttrNameChar(str[y])) {
      return str.slice(y + 1, i);
    }
  }
}

var version = "2.1.0";

var version$1 = version;

function isAttrClosing(str, idxOfAttrOpening, isThisClosingIdx) {
  if (typeof str !== "string" || !str.trim() || !Number.isInteger(idxOfAttrOpening) || !Number.isInteger(isThisClosingIdx) || !str[idxOfAttrOpening] || !str[isThisClosingIdx] || idxOfAttrOpening >= isThisClosingIdx) {
    return false;
  }

  var openingQuote = "'\"".includes(str[idxOfAttrOpening]) ? str[idxOfAttrOpening] : null;
  var oppositeToOpeningQuote = null;

  if (openingQuote) {
    oppositeToOpeningQuote = makeTheQuoteOpposite(openingQuote);
  }
  var chunkStartsAt;
  var quotesCount = new Map().set("'", 0).set("\"", 0).set("matchedPairs", 0);
  var lastQuoteAt = null;
  var totalQuotesCount = 0;
  var lastQuoteWasMatched = false;
  var lastMatchedQuotesPairsStartIsAt;
  var lastMatchedQuotesPairsEndIsAt; // when suspected attribute name chunks end, we wipe them, but here
  // we store the last extracted chunk - then later, for example, when we
  // traverse further and meet opening quote (even with equal missing),
  // we can evaluate that chunk, was it a known attribute name (idea being,
  // known attribute name followed by quote is probably legit attribute starting)

  var lastCapturedChunk;
  var secondLastCapturedChunk; // this boolean flag signifies, was the last chunk captured after passing
  // "isThisClosingIdx":
  // idea being, if you pass suspected quotes, then encounter new-ones and
  // in-between does not resemble an attribute name, it's falsey result:
  // <img alt="so-called "artists"!' class='yo'/>
  //          ^                  ^
  //        start             suspected
  //
  // that exclamation mark above doesn't resemble an attribute name,
  // so single quote that follows it is not a starting of its value

  var lastChunkWasCapturedAfterSuspectedClosing = false; // does what it says on the tin - flips on the first instance

  var closingBracketMet = false;
  var openingBracketMet = false; // let's traverse from opening to the end of the string, then in happy
  // path scenarios, let's exit way earlier, upon closing quote

  for (var i = idxOfAttrOpening, len = str.length; i < len; i++) {
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

    if ( // Imagine we're here:
    // <z bbb"c" ddd'e>
    //       ^      ^
    //   start     suspected closing
    //
    // this single quote at 13 is preceded by fully matched pair of quotes
    // there's also attribute-name-like chunk preceding in front.
    // Let's catch such case.
    //
    // 1. we're on a quote
    "'\"".includes(str[i]) && // 2. we ensure that a pair of quotes was catched so far
    lastQuoteWasMatched && // 3. lastMatchedQuotesPairsStartIsAt is our known opening
    lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening && // 4. lastMatchedQuotesPairsEndIsAt is the last matched pair's closing:
    // <z bbb"c" ddd'e>
    //         ^
    //        this if to reuse the example..
    //
    lastMatchedQuotesPairsEndIsAt !== undefined && lastMatchedQuotesPairsEndIsAt < i && // rule must not trigger before the suspected quote index
    i >= isThisClosingIdx) { // ███████████████████████████████████████ E1
      //
      // consider WHERE WE ARE AT THE MOMENT in relation to
      // the INDEX THAT'S QUESTIONED FOR BEING A CLOSING-ONE
      // FALSEY result:
      // <z bbb"c" ddd'e'>.<z fff"g">
      //       ^      ^
      //     start   suspected
      //
      // <z bbb"c" ddd'e'>.<z fff"g">
      //              ^
      //            we're here
      // TRUTHY result:
      // <img class="so-called "alt"!' border='10'/>
      //            ^          ^
      //          start      suspected
      //
      // where we're at:
      // <img class="so-called "alt"!' border='10'/>
      //                           ^
      //

      var E1 = i !== isThisClosingIdx || guaranteedAttrStartsAtX(str, stringLeftRight.right(str, isThisClosingIdx)) || "/>".includes(str[stringLeftRight.right(str, i)]); // ███████████████████████████████████████ E2
      //
      //
      // ensure it's not a triplet of quotes:
      // <img alt="so-called "artists"!' class='yo'/>
      //          ^          ^       ^
      //       start      suspected  |
      //                             current index
      //

      var E2 = !(i > isThisClosingIdx && str[idxOfAttrOpening] === str[isThisClosingIdx] && str[idxOfAttrOpening] === str[i] && // rule out cases where plausible attribute starts:
      // <img class="so-called "alt"!' border='10'/>
      //            ^          ^   ^
      //        start          |    \
      //           suspected end    currently on
      plausibleAttrStartsAtX(str, i + 1)); // ███████████████████████████████████████ E3

      var E31 = // or a proper recognised attribute follows:
      // <img alt="so-called "artists"class='yo'/>
      //          ^                  ^
      //       start              suspected and currently on
      //
      // we're on a suspected quote
      i === isThisClosingIdx && // plus one because we're on a quote
      plausibleAttrStartsAtX(str, isThisClosingIdx + 1);
      var E32 = // or the last chunk is a known attribute name:
      // <img class="so-called "alt"!' border='10'/>
      //            ^          ^
      //         start      suspected/we're currently on
      //
      chunkStartsAt && chunkStartsAt < i && htmlAllKnownAttributes.allHtmlAttribs.has(str.slice(chunkStartsAt, i).trim()); // imagine:

      if (chunkStartsAt) {
        str.slice(chunkStartsAt, i).trim();
      }
      var E33 = chunkStartsAt && chunkStartsAt < i && str[chunkStartsAt - 1] && !str[chunkStartsAt - 1].trim() && // and whole chunk is a plausible attribute name
      Array.from(str.slice(chunkStartsAt, i).trim()).every(function (char) {
        return isCharSuitableForHtmlAttrName.isAttrNameChar(char);
      }) && // known opening and suspected closing are both singles or doubles
      str[idxOfAttrOpening] === str[isThisClosingIdx] && !"/>".includes(str[stringLeftRight.right(str, i)]) && ensureXIsNotPresentBeforeOneOfY(str, i + 1, "=", ["'", "\""]); // anti-rule - it's fine if we're on suspected ending and to the left
      // it's not an attribute start
      // <img alt='Deal is your's!"/>
      //          ^               ^
      //       start            suspected/current
      // extract attr name characters chunk on the left, "s" in the case below
      // <img alt='Deal is your's"/>
      //                         ^
      //                       start

      var attrNameCharsChunkOnTheLeft = void 0;

      if (i === isThisClosingIdx) {
        attrNameCharsChunkOnTheLeft = findAttrNameCharsChunkOnTheLeft(str, i);
      }
      var E34 = // we're on suspected
      i === isThisClosingIdx && ( // it's not a character suitable for attr name,
      !isCharSuitableForHtmlAttrName.isAttrNameChar(str[stringLeftRight.left(str, i)]) || // or it is, but whatever we extracted is not recognised attr name
      attrNameCharsChunkOnTheLeft && !htmlAllKnownAttributes.allHtmlAttribs.has(attrNameCharsChunkOnTheLeft)) && // rule out equal
      str[stringLeftRight.left(str, i)] !== "="; // ███████████████████████████████████████ E4

      var E41 = // either it's a tag ending and we're at the suspected quote
      "/>".includes(str[stringLeftRight.right(str, i)]) && i === isThisClosingIdx;
      var E42 = // or next character is suitable for a tag name:
      isCharSuitableForHtmlAttrName.isAttrNameChar(str[stringLeftRight.right(str, i)]);
      var E43 = // or in case of:
      // <img class="so-called "alt"!' border='10'/>
      //            ^          ^
      //          start      suspected
      //
      // where we're at:
      // <img class="so-called "alt"!' border='10'/>
      //                           ^
      //                          here
      lastQuoteWasMatched && i !== isThisClosingIdx;
      var E5 = // it's not a double-wrapped attribute value:
      //
      // <div style="float:"left"">z</div>
      //            ^      ^
      //          start   suspected
      //
      // we're at:
      // <div style="float:"left"">z</div>
      //                        ^
      //                      here
      !( // rule must not trigger before the suspected quote index
      i >= isThisClosingIdx && // there's colon to the left of a suspected quote
      str[stringLeftRight.left(str, isThisClosingIdx)] === ":");
      return !!(E1 && E2 && (E31 || E32 || E33 || E34) && (E41 || E42 || E43) && E5);
    } // catch quotes


    if ("'\"".includes(str[i])) {
      // catch the non-overlapping matched pairs of quotes
      // for example that's three pairs in total below:
      // <z bbb"c" ddd'e'>.<z fff"g">
      // Insurace against the Killer Triplet - a quoted quote
      if (str[i] === "'" && str[i - 1] === "\"" && str[i + 1] === "\"" || str[i] === "\"" && str[i - 1] === "'" && str[i + 1] === "'") {
        continue;
      }

      if (lastQuoteAt && str[i] === str[lastQuoteAt]) {
        quotesCount.set("matchedPairs", quotesCount.get("matchedPairs") + 1);
        lastMatchedQuotesPairsStartIsAt = lastQuoteAt;
        lastMatchedQuotesPairsEndIsAt = i;
        lastQuoteAt = null;
        lastQuoteWasMatched = true;
      } else {
        lastQuoteWasMatched = false;
      } // bump total counts:


      quotesCount.set(str[i], quotesCount.get(str[i]) + 1);
      totalQuotesCount = quotesCount.get("\"") + quotesCount.get("'"); // lastQuoteAt = i;
      // console.log(
      //   `325 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastQuoteAt`}\u001b[${39}m`} = ${JSON.stringify(
      //     lastQuoteAt,
      //     null,
      //     4
      //   )}`
      // );
    } // catch closing brackets


    if (str[i] === ">" && !closingBracketMet) {
      closingBracketMet = true; // if all pairs of quotes were met, that's a good indicator, imagine
      // <z bbb"c" ddd'e'>
      //                 ^

      if (totalQuotesCount && quotesCount.get("matchedPairs") && totalQuotesCount === quotesCount.get("matchedPairs") * 2 && // we haven't reached the suspected quote and tag's already ending
      i < isThisClosingIdx) {
        return false;
      }
    } // catch opening brackets


    if (str[i] === "<" && // consider ERB templating tags, <%= zzz %>
    str[stringLeftRight.right(str, i)] !== "%" && closingBracketMet && !openingBracketMet) {
      openingBracketMet = true; // if it's past the "isThisClosingIdx", that's very falsey
      // if (i > isThisClosingIdx) {
      return false; // }
    } //
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


    if (str[i].trim() && !chunkStartsAt) { // <img alt="so-called "artists"!' class='yo'/>
      //                              ^
      //                         we land here, on excl. mark

      if (isCharSuitableForHtmlAttrName.isAttrNameChar(str[i])) {
        chunkStartsAt = i;
      }
    } else if (chunkStartsAt && !isCharSuitableForHtmlAttrName.isAttrNameChar(str[i])) { // ending of an attr name chunk
      secondLastCapturedChunk = lastCapturedChunk;
      lastCapturedChunk = str.slice(chunkStartsAt, i);
      lastChunkWasCapturedAfterSuspectedClosing = chunkStartsAt >= isThisClosingIdx; // console.log(
      //   `434 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`chunkStartsAt`}\u001b[${39}m`}`
      // );
      // chunkStartsAt = null;
      // imagine:
      // <z bbb"c' href"e>
      //       ^ ^
      //   start suspected ending
      //
      // we're here:
      // <z bbb"c' href"e>
      //               ^

      if ("'\"".includes(str[i]) && quotesCount.get("matchedPairs") === 0 && totalQuotesCount === 3 && str[idxOfAttrOpening] === str[i] && htmlAllKnownAttributes.allHtmlAttribs.has(lastCapturedChunk) && !"'\"".includes(str[stringLeftRight.right(str, i)])) {
        var A1 = i > isThisClosingIdx; //
        // ensure that all continuous chunks since the last quote are
        // recognised attribute names

        var A21 = !lastQuoteAt;
        var A22 = lastQuoteAt + 1 >= i;
        var A23 = str.slice(lastQuoteAt + 1, i).trim().split(/\s+/).every(function (chunk) {
          return htmlAllKnownAttributes.allHtmlAttribs.has(chunk);
        }); // <div style="float:'left"">z</div>
        //            ^           ^
        //          start      we're here

        var A3 = !lastCapturedChunk || !secondLastCapturedChunk || !secondLastCapturedChunk.endsWith(":");
        var B1 = i === isThisClosingIdx;
        var B21 = totalQuotesCount < 3;
        var B22 = !!lastQuoteWasMatched;
        var B23 = !lastQuoteAt;
        var B24 = lastQuoteAt + 1 >= i;
        var B25 = !str.slice(lastQuoteAt + 1, i).trim().split(/\s+/).every(function (chunk) {
          return htmlAllKnownAttributes.allHtmlAttribs.has(chunk);
        });
        return A1 && (A21 || A22 || A23) && A3 || B1 && (B21 || B22 || B23 || B24 || B25);
      }

      if ( // this is a recognised attribute
      lastCapturedChunk && htmlAllKnownAttributes.allHtmlAttribs.has(lastCapturedChunk) && lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening && lastMatchedQuotesPairsEndIsAt === isThisClosingIdx) {
        return true;
      }
    } // catching new attributes that follow after suspected quote.
    // Imagine
    // <a class "c" id 'e' href "www">
    //                 ^            ^
    //        known start at 16     suspected ending at 29

    if ( // if we're currently on some quote:
    "'\"".includes(str[i]) && ( // and if either quote count is an even number (the "!" checking is it zero)
    !(quotesCount.get("\"") % 2) || !(quotesCount.get("'") % 2)) && // and sum of quotes is odd, for example,
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
    (quotesCount.get("\"") + quotesCount.get("'")) % 2 && ( //
    // last chunk is not falsey (thus a string):
    lastCapturedChunk && // and finally, perf resource-taxing evaluation, is it recognised:
    htmlAllKnownAttributes.allHtmlAttribs.has(lastCapturedChunk) || // imagine
    // <z bbb"c" ddd'e'>
    //         ^
    //        a suspected closing
    //
    // alternatively, check the count of remaining quotes, ensure that
    // leading up to closing bracket, everything's neat (not overlapping
    // at least and opened and closed)
    // this catch is for the following attributes, for example,
    // <z bbb"c" ddd'e'>
    //       ^      ^
    //     start   suspected ending
    i > isThisClosingIdx + 1 && htmlAllKnownAttributes.allHtmlAttribs.has(str.slice(isThisClosingIdx + 1, i).trim())) && //
    // the same quote doesn't follow on the right,
    // think <div style="float:"left"">z</div>
    //                  ^           ^
    //               start    suspected closing
    !(str[i + 1] === str[i] && str[i] === str[idxOfAttrOpening]) && //
    //
    // and it's not this case:
    //
    // <div style="float:'left'">z</div>
    //            ^      ^
    //         start   suspected
    //
    // we're here:
    // <div style="float:'left'">z</div>
    //                        ^
    //                       here
    !( // we're part the suspected closing, on another closing
    i > isThisClosingIdx + 1 && // colon is to the left of suspected
    str[stringLeftRight.left(str, isThisClosingIdx)] === ":") && //
    // the suspected quote is the fourth,
    // <div style="float:'left'">z</div>
    //            ^            ^
    //          start        suspected
    //
    // we want to exclude the quote on the left:
    // <div style="float:'left'">z</div>
    //                        ^
    //                       this
    //
    // in which case, we'd have:
    // lastCapturedChunk = "left"
    // secondLastCapturedChunk = "float:"
    !(lastCapturedChunk && secondLastCapturedChunk && secondLastCapturedChunk.trim().endsWith(":"))) { // rules:
      // before suspected index this pattern is falsey, after - truthy

      var R0 = i > isThisClosingIdx; //

      var R1 = !!openingQuote;
      var R2 = str[idxOfAttrOpening] !== str[isThisClosingIdx];
      var R3 = htmlAllKnownAttributes.allHtmlAttribs.has(str.slice(idxOfAttrOpening + 1, isThisClosingIdx).trim()); // that quote we suspected as closing, is from an opening-closing
      // set on another attribute:

      var R4 = !xBeforeYOnTheRight(str, i + 1, str[isThisClosingIdx], makeTheQuoteOpposite(str[isThisClosingIdx])); // const R5 = plausibleAttrStartsAtX(str, start) // consider:
      // <z alt"href' www'/>
      //       ^    ^
      //    start   suspected ending
      // let's rule out the case where a whole (suspected) attribute's value is
      // a known attribute value, plus quotes mismatch plus that closing quote
      // is on the right, before the its opposite kind
      return R0 && !(R1 && R2 && R3 && R4);
    }

    if ( // imagine
    // <a href=www" class=e'>
    //         ^  ^
    //     start  suspected
    // if it's equal following attribute name
    (str[i] === "=" || // OR
    // it's whitespace
    !str[i].length && // and next non-whitespace character is "equal" character
    str[stringLeftRight.right(str, i)] === "=") && // last chunk is not falsey (thus a string)
    lastCapturedChunk && // and finally, perf resource-taxing evaluation, is it recognised:
    htmlAllKnownAttributes.allHtmlAttribs.has(lastCapturedChunk)) {
      // definitely that's new attribute starting
      var W1 = i > isThisClosingIdx;
      var W2 = // insurance against:
      // <z alt"href' www' id=z"/>
      //       ^         ^
      //     start      suspected ending
      //
      // <z alt"href' www' id=z"/>
      //                       ^
      //                    we're here currently
      !(!( //
      // first, rule out healthy code scenarios,
      // <a href="zzz" target="_blank" style="color: black;">
      //         ^   ^       ^
      //        /    |        \
      //   start   suspected   we're here
      lastQuoteWasMatched && lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening && lastMatchedQuotesPairsEndIsAt === isThisClosingIdx || // or quotes can be mismatching, but last chunk's start should
      // match a confirmed attribute regex (with matching quotes and
      // equal present)
      guaranteedAttrStartsAtX(str, chunkStartsAt)) && //
      // continuing with catch clauses of the insurance case:
      lastQuoteWasMatched && lastMatchedQuotesPairsStartIsAt !== undefined && lastMatchedQuotesPairsStartIsAt <= isThisClosingIdx);
      return W1 && W2;
    } // when index "isThisClosingIdx" has been passed...


    if (i > isThisClosingIdx) { // if current quote matches the opening

      if (openingQuote && str[i] === openingQuote) { // we want to return false as default...
        // except if we're able to extract a clean recognised attribute name
        // in front of here and prove that it's actually a new attribute starting
        // here, then it's true
        // imagine
        // <img alt="somethin' fishy going on' class">z<a class="y">
        //          ^                        ^      ^
        //         start            suspected       we're here

        var Y1 = !!lastQuoteAt;
        var Y2 = lastQuoteAt === isThisClosingIdx; // ensure there's some content between suspected and "here":

        var Y3 = lastQuoteAt + 1 < i && str.slice(lastQuoteAt + 1, i).trim();
        var Y4 = str.slice(lastQuoteAt + 1, i).trim().split(/\s+/).every(function (chunk) {
          return htmlAllKnownAttributes.allHtmlAttribs.has(chunk);
        });
        var Y5 = i >= isThisClosingIdx;
        var Y6 = !str[stringLeftRight.right(str, i)] || !"'\"".includes(str[stringLeftRight.right(str, i)]);
        return !!(Y1 && Y2 && Y3 && Y4 && Y5 && Y6);
      } // if we have passed the suspected closing quote
      // and we meet another quote of the same kind,
      // it's false result. Imagine code:
      // <img alt='so-called "artists"!" class='yo'/>
      //                     ^       ^
      //               questioned    |
      //                 index     we're here
      //                           so it's false


      if ( // if attribute starts with a quote
      openingQuote && // and we're suspecting a mismatching pair:
      str[isThisClosingIdx] === oppositeToOpeningQuote && // we're questioning, maybe current
      // suspected closing quote is of the
      // opposite kind (single-double, double-single)
      str[i] === oppositeToOpeningQuote) {
        return false;
      } // if the tag closing was met, that's fine, imagine:
      // <div class='c">.</div>
      //              ^
      //        we went past this suspected closing quote
      //        and reached the tag ending...


      if (str[i] === "/" || str[i] === ">" || str[i] === "<") { // happy path scenario

        var _R = // opening matches closing
        str[idxOfAttrOpening] === str[isThisClosingIdx] && // last captured quote was the suspected ("isThisClosingIdx")
        lastQuoteAt === isThisClosingIdx && // all is clean inside - there are no quotes of the ones used in
        // opening/closing (there can be opposite type quotes though)
        !str.slice(idxOfAttrOpening + 1, isThisClosingIdx).includes(str[idxOfAttrOpening]); // Not more than one pair of non-overlapping quotes should have been matched.


        var R11 = quotesCount.get("matchedPairs") < 2; // at least it's not a recognised attribute name on the left:

        var _attrNameCharsChunkOnTheLeft = findAttrNameCharsChunkOnTheLeft(str, i);

        var R12 = (!_attrNameCharsChunkOnTheLeft || !htmlAllKnownAttributes.allHtmlAttribs.has(_attrNameCharsChunkOnTheLeft)) && ( // avoid cases where multiple pairs of mismatching quotes were matched
        // we're past suspected closing:
        !(i > isThisClosingIdx && // and there were some single quotes recorded so far
        quotesCount.get("'") && // and doubles too
        quotesCount.get("\"") && // and there were few quote pairs matched
        quotesCount.get("matchedPairs") > 1) || // but add escape latch for when tag closing follows:
        // <img alt='so-called "artists"!"/>
        //          ^                    ^^
        //        start         suspected  currently we're on slash
        "/>".includes(str[stringLeftRight.right(str, i)]));

        var _R2 = totalQuotesCount < 3 || // there's only two quotes mismatching:
        quotesCount.get("\"") + quotesCount.get("'") - quotesCount.get("matchedPairs") * 2 !== 2;

        var R31 = !lastQuoteWasMatched || lastQuoteWasMatched && !(lastMatchedQuotesPairsStartIsAt !== undefined && Array.from(str.slice(idxOfAttrOpening + 1, lastMatchedQuotesPairsStartIsAt).trim()).every(function (char) {
          return isCharSuitableForHtmlAttrName.isAttrNameChar(char);
        }) && htmlAllKnownAttributes.allHtmlAttribs.has(str.slice(idxOfAttrOpening + 1, lastMatchedQuotesPairsStartIsAt).trim()));
        var R32 = !stringLeftRight.right(str, i) && totalQuotesCount % 2 === 0;
        var R33 = str[idxOfAttrOpening - 2] && str[idxOfAttrOpening - 1] === "=" && isCharSuitableForHtmlAttrName.isAttrNameChar(str[idxOfAttrOpening - 2]);
        var R34 = !ensureXIsNotPresentBeforeOneOfY(str, i + 1, "<", ["='", "=\""]);
        return (// happy path - known opening matched suspected closing and
          // that suspected closing was the last captured quote ("lastQuoteAt")
          //
          _R || // The matched pair count total has not reach or exceed two
          //
          // because we're talking about fully matched opening-closing quote
          // pairs.
          //
          // Let me remind you the question algorithm is answering:
          // Is quote at index y closing quote, considering opening is at x?
          //
          // Now, imagine we went past index y, reached index z, and up to
          // this point two sets of quotes were caught, as in:
          // <z bbb"c" ddd"e">
          //       ^        ^
          //     start     we're here, quote in question
          //
          // above, that's falsey result, it can't be fourth caught quote!
          (R11 || R12) && // besides that,
          // We need to account for mismatching quote pair. If a pair is
          // mismatching, "matchedPairs" might not get bumped to two thus
          // leading to a mistake.
          // When pair is mismatching, we can tell it's so because total count
          // minus matched count times two would be equal to two - two
          // quotes left unmatched.
          // Mind you, it's not more because algorithm would exit by the time
          // we would reach 4 let's say...
          // either there's not more than one pair:
          _R2 && ( // also, protection against cases like:
          // <z bbb"c" ddd'e>
          //       ^      ^
          //   start     suspected
          //
          // in case above, all the clauses up until now pass
          //
          // we need to check against "lastQuoteWasMatched" flag
          //
          //
          // or last pair was matched:
          R31 || // either this closing bracket is the last:
          R32 || // or char before starting is equal and char before that
          // satisfies attribute name requirements
          R33 || // or it seems like it's outside rather inside a tag:
          R34)
        );
      } // if the true attribute ending was met passing
      // past the suspected one, this means that
      // suspected one was a false guess. Correct ending
      // is at this index "i"


      if (str[i] === "=" && stringMatchLeftRight.matchRight(str, i, ["'", "\""], {
        trimBeforeMatching: true,
        trimCharsBeforeMatching: ["="]
      })) {
        return true;
      }
    } else { // this clause is meant to catch the suspected quotes
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
      var firstNonWhitespaceCharOnTheLeft = void 0;

      if (str[i - 1] && str[i - 1].trim() && str[i - 1] !== "=") {
        // happy path
        firstNonWhitespaceCharOnTheLeft = i - 1;
      } else {

        for (var y = i; y--;) {

          if (str[y].trim() && str[y] !== "=") {
            firstNonWhitespaceCharOnTheLeft = y;
            break;
          }
        }
      }

      if (str[i] === "=" && stringMatchLeftRight.matchRight(str, i, ["'", "\""], {
        // ensure it's not tag ending on the right
        // before freaking out:
        cb: function cb(char) {
          return !"/>".includes(char);
        },
        trimBeforeMatching: true,
        trimCharsBeforeMatching: ["="]
      }) && // ensure it's a character suitable for attribute
      // name on the left of equal (if it's a real
      // attribute name its name characters must pass
      // the isAttrNameChar()...)
      isCharSuitableForHtmlAttrName.isAttrNameChar(str[firstNonWhitespaceCharOnTheLeft]) && // ensure it's not
      // <img src="https://z.com/r.png?a=" />
      //                                ^
      //                              here
      //
      // in which case it's a false positive!!!
      !str.slice(idxOfAttrOpening + 1).startsWith("http") && !str.slice(idxOfAttrOpening + 1, i).includes("/") && !str.endsWith("src=", idxOfAttrOpening) && !str.endsWith("href=", idxOfAttrOpening)) {
        return false;
      }

      if (i === isThisClosingIdx && guaranteedAttrStartsAtX(str, i + 1)) {
        return true;
      } // also some insurance for crazier patterns like:
      // <z alt"href" www'/>
      //        ^   |    ^
      //    start   |    suspected
      //            |
      //          currently on
      //
      // catch this pattern where initial equal to the left of start is missing
      // and this pattern implies equals will be missing further

      if (i < isThisClosingIdx && "'\"".includes(str[i]) && lastCapturedChunk && str[stringLeftRight.left(str, idxOfAttrOpening)] && str[stringLeftRight.left(str, idxOfAttrOpening)] !== "=" && lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening && htmlAllKnownAttributes.allHtmlAttribs.has(lastCapturedChunk)) {
        return false;
      } // catch
      // <div style="float:"left'">z</div>
      //            ^            ^
      //          start       we're here, and also it's suspected too
      //


      if (i === isThisClosingIdx && "'\"".includes(str[i]) && lastCapturedChunk && secondLastCapturedChunk && totalQuotesCount % 2 === 0 && secondLastCapturedChunk.endsWith(":")) {
        return true;
      }
    } //
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


    if ("'\"".includes(str[i]) && // if these quotes are after "isThisClosingIdx", a suspected closing
    i > isThisClosingIdx) {
      // if these quotes are after "isThisClosingIdx", if there
      // was no chunk recorded after it until now,
      // ("lastChunkWasCapturedAfterSuspectedClosing" flag)
      // or there was but it's not recognised, that's falsey result

      if ( // if there was no chunk recorded after it until now
      !lastChunkWasCapturedAfterSuspectedClosing || !lastCapturedChunk || // or there was but lastCapturedChunk is not recognised
      !htmlAllKnownAttributes.allHtmlAttribs.has(lastCapturedChunk)) {
        return false;
      } // ELSE - it does match, so it seems legit
      return true;
    } // at the bottom, PART II of catch quotes


    if ("'\"".includes(str[i])) {
      lastQuoteAt = i;
    } // at the bottom, PART II of reset chunk


    if (chunkStartsAt && !isCharSuitableForHtmlAttrName.isAttrNameChar(str[i])) {
      chunkStartsAt = null;
    } // logging
    // -----------------------------------------------------------------------------
  } // if this point was reached and loop didn't exit...
  // default is false
  return false;
}

exports.isAttrClosing = isAttrClosing;
exports.version = version$1;
