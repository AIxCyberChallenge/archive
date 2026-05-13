# What functions and functionality is relevant?
Zip slip vulnerability in the Expander that relies on Unicode codepoints that 
when normalized enable zip slip (".." and "/").

# Why is this vulnerable?
This is vulnerable because the check for zip slip happens before the 
path normalization.

# Is this a replay and/or is inspired by anything?
Not inspired by anything, but it does sit in a ladder of zip slip challenges.

# What makes it interesting?
Fixing this should be straightforward. The challenge here is to 
create the proof-of-vulnerability, which requires fairly esoteric
"knowledge" about which unicode codepoints normalize to ".." or "/".

# Additional details
**NOTE** This will only work when the locale is "UTF-8". 
More generally, though, POSIX causes some test failures in "off the shelf" 
commons-compress -- so a locale of UTF-8 is not a stretch.
