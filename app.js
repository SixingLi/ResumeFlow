/* =========================================================
   ResumeFlow V1.4.1

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

   V1.4.1：
   - 移除 print-inner
   - 每个 resume-page 直接作为一个打印页
   - 避免 296mm 外层 + 297mm 内层造成空白页
   - 不使用 iframe
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
   * 一页模式
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


    if(isOverflow(currentPage)){

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


      for(const block of sectionData.blocks){

        addBlockToSection(
          newSection,
          block
        );


        if(isOverflow(currentPage)){

          const blocks =
            newSection.querySelectorAll(
              ".resume-block"
            );


          const last =
            blocks[blocks.length - 1];


          if(last){
            last.remove();
          }


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


      continue;

    }


    for(const block of sectionData.blocks){

      addBlockToSection(
        section,
        block
      );


      if(isOverflow(currentPage)){

        const blocks =
          section.querySelectorAll(
            ".resume-block"
          );


        const last =
          blocks[blocks.length - 1];


        if(last){
          last.remove();
        }


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
   * 两页模式最多两页
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
   SCREEN CSS
========================================================= */

/*
 * 从当前页面获取 stylesheet。
 *
 * 这里不直接复制 @media print，
 * 防止原页面的打印CSS再次干扰独立打印页。
 */

function getScreenCSS(){

  let css = "";


  const sheets =
    Array.from(
      document.styleSheets
    );


  for(const sheet of sheets){

    try{

      const rules =
        Array.from(
          sheet.cssRules || []
        );


      for(const rule of rules){

        /*
         * 跳过 @media print
         */

        if(
          rule.type ===
          CSSRule.MEDIA_RULE
        ){

          if(
            String(
              rule.conditionText || ""
            )
            .toLowerCase()
            .includes("print")
          ){

            continue;

          }


          css +=
            rule.cssText +
            "\n";

          continue;

        }


        css +=
          rule.cssText +
          "\n";

      }

    }catch(error){

      /*
       * 某些 stylesheet 可能因为浏览器安全策略
       * 无法读取，忽略即可。
       */

      console.warn(
        "读取stylesheet失败",
        error
      );

    }

  }


  return css;

}


/* =========================================================
   PRINT CSS
========================================================= */

function getPrintCSS(){

  const fontFamily =
    getPrintFontFamily();


  return `

    @page{

      size:A4 portrait;

      margin:0;

    }


    html{

      margin:0 !important;

      padding:0 !important;

      width:210mm !important;

      background:#fff !important;

    }


    body{

      margin:0 !important;

      padding:0 !important;

      width:210mm !important;

      background:#fff !important;

      font-family:${fontFamily};

    }


    *{

      box-sizing:border-box;

    }


    /*
     * 关键：
     *
     * resume-page 本身就是打印页。
     *
     * 不再使用：
     *
     * print-page
     *   └── print-inner
     *       └── resume-page
     *
     * 避免嵌套高度导致浏览器额外分页。
     */

    .resume-page.print-page{

      position:relative !important;

      display:block !important;

      width:210mm !important;

      height:296mm !important;

      min-width:210mm !important;

      max-width:210mm !important;

      min-height:296mm !important;

      max-height:296mm !important;

      margin:0 !important;

      padding:52px 62px !important;

      overflow:hidden !important;

      background:#fff !important;

      box-shadow:none !important;

      transform:none !important;

      font-family:${fontFamily} !important;

      font-size:${state.fontSize}px !important;

      line-height:1.55 !important;

      /*
       * 只使用 page-break-after。
       *
       * 不同时使用 break-after，
       * 降低 Safari/WebKit 双重分页解释的概率。
       */

      page-break-inside:avoid !important;

      page-break-after:always !important;

    }


    /*
     * 模板 padding
     */

    .resume-page.print-page.minimal{

      padding:48px 58px !important;

    }


    .resume-page.print-page.stripe{

      padding-left:58px !important;

    }


    .resume-page.print-page.page-one{

      padding-top:43px !important;

      padding-bottom:40px !important;

      font-size:12px !important;

    }


    /*
     * 最后一页不需要强制下一页。
     */

    .resume-page.print-page:last-child{

      page-break-after:auto !important;

    }


    /*
     * 隐藏页码。
     */

    .resume-page.print-page
    .page-number{

      display:none !important;

    }


    /*
     * 防止内部 section 自己分页。
     */

    .resume-page.print-page
    .resume-section{

      page-break-inside:avoid !important;

    }


    .resume-page.print-page
    .resume-block{

      page-break-inside:avoid !important;

    }


    .resume-page.print-page
    .resume-header{

      page-break-inside:avoid !important;

    }


    img{

      -webkit-print-color-adjust:exact !important;

      print-color-adjust:exact !important;

    }


    .resume-page.print-page{

      -webkit-print-color-adjust:exact !important;

      print-color-adjust:exact !important;

    }


    /*
     * 打印时取消纸张之间的任何外部间距。
     */

    .resume-page.print-page + .resume-page.print-page{

      margin-top:0 !important;

    }

  `;

}


