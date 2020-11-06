const cb = ({ suggested }) => {
  // console.log(`default CB called`);
  // console.log(
  //   `${`\u001b[${33}m${`suggested`}\u001b[${39}m`} = ${JSON.stringify(
  //     suggested,
  //     null,
  //     4
  //   )}`
  // );
  return suggested;
};

// default set of options
const defaultOpts = {
  trimStart: true,
  trimEnd: true,
  trimLines: false,
  trimnbsp: false,
  removeEmptyLines: false,
  limitConsecutiveEmptyLinesTo: 0,
  enforceSpacesOnly: false,
  cb,
};

const cbSchema = ["suggested", "whiteSpaceStartsAt", "whiteSpaceEndsAt", "str"];

export { defaultOpts, cbSchema };
