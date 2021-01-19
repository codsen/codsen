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

function flattenObject(objOrig: Obj, originalOpts?: Partial<Opts>): any[] {
  const opts: Opts = { ...defaults, ...originalOpts };
  if (arguments.length === 0 || Object.keys(objOrig).length === 0) {
    return [];
  }
  const obj = clone(objOrig);
  let res: any[] = [];
  if (isObj(obj)) {
    Object.keys(obj).forEach((key) => {
      if (isObj(obj[key])) {
        obj[key] = flattenObject(obj[key], opts);
      }
      if (Array.isArray(obj[key])) {
        res = res.concat(
          obj[key].map((el: any) => key + opts.objectKeyAndValueJoinChar + el)
        );
      }
      if (isStr(obj[key])) {
        res.push(key + opts.objectKeyAndValueJoinChar + obj[key]);
      }
    });
  }
  return res;
}

function flattenArr(
  arrOrig: any[],
  originalOpts?: Partial<Opts>,
  wrap = false,
  joinArraysUsingBrs = false
): string {
  const opts: Opts = { ...defaults, ...originalOpts };
  if (arguments.length === 0 || arrOrig.length === 0) {
    return "";
  }
  const arr: any[] = clone(arrOrig);
  let res = "";
  if (arr.length > 0) {
    if (joinArraysUsingBrs) {
      for (let i = 0, len = arr.length; i < len; i++) {
        if (isStr(arr[i])) {
          let lineBreak;
          lineBreak = "";
          if (
            opts.mergeArraysWithLineBreaks &&
            i > 0 &&
            (!opts.mergeWithoutTrailingBrIfLineContainsBr ||
              typeof arr[i - 1] !== "string" ||
              (opts.mergeWithoutTrailingBrIfLineContainsBr &&
                arr[i - 1] !== undefined &&
                !arr[i - 1].toLowerCase().includes("<br")))
          ) {
            lineBreak = `<br${opts.xhtml ? " /" : ""}>`;
          }
          res +=
            lineBreak +
            (wrap ? opts.wrapHeadsWith : "") +
            arr[i] +
            (wrap ? opts.wrapTailsWith : "");
        } else if (Array.isArray(arr[i])) {
          if (arr[i].length > 0 && arr[i].every(isStr)) {
            let lineBreak = "";
            if (opts.mergeArraysWithLineBreaks && res.length > 0) {
              lineBreak = `<br${opts.xhtml ? " /" : ""}>`;
            }
            res = arr[i].reduce(
              (acc: string, val: string, i2: number, arr2: any[]) => {
                let trailingSpace = "";
                if (i2 !== arr2.length - 1) {
                  trailingSpace = " ";
                }
                return (
                  acc +
                  (i2 === 0 ? lineBreak : "") +
                  (wrap ? opts.wrapHeadsWith : "") +
                  val +
                  (wrap ? opts.wrapTailsWith : "") +
                  trailingSpace
                );
              },
              res
            );
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
        return (
          acc +
          (i === 0 ? lineBreak : "") +
          (wrap ? opts.wrapHeadsWith : "") +
          val +
          (wrap ? opts.wrapTailsWith : "") +
          trailingSpace
        );
      }, res);
    }
  }
  return res;
}

function arrayiffyString(something: string | any): any {
  if (isStr(something)) {
    if (something.length > 0) {
      return [something];
    }
    return [];
  }
  return something;
}

export { flattenObject, flattenArr, arrayiffyString, Obj, defaults, Opts };
