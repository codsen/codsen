use clap::Parser;
use log::{Record, LevelFilter, Metadata};
use serde::ser::Serialize;
use serde_json::ser::PrettyFormatter;
use serde_json::{to_string_pretty, Serializer, Map, Value};
use std::error::Error;
use std::fs;
use std::fmt::Display;
use std::path::Path;
use std::path::PathBuf;


const APP_NAME: &str = "jsonsort";
const APP_VERSION: &str = "0.1.0";
const APP_AUTHOR: &str = "Nicholas Kress";
const APP_ABOUT: &str = "Rust implementation of jsonsort-cli";

#[derive(Debug, Parser)]
#[command(name = APP_NAME, version = APP_VERSION, author = APP_AUTHOR, about = APP_ABOUT)]
pub struct Args {
    #[clap(long, short = 'd')]
    dry: bool,

    #[clap(long, short = 's')]
    spaces: bool,

    #[clap(long, short = 'v')]
    verbose: bool,

    files: Vec<PathBuf>,
}



struct SimpleLogger;

impl log::Log for SimpleLogger {
    fn enabled(&self, metadata: &Metadata) -> bool {
        metadata.level() <= log::max_level()
    }

    fn log(&self, record: &Record) {
        if self.enabled(record.metadata()) {
            println!("{} - {}", record.level(), record.args());
        }
    }

    fn flush(&self) {}
}

#[derive(Debug)]
pub enum JsonError {
    NotFound,
    ReadError,
    ParseError,
    WriteError,
    Unknown
}

pub struct SortResult {
    path: String,
    error: Option<JsonError>,
}

impl SortResult {
    pub fn success(&self) -> bool {
        self.error.is_none()
    }
}

impl Display for SortResult {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        if self.success() {
            write!(f, "{} - Success", self.path)
        } else {
            write!(f, "{} - Failed: {:?}", self.path, self.error.as_ref().expect("Not possible"))
        }
    }
}

pub struct Json;

impl Json {
    fn read_file(path: &Path) -> Result<Map<String, Value>, JsonError> {
        if !path.exists() {
            log::debug!("File does not exist");
            return Err(JsonError::NotFound);
        }

        let file = match fs::read_to_string(path) {
            Ok(s) => s,
            Err(error) => {
                log::debug!("Failed to read file: {}", error);
                return Err(JsonError::ReadError);
            }
        };

        let parsed: Value = match serde_json::from_str(&file) {
            Ok(v) => v,
            Err(error) => {
                let filename = path.as_os_str().to_str().unwrap();
                log::debug!("Failed to parse json file. filename: {}, error: {}", filename, error);
                return Err(JsonError::ParseError)
            }
        };

        let obj: Map<String, Value> = match parsed.as_object() {
            Some(m) => m.clone(), // TODO don't clone this
            None => {
                log::debug!("Couldn't convert serde Value to Map");
                return Err(JsonError::Unknown)
            }
        };

        Ok(obj)
    }

    fn serialize_with_tabs(json: &Map<String, Value>) -> Result<String, Box<dyn Error>> {
        let mut buf = Vec::new();
        let formatter = PrettyFormatter::with_indent(b"\t");
        let mut ser = Serializer::with_formatter(&mut buf, formatter);
        json.serialize(&mut ser)?;

        Ok(String::from_utf8(buf)?)
    }

    pub fn sort_and_save(path: &Path, use_spaces: bool) -> Result<(), JsonError> {
        let json: Map<String, Value> = Json::read_file(path)?;
        
        // Both functions sort as they serialize
        let json_string: String;
        if use_spaces {
            json_string = match to_string_pretty(&json) {
                Ok(s) => s,
                Err(error) => {
                    log::debug!("Serialization error: {}", error);
                    return Err(JsonError::WriteError);
                }

            };
        } else {
            json_string = match Json::serialize_with_tabs(&json) {
                Ok(s) => s,
                Err(error) => {
                    log::debug!("Serialization error: {}", error);
                    return Err(JsonError::WriteError);
                }
            };
        }

        // TODO optimize this by sorting all the file contents in memory first, then saving
        match fs::write(path, json_string) {
            Ok(()) => (),
            Err(error) => {
                log::debug!("File write error: {}", error);
                return Err(JsonError::WriteError);
            }
        };

        Ok(())
    }
}

static LOGGER: SimpleLogger = SimpleLogger;

fn main() {
    // CLI args
    let args = Args::parse();
    
    // Configure logging
    log::set_logger(&LOGGER).unwrap();
    log::set_max_level(LevelFilter::Info);
    if args.verbose {
        log::set_max_level(LevelFilter::Debug);
    }

    // Main loop
    let paths = args.files.iter().map(|p| p.as_path());
    let mut results: Vec<SortResult> = vec!();
    for path in paths {
        let path_str = path.as_os_str().to_str().unwrap();
        if args.dry {
            println!("{}", path_str);
        } else {
            match Json::sort_and_save(path, args.spaces) {
                Ok(_) => results.push(SortResult{path : path_str.to_string(), error: None}),
                Err(error) => results.push(SortResult { path: path_str.to_string(), error: Some(error) })
            }
        }
    }

    for result in results.iter() {
        println!("{}", result)
    }
}
