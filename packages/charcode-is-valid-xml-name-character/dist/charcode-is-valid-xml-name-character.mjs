/**
 * charcode-is-valid-xml-name-character
 * Does a given character belong to XML spec's "Production 4 OR 4a" type (is acceptable for XML element's name)
 * Version: 1.12.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/charcode-is-valid-xml-name-character/
 */

import{isIndexWithin as n}from"ranges-is-index-within";const i=[[58,58],[65,90],[95,95],[192,214],[216,246],[248,767],[880,893],[895,8191],[8204,8205],[8304,8591],[11264,12271],[12289,55295],[63744,64975],[65008,65533],[65536,983039]],t=[[45,45],[46,46],[48,57],[58,58],[65,90],[95,95],[183,183],[192,214],[216,246],[248,767],[768,879],[880,893],[895,8191],[8204,8205],[8255,8256],[8304,8591],[11264,12271],[12289,55295],[63744,64975],[65008,65533],[65536,983039]],o=[[97,122]],e={inclusiveRangeEnds:!0,skipIncomingRangeSorting:!0};function r(t){return n(t.codePointAt(0),o,e)||n(t.codePointAt(0),i,e)}function a(i){return n(i.codePointAt(0),o,e)||n(i.codePointAt(0),t,e)}export{r as isProduction4,a as isProduction4a,r as validFirstChar,a as validSecondCharOnwards};
