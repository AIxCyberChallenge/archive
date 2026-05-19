# What functions and functionality is relevant?
mg_vxprintf() function when supporting %e and %E format.

# Why is this vulnerable?
This new code calls mg_dtoa(tmp, 10, mantissa, 8, c == 'e'), however the second parameter should be the sizeof(tmp) to ensure that there is no buffer overflow.

# Is this a replay and/or is inspired by anything?
This is not a replay.

# What makes it interesting?
This tests whether a CRS can detect subtly vulnerable code introduced by a developer during a typical code review scenario.

