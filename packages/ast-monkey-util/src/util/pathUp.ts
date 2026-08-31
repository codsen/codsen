export function pathUp(str: string): string {
  if (typeof str !== "string") {
    throw new TypeError(
      `ast-monkey-util/pathUp(): [THROW_ID_04] The first argument must be a string; it was ${typeof str}.`,
    );
  }

  let lastDotAt = str.lastIndexOf(".");
  if (lastDotAt > 0) {
    let previousDotAt = str.lastIndexOf(".", lastDotAt - 1);
    if (previousDotAt !== -1) {
      return str.slice(0, previousDotAt);
    }
  }

  // zero is the root level's first element
  return "0";
}
