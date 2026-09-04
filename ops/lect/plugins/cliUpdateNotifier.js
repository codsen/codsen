import { promises as fs } from "node:fs";
import path from "node:path";

import {
  deleteGeneratedFile,
  writeGeneratedFile,
} from "../../helpers/generatedFiles.js";
import { PACKAGE_KINDS } from "../../helpers/packageKinds.js";

const SOURCE_FILENAME = "ops/lect/common/cliUpdateNotifier.js";
const OUTPUT_FILENAME = "cli-update-notifier.js";

async function cliUpdateNotifier({ mode, state }) {
  const filename = path.join(state.root, OUTPUT_FILENAME);
  if (state.packageKind !== PACKAGE_KINDS.CLI) {
    await deleteGeneratedFile({
      filename,
      fixCommand: "npm run lect",
      mode,
    });
    return null;
  }

  const contents = await fs.readFile(
    path.join(state.repositoryRoot, SOURCE_FILENAME),
    "utf8",
  );
  await writeGeneratedFile({
    contents,
    filename,
    fixCommand: "npm run lect",
    mode,
  });
  return null;
}

export default cliUpdateNotifier;
