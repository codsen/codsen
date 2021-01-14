import { Token, Layer } from "./util";

// import { matchLeft, matchRight } from "string-match-left-right";
function startsCssComment(
  str: string,
  i: number,
  _token: Token,
  _layers: Layer[],
  withinStyle: boolean
): boolean {
  return (
    // cast to bool
    withinStyle &&
    // match the / *
    ((str[i] === "/" && str[i + 1] === "*") ||
      // match the * /
      (str[i] === "*" && str[i + 1] === "/"))
  );
}

export default startsCssComment;
