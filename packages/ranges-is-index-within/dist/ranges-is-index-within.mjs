/**
 * ranges-is-index-within
 * Checks if index is within any of the given string index ranges
 * Version: 1.16.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-is-index-within/
 */

var e="1.16.0";const n={inclusiveRangeEnds:!1,returnMatchedRangeInsteadOfTrue:!1};function r(e,r,t){const i={...n,...t};if(!Number.isInteger(e))throw Error(`ranges-is-index-within: [THROW_ID_01] the first input argument should be string index, a natural number (or zero). It was given as ${e} (type ${typeof e})`);return!!Array.isArray(r)&&(i.returnMatchedRangeInsteadOfTrue?r.find((n=>i.inclusiveRangeEnds?e>=n[0]&&n[1]>=e:e>n[0]&&n[1]>e))||!1:r.some((n=>i.inclusiveRangeEnds?e>=n[0]&&n[1]>=e:e>n[0]&&n[1]>e)))}export{n as defaults,r as isIndexWithin,e as version};
