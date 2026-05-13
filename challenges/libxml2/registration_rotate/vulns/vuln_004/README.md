# What functions and functionality is relevant?
The `UTF32ToUTF8` function within `./src/libxml2/encoding.c` contains the code that will become vulnerable upon running due to the assumptions built in by the character conversion code in `xmlParserInputBufferGrow` within `./src/libxml2/xmlIO.c`

# Why is this vulnerable?
The code that manages the character conversion code creates a target buffer that is exactly 2 x times larger than the original buffer. This is large enough to hold most character conversion, but not the conversion from UTF32 to UTF-8 (converting one UTF32 character to four UTF-8 characters).

# Is this a replay and/or is inspired by anything?
This is not a replay, rather a custom vulnerability.

# What makes it interesting?
This vulnerability was inspired by the idea of "Is it possible to insert non-vulnerable code to introduce a vulnerability". The idea was to write a character conversion plugin that didn't immediately have a vulnerability, but rather induced one due to constraints outside of the plugin.

# Additional Information

Heap Based Buffer Overflow in UTF-32 implementation.

The goal of this challenge is to test CRS' ability to comprehend disconnected
parts of code. The encoders in libxml2 are written in a generic way, where
first an encoder is loaded into a function pointer based on libxml2's detection
based on reading the first few bytes of the file. Then, much later in the code,
encoders are called to ingest the file, and there are baseline assumptions of
a certain buffer size constraint; and when this new code is added (there aren't
implicit vulnerabilities in the new added code), it violates this assumption.
So, apart from libxml2, there is no bug in the UTF-32 encoder if supplied with
proper data, but the assumptions in libxml2 will cause an exploitable bug to be
to be present with this disconnect.

To recreate crash:
```bash
export LIBXMLPATH=~/libxml2 # replace this with your path
python3 infra/helper.py build_image libxml2
python3 infra/helper.py build_fuzzers libxml2 $"LIBXMLPATH"/
python3 infra/helper.py reproduce libxml2 html  $"LIBXMLPATH"/.aixcc/vulns/vuln_id_004/blobs/trigger.xml
```

```
==14==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x523000003471 at pc 0x559888439ff5 bp 0x7fffbe174e90 sp 0x7fffbe174e88
WRITE of size 1 at 0x523000003471 thread T0
SCARINESS: 31 (1-byte-write-heap-buffer-overflow)
    #0 0x559888439ff4 in UTF32ToUTF8 /src/libxml2/encoding.c:2875:20
    #1 0x559888434ad4 in xmlEncInputChunk /src/libxml2/encoding.c:1492:15
    #2 0x559888434ad4 in xmlCharEncInput /src/libxml2/encoding.c:1618:15
    #3 0x55988827d576 in xmlParserInputBufferGrow /src/libxml2/xmlIO.c:2213:6
    #4 0x5598882012d1 in xmlParserGrow /src/libxml2/parserInternals.c:585:11
    #5 0x5598882acdcb in htmlParseCharData /src/libxml2/HTMLparser.c:3033:21
    #6 0x559888297199 in htmlParseContent /src/libxml2/HTMLparser.c:4142:13
    #7 0x55988829abcb in htmlParseDocument /src/libxml2/HTMLparser.c:4415:5
    #8 0x5598882a2e72 in htmlCtxtParseDocument /src/libxml2/HTMLparser.c:5927:5
    #9 0x55988818fa28 in LLVMFuzzerTestOneInput /src/libxml2/fuzz/html.c:49:15
    #10 0x559888044410 in fuzzer::Fuzzer::ExecuteCallback(unsigned char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerLoop.cpp:614:13
    #11 0x55988802f685 in fuzzer::RunOneTest(fuzzer::Fuzzer*, char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:327:6
    #12 0x55988803511f in fuzzer::FuzzerDriver(int*, char***, int (*)(unsigned char const*, unsigned long)) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:862:9
    #13 0x5598880603c2 in main /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerMain.cpp:20:10
    #14 0x7ff6ca3a6082 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x24082) (BuildId: 0702430aef5fa3dda43986563e9ffcc47efbd75e)
    #15 0x55988802786d in _start (/out/html+0x1aa86d)

DEDUP_TOKEN: UTF32ToUTF8--xmlEncInputChunk--xmlCharEncInput
0x523000003471 is located 0 bytes after 6001-byte region [0x523000001d00,0x523000003471)
allocated by thread T0 here:
    #0 0x5598881501df in malloc /src/llvm-project/compiler-rt/lib/asan/asan_malloc_linux.cpp:68:3
    #1 0x55988818ff38 in xmlFuzzMalloc /src/libxml2/fuzz/fuzz.c:127:11
    #2 0x5598884219c9 in xmlBufCreate /src/libxml2/buf.c:140:16
    #3 0x559888203d7f in xmlInputSetEncodingHandler /src/libxml2/parserInternals.c:1316:11
    #4 0x559888203387 in xmlSwitchToEncoding /src/libxml2/parserInternals.c:1399:12
    #5 0x559888203387 in xmlSwitchEncoding /src/libxml2/parserInternals.c:1194:11
    #6 0x559888204bea in xmlDetectEncoding /src/libxml2/parserInternals.c:1521:13
    #7 0x559888299630 in htmlParseDocument /src/libxml2/HTMLparser.c:4346:5
    #8 0x5598882a2e72 in htmlCtxtParseDocument /src/libxml2/HTMLparser.c:5927:5
    #9 0x55988818fa28 in LLVMFuzzerTestOneInput /src/libxml2/fuzz/html.c:49:15
    #10 0x559888044410 in fuzzer::Fuzzer::ExecuteCallback(unsigned char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerLoop.cpp:614:13
    #11 0x55988802f685 in fuzzer::RunOneTest(fuzzer::Fuzzer*, char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:327:6
    #12 0x55988803511f in fuzzer::FuzzerDriver(int*, char***, int (*)(unsigned char const*, unsigned long)) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:862:9
    #13 0x5598880603c2 in main /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerMain.cpp:20:10
    #14 0x7ff6ca3a6082 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x24082) (BuildId: 0702430aef5fa3dda43986563e9ffcc47efbd75e)

DEDUP_TOKEN: __interceptor_malloc--xmlFuzzMalloc--xmlBufCreate
SUMMARY: AddressSanitizer: heap-buffer-overflow /src/libxml2/encoding.c:2875:20 in UTF32ToUTF8
Shadow bytes around the buggy address:
  0x523000003180: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x523000003200: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x523000003280: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x523000003300: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x523000003380: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
=>0x523000003400: 00 00 00 00 00 00 00 00 00 00 00 00 00 00[01]fa
  0x523000003480: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x523000003500: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x523000003580: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x523000003600: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x523000003680: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
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
==14==ABORTING
```
