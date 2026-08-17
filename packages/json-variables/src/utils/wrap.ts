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
      `>>>>>>>>>> WRAP(): placementValue = ${JSON.stringify(
        placementValue,
        null,
        4,
      )}`,
    );
  DEV &&
    console.log(
      `>>>>>>>>>> WRAP(): breadCrumbPath = ${JSON.stringify(
        breadCrumbPath,
        null,
        4,
      )}`,
    );
  DEV &&
    console.log(
      `>>>>>>>>>> WRAP(): newPath = ${JSON.stringify(newPath, null, 4)}`,
    );
  DEV &&
    console.log(
      `>>>>>>>>>> WRAP(): oldVarName = ${JSON.stringify(
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
    DEV && console.log("+++ WE WILL WRAP THIS!");
    return `${resolvedOpts.wrapHeadsWith}${placementValue}${resolvedOpts.wrapTailsWith}`;
  }
  if (dontWrapTheseVars) {
    DEV &&
      console.log("\n\n\n💥💥💥💥💥💥 !!! dontWrapTheseVars is ON!!!\n\n\n");
    DEV &&
      console.log(
        `placementValue = ${JSON.stringify(placementValue, null, 4)}`,
      );
    DEV &&
      console.log(
        `resolvedOpts.wrapHeadsWith = ${JSON.stringify(
          resolvedOpts.wrapHeadsWith,
          null,
          4,
        )}`,
      );
    DEV &&
      console.log(
        `resolvedOpts.wrapTailsWith = ${JSON.stringify(
          resolvedOpts.wrapTailsWith,
          null,
          4,
        )}`,
      );

    DEV &&
      console.log(
        `about to return:\n${JSON.stringify(
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
        `\u001b[${36}m placementValue = ${JSON.stringify(
          placementValue,
          null,
          4,
        )}\u001b[${39}m`,
      );
    if (!isStr(placementValue)) {
      DEV && console.log(`Returning placementValue = ${placementValue}`);
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
  DEV && console.log("+++ NO WRAP");
  return placementValue;
}
