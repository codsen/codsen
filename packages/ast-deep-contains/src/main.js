import objectPath from "object-path";
import traverse from "ast-monkey-traverse";
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
  // console.log(`014 goUp(): INCOMING pathStr = "${pathStr}"`);
  for (let i = pathStr.length; i--; ) {
    if (pathStr[i] === ".") {
      // console.log(`017 goUp(): RETURN "${pathStr.slice(0, i)}"`);
      return pathStr.slice(0, i);
    }
  }
  // console.log(`021 RETURN pathStr = "${pathStr}"`);
  return pathStr;
}
function dropIth(arr, badIdx) {
  return Array.from(arr).filter((el, i) => i !== badIdx);
}

function strictCompare(tree1, tree2, cb, errCb, opts) {
  console.log(`029 strictCompare() called`);
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
    // release AST monkey to traverse tree2, check each node's presence in tree1
    traverse(tree2, (key, val, innerObj) => {
      const current = val !== undefined ? val : key;
      // retrieve the path of the current node from the monkey
      console.log(
        `048 ${`\u001b[${33}m${`innerObj`}\u001b[${39}m`} = ${JSON.stringify(
          innerObj,
          null,
          4
        )}; typeof current = "${typeof current}"`
      );
      const { path } = innerObj;
      console.log("\n");
      console.log(
        `057 ========= ${`\u001b[${36}m${`path`}\u001b[${39}m`}: ${path}; ${`\u001b[${36}m${`current`}\u001b[${39}m`} = ${JSON.stringify(
          current,
          null,
          4
        )}`
      );
      // mind you, value on the path might be falsey such as null, so we check
      // its existence not by evaluating, is it truthy, but by path existence:
      if (objectPath.has(tree1, path)) {
        // if tree1 has that path on tree2, call the callback
        const retrieved = objectPath.get(tree1, path);
        if ((!isObj(retrieved) && !isArr(retrieved)) || !opts.skipContainers) {
          cb(retrieved, current, path);
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

function specialCompare(tree1, tree2, cb, errCb, opts) {
  console.log(`090 specialCompare() called`);
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
    // release AST monkey to traverse tree2, check each node's presence in tree1
    traverse(tree2, (key, val, innerObj, stop) => {
      const current = val !== undefined ? val : key;
      const { path } = innerObj;
      // retrieve the path of the current node from the monkey
      console.log("\n");
      console.log(
        `111 ${`\u001b[${90}m${`====================================`}\u001b[${39}m`} ${`\u001b[${36}m${`path`}\u001b[${39}m`}: ${path}; ${`\u001b[${36}m${`current`}\u001b[${39}m`} = ${JSON.stringify(
          current,
          null,
          0
        )} ${`\u001b[${90}m${`====================================`}\u001b[${39}m`}`
      );
      console.log(
        `118 ${`\u001b[${33}m${`innerObj`}\u001b[${39}m`} = ${JSON.stringify(
          innerObj,
          null,
          4
        )}; typeof current = "${typeof current}"`
      );

      if (objectPath.has(tree1, path)) {
        console.log(`126 tree1 does have the path "${path}"`);
        if (isObj(current) && innerObj.parentType === "array") {
          console.log(
            `129 ${`\u001b[${35}m${`██ object within array`}\u001b[${39}m`}`
          );
          // stop the monkey, we'll go further recursively
          stop.now = true;

          const arr1 = Array.from(
            innerObj.path.includes(".")
              ? objectPath.get(tree1, goUp(path))
              : tree1
          );

          if (arr1.length < innerObj.parent.length) {
            // source array from tree1 has less elements than array from tree2!
            // It will not be possible to match them all!
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

            // we extract just indexes:
            const tree1RefSource = arr1.map((v, i) => i);
            const tree2RefSource = arr2.map((v, i) => i);
            // [0, 1, 2] for example.
            // We'll use them to calculate combinations, as in 1st object in tree2
            // array against 2nd object in tree1 array...

            console.log(
              `${`\u001b[${33}m${`tree1RefSource`}\u001b[${39}m`} = ${JSON.stringify(
                tree1RefSource,
                null,
                0
              )}`
            );
            console.log(
              `${`\u001b[${33}m${`tree2RefSource`}\u001b[${39}m`} = ${JSON.stringify(
                tree2RefSource,
                null,
                0
              )}`
            );

            // Challenge: Array of objects is compared to another array of objects.
            // Order is mixed, the intended object is actually slightly off,
            // it's wrong, AVA will flag it, but we still need to pinpoint which
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
            // we'll ping those objects to user-supplied (likely AVA's t.is()) callback.
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

            const secondDigits = [];
            for (let i = 0, len = tree1RefSource.length; i < len; i++) {
              const currArr = [];
              const pickedVal = tree1RefSource[i];
              const disposableArr1 = dropIth(tree1RefSource, i);
              currArr.push(pickedVal);
              // iterate what's left
              disposableArr1.forEach(key => {
                secondDigits.push(Array.from(currArr).concat(key));
              });
            }

            const finalCombined = secondDigits.map(arr => {
              return arr.map((val, i) => [i, val]);
            });

            console.log(
              `\n\n245 ${`\u001b[${35}m${`MAPPING TABLE:`}\u001b[${39}m`} ${finalCombined.reduce(
                (acc, curr, idx) => {
                  return `${acc}${idx % 2 === 0 ? "\n" : ""}\n${JSON.stringify(
                    curr,
                    null,
                    0
                  )}`;
                },
                ""
              )}`
            );

            // now, use the "finalCombined" as a guidance which objects to match against which, and array-push the comparison score as third element into each. Whichever comparison gathers highest score, gets pinged to the callback.

            console.log("\n");

            let maxScore = 0;

            for (let i = 0, len = finalCombined.length; i < len; i++) {
              // finalCombined[i] === something like [[0,0],[1,1]]

              // tree1 array: arr1
              // tree2 array: arr2

              console.log(`\n-----\n#${i + 1}:`);
              let score = 0;
              finalCombined[i].forEach(mapping => {
                console.log(
                  `${JSON.stringify(
                    arr2[mapping[0]],
                    null,
                    0
                  )} vs. ${JSON.stringify(arr1[mapping[1]], null, 0)}`
                );

                if (isObj(arr2[mapping[0]]) && isObj(arr1[mapping[1]])) {
                  score += 2;
                  if (
                    Object.keys(arr2[mapping[0]]).every(key =>
                      Object.keys(arr1[mapping[1]]).includes(key)
                    )
                  ) {
                    score += 4;
                    if (
                      Object.keys(arr2[mapping[0]]).length ===
                      Object.keys(arr1[mapping[1]]).length
                    ) {
                      score += 6;
                    }
                    if (
                      Object.keys(arr2[mapping[0]]).every(
                        key => arr1[mapping[1]][key] === arr2[mapping[0]][key]
                      )
                    ) {
                      score += 8;
                    }
                  }
                } else if (
                  typeof arr2[mapping[0]] === typeof arr1[mapping[1]]
                ) {
                  score++;
                }
                console.log(`307 score: ${score}`);
              });
              // finally, push the score as 3rd arg. into mapping array
              finalCombined[i].push(score);
              if (score > maxScore) {
                maxScore = score;
              }
            }

            console.log(
              `\n\n317: ${`\u001b[${35}m${`WITH SCORES:`}\u001b[${39}m`} ${finalCombined.reduce(
                (acc, curr, idx) => {
                  return `${acc}${idx % 2 === 0 ? "\n" : ""}\n${JSON.stringify(
                    curr,
                    null,
                    0
                  )}`;
                },
                ""
              )}`
            );
            console.log(
              `\n329 ${`\u001b[${35}m${`MAX SCORE:`}\u001b[${39}m`} ${maxScore}`
            );

            // FINALLY, ping callbacks with the max score objects
            for (let i = 0, len = finalCombined.length; i < len; i++) {
              if (finalCombined[i][2] === maxScore) {
                console.log(
                  `336 ${`\u001b[${35}m${`PING:`}\u001b[${39}m`} ${JSON.stringify(
                    [finalCombined[i][0], finalCombined[i][1]],
                    null,
                    0
                  )}`
                );

                finalCombined[i].forEach((matchPairObj, y) => {
                  // beware score is the last element.
                  if (y < finalCombined[i].length - 1) {
                    // console.log(
                    //   `${`\u001b[${33}m${`matchPairObj`}\u001b[${39}m`} = ${JSON.stringify(
                    //     matchPairObj,
                    //     null,
                    //     4
                    //   )}`
                    // );
                    console.log(
                      `${JSON.stringify(
                        arr1[matchPairObj[1]],
                        null,
                        4
                      )} vs ${JSON.stringify(arr2[matchPairObj[0]], null, 4)}`
                    );

                    // ping object pairs recursively:
                    specialCompare(
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
            //
          }
        } else {
          console.log(`378 it is not an object inside an array`);
          // if tree1 has that path on tree2, call the callback
          const retrieved = objectPath.get(tree1, path);
          console.log(
            `382 ${`\u001b[${33}m${`opts.skipContainers`}\u001b[${39}m`} = ${JSON.stringify(
              opts.skipContainers,
              null,
              4
            )}`
          );
          console.log(
            `389 ${`\u001b[${33}m${`retrieved`}\u001b[${39}m`} = ${JSON.stringify(
              retrieved,
              null,
              4
            )}; type: ${typeof retrieved}; isObj: ${isObj(retrieved)}`
          );
          if (
            !opts.skipContainers ||
            (!isObj(retrieved) && !isArr(retrieved))
          ) {
            console.log(`399 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} cb()`);
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

      console.log(
        `\n\n\n418 ${`\u001b[${90}m${`======================================================`}\u001b[${39}m`} fin. ${`\u001b[${90}m${`======================================================`}\u001b[${39}m`}`
      );
      return current;
    });
  }
}

function deepContains(tree1, tree2, cb, errCb, originalOpts) {
  const defaults = {
    skipContainers: true,
    arrayStrictComparison: false
  };
  const opts = Object.assign({}, defaults, originalOpts);
  if (opts.arrayStrictComparison) {
    return strictCompare(tree1, tree2, cb, errCb, opts);
  }
  return specialCompare(tree1, tree2, cb, errCb, opts);
}

// -----------------------------------------------------------------------------

export default deepContains;
