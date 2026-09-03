/* ResumeFlow V1.2

 * JD → Resume → A4 PDF

 * Markdown / JSON / TXT

 * Local-first

 */

const VERSION = "1.2";

const STORAGE_KEY = "resumeflow-data-v12";

const PHOTO_KEY = "resumeflow-photo-v12";

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

const TEMPLATE_NAMES = {

  tech: "技术经典",

  blue: "工程师蓝",

  minimal: "极简黑白",

  terminal: "代码终端",

  grayblue: "科技灰蓝",

  stripe: "左侧色带",

  business: "商务技术",

  photo: "证件照技术版"

};

const THEME_COLORS = {

  black: "#222222",

  navy: "#17365D",

  blue: "#1677FF",

  green: "#216E5B",

  gray: "#555B66",

  wine: "#7A3030"

};

let state = {

  template: "tech",

  theme: "navy",

  pageMode: "auto",

  showPhoto: true,

  font: "system",

  fontSize: 10.5,

  zoom: 1

};

/* =========================================================

   DOM

========================================================= */

const resumeInput = document.getElementById("resumeInput");

const resumePreview = document.getElementById("resumePreview");

const templateSelect = document.getElementById("templateSelect");

const themeSelect = document.getElementById("themeSelect");

const pageModeSelect = document.getElementById("pageModeSelect");

const photoToggle = document.getElementById("photoToggle");

const fontSelect = document.getElementById("fontSelect");

const fontSizeInput = document.getElementById("fontSizeInput");

const zoomInput = document.getElementById("zoomInput");

const photoInput = document.getElementById("photoInput");

const photoPreview = document.getElementById("photoPreview");

const importFile = document.getElementById("importFile");

const dropZone = document.getElementById("dropZone");

/* =========================================================

   Demo Resume

========================================================= */

