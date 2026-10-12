// Clicks the player's own Skip Intro / Skip Credits / Skip Recap buttons
// for whichever types are enabled in the popup.
(() => {
  const DEFAULTS = { enabled: true, intro: true, credits: true, recap: true };

  const SKIP = /skip|überspringen|passer|saltar|salta|omitir|pular|пропуст/;
  // Checked in order: recap before credits before intro, so e.g.
  // "générique de fin" is credits rather than intro.
  const TYPES = [
    ["recap", /recap|récap|previously|zusammenfassung|resumen|riassunto|resumo|содержан/],
    ["credits", /credit|ending|outro|abspann|générique de fin|créditos|crediti|encerramento|титры|эндинг/],
    ["intro", /intro|opening|vorspann|générique|abertura|apertura|sigla|вступлен|опенинг/],
  ];

  let settings = { ...DEFAULTS };
  // Element -> type it was clicked as; cleared once the button hides again,
  // so a reused button is clicked again on its next appearance.
  const clicked = new Map();

  function signature(el) {
    const ids = [el, ...el.querySelectorAll("[data-testid]")]
      .map((node) => node.getAttribute("data-testid") || "")
      .join(" ");
    return `${ids} ${el.getAttribute("aria-label") || ""} ${el.textContent || ""}`.toLowerCase();
  }

  function classify(el) {
    const sig = signature(el);
    if (!SKIP.test(sig)) return null;
    for (const [type, pattern] of TYPES) if (pattern.test(sig)) return type;
    return null;
  }

  function isShown(el) {
    return (
      el.isConnected &&
      !el.disabled &&
      !el.closest('[aria-hidden="true"]') &&
      el.offsetWidth > 0 &&
      el.offsetHeight > 0
    );
  }

  function scan() {
    for (const el of clicked.keys()) if (!isShown(el)) clicked.delete(el);
    if (!settings.enabled || !document.querySelector("video")) return;

    for (const el of document.querySelectorAll('button, [role="button"]')) {
      if (!isShown(el)) continue;
      const type = classify(el);
      if (!type || !settings[type] || clicked.get(el) === type) continue;
      clicked.set(el, type);
      el.click();
      console.info("[CR AutoSkip] skipped", type);
    }
  }

  // Throttled rather than debounced: the player mutates the DOM constantly
  // while playing, which would keep pushing a debounce back forever.
  let pending = 0;
  function scheduleScan() {
    if (!pending) pending = setTimeout(() => ((pending = 0), scan()), 150);
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync") return;
    for (const [key, { newValue }] of Object.entries(changes)) settings[key] = newValue;
    scheduleScan();
  });

  chrome.storage.sync.get(DEFAULTS, (stored) => {
    settings = stored;
    new MutationObserver(scheduleScan).observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-hidden", "aria-label", "class", "style", "hidden"],
    });
    setInterval(scan, 1000);
    scan();
  });
})();
