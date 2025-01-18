import type { Ranges } from "../../../ops/typedefs/common";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

export interface Obj {
  i: number;
  val: any;
}
export type Callback = (obj: Obj) => void;

function rIterate(str: string, input: Ranges, cb: Callback, offset = 0): void {
  if (typeof str !== "string") {
    throw new TypeError(
      `ranges-iterate: [THROW_ID_01] Input string must be a string! It was given as ${typeof str}, equal to: ${JSON.stringify(
        str,
        null,
        0,
      )}`,
    );
  } else if (!str.length) {
    throw new TypeError(
      `ranges-iterate: [THROW_ID_02] Input string must be non-empty!`,
    );
  }
  if (input && !Array.isArray(input)) {
    throw new TypeError(
      `ranges-iterate: [THROW_ID_03] Input ranges must be an array, consisting of zero or more arrays! Currently its type is: ${typeof input}, equal to: ${JSON.stringify(
        input,
        null,
        0,
      )}`,
    );
  }
  if (!cb) {
    throw new TypeError(
      `ranges-iterate: [THROW_ID_04] You should provide a callback function as third input argument!`,
    );
  } else if (typeof cb !== "function") {
    throw new TypeError(
      `ranges-iterate: [THROW_ID_05] The callback function (third input argument) must be a function. It was given as: ${typeof cb}, equal to: ${JSON.stringify(
        cb,
        null,
        0,
      )}`,
    );
  }

  // The purpose of this package is to iterate through string and also all the
  // amendments registered so far. For example, if we say "delete from index 1
  // to index 3" and string consists of 10 characters, we want to be able to
  // iterate through indexes zero, skip indexes 1 & 2, four and up to index nine.
  //
  // If there are no ranges, it's easy, we iterate whole given string.
  //
  // If string amendments inserted values, we want to iterate those
  // to-be-inserted values too. That's where the complexity of this package
  // comes from.

  if (!input?.length) {
    for (let i = 0; i < str.length; i++) {
      // push converter simply returns range that was given, no changes needed
      cb({
        i,
        val: str[i],
        // push: (received) => received,
      });
    }
  } else {
    // clone the given ranges because they will be mutated:
    let resolvedRanges = Array.from(input);

    // currentIdx is index we use to traverse the string. It's like "i" above,
    // except it "pauses" and is fired many times when range has third argument,
    // what to insert.
    let currentIdx = offset;

    // currentIdx is the index of the final string with all ranges applied (
    // all bits inserted or deleted). We increment it only when we ping the cb(),
    // that's why it might be equal or less than "currentIdx".
    let finalIdx = offset;

    DEV &&
      console.log(
        `088 starting finalIdx = ${`\u001b[${35}m${currentIdx}\u001b[${39}m`}; currentIdx = ${`\u001b[${35}m${currentIdx}\u001b[${39}m`}`,
      );

    // cover the first characters up to starting range
    if (finalIdx < resolvedRanges[0][0]) {
      DEV &&
        console.log(
          `095 finalIdx ${`\u001b[${34}m${finalIdx}\u001b[${39}m`} is before first range's starting index ${`\u001b[${34}m${resolvedRanges[0][0]}\u001b[${39}m`} so ping all characters up to it`,
        );
      // eslint-disable-next-line
      for (; finalIdx < resolvedRanges[0][0]; finalIdx++, currentIdx++) {
        // insure against gaps:
        if (!str[finalIdx]) {
          break;
        }
        // ELSE
        DEV && console.log(`104 \u001b[${90}m${`ping CB`}\u001b[${39}m`);
        // TODO - add push
        cb({
          i: finalIdx,
          val: str[finalIdx],
        });
      }
    }

    DEV &&
      console.log(
        `115 finalIdx = ${`\u001b[${35}m${finalIdx}\u001b[${39}m`}; currentIdx = ${`\u001b[${35}m${currentIdx}\u001b[${39}m`}`,
      );

    // check, if the next range reaches before the end of the string
    // this is to prevent gaps.
    // For example, when string is 10 characters long, asking to insert something
    // from 20th to 30th character.
    if (resolvedRanges[0][0] <= currentIdx) {
      resolvedRanges.forEach((rangeArr, rangeArrIdx) => {
        DEV &&
          console.log(
            `126 ${`\u001b[${36}m${`---------- rangeArr = ${JSON.stringify(
              rangeArr,
              null,
              0,
            )} ----------`}\u001b[${39}m`}`,
          );
        DEV &&
          console.log(
            `134 finalIdx = ${`\u001b[${35}m${finalIdx}\u001b[${39}m`}; currentIdx = ${`\u001b[${35}m${currentIdx}\u001b[${39}m`}`,
          );

        // 1. if "to insert" value, third range's argument is given, loop through it,
        // bumping "finalIdx" along the way. The "currentIdx" stays the same
        // because it marks real index on old string (and it does not move yet).
        if (rangeArr[2]) {
          DEV &&
            console.log(
              `143 loop "to insert value", ${`\u001b[${36}m${JSON.stringify(
                rangeArr[2],
                null,
                0,
              )}\u001b[${39}m`}`,
            );
          for (let y = 0, len = rangeArr[2].length; y < len; y++) {
            DEV &&
              console.log(
                `152 finalIdx = ${`\u001b[${35}m${finalIdx}\u001b[${39}m`}; currentIdx = ${`\u001b[${35}m${currentIdx}\u001b[${39}m`}`,
              );
            cb({
              i: finalIdx,
              val: rangeArr[2][y],
            });
            finalIdx += 1;
          }
        }

        // 2. skip all characters in the range because those will be deleted
        while (currentIdx < rangeArr[1]) {
          DEV &&
            console.log(
              `166 finalIdx = ${`\u001b[${35}m${finalIdx}\u001b[${39}m`}; currentIdx = ${`\u001b[${35}m${currentIdx}\u001b[${39}m`} -> ${`\u001b[${35}m${
                currentIdx + 1
              }\u001b[${39}m`}`,
            );

          currentIdx += 1;
        }

        // 3. if next range is present, ping all characters up to its start OR
        // if it's not present, ping up to the end of the string
        let loopUntil = str.length;
        if (resolvedRanges[rangeArrIdx + 1]) {
          loopUntil = resolvedRanges[rangeArrIdx + 1][0];
        }
        DEV && console.log(`180 loopUntil = ${loopUntil}`);
        // eslint-disable-next-line
        for (; currentIdx < loopUntil; finalIdx++, currentIdx++) {
          DEV && console.log(`183 \u001b[${90}m${`ping CB`}\u001b[${39}m`);
          cb({
            i: finalIdx,
            val: str[currentIdx],
          });
        }

        DEV && console.log("");
        DEV &&
          console.log(
            `193 after while loop, finalIdx = ${`\u001b[${35}m${finalIdx}\u001b[${39}m`}; currentIdx = ${`\u001b[${35}m${currentIdx}\u001b[${39}m`}`,
          );
      });
    }
    DEV &&
      console.log(`198 ${`\u001b[${36}m${`---------- fin.`}\u001b[${39}m`}`);
  }
}

export { rIterate, version };
