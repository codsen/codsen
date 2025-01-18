import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync as read, writeFileSync as write } from "fs";
import objectPath from "object-path";

import { set, del } from "../dist/edit-package-json.esm.js";

const __filename2 = fileURLToPath(import.meta.url);
const __dirname2 = path.dirname(__filename2);

function compare(eq, testName, pathToProcess, val) {
  let isSet = arguments.length === 4;
  // console.log(`011 ${isSet ? "SET" : "DEL"} mode`);

  let source = read(
    path.join(__dirname2, "fixtures", `${testName}.json`),
    "utf8",
  );
  let result = read(
    path.join(__dirname2, "fixtures", `${testName}.expected.json`),
    "utf8",
  );

  try {
    let checkme = Number.parseInt(
      read(path.join(__dirname2, "fixtures", `${testName}.control.md`), "utf8"),
      10,
    );
    eq(
      source.trim().length,
      checkme,
      `either delete testfile size control record file, ${testName}.control.md`,
    );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // if the control file character count file doesn't exist, write it
    write(
      path.join(__dirname2, "fixtures", `${testName}.control.md`),
      source.trim().length,
    );
  }

  let testedResult = isSet
    ? set(source, pathToProcess, val)
    : del(source, pathToProcess);

  // 01.
  eq(testedResult, result, "01 - string is identical after the operation");

  // 02. parsed versions we just compared must be deep-equal
  eq(
    JSON.parse(testedResult),
    JSON.parse(result),
    "02 - both parsed parties are deep-equal",
  );

  // 03. result is equivalent to (JSON.parse + object-path.set())
  /* eslint prefer-const:0 */
  let temp = JSON.parse(source);

  if (isSet) {
    objectPath.set(temp, pathToProcess, val);
  } else {
    objectPath.del(temp, pathToProcess);
  }
  eq(
    temp,
    JSON.parse(result),
    "03 - objectPath operation is indeed equivalent",
  );
}

// -----------------------------------------------------------------------------
// all fixture tests
// -----------------------------------------------------------------------------

// if there's fourth input argument, it's SET(), if not, it's DEL()

test("01 - deletes a key from package.json - scenario from update-versions package", () => {
  compare(equal, "upd", "lect.various.devDependencies.4");
});

test("02 - deletes a key from key which has a value with escaped quotes - minified", () => {
  compare(equal, "escaped-quotes-minified", "a");
});

test("03 - deletes a key from key which has a value with escaped quotes - normal", () => {
  compare(equal, "escaped-quotes", "a");
});

test("04 - updates a key 1", () => {
  compare(equal, "bug1", "dependencies.yz", "^1.2.17");
});

test("05 - updates a key 2", () => {
  compare(equal, "bug2", "gh.yz", "3");
});

test("06 - updates a key 3", () => {
  compare(equal, "bug3", "gh.yz", "3");
});

test.run();
