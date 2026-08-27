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
