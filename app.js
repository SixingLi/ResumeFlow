/* =========================================================
   ResumeFlow V1.3.0
   A4 Auto Pagination Edition

   基于 V1.2.5 修改

   保留：
   - TXT / MD / JSON 导入
   - 拖拽导入
   - Markdown 解析
   - 公司 / 项目标题对应关系
   - 证件照
   - 8 个模板
   - 6 个主题色
   - 字体
   - 正文字号 10 ~ 18
   - 预览缩放
   - localStorage
   - 一页 / 两页 / 自动
   - PDF
   - Service Worker

   V1.3 新增：
   - 自动模式下真正生成多个 A4 页面
   - 中间预览区所见即所得显示 A4 分页
   - 每页固定 210mm × 297mm
   - 页面之间显示间距和阴影
   - 尽量保证 section 不跨页
========================================================= */

(() => {
  "use strict";

  const VERSION = "1.3.0";

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
    resume: "resumeflow-resume-v122",
    state: "resumeflow-state-v122",
    photo: "resumeflow-photo-v122"
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
     TEXT HELPERS
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
          alias =>
            normalizeHeading(alias) === normalized
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

      const heading =
        line.match(/^(#{1,6})\s+(.+)$/);

      if (heading) {
        const level = heading[1].length;
        const title = stripMD(heading[2]);

        if (
          level === 1 &&
          !result.name
        ) {
          result.name = title;
          continue;
        }

        const type = sectionType(title);

        if (type) {
          current = {
            type,
            title,
            items: []
          };

          result.sections.push(current);
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

      const plain = stripMD(line);

      if (
        !current &&
        result.name &&
        !result.title
      ) {
        result.title = plain;
        continue;
      }

      if (
        !current &&
        result.title &&
        !result.contact
      ) {
        result.contact = plain;
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
          text: stripMD(
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
    }

    return result;
  }

  /* =======================================================
     JSON PARSER
  ======================================================= */

  function parseJSON(text) {
    try {
      const data = JSON.parse(text);

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

            if (
              typeof item ===
              "string"
            ) {
              section.items.push({
                type: "text",
                text: item
              });

              return;
            }

            if (
              item &&
              typeof item ===
              "object"
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
                Array.isArray(
                  item.bullets
                )
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
          typeof value ===
          "string"
        ) {
          section.items.push({
            type: "text",
            text: value
          });
        }

        result.sections.push(section);
      });

      return result;

    } catch {
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
     HEADER
  ======================================================= */

  function renderHeader(data) {
    const photo =
      localStorage.getItem(
        STORAGE.photo
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
          />
        </div>
      `;
    }

    return `
      <header class="paper-header">

        <div class="identity">

          <div class="name">
            ${escapeHTML(
              data.name ||
              "姓名"
            )}
          </div>

          <div class="title">
            ${escapeHTML(
              data.title ||
              ""
            )}
          </div>

          <div class="contact">
            ${escapeHTML(
              data.contact ||
              ""
            )}
          </div>

        </div>

        ${photoHTML}

      </header>
    `;
  }

  /* =======================================================
     SECTION
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

      if (
        item.type ===
        "subheading"
      ) {
        flushBullets();

        bodyHTML += `
          <div class="item-head">
            ${text}
          </div>
        `;

        return;
      }

      if (
        item.type ===
        "text"
      ) {
        flushBullets();

        bodyHTML += `
          <p>
            ${text}
          </p>
        `;

        return;
      }

      if (
        item.type ===
        "bullet"
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
     V1.3 A4 PAGINATION CSS
  ======================================================= */

  function installPaginationStyle() {

    const old =
      document.getElementById(
        "resumeflow-pagination-v130"
      );

    if (old) {
      old.remove();
    }

    const style =
      document.createElement("style");

    style.id =
      "resumeflow-pagination-v130";

    style.textContent = `

      /* ==========================================
         A4 自动分页预览
      ========================================== */

      #paper.preview-stack {

        width: var(--paper-w);

        min-height: 0;

        height: auto;

        padding: 0 !important;

        margin: 0;

        background: transparent;

        box-shadow: none;

        display: flex;

        flex-direction: column;

        align-items: center;

        gap: 24px;

        position: relative;

        transform-origin: top center;

      }


      #paper.preview-stack::before {

        display: none !important;

      }


      #paper.preview-stack
      > .resume-page {

        width: var(--paper-w);

        height: var(--paper-h);

        min-height: var(--paper-h);

        max-height: var(--paper-h);

        flex: 0 0 var(--paper-h);

        box-sizing: border-box;

        position: relative;

        overflow: hidden;

        background: #fff;

        box-shadow:
          0 8px 30px #00000012;

        padding: 52px 62px;

      }


      /*
       * 第一张页面保留技术经典顶部色线
       */

      #paper.preview-stack
      > .resume-page.tech {

        border-top:
          4px solid var(--accent);

      }


      /*
       * 工程师蓝
       */

      #paper.preview-stack
      > .resume-page.blue
      .section-title {

        border-bottom-width: 2px;

      }


      #paper.preview-stack
      > .resume-page.blue
      .name {

        color: var(--accent);

      }


      /*
       * 极简黑白
       */

      #paper.preview-stack
      > .resume-page.minimal {

        padding:
          48px 58px;

      }


      #paper.preview-stack
      > .resume-page.minimal
      .name {

        font-size: 29px;

      }


      #paper.preview-stack
      > .resume-page.minimal
      .section-title {

        border: 0;

        padding: 0;

        letter-spacing: .13em;

        color: var(--accent);

      }


      #paper.preview-stack
      > .resume-page.minimal
      .contact {

        border-bottom:
          1px solid var(--line);

        padding-bottom: 14px;

      }


      /*
       * 代码终端
       */

      #paper.preview-stack
      > .resume-page.terminal {

        font-family:
          "SFMono-Regular",
          Consolas,
          "Liberation Mono",
          "PingFang SC",
          monospace;

      }


      #paper.preview-stack
      > .resume-page.terminal
      .name {

        font-size: 27px;

      }


      #paper.preview-stack
      > .resume-page.terminal
      .title {

        color: var(--accent);

      }


      #paper.preview-stack
      > .resume-page.terminal
      .section-title {

        border-bottom: 0;

        background: var(--accent);

        color: #fff;

        padding: 4px 8px;

        display: inline-block;

        letter-spacing: .04em;

      }


      /*
       * 科技灰蓝
       */

      #paper.preview-stack
      > .resume-page.grayblue
      .section-title {

        color: #40576b;

        border-bottom-color:
          #8fa0ad;

      }


      #paper.preview-stack
      > .resume-page.grayblue
      .name {

        color: #253746;

      }


      /*
       * 左侧色带
       */

      #paper.preview-stack
      > .resume-page.stripe::before {

        content: "";

        position: absolute;

        left: 0;

        top: 0;

        bottom: 0;

        width: 8px;

        background: var(--accent);

      }


      #paper.preview-stack
      > .resume-page.stripe {

        padding-left: 58px;

      }


      /*
       * 商务技术
       */

      #paper.preview-stack
      > .resume-page.business
      .name {

        font-weight: 700;

      }


      #paper.preview-stack
      > .resume-page.business
      .section-title {

        border-bottom:
          2px solid var(--accent);

        font-size: 12px;

        letter-spacing: .16em;

        padding-bottom: 7px;

      }


      /*
       * 证件照技术
       */

      #paper.preview-stack
      > .resume-page.photo
      .resume-photo {

        width: 92px;

        height: 122px;

      }


      /*
       * 分页时 section 尽量完整保留
       */

      #paper.preview-stack
      .section {

        break-inside: avoid;

        page-break-inside: avoid;

      }


      #paper.preview-stack
      .section-title {

        break-after: avoid;

        page-break-after: avoid;

      }


      #paper.preview-stack
      .item-head {

        break-inside: avoid;

        page-break-inside: avoid;

      }


      #paper.preview-stack
      li {

        break-inside: avoid;

        page-break-inside: avoid;

      }


      /*
       * iPad / 小屏
       */

      @media(max-width:760px){

        #paper.preview-stack {

          gap: 16px;

        }

      }


      /*
       * 打印
       */

      @media print {

        #paper.preview-stack {

          display: block;

          width: 210mm;

          height: auto;

          min-height: 0;

          padding: 0 !important;

          margin: 0 !important;

          background: #fff;

          box-shadow: none;

          transform: none !important;

        }


        #paper.preview-stack
        > .resume-page {

          width: 210mm !important;

          height: 297mm !important;

          min-height: 297mm !important;

          max-height: 297mm !important;

          margin: 0 !important;

          box-sizing: border-box !important;

          overflow: hidden !important;

          box-shadow: none !important;

          break-after: page;

          page-break-after: always;

        }


        #paper.preview-stack
        > .resume-page:last-child {

          break-after: auto;

          page-break-after: auto;

        }

      }

    `;

    document.head.appendChild(style);
  }

  /* =======================================================
     A4 AUTO PAGINATION
  ======================================================= */

  function paginatePreview() {

    if (!paper) {
      return;
    }

    /*
     * 取出当前已经渲染好的 header + sections
     */
    const nodes =
      Array.from(
        paper.childNodes
      ).filter(
        node =>
          node.nodeType ===
          Node.ELEMENT_NODE
      );

    /*
     * 清空连续长页面
     */
    paper.innerHTML = "";

    /*
     * 外层只负责页面堆叠
     */
    paper.className =
      "paper preview-stack";

    /*
     * 创建真正的 A4 页面
     */
    function createPage() {

      const page =
        document.createElement(
          "div"
        );

      page.className =
        `paper resume-page ${state.template}`;

      /*
       * 主题色和字号由外层继承
       */

      paper.appendChild(page);

      return page;
    }

    let page =
      createPage();

    nodes.forEach(node => {

      page.appendChild(node);

      /*
       * 页面高度超过 A4
       */
      if (
        page.scrollHeight >
          page.clientHeight + 1
      ) {

        /*
         * 如果当前页已经有其它内容，
         * 则把刚加入的模块移动到下一页。
         */
        if (
          page.children.length > 1
        ) {

          page.removeChild(node);

          page =
            createPage();

          page.appendChild(node);
        }
      }
    });
  }

  /* =======================================================
     RENDER
  ======================================================= */

  function render() {

    if (!paper) {
      return;
    }

    const data =
      parseResume(
        source
          ? source.value
          : ""
      );

    const theme =
      THEMES[state.theme] ||
      THEMES.blue;

    /*
     * 非自动模式：
     * 保持 V1.2.5 原来的结构
     */
    paper.className =
      `paper ${state.template} page-${state.pageMode}`;

    /*
     * 主题色
     */

    paper.style.setProperty(
      "--accent",
      theme.main
    );

    paper.style.setProperty(
      "--accent-soft",
      theme.light
    );

    paper.style.setProperty(
      "--resume-accent",
      theme.main
    );

    paper.style.setProperty(
      "--resume-accent-light",
      theme.light
    );

    /*
     * 字号
     */

    paper.style.setProperty(
      "--resume-font-size",
      `${state.fontSize}px`
    );

    /*
     * 缩放
     */

    paper.style.setProperty(
      "--resume-zoom",
      state.zoom
    );

    /*
     * 主题按钮
     */

    if (themes) {

      themes
        .querySelectorAll(
          "[data-theme]"
        )
        .forEach(button => {

          const name =
            button.dataset.theme;

          const item =
            THEMES[name];

          if (!item) {
            return;
          }

          button.style.setProperty(
            "--theme-color",
            item.main
          );

          button.classList.toggle(
            "active",
            name === state.theme
          );
        });
    }

    /*
     * 正常渲染
     */

    paper.innerHTML =
      renderHeader(data) +
      data.sections
        .map(renderSection)
        .join("");

    applyFont();

    /*
     * 自动模式：
     * 等待浏览器完成 layout 后再分页。
     */
    if (
      state.pageMode ===
      "auto"
    ) {

      requestAnimationFrame(() => {

        paginatePreview();

        /*
         * 重新应用字体
         */
        applyFont();

        paper.style.transform =
          `scale(${state.zoom})`;

        updateScaleSpace();

        /*
         * 图片 / 字体在 iPad 上可能还需要一次 layout
         */
        requestAnimationFrame(() => {

          /*
           * 如果页面已经存在，
           * 再重新计算一次分页。
           *
           * 这样可以处理证件照加载、
           * 字体加载造成的高度变化。
           */

          paginatePreview();

          applyFont();

          paper.style.transform =
            `scale(${state.zoom})`;

          updateScaleSpace();

        });

      });

    } else {

      paper.style.transform =
        `scale(${state.zoom})`;

      updateScaleSpace();
    }
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
     SCALE
  ======================================================= */

  function updateScaleSpace() {

    if (!paper) {
      return;
    }

    const z =
      Number(state.zoom) ||
      0.8;

    const h =
      paper.offsetHeight ||
      1123;

    paper.style.marginBottom =
      `${-(h * (1 - z))}px`;
  }

  /* =======================================================
     STATE NORMALIZE
  ======================================================= */

  function normalizeState() {

    if (
      !TEMPLATE_LIST.includes(
        state.template
      )
    ) {
      state.template =
        "tech";
    }

    if (
      !THEMES[state.theme]
    ) {
      state.theme =
        "blue";
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
        "pingfang";
    }

    let fs =
      Number(
        state.fontSize
      );

    if (
      !Number.isFinite(fs)
    ) {
      fs = 13;
    }

    state.fontSize =
      Math.max(
        10,
        Math.min(
          18,
          fs
        )
      );

    let z =
      Number(
        state.zoom
      );

    if (
      !Number.isFinite(z)
    ) {
      z = 0.8;
    }

    state.zoom =
      Math.max(
        0.55,
        Math.min(
          1,
          z
        )
      );

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
        JSON.stringify(
          state
        )
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
          typeof parsed ===
            "object"
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
     SYNC CONTROLS
  ======================================================= */

  function syncControls() {

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

    if (themes) {

      themes
        .querySelectorAll(
          "[data-theme]"
        )
        .forEach(button => {

          const name =
            button.dataset.theme;

          const item =
            THEMES[name];

          button.classList.toggle(
            "active",
            name ===
              state.theme
          );

          if (item) {

            button.style.setProperty(
              "--theme-color",
              item.main
            );

          }

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

      size.min =
        "10";

      size.max =
        "18";

      size.step =
        "0.5";

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
     PHOTO
  ======================================================= */

  function handlePhoto(file) {

    if (!file) {
      return;
    }

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

        try {

          localStorage.setItem(
            STORAGE.photo,
            event.target.result
          );

          updatePhotoUI();

          render();

        } catch {

          alert(
            "照片保存失败，可能是图片过大。"
          );

        }

      };

    reader.readAsDataURL(file);
  }

  /* =======================================================
     RESUME FILE
  ======================================================= */

  function handleResumeFile(file) {

    if (!file) {
      return;
    }

    const reader =
      new FileReader();

    reader.onload =
      event => {

        if (source) {

          source.value =
            event.target.result ||
            "";

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
     TEMPLATE EVENT
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
     THEME EVENT
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

    size.min =
      "10";

    size.max =
      "18";

    size.step =
      "0.5";

    size.addEventListener(
      "input",
      () => {

        state.fontSize =
          Number(
            size.value
          );

        state.fontSize =
          Math.max(
            10,
            Math.min(
              18,
              state.fontSize
            )
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

        render();

      }
    );
  }

  /* =======================================================
     SOURCE INPUT
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
     CLEAR
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

        if (source) {

          source.value =
            "";

        }

        save();

        render();

      }
    );
  }

  /* =======================================================
     DEMO
  ======================================================= */

  if (demoBtn) {

    demoBtn.addEventListener(
      "click",
      () => {

        if (source) {

          source.value =
            DEMO_MD;

        }

        save();

        render();

      }
    );
  }

  /* =======================================================
     FILE BUTTON
  ======================================================= */

  if (
    fileBtn &&
    fileInput
  ) {

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

        fileInput.value =
          "";

      }
    );
  }

  /* =======================================================
     DRAG DROP
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
     PHOTO BUTTON
  ======================================================= */

  if (
    photoBtn &&
    photoFile
  ) {

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

        localStorage.removeItem(
          STORAGE.photo
        );

        updatePhotoUI();

        render();

      }
    );
  }

  /* =======================================================
     PRINT STYLE
  ======================================================= */

  function installPrintStyle() {

    const old =
      document.getElementById(
        "resumeflow-print-v130"
      );

    if (old) {
      old.remove();
    }

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "resumeflow-print-v130";

    style.textContent = `

      @media print {

        @page {

          size: A4;

          margin: 0;

        }

        html,
        body {

          width: 210mm !important;

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

          transform: none !important;

        }

        #paper:not(.preview-stack) {

          width: 210mm !important;

          min-height: 297mm !important;

          margin: 0 !important;

          padding:
            13mm 15mm !important;

          box-sizing:
            border-box !important;

          box-shadow:
            none !important;

          font-size:
            var(--resume-font-size, 13px)
            !important;

          line-height:
            1.55 !important;

        }

        #paper.preview-stack {

          width: 210mm !important;

          min-height: 0 !important;

          height: auto !important;

          margin: 0 !important;

          padding: 0 !important;

          background: #fff !important;

          box-shadow: none !important;

          transform: none !important;

        }

        #paper.preview-stack
        > .resume-page {

          width: 210mm !important;

          height: 297mm !important;

          min-height: 297mm !important;

          max-height: 297mm !important;

          margin: 0 !important;

          padding:
            13mm 15mm !important;

          box-sizing:
            border-box !important;

          box-shadow:
            none !important;

          overflow: hidden !important;

          break-after: page;

          page-break-after: always;

          font-size:
            var(--resume-font-size, 13px)
            !important;

          line-height:
            1.55 !important;

        }

        #paper.preview-stack
        > .resume-page:last-child {

          break-after: auto;

          page-break-after: auto;

        }

        #paper .section-title {

          break-after:
            avoid !important;

        }

        #paper .item-head {

          break-after:
            avoid !important;

          break-inside:
            avoid !important;

        }

        #paper li {

          break-inside:
            avoid !important;

        }

        #paper .resume-photo {

          print-color-adjust:
            exact !important;

          -webkit-print-color-adjust:
            exact !important;

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

  if (pdfBtn) {

    pdfBtn.addEventListener(
      "click",
      () => {

        installPrintStyle();

        setTimeout(
          () => {

            window.print();

          },
          100
        );

      }
    );
  }

  /* =======================================================
     RESIZE
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

  installPaginationStyle();

  load();

  normalizeState();

  if (size) {

    size.min =
      "10";

    size.max =
      "18";

    size.step =
      "0.5";

  }

  syncControls();

  updatePhotoUI();

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
            "./sw.js?v=1.3.0"
          )
          .then(reg => {

            reg.update();

            console.log(
              "ResumeFlow V1.3.0 Service Worker ready"
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
    "ResumeFlow V1.3.0 ready"
  );

})();