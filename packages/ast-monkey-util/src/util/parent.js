// calulate parent key, for example,
// "a" => null
// "0" => null
// "a.b" => "a"
// "a.0" => "a"
// "a.0.c" => "0"
function parent(str) {
  if (typeof str === "string") {
    // input must have at least one dot:
    if (!str.includes(".")) {
      return null;
    }
    // quick end - if there's only one dot, return all that's before
    // that dot.
    const lastDotAt = str.lastIndexOf(".");
    if (!str.slice(0, lastDotAt).includes(".")) {
      return str.slice(0, lastDotAt);
    }

    for (let i = lastDotAt - 1; i--; ) {
      console.log(`021 str[${i}] = ${str[i]}`);
      if (str[i] === ".") {
        return str.slice(i + 1, lastDotAt);
      }
    }
  }
  return null;
}

export default parent;
