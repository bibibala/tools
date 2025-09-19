<template>
    <div class="container">
        <h1 class="text-2xl font-bold mb-4">Vue3 多人在线绘图</h1>

        <!-- 房间和用户设置 -->
        <div class="room-setup mb-4 p-4 border rounded">
            <div class="flex flex-col sm:flex-row gap-2">
                <input
                    v-model="roomId"
                    placeholder="房间ID"
                    class="px-3 py-2 border rounded"
                />
                <input
                    v-model="username"
                    placeholder="你的昵称"
                    class="px-3 py-2 border rounded"
                />
                <button
                    @click="joinRoom"
                    :disabled="isJoined"
                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {{ isJoined ? "已加入" : "加入房间" }}
                </button>
            </div>

            <div v-if="isJoined" class="mt-2 text-sm text-green-600">
                已加入房间: {{ roomId }} (你的ID: {{ userId }})
            </div>
        </div>

        <!-- 绘图区域（确保容器有明确尺寸） -->
        <div
            class="drawing-area relative border rounded overflow-hidden bg-white"
            style="width: 100%; height: 500px"
            v-if="isJoined"
        >
            <!-- 画布绑定ref，并设置内联宽高 -->
            <canvas
                ref="canvas"
                @mousedown="startDrawing"
                @mousemove="draw"
                @mouseup="stopDrawing"
                @mouseleave="stopDrawing"
                @touchstart="handleTouchStart"
                @touchmove="handleTouchMove"
                @touchend="stopDrawing"
                class="cursor-crosshair w-full h-full"
                :width="canvasWidth"
                :height="canvasHeight"
            ></canvas>
        </div>

        <!-- 工具栏 -->
        <div class="toolbar mt-4 p-4 border rounded" v-if="isJoined">
            <div class="flex flex-wrap gap-2 mb-3">
                <button
                    v-for="color in colors"
                    :key="color"
                    @click="selectColor(color)"
                    :class="[
                        'w-6 h-6 rounded-full',
                        {
                            'ring-2 ring-offset-2 ring-black':
                                currentColor === color,
                        },
                    ]"
                    :style="{ backgroundColor: color }"
                    title="选择颜色"
                ></button>
            </div>

            <div class="flex items-center gap-2">
                <label>线条粗细: {{ lineWidth }}</label>
                <input
                    type="range"
                    min="1"
                    max="20"
                    v-model.number="lineWidth"
                    class="w-32"
                />
                <button
                    @click="clearCanvas"
                    class="ml-auto bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                    清空画布
                </button>
            </div>
        </div>

        <!-- 在线用户 -->
        <div class="users mt-4 p-4 border rounded" v-if="isJoined">
            <h3 class="font-semibold mb-2">
                在线用户 ({{ onlineUsers.length }})
            </h3>
            <ul>
                <li v-for="user in onlineUsers" :key="user" class="text-sm">
                    {{ user }}
                    <span v-if="user === username" class="text-green-600 ml-1"
                        >(你)</span
                    >
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import { initializeApp } from "firebase/app";
import {
    getDatabase,
    ref as dbRef,
    set,
    onValue,
    push,
    remove,
    onChildAdded,
} from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth"; // 引入认证

// Firebase 配置 - 替换为你自己的配置
const firebaseConfig = {
    apiKey: "AIzaSyAY3IsvQqu-21zD8B0fcnumBy17jD0OXhE",
    authDomain: "webrtc-8f718.firebaseapp.com",
    databaseURL:
        "https://webrtc-8f718-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "webrtc-8f718",
    storageBucket: "webrtc-8f718.firebasestorage.app",
    messagingSenderId: "941768345652",
    appId: "1:941768345652:web:658f55fb2763556e67a261",
    measurementId: "G-7DDVQDV65M",
};

// 初始化Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

// 修复认证初始化 - 添加错误处理和配置检查
const auth = getAuth(firebaseApp);

// 等待认证初始化完成
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("用户已登录:", user.uid);
    } else {
        // 尝试匿名登录，添加更多错误处理
        signInAnonymously(auth)
            .then(() => {
                console.log("匿名登录成功");
            })
            .catch((error) => {
                console.error("匿名登录失败:", error.code, error.message);
                // 如果认证失败，继续运行但限制某些功能
                if (error.code === "auth/configuration-not-found") {
                    console.warn("Firebase认证未配置，继续运行基础功能");
                }
            });
    }
});

// 状态变量
const roomId = ref("default-room");
const username = ref(`用户${Math.floor(Math.random() * 1000)}`);
const isJoined = ref(false);
const userId = ref("");
const canvas = ref(null); // 画布ref
const ctx = ref(null); // 画布上下文
const isDrawing = ref(false);
const lastPosition = ref({ x: 0, y: 0 });
const currentColor = ref("#000000");
const lineWidth = ref(5);
const onlineUsers = ref([]);
const peerConnections = ref({});
const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFFFFF",
];
// 画布尺寸（关键：设置明确的宽高）
const canvasWidth = ref(800);
const canvasHeight = ref(500);

