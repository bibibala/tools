<template>
    <div class="image-location-viewer">
        <div class="header">
            <h1>图片位置信息查看器</h1>
            <p>上传图片查看其中的位置信息和元数据</p>
        </div>

        <!-- 文件上传区域 -->
        <div class="upload-area">
            <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleFileSelect"
                style="display: none"
            />
            <div
                class="drop-zone"
                :class="{ 'drag-over': isDragOver }"
                @click="triggerFileSelect"
                @dragover.prevent="handleDragOver"
                @dragleave.prevent="handleDragLeave"
                @drop.prevent="handleDrop"
            >
                <div v-if="!selectedImage" class="upload-placeholder">
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path
                            d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
                        />
                    </svg>
                    <p>点击选择图片或拖拽图片到此处</p>
                    <p class="hint">支持 JPG、PNG、TIFF 等格式</p>
                </div>
                <div v-else class="image-preview">
                    <img :src="imagePreview" alt="Selected image" />
                    <button @click.stop="clearImage" class="clear-btn">
                        ×
                    </button>
                </div>
            </div>
        </div>

        <!-- 元信息显示区域 -->
        <div v-if="exifData" class="metadata-section">
            <h2>图片元信息</h2>

            <!-- 基本信息 -->
            <div class="info-card">
                <h3>基本信息</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <label>文件名:</label>
                        <span>{{ fileName }}</span>
                    </div>
                    <div class="info-item">
                        <label>文件大小:</label>
                        <span>{{ formatFileSize(fileSize) }}</span>
                    </div>
                    <div class="info-item">
                        <label>图片尺寸:</label>
                        <span>{{ imageWidth }} × {{ imageHeight }}</span>
                    </div>
                    <div class="info-item" v-if="formattedDateTime">
                        <label>拍摄时间:</label>
                        <span>{{ formattedDateTime }}</span>
                    </div>
                </div>
            </div>

            <!-- 设备信息 -->
            <div class="info-card" v-if="hasDeviceInfo">
                <h3>设备信息</h3>
                <div class="info-grid">
                    <div class="info-item" v-if="exifData.Make">
                        <label>制造商:</label>
                        <span>{{ exifData.Make }}</span>
                    </div>
                    <div class="info-item" v-if="exifData.Model">
                        <label>设备型号:</label>
                        <span>{{ exifData.Model }}</span>
                    </div>
                    <div class="info-item" v-if="exifData.Software">
                        <label>软件:</label>
                        <span>{{ exifData.Software }}</span>
                    </div>
                    <div class="info-item" v-if="exifData.LensModel">
                        <label>镜头型号:</label>
                        <span>{{ exifData.LensModel }}</span>
                    </div>
                </div>
            </div>

            <!-- 拍摄参数 -->
            <div class="info-card" v-if="hasCameraSettings">
                <h3>拍摄参数</h3>
                <div class="info-grid">
                    <div class="info-item" v-if="exifData.FNumber">
                        <label>光圈:</label>
                        <span>f/{{ exifData.FNumber }}</span>
                    </div>
                    <div class="info-item" v-if="exifData.ExposureTime">
                        <label>快门速度:</label>
                        <span>{{
                            formatExposureTime(exifData.ExposureTime)
                        }}</span>
                    </div>
                    <div class="info-item" v-if="exifData.ISOSpeedRatings">
                        <label>ISO:</label>
                        <span>{{ exifData.ISOSpeedRatings }}</span>
                    </div>
                    <div class="info-item" v-if="exifData.FocalLength">
                        <label>焦距:</label>
                        <span>{{ exifData.FocalLength }}mm</span>
                    </div>
                    <div class="info-item" v-if="exifData.Flash">
                        <label>闪光灯:</label>
                        <span>{{ formatFlash(exifData.Flash) }}</span>
                    </div>
                    <div class="info-item" v-if="exifData.WhiteBalance">
                        <label>白平衡:</label>
                        <span>{{
                            formatWhiteBalance(exifData.WhiteBalance)
                        }}</span>
                    </div>
                </div>
            </div>

            <!-- GPS位置信息 -->
            <div class="info-card" v-if="hasGPSInfo">
                <h3>位置信息</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <label>纬度:</label>
                        <span>{{ gpsInfo.latitude }}°</span>
                    </div>
                    <div class="info-item">
                        <label>经度:</label>
                        <span>{{ gpsInfo.longitude }}°</span>
                    </div>
                    <div class="info-item" v-if="gpsInfo.altitude">
                        <label>海拔:</label>
                        <span>{{ gpsInfo.altitude }}m</span>
                    </div>
                    <div class="info-item" v-if="exifData.GPSImgDirection">
                        <label>拍摄方向:</label>
                        <span>{{ exifData.GPSImgDirection }}°</span>
                    </div>
                </div>
                <div class="map-actions">
                    <button @click="openInGoogleMaps" class="map-btn">
                        Google地图
                    </button>
                    <button @click="openInBaiduMaps" class="map-btn">
                        百度地图
                    </button>
                    <button @click="openInAMap" class="map-btn">
                        高德地图
                    </button>
                    <button @click="copyCoordinates" class="map-btn">
                        复制坐标
                    </button>
                </div>
            </div>

            <!-- 完整EXIF数据 -->
            <div class="info-card">
                <h3>完整EXIF数据</h3>
                <CodeHighlighter
                    :code="formatExifData(exifData)"
                    language="json"
                />
            </div>
        </div>

        <!-- 无EXIF数据提示 -->
        <div v-else-if="selectedImage && !loading" class="no-exif">
            <div class="info-card">
                <h3>无元信息</h3>
                <p>该图片不包含EXIF元信息，或者元信息已被移除。</p>
                <p>通常以下情况会导致EXIF信息缺失：</p>
                <ul>
                    <li>图片经过社交媒体平台处理</li>
                    <li>使用某些图片编辑软件保存时移除了元信息</li>
                    <li>图片格式不支持EXIF（如某些PNG文件）</li>
                    <li>截图或合成图片</li>
                </ul>
            </div>
        </div>

        <!-- 错误信息 -->
        <div v-if="error" class="error-message">
            {{ error }}
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading">
            <div class="spinner"></div>
            <p>正在读取图片元信息...</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import CodeHighlighter from "@/components/CodeHighlighter.vue";
