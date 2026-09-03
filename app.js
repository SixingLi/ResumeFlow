const demo=`# 嵌入式软件工程师-AE产品（成都）
**李思杏 | 约88% | 强烈推荐**
1388261797 | 982543391@qq.com | 成都 | 4年+汽车电子/ADAS开发经验

## 个人优势
- 4年+汽车电子/ADAS软件开发经验，覆盖L2 ACC量产及轻型商用车ACC/TSR，具备需求、设计、编码、联调、测试、标定和问题闭环能力。
- 熟悉C、AUTOSAR Classic、SWC/RTE、CAN、CANoe/CANape及DBC，具备车载ECU应用层软件开发经验。
- 了解RTOS/OS调度、MCU及常用外设基础，正在加强底层软件能力。

## 核心技能
- 语言/控制：C（熟悉）、C++（基础）、PID控制、纵向控制
- 汽车软件：AUTOSAR Classic、CAN、DBC、ECU软件开发
- 工具：CANoe、CANape、MATLAB、Git、Linux

## 工作经历
安智杰科技有限公司｜ADAS软件工程师｜2022.02—2026.06
- 负责L2 ACC功能软件开发、测试与发布，参与控制逻辑、状态机及整车信号适配。
- 使用CANoe进行CAN信号分析和问题定位，结合MATLAB对实车采集数据进行批量分析。
- 针对加减速振荡、制动能力不足、响应延迟等问题开展根因分析、参数标定和验证。
- 负责TSR功能状态逻辑及显示策略开发与测试。

## 项目经历
L2 ACC量产项目
- 基于期望纵向加速度构建前馈+反馈控制框架，完成期望扭矩计算、PID反馈及限幅逻辑。
- 分析车辆速度、实际加速度、驱动电机扭矩、制动请求等信号，建立问题定位与数据验证流程。
- 针对不同载荷和弯道工况优化ACC控制策略，提升跟车稳定性和舒适性。

## 教育背景
计算机科学与技术｜本科`;

