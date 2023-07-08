import { version as v } from "../package.json";

const version: string = v;
declare let DEV: boolean;

export interface Opts {
  throwIfEdgeWhitespace: boolean;
}
const defaults: Opts = {
  throwIfEdgeWhitespace: true,
};

function split(str: string, opts?: Partial<Opts>): number {
  if (typeof str !== "string") {
    throw new Error(
      `string-bionic-split: [THROW_ID_01] The input should be a string! We received ${JSON.stringify(
        str,
        null,
        4,
      )} (typeof is ${typeof str})`,
    );
  }
  if (opts && (Array.isArray(opts) || typeof opts !== "object")) {
    throw new Error(
      `string-bionic-split: [THROW_ID_02] The options object should be a plain object! We received ${JSON.stringify(
        opts,
        null,
        4,
      )} (typeof is ${typeof opts})`,
    );
  }

  // early ending:
  if (!str.length) {
    DEV && console.log(`035 ${`\u001b[${32}m${`EARLY ENDING`}\u001b[${39}m`}`);
    return 0;
  }

  let resolvedOpts: Opts = { ...defaults, ...opts };
  DEV &&
    console.log(
      `042 ${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        resolvedOpts,
        null,
        4,
      )}`,
    );
  if (resolvedOpts.throwIfEdgeWhitespace) {
    if (!str[0].trim()) {
      throw new Error(
        "string-bionic-split: [THROW_ID_03] Leading whitespace detected!",
      );
    } else if (!str[~-str.length].trim()) {
      throw new Error(
        "string-bionic-split: [THROW_ID_04] Trailing whitespace detected!",
      );
    }
  }

  // ref https://en.wikipedia.org/wiki/Vowel#Written_vowels
  // tested on French and Russian orthography, should work everywhere else
  let vowels =
    "aeiouyàáâãäåæèéêëìíîïòóôõöøùúûüýÿāăąēĕėęěĩīĭįĳōŏőœũūŭůűųŷǎǐǒǔǖǘǚǜǟǡǣǫǭǻǽǿȁȃȅȇȉȋȍȏȕȗȧȩȫȭȯȱȳ̇аеийоуыэюяѐёєіїѝў";

  if (str.length <= 3) {
    DEV && console.log(`066 entering the "length <= 3" clauses`);
    if (str.length === 1) {
      DEV && console.log(`068 entering the "length === 1" clauses`);
      // probably it's an abbreviation for metres, hours, seconds and tonnes
      // and splitting algorithm is primitive, not accounting numbers etc.
      if ("dghmtsмчст".includes(str.toLowerCase())) {
        DEV && console.log(`072 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} 0`);
        return 0;
      }
    } else if (
      str.length === 2 &&
      [
        "km",
        "dm",
        "cm",
        "mm",
        "nm",
        "ms",
        "ns",
        "pb",
        "tb",
        "mb",
        "kb",
        "kg",
      ].includes(str.toLowerCase())
    ) {
      // units, like "km" or "mm"
      DEV &&
        console.log(`094 units - ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} 0`);
      return 0;
    }

    DEV &&
      console.log(`099 default ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} 1`);
    return 1;
  } else if (str.length === 4) {
    DEV &&
      console.log(
        `104 length 4 - ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} 2`,
      );
    return 2;
  } else if (str.length % 2 === 1) {
    DEV && console.log(`108 odd number length clauses`);
    let middle = Math.floor(str.length / 2);
    DEV &&
      console.log(
        `112 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`middle`}\u001b[${39}m`} = ${middle} (${
          str[middle]
        })`,
      );

    // vowel on the left, vowel on the right - go left
    DEV &&
      console.log(
        `120 on the left: ${str[middle - 1]}; on the right: ${str[middle + 1]}`,
      );

    if (vowels.includes(str[middle].toLowerCase())) {
      // middle letter is vowel
      DEV && console.log(`125 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`}`);
      return middle + 1;
    }
    // ELSE - middle letter is consonant
    DEV &&
      console.log(
        `131 ${`\u001b[${32}m${`RETURN ${str.slice(
          0,
          middle + 1,
        )} + ${str.slice(middle + 1)}`}\u001b[${39}m`}`,
      );
    return middle + 1;
  }

  DEV &&
    console.log(
      `141 final default ${`\u001b[${32}m${`RETURN ${str.slice(
        0,
        Math.floor(str.length / 2),
      )} + ${str.slice(Math.floor(str.length / 2))}`}\u001b[${39}m`}`,
    );
  return Math.floor(str.length / 2);
}

export { split, defaults, version };
