/* =========================================================
   ResumeFlow V1.2
   修正版：与 index.html 实际 ID 完全匹配
========================================================= */

const VERSION = "1.2";

const STORAGE_RESUME = "resumeflow-resume-v12";
const STORAGE_STATE = "resumeflow-state-v12";
const STORAGE_PHOTO = "resumeflow-photo-v12";


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
  theme: "black",
  pageMode: "one",
  showPhoto: true,
  font: "system",
  fontSize: 13,
  zoom: 0.8
};


/* =========================================================
   Theme
========================================================= */

const THEME_COLORS = {
  black: "#222222",
  blue: "#17365D",
  cyan: "#1677FF",
  green: "#216E5B",
  gray: "#555B66",
  wine: "#7A3030"
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
   Utils
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
   JSON
========================================================= */

function tryJSON(text) {

  try {

    const data = JSON.parse(text);

    if (
      data &&
      typeof data === "object"
    ) {
      return data;
    }

  } catch (e) {
    return null;
  }

  return null;
}


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

    const value = data[key];


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

          const title =
            item.title ||
            item.name ||
            item.company ||
            item.school ||
            "";

          if (title) {

            section.items.push({
              type: "subheading",
              text: title
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

    } else if (
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
   Markdown
========================================================= */

function parseMarkdown(text) {

  const lines =
    cleanText(text).split("\n");

  const result = {
    name: "",
    title: "",
    contact: "",
    sections: []
  };

  let current = null;


  lines.forEach(raw => {

    const line =
      raw.trim();

    if (!line) return;


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


      /* # 姓名 */

      if (
        level === 1 &&
        !result.name
      ) {

        result.name = title;
        return;
      }


      const sectionType =
        findSectionType(title);


      /* ## 工作经历 */

      if (sectionType) {

        current = {
          type: sectionType,
          title: title,
          items: []
        };

        result.sections.push(
          current
        );

        return;
      }


      /* ### 公司 / 项目 */

      if (
        current &&
        level >= 3
      ) {

        current.items.push({
          type: "subheading",
          text: title
        });

        return;
      }

    }


    const plain =
      stripMarkdown(line);


    /* 姓名下面第一行 */

    if (
      result.name &&
      !result.title &&
      !current
    ) {

      result.title = plain;
      return;
    }


    /* 职位下面第二行 */

    if (
      result.title &&
      !result.contact &&
      !current
    ) {

      result.contact = plain;
      return;
    }


    if (!current) return;


    if (
      /^[-*+]\s+/.test(line)
    ) {

      current.items.push({
        type: "bullet",
        text: stripMarkdown(
          line.replace(
            /^[-*+]\s+/,
            ""
          )
        )
      });

    } else {

      current.items.push({
        type: "text",
        text: plain
      });

    }

  });


  return result;
}


/* =========================================================
   Parser
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
    tryJSON(text);


  if (json) {

    return normalizeJSON(json);

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


  let html = "";


  section.items.forEach(item => {

    const text =
      escapeHTML(item.text);


    if (!text) return;


    if (
      item.type === "subheading"
    ) {

      html += `
        <h3>
          ${text}
        </h3>
      `;

      return;
    }


    if (
      item.type === "bullet"
    ) {

      html += `
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


  const hasBullet =
    section.items.some(
      item =>
        item.type === "bullet"
    );


  return `
    <section
      class="resume-section section-${section.type}"
    >

      <h2>
        ${escapeHTML(section.title)}
      </h2>

      ${
        hasBullet
          ? `<ul>${html}</ul>`
          : html
      }

    </section>
  `;
}


/* =========================================================
   Render Resume
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


  const sectionsHTML =
    data.sections
      .map(renderSection)
      .join("");


  paper.innerHTML = `

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
            ${escapeHTML(
              data.name || "姓名"
            )}
          </div>

          ${
            data.title
              ? `
                <div class="resume-title">
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
                <div class="resume-contact">
                  ${escapeHTML(
                    data.contact
                  )}
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

  updatePhotoUI();
}


/* =========================================================
   Font
========================================================= */

function applyFont() {

  const resume =
    document.querySelector(
      ".resume-paper"
    );

  if (!resume) return;


  const fonts = {

    pingfang:
      '"PingFang SC","Microsoft YaHei",sans-serif',

    yahei:
      '"Microsoft YaHei","PingFang SC",sans-serif',

    system:
      '-apple-system,BlinkMacSystemFont,"Segoe UI","Microsoft YaHei",sans-serif'

  };


  resume.style.fontFamily =
    fonts[state.font] ||
    fonts.system;
}


/* =========================================================
   Zoom
========================================================= */

function applyZoom() {

  if (!paper) return;

  paper.style.setProperty(
    "--preview-zoom",
    state.zoom
  );


  if (zoomVal) {

    zoomVal.textContent =
      Math.round(
        state.zoom * 100
      ) + "%";

  }
}


/* =========================================================
   Save State
========================================================= */

function saveState() {

  localStorage.setItem(
    STORAGE_STATE,
    JSON.stringify(state)
  );


  localStorage.setItem(
    STORAGE_RESUME,
    source.value
  );
}


/* =========================================================
   Load State
========================================================= */

function loadState() {

  try {

    const saved =
      localStorage.getItem(
        STORAGE_STATE
      );

    if (saved) {

      state = {
        ...state,
        ...JSON.parse(saved)
      };

    }

  } catch (e) {
    console.warn(
      "状态恢复失败",
      e
    );
  }


  const savedResume =
    localStorage.getItem(
      STORAGE_RESUME
    );


  if (
    savedResume &&
    source
  ) {

    source.value =
      savedResume;

  } else if (source) {

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
      Math.round(
        state.zoom * 100
      ) + "%";
  }


  document
    .querySelectorAll(
      "[data-t]"
    )
    .forEach(btn => {

      btn.classList.toggle(
        "active",
        btn.dataset.t ===
          state.template
      );

    });


  document
    .querySelectorAll(
      "[data-theme]"
    )
    .forEach(btn => {

      btn.classList.toggle(
        "active",
        btn.dataset.theme ===
          state.theme
      );

    });

}


/* =========================================================
   Textarea
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
   生成预览
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
   加载示例
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
   清空
========================================================= */

if (clearBtn) {

  clearBtn.addEventListener(
    "click",
    () => {

      source.value = "";

      localStorage.removeItem(
        STORAGE_RESUME
      );

      renderResume();

    }
  );

}


/* =========================================================
   导出 PDF
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
   文件选择
========================================================= */

if (fileBtn && fileInput) {

  fileBtn.addEventListener(
    "click",
    () => {

      fileInput.click();

    }
  );


  fileInput.addEventListener(
    "change",
    event => {

      const file =
        event.target.files?.[0];

      importFile(file);

    }
  );

}


/* =========================================================
   文件导入
========================================================= */

async function importFile(file) {

  if (!file) return;


  const filename =
    file.name.toLowerCase();


  const supported =
    filename.endsWith(".md") ||
    filename.endsWith(".txt") ||
    filename.endsWith(".json");


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

    saveState();
    renderResume();

  } catch (error) {

    console.error(error);

    alert(
      "文件读取失败。"
    );

  }

}


/* =========================================================
   拖拽导入
========================================================= */

if (dropZone) {

  dropZone.addEventListener(
    "dragover",
    event => {

      event.preventDefault();

      dropZone.classList.add(
        "dragover"
      );

    }
  );


  dropZone.addEventListener(
    "dragleave",
    () => {

      dropZone.classList.remove(
        "dragover"
      );

    }
  );


  dropZone.addEventListener(
    "drop",
    event => {

      event.preventDefault();

      dropZone.classList.remove(
        "dragover"
      );

      const file =
        event.dataTransfer
          .files?.[0];

      importFile(file);

    }
  );

}


/* =========================================================
   证件照
========================================================= */

if (photoBtn && photoFile) {

  photoBtn.addEventListener(
    "click",
    () => {

      photoFile.click();

    }
  );


  photoFile.addEventListener(
    "change",
    event => {

      const file =
        event.target.files?.[0];

      if (!file) return;


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


      reader.onload =
        event => {

          localStorage.setItem(
            STORAGE_PHOTO,
            event.target.result
          );

          updatePhotoUI();
          renderResume();

        };


      reader.readAsDataURL(file);

    }
  );

}


/* =========================================================
   证件照 UI
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

    } else {

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
   删除证件照
========================================================= */

if (removePhotoBtn) {

  removePhotoBtn.addEventListener(
    "click",
    () => {

      localStorage.removeItem(
        STORAGE_PHOTO
      );

      updatePhotoUI();
      renderResume();

    }
  );

}


/* =========================================================
   模板
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


      syncControls();
      saveState();
      renderResume();

    }
  );

}


/* =========================================================
   主题色
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


      state.theme =
        button.dataset.theme;


      syncControls();
      saveState();
      renderResume();

    }
  );

}


/* =========================================================
   分页
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
   证件照显示/隐藏
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
   字体
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
   正文字号
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
   预览缩放
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
          "./sw.js?v=1.2"
        )
        .then(registration => {

          registration.update();

          console.log(
            "ResumeFlow Service Worker ready"
          );

        })
        .catch(error => {

          console.warn(
            "Service Worker:",
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

updatePhotoUI();

renderResume();


console.log(
  `ResumeFlow V${VERSION} initialized`
);