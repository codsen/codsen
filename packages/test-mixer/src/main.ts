import {
  deepClone as clone,
  formatDiagnosticValue,
  isPlainObject as isObj,
} from "codsen-utils";
import { combinations } from "object-boolean-combinations";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

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

export type PlainObject = { [name: string]: any };

/**
 * @deprecated `mixer()` rows can contain non-boolean values. Use
 * `MixerResult` for generated rows.
 */
export type PlainObjectOfBool = { [name: string]: boolean };

export type BooleanValuesWidened<T extends PlainObject> = {
  [Key in keyof T]: T[Key] extends boolean ? boolean : T[Key];
};

export type MixerResult<
  Ref extends PlainObject,
  Defaults extends PlainObject,
> = Omit<BooleanValuesWidened<Defaults>, keyof Ref> & Ref;

export interface MixerOptions {
  maxCombinations: number;
}

const maxEagerCombinations = 16_384;

export const defaults: Readonly<MixerOptions> = Object.freeze({
  maxCombinations: maxEagerCombinations,
});

type MixerFunctionName = "mixer" | "mixerLazy";

interface PreparedMixer {
  defaultsKeys: string[];
  freeBooleanKeys: string[];
}

function prepareMixer(
  ref: PlainObject,
  defaultsObj: PlainObject,
  functionName: MixerFunctionName,
): PreparedMixer {
  if (!isObj(ref)) {
    throw new Error(
      `test-mixer/${functionName}(): [THROW_ID_01] the first input argument must be a plain object or undefined. It was given as:\n${formatDiagnosticValue(ref, 4)} (type ${typeof ref}).`,
    );
  }
  if (!isObj(defaultsObj)) {
    throw new Error(
      `test-mixer/${functionName}(): [THROW_ID_02] the second input argument must be a plain object or undefined. It was given as:\n${formatDiagnosticValue(defaultsObj, 4)} (type ${typeof defaultsObj}).`,
    );
  }
  let caught;
  if (
    Object.keys(ref)
      // If some unrecognised key is present in the first,
      // "ref" argument, that's OK as long as it's not boolean,
      // it will be copied over onto every variation.
      // We allow "ref" (1st arg) to have non-bool keys, which
      // are not present in defaults (2nd arg) because some
      // programs don't have defaults for every option because
      // those options are obligatory. For example, our
      // string-dashes or string-apostrophes export convertOne()
      // whose "from" option is obligatory (it instructs which
      // character to process, it takes its index position),
      // and defaults don't have this "from".
      .filter((refKey) => typeof ref[refKey] === "boolean")
      .some((refKey) => {
        if (!hasOwn.call(defaultsObj, refKey)) {
          caught = refKey;
          return true;
        }
        return false;
      })
  ) {
    throw new Error(
      `test-mixer/${functionName}(): [THROW_ID_03] the second input arg object should be defaults; it should be a superset of 1st input arg object. However, 1st input arg object contains key "${caught}" which 2nd input arg object doesn't have.`,
    );
  }

  const defaultsKeys = Object.keys(defaultsObj);
  return {
    defaultsKeys,
    freeBooleanKeys: defaultsKeys.filter(
      (key) => typeof defaultsObj[key] === "boolean" && !hasOwn.call(ref, key),
    ),
  };
}

function resolveMixerOptions(
  opts: Partial<MixerOptions> | boolean,
): MixerOptions {
  // Booleans were accepted and ignored by old JavaScript callers.
  if (typeof opts === "boolean") {
    return { ...defaults };
  }
  if (!isObj(opts)) {
    throw new Error(
      `test-mixer/mixer(): [THROW_ID_04] the third input argument must be a plain options object or undefined. It was given as:\n${formatDiagnosticValue(opts, 4)} (type ${typeof opts}).`,
    );
  }
  const resolved = { ...defaults, ...opts };
  if (
    !Number.isSafeInteger(resolved.maxCombinations) ||
    resolved.maxCombinations < 1 ||
    resolved.maxCombinations > maxEagerCombinations
  ) {
    throw new Error(
      `test-mixer/mixer(): [THROW_ID_05] opts.maxCombinations must be a positive integer no greater than ${maxEagerCombinations}. It was given as ${formatDiagnosticValue(resolved.maxCombinations)}.`,
    );
  }
  return resolved;
}

function assertWithinEagerLimit(
  freeBooleanKeyCount: number,
  maxCombinations: number,
): void {
  const plannedCount = 2 ** freeBooleanKeyCount;
  if (plannedCount > maxCombinations) {
    const plannedDescription = Number.isSafeInteger(plannedCount)
      ? `${plannedCount} rows (2^${freeBooleanKeyCount})`
      : `2^${freeBooleanKeyCount} rows`;
    throw new Error(
      `test-mixer/mixer(): [THROW_ID_06] ${freeBooleanKeyCount} unpinned boolean options would create ${plannedDescription}, above the configured maxCombinations of ${maxCombinations}. Pin more boolean keys, raise maxCombinations up to ${maxEagerCombinations}, or use mixerLazy().`,
    );
  }
}

