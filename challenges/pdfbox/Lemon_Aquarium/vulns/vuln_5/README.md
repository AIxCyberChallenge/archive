# What functions and functionality is relevant?
Parsing a Type1 font in a PDF

# Why is this vulnerable?
The code reads a value from user input and then allocates
that amount of memory without any checks.

# Is this a replay and/or is inspired by anything?
This is inspired by the "read length then allocate" without any checks
that is common in MSOffice OLE based file formats and several
compression formats. However, this is an organic memory usage vulnerability.

# What makes it interesting?
As with the other Type1 font vulnerabilities, the POV was
fairly easily generated with a custom harness and a custom seed corpus.
However, neither of these resources were made available in the competition.
