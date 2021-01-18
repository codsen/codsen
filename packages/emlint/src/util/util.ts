import { RulesObj, Severity } from "./commonTypes";
import splitByWhitespace from "./splitByWhitespace";

// validation functions
import validateString from "./validateString";

const wholeExtensionRegex = /^\.\w+$/g;

// Regex is not so strict, to cover variations without miliseconds.
// Also, we don't use capturing groups because we don't extract, only validate.
// 2019-07-09T15:03:36Z (https://www.npmjs.com/package/iso-datestring-validator)
// 2011-10-05T14:48:00.000Z (https://www.npmjs.com/package/regex-iso-date)
const isoDateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z/g;
const fontSizeRegex = /^[+-]?[1-7]$/;
const linkTypes = [
  "apple-touch-icon",
  "apple-touch-startup-image",
  "alternate",
  "archives",
  "appendix",
  "author",
  "bookmark",
  "canonical",
  "chapter",
  "contents",
  "copyright",
  "dns-prefetch",
  "external",
  "first",
  "glossary",
  "help",
  "icon",
  "import",
  "index",
  "last",
  "license",
  "manifest",
  "modulepreload",
  "next",
  "nofollow",
  "noopener",
  "noreferrer",
  "opener",
  "pingback",
  "preconnect",
  "prefetch",
  "preload",
  "prerender",
  "prev",
  "search",
  "shortlink",
  "section",
  "sidebar",
  "start",
  "stylesheet",
  "subsection",
  "tag",
  "up",
];

const astErrMessages = {
  "tag-missing-opening": "Opening tag is missing.",
  "tag-missing-closing": "Closing tag is missing.",
  "tag-void-frontal-slash": "Remove frontal slash.",
};

// -----------------------------------------------------------------------------

function isLetter(str: unknown): boolean {
  return (
    typeof str === "string" &&
    str.length === 1 &&
    str.toUpperCase() !== str.toLowerCase()
  );
}

function isAnEnabledValue(maybeARulesValue: unknown): Severity {
  if (
    Number.isInteger(maybeARulesValue) &&
    (maybeARulesValue as Severity) > 0
  ) {
    return maybeARulesValue as Severity;
  }
  if (
    Array.isArray(maybeARulesValue) &&
    maybeARulesValue.length &&
    Number.isInteger(maybeARulesValue[0]) &&
    maybeARulesValue[0] > 0
  ) {
    return maybeARulesValue[0];
  }
  return 0;
}

function isObj(something: unknown): boolean {
  return !!(
    something &&
    typeof something === "object" &&
    !Array.isArray(something)
  );
}

function isAnEnabledRule(rules: RulesObj, ruleId: string): Severity {
  if (!ruleId) {
    console.log(
      `102 ${`\u001b[${35}m${`isAnEnabledRule():`}\u001b[${39}m`} return 0 - ruleId is falsy`
    );
    return 0;
  }
  console.log(
    `097 ${`\u001b[${35}m${`isAnEnabledRule():`}\u001b[${39}m`} called with ${`\u001b[${33}m${`rules`}\u001b[${39}m`} = ${JSON.stringify(
      rules,
      null,
      4
    )}`
  );
  console.log(
    `104 ${`\u001b[${35}m${`isAnEnabledRule():`}\u001b[${39}m`} called with ${`\u001b[${33}m${`ruleId`}\u001b[${39}m`} = ${JSON.stringify(
      ruleId,
      null,
      4
    )}`
  );

  if (isObj(rules) && Object.prototype.hasOwnProperty.call(rules, ruleId)) {
    console.log(`112 RETURN ${rules[ruleId]}`);
    return rules[ruleId] as any;
  }
  if (
    ruleId.includes("-") &&
    Object.prototype.hasOwnProperty.call(rules, ruleId.split("-")[0])
  ) {
    return rules[ruleId.split("-")[0]] as any;
  }
  if (isObj(rules) && Object.prototype.hasOwnProperty.call(rules, "all")) {
    console.log(`122 RETURN ${rules.all}`);
    return rules.all as any;
  }

  // default return - rule's off:
  return 0;

  // Object.keys(rules.rules).some(
  //   ruleName =>
  //     (ruleName === "all" || // group blanket setting
  //     ruleName === "tag" || // group blanket setting
  //       ruleName.startsWith(obj.ruleId)) &&
  //     (isAnEnabledValue(rules.rules[ruleName]) ||
  //       isAnEnabledValue(processedRulesConfig[ruleName]))
  // )
}

// -----------------------------------------------------------------------------

export {
  wholeExtensionRegex,
  splitByWhitespace,
  isAnEnabledValue,
  isAnEnabledRule,
  astErrMessages,
  validateString,
  fontSizeRegex,
  isoDateRegex,
  linkTypes,
  isLetter,
  isObj,
};
