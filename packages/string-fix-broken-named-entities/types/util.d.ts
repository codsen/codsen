declare function isObj(something: any): boolean;
declare function isLatinLetterOrNumberOrHash(char: string): boolean;
declare function isNumeric(something: any): boolean;
declare function isStr(something: any): boolean;
declare function resemblesNumericEntity(
  str2: string,
  from: number,
  to: number
): {
  probablyNumeric: string | boolean;
  lettersCount: number;
  numbersCount: number;
  numbersValue: string;
  hashesCount: number;
  othersCount: number;
  charTrimmed: string;
  whitespaceCount: number;
};
interface TempObj {
  tempEnt: string;
  tempRes: {
    gaps: [number, number][];
    leftmostChar: number;
    rightmostChar: number;
  };
}
declare function removeGappedFromMixedCases(
  str: string,
  temp1: TempObj[]
): TempObj | TempObj[];
export {
  isObj,
  isStr,
  isNumeric,
  resemblesNumericEntity,
  removeGappedFromMixedCases,
  isLatinLetterOrNumberOrHash,
};
