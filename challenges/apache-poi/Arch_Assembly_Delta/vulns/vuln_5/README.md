# What functions and functionality is relevant?
This delta adds functionality for extracting extended properties from an XLSX file.

# Why is this vulnerable?
SSRF when reading extended properties via the Streaming XSSF reader.

# Is this a replay and/or is inspired by anything?
Not a replay.

# What makes it interesting?
It should be fairly challenging to generate a POV. 
The vulnerability should be easy to find with static analysis but not with fuzzing.