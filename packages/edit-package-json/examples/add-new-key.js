// Add a key that is not there yet, at the indentation the file already uses

import { strict as assert } from "node:assert";

import { set } from "../dist/edit-package-json.esm.js";

const pkg = `{
  "name": "demo",
  "scripts": {
    "build": "tsc"
  }
}`;

// a new key in a nested object goes in after the last one, separated the same
// way the members already there are
assert.equal(
  set(pkg, "scripts.test", "uvu"),
  `{
  "name": "demo",
  "scripts": {
    "build": "tsc",
    "test": "uvu"
  }
}`,
);

// a path whose middle is missing gets it built, indented to match
assert.equal(
  set(pkg, "dependencies.uvu", "^0.5.0"),
  `{
  "name": "demo",
  "scripts": {
    "build": "tsc"
  },
  "dependencies": {
    "uvu": "^0.5.0"
  }
}`,
);

// an all-digits segment asks for an array rather than an object
assert.equal(
  set(pkg, "files.0", "dist"),
  `{
  "name": "demo",
  "scripts": {
    "build": "tsc"
  },
  "files": [
    "dist"
  ]
}`,
);

// minified input stays minified - the formatting is read off the input, never
// imposed on it
assert.equal(set('{"a":"b"}', "c.d", "e"), '{"a":"b","c":{"d":"e"}}');
