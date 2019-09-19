import test from "ava";
import { set } from "../dist/edit-package-json.esm";
import objectPath from "object-path";
import isCI from "is-ci";
// import clone from "lodash.clonedeep";

const fullRun = isCI || false;

function setter(t, source, result, path, val, idNum) {
  t.is(
    set(source, path, val),
    result,
    `${idNum}.01 - string is identical after set`
  );
  if (fullRun) {
    // remaining comparisons are ran only if it's not a funnRun mode (and not CI)
    //
    // 02. parsed versions we just compared must be deep-equal
    t.deepEqual(
      JSON.parse(set(source, "c", "e")),
      JSON.parse(result),
      `${idNum}.02 - parsed 01 is deep-equal`
    );
    //
    // 03. if we did the deed manually, it would be the same if both were parsed
    const temp = JSON.parse(source);
    objectPath.set(temp, path, val);
    t.deepEqual(
      temp,
      JSON.parse(result),
      `${idNum}.03 - objectPath set is deep-equal`
    );
  }
}

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${31}m${`api`}\u001b[${39}m`} - wrong/missing 1st arg = throw`, t => {
  t.throws(() => {
    set();
  });
  t.throws(() => {
    set("");
  });
  t.throws(() => {
    set(null);
  });
  t.throws(() => {
    set(undefined);
  });
  t.throws(() => {
    set(true);
  });
});

// -----------------------------------------------------------------------------
// 02. set - editing an existing key
// -----------------------------------------------------------------------------

test(`02.01 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - key in the root`, t => {
  const source = `{
  "a": "b",
  "c": "d"
}`;
  const result = `{
  "a": "b",
  "c": "e"
}`;
  setter(t, source, result, "c", "e", "02.01");
});

test(`02.02 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - key in the root`, t => {
  const source = `{
  "a": "b",
  "c": "d"
}`;
  const result = `{
  "a": "b",
  "c": "1"
}`;
  setter(t, source, result, "c", "1", "02.02");
});

test(`02.03 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - key in the root`, t => {
  const source = `{
  "a": "b",
  "c": "d"
}`;
  const result = `{
  "a": "b",
  "c": 1
}`;
  setter(t, source, result, "c", 1, "02.03");
});

test(`02.04 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - key in the root`, t => {
  const source = `{
  "a": "b",
  "c": "d"
}`;
  const result = `{
  "a": "b",
  "c": false
}`;
  setter(t, source, result, "c", false, "02.04");
});

test(`02.05 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - second level key`, t => {
  const source = `{
  "a": "b",
  "c": {
    "d": "e"
  }
}`;
  const result = `{
  "a": "b",
  "c": {
    "d": "f"
  }
}`;
  setter(t, source, result, "c.d", "f", "02.05");
});

test(`02.06 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - second level key`, t => {
  // notice deliberate mis-indentation after "d": "e"
  const source = `{
  "a": "b",
  "c": {
    "d": "e"
},
  "f": {
    "g": "h"
  }
}`;
  // notice deliberate mis-indentation after "d": "e"
  const result = `{
  "a": "b",
  "c": {
    "d": "e"
},
  "f": {
    "g": "i"
  }
}`;
  setter(t, source, result, "f.g", "i", "02.06");
});

test(`02.07 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - value is number`, t => {
  const source = `{
  "a": "b",
  "c": 1
}`;
  const result = `{
  "a": "b",
  "c": 0
}`;
  setter(t, source, result, "c", 0, "02.07");
});

test(`02.08 - ${`\u001b[${33}m${`set`}\u001b[${39}m`} - ${`\u001b[${32}m${`existing path`}\u001b[${39}m`} - null overwritten with null`, t => {
  const source = `{
  "a": "b",
  "c": null
}`;
  const result = `{
  "a": "b",
  "c": null
}`;
  setter(t, source, result, "c", null, "02.08");
});

// -----------------------------------------------------------------------------
// 03. set - key does not exist
// -----------------------------------------------------------------------------

test(`03.01 - ${`\u001b[${32}m${`set`}\u001b[${39}m`} - ${`\u001b[${34}m${`non-existing path`}\u001b[${39}m`} - minimal example`, t => {
  const source = `{
  "a": "b",
  "x": "y"
}`;
  const result = `{
  "a": "b",
  "x": "y",
  "c": "e"
}`;
  setter(t, source, result, "c", "e", "03.01");
});

// -----------------------------------------------------------------------------
// 04. adapted set() tests from object-path
// https://github.com/mariocasciaro/object-path
// MIT Licence, Copyright (c) 2015 Mario Casciaro
// -----------------------------------------------------------------------------

const testObj = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;

test(`04.01 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set the value using unicode key - value is number`, t => {
  const source = `{
  "15\u00f8C": {
    "3\u0111": 1
}`;
  const result = `{
  "15\u00f8C": {
    "3\u0111": 2
}`;
  setter(t, source, result, "15\u00f8C.3\u0111", 2, "04.01");
});

test(`04.02 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set the value using unicode key - value is string`, t => {
  const source = `{
  "15\u00f8C": {
    "3\u0111": "1"
}`;
  const result = `{
  "15\u00f8C": {
    "3\u0111": "2"
}`;
  setter(t, source, result, "15\u00f8C.3\u0111", "2", "04.02");
});

test(`04.03 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set the value using dot in key`, t => {
  const source = `{
  "a.b": {
    "looks.like": 1
  }
}`;
  const result = `{
  "a.b": {
    "looks.like": 2
  }
}`;
  setter(t, source, result, ["a.b", "looks.like"], 2, "04.03");
});

test(`04.04 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under shallow object`, t => {
  const result = `{
  "a": "b",
  "b": {
    "c": {"m": "o"},
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
  setter(t, testObj, result, "c", `{"m": "o"}`, "04.04");
});

test(`04.05 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under shallow object`, t => {
  const result = `{
  "a": "b",
  "b": {
    "c": {"m": "o"},
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
  // path is array:
  setter(t, testObj, result, ["c"], `{"m": "o"}`, "04.05");
});

test(`04.06 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value using number path`, t => {
  const source = `{
  "a": "b",
  "b": {
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
  const result = `{
  "a": "b",
  "b": {
    "d": ["o", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
  // path is array:
  setter(t, source, result, "b.d.0", `"o"`, "04.06");
});

test(`04.07 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value using number path`, t => {
  const result = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["o", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
  // path is array:
  setter(t, testObj, result, "b.d.0", `"o"`, "04.07");
});

test(`04.08 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value using number path`, t => {
  // crop of test "should set value using number path", obj.b.d
  setter(t, `["a", "b"]`, `["o", "b"]`, 0, `"o"`, "04.08");
});
