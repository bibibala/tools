<template>
  <div class="page">
    <RouterLink to="/" class="back">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      返回
    </RouterLink>

    <div class="card">
      <div class="badge">{{ currentYear.animal }}</div>

      <h1 class="title">农历新年倒计时</h1>
      <p class="subtitle">{{ currentYear.name }}</p>

      <div class="countdown">
        <div class="block">
          <span class="value">{{ timeLeft.days }}</span>
          <span class="label">天</span>
        </div>
        <span class="sep">:</span>
        <div class="block">
          <span class="value">{{ timeLeft.hours }}</span>
          <span class="label">时</span>
        </div>
        <span class="sep">:</span>
        <div class="block">
          <span class="value">{{ timeLeft.minutes }}</span>
          <span class="label">分</span>
        </div>
        <span class="sep">:</span>
        <div class="block">
          <span class="value">{{ timeLeft.seconds }}</span>
          <span class="label">秒</span>
        </div>
      </div>

      <p class="target">距离 {{ nextYear.name }}</p>

      <div class="progress">
        <div class="track">
          <div class="fill" :style="{ width: `${progressPercentage}%` }"></div>
        </div>
        <span class="progress-text">{{ progressPercentage }}%</span>
      </div>

      <div v-if="daysLeft === 0" class="celebration">🎉 农历新年快乐！</div>
    </div>
  </div>
</template>

<script setup>
import { Solar } from "lunar-javascript";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { RouterLink } from "vue-router";

const currentDate = ref(new Date());
let timer = null;

function getChineseNewYear(gregorianYear) {
  const msDay = 24 * 3600 * 1000;
  const start = new Date(gregorianYear, 0, 21);
  const end = new Date(gregorianYear, 1, 20);
  const days = Math.round((end.getTime() - start.getTime()) / msDay);
  for (let i = 0; i <= days; i++) {
    const d = new Date(start.getTime() + i * msDay);
    const solar = Solar.fromDate(d);
    const lunar = solar.getLunar();
    if (lunar.getMonth() === 1 && lunar.getDay() === 1) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
  }
  return new Date(gregorianYear, 0, 1);
}

const nextNewYear = computed(() => {
  const now = currentDate.value;
  const thisYearNY = getChineseNewYear(now.getFullYear());
  if (now < thisYearNY) return thisYearNY;
  return getChineseNewYear(now.getFullYear() + 1);
});

const daysLeft = computed(() => {
  const diff = nextNewYear.value.getTime() - currentDate.value.getTime();
  return Math.ceil(diff / (24 * 3600 * 1000));
});

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

const currentYear = computed(() => {
  const lunar = Solar.fromDate(currentDate.value).getLunar();
  return {
    animal: lunar.getYearShengXiao(),
    name: `${lunar.getYearInGanZhi()}${lunar.getYearShengXiao()}年`,
  };
});

const nextYear = computed(() => {
  const lunar = Solar.fromDate(nextNewYear.value).getLunar();
  return {
    animal: lunar.getYearShengXiao(),
    name: `${lunar.getYearInGanZhi()}${lunar.getYearShengXiao()}年`,
  };
});

const progressPercentage = computed(() => {
  const yearStart = new Date(currentDate.value.getFullYear(), 0, 1);
  const yearTotal = nextNewYear.value.getTime() - yearStart.getTime();
  const yearPassed = currentDate.value.getTime() - yearStart.getTime();
  return Math.min(Math.max(Math.round((yearPassed / yearTotal) * 100), 0), 100);
});

onMounted(() => {
  timer = setInterval(() => {
    currentDate.value = new Date();
  }, 1000);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.page {
  max-width: 400px;
  margin: 0 auto;
  padding: 48px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 13px;
  margin-bottom: 24px;
  padding: 4px 8px;
  margin-left: -8px;
  border-radius: 6px;
  transition: all 0.15s ease;
  align-self: flex-start;
}

.back:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

.back svg {
  width: 14px;
  height: 14px;
}

.card {
  width: 100%;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 32px 24px;
  text-align: center;
  position: relative;
}

.badge {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.title {
  font-size: 18px;
  font-weight: 600;
  margin-top: 8px;
  margin-bottom: 4px;
}

.subtitle {
  color: var(--text-muted);
  font-size: 13px;
  margin-bottom: 24px;
}

.countdown {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
}

.block {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bg-base);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 12px 10px;
  min-width: 60px;
}

.value {
  font-size: 24px;
  font-weight: 600;
  font-family: "SF Mono", "Monaco", monospace;
  color: var(--accent);
  line-height: 1;
}

.label {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 4px;
}

.sep {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-muted);
  margin-top: -14px;
}

.target {
  color: var(--text-muted);
  font-size: 13px;
  margin-bottom: 20px;
}

.progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.track {
  flex: 1;
  height: 4px;
  background: var(--bg-base);
  border-radius: 2px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 12px;
  color: var(--text-muted);
  font-family: "SF Mono", "Monaco", monospace;
  min-width: 36px;
  text-align: right;
}

.celebration {
  margin-top: 20px;
  font-size: 15px;
  font-weight: 500;
  color: var(--accent);
  padding: 12px;
  background: var(--accent-dim);
  border-radius: 6px;
}
</style>
