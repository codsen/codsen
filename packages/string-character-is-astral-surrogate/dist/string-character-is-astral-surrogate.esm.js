function isHighSurrogate(something) {
  if (typeof something === "string") {
    if (something.length === 0) {
      return false;
    }
    return something.charCodeAt(0) >= 55296 && something.charCodeAt(0) <= 56319;
  } else if (something === undefined) {
    return false;
  }
  throw new TypeError(
    `string-character-is-astral-surrogate/isHighSurrogate(): the input is not string but ${typeof something}`
  );
}
function isLowSurrogate(something) {
  if (typeof something === "string") {
    if (something.length === 0) {
      return false;
    }
    return something.charCodeAt(0) >= 56320 && something.charCodeAt(0) <= 57343;
  } else if (something === undefined) {
    return false;
  }
  throw new TypeError(
    `string-character-is-astral-surrogate/isLowSurrogate(): the input is not string but ${typeof something}`
  );
}

export { isHighSurrogate, isLowSurrogate };
