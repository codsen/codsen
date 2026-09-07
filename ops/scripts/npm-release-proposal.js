#!/usr/bin/env node

import { lstatSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import {
  applyReleaseProposal,
  createReleaseProposal,
  MAX_PROPOSAL_BYTES,
} from "../helpers/npmReleaseProposal.js";

function main() {
  const [command, ...arguments_] = process.argv.slice(2);
  const fileOption = command === "create" ? "output" : "input";
  if (!["create", "apply"].includes(command)) {
    throw new Error(
      "Usage: npm-release-proposal.js create --base <sha> --output <file> | apply --base <sha> --input <file>",
    );
  }
  const options = {};
  for (let index = 0; index < arguments_.length; index += 2) {
    const key = arguments_[index].slice(2);
    const value = arguments_[index + 1];
    if (
      !arguments_[index].startsWith("--") ||
      !["base", fileOption].includes(key) ||
      !value ||
      Object.hasOwn(options, key)
    ) {
      throw new Error(`Invalid or duplicate option: ${arguments_[index]}`);
    }
    options[key] = value;
  }
  if (!options.base || !options[fileOption]) {
    throw new Error(`Both --base and --${fileOption} are required`);
  }
  const repositoryRoot = process.cwd();
  const filename = path.resolve(options[fileOption]);
  if (
    filename === repositoryRoot ||
    filename.startsWith(`${repositoryRoot}${path.sep}`)
  ) {
    throw new Error(
      "Keep the proposal artifact outside the repository checkout",
    );
  }
  if (command === "create") {
    const proposal = createReleaseProposal({
      repositoryRoot,
      baseSha: options.base,
    });
    const contents = `${JSON.stringify(proposal)}\n`;
    if (Buffer.byteLength(contents) > MAX_PROPOSAL_BYTES) {
      throw new Error(`Proposal exceeds ${MAX_PROPOSAL_BYTES} bytes`);
    }
    mkdirSync(path.dirname(filename), { recursive: true });
    writeFileSync(filename, contents, { flag: "wx", mode: 0o600 });
    console.log(
      `Exported ${proposal.changes.length} validated release changes.`,
    );
  } else {
    const stat = lstatSync(filename);
    if (!stat.isFile() || stat.size > MAX_PROPOSAL_BYTES) {
      throw new Error(
        `Proposal must be a regular file no larger than ${MAX_PROPOSAL_BYTES} bytes`,
      );
    }
    const proposal = JSON.parse(readFileSync(filename, "utf8"));
    const count = applyReleaseProposal({
      repositoryRoot,
      baseSha: options.base,
      proposal,
    });
    console.log(`Applied and staged ${count} validated release changes.`);
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
