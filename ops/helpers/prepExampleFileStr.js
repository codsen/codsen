function removeRelPaths(str) {
  // console.log(`002 removeRelPaths IN: ${str}`);
  let res = str
    .replace(/(?:\.\.\/)+dist\/([^.]+)\.esm(\.\w+)?/, "$1")
    .replace(/(?:\.\.\/)+[^/]+\/dist\/([^.]+)\.esm(\.\w+)?/, "$1")
    .replace(/"(?:\.\.\/)+/g, '"')
    .replace(/\/dist\/[^.]+\.esm\.js/g, "");
  // console.log(`008 removeRelPaths OUT: ${res}`);
  return res;
}

function prepExampleFileStr(originalStr) {
  // contingencies
  if (!originalStr.includes("import")) {
    throw new Error(`prepExampleFileStr: no import in:\n${originalStr}\n\n\n`);
  }
  let lines = originalStr
    .trim()
    .split(/(\r?\n)/)
    .filter((s) => s !== "\n" && s !== "\r\n");

  let title = "";
  let res = "";

  // flags
  let titleFound = false;
  let codeStarted = false;

  let oneLineBefore;
  let twoLinesBefore;

  for (let i = 0, len = lines.length; i < len; i++) {
    // console.log(`\n\n\n${`\u001b[${35}m${`-`.repeat(80)}\u001b[${39}m`}${i}`);
    // console.log(JSON.stringify(lines[i], null, 0));
    // console.log(
    //   `044 twoLinesBefore=${JSON.stringify(twoLinesBefore, null, 4)};`
    // );
    // console.log(`046 oneLineBefore=${JSON.stringify(oneLineBefore, null, 4)};`);
    // console.log(`${`\u001b[${36}m${`-`.repeat(80)}\u001b[${39}m`}`);

    // catch the title
    if (!codeStarted && !titleFound && lines[i].startsWith("//")) {
      titleFound = true;
      // console.log(
      //   `053 ${`\u001b[${32}m${`SET`}\u001b[${39}m`} ${`\u001b[${33}m${`titleFound`}\u001b[${39}m`} = ${JSON.stringify(
      //     titleFound,
      //     null,
      //     4
      //   )}`
      // );
      title = lines[i].slice(2).trim();
      // console.log(`${`\u001b[${31}m${`CONTINUE`}\u001b[${39}m`}`);
      continue;
    }

    if (!codeStarted && lines[i].startsWith("/* eslint")) {
      // console.log(`${`\u001b[${31}m${`CONTINUE`}\u001b[${39}m`}`);
      continue;
    }

    // remove double line breaks
    if (
      // either line is not empty
      lines[i].trim() ||
      twoLinesBefore === undefined ||
      // or both two lines before are not empty
      !(!twoLinesBefore.trim() && !oneLineBefore.trim())
    ) {
      let lineBreak = res.endsWith("\n\n") ? "" : "\n";

      // process the import relative paths
      res += `${lineBreak}${removeRelPaths(lines[i])}`;

      // console.log(
      //   `${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${JSON.stringify(
      //     res,
      //     null,
      //     4
      //   )}`
      // );
    } else {
      // console.log(`090 ${`\u001b[${31}m${`CONTINUE`}\u001b[${39}m`}`);
      continue;
    }

    twoLinesBefore = oneLineBefore;
    oneLineBefore = lines[i];
  }

  res = res.trim();

  // console.log(
  //   `101 ${`\u001b[${32}m${`FINAL`}\u001b[${39}m`}: \n\n${`\u001b[${33}m${`res`}\u001b[${39}m`} = ${res}\n\n${`\u001b[${33}m${`title`}\u001b[${39}m`} = ${JSON.stringify(
  //     title,
  //     null,
  //     4
  //   )}\n\n`
  // );

  return { str: res, title };
}

export { prepExampleFileStr };
