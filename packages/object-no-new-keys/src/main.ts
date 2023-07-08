/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { hasOwnProp, isPlainObject as isObj, JSONValue } from "codsen-utils";
import { version as v } from "../package.json";

const version: string = v;

interface InnerVar {
  path: string;
  res: string[];
}

export interface Opts {
  mode: 1 | 2;
}
const defaults: Opts = {
  mode: 2,
};

function noNewKeys(
  input: JSONValue,
  reference: JSONValue,
  opts?: Partial<Opts>,
): string[] {
  if (opts && !isObj(opts)) {
    throw new TypeError(
      `object-no-new-keys/noNewKeys(): [THROW_ID_02] resolvedOpts should be a plain object. It was given as ${JSON.stringify(
        opts,
        null,
        4,
      )} (type ${typeof opts})`,
    );
  }
  let optsOuter: Opts = { ...defaults, ...opts };
  if (
    typeof optsOuter.mode === "string" &&
    ["1", "2"].includes(optsOuter.mode)
  ) {
    optsOuter.mode = +optsOuter.mode as 1 | 2;
  } else if (![1, 2].includes(optsOuter.mode)) {
    throw new TypeError(
      `object-no-new-keys/objectNoNewKeys(): [THROW_ID_01] resolvedOpts.mode should be "1" or "2" (string or number).`,
    );
  }

  function objectNoNewKeysInternal(
    resolvedInput: any,
    resolvedRef: any,
    resolvedOpts: Opts,
    innerVar: InnerVar,
  ) {
    let temp;
    if (isObj(resolvedInput)) {
      if (isObj(resolvedRef)) {
        // resolvedInput and resolvedRef both are objects.
        // match the keys and record any unique-ones.
        // then traverse recursively.
        Object.keys(resolvedInput).forEach((key) => {
          if (!hasOwnProp(resolvedRef, key)) {
            temp = innerVar.path.length ? `${innerVar.path}.${key}` : key;
            innerVar.res.push(temp);
          } else if (
            isObj(resolvedInput[key]) ||
            Array.isArray(resolvedInput[key])
          ) {
            temp = {
              path: innerVar.path.length ? `${innerVar.path}.${key}` : key,
              res: innerVar.res,
            };
            innerVar.res = objectNoNewKeysInternal(
              resolvedInput[key],
              resolvedRef[key],
              resolvedOpts,
              temp,
            ).res;
          }
        });
      } else {
        // resolvedInput is object, but resolvedRef is not.
        // record all the keys of the resolvedInput, but don't traverse deeper
        innerVar.res = innerVar.res.concat(
          Object.keys(resolvedInput).map((key) =>
            innerVar.path.length ? `${innerVar.path}.${key}` : key,
          ),
        );
      }
    } else if (Array.isArray(resolvedInput)) {
      if (Array.isArray(resolvedRef)) {
        // both resolvedInput and resolvedRef are arrays.
        // traverse each
        for (let i = 0, len = resolvedInput.length; i < len; i++) {
          temp = {
            path: `${innerVar.path.length ? innerVar.path : ""}[${i}]`,
            res: innerVar.res,
          };
          if (resolvedOpts.mode === 2) {
            innerVar.res = objectNoNewKeysInternal(
              resolvedInput[i],
              resolvedRef[0],
              resolvedOpts,
              temp,
            ).res;
          } else {
            innerVar.res = objectNoNewKeysInternal(
              resolvedInput[i],
              resolvedRef[i],
              resolvedOpts,
              temp,
            ).res;
          }
        }
      } else {
        // mismatch
        // traverse all elements of the resolvedInput and put their locations to innerVar.res
        innerVar.res = innerVar.res.concat(
          resolvedInput.map(
            (_el, i) => `${innerVar.path.length ? innerVar.path : ""}[${i}]`,
          ),
        );
      }
    }
    return innerVar;
  }
  return objectNoNewKeysInternal(input, reference, optsOuter, {
    path: "",
    res: [],
  }).res;
}

export { noNewKeys, defaults, version };
