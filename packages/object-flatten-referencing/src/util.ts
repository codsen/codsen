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

function isStr(something: any): boolean {
  return typeof something === "string";
}

function flattenObject(objOrig: Obj, opts: Opts): any[] {
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
  opts: Opts,
  wrap: boolean,
  joinArraysUsingBrs: boolean
): string {
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

export { flattenObject, flattenArr, arrayiffyString, Obj, Opts };
