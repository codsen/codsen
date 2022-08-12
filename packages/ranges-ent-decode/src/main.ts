import he from "he";
import { rMerge } from "ranges-merge";
import isObj from "lodash.isplainobject";
import type { Ranges } from "ranges-merge";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

function chomp(str: string): string {
  // eslint-disable-next-line no-param-reassign
  str = str.replace(/(amp;)|(#x26;)/gi, "");
  DEV &&
    console.log(
      `017 ${`\u001b[${33}m${`str after chomp`}\u001b[${39}m`} = ${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  return str;
}

export interface Opts {
  isAttributeValue: boolean;
  strict: boolean;
}

const defaults: Opts = {
  isAttributeValue: false,
  strict: false,
};

function rEntDecode(str: string, opts?: Partial<Opts>): Ranges {
  // insurance:
  // ---------------------------------------------------------------------------
  if (typeof str !== "string") {
    throw new TypeError(
      `ranges-ent-decode/decode(): [THROW_ID_01] Expected a String! Currently it's given as ${str}, type ${typeof str}`
    );
  } else if (!str.trim()) {
    // fast ending, matching Ranges notation - absence is marked by falsy null
    return null;
  }
  if (opts != null && !isObj(opts)) {
    throw new TypeError(
      `ranges-ent-decode/decode(): [THROW_ID_02] Optional Options Object, the second in put argument, must be a plain object! Currently it's given as ${opts}, type ${typeof opts}`
    );
  }
  let resolvedOpts: Opts = { ...defaults, ...opts };

  DEV &&
    console.log(
      `056 ${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  DEV &&
    console.log(
      `064 ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        resolvedOpts,
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
  let entityRegex =
    /&(#?[^;\W]+;)+|&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+);|&(Aacute|Agrave|Atilde|Ccedil|Eacute|Egrave|Iacute|Igrave|Ntilde|Oacute|Ograve|Oslash|Otilde|Uacute|Ugrave|Yacute|aacute|agrave|atilde|brvbar|ccedil|curren|divide|eacute|egrave|frac12|frac14|frac34|iacute|igrave|iquest|middot|ntilde|oacute|ograve|oslash|otilde|plusmn|uacute|ugrave|yacute|AElig|Acirc|Aring|Ecirc|Icirc|Ocirc|THORN|Ucirc|acirc|acute|aelig|aring|cedil|ecirc|icirc|iexcl|laquo|micro|ocirc|pound|raquo|szlig|thorn|times|ucirc|Auml|COPY|Euml|Iuml|Ouml|QUOT|Uuml|auml|cent|copy|euml|iuml|macr|nbsp|ordf|ordm|ouml|para|quot|sect|sup1|sup2|sup3|uuml|yuml|AMP|ETH|REG|amp|deg|eth|not|reg|shy|uml|yen|GT|LT|gt|lt)([=a-zA-Z0-9])?/g;

  // final ranges array:
  let rangesArr = [];

  // temporary array container
  let array1;

  let regexInvalidEntity = /&#(?:[xX][^a-fA-F0-9]|[^0-9xX])/;

  if (resolvedOpts.strict) {
    let matchedInvalidEntities = str.match(regexInvalidEntity);
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

  // eslint-disable-next-line no-cond-assign
  while ((array1 = entityRegex.exec(str)) !== null) {
    DEV &&
      console.log(
        `--------\nFound ${`\u001b[${33}m${array1[0]}\u001b[${39}m`} Range: [${
          entityRegex.lastIndex - array1[0].length
        }, ${entityRegex.lastIndex}]`
      );
    let chomped = chomp(array1[0]);
    if (chomped === "&") {
      DEV && console.log('119 chomped === "&"');
      rangesArr.push([
        entityRegex.lastIndex - array1[0].length,
        entityRegex.lastIndex,
        "&",
      ]);
    } else {
      let decoded = he.decode(chomped, resolvedOpts);
      DEV &&
        console.log(
          `129 ${`\u001b[${33}m${`decoded`}\u001b[${39}m`} = ${decoded}`
        );
      if (decoded !== chomped) {
        DEV &&
          console.log(
            `134 will push "${`\u001b[${33}m${JSON.stringify(
              [
                entityRegex.lastIndex - array1[0].length,
                entityRegex.lastIndex,
                decoded,
              ],
              null,
              4
            )}\u001b[${39}m`}"`
          );
        rangesArr.push([
          entityRegex.lastIndex - array1[0].length,
          entityRegex.lastIndex,
          decoded,
        ]);
      }
    }
  }

  return rMerge(rangesArr as Ranges);
}

export { rEntDecode, defaults, Ranges, version };
