#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";

import { writeGeneratedFile } from "../helpers/generatedFiles.js";
import { getLicenceContents } from "./common/getLicenceContents.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

const arguments_ = process.argv.slice(2);
if (arguments_.some((argument) => argument !== "--check")) {
  throw new Error(`Unsupported argument(s): ${arguments_.join(", ")}`);
}

await writeGeneratedFile({
  contents: getLicenceContents(new Date().getFullYear()),
  filename: path.join(repositoryRoot, "LICENSE"),
  fixCommand: "npm run lect",
  mode: arguments_.includes("--check") ? "check" : "write",
});
