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
// └── package.json

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
  },
  {
    // package.json
    author: {
      email: "roy@codsen.com",
      name: "Roy Revelt",
      url: "codsen.com",
    },
    devDependencies: {
      n: "0.0.3",
      m: "0.0.2",
    },
    dependencies: {
      z: "0.0.2",
      a: "0.0.1",
    },
    license: "MIT",
    name: "tralala",
    version: "99.88.77",
  },
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
}`,
  // package.json
  `{
  "name": "tralala",
  "version": "99.88.77",
  "license": "MIT",
  "author": {
    "email": "roy@codsen.com",
    "name": "Roy Revelt",
    "url": "codsen.com"
  },
  "dependencies": {
    "a": "0.0.1",
    "z": "0.0.2"
  },
  "devDependencies": {
    "m": "0.0.2",
    "n": "0.0.3"
  }
}`,
];

export const testFilePaths = [
  "test1/file1.json",
  "test1/.sneakyrc",
  "test1/folder1/file3.json",
  "test2/file4.json",
  "file5.json",
  "package.json",
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
