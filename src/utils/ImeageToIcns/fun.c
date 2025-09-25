// fun.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>

#define STB_IMAGE_IMPLEMENTATION
#define STB_IMAGE_RESIZE_IMPLEMENTATION
#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image.h"
#include "stb_image_resize.h"
#include "stb_image_write.h"

// 如果用 emscripten，会使用这个宏导出
#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#else
#define EMSCRIPTEN_KEEPALIVE
#endif

// ICNS文件头结构
typedef struct {
    char magic[4];      // 'icns'
    uint32_t length;    // 文件总长度（big-endian 写入）
} icns_header_t;

// ICNS图标条目头
typedef struct {
    char type[4];       // 图标类型
    uint32_t length;    // 条目长度（包括头部8字节，big-endian）
} icns_entry_header_t;

// ICNS图标尺寸和类型映射
typedef struct {
    const char* type;
    int size;
    int is_retina;
} icns_size_map_t;

static const icns_size_map_t icns_sizes[] = {
    {"ic10", 1024, 0},
    {"ic09", 512, 0},
    {"ic14", 512, 1},
    {"ic08", 256, 0},
    {"ic13", 256, 1},
    {"ic07", 128, 0},
    {"ic12", 64, 1},
    {"ic11", 32, 1},
    {"ic05", 64, 0},
    {"ic04", 32, 0},
    {"ic06", 48, 0},
    {"ic03", 16, 0},
    {NULL, 0, 0}
};

// 大端序转换
static uint32_t to_big_endian(uint32_t value) {
    return ((value & 0xFF) << 24) |
           (((value >> 8) & 0xFF) << 16) |
           (((value >> 16) & 0xFF) << 8) |
           ((value >> 24) & 0xFF);
}

// 内存写入回调（用于 stbi_write_png_to_func）
typedef struct {
    unsigned char* data;
    size_t size;
    size_t capacity;
} memory_buffer_t;

static void png_write_callback(void* context, void* data, int size) {
    memory_buffer_t* buffer = (memory_buffer_t*)context;
    if (!buffer) return;
    if (buffer->size + (size_t)size > buffer->capacity) {
        size_t newcap = (buffer->size + (size_t)size) * 2;
        if (newcap < 1024) newcap = 1024;
        buffer->data = (unsigned char*)realloc(buffer->data, newcap);
        buffer->capacity = newcap;
    }
    memcpy(buffer->data + buffer->size, data, size);
    buffer->size += size;
}

// 生成 PNG 数据（返回 malloc 出来的 buffer，调用方负责 free）
static unsigned char* create_png_data(unsigned char* image_data, int width, int height,
                              int channels, size_t* png_size) {
    if (!image_data || width <= 0 || height <= 0) {
        *png_size = 0;
        return NULL;
    }

    memory_buffer_t buffer;
    buffer.size = 0;
    buffer.capacity = (size_t)width * (size_t)height * (size_t)channels + 1024;
    if (buffer.capacity < 4096) buffer.capacity = 4096;
    buffer.data = (unsigned char*)malloc(buffer.capacity);
    if (!buffer.data) {
        *png_size = 0;
        return NULL;
    }

    // NOTE: stbi_write_png_to_func 写的是完整的 PNG（包含压缩）
    stbi_write_png_to_func(png_write_callback, &buffer,
                           width, height, channels, image_data, width * channels);

    *png_size = buffer.size;
    return buffer.data;
}

// 实际转换函数（不导出名改为 CamelCase 以便与 JS 交互）
#ifdef __cplusplus
extern "C" {
#endif

EMSCRIPTEN_KEEPALIVE
int convertToICNS(const char* input_path, const char* output_path) {
    if (!input_path || !output_path) {
        fprintf(stderr, "参数不能为空\n");
        return -1;
    }

    int width = 0, height = 0, channels_in_file = 0;
    // 强制读取为 RGBA（4）
    unsigned char* image_data = stbi_load(input_path, &width, &height, &channels_in_file, 4);
    if (!image_data) {
        fprintf(stderr, "无法加载图像: %s\n", input_path);
        return -1;
    }
    const int channels = 4; // RGBA

    FILE* output = fopen(output_path, "wb");
    if (!output) {
        fprintf(stderr, "无法创建输出文件: %s\n", output_path);
        stbi_image_free(image_data);
        return -1;
    }

    // 写 icns header 占位（4 字节 magic + 4 字节 length）
    icns_header_t header;
    memcpy(header.magic, "icns", 4);
    header.length = 0;
    fwrite(&header, sizeof(header), 1, output);

    size_t total_size = sizeof(icns_header_t);

    for (int i = 0; icns_sizes[i].type != NULL; ++i) {
        int size = icns_sizes[i].size;
        if (icns_sizes[i].is_retina) size *= 2;

        // 分配 resized buffer
        unsigned char* resized = (unsigned char*)malloc((size_t)size * size * channels);
        if (!resized) {
            fprintf(stderr, "内存分配失败: %dx%d\n", size, size);
            continue;
        }

        // 使用 stb_image_resize 来调整尺寸
        if (!stbir_resize_uint8(image_data, width, height, 0,
                                resized, size, size, 0, channels)) {
            fprintf(stderr, "resize 失败: %dx%d\n", size, size);
            free(resized);
            continue;
        }

        // 生成 PNG 到内存
        size_t png_size = 0;
        unsigned char* png_data = create_png_data(resized, size, size, channels, &png_size);
        free(resized);

        if (!png_data || png_size == 0) {
            fprintf(stderr, "生成 PNG 失败: %dx%d\n", size, size);
            if (png_data) free(png_data);
            continue;
        }

        // 写入 entry header（type + length）
        icns_entry_header_t entry_header;
        memcpy(entry_header.type, icns_sizes[i].type, 4);
        uint32_t entry_len = (uint32_t)(sizeof(icns_entry_header_t) + png_size);
        entry_header.length = to_big_endian(entry_len);

        fwrite(&entry_header, sizeof(entry_header), 1, output);
        fwrite(png_data, 1, png_size, output);

        total_size += sizeof(icns_entry_header_t) + png_size;

        free(png_data);
    }

    // 回写总长度（big-endian）
    fseek(output, 4, SEEK_SET);
    uint32_t total_be = to_big_endian((uint32_t)total_size);
    fwrite(&total_be, sizeof(total_be), 1, output);

    fclose(output);
    stbi_image_free(image_data);

    fprintf(stdout, "ICNS 生成成功: %s (大小: %zu bytes)\n", output_path, total_size);
    return 0;
}

// 保留一个兼容名字（如果你之前 JS 调用 wasm_convert_to_icns）
EMSCRIPTEN_KEEPALIVE
int wasm_convert_to_icns(const char* input_path, const char* output_path) {
    return convertToICNS(input_path, output_path);
}

#ifdef __cplusplus
}
#endif

// CLI 主函数（可在本地用命令行测试）
#ifdef BUILD_STANDALONE
int main(int argc, char* argv[]) {
    if (argc != 3) {
        printf("Usage: %s <input.png> <output.icns>\n", argv[0]);
        return 1;
    }
    return convertToICNS(argv[1], argv[2]);
}
#endif
