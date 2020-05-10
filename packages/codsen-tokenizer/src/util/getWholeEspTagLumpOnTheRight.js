import { espChars } from "./util";

function getWholeEspTagLumpOnTheRight(str, i, layers) {
  let wholeEspTagLumpOnTheRight = str[i];
  const len = str.length;

  console.log(
    `008 getWholeEspTagLumpOnTheRight(): ${`\u001b[${32}m${`START`}\u001b[${39}m`}`
  );

  for (let y = i + 1; y < len; y++) {
    console.log(
      `013 getWholeEspTagLumpOnTheRight(): ${`\u001b[${36}m${`str[${y}]=${str[y]}`}\u001b[${39}m`}`
    );
    if (
      // consider:
      // ${(y/4)?int}
      //   ^
      //   we're here - is this opening bracket part of heads?!?

      // if lump already is two chars long
      wholeEspTagLumpOnTheRight.length > 1 &&
      // contains one of opening-polarity characters
      (wholeEspTagLumpOnTheRight.includes(`{`) ||
        wholeEspTagLumpOnTheRight.includes(`[`) ||
        wholeEspTagLumpOnTheRight.includes(`(`)) &&
      // bail if it's a bracket
      str[y] === "("
    ) {
      console.log(
        `031 getWholeEspTagLumpOnTheRight(): ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`
      );
      break;
    }

    if (
      espChars.includes(str[y]) ||
      (str[i] === "<" && str[y] === "/") ||
      // accept closing bracket if it's RPL comment, tails of: <#-- z -->
      (str[y] === ">" &&
        wholeEspTagLumpOnTheRight === "--" &&
        Array.isArray(layers) &&
        layers.length &&
        layers[layers.length - 1].type === "esp" &&
        layers[layers.length - 1].openingLump[0] === "<" &&
        layers[layers.length - 1].openingLump[2] === "-" &&
        layers[layers.length - 1].openingLump[3] === "-")
    ) {
      wholeEspTagLumpOnTheRight += str[y];
    } else {
      console.log(`051 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
      break;
    }
  }

  // if lump is tails+heads, report the length of tails only:
  // {%- a -%}{%- b -%}
  //        ^
  //      we're talking about this lump of tails and heads
  if (
    wholeEspTagLumpOnTheRight &&
    Array.isArray(layers) &&
    layers.length &&
    layers[layers.length - 1].type === "esp" &&
    layers[layers.length - 1].guessedClosingLump &&
    wholeEspTagLumpOnTheRight.length >
      layers[layers.length - 1].guessedClosingLump.length
  ) {
    //
    // case I.
    //
    if (
      wholeEspTagLumpOnTheRight.endsWith(layers[layers.length - 1].openingLump)
    ) {
      // no need to extract tails, heads "{%-" were confirmed in example:
      // {%- a -%}{%- b -%}
      //          ^
      //         here

      // return string, extracted ESP tails
      return wholeEspTagLumpOnTheRight.slice(
        0,
        wholeEspTagLumpOnTheRight.length -
          layers[layers.length - 1].openingLump.length
      );
    }

    // ELSE

    // imagine a case like:
    // {%- aa %}{% bb %}

    // opening heads were {%-, flipped were -%}. Now when we take lump %}{%
    // and match, the dash will be missing.
    // What we're going to do is we'll split the lump where last matched
    // continuous chunk ends (%} in example above) with condition that
    // at least one character from ESP-list follows, which is not part of
    // guessed closing lump.

    let uniqueCharsListFromGuessedClosingLumpArr = new Set(
      layers[layers.length - 1].guessedClosingLump
    );

    let found = 0;
    for (let y = 0, len2 = wholeEspTagLumpOnTheRight.length; y < len2; y++) {
      if (
        !uniqueCharsListFromGuessedClosingLumpArr.has(
          wholeEspTagLumpOnTheRight[y]
        ) &&
        found > 1
      ) {
        return wholeEspTagLumpOnTheRight.slice(0, y);
      }

      if (
        uniqueCharsListFromGuessedClosingLumpArr.has(
          wholeEspTagLumpOnTheRight[y]
        )
      ) {
        found += 1;
        uniqueCharsListFromGuessedClosingLumpArr = new Set(
          [...uniqueCharsListFromGuessedClosingLumpArr].filter(
            (el) => el !== wholeEspTagLumpOnTheRight[y]
          )
        );
      }
    }
  }

  console.log(`130 getWholeEspTagLumpOnTheRight(): final return`);

  return wholeEspTagLumpOnTheRight;
}

export default getWholeEspTagLumpOnTheRight;
