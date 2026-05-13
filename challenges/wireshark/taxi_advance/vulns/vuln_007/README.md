# What functions and functionality is relevant?
The vulnerable function in question is `json_string_unescape` in `epan/dissectors/packet-json.c`

# Why is this vulnerable?
In the JSON dissector this is used to check for valid unicode escape sequences. Typically JSON does not allow 32-bit Unicode but the patch adds functionality to parse it. However, part of the parsing subsystem requires setting a minimum and a maximum length. Rather than adding a separate parser for the '\U' escape sequence, the patch adds it to the same check as '\u'. This means that the validation only requires four characters to follow the escape sequence instead of 8 allowing for a heap-based overread to occur.

# Is this a replay and/or is inspired by anything?
This vulnerability was inspired by other parser vulnerabilities.

# What makes it interesting?
The vulnerability is fairly deep within the parser and the vulnerable behavior is due to a plugin, forcing a CRS to reason across a broader spectrum of components.

# Additional Information

🧩 What is JSON?

JSON (JavaScript Object Notation) is a lightweight, text-based data format used for structuring and transmitting data. It's easy for humans to read and write, and simple for machines to parse and generate. JSON represents data using key-value pairs, arrays, numbers, strings, booleans, and null. It's widely used in web APIs, configuration files, and data interchange between applications.

🌍 What is Unicode?

Unicode is a universal character encoding standard that assigns a unique number (called a code point) to every character, symbol, or emoji across all human languages and many technical symbols. For example, the letter A is U+0041, and the 🚀 emoji is U+1F680. Unicode allows computers to store and exchange text consistently, no matter the language or platform.

🔡 Unicode Encoding in JSON Using Escape Sequences

In JSON, text is always stored using Unicode, and characters can be written directly or encoded with escape sequences. The most common is \uXXXX, where XXXX is a 4-digit hexadecimal number representing a 16-bit code unit. For characters beyond U+FFFF (like many emojis), JSON uses UTF-16 surrogate pairs — two \u sequences that together represent a single character (e.g., \ud83d\ude80 = 🚀). While 16-bit Unicode covers the Basic Multilingual Plane (BMP), 32-bit Unicode includes all supplementary characters as well. JSON doesn’t natively support \UXXXXXXXX for full 32-bit values, so high code points must be split into surrogate pairs using 16-bit units.

## Example crash

