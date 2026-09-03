/* =========================================================
   ResumeFlow V1.2.2
   Stable Edition
   ---------------------------------------------------------
   核心原则：
   - 与 index.html 实际 DOM ID 完全一致
   - 所有按钮统一事件管理
   - 所有选择项都有实际效果
   - localStorage 状态兼容
   - MD / TXT / JSON
   - 证件照右上角
   - 模板真实切换
   - 主题色真实切换
   - A4 一页 / 两页 / 自动
   - 字体 / 字号 / 缩放
   - PDF
   - Safari / iOS 兼容
========================================================= */

(() => {

"use strict";


/* =========================================================
   版本
========================================================= */

const VERSION = "1.2.2";


/* =========================================================
   Storage
========================================================= */

const STORAGE = {

  resume:
    "resumeflow-resume-v122",

  state:
    "resumeflow-state-v122",

  photo:
    "resumeflow-photo-v122"

};


/* =========================================================
   DOM
========================================================= */

const $ = id =>
  document.getElementById(id);


const source = $("source");
const paper = $("paper");

const demoBtn = $("demoBtn");
const pdfBtn = $("pdfBtn");

const fileInput = $("file");
const fileBtn = $("fileBtn");
const dropZone = $("drop");

const photoFile = $("photoFile");
const photoBtn = $("photoBtn");
const removePhotoBtn =
  $("removePhotoBtn");

const photoPreview =
  $("photoPreview");

const renderBtn =
  $("renderBtn");

const clearBtn =
  $("clearBtn");

const templates =
  $("templates");

const themes =
  $("themes");

const pages =
  $("pages");

const photoMode =
  $("photoMode");

const font =
  $("font");

const size =
  $("size");

const sizeVal =
  $("sizeVal");

const zoom =
  $("zoom");

const zoomVal =
  $("zoomVal");


/* =========================================================
   默认状态
========================================================= */

const DEFAULT_STATE = {

  template: "tech",

  theme: "blue",

  pageMode: "one",

  showPhoto: true,

  font: "pingfang",

  fontSize: 13,

  zoom: 0.8

};


let state = {
  ...DEFAULT_STATE
};


/* =========================================================
   主题
========================================================= */

const THEMES = {

  black: {
    main: "#222222",
    light: "#f2f2f2"
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
   模板
========================================================= */

const TEMPLATE_LIST = [

  "tech",
  "blue",
  "minimal",
  "terminal",
  "grayblue",
  "stripe",
  "business",
  "photo"

];


/* =========================================================
   Section
========================================================= */

const SECTION_ALIASES = {

  summary: [
    "个人优势",
    "个人简介",
    "个人概述",
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
   Demo
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
   工具函数
========================================================= */

function clean(text) {

  return String(text || "")
    .replace(/\r/g, "")
    .replace(/\u00a0/g, " ")
    .trim();

}


function stripMD(text) {

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

  return stripMD(text)
    .replace(/[：:]/g, "")
    .trim()
    .toLowerCase();

}


function sectionType(title) {

  const normalized =
    normalizeHeading(title);


  for (
    const [type, aliases]
    of Object.entries(SECTION_ALIASES)
  ) {

    if (
      aliases.some(
        alias =>
          normalizeHeading(alias) ===
          normalized
      )
    ) {

      return type;

    }

  }


  return null;

}


/* =========================================================
   Markdown
========================================================= */

function parseMarkdown(text) {

  const lines =
    clean(text).split("\n");


  const result = {

    name: "",

    title: "",

    contact: "",

    sections: []

  };


  let current = null;


  for (
    const rawLine of lines
  ) {

    const line =
      rawLine.trim();


    if (!line) continue;


    const heading =
      line.match(
        /^(#{1,6})\s+(.+)$/
      );


    if (heading) {

      const level =
        heading[1].length;


      const title =
        stripMD(
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


      const type =
        sectionType(title);


      if (type) {

        current = {

          type,

          title,

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

          type:
            "subheading",

          text:
            title

        });


        continue;

      }

    }


    const plain =
      stripMD(line);


    if (
      !current &&
      result.name &&
      !result.title
    ) {

      result.title =
        plain;

      continue;

    }


    if (
      !current &&
      result.title &&
      !result.contact
    ) {

      result.contact =
        plain;

      continue;

    }


    if (!current) continue;


    if (
      /^[-*+]\s+/.test(line)
    ) {

      current.items.push({

        type: "bullet",

        text:
          stripMD(
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
   JSON
========================================================= */

function parseJSON(text) {

  try {

    const data =
      JSON.parse(text);


    if (
      !data ||
      typeof data !== "object"
    ) {

      return null;

    }


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


      if (
        Array.isArray(value)
      ) {

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

                type:
                  "subheading",

                text:
                  heading

              });

            }


            if (
              item.description
            ) {

              section.items.push({

                type:
                  "text",

                text:
                  item.description

              });

            }


            if (
              Array.isArray(
                item.bullets
              )
            ) {

              item.bullets.forEach(
                bullet => {

                  section.items.push({

                    type:
                      "bullet",

                    text:
                      bullet

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


      result.sections.push(
        section
      );

    });


    return result;

  }

  catch (error) {

    return null;

  }

}


/* =========================================================
   Universal parser
========================================================= */

function parseResume(text) {

  text =
    clean(text);


  if (!text) {

    return {

      name: "姓名",

      title: "求职职位",

      contact: "",

      sections: []

    };

  }


  const json =
    parseJSON(text);


  if (json) {

    return json;

  }


  return parseMarkdown(text);

}


/* =========================================================
   Render Section
========================================================= */

function renderSection(section) {

  if (
    !section.items ||
    !section.items.length
  ) {

    return "";

  }


  let normalHTML = "";

  let bullets = "";


  section.items.forEach(item => {

    const text =
      escapeHTML(item.text);


    if (!text) return;


    if (
      item.type ===
      "subheading"
    ) {

      normalHTML += `

        <div class="item-head">

          ${text}

        </div>

      `;

      return;

    }


    if (
      item.type ===
      "bullet"
    ) {

      bullets += `

        <li>

          ${text}

        </li>

      `;

      return;

    }


    normalHTML += `

      <p>

        ${text}

      </p>

    `;

  });


  if (bullets) {

    normalHTML += `

      <ul>

        ${bullets}

      </ul>

    `;

  }


  return `

    <section
      class="section section-${section.type}"
    >

      <div class="section-title">

        ${escapeHTML(
          section.title
        )}

      </div>


      <div class="section-body">

        ${normalHTML}

      </div>

    </section>

  `;

}


/* =========================================================
   Header
========================================================= */

function renderHeader(data) {

  const photo =
    localStorage.getItem(
      STORAGE.photo
    );


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
        state.showPhoto &&
        photo
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
   Render
========================================================= */

function render() {

  if (!paper) {

    console.error(
      "ResumeFlow: #paper 不存在"
    );

    return;

  }


  const data =
    parseResume(
      source.value
    );


  const theme =
    THEMES[state.theme] ||
    THEMES.blue;


  const sections =
    data.sections
      .map(renderSection)
      .join("");


  paper.className =
    `paper ${state.template} page-${state.pageMode}`;


  paper.style.setProperty(
    "--resume-accent",
    theme.main
  );


  paper.style.setProperty(
    "--resume-accent-light",
    theme.light
  );


  paper.style.setProperty(
    "--resume-font-size",
    `${state.fontSize}px`
  );


  paper.innerHTML = `

    ${renderHeader(data)}

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

function save() {

  try {

    localStorage.setItem(
      STORAGE.STATE,
      JSON.stringify(state)
    );


    localStorage.setItem(
      STORAGE.RESUME,
      source.value
    );

  }

  catch (error) {

    console.warn(
      "ResumeFlow localStorage error",
      error
    );

  }

}


/* =========================================================
   Load
========================================================= */

function load() {

  /*
   * V1.2.1 / V1.2 的旧数据也兼容
   */

  const oldKeys = [

    "resumeflow-state-v121",
    "resumeflow-state-v12"

  ];


  for (
    const key of oldKeys
  ) {

    try {

      const old =
        localStorage.getItem(key);


      if (old) {

        const parsed =
          JSON.parse(old);


        if (
          parsed &&
          typeof parsed ===
            "object"
        ) {

          state = {

            ...DEFAULT_STATE,

            ...parsed

          };

          break;

        }

      }

    }

    catch {

      // ignore

    }

  }


  try {

    const current =
      localStorage.getItem(
        STORAGE.STATE
      );


    if (current) {

      const parsed =
        JSON.parse(current);


      if (
        parsed &&
        typeof parsed ===
          "object"
      ) {

        state = {

          ...state,

          ...parsed

        };

      }

    }

  }

  catch {

    // use defaults

  }


  const savedResume =
    localStorage.getItem(
      STORAGE.RESUME
    );


  /*
   * 兼容旧版本简历
   */

  const oldResume =
    localStorage.getItem(
      "resumeflow-resume-v121"
    ) ||
    localStorage.getItem(
      "resumeflow-resume-v12"
    );


  source.value =
    savedResume ||
    oldResume ||
    DEMO_MD;


  normalizeState();

}


/* =========================================================
   State validation
========================================================= */

function normalizeState() {

  if (
    !TEMPLATE_LIST.includes(
      state.template
    )
  ) {

    state.template =
      DEFAULT_STATE.template;

  }


  if (
    !THEMES[state.theme]
  ) {

    state.theme =
      DEFAULT_STATE.theme;

  }


  if (
    ![
      "auto",
      "one",
      "two"
    ].includes(
      state.pageMode
    )
  ) {

    state.pageMode =
      DEFAULT_STATE.pageMode;

  }


  if (
    ![
      "pingfang",
      "yahei",
      "system"
    ].includes(
      state.font
    )
  ) {

    state.font =
      DEFAULT_STATE.font;

  }


  state.fontSize =
    Math.min(
      15,
      Math.max(
        10,
        Number(state.fontSize) ||
          13
      )
    );


  state.zoom =
    Math.min(
      1,
      Math.max(
        .55,
        Number(state.zoom) ||
          .8
      )
    );


  state.showPhoto =
    Boolean(
      state.showPhoto
    );

}


/* =========================================================
   Controls
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
   Template buttons
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
   Theme buttons
========================================================= */

function updateThemeButtons() {

  if (!themes) return;


  themes
    .querySelectorAll(
      "[data-theme]"
    )
    .forEach(button => {

      const theme =
        THEMES[
          button.dataset.theme
        ];


      button.classList.toggle(

        "active",

        button.dataset.theme ===
          state.theme

      );


      if (theme) {

        button.style.setProperty(
          "--theme-color",
          theme.main
        );

      }

    });

}


/* =========================================================
   Template thumbnail
========================================================= */

function createTemplatePreview() {

  if (!templates) return;


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


      const label =
        button.textContent.trim();


      button.innerHTML = `

        <span
          class="
            template-thumb
            template-thumb-${type}
          "
        >

          <span class="mini-name"></span>

          <span class="mini-line"></span>

          <span class="mini-line short"></span>

          <span class="mini-section"></span>

          <span class="mini-line"></span>

          <span class="mini-line"></span>

          <span class="mini-line short"></span>

        </span>


        <span class="template-label">

          ${escapeHTML(label)}

        </span>

      `;

    });

}


/* =========================================================
   Photo
========================================================= */

function updatePhotoUI() {

  const photo =
    localStorage.getItem(
      STORAGE.photo
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
   File import
========================================================= */

async function importFile(file) {

  if (!file) return;


  const name =
    file.name.toLowerCase();


  const supported =

    name.endsWith(".md") ||

    name.endsWith(".txt") ||

    name.endsWith(".json");


  if (!supported) {

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


    save();

    render();

  }

  catch (error) {

    console.error(
      error
    );


    alert(
      "文件读取失败，请重新选择文件。"
    );

  }

}


/* =========================================================
   Open file picker
========================================================= */

function openFilePicker(input) {

  if (!input) return;


  try {

    if (
      typeof input.showPicker ===
        "function"
    ) {

      input.showPicker();

      return;

    }

  }

  catch {

    // fallback

  }


  input.click();

}


/* =========================================================
   File button
========================================================= */

if (
  fileBtn &&
  fileInput
) {

  fileBtn.addEventListener(
    "click",
    event => {

      event.preventDefault();

      event.stopPropagation();

      openFilePicker(
        fileInput
      );

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
   Photo button
========================================================= */

if (
  photoBtn &&
  photoFile
) {

  photoBtn.addEventListener(
    "click",
    event => {

      event.preventDefault();

      event.stopPropagation();

      openFilePicker(
        photoFile
      );

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

            STORAGE.photo,

            event.target.result

          );


          updatePhotoUI();

          render();

        };


      reader.onerror =
        () => {

          alert(
            "照片读取失败。"
          );

        };


      reader.readAsDataURL(
        file
      );

    }

  );

}


/* =========================================================
   Remove photo
========================================================= */

if (removePhotoBtn) {

  removePhotoBtn.addEventListener(
    "click",
    event => {

      event.preventDefault();


      localStorage.removeItem(
        STORAGE.photo
      );


      if (photoFile) {

        photoFile.value =
          "";

      }


      updatePhotoUI();

      render();

    }
  );

}


/* =========================================================
   Demo
========================================================= */

if (demoBtn) {

  demoBtn.addEventListener(
    "click",
    event => {

      event.preventDefault();


      source.value =
        DEMO_MD;


      save();

      render();

    }
  );

}


/* =========================================================
   Render
========================================================= */

if (renderBtn) {

  renderBtn.addEventListener(
    "click",
    event => {

      event.preventDefault();


      save();

      render();

    }
  );

}


/* =========================================================
   Clear
========================================================= */

if (clearBtn) {

  clearBtn.addEventListener(
    "click",
    event => {

      event.preventDefault();


      source.value =
        "";


      localStorage.removeItem(
        STORAGE.RESUME
      );


      render();

    }
  );

}


/* =========================================================
   PDF
========================================================= */

if (pdfBtn) {

  pdfBtn.addEventListener(
    "click",
    event => {

      event.preventDefault();


      save();


      /*
       * 给浏览器一点时间应用 print CSS
       */

      requestAnimationFrame(
        () => {

          window.print();

        }
      );

    }
  );

}


/* =========================================================
   Template
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


      const template =
        button.dataset.t;


      if (
        !TEMPLATE_LIST.includes(
          template
        )
      ) {

        return;

      }


      state.template =
        template;


      updateTemplateButtons();

      save();

      render();

    }
  );

}


/* =========================================================
   Theme
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

      save();

      render();

    }
  );

}


/* =========================================================
   Page mode
========================================================= */

if (pages) {

  pages.addEventListener(
    "change",
    () => {

      state.pageMode =
        pages.value;


      save();

      render();

    }
  );

}


/* =========================================================
   Photo mode
========================================================= */

if (photoMode) {

  photoMode.addEventListener(
    "change",
    () => {

      state.showPhoto =
        photoMode.value ===
        "show";


      save();

      render();

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


      save();

      render();

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


      save();

      render();

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

      save();

    }
  );

}


/* =========================================================
   输入内容
========================================================= */

if (source) {

  source.addEventListener(
    "input",
    () => {

      save();

      render();

    }
  );

}


/* =========================================================
   Dynamic visual CSS
========================================================= */

const style =
document.createElement(
  "style"
);


style.id =
  "resumeflow-v122-style";


style.textContent = `

/* =========================================================
   A4
========================================================= */

#paper{

  width:794px;

  min-height:1123px;

  flex:none;

  position:relative;

  box-sizing:border-box;

  background:#fff;

  padding:44px 58px;

  box-shadow:
    0 10px 35px rgba(0,0,0,.10);

  transform-origin:
    top center;

  color:#171b1f;

  font-size:
    var(--resume-font-size,13px);

  line-height:1.5;

}


/* =========================================================
   Header
========================================================= */

#paper .paper-header{

  width:100%;

  display:flex;

  align-items:flex-start;

  justify-content:space-between;

  gap:28px;

  margin-bottom:16px;

}


#paper .identity{

  flex:1;

  min-width:0;

}


#paper .name{

  font-size:30px;

  font-weight:800;

  line-height:1.15;

  margin-bottom:5px;

}


#paper .title{

  font-size:15px;

  color:#4d5961;

  margin-bottom:7px;

}


#paper .contact{

  font-size:11px;

  color:#68727b;

  line-height:1.6;

}


/* =========================================================
   Photo — 固定右上角
========================================================= */

#paper .resume-photo{

  flex:0 0 auto;

  width:92px;

  height:122px;

  margin-left:auto;

  border:1px solid #d7dce1;

  overflow:hidden;

  background:#f6f7f8;

}


#paper .resume-photo img{

  display:block;

  width:100%;

  height:100%;

  object-fit:cover;

}


/* =========================================================
   Sections
========================================================= */

#paper .section{

  margin-top:14px;

  break-inside:auto;

}


#paper .section-title{

  color:
    var(--resume-accent);

  font-size:13px;

  font-weight:800;

  letter-spacing:.06em;

  line-height:1.3;

  border-bottom:
    1.5px solid
    var(--resume-accent);

  padding-bottom:4px;

  margin-bottom:7px;

  break-after:avoid;

}


#paper .section-body p{

  margin:2px 0 4px;

}


#paper .section-body ul{

  margin:3px 0 6px;

  padding-left:18px;

}


#paper .section-body li{

  margin:1px 0 2px;

  line-height:1.48;

  break-inside:avoid;

}


#paper .item-head{

  font-weight:700;

  margin:4px 0 2px;

  line-height:1.4;

  break-after:avoid;

}


/* =========================================================
   TECH
========================================================= */

#paper.tech{

  border-top:
    5px solid
    var(--resume-accent);

}


#paper.tech .section-title{

  border-bottom-width:
    1.5px;

}


