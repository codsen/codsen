import { left, right } from "string-left-right";
import { version as v } from "../package.json";
const version: string = v;
import {
  Obj,
  prepConfig,
  extractFromToSource,
  extractConfig,
  headsAndTails,
} from "./util";

interface Opts {
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

function genAtomic(
  str: string,
  originalOpts?: Opts
): { log: { count: number }; result: string } {
  function trimIfNeeded(str2: string, opts: Obj = {}) {
    // if config and heads/tails are turned off, don't trim
    if (!opts.includeConfig && !opts.includeHeadsAndTails) {
      console.log(`039 didn't trim`);
      return str2;
    }
    console.log(`042 trim`);
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

  const { CONFIGHEAD, CONFIGTAIL, CONTENTHEAD, CONTENTTAIL } = headsAndTails;
  const generatedCount = {
    count: 0,
  };

  const opts = { ...defaults, ...originalOpts };
  if (opts.includeConfig && !opts.includeHeadsAndTails) {
    // opts.includeConfig is a superset feature of opts.includeHeadsAndTails
    opts.includeHeadsAndTails = true;
  }

  // quick end if there are no $$$ in the input
  if (
    (!opts.configOverride &&
      !str.includes("$$$") &&
      !str.includes(CONFIGHEAD) &&
      !str.includes(CONFIGTAIL) &&
      !str.includes(CONTENTHEAD) &&
      !str.includes(CONTENTTAIL)) ||
    (opts &&
      opts.configOverride &&
      typeof opts.configOverride === "string" &&
      !opts.configOverride.includes("$$$") &&
      !opts.configOverride.includes(CONFIGHEAD) &&
      !opts.configOverride.includes(CONFIGTAIL) &&
      !opts.configOverride.includes(CONTENTHEAD) &&
      !opts.configOverride.includes(CONTENTTAIL))
  ) {
    console.log(`084 quick ending, no $$$ found, returning input str`);
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
    opts.configOverride ? opts.configOverride : str
  );
  console.log(
    `104 ${`\u001b[${33}m${`extractedConfig`}\u001b[${39}m`}:\n"${`\u001b[${32}m${extractedConfig}\u001b[${39}m`}"\n\n\n`
  );
  console.log(
    `107 ${`\u001b[${33}m${`rawContentAbove`}\u001b[${39}m`} = ${JSON.stringify(
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

  if (opts.includeConfig || opts.includeHeadsAndTails) {
    // wrap with content heads:
    frontPart = `${CONTENTHEAD} */\n`;
    if (!opts.includeConfig) {
      frontPart = `/* ${frontPart}`;
    }
    // and with content tails:
    endPart = `\n/* ${CONTENTTAIL} */`;
  }
  console.log("--------------------------------------------------");
  console.log(
    `138 ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
  );

  // tackle config
  if (opts.includeConfig) {
    frontPart = `/* ${CONFIGHEAD}\n${extractedConfig.trim()}\n${CONFIGTAIL}\n${frontPart}`;
    console.log("--------------------------------------------------");
    console.log(
      `146 ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
    );
  }

  console.log(
    `151 ${`\u001b[${33}m${`rawContentAbove`}\u001b[${39}m`} = ${JSON.stringify(
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
    console.log(`164 CONFIGHEAD detected`);
    if (left(str, str.indexOf(CONFIGHEAD)) != null) {
      console.log(`166 content in front of config head detected`);
      // in normal cases, content should be between opening CSS comment +
      // CONFIGHEAD and CONFIGTAIL + closing CSS comment, we just have to mind
      // the whitespace
      let sliceUpTo = str.indexOf(CONFIGHEAD);
      console.log(
        `172 ${`\u001b[${33}m${`0 -> sliceUpTo`}\u001b[${39}m`} = "${str.slice(
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
        console.log(
          `185 new ${`\u001b[${33}m${`sliceUpTo`}\u001b[${39}m`} = ${JSON.stringify(
            sliceUpTo,
            null,
            4
          )}`
        );
      }
      console.log(
        `193 ${`\u001b[${31}m${`██`}\u001b[${39}m`} frontPart = "${frontPart}"`
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

      //       console.log(`187 ASSEMBLING frontPart:\n
      // \n1. str.slice(0, sliceUpTo)="${str.slice(0, sliceUpTo)}"
      // \n2. putInFront="${putInFront}"
      // \n3. frontPart="${frontPart}"
      // `);

      frontPart = `${str.slice(0, sliceUpTo)}${putInFront}${frontPart}`;

      console.log(
        `214 ${`\u001b[${32}m${`██`}\u001b[${39}m`} new ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`} = ${JSON.stringify(
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
    console.log(`227 config tails detected`);
    // extract content that follows CONFIGTAIL:
    let sliceFrom = str.indexOf(CONFIGTAIL) + CONFIGTAIL.length;
    console.log(
      `231 ${`\u001b[${33}m${`sliceFrom`}\u001b[${39}m`} = ${JSON.stringify(
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
      console.log(
        `254 closing comment included, ${`\u001b[${33}m${`sliceFrom`}\u001b[${39}m`} now = ${sliceFrom}`
      );
    }

    // in clean code case, opening head of content follows so let's check for it
    if (
      str.slice(right(str, sliceFrom - 1) as number).startsWith(CONTENTHEAD)
    ) {
      const contentHeadsStartAt = right(str, sliceFrom);
      sliceFrom = contentHeadsStartAt || 0 + CONTENTHEAD.length;
      console.log(
        `265 content head detected, starts at ${contentHeadsStartAt}; sliceFrom = ${sliceFrom}`
      );
      if (
        str[right(str, sliceFrom - 1) as number] === "*" &&
        str[right(str, right(str, sliceFrom - 1) as number) as number] === "/"
      ) {
        sliceFrom =
          (right(str, right(str, sliceFrom - 1) as number) as number) + 1;
        console.log(`273 sliceFrom = ${sliceFrom}`);
      }

      // if CONTENTTAIL exists, jump over all the content
      if (str.includes(CONTENTTAIL)) {
        console.log(`278 content tail detected`);
        sliceFrom = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;

        // tackle any closing comment that follows:
        if (
          str[right(str, sliceFrom) as number] === "*" &&
          str[right(str, right(str, sliceFrom) as number) as number] === "/"
        ) {
          console.log(`286 closing comment detected`);
          sliceFrom =
            (right(str, right(str, sliceFrom) as number) as number) + 1;
        }
      }
    }

    console.log(
      `294 ${`\u001b[${32}m${`sliceFrom`}\u001b[${39}m`} = ${sliceFrom} ("${JSON.stringify(
        str.slice(sliceFrom, sliceFrom + 30),
        null,
        4
      )}")`
    );
    // now, check, does this ending chunk already include the content heads,
    // GENERATE-ATOMIC-CSS-CONTENT-STARTS,
    // because if so, there will be duplication and we need to remove them
    const slicedFrom = str.slice(sliceFrom);
    if (slicedFrom.length && slicedFrom.includes(CONTENTTAIL)) {
      console.log(`305 CONTENTTAIL detected`);
      sliceFrom = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;
      console.log(
        `308 new ${`\u001b[${33}m${`sliceFrom`}\u001b[${39}m`} = ${sliceFrom}`
      );
      if (
        str[right(str, sliceFrom) as number] === "*" &&
        str[right(str, right(str, sliceFrom) as number) as number] === "/"
      ) {
        sliceFrom = (right(str, right(str, sliceFrom) as number) as number) + 1;
        console.log(
          `316 new ${`\u001b[${33}m${`sliceFrom`}\u001b[${39}m`} = ${sliceFrom}`
        );
      }
    }

    //     console.log(`292 ASSEMBLE endPart:
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
  console.log(
    `338 ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
  );

  console.log(
    `342 ${`\u001b[${33}m${`rawContentAbove`}\u001b[${39}m`} = ${JSON.stringify(
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
    console.log(`354 tackle pending rawContentAbove`);

    frontPart = `${rawContentAbove}${frontPart}`;
    console.log("--------------------------------------------------");
    console.log(
      `359 ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
    );
  }

  if (typeof rawContentBelow === "string") {
    console.log(
      `365 tackle ${`\u001b[${33}m${`rawContentBelow`}\u001b[${39}m`} = ${JSON.stringify(
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
      console.log(`376 add opening CSS comment block to rawContentBelow`);
      // but leave leading whitespace intact
      let frontPart2 = "";
      if (
        typeof rawContentBelow === "string" &&
        rawContentBelow[0] &&
        !rawContentBelow[0].trim()
      ) {
        frontPart2 = rawContentBelow.slice(0, right(rawContentBelow, 0) || 0);
        console.log(
          `386 ${`\u001b[${33}m${`frontPart2`}\u001b[${39}m`} = ${JSON.stringify(
            frontPart2,
            null,
            4
          )}`
        );
      }
      rawContentBelow = `${frontPart2}/* ${rawContentBelow.trim()}`;
    }

    endPart = `${endPart}${rawContentBelow}`;
    console.log("--------------------------------------------------");

    console.log(
      `400 ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
    );
  }

  console.log("--------------------------------------------------");
  console.log(
    `406 FINAL ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
  );

  const finalRes = `${trimIfNeeded(
    `${frontPart}${prepConfig(
      extractedConfig,
      opts.reportProgressFunc,
      opts.reportProgressFuncFrom,
      opts.reportProgressFuncTo,
      true, // opts.includeConfig || opts.includeHeadsAndTails
      generatedCount,
      opts.pad
    )}${endPart}`,
    opts
  )}\n`;

  console.log("\n\n\n");
  console.log(
    `424 FINAL RES:
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