const $=id=>document.getElementById(id);
function esc(s){return String(s??'').replace(/[&<>"\\]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\\':'&#92;'}[m]))}
function cleanMd(s){return String(s??'').replace(/^\s{0,3}#{1,6}\s*/, '').replace(/\*\*(.*?)\*\*/g,'$1').replace(/__(.*?)__/g,'$1').replace(/`([^`]+)`/g,'$1').trim()}
function isHeading(l){return /^\s{0,3}#{1,6}\s+/.test(l)}
function headingLevel(l){const m=l.match(/^\s*(#{1,6})\s+/);return m?m[1].length:0}
function isBullet(l){return /^\s*(?:[-–—•·●*])\s+/.test(l)}
function bulletText(l){return cleanMd(l).replace(/^\s*(?:[-–—•·●*])\s+/,'')}
function parseText(t){
  const raw=t.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  if(!raw.length)return {name:'你的姓名',title:'目标职位',contact:'',summary:[],work:[],projects:[],edu:[],skills:[],extra:[]};
  let name='你的姓名',title='目标职位',contact='',start=0;
  if(isHeading(raw[0]) && headingLevel(raw[0])===1){
    title=cleanMd(raw[0]); start=1;
    if(raw[start]){name=cleanMd(raw[start]).split('|')[0].trim();start++;}
    if(raw[start] && !isHeading(raw[start])){contact=cleanMd(raw[start]);start++;}
  }else{
    name=cleanMd(raw[0])||name;
    if(raw[1]){title=cleanMd(raw[1]);start=2;}
    if(raw[start] && !isHeading(raw[start])){contact=cleanMd(raw[start]);start++;}
  }
  const sections={summary:[],work:[],projects:[],edu:[],skills:[],extra:[]}; let current='extra',currentTitle='';
  const aliases={'个人简介':'summary','简介':'summary','个人优势':'summary','职业优势':'summary','个人亮点':'summary','工作经历':'work','工作经验':'work','职业经历':'work','项目经历':'projects','项目经验':'projects','项目':'projects','教育背景':'edu','教育经历':'edu','专业技能':'skills','核心技能':'skills','技能':'skills','技术栈':'skills'};
  for(let i=start;i<raw.length;i++){
    const l=raw[i];
    if(isHeading(l)){const h=cleanMd(l);current=aliases[h]||'extra';currentTitle=h;if(current==='extra'&&!sections.extra.some(x=>x.__title===h))sections.extra.push({__title:h,items:[]});continue}
    if(current==='extra'){let target=sections.extra.find(x=>x.__title===currentTitle);if(!target){target={__title:currentTitle||'其他',items:[]};sections.extra.push(target)}target.items.push(l)}else sections[current].push(l)
  }
  return {name,title,contact,summary:sections.summary,work:sections.work,projects:sections.projects,edu:sections.edu,skills:sections.skills,extra:sections.extra};
}
function parseJSON(raw){const j=JSON.parse(raw);return {name:j.basic?.name||j.name||'你的姓名',title:j.basic?.title||j.title||'目标职位',contact:j.basic?.contact||j.contact||'',summary:j.summary||[],work:j.experience||j.work||[],projects:j.projects||[],edu:j.education||[],skills:j.skills||[],extra:[]}}
function section(title,arr){if(!arr?.length)return '';let out=`<section class="section"><div class="section-title">${esc(title)}</div><div class="section-body">`;let inList=false;arr.forEach(l=>{if(isBullet(l)){if(!inList){out+='<ul>';inList=true}out+=`<li>${esc(bulletText(l))}</li>`}else{if(inList){out+='</ul>';inList=false}out+=`<div class="item-head">${esc(cleanMd(l))}</div>`}});if(inList)out+='</ul>';return out+'</div></section>'}
function extraSections(arr){return (arr||[]).map(x=>section(x.__title,x.items)).join('')}
function getPhoto(){return localStorage.getItem('resumeFlowPhoto')||''}
function updatePhotoPreview(src){const box=$('photoPreview');if(src){box.innerHTML=`<img src="${src}" alt="证件照">`;box.classList.add('has-photo');$('removePhotoBtn').disabled=false}else{box.innerHTML='<span>证件照</span>';box.classList.remove('has-photo');$('removePhotoBtn').disabled=true}}
function render(){const raw=$('source').value.trim();if(!raw)return;let d;try{d=raw.startsWith('{')?parseJSON(raw):parseText(raw)}catch(e){d=parseText(raw)}const photo=getPhoto();let html=`<div class="paper-header"><div class="identity"><div class="name">${esc(d.name)}</div><div class="title">${esc(d.title)}</div><div class="contact">${esc(d.contact)}</div></div>${photo?`<div class="resume-photo"><img src="${photo}" alt="证件照"></div>`:''}</div>`;html+=section('个人优势',d.summary)+section('工作经历',d.work)+section('项目经历',d.projects)+section('教育背景',d.edu)+section('专业技能',d.skills)+extraSections(d.extra);$('paper').innerHTML=html;apply();localStorage.setItem('resumeFlowText',raw);$('saveState').textContent='已保存到本机'}
function apply(){const p=$('paper');p.classList.remove('modern','sidebar','executive');const active=document.querySelector('.template button.active');const t=active?.dataset.t||'classic';if(t!=='classic')p.classList.add(t);p.style.fontSize=$('size').value+'px';p.style.transform=`scale(${$('zoom').value})`;$('sizeVal').textContent=$('size').value;$('zoomVal').textContent=Math.round($('zoom').value*100)+'%';const f=$('font').value;p.style.fontFamily=f==='yahei'?'"Microsoft YaHei",sans-serif':f==='system'?'system-ui,sans-serif':'-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif'}
document.querySelectorAll('.template button').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.template button').forEach(x=>x.classList.remove('active'));b.classList.add('active');apply()}));['size','zoom','font'].forEach(id=>$(id).addEventListener('input',apply));$('renderBtn').addEventListener('click',render);$('demoBtn').addEventListener('click',()=>{$('source').value=demo;render()});$('clearBtn').addEventListener('click',()=>{$('source').value='';$('paper').innerHTML='<div class="hint">请在左侧粘贴简历，然后点击“生成预览”。</div>';localStorage.removeItem('resumeFlowText')});$('pdfBtn').addEventListener('click',()=>window.print());$('fileBtn').addEventListener('click',()=>$('file').click());$('file').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{$('source').value=r.result;render()};r.readAsText(f,'UTF-8')});$('photoBtn').addEventListener('click',()=>$('photoFile').click());$('photoFile').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;if(!f.type.startsWith('image/'))return alert('请选择 JPG、PNG 或 WebP 图片');const r=new FileReader();r.onload=()=>{localStorage.setItem('resumeFlowPhoto',r.result);updatePhotoPreview(r.result);render()};r.readAsDataURL(f)});$('removePhotoBtn').addEventListener('click',()=>{localStorage.removeItem('resumeFlowPhoto');updatePhotoPreview('');render()});const drop=$('drop');drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('drag')});drop.addEventListener('dragleave',()=>drop.classList.remove('drag'));drop.addEventListener('drop',e=>{e.preventDefault();drop.classList.remove('drag');const f=e.dataTransfer.files[0];if(!f)return;if(f.type.startsWith('image/')){const r=new FileReader();r.onload=()=>{localStorage.setItem('resumeFlowPhoto',r.result);updatePhotoPreview(r.result);render()};r.readAsDataURL(f)}else{const r=new FileReader();r.onload=()=>{$('source').value=r.result;render()};r.readAsText(f,'UTF-8')}});window.addEventListener('load',()=>{const x=localStorage.getItem('resumeFlowText');if(x){$('source').value=x;render()}else{$('source').value=demo;render()}updatePhotoPreview(getPhoto());if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{})});
