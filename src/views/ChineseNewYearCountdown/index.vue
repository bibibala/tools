<template>
    <div class="tool-page">
        <div class="tool-header">
            <h1>🧧 农历新年倒计时</h1>
            <p>距离中国农历新年还有多少天</p>
        </div>

        <div class="tool-section">
            <div class="countdown-container">
                <!-- 巨大的时钟倒计时 -->
                <div class="clock-container">
                    <div class="clock-face">
                        <!-- 时钟刻度 -->
                        <div class="clock-marks">
                            <div
                                v-for="i in 12"
                                :key="i"
                                class="hour-mark"
                                :style="{ transform: `rotate(${i * 30}deg)` }"
                            >
                                <div class="mark-line"></div>
                            </div>
                            <div
                                v-for="i in 60"
                                :key="`min-${i}`"
                                class="minute-mark"
                                :style="{ transform: `rotate(${i * 6}deg)` }"
                            >
                                <div class="mark-dot"></div>
                            </div>
                        </div>

                        <!-- 时钟外圈进度 -->
                        <div class="clock-ring">
                            <svg class="progress-svg" viewBox="0 0 200 200">
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="90"
                                    fill="none"
                                    stroke="var(--border-light)"
                                    stroke-width="6"
                                />
                                <circle
                                    cx="100"
                                    cy="100"
                                    r="90"
                                    fill="none"
                                    stroke="var(--accent)"
                                    stroke-width="6"
                                    stroke-linecap="round"
                                    :stroke-dasharray="circumference"
                                    :stroke-dashoffset="
                                        circumference -
                                        (progressPercentage / 100) *
                                            circumference
                                    "
                                    transform="rotate(-90 100 100)"
                                    class="progress-circle"
                                />
                            </svg>
                        </div>

                        <!-- 时钟指针 -->
                        <div class="clock-hands">
                            <!-- 时针 -->
                            <div
                                class="clock-hand hour-hand"
                                :style="{
                                    transform: `rotate(${hourAngle}deg)`,
                                }"
                            ></div>
                            <!-- 分针 -->
                            <div
                                class="clock-hand minute-hand"
                                :style="{
                                    transform: `rotate(${minuteAngle}deg)`,
                                }"
                            ></div>
                            <!-- 秒针 -->
                            <div
                                class="clock-hand second-hand"
                                :style="{
                                    transform: `rotate(${secondAngle}deg)`,
                                }"
                            ></div>
                        </div>

                        <!-- 时钟中心内容 -->
                        <div class="clock-center">
                            <div v-if="daysLeft > 0" class="countdown-active">
                                <div class="countdown-subtitle">
                                    当前{{ currentYear.animal }}年
                                </div>
                                <div class="time-display">
                                    <div class="time-unit">
                                        <div class="time-number">
                                            {{ timeLeft.days }}
                                        </div>
                                        <div class="time-label">天</div>
                                    </div>
                                    <div class="time-separator">:</div>
                                    <div class="time-unit">
                                        <div class="time-number">
                                            {{ timeLeft.hours }}
                                        </div>
                                        <div class="time-label">时</div>
                                    </div>
                                    <div class="time-separator">:</div>
                                    <div class="time-unit">
                                        <div class="time-number">
                                            {{ timeLeft.minutes }}
                                        </div>
                                        <div class="time-label">分</div>
                                    </div>
                                    <div class="time-separator">:</div>
                                    <div class="time-unit">
                                        <div class="time-number">
                                            {{ timeLeft.seconds }}
                                        </div>
                                        <div class="time-label">秒</div>
                                    </div>
                                </div>
                                <div class="countdown-subtitle">
                                    距离{{ nextYear.name }}
                                </div>
                                <div class="debug-info" v-if="showDebug">
                                    <small
                                        >下一个新年:
                                        {{
                                            nextNewYear.toLocaleDateString(
                                                "zh-CN",
                                            )
                                        }}</small
                                    >
                                </div>
                            </div>
                            <div
                                v-else-if="daysLeft === 0"
                                class="countdown-today"
                            >
                                <div class="celebration">🎉</div>
                                <div class="countdown-label">
                                    农历新年快乐！
                                </div>
                                <div class="countdown-subtitle">
                                    {{ currentYear.name }}
                                </div>
                            </div>
                            <div v-else class="countdown-passed">
                                <div class="countdown-label">农历新年已过</div>
                                <div class="countdown-subtitle">
                                    距离{{ nextYear.name }}还有{{
                                        Math.abs(daysLeft)
                                    }}天
                                </div>
                            </div>
                        </div>

                        <!-- 时钟中心点 -->
                        <div class="clock-center-dot"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Solar } from "lunar-javascript";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

