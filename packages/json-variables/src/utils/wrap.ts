import { isStr, match } from "codsen-utils";
import { remDup } from "string-remove-duplicate-heads-tails";
import type { Opts } from "../main";
import { removeWrappingHeadsAndTails } from "./removeWrappingHeadsAndTails";

declare let DEV: boolean;

export function wrap(
  placementValue: string,
  resolvedOpts: Opts,
  dontWrapTheseVars = false,
  breadCrumbPath: string[],
  newPath: string,
  oldVarName: string,
): string | false {
  DEV &&
    console.log(
      `018 >>>>>>>>>> WRAP(): placementValue = ${JSON.stringify(
        placementValue,
        null,
        4,
      )}`,
    );
  DEV &&
    console.log(
      `026 >>>>>>>>>> WRAP(): breadCrumbPath = ${JSON.stringify(
        breadCrumbPath,
        null,
        4,
      )}`,
    );
  DEV &&
    console.log(
      `034 >>>>>>>>>> WRAP(): newPath = ${JSON.stringify(newPath, null, 4)}`,
    );
  DEV &&
    console.log(
      `038 >>>>>>>>>> WRAP(): oldVarName = ${JSON.stringify(
        oldVarName,
        null,
        4,
      )}\n`,
    );

  // resolvedOpts validation
  if (!resolvedOpts.wrapHeadsWith) {
    resolvedOpts.wrapHeadsWith = "";
  }
  if (!resolvedOpts.wrapTailsWith) {
    resolvedOpts.wrapTailsWith = "";
  }

  // main resolvedOpts

  if (
    isStr(placementValue) &&
    !dontWrapTheseVars &&
    resolvedOpts.wrapGlobalFlipSwitch &&
    !resolvedOpts.dontWrapVars.some((val) => match(oldVarName, val)) && // considering double-wrapping prevention setting:
    (!resolvedOpts.preventDoubleWrapping ||
      (resolvedOpts.preventDoubleWrapping &&
        isStr(placementValue) &&
        !placementValue.includes(resolvedOpts.wrapHeadsWith as string) &&
        !placementValue.includes(resolvedOpts.wrapTailsWith as string)))
  ) {
    DEV && console.log("066 +++ WE WILL WRAP THIS!");
    return `${resolvedOpts.wrapHeadsWith}${placementValue}${resolvedOpts.wrapTailsWith}`;
  }
  if (dontWrapTheseVars) {
    DEV &&
      console.log(
        "\n\n\n072 💥💥💥💥💥💥 !!! dontWrapTheseVars is ON!!!\n\n\n",
      );
    DEV &&
      console.log(
        `076 placementValue = ${JSON.stringify(placementValue, null, 4)}`,
      );
    DEV &&
      console.log(
        `080 resolvedOpts.wrapHeadsWith = ${JSON.stringify(
          resolvedOpts.wrapHeadsWith,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `088 resolvedOpts.wrapTailsWith = ${JSON.stringify(
          resolvedOpts.wrapTailsWith,
          null,
          4,
        )}`,
      );

    DEV &&
      console.log(
        `097 about to return:\n${JSON.stringify(
          remDup(placementValue, {
            heads: resolvedOpts.wrapHeadsWith,
            tails: resolvedOpts.wrapTailsWith,
          }),
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `108 \u001b[${36}m placementValue = ${JSON.stringify(
          placementValue,
          null,
          4,
        )}\u001b[${39}m`,
      );
    if (!isStr(placementValue)) {
      DEV && console.log(`115 Returning placementValue = ${placementValue}`);
      return placementValue;
    }
    let tempValue = remDup(placementValue, {
      heads: resolvedOpts.wrapHeadsWith,
      tails: resolvedOpts.wrapTailsWith,
    });
    if (!isStr(tempValue)) {
      return tempValue;
    }
    return removeWrappingHeadsAndTails(
      tempValue,
      resolvedOpts.wrapHeadsWith,
      resolvedOpts.wrapTailsWith,
    );
  }
  DEV && console.log("131 +++ NO WRAP");
  return placementValue;
}
