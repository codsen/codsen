import test from "ava";
import path from "path";
import { readFileSync as read, writeFileSync as write } from "fs";
import { set, del } from "../dist/edit-package-json.esm";
import objectPath from "object-path";

function compare(t, testName, pathToProcess, val) {
  const isSet = arguments.length === 4;
  // console.log(`009 ${isSet ? "SET" : "DEL"} mode`);

  const source = read(
    path.join(__dirname, "fixtures", `${testName}.json`),
    "utf8"
  );
  const result = read(
    path.join(__dirname, "fixtures", `${testName}.expected.json`),
    "utf8"
  );

  try {
    const checkme = Number.parseInt(
      read(path.join(__dirname, "fixtures", `${testName}.control.md`), "utf8"),
      10
    );
    t.is(
      source.trim().length,
      checkme,
      `either delete testfile size control record file, ${testName}.control.md`
    );
  } catch (e) {
    // if the control file character count file doesn't exist, write it
    write(
      path.join(__dirname, "fixtures", `${testName}.control.md`),
      source.trim().length
    );
  }

  const testedResult = isSet
    ? set(source, pathToProcess, val)
    : del(source, pathToProcess);

  // 01.
  t.is(testedResult, result, `01 - string is identical after the operation`);

  // 02. parsed versions we just compared must be deep-equal
  t.deepEqual(
    JSON.parse(testedResult),
    JSON.parse(result),
    `02 - both parsed parties are deep-equal`
  );

  // 03. result is equivalent to (JSON.parse + object-path.set())
  /* eslint prefer-const:0 */
  let temp = JSON.parse(source);

  if (isSet) {
    objectPath.set(temp, pathToProcess, val);
  } else {
    objectPath.del(temp, pathToProcess);
  }
  t.deepEqual(
    temp,
    JSON.parse(result),
    `03 - objectPath operation is indeed equivalent`
  );
}

// -----------------------------------------------------------------------------
// all fixture tests
// -----------------------------------------------------------------------------

// if there's fourth input argument, it's SET(), if not, it's DEL()

test("deletes a key from package.json - scenario from update-versions package", t =>
  compare(t, "upd", "lect.various.devDependencies.4"));

test("deletes a key from key which has a value with escaped quotes - minified", t =>
  compare(t, "escaped-quotes-minified", "a"));

test("deletes a key from key which has a value with escaped quotes - normal", t =>
  compare(t, "escaped-quotes", "a"));

test("updates a key 1", t => compare(t, "bug1", "dependencies.yz", "^1.2.17"));

test("updates a key 2", t => compare(t, "bug2", "gh.yz", "3"));

test("updates a key 3", t => compare(t, "bug3", "gh.yz", "3"));
