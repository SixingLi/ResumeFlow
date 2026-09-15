
/* =========================================================
   ResumeFlow V1.4.3
   修复重点：
   - 保留 V1.4.2 的模板/主题/导入/证件照/打印功能
   - 重写分页器：只有在“实际内容无法放入当前页”时才创建下一页
   - 禁止生成空白中间页
   - section / block / paragraph / bullet 均可自然跨页
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
   STORAGE / STATE
========================================================= */
const STORAGE = {
  resume: "resumeflow-resume-v143",
  state: "resumeflow-state-v143",
  photo: "resumeflow-photo-v143"
};

const DEFAULT_STATE = {
  template: "tech",
  theme: "blue",
  pageMode: "auto",
  showPhoto: true,
  font: "pingfang",
  fontSize: 13,
  zoom: .8
};

let state = {...DEFAULT_STATE};
let resumeData = null;

/* =========================================================
   THEME
========================================================= */
const THEMES = {
  black:{main:"#222222",light:"#f2f2f2"},
  blue:{main:"#17365D",light:"#eef4fa"},
  cyan:{main:"#1677FF",light:"#edf5ff"},
  green:{main:"#216E5B",light:"#edf7f3"},
  gray:{main:"#555B66",light:"#f2f3f5"},
  wine:{main:"#7A3030",light:"#faf0f0"}
};

const TEMPLATE_CLASSES = [
  "tech","blue","minimal","terminal",
  "grayblue","stripe","business","photo"
];

const SECTION_ALIASES = {
  summary:["个人优势","个人简介","个人概述","简介","summary","profile"],
  skills:["核心技能","专业技能","技能","技术栈","skills","technical skills"],
  experience:["工作经历","工作经验","职业经历","工作履历","experience","work experience"],
  projects:["项目经历","项目经验","项目","projects","project experience"],
  education:["教育背景","教育经历","学历","education"],
  certificates:["证书","资格证书","certificates"],
  awards:["获奖经历","奖项","荣誉","awards"]
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
   TEXT HELPERS
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
    .replace(/$begin:math:display$\(\.\*\?\)$end:math:display$$begin:math:text$\.\*\?$end:math:text$/g,"$1")
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
  return stripMD(text).replace(/[：:]/g,"").trim().toLowerCase();
}

function getSectionType(title){
  const normalized = normalizeHeading(title);
  for(const [type,aliases] of Object.entries(SECTION_ALIASES)){
    if(aliases.some(alias => normalizeHeading(alias) === normalized)){
      return type;
    }
  }
  return null;
}

