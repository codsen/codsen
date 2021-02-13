/**
 * object-flatten-referencing
 * Flatten complex nested objects according to a reference objects
 * Version: 5.0.4
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-flatten-referencing/
 */

import clone from 'lodash.clonedeep';
import { strIndexesOfPlus } from 'str-indexes-of-plus';
import matcher from 'matcher';
import isObj from 'lodash.isplainobject';

const defaults = {
  wrapHeadsWith: "%%_",
  wrapTailsWith: "_%%",
  dontWrapKeys: [],
  dontWrapPaths: [],
  // paths exactly like for exampl: "modules[0].part2[0].ccc[0].kkk". Remember to
  // put the index if it's an array, like modules[0] if key "modules" is equal to
  // array and you want its first element (0-th index), hence "modules[0]".
  xhtml: true,
  preventDoubleWrapping: true,
  preventWrappingIfContains: [],
  objectKeyAndValueJoinChar: ".",
  wrapGlobalFlipSwitch: true,
  ignore: [],
  whatToDoWhenReferenceIsMissing: 0,
  // 1 = throw, 2 = flatten to string & wrap if wrapping feature is enabled
  mergeArraysWithLineBreaks: true,
  // add <br /> between the rows?
  mergeWithoutTrailingBrIfLineContainsBr: true,
  // don't add another, trailing-one
  enforceStrictKeyset: true
};

function isStr(something) {
  return typeof something === "string";
}

function flattenObject(objOrig, originalOpts) {
  const opts = { ...defaults,
    ...originalOpts
  };

  if (arguments.length === 0 || Object.keys(objOrig).length === 0) {
    return [];
  }

  const obj = clone(objOrig);
  let res = [];

  if (isObj(obj)) {
    Object.keys(obj).forEach(key => {
      if (isObj(obj[key])) {
        obj[key] = flattenObject(obj[key], opts);
      }

      if (Array.isArray(obj[key])) {
        res = res.concat(obj[key].map(el => key + opts.objectKeyAndValueJoinChar + el));
      }

      if (isStr(obj[key])) {
        res.push(key + opts.objectKeyAndValueJoinChar + obj[key]);
      }
    });
  }

  return res;
}

function flattenArr(arrOrig, originalOpts, wrap = false, joinArraysUsingBrs = false) {
  const opts = { ...defaults,
    ...originalOpts
  };

  if (arguments.length === 0 || arrOrig.length === 0) {
    return "";
  }

  const arr = clone(arrOrig);
  let res = "";

  if (arr.length > 0) {
    if (joinArraysUsingBrs) {
      for (let i = 0, len = arr.length; i < len; i++) {
        if (isStr(arr[i])) {
          let lineBreak;
          lineBreak = "";

          if (opts.mergeArraysWithLineBreaks && i > 0 && (!opts.mergeWithoutTrailingBrIfLineContainsBr || typeof arr[i - 1] !== "string" || opts.mergeWithoutTrailingBrIfLineContainsBr && arr[i - 1] !== undefined && !arr[i - 1].toLowerCase().includes("<br"))) {
            lineBreak = `<br${opts.xhtml ? " /" : ""}>`;
          }

          res += lineBreak + (wrap ? opts.wrapHeadsWith : "") + arr[i] + (wrap ? opts.wrapTailsWith : "");
        } else if (Array.isArray(arr[i])) {
          if (arr[i].length > 0 && arr[i].every(isStr)) {
            let lineBreak = "";

            if (opts.mergeArraysWithLineBreaks && res.length > 0) {
              lineBreak = `<br${opts.xhtml ? " /" : ""}>`;
            }

            res = arr[i].reduce((acc, val, i2, arr2) => {
              let trailingSpace = "";

              if (i2 !== arr2.length - 1) {
                trailingSpace = " ";
              }

              return acc + (i2 === 0 ? lineBreak : "") + (wrap ? opts.wrapHeadsWith : "") + val + (wrap ? opts.wrapTailsWith : "") + trailingSpace;
            }, res);
          }
        }
      }
    } else {
      res = arr.reduce((acc, val, i, arr2) => {
        let lineBreak = "";

        if (opts.mergeArraysWithLineBreaks && i > 0) {
          lineBreak = `<br${opts.xhtml ? " /" : ""}>`;
        }

        let trailingSpace = "";

        if (i !== arr2.length - 1) {
          trailingSpace = " ";
        }

        return acc + (i === 0 ? lineBreak : "") + (wrap ? opts.wrapHeadsWith : "") + val + (wrap ? opts.wrapTailsWith : "") + trailingSpace;
      }, res);
    }
  }

  return res;
}

