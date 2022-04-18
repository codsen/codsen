import clone from "lodash.clonedeep";
import isObj from "lodash.isplainobject";

interface Obj {
  [key: string]: any;
}

interface Opts {
  wrapHeadsWith: string;
  wrapTailsWith: string;
  dontWrapKeys: string[];
  dontWrapPaths: string[];
  xhtml: boolean;
  preventDoubleWrapping: boolean;
  preventWrappingIfContains: string[];
  objectKeyAndValueJoinChar: string;
  wrapGlobalFlipSwitch: boolean;
  ignore: string[];
  whatToDoWhenReferenceIsMissing: 0 | 1 | 2;
  mergeArraysWithLineBreaks: boolean;
  mergeWithoutTrailingBrIfLineContainsBr: boolean;
  enforceStrictKeyset: boolean;
}

const defaults: Opts = {
  wrapHeadsWith: "%%_",
  wrapTailsWith: "_%%",
  dontWrapKeys: [],
  dontWrapPaths: [], // More precise version of simple "dontWrapKeys" above. You can target
  // paths exactly like for exampl: "modules[0].part2[0].ccc[0].kkk". Remember to
  // put the index if it's an array, like modules[0] if key "modules" is equal to
  // array and you want its first element (0-th index), hence "modules[0]".
  xhtml: true, // when flattening arrays, put <br /> (XHTML) or <br> (HTML)
  preventDoubleWrapping: true,
  preventWrappingIfContains: [],
  objectKeyAndValueJoinChar: ".",
  wrapGlobalFlipSwitch: true, // Allow disabling the wrapping feature. Used on deeper branches.
  ignore: [], // Ignore these keys, don't flatten their values.
  whatToDoWhenReferenceIsMissing: 0, // 0 = leave that key's value as it is,
  // 1 = throw, 2 = flatten to string & wrap if wrapping feature is enabled
  mergeArraysWithLineBreaks: true, // when merging arrays, should we
  // add <br /> between the rows?
  mergeWithoutTrailingBrIfLineContainsBr: true, // if line already contains BR,
  // don't add another, trailing-one
  enforceStrictKeyset: true, // are you allowed to pass-in any unrecognised
  // keys in an options object?
};

function isStr(something: any): boolean {
  return typeof something === "string";
}

function flattenObject(obj: Obj, opts?: Partial<Opts>): any[] {
  let resolvedOpts: Opts = { ...defaults, ...opts };
  if (arguments.length === 0 || Object.keys(obj).length === 0) {
    return [];
  }
  let resolvedObj = clone(obj);
  let res: any[] = [];
  if (isObj(resolvedObj)) {
    Object.keys(resolvedObj).forEach((key) => {
      if (isObj(resolvedObj[key])) {
        resolvedObj[key] = flattenObject(resolvedObj[key], resolvedOpts);
      }
      if (Array.isArray(resolvedObj[key])) {
        res = res.concat(
          resolvedObj[key].map(
            (el: any) => `${key}${resolvedOpts.objectKeyAndValueJoinChar}${el}`
          )
        );
      }
      if (isStr(resolvedObj[key])) {
        res.push(
          `${key}${resolvedOpts.objectKeyAndValueJoinChar}${resolvedObj[key]}`
        );
      }
    });
  }
  return res;
}

function flattenArr(
  arr: any[],
  opts?: Partial<Opts>,
  wrap = false,
  joinArraysUsingBrs = false
): string {
  let resolvedOpts: Opts = { ...defaults, ...opts };
  if (arguments.length === 0 || arr.length === 0) {
    return "";
  }
  let resolvedArr: any[] = clone(arr);
  let res = "";
  if (resolvedArr.length) {
    if (joinArraysUsingBrs) {
      for (let i = 0, len = resolvedArr.length; i < len; i++) {
        if (isStr(resolvedArr[i])) {
          let lineBreak;
          lineBreak = "";
          if (
            resolvedOpts.mergeArraysWithLineBreaks &&
            i > 0 &&
            (!resolvedOpts.mergeWithoutTrailingBrIfLineContainsBr ||
              typeof resolvedArr[i - 1] !== "string" ||
              (resolvedOpts.mergeWithoutTrailingBrIfLineContainsBr &&
                resolvedArr[i - 1] !== undefined &&
                !resolvedArr[i - 1].toLowerCase().includes("<br")))
          ) {
            lineBreak = `<br${resolvedOpts.xhtml ? " /" : ""}>`;
          }
          res += `${lineBreak}${wrap ? resolvedOpts.wrapHeadsWith : ""}${
            resolvedArr[i]
          }${wrap ? resolvedOpts.wrapTailsWith : ""}`;
        } else if (Array.isArray(resolvedArr[i])) {
          if (resolvedArr[i].length && resolvedArr[i].every(isStr)) {
            let lineBreak = "";
            if (resolvedOpts.mergeArraysWithLineBreaks && res.length) {
              lineBreak = `<br${resolvedOpts.xhtml ? " /" : ""}>`;
            }
            res = resolvedArr[i].reduce(
              (acc: string, val: string, i2: number, arr2: any[]) => {
                let trailingSpace = "";
                if (i2 !== arr2.length - 1) {
                  trailingSpace = " ";
                }
                return (
                  acc +
                  (i2 === 0 ? lineBreak : "") +
                  (wrap ? resolvedOpts.wrapHeadsWith : "") +
                  val +
                  (wrap ? resolvedOpts.wrapTailsWith : "") +
                  trailingSpace
                );
              },
              res
            );
          }
        }
      }
    } else {
      res = resolvedArr.reduce((acc, val, i, arr2) => {
        let lineBreak = "";
        if (resolvedOpts.mergeArraysWithLineBreaks && i > 0) {
          lineBreak = `<br${resolvedOpts.xhtml ? " /" : ""}>`;
        }
        let trailingSpace = "";
        if (i !== arr2.length - 1) {
          trailingSpace = " ";
        }
        return `${acc}${i === 0 ? lineBreak : ""}${
          wrap ? resolvedOpts.wrapHeadsWith : ""
        }${val}${wrap ? resolvedOpts.wrapTailsWith : ""}${trailingSpace}`;
      }, res);
    }
  }
  return res;
}

function arrayiffyString(something: string | any): any {
  if (isStr(something)) {
    if (something.length) {
      return [something];
    }
    return [];
  }
  return something;
}

export { flattenObject, flattenArr, arrayiffyString, Obj, defaults, Opts };
