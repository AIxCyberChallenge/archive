# What functions and functionality is relevant?
This affects a tool for developers that extracts the contents of OLE2 files.

# Why is this vulnerable?
There's no check on the file name within the OLE2 container, and the file
is then extracted based on the user-generated file name, which opens a
path traversal vulnerability.

# Is this a replay and/or is inspired by anything?
This is an organic vulnerability, discovered by analyzing zip slip patterns in Apache POI based on experience with similar patterns in commons-compress and Apache Tika.

# What makes it interesting?
Generating the POV for this is non-trivial. This is similar to other path traversal vulns in other repos in the challenges in semi-finals and finals. Notably, this is an organic vulnerability — no LLM could have "memorized" a bug report for it.

# Additional details
The code required minor modifications for the competition harness. This is an organic vulnerability.
