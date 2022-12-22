import checkForWhitespace from "./checkForWhitespace";
import {
  basicColorNames,
  extendedColorNames,
  sixDigitHexColorRegex,
} from "./constants";
import { isLetter } from "codsen-utils";
import { ErrorObj } from "./commonTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

interface Obj {
  [key: string]: any;
}

// we'll allow granular filtering of all color types
interface Opts {
  namedCssLevel1OK: boolean;
  namedCssLevel2PlusOK: boolean;
  hexThreeOK: boolean;
  hexFourOK: boolean;
  hexSixOK: boolean;
  hexEightOK: boolean;
}
const defaults: Opts = {
  namedCssLevel1OK: true,
  namedCssLevel2PlusOK: true,
  hexThreeOK: false,
  hexFourOK: false,
  hexSixOK: true,
  hexEightOK: false,
};

function validateColor(
  str: string,
  idxOffset: number,
  originalOpts: Partial<Opts>
): ErrorObj[] {
  let opts: Opts = { ...defaults, ...originalOpts };

  // we get trimmed string start and end positions, also an encountered errors array
  let { charStart, charEnd, errorArr } = checkForWhitespace(str, idxOffset);

  // now that we know where non-whitespace chars are, evaluate them
  if (typeof charStart === "number" && typeof charEnd === "number") {
    // we need to extract the trimmed attribute's value
    // either it will be "str" (no inner whitespace) or
    // str.slice(charStart, charEnd) (whitespace found previously)
    let attrVal = errorArr.length ? str.slice(charStart, charEnd) : str;

    if (
      attrVal.length > 1 &&
      isLetter(attrVal[0]) &&
      isLetter(attrVal[1]) &&
      Object.keys(extendedColorNames).includes(attrVal.toLowerCase())
    ) {
      DEV &&
        console.log(
          `060 ${`\u001b[${32}m${`known color name "${attrVal.toLowerCase()}" matched`}\u001b[${39}m`}`
        );

      if (!opts.namedCssLevel1OK) {
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: `Named colors (CSS Level 1) not allowed.`,
          fix: {
            ranges: [
              [
                idxOffset + charStart,
                idxOffset + charEnd,
                (extendedColorNames as Obj)[attrVal.toLowerCase()],
              ],
            ],
          },
        });
      } else if (
        !opts.namedCssLevel2PlusOK &&
        (!opts.namedCssLevel1OK ||
          !Object.keys(basicColorNames).includes(attrVal.toLowerCase()))
      ) {
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: `Named colors (CSS Level 2+) not allowed.`,
          fix: {
            ranges: [
              [
                idxOffset + charStart,
                idxOffset + charEnd,
                (extendedColorNames as Obj)[attrVal.toLowerCase()],
              ],
            ],
          },
        });
      }
    } else if (attrVal.startsWith("#")) {
      if (attrVal.length !== 7) {
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: `Hex color code should be 6 digits-long.`,
          fix: null,
        });
      } else if (!sixDigitHexColorRegex.test(attrVal)) {
        DEV &&
          console.log(
            `109 ${`\u001b[${32}m${`attribute's value "${attrVal.toLowerCase()}" didn't pass the sixDigitHexColorRegex regex`}\u001b[${39}m`}`
          );
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: `Unrecognised hex code.`,
          fix: null,
        });
      } else if (!opts.hexSixOK) {
        errorArr.push({
          idxFrom: idxOffset + charStart,
          idxTo: idxOffset + charEnd,
          message: `Hex colors not allowed.`,
          fix: null,
        });
      }
    } else if (attrVal.startsWith("rgb(")) {
      errorArr.push({
        idxFrom: idxOffset + charStart,
        idxTo: idxOffset + charEnd,
        message: `rgb() is not allowed.`,
        fix: null,
      });
    } else {
      errorArr.push({
        idxFrom: idxOffset + charStart,
        idxTo: idxOffset + charEnd,
        message: `Unrecognised color value.`,
        fix: null,
      });
    }
  }

  return errorArr;
}

export default validateColor;
