import { version as v } from "../package.json";

const version: string = v;

function emptyCondCommentRegex(): RegExp {
  return /<!(--)?\[if[^\]]*]>[<>!-\s]*<!\[endif\]\1>/gi;
}

export { emptyCondCommentRegex, version };
