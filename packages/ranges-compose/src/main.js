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

function calculateOffset(olderRanges, i) {
  console.log(
    `\n\n\n\n\n\n\n\n\n${`\u001b[${36}m${`████████████████████v██████████████████`}\u001b[${39}m`}`
  );
  console.log(
    `028 calculateOffset() RECEIVED: ${`\u001b[${33}m${`olderRanges`}\u001b[${39}m`} = ${JSON.stringify(
      olderRanges,
      null,
      0
    )}; ${`\u001b[${33}m${`i`}\u001b[${39}m`} = ${i}`
  );
  const res = olderRanges.reduce((acc, curr) => {
    console.log(
      `036 calculateOffset() incoming: ${`\u001b[${36}m${`acc`}\u001b[${39}m`} = ${acc}; ${`\u001b[${36}m${`curr`}\u001b[${39}m`} = [${curr}]; ${`\u001b[${36}m${`i`}\u001b[${39}m`} = ${i}`
    );
    console.log("\n");
    console.log(`039 IS curr[0] = ${curr[0]}  <  i = ${i} + 1 ?`);
    console.log("\n");
    if (curr[0] < i + 1) {
      console.log(
        `043 calculateOffset() reduce ret: ${acc + curr[1] - curr[0]}`
      );
      return acc + curr[1] - curr[0];
    }
    console.log(`047 calculateOffset() reduce ret: ${acc}`);
    return acc;
  }, 0);

  console.log(`051 calculateOffset(): idx ${i} offset is: ${res}`);
  console.log(
    `${`\u001b[${36}m${`████████████████████^███████████████████`}\u001b[${39}m`}\n\n\n\n\n\n\n\n\n`
  );
  return res;
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
    `073 ${`\u001b[${33}m${`older`}\u001b[${39}m`} = ${JSON.stringify(
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
  let composed = [];

  // ---------------------------------------------------------------------------
  while (newer.length) {
    console.log("\n");
    console.log(
      `091 ==========================================\n${`\u001b[${35}m${`processing newer`}\u001b[${39}m`}[0] = ${`\u001b[${32}m[${
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
      console.log("\n");
      console.log(
        `109 ██ ${`\u001b[${36}m${`processing older`}\u001b[${39}m`}[0] = ${`\u001b[${32}m[${
          older[0]
        }]\u001b[${39}m`}\n`
      );

      // 0.

      // If there are no more newer[] elements left, push older[] elements
      // starting from the first-one. This clause happens later in the loops.

      const offset = calculateOffset(olderRanges, newer[0][0]);
      console.log(
        `121 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`offset`}\u001b[${39}m`} = ${offset}`
      );

      if (!newer.length) {
        console.log(
          `126 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
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
      else if (
        newer[0][1] + calculateOffset(olderRanges, newer[0][1]) <=
        older[0][0]
      ) {
        console.log(`144 ${`\u001b[${90}m${`CASE #1`}\u001b[${39}m`}`);
        // Array.shift will move the first element of array "newer" into
        // array "composed":
        console.log(
          `148 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
            newer[0],
            null,
            0
          )}, then ${JSON.stringify(older[0], null, 0)}`
        );
        composed.push(newer.shift());
        composed.push(older.shift());
      } else {
        // 2. Harder case. We can't simply move the range into older ranges
        // because there is a clash and we need to recalculate it.
        console.log(`159 ${`\u001b[${90}m${`CASE #2`}\u001b[${39}m`}`);

        const newerLen = newer[0][1] - newer[0][0];
        if (older.length === 1 || newerLen <= older[1][0] - older[0][1]) {
          console.log(
            `164 newer ${JSON.stringify(
              newer[0],
              null,
              0
            )} will fit or there is only one`
          );
          console.log(
            `171 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} older ${JSON.stringify(
              older[0],
              null,
              0
            )}`
          );
          composed.push(older[0]);

          // so we have a clash, two arrays, older[0] and newer[0].
          // all depends, do they overlap or not.
          let rangeToPut;
          if (
            newer[0][0] + calculateOffset(olderRanges, newer[0][0]) <
            older[0][0]
          ) {
            console.log(
              `187 newer[0][0]=${
                newer[0][0]
              } + offset=${offset} < older[0][0]=${older[0][0]}`
            );
            rangeToPut = [
              Math.min(older[0][0], newer[0][0]),
              newer[0][1] + calculateOffset(olderRanges, newer[0][1])
            ];
          } else {
            console.log(
              `197 newer[0][0]=${
                newer[0][0]
              } + offset=${offset} >= older[0][0]=${older[0][0]}`
            );
            rangeToPut = [
              newer[0][0] + calculateOffset(olderRanges, newer[0][0]),
              newer[0][1] + calculateOffset(olderRanges, newer[0][1])
            ];
          }
          console.log(
            `207 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} rangeToPut = [${rangeToPut}]`
          );
          if (newer[0][2] !== undefined) {
            rangeToPut.push(newer[0][2]);
          }
          console.log(
            `213 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
              rangeToPut,
              null,
              0
            )}`
          );
          composed.push(rangeToPut);
          console.log(
            `221 ${`\u001b[${33}m${`composed`}\u001b[${39}m`} = ${JSON.stringify(
              composed,
              null,
              0
            )}`
          );
          newer.shift();
          older.shift();
        } else {
          console.log(
            `231 newer ${JSON.stringify(newer[0], null, 0)} won't fit`
          );
          // the gap between current older[] and the following older[] elements
          // is not enough to fix the current newer[] in.
          // The plan is, loop through all remaining older[] and fill all the
          // gaps with characters from newer[0]

          let lengthToCover = newer[0][1] - newer[0][0];
          while (lengthToCover && older.length) {
            console.log(
              `241 ${`\u001b[${36}m${`========`}\u001b[${39}m`} LOOP ${`\u001b[${36}m${`========`}\u001b[${39}m`}`
            );
            console.log(
              `244 ${`\u001b[${33}m${`older`}\u001b[${39}m`} = ${JSON.stringify(
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
                  `256 ${`\u001b[${32}m${`GAP [${older[0][1]}, ${
                    older[1][0]
                  }] WILL BE COVERED COMPLETELY`}\u001b[${39}m`}`
                );
                // 0. first, push current older[0]
                const currentOlder = older[0];
                console.log(
                  `263 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                    currentOlder,
                    null,
                    0
                  )}`
                );
                composed.push(currentOlder);
                console.log(
                  `271 ${`\u001b[${33}m${`composed`}\u001b[${39}m`} = ${JSON.stringify(
                    composed,
                    null,
                    0
                  )}`
                );
                // push 1. filler for this gap in older[] and 2. that next older[]
                // range as well

                // 1.
                console.log(
                  `282 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                    [older[0][1], older[1][0]],
                    null,
                    0
                  )}`
                );
                composed.push([older[0][1], older[1][0]]);
                console.log(
                  `290 ${`\u001b[${33}m${`composed`}\u001b[${39}m`} = ${JSON.stringify(
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
                //   `301 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                //     older[0],
                //     null,
                //     0
                //   )}`
                // );
                // composed.push(older.shift());
                // console.log(
                //   `309 ${`\u001b[${33}m${`composed`}\u001b[${39}m`} = ${JSON.stringify(
                //     composed,
                //     null,
                //     0
                //   )}`
                // );
                // 3. reduce the counter
                console.log(
                  `317 AFTER THAT, ${`\u001b[${33}m${`older`}\u001b[${39}m`} = ${JSON.stringify(
                    older,
                    null,
                    0
                  )}; ${`\u001b[${33}m${`lengthToCover`}\u001b[${39}m`} = ${lengthToCover}`
                );
              } else {
                console.log(
                  `325 ${`\u001b[${31}m${`GAP [${older[0][1]}, ${
                    older[1][0]
                  }] WILL NOT BE COVERED COMPLETELY`}\u001b[${39}m`}`
                );
                // this gap is too big, so just push the remainder of the newer[]
                console.log(
                  `331 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [${
                    newer[0][1]
                  }, ${newer[0][1] + lengthToCover}]`
                );
                composed.push(newer[0][1], newer[0][1] + lengthToCover);
                console.log(
                  `337 ${`\u001b[${33}m${`composed`}\u001b[${39}m`} = ${JSON.stringify(
                    composed,
                    null,
                    0
                  )}`
                );
                // reset lengthToCover
                lengthToCover = 0;
                console.log(`345 lengthToCover = ${lengthToCover}`);
              }
            } else {
              // there's just last element left
              // 1. push it
              console.log(
                `351 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
                  older[0],
                  null,
                  0
                )}`
              );
              const lastElFromOlder = older.shift();
              composed.push(lastElFromOlder);

              // remember to add third element, what to add from newer[0]
              if (newer[0][2] !== undefined) {
                composed.push([
                  lastElFromOlder[1],
                  lastElFromOlder[1] + lengthToCover,
                  newer[0][2]
                ]);
              } else {
                composed.push([
                  lastElFromOlder[1],
                  lastElFromOlder[1] + lengthToCover
                ]);
              }

              lengthToCover = 0;

              console.log(
                `377 ${`\u001b[${33}m${`composed`}\u001b[${39}m`} = ${JSON.stringify(
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
            `389 ${`\u001b[${36}m${`========`}\u001b[${39}m`} LOOP ENDS${`\u001b[${36}m${`========`}\u001b[${39}m`}`
          );
        }
      }
      console.log(`393 ${`\u001b[${31}m${`break`}\u001b[${39}m`}`);
      break;
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

  // push any and all leftovers
  if (older.length) {
    console.log(
      `411 ${`\u001b[${32}m${`CONCAT`}\u001b[${39}m`} ${JSON.stringify(
        older,
        null,
        0
      )}`
    );
    composed = composed.concat(older);
  }

  console.log("\n---------------------\n");
  console.log(
    `422 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}\n${`\u001b[${35}m${`raw`}\u001b[${39}m`}:    ${JSON.stringify(
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
