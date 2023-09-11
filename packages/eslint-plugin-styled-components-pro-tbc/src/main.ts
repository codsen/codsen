import { parsesOk } from "./parses-ok";

const plugin: any = {
  configs: {
    recommended: {
      plugins: ["styled-components-pro"],
      rules: {
        "styled-components-pro/parses-ok": "error",
      },
    },
  },
  rules: {
    "parses-ok": parsesOk,
  },
};

export default plugin;
