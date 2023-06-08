use clap::Parser;
use log::{Record, LevelFilter, Metadata};
use regex::Regex;
use serde::ser::Serialize;
use serde_json::ser::PrettyFormatter;
use serde_json::{to_string_pretty, Serializer, Value};
use std::error::Error;
use std::{fs, env};
use std::fmt::Display;
use std::path::Path;
use std::path::PathBuf;
use walkdir::WalkDir;


const APP_NAME: &str = "jsonsort";
const APP_VERSION: &str = "0.1.0";
const APP_AUTHOR: &str = "Nicholas Kress";
const APP_ABOUT: &str = "Rust implementation of jsonsort-cli";

#[derive(Debug, Parser)]
#[command(name = APP_NAME, version = APP_VERSION, author = APP_AUTHOR, about = APP_ABOUT)]
pub struct Args {
    #[clap(long, short = 'a')]
    arrays: bool,

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
            println!("{}:{} - {}", 
                record.file().unwrap(), 
                record.line().unwrap(), 
                record.args()
            );
        }
    }

    fn flush(&self) {}
}

#[derive(Debug)]
pub enum JsonError {
    Ignored,
    NotFound,
    ReadError,
    ParseError,
    WriteError,
    Unknown
}

pub struct SortResult{
    path: Box<Path>,
    error: Option<JsonError>,
}

impl SortResult {
    pub fn success(&self) -> bool {
        self.error.is_none()
    }
}

impl<'a> Display for SortResult {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let path_str = relative_path_str(&self.path);

        if self.success() {
            write!(f, "{} - OK", path_str)
        } else {
            write!(f, "{} - {:?}", path_str, self.error.as_ref().expect("Not possible"))
        }
    }
}

pub struct Json;

impl Json {
    fn read_file(path: &Path) -> Result<Value, JsonError> {
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

        Ok(parsed)
    }

    fn serialize_with_tabs(json: &Value) -> Result<String, Box<dyn Error>> {
        let mut buf = Vec::new();
        let formatter = PrettyFormatter::with_indent(b"\t");
        let mut ser = Serializer::with_formatter(&mut buf, formatter);
        json.serialize(&mut ser)?;

        Ok(String::from_utf8(buf)?)
    }

    fn sort_value(head: &mut Value, sort_arrays: bool) {
        match head {
            Value::Array(list) => {
                if sort_arrays {
                    if list.iter().all(|f| f.is_string()) {
                        list.sort_by(|a, b| 
                            a.as_str().unwrap().cmp(b.as_str().unwrap())
                        );
                        log::debug!("Sorted array")
                    }
                    else {
                        log::debug!("Cannot sort array containing non-strings");
                    }
                }
                
            }
            _ => log::debug!("type '{:?}' already sorted", head)
        }
    }

    pub fn sort_and_save(path: &Path, use_spaces: bool, sort_arrays: bool) -> Result<(), JsonError> {
        let mut json: Value = Json::read_file(path)?;
        Json::sort_value(&mut json, sort_arrays);
        
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

const IGNORED_FILES: &'static [&str] = &[
    "node_modules", 
    "package.json",
    "package_lock.json"
];

fn is_ignored(path: &PathBuf) -> bool {
    if let Ok(full_path) = path.canonicalize() {
        if let Some(path_str) = full_path.to_str() {
            return IGNORED_FILES.iter().any(|f| path_str.contains(f));
        }
    }
    return false;
}

fn relative_path_str(path: &Path) -> String {
    let current = env::current_dir()
                                .expect("Error getting current dir")
                                .canonicalize()
                                .unwrap();

    if let Ok(full) = path.canonicalize() {
        if let Some(full_str) = full.to_str() {
            return format!(".{}", full_str.replace(current.to_str().unwrap(), ""))
        }
    }

    // remove existing './' if exists in current PathBuf
    let re = Regex::new(r"^\./").unwrap();
    let _out = path.to_str().unwrap();
    let out = re.replace_all(_out, "");
    
    format!("./{}", out)
}

fn sort_result_output(results: Vec<SortResult>) -> String {
    let ok_count = results.iter()
                                 .filter(|r| r.success())
                                 .count();
    let fail_count = results.len() - ok_count;
    
    let mut out = format!("{} files sorted", ok_count);
    if fail_count > 0 {
        out.push_str(format!("\n{} files could not be sorted", fail_count).as_str())
    }
    
    out
}


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
    let paths_santised = args.files
        .iter()
        .filter(|p| !is_ignored(p));


    let mut results: Vec<SortResult> = vec!();
    for path in paths_santised {
        if path.is_dir() {
            for entry in WalkDir::new(path)
                                                    .follow_links(true)
                                                    .into_iter()
                                                    .filter_map(|e| e.ok())
                                                    .filter(|e| e.path().is_file())                                                      {
                let entry_path = entry.path();
                if args.dry {
                    println!("{}", relative_path_str(entry_path))
                } else {
                    match Json::sort_and_save(&entry_path, args.spaces, args.arrays) {
                        Ok(_) => results.push(SortResult{ path: entry_path.into(), error: None}),
                        Err(error) => results.push(SortResult { path: entry_path.into(), error: Some(error) })
                    }
                }
            }
        } else {
            if args.dry {
                println!("{}", relative_path_str(path))
            } else {
                match Json::sort_and_save(path, args.spaces, args.arrays) {
                    Ok(_) => results.push(SortResult{ path: path.as_path().into(), error: None}),
                    Err(error) => results.push(SortResult { path: path.as_path().into(), error: Some(error) })
                }
            }
        }
    }

    for result in results.iter() {
        println!("{}", result)
    }

    println!("");
    if args.dry {
        println!("{} - DRY RUN", sort_result_output(results));
    } else {
        println!("{}", sort_result_output(results))
    }
}
