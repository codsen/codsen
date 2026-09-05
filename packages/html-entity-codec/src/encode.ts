import { encodeValue } from "./encode-value";
import { namedReferences } from "./generated";
import { assertString, type ObserveOptions } from "./observe";

export interface EncodeOptions extends ObserveOptions {
  /** Prefer canonical names; otherwise emit uppercase hexadecimal references. */
  useNamedReferences?: boolean;
}

let preferredNames: Record<string, string> | undefined;

function names(): Record<string, string> {
  if (!preferredNames) {
    preferredNames = Object.create(null) as Record<string, string>;
    // Codsen serialization policy: shortest spelling, then all-lowercase,
    // then ASCII lexical order. This is independent of snapshot key order.
    for (const name of Object.keys(namedReferences)) {
      if (!name.endsWith(";") || name === "Tab;") continue;
      const value = namedReferences[name];
      const previous = preferredNames[value];
      if (
        !previous ||
        name.length < previous.length ||
        (name.length === previous.length &&
          (Number(name !== name.toLowerCase()) <
            Number(previous !== previous.toLowerCase()) ||
            (Number(name !== name.toLowerCase()) ===
              Number(previous !== previous.toLowerCase()) &&
              name < previous)))
      )
        preferredNames[value] = name;
    }
  }
  return preferredNames;
}

/** Encode non-ASCII characters and HTML-sensitive ASCII with Codsen's stable spelling policy. */
export function encode(str: string, opts: EncodeOptions = {}): string {
  assertString(str, "encode");
  return encodeValue(str, opts, opts.useNamedReferences ? names() : undefined);
}
