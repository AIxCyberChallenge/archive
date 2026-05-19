# What functions and functionality is relevant?
Parsing an XLS file.

# Why is this vulnerable?
This is a backdoor crash triggered by a sheet name in an xls file.

# Is this a replay and/or is inspired by anything?
Not a replay.

# What makes it interesting?
As with the xlsx challenge (vuln_4), this should be an entry-level/simple fix.
Simply remove the backdoor. Generating a proof of vulnerability requires fairly deep knowledge
of the xlsx format or (better) simply using an existing XLS generation library.

# Additional details
This challenge also validates that Jazzer correctly reports JVM crashes.
