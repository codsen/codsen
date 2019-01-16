/* eslint ava/prefer-async-await:0 */

import fs from "fs-extra";
import path from "path";
import test from "ava";
import execa from "execa";
// import tempy from "tempy";
import pMap from "p-map";
import pack from "../package.json";

// -----------------------------------------------------------------------------

// # Here's the test file/folder tree which will be temporary written:

// •
// ├── test1/
// │   ├── folder1/
// │   │   └── file3.json
// │   ├── file1.json
// │   ├── broken.json
// │   ├── .sneakyrc
// │   ├── .something.yml
// │   └── .somethinginyml
// ├── test2/
// │   └── file4.json
// └── file5.json

// File contents:
// -----------------------------------------------------------------------------

const testFileContents = [
  {
    // test1/file1.json
    b: "bbb1", // <------------ NOTICE THE ORDER OF THE KEYS IS NOT SORTED
    a: "aaa1",
    c: "ccc1"
  },
  {
    // test1/.sneakyrc
    c: "ccc2",
    b: "bbb2",
    a: "aaa2"
  },
  {
    // test1/folder1/file3.json
    d: "ddd3",
    c: "ccc3",
    b: "bbb3",
    a: "aaa3"
  },
  {
    // test2/file4.json
    a: "aaa4",
    c: [
      {
        z: "adasad",
        a: "sdfgdfgd",
        m: "dfgdfgdf"
      }
    ],
    b: "bbb4"
  },
  {
    // file5.json
    package: true
  }
];

const sortedTestFileContents = [
  // test1/file1.json
  `{
  "a": "aaa1",
  "b": "bbb1",
  "c": "ccc1"
}`,
  // test1/.sneakyrc
  `{
  "a": "aaa2",
  "b": "bbb2",
  "c": "ccc2"
}`,
  // test1/folder1/file3.json
  `{
  "a": "aaa3",
  "b": "bbb3",
  "c": "ccc3",
  "d": "ddd3"
}`,
  // test2/file4.json
  `{
  "a": "aaa4",
  "b": "bbb4",
  "c": [
    {
      "a": "sdfgdfgd",
      "m": "dfgdfgdf",
      "z": "adasad"
    }
  ]
}`,
  // file5.json
  `{
  "package": true
}`
];

const testFilePaths = [
  "test1/file1.json",
  "test1/.sneakyrc",
  "test1/folder1/file3.json",
  "test2/file4.json",
  "file5.json"
];

const sortedTabbedTestFileContents = [
  // test1/file1.json
  `{
\t"a": "aaa1",
\t"b": "bbb1",
\t"c": "ccc1"
}`,
  // test1/.sneakyrc - cheeky config file in JSON format
  `{
\t"a": "aaa2",
\t"b": "bbb2",
\t"c": "ccc2"
}`,
  // test1/folder1/file3.json
  `{
\t"a": "aaa3",
\t"b": "bbb3",
\t"c": "ccc3",
\t"d": "ddd3"
}`,
  // test2/file4.json
  `{
\t"a": "aaa4",
\t"b": "bbb4",
\t"c": [
\t\t{
\t\t\t"a": "sdfgdfgd",
\t\t\t"m": "dfgdfgdf",
\t\t\t"z": "adasad"
\t\t}
\t]
}`,
  // file5.json
  `{
\t"package": true
}`
];

