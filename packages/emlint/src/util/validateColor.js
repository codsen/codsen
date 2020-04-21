import checkForWhitespace from "./checkForWhitespace";
import {
  basicColorNames,
  extendedColorNames,
  sixDigitHexColorRegex,
} from "./constants";
import { isLetter } from "./util";

function validateColor(str, idxOffset, opts) {
  // we'll allow granular filtering of all color types
  // opts:
  // {
  //    namedCssLevel1OK: true,
  //    namedCssLevel2PlusOK: true,
  //    hexSixOK: true
  // }

  // we get trimmed string start and end positions, also an encountered errors array
  const { charStart, charEnd, errorArr } = checkForWhitespace(str, idxOffset);

  // now that we know where non-whitespace chars are, evaluate them
  if (Number.isInteger(charStart)) {
    // we need to extract the trimmed attribute's value
    // either it will be "str" (no inner whitespace) or
    // str.slice(charStart, charEnd) (whitespace found previously)
    const attrVal = errorArr.length ? str.slice(charStart, charEnd) : str;

    if (
      attrVal.length > 1 &&
      isLetter(attrVal[0]) &&
      isLetter(attrVal[1]) &&
      Object.keys(extendedColorNames).includes(attrVal.toLowerCase())
    ) {
      console.log(
        `035 ${`\u001b[${32}m${`known color name "${attrVal.toLowerCase()}" matched`}\u001b[${39}m`}`
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
                extendedColorNames[attrVal.toLowerCase()],
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
                extendedColorNames[attrVal.toLowerCase()],
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
        console.log(
          `083 ${`\u001b[${32}m${`attribute's value "${attrVal.toLowerCase()}" didn't pass the sixDigitHexColorRegex regex`}\u001b[${39}m`}`
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
