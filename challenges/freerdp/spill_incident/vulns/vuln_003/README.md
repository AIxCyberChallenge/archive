# What functions and functionality is relevant?
The relevant function is the `rfx_process_message_metadata` function within `./libfreerdp/codec/rfx.c`.

# Why is this vulnerable?
Giving a client the ability to write arbitrary data to any location on the server memory allows the remote client to fully exploit and control the server by overwriting memory control structures, global variables, the stack, .DTORS, or any server memory.

# Is this a replay and/or is inspired by anything?
The inspiration for this vulnerability was older binary protocols in the very first versions of FreeRDP that had similar programming mistakes.

# What makes it interesting?
This vulnerability is interesting because not only is it fully exploitable for arbitrary remote code execution, but also that it is within a binary protocol that the CRS must be type and packet aware during PoV generation.

# Additional Information

FreeRDP is an open-source Remote Desktop Protocol (RDP) client that enables users to connect to Windows, Linux, and other RDP-compatible systems. It provides a lightweight, cross-platform, and extensible implementation of Microsoft's RDP, allowing seamless remote access with support for advanced authentication, multimedia redirection, USB forwarding, and clipboard sharing.

An optional metadata field within FreeRDP's security header is missing bounds checking and will allow the user to write to arbitrary memory in a specially crafted rfx_process_message.

## Example Crash