const minifiedContents = `{"root":true,"env":{"es6":true,"node":true},"extends":["eslint:recommended","plugin:prettier/recommended"],"parserOptions":{"ecmaVersion":2018,"sourceType":"module"},"plugins":["ava","scanjs-rules","no-unsanitized","import"],"rules":{"ava/assertion-arguments":"error","ava/max-asserts":["off",5],"ava/no-async-fn-without-await":"error","ava/no-cb-test":"off","ava/no-duplicate-modifiers":"error","ava/no-identical-title":"error","ava/no-invalid-end":"error","ava/no-nested-tests":"error","ava/no-only-test":"error","ava/no-skip-assert":"error","ava/no-skip-test":"error","ava/no-statement-after-end":"error","ava/no-todo-implementation":"error","ava/no-todo-test":"warn","ava/no-unknown-modifiers":"error","ava/prefer-async-await":"error","ava/prefer-power-assert":"off","ava/test-ended":"error","ava/test-title":["error","if-multiple"],"ava/use-t":"error","ava/use-t-well":"error","ava/use-test":"error","ava/use-true-false":"error","curly":"error","import/no-extraneous-dependencies":["error",{"devDependencies":["**/*test.js","test/**/*.*","rollup.config.js"]}],"no-constant-condition":["error",{"checkLoops":false}],"no-console":"off","no-else-return":"error","no-inner-declarations":"error","no-unneeded-ternary":"error","no-useless-return":"error","no-var":"error","one-var":["error","never"],"prefer-arrow-callback":"error","prefer-const":"error","prefer-template":"error","strict":"error","scanjs-rules/accidental_assignment":1,"scanjs-rules/assign_to_hostname":1,"scanjs-rules/assign_to_href":1,"scanjs-rules/assign_to_location":1,"scanjs-rules/assign_to_onmessage":1,"scanjs-rules/assign_to_pathname":1,"scanjs-rules/assign_to_protocol":1,"scanjs-rules/assign_to_search":1,"scanjs-rules/assign_to_src":1,"scanjs-rules/call_Function":1,"scanjs-rules/call_addEventListener":1,"scanjs-rules/call_addEventListener_deviceproximity":1,"scanjs-rules/call_addEventListener_message":1,"scanjs-rules/call_connect":1,"scanjs-rules/call_eval":1,"scanjs-rules/call_execScript":1,"scanjs-rules/call_hide":1,"scanjs-rules/call_open_remote=true":1,"scanjs-rules/call_parseFromString":1,"scanjs-rules/call_setImmediate":1,"scanjs-rules/call_setInterval":1,"scanjs-rules/call_setTimeout":1,"scanjs-rules/identifier_indexedDB":1,"scanjs-rules/identifier_localStorage":1,"scanjs-rules/identifier_sessionStorage":1,"scanjs-rules/new_Function":1,"scanjs-rules/property_addIdleObserver":1,"scanjs-rules/property_createContextualFragment":1,"scanjs-rules/property_crypto":1,"scanjs-rules/property_geolocation":1,"scanjs-rules/property_getUserMedia":1,"scanjs-rules/property_indexedDB":1,"scanjs-rules/property_localStorage":1,"scanjs-rules/property_mgmt":1,"scanjs-rules/property_sessionStorage":1,"symbol-description":"error","yoda":["error","never",{"exceptRange":true}]}}`;

