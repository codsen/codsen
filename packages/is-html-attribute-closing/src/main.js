import { allHtmlAttribs } from "html-all-known-attributes";
import charSuitableForHTMLAttrName from "is-char-suitable-for-html-attr-name";
import { left, right } from "string-left-right";
import split from "string-split-by-whitespace";
import { matchRight } from "string-match-left-right";
import {
  ensureXIsNotPresentBeforeOneOfY,
  xBeforeYOnTheRight,
  plausibleAttrStartsAtX,
  guaranteedAttrStartsAtX,
} from "./util";

function makeTheQuoteOpposite(quoteChar) {
  return quoteChar === `'` ? `"` : `'`;
}

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
      `028 ${`\u001b[${31}m${`WRONG INPUTS, RETURN FALSE`}\u001b[${39}m`}`
    );
    return false;
  }

  const openingQuote = `'"`.includes(str[idxOfAttrOpening])
    ? str[idxOfAttrOpening]
    : null;
  let oppositeToOpeningQuote = null;
  if (openingQuote) {
    oppositeToOpeningQuote = makeTheQuoteOpposite(openingQuote);
  }
  console.log(
    `041 ${`\u001b[${33}m${`openingQuote`}\u001b[${39}m`}: ${`\u001b[${35}m${openingQuote}\u001b[${39}m`}   ${`\u001b[${33}m${`oppositeToOpeningQuote`}\u001b[${39}m`}: ${`\u001b[${35}m${oppositeToOpeningQuote}\u001b[${39}m`}`
  );

  let chunkStartsAt;
  const quotesCount = new Map().set(`'`, 0).set(`"`, 0).set(`matchedPairs`, 0);

  let lastQuoteAt = null;
  let totalQuotesCount = 0;
  let lastQuoteWasMatched = false;
  let lastMatchedQuotesPairsStartIsAt = false;
  let lastMatchedQuotesPairsEndIsAt = false;

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

  // does what it says on the tin - flips on the first instance
  let closingBracketMet = false;
  let openingBracketMet = false;

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

    if (
      // Imagine we're here:
      // <z bbb"c" ddd'e>
      //       ^      ^
      //   start     suspected closing
      //
      // this single quote at 13 is preceded by fully matched pair of quotes
      // there's also attribute-name-like chunk preceding in front.
      // Let's catch such case.
      //
      // 1. we're on a quote
      `'"`.includes(str[i]) &&
      // 2. we ensure that a pair of quotes was catched so far
      lastQuoteWasMatched &&
      // 3. lastMatchedQuotesPairsStartIsAt is our known opening
      lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening &&
      // 4. lastMatchedQuotesPairsEndIsAt is the last matched pair's closing:
      // <z bbb"c" ddd'e>
      //         ^
      //        this if to reuse the example..
      //
      lastMatchedQuotesPairsEndIsAt < i &&
      // rule must not trigger before the suspected quote index
      i >= isThisClosingIdx
    ) {
      console.log(`145 ███████████████████████████████████████`);
      console.log(
        `147 ${`\u001b[${33}m${`plausibleAttrStartsAtX(str, ${
          i + 1
        })`}\u001b[${39}m`} = ${JSON.stringify(
          plausibleAttrStartsAtX(str, i + 1),
          null,
          4
        )}`
      );

      console.log(
        `157 FIY, ${`\u001b[${33}m${`lastCapturedChunk`}\u001b[${39}m`} = ${JSON.stringify(
          lastCapturedChunk,
          null,
          4
        )}`
      );

      // ███████████████████████████████████████ E1
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
      const E1 =
        i !== isThisClosingIdx ||
        guaranteedAttrStartsAtX(str, right(str, isThisClosingIdx)) ||
        `/>`.includes(str[right(str, i)]);

      // ███████████████████████████████████████ E2
      //
      //
      // ensure it's not a triplet of quotes:
      // <img alt="so-called "artists"!' class='yo'/>
      //          ^          ^       ^
      //       start      suspected  |
      //                             current index
      //
      const E2 = !(
        i > isThisClosingIdx &&
        str[idxOfAttrOpening] === str[isThisClosingIdx] &&
        str[idxOfAttrOpening] === str[i] &&
        // rule out cases where plausible attribute starts:
        // <img class="so-called "alt"!' border='10'/>
        //            ^          ^   ^
        //        start          |    \
        //           suspected end    currently on
        plausibleAttrStartsAtX(str, i + 1)
      );

      // ███████████████████████████████████████ E3

      const E31 =
        // or a proper recognised attribute follows:
        // <img alt="so-called "artists"class='yo'/>
        //          ^                  ^
        //       start              suspected and currently on
        //
        // we're on a suspected quote
        i === isThisClosingIdx &&
        // plus one because we're on a quote
        plausibleAttrStartsAtX(str, isThisClosingIdx + 1);

      const E32 =
        // or the last chunk is a known attribute name:
        // <img class="so-called "alt"!' border='10'/>
        //            ^          ^
        //         start      suspected/we're currently on
        //
        chunkStartsAt &&
        chunkStartsAt < i &&
        allHtmlAttribs.has(str.slice(chunkStartsAt, i).trim());

      // imagine:
      // <z bbb"c" ddd"e'>
      //       ^ ^
      //      /  \
      //  start  suspected
      //
      // <z bbb"c" ddd"e'>
      //              ^
      //          currently on

      // E23, recognised attribute name is very weighty argument; however
      // in light of unrecognised attributes, we might still try to salvage
      // some, as long as they resemble valid attribute names. We just
      // validate each character and drop in more rules into the bag,
      // like requiring whitespace to be in front and opening/closing to match

      // there's a whitespace in front of last chunk ("ddd" in example above)
      const E33 =
        chunkStartsAt &&
        chunkStartsAt < i &&
        str[chunkStartsAt - 1] &&
        !str[chunkStartsAt - 1].trim().length &&
        // and whole chunk is a plausible attribute name
        Array.from(str.slice(chunkStartsAt, i).trim()).every((char) =>
          charSuitableForHTMLAttrName(char)
        ) &&
        // known opening and suspected closing are both singles or doubles
        str[idxOfAttrOpening] === str[isThisClosingIdx];

      // anti-rule - it's fine if we're on suspected ending and to the left
      // it's not an attribute start
      // <img alt='Deal is your's!"/>
      //          ^               ^
      //       start            suspected/current

      // extract attr name characters chunk on the left, "s" in the case below
      // <img alt='Deal is your's"/>
      //                         ^
      //                       start

      let attrNameCharsChunkOnTheLeft;
      if (
        i === isThisClosingIdx &&
        charSuitableForHTMLAttrName(str[left(str, i)])
      ) {
        for (let y = i; y--; ) {
          console.log(
            `283 ${`\u001b[${36}m${`str[y]`}\u001b[${39}m`} = ${JSON.stringify(
              str[y],
              null,
              4
            )}`
          );
          if (str[y].trim().length && !charSuitableForHTMLAttrName(str[y])) {
            attrNameCharsChunkOnTheLeft = str.slice(y + 1, i);
            break;
          }
        }
      }
      console.log(
        `296 CALCULATED ${`\u001b[${33}m${`attrNameCharsChunkOnTheLeft`}\u001b[${39}m`} = ${JSON.stringify(
          attrNameCharsChunkOnTheLeft,
          null,
          4
        )}`
      );

      const E34 =
        // we're on suspected
        i === isThisClosingIdx &&
        // it's not a character suitable for attr name,
        (!charSuitableForHTMLAttrName(str[left(str, i)]) ||
          // or it is, but whatever we extracted is not recognised attr name
          (attrNameCharsChunkOnTheLeft &&
            !allHtmlAttribs.has(attrNameCharsChunkOnTheLeft))) &&
        // rule out equal
        str[left(str, i)] !== "=";

      // ███████████████████████████████████████ E4

      const E41 =
        // either it's a tag ending and we're at the suspected quote
        `/>`.includes(str[right(str, i)]) && i === isThisClosingIdx;

      const E42 =
        // or next character is suitable for a tag name:
        charSuitableForHTMLAttrName(str[right(str, i)]);

      const E43 =
        // or in case of:
        // <img class="so-called "alt"!' border='10'/>
        //            ^          ^
        //          start      suspected
        //
        // where we're at:
        // <img class="so-called "alt"!' border='10'/>
        //                           ^
        //                          here
        lastQuoteWasMatched && i !== isThisClosingIdx;

      console.log(`336:`);
      console.log(`E1: ${`\u001b[${E1 ? 32 : 31}m${E1}\u001b[${39}m`}`);
      console.log(`E2: ${`\u001b[${E2 ? 32 : 31}m${E2}\u001b[${39}m`}`);
      console.log(
        `E3: ${`\u001b[${E31 ? 32 : 31}m${E31}\u001b[${39}m`} || ${`\u001b[${
          E32 ? 32 : 31
        }m${E32}\u001b[${39}m`} || ${`\u001b[${
          E33 ? 32 : 31
        }m${E33}\u001b[${39}m`} || ${`\u001b[${
          E34 ? 32 : 31
        }m${E34}\u001b[${39}m`} ==> ${`\u001b[${
          E31 || E32 || E33 || E34 ? 32 : 31
        }m${E31 || E32 || E33 || E34}\u001b[${39}m`}`
      );
      console.log(
        `E4: ${`\u001b[${E41 ? 32 : 31}m${E41}\u001b[${39}m`} || ${`\u001b[${
          E42 ? 32 : 31
        }m${E42}\u001b[${39}m`} || ${`\u001b[${
          E43 ? 32 : 31
        }m${E43}\u001b[${39}m`} ==> ${`\u001b[${E41 || E42 || E43 ? 32 : 31}m${
          E41 || E42 || E43
        }\u001b[${39}m`}`
      );

      return E1 && E2 && (E31 || E32 || E33 || E34) && (E41 || E42 || E43);
    }

    // catch quotes
    if (`'"`.includes(str[i])) {
      // catch the non-overlapping matched pairs of quotes
      // for example that's three pairs in total below:
      // <z bbb"c" ddd'e'>.<z fff"g">

      console.log(
        `370 FIY, ${`\u001b[${33}m${`lastQuoteAt`}\u001b[${39}m`} = ${JSON.stringify(
          lastQuoteAt,
          null,
          4
        )}; ${`\u001b[${33}m${`str[lastQuoteAt]`}\u001b[${39}m`}: ${
          str[lastQuoteAt]
        }`
      );
      if (lastQuoteAt && str[i] === str[lastQuoteAt]) {
        quotesCount.set("matchedPairs", quotesCount.get("matchedPairs") + 1);
        lastMatchedQuotesPairsStartIsAt = lastQuoteAt;
        lastMatchedQuotesPairsEndIsAt = i;
        lastQuoteAt = null;

        lastQuoteWasMatched = true;
        console.log(
          `386 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastQuoteWasMatched`}\u001b[${39}m`} = ${JSON.stringify(
            lastQuoteWasMatched,
            null,
            4
          )}`
        );
      } else {
        lastQuoteWasMatched = false;
        console.log(
          `395 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastQuoteWasMatched`}\u001b[${39}m`} = ${JSON.stringify(
            lastQuoteWasMatched,
            null,
            4
          )}`
        );
      }

      // bump total counts:
      quotesCount.set(str[i], quotesCount.get(str[i]) + 1);

      totalQuotesCount = quotesCount.get(`"`) + quotesCount.get(`'`);

      // lastQuoteAt = i;
      // console.log(
      //   `325 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastQuoteAt`}\u001b[${39}m`} = ${JSON.stringify(
      //     lastQuoteAt,
      //     null,
      //     4
      //   )}`
      // );
    }

    // catch closing brackets
    if (str[i] === ">" && !closingBracketMet) {
      closingBracketMet = true;
      console.log(
        `422 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`closingBracketMet`}\u001b[${39}m`} = ${JSON.stringify(
          closingBracketMet,
          null,
          4
        )}`
      );
    }

    // catch opening brackets
    if (str[i] === "<" && closingBracketMet && !openingBracketMet) {
      openingBracketMet = true;
      console.log(
        `434 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`openingBracketMet`}\u001b[${39}m`} = ${JSON.stringify(
          openingBracketMet,
          null,
          4
        )}`
      );

      // if it's past the "isThisClosingIdx", that's very falsey
      if (i > isThisClosingIdx) {
        console.log(
          `444 new tag starts - ${`\u001b[${31}m${`RETURN FALSE`}\u001b[${39}m`}`
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
      console.log(`486 inside the attr name START catching clauses`);
      // <img alt="so-called "artists"!' class='yo'/>
      //                              ^
      //                         we land here, on excl. mark
      if (charSuitableForHTMLAttrName(str[i])) {
        console.log(
          `492 ${`\u001b[${32}m${`██ new attribute name starts`}\u001b[${39}m`}`
        );
        chunkStartsAt = i;
        console.log(
          `496 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`chunkStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
            chunkStartsAt,
            null,
            4
          )}`
        );
      }
    } else if (chunkStartsAt && !charSuitableForHTMLAttrName(str[i])) {
      console.log(`504 inside the attr name END catching clauses`);

      // ending of an attr name chunk
      console.log(
        `508 ${`\u001b[${32}m${`EXTRACTED`}\u001b[${39}m`}: "${str.slice(
          chunkStartsAt,
          i
        )}"`
      );
      lastCapturedChunk = str.slice(chunkStartsAt, i);
      lastChunkWasCapturedAfterSuspectedClosing =
        chunkStartsAt >= isThisClosingIdx;

      // console.log(
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
      if (
        `'"`.includes(str[i]) &&
        quotesCount.get(`matchedPairs`) === 0 &&
        totalQuotesCount === 3 &&
        str[idxOfAttrOpening] === str[i] &&
        allHtmlAttribs.has(lastCapturedChunk)
      ) {
        console.log(
          `538 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${
            i > isThisClosingIdx
          }`
        );
        console.log(
          `543 FIY, ${`\u001b[${33}m${`lastQuoteAt`}\u001b[${39}m`} = ${JSON.stringify(
            lastQuoteAt,
            null,
            4
          )}`
        );

        console.log(
          `SPLIT: ${JSON.stringify(
            split(str.slice(lastQuoteAt + 1, i)),
            null,
            4
          )}`
        );

        const A1 = i > isThisClosingIdx;
        //
        // ensure that all continuous chunks since the last quote are
        // recognised attribute names
        const A21 = !lastQuoteAt;
        const A22 = lastQuoteAt + 1 >= i;
        const A23 = split(str.slice(lastQuoteAt + 1, i)).every((chunk) =>
          allHtmlAttribs.has(chunk)
        );

        const B1 = i === isThisClosingIdx;
        const B21 = totalQuotesCount < 3;
        const B22 = !!lastQuoteWasMatched;
        const B23 = !lastQuoteAt;
        const B24 = lastQuoteAt + 1 >= i;
        const B25 = !split(str.slice(lastQuoteAt + 1, i)).every((chunk) =>
          allHtmlAttribs.has(chunk)
        );

        console.log(`577:`);
        console.log(
          `(A1=${`\u001b[${
            A1 ? 32 : 31
          }m${A1}\u001b[${39}m`} && (A21=${`\u001b[${
            A21 ? 32 : 31
          }m${A21}\u001b[${39}m`} || A22=${`\u001b[${
            A22 ? 32 : 31
          }m${A22}\u001b[${39}m`} || A23=${`\u001b[${
            A23 ? 32 : 31
          }m${A23}\u001b[${39}m`})) ==> ${`\u001b[${
            A1 && (A21 || A22 || A23) ? 32 : 31
          }m${A1 && (A21 || A22 || A23)}\u001b[${39}m`}`
        );
        console.log(`OR`);
        console.log(
          `(B1=${`\u001b[${
            B1 ? 32 : 31
          }m${B1}\u001b[${39}m`} && (B21=${`\u001b[${
            B21 ? 32 : 31
          }m${B21}\u001b[${39}m`} || B22=${`\u001b[${
            B22 ? 32 : 31
          }m${B22}\u001b[${39}m`} || B23=${`\u001b[${
            B23 ? 32 : 31
          }m${B23}\u001b[${39}m`} || B24=${`\u001b[${
            B24 ? 32 : 31
          }m${B24}\u001b[${39}m`} || B25=${`\u001b[${
            B25 ? 32 : 31
          }m${B25}\u001b[${39}m`})) ==> ${`\u001b[${
            B1 && (B21 || B22 || B23 || B24 || B25) ? 32 : 31
          }m${B1 && (B21 || B22 || B23 || B24 || B25)}\u001b[${39}m`}`
        );

        return (
          (A1 && (A21 || A22 || A23)) ||
          (B1 && (B21 || B22 || B23 || B24 || B25))
        );
      } else if (
        // this is a recognised attribute
        lastCapturedChunk &&
        allHtmlAttribs.has(lastCapturedChunk) &&
        lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening &&
        lastMatchedQuotesPairsEndIsAt === isThisClosingIdx
      ) {
        console.log(`621 pattern: matched pair + attribute name after`);
        console.log(`622 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} true`);
        return true;
      }
    }

    // catching new attributes that follow after suspected quote.
    // Imagine
    // <a class "c" id 'e' href "www">
    //                 ^            ^
    //        known start at 16     suspected ending at 29
    console.log(
      `633 ${
        i > isThisClosingIdx + 1
          ? `FIY, the trim [${isThisClosingIdx + 1}, ${i}]: "${str
              .slice(isThisClosingIdx + 1, i)
              .trim()}"`
          : "z"
      }`
    );
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
      //
      // last chunk is not falsey (thus a string):
      ((lastCapturedChunk &&
        // and finally, perf resource-taxing evaluation, is it recognised:
        allHtmlAttribs.has(lastCapturedChunk)) ||
        // imagine
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
        (i > isThisClosingIdx + 1 &&
          allHtmlAttribs.has(str.slice(isThisClosingIdx + 1, i).trim())))
    ) {
      console.log(`679 FIY, doubles count: ${quotesCount.get(`"`)}`);
      console.log(`680 FIY, singles count: ${quotesCount.get(`'`)}`);
      console.log(
        `682 FIY, ${`\u001b[${33}m${`chunkStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
          chunkStartsAt,
          null,
          4
        )}`
      );

      // rules:

      // before suspected index this pattern is falsey, after - truthy
      const R0 = i > isThisClosingIdx;

      //
      const R1 = !!openingQuote;
      const R2 = str[idxOfAttrOpening] !== str[isThisClosingIdx];
      const R3 = allHtmlAttribs.has(
        str.slice(idxOfAttrOpening + 1, isThisClosingIdx).trim()
      );

      // that quote we suspected as closing, is from an opening-closing
      // set on another attribute:
      const R4 = !xBeforeYOnTheRight(
        str,
        i + 1,
        str[isThisClosingIdx],
        makeTheQuoteOpposite(str[isThisClosingIdx])
      );

      // const R5 = plausibleAttrStartsAtX(str, start)

      console.log(`R0: ${`\u001b[${R0 ? 32 : 31}m${R0}\u001b[${39}m`}`);
      console.log(`&&`);

      // consider:
      // <z alt"href' www'/>
      //       ^    ^
      //    start   suspected ending

      // let's rule out the case where a whole (suspected) attribute's value is
      // a known attribute value, plus quotes mismatch plus that closing quote
      // is on the right, before the its opposite kind
      console.log(`!(`);
      console.log(`R1: ${`\u001b[${R1 ? 32 : 31}m${R1}\u001b[${39}m`}`);
      console.log(`R2: ${`\u001b[${R2 ? 32 : 31}m${R2}\u001b[${39}m`}`);
      console.log(`R3: ${`\u001b[${R3 ? 32 : 31}m${R3}\u001b[${39}m`}`);
      console.log(`R4: ${`\u001b[${R4 ? 32 : 31}m${R4}\u001b[${39}m`}`);
      console.log(
        `) ==> ${`\u001b[${!(R1 && R2 && R3 && R4) ? 32 : 31}m${!(
          R1 &&
          R2 &&
          R3 &&
          R4
        )}\u001b[${39}m`}`
      );

      console.log(`737 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`);

      return R0 && !(R1 && R2 && R3 && R4);
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

      const W1 = i > isThisClosingIdx;
      const W2 = // insurance against:
        // <z alt"href' www' id=z"/>
        //       ^         ^
        //     start      suspected ending
        //
        // <z alt"href' www' id=z"/>
        //                       ^
        //                    we're here currently
        !(
          !(
            //
            // first, rule out healthy code scenarios,
            // <a href="zzz" target="_blank" style="color: black;">
            //         ^   ^       ^
            //        /    |        \
            //   start   suspected   we're here
            (
              (lastQuoteWasMatched &&
                lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening &&
                lastMatchedQuotesPairsEndIsAt === isThisClosingIdx) ||
              // or quotes can be mismatching, but last chunk's start should
              // match a confirmed attribute regex (with matching quotes and
              // equal present)
              guaranteedAttrStartsAtX(str, chunkStartsAt)
            )
          ) &&
          //
          // continuing with catch clauses of the insurance case:
          lastQuoteWasMatched &&
          lastMatchedQuotesPairsStartIsAt &&
          lastMatchedQuotesPairsStartIsAt <= isThisClosingIdx
        );

      console.log(`794 new attr starting`);
      console.log(
        `W1=${`\u001b[${W1 ? 32 : 31}m${W1}\u001b[${39}m`} && W2=${`\u001b[${
          W2 ? 32 : 31
        }m${W2}\u001b[${39}m`} ===> ${`\u001b[${W1 && W2 ? 32 : 31}m${`RETURN ${
          W1 && W2
        }`}\u001b[${39}m`}`
      );

      return W1 && W2;
    }

    // when index "isThisClosingIdx" has been passed...
    if (i > isThisClosingIdx) {
      console.log(`808 i > isThisClosingIdx`);

      // if current quote matches the opening
      if (openingQuote && str[i] === openingQuote) {
        console.log(
          `813 a true opening quote matched beyond the suspected-one - ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`
        );
        console.log(
          `816 ! ${`\u001b[${33}m${`lastCapturedChunk`}\u001b[${39}m`} = ${JSON.stringify(
            lastCapturedChunk,
            null,
            4
          )}`
        );
        console.log(
          `823 ! ${`\u001b[${33}m${`lastQuoteAt`}\u001b[${39}m`} = ${JSON.stringify(
            lastQuoteAt,
            null,
            4
          )}`
        );
        console.log(
          `830 ! ${`\u001b[${33}m${`isThisClosingIdx`}\u001b[${39}m`} = ${JSON.stringify(
            isThisClosingIdx,
            null,
            4
          )}`
        );

        // we want to return false as default...
        // except if we're able to extract a clean recognised attribute name
        // in front of here and prove that it's actually a new attribute starting
        // here, then it's true

        // imagine
        // <img alt="somethin' fishy going on' class">z<a class="y">
        //          ^                        ^      ^
        //         start            suspected       we're here

        const Y1 = !!lastQuoteAt;
        const Y2 = lastQuoteAt === isThisClosingIdx;

        // ensure there's some content between suspected and "here":
        const Y3 =
          lastQuoteAt + 1 < i && str.slice(lastQuoteAt + 1, i).trim().length;

        const Y4 = split(str.slice(lastQuoteAt + 1, i)).every((chunk) =>
          allHtmlAttribs.has(chunk)
        );
        const Y5 = i >= isThisClosingIdx;

        console.log(`Y1: ${`\u001b[${Y1 ? 32 : 31}m${Y1}\u001b[${39}m`}`);
        console.log(`Y2: ${`\u001b[${Y2 ? 32 : 31}m${Y2}\u001b[${39}m`}`);
        console.log(`Y3: ${`\u001b[${Y3 ? 32 : 31}m${Y3}\u001b[${39}m`}`);
        console.log(`Y4: ${`\u001b[${Y4 ? 32 : 31}m${Y4}\u001b[${39}m`}`);
        console.log(`Y5: ${`\u001b[${Y5 ? 32 : 31}m${Y5}\u001b[${39}m`}`);
        console.log(
          `865 ${`\u001b[${
            Y1 && Y2 && Y3 && Y4 && Y5 ? 32 : 31
          }m${`RETURN`}\u001b[${39}m`} Y1 && Y2 && Y3 && Y4 && Y5 ===> ${`\u001b[${
            Y1 && Y2 && Y3 && Y4 && Y5 ? 32 : 31
          }m${Y1 && Y2 && Y3 && Y4 && Y5}\u001b[${39}m`}`
        );

        return Y1 && Y2 && Y3 && Y4 && Y5;
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
          `894 another quote same as suspected was met - ${`\u001b[${31}m${`RETURN FALSE`}\u001b[${39}m`}`
        );
        return false;
      } // if the tag closing was met, that's fine, imagine:
      // <div class='c">.</div>
      //              ^
      //        we went past this suspected closing quote
      //        and reached the tag ending...
      else if (str[i] === "/" || str[i] === ">" || str[i] === "<") {
        console.log(`903 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`);

        // happy path scenario
        const R0 =
          // opening matches closing
          str[idxOfAttrOpening] === str[isThisClosingIdx] &&
          // last captured quote was the suspected ("isThisClosingIdx")
          lastQuoteAt === isThisClosingIdx &&
          // all is clean inside - there are no quotes of the ones used in
          // opening/closing (there can be opposite type quotes though)
          !str
            .slice(idxOfAttrOpening + 1, isThisClosingIdx)
            .includes(str[idxOfAttrOpening]);

        // Not more than one pair of non-overlapping quotes should have been matched.
        const R1 = quotesCount.get(`matchedPairs`) < 2;

        const R2 =
          totalQuotesCount < 3 ||
          // there's only two quotes mismatching:
          quotesCount.get(`"`) +
            quotesCount.get(`'`) -
            quotesCount.get(`matchedPairs`) * 2 !==
            2;

        const R31 =
          !lastQuoteWasMatched ||
          (lastQuoteWasMatched &&
            !(
              lastMatchedQuotesPairsStartIsAt &&
              Array.from(
                str
                  .slice(idxOfAttrOpening + 1, lastMatchedQuotesPairsStartIsAt)
                  .trim()
              ).every((char) => charSuitableForHTMLAttrName(char)) &&
              allHtmlAttribs.has(
                str
                  .slice(idxOfAttrOpening + 1, lastMatchedQuotesPairsStartIsAt)
                  .trim()
              )
            ));

        const R32 = !right(str, i) && totalQuotesCount % 2 === 0;

        const R33 =
          str[idxOfAttrOpening - 2] &&
          str[idxOfAttrOpening - 1] === "=" &&
          charSuitableForHTMLAttrName(str[idxOfAttrOpening - 2]);

        const R34 = !ensureXIsNotPresentBeforeOneOfY(str, i + 1, "<", [
          `='`,
          `="`,
        ]);

        console.log(`957:`);
        console.log(`R1: ${`\u001b[${R1 ? 32 : 31}m${R1}\u001b[${39}m`}`);
        console.log(`R2: ${`\u001b[${R2 ? 32 : 31}m${R2}\u001b[${39}m`}`);
        console.log("(");
        console.log(`  R31: ${`\u001b[${R31 ? 32 : 31}m${R31}\u001b[${39}m`}`);
        console.log(`  R32: ${`\u001b[${R32 ? 32 : 31}m${R32}\u001b[${39}m`}`);
        console.log(`  R33: ${`\u001b[${R33 ? 32 : 31}m${R33}\u001b[${39}m`}`);
        console.log(`  R34: ${`\u001b[${R34 ? 32 : 31}m${R34}\u001b[${39}m`}`);
        console.log(")");

        return (
          // happy path - known opening matched suspected closing and
          // that suspected closing was the last captured quote ("lastQuoteAt")
          //
          R0 || // The matched pair count total has not reach or exceed two
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
          (R1 &&
            // besides that,

            // We need to account for mismatching quote pair. If a pair is
            // mismatching, "matchedPairs" might not get bumped to two thus
            // leading to a mistake.
            // When pair is mismatching, we can tell it's so because total count
            // minus matched count times two would be equal to two - two
            // quotes left unmatched.
            // Mind you, it's not more because algorithm would exit by the time
            // we would reach 4 let's say...

            // either there's not more than one pair:
            R2 &&
            // also, protection against cases like:
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
            (R31 ||
              // either this closing bracket is the last:
              R32 ||
              // or char before starting is equal and char before that
              // satisfies attribute name requirements
              R33 ||
              // or it seems like it's outside rather inside a tag:
              R34))
        );
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
          `1036 new attribute starts - ${`\u001b[${32}m${`RETURN TRUE`}\u001b[${39}m`}`
        );
        return true;
      }
    } else {
      console.log(`1041 i <= isThisClosingIdx`);
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
      console.log(`1066 *`);
      let firstNonWhitespaceCharOnTheLeft;
      if (str[i - 1] && str[i - 1].trim().length && str[i - 1] !== "=") {
        // happy path
        firstNonWhitespaceCharOnTheLeft = i - 1;
      } else {
        console.log(`1072 traverse backwards`);
        for (let y = i; y--; ) {
          console.log(
            `1075 ${`\u001b[${33}m${`str[${y}]`}\u001b[${39}m`} = ${JSON.stringify(
              str[y],
              null,
              4
            )}`
          );
          if (str[y].trim().length && str[y] !== "=") {
            firstNonWhitespaceCharOnTheLeft = y;
            console.log(
              `1084 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`firstNonWhitespaceCharOnTheLeft`}\u001b[${39}m`} = ${JSON.stringify(
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
        `1095 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`firstNonWhitespaceCharOnTheLeft`}\u001b[${39}m`} = ${JSON.stringify(
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
          `1118 new attribute starts - ${`\u001b[${31}m${`RETURN FALSE`}\u001b[${39}m`}`
        );
        return false;
      }

      if (i === isThisClosingIdx && guaranteedAttrStartsAtX(str, i + 1)) {
        console.log(`1124 another attribute starts on the right!`);
        return true;
      }

      // also some insurance for crazier patterns like:
      // <z alt"href" www'/>
      //        ^   |    ^
      //    start   |    suspected
      //            |
      //          currently on
      //
      // catch this pattern where initial equal to the left of start is missing
      // and this pattern implies equals will be missing further
      console.log(
        `1138 ${`\u001b[${35}m${`██`}\u001b[${39}m`} ${`\u001b[${33}m${`lastCapturedChunk`}\u001b[${39}m`} = ${JSON.stringify(
          lastCapturedChunk,
          null,
          4
        )}`
      );

      if (
        i < isThisClosingIdx &&
        `'"`.includes(str[i]) &&
        lastCapturedChunk &&
        str[left(str, idxOfAttrOpening)] &&
        str[left(str, idxOfAttrOpening)] !== "=" &&
        lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening &&
        allHtmlAttribs.has(lastCapturedChunk)
      ) {
        console.log(
          `1155 freak out clause, it seems an attribute started in between start and suspected`
        );
        return false;
      }

      console.log(`1160 end of i <= isThisClosingIdx clauses`);
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
        `1198 FIY, ${`\u001b[${33}m${`lastCapturedChunk`}\u001b[${39}m`} = ${JSON.stringify(
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
          `1213 the slice "${str.slice(
            isThisClosingIdx,
            i
          )}" does not contain a new attribute name, ${`\u001b[${31}m${`RETURN FALSE`}\u001b[${39}m`}`
        );
        return false;
      }
      // ELSE - it does match, so it seems legit
      console.log(`1221 ${`\u001b[${32}m${`RETURN TRUE`}\u001b[${39}m`}`);
      return true;
    }

    // at the bottom, PART II of catch quotes
    if (`'"`.includes(str[i])) {
      lastQuoteAt = i;
      console.log(
        `1229 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastQuoteAt`}\u001b[${39}m`} = ${JSON.stringify(
          lastQuoteAt,
          null,
          4
        )}`
      );
    }

    // at the bottom, PART II of reset chunk
    if (chunkStartsAt && !charSuitableForHTMLAttrName(str[i])) {
      console.log(
        `1240 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`chunkStartsAt`}\u001b[${39}m`}`
      );
      chunkStartsAt = null;
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
      `${`\u001b[${90}m${`██ quotesCount: singles - ${quotesCount.get(
        `'`
      )};   doubles - ${quotesCount.get(
        `"`
      )};   matchedPairs - ${quotesCount.get(`matchedPairs`)}`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`██ totalQuotesCount - ${totalQuotesCount};   lastQuoteWasMatched - ${lastQuoteWasMatched}`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`██ lastMatchedQuotesPairsStartIsAt - ${lastMatchedQuotesPairsStartIsAt}; lastMatchedQuotesPairsEndIsAt - ${lastMatchedQuotesPairsEndIsAt}`}\u001b[${39}m`}`
    );
  }

  // if this point was reached and loop didn't exit...
  // default is false
  console.log(`1273 ${`\u001b[${31}m${`RETURN DEFAULT FALSE`}\u001b[${39}m`}`);
  return false;
}

export default isAttrClosing;
