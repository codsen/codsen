import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { promises as fsp } from "fs";
import objectPath from "object-path";
import { traverse } from "ast-monkey-traverse";
import { globby } from "globby";
import path from "path";
import pMap from "p-map";
import clone from "lodash.clonedeep";

import { set } from "../dist/edit-package-json.esm.js";

function isStr(something) {
  return typeof something === "string";
}

globby([
  path.resolve("../", "**/package.json"),
  "!**/node_modules/**",
  "!**/test/**",
])
  .then((arr) =>
    pMap(arr, (path2) => {
      return fsp
        .readFile(path2)
        .then((contents) => (contents ? JSON.parse(contents) : {}));
    })
  )
  .then((objectsArr) => {
    // console.log(objectsArr.length);
    test("validate the incoming parsed package.json count", () => {
      ok(
        objectsArr.length,
        `${objectsArr.length} package.json objects are parsed and fed here`
      );
    });
    for (let idx = 0, len = objectsArr.length; idx < len; idx++) {
      let obj = objectsArr[idx];
      // console.log(`processing: ${idx}/${wholeArr.length}`);
      traverse(obj, (key, val, innerObj) => {
        // console.log(`path ${innerObj.path}`);
        let current = val !== undefined ? val : key;
        // 1. test SET
        // ensure that if we set this path to something using set() result
        // is the same as to object-path.set()

        let calculated;
        let editedRefObj;

        let amended = set(JSON.stringify(obj, null, 4), innerObj.path, "x");
        try {
          calculated = JSON.parse(amended);
        } catch (e) {
          test(`failure in set()`, () => {
            not.ok(
              `package #${`${idx}`.padStart(3, "0")}: ${obj.name}; path: ${
                innerObj.path
              } - failure: ${e} - amended:\n${amended}`,
              "02.01"
            );
          });
        }

        try {
          editedRefObj = clone(obj);
          objectPath.set(editedRefObj, innerObj.path, "x");
        } catch (e) {
          test(`failure in objectPath.set():`, () => {
            not.ok(
              `package #${`${idx}`.padStart(3, "0")}: ${obj.name}; path: ${
                innerObj.path
              } - failure: ${e}`,
              "03.01"
            );
          });
        }

        if (!(isStr(key) && key.includes("."))) {
          // only run the test if key's name doesn't include a dot.
          // Object-path won't work while this program will but still we can't compare.
          test(`${idx} - ${innerObj.path} - our set() is identical to object-path.set()`, () => {
            equal(
              calculated,
              editedRefObj,
              `package #${`${idx}`.padStart(3, "0")}: ${obj.name}; path: ${
                innerObj.path
              }`
            );
          });
        }
        // 2. test DEL
        return current;
      });
    }
  })
  .catch((e) => {
    console.log(`something wrong happened: ${e}`);
  });

test.run();
