const browserSupport = {
  browsers: [
    "Android >= 4.4",
    "Edge >= 15",
    "ie 11",
    "iOS >= 10",
    "last 2 ChromeAndroid versions",
    "last 2 Firefox versions",
    "last 2 FirefoxAndroid versions",
    "last 2 Opera versions",
    "Safari >= 9",
    "last 2 Chrome versions",
  ],
};

module.exports = function babelConfig(api) {
  api.cache(true);

  const presets = [
    [
      "@babel/preset-env",
      {
        corejs: 3,
        targets: browserSupport,
        useBuiltIns: "entry",
      },
    ],
  ];

  const plugins = [
    "@babel/plugin-proposal-nullish-coalescing-operator",
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-class-properties",
  ];

  return {
    presets,
    plugins,
  };
};
