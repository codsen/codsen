// avanotonly
/* eslint import/no-extraneous-dependencies:0 */

import test from "ava";
const fs = require("fs");
const fsp = fs.promises;
import { set } from "../dist/edit-package-json.esm";
import objectPath from "object-path";
import traverse from "ast-monkey-traverse";
import globby from "globby";
import path from "path";
import pMap from "p-map";
import clone from "lodash.clonedeep";

// test("todo", t => {
//   t.pass("todo");
// });

function isStr(something) {
  return typeof something === "string";
}

globby([
  path.resolve("../", "**/package.json"),
  "!**/node_modules/**",
  "!**/test/**"
])
  .then(arr =>
    pMap(arr, path => {
      return fsp
        .readFile(path)
        .then(contents => (contents ? JSON.parse(contents) : {}));
    })
  )
  .then(objectsArr => {
    console.log(objectsArr.length);
    test("validate the incoming parsed package.json count", t => {
      t.truthy(
        objectsArr.length,
        `${objectsArr.length} package.json objects are parsed and fed here`
      );
    });
    for (let idx = 0, len = objectsArr.length; idx < len; idx++) {
      const obj = objectsArr[idx];
      // console.log(`processing: ${idx}/${wholeArr.length}`);
      traverse(obj, (key, val, innerObj) => {
        // console.log(`path ${innerObj.path}`);
        const current = val !== undefined ? val : key;
        // 1. test SET
        // ensure that if we set this path to something using set() result
        // is the same as to object-path.set()

        let calculated;
        let editedRefObj;

        const amended = set(JSON.stringify(obj, null, 4), innerObj.path, "x");
        try {
          calculated = JSON.parse(amended);
        } catch (e) {
          test(`failure in set()`, t => {
            t.fail(
              `package #${`${idx}`.padStart(3, "0")}: ${obj.name}; path: ${
                innerObj.path
              } - failure: ${e} - amended:\n${amended}`
            );
          });
        }

        try {
          editedRefObj = clone(obj);
          objectPath.set(editedRefObj, innerObj.path, "x");
        } catch (e) {
          test(`failure in objectPath.set():`, t => {
            t.fail(
              `package #${`${idx}`.padStart(3, "0")}: ${obj.name}; path: ${
                innerObj.path
              } - failure: ${e}`
            );
          });
        }

        if (!(isStr(key) && key.includes("."))) {
          // only run the test if key's name doesn't include a dot.
          // Object-path won't work while this program will but still we can't compare.
          test(`${idx} - ${innerObj.path} - our set() is identical to object-path.set()`, t => {
            t.deepEqual(
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
  .catch(e => {
    console.log(`something wrong happened: ${e}`);
  });
