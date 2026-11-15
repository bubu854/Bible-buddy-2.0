const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const store={get(k,f=[]){try{return JSON.parse(localStorage.getItem("bb_"+k))??f}catch{return f}},set(k,v){localStorage.setItem("bb_"+k,JSON.stringify(v))}};
function toast(t){const el=$("#toast");el.textContent=t;el.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove("show"),2300)}
function page(p){$$(".page").forEach(x=>x.classList.toggle("active",x.id===p+"-page"));$$(".nav-item").forEach(x=>x.classList.toggle("active",x.dataset.page===p));window.scrollTo({top:0,behavior:"smooth"});if(p==="journal")renderJournal();if(p==="prayer")renderPrayer();if(p==="bible")renderSaved()}
document.addEventListener("click",e=>{const b=e.target.closest("[data-page]");if(b){e.preventDefault();page(b.dataset.page)}});
const books=[["Genesis",50],["Exodus",40],["Leviticus",27],["Numbers",36],["Deuteronomy",34],["Joshua",24],["Judges",21],["Ruth",4],["1 Samuel",31],["2 Samuel",24],["1 Kings",22],["2 Kings",25],["1 Chronicles",29],["2 Chronicles",36],["Ezra",10],["Nehemiah",13],["Esther",10],["Job",42],["Psalms",150],["Proverbs",31],["Ecclesiastes",12],["Song of Solomon",8],["Isaiah",66],["Jeremiah",52],["Lamentations",5],["Ezekiel",48],["Daniel",12],["Hosea",14],["Joel",3],["Amos",9],["Obadiah",1],["Jonah",4],["Micah",7],["Nahum",3],["Habakkuk",3],["Zephaniah",3],["Haggai",2],["Zechariah",14],["Malachi",4],["Matthew",28],["Mark",16],["Luke",24],["John",21],["Acts",28],["Romans",16],["1 Corinthians",16],["2 Corinthians",13],["Galatians",6],["Ephesians",6],["Philippians",4],["Colossians",4],["1 Thessalonians",5],["2 Thessalonians",3],["1 Timothy",6],["2 Timothy",4],["Titus",3],["Philemon",1],["Hebrews",13],["James",5],["1 Peter",5],["2 Peter",3],["1 John",5],["2 John",1],["3 John",1],["Jude",1],["Revelation",22]];
const bookSelect=$("#bookSelect"),chapterSelect=$("#chapterSelect");
if(bookSelect){books.forEach(([n])=>bookSelect.add(new Option(n,n)));function chapters(){chapterSelect.innerHTML="";const b=books.find(x=>x[0]===bookSelect.value);for(let i=1;i<=b[1];i++)chapterSelect.add(new Option("Chapter "+i,i))}chapters()}
$("#copyDaily").onclick=()=>{const v="Joshua 1:9 — Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.";navigator.clipboard?.writeText(v).then(()=>toast("Verse copied")).catch(()=>toast("Copy isn't available in this browser"))};
$("#saveDaily").onclick=()=>{const a=store.get("verses");if(!a.some(x=>x.ref==="Joshua 1:9"))a.push({ref:"Joshua 1:9",text:"Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go."});store.set("verses",a);renderSaved();toast("Verse saved")};
function renderSaved(){const el=$("#savedVerses");if(!el)return;const a=store.get("verses");el.innerHTML=a.length?a.map(x=>'<div class="saved-item"><strong>'+x.ref+'</strong><p>'+x.text+'</p></div>').join(""):"No saved verses yet."}
$("#journalForm").addEventListener("submit",e=>{e.preventDefault();const a=store.get("journal");a.unshift({title:$("#journalTitle").value,text:$("#journalText").value,date:new Date().toLocaleDateString()});store.set("journal",a);e.target.reset();renderJournal();toast("Journal entry saved")});
function renderJournal(){const el=$("#journalEntries");if(!el)return;const a=store.get("journal");el.innerHTML=a.length?a.map(x=>'<article class="saved-item"><strong>'+esc(x.title)+' · '+esc(x.date)+'</strong><p>'+esc(x.text)+'</p></article>').join(""):"No journal entries yet."}
$("#prayerForm").addEventListener("submit",e=>{e.preventDefault();const a=store.get("prayers");a.unshift({text:$("#prayerInput").value,done:false});store.set("prayers",a);e.target.reset();renderPrayer();toast("Prayer request added")});
function renderPrayer(){const el=$("#prayerEntries");if(!el)return;const a=store.get("prayers");el.innerHTML=a.length?a.map((x,i)=>'<div class="saved-item prayer-item"><label><input type="checkbox" data-prayer="'+i+'" '+(x.done?"checked":"")+'> '+esc(x.text)+'</label><button class="delete-btn" data-delete-prayer="'+i+'">Remove</button></div>').join(""):"No prayer requests yet."}
document.addEventListener("change",e=>{if(e.target.matches("[data-prayer]")){const a=store.get("prayers");a[+e.target.dataset.prayer].done=e.target.checked;store.set("prayers",a)}});
document.addEventListener("click",e=>{if(e.target.matches("[data-delete-prayer]")){const a=store.get("prayers");a.splice(+e.target.dataset.deletePrayer,1);store.set("prayers",a);renderPrayer()}});
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
const prompts={ "Explain John 3:16":"John 3:16 is a well-known summary of God's love: it says God gave his Son so that people who believe may have eternal life. Read the whole passage around the verse to understand its context.", "Who was Moses?":"Moses was a leader chosen by God to lead the Israelites out of slavery in Egypt. His story is told mainly in Exodus, Leviticus, Numbers and Deuteronomy.", "Help me pray":"You could begin simply: “God, thank you for being with me. Please guide me today, help me understand your Word, and show me how to love others. Amen.”" };
let buddyLastSpeech="";
let buddyCurrentUtterance=null;
let buddyCurrentMessage=null;
function renderBuddyWords(container,text){
 container.replaceChildren();
 const fragment=document.createDocumentFragment();
 const parts=String(text).match(/\s+|[^\s]+/g)||[];
 let offset=0;
 for(const part of parts){
  if(/^\s+$/.test(part)){fragment.append(document.createTextNode(part));offset+=part.length;continue;}
  const word=document.createElement("span");word.className="buddy-spoken-word";word.dataset.start=String(offset);word.textContent=part;word.title="Tap to hear from this word";
  fragment.append(word);offset+=part.length;
 }
 container.append(fragment);
}
function speakBuddy(text,withStudyPauses=false){
 if(!text)return;
 if(!("speechSynthesis" in window)){toast("Speech is not supported in this browser");return}
 window.speechSynthesis.cancel();
 try{window.speechSynthesis.resume()}catch(e){}
 const fo=$("#languageSelect")?.value==="Faroese (Føroyskt)";
 const voiceList=window.speechSynthesis.getVoices();
 const selectedVoice=store.get("buddy_voice","");
 const selected=voiceList.find(v=>v.voiceURI===selectedVoice);
 const matchesLanguage=v=>fo?/^(fo|da)(-|$)/i.test(v.lang):/^en(-|$)/i.test(v.lang);
 const preferred=(selected&&matchesLanguage(selected)?selected:null)||(fo?(voiceList.find(v=>/^fo(-|$)/i.test(v.lang))||voiceList.find(v=>/^da(-|$)/i.test(v.lang))):voiceList.find(v=>/^en(-|$)/i.test(v.lang)));
 const character=$("#buddyCharacter"),status=$("#buddyVoiceStatus"),pauseButton=$("#buddyVoicePause");
 const parts=withStudyPauses?String(text).split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean):[String(text)];
 let partIndex=0,stopped=false;
 buddyCurrentUtterance=null;
 const finish=()=>{character?.classList.remove("speaking");buddyCurrentUtterance=null;if(pauseButton)pauseButton.textContent="Ⅱ Pause";if(status)status.textContent=fo?"Trýst á knøttin fyri at hoyra Buddy aftur.":"Tap the button to hear Buddy again."};
 const speakPart=()=>{
  if(stopped||partIndex>=parts.length){finish();return}
  const part=parts[partIndex++];
  const utterance=new SpeechSynthesisUtterance(part);
  buddyCurrentUtterance=utterance;
  utterance.onstart=()=>{character?.classList.add("speaking");if(status)status.textContent=fo?"Buddy tosar nú…":"Buddy is speaking…"};
  utterance.onboundary=(event)=>{
   if(event.name!=="word")return;
   const activeStart=Number(event.charIndex)||0;
   document.querySelectorAll(".buddy-spoken-word.is-speaking").forEach(el=>el.classList.remove("is-speaking"));
   const box=buddyCurrentMessage;
   if(box){const span=[...box.querySelectorAll(".buddy-spoken-word")].find(el=>Number(el.dataset.start)<=activeStart&&Number(el.dataset.start)+el.textContent.length>activeStart);if(span)span.classList.add("is-speaking")}
  };
  utterance.lang=fo?"fo-FO":"en-US";if(preferred){utterance.voice=preferred;utterance.lang=preferred.lang}
  utterance.rate=Number($("#buddySpeechSpeed")?.value||store.get("buddy_speech_speed",0.92));utterance.pitch=1.02;
  utterance.onend=()=>{
   if(stopped)return;
   if(partIndex>=parts.length){finish();return}
   const next=parts[partIndex];
   const isVerse=/\b(?:Genesis|Exodus|Leviticus|Numbers|Deuteronomy|Joshua|Judges|Ruth|Samuel|Kings|Chronicles|Ezra|Nehemiah|Esther|Job|Psalms?|Proverbs|Ecclesiastes|Isaiah|Jeremiah|Ezekiel|Daniel|Matthew|Mark|Luke|John|Acts|Romans|Corinthians|Galatians|Ephesians|Philippians|Colossians|Thessalonians|Timothy|Titus|Philemon|Hebrews|James|Peter|Jude|Revelation)\s+\d{1,3}(?::\d{1,3})?/i.test(next);
   setTimeout(speakPart,isVerse?5000:2200);
  };
  utterance.onerror=()=>{stopped=true;finish();if(status)status.textContent=fo?"Røddin er ikki tøk á hesum telefonini.":"Voice is not available on this device."};
  window.speechSynthesis.speak(utterance);
 };
 speakPart();
}function loadBuddyVoices(){
 const select=$("#buddyVoiceSelect");if(!select||!("speechSynthesis"in window))return;
 const saved=store.get("buddy_voice","");
 const voices=window.speechSynthesis.getVoices();
 select.innerHTML='<option value="">Default iPhone voice</option>'+voices.map(v=>'<option value="'+esc(v.voiceURI)+'">'+esc(v.name+' ('+v.lang+')')+'</option>').join("");
 select.value=voices.some(v=>v.voiceURI===saved)?saved:"";
}
function applyBuddyAvatar(){
 const el=$("#buddyCharacter");if(!el)return;
 el.dataset.avatar=store.get("buddy_avatar","classic");
 const picker=$("#buddyAvatarSelect");if(picker)picker.value=el.dataset.avatar;
}
$("#buddyAvatarSelect")?.addEventListener("change",e=>{store.set("buddy_avatar",e.target.value);applyBuddyAvatar()});
$("#buddyVoiceSelect")?.addEventListener("change",e=>{store.set("buddy_voice",e.target.value);toast("Buddy voice saved")});
$("#buddyVoicePreview")?.addEventListener("click",()=>{const old=buddyLastSpeech;buddyLastSpeech=$("#languageSelect")?.value==="English"?"Hello! I'm Buddy.":"Hey! Eg eiti Buddy.";speakBuddy(buddyLastSpeech);buddyLastSpeech=old});
if("speechSynthesis"in window){loadBuddyVoices();window.speechSynthesis.onvoiceschanged=loadBuddyVoices}
applyBuddyAvatar();
$("#buddyVoiceToggle")?.addEventListener("click",()=>speakBuddy(buddyLastSpeech||$("#chatMessages .buddy-message:last-child")?.textContent||"Hi, I am Buddy!"));
$("#buddyVoicePause")?.addEventListener("click",()=>{
 if(!("speechSynthesis"in window))return;
 const button=$("#buddyVoicePause");
 if(window.speechSynthesis.paused){window.speechSynthesis.resume();button.textContent="Ⅱ Pause";$("#buddyVoiceStatus").textContent=$("#languageSelect")?.value!=="English"?"Buddy heldur fram…":"Buddy is continuing…";}
 else if(window.speechSynthesis.speaking){window.speechSynthesis.pause();button.textContent="▶ Resume";$("#buddyVoiceStatus").textContent=$("#languageSelect")?.value!=="English"?"Buddy er í steðgi.":"Buddy is paused.";}
});
$("#buddySpeechSpeed")?.addEventListener("change",e=>{store.set("buddy_speech_speed",Number(e.target.value));toast($("#languageSelect")?.value!=="English"?"Lesiferð goymd":"Reading speed saved")});
if($("#buddySpeechSpeed"))$("#buddySpeechSpeed").value=String(store.get("buddy_speech_speed",0.92));
$("#buddyVoiceStop")?.addEventListener("click",()=>{if("speechSynthesis"in window)window.speechSynthesis.cancel();buddyCurrentUtterance=null;$("#buddyCharacter")?.classList.remove("speaking");const pause=$("#buddyVoicePause");if(pause)pause.textContent="Ⅱ Pause";const status=$("#buddyVoiceStatus");if(status)status.textContent=$("#languageSelect")?.value!=="English"?"Røddin er steðgað.":"Voice stopped."});
// Safety guard: keep Buddy's replies suitable for a general audience.
function buddyReplyIsInappropriate(value){
 const text=String(value||"").toLowerCase();
 const patterns=[
  /\b(fuck|fucking|motherfucker|shit|bullshit|bitch|bastard|asshole|dickhead|cunt)\b/i,
  /\b(explicit sexual|pornographic|sexual instructions|graphic sexual)\b/i,
  /\bhow to (?:kill|murder|stab|shoot|poison|bomb|make an explosive)\b|\binstructions? (?:to|for) (?:kill|murder|attack|harm)\b|\bbuild (?:a bomb|an explosive)\b/i,
  /\b(threaten to kill|go kill yourself|you should kill yourself|racial superiority|ethnic cleansing)\b/i
 ];
 return patterns.some(pattern=>pattern.test(text));
}
function safeBuddyFallback(){
 return $("#languageSelect")?.value!=="English"
  ? "Eg vil fegin hjálpa, men eg kann ikki geva óhóskandi, kynsliga eksplisitt, hatursfullt ella skaðiligt innihald. Spyr meg heldur um Bíbliuna, trúgv, bøn ella eitt annað trygt evni."
  : "I’m here to help, but I can’t provide inappropriate, sexually explicit, hateful, or harmful content. I can still help with Bible questions, faith, prayer, or another safe topic.";
}
function extractBibleReferences(text){
 const bookNames=["Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth","1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra","Nehemiah","Esther","Job","Psalms?","Proverbs","Ecclesiastes","Song of Solomon","Song of Songs","Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos","Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah","Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians","2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians","2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James","1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation"];
 const pattern=new RegExp("\\b("+bookNames.join("|")+")\\s+\\d{1,3}(?::\\d{1,3}(?:[-–]\\d{1,3})?(?:,\\s*\\d{1,3}(?:[-–]\\d{1,3})?)*)?(?:\\s*[-–]\\s*\\d{1,3}(?::\\d{1,3})?)?","gi");
 return [...new Set((String(text).match(pattern)||[]).map(x=>x.replace(/\s+/g," ").trim()))];
}
document.querySelector("#chatMessages")?.addEventListener("click",event=>{
 const word=event.target.closest(".buddy-spoken-word");
 const message=word?.closest(".buddy-message");
 if(!word||!message)return;
 const full=message.dataset.buddySpeech||"";
 const start=Number(word.dataset.start)||0;
 if(full&&start<full.length){
  document.querySelectorAll(".buddy-spoken-word.is-speaking").forEach(el=>el.classList.remove("is-speaking"));
  speakBuddy(full.slice(start));
 }
});
let buddyBusy=false;
async function sendBuddy(t,mode="chat"){
 t=String(t||"").trim();if(!t||buddyBusy)return;
 const box=$("#chatMessages"),fo=$("#languageSelect")?.value!=="English";
 const user=document.createElement("div");user.className="chat-bubble user-message";user.textContent=t;box.append(user);
 const typing=document.createElement("div");typing.className="chat-bubble buddy-message";typing.textContent=fo?"Buddy svarar…":"Buddy is thinking…";box.append(typing);box.scrollTop=box.scrollHeight;
 buddyBusy=true;
 const form=$("#chatForm"),sendButton=form?.querySelector('button[type="submit"],button:not([type])');if(sendButton)sendButton.disabled=true;
 const system=fo
 ? "Tú eitur Buddy og ert ein blíður, hjálpsamur Bíbliu-lestrarhjálpari. Svara á føroyskum (føroyskt mál). Greið frá Bíbliuversum í greiðum máli, gev samanhang og nevna bók, kapittul og vers, tá tað er viðkomandi. Nevn neyvar bíbliu-tilvísingar natúrliga, tá tú vísir til ávís bíbliuørindi; legg ikki eina serliga tilvísingarlinju afturat, tá eingin ávís tilvísing er nevnd. Ver virðiligur móti kristnum trúarspurningum. Um tú ikki veitst nakað, sig tað. Finn ikki uppá beinleiðis Bíbliu-tilvitnanir. Tú ert ikki prestur ella gudfrøðiligur myndugleiki. Halt altíð innihaldið hóskandi fyri øll: brúka ikki banniorð, kynsliga eksplisitt innihald, hatursmál, happing, hóttanir, grafiskt harðskaparligt innihald ella vegleiðing til at skaða fólk. Um onkur biður um slíkt, nokta stutt og vinarliga og vend aftur til eitt trygt evni. Tú kanst greiða frá truplum bíbliusøgum á sakligan og ikki-grafiskan hátt."
 : "You are Buddy, a kind and helpful Bible study companion. Answer in clear English. Explain Bible passages with context, mention book, chapter and verse when relevant, and be respectful of Christian beliefs and different interpretations. Mention exact Bible references naturally when you cite specific passages; do not add a references footer when no specific passage is cited. Never invent a reference. If unsure, say so. Never invent direct Bible quotations. You are not a pastor or theological authority. Keep every reply suitable for a general audience: no profanity, sexually explicit content, hate speech, bullying, threats, graphic violence, or instructions for harming anyone. If asked for such content, briefly and kindly refuse and redirect to a safe topic. You may discuss difficult biblical events factually and non-graphically.";
 const modeInstruction=mode==="deep-study"
 ? (fo?" Hetta er ein djúp bíbliugransking: skriva eina væl skipaða, gjøgnumarbeidda greining við yvirskriftum fyri samanhang, tekstbygnað, høvuðstema, vers-fyri-vers frágreiðing har hóskandi, aðrar bíbliu-tilvísingar, tulkingar og praktiska nýtslu. Brúka umleið 500-800 orð, men ver greið/ur. Skil týðiliga millum tekst og tulking. Uppfinn ikki fakta ella sitat.":" This is a DEEP STUDY, not a normal chat reply. Give a thorough, structured study with headings: context and original audience, literary structure, key themes, verse-by-verse explanation where appropriate, connected passages, interpretive views, and practical application. Aim for 500-800 words when the passage supports it. Clearly separate what the text says from interpretation. Never invent facts or quotations.")
 : mode==="sermon" ? (fo?" Greina avskriftina gjølla, men greið og skipað.":" Analyze the transcript thoroughly but keep the breakdown clear and organized.")
 : (fo?" Halt vanlig svar stutt og greið, vanliga 2-5 setningar og í mesta lagi umleið 100 orð. Svara skjótt og beinleiðis. Kanna stavseting, føroyska málfrøði, bendingar og teknseting væl, áðrenn tú sendir svarið. Brúka natúrligt og rætt føroyskt; skriva ikki blandingsmál.":" Keep normal replies short and direct: usually 2-5 sentences and under 100 words. Answer quickly. Carefully proofread spelling, grammar, punctuation and capitalization before sending. Use natural, correct English; do not use typos, malformed words or awkward phrasing.") ;
 const history=[...box.querySelectorAll(".user-message,.buddy-message")].filter(el=>el!==typing).slice(-4).map(el=>({role:el.classList.contains("user-message")?"user":"assistant",content:el.textContent}));
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),60000);
 try{
  const response=await fetch("https://oai.endpoints.kepler.ai.cloud.ovh.net/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"Meta-Llama-3_3-70B-Instruct",messages:[{role:"system",content:system+modeInstruction},...history],max_tokens:mode==="deep-study"?2400:mode==="sermon"?1800:220,temperature:0.25,stream:false}),credentials:"omit",signal:controller.signal});
  const raw=await response.text();let data={};try{data=raw?JSON.parse(raw):{}}catch(e){throw new Error("The AI service sent an unreadable response (HTTP "+response.status+").")}
  if(!response.ok)throw new Error(data?.error?.message||data?.message||("AI service returned HTTP "+response.status));
  const message=data?.choices?.[0]?.message;
  let answer=message?.content;
  if(Array.isArray(answer))answer=answer.map(part=>typeof part==="string"?part:(part?.text||"")).join("");
  answer=typeof answer==="string"?answer.trim():"";
  if(!answer)throw new Error(data?.error?.message||("The AI returned no visible answer (finish reason: "+(data?.choices?.[0]?.finish_reason||"unknown")+"). Try again in a moment."));
  if(buddyReplyIsInappropriate(answer))answer=safeBuddyFallback();
  typing.dataset.buddySpeech=answer;
  renderBuddyWords(typing,answer);
  const tapHint=document.createElement("div");tapHint.className="buddy-tap-hint";tapHint.textContent=fo?"Trýst á eitt orð fyri at lurta umaftur haðani.":"Tap any word to replay from there.";
  typing.append(tapHint);
  const refs=extractBibleReferences(answer);
  if(refs.length){
   const refLine=document.createElement("div");refLine.className="buddy-reference-line";
   refLine.textContent=(fo?"Bíbliu-tilvísingar: ":"Bible references: ")+refs.join(", ");
   typing.append(refLine);
  }
  buddyLastSpeech=answer;
  buddyCurrentMessage=typing;
  // Automatically read every answer aloud; the Speak button remains available.
  speakBuddy(answer,mode==="deep-study"&&!!$("#deepStudyPauses")?.checked);
 }catch(error){
  console.error("Buddy AI connection:",error);
  const detail=error?.name==="AbortError"?"The request timed out after 60 seconds.":error?.message||"Network request failed.";
  typing.textContent=fo
   ?"Buddy fekk ikki svar frá AI-tænastuni. "+detail+" Kanna internetið og royn aftur."
   :"Buddy couldn't get a reply from the AI service. "+detail+" Check your internet connection and try again. If Safari reports a network/CORS error, the service must be connected through a server-side proxy.";
 }finally{
  clearTimeout(timeout);buddyBusy=false;if(sendButton)sendButton.disabled=false;
  $("#chatInput").value="";box.scrollTop=box.scrollHeight;
 }
}

