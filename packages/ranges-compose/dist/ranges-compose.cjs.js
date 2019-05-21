/**
 * ranges-compose
 * Convert ranges over ranges into flat single set of ranges
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-compose
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('lodash.clonedeep');
require('lodash.isplainobject');
var merge = _interopDefault(require('ranges-merge'));

function calculateOffset(olderRanges, i) {
  var res = olderRanges.reduce(function (acc, curr) {
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
  var older = merge(olderRanges);
  var newer = merge(newerRanges);
  var composed = [];
  while (newer.length) {
    while (older.length) {
      var offset = calculateOffset(olderRanges, newer[0][0]);
      if (!newer.length) {
        composed.push(older.shift());
      }
      else if (newer[0][1] + calculateOffset(olderRanges, newer[0][1]) <= older[0][0]) {
          composed.push(newer.shift());
          composed.push(older.shift());
        } else {
          var newerLen = newer[0][1] - newer[0][0];
          if (older.length === 1 || newerLen <= older[1][0] - older[0][1]) {
            composed.push(older[0]);
            var rangeToPut = void 0;
            if (newer[0][0] + calculateOffset(olderRanges, newer[0][0]) < older[0][0]) {
              rangeToPut = [Math.min(older[0][0], newer[0][0]), newer[0][1] + calculateOffset(olderRanges, newer[0][1])];
            } else {
              rangeToPut = [newer[0][0] + calculateOffset(olderRanges, newer[0][0]), newer[0][1] + calculateOffset(olderRanges, newer[0][1])];
            }
            if (newer[0][2] !== undefined) {
              rangeToPut.push(newer[0][2]);
            }
            composed.push(rangeToPut);
            newer.shift();
            older.shift();
          } else {
            var lengthToCover = newer[0][1] - newer[0][0];
            while (lengthToCover && older.length) {
              if (older.length > 1) {
                var gapLength = older[1][0] - older[0][1];
                if (lengthToCover >= gapLength) {
                  var currentOlder = older[0];
                  composed.push(currentOlder);
                  composed.push([older[0][1], older[1][0]]);
                  lengthToCover -= older[1][0] - older[0][1];
                  older.shift();
                } else {
                  composed.push(newer[0][1], newer[0][1] + lengthToCover);
                  lengthToCover = 0;
                }
              } else {
                var lastElFromOlder = older.shift();
                composed.push(lastElFromOlder);
                if (newer[0][2] !== undefined) {
                  composed.push([lastElFromOlder[1], lastElFromOlder[1] + lengthToCover, newer[0][2]]);
                } else {
                  composed.push([lastElFromOlder[1], lastElFromOlder[1] + lengthToCover]);
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

module.exports = composeRanges;
