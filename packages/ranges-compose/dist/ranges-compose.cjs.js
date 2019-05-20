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
  var older = merge(olderRanges);
  var newer = merge(newerRanges);
  console.log("038 ".concat("\x1B[".concat(33, "m", "older", "\x1B[", 39, "m"), " = ", JSON.stringify(older, null, 0), "; ", "\x1B[".concat(33, "m", "newer", "\x1B[", 39, "m"), " = ").concat(JSON.stringify(newer, null, 0)));
  var composed = [];
  var offset = 0;
  while (newer.length) {
    console.log("\n");
    console.log("063 ==========================================\n".concat("\x1B[".concat(35, "m", "processing newer", "\x1B[", 39, "m"), "[0] = ", "\x1B[".concat(32, "m[", newer[0], "]\x1B[", 39, "m"), "\n"));
    while (older.length) {
      console.log("080 \u2588\u2588 \n".concat("\x1B[".concat(36, "m", "processing older", "\x1B[", 39, "m"), "[0] = ", "\x1B[".concat(32, "m[", older[0], "]\x1B[", 39, "m"), "\n"));
      if (!newer.length) {
        console.log("092 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify(older[0], null, 0)));
        composed.push(older.shift());
      }
      else if (newer[0][1] < older[0][0]) {
          console.log("107 CASE #1");
          console.log("111 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify(newer[0], null, 0), ", then ").concat(JSON.stringify(older[0], null, 0)));
          composed.push(newer.shift());
          composed.push(older.shift());
        } else {
          var newerLen = newer[0][1] - newer[0][0];
          if (older.length === 1 || newerLen <= older[1][0] - older[0][1]) {
            console.log("126 newer ".concat(JSON.stringify(newer[0], null, 0), " will fit"));
            offset += older[0][1] - older[0][0] + (isStr(older[0][2]) ? older[0][2].length : 0);
            console.log("133 range ".concat(JSON.stringify(older[0], null, 0), " ", "\x1B[".concat(33, "m", "offset", "\x1B[", 39, "m"), " = ").concat(offset));
            console.log("141 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify(newer[0].map(function (val) {
              return val + offset;
            }), null, 0), ", then ").concat(JSON.stringify(older[0], null, 0)));
            composed.push(older.shift());
            composed.push(newer.shift().map(function (val) {
              return val + offset;
            }));
          } else {
            console.log("151 newer ".concat(JSON.stringify(newer[0], null, 0), " won't fit"));
            var lengthToCover = newer[0][1] - newer[0][0];
            while (lengthToCover && older.length) {
              console.log("161 ".concat("\x1B[".concat(36, "m", "========", "\x1B[", 39, "m"), " LOOP ", "\x1B[".concat(36, "m", "========", "\x1B[", 39, "m")));
              console.log("164 ".concat("\x1B[".concat(33, "m", "older", "\x1B[", 39, "m"), " = ", JSON.stringify(older, null, 0)));
              if (older.length > 1) {
                var gapLength = older[1][0] - older[0][1];
                if (lengthToCover >= gapLength) {
                  console.log("176 ".concat("\x1B[".concat(32, "m", "GAP [".concat(older[0][1], ", ").concat(older[1][0], "] WILL BE COVERED COMPLETELY"), "\x1B[", 39, "m")));
                  var currentOlder = older[0];
                  console.log("183 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify(currentOlder, null, 0)));
                  composed.push(currentOlder);
                  console.log("191 ".concat("\x1B[".concat(33, "m", "composed", "\x1B[", 39, "m"), " = ", JSON.stringify(composed, null, 0)));
                  console.log("202 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify([older[0][1], older[1][0]], null, 0)));
                  composed.push([older[0][1], older[1][0]]);
                  console.log("210 ".concat("\x1B[".concat(33, "m", "composed", "\x1B[", 39, "m"), " = ", JSON.stringify(composed, null, 0)));
                  lengthToCover -= older[1][0] - older[0][1];
                  older.shift();
                  console.log("237 AFTER THAT, ".concat("\x1B[".concat(33, "m", "older", "\x1B[", 39, "m"), " = ", JSON.stringify(older, null, 0), "; ", "\x1B[".concat(33, "m", "lengthToCover", "\x1B[", 39, "m"), " = ").concat(lengthToCover));
                } else {
                  console.log("245 ".concat("\x1B[".concat(31, "m", "GAP [".concat(older[0][1], ", ").concat(older[1][0], "] WILL NOT BE COVERED COMPLETELY"), "\x1B[", 39, "m")));
                  console.log("251 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " [", newer[0][1], ", ").concat(newer[0][1] + lengthToCover, "]"));
                  composed.push(newer[0][1], newer[0][1] + lengthToCover);
                  console.log("257 ".concat("\x1B[".concat(33, "m", "composed", "\x1B[", 39, "m"), " = ", JSON.stringify(composed, null, 0)));
                  lengthToCover = 0;
                  console.log("265 lengthToCover = ".concat(lengthToCover));
                }
              } else {
                console.log("271 ".concat("\x1B[".concat(32, "m", "PUSH", "\x1B[", 39, "m"), " ", JSON.stringify(older[0], null, 0)));
                var lastElFromOlder = older.shift();
                composed.push(lastElFromOlder);
                composed.push([lastElFromOlder[1], lastElFromOlder[1] + lengthToCover]);
                lengthToCover = 0;
                console.log("287 ".concat("\x1B[".concat(33, "m", "composed", "\x1B[", 39, "m"), " = ", JSON.stringify(composed, null, 0), "; lengthToCover = ").concat(lengthToCover));
              }
            }
            newer.shift();
            console.log("299 ".concat("\x1B[".concat(36, "m", "========", "\x1B[", 39, "m"), " LOOP ENDS", "\x1B[".concat(36, "m", "========", "\x1B[", 39, "m")));
          }
        }
    }
  }
  console.log("\n---------------------\n");
  console.log("318 ".concat("\x1B[".concat(32, "m", "RETURN", "\x1B[", 39, "m"), "\n", "\x1B[".concat(35, "m", "raw", "\x1B[", 39, "m"), ":    ", JSON.stringify(composed, null, 0), ";\n", "\x1B[".concat(35, "m", "merged", "\x1B[", 39, "m"), ": ").concat(JSON.stringify(merge(composed), null, 0), "\n"));
  return merge(composed);
}

module.exports = composeRanges;
