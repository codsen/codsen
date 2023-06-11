use std::env;

/// Character to use for newline
/// 
/// # System Defaults
/// 
/// * `unix` - LF '\n'
/// * `windows` - CRLF '\r\n'
/// 
/// Includes Mac OS CR, but SystemDefault will use LF on Mac OS by default
#[derive(Clone, Debug)]
pub enum LineEnding {
    SystemDefault,
    CR,
    LF,
    CRLF,
}

// rustc flags LineEnding::from_str as unused,
// even though it is used by clap to parse line_ending arg
#[allow(dead_code)]
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
