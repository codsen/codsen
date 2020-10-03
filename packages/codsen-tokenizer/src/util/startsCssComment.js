// import { matchLeft, matchRight } from "string-match-left-right";

function startsCssComment(str, i, token, layers, withinStyle) {
  return (
    // cast to bool
    withinStyle &&
    // match the /*
    ((str[i] === "/" && str[i + 1] === "*") ||
      // match the */
      (str[i] === "*" && str[i + 1] === "/"))
  );
}

export default startsCssComment;
