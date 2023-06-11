use clap::Parser;
use log::{LevelFilter, Metadata, Record};
use std::fmt::Display;
use std::path::PathBuf;

mod lines;
mod sort;

use crate::lines::LineEnding;
use crate::sort::{sort_files, SortResult};

const APP_NAME: &str = "roast";
const APP_VERSION: &str = "0.1.0";
const APP_AUTHOR: &str = "Nicholas Kress";
const APP_ABOUT: &str = "Rust implementation of jsonsort-cli";

const INDENT_SIZE_SPACE: usize = 2;
const INDENT_SIZE_TAB: usize = 1;

static LOGGER: SimpleLogger = SimpleLogger;

#[derive(Debug, Parser)]
#[command(name = APP_NAME, version = APP_VERSION, author = APP_AUTHOR, about = APP_ABOUT)]
struct Args {
    #[clap(long, short = 'a')]
    arrays: bool,

    #[clap(long, short = 'd')]
    dry: bool,

    #[clap(long = "indentationCount", short = 'i', default_value = "0")]
    indents: usize,

    #[clap(long = "lineEnding", short = 'l', default_value = LineEnding::SystemDefault.as_str())]
    #[arg(value_parser = LineEnding::from_str)]
    line_ending: LineEnding,

    #[clap(long)]
    silent: bool,

    #[clap(long, short = 's')]
    spaces: bool,

    #[clap(long, short = 'v')]
    verbose: bool,

    files: Vec<PathBuf>,
}

impl Display for Args {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> Result<(), std::fmt::Error> {
        write!(
            f,
            "Args {{
    sort arrays: {:?}
    dry run: {:?}
    indents: {:?}
    line ending: {:?}
    use spaces: {:?}
    verbose output: {:?}
}}",
            self.arrays, self.dry, self.indents, self.line_ending, self.spaces, self.verbose
        )
    }
}

struct SimpleLogger;

impl log::Log for SimpleLogger {
    fn enabled(&self, metadata: &Metadata) -> bool {
        metadata.level() <= log::max_level()
    }

    fn log(&self, record: &Record) {
        if self.enabled(record.metadata()) {
            if LevelFilter::Info != record.level() {
                print!(
                    "{} - {}:{} - ",
                    record.level(),
                    record.file().unwrap(),
                    record.line().unwrap()
                );
            }
            println!("{}", record.args());
        }
    }

    fn flush(&self) {}
}

fn sort_result_output(results: Vec<SortResult>) -> String {
    let ok_count = results.iter().filter(|r| r.success()).count();
    let fail_count = results.len() - ok_count;

    let out: String;
    if fail_count > 0 {
        out = format!(
            "{} files sorted\n{} files could not be sorted",
            ok_count, fail_count
        );
    } else if ok_count == 0 {
        out = "The inputs don't lead to any json files! Exiting.".to_string();
    } else {
        out = format!("{} files sorted", ok_count);
    }

    out
}

fn main() {
    // CLI args
    let args = Args::parse();

    // Configure logging
    log::set_logger(&LOGGER).unwrap();
    log::set_max_level(LevelFilter::Info);
    // --verbose overrides --silent
    if args.verbose {
        log::set_max_level(LevelFilter::Debug);
    } else if args.silent {
        log::set_max_level(LevelFilter::Error);
    }

    log::debug!("{}", args);

    if args.files.is_empty() {
        log::info!("The inputs don't lead to any json files! Exiting.");
        std::process::exit(1);
    }

    let indents: usize = if args.indents == 0 {
        if args.spaces {
            INDENT_SIZE_SPACE
        } else {
            INDENT_SIZE_TAB
        }
    } else {
        args.indents
    };

    let results = sort_files(
        &args.files,
        &args.line_ending,
        args.spaces,
        args.arrays,
        indents,
        args.dry,
    );

    for result in results.iter() {
        log::info!("{}", result)
    }

    log::info!("");
    if args.dry {
        log::info!("{} - DRY RUN", sort_result_output(results));
    } else {
        log::info!("{}", sort_result_output(results))
    }
}
