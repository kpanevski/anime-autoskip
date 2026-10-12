const DEFAULTS = { enabled: true, intro: true, credits: true, recap: true, autoplay: true, aniskip: true };

const boxes = Object.keys(DEFAULTS).map((key) => document.getElementById(key));
const master = document.getElementById("enabled");

function syncDisabled() {
  for (const box of boxes) if (box !== master) box.disabled = !master.checked;
}

chrome.storage.sync.get(DEFAULTS, (settings) => {
  for (const box of boxes) box.checked = settings[box.id];
  syncDisabled();
});

for (const box of boxes) {
  box.addEventListener("change", () => {
    chrome.storage.sync.set({ [box.id]: box.checked });
    syncDisabled();
  });
}
