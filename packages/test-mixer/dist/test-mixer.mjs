/**
 * test-mixer
 * Test helper to generate function opts object variations
 * Version: 2.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/test-mixer/
 */

import{combinations as e}from"object-boolean-combinations";import t from"lodash.clonedeep";const o="2.0.5";function r(o={},r={}){if(o&&"object"!=typeof o)throw new Error("test-mixer: [THROW_ID_01] the first input arg is missing!");if(r&&"object"!=typeof r)throw new Error("test-mixer: [THROW_ID_02] the second input arg is missing!");let s;if("object"==typeof o&&"object"==typeof r&&Object.keys(o).some((e=>{if(!Object.keys(r).includes(e))return s=e,!0})))throw new Error(`test-mixer: [THROW_ID_03] the second input arg object should be defaults; it should be a superset of 1st input arg object. However, 1st input arg object contains key "${s}" which 2nd input arg object doesn't have.`);if(!Object.keys(r).length)return[];const n=t(o),i=t(r),c={};Object.keys(r).forEach((e=>{"boolean"!=typeof i[e]||Object.keys(o).includes(e)||(c[e]=i[e])}));return e(c).map((e=>({...r,...n,...e})))}export{r as mixer,o as version};
