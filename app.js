const $ = (id) => document.getElementById(id);
const sidebar = $("sidebar");
const welcome = $("welcome");
const studioHeader = $("studioHeader");
const imagePanel = $("imagePanel");
const voicePanel = $("voicePanel");
const composerWrap = $("composerWrap");
const conversation = $("conversation");
const chatInput = $("chatInput");
let currentMode = "chat";
let toastTimer;

function toast(message) {
  const el = $("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
}
function setMode(mode) {
  currentMode = mode;
  sidebar.classList.remove("open");
  welcome.classList.toggle("hidden", mode !== "chat" || conversation.children.length > 0);
  studioHeader.classList.toggle("hidden", mode === "chat");
  imagePanel.classList.toggle("hidden", mode !== "image");
  voicePanel.classList.toggle("hidden", mode !== "voice");
  composerWrap.classList.toggle("hidden", mode !== "chat");
  conversation.classList.toggle("hidden", mode !== "chat" || conversation.children.length === 0);
  document.querySelectorAll(".nav-item").forEach(el => el.classList.toggle("active", el.dataset.mode === mode));
  const config = {
    image: ["▧", "IMAGE STUDIO", "Image studio", "Describe your idea and prepare it for image generation."],
    voice: ["♫", "VOICE STUDIO", "Voice studio", "Turn your script into a voice once a speech model is connected."]
  };
  if (mode !== "chat") {
    const c = config[mode];
    $("studioIcon").textContent = c[0];
    $("studioEyebrow").textContent = c[1];
    $("studioTitle").textContent = c[2];
    $("studioDescription").textContent = c[3];
  }
  document.querySelectorAll(".mode-card,.tool-btn,.nav-item").forEach(el => {
    if (el.dataset.mode) el.setAttribute("aria-pressed", String(el.dataset.mode === mode));
  });
}
document.querySelectorAll("[data-mode]").forEach(el => el.addEventListener("click", () => setMode(el.dataset.mode)));
$("openSidebar").addEventListener("click", () => sidebar.classList.add("open"));
$("closeSidebar").addEventListener("click", () => sidebar.classList.remove("open"));
$("newChat").addEventListener("click", () => {
  conversation.innerHTML = "";
  chatInput.value = "";
  setMode("chat");
  toast("New chat started");
});
$("settingsBtn").addEventListener("click", () => toast("Settings will be available in a future update."));

function addMessage(text, who) {
  const row = document.createElement("div");
  row.className = "message " + who;
  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.textContent = who === "user" ? "Y" : "Q";
  const body = document.createElement("div");
  body.className = "message-body";
  const label = document.createElement("div");
  label.className = "message-label";
  label.textContent = who === "user" ? "You" : "Quilt AI";
  const content = document.createElement("div");
  content.textContent = text;
  body.append(label, content);
  row.append(avatar, body);
  conversation.appendChild(row);
  conversation.classList.remove("hidden");
  welcome.classList.add("hidden");
  conversation.scrollTop = conversation.scrollHeight;
}
$("chatForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;
  addMessage(text, "user");
  chatInput.value = "";
  chatInput.style.height = "auto";
  setTimeout(() => addMessage("The Quilt AI interface is ready, but a chat model has not been connected yet. Next, connect your own model or a hosted inference endpoint in app.js to enable real AI replies.", "assistant"), 350);
});
chatInput.addEventListener("input", () => {
  chatInput.style.height = "auto";
  chatInput.style.height = Math.min(chatInput.scrollHeight, 180) + "px";
});
$("imageGenerate").addEventListener("click", () => {
  const prompt = $("imagePrompt").value.trim();
  if (!prompt) return toast("Please describe the image first.");
  $("imageResult").innerHTML = "";
  const title = document.createElement("strong");
  title.textContent = "Image request prepared";
  const desc = document.createElement("span");
  desc.textContent = `Style: ${$("imageStyle").value}. Your prompt is ready, but no image model is connected yet.`;
  const promptText = document.createElement("span");
  promptText.className = "prompt-preview";
  promptText.textContent = prompt;
  const art = document.createElement("div");
  art.className = "result-art";
  art.textContent = "✦";
  $("imageResult").append(art, title, desc, promptText);
  toast("Prompt prepared — connect an image model to generate.");
});
$("voiceGenerate").addEventListener("click", () => {
  const text = $("voiceText").value.trim();
  if (!text) return toast("Please enter text to speak first.");
  toast("Voice request prepared — connect a speech model to create audio.");
  const panel = document.querySelector(".audio-placeholder");
  panel.innerHTML = "";
  const wave = document.createElement("div");
  wave.className = "audio-wave";
  wave.textContent = "▂ ▄ ▆ ▃ ▇ ▄ ▂ ▅ ▃ ▆ ▂ ▄ ▇";
  const title = document.createElement("strong");
  title.textContent = "Voice request prepared";
  const desc = document.createElement("span");
  desc.textContent = `${$("voiceLanguage").value} · ${$("voiceType").value} voice. A connected TTS model is needed to produce audio.`;
  panel.append(wave, title, desc);
});