import { copyToClipboard } from "@/utils/useToClipboard.js";

const fileInput = ref(null);
const selectedImage = ref(null);
const imagePreview = ref("");
const exifData = ref(null);
const gpsInfo = ref(null);
const fileName = ref("");
const fileSize = ref(0);
const imageWidth = ref(0);
const imageHeight = ref(0);
const isDragOver = ref(false);
const loading = ref(false);
const error = ref("");

// 计算属性
const hasDeviceInfo = computed(() => {
    return (
        exifData.value &&
        (exifData.value.Make ||
            exifData.value.Model ||
            exifData.value.Software ||
            exifData.value.LensModel)
    );
});

const hasCameraSettings = computed(() => {
    return (
        exifData.value &&
        (exifData.value.FNumber ||
            exifData.value.ExposureTime ||
            exifData.value.ISOSpeedRatings ||
            exifData.value.FocalLength ||
            exifData.value.Flash ||
            exifData.value.WhiteBalance)
    );
});

const hasGPSInfo = computed(() => {
    return gpsInfo.value && gpsInfo.value.latitude && gpsInfo.value.longitude;
});

// 格式化的拍摄时间
const formattedDateTime = computed(() => {
    if (!exifData.value) return "";

    const dateTime =
        exifData.value.DateTimeOriginal ||
        exifData.value.DateTime ||
        exifData.value.DateTimeDigitized;
    if (!dateTime) return "";

    return formatDateTime(dateTime);
});

// 触发文件选择
const triggerFileSelect = () => {
    fileInput.value.click();
};

// 处理文件选择
const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
        processFile(file);
    }
};

// 拖拽处理
const handleDragOver = () => {
    isDragOver.value = true;
};

const handleDragLeave = () => {
    isDragOver.value = false;
};

const handleDrop = (event) => {
    isDragOver.value = false;
    const files = event.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
};

