import checkForWhitespace from "./checkForWhitespace";
import { ErrorObj } from "./commonTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

function validateScript(
  str: string,
  idxOffset: number
  // opts
): ErrorObj[] {
  // DEV && console.log(
  //   `005 validateScript(): ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
  //     opts,
  //     null,
  //     4
  //   )}`
  // );

  // we get trimmed string start and end positions, also an encountered errors array
  // const { charStart, charEnd, errorArr } = checkForWhitespace(str, idxOffset);
  let { errorArr } = checkForWhitespace(str, idxOffset);

  // now that we know where non-whitespace chars are, we can evaluate them

  // if (Number.isInteger(charStart)) {
  //   TODO: SOMETHING MORE
  // }

  return errorArr;
}

export default validateScript;
