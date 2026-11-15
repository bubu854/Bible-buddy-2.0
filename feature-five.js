(()=>{"use strict";
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const main=$(".app-shell"),grid=$("#home-page .feature-grid");
if(!main||!grid)return;
const page=(id,title,desc,body)=>{
 if($("#"+id+"-page"))return;
 const s=document.createElement("section");s.id=id+"-page";s.className="page bb-feature-page";
 s.innerHTML='<div class="page-heading"><p class="eyebrow">BIBLE BUDDY</p><h1>'+title+'</h1><p class="muted">'+desc+'</p></div>'+body;main.append(s);
};
const card=(id,icon,title,desc)=>{
 if([...grid.querySelectorAll("[data-page]")].some(x=>x.dataset.page===id))return;
 const b=document.createElement("button");b.type="button";b.className="feature-card";b.dataset.page=id;
 b.innerHTML='<span class="feature-icon">'+icon+'</span><strong>'+title+'</strong><small>'+desc+'</small>';grid.append(b);
};
const panel=(body)=>'<div class="panel">'+body+'</div>';
const btn=(id,label)=>'<button type="button" class="primary-btn" id="'+id+'">'+label+'</button>';
const inputStyle="style=\"width:100%;box-sizing:border-box;margin:8px 0\"";
page("factchecker","Bible <span>Fact Checker.</span>","Check common claims against Scripture and explore the context.",panel(
 '<label for="bbFactSelect">CHOOSE A CLAIM</label><select id="bbFactSelect" '+inputStyle+'><option value="0">“Money is the root of all evil.”</option><option value="1">“God helps those who help themselves.”</option><option value="2">“Jesus said, ‘Judge not’ means never correct anyone.”</option><option value="3">“The Bible says we will never face hardship.”</option><option value="4">“The love of money is a root of all kinds of evil.”</option></select><div id="bbFactResult" class="bb-note" aria-live="polite">Choose a claim and press Check claim.</div>'+btn("bbFactCheck","Check claim")+
 '<p class="small-note">This starter checker uses a small, reviewed set of examples. It is a study aid, not a replacement for reading the full passage or seeking wise pastoral guidance.</p>'
));
const facts=[
 {verdict:"Not an exact Bible quote",ref:"1 Timothy 6:10",detail:"The verse says the love of money is a root of all kinds of evil. It does not say that money itself is evil. Read the surrounding passage about contentment and the desire to become rich."},
 {verdict:"Not a Bible verse",ref:"Ephesians 2:8–10; Proverbs 3:5–6",detail:"This popular saying does not appear in Scripture. The Bible teaches both dependence on God's grace and faithful, responsible action."},
 {verdict:"Missing important context",ref:"Matthew 7:1–5; Galatians 6:1",detail:"Jesus warns against hypocritical judgement. Elsewhere Scripture encourages gentle restoration and wise discernment. Read the whole passage before drawing a conclusion."},
 {verdict:"Not what Scripture promises",ref:"John 16:33; James 1:2–4",detail:"Jesus tells his followers they will face trouble, while also offering peace and hope. The Bible promises God's presence, not a hardship-free life."},
 {verdict:"Supported by the passage",ref:"1 Timothy 6:10",detail:"This is close to the wording of many translations. Compare translations and read 1 Timothy 6:6–11 for the context."}
];
$("#bbFactCheck").onclick=()=>{const f=facts[Number($("#bbFactSelect").value)];$("#bbFactResult").innerHTML='<strong>'+f.verdict+'</strong><p>'+esc(f.detail)+'</p><p class="verse-ref">'+esc(f.ref)+'</p>';};
page("worldexplorer","Bible World <span>Explorer.</span>","Discover places connected to the Bible story.",panel(
 '<label for="bbPlaceSelect">EXPLORE A PLACE</label><select id="bbPlaceSelect" '+inputStyle+'><option value="0">Jerusalem</option><option value="1">Bethlehem</option><option value="2">Nazareth</option><option value="3">Jericho</option><option value="4">Capernaum</option><option value="5">Mount Sinai</option><option value="6">Ephesus</option><option value="7">Babylon</option></select><div id="bbPlaceInfo" class="bb-note" aria-live="polite"></div>'
));
const places=[
 ["Jerusalem","A central city in the biblical story. Jesus taught there, was crucified outside its walls, and rose again. References: Luke 19–24; Acts 2."],
 ["Bethlehem","The town where Jesus was born, fulfilling the prophecy associated with Micah. References: Micah 5:2; Luke 2:1–20."],
 ["Nazareth","The town where Jesus grew up. References: Matthew 2:19–23; Luke 4:16."],
 ["Jericho","A city associated with the story of Joshua and the healing of blind Bartimaeus. References: Joshua 6; Mark 10:46–52."],
 ["Capernaum","A town by the Sea of Galilee where Jesus taught and performed many healings. References: Mark 1–2; Matthew 9."],
 ["Mount Sinai","The mountain associated with Moses receiving the covenant and the Ten Commandments. References: Exodus 19–20."],
 ["Ephesus","An important city in Paul's ministry and the setting for the letter to the Ephesians. References: Acts 19; Ephesians 1."],
 ["Babylon","A powerful ancient city and empire in the Old Testament story, including the exile of Judah. References: 2 Kings 24–25; Daniel 1."]
];
const showPlace=()=>{const p=places[Number($("#bbPlaceSelect").value)];$("#bbPlaceInfo").innerHTML='<h3>'+p[0]+'</h3><p>'+esc(p[1])+'</p>';};
$("#bbPlaceSelect").onchange=showPlace;showPlace();
page("languageexplorer","Original Language <span>Explorer.</span>","Explore selected Hebrew and Greek Bible words.",panel(
 '<label for="bbWordSelect">CHOOSE A WORD</label><select id="bbWordSelect" '+inputStyle+'><option value="0">Agape — ἀγάπη</option><option value="1">Logos — λόγος</option><option value="2">Shalom — שָׁלוֹם</option><option value="3">Hesed — חֶסֶד</option><option value="4">Pistis — πίστις</option><option value="5">Charis — χάρις</option><option value="6">Ruach — רוּחַ</option><option value="7">Eirēnē — εἰρήνη</option></select><div id="bbWordInfo" class="bb-note" aria-live="polite"></div><p class="small-note">Word meanings can vary with context. These are short study summaries, not full lexical entries.</p>'
));
const words=[
 ["Agape (ἀγάπη)","Greek · love","Often describes self-giving love. See John 3:16 and 1 Corinthians 13."],
 ["Logos (λόγος)","Greek · word, message","Can mean a word, message or account. John 1 uses Logos as a title for Christ."],
 ["Shalom (שָׁלוֹם)","Hebrew · peace, wholeness","Can express peace, wellbeing and completeness. See Numbers 6:24–26."],
 ["Hesed (חֶסֶד)","Hebrew · steadfast love, loyalty","Often describes faithful covenant love and kindness. See Psalm 136."],
 ["Pistis (πίστις)","Greek · faith, trust, faithfulness","Its sense depends on context and can include trust or faithfulness. See Hebrews 11:1."],
 ["Charis (χάρις)","Greek · grace, favour","Often describes grace or generous favour. See Ephesians 2:8."],
 ["Ruach (רוּחַ)","Hebrew · wind, breath, spirit","The surrounding passage helps determine whether wind, breath or spirit is meant. See Genesis 1:2."],
 ["Eirēnē (εἰρήνη)","Greek · peace","Often means peace or wellbeing. See John 14:27."]
];
const showWord=()=>{const w=words[Number($("#bbWordSelect").value)];$("#bbWordInfo").innerHTML='<h3>'+w[0]+'</h3><strong>'+w[1]+'</strong><p>'+esc(w[2])+'</p>';};
$("#bbWordSelect").onchange=showWord;showWord();
page("lifecoach","Christian Life <span>Coach.</span>","Explore everyday situations with practical, Bible-based reflection.",panel(
 '<label for="bbLifeTopic">WHAT ARE YOU FACING?</label><select id="bbLifeTopic" '+inputStyle+'><option value="0">I am worried or anxious</option><option value="1">I am struggling to forgive</option><option value="2">I want to build better habits</option><option value="3">I had an argument with someone</option><option value="4">I feel left out or lonely</option><option value="5">I made a mistake</option></select>'+btn("bbLifeHelp","Give me some guidance")+'<div id="bbLifeResult" class="bb-note" aria-live="polite">Choose a situation to receive a short reflection and a practical next step.</div><p class="small-note">Buddy can support reflection, but it cannot replace trusted adults, qualified help or emergency support.</p>'
));
const coaching=[
 ["God invites you to bring your worries to him rather than carrying them alone.","Read Philippians 4:6–7. Take a slow breath, name one thing you are worried about, and talk with God and someone you trust."],
 ["Forgiveness can take time. It does not mean pretending the hurt did not happen or allowing someone to keep hurting you.","Read Ephesians 4:32. Ask God to help you take one safe step toward letting go. If you are being harmed, speak to a trusted adult."],
 ["Small, steady steps can help you grow. You do not have to change everything in one day.","Read Galatians 6:9. Choose one small habit for this week and decide when you will practise it."],
 ["Listening, honesty and gentleness can help repair a disagreement. You can take responsibility for your part without accepting blame for everything.","Read James 1:19. When it is safe, listen first and explain how you feel calmly."],
 ["Feeling left out can hurt, but it does not decide your worth. Look for one safe person you can connect with.","Read Psalm 27:10. Consider talking with a trusted friend, family member, teacher or church leader."],
 ["Everyone makes mistakes. You can be honest, ask forgiveness where needed and choose what to do differently next time.","Read 1 John 1:9. Take responsibility for one thing you can put right today."]
];
$("#bbLifeHelp").onclick=()=>{const x=coaching[Number($("#bbLifeTopic").value)];$("#bbLifeResult").innerHTML='<p>'+esc(x[0])+'</p><p><strong>Try this:</strong> '+esc(x[1])+'</p>';};
page("offlinebuddy","Offline Bible <span>Buddy.</span>","Prepare the app shell and study tools for times without internet.",panel(
 '<p>This saves the main Bible Buddy app files in your browser cache so the app shell and locally stored notes are more likely to remain available offline.</p>'+btn("bbOfflineSave","Prepare offline access")+' <button type="button" class="secondary-btn" id="bbOfflineClear">Clear offline app cache</button><p id="bbOfflineStatus" class="small-note" aria-live="polite">Bible translation downloads are not included in this starter offline pack. Open a chapter while online before travelling.</p>'
));
const offlineFiles=["./","./index.html","./style.css?v=53","./script.js?v=48","./community.js?v=12","./feature-pack.js","./feature-five.js","./category-home.js?v=73","./wallpaper-photo.js","./theme.js?v=2","./manifest.json"];
$("#bbOfflineSave").onclick=async()=>{
 const status=$("#bbOfflineStatus");status.textContent="Preparing offline files…";
 if(!("caches" in window)){status.textContent="Offline caching is not supported in this browser.";return;}
 try{const cache=await caches.open("bible-buddy-offline-v1");let done=0;
  for(const file of offlineFiles){try{const response=await fetch(file,{cache:"reload"});if(response.ok){await cache.put(file,response.clone());done++;}}catch{}}
  status.textContent="Saved "+done+" of "+offlineFiles.length+" app files. Previously loaded Bible chapters and notes may still depend on your browser's storage and translation source.";
 }catch(e){status.textContent="Could not prepare offline access: "+e.message;}
};
$("#bbOfflineClear").onclick=async()=>{if("caches" in window){await caches.delete("bible-buddy-offline-v1");$("#bbOfflineStatus").textContent="The Bible Buddy offline app cache was cleared.";}};
card("factchecker","✓","Bible Fact Checker","Check claims against Scripture");
card("worldexplorer","⌖","Bible World Explorer","Discover biblical places and history");
card("languageexplorer","文","Original Language Explorer","Explore Hebrew and Greek words");
card("lifecoach","♡","Christian Life Coach","Find Bible-based everyday guidance");
card("offlinebuddy","⇩","Offline Bible Buddy","Prepare app tools for offline use");
})();