import { arrObjOrBoth } from "util-array-object-or-both";
import { checkTypesMini } from "check-types-mini";
import { compare } from "ast-compare";
import { traverse } from "ast-monkey-traverse";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

/* eslint no-use-before-define: 0 */
// From "type-fest" by Sindre Sorhus, with added undefined
type JsonValue =
  | string
  | number
  | boolean
  | null
  | undefined // non-JSON but added too
  | JsonObject
  | JsonArray;
type JsonObject = { [Key in string]?: JsonValue };
type JsonArray = JsonValue[];

// -----------------------------------------------------------------------------

interface InternalOpts {
  key?: null | string;
  val?: any;
  only?: string | null | undefined;
  index?: number;
  mode: "find" | "get" | "set" | "drop" | "del" | "arrayFirstOnly";
}
interface Finding {
  index: number;
  key: string;
  val: any;
  path: number[];
}
function existy(x: any): boolean {
  return x != null;
}
// function isStr(x) { return typeof x === 'string' }
function compareIsEqual(a: any, b: any): boolean {
  if (typeof a !== typeof b) {
    return false;
  }
  return !!compare(a, b, { matchStrictly: true, useWildcards: true });
}
function isObj(something: any): boolean {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}

// -----------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function monkey(originalInput: JsonValue, originalOpts: InternalOpts) {
  DEV && console.log(`060 monkey() called`);
  let opts: InternalOpts = {
    ...originalOpts,
  };
  DEV &&
    console.log(
      `066 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
        opts,
        null,
        4
      )}`
    );

  // ---------------------------------------------------------------------------
  // action

  interface Data {
    count: number;
    gatherPath: number[];
    finding: any;
  }
  let data: Data = { count: 0, gatherPath: [], finding: null };

  let findings: Finding[] = [];

  let ko = false; // key only
  let vo = false; // value only
  if (existy(opts.key) && opts.val === undefined) {
    ko = true;
  }
  if (!existy(opts.key) && opts.val !== undefined) {
    vo = true;
  }
  DEV &&
    console.log(
      `095 ${`\u001b[${33}m${`keyOnly, ko`}\u001b[${39}m`} = ${JSON.stringify(
        ko,
        null,
        4
      )}; ${`\u001b[${33}m${`valueOnly, vo`}\u001b[${39}m`} = ${JSON.stringify(
        vo,
        null,
        4
      )}`
    );

  let input = originalInput;
  if (
    opts.mode === "arrayFirstOnly" &&
    Array.isArray(input) &&
    input.length > 0
  ) {
    input = [input[0]];
  }

  //
  //
  //

  DEV && console.log(`119 ${`\u001b[${32}m${`CALL`}\u001b[${39}m`} traverse()`);
  input = traverse(input, (key, val, innerObj) => {
    DEV &&
      console.log(`122 ${`\u001b[${35}m${`---------------`}\u001b[${39}m`}`);
    DEV &&
      console.log(
        `125 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`key`}\u001b[${39}m`} = ${JSON.stringify(
          key,
          null,
          4
        )}; ${`\u001b[${33}m${`val`}\u001b[${39}m`} = ${JSON.stringify(
          val,
          null,
          4
        )}; ${`\u001b[${33}m${`innerObj`}\u001b[${39}m`} = ${JSON.stringify(
          innerObj,
          null,
          4
        )}`
      );
    let temp: Finding;
    data.count += 1;
    data.gatherPath.length = innerObj.depth;
    data.gatherPath.push(data.count);
    if (opts.mode === "get") {
      if (data.count === opts.index) {
        if (innerObj.parentType === "object") {
          data.finding = {};
          data.finding[key] = val;
        } else {
          data.finding = key;
        }
      }
    } else if (opts.mode === "find" || opts.mode === "del") {
      if (
        // opts.only satisfied
        (opts.only === "any" ||
          (opts.only === "array" && innerObj.parentType === "array") ||
          (opts.only === "object" && innerObj.parentType !== "array")) && // match
        ((ko && compareIsEqual(key, opts.key)) ||
          (vo && compareIsEqual(val, opts.val)) ||
          (!ko &&
            !vo &&
            compareIsEqual(key, opts.key) &&
            compareIsEqual(val, opts.val)))
      ) {
        if (opts.mode === "find") {
          temp = {
            index: data.count,
            key,
            val,
            path: [...data.gatherPath],
          };
          findings.push(temp);
        } else {
          // del() then!
          return NaN;
        }
      } else {
        return innerObj.parentType === "object" ? val : key;
      }
    }

    if (opts.mode === "set" && data.count === opts.index) {
      return opts.val;
    }
    if (opts.mode === "drop" && data.count === opts.index) {
      return NaN;
    }
    if (opts.mode === "arrayFirstOnly") {
      if (innerObj.parentType === "object" && Array.isArray(val)) {
        return [val[0]];
      }
      if (existy(key) && Array.isArray(key)) {
        return [key[0]];
      }
      return innerObj.parentType === "object" ? val : key;
    }
    return innerObj.parentType === "object" ? val : key;
  });
  DEV &&
    console.log(`200 ${`\u001b[${35}m${`--------------- fin.`}\u001b[${39}m`}`);

  // returns
  if (opts.mode === "get") {
    return data.finding;
  }
  if (opts.mode === "find") {
    return findings;
  }
  return input;
}

// -----------------------------------------------------------------------------
// Validate and prep all the options right here

interface FindOpts {
  key: null | string;
  val: any;
  only?: undefined | null | "any" | "array" | "object";
}
function find(input: JsonValue, originalOpts: FindOpts): Finding[] {
  if (!existy(input)) {
    throw new Error(
      "ast-monkey/main.js/find(): [THROW_ID_02] Please provide the input"
    );
  }
  if (
    !isObj(originalOpts) ||
    (originalOpts.key === undefined && originalOpts.val === undefined)
  ) {
    throw new Error(
      "ast-monkey/main.js/find(): [THROW_ID_03] Please provide opts.key or opts.val"
    );
  }
  let opts = { ...originalOpts };
  checkTypesMini(opts, null, {
    schema: {
      key: ["null", "string"],
      val: "any",
      only: ["undefined", "null", "string"],
    },
    msg: "ast-monkey/get(): [THROW_ID_04*]",
  });
  if (typeof opts.only === "string" && opts.only.length > 0) {
    opts.only = arrObjOrBoth(opts.only, {
      optsVarName: "opts.only",
      msg: "ast-monkey/find(): [THROW_ID_05*]",
    });
  } else {
    opts.only = "any";
  }
  return monkey(input, { ...opts, mode: "find" });
}

interface GetOpts {
  index: number; // obligatory for get()
  only?: undefined | null | "any" | "array" | "object";
}
function get(input: JsonValue, originalOpts: GetOpts): GetOpts {
  if (!existy(input)) {
    throw new Error(
      "ast-monkey/main.js/get(): [THROW_ID_06] Please provide the input"
    );
  }
  if (!isObj(originalOpts)) {
    throw new Error(
      "ast-monkey/main.js/get(): [THROW_ID_07] Please provide the opts"
    );
  }
  if (!existy(originalOpts.index)) {
    throw new Error(
      "ast-monkey/main.js/get(): [THROW_ID_08] Please provide opts.index"
    );
  }
  let opts = { ...originalOpts };
  if (typeof opts.index === "string" && /^\d*$/.test(opts.index)) {
    opts.index = +opts.index;
  } else if (!Number.isInteger(opts.index)) {
    throw new Error(
      `ast-monkey/main.js/get(): [THROW_ID_11] opts.index must be a natural number. It was given as: ${
        opts.index
      } (type ${typeof opts.index})`
    );
  }
  return monkey(input, { ...opts, mode: "get" });
}

interface SetOpts {
  key: null | string;
  val: any;
  index: number; // obligatory for get()
  only?: undefined | null | "any" | "array" | "object";
}
function set(input: JsonValue, originalOpts: SetOpts): JsonValue {
  if (!existy(input)) {
    throw new Error(
      "ast-monkey/main.js/set(): [THROW_ID_12] Please provide the input"
    );
  }
  if (!isObj(originalOpts)) {
    throw new Error(
      "ast-monkey/main.js/set(): [THROW_ID_13] Please provide the input"
    );
  }
  if (!existy(originalOpts.key) && originalOpts.val === undefined) {
    throw new Error(
      "ast-monkey/main.js/set(): [THROW_ID_14] Please provide opts.val"
    );
  }
  if (!existy(originalOpts.index)) {
    throw new Error(
      "ast-monkey/main.js/set(): [THROW_ID_15] Please provide opts.index"
    );
  }
  let opts = { ...originalOpts };
  if (typeof opts.index === "string" && /^\d*$/.test(opts.index)) {
    opts.index = +opts.index;
  } else if (!Number.isInteger(opts.index)) {
    throw new Error(
      `ast-monkey/main.js/set(): [THROW_ID_17] opts.index must be a natural number. It was given as: ${opts.index}`
    );
  }
  if (existy(opts.key) && opts.val === undefined) {
    opts.val = opts.key;
  }
  checkTypesMini(opts, null, {
    schema: {
      key: [null, "string"],
      val: "any",
      index: "number",
    },
    msg: "ast-monkey/set(): [THROW_ID_18*]",
  });
  return monkey(input, { ...opts, mode: "set" });
}

interface DropOpts {
  index: number; // obligatory for get()
  only?: undefined | null | "any" | "array" | "object";
}
function drop(input: JsonValue, originalOpts: DropOpts): JsonValue {
  if (!existy(input)) {
    throw new Error(
      "ast-monkey/main.js/drop(): [THROW_ID_19] Please provide the input"
    );
  }
  if (!isObj(originalOpts)) {
    throw new Error(
      "ast-monkey/main.js/drop(): [THROW_ID_20] Please provide the input"
    );
  }
  if (!existy(originalOpts.index)) {
    throw new Error(
      "ast-monkey/main.js/drop(): [THROW_ID_21] Please provide opts.index"
    );
  }
  let opts = { ...originalOpts };
  if (typeof opts.index === "string" && /^\d*$/.test(opts.index)) {
    opts.index = +opts.index;
  } else if (!Number.isInteger(opts.index)) {
    throw new Error(
      `ast-monkey/main.js/drop(): [THROW_ID_23] opts.index must be a natural number. It was given as: ${opts.index}`
    );
  }
  return monkey(input, { ...opts, mode: "drop" });
}

interface DelOpts {
  key: null | string;
  val: any;
  only?: undefined | null | "any" | "array" | "object";
}
function del(input: JsonValue, originalOpts: DelOpts): JsonValue {
  if (!existy(input)) {
    throw new Error(
      "ast-monkey/main.js/del(): [THROW_ID_26] Please provide the input"
    );
  }
  if (!isObj(originalOpts)) {
    throw new Error(
      "ast-monkey/main.js/del(): [THROW_ID_27] Please provide the opts object"
    );
  }
  if (!existy(originalOpts.key) && originalOpts.val === undefined) {
    throw new Error(
      "ast-monkey/main.js/del(): [THROW_ID_28] Please provide opts.key or opts.val"
    );
  }
  let opts = { ...originalOpts };
  checkTypesMini(opts, null, {
    schema: {
      key: [null, "string"],
      val: "any",
      only: ["undefined", "null", "string"],
    },
    msg: "ast-monkey/drop(): [THROW_ID_29*]",
  });
  if (typeof opts.only === "string" && opts.only.length > 0) {
    opts.only = arrObjOrBoth(opts.only, {
      msg: "ast-monkey/del(): [THROW_ID_30*]",
      optsVarName: "opts.only",
    });
  } else {
    opts.only = "any";
  }
  return monkey(input, { ...opts, mode: "del" });
}

function arrayFirstOnly(input: JsonValue): JsonValue {
  if (!existy(input)) {
    throw new Error(
      "ast-monkey/main.js/arrayFirstOnly(): [THROW_ID_31] Please provide the input"
    );
  }
  return monkey(input, { mode: "arrayFirstOnly" });
}

// -----------------------------------------------------------------------------

export { find, get, set, drop, del, arrayFirstOnly, traverse, version };
