---

# MyTools - 实用在线工具集合

[Switch to English](README-EN.md) | [切换中文](README.md)

## 📋 工具清单

| 工具名称          | 路径                   | 核心功能                                                     |
|---------------|----------------------|----------------------------------------------------------|
| 正则可视化调试       | `/regex`             | 实时解析正则表达式，可视化匹配过程，支持正则语法校验与替换测试                          |
| 大文件处理工具       | `/file`              | 支持大文件上传、内容检索、格式转换（如 TXT/CSV 互转）、分片处理（避免内存溢出）             |
| 颜色处理          | `/color`             | 颜色值转换（HEX/RGB/RGBA/HSL）、配色方案生成、对比度检测（符合 WCAG 标准）         |
| Json 转 Ts 接口  | `/json-to-interface` | 自动将 JSON 数据结构转换为 TypeScript 接口类型，支持嵌套结构与数组解析             |
| Prettier 配置生成 | `/prettier`          | 可视化配置 Prettier 代码格式化规则，实时预览效果并一键导出配置文件                   |
| 网站元信息（SEO）配置  | `/web-meta`          | 配置网站标题、描述、社交预览（Open Graph/Twitter Card），导出可直接使用的 HTML 文件 |

## 🚀 快速开始

### 环境准备

- Node.js 22.19.0+
- pnpm 8+

### 安装依赖

```sh
pnpm install
```

## 📁 项目结构（核心目录）

```
mytools/
├── src/
│   ├── views/          # 工具页面（对应路由的核心组件）
│   │   ├── RegexVisualizer/    # 正则可视化调试工具
│   │   ├── FileAction/         # 大文件处理工具
│   │   ├── ColorSchemeGenerator/ # 颜色处理工具
│   │   ├── JsonToTsConverter/  # Json转Ts接口工具
│   │   ├── PrettierConfig/     # Prettier配置工具
│   │   └── WebMeta/            # 网站元信息配置工具
│   ├── router/         # 路由配置（如当前提供的 router.js）
│   ├── utils/          # 通用工具函数（如 loading 控制、格式转换）
│   └── components/     # 公共组件（如代码高亮组件、配置项表单组件）
├── dist/               # 生产构建产物（部署用）
├── package.json        # 项目依赖与脚本配置
└── README.md           # 项目说明文档（当前文档）
```

## 🎨 技术栈

- 前端框架：Vue 3（Composition API）
- 路由管理：Vue Router 4
- 包管理：pnpm
- 构建工具：Vite（快速热更新、优化构建）
- 代码高亮：Shiki（支持多语言、多主题，如工具中使用的 `vitesse-dark` 主题）

欢迎提交 Issues 或 PR 贡献功能！
Contributions via Issues or PRs are welcome!

---
