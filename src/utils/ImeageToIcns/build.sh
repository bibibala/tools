#!/bin/zsh
emcc fun.c -o fun.js \
    -s MODULARIZE=1 \
    -s EXPORT_ES6=1 \
    -s INITIAL_MEMORY=64MB \
    -s ALLOW_MEMORY_GROWTH=1 \
    -s EXPORTED_FUNCTIONS="['_wasm_convert_to_icns']" \
    -s EXPORTED_RUNTIME_METHODS="['ccall','cwrap','FS_writeFile','FS_readFile','FS_unlink']"

