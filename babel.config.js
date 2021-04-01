module.exports = {
  presets: [
    "@babel/typescript",
    [
      "@babel/env",
      {
        useBuiltIns: "entry",
        corejs: "3.10",
      },
    ],
  ],
};
