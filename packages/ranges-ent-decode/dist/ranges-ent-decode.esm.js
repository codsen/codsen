/**
 * ranges-ent-decode
 * Decode HTML entities recursively, get string index ranges of what needs to be replaced where
 * Version: 2.0.56
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-ent-decode
 */

import he from 'he';
import mergeRanges from 'ranges-merge';
import isObj from 'lodash.isplainobject';

function chomp(str) {
  str = str.replace(/(amp;)|(#x26;)/gi, "");
  return str;
}
function decode(str, originalOpts) {
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
    strict: false,
  };
  let opts;
  if (!originalOpts) {
    opts = defaults;
  } else {
    opts = { ...defaults, ...originalOpts };
  }
  const entityRegex = /&(#?[^;\W]+;)+|&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+);|&(Aacute|Agrave|Atilde|Ccedil|Eacute|Egrave|Iacute|Igrave|Ntilde|Oacute|Ograve|Oslash|Otilde|Uacute|Ugrave|Yacute|aacute|agrave|atilde|brvbar|ccedil|curren|divide|eacute|egrave|frac12|frac14|frac34|iacute|igrave|iquest|middot|ntilde|oacute|ograve|oslash|otilde|plusmn|uacute|ugrave|yacute|AElig|Acirc|Aring|Ecirc|Icirc|Ocirc|THORN|Ucirc|acirc|acute|aelig|aring|cedil|ecirc|icirc|iexcl|laquo|micro|ocirc|pound|raquo|szlig|thorn|times|ucirc|Auml|COPY|Euml|Iuml|Ouml|QUOT|Uuml|auml|cent|copy|euml|iuml|macr|nbsp|ordf|ordm|ouml|para|quot|sect|sup1|sup2|sup3|uuml|yuml|AMP|ETH|REG|amp|deg|eth|not|reg|shy|uml|yen|GT|LT|gt|lt)([=a-zA-Z0-9])?/g;
  const rangesArr = [];
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
  while ((array1 = entityRegex.exec(str)) !== null) {
    const chomped = chomp(array1[0]);
    if (chomped === "&") {
      rangesArr.push([
        entityRegex.lastIndex - array1[0].length,
        entityRegex.lastIndex,
        "&",
      ]);
    } else {
      const decoded = he.decode(chomped, opts);
      if (decoded !== chomped) {
        rangesArr.push([
          entityRegex.lastIndex - array1[0].length,
          entityRegex.lastIndex,
          decoded,
        ]);
      }
    }
  }
  return mergeRanges(rangesArr);
}

export default decode;