```
INFO:__main__:Running: docker run --privileged --shm-size=2g --platform linux/amd64 --rm -i -e HELPER=True -e ARCHITECTURE=x86_64 -v /home/shaex/oss-fuzz-aixcc/build/out/freerdp:/out -v /home/shaex/corpus/inp.corpus:/testcase -t ghcr.io/aixcc-finals/base-runner:9026aa3560acdf1a83b9a73a1bb03159a61aa2bb reproduce TestFuzzCoreServer -runs=100.
+ FUZZER=TestFuzzCoreServer
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
+ run_fuzzer TestFuzzCoreServer -runs=100 /testcase
vm.mmap_rnd_bits = 28
/out/TestFuzzCoreServer -rss_limit_mb=2560 -timeout=25 -runs=100 /testcase < /dev/null
INFO: Running with entropic power schedule (0xFF, 100).
INFO: Seed: 327055750
INFO: Loaded 1 modules   (70167 inline 8-bit counters): 70167 [0x55c5ffb34594, 0x55c5ffb457ab),
INFO: Loaded 1 PC tables (70167 PCs): 70167 [0x55c5ffb457b0,0x55c5ffc57920),
/out/TestFuzzCoreServer: Running 1 inputs 100 time(s) each.
Running: /testcase
[23:30:32:619] [14:0000000e] [WARN][com.freerdp.core.rdp] - [log_build_warn][0x519000000080]: *************************************************
[23:30:32:620] [14:0000000e] [WARN][com.freerdp.core.rdp] - [log_build_warn][0x519000000080]: This build is using [runtime-check] build options:
[23:30:32:620] [14:0000000e] [WARN][com.freerdp.core.rdp] - [log_build_warn][0x519000000080]: * 'WITH_VERBOSE_WINPR_ASSERT=ON'
[23:30:32:620] [14:0000000e] [WARN][com.freerdp.core.rdp] - [log_build_warn][0x519000000080]:
[23:30:32:620] [14:0000000e] [WARN][com.freerdp.core.rdp] - [log_build_warn][0x519000000080]: [runtime-check] build options might slow down the application
[23:30:32:620] [14:0000000e] [WARN][com.freerdp.core.rdp] - [log_build_warn][0x519000000080]: *************************************************
[23:30:32:620] [14:0000000e] [WARN][com.freerdp.core] - [freerdp_tcp_set_keep_alive_mode]: setsockopt() SOL_SOCKET, SO_KEEPALIVE
[23:30:32:620] [14:0000000e] [WARN][com.freerdp.core] - [freerdp_tcp_set_keep_alive_mode]: setsockopt() IPPROTO_TCP, TCP_KEEPIDLE
[23:30:32:620] [14:0000000e] [WARN][com.freerdp.core] - [freerdp_tcp_set_keep_alive_mode]: setsockopt() SOL_TCP, TCP_KEEPCNT
[23:30:32:621] [14:0000000e] [WARN][com.freerdp.core] - [freerdp_tcp_set_keep_alive_mode]: setsockopt() SOL_TCP, TCP_KEEPINTVL
[23:30:32:621] [14:0000000e] [WARN][com.freerdp.core] - [freerdp_tcp_set_keep_alive_mode]: setsockopt() SOL_TCP, TCP_USER_TIMEOUT
[23:30:32:621] [14:0000000e] [ERROR][com.freerdp.core.fastpath] - [fastpath_send_update_pdu]: fast path update size (2) exceeds the client's maximum request size (0)
[23:30:32:622] [14:0000000e] [ERROR][com.freerdp.core.fastpath] - [fastpath_recv_update]: Fastpath update Synchronize [3] failed, status 0
[23:30:32:622] [14:0000000e] [ERROR][com.freerdp.core.fastpath] - [fastpath_recv_update_data]: fastpath_recv_update() - -1
[23:30:32:622] [14:0000000e] [ERROR][com.freerdp.core.fastpath] - [fastpath_recv_updates]: fastpath_recv_update_data() fail
[23:30:32:622] [14:0000000e] [WARN][com.freerdp.core.rdp] - [rdp_read_security_header][0x519000000080]: invalid security header length, have 0, must be >= 4
[23:30:32:622] [14:0000000e] [ERROR][com.freerdp.core] - [tpdu_read_header]: tpdu length 88 > tpkt header length 0
[23:30:32:622] [14:0000000e] [WARN][com.freerdp.core.rdp] - [Stream_CheckAndLogRequiredLengthWLogExVa][0x519000000080]: [rdp_read_share_control_header(/src/FreeRDP/libfreerdp/core/rdp.c:314)] invalid length, got 169, require at least 16699 [element size=1]
[23:30:32:622] [14:0000000e] [WARN][com.freerdp.core.rdp] - [winpr_log_backtrace_ex][0x519000000080]: 0: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:622] [14:0000000e] [WARN][com.freerdp.core.rdp] - [winpr_log_backtrace_ex][0x519000000080]: 1: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:622] [14:0000000e] [WARN][com.freerdp.core.rdp] - [winpr_log_backtrace_ex][0x519000000080]: 2: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:622] [14:0000000e] [WARN][com.freerdp.core.rdp] - [winpr_log_backtrace_ex][0x519000000080]: 3: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:622] [14:0000000e] [WARN][com.freerdp.core.rdp] - [winpr_log_backtrace_ex][0x519000000080]: 4: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:622] [14:0000000e] [WARN][com.freerdp.core.rdp] - [winpr_log_backtrace_ex][0x519000000080]: 5: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:622] [14:0000000e] [WARN][com.freerdp.core.rdp] - [winpr_log_backtrace_ex][0x519000000080]: 6: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:622] [14:0000000e] [WARN][com.freerdp.core.rdp] - [winpr_log_backtrace_ex][0x519000000080]: 7: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:622] [14:0000000e] [WARN][com.freerdp.core.rdp] - [winpr_log_backtrace_ex][0x519000000080]: 8: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:622] [14:0000000e] [WARN][com.freerdp.core.rdp] - [winpr_log_backtrace_ex][0x519000000080]: 9: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:622] [14:0000000e] [WARN][com.freerdp.core.rdp] - [winpr_log_backtrace_ex][0x519000000080]: 10: dli_fname=/lib/x86_64-linux-gnu/libc.so.6 [0x7f0627177000], dli_sname=__libc_start_main [0x7f062719af90]
[23:30:32:622] [14:0000000e] [WARN][com.freerdp.core.rdp] - [winpr_log_backtrace_ex][0x519000000080]: 11: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:622] [14:0000000e] [WARN][com.freerdp.core.rdp] - [winpr_log_backtrace_ex][0x519000000080]: 12: unresolvable, address=(nil)
[23:30:32:622] [14:0000000e] [ERROR][com.freerdp.core.update] - [update_recv_altsec_window_order]: Stream short orderSize
[23:30:32:622] [14:0000000e] [ERROR][com.freerdp.core.surface] - [update_recv_surfcmds]: unknown cmdType 0x4141
[23:30:32:622] [14:0000000e] [ERROR][com.freerdp.core] - [tpdu_read_header]: tpdu length 65 > tpkt header length 0
[23:30:32:623] [14:0000000e] [WARN][com.winpr.wStream] - [Stream_CheckAndLogRequiredLengthWLogExVa]: [rdp_recv_demand_active(/src/FreeRDP/libfreerdp/core/capabilities.c:4528)] invalid length, got 126, require at least 22616 [element size=1]
[23:30:32:623] [14:0000000e] [WARN][com.winpr.wStream] - [winpr_log_backtrace_ex]: 0: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:623] [14:0000000e] [WARN][com.winpr.wStream] - [winpr_log_backtrace_ex]: 1: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:623] [14:0000000e] [WARN][com.winpr.wStream] - [winpr_log_backtrace_ex]: 2: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:623] [14:0000000e] [WARN][com.winpr.wStream] - [winpr_log_backtrace_ex]: 3: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:623] [14:0000000e] [WARN][com.winpr.wStream] - [winpr_log_backtrace_ex]: 4: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:623] [14:0000000e] [WARN][com.winpr.wStream] - [winpr_log_backtrace_ex]: 5: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:623] [14:0000000e] [WARN][com.winpr.wStream] - [winpr_log_backtrace_ex]: 6: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:623] [14:0000000e] [WARN][com.winpr.wStream] - [winpr_log_backtrace_ex]: 7: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:623] [14:0000000e] [WARN][com.winpr.wStream] - [winpr_log_backtrace_ex]: 8: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:623] [14:0000000e] [WARN][com.winpr.wStream] - [winpr_log_backtrace_ex]: 9: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:623] [14:0000000e] [WARN][com.winpr.wStream] - [winpr_log_backtrace_ex]: 10: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:623] [14:0000000e] [WARN][com.winpr.wStream] - [winpr_log_backtrace_ex]: 11: dli_fname=/lib/x86_64-linux-gnu/libc.so.6 [0x7f0627177000], dli_sname=__libc_start_main [0x7f062719af90]
[23:30:32:623] [14:0000000e] [WARN][com.winpr.wStream] - [winpr_log_backtrace_ex]: 12: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:623] [14:0000000e] [WARN][com.winpr.wStream] - [winpr_log_backtrace_ex]: 13: unresolvable, address=(nil)
[23:30:32:623] [14:0000000e] [WARN][com.freerdp.core.capabilities] - [Stream_CheckAndLogRequiredLengthWLogExVa]: [rdp_recv_confirm_active(/src/FreeRDP/libfreerdp/core/capabilities.c:4660)] invalid length, got 116, require at least 22532 [element size=1]
[23:30:32:623] [14:0000000e] [WARN][com.freerdp.core.capabilities] - [winpr_log_backtrace_ex]: 0: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:623] [14:0000000e] [WARN][com.freerdp.core.capabilities] - [winpr_log_backtrace_ex]: 1: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:623] [14:0000000e] [WARN][com.freerdp.core.capabilities] - [winpr_log_backtrace_ex]: 2: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:623] [14:0000000e] [WARN][com.freerdp.core.capabilities] - [winpr_log_backtrace_ex]: 3: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:623] [14:0000000e] [WARN][com.freerdp.core.capabilities] - [winpr_log_backtrace_ex]: 4: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:623] [14:0000000e] [WARN][com.freerdp.core.capabilities] - [winpr_log_backtrace_ex]: 5: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:623] [14:0000000e] [WARN][com.freerdp.core.capabilities] - [winpr_log_backtrace_ex]: 6: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:624] [14:0000000e] [WARN][com.freerdp.core.capabilities] - [winpr_log_backtrace_ex]: 7: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:624] [14:0000000e] [WARN][com.freerdp.core.capabilities] - [winpr_log_backtrace_ex]: 8: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:624] [14:0000000e] [WARN][com.freerdp.core.capabilities] - [winpr_log_backtrace_ex]: 9: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:624] [14:0000000e] [WARN][com.freerdp.core.capabilities] - [winpr_log_backtrace_ex]: 10: dli_fname=/lib/x86_64-linux-gnu/libc.so.6 [0x7f0627177000], dli_sname=__libc_start_main [0x7f062719af90]
[23:30:32:624] [14:0000000e] [WARN][com.freerdp.core.capabilities] - [winpr_log_backtrace_ex]: 11: dli_fname=/out/TestFuzzCoreServer [0x55c5fec5d000], dli_sname=(null) [(nil)]
[23:30:32:624] [14:0000000e] [WARN][com.freerdp.core.capabilities] - [winpr_log_backtrace_ex]: 12: unresolvable, address=(nil)
[23:30:32:624] [14:0000000e] [ERROR][com.freerdp.core] - [tpdu_read_header]: tpdu length 65 > tpkt header length 0
=================================================================
==14==ERROR: AddressSanitizer: heap-buffer-overflow on address 0x519000001d60 at pc 0x55c5ff4f76e1 bp 0x7ffc1b053710 sp 0x7ffc1b053708
WRITE of size 8 at 0x519000001d60 thread T0
SCARINESS: 42 (8-byte-write-heap-buffer-overflow)
    #0 0x55c5ff4f76e0 in Stream_Read /src/FreeRDP/winpr/include/winpr/stream.h:703:3
    #1 0x55c5ff4f76e0 in gcc_read_client_network_data /src/FreeRDP/libfreerdp/core/gcc.c:1875:3
    #2 0x55c5ff4f76e0 in gcc_read_client_data_blocks /src/FreeRDP/libfreerdp/core/gcc.c:617:10
    #3 0x55c5ff4f195b in gcc_read_conference_create_request /src/FreeRDP/libfreerdp/core/gcc.c:414:7
    #4 0x55c5ff43a1df in mcs_recv_connect_initial /src/FreeRDP/libfreerdp/core/mcs.c:700:7
    #5 0x55c5ff211efb in freerdp_is_valid_mcs_create_request /src/FreeRDP/libfreerdp/core/freerdp.c:1441:16
    #6 0x55c5ff199785 in test_server /src/FreeRDP/libfreerdp/core/test/TestFuzzCoreServer.c:82:3
    #7 0x55c5ff199785 in LLVMFuzzerTestOneInput /src/FreeRDP/libfreerdp/core/test/TestFuzzCoreServer.c:106:2
    #8 0x55c5ff050100 in fuzzer::Fuzzer::ExecuteCallback(unsigned char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerLoop.cpp:614:13
    #9 0x55c5ff03b375 in fuzzer::RunOneTest(fuzzer::Fuzzer*, char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:327:6
    #10 0x55c5ff040e0f in fuzzer::FuzzerDriver(int*, char***, int (*)(unsigned char const*, unsigned long)) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:862:9
    #11 0x55c5ff06c0b2 in main /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerMain.cpp:20:10
    #12 0x7f062719b082 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x24082) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)
    #13 0x55c5ff03355d in _start (/out/TestFuzzCoreServer+0x3d655d)

DEDUP_TOKEN: Stream_Read--gcc_read_client_network_data--gcc_read_client_data_blocks
0x519000001d60 is located 0 bytes after 992-byte region [0x519000001980,0x519000001d60)
allocated by thread T0 here:
    #0 0x55c5ff15c099 in calloc /src/llvm-project/compiler-rt/lib/asan/asan_malloc_linux.cpp:75:3
    #1 0x55c5ff43f4a6 in mcs_new /src/FreeRDP/libfreerdp/core/mcs.c:1436:34
    #2 0x55c5ff211ee4 in freerdp_is_valid_mcs_create_request /src/FreeRDP/libfreerdp/core/freerdp.c:1438:16
    #3 0x55c5ff199785 in test_server /src/FreeRDP/libfreerdp/core/test/TestFuzzCoreServer.c:82:3
    #4 0x55c5ff199785 in LLVMFuzzerTestOneInput /src/FreeRDP/libfreerdp/core/test/TestFuzzCoreServer.c:106:2
    #5 0x55c5ff050100 in fuzzer::Fuzzer::ExecuteCallback(unsigned char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerLoop.cpp:614:13
    #6 0x55c5ff03b375 in fuzzer::RunOneTest(fuzzer::Fuzzer*, char const*, unsigned long) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:327:6
    #7 0x55c5ff040e0f in fuzzer::FuzzerDriver(int*, char***, int (*)(unsigned char const*, unsigned long)) /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerDriver.cpp:862:9
    #8 0x55c5ff06c0b2 in main /src/llvm-project/compiler-rt/lib/fuzzer/FuzzerMain.cpp:20:10
    #9 0x7f062719b082 in __libc_start_main (/lib/x86_64-linux-gnu/libc.so.6+0x24082) (BuildId: 0323ab4806bee6f846d9ad4bccfc29afdca49a58)

DEDUP_TOKEN: __interceptor_calloc--mcs_new--freerdp_is_valid_mcs_create_request
SUMMARY: AddressSanitizer: heap-buffer-overflow /src/FreeRDP/winpr/include/winpr/stream.h:703:3 in Stream_Read
Shadow bytes around the buggy address:
  0x519000001a80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x519000001b00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x519000001b80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x519000001c00: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
  0x519000001c80: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
=>0x519000001d00: 00 00 00 00 00 00 00 00 00 00 00 00[fa]fa fa fa
  0x519000001d80: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x519000001e00: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x519000001e80: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x519000001f00: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
  0x519000001f80: fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa fa
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
