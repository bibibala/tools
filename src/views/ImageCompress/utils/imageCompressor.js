/**
 * 图片压缩工具函数
 */

/**
 * 压缩图片
 * @param {File} file - 图片文件
 * @param {Object} options - 压缩选项
 * @param {number} options.quality - 图片质量 (0-1)
 * @param {number} options.maxWidth - 最大宽度
 * @param {number} options.maxHeight - 最大高度
 * @param {string} options.format - 输出格式 (jpeg, png, webp)
 * @returns {Promise<Blob>} - 压缩后的图片Blob
 */
export async function compressImage(file, options = {}) {
    const {
        quality = 0.8,
        maxWidth = 1920,
        maxHeight = 1080,
        format = "original",
    } = options;

    // 如果使用原始格式，从文件类型中提取格式
    const actualFormat =
        format === "original" ? file.type.split("/")[1] : format;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                try {
                    // 计算压缩后的尺寸
                    const { width, height } = calculateDimensions(
                        img.width,
                        img.height,
                        maxWidth,
                        maxHeight,
                    );

                    // 创建canvas
                    const canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext("2d");

                    // 设置白色背景（对于JPEG格式）
                    if (actualFormat === "jpeg") {
                        ctx.fillStyle = "#ffffff";
                        ctx.fillRect(0, 0, width, height);
                    }

                    // 绘制图片
                    ctx.drawImage(img, 0, 0, width, height);

                    // 转换为Blob
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error("压缩失败：无法创建Blob"));
                            }
                        },
                        `image/${actualFormat}`,
                        quality,
                    );
                } catch (error) {
                    reject(new Error(`压缩失败：${error.message}`));
                }
            };

            img.onerror = () => {
                reject(new Error("压缩失败：无法加载图片"));
            };

            img.src = e.target.result;
        };

        reader.onerror = () => {
            reject(new Error("压缩失败：无法读取文件"));
        };

        reader.readAsDataURL(file);
    });
}

/**
 * 计算压缩后的尺寸
 * @param {number} originalWidth - 原始宽度
 * @param {number} originalHeight - 原始高度
 * @param {number} maxWidth - 最大宽度
 * @param {number} maxHeight - 最大高度
 * @returns {Object} - 新的尺寸对象
 */
function calculateDimensions(
    originalWidth,
    originalHeight,
    maxWidth,
    maxHeight,
) {
    // 如果图片尺寸已经小于限制，返回原始尺寸
    if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
        return { width: originalWidth, height: originalHeight };
    }

    // 计算缩放比例
    const widthRatio = maxWidth / originalWidth;
    const heightRatio = maxHeight / originalHeight;
    const ratio = Math.min(widthRatio, heightRatio);

    return {
        width: Math.round(originalWidth * ratio),
        height: Math.round(originalHeight * ratio),
    };
}

/**
 * 下载压缩后的文件
 * @param {Array} files - 文件数组，每个文件包含compressed Blob和原始路径信息
 * @param {string} format - 输出格式
 * @param {boolean} preserveStructure - 是否保持目录结构
 * @returns {Promise<void>}
 */
export async function downloadCompressedFiles(
    files,
    format = "jpeg",
    preserveStructure = false,
) {
    if (files.length === 0) {
        throw new Error("没有可下载的文件");
    }

    if (files.length === 1 && !preserveStructure) {
        // 单个文件直接下载
        const file = files[0];
        const blob = file.compressed;
        const fileName = generateFileName(
            file.path,
            file.compressionRatio,
            format,
            file.file,
        );
        downloadFile(blob, fileName);
    } else {
        // 多个文件打包成ZIP下载，保持目录结构
        await downloadAsZip(files, format, preserveStructure);
    }
}

/**
 * 生成压缩后的文件名
 * @param {string} originalPath - 原始文件路径
 * @returns {string} - 新的文件名
 */
function generateFileName(originalPath) {
    // 始终返回原始文件名，不做任何修改
    const pathParts = originalPath.split("/");
    return pathParts[pathParts.length - 1];
}

/**
 * 下载单个文件
 * @param {Blob} blob - 文件Blob
 * @param {string} fileName - 文件名
 */
function downloadFile(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

import JSZip from "jszip";

/**
 * 打包成ZIP下载
 * @param {Array} files - 文件数组
 * @param {boolean} preserveStructure - 是否保持目录结构
 * @returns {Promise<void>}
 */
async function downloadAsZip(files, preserveStructure = false) {
    try {
        const zip = new JSZip();

        // 添加文件到ZIP，保持目录结构
        files.forEach((file) => {
            let fileName;
            if (preserveStructure && file.path) {
                // 保持原始目录结构，始终使用原始文件名
                fileName = file.path;
            } else {
                // 使用原始文件名
                const pathParts = (file.relativePath || file.path).split("/");
                fileName = pathParts[pathParts.length - 1];
            }
            zip.file(fileName, file.compressed);
        });

        // 生成ZIP文件
        const zipBlob = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: {
                level: 6,
            },
        });
        downloadFile(zipBlob, `compressed_images.zip`);
    } catch (error) {
        throw new Error(`打包下载失败：${error.message}`);
    }
}

/**
 * 获取图片信息
 * @param {File} file - 图片文件
 * @returns {Promise<Object>} - 图片信息对象
 */
export function getImageInfo(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                resolve({
                    width: img.width,
                    height: img.height,
                    size: file.size,
                    type: file.type,
                    name: file.name,
                });
            };

            img.onerror = () => {
                reject(new Error("无法加载图片"));
            };

            img.src = e.target.result;
        };

        reader.onerror = () => {
            reject(new Error("无法读取文件"));
        };

        reader.readAsDataURL(file);
    });
}

/**
 * 验证图片文件
 * @param {File} file - 文件对象
 * @returns {Object} - 验证结果
 */
export function validateImageFile(file) {
    const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/bmp",
    ];

    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!validTypes.includes(file.type)) {
        return {
            valid: false,
            error: "不支持的图片格式。支持的格式：JPEG, PNG, WebP, GIF, BMP",
        };
    }

    if (file.size > maxSize) {
        return {
            valid: false,
            error: "图片文件过大。最大支持 50MB",
        };
    }

    return {
        valid: true,
        error: null,
    };
}
