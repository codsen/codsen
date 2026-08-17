import { test } from "uvu";
import { equal } from "uvu/assert";

import { match } from "../dist/codsen-utils.esm.js";

test("01 - exact and anchored matching", () => {
  equal(match("", ""), true, "01.01");
  equal(match("", "*"), true, "01.02");
  equal(match("", "**"), true, "01.03");
  equal(match("a", ""), false, "01.04");
  equal(match("alpha", "alpha"), true, "01.05");
  equal(match("alphabet", "alpha"), false, "01.06");
  equal(match("alpha", "alphabet"), false, "01.07");
  equal(match("anything", "*"), true, "01.08");
});

test("02 - a wildcard consumes zero or more characters", () => {
  equal(match("ab", "a*b"), true, "02.01");
  equal(match("axxxb", "a*b"), true, "02.02");
  equal(match("prefix-middle-suffix", "prefix*suffix"), true, "02.03");
  equal(match("prefix-suffix", "*suffix"), true, "02.04");
  equal(match("prefix-suffix", "prefix*"), true, "02.05");
  equal(match("prefix-suffix", "*fix-*fix"), true, "02.06");
  equal(match("acb", "a*b*c"), false, "02.07");
});

test("03 - wildcards cross line endings", () => {
  equal(match("top\nmiddle\nbottom", "top*bottom"), true, "03.01");
  equal(match("\n", "*"), true, "03.02");
  equal(match("a\r\nb", "a*b"), true, "03.03");
  equal(match("a\nb", "a\nb"), true, "03.04");
  equal(match("a\nb", "a*b\n"), false, "03.05");
});

test("04 - repeated stars and greedy backtracking", () => {
  equal(match("aaababc", "a*ab*abc"), true, "04.01");
  equal(match("abxxbczzcd", "ab*bc*cd"), true, "04.02");
  equal(match("zzaxxbya", "*a*b*a"), true, "04.03");
  equal(match("abxxc", "a***b****c"), true, "04.04");
  equal(match("aaaaabbbbbd", "a*b*c"), false, "04.05");
  equal(match("a", "***a***"), true, "04.06");
});

test("05 - regular-expression punctuation stays literal", () => {
  equal(match("release.2026", "release.2026"), true, "05.01");
  equal(match("releaseX2026", "release.2026"), false, "05.02");
  equal(match("a+b?(c)[d]{e}^$|.", "a+b?(c)[d]{e}^$|."), true, "05.03");
  equal(match("a+bX(c)[d]{e}^$|.", "a+b?(c)[d]{e}^$|."), false, "05.04");
  equal(match("path/to/file", "path/to/file"), true, "05.05");
  equal(match("v1.0?", "v1.0?"), true, "05.06");
  equal(match("v1.0x", "v1.0?"), false, "05.07");
});

