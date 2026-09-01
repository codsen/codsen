declare const version: string;
/**
 * Check whether a supported value is shallowly non-empty.
 *
 * Strings and native arrays use their outer `length`; sparse array slots count
 * and array expando properties do not. Plain records use own enumerable string
 * keys without reading their values. Every number is non-empty. All other
 * values, including boxed primitives, collections, class instances, symbols,
 * bigints, Booleans, functions, and nullish values, are empty.
 */
declare function nonEmpty(input?: unknown): boolean;

export { nonEmpty, version };
