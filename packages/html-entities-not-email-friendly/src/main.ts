import {
  notEmailFriendlyLowercaseSetOnly,
  notEmailFriendlyMaxLength,
  notEmailFriendlyMinLength,
  notEmailFriendlySetOnly,
} from "./generated";
import notEmailFriendlyJson from "./notEmailFriendly.json";

declare let DEV: boolean;
export interface Obj {
  [key: string]: any;
}

const notEmailFriendly: Obj = notEmailFriendlyJson;

DEV &&
  console.log(
    `notEmailFriendly - total keys: ${Object.keys(notEmailFriendly).length}`,
  );
DEV &&
  console.log(
    `notEmailFriendlySetOnly - total size: ${notEmailFriendlySetOnly.size}`,
  );
DEV &&
  console.log(
    `notEmailFriendlyLowercaseSetOnly - total size: ${notEmailFriendlyLowercaseSetOnly.size}`,
  );

// -------------------------------------------------------------------------

export {
  notEmailFriendly,
  notEmailFriendlyLowercaseSetOnly,
  notEmailFriendlyMaxLength,
  notEmailFriendlyMinLength,
  notEmailFriendlySetOnly,
};