/* =========================================================
   BLUE
========================================================= */

#paper.blue{

  border-top:
    5px solid
    var(--resume-accent);

}


#paper.blue .name{

  color:
    var(--resume-accent);

}


#paper.blue .section-title{

  border-bottom-width:2px;

}


/* =========================================================
   MINIMAL
========================================================= */

#paper.minimal{

  padding:
    48px 60px;

}


#paper.minimal .name{

  font-size:29px;

  font-weight:700;

}


#paper.minimal .section-title{

  border-bottom:0;

  padding-bottom:2px;

  letter-spacing:.12em;

}


#paper.minimal .contact{

  padding-bottom:12px;

  border-bottom:
    1px solid #ddd;

}


/* =========================================================
   TERMINAL
========================================================= */

#paper.terminal{

  font-family:
    "SFMono-Regular",
    Consolas,
    "Liberation Mono",
    "PingFang SC",
    monospace;

}


#paper.terminal .name{

  font-size:27px;

  color:
    var(--resume-accent);

}


#paper.terminal .section-title{

  display:inline-block;

  background:
    var(--resume-accent);

  color:#fff;

  border:0;

  padding:4px 8px;

  letter-spacing:.02em;

}


/* =========================================================
   GRAY BLUE
========================================================= */

#paper.grayblue{

  border-top:
    4px solid
    var(--resume-accent);

}


