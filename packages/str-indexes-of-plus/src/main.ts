import { version as v } from "../package.json";

const version: string = v;

function strIndexesOfPlus(
  str: string,
  searchValue: string,
  fromIndex: string | number = 0,
): number[] {
  if (typeof str !== "string") {
    throw new TypeError(
      `str-indexes-of-plus/strIndexesOfPlus(): [THROW_ID_01] first input argument must be a string! Currently it's: ${typeof str}`,
    );
  }
  if (typeof searchValue !== "string") {
    throw new TypeError(
      `str-indexes-of-plus/strIndexesOfPlus(): [THROW_ID_02] second input argument must be a string! Currently it's: ${typeof searchValue}`,
    );
  }
  const numericFromIndex = Number(fromIndex);
  if (
    !Number.isInteger(numericFromIndex) ||
    numericFromIndex < 0 ||
    (typeof fromIndex === "string" && !/^\d+$/.test(fromIndex))
  ) {
    throw new TypeError(
      `str-indexes-of-plus/strIndexesOfPlus(): [THROW_ID_03] third input argument must be a natural number! Currently it's: ${fromIndex}`,
    );
  }
  const strArr = Array.from(str);
  const searchValueArr = Array.from(searchValue);
  if (
    !strArr.length ||
    !searchValueArr.length ||
    numericFromIndex >= strArr.length
  ) {
    return [];
  }

  const result: number[] = [];
  const lastPossibleStart = strArr.length - searchValueArr.length;
  candidate: for (let i = numericFromIndex; i <= lastPossibleStart; i++) {
    for (let j = 0; j < searchValueArr.length; j++) {
      if (strArr[i + j] !== searchValueArr[j]) {
        continue candidate;
      }
    }
    result.push(i);
  }

  return result;
}

export { strIndexesOfPlus, version };
