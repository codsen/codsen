import path from "node:path";
import { glob } from "codsen-glob";

export async function discoverFiles(input, { findFiles = glob } = {}) {
  if (Array.isArray(input) && input.length) {
    let paths = [];
    for (const current of input) {
      const matches = await findFiles([current, "!**/node_modules/**"]);
      if (matches) {
        paths = paths.concat(
          matches.filter((filename) => !paths.includes(filename)),
        );
      }
    }
    return paths.filter(
      (filename) => path.basename(filename).toLowerCase() === "changelog.md",
    );
  }
  return findFiles(["**/changelog.md", "!**/node_modules/**"], {
    caseSensitiveMatch: false,
  });
}
