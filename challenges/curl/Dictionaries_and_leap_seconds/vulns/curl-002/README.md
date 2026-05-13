# What functions and functionality is relevant?
The C standard library time functions usually return 0 through 59 for the second value. Did you know that the C standard library, can, under circumstances, return 60? That's right, it's a leap second bug!

# Why is this vulnerable?
This bug does some pretty printing of the seconds value when Curls FTP implementation tries to get the time modified value of a file. It also writes a strange line of code:

putenv("TZ=right/UTC");

Which makes it so that any Unix timestamp that has a leap second in it will return 60 as the second value. Yes, really. glibc things, folks. POSIX forbids leap seconds in the standard…
Here's one such timestamp: 1483228826

If 60 is the second value, Curl will read out of bounds for the pretty-print value and trigger ASAN. 

# Is this a replay and/or is inspired by anything?
This is not a replay.

# What makes it interesting?

Discovery of this vulnerability is intended to be difficult. A CRS would have to be aware of the strange leap-second behavior and notice that Curls newarray indexing does not account for it. It would then have to, on top of writing a complete and correct FTP exchange through Curls harness, including all of the necessary flags to trigger the behavior, including a flag that was added to the harness for the vuln. It then has to choose a timestamp *in FTP format* such that when it is converted to a Unix timestamp by Curl, it will be a timestamp with a leap second. Only then will they score.

