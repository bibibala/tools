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
import { ref, computed, onMounted, onUnmounted } from "vue";

// 农历计算类 - 使用更准确的算法
class LunarCalendar {
    constructor() {
        // 生肖数组
        this.zodiacAnimals = [
            "鼠",
            "牛",
            "虎",
            "兔",
            "龙",
            "蛇",
            "马",
            "羊",
            "猴",
            "鸡",
            "狗",
            "猪",
        ];

        // 已知的准确农历新年日期（用于验证和基准）
        this.knownNewYearDates = {
            2020: new Date(2020, 0, 25), // 1月25日
            2021: new Date(2021, 1, 12), // 2月12日
            2022: new Date(2022, 1, 1), // 2月1日
            2023: new Date(2023, 0, 22), // 1月22日
            2024: new Date(2024, 1, 10), // 2月10日
            2025: new Date(2025, 0, 29), // 1月29日
            2026: new Date(2026, 1, 17), // 2月17日
            2027: new Date(2027, 1, 6), // 2月6日
            2028: new Date(2028, 0, 26), // 1月26日
            2029: new Date(2029, 1, 13), // 2月13日
            2030: new Date(2030, 1, 3), // 2月3日
        };
    }

    // 使用更精确的算法计算农历新年
    getChineseNewYear(gregorianYear) {
        // 如果有已知的准确日期，直接返回
        if (this.knownNewYearDates[gregorianYear]) {
            return this.knownNewYearDates[gregorianYear];
        }

        // 使用改进的算法计算
        return this.calculateNewYear(gregorianYear);
    }

    // 改进的农历新年计算算法
    calculateNewYear(year) {
        // 使用2025年作为基准点（已知准确日期）
        const baseYear = 2025;
        const baseDate = new Date(2025, 0, 29); // 2025年1月29日

        if (year === baseYear) {
            return baseDate;
        }

        const yearDiff = year - baseYear;

        // 农历年平均长度（考虑闰年）
        // 19年周期中有7个闰年，平均每年约354.367天
        const avgLunarYear = 354.367;
        const solarYear = 365.25;

        // 计算大概的日期偏移
        let dayOffset = Math.round(yearDiff * (avgLunarYear - solarYear));

        // 使用更精确的Metonic周期调整
        const metonicAdjustment = this.getMetonicAdjustment(year, baseYear);
        dayOffset += metonicAdjustment;

        // 计算新日期
        let newDate = new Date(
            baseDate.getTime() + dayOffset * 24 * 60 * 60 * 1000,
        );

        // 确保日期在合理范围内（1月21日到2月20日）
        newDate = this.adjustDateToValidRange(newDate);

        return newDate;
    }

    // Metonic周期调整（19年周期的微调）
    getMetonicAdjustment(year, baseYear) {
        const yearDiff = year - baseYear;
        const cycles = Math.floor(Math.abs(yearDiff) / 19);
        const remainder = Math.abs(yearDiff) % 19;

        // 每个完整周期的累积误差调整
        let adjustment = cycles * (yearDiff > 0 ? -1 : 1);

        // 根据19年周期内的位置进行微调
        const adjustments = [
            0, -1, 0, 1, 0, -1, 1, 0, -1, 0, 1, -1, 0, 1, 0, -1, 0, 1, -1,
        ];
        if (remainder < adjustments.length) {
            adjustment += adjustments[remainder] * (yearDiff > 0 ? 1 : -1);
        }

        return adjustment;
    }

    // 调整日期到有效范围
    adjustDateToValidRange(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();

        // 如果在1月但太早（小于21日）
        if (month === 0 && day < 21) {
            return new Date(year, 0, 21 + (day % 8));
        }

        // 如果在2月但太晚（大于20日）
        if (month === 1 && day > 20) {
            return new Date(year, 1, 1 + (day % 19));
        }

        // 如果在其他月份，调整到合理范围
        if (month > 1) {
            return new Date(year, 1, 1 + (day % 19));
        }

        if (month < 0) {
            return new Date(year, 0, 21 + (Math.abs(day) % 8));
        }

        return date;
    }

    // 获取生肖信息（修正生肖计算）
    getZodiacInfo(gregorianYear) {
        // 生肖以农历年为准，需要考虑农历新年的时间
        const newYearDate = this.getChineseNewYear(gregorianYear);
        const currentDate = new Date();

        let lunarYear = gregorianYear;

        // 如果还没到今年的农历新年，生肖应该是上一年的
        if (
            currentDate.getFullYear() === gregorianYear &&
            currentDate < newYearDate
        ) {
            lunarYear = gregorianYear - 1;
        }

        // 1900年是庚子年（鼠年），作为基准
        const baseYear = 1900;
        const animalIndex = (lunarYear - baseYear) % 12;

        return {
            animal: this.zodiacAnimals[animalIndex],
            name: `${this.zodiacAnimals[animalIndex]}年`,
            lunarYear: lunarYear,
        };
    }

    // 获取下一个农历新年
    getNextChineseNewYear(currentDate = new Date()) {
        const currentYear = currentDate.getFullYear();
        const thisYearNewYear = this.getChineseNewYear(currentYear);

        if (currentDate < thisYearNewYear) {
            return thisYearNewYear;
        } else {
            return this.getChineseNewYear(currentYear + 1);
        }
    }
}

// 创建农历计算实例
const lunarCalendar = new LunarCalendar();

// 响应式数据
const currentDate = ref(new Date());
const showDebug = ref(false); // 调试信息开关
let timer = null;

// 计算属性
const nextNewYear = computed(() => {
    return lunarCalendar.getNextChineseNewYear(currentDate.value);
});

const daysLeft = computed(() => {
    const timeDiff = nextNewYear.value.getTime() - currentDate.value.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
});

// 详细的时间倒计时
const timeLeft = computed(() => {
    const timeDiff = nextNewYear.value.getTime() - currentDate.value.getTime();

    if (timeDiff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(timeDiff / (1000 * 3600 * 24));
    const hours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
    const minutes = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return {
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
    };
});

const currentYear = computed(() => {
    return lunarCalendar.getZodiacInfo(currentDate.value.getFullYear());
});

const nextYear = computed(() => {
    const nextYearNum = nextNewYear.value.getFullYear();
    return lunarCalendar.getZodiacInfo(nextYearNum);
});

const progressPercentage = computed(() => {
    const yearStart = new Date(currentDate.value.getFullYear(), 0, 1);
    const nextNewYearDate = nextNewYear.value;
    const yearTotal = nextNewYearDate.getTime() - yearStart.getTime();
    const yearPassed = currentDate.value.getTime() - yearStart.getTime();
    return Math.min(
        Math.max(Math.round((yearPassed / yearTotal) * 100), 0),
        100,
    );
});

// SVG圆周长
const circumference = computed(() => 2 * Math.PI * 90);

// 生命周期
onMounted(() => {
    // 每秒更新一次时间
    timer = setInterval(() => {
        currentDate.value = new Date();
    }, 1000);

    // 开发模式下显示调试信息
    if (import.meta?.env?.DEV) {
        showDebug.value = true;
    }
});

onUnmounted(() => {
    if (timer) {
        clearInterval(timer);
    }
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
    z-index: 3;
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
