import notEmailFriendly from "./notEmailFriendly.json";

// const notEmailFriendlyMinLength = Math.min(
//   ...Object.keys(notEmailFriendly).map(entName => entName.length)
// );
// const notEmailFriendlyMaxLength = Math.max(
//   ...Object.keys(notEmailFriendly).map(entName => entName.length)
// );

const notEmailFriendlyMinLength = 2;
const notEmailFriendlyMaxLength = 31;

// console.log(
//   `notEmailFriendlyMinLength = ${notEmailFriendlyMinLength}; notEmailFriendlyMaxLength = ${notEmailFriendlyMaxLength}`
// );

// -------------------------------------------------------------------------

export {
  notEmailFriendly,
  notEmailFriendlyMinLength,
  notEmailFriendlyMaxLength,
};
