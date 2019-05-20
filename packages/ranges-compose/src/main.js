import clone from "lodash.clonedeep";
import isObj from "lodash.isplainobject";
import merge from "ranges-merge";

// easter eggs
//
//        ,----.                   ,----.
//      / . . . .\               / . . . .\
//     /~ ~ ~ ~ ~ \  ,----.     /~ ~ ~ ~ ~ \
//     | ~ ~ ~ ~ ~|/ . . . .\   | ~ ~ ~ ~ ~|
//     \^ ^ ^ ^ ^ |~ ~ ~ ~ ~ \  \^ ^ ^ ^ ^ |
//      \ . . . . , ~ ~ ~ ~ ~|   \ . . . . ,
//       ' _____./|^ ^ ^ ^ ^ |    ' _____./
//                 \ . . . . ,
//                  ' _____./
//
//

function isStr(something) {
  return typeof something === "string";
}

function composeRanges(str, olderRanges, newerRanges, originalOpts) {
  // early ending:
  if (olderRanges === null) {
    if (newerRanges === null) {
      return null;
    }
    return newerRanges;
  } else if (newerRanges === null) {
    return olderRanges;
  }

  // first, ranges have to be sorted so we can process them using loops:
  const older = merge(olderRanges);
  const newer = merge(newerRanges);
  console.log(
    `038 ${`\u001b[${33}m${`older`}\u001b[${39}m`} = ${JSON.stringify(
      older,
      null,
      0
    )}; ${`\u001b[${33}m${`newer`}\u001b[${39}m`} = ${JSON.stringify(
      newer,
      null,
      0
    )}`
  );

  // new composed ranges:
  const composed = [];

  // incoming ranges are offset by a certain amount of characters by old ranges.
  // For example, if old ranges is [0, 1] and new ranges is [0, 2] latter ones
  // are offset by 1 so they are actually starting not from zero to two but
  // from one to three, offset being one (which is 1 - 0 = 1).
  // This counter counts by how much:
  let offset = 0;

  // ---------------------------------------------------------------------------
  while (newer.length) {
    console.log("\n");
    console.log(
      `063 ==========================================\n${`\u001b[${35}m${`processing newer`}\u001b[${39}m`}[0] = ${`\u001b[${32}m[${
        newer[0]
      }]\u001b[${39}m`}\n`
    );

    //                         L O O P     S T A R T S
    //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                               \  |  /
    //                                \ | /
    //                                 \|/
    //                                  V

    while (older.length) {
      console.log(
        `080 ██ \n${`\u001b[${36}m${`processing older`}\u001b[${39}m`}[0] = ${`\u001b[${32}m[${
          older[0]
        }]\u001b[${39}m`}\n`
      );

      // 0.

      // If there are no more newer[] elements left, push older[] elements
      // starting from the first-one. This clause happens later in the loops.

      if (!newer.length) {
        console.log(
          `092 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
            older[0],
            null,
            0
          )}`
        );
        composed.push(older.shift());
      }

      // 1.

      // easiest case - incoming range is fully in front of a current old range
      // for example, older ranges: [100, 101], newer ranges [2, 3]. Result is
      // [[2, 3], [100, 101]].
      else if (newer[0][1] < older[0][0]) {
        console.log(`107 CASE #1`);
        // Array.shift will move the first element of array "newer" into
        // array "composed":
        console.log(
          `111 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
            newer[0],
            null,
            0
          )}, then ${JSON.stringify(older[0], null, 0)}`
        );
        composed.push(newer.shift());
        composed.push(older.shift());
      } else {
        // 2.

        const newerLen = newer[0][1] - newer[0][0];
        // harder cases.
        if (older.length === 1 || newerLen <= older[1][0] - older[0][1]) {
          console.log(
            `126 newer ${JSON.stringify(newer[0], null, 0)} will fit`
          );
          offset +=
            older[0][1] -
            older[0][0] +
            (isStr(older[0][2]) ? older[0][2].length : 0);
          console.log(
            `133 range ${JSON.stringify(
              older[0],
              null,
              0
            )} ${`\u001b[${33}m${`offset`}\u001b[${39}m`} = ${offset}`
          );

          console.log(
            `141 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
              newer[0].map(val => val + offset),
              null,
              0
            )}, then ${JSON.stringify(older[0], null, 0)}`
          );
          composed.push(older.shift());
          composed.push(newer.shift().map(val => val + offset));
        } else {
          console.log(
            `151 newer ${JSON.stringify(newer[0], null, 0)} won't fit`
          );
          // the gap between current older[] and the following older[] elements
          // is not enough to fix the current newer[] in.
          // The plan is, loop through all remaining older[] and fill all the
          // gaps with characters from newer[0]

          let lengthToCover = newer[0][1] - newer[0][0];
          while (lengthToCover && older.length) {
            console.log(
              `161 ${`\u001b[${36}m${`========`}\u001b[${39}m`} LOOP ${`\u001b[${36}m${`========`}\u001b[${39}m`}`
            );
            console.log(
              `164 ${`\u001b[${33}m${`older`}\u001b[${39}m`} = ${JSON.stringify(
                older,
                null,
                0
              )}`
            );

            // if there are more than 1 elements left
            if (older.length > 1) {
              const gapLength = older[1][0] - older[0][1];
              if (lengthToCover >= gapLength) {
                console.log(
                  `176 ${`\u001b[${32}m${`GAP [${older[0][1]}, ${
                    older[1][0]
                  }] WILL BE COVERED COMPLETELY`}\u001b[${39}m`}`
                );
                // 0. first, push current older[0]
                const currentOlder = older[0];
                console.log(
                  `183 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                    currentOlder,
                    null,
                    0
                  )}`
                );
                composed.push(currentOlder);
                console.log(
                  `191 ${`\u001b[${33}m${`composed`}\u001b[${39}m`} = ${JSON.stringify(
                    composed,
                    null,
                    0
                  )}`
                );
                // push 1. filler for this gap in older[] and 2. that next older[]
                // range as well

                // 1.
                console.log(
                  `202 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                    [older[0][1], older[1][0]],
                    null,
                    0
                  )}`
                );
                composed.push([older[0][1], older[1][0]]);
                console.log(
                  `210 ${`\u001b[${33}m${`composed`}\u001b[${39}m`} = ${JSON.stringify(
                    composed,
                    null,
                    0
                  )}`
                );
                lengthToCover -= older[1][0] - older[0][1];
                // 2. get rid of current element older[0], we already submitted it
                older.shift();
                // // 3.
                // console.log(
                //   `221 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                //     older[0],
                //     null,
                //     0
                //   )}`
                // );
                // composed.push(older.shift());
                // console.log(
                //   `229 ${`\u001b[${33}m${`composed`}\u001b[${39}m`} = ${JSON.stringify(
                //     composed,
                //     null,
                //     0
                //   )}`
                // );
                // 3. reduce the counter
                console.log(
                  `237 AFTER THAT, ${`\u001b[${33}m${`older`}\u001b[${39}m`} = ${JSON.stringify(
                    older,
                    null,
                    0
                  )}; ${`\u001b[${33}m${`lengthToCover`}\u001b[${39}m`} = ${lengthToCover}`
                );
              } else {
                console.log(
                  `245 ${`\u001b[${31}m${`GAP [${older[0][1]}, ${
                    older[1][0]
                  }] WILL NOT BE COVERED COMPLETELY`}\u001b[${39}m`}`
                );
                // this gap is too big, so just push the remainder of the newer[]
                console.log(
                  `251 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                    newer[0][1]
                  }, ${newer[0][1] + lengthToCover}]`
                );
                composed.push(newer[0][1], newer[0][1] + lengthToCover);
                console.log(
                  `257 ${`\u001b[${33}m${`composed`}\u001b[${39}m`} = ${JSON.stringify(
                    composed,
                    null,
                    0
                  )}`
                );
                // reset lengthToCover
                lengthToCover = 0;
                console.log(`265 lengthToCover = ${lengthToCover}`);
              }
            } else {
              // there's just last element left
              // 1. push it
              console.log(
                `271 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                  older[0],
                  null,
                  0
                )}`
              );
              const lastElFromOlder = older.shift();
              composed.push(lastElFromOlder);
              composed.push([
                lastElFromOlder[1],
                lastElFromOlder[1] + lengthToCover
              ]);

              lengthToCover = 0;

              console.log(
                `287 ${`\u001b[${33}m${`composed`}\u001b[${39}m`} = ${JSON.stringify(
                  composed,
                  null,
                  0
                )}; lengthToCover = ${lengthToCover}`
              );
            }
          }
          // at last, remove newer[0]
          newer.shift();

          console.log(
            `299 ${`\u001b[${36}m${`========`}\u001b[${39}m`} LOOP ENDS${`\u001b[${36}m${`========`}\u001b[${39}m`}`
          );
        }
      }
    }

    //                                  ^
    //                                 /|\
    //                                / | \
    //                               /  |  \
    //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                         L O O P     E N D S
  }

  console.log("\n---------------------\n");
  console.log(
    `318 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}\n${`\u001b[${35}m${`raw`}\u001b[${39}m`}:    ${JSON.stringify(
      composed,
      null,
      0
    )};\n${`\u001b[${35}m${`merged`}\u001b[${39}m`}: ${JSON.stringify(
      merge(composed),
      null,
      0
    )}\n`
  );
  return merge(composed);
}

export default composeRanges;
