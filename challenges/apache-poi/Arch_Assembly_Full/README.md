# What design decisions were considered for this challenge?
The straightforward backdoors (vuln_3 and vuln_4) are placed in a full repo scan, where they blend naturally into the larger codebase and test a CRS's ability to identify injected code across a broad surface area.

The resource consumption vulnerabilities suit the legacy codebase audit use case.

The organic zip slip belongs in a full scan because it is a real pre-existing bug in this codebase, not part of a recent new feature pull request.

# Why this set of vulnerabilities?
They represent a range of types of vulnerabilities throughout the code base and across formats.

# Delta vs Full and why?
Full scan is the right fit for these vulnerabilities. The backdoors benefit from a larger codebase context, the resource consumption issues suit a legacy audit scenario, and the organic zip slip is a real pre-existing bug rather than a new feature change.