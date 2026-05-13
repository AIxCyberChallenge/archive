# What functions and functionality is relevant?
Curl supports the ancient DICT protocol. The protocol included a clause for an optional (and outdated) authentication mechanism, but Curl does not implement support for this.

# Why is this vulnerable?
This bug adds support for the authentication scheme, and leaves a debug flag in there that send the username to the server. This submission has a format string bug; the Curl sendf function interprets format strings but the username is not escaped.

# Is this a replay and/or is inspired by anything?
This is not a replay.

# What makes it interesting?
Optimal patch: Wrap the debug string sendf with a "%s" instead of passing the string directly in.