const DEMO_MD = `# 李思杏

ADAS软件工程师

成都 | C / C++ / Linux / MATLAB | 4年智能驾驶软件开发经验

## 个人优势

- 4年智能驾驶及车载软件开发经验，主要负责L2级ADAS功能。

- 熟悉ACC纵向控制、TSR、CAN通信、算法调试、标定及问题分析。

- 具备从需求分析、算法实现、测试验证到量产发布支持的完整开发经验。

- 熟悉C语言、Linux、Git、MATLAB、CANoe等开发与分析工具。

## 核心技能

- 编程语言：C、C++、Python

- 智能驾驶：ACC、TSR、L2 ADAS、纵向控制

- 控制算法：PID、前馈控制、加速度控制、扭矩控制

- 车载通信：CAN、DBC、CANoe、CANalyzer

- 开发环境：Linux、GCC、CMake、Git

- 数据分析：MATLAB、Matlab Script

- 工程能力：问题定位、数据采集、标定、测试验证、版本发布

## 工作经历

### 安智杰科技有限公司

**ADAS软件工程师 | 2022.02 – 2026.06**

- 负责L2级ADAS功能的软件开发与维护，重点负责ACC及TSR模块。

- 负责ACC纵向控制算法实现，包括期望加速度、前馈扭矩、PID反馈及扭矩请求计算。

- 基于CAN信号进行问题复现与数据分析，定位控制延迟、加速度波动、制动能力不足等问题。

- 使用MATLAB开发数据分析脚本，对车辆速度、实际加速度、扭矩请求及控制状态进行批量分析。

- 负责算法参数标定、测试验证及版本发布支持。

- 参与不同车型ADAS软件适配及量产项目开发。

## 项目经历

### L2 ACC纵向控制系统

**2025.09 – 2026.06**

- 负责轻型商用车L2 ACC软件模块开发及维护。

- 建立“期望加速度 → 前馈扭矩 → PID反馈 → 总扭矩请求”的纵向控制链路。

- 针对车辆加速度响应延迟及控制振荡问题进行CAN数据采集、MATLAB分析和参数优化。

- 分析车辆负载变化对负扭矩及制动减速度能力的影响。

- 完成ACC加减速、跟车、停车及制动能力相关测试验证。

### TSR交通标志识别

**2024 – 2025**

- 负责TSR状态机及显示逻辑开发。

- 根据系统状态、识别结果及优先级实现交通标志显示策略。

- 完成CAN信号分析、异常场景验证及版本发布支持。

## 教育背景

### 计算机科学与技术

**本科 | 2018 – 2022**

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

function normalizeHeading(text) {

  return stripMarkdown(text)

    .replace(/[：:]/g, "")

    .trim()

    .toLowerCase();

}

function findSectionType(title) {

  const normalized = normalizeHeading(title);

  for (const [type, aliases] of Object.entries(SECTION_ALIASES)) {

    if (

      aliases.some(

        alias => normalizeHeading(alias) === normalized

      )

    ) {

      return type;

    }

  }

  return null;

}

function escapeHTML(text) {

  return String(text || "")

    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#039;");

}

/* =========================================================

   JSON Parser

========================================================= */

function parseJSON(text) {

  try {

    const data = JSON.parse(text);

    if (!data || typeof data !== "object") {

      return null;

    }

    return data;

  } catch {

    return null;

  }

}

/* =========================================================

   Markdown Parser

========================================================= */

function parseMarkdown(text) {

  const lines = cleanText(text).split("\n");

  const result = {

    name: "",

    title: "",

    contact: "",

    sections: []

  };

  let currentSection = null;

  for (let rawLine of lines) {

    let line = rawLine.trim();

    if (!line) continue;

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

    if (headingMatch) {

      const level = headingMatch[1].length;

      const title = stripMarkdown(headingMatch[2]);

      if (level === 1 && !result.name) {

        result.name = title;

        continue;

      }

      const sectionType = findSectionType(title);

      if (sectionType) {

        currentSection = {

          type: sectionType,

          title,

          items: []

        };

        result.sections.push(currentSection);

        continue;

      }

      if (

        level <= 3 &&

        currentSection &&

        currentSection.type !== "summary"

      ) {

        currentSection.items.push({

          type: "subheading",

          text: title

        });

        continue;

      }

    }

    const plain = stripMarkdown(line);

    if (!result.title && !currentSection && result.name) {

      result.title = plain;

      continue;

    }

    if (!result.contact && !currentSection && result.title) {

      result.contact = plain;

      continue;

    }

    if (!currentSection) {

      continue;

    }

    if (/^[-*+]\s+/.test(line)) {

      currentSection.items.push({

        type: "bullet",

        text: stripMarkdown(

          line.replace(/^[-*+]\s+/, "")

        )

      });

    } else {

      currentSection.items.push({

        type: "text",

        text: plain

      });

    }

  }

  return result;

}

/* =========================================================

   JSON → Internal Format

========================================================= */

function normalizeJSON(data) {

  const result = {

    name: data.name || data.姓名 || "",

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

  const sectionKeys = [

    "summary",

    "skills",

    "experience",

    "projects",

    "education",

    "certificates",

    "awards"

  ];

  for (const key of sectionKeys) {

    if (!data[key]) continue;

    const value = data[key];

    const section = {

      type: key,

      title:

        SECTION_ALIASES[key]?.[0] ||

        key,

      items: []

    };

    if (Array.isArray(value)) {

      value.forEach(item => {

        if (typeof item === "string") {

          section.items.push({

            type: "text",

            text: item

          });

        } else if (item && typeof item === "object") {

          section.items.push({

            type: "subheading",

            text:

              item.title ||

              item.name ||

              item.company ||

              item.school ||

              ""

          });

          if (item.description) {

            section.items.push({

              type: "text",

              text: item.description

            });

          }

          if (Array.isArray(item.bullets)) {

            item.bullets.forEach(bullet => {

              section.items.push({

                type: "bullet",

                text: bullet

              });

            });

          }

        }

      });

    } else if (typeof value === "string") {

      section.items.push({

        type: "text",

        text: value

      });

    }

    result.sections.push(section);

  }

  return result;

}

/* =========================================================

   Universal Parser

========================================================= */

function parseResume(text) {

  text = cleanText(text);

  if (!text) {

    return {

      name: "姓名",

      title: "求职职位",

      contact: "",

      sections: []

    };

  }

  const json = parseJSON(text);

  if (json) {

    return normalizeJSON(json);

  }

  return parseMarkdown(text);

}

/* =========================================================

   Render

========================================================= */

function renderSection(section) {

  if (!section.items?.length) return "";

  const itemsHTML = section.items

    .map(item => {

      const text = escapeHTML(item.text);

      if (!text) return "";

      if (item.type === "bullet") {

        return `<li>${text}</li>`;

      }

      if (item.type === "subheading") {

        return `<h3>${text}</h3>`;

      }

      return `<p>${text}</p>`;

    })

    .join("");

  const hasBullets = section.items.some(

    item => item.type === "bullet"

  );

  return `

    <section class="resume-section section-${section.type}">

      <h2>${escapeHTML(section.title)}</h2>

      ${

        hasBullets

          ? `<ul>${itemsHTML}</ul>`

          : itemsHTML

      }

    </section>

  `;

}

function renderResume(data) {

  const photo = localStorage.getItem(PHOTO_KEY);

  const photoHTML =

    state.showPhoto && photo

      ? `

        <div class="resume-photo">

          <img src="${photo}" alt="photo">

        </div>

      `

      : "";

  const sectionsHTML = data.sections

    .map(renderSection)

    .join("");

  resumePreview.innerHTML = `

    <div

      class="

        resume-paper

        template-${state.template}

        page-${state.pageMode}

      "

      style="

        --resume-accent:${THEME_COLORS[state.theme]};

        --resume-font-size:${state.fontSize}pt;

      "

    >

      <header class="resume-header">

        <div class="resume-header-main">

          <div class="resume-name">

            ${escapeHTML(data.name || "姓名")}

          </div>

          ${

            data.title

              ? `

                <div class="resume-title">

                  ${escapeHTML(data.title)}

                </div>

              `

              : ""

          }

          ${

            data.contact

              ? `

                <div class="resume-contact">

                  ${escapeHTML(data.contact)}

                </div>

              `

              : ""

          }

        </div>

        ${photoHTML}

      </header>

      <main class="resume-body">

        ${sectionsHTML}

      </main>

    </div>

  `;

  applyFont();

  applyZoom();

}

/* =========================================================

   State

========================================================= */

function saveState() {

  localStorage.setItem(

    STORAGE_KEY,

    JSON.stringify(state)

  );

}

function loadState() {

  try {

    const saved = JSON.parse(

      localStorage.getItem(STORAGE_KEY)

    );

    if (saved && typeof saved === "object") {

      state = {

        ...state,

        ...saved

      };

    }

  } catch {

    // ignore invalid storage

  }

}

/* =========================================================

   UI State

========================================================= */

function syncControls() {

  if (templateSelect) {

    templateSelect.value = state.template;

  }

  if (themeSelect) {

    themeSelect.value = state.theme;

  }

  if (pageModeSelect) {

    pageModeSelect.value = state.pageMode;

  }

  if (photoToggle) {

    photoToggle.checked = state.showPhoto;

  }

  if (fontSelect) {

    fontSelect.value = state.font;

  }

  if (fontSizeInput) {

    fontSizeInput.value = state.fontSize;

  }

  if (zoomInput) {

    zoomInput.value = state.zoom;

  }

}

/* =========================================================

   Font

========================================================= */

function applyFont() {

  const paper = document.querySelector(".resume-paper");

  if (!paper) return;

  const fonts = {

    system:

      '-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif',

    chinese:

      '"Microsoft YaHei","PingFang SC","Noto Sans CJK SC",sans-serif',

    serif:

      '"Noto Serif SC","Songti SC","SimSun",serif',

    mono:

      '"SFMono-Regular","Consolas","Liberation Mono","Microsoft YaHei",monospace'

  };

  paper.style.fontFamily =

    fonts[state.font] || fonts.system;

}

/* =========================================================

   Zoom

========================================================= */

function applyZoom() {

  if (!resumePreview) return;

  resumePreview.style.setProperty(

    "--preview-zoom",

    state.zoom

  );

}

/* =========================================================

   Resume Input

========================================================= */

function updateResume() {

  if (!resumeInput) return;

  const data = parseResume(

    resumeInput.value

  );

  renderResume(data);

  localStorage.setItem(

    "resumeflow-resume-v12",

    resumeInput.value

  );

}

/* =========================================================

   Template

========================================================= */

if (templateSelect) {

  templateSelect.addEventListener(

    "change",

    () => {

      state.template =

        templateSelect.value;

      saveState();

      updateResume();

    }

  );

}

/* =========================================================

   Theme

========================================================= */

if (themeSelect) {

  themeSelect.addEventListener(

    "change",

    () => {

      state.theme =

        themeSelect.value;

      saveState();

      updateResume();

    }

  );

}

/* =========================================================

   Page Mode

========================================================= */

if (pageModeSelect) {

  pageModeSelect.addEventListener(

    "change",

    () => {

      state.pageMode =

        pageModeSelect.value;

      saveState();

      updateResume();

    }

  );

}

/* =========================================================

   Photo Toggle

========================================================= */

if (photoToggle) {

  photoToggle.addEventListener(

    "change",

    () => {

      state.showPhoto =

        photoToggle.checked;

      saveState();

      updateResume();

    }

  );

}

/* =========================================================

   Font

========================================================= */

if (fontSelect) {

  fontSelect.addEventListener(

    "change",

    () => {

      state.font =

        fontSelect.value;

      saveState();

      updateResume();

    }

  );

}

/* =========================================================

   Font Size

========================================================= */

if (fontSizeInput) {

  fontSizeInput.addEventListener(

    "input",

    () => {

      state.fontSize =

        Number(fontSizeInput.value);

      saveState();

      updateResume();

    }

  );

}

/* =========================================================

   Zoom

========================================================= */

if (zoomInput) {

  zoomInput.addEventListener(

    "input",

    () => {

      state.zoom =

        Number(zoomInput.value);

      applyZoom();

      saveState();

    }

  );

}

/* =========================================================

   Photo Upload

========================================================= */

function handlePhoto(file) {

  if (!file) return;

  if (!file.type.startsWith("image/")) {

    alert("请选择 JPG、PNG 或 WebP 图片。");

    return;

  }

  const reader = new FileReader();

  reader.onload = event => {

    const dataURL =

      event.target.result;

    localStorage.setItem(

      PHOTO_KEY,

      dataURL

    );

    showPhotoPreview(dataURL);

    updateResume();

  };

  reader.readAsDataURL(file);

}

function showPhotoPreview(src) {

  if (!photoPreview) return;

  photoPreview.innerHTML = `

    <img

      src="${src}"

      alt="证件照预览"

    >

  `;

}

if (photoInput) {

  photoInput.addEventListener(

    "change",

    event => {

      handlePhoto(

        event.target.files?.[0]

      );

    }

  );

}

/* =========================================================

   Photo Drag & Drop

========================================================= */

if (dropZone) {

  dropZone.addEventListener(

    "dragover",

    event => {

      event.preventDefault();

      dropZone.classList.add("dragover");

    }

  );

  dropZone.addEventListener(

    "dragleave",

    () => {

      dropZone.classList.remove("dragover");

    }

  );

  dropZone.addEventListener(

    "drop",

    event => {

      event.preventDefault();

      dropZone.classList.remove(

        "dragover"

      );

      handlePhoto(

        event.dataTransfer.files?.[0]

      );

    }

  );

}

/* =========================================================

   Remove Photo

========================================================= */

const removePhotoButton =

  document.getElementById(

    "removePhoto"

  );

if (removePhotoButton) {

  removePhotoButton.addEventListener(

    "click",

    () => {

      localStorage.removeItem(

        PHOTO_KEY

      );

      if (photoPreview) {

        photoPreview.innerHTML = "";

      }

      updateResume();

    }

  );

}

/* =========================================================

   File Import

========================================================= */

async function importResumeFile(file) {

  if (!file) return;

  const name =

    file.name.toLowerCase();

  if (

    !name.endsWith(".md") &&

    !name.endsWith(".txt") &&

    !name.endsWith(".json")

  ) {

    alert(

      "目前支持 Markdown、TXT、JSON 文件。"

    );

    return;

  }

  try {

    const text =

      await file.text();

    resumeInput.value = text;

    updateResume();

  } catch (error) {

    console.error(error);

    alert(

      "文件读取失败，请检查文件格式。"

    );

  }

}

if (importFile) {

  importFile.addEventListener(

    "change",

    event => {

      importResumeFile(

        event.target.files?.[0]

      );

    }

  );

}

/* =========================================================

   Resume Textarea

========================================================= */

if (resumeInput) {

  resumeInput.addEventListener(

    "input",

    updateResume

  );

}

/* =========================================================

   Demo Button

========================================================= */

const demoButton =

  document.getElementById(

    "loadDemo"

  );

if (demoButton) {

  demoButton.addEventListener(

    "click",

    () => {

      resumeInput.value =

        DEMO_MD;

      updateResume();

    }

  );

}

/* =========================================================

   Clear Button

========================================================= */

const clearButton =

  document.getElementById(

    "clearResume"

  );

if (clearButton) {

  clearButton.addEventListener(

    "click",

    () => {

      if (

        !confirm(

          "确定清空当前简历内容吗？"

        )

      ) {

        return;

      }

      resumeInput.value = "";

      localStorage.removeItem(

        "resumeflow-resume-v12"

      );

      updateResume();

    }

  );

}

/* =========================================================

   Print / PDF

========================================================= */

const printButton =

  document.getElementById(

    "printResume"

  );

if (printButton) {

  printButton.addEventListener(

    "click",

    () => {

      window.print();

    }

  );

}

/* =========================================================

   Restore Resume

========================================================= */

function restoreResume() {

  const saved =

    localStorage.getItem(

      "resumeflow-resume-v12"

    );

  if (saved && resumeInput) {

    resumeInput.value = saved;

  } else if (resumeInput) {

    resumeInput.value = DEMO_MD;

  }

}

/* =========================================================

   Restore Photo

========================================================= */

function restorePhoto() {

  const photo =

    localStorage.getItem(

      PHOTO_KEY

    );

  if (photo) {

    showPhotoPreview(photo);

  }

}

/* =========================================================

   Service Worker

========================================================= */

if ("serviceWorker" in navigator) {

  window.addEventListener(

    "load",

    () => {

      navigator.serviceWorker

        .register(

          "./sw.js?v=1.2"

        )

        .then(registration => {

          registration.update();

          console.log(

            "ResumeFlow Service Worker:",

            registration.scope

          );

        })

        .catch(error => {

          console.warn(

            "Service Worker registration failed:",

            error

          );

        });

    }

  );

}

/* =========================================================

   Initialize

========================================================= */

loadState();

syncControls();

restoreResume();

restorePhoto();

updateResume();

console.log(

  `ResumeFlow V${VERSION} initialized`

);