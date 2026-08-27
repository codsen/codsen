import { version as v } from "../package.json";
import extlangJson from "./tag_extlang.json";
import grandfatheredJson from "./tag_grandfathered.json";
import languageJson from "./tag_language.json";
import { extlang as extlangPrefixesJson } from "./tag_prefixes.json";
import rangedJson from "./tag_ranged.json";
import redundantJson from "./tag_redundant.json";
import regionJson from "./tag_region.json";
import scriptJson from "./tag_script.json";
import variantJson from "./tag_variant.json";

const version: string = v;

type RangedEntry = {
  readonly type: string;
  readonly value: string;
};

type Res =
  | {
      res: true;
      message: null;
    }
  | {
      res: false;
      message: string;
    };

function alphaToNumber(value: string): number {
  return [...value].reduce(
    (acc, character) => acc * 26 + character.charCodeAt(0) - 97,
    0,
  );
}

function numberToAlpha(value: number, width: number): string {
  let remaining = value;
  let result = "";

  for (let index = 0; index < width; index += 1) {
    result = String.fromCharCode(97 + (remaining % 26)) + result;
    remaining = Math.floor(remaining / 26);
  }

  return result;
}

function rangedSubtags(ranged: readonly RangedEntry[], type: string): string[] {
  const result: string[] = [];

  for (const entry of ranged) {
    if (entry.type !== type) {
      continue;
    }

    const [from, to] = entry.value.split("..");
    const fromNumber = alphaToNumber(from);
    const toNumber = alphaToNumber(to);

    for (let current = fromNumber; current <= toNumber; current += 1) {
      result.push(numberToAlpha(current, from.length));
    }
  }

  return result;
}

const LANGUAGES = new Set([
  ...languageJson,
  ...rangedSubtags(rangedJson, "language"),
]);
const EXTLANGS = new Set(extlangJson);
const EXTLANG_PREFIXES = extlangPrefixesJson as Record<string, string[]>;
const GRANDFATHERED = new Set(grandfatheredJson);
const REDUNDANT = new Set(redundantJson);
const REGIONS = new Set([
  ...regionJson,
  ...rangedSubtags(rangedJson, "region"),
]);
const SCRIPTS = new Set([
  ...scriptJson,
  ...rangedSubtags(rangedJson, "script"),
]);
const VARIANTS = new Set(variantJson);

const LANGUAGE_TAG_RE = /^[a-z0-9]{1,8}(?:-[a-z0-9]{1,8})*$/i;
const SINGLETON_RE = /^[0-9a-wy-z]$/;

function success(): Res {
  return { res: true, message: null };
}

function failure(message: string): Res {
  return { res: false, message };
}

function isLanguage(subtag: string): boolean {
  return LANGUAGES.has(subtag);
}

function isScript(subtag: string): boolean {
  return SCRIPTS.has(subtag);
}

function isRegion(subtag: string): boolean {
  return REGIONS.has(subtag);
}

function isSingleton(subtag: string): boolean {
  return SINGLETON_RE.test(subtag);
}

function isLangCode(str?: unknown): Res {
  if (typeof str !== "string") {
    return failure("Not a string given.");
  }

  if (!str.trim()) {
    return failure("Empty language tag string given.");
  }

  if (!LANGUAGE_TAG_RE.test(str)) {
    return failure("Does not resemble a language tag.");
  }

  const normalized = str.toLowerCase();

  if (GRANDFATHERED.has(normalized) || REDUNDANT.has(normalized)) {
    return success();
  }

  const subtags = normalized.split("-");

  if (subtags[0] === "x") {
    return subtags.length > 1
      ? success()
      : failure('Ends with private use subtag, "x".');
  }

  if (isSingleton(subtags[0])) {
    return failure(`Starts with singleton, "${subtags[0]}".`);
  }

  const language = subtags[0];
  if (!isLanguage(language)) {
    return failure(`Unrecognised language subtag, "${language}".`);
  }

  let index = 1;

  // RFC 5646 permanently reserves the second and third extlang positions.
  // Consequently, a valid tag can contain at most one extlang, immediately
  // after its registered prefixing language.
  if (language.length <= 3 && subtags[index] && EXTLANGS.has(subtags[index])) {
    const extlang = subtags[index];
    const prefixes = EXTLANG_PREFIXES[extlang] ?? [];

    if (!prefixes.includes(language)) {
      return failure(
        `Extended language subtag "${extlang}" must follow ${prefixes
          .map((prefix) => `"${prefix}"`)
          .join(" or ")}.`,
      );
    }

    index += 1;

    if (subtags[index] && EXTLANGS.has(subtags[index])) {
      return failure(
        `More than one extended language subtag, "${subtags[index]}".`,
      );
    }
  }

  if (subtags[index] && isScript(subtags[index])) {
    index += 1;
  }

  let regionMatched: string | undefined;
  if (subtags[index] && isRegion(subtags[index])) {
    regionMatched = subtags[index];
    index += 1;
  }

  const variants = new Set<string>();
  while (subtags[index] && VARIANTS.has(subtags[index])) {
    if (variants.has(subtags[index])) {
      return failure(`Repeated variant subtag, "${subtags[index]}".`);
    }

    variants.add(subtags[index]);
    index += 1;
  }

  const singletons = new Set<string>();
  while (subtags[index] && isSingleton(subtags[index])) {
    const singleton = subtags[index];

    if (singletons.has(singleton)) {
      return failure(
        `Two extensions with same single-letter prefix "${singleton}".`,
      );
    }

    singletons.add(singleton);
    index += 1;

    if (!subtags[index]) {
      return failure(`Ends with singleton, "${singleton}".`);
    }

    if (isSingleton(subtags[index])) {
      return failure(
        `Multiple singleton sequence "${singleton}", "${subtags[index]}".`,
      );
    }

    if (subtags[index] === "x") {
      return failure(
        `Extension "${singleton}" must be followed by a two-to-eight character subtag.`,
      );
    }

    // The preliminary regex already guarantees alphanumeric subtags of no
    // more than eight characters. A non-singleton here is therefore a valid
    // two-to-eight-character extension subtag.
    while (
      subtags[index] &&
      subtags[index] !== "x" &&
      !isSingleton(subtags[index])
    ) {
      index += 1;
    }
  }

  if (subtags[index] === "x") {
    return subtags[index + 1]
      ? success()
      : failure('Ends with private use subtag, "x".');
  }

  if (subtags[index]) {
    if (regionMatched && isRegion(subtags[index])) {
      return failure(
        `Two region subtags, "${regionMatched}" and "${subtags[index]}".`,
      );
    }

    return failure(`Unrecognised language subtag, "${subtags[index]}".`);
  }

  return success();
}

export { isLangCode, version };