function renderBuddySavedChats(){
 const list=$("#buddySavedChats");if(!list)return;
 const chats=store.get("buddy_saved_chats",[]);list.replaceChildren();
 if(!chats.length){const empty=document.createElement("p");empty.className="small-note";empty.textContent="No saved chats yet.";list.append(empty);return;}
 chats.slice().reverse().forEach(chat=>{
  const item=document.createElement("div");item.className="buddy-saved-item";
  const title=document.createElement("div");title.className="buddy-saved-item-title";
  title.textContent=chat.title+" · "+new Date(chat.savedAt).toLocaleString();
  const actions=document.createElement("div");actions.className="buddy-saved-item-actions";
  const open=document.createElement("button");open.type="button";open.className="secondary-btn";open.textContent="Open";
  open.addEventListener("click",()=>{const box=$("#chatMessages");box.replaceChildren();(chat.messages||[]).forEach(m=>{const bubble=document.createElement("div");bubble.className="chat-bubble "+(m.role==="user"?"user-message":"buddy-message");if(m.role==="buddy"){bubble.dataset.buddySpeech=m.text;renderBuddyWords(bubble,m.text)}else bubble.textContent=m.text;box.append(bubble)});box.scrollTop=box.scrollHeight;toast("Saved chat opened");});
  const del=document.createElement("button");del.type="button";del.className="secondary-btn danger-btn";del.textContent="Delete";
  del.addEventListener("click",()=>{const next=store.get("buddy_saved_chats",[]).filter(x=>x.id!==chat.id);store.set("buddy_saved_chats",next);renderBuddySavedChats();toast("Saved chat deleted");});
  actions.append(open,del);item.append(title,actions);list.append(item);
 });
}
$("#saveBuddyChat")?.addEventListener("click",()=>{
 const messages=[...$("#chatMessages").children].filter(el=>el.classList.contains("user-message")||el.classList.contains("buddy-message")).map(el=>({role:el.classList.contains("user-message")?"user":"buddy",text:el.dataset.buddySpeech||el.textContent.trim()})).filter(m=>m.text);
 if(!messages.length){toast("There is no chat to save yet");return;}
 const chats=store.get("buddy_saved_chats",[]);
 const first=messages.find(m=>m.role==="user")?.text||"Conversation with Buddy";
 chats.push({id:Date.now().toString(),title:first.slice(0,64),savedAt:new Date().toISOString(),messages});
 store.set("buddy_saved_chats",chats.slice(-30));renderBuddySavedChats();toast("Chat saved on this device");
});
$("#deleteBuddyChats")?.addEventListener("click",()=>{
 if(!confirm("Delete all saved past chats with Buddy? This cannot be undone."))return;
 store.set("buddy_saved_chats",[]);renderBuddySavedChats();toast("All saved past chats deleted");
});
renderBuddySavedChats();

