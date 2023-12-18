type StringInABox<T> = T extends ""
  ? []
  : string extends T
    ? [] | [string]
    : T extends string
      ? [T]
      : T;

function arrayiffy<T>(something: T): StringInABox<T>;
function arrayiffy<T>(something: T): [] | [string] | T {
  if (typeof something !== "string") return something;
  if (something.length) return [something];
  return [];
}

export { arrayiffy };
