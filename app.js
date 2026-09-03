/* =========================================================

   ResumeFlow V1.2.1

   Professional Resume Builder

   ---------------------------------------------------------

   修复：

   1. 模板切换

   2. 主题色切换

   3. 分页模式

   4. 证件照

   5. 字体

   6. 字号

   7. 缩放

   8. MD / TXT / JSON

   9. 本地保存

   10. PDF

   11. 模板缩略图

   12. 证件照右上角布局

========================================================= */

(() => {

"use strict";

/* =========================================================

   版本

========================================================= */

const VERSION = "1.2.1";

/* =========================================================

   Storage

========================================================= */

const STORAGE = {

  resume: "resumeflow-resume-v121",

  state: "resumeflow-state-v121",

  photo: "resumeflow-photo-v121"

};

/* =========================================================

   DOM

========================================================= */

const source = document.getElementById("source");

const paper = document.getElementById("paper");

const demoBtn = document.getElementById("demoBtn");

const pdfBtn = document.getElementById("pdfBtn");

const fileInput = document.getElementById("file");

const fileBtn = document.getElementById("fileBtn");

const dropZone = document.getElementById("drop");

const photoFile = document.getElementById("photoFile");

const photoBtn = document.getElementById("photoBtn");

const removePhotoBtn =

  document.getElementById("removePhotoBtn");

const photoPreview =

  document.getElementById("photoPreview");

const renderBtn =

  document.getElementById("renderBtn");

const clearBtn =

  document.getElementById("clearBtn");

const templates =

  document.getElementById("templates");

const themes =

  document.getElementById("themes");

const pages =

  document.getElementById("pages");

const photoMode =

  document.getElementById("photoMode");

const font =

  document.getElementById("font");

const size =

  document.getElementById("size");

const sizeVal =

  document.getElementById("sizeVal");

const zoom =

  document.getElementById("zoom");

const zoomVal =

  document.getElementById("zoomVal");

/* =========================================================

   State

========================================================= */

let state = {

  template: "tech",

  theme: "blue",

  pageMode: "one",

  showPhoto: true,

  font: "pingfang",

  fontSize: 13,

  zoom: 0.8

};

/* =========================================================

   Theme Colors

========================================================= */

const THEMES = {

  black: {

    main: "#222222",

    light: "#f3f3f3"

  },

  blue: {

    main: "#17365D",

    light: "#eef4fa"

  },

  cyan: {

    main: "#1677FF",

    light: "#edf5ff"

  },

  green: {

    main: "#216E5B",

    light: "#edf7f3"

  },

  gray: {

    main: "#555B66",

    light: "#f2f3f5"

  },

  wine: {

    main: "#7A3030",

    light: "#faf0f0"

  }

};

/* =========================================================

   Section aliases

========================================================= */

const SECTION_ALIASES = {

  summary: [

    "个人优势",

    "个人简介",

    "个人概述",

    "职业简介",

    "简介",

    "summary",

    "profile"

  ],

  skills: [

    "核心技能",

    "专业技能",

    "技能",

    "技术栈",

    "skills",

    "technical skills"

  ],

  experience: [

    "工作经历",

    "工作经验",

    "职业经历",

    "工作履历",

    "experience",

    "work experience"

  ],

  projects: [

    "项目经历",

    "项目经验",

    "项目",

    "projects",

    "project experience"

  ],

  education: [

    "教育背景",

    "教育经历",

    "学历",

    "education"

  ],

  certificates: [

    "证书",

    "资格证书",

    "certificates"

  ],

  awards: [

    "获奖经历",

    "奖项",

    "荣誉",

    "awards"

  ]

};

/* =========================================================

   Demo Resume

========================================================= */

const DEMO_MD = `# 李思杏

ADAS软件工程师

成都 | C / C++ / Linux / MATLAB | 4年智能驾驶软件开发经验

## 个人优势

- 4年汽车电子及ADAS软件开发经验，覆盖L2 ACC及TSR功能。

- 熟悉需求分析、软件设计、编码、联调、测试、标定和问题闭环。

- 熟悉C、AUTOSAR Classic、SWC/RTE、CAN、CANoe/CANape及DBC。

- 具备车载ECU应用层软件开发经验。

- 了解RTOS/OS调度、MCU及常用外设基础。

## 核心技能

- 语言：C（熟悉）｜C++基础

- 汽车软件：AUTOSAR Classic｜SWC/RTE｜嵌入式软件｜ADAS

- 智能驾驶：ACC｜TSR｜L2 ADAS｜纵向控制

- 通信调试：CAN｜DBC｜CANoe｜CANalyzer｜CANape

- 数据分析：MATLAB｜MATLAB Script

- 开发环境：Linux｜GCC｜Git｜CMake

## 工作经历

### 安智杰科技有限公司

**ADAS软件工程师｜2022.02 – 2026.06**

- 负责L2级ADAS功能的软件开发与维护，主要负责ACC及TSR模块。

- 负责ACC纵向控制算法开发，包括期望加速度、前馈扭矩、PID反馈及扭矩请求计算。

- 基于CAN信号进行问题复现与数据分析，定位控制延迟、加速度波动及制动能力等问题。

- 使用MATLAB编写数据分析脚本，对车辆速度、实际加速度、扭矩请求及系统状态进行分析。

- 负责算法参数标定、测试验证及版本发布支持。

- 参与不同车型ADAS软件适配及量产项目开发。

## 项目经历

### L2 ACC纵向控制系统

**2025.09 – 2026.06**

- 负责轻型商用车L2 ACC软件模块开发及维护。

- 建立“期望加速度 → 前馈扭矩 → PID反馈 → 总扭矩请求”的纵向控制链路。

- 针对加速度响应延迟及控制振荡问题进行CAN数据采集、MATLAB分析和参数优化。

- 分析车辆负载变化对负扭矩及制动减速度能力的影响。

- 完成ACC加减速、跟车、停车及制动能力相关测试验证。

### TSR交通标志识别

**2024 – 2025**

- 负责TSR状态机及显示逻辑开发。

- 根据系统状态、识别结果及优先级实现交通标志显示策略。

- 完成CAN信号分析、异常场景验证及版本发布支持。

## 教育背景

### 计算机科学与技术

**本科｜2018 – 2022**

- 计算机科学与技术专业

- 主要学习C/C++、数据结构、操作系统、计算机网络等课程

`;

/* =========================================================

   Utility

========================================================= */

function cleanText(text) {

  return String(text || "")

    .replace(/\r/g, "")

    .replace(/\u00a0/g, " ")

    .trim();

}

function stripMarkdown(text) {

  return String(text || "")

    .replace(/^#{1,6}\s*/, "")

    .replace(/\*\*(.*?)\*\*/g, "$1")

    .replace(/__(.*?)__/g, "$1")

    .replace(/`(.*?)`/g, "$1")

    .replace(/\[(.*?)\]\(.*?\)/g, "$1")

    .trim();

}

function escapeHTML(text) {

  return String(text || "")

    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#039;");

}

function normalizeHeading(text) {

  return stripMarkdown(text)

    .replace(/[：:]/g, "")

    .trim()

    .toLowerCase();

}

function findSectionType(title) {

  const normalized =

    normalizeHeading(title);

  for (

    const [type, aliases]

    of Object.entries(SECTION_ALIASES)

  ) {

    if (

      aliases.some(

        alias =>

          normalizeHeading(alias) === normalized

      )

    ) {

      return type;

    }

  }

  return null;

}

/* =========================================================

   JSON Parser

========================================================= */

function tryParseJSON(text) {

  try {

    const value =

      JSON.parse(text);

    if (

      value &&

      typeof value === "object"

    ) {

      return value;

    }

  } catch (error) {

    return null;

  }

  return null;

}

/* =========================================================

   JSON Normalizer

========================================================= */

function normalizeJSON(data) {

  const result = {

    name:

      data.name ||

      data.姓名 ||

      "",

    title:

      data.title ||

      data.jobTitle ||

      data.position ||

      data.职位 ||

      "",

    contact:

      data.contact ||

      data.contacts ||

      data.联系方式 ||

      "",

    sections: []

  };

  const keys = [

    "summary",

    "skills",

    "experience",

    "projects",

    "education",

    "certificates",

    "awards"

  ];

  keys.forEach(key => {

    if (!data[key]) return;

    const section = {

      type: key,

      title:

        SECTION_ALIASES[key][0],

      items: []

    };

    const value =

      data[key];

    if (Array.isArray(value)) {

      value.forEach(item => {

        if (

          typeof item === "string"

        ) {

          section.items.push({

            type: "text",

            text: item

          });

          return;

        }

        if (

          item &&

          typeof item === "object"

        ) {

          const heading =

            item.title ||

            item.name ||

            item.company ||

            item.school ||

            "";

          if (heading) {

            section.items.push({

              type: "subheading",

              text: heading

            });

          }

          if (item.description) {

            section.items.push({

              type: "text",

              text: item.description

            });

          }

          if (

            Array.isArray(item.bullets)

          ) {

            item.bullets.forEach(

              bullet => {

                section.items.push({

                  type: "bullet",

                  text: bullet

                });

              }

            );

          }

        }

      });

    }

    else if (

      typeof value === "string"

    ) {

      section.items.push({

        type: "text",

        text: value

      });

    }

    result.sections.push(section);

  });

  return result;

}

/* =========================================================

   Markdown Parser

========================================================= */

function parseMarkdown(text) {

  const lines =

    cleanText(text)

      .split("\n");

  const result = {

    name: "",

    title: "",

    contact: "",

    sections: []

  };

  let current = null;

  for (const raw of lines) {

    const line =

      raw.trim();

    if (!line) continue;

    const heading =

      line.match(

        /^(#{1,6})\s+(.+)$/

      );

    if (heading) {

      const level =

        heading[1].length;

      const title =

        stripMarkdown(

          heading[2]

        );

      if (

        level === 1 &&

        !result.name

      ) {

        result.name =

          title;

        continue;

      }

      const sectionType =

        findSectionType(title);

      if (sectionType) {

        current = {

          type: sectionType,

          title: title,

          items: []

        };

        result.sections.push(

          current

        );

        continue;

      }

      if (

        current &&

        level >= 3

      ) {

        current.items.push({

          type: "subheading",

          text: title

        });

        continue;

      }

    }

    const plain =

      stripMarkdown(line);

    if (

      result.name &&

      !result.title &&

      !current

    ) {

      result.title =

        plain;

      continue;

    }

    if (

      result.title &&

      !result.contact &&

      !current

    ) {

      result.contact =

        plain;

      continue;

    }

    if (!current) {

      continue;

    }

    if (

      /^[-*+]\s+/.test(line)

    ) {

      current.items.push({

        type: "bullet",

        text:

          stripMarkdown(

            line.replace(

              /^[-*+]\s+/,

              ""

            )

          )

      });

    }

    else {

      current.items.push({

        type: "text",

        text: plain

      });

    }

  }

  return result;

}

/* =========================================================

   Universal Parser

========================================================= */

function parseResume(text) {

  text =

    cleanText(text);

  if (!text) {

    return {

      name: "姓名",

      title: "求职职位",

      contact: "",

      sections: []

    };

  }

  const json =

    tryParseJSON(text);

  if (json) {

    return normalizeJSON(json);

  }

  return parseMarkdown(text);

}

/* =========================================================

   Resume Header

========================================================= */

function renderHeader(data, photo) {

  return `

    <header class="paper-header">

      <div class="identity">

        <div class="name">

          ${escapeHTML(

            data.name || "姓名"

          )}

        </div>

        ${

          data.title

            ? `

              <div class="title">

                ${escapeHTML(

                  data.title

                )}

              </div>

            `

            : ""

        }

        ${

          data.contact

            ? `

              <div class="contact">

                ${escapeHTML(

                  data.contact

                )}

              </div>

            `

            : ""

        }

      </div>

      ${

        state.showPhoto && photo

          ? `

            <div class="resume-photo">

              <img

                src="${photo}"

                alt="证件照"

              >

            </div>

          `

          : ""

      }

    </header>

  `;

}

/* =========================================================

   Section Render

========================================================= */

function renderSection(section) {

  if (

    !section.items ||

    !section.items.length

  ) {

    return "";

  }

  let html = "";

  let listHTML = "";

  let hasList = false;

  section.items.forEach(item => {

    const text =

      escapeHTML(item.text);

    if (!text) return;

    if (

      item.type === "subheading"

    ) {

      html += `

        <div class="item-head">

          ${text}

        </div>

      `;

      return;

    }

    if (

      item.type === "bullet"

    ) {

      hasList = true;

      listHTML += `

        <li>

          ${text}

        </li>

      `;

      return;

    }

    html += `

      <p>

        ${text}

      </p>

    `;

  });

  if (hasList) {

    html += `

      <ul>

        ${listHTML}

      </ul>

    `;

  }

  return `

    <section

      class="section section-${section.type}"

    >

      <div class="section-title">

        ${escapeHTML(section.title)}

      </div>

      <div class="section-body">

        ${html}

      </div>

    </section>

  `;

}

/* =========================================================

   Resume Render

========================================================= */

function renderResume() {

  if (!paper) return;

  const data =

    parseResume(

      source ? source.value : ""

    );

  const photo =

    localStorage.getItem(

      STORAGE_PHOTO

    );

  const sections =

    data.sections

      .map(renderSection)

      .join("");

  paper.className = `paper ${state.template} page-${state.pageMode}`;

  paper.style.setProperty(

    "--resume-accent",

    THEMES[state.theme].main

  );

  paper.style.setProperty(

    "--resume-accent-light",

    THEMES[state.theme].light

  );

  paper.style.setProperty(

    "--resume-font-size",

    `${state.fontSize}px`

  );

  paper.innerHTML = `

    ${renderHeader(data, photo)}

    <main class="resume-content">

      ${sections}

    </main>

  `;

  applyFont();

  applyZoom();

  updatePhotoUI();

}

/* =========================================================

   Font

========================================================= */

function applyFont() {

  if (!paper) return;

  const fonts = {

    pingfang:

      '"PingFang SC","Microsoft YaHei",sans-serif',

    yahei:

      '"Microsoft YaHei","PingFang SC",sans-serif',

    system:

      '-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif'

  };

  paper.style.fontFamily =

    fonts[state.font] ||

    fonts.system;

}

/* =========================================================

   Zoom

========================================================= */

function applyZoom() {

  if (!paper) return;

  paper.style.transform =

    `scale(${state.zoom})`;

  paper.style.transformOrigin =

    "top center";

  if (zoomVal) {

    zoomVal.textContent =

      `${Math.round(

        state.zoom * 100

      )}%`;

  }

}

/* =========================================================

   Save

========================================================= */

function saveState() {

  try {

    localStorage.setItem(

      STORAGE_STATE,

      JSON.stringify(state)

    );

    localStorage.setItem(

      STORAGE_RESUME,

      source.value

    );

  } catch (error) {

    console.warn(

      "ResumeFlow 保存失败:",

      error

    );

  }

}

/* =========================================================

   Load

========================================================= */

function loadState() {

  try {

    const saved =

      localStorage.getItem(

        STORAGE_STATE

      );

    if (saved) {

      const parsed =

        JSON.parse(saved);

      if (

        parsed &&

        typeof parsed === "object"

      ) {

        state = {

          ...state,

          ...parsed

        };

      }

    }

  } catch (error) {

    console.warn(

      "ResumeFlow 状态恢复失败:",

      error

    );

  }

  const resume =

    localStorage.getItem(

      STORAGE_RESUME

    );

  if (resume) {

    source.value =

      resume;

  }

  else {

    source.value =

      DEMO_MD;

  }

}

/* =========================================================

   Sync Controls

========================================================= */

function syncControls() {

  if (pages) {

    pages.value =

      state.pageMode;

  }

  if (photoMode) {

    photoMode.value =

      state.showPhoto

        ? "show"

        : "hide";

  }

  if (font) {

    font.value =

      state.font;

  }

  if (size) {

    size.value =

      state.fontSize;

  }

  if (sizeVal) {

    sizeVal.textContent =

      state.fontSize;

  }

  if (zoom) {

    zoom.value =

      state.zoom;

  }

  if (zoomVal) {

    zoomVal.textContent =

      `${Math.round(

        state.zoom * 100

      )}%`;

  }

  updateTemplateButtons();

  updateThemeButtons();

}

/* =========================================================

   Template Buttons

========================================================= */

function updateTemplateButtons() {

  if (!templates) return;

  templates

    .querySelectorAll(

      "[data-t]"

    )

    .forEach(button => {

      button.classList.toggle(

        "active",

        button.dataset.t ===

          state.template

      );

    });

}

/* =========================================================

   Theme Buttons

========================================================= */

function updateThemeButtons() {

  if (!themes) return;

  themes

    .querySelectorAll(

      "[data-theme]"

    )

    .forEach(button => {

      button.classList.toggle(

        "active",

        button.dataset.theme ===

          state.theme

      );

      const color =

        THEMES[

          button.dataset.theme

        ]?.main;

      if (color) {

        button.style.setProperty(

          "--theme-color",

          color

        );

      }

    });

}

/* =========================================================

   Template Preview Thumbnails

========================================================= */

function createTemplateThumbnails() {

  if (!templates) return;

  const descriptions = {

    tech: "技术经典",

    blue: "工程师蓝",

    minimal: "极简黑白",

    terminal: "代码终端",

    grayblue: "科技灰蓝",

    stripe: "左侧色带",

    business: "商务技术",

    photo: "证件照技术"

  };

  templates

    .querySelectorAll(

      "[data-t]"

    )

    .forEach(button => {

      const type =

        button.dataset.t;

      if (

        button.querySelector(

          ".template-thumb"

        )

      ) {

        return;

      }

      const text =

        button.textContent.trim();

      button.innerHTML = `

        <span class="template-thumb template-thumb-${type}">

          <span class="mini-name"></span>

          <span class="mini-line"></span>

          <span class="mini-line short"></span>

          <span class="mini-section"></span>

          <span class="mini-line"></span>

          <span class="mini-line"></span>

          <span class="mini-line short"></span>

        </span>

        <span class="template-label">

          ${descriptions[type] || text}

        </span>

      `;

    });

}

/* =========================================================

   Photo UI

========================================================= */

function updatePhotoUI() {

  const photo =

    localStorage.getItem(

      STORAGE_PHOTO

    );

  if (photoPreview) {

    if (photo) {

      photoPreview.innerHTML = `

        <img

          src="${photo}"

          alt="证件照"

        >

      `;

    }

    else {

      photoPreview.innerHTML =

        "<span>证件照</span>";

    }

  }

  if (removePhotoBtn) {

    removePhotoBtn.disabled =

      !photo;

  }

}

/* =========================================================

   Import File

========================================================= */

async function importFile(file) {

  if (!file) return;

  const filename =

    file.name.toLowerCase();

  const valid =

    filename.endsWith(".md") ||

    filename.endsWith(".txt") ||

    filename.endsWith(".json");

  if (!valid) {

    alert(

      "请选择 TXT、MD 或 JSON 文件。"

    );

    return;

  }

  try {

    const text =

      await file.text();

    source.value =

      text;

    saveState();

    renderResume();

  }

  catch (error) {

    console.error(error);

    alert(

      "文件读取失败。"

    );

  }

}

/* =========================================================

   Text Input

========================================================= */

if (source) {

  source.addEventListener(

    "input",

    () => {

      saveState();

      renderResume();

    }

  );

}

/* =========================================================

   Render Button

========================================================= */

if (renderBtn) {

  renderBtn.addEventListener(

    "click",

    () => {

      saveState();

      renderResume();

    }

  );

}

/* =========================================================

   Demo

========================================================= */

if (demoBtn) {

  demoBtn.addEventListener(

    "click",

    () => {

      source.value =

        DEMO_MD;

      saveState();

      renderResume();

    }

  );

}

/* =========================================================

   Clear

========================================================= */

if (clearBtn) {

  clearBtn.addEventListener(

    "click",

    () => {

      source.value =

        "";

      localStorage.removeItem(

        STORAGE_RESUME

      );

      renderResume();

    }

  );

}

/* =========================================================

   PDF

========================================================= */

if (pdfBtn) {

  pdfBtn.addEventListener(

    "click",

    () => {

      window.print();

    }

  );

}

/* =========================================================

   File Button

========================================================= */

if (

  fileBtn &&

  fileInput

) {

  fileBtn.addEventListener(

    "click",

    event => {

      event.preventDefault();

      fileInput.click();

    }

  );

  fileInput.addEventListener(

    "change",

    event => {

      importFile(

        event.target.files?.[0]

      );

    }

  );

}

/* =========================================================

   Drag & Drop

========================================================= */

if (dropZone) {

  dropZone.addEventListener(

    "dragover",

    event => {

      event.preventDefault();

      dropZone.classList.add(

        "drag"

      );

    }

  );

  dropZone.addEventListener(

    "dragleave",

    () => {

      dropZone.classList.remove(

        "drag"

      );

    }

  );

  dropZone.addEventListener(

    "drop",

    event => {

      event.preventDefault();

      dropZone.classList.remove(

        "drag"

      );

      importFile(

        event.dataTransfer

          .files?.[0]

      );

    }

  );

}

/* =========================================================

   Photo Button

========================================================= */

if (

  photoBtn &&

  photoFile

) {

  photoBtn.addEventListener(

    "click",

    event => {

      event.preventDefault();

      photoFile.click();

    }

  );

  photoFile.addEventListener(

    "change",

    event => {

      const file =

        event.target.files?.[0];

      if (!file) return;

      const allowed = [

        "image/jpeg",

        "image/png",

        "image/webp"

      ];

      if (

        !allowed.includes(

          file.type

        )

      ) {

        alert(

          "请选择 JPG、PNG 或 WebP 图片。"

        );

        return;

      }

      const reader =

        new FileReader();

      reader.onload =

        event => {

          localStorage.setItem(

            STORAGE_PHOTO,

            event.target.result

          );

          updatePhotoUI();

          renderResume();

        };

      reader.readAsDataURL(

        file

      );

    }

  );

}

/* =========================================================

   Remove Photo

========================================================= */

if (removePhotoBtn) {

  removePhotoBtn.addEventListener(

    "click",

    event => {

      event.preventDefault();

      localStorage.removeItem(

        STORAGE_PHOTO

      );

      if (photoFile) {

        photoFile.value =

          "";

      }

      updatePhotoUI();

      renderResume();

    }

  );

}

/* =========================================================

   Templates

========================================================= */

if (templates) {

  templates.addEventListener(

    "click",

    event => {

      const button =

        event.target.closest(

          "[data-t]"

        );

      if (!button) return;

      state.template =

        button.dataset.t;

      updateTemplateButtons();

      saveState();

      renderResume();

    }

  );

}

/* =========================================================

   Themes

========================================================= */

if (themes) {

  themes.addEventListener(

    "click",

    event => {

      const button =

        event.target.closest(

          "[data-theme]"

        );

      if (!button) return;

      const theme =

        button.dataset.theme;

      if (!THEMES[theme]) {

        return;

      }

      state.theme =

        theme;

      updateThemeButtons();

      saveState();

      renderResume();

    }

  );

}

/* =========================================================

   Page Mode

========================================================= */

if (pages) {

  pages.addEventListener(

    "change",

    () => {

      state.pageMode =

        pages.value;

      saveState();

      renderResume();

    }

  );

}

/* =========================================================

   Photo Mode

========================================================= */

if (photoMode) {

  photoMode.addEventListener(

    "change",

    () => {

      state.showPhoto =

        photoMode.value === "show";

      saveState();

      renderResume();

    }

  );

}

/* =========================================================

   Font

========================================================= */

if (font) {

  font.addEventListener(

    "change",

    () => {

      state.font =

        font.value;

      saveState();

      renderResume();

    }

  );

}

/* =========================================================

   Size

========================================================= */

if (size) {

  size.addEventListener(

    "input",

    () => {

      state.fontSize =

        Number(size.value);

      if (sizeVal) {

        sizeVal.textContent =

          state.fontSize;

      }

      saveState();

      renderResume();

    }

  );

}

/* =========================================================

   Zoom

========================================================= */

if (zoom) {

  zoom.addEventListener(

    "input",

    () => {

      state.zoom =

        Number(zoom.value);

      applyZoom();

      saveState();

    }

  );

}

/* =========================================================

   Dynamic CSS

========================================================= */

const dynamicStyle =

document.createElement("style");

dynamicStyle.id =

  "resumeflow-v121-style";

dynamicStyle.textContent = `

/* =========================================================

   ResumeFlow V1.2.1 visual system

========================================================= */

#paper{

  display:block;

  width:794px;

  min-height:1123px;

  margin:0 auto;

  background:#fff;

  position:relative;

  box-sizing:border-box;

  box-shadow:0 10px 35px rgba(0,0,0,.10);

  padding:48px 58px;

  color:#171b1f;

  font-size:var(--resume-font-size,13px);

  line-height:1.55;

  transition:all .18s ease;

}

/* -------------------------

   Header

------------------------- */

#paper .paper-header{

  display:flex;

  align-items:flex-start;

  justify-content:space-between;

  gap:24px;

  width:100%;

  margin-bottom:18px;

}

#paper .identity{

  min-width:0;

  flex:1;

}

#paper .name{

  font-size:30px;

  line-height:1.15;

  font-weight:800;

  letter-spacing:.02em;

  margin:0 0 5px;

}

#paper .title{

  font-size:15px;

  line-height:1.4;

  color:#4d5961;

  margin-bottom:7px;

}

#paper .contact{

  font-size:11px;

  color:#68727b;

  line-height:1.6;

}

#paper .resume-photo{

  flex:0 0 auto;

  width:92px;

  height:122px;

  border:1px solid #d8dde1;

  background:#f7f8f9;

  overflow:hidden;

  margin-left:auto;

}

#paper .resume-photo img{

  display:block;

  width:100%;

  height:100%;

  object-fit:cover;

}

/* -------------------------

   Content

------------------------- */

#paper .resume-content{

  width:100%;

}

#paper .section{

  margin-top:16px;

  break-inside:auto;

}

#paper .section-title{

  color:var(--resume-accent);

  font-size:13px;

  font-weight:800;

  line-height:1.3;

  letter-spacing:.06em;

  border-bottom:1.5px solid var(--resume-accent);

  padding:0 0 5px;

  margin-bottom:8px;

  break-after:avoid;

}

#paper .section-body{

  min-width:0;

}

#paper .section-body p{

  margin:3px 0 5px;

}

#paper .section-body ul{

  margin:4px 0 8px;

  padding-left:18px;

}

#paper .section-body li{

  margin:2px 0 3px;

  line-height:1.52;

  break-inside:avoid;

}

#paper .item-head{

  font-weight:700;

  margin:5px 0 3px;

  line-height:1.45;

  break-after:avoid;

}

/* =========================================================

   技术经典

========================================================= */

#paper.tech{

  border-top:5px solid var(--resume-accent);

}

#paper.tech .name{

  color:#151a1e;

}

#paper.tech .section-title{

  border-bottom-width:1.5px;

}

/* =========================================================

   工程师蓝

========================================================= */

#paper.blue{

  border-top:5px solid var(--resume-accent);

}

#paper.blue .name{

  color:var(--resume-accent);

}

#paper.blue .section-title{

  border-bottom-width:2px;

}

/* =========================================================

   极简黑白

========================================================= */

#paper.minimal{

  padding:50px 62px;

  border-top:0;

}

#paper.minimal .name{

  font-size:30px;

  font-weight:700;

}

#paper.minimal .section-title{

  border-bottom:0;

  padding-bottom:2px;

  letter-spacing:.12em;

}

#paper.minimal .contact{

  padding-bottom:13px;

  border-bottom:1px solid #ddd;

}

/* =========================================================

   代码终端

========================================================= */

#paper.terminal{

  background:#fff;

  font-family:

    "SFMono-Regular",

    Consolas,

    "Liberation Mono",

    "PingFang SC",

    monospace;

}

#paper.terminal .name{

  font-size:27px;

  color:var(--resume-accent);

}

#paper.terminal .section-title{

  display:inline-block;

  padding:4px 8px;

  border:0;

  background:var(--resume-accent);

  color:#fff;

  letter-spacing:.02em;

}

#paper.terminal .section{

  margin-top:15px;

}

/* =========================================================

   科技灰蓝

========================================================= */

#paper.grayblue{

  border-top:4px solid var(--resume-accent);

}

#paper.grayblue .name{

  color:#253746;

}

#paper.grayblue .section-title{

  color:var(--resume-accent);

  border-bottom-color:#9aa9b5;

}

/* =========================================================

   左侧色带

========================================================= */

#paper.stripe{

  border-left:8px solid var(--resume-accent);

  padding-left:54px;

}

#paper.stripe .section-title{

  border-bottom:2px solid var(--resume-accent);

}

/* =========================================================

   商务技术

========================================================= */

#paper.business{

  padding-top:50px;

}

#paper.business .name{

  font-weight:700;

}

#paper.business .section-title{

  font-size:12px;

  letter-spacing:.16em;

  border-bottom:2px solid var(--resume-accent);

}

/* =========================================================

   证件照技术

========================================================= */

#paper.photo{

  border-top:5px solid var(--resume-accent);

}

#paper.photo .resume-photo{

  width:98px;

  height:130px;

}

#paper.photo .name{

  color:var(--resume-accent);

}

/* =========================================================

   One page

========================================================= */

#paper.page-one{

  min-height:1123px;

  padding-top:40px;

  padding-bottom:34px;

  font-size:var(--resume-font-size,13px);

}

#paper.page-one .paper-header{

  margin-bottom:12px;

}

#paper.page-one .name{

  font-size:28px;

}

#paper.page-one .section{

  margin-top:11px;

}

#paper.page-one .section-title{

  margin-bottom:6px;

  padding-bottom:4px;

}

#paper.page-one .section-body p{

  margin:2px 0 3px;

}

#paper.page-one .section-body ul{

  margin:2px 0 5px;

}

#paper.page-one .section-body li{

  line-height:1.42;

  margin:1px 0 2px;

}

#paper.page-one .item-head{

  margin:3px 0 2px;

}

/* =========================================================

   Two pages

========================================================= */

#paper.page-two{

  min-height:2246px;

}

#paper.page-two .section{

  margin-top:19px;

}

/* =========================================================

   Template selector thumbnails

========================================================= */

#templates{

  grid-template-columns:1fr 1fr;

}

#templates button{

  min-height:78px;

  padding:5px;

  display:flex;

  flex-direction:column;

  align-items:center;

  justify-content:center;

  gap:4px;

}

.template-thumb{

  width:55px;

  height:63px;

  display:block;

  position:relative;

  background:#fff;

  border:1px solid #d6dce1;

  box-shadow:0 2px 5px rgba(0,0,0,.08);

  overflow:hidden;

  padding:7px 5px;

}

.template-thumb .mini-name{

  display:block;

  width:20px;

  height:5px;

  background:#1e252b;

  margin-bottom:5px;

}

.template-thumb .mini-line{

  display:block;

  width:100%;

  height:2px;

  background:#d5dadd;

  margin:3px 0;

}

.template-thumb .mini-line.short{

  width:70%;

}

.template-thumb .mini-section{

  display:block;

  width:100%;

  height:3px;

  background:#2b5b88;

  margin:6px 0 3px;

}

/* tech */

.template-thumb-tech{

  border-top:4px solid #222;

}

/* blue */

.template-thumb-blue{

  border-top:4px solid #2477bd;

}

.template-thumb-blue .mini-section{

  background:#2477bd;

}

/* minimal */

.template-thumb-minimal{

  border:0;

}

.template-thumb-minimal .mini-section{

  background:#222;

}

/* terminal */

.template-thumb-terminal{

  background:#1e2329;

  border-color:#1e2329;

}

.template-thumb-terminal .mini-name,

.template-thumb-terminal .mini-line,

.template-thumb-terminal .mini-section{

  background:#79c7ff;

}

/* grayblue */

.template-thumb-grayblue{

  border-top:4px solid #65798b;

}

.template-thumb-grayblue .mini-section{

  background:#65798b;

}

/* stripe */

.template-thumb-stripe{

  border-left:5px solid #2675a8;

}

.template-thumb-stripe .mini-section{

  background:#2675a8;

}

/* business */

.template-thumb-business{

  border-top:3px solid #333;

}

.template-thumb-business .mini-section{

  background:#333;

}

/* photo */

.template-thumb-photo{

  border-top:4px solid #2477bd;

}

.template-thumb-photo:after{

  content:"";

  position:absolute;

  right:4px;

  top:7px;

  width:12px;

  height:17px;

  border:1px solid #aaa;

  background:#eee;

}

.template-label{

  font-size:11px;

  line-height:1.2;

}

#templates button.active{

  border-color:var(--accent,#1677ff);

  background:#f7fbff;

  color:#1677ff;

}

#templates button.active .template-thumb{

  border-color:#1677ff;

}

/* =========================================================

   Theme buttons

========================================================= */

#themes{

  grid-template-columns:1fr 1fr;

}

#themes button{

  position:relative;

}

#themes button:before{

  content:"";

  display:inline-block;

  width:7px;

  height:7px;

  border-radius:50%;

  background:var(--theme-color,#222);

  margin-right:5px;

  vertical-align:middle;

}

#themes button.active{

  box-shadow:0 0 0 2px var(--theme-color,#1677ff);

  border-color:var(--theme-color,#1677ff);

}

/* =========================================================

   Preview area

========================================================= */

.center{

  overflow:auto;

  padding:28px;

  display:flex;

  justify-content:center;

  align-items:flex-start;

}

#paper{

  flex:none;

}

/* =========================================================

   Print

========================================================= */

@media print{

  @page{

    size:A4;

    margin:0;

  }

  html,

  body{

    background:#fff !important;

  }

  .top,

  .left,

  .right{

    display:none !important;

  }

  .main{

    display:block !important;

    min-height:0 !important;

  }

  .center{

    display:block !important;

    padding:0 !important;

    overflow:visible !important;

  }

  #paper{

    width:210mm !important;

    min-height:297mm !important;

    margin:0 !important;

    padding:14mm 16mm !important;

    box-shadow:none !important;

    transform:none !important;

    font-size:10.5pt !important;

  }

  #paper.page-two{

    min-height:594mm !important;

  }

  #paper .section{

    break-inside:auto;

  }

  #paper .section-title,

  #paper .item-head{

    break-after:avoid;

  }

  #paper li{

    break-inside:avoid;

  }

}

/* =========================================================

   Mobile

========================================================= */

@media(max-width:760px){

  #paper{

    transform:scale(.48);

    transform-origin:top center;

    margin-bottom:-580px;

  }

}

`;

document.head.appendChild(

  dynamicStyle

);

/* =========================================================

   Initialize

========================================================= */

loadState();

createTemplateThumbnails();

syncControls();

updatePhotoUI();

renderResume();

/* =========================================================

   Service Worker

========================================================= */

if (

  "serviceWorker" in navigator

) {

  window.addEventListener(

    "load",

    () => {

      navigator.serviceWorker

        .register(

          "./sw.js?v=1.2.1"

        )

        .then(registration => {

          registration.update();

          console.log(

            "ResumeFlow Service Worker ready"

          );

        })

        .catch(error => {

          console.warn(

            "ResumeFlow Service Worker:",

            error

          );

        });

    }

  );

}

console.log(

  `ResumeFlow V${VERSION} initialized`

);

})();