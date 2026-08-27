type StringInABox<T> = T extends string
  ? T extends ""
    ? []
    : string extends T
      ? [] | [string]
      : [T]
  : T;
declare function arrayiffy<T>(something: T): StringInABox<T>;

export { arrayiffy };
export type { StringInABox };
