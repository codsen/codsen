import { version as v } from "../package.json";
import { left, right } from "string-left-right";
import { roysSort } from "./util";

const version: string = v;
declare let DEV: boolean;

export interface Opts {
  extractAll: boolean;
  semi: boolean;
  mustInclude: string;
  stripAs: boolean;
  contentSort?: (el1: string, el2: string) => number;
}

export interface Chunk {
  startsAt: null | number;
  endsAt: null | number;
  identifiers: string[];
}
export interface Statement {
  identifiers: string[];
  identifiersStartAt: number | null;
  identifiersEndAt: number | null;
  content: string | null;
  contentStartsAt: number | null;
  contentEndsAt: number | null;
  value: string | null;
  valueStartsAt: number | null;
  valueEndsAt: number | null;
}

const NOT_FOUND_STR = "not found";
const IGNORE = new Set(["interface", "function", "declare", "type", "const"]);
const defaults: Opts = {
  extractAll: false,
  semi: true,
  mustInclude: "",
  stripAs: false,
};
const NON_IDENTIFIER_CHARS = `{}()_;:,=<>'"`;
const PAIRS = {
  "(": ")",
  "{": "}",
  '"': '"',
  "'": "'",
  "`": "`",
} as const;
const asChunkRegexp = /\w+\s+as\s+/g;
const statementDefault = {
  identifiers: [],
  identifiersStartAt: null,
  identifiersEndAt: null,
  content: null,
  contentStartsAt: null,
  contentEndsAt: null,
  value: null,
  valueStartsAt: null,
  valueEndsAt: null,
};
Object.freeze(statementDefault);

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ReturnType = Statement & { all: string[]; error: string | null };

// -----------------------------------------------------------------------------

