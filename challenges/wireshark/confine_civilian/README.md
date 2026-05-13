# What design decisions were considered for this challenge?
This challenge is encapsulated within a single dissector to mimic a solo developer writing a dissector for an esoteric protocol. The bug is scoped to this single dissector, not a systemic issue across other wireshark packet parsers.

# Why this set of vulnerabilities?
The null byte buffer underwrite can be a powerful primitive to allow further exploitation of a system, not just a simple crash or annoying bug for a developer. This vulnerability highlights the problems that could be encountered with such a bug.

# Delta vs Full and why?
This challenge was included as a delta scan to mimic a developer adding functionality to a wireshark dissector.

# Additional Information
Wireshark is a powerful, open-source network protocol analyzer, used to capture and interactively browse the traffic running on a computer network.

Wireshark includes the following features to dissect network traffic:
* Packet capture and analysis: Captures live traffic from network interfaces and also allows analysis of saved packet capture files (PCAP).
* Protocol Support: Recognizes and dissects data from hundreds, even thousands, of protocols, including common ones like TCP/IP, HTTP, DNS, and many others.
* Detailed Inspection: Displays the captured data in a human-readable format, providing a granular view of each packet, including headers, payloads, and other information.
* Filtering and Search: Offers advanced filters to narrow down the view to specific packets, sessions, or protocols, helping focus the analysis.
* Cross-platform: Available for Windows, macOS, and Linux.
* Visualization: Can generate statistics, graphs, and flow diagrams to visualize network activity and performance, potentially revealing anomalies.

## Basic Encoding Rules (BER).
BER is a standard way to serialize data structures defined using Abstract Syntax Notation One (ASN.1), often used in network protocols like LDAP, SNMP, and some aspects of PKI (Public Key Infrastructure). BER essentially encodes data using a Tag-Length-Value (TLV) structure. 
* Tag: Identifies the type of data being encoded (e.g., integer, string, sequence). It's typically one byte but can extend for larger tag numbers.
* Length: Specifies the size of the value that follows. Can be represented in short or long form to accommodate various lengths.
* Value (Contents): The actual data being encoded, potentially containing other nested TLV structures. 