$("#chatForm").addEventListener("submit",e=>{e.preventDefault();sendBuddy($("#chatInput").value)});$(".prompt-chip").forEach(b=>b.onclick=()=>sendBuddy(b.dataset.buddyPrompt||b.textContent));
 $(".buddy-tool-button").forEach(b=>b.addEventListener("click",()=>sendBuddy(b.dataset.buddyPrompt||b.textContent)));
const quiz=[["Who built the ark?",["Noah","Moses","David"],0],["Who defeated Goliath?",["Saul","David","Solomon"],1],["Where was Jesus born?",["Nazareth","Jerusalem","Bethlehem"],2],["Who was swallowed by a great fish?",["Jonah","Peter","Paul"],0],["What is the first book of the Bible?",["Exodus","Genesis","Psalms"],1]];let qi=0,answered=false,score=0;
function drawQuiz(){const q=quiz[qi];$("#quizProgress").textContent="QUESTION "+(qi+1)+" OF "+quiz.length;$("#quizQuestion").textContent=q[0];$("#quizAnswers").innerHTML=q[1].map((a,i)=>'<button class="quiz-answer" data-answer="'+i+'">'+a+'</button>').join("");$("#quizFeedback").textContent="";$("#quizNext").disabled=true;$("#quizNext").textContent=qi===quiz.length-1?"Finish quiz":"Next question";answered=false}
$("#quizAnswers").addEventListener("click",e=>{const b=e.target.closest("[data-answer]");if(!b||answered)return;answered=true;const chosen=+b.dataset.answer,correct=quiz[qi][2];if(chosen===correct){score++;$("#quizFeedback").textContent="Correct! Well done."}else $("#quizFeedback").textContent="Not quite. The answer is "+quiz[qi][1][correct]+".";$$(".quiz-answer").forEach((x,i)=>{if(i===correct)x.classList.add("correct");else if(i===chosen)x.classList.add("wrong")});$("#quizNext").disabled=false});
$("#quizNext").onclick=()=>{if(!answered)return;if(qi===quiz.length-1){$("#quizQuestion").textContent="You scored "+score+" out of "+quiz.length+"!";$("#quizAnswers").innerHTML="";$("#quizFeedback").textContent="Keep exploring the Bible.";$("#quizNext").textContent="Try again";$("#quizNext").onclick=()=>{qi=0;score=0;drawQuiz()};}else{qi++;drawQuiz()}};drawQuiz();
const planContent={hope:["Psalm 46:1","Romans 15:13","Isaiah 40:31","Jeremiah 29:11","Psalm 23:1","John 14:27","Romans 8:38–39"],jesus:["Luke 1","Luke 2","Matthew 3","Matthew 4","Mark 1","John 1","Matthew 5"],proverbs:Array.from({length:30},(_,i)=>"Proverbs "+(i+1))};
$$("[data-plan]").forEach(b=>b.onclick=()=>{const p=planContent[b.dataset.plan],el=$("#planDetail");el.classList.remove("hidden");el.innerHTML="<h3>"+b.parentElement.querySelector("h3").textContent+"</h3><p class='muted'>Suggested daily passages:</p><ol>"+p.map(x=>"<li>"+x+"</li>").join("")+"</ol><p class='small-note'>Mark each passage as read in your Bible app or printed Bible.</p>";el.scrollIntoView({behavior:"smooth",block:"nearest"})});
let recorder=null,chunks=[],startedAt=0,ticker=null;
let speechRecognition=null,liveTranscribing=false;
function speechRecognitionConstructor(){return window.SpeechRecognition||window.webkitSpeechRecognition||null}
function setTranscriptionStatus(message){const el=$("#liveTranscriptStatus");if(el)el.textContent=message}
function stopLiveTranscription(){
 liveTranscribing=false;
 try{speechRecognition?.stop()}catch(e){}
 $("#liveTranscribeStart")?.removeAttribute("disabled");
 const stop=$("#liveTranscribeStop");if(stop)stop.disabled=true;
}
$("#liveTranscribeStart")?.addEventListener("click",()=>{
 const SpeechRecognition=speechRecognitionConstructor();
 if(!SpeechRecognition){setTranscriptionStatus("Live transcription is not supported in this browser. Tap the transcript box and use the iPhone keyboard microphone for dictation.");toast("Use the iPhone keyboard microphone");return}
 if(liveTranscribing)return;
 speechRecognition=new SpeechRecognition();
 speechRecognition.continuous=true;speechRecognition.interimResults=true;
 speechRecognition.lang=$("#languageSelect")?.value==="English"?"en-US":"fo-FO";
 const box=$("#sermonTranscript");
 speechRecognition.onresult=event=>{
  let finalText="",interimText="";
  for(let i=event.resultIndex;i<event.results.length;i++){
   const phrase=event.results[i][0].transcript;
   if(event.results[i].isFinal)finalText+=phrase+" ";else interimText+=phrase;
  }
  if(finalText)box.value=(box.value.trim()?box.value.trim()+" ":"")+finalText.trim();
  setTranscriptionStatus(interimText?"Hearing: "+interimText:"Transcript updated. Keep speaking…");
 };
 speechRecognition.onerror=event=>{
  if(event.error==="not-allowed"||event.error==="service-not-allowed"){stopLiveTranscription();setTranscriptionStatus("Microphone or speech recognition permission was denied. Check Safari microphone permissions.");}
  else if(event.error==="language-not-supported"){stopLiveTranscription();setTranscriptionStatus("This device does not support speech recognition in this language. Try English or use iPhone keyboard dictation.");}
  else if(event.error!=="no-speech"){setTranscriptionStatus("Speech recognition stopped: "+event.error+". You can try again.");}
 };
 speechRecognition.onend=()=>{if(liveTranscribing){try{speechRecognition.start()}catch(e){stopLiveTranscription();setTranscriptionStatus("Live transcription stopped. Tap Start live transcription to try again.");}}};
 try{speechRecognition.start();liveTranscribing=true;$("#liveTranscribeStart").disabled=true;$("#liveTranscribeStop").disabled=false;setTranscriptionStatus("Listening… speak clearly. Your words will appear in the transcript box.");}
 catch(e){stopLiveTranscription();setTranscriptionStatus("Could not start speech recognition. Try again or use iPhone keyboard dictation.");}
});
$("#liveTranscribeStop")?.addEventListener("click",()=>{stopLiveTranscription();setTranscriptionStatus("Live transcription stopped. Your text is ready for Buddy.");});

$("#recordStart").onclick=async()=>{if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){toast("Recording is not supported in this browser");return}try{const stream=await navigator.mediaDevices.getUserMedia({audio:true});recorder=new MediaRecorder(stream);chunks=[];if(speechRecognitionConstructor()){$("#sermonTranscript").value="";$("#liveTranscribeStart")?.click()}else{setTranscriptionStatus("Automatic transcription is not supported here. You can use the microphone on your iPhone keyboard in the transcript box.")}recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};recorder.onstop=()=>{const blob=new Blob(chunks,{type:recorder.mimeType||"audio/webm"});const url=URL.createObjectURL(blob);const name=($("#languageSelect")?.value!=="English"?"Prædikuupptøka · ":"Sermon recording · ")+new Date().toLocaleString();const row=document.createElement("div");row.className="saved-item";const title=document.createElement("strong");title.textContent=name;const audio=document.createElement("audio");audio.controls=true;audio.src=url;row.append(title,audio);$("#recordingsList").prepend(row);stream.getTracks().forEach(t=>t.stop());$("#recordStatus").textContent="Recording saved for this session"};recorder.start();startedAt=Date.now();$("#recordStatus").textContent="Recording…";$("#recordOrb").classList.add("recording");$("#recordStart").disabled=true;$("#recordStop").disabled=false;ticker=setInterval(()=>{const n=Math.floor((Date.now()-startedAt)/1000);$("#recordTimer").textContent=String(Math.floor(n/60)).padStart(2,"0")+":"+String(n%60).padStart(2,"0")},500)}catch(e){toast("Microphone permission was not granted")}};
$("#recordStop").onclick=()=>{if(recorder?.state==="recording"){recorder.stop();if(liveTranscribing){stopLiveTranscription();setTranscriptionStatus("Recording and transcription stopped. Review the transcript below, then ask Buddy to break it down.")}clearInterval(ticker);$("#recordOrb").classList.remove("recording");$("#recordStart").disabled=false;$("#recordStop").disabled=true;$("#recordStatus").textContent="Finishing recording…"}};

