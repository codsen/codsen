/**
 * string-uglify
 * Uglify - generate unique short names for sets of strings
 * Version: 1.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/string-uglify
 */

var version = "1.0.1";

const isArr = Array.isArray;
function extract(num) {
  if (num < 26) {
    return num;
  }
  while (num > 9) {
    num = Array.from(String(num)).reduce((accum, curr) => {
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
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const res = [];
  if (!isArr(arr) || !arr.length) {
    return arr;
  }
  const gatheredSoFar = [];
  let previousResCount;
  for (let id = 0, len = arr.length; id < len; id++) {
    previousResCount = res.length;
    const prefix = `.#`.includes(arr[id][0]) ? arr[id][0] : "";
    const nums = [
      extract(Array.from(arr[id]).reduce((acc, curr) => acc + tellcp(curr), 0)),
      extract(
        Array.from(arr[id]).reduce(
          (acc, curr) =>
            acc < 1000 ? acc * tellcp(curr) : extract(acc * tellcp(curr) - 1),
          1
        )
      ),
      extract(
        Array.from(arr[id]).reduce(
          (acc, curr) => extract(acc * tellcp(curr) + 1),
          1
        )
      )
    ];
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
    let calculated;
    do {
      if (!gatheredSoFar.length) {
        gatheredSoFar.push(0);
      } else {
        let i = 0;
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
      calculated = `${prefix}${gatheredSoFar
        .map(id => letters[nums[id]])
        .join("")}`;
    } while (res.includes(calculated));
    res.push(`${prefix}${gatheredSoFar.map(id => letters[nums[id]]).join("")}`);
    if (res.length === previousResCount) {
      throw new Error("string-uglify: [THROW_ID_01] internal error!");
    } else {
      previousResCount = res.length;
    }
  }
  return res;
}

export { uglifyArr, uglifyById, version };
