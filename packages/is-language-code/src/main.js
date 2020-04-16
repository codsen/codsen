import language from "./tag_language.json";
import extlang from "./tag_extlang.json";
import grandfathered from "./tag_grandfathered.json";
// import redundant from "./tag_redundant.json";
import region from "./tag_region.json";
import script from "./tag_script.json";
import variant from "./tag_variant.json";
// import ranged from "./tag_ranged.json";

function isRegExp(something) {
  return something instanceof RegExp;
}

function includes(arr, whatToMatch) {
  if (!Array.isArray(arr) || !arr.length) {
    return false;
  }
  return arr.some(
    (val) =>
      (isRegExp(val) && whatToMatch.match(val)) ||
      (typeof val === "string" && whatToMatch === val)
  );
}

function isLangCode(str) {
  if (typeof str !== "string") {
    return {
      res: false,
      message: `Not a string given.`,
    };
  } else if (!str.trim()) {
    return {
      res: false,
      message: `Empty language tag string given.`,
    };
  }

  // https://www.ietf.org/rfc/rfc1766.txt
  // https://www.iana.org/assignments/language-subtag-registry/language-subtag-registry
  // ---------------------------------------------------------------------------

  // r1. very rough regex to ensure letters are separated with dashes, in chunks
  // of up to eight characters
  const r1 = /^[a-z0-9]{1,8}(-[a-z0-9]{1,8})*$/gi;

  // r2. subtags qaa..qtz - "language" subtag
  const r2 = /^q[a-t][a-z]$/gi;
  language.push(r2);

  // r3. subtags Qaaa..Qabx - "script" subtag
  const r3 = /^qa[a-b][a-x]$/gi;
  script.push(r3);

  // r4. subtags qm..qz - "region" subtag
  const r4 = /^q[m-z]$/gi;
  region.push(r4);

  // r5. subtags xa..xz - "region" subtag
  const r5 = /^x[a-z]$/gi;
  region.push(r5);

  // 6. singleton
  const singletonRegex = /^[0-9a-wy-z]$/gi;
  // the "x" is reserved for private use, that is, singletons can't be "...-x-..."

  // AA and ZZ

  // ---------------------------------------------------------------------------

  // preliminary validation using R1 - if chunks are not letters/numbers,
  // separated with dashes, its' an instant "false"

  if (!str.match(r1)) {
    console.log(
      `075 isLangCode(): ${`\u001b[${31}m${`R1`}\u001b[${39}m`} failed`
    );
    return { res: false, message: `Does not resemble a language tag.` };
  }

  // grandfathered tags are evaluated as whole
  if (includes(grandfathered, str)) {
    console.log(
      `083 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} grandfathered tag`
    );
    return { res: true, message: null };
  }

  // if by now program is still going, value is process-able:
  // language tags are case-insensitive, "there exist
  // conventions for the capitalization of some of the subtags, but these
  // MUST NOT be taken to carry meaning" (https://tools.ietf.org/html/rfc5646)
  const split = str.toLowerCase().split("-");
  console.log(
    `094 isLangCode(): ${`\u001b[${32}m${`THE SPLIT`}\u001b[${39}m`} ${`\u001b[${33}m${`split`}\u001b[${39}m`} = ${JSON.stringify(
      split,
      null,
      4
    )}`
  );

  let type; // private|normal - used as a "global" marker among rules, when iterating

  // will help to enforce the sequence:
  let languageMatched = false;
  let scriptMatched = false;
  let regionMatched = false;
  let variantMatched = false;
  let extlangMatched = false;

  // the plan: we split by dash ("-") and get array. We iterate it and each
  // time variable "ok" is set to "true" by some logic rules OR if end of
  // an item is reached, function returns failure result.
  let allOK;

  // track repeated variant subtags
  const variantGathered = [];
  const singletonGathered = [];

  // iterate through every chunk:
  console.log("isLangCode() loop");
  for (let i = 0, len = split.length; i < len; i++) {
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //                              TOP CLAUSES
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    // frontal logging
    console.log(
      `${`\u001b[${36}m${`------------------------------------`}\u001b[${39}m`} split[${`\u001b[${35}m${i}\u001b[${39}m`}] = ${`\u001b[${35}m${
        split[i]
      }\u001b[${39}m`} ${`\u001b[${36}m${`------------------------------------`}\u001b[${39}m`}`
    );

    // on each iteration, reset allOK
    allOK = false;
    // if it stays false to the end of all the processing of this
    // iteration, it means this chunk was not validated and whole
    // result will be "false"

    // set type
    if (i === 0) {
      type = split[0] === "x" ? "private" : "normal";
    }

    if (split[i] === "x") {
      if (!split[i + 1]) {
        console.log(`164 ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} false`);
        return {
          res: false,
          message: `Ends with private use subtag, "x".`,
        };
      }

      console.log(
        `172 PRIVATE SUBTAG DETECTED, skipping checks for subsequent subtags`
      );
      console.log(`174 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} true`);
      // TODO - add more logic
      return { res: true, message: null };
    }

    // catch multiple recognised region tags
    if (regionMatched && region.includes(split[i])) {
      console.log(`181 multiple recognised region subtags`);
      console.log(`182 ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} false`);
      return {
        res: false,
        message: `Two region subtags, "${regionMatched}" and "${split[i]}".`,
      };
    }

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //                              MIDDLE CLAUSES
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    // validate the first element
    if (i === 0) {
      console.log(`213 isLangCode(): first element, LANGUAGE, clauses`);

      console.log(
        `216 isLangCode(): ${`\u001b[${33}m${`split[0]`}\u001b[${39}m`} = ${JSON.stringify(
          split[0],
          null,
          4
        )}`
      );

      if (type === "normal") {
        // validate
        if (includes(language, split[i])) {
          console.log(
            `227 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} ${`\u001b[${36}m${`language`}\u001b[${39}m`} subtag`
          );

          languageMatched = split[i];
          console.log(
            `232 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`languageMatched`}\u001b[${39}m`} = ${languageMatched}`
          );

          allOK = true;
          console.log(
            `237 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
          );
        } else {
          console.log(
            `241 ${`\u001b[${31}m${`language subtag not recognised`}\u001b[${39}m`} - ${`\u001b[${31}m${`allOK not set`}\u001b[${39}m`}`
          );
        }
      }
    } else if (i === 1) {
      console.log(
        `247 isLangCode(): second element, either EXTENSION or SCRIPT, clauses`
      );
      // validate
      if (type === "normal") {
        if (includes(script, split[i])) {
          console.log(
            `253 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} ${`\u001b[${36}m${`script`}\u001b[${39}m`} subtag`
          );

          scriptMatched = split[i];
          console.log(
            `258 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`scriptMatched`}\u001b[${39}m`} = ${scriptMatched}`
          );

          allOK = true;
          console.log(
            `263 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
          );
        } else if (includes(extlang, split[i])) {
          console.log(
            `267 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} ${`\u001b[${36}m${`extlang`}\u001b[${39}m`} subtag`
          );

          extlangMatched = split[i];
          console.log(
            `272 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`extlangMatched`}\u001b[${39}m`} = ${extlangMatched}`
          );

          allOK = true;
          console.log(
            `277 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
          );
        } else if (includes(region, split[i])) {
          console.log(
            `281 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} ${`\u001b[${36}m${`region`}\u001b[${39}m`} subtag`
          );

          regionMatched = split[i];
          console.log(
            `286 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`regionMatched`}\u001b[${39}m`} = ${regionMatched}`
          );

          allOK = true;
          console.log(
            `291 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
          );
        } else if (includes(variant, split[i])) {
          console.log(
            `295 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} ${`\u001b[${36}m${`variant`}\u001b[${39}m`} subtag`
          );

          variantMatched = split[i];
          console.log(
            `300 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`variantMatched`}\u001b[${39}m`} = ${variantMatched}`
          );

          allOK = true;
          console.log(
            `305 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
          );

          if (!variantGathered.includes(split[i])) {
            variantGathered.push(split[i]);
          } else {
            console.log(`311 ERROR! Repeated variant!`);
            console.log(`312 ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} false`);
            return {
              res: false,
              message: `Repeated variant subtag, "${split[i]}".`,
            };
          }
        } else {
          // neither extlang nor script
          console.log(
            `321 ${`\u001b[${31}m${`script subtag not recognised`}\u001b[${39}m`}`
          );
        }
      }
      //
    } else if (i === 2) {
      if (type === "normal") {
        // at position 3, it's either:
        // * script (language-extlang-script-region)
        // * region (language-script-region)
        // * variant (language-region-variant)
        // * region (language-extlang-region)
        if (languageMatched && extlangMatched) {
          // similar to language-extlang-script-region
          console.log(`335 inside language + extlang matched`);

          // match script
          if (includes(script, split[i])) {
            console.log(
              `340 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} ${`\u001b[${36}m${`script`}\u001b[${39}m`} subtag`
            );

            scriptMatched = split[i];
            console.log(
              `345 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`scriptMatched`}\u001b[${39}m`} = ${scriptMatched}`
            );

            allOK = true;
            console.log(
              `350 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
            );
          } else if (includes(region, split[i])) {
            // language-extlang-region
            // match region
            console.log(
              `356 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} ${`\u001b[${36}m${`region`}\u001b[${39}m`} subtag`
            );

            regionMatched = split[i];
            console.log(
              `361 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`regionMatched`}\u001b[${39}m`} = ${regionMatched}`
            );

            allOK = true;
            console.log(
              `366 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
            );
          }
        } else if (languageMatched && scriptMatched) {
          // similar to language-script-region
          console.log(`371 inside language + script matched`);

          // match region
          if (includes(region, split[i])) {
            console.log(
              `376 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} ${`\u001b[${36}m${`region`}\u001b[${39}m`} subtag`
            );

            regionMatched = split[i];
            console.log(
              `381 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`regionMatched`}\u001b[${39}m`} = ${regionMatched}`
            );

            allOK = true;
            console.log(
              `386 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
            );
          }
        } else if (languageMatched && regionMatched) {
          // language-region-variant
          console.log(`391 inside language + region matched`);

          // similar to de-CH-1901 or ca-ES-VALENCIA

          // match variant
          if (includes(variant, split[i])) {
            console.log(
              `398 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} ${`\u001b[${36}m${`variant`}\u001b[${39}m`} subtag`
            );

            variantMatched = split[i];
            console.log(
              `403 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`variantMatched`}\u001b[${39}m`} = ${variantMatched}`
            );

            allOK = true;
            console.log(
              `408 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
            );

            if (!variantGathered.includes(split[i])) {
              variantGathered.push(split[i]);
            } else {
              console.log(`414 ERROR! Repeated variant!`);
              console.log(
                `416 ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} false`
              );
              return {
                res: false,
                message: `Repeated variant subtag, "${split[i]}".`,
              };
            }
          }
        }
      }
    } else if (i === 3) {
      if (type === "normal") {
        // at position 4, it's either:
        // * region (language-extlang-script-region)
        // * variant (language-script-region-variant)
        if (languageMatched && extlangMatched && scriptMatched) {
          // match region
          if (includes(region, split[i])) {
            console.log(
              `435 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} ${`\u001b[${36}m${`region`}\u001b[${39}m`} subtag`
            );

            regionMatched = split[i];
            console.log(
              `440 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`regionMatched`}\u001b[${39}m`} = ${regionMatched}`
            );

            allOK = true;
            console.log(
              `445 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
            );
          }
        } else if (languageMatched && scriptMatched && regionMatched) {
          // match variant
          if (includes(variant, split[i])) {
            console.log(
              `452 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} ${`\u001b[${36}m${`variant`}\u001b[${39}m`} subtag`
            );

            variantMatched = split[i];
            console.log(
              `457 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`variantMatched`}\u001b[${39}m`} = ${variantMatched}`
            );

            allOK = true;
            console.log(
              `462 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
            );
          }
        }
      }
    }

    console.log(`469 non-positional clauses`);

    //
    //
    //
    //
    //         NON-POSITIONAL CLAUSES
    //
    //
    //
    //

    // catch the singleton-extension
    if (split[i].match(singletonRegex)) {
      if (i === 0) {
        console.log(`484 starts with singleton!`);
        return {
          res: false,
          message: `Starts with singleton, "${split[i]}".`,
        };
      }
      // ELSE - continue the checks
      console.log(`491 continue checks`);
      if (!languageMatched) {
        console.log(`493 ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} false`);
        return {
          res: false,
          message: `Extension must follow at least a primary language subtag.`,
        };
      }
      if (!singletonGathered.includes(split[i])) {
        console.log(`500 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${split[i]}`);
        singletonGathered.push(split[i]);
        console.log(
          `503 ${`\u001b[${32}m${`NOW`}\u001b[${39}m`} ${`\u001b[${33}m${`singletonGathered`}\u001b[${39}m`} = ${JSON.stringify(
            singletonGathered,
            null,
            4
          )}`
        );
      } else {
        console.log(`510 ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} false`);
        return {
          res: false,
          message: `Two extensions with same single-letter prefix "${split[i]}".`,
        };
      }

      if (split[i + 1]) {
        console.log(`518`);
        console.log(
          `520 split[i + 1].match(singletonRegex) = ${split[i + 1].match(
            singletonRegex
          )}`
        );
        if (!split[i + 1].match(singletonRegex)) {
          allOK = true;
          extlangMatched = split[i];
          console.log(
            `528 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}; ${`\u001b[${33}m${`extlangMatched`}\u001b[${39}m`} = ${extlangMatched}`
          );
          i++;
          console.log(`531 SET i++, now i = ${i}; then CONTINUE`);
          continue;
        } else {
          console.log(`534 singleton sequence caught`);
          console.log(`535 ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} false`);
          return {
            res: false,
            message: `Multiple singleton sequence "${split[i]}", "${
              split[i + 1]
            }".`,
          };
        }
      } else {
        console.log(`544 ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} false`);
        return {
          res: false,
          message: `Ends with singleton, "${split[i]}".`,
        };
      }
    }

    // catch the sequence of variant chunks
    if (!allOK && variantMatched && includes(variant, split[i])) {
      console.log(
        `555 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} ${`\u001b[${36}m${`variant`}\u001b[${39}m`} subtag`
      );

      if (i && includes(variant, split[i - 1])) {
        console.log(`559 variant subtag in front of this confirmed`);

        if (!variantGathered.includes(split[i])) {
          variantGathered.push(split[i]);
        } else {
          console.log(`564 ERROR! Repeated variant!`);
          console.log(`565 ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} false`);
          return {
            res: false,
            message: `Repeated variant subtag, "${split[i]}".`,
          };
        }

        allOK = true;
        console.log(
          `574 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
        );
      } else {
        console.log(
          `578 ${`\u001b[${31}m${`multiple variant subtags must be consecutive!`}\u001b[${39}m`}`
        );
        variantGathered.push(split[i]);
        console.log(`581 ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} false`);
        return {
          res: false,
          message: `Variant subtags ${variantGathered
            .map((val) => `"${val}"`)
            .join(", ")}  not in a sequence.`,
        };
      }
    }

    // catch repeated subtags
    if (!allOK && languageMatched && extlangMatched) {
      if (split[i].length > 1) {
        console.log(
          `595 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
        );
        allOK = true;
      }
    }

    console.log(`601`);

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //                            BOTTOM CLAUSES
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    if (!allOK) {
      console.log(`626 bottom reached, ${split[i]} was not matched!`);
      console.log(`627 ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} false`);
      return {
        res: false,
        message: `Unrecognised language subtag, "${split[i]}".`,
      };
    }

    // logging
    console.log(`${`\u001b[${90}m${`██`}\u001b[${39}m`}`);
    console.log(
      `${`\u001b[${90}m${`languageMatched =`}\u001b[${39}m`} ${`\u001b[${
        languageMatched ? 32 : 31
      }m${languageMatched}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`scriptMatched =`}\u001b[${39}m`} ${`\u001b[${
        scriptMatched ? 32 : 31
      }m${scriptMatched}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`regionMatched =`}\u001b[${39}m`} ${`\u001b[${
        regionMatched ? 32 : 31
      }m${regionMatched}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`variantMatched =`}\u001b[${39}m`} ${`\u001b[${
        variantMatched ? 32 : 31
      }m${variantMatched}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`extlangMatched =`}\u001b[${39}m`} ${`\u001b[${
        extlangMatched ? 32 : 31
      }m${extlangMatched}\u001b[${39}m`}`
    );
    console.log(`${`\u001b[${90}m${`-`}\u001b[${39}m`}`);
    console.log(
      `${`\u001b[${90}m${`variantGathered = ${JSON.stringify(
        variantGathered,
        null,
        4
      )}`}\u001b[${39}m`} `
    );
  }

  console.log(`671 end reached`);

  // ---------------------------------------------------------------------------

  // default answer is true, but we'll make
  // hell of a check obstacles to reach this point

  console.log(`678 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} true`);
  return { res: true, message: null };
}

export default isLangCode;
