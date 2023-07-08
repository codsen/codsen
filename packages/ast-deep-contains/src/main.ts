/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import objectPath from "object-path";
import { traverse } from "ast-monkey-traverse";
import is from "@sindresorhus/is";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

function goUp(pathStr: string): string {
  // DEV && console.log(`014 goUp(): INCOMING pathStr = "${pathStr}"`);
  if (pathStr.includes(".")) {
    for (let i = pathStr.length; i--; ) {
      if (pathStr[i] === ".") {
        // DEV && console.log(`017 goUp(): RETURN "${pathStr.slice(0, i)}"`);
        return pathStr.slice(0, i);
      }
    }
  }
  // DEV && console.log(`021 RETURN pathStr = "${pathStr}"`);
  return pathStr;
}

function dropIth<T>(arr: T[], badIdx: number): T[] {
  return Array.from(arr).filter((_el, i) => i !== badIdx);
}

interface UnknownValueObj {
  [key: string]: any;
}

export interface Opts {
  skipContainers: boolean;
  arrayStrictComparison: boolean;
}

const defaults: Opts = {
  skipContainers: true,
  arrayStrictComparison: false,
};

export interface Callback {
  (leftSideVal: any, rightSideVal: any, path: string): void;
}

export interface ErrorCallback {
  (errStr: string): void;
}

/**
 * Like t.same assert on array of objects, where element order doesn't matter.
 */
