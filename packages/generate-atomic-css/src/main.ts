import { left, right } from "string-left-right";
import type { Obj } from "codsen-utils";

import { version as v } from "../package.json";
import {
  prepConfig,
  extractFromToSource,
  extractConfig,
  headsAndTails,
} from "./util";

const version: string = v;

declare let DEV: boolean;

export interface Opts {
  includeConfig: boolean;
  includeHeadsAndTails: boolean;
  pad: boolean;
  configOverride: null | string;
  reportProgressFunc: null | ((percDone: number) => void);
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
}

const defaults: Opts = {
  includeConfig: true,
  includeHeadsAndTails: true,
  pad: true,
  configOverride: null,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
};

export interface Res {
  log: { count: number };
  result: string;
}

function genAtomic(str: string, opts?: Partial<Opts>): Res {
  function trimIfNeeded(str2: string, resolvedOpts: Obj = {}): string {
    // if config and heads/tails are turned off, don't trim
    if (!resolvedOpts.includeConfig && !resolvedOpts.includeHeadsAndTails) {
      DEV && console.log(`045 didn't trim`);
      return str2;
    }
    DEV && console.log(`048 trim`);
    return str2.trim();
  }

  if (typeof str !== "string") {
    throw new Error(
      `generate-atomic-css: [THROW_ID_01] First input argument must be a string! It was given as "${JSON.stringify(
        str,
        null,
        4
      )}" (type ${typeof str})`
    );
  }

  let { CONFIGHEAD, CONFIGTAIL, CONTENTHEAD, CONTENTTAIL } = headsAndTails;
  let generatedCount = {
    count: 0,
  };

  let resolvedOpts = { ...defaults, ...opts };
  if (resolvedOpts.includeConfig && !resolvedOpts.includeHeadsAndTails) {
    // resolvedOpts.includeConfig is a superset feature of resolvedOpts.includeHeadsAndTails
    resolvedOpts.includeHeadsAndTails = true;
  }

  // quick end if there are no $$$ in the input
  if (
    (!resolvedOpts.configOverride &&
      !str.includes("$$$") &&
      !str.includes(CONFIGHEAD) &&
      !str.includes(CONFIGTAIL) &&
      !str.includes(CONTENTHEAD) &&
      !str.includes(CONTENTTAIL)) ||
    (resolvedOpts?.configOverride &&
      typeof resolvedOpts.configOverride === "string" &&
      !resolvedOpts.configOverride.includes("$$$") &&
      !resolvedOpts.configOverride.includes(CONFIGHEAD) &&
      !resolvedOpts.configOverride.includes(CONFIGTAIL) &&
      !resolvedOpts.configOverride.includes(CONTENTHEAD) &&
      !resolvedOpts.configOverride.includes(CONTENTTAIL))
  ) {
    DEV && console.log(`089 quick ending, no $$$ found, returning input str`);
    return {
      log: {
        count: 0,
      },
      result: str,
    };
  }

  // either insert the generated CSS in between placeholders or just return the
  // generated CSS
  let frontPart = "";
  let endPart = "";

  // find out what to generate
  // eslint-disable-next-line prefer-const
  let [extractedConfig, rawContentAbove, rawContentBelow] = extractConfig(
    resolvedOpts.configOverride ? resolvedOpts.configOverride : str
  );
  DEV &&
    console.log(
      `110 ${`\u001b[${33}m${`extractedConfig`}\u001b[${39}m`}:\n"${`\u001b[${32}m${extractedConfig}\u001b[${39}m`}"\n\n\n`
    );
  DEV &&
    console.log(
      `114 ${`\u001b[${33}m${`rawContentAbove`}\u001b[${39}m`} = ${JSON.stringify(
        rawContentAbove,
        null,
        4
      )}; ${`\u001b[${33}m${`rawContentBelow`}\u001b[${39}m`} = ${JSON.stringify(
        rawContentBelow,
        null,
        4
      )}`
    );

  if (typeof extractedConfig !== "string" || !extractedConfig.trim()) {
    return {
      log: {
        count: 0,
      },
      result: "",
    };
  }

  if (resolvedOpts.includeConfig || resolvedOpts.includeHeadsAndTails) {
    // wrap with content heads:
    frontPart = `${CONTENTHEAD} */\n`;
    if (!resolvedOpts.includeConfig) {
      frontPart = `/* ${frontPart}`;
    }
    // and with content tails:
    endPart = `\n/* ${CONTENTTAIL} */`;
  }
  DEV && console.log("--------------------------------------------------");
  DEV &&
    console.log(
      `146 ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
    );

  // tackle config
  if (resolvedOpts.includeConfig) {
    frontPart = `/* ${CONFIGHEAD}\n${extractedConfig.trim()}\n${CONFIGTAIL}\n${frontPart}`;
    DEV && console.log("--------------------------------------------------");
    DEV &&
      console.log(
        `155 ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
      );
  }

  DEV &&
    console.log(
      `161 ${`\u001b[${33}m${`rawContentAbove`}\u001b[${39}m`} = ${JSON.stringify(
        rawContentAbove,
        null,
        4
      )}; ${`\u001b[${33}m${`rawContentBelow`}\u001b[${39}m`} = ${JSON.stringify(
        rawContentBelow,
        null,
        4
      )}`
    );

  // maybe there was some content above?
  if (str.includes(CONFIGHEAD)) {
    DEV && console.log(`174 CONFIGHEAD detected`);
    if (left(str, str.indexOf(CONFIGHEAD)) != null) {
      DEV && console.log(`176 content in front of config head detected`);
      // in normal cases, content should be between opening CSS comment +
      // CONFIGHEAD and CONFIGTAIL + closing CSS comment, we just have to mind
      // the whitespace
      let sliceUpTo = str.indexOf(CONFIGHEAD);
      DEV &&
        console.log(
          `183 ${`\u001b[${33}m${`0 -> sliceUpTo`}\u001b[${39}m`} = "${str.slice(
            0,
            sliceUpTo
          )}"; ${`\u001b[${33}m${`sliceUpTo -> end`}\u001b[${39}m`} = "${str.slice(
            sliceUpTo
          )}"`
        );
      if (
        str[left(str, sliceUpTo) as number] === "*" &&
        str[left(str, left(str, sliceUpTo) as number) as number] === "/"
      ) {
        sliceUpTo = left(str, left(str, sliceUpTo)) as number;
        DEV &&
          console.log(
            `197 new ${`\u001b[${33}m${`sliceUpTo`}\u001b[${39}m`} = ${JSON.stringify(
              sliceUpTo,
              null,
              4
            )}`
          );
      }
      DEV &&
        console.log(
          `206 ${`\u001b[${31}m${`██`}\u001b[${39}m`} frontPart = "${frontPart}"`
        );
      let putInFront = "/* ";
      if (
        (str[right(str, sliceUpTo - 1) as number] === "/" &&
          str[right(str, right(str, sliceUpTo - 1) as number) as number] ===
            "*") ||
        frontPart.trim().startsWith("/*")
      ) {
        putInFront = "";
      }

      //       DEV && console.log(`187 ASSEMBLING frontPart:\n
      // \n1. str.slice(0, sliceUpTo)="${str.slice(0, sliceUpTo)}"
      // \n2. putInFront="${putInFront}"
      // \n3. frontPart="${frontPart}"
      // `);

      frontPart = `${str.slice(0, sliceUpTo)}${putInFront}${frontPart}`;

      DEV &&
        console.log(
          `228 ${`\u001b[${32}m${`██`}\u001b[${39}m`} new ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`} = ${JSON.stringify(
            frontPart,
            null,
            4
          )}`
        );
    }
  }

  if (
    str.includes(CONFIGTAIL) &&
    right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length)
  ) {
    DEV && console.log(`241 config tails detected`);
    // extract content that follows CONFIGTAIL:
    let sliceFrom = str.indexOf(CONFIGTAIL) + CONFIGTAIL.length;
    DEV &&
      console.log(
        `246 ${`\u001b[${33}m${`sliceFrom`}\u001b[${39}m`} = ${JSON.stringify(
          sliceFrom,
          null,
          4
        )}`
      );
    // include closing comment:
    if (
      str[right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length) as number] ===
        "*" &&
      str[
        right(
          str,
          right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length) as number
        ) as number
      ] === "/"
    ) {
      sliceFrom =
        (right(
          str,
          right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length) as number
        ) as number) + 1;
      DEV &&
        console.log(
          `270 closing comment included, ${`\u001b[${33}m${`sliceFrom`}\u001b[${39}m`} now = ${sliceFrom}`
        );
    }

    // in clean code case, opening head of content follows so let's check for it
    if (
      str.slice(right(str, sliceFrom - 1) as number).startsWith(CONTENTHEAD)
    ) {
      let contentHeadsStartAt = right(str, sliceFrom);
      sliceFrom = contentHeadsStartAt || 0 + CONTENTHEAD.length;
      DEV &&
        console.log(
          `282 content head detected, starts at ${contentHeadsStartAt}; sliceFrom = ${sliceFrom}`
        );
      if (
        str[right(str, sliceFrom - 1) as number] === "*" &&
        str[right(str, right(str, sliceFrom - 1) as number) as number] === "/"
      ) {
        sliceFrom =
          (right(str, right(str, sliceFrom - 1) as number) as number) + 1;
        DEV && console.log(`290 sliceFrom = ${sliceFrom}`);
      }

      // if CONTENTTAIL exists, jump over all the content
      if (str.includes(CONTENTTAIL)) {
        DEV && console.log(`295 content tail detected`);
        sliceFrom = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;

        // tackle any closing comment that follows:
        if (
          str[right(str, sliceFrom) as number] === "*" &&
          str[right(str, right(str, sliceFrom) as number) as number] === "/"
        ) {
          DEV && console.log(`303 closing comment detected`);
          sliceFrom =
            (right(str, right(str, sliceFrom) as number) as number) + 1;
        }
      }
    }

    DEV &&
      console.log(
        `312 ${`\u001b[${32}m${`sliceFrom`}\u001b[${39}m`} = ${sliceFrom} ("${JSON.stringify(
          str.slice(sliceFrom, sliceFrom + 30),
          null,
          4
        )}")`
      );
    // now, check, does this ending chunk already include the content heads,
    // GENERATE-ATOMIC-CSS-CONTENT-STARTS,
    // because if so, there will be duplication and we need to remove them
    let slicedFrom = str.slice(sliceFrom);
    if (slicedFrom.length && slicedFrom.includes(CONTENTTAIL)) {
      DEV && console.log(`323 CONTENTTAIL detected`);
      sliceFrom = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;
      DEV &&
        console.log(
          `327 new ${`\u001b[${33}m${`sliceFrom`}\u001b[${39}m`} = ${sliceFrom}`
        );
      if (
        str[right(str, sliceFrom) as number] === "*" &&
        str[right(str, right(str, sliceFrom) as number) as number] === "/"
      ) {
        sliceFrom = (right(str, right(str, sliceFrom) as number) as number) + 1;
        DEV &&
          console.log(
            `336 new ${`\u001b[${33}m${`sliceFrom`}\u001b[${39}m`} = ${sliceFrom}`
          );
      }
    }

    //     DEV && console.log(`292 ASSEMBLE endPart:
    // \n1. endPart = "${endPart}"
    // \n2. bool str[sliceFrom] && right(str, sliceFrom - 1) = ${str[sliceFrom] &&
    //       right(str, sliceFrom - 1)}
    // \n3. str[sliceFrom] && right(str, sliceFrom - 1) ? str.slice(slicedFrom) : "" = "${
    //       str[sliceFrom] && right(str, sliceFrom - 1) ? str.slice(slicedFrom) : ""
    //     }"
    // \n4. sliceFrom = ${sliceFrom}
    // \n5. str.slice(${slicedFrom}) = ${`\u001b[${31}m${str.slice(
    //       slicedFrom
    //     )}\u001b[${39}m`}
    // `);
    endPart = `${endPart}${
      str[sliceFrom] && right(str, sliceFrom - 1) ? str.slice(sliceFrom) : ""
    }`;
  }
  DEV &&
    console.log(
      `359 ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
    );

  DEV &&
    console.log(
      `364 ${`\u001b[${33}m${`rawContentAbove`}\u001b[${39}m`} = ${JSON.stringify(
        rawContentAbove,
        null,
        4
      )}; ${`\u001b[${33}m${`rawContentBelow`}\u001b[${39}m`} = ${JSON.stringify(
        rawContentBelow,
        null,
        4
      )}`
    );

  if (typeof rawContentAbove === "string") {
    DEV && console.log(`376 tackle pending rawContentAbove`);

    frontPart = `${rawContentAbove}${frontPart}`;
    DEV && console.log("--------------------------------------------------");
    DEV &&
      console.log(
        `382 ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
      );
  }

  if (typeof rawContentBelow === "string") {
    DEV &&
      console.log(
        `389 tackle ${`\u001b[${33}m${`rawContentBelow`}\u001b[${39}m`} = ${JSON.stringify(
          rawContentBelow,
          null,
          4
        )}`
      );
    // precaution if rawContentBelow ends but not starts with CSS comment
    if (
      rawContentBelow.trim().endsWith("/*") &&
      !rawContentBelow.trim().startsWith("*/")
    ) {
      DEV &&
        console.log(`401 add opening CSS comment block to rawContentBelow`);
      // but leave leading whitespace intact
      let frontPart2 = "";
      if (
        typeof rawContentBelow === "string" &&
        rawContentBelow[0] &&
        !rawContentBelow[0].trim()
      ) {
        frontPart2 = rawContentBelow.slice(0, right(rawContentBelow, 0) || 0);
        DEV &&
          console.log(
            `412 ${`\u001b[${33}m${`frontPart2`}\u001b[${39}m`} = ${JSON.stringify(
              frontPart2,
              null,
              4
            )}`
          );
      }
      rawContentBelow = `${frontPart2}/* ${rawContentBelow.trim()}`;
    }

    endPart = `${endPart}${rawContentBelow}`;
    DEV && console.log("--------------------------------------------------");

    DEV &&
      console.log(
        `427 ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
      );
  }

  DEV && console.log("--------------------------------------------------");
  DEV &&
    console.log(
      `434 FINAL ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
    );

  let finalRes = `${trimIfNeeded(
    `${frontPart}${prepConfig(
      extractedConfig,
      resolvedOpts.reportProgressFunc,
      resolvedOpts.reportProgressFuncFrom,
      resolvedOpts.reportProgressFuncTo,
      true, // resolvedOpts.includeConfig || resolvedOpts.includeHeadsAndTails
      generatedCount,
      resolvedOpts.pad
    )}${endPart}`,
    resolvedOpts
  )}\n`;

  DEV && console.log("\n\n\n");
  DEV &&
    console.log(
      `453 FINAL RES:
${`\u001b[${36}m${`███████████████████████████████████████`}\u001b[${39}m`}
${finalRes}
${`\u001b[${36}m${`███████████████████████████████████████`}\u001b[${39}m`}

`
    );

  return {
    log: { count: generatedCount.count },
    result: finalRes,
  };
}

export { genAtomic, defaults, version, headsAndTails, extractFromToSource };
