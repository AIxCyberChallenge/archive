# What design decisions were considered for this challenge?
This challenge was designed around global variable buffer overflows.

# Why this set of vulnerabilities?
The vulnerability was chosen due to its detached state. A CRS must be able to keep track of not only individual dissector functionality, but also how global state is affected.

# Delta vs Full and why?
This challenge was a delta scan challenge, designed to mimic a developer adding functionality to an existing code base and unintentionally introducing a vulnerability.

# Additional Information
Wireshark is a powerful, open-source network protocol analyzer, used to capture and interactively browse the traffic running on a computer network.

Wireshark includes the following features to dissect network traffic:
* Packet capture and analysis: Captures live traffic from network interfaces and also allows analysis of saved packet capture files (PCAP).
* Protocol Support: Recognizes and dissects data from hundreds, even thousands, of protocols, including common ones like TCP/IP, HTTP, DNS, and many others.
* Detailed Inspection: Displays the captured data in a human-readable format, providing a granular view of each packet, including headers, payloads, and other information.
* Filtering and Search: Offers advanced filters to narrow down the view to specific packets, sessions, or protocols, helping focus the analysis.
* Cross-platform: Available for Windows, macOS, and Linux.
* Visualization: Can generate statistics, graphs, and flow diagrams to visualize network activity and performance, potentially revealing anomalies.

