import correctTestNum from "./rules/correct-test-num";

export default {
  configs: {
    recommended: {
      plugins: ["test-num"],
      rules: {
        "no-console": "off",
        "test-num/correct-test-num": "error",
      },
    },
  },
  rules: {
    "correct-test-num": correctTestNum,
  },
};
