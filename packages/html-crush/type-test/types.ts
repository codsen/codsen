import { crush, type InputOpts } from "html-crush";

const supportedInputs: InputOpts[] = [
  { breakToTheLeftOf: [] },
  { breakToTheLeftOf: false },
  { breakToTheLeftOf: null },
  { reportProgressFunc: null },
  { reportProgressFunc: false },
  { reportProgressFunc: 0 },
  { reportProgressFunc: () => {} },
];

for (const opts of supportedInputs) {
  crush("<p>test</p>", opts);
}

crush("<p>test</p>", null);
