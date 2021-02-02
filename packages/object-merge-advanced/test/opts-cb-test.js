/* eslint max-len:0 */

import tap from "tap";
import equal from "deep-equal";
import { mergeAdvanced as m } from "../dist/object-merge-advanced.esm";

tap.test(
  "01 - \u001b[33mOPTS\u001b[39m - opts.cb - setting hard merge if inputs are Booleans",
  (t) => {
    // control:
    t.strictSame(
      m(
        {
          a: {
            b: true,
            c: false,
            d: true,
            e: false,
          },
          b: "test",
        },
        {
          a: {
            b: false,
            c: true,
            d: true,
            e: false,
          },
          b: "",
        }
      ),
      {
        a: {
          b: true,
          c: true,
          d: true,
          e: false,
        },
        b: "test",
      },
      "01 - control, default behaviour (logical OR)"
    );
    t.end();
  }
);

tap.test(
  "02 - \u001b[33mOPTS\u001b[39m - opts.cb - setting hard merge if inputs are Booleans",
  (t) => {
    // opts.mergeBoolsUsingOrNotAnd
    t.strictSame(
      m(
        {
          a: {
            b: true,
            c: false,
            d: true,
            e: false,
          },
          b: "test",
        },
        {
          a: {
            b: false,
            c: true,
            d: true,
            e: false,
          },
          b: "",
        },
        {
          mergeBoolsUsingOrNotAnd: false,
        }
      ),
      {
        a: {
          b: false,
          c: false,
          d: true,
          e: false,
        },
        b: "test",
      },
      "02 - opts.mergeBoolsUsingOrNotAnd (logical AND)"
    );
    t.end();
  }
);

tap.test(
  "03 - \u001b[33mOPTS\u001b[39m - opts.cb - setting hard merge if inputs are Booleans",
  (t) => {
    // cb override Bool merging to be hard merges
    t.strictSame(
      m(
        {
          a: {
            b: true,
            c: false,
            d: true,
            e: false,
          },
          b: "test",
        },
        {
          a: {
            b: false,
            c: true,
            d: true,
            e: false,
          },
          b: "", // <---- make sure this string value will not be hard-merged over "b" in object from argument #1 above
        },
        {
          cb: (inputArg1, inputArg2, resultAboutToBeReturned) => {
            if (
              typeof inputArg1 === "boolean" &&
              typeof inputArg2 === "boolean"
            ) {
              return inputArg2;
            }
            return resultAboutToBeReturned;
          },
        }
      ),
      {
        a: {
          b: false,
          c: true,
          d: true,
          e: false,
        },
        b: "test", // <---- notice how hard merging on Bools didn't affect this string
      },
      "03 - cb overriding all Boolean merges"
    );
    t.end();
  }
);

tap.test(
  "04 - \u001b[33mOPTS\u001b[39m - opts.cb - setting hard merge if inputs are Booleans",
  (t) => {
    // cb hard merge for Bools will override even opts.ignoreEverything!
    t.strictSame(
      m(
        {
          a: {
            b: true,
            c: false,
            d: true,
            e: false,
          },
          b: "",
        },
        {
          a: {
            b: false,
            c: true,
            d: true,
            e: false,
          },
          b: "test", // <---- our callback won't apply to non-Bool, so it will get ignored
        },
        {
          ignoreEverything: true, // means, upon clash, values from 1st arg. prevail
          cb: (inputArg1, inputArg2, resultAboutToBeReturned) => {
            if (
              typeof inputArg1 === "boolean" &&
              typeof inputArg2 === "boolean"
            ) {
              return inputArg2;
            }
            return resultAboutToBeReturned;
          },
        }
      ),
      {
        a: {
          b: false,
          c: true,
          d: true,
          e: false,
        },
        b: "", // <---- it was outside of cb's scope as cb dealt with Bools only.
      },
      "04 - cb partially overriding opts.ignoreEverything"
    );
    t.end();
  }
);

tap.test(
  "05 - \u001b[33mOPTS\u001b[39m - opts.cb - setting hard merge if inputs are Booleans",
  (t) => {
    // cb hard merge for Bools will override even opts.ignoreEverything!
    t.strictSame(
      m(
        {
          a: {
            b: true,
            c: false,
            d: true,
            e: false,
          },
          b: "",
        },
        {
          a: {
            b: false,
            c: true,
            d: true,
            e: false,
          },
          b: "test", // <---- our callback won't apply to non-Bool, so it will get ignored
        },
        {
          mergeBoolsUsingOrNotAnd: false, // <------- sets AND as means to merge Bools
          cb: (inputArg1, inputArg2, resultAboutToBeReturned) => {
            if (
              typeof inputArg1 === "boolean" &&
              typeof inputArg2 === "boolean"
            ) {
              return inputArg2;
            }
            return resultAboutToBeReturned;
          },
        }
      ),
      {
        a: {
          // <--- second argument prevails in whole, opts.mergeBoolsUsingOrNotAnd don't matter
          b: false,
          c: true,
          d: true,
          e: false,
        },
        b: "test", // <---- standard rule applies (non-empty string vs. empty string)
      },
      "05 - cb partially overriding opts.mergeBoolsUsingOrNotAnd: false"
    );
    t.end();
  }
);

