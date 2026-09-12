export const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home/index.vue"),
    meta: {
      title: "CodeForge - 在线工具集合",
    },
  },
  {
    path: "/icns",
    name: "ImageIcns",
    component: () => import("@/views/ImageIcns/index.vue"),
    meta: {
      title: "图片转图标工具",
      category: "文件处理",
      description:
        "在线图片转图标工具，使用WebAssembly技术将PNG图片转换为ICNS、ICO、PNG等多种图标格式",
      keywords:
        "PNG转ICNS, PNG转ICO, 图标转换, macOS图标, Windows图标, WebAssembly, 图片转换, 图标生成",
    },
  },
  {
    path: "/year",
    name: "ChineseNewYearCountdown",
    component: () => import("@/views/ChineseNewYearCountdown/index.vue"),
    meta: {
      title: "农历新年倒计时",
      category: "生活工具",
      description:
        "精美的农历新年倒计时工具，实时显示距离春节还有多少天、小时、分钟、秒，支持生肖年份显示和进度可视化",
      keywords:
        "农历新年, 春节倒计时, 新年倒计时, 生肖, 农历, 春节, 中国新年, 倒计时工具",
    },
  },
  {
    path: "/sheet2code",
    name: "Sheet2Code",
    component: () => import("@/views/Sheet2Code/index.vue"),
    meta: {
      title: "Excel 代码模板生成器",
      category: "开发工具",
      description:
        "上传Excel文件，自动生成HTML或Vue代码模板，支持语法高亮和一键复制",
      keywords: "Excel, 表格, 代码生成, HTML, Vue, 模板生成, 表格转代码",
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("@/views/Profile/index.vue"),
    meta: {
      title: "简历制作器",
      category: "生活工具",
      description: "在线简历制作工具，支持实时预览、拖拽排序和PDF导出",
      keywords: "简历, CV, 求职, PDF导出, 在线简历制作, 简历模板",
    },
  },
];
