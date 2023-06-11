use std::env;

#[derive(Clone, Debug)]
pub enum LineEnding {
    SystemDefault,
    CR,
    LF,
    CRLF,
}

impl LineEnding {
    pub fn from_str(s: &str) -> Result<LineEnding, std::string::ParseError> {
        let result = match s.to_lowercase().as_str() {
            "cr" => LineEnding::CR,
            "lf" => LineEnding::LF,
            "crlf" => LineEnding::CRLF,
            _ => LineEnding::SystemDefault,
        };

        Ok(result)
    }

    pub fn as_str(&self) -> &str {
        match self {
            LineEnding::CR => "\r",
            LineEnding::LF => "\n",
            LineEnding::CRLF => "\r\n",
            LineEnding::SystemDefault => match env::consts::FAMILY {
                "linux" => LineEnding::LF.as_str(),
                "windows" => LineEnding::CRLF.as_str(),
                _ => LineEnding::LF.as_str(),
            },
        }
    }
}
