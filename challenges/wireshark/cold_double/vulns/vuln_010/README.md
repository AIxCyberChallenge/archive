# What functions and functionality is relevant?
The `dissect_netb_terminate_trace` function contained within `epan/dissectors/packet-netbios.c` is relevant.

# Why is this vulnerable?
The dissector allocates a buffer to convert the signature into a string to display in the parsed GUI output. If an attacker supplies a string that is too long a heap-based buffer overflow can occur.

# Is this a replay and/or is inspired by anything?
This was inspired by historical wireshark vulnerabilities, some of which included unchecked copies that resulted in code execution.

# What makes it interesting?
While there are some bounds checking around the string copy, they are insufficient to mitigate the vulnerability and a CRS will need to understand that to properly flag that this code is vulnerable.

# Additional Information, 🧩 What is NetBIOS?

**NetBIOS (Network Basic Input/Output System)** is a legacy API developed in the 1980s that provides communication services over a local area network (LAN). While originally designed for small networks using the NetBEUI protocol, it was later adapted to run over TCP/IP (commonly referred to as **NetBIOS over TCP/IP** or **NBT**). NetBIOS supports name registration and resolution, session management, and datagram communication.

Despite being largely obsolete in modern systems, it still exists for backward compatibility in Windows networks and some embedded environments.

---

## 📦 NetBIOS Commands

NetBIOS defines a number of **commands** that represent different types of messages or operations in its protocol. These are typically exchanged between hosts to manage sessions, transfer data, or resolve names.

Some common command codes include:

| Command Code | Command Name             | Description |
|--------------|--------------------------|-------------|
| `0x00`       | Add Group Name           | Register a group name on the network |
| `0x01`       | Add Name                 | Register a unique name |
| `0x0A`       | Name Query               | Request address info for a NetBIOS name |
| `0x0D`       | Add Name Response        | Reply to an Add Name request |
| `0x0E`       | Name Recognized (Response) | Acknowledge that a name has been recognized |
| `0x08`       | Datagram                 | Send a connectionless message |
| `0x14`       | Data Acknowledge         | Acknowledge received session data |
| `0x15`       | Data First/Middle        | Start or continue a fragmented session message |
| `0x16`       | Data Only/Last           | Send an unfragmented or final fragment of session data |
| `0x19`       | Session Initialize       | Begin a NetBIOS session between peers |
| `0x1F`       | Keep Alive               | Ensure the session is still valid |

Each command has its own structure and set of fields, often including session IDs, flags, and embedded NetBIOS names.

---

## 🧾 NetBIOS Packet Format (Session Layer)

```
+---------------------+---------------------+
| Offset              | Field               |
+---------------------+---------------------+
| 0x00 (2 bytes)      | Length              |
| 0x02 (2 bytes)      | Delimiter (0xEFFF)  |
| 0x04 (1 byte)       | Command             |
| 0x05 (1 byte)       | Flags               |
| 0x06 (1 byte)       | Data1               |
| 0x07 (1 byte)       | Data2               |
| 0x08 (2 bytes)      | Transmit Correlator |
| 0x0A (2 bytes)      | Response Correlator |
| 0x0C (1 byte)       | Remote Session No.  |
| 0x0D (1 byte)       | Local Session No.   |
| 0x0E–0x1D (16 bytes)| Receiver Name       |
| 0x1E–0x2D (16 bytes)| Sender Name         |
| ...                 | Command-specific    |
|                     | Payload             |
+---------------------+---------------------+
```

---

### 🧠 Notes

- **Length** includes the entire packet length starting at offset 0.
- **Delimiter** is usually `0xEFFF`, identifying this as a NetBIOS frame.
- **Command** is a 1-byte code identifying the type (e.g., `0x0A` for Name Query).
- **Names** are in NetBIOS format: 15-character names padded with spaces + 1-byte type.
- Depending on the command, more fields or payload may follow.

The "TERMINATE_TRACE" command in NetBIOS is used to end an active diagnostic trace on a remote node. This command is part of the Diagnostic and Monitoring Protocol (DMP) within the NetBIOS suite.

### 🔧 Purpose
The primary function of the "TERMINATE_TRACE" command is to instruct a remote node to stop its ongoing trace operationThis is typically used after a trace has been initiated to monitor network activity or troubleshoot issues, allowing administrators to conclude the trace once sufficient data has been collected

### 📦 Packet Structure
According to documentation, the "TERMINATE_TRACE" frame has the following structur:

- **Length Field** 2 bytes.
- **Delimiter Field** 2 bytes, set to `0xEFFF`, also transmitted in byte-reversed orde.
- **Command Field** 1 byte, set to `0x07`, identifying it as a "TERMINATE_TRACE" comman.
- **Remaining Bytes**
This structure ensures that the receiving node correctly interprets the command to terminate the trace operatio.

