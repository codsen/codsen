import { left, right } from "string-left-right";

import { classNameRegex } from "./constants";
import splitByWhitespace from "./splitByWhitespace";
import isSingleSpace from "./isSingleSpace";
import { ErrorObj } from "./commonTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare let DEV: boolean;

interface Opts {
  typeName: string;
  from: number;
  to: number;
  offset: number;
}

function checkClassOrIdValue(
  str: string,
  originalOpts: Partial<Opts>,
  errorArr: ErrorObj[]
): void {
  let defaults: Opts = {
    typeName: "class",
    from: 0,
    to: str.length,
    offset: 0,
  };
  let opts: Opts = { ...defaults, ...originalOpts };
  DEV &&
    console.log(
      `032 checkClassOrIdValue(): FINAL ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
        opts,
        null,
        4
      )}`
    );
  DEV &&
    console.log(
      `040 checkClassOrIdValue(): ${`\u001b[${36}m${`traverse and extract ${opts.typeName}s`}\u001b[${39}m`}`
    );

  let listOfUniqueNames = new Set();

  splitByWhitespace(
    //
    //
    //
    //
    //
    //
    //
    str,
    //
    //
    //
    //
    //
    //
    //
    ([charFrom, charTo]) => {
      // value starts at "from" and ends at "to"
      DEV && console.log(`063 charFrom = ${charFrom}; charTo = ${charTo}`);
      // evaluate
      let extractedName = str.slice(charFrom, charTo);
      if (!classNameRegex.test(extractedName)) {
        DEV &&
          console.log(
            `069 splitByWhitespace(): PUSH ${JSON.stringify(
              {
                idxFrom: charFrom,
                idxTo: charTo,
                message: `Wrong ${opts.typeName} name.`,
                fix: null,
              },
              null,
              4
            )}`
          );
        errorArr.push({
          idxFrom: charFrom,
          idxTo: charTo,
          message: `Wrong ${opts.typeName} name.`,
          fix: null,
        });
      }

      // check for unique-ness
      if (!listOfUniqueNames.has(extractedName)) {
        listOfUniqueNames.add(extractedName);
      } else {
        let deleteFrom = charFrom;
        let deleteTo = charTo;
        let nonWhitespaceCharOnTheRight = right(str, deleteTo);
        if (
          deleteTo >= opts.to ||
          !nonWhitespaceCharOnTheRight ||
          nonWhitespaceCharOnTheRight > opts.to
        ) {
          deleteFrom = (left(str, charFrom) as number) + 1; // +1 because left() stops
          // to the left of the character - if it was without, that first non-
          // whitespace character would have been included
        } else {
          deleteTo = nonWhitespaceCharOnTheRight;
        }
        errorArr.push({
          idxFrom: charFrom,
          idxTo: charTo,
          message: `Duplicate ${opts.typeName} "${extractedName}".`,
          fix: {
            ranges: [[deleteFrom, deleteTo]],
          },
        });
      }
    },
    //
    //
    //
    //
    //
    //
    //
    ([whitespaceFrom, whitespaceTo]) => {
      isSingleSpace(
        str,
        {
          from: whitespaceFrom,
          to: whitespaceTo,
          offset: opts.offset,
        },
        errorArr
      );
    },
    //
    //
    //
    //
    //
    //
    //
    opts // whole opts object is being passed further
  );
}

export default checkClassOrIdValue;
