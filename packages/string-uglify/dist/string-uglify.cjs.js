/**
 * string-uglify
 * Uglify - generate short unique names for sets of strings
 * Version: 1.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-uglify
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var version = "1.0.0";

var isArr = Array.isArray;
function extract(num) {
  if (num < 26) {
    return num;
  }
  while (num > 9) {
    num = Array.from(String(num)).reduce(function (accum, curr) {
      return accum + Number.parseInt(curr);
    }, 0);
    if (num < 26) {
      return num;
    }
  }
}
function tellcp(str, idNum) {
  return str.codePointAt(idNum);
}
function uglifyById(refArr, idNum) {
  return uglifyArr(refArr)[idNum];
}
function uglifyArr(arr) {
  var letters = "abcdefghijklmnopqrstuvwxyz";
  var res = [];
  if (!isArr(arr) || !arr.length) {
    return arr;
  }
  var gatheredSoFar = [];
  var previousResCount;
  var _loop = function _loop(id, len) {
    previousResCount = res.length;
    var prefix = ".#".includes(arr[id][0]) ? arr[id][0] : "";
    var nums = [extract(Array.from(arr[id]).reduce(function (acc, curr) {
      return acc + tellcp(curr);
    }, 0)), extract(Array.from(arr[id]).reduce(function (acc, curr) {
      return acc < 1000 ? acc * tellcp(curr) : extract(acc * tellcp(curr) - 1);
    }, 1)), extract(Array.from(arr[id]).reduce(function (acc, curr) {
      return extract(acc * tellcp(curr) + 1);
    }, 1))];
    nums.push(extract(nums[0] + 11));
    nums.push(extract(nums[1] + 12));
    nums.push(extract(nums[2] + 13));
    nums.push(extract(nums[0] * nums[1]));
    nums.push(extract(nums[1] * nums[2]));
    nums.push(extract(nums[2] * nums[0]));
    nums.push(extract(nums[0] * nums[1] + 11));
    nums.push(extract(nums[1] * nums[0] + 12));
    nums.push(extract(nums[2] * nums[1] + 13));
    nums.push(extract((nums[0] + 1) * (nums[1] + 2)));
    nums.push(extract((nums[1] + 2) * (nums[1] + 3)));
    nums.push(extract((nums[2] + 3) * (nums[0] + 4)));
    var calculated = void 0;
    do {
      if (!gatheredSoFar.length) {
        gatheredSoFar.push(0);
      } else {
        var i = 0;
        while (i < gatheredSoFar.length) {
          if (gatheredSoFar[i] < nums.length - 1) {
            gatheredSoFar[i] += 1;
            break;
          } else {
            gatheredSoFar[i] = 0;
            if (gatheredSoFar[i + 1] === undefined) {
              gatheredSoFar.push(0);
              break;
            }
          }
          i++;
        }
      }
      calculated = "".concat(prefix).concat(gatheredSoFar.map(function (id) {
        return letters[nums[id]];
      }).join(""));
    } while (res.includes(calculated));
    res.push("".concat(prefix).concat(gatheredSoFar.map(function (id) {
      return letters[nums[id]];
    }).join("")));
    if (res.length === previousResCount) {
      throw new Error("string-uglify: [THROW_ID_01] internal error!");
    } else {
      previousResCount = res.length;
    }
  };
  for (var id = 0, len = arr.length; id < len; id++) {
    _loop(id);
  }
  return res;
}

exports.uglifyArr = uglifyArr;
exports.uglifyById = uglifyById;
exports.version = version;
