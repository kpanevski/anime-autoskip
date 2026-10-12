# Anime Auto-Skip

A tiny Chrome extension for Crunchyroll. It clicks the player's own **Skip Intro**, **Skip Credits** and **Skip Recap** buttons the moment they appear, and uses AniSkip timings when an episode has no button. It can also start the next episode automatically. The toolbar popup lets you choose which ones to auto-skip and whether to autoplay, and there's a master on/off switch. Settings sync through your Chrome profile.

> Unofficial. This project is not affiliated with, endorsed by or sponsored by Crunchyroll. "Crunchyroll" is a trademark of its owner and is used here only to say which site the extension works on.

## Install

1. Download `anime-autoskip-vX.Y.Z.zip` from the [latest release](https://github.com/kpanevski/anime-autoskip/releases/latest) and extract it somewhere permanent.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and select the extracted folder (the one with `manifest.json`).
4. Pin the extension and use its popup to pick what to skip.

`readme.txt` inside the zip has the same steps in more detail, plus how to update and uninstall.

## No skip button? AniSkip fallback

When Crunchyroll shows no skip button, the extension uses community timings from [AniSkip](https://aniskip.com) and jumps the video past the segment itself. Turn this off in the popup with **Use AniSkip timings when there's no skip button**.

- The episode is matched to MyAnimeList through [AniList](https://anilist.co) using the series or season title from the page. This sends the title to AniList and the MyAnimeList ID, episode number and episode length to AniSkip. Nothing else leaves the browser.
- Only exact title matches count. Specials, oddly named seasons, and shows nobody has submitted timings for are simply not skipped.
- AniSkip only returns timings from videos of about the same length, so a differently cut version doesn't throw the skip off.
- Crunchyroll's own button still wins. The fallback waits one second into a segment and steps aside if a skip button is showing.

## Notes

- "Skip Credits" jumps past the credits like the real button does.
- **Autoplay next episode** starts the next episode as soon as the current one ends, after any post-credits scene. Playback stopping or pausing in the last 10 seconds also counts as the end, because the player can stop short of the video's length without firing `ended`. It follows the "Next Episode" link under the player, or the player's own next button. If neither exists, it tries the Shift+N shortcut once.
- Buttons are recognised by their `data-testid` and label. English is the main target, and common German, French, Spanish, Portuguese, Italian and Russian labels are covered too.
- Each skip is logged to the page console as `[Anime Auto-Skip] skipped <type>`, with `(AniSkip)` added for fallback skips. The AniSkip lookup is logged too, as `[Anime Auto-Skip] AniSkip: MAL <id> ep <n>` or `no match`, and so is autoplay (`episode finished, opening next: …`). On load it logs `[Anime Auto-Skip] v<version> active` with your settings, which is a quick way to check the right version is running.

## License

[MIT](LICENSE)

## Releasing

1. Bump `version` in `manifest.json` and commit.
2. Tag the commit with the same version and push the tag:

   ```bash
   git tag v1.3.0 && git push origin main v1.3.0
   ```

The [release workflow](.github/workflows/release.yml) checks that the tag matches `manifest.json`, zips the extension with `git archive` (files marked `export-ignore` in `.gitattributes` stay out), and publishes a GitHub release with the zip attached.
