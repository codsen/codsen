function isLetter(str: unknown) {
  return (
    typeof str === "string" &&
    str.length === 1 &&
    str.toUpperCase() !== str.toLowerCase()
  );
}

function isLowercaseLetter(str: unknown) {
  if (!isLetter(str)) {
    return false;
  }
  return str === (str as string).toLowerCase() && str !== str.toUpperCase();
}

function isUppercaseLetter(str: unknown) {
  if (!isLetter(str)) {
    return false;
  }
  return str === (str as string).toUpperCase() && str !== str.toLowerCase();
}

export const roysSort = (a: string, b: string): number => {
  // 1. lowercase letters go in front of uppercase
  if (isUppercaseLetter(a[0]) && isLowercaseLetter(b[0])) {
    return 1;
  }
  if (isLowercaseLetter(a[0]) && isUppercaseLetter(b[0])) {
    return -1;
  }
  // 2. defaults and version go last, but among lowercase letters
  if (
    a === "defaults" ||
    a === "version" ||
    b === "defaults" ||
    b === "version"
  ) {
    if (a === "defaults" && b === "version") {
      return -1;
    }
    if (a === "version" && b === "defaults") {
      return 1;
    }

    // both defaults and version go after any lowercase variable
    if (
      (a !== "defaults" && b === "version") ||
      (a !== "version" && b === "defaults")
    ) {
      return -1;
    }
    if (
      (a === "defaults" && b !== "version") ||
      (a === "version" && b !== "defaults")
    ) {
      return 1;
    }
  }

  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};