// 初始化画布（修复核心逻辑）
const initCanvas = () => {
    // 确保canvas元素已加载
    if (!canvas.value) {
        console.error("canvas元素未找到");
        return;
    }

    // 设置画布实际尺寸（关键：避免绘图模糊和尺寸问题）
    canvasWidth.value = canvas.value.parentElement.clientWidth;
    canvasHeight.value = 500;

    // 强制刷新DOM，确保尺寸生效
    nextTick(() => {
        // 获取上下文
        ctx.value = canvas.value.getContext("2d");
        if (!ctx.value) {
            console.error("无法获取画布上下文");
            return;
        }

        // 初始化绘图属性
        ctx.value.lineCap = "round";
        ctx.value.lineJoin = "round";
        ctx.value.strokeStyle = currentColor.value;
        ctx.value.lineWidth = lineWidth.value;
        console.log("画布初始化完成");
    });
};

// 组件挂载后初始化画布
onMounted(() => {
    // 监听窗口大小变化，动态调整画布
    window.addEventListener("resize", () => {
        if (isJoined.value) {
            initCanvas();
        }
    });
});

// 加入房间时初始化画布
const joinRoom = () => {
    if (!roomId.value || !username.value) return;

    // 生成唯一用户ID
    userId.value = `${username.value}-${Date.now().toString().slice(-4)}`;
    isJoined.value = true;

    // 关键：加入房间后初始化画布（确保此时canvas元素已渲染）
    nextTick(() => {
        initCanvas();
    });

    // 以下是原有的房间逻辑（用户管理、信令等）
    const userRef = dbRef(db, `rooms/${roomId.value}/users/${userId.value}`);
    set(userRef, username.value);

    window.addEventListener("beforeunload", () => {
        remove(userRef);
    });

    const usersRef = dbRef(db, `rooms/${roomId.value}/users`);
    onValue(usersRef, (snapshot) => {
        const users = snapshot.val() || {};
        onlineUsers.value = Object.values(users);

        Object.keys(users).forEach((peerId) => {
            if (peerId !== userId.value && !peerConnections.value[peerId]) {
                createPeerConnection(peerId);
            }
        });
    });

    const signalsRef = dbRef(db, `rooms/${roomId.value}/signals`);
    onChildAdded(signalsRef, (snapshot) => {
        const signal = snapshot.val();
        if (signal && signal.target === userId.value && signal.data) {
            // 验证信号数据完整性
            if (
                signal.data.type &&
                (signal.data.type === "offer" ||
                    signal.data.type === "answer" ||
                    signal.data.type === "ice")
            ) {
                handleSignal(signal.sender, signal.data);
            } else {
                console.warn("收到无效的信号类型:", signal.data?.type);
            }
        }
        remove(snapshot.ref);
    });

    const drawingsRef = dbRef(db, `rooms/${roomId.value}/drawings`);
    onChildAdded(drawingsRef, (snapshot) => {
        const drawing = snapshot.val();
        if (drawing.sender !== userId.value) {
            drawRemote(drawing.data);
        }
        remove(snapshot.ref);
    });
};

// 修复绘图相关函数（增加ctx存在性检查）
const startDrawing = (e) => {
    if (!ctx.value) return; // 确保上下文存在
    isDrawing.value = true;
    const pos = getPosition(e);
    lastPosition.value = pos;
};

const draw = (e) => {
    if (!isDrawing.value || !ctx.value) return; // 检查上下文

    const currentPos = getPosition(e);

    // 本地绘制
    ctx.value.strokeStyle = currentColor.value;
    ctx.value.lineWidth = lineWidth.value;
    ctx.value.beginPath();
    ctx.value.moveTo(lastPosition.value.x, lastPosition.value.y);
    ctx.value.lineTo(currentPos.x, currentPos.y);
    ctx.value.stroke();

    // 发送绘图数据（省略，保持原有逻辑）
    const drawingData = {
        x1: lastPosition.value.x,
        y1: lastPosition.value.y,
        x2: currentPos.x,
        y2: currentPos.y,
        color: currentColor.value,
        width: lineWidth.value,
    };

    Object.values(peerConnections.value).forEach((pc) => {
        if (pc.dataChannel && pc.dataChannel.readyState === "open") {
            pc.dataChannel.send(JSON.stringify(drawingData));
        }
    });

    const drawingsRef = dbRef(db, `rooms/${roomId.value}/drawings`);
    push(drawingsRef, {
        sender: userId.value,
        data: drawingData,
    });

    lastPosition.value = currentPos;
};