const prettifiedContents = `{
  "env": {
    "es6": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "ava",
    "scanjs-rules",
    "no-unsanitized",
    "import"
  ],
  "root": true,
  "rules": {
    "ava/assertion-arguments": "error",
    "ava/max-asserts": [
      "off",
      5
    ],
    "ava/no-async-fn-without-await": "error",
    "ava/no-cb-test": "off",
    "ava/no-duplicate-modifiers": "error",
    "ava/no-identical-title": "error",
    "ava/no-invalid-end": "error",
    "ava/no-nested-tests": "error",
    "ava/no-only-test": "error",
    "ava/no-skip-assert": "error",
    "ava/no-skip-test": "error",
    "ava/no-statement-after-end": "error",
    "ava/no-todo-implementation": "error",
    "ava/no-todo-test": "warn",
    "ava/no-unknown-modifiers": "error",
    "ava/prefer-async-await": "error",
    "ava/prefer-power-assert": "off",
    "ava/test-ended": "error",
    "ava/test-title": [
      "error",
      "if-multiple"
    ],
    "ava/use-t": "error",
    "ava/use-t-well": "error",
    "ava/use-test": "error",
    "ava/use-true-false": "error",
    "curly": "error",
    "import/no-extraneous-dependencies": [
      "error",
      {
        "devDependencies": [
          "**/*test.js",
          "test/**/*.*",
          "rollup.config.js"
        ]
      }
    ],
    "no-console": "off",
    "no-constant-condition": [
      "error",
      {
        "checkLoops": false
      }
    ],
    "no-else-return": "error",
    "no-inner-declarations": "error",
    "no-unneeded-ternary": "error",
    "no-useless-return": "error",
    "no-var": "error",
    "one-var": [
      "error",
      "never"
    ],
    "prefer-arrow-callback": "error",
    "prefer-const": "error",
    "prefer-template": "error",
    "scanjs-rules/accidental_assignment": 1,
    "scanjs-rules/assign_to_hostname": 1,
    "scanjs-rules/assign_to_href": 1,
    "scanjs-rules/assign_to_location": 1,
    "scanjs-rules/assign_to_onmessage": 1,
    "scanjs-rules/assign_to_pathname": 1,
    "scanjs-rules/assign_to_protocol": 1,
    "scanjs-rules/assign_to_search": 1,
    "scanjs-rules/assign_to_src": 1,
    "scanjs-rules/call_Function": 1,
    "scanjs-rules/call_addEventListener": 1,
    "scanjs-rules/call_addEventListener_deviceproximity": 1,
    "scanjs-rules/call_addEventListener_message": 1,
    "scanjs-rules/call_connect": 1,
    "scanjs-rules/call_eval": 1,
    "scanjs-rules/call_execScript": 1,
    "scanjs-rules/call_hide": 1,
    "scanjs-rules/call_open_remote=true": 1,
    "scanjs-rules/call_parseFromString": 1,
    "scanjs-rules/call_setImmediate": 1,
    "scanjs-rules/call_setInterval": 1,
    "scanjs-rules/call_setTimeout": 1,
    "scanjs-rules/identifier_indexedDB": 1,
    "scanjs-rules/identifier_localStorage": 1,
    "scanjs-rules/identifier_sessionStorage": 1,
    "scanjs-rules/new_Function": 1,
    "scanjs-rules/property_addIdleObserver": 1,
    "scanjs-rules/property_createContextualFragment": 1,
    "scanjs-rules/property_crypto": 1,
    "scanjs-rules/property_geolocation": 1,
    "scanjs-rules/property_getUserMedia": 1,
    "scanjs-rules/property_indexedDB": 1,
    "scanjs-rules/property_localStorage": 1,
    "scanjs-rules/property_mgmt": 1,
    "scanjs-rules/property_sessionStorage": 1,
    "strict": "error",
    "symbol-description": "error",
    "yoda": [
      "error",
      "never",
      {
        "exceptRange": true
      }
    ]
  }
}
`;

// Finally, unit tests...
// -----------------------------------------------------------------------------

test("01.01 - default sort, called on the whole folder", async t => {
  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  // const tempFolder = tempy.directory();
  const tempFolder = "temp";

  // The temp folder needs subfolders. Those have to be in place before we start
  // writing the files:
  fs.ensureDirSync(path.join(tempFolder, "test1"));
  fs.ensureDirSync(path.join(tempFolder, "test1/folder1"));
  fs.ensureDirSync(path.join(tempFolder, "test2"));

  // 2. asynchronously write all test files

  const processedFileContents = pMap(
    testFilePaths,
    (oneOfTestFilePaths, testIndex) =>
      fs.writeJson(
        path.join(tempFolder, oneOfTestFilePaths),
        testFileContents[testIndex]
      )
  )
    .then(() =>
      fs.writeFile(
        path.join(tempFolder, "test1/.something.yml"), //  - dotfile in yml with yml extension
        "foo:\n  bar"
      )
    )
    .then(() =>
      fs.writeFile(
        path.join(tempFolder, "test1/.somethinginyml"), // - dotfile in yml without yml extension
        "foo:\n  bar"
      )
    )
    .then(() => execa("./cli.js", [tempFolder]))
    .then(() =>
      pMap(testFilePaths, oneOfPaths =>
        fs.readJson(path.join(tempFolder, oneOfPaths), "utf8")
      ).then(contentsArray => {
        return pMap(contentsArray, oneOfArrays =>
          JSON.stringify(oneOfArrays, null, 2)
        );
      })
    )
    .then(received =>
      execa
        .shell(`rm -rf ${path.join(__dirname, "../temp")}`)
        .then(() => received)
    )
    .catch(err => t.fail(err));

  t.deepEqual(await processedFileContents, sortedTestFileContents);
});

