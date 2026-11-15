(function(){
"use strict";
const KEY="bibleBuddyThemeV1";
const presets={
 "black-gold":{bg:"#030303",surface:"#111111",accent:"#d4b46b",text:"#f4f0e5"},
 "midnight-blue":{bg:"#050b16",surface:"#10213a",accent:"#75a9e8",text:"#f1f5fb"},
 "purple":{bg:"#10091b",surface:"#241536",accent:"#c69aff",text:"#f7f0ff"},
 "forest":{bg:"#07140e",surface:"#14291d",accent:"#9acb8b",text:"#f1f7ef"},
 "rose":{bg:"#190b12",surface:"#301722",accent:"#f09ab8",text:"#fff1f5"},
 "ocean":{bg:"#06131a",surface:"#102a35",accent:"#65c8d8",text:"#effcff"}
};
const $=id=>document.getElementById(id);
const fields={bg:"themeBg",surface:"themeSurface",accent:"themeAccent",text:"themeText"};
let current={...presets["black-gold"]};
function valid(c){return /^#[0-9a-f]{6}$/i.test(c||"");}
function apply(theme){
 const c={...presets["black-gold"],...theme};
 const root=document.documentElement;
 root.style.setProperty("--bg",c.bg);
 root.style.setProperty("--panel",c.surface);
 root.style.setProperty("--panel2",mix(c.surface,c.accent,.12));
 root.style.setProperty("--gold",c.accent);
 root.style.setProperty("--gold2",mix(c.accent,"#ffffff",.24));
 root.style.setProperty("--text",c.text);
 root.style.setProperty("--muted",mix(c.text,c.bg,.38));
 root.style.setProperty("--line",mix(c.surface,c.accent,.3));
 document.querySelector('meta[name="theme-color"]')?.setAttribute("content",c.bg);
 document.querySelectorAll('meta[name="apple-mobile-web-app-status-bar-style"]').forEach(x=>x.setAttribute("content","black-translucent"));
 current=c;
 if($("themePreview"))$("themePreview").style.borderColor=c.accent;
 if($("themePreview"))$("themePreview").style.background=c.surface;
}
function mix(a,b,t){
 const aa=[1,3,5].map(i=>parseInt(a.slice(i,i+2),16)),bb=[1,3,5].map(i=>parseInt(b.slice(i,i+2),16));
 return "#"+aa.map((v,i)=>Math.round(v*(1-t)+bb[i]*t).toString(16).padStart(2,"0")).join("");
}
function readFields(){const o={};for(const [k,id] of Object.entries(fields))o[k]=$(id).value;return o;}
function setFields(c){for(const [k,id] of Object.entries(fields))$(id).value=c[k];}
function load(){
 let saved=null;try{saved=JSON.parse(localStorage.getItem(KEY)||"null");}catch(e){}
 current=saved&&Object.values(fields).every(k=>valid(saved[k]))?saved:{...presets["black-gold"]};
 setFields(current);apply(current);
 const match=Object.keys(presets).find(k=>JSON.stringify(presets[k])===JSON.stringify(current));
 $("themePreset").value=match||"custom";
}
document.addEventListener("DOMContentLoaded",()=>{
 if(!$("themePreset"))return;
 load();
 $("themePreset").addEventListener("change",e=>{
  const p=presets[e.target.value];
  if(!p){e.target.value="custom";return;}
  setFields(p);apply(p);$("themeStatus").textContent="Previewing "+e.target.options[e.target.selectedIndex].text+". Tap Save colours to keep it.";
 });
 Object.values(fields).forEach(id=>$(id).addEventListener("input",()=>{
  $("themePreset").value="custom";apply(readFields());
  $("themeStatus").textContent="Previewing your custom colours. Save to keep them.";
 }));
 $("saveTheme").addEventListener("click",()=>{
  current=readFields();try{localStorage.setItem(KEY,JSON.stringify(current));$("themeStatus").textContent="Your colours have been saved on this device."; }catch(e){$("themeStatus").textContent="Could not save colours. Check your device storage.";}
  apply(current);
 });
 $("resetTheme").addEventListener("click",()=>{
  current={...presets["black-gold"]};setFields(current);$("themePreset").value="black-gold";apply(current);
  try{localStorage.setItem(KEY,JSON.stringify(current));$("themeStatus").textContent="Reset and saved: Black & Gold.";}catch(e){$("themeStatus").textContent="Black & Gold preview applied, but could not save it.";}
 });
});
})();
