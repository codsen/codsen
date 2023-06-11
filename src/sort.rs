use regex::Regex;
use serde::ser::Serialize;
use serde_json::ser::PrettyFormatter;
use serde_json::{Serializer, Value};
use std::env;
use std::error::Error;
use std::fmt::Display;
use std::fs;
use std::path::{Path, PathBuf};
use walkdir::WalkDir;

pub use crate::lines::LineEnding;

const IGNORED_FILES: &'static [&str] = &[
    "node_modules",
    "package.json",
    "package_lock.json",
    ".DS_Store",
    "npm-debug.log",
    ".svn",
    "CVS",
    "config.gypi",
    ".lock-wscript",
    "package-lock.json",
    "npm-shrinkwrap.json",
];

#[derive(Debug)]
pub enum JsonError {
    Ignored,
    NotFound,
    ReadError,
    ParseError,
    WriteError,
    Unknown,
}

pub struct SortResult {
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
        let path_str = path_to_relative(&self.path);

        if self.success() {
            write!(f, "{} - OK", path_str)
        } else {
            write!(
                f,
                "{} - {:?}",
                path_str,
                self.error.as_ref().expect("Not possible")
            )
        }
    }
}

pub fn sort_files(
    files: &Vec<PathBuf>,
    line_ending: &LineEnding,
    use_spaces: bool,
    sort_arrays: bool,
    indents: usize,
    dry_run: bool,
) -> Vec<SortResult> {
    let mut results: Vec<SortResult> = vec![];
    for path in files {
        if path.is_dir() {
            for entry in WalkDir::new(path)
                .follow_links(true)
                .into_iter()
                .filter_map(|e| e.ok())
                .filter(|e| e.path().is_file())
            {
                let entry_path = entry.path();
                if is_ignored(&entry_path) || is_already_sorted(&entry_path, &results) {
                    continue;
                }
                if dry_run {
                    log::info!("{}", path_to_relative(&entry_path))
                } else {
                    match sort_and_save(&entry_path, use_spaces, sort_arrays, line_ending, indents)
                    {
                        Ok(_) => results.push(SortResult {
                            path: entry_path.into(),
                            error: None,
                        }),
                        Err(error) => results.push(SortResult {
                            path: entry_path.into(),
                            error: Some(error),
                        }),
                    }
                }
            }
        } else {
            if !path.exists() {
                results.push(SortResult {
                    path: path.as_path().into(),
                    error: Some(JsonError::NotFound),
                });
            }
            if is_ignored(&path) || is_already_sorted(&path, &results) {
                continue;
            }

            if dry_run {
                log::info!("{}", path_to_relative(&path))
            } else {
                match sort_and_save(&path, use_spaces, sort_arrays, line_ending, indents) {
                    Ok(_) => results.push(SortResult {
                        path: path.as_path().into(),
                        error: None,
                    }),
                    Err(error) => results.push(SortResult {
                        path: path.as_path().into(),
                        error: Some(error),
                    }),
                }
            }
        }
    }
    results
}

fn is_already_sorted(path: &Path, results: &Vec<SortResult>) -> bool {
    results.iter().any(|result| {
        result.path.exists()
            && path.exists()
            && *result.path.canonicalize().unwrap() == *path.canonicalize().unwrap()
    })
}

fn is_ignored(path: &Path) -> bool {
    if let Ok(full_path) = path.canonicalize() {
        if let Some(path_str) = full_path.to_str() {
            return IGNORED_FILES.iter().any(|f| path_str.contains(f));
        }
    }
    return false;
}

fn path_to_relative(path: &Path) -> String {
    let current = env::current_dir()
        .expect("Error getting current dir")
        .canonicalize()
        .unwrap();

    if let Ok(full) = path.canonicalize() {
        if let Some(full_str) = full.to_str() {
            return format!(".{}", full_str.replace(current.to_str().unwrap(), ""));
        }
    }

    // remove existing './' if exists in current PathBuf
    let re = Regex::new(r"^\./").unwrap();
    let _out = path.to_str().unwrap();
    let out = re.replace_all(_out, "");

    format!("./{}", out)
}

fn read_json_file(path: &Path) -> Result<Value, JsonError> {
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
            log::debug!(
                "Failed to parse json file. filename: {}, error: {}",
                filename,
                error
            );
            return Err(JsonError::ParseError);
        }
    };

    Ok(parsed)
}

fn serialize_json(
    json: &Value,
    whitespace_char: char,
    indents: usize,
) -> Result<String, Box<dyn Error>> {
    let mut buf = Vec::new();

    let indent_size = whitespace_char.to_string().repeat(indents);
    let formatter = PrettyFormatter::with_indent(indent_size.as_bytes());

    let mut ser = Serializer::with_formatter(&mut buf, formatter);
    json.serialize(&mut ser)?;

    Ok(String::from_utf8(buf)?)
}

fn sort_json_value(head: &mut Value, sort_arrays: bool) -> &mut Value {
    if !sort_arrays {
        return head;
    }

    match head {
        Value::Array(list) => {
            if sort_arrays {
                if list.iter().all(|f| f.is_string()) {
                    list.sort_by(|a, b| {
                        a.as_str()
                            .unwrap()
                            .to_lowercase()
                            .cmp(&b.as_str().unwrap().to_lowercase())
                    });
                    log::trace!("Sorted array")
                } else {
                    log::trace!("Cannot sort array containing non-strings");
                }
            }
            for item in list.iter_mut() {
                log::trace!("Sorting inner array of array");
                sort_json_value(item, sort_arrays);
            }
        }
        Value::Object(obj) => {
            log::trace!("Sorting object");
            for (key, val) in obj.iter_mut() {
                log::trace!("Sorted object value. key: {}", key);
                sort_json_value(val, sort_arrays);
            }
        }
        _ => {
            log::trace!("type already sorted")
        }
    }

    head
}

fn sort_and_save(
    path: &Path,
    use_spaces: bool,
    sort_arrays: bool,
    line_ending: &LineEnding,
    indents: usize,
) -> Result<(), JsonError> {
    let mut json: Value = read_json_file(path)?;
    sort_json_value(&mut json, sort_arrays);

    let whitespace_char = if use_spaces { ' ' } else { '\t' };
    let mut json_string = match serialize_json(&json, whitespace_char, indents) {
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
    json_string += line_ending.as_str();

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

