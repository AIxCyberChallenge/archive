# What functions and functionality is relevant?
Parsing Printer Font Binary (PFB) Type 1 fonts within a PDF.

# Why is this vulnerable?
Integer overflow in a check that is intended to prevent an Out-of-memory allocation.
With a very small crafted file, the parser can allocate 2gb of memory.

# Is this a replay and/or is inspired by anything?
This is an organic vulnerability. It is based on read-length-then-allocate
vulnerabilities that are common in other file formats. The twist to this
is that there was an incorrect fix to add a heuristic record limit, but
that fix, in turn, fails to account for integer overflow. There
was no check in the actual PDFBox codebase.

# What makes it interesting?
As with the other Type1 font vulnerabilities, the POV was 
fairly easily generated with a custom harness and a custom seed corpus.
However, neither of these resources were made available in the competition.
So, generating the POV is challenging. Finding the vulnerability 
should be straight forward with static analysis, but it would be very
difficult to find via fuzzing with the harnesses supplied during the competition.

# Additional details
* https://issues.apache.org/jira/browse/PDFBOX-6044