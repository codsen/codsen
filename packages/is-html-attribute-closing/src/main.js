import charSuitableForHTMLAttrName from "is-char-suitable-for-html-attr-name";
import { left, right } from "string-left-right";

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
      `015 ${`\u001b[${31}m${`WRONG INPUTS, RETURN FALSE`}\u001b[${39}m`}`
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
    `028 ${`\u001b[${33}m${`openingQuote`}\u001b[${39}m`}: ${`\u001b[${35}m${openingQuote}\u001b[${39}m`}   ${`\u001b[${33}m${`oppositeToOpeningQuote`}\u001b[${39}m`}: ${`\u001b[${35}m${oppositeToOpeningQuote}\u001b[${39}m`}`
  );

  let attrStartsAt;

  // let's traverse from opening to the end of the string, then in happy
  // path scenarios, let's exit way earlier, upon closing quote
  for (let i = idxOfAttrOpening, len = str.length; i < len; i++) {
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

    // when index "isThisClosingIdx" has been passed...
    if (i > isThisClosingIdx) {
      console.log(`055 i > isThisClosingIdx`);

      // catch the first character past the questioned attribute
      // closing.
      // imagine
      // <img alt="so-called "artists"!' class='yo'/>
      //          ^                  ^
      //        opening          suspected closing

      if (str[i].trim().length && !attrStartsAt) {
        // <img alt="so-called "artists"!' class='yo'/>
        //                              ^
        //                         we land here, on excl. mark
        if (charSuitableForHTMLAttrName(str[i])) {
          console.log(
            `070 ${`\u001b[${32}m${`██ new attribute name starts`}\u001b[${39}m`}`
          );
          console.log(
            `073 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`attrStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
              attrStartsAt,
              null,
              4
            )}`
          );
          attrStartsAt = i;
        }
        // if the tag closing was met, that's fine, imagine:
        // <div class='c">.</div>
        //              ^
        //        we went past this suspected closing quote
        //        and reached the tag ending...
        else if (str[i] === "/" || str[i] === ">") {
          console.log(
            `088 closing bracket caught first - ${`\u001b[${32}m${`RETURN TRUE`}\u001b[${39}m`}`
          );
          return true;
        } else {
          // in example above, that exclamation mark is not
          // suitable to be within attribute's name
          console.log(
            `095 character is not suitable for attr name - ${`\u001b[${31}m${`RETURN FALSE`}\u001b[${39}m`}`
          );
          return false;
        }
      }

      // if suspected closing quote's index is reached
      if (openingQuote && str[idxOfAttrOpening] === str[i]) {
        console.log(
          `104 happy path, opening quote matched - ${`\u001b[${31}m${`RETURN FALSE`}\u001b[${39}m`}`
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
          `128 another quote same as suspected was met - ${`\u001b[${31}m${`RETURN FALSE`}\u001b[${39}m`}`
        );
        return false;
      }

      // if the true attribute ending was met passing
      // past the suspected one, this means that
      // suspected one was a false guess. Correct ending
      // is at this index "i"
      if (str[i] === "=" && `'"`.includes(str[right(str, i)])) {
        console.log(
          `139 new attribute starts - ${`\u001b[${32}m${`RETURN TRUE`}\u001b[${39}m`}`
        );
        return true;
      }
    } else {
      console.log(`144 i <= isThisClosingIdx`);
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
      if (
        str[i] === "=" &&
        right(str, i) &&
        right(str, right(str, i)) &&
        `'"`.includes(str[right(str, i)]) &&
        // ensure it's not tag ending on the right
        // before freaking out:
        !`/>`.includes(str[right(str, right(str, i))]) &&
        // ensure it's a character suitable for attribute
        // name on the left of equal (if it's a real
        // attribute name its name characters must pass
        // the charSuitableForHTMLAttrName()...)
        charSuitableForHTMLAttrName(str[left(str, i)])
      ) {
        console.log(
          `184 new attribute starts - ${`\u001b[${31}m${`RETURN FALSE`}\u001b[${39}m`}`
        );
        return false;
      }
    }

    // logging
    // -----------------------------------------------------------------------------
    console.log(
      `${`\u001b[${90}m${`██ attrStartsAt = ${attrStartsAt}`}\u001b[${39}m`}`
    );
  }

  // if this point was reached and loop didn't exit...
  // default is false
  console.log(`199 ${`\u001b[${31}m${`RETURN DEFAULT FALSE`}\u001b[${39}m`}`);
  return false;
}

export default isAttrClosing;
