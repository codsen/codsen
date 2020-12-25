import typ from "type-detect";
import pullAll from "lodash.pullall";
import { traverse } from "ast-monkey-traverse";
import intersection from "lodash.intersection";
import { arrayiffy } from "arrayiffy-if-string";
import objectPath from "object-path";
import matcher from "matcher";

interface UnknownValueObj {
  [key: string]: any;
}

interface Opts {
  ignoreKeys?: string[];
  ignorePaths?: string[];
  acceptArrays?: boolean;
  acceptArraysIgnore?: string | string[];
  enforceStrictKeyset?: boolean;
  schema?: UnknownValueObj;
  msg?: string;
  optsVarName?: string;
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
function internalApi(
  obj: UnknownValueObj,
  ref: UnknownValueObj,
  originalOptions?: Opts
) {
  //
  // Functions
  // =========

  function existy(something: any): boolean {
    return something != null; // deliberate !=
  }

  function isObj(something: any): boolean {
    return typ(something) === "Object";
  }

  function pullAllWithGlob(
    originalInput: string[],
    toBeRemoved: string | string[]
  ) {
    // eslint-disable-next-line no-param-reassign
    toBeRemoved = arrayiffy(toBeRemoved);
    return Array.from(originalInput).filter(
      (originalVal) =>
        !(toBeRemoved as string[]).some((remVal) =>
          matcher.isMatch(originalVal, remVal, {
            caseSensitive: true,
          })
        )
    );
  }
  const hasKey = Object.prototype.hasOwnProperty;

  // Variables
  // =========

  const NAMESFORANYTYPE = [
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
      "check-types-mini: [THROW_ID_01] First argument is missing!"
    );
  }

  // Prep our own opts
  // =================

  const opts = { ...defaults, ...originalOptions };

  if (
    !existy(opts.ignoreKeys) ||
    (typeof opts.ignoreKeys !== "string" && !Array.isArray(opts.ignoreKeys))
  ) {
    opts.ignoreKeys = [];
  } else {
    opts.ignoreKeys = arrayiffy(opts.ignoreKeys);
  }
  if (
    !existy(opts.ignorePaths) ||
    (typeof opts.ignorePaths !== "string" && !Array.isArray(opts.ignorePaths))
  ) {
    opts.ignorePaths = [];
  } else {
    opts.ignorePaths = arrayiffy(opts.ignorePaths);
  }
  if (
    !existy(opts.acceptArraysIgnore) ||
    (typeof opts.acceptArraysIgnore !== "string" &&
      !Array.isArray(opts.acceptArraysIgnore))
  ) {
    opts.acceptArraysIgnore = [];
  } else {
    opts.acceptArraysIgnore = arrayiffy(opts.acceptArraysIgnore);
  }
  opts.msg = `${opts.msg}`.trim();