// ----- state & timer -----
const currentDate = ref(new Date());
const showDebug = ref(false);
let timer = null;

// ----- helper: 在公历区间内查找正月初一（更稳健，避免依赖库中可能不同命名的 getNewYear） -----
function getChineseNewYear(gregorianYear) {
    const msDay = 24 * 3600 * 1000;
    const start = new Date(gregorianYear, 0, 21); // 1 月 21 日
    const end = new Date(gregorianYear, 1, 20); // 2 月 20 日
    const days = Math.round((end.getTime() - start.getTime()) / msDay);

    for (let i = 0; i <= days; i++) {
        const d = new Date(start.getTime() + i * msDay);
        const solar = Solar.fromDate(d);
        const lunar = solar.getLunar();
        // lunar.getMonth() / getDay() 返回农历月/日（数字）
        if (lunar.getMonth() === 1 && lunar.getDay() === 1) {
            // 返回一个纯 Date（本地时区，日期为当天）
            return new Date(d.getFullYear(), d.getMonth(), d.getDate());
        }
    }

    // 极端兜底：如果意外没找到（理论上不可能），返回 1/1
    return new Date(gregorianYear, 0, 1);
}

// ----- 计算下一个农历新年 -----
const nextNewYear = computed(() => {
    const now = currentDate.value;
    const thisYearNY = getChineseNewYear(now.getFullYear());
    if (now < thisYearNY) return thisYearNY;
    return getChineseNewYear(now.getFullYear() + 1);
});

// 剩余天数（向上取整）
const daysLeft = computed(() => {
    const diff = nextNewYear.value.getTime() - currentDate.value.getTime();
    return Math.ceil(diff / (24 * 3600 * 1000));
});

// 详细倒计时（天/时/分/秒，字符串形式，前导零）
const timeLeft = computed(() => {
    let diff = nextNewYear.value.getTime() - currentDate.value.getTime();
    if (diff <= 0) {
        return { days: "00", hours: "00", minutes: "00", seconds: "00" };
    }
    const days = Math.floor(diff / (24 * 3600 * 1000));
    diff -= days * 24 * 3600 * 1000;
    const hours = Math.floor(diff / (3600 * 1000));
    diff -= hours * 3600 * 1000;
    const minutes = Math.floor(diff / (60 * 1000));
    diff -= minutes * 60 * 1000;
    const seconds = Math.floor(diff / 1000);

    return {
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
    };
});

// 当前的生肖 / 年（使用 lunar-javascript 提供的 lunar 信息）
const currentYear = computed(() => {
    const lunar = Solar.fromDate(currentDate.value).getLunar();
    return {
        animal: lunar.getYearShengXiao(), // 例如 "虎"
        name: `${lunar.getYearInGanZhi()}${lunar.getYearShengXiao()}年`, // 干支+生肖
        lunarYear: lunar.getYear(), // 农历年份数字
    };
});

// 下一个农历年的生肖/名称
const nextYear = computed(() => {
    const lunar = Solar.fromDate(nextNewYear.value).getLunar();
    return {
        animal: lunar.getYearShengXiao(),
        name: `${lunar.getYearInGanZhi()}${lunar.getYearShengXiao()}年`,
        lunarYear: lunar.getYear(),
    };
});

