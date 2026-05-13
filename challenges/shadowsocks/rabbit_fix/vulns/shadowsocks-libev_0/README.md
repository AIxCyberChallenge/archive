# What functions and functionality is relevant?
json_parse_ex() in src/json.c.

# Why is this vulnerable?
"Buffer Over-read #0" is a one-byte heap based "CWE-126 Buffer Over-read" in json_parse_ex().

# Is this a replay and/or is inspired by anything?
This is not a replay.

# What makes it interesting?
This vulnerability enables denial of service by triggering a segmentation fault through a one-byte heap over-read.