// 处理文件
const processFile = async (file) => {
    if (!file.type.startsWith("image/")) {
        error.value = "请选择有效的图片文件";
        return;
    }

    loading.value = true;
    error.value = "";
    exifData.value = null;
    gpsInfo.value = null;

    try {
        // 设置基本文件信息
        fileName.value = file.name;
        fileSize.value = file.size;
        selectedImage.value = file;

        // 创建图片预览
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.value = e.target.result;

            // 获取图片尺寸
            const img = new Image();
            img.onload = () => {
                imageWidth.value = img.width;
                imageHeight.value = img.height;
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);

        // 读取EXIF数据
        await readExifData(file);
    } catch (err) {
        error.value = "读取图片信息失败: " + err.message;
    } finally {
        loading.value = false;
    }
};

// 读取EXIF数据
const readExifData = async (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const arrayBuffer = e.target.result;
                const dataView = new DataView(arrayBuffer);

                // 解析EXIF数据
                const exif = parseExifData(dataView);
                if (exif && Object.keys(exif).length > 0) {
                    exifData.value = exif;

                    // 解析GPS信息
                    if (exif.GPSLatitude && exif.GPSLongitude) {
                        gpsInfo.value = {
                            latitude: convertDMSToDD(
                                exif.GPSLatitude,
                                exif.GPSLatitudeRef,
                            ),
                            longitude: convertDMSToDD(
                                exif.GPSLongitude,
                                exif.GPSLongitudeRef,
                            ),
                            altitude: exif.GPSAltitude || null,
                        };
                    }
                }

                resolve();
            } catch (err) {
                console.warn("EXIF解析失败:", err);
                resolve();
            }
        };
        reader.onerror = () => resolve();
        reader.readAsArrayBuffer(file);
    });
};

// EXIF解析函数
const parseExifData = (dataView) => {
    // 检查JPEG文件头
    if (dataView.getUint16(0, false) !== 0xffd8) {
        return null;
    }

    let offset = 2;
    let marker;
    let exifOffset = 0;

    // 查找EXIF段
    while (offset < dataView.byteLength) {
        marker = dataView.getUint16(offset, false);
        if (marker === 0xffe1) {
            // EXIF段
            // const segmentLength = dataView.getUint16(offset + 2, false);
            const exifHeader = new Uint8Array(dataView.buffer, offset + 4, 4);
            if (
                exifHeader[0] === 0x45 &&
                exifHeader[1] === 0x78 &&
                exifHeader[2] === 0x69 &&
                exifHeader[3] === 0x66
            ) {
                exifOffset = offset + 10; // 跳过段标记、长度和"Exif\0\0"
                break;
            }
        }

        offset += 2 + dataView.getUint16(offset + 2, false);
    }

    if (exifOffset === 0) {
        return null;
    }

    // 解析TIFF头
    const tiffOffset = exifOffset;
    const byteOrder = dataView.getUint16(tiffOffset, false);
    const littleEndian = byteOrder === 0x4949;

    // 获取IFD0偏移
    const ifd0Offset = dataView.getUint32(tiffOffset + 4, littleEndian);

    // 解析IFD0
    const exifData = {};
    parseIFD(
        dataView,
        tiffOffset + ifd0Offset,
        tiffOffset,
        littleEndian,
        exifData,
    );

    return exifData;
};

// 解析IFD
const parseIFD = (dataView, ifdOffset, tiffOffset, littleEndian, exifData) => {
    const numEntries = dataView.getUint16(ifdOffset, littleEndian);

    for (let i = 0; i < numEntries; i++) {
        const entryOffset = ifdOffset + 2 + i * 12;
        const tag = dataView.getUint16(entryOffset, littleEndian);
        const type = dataView.getUint16(entryOffset + 2, littleEndian);
        const count = dataView.getUint32(entryOffset + 4, littleEndian);
        const valueOffset = entryOffset + 8;

        const tagName = getTagName(tag);
        if (tagName) {
            const value = readTagValue(
                dataView,
                type,
                count,
                valueOffset,
                tiffOffset,
                littleEndian,
            );
            if (value !== null) {
                exifData[tagName] = value;
            }
        }

        // 处理EXIF子IFD
        if (tag === 0x8769) {
            // ExifIFDPointer
            const exifIFDOffset = dataView.getUint32(valueOffset, littleEndian);
            parseIFD(
                dataView,
                tiffOffset + exifIFDOffset,
                tiffOffset,
                littleEndian,
                exifData,
            );
        }

        // 处理GPS子IFD
        if (tag === 0x8825) {
            // GPSIFDPointer
            const gpsIFDOffset = dataView.getUint32(valueOffset, littleEndian);
            parseGPSIFD(
                dataView,
                tiffOffset + gpsIFDOffset,
                tiffOffset,
                littleEndian,
                exifData,
            );
        }
    }
};

