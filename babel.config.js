const { NODE_ENV } = process.env;

module.exports = {
  presets: [
    "@babel/typescript",
    [
      "@babel/env",
      {
        targets: {
          browsers: ["ie >= 11"],
        },
        exclude: ["transform-async-to-generator", "transform-regenerator"],
        modules: false,
        loose: true,
      },
    ],
  ],
  plugins: [
    "@babel/plugin-proposal-nullish-coalescing-operator",
    "@babel/plugin-proposal-object-rest-spread",
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-class-properties",
    NODE_ENV === "test" && "@babel/transform-modules-commonjs",
  ].filter(Boolean),
};
