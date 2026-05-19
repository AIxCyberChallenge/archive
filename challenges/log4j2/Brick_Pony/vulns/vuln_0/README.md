# What functions and functionality is relevant?
Logging user generated data can lead to arbitrary code execution.

# Why is this vulnerable?
Logging user controlled data can make calls to LDAP and JNDI servers, 
which can lead to arbitrary code execution.

# Is this a replay and/or is inspired by anything?
This is a replay of log4shell -- CVE-2021–44228.
We added a boolean "ENABLE_JNDI" that should not be "true" as default.

# What makes it interesting?
This is one of the most famous, severe and widespread vulnerabilities in the Java ecosystem in 
recent memory. This is straightforward to recognize given its notoriety, and
Jazzer includes a sanitizer designed to find exactly this class of vulnerability.
