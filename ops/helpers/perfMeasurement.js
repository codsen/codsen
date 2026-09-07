function assertPositiveRate(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(
      `${label} must be a positive finite rate, received ${value}`,
    );
  }
}

// The injected Suite owns scheduling. This adapter does not touch files,
// process state, or benchmark defaults, and settles on actual completion.
export function measureBenchmark(Suite, name, callback) {
  return new Promise((resolve, reject) => {
    const suite = new Suite();
    let settled = false;

    function fail(error) {
      if (!settled) {
        settled = true;
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    }

    suite
      .add(name, callback)
      .on("error", (event) => {
        fail(event.target?.error || new Error(`${name} measurement failed`));
      })
      .on("abort", () => {
        fail(new Error(`${name} measurement aborted`));
      })
      .on("complete", () => {
        if (settled) return;
        try {
          const benchmark = suite[0];
          if (benchmark?.error) throw benchmark.error;
          if (suite.aborted || benchmark?.aborted) {
            throw new Error(`${name} measurement aborted`);
          }
          assertPositiveRate(benchmark?.hz, name);
          const samples = benchmark.stats?.sample?.length;
          const rme = benchmark.stats?.rme;
          if (
            !Number.isInteger(samples) ||
            samples <= 0 ||
            typeof rme !== "number" ||
            !Number.isFinite(rme) ||
            rme < 0
          ) {
            throw new Error(
              `${name} measurement has invalid sample statistics`,
            );
          }
          settled = true;
          resolve({ hz: benchmark.hz, rme, samples });
        } catch (error) {
          fail(error);
        }
      });

    try {
      suite.run({ async: true });
    } catch (error) {
      fail(error);
    }
  });
}

export async function measurePerf({
  Suite,
  callback,
  reference,
  referenceScore,
}) {
  assertPositiveRate(referenceScore, "canonical reference");
  const referenceMeasurement = await measureBenchmark(Suite, "perfRef", () => {
    reference();
  });
  const targetMeasurement = await measureBenchmark(Suite, "t1", () => {
    callback();
  });
  const score =
    (targetMeasurement.hz * referenceScore) / referenceMeasurement.hz;
  assertPositiveRate(score, "normalized target");
  return { reference: referenceMeasurement, score, target: targetMeasurement };
}
