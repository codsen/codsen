// Takes string, SASS variables file and extracts the plain object of variables: key-value pairs
// As a bonus, it turns digit-only value strings into numbers.

const BACKSLASH = "\u005C";

function extractVars(str, originalOpts) {
  const defaults = {
    throwIfEmpty: false,
  };
  const opts = Object.assign({}, defaults, originalOpts);
  console.log(
    `012 ${`\u001b[${33}m${`opts`}\u001b[${39}m`}: ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );

  const len = str.length;

  let varNameStartsAt = null;
  let varValueStartsAt = null;
  let varName = null;
  let varValue = null;
  let withinQuotes = null;
  let lastNonQuoteCharAt = null;

  let withinComments = false;
  let withinSlashSlashComment = false;
  let withinSlashAsteriskComment = false;

  const res = {};

  for (let i = 0; i < len; i++) {
    //
    //
    //
    //
    //                                THE TOP
    //                                ███████
    //
    //

    // end the state of being within quotes
    if (
      !withinComments &&
      withinQuotes &&
      str[i] === withinQuotes &&
      str[i - 1] !== BACKSLASH
    ) {
      withinQuotes = null;
      console.log(
        `053 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinQuotes`}\u001b[${39}m`} = ${JSON.stringify(
          withinQuotes,
          null,
          4
        )}`
      );
    }

    // catch the state of being within quotes
    else if (
      !withinQuotes &&
      !withinComments &&
      str[i - 1] !== BACKSLASH &&
      `'"`.includes(str[i])
    ) {
      withinQuotes = str[i];
      console.log(
        `070 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinQuotes`}\u001b[${39}m`} = ${JSON.stringify(
          withinQuotes,
          null,
          4
        )}`
      );
    }

    // catch ending of withinSlashSlashComment
    if (withinSlashSlashComment && `\r\n`.includes(str[i])) {
      withinSlashSlashComment = false;
      console.log(
        `082 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinSlashSlashComment`}\u001b[${39}m`} = ${JSON.stringify(
          withinSlashSlashComment,
          null,
          4
        )}`
      );
    }

    // catch a start of slashslash comments block
    if (!withinComments && str[i] === "/" && str[i + 1] === "/") {
      withinSlashSlashComment = true;
      console.log(
        `094 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinSlashSlashComment`}\u001b[${39}m`} = ${JSON.stringify(
          withinSlashSlashComment,
          null,
          4
        )}`
      );
    }

    // catch the ending of slash astrisk comments block
    if (
      withinSlashAsteriskComment &&
      str[i - 2] === "*" &&
      str[i - 1] === "/"
    ) {
      withinSlashAsteriskComment = false;
      console.log(
        `110 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinSlashAsteriskComment`}\u001b[${39}m`} = ${JSON.stringify(
          withinSlashAsteriskComment,
          null,
          4
        )}`
      );
    }

    // catch a start of slash astrisk comments block
    // withinSlashAsteriskComment
    if (!withinComments && str[i] === "/" && str[i + 1] === "*") {
      withinSlashAsteriskComment = true;
      console.log(
        `123 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`withinSlashAsteriskComment`}\u001b[${39}m`} = ${JSON.stringify(
          withinSlashAsteriskComment,
          null,
          4
        )}`
      );
    }

    // "within various comments" states aggregator
    withinComments = withinSlashSlashComment || withinSlashAsteriskComment;

    // Logging:
    // -------------------------------------------------------------------------
    console.log(
      `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${
        withinComments ? 90 : 35
      }m${`str[ ${i} ] = ${
        str[i] && str[i].trim() ? str[i] : JSON.stringify(str[i], null, 4)
      }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`
    );

    //
    //
    //
    //
    //                              THE MIDDLE
    //                              ██████████
    //
    //
    //
    //

    // catch the beginning of the var name
    // -----------------------------------------------------------------------------
    if (!withinComments && str[i] === "$" && varNameStartsAt === null) {
      varNameStartsAt = i + 1;
      console.log(
        `160 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`varNameStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
          varNameStartsAt,
          null,
          4
        )}`
      );
    }

    // catch the ending of a value
    // -----------------------------------------------------------------------------

    if (
      !withinComments &&
      varValueStartsAt !== null &&
      !withinQuotes &&
      str[i] === ";"
    ) {
      varValue = str.slice(
        !`"'`.includes(str[varValueStartsAt])
          ? varValueStartsAt
          : varValueStartsAt + 1,
        lastNonQuoteCharAt + 1
      );
      console.log(
        `184 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`varValue`}\u001b[${39}m`} = ${JSON.stringify(
          varValue,
          null,
          4
        )}`
      );

      if (/^-?\d*\.?\d*$/.test(varValue)) {
        varValue = +varValue;
      }

      res[varName] = varValue;

      varNameStartsAt = null;
      varValueStartsAt = null;
      varName = null;
      varValue = null;
    }

    // catch the beginning of a value
    // -----------------------------------------------------------------------------

    if (
      !withinComments &&
      varName !== null &&
      str[i] &&
      str[i].trim().length &&
      varValueStartsAt === null
    ) {
      varValueStartsAt = i;
      console.log(
        `215 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`varValueStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
          varValueStartsAt,
          null,
          4
        )}`
      );
    }

    // catch the ending of the var name
    // -----------------------------------------------------------------------------
    if (
      !withinComments &&
      !varName &&
      varNameStartsAt !== null &&
      str[i] === ":" &&
      !withinQuotes
    ) {
      varName = str.slice(varNameStartsAt, i);
      console.log(
        `234 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`varName`}\u001b[${39}m`} = ${JSON.stringify(
          varName,
          null,
          4
        )}`
      );
    }

    //
    //
    //
    //
    //                              THE BOTTOM
    //                              ██████████
    //
    //
    //
    //

    if (!`'"`.includes(str[i])) {
      lastNonQuoteCharAt = i;
    }

    // LOGGING:

    console.log(
      `${`\u001b[${90}m${`██ withinComments`}\u001b[${39}m`} = ${`\u001b[${
        withinComments ? 32 : 31
      }m${withinComments}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`██ withinQuotes`}\u001b[${39}m`} = ${`\u001b[${
        withinQuotes ? 32 : 31
      }m${withinQuotes}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`██ withinSlashSlashComment`}\u001b[${39}m`} = ${`\u001b[${
        withinSlashSlashComment ? 32 : 31
      }m${withinSlashSlashComment}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`██ withinSlashAsteriskComment`}\u001b[${39}m`} = ${`\u001b[${
        withinSlashAsteriskComment ? 32 : 31
      }m${withinSlashAsteriskComment}\u001b[${39}m`}`
    );
    console.log(
      `${`\u001b[${90}m${`██ varNameStartsAt`}\u001b[${39}m`} = ${varNameStartsAt}`
    );
    console.log(
      `${`\u001b[${90}m${`██ varValueStartsAt`}\u001b[${39}m`} = ${varValueStartsAt}`
    );
    console.log(
      `${`\u001b[${90}m${`██ lastNonQuoteCharAt`}\u001b[${39}m`} = ${JSON.stringify(
        lastNonQuoteCharAt,
        null,
        4
      )}`
    );
    console.log(
      `${
        varName
          ? `${`\u001b[${33}m${`varName`}\u001b[${39}m`} = ${varName}; `
          : ""
      }${
        varValue
          ? `${`\u001b[${33}m${`varValue`}\u001b[${39}m`} = ${varValue}; `
          : ""
      }`
    );
  }

  return res;
}

export default extractVars;
