# What functions and functionality is relevant?
The vulnerable function in question is `dissect_interface_identification_object` contained within `epan/dissectors/packet-icmp.c`

# Why is this vulnerable?
 To do the check, the name is first copied into a local, statically sized buffer. If the name is too large it can lead to a stack based buffer overflow.

# Is this a replay and/or is inspired by anything?
This is inspired by other stack based buffer overflows in packet parsing software.

# What makes it interesting?
The bug itself is fairly basic but is decently deep in the call chain so will require some reasoning about how to reach it. Additional functionality was added to ensure that all characters in the interface identification name are printable. If one is not then parsing on the object halts.

# Additional Information,📡 ICMP, ICMP Extensions, and the Echo Identification Extension

## 🧠 What is ICMP?

**ICMP (Internet Control Message Protocol)** is a fundamental part of the IP suite, defined in [RFC 792](https://datatracker.ietf.org/doc/html/rfc792). It is used by network devices to send error messages and operational information, such as:

- "Destination Unreachable"
- "Time Exceeded"
- "Echo Request" / "Echo Reply" (used by `ping`)

ICMP messages are encapsulated directly within IP packets and do **not use ports**, unlike TCP/UDP.

---

## ✨ ICMP Extensions (RFC 4884)

**ICMP Extensions** were introduced to allow ICMP messages to carry **additional structured data** without breaking compatibility. This is especially useful in more advanced or diagnostic environments (e.g., MPLS networks, VPN diagnostics, or segment routing).

### 🔧 Key Details (RFC 4884):

- Applies to **ICMP error messages** and **Type 42** (Extended Echo Request/Reply).
- An ICMP message may contain **zero or more extensions**.
- Each extension has:
  - A **4-byte header**
    - 2 bytes: **Class-Num** (defines extension type group)
    - 1 byte: **C-Type** (specific type)
    - 1 byte: Reserved
  - A **variable-length value**, padded to 4-byte alignment
- The ICMP header includes a `NumExtensions` field (for Type 42) to indicate how many extensions are present.

---

## 📥 ICMPv4 Extended Echo Request (Type 42)

- **ICMP Type**: `42` (Extended Echo Request)
- **ICMP Code**: `0`
- Used similarly to a normal ping, but supports embedded **extensions**
- Defined in [RFC 8335](https://datatracker.ietf.org/doc/html/rfc8335) and [RFC 4884](https://datatracker.ietf.org/doc/html/rfc4884)

---

## 🪪 Echo Identification Extension (RFC 5837)

The **Echo Identification Extension** allows an ICMP Extended Echo packet to include metadata identifying the interface and address that should be used to respond. This is useful for:

- Network diagnostics
- Topology mapping
- Probing per-interface paths

### 📦 Echo Identification Format

| Field          | Length | Description                          |
|----------------|--------|--------------------------------------|
| Class-Num      | 2 bytes | `2` (as per RFC 5837)                |
| C-Type         | 1 byte  | Varies depending on sub-option       |
| Reserved       | 1 byte  | Reserved, set to 0                   |
| Value          | varies | Depends on type (see below)          |

### 🧾 Echo ID Sub-Options (Class 2)

| C-Type | Description                            | Typical Use                      |
|--------|----------------------------------------|----------------------------------|
| `1`    | Interface Index                        | Identifies responding interface  |
| `2`    | Interface Name                         | Human-readable name (e.g., `eth0`) |
| `3`    | IPv4 Address                           | Specifies interface address      |
| `4`    | IPv6 Address                           | For IPv6 probes                  |
| `5`    | MPLS Label Stack Entry                 | For MPLS path analysis           |

Each of these options is encoded with the standard extension header, followed by the option-specific data (e.g., a 4-byte IPv4 address for C-Type 3).

---

### 🛠️ Example: Interface Name Option

The following is a rough layout of an **Interface Name Echo ID Extension** (Class-Num = 2, C-Type = 2):

```plaintext
+------------+------------+------------+------------+
| 0x00 0x02  | 0x02       | 0x00       | Length = 3 |
+------------+------------+------------+------------+
|    "e"     |   "t"      |   "h"      |   "0"      |
+------------+------------+------------+------------+
```

- Class-Num: `0x0002`
- C-Type: `0x02`
- Length: In 32-bit words (including header)
- Payload: `"eth0"`

---

## 🚦 Use Cases

- Topology discovery in enterprise or backbone networks
- Verifying return-path interfaces
- Mapping router interface-level responses
- Debugging multi-path or per-hop behavior

---

## ⚠️ Compatibility Notes

- ICMP Extensions are **not widely supported** on general-purpose OSes
- They are mostly used in **routers**, **diagnostic appliances**, or **testbeds**
- If unsupported, Type 42 packets may be dropped silently

---

## 📚 References

- RFC 792 – Internet Control Message Protocol
- RFC 4884 – Extended ICMP for Multi-Part Messages
- RFC 5837 – Echo Request/Reply Identifier Extensions
- RFC 8335 – MPLS and ICMP Extensions

---

## Example crash

```
=================================================================
==18==ERROR: AddressSanitizer: stack-buffer-overflow on address 0x7f4ddd181aa0 at pc 0x0000005558c4 bp 0x7ffee114d2d0 sp 0x7ffee114ca90
WRITE of size 256 at 0x7f4ddd181aa0 thread T0
SCARINESS: 60 (multi-byte-write-stack-buffer-overflow)
    #0 0x5558c3 in __asan_memcpy /src/llvm-project/compiler-rt/lib/asan/asan_interceptors_memintrinsics.cpp:63:3
    #1 0x81ac2a in memcpy /usr/include/x86_64-linux-gnu/bits/string_fortified.h:34:10
    #2 0x81ac2a in tvb_memcpy /src/wireshark/epan/tvbuff.c:945:10
    #3 0x12817d9 in dissect_interface_identification_object /src/wireshark/epan/dissectors/packet-icmp.c:934:4
    #4 0x12817d9 in dissect_icmp_extension /src/wireshark/epan/dissectors/packet-icmp.c:1107:8
    #5 0x127e720 in dissect_icmp /src/wireshark/epan/dissectors/packet-icmp.c
    #6 0x73999d in call_dissector_through_handle /src/wireshark/epan/packet.c:887:9
    #7 0x73999d in call_dissector_work /src/wireshark/epan/packet.c:975:9
    #8 0x7445f4 in call_dissector_only /src/wireshark/epan/packet.c:3621:8
    #9 0x7445f4 in call_all_postdissectors /src/wireshark/epan/packet.c:4166:3
    #10 0x1090737 in dissect_frame /src/wireshark/epan/dissectors/packet-frame.c:1438:5
    #11 0x73999d in call_dissector_through_handle /src/wireshark/epan/packet.c:887:9
    #12 0x73999d in call_dissector_work /src/wireshark/epan/packet.c:975:9
    #13 0x735497 in call_dissector_only /src/wireshark/epan/packet.c:3621:8
    #14 0x735497 in call_dissector_with_data /src/wireshark/epan/packet.c:3634:8
    #15 0x735497 in dissect_record /src/wireshark/epan/packet.c:687:3
    #16 0x726d30 in epan_dissect_run /src/wireshark/epan/epan.c:666:2
    #17 0x59722b in LLVMFuzzerTestOneInput /src/wireshark/fuzz/fuzzshark.c:360:2
    #18 0x44bb70 in fuzzer::Fuzzer::ExecuteCallback(unsigned char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerLoop.cpp:614:13
    #19 0x436de5 in fuzzer::RunOneTest(fuzzer::Fuzzer*, char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:327:6
    #20 0x43c87f in fuzzer::FuzzerDriver(int*, char***, int (*)(unsigned char const*, unsigned long)) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:862:9
    #21 0x467b22 in main /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerMain.cpp:20:10
    #22 0x7f4ddd90b082 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x24082) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)
    #23 0x42efcd in _start (/out/fuzzshark+0x42efcd)

DEDUP_TOKEN: __asan_memcpy--memcpy--tvb_memcpy
Address 0x7f4ddd181aa0 is located in stack of thread T0 at offset 160 in frame
    #0 0x128042f in dissect_icmp_extension /src/wireshark/epan/dissectors/packet-icmp.c:979

DEDUP_TOKEN: dissect_icmp_extension
  This frame has 5 object(s):
    [32, 160) 'ident_name.i' (line 904)
    [192, 196) 'afi.i' (line 906) <== Memory access at offset 160 partially underflows this variable
    [208, 212) 'addr_length.i' (line 907) <== Memory access at offset 160 partially underflows this variable
    [224, 232) 'tf_entry.i' (line 673) <== Memory access at offset 160 partially underflows this variable
    [256, 264) 'tf_object' (line 985) <== Memory access at offset 160 partially underflows this variable
HINT: this may be a false positive if your program uses some custom stack unwind mechanism, swapcontext or vfork
      (longjmp and C++ exceptions *are* supported)
SUMMARY: AddressSanitizer: stack-buffer-overflow /usr/include/x86_64-linux-gnu/bits/string_fortified.h:34:10 in memcpy
Shadow bytes around the buggy address:
  0x7f4ddd181800: f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5
  0x7f4ddd181880: f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5
  0x7f4ddd181900: f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5
  0x7f4ddd181980: f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5
  0x7f4ddd181a00: f1 f1 f1 f1 00 00 00 00 00 00 00 00 00 00 00 00
=>0x7f4ddd181a80: 00 00 00 00[f2]f2 f2 f2 04 f2 04 f2 f8 f2 f2 f2
  0x7f4ddd181b00: 00 f3 f3 f3 00 00 00 00 00 00 00 00 00 00 00 00
  0x7f4ddd181b80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x7f4ddd181c00: f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5
  0x7f4ddd181c80: f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5
  0x7f4ddd181d00: f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5 f5
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
subprocess command returned a non-zero exit status: 1
```
