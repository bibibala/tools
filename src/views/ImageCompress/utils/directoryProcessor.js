/**
 * 目录结构处理工具函数
 * 支持递归读取目录结构，保持原有层级
 */

/**
 * 处理目录结构
 * @param {FileList} items - 文件列表（包含目录结构）
 * @returns {Promise<Array>} - 处理后的文件数组，包含相对路径信息
 */
export async function processDirectoryStructure(items) {
    if (!items || items.length === 0) {
        return [];
    }

    const processedFiles = [];

    // 将FileList转换为数组
    const filesArray = Array.from(items);

    // 获取根目录名称
    const rootPath = findRootPath(filesArray);

    for (const file of filesArray) {
        if (file.type && file.type.startsWith("image/")) {
            // 计算相对路径
            const relativePath = getRelativePath(
                file.webkitRelativePath || file.name,
                rootPath,
            );

            processedFiles.push({
                file: file,
                path: file.webkitRelativePath || file.name,
                relativePath: relativePath,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
            });
        }
    }

    return processedFiles;
}

/**
 * 查找根目录路径
 * @param {Array} files - 文件数组
 * @returns {string} - 根目录路径
 */
function findRootPath(files) {
    if (!files || files.length === 0) return "";

    const paths = files
        .map((file) => file.webkitRelativePath || file.name)
        .filter((path) => path.includes("/"));

    if (paths.length === 0) return "";

    // 获取第一个路径的第一部分作为根目录
    return paths[0].split("/")[0];
}

/**
 * 获取相对路径
 * @param {string} fullPath - 完整路径
 * @param {string} rootPath - 根目录路径
 * @returns {string} - 相对路径
 */
function getRelativePath(fullPath, rootPath) {
    if (!rootPath || !fullPath.includes(rootPath)) {
        return fullPath;
    }

    const index = fullPath.indexOf(rootPath);
    return fullPath.substring(index + rootPath.length + 1);
}

/**
 * 递归处理目录项（用于拖拽的目录）
 * @param {DataTransferItem} item - 拖拽的目录项
 * @returns {Promise<Array>} - 文件数组
 */
export async function processDirectoryEntry(item) {
    const files = [];

    if (item.kind === "file") {
        const entry = item.webkitGetAsEntry();
        if (entry) {
            await processEntry(entry, "", files);
        }
    }

    return files;
}

/**
 * 递归处理文件系统条目
 * @param {FileSystemEntry} entry - 文件系统条目
 * @param {string} path - 当前路径
 * @param {Array} files - 文件数组（引用）
 */
async function processEntry(entry, path, files) {
    if (entry.isFile) {
        // 处理文件
        try {
            const file = await getFileFromEntry(entry);
            if (file && file.type.startsWith("image/")) {
                files.push({
                    file: file,
                    path: path + entry.name,
                    relativePath: path,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified,
                });
            }
        } catch (error) {
            console.warn("无法读取文件:", entry.name, error);
        }
    } else if (entry.isDirectory) {
        // 处理目录
        try {
            const entries = await readDirectoryEntries(entry);
            for (const subEntry of entries) {
                await processEntry(subEntry, path + entry.name + "/", files);
            }
        } catch (error) {
            console.warn("无法读取目录:", entry.name, error);
        }
    }
}

/**
 * 从文件系统条目获取文件
 * @param {FileSystemFileEntry} entry - 文件条目
 * @returns {Promise<File>} - 文件对象
 */
function getFileFromEntry(entry) {
    return new Promise((resolve, reject) => {
        entry.file(resolve, reject);
    });
}

/**
 * 读取目录条目
 * @param {FileSystemDirectoryEntry} directoryEntry - 目录条目
 * @returns {Promise<Array>} - 条目数组
 */
function readDirectoryEntries(directoryEntry) {
    return new Promise((resolve, reject) => {
        const reader = directoryEntry.createReader();
        const entries = [];

        function readEntries() {
            reader.readEntries((results) => {
                if (results.length === 0) {
                    resolve(entries);
                } else {
                    entries.push(...results);
                    readEntries(); // 继续读取，直到没有更多条目
                }
            }, reject);
        }

        readEntries();
    });
}

/**
 * 构建目录树结构
 * @param {Array} files - 文件数组
 * @returns {Object} - 目录树对象
 */
export function buildDirectoryTree(files) {
    const tree = {};

    files.forEach((file) => {
        const pathParts = file.relativePath.split("/").filter((part) => part);
        let currentLevel = tree;

        // 构建目录结构
        pathParts.forEach((part, index) => {
            if (index === pathParts.length - 1) {
                // 文件节点
                currentLevel[part] = {
                    type: "file",
                    data: file,
                };
            } else {
                // 目录节点
                if (!currentLevel[part]) {
                    currentLevel[part] = {
                        type: "directory",
                        children: {},
                    };
                }
                currentLevel = currentLevel[part].children;
            }
        });
    });

    return tree;
}

/**
 * 获取目录统计信息
 * @param {Array} files - 文件数组
 * @returns {Object} - 统计信息
 */
export function getDirectoryStats(files) {
    const stats = {
        totalFiles: files.length,
        totalSize: 0,
        fileTypes: {},
        directoryCount: 0,
        maxDepth: 0,
    };

    const directories = new Set();

    files.forEach((file) => {
        // 统计文件大小
        stats.totalSize += file.size;

        // 统计文件类型
        const extension = file.type.split("/").pop();
        stats.fileTypes[extension] = (stats.fileTypes[extension] || 0) + 1;

        // 统计目录
        const pathParts = file.relativePath.split("/").filter((part) => part);
        pathParts.forEach((part, index) => {
            const dirPath = pathParts.slice(0, index).join("/");
            if (dirPath) {
                directories.add(dirPath);
            }
        });

        // 计算最大深度
        const depth = file.relativePath.split("/").length - 1;
        stats.maxDepth = Math.max(stats.maxDepth, depth);
    });

    stats.directoryCount = directories.size;

    return stats;
}

/**
 * 验证文件路径
 * @param {string} path - 文件路径
 * @returns {boolean} - 是否有效
 */
export function isValidPath(path) {
    if (!path || typeof path !== "string") {
        return false;
    }

    // 检查是否包含非法字符
    const invalidChars = /[<>:"|?*]/;
    if (invalidChars.test(path)) {
        return false;
    }

    // 检查路径长度
    if (path.length > 260) {
        return false;
    }

    return true;
}

/**
 * 标准化路径
 * @param {string} path - 原始路径
 * @returns {string} - 标准化后的路径
 */
export function normalizePath(path) {
    if (!path) return "";

    // 替换反斜杠为正斜杠
    let normalized = path.replace(/\\/g, "/");

    // 移除多余的分隔符
    normalized = normalized.replace(/\/+/g, "/");

    // 移除开头的分隔符
    normalized = normalized.replace(/^\//, "");

    // 移除结尾的分隔符
    normalized = normalized.replace(/\/$/, "");

    return normalized;
}
