import { isPlainObject as isObj, match } from "codsen-utils";
import typ from "type-detect";

import { version as v } from "../package.json";

const version: string = v;
declare let DEV: boolean;

export interface Obj {
  [key: string]: any;
}

export interface Opts {
  ignoreKeys: string | string[];
  ignorePaths: string | string[];
  acceptArrays: boolean;
  acceptArraysIgnore: string | string[];
  enforceStrictKeyset: boolean;
  schema: Obj;
  msg: string;
  optsVarName: string;
}

const defaults: Opts = {
  ignoreKeys: [],
  ignorePaths: [],
  acceptArrays: false,
  acceptArraysIgnore: [],
  enforceStrictKeyset: true,
  schema: {},
  msg: "check-types-mini",
  optsVarName: "opts",
};

const ANY_TYPE_NAMES = new Set([
  "any",
  "anything",
  "every",
  "everything",
  "all",
  "whatever",
  "whatevs",
]);
const hasOwn = Object.prototype.hasOwnProperty;
const caseSensitiveMatchOpts = { caseSensitiveMatch: true } as const;

function matchesAny(value: string, patterns: string[]): boolean {
  return patterns.some((pattern) => value === pattern || match(value, pattern));
}

function pullAllWithGlob(
  originalInput: string[],
  toBeRemoved: string[],
): string[] {
  if (!toBeRemoved.length) {
    return originalInput;
  }
  return originalInput.filter(
    (originalVal) =>
      !toBeRemoved.some(
        (remVal) =>
          originalVal === remVal ||
          match(originalVal, remVal, caseSensitiveMatchOpts),
      ),
  );
}

function difference(left: string[], right: string[]): string[] {
  if (!right.length) {
    return left;
  }
  let rightSet = new Set(right);
  return left.filter((key) => !rightSet.has(key));
}

function normalizeSchema(schema: Obj): Obj {
  let result: Obj = {};

  function visit(value: unknown, path: string): void {
    if (isObj(value)) {
      for (let key of Object.keys(value)) {
        visit(value[key], path ? `${path}.${key}` : key);
      }
      return;
    }

    let values = Array.isArray(value) ? value : [value];
    result[path] = values.map((el) => `${el}`.toLowerCase().trim());
  }

  for (let key of Object.keys(schema)) {
    visit(schema[key], key);
  }

  return result;
}

interface WalkInfo {
  path: string;
  parent: unknown;
  parentType: "array" | "object";
}

type WalkCallback = (key: any, val: any, info: WalkInfo) => void;

function walk(value: unknown, callback: WalkCallback, path = ""): void {
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      if (value[i] === undefined) {
        continue;
      }
      let childPath = path ? `${path}.${i}` : `${i}`;
      callback(value[i], undefined, {
        path: childPath,
        parent: value,
        parentType: "array",
      });
      walk(value[i], callback, childPath);
    }
  } else if (isObj(value)) {
    for (let key of Object.keys(value)) {
      let childPath = path ? `${path}.${key}` : key;
      callback(key, value[key], {
        path: childPath,
        parent: value,
        parentType: "object",
      });
      walk(value[key], callback, childPath);
    }
  }
}

function getPathInfo(value: Obj, path: string): [boolean, unknown] {
  let current: unknown = value;
  let offset = 0;

  while (offset <= path.length) {
    let dotAt = path.indexOf(".", offset);
    let key = dotAt === -1 ? path.slice(offset) : path.slice(offset, dotAt);
    if (
      current === null ||
      (typeof current !== "object" && typeof current !== "function") ||
      !hasOwn.call(current, key)
    ) {
      return [false, undefined];
    }
    current = (current as Obj)[key];
    if (dotAt === -1) {
      return [true, current];
    }
    offset = dotAt + 1;
  }

  return [false, undefined];
}

