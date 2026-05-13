# What functions and functionality is relevant?
The function `telnet_add_text` within `epan/dissectors/packet-telnet.c` is where the use-after-free occurs.

# Why is this vulnerable?
When you set the window size, a buffer is created so that the entire window can be stored line by line and displayed if necessary. When new data is passed to telnet, it is added line by line to this buffer. However, if you switch to line mode this buffer is freed but the flag for using a window is not unset. This allows an attacker to cause a use-after-free by sending data at this point.

# Is this a replay and/or is inspired by anything?
This is not a replay, but rather inspired by other use after free bugs discovered historically in wireshark.

# What makes it interesting?
This bug can be easily patched, but comprehending the lifetime of the heap object is non-trivial.

# Additional Information,📡 Telnet Protocol: Commands, Subnegotiation, and Window Configuration

The Telnet protocol, defined in **RFC 854**, enables bidirectional communication over a TCP connection. It includes mechanisms for negotiating terminal behavior using in-band signaling via control bytes.

---

## 🧠 Telnet Command Structure

Every Telnet command starts with the `IAC` (Interpret As Command) byte:

- `IAC` = `0xFF`

It is followed by a command byte, such as:

| Command | Hex | Description |
|---------|-----|-------------|
| `DO`    | `0xFD` | Request the other side to enable an option |
| `DONT`  | `0xFE` | Request the other side to disable an option |
| `WILL`  | `0xFB` | Offer to enable an option |
| `WONT`  | `0xFC` | Offer to disable an option |
| `SB`    | `0xFA` | Begin subnegotiation for option parameters |
| `SE`    | `0xF0` | End subnegotiation |

For more details, see **RFC 854, Section 3.3 ("Command Meanings")**.

---

## 🧩 Subnegotiation (SB ... SE)

For options that require additional configuration (like terminal type or window size), Telnet uses subnegotiation.

### Format:
```
IAC SB <option> <data...> IAC SE
```

This is used to exchange structured data for options such as:
- Terminal type
- Window size
- Line mode
- Environment variables

See **RFC 854, Section 3.4 ("Subnegotiation")**.

---

## 📏 NAWS – Negotiate About Window Size

Defined in **RFC 1073**, NAWS allows the client to send its terminal dimensions (columns and rows) to the server.

### Example:

**Negotiation:**
```
IAC DO NAWS     → FF FD 1F
IAC WILL NAWS   → FF FB 1F
```

**Subnegotiation (80x24 window):**
```
IAC SB NAWS 00 50 00 18 IAC SE
```

- `00 50` = 80 columns
- `00 18` = 24 rows

See **RFC 1073, Section 2**.

---

## 🖋️ LINEMODE – Line-by-Line Input

Described in **RFC 1184**, the LINEMODE option allows a Telnet client to switch to canonical (line-by-line) input mode rather than character-by-character.

### Example:

**Negotiation:**
```
IAC DO LINEMODE   → FF FD 22
IAC WILL LINEMODE → FF FB 22
```

**Subnegotiation to enable line mode:**
```
IAC SB LINEMODE SET-MODE 01 IAC SE
```

- `SET-MODE` = `0x01`
- `MODE_EDIT` flag = `0x01` (line input mode)

**Mode flags:**
| Flag | Value | Description               |
|------|-------|---------------------------|
| `MODE_EDIT` | `0x01` | Enable line mode         |
| `MODE_TRAPSIG` | `0x02` | Trap signals sent by user |
| `MODE_SOFT_TAB` | `0x04` | Use software tabs        |
| `MODE_LIT_ECHO` | `0x08` | Echo literal characters  |

See **RFC 1184, Sections 3.2 and 3.3**.

---

## 🔁 Mixing Commands and Data

Telnet commands are **interleaved** with user data in the same TCP stream. The `IAC` byte (`0xFF`) is used to escape into command mode.

### Example:
Hex stream:
```
48 65 6C 6C 6F 20 FF FD 01 57 6F 72 6C 64
```

Represents:
- `"Hello "` → Data
- `FF FD 01` → `IAC DO ECHO` (Telnet command)
- `"World"` → Data continues

Telnet parsers must scan for the `IAC` byte to correctly interpret command vs. data. See **RFC 854, Section 3.2 ("Data Representation")**.

---

## 📚 Relevant RFCs

| RFC     | Topic                                |
|---------|--------------------------------------|
| RFC 854 | Telnet Protocol Specification        |
| RFC 1073| NAWS: Negotiate About Window Size    |
| RFC 1184| LINEMODE: Line-by-Line Input Control |


## Example crash

