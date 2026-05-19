# What functions and functionality is relevant?
udev-rule-parse-value in the udev rule parser.

# Why is this vulnerable?
Provides a write primitive.

# Is this a replay and/or is inspired by anything?
Inspired by how buggy string parsing in C is.

# What makes it interesting?
It is a tricky bug to patch "correctly", the only correct answer is to just use the existing pointer that is tracking the "start" of the rule string and to remove all references to the incorrect one. An AI agent would likely fix this through some other means like bounds checking or more complicated allocations. A maintainer would only accept the correct answer.

# Additional Information

systemd-001 implements a new prefix for udev rule strings that will make them prefix match, which would only really be useful to make some bash script autogenerating your rules to be a little easier to write as it is equivalent to just appending a * glob match to the rule. 

The bug is triggered if the rule string contains a combination of the newly added prefix string, the escape prefix, and contains duplicates of any of the prefixes. The parser keeps track of where the "start" of the rule string in two ways, which do not agree with each other. One way is a counter in the rule matcher, which will have the correct number to add to the string pointer given any number of prefix rules. The other is adding all of the prefix booleans to the string pointer. This works fine if there are no duplicates but the parser does not check if there are duplicates.  Most of the processing uses the latter pointer which ends up returning an invalid input error in most cases which is correct. But in the prefix match + escape string case, the code path uses the other pointer allowing for an arbitrarily long semi-controllable OOB write.

