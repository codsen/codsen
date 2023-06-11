use std::fmt::format;
use std::path::PathBuf;

use criterion::BenchmarkId;
use criterion::{black_box, criterion_group, criterion_main, Criterion};

#[path = "../src/sort.rs"]
mod sort;
use crate::sort::sort_files;

#[path = "../src/lines.rs"]
mod lines;
use crate::sort::LineEnding;

const SAMPLE_SIZE: usize = 10;

fn sort_fn(c: &mut Criterion) {
    let files = vec![
        "a_1mb",
        "b_5mb",
        "c_10mb",
        "d_25mb",
    ];

    let mut group = c.benchmark_group("file_size");
    group.significance_level(0.1).sample_size(SAMPLE_SIZE);

    for test_file in files.iter() {
        group.bench_with_input(
            BenchmarkId::from_parameter(test_file), 
            test_file, 
            |b, b_test_file|{
                b.iter(|| {
                    let path = PathBuf::from(format!("./benches/data/{}.json", b_test_file));
                    if !path.exists() { panic!("Test data not found: {:?}", path.to_str()) }
                    // Fn being benchmarked
                    sort_files(
                        &black_box(vec![path.to_owned()]), 
                        black_box(&LineEnding::LF), 
                        black_box(false),
                        black_box(false),
                        black_box(1),
                        black_box(false)
                    )

                });
            }
        );
    }

    group.finish();
}

criterion_group!(benches, sort_fn);
criterion_main!(benches);