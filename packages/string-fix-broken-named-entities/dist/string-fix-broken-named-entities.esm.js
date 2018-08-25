import rangesMerge from 'ranges-merge';

function stringFixBrokenNamedEntities(str) {
  let state_AmpersandNotNeeded = false;
  const nbspDefault = {
    nameStartsAt: null,
    ampersandNecessary: null,
    patience: 1,
    matchedN: false,
    matchedB: false,
    matchedS: false,
    matchedP: false
  };
  let nbsp = Object.assign({}, nbspDefault);
  const nbspWipe = () => {
    nbsp = nbspDefault;
  };
  if (typeof str !== "string") {
    throw new Error(
      `string-fix-broken-named-entities: [THROW_ID_01] the input must be string! Currently we've been given ${typeof str}, equal to:\n${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  }
  const rangesArr = [];
  outerloop: for (let i = 0, len = str.length + 1; i < len; i++) {
    console.log(
      `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${`\u001b[${31}m${
        str[i]
          ? str[i].trim() === ""
            ? str[i] === null
              ? "null"
              : str[i] === "\n"
                ? "line break"
                : str[i] === "\t"
                  ? "tab"
                  : str[i] === " "
                    ? "space"
                    : "???"
            : str[i]
          : "undefined"
      }\u001b[${39}m`}`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m`
    );
    if (
      nbsp.nameStartsAt !== null &&
      nbsp.matchedN &&
      nbsp.matchedB &&
      nbsp.matchedS &&
      nbsp.matchedP &&
      str[i] !== ";"
    ) {
      console.log(
        `\u001b[${32}m${`129 ENDING OF AN NBSP; PUSH [${
          nbsp.nameStartsAt
        }, ${i}]`}\u001b[${39}m`
      );
      rangesArr.push([nbsp.nameStartsAt, i, "&nbsp;"]);
      nbspWipe();
      console.log(
        `136 WIPE ${`\u001b[${33}m${`nbsp`}\u001b[${39}m`}, now = ${JSON.stringify(
          nbsp,
          null,
          4
        )}`
      );
    }
    if (str[i] === "&") {
      console.log("158 & caught");
      if (
        str[i + 1] === "a" &&
        str[i + 2] === "m" &&
        str[i + 3] === "p" &&
        str[i + 4] === ";"
      ) {
        state_AmpersandNotNeeded = true;
        let endingOfAmpRepetition = i + 5;
        while (
          str[endingOfAmpRepetition] === "a" &&
          str[endingOfAmpRepetition + 1] === "m" &&
          str[endingOfAmpRepetition + 2] === "p" &&
          str[endingOfAmpRepetition + 3] === ";"
        ) {
          endingOfAmpRepetition += 4;
        }
        rangesArr.push([i + 1, endingOfAmpRepetition]);
        console.log(
          `182 PUSH \u001b[${33}m${`[${i +
            1}, ${endingOfAmpRepetition}]`}\u001b[${39}m`
        );
        i = endingOfAmpRepetition - 1;
        continue outerloop;
      }
      if (nbsp.nameStartsAt !== null) {
        if (nbsp.ampersandNecessary === null) {
          nbsp.nameStartsAt = i;
          console.log(
            `199 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
              nbsp.nameStartsAt
            }`
          );
          nbsp.ampersandNecessary = false;
          console.log(
            `205 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = ${
              nbsp.ampersandNecessary
            }`
          );
        }
      }
    }
    if (str[i] && str[i].toLowerCase() === "n") {
      console.log("215 n caught");
      nbsp.matchedN = true;
      if (nbsp.nameStartsAt === null) {
        nbsp.nameStartsAt = i;
        console.log(
          `221 SET ${`\u001b[${33}m${`nbsp.nameStartsAt`}\u001b[${39}m`} = ${
            nbsp.nameStartsAt
          }`
        );
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
          console.log(
            `230 SET ${`\u001b[${33}m${`nbsp.ampersandNecessary`}\u001b[${39}m`} = ${
              nbsp.ampersandNecessary
            }`
          );
        }
      }
    }
    if (str[i] && str[i].toLowerCase() === "b") {
      console.log("240 b caught");
      if (nbsp.nameStartsAt !== null) {
        nbsp.matchedB = true;
        console.log(
          `245 SET ${`\u001b[${33}m${`nbsp.matchedB`}\u001b[${39}m`} = ${
            nbsp.matchedB
          }`
        );
      }
    }
    if (str[i] && str[i].toLowerCase() === "s") {
      console.log("254 s caught");
      if (nbsp.nameStartsAt !== null) {
        nbsp.matchedS = true;
        console.log(
          `259 SET ${`\u001b[${33}m${`nbsp.matchedS`}\u001b[${39}m`} = ${
            nbsp.matchedS
          }`
        );
      }
    }
    if (str[i] && str[i].toLowerCase() === "p") {
      console.log("268 p caught");
      if (nbsp.nameStartsAt !== null) {
        nbsp.matchedP = true;
        console.log(
          `273 SET ${`\u001b[${33}m${`nbsp.matchedP`}\u001b[${39}m`} = ${
            nbsp.matchedP
          }`
        );
      }
    }
    if (state_AmpersandNotNeeded) {
      state_AmpersandNotNeeded = false;
      console.log(
        `297 SET ${`\u001b[${33}m${`state_AmpersandNotNeeded`}\u001b[${39}m`} = ${JSON.stringify(
          state_AmpersandNotNeeded,
          null,
          4
        )}`
      );
    }
    console.log("---------------");
    console.log(`state_AmpersandNotNeeded = ${state_AmpersandNotNeeded}`);
    console.log(
      `${`\u001b[${33}m${`nbsp`}\u001b[${39}m`} = ${JSON.stringify(
        nbsp,
        null,
        4
      )}`
    );
  }
  return rangesArr.length ? rangesMerge(rangesArr) : null;
}

export default stringFixBrokenNamedEntities;
