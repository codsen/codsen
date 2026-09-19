import { formatDiagnosticValue, isPlainObject as isObj } from "codsen-utils";
import { decode, scanReference } from "html-entity-codec";
import type { Ranges } from "ranges-merge";
import { rMerge } from "ranges-merge";

import { version as v } from "../package.json";

const version: string = v;

declare let DEV: boolean;

function chomp(str: string): string {
  str = str.replace(/(amp;)|(#x26;)/gi, "");
  DEV &&
    console.log(
      `${`\u001b[${33}m${`str after chomp`}\u001b[${39}m`} = ${JSON.stringify(
        str,
        null,
        4,
      )}`,
    );
  return str;
}

export interface Opts {
  isAttributeValue: boolean;
  strict: boolean;
}

const defaults: Opts = {
  isAttributeValue: false,
  strict: false,
};

function rEntDecode(str: string, opts?: Partial<Opts>): Ranges {
  // insurance:
  // ---------------------------------------------------------------------------
  if (typeof str !== "string") {
    throw new TypeError(
      `ranges-ent-decode/rEntDecode(): [THROW_ID_01] Expected a String! Currently it's given as ${str}, type ${typeof str}`,
    );
  } else if (!str.trim()) {
    // fast ending, matching Ranges notation - absence is marked by falsy null
    return null;
  }
  if (opts != null && !isObj(opts)) {
    throw new TypeError(
      `ranges-ent-decode/rEntDecode(): [THROW_ID_02] Optional Options Object, the second input argument, must be a plain object! Currently it's given as ${opts}, type ${typeof opts}`,
    );
  }
  let resolvedOpts: Opts = { ...defaults, ...opts };

  DEV &&
    console.log(
      `${`\u001b[${33}m${`str`}\u001b[${39}m`} = ${JSON.stringify(
        str,
        null,
        4,
      )}`,
    );
  DEV &&
    console.log(
      `${`\u001b[${33}m${`resolvedOpts`}\u001b[${39}m`} = ${JSON.stringify(
        resolvedOpts,
        null,
        4,
      )}`,
    );

  // vars
  // ---------------------------------------------------------------------------

  // Candidate spans are a public wrapper contract: semicolon-delimited
  // encoded layers belong to one range, and a legacy name includes one
  // lookahead character. The core scanner handles only reference recognition.
  let rangesArr = [];

  let regexInvalidEntity = /&#(?:[xX][^a-fA-F0-9]|[^0-9xX])/;

  if (resolvedOpts.strict) {
    let matchedInvalidEntities = str.match(regexInvalidEntity);
    if (matchedInvalidEntities) {
      throw new Error(
        `ranges-ent-decode/rEntDecode(): [THROW_ID_03] Parse error - strict mode is on and input contains an invalid entity. Here are all the invalid entities: ${formatDiagnosticValue(matchedInvalidEntities, 4)}`,
      );
    }
  }

  // action
  // ---------------------------------------------------------------------------

  for (let start = str.indexOf("&"); start !== -1; ) {
    const end = candidateEnd(str, start);
    if (end === start) {
      start = str.indexOf("&", start + 1);
      continue;
    }
    const chomped = chomp(str.slice(start, end));
    if (resolvedOpts.strict && resolvedOpts.isAttributeValue) {
      const reference = scanReference(chomped, 0);
      if (
        reference &&
        chomped[1] !== "#" &&
        chomped[reference.end - 1] !== ";" &&
        chomped[reference.end] === "="
      ) {
        // Preserve the wrapper's historical strict attribute error policy.
        throw new Error(
          "ranges-ent-decode/rEntDecode(): [THROW_ID_04] Parse error: `&` did not start a character reference",
        );
      }
    }
    if (
      resolvedOpts.strict &&
      /[a-zA-Z]/.test(chomped[1] || "") &&
      !scanReference(chomped, 0)
    ) {
      // Chomping can remove the semicolon from an unknown name. The old
      // wrapper still rejected that selected candidate in strict mode.
      throw new Error(
        "ranges-ent-decode/rEntDecode(): [THROW_ID_05] Parse error: named character reference was not terminated by a semicolon",
      );
    }
    const decoded =
      chomped === "&"
        ? "&"
        : chomped === "&#" || chomped === "&#x" || chomped === "&#X"
          ? chomped
          : decode(chomped, {
              context: resolvedOpts.isAttributeValue ? "attribute" : "text",
              strict: resolvedOpts.strict,
            });
    if (chomped === "&" || decoded !== chomped) {
      rangesArr.push([start, end, decoded]);
    }
    start = str.indexOf("&", end);
  }

  return rMerge(rangesArr as Ranges);
}

function isWord(code: number): boolean {
  return (
    (code >= 48 && code <= 57) ||
    (code >= 65 && code <= 90) ||
    (code >= 97 && code <= 122) ||
    code === 95
  );
}

const repeatedCandidate = /&(?:#?[A-Za-z0-9_]+;)+/y;

function candidateEnd(str: string, start: number): number {
  // This is the wrapper's recursive-layer grammar, independent of the
  // codec's canonical names. Sticky matching preserves the requested offset.
  repeatedCandidate.lastIndex = start;
  const candidate = repeatedCandidate.exec(str);
  if (candidate) return repeatedCandidate.lastIndex;
  const reference = scanReference(str, start);
  if (!reference) return start;
  let end = reference.end;
  const next = str.charCodeAt(end);
  if (
    str[start + 1] !== "#" &&
    str[end - 1] !== ";" &&
    (next === 61 || (isWord(next) && next !== 95))
  )
    end += 1;
  return end;
}

export { defaults, type Ranges, rEntDecode, version };
