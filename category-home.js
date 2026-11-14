(()=>{"use strict";
const home=document.querySelector("#home-page"),grid=home?.querySelector(".feature-grid");if(!grid||grid.dataset.sorted)return;grid.dataset.sorted="yes";
const groups=[
["01","Bible","Read, listen and explore Scripture",[]],
["02","Buddy AI","Your friendly Bible study companion",[]],
["03","Bible Study","Go deeper and remember what you learn",[]],
["04","Bible Adventures","Learn through stories, quizzes and challenges",[]],
["05","Prayer and Worship","Make space for prayer and praise",[]],
["06","Wallpapers","Choose personal photos and create verse wallpapers",[]],
["07","Creativity","Make Bible verses and art your own",[]],
["08","Settings","Make Bible Buddy feel right for you",[]],
["09","Bible Games","Play, learn and unlock new levels",[]]
];
const classify=(title,page)=>{
 const t=title.toLowerCase();
 if(["biblegames","quiz","quizbattle","stories","whoami","truefalse","whosaidit","findbook","detective","kingdom","timelinechallenge"].includes(page))return 8;
 if(/verse wallpaper maker/.test(t)||["wallpaper","wallpapers","versewallpapermaker","verse-wallpaper-maker"].includes(page))return 5;
 if(/bible doodle studio|bible comic creator|comic creator|creative studio|art studio|sticker maker|verse animation|worship poster|profile designer|t-shirt designer/.test(t)||["artstudio","comiccreator","stickers","verseanimation","worshipposter","profiledesigner","tshirtdesigner"].includes(page))return 6;
 if(/complete the bible in a year|read the bible|audio bible|connected verses|bible timeline|bible places|reading plans/.test(t)||["bible","plans","timeline","maps"].includes(page))return 0;
 if(/bible explainer|bible reading partner|ask buddy|voice conversation|buddy voice|buddy personality|translation helper/.test(t)||["buddy","translationhelper"].includes(page))return 1;
 if(/deep bible study|smart study|memorise scripture|sermon recorder|sermon intelligence|my journal|book-by-book explorer|questions notebook|comparison tool/.test(t)||["recorder","journal","deepstudy","memorise","smartnotes","bookexplorer","questionnotebook","biblecompare"].includes(page))return 2;
 if(/bible games|bible quiz|quiz battle|story mode|who am i|true or false|who said it|find the bible book|bible detective|kingdom builder|timeline challenge/.test(t)||["biblegames","quiz","quizbattle","stories","whoami","truefalse","whosaidit","findbook","detective","kingdom","timelinechallenge"].includes(page))return 8;
 if(/study groups|group challenge/.test(t)||["groupchallenge","groups"].includes(page))return 3;
 if(/ask buddy to pray|prayer|worship|daily reminder|verse of the day/.test(t)||["prayer","prayerjournal","worship","prayertimer"].includes(page))return 4;
 if(/wallpaper|saved verse|share a bible verse/.test(t))return 5;
 if(/language|reading speed|app preferences|settings/.test(t)||page==="settings")return 7;
 return 2;
};
const cards=[...grid.querySelectorAll(".feature-card")];
cards.forEach(card=>{const title=card.querySelector("strong")?.textContent||"",page=card.dataset.page||"";groups[classify(title,page)][3].push(card)});
const verseWallpaper=cards.find(card=>card.dataset.page==="wallpaper");
if(verseWallpaper){groups.forEach(g=>g[3]=g[3].filter(c=>c!==verseWallpaper));groups[5][3].push(verseWallpaper)}
const settingsCard=document.createElement("button");settingsCard.type="button";settingsCard.className="feature-card";settingsCard.dataset.page="settings";settingsCard.innerHTML='<span class="feature-icon">⚙</span><strong>App Settings</strong><small>Language, appearance and Buddy preferences</small>';groups[7][3].push(settingsCard);
const wrap=document.createElement("div");wrap.className="category-list";
const style=document.createElement("style");style.textContent=".category-list{display:grid;gap:12px;margin:18px 0 28px}.feature-category{border:1px solid #d4b46b55;border-radius:15px;background:linear-gradient(145deg,#101d30,#091321);overflow:hidden}.category-toggle{width:100%;display:flex;align-items:center;gap:13px;padding:16px;text-align:left;border:0;background:transparent;color:inherit;cursor:pointer}.category-number{flex:0 0 38px;width:38px;height:38px;display:grid;place-items:center;border:1px solid #d4b46b88;border-radius:11px;color:#e8d19a;font-weight:800}.category-title-wrap{flex:1;min-width:0}.category-title-wrap strong{display:block;font-size:16px;color:#f8f3e8}.category-title-wrap small{display:block;margin-top:4px;color:#aebbd0;font-size:12px}.category-count{color:#d4b46b;font-size:12px;white-space:nowrap}.category-chevron{color:#e8d19a;font-size:20px;transition:transform .2s}.feature-category.open .category-chevron{transform:rotate(180deg)}.category-items{display:none;padding:0 12px 12px}.feature-category.open .category-items{display:grid}.category-items .feature-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.category-items .feature-card{min-width:0}.category-toggle:focus-visible{outline:2px solid #e8d19a;outline-offset:-3px}@media(max-width:380px){.category-items .feature-grid{grid-template-columns:1fr}.category-count{font-size:11px}}";document.head.append(style);
groups.forEach(([num,name,desc,items],index)=>{
 const section=document.createElement("section");section.className="feature-category";
 const toggle=document.createElement("button");toggle.type="button";toggle.className="category-toggle";toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-controls","bb-category-items-"+num);
 toggle.innerHTML='<span class="category-number">'+num+'</span><span class="category-title-wrap"><strong>'+name+'</strong><small>'+desc+'</small></span><span class="category-count">'+items.length+' '+(items.length===1?"tool":"tools")+'</span><span class="category-chevron" aria-hidden="true">⌄</span>';
 const panel=document.createElement("div");panel.className="category-items";panel.id="bb-category-items-"+num;
 const inner=document.createElement("div");inner.className="feature-grid";items.forEach(card=>inner.append(card));panel.append(inner);
 toggle.addEventListener("click",()=>{const open=section.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open))});
 section.append(toggle,panel);wrap.append(section);
});
grid.replaceWith(wrap);
})();