/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import clone from "lodash.clonedeep";
import { strIndexesOfPlus } from "str-indexes-of-plus";
import { isMatch } from "matcher";
import isObj from "lodash.isplainobject";

import {
  flattenObject,
  flattenArr,
  arrayiffyString,
  Obj,
  defaults,
  Opts,
} from "./util";
import { version as v } from "../package.json";

const version: string = v;

function existy(x: any): boolean {
  return x != null;
}
function isStr(something: any): boolean {
  return typeof something === "string";
}

function flattenReferencing(
  input: any,
  reference: any,
  opts?: Partial<Opts>
): any {
  if (arguments.length === 0) {
    throw new Error(
      "object-flatten-referencing/ofr(): [THROW_ID_01] all inputs missing!"
    );
  }
  if (arguments.length === 1) {
    throw new Error(
      "object-flatten-referencing/ofr(): [THROW_ID_02] resolvedReference object missing!"
    );
  }
  if (existy(opts) && !isObj(opts)) {
    throw new Error(
      `object-flatten-referencing/ofr(): [THROW_ID_03] third resolvedInput, options object must be a plain object. Currently it's: ${typeof opts}`
    );
  }

  let originalOpts: Opts = { ...defaults, ...opts };

  originalOpts.dontWrapKeys = arrayiffyString(originalOpts.dontWrapKeys);
  originalOpts.preventWrappingIfContains = arrayiffyString(
    originalOpts.preventWrappingIfContains
  );
  originalOpts.dontWrapPaths = arrayiffyString(originalOpts.dontWrapPaths);
  originalOpts.ignore = arrayiffyString(originalOpts.ignore);
  if (typeof originalOpts.whatToDoWhenReferenceIsMissing !== "number") {
    (originalOpts as Obj).whatToDoWhenReferenceIsMissing =
      +originalOpts.whatToDoWhenReferenceIsMissing || 0;
  }

  function ofr(
    originalInput: any,
    originalReference: any,
    opts2: Opts,
    wrap = true,
    joinArraysUsingBrs = true,
    currentRoot = ""
  ): string {
    // DEV && console.log(`\n\n* originalInput = ${JSON.stringify(originalInput, null, 4)}`)
    // DEV && console.log(`* originalReference = ${JSON.stringify(originalReference, null, 4)}`)
    let resolvedInput = clone(originalInput);
    let resolvedReference = clone(originalReference);

    if (!opts2.wrapGlobalFlipSwitch) {
      wrap = false;
    }

    if (isObj(resolvedInput)) {
      Object.keys(resolvedInput).forEach((key) => {
        let currentPath =
          currentRoot + (currentRoot.length === 0 ? key : `.${key}`);
        // DEV && console.log(`* currentPath = ${JSON.stringify(currentPath, null, 4)}\n\n`)
        if (opts2.ignore.length === 0 || !opts2.ignore.includes(key)) {
          if (opts2.wrapGlobalFlipSwitch) {
            wrap = true; // reset it for the new key.
            if (opts2.dontWrapKeys.length) {
              wrap =
                wrap &&
                !opts2.dontWrapKeys.some((elem) =>
                  isMatch(key, elem, { caseSensitive: true })
                );
            }
            if (opts2.dontWrapPaths.length) {
              wrap =
                wrap &&
                !opts2.dontWrapPaths.some((elem) => elem === currentPath);
            }
            if (
              opts2.preventWrappingIfContains.length &&
              typeof resolvedInput[key] === "string"
            ) {
              wrap =
                wrap &&
                !opts2.preventWrappingIfContains.some((elem) =>
                  resolvedInput[key].includes(elem)
                );
            }
          }

          if (
            existy(resolvedReference[key]) ||
            (!existy(resolvedReference[key]) &&
              opts2.whatToDoWhenReferenceIsMissing === 2)
          ) {
            if (Array.isArray(resolvedInput[key])) {
              if (
                opts2.whatToDoWhenReferenceIsMissing === 2 ||
                isStr(resolvedReference[key])
              ) {
                // resolvedReference is string
                // that's array vs. string clash:
                resolvedInput[key] = flattenArr(
                  resolvedInput[key],
                  opts2,
                  wrap,
                  joinArraysUsingBrs
                );
              } else {
                // resolvedReference is array as well
                // that's array vs. array clash, for example
                // so resolvedInput[key] is array. Let's check, does it contain only strings, or
                // do some elements contain array of strings? Because if so, those deeper-level
                // arrays must be joined with spaces. Outermost arrays must be joined by BR's.
                // We're talking about ['1111', '2222', '3333'] in:
                // {
                //   k_key: 'k_val',
                //   l_key: 'l_val',
                //   m_key: [
                //     'xxxx',
                //     ['1111', '2222', '3333'],
                //     'yyyy',
                //     'zzzz'
                //   ]
                // }
                //
                // referencing above,
                // ['1111', '2222', '3333'] should be joined by spaces.
                // ['xxxx', [...], 'yyyy', 'zzzz'] should be joined by BR's
                if (
                  resolvedInput[key].every(
                    (el: any) => typeof el === "string" || Array.isArray(el)
                  )
                ) {
                  // check that those array elements contain only string elements:
                  let allOK = true;
                  resolvedInput[key].forEach((oneOfElements: any) => {
                    // check that child arrays contain only string elements
                    if (
                      Array.isArray(oneOfElements) &&
                      !oneOfElements.every(isStr)
                    ) {
                      allOK = false;
                    }
                  });
                  if (allOK) {
                    joinArraysUsingBrs = false;
                  }
                }
                resolvedInput[key] = ofr(
                  resolvedInput[key],
                  resolvedReference[key],
                  opts2,
                  wrap,
                  joinArraysUsingBrs,
                  currentPath
                );
              }
            } else if (isObj(resolvedInput[key])) {
              if (
                opts2.whatToDoWhenReferenceIsMissing === 2 ||
                isStr(resolvedReference[key])
              ) {
                resolvedInput[key] = flattenArr(
                  flattenObject(resolvedInput[key], opts2),
                  opts2,
                  wrap,
                  joinArraysUsingBrs
                );
              } else if (!wrap) {
                // when calling recursively, the parent key might get
                // identified (wrap=true) to be wrapped.
                // however, that flag might get lost as its children will
                // calculate the new "wrap" on its own keys, often turning off the wrap function.
                // to prevent that, we flip the switch on the global wrap
                // setting for all deeper child nodes.
                // we also clone the options object so as not to mutate it.
                resolvedInput[key] = ofr(
                  resolvedInput[key],
                  resolvedReference[key],
                  { ...opts2, wrapGlobalFlipSwitch: false },
                  wrap,
                  joinArraysUsingBrs,
                  currentPath
                );
              } else {
                resolvedInput[key] = ofr(
                  resolvedInput[key],
                  resolvedReference[key],
                  opts2,
                  wrap,
                  joinArraysUsingBrs,
                  currentPath
                );
              }
            } else if (isStr(resolvedInput[key])) {
              resolvedInput[key] = ofr(
                resolvedInput[key],
                resolvedReference[key],
                opts2,
                wrap,
                joinArraysUsingBrs,
                currentPath
              );
            }
          } else if (
            typeof resolvedInput[key] !== typeof resolvedReference[key]
          ) {
            if (opts2.whatToDoWhenReferenceIsMissing === 1) {
              throw new Error(
                `object-flatten-referencing/ofr(): [THROW_ID_06] resolvedReference object does not have the key ${key} and we need it. TIP: Turn off throwing via opts2.whatToDoWhenReferenceIsMissing.`
              );
            }
            // when opts2.whatToDoWhenReferenceIsMissing === 2, library does nothing,
            // so we simply let it slip through.
          }
        }
      });
    } else if (Array.isArray(resolvedInput)) {
      if (Array.isArray(resolvedReference)) {
        resolvedInput.forEach((_el, i) => {
          if (existy(resolvedInput[i]) && existy(resolvedReference[i])) {
            resolvedInput[i] = ofr(
              resolvedInput[i],
              resolvedReference[i],
              opts2,
              wrap,
              joinArraysUsingBrs,
              `${currentRoot}[${i}]`
            );
          } else {
            resolvedInput[i] = ofr(
              resolvedInput[i],
              resolvedReference[0],
              opts2,
              wrap,
              joinArraysUsingBrs,
              `${currentRoot}[${i}]`
            );
          }
        });
      } else if (isStr(resolvedReference)) {
        resolvedInput = flattenArr(
          resolvedInput,
          opts2,
          wrap,
          joinArraysUsingBrs
        );
      }
    } else if (isStr(resolvedInput)) {
      if (
        resolvedInput.length &&
        (opts2.wrapHeadsWith || opts2.wrapTailsWith)
      ) {
        if (
          !opts2.preventDoubleWrapping ||
          ((opts2.wrapHeadsWith === "" ||
            !strIndexesOfPlus(resolvedInput, opts2.wrapHeadsWith.trim())
              .length) &&
            (opts2.wrapTailsWith === "" ||
              !strIndexesOfPlus(resolvedInput, opts2.wrapTailsWith.trim())
                .length))
        ) {
          resolvedInput = `${wrap ? opts2.wrapHeadsWith : ""}${resolvedInput}${
            wrap ? opts2.wrapTailsWith : ""
          }`;
        }
      }
    }
    return resolvedInput;
  }

  return ofr(input, reference, originalOpts);
}

export {
  flattenReferencing,
  flattenObject,
  flattenArr,
  arrayiffyString,
  defaults,
  version,
  Opts,
};
