# What functions and functionality is relevant?
This targets the Expander and adds a new feature to 
handle symlinks in zip files.

# Why is this vulnerable?
This is vulnerable because the check for writing directories
and files does not correctly prevent symlinked files from
escaping the target directory.

# Is this a replay and/or is inspired by anything?
Symlink zip slips are quite common across a number of libraries.
For example: https://security.snyk.io/vuln/SNYK-COCOAPODS-SSZIPARCHIVE-3225821
This description is helpful: https://blog.pentesteracademy.com/from-zip-slip-to-system-takeover-8564433ea542

# What makes it interesting?
This requires "reasoning" about symlinks and checking that writes do
not escape the target directory. This is the most challenging
in the ladder of commons-compress zip slip challenges.
