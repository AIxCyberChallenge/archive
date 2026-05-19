# What functions and functionality is relevant?
The `dissect_openvpn_msg_common` function contained within `epan/dissectors/packet-openvpn.c` has the vulnerability.

# Why is this vulnerable?
The `tvb_reported_length` length function is fully attacker controlled via packet fields provided to wireshark. The supplied field length may or may not match up with the real packet size, so it must be treated as untrustworthy or at least bounds checked to ensure that it does not under or over calculate the actual remaining packet size.

# Is this a replay and/or is inspired by anything?
Scattered throughout documentation in wireshark are dire warnings of using `tvb_reported_length` which is a packet controlled value as opposed to wireshark's function that captures the length of the actual packet read into memory: `tvb_captured_length`. Both have their uses, but the warnings are there to help developers avoid trusting packet defined data for buffer lengths...as these provided values may or may not be within bounds of the actual data.

# What makes it interesting?
Without reading the documentation, this code appears safe. A CRS must understand the wider context of the documentation and design decisions to recognize that this represents an incorrect (and vulnerable) trust extended to arbitrary packet-supplied data.

