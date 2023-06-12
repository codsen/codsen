use clap::Parser;
use colored::*;
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
const APP_ABOUT: &str = "Sort JSON files by key.
Rust implementation of the npm package: json-sort-cli.";

const INDENT_SIZE_SPACE: usize = 2;
const INDENT_SIZE_TAB: usize = 1;

static LOGGER: SimpleLogger = SimpleLogger;

#[derive(Debug, Parser)]
#[command(name = APP_NAME, version = APP_VERSION, author = APP_AUTHOR, about = APP_ABOUT)]
struct Args {

    /// Also sort any arrays if they contain only string elements
    #[clap(long, short = 'a')]
    arrays: bool,

    /// Only list all the files to be processed
    #[clap(long, short = 'd')]
    dry: bool,

    /// How many spaces/tabs to use (default: 2 -> spaces, 1 -> tabs)
    #[clap(long = "indentationCount", short = 'i', default_value = "0")]
    indents: usize,

    /// Set to "cr", "crlf" or "lf" to override the default
    #[clap(long = "lineEnding", short = 'l', default_value = LineEnding::SystemDefault.as_str())]
    #[arg(value_parser = LineEnding::from_str)]
    line_ending: LineEnding,

    /// Suppress output
    #[clap(long)]
    silent: bool,

    /// Use spaces for JSON file indentation (default uses tabs)
    #[clap(long, short = 's')]
    spaces: bool,

    /// Enable verbose output for debugging
    #[clap(long, short = 'v')]
    verbose: bool,

    /// Space separated list of file paths to sort. Glob patterns (files/*.json) should be expanded by your shell
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

pub struct SimpleLogger;

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
        let ok = format!("{} files sorted", ok_count).green();
        let fail = format!("{} files could not be sorted", fail_count).red();
        out = format!("{}\n{}", ok, fail).bold().to_string();
    } else if ok_count == 0 {
        out = "The inputs don't lead to any json files! Exiting.".red().to_string();
    } else {
        out = format!("{} files sorted", ok_count).green().bold().to_string();
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
        log::info!("{}", "The inputs don't lead to any json files! Exiting.".red());
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
        log::info!("{}\n{}", "--- DRY RUN ---".yellow().bold(), sort_result_output(results));
    } else {
        log::info!("{}", sort_result_output(results))
    }
}
