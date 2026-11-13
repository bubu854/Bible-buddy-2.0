const content = document.getElementById("content");

const pages = {
  home: { title: "Welcome to Bible Buddy ❤️", description: "Spend time with God today." },
  bible: { title: "📖 Read the Bible", description: "Explore the Word of God. Bible reading tools are coming next." },
  buddy: { title: "🤖 Talk to Buddy", description: "Buddy is your Bible study companion. Ask about a chapter, verse, or Bible topic. Live AI chat needs a secure AI connection before it can answer." },
  record: { title: "🎙️ Sermon Recorder", description: "Your sermon recording tools will appear here. Recording support is being added." },
  daily: { title: "✨ Daily Verse", description: "“Be strong and courageous. Do not be afraid.” — Joshua 1:9" },
  journal: { title: "📓 My Journal", description: "Write down your thoughts and lessons from your Bible reading." },
  prayer: { title: "🙏 Prayer List", description: "Keep track of the people and things you are praying for." },
  quiz: { title: "🧠 Bible Quiz", description: "Test your Bible knowledge. Quiz activities are coming next." },
  plans: { title: "📅 Reading Plans", description: "Choose a Bible reading plan. Reading plans are coming next." },
  maps: { title: "🗺️ Bible Maps", description: "Explore places from the Bible. Maps are coming next." },
  settings: { title: "⚙️ Settings", description: "Language options (including Faroese and Bemba) and appearance settings are planned here." }
};

function showPage(page) {
  if (!content) return;
  const selected = pages[page] || pages.home;
  content.innerHTML = `
    <h2>${selected.title}</h2>
    <p>${selected.description}</p>
    ${page !== "home" ? '<button type="button" id="backHome">🏠 Back home</button>' : ""}
  `;
  const backButton = document.getElementById("backHome");
  if (backButton) backButton.addEventListener("click", () => showPage("home"));
}

document.addEventListener("click", event => {
  const button = event.target.closest("button[data-page]");
  if (button) showPage(button.dataset.page);
});

showPage("home");

if ("serviceWorker" in navigator && location.protocol === "https:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(error => {
      console.error("Bible Buddy service worker registration failed:", error);
    });
  });
}