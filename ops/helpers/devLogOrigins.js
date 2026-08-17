import { readFile } from "node:fs/promises";
import path from "node:path";

import ts from "typescript";

import {
  isConsoleLogCall,
  isDevGuarded,
  locationAt,
  parseSourceFile,
} from "./devGuardedSource.js";

// Bundling erases the file a debug log came from: a package's main.ts and
// util.ts land in one dist file. This prepends the origin, so a message read
// from a bundle points back at the source that emitted it. Messages used to
// carry a hand-written line number instead, which every edit above a log
// invalidated; a number the build derives cannot go stale.
//
// Only DEV-guarded calls are rewritten. An unguarded console.log is program
// output rather than a debug message - codsen-utils prints its --help and
// --version that way - and an origin in front of that would corrupt what the
// user of a CLI sees. CLI packages themselves never reach here: they ship the
// JavaScript they are written in and have no esbuild step at all.
//
// The origin is inserted as an extra leading argument instead of being
// concatenated into the message. console.log joins arguments with one space,
// which is the separator wanted anyway, and an argument left in place keeps
// being inspected as itself - concatenation would flatten an object to
// "[object Object]".
//
// The line is taken from the first argument rather than from the call, so a
// log written across several lines reports the line its message starts on and
// not that of the `console.log` or the `DEV &&` above it - the message is what
// the reader is looking at when they go hunting for its source.

const LOADER_BY_EXTENSION = new Map([
  [".cts", "ts"],
  [".mts", "ts"],
  [".ts", "ts"],
  [".tsx", "tsx"],
]);

function toPosixPath(value) {
  return value.split(path.sep).join("/");
}

// Insertions are collected in source order, so applying them in reverse keeps
// every remaining position valid against the text still to be edited. Each one
// sits inside its own line, which leaves every line number the parse reported
// pointing at the same code once the rewrite is done.
function prefixDevLogOrigins(sourceText, origin, filePath = origin) {
  if (!sourceText.includes("console")) {
    return sourceText;
  }

  const sourceFile = parseSourceFile(sourceText, filePath);
  if (sourceFile.parseDiagnostics.length) {
    // Leave a file esbuild is about to reject exactly as it found it, so the
    // error it reports is about the source on disk.
    return sourceText;
  }

  const insertions = [];
  function visit(node) {
    if (isConsoleLogCall(node) && isDevGuarded(node)) {
      const [firstArgument] = node.arguments;
      const anchor = firstArgument ?? node;
      const { line } = locationAt(sourceFile, anchor.getStart(sourceFile));
      insertions.push({
        position: node.arguments.pos,
        text: `${JSON.stringify(`${origin}:${line}`)}${firstArgument ? "," : ""}`,
      });
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);

  let result = sourceText;
  for (const { position, text } of insertions.reverse()) {
    result = result.slice(0, position) + text + result.slice(position);
  }
  return result;
}

// Only the package's own sources are rewritten. Dependencies bundled into the
// IIFE arrive as built JavaScript that already carries whatever origins their
// own build gave them.
function devLogOriginsPlugin(packageRoot) {
  const sourceRoot = path.join(packageRoot, "src") + path.sep;
  return {
    name: "dev-log-origins",
    setup(build) {
      build.onLoad({ filter: /\.[cm]?tsx?$/ }, async ({ path: filePath }) => {
        const loader = LOADER_BY_EXTENSION.get(path.extname(filePath));
        if (!loader || !filePath.startsWith(sourceRoot)) {
          return null;
        }
        const sourceText = await readFile(filePath, "utf8");
        const contents = prefixDevLogOrigins(
          sourceText,
          toPosixPath(path.relative(packageRoot, filePath)),
          filePath,
        );
        // Nothing to rewrite: hand the file back to esbuild's own loader.
        return contents === sourceText ? null : { contents, loader };
      });
    },
  };
}

export { devLogOriginsPlugin, prefixDevLogOrigins };
