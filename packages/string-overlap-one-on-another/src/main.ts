import { version } from "../package.json";

interface Opts {
  offset: number;
  offsetFillerCharacter: string;
}

const defaults: Opts = {
  offset: 0, // how many characters str2 is to the right? (negative means it's off to the left)
  offsetFillerCharacter: " ", // how many characters str2 is to the right? (negative means it's off to the left)
};

function overlap(str1: string, str2: string, originalOpts?: Opts): string {
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

  let opts: Opts;
  if (!originalOpts) {
    // it's fine because we won't overwrite opts:
    opts = defaults;
  } else if (typeof originalOpts !== "object") {
    throw new Error(
      `string-overlap-one-on-another: [THROW_ID_03] The third input argument must be a plain object but it was given as ${JSON.stringify(
        str2,
        null,
        4
      )}, which is type "${typeof originalOpts}"`
    );
  } else {
    opts = { ...defaults, ...originalOpts };
    if (!opts.offset) {
      opts.offset = 0;
    } else if (!Number.isInteger(Math.abs(opts.offset))) {
      throw new Error(
        `string-overlap-one-on-another: [THROW_ID_04] The second input argument must be a string but it was given as ${JSON.stringify(
          str2,
          null,
          4
        )}, which is type "${typeof str2}"`
      );
    }
    if (!opts.offsetFillerCharacter && opts.offsetFillerCharacter !== "") {
      opts.offsetFillerCharacter = " ";
    }
  }

  if (str2.length === 0) {
    return str1;
  }
  if (str1.length === 0) {
    return str2;
  }

  if (opts.offset < 0) {
    // filler character sequence - space or opts.offsetFillerCharacter:
    const part2 =
      Math.abs(opts.offset) > str2.length
        ? opts.offsetFillerCharacter.repeat(Math.abs(opts.offset) - str2.length)
        : "";
    // the reset of str1 string protruding from underneath, if any:
    const part3 = str1.slice(
      str2.length - Math.abs(opts.offset) > 0
        ? str2.length - Math.abs(opts.offset)
        : 0
    );
    return str2 + part2 + part3;
  }
  if (opts.offset > 0) {
    // filler character sequence, if any, the space or opts.offsetFillerCharacter:
    const par1 =
      str1.slice(0, opts.offset) +
      (opts.offset > str1.length
        ? opts.offsetFillerCharacter.repeat(Math.abs(opts.offset) - str1.length)
        : "");
    // the rest of str1 string, if applicable:
    const part2 =
      str1.length - opts.offset - str2.length > 0
        ? str1.slice(str1.length - opts.offset - str2.length + 1)
        : "";
    return par1 + str2 + part2;
  }
  return str2 + (str1.length > str2.length ? str1.slice(str2.length) : "");
}

export { overlap, version };
