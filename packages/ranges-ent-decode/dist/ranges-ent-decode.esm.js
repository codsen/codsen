/**
 * ranges-ent-decode
 * Recursive HTML entity decoding for Ranges workflow
 * Version: 4.0.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-ent-decode/
 */

import he from 'he';
import { rMerge } from 'ranges-merge';
import isObj from 'lodash.isplainobject';

var version = "4.0.0";

const version$1 = version;

function chomp(str) {
  // eslint-disable-next-line no-param-reassign
  str = str.replace(/(amp;)|(#x26;)/gi, "");
  return str;
}

const defaults = {
  isAttributeValue: false,
  strict: false
};

function rEntDecode(str, originalOpts) {
  // insurance:
  // ---------------------------------------------------------------------------
  if (typeof str !== "string") {
    throw new TypeError(`ranges-ent-decode/decode(): [THROW_ID_01] Expected a String! Currently it's given as ${str}, type ${typeof str}`);
  } else if (!str.trim()) {
    // fast ending, matching Ranges notation - absence is marked by falsy null
    return null;
  }

  if (originalOpts != null && !isObj(originalOpts)) {
    throw new TypeError(`ranges-ent-decode/decode(): [THROW_ID_02] Optional Options Object, the second in put argument, must be a plain object! Currently it's given as ${originalOpts}, type ${typeof originalOpts}`);
  }

  const opts = { ...defaults,
    ...originalOpts
  }; // vars
  // ---------------------------------------------------------------------------
  // single, non-recursively encoded entity:
  // /&(#?[^;\W]+;?)/g;
  // recursively encoded (one or more times over and over) HTML entity:
  // /&(#?[^;\W]+;?)+/g;
  // regex adapted taken from he.js v1.1.1
  // the difference is recursively encoded entity catch in front which is sensitive to semicolons

  const entityRegex = /&(#?[^;\W]+;)+|&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+);|&(Aacute|Agrave|Atilde|Ccedil|Eacute|Egrave|Iacute|Igrave|Ntilde|Oacute|Ograve|Oslash|Otilde|Uacute|Ugrave|Yacute|aacute|agrave|atilde|brvbar|ccedil|curren|divide|eacute|egrave|frac12|frac14|frac34|iacute|igrave|iquest|middot|ntilde|oacute|ograve|oslash|otilde|plusmn|uacute|ugrave|yacute|AElig|Acirc|Aring|Ecirc|Icirc|Ocirc|THORN|Ucirc|acirc|acute|aelig|aring|cedil|ecirc|icirc|iexcl|laquo|micro|ocirc|pound|raquo|szlig|thorn|times|ucirc|Auml|COPY|Euml|Iuml|Ouml|QUOT|Uuml|auml|cent|copy|euml|iuml|macr|nbsp|ordf|ordm|ouml|para|quot|sect|sup1|sup2|sup3|uuml|yuml|AMP|ETH|REG|amp|deg|eth|not|reg|shy|uml|yen|GT|LT|gt|lt)([=a-zA-Z0-9])?/g; // final ranges array:

  const rangesArr = []; // temporary array container

  let array1;
  const regexInvalidEntity = /&#(?:[xX][^a-fA-F0-9]|[^0-9xX])/;

  if (opts.strict) {
    const matchedInvalidEntities = str.match(regexInvalidEntity);

    if (matchedInvalidEntities) {
      throw new Error(`ranges-ent-decode/decode(): [THROW_ID_04] Parse error - strict mode is on and input contains an invalid entity. Here are all the invalid entities: ${JSON.stringify(matchedInvalidEntities, null, 4)}`);
    }
  } // action
  // ---------------------------------------------------------------------------
  // eslint-disable-next-line no-cond-assign


  while ((array1 = entityRegex.exec(str)) !== null) {
    const chomped = chomp(array1[0]);

    if (chomped === "&") {
      rangesArr.push([entityRegex.lastIndex - array1[0].length, entityRegex.lastIndex, "&"]);
    } else {
      const decoded = he.decode(chomped, opts);

      if (decoded !== chomped) {
        rangesArr.push([entityRegex.lastIndex - array1[0].length, entityRegex.lastIndex, decoded]);
      }
    }
  }

  return rMerge(rangesArr);
}

export { defaults, rEntDecode, version$1 as version };
