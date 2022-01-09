const StyleDictionary = require("style-dictionary");

const { formattedVariables } = StyleDictionary.formatHelpers;

function removeCSSCommentBlocks(str) {
  return str.replace(/\/\*[^*]*\*\//g, "");
}

function trimLines(str, { indent } = 0) {
  return (
    "\n" +
    str
      .trim()
      .split(/(\r?\n)/)
      .map((s) => removeCSSCommentBlocks(s).trim())
      .filter(Boolean)
      .map((s) => (indent ? " ".repeat(indent) + s : s))
      .join("\n")
  );
}

// custom format
// -----------------------------------------------------------------------------

StyleDictionary.registerFormat({
  name: "json/flat",
  formatter(dictionary) {
    return JSON.stringify(dictionary.allProperties, null, 2);
  },
});

// adapted "css/variables" from
// https://github.com/amzn/style-dictionary/blob/main/lib/common/formats.js
StyleDictionary.registerFormat({
  name: "css/variables-only",
  formatter({ dictionary, options = {} }) {
    let { outputReferences, indent } = options;
    return `${trimLines(
      formattedVariables({ format: "css", dictionary, outputReferences }),
      { indent }
    )}\n`;
  },
});

// custom transforms
// -----------------------------------------------------------------------------

StyleDictionary.registerTransform({
  name: "size/pxToPt",
  type: "value",
  matcher(prop) {
    return prop.value.match(/^[\d.]+px$/);
  },
  transformer(prop) {
    return prop.value.replace(/px$/, "pt");
  },
});
