(()=>{"use strict";
const home=document.querySelector("#home-page"),grid=home?.querySelector(".feature-grid");if(!grid||grid.dataset.sorted)return;grid.dataset.sorted="yes";
const groups=[
["01","Bible","Read, listen and explore Scripture",[]],
["02","Buddy AI","Your friendly Bible study companion",[]],
["03","Bible Study","Go deeper and remember what you learn",[]],
["04","Bible Adventures","Learn through stories, quizzes and challenges",[]],
["05","Prayer and Worship","Make space for prayer and praise",[]],
["06","Wallpapers","Choose personal photos and create verse wallpapers",[]],
["07","Creativity","Make Bible verses your own",[]],
["08","Settings","Make Bible Buddy feel right for you",[]]
];
const classify=(title,page)=>{
const t=title.toLowerCase();
if(/bible doodle studio|bible comic creator|comic creator|creative studio|art studio|sticker maker|verse animation|worship poster|profile designer/.test(t)||["artstudio","comiccreator","stickers","verseanimation","worshipposter","profiledesigner"].includes(page))return 6;
if(/read the bible|audio bible|connected verses|bible timeline|bible places|reading plans/.test(t))return 0;
if(/ask buddy|voice conversation|buddy voice|buddy personality/.test(t))return 1;
if(/deep bible study|smart study|memorise scripture|sermon recorder|sermon intelligence|my journal/.test(t))return 2;
if(/bible quiz|quiz battle|story mode|study groups|group challenge/.test(t))return 3;
if(/prayer|worship|daily reminder|verse of the day/.test(t))return 4;
if(/wallpaper|saved verse|share a bible verse/.test(t))return 6;
if(/language|reading speed|app preferences|settings/.test(t))return 7;
return ({bible:0,buddy:1,recorder:2,journal:2,prayer:4,plans:0,quiz:3,deepstudy:2,timeline:0,groups:3,settings:7,maps:0,quizbattle:3,stories:3,memorise:2,wallpaper:6,prayerjournal:4,worship:4,groupchallenge:3,smartnotes:2})[page]??2;
};
const cards=[...grid.querySelectorAll(".feature-card")];
cards.forEach(card=>{const title=card.querySelector("strong")?.textContent||"",page=card.dataset.page||"";groups[classify(title,page)][3].push(card)});
const wrap=document.createElement("div");wrap.className="category-list";
groups.forEach(([num,name,desc,items])=>{const section=document.createElement("section");section.className="feature-category";const head=document.createElement("div");head.className="category-heading";head.innerHTML='<span>'+num+'</span><div><h3>'+name+'</h3><p>'+desc+'</p></div>';const cardsGrid=document.createElement("div");cardsGrid.className="feature-grid";items.forEach(card=>cardsGrid.append(card));section.append(head,cardsGrid);wrap.append(section)});
grid.replaceWith(wrap);
})();