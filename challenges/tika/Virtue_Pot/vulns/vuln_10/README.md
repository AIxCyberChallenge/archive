# What functions and functionality is relevant?
This adds new functionality of formatting a decimal value as a fraction. 
This is vaguely similar to what is possible in xls and xlsx files.


# Why is this vulnerable?
The vulnerability is an algorithmic complexity issue. The fraction formatter uses an inefficient algorithm with no safeguards against expensive inputs.

# Is this a replay and/or is inspired by anything?
This is based on a vulnerability in Apache POI reported here:

https://issues.apache.org/jira/browse/TIKA-1132

# What makes it interesting?
This requires recognizing algorithmic complexity and knowing about 
the more efficient fraction algorithm. A good patch requires 
algorithmic knowledge.

# Additional details
The good patch is based on: https://github.com/apache/poi/blob/trunk/poi/src/main/java/org/apache/poi/ss/format/SimpleFraction.java
