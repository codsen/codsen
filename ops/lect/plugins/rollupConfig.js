import objectPath from "object-path";
import writeFileAtomic from "write-file-atomic";
import { PACKAGE_KINDS } from "../../helpers/packageKinds.js";

// writes rollup.config.js
async function rollupConfig({ state }) {
  // Only declared TypeScript libraries own this generated file.
  if (state.packageKind !== PACKAGE_KINDS.TYPESCRIPT_LIBRARY) {
    return Promise.resolve(null);
  }

  if (objectPath.has(state.pack, "exports")) {
    try {
      await writeFileAtomic(
        "rollup.config.js",
        `import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";

export default () => [
  // Type definitions
  {
    input: "src/main.ts",
    output: [{ file: "types/index.d.ts", format: "es" }],
    plugins: [json(), dts()],
  },
];
`,
      );
      return Promise.resolve(null);
    } catch (err) {
      console.log(`lect: could not write rollup.config.js - ${err}`);
      return Promise.reject(err);
    }
  }
}

export default rollupConfig;
