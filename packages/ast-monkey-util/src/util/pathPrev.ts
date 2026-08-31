// decrements the last chunk in the string path from:
// 9.children.3
// to
// 9.children.2
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

export function pathPrev(str: string): null | string {
  if (typeof str !== "string") {
    throw new TypeError(
      `ast-monkey-util/pathPrev(): [THROW_ID_03] The first argument must be a string; it was ${typeof str}.`,
    );
  }
  if (!str) {
    return null;
  }

  let lastDotAt = str.lastIndexOf(".");
  let extractedValue = str.slice(lastDotAt + 1);
  if (!containsOnlyDigits(extractedValue)) {
    return null;
  }
  let prefix = lastDotAt === -1 ? "" : str.slice(0, lastDotAt + 1);
  if (extractedValue.length < 16) {
    let numericValue = +extractedValue;
    return numericValue <= 0 ? null : `${prefix}${numericValue - 1}`;
  }

  let firstNonZero = 0;
  while (
    firstNonZero < extractedValue.length &&
    extractedValue.charCodeAt(firstNonZero) === 48
  ) {
    firstNonZero += 1;
  }
  if (firstNonZero === extractedValue.length) {
    return null;
  }

  let digitAt = extractedValue.length - 1;
  while (extractedValue.charCodeAt(digitAt) === 48) {
    digitAt -= 1;
  }
  let decremented = extractedValue.charCodeAt(digitAt) - 49;
  let decrementedDigit =
    decremented || digitAt !== firstNonZero
      ? String.fromCharCode(decremented + 48)
      : "";
  let result = `${extractedValue.slice(firstNonZero, digitAt)}${
    decrementedDigit
  }${"9".repeat(extractedValue.length - digitAt - 1)}`;
  return `${prefix}${result || "0"}`;
}
