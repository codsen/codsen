import { arrayiffy } from "arrayiffy-if-string";
import {
  deepClone as clone,
  existy,
  formatDiagnosticValue,
  isPlainObject as isObj,
  isStr,
  type JSONObject,
  type Obj,
} from "codsen-utils";
import { allEq } from "object-all-values-equal-to";
import { mergeAdvanced } from "object-merge-advanced";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

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

// this function does the job, but it is not exposed because its first argument
// requirements are loose - it can be anything since it will be calling itself recursively
// with potentially AST contents (objects containing arrays containing objects etc.)
function fillMissingKeys(
  incompleteOriginal: Obj,
  schema: Obj,
  resolvedOpts: Opts,
  skippedPaths: ReadonlySet<string>,
  path = "",
): Obj {
  DEV && console.log(`054 fillMissingKeys() starts`);
  const incomplete = incompleteOriginal;
  if (
    existy(incomplete) ||
    !(
      path.length &&
      skippedPaths.has(path) &&
      allEq(incomplete, resolvedOpts.placeholder)
    )
  ) {
    DEV && console.log(`064`);
    if (isObj(schema) && isObj(incomplete)) {
      DEV && console.log(`066 - it's a plain object`);
      // traverse the keys on schema and add them onto incomplete
      Object.keys(schema).forEach((key) => {
        // calculate the path for current key
        let currentPath = `${path ? `${path}.` : ""}${key}`;

        if (skippedPaths.has(currentPath)) {
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
            skippedPaths.has(currentPath) &&
            allEq(incomplete[key], resolvedOpts.placeholder)
          )
        ) {
          incomplete[key] = fillMissingKeys(
            incomplete[key] as JSONObject,
            schema[key] as JSONObject,
            resolvedOpts,
            skippedPaths,
            currentPath,
          );
        }
      });
    } else if (Array.isArray(schema) && Array.isArray(incomplete)) {
      DEV && console.log(`100 - it's an array`);
      if (incomplete.length === 0) {
        return clone(schema);
      }
      if (schema.length) {
        for (let i = incomplete.length; i--; ) {
          let currentPath = `${path ? `${path}.` : ""}0`;
          if (isObj(schema[0]) || Array.isArray(schema[0])) {
            incomplete[i] = fillMissingKeys(
              incomplete[i],
              schema[0] as JSONObject,
              resolvedOpts,
              skippedPaths,
              currentPath,
            );
          }
        }
      }
    } else {
      DEV && console.log(`119 - mergeAdvanced()`);
      return mergeAdvanced(schema, incomplete, {
        useNullAsExplicitFalse: resolvedOpts.useNullAsExplicitFalse,
        cb: (inputArg1, inputArg2, resultAboutToBeReturned) => {
          // if two primitive values are being merged, don't write
          // the schema value onto the original
          if (typ(inputArg1) === typ(inputArg2)) {
            return inputArg2;
          }
          return resultAboutToBeReturned;
        },
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
  // biome-ignore lint/complexity/noArguments: arity distinguishes no arguments from an explicit undefined; they throw different errors
  if (arguments.length === 0) {
    throw new Error(
      "object-fill-missing-keys/fillMissing(): [THROW_ID_01] All arguments are missing!",
    );
  }
  if (!isObj(incomplete)) {
    throw new Error(
      `object-fill-missing-keys/fillMissing(): [THROW_ID_02] First argument, input object must be a plain object. Currently it's type is "${typ(
        incomplete,
      )}" and it's equal to: ${formatDiagnosticValue(incomplete, 4)}`,
    );
  }
  if (!isObj(schema)) {
    throw new Error(
      `object-fill-missing-keys/fillMissing(): [THROW_ID_03] Second argument, schema object, must be a plain object. Currently it's type is "${typ(
        schema,
      )}" and it's equal to: ${formatDiagnosticValue(schema, 4)}`,
    );
  }
  if (opts && !isObj(opts)) {
    throw new Error(
      `object-fill-missing-keys/fillMissing(): [THROW_ID_04] Third argument, schema object, must be a plain object. Currently it's type is "${typ(
        opts,
      )}" and it's equal to: ${formatDiagnosticValue(opts, 4)}`,
    );
  }

  // fill any settings with defaults if missing:
  let resolvedOpts: Opts = { ...defaults, ...opts };
  DEV &&
    console.log(
      `179 ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        resolvedOpts,
        null,
        4,
      )}`,
    );

  resolvedOpts.doNotFillThesePathsIfTheyContainPlaceholders = arrayiffy(
    resolvedOpts.doNotFillThesePathsIfTheyContainPlaceholders,
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
      },
    )
  ) {
    throw new Error(
      `object-fill-missing-keys/fillMissing(): [THROW_ID_05] resolvedOpts.doNotFillThesePathsIfTheyContainPlaceholders element with an index number "${culpritsIndex}" is not a string! It's ${typ(
        culpritsVal,
      )}, equal to:\n${formatDiagnosticValue(culpritsVal, 4)}`,
    );
  }

  return fillMissingKeys(
    clone(incomplete),
    schema,
    resolvedOpts,
    new Set(resolvedOpts.doNotFillThesePathsIfTheyContainPlaceholders),
  );
}

export { defaults, fillMissing, version };