#paper.grayblue .name{

  color:#253746;

}


#paper.grayblue .section-title{

  color:
    var(--resume-accent);

  border-bottom-color:
    #9aa9b5;

}


/* =========================================================
   STRIPE
========================================================= */

#paper.stripe{

  border-left:
    8px solid
    var(--resume-accent);

  padding-left:52px;

}


/* =========================================================
   BUSINESS
========================================================= */

#paper.business .name{

  font-weight:700;

}


#paper.business .section-title{

  font-size:12px;

  letter-spacing:.15em;

  border-bottom-width:2px;

}


/* =========================================================
   PHOTO TEMPLATE
========================================================= */

#paper.photo{

  border-top:
    5px solid
    var(--resume-accent);

}


#paper.photo .resume-photo{

  width:98px;

  height:130px;

}


#paper.photo .name{

  color:
    var(--resume-accent);

}


/* =========================================================
   ONE PAGE
========================================================= */

#paper.page-one{

  min-height:1123px;

  padding-top:39px;

  padding-bottom:32px;

  font-size:
    var(--resume-font-size,13px);

}


#paper.page-one .paper-header{

  margin-bottom:11px;

}


#paper.page-one .name{

  font-size:28px;

}


#paper.page-one .section{

  margin-top:10px;

}


#paper.page-one .section-title{

  margin-bottom:5px;

}


