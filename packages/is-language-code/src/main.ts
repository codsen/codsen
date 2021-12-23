import { version as v } from "../package.json";
import languageJson from "./tag_language.json";
import extlangJson from "./tag_extlang.json";
import grandfatheredJson from "./tag_grandfathered.json";
// import redundant from "./tag_redundant.json";
import regionJson from "./tag_region.json";
import scriptJson from "./tag_script.json";
import variantJson from "./tag_variant.json";

const version: string = v;

declare let DEV: boolean;
// import ranged from "./tag_ranged.json";

const language: (string | RegExp)[] = languageJson;
const extlang: string[] = extlangJson;
const grandfathered: string[] = grandfatheredJson;
const region: (string | RegExp)[] = regionJson;
const script: (string | RegExp)[] = scriptJson;
const variant: string[] = variantJson;

function isRegExp(something: any): boolean {
  return something instanceof RegExp;
}

// Array.prototype.includes() beefed up to support regexp too
function includes(arr: string[] | any, whatToMatch: string | RegExp): boolean {
  if (!Array.isArray(arr) || !arr.length) {
    return false;
  }
  return arr.some(
    (val) =>
      (isRegExp(val) && (whatToMatch as string).match(val)) ||
      (typeof val === "string" && whatToMatch === val)
  );
}

interface Res {
  res: boolean;
  message: string | null;
}

