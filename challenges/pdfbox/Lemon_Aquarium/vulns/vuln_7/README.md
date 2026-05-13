# What functions and functionality is relevant?
Parsing a PDF's page tree.

# Why is this vulnerable?
There's no check on which objects have been processed, and a crafted PDF
may contain a loop in the page tree.

# Is this a replay and/or is inspired by anything?
Replay of PDFBOX-4623, but rewritten to trigger a timeout instead of a StackOverflow.

# What makes it interesting?
A crafted PDF with a loop in the page tree triggers a timeout rather than a StackOverflow, making detection and diagnosis less straightforward.

# Additional details
* https://issues.apache.org/jira/browse/PDFBOX-4623
* The POV is https://issues.apache.org/jira/secure/attachment/12993517/loop_in_page_tree.pdf
