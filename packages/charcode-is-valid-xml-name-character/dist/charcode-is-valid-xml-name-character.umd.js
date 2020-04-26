/**
 * charcode-is-valid-xml-name-character
 * Does a given character belong to XML spec's "Production 4 OR 4a" type (is acceptable for XML element's name)
 * Version: 1.10.55
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/charcode-is-valid-xml-name-character
 */

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n(exports):"function"==typeof define&&define.amd?define(["exports"],n):n((e=e||self).charcodeIsValidXmlNameCharacter={})}(this,(function(e){"use strict";const n=Array.isArray;function t(e,t,i){const o={inclusiveRangeEnds:!1,returnMatchedRangeInsteadOfTrue:!1,...i};return!!n(t)&&(o.returnMatchedRangeInsteadOfTrue?t.find(n=>o.inclusiveRangeEnds?e>=n[0]&&e<=n[1]:e>n[0]&&e<n[1])||!1:t.some(n=>o.inclusiveRangeEnds?e>=n[0]&&e<=n[1]:e>n[0]&&e<n[1]))}var i=[[58,58],[65,90],[95,95],[192,214],[216,246],[248,767],[880,893],[895,8191],[8204,8205],[8304,8591],[11264,12271],[12289,55295],[63744,64975],[65008,65533],[65536,983039]],o=[[45,45],[46,46],[48,57],[58,58],[65,90],[95,95],[183,183],[192,214],[216,246],[248,767],[768,879],[880,893],[895,8191],[8204,8205],[8255,8256],[8304,8591],[11264,12271],[12289,55295],[63744,64975],[65008,65533],[65536,983039]],r=[[97,122]],d={inclusiveRangeEnds:!0,skipIncomingRangeSorting:!0};function c(e){return t(e.codePointAt(0),r,d)||t(e.codePointAt(0),i,d)}function s(e){return t(e.codePointAt(0),r,d)||t(e.codePointAt(0),o,d)}e.isProduction4=c,e.isProduction4a=s,e.validFirstChar=c,e.validSecondCharOnwards=s,Object.defineProperty(e,"__esModule",{value:!0})}));
