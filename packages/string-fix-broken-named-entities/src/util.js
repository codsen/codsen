function isObj(something) {
  return (
    something && typeof something === "object" && !Array.isArray(something)
  );
}

// checks, are there any other non-whitespace characters besides n, b, s or p
function onlyContainsNbsp(str, from, to) {
  for (let i = from; i < to; i++) {
    if (str[i].trim().length && !`nbsp`.includes(str[i].toLowerCase())) {
      return false;
    }
  }
  return true;
}

function isLatinLetterOrNumberOrHash(char) {
  // we mean:
  // - Latin letters a-z or
  // - numbers 0-9 or
  // - letters A-Z or
  // - #
  return (
    isStr(char) &&
    char.length === 1 &&
    ((char.charCodeAt(0) > 96 && char.charCodeAt(0) < 123) ||
      (char.charCodeAt(0) > 47 && char.charCodeAt(0) < 58) ||
      (char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) ||
      char.charCodeAt(0) === 35)
  );
}
function isNumber(something) {
  return (
    isStr(something) &&
    something.charCodeAt(0) > 47 &&
    something.charCodeAt(0) < 58
  );
}

function isNotaLetter(str2) {
  return !(
    typeof str2 === "string" &&
    str2.length === 1 &&
    str2.toUpperCase() !== str2.toLowerCase()
  );
}
function isStr(something) {
  return typeof something === "string";
}
function isLatinLetter(something) {
  return (
    typeof something === "string" &&
    ((something.charCodeAt(0) > 96 && something.charCodeAt(0) < 123) ||
      (something.charCodeAt(0) > 64 && something.charCodeAt(0) < 91))
  );
}

function resemblesNumericEntity(str2, from, to) {
  // plan: loop characters, count types, judge what's given
  let lettersCount = 0;
  let numbersCount = 0;
  let othersCount = 0;
  let hashesCount = 0;
  let whitespaceCount = 0;
  let numbersValue = "";
  let charTrimmed = "";

  for (let i = from; i < to; i++) {
    console.log(
      `070 stringFixBrokenNamedEntities: ${`\u001b[${36}m${`resemblesNumericEntity() loop: str2[${i}] = "${str2[i]}"`}\u001b[${39}m`}`
    );
    if (str2[i].trim().length) {
      charTrimmed += str2[i];
    } else {
      whitespaceCount += 1;
    }
    if (isLatinLetter(str2[i])) {
      lettersCount += 1;
    } else if (isNumber(str2[i])) {
      numbersCount += 1;
      numbersValue += String(str2[i]);
    } else if (str2[i] === "#") {
      hashesCount += 1;
    } else {
      othersCount += 1;
    }
  }
  // if there are more numbers than letters (or equal) then it's more likely
  // to be a numeric entity
  let probablyNumeric = false;

  console.log(
    `093 stringFixBrokenNamedEntities: ${`\u001b[${33}m${`charTrimmed[0]`}\u001b[${39}m`} = ${JSON.stringify(
      charTrimmed[0],
      null,
      4
    )}; ${`\u001b[${33}m${`charTrimmed[1]`}\u001b[${39}m`} = ${JSON.stringify(
      charTrimmed[1],
      null,
      4
    )}`
  );

  // if decimal-type, for example, &#999999;
  // but wide enough to include messed up cases
  if (!lettersCount && numbersCount > othersCount) {
    probablyNumeric = "deci";
  } else if (
    (numbersCount || lettersCount) &&
    ((charTrimmed[0] === "#" &&
      charTrimmed[1].toLowerCase() === "x" &&
      (isNumber(charTrimmed[2]) || isLatinLetter(charTrimmed[2]))) ||
      (charTrimmed[0].toLowerCase() === "x" && numbersCount && !othersCount))
  ) {
    // hexidecimal, for example, &#xA3;
    // but wide enough to include messed up cases
    probablyNumeric = "hexi";
  }

  return {
    probablyNumeric,
    lettersCount,
    numbersCount,
    numbersValue,
    hashesCount,
    othersCount,
    charTrimmed,
    whitespaceCount,
  };
}

export {
  isObj,
  isNumber,
  onlyContainsNbsp,
  isLatinLetterOrNumberOrHash,
  isNotaLetter,
  isStr,
  isLatinLetter,
  resemblesNumericEntity,
};
