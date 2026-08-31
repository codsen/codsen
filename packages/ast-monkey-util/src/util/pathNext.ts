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

export function pathNext(path: string): string;
export function pathNext(path: readonly string[]): string[];
export function pathNext(path: string | readonly string[]): string | string[] {
  if (typeof path !== "string") {
    if (
      !Array.isArray(path) ||
      path.some((segment) => typeof segment !== "string")
    ) {
      throw new TypeError(
        `ast-monkey-util/pathNext(): [THROW_ID_02] The first argument must be a string or an array of strings; it was ${typeof path}.`,
      );
    }
    let result = path.slice();
    if (!result.length || !result[result.length - 1]) {
      return result;
    }
    result[result.length - 1] = pathNext(result[result.length - 1]);
    return result;
  }

  let lastDotAt = path.lastIndexOf(".");
  let extractedValue = path.slice(lastDotAt + 1);
  if (lastDotAt !== -1 && !extractedValue) {
    return path;
  }
  if (!containsOnlyDigits(extractedValue)) {
    return path;
  }
  let prefix = lastDotAt === -1 ? "" : path.slice(0, lastDotAt + 1);
  if (extractedValue.length < 16) {
    return `${prefix}${+extractedValue + 1}`;
  }

  let firstNonZero = 0;
  while (
    firstNonZero < extractedValue.length &&
    extractedValue.charCodeAt(firstNonZero) === 48
  ) {
    firstNonZero += 1;
  }
  if (firstNonZero === extractedValue.length) {
    return `${prefix}1`;
  }

  let digitAt = extractedValue.length - 1;
  while (digitAt >= firstNonZero && extractedValue.charCodeAt(digitAt) === 57) {
    digitAt -= 1;
  }
  if (digitAt < firstNonZero) {
    return `${prefix}1${"0".repeat(extractedValue.length - firstNonZero)}`;
  }
  return `${prefix}${extractedValue.slice(
    firstNonZero,
    digitAt,
  )}${String.fromCharCode(
    extractedValue.charCodeAt(digitAt) + 1,
  )}${"0".repeat(extractedValue.length - digitAt - 1)}`;
}
