import { left, right } from "string-left-right";

function checkForWhitespace(str = "", idxOffset) {
  console.log(
    `005 ${`\u001b[${35}m${`checkForWhitespace() called`}\u001b[${39}m`}\ninput args:\n${JSON.stringify(
      [...arguments],
      null,
      4
    )}`
  );

  // insurance
  if (typeof str !== "string" || !str.length) {
    return { charStart: 0, charEnd: 0, errorArr: [], trimmedVal: "" };
  }

  // We'll catch surrounding whitespace and validate the value in one go. This means, we need to know where non-whitespace value is:
  let charStart = 0; // defaults
  let charEnd = str.length;
  let trimmedVal;
  let gatheredRanges = [];
  const errorArr = [];

  // tackle the inner wrapping whitespace first
  // ...left side:
  if (!str.length || !str[0].trim().length) {
    charStart = right(str); // returns digit or null - index of next non whitespace char on the right
    if (!str.length || charStart === null) {
      // it's just whitespace here
      charEnd = null;
      errorArr.push({
        idxFrom: +idxOffset, // that is, idxOffset + 0
        idxTo: +idxOffset + str.length,
        message: `Missing value.`,
        fix: null, // can't fix - value is missing completely!
      });
    } else {
      gatheredRanges.push([idxOffset, idxOffset + charStart]);
    }
  }
  // ...right side:
  if (charEnd && !str[str.length - 1].trim().length) {
    charEnd = left(str, str.length - 1) + 1;
    console.log(
      `045 ${`\u001b[${33}m${`charEnd`}\u001b[${39}m`} = ${JSON.stringify(
        charEnd,
        null,
        4
      )}`
    );
    gatheredRanges.push([idxOffset + charEnd, idxOffset + str.length]);
  }
  console.log(
    `054 ${`\u001b[${33}m${`gatheredRanges`}\u001b[${39}m`} = ${JSON.stringify(
      gatheredRanges,
      null,
      4
    )}`
  );

  if (!gatheredRanges.length) {
    trimmedVal = str;
  } else {
    errorArr.push({
      idxFrom: gatheredRanges[0][0],
      idxTo: gatheredRanges[gatheredRanges.length - 1][1],
      message: `Remove whitespace.`,
      fix: { ranges: gatheredRanges }, // we can fix - we delete this whitespace!
    });
    // reset:
    gatheredRanges = [];
    trimmedVal = str.trim();
  }
  console.log(`074`);

  return { charStart, charEnd, errorArr, trimmedVal };
}

export default checkForWhitespace;
