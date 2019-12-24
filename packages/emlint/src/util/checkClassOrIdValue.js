import { classNameRegex } from "./constants";

function checkClassOrIdValue(str, from, to, errorArr, typeName) {
  console.log(
    `005 ${`\u001b[${36}m${`traverse and extract ${typeName}s`}\u001b[${39}m`}`
  );
  let nameStartsAt = null;
  let nameEndsAt = null;
  for (let i = from; i < to; i++) {
    console.log(
      `011 ${`\u001b[${36}m${`------------------------------------------------\nstr[${i}]`}\u001b[${39}m`} = ${JSON.stringify(
        str[i],
        null,
        4
      )}`
    );

    // catch the beginning of a name
    if (nameStartsAt === null && str[i].trim().length) {
      nameStartsAt = i;
      console.log(
        `022 SET ${`\u001b[${33}m${`nameStartsAt`}\u001b[${39}m`} = ${nameStartsAt}`
      );

      if (nameEndsAt !== null && str.slice(nameEndsAt, i) !== " ") {
        console.log(
          `027 problems with whitespace, carved out ${JSON.stringify(
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
            `039 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
              ranges,
              null,
              4
            )}`
          );
        } else if (str[i - 1] === " ") {
          ranges = [[nameEndsAt, i - 1]];
          console.log(
            `048 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
              ranges,
              null,
              4
            )}`
          );
        } else {
          console.log(`055 worst case scenario, replace the whole whitespace`);
          ranges = [[nameEndsAt, i, " "]];
          console.log(
            `058 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`ranges`}\u001b[${39}m`} = ${JSON.stringify(
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
            ranges: [[nameEndsAt, i, " "]]
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
        `085 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`nameEndsAt`}\u001b[${39}m`} = ${nameEndsAt}`
      );
      console.log(
        `088 ${`\u001b[${32}m${`██`}\u001b[${39}m`} ${`\u001b[${32}m${`carved out ${typeName} name`}\u001b[${39}m`} ${JSON.stringify(
          str.slice(nameStartsAt, i + 1 === to ? i + 1 : i),
          null,
          0
        )}`
      );

      // evaluate
      console.log(`096 ███████████████████████████████████████`);
      console.log(
        `R1 = "${classNameRegex.test(
          str.slice(nameStartsAt, i + 1 === to ? i + 1 : i)
        )}"`
      );
      if (
        !classNameRegex.test(str.slice(nameStartsAt, i + 1 === to ? i + 1 : i))
      ) {
        console.log(
          `106 PUSH ${JSON.stringify(
            {
              idxFrom: nameStartsAt,
              idxTo: i + 1 === to ? i + 1 : i,
              message: `Wrong ${typeName} name.`,
              fix: null
            },
            null,
            4
          )}`
        );
        errorArr.push({
          idxFrom: nameStartsAt,
          idxTo: i + 1 === to ? i + 1 : i,
          message: `Wrong ${typeName} name.`,
          fix: null
        });
      }

      // reset
      nameStartsAt = null;
      console.log(
        `128 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`nameStartsAt`}\u001b[${39}m`} = ${nameStartsAt}`
      );
    }

    console.log(" ");
    console.log(" ");
    console.log(
      `${`\u001b[${90}m${`██ nameStartsAt = ${nameStartsAt}; nameEndsAt = ${nameEndsAt}`}\u001b[${39}m`}`
    );
    console.log(" ");
    console.log(" ");
  }
}

export default checkClassOrIdValue;
