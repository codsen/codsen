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
    if (
      nbsp.nameStartsAt &&
      nbsp.matchedN &&
      nbsp.matchedB &&
      nbsp.matchedS &&
      nbsp.matchedP &&
      str[i] !== ";"
    ) {
      rangesArr.push([nbsp.nameStartsAt, i, "&nbsp;"]);
      nbspWipe();
    }
    if (str[i] === "&") {
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
        i = endingOfAmpRepetition - 1;
        continue outerloop;
      }
      if (!nbsp.nameStartsAt) {
        if (nbsp.ampersandNecessary === null) {
          nbsp.nameStartsAt = i;
          nbsp.ampersandNecessary = false;
        }
      }
    }
    if (str[i] && str[i].toLowerCase() === "n") {
      nbsp.matchedN = true;
      if (!nbsp.nameStartsAt) {
        nbsp.nameStartsAt = i;
        if (nbsp.ampersandNecessary === null && !state_AmpersandNotNeeded) {
          nbsp.ampersandNecessary = true;
        }
      }
    }
    if (str[i] && str[i].toLowerCase() === "b") {
      if (nbsp.nameStartsAt) {
        nbsp.matchedB = true;
      }
    }
    if (str[i] && str[i].toLowerCase() === "s") {
      if (nbsp.nameStartsAt) {
        nbsp.matchedS = true;
      }
    }
    if (str[i] && str[i].toLowerCase() === "p") {
      if (nbsp.nameStartsAt) {
        nbsp.matchedP = true;
      }
    }
    if (state_AmpersandNotNeeded) {
      state_AmpersandNotNeeded = false;
    }
  }
  return rangesArr.length ? rangesMerge(rangesArr) : null;
}

export default stringFixBrokenNamedEntities;
