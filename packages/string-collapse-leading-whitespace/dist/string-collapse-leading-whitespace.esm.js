function collapseLeadingWhitespace(str) {
  if (typeof str === "string") {
    if (str.length === 0) {
      return "";
    } else if (str.trim() === "") {
      if (str.includes("\n")) {
        return "\n";
      }
      return " ";
    }
    let startCharacter = "";
    if (str[0].trim() === "") {
      startCharacter = " ";
      let lineBreakEncountered = false;
      for (let i = 0, len = str.length; i < len; i++) {
        if (str[i] === "\n") {
          lineBreakEncountered = true;
        }
        if (str[i].trim() !== "") {
          break;
        }
      }
      if (lineBreakEncountered) {
        startCharacter = "\n";
      }
    }
    let endCharacter = "";
    if (str.slice(-1).trim() === "") {
      endCharacter = " ";
      let lineBreakEncountered = false;
      for (let i = str.length; i--; ) {
        if (str[i] === "\n") {
          lineBreakEncountered = true;
        }
        if (str[i].trim() !== "") {
          break;
        }
      }
      if (lineBreakEncountered) {
        endCharacter = "\n";
      }
    }
    return startCharacter + str.trim() + endCharacter;
  }
  return str;
}

export default collapseLeadingWhitespace;
