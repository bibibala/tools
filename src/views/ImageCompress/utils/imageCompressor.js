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
    let actualFormat = format === "original" ? file.type.split("/")[1] : format;

    // 检查浏览器是否支持 WebP 格式
    if (actualFormat === "webp") {
        // 使用 canvas.toDataURL 来测试 WebP 支持
        const testCanvas = document.createElement("canvas");
        testCanvas.width = 1;
        testCanvas.height = 1;
        try {
            const webpData = testCanvas.toDataURL("image/webp");
            // 如果返回的数据以 data:image/webp 开头，说明支持 WebP
            if (!webpData.startsWith("data:image/webp")) {
                console.warn("浏览器不支持 WebP 格式，将回退到 PNG 格式");
                actualFormat = "png";
            }
        } catch (error) {
            console.warn("检测 WebP 支持时出错，将回退到 PNG 格式:", error);
            actualFormat = "png";
        }
    }

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
                                // 验证实际的格式转换是否成功
                                if (actualFormat !== "original") {
                                    // 检查Blob类型是否匹配目标格式
                                    const expectedType = `image/${actualFormat}`;
                                    if (blob.type !== expectedType) {
                                        console.warn(
                                            `⚠️ Blob类型不匹配: 期望=${expectedType}, 实际=${blob.type}`,
                                        );
                                    } else {
                                        // 进一步验证文件头（前几个字节）
                                        const reader = new FileReader();
                                        reader.onload = function (e) {
                                            const arrayBuffer = e.target.result;
                                            const uint8Array = new Uint8Array(
                                                arrayBuffer,
                                            );

                                            let headerCheck = "";
                                            if (actualFormat === "webp") {
                                                // WebP文件头: RIFF....WEBP
                                                const isWebP =
                                                    uint8Array[0] === 0x52 &&
                                                    uint8Array[1] === 0x49 &&
                                                    uint8Array[2] === 0x46 &&
                                                    uint8Array[3] === 0x46 &&
                                                    uint8Array[8] === 0x57 &&
                                                    uint8Array[9] === 0x45 &&
                                                    uint8Array[10] === 0x42 &&
                                                    uint8Array[11] === 0x50;
                                                headerCheck = isWebP
                                                    ? "✅ WebP文件头正确"
                                                    : "❌ WebP文件头错误";
                                            } else if (actualFormat === "png") {
                                                // PNG文件头: 89 50 4E 47 0D 0A 1A 0A
                                                const isPng =
                                                    uint8Array[0] === 0x89 &&
                                                    uint8Array[1] === 0x50 &&
                                                    uint8Array[2] === 0x4e &&
                                                    uint8Array[3] === 0x47;
                                                headerCheck = isPng
                                                    ? "✅ PNG文件头正确"
                                                    : "❌ PNG文件头错误";
                                            } else if (
                                                actualFormat === "jpeg"
                                            ) {
                                                // JPEG文件头: FF D8 FF
                                                const isJpeg =
                                                    uint8Array[0] === 0xff &&
                                                    uint8Array[1] === 0xd8 &&
                                                    uint8Array[2] === 0xff;
                                                headerCheck = isJpeg
                                                    ? "✅ JPEG文件头正确"
                                                    : "❌ JPEG文件头错误";
                                            }

                                            if (headerCheck) {
                                                console.log(
                                                    `文件头验证: ${headerCheck}`,
                                                );
                                            }
                                        };
                                        reader.readAsArrayBuffer(
                                            blob.slice(0, 20),
                                        );
                                    }
                                }

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
        const fileName = generateFileName(file.path, format);
        downloadFile(blob, fileName);
    } else {
        // 多个文件打包成ZIP下载，保持目录结构
        await downloadAsZip(files, format, preserveStructure);
    }
}

/**
 * 生成压缩后的文件名
 * @param {string} originalPath - 原始文件路径
 * @param {string} format - 目标格式
 * @returns {string} - 新的文件名
 */
function generateFileName(originalPath, format = "jpeg") {
    const pathParts = originalPath.split("/");
    const fileName = pathParts[pathParts.length - 1];

    // 根据目标格式修改文件扩展名
    const nameWithoutExt =
        fileName.substring(0, fileName.lastIndexOf(".")) || fileName;

    // 确保扩展名格式正确（小写，带点）
    let newExtension;
    if (format === "original") {
        // 保持原始扩展名，但确保小写
        const originalExt = fileName.substring(fileName.lastIndexOf("."));
        newExtension = originalExt.toLowerCase();
    } else {
        // 使用新格式，确保小写
        newExtension = `.${format.toLowerCase()}`;
    }

    return nameWithoutExt + newExtension;
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
 * @param format
 * @param {boolean} preserveStructure - 是否保持目录结构
 * @returns {Promise<void>}
 */
async function downloadAsZip(
    files,
    format = "jpeg",
    preserveStructure = false,
) {
    try {
        const zip = new JSZip();

        // 添加文件到ZIP，保持目录结构
        files.forEach((file) => {
            let fileName;
            if (preserveStructure && file.path) {
                // 保持原始目录结构，根据格式修改文件名
                const pathParts = file.path.split("/");
                const originalFileName = pathParts[pathParts.length - 1];
                const newFileName = generateFileName(originalFileName, format);
                fileName = file.path.replace(originalFileName, newFileName);
            } else {
                // 使用新格式文件名
                const pathParts = (file.relativePath || file.path).split("/");
                const originalFileName = pathParts[pathParts.length - 1];
                fileName = generateFileName(originalFileName, format);
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
