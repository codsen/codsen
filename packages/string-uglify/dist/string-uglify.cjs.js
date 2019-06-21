/**
 * string-uglify
 * Uglify - generate unique short names for sets of strings
 * Version: 1.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-uglify
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var version = "1.0.1";

var isArr = Array.isArray;
function tellcp(str, idNum) {
  return str.codePointAt(idNum);
}
function uglifyById(refArr, idNum) {
  return uglifyArr(refArr)[idNum];
}
function uglifyArr(arr) {
  var letters = "abcdefghijklmnopqrstuvwxyz";
  var lettersAndNumbers = "abcdefghijklmnopqrstuvwxyz0123456789";
  var res = [];
  if (!isArr(arr) || !arr.length) {
    return arr;
  }
  for (var id = 0, len = arr.length; id < len; id++) {
    if (arr.indexOf(arr[id]) < id) {
      res.push(res[arr.indexOf(arr[id])]);
      continue;
    }
    var prefix = ".#".includes(arr[id][0]) ? arr[id][0] : "";
    var codePointSum = Array.from(arr[id]).reduce(function (acc, curr) {
      return acc + tellcp(curr);
    }, 0);
    if (".#".includes(arr[id][0]) && arr[id].length < 4 || !".#".includes(arr[id][0]) && arr[id].length < 3) {
      if (!res.includes(arr[id])) {
        res.push(arr[id]);
        continue;
      }
    }
    var generated = "".concat(prefix).concat(letters[codePointSum % letters.length]).concat(lettersAndNumbers[codePointSum % lettersAndNumbers.length]);
    if (!res.includes(generated)) {
      res.push(generated);
    } else {
      var soFarWeveGot = generated;
      var counter = 0;
      var reducedCodePointSum = Array.from(arr[id]).reduce(function (acc, curr) {
        return acc < 200 ? acc + tellcp(curr) : (acc + tellcp(curr)) % lettersAndNumbers.length;
      }, 0);
      var magicNumber = Array.from(arr[id]).map(function (val) {
        return tellcp(val);
      }).reduce(function (accum, curr) {
        var temp = accum + curr;
        do {
          temp = String(temp).split("").reduce(function (acc, curr) {
            return acc + Number.parseInt(curr);
          }, 0);
        } while (temp >= 10);
        return temp;
      }, 0);
      while (res.includes(soFarWeveGot)) {
        counter++;
        soFarWeveGot += lettersAndNumbers[reducedCodePointSum * magicNumber * counter % lettersAndNumbers.length];
      }
      res.push(soFarWeveGot);
    }
  }
  return res;
}

exports.uglifyArr = uglifyArr;
exports.uglifyById = uglifyById;
exports.version = version;
