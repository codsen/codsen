import { Ranges } from "../../../scripts/common";
import { version } from "../package.json";

interface Obj {
  i: number;
  val: any;
}
type Callback = (obj: Obj) => void;

function rIterate(
  str: string,
  originalRanges: Ranges,
  cb: Callback,
  offset = 0
): void {
  if (typeof str !== "string") {
    throw new TypeError(
      `ranges-iterate: [THROW_ID_01] Input string must be a string! It was given as ${typeof str}, equal to: ${JSON.stringify(
        str,
        null,
        0
      )}`
    );
  } else if (!str.length) {
    throw new TypeError(
      `ranges-iterate: [THROW_ID_02] Input string must be non-empty!`
    );
  }
  if (originalRanges && !Array.isArray(originalRanges)) {
    throw new TypeError(
      `ranges-iterate: [THROW_ID_03] Input ranges must be an array, consisting of zero or more arrays! Currently its type is: ${typeof originalRanges}, equal to: ${JSON.stringify(
        originalRanges,
        null,
        0
      )}`
    );
  }
  if (!cb) {
    throw new TypeError(
      `ranges-iterate: [THROW_ID_04] You should provide a callback function as third input argument!`
    );
  } else if (typeof cb !== "function") {
    throw new TypeError(
      `ranges-iterate: [THROW_ID_05] The calllback function (third input argument) must be a function. It was given as: ${typeof cb}, equal to: ${JSON.stringify(
        cb,
        null,
        0
      )}`
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

  if (originalRanges === null || !originalRanges.length) {
    // TODO - implement ranges push
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
    const ranges = Array.from(originalRanges);

    // currentIdx is index we use to traverse the string. It's like "i" above,
    // except it "pauses" and is fired many times when range has third argument,
    // what to insert.
    let currentIdx = offset;

    // currentIdx is the index of the final string with all ranges applied (
    // all bits inserted or deleted). We increment it only when we ping the cb(),
    // that's why it might be equal or less than "currentIdx".
    let finalIdx = offset;

    console.log(
      `076 starting finalIdx = ${`\u001b[${35}m${currentIdx}\u001b[${39}m`}; currentIdx = ${`\u001b[${35}m${currentIdx}\u001b[${39}m`}`
    );

    // cover the first characters up to starting range
    if (finalIdx < ranges[0][0]) {
      console.log(
        `082 finalIdx ${`\u001b[${34}m${finalIdx}\u001b[${39}m`} is before first range's starting index ${`\u001b[${34}m${
          ranges[0][0]
        }\u001b[${39}m`} so ping all characters up to it`
      );
      // eslint-disable-next-line
      for (; finalIdx < ranges[0][0]; finalIdx++, currentIdx++) {
        // insurange against gaps:
        if (!str[finalIdx]) {
          break;
        }
        // ELSE
        console.log(`093 \u001b[${90}m${`ping CB`}\u001b[${39}m`);
        // TODO - add push
        cb({
          i: finalIdx,
          val: str[finalIdx],
        });
      }
    }

    console.log(
      `103 finalIdx = ${`\u001b[${35}m${finalIdx}\u001b[${39}m`}; currentIdx = ${`\u001b[${35}m${currentIdx}\u001b[${39}m`}`
    );

    // check, if the next range reaches before the end of the string
    // this is to prevent gaps.
    // For example, when string is 10 characters long, asking to insert something
    // from 20th to 30th character.
    if (ranges[0][0] <= currentIdx) {
      ranges.forEach((rangeArr, rangeArrIdx) => {
        console.log(
          `113 ${`\u001b[${36}m${`---------- rangeArr = ${JSON.stringify(
            rangeArr,
            null,
            0
          )} ----------`}\u001b[${39}m`}`
        );
        console.log(
          `120 finalIdx = ${`\u001b[${35}m${finalIdx}\u001b[${39}m`}; currentIdx = ${`\u001b[${35}m${currentIdx}\u001b[${39}m`}`
        );

        // 1. if "to insert" value, third range's argument is given, loop through it,
        // bumping "finalIdx" along the way. The "currentIdx" stays the same
        // because it marks real index on old string (and it does not move yet).
        if (rangeArr[2]) {
          console.log(
            `128 loop "to insert value", ${`\u001b[${36}m${JSON.stringify(
              rangeArr[2],
              null,
              0
            )}\u001b[${39}m`}`
          );
          for (let y = 0, len = rangeArr[2].length; y < len; y++) {
            console.log(
              `136 finalIdx = ${`\u001b[${35}m${finalIdx}\u001b[${39}m`}; currentIdx = ${`\u001b[${35}m${currentIdx}\u001b[${39}m`}`
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
          console.log(
            `149 finalIdx = ${`\u001b[${35}m${finalIdx}\u001b[${39}m`}; currentIdx = ${`\u001b[${35}m${currentIdx}\u001b[${39}m`} -> ${`\u001b[${35}m${
              currentIdx + 1
            }\u001b[${39}m`}`
          );

          currentIdx += 1;
        }

        // 3. if next range is present, ping all characters up to its start OR
        // if it's not present, ping up to the end of the string
        let loopUntil = str.length;
        if (ranges[rangeArrIdx + 1]) {
          loopUntil = ranges[rangeArrIdx + 1][0];
        }
        console.log(`163 loopUntil = ${loopUntil}`);
        // eslint-disable-next-line
        for (; currentIdx < loopUntil; finalIdx++, currentIdx++) {
          console.log(`166 \u001b[${90}m${`ping CB`}\u001b[${39}m`);
          cb({
            i: finalIdx,
            val: str[currentIdx],
          });
        }

        console.log("");
        console.log(
          `175 after while loop, finalIdx = ${`\u001b[${35}m${finalIdx}\u001b[${39}m`}; currentIdx = ${`\u001b[${35}m${currentIdx}\u001b[${39}m`}`
        );
      });
    }
    console.log(`179 ${`\u001b[${36}m${`---------- fin.`}\u001b[${39}m`}`);
  }
}

export { rIterate, version };
