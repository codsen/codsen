/**
 * ast-deep-contains
 * an alternative assertion for Ava's t.deepEqual and Tap's t.same
 * Version: 1.1.7
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ast-deep-contains
 */

import objectPath from 'object-path';
import traverse from 'ast-monkey-traverse';

const isArr = Array.isArray;
function typeDetect(something) {
  if (something === null) {
    return "null";
  }
  return typeof something;
}
function isObj(something) {
  return typeDetect(something) === "object";
}
function goUp(pathStr) {
  for (let i = pathStr.length; i--; ) {
    if (pathStr[i] === ".") {
      return pathStr.slice(0, i);
    }
  }
  return pathStr;
}
function dropIth(arr, badIdx) {
  return Array.from(arr).filter((el, i) => i !== badIdx);
}
function deepContains(tree1, tree2, cb, errCb, originalOpts) {
  const defaults = {
    skipContainers: true,
    arrayStrictComparison: false
  };
  const opts = Object.assign({}, defaults, originalOpts);
  if (typeDetect(tree1) !== typeDetect(tree2)) {
    errCb(
      `the first input arg is of a type ${typeDetect(
        tree1
      ).toLowerCase()} but the second is ${typeDetect(
        tree2
      ).toLowerCase()}. Values are - 1st:\n${JSON.stringify(
        tree1,
        null,
        4
      )}\n2nd:\n${JSON.stringify(tree2, null, 4)}`
    );
  } else {
    traverse(tree2, (key, val, innerObj, stop) => {
      const current = val !== undefined ? val : key;
      const { path } = innerObj;
      if (objectPath.has(tree1, path)) {
        if (
          !opts.arrayStrictComparison &&
          isObj(current) &&
          innerObj.parentType === "array" &&
          innerObj.parent.length > 1
        ) {
          stop.now = true;
          const arr1 = Array.from(
            innerObj.path.includes(".")
              ? objectPath.get(tree1, goUp(path))
              : tree1
          );
          if (arr1.length < innerObj.parent.length) {
            errCb(
              `the first array: ${JSON.stringify(
                arr1,
                null,
                4
              )}\nhas less objects than array we're matching against, ${JSON.stringify(
                innerObj.parent,
                null,
                4
              )}`
            );
          } else {
            const arr2 = innerObj.parent;
            const tree1RefSource = arr1.map((v, i) => i);
            const tree2RefSource = arr2.map((v, i) => i);
            const secondDigits = [];
            for (let i = 0, len = tree1RefSource.length; i < len; i++) {
              const currArr = [];
              const pickedVal = tree1RefSource[i];
              const disposableArr1 = dropIth(tree1RefSource, i);
              currArr.push(pickedVal);
              disposableArr1.forEach(key => {
                secondDigits.push(Array.from(currArr).concat(key));
              });
            }
            const finalCombined = secondDigits.map(arr => {
              return arr.map((val, i) => [i, val]);
            });
            let maxScore = 0;
            for (let i = 0, len = finalCombined.length; i < len; i++) {
              let score = 0;
              finalCombined[i].forEach(mapping => {
                if (isObj(arr2[mapping[0]]) && isObj(arr1[mapping[1]])) {
                  Object.keys(arr2[mapping[0]]).forEach(key => {
                    if (Object.keys(arr1[mapping[1]]).includes(key)) {
                      score += 1;
                      if (arr1[mapping[1]][key] === arr2[mapping[0]][key]) {
                        score += 5;
                      }
                    }
                  });
                }
              });
              finalCombined[i].push(score);
              if (score > maxScore) {
                maxScore = score;
              }
            }
            for (let i = 0, len = finalCombined.length; i < len; i++) {
              if (finalCombined[i][2] === maxScore) {
                finalCombined[i].forEach((matchPairObj, y) => {
                  if (y < finalCombined[i].length - 1) {
                    deepContains(
                      arr1[matchPairObj[1]],
                      arr2[matchPairObj[0]],
                      cb,
                      errCb,
                      opts
                    );
                  }
                });
                break;
              }
            }
          }
        } else {
          const retrieved = objectPath.get(tree1, path);
          if (
            !opts.skipContainers ||
            (!isObj(retrieved) && !isArr(retrieved))
          ) {
            cb(retrieved, current, path);
          }
        }
      } else {
        errCb(
          `the first input: ${JSON.stringify(
            tree1,
            null,
            4
          )}\ndoes not have the path "${path}", we were looking, would it contain a value ${JSON.stringify(
            current,
            null,
            0
          )}.`
        );
      }
      return current;
    });
  }
}

export default deepContains;
