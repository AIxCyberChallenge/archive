# What functions and functionality is relevant?
Parsing an xlsx file.

# Why is this vulnerable?
This is a backdoor Runtime.halt triggered by a sheet name in an xlsx file.

# Is this a replay and/or is inspired by anything?
Not a replay. It was inspired by a System.exit() found in Apache Tika
during our early experiments with fuzzing: https://www.cve.org/CVERecord?id=CVE-2020-9489

# What makes it interesting?
As with the xls challenge (vuln_3), this should be an entry-level/simple fix. 
Simply remove the backdoor. Generating a proof of vulnerability requires fairly deep knowledge 
of the xls format or (better) simply using an existing XLS generation library.

# Additional details
This challenge also validates that Jazzer correctly reports System.exit and Runtime.halt calls.