tap.test(
  "06 - \u001b[33mOPTS\u001b[39m - opts.cb - setting ignoreAll on input Booleans",
  (t) => {
    // control:
    t.strictSame(
      m(
        {
          a: {
            b: true,
            c: false,
            d: true,
            e: false,
          },
          b: "test",
        },
        {
          a: {
            b: false,
            c: true,
            d: true,
            e: false,
          },
          b: "",
        }
      ),
      {
        a: {
          b: true,
          c: true,
          d: true,
          e: false,
        },
        b: "test",
      },
      "06"
    );
    t.end();
  }
);

tap.test(
  "07 - \u001b[33mOPTS\u001b[39m - opts.cb - setting ignoreAll on input Booleans",
  (t) => {
    // opts.hardMergeEverything, NO CB:
    t.strictSame(
      m(
        {
          a: {
            b: true,
            c: false,
            d: true,
            e: false,
          },
          b: "test",
        },
        {
          a: {
            b: false,
            c: true,
            d: true,
            e: false,
          },
          b: "",
        },
        {
          hardMergeEverything: true,
        }
      ),
      {
        a: {
          // hard merge mean second argument's values prevail upon clashing
          b: false,
          c: true,
          d: true,
          e: false,
        },
        b: "",
      },
      "07"
    );
    t.end();
  }
);

tap.only(
  "08 - \u001b[33mOPTS\u001b[39m - opts.cb - setting ignoreAll on input Booleans",
  (t) => {
    // opts.hardMergeEverything, CB:
    t.strictSame(
      m(
        {
          a: {
            b: true,
            c: false,
            d: true,
            e: false,
          },
          b: "test",
        },
        {
          a: {
            b: false,
            c: true,
            d: true,
            e: false,
          },
          b: "",
        },
        {
          hardMergeEverything: true,
          cb: (inputArg1, inputArg2, resultAboutToBeReturned) => {
            if (
              typeof inputArg1 === "boolean" &&
              typeof inputArg2 === "boolean"
            ) {
              return inputArg1; // <---- opposite to the hardMerge -
              // - same as opts.ignoreEverything=true (but here only on Booleans)
            }
            return resultAboutToBeReturned;
          },
        }
      ),
      {
        a: {
          b: false,
          c: true,
          d: true,
          e: false,
        },
        b: "", // being hard-merged as usual
      },
      "08"
    );
    t.end();
  }
);

tap.test(
  "09 - \u001b[33mOPTS\u001b[39m - opts.cb - using callback to wrap string with other strings",
  (t) => {
    // control:
    t.strictSame(
      m(
        {
          a: {
            b: "old value for b",
            c: "old value for c",
            d: "old value for c",
            e: "old value for d",
          },
          b: false,
        },
        {
          a: {
            b: "var1",
            c: "var2",
            d: "var3",
            e: "var4",
          },
          b: null,
        }
      ),
      {
        a: {
          b: "var1",
          c: "var2",
          d: "var3",
          e: "var4",
        },
        b: false,
      },
      "09 - control, default behaviour (logical OR)"
    );
    t.end();
  }
);

tap.test(
  "10 - \u001b[33mOPTS\u001b[39m - opts.cb - using callback to wrap string with other strings",
  (t) => {
    // string wrapping:
    t.strictSame(
      m(
        {
          a: {
            b: "old value for b",
            c: "old value for c",
            d: "old value for c",
            e: "old value for d",
          },
          b: false,
        },
        {
          a: {
            b: "var1",
            c: "var2",
            d: "var3",
            e: "var4",
          },
          b: null,
        },
        {
          cb: (inputArg1, inputArg2, resultAboutToBeReturned) => {
            if (typeof resultAboutToBeReturned === "string") {
              return `{{ ${resultAboutToBeReturned} }}`;
            }
            return resultAboutToBeReturned;
          },
        }
      ),
      {
        a: {
          b: "{{ var1 }}",
          c: "{{ var2 }}",
          d: "{{ var3 }}",
          e: "{{ var4 }}",
        },
        b: false,
      },
      "10 - wraps if string"
    );
    t.end();
  }
);

