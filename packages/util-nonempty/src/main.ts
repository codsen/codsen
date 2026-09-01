import { version as v } from "../package.json";

const version: string = v;
const functionToString = Function.prototype.toString;
const objectConstructorSource = functionToString.call(Object);

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype === null || prototype === Object.prototype) {
    return true;
  }
  const constructorDescriptor = Object.getOwnPropertyDescriptor(
    prototype,
    "constructor",
  );
  if (
    !constructorDescriptor ||
    !("value" in constructorDescriptor) ||
    typeof constructorDescriptor.value !== "function"
  ) {
    return false;
  }
  const constructorPrototypeDescriptor = Object.getOwnPropertyDescriptor(
    constructorDescriptor.value,
    "prototype",
  );
  return (
    constructorPrototypeDescriptor?.value === prototype &&
    functionToString.call(constructorDescriptor.value) ===
      objectConstructorSource
  );
}

/**
 * Check whether a supported value is shallowly non-empty.
 *
 * Strings and native arrays use their outer `length`; sparse array slots count
 * and array expando properties do not. Plain records use own enumerable string
 * keys without reading their values. Every number is non-empty. All other
 * values, including boxed primitives, collections, class instances, symbols,
 * bigints, Booleans, functions, and nullish values, are empty.
 */
function nonEmpty(input?: unknown): boolean {
  // "==" catches undefined and null
  if (input == null) {
    return false;
  }
  if (Array.isArray(input) || typeof input === "string") {
    return !!input.length;
  }
  if (isPlainRecord(input)) {
    return !!Object.keys(input).length;
  }
  return typeof input === "number";
}

export { nonEmpty, version };