function arrayiffyString(something) {
  if (isStr(something)) {
    if (something.length > 0) {
      return [something];
    }

    return [];
  }

  return something;
}

var version = "5.0.4";

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */
const version$1 = version;

function existy(x) {
  return x != null;
}

function isStr$1(something) {
  return typeof something === "string";
}

function flattenReferencing(originalInput1, originalReference1, opts1) {
  if (arguments.length === 0) {
    throw new Error("object-flatten-referencing/ofr(): [THROW_ID_01] all inputs missing!");
  }

  if (arguments.length === 1) {
    throw new Error("object-flatten-referencing/ofr(): [THROW_ID_02] reference object missing!");
  }

  if (existy(opts1) && !isObj(opts1)) {
    throw new Error(`object-flatten-referencing/ofr(): [THROW_ID_03] third input, options object must be a plain object. Currently it's: ${typeof opts1}`);
  }

  const originalOpts = { ...defaults,
    ...opts1
  };
  originalOpts.dontWrapKeys = arrayiffyString(originalOpts.dontWrapKeys);
  originalOpts.preventWrappingIfContains = arrayiffyString(originalOpts.preventWrappingIfContains);
  originalOpts.dontWrapPaths = arrayiffyString(originalOpts.dontWrapPaths);
  originalOpts.ignore = arrayiffyString(originalOpts.ignore);

  if (typeof originalOpts.whatToDoWhenReferenceIsMissing !== "number") {
    originalOpts.whatToDoWhenReferenceIsMissing = +originalOpts.whatToDoWhenReferenceIsMissing || 0;
  }

  function ofr(originalInput, originalReference, opts, wrap = true, joinArraysUsingBrs = true, currentRoot = "") {
    // console.log(`\n\n* originalInput = ${JSON.stringify(originalInput, null, 4)}`)
    // console.log(`* originalReference = ${JSON.stringify(originalReference, null, 4)}`)
    let input = clone(originalInput);
    const reference = clone(originalReference);

    if (!opts.wrapGlobalFlipSwitch) {
      wrap = false;
    }

    if (isObj(input)) {
      Object.keys(input).forEach(key => {
        const currentPath = currentRoot + (currentRoot.length === 0 ? key : `.${key}`); // console.log(`* currentPath = ${JSON.stringify(currentPath, null, 4)}\n\n`)

        if (opts.ignore.length === 0 || !opts.ignore.includes(key)) {
          if (opts.wrapGlobalFlipSwitch) {
            wrap = true; // reset it for the new key.

            if (opts.dontWrapKeys.length > 0) {
              wrap = wrap && !opts.dontWrapKeys.some(elem => matcher.isMatch(key, elem, {
                caseSensitive: true
              }));
            }

            if (opts.dontWrapPaths.length > 0) {
              wrap = wrap && !opts.dontWrapPaths.some(elem => elem === currentPath);
            }

            if (opts.preventWrappingIfContains.length > 0 && typeof input[key] === "string") {
              wrap = wrap && !opts.preventWrappingIfContains.some(elem => input[key].includes(elem));
            }
          }

          if (existy(reference[key]) || !existy(reference[key]) && opts.whatToDoWhenReferenceIsMissing === 2) {
            if (Array.isArray(input[key])) {
              if (opts.whatToDoWhenReferenceIsMissing === 2 || isStr$1(reference[key])) {
                // reference is string
                // that's array vs. string clash:
                input[key] = flattenArr(input[key], opts, wrap, joinArraysUsingBrs);
              } else {
                // reference is array as well
                // that's array vs. array clash, for example
                // so input[key] is array. Let's check, does it contain only strings, or
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
                if (input[key].every(el => typeof el === "string" || Array.isArray(el))) {
                  // check that those array elements contain only string elements:
                  let allOK = true;
                  input[key].forEach(oneOfElements => {
                    // check that child arrays contain only string elements
                    if (Array.isArray(oneOfElements) && !oneOfElements.every(isStr$1)) {
                      allOK = false;
                    }
                  });

                  if (allOK) {
                    joinArraysUsingBrs = false;
                  }
                }

                input[key] = ofr(input[key], reference[key], opts, wrap, joinArraysUsingBrs, currentPath);
              }
            } else if (isObj(input[key])) {
              if (opts.whatToDoWhenReferenceIsMissing === 2 || isStr$1(reference[key])) {
                input[key] = flattenArr(flattenObject(input[key], opts), opts, wrap, joinArraysUsingBrs);
              } else if (!wrap) {
                // when calling recursively, the parent key might get
                // identified (wrap=true) to be wrapped.
                // however, that flag might get lost as its children will
                // calculate the new "wrap" on its own keys, often turning off the wrap function.
                // to prevent that, we flip the switch on the global wrap
                // setting for all deeper child nodes.
                // we also clone the options object so as not to mutate it.
                input[key] = ofr(input[key], reference[key], { ...opts,
                  wrapGlobalFlipSwitch: false
                }, wrap, joinArraysUsingBrs, currentPath);
              } else {
                input[key] = ofr(input[key], reference[key], opts, wrap, joinArraysUsingBrs, currentPath);
              }
            } else if (isStr$1(input[key])) {
              input[key] = ofr(input[key], reference[key], opts, wrap, joinArraysUsingBrs, currentPath);
            }
          } else if (typeof input[key] !== typeof reference[key]) {
            if (opts.whatToDoWhenReferenceIsMissing === 1) {
              throw new Error(`object-flatten-referencing/ofr(): [THROW_ID_06] reference object does not have the key ${key} and we need it. TIP: Turn off throwing via opts.whatToDoWhenReferenceIsMissing.`);
            } // when opts.whatToDoWhenReferenceIsMissing === 2, library does nothing,
            // so we simply let it slip through.

          }
        }
      });
    } else if (Array.isArray(input)) {
      if (Array.isArray(reference)) {
        input.forEach((_el, i) => {
          if (existy(input[i]) && existy(reference[i])) {
            input[i] = ofr(input[i], reference[i], opts, wrap, joinArraysUsingBrs, `${currentRoot}[${i}]`);
          } else {
            input[i] = ofr(input[i], reference[0], opts, wrap, joinArraysUsingBrs, `${currentRoot}[${i}]`);
          }
        });
      } else if (isStr$1(reference)) {
        input = flattenArr(input, opts, wrap, joinArraysUsingBrs);
      }
    } else if (isStr$1(input)) {
      if (input.length > 0 && (opts.wrapHeadsWith || opts.wrapTailsWith)) {
        if (!opts.preventDoubleWrapping || (opts.wrapHeadsWith === "" || !strIndexesOfPlus(input, opts.wrapHeadsWith.trim()).length) && (opts.wrapTailsWith === "" || !strIndexesOfPlus(input, opts.wrapTailsWith.trim()).length)) {
          input = (wrap ? opts.wrapHeadsWith : "") + input + (wrap ? opts.wrapTailsWith : "");
        }
      }
    }

    return input;
  }

  return ofr(originalInput1, originalReference1, originalOpts);
}

export { arrayiffyString, defaults, flattenArr, flattenObject, flattenReferencing, version$1 as version };
