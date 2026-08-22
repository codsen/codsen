// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { setter } from "./util/util.js";

// import { set, del } from "../dist/edit-package-json.esm.js";

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

test(`01 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should set the value using unicode key - value is number`, () => {
  let source = `{
  "15\u00f8C": {
    "3\u0111": 1
  }
}`;
  let result = `{
  "15\u00f8C": {
    "3\u0111": 2
  }
}`;
  setter(equal, source, result, "15\u00f8C.3\u0111", 2, "04.01");
});

test(`02 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should set the value using unicode key - value is string`, () => {
  let source = `{
  "15\u00f8C": {
    "3\u0111": "1"
  }
}`;
  let result = `{
  "15\u00f8C": {
    "3\u0111": "2"
  }
}`;
  setter(equal, source, result, "15\u00f8C.3\u0111", "2", "04.02");
});

test(`03 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should set the value using dot in key`, () => {
  let source = `{
  "a.b": {
    "looks.like": 1
  }
}`;
  let result = `{
  "a.b": {
    "looks.like": 2
  }
}`;
  setter(equal, source, result, ["a.b", "looks.like"], 2, "04.03");
});

test(`04 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should set value under shallow object`, () => {
  let input = `{
  "b": {
    "d": ["a"]
  },
  "j": {"k": "l"}
}`;
  let result = `{
  "b": {
    "d": ["a"]
  },
  "j": {"k":"x"}
}`;
  setter(equal, input, result, "j", { k: "x" }, "04.04");
});

test(`05 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should set value under shallow object`, () => {
  let input = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  },
  "j": {"k": "l"}
}`;
  let result = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  },
  "j": {"k":"x"}
}`;
  setter(equal, input, result, "j", { k: "x" }, "04.05");
});

test(`06 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should set value under shallow object`, () => {
  let input = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  },
  "j": {"k": "l"}
}`;
  let result = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  },
  "j": {"k":"x"}
}`;
  // path is array:
  setter(equal, input, result, ["j"], { k: "x" }, "04.06");
});

test(`07 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should set value using number path`, () => {
  let source = `{
  "a": "b",
  "b": {
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
  let result = `{
  "a": "b",
  "b": {
    "d": ["x", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
  // path is array:
  setter(equal, source, result, "b.d.0", "x", "04.07");
});

test(`08 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should set value using number path`, () => {
  let result = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["x", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
  setter(equal, testObj, result, "b.d.0", "x", "04.08");
});

test(`09 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should set value using number path`, () => {
  // crop of test "should set value using number path", obj.b.d
  setter(equal, '["a", "b"]', '["x", "b"]', 0, "x", "04.09");
});

test(`10 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should set value under deep object`, () => {
  let result = `{
  "a": "b",
  "b": {
    "c": "o",
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
  setter(equal, testObj, result, "b.c", "o", "04.10");
});

test(`11 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should set value under deep object`, () => {
  let result = `{
  "a": "b",
  "b": {
    "c": "o",
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
  // quotes around "o" missing:
  setter(equal, testObj, result, "b.c", "o", "04.11");
});

test(`12 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should set value under deep object`, () => {
  let result = `{
  "a": "b",
  "b": {
    "c": "o",
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
  setter(equal, testObj, result, ["b", "c"], "o", "04.12");
});

test(`13 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should set value under deep object`, () => {
  let result = `{
  "a": "b",
  "b": {
    "c": "o",
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
  // quotes around "o" missing:
  setter(equal, testObj, result, ["b", "c"], "o", "04.13");
});

test(`14 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should set value under array`, () => {
  let result = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": null }],
    "f": "i"
  }
}`;
  setter(equal, testObj, result, "b.e.1.f", null, "04.14");
});

test(`15 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should add a key to an object inside an array`, () => {
  let result = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": "g", "g": "f" }],
    "f": "i"
  }
}`;
  setter(equal, testObj, result, "b.e.1.g", "f", "04.15");
});

test(`16 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should set value under array`, () => {
  let result = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": null }],
    "f": "i"
  }
}`;
  setter(equal, testObj, result, ["b", "e", 1, "f"], null, "04.16");
});

test(`17 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - should add a key to an object inside an array - path as array`, () => {
  let result = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": "g", "g": "f" }],
    "f": "i"
  }
}`;
  setter(equal, testObj, result, ["b", "e", 1, "g"], "f", "04.17");
});

test(`18 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - minimal case, arrays 1`, () => {
  let source = `{
  "a": [{}, { "b": "c" }]
}`;
  let result = `{
  "a": [{}, { "b": null }]
}`;
  setter(equal, source, result, "a.1.b", null, "04.18");
});

test(`19 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - minimal case, arrays 2`, () => {
  let source = `{
  "a": [{ "b": "c" }]
}`;
  let result = `{
  "a": [{ "b": null }]
}`;
  setter(equal, source, result, "a.0.b", null, "04.19");
});

test(`20 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - square bracket as value`, () => {
  let source = `{
  "a": "[",
  "k": {
    "lm": "1",
    "no": "2"
  }
}`;
  let result = `{
  "a": "[",
  "k": {
    "lm": "1",
    "no": "9"
  }
}`;
  setter(equal, source, result, "k.no", "9", "04.20");
});

test(`21 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - curly bracket as value`, () => {
  let source = `{
  "a": "{",
  "k": {
    "lm": "1",
    "no": "2"
  }
}`;
  let result = `{
  "a": "{",
  "k": {
    "lm": "1",
    "no": "9"
  }
}`;
  setter(equal, source, result, "k.no", "9", "04.21");
});

test(`22 - set - ${`\u001b[${35}m${"object-path/set()"}\u001b[${39}m`} - curly bracket as value`, () => {
  let source = '{"a": {},"gh": {"mn": "1","yz": "-"}}';
  let result = '{"a": {},"gh": {"mn": "1","yz": "x"}}';
  setter(equal, source, result, "gh.yz", "x", "04.22");
});

test.run();
