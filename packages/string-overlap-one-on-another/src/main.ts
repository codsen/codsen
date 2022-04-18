import { version as v } from "../package.json";

const version: string = v;

interface Opts {
  offset: number;
  offsetFillerCharacter: string;
}

const defaults: Opts = {
  offset: 0, // how many characters str2 is to the right? (negative means it's off to the left)
  offsetFillerCharacter: " ", // how many characters str2 is to the right? (negative means it's off to the left)
};

function overlap(str1: string, str2: string, opts?: Partial<Opts>): string {
  if (typeof str1 !== "string") {
    throw new Error(
      `string-overlap-one-on-another: [THROW_ID_01] The first input argument must be a string but it was given as ${JSON.stringify(
        str1,
        null,
        4
      )}, which is type "${typeof str1}"`
    );
  }
  if (typeof str2 !== "string") {
    throw new Error(
      `string-overlap-one-on-another: [THROW_ID_02] The second input argument must be a string but it was given as ${JSON.stringify(
        str2,
        null,
        4
      )}, which is type "${typeof str2}"`
    );
  }

  let resolvedOpts: Opts;
  if (!opts) {
    // it's fine because we won't overwrite resolvedOpts:
    resolvedOpts = defaults;
  } else if (typeof opts !== "object") {
    throw new Error(
      `string-overlap-one-on-another: [THROW_ID_03] The third input argument must be a plain object but it was given as ${JSON.stringify(
        str2,
        null,
        4
      )}, which is type "${typeof opts}"`
    );
  } else {
    resolvedOpts = { ...defaults, ...opts };
    if (!resolvedOpts.offset) {
      resolvedOpts.offset = 0;
    } else if (!Number.isInteger(Math.abs(resolvedOpts.offset))) {
      throw new Error(
        `string-overlap-one-on-another: [THROW_ID_04] The second input argument must be a string but it was given as ${JSON.stringify(
          str2,
          null,
          4
        )}, which is type "${typeof str2}"`
      );
    }
    if (
      !resolvedOpts.offsetFillerCharacter &&
      resolvedOpts.offsetFillerCharacter !== ""
    ) {
      resolvedOpts.offsetFillerCharacter = " ";
    }
  }

  if (str2.length === 0) {
    return str1;
  }
  if (str1.length === 0) {
    return str2;
  }

  if (resolvedOpts.offset < 0) {
    // filler character sequence - space or resolvedOpts.offsetFillerCharacter:
    let part2 =
      Math.abs(resolvedOpts.offset) > str2.length
        ? resolvedOpts.offsetFillerCharacter.repeat(
            Math.abs(resolvedOpts.offset) - str2.length
          )
        : "";
    // the reset of str1 string protruding from underneath, if any:
    let part3 = str1.slice(
      str2.length - Math.abs(resolvedOpts.offset) > 0
        ? str2.length - Math.abs(resolvedOpts.offset)
        : 0
    );
    return str2 + part2 + part3;
  }
  if (resolvedOpts.offset > 0) {
    // filler character sequence, if any, the space or resolvedOpts.offsetFillerCharacter:
    let par1 =
      str1.slice(0, resolvedOpts.offset) +
      (resolvedOpts.offset > str1.length
        ? resolvedOpts.offsetFillerCharacter.repeat(
            Math.abs(resolvedOpts.offset) - str1.length
          )
        : "");
    // the rest of str1 string, if applicable:
    let part2 =
      str1.length - resolvedOpts.offset - str2.length > 0
        ? str1.slice(str1.length - resolvedOpts.offset - str2.length + 1)
        : "";
    return par1 + str2 + part2;
  }
  return str2 + (str1.length > str2.length ? str1.slice(str2.length) : "");
}

export { overlap, defaults, version };
