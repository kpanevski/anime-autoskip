// Clicks the player's own Skip Intro / Skip Credits / Skip Recap buttons
// for whichever types are enabled in the popup. When Crunchyroll has no
// button, falls back to community skip times from AniSkip.
(() => {
  const DEFAULTS = { enabled: true, intro: true, credits: true, recap: true, aniskip: true };

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

  const candidates = () => document.querySelectorAll('button, [role="button"]');

  function scan() {
    for (const el of clicked.keys()) if (!isShown(el)) clicked.delete(el);
    if (!settings.enabled || !document.querySelector("video")) return;

    for (const el of candidates()) {
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

  // --- AniSkip fallback ---

  let fallback = { path: null, duration: 0, segments: [], done: new Set() };

  // The watch page's JSON-LD carries the series, season and episode numbers.
  function readEpisode() {
    for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
      let data, path;
      try {
        data = JSON.parse(script.textContent);
        path = new URL(data["@id"] || data.url, location.href).pathname;
      } catch {
        continue;
      }
      // Skip stale metadata left over from the previous in-app page.
      if (data["@type"] !== "TVEpisode" || path !== location.pathname) continue;
      // "Alabasta (62-143) | E62 - …": the on-screen, often absolute, number.
      const absolute = /(?:^|\|)\s*E(\d+)(?![.\d])/.exec(data.name || "");
      return {
        series: data.partOfSeries?.name,
        season: data.partOfSeason?.name,
        seasonNumber: data.partOfSeason?.seasonNumber ?? 1,
        episode: data.episodeNumber,
        absolute: absolute ? Number(absolute[1]) : null,
      };
    }
    return null;
  }

  function loadFallback(video) {
    const episode = readEpisode();
    if (!episode?.series) return;
    const path = location.pathname;
    fallback = { path, duration: video.duration, segments: [], done: new Set() };
    const request = { type: "skip-times", episode: { ...episode, duration: video.duration } };
    try {
      chrome.runtime.sendMessage(request, (res) => {
        if (chrome.runtime.lastError || !res || fallback.path !== path) return;
        fallback.segments = res.segments;
        const match = res.target ? `MAL ${res.target.malId} ep ${res.target.episode}` : "no match";
        console.info("[CR AutoSkip] AniSkip:", match, res.segments);
      });
    } catch {
      // Extension was reloaded; this orphaned script can't reach it anymore.
    }
  }

  function onTimeUpdate(event) {
    const video = event.target;
    if (!(video instanceof HTMLVideoElement) || !settings.enabled || !settings.aniskip) return;
    if (fallback.path !== location.pathname) {
      // Ads are short; only look up real episodes.
      if (video.duration > 300) loadFallback(video);
      return;
    }
    // Ignore any other video (e.g. an ad) than the one we looked up.
    if (Math.abs(video.duration - fallback.duration) > 5) return;

    const t = video.currentTime;
    for (const seg of fallback.segments) {
      // The one-second grace lets Crunchyroll's own button go first.
      if (!settings[seg.type] || fallback.done.has(seg) || t < seg.start + 1 || t >= seg.end - 1) continue;
      fallback.done.add(seg);
      if ([...candidates()].some((el) => isShown(el) && classify(el))) continue;
      video.currentTime = seg.end;
      console.info("[CR AutoSkip] skipped", seg.type, "(AniSkip)");
    }
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
    // timeupdate doesn't bubble, but a capturing listener still sees it.
    document.addEventListener("timeupdate", onTimeUpdate, true);
  });
})();
