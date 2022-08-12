import { arrObjOrBoth } from "util-array-object-or-both";
import { checkTypesMini } from "check-types-mini";
import { compare } from "ast-compare";
import { traverse } from "ast-monkey-traverse";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

/* eslint no-use-before-define: 0 */
// From "type-fest" by Sindre Sorhus, with added undefined
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | undefined // non-JSON but added too
  | JsonObject
  | JsonArray;
export type JsonObject = { [Key in string]?: JsonValue };
export type JsonArray = JsonValue[];

// -----------------------------------------------------------------------------

interface InternalOpts {
  key?: null | string;
  val?: any;
  only?: string | null | undefined;
  index?: number;
  mode: "find" | "get" | "set" | "drop" | "del" | "arrayFirstOnly";
}
export interface Finding {
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
function isObj(something: unknown): boolean {
  return (
    !!something && typeof something === "object" && !Array.isArray(something)
  );
}

// -----------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function monkey(originalInput: JsonValue, opts: InternalOpts) {
  DEV && console.log(`060 monkey() called`);
  let resolvedOpts: InternalOpts = {
    ...opts,
  };
  DEV &&
    console.log(
      `066 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        resolvedOpts,
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
  if (existy(resolvedOpts.key) && resolvedOpts.val === undefined) {
    ko = true;
  }
  if (!existy(resolvedOpts.key) && resolvedOpts.val !== undefined) {
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
    resolvedOpts.mode === "arrayFirstOnly" &&
    Array.isArray(input) &&
    input.length
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
    if (resolvedOpts.mode === "get") {
      if (data.count === resolvedOpts.index) {
        if (innerObj.parentType === "object") {
          data.finding = {};
          data.finding[key] = val;
        } else {
          data.finding = key;
        }
      }
    } else if (resolvedOpts.mode === "find" || resolvedOpts.mode === "del") {
      if (
        // resolvedOpts.only satisfied
        (resolvedOpts.only === "any" ||
          (resolvedOpts.only === "array" && innerObj.parentType === "array") ||
          (resolvedOpts.only === "object" &&
            innerObj.parentType !== "array")) && // match
        ((ko && compareIsEqual(key, resolvedOpts.key)) ||
          (vo && compareIsEqual(val, resolvedOpts.val)) ||
          (!ko &&
            !vo &&
            compareIsEqual(key, resolvedOpts.key) &&
            compareIsEqual(val, resolvedOpts.val)))
      ) {
        if (resolvedOpts.mode === "find") {
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

    if (resolvedOpts.mode === "set" && data.count === resolvedOpts.index) {
      return resolvedOpts.val;
    }
    if (resolvedOpts.mode === "drop" && data.count === resolvedOpts.index) {
      return NaN;
    }
    if (resolvedOpts.mode === "arrayFirstOnly") {
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
    console.log(`201 ${`\u001b[${35}m${`--------------- fin.`}\u001b[${39}m`}`);

  // returns
  if (resolvedOpts.mode === "get") {
    return data.finding;
  }
  if (resolvedOpts.mode === "find") {
    return findings;
  }
  return input;
}

// -----------------------------------------------------------------------------
// Validate and prep all the options right here

export interface FindOpts {
  key: null | string;
  val: any;
  only?: undefined | null | "any" | "array" | "object";
}
function find(input: JsonValue, opts: FindOpts): Finding[] {
  if (!existy(input)) {
    throw new Error(
      "ast-monkey/main.js/find(): [THROW_ID_02] Please provide the input"
    );
  }
  if (!isObj(opts) || (opts.key === undefined && opts.val === undefined)) {
    throw new Error(
      "ast-monkey/main.js/find(): [THROW_ID_03] Please provide resolvedOpts.key or resolvedOpts.val"
    );
  }
  let resolvedOpts = { ...opts };
  checkTypesMini(resolvedOpts, null, {
    schema: {
      key: ["null", "string"],
      val: "any",
      only: ["undefined", "null", "string"],
    },
    msg: "ast-monkey/get(): [THROW_ID_04*]",
  });
  if (typeof resolvedOpts.only === "string" && resolvedOpts.only.length) {
    resolvedOpts.only = arrObjOrBoth(resolvedOpts.only, {
      optsVarName: "resolvedOpts.only",
      msg: "ast-monkey/find(): [THROW_ID_05*]",
    });
  } else {
    resolvedOpts.only = "any";
  }
  return monkey(input, { ...resolvedOpts, mode: "find" });
}

export interface GetOpts {
  index: number; // obligatory for get()
  only?: undefined | null | "any" | "array" | "object";
}
function get(input: JsonValue, opts: GetOpts): JsonValue {
  if (!existy(input)) {
    throw new Error(
      "ast-monkey/main.js/get(): [THROW_ID_06] Please provide the input"
    );
  }
  if (!isObj(opts)) {
    throw new Error(
      "ast-monkey/main.js/get(): [THROW_ID_07] Please provide the resolvedOpts"
    );
  }
  if (!existy(opts.index)) {
    throw new Error(
      "ast-monkey/main.js/get(): [THROW_ID_08] Please provide resolvedOpts.index"
    );
  }
  let resolvedOpts = { ...opts };
  if (
    typeof resolvedOpts.index === "string" &&
    /^\d+$/.test(resolvedOpts.index)
  ) {
    resolvedOpts.index = +resolvedOpts.index;
  } else if (!Number.isInteger(resolvedOpts.index)) {
    throw new Error(
      `ast-monkey/main.js/get(): [THROW_ID_11] resolvedOpts.index must be a natural number. It was given as: ${
        resolvedOpts.index
      } (type ${typeof resolvedOpts.index})`
    );
  }
  return monkey(input, { ...resolvedOpts, mode: "get" });
}

export interface SetOpts {
  key: null | string;
  val: any;
  index: number;
}
function set(input: JsonValue, opts: SetOpts): JsonValue {
  if (!existy(input)) {
    throw new Error(
      "ast-monkey/main.js/set(): [THROW_ID_12] Please provide the input"
    );
  }
  if (!isObj(opts)) {
    throw new Error(
      "ast-monkey/main.js/set(): [THROW_ID_13] Please provide the input"
    );
  }
  if (!existy(opts.key) && opts.val === undefined) {
    throw new Error(
      "ast-monkey/main.js/set(): [THROW_ID_14] Please provide resolvedOpts.val"
    );
  }
  if (!existy(opts.index)) {
    throw new Error(
      "ast-monkey/main.js/set(): [THROW_ID_15] Please provide resolvedOpts.index"
    );
  }
  let resolvedOpts = { ...opts };
  if (
    typeof resolvedOpts.index === "string" &&
    /^\d+$/.test(resolvedOpts.index)
  ) {
    resolvedOpts.index = +resolvedOpts.index;
  } else if (!Number.isInteger(resolvedOpts.index)) {
    throw new Error(
      `ast-monkey/main.js/set(): [THROW_ID_17] resolvedOpts.index must be a natural number. It was given as: ${resolvedOpts.index}`
    );
  }
  if (existy(resolvedOpts.key) && resolvedOpts.val === undefined) {
    resolvedOpts.val = resolvedOpts.key;
  }
  checkTypesMini(resolvedOpts, null, {
    schema: {
      key: [null, "string"],
      val: "any",
      index: "number",
    },
    msg: "ast-monkey/set(): [THROW_ID_18*]",
  });
  return monkey(input, { ...resolvedOpts, mode: "set" });
}

export interface DropOpts {
  index: number;
}
function drop(input: JsonValue, opts: DropOpts): JsonValue {
  if (!existy(input)) {
    throw new Error(
      "ast-monkey/main.js/drop(): [THROW_ID_19] Please provide the input"
    );
  }
  if (!isObj(opts)) {
    throw new Error(
      "ast-monkey/main.js/drop(): [THROW_ID_20] Please provide the input"
    );
  }
  if (!existy(opts.index)) {
    throw new Error(
      "ast-monkey/main.js/drop(): [THROW_ID_21] Please provide resolvedOpts.index"
    );
  }
  let resolvedOpts = { ...opts };
  if (
    typeof resolvedOpts.index === "string" &&
    /^\d+$/.test(resolvedOpts.index)
  ) {
    resolvedOpts.index = +resolvedOpts.index;
  } else if (!Number.isInteger(resolvedOpts.index)) {
    throw new Error(
      `ast-monkey/main.js/drop(): [THROW_ID_23] resolvedOpts.index must be a natural number. It was given as: ${resolvedOpts.index}`
    );
  }
  return monkey(input, { ...resolvedOpts, mode: "drop" });
}

export interface DelOpts {
  key: null | string;
  val: any;
  only?: undefined | null | "any" | "array" | "object";
}
function del(input: JsonValue, opts: DelOpts): JsonValue {
  if (!existy(input)) {
    throw new Error(
      "ast-monkey/main.js/del(): [THROW_ID_26] Please provide the input"
    );
  }
  if (!isObj(opts)) {
    throw new Error(
      "ast-monkey/main.js/del(): [THROW_ID_27] Please provide the resolvedOpts object"
    );
  }
  if (!existy(opts.key) && opts.val === undefined) {
    throw new Error(
      "ast-monkey/main.js/del(): [THROW_ID_28] Please provide resolvedOpts.key or resolvedOpts.val"
    );
  }
  let resolvedOpts = { ...opts };
  checkTypesMini(resolvedOpts, null, {
    schema: {
      key: [null, "string"],
      val: "any",
      only: ["undefined", "null", "string"],
    },
    msg: "ast-monkey/drop(): [THROW_ID_29*]",
  });
  if (typeof resolvedOpts.only === "string" && resolvedOpts.only.length) {
    resolvedOpts.only = arrObjOrBoth(resolvedOpts.only, {
      msg: "ast-monkey/del(): [THROW_ID_30*]",
      optsVarName: "resolvedOpts.only",
    });
  } else {
    resolvedOpts.only = "any";
  }
  return monkey(input, { ...resolvedOpts, mode: "del" });
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