#paper.page-one .section-body p{

  margin:1px 0 3px;

}


#paper.page-one .section-body ul{

  margin:2px 0 4px;

}


#paper.page-one .section-body li{

  line-height:1.39;

  margin:1px 0 1px;

}


/* =========================================================
   TWO PAGE
========================================================= */

#paper.page-two{

  min-height:2246px;

}


#paper.page-two .section{

  margin-top:18px;

}


/* =========================================================
   TEMPLATE THUMB
========================================================= */

#templates{

  grid-template-columns:
    1fr 1fr;

}


#templates button{

  min-height:76px;

  display:flex;

  flex-direction:column;

  justify-content:center;

  align-items:center;

  gap:4px;

  padding:5px;

}


.template-thumb{

  display:block;

  position:relative;

  width:54px;

  height:62px;

  padding:6px 5px;

  background:#fff;

  border:
    1px solid #d7dce1;

  box-shadow:
    0 2px 5px rgba(0,0,0,.08);

}


.template-thumb .mini-name{

  display:block;

  width:22px;

  height:5px;

  background:#222;

  margin-bottom:5px;

}


.template-thumb .mini-line{

  display:block;

  width:100%;

  height:2px;

  background:#d5dade;

  margin:3px 0;

}


.template-thumb .mini-line.short{

  width:65%;

}


