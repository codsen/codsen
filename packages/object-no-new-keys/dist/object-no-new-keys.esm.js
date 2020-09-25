/**
 * object-no-new-keys
 * Check, does a plain object (AST/JSON) has any unique keys, not present in a reference object (another AST/JSON)
 * Version: 2.9.10
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-no-new-keys/
 */

function isObj(something) {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}
function objectNoNewKeys(inputOuter, referenceOuter, originalOptsOuter) {
  if (originalOptsOuter && !isObj(originalOptsOuter)) {
    throw new TypeError(
      `object-no-new-keys/objectNoNewKeys(): [THROW_ID_02] opts should be a plain object. It was given as ${JSON.stringify(
        originalOptsOuter,
        null,
        4
      )} (type ${typeof originalOptsOuter})`
    );
  }
  const defaults = {
    mode: 2,
  };
  const optsOuter = { ...defaults, ...originalOptsOuter };
  if (
    typeof optsOuter.mode === "string" &&
    ["1", "2"].includes(optsOuter.mode)
  ) {
    if (optsOuter.mode === "1") {
      optsOuter.mode = 1;
    } else {
      optsOuter.mode = 2;
    }
  } else if (![1, 2].includes(optsOuter.mode)) {
    throw new TypeError(
      `object-no-new-keys/objectNoNewKeys(): [THROW_ID_01] opts.mode should be "1" or "2" (string or number).`
    );
  }
  function objectNoNewKeysInternal(input, reference, opts, innerVar) {
    let temp;
    if (innerVar === undefined) {
      innerVar = { path: "", res: [] };
    }
    if (isObj(input)) {
      if (isObj(reference)) {
        Object.keys(input).forEach((key) => {
          if (!Object.prototype.hasOwnProperty.call(reference, key)) {
            temp = innerVar.path.length > 0 ? `${innerVar.path}.${key}` : key;
            innerVar.res.push(temp);
          } else if (isObj(input[key]) || Array.isArray(input[key])) {
            temp = {
              path: innerVar.path.length > 0 ? `${innerVar.path}.${key}` : key,
              res: innerVar.res,
            };
            innerVar.res = objectNoNewKeysInternal(
              input[key],
              reference[key],
              opts,
              temp
            ).res;
          }
        });
      } else {
        innerVar.res = innerVar.res.concat(
          Object.keys(input).map((key) =>
            innerVar.path.length > 0 ? `${innerVar.path}.${key}` : key
          )
        );
      }
    } else if (Array.isArray(input)) {
      if (Array.isArray(reference)) {
        for (let i = 0, len = input.length; i < len; i++) {
          temp = {
            path: `${innerVar.path.length > 0 ? innerVar.path : ""}[${i}]`,
            res: innerVar.res,
          };
          if (opts.mode === 2) {
            innerVar.res = objectNoNewKeysInternal(
              input[i],
              reference[0],
              opts,
              temp
            ).res;
          } else {
            innerVar.res = objectNoNewKeysInternal(
              input[i],
              reference[i],
              opts,
              temp
            ).res;
          }
        }
      } else {
        innerVar.res = innerVar.res.concat(
          input.map(
            (el, i) => `${innerVar.path.length > 0 ? innerVar.path : ""}[${i}]`
          )
        );
      }
    }
    return innerVar;
  }
  return objectNoNewKeysInternal(inputOuter, referenceOuter, optsOuter).res;
}

export default objectNoNewKeys;
