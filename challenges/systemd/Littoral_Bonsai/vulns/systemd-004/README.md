# What functions and functionality is relevant?
condition_free_list_type and anything touching the Condition list.

# Why is this vulnerable?
Results in a double-free that can be triggered in several ways.

# Is this a replay and/or is inspired by anything?
It is a reimplementation of https://bugs.chromium.org/p/oss-fuzz/issues/detail?id=13878

# What makes it interesting?
Presents a challenging deduplication problem as it can be trigged by several harnesses. Double frees also have an ambiguous "buggy" location. This makes understanding the actual root cause of the issue very hard for an automated system.

# Additional Information

This bug can be triggered by multiple harnesses (fuzz-netdev-parser, fuzz-link-parser, fuzz-network-parser) and in fuzz-unit-file it raises an assert. This is not an exhaustive list, there are potentially more locations that can trigger it.

