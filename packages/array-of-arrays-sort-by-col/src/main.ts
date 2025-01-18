import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

// FUNCTIONS - INTERNAL
// -----------------------------------------------------------------------------

function existy(x: any): boolean {
  return x != null;
}

function logArray(
  arr: any[],
  highlightIdx: number,
  colour?: number | string,
): string {
  return arr
    .map((el, i) => {
      let res = String(el);
      while (res.length < 8) {
        res = ` ${res}`;
      }
      if (i === highlightIdx) {
        res = ` \u001b[${colour || 36}m${res}\u001b[${39}m`;
      }
      return res;
    })
    .join("");
}

// function logArrayOfArrays(arr, highlightIdx) {
//   DEV && console.log(
//     `\n\n\n\n*** logArrayOfArrays:\n${"=".repeat(
//       arr[0].length * 8 + (arr[0].length - 1)
//     )}${arr.reduce((accum, currVal) => {
//       return `${accum}\n${logArray(currVal, highlightIdx)}`;
//     }, "")}\n${"=".repeat(arr[0].length * 8 + (arr[0].length - 1))}\n\n\n`
//   );
// }

// EXTERNAL API
// -----------------------------------------------------------------------------

/**
 * Sort array of arrays by column, rippling the sorting outwards from that column
 */
function sortByCol(arr: any[][], axis: number | string = 0): any[] {
  if (!Array.isArray(arr)) {
    throw new Error(
      `array-of-arrays-sort-by-col: [THROW_ID_01]: The first input argument was given not as array but as ${typeof arr}, equal to:\n${JSON.stringify(
        arr,
        null,
        0,
      )}`,
    );
  }
  if (isNaN(+axis)) {
    throw new Error(
      `array-of-arrays-sort-by-col: [THROW_ID_02]: The second input argument, index of the column to sort by (axis), is not integer (incl. zero)! It's currently given as:\n${JSON.stringify(
        axis,
        null,
        0,
      )} (type ${typeof axis})`,
    );
  }

  let maxLength = Math.max(...arr.map((arr2) => arr2.length));
  if (!maxLength) {
    return arr;
  }

  if (+axis >= maxLength) {
    throw new Error(
      `array-of-arrays-sort-by-col: [THROW_ID_03]: The second input argument, index of the column to sort by (axis), is marking the column which does not exist on any of the input arrays. Axis was given as ${+axis} while highest index goes as far as ${maxLength}.`,
    );
  }

  let resToBeReturned = Array.from(arr).sort((arr1, arr2) => {
    DEV && console.log(`===========================================`);
    DEV && console.log(logArray(arr1, +axis));
    DEV && console.log(`${logArray(arr2, +axis)}\n`);

    // 1. check the axis column first:
    if (arr1[+axis] !== arr2[+axis]) {
      DEV &&
        console.log(
          `\u001b[${33}m${`${arr1[+axis]} vs. ${arr2[+axis]}`}\u001b[${39}m`,
        );
      if (
        (!existy(arr1[+axis]) && existy(arr2[+axis])) ||
        (existy(arr1[+axis]) &&
          existy(arr2[+axis]) &&
          arr1[+axis] > arr2[+axis])
      ) {
        DEV && console.log(`097 return 1, SWAP`);
        return 1;
      }
      /* c8 ignore next */
      if (
        (existy(arr1[+axis]) && !existy(arr2[+axis])) ||
        (existy(arr1[+axis]) &&
          existy(arr2[+axis]) &&
          arr1[+axis] < arr2[+axis])
      ) {
        DEV && console.log(`107 return -1, STAYS AS-IS`);
        return -1;
      }
    }
    // 2. if we reached this point, we need to ripple outwards from the axis
    // column, comparing first what's outside on the left-side, then right, then
    // left outside of it, then right outside of it, then left outside of it...

    let maxRangeToIterate = Math.max(arr1.length, arr2.length);
    let maxRipplesLength = Math.max(+axis, maxRangeToIterate - +axis - 1);

    // DEV && console.log(
    //   `\u001b[${35}m${`maxRipplesLength: ${maxRipplesLength}`}\u001b[${39}m`
    // );

    // iterate through the ripple's length:
    for (let i = 1; i <= maxRipplesLength; i++) {
      DEV &&
        console.log(
          `${`\u001b[${36}m${` \u00B0\u00BA\u00A4\u00F8,\u00B8\u00B8,\u00F8\u00A4\u00BA\u00B0\u00B0\u00BA\u00A4\u00F8,\u00B8,\u00F8\u00A4\u00B0\u00BA\u00A4\u00F8,\u00B8\u00B8,\u00F8\u00A4\u00BA\u00B0\u00B0\u00BA\u00A4\u00F8,\u00B8`}\u001b[${39}m`}\n`,
        );
      if (+axis - i >= 0) {
        // logging:
        DEV && console.log(logArray(arr1, +axis - i, 35));
        DEV && console.log(logArray(arr2, +axis - i, 35));
        DEV && console.log(" ");

        // comparison:
        if (existy(arr1[+axis - i])) {
          if (existy(arr2[+axis - i])) {
            if (arr1[+axis - i] < arr2[+axis - i]) {
              DEV && console.log(`138 return -1, ALL STAYS AS-IS`);
              return -1;
            }
            if (arr1[+axis - i] > arr2[+axis - i]) {
              DEV && console.log(`142 return 1, SWAP`);
              return 1;
            }
          } else {
            DEV && console.log(`146 return -1, ALL STAYS AS-IS`);
            return -1;
          }
        }
        // arr1 value is null or undefined
        // it's enough for arr2 not to be null or undefined and it goes on top:
        else if (existy(arr2[+axis - i])) {
          DEV && console.log(`153 return 1, SWAP`);
          return 1;
        }
      }
      /* c8 ignore next */
      if (+axis + i < maxRangeToIterate) {
        // logging:
        DEV && console.log(logArray(arr1, +axis + i, 35));
        DEV && console.log(logArray(arr2, +axis + i, 35));

        // comparison:
        if (existy(arr1[+axis + i])) {
          if (existy(arr2[+axis + i])) {
            if (arr1[+axis + i] < arr2[+axis + i]) {
              DEV && console.log(`167 return -1, ALL STAYS AS-IS`);
              return -1;
            }
            if (arr1[+axis + i] > arr2[+axis + i]) {
              DEV && console.log(`171 return 1, SWAP`);
              return 1;
            }
          } else {
            DEV && console.log(`175 return -1, ALL STAYS AS-IS`);
            return -1;
          }
        }
        // arr1 value is null or undefined
        // it's enough for arr2 not to be null or undefined and it goes on top:
        else if (existy(arr2[+axis + i])) {
          DEV && console.log(`182 return 1, SWAP`);
          return 1;
        }
      }
    }

    // 3. if by now any of returns hasn't happened yet, these two rows are equal
    DEV && console.log(`189 return 0 - \u001b[${32}m${`EQUAL`}\u001b[${39}m`);
    return 0;
  });

  // DEV && console.log("\n\n\nRETURNING:");
  // logArrayOfArrays(resToBeReturned, axis);

  return resToBeReturned;
}

export { sortByCol, version };