// 解析GPS IFD
const parseGPSIFD = (
    dataView,
    ifdOffset,
    tiffOffset,
    littleEndian,
    exifData,
) => {
    const numEntries = dataView.getUint16(ifdOffset, littleEndian);

    for (let i = 0; i < numEntries; i++) {
        const entryOffset = ifdOffset + 2 + i * 12;
        const tag = dataView.getUint16(entryOffset, littleEndian);
        const type = dataView.getUint16(entryOffset + 2, littleEndian);
        const count = dataView.getUint32(entryOffset + 4, littleEndian);
        const valueOffset = entryOffset + 8;

        const tagName = getGPSTagName(tag);
        if (tagName) {
            const value = readTagValue(
                dataView,
                type,
                count,
                valueOffset,
                tiffOffset,
                littleEndian,
            );
            if (value !== null) {
                exifData[tagName] = value;
            }
        }
    }
};

// 读取标签值
const readTagValue = (
    dataView,
    type,
    count,
    valueOffset,
    tiffOffset,
    littleEndian,
) => {
    let actualOffset = valueOffset;

    // 如果数据长度大于4字节，需要从偏移位置读取
    const dataSize = getTypeSize(type) * count;
    if (dataSize > 4) {
        actualOffset =
            tiffOffset + dataView.getUint32(valueOffset, littleEndian);
    }

    switch (type) {
        case 1: // BYTE
            return count === 1 ? dataView.getUint8(actualOffset) : null;
        case 2: {
            // ASCII
            let str = "";
            for (let i = 0; i < count - 1; i++) {
                str += String.fromCharCode(dataView.getUint8(actualOffset + i));
            }
            return str;
        }
        case 3: // SHORT
            return count === 1
                ? dataView.getUint16(actualOffset, littleEndian)
                : null;
        case 4: // LONG
            return count === 1
                ? dataView.getUint32(actualOffset, littleEndian)
                : null;
        case 5: // RATIONAL
            if (count === 1) {
                const numerator = dataView.getUint32(
                    actualOffset,
                    littleEndian,
                );
                const denominator = dataView.getUint32(
                    actualOffset + 4,
                    littleEndian,
                );
                return denominator !== 0 ? numerator / denominator : 0;
            } else if (count === 3) {
                // GPS坐标 (度, 分, 秒)
                const coords = [];
                for (let i = 0; i < 3; i++) {
                    const numerator = dataView.getUint32(
                        actualOffset + i * 8,
                        littleEndian,
                    );
                    const denominator = dataView.getUint32(
                        actualOffset + i * 8 + 4,
                        littleEndian,
                    );
                    coords.push(
                        denominator !== 0 ? numerator / denominator : 0,
                    );
                }
                return coords;
            }
            return null;
        case 10: // SRATIONAL
            if (count === 1) {
                const numerator = dataView.getInt32(actualOffset, littleEndian);
                const denominator = dataView.getInt32(
                    actualOffset + 4,
                    littleEndian,
                );
                return denominator !== 0 ? numerator / denominator : 0;
            }
            return null;
        default:
            return null;
    }
};

// 获取数据类型大小
const getTypeSize = (type) => {
    const sizes = [0, 1, 1, 2, 4, 8, 1, 1, 2, 4, 8, 4, 8];
    return sizes[type] || 0;
};

// 获取标签名称
const getTagName = (tag) => {
    const tags = {
        0x010f: "Make",
        0x0110: "Model",
        0x0131: "Software",
        0x0132: "DateTime",
        0x829a: "ExposureTime",
        0x829d: "FNumber",
        0x8827: "ISOSpeedRatings",
        0x920a: "FocalLength",
        0x9003: "DateTimeOriginal",
        0x9004: "DateTimeDigitized",
        0x9209: "Flash",
        0x9208: "LightSource",
        0xa405: "FocalLengthIn35mmFilm",
        0xa432: "LensModel",
        0xa403: "WhiteBalance",
    };
    return tags[tag];
};

