import typ from "type-detect";
import { traverse } from "ast-monkey-traverse";
import { arrayiffy } from "arrayiffy-if-string";
import objectPath from "object-path";
import { isMatch } from "matcher";
import { isPlainObject as isObj, pullAll, intersection } from "codsen-utils";

import { version as v } from "../package.json";

const version: string = v;
declare let DEV: boolean;

interface Obj {
  [key: string]: any;
}

interface Opts {
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

// fourth input argument is shielded from an external API:
function internalApi(obj: Obj, ref: Obj | null, opts?: Partial<Opts>): void {
  //
  // Functions
  // =========

  function existy(something: unknown): boolean {
    return something != null; // deliberate !=
  }

  function pullAllWithGlob(
    originalInput: string[],
    toBeRemoved: string | string[],
  ): string[] {
    if (typeof toBeRemoved === "string") {
      toBeRemoved = arrayiffy(toBeRemoved);
    }
    return Array.from(originalInput).filter(
      (originalVal) =>
        !toBeRemoved.some((remVal) =>
          isMatch(originalVal, remVal, {
            caseSensitive: true,
          }),
        ),
    );
  }
  let hasKey = Object.prototype.hasOwnProperty;

  // Variables
  // =========

  let NAMESFORANYTYPE = [
    "any",
    "anything",
    "every",
    "everything",
    "all",
    "whatever",
    "whatevs",
  ];
  if (!existy(obj)) {
    throw new Error(
      "check-types-mini: [THROW_ID_01] First argument is missing!",
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
    Object.keys(resolvedOpts.schema).forEach((oneKey) => {
      if (isObj(resolvedOpts.schema[oneKey])) {
        // 1. extract all unique AST branches leading to their tips
        let tempObj: Obj = {};
        traverse(resolvedOpts.schema[oneKey], (key, val, innerObj) => {
          let current = val !== undefined ? val : key;
          DEV &&
            console.log(
              `134 ${`\u001b[${33}m${`current`}\u001b[${39}m`} = ${JSON.stringify(
                current,
                null,
                4,
              )} at ${innerObj.path}`,
            );
          if (!Array.isArray(current) && !isObj(current)) {
            tempObj[`${oneKey}.${innerObj.path}`] = current;
          }
          return current;
        });

        DEV &&
          console.log(
            `148 FINAL ${`\u001b[${33}m${`tempObj`}\u001b[${39}m`} = ${JSON.stringify(
              tempObj,
              null,
              4,
            )}`,
          );

        // 2. delete that key which leads to object:
        delete resolvedOpts.schema[oneKey];

        // 3. merge in all paths-as-keys into schema resolvedOpts object:
        resolvedOpts.schema = { ...resolvedOpts.schema, ...tempObj };

        DEV &&
          console.log(
            `163 FINALLY, ${`\u001b[${33}m${`resolvedOpts.schema`}\u001b[${39}m`} = ${JSON.stringify(
              resolvedOpts.schema,
              null,
              4,
            )}`,
          );
      }
    });

    //
    //
    //
    //
    //

    // 2. arrayiffy
    Object.keys(resolvedOpts.schema).forEach((oneKey) => {
      if (!Array.isArray(resolvedOpts.schema[oneKey])) {
        resolvedOpts.schema[oneKey] = [resolvedOpts.schema[oneKey]];
      }
      // then turn all keys into strings and trim and lowercase them:
      resolvedOpts.schema[oneKey] = resolvedOpts.schema[oneKey].map(
        (el: unknown) => `${el}`.toLowerCase().trim(),
      );
    });
  } else if (resolvedOpts.schema != null) {
    throw new Error(
      `check-types-mini: opts.schema was customised to ${JSON.stringify(
        resolvedOpts.schema,
        null,
        0,
      )} which is not object but ${typeof resolvedOpts.schema}`,
    );
  }

  if (!existy(ref)) {
    // eslint-disable-next-line no-param-reassign
    ref = {};
  }

  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------

  // THE BUSINESS
  // ============

  // Since v.4 we support nested resolvedOpts. That's AST's. This means, we will have to
  // traverse them somehow up until the last tip of each branch. Luckily, we have
  // tools for traversal - ast-monkey-traverse.

  // 1. The "obj" and "ref" root level keys need separate attention.
  // If keys mismatch, we need to check them separately from traversal.
  // During traversal, we'll check if each value is a plain object/array and
  // match the keysets as well. However, traversal won't "see" root level keys.

  DEV && console.log("219");

  if (resolvedOpts.enforceStrictKeyset) {
    DEV &&
      console.log(
        `224 so \u001b[${31}m${`resolvedOpts.enforceStrictKeyset is ON`}\u001b[${39}m`,
      );
    if (
      existy(resolvedOpts.schema) &&
      Object.keys(resolvedOpts.schema).length
    ) {
      if (
        ref &&
        pullAllWithGlob(
          pullAll(
            Object.keys(obj),
            Object.keys(ref).concat(Object.keys(resolvedOpts.schema)),
          ),
          resolvedOpts.ignoreKeys,
        ).length
      ) {
        DEV && console.log("240");
        let keys = pullAll(
          Object.keys(obj),
          Object.keys(ref).concat(Object.keys(resolvedOpts.schema)),
        );
        throw new TypeError(
          `${resolvedOpts.msg}: ${
            resolvedOpts.optsVarName
          }.enforceStrictKeyset is on and the following key${
            keys.length > 1 ? "s" : ""
          } ${
            keys.length > 1 ? "are" : "is"
          } not covered by schema and/or reference objects: ${keys.join(", ")}`,
        );
      }
    } else if (isObj(ref) && Object.keys(ref as Obj).length) {
      if (
        pullAllWithGlob(
          pullAll(Object.keys(obj), Object.keys(ref as Obj)),
          resolvedOpts.ignoreKeys,
        ).length !== 0
      ) {
        let keys = pullAll(Object.keys(obj), Object.keys(ref as Obj));
        throw new TypeError(
          `${resolvedOpts.msg}: The input object has key${
            keys.length > 1 ? "s" : ""
          } which ${
            keys.length > 1 ? "are" : "is"
          } not covered by the reference object: ${keys.join(", ")}`,
        );
      } else if (
        pullAllWithGlob(
          pullAll(Object.keys(ref as Obj), Object.keys(obj)),
          resolvedOpts.ignoreKeys,
        ).length !== 0
      ) {
        let keys = pullAll(Object.keys(ref as Obj), Object.keys(obj));
        throw new TypeError(
          `${resolvedOpts.msg}: The reference object has key${
            keys.length > 1 ? "s" : ""
          } which ${
            keys.length > 1 ? "are" : "is"
          } not present in the input object: ${keys.join(", ")}`,
        );
      }
    } else {
      // it's an error because both schema and reference don't exist
      throw new TypeError(
        `${resolvedOpts.msg}: Both ${resolvedOpts.optsVarName}.schema and reference objects are missing! We don't have anything to match the keys as you requested via resolvedOpts.enforceStrictKeyset!`,
      );
    }
  }

  DEV && console.log("293:");

  // 2. Call the monkey and traverse the schema object, checking each value-as-object
  // or value-as-array separately, if resolvedOpts.enforceStrictKeyset is on. Root level
  // was checked in step 1. above. What's left is deeper levels.
  DEV &&
    console.log(
      `300 ${`\u001b[${33}m${`LET'S CHECK obj`}\u001b[${39}m`} = ${JSON.stringify(
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

  // ast-monkey-traverse will check "a" and find it's schema is "any" - basically,
  // we don't care what it's type is and instruct "check-types-mini" to skip it.
  // This "skip" instruction applies to "b" too! However, our checking engine,
  // "ast-monkey-traverse" will still traverse "b". It can't stop there, because
  // there's still "d" key to check - we're traversing EVERYTHING.
  // Challenge: when "ast-monkey" will stumble upon "b" it might flag it up as
  // being of a wrong type, it does not have visibility of its parent's schemas.
  // What we'll do to fix this is we'll compile the list of any paths that have
  // "any"/"whatever" schemas in an array. Then, when deeper children nodes are
  // traversed, we'll check, are they children of any aforementioned paths (technically
  // speaking, do their path strings start with any of the strings in aforementioned
  // paths array strings).

  let ignoredPathsArr: string[] = [];

  DEV && console.log(`334 TRAVERSAL STARTS`);
  traverse(obj, (key, val, innerObj) => {
    // innerObj.path
    DEV &&
      console.log(`\n${`${`\u001b[${32}m${`█`}\u001b[${39}m`} `.repeat(39)}\n`);
    // Here what we have been given:
    let current = val;
    let objKey: string | undefined = key;
    if (innerObj.parentType === "array") {
      objKey = undefined;
      current = key;
    }
    DEV &&
      console.log(
        `348 \u001b[${36}m${`traversing: ██ ${innerObj.path} ██ ===========================`}\u001b[${39}m ${`\u001b[${33}m${`key`}\u001b[${39}m`} = ${key}; ${`\u001b[${33}m${`val`}\u001b[${39}m`} = ${`\u001b[${35}m${JSON.stringify(
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
        `364 ${`\u001b[${33}m${`resolvedOpts.schema`}\u001b[${39}m`} = ${JSON.stringify(
          resolvedOpts.schema,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `372 currently, ${`\u001b[${33}m${`ignoredPathsArr`}\u001b[${39}m`} = ${JSON.stringify(
          ignoredPathsArr,
          null,
          4,
        )}`,
      );

    // if current path is a children of any paths in "ignoredPathsArr", skip it:
    if (
      Array.isArray(ignoredPathsArr) &&
      ignoredPathsArr.length &&
      ignoredPathsArr.some((path) => innerObj.path.startsWith(path))
    ) {
      DEV &&
        console.log(
          `387 \u001b[${32}m${`SKIP THIS PATH BECAUSE IT'S A CHILD OF IGNORED PATH`}\u001b[${39}m`,
        );
      return current;
    }

    // if this key is ignored, skip it:
    if (
      objKey &&
      (resolvedOpts.ignoreKeys as string[]).some(
        (oneOfKeysToIgnore) => objKey && isMatch(objKey, oneOfKeysToIgnore),
      )
    ) {
      DEV &&
        console.log(
          `401 \u001b[${32}m${`SKIP THIS PATH BECAUSE ITS KEY (${objKey}), IS AMONG IGNORED (${JSON.stringify(
            resolvedOpts.ignoreKeys,
            null,
            4,
          )})`}\u001b[${39}m`,
        );
      return current;
    }
    DEV &&
      console.log(
        `411 key "${objKey}" was not skipped because it was not matcher-matched against ${JSON.stringify(
          resolvedOpts.ignoreKeys,
          null,
          4,
        )}`,
      );

    // if this path is ignored, skip it:
    if (
      (resolvedOpts.ignorePaths as string[]).some((oneOfPathsToIgnore) =>
        isMatch(innerObj.path, oneOfPathsToIgnore),
      )
    ) {
      DEV &&
        console.log(
          `426 \u001b[${32}m${`SKIP THIS PATH BECAUSE IT (${
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
        `438 path was not skipped because ${
          innerObj.path
        } was not matcher-matched against ${JSON.stringify(
          resolvedOpts.ignorePaths,
          null,
          4,
        )}`,
      );

    let isNotAnArrayChild = !(
      !isObj(current) &&
      !Array.isArray(current) &&
      Array.isArray(innerObj.parent)
    );

    // ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  █
    DEV &&
      console.log(
        `456: \n${`${`${`\u001b[${33}m${`██`}\u001b[${39}m`}${`\u001b[${31}m${`██`}\u001b[${39}m`}`}`.repeat(
          10,
        )}\n`,
      );
    DEV &&
      console.log(
        `${`\u001b[${33}m${`ref`}\u001b[${39}m`} = ${JSON.stringify(
          ref,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${33}m${`objKey`}\u001b[${39}m`} = ${JSON.stringify(
          objKey,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${33}m${`current`}\u001b[${39}m`} = ${JSON.stringify(
          current,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${33}m${`innerObj`}\u001b[${39}m`} = ${JSON.stringify(
          innerObj,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${33}m${`isNotAnArrayChild`}\u001b[${39}m`} = ${JSON.stringify(
          isNotAnArrayChild,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
          resolvedOpts,
          null,
          4,
        )}`,
      );

    let optsSchemaHasThisPathDefined = false;
    if (
      isObj(resolvedOpts.schema) &&
      hasKey.call(resolvedOpts.schema, innerObj.path)
    ) {
      optsSchemaHasThisPathDefined = true;
    }
    DEV &&
      console.log(
        `518 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`optsSchemaHasThisPathDefined`}\u001b[${39}m`} = ${JSON.stringify(
          optsSchemaHasThisPathDefined,
          null,
          4,
        )}`,
      );

    let refHasThisPathDefined = false;
    if (isObj(ref) && objectPath.has(ref as Obj, innerObj.path)) {
      refHasThisPathDefined = true;
    }
    DEV &&
      console.log(
        `531 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`refHasThisPathDefined`}\u001b[${39}m`} = ${JSON.stringify(
          refHasThisPathDefined,
          null,
          4,
        )}`,
      );

    DEV &&
      console.log(
        `\n${`${`${`\u001b[${33}m${`██`}\u001b[${39}m`}${`\u001b[${31}m${`██`}\u001b[${39}m`}`}`.repeat(
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
          `\u001b[${31}m${`565 0. nothing to match against.`}\u001b[${39}m`,
        );
      throw new TypeError(
        `${resolvedOpts.msg}: ${resolvedOpts.optsVarName}.${
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
          `\u001b[${31}m${`585 I. matching against schema.`}\u001b[${39}m`,
        );
      // step 1. Fetch the current keys' schema and normalise it - it's an array
      // which holds strings. Those strings have to be lowercased. It also can
      // be raw null/undefined, which would be arrayified and turned into string.
      DEV &&
        console.log(
          `589 ${`\u001b[${33}m${`objectPath.get(resolvedOpts.schema, innerObj.path)`}\u001b[${39}m`} = ${JSON.stringify(
            objectPath.get(resolvedOpts.schema, innerObj.path),
            null,
            4,
          )}`,
        );
      let currentKeysSchema = arrayiffy(resolvedOpts.schema[innerObj.path]).map(
        (el: unknown) => `${el}`.toLowerCase(),
      );
      DEV &&
        console.log(
          `600 ${`\u001b[${33}m${`currentKeysSchema`}\u001b[${39}m`} = ${JSON.stringify(
            currentKeysSchema,
            null,
            4,
          )}`,
        );

      objectPath.set(resolvedOpts.schema, innerObj.path, currentKeysSchema);

      // step 2. First check does our schema contain any blanket names, "any", "whatever" etc.
      if (!intersection(currentKeysSchema, NAMESFORANYTYPE).length) {
        // Because, if not, it means we need to do some work, check types.

        // Beware, Booleans can be allowed blanket, as "boolean", but also,
        // in granular fashion: as just "true" or just "false".

        DEV &&
          console.log(
            `618 ${`\u001b[${33}m${`currentKeysSchema`}\u001b[${39}m`} = ${JSON.stringify(
              currentKeysSchema,
              null,
              4,
            )}`,
          );
        if (
          (current !== true &&
            current !== false &&
            !currentKeysSchema.includes(typ(current).toLowerCase())) ||
          ((current === true || current === false) &&
            !currentKeysSchema.includes(String(current)) &&
            !currentKeysSchema.includes("boolean"))
        ) {
          DEV && console.log("632 I. matching against schema.");
          // new in v.2.2
          // Check if key's value is array. Then, if it is, check if resolvedOpts.acceptArrays is on.
          // If it is, then iterate through the array, checking does each value conform to the
          // types listed in that key's schema entry.
          if (Array.isArray(current) && resolvedOpts.acceptArrays) {
            DEV && console.log("638 1-1: check acceptArrays");
            // check each key:
            for (let i = 0, len = current.length; i < len; i++) {
              if (!currentKeysSchema.includes(typ(current[i]).toLowerCase())) {
                throw new TypeError(
                  `${resolvedOpts.msg}: ${resolvedOpts.optsVarName}.${
                    innerObj.path
                  }.${i}, the ${i}th element (equal to ${JSON.stringify(
                    current[i],
                    null,
                    0,
                  )}) is of a type ${typ(
                    current[i],
                  ).toLowerCase()}, but only the following are allowed by the ${
                    resolvedOpts.optsVarName
                  }.schema: ${currentKeysSchema.join(", ")}`,
                );
              }
            }
          } else {
            DEV && console.log("658 1-2: matching against schema");
            // only then do throw...
            throw new TypeError(
              `${resolvedOpts.msg}: ${resolvedOpts.optsVarName}.${
                innerObj.path
              } was customised to ${
                typ(current) !== "string" ? '"' : ""
              }${JSON.stringify(current, null, 0)}${
                typ(current) !== "string" ? '"' : ""
              } (type: ${typ(
                current,
              ).toLowerCase()}) which is not among the allowed types in schema (which is equal to ${JSON.stringify(
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
            `680 names were blanket: ${JSON.stringify(
              intersection(currentKeysSchema, NAMESFORANYTYPE),
              null,
              4,
            )}`,
          );
        ignoredPathsArr.push(innerObj.path);
        DEV &&
          console.log(
            `689 ${`\u001b[${33}m${`ignoredPathsArr`}\u001b[${39}m`} = ${JSON.stringify(
              ignoredPathsArr,
              null,
              4,
            )}`,
          );
      }
    } else if (ref && isObj(ref) && refHasThisPathDefined) {
      DEV &&
        console.log(
          `\u001b[${31}m${`696 II. matching against ref.`}\u001b[${39}m`,
        );
      DEV &&
        console.log(
          `* 699 ${`\u001b[${33}m${`current`}\u001b[${39}m`} = ${JSON.stringify(
            current,
            null,
            4,
          )} (type ${typ(current).toLowerCase()})`,
        );
      DEV &&
        console.log(
          `* 706 ${`\u001b[${33}m${`objectPath.get(ref, innerObj.path)`}\u001b[${39}m`} = "${JSON.stringify(
            objectPath.get(ref, innerObj.path),
            null,
            4,
          )}" (type ${typ(objectPath.get(ref, innerObj.path)).toLowerCase()})`,
        );
      let compareTo = objectPath.get(ref, innerObj.path);

      if (
        resolvedOpts.acceptArrays &&
        Array.isArray(current) &&
        !(resolvedOpts.acceptArraysIgnore as string[]).includes(key)
      ) {
        DEV && console.log("724 2-1: check accept arrays");
        let allMatch = current.every(
          (el) =>
            typ(el).toLowerCase() === typ((ref as Obj)[key]).toLowerCase(),
        );
        if (!allMatch) {
          throw new TypeError(
            `${resolvedOpts.msg}: ${resolvedOpts.optsVarName}.${
              innerObj.path
            } was customised to be array, but not all of its elements are ${typ(
              ref[key],
            ).toLowerCase()}-type`,
          );
        }
      } else if (typ(current) !== typ(compareTo)) {
        DEV && console.log("739 - 2-2: match against ref");
        throw new TypeError(
          `${resolvedOpts.msg}: ${resolvedOpts.optsVarName}.${
            innerObj.path
          } was customised to ${
            typ(current).toLowerCase() === "string" ? "" : '"'
          }${JSON.stringify(current, null, 0)}${
            typ(current).toLowerCase() === "string" ? "" : '"'
          } which is not ${typ(compareTo).toLowerCase()} but ${typ(
            current,
          ).toLowerCase()}`,
        );
      }
    } else {
      DEV && console.log("753 do nothing");
    }

    DEV && console.log(`756 return: ${JSON.stringify(current, null, 4)}`);
    return current;
  });
  DEV &&
    console.log(
      `761 ${`${`\u001b[${32}m${`█`}\u001b[${39}m`} `.repeat(
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
