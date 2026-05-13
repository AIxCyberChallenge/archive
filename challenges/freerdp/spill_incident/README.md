# What design decisions were considered for this challenge?
The goal of this particular challenge was to not only test a CRS' ability to find a bespoke arbitrary memory write, but to also strain a CRS' ability to create a Proof of Vulnerability (PoV)--as this vulnerability is within a metadata packet parsing within a binary protocol.

# Why this set of vulnerabilities?
This vulnerability a variation on an arbitrary out-of-bounds array write, giving an attacker an arbitrary write-what-where primitive (CWE-123).

# Delta vs Full and why?
This challenge was used as a delta scan vulnerability due to the desire to provide a mixture of easy to difficult challenges to CRS', this challenge being designed to be less difficult to find.

