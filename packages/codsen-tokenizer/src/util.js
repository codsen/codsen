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

// "is an upper case LATIN letter", that is
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
  // we mean Latin letters A-Z, a-z
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

// it flips all brackets backwards and puts characters in the opposite order
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

export {
  charSuitableForTagName,
  isLowerCaseLetter,
  isUppercaseLetter,
  secondToLastChar,
  isLatinLetter,
  isLowercase,
  flipEspTag,
  secondChar,
  firstChar,
  lastChar,
  isStr,
  isNum
};
