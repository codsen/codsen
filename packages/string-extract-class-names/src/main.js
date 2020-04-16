import { left, right } from "string-left-right";

/**
 * stringExtractClassNames - extracts CSS classes/id names (like `.class-name`) from things like:
 * div.class-name:active a
 * or from:
 * tag .class-name::after
 *
 * @param  {String} input                input string
 * @return {Array}                       each detected class/id put into an array, as String or Range (array)
 */
function stringExtractClassNames(input, returnRangesInstead) {
  // insurance
  // =========
  function existy(x) {
    return x != null;
  }
  if (typeof input !== "string") {
    throw new TypeError(
      `string-extract-class-names: [THROW_ID_02] first input should be string, not ${typeof input}, currently equal to ${JSON.stringify(
        input,
        null,
        4
      )}`
    );
  }
  if (!existy(returnRangesInstead) || !returnRangesInstead) {
    returnRangesInstead = false;
  } else if (typeof returnRangesInstead !== "boolean") {
    throw new TypeError(
      `string-extract-class-names: [THROW_ID_03] second input argument should be a Boolean, not ${typeof input}, currently equal to ${JSON.stringify(
        input,
        null,
        4
      )}`
    );
  }

  const badChars = `.# ~\\!@$%^&*()+=,/';:"?><[]{}|\``;
  let stateCurrentlyIs; // "." or "#"

  // functions
  // =========

  function isLatinLetter(char) {
    // we mean Latin letters A-Z, a-z
    return (
      typeof char === "string" &&
      char.length &&
      ((char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) ||
        (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123))
    );
  }

  // action
  // ======

  let selectorStartsAt = null;
  const result = [];

  for (let i = 0, len = input.length; i < len; i++) {
    console.log(
      `${`\u001b[${36}m${`============================`}\u001b[${39}m`} ${`\u001b[${33}m${
        input[i]
      }\u001b[${39}m`} (${`\u001b[${31}m${i}\u001b[${39}m`})`
    );

    // catch the ending of a selector's name:
    if (
      selectorStartsAt !== null &&
      i >= selectorStartsAt &&
      (badChars.includes(input[i]) || !input[i].trim())
    ) {
      // if selector is more than dot or hash:
      if (i > selectorStartsAt + 1) {
        // If we reached the last character and selector's beginning has not been
        // interrupted, extend the slice's ending by 1 character. If we terminate
        // the selector because of illegal character, slice right here, at index "i".
        if (returnRangesInstead) {
          result.push([selectorStartsAt, i]);
          console.log(
            `082 ${`\u001b[${33}m${`PUSH`}\u001b[${39}m`} [${selectorStartsAt}, ${i}] to result[]`
          );
        } else {
          result.push(
            `${stateCurrentlyIs || ""}${input.slice(selectorStartsAt, i)}`
          );
          console.log(
            `089 ${`\u001b[${33}m${`PUSH`}\u001b[${39}m`} [${selectorStartsAt}, ${i}] = "${input.slice(
              selectorStartsAt,
              i
            )}" to result[]`
          );
        }
        if (stateCurrentlyIs) {
          stateCurrentlyIs = undefined;
          console.log(`097 SET stateCurrentlyIs = undefined`);
        }
      }
      selectorStartsAt = null;
      console.log(
        `102 ${`\u001b[${33}m${`selectorStartsAt`}\u001b[${39}m`} = null`
      );
    }

    // catch dot or hash:
    if (selectorStartsAt === null && (input[i] === "." || input[i] === "#")) {
      selectorStartsAt = i;
      console.log(
        `110 SET ${`\u001b[${33}m${`selectorStartsAt`}\u001b[${39}m`} = ${selectorStartsAt}`
      );
    }

    // catch zzz[class=]
    if (
      input.startsWith("class", i) &&
      input[left(input, i)] === "[" &&
      input[right(input, i + 4)] === "="
    ) {
      console.log(`120 [class= caught`);
      // if it's zzz[class=something] (without quotes)
      if (isLatinLetter(input[right(input, right(input, i + 4))])) {
        selectorStartsAt = right(input, right(input, i + 4));
        console.log(`124 SET selectorStartsAt = ${selectorStartsAt}`);
      } else if (`'"`.includes(input[right(input, right(input, i + 4))])) {
        if (
          isLatinLetter(input[right(input, right(input, right(input, i + 4)))])
        ) {
          selectorStartsAt = right(input, right(input, right(input, i + 4)));
          console.log(`130 SET selectorStartsAt = ${selectorStartsAt}`);
        }
      }
      stateCurrentlyIs = ".";
    }

    // catch zzz[id=]
    if (
      input.startsWith("id", i) &&
      input[left(input, i)] === "[" &&
      input[right(input, i + 1)] === "="
    ) {
      console.log(`142 [id= caught`);
      // if it's zzz[id=something] (without quotes)
      if (isLatinLetter(input[right(input, right(input, i + 1))])) {
        selectorStartsAt = right(input, right(input, i + 1));
        console.log(`146 SET selectorStartsAt = ${selectorStartsAt}`);
      } else if (`'"`.includes(input[right(input, right(input, i + 1))])) {
        if (
          isLatinLetter(input[right(input, right(input, right(input, i + 1)))])
        ) {
          selectorStartsAt = right(input, right(input, right(input, i + 1)));
          console.log(`152 SET selectorStartsAt = ${selectorStartsAt}`);
        }
      }
      stateCurrentlyIs = "#";
    }

    // catch the end of input:
    if (i + 1 === len && selectorStartsAt !== null && i > selectorStartsAt) {
      if (returnRangesInstead) {
        result.push([selectorStartsAt, len]);
        console.log(
          `163 ${`\u001b[${33}m${`PUSH`}\u001b[${39}m`} [${selectorStartsAt}, ${len}] to result[]`
        );
      } else {
        result.push(input.slice(selectorStartsAt, len));
        console.log(
          `168 ${`\u001b[${33}m${`PUSH`}\u001b[${39}m`} [${selectorStartsAt}, ${len}] = "${input.slice(
            selectorStartsAt,
            len
          )}" to result[]`
        );
      }
    }
    console.log(
      `\u001b[${90}m${`ended with: selectorStartsAt = ${selectorStartsAt}; result = ${JSON.stringify(
        result,
        null,
        0
      )}`}\u001b[${39}m`
    );
  }
  return result;
}

export default stringExtractClassNames;