$("#breakdownTranscript").onclick=()=>{
 const transcript=$("#sermonTranscript")?.value.trim();if(!transcript){toast("Add or transcribe a recording first");return}
 const fo=$("#languageSelect")?.value!=="English";
 const prompt=fo
 ? "Greið frá og brót henda upptikna boðskapin niður á føroyskum. Gev eitt stutt yvirlit, høvuðspunkt, allar Bíbliu-tilvísingar sum verða nevndar, greið frá týdninginum, møguligum misskiljingum og praktiskari nýtslu. Finn ikki uppá vers ella sitat. Um nakað er ógreitt í upptøkuni, sig tað. Her er avritið:\n\n"+transcript
 : "Break down this recorded message in clear English. Give a short summary, main points, every Bible reference mentioned, explain the meaning, note possible misunderstandings, and suggest practical application. Do not invent Bible verses or quotations. If something in the transcript is unclear, say so. Here is the transcript:\n\n"+transcript;
 page("buddy");sendBuddy(prompt);
};
$("#languageSelect").value=store.get("language","English");$("#languageSelect").onchange=e=>{store.set("language",e.target.value);toast("Language preference saved")};
$("#darkToggle").checked=store.get("dark",true);$("#darkToggle").onchange=e=>{store.set("dark",e.target.checked);document.body.classList.toggle("light-mode",!e.target.checked)};
if(!store.get("dark",true))document.body.classList.add("light-mode");
$("#exportData").onclick=()=>{const data={journal:store.get("journal"),prayers:store.get("prayers"),verses:store.get("verses")};const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="bible-buddy-notes.json";a.click();URL.revokeObjectURL(url);toast("Your notes export is ready")};
if("serviceWorker"in navigator&&location.protocol==="https:")window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(console.error));
page("home");


/* Bible Buddy in-app Bible reader */
(function(){
 const language=document.querySelector("#bibleLanguageSelect"),book=document.querySelector("#bookSelect"),chapter=document.querySelector("#chapterSelect"),area=document.querySelector("#readingArea"),highBtn=document.querySelector("#highlightMode");
 if(!language||!book||!chapter||!area)return;
 let highlightMode=false,translations=[],booksForTranslation=[],currentTranslation=null;
 const api="https://bible.helloao.org/api";
 const readHighlights=()=>{try{return JSON.parse(localStorage.getItem("bb_highlights")||"[]")}catch(e){return []}};
 const writeHighlights=a=>localStorage.setItem("bb_highlights",JSON.stringify(a));
 const escText=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 function renderHighlights(){const el=document.querySelector("#highlightedVerses");if(!el)return;const items=readHighlights();el.innerHTML=items.length?items.map(x=>"<div class='saved-item'><strong>"+escText(x.ref)+"</strong><p>"+escText(x.text)+"</p><button class='delete-btn' data-unhighlight='"+encodeURIComponent(x.key)+"'>Remove highlight</button></div>").join(""):"No highlighted verses yet."}
 function translationLabel(t){return (t.languageName||t.languageEnglishName||"Unknown language")+" — "+(t.name||t.englishName||t.id)+" ("+t.id+")"}
 const recentKey="bb_recent_bible_translations";
 const recentIds=()=>{try{return JSON.parse(localStorage.getItem(recentKey)||"[]")}catch(e){return []}};
 const rememberTranslation=id=>{const next=[id,...recentIds().filter(x=>x!==id)].slice(0,5);localStorage.setItem(recentKey,JSON.stringify(next))};
 const FAROESE_LINK="https://biblian.fo/";
 function addTranslationGroup(label,items){if(!items.length)return;const group=document.createElement("optgroup");group.label=label;items.forEach(t=>group.append(new Option(translationLabel(t),t.id)));language.append(group)}
 function renderFaroeseFallback(){area.innerHTML="<h2>Føroyska Bíblian</h2><p>The Faroese Bible is not currently included in the connected translation catalogue. You can read the Faroese Bible from the Faroese Bible Society here:</p><p><a class=\"primary-btn\" href=\""+FAROESE_LINK+"\" target=\"_blank\" rel=\"noopener\">Open Føroyska Bíblian</a></p><p class=\"small-note\">Bible Buddy keeps your English Bible and other available translations in the app. The Faroese Bible Society provides the Faroese edition.</p>"};
 function updateChapters(){chapter.innerHTML="";const selected=booksForTranslation.find(x=>x.id===book.value);if(!selected)return;for(let n=selected.firstChapterNumber||1;n<=(selected.lastChapterNumber||selected.numberOfChapters||1);n++)chapter.add(new Option("Chapter "+n,n))}
 async function loadBooks(){
  const id=language.value;
  if(id.startsWith("__EN_")){const code=id.replace("__EN_","").replace("__","");const links={ESV:"https://www.biblegateway.com/versions/English-Standard-Version-ESV-Bible/",KJV:"https://www.biblegateway.com/versions/King-James-Version-KJV-Bible/",NIV:"https://www.biblegateway.com/versions/New-International-Version-NIV-Bible/"};currentTranslation=null;area.innerHTML="<h2>"+code+"</h2><p>"+code+" is not available in the built-in Bible source yet. Open the translation online here:</p><p><a class='primary-btn' href='"+links[code]+"' target='_blank' rel='noopener'>Open "+code+"</a></p>";return}
  if(id==="__FAROESE_OFFICIAL__"){currentTranslation=null;renderFaroeseFallback();return}
  currentTranslation=translations.find(t=>t.id===id);if(!currentTranslation)return;
  rememberTranslation(id);
  area.innerHTML="<p class='muted'>Loading books for "+escText(currentTranslation.name||id)+"…</p>";
  try{
   const r=await fetch(api+"/"+encodeURIComponent(id)+"/books.json");if(!r.ok)throw new Error("Books unavailable");
   const data=await r.json();booksForTranslation=Array.isArray(data.books)?data.books:[];
   if(!booksForTranslation.length)throw new Error("No books in this translation");
   const previous=book.value;book.innerHTML="";
   booksForTranslation.forEach(x=>book.add(new Option(x.name||x.commonName||x.id,x.id)));
   book.value=booksForTranslation.some(x=>x.id===previous)?previous:booksForTranslation[0].id;
   updateChapters();await loadChapter();
  }catch(e){area.innerHTML="<p>Could not load this translation's book list. Please choose another translation or try again.</p>"}
 }
 async function loadChapter(){
  const tr=currentTranslation,b=booksForTranslation.find(x=>x.id===book.value),c=chapter.value;if(!tr||!b||!c)return;
  area.innerHTML="<p class='muted'>Loading "+escText(b.name||b.id)+" "+escText(c)+"…</p>";
  try{
   const r=await fetch(api+"/"+encodeURIComponent(tr.id)+"/"+encodeURIComponent(b.id)+"/"+encodeURIComponent(c)+".simple.json");
   if(!r.ok)throw new Error("Chapter unavailable");
   const data=await r.json(),content=data?.chapter?.content||[],verses=content.filter(x=>x.type==="verse"&&x.text!=null);
   if(!verses.length)throw new Error("No verse text returned");
   const reference=(data.book?.name||b.name||b.id)+" "+c,saved=readHighlights();
   const notice=tr.licenseNotice||"";
   area.innerHTML="<h2>"+escText(reference)+" · "+escText(tr.name||tr.id)+"</h2>"+verses.map(v=>{
    const num=v.number,key=tr.id+"|"+b.id+"|"+c+"|"+num,marked=saved.some(x=>x.key===key);
    return "<p class='bible-verse "+(marked?"verse-highlight":"")+"' data-verse='"+escText(num)+"' data-key='"+encodeURIComponent(key)+"'><sup>"+escText(num)+"</sup> "+escText(v.text)+"</p>";
   }).join("")+"<button type='button' class='secondary-btn' id='copyChapter'>Copy chapter</button><p class='small-note'>Turn on Highlighter, then tap a verse to save its highlight.</p>"+(notice?"<p class='small-note bible-license'>"+escText(notice)+"</p>":"")+(tr.licenseUrl?"<p class='small-note'><a href='"+escText(tr.licenseUrl)+"' target='_blank' rel='noopener'>Translation licence and attribution</a></p>":"");
   area.querySelectorAll(".bible-verse").forEach(p=>p.addEventListener("click",()=>{
    if(!highlightMode){toast("Turn on Highlighter to mark a verse");return}
    const key=decodeURIComponent(p.dataset.key),items=readHighlights(),idx=items.findIndex(x=>x.key===key);
    if(idx>=0){items.splice(idx,1);p.classList.remove("verse-highlight")}
    else{items.unshift({key,ref:reference+":"+p.dataset.verse,text:p.textContent.trim()});p.classList.add("verse-highlight")}
    writeHighlights(items);renderHighlights();
   }));
   document.querySelector("#copyChapter").onclick=()=>navigator.clipboard?.writeText(reference+"\n"+verses.map(v=>v.number+". "+v.text).join("\n")).then(()=>toast("Chapter copied")).catch(()=>toast("Copy unavailable"));
   renderHighlights();
  }catch(e){area.innerHTML="<h2>"+escText(b.name||b.id)+" "+escText(c)+"</h2><p>Could not load this chapter. Try another translation or check your internet connection.</p>"}
 }
 async function init(){
  area.innerHTML="<p class='muted'>Loading Bible translations…</p>";
  try{
   const r=await fetch(api+"/available_translations.json");if(!r.ok)throw new Error("Translation list unavailable");
   const data=await r.json();translations=Array.isArray(data.translations)?data.translations:[];
   if(!translations.length)throw new Error("No translations returned");
   language.innerHTML="";
   const byName=(x,y)=>(x.name||x.englishName||x.id).localeCompare(y.name||y.englishName||y.id);
   const english=translations.filter(t=>(t.language||"").toLowerCase()==="eng");
   const englishGroup=document.createElement("optgroup");englishGroup.label="English";
   const standardEnglish=english.find(t=>t.id==="BSB")||english[0];
   if(standardEnglish)englishGroup.append(new Option("English Bible ("+(standardEnglish.shortName||standardEnglish.id)+")",standardEnglish.id));
   [["KJV",/\\bKJV\\b|King James Version/i],["NIV",/\\bNIV\\b|New International Version/i]].forEach(([label,re])=>{const found=english.find(t=>re.test([t.id,t.name,t.shortName,t.englishName].join(" ")));if(found)englishGroup.append(new Option(label,found.id));});
   language.append(englishGroup);
   const recent=recentIds().map(id=>translations.find(t=>t.id===id)).filter(Boolean).filter(t=>!["eng","fao"].includes((t.language||"").toLowerCase()));
   const majorCodes=["spa","fra","fre","deu","ger","por","rus","ara","zho","chi","hin","jpn","kor","swa","ind","ita","nld","tur","urd","ben","tam","tha","vie"];
   const major=translations.filter(t=>majorCodes.includes((t.language||"").toLowerCase())&&!recent.some(r=>r.id===t.id)).sort((x,y)=>(x.languageName||"").localeCompare(y.languageName||"")||byName(x,y));
   const fao=translations.filter(t=>(t.language||"").toLowerCase()==="fao").sort(byName);
   const other=translations.filter(t=>!english.some(x=>x.id===t.id)&&!recent.some(x=>x.id===t.id)&&!major.some(x=>x.id===t.id)&&!fao.some(x=>x.id===t.id)).sort((x,y)=>(x.languageName||"").localeCompare(y.languageName||"")||byName(x,y));
   addTranslationGroup("Recent translations",recent);addTranslationGroup("Major languages",major);
   if(fao.length)addTranslationGroup("Faroese — Føroyskt",fao);else{const group=document.createElement("optgroup");group.label="Faroese — Føroyskt";group.append(new Option("Føroyska Bíblian (Faroese Bible Society)","__FAROESE_OFFICIAL__"));language.append(group)}
   addTranslationGroup("All other languages",other);
   language.value=standardEnglish?.id||englishGroup.querySelector("option")?.value||translations[0].id;
   await loadBooks();
  }catch(e){area.innerHTML="<p>Could not load the Bible translation catalogue. Check your connection and reload the page.</p>"}
 }
 language.addEventListener("change",loadBooks);
 book.addEventListener("change",()=>{updateChapters();loadChapter()});
 chapter.addEventListener("change",loadChapter);
 if(highBtn)highBtn.addEventListener("click",()=>{highlightMode=!highlightMode;highBtn.textContent="Highlighter: "+(highlightMode?"ON":"OFF");highBtn.classList.toggle("highlight-active",highlightMode);highBtn.setAttribute("aria-pressed",String(highlightMode));toast(highlightMode?"Tap a verse to highlight it":"Highlighter turned off")});
 document.addEventListener("click",e=>{const b=e.target.closest("[data-unhighlight]");if(!b)return;const key=decodeURIComponent(b.dataset.unhighlight);writeHighlights(readHighlights().filter(x=>x.key!==key));renderHighlights();loadChapter()});
 init();renderHighlights();
})();
/* Whole-app Faroese language layer */

