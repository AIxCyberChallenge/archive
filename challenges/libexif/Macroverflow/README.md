# What design decisions were considered for this challenge?
This is a fantastic jumping off point for replay vulnerability development as is intended for this CR. We have a tailor made reproduction already made, a commit that introduces the problem, and the very next commit fixing it.

This challenge exposes a SARIF report that is incorrect. The report references the metadata for exif-002, another vulnerability that was fixed by the time this one was introduced.

# Why this set of vulnerabilities?
This vuln is staged alone. Like ex-delta-01, the intent is to provide a similar situation to where state-of-the-art analysis tooling immediately caught a bug after it was committed.

# Delta vs Full and why?
This challenge is a delta scan challenge. It contains one vulnerability, exif-001.

The author of libexif made a mistake in usage of a macro that caused a buffer overflow that was immediately caught by ossfuzz. They fixed it the next day.