test.serial("01.02 - sort, -t (tabs) mode", async t => {
  // 1. fetch us an empty, random, temporary folder:
  // const tempFolder = tempy.directory();
  const tempFolder = "temp";
  // The temp folder needs subfolders. Those have to be in place before we start
  // writing the files:
  fs.ensureDirSync(path.join(tempFolder, "test1"));
  fs.ensureDirSync(path.join(tempFolder, "test1/folder1"));
  fs.ensureDirSync(path.join(tempFolder, "test2"));

  // asynchronously write all test files

  const processedFileContents = pMap(
    testFilePaths,
    (oneOfTestFilePaths, testIndex) =>
      fs.writeJson(
        path.join(tempFolder, oneOfTestFilePaths),
        testFileContents[testIndex]
      )
  )
    .then(
      () => execa("./cli.js", ["-t", tempFolder]) // all test files have been written successfully, let's process them with our CLI
    )
    .then(() =>
      pMap(testFilePaths, oneOfPaths =>
        fs.readJson(path.join(tempFolder, oneOfPaths), "utf8")
      )
    )
    .then(contentsArray => {
      return pMap(contentsArray, oneOfArrays =>
        JSON.stringify(oneOfArrays, null, "\t")
      );
    })
    .then(received =>
      execa
        .shell(`rm -rf ${path.join(__dirname, "../temp")}`)
        .then(() => received)
    )
    .catch(err => t.fail(err));

  t.deepEqual(await processedFileContents, sortedTabbedTestFileContents);
});

test.serial("01.03 - sort, there's a broken JSON among files", async t => {
  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  // const tempFolder = tempy.directory();
  const tempFolder = "temp";

  // The temp folder needs subfolders. Those have to be in place before we start
  // writing the files:
  fs.ensureDirSync(path.join(tempFolder, "test1"));
  fs.ensureDirSync(path.join(tempFolder, "test1/folder1"));
  fs.ensureDirSync(path.join(tempFolder, "test2"));

  // 2. asynchronously write all test files

  const processedFileContents = pMap(
    testFilePaths,
    (oneOfTestFilePaths, testIndex) =>
      fs.writeJson(
        path.join(tempFolder, oneOfTestFilePaths),
        testFileContents[testIndex]
      )
  )
    .then(() =>
      fs.writeFile(
        path.join(tempFolder, "test1/.something.yml"), // - dotfile in yml with yml extension
        "foo:\n  bar"
      )
    )
    .then(() =>
      fs.writeFile(
        path.join(tempFolder, "test1/.somethinginyml"), // - dotfile in yml without yml extension
        "foo:\n  bar"
      )
    )
    .then(() =>
      fs.writeFile(path.join(tempFolder, "test1/broken.json"), '{a": "b"}\n')
    )
    .then(() => execa("./cli.js", [tempFolder]))
    .then(receivedStdOut => {
      t.regex(receivedStdOut.stdout, /broken\.json/);
      return pMap(testFilePaths, oneOfPaths =>
        fs.readJson(path.join(tempFolder, oneOfPaths), "utf8")
      ).then(contentsArray => {
        return pMap(contentsArray, oneOfArrays =>
          JSON.stringify(oneOfArrays, null, 2)
        );
      });
    })
    .then(received =>
      execa
        .shell(`rm -rf ${path.join(__dirname, "../temp")}`)
        .then(() => received)
    )
    .catch(err => t.fail(err));

  t.deepEqual(await processedFileContents, sortedTestFileContents);
});

