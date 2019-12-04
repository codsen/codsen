const t = require("tap");
const fs = require("fs");
const fsp = fs.promises;
const { set } = require("../dist/edit-package-json.cjs");
const objectPath = require("object-path");
const traverse = require("ast-monkey-traverse");
const globby = require("globby");
const path = require("path");
const pMap = require("p-map");
const clone = require("lodash.clonedeep");

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
    // console.log(objectsArr.length);
    t.test("validate the incoming parsed package.json count", t => {
      t.ok(
        objectsArr.length,
        `${objectsArr.length} package.json objects are parsed and fed here`
      );
      t.end();
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
          t.test(`failure in set()`, t => {
            t.fail(
              `package #${`${idx}`.padStart(3, "0")}: ${obj.name}; path: ${
                innerObj.path
              } - failure: ${e} - amended:\n${amended}`
            );
            t.end();
          });
        }

        try {
          editedRefObj = clone(obj);
          objectPath.set(editedRefObj, innerObj.path, "x");
        } catch (e) {
          t.test(`failure in objectPath.set():`, t => {
            t.fail(
              `package #${`${idx}`.padStart(3, "0")}: ${obj.name}; path: ${
                innerObj.path
              } - failure: ${e}`
            );
            t.end();
          });
        }

        if (!(isStr(key) && key.includes("."))) {
          // only run the test if key's name doesn't include a dot.
          // Object-path won't work while this program will but still we can't compare.
          t.test(
            `${idx} - ${innerObj.path} - our set() is identical to object-path.set()`,
            t => {
              t.same(
                calculated,
                editedRefObj,
                `package #${`${idx}`.padStart(3, "0")}: ${obj.name}; path: ${
                  innerObj.path
                }`
              );
              t.end();
            }
          );
        }
        // 2. test DEL
        return current;
      });
    }
  })
  .catch(e => {
    console.log(`something wrong happened: ${e}`);
  });