function extractInner(
  str: string,
  def: string,
  resolvedOpts: Opts,
  offset: number,
): ReturnType {
  // there's a challenge when content follows closing curly:
  // export { x } from "y";
  //              ^^^^^^^^^
  //
  // When this flag is enabled, we continue adding characters
  // within quotes. The plan is, when we stumble upon "from",
  // we'd enable this flag and catch "y", independent does it
  // have trailing semicolon or not.
  let catchNextQuotedChunk = false;

  let statement: Statement = { ...statementDefault, identifiers: [] };
  function resetStatement(): void {
    catchNextQuotedChunk = false;
    statement = { ...statementDefault, identifiers: [] };
  }
  resetStatement();

  // early exit
  if (!resolvedOpts.extractAll && (!def || !str.includes(def))) {
    DEV && console.log(`093 ${`\u001b[${31}m${`EXIT`}\u001b[${39}m`}`);
    return { ...statementDefault, all: [], error: NOT_FOUND_STR };
  }

  // F L A G S
  // -------------------------------------------------------------------------
  let identifierStartsAt: number | null = null;

  // FILO structure;
  // loop will ignore until this character is met;
  // we stumble upon opening bracket, push its closing counterpart to this array
  // then walk further ignoring everything until this counterpart is met.
  // but also, we catch all other types of brackets.
  let ignoreUntil: string[] = [];

  let ret: ReturnType | null = null; // final return value (used in case opts.extractAll is on)
  let all = new Set<string>();

  // Chunks:
  // -------------------------------------------------------------------------

  // declare type Token = ...
  // ^^^^^^^^^^^^^^^^^^
  //       chunk
  //
  // interface AtToken { ...
  // ^^^^^^^^^^^^^^^^^
  //       chunk
  //
  // declare function tokenizer(str: string, ...
  // ^^^^^^^^^^^^^^^^^^^^^^^^^^
  //       chunk
  //
  let defaultChunk: Chunk = {
    startsAt: null,
    endsAt: null,
    identifiers: [],
  };
  let chunk: Chunk = { ...defaultChunk, identifiers: [] };
  function resetChunk(): void {
    chunk = { ...defaultChunk, identifiers: [] };
  }

  let lastNonWhitespaceChar = -1;

  // -----------------------------------------------------------------------------

  function updateLastNonWhitespaceChar(i: number): void {
    if (str[i]?.trim()) {
      lastNonWhitespaceChar = i;
      DEV &&
        console.log(
          `145 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`lastNonWhitespaceChar`}\u001b[${39}m`} = ${JSON.stringify(
            lastNonWhitespaceChar,
            null,
            4,
          )}`,
        );
    }
  }

  function patchMissingValues(i: number): void {
    DEV && console.log(`155 patchMissingValues() called`);

    if (
      typeof statement.contentStartsAt === "number" &&
      typeof statement.contentEndsAt !== "number"
    ) {
      statement.contentEndsAt =
        lastNonWhitespaceChar +
        (resolvedOpts.semi || str[lastNonWhitespaceChar] !== ";" ? 1 : 0);
      DEV &&
        console.log(
          `166 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`statement.contentEndsAt`}\u001b[${39}m`} = ${JSON.stringify(
            statement.contentEndsAt,
            null,
            4,
          )}`,
        );
    }

    if (
      typeof statement.contentStartsAt === "number" &&
      typeof statement.contentEndsAt === "number" &&
      statement.content === null
    ) {
      DEV && console.log(`179`);
      statement.content = str.slice(
        statement.contentStartsAt,
        statement.contentEndsAt,
      );
      DEV &&
        console.log(
          `186 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`statement.content`}\u001b[${39}m`} = ${JSON.stringify(
            statement.content,
            null,
            4,
          )}`,
        );
      if (resolvedOpts.stripAs) {
        statement.content = statement.content.replace(asChunkRegexp, "");
        DEV &&
          console.log(
            `196 ${`\u001b[${32}m${`REMOVE "* as"`}\u001b[${39}m`} ${`\u001b[${33}m${`statement.content`}\u001b[${39}m`} = ${JSON.stringify(
              statement.content,
              null,
              4,
            )}`,
          );
      }

      if (typeof resolvedOpts.contentSort === "function") {
        DEV && console.log(`205 ${`\u001b[${36}m${`sort args`}\u001b[${39}m`}`);
        if (
          def === "export" &&
          // there are curly brackets...
          statement.content.includes("{") &&
          statement.content.includes("}") &&
          // ...in correct order...
          statement.content.indexOf("{") + 1 < statement.content.indexOf("}") &&
          // ...with some content inside
          statement.content
            .slice(
              statement.content.indexOf("{") + 1,
              statement.content.indexOf("}"),
            )
            .trim() &&
          // we don't want to sort interfaces
          !statement.content
            .slice(
              statement.content.indexOf("{") + 1,
              statement.content.indexOf("}"),
            )
            .includes(";")
        ) {
          let contentBetweenCurlies = statement.content.slice(
            statement.content.indexOf("{") + 1,
            statement.content.indexOf("}"),
          );
          let args = contentBetweenCurlies
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s.trim())
            .sort(resolvedOpts.contentSort);
          DEV &&
            console.log(
              `239 ${`\u001b[${33}m${`args`}\u001b[${39}m`} = ${JSON.stringify(
                args,
                null,
                4,
              )}`,
            );

          let trailingComma =
            statement.content[
              left(statement.content, statement.content.indexOf("}")) as number
            ] === ","
              ? ","
              : "";

          // now it depends was it on one line or split between lines
          if (!contentBetweenCurlies.includes("\n")) {
            DEV &&
              console.log(`256 ${`\u001b[${36}m${`one-liner!`}\u001b[${39}m`}`);

            statement.content = `${statement.content.slice(
              0,
              statement.content.indexOf("{") + 1,
            )} ${args.join(", ")}${trailingComma} ${statement.content.slice(
              statement.content.indexOf("}"),
            )}`;
            DEV &&
              console.log(
                `266 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`statement.content`}\u001b[${39}m`} = ${JSON.stringify(
                  statement.content,
                  null,
                  4,
                )}`,
              );
          } else {
            DEV &&
              console.log(
                `275 ${`\u001b[${36}m${`multi-line!`}\u001b[${39}m`}`,
              );

            let detectedIndentation = statement.content.slice(
              statement.content.indexOf(
                "\n",
                statement.content.indexOf("{") + 1,
              ) + 1,
              right(
                statement.content,
                statement.content.indexOf(
                  "\n",
                  statement.content.indexOf("{") + 1,
                ),
              ) as number,
            );

            DEV &&
              console.log(
                `294 ${`\u001b[${33}m${`detectedIndentation`}\u001b[${39}m`} = ${JSON.stringify(
                  detectedIndentation,
                  null,
                  4,
                )}; ${`\u001b[${33}m${`trailingSemi`}\u001b[${39}m`} = ${JSON.stringify(
                  trailingComma,
                  null,
                  4,
                )}`,
              );

            // finally, SET the value
            statement.content = `${statement.content.slice(
              0,
              statement.content.indexOf("{") + 1,
            )}\n${detectedIndentation}${args.join(
              `,\n${detectedIndentation}`,
            )}${trailingComma}\n${statement.content.slice(
              statement.content.indexOf("}"),
            )}`;

            DEV &&
              console.log(
                `317 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`statement.content`}\u001b[${39}m`} = ${JSON.stringify(
                  statement.content,
                  null,
                  4,
                )}`,
              );
          }
        }
      }
    }

    if (
      typeof statement.valueStartsAt === "number" &&
      typeof statement.valueEndsAt !== "number"
    ) {
      statement.valueEndsAt =
        lastNonWhitespaceChar +
        (resolvedOpts.semi || str[lastNonWhitespaceChar] !== ";" ? 1 : 0);
      DEV &&
        console.log(
          `337 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`statement.valueEndsAt`}\u001b[${39}m`} = ${JSON.stringify(
            statement.valueEndsAt,
            null,
            4,
          )}`,
        );
    }

    if (
      typeof statement.valueStartsAt === "number" &&
      typeof statement.valueEndsAt === "number" &&
      statement.value === null
    ) {
      statement.value = str.slice(
        statement.valueStartsAt,
        statement.valueEndsAt,
      );
      DEV &&
        console.log(
          `356 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`statement.value`}\u001b[${39}m`} = ${JSON.stringify(
            statement.value,
            null,
            4,
          )}`,
        );
      if (resolvedOpts.stripAs) {
        statement.value = statement.value.replace(asChunkRegexp, "");
        DEV &&
          console.log(
            `366 ${`\u001b[${32}m${`TWEAK`}\u001b[${39}m`} ${`\u001b[${33}m${`statement.value`}\u001b[${39}m`} = ${JSON.stringify(
              statement.value,
              null,
              4,
            )}`,
          );
      }
    }

    // edge case where there is no content:
    // interface abc;
    // chunk.identifiers array needs to be merged into statement.identifiers
    if (statement.contentStartsAt === null) {
      // 1.
      if (chunk.identifiers.length) {
        statement.identifiers.push(...chunk.identifiers);
        DEV &&
          console.log(
            `384 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${`\u001b[${33}m${`statement.identifiers`}\u001b[${39}m`} now = ${JSON.stringify(
              statement.identifiers,
              null,
              4,
            )}`,
          );

        // 2.
        if (
          statement.identifiersStartAt === null &&
          typeof chunk.startsAt === "number"
        ) {
          statement.identifiersStartAt = chunk.startsAt;
          DEV &&
            console.log(
              `399 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`statement.identifiersStartAt`}\u001b[${39}m`} = ${JSON.stringify(
                statement.identifiersStartAt,
                null,
                4,
              )}`,
            );
        }

        // 3.
        if (statement.identifiersEndAt === null) {
          statement.identifiersEndAt = i;
          DEV &&
            console.log(
              `412 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`statement.identifiersEndAt`}\u001b[${39}m`} = ${JSON.stringify(
                statement.identifiersEndAt,
                null,
                4,
              )}`,
            );
        }
      }
    }

    DEV &&
      console.log(
        `424 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} patched ${`\u001b[${33}m${`statement`}\u001b[${39}m`} = ${JSON.stringify(
          statement,
          null,
          4,
        )}`,
      );
  }

  // -----------------------------------------------------------------------------

  // the "for" loop deliberately extends up to str[str.length] to simplify indexes
  // last iteration will have str[i] as undefined!
  for (let i = 0, len = str.length; i <= len; i++) {
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //
    //                        RULES AT THE TOP
    //
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S

    // Logging:
    // -------------------------------------------------------------------------
    DEV &&
      console.log(
        `\u001b[${36}m${`===============================`}\u001b[${39}m \u001b[${35}m${`str[ ${i}${
          offset ? ` (including offset, ${i + offset})` : ""
        } ] = ${
          str[i]?.trim() ? str[i] : JSON.stringify(str[i], null, 4)
        }`}\u001b[${39}m \u001b[${36}m${`===============================`}\u001b[${39}m\n`,
      );

    // Catch the comments
    if (str[i] === "/") {
      if (str[i + 1] === "*") {
        DEV && console.log(`471 a comment opening caught`);
        DEV &&
          console.log(`473 OLD ${`\u001b[${33}m${`i`}\u001b[${39}m`} = ${i}`);
        if (str.includes("*/", i + 1)) {
          i = str.indexOf("*/", i + 1) + 2;
        } else {
          i = str.length - 1;
        }
        DEV &&
          console.log(`480 SET ${`\u001b[${33}m${`i`}\u001b[${39}m`} = ${i}`);
        continue;
      } else if (str[i + 1] === "/") {
        DEV && console.log(`483 skip until line break`);

        DEV &&
          console.log(`486 OLD ${`\u001b[${33}m${`i`}\u001b[${39}m`} = ${i}`);
        if (str.includes("\n", i + 1)) {
          i = str.indexOf("\n", i + 1);
        } else if (str.includes("\r", i + 1)) {
          i = str.indexOf("\r", i + 1);
        } else {
          i = str.length - 1;
        }
        DEV &&
          console.log(`495 SET ${`\u001b[${33}m${`i`}\u001b[${39}m`} = ${i}`);
        continue;
      }
    }

    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //
    //                        RULES AT THE MIDDLE
    //
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S

    // Catch an identifier's end
    // -----------------------------------------------------------------------------
    if (
      !ignoreUntil.length &&
      typeof identifierStartsAt === "number" &&
      //
      // EOL - already went past the str boundary
      (!str[i]?.trim() ||
        // some other identifier starts
        NON_IDENTIFIER_CHARS.includes(str[i]))
    ) {
      DEV && console.log(`531 inside the catch identifier's end clauses`);
      // 1. chunk.endsAt is a "rolling" value to end up as
      // the value of "identifiersEndAt"
      chunk.endsAt = i;

      // 2. On tactical level, extract the identifier
      let identifier = str.slice(identifierStartsAt, i);
      DEV &&
        console.log(
          `540 ${`\u001b[${35}m${`██ EXTRACTED`}\u001b[${39}m`} ${`\u001b[${33}m${`identifier`}\u001b[${39}m`} = ${JSON.stringify(
            identifier,
            null,
            4,
          )}`,
        );
      chunk.identifiers.push(identifier);
      DEV &&
        console.log(
          `549 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to ${`\u001b[${33}m${`chunk.identifiers`}\u001b[${39}m`} now = ${JSON.stringify(
            chunk.identifiers,
            null,
            4,
          )}`,
        );

      // 3. On strategical level, tackle the chunk
      if (chunk.startsAt === null) {
        // it's a new chunk
        chunk.startsAt = identifierStartsAt;

        if (typeof statement.valueStartsAt !== "number") {
          statement.valueStartsAt = identifierStartsAt;
          DEV &&
            console.log(
              `565 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`chunk.startsAt`}\u001b[${39}m`} = ${JSON.stringify(
                chunk.startsAt,
                null,
                4,
              )}; ${`\u001b[${33}m${`statement.valueStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
                statement.valueStartsAt,
                null,
                4,
              )}`,
            );
        }
      }

      if (str[i] === ";" && statement.identifiersEndAt === null) {
        statement.identifiersEndAt = lastNonWhitespaceChar + 1;
        DEV &&
          console.log(
            `${`\u001b[${33}m${`statement.identifiersEndAt`}\u001b[${39}m`} = ${JSON.stringify(
              statement.identifiersEndAt,
              null,
              4,
            )}`,
          );
      }

      // 4. reset the flag
      identifierStartsAt = null;
      DEV &&
        console.log(
          `594 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} ${`\u001b[${33}m${`identifierStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
            identifierStartsAt,
            null,
            4,
          )}`,
        );

      // 5. push to "all"
      if (
        resolvedOpts.extractAll &&
        !IGNORE.has(identifier) &&
        str[statement.contentStartsAt as number] !== "("
      ) {
        all.add(identifier);
        DEV &&
          console.log(
            `610 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} ${`\u001b[${33}m${identifier}\u001b[${39}m`} to ${`\u001b[${33}m${`all`}\u001b[${39}m`} = ${JSON.stringify(
              [...all],
              null,
              4,
            )}`,
          );
      }
    }

    // Catch a chunk's end
    // -----------------------------------------------------------------------------
    if (
      typeof chunk.startsAt === "number" &&
      (str[i] in PAIRS || `=:`.includes(str[i])) &&
      statement.contentStartsAt === null
    ) {
      DEV && console.log(`626 caught a chunk's end`);
      // 1. set statement, but only if "def" was not found yet

      // It's because if opts.extractAll is enabled, after we find
      // what we're looking and set the "statement", we continue
      // traversing, registering chunks and pushing to all[], but
      // we don't touch the "statement" any more, it is eventually
      // returned when we reach the end of input string.

      statement.identifiers = [...chunk.identifiers];
      statement.identifiersStartAt = chunk.startsAt;
      statement.identifiersEndAt = chunk.endsAt;
      DEV &&
        console.log(
          `640 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`statement.identifiers`}\u001b[${39}m`} = ${JSON.stringify(
            statement.identifiers,
            null,
            4,
          )}; ${`\u001b[${33}m${`statement.identifiersStartAt`}\u001b[${39}m`} = ${JSON.stringify(
            statement.identifiersStartAt,
            null,
            4,
          )}; ${`\u001b[${33}m${`statement.identifiersEndAt`}\u001b[${39}m`} = ${JSON.stringify(
            statement.identifiersEndAt,
            null,
            4,
          )}`,
        );

      if (!statement.contentStartsAt) {
        if (str[i] !== ":") {
          statement.contentStartsAt = i;
        } else {
          let rightOfColon = right(str, i);
          if (rightOfColon && str[rightOfColon] === "{") {
            statement.contentStartsAt = rightOfColon;
          } else {
            DEV &&
              console.log(
                `665 ${`\u001b[${31}m${`unexpected case`}\u001b[${39}m`}`,
              );
            statement.contentStartsAt = i;
          }
        }
        DEV &&
          console.log(
            `672 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`statement.contentStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
              statement.contentStartsAt,
              null,
              4,
            )}`,
          );
      }

      // 2. if we have a type declaration, there won't be opening/closing curlies
      // for example:
      // declare type Token1 = "ab" | "cd";
      //                     ^
      //            were're here
      //
      // we need to skip up to the next semicolon, if such exists
      if (str[i] === "=") {
        ignoreUntil.push(";");
      }

      // 3. reset chunk
      DEV && console.log(`692 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} chunk`);
      resetChunk();
    }

    // Catch opening and closing counterparts from "ignoreUntil" list
    // That's curly braces, but also semicolon (declare type = ... ;) and quotes
    // which can be both opening and closing
    // -------------------------------------------------------------------------

    if (str[i]) {
      if (
        // interface sub-key querying (def=foo.bar) second loop and onwards
        // will recursively pass contents of "content", curly-to-curly
        // value of some key from an interface. This initial opening curly
        // needs to be ignored in those cases, thus truthy check on "i":
        i &&
        str[i] in PAIRS &&
        (!`\`'"`.includes(str[i]) ||
          !ignoreUntil.length ||
          str[i] !== ignoreUntil[~-ignoreUntil.length])
      ) {
        DEV && console.log(`713 - it's an opening counterpart`);
        //
        // activate the ignores - skip until the closing counterpart,
        // but beware the nesting - continue catching nested pairs
        ignoreUntil.push((PAIRS as any)[str[i]]);
        resetChunk();
        DEV &&
          console.log(
            `721 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to ${`\u001b[${33}m${`ignoreUntil`}\u001b[${39}m`}, now = ${JSON.stringify(
              ignoreUntil,
              null,
              0,
            )}; ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} chunk`,
          );
      } else if (ignoreUntil.length) {
        DEV && console.log(`728`);
        if (str[i] === ignoreUntil[~-ignoreUntil.length]) {
          ignoreUntil.pop();
          DEV &&
            console.log(
              `733 ${`\u001b[${31}m${`POP`}\u001b[${39}m`} ${`\u001b[${33}m${`ignoreUntil`}\u001b[${39}m`} now = ${JSON.stringify(
                ignoreUntil,
                null,
                4,
              )}`,
            );
        } else {
          updateLastNonWhitespaceChar(i);
          if (!NON_IDENTIFIER_CHARS.includes(str[i])) {
            // either way, we're done here, continue
            DEV && console.log(`${`\u001b[${33}m${`CONTINUE`}\u001b[${39}m`}`);
            continue;
          }
        }
      }
    }

    // Catch an identifier's start
    // -------------------------------------------------------------------------

    if (
      !ignoreUntil.length &&
      identifierStartsAt === null &&
      (statement.contentStartsAt === null ||
        !statement.identifiers.includes("function")) &&
      str[i]?.trim() &&
      !NON_IDENTIFIER_CHARS.includes(str[i])
    ) {
      DEV && console.log(`761 Catch an identifier's start clauses`);
      if (str.startsWith("from", i)) {
        catchNextQuotedChunk = true;
        DEV &&
          console.log(
            `766 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`catchNextQuotedChunk`}\u001b[${39}m`} = ${JSON.stringify(
              catchNextQuotedChunk,
              null,
              4,
            )}`,
          );
      } else if (
        !catchNextQuotedChunk &&
        (statement.contentStartsAt === null ||
          str[statement.contentStartsAt] !== ":")
      ) {
        DEV && console.log(`777`);
        // if the semicolon was missing, at this point, we'll have "identifiersEndAt"
        // still set; that's how we detect the curlies chunk was passed by now
        if (
          typeof statement.identifiersEndAt === "number" &&
          // in functions, the return value type follows the brackets:
          // declare function comb(str: string, originalOpts?: Partial<Opts>): Res;
          //                                                                 ^
          //                                                          we're here
          str[statement.identifiersEndAt] !== "("
        ) {
          DEV && console.log(`788`);
          if (!resolvedOpts.extractAll && statement.identifiers.includes(def)) {
            // patch up the missing values
            DEV &&
              console.log(
                `793 PATCHING! ${`\u001b[${33}m${`FIY`}\u001b[${39}m`}, ${`\u001b[${33}m${`lastNonWhitespaceChar`}\u001b[${39}m`} = ${JSON.stringify(
                  lastNonWhitespaceChar,
                  null,
                  4,
                )}`,
              );

            patchMissingValues(i);

            DEV &&
              console.log(`803 ${`\u001b[${35}m${`RETURN`}\u001b[${39}m`}`);
            // "all" is empty unless requested
            return { ...statement, all: [], error: null };
          }

          if (statement.identifiers.includes(def)) {
            DEV && console.log(`809 patch statement`);
            patchMissingValues(i);
            DEV &&
              console.log(
                `813 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${35}m${`ret`}\u001b[${39}m`}`,
              );
            ret = { ...statement, all: [], error: null };
          }
          resetStatement();
          DEV &&
            console.log(
              `820 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} statement`,
            );
        }

        if (
          !statement.identifiers.includes("function") ||
          statement.identifiersEndAt === null
        ) {
          identifierStartsAt = i;
          DEV &&
            console.log(
              `831 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`identifierStartsAt`}\u001b[${39}m`} = ${JSON.stringify(
                identifierStartsAt,
                null,
                4,
              )}`,
            );
        }
      }
    }

    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //
    //                        RULES AT THE BOTTOM
    //
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S
    //                                S

    // Update "lastNonWhitespaceChar"
    DEV && console.log(`862 call updateLastNonWhitespaceChar()`);
    updateLastNonWhitespaceChar(i);

    // EOL
    // -----------------------------------------------------------------------------

    if (
      !str[i] &&
      !ret &&
      (chunk.identifiers.includes(def) || statement.identifiers.includes(def))
    ) {
      DEV && console.log(`873 EOL clauses`);
      patchMissingValues(i);

      DEV &&
        console.log(
          `878 after patch, ${`\u001b[${33}m${`statement`}\u001b[${39}m`} = ${JSON.stringify(
            statement,
            null,
            4,
          )}`,
        );

      if (
        !resolvedOpts.mustInclude ||
        statement.value?.includes(resolvedOpts.mustInclude)
      ) {
        DEV && console.log(`889`);
        ret = { ...statement, all: [], error: null };
        DEV &&
          console.log(
            `893 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`ret`}\u001b[${39}m`} = ${JSON.stringify(
              ret,
              null,
              4,
            )}`,
          );
      }
      resetStatement();
      DEV &&
        console.log(`902 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} statement`);
    }

    // Catch semi
    // -----------------------------------------------------------------------------
    if (!ignoreUntil.length && str[i] === ";") {
      DEV && console.log(`908`);
      if (statement.identifiers.includes(def)) {
        DEV &&
          console.log(`911 ${`\u001b[${32}m${`END REACHED`}\u001b[${39}m`}`);
        patchMissingValues(i);
        DEV && console.log(`913`);

        if (
          !resolvedOpts.mustInclude ||
          statement.value?.includes(resolvedOpts.mustInclude)
        ) {
          if (!resolvedOpts.extractAll) {
            DEV &&
              console.log(`921 ${`\u001b[${35}m${`RETURN`}\u001b[${39}m`}`);
            return { ...statement, all: [...all], error: null };
          } else if (!ret) {
            DEV &&
              console.log(
                `926 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${35}m${`ret`}\u001b[${39}m`}`,
              );
            // remember to patch "all" in the end, now it's incomplete
            ret = { ...statement, all: [], error: null };
          }
        }
        DEV && console.log(`932 reset statement`);
        resetStatement();
      } else if (typeof statement.contentStartsAt === "number") {
        // wipe statement object, prepare to start
        // from fresh
        resetStatement();
        DEV &&
          console.log(
            `940 ${`\u001b[${31}m${`RESET`}\u001b[${39}m`} statement`,
          );
      }
    }

    // Catch brackets (generics etc)
    // -----------------------------------------------------------------------------

    if (
      // it's opening bracket
      str[i] === "<" &&
      // and content hasn't started
      //
      // declare function a<b>(c: d): e;
      //                      ^^^^^^^^^^
      //                        content
      //
      statement.contentStartsAt === null
    ) {
      DEV && console.log(`959 ignore until closing bracket`);
      ignoreUntil.push(">");
      DEV &&
        console.log(
          `963 ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} to ${`\u001b[${33}m${`ignoreUntil`}\u001b[${39}m`} now = ${JSON.stringify(
            ignoreUntil,
            null,
            4,
          )}`,
        );
    }

    // LOGGING
    // -----------------------------------------------------------------------------
    DEV && console.log("");

    DEV &&
      statement.identifiersStartAt !== null &&
      console.log(
        `${`\u001b[${90}m${`statement = ${JSON.stringify(
          statement,
        )}`}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`identifierStartsAt = ${JSON.stringify(
          identifierStartsAt,
        )}`}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`catchNextQuotedChunk = ${JSON.stringify(
          catchNextQuotedChunk,
        )}`}\u001b[${39}m`}`,
      );
    DEV &&
      chunk.startsAt !== null &&
      console.log(
        `${`\u001b[${90}m${`chunk.startsAt = ${JSON.stringify(
          chunk.startsAt,
        )}; chunk.endsAt = ${JSON.stringify(
          chunk.endsAt,
        )}; chunk.identifiers = ${JSON.stringify(
          chunk.identifiers,
        )};`}\u001b[${39}m`}`,
      );
    DEV &&
      ignoreUntil.length &&
      console.log(
        `${`\u001b[${90}m${`ignoreUntil = ${JSON.stringify(
          ignoreUntil,
        )}`}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`all = ${JSON.stringify([...all])}`}\u001b[${39}m`}`,
      );
    DEV &&
      console.log(
        `${`\u001b[${90}m${`ret = ${JSON.stringify(ret)}`}\u001b[${39}m`}`,
      );
  }

  if (ret) {
    if (offset) {
      DEV &&
        console.log(
          `1026 ${`\u001b[${33}m${`offset correction`}\u001b[${39}m`}`,
        );
      if (ret.identifiersStartAt) {
        ret.identifiersStartAt += offset;
      }
      if (ret.identifiersEndAt) {
        ret.identifiersEndAt += offset;
      }
      if (ret.contentStartsAt) {
        ret.contentStartsAt += offset;
      }
      if (ret.contentEndsAt) {
        ret.contentEndsAt += offset;
      }
      if (ret.valueStartsAt) {
        ret.valueStartsAt += offset;
      }
      if (ret.valueEndsAt) {
        ret.valueEndsAt += offset;
      }
    }

    DEV && console.log(`1048 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ret`);
    ret.all = [...all];
    return ret;
  }
  DEV &&
    console.log(
      `1054 ${`\u001b[${32}m${`RETURN`}\u001b[${39}m`} ${`\u001b[${31}m${`error`}\u001b[${39}m`} ${NOT_FOUND_STR}`,
    );
  return { ...statementDefault, all: [...all], error: NOT_FOUND_STR };
}

function extractStrChunksBetweenCurlies(str: string): string[] {
  // early exit
  if (typeof str !== "string") {
    return [];
  }

  let openings: number[] = [];
  let closings: number[] = [];

  let opening: number = str.indexOf("{");
  while (opening !== -1) {
    if (opening !== -1) {
      openings.push(opening);
    }
    opening = str.indexOf("{", opening + 1);
  }

  let closing: number = str.indexOf("}");
  while (closing !== -1) {
    if (closing !== -1) {
      closings.push(closing);
    }
    closing = str.indexOf("}", closing + 1);
  }

  return openings.reduce(
    (acc, curr, idx) => {
      if (typeof closings[idx] === "number") {
        return [...acc, str.slice(curr + 1, closings[idx])];
      }
      // else, bail
      return acc;
    },
    <string[]>[],
  );
}

function join(...args: string[]): string {
  // insurance
  if (
    !args.some(
      (arg) =>
        typeof arg === "string" && arg.includes("{") && arg.includes("}"),
    )
  ) {
    return "";
  }
  return (
    "{\n" +
    `${args
      .reduce(
        (acc, curr) => {
          return acc.concat(extractStrChunksBetweenCurlies(curr));
        },
        <string[]>[],
      )
      .join("\n")}`
      .split(/(\r?\n)/)
      .filter((l) => l.trim().length)
      .map((s) => `  ${s.trim()}`)
      .join("\n") +
    "\n}"
  );
}
function fixIndentation<Type>(s: Type): Type {
  if (typeof s === "string") {
    return s
      .replace(/\n {2}( {2})+/g, `\n  `)
      .replace(/\n {2}}/g, `\n}`) as Type;
  }
  return s;
}

/**
 *
 * @param str type definitions file, as a string
 * @param def name of an interface, function or something else to extract
 * @param opts optional options object
 */
function extract(str: string, def: string, opts?: Partial<Opts>): ReturnType {
  DEV &&
    console.log(
      `1141 ███████████████████████████████████████ looking for: ${`\u001b[${33}m${`def`}\u001b[${39}m`} = ${JSON.stringify(
        def,
        null,
        4,
      )}`,
    );
  if (typeof str !== "string") {
    throw new Error(
      `tsd-extract/extract(): [THROW_ID_01] The first arg should be string! It was given ${typeof str}, equal to ${JSON.stringify(
        def,
        null,
        4,
      )}.`,
    );
  }
  if (typeof def !== "string") {
    throw new Error(
      `tsd-extract/extract(): [THROW_ID_02] The name of statement to extract should be string! It was given ${typeof def}, equal to ${JSON.stringify(
        def,
        null,
        4,
      )}.`,
    );
  }
  if (opts && (typeof opts !== "object" || Array.isArray(opts))) {
    throw new Error(
      `tsd-extract/extract(): [THROW_ID_03] The options object should be a plain object! It was given ${typeof opts}:\n${JSON.stringify(
        opts,
        null,
        4,
      )}`,
    );
  }

  let resolvedOpts: Opts = { ...defaults, ...opts };
  DEV && console.log(`resolvedOpts: ${JSON.stringify(resolvedOpts, null, 4)}`);

  // -----------------------------------------------------------------------------

  let defs = def.split(".");
  DEV &&
    console.log(
      `${`\u001b[${33}m${`defs`}\u001b[${39}m`} = ${JSON.stringify(
        defs,
        null,
        4,
      )}`,
    );

  let sourceToWorkUpon;

  // we report only from the first iterations's identifiers,
  // sub-level keys won't be able to extract them.
  let identifiers: string[] = [];
  let all: string[] = [];
  let identifiersStartAt: number | null = null;
  let identifiersEndAt: number | null = null;
  let firstLoopIteration = true;
  let offset = 0;

  while (defs.length) {
    DEV &&
      console.log(
        `${`\u001b[${31}m${`██`}\u001b[${39}m`}${`\u001b[${33}m${`██`}\u001b[${39}m`}`.repeat(
          30,
        ),
      );
    let defToFind = defs.shift();

    let res = extractInner(
      sourceToWorkUpon || str,
      defToFind as string,
      resolvedOpts,
      offset,
    );

    if (def.includes(".")) {
      DEV && console.log(`1218`);
      if (firstLoopIteration) {
        DEV && console.log(`1220 - initial loop, save the keys`);
        // make a note of these, but only if it's the first loop
        // (meaning we're querying "foo" from def="foo.bar" if it's
        // the interface sub-key querying, or it's simply def="foo")
        identifiers = res.identifiers;
        all = res.all;
        identifiersStartAt = res.identifiersStartAt;
        identifiersEndAt = res.identifiersEndAt;
      } else {
        DEV && console.log(`1229 - restore keys`);
        // restore keys from the first loop because "identifiers" and
        // "all" will be wrong at this deeper level loop; inputs here
        // couldn't "see" the outer identifiers, they operate from
        // cropped "content" value!
        res.identifiers = identifiers;
        res.all = all;
        res.identifiersStartAt = identifiersStartAt;
        res.identifiersEndAt = identifiersEndAt;

        // correct the indentation
        res.content = fixIndentation(res.content);
        res.value = fixIndentation(res.value);
      }

      // set a new offset if another loop iteration is pending
      if (defs.length && typeof res.contentStartsAt === "number") {
        offset = res.contentStartsAt;
      }
    }

    DEV &&
      console.log(
        `1252 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`} ${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
          res,
          null,
          4,
        )}`,
      );

    if (!defs.length) {
      if (!def.includes(".")) {
        DEV &&
          console.log(`1262 normal return ${JSON.stringify(res, null, 4)}`);
        return res;
      } else {
        DEV &&
          console.log(
            `1267 sub-key return ${JSON.stringify(
              { ...res, identifiers, all },
              null,
              4,
            )}`,
          );
        return { ...res, identifiers, all };
      }
    }

    sourceToWorkUpon = res.content;
    firstLoopIteration = false;
  }

  return { ...statementDefault, all: [], error: NOT_FOUND_STR };
}

export { extract, join, roysSort, defaults, version };
