/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import { right } from "string-left-right";

declare let DEV: boolean;

function isObj(something: unknown): boolean {
  return (
    !!something && typeof something === "object" && !Array.isArray(something)
  );
}

function isLatinLetterOrNumberOrHash(char: string): boolean {
  // we mean:
  // - Latin letters a-z or
  // - numbers 0-9 or
  // - letters A-Z or
  // - #
  return (
    typeof char === "string" &&
    char.length === 1 &&
    ((char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123) ||
      (char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58) ||
      (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) ||
      char.charCodeAt(0) === 35)
  );
}
function isNumeric(something: unknown): boolean {
  return (
    typeof something === "string" &&
    something.charCodeAt(0) > 47 &&
    something.charCodeAt(0) < 58
  );
}

function isLatinLetter(something: unknown): boolean {
  return (
    typeof something === "string" &&
    ((something.charCodeAt(0) > 96 && something.charCodeAt(0) < 123) ||
      (something.charCodeAt(0) > 64 && something.charCodeAt(0) < 91))
  );
}

function resemblesNumericEntity(str2: string, from: number, to: number) {
  // plan: loop characters, count types, judge what's given
  let lettersCount = 0;
  let numbersCount = 0;
  let othersCount = 0;
  let hashesCount = 0;
  let whitespaceCount = 0;
  let numbersValue = "";
  let charTrimmed = "";

  for (let i = from; i < to; i++) {
    DEV &&
      console.log(
        `058 stringFixBrokenNamedEntities: ${`\u001b[${36}m${`resemblesNumericEntity() loop: str2[${i}] = "${str2[i]}"`}\u001b[${39}m`}`
      );
    if (str2[i].trim().length) {
      charTrimmed += str2[i];
    } else {
      whitespaceCount += 1;
    }
    if (isLatinLetter(str2[i])) {
      lettersCount += 1;
    } else if (isNumeric(str2[i])) {
      numbersCount += 1;
      numbersValue += String(str2[i]);
    } else if (str2[i] === "#") {
      hashesCount += 1;
    } else {
      othersCount += 1;
    }
  }
  // if there are more numbers than letters (or equal) then it's more likely
  // to be a numeric entity
  let probablyNumeric: string | boolean = false;

  DEV &&
    console.log(
      `082 stringFixBrokenNamedEntities: ${`\u001b[${33}m${`charTrimmed[0]`}\u001b[${39}m`} = ${JSON.stringify(
        charTrimmed[0],
        null,
        4
      )}; ${`\u001b[${33}m${`charTrimmed[1]`}\u001b[${39}m`} = ${JSON.stringify(
        charTrimmed[1],
        null,
        4
      )}`
    );

  // if decimal-type, for example, &#999999;
  // but wide enough to include messed up cases
  if (!lettersCount && numbersCount > othersCount) {
    probablyNumeric = "deci";
  } else if (
    (numbersCount || lettersCount) &&
    ((charTrimmed[0] === "#" &&
      charTrimmed[1].toLowerCase() === "x" &&
      (isNumeric(charTrimmed[2]) || isLatinLetter(charTrimmed[2]))) ||
      (charTrimmed[0].toLowerCase() === "x" && numbersCount && !othersCount))
  ) {
    // hexidecimal, for example, &#xA3;
    // but wide enough to include messed up cases
    probablyNumeric = "hexi";
  }

  return {
    probablyNumeric,
    lettersCount,
    numbersCount,
    numbersValue,
    hashesCount,
    othersCount,
    charTrimmed,
    whitespaceCount,
  };
}

interface TempObj {
  tempEnt: string;
  tempRes: {
    gaps: [number, number][];
    leftmostChar: number;
    rightmostChar: number;
  };
}

function findLongest(temp1: TempObj[]) {
  // we are filtering something like this:
  // [
  //   {
  //       "tempEnt": "acute",
  //       "tempRes": {
  //           "gaps": [],
  //           "leftmostChar": 2,
  //           "rightmostChar": 6
  //       }
  //   },
  //   {
  //       "tempEnt": "zacute",
  //       "tempRes": {
  //           "gaps": [],
  //           "leftmostChar": 0,
  //           "rightmostChar": 6
  //       }
  //   }
  // ]
  //
  // we find the object which represents the longest matched entity, that is,
  // object which "tempEnt" key value's length is the longest.

  if (Array.isArray(temp1) && temp1.length) {
    if (temp1.length === 1) {
      // quick ending - only one value anyway
      return temp1[0];
    }
    // filter-out and return the longest-one
    return temp1.reduce((accum, tempObj) => {
      if (tempObj.tempEnt.length > accum.tempEnt.length) {
        return tempObj;
      }
      return accum;
    });
  }
  return temp1;
}

function removeGappedFromMixedCases(str: string, temp1: TempObj[]) {
  /* istanbul ignore if */
  if (arguments.length !== 2) {
    throw new Error("removeGappedFromMixedCases(): wrong amount of inputs!");
  }
  // If there is one without gaps and all others with gaps, gapless
  // wins, regardless of length.
  // The longest of gapless-one wins, trumping all the ones with gaps.
  // If all are with gaps, the longest one wins.

  // [
  //   {
  //       "tempEnt": "acute",
  //       "tempRes": {
  //           "gaps": [],
  //           "leftmostChar": 2,
  //           "rightmostChar": 6
  //       }
  //   },
  //   {
  //       "tempEnt": "zacute",
  //       "tempRes": {
  //           "gaps": [
  //               [
  //                   1,
  //                   2
  //               ]
  //           ],
  //           "leftmostChar": 0,
  //           "rightmostChar": 6
  //       }
  //   }
  // ]

  // For example, entity "zacute" record above shows it has gaps, while the
  // "acute" does not have gaps. This is a mixed case scenario and we remove
  // all gapped entities, that is, in this case, "zacute".

  // Imagine we have string "zzzzzz acute; yyyyyy". That z on the left of
  // "acute" is legit. That's why we exclude matched gapped entities in
  // mixed cases.

  // But, semicolon also matters, for example, &acd; vs. &ac; in:
  // &ac d;
  // case picks &acd; as winner

  let copy;

  if (Array.isArray(temp1) && temp1.length) {
    // prevent mutation:
    copy = Array.from(temp1);
    // 1. if some matches have semicolon to the right of rightmostChar and
    // some matches don't, exclude those that don't.
    // If at unknown moment we've left with one match, Bob's your uncle here's
    // the final result.
    // For example, we might be working on something like this:
    // [
    //     {
    //         "tempEnt": "ac",
    //         "tempRes": {
    //             "gaps": [],
    //             "leftmostChar": 1,
    //             "rightmostChar": 2
    //         }
    //     },
    //     {
    //         "tempEnt": "acd",
    //         "tempRes": {
    //             "gaps": [
    //                 [
    //                     3,
    //                     4
    //                 ]
    //             ],
    //             "leftmostChar": 1,
    //             "rightmostChar": 4
    //         }
    //     }
    // ]

    /* istanbul ignore if */
    if (
      copy.length > 1 &&
      copy.some(
        (entityObj) =>
          str[right(str, entityObj.tempRes.rightmostChar) as number] === ";"
      ) &&
      copy.some(
        (entityObj) =>
          str[right(str, entityObj.tempRes.rightmostChar) as number] !== ";"
      )
    ) {
      // filter out those with semicolon to the right of the last character:
      copy = copy.filter(
        (entityObj) =>
          str[right(str, entityObj.tempRes.rightmostChar) as number] === ";"
      );
      DEV &&
        console.log(
          `269 stringFixBrokenNamedEntities: we filtered only entities with semicolons to the right: ${JSON.stringify(
            copy,
            null,
            4
          )}`
        );
    }

    // 2. if still there is more than one match, first exclude gapped if
    // there is mix of gapped vs. gapless. Then, return longest.
    // If all are either gapped or gapless, return longest.
    if (
      !(
        copy.every(
          (entObj) =>
            !entObj ||
            !entObj.tempRes ||
            !entObj.tempRes.gaps ||
            !Array.isArray(entObj.tempRes.gaps) ||
            !entObj.tempRes.gaps.length
        ) ||
        copy.every(
          (entObj) =>
            entObj?.tempRes?.gaps &&
            Array.isArray(entObj.tempRes.gaps) &&
            entObj.tempRes.gaps.length
        )
      )
    ) {
      // filter out entities with gaps, leave gapless-ones
      return findLongest(
        copy.filter(
          (entObj) =>
            !entObj.tempRes.gaps ||
            !Array.isArray(entObj.tempRes.gaps) ||
            !entObj.tempRes.gaps.length
        )
      );
    }
  }
  // else if all entries don't have gaps, return longest
  return findLongest(temp1);
}

export {
  isObj,
  isNumeric,
  resemblesNumericEntity,
  removeGappedFromMixedCases,
  isLatinLetterOrNumberOrHash,
};
