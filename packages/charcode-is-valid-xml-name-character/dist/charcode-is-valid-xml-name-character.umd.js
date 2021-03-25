/**
 * charcode-is-valid-xml-name-character
 * Does a given character belong to XML spec's "Production 4 OR 4a" type (is acceptable for XML element's name)
 * Version: 1.12.10
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/charcode-is-valid-xml-name-character/
 */

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e="undefined"!=typeof globalThis?globalThis:e||self).charcodeIsValidXmlNameCharacter={})}(this,(function(e){"use strict";const n={inclusiveRangeEnds:!1,returnMatchedRangeInsteadOfTrue:!1};function t(e,t,i){const r={...n,...i};if(!Number.isInteger(e))throw new Error(`ranges-is-index-within: [THROW_ID_01] the first input argument should be string index, a natural number (or zero). It was given as ${e} (type ${typeof e})`);return!!Array.isArray(t)&&(r.returnMatchedRangeInsteadOfTrue?t.find((n=>r.inclusiveRangeEnds?e>=n[0]&&e<=n[1]:e>n[0]&&e<n[1]))||!1:t.some((n=>r.inclusiveRangeEnds?e>=n[0]&&e<=n[1]:e>n[0]&&e<n[1])))}const i=[[58,58],[65,90],[95,95],[192,214],[216,246],[248,767],[880,893],[895,8191],[8204,8205],[8304,8591],[11264,12271],[12289,55295],[63744,64975],[65008,65533],[65536,983039]],r=[[45,45],[46,46],[48,57],[58,58],[65,90],[95,95],[183,183],[192,214],[216,246],[248,767],[768,879],[880,893],[895,8191],[8204,8205],[8255,8256],[8304,8591],[11264,12271],[12289,55295],[63744,64975],[65008,65533],[65536,983039]],o=[[97,122]],s={inclusiveRangeEnds:!0,skipIncomingRangeSorting:!0};function a(e){return t(e.codePointAt(0),o,s)||t(e.codePointAt(0),i,s)}function d(e){return t(e.codePointAt(0),o,s)||t(e.codePointAt(0),r,s)}e.isProduction4=a,e.isProduction4a=d,e.validFirstChar=a,e.validSecondCharOnwards=d,Object.defineProperty(e,"__esModule",{value:!0})}));
