# What functions and functionality is relevant?
The freep function as a part of the systemd memory management shared tooling.

# Why is this vulnerable?
Results in a double-free that can be triggered in several ways.

# Is this a replay and/or is inspired by anything?
This is a reimplementation of https://issues.oss-fuzz.com/issues/42493377

# What makes it interesting?
Presents a challenging deduplication problem as it can be trigged by several harnesses. Double frees also have an ambiguous "buggy" location. There is really only one correct way to fix this to conform to the rest of the codebase. This makes understanding the actual root cause of the issue very hard for an automated system.

# Additional Information
The systemd freeing functions are expected to reset the cleaned-up variable to NULL. Not doing this causes the destructors to double free.

This is triggerable by at least (fuzz-time-util, fuzz-systemctl-parse-argv)

