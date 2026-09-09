import { readFileSync } from "node:fs";
import path from "node:path";

import { createCodsenPackageLists } from "./codsenPackages.js";
import { assertDay, packageFile } from "./npmDownloads.js";
import { readWorkspaceRecords } from "./workspaceInventoryFile.js";

const STATUSES = new Set(["current", "deprecated", "archived", "auxiliary"]);

function assertObject(value, context) {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    ![Object.prototype, null].includes(Object.getPrototypeOf(value))
  ) {
    throw new TypeError(`${context} must be a plain object`);
  }
}

function readFirstPublishedDays(repositoryRoot) {
  const filename = path.join(
    repositoryRoot,
    "data/sources/firstPublishedAt.ts",
  );
  const source = readFileSync(filename, "utf8");
  const declaration =
    /^export const firstPublishedAt(?:\s*:\s*[^=]+)?\s*=/m.exec(source);
  if (!declaration) {
    throw new Error(`${filename} has no firstPublishedAt export`);
  }
  // This generated export contains a JSON payload. Parse it as data so a
  // refresh needs neither a package build nor execution of the source module.
  let timestamps;
  try {
    timestamps = JSON.parse(
      source
        .slice(declaration.index + declaration[0].length)
        .trim()
        .replace(/;$/, ""),
    );
  } catch (error) {
    throw new Error(
      `${filename} has an invalid JSON firstPublishedAt payload`,
      {
        cause: error,
      },
    );
  }
  assertObject(timestamps, `${filename} firstPublishedAt`);
  return new Map(
    Object.entries(timestamps).map(([name, timestamp]) => {
      packageFile(name);
      if (timestamp === null) {
        return [name, null];
      }
      if (
        !Number.isSafeInteger(timestamp) ||
        timestamp <= 0 ||
        !Number.isFinite(new Date(timestamp).getTime())
      ) {
        throw new Error(`Invalid first-publication timestamp for ${name}`);
      }
      const day = new Date(timestamp).toISOString().slice(0, 10);
      assertDay(day);
      return [name, day];
    }),
  );
}

function validatePreviousPackages(previousPackages) {
  assertObject(previousPackages, "Previous npm downloads packages");
  for (const [name, metadata] of Object.entries(previousPackages)) {
    packageFile(name);
    assertObject(metadata, `Previous npm downloads metadata for ${name}`);
    if (
      !STATUSES.has(metadata.status) ||
      typeof metadata.includedInPortfolio !== "boolean" ||
      !Object.hasOwn(metadata, "firstPublishedDay")
    ) {
      throw new TypeError(
        `Invalid previous npm downloads metadata for ${name}`,
      );
    }
    if (metadata.firstPublishedDay !== null) {
      assertDay(metadata.firstPublishedDay);
    }
  }
}

function readNpmDownloadsRoster(repositoryRoot, previousPackages = {}) {
  validatePreviousPackages(previousPackages);
  const firstPublishedDays = readFirstPublishedDays(repositoryRoot);
  const { all } = createCodsenPackageLists(
    readWorkspaceRecords(repositoryRoot)
      .filter(({ manifest }) => !manifest.private)
      .map(({ manifest }) => manifest.name),
  );

  return Object.fromEntries(
    all.map((name) => {
      packageFile(name);
      const previous = Object.hasOwn(previousPackages, name)
        ? previousPackages[name]
        : null;
      const sourceDay = firstPublishedDays.get(name) ?? null;
      const previousDay = previous?.firstPublishedDay ?? null;
      const firstPublishedDay =
        sourceDay === null
          ? previousDay
          : previousDay === null || sourceDay < previousDay
            ? sourceDay
            : previousDay;
      return [
        name,
        {
          status: "current",
          includedInPortfolio: true,
          firstPublishedDay,
        },
      ];
    }),
  );
}

export { readNpmDownloadsRoster };
