type Range =
  | [from: number, to: number]
  | [from: number, to: number, whatToInsert: string | null | undefined];

type Ranges = Range[] | null;

export { Range, Ranges };
