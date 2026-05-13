# What design decisions were considered for this challenge?

This challenge is a full scan challenge.
The challenge includes one vulnerability *present in upstream*, lcms-001. It also re-introduces one vulnerability from the past, lcms-002.

This challenge will exhibit a correct SARIF report for lcms-001. This makes particular sense for this vuln as it is an actively exploitable vulnerability in the wild.

# Why this set of vulnerabilities?
We decided to throw the entire Little CMS project all at once, since there were only two vulns developed for it.

# Delta vs Full and why?
Due to the nature of lcms-001 we decided to stage this as a full challenge. There is no delta to it since it exists in upstream.

