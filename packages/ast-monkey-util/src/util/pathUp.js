function pathUp(str) {
  if (typeof str === "string") {
    // input must have at least two dots:
    if (!str.includes(".") || !str.slice(str.indexOf(".") + 1).includes(".")) {
      // zero is the root level's first element
      return "0";
    }
    // go up, for example, from "a.children.2" to "a"
    let dotsCount = 0;
    for (let i = str.length; i--; ) {
      // console.log(`010 str[${i}] = ${str[i]}`);
      if (str[i] === ".") {
        dotsCount += 1;
      }
      if (dotsCount === 2) {
        return str.slice(0, i);
      }
    }
  }
  return str;
}

export default pathUp;
