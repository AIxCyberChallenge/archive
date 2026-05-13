# What design decisions were considered for this challenge?
This is the third of a three-part vuln series. Like 005 and 006, it is based on the custom "verynormalprotocol", now with enhanced difficulty to test the reasoning capabilities of CRSes.

Like 005 and 006, it is a null pointer dereference once a certain state has been reached. The difference is the difficulty to reach that state.

In order to reach the bug, competitors must send a buffer, and then parrot back the manipulations Curl performs on the buffer. While this is utterly trivial for a real server to do, it is a challenging test for CRSes, as they have to predict what Curl wants to be sent next, based on the initial input the CRS gave it. For example, one step of the process XORs all bytes in the string by 0x78. The next adds 0x7E to each byte (with overflow) and then left-shifts it by 2, and so on. CRSes must be able to understand this behavior and set up correct contents ahead of time before reaching the final bug.

This vulnerability exposes an incorrect SARIF report. The report is wildly incorrect and points to Curls HTTP handler.

# Why this set of vulnerabilities?
curl-006, 007, and 008 are all evolutions of curl-005, intended to incrementally test competitors abilities with increasing difficulty. As such, they are all staged in their own challenges.

# Delta vs Full and why?
All "verynormalprotocol" vulns are delta scan challenges.

