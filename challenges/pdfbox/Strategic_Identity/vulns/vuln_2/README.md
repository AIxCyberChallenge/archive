# What functions and functionality is relevant?
This adds a new feature of an integration with tesseract.

# Why is this vulnerable?
Users are able to set the path for the tesseract executable via
a custom metadata field in the PDF file. This opens
up a command injection vulnerability.

# Is this a replay and/or is inspired by anything?
Not a replay. This was inspired by early work in
Tika, where preventing users from changing the
path of executables when running tika-server was a key security concern.

# What makes it interesting?
The unit tests require that the user is able to modify the
path for tesseract. The good patch needs to check that the
tesseract executable is called, and not some other executable.
The good patch can't simply turn off the functionality.

# Additional details
This harness requires image processing, which carries a risk of OOM vulnerabilities in Java. That is a known consideration for this challenge.
