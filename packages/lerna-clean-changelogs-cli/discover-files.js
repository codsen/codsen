import path from "node:path";
import { glob } from "codsen-glob";
import pReduce from "p-reduce";

export async function discoverFiles(input, { findFiles = glob } = {}) {
  if (Array.isArray(input) && input.length) {
    const paths = await pReduce(
      input,
      async (total, current) => {
        const matches = await findFiles([current, "!**/node_modules/**"]);
        if (matches) {
          return total.concat(
            matches.filter((filename) => !total.includes(filename)),
          );
        }
        return total;
      },
      [],
    );
    return paths.filter(
      (filename) => path.basename(filename).toLowerCase() === "changelog.md",
    );
  }
  return findFiles(["**/changelog.md", "!**/node_modules/**"], {
    caseSensitiveMatch: false,
  });
}
