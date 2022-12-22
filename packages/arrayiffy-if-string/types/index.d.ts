type StringInABox<T> = T extends ""
  ? []
  : string extends T
  ? [] | [string]
  : T extends string
  ? [T]
  : T;
declare function arrayiffy<T>(something: T): StringInABox<T>;

export { arrayiffy };
