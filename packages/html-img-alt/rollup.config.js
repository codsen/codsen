import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";

export default () => [
  // Type definitions
  {
    input: "src/main.ts",
    output: [{ file: "types/index.d.ts", format: "es" }],
    plugins: [json(), dts()],
  },
];
