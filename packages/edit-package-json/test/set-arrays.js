import tap from "tap";
import { setter } from "./util/util";
// import { set, del } from "../dist/edit-package-json.esm";

// -----------------------------------------------------------------------------
// 06. set - on arrays, existing path
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${34}m${`set`}\u001b[${39}m`} - ${`\u001b[${36}m${`existing path`}\u001b[${39}m`} - nested arrays 1`,
  (t) => {
    const input = `[[]]`;
    const result = `[true]`;
    setter(t, input, result, "0", true, "06.01");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${34}m${`set`}\u001b[${39}m`} - ${`\u001b[${36}m${`existing path`}\u001b[${39}m`} - nested arrays 1`,
  (t) => {
    const input = `[{}]`;
    const result = `[true]`;
    setter(t, input, result, "0", true, "06.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${34}m${`set`}\u001b[${39}m`} - ${`\u001b[${36}m${`existing path`}\u001b[${39}m`} - nested arrays 1`,
  (t) => {
    const input = `[false]`;
    const result = `[true]`;
    setter(t, input, result, "0", true, "06.03");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${34}m${`set`}\u001b[${39}m`} - ${`\u001b[${36}m${`existing path`}\u001b[${39}m`} - nested arrays 1`,
  (t) => {
    const input = `["z"]`;
    const result = `[true]`;
    setter(t, input, result, "0", true, "06.04");
    t.end();
  }
);

// // TODO - new path
//
// tap.test(`06.05 - ${`\u001b[${34}m${`set`}\u001b[${39}m`} - ${`\u001b[${36}m${`new path`}\u001b[${39}m`} - nested arrays 2`, t => {
//   const input = `[[]]`;
//   const result = `[[true]]`;
//   setter(t, input, result, "0.0", true, "06.05");
//   t.end();
// });
//
// // TODO - new path
//
// tap.test(`06.06 - ${`\u001b[${34}m${`set`}\u001b[${39}m`} - ${`\u001b[${36}m${`new path`}\u001b[${39}m`} - nested arrays 2`, t => {
//   const input = `[{}]`;
//   const result = `[[true]]`;
//   setter(t, input, result, "0.0", true, "06.06");
//   t.end();
// });
//
// // TODO - new path
//
// tap.test(`06.07 - ${`\u001b[${34}m${`set`}\u001b[${39}m`} - ${`\u001b[${36}m${`new path`}\u001b[${39}m`} - nested arrays 2`, t => {
//   const input = `[false]`;
//   const result = `[[true]]`;
//   setter(t, input, result, "0.0", true, "06.07");
//   t.end();
// });
//
// // TODO - new path
//
// tap.test(`06.08 - ${`\u001b[${34}m${`set`}\u001b[${39}m`} - ${`\u001b[${36}m${`new path`}\u001b[${39}m`} - nested arrays 2`, t => {
//   const input = `["z"]`;
//   const result = `[[true]]`;
//   setter(t, input, result, "0.0", true, "06.08");
//   t.end();
// });

// TODO - minified json

// -----------------------------------------------------------------------------
// Create keys
// -----------------------------------------------------------------------------

// TODO:
//
// tap.test(`99.01 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under array`, t => {
//   const obj = "{}";
//   let res = set(obj, "b.0", "c");
//   res = set(res, "b.1", "d");
//   t.equal(res, `{"b": ["c", "d"]}`);
//   t.end();
// });

// TODO:
//
// tap.test(`99.02 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should create intermediate objects`, t => {
//   const result = `{
//   "a": "b",
//   "b": {
//     "c": [],
//     "d": ["a", "b"],
//     "e": [{}, { "f": "g" }],
//     "f": "i"
//   },
//   "c": {
//     "d": {
//       "e": {
//         "f": "l"
//       }
//     }
//   }
// }`;
//   setter(t, testObj, result, "c.d.e.f", "l", "99.02");
//   t.end();
// });

// TODO:
//
// tap.test(`99.03 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should create intermediate objects`, t => {
//   const result = `{
//   "a": "b",
//   "b": {
//     "c": [],
//     "d": ["a", "b"],
//     "e": [{}, { "f": "g" }],
//     "f": "i"
//   },
//   "c": {
//     "d": {
//       "e": {
//         "f": "l"
//       }
//     }
//   }
// }`;
//   setter(t, testObj, result, ["c", "d", "e", "f"], "l", "99.03");
//   t.end();
// });

// TODO:
//
// tap.test(`99.04 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should create intermediate arrays`, t => {
//   const result = `{
//   "a": "b",
//   "b": {
//     "c": [],
//     "d": ["a", "b"],
//     "e": [{}, { "f": "g" }],
//     "f": "i"
//   },
//   "c": [[undefined, {
//     "m": "l"
//   }]]
// }`;
//   setter(t, testObj, result, "c.0.1.m", "l", "99.04");
//   t.end();
// });

// TODO:
//
// tap.test(`99.05 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should create intermediate arrays`, t => {
//   const result = `{
//   "a": "b",
//   "b": {
//     "c": [],
//     "d": ["a", "b"],
//     "e": [{}, { "f": "g" }],
//     "f": "i"
//   },
//   "c": {
//     "0": [{
//       "m": "l"
//     }]
//   }
// }`;
//   setter(t, testObj, result, ["c", "0", 1, "m"], "l", "99.05");
//   t.end();
// });

// TODO
//
// tap.test(`99.06 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under integer-like key`, t => {
//   const result = `{
//   "a": "b",
//   "b": {
//     "c": [],
//     "d": ["a", "b"],
//     "e": [{}, { "f": "g" }],
//     "f": "i"
//   },
//   "1a": "foo"
// }`;
//   setter(t, testObj, result, "1a", "foo", "99.06");
//   t.end();
// });

// TODO
//
// tap.test(`99.07 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under integer-like key`, t => {
//   const result = `{
//   "a": "b",
//   "b": {
//     "c": [],
//     "d": ["a", "b"],
//     "e": [{}, { "f": "g" }],
//     "f": "i"
//   },
//   "1a": "foo"
// }`;
//   setter(t, testObj, result, ["1a"], "foo", "99.07");
//   t.end();
// });

// TODO
//
// tap.test(`99.08 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under integer-like key`, t => {
//   const result = `["foo"]`;
//   setter(t, [], result, [0], "foo", "99.08");
//   t.end();
// });

// TODO
//
// tap.test(`99.09 - ${`\u001b[${36}m${`set`}\u001b[${39}m`} - ${`\u001b[${35}m${`object-path/set()`}\u001b[${39}m`} - should set value under integer-like key`, t => {
//   const result = `["foo"]`;
//   setter(t, [], result, "0", "foo", "99.09");
//   t.end();
// });
