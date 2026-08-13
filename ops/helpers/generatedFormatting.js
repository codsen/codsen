import { spawnSync } from "node:child_process";
import path from "node:path";

function formatGeneratedContents({
  contents,
  filename,
  repositoryRoot,
  runProcess = spawnSync,
}) {
  const biomeCli = path.join(
    repositoryRoot,
    "node_modules/@biomejs/biome/bin/biome",
  );
  const result = runProcess(
    process.execPath,
    [biomeCli, "format", "--stdin-file-path", filename],
    {
      cwd: repositoryRoot,
      encoding: "utf8",
      input: contents,
      maxBuffer: 10 * 1024 * 1024,
    },
  );

  if (result.error) {
    throw new Error(`Could not format generated file ${filename}`, {
      cause: result.error,
    });
  }
  if (result.status !== 0 || typeof result.stdout !== "string") {
    const detail = String(
      result.stderr || "formatter returned no output",
    ).trim();
    throw new Error(
      `Could not format generated file ${filename}: ${detail || `exit ${result.status}`}`,
    );
  }
  return result.stdout;
}

export { formatGeneratedContents };