// 获取GPS标签名称
const getGPSTagName = (tag) => {
    const tags = {
        0x0001: "GPSLatitudeRef",
        0x0002: "GPSLatitude",
        0x0003: "GPSLongitudeRef",
        0x0004: "GPSLongitude",
        0x0005: "GPSAltitudeRef",
        0x0006: "GPSAltitude",
        0x0011: "GPSImgDirection",
    };
    return tags[tag];
};

// 将DMS格式转换为十进制度数
const convertDMSToDD = (dms, ref) => {
    if (!dms || dms.length < 3) return 0;

    let dd = dms[0] + dms[1] / 60 + dms[2] / 3600;
    if (ref === "S" || ref === "W") dd = dd * -1;
    return parseFloat(dd.toFixed(6));
};

// 清除图片
const clearImage = () => {
    selectedImage.value = null;
    imagePreview.value = "";
    exifData.value = null;
    gpsInfo.value = null;
    fileName.value = "";
    fileSize.value = 0;
    error.value = "";
    fileInput.value.value = "";
};

// 格式化文件大小
const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// 格式化日期时间 - 修复Invalid Date问题
const formatDateTime = (dateTime) => {
    if (!dateTime) return "";

    try {
        // EXIF日期格式通常是: "YYYY:MM:DD HH:MM:SS"
        let dateStr = dateTime.toString().trim();

        // 处理不同的日期格式
        if (dateStr.includes(":")) {
            // 标准EXIF格式: "2023:12:25 14:30:45"
            // 将前两个冒号替换为短横线
            dateStr = dateStr.replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3");
        }

        // 尝试解析日期
        const date = new Date(dateStr);

        // 检查日期是否有效
        if (isNaN(date.getTime())) {
            // 如果标准解析失败，尝试手动解析
            const match = dateTime.match(
                /^(\d{4}):(\d{2}):(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/,
            );
            if (match) {
                const [, year, month, day, hour, minute, second] = match;
                const parsedDate = new Date(
                    year,
                    month - 1,
                    day,
                    hour,
                    minute,
                    second,
                );
                if (!isNaN(parsedDate.getTime())) {
                    return parsedDate.toLocaleString("zh-CN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                    });
                }
            }

            // 如果所有解析都失败，返回原始字符串
            return dateTime;
        }

        // 返回格式化的日期
        return date.toLocaleString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        });
    } catch (err) {
        console.warn("日期格式化失败:", err, "原始值:", dateTime);
        return dateTime;
    }
};

// 格式化曝光时间
const formatExposureTime = (exposureTime) => {
    if (!exposureTime) return "";
    if (exposureTime < 1) {
        return `1/${Math.round(1 / exposureTime)}s`;
    }
    return `${exposureTime}s`;
};

// 格式化闪光灯
const formatFlash = (flash) => {
    const flashModes = {
        0: "未闪光",
        1: "闪光",
        5: "闪光，未检测到回闪",
        7: "闪光，检测到回闪",
        9: "强制闪光",
        13: "强制闪光，未检测到回闪",
        15: "强制闪光，检测到回闪",
        16: "未闪光，强制关闭",
        24: "未闪光，自动模式",
        25: "闪光，自动模式",
        29: "闪光，自动模式，未检测到回闪",
        31: "闪光，自动模式，检测到回闪",
        32: "无闪光功能",
    };
    return flashModes[flash] || `未知 (${flash})`;
};

// 格式化白平衡
const formatWhiteBalance = (wb) => {
    const wbModes = {
        0: "自动",
        1: "手动",
    };
    return wbModes[wb] || `未知 (${wb})`;
};

// 格式化EXIF数据显示
const formatExifData = (data) => {
    const filtered = {};
    Object.keys(data).forEach((key) => {
        if (data[key] !== null && data[key] !== undefined) {
            filtered[key] = data[key];
        }
    });
    return JSON.stringify(filtered, null, 2);
};

// 在Google地图中打开
const openInGoogleMaps = () => {
    if (hasGPSInfo.value) {
        const url = `https://www.google.com/maps?q=${gpsInfo.value.latitude},${gpsInfo.value.longitude}`;
        window.open(url, "_blank");
    }
};

// 在百度地图中打开
const openInBaiduMaps = () => {
    if (hasGPSInfo.value) {
        const url = `https://api.map.baidu.com/marker?location=${gpsInfo.value.latitude},${gpsInfo.value.longitude}&title=照片拍摄位置&content=&output=html`;
        window.open(url, "_blank");
    }
};

