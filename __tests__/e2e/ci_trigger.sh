#!/bin/bash

# 不需要使用到 build 和 local 指令的测试集合均可以加到这里
# 需要 build 和 local 指令测试的集合会在 github action 中实现

# export FC_CLIENT_CONNECT_TIMEOUT=3
# export FC_CLIENT_READ_TIMEOUT=5

cd trigger && ./run cd -