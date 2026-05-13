# What functions and functionality is relevant?
Parsing a Type1 font embedded in a PDF.

# Why is this vulnerable?
Failure to check for null when calling "nextToken".

# Is this a replay and/or is inspired by anything?
This reintroduces an infinite loop fixed on PDFBOX-5624

# What makes it interesting?
This is similar to vuln_3, but located in a slightly different
location within the Type1Parser.

# Additional details
* https://issues.apache.org/jira/browse/PDFBOX-5624
* https://github.com/apache/pdfbox/commit/aa7dc6ccd1c3055b70c8084d7bf383f799047ad5
