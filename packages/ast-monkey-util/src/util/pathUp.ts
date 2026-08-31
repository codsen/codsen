export function pathUp(path: string): string;
export function pathUp(path: readonly string[]): string[];
export function pathUp(path: string | readonly string[]): string | string[] {
  if (typeof path !== "string") {
    if (
      !Array.isArray(path) ||
      path.some((segment) => typeof segment !== "string")
    ) {
      throw new TypeError(
        `ast-monkey-util/pathUp(): [THROW_ID_04] The first argument must be a string or an array of strings; it was ${typeof path}.`,
      );
    }
    return path.length > 2 ? path.slice(0, -2) : ["0"];
  }

  let lastDotAt = path.lastIndexOf(".");
  if (lastDotAt > 0) {
    let previousDotAt = path.lastIndexOf(".", lastDotAt - 1);
    if (previousDotAt !== -1) {
      return path.slice(0, previousDotAt);
    }
  }

  // zero is the root level's first element
  return "0";
}
