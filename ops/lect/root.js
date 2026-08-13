#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";

import writeFileAtomic from "write-file-atomic";

import { getLicenceContents } from "./common/getLicenceContents.js";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

await writeFileAtomic(
  path.join(repositoryRoot, "LICENSE"),
  getLicenceContents(new Date().getFullYear()),
);
