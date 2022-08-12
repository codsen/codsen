import clone from "lodash.clonedeep";
import { mergeAdvanced } from "object-merge-advanced";
import { arrayiffy } from "arrayiffy-if-string";
import { allEq } from "object-all-values-equal-to";
import isObj from "lodash.isplainobject";

import { version as v } from "../package.json";

const version: string = v;

export interface Obj {
  [key: string]: any;
}
export interface Opts {
  placeholder: boolean;
  doNotFillThesePathsIfTheyContainPlaceholders: string[];
  useNullAsExplicitFalse: boolean;
}
const defaults: Opts = {
  placeholder: false, // value which is being used as a placeholder
  doNotFillThesePathsIfTheyContainPlaceholders: [],
  useNullAsExplicitFalse: true,
};

// ===================================
// F ( )

function typ(something: unknown): "plain object" | "array" | string {
  if (isObj(something)) {
    return "plain object";
  }
  if (Array.isArray(something)) {
    return "array";
  }
  return typeof something;
}
function isStr(something: unknown): boolean {
  return typeof something === "string";
}
function existy(x: unknown): boolean {
  return x != null;
}

// this function does the job, but it is not exposed because its first argument
// requirements are loose - it can be anything since it will be calling itself recursively
// with potentially AST contents (objects containing arrays containing objects etc.)
function fillMissingKeys(
  incompleteOriginal: Obj,
  schema: Obj,
  resolvedOpts: Opts,
  path = ""
): Obj {
  let incomplete = clone(incompleteOriginal);
  if (
    existy(incomplete) ||
    !(
      path.length &&
      resolvedOpts.doNotFillThesePathsIfTheyContainPlaceholders.includes(
        path
      ) &&
      allEq(incomplete, resolvedOpts.placeholder)
    )
  ) {
    if (isObj(schema) && isObj(incomplete)) {
      // traverse the keys on schema and add them onto incomplete
      Object.keys(schema).forEach((key) => {
        // calculate the path for current key
        let currentPath = `${path ? `${path}.` : ""}${key}`;

        if (
          resolvedOpts.doNotFillThesePathsIfTheyContainPlaceholders.includes(
            currentPath
          )
        ) {
          if (existy(incomplete[key])) {
            if (allEq(incomplete[key], resolvedOpts.placeholder)) {
              incomplete[key] = resolvedOpts.placeholder;
            }
          } else {
            // just create the key and set to placeholder value
            incomplete[key] = resolvedOpts.placeholder;
          }
        }

        if (
          !existy(incomplete[key]) ||
          !(
            resolvedOpts.doNotFillThesePathsIfTheyContainPlaceholders.includes(
              currentPath
            ) && allEq(incomplete[key], resolvedOpts.placeholder)
          )
        ) {
          incomplete[key] = fillMissingKeys(
            incomplete[key],
            schema[key],
            resolvedOpts,
            currentPath
          );
        }
      });
    } else if (Array.isArray(schema) && Array.isArray(incomplete)) {
      if (incomplete.length === 0) {
        return schema;
      }
      if (schema.length) {
        for (let i = incomplete.length; i--; ) {
          let currentPath = `${path ? `${path}.` : ""}0`;
          if (isObj(schema[0]) || Array.isArray(schema[0])) {
            incomplete[i] = fillMissingKeys(
              incomplete[i],
              schema[0],
              resolvedOpts,
              currentPath
            );
          }
        }
      }
    } else {
      return mergeAdvanced(schema, incomplete, {
        useNullAsExplicitFalse: resolvedOpts.useNullAsExplicitFalse,
      });
    }
  }
  return incomplete;
}

// =================================================
// T H E   E X P O S E D   F U N C T I O N

function fillMissing(incomplete: Obj, schema: Obj, opts?: Partial<Opts>): Obj {
  // first argument must be an object. However, we're going to call recursively,
  // so we have to wrap the main function with another, wrapper-one, and perform
  // object-checks only on that wrapper. This way, only objects can come in,
  // but inside there can be whatever data structures.
  //
  // Also, wrapper function will shield the fourth argument from the outside API
  //
  if (arguments.length === 0) {
    throw new Error(
      "object-fill-missing-keys: [THROW_ID_01] All arguments are missing!"
    );
  }
  if (!isObj(incomplete)) {
    throw new Error(
      `object-fill-missing-keys: [THROW_ID_02] First argument, input object must be a plain object. Currently it's type is "${typ(
        incomplete
      )}" and it's equal to: ${JSON.stringify(incomplete, null, 4)}`
    );
  }
  if (!isObj(schema)) {
    throw new Error(
      `object-fill-missing-keys: [THROW_ID_03] Second argument, schema object, must be a plain object. Currently it's type is "${typ(
        schema
      )}" and it's equal to: ${JSON.stringify(schema, null, 4)}`
    );
  }
  if (opts && !isObj(opts)) {
    throw new Error(
      `object-fill-missing-keys: [THROW_ID_04] Third argument, schema object, must be a plain object. Currently it's type is "${typ(
        opts
      )}" and it's equal to: ${JSON.stringify(opts, null, 4)}`
    );
  }

  // fill any settings with defaults if missing:
  let resolvedOpts: Opts = { ...defaults, ...opts };

  resolvedOpts.doNotFillThesePathsIfTheyContainPlaceholders = arrayiffy(
    resolvedOpts.doNotFillThesePathsIfTheyContainPlaceholders
  );

  let culpritsVal = null;
  let culpritsIndex = null;
  if (
    resolvedOpts.doNotFillThesePathsIfTheyContainPlaceholders.length &&
    !resolvedOpts.doNotFillThesePathsIfTheyContainPlaceholders.every(
      (key, idx) => {
        if (!isStr(key)) {
          culpritsVal = key;
          culpritsIndex = idx;
          return false;
        }
        return true;
      }
    )
  ) {
    throw new Error(
      `object-fill-missing-keys: [THROW_ID_06] resolvedOpts.doNotFillThesePathsIfTheyContainPlaceholders element with an index number "${culpritsIndex}" is not a string! It's ${typ(
        culpritsVal
      )}, equal to:\n${JSON.stringify(culpritsVal, null, 4)}`
    );
  }

  return fillMissingKeys(clone(incomplete), clone(schema), resolvedOpts);
}

export { fillMissing, defaults, version };
