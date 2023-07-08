// high surrogate goes first, low goes second

function isHighSurrogate(something: string | undefined): boolean {
  // [\uD800-\uDBFF]
  if (typeof something === "string") {
    if (something.length === 0) {
      return false;
    }
    // \uD800 charCode is 55296
    // \uDBFF charCode is 56319
    return something.charCodeAt(0) >= 55296 && something.charCodeAt(0) <= 56319;
  }
  if (something === undefined) {
    return false;
  }
  throw new TypeError(
    `string-character-is-astral-surrogate/isHighSurrogate(): the input is not string but ${typeof something}`,
  );
}
function isLowSurrogate(something: string | undefined): boolean {
  // [\uDC00-\uDFFF]
  if (typeof something === "string") {
    if (something.length === 0) {
      return false;
    }
    // \uDC00 charCode is 56320
    // \uDFFF charCode is 57343
    return something.charCodeAt(0) >= 56320 && something.charCodeAt(0) <= 57343;
  }
  if (something === undefined) {
    return false;
  }
  throw new TypeError(
    `string-character-is-astral-surrogate/isLowSurrogate(): the input is not string but ${typeof something}`,
  );
}

export { isHighSurrogate, isLowSurrogate };
