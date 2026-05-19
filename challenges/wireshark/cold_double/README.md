# What design decisions were considered for this challenge?
This challenge project was chosen because of its widespread usage and long and varied history of vulnerable plugins (or in wireshark's nomenclature, "dissectors").

# Why this set of vulnerabilities?
This full scan challenge is comprised of 6 individual & discrete vulnerabilities:
* Wireshark-001 - Buffer overflow due to trusting user defined packet sizes
* Wireshark-002 - Heap user after free due to improper garbage collection
* Wireshark-005 - Format string vulnerabilities due to improper data sanitization
* Wireshark-010 - Improperly bounded string copy resulting in heap buffer overflow
* Wireshark-011 - ASCII string buffer overflow
* Wireshark-012 - Use after free due to debugging code
These vulnerabilities exemplify many common and a few uncommon vulnerabilities that would be present in protocol parsing projects.

# Delta vs Full and why?
This challenge is a full scan to test the breadth and scope of a CRS' ability to find and detect vulnerabilities via scanning a codebase as-is, not individual deltas.

# Additional Information
Wireshark is a powerful, open-source network protocol analyzer, used to capture and interactively browse the traffic running on a computer network.

Wireshark includes the following features to dissect network traffic:
* Packet capture and analysis: Captures live traffic from network interfaces and also allows analysis of saved packet capture files (PCAP).
* Protocol Support: Recognizes and dissects data from hundreds, even thousands, of protocols, including common ones like TCP/IP, HTTP, DNS, and many others.
* Detailed Inspection: Displays the captured data in a human-readable format, providing a granular view of each packet, including headers, payloads, and other information.
* Filtering and Search: Offers advanced filters to narrow down the view to specific packets, sessions, or protocols, helping focus the analysis.
* Cross-platform: Available for Windows, macOS, and Linux.
* Visualization: Can generate statistics, graphs, and flow diagrams to visualize network activity and performance, potentially revealing anomalies.