/* =========================================================
   MARKDOWN / JSON
========================================================= */
function parseMarkdown(text){
  const lines = clean(text).split("\n");
  const result = {name:"",title:"",contact:"",sections:[]};
  let current = null;
  let currentBlock = null;
  const beforeFirstSection = [];

  for(const raw of lines){
    const line = raw.trim();
    if(!line) continue;

    const heading = line.match(/^(#{1,6})\s+(.+)$/);

    if(heading){
      const level = heading[1].length;
      const title = stripMD(heading[2]);

      if(level === 1 && !result.name){
        result.name = title;
        continue;
      }

      const type = getSectionType(title);

      if(type){
        current = {type,title,blocks:[]};
        result.sections.push(current);
        currentBlock = null;
        continue;
      }

      if(current && level >= 3){
        currentBlock = {head:title,lines:[],bullets:[]};
        current.blocks.push(currentBlock);
        continue;
      }

      if(!current) beforeFirstSection.push(title);
      continue;
    }

    if(!current){
      beforeFirstSection.push(stripMD(line));
      continue;
    }

    if(/^[-*•]\s+/.test(line)){
      if(!currentBlock){
        currentBlock = {head:"",lines:[],bullets:[]};
        current.blocks.push(currentBlock);
      }
      currentBlock.bullets.push(
        stripMD(line.replace(/^[-*•]\s+/,""))
      );
      continue;
    }

    if(!currentBlock){
      currentBlock = {head:"",lines:[],bullets:[]};
      current.blocks.push(currentBlock);
    }

    currentBlock.lines.push(stripMD(line));
  }

  if(!result.name) result.name = beforeFirstSection.shift() || "姓名";
  if(!result.title) result.title = beforeFirstSection.shift() || "";
  if(!result.contact) result.contact = beforeFirstSection.join(" | ");

  return result;
}

function parseJSON(text){
  const obj = JSON.parse(text);

  if(typeof obj === "string") return parseMarkdown(obj);

  if(obj.markdown || obj.content || obj.resume){
    return parseMarkdown(obj.markdown || obj.content || obj.resume);
  }

  const result = {
    name: obj.name || obj.姓名 || "姓名",
    title: obj.title || obj.职位 || obj.position || "",
    contact: obj.contact || obj.联系方式 || "",
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
    if(!obj[key]) continue;

    const value = Array.isArray(obj[key]) ? obj[key] : [obj[key]];
    const section = {type:key,title,blocks:[]};

    for(const item of value){
      if(typeof item === "string"){
        section.blocks.push({head:"",lines:[],bullets:[item]});
      }else if(item && typeof item === "object"){
        section.blocks.push({
          head:item.title || item.name || item.公司 || item.项目 || "",
          lines:Array.isArray(item.lines) ? item.lines : [],
          bullets:Array.isArray(item.bullets) ? item.bullets : []
        });
      }
    }

    result.sections.push(section);
  }

  return result;
}

function parseInput(text){
  const trimmed = clean(text);

  if(!trimmed){
    return {name:"姓名",title:"",contact:"",sections:[]};
  }

  if(trimmed.startsWith("{") || trimmed.startsWith("[")){
    try{
      return parseJSON(trimmed);
    }catch(error){
      console.warn("JSON解析失败，按Markdown处理",error);
    }
  }

  return parseMarkdown(trimmed);
}

/* =========================================================
   HTML BUILDERS
========================================================= */
function blockHTML(block){
  let html = "";

  if(block.head){
    html += `<div class="item-head">${escapeHTML(block.head)}</div>`;
  }

  for(const line of block.lines || []){
    if(!line) continue;
    html += `<div class="paragraph">${escapeHTML(line)}</div>`;
  }

  if(block.bullets && block.bullets.length){
    html += "<ul>";
    for(const bullet of block.bullets){
      html += `<li>${escapeHTML(bullet)}</li>`;
    }
    html += "</ul>";
  }

  return html;
}

function sectionShell(title){
  const section = document.createElement("section");
  section.className = "section";

  const titleEl = document.createElement("div");
  titleEl.className = "section-title";
  titleEl.textContent = title;

  const body = document.createElement("div");
  body.className = "section-body";

  section.appendChild(titleEl);
  section.appendChild(body);

  return section;
}

function headerHTML(data){
  let photo = "";
  const photoData = getPhoto();

  if(state.showPhoto && photoData){
    photo = `
      <div class="resume-photo">
        <img src="${photoData}" alt="证件照">
      </div>
    `;
  }

  return `
    <div class="paper-header">
      <div class="identity">
        <div class="name">${escapeHTML(data.name)}</div>
        ${data.title ? `<div class="title">${escapeHTML(data.title)}</div>` : ""}
        ${data.contact ? `<div class="contact">${escapeHTML(data.contact)}</div>` : ""}
      </div>
      ${photo}
    </div>
  `;
}

function createPage(pageNumber){
  const page = document.createElement("div");
  page.className = `resume-page ${state.template}`;

  const theme = THEMES[state.theme] || THEMES.blue;
  page.style.setProperty("--accent",theme.main);
  page.style.setProperty("--accent-soft",theme.light);

  if(state.pageMode === "one") page.classList.add("page-one");
  if(state.pageMode === "two") page.classList.add("page-two");

  const pageNumberEl = document.createElement("div");
  pageNumberEl.className = "page-number";
  pageNumberEl.textContent = pageNumber;

  page.appendChild(pageNumberEl);
  return page;
}

function addHeader(page,data){
  const wrapper = document.createElement("div");
  wrapper.innerHTML = headerHTML(data);
  page.insertBefore(wrapper.firstElementChild,page.firstChild);
}

function isOverflow(page){
  return page.scrollHeight > page.clientHeight + 2;
}

function addSection(page,section){
  const el = sectionShell(section.title);
  const body = el.querySelector(".section-body");

  for(const block of section.blocks){
    const holder = document.createElement("div");
    holder.innerHTML = blockHTML(block);

    while(holder.firstElementChild){
      body.appendChild(holder.firstElementChild);
    }
  }

  page.appendChild(el);
  return el;
}

/* =========================================================
   NEW PAGINATION ENGINE
   原则：
   1. 不提前创建“可能需要”的页面
   2. 只有真实内容放不下时才创建下一页
   3. 每次创建下一页后，立即放入触发分页的内容
   4. 因此不会留下空白中间页
========================================================= */

function makeNewPage(pagesOut){
  const page = createPage(pagesOut.length + 1);
  paper.appendChild(page);
  pagesOut.push(page);
  return page;
}

function ensureSectionOnPage(page,section){
  const existing = page.querySelector(
    `.section[data-section-type="${CSS.escape(section.type || section.title)}"]`
  );

  if(existing) return existing;

  const sectionEl = sectionShell(section.title);
  sectionEl.dataset.sectionType = section.type || section.title;
  page.appendChild(sectionEl);
  return sectionEl;
}

function sectionHasContent(sectionEl){
  const body = sectionEl.querySelector(".section-body");
  return !!body && body.children.length > 0;
}

function removeEmptySection(sectionEl){
  if(sectionEl && !sectionHasContent(sectionEl)){
    sectionEl.remove();
    return true;
  }
  return false;
}

function appendUnit(page,sectionEl,unit){
  const body = sectionEl.querySelector(".section-body");
  body.appendChild(unit);

  if(!isOverflow(page)) return true;

  unit.remove();
  return false;
}

function appendBlockUnits(pagesOut,currentPage,section,block){
  let page = currentPage;
  let sectionEl = ensureSectionOnPage(page,section);

  const createContinuationPage = () => {
    page = makeNewPage(pagesOut);
    sectionEl = ensureSectionOnPage(page,section);
  };

  /* item-head */
  if(block.head){
    const head = document.createElement("div");
    head.className = "item-head";
    head.textContent = block.head;

    if(!appendUnit(page,sectionEl,head)){
      removeEmptySection(sectionEl);
      createContinuationPage();
      appendUnit(page,sectionEl,head);
    }
  }

  /* paragraphs */
  for(const line of block.lines || []){
    if(!line) continue;

    const paragraph = document.createElement("div");
    paragraph.className = "paragraph";
    paragraph.textContent = line;

    if(!appendUnit(page,sectionEl,paragraph)){
      removeEmptySection(sectionEl);
      createContinuationPage();

      if(!appendUnit(page,sectionEl,paragraph)){
        /* 极端超长段落：直接保留，避免产生空页/死循环 */
        sectionEl.querySelector(".section-body").appendChild(paragraph);
      }
    }
  }

  /* bullets */
  for(const bullet of block.bullets || []){
    let list = sectionEl.querySelector(".section-body > ul");

    if(!list){
      list = document.createElement("ul");
      sectionEl.querySelector(".section-body").appendChild(list);

      if(isOverflow(page)){
        list.remove();
        removeEmptySection(sectionEl);
        createContinuationPage();

        list = document.createElement("ul");
        sectionEl.querySelector(".section-body").appendChild(list);
      }
    }

    const li = document.createElement("li");
    li.textContent = bullet;
    list.appendChild(li);

    if(isOverflow(page)){
      li.remove();

      if(!list.children.length) list.remove();

      /*
       * 当前页可能只有 section 标题；
       * 不允许在这里留下空白页。
       */
      if(!sectionHasContent(sectionEl)){
        removeEmptySection(sectionEl);
      }

      createContinuationPage();

      list = sectionEl.querySelector(".section-body > ul");

      if(!list){
        list = document.createElement("ul");
        sectionEl.querySelector(".section-body").appendChild(list);
      }

      list.appendChild(li);

      if(isOverflow(page)){
        /*
         * 单条 bullet 极端过长时直接保留，
         * 不再创建更多空页。
         */
        return page;
      }
    }
  }

  return page;
}

function paginate(){
  if(!resumeData) return;

  paper.innerHTML = "";
  paper.className = "paper preview-stack";

  const pagesOut = [];
  let currentPage = makeNewPage(pagesOut);

  addHeader(currentPage,resumeData);

  /* 一页模式：保持原行为，内容超出直接裁切 */
  if(state.pageMode === "one"){
    for(const section of resumeData.sections){
      addSection(currentPage,section);
    }
    finishPagination();
    return;
  }

  for(const section of resumeData.sections){
    /*
     * 先尝试整个 section。
     * 如果放不下，再删除并按 block 增量分页。
     */
    const candidate = addSection(currentPage,section);

    if(!isOverflow(currentPage)){
      continue;
    }

    candidate.remove();

    /*
     * 如果当前页除了页眉外已经有内容，
     * section 从下一页开始。
     * 如果当前页本身为空，也不要额外制造一页。
     */
    const currentSections = currentPage.querySelectorAll(".section");

    if(currentSections.length > 0){
      currentPage = makeNewPage(pagesOut);
    }

    let sectionEl = ensureSectionOnPage(currentPage,section);

    /*
     * section 标题本身如果放不下：
     * 直接换到下一页，而不是留下空页。
     */
    if(isOverflow(currentPage)){
      removeEmptySection(sectionEl);
      currentPage = makeNewPage(pagesOut);
      sectionEl = ensureSectionOnPage(currentPage,section);
    }

    for(const block of section.blocks){
      currentPage = appendBlockUnits(
        pagesOut,
        currentPage,
        section,
        block
      );
    }
  }

  /*
   * 两页模式最多两页。
   * 与原版本保持一致：超出部分不继续显示。
   */
  if(state.pageMode === "two" && pagesOut.length > 2){
    while(pagesOut.length > 2){
      const last = pagesOut.pop();
      last.remove();
    }
  }

  /*
   * 最终保险：
   * 删除真正没有任何简历内容的中间页。
   * 第一页允许只有页眉；其余页必须至少有 section。
   */
  const finalPages = Array.from(
    paper.querySelectorAll(".resume-page")
  );

  finalPages.forEach((page,index) => {
    const sections = page.querySelectorAll(".section");

    if(index > 0 && sections.length === 0){
      page.remove();
    }
  });

  const remainingPages = Array.from(
    paper.querySelectorAll(".resume-page")
  );

  remainingPages.forEach((page,index) => {
    const number = page.querySelector(".page-number");
    if(number){
      number.textContent = `${index + 1} / ${remainingPages.length}`;
    }
  });

  finishPagination();
}

/* =========================================================
   FONT / SCALE / THEME / TEMPLATE
========================================================= */
function getFontFamily(){
  switch(state.font){
    case "yahei":
      return `"Microsoft YaHei","PingFang SC",sans-serif`;
    case "system":
      return `system-ui,-apple-system,BlinkMacSystemFont,sans-serif`;
    default:
      return `-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif`;
  }
}

function applyFont(){
  paper.style.fontFamily = getFontFamily();
  paper.style.fontSize = `${Number(state.fontSize) || 13}px`;
  if(sizeVal) sizeVal.textContent = `${Number(state.fontSize) || 13}`;
}

function updateScale(){
  paper.style.transform = `scale(${state.zoom})`;
  if(zoomVal){
    zoomVal.textContent = `${Math.round(state.zoom * 100)}%`;
  }
}

function applyTheme(){
  const theme = THEMES[state.theme] || THEMES.blue;

  document.documentElement.style.setProperty("--accent",theme.main);
  document.documentElement.style.setProperty("--accent-soft",theme.light);

  paper.querySelectorAll(".resume-page").forEach(page => {
    page.style.setProperty("--accent",theme.main);
    page.style.setProperty("--accent-soft",theme.light);
  });
}

function applyTemplate(){
  paper.querySelectorAll(".resume-page").forEach(page => {
    TEMPLATE_CLASSES.forEach(name => page.classList.remove(name));
    page.classList.add(state.template);
  });
}

/* =========================================================
   PHOTO
========================================================= */
function getPhoto(){
  try{
    return localStorage.getItem(STORAGE.photo) || "";
  }catch(error){
    console.warn(error);
    return "";
  }
}

function renderPhotoPreview(){
  if(!photoPreview) return;

  const photo = getPhoto();

  if(photo){
    photoPreview.innerHTML = `<img src="${photo}" alt="证件照">`;
    photoPreview.style.display = "block";
    removePhotoBtn.disabled = false;
  }else{
    photoPreview.innerHTML = "<span>证件照</span>";
    photoPreview.style.display = "flex";
    removePhotoBtn.disabled = true;
  }
}

/* =========================================================
   SAVE / LOAD / RENDER
========================================================= */
function finishPagination(){
  applyFont();
  applyTheme();
  applyTemplate();
  updateScale();
  save();
}

function save(){
  try{
    localStorage.setItem(STORAGE.resume,source.value);
    localStorage.setItem(STORAGE.state,JSON.stringify(state));

    if(saveState) saveState.textContent = "已保存";
  }catch(error){
    console.warn("保存失败",error);
  }
}

function syncControls(){
  pages.value = state.pageMode;
  photoMode.value = state.showPhoto ? "show" : "hide";
  font.value = state.font;
  size.value = state.fontSize;
  zoom.value = state.zoom;

  templates.querySelectorAll("[data-t]").forEach(button => {
    button.classList.toggle("active",button.dataset.t === state.template);
  });

  themes.querySelectorAll("[data-theme]").forEach(button => {
    button.classList.toggle("active",button.dataset.theme === state.theme);
  });
}

function load(){
  try{
    const savedState = localStorage.getItem(STORAGE.state);

    if(savedState){
      state = {
        ...DEFAULT_STATE,
        ...JSON.parse(savedState)
      };
    }

    const savedResume = localStorage.getItem(STORAGE.resume);
    source.value = savedResume || DEMO_MD;
  }catch(error){
    console.warn("加载状态失败",error);
    state = {...DEFAULT_STATE};
    source.value = DEMO_MD;
  }

  syncControls();
  renderPhotoPreview();
  render();
}

function render(){
  try{
    resumeData = parseInput(source.value);
    paginate();
  }catch(error){
    console.error("渲染失败",error);
    alert("简历渲染失败，请检查输入内容。");
  }
}

/* =========================================================
   FILE
========================================================= */
function readFile(file){
  if(!file) return;

  const reader = new FileReader();

  reader.onload = event => {
    source.value = event.target.result || "";
    render();
    save();
  };

  reader.onerror = () => alert("文件读取失败。");
  reader.readAsText(file,"UTF-8");
}

function readPhoto(file){
  if(!file) return;

  if(!file.type.startsWith("image/")){
    alert("请选择 JPG、PNG 或 WebP 图片。");
    return;
  }

  const reader = new FileReader();

  reader.onload = event => {
    try{
      localStorage.setItem(STORAGE.photo,event.target.result);
      renderPhotoPreview();
      render();
      save();
    }catch(error){
      alert("证件照保存失败，图片可能过大。");
    }
  };

  reader.readAsDataURL(file);
}

/* =========================================================
   PRINT
========================================================= */
function getScreenCSS(){
  let css = "";

  Array.from(document.styleSheets).forEach(sheet => {
    try{
      Array.from(sheet.cssRules || []).forEach(rule => {
        if(rule.type === CSSRule.MEDIA_RULE){
          const condition = String(rule.conditionText || "").toLowerCase();
          if(condition.includes("print")) return;
        }
        css += rule.cssText + "\n";
              });
    }catch(error){
      console.warn("读取CSS失败",error);
    }
  });

  return css;
}

function printResume(){
  if(!source.value.trim()){
    alert("请先导入或粘贴简历。");
    return;
  }

  render();

  const printWindow = window.open("","_blank");

  if(!printWindow){
    alert("浏览器阻止了新窗口，请允许打开新窗口后重试。");
    return;
  }

  const pagesToPrint = Array.from(
    paper.querySelectorAll(".resume-page")
  );

  if(!pagesToPrint.length){
    printWindow.close();
    alert("没有可打印的简历页面。");
    return;
  }

  const screenCSS = getScreenCSS();

  const pagesHTML = pagesToPrint.map((page,index) => {
    const clone = page.cloneNode(true);

    clone.querySelectorAll(".page-number").forEach(node => node.remove());
    clone.classList.add("print-page");
    clone.dataset.printPage = index + 1;

    return clone.outerHTML;
  }).join("\n");

  const printCSS = `
    @page{
      size:A4 portrait;
      margin:0;
    }

    html,body{
      margin:0 !important;
      padding:0 !important;
      width:210mm !important;
      background:#fff !important;
    }

    body{
      overflow:visible !important;
      font-family:${getFontFamily()};
    }

    .resume-page.print-page{
      width:210mm !important;
      height:296mm !important;
      min-width:210mm !important;
      max-width:210mm !important;
      min-height:296mm !important;
      max-height:296mm !important;
      margin:0 !important;
      box-sizing:border-box !important;
      position:relative !important;
      display:block !important;
      overflow:hidden !important;
      background:#fff !important;
      box-shadow:none !important;
      transform:none !important;
      flex:none !important;
      float:none !important;
      zoom:1 !important;
      page-break-inside:avoid !important;
      break-inside:avoid !important;
    }

    .resume-page.print-page:not(:last-child){
      break-after:page !important;
    }

    .resume-page.print-page:last-child{
      break-after:auto !important;
    }

    .resume-page.print-page .page-number{
      display:none !important;
    }

    img{
      -webkit-print-color-adjust:exact !important;
      print-color-adjust:exact !important;
    }

    .resume-page.print-page{
      -webkit-print-color-adjust:exact !important;
      print-color-adjust:exact !important;
    }

    .resume-page.print-page.page-one{
      padding-top:43px !important;
      padding-bottom:40px !important;
    }

    .resume-page.print-page.minimal{
      padding:48px 58px !important;
    }

    .resume-page.print-page.stripe{
      padding-left:58px !important;
    }
  `;

  printWindow.document.open();

  printWindow.document.write(`
<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ResumeFlow PDF</title>
<style>${screenCSS}</style>
<style>${printCSS}</style>
</head>
<body>${pagesHTML}</body>
</html>
  `);

  printWindow.document.close();

  const waitImages = Array.from(printWindow.document.images || []);

  Promise.all(waitImages.map(image => {
    if(image.complete) return Promise.resolve();

    return new Promise(resolve => {
      image.addEventListener("load",resolve,{once:true});
      image.addEventListener("error",resolve,{once:true});
    });
  })).then(() => {
    printWindow.requestAnimationFrame(() => {
      printWindow.requestAnimationFrame(() => {
        try{
          printWindow.focus();
          printWindow.print();
        }catch(error){
          console.error("打印失败",error);
          alert("打印窗口已经打开，请在新窗口中手动打印。");
        }
      });
    });
  });
}

/* =========================================================
   EVENTS
========================================================= */
demoBtn.addEventListener("click",() => {
  source.value = DEMO_MD;
  render();
  save();
});

pdfBtn.addEventListener("click",printResume);

renderBtn.addEventListener("click",() => {
  render();
  save();
});

clearBtn.addEventListener("click",() => {
  source.value = "";
  resumeData = null;
  paper.innerHTML = "";
  save();
});

fileBtn.addEventListener("click",() => fileInput.click());

fileInput.addEventListener("change",event => {
  const file = event.target.files?.[0];
  if(file) readFile(file);
  event.target.value = "";
});

dropZone.addEventListener("dragover",event => {
  event.preventDefault();
  dropZone.classList.add("drag");
});

dropZone.addEventListener("dragleave",() => {
  dropZone.classList.remove("drag");
});

dropZone.addEventListener("drop",event => {
  event.preventDefault();
  dropZone.classList.remove("drag");

  const file = event.dataTransfer?.files?.[0];
  if(file) readFile(file);
});

photoBtn.addEventListener("click",() => photoFile.click());

photoFile.addEventListener("change",event => {
  const file = event.target.files?.[0];
  if(file) readPhoto(file);
  event.target.value = "";
});

removePhotoBtn.addEventListener("click",() => {
  localStorage.removeItem(STORAGE.photo);
  renderPhotoPreview();
  render();
  save();
});

templates.querySelectorAll("[data-t]").forEach(button => {
  button.addEventListener("click",() => {
    state.template = button.dataset.t;

    templates.querySelectorAll("[data-t]").forEach(item => {
      item.classList.toggle("active",item === button);
    });

    render();
    save();
  });
});

themes.querySelectorAll("[data-theme]").forEach(button => {
  button.addEventListener("click",() => {
    state.theme = button.dataset.theme;

    themes.querySelectorAll("[data-theme]").forEach(item => {
      item.classList.toggle("active",item === button);
    });

    render();
    save();
  });
});

pages.addEventListener("change",() => {
  state.pageMode = pages.value;
  render();
  save();
});

photoMode.addEventListener("change",() => {
  state.showPhoto = photoMode.value === "show";
  render();
  save();
});

font.addEventListener("change",() => {
  state.font = font.value;
  applyFont();
  save();
});

size.addEventListener("input",() => {
  state.fontSize = Number(size.value);
  applyFont();
  save();
});

zoom.addEventListener("input",() => {
  state.zoom = Number(zoom.value);
  updateScale();
  save();
});

let saveTimer = null;

source.addEventListener("input",() => {
  clearTimeout(saveTimer);

  saveTimer = setTimeout(() => {
    save();
  },300);
});

/* =========================================================
   PWA
========================================================= */
if("serviceWorker" in navigator){
  window.addEventListener("load",() => {
    navigator.serviceWorker.register("./sw.js?v=1.4.3").catch(error => {
      console.warn("Service Worker注册失败",error);
    });
  });
}

/* =========================================================
   START
========================================================= */
load();

})();