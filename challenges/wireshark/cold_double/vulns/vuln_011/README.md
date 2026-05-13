# What functions and functionality is relevant?
The `aim_get_buddyname` function contained within the `epan/dissectors/packet-aim.c` .

# Why is this vulnerable?
The vulnerability arises out of trusting the packet defined buddy name length to be within the proper bounds, however no checks require it to be under the allocated buffer size, leading to a heap buffer overflow.

# Is this a replay and/or is inspired by anything?
This challenge is inspired by historical vulnerabilities found within the AIM protocol and the challenge was made to be relatively easy for a CRS to identify as an homage to that era of hacking and exploitation.

# What makes it interesting?
This vulnerability exemplifies why trusting packet data / user or attacker supplied data is a poor security practice.

# Additional Information

This bug is embedded inside of AOL's Instant Messenger (AIM) protocol, where data sent is trusted to be
a correct offset inside of a aim_snac packet, causing a buffer overflow.

## Example crash

```
INFO: Running with entropic power schedule (0xFF, 100).
INFO: Seed: 2909221372
INFO: Loaded 1 modules   (420448 inline 8-bit counters): 420448 [0xabdaf90, 0xac419f0),
INFO: Loaded 1 PC tables (420448 PCs): 420448 [0xac419f0,0xb2abff0),
/out/fuzzshark: Running 1 inputs 100 time(s) each.
Running: /testcase
*** buffer overflow detected ***: terminated
AddressSanitizer:DEADLYSIGNAL
=================================================================
==18==ERROR: AddressSanitizer: ABRT on unknown address 0x000000000012 (pc 0x7f9ff592d00b bp 0x7ffecdee63c0 sp 0x7ffecdee6040 T0)
SCARINESS: 10 (signal)
    #0 0x7f9ff592d00b in raise (/lib/x86_64-linux-gnu/libc.so.6+0x4300b) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)
    #1 0x7f9ff590c858 in abort (/lib/x86_64-linux-gnu/libc.so.6+0x22858) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)
    #2 0x7f9ff5977265  (/lib/x86_64-linux-gnu/libc.so.6+0x8d265) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)
    #3 0x7f9ff5a19cd9 in __fortify_fail (/lib/x86_64-linux-gnu/libc.so.6+0x12fcd9) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)
    #4 0x7f9ff5a18575 in __chk_fail (/lib/x86_64-linux-gnu/libc.so.6+0x12e575) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)
    #5 0x9914e3 in memcpy /usr/include/x86_64-linux-gnu/bits/string_fortified.h:34:10
    #6 0x9914e3 in aim_get_buddyname /src/wireshark/epan/dissectors/packet-aim.c:591:3
    #7 0x9914e3 in dissect_aim_chat_outgoing_msg /src/wireshark/epan/dissectors/packet-aim.c:1976:21
    #8 0x98f3ef in dissect_aim_snac /src/wireshark/epan/dissectors/packet-aim.c:809:3
    #9 0x98f3ef in dissect_aim_pdu /src/wireshark/epan/dissectors/packet-aim.c:1618:3
    #10 0x1db4acf in tcp_dissect_pdus /src/wireshark/epan/dissectors/packet-tcp.c:5569:13
    #11 0x98c90d in dissect_aim /src/wireshark/epan/dissectors/packet-aim.c:1655:2
    #12 0x7399ed in call_dissector_through_handle /src/wireshark/epan/packet.c:887:9
    #13 0x7399ed in call_dissector_work /src/wireshark/epan/packet.c:975:9
    #14 0x744644 in call_dissector_only /src/wireshark/epan/packet.c:3621:8
    #15 0x744644 in call_all_postdissectors /src/wireshark/epan/packet.c:4166:3
    #16 0x10908e7 in dissect_frame /src/wireshark/epan/dissectors/packet-frame.c:1438:5
    #17 0x7399ed in call_dissector_through_handle /src/wireshark/epan/packet.c:887:9
    #18 0x7399ed in call_dissector_work /src/wireshark/epan/packet.c:975:9
    #19 0x7354e7 in call_dissector_only /src/wireshark/epan/packet.c:3621:8
    #20 0x7354e7 in call_dissector_with_data /src/wireshark/epan/packet.c:3634:8
    #21 0x7354e7 in dissect_record /src/wireshark/epan/packet.c:687:3
    #22 0x726d80 in epan_dissect_run /src/wireshark/epan/epan.c:666:2
    #23 0x5971f8 in LLVMFuzzerTestOneInput /src/wireshark/fuzz/fuzzshark.c:361:2
    #24 0x44bb70 in fuzzer::Fuzzer::ExecuteCallback(unsigned char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerLoop.cpp:614:13
    #25 0x436de5 in fuzzer::RunOneTest(fuzzer::Fuzzer*, char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:327:6
    #26 0x43c87f in fuzzer::FuzzerDriver(int*, char***, int (*)(unsigned char const*, unsigned long)) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:862:9
    #27 0x467b22 in main /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerMain.cpp:20:10
    #28 0x7f9ff590e082 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x24082) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)
    #29 0x42efcd in _start (/out/fuzzshark+0x42efcd)

DEDUP_TOKEN: raise--abort--
AddressSanitizer can not provide additional info.
SUMMARY: AddressSanitizer: ABRT (/lib/x86_64-linux-gnu/libc.so.6+0x4300b) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58) in raise
==18==ABORTING
```
