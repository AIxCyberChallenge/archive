# What functions and functionality is relevant?
This is the third of a three-part vuln series. Like 005 and 006, it is based on the custom "alliswellprotocoll", now with enhanced difficulty to test the reasoning capabilities of CRSes.

# Why is this vulnerable?
Like 005 and 006, it is a null pointer dereference once a certain state has been reached. The difference is the difficulty to reach that state.

# Is this a replay and/or is inspired by anything?
All of the "verynormalprotocol" style challenges are basically based on CTF challenges.

# What makes it interesting?
In order to reach the bug, competitors must send a buffer, and then parrot back the manipulations Curl performs on the buffer. While this is utterly trivial for a real server to do, it is a challenging test for CRSes, as they have to predict what Curl wants to be sent next, based on the initial input the CRS gave it. For example, one step of the process XORs all bytes in the string by 0x78. The next adds 0x7E to each byte (with overflow) and then left-shifts it by 2, and so on. CRSes must be able to understand this behavior and set up correct contents ahead of time before reaching the final bug.

