import { flipEspTag, espChars } from "./util";

// RETURNS: bool false or integer, length of a matched ESP lump.
function matchLayerLast(str, i, layers, matchFirstInstead) {
  if (!layers.length) {
    return false;
  }
  const whichLayerToMatch = matchFirstInstead
    ? layers[0]
    : layers[layers.length - 1];
  console.log(
    `012 matchLayerLast(): ${`\u001b[${33}m${`whichLayerToMatch`}\u001b[${39}m`} = ${JSON.stringify(
      whichLayerToMatch,
      null,
      4
    )}`
  );
  if (whichLayerToMatch.type === "simple") {
    return (
      !whichLayerToMatch.value || str[i] === flipEspTag(whichLayerToMatch.value)
    );
  }
  if (whichLayerToMatch.type === "esp") {
    console.log(`024 matchLayerLast(): matching esp tag`);
    if (
      !espChars.includes(str[i]) &&
      !(
        str[i] === ">" &&
        Array.isArray(layers) &&
        layers.length &&
        layers[layers.length - 1].type === "esp" &&
        layers[layers.length - 1].openingLump[0] === "<"
      )
    ) {
      console.log(
        `036 matchLayerLast(): return false because ${str[i]} is not ESP char`
      );
      return false;
    }

    let wholeEspTagLump = "";
    if (str[i] === ">") {
      wholeEspTagLump = ">";
    } else {
      console.log(`045 matchLayerLast(): extracting esp lump`);
      // so the first character is from ESP tags list
      // 1. extract esp tag lump
      console.log(
        `049 matchLayerLast(): ${`\u001b[${36}m${`LOOP`}\u001b[${39}m`}`
      );
      for (let y = i; y < str.length; y++) {
        console.log(
          `053 ${`\u001b[${36}m${`---- str[${y}]=${str[y]}`}\u001b[${39}m`}`
        );
        if (espChars.includes(str[y])) {
          wholeEspTagLump += str[y];
        } else {
          console.log(`058 ${`\u001b[${36}m${`---- BREAK`}\u001b[${39}m`}`);
          break;
        }
      }
    }

    console.log(
      `065 matchLayerLast(): ${`\u001b[${33}m${`wholeEspTagLump`}\u001b[${39}m`} = ${JSON.stringify(
        wholeEspTagLump,
        null,
        4
      )}`
    );
    console.log(
      `072 matchLayerLast(): ${`\u001b[${33}m${`whichLayerToMatch.openingLump`}\u001b[${39}m`} = ${JSON.stringify(
        whichLayerToMatch.openingLump,
        null,
        4
      )}`
    );

    if (wholeEspTagLump.length === 1) {
      console.log(
        `081 matchLayerLast(): ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} 1`
      );
      return 1;
    }

    // if lump is tails+heads, report the length of tails only:
    // {%- a -%}{%- b -%}
    //        ^
    //      we're talking about this lump of tails and heads
    if (
      wholeEspTagLump &&
      whichLayerToMatch.openingLump &&
      wholeEspTagLump.length > whichLayerToMatch.guessedClosingLump.length
    ) {
      if (wholeEspTagLump.endsWith(whichLayerToMatch.openingLump)) {
        // no need to extract tails, heads "{%-" were confirmed in example:
        // {%- a -%}{%- b -%}
        //          ^
        //         here
        console.log(
          `101 matchLayerLast(): ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${
            wholeEspTagLump.length - whichLayerToMatch.openingLump.length
          }`
        );
        return wholeEspTagLump.length - whichLayerToMatch.openingLump.length;
      }
      // else {
      // imagine case like:
      // {%- aa %}{% bb %}
      // opening heads were {%-, flipped were -%}. Now when we take lump %}{%
      // and match, the dash will be missing.
      // What we're going to do is we'll split the lump where last matched
      // continuous chunk ends (%} in example above) with condition that
      // at least one character from ESP-list follows, which is not part of
      // guessed closing lump.
      let uniqueCharsListFromGuessedClosingLumpArr = new Set(
        whichLayerToMatch.guessedClosingLump
      );

      console.log(
        `121 ${`\u001b[${33}m${`uniqueCharsListFromGuessedClosingLumpArr`}\u001b[${39}m`} = ${JSON.stringify(
          uniqueCharsListFromGuessedClosingLumpArr,
          null,
          0
        )}`
      );

      let found = 0;
      for (let y = 0, len2 = wholeEspTagLump.length; y < len2; y++) {
        console.log(`130 char = ${wholeEspTagLump[y]}`);

        if (
          !uniqueCharsListFromGuessedClosingLumpArr.has(wholeEspTagLump[y]) &&
          found > 1
        ) {
          console.log(`136 RETURN ${y}`);
          return y;
        }

        if (uniqueCharsListFromGuessedClosingLumpArr.has(wholeEspTagLump[y])) {
          found += 1;
          uniqueCharsListFromGuessedClosingLumpArr = new Set(
            [...uniqueCharsListFromGuessedClosingLumpArr].filter(
              (el) => el !== wholeEspTagLump[y]
            )
          );
          console.log(
            `148 SET found = ${found}; uniqueCharsListFromGuessedClosingLumpArr = ${JSON.stringify(
              uniqueCharsListFromGuessedClosingLumpArr,
              null,
              0
            )}`
          );
        }
      }
    } else if (
      // match every character from the last "layers" complex-type entry must be
      // present in the extracted lump
      whichLayerToMatch.guessedClosingLump
        .split("")
        .every((char) => wholeEspTagLump.includes(char))
    ) {
      console.log(`163 RETURN ${wholeEspTagLump.length}`);
      return wholeEspTagLump.length;
    }
  }
}

export default matchLayerLast;
