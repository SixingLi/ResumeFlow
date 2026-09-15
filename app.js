/* =========================================================
   ResumeFlow V1.3.9

   核心：
   1. Markdown / TXT / JSON
   2. 8模板
   3. 6主题色
   4. 证件照
   5. 自动A4分页
   6. 一页 / 两页 / 自动
   7. A4所见即所得预览
   8. 独立打印 iframe PDF
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
    const [type, aliases]
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
      beforeFirstSection
        .join(" | ");

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


  const mapping = {

    summary:"个人优势",

    skills:"核心技能",

    experience:"工作经历",

    projects:"项目经历",

    education:"教育背景",

    certificates:"证书",

    awards:"获奖经历"

  };


  for(
    const [key,title]
    of Object.entries(mapping)
  ){

    if(
      obj[key] !== undefined
    ){

      const value =
        obj[key];

      const lines =
        Array.isArray(value)
          ? value
          : [value];

      result.sections.push({

        type:key,

        title,

        blocks:[{

          head:"",

          lines:lines
            .filter(Boolean)
            .map(
              x => stripMD(String(x))
            ),

          bullets:[]

        }]

      });

    }

  }


  return result;

}


/* =========================================================
   PARSE INPUT
========================================================= */

function parseInput(text){

  const trimmed =
    clean(text);

  if(!trimmed){

    return {

      name:"姓名",

      title:"",

      contact:"",

      sections:[]

    };

  }


  if(
    trimmed.startsWith("{") ||
    trimmed.startsWith("[")
  ){

    try{

      return parseJSON(trimmed);

    }catch(e){

      console.warn(
        "JSON解析失败，按Markdown处理",
        e
      );

    }

  }


  return parseMarkdown(trimmed);

}


/* =========================================================
   HTML BLOCK
========================================================= */

function blockHTML(block){

  let html = "";


  if(block.head){

    html +=
      `<div class="item-head">${escapeHTML(block.head)}</div>`;

  }


  for(
    const line
    of block.lines
  ){

    if(!line){
      continue;
    }

    html +=
      `<div class="paragraph">${escapeHTML(line)}</div>`;

  }


  if(
    block.bullets &&
    block.bullets.length
  ){

    html += "<ul>";

    for(
      const bullet
      of block.bullets
    ){

      html +=
        `<li>${escapeHTML(bullet)}</li>`;

    }

    html += "</ul>";

  }


  return html;

}


function sectionShell(title){

  const section =
    document.createElement("section");

  section.className =
    "section";


  const titleEl =
    document.createElement("div");

  titleEl.className =
    "section-title";

  titleEl.textContent =
    title;


  const body =
    document.createElement("div");

  body.className =
    "section-body";


  section.appendChild(titleEl);
  section.appendChild(body);


  return section;

}


/* =========================================================
   HEADER HTML
========================================================= */

function headerHTML(data){

  let photo = "";


  if(
    state.showPhoto &&
    getPhoto()
  ){

    photo = `
      <div class="resume-photo">
        <img src="${getPhoto()}">
      </div>
    `;

  }


  return `

    <div class="paper-header">

      <div class="identity">

        <div class="name">
          ${escapeHTML(data.name)}
        </div>

        ${
          data.title
          ? `
            <div class="title">
              ${escapeHTML(data.title)}
            </div>
          `
          : ""
        }

        ${
          data.contact
          ? `
            <div class="contact">
              ${escapeHTML(data.contact)}
            </div>
          `
          : ""
        }

      </div>

      ${photo}

    </div>

  `;

}


/* =========================================================
   CREATE PAGE
========================================================= */

function createPage(pageNumber){

  const page =
    document.createElement("div");

  page.className =
    `resume-page ${state.template}`;

  page.style.setProperty(
    "--accent",
    THEMES[state.theme].main
  );

  page.style.setProperty(
    "--accent-soft",
    THEMES[state.theme].light
  );


  if(state.pageMode === "one"){

    page.classList.add(
      "page-one"
    );

  }


  if(state.pageMode === "two"){

    page.classList.add(
      "page-two"
    );

  }


  const pageNumberEl =
    document.createElement("div");

  pageNumberEl.className =
    "page-number";

  pageNumberEl.textContent =
    pageNumber;


  page.appendChild(
    pageNumberEl
  );


  return page;

}


