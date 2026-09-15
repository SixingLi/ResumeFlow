/* =========================================================
   ResumeFlow V1.4.0

   核心：
   1. Markdown / TXT / JSON
   2. 8模板
   3. 6主题色
   4. 证件照
   5. 自动A4分页
   6. 一页 / 两页 / 自动
   7. A4所见即所得预览
   8. 独立顶层打印页面 PDF
   9. localStorage
   10. PWA
========================================================= */

(() => {

"use strict";


/* =========================================================
   DOM
========================================================= */

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

const saveState = $("saveState");


/* =========================================================
   STORAGE
========================================================= */

const STORAGE = {

  resume:
    "resumeflow-resume-v138",

  state:
    "resumeflow-state-v138",

  photo:
    "resumeflow-photo-v138"

};


/* =========================================================
   DEFAULT STATE
========================================================= */

const DEFAULT_STATE = {

  template:"tech",

  theme:"blue",

  pageMode:"auto",

  showPhoto:true,

  font:"pingfang",

  fontSize:13,

  zoom:.8

};


let state = {
  ...DEFAULT_STATE
};


let resumeData = null;


/* =========================================================
   THEMES
========================================================= */

const THEMES = {

  black:{
    main:"#222222",
    light:"#f2f2f2"
  },

  blue:{
    main:"#17365D",
    light:"#eef4fa"
  },

  cyan:{
    main:"#1677FF",
    light:"#edf5ff"
  },

  green:{
    main:"#216E5B",
    light:"#edf7f3"
  },

  gray:{
    main:"#555B66",
    light:"#f2f3f5"
  },

  wine:{
    main:"#7A3030",
    light:"#faf0f0"
  }

};


/* =========================================================
   SECTION ALIASES
========================================================= */

const SECTION_ALIASES = {

  summary:[
    "个人优势",
    "个人简介",
    "个人概述",
    "简介",
    "summary",
    "profile"
  ],

  skills:[
    "核心技能",
    "专业技能",
    "技能",
    "技术栈",
    "skills",
    "technical skills"
  ],

  experience:[
    "工作经历",
    "工作经验",
    "职业经历",
    "工作履历",
    "experience",
    "work experience"
  ],

  projects:[
    "项目经历",
    "项目经验",
    "项目",
    "projects",
    "project experience"
  ],

  education:[
    "教育背景",
    "教育经历",
    "学历",
    "education"
  ],

  certificates:[
    "证书",
    "资格证书",
    "certificates"
  ],

  awards:[
    "获奖经历",
    "奖项",
    "荣誉",
    "awards"
  ]

};


/* =========================================================
   DEMO
========================================================= */

const DEMO_MD = `# 李思杏

ADAS软件工程师

成都 | C / C++ / Linux / MATLAB | 4年智能驾驶软件开发经验

## 个人优势

- 4年汽车电子及ADAS软件开发经验，覆盖L2 ACC及TSR功能。
- 熟悉需求分析、软件设计、编码、联调、测试、标定和问题闭环。
- 熟悉C、AUTOSAR Classic、SWC/RTE、CAN、CANoe/CANalyzer及DBC。
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
- 针对弯道限速处理车道线半径输入，采用滑动窗口及抑制滤波。

### 乘用车 L2 ACC 量产项目

**2022.02 – 2025.08**

- 参与ACC应用层及代码框架开发，覆盖定速巡航、稳态跟车、Cut-in/Cut-out、弯道限速、Stop&Go等功能。
- 参与PreScan、CarSim、MATLAB仿真分析及实车调试。
- 完成ACC调试监测变量外发、变量缩放、偏移、编码及DBC维护。
- 基于CANoe采集车辆状态、ADAS状态和控制相关信号。
- 使用CANape进行在线标定和MF4数据采集。
- 结合MATLAB分析控制请求、期望加速度、实际加速度、响应时间和执行结果。

## 教育背景

### 四川师范大学

**计算机科学与技术｜本科｜2017.09 – 2021.06**
`;


/* =========================================================
   TEXT
========================================================= */

function clean(text){

  return String(text || "")
    .replace(/\r/g,"")
    .replace(/\u00a0/g," ")
    .trim();

}


function stripMD(text){

  return String(text || "")
    .replace(/^#{1,6}\s*/,"")
    .replace(/\*\*(.*?)\*\*/g,"$1")
    .replace(/__(.*?)__/g,"$1")
    .replace(/`(.*?)`/g,"$1")
    .replace(/\[(.*?)\]\(.*?\)/g,"$1")
    .trim();

}


function escapeHTML(text){

  return String(text || "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");

}


function normalizeHeading(text){

  return stripMD(text)
    .replace(/[：:]/g,"")
    .trim()
    .toLowerCase();

}


function getSectionType(title){

  const normalized =
    normalizeHeading(title);

  for(
    const [type,aliases]
    of Object.entries(SECTION_ALIASES)
  ){

    if(
      aliases.some(
        alias =>
          normalizeHeading(alias)
          === normalized
      )
    ){

      return type;

    }

  }

  return null;

}


/* =========================================================
   MARKDOWN PARSER
========================================================= */

function parseMarkdown(text){

  const lines =
    clean(text).split("\n");

  const result = {

    name:"",

    title:"",

    contact:"",

    sections:[]

  };


  let current = null;
  let currentBlock = null;

  let beforeFirstSection = [];


  for(const raw of lines){

    const line =
      raw.trim();

    if(!line){
      continue;
    }


    const heading =
      line.match(
        /^(#{1,6})\s+(.+)$/
      );


    if(heading){

      const level =
        heading[1].length;

      const title =
        stripMD(heading[2]);


      if(
        level === 1 &&
        !result.name
      ){

        result.name = title;
        continue;

      }


      const type =
        getSectionType(title);


      if(type){

        current = {

          type,

          title,

          blocks:[]

        };

        result.sections.push(current);

        currentBlock = null;

        continue;

      }


      if(
        current &&
        level >= 3
      ){

        currentBlock = {

          head:title,

          lines:[],

          bullets:[]

        };

        current.blocks.push(
          currentBlock
        );

        continue;

      }


      if(!current){

        beforeFirstSection.push(
          title
        );

      }

      continue;

    }


    if(!current){

      beforeFirstSection.push(
        stripMD(line)
      );

      continue;

    }


    if(
      /^[-*•]\s+/.test(line)
    ){

      if(!currentBlock){

        currentBlock = {

          head:"",

          lines:[],

          bullets:[]

        };

        current.blocks.push(
          currentBlock
        );

      }

      currentBlock.bullets.push(
        stripMD(
          line.replace(
            /^[-*•]\s+/,
            ""
          )
        )
      );

      continue;

    }


    if(!currentBlock){

      currentBlock = {

        head:"",

        lines:[],

        bullets:[]

      };

      current.blocks.push(
        currentBlock
      );

    }


    currentBlock.lines.push(
      stripMD(line)
    );

  }


  if(!result.name){

    result.name =
      beforeFirstSection.shift()
      || "姓名";

  }


  if(!result.title){

    result.title =
      beforeFirstSection.shift()
      || "";

  }


  if(!result.contact){

    result.contact =
      beforeFirstSection.join(" | ");

  }


  return result;

}


/* =========================================================
   JSON PARSER
========================================================= */

function parseJSON(text){

  const obj =
    JSON.parse(text);


  if(
    typeof obj === "string"
  ){

    return parseMarkdown(obj);

  }


  if(
    obj.markdown ||
    obj.content ||
    obj.resume
  ){

    return parseMarkdown(
      obj.markdown ||
      obj.content ||
      obj.resume
    );

  }


  const result = {

    name:
      obj.name ||
      obj.姓名 ||
      "姓名",

    title:
      obj.title ||
      obj.职位 ||
      obj.position ||
      "",

    contact:
      obj.contact ||
      obj.联系方式 ||
      "",

    sections:[]

  };


  const sectionMap = [

    ["summary","个人优势"],
    ["skills","核心技能"],
    ["experience","工作经历"],
    ["projects","项目经历"],
    ["education","教育背景"],
    ["certificates","证书"],
    ["awards","获奖经历"]

  ];


  for(const [key,title] of sectionMap){

    if(!obj[key]){
      continue;
    }


    const value =
      Array.isArray(obj[key])
        ? obj[key]
        : [obj[key]];


    const section = {

      type:key,

      title,

      blocks:[]

    };


    for(const item of value){

      if(typeof item === "string"){

        section.blocks.push({

          head:"",

          lines:[],

          bullets:[item]

        });

        continue;

      }


      if(
        item &&
        typeof item === "object"
      ){

        section.blocks.push({

          head:
            item.title ||
            item.name ||
            item.公司 ||
            item.项目 ||
            "",

          lines:
            item.lines ||
            item.description ||
            [],

          bullets:
            item.bullets ||
            item.内容 ||
            []

        });

      }

    }


    result.sections.push(section);

  }


  return result;

}


/* =========================================================
   INPUT
========================================================= */

function parseInput(text){

  const value =
    clean(text);

  if(!value){
    return null;
  }


  if(
    value.startsWith("{") ||
    value.startsWith("[")
  ){

    try{

      return parseJSON(value);

    }catch(error){

      console.warn(
        "JSON解析失败，按Markdown处理。",
        error
      );

    }

  }


  return parseMarkdown(value);

}


/* =========================================================
   HTML BLOCK
========================================================= */

function blockHTML(block){

  let html = "";

  if(block.head){

    html +=
      `<div class="block-head">${escapeHTML(block.head)}</div>`;

  }


  for(const line of block.lines || []){

    html +=
      `<div class="block-line">${escapeHTML(line)}</div>`;

  }


  if(
    block.bullets &&
    block.bullets.length
  ){

    html += `<ul>`;

    for(const bullet of block.bullets){

      html +=
        `<li>${escapeHTML(bullet)}</li>`;

    }

    html += `</ul>`;

  }


  return html;

}


/* =========================================================
   SECTION
========================================================= */

function sectionShell(section){

  return `

    <section
      class="resume-section section-${escapeHTML(section.type)}"
    >

      <h2>
        ${escapeHTML(section.title)}
      </h2>

      <div class="section-content"></div>

    </section>

  `;

}


function addBlockToSection(section,block){

  const content =
    section.querySelector(
      ".section-content"
    );

  if(!content){
    return;
  }

  content.insertAdjacentHTML(
    "beforeend",
    `<div class="resume-block">
       ${blockHTML(block)}
     </div>`
  );

}


/* =========================================================
   HEADER
========================================================= */

function headerHTML(){

  const photo =
    getPhoto();


  const photoHTML =
    (
      state.showPhoto &&
      photo
    )

      ? `
        <img
          class="resume-photo"
          src="${photo}"
          alt="证件照"
        >
      `

      : "";


  return `

    <header class="resume-header">

      <div class="header-main">

        <div class="resume-name">
          ${escapeHTML(resumeData.name)}
        </div>

        ${
          resumeData.title
            ? `
              <div class="resume-title">
                ${escapeHTML(resumeData.title)}
              </div>
            `
            : ""
        }

        ${
          resumeData.contact
            ? `
              <div class="resume-contact">
                ${escapeHTML(resumeData.contact)}
              </div>
            `
            : ""
        }

      </div>

      ${photoHTML}

    </header>

  `;

}


/* =========================================================
   PAGE
========================================================= */

function createPage(pageNumber){

  const page =
    document.createElement("div");

  page.className =
    `resume-page ${state.template}`;

  if(state.pageMode === "one"){
    page.classList.add("page-one");
  }

  if(state.pageMode === "two"){
    page.classList.add("page-two");
  }


  const theme =
    THEMES[state.theme] ||
    THEMES.blue;


  page.style.setProperty(
    "--accent",
    theme.main
  );

  page.style.setProperty(
    "--accent-light",
    theme.light
  );


  page.dataset.page =
    pageNumber;


  return page;

}


/* =========================================================
   HEADER
========================================================= */

function addHeader(page){

  page.insertAdjacentHTML(
    "beforeend",
    headerHTML()
  );

}


/* =========================================================
   OVERFLOW
========================================================= */

function isOverflow(page){

  return (
    page.scrollHeight >
    page.clientHeight + 1
  );

}


/* =========================================================
   SECTION
========================================================= */

function addSection(page,section){

  const wrapper =
    document.createElement("div");

  wrapper.innerHTML =
    sectionShell(section);

  const element =
    wrapper.firstElementChild;

  page.appendChild(element);

  return element;

}


/* =========================================================
   PAGINATION
========================================================= */

function paginate(){

  if(!resumeData){
    return;
  }


  paper.innerHTML = "";

  paper.className =
    "paper preview-stack";


  const firstPage =
    createPage(1);


  addHeader(firstPage);

  paper.appendChild(firstPage);


  const sections =
    resumeData.sections || [];


  /*
   * 一页模式：
   * 不分页，允许内容在页面内部自然显示。
   */

  if(state.pageMode === "one"){

    for(const sectionData of sections){

      const section =
        addSection(
          firstPage,
          sectionData
        );


      for(const block of sectionData.blocks){

        addBlockToSection(
          section,
          block
        );

      }

    }


    finishPagination();

    return;

  }


  /*
   * 自动 / 两页模式
   */

  let currentPage =
    firstPage;


  for(const sectionData of sections){

    const section =
      addSection(
        currentPage,
        sectionData
      );


    let sectionOverflow =
      isOverflow(currentPage);


    /*
     * 整个 section 放不下：
     * 删除 section，重新按 block 分页。
     */

    if(sectionOverflow){

      currentPage.removeChild(
        section
      );


      currentPage =
        createPage(
          paper.children.length + 1
        );

      addHeader(currentPage);

      paper.appendChild(
        currentPage
      );


      const newSection =
        addSection(
          currentPage,
          sectionData
        );


      /*
       * block-by-block
       */

      for(const block of sectionData.blocks){

        const before =
          newSection.innerHTML;

        addBlockToSection(
          newSection,
          block
        );


        if(isOverflow(currentPage)){

          newSection.innerHTML =
            before;


          /*
           * 如果单个 block 本身
           * 就大于一页，则进一步拆 bullet。
           */

          const blockLines =
            block.lines || [];

          const blockBullets =
            block.bullets || [];


          const hasContent =
            blockLines.length ||
            blockBullets.length;


          if(!hasContent){
            continue;
          }


          let partial = {

            head:block.head || "",

            lines:[],

            bullets:[]

          };


          const candidates = [

            ...blockLines.map(
              line => ({
                type:"line",
                value:line
              })
            ),

            ...blockBullets.map(
              bullet => ({
                type:"bullet",
                value:bullet
              })
            )

          ];


          for(const item of candidates){

            if(item.type === "line"){

              partial.lines.push(
                item.value
              );

            }else{

              partial.bullets.push(
                item.value
              );

            }


            newSection.innerHTML = "";


            addBlockToSection(
              newSection,
              partial
            );


            if(isOverflow(currentPage)){

              /*
               * 删除最后一个元素
               */

              partial.lines =
                partial.lines.filter(
                  x => x !== item.value
                );

              partial.bullets =
                partial.bullets.filter(
                  x => x !== item.value
                );


              newSection.innerHTML = "";


              if(
                partial.lines.length ||
                partial.bullets.length
              ){

                addBlockToSection(
                  newSection,
                  partial
                );

              }


              /*
               * 创建下一页
               */

              currentPage =
                createPage(
                  paper.children.length + 1
                );

              addHeader(
                currentPage
              );

              paper.appendChild(
                currentPage
              );


              const nextSection =
                addSection(
                  currentPage,
                  sectionData
                );


              partial = {

                head:block.head || "",

                lines:[],
                bullets:[]

              };


              if(item.type === "line"){

                partial.lines.push(
                  item.value
                );

              }else{

                partial.bullets.push(
                  item.value
                );

              }


              nextSection.innerHTML = "";

              addBlockToSection(
                nextSection,
                partial
              );


              /*
               * 后续 item 使用新的 section
               */

              newSection.innerHTML = "";

              /*
               * 这里结束当前 block 的细粒度拆分。
               * 剩余内容继续以 block 形式加入下一页。
               */

            }

          }

        }

      }


      continue;

    }


    /*
     * 当前 section 正常放入。
     */

    for(const block of sectionData.blocks){

      addBlockToSection(
        section,
        block
      );


      if(isOverflow(currentPage)){

        /*
         * 删除刚刚添加的 block
         */

        const blocks =
          section.querySelectorAll(
            ".resume-block"
          );


        const last =
          blocks[blocks.length - 1];


        if(last){
          last.remove();
        }


        /*
         * 创建下一页
         */

        currentPage =
          createPage(
            paper.children.length + 1
          );

        addHeader(
          currentPage
        );

        paper.appendChild(
          currentPage
        );


        const nextSection =
          addSection(
            currentPage,
            sectionData
          );


        addBlockToSection(
          nextSection,
          block
        );

      }

    }

  }


  /*
   * 两页模式限制最多两页。
   */

  if(state.pageMode === "two"){

    while(
      paper.children.length > 2
    ){

      paper.lastElementChild.remove();

    }

  }


  finishPagination();

}


/* =========================================================
   FINISH
========================================================= */

function finishPagination(){

  const pageList =
    Array.from(
      paper.querySelectorAll(
        ".resume-page"
      )
    );


  pageList.forEach(
    (page,index) => {

      page.dataset.page =
        index + 1;

      page.querySelectorAll(
        ".page-number"
      ).forEach(
        node => node.remove()
      );


      const number =
        document.createElement("div");

      number.className =
        "page-number";


      number.textContent =
        `${index + 1} / ${pageList.length}`;


      page.appendChild(number);

    }
  );


  applyFont();

  applyTheme();

  applyTemplate();

  updateScale();

  save();

}


/* =========================================================
   FONT
========================================================= */

function applyFont(){

  if(!paper){
    return;
  }


  let family =
    "Arial, sans-serif";


  switch(state.font){

    case "pingfang":

      family =
        `"PingFang SC",
         "PingFang TC",
         "Microsoft YaHei",
         sans-serif`;

      break;


    case "yahei":

      family =
        `"Microsoft YaHei",
         "PingFang SC",
         sans-serif`;

      break;


    case "song":

      family =
        `"Songti SC",
         "SimSun",
         serif`;

      break;


    case "mono":

      family =
        `"SFMono-Regular",
         "Menlo",
         "Consolas",
         monospace`;

      break;

  }


  paper.style.fontFamily =
    family;


  paper.style.fontSize =
    `${state.fontSize}px`;


  if(sizeVal){

    sizeVal.textContent =
      `${state.fontSize}`;

  }

}


/* =========================================================
   SCALE
========================================================= */

function updateScale(){

  paper.style.transform =
    `scale(${state.zoom})`;


  if(zoomVal){

    zoomVal.textContent =
      `${Math.round(state.zoom * 100)}%`;

  }

}


/* =========================================================
   THEME
========================================================= */

function applyTheme(){

  const theme =
    THEMES[state.theme] ||
    THEMES.blue;


  document.documentElement
    .style
    .setProperty(
      "--accent",
      theme.main
    );


  document.documentElement
    .style
    .setProperty(
      "--accent-light",
      theme.light
    );


  paper
    .querySelectorAll(
      ".resume-page"
    )
    .forEach(
      page => {

        page.style.setProperty(
          "--accent",
          theme.main
        );

        page.style.setProperty(
          "--accent-light",
          theme.light
        );

      }
    );

}


/* =========================================================
   TEMPLATE
========================================================= */

function applyTemplate(){

  paper
    .querySelectorAll(
      ".resume-page"
    )
    .forEach(
      page => {

        page.classList.remove(
          "tech",
          "blueprint",
          "minimal",
          "terminal",
          "gray",
          "stripe",
          "business",
          "photo"
        );


        page.classList.add(
          state.template
        );

      }
    );

}


/* =========================================================
   PHOTO
========================================================= */

function getPhoto(){

  try{

    return localStorage.getItem(
      STORAGE.photo
    ) || "";

  }catch(error){

    console.warn(
      "读取证件照失败",
      error
    );

    return "";

  }

}


function renderPhotoPreview(){

  if(!photoPreview){
    return;
  }


  const photo =
    getPhoto();


  if(photo){

    photoPreview.src =
      photo;

    photoPreview.style.display =
      "block";


    if(removePhotoBtn){

      removePhotoBtn.disabled =
        false;

    }

  }else{

    photoPreview.removeAttribute(
      "src"
    );

    photoPreview.style.display =
      "none";


    if(removePhotoBtn){

      removePhotoBtn.disabled =
        true;

    }

  }

}


/* =========================================================
   SAVE
========================================================= */

function save(){

  try{

    localStorage.setItem(
      STORAGE.resume,
      source.value
    );


    localStorage.setItem(
      STORAGE.state,
      JSON.stringify(state)
    );


    if(saveState){

      saveState.textContent =
        "已保存";

    }

  }catch(error){

    console.warn(
      "保存失败",
      error
    );

  }

}


/* =========================================================
   LOAD
========================================================= */

function load(){

  try{

    const savedState =
      localStorage.getItem(
        STORAGE.state
      );


    if(savedState){

      state = {

        ...DEFAULT_STATE,

        ...JSON.parse(
          savedState
        )

      };

    }


    const savedResume =
      localStorage.getItem(
        STORAGE.resume
      );


    if(savedResume){

      source.value =
        savedResume;

    }else{

      source.value =
        DEMO_MD;

    }


    syncControls();

    renderPhotoPreview();

    render();

  }catch(error){

    console.warn(
      "加载失败",
      error
    );


    source.value =
      DEMO_MD;

    render();

  }

}


/* =========================================================
   CONTROLS
========================================================= */

function syncControls(){

  if(templates){

    templates.value =
      state.template;

  }


  if(themes){

    themes.value =
      state.theme;

  }


  if(pages){

    pages.value =
      state.pageMode;

  }


  if(photoMode){

    photoMode.value =
      state.showPhoto
        ? "show"
        : "hide";

  }


  if(font){

    font.value =
      state.font;

  }


  if(size){

    size.value =
      state.fontSize;

  }


  if(zoom){

    zoom.value =
      state.zoom;

  }

}


/* =========================================================
   RENDER
========================================================= */

function render(){

  try{

    resumeData =
      parseInput(
        source.value
      );


    if(!resumeData){

      paper.innerHTML = "";

      return;

    }


    paginate();

  }catch(error){

    console.error(
      "简历渲染失败",
      error
    );


    alert(
      "简历渲染失败，请检查输入内容。"
    );

  }

}


/* =========================================================
   FILE IMPORT
========================================================= */

function readFile(file){

  if(!file){
    return;
  }


  const reader =
    new FileReader();


  reader.onload =
    event => {

      source.value =
        event.target.result || "";


      render();

      save();

    };


  reader.onerror =
    () => {

      alert(
        "文件读取失败。"
      );

    };


  reader.readAsText(
    file,
    "UTF-8"
  );

}


/* =========================================================
   PHOTO IMPORT
========================================================= */

function readPhoto(file){

  if(!file){
    return;
  }


  if(
    !file.type.startsWith(
      "image/"
    )
  ){

    alert(
      "请选择 JPG、PNG 或 WebP 图片。"
    );

    return;

  }


  const reader =
    new FileReader();


  reader.onload =
    event => {

      try{

        localStorage.setItem(
          STORAGE.photo,
          event.target.result
        );


        renderPhotoPreview();

        render();

      }catch(error){

        alert(
          "证件照保存失败，图片可能过大。"
        );

      }

    };


  reader.readAsDataURL(
    file
  );

}


/* =========================================================
   PRINT
   V1.4.0
========================================================= */

/*
 * 这里是本版本最重要的修改。
 *
 * 不再：
 *
 * iframe
 * hidden iframe
 * iframe.contentWindow.print()
 *
 * 而是：
 *
 * 用户点击
 *    ↓
 * window.open() 同步创建顶层窗口
 *    ↓
 * 写入已经分页完成的简历
 *    ↓
 * 独立打印
 *
 * 这样可以避免 Chrome Popup/iframe 打印限制，
 * 同时避免 Safari 把主页面的 A4布局参与打印分页。
 */


/* =========================================================
   PRINT FONT
========================================================= */

function getPrintFontFamily(){

  switch(state.font){

    case "pingfang":

      return `
        "PingFang SC",
        "PingFang TC",
        "Microsoft YaHei",
        sans-serif
      `;

    case "yahei":

      return `
        "Microsoft YaHei",
        "PingFang SC",
        sans-serif
      `;

    case "song":

      return `
        "Songti SC",
        "SimSun",
        serif
      `;

    case "mono":

      return `
        "SFMono-Regular",
        "Menlo",
        "Consolas",
        monospace
      `;

    default:

      return `
        Arial,
        sans-serif
      `;

  }

}


/* =========================================================
   GET SCREEN STYLES
========================================================= */

function getScreenStyles(){

  const links =
    Array.from(
      document.querySelectorAll(
        'link[rel="stylesheet"]'
      )
    );


  const styles =
    links.map(
      link => {

        const href =
          link.getAttribute(
            "href"
          );

        if(!href){
          return "";
        }

        return `
          <link
            rel="stylesheet"
            href="${escapeHTML(href)}"
          >
        `;

      }
    )
    .join("\n");


  return styles;

}


/* =========================================================
   PRINT CSS
========================================================= */

function getPrintCSS(){

  const fontFamily =
    getPrintFontFamily();


  return `

    html,
    body{

      margin:0 !important;
      padding:0 !important;

      width:210mm !important;

      background:#fff !important;

      font-family:${fontFamily};

    }


    @page{

      size:A4 portrait;

      margin:0;

    }


    *{

      box-sizing:border-box;

    }


    body{

      width:210mm;

      background:#fff;

    }


    /*
     * 一个 print-page 就是一张纸。
     *
     * 高度故意使用 296mm，
     * 不使用 297mm。
     *
     * 这样可以给 Safari/WebKit 留出极小的
     * 浮点计算余量，避免：
     *
     * 297mm + page break
     *
     * 被计算成下一页。
     */

    .print-page{

      position:relative;

      width:210mm !important;

      height:296mm !important;

      min-width:210mm !important;

      max-width:210mm !important;

      min-height:296mm !important;

      max-height:296mm !important;

      margin:0 !important;

      padding:0 !important;

      overflow:hidden !important;

      background:#fff !important;

      box-shadow:none !important;

      transform:none !important;

      break-inside:avoid !important;

      page-break-inside:avoid !important;

      break-after:page !important;

      page-break-after:always !important;

    }


    .print-page:last-child{

      break-after:auto !important;

      page-break-after:auto !important;

    }


    /*
     * 原来的 resume-page 是 794 × 1123px。
     *
     * 打印时我们让内部内容按照 A4 比例缩放到
     * 296mm 的实际高度。
     */

    .print-inner{

      position:absolute;

      left:0;

      top:0;

      width:210mm;

      height:297mm;

      transform:
        scale(0.996633);

      transform-origin:
        top left;

      overflow:hidden;

      background:#fff;

    }


    /*
     * 原有模板样式继续负责具体排版。
     * 这里仅取消屏幕阴影、外部间距和缩放。
     */

    .print-inner .resume-page{

      width:210mm !important;

      height:297mm !important;

      min-width:210mm !important;

      max-width:210mm !important;

      min-height:297mm !important;

      max-height:297mm !important;

      margin:0 !important;

      box-shadow:none !important;

      transform:none !important;

      overflow:hidden !important;

    }


    .print-inner .page-number{

      display:none !important;

    }


    img{

      -webkit-print-color-adjust:
        exact !important;

      print-color-adjust:
        exact !important;

    }


    .resume-page{

      -webkit-print-color-adjust:
        exact !important;

      print-color-adjust:
        exact !important;

    }


    /*
     * 禁止打印页内部元素自行产生分页。
     */

    .resume-section,
    .resume-block,
    .resume-header{

      break-inside:avoid;

      page-break-inside:avoid;

    }

  `;

}


/* =========================================================
   BUILD PRINT DOCUMENT
========================================================= */

function buildPrintDocument(printWindow){

  if(!printWindow){
    return false;
  }


  const pagesToPrint =
    Array.from(
      paper.querySelectorAll(
        ".resume-page"
      )
    );


  if(!pagesToPrint.length){

    return false;

  }


  const styleLinks =
    getScreenStyles();


  const pagesHTML =
    pagesToPrint
      .map(
        (page,index) => {

          const clone =
            page.cloneNode(true);


          /*
           * 打印页中不需要页码。
           */

          clone
            .querySelectorAll(
              ".page-number"
            )
            .forEach(
              node => node.remove()
            );


          /*
           * 原来的 .resume-page 会受到
           * 屏幕CSS影响。
           *
           * 外面增加 print-page，
           * 里面使用 print-inner。
           */

          const html =
            clone.outerHTML;


          return `

            <div
              class="print-page"
              data-page="${index + 1}"
            >

              <div class="print-inner">

                ${html}

              </div>

            </div>

          `;

        }
      )
      .join("\n");


  const html = `

<!DOCTYPE html>

<html lang="zh-CN">

<head>

  <meta
    charset="UTF-8"
  >

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  >

  <title>ResumeFlow - PDF</title>

  ${styleLinks}

  <style>

    ${getPrintCSS()}

  </style>

</head>

<body>

  ${pagesHTML}

</body>

</html>

  `;


  printWindow.document.open();

  printWindow.document.write(
    html
  );

  printWindow.document.close();


  return true;

}


/* =========================================================
   WAIT PRINT DOCUMENT
========================================================= */

async function waitPrintDocument(printWindow){

  if(!printWindow){
    return;
  }


  const doc =
    printWindow.document;


  /*
   * 等待 DOM。
   */

  if(
    doc.readyState !==
    "complete"
  ){

    await new Promise(
      resolve => {

        printWindow.addEventListener(
          "load",
          resolve,
          {
            once:true
          }
        );

      }
    );

  }


  /*
   * 等待图片。
   */

  const images =
    Array.from(
      doc.images || []
    );


  if(images.length){

    await Promise.all(

      images.map(
        image => {

          if(image.complete){

            return Promise.resolve();

          }


          return new Promise(
            resolve => {

              image.addEventListener(
                "load",
                resolve,
                {
                  once:true
                }
              );

              image.addEventListener(
                "error",
                resolve,
                {
                  once:true
                }
              );

            }
          );

        }
      )

    );

  }


  /*
   * 等一帧，让浏览器完成 layout。
   */

  await new Promise(
    resolve =>
      printWindow.requestAnimationFrame(
        () =>
          printWindow.requestAnimationFrame(
            resolve
          )
      )
  );


}


/* =========================================================
   PRINT RESUME
========================================================= */

async function printResume(){

  if(!source.value.trim()){

    alert(
      "请先导入或粘贴简历。"
    );

    return;

  }


  /*
   * 先重新渲染。
   */

  render();


  /*
   * 关键：
   *
   * window.open 必须发生在用户点击事件的同步阶段。
   *
   * 不要放进 setTimeout。
   * 不要放进 await。
   * 不要先等待 iframe。
   */

  const printWindow =
    window.open(
      "",
      "_blank"
    );


  /*
   * 如果浏览器拦截弹窗。
   */

  if(!printWindow){

    alert(
      "浏览器阻止了打印窗口。\n\n" +
      "请允许 ResumeFlow 打开新窗口，然后再次点击「导出 PDF」。"
    );

    return;

  }


  /*
   * 先写入一个简单的加载页面。
   */

  try{

    printWindow.document.open();

    printWindow.document.write(`

      <!DOCTYPE html>

      <html lang="zh-CN">

      <head>

        <meta charset="UTF-8">

        <title>ResumeFlow PDF</title>

      </head>

      <body
        style="
          margin:0;
          padding:40px;
          font-family:Arial,sans-serif;
        "
      >

        正在准备 PDF……

      </body>

      </html>

    `);

    printWindow.document.close();

  }catch(error){

    console.error(
      "创建打印页面失败",
      error
    );

    try{
      printWindow.close();
    }catch(_){}

    alert(
      "无法创建打印页面。"
    );

    return;

  }


  /*
   * 写入真正的打印文档。
   */

  const success =
    buildPrintDocument(
      printWindow
    );


  if(!success){

    alert(
      "没有可打印的简历页面。"
    );

    return;

  }


  /*
   * 等待资源。
   */

  try{

    await waitPrintDocument(
      printWindow
    );

  }catch(error){

    console.warn(
      "等待打印页面资源时出现异常",
      error
    );

  }


  /*
   * 再次聚焦。
   */

  try{

    printWindow.focus();

  }catch(error){

    console.warn(
      error
    );

  }


  /*
   * 打印。
   *
   * 这里不关闭窗口。
   *
   * Safari / Chrome 都保留独立打印页，
   * 用户可以检查页面后再返回。
   */

  try{

    printWindow.print();

  }catch(error){

    console.error(
      "打印调用失败",
      error
    );


    /*
     * 如果浏览器没有自动弹出打印对话框，
     * 打印页面仍然存在。
     *
     * 用户可以在新窗口中手动执行打印。
     */

    alert(
      "打印窗口已经打开，但浏览器没有自动弹出打印对话框。\n\n" +
      "请在新打开的 ResumeFlow PDF 页面中手动选择「打印」。"
    );

  }

}


/* =========================================================
   EVENTS
========================================================= */


/*
 * DEMO
 */

if(demoBtn){

  demoBtn.addEventListener(
    "click",
    () => {

      source.value =
        DEMO_MD;

      render();

      save();

    }
  );

}


/*
 * PDF
 */

if(pdfBtn){

  pdfBtn.addEventListener(
    "click",
    () => {

      /*
       * 注意：
       * 这里直接调用。
       *
       * 不使用：
       *
       * setTimeout
       * Promise.then
       * iframe
       *
       * window.open 必须保留在用户手势链路中。
       */

      printResume();

    }
  );

}


/*
 * RENDER
 */

if(renderBtn){

  renderBtn.addEventListener(
    "click",
    () => {

      render();

      save();

    }
  );

}


/*
 * CLEAR
 */

if(clearBtn){

  clearBtn.addEventListener(
    "click",
    () => {

      source.value = "";

      resumeData = null;

      paper.innerHTML = "";

      save();

    }
  );

}


/*
 * FILE BUTTON
 */

if(fileBtn){

  fileBtn.addEventListener(
    "click",
    () => {

      fileInput?.click();

    }
  );

}


if(fileInput){

  fileInput.addEventListener(
    "change",
    event => {

      const file =
        event.target.files?.[0];

      if(file){

        readFile(file);

      }

      event.target.value = "";

    }
  );

}


/*
 * DROP
 */

if(dropZone){

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
          ?.files?.[0];


      if(file){

        readFile(file);

      }

    }
  );

}


/*
 * PHOTO
 */

if(photoBtn){

  photoBtn.addEventListener(
    "click",
    () => {

      photoFile?.click();

    }
  );

}


if(photoFile){

  photoFile.addEventListener(
    "change",
    event => {

      const file =
        event.target.files?.[0];

      if(file){

        readPhoto(file);

      }

      event.target.value = "";

    }
  );

}


if(removePhotoBtn){

  removePhotoBtn.addEventListener(
    "click",
    () => {

      localStorage.removeItem(
        STORAGE.photo
      );

      renderPhotoPreview();

      render();

      save();

    }
  );

}


/*
 * TEMPLATE
 */

if(templates){

  templates.addEventListener(
    "change",
    () => {

      state.template =
        templates.value;

      applyTemplate();

      save();

    }
  );

}


/*
 * THEME
 */

if(themes){

  themes.addEventListener(
    "change",
    () => {

      state.theme =
        themes.value;

      applyTheme();

      save();

    }
  );

}


/*
 * PAGE MODE
 */

if(pages){

  pages.addEventListener(
    "change",
    () => {

      state.pageMode =
        pages.value;

      render();

      save();

    }
  );

}


/*
 * PHOTO MODE
 */

if(photoMode){

  photoMode.addEventListener(
    "change",
    () => {

      state.showPhoto =
        photoMode.value ===
        "show";

      render();

      save();

    }
  );

}


/*
 * FONT
 */

if(font){

  font.addEventListener(
    "change",
    () => {

      state.font =
        font.value;

      applyFont();

      save();

    }
  );

}


/*
 * FONT SIZE
 */

if(size){

  size.addEventListener(
    "input",
    () => {

      state.fontSize =
        Number(
          size.value
        );


      applyFont();

      save();

    }
  );

}


/*
 * ZOOM
 */

if(zoom){

  zoom.addEventListener(
    "input",
    () => {

      state.zoom =
        Number(
          zoom.value
        );


      updateScale();

      save();

    }
  );

}


/*
 * SOURCE AUTO SAVE
 */

if(source){

  let saveTimer = null;


  source.addEventListener(
    "input",
    () => {

      clearTimeout(
        saveTimer
      );


      saveTimer =
        setTimeout(
          () => {

            save();

          },
          300
        );

    }
  );

}


/* =========================================================
   PWA
========================================================= */

if(
  "serviceWorker"
  in navigator
){

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker
        .register(
          "./sw.js?v=1.4.0"
        )
        .catch(
          error => {

            console.warn(
              "Service Worker 注册失败",
              error
            );

          }
        );

    }
  );

}


/* =========================================================
   START
========================================================= */

load();

})();