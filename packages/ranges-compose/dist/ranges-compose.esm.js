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

function isStr(something) {
  return typeof something === "string";
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
  const composed = [];
  let offset = 0;
  while (newer.length) {
    while (older.length) {
      if (!newer.length) {
        composed.push(older.shift());
      }
      else if (newer[0][1] <= older[0][0]) {
        composed.push(newer.shift());
        composed.push(older.shift());
      } else {
        const newerLen = newer[0][1] - newer[0][0];
        if (older.length === 1 || newerLen <= older[1][0] - older[0][1]) {
          offset +=
            older[0][1] -
            older[0][0] +
            (isStr(older[0][2]) ? older[0][2].length : 0);
          composed.push(older[0]);
          let rangeToPut;
          if (newer[0][0] < older[0][1]) {
            rangeToPut = [
              Math.min(older[0][0], newer[0][0]),
              newer[0][1] + offset
            ];
          } else {
            rangeToPut = [newer[0][0] + offset, newer[0][1] + offset];
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
    }
  }
  return merge(composed);
}

export default composeRanges;
