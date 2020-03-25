import clone from "lodash.clonedeep";
import isObj from "lodash.isplainobject";
import isStringInt from "is-string-int";

const isArr = Array.isArray;

function isStr(something) {
  return typeof something === "string";
}

function flattenObject(objOrig, opts) {
  if (arguments.length === 0 || Object.keys(objOrig).length === 0) {
    return [];
  }
  const obj = clone(objOrig);
  let res = [];
  if (isObj(obj)) {
    Object.keys(obj).forEach((key) => {
      if (isObj(obj[key])) {
        obj[key] = flattenObject(obj[key], opts);
      }
      if (isArr(obj[key])) {
        res = res.concat(
          obj[key].map((el) => key + opts.objectKeyAndValueJoinChar + el)
        );
      }
      if (isStr(obj[key])) {
        res.push(key + opts.objectKeyAndValueJoinChar + obj[key]);
      }
    });
  }
  return res;
}

function flattenArr(arrOrig, opts, wrap, joinArraysUsingBrs) {
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
        } else if (isArr(arr[i])) {
          // there's an array among elements
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
              return (
                acc +
                (i2 === 0 ? lineBreak : "") +
                (wrap ? opts.wrapHeadsWith : "") +
                val +
                (wrap ? opts.wrapTailsWith : "") +
                trailingSpace
              );
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

function arrayiffyString(something) {
  if (isStr(something)) {
    if (something.length > 0) {
      return [something];
    }
    return [];
  }
  return something;
}

function reclaimIntegerString(something) {
  if (isStr(something) && isStringInt(something.trim())) {
    return parseInt(something.trim(), 10);
  }
  return something;
}

export { flattenObject, flattenArr, arrayiffyString, reclaimIntegerString };
