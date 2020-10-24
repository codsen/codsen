import tap from "tap";
import { setter } from "./util/util";
// import { set, del } from "../dist/edit-package-json.esm";

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

tap.test(
  `01 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set the value using unicode key - value is number`,
  (t) => {
    const source = `{
  "15\u00f8C": {
    "3\u0111": 1
  }
}`;
    const result = `{
  "15\u00f8C": {
    "3\u0111": 2
  }
}`;
    setter(t, source, result, "15\u00f8C.3\u0111", 2, "04.01");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set the value using unicode key - value is string`,
  (t) => {
    const source = `{
  "15\u00f8C": {
    "3\u0111": "1"
  }
}`;
    const result = `{
  "15\u00f8C": {
    "3\u0111": "2"
  }
}`;
    setter(t, source, result, "15\u00f8C.3\u0111", "2", "04.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set the value using dot in key`,
  (t) => {
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
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under shallow object`,
  (t) => {
    const input = `{
  "b": {
    "d": ["a"]
  },
  "j": {"k": "l"}
}`;
    const result = `{
  "b": {
    "d": ["a"]
  },
  "j": {"k":"x"}
}`;
    setter(t, input, result, "j", { k: "x" }, "04.04");
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under shallow object`,
  (t) => {
    const input = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  },
  "j": {"k": "l"}
}`;
    const result = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  },
  "j": {"k":"x"}
}`;
    setter(t, input, result, "j", { k: "x" }, "04.05");
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under shallow object`,
  (t) => {
    const input = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  },
  "j": {"k": "l"}
}`;
    const result = `{
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
    setter(t, input, result, ["j"], { k: "x" }, "04.06");
    t.end();
  }
);

// TODO
tap.test(
  `07 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value using number path`,
  (t) => {
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
    "d": ["x", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
    // path is array:
    setter(t, source, result, "b.d.0", `x`, "04.07");
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value using number path`,
  (t) => {
    const result = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["x", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
    setter(t, testObj, result, "b.d.0", `x`, "04.08");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value using number path`,
  (t) => {
    // crop of test "should set value using number path", obj.b.d
    setter(t, `["a", "b"]`, `["x", "b"]`, 0, `x`, "04.09");
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under deep object`,
  (t) => {
    const result = `{
  "a": "b",
  "b": {
    "c": "o",
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
    setter(t, testObj, result, "b.c", `o`, "04.10");
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under deep object`,
  (t) => {
    const result = `{
  "a": "b",
  "b": {
    "c": "o",
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
    // quotes around "o" missing:
    setter(t, testObj, result, "b.c", `o`, "04.11");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under deep object`,
  (t) => {
    const result = `{
  "a": "b",
  "b": {
    "c": "o",
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
    setter(t, testObj, result, ["b", "c"], `o`, "04.12");
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under deep object`,
  (t) => {
    const result = `{
  "a": "b",
  "b": {
    "c": "o",
    "d": ["a", "b"],
    "e": [{}, { "f": "g" }],
    "f": "i"
  }
}`;
    // quotes around "o" missing:
    setter(t, testObj, result, ["b", "c"], `o`, "04.13");
    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under array`,
  (t) => {
    const result = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": null }],
    "f": "i"
  }
}`;
    // TODO: creates new keys
    // setter(t, testObj, result, "b.e.1.g", "f", "04.14");

    setter(t, testObj, result, "b.e.1.f", null, "04.14");
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under array`,
  (t) => {
    const result = `{
  "a": "b",
  "b": {
    "c": [],
    "d": ["a", "b"],
    "e": [{}, { "f": null }],
    "f": "i"
  }
}`;
    // TODO: creates new keys
    // setter(t, testObj, result, "b.e.1.g", "f", "04.15");

    setter(t, testObj, result, ["b", "e", 1, "f"], null, "04.15");
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - minimal case, arrays 1`,
  (t) => {
    const source = `{
  "a": [{}, { "b": "c" }]
}`;
    const result = `{
  "a": [{}, { "b": null }]
}`;
    setter(t, source, result, "a.1.b", null, "04.16");
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - minimal case, arrays 2`,
  (t) => {
    const source = `{
  "a": [{ "b": "c" }]
}`;
    const result = `{
  "a": [{ "b": null }]
}`;
    setter(t, source, result, "a.0.b", null, "04.17");
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - square bracket as value`,
  (t) => {
    const source = `{
  "a": "[",
  "k": {
    "lm": "1",
    "no": "2"
  }
}`;
    const result = `{
  "a": "[",
  "k": {
    "lm": "1",
    "no": "9"
  }
}`;
    setter(t, source, result, "k.no", "9", "04.18");
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - curly bracket as value`,
  (t) => {
    const source = `{
  "a": "{",
  "k": {
    "lm": "1",
    "no": "2"
  }
}`;
    const result = `{
  "a": "{",
  "k": {
    "lm": "1",
    "no": "9"
  }
}`;
    setter(t, source, result, "k.no", "9", "04.19");
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - curly bracket as value`,
  (t) => {
    const source = `{"a": {},"gh": {"mn": "1","yz": "-"}}`;
    const result = `{"a": {},"gh": {"mn": "1","yz": "x"}}`;
    setter(t, source, result, "gh.yz", "x", "04.20");
    t.end();
  }
);
