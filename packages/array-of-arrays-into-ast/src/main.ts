import { mergeAdvanced } from "object-merge-advanced";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

interface UnknownValueObj {
  [key: string]: any;
}

interface Opts {
  dedupe: boolean;
}

const defaults: Opts = {
  dedupe: true,
};

function sortObject(obj: UnknownValueObj): UnknownValueObj {
  return Object.keys(obj)
    .sort()
    .reduce((result: UnknownValueObj, key) => {
      result[key] = obj[key];
      return result;
    }, {});
}

/**
 * Turns an array of arrays of data into a nested tree of plain objects
 */
function generateAst(
  input: any[],
  originalOpts?: Partial<Opts>
): UnknownValueObj {
  if (!Array.isArray(input)) {
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

  let opts: Opts = { ...defaults, ...originalOpts };

  let res = {};

  input.forEach((arr) => {
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
    res = mergeAdvanced(res, temp, { concatInsteadOfMerging: !opts.dedupe });
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
