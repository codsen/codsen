import { allHtmlAttribs } from "html-all-known-attributes";
import { isAttrNameChar } from "is-char-suitable-for-html-attr-name";
import { left, right } from "string-left-right";
import { matchRight } from "string-match-left-right";
import {
  ensureXIsNotPresentBeforeOneOfY,
  xBeforeYOnTheRight,
  plausibleAttrStartsAtX,
  guaranteedAttrStartsAtX,
  findAttrNameCharsChunkOnTheLeft,
  makeTheQuoteOpposite,
} from "./util";
import { version } from "../package.json";

function isAttrClosing(
  str: string,
  idxOfAttrOpening: number,
  isThisClosingIdx: number
): boolean {
  if (
    typeof str !== "string" ||
    !str.trim() ||
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

  let lastQuoteAt: number | null = null;
  let totalQuotesCount = 0;
  let lastQuoteWasMatched = false;
  let lastMatchedQuotesPairsStartIsAt: undefined | number;
  let lastMatchedQuotesPairsEndIsAt: undefined | number;

  // when suspected attribute name chunks end, we wipe them, but here
  // we store the last extracted chunk - then later, for example, when we
  // traverse further and meet opening quote (even with equal missing),
  // we can evaluate that chunk, was it a known attribute name (idea being,
  // known attribute name followed by quote is probably legit attribute starting)
  let lastCapturedChunk;
  let secondLastCapturedChunk;

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
        str[i] && str[i].trim() ? str[i] : JSON.stringify(str[i], null, 4)
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
      lastMatchedQuotesPairsEndIsAt !== undefined &&
      lastMatchedQuotesPairsEndIsAt < i &&
      // rule must not trigger before the suspected quote index
      i >= isThisClosingIdx
    ) {
      console.log(`144 ███████████████████████████████████████`);
      console.log(
        `146 ${`\u001b[${33}m${`plausibleAttrStartsAtX(str, ${
          i + 1
        })`}\u001b[${39}m`} = ${JSON.stringify(
          plausibleAttrStartsAtX(str, i + 1),
          null,
          4
        )}`
      );

      console.log(
        `156 FIY, ${`\u001b[${33}m${`lastCapturedChunk`}\u001b[${39}m`} = ${JSON.stringify(
          lastCapturedChunk,
          null,
          4
        )}; ${`\u001b[${33}m${`secondLastCapturedChunk`}\u001b[${39}m`} = ${JSON.stringify(
          secondLastCapturedChunk,
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
        guaranteedAttrStartsAtX(str, right(str, isThisClosingIdx) as number) ||
        `/>`.includes(str[right(str, i) as number]);

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

      let plausibleAttrName;
      if (chunkStartsAt) {
        plausibleAttrName = str.slice(chunkStartsAt, i).trim();
      }
      console.log(
        `259 ${`\u001b[${33}m${`plausibleAttrName`}\u001b[${39}m`} = ${JSON.stringify(
          plausibleAttrName,
          null,
          4
        )}`
      );
      const E33 =
        chunkStartsAt &&
        chunkStartsAt < i &&
        str[chunkStartsAt - 1] &&
        !str[chunkStartsAt - 1].trim() &&
        // and whole chunk is a plausible attribute name
        Array.from(str.slice(chunkStartsAt, i).trim()).every((char) =>
          isAttrNameChar(char)
        ) &&
        // known opening and suspected closing are both singles or doubles
        str[idxOfAttrOpening] === str[isThisClosingIdx] &&
        !`/>`.includes(str[right(str, i) as number]) &&
        ensureXIsNotPresentBeforeOneOfY(str, i + 1, "=", [`'`, `"`]);

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
      if (i === isThisClosingIdx) {
        attrNameCharsChunkOnTheLeft = findAttrNameCharsChunkOnTheLeft(str, i);
      }
      console.log(
        `295 CALCULATED ${`\u001b[${33}m${`attrNameCharsChunkOnTheLeft`}\u001b[${39}m`} = ${JSON.stringify(
          attrNameCharsChunkOnTheLeft,
          null,
          4
        )}`
      );

      const E34 =
        // we're on suspected
        i === isThisClosingIdx &&
        // it's not a character suitable for attr name,
        (!isAttrNameChar(str[left(str, i) as number]) ||
          // or it is, but whatever we extracted is not recognised attr name
          (attrNameCharsChunkOnTheLeft &&
            !allHtmlAttribs.has(attrNameCharsChunkOnTheLeft))) &&
        // rule out equal
        str[left(str, i) as number] !== "=";

      // ███████████████████████████████████████ E4

      const E41 =
        // either it's a tag ending and we're at the suspected quote
        `/>`.includes(str[right(str, i) as number]) && i === isThisClosingIdx;

      const E42 =
        // or next character is suitable for a tag name:
        isAttrNameChar(str[right(str, i) as number]);

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

      const E5 =
        // it's not a double-wrapped attribute value:
        //
        // <div style="float:"left"">z</div>
        //            ^      ^
        //          start   suspected
        //
        // we're at:
        // <div style="float:"left"">z</div>
        //                        ^
        //                      here
        !(
          // rule must not trigger before the suspected quote index
          (
            i >= isThisClosingIdx &&
            // there's colon to the left of a suspected quote
            str[left(str, isThisClosingIdx) as number] === ":"
          )
        );

      console.log(`355 RES:`);
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
      console.log(`E5: ${`\u001b[${E5 ? 32 : 31}m${E5}\u001b[${39}m`}`);

      return !!(
        E1 &&
        E2 &&
        (E31 || E32 || E33 || E34) &&
        (E41 || E42 || E43) &&
        E5
      );
    }

    // catch quotes
    if (`'"`.includes(str[i])) {
      // catch the non-overlapping matched pairs of quotes
      // for example that's three pairs in total below:
      // <z bbb"c" ddd'e'>.<z fff"g">

      // Insurace against the Killer Triplet - a quoted quote
      if (
        (str[i] === `'` && str[i - 1] === `"` && str[i + 1] === `"`) ||
        (str[i] === `"` && str[i - 1] === `'` && str[i + 1] === `'`)
      ) {
        console.log(
          `397 killer triplet detected - ${`\u001b[${31}m${`CONTINUE`}\u001b[${39}m`}`
        );
        continue;
      }

      console.log(
        `403 FIY, ${`\u001b[${33}m${`lastQuoteAt`}\u001b[${39}m`} = ${JSON.stringify(
          lastQuoteAt,
          null,
          4
        )}; ${`\u001b[${33}m${`str[lastQuoteAt]`}\u001b[${39}m`}: ${
          str[lastQuoteAt as any]
        }`
      );
      if (lastQuoteAt && str[i] === str[lastQuoteAt]) {
        console.log(`412 quotes matching`);
        quotesCount.set("matchedPairs", quotesCount.get("matchedPairs") + 1);
        lastMatchedQuotesPairsStartIsAt = lastQuoteAt;
        lastMatchedQuotesPairsEndIsAt = i;
        lastQuoteAt = null;

        lastQuoteWasMatched = true;
        console.log(
          `420 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastQuoteWasMatched`}\u001b[${39}m`} = ${JSON.stringify(
            lastQuoteWasMatched,
            null,
            4
          )}`
        );
      } else {
        console.log(`427 quotes not matching`);
        lastQuoteWasMatched = false;
        console.log(
          `430 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastQuoteWasMatched`}\u001b[${39}m`} = ${JSON.stringify(
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
        `457 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`closingBracketMet`}\u001b[${39}m`} = ${JSON.stringify(
          closingBracketMet,
          null,
          4
        )}`
      );

      // if all pairs of quotes were met, that's a good indicator, imagine
      // <z bbb"c" ddd'e'>
      //                 ^
      if (
        totalQuotesCount &&
        quotesCount.get(`matchedPairs`) &&
        totalQuotesCount === quotesCount.get(`matchedPairs`) * 2 &&
        // we haven't reached the suspected quote and tag's already ending
        i < isThisClosingIdx
      ) {
        console.log(
          `475 all quotes matched so far and it looks like tag ending`
        );
        console.log(`477 RETURN false`);
        return false;
      }
    }

    // catch opening brackets
    if (str[i] === "<" && closingBracketMet && !openingBracketMet) {
      openingBracketMet = true;
      console.log(
        `486 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`openingBracketMet`}\u001b[${39}m`} = ${JSON.stringify(
          openingBracketMet,
          null,
          4
        )}`
      );

      // if it's past the "isThisClosingIdx", that's very falsey
      // if (i > isThisClosingIdx) {
      console.log(
        `496 new tag starts - ${`\u001b[${31}m${`RETURN FALSE`}\u001b[${39}m`}`
      );
      return false;
      // }
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

    if (str[i].trim() && !chunkStartsAt) {
      console.log(`538 inside the attr name START catching clauses`);
      // <img alt="so-called "artists"!' class='yo'/>
      //                              ^
      //                         we land here, on excl. mark
      if (isAttrNameChar(str[i])) {
        console.log(
          `544 ${`\u001b[${32}m${`██ new attribute name starts`}\u001b[${39}m`}`
        );
        chunkStartsAt = i;
        console.log(
          `548 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`chunkStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
            chunkStartsAt,
            null,
            4
          )}`
        );
      }
    } else if (chunkStartsAt && !isAttrNameChar(str[i])) {
      console.log(`556 inside the attr name END catching clauses`);

      // ending of an attr name chunk
      console.log(
        `560 ${`\u001b[${32}m${`EXTRACTED`}\u001b[${39}m`}: "${str.slice(
          chunkStartsAt,
          i
        )}"`
      );
      secondLastCapturedChunk = lastCapturedChunk;
      lastCapturedChunk = str.slice(chunkStartsAt, i);
      console.log(
        `568 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastCapturedChunk`}\u001b[${39}m`} = ${JSON.stringify(
          lastCapturedChunk,
          null,
          4
        )}; ${`\u001b[${33}m${`secondLastCapturedChunk`}\u001b[${39}m`} = ${JSON.stringify(
          secondLastCapturedChunk,
          null,
          4
        )}`
      );

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
        allHtmlAttribs.has(lastCapturedChunk) &&
        !`'"`.includes(str[right(str, i) as number])
      ) {
        console.log(
          `604 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${
            i > isThisClosingIdx
          }`
        );
        console.log(
          `609 FIY, ${`\u001b[${33}m${`lastQuoteAt`}\u001b[${39}m`} = ${JSON.stringify(
            lastQuoteAt,
            null,
            4
          )}`
        );

        console.log(
          `SPLIT: ${JSON.stringify(
            str
              .slice((lastQuoteAt as number) + 1, i)
              .trim()
              .split(/\s+/),
            null,
            4
          )}`
        );

        const A1 = i > isThisClosingIdx;
        //
        // ensure that all continuous chunks since the last quote are
        // recognised attribute names
        const A21 = !lastQuoteAt;
        const A22 = (lastQuoteAt as number) + 1 >= i;
        const A23 = str
          .slice((lastQuoteAt as number) + 1, i)
          .trim()
          .split(/\s+/)
          .every((chunk) => allHtmlAttribs.has(chunk));

        // <div style="float:'left"">z</div>
        //            ^           ^
        //          start      we're here
        const A3 =
          !lastCapturedChunk ||
          !secondLastCapturedChunk ||
          !secondLastCapturedChunk.endsWith(":");

        const B1 = i === isThisClosingIdx;
        const B21 = totalQuotesCount < 3;
        const B22 = !!lastQuoteWasMatched;
        const B23 = !lastQuoteAt;
        const B24 = (lastQuoteAt as number) + 1 >= i;
        const B25 = !str
          .slice((lastQuoteAt as number) + 1, i)
          .trim()
          .split(/\s+/)
          .every((chunk) => allHtmlAttribs.has(chunk));

        console.log(`658:`);
        console.log(
          `(A1=${`\u001b[${
            A1 ? 32 : 31
          }m${A1}\u001b[${39}m`} && (A21=${`\u001b[${
            A21 ? 32 : 31
          }m${A21}\u001b[${39}m`} || A22=${`\u001b[${
            A22 ? 32 : 31
          }m${A22}\u001b[${39}m`} || A23=${`\u001b[${
            A23 ? 32 : 31
          }m${A23}\u001b[${39}m`}) && A3=${`\u001b[${
            A3 ? 32 : 31
          }m${A3}\u001b[${39}m`}) ==> ${`\u001b[${
            A1 && (A21 || A22 || A23) && A3 ? 32 : 31
          }m${A1 && (A21 || A22 || A23) && A3}\u001b[${39}m`}`
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
          (A1 && (A21 || A22 || A23) && A3) ||
          (B1 && (B21 || B22 || B23 || B24 || B25))
        );
      }
      if (
        // this is a recognised attribute
        lastCapturedChunk &&
        allHtmlAttribs.has(lastCapturedChunk) &&
        lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening &&
        lastMatchedQuotesPairsEndIsAt === isThisClosingIdx
      ) {
        console.log(`705 pattern: matched pair + attribute name after`);
        console.log(`706 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} true`);
        return true;
      }
    }

    // catching new attributes that follow after suspected quote.
    // Imagine
    // <a class "c" id 'e' href "www">
    //                 ^            ^
    //        known start at 16     suspected ending at 29
    console.log(
      `717 ${
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
          allHtmlAttribs.has(str.slice(isThisClosingIdx + 1, i).trim()))) &&
      //
      // the same quote doesn't follow on the right,
      // think <div style="float:"left"">z</div>
      //                  ^           ^
      //               start    suspected closing
      !(str[i + 1] === str[i] && str[i] === str[idxOfAttrOpening]) &&
      //
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
      !(
        // we're part the suspected closing, on another closing
        (
          i > isThisClosingIdx + 1 &&
          // colon is to the left of suspected
          str[left(str, isThisClosingIdx) as number] === ":"
        )
      ) &&
      //
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
      !(
        lastCapturedChunk &&
        secondLastCapturedChunk &&
        secondLastCapturedChunk.trim().endsWith(":")
      )
    ) {
      console.log(`808 FIY, doubles count: ${quotesCount.get(`"`)}`);
      console.log(`809 FIY, singles count: ${quotesCount.get(`'`)}`);
      console.log(
        `811 FIY, lastCapturedChunk: ${JSON.stringify(
          lastCapturedChunk,
          null,
          0
        )}; secondLastCapturedChunk: ${JSON.stringify(
          secondLastCapturedChunk,
          null,
          0
        )}`
      );
      console.log(
        `822 FIY, ${`\u001b[${33}m${`chunkStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
          chunkStartsAt,
          null,
          4
        )}:`
      );
      console.log(`:`);

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

      console.log(`878 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`);

      return R0 && !(R1 && R2 && R3 && R4);
    }
    if (
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
          str[right(str, i) as number] === "=")) &&
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
              guaranteedAttrStartsAtX(str, chunkStartsAt as number)
            )
          ) &&
          //
          // continuing with catch clauses of the insurance case:
          lastQuoteWasMatched &&
          lastMatchedQuotesPairsStartIsAt !== undefined &&
          lastMatchedQuotesPairsStartIsAt <= isThisClosingIdx
        );

      console.log(`936 new attr starting`);
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
      console.log(`950 i > isThisClosingIdx`);

      // if current quote matches the opening
      if (openingQuote && str[i] === openingQuote) {
        console.log(
          `955 a true opening quote matched beyond the suspected-one - ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`
        );
        console.log(
          `958 ! ${`\u001b[${33}m${`lastCapturedChunk`}\u001b[${39}m`} = ${JSON.stringify(
            lastCapturedChunk,
            null,
            4
          )}`
        );
        console.log(
          `965 ! ${`\u001b[${33}m${`lastQuoteAt`}\u001b[${39}m`} = ${JSON.stringify(
            lastQuoteAt,
            null,
            4
          )}`
        );
        console.log(
          `972 ! ${`\u001b[${33}m${`isThisClosingIdx`}\u001b[${39}m`} = ${JSON.stringify(
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
          (lastQuoteAt as number) + 1 < i &&
          str.slice((lastQuoteAt as number) + 1, i).trim();

        const Y4 = str
          .slice((lastQuoteAt as number) + 1, i)
          .trim()
          .split(/\s+/)
          .every((chunk) => allHtmlAttribs.has(chunk));
        const Y5 = i >= isThisClosingIdx;

        const Y6 =
          !str[right(str, i) as number] ||
          !`'"`.includes(str[right(str, i) as number]);

        console.log(`Y1: ${`\u001b[${Y1 ? 32 : 31}m${Y1}\u001b[${39}m`}`);
        console.log(`Y2: ${`\u001b[${Y2 ? 32 : 31}m${Y2}\u001b[${39}m`}`);
        console.log(`Y3: ${`\u001b[${Y3 ? 32 : 31}m${Y3}\u001b[${39}m`}`);
        console.log(`Y4: ${`\u001b[${Y4 ? 32 : 31}m${Y4}\u001b[${39}m`}`);
        console.log(`Y5: ${`\u001b[${Y5 ? 32 : 31}m${Y5}\u001b[${39}m`}`);
        console.log(`Y6: ${`\u001b[${Y6 ? 32 : 31}m${Y6}\u001b[${39}m`}`);
        console.log(
          `1011 ${`\u001b[${
            Y1 && Y2 && Y3 && Y4 && Y5 && Y6 ? 32 : 31
          }m${`RETURN`}\u001b[${39}m`} Y1 && Y2 && Y3 && Y4 && Y5 && Y6 ===> ${`\u001b[${
            Y1 && Y2 && Y3 && Y4 && Y5 && Y6 ? 32 : 31
          }m${Y1 && Y2 && Y3 && Y4 && Y5 && Y6}\u001b[${39}m`}`
        );

        return !!(Y1 && Y2 && Y3 && Y4 && Y5 && Y6);
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
          `1040 another quote same as suspected was met - ${`\u001b[${31}m${`RETURN FALSE`}\u001b[${39}m`}`
        );
        return false;
      } // if the tag closing was met, that's fine, imagine:
      // <div class='c">.</div>
      //              ^
      //        we went past this suspected closing quote
      //        and reached the tag ending...
      if (str[i] === "/" || str[i] === ">" || str[i] === "<") {
        console.log(`1049 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`);

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
        const R11 = quotesCount.get(`matchedPairs`) < 2;

        // at least it's not a recognised attribute name on the left:
        const attrNameCharsChunkOnTheLeft = findAttrNameCharsChunkOnTheLeft(
          str,
          i
        );
        const R12 =
          (!attrNameCharsChunkOnTheLeft ||
            !allHtmlAttribs.has(attrNameCharsChunkOnTheLeft)) &&
          // avoid cases where multiple pairs of mismatching quotes were matched
          // we're past suspected closing:
          (!(
            (
              i > isThisClosingIdx &&
              // and there were some single quotes recorded so far
              quotesCount.get(`'`) &&
              // and doubles too
              quotesCount.get(`"`) &&
              // and there were few quote pairs matched
              quotesCount.get(`matchedPairs`) > 1
            )
            // in which case,
            // too much fun is going on, like in:
            // <z bbb"c" ddd'e'>.<z fff"g">
            //       |        ^^
            //     start      | \
            //        suspected  currently on
          ) ||
            // but add escape latch for when tag closing follows:
            // <img alt='so-called "artists"!"/>
            //          ^                    ^^
            //        start         suspected  currently we're on slash
            `/>`.includes(str[right(str, i) as number]));

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
              lastMatchedQuotesPairsStartIsAt !== undefined &&
              Array.from(
                str
                  .slice(idxOfAttrOpening + 1, lastMatchedQuotesPairsStartIsAt)
                  .trim()
              ).every((char) => isAttrNameChar(char)) &&
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
          isAttrNameChar(str[idxOfAttrOpening - 2]);

        const R34 = !ensureXIsNotPresentBeforeOneOfY(str, i + 1, "<", [
          `='`,
          `="`,
        ]);

        console.log(`1136:`);
        console.log(" ");
        console.log(
          `R0 (happy path): ${`\u001b[${R0 ? 32 : 31}m${R0}\u001b[${39}m`}`
        );
        console.log(" ");
        console.log(`OR ALL OF THE FOLLOWING`);
        console.log(" ");
        console.log("(");
        console.log(`  R11: ${`\u001b[${R11 ? 32 : 31}m${R11}\u001b[${39}m`}`);
        console.log(`  R12: ${`\u001b[${R12 ? 32 : 31}m${R12}\u001b[${39}m`}`);
        console.log(
          `) ==> ${`\u001b[${R11 || R12 ? 32 : 31}m${R11 || R12}\u001b[${39}m`}`
        );
        console.log(" ");
        console.log(`AND`);
        console.log(" ");
        console.log(`R2: ${`\u001b[${R2 ? 32 : 31}m${R2}\u001b[${39}m`}`);

        console.log(" ");
        console.log(`AND`);
        console.log(" ");
        console.log("(");
        console.log(`  R31: ${`\u001b[${R31 ? 32 : 31}m${R31}\u001b[${39}m`}`);
        console.log(`  R32: ${`\u001b[${R32 ? 32 : 31}m${R32}\u001b[${39}m`}`);
        console.log(`  R33: ${`\u001b[${R33 ? 32 : 31}m${R33}\u001b[${39}m`}`);
        console.log(`  R34: ${`\u001b[${R34 ? 32 : 31}m${R34}\u001b[${39}m`}`);
        console.log(
          `) ==> ${`\u001b[${R31 || R32 || R33 || R34 ? 32 : 31}m${
            R31 || R32 || R33 || R34
          }\u001b[${39}m`}`
        );

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
          ((R11 || R12) &&
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
          `1238 new attribute starts - ${`\u001b[${32}m${`RETURN TRUE`}\u001b[${39}m`}`
        );
        return true;
      }
    } else {
      console.log(`1243 i <= isThisClosingIdx`);
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
      console.log(`1268 *`);
      let firstNonWhitespaceCharOnTheLeft;
      if (str[i - 1] && str[i - 1].trim() && str[i - 1] !== "=") {
        // happy path
        firstNonWhitespaceCharOnTheLeft = i - 1;
        console.log(`1273 happy path`);
        console.log(
          `1275 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`firstNonWhitespaceCharOnTheLeft`}\u001b[${39}m`} = ${JSON.stringify(
            firstNonWhitespaceCharOnTheLeft,
            null,
            4
          )}`
        );
      } else {
        console.log(`1282 traverse backwards`);
        for (let y = i; y--; ) {
          console.log(
            `1285 ${`\u001b[${33}m${`str[${y}]`}\u001b[${39}m`} = ${JSON.stringify(
              str[y],
              null,
              4
            )}`
          );
          if (str[y].trim() && str[y] !== "=") {
            firstNonWhitespaceCharOnTheLeft = y;
            console.log(
              `1294 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`firstNonWhitespaceCharOnTheLeft`}\u001b[${39}m`} = ${JSON.stringify(
                firstNonWhitespaceCharOnTheLeft,
                null,
                4
              )}; BREAK`
            );
            break;
          }
        }
      }

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
        // the isAttrNameChar()...)
        isAttrNameChar(str[firstNonWhitespaceCharOnTheLeft as number]) &&
        // ensure it's not
        // <img src="https://z.com/r.png?a=" />
        //                                ^
        //                              here
        //
        // in which case it's a false positive!!!
        !str.slice(idxOfAttrOpening + 1).startsWith("http") &&
        !str.slice(idxOfAttrOpening + 1, i).includes("/") &&
        !str.endsWith("src=", idxOfAttrOpening) &&
        !str.endsWith("href=", idxOfAttrOpening)
      ) {
        console.log(
          `1331 new attribute starts - ${`\u001b[${31}m${`RETURN FALSE`}\u001b[${39}m`}`
        );
        return false;
      }

      console.log(`1336 new attr didn't start`);

      if (i === isThisClosingIdx && guaranteedAttrStartsAtX(str, i + 1)) {
        console.log(`1339 another attribute starts on the right!`);
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
        `1353 ${`\u001b[${35}m${`██`}\u001b[${39}m`} ${`\u001b[${33}m${`lastCapturedChunk`}\u001b[${39}m`} = ${JSON.stringify(
          lastCapturedChunk,
          null,
          4
        )}`
      );

      if (
        i < isThisClosingIdx &&
        `'"`.includes(str[i]) &&
        lastCapturedChunk &&
        str[left(str, idxOfAttrOpening) as number] &&
        str[left(str, idxOfAttrOpening) as number] !== "=" &&
        lastMatchedQuotesPairsStartIsAt === idxOfAttrOpening &&
        allHtmlAttribs.has(lastCapturedChunk)
      ) {
        console.log(
          `1370 freak out clause, it seems an attribute started in between start and suspected`
        );
        return false;
      }

      // catch
      // <div style="float:"left'">z</div>
      //            ^            ^
      //          start       we're here, and also it's suspected too
      //
      if (
        i === isThisClosingIdx &&
        `'"`.includes(str[i]) &&
        lastCapturedChunk &&
        secondLastCapturedChunk &&
        totalQuotesCount % 2 === 0 &&
        secondLastCapturedChunk.endsWith(":")
      ) {
        console.log(
          `1389 it's ending of an attribute with a double-wrapped value - RETURN ${`\u001b[${32}m${`true`}\u001b[${39}m`}`
        );
        return true;
      }

      console.log(`1394 end of i <= isThisClosingIdx clauses`);
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
        `1432 FIY, ${`\u001b[${33}m${`lastCapturedChunk`}\u001b[${39}m`} = ${JSON.stringify(
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
          `1447 the slice "${str.slice(
            isThisClosingIdx,
            i
          )}" does not contain a new attribute name, ${`\u001b[${31}m${`RETURN FALSE`}\u001b[${39}m`}`
        );
        return false;
      }
      // ELSE - it does match, so it seems legit
      console.log(`1455 ${`\u001b[${32}m${`RETURN TRUE`}\u001b[${39}m`}`);
      return true;
    }

    // at the bottom, PART II of catch quotes
    if (`'"`.includes(str[i])) {
      lastQuoteAt = i;
      console.log(
        `1463 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastQuoteAt`}\u001b[${39}m`} = ${JSON.stringify(
          lastQuoteAt,
          null,
          4
        )}`
      );
    }

    // at the bottom, PART II of reset chunk
    if (chunkStartsAt && !isAttrNameChar(str[i])) {
      console.log(
        `1474 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`chunkStartsAt`}\u001b[${39}m`}`
      );
      chunkStartsAt = null;
    }

    // logging
    // -----------------------------------------------------------------------------
    console.log(
      `${`\u001b[${90}m${`██ chunkStartsAt: ${chunkStartsAt}`}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`██ lastCapturedChunk: ${lastCapturedChunk}`}\u001b[${39}m`}; ${`\u001b[${90}m${`██ secondLastCapturedChunk: ${secondLastCapturedChunk}`}\u001b[${39}m`}`
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
  console.log(`1507 ${`\u001b[${31}m${`RETURN DEFAULT FALSE`}\u001b[${39}m`}`);
  return false;
}

export { isAttrClosing, version };
