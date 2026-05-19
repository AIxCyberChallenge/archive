# What design decisions were considered for this challenge?
This challenge was designed to mimic a developer writing non-vulnerable code, but due to the constraints or assumptions of surrounding code induces a vulnerability.

# Why this set of vulnerabilities?
This set of vulnerabilities seemed interesting to validate that a CRS' "window" of attention included larger scope that could show the CRS that the "non-vulnerable" introduced code actually does cause problems

# Delta vs Full and why?
This challenge was a delta scan challenge because it was designed to mimic a feature add to a repository.

# Additional Information
Libxml2 is a powerful open-source C language software library for parsing and manipulating Extensible Markup Language (XML) documents. Initially developed for the GNOME project, it is cross-platform and widely used in various applications beyond the GNOME desktop environment. 

Functionality
Parsing XML: Libxml2 can read and understand XML documents, breaking them down into manageable parts. It supports various parsing methods, including DOM (Document Object Model), SAX (Simple API for XML), Push, and Pull parsing, allowing developers to choose the most suitable method for their needs.

Manipulating XML: It provides functions for creating, modifying, and traversing XML document structures, including adding elements, attributes, and extracting text or attribute values.

Validating XML: Libxml2 supports validating XML documents against DTDs (Document Type Definitions), XML Schemas, and RelaxNG schemas to ensure their adherence to specific rules and structures.

Handling large documents: It is designed to handle large XML documents efficiently, making it suitable for applications that require fast data processing.

Error handling: Libxml2 includes robust error handling mechanisms to help identify and fix issues in malformed XML documents. 

# Vulnerability
The goal of this challenge is to test CRS' ability to comprehend disconnected
parts of code. The encoders in libxml2 are written in a generic way, where
first an encoder is loaded into a function pointer based on libxml2's detection
based on reading the first few bytes of the file. Then, much later in the code,
encoders are called to ingest the file, and there are baseline assumptions of
a certain buffer size constraint; and when this new code is added (there aren't
implicit vulnerabilities in the new added code), it violates this assumption.
So--apart from libxml2--there is no bug in the UTF-32 encoder if supplied with
proper data, but the assumptions in libxml2 will cause an exploitable bug to be present with this disconnect.