test.serial("01.04 - silent mode", async t => {
  // 1. fetch us an empty, random, temporary folder:

  // Re-route the test files into `temp/` folder instead for easier access when
  // troubleshooting. Just comment out one of two:
  // const tempFolder = tempy.directory();
  const tempFolder = "temp";

  // The temp folder needs subfolders. Those have to be in place before we start
  // writing the files:
  fs.ensureDirSync(path.join(tempFolder, "test1"));
  fs.ensureDirSync(path.join(tempFolder, "test1/folder1"));
  fs.ensureDirSync(path.join(tempFolder, "test2"));

  // 2. asynchronously write all test files

  const processedFileContents = pMap(
    testFilePaths,
    (oneOfTestFilePaths, testIndex) =>
      fs.writeJson(
        path.join(tempFolder, oneOfTestFilePaths),
        testFileContents[testIndex]
      )
  )
    .then(() =>
      fs.writeFile(
        path.join(tempFolder, "test1/.something.yml"), // - dotfile in yml with yml extension
        "foo:\n  bar"
      )
    )
    .then(() =>
      fs.writeFile(
        path.join(tempFolder, "test1/.somethinginyml"), // - dotfile in yml without yml extension
        "foo:\n  bar"
      )
    )
    .then(() =>
      fs.writeFile(path.join(tempFolder, "test1/broken.json"), '{a": "b"}\n')
    )
    .then(() => execa("./cli.js", [tempFolder, "-s"]))
    .then(receivedStdOut => {
      t.regex(receivedStdOut.stdout, /5 files sorted/);
      t.notRegex(receivedStdOut.stdout, /OK/);
      return pMap(testFilePaths, oneOfPaths =>
        fs.readJson(path.join(tempFolder, oneOfPaths), "utf8")
      ).then(contentsArray => {
        return pMap(contentsArray, oneOfArrays =>
          JSON.stringify(oneOfArrays, null, 2)
        );
      });
    })
    .then(received =>
      execa
        .shell(`rm -rf ${path.join(__dirname, "../temp")}`)
        .then(() => received)
    )
    .catch(err => t.fail(err));

  t.deepEqual(await processedFileContents, sortedTestFileContents);
});

test.serial("01.05 - fixes minified dotfiles in JSON format", async t => {
  const tempFolder = "temp";
  fs.ensureDirSync(path.resolve(tempFolder));
  const pathOfTheTestfile = path.join(tempFolder, ".eslintrc.json");

  const processedFileContents = fs
    .writeFile(pathOfTheTestfile, minifiedContents)
    .then(() => execa("./cli.js", [tempFolder, ".eslintrc.json"]))
    .then(() => fs.readFile(pathOfTheTestfile, "utf8"))
    .then(received =>
      execa
        .shell(`rm -rf ${path.join(__dirname, "../temp")}`)
        .then(() => received)
    )
    .catch(err => t.fail(err));

  t.deepEqual(await processedFileContents, prettifiedContents);
});

test.serial("01.06 - version output mode", async t => {
  const reportedVersion1 = await execa("./cli.js", ["-v"]);
  t.is(reportedVersion1.stdout, pack.version);

  const reportedVersion2 = await execa("./cli.js", ["--version"]);
  t.is(reportedVersion2.stdout, pack.version);
});

test.serial("01.07 - help output mode", async t => {
  const reportedVersion1 = await execa("./cli.js", ["-h"]);
  t.regex(reportedVersion1.stdout, /Usage/);
  t.regex(reportedVersion1.stdout, /Options/);
  t.regex(reportedVersion1.stdout, /Example/);

  const reportedVersion2 = await execa("./cli.js", ["--help"]);
  t.regex(reportedVersion2.stdout, /Usage/);
  t.regex(reportedVersion2.stdout, /Options/);
  t.regex(reportedVersion2.stdout, /Example/);
});

test.serial("01.08 - no files found in the given directory", async t => {
  // fetch us a random temp folder
  // const tempFolder = tempy.directory();
  const tempFolder = "temp";

  // call execa on that empty folder
  const stdOutContents = await execa("./cli.js", [tempFolder]);
  // CLI will complain no files could be found
  t.regex(
    stdOutContents.stdout,
    /The inputs don't lead to any json files! Exiting./
  );
});
