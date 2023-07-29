use serde_json::ser::Formatter;
use std::io;
pub use crate::lines::LineEnding;
/// This structure pretty prints a JSON value to make it human readable.
#[derive(Clone, Debug)]
pub struct LineFormatter<'a> {
    current_indent: usize,
    has_value: bool,
    indent: &'a [u8],
    line_ending: LineEnding
}

impl<'a> LineFormatter<'a> {
    pub fn new(indent: &'a [u8], line_ending: LineEnding) -> Self {
        LineFormatter {
            current_indent: 0,
            has_value: false,
            indent,
            line_ending
        }
    }
}

impl<'a> Default for LineFormatter<'a> {
    fn default() -> Self {
        LineFormatter::new(b"  ", LineEnding::SystemDefault)
    }
}

impl<'a> Formatter for LineFormatter<'a> {
    #[inline]
    fn begin_array<W>(&mut self, writer: &mut W) -> io::Result<()>
    where
        W: ?Sized + io::Write,
    {
        self.current_indent += 1;
        self.has_value = false;
        writer.write_all(b"[")
    }

    #[inline]
    fn end_array<W>(&mut self, writer: &mut W) -> io::Result<()>
    where
        W: ?Sized + io::Write,
    {
        self.current_indent -= 1;

        if self.has_value {
            writer.write_all(self.line_ending.as_str().as_bytes())?;
            indent(writer, self.current_indent, self.indent)?;
        }

        writer.write_all(b"]")
    }

    #[inline]
    fn begin_array_value<W>(&mut self, writer: &mut W, first: bool) -> io::Result<()>
    where
        W: ?Sized + io::Write,
    {
        writer.write_all(json_ending(first, &self.line_ending).as_bytes())?;
        indent(writer, self.current_indent, self.indent)
    }

    #[inline]
    fn end_array_value<W>(&mut self, _writer: &mut W) -> io::Result<()>
    where
        W: ?Sized + io::Write,
    {
        self.has_value = true;
        Ok(())
    }

    #[inline]
    fn begin_object<W>(&mut self, writer: &mut W) -> io::Result<()>
    where
        W: ?Sized + io::Write,
    {
        self.current_indent += 1;
        self.has_value = false;
        writer.write_all(b"{")
    }

    #[inline]
    fn end_object<W>(&mut self, writer: &mut W) -> io::Result<()>
    where
        W: ?Sized + io::Write,
    {
        self.current_indent -= 1;

        if self.has_value {
            writer.write_all(self.line_ending.as_str().as_bytes())?;
            indent(writer, self.current_indent, self.indent)?;
        }

        writer.write_all(b"}")
    }

    #[inline]
    fn begin_object_key<W>(&mut self, writer: &mut W, first: bool) -> io::Result<()>
    where
        W: ?Sized + io::Write,
    {
        writer.write_all(json_ending(first, &self.line_ending).as_bytes())?;
        indent(writer, self.current_indent, self.indent)
    }

    #[inline]
    fn begin_object_value<W>(&mut self, writer: &mut W) -> io::Result<()>
    where
        W: ?Sized + io::Write,
    {
        writer.write_all(b": ")
    }

    #[inline]
    fn end_object_value<W>(&mut self, _writer: &mut W) -> io::Result<()>
    where
        W: ?Sized + io::Write,
    {
        self.has_value = true;
        Ok(())
    }
}

fn json_ending(first: bool, line_ending: &LineEnding) -> String {
    if first { 
        line_ending.as_str().to_owned()
    } else {
        format!(",{}", line_ending.as_str()).to_string()
      }
}


fn indent<W>(wr: &mut W, n: usize, s: &[u8]) -> io::Result<()>
where
    W: ?Sized + io::Write,
{
    for _ in 0..n {
        wr.write_all(s)?;
    }

    Ok(())
}