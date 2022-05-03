import { unfancy } from "string-unfancy";
import { rApply } from "ranges-apply";
import { Ranges } from "ranges-push";
import { checkTypesMini } from "check-types-mini";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

interface Opts {
  unfancyTheAltContents: boolean;
}
const defaults: Opts = {
  unfancyTheAltContents: true,
};

function isObj(something: unknown): boolean {
  return (
    !!something && typeof something === "object" && !Array.isArray(something)
  );
}

function alts(str: string, opts?: Partial<Opts>): string {
  // validate
  // ================
  if (typeof str !== "string") {
    throw new TypeError(
      `html-img-alt/alts(): [THROW_ID_01] Input must be string! Currently its type is: ${typeof str}, equal to: ${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  }
  if (opts && !isObj(opts)) {
    throw new TypeError(
      `html-img-alt/alts(): [THROW_ID_02] Options object must be a plain object! Currently its type is: ${typeof opts}, equal to: ${JSON.stringify(
        opts,
        null,
        4
      )}`
    );
  }

  // vars
  // ================
  let finalSpaceNeeded;
  let withinImageTag = false;
  let withinQuotes = false;
  let imageTagStartedAt = 0;
  let whitespaceStarted = 0;
  let slashStartedAt = 0;
  let altContentsStart = 0;
  let withinAlt = false; // marker to catch the beginning of the ALT attribute's value

  let thereShouldBeEqualCharacterHere = 0;
  let thereShouldBeTheFirstDoubleQuoteHere = 0;
  let thereShouldBeTheSecondDoubleQuoteHere = 0;
  let addSpaceInTheFutureBeforeSlashOrBracket = false;

  let altBegins = null;
  let rangesArr = new Ranges();

  // plausibleWithinQuotesRanges - some ranges should be included only if they are
  // not within double quotes. However, there can be cases when double quotes are
  // not closed - there's single double quote and after some whitespace there's
  // closing bracket. In this case, the condition "within double quotes" is false
  // regarding characters that follow that first unclosed double quote.
  // This is the temporary array which houses such "plausible" ranges.
  let plausibleWithinQuotesRanges = new Ranges();

  // resolvedOpts
  // ================
  let resolvedOpts: Opts = { ...defaults, ...opts };
  checkTypesMini(resolvedOpts, defaults, {
    msg: "html-img-alt/alts(): [THROW_ID_03]",
  });

  // traverse the string
  // ================
  for (let i = 0, len = str.length; i < len; i++) {
    let charcode = str[i].charCodeAt(0);
    DEV &&
      console.log(
        `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i} ] = ${
          str[i].trim() ? str[i] : JSON.stringify(str[i], null, 0)
        }`}\u001b[${39}m ${`\u001b[${90}m#${charcode}\u001b[${39}m`} \u001b[${36}m${`===============================`}\u001b[${39}m`
      );

    // catch the beginning of the IMG tag:
    // ================
    if (`${str[i]}${str[i + 1]}${str[i + 2]}${str[i + 3]}` === "<img") {
      if (!withinImageTag) {
        withinImageTag = true;
        imageTagStartedAt = i;
      } else {
        throw new TypeError(
          `html-img-alt/alts(): [THROW_ID_02] Something is wrong with the code - there's an image tag within an image tag. First image tag was: ${str.slice(
            imageTagStartedAt - 20,
            imageTagStartedAt + 20
          )}, then before it was closed, we've got this: ${str.slice(
            i - 20,
            i + 20
          )}`
        );
      }

      // DEV && console.log('!!! 096 SETTING finalSpaceNeeded = true')
      // finalSpaceNeeded = true
    }

    // catch closing slash
    // ================
    if (withinImageTag && str[i] === "/") {
      DEV && console.log(`117 !!! setting slashStartedAt = ${i}`);
      slashStartedAt = i;
    }

    // catch the ALT attributes within IMG tags:
    // ================
    if (withinImageTag && !withinQuotes) {
      if (`${str[i]}${str[i + 1]}${str[i + 2]}` === "alt") {
        altBegins = i;
        DEV && console.log(`126 !!! setting altBegins = ${altBegins}`);
      } else if (`${str[i - 3]}${str[i - 2]}${str[i - 1]}` === "alt") {
        withinAlt = true; // this flag is necessary only until we catch the first
        // double quote of the alt attribute
      }
    }

    // turn off the withinAlt flag
    // this flag lets through whitespace, "=" and double quotes.
    // This paves the way for the future, when within double quote detection
    // we'll see this withinAlt flag, we'll know it's alt attribute contents starting.
    // ================
    if (withinAlt && str[i].trim() !== "" && str[i] !== "=" && str[i] !== '"') {
      withinAlt = false;
    }

    // catch missing equal after ALT attr:
    // ================
    if (altBegins && i === altBegins + 3) {
      // altContentsStart = i
      thereShouldBeEqualCharacterHere = i;
    }

    // catch equal character after alt:
    // ================
    if (str[i] === "=") {
      if (altBegins) {
        // turn off the equal character search flag
        thereShouldBeEqualCharacterHere = 0;
        thereShouldBeTheFirstDoubleQuoteHere = i + 1;
      }

      // equal sign wipes and plausible ranges. Plausibles are possible when
      // first double quote is inclosed, and closing bracket follows.
      // If there's equal character, this means another attribute is mingling,
      // which negates the case.
      if (
        plausibleWithinQuotesRanges.current() &&
        (plausibleWithinQuotesRanges.current() as any[]).length
      ) {
        DEV && console.log("166 wiping plausibleWithinQuotesRanges");
        plausibleWithinQuotesRanges.wipe();
      }

      // if double quote follows this equal sign, and we are "withinQuotes",
      // turn off withinQuotes.
      // This is a precaution against broken code, like unit test 06.01:
      // `zzz<img alt="  class="" />zzz`
      //
      if (withinQuotes && str[i + 1] === '"') {
        withinQuotes = false;
        altContentsStart = 0;
      }
    }

    // whitespace ends - this section must be above "catch the closing IMG tag" section.
    // it's dependent upon (still) existing `slashStartedAt` which latter section deletes
    // ================
    if (whitespaceStarted && str[i].trim() !== "") {
      DEV && console.log("185 whitespace ends");
      // put up excessive whitespace for deletion

      DEV &&
        console.log(
          `190 withinQuotes = ${JSON.stringify(withinQuotes, null, 4)}`
        );
      if (
        whitespaceStarted <
        i -
          1 +
          (str[i] === ">" ||
          str[i] === "'" ||
          slashStartedAt ||
          thereShouldBeEqualCharacterHere ||
          thereShouldBeTheFirstDoubleQuoteHere ||
          thereShouldBeTheSecondDoubleQuoteHere
            ? 1
            : 0)
      ) {
        if (!withinQuotes) {
          DEV &&
            console.log(
              `208 add no.1.1 - adding whitespace to rangesArr: [${whitespaceStarted}, ${
                i -
                1 +
                (str[i] === ">" ||
                str[i] === "'" ||
                slashStartedAt ||
                thereShouldBeEqualCharacterHere ||
                thereShouldBeTheFirstDoubleQuoteHere ||
                thereShouldBeTheSecondDoubleQuoteHere
                  ? 1
                  : 0)
              }]`
            );

          rangesArr.add(
            whitespaceStarted,
            i -
              1 +
              (str[i] === ">" ||
              str[i] === "'" ||
              slashStartedAt ||
              thereShouldBeEqualCharacterHere ||
              thereShouldBeTheFirstDoubleQuoteHere ||
              thereShouldBeTheSecondDoubleQuoteHere
                ? 1
                : 0)
          );
        } else {
          DEV &&
            console.log(
              `238 add no.1.2 - adding whitespace to plausibleWithinQuotesRanges: [${whitespaceStarted}, ${
                i -
                1 +
                (str[i] === ">" ||
                str[i] === "'" ||
                slashStartedAt ||
                thereShouldBeEqualCharacterHere ||
                thereShouldBeTheFirstDoubleQuoteHere ||
                thereShouldBeTheSecondDoubleQuoteHere
                  ? 1
                  : 0)
              }]`
            );

          plausibleWithinQuotesRanges.add(
            whitespaceStarted,
            i -
              1 +
              (str[i] === ">" ||
              str[i] === "'" ||
              slashStartedAt ||
              thereShouldBeEqualCharacterHere ||
              thereShouldBeTheFirstDoubleQuoteHere ||
              thereShouldBeTheSecondDoubleQuoteHere
                ? 1
                : 0)
          );
        }

        if (str[i] === ">" || str[i] === "/") {
          // missingTrailingSpace = ' '
          DEV && console.log("269 SETTING finalSpaceNeeded = true");
          addSpaceInTheFutureBeforeSlashOrBracket = true;
        }

        if (
          (thereShouldBeEqualCharacterHere &&
            str[i] !== "=" &&
            i >= thereShouldBeEqualCharacterHere) ||
          (thereShouldBeTheFirstDoubleQuoteHere &&
            str[i] !== '"' &&
            i >= thereShouldBeTheFirstDoubleQuoteHere)
        ) {
          let missingTrailingSpace = "";
          let location =
            thereShouldBeEqualCharacterHere ||
            thereShouldBeTheFirstDoubleQuoteHere;

          let thingToAdd = "";
          if (thereShouldBeEqualCharacterHere) {
            thingToAdd += "=";
          }
          DEV &&
            console.log(`291 add no.2 - adding ="" at location:${location}`);
          if (!withinQuotes) {
            rangesArr.add(
              location,
              location,
              `${thingToAdd}""${missingTrailingSpace}`
            );
          } // else {
          // it might be that first double quote in alt=" is unclosed, and closing bracket follows.
          // that's why we add such range into a separate "plausibles" ranges list,
          // which would get merged into regular rangesArr in case second double quote is
          // never found.
          // plausibleWithinQuotesRanges.add(
          //   location, location, thingToAdd + '""' + missingTrailingSpace
          // )
          // }
          thereShouldBeEqualCharacterHere = 0;
          thereShouldBeTheFirstDoubleQuoteHere = 0;
        }
      }

      whitespaceStarted = 0;
    }

    // catch the state of being inside double quotes:
    // ================

    if (str[i] === '"') {
      withinQuotes = !withinQuotes;
      if (i === thereShouldBeTheFirstDoubleQuoteHere) {
        thereShouldBeTheSecondDoubleQuoteHere = i + 1;
      }
    }

    // calculate the logic regarding missing double quotes recognition
    // ================
    if (str[i] === '"') {
      if (
        thereShouldBeTheFirstDoubleQuoteHere &&
        i >= thereShouldBeTheFirstDoubleQuoteHere
      ) {
        DEV &&
          console.log(
            "334 TRUE for: i >= thereShouldBeTheFirstDoubleQuoteHere"
          );
        thereShouldBeTheSecondDoubleQuoteHere =
          thereShouldBeTheFirstDoubleQuoteHere;
        thereShouldBeTheFirstDoubleQuoteHere = 0;

        // set the marker altContentsStart
        if (withinAlt) {
          altContentsStart = i + 1;
          withinAlt = false;
        }

        // also, if the character after first double quote is closing slash (XHTML)
        // or closing bracket (HTML), add a missing space in front of it:
        if (str[i + 1].trim() === "/" || str[i + 1].trim() === ">") {
          DEV && console.log(`349 Adding empty space on i + 1 = ${i + 1}`);
          addSpaceInTheFutureBeforeSlashOrBracket = true;
          DEV && console.log("351 SETTING finalSpaceNeeded = false");
          finalSpaceNeeded = false;
        }
      } else if (
        thereShouldBeTheSecondDoubleQuoteHere &&
        i >= thereShouldBeTheSecondDoubleQuoteHere
      ) {
        DEV &&
          console.log(
            "360 TRUE for: i >= thereShouldBeTheSecondDoubleQuoteHere"
          );
        // If double quotes are closed properly, wipe the plausibles
        // that practically means we don't delete the whitespace within double quotes.
        // however, rogue unclosed double quote might throw us off track, hence
        // this contraption with plausible ranges.
        // We catch plausible ranges and keep until double quote is closed.
        // If it is never closed, all those ranges are merged into rangesArr for deletion.
        DEV && console.log("368 wiping plausibleWithinQuotesRanges");
        plausibleWithinQuotesRanges.wipe();
        thereShouldBeTheSecondDoubleQuoteHere = 0;

        // if the following character is closing slash (XHTML) or closing bracket (HTML),
        // add space in front of it
        if (str[i + 1] === ">" || str[i + 1] === "/") {
          addSpaceInTheFutureBeforeSlashOrBracket = true;
          DEV && console.log("376 SETTING finalSpaceNeeded = false");
          finalSpaceNeeded = false;
        }

        // reset altContentsStart
        DEV &&
          console.log(
            `383 ALT TAG CONTENTS: >>>${str.slice(altContentsStart, i)}<<< (${
              str.slice(altContentsStart, i).length
            })`
          );

        if (altContentsStart && resolvedOpts.unfancyTheAltContents) {
          let altContents = str.slice(altContentsStart, i);
          if (unfancy(altContents).trim() !== altContents) {
            rangesArr.add(altContentsStart, i, unfancy(altContents).trim());
          }
        }
        altContentsStart = 0;
      }
    }

    // catch single quotes
    // ================
    if (withinImageTag && !withinQuotes && str[i] === "'") {
      DEV && console.log("401 putting up a rogue single quote for deletion");
      rangesArr.add(i, i + 1);
      if (str[i + 1] === "/" || str[i + 1] === ">") {
        addSpaceInTheFutureBeforeSlashOrBracket = true;
      }
    }

    // catch the closing IMG tag and perform all the tasks
    // ================
    if (withinImageTag && str[i] === ">") {
      DEV &&
        console.log(
          `413 complete img tag: ${str.slice(imageTagStartedAt, i + 1)}`
        );
      DEV &&
        console.log(
          `417 thereShouldBeTheFirstDoubleQuoteHere = ${JSON.stringify(
            thereShouldBeTheFirstDoubleQuoteHere,
            null,
            4
          )}`
        );
      DEV &&
        console.log(
          `425 thereShouldBeTheSecondDoubleQuoteHere = ${JSON.stringify(
            thereShouldBeTheSecondDoubleQuoteHere,
            null,
            4
          )}`
        );

      imageTagStartedAt = 0;
      withinQuotes = false;

      // add ALT attr if missing:
      if (altBegins === null) {
        DEV && console.log("437 NO ALT ATTR!");
        DEV &&
          console.log(
            `440 slashStartedAt = ${JSON.stringify(slashStartedAt, null, 4)}`
          );
        if (slashStartedAt) {
          // XHTML.
          DEV &&
            console.log(
              `446 add no.3 - adding >>>alt="" <<< at slashStartedAt=${slashStartedAt}`
            );
          rangesArr.add(slashStartedAt, slashStartedAt, ' alt="" ');
        } else {
          // HTML.
          DEV && console.log(`451 add no.4 - adding >>> alt="" <<< at i=${i}`);
          rangesArr.add(i, i, ' alt="" ');
        }
        DEV && console.log("454 SETTING finalSpaceNeeded = false");
        finalSpaceNeeded = false;
        addSpaceInTheFutureBeforeSlashOrBracket = false;
      }

      if (!slashStartedAt && thereShouldBeEqualCharacterHere === i) {
        // if ALT has no equal and is right before closing bracket
        // HTML
        DEV && console.log(`462 add no.5 - adding >>>="" <<< at i=${i}`);
        rangesArr.add(i, i, '="" ');
        DEV && console.log("464 SETTING finalSpaceNeeded = false");
        finalSpaceNeeded = false;
      } else if (slashStartedAt && thereShouldBeEqualCharacterHere === i - 1) {
        // if ALT has no equal and is right before closing bracket
        // XHTML
        rangesArr.add(i - 1, i - 1, '="" ');
        DEV && console.log("470 SETTING finalSpaceNeeded = false");
        finalSpaceNeeded = false;
      }

      if (
        !slashStartedAt &&
        thereShouldBeTheFirstDoubleQuoteHere &&
        thereShouldBeTheFirstDoubleQuoteHere <= i
      ) {
        // HTML
        DEV && console.log(`480 add no.7 - adding >>>="" <<< at i=${i}`);
        rangesArr.add(i, i, '"" ');
        addSpaceInTheFutureBeforeSlashOrBracket = false;
      } else if (
        slashStartedAt &&
        thereShouldBeTheFirstDoubleQuoteHere &&
        thereShouldBeTheFirstDoubleQuoteHere <= i
      ) {
        // XHTML
        rangesArr.add(i - 1, i - 1, '"" ');
        addSpaceInTheFutureBeforeSlashOrBracket = false;
      } else if (
        !slashStartedAt &&
        thereShouldBeTheSecondDoubleQuoteHere &&
        thereShouldBeTheSecondDoubleQuoteHere <= i
      ) {
        DEV &&
          console.log(
            "498 add no.9 - adding the missing double quote before HTML closing bracket"
          );
        // HTML
        rangesArr.add(i, i, '"');
        DEV &&
          console.log(
            `504 rangesArr.current() = ${JSON.stringify(
              rangesArr.current(),
              null,
              4
            )}`
          );
        addSpaceInTheFutureBeforeSlashOrBracket = true;
        // so if the second double quote is missing, merge in the plausible ranges, if any
        DEV && console.log("512 merging in plausibleWithinQuotesRanges");

        // and now the actual merging of plausible ranges:
        if (plausibleWithinQuotesRanges.current()) {
          (plausibleWithinQuotesRanges.current() as any[]).forEach((key) => {
            rangesArr.add(key[0], key[1], key[2]);
          });
        }

        // after merging in, clean up the ranges
        rangesArr.current();
        // .current will mutate the ranges in the memory, cleaning, merging,
        // normalising them.

        plausibleWithinQuotesRanges.wipe();
      } else if (
        slashStartedAt &&
        thereShouldBeTheSecondDoubleQuoteHere &&
        thereShouldBeTheSecondDoubleQuoteHere <= i
      ) {
        DEV &&
          console.log(
            "534 add no.10 - adding the missing double quote before XHTML closing slash"
          );
        // XHTML

        rangesArr.add(
          thereShouldBeTheSecondDoubleQuoteHere + 1,
          thereShouldBeTheSecondDoubleQuoteHere + 1,
          '"'
        );
        DEV &&
          console.log(
            `545 UPDATED rangesArr.current(): ${JSON.stringify(
              rangesArr.current(),
              null,
              4
            )}`
          );

        // so if the second double quote is missing, merge in the plausible ranges, if any
        if (plausibleWithinQuotesRanges.current()) {
          (plausibleWithinQuotesRanges.current() as any[]).forEach((key) => {
            rangesArr.add(key[0], key[1], key[2]);
          });
        }
        plausibleWithinQuotesRanges.wipe();

        // after merging in, clean up the ranges
        rangesArr.current();
        // .current will mutate the ranges in the memory, cleaning, merging,
        // normalising them.
      }

      if (finalSpaceNeeded || addSpaceInTheFutureBeforeSlashOrBracket) {
        if (slashStartedAt) {
          DEV &&
            console.log(
              "570 add no.12.1 - FINAL - adding missing space at slashStartedAt (XHTML)"
            );
          rangesArr.add(slashStartedAt, slashStartedAt, " ");
        } else {
          DEV &&
            console.log(
              "576 add no.12.2 - FINAL - adding missing space at i (HTML)"
            );
          rangesArr.add(i, i, " ");
        }
        DEV &&
          console.log(
            `582 new rangesArr: ${JSON.stringify(rangesArr.current(), null, 4)}`
          );
      }

      withinImageTag = false;
      altBegins = null;
      thereShouldBeTheFirstDoubleQuoteHere = 0;
      thereShouldBeTheSecondDoubleQuoteHere = 0;
      finalSpaceNeeded = false;
    }

    // any non-empty space character ends the closing slash flag.
    // we don't want anything deleted after slash if it's not closing-slash but content

    // REVIEW slashStartedAt, probably needs more rules to make the case more precise
    if (slashStartedAt && str[i] !== "/" && str[i].trim() !== "") {
      DEV &&
        console.log(
          "600 setting slashStartedAt,\naltContentsStart,\nthereShouldBeEqualCharacterHere,\nthereShouldBeTheFirstDoubleQuoteHere,\nthereShouldBeTheSecondDoubleQuoteHere\nall to zero\n"
        );
      slashStartedAt = 0;
      // altContentsStart = 0
      thereShouldBeEqualCharacterHere = 0;
      thereShouldBeTheFirstDoubleQuoteHere = 0;
      thereShouldBeTheSecondDoubleQuoteHere = 0;
    }

    // whitespace starts
    // ================
    if (withinImageTag && str[i].trim() === "" && !whitespaceStarted) {
      whitespaceStarted = i;
    }

    // ================================================================
    // ================================================================

    DEV && console.log("");

    DEV &&
      console.log(`${`\u001b[${90}m${`whitespaceStarted = ${whitespaceStarted}`}\u001b[${39}m`}
${`\u001b[${90}m${`withinImageTag = ${withinImageTag}`}\u001b[${39}m`}
${`\u001b[${90}m${`altBegins = ${altBegins}`}\u001b[${39}m`}
${`\u001b[${90}m${`slashStartedAt = ${slashStartedAt}`}\u001b[${39}m`}
${`\u001b[${90}m${`thereShouldBeEqualCharacterHere = ${thereShouldBeEqualCharacterHere}`}\u001b[${39}m`}
${`\u001b[${90}m${`slashStartedAt = ${slashStartedAt}`}\u001b[${39}m`}
${`\u001b[${90}m${`thereShouldBeEqualCharacterHere = ${thereShouldBeEqualCharacterHere}`}\u001b[${39}m`}
${`\u001b[${90}m${`thereShouldBeTheFirstDoubleQuoteHere = ${thereShouldBeTheFirstDoubleQuoteHere}`}\u001b[${39}m`}
${`\u001b[${90}m${`thereShouldBeTheSecondDoubleQuoteHere = ${thereShouldBeTheSecondDoubleQuoteHere}`}\u001b[${39}m`}
${`\u001b[${90}m${`withinQuotes = ${withinQuotes}`}\u001b[${39}m`}
${`\u001b[${90}m${`addSpaceInTheFutureBeforeSlashOrBracket = ${addSpaceInTheFutureBeforeSlashOrBracket}`}\u001b[${39}m`}
${`\u001b[${90}m${`addSpaceInTheFutureBeforeSlashOrBracket = ${addSpaceInTheFutureBeforeSlashOrBracket}`}\u001b[${39}m`}
${`\u001b[${90}m${`finalSpaceNeeded = ${finalSpaceNeeded}`}\u001b[${39}m`}
${`\u001b[${90}m${`withinAlt = ${withinAlt}`}\u001b[${39}m`}
${`\u001b[${90}m${`altContentsStart = ${altContentsStart}`}\u001b[${39}m`}
${`\u001b[${90}m${`plausibleWithinQuotesRanges.current() = ${plausibleWithinQuotesRanges.current()}`}\u001b[${39}m`}`);
  }

  // crunch all the slices from rangesArr:
  // ================
  DEV && console.log("\n\n\n=============\n\n");
  DEV &&
    console.log(
      `644 FINAL rangesArr.current() = ${JSON.stringify(
        rangesArr.current(),
        null,
        4
      )}\n\n\n\n\n\n`
    );
  if (rangesArr.current() && (rangesArr.current() as any[]).length) {
    return rApply(str, rangesArr.current());
  }
  return str;
}

export { alts, defaults, version };
