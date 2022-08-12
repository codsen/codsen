import { isJinjaNunjucksRegex } from "regex-is-jinja-nunjucks";
import { isJSP } from "regex-is-jsp";
import { isJinjaSpecific } from "regex-jinja-specific";

import { version as v } from "../package.json";

const version: string = v;

export type Output = "Nunjucks" | "Jinja" | "JSP" | null;

function detectLang(str: string): { name: Output } {
  let name: Output = null;

  if (typeof str !== "string") {
    throw new TypeError(
      `detect-templating-language: [THROW_ID_01] Input must be string! It was given as ${JSON.stringify(
        str,
        null,
        4
      )} (type ${typeof str}).`
    );
  }

  if (!str) {
    // early ending on empty string
    return {
      name,
    };
  }

  // real action starts
  // ---------------------------------------------------------------------------

  if (isJinjaNunjucksRegex().test(str)) {
    name = "Nunjucks";
    if (isJinjaSpecific().test(str)) {
      name = "Jinja";
    }
  } else if (isJSP().test(str)) {
    name = "JSP";
  }

  return {
    name,
  };
}

export { detectLang, version };
