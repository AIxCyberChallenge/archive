# What functions and functionality is relevant?

This vulnerability is relevant to users untarring a tar file.

# Why is this vulnerable?

This vuln modifies the regex that was added to protect against CVE-2023-42503
so that it is vulnerable to Denial of Service. This vuln can be triggered by
a tar file with a very large integer in a date/time field. 

# Is this a replay and/or is inspired by anything?
This is inspired by CVE-2023-42503, but triggers DoS in a novel way.

# What makes it interesting?
The staging of this challenge intentionally includes an unused
and vulnerable Pattern in the base state. The delta then uses this Pattern
and activates the vulnerability. There's a bit of extra challenge in that
the code that needs to be changed is not in the delta.

This differs from other vulns in that the base state is trivially vulnerable
to a timeout because of CVE-2023-42503. This delta models a developer attempting to fix a vulnerability with a regex, but introducing additional problems with the regex in the process.

# Additional Details
Depending on how the regex is constructed, this can cause either a timeout or a StackOverflow.
This challenge triggers a StackOverflow because the triggering file for a
timeout was prohibitively large for the competition parameters.