import { left, right } from "string-left-right";
import { classNameRegex } from "./constants";
import splitByWhitespace from "./splitByWhitespace";
import isSingleSpace from "./isSingleSpace";
import { ErrorObj } from "./commonTypes";

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
  const defaults: Opts = {
    typeName: "class",
    from: 0,
    to: str.length,
    offset: 0,
  };
  const opts: Opts = { ...defaults, ...originalOpts };
  console.log(
    `015 checkClassOrIdValue(): FINAL ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );
  console.log(
    `022 checkClassOrIdValue(): ${`\u001b[${36}m${`traverse and extract ${opts.typeName}s`}\u001b[${39}m`}`
  );

  const listOfUniqueNames = new Set();

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
      console.log(`045 charFrom = ${charFrom}; charTo = ${charTo}`);
      // evaluate
      const extractedName = str.slice(charFrom, charTo);
      if (!classNameRegex.test(extractedName)) {
        console.log(
          `050 splitByWhitespace(): PUSH ${JSON.stringify(
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
        const nonWhitespaceCharOnTheRight = right(str, deleteTo);
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
    ([whitespaceFrom, whitespaceTo]) =>
      isSingleSpace(
        str,
        {
          from: whitespaceFrom,
          to: whitespaceTo,
          offset: opts.offset,
        },
        errorArr
      ),
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
