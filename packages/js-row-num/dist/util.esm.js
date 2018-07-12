function existy(x) {
  return x != null;
}
function padStart(str, targetLength, padString) {
  targetLength = targetLength >> 0;
  padString = existy(padString) ? String(padString) : " ";
  if (!existy(str)) {
    return str;
  } else if (typeof str === "number") {
    str = String(str);
  } else if (typeof str !== "string") {
    return str;
  }
  if (str.length >= targetLength) {
    return str;
  }
  targetLength = targetLength - str.length;
  if (targetLength > padString.length) {
    padString += padString.repeat(targetLength / padString.length);
  }
  return padString.slice(0, targetLength) + str;
}

export { padStart };
