/**
 * ranges-offset
 * Increment or decrement each index in every range
 * Version: 2.0.7
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-offset/
 */

const r="2.0.7";function e(r,e=0){return Array.isArray(r)&&r.length?r.map((([...r])=>("number"==typeof r[0]&&(r[0]+=e),"number"==typeof r[1]&&(r[1]+=e),[...r]))):r}export{e as rOffset,r as version};