function isLangCode(str: string): Res {
  if (typeof str !== "string") {
    return {
      res: false,
      message: `Not a string given.`,
    };
  }
  if (!str.trim()) {
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
  let r1 = /^[a-z0-9]{1,8}(-[a-z0-9]{1,8})*$/gi;

  // r2. subtags qaa..qtz - "language" subtag
  let r2 = /^q[a-t][a-z]$/gi;
  language.push(r2);

  // r3. subtags Qaaa..Qabx - "script" subtag
  let r3 = /^qa[a-b][a-x]$/gi;
  script.push(r3);

  // r4. subtags qm..qz - "region" subtag
  let r4 = /^q[m-z]$/gi;
  region.push(r4);

  // r5. subtags xa..xz - "region" subtag
  let r5 = /^x[a-z]$/gi;
  region.push(r5);

  // 6. singleton
  let singletonRegex = /^[0-9a-wy-z]$/gi;
  // the "x" is reserved for private use, that is, singletons can't be "...-x-..."

  // AA and ZZ

  // ---------------------------------------------------------------------------

  // preliminary validation using R1 - if chunks are not letters/numbers,
  // separated with dashes, its' an instant "false"

  if (!str.match(r1)) {
    DEV &&
      console.log(
        `095 isLangCode(): ${`\u001b[${31}m${`R1`}\u001b[${39}m`} failed`
      );
    return { res: false, message: `Does not resemble a language tag.` };
  }

  // grandfathered tags are evaluated as whole
  if (includes(grandfathered, str)) {
    DEV &&
      console.log(
        `104 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} grandfathered tag`
      );
    return { res: true, message: null };
  }

  // if by now program is still going, value is process-able:
  // language tags are case-insensitive, "there exist
  // conventions for the capitalization of some of the subtags, but these
  // MUST NOT be taken to carry meaning" (https://tools.ietf.org/html/rfc5646)
  let split = str.toLowerCase().split("-");
  DEV &&
    console.log(
      `116 isLangCode(): ${`\u001b[${32}m${`THE SPLIT`}\u001b[${39}m`} ${`\u001b[${33}m${`split`}\u001b[${39}m`} = ${JSON.stringify(
        split,
        null,
        4
      )}`
    );

  let type; // private|normal - used as a "global" marker among rules, when iterating

  // will help to enforce the sequence:
  let languageMatched: string | undefined;
  let scriptMatched: string | undefined;
  let regionMatched: string | undefined;
  let variantMatched: string | undefined;
  let extlangMatched: string | undefined;

  // the plan: we split by dash ("-") and get array. We iterate it and each
  // time variable "ok" is set to "true" by some logic rules OR if end of
  // an item is reached, function returns failure result.
  let allOK;

  // track repeated variant subtags
  let variantGathered: string[] = [];
  let singletonGathered: string[] = [];

  // iterate through every chunk:
  DEV && console.log("isLangCode() loop");
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
    DEV &&
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
        DEV &&
          console.log(`188 ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} false`);
        return {
          res: false,
          message: `Ends with private use subtag, "x".`,
        };
      }

      DEV &&
        console.log(
          `197 PRIVATE SUBTAG DETECTED, skipping checks for subsequent subtags`
        );
      DEV && console.log(`199 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} true`);
      // TODO - add more logic
      return { res: true, message: null };
    }

    // catch multiple recognised region tags
    if (regionMatched && region.includes(split[i])) {
      DEV && console.log(`206 multiple recognised region subtags`);
      DEV &&
        console.log(`208 ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} false`);
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
      DEV && console.log(`239 isLangCode(): first element, LANGUAGE, clauses`);

      DEV &&
        console.log(
          `243 isLangCode(): ${`\u001b[${33}m${`split[0]`}\u001b[${39}m`} = ${JSON.stringify(
            split[0],
            null,
            4
          )}`
        );

      if (type === "normal") {
        // validate
        if (includes(language, split[i])) {
          DEV &&
            console.log(
              `255 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} ${`\u001b[${36}m${`language`}\u001b[${39}m`} subtag`
            );

          languageMatched = split[i];
          DEV &&
            console.log(
              `261 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`languageMatched`}\u001b[${39}m`} = ${languageMatched}`
            );

          allOK = true;
          DEV &&
            console.log(
              `267 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
            );
        } else {
          DEV &&
            console.log(
              `272 ${`\u001b[${31}m${`language subtag not recognised`}\u001b[${39}m`} - ${`\u001b[${31}m${`allOK not set`}\u001b[${39}m`}`
            );
        }
      }
    } else if (i === 1) {
      DEV &&
        console.log(
          `279 isLangCode(): second element, either EXTENSION or SCRIPT, clauses`
        );
      // validate
      if (type === "normal") {
        if (includes(script, split[i])) {
          DEV &&
            console.log(
              `286 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} ${`\u001b[${36}m${`script`}\u001b[${39}m`} subtag`
            );

          scriptMatched = split[i];
          DEV &&
            console.log(
              `292 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`scriptMatched`}\u001b[${39}m`} = ${scriptMatched}`
            );

          allOK = true;
          DEV &&
            console.log(
              `298 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
            );
        } else if (includes(extlang, split[i])) {
          DEV &&
            console.log(
              `303 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} ${`\u001b[${36}m${`extlang`}\u001b[${39}m`} subtag`
            );

          extlangMatched = split[i];
          DEV &&
            console.log(
              `309 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`extlangMatched`}\u001b[${39}m`} = ${extlangMatched}`
            );

          allOK = true;
          DEV &&
            console.log(
              `315 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
            );
        } else if (includes(region, split[i])) {
          DEV &&
            console.log(
              `320 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} ${`\u001b[${36}m${`region`}\u001b[${39}m`} subtag`
            );

          regionMatched = split[i];
          DEV &&
            console.log(
              `326 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`regionMatched`}\u001b[${39}m`} = ${regionMatched}`
            );

          allOK = true;
          DEV &&
            console.log(
              `332 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
            );
        } else if (includes(variant, split[i])) {
          DEV &&
            console.log(
              `337 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} ${`\u001b[${36}m${`variant`}\u001b[${39}m`} subtag`
            );

          variantMatched = split[i];
          DEV &&
            console.log(
              `343 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`variantMatched`}\u001b[${39}m`} = ${variantMatched}`
            );

          allOK = true;
          DEV &&
            console.log(
              `349 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
            );

          if (!variantGathered.includes(split[i])) {
            variantGathered.push(split[i]);
          } else {
            DEV && console.log(`355 ERROR! Repeated variant!`);
            DEV &&
              console.log(
                `358 ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} false`
              );
            return {
              res: false,
              message: `Repeated variant subtag, "${split[i]}".`,
            };
          }
        } else {
          // neither extlang nor script
          DEV &&
            console.log(
              `369 ${`\u001b[${31}m${`script subtag not recognised`}\u001b[${39}m`}`
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
          DEV && console.log(`383 inside language + extlang matched`);

          // match script
          if (includes(script, split[i])) {
            DEV &&
              console.log(
                `389 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} ${`\u001b[${36}m${`script`}\u001b[${39}m`} subtag`
              );

            scriptMatched = split[i];
            DEV &&
              console.log(
                `395 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`scriptMatched`}\u001b[${39}m`} = ${scriptMatched}`
              );

            allOK = true;
            DEV &&
              console.log(
                `401 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
              );
          } else if (includes(region, split[i])) {
            // language-extlang-region
            // match region
            DEV &&
              console.log(
                `408 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} ${`\u001b[${36}m${`region`}\u001b[${39}m`} subtag`
              );

            regionMatched = split[i];
            DEV &&
              console.log(
                `414 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`regionMatched`}\u001b[${39}m`} = ${regionMatched}`
              );

            allOK = true;
            DEV &&
              console.log(
                `420 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
              );
          }
        } else if (languageMatched && scriptMatched) {
          // similar to language-script-region
          DEV && console.log(`425 inside language + script matched`);

          // match region
          if (includes(region, split[i])) {
            DEV &&
              console.log(
                `431 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} ${`\u001b[${36}m${`region`}\u001b[${39}m`} subtag`
              );

            regionMatched = split[i];
            DEV &&
              console.log(
                `437 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`regionMatched`}\u001b[${39}m`} = ${regionMatched}`
              );

            allOK = true;
            DEV &&
              console.log(
                `443 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
              );
          }
        } else if (languageMatched && regionMatched) {
          // language-region-variant
          DEV && console.log(`448 inside language + region matched`);

          // similar to de-CH-1901 or ca-ES-VALENCIA

          // match variant
          if (includes(variant, split[i])) {
            DEV &&
              console.log(
                `456 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} ${`\u001b[${36}m${`variant`}\u001b[${39}m`} subtag`
              );

            variantMatched = split[i];
            DEV &&
              console.log(
                `462 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`variantMatched`}\u001b[${39}m`} = ${variantMatched}`
              );

            allOK = true;
            DEV &&
              console.log(
                `468 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
              );

            if (!variantGathered.includes(split[i])) {
              variantGathered.push(split[i]);
            } else {
              DEV && console.log(`474 ERROR! Repeated variant!`);
              DEV &&
                console.log(
                  `477 ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} false`
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
            DEV &&
              console.log(
                `497 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} ${`\u001b[${36}m${`region`}\u001b[${39}m`} subtag`
              );

            regionMatched = split[i];
            DEV &&
              console.log(
                `503 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`regionMatched`}\u001b[${39}m`} = ${regionMatched}`
              );

            allOK = true;
            DEV &&
              console.log(
                `509 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
              );
          }
        } else if (languageMatched && scriptMatched && regionMatched) {
          // match variant
          if (includes(variant, split[i])) {
            DEV &&
              console.log(
                `517 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} ${`\u001b[${36}m${`variant`}\u001b[${39}m`} subtag`
              );

            variantMatched = split[i];
            DEV &&
              console.log(
                `523 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`variantMatched`}\u001b[${39}m`} = ${variantMatched}`
              );

            allOK = true;
            DEV &&
              console.log(
                `529 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
              );
          }
        }
      }
    }

    DEV && console.log(`536 non-positional clauses`);

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
        DEV && console.log(`551 starts with singleton!`);
        return {
          res: false,
          message: `Starts with singleton, "${split[i]}".`,
        };
      }
      // ELSE - continue the checks
      DEV && console.log(`558 continue checks`);
      if (!languageMatched) {
        DEV &&
          console.log(`561 ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} false`);
        return {
          res: false,
          message: `Extension must follow at least a primary language subtag.`,
        };
      }
      if (!singletonGathered.includes(split[i])) {
        DEV &&
          console.log(
            `570 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${split[i]}`
          );
        singletonGathered.push(split[i]);
        DEV &&
          console.log(
            `575 ${`\u001b[${32}m${`NOW`}\u001b[${39}m`} ${`\u001b[${33}m${`singletonGathered`}\u001b[${39}m`} = ${JSON.stringify(
              singletonGathered,
              null,
              4
            )}`
          );
      } else {
        DEV &&
          console.log(`583 ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} false`);
        return {
          res: false,
          message: `Two extensions with same single-letter prefix "${split[i]}".`,
        };
      }

      if (split[i + 1]) {
        DEV && console.log(`591`);
        DEV &&
          console.log(
            `594 split[i + 1].match(singletonRegex) = ${split[i + 1].match(
              singletonRegex
            )}`
          );
        if (!split[i + 1].match(singletonRegex)) {
          allOK = true;
          extlangMatched = split[i];
          DEV &&
            console.log(
              `603 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}; ${`\u001b[${33}m${`extlangMatched`}\u001b[${39}m`} = ${extlangMatched}`
            );
          i += 1;
          DEV && console.log(`606 SET i++, now i = ${i}; then CONTINUE`);
          continue;
        } else {
          DEV && console.log(`609 singleton sequence caught`);
          DEV &&
            console.log(`611 ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} false`);
          return {
            res: false,
            message: `Multiple singleton sequence "${split[i]}", "${
              split[i + 1]
            }".`,
          };
        }
      } else {
        DEV &&
          console.log(`621 ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} false`);
        return {
          res: false,
          message: `Ends with singleton, "${split[i]}".`,
        };
      }
    }

    // catch the sequence of variant chunks
    if (!allOK && variantMatched && includes(variant, split[i])) {
      DEV &&
        console.log(
          `633 ${`\u001b[${32}m${`MATCHED`}\u001b[${39}m`} ${`\u001b[${36}m${`variant`}\u001b[${39}m`} subtag`
        );

      if (i && includes(variant, split[i - 1])) {
        DEV && console.log(`637 variant subtag in front of this confirmed`);

        if (!variantGathered.includes(split[i])) {
          variantGathered.push(split[i]);
        } else {
          DEV && console.log(`642 ERROR! Repeated variant!`);
          DEV &&
            console.log(`644 ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} false`);
          return {
            res: false,
            message: `Repeated variant subtag, "${split[i]}".`,
          };
        }

        allOK = true;
        DEV &&
          console.log(
            `654 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
          );
      } else {
        DEV &&
          console.log(
            `659 ${`\u001b[${31}m${`multiple variant subtags must be consecutive!`}\u001b[${39}m`}`
          );
        variantGathered.push(split[i]);
        DEV &&
          console.log(`663 ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} false`);
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
        DEV &&
          console.log(
            `678 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`allOK`}\u001b[${39}m`} = ${allOK}`
          );
        allOK = true;
      }
    }

    DEV && console.log(`684`);

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
      DEV && console.log(`709 bottom reached, ${split[i]} was not matched!`);
      DEV &&
        console.log(`711 ${`\u001b[${31}m${`RETURN`}\u001b[${39}m`} false`);
      return {
        res: false,
        message: `Unrecognised language subtag, "${split[i]}".`,
      };
    }

    // logging
    DEV && console.log(`${`\u001b[${90}m${`██`}\u001b[${39}m`}`);
    DEV &&
      console.log(
        `${`\u001b[${90}m${`languageMatched =`}\u001b[${39}m`} ${`\u001b[${
          languageMatched ? 32 : 31
        }m${languageMatched}\u001b[${39}m`}`
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`scriptMatched =`}\u001b[${39}m`} ${`\u001b[${
          scriptMatched ? 32 : 31
        }m${scriptMatched}\u001b[${39}m`}`
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`regionMatched =`}\u001b[${39}m`} ${`\u001b[${
          regionMatched ? 32 : 31
        }m${regionMatched}\u001b[${39}m`}`
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`variantMatched =`}\u001b[${39}m`} ${`\u001b[${
          variantMatched ? 32 : 31
        }m${variantMatched}\u001b[${39}m`}`
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`extlangMatched =`}\u001b[${39}m`} ${`\u001b[${
          extlangMatched ? 32 : 31
        }m${extlangMatched}\u001b[${39}m`}`
      );
    DEV && console.log(`${`\u001b[${90}m${`-`}\u001b[${39}m`}`);
    DEV &&
      console.log(
        `${`\u001b[${90}m${`variantGathered = ${JSON.stringify(
          variantGathered,
          null,
          4
        )}`}\u001b[${39}m`} `
      );
  }

  DEV && console.log(`761 end reached`);

  // ---------------------------------------------------------------------------

  // default answer is true, but we'll make
  // hell of a check obstacles to reach this point

  DEV && console.log(`768 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} true`);
  return { res: true, message: null };
}

export { isLangCode, version };
