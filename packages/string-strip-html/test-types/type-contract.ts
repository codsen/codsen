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

export function rejectSnapshotMutation(event: CbObj): void {
  // @ts-expect-error Callback token coordinates are readonly snapshots.
  event.tag.start = 0;
  // @ts-expect-error Callback scalar fields are readonly snapshots.
  event.deleteFrom = 0;

  if (event.tag.kind === "tag") {
    // @ts-expect-error Callback tag names are readonly snapshots.
    event.tag.name = "changed";
    if (event.tag.status === "complete") {
      // @ts-expect-error Physical bracket coordinates are readonly snapshots.
      event.tag.lastClosingBracketAt = 0;
      // @ts-expect-error Callback attribute collections are readonly snapshots.
      event.tag.attributes.push({ name: "changed" });
      const firstAttribute = event.tag.attributes[0];
      if (firstAttribute) {
        // @ts-expect-error Nested attribute metadata is readonly.
        firstAttribute.name = "changed";
      }
    }
  }

  if (event.proposedReturn) {
    // @ts-expect-error Proposal tuples are readonly snapshots.
    event.proposedReturn[0] = 0;
    event.rangesArr.push(...event.proposedReturn);
  }
}
