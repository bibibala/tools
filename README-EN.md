---

# MyTools - Practical Online Tool Collection

[Switch to English](README-EN.md) | [切换中文](README.md)


## 📋 Tool List

| Tool Name             | Path                 | Core Functionality                                                                                                               |
| --------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Regex Visualizer      | `/regex`             | Real-time regex parsing, visualize the matching process, support regex syntax validation and replacement testing                 |
| Large File Handler    | `/file`              | Supports large file upload, content search, format conversion (e.g., TXT/CSV), and chunked processing (to avoid memory overflow) |
| Color Tool            | `/color`             | Color value conversion (HEX/RGB/RGBA/HSL), generate color schemes, contrast check (WCAG compliant)                               |
| JSON to TypeScript    | `/json-to-interface` | Automatically convert JSON structure to TypeScript interfaces, supports nested structures and arrays                             |
| Prettier Configurator | `/prettier`          | Visual configuration of Prettier code formatting rules, live preview, and one-click export of config files                       |
| Website Meta (SEO)    | `/web-meta`          | Configure website title, description, social preview (Open Graph/Twitter Card), export directly usable HTML files                |

## 🚀 Quick Start

### Environment Setup

* Node.js 22.19.0+
* pnpm 8+

### Install Dependencies

```sh
pnpm install
```

## 📁 Project Structure (Core Directories)

```
mytools/
├── src/
│   ├── views/          # Tool pages (core components corresponding to routes)
│   │   ├── RegexVisualizer/    # Regex visualizer tool
│   │   ├── FileAction/         # Large file handler tool
│   │   ├── ColorSchemeGenerator/ # Color tool
│   │   ├── JsonToTsConverter/  # JSON to TypeScript interface tool
│   │   ├── PrettierConfig/     # Prettier config tool
│   │   └── WebMeta/            # Website meta configuration tool
│   ├── router/         # Route configuration (e.g., current router.js)
│   ├── utils/          # Common utility functions (e.g., loading control, format conversion)
│   └── components/     # Shared components (e.g., code highlight component, config form component)
├── dist/               # Production build output (for deployment)
├── package.json        # Project dependencies and scripts
└── README.md           # Project documentation (this file)
```

## 🎨 Tech Stack

* Frontend Framework: Vue 3 (Composition API)
* Router: Vue Router 4
* Package Manager: pnpm
* Build Tool: Vite (fast hot-reload and optimized build)
* Code Highlighting: Shiki (supports multiple languages and themes, e.g., `vitesse-dark` used in this project)

Contributions via Issues or PRs are welcome!

---