test("06 - backslash escaping", () => {
  const slash = "\\";

  equal(match("left*right", String.raw`left\*right`), true, "06.01");
  equal(match("left-middle-right", String.raw`left\*right`), false, "06.02");
  equal(match("a\\b", String.raw`a\\b`), true, "06.03");
  equal(match("ab", String.raw`a\b`), true, "06.04");
  equal(match("a\\b", String.raw`a\b`), false, "06.05");
  equal(match("abc\\", "abc\\"), true, "06.06");
  equal(match("abc", "abc\\"), false, "06.07");
  // an even-length backslash run is all escaped pairs, so the `*` after it is
  // unescaped and stays a wildcard - see 06.35 onwards
  equal(match("*", String.raw`\\*`), false, "06.08");
  equal(match("*", String.raw`\*`), true, "06.09");
  equal(match("!", String.raw`\!`), true, "06.10");
  equal(match("!foo", String.raw`\!foo`), true, "06.11");
  equal(match("foo", String.raw`\!foo`), false, "06.12");
  equal(match("b", `${slash.repeat(1)}b`), true, "06.13");
  equal(match(`${slash}b`, `${slash.repeat(2)}b`), true, "06.14");
  equal(match(`${slash}b`, `${slash.repeat(3)}b`), true, "06.15");
  equal(match(`${slash.repeat(2)}b`, `${slash.repeat(4)}b`), true, "06.16");
  equal(match("b", `${slash.repeat(2)}b`), false, "06.17");
  equal(match("*", `${slash.repeat(1)}*`), true, "06.18");
  equal(match("*", `${slash.repeat(2)}*`), false, "06.19");
  equal(match(`${slash}*`, `${slash.repeat(3)}*`), true, "06.20");
  // four slashes are two literal backslashes, then a wildcard, so a single
  // leading backslash is one short
  equal(match(`${slash}*`, `${slash.repeat(4)}*`), false, "06.21");
  equal(match("anything", `${slash.repeat(2)}*`), false, "06.22");
  equal(match(slash, slash.repeat(1)), true, "06.23");
  equal(match(slash, slash.repeat(2)), true, "06.24");
  equal(match(slash.repeat(2), slash.repeat(3)), true, "06.25");
  equal(match(slash.repeat(2), slash.repeat(4)), true, "06.26");
  equal(match(`${slash}\n`, `${slash.repeat(1)}\n`), true, "06.27");
  equal(match("\n", `${slash.repeat(1)}\n`), false, "06.28");
  equal(match(`${slash}\n`, `${slash.repeat(2)}\n`), true, "06.29");
  equal(match(`${slash.repeat(2)}\n`, `${slash.repeat(3)}\n`), true, "06.30");
  equal(match(`${slash}\r`, `${slash.repeat(1)}\r`), true, "06.31");
  equal(match(`${slash}\u2028`, `${slash.repeat(1)}\u2028`), true, "06.32");
  equal(match(`${slash}\u2029`, `${slash.repeat(1)}\u2029`), true, "06.33");
  equal(match(`${slash}\r\n`, `${slash.repeat(1)}\r\n`), true, "06.34");

  // A backslash run before `*` follows the same rule as a run before any other
  // character: each pair is one literal backslash. An odd run has one left over
  // to escape the `*` into a literal asterisk; an even run has none, so the `*`
  // is still a wildcard. Before this was fixed an even run both dropped a
  // backslash and demoted the wildcard, so `\\*` matched only the string "*"
  // while `\\b` correctly meant backslash-then-b.
  equal(match(slash, `${slash.repeat(2)}*`), true, "06.35");
  equal(match(`${slash}abc`, `${slash.repeat(2)}*`), true, "06.36");
  equal(match(`${slash}*`, `${slash.repeat(2)}*`), true, "06.37");
  equal(match("abc", `${slash.repeat(2)}*`), false, "06.38");
  equal(match(slash.repeat(2), `${slash.repeat(4)}*`), true, "06.39");
  equal(match(`${slash.repeat(2)}xyz`, `${slash.repeat(4)}*`), true, "06.40");
  equal(match(slash, `${slash.repeat(4)}*`), false, "06.41");
  // the wildcard still spans line breaks and pairs of surrogates
  equal(match(`${slash}a\nb`, `${slash.repeat(2)}*`), true, "06.42");
  equal(match(`${slash}\u{1F600}`, `${slash.repeat(2)}*`), true, "06.43");
  // mid-pattern, not only at the end
  equal(match(`a${slash}b`, `a${slash.repeat(2)}*b`), true, "06.44");
  equal(match(`a${slash}xyzb`, `a${slash.repeat(2)}*b`), true, "06.45");
  equal(match("a*b", `a${slash.repeat(2)}*b`), false, "06.46");
});

test("07 - case sensitivity defaults to off", () => {
  equal(match("Alpha", "alpha"), true, "07.01");
  equal(match("Alpha", "alpha", {}), true, "07.02");
  equal(match("Alpha", "alpha", { caseSensitiveMatch: false }), true, "07.03");
  equal(match("Alpha", "alpha", { caseSensitiveMatch: true }), false, "07.04");
  equal(match("Alpha", "Alpha", { caseSensitiveMatch: true }), true, "07.05");
  equal(match("Ärger", "ärger"), true, "07.06");
  equal(match("MiXeD-42", "mixed-42"), true, "07.07");
  equal(match("K", "k"), false, "07.08");
  equal(match("ſ", "s"), false, "07.09");
  equal(match("ß", "SS"), false, "07.10");
  equal(match("𐐨", "𐐀"), false, "07.11");
});

test("08 - include patterns form an allow-list", () => {
  equal(match("index.js", []), false, "08.01");
  equal(match("index.js", ["*.ts", "*.js"]), true, "08.02");
  equal(match("index.js", ["*.ts", "*.json"]), false, "08.03");
  equal(match("index.js", ["index.js"]), true, "08.04");
});

test("09 - any matching negative pattern excludes", () => {
  equal(match("index.js", ["*.js", "!index.js"]), false, "09.01");
  equal(match("index.js", ["!index.js", "*.js"]), false, "09.02");
  equal(match("test-one.js", ["*.js", "!test*"]), false, "09.03");
  equal(match("index.js", ["*.js", "!test*"]), true, "09.04");
  equal(match("index.js", ["*.ts", "!test*"]), false, "09.05");
  equal(match("index.js", ["!*", "*.js"]), false, "09.06");
});

test("10 - a deny-list can stand alone", () => {
  equal(match("reports/final.csv", ["!draft-*", "!archive/*"]), true, "10.01");
  equal(match("archive/final.csv", ["!draft-*", "!archive/*"]), false, "10.02");
  equal(match("published-notes", "!draft-*"), true, "10.03");
  equal(match("draft-notes", "!draft-*"), false, "10.04");
  equal(match("", "!"), false, "10.05");
  equal(match("x", "!"), true, "10.06");
});

test("11 - pattern and options inputs are not mutated", () => {
  const patterns = Object.freeze(["*.js", "!test*"]);
  const options = Object.freeze({ caseSensitiveMatch: false });

  equal(match("index.js", patterns, options), true, "11.01");
  equal(patterns, ["*.js", "!test*"], "11.02");
  equal(options, { caseSensitiveMatch: false }, "11.03");
});