  if (opts.msg[opts.msg.length - 1] === ":") {
    opts.msg = opts.msg.slice(0, opts.msg.length - 1).trim();
  }
  // now, since we let users type the allowed types, we have to normalise the letter case:
  if (isObj(opts.schema)) {
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
    Object.keys(opts.schema as UnknownValueObj).forEach((oneKey) => {
      if (isObj((opts.schema as UnknownValueObj)[oneKey])) {
        // 1. extract all unique AST branches leading to their tips
        const tempObj: UnknownValueObj = {};
        traverse(
          (opts.schema as UnknownValueObj)[oneKey],
          (key, val, innerObj) => {
            const current = val !== undefined ? val : key;
            console.log(
              `147 ${`\u001b[${33}m${`current`}\u001b[${39}m`} = ${JSON.stringify(
                current,
                null,
                4
              )} at ${innerObj.path}`
            );
            if (!Array.isArray(current) && !isObj(current)) {
              tempObj[`${oneKey}.${innerObj.path}`] = current;
            }
            return current;
          }
        );

        console.log(
          `160 FINAL ${`\u001b[${33}m${`tempObj`}\u001b[${39}m`} = ${JSON.stringify(
            tempObj,
            null,
            4
          )}`
        );

        // 2. delete that key which leads to object:
        delete (opts.schema as UnknownValueObj)[oneKey];

        // 3. merge in all paths-as-keys into schema opts object:
        opts.schema = { ...opts.schema, ...tempObj };

        console.log(
          `174 FINALLY, ${`\u001b[${33}m${`opts.schema`}\u001b[${39}m`} = ${JSON.stringify(
            opts.schema,
            null,
            4
          )}`
        );
      }
    });

    //
    //
    //
    //
    //

    // 2. arrayiffy
    Object.keys(opts.schema as UnknownValueObj).forEach((oneKey) => {
      if (!Array.isArray((opts.schema as UnknownValueObj)[oneKey])) {
        (opts.schema as UnknownValueObj)[oneKey] = [
          (opts.schema as UnknownValueObj)[oneKey],
        ];
      }
      // then turn all keys into strings and trim and lowercase them:
      (opts.schema as UnknownValueObj)[
        oneKey
      ] = (opts.schema as UnknownValueObj)[oneKey].map((el: any) =>
        `${el}`.toLowerCase().trim()
      );
    });
  } else if (opts.schema != null) {
    throw new Error(
      `check-types-mini: opts.schema was customised to ${JSON.stringify(
        opts.schema,
        null,
        0
      )} which is not object but ${typeof opts.schema}`
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

  // Since v.4 we support nested opts. That's AST's. This means, we will have to
  // traverse them somehow up until the last tip of each branch. Luckily, we have
  // tools for traversal - ast-monkey-traverse.

  // 1. The "obj" and "ref" root level keys need separate attention.
  // If keys mismatch, we need to check them separately from traversal.
  // During traversal, we'll check if each value is a plain object/array and
  // match the keysets as well. However, traversal won't "see" root level keys.

  console.log("236");

  if (opts.enforceStrictKeyset) {
    console.log(
      `240 so \u001b[${31}m${`opts.enforceStrictKeyset is ON`}\u001b[${39}m`
    );
    if (
      existy(opts.schema) &&
      Object.keys(opts.schema as UnknownValueObj).length > 0
    ) {
      if (
        pullAllWithGlob(
          pullAll(
            Object.keys(obj),
            Object.keys(ref).concat(Object.keys(opts.schema as UnknownValueObj))
          ),
          opts.ignoreKeys as string[]
        ).length
      ) {
        console.log("271");
        const keys = pullAll(
          Object.keys(obj),
          Object.keys(ref).concat(Object.keys(opts.schema as UnknownValueObj))
        );
        throw new TypeError(
          `${opts.msg}: ${
            opts.optsVarName
          }.enforceStrictKeyset is on and the following key${
            keys.length > 1 ? "s" : ""
          } ${
            keys.length > 1 ? "are" : "is"
          } not covered by schema and/or reference objects: ${keys.join(", ")}`
        );
      }
    } else if (existy(ref) && Object.keys(ref).length > 0) {
      if (
        pullAllWithGlob(
          pullAll(Object.keys(obj), Object.keys(ref)),
          opts.ignoreKeys as string[]
        ).length !== 0
      ) {
        const keys = pullAll(Object.keys(obj), Object.keys(ref));
        throw new TypeError(
          `${opts.msg}: The input object has key${
            keys.length > 1 ? "s" : ""
          } which ${
            keys.length > 1 ? "are" : "is"
          } not covered by the reference object: ${keys.join(", ")}`
        );
      } else if (
        pullAllWithGlob(
          pullAll(Object.keys(ref), Object.keys(obj)),
          opts.ignoreKeys as string[]
        ).length !== 0
      ) {
        const keys = pullAll(Object.keys(ref), Object.keys(obj));
        throw new TypeError(
          `${opts.msg}: The reference object has key${
            keys.length > 1 ? "s" : ""
          } which ${
            keys.length > 1 ? "are" : "is"
          } not present in the input object: ${keys.join(", ")}`
        );
      }
    } else {
      // it's an error because both schema and reference don't exist
      throw new TypeError(
        `${opts.msg}: Both ${opts.optsVarName}.schema and reference objects are missing! We don't have anything to match the keys as you requested via opts.enforceStrictKeyset!`
      );
    }
  }

  console.log("305:");

  // 2. Call the monkey and traverse the schema object, checking each value-as-object
  // or value-as-array separately, if opts.enforceStrictKeyset is on. Root level
  // was checked in step 1. above. What's left is deeper levels.
  console.log(
    `317 ${`\u001b[${33}m${`LET'S CHECK obj`}\u001b[${39}m`} = ${JSON.stringify(
      obj,
      null,
      4
    )}`
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

  const ignoredPathsArr: string[] = [];

  console.log(`351 TRAVERSAL STARTS`);
  traverse(obj, (key, val, innerObj) => {
    // innerObj.path
    console.log(`\n${`${`\u001b[${32}m${`█`}\u001b[${39}m`} `.repeat(39)}\n`);
    // Here what we have been given:
    let current = val;
    let objKey: any = key;
    if (innerObj.parentType === "array") {
      objKey = undefined;
      current = key;
    }
    console.log(
      `363 \u001b[${36}m${`traversing: ██ ${innerObj.path} ██ ===========================`}\u001b[${39}m ${`\u001b[${33}m${`key`}\u001b[${39}m`} = ${key}; ${`\u001b[${33}m${`val`}\u001b[${39}m`} = ${`\u001b[${35}m${JSON.stringify(
        val,
        null,
        0
      )}\u001b[${39}m`}; ${`\u001b[${33}m${`current`}\u001b[${39}m`} = ${JSON.stringify(
        current,
        null,
        4
      )}`
    );

    // Here's what we will compare against to.
    // If schema exists, types defined there will be used to compare against:

    console.log(
      `378 ${`\u001b[${33}m${`opts.schema`}\u001b[${39}m`} = ${JSON.stringify(
        opts.schema,
        null,
        4
      )}`
    );
    console.log(
      `385 currently, ${`\u001b[${33}m${`ignoredPathsArr`}\u001b[${39}m`} = ${JSON.stringify(
        ignoredPathsArr,
        null,
        4
      )}`
    );

    // if current path is a children of any paths in "ignoredPathsArr", skip it:
    if (
      Array.isArray(ignoredPathsArr) &&
      ignoredPathsArr.length &&
      ignoredPathsArr.some((path) => innerObj.path.startsWith(path))
    ) {
      console.log(
        `399 \u001b[${32}m${`SKIP THIS PATH BECAUSE IT'S A CHILD OF IGNORED PATH`}\u001b[${39}m`
      );
      return current;
    }

    // if this key is ignored, skip it:
    if (
      objKey &&
      (opts.ignoreKeys as string[]).some((oneOfKeysToIgnore) =>
        matcher.isMatch(objKey, oneOfKeysToIgnore)
      )
    ) {
      console.log(
        `412 \u001b[${32}m${`SKIP THIS PATH BECAUSE ITS KEY (${objKey}), IS AMONG IGNORED (${JSON.stringify(
          opts.ignoreKeys,
          null,
          4
        )})`}\u001b[${39}m`
      );
      return current;
    }
    console.log(
      `421 key "${objKey}" was not skipped because it was not matcher-matched against ${JSON.stringify(
        opts.ignoreKeys,
        null,
        4
      )}`
    );

    // if this path is ignored, skip it:
    if (
      (opts.ignorePaths as string[]).some((oneOfPathsToIgnore) =>
        matcher.isMatch(innerObj.path, oneOfPathsToIgnore)
      )
    ) {
      console.log(
        `435 \u001b[${32}m${`SKIP THIS PATH BECAUSE IT (${
          innerObj.path
        }), IS AMONG IGNORED (${JSON.stringify(
          opts.ignorePaths,
          null,
          4
        )})`}\u001b[${39}m`
      );
      return current;
    }
    console.log(
      `446 path was not skipped because ${
        innerObj.path
      } was not matcher-matched against ${JSON.stringify(
        opts.ignorePaths,
        null,
        4
      )}`
    );

    const isNotAnArrayChild = !(
      !isObj(current) &&
      !Array.isArray(current) &&
      Array.isArray(innerObj.parent)
    );

    // ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  █
    console.log(
      `463: \n${`${`${`\u001b[${33}m${`██`}\u001b[${39}m`}${`\u001b[${31}m${`██`}\u001b[${39}m`}`}`.repeat(
        10
      )}\n`
    );
    console.log(
      `${`\u001b[${33}m${`ref`}\u001b[${39}m`} = ${JSON.stringify(
        ref,
        null,
        4
      )}`
    );
    console.log(
      `${`\u001b[${33}m${`objKey`}\u001b[${39}m`} = ${JSON.stringify(
        objKey,
        null,
        4
      )}`
    );
    console.log(
      `${`\u001b[${33}m${`current`}\u001b[${39}m`} = ${JSON.stringify(
        current,
        null,
        4
      )}`
    );
    console.log(
      `${`\u001b[${33}m${`innerObj`}\u001b[${39}m`} = ${JSON.stringify(
        innerObj,
        null,
        4
      )}`
    );
    console.log(
      `${`\u001b[${33}m${`isNotAnArrayChild`}\u001b[${39}m`} = ${JSON.stringify(
        isNotAnArrayChild,
        null,
        4
      )}`
    );
    console.log(
      `${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
        opts,
        null,
        4
      )}`
    );

    let optsSchemaHasThisPathDefined = false;
    if (isObj(opts.schema) && hasKey.call(opts.schema, innerObj.path)) {
      optsSchemaHasThisPathDefined = true;
    }
    console.log(
      `510 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`optsSchemaHasThisPathDefined`}\u001b[${39}m`} = ${JSON.stringify(
        optsSchemaHasThisPathDefined,
        null,
        4
      )}`
    );

    let refHasThisPathDefined = false;
    if (isObj(ref) && objectPath.has(ref, innerObj.path)) {
      refHasThisPathDefined = true;
    }
    console.log(
      `528 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`refHasThisPathDefined`}\u001b[${39}m`} = ${JSON.stringify(
        refHasThisPathDefined,
        null,
        4
      )}`
    );

    console.log(
      `\n${`${`${`\u001b[${33}m${`██`}\u001b[${39}m`}${`\u001b[${31}m${`██`}\u001b[${39}m`}`}`.repeat(
        10
      )}\n`
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
      opts.enforceStrictKeyset &&
      isNotAnArrayChild &&
      !optsSchemaHasThisPathDefined &&
      !refHasThisPathDefined
    ) {
      console.log(
        `\u001b[${31}m${`565 0. nothing to match against.`}\u001b[${39}m`
      );
      throw new TypeError(
        `${opts.msg}: ${opts.optsVarName}.${
          innerObj.path
        } is neither covered by reference object (second input argument), nor ${
          opts.optsVarName
        }.schema! To stop this error, turn off ${
          opts.optsVarName
        }.enforceStrictKeyset or provide some type reference (2nd argument or ${
          opts.optsVarName
        }.schema).\n\nDebug info:\n
obj = ${JSON.stringify(obj, null, 4)}\n
ref = ${JSON.stringify(ref, null, 4)}\n
innerObj = ${JSON.stringify(innerObj, null, 4)}\n
opts = ${JSON.stringify(opts, null, 4)}\n
current = ${JSON.stringify(current, null, 4)}\n\n`
      );
    } else if (optsSchemaHasThisPathDefined) {
      console.log(
        `\u001b[${31}m${`585 I. matching against schema.`}\u001b[${39}m`
      );
      // step 1. Fetch the current keys' schema and normalise it - it's an array
      // which holds strings. Those strings have to be lowercased. It also can
      // be raw null/undefined, which would be arrayified and turned into string.
      console.log(
        `592 ${`\u001b[${33}m${`objectPath.get(opts.schema, innerObj.path)`}\u001b[${39}m`} = ${JSON.stringify(
          objectPath.get(opts.schema as UnknownValueObj, innerObj.path),
          null,
          4
        )}`
      );
      const currentKeysSchema = arrayiffy(
        (opts.schema as UnknownValueObj)[innerObj.path]
      ).map((el: any) => `${el}`.toLowerCase());
      console.log(
        `602 ${`\u001b[${33}m${`currentKeysSchema`}\u001b[${39}m`} = ${JSON.stringify(
          currentKeysSchema,
          null,
          4
        )}`
      );

      objectPath.set(
        opts.schema as UnknownValueObj,
        innerObj.path,
        currentKeysSchema
      );

      // step 2. First check does our schema contain any blanket names, "any", "whatever" etc.
      if (!intersection(currentKeysSchema, NAMESFORANYTYPE).length) {
        // Because, if not, it means we need to do some work, check types.

        // Beware, Booleans can be allowed blanket, as "boolean", but also,
        // in granular fashion: as just "true" or just "false".

        console.log(
          `619 ${`\u001b[${33}m${`currentKeysSchema`}\u001b[${39}m`} = ${JSON.stringify(
            currentKeysSchema,
            null,
            4
          )}`
        );
        if (
          (current !== true &&
            current !== false &&
            !currentKeysSchema.includes(typ(current).toLowerCase())) ||
          ((current === true || current === false) &&
            !currentKeysSchema.includes(String(current)) &&
            !currentKeysSchema.includes("boolean"))
        ) {
          console.log("633 I. matching against schema.");
          // new in v.2.2
          // Check if key's value is array. Then, if it is, check if opts.acceptArrays is on.
          // If it is, then iterate through the array, checking does each value conform to the
          // types listed in that key's schema entry.
          if (Array.isArray(current) && opts.acceptArrays) {
            console.log("639 1-1: check acceptArrays");
            // check each key:
            for (let i = 0, len = current.length; i < len; i++) {
              if (!currentKeysSchema.includes(typ(current[i]).toLowerCase())) {
                throw new TypeError(
                  `${opts.msg}: ${opts.optsVarName}.${
                    innerObj.path
                  }.${i}, the ${i}th element (equal to ${JSON.stringify(
                    current[i],
                    null,
                    0
                  )}) is of a type ${typ(
                    current[i]
                  ).toLowerCase()}, but only the following are allowed by the ${
                    opts.optsVarName
                  }.schema: ${currentKeysSchema.join(", ")}`
                );
              }
            }
          } else {
            console.log("659 1-2: matching against schema");
            // only then do throw...
            throw new TypeError(
              `${opts.msg}: ${opts.optsVarName}.${
                innerObj.path
              } was customised to ${
                typ(current) !== "string" ? '"' : ""
              }${JSON.stringify(current, null, 0)}${
                typ(current) !== "string" ? '"' : ""
              } (type: ${typ(
                current
              ).toLowerCase()}) which is not among the allowed types in schema (which is equal to ${JSON.stringify(
                currentKeysSchema,
                null,
                0
              )})`
            );
          }
        }
      } else {
        console.log(
          `680 names were blanket: ${JSON.stringify(
            intersection(currentKeysSchema, NAMESFORANYTYPE),
            null,
            4
          )}`
        );
        ignoredPathsArr.push(innerObj.path);
        console.log(
          `688 ${`\u001b[${33}m${`ignoredPathsArr`}\u001b[${39}m`} = ${JSON.stringify(
            ignoredPathsArr,
            null,
            4
          )}`
        );
      }
    } else if (refHasThisPathDefined) {
      console.log(
        `\u001b[${31}m${`696 II. matching against ref.`}\u001b[${39}m`
      );
      console.log(
        `* 699 ${`\u001b[${33}m${`current`}\u001b[${39}m`} = ${JSON.stringify(
          current,
          null,
          4
        )} (type ${typ(current).toLowerCase()})`
      );
      console.log(
        `* 706 ${`\u001b[${33}m${`objectPath.get(ref, innerObj.path)`}\u001b[${39}m`} = "${JSON.stringify(
          objectPath.get(ref, innerObj.path),
          null,
          4
        )}" (type ${typ(objectPath.get(ref, innerObj.path)).toLowerCase()})`
      );
      const compareTo = objectPath.get(ref, innerObj.path);

      if (
        opts.acceptArrays &&
        Array.isArray(current) &&
        !(opts.acceptArraysIgnore as string[]).includes(key)
      ) {
        console.log("720 2-1: check accept arrays");
        const allMatch = current.every(
          (el) => typ(el).toLowerCase() === typ(ref[key]).toLowerCase()
        );
        if (!allMatch) {
          throw new TypeError(
            `${opts.msg}: ${opts.optsVarName}.${
              innerObj.path
            } was customised to be array, but not all of its elements are ${typ(
              ref[key]
            ).toLowerCase()}-type`
          );
        }
      } else if (typ(current) !== typ(compareTo)) {
        console.log("734 - 2-2: match against ref");
        throw new TypeError(
          `${opts.msg}: ${opts.optsVarName}.${
            innerObj.path
          } was customised to ${
            typ(current).toLowerCase() === "string" ? "" : '"'
          }${JSON.stringify(current, null, 0)}${
            typ(current).toLowerCase() === "string" ? "" : '"'
          } which is not ${typ(compareTo).toLowerCase()} but ${typ(
            current
          ).toLowerCase()}`
        );
      }
    } else {
      console.log("748 do nothing");
    }

    console.log(`751 return: ${JSON.stringify(current, null, 4)}`);
    return current;
  });
  console.log(
    `755 ${`${`\u001b[${32}m${`█`}\u001b[${39}m`} `.repeat(
      39
    )} TRAVERSAL ENDS\n\n\n`
  );
}

function checkTypesMini(
  obj: UnknownValueObj,
  ref: UnknownValueObj,
  originalOptions?: Opts
): void {
  return internalApi(obj, ref, originalOptions);
}

export { checkTypesMini };
