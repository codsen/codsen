import { mergeAdvanced } from "object-merge-advanced";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

interface PlainObj {
  [key: string]: any;
}

interface Opts {
  dedupe: boolean;
}

const defaults: Opts = {
  dedupe: true,
};

function sortObject(obj: PlainObj): PlainObj {
  return Object.keys(obj)
    .sort()
    .reduce((result: PlainObj, key) => {
      result[key] = obj[key];
      return result;
    }, {});
}

/**
 * Turns an array of arrays of data into a nested tree of plain objects
 */
function generateAst(inputArr: any[], opts?: Partial<Opts>): PlainObj {
  if (!Array.isArray(inputArr)) {
    throw new Error(
      `array-of-arrays-into-ast: [THROW_ID_01] inputArr must be array. Currently it's of a type ${typeof inputArr} equal to:\n${JSON.stringify(
        inputArr,
        null,
        4
      )}`
    );
  } else if (inputArr.length === 0) {
    return {};
  }

  let resolvedOpts: Opts = { ...defaults, ...opts };

  let res = {};

  inputArr.forEach((arr) => {
    DEV &&
      console.log(
        `${`\u001b[${36}m${`================================================ ${arr}`}\u001b[${39}m`}`
      );

    let temp = null;
    for (let i = arr.length; i--; ) {
      DEV && console.log(arr[i]);
      temp = { [arr[i]]: [temp] }; // uses ES6 computed property names
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names
    }
    res = mergeAdvanced(res, temp, {
      concatInsteadOfMerging: !resolvedOpts.dedupe,
    });
    DEV &&
      console.log(
        `${`\u001b[${33}m${`temp`}\u001b[${39}m`} = ${JSON.stringify(
          temp,
          null,
          4
        )}`
      );

    DEV &&
      console.log(
        `${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
          res,
          null,
          4
        )}`
      );
  });
  DEV &&
    console.log(
      `\u001b[${36}m${`================================================`}\u001b[${39}m\n\n`
    );
  return sortObject(res);
}

export { generateAst, defaults, version };
