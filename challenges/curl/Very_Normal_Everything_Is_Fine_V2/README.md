# What design decisions were considered for this challenge?
This is the second in a series of three bugs intended to observe competitors basic abilities. Like curl-005 before it, it is based on the custom "verynormalprotocol", now enhanced with greater difficulty to reach the offending code.

Like curl-005, the bug will dereference a null pointer when a certain point is reached. Previously, a competitor only had to send one hardcoded server response to trigger the bug; this time, however, they will have to send four hardcoded responses.

# Why this set of vulnerabilities?
curl-006, 007, and 008 are all evolutions of curl-005, intended to incrementally test competitors abilities with increasing difficulty. As such, they are all staged in their own challenges.

# Delta vs Full and why?
All "verynormalprotocol" vulns are delta scan challenges.

