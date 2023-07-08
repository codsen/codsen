import { deleteKey } from "object-delete-key";
import semverRegex from "semver-regex";

export interface Obj {
  [key: string]: any;
}

/**
 * Deletes the "position" keys from AST for cleaner logs
 * @param obj
 * @returns stringified obj
 */
export const stringify = (obj: Obj) => {
  return JSON.stringify(
    deleteKey(obj, {
      key: "position",
    }),
    null,
    4,
  );
};

/**
 * Extracts "3.1.0" from:
 * "# 3.1.0 (2022-08-12)"
 * or
 * "# [3.1.0](https://github.com/...) (2022-08-12)"
 * @param str
 * @returns string
 */
export const extractStartingVersionString = (str: unknown) => {
  if (typeof str !== "string") {
    return "";
  }
  let res = semverRegex().exec(str);
  return res ? res[0] : "";
};

/**
 * Extracts "2022-08-12" from:
 * "# 3.1.0 (2022-08-12)"
 * or
 * "# [3.1.0](https://github.com/...) (2022-08-12)"
 * @param str
 * @returns string
 */
export const extractDateString = (str: unknown) => {
  if (typeof str !== "string") {
    return "";
  }
  let res = str.match(/\((\d\d\d\d-\d\d-\d\d)\)$/);
  return res?.length ? res[0].slice(1, -1) : "";
};
