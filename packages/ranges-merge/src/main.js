/* eslint prefer-destructuring:0 */

import sortRanges from "ranges-sort";

// merges the overlapping ranges
// case #1. exact extension:
// [ [1, 5], [5, 10] ] => [ [1, 10] ]
// case #2. overlap:
// [ [1, 4], [3, 5] ] => [ [1, 5] ]
function mergeRanges(arrOfRanges, originalOpts) {
  //
  // internal functions:
  // ---------------------------------------------------------------------------
  function isStr(something) {
    return typeof something === "string";
  }
  function isObj(something) {
    return (
      something && typeof something === "object" && !Array.isArray(something)
    );
  }

  // quick ending:
  // ---------------------------------------------------------------------------
  if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
    return null;
  }

  // tend the opts:
  // ---------------------------------------------------------------------------
  const defaults = {
    mergeType: 1,
    progressFn: null,
    joinRangesThatTouchEdges: true,
  };

  let opts;
  if (originalOpts) {
    if (isObj(originalOpts)) {
      opts = { ...defaults, ...originalOpts };
      // 1. validate opts.progressFn
      if (
        opts.progressFn &&
        isObj(opts.progressFn) &&
        !Object.keys(opts.progressFn).length
      ) {
        opts.progressFn = null;
      } else if (opts.progressFn && typeof opts.progressFn !== "function") {
        throw new Error(
          `ranges-merge: [THROW_ID_01] opts.progressFn must be a function! It was given of a type: "${typeof opts.progressFn}", equal to ${JSON.stringify(
            opts.progressFn,
            null,
            4
          )}`
        );
      }
      // 2. validate opts.mergeType
      if (opts.mergeType && opts.mergeType !== 1 && opts.mergeType !== 2) {
        if (isStr(opts.mergeType) && opts.mergeType.trim() === "1") {
          opts.mergeType = 1;
        } else if (isStr(opts.mergeType) && opts.mergeType.trim() === "2") {
          opts.mergeType = 2;
        } else {
          throw new Error(
            `ranges-merge: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: "${typeof opts.mergeType}", equal to ${JSON.stringify(
              opts.mergeType,
              null,
              4
            )}`
          );
        }
      }
      // 3. validate opts.joinRangesThatTouchEdges
      if (typeof opts.joinRangesThatTouchEdges !== "boolean") {
        throw new Error(
          `ranges-merge: [THROW_ID_04] opts.joinRangesThatTouchEdges was customised to a wrong thing! It was given of a type: "${typeof opts.joinRangesThatTouchEdges}", equal to ${JSON.stringify(
            opts.joinRangesThatTouchEdges,
            null,
            4
          )}`
        );
      }
    } else {
      throw new Error(
        `emlint: [THROW_ID_03] the second input argument must be a plain object. It was given as:\n${JSON.stringify(
          originalOpts,
          null,
          4
        )} (type ${typeof originalOpts})`
      );
    }
  } else {
    opts = { ...defaults };
  }

  console.log(
    `097 USING ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );

  // progress-wise, sort takes first 20%

  // two-level-deep array clone:
  const filtered = arrOfRanges
    // filter out null
    .filter((range) => range)
    .map((subarr) => [...subarr])
    .filter(
      // filter out futile ranges with identical starting and ending points with
      // nothing to add (no 3rd argument)
      (rangeArr) => rangeArr[2] !== undefined || rangeArr[0] !== rangeArr[1]
    );

  let sortedRanges;
  let lastPercentageDone;
  let percentageDone;

  if (opts.progressFn) {
    // progress already gets reported in [0,100] range, so we just need to
    // divide by 5 in order to "compress" that into 20% range.
    sortedRanges = sortRanges(filtered, {
      progressFn: (percentage) => {
        percentageDone = Math.floor(percentage / 5);
        // ensure each percent is passed only once:
        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          opts.progressFn(percentageDone);
        }
      },
    });
  } else {
    sortedRanges = sortRanges(filtered);
  }

  const len = sortedRanges.length - 1;
  // reset 80% of progress is this loop:

  // loop from the end:
  for (let i = len; i > 0; i--) {
    console.log("\n\n");
    console.log(
      `\u001b[${36}m${`137 -------------- sortedRanges[${i}] = ${JSON.stringify(
        sortedRanges[i],
        null,
        0
      )} --------------`}\u001b[${39}m\n`
    );

    if (opts.progressFn) {
      percentageDone = Math.floor((1 - i / len) * 78) + 21;
      if (
        percentageDone !== lastPercentageDone &&
        percentageDone > lastPercentageDone
      ) {
        lastPercentageDone = percentageDone;
        opts.progressFn(percentageDone);
        // console.log(
        //   `153 REPORTING ${`\u001b[${33}m${`doneSoFar`}\u001b[${39}m`} = ${doneSoFar}`
        // );
      }
    }

    // if current range is before the preceding-one
    if (
      sortedRanges[i][0] <= sortedRanges[i - 1][0] ||
      (!opts.joinRangesThatTouchEdges &&
        sortedRanges[i][0] < sortedRanges[i - 1][1]) ||
      (opts.joinRangesThatTouchEdges &&
        sortedRanges[i][0] <= sortedRanges[i - 1][1])
    ) {
      console.log(`174  sortedRanges[${i}][0] = ${`\u001b[${33}m${
        sortedRanges[i][0]
      }\u001b[${39}m`} ? ${`\u001b[${32}m${`<=`}\u001b[${39}m`} ? sortedRanges[${
        i - 1
      }][0] = ${`\u001b[${33}m${sortedRanges[i - 1][0]}\u001b[${39}m`} ||
     sortedRanges[${i}][0] = ${`\u001b[${33}m${
        sortedRanges[i][0]
      }\u001b[${39}m`} ? ${`\u001b[${32}m${`<=`}\u001b[${39}m`} ? sortedRanges[${
        i - 1
      }][1] = ${`\u001b[${33}m${sortedRanges[i - 1][1]}\u001b[${39}m`}
`);
      sortedRanges[i - 1][0] = Math.min(
        sortedRanges[i][0],
        sortedRanges[i - 1][0]
      );
      sortedRanges[i - 1][1] = Math.max(
        sortedRanges[i][1],
        sortedRanges[i - 1][1]
      );
      console.log(
        `194 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} sortedRanges[${
          i - 1
        }][0] = ${sortedRanges[i - 1][0]}; sortedRanges[${i - 1}][1] = ${
          sortedRanges[i - 1][1]
        }`
      );

      // tend the third argument, "what to insert"
      if (
        sortedRanges[i][2] !== undefined &&
        (sortedRanges[i - 1][0] >= sortedRanges[i][0] ||
          sortedRanges[i - 1][1] <= sortedRanges[i][1])
      ) {
        console.log(`207 inside tend the insert value clauses`);

        // if the value of the range before exists:
        if (sortedRanges[i - 1][2] !== null) {
          if (sortedRanges[i][2] === null && sortedRanges[i - 1][2] !== null) {
            sortedRanges[i - 1][2] = null;
          } else if (sortedRanges[i - 1][2] !== undefined) {
            // if there's a clash of "insert" values:
            if (
              opts.mergeType === 2 &&
              sortedRanges[i - 1][0] === sortedRanges[i][0]
            ) {
              // take the value from the range that's on the right:
              sortedRanges[i - 1][2] = sortedRanges[i][2];
            } else {
              sortedRanges[i - 1][2] += sortedRanges[i][2];
            }
          } else {
            sortedRanges[i - 1][2] = sortedRanges[i][2];
          }
        }
      }

      // get rid of the second element:
      console.log(
        "232 --------------------------------------------------------"
      );
      console.log(
        `235 before splice: ${`\u001b[${33}m${`sortedRanges`}\u001b[${39}m`} = ${JSON.stringify(
          sortedRanges,
          null,
          4
        )}`
      );
      sortedRanges.splice(i, 1);
      console.log(
        `243 after splice: ${`\u001b[${33}m${`sortedRanges`}\u001b[${39}m`} = ${JSON.stringify(
          sortedRanges,
          null,
          4
        )}`
      );
      // reset the traversal, start from the end again
      i = sortedRanges.length;
      console.log(
        `252 in the end, ${`\u001b[${32}m${`SET`}\u001b[${39}m`} i = ${i}`
      );
    }
  }
  console.log(
    `257 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} sortedRanges = ${JSON.stringify(
      sortedRanges,
      null,
      4
    )}\n`
  );
  return sortedRanges.length ? sortedRanges : null;
}

export default mergeRanges;
