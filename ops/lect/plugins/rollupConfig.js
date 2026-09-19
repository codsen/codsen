import path from "node:path";
import objectPath from "object-path";
import { writeGeneratedFile } from "../../helpers/generatedFiles.js";
import { libraryEntries } from "../../helpers/packageEntries.js";
import { PACKAGE_KINDS } from "../../helpers/packageKinds.js";

// writes rollup.config.js
async function rollupConfig({ mode, state }) {
  // Only declared TypeScript libraries own this generated file.
  if (state.packageKind !== PACKAGE_KINDS.TYPESCRIPT_LIBRARY) {
    return Promise.resolve(null);
  }

  if (objectPath.has(state.pack, "exports")) {
    try {
      await writeGeneratedFile({
        contents:
          libraryEntries(state.pack).length > 1
            ? `import { readFileSync } from "node:fs";

import { declarationEntries } from "../../ops/helpers/declarationEntries.js";

export default () =>
  declarationEntries(
    JSON.parse(
      readFileSync(new URL("./package.json", import.meta.url), "utf8"),
    ),
  );
`
            : `import json from "@rollup/plugin-json";
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
        filename: path.join(state.root, "rollup.config.js"),
        fixCommand: "npm run lect",
        mode,
      });
      return Promise.resolve(null);
    } catch (err) {
      console.log(`lect: could not write rollup.config.js - ${err}`);
      return Promise.reject(err);
    }
  }
}

export default rollupConfig;
