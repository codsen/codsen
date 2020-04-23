import { left, right } from "string-left-right";
import { version } from "../package.json";
import {
  prepConfig,
  isStr,
  extractFromToSource,
  extractConfig,
  headsAndTails,
} from "./util";

function genAtomic(str, originalOpts) {
  function trimIfNeeded(str2, opts = {}) {
    // if config and heads/tails are turned off, don't trim
    if (!opts.includeConfig && !opts.includeHeadsAndTails) {
      console.log(`015 didn't trim`);
      return str2;
    }
    console.log(`018 trim`);
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
  const defaults = {
    includeConfig: true,
    includeHeadsAndTails: true,
    pad: true,
    configOverride: null,
    reportProgressFunc: null,
    reportProgressFuncFrom: 0,
    reportProgressFuncTo: 100,
  };
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
    (isStr(opts.configOverride) &&
      !opts.configOverride.includes("$$$") &&
      !opts.configOverride.includes(CONFIGHEAD) &&
      !opts.configOverride.includes(CONFIGTAIL) &&
      !opts.configOverride.includes(CONTENTHEAD) &&
      !opts.configOverride.includes(CONTENTTAIL))
  ) {
    console.log(`067 quick ending, no $$$ found, returning input str`);
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
    `087 ${`\u001b[${33}m${`extractedConfig`}\u001b[${39}m`}:\n"${`\u001b[${32}m${extractedConfig}\u001b[${39}m`}"\n\n\n`
  );
  console.log(
    `090 ${`\u001b[${33}m${`rawContentAbove`}\u001b[${39}m`} = ${JSON.stringify(
      rawContentAbove,
      null,
      4
    )}; ${`\u001b[${33}m${`rawContentBelow`}\u001b[${39}m`} = ${JSON.stringify(
      rawContentBelow,
      null,
      4
    )}`
  );

  if (!isStr(extractedConfig) || !extractedConfig.trim()) {
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
    `121 ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
  );

  // tackle config
  if (opts.includeConfig) {
    frontPart = `/* ${CONFIGHEAD}\n${extractedConfig.trim()}\n${CONFIGTAIL}\n${frontPart}`;
    console.log("--------------------------------------------------");
    console.log(
      `129 ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
    );
  }

  console.log(
    `134 ${`\u001b[${33}m${`rawContentAbove`}\u001b[${39}m`} = ${JSON.stringify(
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
    console.log(`147 CONFIGHEAD detected`);
    if (left(str, str.indexOf(CONFIGHEAD)) != null) {
      console.log(`149 content in front of config head detected`);
      // in normal cases, content should be between opening CSS comment +
      // CONFIGHEAD and CONFIGTAIL + closing CSS comment, we just have to mind
      // the whitespace
      let sliceUpTo = str.indexOf(CONFIGHEAD);
      console.log(
        `155 ${`\u001b[${33}m${`0 -> sliceUpTo`}\u001b[${39}m`} = "${str.slice(
          0,
          sliceUpTo
        )}"; ${`\u001b[${33}m${`sliceUpTo -> end`}\u001b[${39}m`} = "${str.slice(
          sliceUpTo
        )}"`
      );
      if (
        str[left(str, sliceUpTo)] === "*" &&
        str[left(str, left(str, sliceUpTo))] === "/"
      ) {
        sliceUpTo = left(str, left(str, sliceUpTo));
        console.log(
          `168 new ${`\u001b[${33}m${`sliceUpTo`}\u001b[${39}m`} = ${JSON.stringify(
            sliceUpTo,
            null,
            4
          )}`
        );
      }
      console.log(
        `176 ${`\u001b[${31}m${`██`}\u001b[${39}m`} frontPart = "${frontPart}"`
      );
      let putInFront = "/* ";
      if (
        (str[right(str, sliceUpTo - 1)] === "/" &&
          str[right(str, right(str, sliceUpTo - 1))] === "*") ||
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
        `196 ${`\u001b[${32}m${`██`}\u001b[${39}m`} new ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`} = ${JSON.stringify(
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
    console.log(`209 config tails detected`);
    // extract content that follows CONFIGTAIL:
    let sliceFrom = str.indexOf(CONFIGTAIL) + CONFIGTAIL.length;
    console.log(
      `213 ${`\u001b[${33}m${`sliceFrom`}\u001b[${39}m`} = ${JSON.stringify(
        sliceFrom,
        null,
        4
      )}`
    );
    // include closing comment:
    if (
      str[right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length)] === "*" &&
      str[
        right(str, right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length))
      ] === "/"
    ) {
      sliceFrom =
        right(str, right(str, str.indexOf(CONFIGTAIL) + CONFIGTAIL.length)) + 1;
      console.log(
        `229 closing comment included, ${`\u001b[${33}m${`sliceFrom`}\u001b[${39}m`} now = ${sliceFrom}`
      );
    }

    // in clean code case, opening head of content follows so let's check for it
    if (str.slice(right(str, sliceFrom - 1)).startsWith(CONTENTHEAD)) {
      const contentHeadsStartAt = right(str, sliceFrom);
      sliceFrom = contentHeadsStartAt + CONTENTHEAD.length;
      console.log(
        `238 content head detected, starts at ${contentHeadsStartAt}; sliceFrom = ${sliceFrom}`
      );
      if (
        str[right(str, sliceFrom - 1)] === "*" &&
        str[right(str, right(str, sliceFrom - 1))] === "/"
      ) {
        sliceFrom = right(str, right(str, sliceFrom - 1)) + 1;
        console.log(`245 sliceFrom = ${sliceFrom}`);
      }

      // if CONTENTTAIL exists, jump over all the content
      if (str.includes(CONTENTTAIL)) {
        console.log(`250 content tail detected`);
        sliceFrom = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;

        // tackle any closing comment that follows:
        if (
          str[right(str, sliceFrom)] === "*" &&
          str[right(str, right(str, sliceFrom))] === "/"
        ) {
          console.log(`258 closing comment detected`);
          sliceFrom = right(str, right(str, sliceFrom)) + 1;
        }
      }
    }

    console.log(
      `265 ${`\u001b[${32}m${`sliceFrom`}\u001b[${39}m`} = ${sliceFrom} ("${JSON.stringify(
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
      console.log(`276 CONTENTTAIL detected`);
      sliceFrom = str.indexOf(CONTENTTAIL) + CONTENTTAIL.length;
      console.log(
        `279 new ${`\u001b[${33}m${`sliceFrom`}\u001b[${39}m`} = ${sliceFrom}`
      );
      if (
        str[right(str, sliceFrom)] === "*" &&
        str[right(str, right(str, sliceFrom))] === "/"
      ) {
        sliceFrom = right(str, right(str, sliceFrom)) + 1;
        console.log(
          `287 new ${`\u001b[${33}m${`sliceFrom`}\u001b[${39}m`} = ${sliceFrom}`
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
    `309 ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
  );

  console.log(
    `313 ${`\u001b[${33}m${`rawContentAbove`}\u001b[${39}m`} = ${JSON.stringify(
      rawContentAbove,
      null,
      4
    )}; ${`\u001b[${33}m${`rawContentBelow`}\u001b[${39}m`} = ${JSON.stringify(
      rawContentBelow,
      null,
      4
    )}`
  );

  if (isStr(rawContentAbove)) {
    console.log(`325 tackle pending rawContentAbove`);

    frontPart = `${rawContentAbove}${frontPart}`;
    console.log("--------------------------------------------------");
    console.log(
      `330 ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
    );
  }

  if (isStr(rawContentBelow)) {
    console.log(
      `336 tackle ${`\u001b[${33}m${`rawContentBelow`}\u001b[${39}m`} = ${JSON.stringify(
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
      console.log(`347 add opening CSS comment block to rawContentBelow`);
      // but leave leading whitespace intact
      let frontPart2 = "";
      if (
        isStr(rawContentBelow) &&
        rawContentBelow[0] &&
        !rawContentBelow[0].trim()
      ) {
        frontPart2 = rawContentBelow.slice(0, right(rawContentBelow, 0));
        console.log(
          `357 ${`\u001b[${33}m${`frontPart2`}\u001b[${39}m`} = ${JSON.stringify(
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
      `371 ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
    );
  }

  console.log("--------------------------------------------------");
  console.log(
    `377 FINAL ${`\u001b[${33}m${`frontPart`}\u001b[${39}m`}:\n"${frontPart}"\n\n${`\u001b[${33}m${`endPart`}\u001b[${39}m`}:\n"${endPart}"\n\n`
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
    `395 FINAL RES:
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

export { genAtomic, version, headsAndTails, extractFromToSource };