```
=================================================================
==18==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x50300012dc43 at pc 0x000001464dcd bp 0x7fff856681b0 sp 0x7fff856681a8
READ of size 1 at 0x50300012dc43 thread T0
SCARINESS: 12 (1-byte-read-heap-buffer-overflow)
    #0 0x1464dcc in json_string_unescape /src/wireshark/epan/dissectors/packet-json.c:361:29
    #1 0x1464dcc in get_json_string /src/wireshark/epan/dissectors/packet-json.c:567:12
    #2 0x145f5ff in after_value /src/wireshark/epan/dissectors/packet-json.c
    #3 0x2e5ccec in execute_callbacks /src/wireshark/epan/tvbparse.c:946:39
    #4 0x2e5c8f4 in tvbparse_get /src/wireshark/epan/tvbparse.c:1007:9
    #5 0x145ecde in dissect_json /src/wireshark/epan/dissectors/packet-json.c:797:9
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
    #22 0x7f2a0bc80082 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x24082) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)
    #23 0x42efcd in _start (/out/fuzzshark+0x42efcd)

DEDUP_TOKEN: json_string_unescape--get_json_string--after_value
0x50300012dc43 is located 0 bytes after 19-byte region [0x50300012dc30,0x50300012dc43)
allocated by thread T0 here:
    #0 0x557d2c in realloc /src/llvm-project/compiler-rt/lib/asan/asan_malloc_linux.cpp:82:3
    #1 0x2fe975f in g_realloc (/out/fuzzshark+0x2fe975f)
    #2 0x2f08a92 in wmem_strbuf_finalize /src/wireshark/wsutil/wmem/wmem_strbuf.c:388:25
    #3 0x146301b in get_json_string /src/wireshark/epan/dissectors/packet-json.c:564:11
    #4 0x145f5ff in after_value /src/wireshark/epan/dissectors/packet-json.c
    #5 0x2e5ccec in execute_callbacks /src/wireshark/epan/tvbparse.c:946:39
    #6 0x2e5c8f4 in tvbparse_get /src/wireshark/epan/tvbparse.c:1007:9
    #7 0x145ecde in dissect_json /src/wireshark/epan/dissectors/packet-json.c:797:9
    #8 0x73991d in call_dissector_through_handle /src/wireshark/epan/packet.c:887:9
    #9 0x73991d in call_dissector_work /src/wireshark/epan/packet.c:975:9
    #10 0x744574 in call_dissector_only /src/wireshark/epan/packet.c:3621:8
    #11 0x744574 in call_all_postdissectors /src/wireshark/epan/packet.c:4166:3
    #12 0x10906b7 in dissect_frame /src/wireshark/epan/dissectors/packet-frame.c:1438:5
    #13 0x73991d in call_dissector_through_handle /src/wireshark/epan/packet.c:887:9
    #14 0x73991d in call_dissector_work /src/wireshark/epan/packet.c:975:9
    #15 0x735417 in call_dissector_only /src/wireshark/epan/packet.c:3621:8
    #16 0x735417 in call_dissector_with_data /src/wireshark/epan/packet.c:3634:8
    #17 0x735417 in dissect_record /src/wireshark/epan/packet.c:687:3
    #18 0x726cb0 in epan_dissect_run /src/wireshark/epan/epan.c:666:2
    #19 0x5971f8 in LLVMFuzzerTestOneInput /src/wireshark/fuzz/fuzzshark.c:359:2
    #20 0x44bb70 in fuzzer::Fuzzer::ExecuteCallback(unsigned char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerLoop.cpp:614:13
    #21 0x436de5 in fuzzer::RunOneTest(fuzzer::Fuzzer*, char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:327:6
    #22 0x43c87f in fuzzer::FuzzerDriver(int*, char***, int (*)(unsigned char const*, unsigned long)) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:862:9
    #23 0x467b22 in main /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerMain.cpp:20:10
    #24 0x7f2a0bc80082 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x24082) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)

DEDUP_TOKEN: __interceptor_realloc--g_realloc--wmem_strbuf_finalize
SUMMARY: AddressSanitizer: heap-buffer-overflow /src/wireshark/epan/dissectors/packet-json.c:361:29 in json_string_unescape
Shadow bytes around the buggy address:
  0x50300012d980: fa fa fd fd fd fa fa fa fd fd fd fa fa fa fd fd
  0x50300012da00: fd fa fa fa fd fd fd fa fa fa fd fd fd fa fa fa
  0x50300012da80: fd fd fd fa fa fa fd fd fd fa fa fa fd fd fd fa
  0x50300012db00: fa fa fd fd fd fa fa fa fd fd fd fa fa fa fd fd
  0x50300012db80: fd fa fa fa fd fd fd fa fa fa fd fd fd fd fa fa
=>0x50300012dc00: fd fd fd fa fa fa 00 00[03]fa fa fa 00 00 00 00
  0x50300012dc80: fa fa 00 00 02 fa fa fa fa fa fa fa fa fa fa fa
  0x50300012dd00: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x50300012dd80: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x50300012de00: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x50300012de80: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
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
0x7b,0xa,0x20,0x20,0x22,0x73,0x75,0x72,0x72,0x6f,0x67,0x61,0x74,0x65,0x73,0x22,0x3a,0x20,0x22,0x5c,0x55,0x30,0x30,0x30,0x30,0x64,0x38,0x33,0x64,0x5c,0x55,0x30,0x30,0x30,0x30,0x22,0xa,0x7d,0xa,0xa,
{\012  \"surrogates\": \"\\U0000d83d\\U0000\"\012}\012\012
subprocess command returned a non-zero exit status: 1
```
