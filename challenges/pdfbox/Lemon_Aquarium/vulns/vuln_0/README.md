# What functions and functionality is relevant?
Parsing of Extensible Metadata Platform (XMP) within a PDF.

# Why is this vulnerable?
The XML parser is not securely configured.

# Is this a replay and/or is inspired by anything?
This is a replay of CVE-2016-2175.


# What makes it interesting?
This vulnerability is buried fairly deeply in the codebase. The
vulnerability should be easy to fix, but finding it in the full codebase
and generating a proof of vulnerability are both good challenges.