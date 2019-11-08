function lastChar(str) {
  if (!isStr(str) || !str.length) {
    return "";
  }
  return str[str.length - 1];
}
function secondToLastChar(str) {
  if (!isStr(str) || !str.length || str.length === 1) {
    return "";
  }
  return str[str.length - 2];
}
function firstChar(str) {
  if (!isStr(str) || !str.length) {
    return "";
  }
  return str[0];
}
function secondChar(str) {
  if (!isStr(str) || !str.length || str.length === 1) {
    return "";
  }
  return str[1];
}
function isLowerCaseLetter(char) {
  return isStr(char) && char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123;
}
function isUppercaseLetter(char) {
  return (
    isStr(char) &&
    char.length === 1 &&
    char.charCodeAt(0) > 64 &&
    char.charCodeAt(0) < 91
  );
}
function isStr(something) {
  return typeof something === "string";
}
function isNum(something) {
  return typeof something === "number";
}
function isLowercase(char) {
  return (
    isStr(char) && char.toLowerCase() === char && char.toUpperCase() !== char
  );
}
function isLatinLetter(char) {
  return (
    isStr(char) &&
    char.length === 1 &&
    ((char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) ||
      (char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123))
  );
}
function charSuitableForTagName(char) {
  return isLowerCaseLetter(char) || char === ":";
}
function flipEspTag(str) {
  let res = "";
  for (let i = 0, len = str.length; i < len; i++) {
    if (str[i] === "{") {
      res = `}${res}`;
    } else if (str[i] === "(") {
      res = `)${res}`;
    } else {
      res = `${str[i]}${res}`;
    }
  }
  return res;
}

export { charSuitableForTagName, firstChar, flipEspTag, isLatinLetter, isLowerCaseLetter, isLowercase, isNum, isStr, isUppercaseLetter, lastChar, secondChar, secondToLastChar };
