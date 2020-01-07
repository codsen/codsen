import { classNameRegex } from "./constants";
import { left, right } from "string-left-right";
import splitByWhitespace from "./splitByWhitespace";

function checkClassOrIdValue(str, from, to, errorArr, originalOpts) {
  const defaults = {
    typeName: "class"
  };
  const opts = Object.assign({}, defaults, originalOpts);
  console.log(
    `011 checkClassOrIdValue(): FINAL ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );
  console.log(
    `018 checkClassOrIdValue(): ${`\u001b[${36}m${`traverse and extract ${opts.typeName}s`}\u001b[${39}m`}`
  );

  const listOfUniqueNames = [];

  splitByWhitespace(
    str,
    ([charFrom, charTo]) => {
      // value starts at "from" and ends at "to"
      console.log(`027 charFrom = ${charFrom}; charTo = ${charTo}`);
      // evaluate
      const extractedName = str.slice(charFrom, charTo);
      if (!classNameRegex.test(extractedName)) {
        console.log(
          `032 splitByWhitespace(): PUSH ${JSON.stringify(
            {
              idxFrom: charFrom,
              idxTo: charTo,
              message: `Wrong ${opts.typeName} name.`,
              fix: null
            },
            null,
            4
          )}`
        );
        errorArr.push({
          idxFrom: charFrom,
          idxTo: charTo,
          message: `Wrong ${opts.typeName} name.`,
          fix: null
        });
      }

      // check for unique-ness
      if (!listOfUniqueNames.includes(extractedName)) {
        listOfUniqueNames.push(extractedName);
      } else {
        let deleteFrom = charFrom;
        let deleteTo = charTo;
        const nonWhitespaceCharOnTheRight = right(str, deleteTo);
        if (
          deleteTo >= to ||
          !nonWhitespaceCharOnTheRight ||
          nonWhitespaceCharOnTheRight > to
        ) {
          deleteFrom = left(str, charFrom) + 1; // +1 because left() stops
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
            ranges: [[deleteFrom, deleteTo]]
          }
        });
      }
    },
    ([whitespaceFrom, whitespaceTo]) => {
      // whitespace starts at "from" and ends at "to"
      console.log(
        `082 whitespaceFrom = ${whitespaceFrom}; whitespaceTo = ${whitespaceTo}`
      );
      if (str.slice(whitespaceFrom, whitespaceTo) !== " ") {
        console.log(
          `086 splitByWhitespace(): problems with whitespace, carved out ${JSON.stringify(
            str.slice(whitespaceFrom, whitespaceTo),
            null,
            4
          )}`
        );
        // remove the minimal amount of content - if spaces are there
        // already, leave them
        let ranges;
        if (str[whitespaceFrom] === " ") {
          ranges = [[whitespaceFrom + 1, whitespaceTo]];
          console.log(
            `098 splitByWhitespace(): ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
              ranges,
              null,
              4
            )}`
          );
        } else if (str[whitespaceTo - 1] === " ") {
          ranges = [[whitespaceFrom, whitespaceTo - 1]];
          console.log(
            `107 splitByWhitespace(): ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
              ranges,
              null,
              4
            )}`
          );
        } else {
          console.log(
            `115 splitByWhitespace(): worst case scenario, replace the whole whitespace`
          );
          ranges = [[whitespaceFrom, whitespaceTo, " "]];
          console.log(
            `119 splitByWhitespace(): ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
              ranges,
              null,
              4
            )}`
          );
        }

        // raise an error about this excessive/wrong whitespace
        errorArr.push({
          idxFrom: whitespaceFrom,
          idxTo: whitespaceTo,
          message: `Should be a single space.`,
          fix: {
            ranges
          }
        });
      }
    },
    {
      from,
      to
    }
  );
}

export default checkClassOrIdValue;