function* generateRows(
  template: PlainObject,
  freeBooleanKeys: string[],
  hasDefaults: boolean,
): Generator<PlainObject, void, unknown> {
  if (!hasDefaults) {
    return;
  }

  const values = new Array(freeBooleanKeys.length).fill(false);
  let moreRows = true;
  while (moreRows) {
    const result = clone(template);
    for (let keyIndex = 0; keyIndex < freeBooleanKeys.length; keyIndex++) {
      result[freeBooleanKeys[keyIndex]] = values[keyIndex];
    }
    yield result;

    let keyIndex = 0;
    while (keyIndex < values.length && values[keyIndex]) {
      values[keyIndex] = false;
      keyIndex++;
    }
    if (keyIndex === values.length) {
      moreRows = false;
    } else {
      values[keyIndex] = true;
    }
  }
}

function mixer<Defaults extends PlainObject = Record<never, never>>(
  ref?: undefined,
  defaultsObj?: Defaults,
  opts?: Partial<MixerOptions>,
): BooleanValuesWidened<Defaults>[];
function mixer<
  Ref extends PlainObject,
  Defaults extends PlainObject = Record<never, never>,
>(
  ref: Ref,
  defaultsObj?: Defaults,
  opts?: Partial<MixerOptions>,
): MixerResult<Ref, Defaults>[];
function mixer<
  Ref extends PlainObject,
  Defaults extends PlainObject = Record<never, never>,
>(
  ref: Ref | undefined,
  defaultsObj?: Defaults,
  opts?: Partial<MixerOptions>,
): Array<MixerResult<Ref, Defaults> | BooleanValuesWidened<Defaults>>;
function mixer(
  ref: PlainObject = {},
  defaultsObj: PlainObject = {},
  opts: Partial<MixerOptions> | boolean = {},
): PlainObject[] {
  const prepared = prepareMixer(ref, defaultsObj, "mixer");
  const resolvedOpts = resolveMixerOptions(opts);

  // quick end
  if (!prepared.defaultsKeys.length) {
    DEV && console.log(`early return []`);
    return [];
  }

  assertWithinEagerLimit(
    prepared.freeBooleanKeys.length,
    resolvedOpts.maxCombinations,
  );

  let optsWithBoolValues: PlainObjectOfBool = {};

  // 1. find out, what boolean-value keys are there in defaultsObj that
  // are missing in ref. If there are n keys, we'll generate 2^n objects.
  prepared.freeBooleanKeys.forEach((key) => {
    optsWithBoolValues[key] = defaultsObj[key];
  });

  DEV && console.log(`${`\u001b[${33}m${`ref`}\u001b[${39}m`} =`, ref);
  DEV &&
    console.log(
      `${`\u001b[${33}m${`defaultsObj`}\u001b[${39}m`} =`,
      defaultsObj,
    );
  DEV &&
    console.log(
      `${`\u001b[${33}m${`optsWithBoolValues`}\u001b[${39}m`} =`,
      optsWithBoolValues,
    );

  // calculate combinations using combinations() - object-boolean-combinations
  // then restore the non-bool keys
  const booleanVariations = combinations(optsWithBoolValues);
  const firstResult = clone({
    ...defaultsObj,
    ...ref,
    ...booleanVariations[0],
  });
  const res = booleanVariations.map((variation, index) => {
    if (index === 0) {
      return firstResult;
    }
    const result = clone(firstResult);
    for (const key of Object.keys(variation)) {
      result[key] = variation[key];
    }
    return result;
  });

  DEV && console.log(`RETURN res =`, res);

  return res;
}

function mixerLazy<Defaults extends PlainObject = Record<never, never>>(
  ref?: undefined,
  defaultsObj?: Defaults,
): Generator<BooleanValuesWidened<Defaults>, void, unknown>;
function mixerLazy<
  Ref extends PlainObject,
  Defaults extends PlainObject = Record<never, never>,
>(
  ref: Ref,
  defaultsObj?: Defaults,
): Generator<MixerResult<Ref, Defaults>, void, unknown>;
function mixerLazy<
  Ref extends PlainObject,
  Defaults extends PlainObject = Record<never, never>,
>(
  ref: Ref | undefined,
  defaultsObj?: Defaults,
): Generator<
  MixerResult<Ref, Defaults> | BooleanValuesWidened<Defaults>,
  void,
  unknown
>;
/**
 * Lazily yields the same rows and ordering as `mixer()`. Stop iterating to
 * cancel the remaining work, or consume the iterator in caller-sized batches.
 */
function mixerLazy(
  ref: PlainObject = {},
  defaultsObj: PlainObject = {},
): Generator<PlainObject, void, unknown> {
  const prepared = prepareMixer(ref, defaultsObj, "mixerLazy");
  const template = clone({ ...defaultsObj, ...ref });
  return generateRows(
    template,
    prepared.freeBooleanKeys,
    prepared.defaultsKeys.length > 0,
  );
}

const hasOwn = Object.prototype.hasOwnProperty;

export { mixer, mixerLazy, version };
