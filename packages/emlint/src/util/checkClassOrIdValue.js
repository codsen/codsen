import { classNameRegex } from "./constants";
import { left, right } from "string-left-right";

function checkClassOrIdValue(str, from, to, errorArr, originalOpts) {
  const defaults = {
    typeName: "class"
  };
  const opts = Object.assign({}, defaults, originalOpts);
  console.log(
    `010 checkClassOrIdValue(): FINAL ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );
  console.log(
    `017 checkClassOrIdValue(): ${`\u001b[${36}m${`traverse and extract ${opts.typeName}s`}\u001b[${39}m`}`
  );

  let nameStartsAt = null;
  let nameEndsAt = null;

  const listOfUniqueNames = [];

  for (let i = from; i < to; i++) {
    console.log(
      `027 ${`\u001b[${36}m${`------------------------------------------------\nstr[${i}]`}\u001b[${39}m`} = ${JSON.stringify(
        str[i],
        null,
        4
      )}`
    );

    // catch the beginning of a name
    if (nameStartsAt === null && str[i].trim().length) {
      nameStartsAt = i;
      console.log(
        `038 checkClassOrIdValue(): SET ${`\u001b[${33}m${`nameStartsAt`}\u001b[${39}m`} = ${nameStartsAt}`
      );

      if (nameEndsAt !== null && str.slice(nameEndsAt, i) !== " ") {
        console.log(
          `043 checkClassOrIdValue(): problems with whitespace, carved out ${JSON.stringify(
            str.slice(nameEndsAt, i),
            null,
            4
          )}`
        );
        // remove the minimal amount of content - if spaces are there
        // already, leave them
        let ranges;
        if (str[nameEndsAt] === " ") {
          ranges = [[nameEndsAt + 1, i]];
          console.log(
            `055 checkClassOrIdValue(): ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
              ranges,
              null,
              4
            )}`
          );
        } else if (str[i - 1] === " ") {
          ranges = [[nameEndsAt, i - 1]];
          console.log(
            `064 checkClassOrIdValue(): ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
              ranges,
              null,
              4
            )}`
          );
        } else {
          console.log(
            `072 checkClassOrIdValue(): worst case scenario, replace the whole whitespace`
          );
          ranges = [[nameEndsAt, i, " "]];
          console.log(
            `076 checkClassOrIdValue(): ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
              ranges,
              null,
              4
            )}`
          );
        }

        // raise an error about this excessive/wrong whitespace
        errorArr.push({
          idxFrom: nameEndsAt,
          idxTo: i,
          message: `Should be a single space.`,
          fix: {
            ranges
          }
        });

        // only now reset
        nameEndsAt = null;
      }
    }

    // catch the ending of a name
    if (nameStartsAt !== null && (!str[i].trim().length || i + 1 === to)) {
      nameEndsAt = i + 1 === to ? i + 1 : i;
      console.log(
        `103 checkClassOrIdValue(): ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nameEndsAt`}\u001b[${39}m`} = ${nameEndsAt}`
      );
      console.log(
        `106 checkClassOrIdValue(): ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${32}m${`carved out ${opts.typeName} name`}\u001b[${39}m`} ${JSON.stringify(
          str.slice(nameStartsAt, i + 1 === to ? i + 1 : i),
          null,
          0
        )}`
      );

      // evaluate
      const extractedName = str.slice(nameStartsAt, i + 1 === to ? i + 1 : i);
      if (!classNameRegex.test(extractedName)) {
        console.log(
          `117 checkClassOrIdValue(): PUSH ${JSON.stringify(
            {
              idxFrom: nameStartsAt,
              idxTo: i + 1 === to ? i + 1 : i,
              message: `Wrong ${opts.typeName} name.`,
              fix: null
            },
            null,
            4
          )}`
        );
        errorArr.push({
          idxFrom: nameStartsAt,
          idxTo: i + 1 === to ? i + 1 : i,
          message: `Wrong ${opts.typeName} name.`,
          fix: null
        });
      }

      // check for unique-ness
      if (!listOfUniqueNames.includes(extractedName)) {
        listOfUniqueNames.push(extractedName);
      } else {
        let deleteFrom = nameStartsAt;
        let deleteTo = i + 1 === to ? i + 1 : i;
        const nonWhitespaceCharOnTheRight = right(str, deleteTo);
        if (
          deleteTo >= to ||
          !nonWhitespaceCharOnTheRight ||
          nonWhitespaceCharOnTheRight > to
        ) {
          deleteFrom = left(str, nameStartsAt) + 1; // +1 because left() stops
          // to the left of the character - if it was without, that first non-
          // whitespace character would have been included
        } else {
          deleteTo = nonWhitespaceCharOnTheRight;
        }
        errorArr.push({
          idxFrom: nameStartsAt,
          idxTo: i + 1 === to ? i + 1 : i,
          message: `Duplicate ${opts.typeName} "${extractedName}".`,
          fix: {
            ranges: [[deleteFrom, deleteTo]]
          }
        });
      }

      // reset
      nameStartsAt = null;
      console.log(
        `167 checkClassOrIdValue(): ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`nameStartsAt`}\u001b[${39}m`} = ${nameStartsAt}`
      );
    }

    console.log(" ");
    console.log(" ");
    console.log(
      `${`\u001b[${90}m${`1 checkClassOrIdValue(): ██ nameStartsAt = ${nameStartsAt}; nameEndsAt = ${nameEndsAt}`}\u001b[${39}m`}`
    );
    console.log(" ");
    console.log(" ");
  }
}

export default checkClassOrIdValue;
