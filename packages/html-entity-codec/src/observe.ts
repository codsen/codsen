export interface Completion {
  inputLength: number;
  outputLength: number;
  replacements: number;
  timeTakenInMilliseconds: number;
}

export interface ObserveOptions {
  /** Receives monotonic percentages from 0 to 100. */
  reportProgressFunc?: (percentage: number) => void;
  /** Receives completion statistics; the transformed string remains the return value. */
  reportCompletionFunc?: (completion: Completion) => void;
}

export function observer(str: string, opts: ObserveOptions) {
  const progress = opts.reportProgressFunc;
  const completion = opts.reportCompletionFunc;
  const started = completion ? Date.now() : 0;
  let last = 0;
  progress?.(0);
  return {
    advance: progress
      ? (offset: number) => {
          const percentage = Math.min(
            99,
            Math.floor((offset * 100) / str.length),
          );
          if (percentage > last) {
            last = percentage;
            progress(percentage);
          }
        }
      : undefined,
    finish(result: string, replacements: number) {
      progress?.(100);
      completion?.({
        inputLength: str.length,
        outputLength: result.length,
        replacements,
        timeTakenInMilliseconds: Date.now() - started,
      });
      return result;
    },
  };
}

export function assertString(str: string, name: string): void {
  if (typeof str !== "string") {
    throw new TypeError(
      `html-entity-codec/${name}(): [THROW_ID_01] The input must be a string.`,
    );
  }
}
