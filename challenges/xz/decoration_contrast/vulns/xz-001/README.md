# What functions and functionality is relevant?
create_tree and compute_tree_checksum functions in src/liblzma/check/treeck.c.

# Why is this vulnerable?
An atypical topology of the checksum tree triggered on boundary condition causes a use-after-free error.

# Is this a replay and/or is inspired by anything?
This is not a replay.

# What makes it interesting?
The ``xz`` library is extensible with custom checksum algorithms. This patch
introduces a custom checksum for a fictitious filetype. On a fringe condition in
the width/height field of the new filetype, a backlink in the checksum tree
introduces a use-after-free vulnerability.

