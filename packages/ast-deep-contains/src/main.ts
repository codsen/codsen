/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import { traverse } from "ast-monkey-traverse";
import objectPath from "object-path";

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

interface UnknownValueObj {
  [key: string]: any;
}

function isPlainObject(value: unknown): value is UnknownValueObj {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}

function typeLabel(value: unknown): string {
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return "array";
  }
  if (typeof value === "number" && Number.isNaN(value)) {
    return "nan";
  }
  if (typeof value !== "object") {
    return typeof value;
  }
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

export interface Opts {
  skipContainers: boolean;
  arrayStrictComparison: boolean;
}

const defaults: Opts = {
  skipContainers: true,
  arrayStrictComparison: false,
};

export type Callback = (
  leftSideVal: any,
  rightSideVal: any,
  path: string,
) => void;

export type ErrorCallback = (errStr: string) => void;

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
  const tree1Type = typeLabel(tree1);
  const tree2Type = typeLabel(tree2);
  if (tree1Type !== tree2Type) {
    errCb(
      `the first input arg is of a type ${tree1Type} but the second is ${tree2Type}. Values are - 1st:\n${JSON.stringify(
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
      DEV && console.log("099 \n");
      DEV &&
        console.log(
          `102 ${`\u001b[${90}m${`====================================`}\u001b[${39}m`} ${`\u001b[${36}m${`path`}\u001b[${39}m`}: ${path}; ${`\u001b[${36}m${`current`}\u001b[${39}m`} = ${JSON.stringify(
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
        DEV && console.log(`117 tree1 does have the path "${path}"`);
        if (
          !resolvedOpts.arrayStrictComparison &&
          isPlainObject(current) &&
          innerObj.parentType === "array" &&
          innerObj.parent.length > 1
        ) {
          DEV &&
            console.log(
              `126 ${`\u001b[${35}m${`██ object within array`}\u001b[${39}m`}`,
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
              `138 SET ${`\u001b[${33}m${`arr1`}\u001b[${39}m`} = ${JSON.stringify(
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
            DEV && console.log(`160`);
            let arr2: UnknownValueObj[] = innerObj.parent;
            DEV &&
              console.log(
                `164 SET ${`\u001b[${33}m${`arr2`}\u001b[${39}m`} = ${JSON.stringify(
                  arr2,
                  null,
                  4,
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
            // Find the maximum-score one-to-one assignment. This avoids generating
            // every permutation and works for arrays of any length.
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
            // The most similar pairs are sent to the user-supplied callback.
            //
            const mapping = findBestArrayMapping(arr2, arr1);
            DEV &&
              console.log(
                `198 SET ${`\u001b[${33}m${`mapping`}\u001b[${39}m`} = ${JSON.stringify(
                  mapping,
                  null,
                  4,
                )}`,
              );
            for (const [tree2Index, tree1Index] of mapping) {
              // ping object pairs recursively:
              deepContains(
                arr1[tree1Index],
                arr2[tree2Index],
                cb,
                errCb,
                resolvedOpts,
              );
            }
          }
        } else {
          DEV && console.log(`216 it is not an object inside an array`);
          // if tree1 has that path on tree2, call the callback
          let retrieved = objectPath.get(tree1, path);
          DEV &&
            console.log(
              `221 ${`\u001b[${33}m${`resolvedOpts.skipContainers`}\u001b[${39}m`} = ${JSON.stringify(
                resolvedOpts.skipContainers,
                null,
                4,
              )}`,
            );
          DEV &&
            console.log(
              `229 ${`\u001b[${33}m${`retrieved`}\u001b[${39}m`} = ${JSON.stringify(
                retrieved,
                null,
                4,
              )}; type: ${typeof retrieved}; isObj: ${isPlainObject(
                retrieved,
              )}`,
            );
          if (
            !resolvedOpts.skipContainers ||
            (!isPlainObject(retrieved) && !Array.isArray(retrieved))
          ) {
            DEV &&
              console.log(`242 ${`\u001b[${32}m${`PING`}\u001b[${39}m`} cb()`);
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
          `\n\n\n262 ${`\u001b[${90}m${`======================================================`}\u001b[${39}m`} fin. ${`\u001b[${90}m${`======================================================`}\u001b[${39}m`}`,
        );
      return current;
    });
  }
}

const hasOwn = Object.prototype.hasOwnProperty;

function similarityScore(rightValue: unknown, leftValue: unknown): number {
  if (!isPlainObject(rightValue) || !isPlainObject(leftValue)) {
    return 0;
  }

  let score = 0;
  for (const key of Object.keys(rightValue)) {
    if (hasOwn.call(leftValue, key)) {
      score += leftValue[key] === rightValue[key] ? 6 : 1;
    }
  }
  return score;
}

/**
 * Maximum-weight matching for a rectangular matrix, using the Hungarian
 * algorithm. The right array is no longer silently truncated to two items and
 * matching remains cubic instead of generating every possible permutation.
 */
function findBestArrayMapping(
  rightValues: unknown[],
  leftValues: unknown[],
): [rightIndex: number, leftIndex: number][] {
  const rowCount = rightValues.length;
  const columnCount = leftValues.length;
  const scores = rightValues.map((rightValue) =>
    leftValues.map((leftValue) => similarityScore(rightValue, leftValue)),
  );
  const rowPotential = new Array<number>(rowCount + 1).fill(0);
  const columnPotential = new Array<number>(columnCount + 1).fill(0);
  const matching = new Array<number>(columnCount + 1).fill(0);
  const previousColumn = new Array<number>(columnCount + 1).fill(0);

  for (let row = 1; row <= rowCount; row++) {
    matching[0] = row;
    let currentColumn = 0;
    const minimum = new Array<number>(columnCount + 1).fill(
      Number.POSITIVE_INFINITY,
    );
    const used = new Array<boolean>(columnCount + 1).fill(false);

    do {
      used[currentColumn] = true;
      const currentRow = matching[currentColumn];
      let delta = Number.POSITIVE_INFINITY;
      let nextColumn = 0;

      for (let column = 1; column <= columnCount; column++) {
        if (used[column]) {
          continue;
        }
        const cost =
          -scores[currentRow - 1][column - 1] -
          rowPotential[currentRow] -
          columnPotential[column];
        if (cost < minimum[column]) {
          minimum[column] = cost;
          previousColumn[column] = currentColumn;
        }
        if (minimum[column] < delta) {
          delta = minimum[column];
          nextColumn = column;
        }
      }

      for (let column = 0; column <= columnCount; column++) {
        if (used[column]) {
          rowPotential[matching[column]] += delta;
          columnPotential[column] -= delta;
        } else {
          minimum[column] -= delta;
        }
      }
      currentColumn = nextColumn;
    } while (matching[currentColumn] !== 0);

    do {
      const nextColumn = previousColumn[currentColumn];
      matching[currentColumn] = matching[nextColumn];
      currentColumn = nextColumn;
    } while (currentColumn !== 0);
  }

  const leftIndexByRight = new Array<number>(rowCount);
  for (let column = 1; column <= columnCount; column++) {
    if (matching[column] > 0) {
      leftIndexByRight[matching[column] - 1] = column - 1;
    }
  }
  return leftIndexByRight.map((leftIndex, rightIndex) => [
    rightIndex,
    leftIndex,
  ]);
}

// -----------------------------------------------------------------------------

export { deepContains, defaults, version };