/* =========================================================
   ADD HEADER
========================================================= */

function addHeader(page,data){

  const wrapper =
    document.createElement("div");

  wrapper.innerHTML =
    headerHTML(data);

  page.insertBefore(
    wrapper.firstElementChild,
    page.firstChild
  );

}


/* =========================================================
   OVERFLOW CHECK
========================================================= */

function isOverflow(page){

  return (
    page.scrollHeight >
    page.clientHeight + 2
  );

}


/* =========================================================
   ADD SECTION
========================================================= */

function addSection(page,section){

  const el =
    sectionShell(
      section.title
    );

  const body =
    el.querySelector(
      ".section-body"
    );


  for(
    const block
    of section.blocks
  ){

    const holder =
      document.createElement("div");

    holder.innerHTML =
      blockHTML(block);

    while(
      holder.firstElementChild
    ){

      body.appendChild(
        holder.firstElementChild
      );

    }

  }


  page.appendChild(el);

  return el;

}


/* =========================================================
   SPLIT BLOCK
========================================================= */

function addBlockToSection(
  sectionEl,
  block
){

  const body =
    sectionEl.querySelector(
      ".section-body"
    );

  const holder =
    document.createElement("div");

  holder.innerHTML =
    blockHTML(block);

  while(
    holder.firstElementChild
  ){

    body.appendChild(
      holder.firstElementChild
    );

  }

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


  const pagesOut = [];

  let currentPage =
    createPage(1);

  paper.appendChild(
    currentPage
  );

  pagesOut.push(
    currentPage
  );


  addHeader(
    currentPage,
    resumeData
  );


  /*
    一页模式：
    不拆分页。
  */

  if(
    state.pageMode === "one"
  ){

    for(
      const section
      of resumeData.sections
    ){

      addSection(
        currentPage,
        section
      );

    }

    finishPagination();

    return;

  }


  /*
    自动 / 两页模式
  */

  let pageIndex = 1;


  for(
    const section
    of resumeData.sections
  ){

    const candidate =
      addSection(
        currentPage,
        section
      );


    if(
      !isOverflow(currentPage)
    ){

      continue;

    }


    /*
      整个section放不下：
      移除，然后从block级别重新分页。
    */

    currentPage.removeChild(
      candidate
    );


    let sectionPage =
      currentPage;

    let sectionEl =
      sectionShell(
        section.title
      );

    sectionPage.appendChild(
      sectionEl
    );


    for(
      const block
      of section.blocks
    ){

      const before =
        sectionEl
          .querySelector(
            ".section-body"
          )
          .innerHTML;

      addBlockToSection(
        sectionEl,
        block
      );


      if(
        !isOverflow(sectionPage)
      ){

        continue;

      }


      /*
        当前block放不下。
      */

      sectionEl
        .querySelector(
          ".section-body"
        )
        .innerHTML =
        before;


      /*
        如果当前section已经有内容，
        先开启新页。
      */

      const body =
        sectionEl
          .querySelector(
            ".section-body"
          );


      if(body.children.length){

        pageIndex++;

        currentPage =
          createPage(
            pageIndex
          );

        paper.appendChild(
          currentPage
        );

        pagesOut.push(
          currentPage
        );


        sectionEl =
          sectionShell(
            section.title
          );

        currentPage.appendChild(
          sectionEl
        );

      }


      /*
        再尝试放block。
      */

      addBlockToSection(
        sectionEl,
        block
      );


      /*
        如果单个block依旧放不下，
        对bullet进行拆分。
      */

      if(
        isOverflow(currentPage)
      ){

        sectionEl
          .querySelector(
            ".section-body"
          )
          .innerHTML = "";


        const head =
          block.head || "";


        if(head){

          const headEl =
            document.createElement(
              "div"
            );

          headEl.className =
            "item-head";

          headEl.textContent =
            head;

          sectionEl
            .querySelector(
              ".section-body"
            )
            .appendChild(
              headEl
            );

        }


        for(
          const bullet
          of block.bullets
        ){

          let list =
            sectionEl
              .querySelector(
                ".section-body ul"
              );


          if(!list){

            list =
              document.createElement(
                "ul"
              );

            sectionEl
              .querySelector(
                ".section-body"
              )
              .appendChild(
                list
              );

          }


          const li =
            document.createElement(
              "li"
            );

          li.textContent =
            bullet;

          list.appendChild(li);


          if(
            isOverflow(
              currentPage
            )
          ){

            list.removeChild(li);

            pageIndex++;

            currentPage =
              createPage(
                pageIndex
              );

            paper.appendChild(
              currentPage
            );

            pagesOut.push(
              currentPage
            );


            sectionEl =
              sectionShell(
                section.title
              );

            currentPage.appendChild(
              sectionEl
            );


            const newList =
              document.createElement(
                "ul"
              );

            sectionEl
              .querySelector(
                ".section-body"
              )
              .appendChild(
                newList
              );


            const newLi =
              document.createElement(
                "li"
              );

            newLi.textContent =
              bullet;

            newList.appendChild(
              newLi
            );

          }

        }

      }

    }

  }


  /*
    两页模式最多保留两页。
  */

  if(
    state.pageMode === "two" &&
    pagesOut.length > 2
  ){

    while(
      pagesOut.length > 2
    ){

      const last =
        pagesOut.pop();

      last.remove();

    }

  }


  /*
    更新页码。
  */

  const finalPages =
    Array.from(
      paper.querySelectorAll(
        ".resume-page"
      )
    );


  finalPages.forEach(
    (page,index) => {

      const number =
        page.querySelector(
          ".page-number"
        );

      if(number){

        number.textContent =
          `${index + 1} / ${finalPages.length}`;

      }

    }
  );


  finishPagination();

}


