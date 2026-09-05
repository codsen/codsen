import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pairedNpmCliCandidates } from "./nodeProcessInvocation.js";
import { validatePackedFiles } from "./npmPackagePayload.js";
import { createStagingPackage } from "./npmPackageStaging.js";

// Measure the release payload, including documentation and declarations, without
// installing dependencies or running lifecycle scripts. Both sizes exclude deps.
function npmPackageSizes(packages, repositoryRoot) {
  if (!packages.length) {
    return new Map();
  }
  const npmCli = pairedNpmCliCandidates(process.execPath).find((candidate) =>
    existsSync(candidate),
  );
  if (!npmCli) {
    throw new Error(`Could not find npm paired with ${process.execPath}`);
  }
  const temporaryRoot = mkdtempSync(
    path.join(tmpdir(), "codsen-package-sizes-"),
  );
  try {
    const stagedPackages = new Map(
      packages.map(({ directory, manifest }) => [
        manifest.name,
        {
          manifest,
          ...createStagingPackage(
            { name: manifest.name, directory },
            manifest,
            temporaryRoot,
            repositoryRoot,
          ),
        },
      ]),
    );
    const results = JSON.parse(
      execFileSync(
        process.execPath,
        [
          npmCli,
          "pack",
          ...[...stagedPackages.values()].map(
            ({ stagingDirectory }) => `./${path.basename(stagingDirectory)}`,
          ),
          "--dry-run",
          "--json",
          "--ignore-scripts",
          "--offline",
          "--workspaces=false",
          "--cache",
          path.join(temporaryRoot, "npm-cache"),
        ],
        {
          cwd: temporaryRoot,
          encoding: "utf8",
          maxBuffer: 50 * 1024 * 1024,
          stdio: ["ignore", "pipe", "pipe"],
        },
      ),
    );
    if (!Array.isArray(results) || results.length !== packages.length) {
      throw new Error("npm pack returned an unexpected package count");
    }
    const sizes = new Map();
    for (const packed of results) {
      const item = stagedPackages.get(packed.name);
      if (
        !item ||
        packed.version !== item.manifest.version ||
        sizes.has(packed.name)
      ) {
        throw new Error(
          `npm pack returned an unexpected package: ${packed.name}`,
        );
      }
      validatePackedFiles(
        { name: packed.name },
        item.manifest,
        packed,
        item.staged,
        item.targets,
        item.payload,
      );
      for (const field of ["size", "unpackedSize"]) {
        if (!Number.isSafeInteger(packed[field]) || packed[field] <= 0) {
          throw new Error(
            `npm pack returned an invalid ${field} for ${packed.name}`,
          );
        }
      }
      sizes.set(packed.name, {
        tarballSizeBytes: packed.size,
        unpackedSizeBytes: packed.unpackedSize,
      });
    }
    return sizes;
  } finally {
    rmSync(temporaryRoot, { recursive: true, force: true });
  }
}

export { npmPackageSizes };
