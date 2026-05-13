# What functions and functionality is relevant?
The function in question is `dissect_register` contained within `epan/dissectors/packet-gvcp.c`.

# Why is this vulnerable?
There is a global array to store the registers and their respective values. If the packet contains more than 16 registers that is being written to then a global buffer overflow occurs. The data length field divided by 8 is how the codes calculates the number of writes.

# Is this a replay and/or is inspired by anything?
This vulnerability was inspired by historical global buffer overflow vulnerabilities present within wireshark.

# What makes it interesting?
The "write register value to set state" pattern is a common one among not only these types of network protocols, but also firmware software. Correctly bounding and ensuring that global variable access/read/write overflows do not occur are a staple of good programming practices, so this vulnerability is representative of a "newer" or a less experienced programmer introducing a bug into a codebase.

# Additional Information, GigE Vision Control Protocol (GVCP) Overview

GVCP (GigE Vision Control Protocol) is a UDP-based protocol used in the **GigE Vision** standard to communicate with industrial cameras over Ethernet. It handles **device discovery**, **configuration**, and **register-level control**, allowing software on a host PC to interact with camera hardware in a standardized way.

GVCP typically uses **UDP port 3956** and supports commands like register read/write, memory access, and event handling. It operates alongside GVSP (GigE Vision Streaming Protocol), which is responsible for streaming image data.

## Writing Registers with GVCP

Writing to a register is performed using the `WRITEREG_CMD` command, identified by **opcode `0x0082`**. This command allows a host to send a 32-bit value to a 32-bit register address on the device.

### WRITEREG Packet Format

| Field            | Size     | Description                          |
|------------------|----------|--------------------------------------|
| Flags            | 1 bytes  | Packet Flags                         |
| Opcode           | 2 bytes  | Command type (`0x0082` for WRITEREG) |
| Data Length      | 2 bytes  | Length of the data after Request ID  |
| Request ID       | 2 bytes  | Used to match responses with requests|
| Register Address | 4 bytes  | Target register to write to          |
| Value            | 4 bytes  | 32-bit value to be written           |

These packets are typically sent directly over UDP without a handshake, and the device may respond with a `WRITEREG_ACK` if acknowledgment is supported or required.

Register writing is commonly used to:
- Set camera parameters (e.g., exposure, gain, trigger mode)
- Issue control commands (e.g., start/stop streaming)
- Modify device behavior at runtime

Care must be taken not to write to protected or reserved registers unless explicitly allowed by the device's documentation.

---

## Example crash

```
=================================================================
==18==ERROR: AddressSanitizer: global-buffer-overflow on address 0x00001168c900 at pc 0x00000120ad7a bp 0x7fff2caa3f70 sp 0x7fff2caa3f68
WRITE of size 4 at 0x00001168c900 thread T0
SCARINESS: 36 (4-byte-write-global-buffer-overflow)
    #0 0x120ad79 in dissect_register /src/wireshark/epan/dissectors/packet-gvcp.c:984:44
    #1 0x120690f in dissect_writereg_cmd /src/wireshark/epan/dissectors/packet-gvcp.c:1844:5
    #2 0x120690f in dissect_gvcp /src/wireshark/epan/dissectors/packet-gvcp.c:2766:4
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
    #19 0x7f1c559e0082 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x24082) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)
    #20 0x42efcd in _start (/out/fuzzshark+0x42efcd)

DEDUP_TOKEN: dissect_register--dissect_writereg_cmd--dissect_gvcp
0x00001168c900 is located 32 bytes before global variable 'gvcp_register_value' defined in '/src/wireshark/epan/dissectors/packet-gvcp.c:282' (0x1168c920) of size 64
0x00001168c900 is located 0 bytes after global variable 'gvcp_register_number' defined in '/src/wireshark/epan/dissectors/packet-gvcp.c:281' (0x1168c8c0) of size 64
SUMMARY: AddressSanitizer: global-buffer-overflow /src/wireshark/epan/dissectors/packet-gvcp.c:984:44 in dissect_register
Shadow bytes around the buggy address:
  0x00001168c680: 04 f9 f9 f9 04 f9 f9 f9 04 f9 f9 f9 04 f9 f9 f9
  0x00001168c700: 04 f9 f9 f9 04 f9 f9 f9 04 f9 f9 f9 00 f9 f9 f9
  0x00001168c780: 00 f9 f9 f9 00 f9 f9 f9 00 f9 f9 f9 00 f9 f9 f9
  0x00001168c800: 00 f9 f9 f9 04 f9 f9 f9 01 f9 f9 f9 00 f9 f9 f9
  0x00001168c880: 00 f9 f9 f9 04 f9 f9 f9 00 00 00 00 00 00 00 00
=>0x00001168c900:[f9]f9 f9 f9 00 00 00 00 00 00 00 00 f9 f9 f9 f9
  0x00001168c980: 00 f9 f9 f9 04 f9 f9 f9 04 f9 f9 f9 04 f9 f9 f9
  0x00001168ca00: 04 f9 f9 f9 04 f9 f9 f9 04 f9 f9 f9 04 f9 f9 f9
  0x00001168ca80: 04 f9 f9 f9 04 f9 f9 f9 04 f9 f9 f9 04 f9 f9 f9
  0x00001168cb00: 04 f9 f9 f9 04 f9 f9 f9 04 f9 f9 f9 04 f9 f9 f9
  0x00001168cb80: 04 f9 f9 f9 04 f9 f9 f9 04 f9 f9 f9 04 f9 f9 f9
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
