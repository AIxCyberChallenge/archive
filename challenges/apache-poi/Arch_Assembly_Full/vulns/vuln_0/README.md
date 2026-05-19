# What functions and functionality is relevant?
Parsing MAPI attributes in Transport Neutral Encapsulation Format (TNEF/winmail.dat).

# Why is this vulnerable?
The vulnerability removes two checks designed to limit resource utilization.

1) The number of records is read from the user generated input without bounds checking

2) The read and skips on the input stream are not checked for end-of-file.


# Is this a replay and/or is inspired by anything?
This is an incidental replay. After developing the vulnerability, Apache POI's existing unit test with `oom.tnef` was found to cause an OOM with the changes introduced in this vuln. This vulnerability had likely already been found via fuzzing.


# What makes it interesting?
The complexity of the two features working together. Also, this file format is not exceedingly common.