/* =========================================================
   FINISH
========================================================= */

function finishPagination(){

  applyFont();

  updateScale();

  save();

}


/* =========================================================
   FONT
========================================================= */

function applyFont(){

  const fontMap = {

    pingfang:
      '-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif',

    yahei:
      '"Microsoft YaHei","PingFang SC",sans-serif',

    system:
      'system-ui,-apple-system,BlinkMacSystemFont,sans-serif'

  };


  paper.style.fontFamily =
    fontMap[state.font]
    || fontMap.pingfang;


  paper.style.fontSize =
    `${state.fontSize}px`;


  sizeVal.textContent =
    state.fontSize;

}


/* =========================================================
   SCALE
========================================================= */

function updateScale(){

  const scale =
    Number(state.zoom) || .8;


  paper.style.transform =
    `scale(${scale})`;


  zoomVal.textContent =
    `${Math.round(scale * 100)}%`;

}


/* =========================================================
   THEME
========================================================= */

function applyTheme(){

  const theme =
    THEMES[state.theme]
    || THEMES.blue;


  document.documentElement
    .style.setProperty(
      "--accent",
      theme.main
    );


  document.documentElement
    .style.setProperty(
      "--accent-soft",
      theme.light
    );


  document.querySelectorAll(
    ".theme"
  ).forEach(btn => {

    btn.classList.toggle(
      "active",
      btn.dataset.theme
      === state.theme
    );

  });


  document.querySelectorAll(
    ".resume-page"
  ).forEach(page => {

    page.style.setProperty(
      "--accent",
      theme.main
    );

    page.style.setProperty(
      "--accent-soft",
      theme.light
    );

  });

}


/* =========================================================
   TEMPLATE
========================================================= */

function applyTemplate(){

  document.querySelectorAll(
    ".template button"
  ).forEach(btn => {

    btn.classList.toggle(
      "active",
      btn.dataset.t
      === state.template
    );

  });

}


/* =========================================================
   PHOTO
========================================================= */

function getPhoto(){

  return localStorage.getItem(
    STORAGE.photo
  ) || "";

}


function renderPhotoPreview(){

  const photo =
    getPhoto();


  if(photo){

    photoPreview.innerHTML =
      `<img src="${photo}" alt="">`;

    removePhotoBtn.disabled =
      false;

  }else{

    photoPreview.innerHTML =
      "<span>证件照</span>";

    removePhotoBtn.disabled =
      true;

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

    saveState.textContent =
      "已保存";

    setTimeout(() => {

      saveState.textContent =
        "本地自动保存";

    },1200);

  }catch(e){

    console.warn(
      "保存失败",
      e
    );

  }

}


