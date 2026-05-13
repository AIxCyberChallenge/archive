# What functions and functionality is relevant?
The author of libexif made a mistake in usage of a macro that caused a buffer overflow that was immediately caught by ossfuzz. They fixed it the next day. 

This is a fantastic jumping off point for replay vulnerability development as is intended for this CR. We have a tailor made reproduction already made, a commit that introduces the problem, and the very next commit fixing it.

# Why is this vulnerable?
The incorrect macro usage causes a buffer overflow due to improper bounds calculations.

# Is this a replay and/or is inspired by anything?
Yes

# What makes it interesting?
Like ex-delta-01, the intent is to provide a similar situation to where state-of-the-art analysis tooling immediately caught a bug after it was committed.

Challenge Repository: libexif

Harness that will be used: exif_from_data_fuzzer

Sanitizer that will be used: ASAN