// 在高德地图中打开
const openInAMap = () => {
    if (hasGPSInfo.value) {
        const url = `https://uri.amap.com/marker?position=${gpsInfo.value.longitude},${gpsInfo.value.latitude}&name=照片拍摄位置&src=myapp`;
        window.open(url, "_blank");
    }
};

// 复制坐标
const copyCoordinates = async () => {
    if (hasGPSInfo.value) {
        const coords = `${gpsInfo.value.latitude}, ${gpsInfo.value.longitude}`;
        copyToClipboard(coords);
    }
};
</script>

<style scoped>
.image-location-viewer {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--space-lg);
    font-family:
        -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.header {
    text-align: center;
    margin-bottom: var(--space-2xl);
}

.header h1 {
    color: var(--accent);
    margin-bottom: var(--space-sm);
}

.header p {
    color: var(--text-secondary);
    font-size: var(--font-size-lg);
}

.upload-area {
    margin-bottom: var(--space-2xl);
}

.drop-zone {
    border: 2px dashed var(--border);
    border-radius: var(--radius-md);
    padding: var(--space-3xl);
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: var(--bg-secondary);
}

.drop-zone:hover,
.drop-zone.drag-over {
    border-color: var(--info);
    background: var(--hover-bg);
}

.upload-placeholder svg {
    color: var(--text-muted);
    margin-bottom: var(--space-md);
}

.upload-placeholder p {
    margin: var(--space-sm) 0;
    color: var(--text-secondary);
}

.upload-placeholder .hint {
    font-size: var(--font-size-sm);
    color: var(--text-muted);
}

.image-preview {
    position: relative;
    display: inline-block;
}

.image-preview img {
    max-width: 100%;
    max-height: 300px;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
}

.clear-btn {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: var(--error);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.metadata-section {
    margin-top: var(--space-2xl);
}

.metadata-section h2 {
    color: var(--accent);
    margin-bottom: var(--space-lg);
    border-bottom: 2px solid var(--info);
    padding-bottom: var(--space-sm);
}

.info-card {
    background: var(--bg);
    border-radius: var(--radius-md);
    padding: var(--space-xl);
    margin-bottom: var(--space-lg);
    box-shadow: var(--shadow);
    border: 1px solid var(--border);
}

.info-card h3 {
    color: var(--accent);
    margin-bottom: var(--space-md);
    font-size: var(--font-size-lg);
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--space-md);
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-xs) 0;
    border-bottom: 1px solid var(--border-light);
}

.info-item label {
    font-weight: var(--font-weight-semibold);
    color: var(--text);
    min-width: 100px;
}

.info-item span {
    color: var(--text);
    text-align: right;
    word-break: break-all;
}

.map-actions {
    margin-top: var(--space-md);
    display: flex;
    gap: var(--space-sm);
    flex-wrap: wrap;
}

.map-btn {
    background: var(--info);
    color: white;
    border: none;
    padding: var(--space-xs) var(--space-md);
    border-radius: var(--radius);
    cursor: pointer;
    font-size: var(--font-size-sm);
    transition: background 0.3s ease;
}

.map-btn:hover {
    background: var(--accent);
}

.exif-data pre {
    margin: 0;
    font-size: var(--font-size-xs);
    color: var(--text);
    white-space: pre-wrap;
    word-wrap: break-word;
}

.no-exif {
    margin-top: var(--space-2xl);
}

.no-exif p {
    margin-bottom: var(--space-md);
    color: var(--text-secondary);
}

.no-exif ul {
    color: var(--text-secondary);
    padding-left: var(--space-lg);
}

.no-exif li {
    margin-bottom: var(--space-xs);
}

.error-message {
    background: #f8d7da;
    color: var(--error);
    padding: var(--space-md);
    border-radius: var(--radius);
    margin: var(--space-lg) 0;
    border: 1px solid #f5c6cb;
}

.loading {
    text-align: center;
    padding: var(--space-3xl);
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-light);
    border-top: 4px solid var(--info);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto var(--space-md);
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

@media (max-width: 768px) {
    .image-location-viewer {
        padding: var(--space-md);
    }

    .info-grid {
        grid-template-columns: 1fr;
    }

    .map-actions {
        flex-direction: column;
    }
}
</style>
