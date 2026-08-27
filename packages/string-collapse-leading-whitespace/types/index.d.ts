declare const version: string;
declare function collWhitespace<T>(
  str: T,
  lineBreakLimit?: number,
): T extends string ? string : T;

export { collWhitespace, version };
