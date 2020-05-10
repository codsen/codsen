// RETURNS: undefined or integer, length of a matched ESP lump.
function matchLayerLast(wholeEspTagLump, layers, matchFirstInstead) {
  if (!layers.length) {
    return;
  }
  const whichLayerToMatch = matchFirstInstead
    ? layers[0]
    : layers[layers.length - 1];

  console.log(
    `011 matchLayer(): ${`\u001b[${33}m${`whichLayerToMatch`}\u001b[${39}m`} = ${JSON.stringify(
      whichLayerToMatch,
      null,
      4
    )}`
  );

  if (whichLayerToMatch.type !== "esp") {
    // we aim to match ESP tag layers, so instantly it's falsey result
    // because layer we match against is not ESP tag layer
    console.log(`021 matchLayer(): early return undefined`);
    return;
  }

  if (
    // match every character from the last "layers" complex-type entry must be
    // present in the extracted lump
    Array.from(wholeEspTagLump).every((char) =>
      whichLayerToMatch.guessedClosingLump.includes(char)
    )
  ) {
    console.log(
      `033 matchLayer(): ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${
        wholeEspTagLump.length
      }`
    );
    return wholeEspTagLump.length;
  }

  console.log(`040 matchLayer(): finally, return undefined`);
}

export default matchLayerLast;
