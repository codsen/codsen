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
// ├── file5.json

// File contents:
// -----------------------------------------------------------------------------

export const testFileContents = [
  {
    // test1/file1.json
    b: "bbb1", // <------------ NOTICE THE ORDER OF THE KEYS IS NOT SORTED
    a: "aaa1",
    c: "ccc1",
  },
  {
    // test1/.sneakyrc
    c: "ccc2",
    b: "bbb2",
    a: "aaa2",
  },
  {
    // test1/folder1/file3.json
    d: "ddd3",
    c: "ccc3",
    b: "bbb3",
    a: "aaa3",
  },
  {
    // test2/file4.json
    a: "aaa4",
    c: [
      {
        z: "adasad",
        a: "sdfgdfgd",
        m: "dfgdfgdf",
      },
    ],
    b: "bbb4",
  },
  {
    // file5.json
    package: true,
  }
];

export const sortedTestFileContents = [
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

export const testFilePaths = [
  "test1/file1.json",
  "test1/.sneakyrc",
  "test1/folder1/file3.json",
  "test2/file4.json",
  "file5.json",
];

export const sortedTabbedTestFileContents = [
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
}`,
  `{
\t"name": "tralala",
\t"version": "99.88.77",
\t"license": "MIT",
\t"author": {
\t\t"email": "roy@codsen.com",
\t\t"name": "Roy Revelt",
\t\t"url": "codsen.com"
\t},
\t"dependencies": {
\t\t"a": "0.0.1",
\t\t"z": "0.0.2"
\t},
\t"devDependencies": {
\t\t"m": "0.0.2",
\t\t"n": "0.0.3"
\t}
}`,
];

export const minifiedContents =
  '{"root":true,"env":{"es6":true,"node":true},"extends":["eslint:recommended","plugin:prettier/recommended"],"parserOptions":{"ecmaVersion":2018,"sourceType":"module"},"plugins":["ava","scanjs-rules","no-unsanitized","import"],"rules":{"ava/assertion-arguments":"error","ava/max-asserts":["off",5],"ava/no-async-fn-without-await":"error","ava/no-cb-test":"off","ava/no-duplicate-modifiers":"error","ava/no-identical-title":"error","ava/no-invalid-end":"error","ava/no-nested-tests":"error","ava/no-only-test":"error","ava/no-skip-assert":"error","ava/no-skip-test":"error","ava/no-statement-after-end":"error","ava/no-todo-implementation":"error","ava/no-todo-test":"warn","ava/no-unknown-modifiers":"error","ava/prefer-async-await":"error","ava/prefer-power-assert":"off","ava/test-ended":"error","ava/test-title":["error","if-multiple"],"ava/use-t":"error","ava/use-t-well":"error","ava/use-test":"error","ava/use-true-false":"error","curly":"error","import/no-extraneous-dependencies":["error",{"devDependencies":["**/*test.js","test/**/*.*","rollup.config.js"]}],"no-constant-condition":["error",{"checkLoops":false}],"no-console":"off","no-else-return":"error","no-inner-declarations":"error","no-unneeded-ternary":"error","no-useless-return":"error","no-var":"error","one-var":["error","never"],"prefer-arrow-callback":"error","prefer-const":"error","prefer-template":"error","strict":"error","scanjs-rules/accidental_assignment":1,"scanjs-rules/assign_to_hostname":1,"scanjs-rules/assign_to_href":1,"scanjs-rules/assign_to_location":1,"scanjs-rules/assign_to_onmessage":1,"scanjs-rules/assign_to_pathname":1,"scanjs-rules/assign_to_protocol":1,"scanjs-rules/assign_to_search":1,"scanjs-rules/assign_to_src":1,"scanjs-rules/call_Function":1,"scanjs-rules/call_addEventListener":1,"scanjs-rules/call_addEventListener_deviceproximity":1,"scanjs-rules/call_addEventListener_message":1,"scanjs-rules/call_connect":1,"scanjs-rules/call_eval":1,"scanjs-rules/call_execScript":1,"scanjs-rules/call_hide":1,"scanjs-rules/call_open_remote=true":1,"scanjs-rules/call_parseFromString":1,"scanjs-rules/call_setImmediate":1,"scanjs-rules/call_setInterval":1,"scanjs-rules/call_setTimeout":1,"scanjs-rules/identifier_indexedDB":1,"scanjs-rules/identifier_localStorage":1,"scanjs-rules/identifier_sessionStorage":1,"scanjs-rules/new_Function":1,"scanjs-rules/property_addIdleObserver":1,"scanjs-rules/property_createContextualFragment":1,"scanjs-rules/property_crypto":1,"scanjs-rules/property_geolocation":1,"scanjs-rules/property_getUserMedia":1,"scanjs-rules/property_indexedDB":1,"scanjs-rules/property_localStorage":1,"scanjs-rules/property_mgmt":1,"scanjs-rules/property_sessionStorage":1,"symbol-description":"error","yoda":["error","never",{"exceptRange":true}]}}';

export const prettifiedContents = `{
\t"env": {
\t\t"es6": true,
\t\t"node": true
\t},
\t"extends": [
\t\t"eslint:recommended",
\t\t"plugin:prettier/recommended"
\t],
\t"parserOptions": {
\t\t"ecmaVersion": 2018,
\t\t"sourceType": "module"
\t},
\t"plugins": [
\t\t"ava",
\t\t"scanjs-rules",
\t\t"no-unsanitized",
\t\t"import"
\t],
\t"root": true,
\t"rules": {
\t\t"ava/assertion-arguments": "error",
\t\t"ava/max-asserts": [
\t\t\t"off",
\t\t\t5
\t\t],
\t\t"ava/no-async-fn-without-await": "error",
\t\t"ava/no-cb-test": "off",
\t\t"ava/no-duplicate-modifiers": "error",
\t\t"ava/no-identical-title": "error",
\t\t"ava/no-invalid-end": "error",
\t\t"ava/no-nested-tests": "error",
\t\t"ava/no-only-test": "error",
\t\t"ava/no-skip-assert": "error",
\t\t"ava/no-skip-test": "error",
\t\t"ava/no-statement-after-end": "error",
\t\t"ava/no-todo-implementation": "error",
\t\t"ava/no-todo-test": "warn",
\t\t"ava/no-unknown-modifiers": "error",
\t\t"ava/prefer-async-await": "error",
\t\t"ava/prefer-power-assert": "off",
\t\t"ava/test-ended": "error",
\t\t"ava/test-title": [
\t\t\t"error",
\t\t\t"if-multiple"
\t\t],
\t\t"ava/use-t": "error",
\t\t"ava/use-t-well": "error",
\t\t"ava/use-test": "error",
\t\t"ava/use-true-false": "error",
\t\t"curly": "error",
\t\t"import/no-extraneous-dependencies": [
\t\t\t"error",
\t\t\t{
\t\t\t\t"devDependencies": [
\t\t\t\t\t"**/*test.js",
\t\t\t\t\t"test/**/*.*",
\t\t\t\t\t"rollup.config.js"
\t\t\t\t]
\t\t\t}
\t\t],
\t\t"no-console": "off",
\t\t"no-constant-condition": [
\t\t\t"error",
\t\t\t{
\t\t\t\t"checkLoops": false
\t\t\t}
\t\t],
\t\t"no-else-return": "error",
\t\t"no-inner-declarations": "error",
\t\t"no-unneeded-ternary": "error",
\t\t"no-useless-return": "error",
\t\t"no-var": "error",
\t\t"one-var": [
\t\t\t"error",
\t\t\t"never"
\t\t],
\t\t"prefer-arrow-callback": "error",
\t\t"prefer-const": "error",
\t\t"prefer-template": "error",
\t\t"scanjs-rules/accidental_assignment": 1,
\t\t"scanjs-rules/assign_to_hostname": 1,
\t\t"scanjs-rules/assign_to_href": 1,
\t\t"scanjs-rules/assign_to_location": 1,
\t\t"scanjs-rules/assign_to_onmessage": 1,
\t\t"scanjs-rules/assign_to_pathname": 1,
\t\t"scanjs-rules/assign_to_protocol": 1,
\t\t"scanjs-rules/assign_to_search": 1,
\t\t"scanjs-rules/assign_to_src": 1,
\t\t"scanjs-rules/call_Function": 1,
\t\t"scanjs-rules/call_addEventListener": 1,
\t\t"scanjs-rules/call_addEventListener_deviceproximity": 1,
\t\t"scanjs-rules/call_addEventListener_message": 1,
\t\t"scanjs-rules/call_connect": 1,
\t\t"scanjs-rules/call_eval": 1,
\t\t"scanjs-rules/call_execScript": 1,
\t\t"scanjs-rules/call_hide": 1,
\t\t"scanjs-rules/call_open_remote=true": 1,
\t\t"scanjs-rules/call_parseFromString": 1,
\t\t"scanjs-rules/call_setImmediate": 1,
\t\t"scanjs-rules/call_setInterval": 1,
\t\t"scanjs-rules/call_setTimeout": 1,
\t\t"scanjs-rules/identifier_indexedDB": 1,
\t\t"scanjs-rules/identifier_localStorage": 1,
\t\t"scanjs-rules/identifier_sessionStorage": 1,
\t\t"scanjs-rules/new_Function": 1,
\t\t"scanjs-rules/property_addIdleObserver": 1,
\t\t"scanjs-rules/property_createContextualFragment": 1,
\t\t"scanjs-rules/property_crypto": 1,
\t\t"scanjs-rules/property_geolocation": 1,
\t\t"scanjs-rules/property_getUserMedia": 1,
\t\t"scanjs-rules/property_indexedDB": 1,
\t\t"scanjs-rules/property_localStorage": 1,
\t\t"scanjs-rules/property_mgmt": 1,
\t\t"scanjs-rules/property_sessionStorage": 1,
\t\t"strict": "error",
\t\t"symbol-description": "error",
\t\t"yoda": [
\t\t\t"error",
\t\t\t"never",
\t\t\t{
\t\t\t\t"exceptRange": true
\t\t\t}
\t\t]
\t}
}
`;