/* Whole-app Faroese language layer */
(function(){
 const picker=document.querySelector("#languageSelect"); if(!picker)return;
 const pairs=[
 ["GROW IN THE WORD","VAKS Í GUDS ORÐI"],["YOUR DAILY TIME WITH GOD","TÍN DAGLIGA LØTA VIÐ GUD"],["Welcome back,","Vælkomin aftur,"],["friend.","vinur."],["A little time in the Word can change your whole day.","Ein løta í Orðinum kann broyta allan tín dag."],["VERSE OF THE DAY","DAGSINS BÍBLUORÐ"],["TODAY","Í DAG"],["Copy verse","Avrita vers"],["Save verse","Goym vers"],["YOUR STUDY SPACE","TÍTT BÍBLIULEGA"],["What would you like to do?","Hvat hevur tú hug at gera?"],["Read the Bible","Les Bíbliuna"],["Choose books and chapters","Vel bøkur og kapitlar"],["Ask Buddy","Spyr Buddy"],["Explore Bible questions","Kanna spurningar um Bíbliuna"],["Sermon recorder","Upptakari til prædikur"],["Record and keep messages","Taka upp og goyma boðskapir"],["My journal","Mín dagbók"],["Save what you learn","Goym tað, tú lærir"],["Prayer list","Bønarl listi"],["Keep your prayers close","Hav bønir tínar nær"],["Reading plans","Lesiætlanir"],["Build a daily habit","Skapa ein dagligan vana"],["Bible quiz","Bíbliuquiz"],["Test what you know","Royn tína vitan"],["Bible places","Bíbliustøð"],["Explore Bible locations","Kanna støð í Bíbliuni"],["SCRIPTURE LIBRARY","BÍBLIUSAVN"],["Read the","Les"],["Word.","Orðið."],["Choose a book and chapter to begin.","Vel eina bók og ein kapittul at byrja við."],["BIBLE LANGUAGE","MÁL Í BÍBLIUNI"],["English Bible (WEB)","Enska Bíblian (WEB)"],["Føroyska Bíblian (Faroese)","Føroyska Bíblian"],["BOOK OF THE BIBLE","BÍBLIUBÓK"],["CHAPTER","KAPITTUL"],["Highlighter: OFF","Merking: AV"],["Highlighter: ON","Merking: Á"],["Choose a chapter","Vel ein kapittul"],["The book and chapter navigator is ready.","Vel bók og kapittul fyri at byrja."],["Highlighted verses","Merkt vers"],["No highlighted verses yet.","Eingi merkt vers enn."],["Saved verses","Goymd vers"],["No saved verses yet.","Eingi goymd vers enn."],["YOUR BIBLE STUDY COMPANION","TÍN BÍBLIULEGI FELAGI"],["Talk with","Tosa við"],["Buddy.","Buddy."],["Ask questions, explore meaning and grow in faith.","Set spurningar, kanna týdningin og vaksa í trúnni."],["Hi, I'm Buddy!","Hey, eg eiti Buddy!"],["Choose a suggested topic or write a question to prepare your Bible study.","Vel eitt evni ella skriva ein spurning til bíbliulesturin."],["Explain John 3:16","Greið frá Jóhannes 3:16"],["Who was Moses?","Hvør var Móses?"],["Help me pray","Hjálp mær at biðja"],["Write a Bible question…","Skriva ein spurning um Bíbliuna…"],["KEEP THE MESSAGE","VARÐVEIT BOÐSKAPIN"],["Sermon","Prædiku"],["recorder.","upptakara."],["Record a sermon, speech or Bible study for later.","Taka eina prædiku, røðu ella bíbliulestur upp til seinni."],["Ready to record","Klárur at taka upp"],["Start recording","Byrja upptøku"],["Stop","Steðga"],["My recordings","Mínar upptøkur"],["No recordings saved yet.","Eingar upptøkur eru goymdar enn."],["REFLECT AND GROW","HUGLEIÐ OG VAKS"],["My","Mín"],["journal.","dagbók."],["Write down what God is teaching you.","Skriva niður, hvat Gud lærir teg."],["TITLE","HEITI"],["Today's reflection","Dagsins hugleiðing"],["YOUR NOTES","TÍNAR NOTUR"],["What stood out to you in today's reading?","Hvat legði tú serliga merki til í dagsins lesnaði?"],["Save journal entry","Goym dagbókarbrot"],["Past entries","Fyrru brotini"],["LET YOUR HEART SPEAK","LAT HJARTАÐ TALA"],["Prayer","Bøn"],["list.","listi."],["Keep track of what and who you are praying for.","Hav yvirlit yvir, hvat og hvørjum tú biður fyri."],["Add a prayer request…","Legg eina bøn aftrat…"],["Add","Legg aftrat"],["My prayers","Mínar bønir"],["A LITTLE EVERY DAY","LÍTIÐ HVØNN DAG"],["Reading","Lesi"],["plans.","ætlanir."],["Choose a path and spend time in Scripture.","Vel eina leið og brúka tíð í Skriftini."],["7 days of hope","7 dagar við vón"],["Short daily readings about hope in God.","Stuttir dagligir lesnaðir um vón í Gudi."],["Getting to know Jesus","Lær Jesus at kenna"],["Explore the life and teachings of Jesus.","Kanna lívið og læru Jesusar."],["30 days in Proverbs","30 dagar í Orðtøkunum"],["Wisdom for everyday life.","Vísdómur til gerandisdagin."],["Start","Byrja"],["Suggested daily passages:","Uppskot til dagligan lesnað:"],["LEARN AS YOU GO","LÆR, MEÐAN TÚ GONGUR"],["quiz.","quiz."],["A few questions to test your Bible knowledge.","Nakrir spurningar at royna tína bíbliuvitan."],["Who built the ark?","Hvør bygdi ørkina?"],["Who defeated Goliath?","Hvør sigraði á Goliat?"],["Where was Jesus born?","Hvar varð Jesus føddur?"],["Who was swallowed by a great fish?","Hvør varð svølgdur av einum stórum fiski?"],["What is the first book of the Bible?","Hvør er fyrsta bókin í Bíbliuni?"],["Noah","Nóa"],["Moses","Móses"],["David","Dávid"],["Saul","Saul"],["Solomon","Sálomon"],["Nazareth","Nasaret"],["Jerusalem","Jerúsalem"],["Bethlehem","Betlehem"],["Jonah","Jónas"],["Peter","Pætur"],["Paul","Paulus"],["Exodus","2. Mósebók"],["Genesis","1. Mósebók"],["Psalms","Sálmarnir"],["Correct! Well done.","Rætt! Væl klárað."],["Not quite. The answer is ","Ikki heilt. Svarið er "],["Keep exploring the Bible.","Halt fram at kanna Bíbliuna."],["Next question","Næsti spurningur"],["Finish quiz","Enda quiz"],["Try again","Royn aftur"],["EXPLORE THE BIBLE WORLD","KANNI BÍBLIULANDIÐ"],["places.","støð."],["Discover places connected to the stories of Scripture.","Uppdaga støð, sum hoyra til frásagnirnar í Skriftini."],["Central to many events in the life of Jesus.","Høvuðsstaður fyri nógvar hendingar í lívi Jesusar."],["The town where Jesus was born.","Býurin, har Jesus varð føddur."],["Where Jesus taught and called disciples.","Har Jesus lærdi og kallaði lærusveinar."],["Associated with Moses and the giving of the Law.","Knýtt at Mósesi og lógini, sum varð givin."],["MAKE IT YOURS","GER APPINA TIL TÍNA"],["App","App"],["settings.","stillingar."],["APP LANGUAGE","APP-MÁL"],["Your language choice is saved. Full translations still need to be added.","Títt málval verður goymt. Appin verður víst á valda málinum."],["Dark appearance","Myrkt útsjónd"],["Black, navy blue and gold theme","Svart, myrkablátt og gullitt snið"],["Your saved data","Tíni goymdu dáta"],["Export my notes","Útflyta mínar notur"],["Home","Heim"],["Bible","Bíblian"],["Record","Upptøka"],["Settings","Stillingar"],["Verse copied","Vers avritað"],["Verse saved","Vers goymt"],["Journal entry saved","Dagbókarbrot goymt"],["Prayer request added","Bøn løgd aftrat"],["Recording…","Tekur upp…"],["Recording saved for this session","Upptøkan er goymd í hesi løtuni"],["Microphone permission was not granted","Loyvi til mikrofon varð ikki givið"],["Your notes export is ready","Útflytingin av notunum er klár"],["Turn on Highlighter to mark a verse","Tendra merking fyri at merkja eitt vers"],["Tap a verse to highlight it","Trýst á eitt vers fyri at merkja tað"],["Highlighter turned off","Merking er sløkt"],["Loading English Bible chapter…","Les enska bíbliukapitlið inn…"],["Chapter copied","Kapittul avritað"],["Copy unavailable","Avritan er ikki tøk"],["Remove","Strika"],["Remove highlight","Strika merking"],["Faroese (Føroyskt)","Føroyskt"],["No prayer requests yet.","Eingir bønarspurningar enn."],["No journal entries yet.","Eingi dagbókarbrot enn."],["Your language choice is saved. Full translations still need to be added.","Títt málval er goymt. Appin verður víst á føroyskum."],["Allow microphone access when Safari asks. Keep this page open while recording.","Loyv mikrofoninum, tá Safari spyr. Lat síðuna vera opna, meðan tú tekur upp."],["Live AI answers and voice conversation require a secure AI service connection.","Svar frá AI og røddarsamrøða krevja eina trygga AI-tænastu."],["No recordings saved yet.","Eingar upptøkur eru goymdar enn."]
 ];
 pairs.push(["Ready to record","Klárur at taka upp"]);
 pairs.push(["Start recording","Byrja upptøku"]);
 pairs.push(["Recording…","Tekur upp…"]);
 pairs.push(["Finishing recording…","Ger upptøkuna lidna…"]);
 pairs.push(["Recording saved for this session","Upptøkan er goymd í hesi løtuni"]);
 pairs.push(["Microphone permission was not granted","Loyvi til mikrofon varð ikki givið"]);
 pairs.push(["Recording is not supported in this browser","Upptøka riggar ikki í hesum kaga"]);
 pairs.push(["Sermon recording · ","Prædikuupptøka · "]);
 pairs.push(["My recordings","Mínar upptøkur"]);
 pairs.push(["No recordings saved yet.","Eingar upptøkur eru goymdar enn."]);
 pairs.push(["I'm your Bible study companion. The live AI connection is not set up yet, so I can't honestly answer questions like an AI assistant just yet.","Eg eri tín bíbliulestrarfelagi. Sambandið til livandi AI er ikki sett upp enn, so eg kann ikki svara øllum spurningum sum ein AI enn."]);
 pairs.push(["Speak to me","Lat meg tosa"]);
 pairs.push(["Stop voice","Steðga rødd"]);
 pairs.push(["I can read my Bible explanations aloud.","Eg kann lesa frágreiðingarnar úr Bíbliuni hart."]);
 pairs.push(["Buddy is speaking…","Buddy tosar nú…"]);
 pairs.push(["Tap the button to hear Buddy again.","Trýst á knøttin fyri at hoyra Buddy aftur."]);
 pairs.push(["Voice is not available on this device.","Røddin er ikki tøk á hesum telefonini."]);
 pairs.push(["Voice stopped.","Røddin er steðgað."]);
 pairs.push(["YOUR BIBLE COMPANION","TÍN BÍBLIUFELAGI"]);
 const dict=Object.fromEntries(pairs);
 const bookNames={"Genesis":"1. Mósebók","Exodus":"2. Mósebók","Leviticus":"3. Mósebók","Numbers":"4. Mósebók","Deuteronomy":"5. Mósebók","Joshua":"Josva","Judges":"Dómararnir","Ruth":"Rut","1 Samuel":"1. Sámuelsbók","2 Samuel":"2. Sámuelsbók","1 Kings":"1. Kongabók","2 Kings":"2. Kongabók","Psalms":"Sálmarnir","Proverbs":"Orðtøkini","Isaiah":"Esaias","Jeremiah":"Jeremias","Matthew":"Matteus","Mark":"Markus","Luke":"Lukas","John":"Jóhannes","Acts":"Ápostlasøgan","Romans":"Rómverjabrævið","Galatians":"Galatiabrævið","Revelation":"Opinberingin"};
 const originals=new WeakMap();
 function translateText(n,fo){if(!originals.has(n))originals.set(n,n.nodeValue);const raw=originals.get(n),current=n.nodeValue,trim=raw.trim(),now=current.trim();let t=fo?(dict[trim]??dict[now]??bookNames[trim]??bookNames[now]??(/^Chapter \\d+$/.test(now)?"Kapittul "+now.split(" ").pop():(/^QUESTION \\d+ OF \\d+$/.test(now)?now.replace("QUESTION ","SPURNINGUR ").replace(" OF "," AV "):(/^You scored \\d+ out of \\d+!$/.test(now)?now.replace("You scored ","Tú fekkst ").replace(" out of "," av "):undefined)))):undefined;const next=t!==undefined?raw.replace(trim,t):(!fo?raw:current);if(current!==next)n.nodeValue=next;}
 function walk(node,fo){if(node.nodeType===3){translateText(node,fo);return;}if(node.nodeType!==1||node.matches("script,style"))return;
  for(const a of ["placeholder","aria-label","title"]){if(node.hasAttribute(a)){const k="data-en-"+a;if(!node.hasAttribute(k))node.setAttribute(k,node.getAttribute(a));node.setAttribute(a,fo?(dict[node.getAttribute(k)]||node.getAttribute(k)):node.getAttribute(k));}}
  if(node.tagName==="OPTION"){if(!node.hasAttribute("data-en-label"))node.setAttribute("data-en-label",node.textContent);const raw=node.getAttribute("data-en-label"),next=fo?(dict[raw]||bookNames[raw]||raw):raw;if(node.textContent!==next)node.textContent=next;}
  node.childNodes.forEach(c=>walk(c,fo));
 }
 function apply(){const fo=picker.value==="Faroese (Føroyskt)";document.documentElement.lang=fo?"fo":"en";walk(document.body,fo);
  document.querySelectorAll("#bookSelect option").forEach(o=>o.textContent=fo?(bookNames[o.value]||o.value):o.value);
 }
 picker.addEventListener("change",()=>{localStorage.setItem("bb_language",picker.value);apply()});
 const observer=new MutationObserver(rs=>{const fo=picker.value!=="English";rs.forEach(r=>{r.addedNodes.forEach(n=>walk(n,fo));if(r.type==="characterData")translateText(r.target,fo);});});
 observer.observe(document.body,{subtree:true,childList:true,characterData:true});
 picker.value=localStorage.getItem("bb_language")||"English";if(![...picker.options].some(o=>o.value===picker.value))picker.value="English";apply();
})();


