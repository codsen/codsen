import { combinations } from "object-boolean-combinations";
import clone from "lodash.clonedeep";
import { version as v } from "../package.json";
const version: string = v;

// takes subset of of opts object, ref
// and whole default opts

// for example,
// if default opts are:
//
// {
//    foo: true
//    bar: false,
//    baz: false,
//    beep: null
// }
//
// and ref object is:
//
// {
//    foo: true
// }
//
// we extract all other boolean keys, calculate array of
// their variations, copying back ref keys onto each,
// also copying back non-boolean keys.
//
// Beware that keys might have object/array values
// which be passed as reference - we have to break any references
// to the original values in both "ref" and "opts".

type PlainObject = { [name: string]: any };
type PlainObjectOfBool = { [name: string]: boolean };

function mixer(
  ref: PlainObject = {},
  defaultsObj: PlainObject = {}
): PlainObjectOfBool[] {
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

  // quick end
  if (!Object.keys(defaultsObj).length) {
    console.log(`068 early return []`);
    return [];
  }

  const refClone = clone(ref);
  const defaultsObjClone = clone(defaultsObj);
  const optsWithBoolValues: PlainObjectOfBool = {};

  // 1. find out, what boolean-value keys are there in defaultsObj that
  // are missing in ref. If there are n keys, we'll generate 2^n objects.
  Object.keys(defaultsObj).forEach((key) => {
    // if key's value is bool AND it's not present in ref,
    // add it to "optsWithBoolValues"
    if (
      typeof defaultsObjClone[key] === "boolean" &&
      !Object.keys(ref).includes(key)
    ) {
      optsWithBoolValues[key] = defaultsObjClone[key];
    }
  });

  console.log(
    `090 ${`\u001b[${33}m${`refClone`}\u001b[${39}m`} = ${JSON.stringify(
      refClone,
      null,
      4
    )}`
  );
  console.log(
    `097 ${`\u001b[${33}m${`defaultsObjClone`}\u001b[${39}m`} = ${JSON.stringify(
      defaultsObjClone,
      null,
      4
    )}`
  );
  console.log(
    `104 ${`\u001b[${33}m${`optsWithBoolValues`}\u001b[${39}m`} = ${JSON.stringify(
      optsWithBoolValues,
      null,
      4
    )}`
  );

  // calculate combinations using combinations() - object-boolean-combinations
  // then restore the non-bool keys
  const res = combinations(optsWithBoolValues).map((obj) => ({
    ...defaultsObj,
    ...refClone,
    ...obj,
  }));

  console.log(`119 RETURN res = ${JSON.stringify(res, null, 4)}`);

  return res;
}

export { mixer, version };
