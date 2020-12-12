function isNotLetter(char) {
  return (
    char === undefined ||
    (char.toUpperCase() === char.toLowerCase() &&
      !/\d/.test(char) &&
      char !== "=")
  );
}

export { isNotLetter };
