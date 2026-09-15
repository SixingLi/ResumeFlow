/* =======================================================
   ResumeFlow V1.3.7
   A4 Auto Pagination Edition
   ======================================================= */

"use strict";

const VERSION = "1.3.7";

/* =======================================================
   Storage
======================================================= */

const STORAGE_RESUME = "resumeflow-resume-v122";
const STORAGE_STATE = "resumeflow-state-v122";
const STORAGE_PHOTO = "resumeflow-photo-v122";

/* =======================================================
   Default State
======================================================= */

const DEFAULT_STATE = {
  template: "tech",
  theme: "blue",
  pageMode: "auto",
  showPhoto: true,
  font: "pingfang",
  fontSize: 13,
  zoom: 0.8
};

let state = {
  ...DEFAULT_STATE
};

let resumeText = "";
let photoData = "";

/* =======================================================
   Themes
======================================================= */

const THEMES = {
  black: {
    accent: "#222222",
    soft: "#f1f1f1"
  },
  blue: {
    accent: "#2563eb",
    soft: "#eff6ff"
  },
  cyan: {
    accent: "#0891b2",
    soft: "#ecfeff"
  },
  green: {
    accent: "#15803d",
    soft: "#f0fdf4"
  },
  gray: {
    accent: "#4b5563",
    soft: "#f3f4f6"
  },
  wine: {
    accent: "#9f1239",
    soft: "#fff1f2"
  }
};

/* =======================================================
   Demo Resume
======================================================= */

const DEMO_MD = `# 李思杏
ADAS软件工程师

成都 | C/C++ | Linux | MATLAB/Simulink | CAN/CANoe | AUTOSAR

## 个人简介

3+年车载软件与智能驾驶开发经验，主要聚焦L2级智能驾驶功能开发，具备ACC纵向控制、TSR、车辆数据采集分析、标定测试及量产支持经验。熟悉C语言、嵌入式开发、Linux、CAN通信及MATLAB/Simulink工具链。

## 工作经历

### 安智杰科技有限公司
**ADAS软件工程师 | 2022.02 - 2026.06**

- 参与L2智能驾驶项目开发，负责ACC、TSR等功能模块的软件开发、测试与问题分析。
- 前期使用MATLAB/Simulink/Carsim搭建车辆控制仿真环境，进行ACC控制算法验证。
- 使用CAN/CANoe/DBC进行车辆信号采集、分析及问题定位。
- 负责ACC控制策略开发、参数标定、功能验证及版本发布支持。
- 针对车辆纵向控制问题开展数据分析和控制参数优化。

### 轻型商用车L2智驾项目
**ACC软件负责人 | 2025.09 - 2026.06**

- 独立负责L2 ACC功能的软件开发、测试、标定及版本发布。
- 根据规划层输出的期望纵向加速度设计ACC纵向控制链路。
- 采用前馈扭矩+PID反馈方式实现车辆纵向加速度跟踪。
- 针对轻型商用车弯道限速敏感问题，引入弯道半径滑动窗口及抑制滤波策略。
- 通过CAN信号采集、MATLAB数据分析定位控制延迟、加速度波动等问题。

## 项目经历

### L2 ACC纵向控制
**2025.09 - 2026.06**

- 负责ACC纵向控制算法开发与优化。
- 根据期望加速度进行前馈扭矩计算，并通过加速度误差PID生成反馈扭矩。
- 综合得到最终扭矩请求并通过车辆控制接口下发。
- 分析ACC_TorqReq_Lim、MCU_Trq、IC_TachVehSpd、EBS_LongitudinalAccn等信号。
- 针对重载工况下负扭矩不足问题进行制动能力分析与控制策略优化。

### TSR交通标志识别
**2022 - 2026**

- 负责TSR状态机及显示逻辑开发。
- 设计OFF、STANDBY、ACTIVE、ERROR等状态。
- 根据标志优先级及最小显示保持时间实现显示策略。
- 完成功能测试、问题定位及版本验证。

## 专业技能

- **编程语言：** C、C++（持续学习）
- **系统：** Linux、RTOS、ARM
- **智能驾驶：** ACC、TSR、L2 ADAS
- **工具：** MATLAB/Simulink、CarSim、CANoe、CANalyzer
- **开发：** Git、CMake、Makefile、GCC
- **通信：** CAN、DBC
- **其他：** AUTOSAR、嵌入式软件开发、功能测试与标定

## 教育经历

### 计算机科学与技术
**本科**

`;

/* =======================================================
   Section Aliases
======================================================= */

const SECTION_ALIASES = {
  summary: [
    "个人简介",
    "个人介绍",
    "个人概述",
    "简介",
    "职业简介",
    "Summary",
    "Profile",
    "About"
  ],

  experience: [
    "工作经历",
    "工作经验",
    "工作履历",
    "职业经历",
    "Work Experience",
    "Experience"
  ],

  project: [
    "项目经历",
    "项目经验",
    "项目履历",
    "Projects",
    "Project Experience"
  ],

  education: [
    "教育经历",
    "教育背景",
    "学历",
    "Education"
  ],

  skills: [
    "专业技能",
    "技能",
    "技术栈",
    "技能特长",
    "Technical Skills",
    "Skills"
  ],

  certificate: [
    "证书",
    "资格证书",
    "Certificates",
    "Certification"
  ],

  awards: [
    "荣誉奖项",
    "奖项",
    "荣誉",
    "Awards"
  ],

  self: [
    "自我评价",
    "个人评价",
    "Self Evaluation",
    "Profile"
  ]
};

/* =======================================================
   Helpers
======================================================= */

