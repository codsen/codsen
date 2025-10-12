import writeFileAtomic from "write-file-atomic";
import { getLicenceContents } from "../common/getLicenceContents.js";

// writes LICENCE file
async function licenceTheFile({ state }) {
  try {
    await writeFileAtomic("LICENSE", getLicenceContents(state.currentYear));
  } catch (err) {
    console.log(`lect: could not write LICENSE file - ${err}`);
    return Promise.reject(err);
  }
}

export default licenceTheFile;