// 修复远程绘图函数
const drawRemote = (data) => {
    if (!ctx.value) return; // 检查上下文

    const originalColor = ctx.value.strokeStyle;
    const originalWidth = ctx.value.lineWidth;

    ctx.value.strokeStyle = data.color;
    ctx.value.lineWidth = data.width;
    ctx.value.beginPath();
    ctx.value.moveTo(data.x1, data.y1);
    ctx.value.lineTo(data.x2, data.y2);
    ctx.value.stroke();

    ctx.value.strokeStyle = originalColor;
    ctx.value.lineWidth = originalWidth;
};

// 其他函数（createPeerConnection、handleSignal等保持不变）
const createPeerConnection = (peerId) => {
    const pc = new RTCPeerConnection({
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
        ],
    });

    peerConnections.value[peerId] = pc;

    const dataChannel = pc.createDataChannel("drawing");
    setupDataChannel(peerId, dataChannel);

    pc.onicecandidate = (event) => {
        if (event.candidate) {
            sendSignal(peerId, {
                type: "ice",
                candidate: event.candidate,
            });
        }
    };

    pc.ondatachannel = (event) => {
        setupDataChannel(peerId, event.channel);
    };

    pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
            sendSignal(peerId, {
                type: "offer",
                sdp: pc.localDescription,
            });
        })
        .catch((err) => console.error("创建offer失败:", err));
};

const sendSignal = (targetId, data) => {
    const signalsRef = dbRef(db, `rooms/${roomId.value}/signals`);
    push(signalsRef, {
        sender: userId.value,
        target: targetId,
        data: data,
    });
};

const handleSignal = (peerId, signal) => {
    if (!peerConnections.value[peerId]) {
        createPeerConnection(peerId);
    }

    const pc = peerConnections.value[peerId];
    if (!pc) return;

    if (signal.type === "offer") {
        // 修复：检查SDP是否为null
        if (!signal.sdp) {
            console.error("收到空的offer SDP");
            return;
        }

        pc.setRemoteDescription(new RTCSessionDescription(signal.sdp))
            .then(() => pc.createAnswer())
            .then((answer) => pc.setLocalDescription(answer))
            .then(() => {
                sendSignal(peerId, {
                    type: "answer",
                    sdp: pc.localDescription,
                });
            })
            .catch((err) => console.error("处理offer失败:", err));
    } else if (signal.type === "answer") {
        // 修复：检查SDP是否为null
        if (!signal.sdp) {
            console.error("收到空的answer SDP");
            return;
        }

        pc.setRemoteDescription(new RTCSessionDescription(signal.sdp)).catch(
            (err) => console.error("处理answer失败:", err),
        );
    } else if (signal.type === "ice") {
        // 修复：检查ICE候选者是否有效
        if (
            !signal.candidate ||
            (!signal.candidate.sdpMid && !signal.candidate.sdpMLineIndex)
        ) {
            console.warn("收到无效的ICE候选者，跳过");
            return;
        }

        pc.addIceCandidate(new RTCIceCandidate(signal.candidate)).catch((err) =>
            console.error("添加ICE候选者失败:", err),
        );
    }
};

const setupDataChannel = (peerId, channel) => {
    channel.onopen = () => {
        console.log(`与 ${peerId} 的数据通道已打开`);
    };

    channel.onmessage = (event) => {
        const data = JSON.parse(event.data);
        drawRemote(data);
    };

    channel.onclose = () => {
        console.log(`与 ${peerId} 的数据通道已关闭`);
        delete peerConnections.value[peerId];
    };
};

const stopDrawing = () => {
    isDrawing.value = false;
};

const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const pos = getPosition(touch);
    lastPosition.value = pos;
    isDrawing.value = true;
};

const handleTouchMove = (e) => {
    e.preventDefault();
    if (isDrawing.value) {
        const touch = e.touches[0];
        draw(touch);
    }
};

const getPosition = (e) => {
    if (!canvas.value) return { x: 0, y: 0 };
    const rect = canvas.value.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    };
};

const selectColor = (color) => {
    currentColor.value = color;
};

const clearCanvas = () => {
    if (!ctx.value) return;
    ctx.value.clearRect(0, 0, canvasWidth.value, canvasHeight.value);

    const clearData = { type: "clear" };
    Object.values(peerConnections.value).forEach((pc) => {
        if (pc.dataChannel && pc.dataChannel.readyState === "open") {
            pc.dataChannel.send(JSON.stringify(clearData));
        }
    });

    const drawingsRef = dbRef(db, `rooms/${roomId.value}/drawings`);
    push(drawingsRef, {
        sender: userId.value,
        data: clearData,
    });
};
</script>

<style scoped>
.container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
}

/* 确保绘图区域可见 */
.drawing-area {
    border: 1px solid #ccc;
    margin-bottom: 10px;
}

ul {
    list-style: none;
    padding: 0;
}

li {
    padding: 4px 0;
}
</style>
