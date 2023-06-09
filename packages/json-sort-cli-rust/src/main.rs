use clap::Parser;
use log::{Record, LevelFilter, Metadata};
use regex::Regex;
use serde::ser::Serialize;
use serde_json::ser::PrettyFormatter;
use serde_json::{Serializer, Value};
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

    #[clap(long = "indentationCount", short = 'i', default_value = "0")]
    indents: usize,

    #[clap(long = "lineEnding", short = 'l', default_value = LineEnding::SystemDefault.as_str())]
    #[arg(value_parser = LineEnding::from_str)]
    line_ending: LineEnding,

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
    line ending: {:?}
    use spaces: {:?}
    verbose output: {:?}
}}", 
            self.arrays, 
            self.dry, 
            self.line_ending, 
            self.spaces,
            self.verbose 
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

#[derive(Clone, Debug)]
enum LineEnding {
    SystemDefault,
    LF,
    CRLF
}

impl LineEnding {
    pub fn from_str(s: &str) -> Result<LineEnding, std::string::ParseError> {
        let result = match s.to_lowercase().as_str() {
            "lf" => LineEnding::LF,
            "crlf" => LineEnding::CRLF, 
            _ => LineEnding::SystemDefault
        };

        Ok(result)
    }

    pub fn as_str(&self) -> &str {
        match self {
            LineEnding::LF => "\n",
            LineEnding::CRLF => "\r\n",
            LineEnding::SystemDefault => {
                match env::consts::FAMILY {
                    "linux" => LineEnding::LF.as_str(),
                    "windows" => LineEnding::CRLF.as_str(),
                    _ => LineEnding::LF.as_str()
                }
            },
        }
    }
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

    fn serialize(json: &Value, whitespace_char: char, indents: usize) -> Result<String, Box<dyn Error>> {
        let mut buf = Vec::new();
        
        let indent_size = whitespace_char.to_string().repeat(indents);
        let formatter = PrettyFormatter::with_indent(indent_size.as_bytes());

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
            _ => log::debug!("type already sorted")
        }
    }

    fn sort_and_save(path: &Path, use_spaces: bool, sort_arrays: bool, line_ending: &LineEnding, indents: usize) -> Result<(), JsonError> {
        let mut json: Value = Json::read_file(path)?;
        Json::sort_value(&mut json, sort_arrays);
        
        let whitespace_char = if use_spaces { ' ' } else { '\t' };
        let mut json_string = match Json::serialize(&json, whitespace_char, indents) {
                Ok(s) => s,
                Err(error) => {
                    log::debug!("Serialization error: {}", error);
                    return Err(JsonError::WriteError);
                }
            };

        // TODO optimize - replace in place without allocating new string - [char] maybe
        // Apply desired line ending to output
        json_string = json_string.replace(LineEnding::CRLF.as_str(), line_ending.as_str());
        json_string = json_string.replace(LineEnding::LF.as_str(), line_ending.as_str());

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

const INDENT_SIZE_SPACE: usize = 4;
const INDENT_SIZE_TAB: usize = 1;

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

    log::debug!("{}", args);

    if args.files.is_empty() {
        println!("No input files specified");
        std::process::exit(1);
    }

    // Main loop
    let paths_santised = args.files
        .iter()
        .filter(|p| !is_ignored(p));

    let indents: usize = if args.indents == 0 {
        if args.spaces { 
            INDENT_SIZE_SPACE
        } else { 
            INDENT_SIZE_TAB 
        }
    } else {
        args.indents
    };


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
                    match Json::sort_and_save(
                        &entry_path, 
                        args.spaces, 
                        args.arrays, 
                        &args.line_ending,
                        indents
                    ) {
                        Ok(_) => results.push(SortResult{ path: entry_path.into(), error: None}),
                        Err(error) => results.push(SortResult { path: entry_path.into(), error: Some(error) })
                    }
                }
            }
        } else {
            if args.dry {
                println!("{}", relative_path_str(path))
            } else {
                match Json::sort_and_save(
                    path, 
                    args.spaces, 
                    args.arrays, 
                    &args.line_ending,
                    indents,
                ) {
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
