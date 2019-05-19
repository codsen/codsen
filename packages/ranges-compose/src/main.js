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
//
//          ??????/?? ?
//
//          __ ___  ____
//        /   \   \\    \
//        \             /
//         \          //
//         .----------,
//       /  ,----.  __\_
//     /   /      \/    /\
//    |    |   ?? |  ??/  \
//    |    |   ?? |\__/    \
//    \     `----'   /__   _\
//     \             \  U   /
//      \            ,\    ,
//       `-------- -   \  /
//       /         /    \/
//      /         /
//     /         /
//    /         /
//   /         /
//  /         /
//

function composeRanges(str, olderRanges1, newerRanges2, originalOpts) {
  // early ending:
  if (olderRanges1 === null) {
    if (newerRanges2 === null) {
      return null;
    }
    return newerRanges2;
  }
  if (newerRanges2 === null) {
    return olderRanges1;
  }

  // normal, composing cases
  const older = merge(olderRanges1);
  const newer = merge(newerRanges2);
  const newerlen = newer.length;
  const olderlen = older.length;
  console.log(
    `060 ${`\u001b[${33}m${`older`}\u001b[${39}m`} = ${JSON.stringify(
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
  let offset = 0;
  let currentNewerPushed = false;
  let lastOlderPushed = null;

  // ---------------------------------------------------------------------------
  for (let i = 0; i < newerlen; i++) {
    console.log("\n");
    console.log(
      `081 ==========================================\n${`\u001b[${35}m${`processing newer`}\u001b[${39}m`}[${i}] = ${`\u001b[${32}m[${
        newer[i]
      }]\u001b[${39}m`}\n`
    );

    currentNewerPushed = false;

    //                         L O O P     S T A R T S
    //                                  |
    //                                  |
    //                                  |
    //                                  |
    //                               \  |  /
    //                                \ | /
    //                                 \|/
    //                                  V

    for (let y = 0; y < olderlen; y++) {
      if (y !== lastOlderPushed) {
        offset += older[y][1] - older[y][0];
        console.log(
          `102 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} offset = ${offset}`
        );

        console.log("");
        console.log(
          `107 ${`\u001b[${36}m${`---------------------`}\u001b[${39}m`}\n${`\u001b[${35}m${`processing older`}\u001b[${39}m`}[${y}] = ${`\u001b[${36}m[${
            older[y]
          }]\u001b[${39}m`}; ${`\u001b[${33}m${`offset`}\u001b[${39}m`} = ${offset}; ${`\u001b[${33}m${`lastOlderPushed`}\u001b[${39}m`} = ${lastOlderPushed}\n`
        );

        // case #1
        // if newer range is in front of older, for example, older is [3, 4] and
        // newer is [0, 1], newer goes in front as is
        if (newer[i][1] < older[y][0]) {
          //
          //                        CASE #1
          //
          console.log(`119 ${`\u001b[${32}m${`CASE #1`}\u001b[${39}m`}`);
          composed.push(newer[i]);
          console.log(
            `122 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
              newer[i],
              null,
              0
            )} into composed now = ${JSON.stringify(composed, null, 0)}`
          );

          currentNewerPushed = true;
        } else if (newer[i][1] === older[y][0]) {
          //
          //                        CASE #2
          //
          console.log(
            `135 ${`\u001b[${32}m${`CASE #2`}\u001b[${39}m`} - newer[i=${i}][1]=${
              newer[i][1]
            } === older[y=${y}][0]=${older[y][0]}`
          );
          // merge new range with old range
          composed.push([newer[i][0], older[y][1]]);
          console.log(
            `142 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
              [newer[i][0], older[y][1]],
              null,
              0
            )} into composed now = ${JSON.stringify(composed, null, 0)}`
          );

          currentNewerPushed = true;
        } else if (newer[i][0] === older[y][0]) {
          //
          //                        CASE #3
          //

          // so resulting range will be combination of old and new
          const newFromVal = older[y][0];
          const newToVal = older[y][1] + (newer[i][1] - newer[i][0]);

          if (older[y + 1]) {
            console.log("160 next older exists");
          } else {
            console.log("162 next older does not exist");
          }

          const tempToPush = [newFromVal, newToVal];
          console.log(
            `167 ${`\u001b[${32}m${`CASE #3`}\u001b[${39}m`} - newer[i=${i}][0]=${`\u001b[${33}m${
              newer[i][0]
            }\u001b[${39}m`} ${`\u001b[${33}m${`===`}\u001b[${39}m`} older[y=${y}][0]=${`\u001b[${33}m${
              older[y][0]
            }\u001b[${39}m`}`
          );
          composed.push(tempToPush);
          console.log(
            `175 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
              tempToPush,
              null,
              0
            )} into composed now = ${JSON.stringify(composed, null, 0)}`
          );

          currentNewerPushed = true;
          lastOlderPushed = y;

          console.log(
            `186 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`} - this newer ${`\u001b[${33}m${JSON.stringify(
              newer[i],
              null,
              0
            )}\u001b[${39}m`} is done`
          );
          break;
        } else if (newer[i][0] > older[y][1]) {
          //
          //                        CASE #4
          //
          console.log(
            `198 ${`\u001b[${32}m${`CASE #4`}\u001b[${39}m`} - newer[i=${i}][0]=${`\u001b[${33}m${
              newer[i][0]
            }\u001b[${39}m`} ${`\u001b[${33}m${`>`}\u001b[${39}m`} older[y=${y}][1]=${`\u001b[${33}m${
              older[y][1]
            }\u001b[${39}m`}`
          );

          // push that older array
          composed.push(older[y]);
          console.log(
            `208 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} older[y=${y}]=${
              older[y]
            } into composed; which is now equal to ${JSON.stringify(
              composed,
              null,
              0
            )}`
          );

          // offset += older[y][1] - older[y][0];
          // console.log(`218 SET offset = ${offset}`);

          // offset the index by how much subsequent
          // characters were changed because of this

          // we don't touch "currentNewerPushed"
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

    // if by now the newer hasn't been pushed, push it.
    // Practically, this way we move all older ranges that sit before the
    // current newer into composed array
    if (!currentNewerPushed) {
      const tempToPush = [newer[i][0] + offset, newer[i][1] + offset];
      console.log(
        `244 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${JSON.stringify(
          tempToPush,
          null,
          4
        )}`
      );
      composed.push(tempToPush);
    } else if (i + 1 === newerlen && lastOlderPushed < olderlen) {
      // ended with "currentNewerPushed" = true

      // if by now there are no more newer's left, push all pending "olders" if
      // there are any left
      console.log(
        `257 ${`\u001b[${90}m${`PS. newer array's end reached`}\u001b[${39}m`}`
      );
      console.log(
        `260 LOG ${`\u001b[${33}m${`lastOlderPushed`}\u001b[${39}m`} = ${lastOlderPushed}`
      );

      // push all remaining older ranges:
      for (let z = lastOlderPushed + 1; z < olderlen; z++) {
        composed.push(older[z]);
        console.log(
          `267 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} older[z=${z}]=${
            older[z]
          } into composed; which is now equal to ${JSON.stringify(
            composed,
            null,
            0
          )}`
        );
      }
    }

    // if last range from newer is done
    if (i === newerlen - 1) {
      // if this last newer range is before any older ranges, submit those
      // older ranges. For example, older [3, 4], newer [0, 1]. The newer does
      // not overlap so goes in. End of all newer is reached, there's still
      // older [3, 4] left which comes after, so we submit it.
      if (newer[i][1] < older[0][0]) {
        composed.push(older[0]);
        console.log(
          `287 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} older[0]=${JSON.stringify(
            older[0],
            null,
            0
          )} into composed now = ${JSON.stringify(composed, null, 0)}`
        );
      }
    }
  }

  console.log("\n---------------------\n");
  console.log(
    `299 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}\n${`\u001b[${35}m${`raw`}\u001b[${39}m`}:    ${JSON.stringify(
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
