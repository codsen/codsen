use serde::ser::Serialize;
use serde_json::ser::PrettyFormatter;
use serde_json::{to_string_pretty, Serializer, Map, Value};
use std::error::Error;
use std::fs;

pub struct Json;

impl Json {
    fn read_file(path: &str) -> Result<Map<String, Value>, Box<dyn Error>> {
        let config = fs::read_to_string(path)?;
        let parsed: Value = serde_json::from_str(&config)?;
        let obj: Map<String, Value> = parsed.as_object().unwrap().clone();
        Ok(obj)
    }

    fn serialize_with_tabs(json: &Map<String, Value>) -> Result<String, Box<dyn Error>> {
        let mut buf = Vec::new();
        let formatter = PrettyFormatter::with_indent(b"\t");
        let mut ser = Serializer::with_formatter(&mut buf, formatter);
        json.serialize(&mut ser)?;

        Ok(String::from_utf8(buf)?)
    }

    pub fn sort_and_save(path: &str, use_spaces: bool) -> Result<(), Box<dyn Error>> {
        let json: Map<String, Value> = Json::read_file(path)?;
        
        // Both functions sort as they serialize
        let json_string: String;
        if use_spaces {
            json_string = to_string_pretty(&json)?;
        } else {
            json_string = Json::serialize_with_tabs(&json)?;
        }

        // TODO optimize this by sorting all the file contents in memory first, then saving
        fs::write(path, json_string)?;

        Ok(())
    }
}

fn main() {
    
    match Json::sort_and_save("test.json", false) {
        Ok(_) => println!("Completed successfully"),
        Err(error) => panic!("Failed to sort or write file: {}", error)
    }
}
