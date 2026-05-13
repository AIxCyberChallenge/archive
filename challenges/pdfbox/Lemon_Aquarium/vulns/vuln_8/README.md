# What functions and functionality is relevant?
Parsing an xref table in a PDF.

# Why is this vulnerable?
There's no check for circular references in the xref table.

# Is this a replay and/or is inspired by anything?
This is a replay of a famous infinite loop/Denial of Service
vulnerability that was fixed in PDFBOX-3919. Andreas Bogk
presented this vulnerability at Chaos Communication Camp in 2011.
It affected poppler, qpdf and PDFBox among, probably, many other
PDF parsers.

# What makes it interesting?
This is a very famous vulnerability. It would be challenging
to identify and patch without historical context.

# Additional details
The POV is taken from: https://bugs.launchpad.net/ubuntu/+source/poppler/+bug/825554
See also: 
* https://www.ieee-security.org/TC/SPW2014/papers/5103a198.PDF 
* https://www.bleepingcomputer.com/news/software/six-year-old-loop-bug-re-discovered-to-affect-almost-all-major-pdf-viewers/
* https://blog.fuzzing-project.org/59-Six-year-old-PDF-loop-bug-affects-most-major-implementations.html