/* Version 22: daily reading habit, chapter search and study notes */
(function(){
 const $=s=>document.querySelector(s);
 const isFo=()=>$("#languageSelect")?.value==="Faroese (Føroyskt)";
 const words={
  en:{streak:"Your reading streak",done:"Mark today's reading complete",days:"day streak",total:"chapters completed",search:"Search this chapter…",notes:"Chapter study notes",placeholder:"Write what stood out, questions, or what you want to remember…",save:"Save chapter notes",saved:"Notes saved on this device.",empty:"No notes saved for this chapter yet.",complete:"Today's reading marked complete!",already:"Today's reading is already complete.",noMatch:"No matching verses in this chapter."},
  fo:{streak:"Títt lesistrik",done:"Merk dagsins lesnað sum liðnan",days:"dagar á rað",total:"kapitlar lisnir",search:"Leita í hesum kapitlinum…",notes:"Notur til kapitlið",placeholder:"Skriva tað, sum gjørdi inntrykk, spurningar ella tað, tú vilt minnast…",save:"Goym notur til kapitlið",saved:"Notur eru goymdar á hesi telefonini.",empty:"Eingir notur eru goymdar til hetta kapitlið enn.",complete:"Dagsins lesnaður er merktur sum liðugur!",already:"Dagsins lesnaður er longu liðugur.",noMatch:"Einki vers samsvarar við leitingina."}
 };
 const t=k=>words[isFo()?"fo":"en"][k];
 const style=document.createElement("style");
 style.textContent=".bb-extra-card{background:linear-gradient(145deg,#101d32,#080e19);border:1px solid #263a58;border-radius:16px;padding:16px;margin:14px 0;color:#edf2fb}.bb-extra-card h3{margin:0 0 10px}.bb-extra-muted{color:#aab7ca;font-size:.88rem}.bb-extra-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.bb-extra-row input{flex:1;min-width:150px}.bb-extra-card textarea,.bb-extra-card input{box-sizing:border-box;width:100%;background:#070d18;color:#fff;border:1px solid #344763;border-radius:10px;padding:12px;margin:8px 0}.bb-extra-card button{margin:6px 0}.bb-extra-stats{display:flex;gap:18px;flex-wrap:wrap;margin:12px 0}.bb-extra-stat strong{display:block;color:#e0c27c;font-size:1.45rem}.bb-search-hidden{display:none!important}";
 document.head.append(style);
 const home=$("#home-page");
 if(home&&!$("#bbReadingStreak")){
  const card=document.createElement("section");card.id="bbReadingStreak";card.className="bb-extra-card";
  card.innerHTML='<h3 data-bb="streak"></h3><div class="bb-extra-stats"><div class="bb-extra-stat"><strong id="bbStreakCount">0</strong><span id="bbStreakDays"></span></div><div class="bb-extra-stat"><strong id="bbChapterCount">0</strong><span id="bbChapterLabel"></span></div></div><button class="primary-btn" id="bbMarkRead"></button><p class="bb-extra-muted">Your progress is saved privately on this device.</p>';
  const target=home.querySelector(".verse-card");if(target)target.after(card);else home.prepend(card);
 }
 const biblePanel=$("#readingArea")?.closest(".panel");
 if(biblePanel&&!$("#bbChapterTools")){
  const tools=document.createElement("div");tools.id="bbChapterTools";tools.className="bb-extra-card";
  tools.innerHTML='<h3 data-bb="notes"></h3><input id="bbChapterSearch" type="search" aria-label="Search this chapter"><textarea id="bbChapterNote" rows="4"></textarea><div class="bb-extra-row"><button type="button" class="secondary-btn" id="bbSaveChapterNote"></button><span id="bbNoteStatus" class="bb-extra-muted"></span></div><p id="bbNoSearchResults" class="bb-extra-muted" hidden></p>';
  const reading=$("#readingArea");reading.after(tools);
 }
 function currentKey(){return ($("#bookSelect")?.value||"Genesis")+"|"+($("#chapterSelect")?.value||"1")}
 function refreshLabels(){
  const fo=isFo();const streak=$("#bbReadingStreak");
  if(streak){streak.querySelector('[data-bb="streak"]').textContent=t("streak");$("#bbStreakDays").textContent=t("days");$("#bbChapterLabel").textContent=t("total");$("#bbMarkRead").textContent=t("done")}
  const tools=$("#bbChapterTools");
  if(tools){tools.querySelector('[data-bb="notes"]').textContent=t("notes");$("#bbChapterSearch").placeholder=t("search");$("#bbChapterNote").placeholder=t("placeholder");$("#bbSaveChapterNote").textContent=t("save")}
  refreshStreak();loadNote();filterVerses();
 }
 function dates(){try{return JSON.parse(localStorage.getItem("bb_read_days")||"[]")}catch(e){return []}}
 function refreshStreak(){
  const days=dates(),today=new Date();const key=today.toLocaleDateString("en-CA");let streak=0;
  const set=new Set(days);const cursor=new Date(today);
  if(!set.has(key))cursor.setDate(cursor.getDate()-1);
  while(set.has(cursor.toLocaleDateString("en-CA"))&&streak<400){streak++;cursor.setDate(cursor.getDate()-1)}
  if($("#bbStreakCount"))$("#bbStreakCount").textContent=streak;
  if($("#bbChapterCount"))$("#bbChapterCount").textContent=localStorage.getItem("bb_chapters_read_count")||"0";
 }
 $("#bbMarkRead")?.addEventListener("click",()=>{
  const today=new Date().toLocaleDateString("en-CA"),days=dates();
  if(days.includes(today)){toast(t("already"));return}
  days.push(today);localStorage.setItem("bb_read_days",JSON.stringify(days));
  localStorage.setItem("bb_chapters_read_count",String((Number(localStorage.getItem("bb_chapters_read_count"))||0)+1));
  refreshStreak();toast(t("complete"));
 });
 function loadNote(){
  const box=$("#bbChapterNote");if(!box)return;
  try{const notes=JSON.parse(localStorage.getItem("bb_chapter_notes")||"{}");box.value=notes[currentKey()]||"";$("#bbNoteStatus").textContent=box.value?t("saved"):t("empty")}catch(e){box.value=""}
 }
 $("#bbSaveChapterNote")?.addEventListener("click",()=>{
  try{const notes=JSON.parse(localStorage.getItem("bb_chapter_notes")||"{}");notes[currentKey()]=$("#bbChapterNote").value;localStorage.setItem("bb_chapter_notes",JSON.stringify(notes));$("#bbNoteStatus").textContent=t("saved");toast(t("saved"))}catch(e){toast("Could not save notes. Check device storage.")}
 });
 function filterVerses(){
  const input=$("#bbChapterSearch");if(!input)return;
  const q=input.value.trim().toLowerCase();let shown=0;
  $("#readingArea")?.querySelectorAll(".bible-verse").forEach(v=>{const match=!q||v.textContent.toLowerCase().includes(q);v.classList.toggle("bb-search-hidden",!match);if(match)shown++});
  const msg=$("#bbNoSearchResults");if(msg){msg.hidden=!q||shown>0;msg.textContent=t("noMatch")}
 }
 $("#bbChapterSearch")?.addEventListener("input",filterVerses);
 $("#bookSelect")?.addEventListener("change",()=>{setTimeout(()=>{loadNote();filterVerses()},250)});
 $("#chapterSelect")?.addEventListener("change",()=>{setTimeout(()=>{loadNote();filterVerses()},250)});
 $("#languageSelect")?.addEventListener("change",()=>setTimeout(refreshLabels,0));
 $("#bibleLanguageSelect")?.addEventListener("change",()=>setTimeout(()=>{loadNote();filterVerses()},500));
 refreshLabels();
})();


