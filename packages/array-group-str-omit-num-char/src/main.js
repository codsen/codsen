import uniq from "lodash.uniq";
import rangesApply from "ranges-apply";

const isArr = Array.isArray;

function groupStr(originalArr, originalOpts) {
  if (!isArr(originalArr)) {
    return originalArr;
  } else if (!originalArr.length) {
    // quick ending
    return {};
  }

  let opts;
  const defaults = {
    wildcard: "*",
    dedupePlease: true
  };
  // deliberate != below, we check for undefined and null:
  if (originalOpts != null) {
    opts = Object.assign({}, defaults, originalOpts);
  } else {
    opts = Object.assign({}, defaults);
  }

  let arr;
  if (opts.dedupePlease) {
    arr = uniq(originalArr);
  } else {
    arr = Array.from(originalArr);
  }

  // traverse the given array
  const len = arr.length;
  const compiledObj = {};
  for (let i = 0; i < len; i++) {
    console.log(
      `${`\u001b[${36}m${`-1--------------------`}\u001b[${39}m`}  ${`\u001b[${33}m${`arr[${i}]`}\u001b[${39}m`} = ${`\u001b[${35}m${
        arr[i]
      }\u001b[${39}m`}  ${`\u001b[${36}m${`--------------------`}\u001b[${39}m`}`
    );

    // compile an array of digit chunks, consisting of at least one digit
    // (will return null when there are no digits found):
    const digitChunks = arr[i].match(/\d+/gm);

    if (!digitChunks) {
      // if there were no digits, there's nothing to group, so this string goes
      // straight to output. Just check for duplicates.
      compiledObj[arr[i]] = {
        count: 1
      };
      // notice above doesn't have "elementsWhichWeCanReplaceWithWildcards" key
    } else {
      // so there were numbers in that string...

      // first, prepare the reference version of this string with chunks of digits
      // replaced with the wildcard
      const wildcarded = arr[i].replace(/\d+/gm, opts.wildcard);

      // the plan is, in order to extract the pattern, we'll use
      // elementsWhichWeCanReplaceWithWildcards where we'll keep record of the
      // previous element's value. Once the value is different, we set it to Bool
      // "false", marking it for replacement with wildcard.
      if (Object.prototype.hasOwnProperty.call(compiledObj, wildcarded)) {
        // so entry already exists for this wildcarded pattern.
        // Let's check each digit chunk where it's not already set to false (submitted
        // for replacement with wildcards), is it different from previous string's
        // chunk at that position (there can be multiple chunks of digits).

        console.log(`071 compiledObj has entry for "${wildcarded}"`);
        console.log(
          `073 \u001b[${36}m${`██ ██ ██ CHECK ALL CHUNKS ██ ██ ██`}\u001b[${39}m`
        );
        digitChunks.forEach((digitsChunkStr, i) => {
          console.log(
            `077 \u001b[${36}m${`██ chunk i = ${i}, val = ${digitsChunkStr}`}\u001b[${39}m`
          );
          if (
            compiledObj[wildcarded].elementsWhichWeCanReplaceWithWildcards[i] &&
            digitsChunkStr !==
              compiledObj[wildcarded].elementsWhichWeCanReplaceWithWildcards[i]
          ) {
            console.log(
              `085 BEFORE compiledObj[wildcarded].elementsWhichWeCanReplaceWithWildcards = ${JSON.stringify(
                compiledObj[wildcarded].elementsWhichWeCanReplaceWithWildcards,
                null,
                0
              )}`
            );
            compiledObj[wildcarded].elementsWhichWeCanReplaceWithWildcards[
              i
            ] = false;
            console.log(
              `095 AFTER compiledObj[wildcarded].elementsWhichWeCanReplaceWithWildcards = ${JSON.stringify(
                compiledObj[wildcarded].elementsWhichWeCanReplaceWithWildcards,
                null,
                0
              )}`
            );
          }
        });
        // finally, bump the count:
        compiledObj[wildcarded].count++;
        console.log(
          `106 BUMP compiledObj[wildcarded].count is now = ${compiledObj[wildcarded].count}`
        );
      } else {
        compiledObj[wildcarded] = {
          count: 1,
          elementsWhichWeCanReplaceWithWildcards: Array.from(digitChunks)
        };
        console.log(
          `114 creating entry for "${wildcarded}"; compiledObj[wildcarded] = ${JSON.stringify(
            compiledObj[wildcarded],
            null,
            4
          )}`
        );
      }
    }
  }

  console.log(
    `125 FINAL ${`\u001b[${33}m${`compiledObj`}\u001b[${39}m`} = ${JSON.stringify(
      compiledObj,
      null,
      4
    )}\n`
  );

  const resObj = {};
  Object.keys(compiledObj).forEach(key => {
    console.log(
      `\u001b[${36}m${`------------------------------------------`}\u001b[${39}m`
    );
    console.log(
      `139 PROCESSING compiledObj key: ${JSON.stringify(key, null, 4)}`
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
      isArr(compiledObj[key].elementsWhichWeCanReplaceWithWildcards) &&
      compiledObj[key].elementsWhichWeCanReplaceWithWildcards.some(
        val => val !== false
      )
    ) {
      console.log(`164 ██ PREP ${key}`);

      // we'll compile ranges array and replace all wildcards in one go using https://www.npmjs.com/package/ranges-apply
      const rangesArr = [];

      let nThIndex = 0;

      console.log(`\u001b[${32}m${`==== while starts ====`}\u001b[${39}m`);
      for (
        let z = 0;
        z < compiledObj[key].elementsWhichWeCanReplaceWithWildcards.length;
        z++
      ) {
        console.log(z === 0 ? "" : "\n-------------\n");
        console.log(`178 ${`\u001b[${33}m${`z`}\u001b[${39}m`} = ${z}`);
        nThIndex = newKey.indexOf(
          opts.wildcard,
          nThIndex + opts.wildcard.length
        );
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
            nThIndex + opts.wildcard.length,
            compiledObj[key].elementsWhichWeCanReplaceWithWildcards[z]
          ]);
        }
      }
      newKey = rangesApply(newKey, rangesArr);
      console.log(`\u001b[${32}m${`\n==== while ends ====`}\u001b[${39}m`);
    }
    resObj[newKey] = compiledObj[key].count;
  });
  console.log(
    `\u001b[${36}m${`------------------------------------------`}\u001b[${39}m`
  );
  return resObj;
}

export default groupStr;