function $(selector) {
  return document.querySelector(selector);
}

function $all(selector) {
  return Array.from(document.querySelectorAll(selector));
}

function escapeHTML(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeText(text) {
  return String(text || "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
}

function normalizeHeading(text) {
  return String(text || "")
    .replace(/^#+\s*/, "")
    .replace(/^\*\*(.*?)\*\*$/, "$1")
    .trim();
}

function isSectionHeading(text) {
  const normalized = normalizeHeading(text);

  for (const list of Object.values(SECTION_ALIASES)) {
    if (
      list.some(
        item => item.toLowerCase() === normalized.toLowerCase()
      )
    ) {
      return true;
    }
  }

  return false;
}

function getSectionType(text) {
  const normalized = normalizeHeading(text).toLowerCase();

  for (const [type, aliases] of Object.entries(SECTION_ALIASES)) {
    if (
      aliases.some(
        item => item.toLowerCase() === normalized
      )
    ) {
      return type;
    }
  }

  return "other";
}

function parseInline(text) {
  let result = escapeHTML(text);

  result = result.replace(
    /\*\*(.+?)\*\*/g,
    "<strong>$1</strong>"
  );

  result = result.replace(
    /`(.+?)`/g,
    "<code>$1</code>"
  );

  result = result.replace(
    /\[(.+?)\]\((https?:\/\/.+?)\)/g,
    '<a href="$2" target="_blank">$1</a>'
  );

  return result;
}

/* =======================================================
   Markdown Parser
======================================================= */

function parseResume(text) {
  const lines = normalizeText(text).split("\n");

  const result = {
    name: "",
    title: "",
    contact: [],
    sections: []
  };

  let i = 0;

  while (
    i < lines.length &&
    !lines[i].trim()
  ) {
    i++;
  }

  /* -----------------------------------------------
     Header
  ----------------------------------------------- */

  const headerLines = [];

  while (
    i < lines.length &&
    headerLines.length < 8
  ) {
    const line = lines[i].trim();

    if (!line) {
      i++;
      continue;
    }

    if (
      /^#{1,6}\s+/.test(line) &&
      headerLines.length > 0
    ) {
      break;
    }

    if (
      isSectionHeading(line)
    ) {
      break;
    }

    headerLines.push(line);
    i++;
  }

  const cleanHeader = headerLines.map(line =>
    normalizeHeading(line)
  );

  if (cleanHeader.length > 0) {
    result.name = cleanHeader[0];
  }

  if (cleanHeader.length > 1) {
    result.title = cleanHeader[1];
  }

  if (cleanHeader.length > 2) {
    result.contact = cleanHeader.slice(2);
  }

  /* -----------------------------------------------
     Sections
  ----------------------------------------------- */

  let currentSection = null;

  for (; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();

    if (!line) {
      if (
        currentSection &&
        currentSection.content.length > 0
      ) {
        currentSection.content.push("");
      }

      continue;
    }

    const headingMatch =
      line.match(/^#{1,6}\s+(.+)$/);

    const boldHeadingMatch =
      line.match(/^\*\*(.+?)\*\*$/);

    let headingText = null;

    if (headingMatch) {
      headingText = headingMatch[1];
    } else if (
      boldHeadingMatch &&
      isSectionHeading(boldHeadingMatch[1])
    ) {
      headingText = boldHeadingMatch[1];
    }

    if (
      headingText &&
      isSectionHeading(headingText)
    ) {
      if (currentSection) {
        result.sections.push(currentSection);
      }

      currentSection = {
        title: normalizeHeading(headingText),
        type: getSectionType(headingText),
        content: []
      };

      continue;
    }

    if (!currentSection) {
      currentSection = {
        title: "其他",
        type: "other",
        content: []
      };
    }

    currentSection.content.push(raw);
  }

  if (currentSection) {
    result.sections.push(currentSection);
  }

  return result;
}

/* =======================================================
   Markdown → HTML
======================================================= */

function renderMarkdownLines(lines) {
  const output = [];

  let listItems = [];

  function flushList() {
    if (listItems.length === 0) {
      return;
    }

    output.push(
      `<ul>${listItems.join("")}</ul>`
    );

    listItems = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      continue;
    }

    const bulletMatch =
      line.match(/^[-*+]\s+(.+)$/);

    if (bulletMatch) {
      listItems.push(
        `<li>${parseInline(bulletMatch[1])}</li>`
      );
      continue;
    }

    flushList();

    const h3 =
      line.match(/^###\s+(.+)$/);

    if (h3) {
      output.push(
        `<h4>${parseInline(h3[1])}</h4>`
      );
      continue;
    }

    const h4 =
      line.match(/^####\s+(.+)$/);

    if (h4) {
      output.push(
        `<h5>${parseInline(h4[1])}</h5>`
      );
      continue;
    }

    output.push(
      `<p>${parseInline(line)}</p>`
    );
  }

  flushList();

  return output.join("");
}

/* =======================================================
   Work / Project Parser
======================================================= */

function parseWorkItems(lines) {
  const items = [];

  let current = null;

  for (const raw of lines) {
    const line = raw.trim();

    if (!line) {
      continue;
    }

    const heading =
      line.match(/^###\s+(.+)$/);

    if (heading) {
      if (current) {
        items.push(current);
      }

      current = {
        title: heading[1],
        body: []
      };

      continue;
    }

    const boldHeading =
      line.match(/^\*\*(.+?)\*\*(?:\s*\|\s*(.*))?$/);

    if (
      boldHeading &&
      !line.startsWith("**职责")
    ) {
      if (current) {
        items.push(current);
      }

      current = {
        title: boldHeading[1],
        meta: boldHeading[2] || "",
        body: []
      };

      continue;
    }

    if (!current) {
      current = {
        title: "",
        body: []
      };
    }

    current.body.push(raw);
  }

  if (current) {
    items.push(current);
  }

  return items;
}

/* =======================================================
   Render Section
======================================================= */

function renderSection(section) {
  const title = escapeHTML(section.title);

  let html = `
    <section class="section section-${section.type}">
      <div class="section-title">
        <span>${title}</span>
      </div>
  `;

  if (
    section.type === "experience" ||
    section.type === "project"
  ) {
    const items =
      parseWorkItems(section.content);

    if (items.length > 0) {
      for (const item of items) {
        html += `
          <article class="resume-item">
            ${
              item.title
                ? `<div class="item-head">
                     <div class="item-title">
                       ${parseInline(item.title)}
                     </div>
                     ${
                       item.meta
                         ? `<div class="item-meta">
                              ${parseInline(item.meta)}
                            </div>`
                         : ""
                     }
                   </div>`
                : ""
            }
            <div class="item-body">
              ${renderMarkdownLines(item.body)}
            </div>
          </article>
        `;
      }
    } else {
      html += `
        <div class="section-content">
          ${renderMarkdownLines(section.content)}
        </div>
      `;
    }
  } else {
    html += `
      <div class="section-content">
        ${renderMarkdownLines(section.content)}
      </div>
    `;
  }

  html += `
    </section>
  `;

  return html;
}

/* =======================================================
   Render Header
======================================================= */

function renderHeader(data) {
  const contactHTML =
    data.contact && data.contact.length
      ? `
        <div class="resume-contact">
          ${data.contact
            .map(item =>
              `<span>${parseInline(item)}</span>`
            )
            .join("")}
        </div>
      `
      : "";

  const photoHTML =
    state.showPhoto && photoData
      ? `
        <div class="resume-photo-wrap">
          <img
            class="resume-photo"
            src="${photoData}"
            alt="photo"
          >
        </div>
      `
      : "";

  return `
    <header class="resume-header">
      <div class="resume-header-main">
        <h1 class="resume-name">
          ${escapeHTML(data.name || "姓名")}
        </h1>

        ${
          data.title
            ? `<div class="resume-title">
                 ${parseInline(data.title)}
               </div>`
            : ""
        }

        ${contactHTML}
      </div>

      ${photoHTML}
    </header>
  `;
}

/* =======================================================
   Main Render
======================================================= */

function renderResume() {
  const data = parseResume(resumeText);

  const paper = $("#paper");

  if (!paper) {
    return;
  }

  paper.innerHTML = "";

  const page = document.createElement("div");

  page.className =
    `paper resume-page ${state.template} page-auto`;

  const theme =
    THEMES[state.theme] || THEMES.blue;

  page.style.setProperty(
    "--accent",
    theme.accent
  );

  page.style.setProperty(
    "--accent-soft",
    theme.soft
  );

  page.style.setProperty(
    "--resume-accent",
    theme.accent
  );

  page.style.setProperty(
    "--resume-accent-light",
    theme.soft
  );

  page.style.setProperty(
    "--resume-font-size",
    `${state.fontSize}px`
  );

  page.innerHTML =
    renderHeader(data) +
    data.sections
      .map(section =>
        renderSection(section)
      )
      .join("");

  paper.appendChild(page);
}

/* =======================================================
   Pagination
======================================================= */

function installPaginationStyle() {
  if ($("#resumeflow-pagination-style")) {
    return;
  }

  const style =
    document.createElement("style");

  style.id =
    "resumeflow-pagination-style";

  style.textContent = `
    #paper.preview-stack {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
    }

    #paper.preview-stack > .resume-page {
      width: var(--paper-w);
      height: var(--paper-h);
      min-width: var(--paper-w);
      max-width: var(--paper-w);
      min-height: var(--paper-h);
      max-height: var(--paper-h);

      flex: 0 0 var(--paper-h);

      box-sizing: border-box;
      position: relative;

      overflow: hidden;
      background: #fff;
    }

    #paper.preview-stack
      .resume-page
      .section {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    #paper.preview-stack
      .resume-page
      .item-head {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    #paper.preview-stack
      .resume-page
      li {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    #paper.preview-stack
      .resume-page
      .section-title {
      break-after: avoid;
      page-break-after: avoid;
    }
  `;

  document.head.appendChild(style);
}

/* =======================================================
   Page Factory
======================================================= */

function createPage() {
  const page =
    document.createElement("div");

  page.className =
    `paper resume-page ${state.template} page-auto`;

  const theme =
    THEMES[state.theme] || THEMES.blue;

  page.style.setProperty(
    "--accent",
    theme.accent
  );

  page.style.setProperty(
    "--accent-soft",
    theme.soft
  );

  page.style.setProperty(
    "--resume-accent",
    theme.accent
  );

  page.style.setProperty(
    "--resume-accent-light",
    theme.soft
  );

  page.style.setProperty(
    "--resume-font-size",
    `${state.fontSize}px`
  );

  page.style.boxSizing =
    "border-box";

  page.style.width =
    "var(--paper-w)";

  page.style.height =
    "var(--paper-h)";

  page.style.minWidth =
    "var(--paper-w)";

  page.style.maxWidth =
    "var(--paper-w)";

  page.style.minHeight =
    "var(--paper-h)";

  page.style.maxHeight =
    "var(--paper-h)";

  page.style.flex =
    "0 0 var(--paper-h)";

  page.style.margin = "0";

  page.style.position =
    "relative";

  page.style.overflow =
    "hidden";

  page.style.background =
    "#fff";

  return page;
}

/* =======================================================
   Overflow Check
======================================================= */

function isOverflow(page) {
  return (
    page.scrollHeight >
    page.clientHeight + 1
  );
}

/* =======================================================
   Collect Top Level Nodes
======================================================= */

function collectResumeNodes(sourcePage) {
  return Array.from(
    sourcePage.children
  );
}

/* =======================================================
   Pagination Group
======================================================= */

function paginateGroupedSection(
  sectionNode,
  currentPage,
  pages
) {
  const children =
    Array.from(sectionNode.children);

  if (children.length === 0) {
    return currentPage;
  }

  const titleNode =
    children.find(node =>
      node.classList.contains(
        "section-title"
      )
    );

  if (titleNode) {
    currentPage.appendChild(
      titleNode.cloneNode(true)
    );
  }

  const items =
    children.filter(node =>
      node.classList.contains(
        "resume-item"
      )
    );

  if (items.length === 0) {
    return currentPage;
  }

  for (const item of items) {
    const clone =
      item.cloneNode(true);

    currentPage.appendChild(clone);

    if (isOverflow(currentPage)) {
      currentPage.removeChild(clone);

      const newPage =
        createPage();

      pages.push(newPage);

      currentPage =
        newPage;

      if (titleNode) {
        currentPage.appendChild(
          titleNode.cloneNode(true)
        );
      }

      currentPage.appendChild(clone);

      /*
       * 如果一个完整项目本身就超过一页，
       * 不继续无限创建页面。
       */
      if (isOverflow(currentPage)) {
        continue;
      }
    }
  }

  return currentPage;
}

/* =======================================================
   Auto Pagination
======================================================= */

function paginatePreview() {
  const paper = $("#paper");

  if (!paper) {
    return;
  }

  if (state.pageMode !== "auto") {
    return;
  }

  const originalPage =
    paper.querySelector(
      ".resume-page"
    );

  if (!originalPage) {
    return;
  }

  const nodes =
    collectResumeNodes(
      originalPage
    );

  paper.innerHTML = "";

  paper.classList.add(
    "preview-stack"
  );

  let currentPage =
    createPage();

  paper.appendChild(
    currentPage
  );

  const pages = [
    currentPage
  ];

  for (const node of nodes) {
    /*
     * 工作经历 / 项目经历：
     * 以完整 item 为分页单位，
     * 避免公司标题和项目内容被拆开。
     */
    if (
      node.classList.contains(
        "section-experience"
      ) ||
      node.classList.contains(
        "section-project"
      )
    ) {
      currentPage =
        paginateGroupedSection(
          node,
          currentPage,
          pages
        );

      continue;
    }

    /*
     * 普通 section：
     * 整块放入当前页。
     * 超出则整体移动到下一页。
     */
    const clone =
      node.cloneNode(true);

    currentPage.appendChild(
      clone
    );

    if (isOverflow(currentPage)) {
      currentPage.removeChild(
        clone
      );

      currentPage =
        createPage();

      pages.push(
        currentPage
      );

      paper.appendChild(
        currentPage
      );

      currentPage.appendChild(
        clone
      );
    }
  }

  /*
   * 重新应用主题变量
   */
  pages.forEach(page => {
    const theme =
      THEMES[state.theme] ||
      THEMES.blue;

    page.style.setProperty(
      "--accent",
      theme.accent
    );

    page.style.setProperty(
      "--accent-soft",
      theme.soft
    );

    page.style.setProperty(
      "--resume-accent",
      theme.accent
    );

    page.style.setProperty(
      "--resume-accent-light",
      theme.soft
    );

    page.style.setProperty(
      "--resume-font-size",
      `${state.fontSize}px`
    );
  });
}

/* =======================================================
   Font
======================================================= */

function applyFont() {
  const paper = $("#paper");

  if (!paper) {
    return;
  }

  let fontFamily =
    '"PingFang SC", "Microsoft YaHei", sans-serif';

  if (state.font === "yahei") {
    fontFamily =
      '"Microsoft YaHei", sans-serif';
  }

  if (state.font === "song") {
    fontFamily =
      '"Songti SC", "SimSun", serif';
  }

  if (state.font === "mono") {
    fontFamily =
      '"SFMono-Regular", Consolas, monospace';
  }

  paper.style.setProperty(
    "--resume-font-family",
    fontFamily
  );

  paper.style.setProperty(
    "--resume-font-size",
    `${state.fontSize}px`
  );
}

/* =======================================================
   Scale Preview
======================================================= */

function updatePreviewScale() {
  const paper =
    $("#paper");

  const viewport =
    $("#previewViewport");

  if (!paper || !viewport) {
    return;
  }

  const zoom =
    Number(state.zoom) || 0.8;

  paper.style.transform =
    `scale(${zoom})`;

  paper.style.transformOrigin =
    "top center";

  const pageCount =
    paper.querySelectorAll(
      ".resume-page"
    ).length || 1;

  const paperHeight =
    1122 * zoom;

  const gap = 24;

  viewport.style.minHeight =
    `${pageCount * paperHeight +
      Math.max(0, pageCount - 1) *
        gap}px`;
}

/* =======================================================
   Main Render Pipeline
======================================================= */

function render() {
  renderResume();

  requestAnimationFrame(() => {
    if (
      state.pageMode === "auto"
    ) {
      paginatePreview();
    }

    applyFont();

    updatePreviewScale();
  });
}

/* =======================================================
   State
======================================================= */

function normalizeState() {
  state = {
    ...DEFAULT_STATE,
    ...(state || {})
  };

  if (
    !THEMES[state.theme]
  ) {
    state.theme =
      DEFAULT_STATE.theme;
  }

  if (
    !Number.isFinite(
      Number(state.fontSize)
    )
  ) {
    state.fontSize =
      DEFAULT_STATE.fontSize;
  }

  state.fontSize =
    Math.max(
      10,
      Math.min(
        18,
        Number(state.fontSize)
      )
    );

  if (
    ![
      "auto",
      "manual"
    ].includes(
      state.pageMode
    )
  ) {
    state.pageMode =
      "auto";
  }
}

/* =======================================================
   Save / Load
======================================================= */

function save() {
  try {
    localStorage.setItem(
      STORAGE_RESUME,
      resumeText
    );

    localStorage.setItem(
      STORAGE_STATE,
      JSON.stringify(state)
    );

    if (photoData) {
      localStorage.setItem(
        STORAGE_PHOTO,
        photoData
      );
    } else {
      localStorage.removeItem(
        STORAGE_PHOTO
      );
    }
  } catch (error) {
    console.warn(
      "ResumeFlow save failed:",
      error
    );
  }
}

function load() {
  try {
    const savedResume =
      localStorage.getItem(
        STORAGE_RESUME
      );

    if (savedResume) {
      resumeText =
        savedResume;
    } else {
      resumeText =
        DEMO_MD;
    }

    const savedState =
      localStorage.getItem(
        STORAGE_STATE
      );

    if (savedState) {
      state = {
        ...DEFAULT_STATE,
        ...JSON.parse(savedState)
      };
    }

    photoData =
      localStorage.getItem(
        STORAGE_PHOTO
      ) || "";
  } catch (error) {
    console.warn(
      "ResumeFlow load failed:",
      error
    );

    resumeText =
      DEMO_MD;

    state = {
      ...DEFAULT_STATE
    };

    photoData = "";
  }
}
/* =======================================================
   Control Sync
======================================================= */

function syncControls() {
  const template =
    $("#templateSelect");

  const theme =
    $("#themeSelect");

  const pageMode =
    $("#pageModeSelect");

  const font =
    $("#fontSelect");

  const fontSize =
    $("#fontSize");

  const zoom =
    $("#zoomRange");

  const showPhoto =
    $("#showPhoto");

  if (template) {
    template.value =
      state.template;
  }

  if (theme) {
    theme.value =
      state.theme;
  }

  if (pageMode) {
    pageMode.value =
      state.pageMode;
  }

  if (font) {
    font.value =
      state.font;
  }

  if (fontSize) {
    fontSize.value =
      state.fontSize;
  }

  if (zoom) {
    zoom.value =
      state.zoom;
  }

  if (showPhoto) {
    showPhoto.checked =
      !!state.showPhoto;
  }

  const resumeInput =
    $("#resumeInput");

  if (resumeInput) {
    resumeInput.value =
      resumeText;
  }

  updateFontSizeLabel();
  updateZoomLabel();
}

/* =======================================================
   Labels
======================================================= */

function updateFontSizeLabel() {
  const label =
    $("#fontSizeValue");

  if (label) {
    label.textContent =
      `${state.fontSize}px`;
  }
}

function updateZoomLabel() {
  const label =
    $("#zoomValue");

  if (label) {
    label.textContent =
      `${Math.round(
        Number(state.zoom) * 100
      )}%`;
  }
}

/* =======================================================
   Theme
======================================================= */

function applyTheme() {
  const theme =
    THEMES[state.theme] ||
    THEMES.blue;

  document.documentElement.style.setProperty(
    "--accent",
    theme.accent
  );

  document.documentElement.style.setProperty(
    "--accent-soft",
    theme.soft
  );

  document.documentElement.style.setProperty(
    "--resume-accent",
    theme.accent
  );

  document.documentElement.style.setProperty(
    "--resume-accent-light",
    theme.soft
  );
}

/* =======================================================
   Template
======================================================= */

function setTemplate(value) {
  state.template =
    value || "tech";

  save();

  render();
}

/* =======================================================
   Theme Select
======================================================= */

function setTheme(value) {
  state.theme =
    value || "blue";

  applyTheme();

  save();

  render();
}

/* =======================================================
   Page Mode
======================================================= */

function setPageMode(value) {
  state.pageMode =
    value === "manual"
      ? "manual"
      : "auto";

  save();

  render();
}

/* =======================================================
   Font
======================================================= */

function setFont(value) {
  state.font =
    value || "pingfang";

  save();

  render();
}

/* =======================================================
   Font Size
======================================================= */

function setFontSize(value) {
  let size =
    Number(value);

  if (!Number.isFinite(size)) {
    size = 13;
  }

  size =
    Math.max(
      10,
      Math.min(
        18,
        size
      )
    );

  state.fontSize =
    size;

  updateFontSizeLabel();

  save();

  render();
}

/* =======================================================
   Zoom
======================================================= */

function setZoom(value) {
  let zoom =
    Number(value);

  if (!Number.isFinite(zoom)) {
    zoom = 0.8;
  }

  zoom =
    Math.max(
      0.4,
      Math.min(
        1.2,
        zoom
      )
    );

  state.zoom =
    zoom;

  updateZoomLabel();

  save();

  updatePreviewScale();
}

/* =======================================================
   Photo UI
======================================================= */

function updatePhotoUI() {
  const panel =
    $("#photoPanel");

  const img =
    $("#photoPreview");

  const empty =
    $("#photoEmpty");

  const remove =
    $("#removePhoto");

  if (panel) {
    panel.style.display =
      state.showPhoto
        ? ""
        : "none";
  }

  if (img) {
    if (photoData) {
      img.src =
        photoData;

      img.style.display =
        "block";
    } else {
      img.removeAttribute(
        "src"
      );

      img.style.display =
        "none";
    }
  }

  if (empty) {
    empty.style.display =
      photoData
        ? "none"
        : "";
  }

  if (remove) {
    remove.disabled =
      !photoData;
  }
}

/* =======================================================
   Photo Upload
======================================================= */

function handlePhotoFile(file) {
  if (!file) {
    return;
  }

  if (
    ![
      "image/jpeg",
      "image/png",
      "image/webp"
    ].includes(
      file.type
    )
  ) {
    alert(
      "仅支持 JPG、PNG、WebP 图片。"
    );

    return;
  }

  const reader =
    new FileReader();

  reader.onload = event => {
    photoData =
      event.target.result;

    state.showPhoto =
      true;

    save();

    updatePhotoUI();

    syncControls();

    render();
  };

  reader.readAsDataURL(file);
}

/* =======================================================
   Remove Photo
======================================================= */

function removePhoto() {
  photoData = "";

  localStorage.removeItem(
    STORAGE_PHOTO
  );

  save();

  updatePhotoUI();

  render();
}

/* =======================================================
   Resume Input
======================================================= */

function updateResumeText(value) {
  resumeText =
    normalizeText(value);

  save();

  render();
}

/* =======================================================
   Import Text File
======================================================= */

function importTextFile(file) {
  if (!file) {
    return;
  }

  const reader =
    new FileReader();

  reader.onload = event => {
    const content =
      String(
        event.target.result || ""
      );

    resumeText =
      normalizeText(content);

    const input =
      $("#resumeInput");

    if (input) {
      input.value =
        resumeText;
    }

    save();

    render();
  };

  reader.readAsText(
    file,
    "UTF-8"
  );
}

/* =======================================================
   JSON Import
======================================================= */

function importJSON(text) {
  try {
    const data =
      JSON.parse(text);

    /*
     * 支持：
     * { resume: "..." }
     * { markdown: "..." }
     * { content: "..." }
     */

    if (
      typeof data === "string"
    ) {
      resumeText =
        normalizeText(data);

      return true;
    }

    if (
      typeof data.resume ===
      "string"
    ) {
      resumeText =
        normalizeText(
          data.resume
        );

      return true;
    }

    if (
      typeof data.markdown ===
      "string"
    ) {
      resumeText =
        normalizeText(
          data.markdown
        );

      return true;
    }

    if (
      typeof data.content ===
      "string"
    ) {
      resumeText =
        normalizeText(
          data.content
        );

      return true;
    }

    /*
     * 如果JSON本身就是简历结构，
     * 尝试转成Markdown。
     */
    if (
      data.name ||
      data.title ||
      data.sections
    ) {
      let md = "";

      if (data.name) {
        md +=
          `# ${data.name}\n`;
      }

      if (data.title) {
        md +=
          `${data.title}\n`;
      }

      if (
        Array.isArray(
          data.contact
        )
      ) {
        md +=
          `${data.contact.join(
            " | "
          )}\n`;
      }

      if (
        Array.isArray(
          data.sections
        )
      ) {
        for (
          const section
          of data.sections
        ) {
          if (
            !section
          ) {
            continue;
          }

          if (
            section.title
          ) {
            md +=
              `\n## ${section.title}\n`;
          }

          if (
            Array.isArray(
              section.content
            )
          ) {
            md +=
              section.content.join(
                "\n"
              ) +
              "\n";
          } else if (
            typeof section.content ===
            "string"
          ) {
            md +=
              section.content +
              "\n";
          }
        }
      }

      resumeText =
        normalizeText(md);

      return true;
    }

    return false;
  } catch (error) {
    console.warn(
      "JSON parse failed:",
      error
    );

    return false;
  }
}

/* =======================================================
   Generic Import
======================================================= */

function handleImportFile(file) {
  if (!file) {
    return;
  }

  const name =
    file.name
      .toLowerCase();

  if (
    name.endsWith(".json")
  ) {
    const reader =
      new FileReader();

    reader.onload =
      event => {
        const success =
          importJSON(
            String(
              event.target.result ||
              ""
            )
          );

        if (!success) {
          alert(
            "无法识别该 JSON 简历格式。"
          );

          return;
        }

        const input =
          $("#resumeInput");

        if (input) {
          input.value =
            resumeText;
        }

        save();

        render();
      };

    reader.readAsText(
      file,
      "UTF-8"
    );

    return;
  }

  importTextFile(file);
}

/* =======================================================
   Export Resume
======================================================= */

function exportMarkdown() {
  const blob =
    new Blob(
      [resumeText],
      {
        type:
          "text/markdown;charset=utf-8"
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const a =
    document.createElement(
      "a"
    );

  a.href = url;

  a.download =
    "resume.md";

  document.body.appendChild(
    a
  );

  a.click();

  a.remove();

  URL.revokeObjectURL(
    url
  );
}

/* =======================================================
   Export JSON
======================================================= */

function exportJSON() {
  const data = {
    version:
      VERSION,

    resume:
      resumeText,

    state: {
      ...state
    },

    photo:
      photoData || ""
  };

  const blob =
    new Blob(
      [
        JSON.stringify(
          data,
          null,
          2
        )
      ],
      {
        type:
          "application/json;charset=utf-8"
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const a =
    document.createElement(
      "a"
    );

  a.href =
    url;

  a.download =
    "resume.json";

  document.body.appendChild(
    a
  );

  a.click();

  a.remove();

  URL.revokeObjectURL(
    url
  );
}

/* =======================================================
   Demo
======================================================= */

function loadDemo() {
  resumeText =
    DEMO_MD;

  const input =
    $("#resumeInput");

  if (input) {
    input.value =
      resumeText;
  }

  save();

  render();
}

/* =======================================================
   Clear Resume
======================================================= */

function clearResume() {
  const confirmed =
    confirm(
      "确定清空当前简历内容吗？"
    );

  if (!confirmed) {
    return;
  }

  resumeText = "";

  const input =
    $("#resumeInput");

  if (input) {
    input.value = "";
  }

  save();

  render();
}

/* =======================================================
   Drag / Drop
======================================================= */

function installDropZone() {
  const zone =
    $("#dropZone");

  if (!zone) {
    return;
  }

  [
    "dragenter",
    "dragover"
  ].forEach(
    eventName => {
      zone.addEventListener(
        eventName,
        event => {
          event.preventDefault();
          event.stopPropagation();

          zone.classList.add(
            "drag-over"
          );
        }
      );
    }
  );

  [
    "dragleave",
    "drop"
  ].forEach(
    eventName => {
      zone.addEventListener(
        eventName,
        event => {
          event.preventDefault();
          event.stopPropagation();

          zone.classList.remove(
            "drag-over"
          );
        }
      );
    }
  );

  zone.addEventListener(
    "drop",
    event => {
      const files =
        event.dataTransfer &&
        event.dataTransfer.files;

      if (
        files &&
        files.length
      ) {
        handleImportFile(
          files[0]
        );
      }
    }
  );
}

/* =======================================================
   Print Style
======================================================= */

function installPrintStyle() {
  const old =
    $("#resumeflow-print-style");

  if (old) {
    old.remove();
  }

  const style =
    document.createElement(
      "style"
    );

  style.id =
    "resumeflow-print-style";

  style.textContent = `
    @media print {

      @page {
        size: A4;
        margin: 0;
      }

      html,
      body {
        margin: 0 !important;
        padding: 0 !important;
        width: 210mm !important;
        background: #fff !important;
      }

      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      #paper.preview-stack {
        display: block !important;

        width: 210mm !important;
        height: auto !important;

        margin: 0 !important;
        padding: 0 !important;

        transform: none !important;

        background: #fff !important;

        overflow: visible !important;
      }

      #paper.preview-stack
      > .resume-page {

        width: 210mm !important;

        /*
         * 不再使用 297mm。
         * 留出极小的打印边界余量，
         * 避免浏览器因为物理像素换算
         * 导致额外空白页。
         */
        height: 296mm !important;

        min-width: 210mm !important;
        max-width: 210mm !important;

        min-height: 296mm !important;
        max-height: 296mm !important;

        margin: 0 !important;
        padding: inherit;

        box-sizing: border-box !important;

        position: relative !important;

        overflow: hidden !important;

        background: #fff !important;

        box-shadow: none !important;

        transform: none !important;

        /*
         * 不使用 break-after: page。
         * 后续页面使用 break-before。
         */
        break-after: auto !important;
        page-break-after: auto !important;
      }

      #paper.preview-stack
      > .resume-page:not(:first-child) {

        break-before: page !important;
        page-break-before: always !important;
      }

      #paper.preview-stack
      > .resume-page:last-child {

        break-after: auto !important;
        page-break-after: auto !important;
      }

      #paper.preview-stack
      .section {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      #paper.preview-stack
      .resume-item {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      #paper.preview-stack
      .item-head {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      #paper.preview-stack
      li {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      #paper.preview-stack
      .section-title {
        break-after: avoid !important;
        page-break-after: avoid !important;
      }

      /*
       * 隐藏编辑区域和控制区域。
       * 如果你的 index.html 使用这些 ID，
       * 打印时不会出现。
       */
      #app,
      #editor,
      #editorPanel,
      #controlPanel,
      #sidebar,
      #toolbar,
      .toolbar,
      .sidebar,
      .editor-panel,
      .controls,
      .no-print {
        /*
         * 仅在元素不是 paper 的情况下隐藏。
         */
      }

      body > *:not(#paper):not(#previewViewport) {
        /*
         * 不直接 display:none，
         * 避免影响现有布局结构。
         */
      }

      #previewViewport {
        width: 210mm !important;
        height: auto !important;

        margin: 0 !important;
        padding: 0 !important;

        overflow: visible !important;

        background: #fff !important;
      }

      /*
       * 防止浏览器把纸张阴影打印出来。
       */
      .paper {
        box-shadow: none !important;
      }
    }
  `;

  document.head.appendChild(
    style
  );
}

/* =======================================================
   PDF
======================================================= */

function printPDF() {
  /*
   * 打印前重新生成分页，
   * 确保当前字体、字号、模板、
   * 主题都已经生效。
   */

  render();

  setTimeout(() => {
    installPrintStyle();

    setTimeout(() => {
      window.print();
    }, 100);
  }, 200);
}

/* =======================================================
   Keyboard Shortcuts
======================================================= */

function installKeyboardShortcuts() {
  document.addEventListener(
    "keydown",
    event => {

      /*
       * Ctrl / Command + S
       */
      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() ===
          "s"
      ) {
        event.preventDefault();

        save();

        return;
      }

      /*
       * Ctrl / Command + P
       */
      if (
        (event.ctrlKey ||
          event.metaKey) &&
        event.key.toLowerCase() ===
          "p"
      ) {
        event.preventDefault();

        printPDF();

        return;
      }
    }
  );
}

/* =======================================================
   Event Binding
======================================================= */

function bindEvents() {

  /* -----------------------------------------------
     Resume Text
  ----------------------------------------------- */

  const resumeInput =
    $("#resumeInput");

  if (resumeInput) {
    resumeInput.addEventListener(
      "input",
      event => {
        resumeText =
          event.target.value;

        save();

        render();
      }
    );
  }

  /* -----------------------------------------------
     Template
  ----------------------------------------------- */

  const template =
    $("#templateSelect");

  if (template) {
    template.addEventListener(
      "change",
      event => {
        setTemplate(
          event.target.value
        );
      }
    );
  }

  /* -----------------------------------------------
     Theme
  ----------------------------------------------- */

  const theme =
    $("#themeSelect");

  if (theme) {
    theme.addEventListener(
      "change",
      event => {
        setTheme(
          event.target.value
        );
      }
    );
  }

  /* -----------------------------------------------
     Page Mode
  ----------------------------------------------- */

  const pageMode =
    $("#pageModeSelect");

  if (pageMode) {
    pageMode.addEventListener(
      "change",
      event => {
        setPageMode(
          event.target.value
        );
      }
    );
  }

  /* -----------------------------------------------
     Font
  ----------------------------------------------- */

  const font =
    $("#fontSelect");

  if (font) {
    font.addEventListener(
      "change",
      event => {
        setFont(
          event.target.value
        );
      }
    );
  }

  /* -----------------------------------------------
     Font Size
  ----------------------------------------------- */

  const fontSize =
    $("#fontSize");

  if (fontSize) {
    fontSize.addEventListener(
      "input",
      event => {
        setFontSize(
          event.target.value
        );
      }
    );
  }

  /* -----------------------------------------------
     Zoom
  ----------------------------------------------- */

  const zoom =
    $("#zoomRange");

  if (zoom) {
    zoom.addEventListener(
      "input",
      event => {
        setZoom(
          event.target.value
        );
      }
    );
  }

  /* -----------------------------------------------
     Photo Toggle
  ----------------------------------------------- */

  const showPhoto =
    $("#showPhoto");

  if (showPhoto) {
    showPhoto.addEventListener(
      "change",
      event => {
        state.showPhoto =
          !!event.target.checked;

        save();

        updatePhotoUI();

        render();
      }
    );
  }

  /* -----------------------------------------------
     Photo Input
  ----------------------------------------------- */

  const photoInput =
    $("#photoInput");

  if (photoInput) {
    photoInput.addEventListener(
      "change",
      event => {
        const file =
          event.target.files &&
          event.target.files[0];

        handlePhotoFile(
          file
        );

        event.target.value =
          "";
      }
    );
  }

  /* -----------------------------------------------
     Remove Photo
  ----------------------------------------------- */

  const removePhotoButton =
    $("#removePhoto");

  if (
    removePhotoButton
  ) {
    removePhotoButton.addEventListener(
      "click",
      removePhoto
    );
  }

  /* -----------------------------------------------
     Import File
  ----------------------------------------------- */

  const importInput =
    $("#importInput");

  if (importInput) {
    importInput.addEventListener(
      "change",
      event => {
        const file =
          event.target.files &&
          event.target.files[0];

        handleImportFile(
          file
        );

        event.target.value =
          "";
      }
    );
  }

  /* -----------------------------------------------
     Import Button
  ----------------------------------------------- */

  const importButton =
    $("#importButton");

  if (
    importButton &&
    importInput
  ) {
    importButton.addEventListener(
      "click",
      () => {
        importInput.click();
      }
    );
  }

  /* -----------------------------------------------
     Demo Button
  ----------------------------------------------- */

  const demoButton =
    $("#demoButton");

  if (demoButton) {
    demoButton.addEventListener(
      "click",
      loadDemo
    );
  }

  /* -----------------------------------------------
     Clear Button
  ----------------------------------------------- */

  const clearButton =
    $("#clearButton");

  if (clearButton) {
    clearButton.addEventListener(
      "click",
      clearResume
    );
  }

  /* -----------------------------------------------
     Markdown Export
  ----------------------------------------------- */

  const exportMdButton =
    $("#exportMdButton");

  if (
    exportMdButton
  ) {
    exportMdButton.addEventListener(
      "click",
      exportMarkdown
    );
  }

  /* -----------------------------------------------
     JSON Export
  ----------------------------------------------- */

  const exportJsonButton =
    $("#exportJsonButton");

  if (
    exportJsonButton
  ) {
    exportJsonButton.addEventListener(
      "click",
      exportJSON
    );
  }

  /* -----------------------------------------------
     PDF
  ----------------------------------------------- */

  const pdfButton =
    $("#pdfButton");

  if (pdfButton) {
    pdfButton.addEventListener(
      "click",
      printPDF
    );
  }
}

/* =======================================================
   Drag / Drop
======================================================= */

installDropZone();

/* =======================================================
   Init
======================================================= */

function init() {
  installPaginationStyle();

  load();

  normalizeState();

  applyTheme();

  syncControls();

  updatePhotoUI();

  installPrintStyle();

  bindEvents();

  installKeyboardShortcuts();

  render();

  /*
   * Service Worker
   */
  if (
    "serviceWorker" in
    navigator
  ) {
    window.addEventListener(
      "load",
      () => {
        navigator.serviceWorker
          .register(
            "./sw.js?v=1.3.7"
          )
          .then(
            registration => {
              console.log(
                "ResumeFlow SW registered:",
                registration.scope
              );
            }
          )
          .catch(
            error => {
              console.warn(
                "ResumeFlow SW registration failed:",
                error
              );
            }
          );
      }
    );
  }
}

/* =======================================================
   DOM Ready
======================================================= */

if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    init
  );
} else {
  init();
}