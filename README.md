# Crunchyroll Auto-Skip

A tiny Chrome extension that clicks Crunchyroll's own **Skip Intro**, **Skip Credits** and **Skip Recap** buttons the moment they appear, and uses AniSkip timings when an episode has no button. The toolbar popup lets you choose which ones to auto-skip, and there's a master on/off switch. Settings sync through your Chrome profile.

## Install

1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and select this folder.
3. Pin the extension and use its popup to pick what to skip.

## No skip button? AniSkip fallback

When Crunchyroll shows no skip button, the extension uses community timings from [AniSkip](https://aniskip.com) and jumps the video past the segment itself. Turn this off in the popup with **Use AniSkip timings when there's no skip button**.

- The episode is matched to MyAnimeList through [AniList](https://anilist.co) using the series or season title from the page. This sends the title to AniList and the MyAnimeList ID, episode number and episode length to AniSkip. Nothing else leaves the browser.
- Only exact title matches count. Specials, oddly named seasons, and shows nobody has submitted timings for are simply not skipped.
- AniSkip only returns timings from videos of about the same length, so a differently cut version doesn't throw the skip off.
- Crunchyroll's own button still wins. The fallback waits one second into a segment and steps aside if a skip button is showing.

## Notes

- "Skip Credits" jumps past the credits like the real button does. Whether the next episode starts depends on Crunchyroll's own Autoplay setting.
- Buttons are recognised by their `data-testid` and label. English is the main target, and common German, French, Spanish, Portuguese, Italian and Russian labels are covered too.
- Each skip is logged to the page console as `[CR AutoSkip] skipped <type>`, with `(AniSkip)` added for fallback skips. The AniSkip lookup is logged too, as `[CR AutoSkip] AniSkip: MAL <id> ep <n>` or `no match`.
