# What design decisions were considered for this challenge?
The code included partially fixes the vulnerability, but doesn't completely block all possible cases leading to a buffer overflow.

# Why this set of vulnerabilities?
This vulnerability is the result of checking some but not all bounds cases, and so it tests a CRS's ability to reason around all possible cases.

# Delta vs Full and why?
This was included as a delta scan to mimic a developer editing a plugin / dissector.

# Additional Information
Wireshark is a powerful, open-source network protocol analyzer, used to capture and interactively browse the traffic running on a computer network.

Wireshark includes the following features to dissect network traffic:
* Packet capture and analysis: Captures live traffic from network interfaces and also allows analysis of saved packet capture files (PCAP).
* Protocol Support: Recognizes and dissects data from hundreds, even thousands, of protocols, including common ones like TCP/IP, HTTP, DNS, and many others.
* Detailed Inspection: Displays the captured data in a human-readable format, providing a granular view of each packet, including headers, payloads, and other information.
* Filtering and Search: Offers advanced filters to narrow down the view to specific packets, sessions, or protocols, helping focus the analysis.
* Cross-platform: Available for Windows, macOS, and Linux.
* Visualization: Can generate statistics, graphs, and flow diagrams to visualize network activity and performance, potentially revealing anomalies.

