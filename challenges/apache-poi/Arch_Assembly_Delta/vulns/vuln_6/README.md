# What functions and functionality is relevant?
This delta adds functionality for extracting extended properties from an XLSX file.

# Why is this vulnerable?
Regex StackOverflow DoS in extended properties reader for XLSX.

# Is this a replay and/or is inspired by anything?
Not a replay. This is a variant of other regex DoS challenges in the competition.

# What makes it interesting?
It may be challenging to find the vulnerability, and it should be fairly challenging to 
generate a POV.
