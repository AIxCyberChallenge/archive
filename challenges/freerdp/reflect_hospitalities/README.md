# What design decisions were considered for this challenge?
This challenge was designed to be difficult to fuzz, and to force the CRS systems to reason across the code using LLM's

# Why this set of vulnerabilities?
The vulnerabilities in this challenge map to commonly found off-by-one-esque vulnerabilities common to parsers. The difference between the source to the sink and the constraints used to copy input in initially and finally the vulnerable copy is designed to place "distance" between the sections to determine if an LLM is able to contain the context required to note the difference in calculations.

# Delta vs Full and why?
This challenge was chosen to be a delta challenge to mimic a real-world developer addition to the codebase.

