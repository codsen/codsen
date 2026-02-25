// bumps the last chunk in the string path from:
// 9.children.3
// to
// 9.children.4
// the path notation is object-path
function containsOnlyDigits(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    let code = value.charCodeAt(i);
    if (code < 48 || code > 57) {
      return false;
    }
  }
  return true;
}

export function pathNext(str: string): string {
  if (typeof str !== "string") {
    throw new TypeError(
      `ast-monkey-util/pathNext(): [THROW_ID_02] The first argument must be a string; it was ${typeof str}.`,
    );
  }

  let lastDotAt = str.lastIndexOf(".");
  let extractedValue = str.slice(lastDotAt + 1);
  if (!containsOnlyDigits(extractedValue)) {
    return str;
  }
  let prefix = lastDotAt === -1 ? "" : str.slice(0, lastDotAt + 1);
  return `${prefix}${+extractedValue + 1}`;
}
