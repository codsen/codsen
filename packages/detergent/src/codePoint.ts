function codePointAtIndex(value: string, index: number): string | undefined {
  if (index < 0 || index >= value.length) {
    return undefined;
  }
  const high = value.charCodeAt(index);
  const low = value.charCodeAt(index + 1);
  if (high >= 0xd800 && high <= 0xdbff && low >= 0xdc00 && low <= 0xdfff) {
    return value.slice(index, index + 2);
  }
  const precedingHigh = value.charCodeAt(index - 1);
  if (
    high >= 0xdc00 &&
    high <= 0xdfff &&
    precedingHigh >= 0xd800 &&
    precedingHigh <= 0xdbff
  ) {
    return value.slice(index - 1, index + 1);
  }
  return value[index];
}

function codePointBeforeIndex(
  value: string,
  index: number,
): string | undefined {
  if (index <= 0 || index > value.length) {
    return undefined;
  }
  const low = value.charCodeAt(index - 1);
  const high = value.charCodeAt(index - 2);
  if (high >= 0xd800 && high <= 0xdbff && low >= 0xdc00 && low <= 0xdfff) {
    return value.slice(index - 2, index);
  }
  return value[index - 1];
}

export { codePointAtIndex, codePointBeforeIndex };
