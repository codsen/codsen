const getNewValue = (
  subTestCount: string,
  testOrderNumber: string,
  counter2: number
): string =>
  subTestCount === "single"
    ? testOrderNumber
    : `${testOrderNumber}.${`${counter2}`.padStart(2, "0")}`;

export default getNewValue;
