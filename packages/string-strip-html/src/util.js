function isValidAttributeCharacter(char) {
  // https://html.spec.whatwg.org/multipage/syntax.html#attributes-2

  if (char.charCodeAt(0) >= 0 && char.charCodeAt(0) <= 31) {
    // C0 CONTROLS
    return false;
  }
  if (char.charCodeAt(0) >= 127 && char.charCodeAt(0) <= 159) {
    // U+007F DELETE to U+009F APPLICATION PROGRAM COMMAND
    return false;
  }
  if (char.charCodeAt(0) === 32) {
    // U+0020 SPACE
    return false;
  }
  if (char.charCodeAt(0) === 34) {
    // U+0022 (")
    return false;
  }
  if (char.charCodeAt(0) === 39) {
    // U+0027 (')
    return false;
  }
  if (char.charCodeAt(0) === 62) {
    // U+003E (>)
    return false;
  }
  if (char.charCodeAt(0) === 47) {
    // U+002F (/)
    return false;
  }
  if (char.charCodeAt(0) === 61) {
    // U+003D (=)
    return false;
  }
  if (
    // noncharacter:
    // https://infra.spec.whatwg.org/#noncharacter
    (char.charCodeAt(0) >= 64976 && char.charCodeAt(0) <= 65007) || // U+FDD0 to U+FDEF, inclusive,
    char.charCodeAt(0) === 65534 || // or U+FFFE,
    char.charCodeAt(0) === 65535 || // U+FFFF,
    (char.charCodeAt(0) === 55359 && char.charCodeAt(1) === 57342) || // U+1FFFE, or \uD83F\uDFFE
    (char.charCodeAt(0) === 55359 && char.charCodeAt(1) === 57343) || // U+1FFFF, or \uD83F\uDFFF
    (char.charCodeAt(0) === 55423 && char.charCodeAt(1) === 57342) || // U+2FFFE, or \uD87F\uDFFE
    (char.charCodeAt(0) === 55423 && char.charCodeAt(1) === 57343) || // U+2FFFF, or \uD87F\uDFFF
    (char.charCodeAt(0) === 55487 && char.charCodeAt(1) === 57342) || // U+3FFFE, or \uD8BF\uDFFE
    (char.charCodeAt(0) === 55487 && char.charCodeAt(1) === 57343) || // U+3FFFF, or \uD8BF\uDFFF
    (char.charCodeAt(0) === 55551 && char.charCodeAt(1) === 57342) || // U+4FFFE, or \uD8FF\uDFFE
    (char.charCodeAt(0) === 55551 && char.charCodeAt(1) === 57343) || // U+4FFFF, or \uD8FF\uDFFF
    (char.charCodeAt(0) === 55615 && char.charCodeAt(1) === 57342) || // U+5FFFE, or \uD93F\uDFFE
    (char.charCodeAt(0) === 55615 && char.charCodeAt(1) === 57343) || // U+5FFFF, or \uD93F\uDFFF
    (char.charCodeAt(0) === 55679 && char.charCodeAt(1) === 57342) || // U+6FFFE, or \uD97F\uDFFE
    (char.charCodeAt(0) === 55679 && char.charCodeAt(1) === 57343) || // U+6FFFF, or \uD97F\uDFFF
    (char.charCodeAt(0) === 55743 && char.charCodeAt(1) === 57342) || // U+7FFFE, or \uD9BF\uDFFE
    (char.charCodeAt(0) === 55743 && char.charCodeAt(1) === 57343) || // U+7FFFF, or \uD9BF\uDFFF
    (char.charCodeAt(0) === 55807 && char.charCodeAt(1) === 57342) || // U+8FFFE, or \uD9FF\uDFFE
    (char.charCodeAt(0) === 55807 && char.charCodeAt(1) === 57343) || // U+8FFFF, or \uD9FF\uDFFF
    (char.charCodeAt(0) === 55871 && char.charCodeAt(1) === 57342) || // U+9FFFE, or \uDA3F\uDFFE
    (char.charCodeAt(0) === 55871 && char.charCodeAt(1) === 57343) || // U+9FFFF, or \uDA3F\uDFFF
    (char.charCodeAt(0) === 55935 && char.charCodeAt(1) === 57342) || // U+AFFFE, or \uDA7F\uDFFE
    (char.charCodeAt(0) === 55935 && char.charCodeAt(1) === 57343) || // U+AFFFF, or \uDA7F\uDFFF
    (char.charCodeAt(0) === 55999 && char.charCodeAt(1) === 57342) || // U+BFFFE, or \uDABF\uDFFE
    (char.charCodeAt(0) === 55999 && char.charCodeAt(1) === 57343) || // U+BFFFF, or \uDABF\uDFFF
    (char.charCodeAt(0) === 56063 && char.charCodeAt(1) === 57342) || // U+CFFFE, or \uDAFF\uDFFE
    (char.charCodeAt(0) === 56063 && char.charCodeAt(1) === 57343) || // U+CFFFF, or \uDAFF\uDFFF
    (char.charCodeAt(0) === 56127 && char.charCodeAt(1) === 57342) || // U+DFFFE, or \uDB3F\uDFFE
    (char.charCodeAt(0) === 56127 && char.charCodeAt(1) === 57343) || // U+DFFFF, or \uDB3F\uDFFF
    (char.charCodeAt(0) === 56191 && char.charCodeAt(1) === 57342) || // U+EFFFE, or \uDB7F\uDFFE
    (char.charCodeAt(0) === 56191 && char.charCodeAt(1) === 57343) || // U+EFFFF, or \uDB7F\uDFFF
    (char.charCodeAt(0) === 56255 && char.charCodeAt(1) === 57342) || // U+FFFFE, or \uDBBF\uDFFE
    (char.charCodeAt(0) === 56255 && char.charCodeAt(1) === 57343) || // U+FFFFF, or \uDBBF\uDFFF
    (char.charCodeAt(0) === 56319 && char.charCodeAt(1) === 57342) || // U+10FFFE, or \uDBFF\uDFFE
    (char.charCodeAt(0) === 56319 && char.charCodeAt(1) === 57343) // U+10FFFF, or \uDBFF\uDFFF
  ) {
    return false;
  }
  return true;
}

function characterSuitableForNames(char) {
  return /[-_A-Za-z0-9]/.test(char);
}

function prepHopefullyAnArray(something, name) {
  if (!something) {
    return [];
  }
  if (Array.isArray(something)) {
    return something.filter((val) => typeof val === "string" && val.trim());
  }
  if (typeof something === "string") {
    return something.trim() ? [something] : [];
  }
  throw new TypeError(
    `string-strip-html/stripHtml(): [THROW_ID_03] ${name} must be array containing zero or more strings or something falsey. Currently it's equal to: ${something}, that a type of ${typeof something}.`
  );
}

export {
  isValidAttributeCharacter,
  characterSuitableForNames,
  prepHopefullyAnArray,
};