.template-thumb .mini-section{

  display:block;

  width:100%;

  height:3px;

  background:#2672a9;

  margin:5px 0 3px;

}


.template-thumb-tech{

  border-top:
    4px solid #222;

}


.template-thumb-blue{

  border-top:
    4px solid #2672a9;

}


.template-thumb-minimal{

  border:0;

}


.template-thumb-terminal{

  background:#20262c;

  border-color:#20262c;

}


.template-thumb-terminal
.mini-name,

.template-thumb-terminal
.mini-section{

  background:#75c7ff;

}


.template-thumb-terminal
.mini-line{

  background:#65717b;

}


.template-thumb-grayblue{

  border-top:
    4px solid #687b8c;

}


.template-thumb-stripe{

  border-left:
    5px solid #2672a9;

}


.template-thumb-business{

  border-top:
    3px solid #333;

}


.template-thumb-photo{

  border-top:
    4px solid #2672a9;

}


.template-thumb-photo:after{

  content:"";

  position:absolute;

  top:6px;

  right:4px;

  width:12px;

  height:17px;

  background:#eee;

  border:1px solid #aaa;

}


.template-label{

  font-size:11px;

  line-height:1.1;

}


#templates button.active{

  background:#f5f9fd;

  border-color:
    var(--resume-accent);

  color:
    var(--resume-accent);

}


/* =========================================================
   THEME
========================================================= */

#themes{

  grid-template-columns:
    1fr 1fr;

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

  background:
    var(--theme-color,#222);

  margin-right:5px;

}


#themes button.active{

  outline:
    2px solid
    var(--theme-color,#1677ff);

  outline-offset:1px;

}


/* =========================================================
   PRINT
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

    padding:
      13mm 15mm !important;

    margin:0 !important;

    box-shadow:none !important;

    transform:none !important;

    font-size:10.5pt !important;

  }


  #paper.page-two{

    min-height:594mm !important;

  }

}


`;


document.head.appendChild(
  style
);


/* =========================================================
   初始化
========================================================= */

load();

normalizeState();

syncControls();

createTemplatePreview();

updatePhotoUI();

save();

render();


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
          "./sw.js?v=1.2.2"
        )
        .then(reg => {

          reg.update();

          console.log(
            "ResumeFlow V1.2.2 Service Worker ready"
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
  `ResumeFlow V${VERSION} ready`
);

})();