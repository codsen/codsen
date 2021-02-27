/**
 * ast-deep-contains
 * Like t.same assert on array of objects, where element order doesn't matter.
 * Version: 3.0.6
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-deep-contains/
 */

import objectPath from 'object-path';
import { traverse } from 'ast-monkey-traverse';
import is from '@sindresorhus/is';

var version$1 = "3.0.6";

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
const version = version$1;

function goUp(pathStr) {
  // console.log(`014 goUp(): INCOMING pathStr = "${pathStr}"`);
  if (pathStr.includes(".")) {
    for (let i = pathStr.length; i--;) {
      if (pathStr[i] === ".") {
        // console.log(`017 goUp(): RETURN "${pathStr.slice(0, i)}"`);
        return pathStr.slice(0, i);
      }
    }
  } // console.log(`021 RETURN pathStr = "${pathStr}"`);


  return pathStr;
}

function dropIth(arr, badIdx) {
  return Array.from(arr).filter((_el, i) => i !== badIdx);
}

const defaults = {
  skipContainers: true,
  arrayStrictComparison: false
};
/**
 * Like t.same assert on array of objects, where element order doesn't matter.
 */

function deepContains(tree1, tree2, cb, errCb, originalOpts) {
  const opts = { ...defaults,
    ...originalOpts
  };

  if (is(tree1) !== is(tree2)) {
    errCb(`the first input arg is of a type ${is(tree1).toLowerCase()} but the second is ${is(tree2).toLowerCase()}. Values are - 1st:\n${JSON.stringify(tree1, null, 4)}\n2nd:\n${JSON.stringify(tree2, null, 4)}`);
  } else {
    // release AST monkey to traverse tree2, check each node's presence in tree1
    traverse(tree2, (key, val, innerObj, stop) => {
      const current = val !== undefined ? val : key;
      const {
        path
      } = innerObj; // retrieve the path of the current node from the monkey // console.log(
      //   `061 ${`\u001b[${33}m${`innerObj`}\u001b[${39}m`} = ${JSON.stringify(
      //     innerObj,
      //     null,
      //     4
      //   )}; typeof current = "${typeof current}"`
      // );

      if (objectPath.has(tree1, path)) {

        if (!opts.arrayStrictComparison && is.plainObject(current) && innerObj.parentType === "array" && innerObj.parent.length > 1) { // stop the monkey, we'll go further recursively

          stop.now = true;
          const arr1 = Array.from(innerObj.path.includes(".") ? objectPath.get(tree1, goUp(path)) : tree1);

          if (arr1.length < innerObj.parent.length) {
            // source array from tree1 has less elements than array from tree2!
            // It will not be possible to match them all!
            errCb(`the first array: ${JSON.stringify(arr1, null, 4)}\nhas less objects than array we're matching against, ${JSON.stringify(innerObj.parent, null, 4)}`);
          } else {
            const arr2 = innerObj.parent; // we extract just indexes:

            const tree1RefSource = arr1.map((_v, i) => i);
            arr2.map((_v, i) => i); // [0, 1, 2] for example.
            // We'll use them to calculate combinations, as in 1st object in tree2
            // array against 2nd object in tree1 array... // Challenge: Array of objects is compared to another array of objects.
            // Order is mixed, the intended object is actually slightly off,
            // it's wrong, test runners will flag it, but we still need to pinpoint which
            // object did user intend to match against.
            // Outcome: we can't use strict comparison or even assume that anything
            // will be matching. The real world bar is the following: we need to
            // calculate which object is the most resembling which.
            //
            //
            // Plan: let's generate the table combinations of each table vs. each
            // table. Think about 3 vs. 2 compares:
            // deepContains(
            //   [
            //       { key1: "a", key2: "b" },
            //       { key1: "k", key2: "l" }, <---- we'd ignore this
            //       { key1: "x", key2: "y" }
            //   ],
            //   [
            //       { key1: "x", key2: "y" }, <---- notice, the order
            //       { key1: "a", key2: "b" }  <---- is wrong
            //   ]
            //
            //  Once we have table of all combinations, we'll calculate the
            // likeness score of each combination, and whichever is the highest
            // we'll ping those objects to user-supplied (likely AVA's t.equal()) callback.
            //
            // We want to achieve something like this (using example above):
            // [[0, 0], [1, 1]]
            // [[0, 0], [1, 2]]
            //
            // [[0, 1], [1, 0]]
            // [[0, 1], [1, 2]]
            //
            // [[0, 2], [1, 0]]
            // [[0, 2], [1, 1]]
            // where [[0, 0], [1, 1]] means:
            // [
            //   [ index 0 from tree2, index 0 from tree1 ]
            //   [ index 1 from tree2, index 1 from tree1 ]
            // ]
            // We'll compose the combinations array from two parts:
            // The first digits are following "tree2RefSource", the tree2 indexes.
            // The second digits are from iterating tree1, picking one and
            // iterating what's left for the second variation.
            // TODO:

            const secondDigits = []; // const secondDigits = [];

            for (let i = 0, len = tree1RefSource.length; i < len; i++) {
              const currArr = [];
              const pickedVal = tree1RefSource[i];
              const disposableArr1 = dropIth(tree1RefSource, i);
              currArr.push(pickedVal); // iterate what's left

              disposableArr1.forEach(key1 => {
                secondDigits.push(Array.from(currArr).concat(key1));
              });
            }

            const finalCombined = secondDigits.map(arr => {
              return arr.map((val2, i) => [i, val2]);
            }); // now, use the "finalCombined" as a guidance which objects to match against which, and array-push the comparison score as third element into each. Whichever comparison gathers highest score, gets pinged to the callback.
            let maxScore = 0;

            for (let i = 0, len = finalCombined.length; i < len; i++) {
              let score = 0; // finalCombined[i] === something like [[0,0],[1,1]]
              // tree1 array: arr1
              // tree2 array: arr2
              finalCombined[i].forEach(mapping => {

                if (is.plainObject(arr2[mapping[0]]) && is.plainObject(arr1[mapping[1]])) {
                  Object.keys(arr2[mapping[0]]).forEach(key2 => {
                    if (Object.keys(arr1[mapping[1]]).includes(key2)) {
                      score += 1;

                      if (arr1[mapping[1]][key2] === arr2[mapping[0]][key2]) {
                        score += 5;
                      }
                    }
                  });
                }
              });
              finalCombined[i].push(score); // finally, push the score as 3rd arg. into mapping array

              if (score > maxScore) {
                maxScore = score;
              }
            } // FINALLY, ping callbacks with the max score objects

            for (let i = 0, len = finalCombined.length; i < len; i++) {
              if (finalCombined[i][2] === maxScore) {
                finalCombined[i].forEach((matchPairObj, y) => {
                  // beware score is the last element.
                  if (y < finalCombined[i].length - 1) {
                    // console.log(
                    //   `${`\u001b[${33}m${`matchPairObj`}\u001b[${39}m`} = ${JSON.stringify(
                    //     matchPairObj,
                    //     null,
                    //     4
                    //   )}`
                    // ); // ping object pairs recursively:

                    deepContains(arr1[matchPairObj[1]], arr2[matchPairObj[0]], cb, errCb, opts);
                  }
                });
                break;
              }
            } //

          }
        } else { // if tree1 has that path on tree2, call the callback

          const retrieved = objectPath.get(tree1, path);

          if (!opts.skipContainers || !is.plainObject(retrieved) && !Array.isArray(retrieved)) {
            cb(retrieved, current, path);
          }
        }
      } else {
        errCb(`the first input: ${JSON.stringify(tree1, null, 4)}\ndoes not have the path "${path}", we were looking, would it contain a value ${JSON.stringify(current, null, 0)}.`);
      }
      return current;
    });
  }
} // -----------------------------------------------------------------------------

export { deepContains, defaults, version };
