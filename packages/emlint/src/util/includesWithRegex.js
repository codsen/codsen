import isRegExp from "lodash.isregexp";

function includesWithRegex(arr, whatToMatch) {
  // console.log(
  //   `005 includesWithRegex() called to match ${JSON.stringify(
  //     whatToMatch,
  //     null,
  //     0
  //   )} against:\n${JSON.stringify(arr, null, 4)}`
  // );
  if (!Array.isArray(arr) || !arr.length) {
    // definitely does not include
    console.log(`013 includesWithRegex() quick end, return false`);
    return false;
  }
  // console.log(
  //   `017 includesWithRegex(): ${`\u001b[${33}m${`whatToMatch`}\u001b[${39}m`} = ${JSON.stringify(
  //     whatToMatch,
  //     null,
  //     4
  //   )}`
  // );

  return arr.some(
    val =>
      (isRegExp(val) && whatToMatch.match(val)) ||
      (typeof val === "string" && whatToMatch === val)
  );
}

export default includesWithRegex;
