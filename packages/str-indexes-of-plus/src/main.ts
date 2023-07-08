import { version as v } from "../package.json";

const version: string = v;

function strIndexesOfPlus(
  str: string,
  searchValue: string,
  fromIndex: string | number = 0,
): number[] {
  if (typeof str !== "string") {
    throw new TypeError(
      `str-indexes-of-plus/strIndexesOfPlus(): first input argument must be a string! Currently it's: ${typeof str}`,
    );
  }
  if (typeof searchValue !== "string") {
    throw new TypeError(
      `str-indexes-of-plus/strIndexesOfPlus(): second input argument must be a string! Currently it's: ${typeof searchValue}`,
    );
  }
  if (
    isNaN(+fromIndex) ||
    (typeof fromIndex === "string" && !/^\d*$/.test(fromIndex))
  ) {
    throw new TypeError(
      `str-indexes-of-plus/strIndexesOfPlus(): third input argument must be a natural number! Currently it's: ${fromIndex}`,
    );
  }
  let strArr: string[] = Array.from(str);
  let searchValueArr: string[] = Array.from(searchValue);
  if (
    strArr.length === 0 ||
    searchValueArr.length === 0 ||
    (fromIndex != null && +fromIndex >= strArr.length)
  ) {
    return [];
  }
  if (!fromIndex) {
    // eslint-disable-next-line no-param-reassign
    fromIndex = 0;
  }

  let res: number[] = [];
  let matchMode = false;
  let potentialFinding;

  for (let i = fromIndex as number, len = strArr.length; i < len; i++) {
    if (matchMode) {
      if (strArr[i] === searchValueArr[i - +(potentialFinding as number)]) {
        if (i - +(potentialFinding as number) + 1 === searchValueArr.length) {
          res.push(+(potentialFinding as number));
        }
      } else {
        potentialFinding = null;
        matchMode = false;
      }
    }

    if (!matchMode) {
      if (strArr[i] === searchValueArr[0]) {
        if (searchValueArr.length === 1) {
          res.push(i);
        } else {
          matchMode = true;
          potentialFinding = i;
        }
      }
    }
  }

  return res;
}

export { strIndexesOfPlus, version };
