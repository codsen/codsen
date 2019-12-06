import he from "he";
import mergeRanges from "ranges-merge";
import isObj from "lodash.isplainobject";

/**
 * chomp - leaves only last #x26; or amp; between ampersand and string
 *
 * @param  {string} str input
 * @return {string}     output
 */
function chomp(str) {
  str = str.replace(/(amp;)|(#x26;)/gi, "");
  console.log(
    `014 ${`\u001b[${33}m${`str after chomp`}\u001b[${39}m`} = ${JSON.stringify(
      str,
      null,
      4
    )}`
  );
  return str;
}

function decode(str, originalOpts) {
  // insurance:
  // ---------------------------------------------------------------------------
  if (typeof str !== "string") {
    throw new TypeError(
      `ranges-ent-decode/decode(): [THROW_ID_01] Expected a String! Currently it's given as ${str}, type ${typeof str}`
    );
  }
  if (originalOpts != null && !isObj(originalOpts)) {
    throw new TypeError(
      `ranges-ent-decode/decode(): [THROW_ID_02] Optional Options Object, the second in put argument, must be a plain object! Currently it's given as ${originalOpts}, type ${typeof originalOpts}`
    );
  }
  const defaults = {
    isAttributeValue: false,
    strict: false
  };
  let opts;
  if (!originalOpts) {
    opts = defaults;
  } else {
    opts = Object.assign({}, defaults, originalOpts);
  }

  console.log(
    `048 ${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
      str,
      null,
      4
    )}`
  );
  console.log(
    `055 ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );

  // vars
  // ---------------------------------------------------------------------------

  // single, non-recursively encoded entity:
  // /&(#?[^;\W]+;?)/g;

  // recursively encoded (one or more times over and over) HTML entity:
  // /&(#?[^;\W]+;?)+/g;

  // regex adapted taken from he.js v1.1.1
  // the difference is recursively encoded entity catch in front which is sensitive to semicolons
  const entityRegex = /&(#?[^;\W]+;)+|&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+);|&(Aacute|Agrave|Atilde|Ccedil|Eacute|Egrave|Iacute|Igrave|Ntilde|Oacute|Ograve|Oslash|Otilde|Uacute|Ugrave|Yacute|aacute|agrave|atilde|brvbar|ccedil|curren|divide|eacute|egrave|frac12|frac14|frac34|iacute|igrave|iquest|middot|ntilde|oacute|ograve|oslash|otilde|plusmn|uacute|ugrave|yacute|AElig|Acirc|Aring|Ecirc|Icirc|Ocirc|THORN|Ucirc|acirc|acute|aelig|aring|cedil|ecirc|icirc|iexcl|laquo|micro|ocirc|pound|raquo|szlig|thorn|times|ucirc|Auml|COPY|Euml|Iuml|Ouml|QUOT|Uuml|auml|cent|copy|euml|iuml|macr|nbsp|ordf|ordm|ouml|para|quot|sect|sup1|sup2|sup3|uuml|yuml|AMP|ETH|REG|amp|deg|eth|not|reg|shy|uml|yen|GT|LT|gt|lt)([=a-zA-Z0-9])?/g;

  // final ranges array:
  const rangesArr = [];

  // temporary array container
  let array1;

  const regexInvalidEntity = /&#(?:[xX][^a-fA-F0-9]|[^0-9xX])/;

  if (opts.strict) {
    const matchedInvalidEntities = str.match(regexInvalidEntity);
    if (matchedInvalidEntities) {
      throw new Error(
        `ranges-ent-decode/decode(): [THROW_ID_04] Parse error - strict mode is on and input contains an invalid entity. Here are all the invalid entities: ${JSON.stringify(
          matchedInvalidEntities,
          null,
          4
        )}`
      );
    }
  }

  // action
  // ---------------------------------------------------------------------------

  while ((array1 = entityRegex.exec(str)) !== null) {
    console.log(
      `--------\nFound ${`\u001b[${33}m${
        array1[0]
      }\u001b[${39}m`} Range: [${entityRegex.lastIndex - array1[0].length}, ${
        entityRegex.lastIndex
      }]`
    );
    const chomped = chomp(array1[0]);
    if (chomped === "&") {
      console.log('109 chomped === "&"');
      rangesArr.push([
        entityRegex.lastIndex - array1[0].length,
        entityRegex.lastIndex,
        "&"
      ]);
    } else {
      const decoded = he.decode(chomped, opts);
      console.log(
        `118 ${`\u001b[${33}m${`decoded`}\u001b[${39}m`} = ${decoded}`
      );
      if (decoded !== chomped) {
        console.log(
          `122 will push "${`\u001b[${33}m${JSON.stringify(
            [
              entityRegex.lastIndex - array1[0].length,
              entityRegex.lastIndex,
              decoded
            ],
            null,
            4
          )}\u001b[${39}m`}"`
        );
        rangesArr.push([
          entityRegex.lastIndex - array1[0].length,
          entityRegex.lastIndex,
          decoded
        ]);
      }
    }
  }

  return mergeRanges(rangesArr);
}

export default decode;
