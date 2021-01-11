import correctRowNum from "./rules/correct-row-num";

export default {
  configs: {
    recommended: {
      plugins: ["row-num"],
      rules: {
        "no-console": "off",
        "row-num/correct-row-num": "error",
      },
    },
  },
  rules: {
    "correct-row-num": correctRowNum,
  },
};
