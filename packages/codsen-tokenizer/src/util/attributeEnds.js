import { xBeforeYOnTheRight, ensureXIsNotPresentBeforeOneOfY } from "./util";

// this function returns a boolean, answering does the given attribute
// which has been started ("attrib" object), end at index "i".

// For example, given string
// <img alt='so-called "artists"!'/>,
//
// by reaching the double quote before "artists", we have "attrib" object:
// {
//   "attribName": "alt",
//   "attribNameRecognised": true,
//   "attribNameStartsAt": 5,
//   "attribNameEndsAt": 8,
//   "attribOpeningQuoteAt": 9,
//   "attribClosingQuoteAt": null,
//   "attribValue": null,
//   "attribValueStartsAt": 10,
//   "attribValueEndsAt": null,
//   "attribStart": 5,
//   "attribEnd": null
// }
//
// This function takes the source string, index we question and attrib object

function attributeEnds(str, i, attrib) {
  //
  //
  //      A) if matching pair of quotes
  //
  //
  // the opening quote was missing - happy days, nothing to match against
  return (
    attrib.attribOpeningQuoteAt === null ||
    // OR,
    // it is a quote and it is matching opening-one
    str[attrib.attribOpeningQuoteAt] === str[i] ||
    //
    //
    // OR
    //
    //
    //      B) if mismatching pair of quotes
    //
    //
    (`'"`.includes(str[attrib.attribOpeningQuoteAt]) &&
      (!xBeforeYOnTheRight(str, i, str[attrib.attribOpeningQuoteAt], "=") ||
        // if when we traverse right within tag, stop at first quote,
        // there are even count of quotes (counting the one where we stopped)
        //
        // for example: <a bbb="c' ddd="e'>
        //                       ^
        //                   we're here
        //
        // if you look right, yep, there are even number of quotes on the right
        //
        // now, false positive:
        // <a bbb="someone' s=">
        //                ^
        //           we're here - odd count of quotes (1) on the right!
        //
        // <a bbb="someone' s=" ccc='zzz'>
        //                ^
        //           we're here - odd count of quotes (3) on the right!

        // if the remaining piece of string (from where we are now)
        // contains closing bracket:
        (str.includes(">", i) &&
          // and that remaining chunk has an even count of quotes, counting
          // single and double-ones
          Array.from(str.slice(i + 1, str.indexOf(">"))).reduce((acc, curr) => {
            return acc + (`'"`.includes(curr) ? 1 : 0);
          }, 0) %
            2 ==
            0 &&
          // we need more insurance, for example:
          // <span abc="Someone's" xyz="Someone's">
          //                   ^
          //              we're here - also even count of quotes (4) on the right!
          // plan - let's traverse until "equal-quote" OR closing bracket,
          // then ensure this range we traversed didn't include the
          // opening quote of the current attribute
          //

          // ensure the value of this messed up attribute has some content:
          attrib.attribOpeningQuoteAt + 1 < i &&
          str.slice(attrib.attribOpeningQuoteAt + 1, i).trim().length &&
          //

          // plus, opening quote does not appear before closing bracket
          // or "equal-quote" of another attribute
          (ensureXIsNotPresentBeforeOneOfY(
            str,
            i,
            str[attrib.attribOpeningQuoteAt],
            [">", `="`, `='`]
          ) ||
            // there are no equal characters and we have messy attributes
            // onwards
            ensureXIsNotPresentBeforeOneOfY(str, i, "=", [">"])))))
  );
}

export default attributeEnds;
