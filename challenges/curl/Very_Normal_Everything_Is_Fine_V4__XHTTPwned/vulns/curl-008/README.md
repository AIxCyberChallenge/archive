# What functions and functionality is relevant?

curl-008 is the final bug in the "extremelygoodprtcl" series specifically designed to test competitors abilities. It is an extension of curl-007, which worked by asking a CRS to mimic a series of manipulations on input data; see that documentation for details. 

# What makes it interesting?

This time, however, the CRS must perform just one manipulation— successfully encrypt the input with AES-CBC-256 given a hardcoded key and value, and then send that encrypted value encoded into base64. 

This is intended to be an extreme test case for a CRSes adaptation, reasoning, and tool-usage abilities, hence the difficulty level of "maniac".

# Why this set of vulnerabilities?
curl-006, 007, and 008 are all evolutions of curl-005, intended to incrementally test competitors abilities with increasing difficulty. As such, they are all staged in their own challenges.

# Delta vs Full and why?
All "verynormalprotocol" vulns are delta scan challenges.

