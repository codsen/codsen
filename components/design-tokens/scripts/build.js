require("./extensions");
const StyleDictionary = require("style-dictionary");
const changeCase = require("change-case");

const namespace = "c";
const brands = [
  "global",
  "codsen-light",
  "codsen-dark",
  "detergent-light",
  "detergent-dark",
];
const platforms = [
  "web/js",
  "web/json",
  "web/css",
  // "web/scss",
  // "styleguide",
  // "ios",
  // "android",
];

function getStyleDictionaryConfig(brand, platform) {
  return {
    include: [
      // Don't include global, because we assume "global.css" will be
      // accompanying any other stylesheets exported from here.
      // To include, un-comment the following:
      // "./src/global/**/*.json",
      `./src/global/*/${platform}/*.json`,
    ],
    source: [
      ...(brand !== "global"
        ? ["./src/global/**/*.json", `./src/${brand}/*/*.json`]
        : [`./src/${brand}/*/*.json`]),
      `./src/${brand}/*/${platform}/*.json`,
    ],
    platforms: {
      "web/js": {
        transformGroup: "js",
        buildPath: `dist/${brand}/js/`,
        prefix: namespace,
        files: [
          {
            destination: "index.js",
            format: "javascript/module",
          },
          {
            destination: `json/color/index.json`,
            format: "json/nested",
            mapName: `${namespace}-${brand}`,
            filter: {
              attributes: {
                category: "color",
              },
            },
          },
          {
            destination: `json/modifier/index.json`,
            format: "json/nested",
            mapName: `${namespace}-${brand}`,
            filter: {
              attributes: {
                category: "modifier",
              },
            },
          },
          {
            destination: `json/spacing/index.json`,
            format: "json/nested",
            mapName: `${namespace}-${brand}`,
            filter: {
              attributes: {
                category: "space",
              },
            },
          },
          {
            destination: `json/typography/index.json`,
            format: "json/nested",
            mapName: `${namespace}-${brand}`,
            filter: {
              attributes: {
                category: "typography",
              },
            },
          },
        ],
      },
      "web/json": {
        transformGroup: "js",
        buildPath: `dist/${brand}/json/`,
        prefix: namespace,
        files: [
          ...[
            brand === "global"
              ? {
                  destination: "tokens.json",
                  format: "json/flat",
                }
              : undefined,
          ],
        ],
      },
      "web/scss": {
        theme: brand,
        transformGroup: "scss",
        buildPath: `dist/${brand}/`,
        prefix: namespace,
        files: [
          {
            destination: "scss/theme.scss",
            format: "scss/map-deep",
            mapName: `${namespace}-${brand}`,
          },
        ],
      },
      "web/css": {
        theme: brand,
        transformGroup: "css",
        buildPath: `dist/${brand}/`,
        prefix: namespace,
        files: [
          ...[
            brand === "global"
              ? {
                  destination: "css/variables/other.css",
                  format: "css/variables",
                  filter: (token) =>
                    !token.attributes.category.match(
                      /^(color|font-stack|mode|modifier|space|size|surface|typography)$/
                    ),
                }
              : undefined,
          ],
          ...[
            brand !== "global"
              ? {
                  destination: "css/variables/color-semantic-rows.css",
                  format: "css/variables-only",
                  options: {
                    indent: 4, // make the indentation match
                  },
                  filter: (token) =>
                    token.attributes.category === "color" &&
                    token.attributes.type === "semantic",
                }
              : undefined,
          ],
          {
            destination: `css/variables/color-${
              brand === "global" ? "constants" : "semantic"
            }.css`,
            format: "css/variables",
            filter: (token) =>
              token.attributes.category === "color" &&
              ((brand === "global" && token.attributes.type !== "semantic") ||
                (brand !== "global" && token.attributes.type === "semantic")),
          },
          {
            destination: `css/variables/size-${
              brand === "global" ? "constants" : "semantic"
            }.css`,
            format: "css/variables",
            filter: (token) =>
              token.attributes.category === "size" &&
              ((brand === "global" && token.attributes.type !== "semantic") ||
                (brand !== "global" && token.attributes.type === "semantic")),
          },
          // TODO: mode, modifier, space, surface
        ],
      },
      styleguide: {
        transformGroup: "web",
        buildPath: `dist/styleguide/`,
        prefix: namespace,
        files: [
          {
            destination: `${platform}_${brand}.json`,
            format: "json/flat",
          },
          {
            destination: `${platform}_${brand}.scss`,
            format: "scss/variables",
          },
        ],
      },
      ios: {
        transformGroup: "ios-swift",
        buildPath: `dist/${brand}/ios/`,
        files: [
          {
            destination: `colors/${changeCase.pascalCase(brand)}Colors.swift`,
            format: "ios-swift/class.swift",
            className: `${changeCase.pascalCase(
              namespace
            )}${changeCase.pascalCase(brand)}Colors`,
          },
        ],
      },
      android: {
        transformGroup: "android",
        buildPath: `dist/${brand}/android/`,
        files: [
          {
            destination: `colors/${changeCase.pascalCase(brand)}Colors.xml`,
            format: "android/colors",
            className: `${changeCase.pascalCase(
              namespace
            )}${changeCase.pascalCase(brand)}Colors`,
            filter: {
              attributes: {
                category: "color",
              },
            },
          },
        ],
      },
    },
  };
}

brands.forEach((brand) => {
  platforms.forEach((platform) => {
    StyleDictionary.extend(
      getStyleDictionaryConfig(brand, platform)
    ).buildPlatform(platform);
  });
});
