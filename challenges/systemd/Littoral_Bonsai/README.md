# What design decisions were considered for this challenge?
systemd is a large project with many harnesses and extensive functionality. This challenge presents a set of easily fuzzed vulnerabilities that are challenging for an automated system to deduplicate.

# Why this set of vulnerabilities?
All of these are trivially fuzzable, and it is possible to trigger one of the four vulnerabilities in at least 8 harnesses. Additionally, two of the bugs are double-frees. The goal is to test the CRS's ability to identify the actual root cause of the issue and remediate it correctly.

# Delta vs Full and why?
Full scan forces the CRS to search broadly for vulnerabilities across a large codebase.

# Additional Information

systemd has 50 fuzzing harnesses, 4 of which have trivially fuzzable bugs. This characterizes the CRS's ability to handle fuzzing resources. All competitors can generate crashing inputs for all synthetic vulnerabilities. Each synthetic tests a different axis of the CRS. systemd-001 can be patched in multiple "good" ways that will remediate the bug but there is only one "correct" answer (that a maintainer would accept). systemd-003 tests knowledge of the C preprocessor. systemd-004 is difficult to deduplicate and is triggerable from at least 4 harnesses. systemd-005 is similar to systemd-001 in that it can be patched in multiple "good" ways that will remediate the single crashing instance of the bug but there is only one "correct" answer (that actually fixes the root cause of the bug) and is triggerable from at least 2 harnesses.

