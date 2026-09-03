import { readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { test } from "uvu";
import { not, ok } from "uvu/assert";

import { extract } from "../dist/tsd-extract.esm.js";

const repositoryRoot = fileURLToPath(new URL("../../../", import.meta.url));

function findDeclarationFiles(directory, visitedDirectories = new Set()) {
  let declarationFiles = [];
  const realDirectory = realpathSync(directory);

  if (visitedDirectories.has(realDirectory)) {
    return declarationFiles;
  }
  visitedDirectories.add(realDirectory);

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === "node_modules") {
      continue;
    }

    const absolutePath = path.join(directory, entry.name);
    const entryType = entry.isSymbolicLink() ? statSync(absolutePath) : entry;

    if (entryType.isDirectory()) {
      declarationFiles.push(
        ...findDeclarationFiles(absolutePath, visitedDirectories),
      );
    } else if (entryType.isFile() && entry.name.endsWith(".d.ts")) {
      declarationFiles.push(absolutePath);
    }
  }

  return declarationFiles;
}

test("01 - every declaration file in the repository can be processed", () => {
  const declarationFiles = findDeclarationFiles(repositoryRoot).sort();

  ok(declarationFiles.length > 0, "01.01");

  for (const [index, declarationFile] of declarationFiles.entries()) {
    const relativePath = path.relative(repositoryRoot, declarationFile);
    const assertionNumber = String(index + 2).padStart(2, "0");
    const source = readFileSync(declarationFile, "utf8");

    not.throws(
      () => extract(source, "", { extractAll: true }),
      `01.${assertionNumber} - ${relativePath}`,
    );
  }
});

test.run();