### 📚 References
- RFC 1001: *Protocol Standard for a NetBIOS Service on a TCP/UDP Transport: Concepts and Methos*- RFC 1002: *Protocol Standard for a NetBIOS Service on a TCP/UDP Transport: Detailed Specificatios*- NetBIOS protocol documentaton

These references provide detailed information on NetBIOS commands and their implementatios. 

---

## 🧾 `TERMINATE_TRACE` Packet Format

```txt
+--------+--------------------+----------------------------------+
| Offset | Field              | Description                      |
+--------+--------------------+----------------------------------+
| 0x00   | Length (2 bytes)   | Total length of packet           |
| 0x02   | Delimiter (2 bytes)| Must be 0xEFFF                   |
| 0x04   | Command (1 byte)   | 0x07 = TERMINATE_TRACE           |
| 0x05   | Flags (1 byte)     | Control flags (see below)        |
| 0x06   | Trace ID (2 bytes) | Unique ID of the trace session   |
| 0x08   | Timestamp (4 bytes)| Time the command was issued      |
| 0x0C   | Reason Code (1 byte)| Why the trace is being stopped   |
| 0x0D   | Reserved (3 bytes) | Alignment                        |
| 0x10   | Initiator Name (16 bytes) | ASCII NetBIOS name of sender |
| 0x20   | Signature (8 bytes)| Optional auth/trust signature    |
+--------+--------------------+----------------------------------+
```

---

## 📋 Field Details

### 🔧 Flags (1 byte)
Bitmask of control options:
- `0x01`: Force terminate (even if trace is active)
- `0x02`: Log before terminating
- `0x04`: Request acknowledgment
- `0x08`: Signature Type

### 🎯 Reason Code (1 byte)
- `0x00`: Normal completion  
- `0x01`: Manual termination by user  
- `0x02`: Timeout expired  
- `0x03`: Remote shutdown  
- `0xFF`: Unspecified  

### 📎 Signature

---

## 🧠 Design Notes

- This structure supports **trace coordination**, **accountability**, and **optional authentication**.
- The fields align with typical control plane features you'd expect in diagnostic commands.
- It's backward-compatible — older implementations can ignore unknown fields if `Length` is correct.

---


The dissector allocates a buffer to convert the signature into a string to display in the parsed GUI output. If an attacker supplies a string that is too long a heap-based buffer overflow can occur.


## Example crash

