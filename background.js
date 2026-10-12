// Looks up community skip times from AniSkip for episodes where Crunchyroll
// shows no skip button. Lives here because both APIs are cross-origin.
const ANILIST = "https://graphql.anilist.co";
const ANISKIP = "https://api.aniskip.com/v2/skip-times";
// "mixed-op"/"mixed-ed" are left out on purpose: story continues under them.
const TYPES = { op: "intro", ed: "credits", recap: "recap" };

const normalize = (s) => (s || "").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

// AniList search, accepted only on an exact (normalized) title match so a
// fuzzy hit never maps an episode to the wrong show.
async function findAnime(title) {
  const query = `query ($search: String) {
    Page(perPage: 10) {
      media(search: $search, type: ANIME) { idMal episodes title { romaji english } synonyms }
    }
  }`;
  const res = await fetch(ANILIST, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ query, variables: { search: title } }),
  });
  if (!res.ok) return null;
  const media = (await res.json()).data?.Page.media || [];
  const want = normalize(title);
  return (
    media.find(
      (m) => m.idMal && [m.title.romaji, m.title.english, ...m.synonyms].some((t) => normalize(t) === want),
    ) || null
  );
}

const fits = (media, episode) =>
  episode >= 1 && (!media.episodes || episode <= media.episodes) ? { malId: media.idMal, episode } : null;

// Crunchyroll gives two numbers: `episode` counts within the season, while
// `absolute` is the "E25" shown on screen.
async function resolve({ series, season, seasonNumber, episode, absolute }) {
  // A season-specific entry ("JUJUTSU KAISEN Season 2") counts within the season.
  const seasonTitle = (season || "").replace(/\s*\([^)]*\b(dub|audio)\b[^)]*\)\s*$/i, "");
  if (seasonTitle && normalize(seasonTitle) !== normalize(series)) {
    const bySeason = await findAnime(seasonTitle);
    if (bySeason) return fits(bySeason, episode);
  }
  const bySeries = await findAnime(series);
  if (!bySeries) return null;
  if (seasonNumber <= 1) return fits(bySeries, episode);
  // A later season under the series entry only works with absolute numbering
  // (One Piece, Bleach); otherwise that entry is just season 1.
  return absolute && absolute !== episode ? fits(bySeries, absolute) : null;
}

async function skipTimes(ep) {
  const target = await resolve(ep);
  if (!target) return { target, segments: [] };
  const params = new URLSearchParams({ episodeLength: ep.duration });
  for (const type of Object.keys(TYPES)) params.append("types", type);
  // AniSkip only returns submissions whose episode length is close to ours,
  // which filters out timings from differently cut versions. 404 = none.
  const res = await fetch(`${ANISKIP}/${target.malId}/${target.episode}?${params}`);
  const results = res.ok ? (await res.json()).results || [] : [];
  const segments = results.map((r) => ({
    type: TYPES[r.skipType],
    start: r.interval.startTime,
    end: r.interval.endTime,
  }));
  return { target, segments };
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type !== "skip-times") return;
  skipTimes(msg.episode).then(sendResponse, (err) => {
    console.warn("[Anime Auto-Skip]", err);
    sendResponse({ target: null, segments: [] });
  });
  return true;
});
