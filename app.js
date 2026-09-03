const demo=`李思杏
ADAS软件工程师
成都 ｜ 手机：138-0000-0000 ｜ Email：example@email.com

个人简介
3年+车载软件开发经验，主要聚焦L2级智能驾驶功能开发，具备ACC、TSR等功能开发、测试、数据分析与问题闭环经验。熟悉C语言、CAN通信、CANoe、MATLAB，能够独立完成算法问题定位、参数优化与量产发布支持。

工作经历
安智杰科技有限公司｜ADAS软件工程师｜2022.02—2026.06
• 负责L2 ACC功能软件开发、测试与发布，参与控制逻辑、状态机及整车信号适配。
• 使用CANoe进行CAN信号分析和问题定位，结合MATLAB对实车采集数据进行批量分析。
• 针对加减速振荡、制动能力不足、响应延迟等问题开展根因分析、参数标定和验证。
• 负责TSR功能状态逻辑及显示策略开发与测试。

项目经历
L2 ACC量产项目
• 基于期望纵向加速度构建前馈+反馈控制框架，完成期望扭矩计算、PID反馈及限幅逻辑。
• 分析车辆速度、实际加速度、驱动电机扭矩、制动请求等信号，建立问题定位与数据验证流程。
• 针对不同载荷和弯道工况优化ACC控制策略，提升跟车稳定性和舒适性。

教育背景
计算机科学与技术｜本科

专业技能
C / C++、Linux、Git、CAN/CANoe、MATLAB、AUTOSAR、嵌入式开发、ADAS / ACC`;

const $=id=>document.getElementById(id);
function esc(s){return String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}

function parseText(t){
  const lines=t.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
  const name=lines[0]||'你的姓名', title=lines[1]||'目标职位', contact=lines[2]||'联系方式';
  const sections={简介:[],个人简介:[],工作经历:[],项目经历:[],教育背景:[],专业技能:[],技能:[]};
  let current='';
  for(let i=3;i<lines.length;i++){
    const l=lines[i], clean=l.replace(/[：:]/g,'');
    const key=Object.keys(sections).find(k=>clean===k);
    if(key){current=key;continue}
    if(current) sections[current].push(l);
  }
  return {name,title,contact,
    summary:sections['个人简介'].length?sections['个人简介']:sections['简介'],
    work:sections['工作经历'],projects:sections['项目经历'],
    edu:sections['教育背景'],
    skills:sections['专业技能'].length?sections['专业技能']:sections['技能']};
}

function section(title,arr){
  if(!arr?.length)return '';
  let out=`<section class="section"><div class="section-title">${esc(title)}</div>`;
  let inList=false;
  arr.forEach(l=>{
    const bullet=/^[•·●\-–—]/.test(l);
    if(bullet){
      if(!inList){out+='<div class="item"><ul>';inList=true}
      out+=`<li>${esc(l.replace(/^[•·●\-–—]\s*/,''))}</li>`;
    }else{
      if(inList){out+='</ul></div>';inList=false}
      out+=`<div class="item"><div class="item-head">${esc(l)}</div></div>`;
    }
  });
  if(inList)out+='</ul></div>';
  return out+'</section>';
}

function parseJSON(raw){
  const j=JSON.parse(raw);
  return {
    name:j.basic?.name||j.name||'你的姓名',
    title:j.basic?.title||j.title||'目标职位',
    contact:j.basic?.contact||j.contact||'',
    summary:j.summary||[],
    work:j.experience||j.work||[],
    projects:j.projects||[],
    edu:j.education||[],
    skills:j.skills||[]
  };
}

function render(){
  const raw=$('source').value.trim();
  if(!raw)return;
  let d;
  try{d=raw.startsWith('{')?parseJSON(raw):parseText(raw)}catch(e){d=parseText(raw)}
  let html=`<div class="name">${esc(d.name)}</div><div class="title">${esc(d.title)}</div><div class="contact">${esc(d.contact)}</div>`;
  html+=section('个人简介',d.summary);
  html+=section('工作经历',d.work);
  html+=section('项目经历',d.projects);
  html+=section('教育背景',d.edu);
  html+=section('专业技能',d.skills);
  $('paper').innerHTML=html;
  apply();
  localStorage.setItem('resumeFlowText',raw);
  $('saveState').textContent='已保存到本机';
}

function apply(){
  const p=$('paper');
  p.classList.remove('modern','sidebar','executive');
  const active=document.querySelector('.template button.active');
  const t=active?.dataset.t||'classic';
  if(t!=='classic')p.classList.add(t);
  p.style.fontSize=$('size').value+'px';
  p.style.transform=`scale(${'zoom' in window ? $('zoom').value : .8})`;
  $('sizeVal').textContent=$('size').value;
  $('zoomVal').textContent=Math.round($('zoom').value*100)+'%';
  const f=$('font').value;
  p.style.fontFamily=f==='yahei'?'"Microsoft YaHei",sans-serif':f==='system'?'system-ui,sans-serif':'-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif';
}

document.querySelectorAll('.template button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.template button').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');apply();
}));
['size','zoom','font'].forEach(id=>$(id).addEventListener('input',apply));
$('renderBtn').addEventListener('click',render);
$('demoBtn').addEventListener('click',()=>{$('source').value=demo;render()});
$('clearBtn').addEventListener('click',()=>{$('source').value='';$('paper').innerHTML='<div class="hint">请在左侧粘贴简历，然后点击“生成预览”。</div>';localStorage.removeItem('resumeFlowText')});
$('pdfBtn').addEventListener('click',()=>window.print());
$('fileBtn').addEventListener('click',()=>$('file').click());
$('file').addEventListener('change',e=>{
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();r.onload=()=>{$('source').value=r.result;render()};r.readAsText(f,'UTF-8');
});
const drop=$('drop');
drop.addEventListener('dragover',e=>{e.preventDefault();drop.classList.add('drag')});
drop.addEventListener('dragleave',()=>drop.classList.remove('drag'));
drop.addEventListener('drop',e=>{
  e.preventDefault();drop.classList.remove('drag');
  const f=e.dataTransfer.files[0];if(!f)return;
  const r=new FileReader();r.onload=()=>{$('source').value=r.result;render()};r.readAsText(f,'UTF-8');
});
window.addEventListener('load',()=>{
  const x=localStorage.getItem('resumeFlowText');
  if(x){$('source').value=x;render()}else{$('source').value=demo;render()}
  if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
});
