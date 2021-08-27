import tap from "tap";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { readFileSync as read, writeFileSync as write } from "fs";
import objectPath from "object-path";
import { set, del } from "../dist/edit-package-json.esm.js";

function compare(t, testName, pathToProcess, val) {
  const isSet = arguments.length === 4;
  // console.log(`011 ${isSet ? "SET" : "DEL"} mode`);

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
    t.equal(
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
  t.equal(testedResult, result, `01 - string is identical after the operation`);

  // 02. parsed versions we just compared must be deep-equal
  t.strictSame(
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
  t.strictSame(
    temp,
    JSON.parse(result),
    `03 - objectPath operation is indeed equivalent`
  );
}

// -----------------------------------------------------------------------------
// all fixture tests
// -----------------------------------------------------------------------------

// if there's fourth input argument, it's SET(), if not, it's DEL()

tap.test(
  "deletes a key from package.json - scenario from update-versions package",
  (t) => {
    compare(t, "upd", "lect.various.devDependencies.4");
    t.end();
  }
);

tap.test(
  "deletes a key from key which has a value with escaped quotes - minified",
  (t) => {
    compare(t, "escaped-quotes-minified", "a");
    t.end();
  }
);

tap.test(
  "deletes a key from key which has a value with escaped quotes - normal",
  (t) => {
    compare(t, "escaped-quotes", "a");
    t.end();
  }
);

tap.test("updates a key 1", (t) => {
  compare(t, "bug1", "dependencies.yz", "^1.2.17");
  t.end();
});

tap.test("updates a key 2", (t) => {
  compare(t, "bug2", "gh.yz", "3");
  t.end();
});

tap.test("updates a key 3", (t) => {
  compare(t, "bug3", "gh.yz", "3");
  t.end();
});
