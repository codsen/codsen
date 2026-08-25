import type { CallbackToken, CbObj } from "../src/main";

function assertNever(value: never): never {
  throw new TypeError(`Unexpected callback token: ${JSON.stringify(value)}`);
}

export function describeToken(token: CallbackToken): string {
  switch (token.kind) {
    case "tag": {
      switch (token.status) {
        case "complete":
          return `${token.name}:${token.lastOpeningBracketAt}-${token.lastClosingBracketAt}`;
        case "incomplete":
          return `${token.name}:${token.lastOpeningBracketAt}-EOF`;
        case "inferred":
          return `${token.name}:${token.start}-${token.end}`;
        default:
          return assertNever(token);
      }
    }
    case "comment":
      return `comment:${token.start}-${token.end}`;
    case "cdata":
      return `cdata:${token.start}-${token.end}`;
    default:
      return assertNever(token);
  }
}

export function rejectUnsafeNamedAccess(token: CallbackToken): string {
  // @ts-expect-error Only ordinary and inferred tag variants have a name.
  return token.name.toLowerCase();
}

export function forwardProposal(event: CbObj): void {
  if (event.proposedReturn) {
    event.rangesArr.push(...event.proposedReturn);
  }
}
