import {
  type Matcher,
  matchLeft,
  matchLeftIncl,
  matchRight,
  matchRightIncl,
} from "string-match-left-right";

const eol = () => "EOL";
const mixedMatchers: Matcher[] = ["x", eol];

matchLeftIncl("abc", 0, mixedMatchers);
matchLeft("abc", 0, ["x", eol]);
matchRightIncl("abc", 0, ["x", eol]);
matchRight("abc", 0, ["x", eol]);
matchRightIncl("abc", 0, eol);
matchRightIncl("abc", 0, "a");

// @ts-expect-error Matcher arrays cannot contain numbers.
matchRightIncl("abc", 0, ["a", 1]);
// @ts-expect-error Matcher marker functions return strings.
matchRightIncl("abc", 0, [() => 1]);
