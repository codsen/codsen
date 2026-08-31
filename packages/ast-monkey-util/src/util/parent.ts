// calculate parent key, for example,
// "a" => null
// "0" => null
// "a.b" => "a"
// "a.0" => "a"
// "a.0.c" => "0"
export function parent(path: string): null | string;
export function parent(path: readonly string[]): null | string;
export function parent(path: string | readonly string[]): null | string {
  if (typeof path !== "string") {
    if (
      !Array.isArray(path) ||
      path.some((segment) => typeof segment !== "string")
    ) {
      throw new TypeError(
        `ast-monkey-util/parent(): [THROW_ID_01] The first argument must be a string or an array of strings; it was ${typeof path}.`,
      );
    }
    return path.length < 2 ? null : path[path.length - 2];
  }

  let lastDotAt = path.lastIndexOf(".");
  if (lastDotAt === -1) {
    return null;
  }
  let previousDotAt = path.lastIndexOf(".", lastDotAt - 1);
  return path.slice(previousDotAt + 1, lastDotAt);
}
