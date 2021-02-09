/**
 * ranges-ent-decode
 * Recursive HTML entity decoding for Ranges workflow
 * Version: 4.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-ent-decode/
 */

import e from"he";import{rMerge as t}from"ranges-merge";import r from"lodash.isplainobject";const i="4.0.3";function a(e){return e=e.replace(/(amp;)|(#x26;)/gi,"")}const c={isAttributeValue:!1,strict:!1};function n(i,n){if("string"!=typeof i)throw new TypeError(`ranges-ent-decode/decode(): [THROW_ID_01] Expected a String! Currently it's given as ${i}, type ${typeof i}`);if(!i.trim())return null;if(null!=n&&!r(n))throw new TypeError(`ranges-ent-decode/decode(): [THROW_ID_02] Optional Options Object, the second in put argument, must be a plain object! Currently it's given as ${n}, type ${typeof n}`);const o={...c,...n},l=/&(#?[^;\W]+;)+|&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+);|&(Aacute|Agrave|Atilde|Ccedil|Eacute|Egrave|Iacute|Igrave|Ntilde|Oacute|Ograve|Oslash|Otilde|Uacute|Ugrave|Yacute|aacute|agrave|atilde|brvbar|ccedil|curren|divide|eacute|egrave|frac12|frac14|frac34|iacute|igrave|iquest|middot|ntilde|oacute|ograve|oslash|otilde|plusmn|uacute|ugrave|yacute|AElig|Acirc|Aring|Ecirc|Icirc|Ocirc|THORN|Ucirc|acirc|acute|aelig|aring|cedil|ecirc|icirc|iexcl|laquo|micro|ocirc|pound|raquo|szlig|thorn|times|ucirc|Auml|COPY|Euml|Iuml|Ouml|QUOT|Uuml|auml|cent|copy|euml|iuml|macr|nbsp|ordf|ordm|ouml|para|quot|sect|sup1|sup2|sup3|uuml|yuml|AMP|ETH|REG|amp|deg|eth|not|reg|shy|uml|yen|GT|LT|gt|lt)([=a-zA-Z0-9])?/g,u=[];let s;if(o.strict){const e=i.match(/&#(?:[xX][^a-fA-F0-9]|[^0-9xX])/);if(e)throw new Error(`ranges-ent-decode/decode(): [THROW_ID_04] Parse error - strict mode is on and input contains an invalid entity. Here are all the invalid entities: ${JSON.stringify(e,null,4)}`)}for(;null!==(s=l.exec(i));){const t=a(s[0]);if("&"===t)u.push([l.lastIndex-s[0].length,l.lastIndex,"&"]);else{const r=e.decode(t,o);r!==t&&u.push([l.lastIndex-s[0].length,l.lastIndex,r])}}return t(u)}export{c as defaults,n as rEntDecode,i as version};