/* =========================================================
   BUILD PRINT WINDOW
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


  const screenCSS =
    getScreenCSS();


  const printCSS =
    getPrintCSS();


  const pagesHTML =
    pagesToPrint
      .map(
        (page,index) => {

          const clone =
            page.cloneNode(true);


          /*
           * 删除预览页码。
           */

          clone
            .querySelectorAll(
              ".page-number"
            )
            .forEach(
              node =>
                node.remove()
            );


          /*
           * 保留原来的模板 class，
           * 同时增加 print-page。
           *
           * 例如：
           *
           * resume-page tech
           *
           * 变成：
           *
           * resume-page tech print-page
           */

          clone.classList.add(
            "print-page"
          );


          clone.dataset.page =
            index + 1;


          return clone.outerHTML;

        }
      )
      .join("\n");


  const html = `

<!DOCTYPE html>

<html lang="zh-CN">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  >

  <title>ResumeFlow PDF</title>

  <style>

    ${screenCSS}

  </style>

  <style>

    ${printCSS}

  </style>

</head>

<body>

  ${pagesHTML}

</body>

</html>

  `;


  try{

    printWindow.document.open();

    printWindow.document.write(
      html
    );

    printWindow.document.close();

  }catch(error){

    console.error(
      "写入打印文档失败",
      error
    );

    return false;

  }


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
   * 等待浏览器完成 layout。
   */

  await new Promise(
    resolve => {

      printWindow.requestAnimationFrame(
        () => {

          printWindow.requestAnimationFrame(
            resolve
          );

        }
      );

    }
  );

}


/* =========================================================
   PRINT
========================================================= */

function printResume(){

  if(!source.value.trim()){

    alert(
      "请先导入或粘贴简历。"
    );

    return;

  }


  /*
   * 重新渲染预览。
   */

  render();


  /*
   * 极其重要：
   *
   * window.open 必须直接发生在点击事件中。
   *
   * 不放进 setTimeout。
   * 不放进 Promise。
   * 不放进 await。
   */

  const printWindow =
    window.open(
      "",
      "_blank"
    );


  if(!printWindow){

    alert(
      "浏览器阻止了新窗口。\n\n" +
      "请允许 ResumeFlow 打开新窗口，然后再次点击「导出 PDF」。"
    );

    return;

  }


  /*
   * 先立即显示加载状态。
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
   * 使用当前已经分页好的 resume-page
   * 构造独立打印页面。
   */

  const success =
    buildPrintDocument(
      printWindow
    );


  if(!success){

    try{
      printWindow.close();
    }catch(_){}

    alert(
      "没有可打印的简历页面。"
    );

    return;

  }


  /*
   * 等待图片与 layout。
   *
   * 注意：
   * window.open 已经在用户点击的同步阶段完成，
   * 因此这里不会再触发 Chrome 的 Popup 阻止问题。
   */

  waitPrintDocument(
    printWindow
  )
  .then(
    () => {

      try{

        printWindow.focus();

        printWindow.print();

      }catch(error){

        console.error(
          "打印失败",
          error
        );


        alert(
          "打印窗口已经打开，但浏览器没有自动弹出打印界面。\n\n" +
          "请在新窗口中手动选择打印。"
        );

      }

    }
  )
  .catch(
    error => {

      console.warn(
        "等待打印资源失败",
        error
      );


      try{

        printWindow.focus();

        printWindow.print();

      }catch(printError){

        console.error(
          printError
        );

      }

    }
  );

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
 * FILE
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
          "./sw.js?v=1.4.1"
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