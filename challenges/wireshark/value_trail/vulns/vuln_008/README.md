# What functions and functionality is relevant?
The function in question is `dissect_netbios` contained within `epan/dissectors/packet-netbios.c`.

# Why is this vulnerable?
The NETBIOS dissector uses an array of function pointers to parse specific commands. By removing the validation of the command, an attack is able to cause an out of bounds index to the function array. Ultimately this could lead to code execution if the attacker is able to find a good function pointer to execute.

# Is this a replay and/or is inspired by anything?
This was inspired by object oriented programming exploitation paradigms (such as c++ class vtables).

# What makes it interesting?
This type of vulnerability is instantaneous code execution when triggered, making it an easy vulnerability to exploit from an attackers perspective...but subtle to identify and fix from a developer's perspective.

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

---

## Example crash

```
=================================================================
==18==ERROR: AddressSanitizer: global-buffer-overflow on address 0x000008653168 at pc 0x000001754b3e bp 0x7ffe3e8f6c70 sp 0x7ffe3e8f6c68
READ of size 8 at 0x000008653168 thread T0
SCARINESS: 23 (8-byte-read-global-buffer-overflow)
    #0 0x1754b3d in dissect_netbios /src/wireshark/epan/dissectors/packet-netbios.c:1144:16
    #1 0x73991d in call_dissector_through_handle /src/wireshark/epan/packet.c:887:9
    #2 0x73991d in call_dissector_work /src/wireshark/epan/packet.c:975:9
    #3 0x744574 in call_dissector_only /src/wireshark/epan/packet.c:3621:8
    #4 0x744574 in call_all_postdissectors /src/wireshark/epan/packet.c:4166:3
    #5 0x10906b7 in dissect_frame /src/wireshark/epan/dissectors/packet-frame.c:1438:5
    #6 0x73991d in call_dissector_through_handle /src/wireshark/epan/packet.c:887:9
    #7 0x73991d in call_dissector_work /src/wireshark/epan/packet.c:975:9
    #8 0x735417 in call_dissector_only /src/wireshark/epan/packet.c:3621:8
    #9 0x735417 in call_dissector_with_data /src/wireshark/epan/packet.c:3634:8
    #10 0x735417 in dissect_record /src/wireshark/epan/packet.c:687:3
    #11 0x726cb0 in epan_dissect_run /src/wireshark/epan/epan.c:666:2
    #12 0x5971f8 in LLVMFuzzerTestOneInput /src/wireshark/fuzz/fuzzshark.c:359:2
    #13 0x44bb70 in fuzzer::Fuzzer::ExecuteCallback(unsigned char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerLoop.cpp:614:13
    #14 0x436de5 in fuzzer::RunOneTest(fuzzer::Fuzzer*, char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:327:6
    #15 0x43c87f in fuzzer::FuzzerDriver(int*, char***, int (*)(unsigned char const*, unsigned long)) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:862:9
    #16 0x467b22 in main /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerMain.cpp:20:10
    #17 0x7f4ec79c5082 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x24082) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)
    #18 0x42efcd in _start (/out/fuzzshark+0x42efcd)

DEDUP_TOKEN: dissect_netbios--call_dissector_through_handle--call_dissector_work
0x000008653168 is located 0 bytes after global variable 'dissect_netb' defined in '/src/wireshark/epan/dissectors/packet-netbios.c:1016' (0x8653060) of size 264
SUMMARY: AddressSanitizer: global-buffer-overflow /src/wireshark/epan/dissectors/packet-netbios.c:1144:16 in dissect_netbios
Shadow bytes around the buggy address:
  0x000008652e80: f9 f9 f9 f9 00 00 00 00 00 00 00 00 00 00 00 00
  0x000008652f00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x000008652f80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x000008653000: 00 00 f9 f9 f9 f9 f9 f9 f9 f9 f9 f9 00 00 00 00
  0x000008653080: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
=>0x000008653100: 00 00 00 00 00 00 00 00 00 00 00 00 00[f9]f9 f9
  0x000008653180: f9 f9 f9 f9 f9 f9 f9 f9 00 00 00 00 00 00 00 00
  0x000008653200: 00 00 00 00 00 00 f9 f9 f9 f9 f9 f9 00 00 00 00
  0x000008653280: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x000008653300: 00 00 f9 f9 f9 f9 f9 f9 00 00 00 00 00 00 00 00
  0x000008653380: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
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
0x10,0x0,0xff,0xef,0xfa,0x0,
\020\000\377\357\372\000
subprocess command returned a non-zero exit status: 1
```