```
=================================================================
==18==ERROR: AddressSanitizer: heap-use-after-free on address 0x51c000000880 at pc 0x0000005558c4 bp 0x7ffc5fb4d1c0 sp 0x7ffc5fb4c980
WRITE of size 4 at 0x51c000000880 thread T0
SCARINESS: 46 (4-byte-write-heap-use-after-free)
    #0 0x5558c3 in __asan_memcpy /src/llvm-project/compiler-rt/lib/asan/asan_interceptors_memintrinsics.cpp:63:3
    #1 0x81abaa in memcpy /usr/include/x86_64-linux-gnu/bits/string_fortified.h:34:10
    #2 0x81abaa in tvb_memcpy /src/wireshark/epan/tvbuff.c:945:10
    #3 0x82a48e in _tvb_get_raw_bytes_as_stringz /src/wireshark/epan/tvbuff.c:4047:3
    #4 0x82a48e in tvb_get_raw_bytes_as_stringz /src/wireshark/epan/tvbuff.c:4073:8
    #5 0x1e1b405 in telnet_add_text /src/wireshark/epan/dissectors/packet-telnet.c:2211:5
    #6 0x1e1ad50 in dissect_telnet /src/wireshark/epan/dissectors/packet-telnet.c:2337:9
    #7 0x73991d in call_dissector_through_handle /src/wireshark/epan/packet.c:887:9
    #8 0x73991d in call_dissector_work /src/wireshark/epan/packet.c:975:9
    #9 0x744574 in call_dissector_only /src/wireshark/epan/packet.c:3621:8
    #10 0x744574 in call_all_postdissectors /src/wireshark/epan/packet.c:4166:3
    #11 0x10906b7 in dissect_frame /src/wireshark/epan/dissectors/packet-frame.c:1438:5
    #12 0x73991d in call_dissector_through_handle /src/wireshark/epan/packet.c:887:9
    #13 0x73991d in call_dissector_work /src/wireshark/epan/packet.c:975:9
    #14 0x735417 in call_dissector_only /src/wireshark/epan/packet.c:3621:8
    #15 0x735417 in call_dissector_with_data /src/wireshark/epan/packet.c:3634:8
    #16 0x735417 in dissect_record /src/wireshark/epan/packet.c:687:3
    #17 0x726cb0 in epan_dissect_run /src/wireshark/epan/epan.c:666:2
    #18 0x5971f8 in LLVMFuzzerTestOneInput /src/wireshark/fuzz/fuzzshark.c:359:2
    #19 0x44bb70 in fuzzer::Fuzzer::ExecuteCallback(unsigned char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerLoop.cpp:614:13
    #20 0x436de5 in fuzzer::RunOneTest(fuzzer::Fuzzer*, char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:327:6
    #21 0x43c87f in fuzzer::FuzzerDriver(int*, char***, int (*)(unsigned char const*, unsigned long)) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:862:9
    #22 0x467b22 in main /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerMain.cpp:20:10
    #23 0x7f12e929a082 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x24082) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)
    #24 0x42efcd in _start (/out/fuzzshark+0x42efcd)

DEDUP_TOKEN: __asan_memcpy--memcpy--tvb_memcpy
0x51c000000880 is located 0 bytes inside of 1920-byte region [0x51c000000880,0x51c000001000)
freed by thread T0 here:
    #0 0x5576a6 in free /src/llvm-project/compiler-rt/lib/asan/asan_malloc_linux.cpp:52:3
    #1 0x2efd658 in wmem_simple_free /src/wireshark/wsutil/wmem/wmem_allocator_simple.c:54:5
    #2 0x1e1ab22 in telnet_sub_option /src/wireshark/epan/dissectors/packet-telnet.c:2099:9
    #3 0x1e1ab22 in telnet_command /src/wireshark/epan/dissectors/packet-telnet.c:2182:14
    #4 0x1e1ab22 in dissect_telnet /src/wireshark/epan/dissectors/packet-telnet.c:2322:16
    #5 0x73991d in call_dissector_through_handle /src/wireshark/epan/packet.c:887:9
    #6 0x73991d in call_dissector_work /src/wireshark/epan/packet.c:975:9
    #7 0x744574 in call_dissector_only /src/wireshark/epan/packet.c:3621:8
    #8 0x744574 in call_all_postdissectors /src/wireshark/epan/packet.c:4166:3
    #9 0x10906b7 in dissect_frame /src/wireshark/epan/dissectors/packet-frame.c:1438:5
    #10 0x73991d in call_dissector_through_handle /src/wireshark/epan/packet.c:887:9
    #11 0x73991d in call_dissector_work /src/wireshark/epan/packet.c:975:9
    #12 0x735417 in call_dissector_only /src/wireshark/epan/packet.c:3621:8
    #13 0x735417 in call_dissector_with_data /src/wireshark/epan/packet.c:3634:8
    #14 0x735417 in dissect_record /src/wireshark/epan/packet.c:687:3
    #15 0x726cb0 in epan_dissect_run /src/wireshark/epan/epan.c:666:2
    #16 0x5971f8 in LLVMFuzzerTestOneInput /src/wireshark/fuzz/fuzzshark.c:359:2
    #17 0x44bb70 in fuzzer::Fuzzer::ExecuteCallback(unsigned char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerLoop.cpp:614:13
    #18 0x436de5 in fuzzer::RunOneTest(fuzzer::Fuzzer*, char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:327:6
    #19 0x43c87f in fuzzer::FuzzerDriver(int*, char***, int (*)(unsigned char const*, unsigned long)) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:862:9
    #20 0x467b22 in main /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerMain.cpp:20:10
    #21 0x7f12e929a082 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x24082) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)

DEDUP_TOKEN: __interceptor_free--wmem_simple_free--telnet_sub_option
previously allocated by thread T0 here:
    #0 0x55793f in malloc /src/llvm-project/compiler-rt/lib/asan/asan_malloc_linux.cpp:68:3
    #1 0x2fe8988 in g_malloc (/out/fuzzshark+0x2fe8988)
    #2 0x1e1c17e in dissect_naws_subopt /src/wireshark/epan/dissectors/packet-telnet.c:652:29
    #3 0x1e1ab22 in telnet_sub_option /src/wireshark/epan/dissectors/packet-telnet.c:2099:9
    #4 0x1e1ab22 in telnet_command /src/wireshark/epan/dissectors/packet-telnet.c:2182:14
    #5 0x1e1ab22 in dissect_telnet /src/wireshark/epan/dissectors/packet-telnet.c:2322:16
    #6 0x73991d in call_dissector_through_handle /src/wireshark/epan/packet.c:887:9
    #7 0x73991d in call_dissector_work /src/wireshark/epan/packet.c:975:9
    #8 0x744574 in call_dissector_only /src/wireshark/epan/packet.c:3621:8
    #9 0x744574 in call_all_postdissectors /src/wireshark/epan/packet.c:4166:3
    #10 0x10906b7 in dissect_frame /src/wireshark/epan/dissectors/packet-frame.c:1438:5
    #11 0x73991d in call_dissector_through_handle /src/wireshark/epan/packet.c:887:9
    #12 0x73991d in call_dissector_work /src/wireshark/epan/packet.c:975:9
    #13 0x735417 in call_dissector_only /src/wireshark/epan/packet.c:3621:8
    #14 0x735417 in call_dissector_with_data /src/wireshark/epan/packet.c:3634:8
    #15 0x735417 in dissect_record /src/wireshark/epan/packet.c:687:3
    #16 0x726cb0 in epan_dissect_run /src/wireshark/epan/epan.c:666:2
    #17 0x5971f8 in LLVMFuzzerTestOneInput /src/wireshark/fuzz/fuzzshark.c:359:2
    #18 0x44bb70 in fuzzer::Fuzzer::ExecuteCallback(unsigned char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerLoop.cpp:614:13
    #19 0x436de5 in fuzzer::RunOneTest(fuzzer::Fuzzer*, char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:327:6
    #20 0x43c87f in fuzzer::FuzzerDriver(int*, char***, int (*)(unsigned char const*, unsigned long)) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:862:9
    #21 0x467b22 in main /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerMain.cpp:20:10
    #22 0x7f12e929a082 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x24082) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)

DEDUP_TOKEN: __interceptor_malloc--g_malloc--dissect_naws_subopt
SUMMARY: AddressSanitizer: heap-use-after-free /usr/include/x86_64-linux-gnu/bits/string_fortified.h:34:10 in memcpy
Shadow bytes around the buggy address:
  0x51c000000600: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x51c000000680: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x51c000000700: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x51c000000780: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 fa fa
  0x51c000000800: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
=>0x51c000000880:[fd]fd fd fd fd fd fd fd fd fd fd fd fd fd fd fd
  0x51c000000900: fd fd fd fd fd fd fd fd fd fd fd fd fd fd fd fd
  0x51c000000980: fd fd fd fd fd fd fd fd fd fd fd fd fd fd fd fd
  0x51c000000a00: fd fd fd fd fd fd fd fd fd fd fd fd fd fd fd fd
  0x51c000000a80: fd fd fd fd fd fd fd fd fd fd fd fd fd fd fd fd
  0x51c000000b00: fd fd fd fd fd fd fd fd fd fd fd fd fd fd fd fd
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
0xff,0xfa,0x1f,0x0,0x50,0x0,0x18,0xff,0xf0,0xff,0xfa,0x22,0x1,0x1,0xff,0xf0,0x61,0x61,0x61,0x61,
\377\372\037\000P\000\030\377\360\377\372\"\001\001\377\360aaaa
subprocess command returned a non-zero exit status: 1
```
