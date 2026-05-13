# What functions and functionality is relevant?
The `dissect_bat_vis_v24` function contained within `epan/dissectors/packet-bat.c` is where the format string vulnerability is first initially set up. Later on during output (line 705) the vulnerability is triggered.

# Why is this vulnerable?
This is vulnerable due to how libc processes format strings: by passing a pointer to a buffer without a format, the way libc determines the format is to treat the pointer supplied as the actual format string. This is problematic when it is user / attacker controlled, as the format string can contain things like stack printing & modification (e.g. %x), stack pointer dereference and writes (like %n) and and a few other nasty tricks that allows for an attacker to construct a string that will write bytes to memory and eventually construct an exploit giving remote code execution. This is why it is always important to properly sanitize format strings when printing user / attacker supplied data via direct specification of the format (e.g., specifying "%s\n" for the argument of `d_output_buffer`).

# Is this a replay and/or is inspired by anything?
This is inspired by the widespread exploitation of format string bugs once the knowledge of how to exploit them was disseminated.

# What makes it interesting?
This vulnerability is relatively straightforward for a CRS to identify, but writing a PoV is more challenging (as the protocol is a context sensitive binary protocol).

