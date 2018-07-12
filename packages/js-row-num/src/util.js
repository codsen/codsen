// beefed up version from:
// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart

function existy(x) {
  return x != null;
}

function padStart(str, targetLength, padString) {
  targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
  padString = existy(padString) ? String(padString) : " ";
  if (!existy(str)) {
    return str;
  } else if (typeof str === "number") {
    str = String(str);
  } else if (typeof str !== "string") {
    return str;
  }
  console.log("019 padStart() CALLED WITH:");
  console.log(
    `021 ${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
      str,
      null,
      4
    )}`
  );
  console.log(
    `024 ${`\u001b[${33}m${`targetLength`}\u001b[${39}m`} = ${JSON.stringify(
      targetLength,
      null,
      4
    )}`
  );
  console.log(
    `031 ${`\u001b[${33}m${`padString`}\u001b[${39}m`} = ${JSON.stringify(
      padString,
      null,
      4
    )}`
  );
  console.log("\n--------\n");

  if (str.length >= targetLength) {
    console.log(
      `045 str.length = ${
        str.length
      } >= targetLength = ${targetLength}, SO RETURNING:\nstr = ${str}`
    );
    return str;
  }

  targetLength = targetLength - str.length;
  console.log(
    `054 SET ${`\u001b[${33}m${`targetLength`}\u001b[${39}m`} = ${JSON.stringify(
      targetLength,
      null,
      4
    )}`
  );
  if (targetLength > padString.length) {
    padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
  }
  console.log("063 ABOUT TO RETURN:\n");
  console.log(
    `padString.slice(0, targetLength) = ${padString.slice(0, targetLength)}`
  );
  console.log("   +");
  console.log(`str = ${str}`);
  return padString.slice(0, targetLength) + str;
}

export { padStart };