/* Version 23 features: reminders, deep study, audio Bible, timeline, voice chat, sermon analysis, cross references, study groups */
(function(){
 const $=s=>document.querySelector(s),fo=()=>$("#languageSelect")?.value!=="English";
 const say=(en,far)=>fo()?far:en;
 const style=document.createElement("style");
 style.textContent=".bb-timeline{padding-left:22px}.bb-timeline li{padding:8px 0 14px 8px;border-left:2px solid #344b6b}.bb-timeline li::marker{color:#d8b66d}.bb-timeline p{color:#aab7ca;margin:5px 0}.bb-group-item{padding:12px 0;border-bottom:1px solid #26364d}.bb-group-item:last-child{border:0}.bb-group-item p{white-space:pre-wrap;color:#aab7ca}.chat-form #buddyListenButton{min-width:44px;padding:8px}";
 document.head.append(style);

 // Daily reminder: local browser notification while app is open; not a background push service.
 const reminderTime=$("#dailyReminderTime"),reminderStatus=$("#dailyReminderStatus");
 if(reminderTime){reminderTime.value=localStorage.getItem("bb_daily_reminder_time")||"08:00";
  if(localStorage.getItem("bb_daily_reminder_enabled")==="yes")reminderStatus.textContent=say("Reminder is enabled for when the app is open.","Áminning er tendrað, tá appin er opin.");
 }
 let reminderTimer=null;
 function scheduleReminder(){
  clearTimeout(reminderTimer);if(localStorage.getItem("bb_daily_reminder_enabled")!=="yes")return;
  const [h,m]=(reminderTime.value||"08:00").split(":").map(Number),now=new Date(),next=new Date();next.setHours(h,m,0,0);if(next<=now)next.setDate(next.getDate()+1);
  reminderTimer=setTimeout(async()=>{const title=say("Time for your Bible reading","Tíð at lesa í Bíbliuni"),body=say("Open Bible Buddy for today's time in Scripture.","Lat Bible Buddy upp til dagsins bíbliulestur.");
   try{if("Notification"in window&&Notification.permission==="granted"){if(navigator.serviceWorker?.controller){const reg=await navigator.serviceWorker.ready;reg.showNotification(title,{body,icon:"./icon.svg",tag:"bb-daily-reading"});}else new Notification(title,{body});}}catch(e){}
   scheduleReminder();
  },Math.min(next-now,2147480000));
 }
 $("#enableDailyReminder")?.addEventListener("click",async()=>{
  if(!("Notification"in window)){reminderStatus.textContent=say("Notifications are not supported in this browser.","Fráboðanir eru ikki tøkar í hesum kaga.");return}
  const permission=Notification.permission==="granted"?"granted":await Notification.requestPermission();
  if(permission!=="granted"){reminderStatus.textContent=say("Notification permission was not granted. You can still set a reminder in your phone's Clock app.","Loyvi til fráboðan varð ikki givið.");return}
  localStorage.setItem("bb_daily_reminder_time",reminderTime.value||"08:00");localStorage.setItem("bb_daily_reminder_enabled","yes");scheduleReminder();
  reminderStatus.textContent=say("Daily reminder is set for "+reminderTime.value+" while the app is open. It cannot notify when the browser is fully closed.","Daglig áminning er sett til "+reminderTime.value+", meðan appin er opin. Hon kann ikki boða frá, tá kaga er heilt latin aftur.");
  toast(say("Daily reminder enabled","Daglig áminning tendrað"));
 });
 reminderTime?.addEventListener("change",()=>{localStorage.setItem("bb_daily_reminder_time",reminderTime.value);scheduleReminder()});
 scheduleReminder();

 // Audio Bible: uses the visible chapter text and device speech voices.
 let bibleUtterance=null;
 $("#audioBiblePlay")?.addEventListener("click",()=>{
  const verses=[...$("#readingArea").querySelectorAll(".bible-verse")].map(v=>{const copy=v.cloneNode(true);copy.querySelector("sup")?.remove();return copy.textContent.trim()});
  if(!verses.length){toast(say("Open an English Bible chapter first.","Lat fyrst ein enskan bíbliukapittul upp."));return}
  if(!("speechSynthesis"in window)){toast(say("Audio reading is not supported here.","Ljóðlesnaður er ikki tøkur her."));return}
  speechSynthesis.cancel();bibleUtterance=new SpeechSynthesisUtterance(verses.join(". "));
  const lang=fo()?"fo-FO":"en-US";bibleUtterance.lang=lang;
  const voices=speechSynthesis.getVoices();const match=voices.find(v=>v.lang.toLowerCase().startsWith(fo()?"fo":"en"));if(match)bibleUtterance.voice=match;
  bibleUtterance.onstart=()=>$("#audioBibleStatus").textContent=say("Reading chapter aloud…","Lesur kapittulin hart…");
  bibleUtterance.onend=()=>$("#audioBibleStatus").textContent=say("Finished reading.","Liðugur at lesa.");
  bibleUtterance.onerror=()=>$("#audioBibleStatus").textContent=say("This voice could not read the chapter. Try another device voice.","Henda røddin kundi ikki lesa kapittulin.");
  speechSynthesis.speak(bibleUtterance);
 });
 $("#audioBibleStop")?.addEventListener("click",()=>{speechSynthesis?.cancel();$("#audioBibleStatus").textContent=say("Audio stopped.","Ljóðlesnaður steðgaður.")});

 // Connected passages. Suggestions are curated links, not an exhaustive concordance.
 const related={
  "John 3:16":["Romans 5:8","1 John 4:9–10","John 3:17","Ephesians 2:4–5"],
  "Romans 8:28":["Genesis 50:20","Ephesians 1:11","Romans 8:18","James 1:2–4"],
  "Psalm 23:1":["John 10:11","Ezekiel 34:11–16","Philippians 4:19"],
  "Philippians 4:6":["Matthew 6:25–34","1 Peter 5:7","Psalm 55:22"],
  "Isaiah 41:10":["Deuteronomy 31:6","Joshua 1:9","Psalm 46:1"],
  "Galatians 2:20":["Romans 6:6–11","2 Corinthians 5:17","Colossians 3:3–4"],
  "Matthew 5:14":["John 8:12","Ephesians 5:8","Philippians 2:15"],
  "1 Corinthians 13:4":["1 John 4:7–8","Colossians 3:12–14","John 15:12–13"]
 };
 const cross=$("#connectedVerses");
 function renderRelated(ref){
  if(!cross)return;const list=related[ref]||[];
  cross.innerHTML="<strong>"+ref+"</strong><p class='small-note'>"+(list.length?say("Related passages to explore:","Sambundin brot at kanna:"):say("No curated links for this verse yet. Ask Buddy to find related passages.","Eingin listi er tøkur til hetta versið enn. Bið Buddy finna sambundin vers."))+"</p>";
  list.forEach(r=>{const b=document.createElement("button");b.type="button";b.className="secondary-btn";b.textContent=r;b.addEventListener("click",()=>openReference(r));cross.append(b)});
 }
 function openReference(ref){
  const match=ref.match(/^(.+?)\s+(\d+)(?::|$)/);if(!match){$("#chatInput").value="Explain "+ref+" and its context.";page("buddy");sendBuddy($("#chatInput").value);return}
  const books=[...$("#bookSelect").options].map(o=>o.value);const book=match[1],chapter=match[2];
  if(books.includes(book)){$("#bookSelect").value=book;$("#bookSelect").dispatchEvent(new Event("change"));$("#chapterSelect").value=chapter;$("#chapterSelect").dispatchEvent(new Event("change"));$("#bibleLanguageSelect").value="en";$("#bibleLanguageSelect").dispatchEvent(new Event("change"));page("bible");}
  else{page("buddy");sendBuddy("Explain "+ref+" in context.")}
 }
 $("#readingArea")?.addEventListener("click",e=>{
  const verse=e.target.closest(".bible-verse");if(!verse)return;
  const heading=$("#readingArea h2")?.textContent||"",ref=heading.split(" · ")[0]+" "+verse.dataset.verse;renderRelated(ref);
 });
 // Recommended study topics fill the study field.
 $("#deepstudy-page")?.addEventListener("click",e=>{
  const topic=e.target.closest("[data-study-topic]");if(!topic)return;
  $("#deepStudyPassage").value=topic.dataset.studyTopic;
  $("#deepStudyFocus").value="Full study";
  $("#deepStudyPassage").focus();
  toast(fo()?"Evnið er valt. Trýst á Granska við Buddy.":"Topic selected. Press Study with Buddy to begin.");
 });
 // Deep Bible study prompt
 $("#startDeepStudy")?.addEventListener("click",()=>{
  const passage=$("#deepStudyPassage").value.trim();if(!passage){toast(say("Enter a passage or topic first.","Skriva fyrst eitt bíbliuvers ella evni."));return}
  const focus=$("#deepStudyFocus").value;
  const prompt=fo()
   ?"Ger eina djúpa bíbliugransking á føroyskum av "+passage+". Høvuðsdentur: "+focus+". Greið frá samanhangi, hvørjum teksturin varð skrivaður til, bygnaði, høvuðsevnum, týdningi, sambondum við onnur bíbliuvers og praktiskari nýtslu. Tá tú umrøður eitt ávíst bíbliuvers, gev neyva tilvísing og endurgev sjálvt versið, tá tú kanst vátta orðingina. Merk sitat týðiliga og finn ikki uppá ella broyt Bíbliuorð. Skil millum tað, teksturin beinleiðis sigur, og tulkingar. Uppfinn ikki søguligar upplýsingar ella upprunamálsfrøðiligar upplýsingar. Sig frá, um tú ert óvissur."
   :"Create a careful deep Bible study of "+passage+". Focus: "+focus+". Explain literary and historical context, original audience, structure, key themes, meaning, connections to other passages, and practical application. Whenever you discuss a specific Bible verse, give its exact reference and include the verse wording when you can verify it; clearly label quotations and never invent or misquote Scripture. Distinguish what the text explicitly says from interpretation. Do not invent historical facts or original-language claims. Note uncertainty and mention significant interpretive differences fairly.";
  page("buddy");sendBuddy(prompt,"deep-study");
 });

 // Voice conversation: browser speech-to-text feeds Buddy; spoken answers use existing speech synthesis.
 let voiceRec=null,voiceActive=false;
 $("#buddyListenButton")?.addEventListener("click",()=>{
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  // iPhone Safari does not provide the Web Speech recognition API. Open the
  // keyboard so the user's built-in iOS Dictation microphone can be used.
  if(!SR){
   const input=$("#chatInput");
   if(input){input.focus();input.placeholder=say("Tap the microphone on your iPhone keyboard, speak, then tap Send.","Trýst á mikrofonina á knappaborðinum, tosa, og trýst síðani Send.");}
   toast(say("Use the microphone on your iPhone keyboard. Buddy will speak his reply aloud.","Brúka mikrofonina á iPhone-knappaborðinum. Buddy fer at svara við rødd."));
   return;
  }
  if(voiceActive){voiceRec?.stop();voiceActive=false;$("#buddyListenButton").textContent="🎙";return}
  voiceRec=new SR();voiceRec.lang=fo()?"fo-FO":"en-US";voiceRec.interimResults=false;voiceRec.continuous=false;
  voiceRec.onstart=()=>{voiceActive=true;$("#buddyListenButton").textContent="■";$("#chatInput").placeholder=say("Listening…","Lurti…")};
  voiceRec.onresult=e=>{const spoken=e.results?.[0]?.[0]?.transcript||"";if(spoken){$("#chatInput").value=spoken;sendBuddy(spoken)}};
  voiceRec.onerror=e=>{toast(say("Voice input stopped: ","Røddarinnlesing steðgaði: ")+e.error)};
  voiceRec.onend=()=>{voiceActive=false;$("#buddyListenButton").textContent="🎙";$("#chatInput").placeholder=say("Write a Bible question…","Skriva ein spurning um Bíbliuna…")};
  try{voiceRec.start()}catch(e){toast(say("Could not start the microphone.","Kundi ikki tendra mikrofonina."))}
 });

 // Sermon intelligence: strengthen the existing transcript breakdown without claiming audio-file transcription.
 const breakdown=$("#breakdownTranscript");
 if(breakdown)breakdown.onclick=()=>{
  const transcript=$("#sermonTranscript")?.value.trim();if(!transcript)return;
  const prompt=fo()
   ?"Greina henda prædikuavskrift á føroyskum. Gev: 1) stutt yvirlit, 2) høvuðspunkt og boðskap, 3) allar nevndar Bíbliu-tilvísingar, 4) frágreiðing av tekstunum í samanhangi, 5) týdningarmiklar niðurstøður, 6) spurningar til bólkakjak, 7) ítøkilig stig at brúka í gerandisdegnum, 8) bønarhugskot. Ger vart við ógreið orð í avskriftini. Uppfinn ikki tilvísingar ella sitat. Her er avskriftin:\n\n"+transcript
   :"Analyze this sermon transcript. Provide: 1) concise summary, 2) main points and central message, 3) every Bible reference mentioned, 4) explanation of the passages in context, 5) key takeaways, 6) discussion questions for a study group, 7) practical next steps, and 8) a short prayer idea. Flag unclear transcript wording. Never invent references or quotations. Transcript:\n\n"+transcript;
  page("buddy");sendBuddy(prompt,"sermon");
 };

 // Study groups are local-first. Share/export creates a portable text copy; no cloud sync is implied.
 function groupData(){try{return JSON.parse(localStorage.getItem("bb_study_groups")||"[]")}catch(e){return []}}
 function renderGroups(){
  const list=$("#studyGroupsList");if(!list)return;const groups=groupData();list.innerHTML="";
  if(!groups.length){list.textContent=say("No group studies saved yet.","Eingin bólkalesnaður goymdur enn.");return}
  groups.forEach((g,i)=>{const el=document.createElement("article");el.className="bb-group-item";const title=document.createElement("strong");title.textContent=g.name;const passage=document.createElement("p");passage.textContent=g.passage;const notes=document.createElement("p");notes.textContent=g.notes;const del=document.createElement("button");del.className="delete-btn";del.textContent=say("Delete","Strika");del.addEventListener("click",()=>{const a=groupData();a.splice(i,1);localStorage.setItem("bb_study_groups",JSON.stringify(a));renderGroups()});el.append(title,passage,notes,del);list.append(el)});
 }
 function currentGroup(){return {name:$("#groupName")?.value.trim()||"Bible study",passage:$("#groupPassage")?.value.trim()||"",notes:$("#groupNotes")?.value.trim()||"",updated:new Date().toISOString()}}
 $("#saveStudyGroup")?.addEventListener("click",()=>{const g=currentGroup();if(!g.passage&&!g.notes){toast(say("Add a passage or notes first.","Legg fyrst eitt vers ella notur aftrat."));return}const a=groupData();a.unshift(g);localStorage.setItem("bb_study_groups",JSON.stringify(a));renderGroups();toast(say("Study saved on this device.","Lesnaður goymdur á hesi telefonini."))});
 $("#shareStudyGroup")?.addEventListener("click",async()=>{
  const g=currentGroup();if(!g.passage&&!g.notes){toast(say("Add a passage or notes first.","Legg fyrst eitt vers ella notur aftrat."));return}
  const text="Bible Buddy study group: "+g.name+"\nPassage/topic: "+g.passage+"\n\nNotes and questions:\n"+g.notes;
  try{if(navigator.share)await navigator.share({title:g.name,text});else{await navigator.clipboard.writeText(text);toast(say("Study copied to clipboard.","Lesnaður avritaður."))}}catch(e){if(e.name!=="AbortError")toast(say("Could not share this study.","Kundi ikki deila lesnaðin."))}
 });
 renderGroups();

 // Buddy tutorial: first visit, spoken narration, all home categories, replay from Settings.
 const buddyCategories=["Bible","Buddy AI","Bible Study","Bible Adventures","Prayer and Worship","Wallpapers","Creativity","Settings","Bible Games","Community"];
 const buddyTutorialSteps=[
  {title:"Meet Buddy!",body:"Hi! I'm Buddy, your Bible study companion. I'll show you around Bible Buddy. You can ask me questions about God, Jesus and the Bible.",foTitle:"Hey! Eg eri Buddy.",foBody:"Eg eri tín bíbliufelagi. Eg vísi tær runt í Bible Buddy. Tú kanst spyrja meg um Gud, Jesus og Bíbliuna."},
  {title:"Talk with me",body:"Open Buddy AI to chat. Type a question and tap Send. You can also use the microphone or listen to my answers when your device supports speech.",foTitle:"Tosa við meg",foBody:"Opna Buddy AI fyri at kjatta. Skriva ein spurning og trýst á Send. Tú kanst eisini brúka mikrofonina ella lurta eftir svarunum, tá telefonin stuðlar talu."},
  {title:"Explore every category",body:"On Home, open a category to see its tools. Your categories are: "+buddyCategories.join(", ")+". Each category has different ways to read, learn, create, pray, play and connect.",foTitle:"Kanna allar bólkarnar",foBody:"Á Heim kanst tú lata ein bólk upp fyri at síggja amboðini. Bólkarnir eru: "+buddyCategories.join(", ")+". Hvør bólkur hevur ymisk amboð til lestur, læring, skapan, bøn, spøl og felagsskap."},
  {title:"Make it yours",body:"Open Settings to change the app language, choose Buddy's avatar and voice, customise colours, set reminders and replay this tutorial.",foTitle:"Ger appina til tína",foBody:"Opna Stillingar fyri at broyta app-mál, velja avatar og rødd hjá Buddy, tillaga litir, seta áminningar og síggja hesa vegleiðingina aftur."},
  {title:"You're ready!",body:"That's the tour! Tap Finish to start exploring. You can replay this tutorial any time from Settings.",foTitle:"Tú ert klár/ur!",foBody:"So er rundsýningin liðug! Trýst á Liðugt fyri at byrja. Tú kanst altíð síggja vegleiðingina aftur undir Stillingar."}
 ];
 let buddyTutorialStep=0;
 function buddyTutorialText(){
  const step=buddyTutorialSteps[buddyTutorialStep],far=fo();
  return {title:far?step.foTitle:step.title,body:far?step.foBody:step.body,lang:far?"fo-FO":"en-US"};
 }
 function speakBuddyTutorial(){
  const data=buddyTutorialText();
  if(!("speechSynthesis" in window)){toast(fallbackTutorialSpeech());return}
  window.speechSynthesis.cancel();
  const utterance=new SpeechSynthesisUtterance(data.body);
  utterance.lang=data.lang;utterance.rate=0.92;
  const voices=window.speechSynthesis.getVoices();
  const voice=voices.find(v=>data.lang==="fo-FO"?/^fo(-|$)/i.test(v.lang):/^en(-|$)/i.test(v.lang));
  if(voice)utterance.voice=voice;
  window.speechSynthesis.speak(utterance);
 }
 function fallbackTutorialSpeech(){return fo()?"Lurta er ikki tøkt í hesum kaga.":"Speech is not available in this browser."}
 function renderBuddyTutorialStep(){
  const data=buddyTutorialText();
  $("#buddyTutorialProgress").textContent=(buddyTutorialStep+1)+" / "+buddyTutorialSteps.length;
  $("#buddyTutorialTitle").textContent=data.title;
  $("#buddyTutorialText").textContent=data.body;
  $("#buddyTutorialBack").hidden=buddyTutorialStep===0;
  $("#buddyTutorialNext").textContent=buddyTutorialStep===buddyTutorialSteps.length-1?(fo()?"Liðugt":"Finish"):(fo()?"Næsta":"Next");
 }
 function showBuddyTutorial(){const modal=$("#buddyTutorial");if(!modal)return;buddyTutorialStep=0;renderBuddyTutorialStep();modal.hidden=false;}
 function closeBuddyTutorial(){const modal=$("#buddyTutorial");if(modal)modal.hidden=true;store.set("buddy_tutorial_seen",true);if("speechSynthesis" in window)window.speechSynthesis.cancel();}
 $("#buddyTutorialSkip")?.addEventListener("click",closeBuddyTutorial);
 $("#buddyTutorialBack")?.addEventListener("click",()=>{if(buddyTutorialStep>0){buddyTutorialStep--;renderBuddyTutorialStep();speakBuddyTutorial();}});
 $("#buddyTutorialNext")?.addEventListener("click",()=>{if(buddyTutorialStep<buddyTutorialSteps.length-1){buddyTutorialStep++;renderBuddyTutorialStep();speakBuddyTutorial();}else closeBuddyTutorial();});
 $("#buddyTutorialSpeak")?.addEventListener("click",speakBuddyTutorial);
 // Use delegated capture handling so the Settings control still works if other app scripts re-render sections.
 window.showBuddyTutorial=showBuddyTutorial;
 document.addEventListener("click",function(event){
  const trigger=event.target.closest("#replayBuddyTutorial");
  if(!trigger)return;
  event.preventDefault();
  event.stopPropagation();
  showBuddyTutorial();
 },true);
 document.addEventListener("keydown",function(event){
  if(event.key==="Enter"||event.key===" "){
   const trigger=event.target.closest&&event.target.closest("#replayBuddyTutorial");
   if(trigger){event.preventDefault();showBuddyTutorial();}
  }
 },true);
 if(!store.get("buddy_tutorial_seen",false))showBuddyTutorial();

 
})();
