import typ from "type-detect";
import pullAll from "lodash.pullall";
import traverse from "ast-monkey-traverse";
import intersection from "lodash.intersection";
import arrayiffyIfString from "arrayiffy-if-string";
import objectPath from "object-path";

// fourth input argument is shielded from an external API:
function checkTypesMini(
  obj,
  ref,
  originalOptions,
  shouldWeCheckTheOpts = true
) {
  console.log(
    "\n███████████████████████████████████████ 016 checkTypesMini() called with arguments:"
  );
  console.log(JSON.stringify([...arguments], null, 4));
  console.log("█████████\n");

  //
  // Functions
  // =========

  function existy(something) {
    return something != null; // deliberate !=
  }
  function isObj(something) {
    return typ(something) === "Object";
  }

  // consumes path like "opts.parent.child" and yields "opts.parent"
  function goUpByOneLevel(path) {
    if (path.includes(".")) {
      const split = path.split(".");
      split.pop();
      return split.join(".");
    }
    return path;
  }

  // Variables
  // =========

  const NAMESFORANYTYPE = [
    "any",
    "anything",
    "every",
    "everything",
    "all",
    "whatever",
    "whatevs"
  ];
  const isArr = Array.isArray;

  if (!existy(obj)) {
    throw new Error(
      "check-types-mini: [THROW_ID_01] First argument is missing!"
    );
  }

  // Prep our own opts
  // =================

  const defaults = {
    ignoreKeys: [],
    acceptArrays: false,
    acceptArraysIgnore: [],
    enforceStrictKeyset: true,
    schema: {},
    msg: "check-types-mini",
    optsVarName: "opts"
  };
  let opts;
  if (existy(originalOptions) && isObj(originalOptions)) {
    opts = Object.assign({}, defaults, originalOptions);
  } else {
    opts = Object.assign({}, defaults);
  }

  if (!existy(opts.ignoreKeys) || !opts.ignoreKeys) {
    opts.ignoreKeys = [];
  } else {
    opts.ignoreKeys = arrayiffyIfString(opts.ignoreKeys);
  }
  if (!existy(opts.acceptArraysIgnore) || !opts.acceptArraysIgnore) {
    opts.acceptArraysIgnore = [];
  } else {
    opts.acceptArraysIgnore = arrayiffyIfString(opts.acceptArraysIgnore);
  }
  opts.msg = typeof opts.msg === "string" ? opts.msg.trim() : opts.msg;
  if (opts.msg[opts.msg.length - 1] === ":") {
    opts.msg = opts.msg.slice(0, opts.msg.length - 1).trim();
  }
  // now, since we let users type the allowed types, we have to normalise the letter case:
  if (opts.schema) {
    Object.keys(opts.schema).forEach(oneKey => {
      if (!isArr(opts.schema[oneKey])) {
        opts.schema[oneKey] = [opts.schema[oneKey]];
      }
      // then turn all keys into strings and trim and lowercase them:
      opts.schema[oneKey] = opts.schema[oneKey]
        .map(String)
        .map(el => el.toLowerCase())
        .map(el => el.trim());
    });
  }

  if (!existy(ref)) {
    ref = {};
  }

  // Recursively check our own opts =)
  // =================================

  // The fourth argument is shielded from outside API, it's instructing not to
  // validate the opts. Otherwise, we would get a recursion. But we know opts
  // are fine anyway when we're calling them internally :)
  if (shouldWeCheckTheOpts) {
    console.log("098 about to call itself recursively:");
    checkTypesMini(opts, defaults, { enforceStrictKeyset: false }, false);
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

  console.log("111");

  if (opts.enforceStrictKeyset) {
    if (existy(opts.schema) && Object.keys(opts.schema).length > 0) {
      if (
        pullAll(
          Object.keys(obj),
          Object.keys(ref).concat(Object.keys(opts.schema))
        ).length !== 0
      ) {
        const keys = pullAll(
          Object.keys(obj),
          Object.keys(ref).concat(Object.keys(opts.schema))
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
      if (pullAll(Object.keys(obj), Object.keys(ref)).length !== 0) {
        const keys = pullAll(Object.keys(obj), Object.keys(ref));
        throw new TypeError(
          `${opts.msg}: The input object has key${
            keys.length > 1 ? "s" : ""
          } that ${
            keys.length > 1 ? "are" : "is"
          } not covered by the reference object: ${keys.join(", ")}`
        );
      } else if (pullAll(Object.keys(ref), Object.keys(obj)).length !== 0) {
        const keys = pullAll(Object.keys(ref), Object.keys(obj));
        throw new TypeError(
          `${opts.msg}: The reference object has key${
            keys.length > 1 ? "s" : ""
          } that ${
            keys.length > 1 ? "are" : "is"
          } not present in the input object: ${keys.join(", ")}`
        );
      }
    } else {
      // it's an error because both schema and reference don't exist
      throw new TypeError(
        `${opts.msg}: Both ${
          opts.optsVarName
        }.schema and reference objects are missing! We don't have anything to match the keys as you requested via opts.enforceStrictKeyset!`
      );
    }
  }

  console.log("184");

  // 2. Call the monkey and traverse the schema object, checking each value-as-object
  // or value-as-array separately, if opts.enforceStrictKeyset is on. Root level
  // was checked in step 1. above. What's left is deeper levels.
  console.log(
    `190 ${`\u001b[${33}m${`obj`}\u001b[${39}m`} = ${JSON.stringify(
      obj,
      null,
      4
    )}`
  );
  traverse(obj, (key, val, innerObj) => {
    // innerObj.path

    // Here what we have been given:
    const current = val !== undefined ? val : key;
    console.log(
      `\n\u001b[${36}m${`${
        innerObj.path
      } ===========================`}\u001b[${39}m ${`\u001b[${33}m${`key`}\u001b[${39}m`} = ${key}; ${`\u001b[${33}m${`val`}\u001b[${39}m`} = ${`\u001b[${35}m${JSON.stringify(
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
      `229 ${`\u001b[${33}m${`opts.schema`}\u001b[${39}m`} = ${JSON.stringify(
        opts.schema,
        null,
        4
      )}`
    );
    console.log("-----");

    // first, check if given path is not covered by neither ref object nor schema:
    if (
      opts.enforceStrictKeyset &&
      (!existy(opts.schema) ||
        !isObj(opts.schema) ||
        (isObj(opts.schema) &&
          (!Object.keys(opts.schema).length ||
            ((!Array.isArray(innerObj.parent) &&
              !Object.prototype.hasOwnProperty.call(
                opts.schema,
                innerObj.path
              )) ||
              (Array.isArray(innerObj.parent) &&
                !objectPath.has(
                  opts.schema,
                  goUpByOneLevel(innerObj.path)
                )))))) &&
      (!existy(ref) ||
        !isObj(ref) ||
        (isObj(ref) &&
          (!Object.keys(ref).length ||
            ((!opts.acceptArrays && !objectPath.has(ref, innerObj.path)) ||
              (opts.acceptArrays &&
                ((!Array.isArray(innerObj.parent) &&
                  !objectPath.has(ref, innerObj.path)) ||
                  (Array.isArray(innerObj.parent) &&
                    !objectPath.has(ref, goUpByOneLevel(innerObj.path)))))))))
    ) {
      console.log(
        `266 ${`\u001b[${33}m${`innerObj.path`}\u001b[${39}m`} = ${JSON.stringify(
          innerObj.path,
          null,
          4
        )}`
      );
      throw new TypeError(
        `${opts.msg}: ${opts.optsVarName}.${
          innerObj.path
        } is neither covered by reference object (second input argument), nor ${
          opts.optsVarName
        }.schema!`
      );
    } else if (
      isObj(opts.schema) &&
      Object.keys(opts.schema).length &&
      Object.prototype.hasOwnProperty.call(opts.schema, innerObj.path) // fancy Object.hasOwnProperty
    ) {
      console.log("284");
      // step 1. Fetch the current keys schema and normalise it - it's an array
      // which holds strings. Those strings have to be lowercased. It also can
      // be raw null/undefined, which would be arrayified and turned into string.
      console.log(
        `289 ${`\u001b[${33}m${`objectPath.get(opts.schema, innerObj.path)`}\u001b[${39}m`} = ${JSON.stringify(
          objectPath.get(opts.schema, innerObj.path),
          null,
          4
        )}`
      );
      const currentKeysSchema = arrayiffyIfString(opts.schema[innerObj.path])
        .map(String)
        .map(el => el.toLowerCase());
      console.log(
        `293 ${`\u001b[${33}m${`currentKeysSchema`}\u001b[${39}m`} = ${JSON.stringify(
          currentKeysSchema,
          null,
          4
        )}`
      );

      objectPath.set(opts.schema, innerObj.path, currentKeysSchema);

      // step 2. First check does our schema contain any blanket names, "any", "whatever" etc.
      if (!intersection(currentKeysSchema, NAMESFORANYTYPE).length) {
        // Because, if not, it means we need to do some work, check types.

        // Beware, Booleans can be allowed blanket, as "boolean", but also,
        // in granular fashion: as just "true" or just "false".

        console.log(
          `316 ${`\u001b[${33}m${`currentKeysSchema`}\u001b[${39}m`} = ${JSON.stringify(
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
          console.log("330 I. matching against schema.");
          // new in v.2.2
          // Check if key's value is array. Then, if it is, check if opts.acceptArrays is on.
          // If it is, then iterate through the array, checking does each value conform to the
          // types listed in that key's schema entry.
          if (isArr(current) && opts.acceptArrays) {
            console.log("336 1-1: check acceptArrays");
            // check each key:
            for (let i = 0, len = current.length; i < len; i++) {
              if (!currentKeysSchema.includes(typ(current[i]).toLowerCase())) {
                throw new TypeError(
                  `${opts.msg}: ${opts.optsVarName}.${key} is of a type ${typ(
                    current[i]
                  ).toLowerCase()}, but only the following are allowed in ${
                    opts.optsVarName
                  }.schema: ${currentKeysSchema}`
                );
              }
            }
          } else {
            console.log("350 1-2: matching against schema");
            // only then do throw...
            throw new TypeError(
              `${opts.msg}: ${opts.optsVarName}.${
                innerObj.path
              } was customised to ${
                typ(current) !== "string" ? '"' : ""
              }${JSON.stringify(current, null, 0)}${
                typ(current) !== "string" ? '"' : ""
              } (${typ(
                current
              ).toLowerCase()}) which is not among the allowed types in schema (${currentKeysSchema.join(
                ", "
              )})`
            );
          }
        }
      }
    } else if (
      existy(ref) &&
      Object.keys(ref).length &&
      objectPath.has(ref, innerObj.path) &&
      typ(current) !== typ(objectPath.get(ref, innerObj.path)) &&
      (!opts.ignoreKeys || !opts.ignoreKeys.includes(key)) &&
      (!opts.ignorePaths || !opts.ignorePaths.includes(innerObj.path))
    ) {
      console.log("376 II. matching against ref.");
      console.log(
        `* 315 ${`\u001b[${33}m${`current`}\u001b[${39}m`} = ${JSON.stringify(
          current,
          null,
          4
        )} (type ${typ(current).toLowerCase()})`
      );
      console.log(
        `* 377 ${`\u001b[${33}m${`objectPath.get(ref, innerObj.path)`}\u001b[${39}m`} = "${JSON.stringify(
          objectPath.get(ref, innerObj.path),
          null,
          4
        )}" (type ${typ(objectPath.get(ref, innerObj.path)).toLowerCase()})`
      );
      const compareTo = objectPath.get(ref, innerObj.path);

      if (
        opts.acceptArrays &&
        isArr(current) &&
        !opts.acceptArraysIgnore.includes(key)
      ) {
        console.log("398 2-1: check accept arrays");
        const allMatch = current.every(
          el => typ(el).toLowerCase() === typ(ref[key]).toLowerCase()
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
      } else {
        console.log("412 - 2-2: match against ref");
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
    }

    console.log(`427 return: ${JSON.stringify(current, null, 4)}`);
    return current;
  });
  console.log("███████████████████████████████████████");
  console.log("████████████████ end ██████████████████");
  console.log("███████████████████████████████████████\n\n\n\n");
}

function externalApi(obj, ref, originalOptions) {
  return checkTypesMini(obj, ref, originalOptions);
}

export default externalApi;