/* =========================================================
   LOAD
========================================================= */

function load(){

  try{

    const text =
      localStorage.getItem(
        STORAGE.resume
      );

    if(text){

      source.value =
        text;

    }


    const saved =
      localStorage.getItem(
        STORAGE.state
      );


    if(saved){

      state = {

        ...DEFAULT_STATE,

        ...JSON.parse(saved)

      };

    }

  }catch(e){

    console.warn(
      "读取本地状态失败",
      e
    );

  }


  pages.value =
    state.pageMode;

  photoMode.value =
    state.showPhoto
      ? "show"
      : "hide";

  font.value =
    state.font;

  size.value =
    state.fontSize;

  zoom.value =
    state.zoom;


  applyTemplate();

  applyTheme();

  renderPhotoPreview();


  if(source.value.trim()){

    try{

      resumeData =
        parseInput(
          source.value
        );

      paginate();

    }catch(e){

      console.warn(
        "自动恢复简历失败",
        e
      );

    }

  }

}


/* =========================================================
   RENDER
========================================================= */

function render(){

  resumeData =
    parseInput(
      source.value
    );

  paginate();

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
        event.target.result
        || "";

      render();

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
    ![
      "image/jpeg",
      "image/png",
      "image/webp"
    ].includes(file.type)
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

        if(source.value.trim()){

          render();

        }

      }catch(e){

        alert(
          "照片保存失败，可能是图片过大。"
        );

      }

    };


  reader.readAsDataURL(
    file
  );

}


/* =========================================================
   PRINT HELPERS
========================================================= */


/*
  当前页面的字体设置。
*/

function getPrintFontFamily(){

  const fontMap = {

    pingfang:
      '-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif',

    yahei:
      '"Microsoft YaHei","PingFang SC",sans-serif',

    system:
      'system-ui,-apple-system,BlinkMacSystemFont,sans-serif'

  };


  return (
    fontMap[state.font]
    || fontMap.pingfang
  );

}


/*
  从当前页面 stylesheet 中提取普通屏幕 CSS。

  这里故意不复制 @media print，
  避免当前 style.css 中的旧打印规则
  再次干扰 iframe。
*/

function getScreenStyles(){

  let css = "";


  const styles =
    Array.from(
      document.querySelectorAll(
        "style"
      )
    );


  styles.forEach(
    style => {

      const text =
        style.textContent || "";


      /*
        去除所有 @media print 块。

        使用简单状态机处理嵌套大括号。
      */

      css +=
        removePrintMedia(
          text
        );

    }
  );


  /*
    外部 stylesheet 的内容不能直接从
    cross-origin stylesheet 读取。

    ResumeFlow 当前 style.css 为同源文件，
    因此尝试读取 document.styleSheets。
  */

  Array.from(
    document.styleSheets
  ).forEach(
    sheet => {

      try{

        if(
          !sheet.cssRules
        ){

          return;

        }


        Array.from(
          sheet.cssRules
        ).forEach(
          rule => {

            /*
              跳过 print media。
            */

            if(
              rule.type ===
              CSSRule.MEDIA_RULE &&
              /print/i.test(
                rule.conditionText || ""
              )
            ){

              return;

            }


            css +=
              rule.cssText +
              "\n";

          }
        );

      }catch(e){

        /*
          跨域 stylesheet 无法读取时，
          不影响打印。
        */

        console.warn(
          "无法读取stylesheet：",
          e
        );

      }

    }
  );


  return css;

}


/*
  删除 CSS 中的 @media print 块。
*/

