import { defaults, expander, type Opts } from "string-range-expander";

const minimal: Opts = { str: "abc", from: 0, to: 1 };
const configured: Opts = {
  str: "abc",
  from: 0,
  to: 1,
  extendToOneSide: "right",
  wipeAllWhitespaceOnLeft: true,
};

expander(minimal);
expander(configured);

const defaultString: string = defaults.str;
const defaultFrom: number = defaults.from;
const defaultWipe: boolean = defaults.wipeAllWhitespaceOnLeft;
void defaultString;
void defaultFrom;
void defaultWipe;

// @ts-expect-error str is required
expander({ from: 0, to: 1 });
// @ts-expect-error from is required
expander({ str: "abc", to: 1 });
// @ts-expect-error to is required
expander({ str: "abc", from: 0 });
// @ts-expect-error all three required keys are missing
expander({});
