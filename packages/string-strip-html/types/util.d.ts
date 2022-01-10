interface Obj {
  [key: string]: any;
}
declare function characterSuitableForNames(char: string): boolean;
declare function prepHopefullyAnArray(something: any, name: string): string[];
declare function xBeforeYOnTheRight(
  str: string,
  startingIdx: number,
  x: string,
  y: string
): boolean;
declare function notWithinAttrQuotes(tag: Obj, str: string, i: number): boolean;
declare function trimEnd(str: string): string;
export {
  characterSuitableForNames,
  prepHopefullyAnArray,
  xBeforeYOnTheRight,
  notWithinAttrQuotes,
  trimEnd,
  Obj,
};
