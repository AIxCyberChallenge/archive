# What functions and functionality is relevant?
Parsing a Type1 font embedded in a PDF.

# Why is this vulnerable?
Failure to check if next value is null.

# Is this a replay and/or is inspired by anything?
This reintroduces an infinite loop fixed on PDFBOX-5624

# What makes it interesting?
As with the other Type1 font vulnerabilities, the POV was
fairly easily generated with a custom harness and a custom seed corpus.
However, neither of these resources were made available in the competition.

Further, finding the vulnerability is non-trivial.

# Additional details
* https://issues.apache.org/jira/browse/PDFBOX-5624
* https://github.com/apache/pdfbox/commit/aa7dc6ccd1c3055b70c8084d7bf383f799047ad5
