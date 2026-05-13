# What design decisions were considered for this challenge?
The author of libexif made a mistake when adjusting a parser that caused a buffer overflow that was immediately caught by ossfuzz. They fixed it the next day.

# Why this set of vulnerabilities?
This is staged alone. Like ex-delta-01, the intent is to provide a similar situation to where state-of-the-art analysis tooling immediately caught a bug after it was committed.

# Delta vs Full and why?
This challenge is a delta scan challenge. It contains one vulnerability, exif-002.