test("12 - emoji and non-ASCII text", () => {
  equal(match("😀rocket🌍", "😀*🌍"), true, "12.01");
  equal(match("😀\n🌍", "😀*🌍"), true, "12.02");
  equal(match("😀rocket", "😀*🌍"), false, "12.03");
  equal(match("東京の地図", "東*地図"), true, "12.04");
  equal(match("ПРИВЕТ", "привет"), true, "12.05");
});

test("13 - wildcards never split a surrogate pair", () => {
  const highSurrogate = "\uD83D";
  const lowSurrogate = "\uDE00";

  equal(`${highSurrogate}${lowSurrogate}`, "😀", "13.01");
  equal(match("😀", `*${lowSurrogate}`), false, "13.02");
  equal(match("😀", `${highSurrogate}*`), false, "13.03");
  equal(match("😀", "*"), true, "13.04");
  equal(match("😀🌍", "😀*🌍"), true, "13.05");
  equal(match("𐐀𐐨", "𐐀*"), true, "13.06");
  equal(match("a😀b", "a*b"), true, "13.07");
});

test("14 - adjacent wildcards are semantically idempotent", () => {
  const samples = ["", "abc", "axbyc", "a\nb\nc", "acb"];

  equal(
    samples.map((input) => match(input, "a***b**c")),
    samples.map((input) => match(input, "a*b*c")),
    "14.01",
  );
});

test("15 - long literal segments use bounded forward searches", () => {
  const asciiSegment = "ababababac";
  const unicodeSegment = `${"東西".repeat(5)}京`;

  equal(
    match(`xxabababab${asciiSegment}zz`, `*${asciiSegment}*`),
    true,
    "15.01",
  );
  equal(match("xxabababababaxzz", `*${asciiSegment}*`), false, "15.02");
  equal(
    match(`北${"東西".repeat(4)}${unicodeSegment}南`, `*${unicodeSegment}*`),
    true,
    "15.03",
  );
  equal(
    match(`北${"東西".repeat(8)}東南`, `*${unicodeSegment}*`),
    false,
    "15.04",
  );
});

test("16 - compiled paths retain the scalar contract", () => {
  const highSurrogate = "\uD83D";
  const lowSurrogate = "\uDE00";

  equal(match("a", "alphabet*omega"), false, "16.01");
  equal(match("aXXbYYc", "a*b*c", { caseSensitiveMatch: true }), true, "16.02");
  equal(
    match("left*right", String.raw`left\*right`, {
      caseSensitiveMatch: true,
    }),
    true,
    "16.03",
  );
  equal(
    match("left*right", String.raw`left\*right`, {
      caseSensitiveMatch: true,
    }),
    true,
    "16.04",
  );
  equal(match("😀", String.raw`\😀`), true, "16.05");
  equal(match("x-middle-tail", "a*b*c"), false, "16.06");
  equal(match("axc", "a*b*c"), false, "16.07");
  equal(match("東", "東*京"), false, "16.08");
  equal(match("東x図", "東*京*図"), false, "16.09");
  equal(match("東京図", ["東*阪", "東*図"]), true, "16.10");
  equal(match("ßx", "ß*"), true, "16.11");
  equal(match("ſx", "ſ*"), true, "16.12");
  equal(match("😀", `${highSurrogate}\\${lowSurrogate}`), false, "16.13");
  equal(match("alpha", ["a*", "*ha", "!omega"]), true, "16.14");
  equal(match("東x図", "東*図", { caseSensitiveMatch: true }), true, "16.15");
  equal(match("東京図", "東*京*図"), true, "16.16");
  equal(match("aXbYc", ["x*y*z", "a*b*c"]), true, "16.17");
});

test("17 - compiled-pattern reuse stays bounded", () => {
  const cacheResults = Array.from({ length: 260 }, (_, index) =>
    match(`cache-${index}*tail`, `cache-${index}\\**`),
  );
  const longLiteral = "z".repeat(1025);

  equal(cacheResults.every(Boolean), true, "17.01");
  equal(match("cache-259*tail", "cache-259\\**"), true, "17.02");
  equal(match(`${longLiteral}*`, `${longLiteral}\\*`), true, "17.03");
  equal(match(`${longLiteral}*`, `${longLiteral}\\*`), true, "17.04");
});

test("18 - fast paths reject exhausted search regions", () => {
  const firstUnicodeSegment = "東京".repeat(5);
  const secondUnicodeSegment = "大阪".repeat(5);

  equal(match("a*b", "a*b"), true, "18.01");
  equal(
    match("JKLMNOPQRxxABCDEFGHIZ", "*ABCDEFGHI*JKLMNOPQR*Z"),
    false,
    "18.02",
  );
  equal(
    match(
      `${secondUnicodeSegment}xx${firstUnicodeSegment}終`,
      `*${firstUnicodeSegment}*${secondUnicodeSegment}*終`,
    ),
    false,
    "18.03",
  );
  equal(match("😀x", "\\😀*", { caseSensitiveMatch: true }), true, "18.04");
});

test.run();
