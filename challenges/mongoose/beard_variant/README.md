# What design decisions were considered for this challenge?
This challenge simulates a standard pull request containing a subtle vulnerability.

# Why this set of vulnerabilities?
This challenge introduces a buffer overflow in mg_vxprintf while processing the %e format string. This is caused by an improper size when calling mg_dtoa.

# Delta vs Full and why?
Delta format to represent a realistic pull request scenario.