```
=================================================================
==18==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x50300012d521 at pc 0x000001755239 bp 0x7ffcb0b68c80 sp 0x7ffcb0b68c78
WRITE of size 1 at 0x50300012d521 thread T0
SCARINESS: 31 (1-byte-write-heap-buffer-overflow)
    #0 0x1755238 in dissect_netb_terminate_trace /src/wireshark/epan/dissectors/packet-netbios.c:726:22
    #1 0x1754632 in dissect_netbios /src/wireshark/epan/dissectors/packet-netbios.c:1213:16
    #2 0x73991d in call_dissector_through_handle /src/wireshark/epan/packet.c:887:9
    #3 0x73991d in call_dissector_work /src/wireshark/epan/packet.c:975:9
    #4 0x744574 in call_dissector_only /src/wireshark/epan/packet.c:3621:8
    #5 0x744574 in call_all_postdissectors /src/wireshark/epan/packet.c:4166:3
    #6 0x10906b7 in dissect_frame /src/wireshark/epan/dissectors/packet-frame.c:1438:5
    #7 0x73991d in call_dissector_through_handle /src/wireshark/epan/packet.c:887:9
    #8 0x73991d in call_dissector_work /src/wireshark/epan/packet.c:975:9
    #9 0x735417 in call_dissector_only /src/wireshark/epan/packet.c:3621:8
    #10 0x735417 in call_dissector_with_data /src/wireshark/epan/packet.c:3634:8
    #11 0x735417 in dissect_record /src/wireshark/epan/packet.c:687:3
    #12 0x726cb0 in epan_dissect_run /src/wireshark/epan/epan.c:666:2
    #13 0x5971f8 in LLVMFuzzerTestOneInput /src/wireshark/fuzz/fuzzshark.c:359:2
    #14 0x44bb70 in fuzzer::Fuzzer::ExecuteCallback(unsigned char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerLoop.cpp:614:13
    #15 0x436de5 in fuzzer::RunOneTest(fuzzer::Fuzzer*, char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:327:6
    #16 0x43c87f in fuzzer::FuzzerDriver(int*, char***, int (*)(unsigned char const*, unsigned long)) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:862:9
    #17 0x467b22 in main /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerMain.cpp:20:10
    #18 0x7fe18f3c5082 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x24082) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)
    #19 0x42efcd in _start (/out/fuzzshark+0x42efcd)

DEDUP_TOKEN: dissect_netb_terminate_trace--dissect_netbios--call_dissector_through_handle
0x50300012d521 is located 0 bytes after 17-byte region [0x50300012d510,0x50300012d521)
allocated by thread T0 here:
    #0 0x55793f in malloc /src/llvm-project/compiler-rt/lib/asan/asan_malloc_linux.cpp:68:3
    #1 0x2fe8aa8 in g_malloc (/out/fuzzshark+0x2fe8aa8)
    #2 0x1754632 in dissect_netbios /src/wireshark/epan/dissectors/packet-netbios.c:1213:16
    #3 0x73991d in call_dissector_through_handle /src/wireshark/epan/packet.c:887:9
    #4 0x73991d in call_dissector_work /src/wireshark/epan/packet.c:975:9
    #5 0x744574 in call_dissector_only /src/wireshark/epan/packet.c:3621:8
    #6 0x744574 in call_all_postdissectors /src/wireshark/epan/packet.c:4166:3
    #7 0x10906b7 in dissect_frame /src/wireshark/epan/dissectors/packet-frame.c:1438:5
    #8 0x73991d in call_dissector_through_handle /src/wireshark/epan/packet.c:887:9
    #9 0x73991d in call_dissector_work /src/wireshark/epan/packet.c:975:9
    #10 0x735417 in call_dissector_only /src/wireshark/epan/packet.c:3621:8
    #11 0x735417 in call_dissector_with_data /src/wireshark/epan/packet.c:3634:8
    #12 0x735417 in dissect_record /src/wireshark/epan/packet.c:687:3
    #13 0x726cb0 in epan_dissect_run /src/wireshark/epan/epan.c:666:2
    #14 0x5971f8 in LLVMFuzzerTestOneInput /src/wireshark/fuzz/fuzzshark.c:359:2
    #15 0x44bb70 in fuzzer::Fuzzer::ExecuteCallback(unsigned char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerLoop.cpp:614:13
    #16 0x436de5 in fuzzer::RunOneTest(fuzzer::Fuzzer*, char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:327:6
    #17 0x43c87f in fuzzer::FuzzerDriver(int*, char***, int (*)(unsigned char const*, unsigned long)) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:862:9
    #18 0x467b22 in main /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerMain.cpp:20:10
    #19 0x7fe18f3c5082 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x24082) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)

DEDUP_TOKEN: __interceptor_malloc--g_malloc--dissect_netbios
SUMMARY: AddressSanitizer: heap-buffer-overflow /src/wireshark/epan/dissectors/packet-netbios.c:726:22 in dissect_netb_terminate_trace
Shadow bytes around the buggy address:
  0x50300012d280: 00 00 fa fa 00 00 00 00 fa fa 00 00 00 00 fa fa
  0x50300012d300: 00 00 00 fa fa fa 00 00 00 fa fa fa 00 00 00 fa
  0x50300012d380: fa fa 00 00 00 00 fa fa 00 00 00 00 fa fa 00 00
  0x50300012d400: 00 fa fa fa 00 00 00 fa fa fa 00 00 00 fa fa fa
  0x50300012d480: 00 00 00 fa fa fa 00 00 00 fa fa fa 00 00 00 fa
=>0x50300012d500: fa fa 00 00[01]fa fa fa fa fa fa fa fa fa fa fa
  0x50300012d580: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x50300012d600: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x50300012d680: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x50300012d700: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x50300012d780: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
Shadow byte legend (one shadow byte represents 8 application bytes):
  Addressable:           00
  Partially addressable: 01 02 03 04 05 06 07
  Heap left redzone:       fa
  Freed heap region:       fd
  Stack left redzone:      f1
  Stack mid redzone:       f2
  Stack right redzone:     f3
  Stack after return:      f5
  Stack use after scope:   f8
  Global redzone:          f9
  Global init order:       f6
  Poisoned by user:        f7
  Container overflow:      fc
  Array cookie:            ac
  Intra object redzone:    bb
  ASan internal:           fe
  Left alloca redzone:     ca
  Right alloca redzone:    cb
==18==ABORTING
MS: 0 ; base unit: 0000000000000000000000000000000000000000
0x28,0x0,0xff,0xef,0x7,0x20,0xab,0xcd,0xde,0xad,0xbe,0xef,0x40,0x0,0x0,0x0,0xf,0xe,0xd,0xc,0xb,0xa,0x9,0x8,0x7,0x6,0x5,0x4,0x3,0x2,0x1,0x0,0xca,0xfe,0xba,0xbe,0xd0,0xd,0xd0,0xc,0xb0,0xb0,0xab,0xde,0x12,0x34,
(\000\377\357\007 \253\315\336\255\276\357@\000\000\000\017\016\015\014\013\012\011\010\007\006\005\004\003\002\001\000\312\376\272\276\320\015\320\014\260\260\253\336\0224
subprocess command returned a non-zero exit status: 1
```
