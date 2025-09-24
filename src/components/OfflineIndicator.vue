<template>
    <div
        class="offline-indicator"
        :class="{ offline: !isOnline }"
        v-if="!isOnline || showAlways"
    >
        <span class="status-dot" :class="{ offline: !isOnline }"></span>
        <span class="status-text">{{ statusText }}</span>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";

defineProps({
    showAlways: {
        type: Boolean,
        default: false,
    },
});

const isOnline = ref(navigator.onLine);

const statusText = computed(() => {
    return isOnline.value ? "在线" : "离线";
});

const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine;
};

onMounted(() => {
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
});

onUnmounted(() => {
    window.removeEventListener("online", updateOnlineStatus);
    window.removeEventListener("offline", updateOnlineStatus);
});
</script>

<style scoped>
.offline-indicator {
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(76, 175, 80, 0.9);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 1000;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
}

.offline-indicator.offline {
    background: rgba(255, 107, 107, 0.9);
    animation: pulse 2s infinite;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4caf50;
    animation: pulse-online 2s infinite;
}

.status-dot.offline {
    background: #ff6b6b;
    animation: pulse-offline 1s infinite;
}

.status-text {
    font-weight: 500;
}

@keyframes pulse-online {
    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.7;
        transform: scale(1.1);
    }
}

@keyframes pulse-offline {
    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.5;
        transform: scale(1.2);
    }
}

@keyframes pulse {
    0% {
        box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
    }
    50% {
        box-shadow: 0 4px 20px rgba(255, 107, 107, 0.6);
    }
    100% {
        box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .offline-indicator {
        top: 10px;
        right: 10px;
        padding: 6px 12px;
        font-size: 12px;
    }
}
</style>
