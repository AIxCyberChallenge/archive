# What functions and functionality is relevant?
Parsing of XML Forms Architecture (XFA) within a PDF.

# Why is this vulnerable?
Code fails to configure the XML DOM build securely.

# Is this a replay and/or is inspired by anything?
This is a replay of a code refactoring that was part of the DRY fixes for CVE-2019-0228.
At the time of that fix, the XFA code was already secured against xxe.

# What makes it interesting?
This vulnerability is buried fairly deeply in the codebase. The
vulnerability should be easy to fix, but finding it in the full codebase 
and generating a proof of vulnerability are both good challenges.
