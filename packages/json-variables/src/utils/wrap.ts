import { isMatch } from "matcher";
import { remDup } from "string-remove-duplicate-heads-tails";
import { removeWrappingHeadsAndTails } from "./removeWrappingHeadsAndTails";
import { isStr } from "codsen-utils";
import { Opts } from "../main";

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
      `019 >>>>>>>>>> WRAP(): placementValue = ${JSON.stringify(
        placementValue,
        null,
        4,
      )}`,
    );
  DEV &&
    console.log(
      `027 >>>>>>>>>> WRAP(): breadCrumbPath = ${JSON.stringify(
        breadCrumbPath,
        null,
        4,
      )}`,
    );
  DEV &&
    console.log(
      `035 >>>>>>>>>> WRAP(): newPath = ${JSON.stringify(newPath, null, 4)}`,
    );
  DEV &&
    console.log(
      `039 >>>>>>>>>> WRAP(): oldVarName = ${JSON.stringify(
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
    !resolvedOpts.dontWrapVars.some((val) => isMatch(oldVarName, val)) && // considering double-wrapping prevention setting:
    (!resolvedOpts.preventDoubleWrapping ||
      (resolvedOpts.preventDoubleWrapping &&
        isStr(placementValue) &&
        !placementValue.includes(resolvedOpts.wrapHeadsWith as string) &&
        !placementValue.includes(resolvedOpts.wrapTailsWith as string)))
  ) {
    DEV && console.log("067 +++ WE WILL WRAP THIS!");
    return `${resolvedOpts.wrapHeadsWith}${placementValue}${resolvedOpts.wrapTailsWith}`;
  }
  if (dontWrapTheseVars) {
    DEV &&
      console.log(
        "\n\n\n073 💥💥💥💥💥💥 !!! dontWrapTheseVars is ON!!!\n\n\n",
      );
    DEV &&
      console.log(
        `077 placementValue = ${JSON.stringify(placementValue, null, 4)}`,
      );
    DEV &&
      console.log(
        `081 resolvedOpts.wrapHeadsWith = ${JSON.stringify(
          resolvedOpts.wrapHeadsWith,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `089 resolvedOpts.wrapTailsWith = ${JSON.stringify(
          resolvedOpts.wrapTailsWith,
          null,
          4,
        )}`,
      );

    DEV &&
      console.log(
        `098 about to return:\n${JSON.stringify(
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
        `109 \u001b[${36}m placementValue = ${JSON.stringify(
          placementValue,
          null,
          4,
        )}\u001b[${39}m`,
      );
    if (!isStr(placementValue)) {
      DEV && console.log(`116 Returning placementValue = ${placementValue}`);
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
  DEV && console.log("132 +++ NO WRAP");
  return placementValue;
}