// 进度百分比（从当年 1 月 1 到下一个春节）
const progressPercentage = computed(() => {
    const yearStart = new Date(currentDate.value.getFullYear(), 0, 1);
    const yearTotal = nextNewYear.value.getTime() - yearStart.getTime();
    const yearPassed = currentDate.value.getTime() - yearStart.getTime();
    return Math.min(
        Math.max(Math.round((yearPassed / yearTotal) * 100), 0),
        100,
    );
});

// SVG 圆周长（与你现有 template 保持一致）
const circumference = computed(() => 2 * Math.PI * 90);

// ----- 时钟指针角度计算 -----
const hourAngle = computed(() => {
    const now = currentDate.value;
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    // 时针每小时转30度，每分钟转0.5度
    return hours * 30 + minutes * 0.5;
});

const minuteAngle = computed(() => {
    const now = currentDate.value;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    // 分针每分钟转6度，每秒钟转0.1度
    return minutes * 6 + seconds * 0.1;
});

const secondAngle = computed(() => {
    const now = currentDate.value;
    const seconds = now.getSeconds();
    // 秒针每秒钟转6度
    return seconds * 6;
});

// ----- 生命周期 -----
onMounted(() => {
    // 每秒更新 currentDate（使倒计时运行）
    timer = setInterval(() => {
        currentDate.value = new Date();
    }, 1000);

    if (import.meta?.env?.DEV) {
        showDebug.value = true;
    }
});

onBeforeUnmount(() => {
    if (timer) clearInterval(timer);
});
</script>

<style scoped>
.countdown-container {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 70vh;
    padding: 1rem;
}

.clock-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
}

.clock-face {
    position: relative;
    width: 450px;
    height: 450px;
    border-radius: 50%;
    background: linear-gradient(145deg, var(--bg), var(--bg-secondary));
    box-shadow:
        var(--shadow-lg),
        inset 0 2px 4px rgba(255, 255, 255, 0.8),
        inset 0 -2px 4px rgba(0, 0, 0, 0.05);
    border: 2px solid var(--border);
}

/* 时钟刻度 */
.clock-marks {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
}

.hour-mark {
    position: absolute;
    top: 11px;
    left: 50%;
    width: 4px;
    height: 32px;
    transform-origin: 2px 214px;
}

.mark-line {
    width: 100%;
    height: 100%;
    background: var(--accent);
    border-radius: 1.5px;
}

.minute-mark {
    position: absolute;
    top: 16px;
    left: 50%;
    width: 1px;
    height: 16px;
    transform-origin: 0.5px 209px;
}

.mark-dot {
    width: 100%;
    height: 100%;
    background: var(--text-muted);
    border-radius: 0.5px;
}

/* 进度环 */
.clock-ring {
    position: absolute;
    top: 22px;
    left: 22px;
    right: 22px;
    bottom: 22px;
}

.progress-svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
}

.progress-circle {
    transition: stroke-dashoffset 0.5s ease;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

/* 时钟指针 */
.clock-hands {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.clock-hand {
    position: absolute;
    left: 50%;
    transform-origin: bottom center;
    border-radius: 2px;
    transition: transform 0.1s ease-out;
}

.hour-hand {
    top: 30%;
    width: 6px;
    height: 20%;
    background: linear-gradient(to top, var(--text), var(--text-secondary));
    margin-left: -3px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    z-index: 3;
}

.minute-hand {
    top: 20%;
    width: 4px;
    height: 30%;
    background: linear-gradient(
        to top,
        var(--accent),
        var(--accent-light, var(--accent))
    );
    margin-left: -2px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    z-index: 4;
}

.second-hand {
    top: 15%;
    width: 2px;
    height: 35%;
    background: linear-gradient(to top, #ff4444, #ff6666);
    margin-left: -1px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    z-index: 5;
    transition: transform 0.05s cubic-bezier(0.4, 0, 0.2, 1);
}

.clock-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 85%;
    z-index: 2;
}

.time-display {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--space-xs);
    margin-bottom: var(--space-md);
    flex-wrap: wrap;
}

.time-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 55px;
    background: var(--bg);
    border-radius: var(--radius);
    padding: var(--space-sm);
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-light);
}

