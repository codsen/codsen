// calculate parent key, for example,
// "a" => null
// "0" => null
// "a.b" => "a"
// "a.0" => "a"
// "a.0.c" => "0"
export function parentItem(str: string): null | string {
  if (typeof str !== "string") {
    throw new TypeError(
      `ast-monkey-util/parent(): [THROW_ID_01] The first argument must be a string; it was ${typeof str}.`,
    );
  }

  let lastDotAt = str.lastIndexOf(".");
  if (lastDotAt === -1) {
    return null;
  }
  let previousDotAt = str.lastIndexOf(".", lastDotAt - 1);
  return str.slice(previousDotAt + 1, lastDotAt);
}
