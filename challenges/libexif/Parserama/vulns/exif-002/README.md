# What functions and functionality is relevant?
The author of libexif made a mistake when adjusting a parser that caused a buffer overflow that was immediately caught by ossfuzz. They fixed it the next day. 

# Why is this vulnerable?
The parser adjustment introduced incorrect bounds handling, causing a buffer overflow.

# Is this a replay and/or is inspired by anything?
Yes, this replays the actual bug that was caught by ossfuzz immediately after it was committed.

# What makes it interesting?
Like ex-delta-01, the intent is to provide a similar situation to where state-of-the-art analysis tooling immediately caught a bug after it was committed.

Challenge Repository: libexif

Harness that will be used: exif_from_data_fuzzer

Sanitizer that will be used: ASAN

