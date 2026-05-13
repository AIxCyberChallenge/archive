# What functions and functionality is relevant?
This defect exists in some initial code developed to handle IPv4 Internet Protocol Options.

# Why is this vulnerable?
The current net_builtin.c code assumes that there are no IPv4 Internet Protocol Options, and that the header is a fixed 20 bytes.

# Is this a replay and/or is inspired by anything?
This is not a replay.

# What makes it interesting?
In computing the new IP payload offset when there are Internet Protocol Options present, the current packet size range check is no longer a valid test.
Therefore, it can lead to a read buffer overflow on the packet data.

