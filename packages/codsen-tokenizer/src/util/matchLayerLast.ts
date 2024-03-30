// We record ESP tag head and tails as we traverse code because we need to know
// the arrangement of all pieces: start, end, nesting etc.
//
// Now, we keep records of each "layer" - new opening of some sorts: quotes,
// heads of ESP tags and so on.
//
// This function is a helper to check, does something match as a counterpart
// to the last/first layer.
//
// Quotes could be checked here but are not at the moment, here currently
// we deal with ESP tokens only

import { Layer } from "./util";

declare let DEV: boolean;

// RETURNS: undefined or integer, length of a matched ESP lump.
function matchLayerLast(
  wholeEspTagLump: string,
  layers: Layer[],
  matchFirstInstead = false,
): undefined | number {
  if (!layers.length) {
    return;
  }
  let whichLayerToMatch = matchFirstInstead
    ? layers[0]
    : layers[layers.length - 1];

  // DEV && console.log(
  //   `023 matchLayer(): ${`\u001b[${33}m${`whichLayerToMatch`}\u001b[${39}m`} = ${JSON.stringify(
  //     whichLayerToMatch,
  //     null,
  //     4
  //   )}`
  // );

  if (whichLayerToMatch.type !== "esp") {
    // we aim to match ESP tag layers, so instantly it's falsey result
    // because layer we match against is not ESP tag layer
    // DEV && console.log(`033 matchLayer(): early return undefined`);
    return;
  }

  if (
    // imagine case of Nunjucks: heads "{%" are normal but tails "-%}" (notice dash)
    wholeEspTagLump.includes(whichLayerToMatch.guessedClosingLump) ||
    // match every character from the last "layers" complex-type entry must be
    // present in the extracted lump
    Array.from(wholeEspTagLump).every((char) =>
      whichLayerToMatch.guessedClosingLump.includes(char),
    ) ||
    // consider ruby heads, <%# and tails -%>
    (whichLayerToMatch.guessedClosingLump &&
      // length is more than 2
      whichLayerToMatch.guessedClosingLump.length > 2 &&
      // and last two characters match to what was guessed
      whichLayerToMatch.guessedClosingLump[
        whichLayerToMatch.guessedClosingLump.length - 1
      ] === wholeEspTagLump[wholeEspTagLump.length - 1] &&
      whichLayerToMatch.guessedClosingLump[
        whichLayerToMatch.guessedClosingLump.length - 2
      ] === wholeEspTagLump[wholeEspTagLump.length - 2])
  ) {
    DEV &&
      console.log(
        `067 matchLayer(): ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${
          wholeEspTagLump.length
        }`,
      );
    return wholeEspTagLump.length;
  }

  // DEV && console.log(`054 matchLayer(): finally, return undefined`);
}

export default matchLayerLast;
