import { rApply } from "ranges-apply";
import type { Range, Ranges } from "ranges-apply";
import { hasOwnProp } from "codsen-utils";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

export interface MappingObj {
  [key: string]: any;
}

export interface Opts {
  wildcard: string;
  dedupePlease: boolean;
}

const defaults: Opts = {
  wildcard: "*",
  dedupePlease: true,
};

/**
 * Groups array of strings by omitting number characters
 */
function groupStr(arr: string[], opts?: Partial<Opts>): MappingObj {
  if (!Array.isArray(arr)) {
    return arr;
  }
  if (!arr.length) {
    // quick ending
    return {};
  }

  let resolvedOpts: Opts = { ...defaults, ...opts };
  let resolvedArr = resolvedOpts.dedupePlease
    ? [...new Set(arr)]
    : Array.from(arr);

  // traverse the given array
  let compiledObj: MappingObj = {};
  for (let i = 0, len = resolvedArr.length; i < len; i++) {
    DEV &&
      console.log(
        `${`\u001b[${36}m${`-1--------------------`}\u001b[${39}m`}  ${`\u001b[${33}m${`resolvedArr[${i}]`}\u001b[${39}m`} = ${`\u001b[${35}m${
          resolvedArr[i]
        }\u001b[${39}m`}  ${`\u001b[${36}m${`--------------------`}\u001b[${39}m`}`
      );

    // compile an array of digit chunks, consisting of at least one digit
    // (will return null when there are no digits found):
    let digitChunks = resolvedArr[i].match(/\d+/gm);
    DEV &&
      console.log(
        `057 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`digitChunks`}\u001b[${39}m`} = ${JSON.stringify(
          digitChunks,
          null,
          4
        )}`
      );

    if (!digitChunks) {
      // if there were no digits, there's nothing to group, so this string goes
      // straight to output. Just check for duplicates.
      compiledObj[resolvedArr[i]] = {
        count: 1,
      };
      // notice above doesn't have "elementsWhichWeCanReplaceWithWildcards" key
    } else {
      // so there were numbers in that string...

      // first, prepare the reference version of this string with chunks of digits
      // replaced with the wildcard
      let wildcarded = resolvedArr[i].replace(/\d+/gm, resolvedOpts.wildcard);

      // the plan is, in order to extract the pattern, we'll use
      // elementsWhichWeCanReplaceWithWildcards where we'll keep record of the
      // previous element's value. Once the value is different, we set it to Bool
      // "false", marking it for replacement with wildcard.
      if (hasOwnProp(compiledObj, wildcarded)) {
        // so entry already exists for this wildcarded pattern.
        // Let's check each digit chunk where it's not already set to false (submitted
        // for replacement with wildcards), is it different from previous string's
        // chunk at that position (there can be multiple chunks of digits).

        DEV && console.log(`088 compiledObj has entry for "${wildcarded}"`);
        DEV &&
          console.log(
            `091 \u001b[${36}m${`██ ██ ██ CHECK ALL CHUNKS ██ ██ ██`}\u001b[${39}m`
          );
        digitChunks.forEach((digitsChunkStr, i2) => {
          DEV &&
            console.log(
              `096 \u001b[${36}m${`██ chunk i2 = ${i2}, val = ${digitsChunkStr}`}\u001b[${39}m`
            );
          if (
            compiledObj[wildcarded].elementsWhichWeCanReplaceWithWildcards[
              i2
            ] &&
            digitsChunkStr !==
              compiledObj[wildcarded].elementsWhichWeCanReplaceWithWildcards[i2]
          ) {
            DEV &&
              console.log(
                `107 BEFORE compiledObj[wildcarded].elementsWhichWeCanReplaceWithWildcards = ${JSON.stringify(
                  compiledObj[wildcarded]
                    .elementsWhichWeCanReplaceWithWildcards,
                  null,
                  0
                )}`
              );
            compiledObj[wildcarded].elementsWhichWeCanReplaceWithWildcards[i2] =
              false;
            DEV &&
              console.log(
                `118 AFTER compiledObj[wildcarded].elementsWhichWeCanReplaceWithWildcards = ${JSON.stringify(
                  compiledObj[wildcarded]
                    .elementsWhichWeCanReplaceWithWildcards,
                  null,
                  0
                )}`
              );
          }
        });
        // finally, bump the count:
        compiledObj[wildcarded].count += 1;
        DEV &&
          console.log(
            `131 BUMP compiledObj[wildcarded].count is now = ${compiledObj[wildcarded].count}`
          );
      } else {
        compiledObj[wildcarded] = {
          count: 1,
          elementsWhichWeCanReplaceWithWildcards: Array.from(digitChunks),
        };
        DEV &&
          console.log(
            `140 creating entry for "${wildcarded}"; compiledObj[wildcarded] = ${JSON.stringify(
              compiledObj[wildcarded],
              null,
              4
            )}`
          );
      }
    }
  }

  DEV &&
    console.log(
      `152 FINAL ${`\u001b[${33}m${`compiledObj`}\u001b[${39}m`} = ${JSON.stringify(
        compiledObj,
        null,
        4
      )}\n`
    );

  let resObj: MappingObj = {};
  Object.keys(compiledObj).forEach((key) => {
    DEV &&
      console.log(
        `\u001b[${36}m${`------------------------------------------`}\u001b[${39}m`
      );
    DEV && console.log(`${`\u001b[${35}m${`z`}\u001b[${39}m`}`);
    DEV &&
      console.log(
        `168 PROCESSING compiledObj key: ${JSON.stringify(key, null, 4)}`
      );
    // here were restore the values which were replaced with wildcards where
    // those values were identical across the whole set. That's the whole point
    // of this library.
    //
    // For example, you had three CSS class names:
    // [
    //    width425-margin1px,
    //    width425-margin2px
    //    width425-margin3px
    // ]
    //
    // We want them grouped into width425-margin*px, not width*-margin*px, because
    // 425 is constant.
    //
    let newKey = key;
    // if not all digit chunks are to be replaced, that is, compiledObj[key].elementsWhichWeCanReplaceWithWildcards
    // contains some constant values we harvested from the set:
    if (
      Array.isArray(compiledObj[key].elementsWhichWeCanReplaceWithWildcards) &&
      compiledObj[key].elementsWhichWeCanReplaceWithWildcards.some(
        (val: any) => val !== false
      )
    ) {
      DEV && console.log(`193 ██ PREP ${key}`);

      // we'll compile ranges array and replace all wildcards in one go using https://www.npmjs.com/package/ranges-apply
      let rangesArr = [];

      let nThIndex = 0;

      DEV &&
        console.log(`\u001b[${32}m${`==== while starts ====`}\u001b[${39}m`);
      for (
        let z = 0;
        z < compiledObj[key].elementsWhichWeCanReplaceWithWildcards.length;
        z++
      ) {
        DEV && console.log(z === 0 ? "" : "\n-------------\n");
        DEV && console.log(`208 ${`\u001b[${33}m${`z`}\u001b[${39}m`} = ${z}`);
        nThIndex = newKey.indexOf(
          `${resolvedOpts.wildcard || ""}`,
          nThIndex + (resolvedOpts.wildcard || "").length
        );
        DEV &&
          console.log(
            `${`\u001b[${33}m${`nThIndex`}\u001b[${39}m`} = ${JSON.stringify(
              nThIndex,
              null,
              4
            )}`
          );
        if (
          compiledObj[key].elementsWhichWeCanReplaceWithWildcards[z] !== false
        ) {
          rangesArr.push([
            nThIndex,
            nThIndex + (resolvedOpts.wildcard || "").length,
            compiledObj[key].elementsWhichWeCanReplaceWithWildcards[z],
          ]);
        }
      }
      newKey = rApply(newKey, rangesArr as Range[]);
      DEV &&
        console.log(`\u001b[${32}m${`\n==== while ends ====`}\u001b[${39}m`);
    }
    resObj[newKey] = compiledObj[key].count;
  });
  DEV &&
    console.log(
      `\u001b[${36}m${`------------------------------------------`}\u001b[${39}m`
    );
  return resObj;
}

export { groupStr, defaults, version, Range, Ranges };