.time-number {
    font-size: 2rem;
    font-weight: var(--font-weight-bold);
    color: var(--accent);
    line-height: 1;
    font-family: "Courier New", monospace;
}

.time-label {
    font-size: var(--font-size-xs);
    color: var(--text-secondary);
    margin-top: 2px;
    font-weight: var(--font-weight-medium);
}

.time-separator {
    font-size: 1.6rem;
    font-weight: var(--font-weight-bold);
    color: var(--text-muted);
    align-self: flex-start;
    margin-top: 12px;
}

.countdown-subtitle {
    font-size: var(--font-size-sm);
    color: var(--text-secondary);
    margin-top: var(--space-sm);
    font-weight: var(--font-weight-medium);
}

.debug-info {
    margin-top: var(--space-sm);
    color: var(--text-muted);
    font-size: 0.7rem;
}

/* 时钟中心点 */
.clock-center-dot {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 15px;
    height: 15px;
    background: var(--accent);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow:
        var(--shadow-sm),
        inset 0 1px 2px rgba(255, 255, 255, 0.3);
    z-index: 6;
}

.countdown-today .celebration {
    font-size: 3rem;
    margin-bottom: var(--space-md);
}

.countdown-today .countdown-label {
    color: var(--success);
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
}

.countdown-passed .countdown-label {
    color: var(--text-muted);
    font-size: var(--font-size-lg);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .countdown-container {
        padding: 0.5rem;
    }

    .clock-face {
        width: 350px;
        height: 350px;
    }

    .hour-mark {
        top: 9px;
        height: 25px;
        transform-origin: 2px 166px;
    }

    .minute-mark {
        top: 13px;
        height: 13px;
        transform-origin: 0.5px 162px;
    }

    .clock-ring {
        top: 17px;
        left: 17px;
        right: 17px;
        bottom: 17px;
    }

    .hour-hand {
        width: 5px;
        margin-left: -2.5px;
    }

    .minute-hand {
        width: 3px;
        margin-left: -1.5px;
    }

    .second-hand {
        width: 1.5px;
        margin-left: -0.75px;
    }

    .time-number {
        font-size: 1.4rem;
    }

    .time-separator {
        font-size: 1.1rem;
        margin-top: 6px;
    }

    .time-unit {
        min-width: 40px;
        padding: var(--space-xs);
    }

    .clock-center-dot {
        width: 10px;
        height: 10px;
    }
}

@media (max-width: 480px) {
    .countdown-container {
        padding: 0.25rem;
    }

    .clock-container {
        padding: 0;
    }

    .clock-face {
        width: 300px;
        height: 300px;
    }

    .hour-mark {
        top: 7px;
        height: 20px;
        transform-origin: 2px 143px;
    }

    .minute-mark {
        top: 10px;
        height: 10px;
        transform-origin: 0.5px 140px;
    }

    .clock-ring {
        top: 15px;
        left: 15px;
        right: 15px;
        bottom: 15px;
    }

    .hour-hand {
        width: 4px;
        margin-left: -2px;
    }

    .minute-hand {
        width: 2.5px;
        margin-left: -1.25px;
    }

    .second-hand {
        width: 1px;
        margin-left: -0.5px;
    }

    .time-number {
        font-size: 1.2rem;
    }

    .time-separator {
        font-size: 1rem;
    }

    .time-unit {
        min-width: 35px;
        padding: 4px;
    }

    .clock-center-dot {
        width: 8px;
        height: 8px;
    }
}
</style>
