/* =========================================================
   ResumeFlow V1.2.4
   ---------------------------------------------------------
   完整版 app.js

   本版本：
   1. 修复公司 / 项目标题与对应内容错位
   2. 正文字号支持 10 ~ 18px
   3. PDF 使用当前选择字号，不再强制 10.5pt
   4. 保留 MD / TXT / JSON
   5. 保留证件照
   6. 保留模板 / 主题 / 分页 / 字体 / 缩放
   7. 保留 localStorage
   8. 保留 Safari / iOS / PWA
========================================================= */

(() => {
  "use strict";

  const VERSION = "1.2.4";

  /* =======================================================
     DOM
  ======================================================= */

  const $ = id => document.getElementById(id);

  const source = $("source");
  const paper = $("paper");

  const demoBtn = $("demoBtn");
  const pdfBtn = $("pdfBtn");

  const fileInput = $("file");
  const fileBtn = $("fileBtn");
  const dropZone = $("drop");

  const photoFile = $("photoFile");
  const photoBtn = $("photoBtn");
  const removePhotoBtn = $("removePhotoBtn");
  const photoPreview = $("photoPreview");

  const renderBtn = $("renderBtn");
  const clearBtn = $("clearBtn");

  const templates = $("templates");
  const themes = $("themes");
  const pages = $("pages");
  const photoMode = $("photoMode");
  const font = $("font");
  const size = $("size");
  const sizeVal = $("sizeVal");
  const zoom = $("zoom");
  const zoomVal = $("zoomVal");

  /* =======================================================
     STORAGE
  ======================================================= */

  const STORAGE = {
    resume: "resumeflow-resume-v124",
    state: "resumeflow-state-v124",
    photo: "resumeflow-photo-v124"
  };

  /* =======================================================
     DEFAULT STATE
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

  /* =======================================================
     THEME
  ======================================================= */

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

  /* =======================================================
     TEMPLATES
  ======================================================= */

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

  /* =======================================================
     SECTION ALIASES
  ======================================================= */

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

  /* =======================================================
     DEMO
  ======================================================= */

  const DEMO_MD = `# 李思杏

ADAS软件工程师

成都 | C / C++ / Linux / MATLAB | 4年智能驾驶软件开发经验

## 个人优势

- 4年汽车电子及ADAS软件开发经验，覆盖L2 ACC及TSR功能。
- 熟悉需求分析、软件设计、编码、联调、测试、标定和问题闭环。
- 熟悉C、AUTOSAR Classic、SWC/RTE、CAN、CANoe/CANape及DBC。
- 具备车载ECU应用层软件开发经验。
- 具备CAN数据分析、MATLAB脚本开发及实车问题定位经验。

## 核心技能

- 语言：C（熟悉）｜C++基础
- 汽车软件：AUTOSAR Classic｜SWC/RTE｜嵌入式软件｜ADAS
- 智能驾驶：ACC｜TSR｜L2 ADAS｜纵向控制
- 通信调试：CAN｜DBC｜CANoe｜CANalyzer｜CANape
- 数据分析：MATLAB｜MATLAB Script
- 开发环境：Linux｜GCC｜Git｜CMake

## 工作经历

### 深圳安智杰科技有限公司成都分公司

**软件工程师｜2022.02 – 2025.08**

- 参与主机厂L2智能驾驶项目开发，负责ACC应用层软件、功能状态机及纵向控制相关模块。
- 参与需求分析、软件设计、编码实现、系统联调、实车测试和量产问题闭环。
- 负责ACC调试监测数据外发，完成监测变量缩放、偏移、编码及调试DBC维护。
- 基于CANoe完成车辆及ADAS信号采集、解析和分析。
- 使用CANape进行在线标定并保存MF4数据，结合MATLAB分析期望加速度、实际加速度、控制请求及车辆响应。
- 早期FCW开发阶段基于C++、Qt开发前视摄像头网口采数上位机。

### 源泰感科技（苏州）有限公司

**ADAS软件工程师｜2025.09 – 2026.06**

- 独立负责轻型商用车L2 ACC、TSR应用层软件开发。
- 覆盖需求理解、软件实现、SWC/RTE集成、联调、标定、测试及版本发布前问题闭环。
- 基于AUTOSAR Classic进行应用层SWC开发及RTE接口数据交互。
- 负责ACC状态机及纵向控制相关功能调试。
- 使用CANape、i-Jet、MF4、MATLAB开展测量、标定、数据采集、波形分析和问题验证。
- 针对弯道限速功能，分析车道线半径输入抖动，采用滑动窗口及抑制滤波优化弯道半径处理逻辑。

## 项目经历

### 轻型商用车 L2 ACC 与 TSR 项目

**2025.09 – 2026.06**

- 独立负责ACC、TSR应用层软件开发及集成。
- 梳理ACC纵向控制链路，围绕期望加速度、实际加速度、前馈扭矩、反馈扭矩、总扭矩请求及车辆实际响应开展数据分析。
- 分析再生制动、XBR以及MIX、TORQUE、ACCEL控制模式。
- 针对跟停顿挫、起步顿挫、跟停后溜等问题开展定位、修改和验证。
- 分析目标切入场景中的目标ID、目标距离、相对运动及TTC信息。
- 针对ACC控制误抑制、静止状态激活不可用、Resume设定速度异常等边界场景进行问题分析和验证。
- 针对弯道限速处理车道线半径输入，采用滑动窗口及抑制滤波。
- 使用CANape、i-Jet、MF4、MATLAB完成实车数据采集、波形分析、问题复现、修改验证和回归检查。

### 乘用车 L2 ACC 量产项目

**2022.02 – 2025.08**

- 参与ACC应用层及代码框架开发，覆盖定速巡航、稳态跟车、Cut-in/Cut-out、弯道限速、Stop&Go等功能。
- 参与PreScan、CarSim、MATLAB仿真分析及实车调试。
- 完成ACC调试监测变量外发、变量缩放、偏移、编码及DBC维护。
- 基于CANoe采集车辆状态、ADAS状态和控制相关信号。
- 使用CANape进行在线标定和MF4数据采集。
- 结合MATLAB分析控制请求、期望加速度、实际加速度、响应时间和执行结果。
- 参与量产版本测试、问题定位、参数标定及修改验证。

### 车载前视摄像头 FCW 数据采集上位机

**2021.07 – 2022.01**

- 基于C++、Qt开发前视摄像头网口采数上位机。
- 完成网口通信、数据接收、数据解析、实时显示、数据存储及回放功能。
- 对采集链路中的数据异常进行调试和验证。

## 典型技术实践

- ACC控制数据分析：围绕控制状态、期望加速度、实际加速度、扭矩请求、车辆响应等信号开展波形分析。
- 制动控制分析：分析负扭矩、XBR、MIX、TORQUE等控制模式及其切换过程。
- 数据闭环：CANoe采集 → MF4保存 → MATLAB分析 → 根因定位 → 标定或代码修改 → 重复测试。
- 软件工程：具备C/C++、AUTOSAR Classic、SWC/RTE、CAN、DBC、CANoe、CANape、MATLAB、Git等车载软件开发和调试经验。

## 教育背景

### 四川师范大学

**计算机科学与技术｜本科｜2017.09 – 2021.06**
`;

  /* =======================================================
     STRING HELPERS
  ======================================================= */

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

  /* =======================================================
     MARKDOWN PARSER
  ======================================================= */

  function parseMarkdown(text) {

    const lines = clean(text).split("\n");

    const result = {
      name: "",
      title: "",
      contact: "",
      sections: []
    };

    let current = null;

    for (const rawLine of lines) {

      const line = rawLine.trim();

      if (!line) {
        continue;
      }

      const heading = line.match(/^(#{1,6})\s+(.+)$/);

      if (heading) {

        const level = heading[1].length;
        const title = stripMD(heading[2]);

        /* 一级标题 = 姓名 */

        if (level === 1 && !result.name) {

          result.name = title;

          continue;
        }

        /* 二级标题 = 简历大章节 */

        const type = sectionType(title);

        if (type) {

          current = {
            type: type,
            title: title,
            items: []
          };

          result.sections.push(current);

          continue;
        }

        /* 三级标题及以下 = 公司 / 项目 */

        if (current && level >= 3) {

          current.items.push({
            type: "subheading",
            text: title
          });

          continue;
        }
      }

      const plain = stripMD(line);

      /* 姓名后的第一行 = 职位 */

      if (!current && result.name && !result.title) {

        result.title = plain;

        continue;
      }

      /* 职位后的第二行 = 联系方式 */

      if (!current && result.title && !result.contact) {

        result.contact = plain;

        continue;
      }

      if (!current) {
        continue;
      }

      /* Bullet */

      if (/^[-*+]\s+/.test(line)) {

        current.items.push({
          type: "bullet",
          text: stripMD(
            line.replace(/^[-*+]\s+/, "")
          )
        });

      } else {

        current.items.push({
          type: "text",
          text: plain
        });
      }
    }

    return result;
  }

  /* =======================================================
     JSON PARSER
  ======================================================= */

  function parseJSON(text) {

    try {

      const data = JSON.parse(text);

      if (!data || typeof data !== "object") {
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

        if (!data[key]) {
          return;
        }

        const section = {
          type: key,
          title: SECTION_ALIASES[key][0],
          items: []
        };

        const value = data[key];

        if (Array.isArray(value)) {

          value.forEach(item => {

            if (typeof item === "string") {

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

              if (Array.isArray(item.bullets)) {

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

        } else if (typeof value === "string") {

          section.items.push({
            type: "text",
            text: value
          });
        }

        result.sections.push(section);
      });

      return result;

    } catch (error) {

      return null;
    }
  }

  /* =======================================================
     RESUME PARSER
  ======================================================= */

  function parseResume(text) {

    text = clean(text);

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
      return json;
    }

    return parseMarkdown(text);
  }

  /* =======================================================
     RENDER HEADER
  ======================================================= */

  function renderHeader(data) {

    const photo =
      localStorage.getItem(STORAGE.photo);

    let photoHTML = "";

    if (
      state.showPhoto &&
      photo
    ) {

      photoHTML = `
        <div class="resume-photo">
          <img
            src="${photo}"
            alt="证件照"
          >
        </div>
      `;
    }

    return `
      <header class="paper-header">

        <div class="identity">

          <div class="name">
            ${escapeHTML(
              data.name || "姓名"
            )}
          </div>

          <div class="title">
            ${escapeHTML(
              data.title || ""
            )}
          </div>

          <div class="contact">
            ${escapeHTML(
              data.contact || ""
            )}
          </div>

        </div>

        ${photoHTML}

      </header>
    `;
  }

  /* =======================================================
     SECTION RENDER
     
     关键修复：
     
     ### 公司A
     日期
     - A
     - A

     ### 公司B
     日期
     - B
     - B

     不再把所有标题集中输出，
     再把所有 bullet 集中输出。
  ======================================================= */

  function renderSection(section) {

    if (
      !section.items ||
      !section.items.length
    ) {
      return "";
    }

    let bodyHTML = "";

    let bulletHTML = "";

    let hasBullet = false;

    function flushBullets() {

      if (!hasBullet) {
        return;
      }

      bodyHTML += `
        <ul>
          ${bulletHTML}
        </ul>
      `;

      bulletHTML = "";

      hasBullet = false;
    }

    section.items.forEach(item => {

      const text =
        escapeHTML(
          item.text || ""
        );

      if (!text) {
        return;
      }

      /* 公司 / 项目标题 */

      if (
        item.type === "subheading"
      ) {

        flushBullets();

        bodyHTML += `
          <div class="item-head">
            ${text}
          </div>
        `;

        return;
      }

      /* 普通文本 */

      if (
        item.type === "text"
      ) {

        flushBullets();

        bodyHTML += `
          <p>
            ${text}
          </p>
        `;

        return;
      }

      /* Bullet */

      if (
        item.type === "bullet"
      ) {

        hasBullet = true;

        bulletHTML += `
          <li>
            ${text}
          </li>
        `;
      }
    });

    flushBullets();

    return `
      <section
        class="section section-${escapeHTML(
          section.type
        )}"
      >

        <div class="section-title">
          ${escapeHTML(
            section.title
          )}
        </div>

        <div class="section-body">
          ${bodyHTML}
        </div>

      </section>
    `;
  }

  /* =======================================================
     RENDER RESUME
  ======================================================= */

  function render() {

    if (!paper) {
      return;
    }

    const data =
      parseResume(
        source ? source.value : ""
      );

    const theme =
      THEMES[state.theme] ||
      THEMES.blue;

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

    paper.style.setProperty(
      "--resume-zoom",
      state.zoom
    );

    paper.innerHTML =
      renderHeader(data) +
      data.sections
        .map(renderSection)
        .join("");

    applyFont();

    paper.style.transform =
      `scale(${state.zoom})`;

    updateScaleSpace();
  }

  /* =======================================================
     FONT
  ======================================================= */

  function applyFont() {

    if (!paper) {
      return;
    }

    const fonts = {

      pingfang: `
        -apple-system,
        BlinkMacSystemFont,
        "PingFang SC",
        "Microsoft YaHei",
        sans-serif
      `,

      yahei: `
        "Microsoft YaHei",
        "PingFang SC",
        sans-serif
      `,

      system: `
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "PingFang SC",
        sans-serif
      `
    };

    paper.style.fontFamily =
      fonts[state.font] ||
      fonts.pingfang;
  }

  /* =======================================================
     PREVIEW SCALE SPACE
  ======================================================= */

  function updateScaleSpace() {

    if (!paper) {
      return;
    }

    const zoomValue =
      Number(state.zoom) || 0.8;

    const height =
      paper.offsetHeight ||
      1123;

    paper.style.marginBottom =
      `${-(height * (1 - zoomValue))}px`;
  }

  /* =======================================================
     STATE NORMALIZATION
  ======================================================= */

  function normalizeState() {

    if (
      !TEMPLATE_LIST.includes(
        state.template
      )
    ) {
      state.template = "tech";
    }

    if (
      !THEMES[state.theme]
    ) {
      state.theme = "blue";
    }

    if (
      !["auto", "one", "two"]
        .includes(state.pageMode)
    ) {
      state.pageMode = "auto";
    }

    if (
      !["pingfang", "yahei", "system"]
        .includes(state.font)
    ) {
      state.font = "pingfang";
    }

    let fs =
      Number(state.fontSize);

    if (
      !Number.isFinite(fs)
    ) {
      fs = 13;
    }

    fs =
      Math.max(
        10,
        Math.min(
          18,
          fs
        )
      );

    state.fontSize = fs;

    let z =
      Number(state.zoom);

    if (
      !Number.isFinite(z)
    ) {
      z = 0.8;
    }

    z =
      Math.max(
        0.55,
        Math.min(
          1,
          z
        )
      );

    state.zoom = z;

    state.showPhoto =
      state.showPhoto !== false;
  }

  /* =======================================================
     SAVE
  ======================================================= */

  function save() {

    try {

      localStorage.setItem(
        STORAGE.resume,
        source
          ? source.value
          : ""
      );

      localStorage.setItem(
        STORAGE.state,
        JSON.stringify(state)
      );

      const saveState =
        $("saveState");

      if (saveState) {

        saveState.textContent =
          "已自动保存";
      }

    } catch (error) {

      console.warn(
        "ResumeFlow save error:",
        error
      );
    }
  }

  /* =======================================================
     LOAD
  ======================================================= */

  function load() {

    try {

      const savedResume =
        localStorage.getItem(
          STORAGE.resume
        );

      if (
        savedResume &&
        source
      ) {
        source.value =
          savedResume;
      }

      const savedState =
        localStorage.getItem(
          STORAGE.state
        );

      if (savedState) {

        const parsed =
          JSON.parse(
            savedState
          );

        if (
          parsed &&
          typeof parsed === "object"
        ) {

          state = {
            ...DEFAULT_STATE,
            ...parsed
          };
        }
      }

    } catch (error) {

      console.warn(
        "ResumeFlow load error:",
        error
      );

      state = {
        ...DEFAULT_STATE
      };
    }
  }

  /* =======================================================
     CONTROLS
  ======================================================= */

  function syncControls() {

    /* 模板 */

    if (templates) {

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

    /* 主题 */

    if (themes) {

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
        });
    }

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

      /*
       * 关键修改：
       * 最大字号从 15 改成 18
       */

      size.min = "10";
      size.max = "18";
      size.step = "0.5";

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
  }

  /* =======================================================
     TEMPLATE PREVIEW
  ======================================================= */

  function createTemplatePreview() {

    if (!templates) {
      return;
    }

    templates
      .querySelectorAll(
        "[data-t]"
      )
      .forEach(button => {

        if (
          button.querySelector(
            ".template-thumb"
          )
        ) {
          return;
        }

        const type =
          button.dataset.t;

        const label =
          button.textContent.trim();

        button.innerHTML = `
          <span
            class="template-thumb template-thumb-${type}"
          >
            <span class="mini-name"></span>
            <span class="mini-line"></span>
            <span class="mini-section"></span>
            <span class="mini-line"></span>
            <span class="mini-line short"></span>
            <span class="mini-section"></span>
            <span class="mini-line"></span>
          </span>

          <span class="template-label">
            ${escapeHTML(label)}
          </span>
        `;
      });
  }

  /* =======================================================
     PHOTO UI
  ======================================================= */

  function updatePhotoUI() {

    if (!photoPreview) {
      return;
    }

    const photo =
      localStorage.getItem(
        STORAGE.photo
      );

    if (photo) {

      photoPreview.innerHTML = `
        <img
          src="${photo}"
          alt="证件照"
        />
      `;

    } else {

      photoPreview.innerHTML =
        "<span>证件照</span>";
    }

    if (removePhotoBtn) {

      removePhotoBtn.disabled =
        !photo;
    }
  }

  /* =======================================================
     PHOTO UPLOAD
  ======================================================= */

  function handlePhoto(file) {

    if (!file) {
      return;
    }

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp"
      ].includes(file.type)
    ) {

      alert(
        "请选择 JPG、PNG 或 WebP 图片。"
      );

      return;
    }

    const reader =
      new FileReader();

    reader.onload = event => {

      const result =
        event.target.result;

      try {

        localStorage.setItem(
          STORAGE.photo,
          result
        );

        updatePhotoUI();

        render();

      } catch (error) {

        alert(
          "照片保存失败，可能是图片过大。"
        );
      }
    };

    reader.readAsDataURL(file);
  }

  /* =======================================================
     FILE IMPORT
  ======================================================= */

  function handleResumeFile(file) {

    if (!file) {
      return;
    }

    const reader =
      new FileReader();

    reader.onload = event => {

      source.value =
        event.target.result || "";

      save();

      render();
    };

    reader.readAsText(
      file,
      "UTF-8"
    );
  }

  /* =======================================================
     EVENT：TEMPLATE
  ======================================================= */

  if (templates) {

    templates.addEventListener(
      "click",
      event => {

        const button =
          event.target.closest(
            "[data-t]"
          );

        if (!button) {
          return;
        }

        state.template =
          button.dataset.t;

        syncControls();

        save();

        render();
      }
    );
  }

  /* =======================================================
     EVENT：THEME
  ======================================================= */

  if (themes) {

    themes.addEventListener(
      "click",
      event => {

        const button =
          event.target.closest(
            "[data-theme]"
          );

        if (!button) {
          return;
        }

        state.theme =
          button.dataset.theme;

        syncControls();

        save();

        render();
      }
    );
  }

  /* =======================================================
     EVENT：PAGE MODE
  ======================================================= */

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

  /* =======================================================
     EVENT：PHOTO MODE
  ======================================================= */

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

  /* =======================================================
     EVENT：FONT
  ======================================================= */

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

  /* =======================================================
     EVENT：FONT SIZE
  ======================================================= */

  if (size) {

    /*
     * 强制确保旧 HTML 中
     * max="15" 也会升级成 18
     */

    size.min = "10";
    size.max = "18";
    size.step = "0.5";

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

  /* =======================================================
     EVENT：ZOOM
  ======================================================= */

  if (zoom) {

    zoom.addEventListener(
      "input",
      () => {

        state.zoom =
          Number(zoom.value);

        if (zoomVal) {

          zoomVal.textContent =
            `${Math.round(
              state.zoom * 100
            )}%`;
        }

        save();

        render();
      }
    );
  }

  /* =======================================================
     EVENT：SOURCE INPUT
  ======================================================= */

  if (source) {

    source.addEventListener(
      "input",
      () => {

        save();

        render();
      }
    );
  }

  /* =======================================================
     EVENT：RENDER
  ======================================================= */

  if (renderBtn) {

    renderBtn.addEventListener(
      "click",
      () => {

        save();

        render();
      }
    );
  }

  /* =======================================================
     EVENT：CLEAR
  ======================================================= */

  if (clearBtn) {

    clearBtn.addEventListener(
      "click",
      () => {

        if (
          !confirm(
            "确定清空当前简历内容吗？"
          )
        ) {
          return;
        }

        source.value = "";

        save();

        render();
      }
    );
  }

  /* =======================================================
     EVENT：DEMO
  ======================================================= */

  if (demoBtn) {

    demoBtn.addEventListener(
      "click",
      () => {

        source.value =
          DEMO_MD;

        save();

        render();
      }
    );
  }

  /* =======================================================
     EVENT：FILE BUTTON
  ======================================================= */

  if (fileBtn && fileInput) {

    fileBtn.addEventListener(
      "click",
      () => {

        fileInput.click();
      }
    );

    fileInput.addEventListener(
      "change",
      () => {

        const file =
          fileInput.files &&
          fileInput.files[0];

        handleResumeFile(file);

        fileInput.value = "";
      }
    );
  }

  /* =======================================================
     EVENT：DRAG & DROP
  ======================================================= */

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

        const file =
          event.dataTransfer.files &&
          event.dataTransfer.files[0];

        handleResumeFile(file);
      }
    );
  }

  /* =======================================================
     EVENT：PHOTO
  ======================================================= */

  if (photoBtn && photoFile) {

    photoBtn.addEventListener(
      "click",
      () => {

        photoFile.click();
      }
    );

    photoFile.addEventListener(
      "change",
      () => {

        const file =
          photoFile.files &&
          photoFile.files[0];

        handlePhoto(file);

        photoFile.value = "";
      }
    );
  }

  /* =======================================================
     EVENT：REMOVE PHOTO
  ======================================================= */

  if (removePhotoBtn) {

    removePhotoBtn.addEventListener(
      "click",
      () => {

        localStorage.removeItem(
          STORAGE.photo
        );

        updatePhotoUI();

        render();
      }
    );
  }

  /* =======================================================
     PDF PRINT STYLE
     
     注意：
     Safari 的网址 / 日期 / 页码属于浏览器打印系统
     的 Headers & Footers。

     CSS 无法强制关闭 Safari 的这个选项。
     
     这里负责的是：
     - A4
     - 0 页边距
     - 隐藏网页 UI
     - 保留当前字号
     - 不强制 10.5pt
  ======================================================= */

  function installPrintStyle() {

    const old =
      document.getElementById(
        "resumeflow-print-v124"
      );

    if (old) {
      old.remove();
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "resumeflow-print-v124";

    style.textContent = `

      @media print {

        @page {
          size: A4;
          margin: 0;
        }

        html,
        body {
          width: 210mm;
          margin: 0 !important;
          padding: 0 !important;
          background: #fff !important;
        }

        .top,
        .left,
        .right {
          display: none !important;
        }

        .main {
          display: block !important;
          width: 210mm !important;
          min-height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .center {
          display: block !important;
          width: 210mm !important;
          padding: 0 !important;
          margin: 0 !important;
          overflow: visible !important;
        }

        #paper {

          width: 210mm !important;

          min-height: 297mm !important;

          margin: 0 !important;

          padding:
            13mm 15mm !important;

          box-shadow: none !important;

          transform: none !important;

          font-size:
            var(--resume-font-size, 13px) !important;

          line-height: 1.55 !important;

          box-sizing: border-box !important;
        }

        #paper.page-one {

          min-height: 297mm !important;

          font-size:
            var(--resume-font-size, 13px) !important;

          padding:
            11mm 15mm !important;
        }

        #paper.page-two {

          min-height: 594mm !important;

          font-size:
            var(--resume-font-size, 13px) !important;
        }

        #paper .section {

          break-inside: auto;

        }

        #paper .item-head {

          break-after: avoid;

          break-inside: avoid;

        }

        #paper li {

          break-inside: avoid;

        }

        #paper .section-title {

          break-after: avoid;

        }

        #paper .resume-photo {

          print-color-adjust: exact;

          -webkit-print-color-adjust:
            exact;
        }
      }

    `;

    document.head.appendChild(
      style
    );
  }

  /* =======================================================
     PDF BUTTON
  ======================================================= */

  if (pdfBtn) {

    pdfBtn.addEventListener(
      "click",
      () => {

        /*
         * 每次打印前重新安装，
         * 确保当前字号生效。
         */

        installPrintStyle();

        /*
         * 给浏览器一点时间应用 CSS
         */

        setTimeout(
          () => {

            window.print();

          },
          80
        );
      }
    );
  }

  /* =======================================================
     RESPONSIVE UPDATE
  ======================================================= */

  window.addEventListener(
    "resize",
    () => {

      updateScaleSpace();
    }
  );

  /* =======================================================
     INITIALIZE
  ======================================================= */

  load();

  normalizeState();

  /*
   * 关键：
   * 无论旧 index.html 中 max 是多少，
   * 页面启动时都强制改成 18。
   */

  if (size) {

    size.min = "10";
    size.max = "18";
    size.step = "0.5";
  }

  syncControls();

  createTemplatePreview();

  updatePhotoUI();

  save();

  /*
   * 如果当前没有简历内容，
   * 加载示例，方便首次打开。
   *
   * 如果已有 localStorage 内容，
   * 则绝不覆盖。
   */

  if (
    source &&
    !clean(source.value)
  ) {

    /*
     * 不自动加载示例。
     * 保持空白状态。
     */
  }

  installPrintStyle();

  render();

  /* =======================================================
     SERVICE WORKER
  ======================================================= */

  if (
    "serviceWorker" in navigator
  ) {

    window.addEventListener(
      "load",
      () => {

        navigator.serviceWorker
          .register(
            "./sw.js?v=1.2.4"
          )
          .then(reg => {

            reg.update();

            console.log(
              "ResumeFlow V1.2.4 Service Worker ready"
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