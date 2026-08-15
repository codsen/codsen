import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function fail(message) {
  throw new Error(message);
}

function readPackageName(filename) {
  let directory = path.dirname(filename);
  const filesystemRoot = path.parse(directory).root;
  while (directory !== filesystemRoot) {
    const manifestFile = path.join(directory, "package.json");
    if (existsSync(manifestFile)) {
      let manifest;
      try {
        manifest = JSON.parse(readFileSync(manifestFile, "utf8"));
      } catch (error) {
        fail(`${manifestFile} is not valid JSON: ${error.message}`);
      }
      if (typeof manifest.name === "string" && manifest.name) {
        return manifest.name;
      }
    }
    directory = path.dirname(directory);
  }
  fail(`Could not find an owning package.json for ${filename}`);
}

function resolvedOwner(resolution, specifier, containingFile) {
  if (!resolution?.resolvedFileName) {
    fail(
      `${containingFile} exposes ${specifier}, but TypeScript NodeNext could not resolve it`,
    );
  }
  const owner = readPackageName(resolution.resolvedFileName);
  if (resolution.packageId?.name && resolution.packageId.name !== owner) {
    fail(
      `${specifier} resolved with TypeScript package ${resolution.packageId.name}, but ${resolution.resolvedFileName} is owned by ${owner}`,
    );
  }
  return owner;
}

function extractDeclarationReferences({ source, typescript } = {}) {
  if (typeof source !== "string") {
    fail("Declaration source must be a string");
  }
  if (!typescript || typeof typescript.preProcessFile !== "function") {
    fail("Declaration reference extraction requires the TypeScript API");
  }
  const preprocessed = typescript.preProcessFile(source, true, true);
  const references = new Map();
  for (const { fileName } of preprocessed.importedFiles) {
    references.set(`module\0${fileName}`, {
      kind: "module",
      specifier: fileName,
    });
  }
  for (const { fileName } of preprocessed.typeReferenceDirectives) {
    references.set(`type\0${fileName}`, {
      kind: "type",
      specifier: fileName,
    });
  }
  return [...references.values()].sort(
    (left, right) =>
      left.specifier.localeCompare(right.specifier) ||
      left.kind.localeCompare(right.kind),
  );
}

function resolveDeclarationReferences({
  containingFile,
  references,
  typescript,
} = {}) {
  if (typeof containingFile !== "string" || !containingFile) {
    fail("Declaration resolution requires a containing file");
  }
  if (!Array.isArray(references)) {
    fail("Declaration resolution requires references");
  }
  if (
    !typescript ||
    typeof typescript.resolveModuleName !== "function" ||
    typeof typescript.resolveTypeReferenceDirective !== "function"
  ) {
    fail("Declaration resolution requires the TypeScript API");
  }
  const compilerOptions = {
    module: typescript.ModuleKind.NodeNext,
    moduleResolution: typescript.ModuleResolutionKind.NodeNext,
    strict: true,
  };
  return references.map(({ kind, specifier }) => {
    let resolution;
    if (kind === "module") {
      resolution = typescript.resolveModuleName(
        specifier,
        containingFile,
        compilerOptions,
        typescript.sys,
      ).resolvedModule;
    } else if (kind === "type") {
      resolution = typescript.resolveTypeReferenceDirective(
        specifier,
        containingFile,
        compilerOptions,
        typescript.sys,
      ).resolvedTypeReferenceDirective;
    } else {
      fail(
        `${containingFile} contains unsupported declaration reference ${kind}`,
      );
    }
    return {
      containingFile,
      kind,
      owner: resolvedOwner(resolution, specifier, containingFile),
      specifier,
    };
  });
}

export { extractDeclarationReferences, resolveDeclarationReferences };
