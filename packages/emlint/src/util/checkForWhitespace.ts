import { left, right } from "string-left-right";
import clone from "lodash.clonedeep";

import { ErrorObj, Range } from "./commonTypes";

interface Res {
  charStart: null | number;
  charEnd: null | number;
  errorArr: ErrorObj[];
  trimmedVal: string;
}

function checkForWhitespace(str: string, idxOffset: number): Res {
  // insurance
  if (typeof str !== "string") {
    return { charStart: 0, charEnd: 0, errorArr: [], trimmedVal: "" };
  }

  // We'll catch surrounding whitespace and validate the value in one go. This means, we need to know where non-whitespace value is:
  let charStart = 0; // defaults
  let charEnd: number | null = str.length;
  let trimmedVal;
  let gatheredRanges: Range[] = [];
  let errorArr = [];

  // tackle the inner wrapping whitespace first
  // ...left side:
  if (!str.length || !str[0].trim().length) {
    charStart = right(str) as any; // returns digit or null - index of next non whitespace char on the right
    console.log(
      `031 checkForWhitespace(): ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`charStart`}\u001b[${39}m`} = ${JSON.stringify(
        charStart,
        null,
        4
      )}`
    );
    if (!str.length || charStart === null) {
      // it's just whitespace here
      charEnd = null;
      console.log(
        `041 checkForWhitespace(): PUSH "Missing value." error on [${+idxOffset}, ${
          +idxOffset + str.length
        }]`
      );
      errorArr.push({
        idxFrom: +idxOffset, // that is, idxOffset + 0
        idxTo: +idxOffset + str.length,
        message: `Missing value.`,
        fix: null, // can't fix - value is missing completely!
      });
    } else {
      console.log(
        `053 checkForWhitespace(): PUSH [${idxOffset}, ${
          idxOffset + charStart
        }]`
      );
      gatheredRanges.push([idxOffset, idxOffset + charStart]);
    }
  }
  // ...right side:
  if (charEnd && !str[str.length - 1].trim()) {
    charEnd = (left(str, str.length - 1) as number) + 1;
    console.log(
      `064 checkForWhitespace(): SET ${`\u001b[${33}m${`charEnd`}\u001b[${39}m`} = ${JSON.stringify(
        charEnd,
        null,
        4
      )}`
    );
    gatheredRanges.push([idxOffset + charEnd, idxOffset + str.length]);
  }
  console.log(
    `073 checkForWhitespace(): FIY, ${`\u001b[${33}m${`gatheredRanges`}\u001b[${39}m`} = ${JSON.stringify(
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
      fix: { ranges: clone(gatheredRanges) }, // we can fix - we delete this whitespace!
    });
    // reset:
    gatheredRanges.length = 0;
    trimmedVal = str.trim();
  }
  console.log(`093 checkForWhitespace(): END`);

  return { charStart, charEnd, errorArr, trimmedVal };
}

export default checkForWhitespace;
