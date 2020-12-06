/**
 * test-mixer
 * Test helper to generate function opts object variations
 * Version: 1.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/test-mixer/
 */

import obc from 'object-boolean-combinations';
import clone from 'lodash.clonedeep';

function mixer(ref = {}, defaultsObj = {}) {
  if (ref && typeof ref !== "object") {
    throw new Error(
      `test-mixer: [THROW_ID_01] the first input arg is missing!`
    );
  }
  if (defaultsObj && typeof defaultsObj !== "object") {
    throw new Error(
      `test-mixer: [THROW_ID_02] the second input arg is missing!`
    );
  }
  let caught;
  if (
    typeof ref === "object" &&
    typeof defaultsObj === "object" &&
    Object.keys(ref).some((refKey) => {
      if (!Object.keys(defaultsObj).includes(refKey)) {
        caught = refKey;
        return true;
      }
    })
  ) {
    throw new Error(
      `test-mixer: [THROW_ID_03] the second input arg object should be defaults; it should be a superset of 1st input arg object. However, 1st input arg object contains key "${caught}" which 2nd input arg object doesn't have.`
    );
  }
  if (!Object.keys(defaultsObj).length) {
    return [];
  }
  const refClone = clone(ref);
  const defaultsObjClone = clone(defaultsObj);
  const optsWithBoolValues = {};
  Object.keys(defaultsObj).forEach((key) => {
    if (
      typeof defaultsObjClone[key] === "boolean" &&
      !Object.keys(ref).includes(key)
    ) {
      optsWithBoolValues[key] = defaultsObjClone[key];
    }
  });
  const res = obc(optsWithBoolValues).map((obj) => ({
    ...defaultsObj,
    ...refClone,
    ...obj,
  }));
  return res;
}

export default mixer;
