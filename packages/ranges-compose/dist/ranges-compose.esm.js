/**
 * ranges-compose
 * Convert ranges over ranges into flat single set of ranges
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-compose
 */

import 'lodash.clonedeep';
import 'lodash.isplainobject';
import merge from 'ranges-merge';

function calculateOffset(olderRanges, i) {
  const res = olderRanges.reduce((acc, curr) => {
    if (curr[0] < i + 1) {
      return acc + curr[1] - curr[0];
    }
    return acc;
  }, 0);
  return res;
}
function composeRanges(str, olderRanges, newerRanges, originalOpts) {
  if (olderRanges === null) {
    if (newerRanges === null) {
      return null;
    }
    return newerRanges;
  } else if (newerRanges === null) {
    return olderRanges;
  }
  const older = merge(olderRanges);
  const newer = merge(newerRanges);
  let composed = [];
  while (newer.length) {
    while (older.length) {
      const offset = calculateOffset(olderRanges, newer[0][0]);
      if (!newer.length) {
        composed.push(older.shift());
      }
      else if (
        newer[0][1] + calculateOffset(olderRanges, newer[0][1]) <=
        older[0][0]
      ) {
        composed.push(newer.shift());
        composed.push(older.shift());
      } else {
        const newerLen = newer[0][1] - newer[0][0];
        if (older.length === 1 || newerLen <= older[1][0] - older[0][1]) {
          composed.push(older[0]);
          let rangeToPut;
          if (
            newer[0][0] + calculateOffset(olderRanges, newer[0][0]) <
            older[0][0]
          ) {
            rangeToPut = [
              Math.min(older[0][0], newer[0][0]),
              newer[0][1] + calculateOffset(olderRanges, newer[0][1])
            ];
          } else {
            rangeToPut = [
              newer[0][0] + calculateOffset(olderRanges, newer[0][0]),
              newer[0][1] + calculateOffset(olderRanges, newer[0][1])
            ];
          }
          if (newer[0][2] !== undefined) {
            rangeToPut.push(newer[0][2]);
          }
          composed.push(rangeToPut);
          newer.shift();
          older.shift();
        } else {
          let lengthToCover = newer[0][1] - newer[0][0];
          while (lengthToCover && older.length) {
            if (older.length > 1) {
              const gapLength = older[1][0] - older[0][1];
              if (lengthToCover >= gapLength) {
                const currentOlder = older[0];
                composed.push(currentOlder);
                composed.push([older[0][1], older[1][0]]);
                lengthToCover -= older[1][0] - older[0][1];
                older.shift();
              } else {
                composed.push(newer[0][1], newer[0][1] + lengthToCover);
                lengthToCover = 0;
              }
            } else {
              const lastElFromOlder = older.shift();
              composed.push(lastElFromOlder);
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
            }
          }
          newer.shift();
        }
      }
      break;
    }
  }
  if (older.length) {
    composed = composed.concat(older);
  }
  return merge(composed);
}

export default composeRanges;