function removePrintMedia(css){

  let result = "";
  let i = 0;


  while(i < css.length){

    const match =
      css.slice(i).match(
        /@media\s+print\s*\{/i
      );


    if(!match){

      result +=
        css.slice(i);

      break;

    }


    const start =
      i + match.index;


    result +=
      css.slice(
        i,
        start
      );


    const braceStart =
      css.indexOf(
        "{",
        start
      );


    if(braceStart < 0){

      break;

    }


    let depth = 1;
    let j =
      braceStart + 1;


    while(
      j < css.length &&
      depth > 0
    ){

      if(css[j] === "{"){

        depth++;

      }else if(css[j] === "}"){

        depth--;

      }

      j++;

    }


    i = j;

  }


  return result;

}


/*
  创建独立打印 iframe。
*/

function createPrintFrame(){

  const iframe =
    document.createElement(
      "iframe"
    );


  iframe.setAttribute(
    "aria-hidden",
    "true"
  );


  iframe.style.position =
    "fixed";

  iframe.style.left =
    "-10000px";

  iframe.style.top =
    "0";

  iframe.style.width =
    "1px";

  iframe.style.height =
    "1px";

  iframe.style.border =
    "0";

  iframe.style.opacity =
    "0";

  iframe.style.pointerEvents =
    "none";


  iframe.src =
    "about:blank";


  document.body.appendChild(
    iframe
  );


  return iframe;

}


/*
  等待图片加载。
*/

function waitForPrintImages(
  doc
){

  const images =
    Array.from(
      doc.images || []
    );


  if(!images.length){

    return Promise.resolve();

  }


  return Promise.all(
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
  等待字体加载。
*/

function waitForPrintFonts(
  doc
){

  if(
    doc.fonts &&
    doc.fonts.ready
  ){

    return doc.fonts.ready.catch(
      () => {}
    );

  }


  return Promise.resolve();

}


/*
  准备 iframe。

  关键点：

  1. 不复制 .resume-page class
  2. 不复制 @media print
  3. 不复制 #paper
  4. 不复制 preview-stack
  5. 每个页面改名为 print-page
*/

async function preparePrintFrame(
  iframe
){

  const printWindow =
    iframe.contentWindow;

  const printDocument =
    printWindow.document;


  /*
    创建基础 HTML。
  */

  printDocument.open();

  printDocument.write(`
    <!DOCTYPE html>

    <html>

      <head>

        <meta charset="UTF-8">

        <meta
          name="viewport"
          content="width=device-width,initial-scale=1"
        >

        <title>ResumeFlow</title>

      </head>

      <body>

        <div id="resume-print-root"></div>

      </body>

    </html>
  `);

  printDocument.close();


  /*
    只注入普通屏幕 CSS。
  */

  const screenStyle =
    printDocument.createElement(
      "style"
    );


  screenStyle.textContent =
    getScreenStyles();


  printDocument.head.appendChild(
    screenStyle
  );


  /*
    独立打印 CSS。
  */

  const printStyle =
    printDocument.createElement(
      "style"
    );


  printStyle.textContent = `

    /*
      ========================================
      ResumeFlow V1.3.9 PRINT ENGINE
      ========================================
    */

    @page {

      size: A4 portrait;

      margin: 0;

    }


    html {

      width: 210mm;

      margin: 0;

      padding: 0;

      background: #fff;

    }


    body {

      width: 210mm;

      margin: 0;

      padding: 0;

      background: #fff;

      overflow: visible;

      font-family:
        ${getPrintFontFamily()};

      font-size:
        ${Number(state.fontSize) || 13}px;

      -webkit-print-color-adjust: exact;

      print-color-adjust: exact;

    }


    /*
      打印根节点。

      不允许 flex / grid / gap
      影响物理分页。
    */

    #resume-print-root {

      width: 210mm;

      margin: 0;

      padding: 0;

      display: block;

    }


    /*
      一张逻辑简历页
      = 一张物理 A4。
    */

    .print-page {

      width: 210mm !important;

      height: 297mm !important;

      min-width: 210mm !important;

      max-width: 210mm !important;

      min-height: 297mm !important;

      max-height: 297mm !important;

      margin: 0 !important;

      padding: 52px 62px;

      box-sizing: border-box;

      position: relative;

      display: block;

      overflow: hidden;

      background: #fff;

      box-shadow: none !important;

      transform: none !important;

      zoom: 1 !important;

      flex: none !important;

      float: none !important;

      break-inside: avoid;

      page-break-inside: avoid;

    }


    /*
      所有非最后页面结束后分页。

      注意：
      使用 break-after，
      不使用 break-before。
    */

    .print-page:not(:last-child) {

      break-after: page;

      page-break-after: always;

    }


    /*
      最后一页禁止继续分页。
    */

    .print-page:last-child {

      break-after: auto !important;

      page-break-after: auto !important;

    }


    /*
      ========================================
      模板样式
      ========================================
    */

    .print-page.tech {

      border-top:
        4px solid var(--accent);

    }


    .print-page.blue .section-title {

      border-bottom-width: 2px;

    }


    .print-page.blue .name {

      color: var(--accent);

    }


    .print-page.minimal {

      padding: 48px 58px;

    }


    .print-page.minimal .name {

      font-size: 29px;

    }


    .print-page.minimal .section-title {

      border: 0;

      padding: 0;

      letter-spacing: .13em;

      color: var(--accent);

    }


    .print-page.minimal .contact {

      border-bottom:
        1px solid var(--line);

      padding-bottom: 14px;

    }


    .print-page.terminal {

      font-family:
        "SFMono-Regular",
        Consolas,
        "Liberation Mono",
        "PingFang SC",
        monospace;

    }


    .print-page.terminal .name {

      font-size: 27px;

    }


    .print-page.terminal .title {

      color: var(--accent);

    }


    .print-page.terminal .section-title {

      border-bottom: 0;

      background: var(--accent);

      color: #fff;

      padding: 4px 8px;

      display: inline-block;

      letter-spacing: .04em;

    }


    .print-page.grayblue .section-title {

      color: #40576b;

      border-bottom-color: #8fa0ad;

    }


    .print-page.grayblue .name {

      color: #253746;

    }


    .print-page.stripe {

      padding-left: 58px;

    }


    .print-page.stripe::before {

      content: "";

      position: absolute;

      left: 0;

      top: 0;

      bottom: 0;

      width: 8px;

      background: var(--accent);

    }


    .print-page.business .name {

      font-weight: 700;

    }


    .print-page.business .section-title {

      border-bottom:
        2px solid var(--accent);

      font-size: 12px;

      letter-spacing: .16em;

      padding-bottom: 7px;

    }


    .print-page.photo .resume-photo {

      width: 92px;

      height: 122px;

    }


    .print-page.page-one {

      padding-top: 43px;

      padding-bottom: 40px;

      font-size: 12px;

    }


    .print-page.page-one .section {

      margin-top: 12px;

    }


    .print-page.page-one .section li {

      margin: 1px 0 2px;

      line-height: 1.45;

    }


    .print-page.page-one .contact {

      margin-bottom: 12px;

    }


    .print-page.page-one .name {

      font-size: 28px;

    }


    .print-page.page-two .section {

      margin-top: 20px;

    }


    /*
      ========================================
      强制覆盖 screen A4 属性
      ========================================
    */

    .print-page .paper-header {

      display: flex;

      justify-content:
        space-between;

      gap: 24px;

      align-items:
        flex-start;

    }


    .print-page .identity {

      min-width: 0;

      flex: 1;

    }


    .print-page .name {

      font-size: 30px;

      font-weight: 800;

      letter-spacing: .02em;

      margin-bottom: 4px;

    }


    .print-page .title {

      font-size: 15px;

      color: #4d5961;

      margin-bottom: 7px;

    }


    .print-page .contact {

      font-size: 11px;

      color: #68727b;

      margin-bottom: 18px;

      line-height: 1.6;

    }


    .print-page .resume-photo {

      width: 82px;

      height: 108px;

      border: 1px solid #d8dde1;

      flex: none;

      overflow: hidden;

    }


    .print-page .resume-photo img {

      width: 100%;

      height: 100%;

      object-fit: cover;

    }


    .print-page .section {

      margin-top: 17px;

      min-width: 0;

    }


    .print-page .section-title {

      font-size: 13px;

      font-weight: 800;

      letter-spacing: .08em;

      color: var(--accent);

      border-bottom:
        1px solid var(--accent);

      padding-bottom: 5px;

      margin-bottom: 9px;

    }


    .print-page .section-body {

      min-width: 0;

    }


    .print-page .item-head {

      font-weight: 700;

      margin: 3px 0 5px;

    }


    .print-page .section ul {

      margin: 5px 0 10px;

      padding-left: 19px;

    }


    .print-page .section li {

      margin: 2px 0 4px;

      line-height: 1.58;

    }


    .print-page .paragraph {

      margin: 4px 0 8px;

    }


    .print-page .page-number {

      position: absolute;

      right: 34px;

      bottom: 22px;

      font-size: 9px;

      color: #9aa1a7;

    }


    /*
      防止打印内容内部产生新的分页。
    */

    .print-page > * {

      break-inside: avoid;

    }


    .print-page .section {

      break-inside: avoid;

      page-break-inside: avoid;

    }


    /*
      图片防止形成额外打印页。
    */

    .print-page img {

      break-inside: avoid;

      page-break-inside: avoid;

    }


  `;


  printDocument.head.appendChild(
    printStyle
  );


  /*
    当前预览已经分页完成。
  */

  const sourcePages =
    Array.from(
      paper.querySelectorAll(
        ".resume-page"
      )
    );


  if(!sourcePages.length){

    throw new Error(
      "没有找到可打印的简历页面。"
    );

  }


  const root =
    printDocument.getElementById(
      "resume-print-root"
    );


  /*
    逐页复制。

    最重要：
    原来的 resume-page class 被删除。

    这样当前 style.css 中针对
    .resume-page 的规则不会再命中。
  */

  sourcePages.forEach(
    (sourcePage,index) => {

      const page =
        sourcePage.cloneNode(true);


      /*
        删除原 A4 class。
      */

      page.className =
        sourcePage.className
          .split(/\s+/)
          .filter(
            name =>
              name !== "resume-page"
          )
          .join(" ");


      /*
        加入独立打印 class。
      */

      page.classList.add(
        "print-page"
      );


      /*
        复制主题变量。
      */

      page.style.setProperty(
        "--accent",
        THEMES[state.theme].main
      );

      page.style.setProperty(
        "--accent-soft",
        THEMES[state.theme].light
      );


      /*
        清理屏幕布局属性。
      */

      page.style.width =
        "210mm";

      page.style.height =
        "297mm";

      page.style.minWidth =
        "210mm";

      page.style.maxWidth =
        "210mm";

      page.style.minHeight =
        "297mm";

      page.style.maxHeight =
        "297mm";

      page.style.margin =
        "0";

      page.style.transform =
        "none";

      page.style.zoom =
        "1";

      page.style.boxShadow =
        "none";


      /*
        页面之间使用 break-after。
      */

      if(
        index <
        sourcePages.length - 1
      ){

        page.style.breakAfter =
          "page";

        page.style.pageBreakAfter =
          "always";

      }else{

        page.style.breakAfter =
          "auto";

        page.style.pageBreakAfter =
          "auto";

      }


      root.appendChild(
        page
      );

    }
  );


  /*
    等待图片。
  */

  await waitForPrintImages(
    printDocument
  );


  /*
    等待字体。
  */

  await waitForPrintFonts(
    printDocument
  );


  /*
    等待浏览器完成布局。
  */

  await new Promise(
    resolve => {

      printWindow.requestAnimationFrame(
        () => {

          printWindow.requestAnimationFrame(
            () => {

              resolve();

            }
          );

        }
      );

    }
  );

}


/*
  清理 iframe。
*/

function removePrintFrame(
  iframe
){

  if(
    iframe &&
    iframe.parentNode
  ){

    iframe.parentNode.removeChild(
      iframe
    );

  }

}


/*
  独立打印。

  不再调用：
    window.print()

  而是：
    iframe.contentWindow.print()
*/

async function printResume(){

  if(!source.value.trim()){

    alert(
      "请先导入或粘贴简历。"
    );

    return;

  }


  /*
    重新生成当前分页。
  */

  render();


  /*
    等待预览布局完成。
  */

  await new Promise(
    resolve =>
      setTimeout(
        resolve,
        120
      )
  );


  let iframe = null;


  try{

    iframe =
      createPrintFrame();


    await preparePrintFrame(
      iframe
    );


    const printWindow =
      iframe.contentWindow;


    /*
      最终检查：

      打印 iframe 中有几页。
    */

    const printPages =
      iframe.contentDocument
        .querySelectorAll(
          ".print-page"
        );


    console.log(
      "ResumeFlow PDF打印页数：",
      printPages.length
    );


    /*
      Safari 必须 focus iframe window。
    */

    printWindow.focus();


    /*
      再等待一小段时间，
      确保打印布局稳定。
    */

    await new Promise(
      resolve =>
        setTimeout(
          resolve,
          100
        )
    );


    printWindow.print();


    /*
      Safari 打印完成后清理。
    */

    setTimeout(
      () => {

        removePrintFrame(
          iframe
        );

      },
      2000
    );


  }catch(error){

    console.error(
      "ResumeFlow PDF打印失败：",
      error
    );


    removePrintFrame(
      iframe
    );


    /*
      不再自动 window.print()。

      因为自动 fallback 会重新进入
      原来的 print CSS，可能再次产生空白页。
    */

    alert(
      "PDF打印准备失败，请重新点击“导出PDF”重试。"
    );

  }

}


/* =========================================================
   EVENTS
========================================================= */


/* demo */

demoBtn.addEventListener(
  "click",
  () => {

    source.value =
      DEMO_MD;

    render();

  }
);


/* render */

renderBtn.addEventListener(
  "click",
  render
);


/* clear */

clearBtn.addEventListener(
  "click",
  () => {

    if(
      !confirm(
        "确定清空当前简历吗？"
      )
    ){

      return;

    }


    source.value = "";

    resumeData = null;

    paper.innerHTML = "";

    paper.className =
      "paper";

    save();

  }
);


/* file button */

fileBtn.addEventListener(
  "click",
  () => {

    fileInput.click();

  }
);


fileInput.addEventListener(
  "change",
  () => {

    readFile(
      fileInput.files[0]
    );

    fileInput.value = "";

  }
);


/* drag */

[
  "dragenter",
  "dragover"
].forEach(
  type => {

    dropZone.addEventListener(
      type,
      event => {

        event.preventDefault();

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
  type => {

    dropZone.addEventListener(
      type,
      event => {

        event.preventDefault();

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

    const file =
      event.dataTransfer.files[0];

    readFile(file);

  }
);


/* photo */

photoBtn.addEventListener(
  "click",
  () => {

    photoFile.click();

  }
);


photoFile.addEventListener(
  "change",
  () => {

    readPhoto(
      photoFile.files[0]
    );

    photoFile.value = "";

  }
);


/* remove photo */

removePhotoBtn.addEventListener(
  "click",
  () => {

    localStorage.removeItem(
      STORAGE.photo
    );

    renderPhotoPreview();

    if(source.value.trim()){

      render();

    }

  }
);


/* template */

templates.addEventListener(
  "click",
  event => {

    const btn =
      event.target.closest(
        "[data-t]"
      );

    if(!btn){
      return;
    }


    state.template =
      btn.dataset.t;

    applyTemplate();

    if(source.value.trim()){

      render();

    }else{

      updateScale();

    }

  }
);


/* theme */

themes.addEventListener(
  "click",
  event => {

    const btn =
      event.target.closest(
        "[data-theme]"
      );

    if(!btn){
      return;
    }


    state.theme =
      btn.dataset.theme;

    applyTheme();

    if(source.value.trim()){

      render();

    }

  }
);


/* page mode */

pages.addEventListener(
  "change",
  () => {

    state.pageMode =
      pages.value;

    if(source.value.trim()){

      render();

    }

  }
);


/* photo mode */

photoMode.addEventListener(
  "change",
  () => {

    state.showPhoto =
      photoMode.value
      === "show";

    if(source.value.trim()){

      render();

    }

  }
);


/* font */

font.addEventListener(
  "change",
  () => {

    state.font =
      font.value;

    applyFont();

    save();

  }
);


/* font size */

size.addEventListener(
  "input",
  () => {

    state.fontSize =
      Number(size.value);

    applyFont();

    if(source.value.trim()){

      render();

    }

  }
);


/* zoom */

zoom.addEventListener(
  "input",
  () => {

    state.zoom =
      Number(zoom.value);

    updateScale();

    save();

  }
);


/* source autosave */

source.addEventListener(
  "input",
  () => {

    save();

  }
);


/* =========================================================
   PDF
========================================================= */

pdfBtn.addEventListener(
  "click",
  () => {

    printResume();

  }
);


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
          "./sw.js?v=1.3.9"
        )
        .catch(
          error => {

            console.warn(
              "Service Worker注册失败",
              error
            );

          }
        );

    }
  );

}


/* =========================================================
   INIT
========================================================= */

load();

})();