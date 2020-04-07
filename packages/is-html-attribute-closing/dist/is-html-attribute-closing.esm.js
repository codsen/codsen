/**
 * is-html-attribute-closing
 * Is a character on a given index a closing of an HTML attribute?
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-html-attribute-closing
 */

import charSuitableForHTMLAttrName from 'is-char-suitable-for-html-attr-name';
import { right, left } from 'string-left-right';

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
  for (let i = idxOfAttrOpening, len = str.length; i < len; i++) {
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
    if (i > isThisClosingIdx) {
      console.log(`055 i > isThisClosingIdx`);
      if (str[i].trim().length && !attrStartsAt) {
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
        else if (str[i] === "/" || str[i] === ">") {
          console.log(
            `088 closing bracket caught first - ${`\u001b[${32}m${`RETURN TRUE`}\u001b[${39}m`}`
          );
          return true;
        } else {
          console.log(
            `095 character is not suitable for attr name - ${`\u001b[${31}m${`RETURN FALSE`}\u001b[${39}m`}`
          );
          return false;
        }
      }
      if (openingQuote && str[idxOfAttrOpening] === str[i]) {
        console.log(
          `104 happy path, opening quote matched - ${`\u001b[${31}m${`RETURN FALSE`}\u001b[${39}m`}`
        );
        return false;
      }
      if (
        openingQuote &&
        str[isThisClosingIdx] === oppositeToOpeningQuote &&
        str[i] === oppositeToOpeningQuote
      ) {
        console.log(
          `128 another quote same as suspected was met - ${`\u001b[${31}m${`RETURN FALSE`}\u001b[${39}m`}`
        );
        return false;
      }
      if (str[i] === "=" && `'"`.includes(str[right(str, i)])) {
        console.log(
          `139 new attribute starts - ${`\u001b[${32}m${`RETURN TRUE`}\u001b[${39}m`}`
        );
        return true;
      }
    } else {
      console.log(`144 i <= isThisClosingIdx`);
      if (
        str[i] === "=" &&
        right(str, i) &&
        right(str, right(str, i)) &&
        `'"`.includes(str[right(str, i)]) &&
        !`/>`.includes(str[right(str, right(str, i))]) &&
        charSuitableForHTMLAttrName(str[left(str, i)])
      ) {
        console.log(
          `184 new attribute starts - ${`\u001b[${31}m${`RETURN FALSE`}\u001b[${39}m`}`
        );
        return false;
      }
    }
    console.log(
      `${`\u001b[${90}m${`██ attrStartsAt = ${attrStartsAt}`}\u001b[${39}m`}`
    );
  }
  console.log(`199 ${`\u001b[${31}m${`RETURN DEFAULT FALSE`}\u001b[${39}m`}`);
  return false;
}

export default isAttrClosing;
