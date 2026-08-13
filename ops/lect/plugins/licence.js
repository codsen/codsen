import path from "node:path";
import { writeGeneratedFile } from "../../helpers/generatedFiles.js";
import { getLicenceContents } from "../common/getLicenceContents.js";

// writes LICENCE file
async function licenceTheFile({ mode, state }) {
  try {
    await writeGeneratedFile({
      contents: getLicenceContents(state.currentYear),
      filename: path.join(state.root, "LICENSE"),
      fixCommand: "npm run lect",
      mode,
    });
  } catch (err) {
    console.log(`lect: could not write LICENSE file - ${err}`);
    return Promise.reject(err);
  }
}

export default licenceTheFile;
