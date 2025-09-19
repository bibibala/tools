<template>
    <div class="tool-page">
        <header class="tool-header">
            <h1>项目配置生成器</h1>
            <p>快速生成 Prettier、ESLint 和 TypeScript 配置文件</p>
        </header>

        <main class="main-content">
            <section class="tool-section">
                <TabSwitcher @tab-change="handleTabChange">
                    <template #default="{ activeTab }">
                        <div v-show="activeTab === 'prettier'">
                            <PrettierConfig
                                ref="prettierConfigRef"
                                @config-change="handlePrettierConfigChange"
                            />
                        </div>
                        <div v-show="activeTab === 'eslint'">
                            <ESLintConfig
                                ref="eslintConfigRef"
                                @config-change="handleESLintConfigChange"
                            />
                        </div>
                        <div v-show="activeTab === 'typescript'">
                            <TypeScriptConfig
                                ref="typescriptConfigRef"
                                @config-change="handleTypeScriptConfigChange"
                            />
                        </div>
                    </template>
                </TabSwitcher>
            </section>

            <section class="tool-section">
                <ConfigOutput
                    ref="configOutputRef"
                    :prettier-config="prettierConfig"
                    :eslint-config="eslintConfig"
                    :typescript-config="typescriptConfig"
                    :active-tab="activeTab"
                />
            </section>
        </main>
    </div>
</template>

<script setup>
import { ref } from "vue";
import TabSwitcher from "@/views/PrettierConfig/components/TabSwitcher.vue";
import PrettierConfig from "@/views/PrettierConfig/components/PrettierConfig.vue";
import ESLintConfig from "@/views/PrettierConfig/components/ESLintConfig.vue";
import TypeScriptConfig from "@/views/PrettierConfig/components/TypeScriptConfig.vue";
import ConfigOutput from "@/views/PrettierConfig/components/ConfigOutput.vue";

// 组件引用
const prettierConfigRef = ref(null);
const eslintConfigRef = ref(null);
const typescriptConfigRef = ref(null);
const configOutputRef = ref(null);

// 配置数据
const prettierConfig = ref({});
const eslintConfig = ref({});
const typescriptConfig = ref({});
const activeTab = ref("prettier");

// 处理标签页切换
const handleTabChange = (tabId) => {
    activeTab.value = tabId;
};

// 处理配置变化
const handlePrettierConfigChange = (config) => {
    prettierConfig.value = config;
};

const handleESLintConfigChange = (config) => {
    eslintConfig.value = config;
};

const handleTypeScriptConfigChange = (config) => {
    typescriptConfig.value = config;
};
</script>

<style scoped>
.main-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-2xl);
}

@media (min-width: 1200px) {
    .main-content {
        grid-template-columns: 1fr 1fr;
    }
}
</style>
