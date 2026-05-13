# What functions and functionality is relevant?
Parsing MAPI attributes in Transport Neutral Encapsulation Format (TNEF/winmail.dat).

# Why is this vulnerable?
Failure to reasonably limit record size, which is specified by user-controlled input.

# Is this a replay and/or is inspired by anything?
Read-length-then-allocate memory use vulnerabilities are extremely common in non-OOXML Microsoft
formats (and several others). There wasn't a specific CVE associated with this vulnerability,
but we did go through the code base and try to add heuristic limits any time we saw an allocation
of a byte array based on a length read from the file on issue 61349: https://bz.apache.org/bugzilla/show_bug.cgi?id=61349

# What makes it interesting?
Although the format is not exceedingly common, it should be easy to find via fuzzing, and an arbitrary
limit should be fairly easy to add