import clone from "lodash.clonedeep";
import isObj from "lodash.isplainobject";
const isArr = Array.isArray;

/**
 * setAllValuesTo - sets all keys of all plain objects (no matter how deep-nested) to
 * a certain value
 *
 * @param  {Whatever} obj incoming object, array or whatever
 * @return {Object}       returned object
 */
function setAllValuesTo(inputOriginal, valueOriginal) {
  let value;
  const input = clone(inputOriginal);

  if (arguments.length < 2) {
    value = false;
  } else if (isObj(valueOriginal) || isArr(valueOriginal)) {
    value = clone(valueOriginal);
  } else {
    // needed for functions as values - we can't clone them!
    value = valueOriginal;
  }

  if (isArr(input)) {
    input.forEach((el, i) => {
      if (isObj(input[i]) || isArr(input[i])) {
        input[i] = setAllValuesTo(input[i], value);
      }
    });
  } else if (isObj(input)) {
    Object.keys(input).forEach((key) => {
      if (isArr(input[key]) || isObj(input[key])) {
        input[key] = setAllValuesTo(input[key], value);
      } else {
        input[key] = value;
      }
    });
  }
  return input;
}

export default setAllValuesTo;
