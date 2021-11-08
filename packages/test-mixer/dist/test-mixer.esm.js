/**
 * @name test-mixer
 * @fileoverview Test helper to generate function opts object variations
 * @version 3.0.5
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/test-mixer/}
 */

import { combinations } from 'object-boolean-combinations';
import clone from 'lodash.clonedeep';

var version$1 = "3.0.5";

const version = version$1;
function mixer(ref = {}, defaultsObj = {}) {
  if (ref && typeof ref !== "object") {
    throw new Error(`test-mixer: [THROW_ID_01] the first input arg is missing!`);
  }
  if (defaultsObj && typeof defaultsObj !== "object") {
    throw new Error(`test-mixer: [THROW_ID_02] the second input arg is missing!`);
  }
  let caught;
  if (typeof ref === "object" && typeof defaultsObj === "object" && Object.keys(ref).some(refKey => {
    if (!Object.keys(defaultsObj).includes(refKey)) {
      caught = refKey;
      return true;
    }
  })) {
    throw new Error(`test-mixer: [THROW_ID_03] the second input arg object should be defaults; it should be a superset of 1st input arg object. However, 1st input arg object contains key "${caught}" which 2nd input arg object doesn't have.`);
  }
  if (!Object.keys(defaultsObj).length) {
    return [];
  }
  const refClone = clone(ref);
  const defaultsObjClone = clone(defaultsObj);
  const optsWithBoolValues = {};
  Object.keys(defaultsObj).forEach(key => {
    if (typeof defaultsObjClone[key] === "boolean" && !Object.keys(ref).includes(key)) {
      optsWithBoolValues[key] = defaultsObjClone[key];
    }
  });
  const res = combinations(optsWithBoolValues).map(obj => ({ ...defaultsObj,
    ...refClone,
    ...obj
  }));
  return res;
}

export { mixer, version };