function deepContains(
  tree1: any,
  tree2: any,
  cb: Callback,
  errCb: ErrorCallback,
  opts?: Partial<Opts>,
): void {
  let resolvedOpts = { ...defaults, ...opts };
  if (is(tree1) !== is(tree2)) {
    errCb(
      `the first input arg is of a type ${is(
        tree1,
      ).toLowerCase()} but the second is ${is(
        tree2,
      ).toLowerCase()}. Values are - 1st:\n${JSON.stringify(
        tree1,
        null,
        4,
      )}\n2nd:\n${JSON.stringify(tree2, null, 4)}`,
    );
  } else {
    // release AST monkey to traverse tree2, check each node's presence in tree1
    traverse(tree2, (key, val, innerObj, stop) => {
      let current = val !== undefined ? val : key;
      let { path } = innerObj;
      // retrieve the path of the current node from the monkey
      DEV && console.log("\n");
      DEV &&
        console.log(
          `085 ${`\u001b[${90}m${`====================================`}\u001b[${39}m`} ${`\u001b[${36}m${`path`}\u001b[${39}m`}: ${path}; ${`\u001b[${36}m${`current`}\u001b[${39}m`} = ${JSON.stringify(
            current,
            null,
            0,
          )} ${`\u001b[${90}m${`====================================`}\u001b[${39}m`}`,
        );
      // DEV && console.log(
      //   `061 ${`\u001b[${33}m${`innerObj`}\u001b[${39}m`} = ${JSON.stringify(
      //     innerObj,
      //     null,
      //     4
      //   )}; typeof current = "${typeof current}"`
      // );

      if (objectPath.has(tree1, path)) {
        DEV && console.log(`100 tree1 does have the path "${path}"`);
        if (
          !resolvedOpts.arrayStrictComparison &&
          is.plainObject(current) &&
          innerObj.parentType === "array" &&
          innerObj.parent.length > 1
        ) {
          DEV &&
            console.log(
              `109 ${`\u001b[${35}m${`██ object within array`}\u001b[${39}m`}`,
            );
          // stop the monkey, we'll go further recursively
          stop.now = true;

          let arr1: UnknownValueObj[] = Array.from(
            innerObj.path.includes(".")
              ? objectPath.get(tree1, goUp(path))
              : tree1,
          );
          DEV &&
            console.log(
              `121 SET ${`\u001b[${33}m${`arr1`}\u001b[${39}m`} = ${JSON.stringify(
                arr1,
                null,
                4,
              )}`,
            );

          if (arr1.length < innerObj.parent.length) {
            // source array from tree1 has less elements than array from tree2!
            // It will not be possible to match them all!
            errCb(
              `the first array: ${JSON.stringify(
                arr1,
                null,
                4,
              )}\nhas less objects than array we're matching against, ${JSON.stringify(
                innerObj.parent,
                null,
                4,
              )}`,
            );
          } else {
            DEV && console.log(`143`);
            let arr2: UnknownValueObj[] = innerObj.parent;
            DEV &&
              console.log(
                `147 SET ${`\u001b[${33}m${`arr2`}\u001b[${39}m`} = ${JSON.stringify(
                  arr2,
                  null,
                  4,
                )}`,
              );

            // we extract just indexes:
            let tree1RefSource = arr1.map((_v, i) => i);
            let tree2RefSource = arr2.map((_v, i) => i);
            // [0, 1, 2] for example.
            // We'll use them to calculate combinations, as in 1st object in tree2
            // array against 2nd object in tree1 array...

            DEV &&
              console.log(
                `163 ${`\u001b[${33}m${`tree1RefSource`}\u001b[${39}m`} = ${JSON.stringify(
                  tree1RefSource,
                  null,
                  0,
                )}`,
              );
            DEV &&
              console.log(
                `171 ${`\u001b[${33}m${`tree2RefSource`}\u001b[${39}m`} = ${JSON.stringify(
                  tree2RefSource,
                  null,
                  0,
                )}`,
              );

            // Challenge: Array of objects is compared to another array of objects.
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

            let secondDigits: [number, number][] = [];

            for (let i = 0, len = tree1RefSource.length; i < len; i++) {
              let currArr: number[] = [];
              let pickedVal: number = tree1RefSource[i];
              DEV &&
                console.log(
                  `234 SET ${`\u001b[${33}m${`pickedVal`}\u001b[${39}m`} = ${JSON.stringify(
                    pickedVal,
                    null,
                    4,
                  )}`,
                );
              let disposableArr1 = dropIth(tree1RefSource, i);
              currArr.push(pickedVal);
              DEV &&
                console.log(
                  `244 PUSH to ${`\u001b[${33}m${`currArr`}\u001b[${39}m`} now = ${JSON.stringify(
                    currArr,
                    null,
                    4,
                  )}`,
                );
              // iterate what's left
              disposableArr1.forEach((key1) => {
                secondDigits.push(
                  Array.from(currArr).concat(key1) as [number, number],
                );
                DEV &&
                  console.log(
                    `257 secondDigits now = ${JSON.stringify(
                      secondDigits,
                      null,
                      4,
                    )}`,
                  );
              });
            }

            type FinalCombined = [
              [number, number],
              [number, number],
              number?,
            ][];
            let finalCombined: FinalCombined = secondDigits.map((arr) => {
              return arr.map((val2, i) => [i, val2]);
            }) as FinalCombined;
            DEV &&
              console.log(
                `276 SET ${`\u001b[${33}m${`finalCombined`}\u001b[${39}m`} = ${JSON.stringify(
                  finalCombined,
                  null,
                  4,
                )}`,
              );

            DEV && console.log(" ");
            DEV && console.log(" ");
            DEV &&
              console.log(
                `287 ${`\u001b[${35}m${`MAPPING TABLE:`}\u001b[${39}m`} ${finalCombined.reduce(
                  (acc, curr, idx) => {
                    return `${acc}${
                      idx % 2 === 0 ? "\n" : ""
                    }\n${JSON.stringify(curr, null, 0)}`;
                  },
                  "",
                )}`,
              );

            // now, use the "finalCombined" as a guidance which objects to match against which, and array-push the comparison score as third element into each. Whichever comparison gathers highest score, gets pinged to the callback.

            DEV && console.log(" ");

            let maxScore = 0;

            for (let i = 0, len = finalCombined.length; i < len; i++) {
              let score = 0;
              // finalCombined[i] === something like [[0,0],[1,1]]

              // tree1 array: arr1
              // tree2 array: arr2

              DEV && console.log(`\n-----\n#${i + 1}:`);
              finalCombined[i].forEach((mapping) => {
                DEV &&
                  console.log(
                    `314 ${`\u001b[${33}m${`mapping`}\u001b[${39}m`} = ${JSON.stringify(
                      mapping,
                      null,
                      4,
                    )}`,
                  );
                DEV &&
                  console.log(
                    `322 ${JSON.stringify(
                      arr2[(mapping as any)[0]],
                      null,
                      4,
                    )} vs. ${JSON.stringify(
                      arr1[(mapping as any)[1]],
                      null,
                      4,
                    )}`,
                  );

                if (
                  is.plainObject(arr2[(mapping as any)[0]]) &&
                  is.plainObject(arr1[(mapping as any)[1]])
                ) {
                  Object.keys(arr2[(mapping as any)[0]]).forEach((key2) => {
                    if (Object.keys(arr1[(mapping as any)[1]]).includes(key2)) {
                      score += 1;
                      if (
                        arr1[(mapping as any)[1]][key2] ===
                        arr2[(mapping as any)[0]][key2]
                      ) {
                        score += 5;
                      }
                    }
                  });
                }
              });
              DEV &&
                console.log(
                  `352 BEFORE PUSHING ${`\u001b[${33}m${`finalCombined[i]`}\u001b[${39}m`} = ${JSON.stringify(
                    finalCombined[i],
                    null,
                    4,
                  )}`,
                );
              finalCombined[i].push(score);
              DEV &&
                console.log(
                  `361 AFTER PUSHING ${`\u001b[${33}m${`finalCombined[i]`}\u001b[${39}m`} = ${JSON.stringify(
                    finalCombined[i],
                    null,
                    4,
                  )}`,
                );
              // finally, push the score as 3rd arg. into mapping array
              if (score > maxScore) {
                maxScore = score;
              }
            }

            DEV && console.log(" ");
            DEV && console.log(" ");
            DEV &&
              console.log(
                `377: ${`\u001b[${35}m${`WITH SCORES:`}\u001b[${39}m`} ${finalCombined.reduce(
                  (acc, curr, idx) => {
                    return `${acc}${
                      idx % 2 === 0 ? "\n" : ""
                    }\n${JSON.stringify(curr, null, 0)}`;
                  },
                  "",
                )}`,
              );
            DEV && console.log(" ");
            DEV &&
              console.log(
                `389 ${`\u001b[${35}m${`MAX SCORE:`}\u001b[${39}m`} ${maxScore}`,
              );

            // FINALLY, ping callbacks with the max score objects
            for (let i = 0, len = finalCombined.length; i < len; i++) {
              if (finalCombined[i][2] === maxScore) {
                DEV &&
                  console.log(
                    `397 ${`\u001b[${35}m${`PING:`}\u001b[${39}m`} ${JSON.stringify(
                      [finalCombined[i][0], finalCombined[i][1]],
                      null,
                      0,
                    )}`,
                  );

                finalCombined[i].forEach((matchPairObj, y) => {
                  // beware score is the last element.
                  if (y < finalCombined[i].length - 1) {
                    // DEV && console.log(
                    //   `${`\u001b[${33}m${`matchPairObj`}\u001b[${39}m`} = ${JSON.stringify(
                    //     matchPairObj,
                    //     null,
                    //     4
                    //   )}`
                    // );
                    DEV &&
                      console.log(
                        `${JSON.stringify(
                          arr1[(matchPairObj as any)[1]],
                          null,
                          4,
                        )} vs ${JSON.stringify(
                          arr2[(matchPairObj as any)[0]],
                          null,
                          4,
                        )}`,
                      );

                    // ping object pairs recursively:
                    deepContains(
                      arr1[(matchPairObj as any)[1]],
                      arr2[(matchPairObj as any)[0]],
                      cb,
                      errCb,
                      resolvedOpts,
                    );
                  }
                });

                break;
              }
            }
            //
          }
        } else {
          DEV && console.log(`444 it is not an object inside an array`);
          // if tree1 has that path on tree2, call the callback
          let retrieved = objectPath.get(tree1, path);
          DEV &&
            console.log(
              `449 ${`\u001b[${33}m${`resolvedOpts.skipContainers`}\u001b[${39}m`} = ${JSON.stringify(
                resolvedOpts.skipContainers,
                null,
                4,
              )}`,
            );
          DEV &&
            console.log(
              `457 ${`\u001b[${33}m${`retrieved`}\u001b[${39}m`} = ${JSON.stringify(
                retrieved,
                null,
                4,
              )}; type: ${typeof retrieved}; isObj: ${is.plainObject(
                retrieved,
              )}`,
            );
          if (
            !resolvedOpts.skipContainers ||
            (!is.plainObject(retrieved) && !Array.isArray(retrieved))
          ) {
            DEV &&
              console.log(`470 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} cb()`);
            cb(retrieved, current, path);
          }
        }
      } else {
        errCb(
          `the first input: ${JSON.stringify(
            tree1,
            null,
            4,
          )}\ndoes not have the path "${path}", we were looking, would it contain a value ${JSON.stringify(
            current,
            null,
            0,
          )}.`,
        );
      }

      DEV &&
        console.log(
          `\n\n\n348 ${`\u001b[${90}m${`======================================================`}\u001b[${39}m`} fin. ${`\u001b[${90}m${`======================================================`}\u001b[${39}m`}`,
        );
      return current;
    });
  }
}

// -----------------------------------------------------------------------------

export { deepContains, defaults, version };