// fourth input argument is shielded from an external API:
function internalApi(obj: Obj, ref: Obj | null, opts?: Partial<Opts>): void {
  if (obj == null) {
    throw new Error(
      "check-types-mini/checkTypesMini(): [THROW_ID_01] First argument is missing!",
    );
  }

  // Prep our own resolvedOpts
  // =================

  let resolvedOpts: Opts = { ...defaults, ...opts };

  if (typeof resolvedOpts.ignoreKeys === "string") {
    resolvedOpts.ignoreKeys = [resolvedOpts.ignoreKeys];
  }
  if (typeof resolvedOpts.ignorePaths === "string") {
    resolvedOpts.ignorePaths = [resolvedOpts.ignorePaths];
  }
  if (typeof resolvedOpts.acceptArraysIgnore === "string") {
    resolvedOpts.acceptArraysIgnore = [resolvedOpts.acceptArraysIgnore];
  }
  resolvedOpts.msg = `${resolvedOpts.msg}`.trim();

  if (resolvedOpts.msg[resolvedOpts.msg.length - 1] === ":") {
    resolvedOpts.msg = resolvedOpts.msg
      .slice(0, resolvedOpts.msg.length - 1)
      .trim();
  }
  // now, since we let users type the allowed types, we have to normalise the letter case:
  if (isObj(resolvedOpts.schema)) {
    // 1. if schema is given as nested AST tree, for example:
    // {
    //   schema: {
    //     option1: { somekey: "any" }, // <------ !
    //     option2: "whatever"
    //   }
    // }
    //
    // (notice it's not flat, "option1.somekey": "any", but nested!)
    //
    // then, we flatten it first, so that each AST branch's path is key and the
    // value at that branch's tip is the key's value:
    // {
    //   schema: {
    //     "option1.somekey": "any", // <------ !
    //     option2: "whatever"
    //   }
    // }
    resolvedOpts.schema = normalizeSchema(resolvedOpts.schema);
  } else if (resolvedOpts.schema != null) {
    throw new Error(
      `check-types-mini/checkTypesMini(): [THROW_ID_02] opts.schema was customised to ${JSON.stringify(
        resolvedOpts.schema,
        null,
        0,
      )} which is not object but ${typeof resolvedOpts.schema}`,
    );
  }

  if (ref == null) {
    ref = {};
  }

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------

  // THE BUSINESS
  // ============

  // Since v.4 we support nested resolvedOpts. That's AST's. This means, we have
  // to traverse them up until the last tip of each branch.

  // 1. The "obj" and "ref" root level keys need separate attention.
  // If keys mismatch, we need to check them separately from traversal.
  // During traversal, we'll check if each value is a plain object/array and
  // match the keysets as well. However, traversal won't "see" root level keys.

  DEV && console.log("236");

  let ignoreKeys = resolvedOpts.ignoreKeys as string[];
  let ignorePaths = resolvedOpts.ignorePaths as string[];
  let acceptArraysIgnore = resolvedOpts.acceptArraysIgnore as string[];
  let objKeys = Object.keys(obj);
  let refKeys = isObj(ref) ? Object.keys(ref) : [];
  let schemaKeys = isObj(resolvedOpts.schema)
    ? Object.keys(resolvedOpts.schema)
    : [];

  if (resolvedOpts.enforceStrictKeyset) {
    DEV &&
      console.log(
        `250 so \u001b[${31}m${`resolvedOpts.enforceStrictKeyset is ON`}\u001b[${39}m`,
      );
    if (schemaKeys.length) {
      let keys = pullAllWithGlob(
        difference(objKeys, refKeys.concat(schemaKeys)),
        ignoreKeys,
      );
      if (keys.length) {
        DEV && console.log("258");
        throw new TypeError(
          `check-types-mini/checkTypesMini(): [THROW_ID_03] ${resolvedOpts.msg}: ${
            resolvedOpts.optsVarName
          }.enforceStrictKeyset is on and the following key${
            keys.length > 1 ? "s" : ""
          } ${
            keys.length > 1 ? "are" : "is"
          } not covered by schema and/or reference objects: ${keys.join(", ")}`,
        );
      }
    } else if (refKeys.length) {
      let keys = pullAllWithGlob(difference(objKeys, refKeys), ignoreKeys);
      if (keys.length) {
        throw new TypeError(
          `check-types-mini/checkTypesMini(): [THROW_ID_04] ${resolvedOpts.msg}: The input object has key${
            keys.length > 1 ? "s" : ""
          } which ${
            keys.length > 1 ? "are" : "is"
          } not covered by the reference object: ${keys.join(", ")}`,
        );
      }

      keys = pullAllWithGlob(difference(refKeys, objKeys), ignoreKeys);
      if (keys.length) {
        throw new TypeError(
          `check-types-mini/checkTypesMini(): [THROW_ID_05] ${resolvedOpts.msg}: The reference object has key${
            keys.length > 1 ? "s" : ""
          } which ${
            keys.length > 1 ? "are" : "is"
          } not present in the input object: ${keys.join(", ")}`,
        );
      }
    } else {
      // it's an error because both schema and reference don't exist
      throw new TypeError(
        `check-types-mini/checkTypesMini(): [THROW_ID_06] ${resolvedOpts.msg}: Both ${resolvedOpts.optsVarName}.schema and reference objects are missing! We don't have anything to match the keys as you requested via resolvedOpts.enforceStrictKeyset!`,
      );
    }
  }

  DEV && console.log("299:");

  // 2. Call the monkey and traverse the schema object, checking each value-as-object
  // or value-as-array separately, if resolvedOpts.enforceStrictKeyset is on. Root level
  // was checked in step 1. above. What's left is deeper levels.
  DEV &&
    console.log(
      `306 ${`\u001b[${33}m${`LET'S CHECK obj`}\u001b[${39}m`} = ${JSON.stringify(
        obj,
        null,
        4,
      )}`,
    );

  // When users set schema to "any" for certain path, this applies to that path
  // and any (if exists) children objects/arrays/strings whatever on deeper children
  // paths. Now, the problem is, we check by traversing everything - this means,
  // for example, we have this to check:
  //
  // {
  //   a: {
  //     b: "c"
  //   },
  //  d: "e"
  // }

  // The walker will check "a" and find its schema is "any" - basically,
  // we don't care what it's type is and instruct "check-types-mini" to skip it.
  // This "skip" instruction applies to "b" too! However, our checking engine
  // will still traverse "b". It can't stop there, because
  // there's still "d" key to check - we're traversing EVERYTHING.
  // Challenge: when the walker stumbles upon "b" it might flag it up as
  // being of a wrong type, it does not have visibility of its parent's schemas.
  // What we'll do to fix this is we'll compile the list of any paths that have
  // "any"/"whatever" schemas in an array. Then, when deeper children nodes are
  // traversed, we'll check, are they children of any aforementioned paths (technically
  // speaking, do their path strings start with any of the strings in aforementioned
  // paths array strings).

  let ignoredPathsArr: string[] = [];

  DEV && console.log(`340 TRAVERSAL STARTS`);
  walk(obj, (key, val, innerObj) => {
    // innerObj.path
    DEV &&
      console.log(
        `345 \n${`${`\u001b[${32}m${`█`}\u001b[${39}m`} `.repeat(39)}\n`,
      );
    // Here what we have been given:
    let current = val;
    let objKey: string | undefined = key;
    if (innerObj.parentType === "array") {
      objKey = undefined;
      current = key;
    }
    DEV &&
      console.log(
        `356 \u001b[${36}m${`traversing: ██ ${innerObj.path} ██ ===========================`}\u001b[${39}m ${`\u001b[${33}m${`key`}\u001b[${39}m`} = ${key}; ${`\u001b[${33}m${`val`}\u001b[${39}m`} = ${`\u001b[${35}m${JSON.stringify(
          val,
          null,
          0,
        )}\u001b[${39}m`}; ${`\u001b[${33}m${`current`}\u001b[${39}m`} = ${JSON.stringify(
          current,
          null,
          4,
        )}`,
      );

    // Here's what we will compare against to.
    // If schema exists, types defined there will be used to compare against:

    DEV &&
      console.log(
        `372 ${`\u001b[${33}m${`resolvedOpts.schema`}\u001b[${39}m`} = ${JSON.stringify(
          resolvedOpts.schema,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `380 currently, ${`\u001b[${33}m${`ignoredPathsArr`}\u001b[${39}m`} = ${JSON.stringify(
          ignoredPathsArr,
          null,
          4,
        )}`,
      );

    // if current path is a children of any paths in "ignoredPathsArr", skip it:
    if (
      ignoredPathsArr.length &&
      ignoredPathsArr.some((path) => innerObj.path.startsWith(`${path}.`))
    ) {
      DEV &&
        console.log(
          `394 \u001b[${32}m${`SKIP THIS PATH BECAUSE IT'S A CHILD OF IGNORED PATH`}\u001b[${39}m`,
        );
      return current;
    }

    // if this key is ignored, skip it:
    if (objKey && matchesAny(objKey, ignoreKeys)) {
      DEV &&
        console.log(
          `403 \u001b[${32}m${`SKIP THIS PATH BECAUSE ITS KEY (${objKey}), IS AMONG IGNORED (${JSON.stringify(
            resolvedOpts.ignoreKeys,
            null,
            4,
          )})`}\u001b[${39}m`,
        );
      return current;
    }
    DEV &&
      console.log(
        `413 key "${objKey}" was not skipped because it did not match ${JSON.stringify(
          resolvedOpts.ignoreKeys,
          null,
          4,
        )}`,
      );

    // if this path is ignored, skip it:
    if (matchesAny(innerObj.path, ignorePaths)) {
      DEV &&
        console.log(
          `424 \u001b[${32}m${`SKIP THIS PATH BECAUSE IT (${
            innerObj.path
          }), IS AMONG IGNORED (${JSON.stringify(
            resolvedOpts.ignorePaths,
            null,
            4,
          )})`}\u001b[${39}m`,
        );
      return current;
    }
    DEV &&
      console.log(
        `436 path was not skipped because ${
          innerObj.path
        } did not match ${JSON.stringify(resolvedOpts.ignorePaths, null, 4)}`,
      );

    let isNotAnArrayChild = !(
      !isObj(current) &&
      !Array.isArray(current) &&
      Array.isArray(innerObj.parent)
    );

    // ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  █
    DEV &&
      console.log(
        `450: \n${`${`${`\u001b[${33}m${`██`}\u001b[${39}m`}${`\u001b[${31}m${`██`}\u001b[${39}m`}`}`.repeat(
          10,
        )}\n`,
      );
    DEV &&
      console.log(
        `456 ${`\u001b[${33}m${`ref`}\u001b[${39}m`} = ${JSON.stringify(
          ref,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `464 ${`\u001b[${33}m${`objKey`}\u001b[${39}m`} = ${JSON.stringify(
          objKey,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `472 ${`\u001b[${33}m${`current`}\u001b[${39}m`} = ${JSON.stringify(
          current,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `480 ${`\u001b[${33}m${`innerObj`}\u001b[${39}m`} = ${JSON.stringify(
          innerObj,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `488 ${`\u001b[${33}m${`isNotAnArrayChild`}\u001b[${39}m`} = ${JSON.stringify(
          isNotAnArrayChild,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `496 ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
          resolvedOpts,
          null,
          4,
        )}`,
      );

    let optsSchemaHasThisPathDefined =
      isObj(resolvedOpts.schema) &&
      hasOwn.call(resolvedOpts.schema, innerObj.path);
    DEV &&
      console.log(
        `508 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`optsSchemaHasThisPathDefined`}\u001b[${39}m`} = ${JSON.stringify(
          optsSchemaHasThisPathDefined,
          null,
          4,
        )}`,
      );

    let [refHasThisPathDefined, compareTo] = isObj(ref)
      ? getPathInfo(ref, innerObj.path)
      : [false, undefined];
    DEV &&
      console.log(
        `520 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`refHasThisPathDefined`}\u001b[${39}m`} = ${JSON.stringify(
          refHasThisPathDefined,
          null,
          4,
        )}`,
      );

    DEV &&
      console.log(
        `529 \n${`${`${`\u001b[${33}m${`██`}\u001b[${39}m`}${`\u001b[${31}m${`██`}\u001b[${39}m`}`}`.repeat(
          10,
        )}\n`,
      );
    // ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  █

    // First, check if given path is not covered by neither ref object nor schema.
    // We also skip the non-container types (obj/arr) within arrays (test 02.11)
    // Otherwise, we would get false throws because arrays can mention list of
    // "things" (tag names, for example) and this application would enforce each
    // one of them, does it exist in schema/ref, but it won't exist!
    // Thus, strict existence checks apply only for object keys and arrays, not
    // array elements which are not objects/arrays.
    if (
      resolvedOpts.enforceStrictKeyset &&
      isNotAnArrayChild &&
      !optsSchemaHasThisPathDefined &&
      !refHasThisPathDefined
    ) {
      DEV &&
        console.log(
          `\u001b[${31}m${`550 0. nothing to match against.`}\u001b[${39}m`,
        );
      throw new TypeError(
        `check-types-mini/checkTypesMini(): [THROW_ID_07] ${resolvedOpts.msg}: ${resolvedOpts.optsVarName}.${
          innerObj.path
        } is neither covered by reference object (second input argument), nor ${
          resolvedOpts.optsVarName
        }.schema! To stop this error, turn off ${
          resolvedOpts.optsVarName
        }.enforceStrictKeyset or provide some type reference (2nd argument or ${
          resolvedOpts.optsVarName
        }.schema).\n\nDebug info:\n
obj = ${JSON.stringify(obj, null, 4)}\n
ref = ${JSON.stringify(ref, null, 4)}\n
innerObj = ${JSON.stringify(innerObj, null, 4)}\n
resolvedOpts = ${JSON.stringify(resolvedOpts, null, 4)}\n
current = ${JSON.stringify(current, null, 4)}\n\n`,
      );
    } else if (optsSchemaHasThisPathDefined) {
      DEV &&
        console.log(
          `\u001b[${31}m${`571 I. matching against schema.`}\u001b[${39}m`,
        );
      // step 1. Fetch the current keys' schema and normalise it - it's an array
      // which holds strings. Those strings have to be lowercased. It also can
      // be raw null/undefined, which would be arrayified and turned into string.
      DEV &&
        console.log(
          `578 ${`\u001b[${33}m${`resolvedOpts.schema[innerObj.path]`}\u001b[${39}m`} = ${JSON.stringify(
            resolvedOpts.schema[innerObj.path],
            null,
            4,
          )}`,
        );
      let currentKeysSchema = resolvedOpts.schema[innerObj.path] as string[];
      DEV &&
        console.log(
          `587 ${`\u001b[${33}m${`currentKeysSchema`}\u001b[${39}m`} = ${JSON.stringify(
            currentKeysSchema,
            null,
            4,
          )}`,
        );

      // step 2. First check does our schema contain any blanket names, "any", "whatever" etc.
      let blanketTypes = currentKeysSchema.filter((name) =>
        ANY_TYPE_NAMES.has(name),
      );
      if (!blanketTypes.length) {
        // Because, if not, it means we need to do some work, check types.

        // Beware, Booleans can be allowed blanket, as "boolean", but also,
        // in granular fashion: as just "true" or just "false".

        DEV &&
          console.log(
            `606 ${`\u001b[${33}m${`currentKeysSchema`}\u001b[${39}m`} = ${JSON.stringify(
              currentKeysSchema,
              null,
              4,
            )}`,
          );
        let currentType = typ(current).toLowerCase();
        if (
          (current !== true &&
            current !== false &&
            !currentKeysSchema.includes(currentType)) ||
          ((current === true || current === false) &&
            !currentKeysSchema.includes(String(current)) &&
            !currentKeysSchema.includes("boolean"))
        ) {
          DEV && console.log("621 I. matching against schema.");
          // new in v.2.2
          // Check if key's value is array. Then, if it is, check if resolvedOpts.acceptArrays is on.
          // If it is, then iterate through the array, checking does each value conform to the
          // types listed in that key's schema entry.
          if (Array.isArray(current) && resolvedOpts.acceptArrays) {
            DEV && console.log("627 1-1: check acceptArrays");
            // check each key:
            for (let i = 0, len = current.length; i < len; i++) {
              let elementType = typ(current[i]).toLowerCase();
              if (!currentKeysSchema.includes(elementType)) {
                throw new TypeError(
                  `check-types-mini/checkTypesMini(): [THROW_ID_08] ${resolvedOpts.msg}: ${resolvedOpts.optsVarName}.${
                    innerObj.path
                  }.${i}, the ${i}th element (equal to ${JSON.stringify(
                    current[i],
                    null,
                    0,
                  )}) is of a type ${elementType}, but only the following are allowed by the ${
                    resolvedOpts.optsVarName
                  }.schema: ${currentKeysSchema.join(", ")}`,
                );
              }
            }
          } else {
            DEV && console.log("646 1-2: matching against schema");
            // only then do throw...
            throw new TypeError(
              `check-types-mini/checkTypesMini(): [THROW_ID_09] ${resolvedOpts.msg}: ${resolvedOpts.optsVarName}.${
                innerObj.path
              } was customised to ${currentType !== "string" ? '"' : ""}${JSON.stringify(
                current,
                null,
                0,
              )}${currentType !== "string" ? '"' : ""} (type: ${currentType}) which is not among the allowed types in schema (which is equal to ${JSON.stringify(
                currentKeysSchema,
                null,
                0,
              )})`,
            );
          }
        }
      } else {
        DEV &&
          console.log(
            `666 names were blanket: ${JSON.stringify(blanketTypes, null, 4)}`,
          );
        ignoredPathsArr.push(innerObj.path);
        DEV &&
          console.log(
            `671 ${`\u001b[${33}m${`ignoredPathsArr`}\u001b[${39}m`} = ${JSON.stringify(
              ignoredPathsArr,
              null,
              4,
            )}`,
          );
      }
    } else if (ref && isObj(ref) && refHasThisPathDefined) {
      let currentType = typ(current);
      let compareType = typ(compareTo);
      DEV &&
        console.log(
          `\u001b[${31}m${`683 II. matching against ref.`}\u001b[${39}m`,
        );
      DEV &&
        console.log(
          `* 687 ${`\u001b[${33}m${`current`}\u001b[${39}m`} = ${JSON.stringify(
            current,
            null,
            4,
          )} (type ${currentType.toLowerCase()})`,
        );
      DEV &&
        console.log(
          `* 695 ${`\u001b[${33}m${`compareTo`}\u001b[${39}m`} = "${JSON.stringify(
            compareTo,
            null,
            4,
          )}" (type ${compareType.toLowerCase()})`,
        );

      if (
        resolvedOpts.acceptArrays &&
        Array.isArray(current) &&
        !acceptArraysIgnore.includes(key)
      ) {
        DEV && console.log("707 2-1: check accept arrays");
        let compareTypeLower = compareType.toLowerCase();
        let allMatch = current.every(
          (el) => typ(el).toLowerCase() === compareTypeLower,
        );
        if (!allMatch) {
          throw new TypeError(
            `check-types-mini/checkTypesMini(): [THROW_ID_10] ${resolvedOpts.msg}: ${resolvedOpts.optsVarName}.${
              innerObj.path
            } was customised to be array, but not all of its elements are ${compareTypeLower}-type`,
          );
        }
      } else if (currentType !== compareType) {
        DEV && console.log("720 - 2-2: match against ref");
        let currentTypeLower = currentType.toLowerCase();
        throw new TypeError(
          `check-types-mini/checkTypesMini(): [THROW_ID_11] ${resolvedOpts.msg}: ${resolvedOpts.optsVarName}.${
            innerObj.path
          } was customised to ${currentTypeLower === "string" ? "" : '"'}${JSON.stringify(
            current,
            null,
            0,
          )}${currentTypeLower === "string" ? "" : '"'} which is not ${compareType.toLowerCase()} but ${currentTypeLower}`,
        );
      }
    } else {
      DEV && console.log("733 do nothing");
    }

    DEV && console.log(`736 return: ${JSON.stringify(current, null, 4)}`);
    return current;
  });
  DEV &&
    console.log(
      `741 ${`${`\u001b[${32}m${`█`}\u001b[${39}m`} `.repeat(
        39,
      )} TRAVERSAL ENDS\n\n\n`,
    );
}

/**
 * Validate options object
 */
function checkTypesMini(obj: Obj, ref: Obj | null, opts?: Partial<Opts>): void {
  internalApi(obj, ref, opts);
}

export { checkTypesMini, defaults, version };
