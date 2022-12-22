declare const version: string;
declare function isAttrClosing(
  str: string,
  idxOfAttrOpening: number,
  isThisClosingIdx: number
): boolean;

export { isAttrClosing, version };
