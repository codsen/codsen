import isJinjaNunjucksRegex from "regex-is-jinja-nunjucks";
import isJSP from "regex-is-jsp";

function detectLang(str) {
  let name = null;

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
  } else if (isJSP().test(str)) {
    name = "JSP";
  }

  return {
    name,
  };
}

export default detectLang;
