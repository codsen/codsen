/* eslint no-console:0 */

import checkTypes from "check-types-mini";
import mergeAdvanced from "object-merge-advanced";

const isArr = Array.isArray;

function sortObject(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      // eslint-disable-next-line no-param-reassign
      result[key] = obj[key];
      return result;
    }, {});
}

function generateAst(input, originalOpts) {
  if (!isArr(input)) {
    throw new Error(
      `array-of-arrays-into-ast: [THROW_ID_01] input must be array. Currently it's of a type ${typeof input} equal to:\n${JSON.stringify(
        input,
        null,
        4
      )}`
    );
  } else if (input.length === 0) {
    return {};
  }

  const defaults = {
    dedupe: true,
  };
  const opts = { ...defaults, ...originalOpts };

  checkTypes(opts, defaults, {
    msg: "array-of-arrays-into-ast: [THROW_ID_02*]",
    optsVarName: "opts",
  });

  let res = {};

  input.forEach((arr) => {
    console.log(
      `${`\u001b[${36}m${`================================================ ${arr}`}\u001b[${39}m`}`
    );

    let temp = null;
    for (let i = arr.length; i--; ) {
      console.log(arr[i]);
      temp = { [arr[i]]: [temp] }; // uses ES6 computed property names
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names
    }
    res = mergeAdvanced(res, temp, { concatInsteadOfMerging: !opts.dedupe });
    console.log(
      `${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
        temp,
        null,
        4
      )}`
    );

    console.log(
      `${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
        res,
        null,
        4
      )}`
    );
  });
  console.log(
    `\u001b[${36}m${`================================================`}\u001b[${39}m\n\n`
  );
  return sortObject(res);
}

export default generateAst;
