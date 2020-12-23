/**
 * test-mixer
 * Test helper to generate function opts object variations
 * Version: 1.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/test-mixer/
 */

import{combinations as e}from"object-boolean-combinations";import t from"lodash.clonedeep";var o="1.0.1";function r(o={},r={}){if(o&&"object"!=typeof o)throw Error("test-mixer: [THROW_ID_01] the first input arg is missing!");if(r&&"object"!=typeof r)throw Error("test-mixer: [THROW_ID_02] the second input arg is missing!");let s;if("object"==typeof o&&"object"==typeof r&&Object.keys(o).some((e=>{if(!Object.keys(r).includes(e))return s=e,!0})))throw Error(`test-mixer: [THROW_ID_03] the second input arg object should be defaults; it should be a superset of 1st input arg object. However, 1st input arg object contains key "${s}" which 2nd input arg object doesn't have.`);if(!Object.keys(r).length)return[];const i=t(o),n=t(r),c={};Object.keys(r).forEach((e=>{"boolean"!=typeof n[e]||Object.keys(o).includes(e)||(c[e]=n[e])}));return e(c).map((e=>({...r,...i,...e})))}export{r as mixer,o as version};