tap.test(
  "11 - \u001b[33mOPTS\u001b[39m - opts.cb - pin the 4th arg values",
  (t) => {
    const tester = m(
      {
        a: {
          b: "c1",
          d: null,
          m: ["x", "y"],
          n: [
            {
              p: "p val 1",
              r: "r val 1",
            },
          ],
        },
      },
      {
        a: {
          b: "c2",
          d: ["i", "j", "k"],
          m: ["z"],
          n: [
            {
              p: "p val 2",
              r: "r val 2",
            },
          ],
        },
      },
      {
        cb: (inputArg1, inputArg2, resultAboutToBeReturned, infoObj) => {
          if (inputArg1 === "c1") {
            t.strictSame(
              infoObj,
              {
                key: "b",
                path: "a.b",
                type: ["string", "string"],
              },
              "11.01 - cb values pinned an object"
            );
          }

          if (equal(inputArg1, null)) {
            t.strictSame(
              infoObj,
              {
                key: "d",
                path: "a.d",
                type: ["null", "array"],
              },
              "11.02 - cb values pinned a key which has a value of array"
            );
          }

          if (equal(inputArg1, ["x"])) {
            t.strictSame(
              infoObj,
              {
                key: "x",
                path: "a.m.0",
                type: ["array", "array"],
              },
              "11.03 - cb values pinned an element within an array"
            );
          }
          return resultAboutToBeReturned;
        },
      }
    );

    // dummy test to prevent unused variable alerts
    t.pass(tester);
    t.end();
  }
);

tap.test(
  "12 - \u001b[33mOPTS\u001b[39m - opts.cb - using cb's 4th arg to concatenate certain key values during merge",
  (t) => {
    t.strictSame(
      m(
        {
          x: {
            key: "a",
            c: "c val 1",
            d: "d val 1",
            e: "e val 1",
          },
          z: {
            key: "z.key val 1",
          },
        },
        {
          x: {
            key: "b",
            c: "c val 2",
            d: "d val 2",
            e: "e val 2",
          },
          z: {
            key: "z.key val 2",
          },
        }
      ),
      {
        x: {
          key: "b",
          c: "c val 2",
          d: "d val 2",
          e: "e val 2",
        },
        z: {
          key: "z.key val 2",
        },
      },
      "12 - default behaviour, control"
    );
    t.end();
  }
);

tap.test(
  "13 - \u001b[33mOPTS\u001b[39m - opts.cb - using cb's 4th arg to concatenate certain key values during merge",
  (t) => {
    t.strictSame(
      m(
        {
          x: {
            key: "a", // <------- merge this
            c: "c val 1",
            d: "d val 1",
            e: "e val 1",
          },
          z: {
            key: "z.key val 1",
          },
        },
        {
          x: {
            key: "b", // <------- with this, but only this path
            c: "c val 2",
            d: "d val 2",
            e: "e val 2",
          },
          z: {
            key: "z.key val 2", // <---- even though this key is also same-named
          },
        },
        {
          cb: (inputArg1, inputArg2, resultAboutToBeReturned, infoObj) => {
            if (infoObj.path === "x.key") {
              return (
                `${
                  typeof inputArg1 === "string" && inputArg1.length > 0
                    ? inputArg1
                    : ""
                }` +
                `${
                  typeof inputArg2 === "string" && inputArg2.length > 0
                    ? inputArg2
                    : ""
                }`
              );
            }
            return resultAboutToBeReturned;
          },
        }
      ),
      {
        x: {
          key: "ab",
          c: "c val 2",
          d: "d val 2",
          e: "e val 2",
        },
        z: {
          key: "z.key val 2",
        },
      },
      "13 - cb fourth arg's path info used to override to merge strings"
    );
    t.end();
  }
);

tap.test(
  "14 - \u001b[33mOPTS\u001b[39m - opts.hardMergeEverything - revisiting deep-level arrays",
  (t) => {
    // control:
    t.strictSame(
      m(
        {
          a: {
            b: [
              {
                c: "d",
              },
              {
                e: "f",
              },
            ],
          },
          k: "l", // should be left intact
          m: {
            // should be left intact too
            n: {
              o: {
                p: "r",
              },
            },
          },
        },
        {
          a: {
            b: [
              {
                c: "x",
              },
            ],
          },
        }
      ),
      {
        a: {
          b: [
            {
              c: "x",
            },
            {
              e: "f",
            },
          ],
        },
        k: "l", // should be left intact
        m: {
          // should be left intact too
          n: {
            o: {
              p: "r",
            },
          },
        },
      },
      "14.01"
    );

    // now set the opts.hardMergeEverything
    t.strictSame(
      m(
        {
          a: {
            b: [
              {
                c: "d",
              },
              {
                e: "f",
              },
            ],
            s: "t",
          },
          k: "l", // should be left intact
          m: {
            // should be left intact too
            n: {
              o: {
                p: "r",
              },
            },
          },
        },
        {
          a: {
            b: [
              {
                c: "x",
              },
            ],
          },
        },
        {
          hardMergeEverything: true,
        }
      ),
      {
        a: {
          b: [
            {
              c: "x",
            },
          ],
          s: "t",
        },
        k: "l", // should be left intact
        m: {
          // should be left intact too
          n: {
            o: {
              p: "r",
            },
          },
        },
      },
      "14.02"
    );
    t.end();
  }
);
