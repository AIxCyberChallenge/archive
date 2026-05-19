# What functions and functionality is relevant?
IsProperColorSpace function in src/cmsxform.c.

# Why is this vulnerable?
An improper use of the function IsProperColorSpace leads to poor user input sanitization, causing a buffer over-read.

# Is this a replay and/or is inspired by anything?
Yes this is a replay bug.

# What makes it interesting?
An improper use of the function IsProperColorSpace leads to poor user input sanitization, causing a buffer over-read.

