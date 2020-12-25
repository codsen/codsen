import { version } from "../package.json";

function emptyCondCommentRegex(): RegExp {
  return /<!(--)?\[if[^\]]*]>[<>!-\s]*<!\[endif\]\1>/gi;
}

export { emptyCondCommentRegex, version };
