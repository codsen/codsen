import path from "node:path";
import objectPath from "object-path";
import {
  deleteGeneratedFile,
  GENERATION_MODES,
} from "../../helpers/generatedFiles.js";

// delete all requested files
// key files.delete from packages/ root .lectrc.json
async function hardDelete({ lectrc, mode, root = process.cwd() }) {
  const effectiveMode = mode ?? GENERATION_MODES.WRITE;
  const thingsToDelete = [
    ...(objectPath.get(lectrc, "files.delete") || []),
    ...(effectiveMode === GENERATION_MODES.WRITE
      ? objectPath.get(lectrc, "files.cleanup_only") || []
      : []),
  ].filter((val) => {
    return val && val.trim() !== "";
  });
  // if to-do list is empty, bail early:
  if (!thingsToDelete?.length) {
    return Promise.resolve(null);
  }
  for (const fileName of thingsToDelete) {
    const deleted = await deleteGeneratedFile({
      filename: path.resolve(root, fileName),
      fixCommand: "npm run lect",
      mode: effectiveMode,
    });
    if (deleted) {
      console.log(
        `lect ${fileName} ${`\u001b[${31}m${"DELETED"}\u001b[${39}m`}`,
      );
    }
  }
  return null;
}

export default hardDelete;
