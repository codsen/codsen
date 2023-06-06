use serde::ser::Serialize;
use serde_json::ser::PrettyFormatter;
use serde_json::{to_string_pretty, Serializer, Map, Value};
use std::error::Error;
use std::fs;
use std::path::Path;

#[derive(Debug)]
pub enum JsonError {
    NotFound,
    ReadError,
    ParseError,
    WriteError,
    Unknown
}

pub struct Json;

impl Json {
    fn read_file(path: &str) -> Result<Map<String, Value>, JsonError> {
        if !Path::new(path).exists() {
            return Err(JsonError::NotFound);
        }
        
        let file = match fs::read_to_string(path) {
            Ok(s) => s,
            Err(error) => {
                println!("Failed to read file: {}", error);
                return Err(JsonError::ReadError);
            }
        };

        let parsed: Value = match serde_json::from_str(&file) {
            Ok(v) => v,
            Err(error) => {
                println!("Failed to parse json file. filename: {}, error: {}", path, error);
                return Err(JsonError::ParseError)
            }
        };

        let obj: Map<String, Value> = match parsed.as_object() {
            Some(m) => m.clone(), // TODO don't clone this
            None => {
                println!("Couldn't convert serde Value to Map");
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

    pub fn sort_and_save(path: &str, use_spaces: bool) -> Result<(), JsonError> {
        let json: Map<String, Value> = Json::read_file(path)?;
        
        // Both functions sort as they serialize
        let json_string: String;
        if use_spaces {
            json_string = match to_string_pretty(&json) {
                Ok(s) => s,
                Err(error) => {
                    println!("Serialization error: {}", error);
                    return Err(JsonError::WriteError);
                }

            };
        } else {
            json_string = match Json::serialize_with_tabs(&json) {
                Ok(s) => s,
                Err(error) => {
                    println!("Serialization error: {}", error);
                    return Err(JsonError::WriteError);
                }
            };
        }

        // TODO optimize this by sorting all the file contents in memory first, then saving
        match fs::write(path, json_string) {
            Ok(()) => (),
            Err(error) => {
                println!("File write error: {}", error);
                return Err(JsonError::WriteError);
            }
        };

        Ok(())
    }
}

fn main() {
    
    match Json::sort_and_save("test.json", false) {
        Ok(_) => println!("Completed successfully"),
        Err(error) => println!("Failed to sort or write file: {:?}", error)
    }
}
