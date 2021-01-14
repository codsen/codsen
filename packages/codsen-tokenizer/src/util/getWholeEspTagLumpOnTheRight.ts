import { espChars, leftyChars, rightyChars } from "./util";
import getLastEspLayerObjIdx from "./getLastEspLayerObjIdx";
import { Layer, LayerEsp } from "./util";

function getWholeEspTagLumpOnTheRight(
  str: string,
  i: number,
  layers: Layer[]
): string {
  let wholeEspTagLumpOnTheRight = str[i];
  const len = str.length;

  // getLastEspLayerObj()
  const lastEspLayerObj = layers[getLastEspLayerObjIdx(layers) as number];

  console.log(
    `012 getWholeEspTagLumpOnTheRight(): ${`\u001b[${32}m${`START`}\u001b[${39}m`}`
  );

  for (let y = i + 1; y < len; y++) {
    console.log(
      `017 getWholeEspTagLumpOnTheRight(): ${`\u001b[${36}m${`str[${y}]=${str[y]}`}\u001b[${39}m`}`
    );

    // if righty character is on the left and now it's lefty,
    // we have a situation like:
    // {{ abc }}{% endif %}
    //        ^^^^
    //        lump
    //
    // {{ abc }}{% endif %}
    //         ^^
    //         ||
    //    lefty  righty
    //
    // we clice off where righty starts
    if (leftyChars.includes(str[y]) && rightyChars.includes(str[y - 1])) {
      console.log(
        `034 getWholeEspTagLumpOnTheRight(): ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`
      );
      break;
    }

    if (
      // consider:
      // ${(y/4)?int}
      //   ^
      //   we're here - is this opening bracket part of heads?!?
      //
      // or JSP:
      // <%=(new java.util.Date()).toLocaleString()%>
      //    ^

      // if lump already is two chars long
      wholeEspTagLumpOnTheRight.length > 1 &&
      // contains one of opening-polarity characters
      (wholeEspTagLumpOnTheRight.includes(`<`) ||
        wholeEspTagLumpOnTheRight.includes(`{`) ||
        wholeEspTagLumpOnTheRight.includes(`[`) ||
        wholeEspTagLumpOnTheRight.includes(`(`)) &&
      // bail if it's a bracket
      str[y] === "("
    ) {
      console.log(
        `060 getWholeEspTagLumpOnTheRight(): ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`
      );
      break;
    }

    if (
      espChars.includes(str[y]) ||
      // in case it's XML tag-like templating tag, such as JSP,
      // we check, is it in the last guessed lump's character's list
      (lastEspLayerObj &&
        (lastEspLayerObj as LayerEsp).guessedClosingLump.includes(str[y])) ||
      (str[i] === "<" && str[y] === "/") ||
      // accept closing bracket if it's RPL comment, tails of: <#-- z -->
      (str[y] === ">" &&
        wholeEspTagLumpOnTheRight === "--" &&
        Array.isArray(layers) &&
        layers.length &&
        layers[layers.length - 1].type === "esp" &&
        (layers[layers.length - 1] as LayerEsp).openingLump[0] === "<" &&
        (layers[layers.length - 1] as LayerEsp).openingLump[2] === "-" &&
        (layers[layers.length - 1] as LayerEsp).openingLump[3] === "-") ||
      // we do exception for extra characters, such as JSP's
      // exclamation mark: <%! yo %>
      //                     ^
      // which is legit...
      //
      // at least one character must have been caught already
      (!lastEspLayerObj && y > i && `!=@`.includes(str[y]))
    ) {
      wholeEspTagLumpOnTheRight += str[y];
    } else {
      console.log(`091 ${`\u001b[${31}m${`BREAK`}\u001b[${39}m`}`);
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
    (layers[layers.length - 1] as LayerEsp).guessedClosingLump &&
    wholeEspTagLumpOnTheRight.length >
      (layers[layers.length - 1] as LayerEsp).guessedClosingLump.length
  ) {
    //
    // case I.
    //
    if (
      wholeEspTagLumpOnTheRight.endsWith(
        (layers[layers.length - 1] as LayerEsp).openingLump
      )
    ) {
      // no need to extract tails, heads "{%-" were confirmed in example:
      // {%- a -%}{%- b -%}
      //          ^
      //         here

      // return string, extracted ESP tails
      return wholeEspTagLumpOnTheRight.slice(
        0,
        wholeEspTagLumpOnTheRight.length -
          (layers[layers.length - 1] as LayerEsp).openingLump.length
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
      (layers[layers.length - 1] as LayerEsp).guessedClosingLump
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

  console.log(`170 getWholeEspTagLumpOnTheRight(): final return`);

  return wholeEspTagLumpOnTheRight;
}

export default getWholeEspTagLumpOnTheRight;
