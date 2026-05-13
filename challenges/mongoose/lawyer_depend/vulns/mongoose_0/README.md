# What functions and functionality is relevant?
mg_json_get() in mongoose.c and json.c.

# Why is this vulnerable?
"Double trouble" stack-based buffer overflows in a change to increase the number of nested json objects.
The check to prevent buffer overflow was incorrectly changed from >= to > causing CWE-193: Off-by-one Error
leading to CWE-121: Stack-based Buffer Overflow. However, in addition to this incorrect change, the stack
buffer size for the variable "nesting" was not increased to match the new MG_JSON_MAX_NESTING value. This
will also cause a CWE-121: Stack-based Buffer Overflow.

# Is this a replay and/or is inspired by anything?
This is not a replay.

# What makes it interesting?
This tests whether a CRS can detect subtly vulnerable code introduced by a developer during a typical code review scenario.

