import typ from 'type-detect';
import pullAll from 'lodash.pullall';
import traverse from 'ast-monkey-traverse';
import intersection from 'lodash.intersection';
import arrayiffyIfString from 'arrayiffy-if-string';
import objectPath from 'object-path';

function checkTypesMini(
  obj,
  ref,
  originalOptions,
  shouldWeCheckTheOpts = true
) {
  function existy(something) {
    return something != null;
  }
  function isObj(something) {
    return typ(something) === "Object";
  }
  function goUpByOneLevel(path) {
    if (path.includes(".")) {
      const split = path.split(".");
      split.pop();
      return split.join(".");
    }
    return path;
  }
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
  if (opts.schema) {
    Object.keys(opts.schema).forEach(oneKey => {
      if (!isArr(opts.schema[oneKey])) {
        opts.schema[oneKey] = [opts.schema[oneKey]];
      }
      opts.schema[oneKey] = opts.schema[oneKey]
        .map(String)
        .map(el => el.toLowerCase())
        .map(el => el.trim());
    });
  }
  if (!existy(ref)) {
    ref = {};
  }
  if (shouldWeCheckTheOpts) {
    checkTypesMini(opts, defaults, { enforceStrictKeyset: false }, false);
  }
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
      throw new TypeError(
        `${opts.msg}: Both ${
          opts.optsVarName
        }.schema and reference objects are missing! We don't have anything to match the keys as you requested via opts.enforceStrictKeyset!`
      );
    }
  }
  traverse(obj, (key, val, innerObj) => {
    const current = val !== undefined ? val : key;
    if (
      opts.enforceStrictKeyset &&
      (!existy(opts.schema) ||
        !isObj(opts.schema) ||
        (isObj(opts.schema) &&
          (!Object.keys(opts.schema).length ||
            !Object.prototype.hasOwnProperty.call(
              opts.schema,
              innerObj.path
            )))) &&
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
      Object.prototype.hasOwnProperty.call(opts.schema, innerObj.path)
    ) {
      const currentKeysSchema = arrayiffyIfString(opts.schema[innerObj.path])
        .map(String)
        .map(el => el.toLowerCase());
      objectPath.set(opts.schema, innerObj.path, currentKeysSchema);
      if (!intersection(currentKeysSchema, NAMESFORANYTYPE).length) {
        if (
          (current !== true &&
            current !== false &&
            !currentKeysSchema.includes(typ(current).toLowerCase())) ||
          ((current === true || current === false) &&
            !currentKeysSchema.includes(String(current)) &&
            !currentKeysSchema.includes("boolean"))
        ) {
          if (isArr(current) && opts.acceptArrays) {
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
      const compareTo = objectPath.get(ref, innerObj.path);
      if (
        opts.acceptArrays &&
        isArr(current) &&
        !opts.acceptArraysIgnore.includes(key)
      ) {
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
    return current;
  });
}
function externalApi(obj, ref, originalOptions) {
  return checkTypesMini(obj, ref, originalOptions);
}

export default externalApi;
