/* =========================================================
   ResumeFlow V1.3.7
   Based on V1.3.6 / commit:
   6b118e115089ef2477428452decff061fa822153

   保留当前 index.html 的全部 DOM ID：
   source
   paper
   demoBtn
   pdfBtn
   file
   fileBtn
   drop
   photoFile
   photoBtn
   removePhotoBtn
   photoPreview
   renderBtn
   clearBtn
   templates
   themes
   pages
   photoMode
   font
   size
   sizeVal
   zoom
   zoomVal

   主要修复：
   1. 保持原有 UI / DOM 接口
   2. 保持原有按钮事件
   3. 自动分页
   4. 工作经历 / 项目经历按完整 item 尽量分页
   5. 修复打印阶段 297mm + break-after 导致空白页的问题
   6. 打印使用 296mm + 后续页面 break-before
   7. Service Worker 更新至 1.3.7
========================================================= */

(() => {
  "use strict";

  const VERSION = "1.3.7";

  /* =======================================================
     DOM
  ======================================================= */

  const $ = id =>
    document.getElementById(id);

  const source =
    $("source");

  const paper =
    $("paper");

  const demoBtn =
    $("demoBtn");

  const pdfBtn =
    $("pdfBtn");

  const fileInput =
    $("file");

  const fileBtn =
    $("fileBtn");

  const dropZone =
    $("drop");

  const photoFile =
    $("photoFile");

  const photoBtn =
    $("photoBtn");

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


  /* =======================================================
     STORAGE
  ======================================================= */

  const STORAGE = {
    resume:
      "resumeflow-resume-v122",

    state:
      "resumeflow-state-v122",

    photo:
      "resumeflow-photo-v122"
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

  let photoData = "";


  /* =======================================================
     THEMES
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
     TEXT HELPERS
  ======================================================= */

  function clean(text) {

    return String(text || "")
      .replace(/\r/g, "")
      .replace(/\u00a0/g, " ")
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


  function inline(text) {

    let result =
      escapeHTML(text);

    result =
      result.replace(
        /\*\*(.+?)\*\*/g,
        "<strong>$1</strong>"
      );

    result =
      result.replace(
        /`(.+?)`/g,
        "<code>$1</code>"
      );

    return result;

  }


  function stripMD(text) {

    return String(text || "")
      .replace(/^#{1,6}\s*/, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/__(.*?)__/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .trim();

  }


  function normalizeHeading(text) {

    return stripMD(text)
      .replace(/[：:]/g, "")
      .trim()
      .toLowerCase();

  }


  /* =======================================================
     SECTION TYPE
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


  function sectionType(title) {

    const normalized =
      normalizeHeading(title);

    for (
      const [type, aliases]
      of Object.entries(
        SECTION_ALIASES
      )
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


  /* =======================================================
     PARSE RESUME
  ======================================================= */

  function parseResume(text) {

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
      let i = 0;
      i < lines.length;
      i++
    ) {

      const raw =
        lines[i];

      const line =
        raw.trim();

      if (!line) {
        continue;
      }


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


        /*
         * 一级标题默认作为姓名
         */
        if (
          level === 1 &&
          !result.name
        ) {

          result.name =
            title;

          continue;

        }


        /*
         * 第二行普通文本作为职位
         */
        if (
          level === 2 &&
          !result.title &&
          result.name
        ) {

          result.title =
            title;

          continue;

        }


        const type =
          sectionType(title);


        if (type) {

          current = {
            type,
            title,
            content: []
          };

          result.sections.push(
            current
          );

          continue;

        }


        /*
         * 三级标题：
         * 公司 / 项目 / 学校
         */
        if (
          current &&
          level >= 3
        ) {

          current.content.push({
            kind: "item",
            title,
            meta: "",
            lines: []
          });

          continue;

        }

      }


      /*
       * 没有进入 section 前：
       * 处理职位和联系方式
       */
      if (!current) {

        if (
          !result.title &&
          result.name
        ) {

          result.title =
            stripMD(line);

        } else if (
          result.name
        ) {

          if (
            result.contact
          ) {
            result.contact +=
              " | " +
              stripMD(line);
          } else {
            result.contact =
              stripMD(line);
          }

        }

        continue;

      }


      /*
       * 工作 / 项目 item
       */
      if (
        current.type ===
          "experience" ||
        current.type ===
          "projects" ||
        current.type ===
          "education"
      ) {

        const last =
          current.content[
            current.content.length - 1
          ];


        /*
         * **职位 | 日期**
         */
        const bold =
          line.match(
            /^\*\*(.*?)\*\*(?:\s*\|\s*(.*))?$/
          );


        if (
          bold &&
          last &&
          last.kind === "item"
        ) {

          last.meta =
            bold[2] || "";

          if (!last.meta) {
            last.meta =
              stripMD(
                bold[1]
              );
          }

          continue;

        }


        if (
          last &&
          last.kind === "item"
        ) {

          last.lines.push(
            raw
          );

        } else {

          current.content.push({
            kind: "text",
            lines: [raw]
          });

        }

        continue;

      }


      current.content.push({
        kind: "text",
        lines: [raw]
      });

    }


    return result;

  }


  /* =======================================================
     RENDER MARKDOWN BLOCK
  ======================================================= */

  function renderLines(lines) {

    let html = "";

    let list = [];


    function flushList() {

      if (!list.length) {
        return;
      }

      html +=
        "<ul>" +
        list.join("") +
        "</ul>";

      list = [];

    }


    for (
      const raw
      of lines
    ) {

      const line =
        String(raw)
          .trim();

      if (!line) {
        continue;
      }


      const bullet =
        line.match(
          /^[-*+]\s+(.+)$/
        );


      if (bullet) {

        list.push(
          "<li>" +
          inline(
            bullet[1]
          ) +
          "</li>"
        );

        continue;

      }


      flushList();


      const h =
        line.match(
          /^#{3,6}\s+(.+)$/
        );


      if (h) {

        html +=
          "<div class=\"item-head\">" +
          inline(h[1]) +
          "</div>";

        continue;

      }


      html +=
        "<p>" +
        inline(line) +
        "</p>";

    }


    flushList();

    return html;

  }


  /* =======================================================
     RENDER SECTION
  ======================================================= */

  function renderSection(
    section
  ) {

    let html = "";

    html +=
      `<section class="section section-${section.type}">`;

    html +=
      `<div class="section-title">${
        escapeHTML(section.title)
      }</div>`;

    html +=
      `<div class="section-body">`;


    /*
     * 工作经历 / 项目经历 / 教育
     */
    if (
      section.type ===
        "experience" ||
      section.type ===
        "projects" ||
      section.type ===
        "education"
    ) {

      for (
        const item
        of section.content
      ) {

        if (
          item.kind ===
          "item"
        ) {

          html +=
            `<div class="resume-item">`;

          html +=
            `<div class="item-head">`;

          html +=
            `<span class="item-title">${
              inline(item.title)
            }</span>`;


          if (
            item.meta
          ) {

            html +=
              `<span class="item-meta">${
                inline(item.meta)
              }</span>`;

          }


          html +=
            `</div>`;


          html +=
            renderLines(
              item.lines
            );

          html +=
            `</div>`;

        } else {

          html +=
            renderLines(
              item.lines || []
            );

        }

      }

    } else {

      for (
        const item
        of section.content
      ) {

        html +=
          renderLines(
            item.lines || []
          );

      }

    }


    html +=
      `</div>`;

    html +=
      `</section>`;

    return html;

  }


  /* =======================================================
     HEADER
  ======================================================= */

  function renderHeader(
    data
  ) {

    let photoHTML = "";


    if (
      state.showPhoto &&
      photoData
    ) {

      photoHTML =
        `<div class="resume-photo">
           <img
             src="${photoData}"
             alt="证件照"
           >
         </div>`;

    }


    return `
      <div class="paper-header">

        <div class="identity">

          <div class="name">
            ${escapeHTML(
              data.name || "姓名"
            )}
          </div>

          ${
            data.title
              ? `<div class="title">
                   ${inline(
                     data.title
                   )}
                 </div>`
              : ""
          }

          ${
            data.contact
              ? `<div class="contact">
                   ${inline(
                     data.contact
                   )}
                 </div>`
              : ""
          }

        </div>

        ${photoHTML}

      </div>
    `;

  }


  /* =======================================================
     CREATE PAGE
  ======================================================= */

  function createPage() {

    const page =
      document.createElement(
        "div"
      );

    page.className =
      `paper resume-page ${state.template}`;

    const theme =
      THEMES[state.theme] ||
      THEMES.blue;


    page.style.setProperty(
      "--accent",
      theme.main
    );

    page.style.setProperty(
      "--accent-soft",
      theme.light
    );


    page.style.setProperty(
      "--paper-w",
      "794px"
    );

    page.style.setProperty(
      "--paper-h",
      "1123px"
    );


    page.style.boxSizing =
      "border-box";

    page.style.width =
      "794px";

    page.style.height =
      "1123px";

    page.style.minHeight =
      "1123px";

    page.style.maxHeight =
      "1123px";

    page.style.position =
      "relative";

    page.style.overflow =
      "hidden";

    page.style.background =
      "#fff";


    return page;

  }


  /* =======================================================
     RENDER COMPLETE DOCUMENT
  ======================================================= */

  function buildInitialPage() {

    const data =
      parseResume(
        source.value
      );

    const page =
      createPage();

    page.innerHTML =
      renderHeader(data) +
      data.sections
        .map(
          renderSection
        )
        .join("");

    return page;

  }


  /* =======================================================
     APPLY FONT
  ======================================================= */

  function applyFont(
    container
  ) {

    let family =
      '-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif';


    if (
      state.font ===
      "yahei"
    ) {

      family =
        '"Microsoft YaHei",sans-serif';

    }


    if (
      state.font ===
      "system"
    ) {

      family =
        'system-ui,-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif';

    }


    container.style.fontFamily =
      family;

    container.style.fontSize =
      `${state.fontSize}px`;

  }


  /* =======================================================
     OVERFLOW
  ======================================================= */

  function overflow(
    page
  ) {

    return (
      page.scrollHeight >
      page.clientHeight + 1
    );

  }


  /* =======================================================
     COPY THEME
  ======================================================= */

  function applyPageTheme(
    page
  ) {

    const theme =
      THEMES[state.theme] ||
      THEMES.blue;


    page.style.setProperty(
      "--accent",
      theme.main
    );

    page.style.setProperty(
      "--accent-soft",
      theme.light
    );

    applyFont(
      page
    );

  }


  /* =======================================================
     PAGINATION
  ======================================================= */

  function paginateAuto(
    initialPage
  ) {

    const children =
      Array.from(
        initialPage.children
      );


    /*
     * 先建立一个页面
     */
    paper.innerHTML = "";

    paper.classList.add(
      "preview-stack"
    );


    let current =
      createPage();

    applyPageTheme(
      current
    );

    paper.appendChild(
      current
    );


    /*
     * 顶层节点：
     *
     * header
     * section
     * section
     *
     * 对普通 section：
     * 尽量整体分页
     *
     * 对工作 / 项目 section：
     * 按 resume-item 分割
     */

    for (
      const node
      of children
    ) {

      if (
        node.classList &&
        (
          node.classList.contains(
            "section-experience"
          ) ||
          node.classList.contains(
            "section-projects"
          )
        )
      ) {

        const title =
          node.querySelector(
            ":scope > .section-title"
          );

        const body =
          node.querySelector(
            ":scope > .section-body"
          );


        if (
          title
        ) {

          current.appendChild(
            title.cloneNode(
              true
            )
          );

        }


        const items =
          body
            ? Array.from(
                body.children
              )
            : [];


        for (
          const item
          of items
        ) {

          const clone =
            item.cloneNode(
              true
            );

          current.appendChild(
            clone
          );


          if (
            overflow(current)
          ) {

            current.removeChild(
              clone
            );


            current =
              createPage();

            applyPageTheme(
              current
            );

            paper.appendChild(
              current
            );


            if (
              title
            ) {

              current.appendChild(
                title.cloneNode(
                  true
                )
              );

            }


            current.appendChild(
              clone
            );

          }

        }

        continue;

      }


      /*
       * 普通节点
       */
      const clone =
        node.cloneNode(
          true
        );

      current.appendChild(
        clone
      );


      if (
        overflow(current)
      ) {

        current.removeChild(
          clone
        );


        current =
          createPage();

        applyPageTheme(
          current
        );

        paper.appendChild(
          current
        );

        current.appendChild(
          clone
        );

      }

    }


    /*
     * 自动分页完成
     */
    applyPageThemeToAll();

  }


  /* =======================================================
     ONE / TWO PAGE MODE
  ======================================================= */

  function paginateFixed(
    initialPage,
    count
  ) {

    const children =
      Array.from(
        initialPage.children
      );


    paper.innerHTML = "";

    paper.classList.add(
      "preview-stack"
    );


    const pageList = [];


    for (
      let i = 0;
      i < count;
      i++
    ) {

      const page =
        createPage();

      applyPageTheme(
        page
      );

      paper.appendChild(
        page
      );

      pageList.push(
        page
      );

    }


    if (
      count === 1
    ) {

      for (
        const node
        of children
      ) {

        pageList[0].appendChild(
          node.cloneNode(true)
        );

      }

      return;

    }


    /*
     * 两页模式：
     * 按 section 数量进行大致均分。
     */
    const sections =
      children.filter(
        node =>
          node.classList &&
          node.classList.contains(
            "section"
          )
      );


    const header =
      children.find(
        node =>
          node.classList &&
          node.classList.contains(
            "paper-header"
          )
      );


    if (
      header
    ) {

      pageList[0].appendChild(
        header.cloneNode(true)
      );

    }


    const split =
      Math.ceil(
        sections.length / 2
      );


    sections.forEach(
      (section, index) => {

        const target =
          index < split
            ? pageList[0]
            : pageList[1];

        target.appendChild(
          section.cloneNode(true)
        );

      }
    );

  }


  /* =======================================================
     APPLY THEME TO ALL
  ======================================================= */

  function applyPageThemeToAll() {

    const all =
      paper.querySelectorAll(
        ".resume-page"
      );

    all.forEach(
      applyPageTheme
    );

  }


  /* =======================================================
     RENDER
  ======================================================= */

  function render() {

    if (!paper) {
      return;
    }


    const initial =
      buildInitialPage();


    /*
     * 手动 / 一页
     */
    if (
      state.pageMode ===
      "one"
    ) {

      paginateFixed(
        initial,
        1
      );

    }

    /*
     * 两页
     */
    else if (
      state.pageMode ===
      "two"
    ) {

      paginateFixed(
        initial,
        2
      );

    }

    /*
     * 自动
     */
    else {

      paginateAuto(
        initial
      );

    }


    updateScale();

  }


  /* =======================================================
     SCALE
  ======================================================= */

  function updateScale() {

    const value =
      Number(
        state.zoom
      ) || 0.8;


    paper.style.transform =
      `scale(${value})`;

    paper.style.transformOrigin =
      "top center";


    const count =
      paper.querySelectorAll(
        ".resume-page"
      ).length || 1;


    /*
     * 预留缩放后的垂直空间
     */
    const height =
      1123 * value;

    const gap =
      24;


    paper.style.marginBottom =
      `${
        Math.max(
          0,
          count - 1
        ) * gap +
        Math.max(
          0,
          count - 1
        ) * height
      }px`;

  }


  /* =======================================================
     STATE NORMALIZE
  ======================================================= */

  function normalizeState() {

    state = {
      ...DEFAULT_STATE,
      ...state
    };


    if (
      !THEMES[state.theme]
    ) {

      state.theme =
        "blue";

    }


    if (
      ![
        "tech",
        "blue",
        "minimal",
        "terminal",
        "grayblue",
        "stripe",
        "business",
        "photo"
      ].includes(
        state.template
      )
    ) {

      state.template =
        "tech";

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
        "auto";

    }


    state.fontSize =
      Math.max(
        10,
        Math.min(
          15,
          Number(
            state.fontSize
          ) || 13
        )
      );


    state.zoom =
      Math.max(
        0.55,
        Math.min(
          1,
          Number(
            state.zoom
          ) || 0.8
        )
      );

  }


  /* =======================================================
     SAVE
  ======================================================= */

  function save() {

    try {

      localStorage.setItem(
        STORAGE.resume,
        source.value
      );

      localStorage.setItem(
        STORAGE.state,
        JSON.stringify(
          state
        )
      );


      if (
        photoData
      ) {

        localStorage.setItem(
          STORAGE.photo,
          photoData
        );

      } else {

        localStorage.removeItem(
          STORAGE.photo
        );

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

      const saved =
        localStorage.getItem(
          STORAGE.resume
        );


      if (
        saved !== null
      ) {

        source.value =
          saved;

      } else {

        source.value =
          DEMO_MD;

      }


      const savedState =
        localStorage.getItem(
          STORAGE.state
        );


      if (
        savedState
      ) {

        try {

          state = {
            ...DEFAULT_STATE,
            ...JSON.parse(
              savedState
            )
          };

        } catch {

          state = {
            ...DEFAULT_STATE
          };

        }

      }


      photoData =
        localStorage.getItem(
          STORAGE.photo
        ) || "";


    } catch (error) {

      console.warn(
        "ResumeFlow load error:",
        error
      );

      source.value =
        DEMO_MD;

    }

  }


  /* =======================================================
     UI SYNC
  ======================================================= */

  function syncUI() {

    if (
      templates
    ) {

      templates
        .querySelectorAll(
          "button[data-t]"
        )
        .forEach(
          button => {

            button.classList.toggle(
              "active",
              button.dataset.t ===
                state.template
            );

          }
        );

    }


    if (
      themes
    ) {

      themes
        .querySelectorAll(
          "button[data-theme]"
        )
        .forEach(
          button => {

            button.classList.toggle(
              "active",
              button.dataset.theme ===
                state.theme
            );

          }
        );

    }


    if (
      pages
    ) {

      pages.value =
        state.pageMode;

    }


    if (
      photoMode
    ) {

      photoMode.value =
        state.showPhoto
          ? "show"
          : "hide";

    }


    if (
      font
    ) {

      font.value =
        state.font;

    }


    if (
      size
    ) {

      size.value =
        state.fontSize;

    }


    if (
      sizeVal
    ) {

      sizeVal.textContent =
        state.fontSize;

    }


    if (
      zoom
    ) {

      zoom.value =
        state.zoom;

    }


    if (
      zoomVal
    ) {

      zoomVal.textContent =
        `${Math.round(
          state.zoom * 100
        )}%`;

    }


    updatePhotoPreview();

  }


  /* =======================================================
     PHOTO PREVIEW
  ======================================================= */

  function updatePhotoPreview() {

    if (!photoPreview) {
      return;
    }


    if (
      photoData
    ) {

      photoPreview.innerHTML =
        `<img
           src="${photoData}"
           alt="证件照"
         >`;

    } else {

      photoPreview.innerHTML =
        `<span>证件照</span>`;

    }


    if (
      removePhotoBtn
    ) {

      removePhotoBtn.disabled =
        !photoData;

    }

  }


  /* =======================================================
     FILE IMPORT
  ======================================================= */

  function importFile(
    file
  ) {

    if (!file) {
      return;
    }


    const reader =
      new FileReader();


    reader.onload =
      event => {

        const text =
          String(
            event.target.result ||
            ""
          );


        /*
         * JSON
         */
        if (
          file.name
            .toLowerCase()
            .endsWith(
              ".json"
            )
        ) {

          try {

            const data =
              JSON.parse(
                text
              );


            if (
              typeof data ===
              "string"
            ) {

              source.value =
                data;

            }

            else if (
              typeof data.resume ===
              "string"
            ) {

              source.value =
                data.resume;

            }

            else if (
              typeof data.markdown ===
              "string"
            ) {

              source.value =
                data.markdown;

            }

            else if (
              typeof data.content ===
              "string"
            ) {

              source.value =
                data.content;

            }

            else {

              alert(
                "无法识别该 JSON 简历格式。"
              );

              return;

            }

          } catch (
            error
          ) {

            alert(
              "JSON 文件解析失败。"
            );

            return;

          }

        }

        else {

          source.value =
            text;

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
     PHOTO IMPORT
  ======================================================= */

  function importPhoto(
    file
  ) {

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
        "仅支持 JPG / PNG / WebP 图片。"
      );

      return;

    }


    const reader =
      new FileReader();


    reader.onload =
      event => {

        photoData =
          event.target.result;

        state.showPhoto =
          true;

        save();

        syncUI();

        render();

      };


    reader.readAsDataURL(
      file
    );

  }


  /* =======================================================
     PRINT CSS
  ======================================================= */

  function installPrintStyle() {

    const old =
      document.getElementById(
        "resumeflow-print-style"
      );


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

      @page {
        size: A4;
        margin: 0;
      }


      @media print {

        html,
        body {
          width: 210mm !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #fff !important;

          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }


        .top,
        .left,
        .right {
          display: none !important;
        }


        .app,
        .main,
        .center {
          display: block !important;

          width: 210mm !important;
          min-width: 210mm !important;
          min-height: 0 !important;

          margin: 0 !important;
          padding: 0 !important;

          overflow: visible !important;
        }


        #paper.preview-stack {

          display: block !important;

          width: 210mm !important;

          min-width: 210mm !important;

          height: auto !important;

          min-height: 0 !important;

          margin: 0 !important;

          padding: 0 !important;

          transform: none !important;

          background: #fff !important;

          box-shadow: none !important;

          overflow: visible !important;
        }


        /*
         * 关键修复：
         *
         * 不再使用：
         *
         * height:297mm
         * break-after:page
         *
         * 这两个规则组合很容易导致：
         *
         * 一页内容
         * +
         * 强制分页
         * +
         * 浏览器物理分页
         *
         * 最终出现空白页。
         */


        #paper.preview-stack
        > .resume-page {

          display: block !important;

          width: 210mm !important;

          /*
           * 留 1mm 的安全余量，
           * 避免浏览器毫米 / 像素换算
           * 在页面边界产生额外分页。
           */
          height: 296mm !important;

          min-width: 210mm !important;
          max-width: 210mm !important;

          min-height: 296mm !important;
          max-height: 296mm !important;

          box-sizing: border-box !important;

          margin: 0 !important;

          position: relative !important;

          overflow: hidden !important;

          background: #fff !important;

          box-shadow: none !important;

          transform: none !important;

          break-after: auto !important;

          page-break-after: auto !important;

        }


        /*
         * 从第二张 A4 开始，
         * 在页面之前产生分页。
         *
         * 这样不会在第一页末尾
         * 再额外强制一次分页。
         */

        #paper.preview-stack
        > .resume-page:not(:first-child) {

          break-before: page !important;

          page-break-before: always !important;

        }


        /*
         * 最后一页不产生下一页
         */

        #paper.preview-stack
        > .resume-page:last-child {

          break-after: auto !important;

          page-break-after: auto !important;

        }


        /*
         * 模板打印 padding
         */

        #paper.preview-stack
        > .resume-page.tech {

          padding: 52px 62px !important;

        }


        #paper.preview-stack
        > .resume-page.blue {

          padding: 52px 62px !important;

        }


        #paper.preview-stack
        > .resume-page.minimal {

          padding: 48px 58px !important;

        }


        #paper.preview-stack
        > .resume-page.terminal {

          padding: 52px 62px !important;

        }


        #paper.preview-stack
        > .resume-page.grayblue {

          padding: 52px 62px !important;

        }


        #paper.preview-stack
        > .resume-page.stripe {

          padding-top: 52px !important;

          padding-right: 62px !important;

          padding-bottom: 52px !important;

          padding-left: 58px !important;

        }


        #paper.preview-stack
        > .resume-page.business {

          padding: 52px 62px !important;

        }


        #paper.preview-stack
        > .resume-page.photo {

          padding: 52px 62px !important;

        }


        /*
         * 打印时不再让 section 自己
         * 产生新的页面。
         *
         * JS 已经完成分页。
         */

        #paper.preview-stack
        .section {

          break-inside: auto !important;

          page-break-inside: auto !important;

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
        .section-title {

          break-after: avoid !important;

          page-break-after: avoid !important;

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

  function exportPDF() {

    /*
     * 打印前重新生成一次，
     * 确保当前内容和设置最新。
     */

    render();

    installPrintStyle();


    setTimeout(
      () => {

        window.print();

      },
      150
    );

  }


  /* =======================================================
     TEMPLATE EVENTS
  ======================================================= */

  if (templates) {

    templates.addEventListener(
      "click",
      event => {

        const button =
          event.target.closest(
            "button[data-t]"
          );


        if (!button) {
          return;
        }


        state.template =
          button.dataset.t;


        save();

        syncUI();

        render();

      }
    );

  }


  /* =======================================================
     THEME EVENTS
  ======================================================= */

  if (themes) {

    themes.addEventListener(
      "click",
      event => {

        const button =
          event.target.closest(
            "button[data-theme]"
          );


        if (!button) {
          return;
        }


        state.theme =
          button.dataset.theme;


        const theme =
          THEMES[
            state.theme
          ] || THEMES.blue;


        document.documentElement.style.setProperty(
          "--accent",
          theme.main
        );


        document.documentElement.style.setProperty(
          "--accent-soft",
          theme.light
        );


        save();

        syncUI();

        render();

      }
    );

  }


  /* =======================================================
     PAGE MODE
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
     PHOTO MODE
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
     FONT
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
     FONT SIZE
  ======================================================= */

  if (size) {

    size.addEventListener(
      "input",
      () => {

        state.fontSize =
          Number(
            size.value
          );


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
     ZOOM
  ======================================================= */

  if (zoom) {

    zoom.addEventListener(
      "input",
      () => {

        state.zoom =
          Number(
            zoom.value
          );


        if (zoomVal) {

          zoomVal.textContent =
            `${Math.round(
              state.zoom * 100
            )}%`;

        }


        save();

        updateScale();

      }
    );

  }


  /* =======================================================
     SOURCE
  ======================================================= */

  if (source) {

    source.addEventListener(
      "input",
      () => {

        save();

      }
    );

  }


  /* =======================================================
     RENDER BUTTON
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
     CLEAR BUTTON
  ======================================================= */

  if (clearBtn) {

    clearBtn.addEventListener(
      "click",
      () => {

        const ok =
          confirm(
            "确定清空当前简历吗？"
          );


        if (!ok) {
          return;
        }


        source.value =
          "";

        save();

        render();

      }
    );

  }


  /* =======================================================
     DEMO BUTTON
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
     PDF BUTTON
  ======================================================= */

  if (pdfBtn) {

    pdfBtn.addEventListener(
      "click",
      exportPDF
    );

  }


  /* =======================================================
     FILE BUTTON
  ======================================================= */

  if (fileBtn) {

    fileBtn.addEventListener(
      "click",
      () => {

        if (fileInput) {

          fileInput.click();

        }

      }
    );

  }


  if (fileInput) {

    fileInput.addEventListener(
      "change",
      () => {

        const file =
          fileInput.files &&
          fileInput.files[0];


        importFile(
          file
        );


        fileInput.value =
          "";

      }
    );

  }


  /* =======================================================
     PHOTO BUTTON
  ======================================================= */

  if (photoBtn) {

    photoBtn.addEventListener(
      "click",
      () => {

        if (photoFile) {

          photoFile.click();

        }

      }
    );

  }


  if (photoFile) {

    photoFile.addEventListener(
      "change",
      () => {

        const file =
          photoFile.files &&
          photoFile.files[0];


        importPhoto(
          file
        );


        photoFile.value =
          "";

      }
    );

  }


  /* =======================================================
     REMOVE PHOTO
  ======================================================= */

  if (removePhotoBtn) {

    removePhotoBtn.addEventListener(
      "click",
      () => {

        photoData =
          "";

        save();

        updatePhotoPreview();

        render();

      }
    );

  }


  /* =======================================================
     DRAG & DROP
  ======================================================= */

  if (dropZone) {

    [
      "dragenter",
      "dragover"
    ].forEach(
      eventName => {

        dropZone.addEventListener(
          eventName,
          event => {

            event.preventDefault();

            event.stopPropagation();

            dropZone.classList.add(
              "drag"
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

        dropZone.addEventListener(
          eventName,
          event => {

            event.preventDefault();

            event.stopPropagation();

            dropZone.classList.remove(
              "drag"
            );

          }
        );

      }
    );


    dropZone.addEventListener(
      "drop",
      event => {

        const files =
          event.dataTransfer &&
          event.dataTransfer.files;


        if (
          files &&
          files.length
        ) {

          importFile(
            files[0]
          );

        }

      }
    );

  }


  /* =======================================================
     KEYBOARD
  ======================================================= */

  document.addEventListener(
    "keydown",
    event => {

      if (
        (
          event.ctrlKey ||
          event.metaKey
        ) &&
        event.key.toLowerCase() ===
          "s"
      ) {

        event.preventDefault();

        save();

      }


      if (
        (
          event.ctrlKey ||
          event.metaKey
        ) &&
        event.key.toLowerCase() ===
          "p"
      ) {

        event.preventDefault();

        exportPDF();

      }

    }
  );


  /* =======================================================
     INIT
  ======================================================= */

  function init() {

    load();

    normalizeState();

    syncUI();

    installPrintStyle();

    render();

    /*
     * 更新 Service Worker 版本，
     * 避免继续读取 V1.3.6 缓存。
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
                  "ResumeFlow Service Worker:",
                  registration.scope
                );

              }
            )
            .catch(
              error => {

                console.warn(
                  "Service Worker registration failed:",
                  error
                );

              }
            );

        }
      );

    }

  }


  /* =======================================================
     START
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

})();